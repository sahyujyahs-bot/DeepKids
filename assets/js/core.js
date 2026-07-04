/* Internal-traffic kill switch: visit once with ?notrack to stop all
   analytics from this browser; ?track re-enables. */
window._egNoTrack = (function(){
  try {
    var q = new URLSearchParams(location.search);
    if (q.has('notrack')) localStorage.setItem('eg-notrack', '1');
    if (q.has('track')) localStorage.removeItem('eg-notrack');
    return localStorage.getItem('eg-notrack') === '1';
  } catch(e) { return false; }
})();

if (!window._egNoTrack) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GYJLZ0FVJE');
    // Google Ads — replace AW-XXXXXXXXX with your Ads conversion
    // ID once you create a Google Ads account. Until then this
    // line is a no-op placeholder.
    gtag('config', 'AW-11336704198');
}

// ─────────────────────────────────────────────

if (!window._egNoTrack) (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","xc1qgqypu0");

// ─────────────────────────────────────────────

if (!window._egNoTrack) { !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1960497127528559');
    fbq('track', 'PageView');
}

// ─────────────────────────────────────────────

/* ═══════════════════════════ EGAudio — unified audio module ══
   One shared AudioContext + helpers for every sound on the site:
   - loadBuffer/playBuffer  file-based one-shots via Web Audio
   - tone                   synth beeps (quiz, runner game, pops)
   - el/playEl/stopEl       HTMLAudio for longer/seekable sounds
   All play paths resume the context first (autoplay policy), and
   HTMLAudio elements are primed on the first user gesture (iOS). */
(function(){
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;

  // Asset URLs are site-root-relative; resolve against this file's
  // own location so pages at any depth (/, /clearedcode/) work.
  var script = document.querySelector('script[src*="assets/js/"]');
  var BASE = script ? script.getAttribute('src').replace(/assets\/js\/.*$/, '') : '';

  var shared = null;
  function ctx() {
    if (!AC) return null;
    if (!shared) {
      shared = new AC();
      // Auto-resume if the browser suspends the context after silence
      shared.onstatechange = function() {
        if (shared.state === 'suspended') shared.resume().catch(function(){});
      };
    }
    return shared;
  }

  function url(file) { return BASE + file; }

  function loadBuffer(file, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url(file), true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status === 200) ctx().decodeAudioData(xhr.response, cb);
    };
    xhr.send();
  }

  function playBuffer(buf, opts) {
    var ac = ctx();
    if (!buf || !ac) return;
    opts = opts || {};
    function start() {
      try {
        var src = ac.createBufferSource();
        src.buffer = buf;
        if (opts.rate) src.playbackRate.value = opts.rate;
        var gain = ac.createGain();
        gain.gain.value = opts.vol != null ? opts.vol : 0.5;
        src.connect(gain);
        gain.connect(ac.destination);
        src.start();
      } catch(e) {}
    }
    try {
      if (ac.state === 'suspended') ac.resume().then(start).catch(function(){});
      else start();
    } catch(e) {}
  }

  function tone(freq, dur, opts) {
    var ac = ctx();
    if (!ac) return;
    opts = opts || {};
    try {
      if (ac.state === 'suspended') ac.resume();
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = opts.type || 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      if (opts.slide) osc.frequency.linearRampToValueAtTime(opts.slide, ac.currentTime + dur);
      if (opts.expSlide) osc.frequency.exponentialRampToValueAtTime(opts.expSlide, ac.currentTime + (opts.expSlideDur || dur));
      gain.gain.setValueAtTime(opts.vol || 0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + (opts.stop || dur));
    } catch(e) {}
  }

  var htmlEls = [];
  function el(file) {
    var a = new Audio(url(file));
    a.preload = 'auto';
    htmlEls.push(a);
    return a;
  }
  function playEl(snd, vol) {
    try { snd.currentTime = 0; snd.volume = vol || 0.45; snd.play().catch(function(){}); } catch(e) {}
  }
  function stopEl(snd) {
    try { snd.pause(); snd.currentTime = 0; } catch(e) {}
  }
  // Overlapping plays of the same file (clone per play)
  function playElClone(snd, vol, stopAfterMs) {
    try {
      var c = snd.cloneNode();
      c.volume = vol;
      c.play().catch(function(){});
      if (stopAfterMs) setTimeout(function(){ try { c.pause(); } catch(e){} }, stopAfterMs);
    } catch(e) {}
  }

  var htmlUnlocked = false;
  function unlockHTMLAudio() {
    if (htmlUnlocked) return;
    htmlUnlocked = true;
    htmlEls.forEach(function(a) {
      try {
        var p = a.play();
        if (p && p.then) p.then(function(){ a.pause(); a.currentTime = 0; }).catch(function(){});
      } catch(e) {}
    });
  }
  function armAC() {
    if (shared && shared.state === 'suspended') shared.resume().catch(function(){});
  }
  ['pointerdown','touchstart','keydown'].forEach(function(ev) {
    document.addEventListener(ev, armAC, {passive: true, capture: true});
  });
  ['pointerdown','touchstart'].forEach(function(ev) {
    document.addEventListener(ev, unlockHTMLAudio, {passive: true, capture: true, once: true});
  });

  window.EGAudio = {
    ctx: ctx, url: url,
    loadBuffer: loadBuffer, playBuffer: playBuffer, tone: tone,
    el: el, playEl: playEl, stopEl: stopEl, playElClone: playElClone
  };
})();

/* ═══════════════════════════ Scroll-reveal helpers ══
   egToggleOnView — class follows visibility (on/off as it scrolls)
   egRevealOnce   — class added the first time it enters, then the
                    observer lets go; optional stagger delay per item.
   Both fall back to always-visible without IntersectionObserver. */
function egToggleOnView(els, className, threshold) {
  els = els.length !== undefined ? els : [els];
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add(className); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { e.target.classList.toggle(className, e.isIntersecting); });
  }, { threshold: threshold });
  els.forEach(function(el) { obs.observe(el); });
}
function egRevealOnce(els, className, threshold, staggerSec) {
  els = els.length !== undefined ? els : [els];
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add(className); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add(className);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: threshold });
  els.forEach(function(el, i) {
    if (staggerSec) el.style.transitionDelay = (i * staggerSec) + 's';
    obs.observe(el);
  });
}

// ─────────────────────────────────────────────

/* ═══════════════════════════ EGGravity — global environment ══
   One gravitational state for the whole page. Each environment
   sets g (gravity multiplier vs Earth) AND air (atmosphere
   density multiplier) — so on the Moon a feather falls like an
   apple (no drag) and a balloon stops floating (nothing to float
   in). Subscribers (hero physics, future sections) react live. */
window.EGGravity = (function(){
  'use strict';
  var ENVS = {
    earth: {
      key: 'earth', label: 'Earth', g: 1, air: 1,
      icon: '🌍', accent: '#7ec8ff',
      note: 'g = 9.8 m/s² — home settings.'
    },
    moon: {
      key: 'moon', label: 'Moon', g: 1/6, air: 0,
      icon: '🌙', accent: '#cfd8e3',
      note: 'g = 1.6 m/s², and NO air — watch the feather fall exactly like the apple, and the balloon drop: nothing to float in.'
    },
    mars: {
      key: 'mars', label: 'Mars', g: 0.38, air: 0.01,
      icon: '🪐', accent: '#ff8b5e',
      note: 'g = 3.7 m/s², air 1% of Earth’s — parachutes barely work here. Ask NASA.'
    },
    jupiter: {
      key: 'jupiter', label: 'Jupiter', g: 2.4, air: 3,
      icon: '🟠', accent: '#ffc46b',
      note: 'g = 24.8 m/s² at the cloud tops — there is no surface to stand on.'
    },
    iss: {
      key: 'iss', label: 'ISS', g: 0, air: 0,
      icon: '🛰️', accent: '#9fd0ff',
      note: 'Gravity here is still ~90% of Earth’s! Things float because the station is falling around Earth — freefall, not zero gravity.'
    }
  };
  var ORDER = ['earth', 'moon', 'mars', 'jupiter', 'iss'];
  var current = 'earth';
  var listeners = [];

  function get() { return ENVS[current]; }
  function set(key) {
    if (!ENVS[key] || key === current) return;
    current = key;
    document.documentElement.setAttribute('data-env', key);
    listeners.forEach(function(fn) { try { fn(ENVS[key]); } catch(e) {} });
  }
  function onChange(fn) { listeners.push(fn); }

  /* Dial UI — a rotating world dial. Worlds sit on a ring; choosing
     one turns the ring so that world lands under the pointer. */
  function buildDial() {
    var mount = document.getElementById('g-dial');
    if (!mount) return;
    mount.classList.add('gd');
    // Dock to a compact puck once the hero scrolls away, so the dial
    // stops competing with the content below (expands on hover/tap).
    var heroS1 = document.getElementById('s1');
    if (heroS1 && 'IntersectionObserver' in window) {
      new IntersectionObserver(function(entries) {
        mount.classList.toggle('docked', !entries[0].isIntersecting);
      }, { threshold: 0.05 }).observe(heroS1);
    }
    mount.addEventListener('click', function() {
      if (mount.classList.contains('docked')) mount.classList.toggle('open');
    });
    var html = '<div class="gd-pointer"></div><div class="gd-ring" id="gd-ring">';
    ORDER.forEach(function(k, i) {
      var e = ENVS[k];
      html += '<button class="gd-world' + (k === current ? ' active' : '') + '" data-env="' + k + '" data-i="' + i + '" aria-label="Set gravity to ' + e.label + '"><span>' + e.icon + '</span></button>';
    });
    html += '</div><div class="gd-hub"><div class="gd-name" id="gd-name"></div><div class="gd-g" id="gd-g"></div></div>';
    html += '<div class="g-dial-note" id="g-dial-note"></div>';
    mount.innerHTML = html;

    var ring = document.getElementById('gd-ring');
    var STEP = 360 / ORDER.length;
    var R = 44;   // ring radius in px (matches CSS size)

    function layout(rot) {
      ring.style.transform = 'rotate(' + rot + 'deg)';
      ring.querySelectorAll('.gd-world').forEach(function(btn) {
        var i = parseInt(btn.dataset.i, 10);
        var a = i * STEP;
        // place on ring; counter-rotate so icons stay upright
        btn.style.transform =
          'translate(-50%,-50%) rotate(' + a + 'deg) translate(0,' + (-R) + 'px) rotate(' + (-a - rot) + 'deg)';
      });
    }
    function updateHub() {
      var e = ENVS[current];
      var nameEl = document.getElementById('gd-name');
      var gEl = document.getElementById('gd-g');
      if (nameEl) nameEl.textContent = e.label;
      if (gEl) gEl.textContent = e.g === 0 ? 'freefall' : ('g × ' + (Math.round(e.g * 100) / 100));
    }
    function rotTo(key, animate) {
      var i = ORDER.indexOf(key);
      var rot = -i * STEP;
      ring.style.transition = animate ? 'transform 0.85s cubic-bezier(.34,1.4,.44,1)' : 'none';
      layout(rot);
      mount.querySelectorAll('.gd-world').forEach(function(b) {
        b.classList.toggle('active', b.dataset.env === key);
      });
      updateHub();
    }
    rotTo(current, false);

    mount.addEventListener('click', function(ev) {
      var btn = ev.target.closest('.gd-world');
      if (!btn) return;
      set(btn.dataset.env);
      rotTo(current, true);
      var note = document.getElementById('g-dial-note');
      if (note) {
        note.textContent = ENVS[current].note;
        note.classList.add('show');
        clearTimeout(note._t);
        note._t = setTimeout(function() { note.classList.remove('show'); }, 7000);
      }
      if (typeof gtag === 'function') gtag('event', 'gravity_dial', { event_category: 'engagement', env: current });
      if (typeof fbq === 'function') fbq('trackCustom', 'GravityDial', { env: current });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildDial);
  } else {
    buildDial();
  }

  return { get: get, set: set, onChange: onChange, ENVS: ENVS };
})();

/* ═══════════════════════════ EGCards — collectible force cards ══
   Five force cards hidden across the page, each in the section that
   teaches its concept. Collecting fills the HUD counter; the
   inventory persists (localStorage) and is the seed for the future
   board experience. */
window.EGCards = (function(){
  'use strict';
  // Cards begin AFTER "Why Parents Love It" (s-parents) and are hidden
  // through the sections that teach each concept.
  var CARDS = [
    { key: 'gravity',  icon: '🌍', name: 'Gravity',        section: 's-parents', note: 'The pull that starts every fall.' },
    { key: 'air',      icon: '🪶', name: 'Air Resistance', section: 's-forces',  note: 'The drag that slows the feather.' },
    { key: 'motion',   icon: '🌀', name: 'Sideways Motion',section: 's-spiral',  note: 'Fall sideways fast enough and you orbit.' },
    { key: 'force',    icon: '💪', name: 'Applied Force',  section: 's3',        note: 'Earned through challenges, spent on the board.' },
    { key: 'escape',   icon: '🚀', name: 'Escape',         section: 's-game',    note: 'Enough speed beats any gravity well.' }
  ];
  var KEY = 'eg-cards-v1';
  var got = {};
  try { got = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e) {}
  var listeners = [];

  function save() { try { localStorage.setItem(KEY, JSON.stringify(got)); } catch(e) {} }
  function count() { return CARDS.filter(function(c) { return got[c.key]; }).length; }
  function collect(key) {
    if (got[key]) return;
    got[key] = Date.now();
    save();
    listeners.forEach(function(fn) { try { fn(key); } catch(e) {} });
    if (typeof gtag === 'function') gtag('event', 'force_card_collected', { event_category: 'engagement', card: key, total: count() });
    if (typeof fbq === 'function') fbq('trackCustom', 'ForceCardCollected', { card: key });
  }

  // Fanned angles for the 5 hand slots (deg), centered
  var FAN = [-24, -12, 0, 12, 24];

  function buildHud() {
    var fan = document.getElementById('eh-cards');
    if (!fan) return;
    // popover inventory
    var pop = document.createElement('div');
    pop.id = 'card-hud-pop';
    document.body.appendChild(pop);

    function render() {
      // fanned hand of 5 slots
      fan.innerHTML = CARDS.map(function(c, i) {
        var have = !!got[c.key];
        return '<span class="eh-slot' + (have ? ' filled' : '') + '" data-key="' + c.key +
          '" style="transform:rotate(' + FAN[i] + 'deg) translateY(' + (Math.abs(FAN[i]) * 0.2) + 'px)">' +
          (have ? '' : '<i>' + c.icon + '</i>') + '</span>';
      }).join('');
      var n = count();
      fan.setAttribute('data-count', n + '/' + CARDS.length);
      fan.classList.toggle('complete', n === CARDS.length);
      pop.innerHTML = '<div class="chp-title">Force Cards &nbsp;·&nbsp; ' + n + '/' + CARDS.length + '</div>' +
        CARDS.map(function(c) {
          var have = !!got[c.key];
          return '<div class="chp-row' + (have ? ' have' : '') + '"><span>' + c.icon + '</span><b>' + c.name + '</b><i>' +
            (have ? c.note : 'still hidden further down…') + '</i></div>';
        }).join('') +
        (n === CARDS.length ? '<div class="chp-done">Full hand! These carry into the board game.</div>' : '');
    }
    render();
    listeners.push(function(key) {
      render();
      var slot = fan.querySelector('.eh-slot[data-key="' + key + '"]');
      if (slot) { slot.classList.add('pop'); setTimeout(function(){ slot.classList.remove('pop'); }, 700); }
    });
    var pill = document.getElementById('gp-pill');
    if (pill) pill.addEventListener('click', function() { pop.classList.toggle('show'); });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#gp-pill') && !e.target.closest('#card-hud-pop')) pop.classList.remove('show');
    });
  }

  function slotRect(key) {
    var slot = document.querySelector('#eh-cards .eh-slot[data-key="' + key + '"]');
    return slot ? slot.getBoundingClientRect() : { left: 24, top: innerHeight - 40, width: 26, height: 36 };
  }

  // Juicy collect: lift + "got it" beat, then arc-fly into the fan slot
  function flyToSlot(el, key) {
    var r = el.getBoundingClientRect();
    var dest = slotRect(key);
    var fly = document.createElement('div');
    fly.className = 'force-fly';
    fly.style.left = r.left + 'px';
    fly.style.top = r.top + 'px';
    fly.style.width = r.width + 'px';
    fly.style.height = r.height + 'px';
    document.body.appendChild(fly);
    // beat 1: pop up big
    requestAnimationFrame(function() {
      fly.style.transform = 'translateY(-26px) scale(1.35) rotate(-6deg)';
    });
    // beat 2: arc to the slot, shrink to card size
    setTimeout(function() {
      var dx = dest.left + dest.width / 2 - (r.left + r.width / 2);
      var dy = dest.top + dest.height / 2 - (r.top + r.height / 2);
      fly.style.transition = 'transform 0.62s cubic-bezier(.55,-0.2,.3,1), opacity 0.62s';
      fly.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.34) rotate(14deg)';
      fly.style.opacity = '0.15';
    }, 340);
    setTimeout(function() { fly.remove(); }, 1050);
  }

  function placeCards() {
    // varied placements so they feel hidden, not templated
    var spots = [
      { right: '7%',  top: '28%', rot: 8  }, { left: '6%', top: '34%', rot: -10 },
      { right: '9%',  top: '58%', rot: -6 }, { left: '7%', top: '60%', rot: 9  },
      { right: '6%',  top: '40%', rot: 5  }
    ];
    CARDS.forEach(function(c, i) {
      if (got[c.key]) return;
      var sec = document.getElementById(c.section);
      if (!sec) return;
      var el = document.createElement('button');
      el.className = 'force-pickup';
      el.setAttribute('aria-label', 'Collect the ' + c.name + ' force card');
      el.innerHTML = '<span class="fp-icon">' + c.icon + '</span><span class="fp-glint"></span>';
      el.style.animationDelay = (i * 0.5) + 's';
      var s = spots[i % spots.length];
      ['left','right','top'].forEach(function(k) { if (s[k] != null) el.style[k] = s[k]; });
      el.style.setProperty('--rot', s.rot + 'deg');
      if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      sec.appendChild(el);
      el.addEventListener('click', function() {
        if (window.egFlipSound) window.egFlipSound(0.4);
        flyToSlot(el, c.key);
        el.classList.add('taken');
        setTimeout(function() { el.remove(); }, 260);
        collect(c.key);
      });
    });
  }

  function intro() {
    // Announcement in the space below "Why Parents Love It" — this is
    // where the collection game begins.
    if (count() > 0) return;
    var host = document.getElementById('s-parents');
    if (!host || !('IntersectionObserver' in window)) return;
    var shown = false;
    new IntersectionObserver(function(entries) {
      if (!entries[0].isIntersecting || shown || count() > 0) return;
      shown = true;
      var t = document.createElement('div');
      t.id = 'card-callout';
      t.innerHTML = '<span class="cc-card"></span><div><b>Collect the 5 Force Cards</b><br>' +
        'They\'re hidden through the sections ahead — tap each one. Your hand fills up in the corner, and carries into the board game.</div>';
      document.body.appendChild(t);
      requestAnimationFrame(function() { t.classList.add('show'); });
      var hide = function() { t.classList.remove('show'); setTimeout(function() { if(t.parentNode) t.remove(); }, 600); };
      setTimeout(hide, 8000);
      listeners.push(hide);
    }, { threshold: 0.35 }).observe(host);
  }

  // Card collection is parked for the standalone game page — the
  // marketing page stays focused on reading + converting. The API
  // stays exported so the game page can reuse it later.
  var ENABLED = false;

  function init() {
    if (!ENABLED) return;
    buildHud();
    placeCards();
    intro();
    var opened = false;
    listeners.push(function() {
      if (opened || count() !== 1) return;
      opened = true;
      var pop = document.getElementById('card-hud-pop');
      if (pop) {
        pop.classList.add('show');
        setTimeout(function() { pop.classList.remove('show'); }, 3500);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { collect: collect, count: count, CARDS: CARDS, onChange: function(fn){ listeners.push(fn); } };
})();
