/* ══════════════════════════════════════════════════════════════
   The DeepKids button — the D+K shape, one definition.

   Any element with a data-dk-btn attribute becomes one:
     <button type="button" data-dk-btn="Add To Cart" data-dk-size="sm">

   Lifted out of index.html so the shop uses the identical button
   rather than a look-alike. The stylesheet is prepended to <head>, not
   appended, so a page's own rules (nav width, submit width) still win.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CSS = '    /* ── DK button host: any element with data-dk-btn becomes one ── */\n    .dk-btn-host {\n      display: inline-block;\n      cursor: pointer;\n      background: none;\n      border: 0;\n      padding: 0;\n      margin: 0 !important;\n      font: inherit;\n      color: inherit;\n      -webkit-appearance: none;\n      appearance: none;\n    }\n    .dk-btn-host[data-dk-size="sm"]  .btn-svg { width: clamp(140px, 14vw, 200px); }\n    .dk-btn-host[data-dk-size="md"]  .btn-svg { width: clamp(180px, 22vw, 280px); }\n    .dk-btn-host[data-dk-size="lg"]  .btn-svg { width: clamp(220px, 32vw, 360px); }\n\n    /* ── DK-shape button (used for pre-order, launch, etc.) ───── */\n    .btn-wrap {\n      position: relative;\n      display: inline-block;\n      cursor: pointer;\n      animation: btn-bob 3.5s ease-in-out infinite;\n      filter: drop-shadow(0 0 14px rgba(170,89,200,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.4));\n      transition: filter .3s ease, transform .3s ease;\n      /* Shift right so the D-shape (not the K fins) is centered under text. */\n      margin-left: clamp(10px, 4vw, 42px);\n    }\n    .btn-wrap:hover  {\n      filter: drop-shadow(0 0 22px rgba(170,89,200,0.6)) drop-shadow(0 6px 18px rgba(0,0,0,0.5)) brightness(1.12);\n      transform: translateX(5px) scale(1.07);\n      animation: none;\n    }\n    .btn-wrap:active { transform: translateX(2px) scale(.97);                            animation: none; }\n    @keyframes btn-bob {\n      0%, 100% { transform: scale(1)    translateY(0);    filter: drop-shadow(0 0 14px rgba(170,89,200,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.4)); }\n      50%       { transform: scale(1.03) translateY(-4px); filter: drop-shadow(0 0 22px rgba(170,89,200,0.55)) drop-shadow(0 6px 18px rgba(0,0,0,0.5)); }\n    }\n    /* Inline button-wrap (inside forms, etc) — no margin shift, no native button styling */\n    .btn-wrap-inline {\n      margin-left: 0;\n      padding: 0;\n      border: none;\n      background: none;\n    }\n    .btn-svg {\n      display: block;\n      width: clamp(200px, 28vw, 360px);\n      height: auto;\n      overflow: visible;\n    }\n    /* Hide the dark-purple OUTER outline on every D+K button — we\'re\n       trialling the look without the thick border. Matched by\n       stroke-width so new thin inner outlines still render. */\n    .btn-svg path[stroke="#6b2155"][stroke-width="9"],\n    .btn-svg line[stroke="#6b2155"][stroke-width="20"] {\n      stroke: none !important;\n    }\n    .btn-label {\n      position: absolute; top: 50%; left: 38%;\n      transform: translate(-50%, -50%);\n      font-family: \'Norwester\', sans-serif;\n      font-weight: normal; font-style: normal; font-variant: small-caps;\n      font-size: clamp(15px, 2.2vw, 28px);\n      letter-spacing: clamp(1px, .5vw, 6px);\n      color: #fff;\n      text-shadow: 1px 1px 3px rgba(0,0,0,.7);\n      pointer-events: none;\n      white-space: nowrap;\n      max-width: 60%;\n      text-align: center;\n    }\n    .dk-btn-host[data-dk-size="sm"] .btn-label {\n      font-size: clamp(12px, 1.5vw, 18px);\n      letter-spacing: 1.5px;\n    }\n    .dk-btn-host[data-dk-size="md"] .btn-label {\n      font-size: clamp(14px, 1.8vw, 22px);\n      letter-spacing: 2.5px;\n    }\n';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.insertBefore(style, document.head.firstChild);

  var DK_GRAD_SEQ = 0;

  /* Colourways. The shape is fixed; the fill is not. data-dk-color picks
     one, defaulting to the site purple. `ink` is the label colour, because
     white type on the lime or the gold is unreadable. */
  var DK_COLORS = {
    purple: { top:'#cd9edf', mid:'#aa59c8', low:'#793194', fin:'#aa59c8', edge:'#6b2155', ink:'#fff',     shade:'rgba(0,0,0,.7)' },
    lime:   { top:'#e8fa9a', mid:'#c0e638', low:'#7c9f16', fin:'#c0e638', edge:'#4d660b', ink:'#0a0618', shade:'rgba(255,255,255,.35)' },
    gold:   { top:'#ffe0a3', mid:'#ffb300', low:'#b57a00', fin:'#ffb300', edge:'#7a5200', ink:'#0a0618', shade:'rgba(255,255,255,.35)' }
  };

  function dkButtonMarkup(label, colorName) {
    var c = DK_COLORS[colorName] || DK_COLORS.purple;
    var gid = 'dk-grad-' + (++DK_GRAD_SEQ);
    var hid = 'dk-hi-'  + DK_GRAD_SEQ;
    return ''
      + '<svg class="btn-svg" viewBox="0 0 360 108" xmlns="http://www.w3.org/2000/svg">'
      +   '<defs>'
      +     '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="' + c.top + '"/>'
      +       '<stop offset="45%" stop-color="' + c.mid + '"/>'
      +       '<stop offset="100%" stop-color="' + c.low + '"/>'
      +     '</linearGradient>'
      +     '<linearGradient id="' + hid + '" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>'
      +       '<stop offset="100%" stop-color="rgba(255,255,255,0)"/>'
      +     '</linearGradient>'
      +   '</defs>'
      +   '<line x1="268" y1="54" x2="324" y2="17" stroke="#6b2155" stroke-width="20" stroke-linecap="round"/>'
      +   '<line x1="268" y1="54" x2="324" y2="91" stroke="#6b2155" stroke-width="20" stroke-linecap="round"/>'
      +   '<path d="M 5,29 A 22,22 0 0,1 27,7 L 226,7 A 47,47 0 1,1 226,101 L 27,101 A 22,22 0 0,1 5,79 Z" fill="none" stroke="#6b2155" stroke-width="9"/>'
      +   '<path d="M 9,29 A 18,18 0 0,1 27,11 L 226,11 A 43,43 0 1,1 226,97 L 27,97 A 18,18 0 0,1 9,79 Z" fill="url(#' + gid + ')"/>'
      +   '<line x1="268" y1="54" x2="321" y2="19" stroke="' + c.fin + '" stroke-width="13" stroke-linecap="round"/>'
      +   '<line x1="268" y1="54" x2="321" y2="89" stroke="' + c.fin + '" stroke-width="13" stroke-linecap="round"/>'
      +   '<path d="M 20,20 A 14,14 0 0,1 32,14 L 218,14 A 36,36 0 0,1 248,32 L 30,32 A 12,12 0 0,1 20,20 Z" fill="url(#' + hid + ')"/>'
      +   '<path d="M 13,29 A 14,14 0 0,1 27,15 L 226,15 A 39,39 0 1,1 226,93 L 27,93 A 14,14 0 0,1 13,79 Z" fill="none" stroke="' + c.edge + '" stroke-width="1.5" stroke-linejoin="round"/>'
      +   '<line x1="268" y1="54" x2="321" y2="19" stroke="' + c.edge + '" stroke-width="1.5" stroke-linecap="round"/>'
      +   '<line x1="268" y1="54" x2="321" y2="89" stroke="' + c.edge + '" stroke-width="1.5" stroke-linecap="round"/>'
      + '</svg>'
      + '<span class="btn-label" style="color:' + c.ink + ';text-shadow:1px 1px 3px ' + c.shade + '">' + label + '</span>';
  }
  function hydrateDkBtn(host){
    if (!host || host.dataset.dkHydrated === '1') return;
    var label = host.getAttribute('data-dk-btn') || '';
    host.classList.add('btn-wrap', 'dk-btn-host');
    host.innerHTML = dkButtonMarkup(label, host.getAttribute('data-dk-color'));
    host.dataset.dkHydrated = '1';
  }
  function hydrateAllDkBtns(){
    document.querySelectorAll('[data-dk-btn]').forEach(hydrateDkBtn);
  }
  window.hydrateDkBtn = hydrateDkBtn;
  window.hydrateAllDkBtns = hydrateAllDkBtns;
  // Run once immediately for any markup already parsed,
  // and again on DOMContentLoaded to catch elements appearing after this script.
  hydrateAllDkBtns();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateAllDkBtns);
  }
})();
