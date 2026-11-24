/* ══════════════════════════════════════════════════════════════
   The site header — one definition, every page.

   The product pages (EscapeGravity, SCI., Evolution, the shop) each
   build their own bar, because their own scripts hang things off it:
   a scroll-in wordmark, an Order button, a section highlight. Those
   are left alone — this file only makes sure the corner reads
   DeepKids and goes home, which is the one thing every page shares.

   Every other page — the blog posts, the policies, About, Contact,
   the order screens — had a hand-written header each, or none at
   all. They get this one instead.

   Load it BEFORE cart.js and menu.js: both of them look for the bar
   and hang the cart, the wishlist and the menu button off it.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LOGO = 'Deep<b>Kids</b>';

  /* A bar the page built itself. Keep it, and keep its markup — those
     pages write the wordmark the same way and style it themselves, and
     their own scripts hang the cart and the order button off it. The
     one thing enforced here is where the corner goes.

     The test is the bar, not the wordmark: the SCI. page names its
     logo .nav-logo, and looking only for a wordmark class meant its
     whole nav was torn out and replaced. */
  if (document.querySelector('.eg-nav, .mast')) {
    var own = document.querySelector('.eg-nav-logo, .mast-logo, .nav-logo');
    if (own) {
      own.setAttribute('href', '/');
      own.setAttribute('aria-label', 'DeepKids home');
    }
    return;
  }

  var style = document.createElement('style');
  style.textContent = [
    /* The pages that never had a DeepKids bar never loaded the faces
       either — the blog posts and the policies among them. Declared
       here (and harmless where a page already declares them) so the
       header and the shared footer read the same on every page. */
    "@font-face{font-family:'Norwester';src:url('/norwester.ttf') format('truetype');",
      'font-weight:normal;font-style:normal;font-display:swap}',
    "@font-face{font-family:'Futura';src:url('/fonts/futura-book.otf') format('opentype');",
      'font-weight:400;font-style:normal;font-display:swap}',
    '.dkh {',
      'position:fixed;top:0;left:0;width:100%;z-index:1000;',
      'background:rgba(10,6,24,.72);',
      '-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);',
      'display:flex;align-items:center;justify-content:space-between;',
      'padding:0 clamp(14px,4vw,48px);height:48px;box-sizing:border-box;',
      'border-bottom:1px solid rgba(170,89,200,.2)}',
    '.dkh .eg-nav-logo{',
      "font-family:'Norwester',sans-serif;font-size:clamp(18px,2.4vw,26px);",
      'color:#aa59c8;text-decoration:none;letter-spacing:1px;white-space:nowrap}',
    '.dkh .eg-nav-logo b{color:#fff;font-weight:normal}',
    '.dkh .eg-nav-right{display:flex;align-items:center;gap:clamp(8px,1.6vw,16px)}',
    /* The bar is fixed, so the page has to start below it. */
    'body.dkh-on{padding-top:48px}',
    '@media (min-width:769px){',
      '.dkh{height:68px;padding:0 clamp(20px,4vw,56px)}',
      'body.dkh-on{padding-top:68px}}'
  ].join('');
  document.head.appendChild(style);

  var bar = document.createElement('nav');
  bar.className = 'dkh eg-nav';
  bar.setAttribute('aria-label', 'Site header');
  bar.innerHTML =
    '<a href="/" class="eg-nav-logo" aria-label="DeepKids home">' + LOGO + '</a>' +
    '<div class="eg-nav-right">' +
      '<button type="button" class="eg-nav-menu-btn" aria-label="Open menu" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</div>';

  /* Whatever the page had in that spot goes: one header, not two. */
  var old = document.querySelector('body > header, body > nav.nav');
  if (old) old.parentNode.removeChild(old);

  document.body.insertBefore(bar, document.body.firstChild);
  document.body.classList.add('dkh-on');
})();
