import { sendMetaEvent } from './_meta.js';

// Cloudflare Pages Function — POST /api/create-order
// Creates a Razorpay order server-side. The KEY_SECRET never leaves this
// function — it's read from Cloudflare's encrypted environment variables
// (set in the Pages dashboard, NOT committed to the repo).

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const keyId = env.RAZORPAY_KEY_ID;
    const keySecret = env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return json({ error: 'Razorpay credentials not configured' }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const amount = Number(body.amount);

    if (!Number.isInteger(amount) || amount < 100) {
      return json({ error: 'Invalid amount — must be an integer in paise, minimum 100' }, 400);
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        receipt: body.receipt || ('order_rcptid_' + Date.now())
      })
    });

    if (res.status === 401) {
      return json({ error: 'Razorpay authentication failed' }, 401);
    }
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return json({ error: 'Razorpay order creation failed', details: errText }, 500);
    }

    const order = await res.json();
    // Server-side InitiateCheckout for Meta CAPI — deduped against the
    // browser pixel via the shared capi_event_id. Runs after the
    // response is sent; cannot delay or break the order flow.
    context.waitUntil(sendMetaEvent(context, {
      name: 'InitiateCheckout',
      id: body.capi_event_id,
      phone: body.phone,
      value: amount / 100
    }));
    return json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    return json({ error: 'Unexpected server error', details: String(err) }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
