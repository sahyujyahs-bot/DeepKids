/* ══════════════════════════════════════════════════════════════
   Commerce tracking — one dispatcher, three destinations.

   Every add-to-cart, wishlist save, checkout and purchase goes through
   dkTrack(), which fans it out to GA4, the Meta pixel and Google Ads in
   the shape each one wants. They were being called separately before,
   which is how the wishlist ended up in GA4 and nowhere else, and how
   ViewContent — the event Meta's catalogue retargeting is built on —
   never fired on the SCI. or Evolution pages at all.

   Meta only matches a product to a catalogue entry on content_ids plus
   content_type:'product'. content_name is ignored for matching, so
   every call here carries the SKU.

   Google Ads: remarketing parameters are sent on every event, which
   needs no setup beyond the tag. Conversion *actions* need a label per
   action from the Ads UI — drop them into ADS_LABELS below, or link GA4
   to Ads and import the key events instead, which needs no labels.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GA4  = 'G-GYJLZ0FVJE';
  var ADS  = 'AW-18110551284';
  var ADS_LABELS = {
    // 'purchase':       'AbCdEfGhIjK',
    // 'begin_checkout': 'AbCdEfGhIjK',
    // 'add_to_cart':    'AbCdEfGhIjK',
    // 'sign_up':        'AbCdEfGhIjK'
  };

  /* Meta's standard event names, keyed by ours. Anything not listed
     goes out as a custom event rather than being dropped. */
  var META = {
    view_item:        'ViewContent',
    add_to_cart:      'AddToCart',
    add_to_wishlist:  'AddToWishlist',
    begin_checkout:   'InitiateCheckout',
    add_payment_info: 'AddPaymentInfo',
    purchase:         'Purchase',
    sign_up:          'CompleteRegistration'
  };

  function gt() { if (typeof gtag === 'function') gtag.apply(null, arguments); }
  function fb() { if (typeof fbq  === 'function') fbq.apply(null, arguments); }

  function rupees(paise) { return Math.round((paise || 0)) / 100; }

  /* lines: [{ sku, name, qty, paise }] — paise is the unit price. */
  function dkTrack(name, lines, extra) {
    lines = lines || [];
    extra = extra || {};
    var value = extra.value != null ? extra.value
              : rupees(lines.reduce(function (a, l) { return a + (l.paise || 0) * (l.qty || 1); }, 0));
    var ids = lines.map(function (l) { return l.sku; });

    /* ── GA4 ── */
    var ga = {
      currency: 'INR',
      value: value,
      items: lines.map(function (l, i) {
        return { item_id: l.sku, item_name: l.name, index: i,
                 price: rupees(l.paise), quantity: l.qty || 1 };
      })
    };
    if (extra.transaction_id) ga.transaction_id = extra.transaction_id;
    if (extra.coupon)         ga.coupon = extra.coupon;
    if (extra.payment_type)   ga.payment_type = extra.payment_type;
    gt('event', name, ga);

    /* ── Meta ── */
    var mp = {
      content_ids: ids,
      content_type: 'product',
      contents: lines.map(function (l) { return { id: l.sku, quantity: l.qty || 1 }; }),
      content_name: lines.map(function (l) { return l.name; }).join(', '),
      currency: 'INR',
      value: value,
      num_items: lines.reduce(function (a, l) { return a + (l.qty || 1); }, 0)
    };
    var mName = META[name];
    var opts = extra.event_id ? { eventID: extra.event_id } : undefined;
    if (mName) fb('track', mName, mp, opts);
    else       fb('trackCustom', name, mp, opts);

    /* ── Google Ads ──
       Remarketing on every event; a conversion too if a label exists. */
    gt('event', name, {
      send_to: ADS,
      ecomm_prodid: ids,
      ecomm_pagetype: extra.pagetype || 'other',
      ecomm_totalvalue: value,
      value: value,
      currency: 'INR'
    });
    if (ADS_LABELS[name]) {
      gt('event', 'conversion', {
        send_to: ADS + '/' + ADS_LABELS[name],
        value: value,
        currency: 'INR',
        transaction_id: extra.transaction_id || ''
      });
    }
  }

  window.dkTrack = dkTrack;

  /* ── view_item ─────────────────────────────────────────────────
     A page says which product it is with <body data-dk-product="SKU">.
     Fired once the catalogue is loaded so the price is the real one. */
  function fireViewItem() {
    var sku = document.body && document.body.getAttribute('data-dk-product');
    if (!sku || !window.DK) return;
    var p = DK.find(sku);
    if (!p) return;
    dkTrack('view_item', [{ sku: p.sku, name: p.name, qty: 1, paise: DK.unit(p) }],
            { pagetype: 'product' });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(fireViewItem, 0); });
  } else {
    setTimeout(fireViewItem, 0);
  }
})();
