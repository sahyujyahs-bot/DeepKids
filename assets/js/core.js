window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GYJLZ0FVJE');
    // Google Ads — replace AW-XXXXXXXXX with your Ads conversion
    // ID once you create a Google Ads account. Until then this
    // line is a no-op placeholder.
    gtag('config', 'AW-11336704198');

// ─────────────────────────────────────────────

(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","xc1qgqypu0");

// ─────────────────────────────────────────────

!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1960497127528559');
    fbq('track', 'PageView');

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
