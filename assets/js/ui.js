(function(){
  'use strict';

  /* ── Global button click sound ─────────────────────────────
     Regular click sound for tabs, arrows, quiz buttons, etc.
     CTA buttons (Pre-Order, Sign Up, Count Me In) get a special
     celebratory chime instead. */
  var btnClickSound = EGAudio.el('button click sound.wav');

  // Celebratory chime for CTA buttons (Web Audio — rising arpeggio)
  function playCtaChime() {
    try {
      var ac = EGAudio.ctx();
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      var notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      var t0 = ac.currentTime;
      notes.forEach(function(freq, i) {
        var osc = ac.createOscillator();
        var gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t0 + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.15, t0 + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t0 + i * 0.09);
        osc.stop(t0 + i * 0.09 + 0.4);
      });
    } catch(e) {}
  }

  // CTA selectors — Pre-Order, Sign Up, Count Me In, Notify
  var CTA_SEL = '.btn-wrap[onclick*="doPreOrder"], .eg-mobile-preorder-btn, .eg-nav-cta, .po-submit, [onclick*="openPlayTest"]';
  // All other interactive elements
  var BTN_SEL = 'button, .btn-wrap, .dk-btn-host, .s2-tab, .s2-arrow, .s2-bubble-link, .quiz-start-btn, .quiz-opt, .quiz-next, .quiz-restart, [data-dk-btn]';

  document.addEventListener('click', function(e) {
    var t = e.target;
    // CTA buttons get the celebratory chime
    if (t.closest(CTA_SEL)) {
      playCtaChime();
      return;
    }
    // Everything else gets the standard click sound
    if (t.closest(BTN_SEL)) {
      EGAudio.playElClone(btnClickSound, 0.4);
    }
  }, true);

  /* ── Hydrate every [data-dk-btn] element into a DK SVG button ── */
  var DK_GRAD_SEQ = 0;
  function dkButtonMarkup(label) {
    var gid = 'dk-grad-' + (++DK_GRAD_SEQ);
    var hid = 'dk-hi-'  + DK_GRAD_SEQ;
    return ''
      + '<svg class="btn-svg" viewBox="0 0 360 108" xmlns="http://www.w3.org/2000/svg">'
      +   '<defs>'
      +     '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">'
      +       '<stop offset="0%" stop-color="#cd9edf"/>'
      +       '<stop offset="45%" stop-color="#aa59c8"/>'
      +       '<stop offset="100%" stop-color="#793194"/>'
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
      +   '<line x1="268" y1="54" x2="321" y2="19" stroke="#aa59c8" stroke-width="13" stroke-linecap="round"/>'
      +   '<line x1="268" y1="54" x2="321" y2="89" stroke="#aa59c8" stroke-width="13" stroke-linecap="round"/>'
      +   '<path d="M 20,20 A 14,14 0 0,1 32,14 L 218,14 A 36,36 0 0,1 248,32 L 30,32 A 12,12 0 0,1 20,20 Z" fill="url(#' + hid + ')"/>'
      +   '<path d="M 13,29 A 14,14 0 0,1 27,15 L 226,15 A 39,39 0 1,1 226,93 L 27,93 A 14,14 0 0,1 13,79 Z" fill="none" stroke="#6b2155" stroke-width="1.5" stroke-linejoin="round"/>'
      +   '<line x1="268" y1="54" x2="321" y2="19" stroke="#6b2155" stroke-width="1.5" stroke-linecap="round"/>'
      +   '<line x1="268" y1="54" x2="321" y2="89" stroke="#6b2155" stroke-width="1.5" stroke-linecap="round"/>'
      + '</svg>'
      + '<span class="btn-label">' + label + '</span>';
  }
  function hydrateDkBtn(host){
    if (!host || host.dataset.dkHydrated === '1') return;
    var label = host.getAttribute('data-dk-btn') || '';
    host.classList.add('btn-wrap', 'dk-btn-host');
    host.innerHTML = dkButtonMarkup(label);
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

  /* ── IntersectionObserver for fade-in animations ─────────── */
  egToggleOnView(document.querySelectorAll('.eg-fade-in'), 'visible', 0.1);

  /* ── Section-view tracking for retargeting ──────────────── */
  var trackedSections = {};
  var sectionObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !trackedSections[e.target.id]) {
        trackedSections[e.target.id] = true;
        if (typeof gtag === 'function') gtag('event', 'section_view', { event_category: 'scroll_depth', section: e.target.id });
        if (typeof fbq === 'function') fbq('trackCustom', 'SectionView', { section: e.target.id });
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('section[id]').forEach(function(s) { sectionObs.observe(s); });

  /* ── Newsletter form ─────────────────────────────────────── */
  const form = document.getElementById('s6-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      alert('Thank you for joining the mission! We\u2019ll send you launch updates.');
      form.reset();
    });
  }
})();

// ─────────────────────────────────────────────

(function(){
  'use strict';

  // Small, pointer-feeling cursor. CSS cursors render at native pixel
  // size, so the canvas size IS the on-screen size in CSS px.
  // Bigger on desktop for better visibility, smaller on mobile
  var SIZE = (window.innerWidth > 768) ? 72 : 48;
  var HALF = SIZE / 2;

  /* ── Offscreen canvas for drawing the spiral ───────────── */
  var offCv = document.createElement('canvas');
  offCv.width = SIZE; offCv.height = SIZE;
  var offCtx = offCv.getContext('2d');
  offCtx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in offCtx) offCtx.imageSmoothingQuality = 'high';

  /* ── Spiral source image (the EscapeGravity board, no text) ─ */
  var spiralImg = new Image();
  spiralImg.crossOrigin = 'anonymous';
  var spiralPrepped = null;   // pre-downscaled high-quality copy of the source
  var spiralLoaded = false;
  spiralImg.onload = function() {
    // Pre-downsample the source through 2 stages for crispness.
    // Stage 1 is larger on desktop (360px) for the bigger cursor.
    var s1 = document.createElement('canvas');
    var s1Size = SIZE > 48 ? 360 : 240;
    s1.width = s1Size; s1.height = s1Size;
    var c1 = s1.getContext('2d');
    c1.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in c1) c1.imageSmoothingQuality = 'high';
    c1.drawImage(spiralImg, 0, 0, s1Size, s1Size);

    var s2 = document.createElement('canvas');
    s2.width = SIZE * 2; s2.height = SIZE * 2;   // 96px stable working copy
    var c2 = s2.getContext('2d');
    c2.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in c2) c2.imageSmoothingQuality = 'high';
    c2.drawImage(s1, 0, 0, SIZE * 2, SIZE * 2);

    spiralPrepped = s2;
    spiralLoaded = true;
    applyCursor(currentAngle);
  };
  spiralImg.src = EGAudio.url('spiral-board-cursor.webp');

  /* ── Draw the spiral at a given rotation angle (no border) ── */
  function drawSpiralAt(angle) {
    offCtx.save();
    offCtx.clearRect(0, 0, SIZE, SIZE);
    if (!spiralLoaded || !spiralPrepped) { offCtx.restore(); return; }

    // Round clip mask so the cursor reads as a clean disc
    offCtx.beginPath();
    offCtx.arc(HALF, HALF, HALF, 0, Math.PI * 2);
    offCtx.closePath();
    offCtx.clip();

    offCtx.translate(HALF, HALF);
    offCtx.rotate(angle);

    // Crop transparent padding from the prepped copy so artwork fills disc
    try {
      var sw = spiralPrepped.width;
      var sh = spiralPrepped.height;
      var crop = 0.05;
      var sx = sw * crop, sy = sh * crop;
      var sW = sw * (1 - crop * 2), sH = sh * (1 - crop * 2);
      offCtx.drawImage(spiralPrepped, sx, sy, sW, sH, -HALF, -HALF, SIZE, SIZE);
    } catch (e) {}

    offCtx.restore();
  }

  /* ── State ──────────────────────────────────────────────── */
  var currentAngle = 0;       // current visual rotation (radians)
  var targetAngle = 0;        // target to animate towards
  var animating = false;
  var clickDir = 1;           // alternates: +1 / -1
  var dblClickDir = 1;        // alternates for double-click
  var scrollAccum = 0;        // accumulated scroll delta

  /* ── Generate cursor URL at a given angle ──────────────── */
  function cursorAtAngle(angle) {
    drawSpiralAt(angle);
    try {
      return offCv.toDataURL('image/png');
    } catch (e) {
      // Tainted canvas (CORS) — fall back to default cursor
      return null;
    }
  }

  // Cache cursor: only regenerate when angle changes by > 0.5 rad (~29°)
  // toDataURL() is very expensive (PNG encode) — skip most updates
  var lastCursorAngle = -999;
  var lastCursorUrl = null;
  function applyCursor(angle) {
    if (!spiralLoaded) return;
    if (Math.abs(angle - lastCursorAngle) < 0.5 && lastCursorUrl) {
      return;
    }
    lastCursorAngle = angle;
    var url = cursorAtAngle(angle);
    if (!url) { document.body.style.cursor = 'auto'; return; }
    lastCursorUrl = url;
    document.body.style.cursor = 'url(' + url + ') ' + HALF + ' ' + HALF + ', auto';
  }

  /* ── Smooth animation loop ─────────────────────────────── */
  function animateCursor() {
    if (!animating) return;
    var diff = targetAngle - currentAngle;
    if (Math.abs(diff) < 0.1) {
      currentAngle = targetAngle;
      applyCursor(currentAngle);
      animating = false;
      return;
    }
    currentAngle += diff * 0.4;
    applyCursor(currentAngle);
    requestAnimationFrame(animateCursor);
  }

  // Spiral sounds — custom envelopes, so these talk to the shared
  // context directly rather than going through EGAudio.playBuffer.
  var spiralWhirr = null;
  var spinSoundBuf = null;
  EGAudio.loadBuffer('spin sound.wav', function(buf) { spinSoundBuf = buf; });

  // Play spin sound.wav (scroll turns) — only first 1s, with fade
  var spinPlaying = false;
  function playSpinSound() {
    var ac = EGAudio.ctx();
    if (!spinSoundBuf || !ac || spinPlaying) return;
    spinPlaying = true;
    function _start() {
      try {
        var src = ac.createBufferSource();
        src.buffer = spinSoundBuf;
        var gain = ac.createGain();
        var t = ac.currentTime;
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.setValueAtTime(0.3, t + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
        src.connect(gain);
        gain.connect(ac.destination);
        src.start(0, 0, 1.0);
        setTimeout(function() { spinPlaying = false; }, 1500);
      } catch(e) { spinPlaying = false; }
    }
    try {
      if (ac.state === 'suspended') {
        ac.resume().then(_start).catch(function(){ spinPlaying = false; });
      } else {
        _start();
      }
    } catch(e) { spinPlaying = false; }
  }

  // Synthesized whirr (for click/dblclick spins)
  function startSpiralSound(duration) {
    try {
      var ac = EGAudio.ctx();
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      if (spiralWhirr) { try { spiralWhirr.osc.stop(); } catch(x){} spiralWhirr = null; }
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      var t = ac.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + duration);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.setValueAtTime(0.06, t + duration * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + duration);
      spiralWhirr = { osc: osc };
    } catch(e) {}
  }

  function spinTo(angle) {
    targetAngle = angle;
    if (!animating) {
      animating = true;
      animateCursor();
    }
  }

  /* ── Visibility gate: only rotate + sound when spiral section
       is in the viewport ─────────────────────────────────────── */
  var spiralSectionVisible = false;
  var spiralSection = document.getElementById('s-spiral');
  if (spiralSection) {
    var spObs = new IntersectionObserver(function(entries) {
      spiralSectionVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    spObs.observe(spiralSection);
  }

  /* ── Scroll: rotate with scroll direction ──────────────── */
  var scrollTimer;
  window.addEventListener('wheel', function(e) {
    scrollAccum += e.deltaY;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() { scrollAccum = 0; }, 150);
    targetAngle += e.deltaY * 0.003;
    if (!animating) {
      animating = true;
      animateCursor();
    }
    if (spiralSectionVisible) playSpinSound();
  }, { passive: true });

  /* ── Touch scroll rotation ─────────────────────────────── */
  var lastTouchY = 0;
  document.addEventListener('touchstart', function(e) {
    lastTouchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    var dy = lastTouchY - e.touches[0].clientY;
    lastTouchY = e.touches[0].clientY;
    targetAngle += dy * 0.008;
    if (!animating) {
      animating = true;
      animateCursor();
    }
    if (spiralSectionVisible) playSpinSound();
  }, { passive: true });

  /* ── Click: 1 full spin, alternating direction ─────────── */
  document.addEventListener('click', function(e) {
    spinTo(currentAngle + clickDir * Math.PI * 2);
    clickDir *= -1;
    // Sound only when clicking inside the spiral section itself
    if (spiralSectionVisible && spiralSection && spiralSection.contains(e.target)) startSpiralSound(1.8);
  });

  /* ── Double-click: 5 full spins, alternating direction ─── */
  document.addEventListener('dblclick', function(e) {
    e.preventDefault();
    spinTo(currentAngle + dblClickDir * Math.PI * 2 * 5);
    dblClickDir *= -1;
    if (spiralSectionVisible && spiralSection && spiralSection.contains(e.target)) startSpiralSound(5.0);
  });

  /* ── Set initial cursor ─────────────────────────────────── */
  applyCursor(0);

})();

// ─────────────────────────────────────────────

(function(){
  var el = document.getElementById('eg-mobile-preorder');
  var navPt = document.querySelector('.eg-nav-playtest');
  var navCta = document.querySelector('.eg-nav-cta');

  function toggle(){
    var past = window.pageYOffset > window.innerHeight * 0.85;
    if (el) {
      el.classList.toggle('visible', past);
      el.setAttribute('aria-hidden', past ? 'false' : 'true');
    }
    if (navPt) navPt.classList.toggle('show', past);
    if (navCta) navCta.classList.toggle('show', past);
  }
  window.addEventListener('scroll', toggle, {passive: true});
  window.addEventListener('resize', toggle);
  toggle();
})();

// ─────────────────────────────────────────────

(function(){
  'use strict';
  /* Cue helpers — show on first viewport intersection, fade after a
     timeout or when the user interacts with the relevant element. */
  var DEFAULT_TIMEOUT = 6000;

  function show(el)    { if (el) { el.classList.add('visible'); el.classList.remove('dismissed'); } }
  function dismiss(el) { if (el) { el.classList.remove('visible'); el.classList.add('dismissed'); } }

  function watchInView(el, onEnter, threshold) {
    if (!el || !('IntersectionObserver' in window)) { if (onEnter) onEnter(); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          io.unobserve(e.target);
          if (onEnter) onEnter();
        }
      });
    }, { threshold: threshold || 0.35 });
    io.observe(el);
  }

  /* ── Tab hand-holding for sections that have tab groups ── */
  (function(){
    var groups = [
      { selector: '#s3 .s2-tabs', label: 'Tap each step to walk through a turn' },
      { selector: '#s4b-turns .s2-tabs', label: 'Switch examples to see different turns' },
      { selector: '#s6b-gravity .s2-tabs', label: 'Tap a tile to see its gravity well' }
    ];
    groups.forEach(function(g){
      var holder = document.querySelector(g.selector);
      if (!holder) return;
      var section = holder.closest('section');
      if (!section) return;
      // Make sure the section is the positioning context
      var cs = window.getComputedStyle(section);
      if (cs.position === 'static') section.style.position = 'relative';

      var cue = document.createElement('div');
      cue.className = 'eg-cue eg-cue-top';
      cue.textContent = g.label;
      cue.style.top = 'auto';
      // Anchor the cue just under the tabs
      function place(){
        var hr = holder.getBoundingClientRect();
        var sr = section.getBoundingClientRect();
        var top = (hr.bottom - sr.top) + 8;
        cue.style.top = top + 'px';
      }
      section.appendChild(cue);
      // Pulse the inactive tabs in the group
      var tabs = holder.querySelectorAll('.s2-tab');
      tabs.forEach(function(t){ if (!t.classList.contains('active')) t.classList.add('eg-tab-pulse'); });
      function clearPulse(){ tabs.forEach(function(t){ t.classList.remove('eg-tab-pulse'); }); }

      watchInView(holder, function(){
        place();
        show(cue);
        setTimeout(function(){ dismiss(cue); }, DEFAULT_TIMEOUT);
      }, 0.5);

      tabs.forEach(function(t){
        t.addEventListener('click', function(){
          dismiss(cue);
          clearPulse();
        }, { once: true });
      });
      window.addEventListener('resize', place);
    });
  })();

  /* ── Horizontal scroll swipe cue ──────────────────── */
  (function(){
    // Find every scroll container we want to hint at
    var selectors = [
      '.spiral-row-mobile',
      '.forces-cards',
      '.exp-grid',
      '.parents-stories',
      '.ps-reasons',
      '.unlearn-grid'
    ];
    var els = [];
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){ els.push(el); });
    });
    // Filter to only elements that actually scroll horizontally
    function isScrollable(el){
      return el.scrollWidth - el.clientWidth > 12;
    }

    els.forEach(function(scroller){
      // Anchor the cue inside the nearest positioned ancestor (the section)
      var section = scroller.closest('section') || scroller.parentElement;
      if (!section) return;
      var cs = window.getComputedStyle(section);
      if (cs.position === 'static') section.style.position = 'relative';

      var cue = document.createElement('div');
      cue.className = 'eg-swipe-cue';
      cue.textContent = 'Swipe';
      section.appendChild(cue);

      function place(){
        var sr = scroller.getBoundingClientRect();
        var pr = section.getBoundingClientRect();
        cue.style.bottom = 'auto';
        cue.style.top = (sr.bottom - pr.top - 36) + 'px';
        cue.style.left = '50%';
      }

      var dismissed = false;
      function dismissCue(){
        if (dismissed) return;
        dismissed = true;
        dismiss(cue);
      }
      function showOnce(){
        if (!isScrollable(scroller)) { dismissCue(); return; }
        place();
        show(cue);
        // Auto-fade after a while
        setTimeout(function(){ if (!dismissed) dismiss(cue); }, 5500);
      }

      // Wait for first time the scroller is in view
      watchInView(scroller, showOnce, 0.5);

      // Hide as soon as the user actually scrolls horizontally
      scroller.addEventListener('scroll', function(){
        if (scroller.scrollLeft > 4) dismissCue();
      }, { passive: true });
      scroller.addEventListener('touchstart', function(){
        // Set a flag — we'll dismiss on touch end / scroll
      }, { passive: true });
      scroller.addEventListener('pointerdown', function(){
        // Touch / mouse interaction starts — fade out shortly
        setTimeout(dismissCue, 200);
      }, { passive: true });

      window.addEventListener('resize', function(){ if (cue.classList.contains('visible')) place(); });
    });
  })();
})();

// ─────────────────────────────────────────────

/* Auto-fit the hero subtitle to screen width on mobile.
   Measures the rendered text width, adjusts font-size until the
   text fills the container perfectly (edge-to-edge, single line). */
(function() {
  var sub = document.querySelector('.subtitle');
  if (!sub) return;

  function fitSubtitle() {
    if (window.innerWidth > 768) {
      sub.style.fontSize = '';
      sub.style.visibility = 'visible';
      return;
    }
    var content = sub.parentElement;
    if (!content) return;
    var target = content.clientWidth * 0.92;
    if (target < 10) return;

    var lo = 8, hi = 28, best = 10;
    for (var i = 0; i < 10; i++) {
      var mid = (lo + hi) / 2;
      sub.style.fontSize = mid + 'px';
      if (sub.scrollWidth <= target) {
        best = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    sub.style.fontSize = best + 'px';
    sub.style.visibility = 'visible';
  }

  // Fit immediately using whatever font is currently rendered (fallback or loaded)
  fitSubtitle();
  // Refine when the specific Futura font has loaded
  if (document.fonts && document.fonts.load) {
    document.fonts.load('400 18px Futura').then(fitSubtitle).catch(function(){});
  }
  window.addEventListener('resize', fitSubtitle);
})();

// ─────────────────────────────────────────────
