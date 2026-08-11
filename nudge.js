/* ══════════════════════════════════════════════════════════════
   The cross-sell nudge — one definition for every page.

   A card that appears once per device, after someone has either
   lingered a while or read a good way down, pointing them at the
   next DeepKids title. The main page sends people to Evolution;
   so does the SCI. page. One file, so the timing, the once-only
   rule and the look cannot drift apart.

   A page queues its own copy:

     (window.dkNudgeQueue = window.dkNudgeQueue || []).push({
       key:   'evo-from-sci',        // localStorage key; unique per nudge
       badge: 'Launching next',
       title: 'The Story Of Evolution',
       sub:   'Four billion years as one continuous story.',
       img:   'sp-23.webp', alt: '…',
       href:  '/evolution', cta: 'See the book',
       note:  '₹2,499 · ₹2,124 on pre-order'
     });

   A queue rather than a direct call, because inline page scripts
   run while the document parses and this file is deferred.

   It holds off while the floating WhatsApp cue is on screen — two
   things shouting at once is worse than either.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CSS = [
    '.dkn { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center;',
      'justify-content: center; padding: 20px; background: rgba(0,0,0,.62); animation: dkn-bg .3s ease; }',
    '.dkn[hidden] { display: none; }',
    '@keyframes dkn-bg { from { opacity: 0; } to { opacity: 1; } }',
    '.dkn-card { position: relative; width: min(400px, 92vw); text-align: center; overflow: hidden;',
      'background: radial-gradient(120% 130% at 50% -10%, rgba(255,179,0,.14), transparent 55%),',
      'linear-gradient(165deg, rgba(24,12,44,.99), rgba(34,17,58,.99));',
      'border: 1px solid rgba(205,158,223,.5); border-radius: 22px; padding: 0 0 26px;',
      'box-shadow: 0 24px 70px rgba(0,0,0,.7), 0 0 32px rgba(170,89,200,.25);',
      'animation: dkn-in .32s cubic-bezier(.2,.8,.2,1); }',
    '@keyframes dkn-in { from { opacity: 0; transform: translateY(22px) scale(.96); } to { opacity: 1; transform: none; } }',
    '.dkn-x { position: absolute; top: 7px; right: 13px; z-index: 2; background: rgba(10,6,24,.55);',
      'border: none; color: rgba(255,255,255,.8); font-size: 24px; line-height: 1; cursor: pointer;',
      'width: 32px; height: 32px; border-radius: 50%; }',
    '.dkn-x:hover { color: #fff; background: rgba(10,6,24,.85); }',
    '.dkn-img { width: 100%; height: clamp(150px, 30vh, 210px); object-fit: cover; display: block;',
      'border-bottom: 1px solid rgba(205,158,223,.28); }',
    '.dkn-body { padding: 20px 24px 0; }',
    '.dkn-badge { font-family: "Futura", sans-serif; font-size: 11.5px; letter-spacing: 2.5px;',
      'text-transform: uppercase; color: #ffb300; }',
    '.dkn-title { font-family: "Norwester", sans-serif; font-variant: small-caps;',
      'font-size: clamp(23px, 5.6vw, 29px); color: #fff; margin: 6px 0; letter-spacing: .5px; line-height: 1.08; }',
    '.dkn-sub { font-family: "Futura", sans-serif; font-size: 14px; color: rgba(255,255,255,.8);',
      'line-height: 1.55; margin-bottom: 16px; }',
    '.dkn-go { display: inline-block; text-decoration: none; cursor: pointer;',
      'font-family: "Norwester", sans-serif; font-variant: small-caps; letter-spacing: 2px; font-size: 16px;',
      'color: #fff; background: linear-gradient(180deg,#cd9edf 0%,#aa59c8 45%,#793194 100%);',
      'border-radius: 999px; padding: 11px 26px; transition: filter .2s ease; }',
    '.dkn-go:hover { filter: brightness(1.1); }',
    '.dkn-note { font-family: "Futura", sans-serif; font-size: 13px; color: rgba(255,255,255,.62); margin-top: 12px; }',
    '.dkn-note s { color: rgba(255,255,255,.4); }',
    '.dkn-note b { color: #cd9edf; font-weight: normal; }',
    '.dkn-alt { font-family: "Futura", sans-serif; font-size: 13px; color: rgba(255,255,255,.7);',
      'margin-top: 14px; padding-top: 13px; border-top: 1px solid rgba(255,255,255,.12); }',
    '.dkn-alt a { color: #cd9edf; text-decoration: none; border-bottom: 1px dashed rgba(205,158,223,.5); }',
    '.dkn-alt a:hover { color: #fff; }'
  ].join('');

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.insertBefore(style, document.head.firstChild);

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function track(name, label) {
    if (window.egGtag) window.egGtag('event', name, { event_category: 'engagement', event_label: label });
  }

  function build(c) {
    if (!c || !c.key) return;

    var seen = false;
    try { seen = localStorage.getItem('dkn-' + c.key) === '1'; } catch (e) {}
    if (seen) return;

    var el = document.createElement('div');
    el.className = 'dkn';
    el.hidden = true;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', c.title || 'Also from DeepKids');
    el.innerHTML =
        '<div class="dkn-card">'
      +   '<button type="button" class="dkn-x" aria-label="Close">&times;</button>'
      +   (c.img ? '<img class="dkn-img" src="' + esc(c.img) + '" alt="' + esc(c.alt) + '" loading="lazy" decoding="async"/>' : '')
      +   '<div class="dkn-body">'
      +     (c.badge ? '<span class="dkn-badge">' + esc(c.badge) + '</span>' : '')
      +     '<div class="dkn-title">' + esc(c.title) + '</div>'
      +     (c.sub ? '<p class="dkn-sub">' + c.sub + '</p>' : '')
      +     '<a class="dkn-go" href="' + esc(c.href) + '">' + esc(c.cta || 'Have a look') + '</a>'
      +     (c.note ? '<p class="dkn-note">' + c.note + '</p>' : '')
      +     (c.alt2 ? '<p class="dkn-alt">' + c.alt2 + '</p>' : '')
      +   '</div>'
      + '</div>';
    document.body.appendChild(el);

    function markSeen() {
      seen = true;
      try { localStorage.setItem('dkn-' + c.key, '1'); } catch (e) {}
    }
    function close() { el.hidden = true; }
    function open() {
      if (seen || !el.hidden) return;
      /* Never on top of the WhatsApp cue — try again once it has gone. */
      var cue = document.getElementById('eg-wa-cue');
      if (cue && cue.classList.contains('visible')) { setTimeout(open, 4000); return; }
      markSeen();
      el.hidden = false;
      track('nudge_shown', c.key);
    }

    el.querySelector('.dkn-x').addEventListener('click', close);
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !el.hidden) close();
    });
    el.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () { markSeen(); track('nudge_click', c.key); });
    });

    setTimeout(open, c.delay || 45000);
    var deep = c.scrolls || 3;
    window.addEventListener('scroll', function onScroll() {
      if (seen) { window.removeEventListener('scroll', onScroll); return; }
      if (window.scrollY > innerHeight * deep) {
        window.removeEventListener('scroll', onScroll);
        open();
      }
    }, { passive: true });
  }

  function drain() {
    var q = window.dkNudgeQueue || [];
    while (q.length) build(q.shift());
  }
  window.dkNudge = build;
  drain();                                    /* whatever the page queued while parsing */
  window.dkNudgeQueue = { push: build };      /* only after, or those would be lost */
})();
