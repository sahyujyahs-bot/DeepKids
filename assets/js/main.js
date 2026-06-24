// ============================================================
// EscapeGravity / DeepKids — main.js
//
// Extracted verbatim from index.html's inline <script> blocks
// (refactor-only; no logic changes). Concatenated in original
// document order so relative execution order is preserved —
// this matters because some scripts reference globals/functions
// defined earlier (e.g. matter.js-dependent physics code must
// run after the matter.js CDN <script> tag, which still loads
// synchronously before this deferred script executes).
//
// Tiny analytics bootstrap snippets (gtag/dataLayer init,
// Microsoft Clarity placeholder, Meta Pixel init) were left
// INLINE in index.clean.html <head> — they are intentionally
// NOT included here, to avoid changing analytics load timing.
// ============================================================

// ===== Hero / Page Load Animations, Matter.js Physics (Rain/Drop), Pre-Order Modal & Razorpay Payment Flow, PlayTest Modal =====
// ---- (originally index.html lines 989-2003) ----

    /* ── Main scene ───────────────────────────────────────────── */
    (function () {
      'use strict';

      /* Canvas setup */
      const cv  = document.getElementById('cv');
      const ctx = cv.getContext('2d');
      let W, H;
      const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
      resize();
      addEventListener('resize', () => { resize(); rebuildWalls(); });

      /* Rain cards are rendered as real DOM <img> elements (not
         canvas-drawn) so they stay pixel-sharp on high-DPR mobile
         screens — the shared canvas is intentionally kept at 1x
         resolution for performance/stability, which makes anything
         drawn on it via ctx.drawImage soft on retina displays. Each
         element just tracks its physics body's position/rotation
         every frame in drawPhysics(). One element per "rain"-role
         card is created up front and reused for every spawn/replay. */
      const rainImgEls = {};
      Object.keys(CARDS).forEach(key => {
        if (CARDS[key].role !== 'rain') return;
        const el = document.createElement('img');
        /* src is assigned lazily in drawPhysics(), the first time
           this card actually appears — assigning all of them up
           front would force the browser to decode every rain image
           at once on load, causing a jank/stutter right as the
           first rain falls. */
        el.alt = '';
        el.decoding = 'async';
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '1';
        el.style.pointerEvents = 'none';
        el.style.display = 'none';
        el.style.willChange = 'transform';
        cv.parentElement.appendChild(el);
        rainImgEls[key] = el;
      });

      /* ── Background: stars & drifting asteroids ─────────────── */
      let t = 0;
      const stars = [];
      const asts  = [];

      (function buildBackground() {
        for (let i = 0; i < 150; i++)
          stars.push({ x: Math.random()*W, y: Math.random()*H,
                        r: Math.random()*.85+.1, a: Math.random()*.15+.04,
                        tw: Math.random()*Math.PI*2, sp: Math.random()*.005+.001 });
        for (let i = 0; i < 20; i++)
          stars.push({ x: Math.random()*W, y: Math.random()*H,
                        r: Math.random()*.5+.3, a: Math.random()*.18+.07,
                        tw: Math.random()*Math.PI*2, sp: .002 });
        for (let i = 0; i < 3; i++)
          stars.push({ x: Math.random()*W, y: Math.random()*H,
                        r: 1.4, a: .36, tw: Math.random()*Math.PI*2, sp: .002, cross: true });
        for (let i = 0; i < 4; i++)
          asts.push({ x: Math.random()*W, y: Math.random()*H,
                       r: Math.random()*7+3,
                       vx: (Math.random()-.5)*.12, vy: (Math.random()-.5)*.09,
                       rot: Math.random()*Math.PI*2, rv: (Math.random()-.5)*.003,
                       a: Math.random()*.11+.04 });
      })();

      function drawBackground() {
        ctx.fillStyle = '#120826';
        ctx.fillRect(0, 0, W, H);

        stars.forEach(s => {
          const fl = Math.sin(s.tw + t*s.sp*60) * .05;
          ctx.globalAlpha = Math.max(.03, s.a + fl);
          ctx.fillStyle   = '#fff';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
          if (s.cross) {
            ctx.globalAlpha  = (s.a + fl) * .18;
            ctx.strokeStyle  = '#fff';
            ctx.lineWidth    = .4;
            const l = s.r * 3;
            ctx.beginPath();
            ctx.moveTo(s.x-l, s.y); ctx.lineTo(s.x+l, s.y);
            ctx.moveTo(s.x, s.y-l); ctx.lineTo(s.x, s.y+l);
            ctx.stroke();
          }
        });

        ctx.globalAlpha = 1;

        asts.forEach(a => {
          a.x += a.vx; a.y += a.vy; a.rot += a.rv;
          if (a.x < -30)  a.x = W + 30;
          if (a.x > W+30) a.x = -30;
          if (a.y < -30)  a.y = H + 30;
          if (a.y > H+30) a.y = -30;

          ctx.save();
          ctx.globalAlpha = a.a;
          ctx.translate(a.x, a.y);
          ctx.rotate(a.rot);

          const g = ctx.createRadialGradient(-a.r*.3, -a.r*.3, 0, 0, 0, a.r);
          g.addColorStop(0, '#5a4634');
          g.addColorStop(1, '#140e06');
          ctx.fillStyle = g;
          ctx.beginPath();
          for (let i = 0; i < 7; i++) {
            const ang = i/7 * Math.PI*2;
            const lr  = a.r * (.72 + .28*Math.sin(ang*2.9 + a.rot));
            i === 0 ? ctx.moveTo(Math.cos(ang)*lr, Math.sin(ang)*lr)
                    : ctx.lineTo(Math.cos(ang)*lr, Math.sin(ang)*lr);
          }
          ctx.closePath(); ctx.fill();
          ctx.restore();
        });

        ctx.globalAlpha = 1;
      }

      /* ── Physics engine ─────────────────────────────────────── */
      const { Engine, Bodies, Body, World, Runner,
               Mouse, MouseConstraint, Events } = Matter;

      const engine = Engine.create({ gravity: { x: 0, y: 4, scale: 0.001 } });
      const world  = engine.world;
      let walls    = [];

      /* ── Hero rain sound — single swoosh file per falling element ─
         Plays the user-provided swoosh WAV once for each card the
         moment it starts falling. Pre-fetches the audio data via
         XHR so it's ready before the first element drops (browsers
         often ignore preload="auto" on Audio elements). Uses Web
         Audio API to play from the decoded buffer — this also
         sidesteps the autoplay-policy issue for programmatic
         playback after a user gesture. */
      let swooshBuffer = null;
      let swooshCtx = null;
      (function preloadSwoosh() {
        try {
          swooshCtx = new (window.AudioContext || window.webkitAudioContext)();
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'single Swoosh sound.wav', true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = function() {
            if (xhr.status === 200) {
              swooshCtx.decodeAudioData(xhr.response, function(buf) {
                swooshBuffer = buf;
              });
            }
          };
          xhr.send();
        } catch(e) {}
      })();
      // Arm on the FIRST user gesture (touchstart fires before the
      // scroll actually happens, so we catch the intent early):
      // resume the AudioContext AND immediately replay the rain so
      // the user's first real experience of the drop has sound.
      // After this one-time hit, subsequent plays resume the ctx on
      // their own via playSwoosh().
      // True while the hero is (mostly) still on-screen. Beyond this
      // the user has moved on and we don't want to yank them back.
      function stillInHero() {
        return window.pageYOffset < window.innerHeight * 0.8;
      }
      var audioArmed = false;
      function armAudioAndReplay() {
        if (audioArmed) return;
        audioArmed = true;
        try { if (swooshCtx && swooshCtx.state === 'suspended') swooshCtx.resume(); } catch(e) {}
        // Cancel the 7s fallback auto-replay so we don't double-fire
        if (window._heroAutoReplayTimer) {
          clearTimeout(window._heroAutoReplayTimer);
          window._heroAutoReplayTimer = null;
        }
        // Wait for the swoosh buffer to be decoded (WAV may still be
        // downloading). Poll every 80ms for up to 2s, then replay
        // anyway (silent is better than never replaying).
        var waited = 0;
        function tryReplay() {
          if (!stillInHero()) return;
          if (!swooshBuffer && waited < 2000) {
            waited += 80;
            setTimeout(tryReplay, 80);
            return;
          }
          if (typeof window.replayRain === 'function') window.replayRain();
        }
        setTimeout(tryReplay, 60);
      }
      ['pointerdown','touchstart','keydown','click'].forEach(function(evt) {
        document.addEventListener(evt, armAudioAndReplay, { passive: true, once: true });
      });
      // NOTE: first-load rain will be silent (browser autoplay policy
      // blocks audio before user interaction). The redo button and all
      // subsequent rains play with sound because the user has interacted.
      function playSwoosh() {
        if (!swooshBuffer || !swooshCtx) return;
        try {
          if (swooshCtx.state === 'suspended') swooshCtx.resume();
          var src = swooshCtx.createBufferSource();
          src.buffer = swooshBuffer;
          src.playbackRate.value = 0.9 + Math.random() * 0.2;
          var gain = swooshCtx.createGain();
          gain.gain.value = 0.35 + Math.random() * 0.15;
          src.connect(gain);
          gain.connect(swooshCtx.destination);
          src.start();
        } catch(e){}
      }

      function rebuildWalls() {
        if (walls.length) World.remove(world, walls);
        const tk = 80;
        walls = [
          Bodies.rectangle(W/2,    H+tk/2, W+200, tk, { isStatic: true }),
          Bodies.rectangle(-tk/2,  H/2,    tk, H*4,   { isStatic: true }),
          Bodies.rectangle(W+tk/2, H/2,    tk, H*4,   { isStatic: true }),
        ];
        World.add(world, walls);
      }
      rebuildWalls();

      /* ── Card keys ──────────────────────────────────────────── */
      const RAIN_KEYS     = ['Card2Side2','Card4Side1','Card4Side2','Card5Side1',
                             'Card5Side2','Card7Side2','Card8Side1','Card9Side1',
                             'DKLogo','AppleTree','DasBox'];
      const BIRD_KEY      = 'Card12Side2';
      const BALLOON_KEY   = 'Card12Side1';
      const PARACHUTE_KEY = 'Card13Side1';
      const ALL_KEYS      = [...RAIN_KEYS, BIRD_KEY, BALLOON_KEY, PARACHUTE_KEY];

      // Image loading started before matter.min.js (see the small
      // script right after cards.js in the HTML) so the fetches aren't
      // stuck behind that blocking CDN script. We just hook into it.
      const imgCache  = window.__rainImgCache;
      const RAIN_TOTAL = window.__RAIN_TOTAL;
      // Wait for the whole rain set to be ready before the first drop so
      // every card falls together in one smooth cascade, instead of
      // popping in mid-air one at a time as each image straggles in
      // (which read as a glitchy stop-start load). A short timeout is
      // a safety net in case one image is slow/broken — it spawns with
      // whatever's loaded so far rather than blocking the hero forever;
      // any genuinely late stragglers still use the old late-drop path.
      let heroSpawnTimer = setTimeout(() => {
        if (!window._heroSpawned) { window._heroSpawned = true; spawnAll(); }
      }, 1800);
      window.__onRainImageLoaded = (k) => {
        if (window._heroSpawned) {
          // Late arrival (only reachable via the timeout fallback above):
          // add this card to the already-running scene.
          if (RAIN_KEYS.indexOf(k) !== -1 && typeof window._lateDropCard === 'function') window._lateDropCard(k);
          return;
        }
        if (window.__rainLoadedCount >= RAIN_TOTAL) {
          clearTimeout(heroSpawnTimer);
          window._heroSpawned = true;
          spawnAll();
        }
      };
      // Some/all images may have already finished loading by the time
      // this script runs (they started before matter.min.js) — check now.
      if (window.__rainLoadedCount >= RAIN_TOTAL) {
        clearTimeout(heroSpawnTimer);
        window._heroSpawned = true;
        spawnAll();
      }

      /* ── Rain state ─────────────────────────────────────────── */
      const physEntries = [];   // { body, key, dW, dH }
      const rainTimers  = [];   // setTimeout IDs — cancelled on replay
      let maxCardH      = 200;
      let teaseActive   = true;
      let teaseTimer;
      let rainPlayCount = 0;    // counts spawnRain() calls for analytics (first load + every replay)

      /* Tease: wobble a random settled card every 6 s to signal interactivity */
      function startTease() {
        if (!teaseActive) return;
        const live = physEntries.filter(en => !en.body.isStatic);
        if (live.length === 0) { teaseTimer = setTimeout(startTease, 1000); return; }
        const target = live[Math.floor(Math.random() * live.length)];
        Body.setAngularVelocity(target.body, (Math.random() > .5 ? 1 : -1) * 0.10);
        teaseTimer = setTimeout(startTease, 6000);
      }
      let numPhysRows   = 1;

      /* spawnRain() is the replayable part — called on load and on replay */
      function spawnRain() {
        rainPlayCount++;
        if (typeof gtag === 'function') {
          gtag('event', 'rain_play', {
            event_category: 'engagement',
            event_label: rainPlayCount === 1 ? 'initial' : 'replay',
            value: rainPlayCount
          });
        }

        /* Cancel any still-pending release timers */
        rainTimers.forEach(id => clearTimeout(id));
        rainTimers.length = 0;

        /* Remove previous bodies from world */
        physEntries.forEach(en => World.remove(world, en.body));
        physEntries.length = 0;

        /* Layout: < 960 px → 2 rows of 4; ≥ 960 px → 1 row of 8 */
        const twoRow      = W < 960;
        const cardsPerRow = twoRow ? 4 : 8;
        numPhysRows       = twoRow ? 2 : 1;

        const GAP   = 5;
        const slotW = (W - GAP * (cardsPerRow + 1)) / cardsPerRow;
        maxCardH    = 0;

        RAIN_KEYS.forEach((key, i) => {
          if (!imgCache[key]) return; // skip cards whose images haven't loaded yet

          const info  = CARDS[key];
          const sizeMult = (key === 'EGBox') ? (twoRow ? 2.2 : 1.6) : (twoRow ? 1.18 : 1);
          const dW   = Math.round(slotW * sizeMult);
          const dH   = Math.round(slotW * sizeMult * info.h / info.w);
          maxCardH   = Math.max(maxCardH, dH);

          const col = i % cardsPerRow;
          const row = Math.floor(i / cardsPerRow);
          const x   = GAP + col*(slotW+GAP) + slotW/2 + (Math.random()-.5)*slotW*.12;
          const y   = -dH/2 - 30;

          const body = Bodies.rectangle(x, y, dW, dH, {
            isStatic:    true,
            frictionAir: 0.012 + Math.random() * 0.018,
            restitution: 0.30  + Math.random() * 0.30,
            friction:    0.55  + Math.random() * 0.30,
          });
          World.add(world, body);
          physEntries.push({ body, key, dW, dH });

          /* Staggered raindrop release — first card drops at t=0 so
             the viewer sees motion the instant spawn fires. Row 0
             then cascades fast; row 1+ follows after a short break,
             preserving the "one, then a few, then a few" rhythm. */
          let delay;
          if (row === 0) {
            delay = col === 0 ? 0 : (col * 130 + Math.random() * 120);
          } else {
            delay = row * 1300 + col * 160 + Math.random() * 220;
          }
          rainTimers.push(setTimeout(() => {
            Body.setStatic(body, false);
            Body.setAngularVelocity(body, (Math.random() - .5) * .35);
            Body.setVelocity(body, { x: (Math.random() - .5) * 1.5, y: 0 });
            playSwoosh();
          }, delay));
        });
      }

      /* Late-drop: when a card image loads after the initial rain
         already fired, drop it into the existing scene immediately. */
      window._lateDropCard = function(key) {
        if (!world) return;
        var info = CARDS[key];
        var twoRow = W < 960;
        var cardsPerRow = twoRow ? 4 : 8;
        var GAP = 5;
        var slotW = (W - GAP * (cardsPerRow + 1)) / cardsPerRow;
        var idx = RAIN_KEYS.indexOf(key);
        if (idx === -1) return;
        var col = idx % cardsPerRow;
        var sizeMult = (key === 'EGBox') ? (twoRow ? 2.2 : 1.6) : (twoRow ? 1.18 : 1);
        var dW = Math.round(slotW * sizeMult);
        var dH = Math.round(slotW * sizeMult * info.h / info.w);
        var x = GAP + col*(slotW+GAP) + slotW/2 + (Math.random()-.5)*slotW*.12;
        var y = -dH/2 - 30;
        var body = Bodies.rectangle(x, y, dW, dH, {
          isStatic: false,
          frictionAir: 0.012 + Math.random() * 0.018,
          restitution: 0.30 + Math.random() * 0.30,
          friction: 0.55 + Math.random() * 0.30,
        });
        Body.setAngularVelocity(body, (Math.random() - .5) * .35);
        World.add(world, body);
        physEntries.push({ body: body, key: key, dW: dW, dH: dH });
        playSwoosh();
      };

      /* spawnAll() runs once: sets up mouse constraint, runner, floaters, loop */
      function spawnAll() {
        /* Drag-and-drop (mouse + touch) */
        const mouse = Mouse.create(cv);
        mouse.pixelRatio = 1;

        /* ── Fix scrolling vs card drag ──────────────────────────
           Matter.js Mouse.create attaches mousewheel, DOMMouseScroll,
           touchstart, and touchmove listeners that call preventDefault,
           blocking ALL scrolling over the canvas. Remove them all.
           We take full control: touch-action:none on canvas means the
           browser gives us ALL touch events. We decide per-gesture:
           - Finger on a card → drag the card (preventDefault)
           - Finger on empty space → manually scroll the page           ── */
        cv.removeEventListener('mousewheel', mouse.mousewheel);
        cv.removeEventListener('wheel', mouse.mousewheel);
        cv.removeEventListener('DOMMouseScroll', mouse.mousewheel);
        cv.removeEventListener('touchmove', mouse.mousemove);
        cv.removeEventListener('touchstart', mouse.mousedown);

        const mc = MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness:        0.18,
            angularStiffness: 0.02,
            damping:          0.15,
            render: { visible: false },
          },
        });
        World.add(world, mc);

        /* ── Smart touch: drag cards OR scroll page (with momentum) ── */
        let touchLastY = 0;
        let touchLastTime = 0;
        let draggingCard = false;
        let scrollVelocity = 0;
        let momentumRAF = 0;

        function startMomentumScroll() {
          cancelAnimationFrame(momentumRAF);
          const friction = 0.88;   // was 0.95 — faster decay to prevent overshooting
          const minV = 0.5;
          (function tick() {
            if (Math.abs(scrollVelocity) < minV) return;
            window.scrollBy(0, scrollVelocity);
            scrollVelocity *= friction;
            momentumRAF = requestAnimationFrame(tick);
          })();
        }

        cv.addEventListener('touchstart', (e) => {
          const t = e.touches[0];
          touchLastY = t.clientY;
          touchLastTime = performance.now();
          cancelAnimationFrame(momentumRAF);
          scrollVelocity = 0;
          mouse.mousedown(e);
          draggingCard = false;
        }, { passive: true });

        cv.addEventListener('touchmove', (e) => {
          const t = e.touches[0];
          const now = performance.now();
          const dy = touchLastY - t.clientY;
          const dt = now - touchLastTime || 16;
          touchLastY = t.clientY;
          touchLastTime = now;

          mouse.mousemove(e);

          if (mc.body) {
            draggingCard = true;
            e.preventDefault();
          } else if (!draggingCard) {
            window.scrollBy(0, dy);
            // Cap velocity so a fast flick doesn't fling to the footer
            scrollVelocity = Math.max(-30, Math.min(30, dy * (16 / dt)));
          }
        }, { passive: false });

        cv.addEventListener('touchend', (e) => {
          mouse.mouseup(e);
          if (!draggingCard) startMomentumScroll();
          draggingCard = false;
        }, { passive: true });

        const hint    = document.getElementById('drag-hint');
        const replayBtn = document.getElementById('replay-btn');

        /* Hint & tease appear after cards have had time to settle */
        setTimeout(() => {
          if (hint) { hint.style.opacity = '1'; hint.classList.add('show'); }
          if (replayBtn) replayBtn.classList.add('pulsing');
          startTease();
        }, 5000);

        /* Stop tease the moment user first drags + play drag sound */
        var dragHumInterval = null;
        Events.on(mc, 'startdrag', (e) => {
          cv.style.cursor = 'grabbing';
          teaseActive = false;
          clearTimeout(teaseTimer);
          if (hint) { hint.style.opacity = '0'; hint.classList.remove('show'); }
          // One-time, per-pageload signal that this visitor touched the
          // hero rain at all — lets us measure interaction rate in GA4
          // (Users who fired this event ÷ total Users on the hero).
          if (!window._heroInteracted) {
            window._heroInteracted = true;
            if (typeof gtag === 'function') gtag('event', 'hero_interact', { event_category: 'engagement' });
          }
          // Mild hum while dragging — gentle low tone
          if (swooshCtx && swooshBuffer) {
            try {
              if (swooshCtx.state === 'suspended') swooshCtx.resume();
              var o = swooshCtx.createOscillator();
              var g = swooshCtx.createGain();
              o.type = 'sine'; o.frequency.value = 140;
              g.gain.value = 0.04;
              o.connect(g); g.connect(swooshCtx.destination);
              o.start();
              // Store so we can stop on enddrag
              window._dragHum = { osc: o, gain: g };
            } catch(e){}
          }
        });
        Events.on(mc, 'enddrag', (e) => {
          cv.style.cursor = 'grab';
          // Stop drag hum
          if (window._dragHum) {
            try {
              window._dragHum.gain.gain.exponentialRampToValueAtTime(0.001, swooshCtx.currentTime + 0.15);
              window._dragHum.osc.stop(swooshCtx.currentTime + 0.2);
            } catch(e){}
            window._dragHum = null;
          }
          // Swoosh on release
          playSwoosh();
          // Count every pick-up-and-drop as a "flip", per card key
          if (typeof gtag === 'function') {
            var draggedEntry = physEntries.find(function(en) { return en.body === e.body; });
            gtag('event', 'card_flip', {
              event_category: 'engagement',
              event_label: draggedEntry ? draggedEntry.key : 'unknown'
            });
          }
        });

        Runner.run(Runner.create(), engine);
        initFloaters();
        spawnRain();   /* ← first rain */
        loop();
      }

      /* ── Draw physics bodies (with rotation) ────────────────── */
      function drawPhysics() {
        ctx.imageSmoothingEnabled = true;
        if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
        const visibleRainEls = new Set();
        physEntries.forEach(en => {
          if (!imgCache[en.key]) return;
          const { position: p, angle: a } = en.body;
          const el = rainImgEls[en.key];
          if (el) {
            if (!el.src) el.src = CARDS[en.key].src;
            visibleRainEls.add(el);
            el.style.display = 'block';
            el.style.width  = en.dW + 'px';
            el.style.height = en.dH + 'px';
            el.style.transform =
              'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%,-50%) rotate(' + a + 'rad)';
            return;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(a);
          ctx.drawImage(imgCache[en.key], -en.dW/2, -en.dH/2, en.dW, en.dH);
          ctx.restore();
        });
        Object.values(rainImgEls).forEach(el => {
          if (!visibleRainEls.has(el)) el.style.display = 'none';
        });
      }

      /* ── Floaters: bird, balloon, parachute ─────────────────── */
      function floatScale(role) {
        if (role === 'bird') return W < 480 ? 0.55 : W < 768 ? 0.68 : 1.0;
        if (role === 'balloon') return W < 480 ? 0.08 : W < 768 ? 0.11 : W < 960 ? 0.14 : 0.17;
        return W < 480 ? 0.20 : W < 768 ? 0.28 : W < 960 ? 0.38 : 0.52;
      }

      const bird    = { x: -300, phase: 0, phaseSpd: 0.040, img: null, w: 0, h: 0, ready: false };
      // Speed scales with viewport height so floaters don't zip
      // on small mobile screens vs large desktop monitors.
      var floatSpeedFactor = Math.max(0.55, H / 900);
      const balloon = { x: 0, y: 0, spd: 0.85 * floatSpeedFactor, drift: 0, img: null, w: 0, h: 0, ready: false };
      const chute   = { x: 0, y: 0, spd: 0.32 * floatSpeedFactor, drift: 0, img: null, w: 0, h: 0, ready: false };

      function initFloaters() {
        if (imgCache[BIRD_KEY] && !bird.ready) {
          const sc   = floatScale('bird');
          bird.img   = imgCache[BIRD_KEY];
          bird.w     = Math.round(CARDS[BIRD_KEY].w * sc);
          bird.h     = Math.round(CARDS[BIRD_KEY].h * sc);
          bird.x     = -bird.w - 60;
          bird.ready = true;
        }
        if (imgCache[BALLOON_KEY] && !balloon.ready) {
          const sc      = floatScale('balloon');
          balloon.img   = imgCache[BALLOON_KEY];
          balloon.w     = Math.round(CARDS[BALLOON_KEY].w * sc);
          balloon.h     = Math.round(CARDS[BALLOON_KEY].h * sc);
          balloon.x     = W*.12 + Math.random()*W*.76;
          balloon.y     = H + balloon.h;
          balloon.ready = true;
        }
        if (imgCache[PARACHUTE_KEY] && !chute.ready) {
          const sc    = floatScale('parachute');
          chute.img   = imgCache[PARACHUTE_KEY];
          chute.w     = Math.round(CARDS[PARACHUTE_KEY].w * sc);
          chute.h     = Math.round(CARDS[PARACHUTE_KEY].h * sc);
          chute.x     = W*.15 + Math.random()*W*.70;
          chute.y     = -chute.h;
          chute.ready = true;
        }
      }

      /* Bird: horizontal sine-wave flight just above the settled pile */
      function updateBird() {
        if (!bird.ready) return;
        bird.x    += W < 768 ? 0.90 : 1.35;
        bird.phase += bird.phaseSpd;

        const isMobile  = W < 960;
        const pileH     = maxCardH * numPhysRows * (isMobile ? 1.05 : 1.25);
        const clearance = isMobile ? 38 : 68;
        const amp       = isMobile ? 28 : 50;
        const y = (H - pileH - clearance) + amp * Math.sin(bird.phase);

        ctx.drawImage(bird.img, bird.x - bird.w/2, y - bird.h/2, bird.w, bird.h);
        if (bird.x - bird.w/2 > W + 80) { bird.x = -bird.w/2 - 80; bird.phase = 0; }
      }

      /* Balloon: rises slowly, gentle sway, loops bottom → top */
      function updateBalloon() {
        if (!balloon.ready) return;
        balloon.y    -= balloon.spd;
        balloon.drift += 0.007;
        const x = balloon.x + Math.sin(balloon.drift) * 18;
        ctx.drawImage(balloon.img, x - balloon.w/2, balloon.y - balloon.h/2, balloon.w, balloon.h);
        if (balloon.y + balloon.h/2 < -20) {
          balloon.y = H + balloon.h/2;
          balloon.x = W*.10 + Math.random()*W*.80;
        }
      }

      /* Parachute: drifts slowly downward, gentle sway, loops top → bottom */
      function updateParachute() {
        if (!chute.ready) return;
        chute.y    += chute.spd;
        chute.drift += 0.006;
        const x = chute.x + Math.sin(chute.drift) * 15;
        ctx.drawImage(chute.img, x - chute.w/2, chute.y - chute.h/2, chute.w, chute.h);
        if (chute.y - chute.h/2 > H + 20) {
          chute.y = -chute.h/2;
          chute.x = W*.10 + Math.random()*W*.80;
        }
      }

      /* ── Render loop ────────────────────────────────────────── */
      function loop() {
        t++;
        initFloaters();
        drawBackground();
        drawPhysics();
        requestAnimationFrame(loop);
      }

      /* ── Expose replay to global scope ──────────────────────── */
      window.replayRain = function () {
        const btn  = document.getElementById('replay-btn');
        const hint = document.getElementById('drag-hint');

        /* Spin the icon */
        btn.classList.remove('spinning');
        void btn.offsetWidth;
        btn.classList.add('spinning');
        btn.addEventListener('animationend', () => btn.classList.remove('spinning'), { once: true });

        /* Hide hint while raining; re-show & re-tease after settle */
        if (hint) { hint.style.opacity = '0'; hint.classList.remove('show'); }
        btn.classList.remove('pulsing');

        spawnRain();

        /* Re-enable tease & hint after new rain settles */
        setTimeout(() => {
          if (hint) { hint.style.opacity = '1'; hint.classList.add('show'); }
          btn.classList.add('pulsing');
          teaseActive = true;
          clearTimeout(teaseTimer);
          startTease();
        }, 5000);
      };

      /* Fallback auto-replay: if the user hasn't interacted by 7s,
         replay once on our own. This timer is cancelled by
         armAudioAndReplay() above as soon as a real gesture fires,
         so we never double-fire. */
      window._heroAutoReplayTimer = setTimeout(function() {
        window._heroAutoReplayTimer = null;
        // Only auto-replay if the user is still parked on the hero.
        if (!stillInHero()) return;
        if (typeof window.replayRain === 'function') {
          window.replayRain();
        }
      }, 7000);

    })();

    /* ── Title morph: hero centre → nav logo on scroll ─────── */
    (function() {
      var h1      = document.querySelector('.title');
      var navLogo = document.querySelector('.eg-nav-logo');
      if (!h1 || !navLogo) return;

      var clone = document.createElement('div');
      clone.className = 'title-morph';
      clone.setAttribute('aria-hidden', 'true');
      clone.innerHTML = 'EscapeGravity<sup class="hero-tm">by <b><span style="font-size:1.15em">D</span>eep<span style="font-size:1.15em">K</span>ids</b></sup>';
      document.body.appendChild(clone);

      var scrollRange, startX, startY, startFontSize,
          endX, endY, endFontSize, scaleEnd, padLR;

      function measure() {
        clone.style.display = 'none';
        h1.style.visibility = 'visible';
        h1.style.animation  = 'float-title 7s ease-in-out infinite';

        var saved = window.pageYOffset || 0;
        var hr = h1.getBoundingClientRect();
        var nr = navLogo.getBoundingClientRect();

        startFontSize = parseFloat(getComputedStyle(h1).fontSize);
        endFontSize   = parseFloat(getComputedStyle(navLogo).fontSize);
        scaleEnd      = endFontSize / startFontSize;
        padLR         = getComputedStyle(h1).paddingLeft;

        startX = hr.left;
        startY = hr.top + saved;
        endX   = nr.left;
        endY   = nr.top;

        scrollRange = window.innerHeight * 0.38;

        clone.style.cssText =
          'position:fixed;z-index:1001;pointer-events:none;' +
          'font-family:Norwester,sans-serif;font-variant:small-caps;' +
          'font-weight:normal;font-style:normal;' +
          'line-height:.88;white-space:nowrap;' +
          'font-size:' + startFontSize + 'px;' +
          'color:#fff;' +
          'text-shadow:0 0 26px rgba(170,89,200,.55),3px 3px 0 rgba(0,0,0,.9);' +
          'background:rgba(10,6,24,.6);' +
          'padding:12px ' + padLR + ';' +
          'border-radius:8px;' +
          'transform-origin:left top;' +
          'will-change:transform,opacity;';

        clone.style.display = '';
        h1.style.visibility = 'hidden';
        h1.style.animation  = 'none';
        onScroll();
      }

      function ease(t) { return 1 - Math.pow(1 - t, 3); }

      function onScroll() {
        var scrollY = window.pageYOffset || 0;
        var rawP    = Math.min(scrollY / scrollRange, 1);
        var p       = ease(rawP);

        if (rawP >= 1) {
          clone.style.opacity   = '0';
          navLogo.style.opacity = '1';
          return;
        }

        var pageX = startX;
        var pageY = startY - scrollY;

        var curX = pageX + (endX - pageX) * p;
        var curY = pageY + (endY - pageY) * p;
        var s    = 1 + (scaleEnd - 1) * p;

        clone.style.left      = curX + 'px';
        clone.style.top       = curY + 'px';
        clone.style.transform = 'scale(' + s + ')';

        clone.style.background = 'rgba(10,6,24,' + (0.6 * (1 - p)) + ')';

        var r = Math.round(255 + (170 - 255) * p);
        var g = Math.round(255 + (89  - 255) * p);
        var b = Math.round(255 + (200 - 255) * p);
        clone.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';

        var a = 1 - p;
        clone.style.textShadow =
          '0 0 26px rgba(170,89,200,' + (0.55 * a) + '),' +
          '3px 3px 0 rgba(0,0,0,' + (0.9 * a) + ')';

        // Smooth crossfade over the last 20% of the scroll range
        // so the clone melts into the nav logo instead of snapping.
        var fadeZone = 0.8;
        if (rawP > fadeZone) {
          var fp = (rawP - fadeZone) / (1 - fadeZone);
          clone.style.opacity   = String(1 - fp);
          navLogo.style.opacity = String(fp);
        } else {
          clone.style.opacity   = '1';
          navLogo.style.opacity = '0';
        }
      }

      var ticking = false;
      window.addEventListener('scroll', function() {
        if (!ticking) {
          requestAnimationFrame(function() { ticking = false; onScroll(); });
          ticking = true;
        }
      }, { passive: true });

      var rt;
      window.addEventListener('resize', function() {
        clearTimeout(rt); rt = setTimeout(measure, 200);
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measure);
      } else {
        setTimeout(measure, 300);
      }
    })();
    var RAZORPAY_KEY_ID = 'rzp_live_T3ZTo2sM5OJff2'; // public Key ID only — safe to expose client-side
    var currentOrder = null;
    var leadEmailSent = false; // ensures only one email/sheet row per pre-order attempt

    function restorePreOrderFromLink() {
      var qsPhone = new URLSearchParams(window.location.search).get('phone');
      if (!qsPhone) return;
      doPreOrder();
      var ccEl = document.getElementById('po-cc');
      var phoneEl = document.getElementById('po-phone');
      if (phoneEl) phoneEl.value = qsPhone.replace(/^91/, '');
      if (ccEl) ccEl.value = '+91';
      fetch('/api/get-draft?phone=' + encodeURIComponent(qsPhone))
        .then(function(r) { return r.json(); })
        .then(function(result) {
          var draft = result && result.draft;
          if (!draft) return;
          var setVal = function(id, val) {
            var el = document.getElementById(id);
            if (el && val) el.value = val;
          };
          setVal('po-cc', draft.cc);
          setVal('po-phone', draft.raw_phone);
          setVal('po-name', draft.name);
          setVal('po-address', draft.address);
          setVal('po-city', draft.city);
          setVal('po-pincode', draft.pincode);
          setVal('po-state', draft.state);
        })
        .catch(function() {});
    }
    document.addEventListener('DOMContentLoaded', restorePreOrderFromLink);

    function doPreOrder() {
      var modal = document.getElementById('preorder-modal');
      if (modal) modal.classList.add('show');
      leadEmailSent = false;
      // Event: user opened pre-order modal
      if (typeof gtag === 'function') gtag('event', 'open_preorder', { event_category: 'engagement' });
      if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
    }
    function closePreOrderModal() {
      var modal = document.getElementById('preorder-modal');
      if (modal) modal.classList.remove('show');
      // If they filled in any details but the attempt never reached a final
      // outcome (success/failed/cancelled), capture it as one lead record.
      var name = (document.getElementById('po-name') || {}).value || '';
      var phone = (document.getElementById('po-phone') || {}).value || '';
      var cc = (document.getElementById('po-cc') || {}).value || '+91';
      if (!leadEmailSent && (name.trim() || phone.trim())) {
        var digits = phone.replace(/\D/g, '');
        var fullNumber = digits ? (cc.startsWith('+') ? cc : '+' + cc) + digits : '';
        var address = (document.getElementById('po-address') || {}).value || '';
        var city = (document.getElementById('po-city') || {}).value || '';
        var pincode = (document.getElementById('po-pincode') || {}).value || '';
        var state = (document.getElementById('po-state') || {}).value || '';
        var fullAddress = [address, city, pincode, state].filter(Boolean).join(', ');
        leadEmailSent = true;
        sendLeadData(name.trim(), fullNumber, fullAddress, 'Closed Without Paying', '');
        sendWhatsAppMessage('order_started_new', fullNumber, [name], '?phone=' + fullNumber.replace(/^\+/, ''));
      }
    }
    function sendLeadData(name, whatsapp, address, status, paymentId) {
      // Email
      var data = new FormData();
      data.append('name', name);
      data.append('whatsapp', whatsapp);
      data.append('address', address || '—');
      data.append('payment_status', status);
      if (paymentId) data.append('razorpay_payment_id', paymentId);
      data.append('amount', '₹2,499');
      data.append('_subject', 'EscapeGravity Pre-Order [' + status + ']: ' + name);
      data.append('_template', 'table');
      data.append('_captcha', 'false');
      var emailPromise = fetch('https://formsubmit.co/ajax/sahyujyahs@gmail.com', {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: data
      }).catch(function(){});
      // Google Sheet
      var sheetPromise;
      try {
        sheetPromise = fetch('https://docs.google.com/forms/d/e/1FAIpQLSd3biGQLvWYqNxXvwLJUqekETPWNx1-BnM1VH-UOX8meoOHcA/formResponse', {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'entry.1636497169=' + encodeURIComponent(name) +
                '&entry.1301511467=' + encodeURIComponent(whatsapp) +
                '&entry.1152692251=' + encodeURIComponent('Pre-Order: ' + status + (paymentId ? ' [' + paymentId + ']' : ''))
        }).catch(function(){});
      } catch(ex) { sheetPromise = Promise.resolve(); }
      // Caller must wait on this before navigating away — otherwise the
      // browser can abort these requests mid-flight on page unload, which
      // is why successful payments were sometimes never recorded.
      return Promise.allSettled([emailPromise, sheetPromise]);
    }
    function withTimeout(promise, ms) {
      return Promise.race([promise, new Promise(function(resolve) { setTimeout(resolve, ms); })]);
    }
    // Sends exactly one pre-approved WhatsApp template message per pre-order
    // attempt: 'order_started_new' for any non-success outcome, 'order_complete'
    // only when payment actually succeeds. Token lives server-side only.
    function sendWhatsAppMessage(template, phone, bodyParams, buttonParam) {
      if (!phone) return Promise.resolve();
      return fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone, template: template, bodyParams: bodyParams, buttonParam: buttonParam })
      }).catch(function(){});
    }
    function openPlayTest() {
      var modal = document.getElementById('playtest-modal');
      if (modal) modal.classList.add('show');
      if (typeof gtag === 'function') gtag('event', 'open_playtest', { event_category: 'engagement' });
      if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: 'playtest_modal' });
    }
    function closePlayTest() {
      var modal = document.getElementById('playtest-modal');
      if (modal) modal.classList.remove('show');
    }
    function submitPreOrder(e) {
      e.preventDefault();
      var form = e.target;
      var cc      = form.querySelector('#po-cc').value.trim();
      var phone   = form.querySelector('#po-phone').value.trim();
      var name    = form.querySelector('#po-name').value.trim();
      var address = form.querySelector('#po-address').value.trim();
      var city    = form.querySelector('#po-city').value.trim();
      var pincode = form.querySelector('#po-pincode').value.trim();
      var state   = form.querySelector('#po-state').value.trim();
      var msg     = document.getElementById('po-msg');
      msg.textContent = '';
      msg.className = 'po-msg';

      var digits = phone.replace(/\D/g, '');
      if (!cc.match(/^\+?\d{1,4}$/)) {
        msg.textContent = 'Please enter a valid country code (e.g. +91).';
        msg.classList.add('err'); return false;
      }
      if (digits.length < 7 || digits.length > 15) {
        msg.textContent = 'Please enter a valid phone number.';
        msg.classList.add('err'); return false;
      }
      if (!name || !address || !city || !pincode || !state) {
        msg.textContent = 'Please fill in all fields.';
        msg.classList.add('err'); return false;
      }

      var fullNumber = (cc.startsWith('+') ? cc : '+' + cc) + digits;
      var fullAddress = address + ', ' + city + ' - ' + pincode + ', ' + state;

      currentOrder = { name: name, phone: fullNumber, address: fullAddress };
      fetch('/api/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullNumber, cc: cc, rawPhone: digits, name: name,
          address: address, city: city, pincode: pincode, state: state
        })
      }).catch(function(){});

      if (typeof gtag === 'function') {
        gtag('event', 'pay_now_click', { event_category: 'conversion', event_label: 'preorder', value: 2499, currency: 'INR' });
        gtag('event', 'conversion', { 'send_to': 'AW-11336704198/ob8dCOfhsqAcEMbB4Z0q', 'value': 2499, 'currency': 'INR' });
      }
      if (typeof fbq === 'function') fbq('track', 'AddPaymentInfo', { value: 2499, currency: 'INR', content_name: 'EscapeGravity' });

      var submitBtn = form.querySelector('.po-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.querySelector('.btn-label').textContent = 'Loading...'; }

      // Order is created server-side (Cloudflare Pages Function) so the
      // Razorpay Key Secret never touches the browser.
      fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 249900, receipt: 'EG-' + Date.now() })
      })
        .then(function(r) { return r.json(); })
        .then(function(order) {
          if (!order.order_id) throw new Error(order.error || 'Could not create order');
          openRazorpayCheckout(order.order_id, name, fullNumber, fullAddress, msg, submitBtn);
        })
        .catch(function(err) {
          msg.textContent = 'Could not start payment. Please try again.';
          msg.className = 'po-msg err';
          if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('.btn-label').textContent = 'Pay Now'; }
        });

      return false;
    }

    function openRazorpayCheckout(orderId, name, fullNumber, fullAddress, msg, submitBtn) {
      var options = {
        key: RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: 249900,
        currency: 'INR',
        name: 'DeepKids',
        description: 'EscapeGravity Pre-Order',
        image: 'https://deepkids.in/apple-touch-icon.png',
        prefill: { name: name, contact: fullNumber },
        theme: { color: '#6b2155' },
        handler: function(response) {
          // Signature is verified server-side — the frontend never decides
          // on its own that a payment succeeded.
          fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })
            .then(function(r) { return r.json(); })
            .then(function(result) {
              if (!result.verified) {
                msg.textContent = 'Payment verification failed. If you were charged, contact us with your payment ID: ' + response.razorpay_payment_id;
                msg.className = 'po-msg err';
                if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('.btn-label').textContent = 'Pay Now'; }
                return;
              }
              var paymentId = response.razorpay_payment_id;
              try {
                var preorders = JSON.parse(localStorage.getItem('eg-preorders') || '[]');
                preorders.push({ name: name, whatsapp: fullNumber, address: fullAddress, payment_id: paymentId, ts: new Date().toISOString() });
                localStorage.setItem('eg-preorders', JSON.stringify(preorders));
              } catch(ex) {}
              leadEmailSent = true;
              if (typeof gtag === 'function') { gtag('event', 'preorder_paid', { event_category: 'conversion' }); gtag('event', 'conversion', { 'send_to': 'AW-11336704198/ob8dCOfhsqAcEMbB4Z0q', 'value': 2499, 'currency': 'INR' }); }
              if (typeof fbq === 'function') fbq('track', 'Purchase', { value: 2499, currency: 'INR', content_name: 'EscapeGravity' });
              var params = new URLSearchParams({ name: name, phone: fullNumber, address: fullAddress, payment_id: paymentId });
              var notifyPromise = Promise.allSettled([
                sendLeadData(name, fullNumber, fullAddress, 'Payment Successful', paymentId),
                sendWhatsAppMessage('order_complete', fullNumber, [name, paymentId])
              ]);
              withTimeout(notifyPromise, 4000).then(function() {
                window.location.href = '/order-confirmed.html?' + params.toString();
              });
            })
            .catch(function() {
              msg.textContent = 'Could not verify payment. If you were charged, contact us with your payment ID: ' + response.razorpay_payment_id;
              msg.className = 'po-msg err';
              if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('.btn-label').textContent = 'Pay Now'; }
            });
        },
        modal: {
          ondismiss: function() {
            if (leadEmailSent) return;
            leadEmailSent = true;
            sendLeadData(name, fullNumber, fullAddress, 'Payment Cancelled', '');
            sendWhatsAppMessage('order_started_new', fullNumber, [name], '?phone=' + fullNumber.replace(/^\+/, ''));
            msg.textContent = 'Payment cancelled. Try again when ready!';
            msg.className = 'po-msg err';
            if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('.btn-label').textContent = 'Pay Now'; }
          }
        }
      };
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(response) {
        leadEmailSent = true;
        sendLeadData(name, fullNumber, fullAddress, 'Payment Failed', '');
        sendWhatsAppMessage('order_started_new', fullNumber, [name], '?phone=' + fullNumber.replace(/^\+/, ''));
        msg.textContent = 'Payment failed: ' + (response.error && response.error.description ? response.error.description : 'please try again.');
        msg.className = 'po-msg err';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('.btn-label').textContent = 'Pay Now'; }
      });
      rzp.open();
    }

    function submitPlayTest(e) {
      e.preventDefault();
      var form = e.target;
      var cc = form.querySelector('#pt-cc').value.trim();
      var phone = form.querySelector('#pt-phone').value.trim();
      var name = form.querySelector('#pt-name').value.trim();
      var msg = document.getElementById('pt-msg');
      msg.textContent = '';
      msg.className = 'po-msg';
      var digits = phone.replace(/\D/g, '');
      if (!cc.match(/^\+?\d{1,4}$/)) { msg.textContent = 'Please enter a valid country code.'; msg.classList.add('err'); return false; }
      if (digits.length < 7 || digits.length > 15) { msg.textContent = 'Please enter a valid phone number.'; msg.classList.add('err'); return false; }
      if (!name) { msg.textContent = 'Please enter your name.'; msg.classList.add('err'); return false; }
      var fullNumber = (cc.startsWith('+') ? cc : '+' + cc) + digits;
      try {
        var pts = JSON.parse(localStorage.getItem('eg-playtests') || '[]');
        pts.push({ name: name, whatsapp: fullNumber, ts: new Date().toISOString() });
        localStorage.setItem('eg-playtests', JSON.stringify(pts));
      } catch(ex) {}
      var data = new FormData();
      data.append('name', name);
      data.append('whatsapp', fullNumber);
      var gp2 = typeof window.getGravityPoints === 'function' ? window.getGravityPoints() : 0;
      data.append('signup_type', 'Playtest');
      data.append('gravity_points', gp2);
      data.append('_subject', 'EscapeGravity Playtest: ' + name + ' (' + gp2 + ' pts)');
      data.append('_template', 'table');
      data.append('_captcha', 'false');
      msg.textContent = 'Submitting…';
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch('https://formsubmit.co/ajax/sahyujyahs@gmail.com', {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: data
      }).then(function(r) { return r.json(); }).then(function() {
        var gpMsg2 = gp2 > 0 ? ' Your ' + gp2 + ' Gravity Points (₹' + gp2 + ' discount) are saved!' : '';
        msg.textContent = '✓ Awesome! We\'ll WhatsApp you to schedule a play test.' + gpMsg2;
        if (typeof gtag === 'function') gtag('event', 'playtest_submit', { event_category: 'conversion' }); gtag('event', 'conversion', { 'send_to': 'AW-11336704198/ob8dCOfhsqAcEMbB4Z0q', 'value': 1.0, 'currency': 'INR' });
        if (typeof fbq === 'function') fbq('track', 'CompleteRegistration', { content_name: 'playtest' });
        msg.className = 'po-msg success';
        form.reset();
        setTimeout(closePlayTest, 2800);
      }).catch(function() {
        msg.textContent = 'Saved! We\'ll reach out to schedule your play test.';
        msg.className = 'po-msg success';
        setTimeout(closePlayTest, 2800);
      }).finally(function() { if (btn) btn.disabled = false; });

      // Save to Google Sheet via Google Forms (runs in parallel, always)
      try {
        fetch('https://docs.google.com/forms/d/e/1FAIpQLSd3biGQLvWYqNxXvwLJUqekETPWNx1-BnM1VH-UOX8meoOHcA/formResponse', {
          method: 'POST', mode: 'no-cors',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'entry.1636497169=' + encodeURIComponent(name) + '&entry.1301511467=' + encodeURIComponent(fullNumber) + '&entry.1152692251=Playtest'
        }).catch(function(){});
      } catch(ex) {}
      return false;
    }
    // Close modal on backdrop click / Esc
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePreOrderModal();
    });


// ===== Misc Utilities =====
// ---- (originally index.html lines 2776-2832) ----
(function(){
  var cards = document.querySelectorAll('.ps-card');
  var reasons = document.querySelectorAll('.ps-reason');
  function gPlay(buf, vol) { if (window.playBoxSound && buf) window.playBoxSound(buf, vol); }
  function playClick() { gPlay(window._cardFlipBuf, 0.3); }
  function playScroll() { gPlay(window._cardScrollBuf, 0.15); }

  cards.forEach(function(c) {
    c.addEventListener('click', playClick);
    c.addEventListener('mouseenter', function() { gPlay(window._cardScrollBuf, 0.1); });
  });
  reasons.forEach(function(r) {
    r.addEventListener('click', playClick);
  });

  if (!cards.length || !('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { e.target.classList.toggle('visible', e.isIntersecting); });
  }, { threshold: 0.3 });
  cards.forEach(function(c) { obs.observe(c); });

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
  if (rc && 'IntersectionObserver' in window) {
    var rObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { e.target.classList.toggle('in-view', e.isIntersecting); });
    }, { threshold: 0.1 });
    rObs.observe(rc);
  }
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

// ---- (originally index.html lines 3098-3153) ----
(function(){
  var cards = document.querySelectorAll('.unlearn-card');
  // Flip with sound
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      card.classList.toggle('flipped');
      if (window.playBoxSound && window._cardFlipBuf) {
        window.playBoxSound(window._cardFlipBuf, 0.4);
      }
    });
  });

  // Entry animation every time + hint wiggle
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        e.target.classList.toggle('u-visible', e.isIntersecting);
      });
    }, { threshold: 0.3 });
    cards.forEach(function(c, i) {
      c.style.transitionDelay = (i * 0.12) + 's';
      obs.observe(c);
    });
  }

  // Sound on hover
  cards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      if (window.playBoxSound && window._cardScrollBuf) window.playBoxSound(window._cardScrollBuf, 0.1);
    });
  });

  // Scroll sound + parallax on horizontal scroll
  var grid = document.querySelector('.unlearn-grid');
  var scrollTimer = null;
  if (grid) {
    grid.addEventListener('scroll', function() {
      if (!scrollTimer) {
        if (window.playBoxSound && window._cardScrollBuf) {
          window.playBoxSound(window._cardScrollBuf, 0.15);
        }
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

// ---- (originally index.html lines 3356-3519) ----
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
  var boxAudioCtx = null;
  window._cardFlipBuf = null;
  window._cardScrollBuf = null;
  var cardFlipBuf = null;
  var cardScrollBuf = null;
  function getBoxAudio() {
    if (!boxAudioCtx) boxAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return boxAudioCtx;
  }
  function loadBoxSound(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status === 200) {
        getBoxAudio().decodeAudioData(xhr.response, function(buf) { cb(buf); });
      }
    };
    xhr.send();
  }
  loadBoxSound('cardflip sound.wav', function(b) { window._cardFlipBuf = b; cardFlipBuf = b; });
  loadBoxSound('cardsscrollsound.wav', function(b) { window._cardScrollBuf = b; cardScrollBuf = b; });

  window.playBoxSound = function(buf, vol) {
    if (!buf || !boxAudioCtx) return;
    try {
      if (boxAudioCtx.state === 'suspended') boxAudioCtx.resume();
      var src = boxAudioCtx.createBufferSource();
      src.buffer = buf;
      var gain = boxAudioCtx.createGain();
      gain.gain.value = vol || 0.5;
      src.connect(gain);
      gain.connect(boxAudioCtx.destination);
      src.start();
    } catch(e) {}
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
    var entryObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        pin.classList.add('s2-entered');
        entryObs.unobserve(pin);
      }
    }, { threshold: 0.05 });
    entryObs.observe(pin);

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


// ===== Gallery Video =====
// ---- (originally index.html lines 3561-3575) ----
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


// ===== Misc Utilities =====
// ---- (originally index.html lines 3783-3844) ----
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
  if ('IntersectionObserver' in window) {
    var gridObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          grid.classList.add('visible');
          gridObs.unobserve(grid);
        }
      });
    }, { threshold: 0.05 });
    gridObs.observe(grid);
  } else {
    grid.classList.add('visible');
  }

  // Soft pop sound on each individual illustration hover/tap
  var expAc = null;
  function playExpPop() {
    try {
      if (!expAc) expAc = new (window.AudioContext || window.webkitAudioContext)();
      if (expAc.state === 'suspended') expAc.resume();
      var osc = expAc.createOscillator();
      var gain = expAc.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680 + Math.random() * 200, expAc.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, expAc.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, expAc.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, expAc.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(expAc.destination);
      osc.start();
      osc.stop(expAc.currentTime + 0.18);
    } catch(err) {}
  }
  grid.querySelectorAll('.exp-item').forEach(function(item) {
    item.addEventListener('pointerenter', playExpPop);
  });
})();

// ---- (originally index.html lines 4110-4125) ----
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

// ---- (originally index.html lines 4320-4383) ----
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

// ---- (originally index.html lines 4604-4616) ----
(function(){
  var tabs = document.querySelectorAll('.s4b-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.s4b-panel').forEach(function(p) { p.classList.remove('active'); });
      document.getElementById('s4b-' + tab.getAttribute('data-tab')).classList.add('active');
    });
  });
})();

// ---- (originally index.html lines 4847-4869) ----
(function(){
  // Tab switching
  var tabs = document.querySelectorAll('.s6b-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.s6b-panel').forEach(function(p) { p.classList.remove('active'); });
      document.getElementById('s6b-' + tab.getAttribute('data-tab')).classList.add('active');
    });
  });

  // Fan stack — click to swap front/back card
  var fan = document.getElementById('s6b-fan');
  if (fan) {
    fan.addEventListener('click', function() {
      fan.classList.toggle('swapped');
      if (window.sndCardFlip && window.playSound) window.playSound(window.sndCardFlip, 0.45);
    });
  }
})();


// ===== Dice Roll / S2 Game Logic =====
// ---- (originally index.html lines 5833-7841) ----
(function(){
  'use strict';

  /* ── Config ─────────────────────────────────────────────── */
  const ZOOM_DURATION = 6000;    // ms — spin and zoom
  const END_SCALE = 2.2;
  const END_ROT = -1.570796; // -90° anticlockwise
  const BOARD_CENTER_NX  = 0.511;
  const BOARD_CENTER_NY  = 0.500;
  const TILE10_NX        = 0.6344;
  const TILE11_NX        = 0.705;  // ring at ~95-110° CW = right top in rotated view
  const TILE11_NY        = 0.555;  // lower-right quadrant of original = right after -90° rot
  const TILE10_NY        = 0.3071;
  const TILE7_NX         = 0.637;  // tile 7 — same angle as tile 11, ~65% radius
  const TILE7_NY         = 0.536;
  const TILE3_NX         = 0.579;  // tile 3 — same angle as tile 11, ~35% radius
  const TILE3_NY         = 0.520;
  const TILE2_NX         = 0.579;  // tile 2 — same height as tile 3, 4 tiles to the left after rotation
  const TILE2_NY         = 0.415;
  // Force category icon positions within each tile (inner edge of arc)
  const ICON11_NX        = 0.6895; // Earth icon on tile 11
  const ICON11_NY        = 0.5506;
  const ICON7_NX         = 0.6270; // Any 2 Cards icon on tile 7
  const ICON7_NY         = 0.5329;
  const ICON3_NX         = 0.5738; // Body icon on tile 3
  const ICON3_NY         = 0.5178;
  const FOCUS_NX         = 0.6472;   // midpoint T10↔T11 (base value)
  const FOCUS_NY         = 0.5092;
  let   curFocusNX       = FOCUS_NX;   // updated during tile-11 zoom
  let   curFocusNY       = FOCUS_NY;
  let   endScale         = 3.0;        // final responsive scale (set in startZoom)

  function smoothstep(t) { return t * t * (3 - 2 * t); }

  /* ── Elements ────────────────────────────────────────────── */
  const cv      = document.getElementById('s2-canvas');
  const ctx     = cv.getContext('2d');
  const rowEl   = document.getElementById('s2-board-row');
  const progress= document.getElementById('s2-progress');
  const label   = document.getElementById('s2-label');
  const diceWrap= document.getElementById('s2-dice-wrap');
  const dice    = document.getElementById('s2-dice');
  const tokBlue = document.getElementById('s2-tok-blue');
  const tokRed  = document.getElementById('s2-tok-red');

  /* ── How To Play sound effects (file-based) ──────────────── */
  var sndCardScroll  = new Audio('cardsscrollsound.wav');  sndCardScroll.preload = 'auto';
  var sndCardFlip    = new Audio('cardflip sound.wav');     sndCardFlip.preload = 'auto';
  var sndDiceRoll    = new Audio('dice roll sound2.wav');    sndDiceRoll.preload = 'auto';
  var sndTokenMove11 = new Audio('token move to tile 11.wav'); sndTokenMove11.preload = 'auto';
  var sndTokenDrop   = new Audio('token drops to tiles 7,3,2.wav'); sndTokenDrop.preload = 'auto';
  function playSound(snd, vol) {
    try { snd.currentTime = 0; snd.volume = vol || 0.45; snd.play().catch(function(){}); } catch(e){}
  }
  function stopSound(snd) {
    try { snd.pause(); snd.currentTime = 0; } catch(e){}
  }
  var sndBallBounce  = new Audio('ball bounce.wav');         sndBallBounce.preload = 'auto';
  // Expose sounds so the physical-challenges IIFE (pickCard,
  // initCardFan) and the Learning Full Circle section can use them.
  window.sndCardScroll = sndCardScroll;
  window.sndCardFlip   = sndCardFlip;
  window.sndBallBounce = sndBallBounce;
  window.playSound     = playSound;
  const hint    = document.getElementById('s2-hint');
  const result  = document.getElementById('s2-result');
  const navEl   = document.getElementById('s2-nav');
  const btnBack = document.getElementById('s2-back');
  const btnFwd  = document.getElementById('s2-fwd');
  const s2El    = document.getElementById('s3');

  /* ── State ───────────────────────────────────────────────── */
  let state   = 0;    // 0=wide, 1=zooming, 2=ready, 3=rolling, 4=done, 5=tile11-zoom, 6=resetting
  let busy    = false;
  let zoomRaf = null;
  let tile11Raf = null;
  let zoomStart = null;
  let currentScale = 1;
  let currentRotation = 0;

  function getEndScale() {
    const W = cssW();
    return W >= 1024 ? 3.0 : W >= 768 ? 2.1 : W >= 480 ? 1.9 : 1.8;
  }

  /* ── Load full board image ──────────────────────────────── */
  const boardImg = new Image();
  boardImg.src = 's2-board-full.webp';

  /* ── Canvas sizing ──────────────────────────────────────── */
  const canvasDPR = Math.min(window.devicePixelRatio || 1, 2);
  function cssW() { return cv.width / canvasDPR; }
  function cssH() { return cv.height / canvasDPR; }
  function resizeCanvas() {
    const r = rowEl.getBoundingClientRect();
    cv.width  = r.width  * canvasDPR;
    cv.height = r.height * canvasDPR;
    cv.style.width  = r.width  + 'px';
    cv.style.height = r.height + 'px';
    ctx.setTransform(canvasDPR, 0, 0, canvasDPR, 0, 0);
    drawBoard(currentScale, currentRotation);
  }
  window.addEventListener('resize', resizeCanvas);
  window.boardImg = boardImg;
  boardImg.onload = () => {
    currentScale = 1;
    currentRotation = 0;
    resizeCanvas();
  };

  /* ── Draw: zoom in while spinning anticlockwise ─────────────── */
  function drawBoard(scale, rotation) {
    const W = cssW(), H = cssH();
    const nat = boardImg.naturalWidth || 1200;
    const imgScale = Math.min(W, H) / nat;
    const dispW = nat * imgScale;
    const imgX  = (W - dispW) / 2;
    const imgY  = (H - dispW) / 2;
    const bCX = imgX + BOARD_CENTER_NX * dispW;  // rotation pivot
    const bCY = imgY + BOARD_CENTER_NY * dispW;
    const cos_r = Math.cos(rotation), sin_r = Math.sin(rotation);
    const fdx = (curFocusNX - BOARD_CENTER_NX) * dispW;
    const fdy = (curFocusNY - BOARD_CENTER_NY) * dispW;
    const rFx = bCX + cos_r*fdx - sin_r*fdy;   // rotated focus
    const rFy = bCY + sin_r*fdx + cos_r*fdy;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(canvasDPR, 0, 0, canvasDPR, 0, 0);
    ctx.save();
    ctx.translate(rFx, rFy);   // zoom centred on rotated focus
    ctx.scale(scale, scale);
    ctx.translate(-rFx, -rFy);
    ctx.translate(bCX, bCY);   // spin around board centre
    ctx.rotate(rotation);
    ctx.translate(-bCX, -bCY);
    ctx.drawImage(boardImg, imgX, imgY, dispW, dispW);
    ctx.restore();
  }

  /* ── Token placement ────────────────────────────────────────────── */
  /* Compute where board-normalised point (nx,ny) appears in #s3 px      */
  /* coordinates after the current rotation + zoom.                       */
  function tilePos(nx, ny) {
    const W = cssW(), H = cssH();
    const nat   = boardImg.naturalWidth || 1200;
    const dispW = Math.min(W, H);
    const imgX  = (W - dispW) / 2, imgY = (H - dispW) / 2;
    const bCX   = imgX + BOARD_CENTER_NX * dispW;
    const bCY   = imgY + BOARD_CENTER_NY * dispW;
    const cos_r = Math.cos(currentRotation);
    const sin_r = Math.sin(currentRotation);
    const fdx   = (curFocusNX - BOARD_CENTER_NX) * dispW;
    const fdy   = (curFocusNY - BOARD_CENTER_NY) * dispW;
    const rFx   = bCX + cos_r * fdx - sin_r * fdy;
    const rFy   = bCY + sin_r * fdx + cos_r * fdy;
    const pdx   = (nx - BOARD_CENTER_NX) * dispW;
    const pdy   = (ny - BOARD_CENTER_NY) * dispW;
    const rpx   = bCX + cos_r * pdx - sin_r * pdy;
    const rpy   = bCY + sin_r * pdx + cos_r * pdy;
    const cvx   = rFx + currentScale * (rpx - rFx);
    const cvy   = rFy + currentScale * (rpy - rFy);
    const cvR   = cv.getBoundingClientRect();
    const s2R   = s2El.getBoundingClientRect();
    return { x: cvR.left - s2R.left + cvx,
             y: cvR.top  - s2R.top  + cvy };
  }

  function showTokens() {
    const pos = tilePos(TILE10_NX, TILE10_NY);
    const stepDown  = Math.max(18, cssH() * 0.042);
    const stepRight = Math.max(18, cssW() * 0.032);
    const cx = pos.x + stepRight;
    const cy = pos.y + stepDown;

    const vw    = window.innerWidth;
    const blueW = Math.max(55, Math.min(130, vw * 0.08));
    const redW  = Math.max(42, Math.min( 95, vw * 0.06));
    const pad   = Math.max(6, vw * 0.006);

    // Blue on LEFT so it slides RIGHT to tile 11; Red stays RIGHT on tile 10
    const blueCx = cx - redW  / 2 - pad;
    const redCx  = cx + blueW / 2 + pad;

    tokBlue.classList.remove('slide');
    tokRed.classList.remove('slide');
    tokBlue.style.transition = '';
    tokRed.style.transition  = '';
    tokBlue.style.left   = blueCx + 'px';
    tokBlue.style.top    = cy + 'px';
    tokRed.style.left    = redCx  + 'px';
    tokRed.style.top     = cy + 'px';
    tokRed.style.opacity = '';
    tokBlue.classList.add('visible');
    tokRed.classList.add('visible');
  }

  function hideTokens() {
    tokBlue.classList.remove('visible', 'slide');
    tokRed.classList.remove('visible', 'slide');
  }

  /* ── Zoom canvas into tile 11 — show upper-right quadrant ──────────── */
  function zoomIntoTile11() {
    const startScale   = currentScale;
    const startFocusNX = curFocusNX;
    const startFocusNY = curFocusNY;

    const W  = cssW(), H = cssH();
    const dispW = Math.min(W, H);
    const bCX   = (W - dispW) / 2 + BOARD_CENTER_NX * dispW;
    const bCY   = (H - dispW) / 2 + BOARD_CENTER_NY * dispW;

    // Scale: derived so the 3rd arc from core fills the quadrant top-to-bottom
    //   S = BOTTOM_FRAC * H / (ring3_radius * dispW)  → 4.09 landscape, higher portrait
    const tgtScale = Math.min(4.8, 0.90 * H / (0.22 * dispW));

    // Geometric constraint: frame the upper-right quadrant exactly —
    //   board's vertical centre line  (rpx = bCX) → 5%  from viewport left
    //   board's horizontal centre line (rpy = bCY) → 90% from viewport top
    // Solving:  viewport_pos = rF + S*(canvas_pos - rF)
    //   => rF = (S*canvas_pos - target) / (S-1)
    const rFx = (tgtScale * bCX - 0.05 * W) / (tgtScale - 1);
    const rFy = (tgtScale * bCY - 0.90 * H) / (tgtScale - 1);

    // Convert to normalised focus coords used by drawBoard / tilePos
    const tgtFocusNX = BOARD_CENTER_NX + (bCY - rFy) / dispW;
    const tgtFocusNY = 0.500           + (rFx - bCX) / dispW;

    // Token sizing
    const vw = window.innerWidth;
    const bW = Math.max(55, Math.min(130, vw * 0.08));
    const rW = Math.max(42, Math.min( 95, vw * 0.06));
    const pd = Math.max(6,  vw * 0.006);

    function pinTokens() {
      const sd  = Math.max(18, cssH() * 0.042);
      const sr  = Math.max(18, cssW() * 0.032);
      const p10 = tilePos(TILE10_NX, TILE10_NY);
      const p11 = tilePos(TILE11_NX, TILE11_NY);
      const blueExtraDown = Math.max(12, cssH() * 0.055);
      tokRed.style.transition  = '';
      tokRed.style.left  = (p10.x + sr + bW / 2 + pd) + 'px';
      tokRed.style.top   = (p10.y + sd) + 'px';
      tokBlue.style.transition = '';
      tokBlue.style.left = (p11.x + sr) + 'px';
      tokBlue.style.top  = (p11.y + sd + blueExtraDown) + 'px';
    }

    const DURATION = 1800;
    let t11Start = null;
    function frame(ts) {
      if (!t11Start) t11Start = ts;
      const t = Math.min((ts - t11Start) / DURATION, 1);
      const e = smoothstep(t);
      currentScale = startScale + (tgtScale    - startScale) * e;
      curFocusNX   = startFocusNX + (tgtFocusNX - startFocusNX) * e;
      curFocusNY   = startFocusNY + (tgtFocusNY - startFocusNY) * e;
      drawBoard(currentScale, currentRotation);
      pinTokens();
      if (t < 1) {
        tile11Raf = requestAnimationFrame(frame);
      } else {
        state = 5;
      }
    }
    tile11Raf = requestAnimationFrame(frame);
  }

  /* ── Start zoom animation ───────────────────────────────── */
  /* ── Spin sound for the spiral turn + zoom in Step 2 ────── */
  var spinSound = new Audio('spin sound.wav');
  spinSound.preload = 'auto';
  function playSpinSound() {
    try {
      spinSound.currentTime = 0;
      spinSound.volume = 0.45;
      spinSound.play().catch(function(){});
    } catch(e){}
  }
  function stopSpinSound() {
    try { spinSound.pause(); spinSound.currentTime = 0; } catch(e){}
  }

  function startZoom() {
    state = 1; busy = true;
    zoomStart = null;
    // Only play spin sound when actually on the boardgame tab (Step 2).
    // The auto-zoom IntersectionObserver fires when s3 scrolls into
    // view regardless of which tab is active — playing the spin on
    // Step 1 was confusing.
    if (window.s2ActiveTab === 'boardgame') playSpinSound();
    // Show a walkthrough title explaining what's happening during the zoom.
    if (label) {
      label.innerHTML = '✦ &nbsp;Now, Roll Dice &amp; Move Your Token On The Board&nbsp; ✦';
      label.style.opacity = '1';
    }

    // Responsive scale: more zoom on wider screens, keeps tile 10 token visible
    endScale = getEndScale();
    const targetScale = endScale;

    // Phase 1 (0→50% of time): board spins 90° CCW at full scale — rotation clearly visible
    // Phase 2 (50→100%):       rotation locked, zoom in to tiles 10 & 11
    function getAnimState(t) {
      if (t <= 0.5) {
        const e = smoothstep(t / 0.5);
        return { s: 1.0, r: END_ROT * e };
      } else {
        const e = smoothstep((t - 0.5) / 0.5);
        return { s: 1.0 + (targetScale - 1.0) * e, r: END_ROT };
      }
    }
    function frame(ts) {
      if (!zoomStart) zoomStart = ts;
      const t = Math.min((ts - zoomStart) / ZOOM_DURATION, 1);
      const st = getAnimState(t);
      currentScale    = st.s;
      currentRotation = st.r;
      drawBoard(st.s, st.r);
      progress.style.width = (t * 100) + '%';
      if (t < 1) {
        zoomRaf = requestAnimationFrame(frame);
      } else {
        currentScale    = targetScale;
        currentRotation = END_ROT;
        drawBoard(targetScale, END_ROT);
        progress.style.opacity = '0';
        onZoomComplete();
      }
    }
    zoomRaf = requestAnimationFrame(frame);
  }

  function onZoomComplete() {
    state = 2; busy = false;
    setTimeout(() => {
      showTokens();
      label.style.opacity = '1';
      diceWrap.classList.add('show');
      dice.classList.add('idle');
      btnBack.disabled = false;
      btnFwd.disabled  = false;
    }, 400);
  }

  /* ── Reset zoom ─────────────────────────────────────────── */
  let resetRaf = null;
  function resetZoom() {
    hideTokens();
    cancelAnimationFrame(zoomRaf); zoomRaf = null;
    cancelAnimationFrame(resetRaf); resetRaf = null;
    const startScale = currentScale;
    const startRot   = currentRotation;
    const startTs = performance.now();
    const dur = 1400;
    state = 6; // 6 = resetting
    function backFrame(ts) {
      if (state !== 6) return;  // cancelled
      const t = Math.min((ts - startTs) / dur, 1);
      const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      currentScale    = startScale - (startScale - 1) * eased;
      currentRotation = startRot * (1 - eased);
      drawBoard(currentScale, currentRotation);
      if (t < 1) { resetRaf = requestAnimationFrame(backFrame); }
      else { jumpToState0(); }
    }
    requestAnimationFrame(backFrame);
  }

  /* ── Jump instantly to wide board (state 0), then auto-start ── */
  let autoStartTimer = null;
  function jumpToState0() {
    cancelAllAnimations();
    var bubble = document.getElementById('s2-comic-bubble');
    if (bubble) bubble.classList.remove('show');
    currentScale = 1; currentRotation = 0;
    curFocusNX = FOCUS_NX; curFocusNY = FOCUS_NY;
    drawBoard(1, 0);
    progress.style.width = '0%'; progress.style.opacity = '1';
    hideTokens();
    label.style.opacity = '0';
    diceWrap.classList.remove('show');
    diceWrap.classList.remove('hide');
    dice.classList.remove('idle','rolling');
    dice.style.transition = 'none';
    dice.style.transform = '';
    result.classList.remove('show');
    state = 0; busy = false;
    // Back button stays enabled at state 0 so the user can step
    // back across the step boundary into Step 1's last scene.
    btnBack.disabled = false; btnFwd.disabled = false;
    navEl.classList.add('show');
    // Auto-start zoom after 1 second
    autoStartTimer = setTimeout(() => {
      if (state === 0) startZoom();
    }, 1000);
  }

  /* ── Jump instantly to dice-ready (state 2) ────────────── */
  function jumpToState2() {
    cancelAllAnimations();
    var bubble = document.getElementById('s2-comic-bubble');
    if (bubble) bubble.classList.remove('show');
    endScale = getEndScale();
    currentScale = endScale;
    currentRotation = END_ROT;
    curFocusNX = FOCUS_NX; curFocusNY = FOCUS_NY;
    drawBoard(currentScale, currentRotation);
    progress.style.width = '100%'; progress.style.opacity = '0';
    // Reset dice/result appearance
    diceWrap.classList.remove('hide');
    diceWrap.classList.add('show');
    dice.classList.remove('rolling');
    dice.classList.add('idle');
    dice.style.transition = 'none';
    dice.style.transform = '';
    void dice.offsetWidth;
    dice.style.transition = '';
    result.classList.remove('show');
    hint.style.opacity = '1';
    if (label) {
      label.innerHTML = '✦ &nbsp;Roll The Dice&nbsp; ✦';
      label.style.opacity = '1';
    }
    showTokens();
    state = 2; busy = false;
    btnBack.disabled = false; btnFwd.disabled = false;
    navEl.classList.add('show');
  }

  /* ── Roll timers — tracked so they can be cancelled ─────── */
  let rollTimers = [];
  function clearRollTimers() {
    rollTimers.forEach(id => clearTimeout(id));
    rollTimers = [];
  }

  function cancelAllAnimations() {
    cancelAnimationFrame(zoomRaf); zoomRaf = null;
    cancelAnimationFrame(resetRaf); resetRaf = null;
    cancelAnimationFrame(tile11Raf); tile11Raf = null;
    clearTimeout(autoStartTimer);
    clearRollTimers();
    stopSpinSound();
    stopSound(sndDiceRoll);
    stopSound(sndTokenMove11);
    stopSound(sndTokenDrop);
  }
  // Expose so the tab handler can cancel doRoll's pending
  // auto-advance timer when the user manually switches tabs.
  window.cancelBoardgameAnims = cancelAllAnimations;

  /* ── Navigation ─────────────────────────────────────────── */
  window.s2ActiveTab = 'physical';

  /* Cross-step navigation:
       - Next at the END of a step advances to the NEXT step's first scene
       - Prev at the START of a step jumps back to the PREVIOUS step's last scene
       - Within a step, it still walks through that step's internal scenes
     Steps cycle: 1 ↔ 2 ↔ 3 ↔ 1 */
  window.s2GoBack = function() {

    if (window.s2ActiveTab === 'physical') {
      // pcGoBack handles cross-step wrap (start of Step 1 → Step 3)
      window.pcGoBack();
      return;
    }

    if (window.s2ActiveTab === 'science') {
      // Inside Step 3: Prev walks back through internal scenes
      // (tile 2 → tile 3 → tile 7 → tile 11). Only at scene 0
      // do we cross the boundary back into Step 2's last scene.
      if (typeof window.sciCurrentScene === 'function' && window.sciCurrentScene() > 0) {
        if (typeof window.sciShowScene === 'function') {
          window.sciShowScene(window.sciCurrentScene() - 1);
        }
        return;
      }
      // Scene 0 → Step 2 last scene (token at tile 11, bubble + link).
      // Manually update tabs/panels and jump straight to state 4.
      if (typeof window.cleanupStep3 === 'function') window.cleanupStep3();
      var bgTab2 = document.querySelector('.s2-tab[data-panel="boardgame"]');
      var sciTab2 = document.querySelector('.s2-tab[data-panel="science"]');
      if (bgTab2) bgTab2.classList.add('active');
      if (sciTab2) sciTab2.classList.remove('active');
      window.s2ActiveTab = 'boardgame';
      var s3El2 = document.getElementById('s3');
      if (s3El2) s3El2.classList.remove('step3-view');
      // Suppress the auto-advance so it doesn't fire while the
      // user is browsing backward.
      window._step2ForwardState4 = false;
      // Hide ALL Step 3 overlays BEFORE switching to prevent a flash
      var bblPrev = document.getElementById('s2-comic-bubble');
      if (bblPrev) { bblPrev.classList.remove('show'); bblPrev.style.transition = 'none'; }
      var inlineFcPrev = document.getElementById('s2-inline-fc');
      if (inlineFcPrev) { inlineFcPrev.classList.remove('show'); inlineFcPrev.classList.remove('step3-card'); }
      if (window.jumpToState4) window.jumpToState4();
      // After board settles, show bubble at the correct position
      setTimeout(function() {
        if (bblPrev && typeof window.setBubbleContentTile11Step2 === 'function') {
          window.setBubbleContentTile11Step2();
          if (typeof positionBubbleAtToken === 'function') positionBubbleAtToken(bblPrev, false);
          bblPrev.style.transition = '';
          bblPrev.classList.add('show');
        }
      }, 400);
      return;
    }

    // window.s2ActiveTab === 'boardgame'
    // Start of Step 2 → Step 1 last scene
    if (state === 0 || state === 1) {
      var pcTab = document.querySelector('.s2-tab[data-panel="physical"]');
      if (pcTab) {
        pcTab.click();
        setTimeout(function(){ if (window.pcJumpTo) window.pcJumpTo(2); }, 120);
      }
      return;
    }
    if (state === 6) {
      jumpToState0();
      return;
    }
    if (state === 2) {
      label.style.opacity = '0';
      diceWrap.classList.remove('show');
      dice.classList.remove('idle','rolling');
      resetZoom();
      return;
    }
    if (state === 3 || state === 4 || state === 5) {
      jumpToState2();
      return;
    }
  };

  window.s2GoForward = function() {

    if (window.s2ActiveTab === 'physical') {
      // pcGoForward handles cross-step wrap (end of Step 1 → Step 2)
      window.pcGoForward();
      return;
    }

    if (window.s2ActiveTab === 'science') {
      // Inside Step 3: Next walks through internal scenes
      // (tile 11 → 7 → 3 → 2). Only at the last scene do we
      // cross the boundary forward into Step 1's first scene.
      var maxScene = window.sciMaxScene || 3;
      if (typeof window.sciCurrentScene === 'function' && window.sciCurrentScene() < maxScene) {
        if (typeof window.sciShowScene === 'function') {
          window.sciShowScene(window.sciCurrentScene() + 1);
        }
        return;
      }
      // End of Step 3 → loop back to Step 1 start
      var pcTab = document.querySelector('.s2-tab[data-panel="physical"]');
      if (pcTab) pcTab.click();
      return;
    }

    // window.s2ActiveTab === 'boardgame'
    if (state === 0 || state === 1) {
      jumpToState2();
      return;
    }
    if (state === 2) {
      // Trigger the actual dice roll — animates, unlocks Step 3
      // tab and auto-advances to Step 3 when complete.
      doRoll();
      return;
    }
    // state 3 / 4 / 5 → end of Step 2, advance to Step 3
    if (state === 3 || state === 4 || state === 5) {
      var sciTab = document.querySelector('.s2-tab[data-panel="science"]');
      if (sciTab) {
        sciTab.classList.remove('locked');
        sciTab.click();
      }
      return;
    }
  };

  /* ── Jump to final scene: tile 11 zoomed with bubble ──── */
  function jumpToState4() {
    cancelAllAnimations();
    var bubble = document.getElementById('s2-comic-bubble');
    if (bubble) bubble.classList.remove('show');
    endScale = getEndScale();
    currentScale = endScale;
    currentRotation = END_ROT;
    curFocusNX = FOCUS_NX; curFocusNY = FOCUS_NY;
    drawBoard(currentScale, currentRotation);
    diceWrap.classList.remove('show');
    diceWrap.classList.add('hide');
    dice.classList.remove('idle','rolling');
    hint.style.opacity = '0';
    label.style.opacity = '0';
    result.classList.add('show');
    showTokens();
    var p11 = tilePos(TILE11_NX, TILE11_NY);
    var stepDown = Math.max(18, cssH() * 0.042);
    var stepRight = Math.max(18, cssW() * 0.032);
    var blueExtraDown = Math.max(12, cssH() * 0.055);
    tokBlue.style.transition = '';
    tokBlue.style.left = (p11.x + stepRight) + 'px';
    tokBlue.style.top = (p11.y + stepDown + blueExtraDown) + 'px';
    zoomIntoTile11();
    state = 4; busy = false;
    btnBack.disabled = false; btnFwd.disabled = false;
    // The bubble is shown by the doRoll flow or the Prev path,
    // so we don't show it here (that would cause a double-show).
  }

  /* ── Jump to tile-11 state with bubble for Step 3 ──────── */
  /* ── Jump to board view for Step 3: 180° CCW, core at bottom-left ── */
  function jumpToState4WithBubble() {
    cancelAllAnimations();
    var bubble = document.getElementById('s2-comic-bubble');
    if (bubble) bubble.classList.remove('show');

    // Rotated 90° CCW, zoomed to show tiles 11, 7, 3 and 2
    var rotation = -Math.PI / 2;
    var W = cssW(), H = cssH();
    var nat = (window.boardImg && window.boardImg.naturalWidth) || 1200;
    var imgScale = Math.min(W, H) / nat;
    var dispW = nat * imgScale;
    var bCX = (W - dispW) / 2 + BOARD_CENTER_NX * dispW;
    var bCY = (H - dispW) / 2 + BOARD_CENTER_NY * dispW;
    var tgtScale = 3.5;
    // Frame the tile 11→2 corridor — board center at 35% from left, 95% from top
    var tgtVpX = 0.35 * W;
    var tgtVpY = 0.95 * H;
    var focX = (tgtScale * bCX - tgtVpX) / (tgtScale - 1);
    var focY = (tgtScale * bCY - tgtVpY) / (tgtScale - 1);
    curFocusNX = BOARD_CENTER_NX + (bCY - focY) / dispW;
    curFocusNY = 0.500 + (focX - bCX) / dispW;
    currentScale = tgtScale;
    currentRotation = rotation;
    drawBoard(tgtScale, rotation);

    // Hide dice/result UI
    diceWrap.classList.remove('show');
    diceWrap.classList.add('hide');
    dice.classList.remove('idle','rolling');
    hint.style.opacity = '0';
    label.style.opacity = '0';
    result.classList.remove('show');
    progress.style.opacity = '0';

    // Show tokens at tile 10/11 positions
    showTokens();
    var p11 = tilePos(TILE11_NX, TILE11_NY);
    var p10 = tilePos(TILE10_NX, TILE10_NY);
    var sd = Math.max(18, cssH() * 0.042);
    var sr = Math.max(18, cssW() * 0.032);
    var blueExtra = Math.max(12, cssH() * 0.055);
    tokBlue.style.transition = '';
    tokBlue.style.left = (p11.x + sr) + 'px';
    tokBlue.style.top = (p11.y + sd + blueExtra) + 'px';
    tokRed.style.transition = '';
    tokRed.style.left = (p10.x + sr + 40) + 'px';
    tokRed.style.top = (p10.y + sd) + 'px';

    state = 4; busy = false;
    btnBack.disabled = false; btnFwd.disabled = false;
    // The bubble is shown by sciShowScene(0) (called from the
    // science-tab click handler), so we don't show it here — that
    // would just cause a brief flash before sciShowScene re-renders.
  }
  // Reset board position when leaving Step 3 (no-op now, kept for compatibility)
  window.resetBoardOffset = function() {};
  window.jumpToState4WithBubble = jumpToState4WithBubble;

  /* ── Dice roll ──────────────────────────────────────────── */
  window.s2Roll = function() {
    if (state === 2 && !busy) {
      doRoll();
      if (typeof gtag === 'function') gtag('event', 'howtoplay_dice_roll', { event_category: 'engagement' });
    }
  };
  window.jumpToState0 = jumpToState0;
  window.tilePos = tilePos;
  window.TILE11_NX = TILE11_NX; window.TILE11_NY = TILE11_NY;
  window.TILE7_NX = TILE7_NX; window.TILE7_NY = TILE7_NY;
  window.TILE3_NX = TILE3_NX; window.TILE3_NY = TILE3_NY;
  window.TILE2_NX = TILE2_NX; window.TILE2_NY = TILE2_NY;
  window.TILE10_NX = TILE10_NX; window.TILE10_NY = TILE10_NY;
  window.ICON11_NX = ICON11_NX; window.ICON11_NY = ICON11_NY;
  window.ICON7_NX = ICON7_NX; window.ICON7_NY = ICON7_NY;
  window.ICON3_NX = ICON3_NX; window.ICON3_NY = ICON3_NY;
  window.jumpToState4 = jumpToState4;

  /* ── Drop astronaut to tile 7 (exposed for force card flow) ── */
  window.dropToTile7 = function() {
    var p7 = tilePos(TILE7_NX, TILE7_NY);
    var sr = Math.max(18, cssW() * 0.032);
    var sd = Math.max(18, cssH() * 0.042);
    tokBlue.style.transition = 'top 1.5s cubic-bezier(.4,0,.2,1), left 1.5s cubic-bezier(.4,0,.2,1)';
    tokBlue.style.left = (p7.x + sr) + 'px';
    tokBlue.style.top  = (p7.y + sd) + 'px';
    playSound(sndTokenDrop, 0.5);
    setTimeout(function() { tokBlue.style.transition = ''; }, 1700);
  };

  /* Move astronaut back to tile 11 — used when navigating Prev
     in Step 3 from scene 1 → scene 0. Mirrors the positioning
     logic in jumpToState4WithBubble (with the blueExtra Y kick). */
  window.dropToTile11 = function() {
    var p11 = tilePos(TILE11_NX, TILE11_NY);
    var sr = Math.max(18, cssW() * 0.032);
    var sd = Math.max(18, cssH() * 0.042);
    var blueExtra = Math.max(12, cssH() * 0.055);
    tokBlue.style.transition = 'top 1.5s cubic-bezier(.4,0,.2,1), left 1.5s cubic-bezier(.4,0,.2,1)';
    tokBlue.style.left = (p11.x + sr) + 'px';
    tokBlue.style.top  = (p11.y + sd + blueExtra) + 'px';
    setTimeout(function() { tokBlue.style.transition = ''; }, 1700);
  };

  window.dropToTile3 = function() {
    var p3 = tilePos(TILE3_NX, TILE3_NY);
    var sr = Math.max(18, cssW() * 0.032);
    var sd = Math.max(18, cssH() * 0.042);
    tokBlue.style.transition = 'top 1.5s cubic-bezier(.4,0,.2,1), left 1.5s cubic-bezier(.4,0,.2,1)';
    tokBlue.style.left = (p3.x + sr) + 'px';
    tokBlue.style.top  = (p3.y + sd) + 'px';
    playSound(sndTokenDrop, 0.5);
    setTimeout(function() { tokBlue.style.transition = ''; }, 1700);
  };

  window.dropToTile2 = function() {
    var p2 = tilePos(TILE2_NX, TILE2_NY);
    var sr = Math.max(18, cssW() * 0.032);
    var sd = Math.max(18, cssH() * 0.042);
    tokBlue.style.transition = 'top 1.5s cubic-bezier(.4,0,.2,1), left 1.5s cubic-bezier(.4,0,.2,1)';
    tokBlue.style.left = (p2.x + sr) + 'px';
    tokBlue.style.top  = (p2.y + sd) + 'px';
    playSound(sndTokenDrop, 0.5);
    setTimeout(function() { tokBlue.style.transition = ''; }, 1700);
  };

  /* ── Position bubble attached to the token ─────────────────
     #s2-tok-blue is a direct child of #s3 (so it can overflow the
     board-row), but the bubble is inside #s2-board-row → so the
     two have DIFFERENT offsetParents.

     We use the token's TARGET style.left/top values (which are set
     immediately by dropToTile7/3/2 with a CSS transition) — NOT
     getBoundingClientRect() which would return the live, mid-
     animation position. Then we convert from the token's parent
     coordinate space to the bubble's parent coordinate space using
     a one-time delta computed from getBoundingClientRect of the
     two parents. The bubble then animates to its target position
     in sync with the token. */
  function positionBubbleAtToken(bubble, animate) {
    if (!bubble || !tokBlue) return;

    var bblW = bubble.offsetWidth  || 260;
    var bblH = bubble.offsetHeight || 110;

    // The token's TARGET position, in its own offset-parent space
    var tokTargetL = parseFloat(tokBlue.style.left) || 0;
    var tokTargetT = parseFloat(tokBlue.style.top)  || 0;
    var tokW = tokBlue.offsetWidth  || 80;
    var tokH = tokBlue.offsetHeight || 80;

    // Convert token's target position into bubble's offset-parent space
    var tokParent = tokBlue.offsetParent || document.body;
    var bblParent = bubble.offsetParent  || document.body;
    var tokParentRect = tokParent.getBoundingClientRect();
    var bblParentRect = bblParent.getBoundingClientRect();
    var deltaX = tokParentRect.left - bblParentRect.left;
    var deltaY = tokParentRect.top  - bblParentRect.top;

    var tokL = tokTargetL + deltaX;
    var tokT = tokTargetT + deltaY;

    // Container = bubble's offset parent
    var cw = bblParent.clientWidth  || window.innerWidth;
    var ch = bblParent.clientHeight || window.innerHeight;
    var padding = 4;
    // The bubble OVERLAPS the token by a chunk on the chosen side
    // so the bubble's edge sits noticeably inside the token's edge.
    var gap = -28;

    // Room on each side of the token (in bubble parent space)
    var roomRight = cw - (tokL + tokW) - gap - padding;
    var roomLeft  = tokL - gap - padding;
    var roomAbove = tokT - gap - padding;
    var roomBelow = ch - (tokT + tokH) - gap - padding;

    var finalLeft, finalTop;
    // On mobile the bubble usually lands LEFT of the token (no room
    // on the right). Shift it further UP so it doesn't hide the tile
    // the token is sitting on. On desktop, a gentler lift is enough.
    var isMobile = window.innerWidth <= 768;
    var sameRowTop = isMobile
      ? (tokT - bblH * 1.3)   // well above the token on mobile
      : (tokT - bblH * 0.6);  // slight lift on desktop

    if (roomRight >= bblW) {
      finalLeft = tokL + tokW + gap;
      finalTop  = sameRowTop;
    } else if (roomLeft >= bblW) {
      finalLeft = tokL - bblW - gap;
      finalTop  = sameRowTop;
    } else if (roomBelow >= bblH) {
      finalLeft = tokL + tokW / 2 - bblW / 2;
      finalTop  = tokT + tokH + gap;
    } else if (roomAbove >= bblH) {
      finalLeft = tokL + tokW / 2 - bblW / 2;
      finalTop  = tokT - bblH - gap;
    } else {
      finalLeft = (roomRight >= roomLeft)
        ? tokL + tokW + gap
        : tokL - bblW - gap;
      finalTop = sameRowTop;
    }

    // Clamp inside the container so nothing is clipped
    finalLeft = Math.max(padding, Math.min(cw - bblW - padding, finalLeft));
    finalTop  = Math.max(padding, Math.min(ch - bblH - padding, finalTop));

    if (animate) {
      bubble.style.transition = 'left 1.5s cubic-bezier(.4,0,.2,1), top 1.5s cubic-bezier(.4,0,.2,1)';
    }
    bubble.style.left = finalLeft + 'px';
    bubble.style.top  = finalTop  + 'px';
  }
  window.positionBubbleAtToken = positionBubbleAtToken;

  /* ── Position inline force card near token (exposed) ── */
  window.positionInlineFc = function() {
    var inlineFc = document.getElementById('s2-inline-fc');
    if (!inlineFc) return;
    var brRect = document.getElementById('s2-board-row').getBoundingClientRect();
    if (window.innerWidth <= 768) {
      // Mobile: place at top center of board area
      inlineFc.style.left = '50%';
      inlineFc.style.transform = 'translateX(-50%)';
      inlineFc.style.top = '10px';
    } else {
      var tokRect = tokBlue.getBoundingClientRect();
      var fcX = tokRect.left - brRect.left + tokRect.width + 20;
      var fcY = tokRect.top - brRect.top;
      fcX = Math.min(fcX, brRect.width - 200);
      fcY = Math.max(10, fcY);
      inlineFc.style.left = fcX + 'px';
      inlineFc.style.top = fcY + 'px';
      inlineFc.style.transform = '';
    }
  };

  function doRoll() {
    state = 3; busy = true;
    clearRollTimers();
    btnBack.disabled = false; btnFwd.disabled = false;
    dice.classList.remove('idle');
    dice.style.transition = 'none';
    dice.style.transform  = 'rotateX(0deg) rotateY(0deg)';
    void dice.offsetWidth;
    dice.style.transition = '';
    dice.classList.add('rolling');
    // Only play dice sound if the dice is actually being shown
    // (not when skipping ahead via Next/Prev navigation)
    if (diceWrap.classList.contains('show')) playSound(sndDiceRoll, 0.5);
    hint.style.opacity = '0';
    // Lock on face 1
    rollTimers.push(setTimeout(() => {
      if (state !== 3) return;
      dice.classList.remove('rolling');
      dice.style.transform = 'rotateX(720deg) rotateY(720deg)';
    }, 1600));
    // Show result + slide tokBlue to tile 11
    rollTimers.push(setTimeout(() => {
      if (state !== 3) return;
      diceWrap.classList.add('hide');
      result.classList.add('show');
      playSound(sndTokenMove11, 0.5);
      if (label) {
        label.innerHTML = '✦ &nbsp;Your Token Moves 1 Tile Over To Tile 11&nbsp; ✦';
        label.style.opacity = '1';
      }
      const p11       = tilePos(TILE11_NX, TILE11_NY);
      const stepDown  = Math.max(18, cssH() * 0.042);
      const stepRight = Math.max(18, cssW() * 0.032);
      const blueExtraDown = Math.max(12, cssH() * 0.055);
      const tgtLeft   = (p11.x + stepRight) + 'px';
      const tgtTop    = (p11.y + stepDown + blueExtraDown)  + 'px';
      void tokBlue.getBoundingClientRect();
      tokBlue.style.transition = 'left 3s cubic-bezier(.4,0,.2,1), top 3s cubic-bezier(.4,0,.2,1)';
      tokBlue.style.left = tgtLeft;
      tokBlue.style.top  = tgtTop;
      rollTimers.push(setTimeout(() => {
        if (state !== 3) return;
        tokBlue.style.transition = '';
        zoomIntoTile11();
      }, 3200));
      rollTimers.push(setTimeout(() => {
        if (state !== 3 && state !== 5) return;
        state = 4; busy = false;
        window.sessionHasReachedTile11 = true;
        var step3Tab = document.querySelector('.s2-tab[data-panel="science"]');
        if (step3Tab && step3Tab.classList.contains('locked')) {
          step3Tab.classList.remove('locked');
        }
        btnBack.disabled = false; btnFwd.disabled = false;

        // Step 2 last scene: show the comic bubble next to the
        // token at tile 11 with a "Go To Next Step" link.
        var bubble = document.getElementById('s2-comic-bubble');
        if (bubble) {
          if (typeof window.setBubbleContentTile11Step2 === 'function') {
            window.setBubbleContentTile11Step2();
          }
          positionBubbleAtToken(bubble, false);
          bubble.classList.add('show');
        }
        // Signal that state 4 was reached via forward flow
        window._step2ForwardState4 = true;
      }, 5000));
    }, 2000));
  }

  /* ── Step 2 → Step 3 auto-advance ─────────────────────────
     Polls every second. When state === 4, the boardgame tab is
     active, and the forward flag is set, it waits 3.5 s then
     clicks the Step 3 tab. Completely independent of rollTimers
     so cancelBoardgameAnims can never accidentally kill it. */
  window._step2ForwardState4 = false;
  (function step2AutoPoll() {
    setInterval(function() {
      if (state !== 4) return;
      if (window.s2ActiveTab !== 'boardgame') return;
      if (!window._step2ForwardState4) return;
      // Reached via forward flow — advance once
      window._step2ForwardState4 = false;
      setTimeout(function() {
        if (state !== 4 || window.s2ActiveTab !== 'boardgame') return;
        var sciTab = document.querySelector('.s2-tab[data-panel="science"]');
        if (sciTab) { sciTab.classList.remove('locked'); sciTab.click(); }
      }, 3500);
    }, 1000);
  })();

  /* ── Show nav when S2 is in view ─────────────────────────── */
  new IntersectionObserver(entries => {
    var e = entries[0];
    if (e.isIntersecting) {
      navEl.classList.add('show');
      // Both buttons stay enabled — Prev at state 0 walks back to
      // Step 1; Next at any state walks forward (and at the end
      // of Step 2 advances into Step 3).
      btnBack.disabled = false;
      btnFwd.disabled = false;
    } else {
      // Section scrolled out of view — DON'T clean up the bubble
      // or inline FC here. The user may scroll back and expects to
      // see the text box with the link still visible. Cleanup only
      // happens on an actual tab change.
    }
  }, { threshold: 0.3 }).observe(document.getElementById('s3'));

  /* ── Auto-trigger zoom when S2 is 80% in view ──────────── */
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && state === 0 && !busy) {
      clearTimeout(autoStartTimer);
      autoStartTimer = setTimeout(() => {
        if (state === 0) startZoom();
      }, 600);
    }
  }, { threshold: 0.4 }).observe(document.getElementById('s3'));

})();


/* ── S2 Tab switching ────────────────────────────────────── */
(function(){
  'use strict';
  var tabs = document.querySelectorAll('.s2-tab');
  var panels = document.querySelectorAll('.s2-panel');

  var tokBlue = document.getElementById('s2-tok-blue');
  var tokRed  = document.getElementById('s2-tok-red');
  var diceWrap = document.getElementById('s2-dice-wrap');
  var s2Nav    = document.getElementById('s2-nav');
  var s2Label  = document.getElementById('s2-label');
  var s2Progress = document.getElementById('s2-progress');

  function setBoardElementsVisible(show) {
    var v = show ? '' : 'none';
    if (tokBlue) tokBlue.style.display = v;
    if (tokRed)  tokRed.style.display = v;
    if (diceWrap) diceWrap.style.display = v;
    if (s2Label) s2Label.style.display = v;
    if (s2Progress) s2Progress.style.display = v;
    // Nav stays visible on physical tab too
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      if (tab.classList.contains('locked')) return;
      var target = tab.dataset.panel;
      // Track How To Play tab interaction for retargeting
      if (typeof gtag === 'function') gtag('event', 'howtoplay_step', { event_category: 'engagement', step: target });
      if (typeof fbq === 'function') fbq('trackCustom', 'HowToPlayInteraction', { step: target });
      // ALWAYS clean Step 3 leftovers AND any pending boardgame
      // (doRoll / auto-zoom) timers before switching tabs so
      // nothing can bleed into the next tab.
      if (typeof window.cleanupStep3 === 'function') window.cleanupStep3();
      if (typeof window.cancelBoardgameAnims === 'function') window.cancelBoardgameAnims();
      // Hide the Step-1 drop scene the moment we leave the physical
      // tab — otherwise its in-flight maybeAdvance timer can fire
      // later and click bgTab/sciTab on top of whatever the user is
      // viewing now.
      var dropScene = document.getElementById('s2-drop-scene');
      if (dropScene && target !== 'physical') dropScene.classList.remove('active');
      tabs.forEach(function(t){ t.classList.remove('active'); });
      panels.forEach(function(p){ p.classList.remove('active'); });
      tab.classList.add('active');
      var panel = document.getElementById('s2-panel-' + target);
      if (panel) panel.classList.add('active');
      setBoardElementsVisible(target === 'boardgame');
      if (window.stopSciAnimation) window.stopSciAnimation();
      var s3El = document.getElementById('s3');
      if (target === 'science') { if (s3El) s3El.classList.add('step3-view'); }
      else { if (s3El) s3El.classList.remove('step3-view'); if (window.resetBoardOffset) window.resetBoardOffset(); }
      // Show nav on physical tab too, update button states
      if (target === 'physical') {
        initCardFan();
        s2Nav.style.display = '';
        window.s2ActiveTab = 'physical';
        window.pcJumpTo(0);
      } else if (target === 'boardgame') {
        window.s2ActiveTab = 'boardgame';
        if (window.jumpToState0) window.jumpToState0();
      } else if (target === 'science') {
        window.s2ActiveTab = 'science';
        // Step 3: show boardgame panel in tile-11 state with bubble
        // Override: show the boardgame panel instead of science panel
        var bgPanel = document.getElementById('s2-panel-boardgame');
        var sciPanel = document.getElementById('s2-panel-science');
        if (sciPanel) sciPanel.classList.remove('active');
        if (bgPanel) bgPanel.classList.add('active');
        setBoardElementsVisible(true);
        s2Nav.style.display = '';
        // Reset the board view to the rotated tile-11 zoom and
        // start at scene 0 (bubble + link, NO drops, NO inline FC).
        // The user controls the drop sequence with Next/Prev.
        if (window.jumpToState4WithBubble) window.jumpToState4WithBubble();
        if (typeof window.runStep3Drops === 'function') window.runStep3Drops();
      } else {
        s2Nav.style.display = 'none';
        window.s2ActiveTab = target;
      }
      if (window.updateForceLinkState) window.updateForceLinkState();
    });
  });

  // Initialize with physical tab as default
  setBoardElementsVisible(false);
  s2Nav.style.display = '';
  setTimeout(function(){
    if (window.initCardFan) window.initCardFan();
    // Run the same reset/reflow pass the tab-click handler uses so the
    // fan reliably paints and animates on first load (some browsers
    // fail to start the card's entrance animation otherwise).
    if (window.pcJumpTo) window.pcJumpTo(0);
  }, 100);
})();

/* ── Physical Challenges — Card Fan ──────────────────────── */
(function(){
  'use strict';

  var CARD_BACK  = 's2-card-back.webp';
  var CARD_FRONT = 's2-card-front.webp';
  var NUM_CARDS  = 6;
  var FAN_SPREAD = 70;
  var fanReady   = false;
  var selected   = null;

  function isMobileFan() { return window.innerWidth <= 768; }
  function fanCardTransform(fanAngle) {
    var mob = isMobileFan();
    var angle = mob ? fanAngle * 0.5 : fanAngle;
    var extra = mob ? ' rotateZ(90deg)' : '';
    return 'translate(-50%,-50%) rotate('+angle+'deg)' + extra;
  }
  function fanCardCSS(fanAngle, idx) {
    var t = fanCardTransform(fanAngle);
    return 'transform:'+t+';--card-base-transform:'+t+';--card-delay:'+(idx*0.18)+'s;';
  }

  window.initCardFan = function(){
    if (fanReady) return;
    fanReady = true;

    var fan    = document.getElementById('s2-card-fan');
    var prompt = document.getElementById('s2-draw-prompt');
    if (!fan) return;

    for (var i = 0; i < NUM_CARDS; i++){
      var angle = -FAN_SPREAD/2 + (FAN_SPREAD/(NUM_CARDS-1)) * i;
      var card  = document.createElement('div');
      card.className = 's2-fan-card inviting';
      card.style.cssText = fanCardCSS(angle, i);
      card.dataset.index = i;

      card.innerHTML =
        '<div class="s2-fan-card-inner">' +
          '<div class="s2-fan-card-face s2-fan-card-back"><img loading="lazy" decoding="async" src="'+CARD_BACK+'" alt="Activity Card"></div>' +
          '<div class="s2-fan-card-face s2-fan-card-front"><img loading="lazy" decoding="async" src="'+CARD_FRONT+'" alt="Challenge"></div>' +
        '</div>';

      // Card scroll sound — plays when user hovers over each card
      card.addEventListener('pointerenter', function() {
        if (!selected && window.sndCardScroll && window.playSound) {
          window.playSound(window.sndCardScroll, 0.3);
        }
      });
      card.addEventListener('click', function(){ pickCard(this); });
      fan.appendChild(card);
    }
    setTimeout(function(){ if(prompt) prompt.classList.add('show'); }, 400);
  };

  function pickCard(el){
    if (selected) return;
    selected = el;

    var prompt = document.getElementById('s2-draw-prompt');
    if (prompt) prompt.classList.remove('show');

    document.querySelectorAll('.s2-fan-card').forEach(function(c){
      if (c !== el){ c.classList.remove('inviting'); c.classList.add('dimmed'); }
    });

    el.classList.remove('inviting');
    // Step 1: pop out of fan, center, straighten
    el.style.transformOrigin = 'center center';
    el.style.transform = 'translate(-50%,-50%) rotate(0deg)';
    el.style.zIndex = '20';
    el.style.filter = 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))';
    // Step 2: flip after settling
    setTimeout(function(){
      el.classList.add('flipped');
      if (window.sndCardFlip && window.playSound) window.playSound(window.sndCardFlip, 0.5);
    }, 600);
    // Step 3: zoom up after flip completes — cap the scale so the
    // fully-zoomed card never overflows the s3 container on any
    // screen size (accounting for the title pill at top + a margin).
    setTimeout(function(){
      var section = document.getElementById('s3');
      var contW = section ? section.clientWidth  : window.innerWidth;
      var contH = section ? section.clientHeight : window.innerHeight;
      var cardW = el.offsetWidth  || 160;
      var cardH = el.offsetHeight || 230;
      // Reserve 100 px of vertical space for the title pill + tabs
      // so the zoomed card doesn't cover them.
      var availableH = Math.max(200, contH - 120);
      var availableW = contW * 0.9;
      var maxScaleW = availableW / cardW;
      var maxScaleH = availableH / cardH;
      var desiredScale = (window.innerWidth <= 768) ? 1.3 : 2.2;
      var zoomScale = Math.min(desiredScale, maxScaleW, maxScaleH);
      el.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform = 'translate(-50%,-50%) rotate(0deg) scale('+zoomScale+')';
    }, 1400);

    // Step 3b: once the zoomed card has settled, show a brief
    // walkthrough title explaining what the challenge is so users
    // know why items are about to drop.
    setTimeout(function(){
      if (prompt) {
        prompt.textContent = 'Challenge: Find & drop the slowest falling item';
        prompt.classList.add('show');
      }
    }, 2200);

    // Step 4: after viewing the zoomed card, transition to drop animation.
    // Extended from 3500ms to 5500ms so users have time to read the challenge.
    setTimeout(function(){
      if (prompt) prompt.classList.remove('show');
      // Fade out the card
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '0';
      // Dim all cards
      document.querySelectorAll('.s2-fan-card').forEach(function(c){
        c.classList.add('dimmed');
      });
      // Start the drop scene
      startDropAnimation();
    }, 5500);
  }

  function resetFan(){
    selected = null;
    var scene = document.getElementById('s2-drop-scene');
    if (scene) scene.classList.remove('active');
    var dt = document.getElementById('s2-drop-title');
    if (dt) { dt.classList.remove('show'); dt.textContent = 'All Players Do The Challenge'; dt.style.cursor = ''; dt.style.pointerEvents = ''; dt.style.textDecoration = ''; dt.onclick = null; }
    var prompt = document.getElementById('s2-draw-prompt');
    if (prompt) {
      prompt.classList.remove('show');
      prompt.textContent = 'Draw A Physical Challenge Card';
    }
    document.querySelectorAll('.s2-fan-card').forEach(function(c, idx){
      c.classList.remove('selected','flipped','dimmed');
      var angle = -FAN_SPREAD/2 + (FAN_SPREAD/(NUM_CARDS-1)) * idx;
      c.style.cssText = '';
      c.offsetHeight;
      c.style.cssText = fanCardCSS(angle, idx);
      c.classList.add('inviting');
    });
    setTimeout(function(){ if(prompt) prompt.classList.add('show'); }, 300);
  }

  /* ── Force Card Popup ─────────────────────────────────── */
  var forceOverlay = document.getElementById('s2-force-overlay');
  var forceClose = document.getElementById('s2-force-close');
  var forceCardWrap = document.getElementById('s2-force-card-wrap');
  var forceLink = document.getElementById('s2-force-link');
  var forceEarned = false;
  window.forceEarned = false;
  window.sessionHasReachedTile11 = false;

  // Initialize: on PC tab it's disabled, on BG tab it navigates to PC tab
  function updateForceLinkState() {
    if (forceEarned) {
      forceLink.textContent = 'Your Force Cards';
      forceLink.classList.remove('disabled', 'pulse');
      forceLink.classList.add('earned');
    } else {
      forceLink.textContent = 'Earn a Force Card';
      // On PC tab: disabled. On BG tab: clickable (navigates to PC tab)
      if (window.s2ActiveTab === 'physical') {
        forceLink.classList.add('disabled');
      } else {
        forceLink.classList.remove('disabled');
      }
    }
  }

  // Expose for tab switching to call
  window.updateForceLinkState = updateForceLinkState;
  window.updateBubbleLink = updateBubbleLink;

  function markForceEarned() {
    forceEarned = true;
    window.forceEarned = true;
    forceLink.textContent = 'Your Force Cards';
    forceLink.classList.remove('disabled');
    forceLink.classList.add('earned', 'pulse');
    updateBubbleLink();
    // Update drop title to earned state
    var dropTitle = document.getElementById('s2-drop-title');
    if (dropTitle) {
      dropTitle.textContent = 'You Have Earned A Force Card';
      dropTitle.style.cursor = 'pointer';
      dropTitle.style.pointerEvents = 'auto';
      dropTitle.style.textDecoration = 'underline';
      dropTitle.style.textUnderlineOffset = '6px';
      dropTitle.classList.add('show');
      dropTitle.onclick = function() { showForceCardFlip(); };
    }
  }

  function updateBubbleLink() {
    var bl = document.getElementById('s2-bubble-fc-link');
    if (!bl) return;
    bl.textContent = forceEarned ? 'Check Your Force Card' : 'Earn a Force Card';
  }

  // Bubble link click handler
  var bubbleFcLink = document.getElementById('s2-bubble-fc-link');
  if (bubbleFcLink) {
    bubbleFcLink.addEventListener('click', function(e) {
      e.stopPropagation();
      if (forceEarned) {
        showForceCardInline();
      } else {
        var pcTab = document.querySelector('.s2-tab[data-panel="physical"]');
        if (pcTab) pcTab.click();
      }
    });
  }

  /* ── Show force card inline on the board, then drop token ── */
  /* Swap the contents of the comic bubble with a specific HTML
     block. Used during the tile-drop sequence in Step 3 so the
     explanation text updates as the token drops. */
  function setBubbleContent(html, withLink) {
    var bubble = document.getElementById('s2-comic-bubble');
    if (!bubble) return;
    var box = bubble.querySelector('.s2-bubble-box');
    if (!box) return;
    box.innerHTML = html;
    box.classList.toggle('no-link', !withLink);
  }

  // ── Step 3 lifecycle ─────────────────────────────────────
  // Track every setTimeout that the drop sequence schedules so
  // we can cancel them all on cleanupStep3() — otherwise leftover
  // timers fire after the user has switched tabs and update the
  // bubble / token / inline-fc on top of the wrong panel.
  var step3Timers = [];
  // Step 3 internal scenes (intra-step navigation):
  //   0 = tile 11   (bubble + Check-Your-Force-Card link, no drops)
  //   1 = tile 7    (drop, "any 2 cards" copy + inline FC visible)
  //   2 = tile 3    (drop, "Body Card" copy)
  //   3 = tile 2    (drop, "lose next 2 turns" copy)
  var sciSceneIdx = 0;
  function step3Schedule(fn, ms){
    var id = setTimeout(function(){
      var idx = step3Timers.indexOf(id);
      if (idx >= 0) step3Timers.splice(idx, 1);
      fn();
    }, ms);
    step3Timers.push(id);
    return id;
  }
  function clearStep3Timers(){
    step3Timers.forEach(function(id){ clearTimeout(id); });
    step3Timers.length = 0;
  }

  // Tile-11 bubble copy (start state of Step 3 / end state of Step 2)
  var ICON_EARTH = '<img class="s2-bubble-icon" src="IMG_4700.png" alt="Earth">';
  var ICON_BODY  = '<img class="s2-bubble-icon" src="IMG_4705.png" alt="Body">';
  var ICON_TWO   = '<img class="s2-bubble-icon s2-bubble-icon-lg" src="IMG_5300.png" alt="Any 2 Cards">';

  // Step 3 scene 0: bubble + "Check Your Force Card" link.
  // Clicking the link reveals the inline force card and advances.
  function setBubbleContentTile11(){
    setBubbleContent(
      'If you have an<br>' +
      '<span class="s2-bubble-highlight">' + ICON_EARTH + ' Earth Force Card</span><br>' +
      'you can play it…<br>' +
      'or you <span class="s2-bubble-highlight">fall down!</span><br>' +
      '<a class="s2-bubble-link" id="s2-bubble-fc-link" data-bubble-action="check">Check Your Force Card</a>',
      true
    );
  }
  // Step 2 last scene: same body copy but the link reads
  // "Go To Next Step →" and just advances to Step 3 scene 0.
  function setBubbleContentTile11Step2(){
    setBubbleContent(
      'If you have an<br>' +
      '<span class="s2-bubble-highlight">' + ICON_EARTH + ' Earth Force Card</span><br>' +
      'you can play it…<br>' +
      'or you <span class="s2-bubble-highlight">fall down!</span><br>' +
      '<a class="s2-bubble-link" id="s2-bubble-fc-link" data-bubble-action="next-step">Go To Next Step</a>',
      true
    );
  }
  function setBubbleContentTile7(){
    setBubbleContent(
      'If you have ' + ICON_TWO + '<span class="s2-bubble-highlight">any 2 cards</span><br>' +
      'to play, you can play &amp;<br><span class="s2-bubble-highlight">escape downfall</span>',
      false
    );
  }
  function setBubbleContentTile3(){
    setBubbleContent(
      'If you have a<br>' +
      '<span class="s2-bubble-highlight">' + ICON_BODY + ' Body Card</span>,<br>' +
      'you can play &amp; <span class="s2-bubble-highlight">escape downfall</span>',
      false
    );
  }
  function setBubbleContentTile2(){
    setBubbleContent(
      'If you have a<br>' +
      '<span class="s2-bubble-highlight">' + ICON_BODY + ' Body Card</span>,<br>' +
      'play &amp; <span class="s2-bubble-highlight">escape</span>,<br>' +
      'else <span class="s2-bubble-highlight">lose next 2 turns</span><br>' +
      'to roll dice.<br>' +
      '<em>Current turn ends now.</em>',
      false
    );
  }
  window.setBubbleContentTile11 = setBubbleContentTile11;
  window.setBubbleContentTile11Step2 = setBubbleContentTile11Step2;

  // Bubble link click — uses event delegation on the bubble container
  // so it survives every setBubbleContent() call (which replaces the
  // inner HTML and detaches any direct listeners).
  var bubbleEl = document.getElementById('s2-comic-bubble');
  if (bubbleEl) {
    bubbleEl.addEventListener('click', function(e) {
      var link = e.target.closest('#s2-bubble-fc-link');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      var action = link.getAttribute('data-bubble-action') || 'check';
      if (action === 'next-step') {
        // Step 2 last scene → advance into Step 3 scene 0
        var sciTabL = document.querySelector('.s2-tab[data-panel="science"]');
        if (sciTabL) {
          sciTabL.classList.remove('locked');
          sciTabL.click();
        }
        return;
      }
      // action === 'check' (Step 3 scene 0): reveal the inline
      // force card on the right (laptop) / top (mobile) and
      // start the auto-drop chain — walks tile 7 → 3 → 2
      // automatically. Does NOT open the big centered flippable
      // overlay (that's reserved for the title-row force-link).
      if (window.s2ActiveTab !== 'science') {
        var sciTabL2 = document.querySelector('.s2-tab[data-panel="science"]');
        if (sciTabL2) {
          sciTabL2.classList.remove('locked');
          sciTabL2.click();
          setTimeout(function(){
            if (typeof window.sciStartAutoDrops === 'function') window.sciStartAutoDrops();
          }, 200);
        }
        return;
      }
      // Already in Step 3 scene 0 — kick off the auto-drop chain
      if (typeof window.sciStartAutoDrops === 'function') {
        window.sciStartAutoDrops();
      }
    });
  }

  // Hide / reset every Step 3 element so nothing leaks onto other tabs.
  function cleanupStep3(){
    clearStep3Timers();
    sciSceneIdx = 0;
    var bubble = document.getElementById('s2-comic-bubble');
    if (bubble) {
      bubble.classList.remove('show');
      bubble.style.transition = '';
    }
    var inlineFc = document.getElementById('s2-inline-fc');
    if (inlineFc) {
      inlineFc.classList.remove('show');
      inlineFc.classList.remove('step3-card');
    }
    var inlineFcText = document.getElementById('s2-inline-fc-text');
    if (inlineFcText) inlineFcText.textContent = 'Force Card No Match — So Drop!';
    setBubbleContentTile11();
  }
  window.cleanupStep3 = cleanupStep3;

  // Render Step 3 scene N — drives the token + bubble + inline FC
  // for the current scene. Scenes can be advanced manually via
  // Next/Prev OR auto-chained from sciStartAutoDrops().
  // Inline force card is positioned ONCE on first show — after
  // that it stays put while the token + bubble move down through
  // the tiles, so it never gets clipped by the container.
  var inlineFcPositioned = false;
  function showInlineFc() {
    var fcImg = document.getElementById('s2-inline-fc-img');
    var overlaySrc = forceOverlay.querySelector('.s2-force-card-face img');
    if (fcImg && overlaySrc) fcImg.src = overlaySrc.src;
    var inlineFc = document.getElementById('s2-inline-fc');
    if (!inlineFc) return;
    inlineFc.classList.add('step3-card');
    inlineFc.classList.add('show');
    if (!inlineFcPositioned) {
      if (window.positionInlineFc) window.positionInlineFc();
      inlineFcPositioned = true;
    }
  }
  function setInlineFcText(txt) {
    var t = document.getElementById('s2-inline-fc-text');
    if (t) t.textContent = txt;
  }

  function sciShowScene(idx) {
    // Cancel any pending auto-drops the moment the user navigates
    // — clicking Next/Prev should always be authoritative.
    clearStep3Timers();
    sciSceneIdx = idx;
    var bubble = document.getElementById('s2-comic-bubble');
    if (!bubble) return;
    // Bubble follows the token with the same 1.5 s transition.
    bubble.style.transition = 'top 1.5s cubic-bezier(.4,0,.2,1), left 1.5s cubic-bezier(.4,0,.2,1)';

    if (idx === 0) {
      // Tile 11 — move the token back here whenever we land on
      // scene 0 (so Prev from tile 7 actually returns the token).
      if (window.dropToTile11) window.dropToTile11();
      setBubbleContentTile11();
      // No inline FC at scene 0 — also forget any cached position
      // so the next time the user reveals it the FC re-anchors.
      var inlineFc0 = document.getElementById('s2-inline-fc');
      if (inlineFc0) {
        inlineFc0.classList.remove('show');
        inlineFc0.classList.remove('step3-card');
      }
      inlineFcPositioned = false;
    } else if (idx === 1) {
      if (window.dropToTile7) window.dropToTile7();
      setBubbleContentTile7();
      setInlineFcText('Only 1 Card In Hand, Tile Needs 2 — So Drop!');
      showInlineFc();
    } else if (idx === 2) {
      if (window.dropToTile3) window.dropToTile3();
      setBubbleContentTile3();
      setInlineFcText('You Don\u2019t Have Body Card — Drop!');
      showInlineFc();
    } else if (idx === 3) {
      if (window.dropToTile2) window.dropToTile2();
      setBubbleContentTile2();
      setInlineFcText('No Body Card. So Lose Next Turns');
      showInlineFc();
    }

    positionBubbleAtToken(bubble, idx > 0);

    // On bigger screens + tile 2 only, nudge the bubble up a bit
    // more so it doesn't crowd the bottom nav / token area.
    if (idx === 3 && window.innerWidth > 768) {
      var curTop = parseFloat(bubble.style.top) || 0;
      bubble.style.top = Math.max(4, curTop - 100) + 'px';
    }

    // On mobile for tiles 11, 7 & 3 the bubble sits LEFT of the
    // token, so flip the tail arrow to the right side so it points
    // toward the token. Also nudge the bubble a little further
    // toward the left screen edge so the tile underneath is fully
    // visible. Tile 2 keeps the default left tail + no nudge.
    var box = bubble.querySelector('.s2-bubble-box');
    if (box) {
      var mobileTailRight = (window.innerWidth <= 768) && (idx < 3);
      box.classList.toggle('tail-right', mobileTailRight);
    }
    if ((window.innerWidth <= 768) && idx < 3) {
      var curLeft = parseFloat(bubble.style.left) || 0;
      bubble.style.left = Math.max(4, curLeft - 30) + 'px';
    }

    bubble.classList.add('show');
  }
  window.sciShowScene = sciShowScene;
  window.sciCurrentScene = function(){ return sciSceneIdx; };
  window.sciMaxScene = 3;

  // Auto-drop chain — kicks off after the user clicks the
  // "Check Your Force Card" link in scene 0. Shows the inline
  // force card AT tile 11 first (with a "No Earth Card" red
  // label), pauses, then walks scene 1 → 2 → 3 with the red
  // text updating per tile. Every step is scheduled via
  // step3Schedule so Prev/Next or a tab change cancels every
  // pending drop instantly.
  window.sciStartAutoDrops = function() {
    // ── Phase 0: reveal force card at tile 11 (token stays put) ──
    setInlineFcText('You Have No Earth Card — So Drop To Tile 7');
    showInlineFc();

    // ── Phase 1: after a pause, drop to tile 7 ──
    step3Schedule(function(){
      if (window.s2ActiveTab !== 'science') return;
      sciShowScene(1);

      // ── Phase 2: drop to tile 3 ──
      step3Schedule(function(){
        if (window.s2ActiveTab !== 'science') return;
        sciShowScene(2);

        // ── Phase 3: drop to tile 2 ──
        step3Schedule(function(){
          if (window.s2ActiveTab !== 'science') return;
          sciShowScene(3);
        }, 4500);
      }, 4500);
    }, 3000);
  };

  // Step 3 entry: jumpToState4WithBubble already placed the token
  // at tile 11; we just show scene 0 (bubble + link, no drops).
  window.runStep3Drops = function() {
    cleanupStep3();
    sciShowScene(0);
  };

  /* ── Show force card flippable overlay (for PC tab) ── */
  function showForceCardFlip() {
    forceLink.classList.remove('pulse');
    var title = document.getElementById('s2-force-popup-title');
    if (title) title.textContent = 'Your Force Card';
    forceOverlay.classList.add('show');
    forceCardWrap.classList.remove('flipped');
    if (window.sndCardFlip && window.playSound) window.playSound(window.sndCardFlip, 0.45);
  }
  // Exposed alias the bubble link delegate calls
  window.openForceCardOverlay = showForceCardFlip;

  function hideForceCard() {
    forceOverlay.classList.remove('show');
  }

  // Flip on click
  forceCardWrap.addEventListener('click', function() {
    forceCardWrap.classList.toggle('flipped');
    if (window.sndCardFlip && window.playSound) window.playSound(window.sndCardFlip, 0.45);
  });

  // Close button
  forceClose.addEventListener('click', function(e) {
    e.stopPropagation();
    hideForceCard();
  });

  // Click overlay background to close
  forceOverlay.addEventListener('click', function(e) {
    if (e.target === forceOverlay) hideForceCard();
  });

  // Force link click: always show fullscreen flippable overlay
  forceLink.addEventListener('click', function() {
    if (forceEarned) {
      showForceCardFlip();
    } else if (window.s2ActiveTab !== 'physical') {
      var pcTab = document.querySelector('.s2-tab[data-panel="physical"]');
      if (pcTab) pcTab.click();
    }
  });

  // Track user interaction with the drop-scene items so the
  // auto-advance waits while the user is playing with them.
  window.s2LastDropInteraction = 0;
  window.s2DropInteracting = false;
  function recordDropInteraction(active){
    window.s2LastDropInteraction = performance.now();
    if (active != null) window.s2DropInteracting = active;
  }
  window.recordDropInteraction = recordDropInteraction;

  function startDropAnimation() {
    var scene = document.getElementById('s2-drop-scene');
    var kidsHolding = document.getElementById('s2-kids-holding');
    var kidsEmpty = document.getElementById('s2-kids-empty');
    var ball = document.getElementById('s2-item-ball');
    var feather = document.getElementById('s2-item-feather');
    var leaf = document.getElementById('s2-item-leaf');
    var paper = document.getElementById('s2-item-paper');

    // Reset interaction tracking for this run
    window.s2LastDropInteraction = 0;
    window.s2DropInteracting = false;

    // Show scene with kids holding items
    scene.classList.add('active');
    var dropTitle = document.getElementById('s2-drop-title');
    if (dropTitle) {
      dropTitle.textContent = 'You can drag, drop & play with the items';
      dropTitle.classList.add('show');
    }
    kidsHolding.style.opacity = '1';
    kidsEmpty.style.opacity = '0';

    // Position items at the kids' hand height, spread across
    var items = [ball, feather, leaf, paper];
    var startY = 18; // % from top — near the kids' raised hands

    items.forEach(function(item) {
      item.style.opacity = '0';
      item.style.top = startY + '%';
      item.style.transform = 'translate(-50%, -50%)';
    });

    // Spread items across the width
    ball.style.left = '30%';
    feather.style.left = '43%';
    leaf.style.left = '57%';
    paper.style.left = '70%';

    // After 1.5s: swap to empty hands, start items falling
    setTimeout(function() {
      kidsHolding.style.opacity = '0';
      kidsEmpty.style.opacity = '1';

      items.forEach(function(item) { item.style.opacity = '1'; });

      // Animate each item with different physics
      animateDrop(ball, {
        gravity: 900, airResistance: 0.01, sway: 0, name: 'ball',
        bounce: 0.62, startX: 40
      });
      animateDrop(paper, {
        gravity: 180, airResistance: 0.12, sway: 3.5, swaySpeed: 3, name: 'paper',
        bounce: 0, flutter: true, startX: 62
      });
      animateDrop(leaf, {
        gravity: 120, airResistance: 0.14, sway: 4, swaySpeed: 2, name: 'leaf',
        bounce: 0, startX: 55
      });
      animateDrop(feather, {
        gravity: 60, airResistance: 0.18, sway: 5, swaySpeed: 1.2, name: 'feather',
        bounce: 0, startX: 48
      });
    }, 1500);

    // After items settle, show the force card link with animation
    setTimeout(function() {
      markForceEarned();
    }, 5500);

    // Auto-advance — but only after the user has idled for a few
    // seconds. Keeps the drop scene open as long as they're playing
    // with the items, and only moves on when they've stopped.
    var MIN_DISPLAY_MS = 11000;     // never leave earlier than this
    var IDLE_BEFORE_LEAVE_MS = 5500; // stay 5.5s after last interaction
    var sceneStart = performance.now();
    function maybeAdvance() {
      // Bail out if the user has manually navigated away — this was
      // the bug that bounced the user back to Step 2 start when the
      // Step-1 advance timer fired minutes later from another tab.
      if (window.s2ActiveTab && window.s2ActiveTab !== 'physical') return;
      if (!scene.classList.contains('active')) return;
      var now = performance.now();
      var elapsed = now - sceneStart;
      if (elapsed < MIN_DISPLAY_MS) {
        setTimeout(maybeAdvance, MIN_DISPLAY_MS - elapsed + 50);
        return;
      }
      var sinceInteraction = now - (window.s2LastDropInteraction || 0);
      if (window.s2DropInteracting || sinceInteraction < IDLE_BEFORE_LEAVE_MS) {
        // User is still playing — check again shortly
        setTimeout(maybeAdvance, 1200);
        return;
      }
      scene.classList.remove('active');
      items.forEach(function(item) { item.style.opacity = '0'; });
      resetFan();
      // Always advance to Step 2 from Step 1 — never skip straight
      // to Step 3 (sessionHasReachedTile11 stays true across runs
      // and was causing Step 2 to be skipped on the 2nd playthrough).
      var bgTab = document.querySelector('.s2-tab[data-panel="boardgame"]');
      if (bgTab) bgTab.click();
    }
    setTimeout(maybeAdvance, MIN_DISPLAY_MS);
  }

  function animateDrop(el, opts) {
    var vy = 0;
    var maxY = 85;
    var landed = false;
    var dragging = false;
    var dropRaf = null;
    var startTime = null;
    var curX = opts.startX;

    /* ── Physics drop loop ─────────────────────────────── */
    function startDrop() {
      landed = false;
      vy = 0;
      startTime = null;
      if (dropRaf) cancelAnimationFrame(dropRaf);
      dropRaf = requestAnimationFrame(frame);
    }

    function frame(ts) {
      if (dragging || landed) return;
      if (!startTime) startTime = ts;
      var dt = Math.min((ts - startTime) / 1000, 0.05);
      startTime = ts;

      vy += opts.gravity * dt;
      vy *= (1 - opts.airResistance);

      var currentY = parseFloat(el.style.top);
      var newY = currentY + vy * dt;

      var elapsed = ts / 1000;
      var swayAmount = (opts.sway || 0) * Math.sin(elapsed * (opts.swaySpeed || 2));
      el.style.left = (curX + swayAmount) + '%';

      if (opts.flutter) {
        el.style.transform = 'translate(-50%,-50%) rotate(' + (swayAmount * 8) + 'deg)';
      } else if (opts.sway) {
        el.style.transform = 'translate(-50%,-50%) rotate(' + (swayAmount * 3) + 'deg)';
      }

      if (newY >= maxY) {
        if (opts.bounce > 0 && vy > 18) {
          vy = -vy * opts.bounce;
          newY = maxY;
          // Play bounce sound only on the FIRST impact (not repeats)
          if (!opts._bounced && window.sndBallBounce) {
            opts._bounced = true;
            try {
              var bb = window.sndBallBounce.cloneNode();
              bb.volume = 0.4;
              bb.play().catch(function(){});
              setTimeout(function(){ try { bb.pause(); } catch(e){} }, 300);
            } catch(e){}
          }
        } else {
          newY = maxY;
          landed = true;
        }
      }

      el.style.top = newY + '%';
      if (!landed) dropRaf = requestAnimationFrame(frame);
    }

    /* ── Drag and drop (mouse + touch) ─────────────────── */
    var scene = document.getElementById('s2-drop-scene');

    function pctX(clientX) {
      var r = scene.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    function pctY(clientY) {
      var r = scene.getBoundingClientRect();
      return ((clientY - r.top) / r.height) * 100;
    }

    function onDragStart(cx, cy) {
      dragging = true;
      landed = false;
      opts._bounced = false; // reset so next drop plays bounce sound
      if (dropRaf) cancelAnimationFrame(dropRaf);
      el.style.left = pctX(cx) + '%';
      el.style.top = pctY(cy) + '%';
      el.style.transform = 'translate(-50%,-50%)';
      if (window.recordDropInteraction) window.recordDropInteraction(true);
    }
    function onDragMove(cx, cy) {
      if (!dragging) return;
      el.style.left = pctX(cx) + '%';
      el.style.top = pctY(cy) + '%';
      if (window.recordDropInteraction) window.recordDropInteraction(true);
    }
    function onDragEnd() {
      if (!dragging) return;
      dragging = false;
      curX = parseFloat(el.style.left);
      startDrop();
      if (window.recordDropInteraction) window.recordDropInteraction(false);
    }

    /* Mouse events */
    el.addEventListener('mousedown', function(e) {
      e.preventDefault();
      onDragStart(e.clientX, e.clientY);
      function mm(e) { onDragMove(e.clientX, e.clientY); }
      function mu() {
        onDragEnd();
        window.removeEventListener('mousemove', mm);
        window.removeEventListener('mouseup', mu);
      }
      window.addEventListener('mousemove', mm);
      window.addEventListener('mouseup', mu);
    });

    /* Touch events */
    el.addEventListener('touchstart', function(e) {
      e.preventDefault();
      var t = e.touches[0];
      onDragStart(t.clientX, t.clientY);
    }, { passive: false });
    el.addEventListener('touchmove', function(e) {
      e.preventDefault();
      var t = e.touches[0];
      onDragMove(t.clientX, t.clientY);
    }, { passive: false });
    el.addEventListener('touchend', function() { onDragEnd(); });
    el.addEventListener('touchcancel', function() { onDragEnd(); });

    /* Start initial drop */
    startDrop();
  }

  /* ── Physical Challenges checkpoint navigation ─────────── */
  /* PC states: 0=card fan, 1=card zoomed, 2=drop scene       */
  var pcState = 0;

  function pcUpdateButtons() {
    var back = document.getElementById('s2-back');
    var fwd  = document.getElementById('s2-fwd');
    back.disabled = false;
    fwd.disabled  = false;
  }

  window.pcJumpTo = function(target) {
    var scene = document.getElementById('s2-drop-scene');
    var fan   = document.getElementById('s2-card-fan');
    var prompt = document.getElementById('s2-draw-prompt');
    var back = document.getElementById('s2-back');
    var fwd  = document.getElementById('s2-fwd');

    if (target === 0) {
      // Reset to card fan
      if (scene) scene.classList.remove('active');
      var dt0 = document.getElementById('s2-drop-title'); if (dt0) dt0.classList.remove('show');
      // Reset items
      ['s2-item-ball','s2-item-feather','s2-item-leaf','s2-item-paper'].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.style.opacity = '0';
      });
      var kh = document.getElementById('s2-kids-holding');
      var ke = document.getElementById('s2-kids-empty');
      if (kh) kh.style.opacity = '1';
      if (ke) ke.style.opacity = '0';
      // Reset card fan
      selected = null;
      document.querySelectorAll('.s2-fan-card').forEach(function(c, idx){
        c.classList.remove('selected','flipped','dimmed');
        c.style.cssText = '';
        c.offsetHeight;
        var angle = -FAN_SPREAD/2 + (FAN_SPREAD/(NUM_CARDS-1)) * idx;
        c.style.cssText = fanCardCSS(angle, idx);
        c.classList.add('inviting');
      });
      if (fan) fan.style.display = '';
      if (prompt) { prompt.classList.add('show'); }
      pcState = 0;
      back.disabled = true;
      fwd.disabled = true; // user must click a card
    }
    else if (target === 1) {
      // Jump to zoomed card view — pick the first card automatically
      if (scene) scene.classList.remove('active');
      var dt1 = document.getElementById('s2-drop-title'); if (dt1) dt1.classList.remove('show');
      if (fan) fan.style.display = '';
      var cards = document.querySelectorAll('.s2-fan-card');
      if (cards.length > 0 && !selected) {
        pickCard(cards[Math.floor(Math.random() * cards.length)]);
      }
      pcState = 1;
      pcUpdateButtons();
    }
    else if (target === 2) {
      // Jump to drop scene
      if (fan) fan.style.display = 'none';
      if (prompt) prompt.classList.remove('show');
      // Hide all cards
      document.querySelectorAll('.s2-fan-card').forEach(function(c){
        c.style.opacity = '0';
      });
      startDropAnimation();
      pcState = 2;
      pcUpdateButtons();
    }
  };

  // Called when card is picked — update pcState
  var origPickCard = pickCard;
  // Track pcState when card is naturally picked
  var origClickHandler = null;

  // Watch for pcState changes from natural flow
  function onCardPicked() { pcState = 1; pcUpdateButtons(); }
  function onDropStarted() { pcState = 2; pcUpdateButtons(); }

  // Hook into existing flow: override pickCard to also update pcState
  var _origPickCard = pickCard;
  pickCard = function(el) {
    _origPickCard(el);
    onCardPicked();
  };

  window.pcGoBack = function() {
    if (pcState === 2) { window.pcJumpTo(1); return; }
    if (pcState === 1) { window.pcJumpTo(0); return; }
    // pcState === 0 → start of Step 1 → wrap to Step 3 end
    // (if unlocked) else Step 2 end.
    var sciTab = document.querySelector('.s2-tab[data-panel="science"]');
    if (sciTab && !sciTab.classList.contains('locked')) { sciTab.click(); return; }
    var bgTab = document.querySelector('.s2-tab[data-panel="boardgame"]');
    if (bgTab) bgTab.click();
  };

  window.pcGoForward = function() {
    if (pcState === 0) { window.pcJumpTo(1); return; }
    if (pcState === 1) { window.pcJumpTo(2); return; }
    // pcState === 2 → end of Step 1 → advance to Step 2 start
    var bgTab = document.querySelector('.s2-tab[data-panel="boardgame"]');
    if (bgTab) bgTab.click();
  };

})();

/* ── Science Section — stubs for compatibility ─────── */
(function(){
  window.startSciAnimation = function() {};
  window.stopSciAnimation = function() {};
  window.sciGoForward = function() {};
  window.sciGoBack = function() {};
  window.sciResetSlides = function() {};
})();

/* ── Normal scroll — smooth nav clicks (footer + internal anchors) ── */
(function(){
  'use strict';
  const sectionIds = ['s1','s2','s3','s4-science','s4b-turns','s6b-gravity','s-spiral','s-layers','s-forces','s-experience','s-game','s-quiz','s6','s7','eg-footer'];

  /* Footer & any other data-section links — smooth scroll to section */
  const allNavLinks = document.querySelectorAll('[data-section]');
  allNavLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const sec = a.getAttribute('data-section');
      const el = document.getElementById(sec);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  /* goToSection for any programmatic use */
  window.goToSection = function(num){
    const el = document.getElementById(sectionIds[num - 1]);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  };
})();


// ===== Misc Utilities =====
// ---- (originally index.html lines 8247-8798) ----
(function(){
  'use strict';
  var cv = document.getElementById('eg-runner');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var overlay = document.getElementById('game-overlay');
  var overlayText = document.getElementById('game-overlay-text');
  var hudEl = document.getElementById('game-hud');

  var W = 800, H = 320;
  var GROUND = H - 50;
  var GRAVITY = 0.6;
  var JUMP_VEL = -11;
  var SCROLL_SPEED = 3.5;

  // Force categories
  var CATS = [
    { key: 'earth',   color: '#4caf50', label: 'E' },
    { key: 'air',     color: '#81d4fa', label: 'A' },
    { key: 'water',   color: '#29b6f6', label: 'W' },
    { key: 'body',    color: '#ef5350', label: 'B' },
    { key: 'speed',   color: '#ab47bc', label: 'S' },
    { key: 'energy',  color: '#ffa726', label: 'N' },
    { key: 'balance', color: '#5c6bc0', label: 'L' }
  ];

  // Gravity well types — each requires a specific force category
  var WELLS = [
    { name: 'Cliff!',      cat: 'balance', color: '#5c6bc0' },
    { name: 'Ocean!',      cat: 'water',   color: '#29b6f6' },
    { name: 'Sinkhole!',   cat: 'earth',   color: '#4caf50' },
    { name: 'Air Drag!',   cat: 'air',     color: '#81d4fa' },
    { name: 'Freefall!',   cat: 'speed',   color: '#ab47bc' },
    { name: 'Exhaustion!', cat: 'body',    color: '#ef5350' },
    { name: 'Blackout!',   cat: 'energy',  color: '#ffa726' }
  ];

  // Player
  var player = { x: 80, y: GROUND, vy: 0, w: 28, h: 40, onGround: true };
  var inventory = [];  // collected force keys
  var coins = [];
  var wells = [];
  var stars = [];
  var score = 0;
  var dist = 0;
  var gameState = 'idle'; // idle, running, falling, dead
  var deadTimer = 0;
  var fallInfo = null;   // { wellType, pitX, pitW, fallY, fallVy, sinkTimer }

  // ── Sound effects (Web Audio API — no files needed) ────
  var audioCtx = null;
  function getAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playTone(freq, dur, type, vol, slide) {
    try {
      var a = getAudio();
      var osc = a.createOscillator();
      var gain = a.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, a.currentTime);
      if (slide) osc.frequency.linearRampToValueAtTime(slide, a.currentTime + dur);
      gain.gain.setValueAtTime(vol || 0.15, a.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
      osc.connect(gain);
      gain.connect(a.destination);
      osc.start();
      osc.stop(a.currentTime + dur);
    } catch(e) {}
  }
  function sfxJump()    { playTone(440, 0.15, 'sine', 0.12, 880); }
  function sfxCollect()  { playTone(880, 0.1, 'sine', 0.12); setTimeout(function(){ playTone(1100, 0.12, 'sine', 0.10); }, 60); }
  function sfxSurvive()  { playTone(520, 0.1, 'triangle', 0.12); setTimeout(function(){ playTone(660, 0.1, 'triangle', 0.10); }, 80); setTimeout(function(){ playTone(880, 0.15, 'triangle', 0.10); }, 160); }
  function sfxFall()     { playTone(400, 0.6, 'sawtooth', 0.10, 80); }
  function sfxStart()    { playTone(330, 0.1, 'sine', 0.08); setTimeout(function(){ playTone(440, 0.1, 'sine', 0.08); }, 100); setTimeout(function(){ playTone(660, 0.15, 'sine', 0.10); }, 200); }
  var flashMsg = '';
  var flashTimer = 0;

  // Generate stars background
  for (var i = 0; i < 60; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * (GROUND - 20), s: Math.random() * 1.5 + 0.5, sp: Math.random() * 0.3 + 0.1 });
  }

  function spawnCoin() {
    var cat = CATS[Math.floor(Math.random() * CATS.length)];
    coins.push({
      x: W + Math.random() * 200,
      y: GROUND - 50 - Math.random() * 120,
      r: 14,
      cat: cat,
      collected: false
    });
  }

  function spawnWell() {
    var w = WELLS[Math.floor(Math.random() * WELLS.length)];
    wells.push({
      x: W + Math.random() * 100,
      w: 70, h: 50,
      well: w,
      passed: false
    });
  }

  function reset() {
    player.y = GROUND; player.vy = 0; player.onGround = true;
    inventory = [];
    coins = [];
    wells = [];
    score = 0;
    dist = 0;
    flashMsg = '';
    flashTimer = 0;
    // Seed some initial coins
    for (var i = 0; i < 3; i++) {
      var c = CATS[Math.floor(Math.random() * CATS.length)];
      coins.push({ x: 300 + i * 180, y: GROUND - 60 - Math.random() * 80, r: 14, cat: c, collected: false });
    }
  }

  function jump() {
    if (player.onGround) {
      player.vy = JUMP_VEL;
      player.onGround = false;
      sfxJump();
    }
  }

  function updateHud() {
    hudEl.innerHTML = '';
    inventory.forEach(function(key) {
      var cat = CATS.find(function(c) { return c.key === key; });
      if (!cat) return;
      var el = document.createElement('div');
      el.className = 'hud-coin';
      el.style.background = cat.color;
      el.textContent = cat.label;
      hudEl.appendChild(el);
    });
  }

  function update() {
    if (gameState !== 'running') return;

    dist += SCROLL_SPEED;

    // Spawn
    if (Math.random() < 0.025) spawnCoin();
    if (dist > 400 && Math.random() < 0.008) spawnWell();

    // Player physics
    player.vy += GRAVITY;
    player.y += player.vy;
    if (player.y >= GROUND) {
      player.y = GROUND;
      player.vy = 0;
      player.onGround = true;
    }

    // Scroll & collide coins
    for (var i = coins.length - 1; i >= 0; i--) {
      var c = coins[i];
      c.x -= SCROLL_SPEED;
      if (c.x < -30) { coins.splice(i, 1); continue; }
      if (c.collected) continue;
      var dx = (player.x + player.w / 2) - c.x;
      var dy = (player.y - player.h / 2) - c.y;
      if (Math.sqrt(dx * dx + dy * dy) < c.r + 16) {
        c.collected = true;
        inventory.push(c.cat.key);
        score++;
        updateHud();
        sfxCollect();
      }
    }

    // Scroll & collide wells
    for (var j = wells.length - 1; j >= 0; j--) {
      var w = wells[j];
      w.x -= SCROLL_SPEED;
      if (w.x < -80) { wells.splice(j, 1); continue; }
      if (w.passed) continue;
      // Check collision
      if (player.x + player.w > w.x && player.x < w.x + w.w && player.onGround) {
        w.passed = true;
        var idx = inventory.indexOf(w.well.cat);
        if (idx !== -1) {
          inventory.splice(idx, 1);
          updateHud();
          flashMsg = w.well.name + ' Force card used!';
          flashTimer = 90;
          sfxSurvive();
        } else {
          // Start falling into the pit
          gameState = 'falling';
          sfxFall();
          fallInfo = {
            wellType: w.well.cat,
            wellName: w.well.name,
            pitX: w.x,
            pitW: w.w,
            fallY: GROUND,
            fallVy: 0.5,
            sinkTimer: 0
          };
          flashMsg = w.well.name + ' No ' + CATS.find(function(c){return c.key===w.well.cat;}).key + ' card!';
          flashTimer = 180;
          return;
        }
      }
    }

    // Remove collected coins
    coins = coins.filter(function(c) { return !c.collected || c.x > -30; });

    if (flashTimer > 0) flashTimer--;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Ground (semi-transparent — page starry bg shows through)
    ctx.fillStyle = 'rgba(26,10,46,0.6)';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.strokeStyle = 'rgba(170,89,200,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();

    // Ground details
    var gOff = dist % 40;
    ctx.fillStyle = 'rgba(170,89,200,0.08)';
    for (var g = -1; g < W / 40 + 1; g++) {
      ctx.fillRect(g * 40 - gOff, GROUND + 4, 2, 6);
    }

    // Wells — drawn as pits in the ground
    wells.forEach(function(w) {
      if (w.passed && gameState === 'running') return;
      var px1 = w.x, px2 = w.x + w.w, pitD = 44;
      var pitY = GROUND;
      var cat = CATS.find(function(c){return c.key===w.well.cat;});
      var wk = w.well.cat;

      // Erase ground where pit is
      ctx.clearRect(px1, pitY, w.w, H - pitY);

      // Pit walls
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(px1, pitY); ctx.lineTo(px1, pitY + pitD); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px2, pitY); ctx.lineTo(px2, pitY + pitD); ctx.stroke();

      // Themed pit fill
      if (wk === 'water') {
        // Water fill with waves
        ctx.fillStyle = 'rgba(41,182,246,0.35)';
        ctx.fillRect(px1, pitY + pitD - 20, w.w, 20);
        ctx.fillStyle = 'rgba(41,182,246,0.55)';
        ctx.fillRect(px1, pitY + pitD - 10, w.w, 10);
        for (var wv = 0; wv < 3; wv++) {
          ctx.beginPath();
          ctx.arc(px1 + 12 + wv * 20, pitY + pitD - 20, 4, Math.PI, 0);
          ctx.strokeStyle = 'rgba(129,212,250,0.6)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else if (wk === 'balance') {
        // Cliff — no bottom, just void with fading lines
        for (var cl = 0; cl < 4; cl++) {
          ctx.strokeStyle = 'rgba(92,107,192,' + (0.3 - cl * 0.06) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px1 + 4, pitY + 12 + cl * 9);
          ctx.lineTo(px2 - 4, pitY + 12 + cl * 9);
          ctx.stroke();
        }
      } else if (wk === 'earth') {
        // Sinkhole — crumbling edges, dark center
        ctx.fillStyle = 'rgba(76,175,80,0.15)';
        ctx.fillRect(px1, pitY + 2, w.w, pitD - 2);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.arc(px1 + w.w / 2, pitY + pitD / 2, 14, 0, Math.PI * 2);
        ctx.fill();
        // Crack lines
        ctx.strokeStyle = 'rgba(76,175,80,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px1, pitY); ctx.lineTo(px1 + 8, pitY + 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px2, pitY); ctx.lineTo(px2 - 8, pitY + 8); ctx.stroke();
      } else if (wk === 'air') {
        // Air drag — wind lines
        ctx.strokeStyle = 'rgba(129,212,250,0.4)';
        ctx.lineWidth = 1;
        for (var al = 0; al < 4; al++) {
          var ay = pitY + 8 + al * 10;
          ctx.beginPath();
          ctx.moveTo(px1 + 5, ay);
          ctx.quadraticCurveTo(px1 + w.w / 2, ay - 4 + (al % 2) * 8, px2 - 5, ay);
          ctx.stroke();
        }
      } else if (wk === 'speed') {
        // Freefall — downward arrows
        ctx.fillStyle = 'rgba(171,71,188,0.3)';
        ctx.fillRect(px1, pitY + 2, w.w, pitD - 2);
        ctx.strokeStyle = 'rgba(171,71,188,0.6)';
        ctx.lineWidth = 1.5;
        for (var sl = 0; sl < 2; sl++) {
          var sx = px1 + 18 + sl * 24, sy = pitY + 10;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + 20);
          ctx.moveTo(sx - 5, sy + 15); ctx.lineTo(sx, sy + 20); ctx.lineTo(sx + 5, sy + 15);
          ctx.stroke();
        }
      } else if (wk === 'body') {
        // Exhaustion — zig-zag cracks
        ctx.strokeStyle = 'rgba(239,83,80,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px1 + 5, pitY + 4);
        ctx.lineTo(px1 + 20, pitY + 16); ctx.lineTo(px1 + 10, pitY + 28);
        ctx.lineTo(px1 + 30, pitY + 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px2 - 5, pitY + 8);
        ctx.lineTo(px2 - 18, pitY + 20); ctx.lineTo(px2 - 8, pitY + 34);
        ctx.stroke();
      } else if (wk === 'energy') {
        // Blackout — pulsing dark with small sparks
        ctx.fillStyle = 'rgba(255,167,38,0.1)';
        ctx.fillRect(px1, pitY + 2, w.w, pitD - 2);
        ctx.fillStyle = 'rgba(255,167,38,0.6)';
        var spark = (Math.sin(dist * 0.1) + 1) * 3;
        ctx.beginPath(); ctx.arc(px1 + 15, pitY + 18, spark, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px2 - 15, pitY + 28, spark * 0.7, 0, Math.PI * 2); ctx.fill();
      }

      // Label above pit
      ctx.fillStyle = w.well.color;
      ctx.font = 'bold 10px Futura, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(w.well.name, px1 + w.w / 2, pitY - 8);

      // Needed force icon above label
      ctx.fillStyle = cat.color;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(px1 + w.w / 2, pitY - 22, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(cat.label, px1 + w.w / 2, pitY - 19);
    });

    // Coins
    coins.forEach(function(c) {
      if (c.collected) return;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.cat.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.cat.label, c.x, c.y + 4);
    });

    // Player (simple astronaut) — skip if falling (drawn separately)
    if (gameState === 'falling') { /* drawn by drawFallingPlayer */ }
    else {
    var px = player.x, py = player.y;
    // Body
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(px + 6, py - 30, 16, 22);
    // Helmet
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath();
    ctx.arc(px + 14, py - 34, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0618';
    ctx.beginPath();
    ctx.arc(px + 14, py - 34, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px + 15, py - 35, 2, 0, Math.PI * 2);
    ctx.fill();
    // Legs
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 3;
    var legPhase = Math.sin(dist * 0.15) * 6;
    ctx.beginPath(); ctx.moveTo(px + 10, py - 8); ctx.lineTo(px + 6, py + legPhase); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + 18, py - 8); ctx.lineTo(px + 22, py - legPhase); ctx.stroke();
    // Backpack
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(px + 1, py - 28, 6, 16);
    } // end player else

    // Flash message
    if (flashTimer > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(W / 2 - 140, 10, 280, 30);
      ctx.fillStyle = gameState === 'dead' ? '#ef5350' : '#aa59c8';
      ctx.font = 'bold 14px Futura, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(flashMsg, W / 2, 30);
    }

    // Score
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px Futura, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Distance: ' + Math.floor(dist / 10), W - 12, 20);
  }

  function updateFalling() {
    if (!fallInfo) return;
    fallInfo.fallVy += 0.3;
    fallInfo.fallY += fallInfo.fallVy;
    fallInfo.sinkTimer++;

    // Slow down in water
    if (fallInfo.wellType === 'water' && fallInfo.fallVy > 1.5) {
      fallInfo.fallVy = 1.5;
    }

    // End after sinking well below screen
    if (fallInfo.fallY > H + 40) {
      gameState = 'dead';
      deadTimer = 60;
    }
    if (flashTimer > 0) flashTimer--;
  }

  function drawFallingPlayer() {
    if (!fallInfo) return;
    var px = fallInfo.pitX + fallInfo.pitW / 2 - player.w / 2;
    var py = fallInfo.fallY;
    var wk = fallInfo.wellType;

    ctx.save();

    // Clip to pit area so player disappears behind ground edges
    ctx.beginPath();
    ctx.rect(fallInfo.pitX, GROUND, fallInfo.pitW, H);
    ctx.clip();

    // Player body
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(px + 6, py - 30, 16, 22);
    // Helmet
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath(); ctx.arc(px + 14, py - 34, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0a0618';
    ctx.beginPath(); ctx.arc(px + 14, py - 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(px + 15, py - 35, 2, 0, Math.PI * 2); ctx.fill();
    // Arms flailing
    var flail = Math.sin(fallInfo.sinkTimer * 0.3) * 8;
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px + 6, py - 22); ctx.lineTo(px - 4 + flail, py - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + 22, py - 22); ctx.lineTo(px + 32 - flail, py - 30); ctx.stroke();
    // Legs dangling
    ctx.beginPath(); ctx.moveTo(px + 10, py - 8); ctx.lineTo(px + 6, py + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + 18, py - 8); ctx.lineTo(px + 22, py + 4); ctx.stroke();
    // Backpack
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(px + 1, py - 28, 6, 16);

    // Water-specific: bubbles
    if (wk === 'water' && fallInfo.fallY > GROUND + 10) {
      ctx.fillStyle = 'rgba(129,212,250,0.5)';
      for (var b = 0; b < 3; b++) {
        var bx = px + 10 + Math.sin(fallInfo.sinkTimer * 0.4 + b * 2) * 12;
        var by = py - 40 - b * 10 - fallInfo.sinkTimer * 0.3;
        if (by > GROUND) {
          ctx.beginPath(); ctx.arc(bx, by, 2 + b, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  function loop() {
    if (gameState === 'running') {
      update();
      draw();
      requestAnimationFrame(loop);
    } else if (gameState === 'falling') {
      updateFalling();
      draw();
      drawFallingPlayer();
      // Flash message
      if (flashTimer > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(W / 2 - 140, 10, 280, 30);
        ctx.fillStyle = '#ef5350';
        ctx.font = 'bold 14px Futura, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(flashMsg, W / 2, 30);
      }
      requestAnimationFrame(loop);
    } else if (gameState === 'dead') {
      draw();
      deadTimer--;
      if (deadTimer > 0) {
        requestAnimationFrame(loop);
      } else {
        var gameScore = Math.floor(dist / 10);
        overlayText.textContent = 'You fell! Score: ' + gameScore + ' — Tap to retry';
        if (typeof gtag === 'function') gtag('event', 'minigame_complete', { event_category: 'engagement', score: gameScore, force_cards: inventory.length });
        overlay.classList.remove('hidden');
      }
    }
  }

  function startGame() {
    overlay.classList.add('hidden');
    reset();
    updateHud();
    gameState = 'running';
    sfxStart();
    loop();
  }

  // Controls
  overlay.addEventListener('click', startGame);
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameState === 'idle' || gameState === 'dead') { startGame(); }
      else if (gameState === 'falling') { return; }
      else if (gameState === 'running') { jump(); }
    }
  });
  cv.addEventListener('click', function() {
    if (gameState === 'running') jump();
  });
  cv.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (gameState === 'running') jump();
  }, { passive: false });

  // Initial draw
  draw();
})();


// ===== Misc Utilities (Quiz) =====
// ---- (originally index.html lines 9068-9221) ----
(function(){
  'use strict';
  var QUESTIONS = [
    { q: "Which forces help us stand on the ground?",
      options: ["Gravity & Normal Force", "Gravity alone", "Normal Force alone", "Friction"],
      answer: 0 },
    { q: "Is Normal Force electromagnetic in nature?",
      options: ["Yes", "No"],
      answer: 0 },
    { q: "What is the relation between mass of an object & its gravity?",
      options: ["Higher mass → deeper gravity well, higher gravity", "Higher mass → shallower gravity well, lesser gravity"],
      answer: 0 },
    { q: "What happens to gravity as we move upwards from Earth's surface?",
      options: ["Force of gravity decreases with height", "Force of gravity increases with height"],
      answer: 0 },
    { q: "Normal Force is a force applied by a surface against…",
      options: ["Only gravity", "Any force applied on the surface"],
      answer: 1 },
    { q: "Surface density is highest in…",
      options: ["Solid ground", "Water", "Air"],
      answer: 0 },
    { q: "How does the Normal Force of a surface vary with its surface density?",
      options: ["Higher density → higher Normal Force", "Higher density → lower Normal Force"],
      answer: 0 },
    { q: "Which of these doesn't manipulate different forms of energy to escape gravity?",
      options: ["Rocket", "Jet pack", "Flying bird", "None — they all do"],
      answer: 3 },
    { q: "Do all metals attract a magnet?",
      options: ["Yes", "Not all metals"],
      answer: 1 },
    { q: "Gravity is…",
      options: ["An attractive force", "A geometric outcome of curved spacetime"],
      answer: 1 },
    { q: "The ISS maintains an orbit around the Earth because…",
      options: ["It has a sideways velocity holding against Earth's gravity", "It has an escape velocity to exit Earth's atmosphere"],
      answer: 0 },
    { q: "A feather falls slower than a tennis ball because…",
      options: ["Gravity is higher for the ball", "Air resistance slows the feather"],
      answer: 1 }
  ];

  var stage = document.getElementById('quiz-stage');
  var bar = document.getElementById('quiz-bar');
  var counter = document.getElementById('quiz-counter');
  var scoreEl = document.getElementById('quiz-score');
  var startBtn = document.getElementById('quiz-start');
  var idx = 0, score = 0, answered = false;

  // Sounds
  var aCtx = null;
  function audio() { if (!aCtx) aCtx = new (window.AudioContext || window.webkitAudioContext)(); return aCtx; }
  function tone(f, d, t, v) {
    try {
      var a = audio(), o = a.createOscillator(), g = a.createGain();
      o.type = t || 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(v || 0.12, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + d);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + d);
    } catch (e) {}
  }
  function sfxRight() {
    tone(660, 0.1, 'sine', 0.14);
    setTimeout(function(){ tone(880, 0.1, 'sine', 0.12); }, 90);
    setTimeout(function(){ tone(1100, 0.15, 'sine', 0.12); }, 180);
  }
  function sfxWrong() { tone(220, 0.3, 'sawtooth', 0.12); }
  function sfxNext()  { tone(550, 0.08, 'triangle', 0.10); }
  function sfxDone() {
    [523,659,784,1047].forEach(function(f, i){ setTimeout(function(){ tone(f, 0.2, 'triangle', 0.12); }, i * 120); });
  }

  function updateMeta() {
    counter.textContent = 'Question ' + (idx + 1) + ' of ' + QUESTIONS.length;
    scoreEl.textContent = 'Score: ' + score;
    bar.style.width = ((idx) / QUESTIONS.length * 100) + '%';
  }

  function showQuestion() {
    if (idx >= QUESTIONS.length) { showResult(); return; }
    answered = false;
    updateMeta();
    var q = QUESTIONS[idx];
    var html = '<div class="quiz-q">' + q.q + '</div><div class="quiz-options">';
    q.options.forEach(function(opt, i) {
      html += '<button class="quiz-opt" data-i="' + i + '">' + opt + '</button>';
    });
    html += '</div><button class="quiz-next" id="quiz-next">Next &#10140;</button>';
    stage.innerHTML = html;

    var opts = stage.querySelectorAll('.quiz-opt');
    var nextBtn = document.getElementById('quiz-next');
    opts.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (answered) return;
        answered = true;
        var picked = parseInt(btn.dataset.i, 10);
        opts.forEach(function(o) { o.disabled = true; });
        if (picked === q.answer) {
          btn.classList.add('right');
          score++;
          sfxRight();
          if (typeof window.awardGP === 'function') window.awardGP('quiz_q_' + idx, 5);
        } else {
          btn.classList.add('wrong');
          opts[q.answer].classList.add('right');
          sfxWrong();
          if (typeof window.awardGP === 'function') window.awardGP('quiz_attempt_' + idx, 2);
        }
        scoreEl.textContent = 'Score: ' + score;
        nextBtn.classList.add('show');
      });
    });
    nextBtn.addEventListener('click', function() {
      sfxNext();
      idx++;
      showQuestion();
    });
  }

  function showResult() {
    bar.style.width = '100%';
    counter.textContent = 'Complete!';
    sfxDone();
    var pct = Math.round(score / QUESTIONS.length * 100);
    if (typeof gtag === 'function') gtag('event', 'quiz_complete', { event_category: 'engagement', score: score, total: QUESTIONS.length, percentage: pct });
    var msg = pct === 100 ? 'Perfect! Gravity has nothing on you.'
            : pct >= 75  ? 'Brilliant! You clearly know your forces.'
            : pct >= 50  ? 'Solid! The board game will level you up further.'
            :              'Play the game and come back — you\'ll ace it!';
    stage.innerHTML =
      '<div class="quiz-result">' +
      '<h3>' + score + ' / ' + QUESTIONS.length + '</h3>' +
      '<p>' + msg + '</p>' +
      '<button type="button" class="quiz-restart dk-btn-host" id="quiz-restart" data-dk-size="md" data-dk-btn="Try Again"></button>' +
      '</div>';
    var restartBtn = document.getElementById('quiz-restart');
    if (typeof window.hydrateDkBtn === 'function') window.hydrateDkBtn(restartBtn);
    restartBtn.addEventListener('click', function() {
      idx = 0; score = 0; showQuestion();
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', function() {
      sfxNext();
      idx = 0; score = 0;
      showQuestion();
    });
  }
})();


// ===== FAQ Accordion =====
// ---- (originally index.html lines 9379-9396) ----
(function(){
  var items = document.querySelectorAll('.faq-item');
  if (!items.length || !('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(function(item, i) {
    item.style.transitionDelay = (i * 0.08) + 's';
    obs.observe(item);
  });
})();


// ===== Misc Utilities =====
// ---- (originally index.html lines 9563-9598) ----
(function(){
  var pins = document.querySelectorAll('.more-pin');
  if (!pins.length) return;

  // Staggered reveal on scroll
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    pins.forEach(function(pin, i) {
      pin.style.transitionDelay = (i * 0.06) + 's';
      obs.observe(pin);
    });
  }

  // Sound on hover/touch
  pins.forEach(function(pin) {
    pin.addEventListener('mouseenter', function() {
      if (window.playBoxSound && window._cardScrollBuf) {
        window.playBoxSound(window._cardScrollBuf, 0.1);
      }
    });
    pin.addEventListener('click', function() {
      if (window.playBoxSound && window._cardFlipBuf) {
        window.playBoxSound(window._cardFlipBuf, 0.3);
      }
    });
  });
})();


// ===== Lead Tracking / Analytics helpers =====
// ---- (originally index.html lines 9661-9804) ----
(function(){
  'use strict';

  /* ── Global button click sound ─────────────────────────────
     Regular click sound for tabs, arrows, quiz buttons, etc.
     CTA buttons (Pre-Order, Sign Up, Count Me In) get a special
     celebratory chime instead. */
  var btnClickSound = new Audio('button click sound.wav');
  btnClickSound.preload = 'auto';

  // Celebratory chime for CTA buttons (Web Audio — rising arpeggio)
  var ctaAudioCtx = null;
  function playCtaChime() {
    try {
      if (!ctaAudioCtx) ctaAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctaAudioCtx.state === 'suspended') ctaAudioCtx.resume();
      var notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
      var t0 = ctaAudioCtx.currentTime;
      notes.forEach(function(freq, i) {
        var osc = ctaAudioCtx.createOscillator();
        var gain = ctaAudioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t0 + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.15, t0 + i * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctaAudioCtx.destination);
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
      try {
        var s = btnClickSound.cloneNode();
        s.volume = 0.4;
        s.play().catch(function(){});
      } catch(e2){}
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
  const fadeEls = document.querySelectorAll('.eg-fade-in');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        e.target.classList.toggle('visible', e.isIntersecting);
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => obs.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

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


// ===== Misc Utilities =====
// ---- (originally index.html lines 9807-10062) ----
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
  spiralImg.src = 'spiral-board-cursor.webp';

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

  // Spiral sounds
  var spiralAc = null;
  var spiralWhirr = null;
  var spinSoundBuf = null;
  // Preload spin sound.wav for scroll turns
  (function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'spin sound.wav', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status === 200) {
        if (!spiralAc) spiralAc = new (window.AudioContext || window.webkitAudioContext)();
        spiralAc.decodeAudioData(xhr.response, function(buf) { spinSoundBuf = buf; });
      }
    };
    xhr.send();
  })();

  // Play spin sound.wav (scroll turns) — only first 1s, with fade
  var spinPlaying = false;
  function playSpinSound() {
    if (!spinSoundBuf || !spiralAc || spinPlaying) return;
    try {
      if (spiralAc.state === 'suspended') spiralAc.resume();
      spinPlaying = true;
      var src = spiralAc.createBufferSource();
      src.buffer = spinSoundBuf;
      var gain = spiralAc.createGain();
      var t = spiralAc.currentTime;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.setValueAtTime(0.3, t + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      src.connect(gain);
      gain.connect(spiralAc.destination);
      src.start(0, 0, 1.0);
      setTimeout(function() { spinPlaying = false; }, 1500);
    } catch(e) { spinPlaying = false; }
  }

  // Synthesized whirr (for click/dblclick spins)
  function startSpiralSound(duration) {
    try {
      if (!spiralAc) spiralAc = new (window.AudioContext || window.webkitAudioContext)();
      if (spiralAc.state === 'suspended') spiralAc.resume();
      if (spiralWhirr) { try { spiralWhirr.osc.stop(); } catch(x){} spiralWhirr = null; }
      var osc = spiralAc.createOscillator();
      var gain = spiralAc.createGain();
      var t = spiralAc.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + duration);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.setValueAtTime(0.06, t + duration * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(gain);
      gain.connect(spiralAc.destination);
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

// ---- (originally index.html lines 10190-10209) ----
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


// ===== Lead Tracking / Analytics helpers (Cue framework) =====
// ---- (originally index.html lines 10333-10527) ----
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

  /* ── Hero / illustrations rain cue ─────────────────── */
  (function(){
    var s1 = document.getElementById('s1');
    if (!s1) return;
    var cue = document.createElement('div');
    cue.className = 'eg-cue eg-cue-bottom';
    cue.textContent = 'Drag, Drop & Play with the elements';
    // Sit just above the rain so it's visible without overlapping the button
    cue.style.bottom = 'clamp(70px, 14vh, 130px)';
    cue.style.zIndex = '90';
    s1.appendChild(cue);
    var dismissed = false;
    function go() {
      if (dismissed) return;
      show(cue);
      // Auto-dismiss after a longer window so the user has time to read
      setTimeout(function(){ dismiss(cue); }, 8000);
    }
    setTimeout(go, 1500);
    // Only dismiss when the user actually drags something — a plain
    // tap (which can just be a scroll start on mobile) shouldn't kill it.
    var cv = document.getElementById('cv');
    var startX = 0, startY = 0, tracking = false;
    function onDown(e){
      var p = e.touches ? e.touches[0] : e;
      startX = p.clientX; startY = p.clientY;
      tracking = true;
    }
    function onMove(e){
      if (!tracking) return;
      var p = e.touches ? e.touches[0] : e;
      var dx = p.clientX - startX, dy = p.clientY - startY;
      if (Math.hypot(dx, dy) > 16) {
        dismissed = true;
        dismiss(cue);
        tracking = false;
      }
    }
    function onUp(){ tracking = false; }
    if (cv) {
      cv.addEventListener('pointerdown', onDown, { passive: true });
      cv.addEventListener('pointermove', onMove, { passive: true });
      cv.addEventListener('pointerup', onUp, { passive: true });
      cv.addEventListener('touchstart', onDown, { passive: true });
      cv.addEventListener('touchmove', onMove, { passive: true });
      cv.addEventListener('touchend', onUp, { passive: true });
    }
  })();

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


// ===== Misc Utilities =====
// ---- (originally index.html lines 10529-10605) ----
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

// ===== Scroll Effects =====
// ---- (originally index.html lines 10706-10753) ----
(function(){
  var bar = document.getElementById('scroll-progress');
  var dots = document.getElementById('nav-dots');
  var allDots = document.querySelectorAll('.nav-dot');
  var sections = [];

  allDots.forEach(function(dot) {
    var id = dot.getAttribute('data-target');
    var el = document.getElementById(id);
    if (el) sections.push({ dot: dot, el: el });
    dot.addEventListener('click', function() {
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function onScroll() {
    var scrollTop = window.pageYOffset || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Progress bar
    bar.style.width = pct + '%';

    // Show dots after scrolling past hero
    if (scrollTop > window.innerHeight * 0.5) {
      dots.classList.add('visible');
    } else {
      dots.classList.remove('visible');
    }

    // Active dot — find which section is in view
    var current = null;
    for (var i = sections.length - 1; i >= 0; i--) {
      var rect = sections[i].el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) {
        current = sections[i].dot;
        break;
      }
    }
    allDots.forEach(function(d) { d.classList.remove('active'); });
    if (current) current.classList.add('active');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ===== Gravity Points / Toast =====
// ---- (originally index.html lines 10902-11146) ----
(function(){
  var pill = document.getElementById('gp-pill');
  var scoreEl = document.getElementById('gp-score');
  var floatEl = document.getElementById('gp-float');
  var toastEl = document.getElementById('gp-toast');
  if (!pill) return;

  // Load from localStorage
  var stored = JSON.parse(localStorage.getItem('gp-data') || '{}');
  var points = stored.points || 0;
  var earned = stored.earned || {};
  var toastsShown = stored.toasts || {};
  var visible = false;

  // Never show over the hero section — only from screen 2 onward
  var heroInView = true;
  function syncPillVisibility() {
    if (visible && !heroInView) pill.classList.add('visible');
    else pill.classList.remove('visible');
  }
  var heroEl = document.getElementById('s1');
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      heroInView = entries[0].isIntersecting;
      syncPillVisibility();
    }, { threshold: 0 }).observe(heroEl);
  } else {
    heroInView = false;
  }

  function save() {
    localStorage.setItem('gp-data', JSON.stringify({
      points: points, earned: earned, toasts: toastsShown
    }));
  }

  function updateDisplay() { scoreEl.textContent = points; }

  function showFloat(amount, x, y) {
    floatEl.textContent = '+' + amount;
    floatEl.style.left = (x || 40) + 'px';
    floatEl.style.top = (y || pill.getBoundingClientRect().top) + 'px';
    floatEl.classList.remove('show');
    void floatEl.offsetWidth;
    floatEl.classList.add('show');
    pill.classList.add('pulse');
    setTimeout(function() { pill.classList.remove('pulse'); }, 600);
  }

  function award(key, amount, x, y) {
    if (earned[key]) return;
    earned[key] = true;
    points += amount;
    updateDisplay();
    showFloat(amount, x, y);
    save();
    checkToasts();
  }

  function awardRepeatable(key, amount) {
    points += amount;
    updateDisplay();
    showFloat(amount);
    save();
    checkToasts();
  }

  function showToast(msg, duration) {
    toastEl.innerHTML = msg;
    toastEl.classList.add('show');
    setTimeout(function() { toastEl.classList.remove('show'); }, duration || 4000);
  }

  function checkToasts() {
    if (points >= 50 && !toastsShown.t50) {
      toastsShown.t50 = true;
      showToast("You're earning <em>Gravity Points!</em> These convert to <em>₹1 discount per point</em> when EscapeGravity launches.", 5000);
      save();
    }
    if (points >= 100 && !toastsShown.t100) {
      toastsShown.t100 = true;
      showToast("<em>100 Gravity Points = ₹100 off!</em> Keep exploring to earn more.", 4000);
      save();
    }
    if (points >= 200 && !toastsShown.t200) {
      toastsShown.t200 = true;
      showToast("<em>200 points!</em> You're in the top tier of explorers.", 4000);
      save();
    }
  }

  updateDisplay();

  // ── Section scroll: 5 pts per section ──
  var sectionIds = ['s-parents','s-unlearn','s2','s-experience','s-forces',
    's-spiral','s-layers','s4-science','s4b-turns','s6b-gravity',
    's3','s-game','s-quiz','s-faq','s6','s7','s-more'];

  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          award('sec_' + e.target.id, 5);
        }
      });
    }, { threshold: 0.3 });
    sectionIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) secObs.observe(el);
    });
  }

  // ── Time spent: 1 pt per 10 sec per section, max 12 per section ──
  var timeTrackers = {};
  if ('IntersectionObserver' in window) {
    var timeObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        var id = e.target.id;
        if (e.isIntersecting) {
          if (!timeTrackers[id]) timeTrackers[id] = { total: 0, timer: null };
          var t = timeTrackers[id];
          if (t.timer) return;
          t.timer = setInterval(function() {
            var key = 'time_' + id + '_' + t.total;
            if (t.total < 12) {
              t.total++;
              award(key, 1);
            }
          }, 10000);
        } else {
          if (timeTrackers[id] && timeTrackers[id].timer) {
            clearInterval(timeTrackers[id].timer);
            timeTrackers[id].timer = null;
          }
        }
      });
    }, { threshold: 0.2 });
    sectionIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) timeObs.observe(el);
    });
  }

  // ── How To Play: 8 pts per tab, 25 bonus for all 3 ──
  var htpTabs = {};
  document.querySelectorAll('.s2-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var panel = tab.getAttribute('data-panel');
      if (panel) {
        award('htp_tab_' + panel, 8);
        htpTabs[panel] = true;
      }
      if (htpTabs.physical && htpTabs.boardgame && htpTabs.science) {
        award('htp_all', 25);
      }
    });
  });

  // ── Quiz: 20 pts + 5 per correct ──
  var origShowResult = window.showQuizResult;
  var quizInterval = setInterval(function() {
    var quizScore = document.getElementById('quiz-score');
    var restartBtn = document.getElementById('quiz-restart');
    if (restartBtn && !earned.quiz_done) {
      award('quiz_done', 20);
      // Try to get score from the displayed text
      var scoreText = quizScore ? quizScore.parentElement.textContent : '';
      var match = scoreText.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        var correct = parseInt(match[1]);
        for (var i = 0; i < correct; i++) {
          award('quiz_q' + i, 5);
        }
      }
      clearInterval(quizInterval);
    }
  }, 2000);

  // ── Mini game: 15 pts for playing + score ──
  var gameInterval = setInterval(function() {
    var overlay = document.getElementById('game-overlay-text');
    if (overlay && overlay.textContent.indexOf('Score:') >= 0 && !earned.game_played) {
      award('game_played', 15);
      var gMatch = overlay.textContent.match(/Score:\s*(\d+)/);
      if (gMatch) {
        var gameScore = Math.min(parseInt(gMatch[1]), 50);
        awardRepeatable('game_score', gameScore);
      }
      clearInterval(gameInterval);
    }
  }, 2000);

  // ── Unlearn flips: 15 pts for flipping all 4 ──
  var flipped = {};
  document.querySelectorAll('.unlearn-card').forEach(function(card, i) {
    card.addEventListener('click', function() {
      award('unlearn_' + i, 3);
      flipped[i] = true;
      if (Object.keys(flipped).length >= 4) {
        award('unlearn_all', 10);
      }
    });
  });

  // ── Show Interest signup: 50 pts ──
  var origDoPreOrder = window.doPreOrder;
  if (typeof origDoPreOrder === 'function') {
    window.doPreOrder = function() {
      origDoPreOrder.apply(this, arguments);
      setTimeout(function() { award('signup', 50); }, 500);
    };
  }

  // ── Show pill after 30 seconds of scrolling ──
  var showTimer = null;
  window.addEventListener('scroll', function() {
    if (visible) return;
    if (!showTimer) {
      showTimer = setTimeout(function() {
        visible = true;
        syncPillVisibility();
        if (points > 0) checkToasts();
      }, 3000);
    }
  }, { passive: true });

  // If returning user with points, show immediately after short delay
  if (points > 0) {
    setTimeout(function() {
      visible = true;
      syncPillVisibility();
    }, 1500);
  }

  // ── Expose for other scripts ──
  window.getGravityPoints = function() { return points; };
  window.awardGP = function(key, amount) { award(key, amount); };

  // ── Click pill to show info ──
  var pillClicked = false;
  pill.addEventListener('click', function() {
    if (window.playBoxSound && window._cardFlipBuf) window.playBoxSound(window._cardFlipBuf, 0.35);
    pillClicked = true;
    var discount = points > 0 ? ' That\'s <em>₹' + points + ' off</em> when we launch!' : '';
    showToast('<em>Gravity Points</em> — earn points by exploring the site. Every point = ₹1 discount on EscapeGravity.' + discount + '<span class="gp-close" onclick="this.parentElement.classList.remove(\'show\')">✕</span>', 8000);
  });

  // ── Wiggle every 8 seconds until clicked ──
  var wiggleTimer = setInterval(function() {
    if (pillClicked || !visible) return;
    pill.classList.remove('wiggle');
    void pill.offsetWidth;
    pill.classList.add('wiggle');
  }, 8000);

  pill.addEventListener('animationend', function() {
    pill.classList.remove('wiggle');
  });
})();


// ===== Scroll Effects (Falling apple + Newton parallax) =====
// ---- (originally index.html lines 11201-11276) ----
(function(){
  var apple = document.getElementById('apple-scroll');
  var newton = document.getElementById('newton-img');
  if (!apple || !newton) return;

  var bouncing = false;
  var frame = 0;
  var hitY = 0;
  var lastPct = 0;

  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = scrollTop / docHeight;

    // Only show apple when scrolling DOWN (pct increasing)
    var goingDown = pct > lastPct;
    lastPct = pct;

    // Newton at bottom-right from 85%
    if (pct > 0.85) {
      newton.classList.add('show');
    } else {
      newton.classList.remove('show');
      newton.classList.remove('bonked');
    }

    // Apple only falls down, hidden when scrolling up
    if (!bouncing && pct > 0 && goingDown) {
      var appleY = pct * window.innerHeight;
      var drift = Math.sin(pct * Math.PI * 8) * 25;
      var rotate = pct * 720;
      apple.style.top = appleY + 'px';
      apple.style.right = (window.innerWidth * 0.06 + drift) + 'px';
      apple.style.transform = 'rotate(' + rotate + 'deg)';
      apple.style.opacity = '' + Math.min(pct * 15, 0.9);
    } else if (!bouncing && !goingDown) {
      apple.style.opacity = '0';
    }

    // Hit Newton at 93%
    if (pct > 0.93 && !bouncing) {
      bouncing = true;
      frame = 0;
      var nRect = newton.getBoundingClientRect();
      hitY = nRect.top;
      apple.style.right = (window.innerWidth - nRect.left - nRect.width * 0.4) + 'px';
      apple.style.opacity = '0.9';
      newton.classList.add('bonked');
      if (window.playBoxSound && window._cardFlipBuf) window.playBoxSound(window._cardFlipBuf, 0.4);
      if (typeof window.awardGP === 'function') window.awardGP('newton_hit', 10);
      requestAnimationFrame(doBounce);
    }

    // Reset on scroll back up
    if (pct < 0.80 && bouncing) {
      bouncing = false;
      frame = 0;
      newton.classList.remove('bonked');
    }
  }, { passive: true });

  function doBounce() {
    if (!bouncing) return;
    frame++;
    var bounceH = Math.sin((Math.min(frame, 20) / 20) * Math.PI) * 60;
    var fallAfter = frame > 20 ? (frame - 20) * (frame - 20) * 0.3 : 0;
    apple.style.top = (hitY - bounceH + fallAfter) + 'px';
    apple.style.transform = 'rotate(' + (frame * 10) + 'deg)';
    if (frame > 25) apple.style.opacity = '' + Math.max(0, 1 - (frame - 25) / 15);
    if (frame < 45) requestAnimationFrame(doBounce);
  }
})();


// ===== Misc Utilities =====
// ---- (originally index.html lines 11388-11494) ----
(function(){
  var input = document.getElementById('gw-input');
  var vals = document.querySelectorAll('.gw-val');
  var panel = document.getElementById('gw-panel');
  var tag = document.getElementById('gw-tag');
  if (!input || !vals.length || !panel) return;

  // Never show over the hero section — only from screen 2 onward
  if (tag) {
    var gwHeroEl = document.getElementById('s1');
    if (gwHeroEl && 'IntersectionObserver' in window) {
      new IntersectionObserver(function(entries) {
        tag.classList.toggle('visible', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(gwHeroEl);
    } else {
      tag.classList.add('visible');
    }
  }

  // Animated count-up
  function animateValue(el, target) {
    var current = parseFloat(el.textContent) || 0;
    var diff = target - current;
    if (Math.abs(diff) < 0.05) { el.textContent = target.toFixed(1); return; }
    var steps = 15;
    var step = 0;
    function tick() {
      step++;
      var t = step / steps;
      var ease = t * (2 - t); // ease-out
      var val = current + diff * ease;
      el.textContent = val.toFixed(1);
      el.classList.add('flash');
      if (step < steps) requestAnimationFrame(tick);
      else { el.textContent = target.toFixed(1); setTimeout(function(){ el.classList.remove('flash'); }, 200); }
    }
    tick();
  }

  function update() {
    var w = parseFloat(input.value) || 0;
    vals.forEach(function(el) {
      var g = parseFloat(el.dataset.g);
      var target = w * g;
      animateValue(el, target);
    });
    if (typeof window.awardGP === 'function') window.awardGP('weight_calc', 5);
  }

  input.addEventListener('input', update);
  update();

  function playSound(vol) {
    if (window.playBoxSound && window._cardFlipBuf) window.playBoxSound(window._cardFlipBuf, vol || 0.3);
  }
  function playScrollSound(vol) {
    if (window.playBoxSound && window._cardScrollBuf) window.playBoxSound(window._cardScrollBuf, vol || 0.15);
  }

  // Open panel
  tag.addEventListener('click', function(e) {
    e.stopPropagation();
    panel.classList.add('open');
    tag.style.opacity = '0';
    tag.style.pointerEvents = 'none';
    playSound(0.35);
    setTimeout(function() { playScrollSound(0.2); }, 150);
    if (typeof window.awardGP === 'function') window.awardGP('weight_open', 5);
  });

  // Close panel
  function closePanel() {
    panel.classList.remove('open');
    playScrollSound(0.15);
    setTimeout(function() { tag.style.opacity = ''; tag.style.pointerEvents = ''; }, 400);
  }

  // Close button
  document.getElementById('gw-close').addEventListener('click', function(e) {
    e.stopPropagation();
    closePanel();
  });

  // Click outside to close
  document.addEventListener('click', function(e) {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== tag && !tag.contains(e.target)) {
      closePanel();
    }
  });

  // Sound on weight change
  input.addEventListener('input', function() {
    playSound(0.15);
    update();
  });

  // +/- buttons
  document.getElementById('gw-plus').addEventListener('click', function(e) {
    e.stopPropagation();
    input.value = Math.min(500, (+input.value || 0) + 5);
    playSound(0.2);
    update();
  });
  document.getElementById('gw-minus').addEventListener('click', function(e) {
    e.stopPropagation();
    input.value = Math.max(1, (+input.value || 0) - 5);
    playSound(0.2);
    update();
  });

  // Mobile: touch outside to close
  document.addEventListener('touchstart', function(e) {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== tag && !tag.contains(e.target)) {
      closePanel();
    }
  }, { passive: true });
})();

// ---- Board tour: full board → Tile 0 → ISS → Tile 0 with tokens, looping, with play/pause ----
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

// ---- (originally index.html lines 11496-11499) ----
  // Disable right-click context menu (deterrent only — does not hide source code)
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });


