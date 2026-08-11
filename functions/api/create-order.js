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

    // Price is computed server-side so the charged amount can never be
    // tampered with from the browser. The client's `amount` is ignored,
    // and so is any price it sends per line — only the SKU is trusted.
    // `preorder` says whether it has shipped yet; `off` is the discount.
    // They were one thing until SCI. launched, which would have jumped
    // its price the moment it started shipping. Must stay identical to
    // the CATALOG in /cart.js or the charge won't match the cart.
    const CATALOG = {
      'EG-001':  { name: 'EscapeGravity',           paise: 499900, preorder: false },
      'SCI-001': { name: 'SCI. Trading Cards',      paise: 119900, preorder: false, off: 0.15 },
      'EVO-001': { name: 'The Story Of Evolution',  paise: 249900, preorder: true  }
    };
    const PREORDER_OFF = 0.15;               // 15% off anything not yet shipping
    const BASE_AMOUNT = CATALOG['EG-001'].paise;
    const COUPONS = { 'EG200': 20000 };      // code (UPPERCASE) -> paise off
    const coupon = String(body.coupon || '').trim().toUpperCase();
    const discount = (coupon && COUPONS[coupon]) ? COUPONS[coupon] : 0;
    const couponApplied = discount ? coupon : '';

    // A cart of {sku, qty} if the shop sent one; otherwise the original
    // single-EscapeGravity path, so /order and the homepage keep working.
    let subtotal = BASE_AMOUNT;
    let lines = [{ sku: 'EG-001', name: CATALOG['EG-001'].name, qty: 1, paise: BASE_AMOUNT }];
    if (Array.isArray(body.items) && body.items.length) {
      lines = [];
      subtotal = 0;
      for (const raw of body.items.slice(0, 20)) {
        const sku = String(raw && raw.sku || '').trim().toUpperCase();
        const item = CATALOG[sku];
        if (!item) continue;                                   // unknown SKU: ignored, never charged
        const qty = Math.min(Math.max(parseInt(raw.qty, 10) || 1, 1), 10);
        // Rounded to whole rupees so the charged total matches the cart
        // the visitor was shown, to the paisa.
        const off = item.off != null ? item.off : (item.preorder ? PREORDER_OFF : 0);
        const unit = Math.round(item.paise * (1 - off) / 100) * 100;
        subtotal += unit * qty;
        lines.push({ sku, name: item.name, qty, paise: unit });
      }
      if (!lines.length) return json({ error: 'Cart is empty or contains no valid items' }, 400);
    }
    const amount = Math.max(subtotal - discount, 100);

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
    return json({ order_id: order.id, amount: order.amount, currency: order.currency,
                   coupon: couponApplied, discount: discount, subtotal: subtotal, items: lines });
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
