/* Exercises /api/place-order with every outbound call stubbed, so the
   logic can be checked without touching Razorpay, Meta, Google or the
   seller's inbox. */
import { onRequestPost } from '/home/user/DeepKids/functions/api/place-order.js';
import crypto from 'node:crypto';

const SECRET = 'test_secret';
const calls = [];
globalThis.fetch = async (url, opt) => {
  calls.push({ url: String(url), body: opt && opt.body });
  return { ok: true, status: 200, json: async () => ({}), text: async () => '' };
};

const db = { rows: [] };
const env = {
  DB: { prepare: (sql) => ({
        bind: (...a) => ({ run: async () => { db.rows.push({ sql, a }); return {}; } }),
        run: async () => ({}) }) },
  RAZORPAY_KEY_SECRET: SECRET,
  WHATSAPP_ACCESS_TOKEN: 'tok', WHATSAPP_PHONE_NUMBER_ID: '123',
  SELLER_WHATSAPP: '+919999999999'
};

const post = (body) => onRequestPost({ env, request: { json: async () => body } });
const customer = { name: 'Jane', phone: '+919876543210', address: 'Flat 1',
                   city: 'Bengaluru', pincode: '560001', state: 'KA' };

function head(t) { calls.length = 0; db.rows.length = 0; console.log('\n' + t); }

/* 1. A cash-on-delivery order */
head('COD order, two products');
let r = await (await post({ ...customer, payment: 'cod',
  items: [{ sku: 'EG-001', qty: 1 }, { sku: 'SCI-001', qty: 2 }] })).json();
console.log('  total      ', r.total, '(expect 628700 = 424900 + 2x101900)');
console.log('  status/ref ', r.status, r.ref);
console.log('  delivered  ', JSON.stringify(r.delivered));
console.log('  wrote to db', db.rows.some(x => /INSERT OR REPLACE INTO orders/.test(x.sql)));
for (const c of calls) console.log('  called     ', c.url.replace(/\?.*/, '').slice(0, 72));

/* 2. The browser lying about price */
head('Client-supplied prices and totals are ignored');
r = await (await post({ ...customer, payment: 'cod', amount: 1, total: 1,
  items: [{ sku: 'EG-001', qty: 1, paise: 1, price: 1 }] })).json();
console.log('  total      ', r.total, '(expect 424900, not 1)');

/* 3. An unknown SKU */
head('Unknown SKU is dropped, not guessed at');
r = await (await post({ ...customer, payment: 'cod',
  items: [{ sku: 'EG-001', qty: 1 }, { sku: 'FREE-STUFF', qty: 99 }] })).json();
console.log('  total      ', r.total, '(expect 424900)');

/* 4. Paid, with a real signature and with a forged one */
const sign = (o, p) => crypto.createHmac('sha256', SECRET).update(o + '|' + p).digest('hex');
head('Paid order, genuine Razorpay signature');
r = await (await post({ ...customer, payment: 'online', items: [{ sku: 'EVO-001', qty: 1 }],
  razorpay_order_id: 'order_X', razorpay_payment_id: 'pay_X',
  razorpay_signature: sign('order_X', 'pay_X') })).json();
console.log('  status     ', r.status, '(expect paid)');

head('Paid order, forged signature');
r = await (await post({ ...customer, payment: 'online', items: [{ sku: 'EVO-001', qty: 1 }],
  razorpay_order_id: 'order_X', razorpay_payment_id: 'pay_X',
  razorpay_signature: 'deadbeef' })).json();
console.log('  status     ', r.status, '(expect unverified — recorded, never shippable as paid)');

/* 5. One channel failing must not sink the order */
head('WhatsApp down: the order is still recorded');
globalThis.fetch = async (url) => String(url).includes('graph.facebook.com')
  ? { ok: false, status: 500, json: async () => ({}) }
  : { ok: true, status: 200, json: async () => ({}) };
r = await (await post({ ...customer, payment: 'cod', items: [{ sku: 'EG-001', qty: 1 }] })).json();
console.log('  success    ', r.success);
console.log('  delivered  ', JSON.stringify(r.delivered));

/* 6. Empty cart */
head('Empty cart is refused');
const res = await post({ ...customer, payment: 'cod', items: [] });
console.log('  http       ', res.status, await res.json().then(j => j.error));

/* 7. A refused email must say why, not just fail quietly */
head('FormSubmit refuses: the reason comes back');
globalThis.fetch = async (url) => String(url).includes('formsubmit.co')
  ? { ok: false, status: 403, text: async () => '{"message":"Form not activated"}', json: async () => ({}) }
  : { ok: true, status: 200, text: async () => '', json: async () => ({}) };
r = await (await post({ ...customer, payment: 'cod', items: [{ sku: 'EG-001', qty: 1 }] })).json();
console.log('  success    ', r.success, '(order still placed)');
console.log('  delivered  ', JSON.stringify(r.delivered));
console.log('  why        ', JSON.stringify(r.why));

/* 8. With no env var set, the built-in seller number is used */
head('No SELLER_WHATSAPP set — falls back to the number in code');
globalThis.fetch = async () => ({ ok: true, status: 200, text: async () => '', json: async () => ({}) });
delete env.SELLER_WHATSAPP;
r = await (await post({ ...customer, payment: 'cod', items: [{ sku: 'EG-001', qty: 1 }] })).json();
console.log('  delivered  ', JSON.stringify(r.delivered), '(seller still notified)');

/* 9. The seller number being the business number is named, not left as a code */
head('Seller number is the number WhatsApp sends from');
env.SELLER_WHATSAPP = '+919739815506';
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/messages')) {
    // Meta refuses the seller send; the customer send is the first call
    return seen++ === 0
      ? { ok: true, status: 200, text: async () => '', json: async () => ({}) }
      : { ok: false, status: 400, text: async () => '{"error":{"code":131021}}', json: async () => ({}) };
  }
  if (u.includes('display_phone_number'))
    return { ok: true, status: 200, json: async () => ({ display_phone_number: '+91 97398 15506' }) };
  return { ok: true, status: 200, text: async () => '', json: async () => ({}) };
};
let seen = 0;
r = await (await post({ ...customer, payment: 'cod', items: [{ sku: 'EG-001', qty: 1 }] })).json();
console.log('  delivered  ', JSON.stringify(r.delivered));
console.log('  why        ', (r.why && r.why.whatsapp_seller || '').slice(0, 120));

/* 10. FormSubmit's ajax endpoint refusing falls back to the plain one */
head('FormSubmit /ajax/ refuses, plain endpoint accepts');
globalThis.fetch = async (url) => String(url).includes('formsubmit.co/ajax/')
  ? { ok: false, status: 403, text: async () => 'nope', json: async () => ({}) }
  : { ok: true, status: 302, text: async () => '', json: async () => ({}) };
r = await (await post({ ...customer, payment: 'cod', items: [{ sku: 'EG-001', qty: 1 }] })).json();
console.log('  email      ', r.delivered.email, '(expect true — sent via the fallback)');
console.log('  why        ', JSON.stringify(r.why));
