// Shared product catalogue for the Pages Functions.
//
// The browser sends SKUs and quantities and nothing else that touches
// money — prices live here so a tampered cart cannot change what is
// charged, recorded or notified. This must stay in step with the
// CATALOG in /cart.js, which is what the shopper is shown; if the two
// drift, the charge will not match the cart.

export const CATALOG = {
  'EG-001':  { name: 'EscapeGravity',          paise: 499900, off: 0.15 },
  'SCI-001': { name: 'SCI. Trading Cards',     paise: 119900, off: 0.15 },
  'EVO-001': { name: 'The Story Of Evolution', paise: 249900, off: 0.15 }
};

export const COUPONS = { 'EG200': 20000 };   // code (UPPERCASE) -> paise off

// Rounded to whole rupees so the total matches the cart to the paisa.
export function unitPaise(item) {
  return Math.round(item.paise * (1 - (item.off || 0)) / 100) * 100;
}

// Turns whatever the browser sent into priced lines and a total.
// Unknown SKUs are dropped rather than guessed at, and quantities are
// clamped, so nothing here can be talked into an absurd order.
export function priceCart(rawItems, rawCoupon) {
  const lines = [];
  let subtotal = 0;
  for (const raw of (Array.isArray(rawItems) ? rawItems : []).slice(0, 20)) {
    const sku = String((raw && raw.sku) || '').trim().toUpperCase();
    const item = CATALOG[sku];
    if (!item) continue;
    const qty = Math.min(Math.max(parseInt(raw.qty, 10) || 1, 1), 10);
    const unit = unitPaise(item);
    subtotal += unit * qty;
    lines.push({ sku, name: item.name, qty, paise: unit });
  }
  const coupon = String(rawCoupon || '').trim().toUpperCase();
  const discount = (coupon && COUPONS[coupon]) ? COUPONS[coupon] : 0;
  return {
    lines,
    subtotal,
    discount,
    coupon: discount ? coupon : '',
    total: Math.max(subtotal - discount, 100)
  };
}

export function rupees(paise) {
  return '₹' + (paise / 100).toLocaleString('en-IN');
}
