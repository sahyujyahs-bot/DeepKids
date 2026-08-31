// ─────────────────────────────────────────────

(function(){
  var cards = document.querySelectorAll('.ps-card');
  var reasons = document.querySelectorAll('.ps-reason');
  function playClick() { window.egFlipSound(0.3); }
  function playScroll() { window.egScrollSound(0.15); }

  cards.forEach(function(c) {
    c.addEventListener('click', playClick);
    c.addEventListener('mouseenter', function() { window.egScrollSound(0.1); });
  });
  reasons.forEach(function(r) {
    r.addEventListener('click', playClick);
  });

  if (!cards.length) return;
  egToggleOnView(cards, 'visible', 0.3);

  var container = document.querySelector('.parents-stories');
  var t1 = null;
  if (container) {
    container.addEventListener('scroll', function() {
      if (!t1) { playScroll(); t1 = setTimeout(function(){ t1 = null; }, 400); }
      var sl = container.scrollLeft;
      cards.forEach(function(card) { card.style.transform = 'translateX(' + ((sl - card.offsetLeft) * 0.05) + 'px)'; });
    }, { passive: true });
  }

  var rc = document.querySelector('.ps-reasons');
  if (rc) egToggleOnView(rc, 'in-view', 0.1);
  var t2 = null;
  if (rc) {
    rc.addEventListener('scroll', function() {
      if (!t2) { playScroll(); t2 = setTimeout(function(){ t2 = null; }, 400); }
      reasons.forEach(function(r) { r.style.transform = 'translateX(' + ((rc.scrollLeft - r.offsetLeft) * 0.04) + 'px)'; });
    }, { passive: true });
  }

  // Experience section scroll sound
  var expGrid = document.querySelector('.exp-grid');
  var t3 = null;
  if (expGrid) {
    expGrid.addEventListener('scroll', function() {
      if (!t3) { playScroll(); t3 = setTimeout(function(){ t3 = null; }, 400); }
    }, { passive: true });
  }
})();

// ─────────────────────────────────────────────

(function(){
  var cards = document.querySelectorAll('.unlearn-card');
  // Flip with sound
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      card.classList.toggle('flipped');
      window.egFlipSound(0.4);
    });
  });

  // Entry animation every time + hint wiggle
  cards.forEach(function(c, i) { c.style.transitionDelay = (i * 0.12) + 's'; });
  egToggleOnView(cards, 'u-visible', 0.3);

  // Sound on hover
  cards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      window.egScrollSound(0.1);
    });
  });

  // Scroll sound + parallax on horizontal scroll
  var grid = document.querySelector('.unlearn-grid');
  var scrollTimer = null;
  if (grid) {
    grid.addEventListener('scroll', function() {
      if (!scrollTimer) {
        window.egScrollSound(0.15);
        scrollTimer = setTimeout(function(){ scrollTimer = null; }, 400);
      }
      var sl = grid.scrollLeft;
      cards.forEach(function(card) {
        var offset = (sl - card.offsetLeft) * 0.04;
        if (!card.classList.contains('flipped')) {
          card.style.transform = 'translateX(' + offset + 'px)';
        }
      });
    }, { passive: true });
  }

})();

// ─────────────────────────────────────────────

(function () {
      var frame  = document.getElementById('s2-board-tour');
      var img    = document.getElementById('s2-board-tour-img');
      var astro  = document.getElementById('s2-board-tour-astro');
      var rocket = document.getElementById('s2-board-tour-rocket');
      var label  = document.getElementById('s2-board-tour-label');
      var toggle = document.getElementById('s2-board-tour-toggle');
      var pauseIcon = document.getElementById('s2-board-tour-pause-icon');
      var playIcon  = document.getElementById('s2-board-tour-play-icon');
      if (!frame || !img || !astro || !rocket || !label || !toggle) return;

      var FULL  = 'scale(1) translate(0%, 0%)';
      var TILE0 = 'scale(4.1) translate(-5%, 16%)';
      var ISS   = 'scale(3.4) translate(33%, 36%)';

      var STEPS = [
        { t: FULL,  l: 'The Spiral Board',            hold: 2200 },
        { t: TILE0, l: 'Tile 0 — Starting Point',      hold: 2200 },
        { t: ISS,   l: 'International Space Station',  hold: 2200 },
        { t: TILE0, l: 'Tile 0 — Ready To Launch',     hold: 2600, tokens: true }
      ];

      var idx = 0, paused = false, running = false, stepTimer = null;
      function setLabel(text) {
        label.style.opacity = '0';
        setTimeout(function () {
          label.textContent = text;
          label.style.opacity = '1';
        }, 180);
      }
      function runStep(i) {
        var step = STEPS[i];
        if (!step.tokens) {
          astro.style.opacity = '0';
          rocket.style.opacity = '0';
        }
        img.style.transform = step.t;
        setLabel(step.l);
        if (step.tokens) {
          setTimeout(function () {
            astro.style.opacity = '1';
            rocket.style.opacity = '1';
          }, 700);
        }
      }
      function scheduleNext() {
        stepTimer = setTimeout(function () {
          idx = (idx + 1) % STEPS.length;
          runStep(idx);
          scheduleNext();
        }, STEPS[idx].hold);
      }
      function startTour() {
        if (running) return;
        running = true;
        runStep(idx);
        scheduleNext();
      }
      function pauseTour() {
        if (stepTimer) clearTimeout(stepTimer);
        stepTimer = null;
      }
      toggle.addEventListener('click', function () {
        paused = !paused;
        if (paused) {
          pauseTour();
          running = false;
          pauseIcon.style.display = 'none';
          playIcon.style.display = '';
          toggle.title = 'Play';
        } else {
          pauseIcon.style.display = '';
          playIcon.style.display = 'none';
          toggle.title = 'Pause';
          startTour();
        }
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!paused) startTour();
          } else {
            if (!paused) pauseTour();
            running = false;
          }
        });
      }, { threshold: 0.5 });
      io.observe(frame);
    })();

// ─────────────────────────────────────────────

(function() {
  /* ── 3D Tilt on pointer move for all s2-pin items ────── */
  var items = document.querySelectorAll('.s2-pin-item');
  items.forEach(function(item) {
    var inner = item.querySelector('img') || item.querySelector('svg') || item.querySelector('.s2-flip-inner');
    if (!inner) return;

    item.addEventListener('pointermove', function(e) {
      var rect = item.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      var rotY =  x * 20; // tilt left-right (max 10deg)
      var rotX = -y * 20; // tilt up-down
      inner.style.transform = (inner.classList.contains('s2-flip-inner') ? '' : '') +
        'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    });

    item.addEventListener('pointerleave', function() {
      inner.style.transform = '';
    });
  });

  /* ── Card sounds (global for reuse by other sections) ──── */
  window._cardFlipBuf = null;
  window._cardScrollBuf = null;
  var cardFlipBuf = null;
  var cardScrollBuf = null;
  EGAudio.loadBuffer('cardflip sound.mp3', function(b) { window._cardFlipBuf = b; cardFlipBuf = b; });
  EGAudio.loadBuffer('cardsscrollsound.mp3', function(b) { window._cardScrollBuf = b; cardScrollBuf = b; });

  window.playBoxSound = function(buf, vol) {
    EGAudio.playBuffer(buf, { vol: vol || 0.5 });
  }
  // Site-wide card interaction sounds (used by many sections)
  window.egFlipSound = function(vol) {
    if (window._cardFlipBuf) window.playBoxSound(window._cardFlipBuf, vol || 0.3);
  }
  window.egScrollSound = function(vol) {
    if (window._cardScrollBuf) window.playBoxSound(window._cardScrollBuf, vol || 0.15);
  }

  /* ── Flip cards ──────────────────────────────────────── */
  var flipCards = document.querySelectorAll('.s2-flip-card');
  flipCards.forEach(function(card) {
    card.addEventListener('click', function() {
      card.classList.toggle('flipped');
      playBoxSound(cardFlipBuf, 0.55);
    });
    // Card scroll/touch sound on hover
    card.closest('.s2-pin-item').addEventListener('pointerenter', function() {
      playBoxSound(cardScrollBuf, 0.35);
    });
  });

  /* ── Film-strip: entry animation + auto-flip (all screens) ── */
  (function() {
    var pin = document.querySelector('.s2-pin');
    if (!pin) return;

    // Trigger entry animation when section scrolls into view
    egRevealOnce(pin, 's2-entered', 0.05);

    // Auto-flip: only when section is actually visible
    var flips = pin.querySelectorAll('.s2-flip-card');
    var sectionVisible = false;
    var flipObs = new IntersectionObserver(function(entries) {
      sectionVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    flipObs.observe(pin);

    function checkFlips() {
      if (sectionVisible) {
        var pinR = pin.getBoundingClientRect();
        var cx = pinR.left + pinR.width / 2;
        flips.forEach(function(card) {
          var r = card.getBoundingClientRect();
          var cardCx = r.left + r.width / 2;
          if (Math.abs(cardCx - cx) < r.width * 0.7 && !card.dataset.af) {
            card.dataset.af = '1';
            card.classList.add('flipped');
            if (typeof playBoxSound === 'function') playBoxSound(cardFlipBuf, 0.45);
            setTimeout(function() {
              card.classList.remove('flipped');
              if (typeof playBoxSound === 'function') playBoxSound(cardFlipBuf, 0.3);
              setTimeout(function() { delete card.dataset.af; }, 2500);
            }, 2200);
          }
        });
      }
      requestAnimationFrame(checkFlips);
    }
    checkFlips();
  })();
})();

// ─────────────────────────────────────────────

document.querySelectorAll('.gv').forEach(function(v) {
    v.addEventListener('loadedmetadata', function() { v.currentTime = 1; });
  });
  function playGalleryVideo(item) {
    var v = item.querySelector('video');
    var btn = item.querySelector('.gv-play');
    if (!v) return;
    v.controls = true;
    btn.style.display = 'none';
    item.onclick = null;
    v.currentTime = 0;
    v.play();
  }

// ─────────────────────────────────────────────

(function(){
  // Polaroid tiles: tap to reveal caption on touch devices.
  // On desktop :hover handles it; this script also makes tap-away
  // close any stuck-active tile.
  var grid = document.querySelector('.exp-grid');
  if (!grid) return;
  grid.addEventListener('click', function(e){
    var tile = e.target.closest('.exp-item');
    // Clear previously active tile(s)
    grid.querySelectorAll('.exp-item.is-active').forEach(function(el){
      if (el !== tile) el.classList.remove('is-active');
    });
    if (tile) tile.classList.toggle('is-active');
  });
  document.addEventListener('click', function(e){
    if (!e.target.closest('.exp-grid')) {
      grid.querySelectorAll('.exp-item.is-active').forEach(function(el){
        el.classList.remove('is-active');
      });
    }
  });

  // One-shot observer: add visible once, never remove
  egRevealOnce(grid, 'visible', 0.05);

  // Soft pop sound on each individual illustration hover/tap
  function playExpPop() {
    EGAudio.tone(680 + Math.random() * 200, 0.15, {
      vol: 0.08, expSlide: 280, expSlideDur: 0.12, stop: 0.18
    });
  }
  grid.querySelectorAll('.exp-item').forEach(function(item) {
    item.addEventListener('pointerenter', playExpPop);
  });
})();

// ─────────────────────────────────────────────

(function(){
  var icons = document.querySelectorAll('.forces-icon');
  var panels = document.querySelectorAll('.forces-panel');
  icons.forEach(function(icon) {
    icon.addEventListener('click', function() {
      var cat = icon.getAttribute('data-cat');
      icons.forEach(function(i) { i.classList.remove('active'); });
      icon.classList.add('active');
      panels.forEach(function(p) {
        p.classList.toggle('active', p.getAttribute('data-cat') === cat);
      });
    });
  });
})();

// ─────────────────────────────────────────────

(function(){
  var img = document.getElementById('spiral-board');
  if (!img) return;

  var angle = 0;
  var clickDir = 1;
  var dblDir = 1;
  var spinning = false;

  function setAngle(a) {
    angle = a;
    img.style.transform = 'rotate(' + a + 'deg)';
  }

  // ── Scroll: rotate with scroll delta when section is in view ──
  var section = document.getElementById('s-spiral');
  var lastY = window.pageYOffset;
  window.addEventListener('scroll', function() {
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      lastY = window.pageYOffset;
      return;
    }
    var y = window.pageYOffset;
    var delta = y - lastY;
    lastY = y;
    setAngle(angle + delta * 0.4);
  }, { passive: true });

  // ── Single click: 1 full spin, alternating direction ──
  img.addEventListener('click', function() {
    if (spinning) return;
    spinning = true;
    var target = angle + clickDir * 360;
    clickDir *= -1;
    animateSpin(target, 900, function() { spinning = false; });
  });

  // ── Double click: 5 full spins, alternating direction ──
  img.addEventListener('dblclick', function(e) {
    e.preventDefault();
    spinning = true;
    var target = angle + dblDir * 360 * 5;
    dblDir *= -1;
    animateSpin(target, 2500, function() { spinning = false; });
  });

  function animateSpin(target, duration, cb) {
    var start = angle;
    var startTime = null;
    function frame(ts) {
      if (!startTime) startTime = ts;
      var t = Math.min((ts - startTime) / duration, 1);
      var e = 1 - Math.pow(1 - t, 3);
      setAngle(start + (target - start) * e);
      if (t < 1) requestAnimationFrame(frame);
      else { setAngle(target); if (cb) cb(); }
    }
    requestAnimationFrame(frame);
  }
})();

// ─────────────────────────────────────────────

/* ── Simple tab systems (Examples s4b, Gravity Wells s6b) ────
   One active tab shows the matching panel (#<prefix>-<data-tab>).
   The How-to-Play (s2) tabs stay bespoke — they carry cleanup and
   board-state logic that doesn't fit this pattern. */
function initSimpleTabs(prefix) {
  var tabs = document.querySelectorAll('.' + prefix + '-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.' + prefix + '-panel').forEach(function(p) { p.classList.remove('active'); });
      document.getElementById(prefix + '-' + tab.getAttribute('data-tab')).classList.add('active');
    });
  });
}
initSimpleTabs('s4b');

// ─────────────────────────────────────────────

(function(){
  initSimpleTabs('s6b');

  // Fan stack — click to swap front/back card
  var fan = document.getElementById('s6b-fan');
  if (fan) {
    fan.addEventListener('click', function() {
      fan.classList.toggle('swapped');
      if (window.sndCardFlip && window.playSound) window.playSound(window.sndCardFlip, 0.45);
    });
  }
})();

// ─────────────────────────────────────────────
