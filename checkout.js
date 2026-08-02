/* ══════════════════════════════════════════════════════════════
   Checkout — one implementation, every page.

   This is the shop's on-page checkout: the cart summary, address, pay
   choice and Razorpay hand-off all happen in a panel over whatever page
   you are on, so nobody is navigated away mid-purchase. The main page
   used to open a different, older, single-product form; now every page
   opens this.

   Needs /cart.js (window.DK) loaded first. dkSound and dkWhy are
   optional — audio and the why-this-price tooltip degrade quietly.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (!window.DK) return;

  function dkSnd(k) { if (window.dkSound) window.dkSound(k); }
  function egGtag() { if (window.egGtag) window.egGtag.apply(null, arguments); }
  function egFbq()  { if (window.egFbq)  window.egFbq.apply(null, arguments); }

  var style = document.createElement('style');
  style.textContent = "    /* \u2500\u2500 Checkout, on this page \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500*/\n    .co-back {\n      position:fixed; inset:0; z-index:4500; background:rgba(5,3,15,.82);\n      backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);\n      display:none; align-items:center; justify-content:center; padding:16px;\n    }\n    .co-back.on { display:flex; }\n    .co-box {\n      width:100%; max-width:480px;\n      max-height:calc(100vh - 32px); max-height:calc(100dvh - 32px);\n      overflow-y:auto; overscroll-behavior:contain;\n      background:linear-gradient(170deg,#1d1136,#140926 65%);\n      border:1px solid rgba(170,89,200,.5); border-radius:22px;\n      padding:clamp(20px,4vw,30px); position:relative;\n      box-shadow:0 30px 70px rgba(0,0,0,.75);\n    }\n    .co-box h3 { font-size:clamp(22px,4vw,30px); color:#fff; text-align:center; margin-bottom:4px; }\n    .co-sub { text-align:center; font-size:13.5px; color:rgba(255,255,255,.6); margin-bottom:16px; }\n    .co-x { position:absolute; top:10px; right:14px; background:none; border:0; color:rgba(255,255,255,.55);\n      font-size:26px; line-height:1; cursor:pointer; }\n    .co-list { border:1px solid rgba(255,255,255,.14); border-radius:14px; padding:4px 12px; margin-bottom:14px; }\n    .co-row { display:flex; align-items:center; gap:8px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,.08); }\n    .co-row:last-child { border-bottom:0; }\n    .co-row .n { flex:1; font-size:13.5px; color:#fff; display:flex; align-items:center; flex-wrap:wrap; }\n    .co-row .n small { display:block; width:100%; color:rgba(255,255,255,.6); font-size:11.5px; }\n    .co-row .p { font-family:'Norwester',sans-serif; font-size:15px; color:#cd9edf; white-space:nowrap; }\n    .co-sum { display:flex; justify-content:space-between; align-items:baseline; margin:0 0 16px;\n      font-family:'Norwester',sans-serif; font-variant:small-caps; letter-spacing:1.5px; font-size:17px; color:#fff; }\n    .co-sum b { font-size:23px; color:#cd9edf; font-weight:normal; }\n    .co-f { margin-bottom:11px; }\n    .co-f label { display:block; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.6); margin-bottom:5px; }\n    .co-f input, .co-f textarea {\n      width:100%; padding:12px 14px; font-family:'Futura','Segoe UI',sans-serif; font-size:16px; color:#fff;\n      background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.2); border-radius:12px;\n      outline:none; resize:vertical;\n    }\n    .co-f input:focus, .co-f textarea:focus { border-color:#aa59c8; box-shadow:0 0 0 3px rgba(170,89,200,.2); }\n    .co-2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }\n    .co-phone { display:grid; grid-template-columns:86px 1fr; gap:9px; }\n    .co-pay { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:14px 0; }\n    .co-pay button {\n      cursor:pointer; text-align:center; padding:12px 8px; border-radius:14px;\n      background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.2); color:#fff;\n      font-family:'Norwester',sans-serif; font-variant:small-caps; letter-spacing:1.5px; font-size:15px;\n      transition:background .2s ease, border-color .2s ease;\n    }\n    .co-pay button small { display:block; font-family:'Futura','Segoe UI',sans-serif; font-variant:normal;\n      letter-spacing:0; font-size:11px; color:rgba(255,255,255,.6); margin-top:2px; }\n    .co-pay button.on { background:rgba(170,89,200,.3); border-color:#aa59c8; }\n    .co-go {\n      width:100%; cursor:pointer; border:0; margin-top:4px;\n      font-family:'Norwester',sans-serif; font-variant:small-caps; letter-spacing:2px; font-size:17px;\n      color:#fff; background:linear-gradient(180deg,#cd9edf 0%,#aa59c8 45%,#793194 100%); border-radius:999px; padding:13px;\n      transition:filter .2s ease;\n    }\n    .co-go:hover { filter:brightness(1.08); }\n    .co-go[disabled] { opacity:.55; cursor:default; }\n    .co-msg { min-height:20px; text-align:center; font-size:13.5px; margin-top:10px; color:rgba(255,255,255,.84); }\n    .co-msg.err { color:#ff8a8a; }\n    .co-note { text-align:center; font-size:11.5px; color:rgba(255,255,255,.6); margin-top:9px; }\n    .co-done { text-align:center; padding:12px 0; }\n    .co-done .big { font-family:'Norwester',sans-serif; font-variant:small-caps; font-size:clamp(24px,4.4vw,32px); color:#fff; margin-bottom:8px; }\n    .co-done p { color:rgba(255,255,255,.84); font-size:14.5px; }\n\n";
  document.head.appendChild(style);

  var CO = { pay: 'online', busy: false };
  function dkPayType(t) {
    CO.pay = t;
    document.getElementById('pay-online').classList.toggle('on', t === 'online');
    document.getElementById('pay-cod').classList.toggle('on', t === 'cod');
    document.getElementById('co-go').textContent = (t === 'online') ? 'Pay Now' : 'Place Order';
    dkSnd('click');
  }

  var host = document.createElement('div');
  host.innerHTML = "<div class=\"co-back\" id=\"co-back\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Checkout\">\n  <div class=\"co-box\">\n    <button type=\"button\" class=\"co-x\" onclick=\"dkCoClose()\" aria-label=\"Close\">\u00d7</button>\n    <div id=\"co-form-wrap\">\n      <h3>Checkout</h3>\n      <p class=\"co-sub\">Delivered in 3 days. Pay online or in cash when it arrives.</p>\n      <div class=\"co-list\" id=\"co-list\"></div>\n      <div class=\"co-sum\"><span>Total</span><b id=\"co-total\">\u20b90</b></div>\n      <div class=\"co-f\"><label for=\"co-name\">Your name</label><input id=\"co-name\" type=\"text\" autocomplete=\"name\" placeholder=\"Commander Jane\" maxlength=\"60\"/></div>\n      <div class=\"co-f\"><label for=\"co-phone\">WhatsApp number</label>\n        <div class=\"co-phone\"><input id=\"co-cc\" type=\"text\" inputmode=\"tel\" value=\"+91\" aria-label=\"Country code\" maxlength=\"5\"/><input id=\"co-phone\" type=\"tel\" inputmode=\"tel\" placeholder=\"98765 43210\" maxlength=\"20\"/></div>\n      </div>\n      <div class=\"co-f\"><label for=\"co-addr\">Delivery address</label><textarea id=\"co-addr\" rows=\"2\" placeholder=\"Flat, building, street, area\"></textarea></div>\n      <div class=\"co-2\">\n        <div class=\"co-f\"><label for=\"co-city\">City</label><input id=\"co-city\" type=\"text\"/></div>\n        <div class=\"co-f\"><label for=\"co-pin\">Pincode</label><input id=\"co-pin\" type=\"text\" inputmode=\"numeric\" maxlength=\"6\"/></div>\n      </div>\n      <div class=\"co-f\"><label for=\"co-state\">State</label><input id=\"co-state\" type=\"text\"/></div>\n      <div class=\"co-pay\">\n        <button type=\"button\" id=\"pay-online\" class=\"on\" onclick=\"dkPayType('online')\">Pay Online<small>UPI \u00b7 card \u00b7 netbanking</small></button>\n        <button type=\"button\" id=\"pay-cod\" onclick=\"dkPayType('cod')\">Cash On Delivery<small>Pay when it arrives</small></button>\n      </div>\n      <button type=\"button\" class=\"co-go\" id=\"co-go\" onclick=\"dkPlaceOrder()\">Pay Now</button>\n      <div class=\"co-msg\" id=\"co-msg\" role=\"status\"></div>\n      <p class=\"co-note\">\ud83d\udd12 Prices are re-checked on our server before anything is charged.</p>\n    </div>\n    <div class=\"co-done\" id=\"co-done\" style=\"display:none\">\n      <div class=\"big\">\ud83d\ude80 Order confirmed!</div>\n      <p id=\"co-done-b\"></p>\n    </div>\n  </div>\n</div>\n";
  while (host.firstChild) document.body.appendChild(host.firstChild);

  function dkCoOpen() {
    var c = DK.read(); if (!c.length) return;
    var list = document.getElementById('co-list'), total = 0, html = '';
    c.forEach(function(l){
      var p = DK.find(l.sku); if (!p) return;
      var unit = DK.unit(p); total += unit * l.qty;
      html += '<div class="co-row"><span class="n">' + p.name + (l.qty > 1 ? ' ×' + l.qty : '') +
              (window.dkWhy ? '<button type="button" class="why-btn" aria-label="Why this price?" onclick="dkWhy(\'' + p.sku + '\', this)">?</button>' : '') +
              '<small>' + (p.preorder ? 'Pre-order · 15% off applied' : 'Ships in 3 days') + '</small></span>' +
              '<span class="p">' + DK.rs(unit * l.qty) + '</span></div>';
    });
    list.innerHTML = html;
    document.getElementById('co-total').textContent = DK.rs(total);
    document.getElementById('co-back').classList.add('on');
    document.getElementById('co-form-wrap').style.display = '';
    document.getElementById('co-done').style.display = 'none';
    DK.openCart(false);
  }
  function dkCoClose(){ document.getElementById('co-back').classList.remove('on'); }

  function dkVal(id){ return (document.getElementById(id) || {}).value || ''; }
  function dkPlaceOrder() {
    if (CO.busy) return;
    var msg = document.getElementById('co-msg');
    var name = dkVal('co-name').trim();
    var cc = dkVal('co-cc').trim(), digits = dkVal('co-phone').replace(/\D/g, '');
    var addr = dkVal('co-addr').trim(), city = dkVal('co-city').trim();
    var pin = dkVal('co-pin').replace(/\D/g, ''), state = dkVal('co-state').trim();
    msg.textContent = ''; msg.className = 'co-msg';
    function bad(t){ msg.textContent = t; msg.className = 'co-msg err'; }
    if (!name) return bad('Please enter your name.');
    if (digits.length < 7 || digits.length > 15) return bad('Please enter a valid WhatsApp number.');
    if (!addr) return bad('Please enter your delivery address.');
    if (!city) return bad('Please enter your city.');
    if (pin.length !== 6) return bad('Please enter a 6-digit pincode.');

    var phone = (cc.indexOf('+') === 0 ? cc : '+' + cc) + digits;
    var items = DK.read();
    var total = items.reduce(function(a,l){ var p = DK.find(l.sku); return a + (p ? DK.unit(p) * l.qty : 0); }, 0);
    CO.busy = true;
    document.getElementById('co-go').disabled = true;
    msg.textContent = 'Setting up your order…';

    // Lead is saved first and independently — if payment falls over we
    // still know who was trying to buy.
    fetch('/api/save-draft', {
      method:'POST', headers:{'Content-Type':'application/json'}, keepalive:true,
      body: JSON.stringify({ phone: phone, rawPhone: digits, cc: cc, name: name,
        address: addr, city: city, pincode: pin, state: state })
    }).catch(function(){});

    if (CO.pay === 'cod') {
      dkOrderDone('cod', total, null);
      return;
    }

    fetch('/api/create-order', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ items: items })
    }).then(function(r){ return r.json(); }).then(function(order){
      if (!order || !order.order_id) throw new Error(order && order.error || 'Could not create order');
      return dkRazorpay().then(function(){
        var rz = new Razorpay({
          key: 'rzp_live_T3ZTo2sM5OJff2',
          amount: order.amount, currency: order.currency, order_id: order.order_id,
          name: 'DeepKids', description: items.map(function(l){ var p = DK.find(l.sku); return p ? p.name : l.sku; }).join(', '),
          prefill: { name: name, contact: phone },
          notes: { address: addr + ', ' + city + ' ' + pin + ', ' + state },
          theme: { color: '#aa59c8' },
          handler: function(res){
            fetch('/api/verify-payment', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify(res)
            }).catch(function(){});
            dkOrderDone('paid', order.amount, res.razorpay_payment_id);
          },
          modal: { ondismiss: function(){ CO.busy = false; document.getElementById('co-go').disabled = false;
            msg.textContent = 'Payment cancelled — your cart is still here.'; } }
        });
        rz.open();
        msg.textContent = '';
      });
    }).catch(function(err){
      CO.busy = false; document.getElementById('co-go').disabled = false;
      bad('Something went wrong. Please try again, or message us on WhatsApp.');
    });
  }
  function dkRazorpay() {
    if (window.Razorpay) return Promise.resolve();
    return new Promise(function(res, rej){
      var sc = document.createElement('script');
      sc.src = 'https://checkout.razorpay.com/v1/checkout.js';
      sc.onload = res; sc.onerror = rej;
      document.head.appendChild(sc);
    });
  }
  function dkOrderDone(kind, paise, paymentId) {
    var items = DK.read();
    document.getElementById('co-form-wrap').style.display = 'none';
    document.getElementById('co-done').style.display = 'block';
    document.getElementById('co-done-b').textContent = (kind === 'cod')
      ? 'We\'ll WhatsApp you to confirm, and you pay ' + DK.rs(paise) + ' in cash when it arrives.'
      : 'Payment received. We\'ll WhatsApp you the tracking details shortly.';
    dkSnd('checkout');
    var value = paise / 100;
    egGtag('event', 'purchase', { transaction_id: paymentId || ('cod_' + Date.now()),
      value: value, currency: 'INR',
      items: items.map(function(l){ var p = DK.find(l.sku); return { item_id: l.sku, item_name: p ? p.name : l.sku, quantity: l.qty }; }) });
    egFbq('track', 'Purchase', { content_ids: items.map(function(l){ return l.sku; }),
      content_type: 'product', value: value, currency: 'INR' }, paymentId ? { eventID: paymentId } : undefined);
    DK.write([]);
  }


  window.dkCoOpen = dkCoOpen;
  window.dkCoClose = dkCoClose;
  window.dkPayType = dkPayType;
  window.dkPlaceOrder = dkPlaceOrder;
  /* cart.js calls this when Checkout is pressed. */
  window.dkCheckout = dkCoOpen;
})();
