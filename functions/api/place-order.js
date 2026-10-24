// Cloudflare Pages Function — POST /api/place-order
//
// The one place an order becomes real. Until this existed, the shop
// checkout recorded nothing: a cash-on-delivery order only ever posted
// the customer's contact details to /api/save-draft and then showed a
// confirmation, and a paid order only verified its signature. Nothing
// reached the sheet, nobody was emailed, and no WhatsApp went out —
// which is exactly what it looked like from the outside. The old
// EscapeGravity pre-order modal in escapegravity.html did all three,
// which is why this looked like something that had broken rather than
// something the newer checkout never had.
//
// Everything that moves money or gets recorded is computed here from
// the SKUs. The browser's totals are ignored.

import { priceCart, rupees } from './_catalog.js';

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const body = await request.json().catch(() => ({}));

    const name = String(body.name || '').trim().slice(0, 80);
    const phone = String(body.phone || '').trim().slice(0, 20);
    const address = String(body.address || '').trim().slice(0, 300);
    const city = String(body.city || '').trim().slice(0, 80);
    const pincode = String(body.pincode || '').trim().slice(0, 10);
    const state = String(body.state || '').trim().slice(0, 80);
    const payment = body.payment === 'cod' ? 'cod' : 'online';

    if (!name || !phone) return json({ error: 'Missing name or phone' }, 400);

    const priced = priceCart(body.items, body.coupon);
    if (!priced.lines.length) return json({ error: 'Cart is empty' }, 400);

    // A paid order is only called paid if Razorpay's signature says so.
    // An order that fails the check is still recorded — losing a real
    // order would be worse than recording a doubtful one — but it is
    // marked, so it can never be quietly shipped as if it were paid.
    let status = payment === 'cod' ? 'cod_pending' : 'paid';
    const paymentId = String(body.razorpay_payment_id || '').trim();
    if (payment === 'online') {
      const ok = await verifyRazorpay(env, body);
      if (!ok) status = 'unverified';
    }

    const ref = paymentId || ('COD-' + Date.now().toString(36).toUpperCase());
    const fullAddress = [address, city, pincode, state].filter(Boolean).join(', ');
    const itemText = priced.lines
      .map((l) => l.qty + ' x ' + l.name + ' (' + rupees(l.paise * l.qty) + ')')
      .join(', ');

    // Each channel is independent and none may sink the others: a
    // WhatsApp template that Meta has gone off, or a form endpoint
    // having a bad morning, must not lose the order. The result says
    // which ones got through, so a half-delivered order is visible
    // rather than silent.
    const [db, sheet, mail, waCustomer, waSeller] = await Promise.allSettled([
      recordOrder(env, { ref, status, payment, name, phone, fullAddress, priced, itemText }),
      pushToSheet(env, { name, phone, status, ref, itemText, total: priced.total, fullAddress }),
      emailSeller(env, { ref, status, payment, name, phone, fullAddress, itemText, priced }),
      whatsappCustomer(env, { phone, name, ref }),
      whatsappSeller(env, { name, ref })
    ]);

    const delivered = {
      recorded: ok(db), sheet: ok(sheet), email: ok(mail),
      whatsapp_customer: ok(waCustomer),
      /* Told apart on purpose: "off" means no seller number is set, and
         is not a failure. Reporting that as false once already sent
         someone hunting for a broken send that was never attempted. */
      whatsapp_seller: env.SELLER_WHATSAPP ? ok(waSeller) : 'off'
    };
    return json({ success: true, ref, status, total: priced.total, delivered });
  } catch (err) {
    return json({ error: 'Unexpected server error', details: String(err) }, 500);
  }
}

const ok = (r) => r.status === 'fulfilled' && r.value !== false;

/* ── The record ──────────────────────────────────────────────── */

async function recordOrder(env, o) {
  if (!env.DB) return false;
  await env.DB.prepare(
    'CREATE TABLE IF NOT EXISTS orders (' +
    'ref TEXT PRIMARY KEY, status TEXT, payment TEXT, name TEXT, phone TEXT, ' +
    'address TEXT, items TEXT, subtotal INTEGER, discount INTEGER, coupon TEXT, ' +
    'total INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
  ).run();
  await env.DB.prepare(
    'INSERT OR REPLACE INTO orders (ref, status, payment, name, phone, address, items, ' +
    'subtotal, discount, coupon, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(o.ref, o.status, o.payment, o.name, o.phone, o.fullAddress, o.itemText,
         o.priced.subtotal, o.priced.discount, o.priced.coupon, o.priced.total).run();
  return true;
}

/* ── The sheet ───────────────────────────────────────────────── */
// Posted through the same Google Form the EscapeGravity pre-order has
// always used, so orders land in the sheet already being watched. The
// form has three fields, which is fewer than an order has, so the
// third carries everything else. A form of its own with a column per
// field would be better; override the ids below if one is made.

async function pushToSheet(env, o) {
  const formId = env.ORDER_FORM_ID ||
    '1FAIpQLSd3biGQLvWYqNxXvwLJUqekETPWNx1-BnM1VH-UOX8meoOHcA';
  const fName = env.ORDER_FORM_NAME_FIELD || 'entry.1636497169';
  const fPhone = env.ORDER_FORM_PHONE_FIELD || 'entry.1301511467';
  const fNote = env.ORDER_FORM_NOTE_FIELD || 'entry.1152692251';

  const note = 'Order ' + o.ref + ' [' + o.status + '] ' + rupees(o.total) +
               ' — ' + o.itemText + ' — ' + o.fullAddress;
  const form = new URLSearchParams();
  form.set(fName, o.name);
  form.set(fPhone, o.phone);
  form.set(fNote, note);

  const res = await fetch(
    'https://docs.google.com/forms/d/e/' + formId + '/formResponse',
    { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString() });
  // Google answers a form post with a redirect or a 200; either means
  // the row went in. Only a 4xx/5xx is a real failure.
  return res.status < 400;
}

/* ── The seller's email ──────────────────────────────────────── */

async function emailSeller(env, o) {
  const to = env.ORDER_EMAIL || 'sahyujyahs@gmail.com';
  const form = new FormData();
  form.append('_subject', 'DeepKids order ' + o.ref + ' [' + o.status + ']: ' + o.name);
  form.append('name', o.name);
  form.append('whatsapp', o.phone);
  form.append('address', o.fullAddress || '—');
  form.append('items', o.itemText);
  form.append('amount', rupees(o.priced.total));
  if (o.priced.coupon) form.append('coupon', o.priced.coupon + ' (−' + rupees(o.priced.discount) + ')');
  form.append('payment', o.payment === 'cod' ? 'Cash on delivery' : 'Paid online');
  form.append('reference', o.ref);
  form.append('_template', 'table');
  form.append('_captcha', 'false');

  const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
    method: 'POST', headers: { Accept: 'application/json' }, body: form });
  return res.ok;
}

/* ── The messages ────────────────────────────────────────────── */
// order_complete is the only approved template that fits an order that
// has been placed, and it takes a name and a reference. The seller
// gets the same one, which reads a little oddly addressed to them but
// carries the two things worth waking up for: who ordered, and the
// reference to look up. A template written for the seller would be
// better and needs Meta's approval first.
//
// SELLER_WHATSAPP has to be the seller's own number, not the business
// number the WhatsApp API sends FROM — Meta will not deliver a message
// from a number to itself. The number in EG_WA_NUMBER across the site
// is the business one, so it cannot stand in for this.

async function sendTemplate(env, phone, params) {
  const token = env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId || !phone) return false;

  const res = await fetch('https://graph.facebook.com/v25.0/' + phoneNumberId + '/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: String(phone).replace(/[^\d]/g, ''),
      type: 'template',
      template: {
        name: 'order_complete',
        language: { code: 'en' },
        components: [{ type: 'body', parameters: params.map((t) => ({ type: 'text', text: String(t) })) }]
      }
    })
  });
  return res.ok;
}

function whatsappCustomer(env, o) { return sendTemplate(env, o.phone, [o.name, o.ref]); }

function whatsappSeller(env, o) {
  const seller = env.SELLER_WHATSAPP;
  if (!seller) return false;          // opt-in: set it in the Pages dashboard
  return sendTemplate(env, seller, [o.name, o.ref]);
}

/* ── Razorpay ────────────────────────────────────────────────── */

async function verifyRazorpay(env, body) {
  const secret = env.RAZORPAY_KEY_SECRET;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!secret || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign(
    'HMAC', key, enc.encode(razorpay_order_id + '|' + razorpay_payment_id));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex === razorpay_signature;
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
