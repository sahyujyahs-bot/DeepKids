/* ══════════════════════════════════════════════════════════════
   The site menu — one definition, every page.
   Pages used to each carry their own hand-written dropdown, which is
   how the main page ended up with three near-identical glossary rows
   and how-to-play ended up missing half the site. This file owns the
   list, the markup, the styling and the current-page highlight, so
   there is exactly one place to change it.

   Drop-in: <script src="/menu.js" defer></script>. It finds the page's
   existing hamburger button if there is one and takes it over,
   otherwise it adds its own to whatever nav or header the page has.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Only EscapeGravity has children today. Adding a submenu to SCI. or
     Evolution later means adding a `kids` array here and nothing else. */
  var ITEMS = [
    { label: 'Shop', href: '/' },
    { label: 'EscapeGravity', href: '/escapegravity', kids: [
      { label: 'How To Play',       href: '/how-to-play'                },
      /* Both of these have a page of their own, so they point there
         rather than at the matching section on the main page — the row
         then highlights correctly when you are reading it. */
      { label: 'Learning Glossary', href: '/what-kids-learn#s-syllabus' },
      { label: 'The Science',       href: '/escapegravity#s4-science'    },
      { label: 'The Game',          href: '/escapegravity#s2'           }
    ]},
    { label: 'SCI.',                   href: '/sci'       },
    { label: 'Evolution Picture Book', href: '/evolution' },
    { label: 'Blog',                   href: '/blog'      },
    { label: 'About',                  href: '/about'     },
    { label: 'Contact',                href: '/contact'   }
  ];

  /* /how-to-play.html, /how-to-play/ and /how-to-play are the same page. */
  function path(u) {
    var p = String(u).split('#')[0].split('?')[0];
    p = p.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (p.length > 1) p = p.replace(/\/$/, '');
    return p || '/';
  }

  var here = path(location.pathname);

  var CSS = [
    '.dkm-btn{display:flex;flex-direction:column;justify-content:center;gap:5px;',
      'width:40px;height:40px;padding:8px;background:none;border:0;cursor:pointer;',
      '-webkit-tap-highlight-color:transparent}',
    '.dkm-btn span{display:block;height:2px;width:100%;border-radius:2px;background:#cd9edf;',
      'transition:transform .3s ease,opacity .2s ease}',
    '.dkm-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}',
    '.dkm-btn.open span:nth-child(2){opacity:0}',
    '.dkm-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}',

    /* Fixed, and outside every nav, so a nav backdrop-filter can't trap it
       in its own stacking context and slide it behind the hero. */
    '.dkm{position:fixed;top:var(--dkm-top,48px);right:clamp(10px,4vw,24px);z-index:4000;',
      'width:min(268px,84vw);max-height:calc(100vh - var(--dkm-top,48px) - 20px);overflow-y:auto;',
      '-webkit-overflow-scrolling:touch;overscroll-behavior:contain;',
      'display:flex;flex-direction:column;background:rgba(16,10,34,.98);',
      '-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);',
      'border:1px solid rgba(170,89,200,.45);border-radius:14px;padding:6px;',
      'box-shadow:0 18px 50px rgba(0,0,0,.6);opacity:0;transform:translateY(-8px) scale(.98);',
      'transform-origin:top right;pointer-events:none;',
      'transition:opacity .2s ease,transform .2s ease}',
    '.dkm.open{opacity:1;transform:none;pointer-events:auto}',

    '.dkm a,.dkm button.dkm-parent{display:flex;align-items:center;justify-content:space-between;',
      'width:100%;text-align:left;font-family:"Futura","Segoe UI",sans-serif;font-size:16px;',
      'letter-spacing:.5px;color:#efe6ff;text-decoration:none;padding:14px 16px;border:0;',
      'border-radius:10px;background:none;cursor:pointer;',
      'border-bottom:1px solid rgba(170,89,200,.16);',
      'transition:background .18s ease,color .18s ease}',
    '.dkm > :last-child{border-bottom:0}',
    '.dkm a::after{content:"\\203A";font-size:20px;line-height:1;color:rgba(205,158,223,.6);margin-left:12px}',
    '.dkm a:hover,.dkm a:active,.dkm button.dkm-parent:hover{background:rgba(170,89,200,.22);color:#fff}',

    /* The page you are on. Marked with a bar rather than only colour, so
       it still reads for anyone who can't separate the two purples. */
    '.dkm .dkm-here{background:rgba(170,89,200,.28);color:#fff;',
      'box-shadow:inset 3px 0 0 #cd9edf}',
    '.dkm .dkm-here::after{color:#fff}',

    '.dkm button.dkm-parent::after{content:"\\203A";font-size:20px;line-height:1;',
      'color:rgba(205,158,223,.6);margin-left:12px;transition:transform .22s ease}',
    '.dkm button.dkm-parent[aria-expanded="true"]::after{transform:rotate(90deg)}',
    '.dkm-sub{display:none;flex-direction:column;margin:2px 0 6px;padding-left:10px;',
      'border-left:1px solid rgba(170,89,200,.3)}',
    '.dkm-sub.open{display:flex}',
    '.dkm-sub a{font-size:14.5px;padding:11px 14px;color:#d9caf0}',

    '@media (min-width:769px){.dkm{--dkm-top:68px}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var panel = document.createElement('div');
  panel.className = 'dkm';
  panel.id = 'dkm';
  panel.setAttribute('role', 'navigation');
  panel.setAttribute('aria-label', 'Site menu');

  /* An anchor on the page you are already on should scroll, not reload.
     egLandOn (main page) re-corrects the landing after lazy artwork above
     finishes loading and shifts everything down. */
  function wire(a, href) {
    var hash = href.indexOf('#') > -1 ? href.slice(href.indexOf('#')) : '';
    if (!hash || path(href) !== here) return;
    a.setAttribute('href', hash);
    a.addEventListener('click', function (e) {
      var el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      close();
      if (window.egLandOn) window.egLandOn(el);
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  ITEMS.forEach(function (item) {
    var onThis = path(item.href) === here;

    if (!item.kids) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (onThis) { a.className = 'dkm-here'; a.setAttribute('aria-current', 'page'); }
      wire(a, item.href);
      panel.appendChild(a);
      return;
    }

    /* A parent row that both links and expands would be ambiguous on
       touch, so the row expands and its first child is the page itself. */
    var childHere = item.kids.some(function (k) { return path(k.href) === here; });
    var open = onThis || childHere;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dkm-parent' + (onThis ? ' dkm-here' : '');
    btn.textContent = item.label;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');

    var sub = document.createElement('div');
    sub.className = 'dkm-sub' + (open ? ' open' : '');

    var self = document.createElement('a');
    self.href = item.href;
    self.textContent = 'Overview';
    if (onThis) { self.className = 'dkm-here'; self.setAttribute('aria-current', 'page'); }
    sub.appendChild(self);

    /* A child is "here" when it lives on a different page from its parent
       and you are on that page. Same-page anchors (/#s2 under /) are not,
       or every anchor would light up at once on the main page. Two children
       can share a page — /what-kids-learn holds both the glossary and the
       price — so the hash breaks the tie, falling back to the first. */
    var onKid = item.kids.filter(function (k) {
      return path(k.href) === here && path(k.href) !== path(item.href);
    });
    var mark = onKid.length > 1
      ? (onKid.filter(function (k) { return k.href.indexOf(location.hash) > -1 && location.hash; })[0] || onKid[0])
      : onKid[0];

    item.kids.forEach(function (k) {
      var ka = document.createElement('a');
      ka.href = k.href;
      ka.textContent = k.label;
      if (k === mark) {
        ka.className = 'dkm-here';
        ka.setAttribute('aria-current', 'page');
      }
      wire(ka, k.href);
      sub.appendChild(ka);
    });

    btn.addEventListener('click', function () {
      var nowOpen = !sub.classList.contains('open');
      sub.classList.toggle('open', nowOpen);
      btn.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
    });

    panel.appendChild(btn);
    panel.appendChild(sub);
  });

  document.body.appendChild(panel);

  /* Take over the page's own hamburger if it has one; otherwise add ours
     to whatever bar the page uses. Either way there is only ever one. */
  var btn = document.querySelector('.eg-nav-menu-btn, .dkm-btn, #menu-btn');
  if (btn) {
    btn.className = (btn.className.replace(/\beg-nav-menu-btn\b/, '') + ' dkm-btn').trim();
    btn.onclick = null;
    if (!btn.querySelector('span')) btn.innerHTML = '<span></span><span></span><span></span>';
  } else {
    var bar = document.querySelector('.eg-nav .eg-nav-right, .eg-nav, nav.nav, header nav, header');
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dkm-btn';
    btn.innerHTML = '<span></span><span></span><span></span>';
    if (bar) {
      btn.style.marginLeft = 'auto';
      bar.appendChild(btn);
    } else {
      /* Pages with no bar of their own — 404, order confirmation. They
         still need a way out, so the button floats in the corner rather
         than the menu existing with nothing to open it. */
      btn.style.cssText = 'position:fixed;top:6px;right:clamp(10px,4vw,24px);z-index:4001';
      document.body.appendChild(btn);
    }
  }

  function open()  { if (!btn) return; panel.classList.add('open');    btn.classList.add('open');    btn.setAttribute('aria-expanded', 'true'); }
  function close() { if (!btn) return; panel.classList.remove('open'); btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

  if (btn) {
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-controls', 'dkm');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.contains('open') ? close() : open();
    });
  }

  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || (btn && btn.contains(e.target))) return;
    close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* Pages still call these by name from their own markup. */
  window.egToggleMenu = function () { panel.classList.contains('open') ? close() : open(); };
  window.egCloseMenu  = close;
})();
