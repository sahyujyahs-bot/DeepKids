import { sendMetaEvent } from './_meta.js';

// Cloudflare Pages Function — POST /api/verify-payment
// Verifies the Razorpay payment signature server-side using the KEY_SECRET,
// which never reaches the browser. Only marks a payment as valid if the
// HMAC-SHA256 signature matches exactly.

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const keySecret = env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return json({ error: 'Razorpay credentials not configured' }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json({ error: 'Missing required fields' }, 400);
    }

    const expectedSignature = await hmacSha256Hex(keySecret, `${razorpay_order_id}|${razorpay_payment_id}`);

    if (expectedSignature !== razorpay_signature) {
      return json({ verified: false, error: 'Signature mismatch' }, 400);
    }

    // Server-side Purchase for Meta CAPI — the authoritative conversion,
    // deduped against the browser pixel via event_id = payment id.
    context.waitUntil(sendMetaEvent(context, {
      name: 'Purchase',
      id: razorpay_payment_id,
      phone: body.phone,
      value: 2499
    }));
    return json({ verified: true });
  } catch (err) {
    return json({ error: 'Unexpected server error', details: String(err) }, 500);
  }
}

async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
