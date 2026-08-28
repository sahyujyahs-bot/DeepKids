/* ══════════════════════════════════════════════════════════════
   The product block — one definition for every product page.

   A page supplies the reading matter (title, copy, price, button) as
   ordinary markup inside .buy-info, and an empty .buy-gal for the
   photographs. This file owns the layout, the swipe/arrow/thumbnail
   gallery, the zoom, the quantity stepper and the wishlist heart, so
   /  and /sci cannot end up with different galleries.

   To use it, drop the markup on the page and queue the photos:

     <div class="buy-wrap">
       <div class="buy-gal"></div>
       <div class="buy-info"> ... </div>
     </div>
     <script>
       (window.dkProductQueue = window.dkProductQueue || []).push({
         mount: '#my-gal', badge: 'In stock',
         shots: [{ src: 'a.webp', cap: 'The box', alt: '...' }, ...]
       });
     </script>

   The queue, rather than a direct call, because inline page scripts
   run while the document parses and this file is deferred — a direct
   call would always run before the function existed.

   The stylesheet is prepended to <head>, not appended, so a page's
   own rules still win.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CSS = ".buy-wrap { max-width: 1120px; margin: 0 auto; padding: 0 clamp(16px,4vw,40px);\n  display: grid; grid-template-columns: minmax(0,1fr); gap: clamp(22px,3.5vw,44px); align-items: start; }\n/* Grid items default to min-width:auto, so the thumbnail strip's tiles\n   would set the column width and push the whole block off a phone\n   screen. Let the column win; the strip already scrolls. */\n.buy-gal, .buy-info { min-width: 0; }\n\n/* ── Photos ────────────────────────────────────────────────\n   The stage has a height of its own and every photo is contained\n   inside it. The kit shots are portrait, the challenge cards are\n   landscape and the board is square — nothing may be cropped to\n   make them agree, so they letterbox instead. */\n/* No frame, no tint: the photographs sit straight on the page. The\n   stage is only a measured height for them to be contained in, and\n   overflow:hidden so the snap track clips. */\n.buy-stage {\n  position: relative; overflow: hidden;\n  height: clamp(300px, 52vh, 440px);\n}\n.buy-track {\n  display: flex; height: 100%; overflow-x: auto; overflow-y: hidden;\n  scroll-snap-type: x mandatory; scroll-behavior: smooth;\n  scrollbar-width: none; -ms-overflow-style: none;\n}\n.buy-track::-webkit-scrollbar { display: none; }\n/* Deliberately a block, not a centring grid: an implicit grid row is\n   sized auto, which is indefinite, so the image's height:100% below\n   would fall back to auto and the tall photos would run past the\n   stage. object-fit centres the picture anyway. */\n.buy-slide {\n  flex: 0 0 100%; height: 100%; margin: 0; scroll-snap-align: center;\n  padding: 4%; box-sizing: border-box; cursor: zoom-in;\n}\n/* object-fit:contain against a slide with a real height is the one\n   sizing that cannot crop, whatever shape the photo turns out to be —\n   the kit shots are portrait, the challenge cards landscape and the\n   board square, and they letterbox rather than agree. */\n.buy-slide img { width: 100%; height: 100%; object-fit: contain; display: block; }\n.buy-badge {\n  position: absolute; left: 12px; top: 12px; z-index: 3;\n  font-family: 'Norwester',sans-serif; font-variant: small-caps; letter-spacing: 2px;\n  font-size: 11.5px; color: #fff; background: #aa59c8; border-radius: 999px; padding: 3px 12px;\n  box-shadow: 0 2px 12px rgba(170,89,200,.55);\n}\n.buy-arrow {\n  position: absolute; top: 50%; transform: translateY(-50%); z-index: 3;\n  width: 40px; height: 40px; border-radius: 50%; cursor: pointer;\n  border: 1px solid rgba(255,255,255,.28); background: rgba(10,6,24,.62);\n  color: #fff; font-size: 20px; line-height: 1; display: grid; place-items: center;\n  backdrop-filter: blur(4px); transition: background .2s ease, border-color .2s ease, opacity .2s ease;\n}\n.buy-arrow:hover { background: rgba(170,89,200,.8); border-color: #cd9edf; }\n.buy-arrow[disabled] { opacity: .28; cursor: default; }\n.buy-prev { left: 10px; } .buy-next { right: 10px; }\n.buy-zoom {\n  position: absolute; right: 10px; bottom: 10px; z-index: 3;\n  border-radius: 999px; cursor: pointer; padding: 5px 13px;\n  border: 1px solid rgba(255,255,255,.24); background: rgba(10,6,24,.62); color: #fff;\n  font-family:'Futura',sans-serif; font-size: 12px; letter-spacing: .5px;\n  backdrop-filter: blur(4px);\n}\n.buy-zoom:hover { border-color: #cd9edf; }\n.buy-cap { font-family:'Futura',sans-serif; font-size: 12.5px; color: rgba(255,255,255,.62);\n  margin: 9px 2px 0; min-height: 1.2em; }\n.buy-thumbs { display: flex; gap: 9px; margin-top: 9px; overflow-x: auto;\n  scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 2px; }\n.buy-thumbs::-webkit-scrollbar { display: none; }\n/* Bare thumbnails too. Without a tile to light up, the live one is\n   marked by being the only one at full strength, with a rule under\n   it — a state that reads without drawing a box back on. */\n.buy-thumbs button {\n  flex: 0 0 auto; width: clamp(56px,14vw,74px); aspect-ratio: 1; cursor: pointer;\n  padding: 0 0 6px; background: none; border: 0; border-bottom: 2px solid transparent;\n  opacity: .45; transition: opacity .2s ease, border-color .2s ease;\n}\n.buy-thumbs button img { width: 100%; height: 100%; object-fit: contain; }\n.buy-thumbs button:hover { opacity: .8; }\n.buy-thumbs button.on { opacity: 1; border-bottom-color: #aa59c8; }\n\n/* ── The pitch ── */\n.buy-info { display: flex; flex-direction: column; }\n.buy-tags { list-style: none; display: flex; flex-wrap: wrap; gap: 7px; margin: 0 0 12px; padding: 0; }\n.buy-tags li { font-family:'Futura',sans-serif; font-size: 11.5px; letter-spacing: 1.6px;\n  text-transform: uppercase; color: #cd9edf; border: 1px solid rgba(170,89,200,.4);\n  background: rgba(170,89,200,.12); border-radius: 999px; padding: 3px 11px; white-space: nowrap; }\n.buy-title { font-family:'Norwester',sans-serif; font-variant: small-caps; letter-spacing: 1px;\n  font-size: clamp(30px,5vw,50px); color: #fff; line-height: 1.02; margin: 0 0 8px; }\n.buy-stars { display: flex; align-items: center; gap: 8px; font-family:'Futura',sans-serif;\n  font-size: 13px; color: rgba(255,255,255,.72); margin-bottom: 14px; }\n.buy-stars b { color: #ffb300; letter-spacing: 2px; font-weight: normal; }\n.buy-desc { font-family:'Futura',sans-serif; font-size: clamp(14.5px,1.9vw,16.5px);\n  line-height: 1.62; color: rgba(255,255,255,.84); margin: 0; }\n.buy-desc b { color: #fff; font-weight: normal; }\n/* Blocks rather than <br>: the break between sentences is then a\n   style with its own spacing, not a hard return in the prose. */\n.buy-desc-line { display: block; }\n.buy-desc-line + .buy-desc-line { margin-top: .38em; }\n/* A list nested under the description. A <ul> cannot live inside a\n   <p>, so it is a sibling — which means it needs the same order as\n   .buy-desc in the phone layout, or it would sort to the front. */\n.buy-desc-sub { list-style: none; margin: .5em 0 0; padding: 0 0 0 2px;\n  font-family:'Futura',sans-serif; font-size: clamp(14.5px,1.9vw,16.5px);\n  line-height: 1.62; color: rgba(255,255,255,.84); }\n.buy-desc-sub li { display: flex; gap: 9px; align-items: flex-start; }\n.buy-desc-sub li::before { content: '\\2014'; color: #aa59c8; flex: 0 0 auto; }\n.buy-points { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 9px; }\n.buy-points li { display: flex; gap: 10px; align-items: flex-start;\n  font-family:'Futura',sans-serif; font-size: 14.5px; line-height: 1.5; color: rgba(255,255,255,.82); }\n/* The marker, whatever it is — an emoji on one page, a dot on\n   another. Sized and coloured so a bullet does not read as text. */\n.buy-points li > span:first-child { flex: 0 0 auto; font-size: 15px; color: #aa59c8; }\n.buy-points li > span + span     { flex: 1 1 auto; min-width: 0; }\n.buy-points b { color: #fff; font-weight: normal; }\n.buy-link, .buy-points a { color: #cd9edf; text-decoration: underline;\n  text-underline-offset: 3px; text-decoration-thickness: 1px; }\n.buy-link:hover, .buy-points a:hover { color: #fff; }\n.buy-glossary { font-family:'Futura',sans-serif; font-size: 13.5px; margin: 14px 0 0;\n  color: rgba(255,255,255,.66); }\n\n.buy-price-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;\n  margin: clamp(18px,2.6vh,26px) 0 4px; }\n.buy-price { font-family:'Norwester',sans-serif; font-size: clamp(32px,5.4vw,46px); color: #fff; letter-spacing: 1px; }\n/* The list price struck out, then what it costs, then why. All three\n   products carry an offer now, so this lives here rather than in one\n   page's stylesheet. */\n.buy-price s { font-size: .52em; color: rgba(255,255,255,.42); margin-right: 10px; }\n.buy-price b { color: #cd9edf; font-weight: normal; }\n.buy-off {\n  font-family:'Futura',sans-serif; font-size: 13px; color: #ffb300;\n  border: 1px solid rgba(255,179,0,.4); background: rgba(255,179,0,.1);\n  border-radius: 999px; padding: 3px 11px; white-space: nowrap;\n}\n.buy-why { font-family:'Futura',sans-serif; font-size: 13.5px; color: #cd9edf;\n  background: none; border: 0; cursor: pointer; text-decoration: underline;\n  text-underline-offset: 3px; text-decoration-style: dashed; padding: 0; }\n.buy-tax { font-family:'Futura',sans-serif; font-size: 12.5px; color: rgba(255,255,255,.5); }\n/* The pincode box sits under the button. Capped so it does not run\n   the width of a desktop column — it is one short field. */\n.buy-eta { max-width: 340px; }\n@media (max-width: 999px) { .buy-eta { order: 7; margin-bottom: clamp(20px,3vh,28px); } }\n/* Under the pincode box, because a product page is otherwise a dead\n   end: whoever is not buying this one should still be able to see\n   what else there is. */\n.buy-more { margin: 14px 0 0; font-family:'Futura',sans-serif; font-size: 13.5px;\n  color: rgba(255,255,255,.6); }\n.buy-more a { color: #cd9edf; text-decoration: underline; text-underline-offset: 3px;\n  text-decoration-thickness: 1px; }\n.buy-more a:hover { color: #fff; }\n\n.buy-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap;\n  margin-top: clamp(16px,2.4vh,24px); }\n.buy-qty { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px;\n  border: 1px solid rgba(170,89,200,.45); background: rgba(170,89,200,.1); padding: 4px; }\n.buy-qty button { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 0;\n  background: none; color: #cd9edf; font-size: 17px; line-height: 1; }\n.buy-qty button:hover { background: rgba(170,89,200,.35); color: #fff; }\n.buy-qty b { min-width: 22px; text-align: center; font-family:'Norwester',sans-serif;\n  font-weight: normal; font-size: 16px; color: #fff; }\n.buy-heart { width: 44px; height: 44px; border-radius: 50%; cursor: pointer;\n  border: 1px solid rgba(255,255,255,.24); background: rgba(255,255,255,.04);\n  display: grid; place-items: center; transition: border-color .2s ease; }\n.buy-heart svg { width: 20px; height: 20px; fill: none; stroke: #e85d75; stroke-width: 1.8; }\n.buy-heart.on svg { fill: #e85d75; }\n.buy-heart:hover { border-color: #e85d75; }\n.buy-cta .btn-svg { width: 230px !important; }\n.buy-cta { margin-left: 0 !important; }\n/* The default label scales with the viewport, which on a fixed 230px\n   button runs the words out over the fins. Size it to the button. */\n.buy-cta .btn-label { font-size: 17px !important; letter-spacing: 2px !important; }\n/* The D-shape sits left of centre in the artwork; nudge so the whole\n   shape, fins included, is centred in the slot. */\n.buy-cta-slot { display: flex; justify-content: center; transform: translateX(7px); }\n\n/* ── Wide screens: the photo takes the whole left half ────── */\n@media (min-width: 1000px) {\n  .buy-wrap { max-width: none; padding: 0; grid-template-columns: 50% minmax(0,1fr);\n    gap: clamp(24px,3vw,52px); }\n  .buy-stage { height: min(76vh, 720px); }\n  .buy-cap, .buy-thumbs { padding-left: clamp(18px,3vw,44px); }\n  .buy-info { max-width: 660px; padding-right: clamp(20px,4vw,64px); }\n}\n/* Past a point the capped measure leaves the far right of the screen\n   empty and the block reads lopsided. Centre the column instead. */\n@media (min-width: 1600px) {\n  .buy-info { margin-inline: auto; padding-right: 0; }\n}\n\n/* ── Phones and tablets ────────────────────────────────────\n   Price and button come before the reading matter: someone who\n   already knows they want it should not have to scroll past the\n   pitch to buy. Everything shares one left edge, and the button\n   stretches to the column so nothing floats loose. */\n@media (max-width: 999px) {\n  .buy-tags      { order: 1; }\n  .buy-title     { order: 2; }\n  .buy-stars     { order: 3; }\n  .buy-price-row { order: 4; margin-top: 4px; }\n  .buy-tax       { order: 5; }\n  .buy-actions   { order: 6; margin-bottom: clamp(20px,3vh,28px); }\n  .buy-desc, .buy-desc-sub { order: 8; }\n  .buy-points    { order: 9; }\n  .buy-glossary  { order: 10; }\n\n  .buy-actions { flex-wrap: wrap; gap: 10px 12px; }\n  .buy-cta-slot { justify-content: flex-start; transform: none; }\n  .buy-heart { flex: 0 0 auto; }\n}\n/* On a phone the three controls will not share a row, so the stepper\n   takes one of its own and the button stretches to the column — its\n   left edge under the price, the heart's right edge under the text.\n   A grid rather than wrapping flex, because a flex-basis of 100% is\n   what puts the stepper on its own row and it also stretches it. */\n@media (max-width: 600px) {\n  .buy-actions { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; align-items: center; }\n  .buy-qty      { grid-column: 1 / -1; grid-row: 1; justify-self: start; }\n  .buy-cta-slot { grid-column: 1; grid-row: 2; }\n  .buy-heart    { grid-column: 2; grid-row: 2; }\n  .buy-cta .btn-svg   { width: 100% !important; max-width: 280px; }\n  .buy-cta .btn-label { font-size: 19px !important; }\n}\n\n/* ── Zoom ─────────────────────────────────────────────────── */\n.buy-lb {\n  position: fixed; inset: 0; z-index: 12000; display: none;\n  background: rgba(5,2,14,.94); backdrop-filter: blur(6px);\n  touch-action: none; overscroll-behavior: contain;\n}\n.buy-lb.open { display: block; }\n.buy-lb-img {\n  position: absolute; top: 50%; left: 50%; max-width: 94vw; max-height: 88vh;\n  transform-origin: center center; will-change: transform; cursor: grab;\n  user-select: none; -webkit-user-drag: none;\n}\n.buy-lb-img.grabbing { cursor: grabbing; }\n.buy-lb-bar {\n  position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;\n  display: flex; align-items: center; justify-content: center; gap: 10px;\n  padding: 14px 16px calc(14px + env(safe-area-inset-bottom));\n}\n.buy-lb-bar button, .buy-lb-x {\n  width: 42px; height: 42px; border-radius: 50%; cursor: pointer; color: #fff;\n  border: 1px solid rgba(255,255,255,.28); background: rgba(255,255,255,.08);\n  font-size: 19px; line-height: 1; display: grid; place-items: center;\n}\n.buy-lb-bar button:hover, .buy-lb-x:hover { background: rgba(170,89,200,.75); border-color: #cd9edf; }\n.buy-lb-x { position: absolute; top: 14px; right: 14px; z-index: 2; }\n.buy-lb-cap { position: absolute; top: 18px; left: 18px; right: 70px; z-index: 2;\n  font-family:'Futura',sans-serif; font-size: 13px; color: rgba(255,255,255,.72); }";

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.insertBefore(style, document.head.firstChild);

  /* ── One lightbox for the page, built the first time it is asked
     for. Every gallery on the page borrows it and tells it which
     photo set it is showing. ──────────────────────────────────── */
  var lb = null, lbImg, lbCap, lbShots = [], lbAt = 0, lbBack = null;
  var z = 1, tx = 0, ty = 0, pts = {}, span0 = 0, z0 = 1;

  function lbDraw() {
    lbImg.style.transform = 'translate(-50%,-50%) translate(' + tx + 'px,' + ty + 'px) scale(' + z + ')';
  }
  function lbShow(i) {
    lbAt = Math.max(0, Math.min(i, lbShots.length - 1));
    lbImg.src = lbShots[lbAt].src;
    lbImg.alt = lbShots[lbAt].alt || '';
    lbCap.textContent = (lbShots[lbAt].cap || '') + '  ·  ' + (lbAt + 1) + ' of ' + lbShots.length;
    z = 1; tx = 0; ty = 0; lbDraw();
  }
  function lbZoom(mult) {
    z = Math.max(1, Math.min(z * mult, 6));
    if (z === 1) { tx = 0; ty = 0; }
    lbDraw();
  }
  function lbClose() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if (lbBack) lbBack(lbAt);   /* leave the strip on whatever they were looking at */
  }

  function buildLb() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'buy-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo, zoomed');
    lb.innerHTML =
        '<p class="buy-lb-cap"></p>'
      + '<button type="button" class="buy-lb-x" aria-label="Close">&times;</button>'
      + '<img class="buy-lb-img" alt=""/>'
      + '<div class="buy-lb-bar">'
      +   '<button type="button" data-lb="prev" aria-label="Previous photo">&#8249;</button>'
      +   '<button type="button" data-lb="out"  aria-label="Zoom out">&minus;</button>'
      +   '<button type="button" data-lb="in"   aria-label="Zoom in">+</button>'
      +   '<button type="button" data-lb="next" aria-label="Next photo">&#8250;</button>'
      + '</div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('.buy-lb-img');
    lbCap = lb.querySelector('.buy-lb-cap');

    lb.querySelector('.buy-lb-x').addEventListener('click', lbClose);
    lb.querySelectorAll('[data-lb]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-lb');
        if (k === 'prev') lbShow(lbAt - 1);
        if (k === 'next') lbShow(lbAt + 1);
        if (k === 'in')   lbZoom(1.4);
        if (k === 'out')  lbZoom(1 / 1.4);
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    lb.addEventListener('wheel', function (e) {
      e.preventDefault();
      lbZoom(e.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     lbClose();
      if (e.key === 'ArrowRight') lbShow(lbAt + 1);
      if (e.key === 'ArrowLeft')  lbShow(lbAt - 1);
      if (e.key === '+' || e.key === '=') lbZoom(1.4);
      if (e.key === '-')                  lbZoom(1 / 1.4);
    });

    /* Drag to pan, double-tap to toggle. Panning is clamped to nothing
       in particular on purpose: the photo is allowed to leave the
       frame, because fighting a drag is more annoying than an
       off-centre picture. */
    var last = 0;
    lbImg.addEventListener('pointerdown', function (e) {
      var now = Date.now();
      /* Double click and double tap are the same gesture here, so this
         is done by hand — a dblclick listener as well would toggle the
         zoom twice on a desktop. */
      if (now - last < 300) { if (z > 1) { z = 1; tx = 0; ty = 0; lbDraw(); } else lbZoom(2.5); }
      last = now;
      if (z === 1) return;
      e.preventDefault();
      lbImg.setPointerCapture(e.pointerId);
      lbImg.classList.add('grabbing');
      var x0 = e.clientX - tx, y0 = e.clientY - ty;
      function move(ev) {
        if (Object.keys(pts).length > 1) return;   /* a pinch, not a drag */
        tx = ev.clientX - x0; ty = ev.clientY - y0; lbDraw();
      }
      function up() {
        lbImg.classList.remove('grabbing');
        lbImg.removeEventListener('pointermove', move);
        lbImg.removeEventListener('pointerup', up);
        lbImg.removeEventListener('pointercancel', up);
      }
      lbImg.addEventListener('pointermove', move);
      lbImg.addEventListener('pointerup', up);
      lbImg.addEventListener('pointercancel', up);
    });

    /* Two-finger pinch. */
    lb.addEventListener('pointerdown', function (e) { pts[e.pointerId] = e; });
    lb.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = e;
      var ids = Object.keys(pts);
      if (ids.length !== 2) return;
      var a = pts[ids[0]], b = pts[ids[1]];
      var span = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (!span0) { span0 = span; z0 = z; return; }
      z = Math.max(1, Math.min(z0 * span / span0, 6));
      lbDraw();
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      lb.addEventListener(ev, function (e) { delete pts[e.pointerId]; span0 = 0; });
    });
  }

  function lbOpen(shots, i, back) {
    buildLb();
    lbShots = shots; lbBack = back;
    lbShow(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* ── A gallery ─────────────────────────────────────────────
     A scroll-snap track rather than a swapped <img>: a phone then
     gets native swiping for free, and the arrows, the thumbnails and
     the zoom all drive the same one piece of state — which slide the
     track is scrolled to. ──────────────────────────────────────── */
  function gallery(mount, shots, badge) {
    var gal = typeof mount === 'string' ? document.querySelector(mount) : mount;
    if (!gal || !shots || !shots.length || gal.dataset.dkGal === '1') return;
    gal.dataset.dkGal = '1';

    gal.innerHTML =
        '<div class="buy-stage">'
      +   '<div class="buy-track" tabindex="0" role="group" aria-label="Product photos, swipe to browse"></div>'
      +   (badge ? '<span class="buy-badge">' + badge + '</span>' : '')
      +   '<button type="button" class="buy-arrow buy-prev" aria-label="Previous photo">&#8249;</button>'
      +   '<button type="button" class="buy-arrow buy-next" aria-label="Next photo">&#8250;</button>'
      +   '<button type="button" class="buy-zoom">&#128269; Zoom</button>'
      + '</div>'
      + '<p class="buy-cap"></p>'
      + '<div class="buy-thumbs" aria-label="Choose a photo"></div>';

    var track = gal.querySelector('.buy-track');
    var strip = gal.querySelector('.buy-thumbs');
    var cap   = gal.querySelector('.buy-cap');
    var prev  = gal.querySelector('.buy-prev');
    var next  = gal.querySelector('.buy-next');
    var at = 0, dragged = false;

    shots.forEach(function (sh, i) {
      var fig = document.createElement('figure');
      fig.className = 'buy-slide';
      fig.innerHTML = '<img src="' + sh.src + '" alt="' + (sh.alt || '') + '" loading="'
        + (i ? 'lazy' : 'eager') + '" decoding="async"/>';
      /* A swipe ends in a click too, so opening the zoom on any click
         would mean every swipe on a phone lands in the lightbox. */
      fig.addEventListener('click', function () { if (!dragged) lbOpen(shots, i, go); });
      track.appendChild(fig);

      var b = document.createElement('button');
      b.type = 'button';
      b.className = i ? '' : 'on';
      b.setAttribute('aria-label', sh.cap || ('Photo ' + (i + 1)));
      b.innerHTML = '<img src="' + sh.src + '" alt="" loading="lazy" decoding="async"/>';
      b.addEventListener('click', function () { go(i); });
      strip.appendChild(b);
    });

    function go(i) {
      at = Math.max(0, Math.min(i, shots.length - 1));
      track.scrollTo({ left: at * track.clientWidth, behavior: 'smooth' });
      paint();
    }
    function paint() {
      cap.textContent = shots[at].cap || '';
      strip.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('on', i === at); });
      /* Centre the live thumbnail in its own strip by hand. scrollIntoView
         would also scroll the page to reach it, which on a phone yanks the
         whole section about mid-swipe. */
      var t = strip.children[at];
      if (t) strip.scrollTo({ left: t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
      prev.disabled = at === 0;
      next.disabled = at === shots.length - 1;
    }

    /* The track is the source of truth: a swipe moves it, and this reads
       back where it landed rather than trying to guess from the gesture. */
    var settle;
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== at) { at = i; paint(); }
      }, 90);
    }, { passive: true });

    track.addEventListener('pointerdown', function (e) {
      dragged = false;
      var x0 = e.clientX, y0 = e.clientY;
      function watch(ev) { if (Math.abs(ev.clientX - x0) + Math.abs(ev.clientY - y0) > 10) dragged = true; }
      function done() {
        track.removeEventListener('pointermove', watch);
        track.removeEventListener('pointerup', done);
        track.removeEventListener('pointercancel', done);
      }
      track.addEventListener('pointermove', watch);
      track.addEventListener('pointerup', done);
      track.addEventListener('pointercancel', done);
    });

    prev.addEventListener('click', function () { go(at - 1); });
    next.addEventListener('click', function () { go(at + 1); });
    gal.querySelector('.buy-zoom').addEventListener('click', function () { lbOpen(shots, at, go); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(at - 1); }
    });
    paint();
  }

  /* ── Quantity and the heart ────────────────────────────────
     Wired from the markup, so a page only has to write the controls
     and never a line of script. The count is written onto the button
     as data-qty, which /cart.js reads when the click is delegated. */
  function wireActions() {
    document.querySelectorAll('.buy-actions').forEach(function (row) {
      if (row.dataset.dkWired === '1') return;
      row.dataset.dkWired = '1';
      var out = row.querySelector('.buy-qty b');
      var cta = row.querySelector('.buy-cta');
      var qty = 1;
      row.querySelectorAll('[data-qty-step]').forEach(function (b) {
        b.addEventListener('click', function () {
          qty = Math.min(Math.max(qty + (parseInt(b.getAttribute('data-qty-step'), 10) || 0), 1), 10);
          if (out) out.textContent = qty;
          if (cta) cta.setAttribute('data-qty', qty);
        });
      });

    });
  }

  /* The delivery estimate goes straight under the button, built by
     /cart.js so the drawer, the checkout form and every product block
     quote the same date from the same pincode.

     Its own pass, run late: this file is deferred ahead of /cart.js, so
     window.DK does not exist yet when the block is first wired. */
  function wireEta() {
    if (!window.DK || !DK.etaWidget) return;
    document.querySelectorAll('.buy-actions').forEach(function (row) {
      if (row.dataset.dkEtaAdded === '1') return;
      row.dataset.dkEtaAdded = '1';
      var eta = document.createElement('div');
      eta.className = 'buy-eta';
      row.parentNode.insertBefore(eta, row.nextSibling);
      DK.etaWidget(eta, { placeholder: 'Pincode for a delivery date' });
      var more = document.createElement('p');
      more.className = 'buy-more';
      more.innerHTML = 'Not sure this is the one? <a href="/">Check out our other products &rarr;</a>';
      eta.appendChild(more);
    });
  }

  /* Keep every heart in step with the wishlist, however it was changed. */
  function paintHearts() {
    if (!window.DK || !DK.wishRead) return;
    var on = DK.wishRead();
    document.querySelectorAll('.buy-heart[data-wish]').forEach(function (h) {
      h.classList.toggle('on', on.indexOf(h.getAttribute('data-wish')) > -1);
    });
  }
  window.addEventListener('load', paintHearts);
  document.addEventListener('DOMContentLoaded', wireEta);
  window.addEventListener('load', wireEta);
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-wish]')) setTimeout(paintHearts, 60);
  });

  /* ── Boot ── */
  function drain() {
    var q = window.dkProductQueue || [];
    while (q.length) {
      var c = q.shift();
      gallery(c.mount, c.shots, c.badge);
    }
    wireActions();
  }
  window.dkProductGallery = gallery;
  /* Drain what the page queued while it parsed FIRST — swapping the
     array for the eager object any earlier would throw those away. */
  drain();
  window.dkProductQueue = {
    push: function (c) { gallery(c.mount, c.shots, c.badge); wireActions(); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireActions);
})();
