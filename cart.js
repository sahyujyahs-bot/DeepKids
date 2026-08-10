/* ══════════════════════════════════════════════════════════════
   Cart and wishlist — one definition, shared by every page.

   The catalog, the prices, the storage and both drawers live here so
   the main page and the shop can never drift apart on what a product
   costs or what is in the basket. A page adds behaviour by defining
   window.dkCheckout (what the Checkout button does), window.dkSound
   (audio) and window.dkWhy (the why-this-price tooltip); all three are
   optional and this file degrades quietly without them.

   Storage is localStorage, so a basket survives a closed tab on the
   same browser. It does not follow anyone to another device — that
   needs an account, which the site does not have yet.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PREORDER_OFF = 0.15;

  /* Display prices only. /api/create-order re-prices every line from its
     SKU, so nothing charged can be edited from the browser. */
  var CATALOG = [
    { sku: 'EG-001', name: 'EscapeGravity',          price: 499900, preorder: false,
      href: '/',          img: 'eg-box-new.webp' },
    { sku: 'SCI-001', name: 'SCI. Trading Cards',    price: 119900, preorder: true,
      href: '/sci',       img: 'sci-brahmagupta-front.webp' },
    { sku: 'EVO-001', name: 'The Story Of Evolution', price: 249900, preorder: true,
      href: '/evolution', img: 'sp-23.webp' }
  ];

  var CART_KEY = 'dk-cart', WISH_KEY = 'dk-wish';

  function find(sku) { for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].sku === sku) return CATALOG[i]; return null; }
  /* Rounded to whole rupees, exactly as /api/create-order does it — the
     two must agree or the cart total won't match what Razorpay charges. */
  function unit(p) { return p.preorder ? Math.round(p.price * (1 - PREORDER_OFF) / 100) * 100 : p.price; }
  function rs(paise) { return '₹' + (paise / 100).toLocaleString('en-IN'); }
  function thumb(p) { return (p.shots && p.shots[0] && p.shots[0].src) || p.img || ''; }
  function sound(k) { if (window.dkSound) window.dkSound(k); }
  function track(name, lines, extra) { if (window.dkTrack) window.dkTrack(name, lines, extra); }
  /* [{sku,name,qty,paise}] — the shape /track.js wants. */
  function linesOf(rows) {
    return rows.map(function (l) {
      var p = find(l.sku);
      return p ? { sku: p.sku, name: p.name, qty: l.qty || 1, paise: unit(p) } : null;
    }).filter(Boolean);
  }

  function read()  { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
  function write(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} paint(); }
  function wishRead() { try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch (e) { return []; } }
  function wishWrite(w) { try { localStorage.setItem(WISH_KEY, JSON.stringify(w)); } catch (e) {} wishPaint(); }

  function subtotal() {
    return read().reduce(function (a, l) { var p = find(l.sku); return a + (p ? unit(p) * l.qty : 0); }, 0);
  }
  function count() { return read().reduce(function (a, l) { return a + l.qty; }, 0); }

  /* ── Markup ─────────────────────────────────────────────────── */

  var CSS = [
    '.dkc-btn{position:relative;width:40px;height:40px;border:0;background:none;cursor:pointer;',
      'display:grid;place-items:center;-webkit-tap-highlight-color:transparent}',
    '.dkc-btn svg{width:23px;height:23px;fill:none;stroke:#cd9edf;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '#dkc-wish-btn svg{stroke:#e85d75}',
    '.dkc-badge{position:absolute;top:2px;right:0;min-width:18px;height:18px;padding:0 5px;',
      'border-radius:999px;background:#aa59c8;color:#fff;font-family:"Norwester",sans-serif;',
      'font-size:11px;line-height:18px;text-align:center;transform:scale(0);',
      'transition:transform .25s cubic-bezier(.3,1.6,.5,1)}',
    '.dkc-badge.on{transform:scale(1)}',
    '#dkc-wish-btn .dkc-badge{background:#e85d75;color:#fff}',

    '.dkc-pop{position:fixed;top:var(--dkc-top,52px);right:clamp(10px,4vw,24px);z-index:3600;',
      'width:min(340px,92vw);max-height:calc(100vh - var(--dkc-top,52px) - 20px);overflow-y:auto;',
      'overscroll-behavior:contain;background:rgba(16,10,34,.98);',
      '-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);',
      'border:1px solid rgba(170,89,200,.5);border-radius:16px;padding:14px;',
      'box-shadow:0 22px 56px rgba(0,0,0,.65);opacity:0;transform:translateY(-8px) scale(.98);',
      'transform-origin:top right;pointer-events:none;transition:opacity .2s ease,transform .2s ease}',
    '@media (min-width:769px){.dkc-pop{--dkc-top:72px}}',
    '.dkc-pop.open{opacity:1;transform:none;pointer-events:auto}',
    '.dkc-pop h4{font-family:"Norwester",sans-serif;font-variant:small-caps;letter-spacing:2px;',
      'font-size:14px;color:#cd9edf;margin:0 0 10px}',
    '.dkc-line{display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.1)}',
    '.dkc-line:last-of-type{border-bottom:0}',
    '.dkc-line img{width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0}',
    '.dkc-n{flex:1;min-width:0;overflow:hidden;font-size:13.5px;color:#fff;line-height:1.3;font-family:"Futura","Segoe UI",sans-serif}',
    '.dkc-n small{display:block;color:rgba(255,255,255,.55);font-size:11.5px}',
    '.dkc-p{font-family:"Norwester",sans-serif;font-size:14px;color:#cd9edf;white-space:nowrap}',
    '.dkc-qty{display:inline-flex;align-items:center;gap:2px;flex-shrink:0}',
    '.dkc-qty button{width:22px;height:22px;line-height:1;padding:0;cursor:pointer;',
      'border:1px solid rgba(205,158,223,.45);background:rgba(170,89,200,.14);color:#cd9edf;',
      'border-radius:6px;font-size:14px;transition:background .18s ease,color .18s ease}',
    '.dkc-qty button:hover{background:rgba(170,89,200,.4);color:#fff}',
    '.dkc-qty b{min-width:18px;text-align:center;font-family:"Norwester",sans-serif;',
      'font-weight:normal;font-size:14px;color:#fff}',
    '.dkc-x{background:none;border:0;color:rgba(255,255,255,.4);font-size:17px;cursor:pointer;line-height:1;padding:0 2px}',
    '.dkc-x:hover{color:#e85d75}',
    '.dkc-total{display:flex;justify-content:space-between;align-items:baseline;margin:12px 0 10px;',
      'font-family:"Norwester",sans-serif;font-variant:small-caps;letter-spacing:1.5px;font-size:16px;color:#fff}',
    '.dkc-total b{font-size:20px;color:#cd9edf;font-weight:normal}',
    '.dkc-go{display:block;width:100%;text-align:center;cursor:pointer;border:0;',
      'font-family:"Norwester",sans-serif;font-variant:small-caps;letter-spacing:2px;font-size:16px;',
      'color:#fff;background:linear-gradient(180deg,#cd9edf 0%,#aa59c8 45%,#793194 100%);',
      'border-radius:999px;padding:11px;transition:filter .2s ease}',
    '.dkc-go:hover{filter:brightness(1.08)}',
    '.dkc-empty{font-size:13.5px;color:rgba(255,255,255,.55);padding:6px 0 10px;font-family:"Futura","Segoe UI",sans-serif}',
    '.dkc-note{font-size:11.5px;color:rgba(255,255,255,.55);text-align:center;margin:9px 0 0;font-family:"Futura","Segoe UI",sans-serif}',
    '.dkc-add{flex-shrink:0;cursor:pointer;border:0;border-radius:999px;padding:6px 13px;',
      'font-family:"Norwester",sans-serif;font-variant:small-caps;letter-spacing:1.2px;font-size:13px;',
      'color:#fff;background:#aa59c8;transition:filter .2s ease}',
    '.dkc-add:hover{filter:brightness(1.08)}',
    '.dkc-why{flex-shrink:0;width:16px;height:16px;margin-left:6px;border-radius:50%;cursor:pointer;',
      'border:1px solid rgba(205,158,223,.6);background:none;color:#cd9edf;font-size:10px;line-height:1;',
      'padding:0;font-family:"Futura","Segoe UI",sans-serif}',

    /* Sign-up asked for at the wishlist, because that is the one moment
       someone is telling us they want a thing they cannot have yet. */
    '.dkc-gate{position:fixed;inset:0;z-index:5200;display:none;place-items:center;padding:18px;',
      'background:rgba(4,2,12,.86);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px)}',
    '.dkc-gate.on{display:grid}',
    '.dkc-gate-box{width:min(400px,100%);background:rgba(16,10,34,.99);border-radius:20px;padding:24px 22px;',
      'border:1px solid rgba(170,89,200,.5);box-shadow:0 26px 70px rgba(0,0,0,.7);position:relative}',
    '.dkc-gate h4{font-family:"Norwester",sans-serif;font-variant:small-caps;letter-spacing:1.5px;',
      'font-size:22px;color:#fff;margin:0 0 6px}',
    '.dkc-gate p{font-family:"Futura","Segoe UI",sans-serif;font-size:13.5px;line-height:1.5;',
      'color:rgba(255,255,255,.7);margin:0 0 16px}',
    '.dkc-f{margin-bottom:12px}',
    '.dkc-f label{display:block;font-family:"Futura","Segoe UI",sans-serif;font-size:11.5px;',
      'letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:5px}',
    '.dkc-f input{width:100%;box-sizing:border-box;padding:11px 13px;border-radius:11px;',
      'font-family:"Futura","Segoe UI",sans-serif;font-size:15px;color:#fff;',
      'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2);outline:none}',
    '.dkc-f input:focus{border-color:#aa59c8;background:rgba(170,89,200,.12)}',
    '.dkc-phone{display:flex;gap:8px}',
    '.dkc-phone input:first-child{width:72px;flex:0 0 72px;text-align:center}',
    '.dkc-gate-go{display:block;width:100%;cursor:pointer;border:0;border-radius:999px;padding:12px;',
      'font-family:"Norwester",sans-serif;font-variant:small-caps;letter-spacing:2px;font-size:16px;color:#fff;',
      'background:linear-gradient(180deg,#cd9edf 0%,#aa59c8 45%,#793194 100%);transition:filter .2s ease}',
    '.dkc-gate-go:hover{filter:brightness(1.08)}',
    '.dkc-gate-go[disabled]{opacity:.55;cursor:default}',
    '.dkc-gate-skip{display:block;width:100%;margin-top:10px;cursor:pointer;background:none;border:0;',
      'font-family:"Futura","Segoe UI",sans-serif;font-size:12.5px;color:rgba(255,255,255,.45)}',
    '.dkc-gate-skip:hover{color:#fff}',
    '.dkc-gate-msg{font-family:"Futura","Segoe UI",sans-serif;font-size:12.5px;min-height:16px;',
      'margin-top:8px;color:#ff8a8a;text-align:center}',

  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var wishBtn = el('button', 'dkc-btn',
    '<svg viewBox="0 0 24 24"><path d="M12 20.2 4.6 12.9a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5Z"/></svg>' +
    '<span class="dkc-badge" id="dkc-wish-count">0</span>');
  wishBtn.type = 'button'; wishBtn.id = 'dkc-wish-btn';
  wishBtn.setAttribute('aria-label', 'Wishlist');

  var cartBtn = el('button', 'dkc-btn',
    '<svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.55L21 8H6"/>' +
    '<circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>' +
    '<span class="dkc-badge" id="dkc-cart-count">0</span>');
  cartBtn.type = 'button'; cartBtn.id = 'dkc-cart-btn';
  cartBtn.setAttribute('aria-label', 'Cart');

  /* Sit to the left of the menu button. Insert against the button's own
     parent — a document-order querySelector can hand back .eg-nav while
     the button lives inside .eg-nav-right, and insertBefore only accepts
     a direct child. */
  var anchor = document.querySelector('.eg-nav-menu-btn, .dkm-btn, #menu-btn');
  if (anchor && anchor.parentNode) {
    anchor.parentNode.insertBefore(wishBtn, anchor);
    anchor.parentNode.insertBefore(cartBtn, anchor);
  } else {
    var bar = document.querySelector('.eg-nav .eg-nav-right, .eg-nav, nav.nav, header nav, header');
    if (bar) { bar.appendChild(wishBtn); bar.appendChild(cartBtn); }
    else {
      /* No bar on this page (404, order confirmation). Float the pair
         where menu.js floats its button, just to the left of it —
         otherwise the icons never exist and every repaint throws. */
      var float = document.createElement('div');
      float.style.cssText = 'position:fixed;top:6px;right:calc(clamp(10px,4vw,24px) + 44px);' +
                            'z-index:4001;display:flex;align-items:center';
      float.appendChild(wishBtn); float.appendChild(cartBtn);
      document.body.appendChild(float);
    }
  }

  var cartPop = el('div', 'dkc-pop',
    '<h4>Your Cart</h4><div id="dkc-cart-lines"></div>' +
    '<div class="dkc-total" id="dkc-total-row" style="display:none"><span>Total</span><b id="dkc-total">₹0</b></div>' +
    '<button type="button" class="dkc-go" id="dkc-go" style="display:none">Checkout</button>' +
    '<p class="dkc-note" id="dkc-note" style="display:none">Pre-order items ship as soon as they\'re printed.</p>');
  cartPop.id = 'dkc-cart-pop';
  cartPop.setAttribute('role', 'dialog');
  cartPop.setAttribute('aria-label', 'Your cart');

  var wishPop = el('div', 'dkc-pop', '<h4>Saved For Later</h4><div id="dkc-wish-lines"></div>');
  wishPop.id = 'dkc-wish-pop';
  wishPop.setAttribute('role', 'dialog');
  wishPop.setAttribute('aria-label', 'Your wishlist');

  document.body.appendChild(cartPop);
  document.body.appendChild(wishPop);

  /* ── Painting ───────────────────────────────────────────────── */

  function paint() {
    var c = read(), lines = document.getElementById('dkc-cart-lines');
    var badge = document.getElementById('dkc-cart-count');
    if (!lines || !badge) return;
    badge.textContent = count();
    badge.classList.toggle('on', count() > 0);
    if (!c.length) {
      lines.innerHTML = '<p class="dkc-empty">Nothing in here yet.</p>';
      document.getElementById('dkc-total-row').style.display = 'none';
      document.getElementById('dkc-go').style.display = 'none';
      document.getElementById('dkc-note').style.display = 'none';
      return;
    }
    var total = 0, html = '', anyPre = false;
    c.forEach(function (l) {
      var p = find(l.sku); if (!p) return;
      var u = unit(p); total += u * l.qty;
      if (p.preorder) anyPre = true;
      html += '<div class="dkc-line"><img src="' + thumb(p) + '" alt="" loading="lazy" decoding="async"/>' +
              '<span class="dkc-n">' + p.name +
              (window.dkWhy ? '<button type="button" class="dkc-why" aria-label="Why this price?" data-why="' + p.sku + '">?</button>' : '') +
              '<small>' + (p.preorder ? 'Pre-order · 15% off applied' : 'Ships in 3 days') + '</small></span>' +
              '<span class="dkc-qty">' +
                '<button type="button" aria-label="One fewer ' + p.name + '" data-less="' + p.sku + '">−</button>' +
                '<b>' + l.qty + '</b>' +
                '<button type="button" aria-label="One more ' + p.name + '" data-more="' + p.sku + '">+</button>' +
              '</span>' +
              '<span class="dkc-p">' + rs(u * l.qty) + '</span>' +
              '<button type="button" class="dkc-x" aria-label="Remove ' + p.name + '" data-rm="' + p.sku + '">×</button></div>';
    });
    lines.innerHTML = html;
    document.getElementById('dkc-total').textContent = rs(total);
    document.getElementById('dkc-total-row').style.display = 'flex';
    document.getElementById('dkc-go').style.display = 'block';
    document.getElementById('dkc-note').style.display = anyPre ? 'block' : 'none';
  }

  function wishPaint() {
    var w = wishRead(), box = document.getElementById('dkc-wish-lines');
    var badge = document.getElementById('dkc-wish-count');
    if (!box || !badge) return;
    badge.textContent = w.length;
    badge.classList.toggle('on', w.length > 0);
    syncHearts();
    if (!w.length) { box.innerHTML = '<p class="dkc-empty">Nothing saved yet.</p>'; return; }
    var html = '';
    w.forEach(function (sku) {
      var p = find(sku); if (!p) return;
      html += '<div class="dkc-line"><img src="' + thumb(p) + '" alt="" loading="lazy" decoding="async"/>' +
              '<span class="dkc-n">' + p.name + '<small>' + rs(unit(p)) +
              (p.preorder ? ' · pre-order' : '') + '</small></span>' +
              '<button type="button" class="dkc-add" data-wadd="' + p.sku + '">' +
              (p.preorder ? 'Pre-order' : 'Add') + '</button>' +
              '<button type="button" class="dkc-x" aria-label="Remove ' + p.name +
              ' from wishlist" data-wrm="' + p.sku + '">×</button></div>';
    });
    box.innerHTML = html;
  }

  /* Hearts printed by the shop's own catalog markup. */
  function syncHearts() {
    var w = wishRead();
    document.querySelectorAll('[data-wish]').forEach(function (b) {
      b.classList.toggle('on', w.indexOf(b.getAttribute('data-wish')) > -1);
    });
  }


  /* ── Who is this ───────────────────────────────────────────────
     Saving something you cannot buy yet is a promise to come back, so
     it is the natural place to ask who to come back to. Asked once,
     remembered after, and skippable — a gate that blocks the save would
     cost more wishlists than the numbers are worth. */
  var USER_KEY = 'dk-user';
  function userRead() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; } }
  function userWrite(u) { try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch (e) {} }

  var gate = el('div', 'dkc-gate',
    '<div class="dkc-gate-box">' +
      '<h4>Save it to your list</h4>' +
      '<p>Leave your name and WhatsApp number and we will tell you the moment it is printed &mdash; and keep your list for you.</p>' +
      '<div class="dkc-f"><label for="dkc-name">Your name</label>' +
        '<input id="dkc-name" type="text" autocomplete="name" placeholder="Commander Jane" maxlength="60"/></div>' +
      '<div class="dkc-f"><label for="dkc-phone">WhatsApp number</label>' +
        '<div class="dkc-phone">' +
          '<input id="dkc-cc" type="text" inputmode="tel" value="+91" aria-label="Country code" maxlength="5"/>' +
          '<input id="dkc-phone" type="tel" inputmode="tel" placeholder="98765 43210" maxlength="20"/>' +
        '</div></div>' +
      '<button type="button" class="dkc-gate-go" id="dkc-gate-go">Save &amp; Notify Me</button>' +
      '<div class="dkc-gate-msg" id="dkc-gate-msg" role="status"></div>' +
      '<button type="button" class="dkc-gate-skip" id="dkc-gate-skip">Just save it, skip this</button>' +
    '</div>');
  gate.id = 'dkc-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  document.body.appendChild(gate);

  var pendingSku = null;
  function gateOpen(sku) {
    pendingSku = sku;
    var u = userRead();
    if (u) { document.getElementById('dkc-name').value = u.name || '';
             document.getElementById('dkc-phone').value = u.rawPhone || ''; }
    document.getElementById('dkc-gate-msg').textContent = '';
    gate.classList.add('on');
    setTimeout(function () { var n = document.getElementById('dkc-name'); if (n) n.focus(); }, 60);
  }
  function gateClose() { gate.classList.remove('on'); pendingSku = null; }
  function commitWish(sku) {
    var w = wishRead();
    if (w.indexOf(sku) === -1) {
      w.push(sku);
      wishWrite(w);
      var p = find(sku);
      if (p) track('add_to_wishlist', [{ sku: sku, name: p.name, qty: 1, paise: unit(p) }]);
    }
    syncHearts();
    sound('click');
  }

  document.getElementById('dkc-gate-skip').addEventListener('click', function () {
    var sku = pendingSku;
    try { localStorage.setItem(USER_KEY, JSON.stringify({ skipped: true })); } catch (e) {}
    gateClose();
    if (sku) commitWish(sku);
  });

  document.getElementById('dkc-gate-go').addEventListener('click', function () {
    var btn = this;
    var name = (document.getElementById('dkc-name').value || '').trim();
    var cc = (document.getElementById('dkc-cc').value || '+91').trim();
    var raw = (document.getElementById('dkc-phone').value || '').replace(/\D/g, '');
    var msg = document.getElementById('dkc-gate-msg');
    if (name.length < 2) { msg.textContent = 'A name, please.'; return; }
    if (raw.length < 8)  { msg.textContent = 'That number looks short.'; return; }

    var sku = pendingSku;
    var user = { name: name, cc: cc, rawPhone: raw, phone: cc.replace(/\D/g, '') + raw };
    userWrite(user);
    btn.disabled = true; btn.textContent = 'Saving…';

    /* The wishlist is saved whatever the network does — the sign-up is
       the bonus, not the price of admission. */
    gateClose();
    if (sku) commitWish(sku);
    track('sign_up', [], { value: 0 });

    fetch('/api/save-draft', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: user.phone, rawPhone: user.rawPhone, cc: user.cc,
                             name: user.name, source: 'wishlist' })
    }).catch(function () {});
    setTimeout(function () { btn.disabled = false; btn.textContent = 'Save & Notify Me'; }, 400);
  });

  gate.addEventListener('click', function (e) { if (e.target === gate) gateClose(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && gate.classList.contains('on')) gateClose();
  });

  /* ── Actions ────────────────────────────────────────────────── */

  function openCart(force) {
    var open = (force === undefined) ? !cartPop.classList.contains('open') : !!force;
    cartPop.classList.toggle('open', open);
    wishPop.classList.remove('open');
    if (window.egCloseMenu) window.egCloseMenu();
    if (open) { sound('click'); if (read().length) track('view_cart', linesOf(read()), { pagetype: 'cart' }); }
  }
  function openWish(force) {
    var open = (force === undefined) ? !wishPop.classList.contains('open') : !!force;
    wishPop.classList.toggle('open', open);
    cartPop.classList.remove('open');
    if (window.egCloseMenu) window.egCloseMenu();
    if (open) sound('click');
  }

  function add(sku, qty) {
    var p = find(sku); if (!p) return;
    var c = read(), row = null;
    for (var i = 0; i < c.length; i++) if (c[i].sku === sku) row = c[i];
    if (row) row.qty = Math.min(row.qty + (qty || 1), 10);
    else c.push({ sku: sku, qty: qty || 1 });
    write(c);
    sound('cart');
    /* The drawer opening is the confirmation. A toast on top of it said
       the same thing twice and covered the drawer's own header. */
    openCart(true);

    track('add_to_cart', [{ sku: sku, name: p.name, qty: qty || 1, paise: unit(p) }],
          { pagetype: 'cart' });
  }

  function remove(sku) {
    var p = find(sku), row = read().filter(function (l) { return l.sku === sku; })[0];
    if (p && row) track('remove_from_cart', [{ sku: sku, name: p.name, qty: row.qty, paise: unit(p) }]);
    write(read().filter(function (l) { return l.sku !== sku; }));
    sound('click');
  }
  /* Down to zero takes the line out, which is what people expect from a
     minus button rather than it sticking at 1. */
  function bump(sku, by) {
    var c = read(), out = [];
    for (var i = 0; i < c.length; i++) {
      if (c[i].sku !== sku) { out.push(c[i]); continue; }
      var q = Math.min(Math.max(c[i].qty + by, 0), 10);
      if (q > 0) out.push({ sku: sku, qty: q });
    }
    write(out);
    sound('click');
  }

  function wish(sku, elm) {
    var w = wishRead(), i = w.indexOf(sku);
    if (i > -1) {                       // un-saving never asks for anything
      w.splice(i, 1); wishWrite(w);
      if (elm) elm.classList.remove('on');
      sound('click');
      return;
    }
    if (!userRead()) { gateOpen(sku); return; }
    commitWish(sku);
    if (elm) elm.classList.add('on');
  }
  function wishDrop(sku) {
    var w = wishRead(), i = w.indexOf(sku);
    if (i > -1) { w.splice(i, 1); wishWrite(w); sound('click'); }
  }
  function wishAdd(sku) { add(sku); wishDrop(sku); }

  /* ── Wiring ─────────────────────────────────────────────────── */

  wishBtn.addEventListener('click', function (e) { e.stopPropagation(); openWish(); });
  cartBtn.addEventListener('click', function (e) { e.stopPropagation(); openCart(); });

  cartPop.addEventListener('click', function (e) {
    var less = e.target.closest('[data-less]');
    if (less) { bump(less.getAttribute('data-less'), -1); return; }
    var more = e.target.closest('[data-more]');
    if (more) { bump(more.getAttribute('data-more'), 1); return; }
    var rm = e.target.closest('[data-rm]');
    if (rm) { remove(rm.getAttribute('data-rm')); return; }
    var why = e.target.closest('[data-why]');
    if (why && window.dkWhy) { window.dkWhy(why.getAttribute('data-why'), why); return; }
    if (e.target.id === 'dkc-go') {
      sound('checkout');
      track('begin_checkout', linesOf(read()), { pagetype: 'cart' });
      /* Pages that can take payment define dkCheckout. Everything else
         hands off to the shop rather than dead-ending. */
      if (typeof window.dkCheckout === 'function') window.dkCheckout();
      else location.href = '/shop#checkout';
    }
  });

  wishPop.addEventListener('click', function (e) {
    var a = e.target.closest('[data-wadd]');
    if (a) { wishAdd(a.getAttribute('data-wadd')); return; }
    var r = e.target.closest('[data-wrm]');
    if (r) { wishDrop(r.getAttribute('data-wrm')); }
  });

  /* Catalog hearts and add buttons, wherever a page prints them. */
  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-wish]');
    if (w) { e.preventDefault(); wish(w.getAttribute('data-wish'), w); return; }
    var a = e.target.closest('[data-add]');
    if (a) {
      e.preventDefault();
      add(a.getAttribute('data-add'), parseInt(a.getAttribute('data-qty'), 10) || 1);
      return;
    }
    if (cartPop.contains(e.target) || cartBtn.contains(e.target)) return;
    if (wishPop.contains(e.target) || wishBtn.contains(e.target)) return;
    if (e.target.closest('#dkm') || e.target.closest('.dkm-btn')) return;
    cartPop.classList.remove('open');
    wishPop.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { cartPop.classList.remove('open'); wishPop.classList.remove('open'); }
  });

  /* Returning from a product tab, or out of bfcache, should show the
     basket as it actually stands. */
  window.addEventListener('pageshow', function () { paint(); wishPaint(); });

  paint();
  wishPaint();

  window.DK = {
    CATALOG: CATALOG, PREORDER_OFF: PREORDER_OFF,
    find: find, unit: unit, rs: rs, thumb: thumb,
    read: read, write: write, subtotal: subtotal, count: count,
    add: add, remove: remove, bump: bump, openCart: openCart, openWish: openWish,
    wish: wish, wishRead: wishRead, wishDrop: wishDrop, wishAdd: wishAdd,
    paint: paint, wishPaint: wishPaint, syncHearts: syncHearts,
    user: userRead,
    /* What /api/create-order wants: SKUs and quantities, never prices. */
    items: function () { return read().map(function (l) { return { sku: l.sku, qty: l.qty }; }); }
  };
})();
