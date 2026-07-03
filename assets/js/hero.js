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

      // Canvas base color per environment (set in applyEnv)
      const ENV_BG = {
        earth: '#120826', moon: '#0b0b10', mars: '#170b06',
        jupiter: '#150e06', iss: '#060810'
      };
      let envBg = ENV_BG.earth;
      function drawBackground() {
        ctx.fillStyle = envBg;
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
      try {
        EGAudio.loadBuffer('single Swoosh sound.mp3', function(buf) { swooshBuffer = buf; });
      } catch(e) {}
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
        try { var _ac = EGAudio.ctx(); if (_ac && _ac.state === 'suspended') _ac.resume(); } catch(e) {}
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
        // No air, no sound of falling — vacuum is silent
        if (window.EGGravity && EGGravity.get().air <= 0) return;
        EGAudio.playBuffer(swooshBuffer, {
          rate: 0.9 + Math.random() * 0.2,
          vol: 0.35 + Math.random() * 0.15
        });
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
      const RAIN_KEYS     = ['DasBox'];
      const BIRD_KEY      = 'Card12Side2';
      const BALLOON_KEY   = 'Card12Side1';
      const PARACHUTE_KEY = 'Card13Side1';
      const ALL_KEYS      = [...RAIN_KEYS, BIRD_KEY, BALLOON_KEY, PARACHUTE_KEY];

      const imgCache = {};
      let loadedCount = 0;
      let rainLoadedCount = 0;
      const RAIN_TOTAL = RAIN_KEYS.length;
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
      /* Tight opaque bounding box of an image (fractions 0..1).
         The illustrations carry big transparent margins; physics
         bodies use this box so objects touch the ground where the
         ART is, not where the file's padding ends. */
      const BBOX = {};
      function computeBBox(img) {
        try {
          const S = 48;
          const c = document.createElement('canvas');
          c.width = S; c.height = S;
          const cx = c.getContext('2d', { willReadFrequently: true });
          cx.drawImage(img, 0, 0, S, S);
          const d = cx.getImageData(0, 0, S, S).data;
          let x0 = S, y0 = S, x1 = 0, y1 = 0;
          for (let y = 0; y < S; y++) {
            for (let x = 0; x < S; x++) {
              if (d[(y * S + x) * 4 + 3] > 24) {
                if (x < x0) x0 = x; if (x > x1) x1 = x;
                if (y < y0) y0 = y; if (y > y1) y1 = y;
              }
            }
          }
          if (x1 <= x0 || y1 <= y0) return null;
          return { x0: x0 / S, y0: y0 / S, x1: (x1 + 1) / S, y1: (y1 + 1) / S };
        } catch (e) { return null; }
      }

      ALL_KEYS.forEach(k => {
        if (!CARDS[k]) { loadedCount++; return; } // stale cached cards.js without this key
        const img   = new Image();
        img.onload  = () => {
          imgCache[k] = img;
          BBOX[k] = computeBBox(img);
          loadedCount++;
          if (RAIN_KEYS.indexOf(k) !== -1) rainLoadedCount++;
          // Start the rain once every rain image is ready.
          if (rainLoadedCount >= RAIN_TOTAL && !window._heroSpawned) {
            clearTimeout(heroSpawnTimer);
            window._heroSpawned = true;
            spawnAll();
          } else if (window._heroSpawned && RAIN_KEYS.indexOf(k) !== -1) {
            // Late arrival (only reachable via the timeout fallback above):
            // add this card to the already-running scene.
            if (typeof window._lateDropCard === 'function') window._lateDropCard(k);
          }
        };
        img.onerror = () => { loadedCount++; };
        img.src     = EGAudio.url(CARDS[k].src);
      });

      /* ── Rain state ─────────────────────────────────────────── */
      const physEntries = [];
      window._dbgEntries = physEntries;   // { body, key, dW, dH }
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
          const sizeMult = (key === 'EGBox') ? (twoRow ? 2.2 : 1.6) : (key === 'DasBox') ? (twoRow ? 1.7 : 1.6) : (twoRow ? 1.18 : 1);
          const dW   = Math.round(slotW * sizeMult);
          const dH   = Math.round(slotW * sizeMult * info.h / info.w);
          maxCardH   = Math.max(maxCardH, dH);

          const col = i % cardsPerRow;
          const row = Math.floor(i / cardsPerRow);
          const x   = GAP + col*(slotW+GAP) + slotW/2 + (Math.random()-.5)*slotW*.12;
          const y   = -dH/2 - 30;

          const baseAir = 0.012 + Math.random() * 0.018;
          const bb = BBOX[key] || { x0: 0, y0: 0, x1: 1, y1: 1 };
          const bw = Math.max(14, dW * (bb.x1 - bb.x0));
          const bh = Math.max(14, dH * (bb.y1 - bb.y0));
          const body = Bodies.rectangle(x, y, bw, bh, {
            isStatic:    true,
            frictionAir: baseAir,
            restitution: 0.30  + Math.random() * 0.30,
            friction:    0.55  + Math.random() * 0.30,
          });
          World.add(world, body);
          physEntries.push({ body, key, dW, dH, baseAir, bw, bh,
            ox: dW * (bb.x0 + bb.x1) / 2, oy: dH * (bb.y0 + bb.y1) / 2 });

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

        spawnMaterials();
        tossCueRound = true;      // invite again on every fresh drop
        if (window.EGGravity) applyEnv(EGGravity.get());
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
        var sizeMult = (key === 'EGBox') ? (twoRow ? 2.2 : 1.6) : (key === 'DasBox') ? (twoRow ? 1.7 : 1.6) : (twoRow ? 1.18 : 1);
        var dW = Math.round(slotW * sizeMult);
        var dH = Math.round(slotW * sizeMult * info.h / info.w);
        var x = GAP + col*(slotW+GAP) + slotW/2 + (Math.random()-.5)*slotW*.12;
        var y = -dH/2 - 30;
        var bb = BBOX[key] || { x0: 0, y0: 0, x1: 1, y1: 1 };
        var bw = Math.max(14, dW * (bb.x1 - bb.x0));
        var bh = Math.max(14, dH * (bb.y1 - bb.y0));
        var body = Bodies.rectangle(x, y, bw, bh, {
          isStatic: false,
          frictionAir: 0.012 + Math.random() * 0.018,
          restitution: 0.30 + Math.random() * 0.30,
          friction: 0.55 + Math.random() * 0.30,
        });
        Body.setAngularVelocity(body, (Math.random() - .5) * .35);
        World.add(world, body);
        physEntries.push({ body: body, key: key, dW: dW, dH: dH, baseAir: body.frictionAir, bw: bw, bh: bh,
          ox: dW * (bb.x0 + bb.x1) / 2, oy: dH * (bb.y0 + bb.y1) / 2 });
        playSwoosh();
      };

      /* ═════════════ Material objects — real gravity behaviors ═════════
         Five objects with honest physics: the apple falls and bounces,
         the rocket thuds, the feather flutters (drag), the paper sways,
         the balloon rises (buoyancy). All of it is driven by the
         environment's g and air values from EGGravity — on the Moon the
         feather drops like a stone and the balloon has nothing to float
         in. Flat-vector SVG art, no image files needed. */
      function svgURI(s) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(s); }
      const MATERIALS = {
        apple: {
          w: 84, h: 86, shape: 'circle', img: 'item-apple.webp',
          density: 0.0020, rest: 0.45, fric: 0.4, airBase: 0.006,
          label: function(env) { return 'falls fast, small bounce'; }
        },
        feather: {
          w: 104, h: 67, shape: 'rect', img: 'item-feather.webp',
          density: 0.0002, rest: 0.10, fric: 0.2, airBase: 0.09, flutter: true,
          label: function(env) { return env.air > 0 ? 'air slows it — flutters down' : 'no air here — falls like the hammer!'; }
        },
        hammer: {
          w: 92, h: 110, shape: 'rect', img: 'item-hammer.webp',
          density: 0.0085, rest: 0.04, fric: 0.85, airBase: 0.002,
          label: function(env) { return 'heavy — lands with a thud'; }
        },
        paper: {
          w: 96, h: 108, shape: 'rect', img: 'item-paper.webp',
          density: 0.0003, rest: 0.05, fric: 0.3, airBase: 0.07, sway: true,
          label: function(env) { return env.air > 0 ? 'rides the air, sways down' : 'no air — falls straight down'; }
        },
        balloon: {
          w: 84, h: 140, shape: 'circle', img: 'item-balloon.webp',
          density: 0.0004, rest: 0.60, fric: 0.1, airBase: 0.05, buoyant: true,
          label: function(env) { return env.air > 0 ? 'lighter than air — it floats' : 'nothing to float in — it drops'; }
        },
        bouncy: {
          w: 84, h: 81, shape: 'circle', img: 'item-bouncy.webp',
          density: 0.0015, rest: 0.88, fric: 0.3, airBase: 0.004,
          label: function(env) { return 'rubber stores energy — big bounces'; }
        },
        steel: {
          w: 80, h: 78, shape: 'circle', img: 'item-steel.webp',
          density: 0.0095, rest: 0.05, fric: 0.5, airBase: 0.002,
          label: function(env) { return 'same size, but steel — barely bounces'; }
        },
        bubble: {
          w: 88, h: 86, shape: 'circle', img: 'item-bubble.webp', needsAir: true, sway: true,
          density: 0.00008, rest: 0.1, fric: 0.05, airBase: 0.17,
          label: function(env) { return 'almost weightless — drifts on air'; }
        },
        beachball: {
          w: 100, h: 99, shape: 'circle', img: 'item-beachball.webp',
          density: 0.0004, rest: 0.55, fric: 0.3, airBase: 0.03,
          label: function(env) { return env.air > 0 ? 'big but mostly air — size isn\'t weight' : 'no air to slow it — falls like the rest'; }
        },
        chute: {
          w: 76, h: 139, shape: 'rect', img: 'item-chute.webp', sway: true,
          density: 0.0006, rest: 0.02, fric: 0.6, airBase: 0.14,
          label: function(env) { return env.air > 0 ? 'parachute catches air — slowest faller' : 'no air — the parachute does nothing!'; }
        }
      };
      function matSrc(m) { return m.img ? EGAudio.url(m.img) : m.svg; }
      Object.keys(MATERIALS).forEach(k => {
        const img = new Image();
        img.src = matSrc(MATERIALS[k]);
        img.onload = () => { imgCache['mat_' + k] = img; };
        // Materials render as DOM images (like the rain cards) so they
        // sit ABOVE the environment surface art, not on the star canvas
        // behind it.
        const el = document.createElement('img');
        el.src = matSrc(MATERIALS[k]);
        el.alt = '';
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.zIndex = '1';
        el.style.pointerEvents = 'none';
        el.style.display = 'none';
        el.style.willChange = 'transform';
        cv.parentElement.appendChild(el);
        rainImgEls['mat_' + k] = el;
      });

      function currentAir() {
        return window.EGGravity ? EGGravity.get().air : 1;
      }

      function spawnMaterials() {
        const air = currentAir();
        const sc = W < 480 ? 0.85 : W < 768 ? 1.1 : 2.0;
        const KEYS = Object.keys(MATERIALS);
        KEYS.forEach((k, i) => {
          const m  = MATERIALS[k];
          const dW = Math.round(m.w * sc);
          const dH = Math.round(m.h * sc);
          // Even slots with jitter — random x heaps everything on
          // narrow screens
          const slot = KEYS.length > 1 ? i / (KEYS.length - 1) : 0.5;
          const x  = W * 0.1 + slot * W * 0.8 + (Math.random() - 0.5) * W * 0.06;
          const y  = -dH / 2 - 40 - Math.random() * 80;
          const opts = {
            isStatic:    true,
            density:     m.density,
            restitution: m.rest,
            friction:    m.fric,
            frictionAir: 0.0008 + m.airBase * air,
          };
          const body = m.shape === 'circle'
            ? Bodies.circle(x, y, Math.max(dW, dH) / 2 * 0.85, opts)
            : Bodies.rectangle(x, y, dW, dH, opts);
          World.add(world, body);
          physEntries.push({ body, key: 'mat_' + k, dW, dH, mat: m, baseAir: m.airBase, phase: Math.random() * Math.PI * 2 });
          rainTimers.push(setTimeout(() => {
            Body.setStatic(body, false);
            Body.setAngularVelocity(body, (Math.random() - .5) * .2);
            Body.setVelocity(body, { x: (Math.random() - .5) * 1.2, y: 0 });
            playSwoosh();
          }, 2400 + i * 320 + Math.random() * 300));
        });
      }

      /* Per-tick material forces: buoyancy (balloon), flutter (feather),
         sway (paper). All scale with the environment's air density, so
         they vanish in vacuum — which is the honest behavior. */
      let matT = 0;
      Events.on(engine, 'beforeUpdate', function() {
        matT += 1 / 60;
        const air = currentAir();
        const gY  = engine.gravity.y * engine.gravity.scale;
        physEntries.forEach(en => {
          const m = en.mat;
          if (!m || en.body.isStatic) return;
          const b = en.body;
          if (m.buoyant && air > 0 && engine.gravity.y > 0) {
            // Lift exceeds weight low on screen, eases off near the top —
            // so the balloon rises to a hover band and bobs there.
            const heightFactor = Math.min(1.35, Math.max(0.25, b.position.y / (H * 0.32)));
            const lift = -b.mass * gY * (1.15 * Math.min(air, 1)) * heightFactor;
            Body.applyForce(b, b.position, { x: Math.sin(matT * 0.7 + en.phase) * b.mass * gY * 0.12, y: lift });
          }
          if (m.flutter && air > 0) {
            Body.applyForce(b, b.position, { x: Math.sin(matT * 2.2 + en.phase) * b.mass * gY * 0.55, y: 0 });
            b.torque += Math.sin(matT * 1.7 + en.phase) * b.mass * 0.00003;
          }
          if (m.sway && air > 0) {
            Body.applyForce(b, b.position, { x: Math.sin(matT * 1.1 + en.phase) * b.mass * gY * 0.4, y: 0 });
          }
        });
      });

      /* ── Terrain: physics ground traced from the surface art ──
         Height profile extracted from the environment PNG's alpha
         channel (fraction of image height, left→right). Rendered as
         a chain of thin static segments matching the on-screen
         position of the bottom-anchored image, so objects land on
         the ridges and roll into the valleys of the visible art. */
      const SURFACE_PROFILES = {
        moon: {
          aspect: 1330 / 2304, minWidth: 900,
          points: [0.218,0.387,0.385,0.383,0.381,0.38,0.379,0.378,0.377,0.377,0.46,0.392,0.366,0.363,0.371,0.377,0.408,0.408,0.35,0.332,0.341,0.34,0.337,0.336,0.334,0.333,0.332,0.331,0.332,0.333,0.335,0.338,0.341,0.344,0.348,0.349,0.35,0.35,0.353,0.354,0.356,0.359,0.362,0.365,0.371,0.377,0.382,0.386,0.392,0.392,0.389,0.389,0.389,0.387,0.385,0.387,0.39,0.389,0.383,0.385,0.379,0.375,0.378,0.383,0.383,0.397,0.383,0.392,0.398,0.386,0.388,0.368,0.366,0.365,0.366,0.368,0.371,0.374,0.377,0.38,0.383,0.386,0.388,0.389,0.39,0.39,0.389,0.389,0.388,0.386,0.375,0.36,0.39,0.394,0.396,0.398,0.4,0.402,0.405,0.407,0.408,0.41,0.407,0.415,0.468,0.396,0.391,0.388,0.383,0.382,0.379,0.376,0.373,0.374,0.373,0.372,0.37,0.371,0.372,0.375,0.376,0.372,0.377,0.382,0.383,0.388,0.392,0.395,0.386,0.395,0.368,0.374,0.395,0.397,0.398,0.37,0.38,0.387,0.368,0.208]
        }
      };
      /* The visible ridge is BACKGROUND scenery. Objects land on the
         foreground GROUND PLANE in front of it — pseudo-3D: x runs
         across the screen, "z" runs into the scene from the screen
         bottom (near) to the ridge base (far). Each object gets its
         own depth → its own landing line; nearer objects render in
         front. Per-object floors are enforced every tick. */
      let terrainEnvKey = null;
      let dragMC = null, dragMouse = null;
      // Depth: near = big & bright, far = clearly smaller & dimmer
      function depthScale(en) {
        return (SURFACE_PROFILES[terrainEnvKey] && en.depthFrac !== undefined)
          ? (0.40 + 0.60 * en.depthFrac) : 1;
      }
      // Ridge height (screen y) of the surface art at screen x
      function ridgeYAt(x) {
        const prof = SURFACE_PROFILES[terrainEnvKey];
        if (!prof) return null;
        const imgW = Math.max(W, prof.minWidth);
        const imgH = imgW * prof.aspect;
        const left = (W - imgW) / 2;
        const top  = H - imgH;
        const pts  = prof.points;
        const fi = Math.min(pts.length - 1, Math.max(0, (x - left) / imgW * (pts.length - 1)));
        const i0 = Math.floor(fi), i1 = Math.min(pts.length - 1, i0 + 1);
        const frac = fi - i0;
        return top + (pts[i0] * (1 - frac) + pts[i1] * frac) * imgH;
      }
      // Each object's ground line follows the terrain: at its current x
      // the farthest landing line sits just below the visible ridge, the
      // nearest at the screen bottom; depthFrac picks its lane between.
      function floorYFor(en) {
        const ridge = ridgeYAt(en.body.position.x);
        if (ridge === null) return null;
        // Content zone is sacred: nothing settles behind the headline/CTA.
        // The farthest lane is the LOWER of (just below the ridge) and
        // 62% of the viewport.
        const far  = Math.max(ridge + 12, H * 0.62);
        const near = H - 6;
        return far + en.depthFrac * (near - far);
      }
      function buildTerrain(envKey) {
        terrainEnvKey = envKey;
        const hasSurface = !!SURFACE_PROFILES[envKey];
        physEntries.forEach(en => {
          if (en.depthFrac === undefined) en.depthFrac = Math.random();
          en.floorY = hasSurface ? floorYFor(en) : null;
          const el = rainImgEls[en.key];
          if (el) el.style.zIndex = en.floorY ? String(2 + Math.round(en.depthFrac * 20)) : '1';
          // Wake settled bodies so they drop onto their new floor
          if (!en.body.isStatic) {
            Body.setVelocity(en.body, { x: en.body.velocity.x, y: en.body.velocity.y - 0.4 });
          }
        });
      }
      // Impact sounds: thud for heavy things, bounce for balls
      let thudBuf = null, bounceBuf = null;
      try {
        EGAudio.loadBuffer('impact thud sound.mp3', function(b) { thudBuf = b; });
        EGAudio.loadBuffer('ball bounce.mp3', function(b) { bounceBuf = b; });
      } catch(e) {}
      const IMPACT_SOUND = {
        hammer:    () => [thudBuf, 0.9],
        steel:     () => [thudBuf, 1.15],
        DasBox:    () => [thudBuf, 0.8],
        apple:     () => [bounceBuf, 1.0],
        bouncy:    () => [bounceBuf, 1.25],
        beachball: () => [bounceBuf, 0.75],
      };
      function playImpact(en, vy) {
        const f = IMPACT_SOUND[en.mat ? matKeyOf(en) : en.key];
        if (!f) return;
        const now = performance.now();
        if (en._sndAt && now - en._sndAt < 260) return;
        en._sndAt = now;
        const [buf, rate] = f();
        EGAudio.playBuffer(buf, { rate, vol: Math.min(0.55, 0.12 + vy / 30) });
      }
      function matKeyOf(en) { return en.key.replace('mat_', ''); }

      // Per-tick enforcement of each object's own ground line
      Events.on(engine, 'afterUpdate', function() {
        // Hard wall containment for every body (fast flings can tunnel
        // through the static walls — the EG box especially)
        physEntries.forEach(en => {
          if (en.body.isStatic || en.hidden) return;
          const b = en.body;
          const halfW = (en.bw || en.dW) / 2;
          if (b.position.x < halfW) {
            Body.setPosition(b, { x: halfW, y: b.position.y });
            Body.setVelocity(b, { x: Math.abs(b.velocity.x) * 0.4, y: b.velocity.y });
          } else if (b.position.x > W - halfW) {
            Body.setPosition(b, { x: W - halfW, y: b.position.y });
            Body.setVelocity(b, { x: -Math.abs(b.velocity.x) * 0.4, y: b.velocity.y });
          }
        });
        if (!SURFACE_PROFILES[terrainEnvKey]) return;
        // Dragging across the floor changes DEPTH: while the pointer is
        // on the ground area, the grabbed object slides between lanes
        // (front to back); lifting it into the sky keeps its lane.
        if (dragMC && dragMC.body && dragMouse) {
          const den = physEntries.find(e => e.body === dragMC.body);
          if (den) {
            const px = dragMouse.position;
            const ridge = ridgeYAt(px.x);
            const farLimit = Math.max((ridge === null ? 0 : ridge) + 12, H * 0.62);
            if (ridge !== null && px.y > farLimit + 4) {
              const far = farLimit, near = H - 6;
              den.depthFrac = Math.min(1, Math.max(0, (px.y - far) / (near - far)));
            }
          }
        }
        physEntries.forEach(en => {
          if (en.depthFrac === undefined) en.depthFrac = Math.random();
          if (en.body.position.y < -H * 0.3 && window.EGGravity && EGGravity.get().g < 0.5 && EGGravity.get().g > 0.01) {
            showBigTossToast();
          }
          en.floorY = floorYFor(en);
          if (!en.floorY || en.body.isStatic) return;
          const b = en.body;
          const s = depthScale(en);
          const halfH = (en.bh || en.dH) * s / 2;
          const bottom = b.position.y + halfH;
          if (bottom > en.floorY && b.velocity.y > 0) {
            Body.setPosition(b, { x: b.position.x, y: en.floorY - halfH });
            const vy = b.velocity.y;
            if (vy > 2.2) playImpact(en, vy);
            Body.setVelocity(b, {
              x: b.velocity.x * 0.92,                        // ground friction
              y: vy > 1.4 ? -vy * (b.restitution || 0.3) : 0 // bounce or rest
            });
            Body.setAngularVelocity(b, b.angularVelocity * 0.85);
          }
        });
      });
      addEventListener('resize', () => buildTerrain(terrainEnvKey));

      /* ── Grab affordance: chalk toss-gesture cue + hover nudge ──
         The cue (chalk hand + dashed arc) rides the bouncy ball once
         it settles, until the user's first real drag ever. Hovering
         any object gives it a tiny lift so it feels alive. */
      let tossCue = null;
      let tossCueRound = true;    // eligible again on every rain drop
      function getTossCue() {
        if (tossCue) return tossCue;
        tossCue = document.createElement('div');
        tossCue.id = 'toss-cue';
        tossCue.innerHTML =
          '<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">' +
            '<path class="tc-arc" d="M14 72 C 30 18, 78 10, 108 34" fill="none"/>' +
            '<path class="tc-arrow" d="M100 24 L108 34 L95 38" fill="none"/>' +
          '</svg>' +
          '<div class="tc-hand">✋</div>';
        cv.parentElement.appendChild(tossCue);
        return tossCue;
      }
      function dismissTossCue() {
        tossCueRound = false;     // hidden until the next rain round
        if (tossCue) tossCue.classList.remove('show');
      }
      window._egDismissTossCue = dismissTossCue;

      // Hover nudge: a light lift when the pointer passes over a body
      let lastNudge = 0;
      cv.addEventListener('pointermove', function(ev) {
        const rect = cv.getBoundingClientRect();
        const px = ev.clientX - rect.left, py = ev.clientY - rect.top;
        let over = false;
        const hasLanes = !!SURFACE_PROFILES[terrainEnvKey];
        for (const en of physEntries) {
          if (en.body.isStatic || en.hidden) continue;
          const b = en.body;
          const s = depthScale(en);
          const hw = (en.bw || en.dW) * s / 2 + 14, hh = (en.bh || en.dH) * s / 2 + 14;
          if (Math.abs(px - b.position.x) < hw && Math.abs(py - b.position.y) < hh) {
            over = true;
            const now = performance.now();
            if (now - lastNudge > 300) {
              Body.setVelocity(b, { x: b.velocity.x, y: b.velocity.y - 2.4 });
              Body.setAngularVelocity(b, (Math.random() - .5) * 0.08);
              lastNudge = now;
            }
            break;
          }
        }
        // Spiral cursor (inherited from body) rules the hero; over a
        // grabbable object it hands over to the grab hand
        cv.style.cursor = over ? 'grab' : '';
      }, { passive: true });

      /* ── Environment (gravity dial) hookup ─────────────────── */
      let ceiling = null;
      function setCeiling(on) {
        // Always-on catch ceiling far above the stage: big low-gravity
        // tosses come back instead of vanishing for ages
        if (!ceiling) {
          ceiling = Bodies.rectangle(W / 2, -H * 0.95 - 40, W + 600, 80, { isStatic: true });
          World.add(world, ceiling);
        }
      }
      setCeiling(true);
      let bigTossToast = null, bigTossAt = 0;
      function showBigTossToast() {
        const now = performance.now();
        if (now - bigTossAt < 9000) return;
        bigTossAt = now;
        if (!bigTossToast) {
          bigTossToast = document.createElement('div');
          bigTossToast.className = 'mat-label';
          bigTossToast.style.fontSize = '13px';
          cv.parentElement.appendChild(bigTossToast);
        }
        const env = window.EGGravity ? EGGravity.get() : null;
        bigTossToast.textContent = env && env.key === 'moon'
          ? 'low gravity — that toss went ~6× higher than on Earth!'
          : 'low gravity — tosses fly much higher here!';
        bigTossToast.style.transform = 'translate(' + (W / 2) + 'px, 90px) translate(-50%,0)';
        bigTossToast.style.zIndex = '60';
        bigTossToast.style.opacity = '1';
        setTimeout(() => { if (bigTossToast) bigTossToast.style.opacity = '0'; }, 3200);
      }
      function applyEnv(env) {
        envBg = ENV_BG[env.key] || ENV_BG.earth;
        // Bubbles can't exist in vacuum: pop on airless worlds,
        // reappear from the top when air returns
        physEntries.forEach(en => {
          if (!en.mat || !en.mat.needsAir) return;
          if (env.air === 0 && !en.hidden) {
            en.hidden = true;
            Body.setStatic(en.body, true);
            Body.setPosition(en.body, { x: W / 2, y: -3000 });
          } else if (env.air > 0 && en.hidden) {
            en.hidden = false;
            Body.setPosition(en.body, { x: W * 0.15 + Math.random() * W * 0.7, y: -80 });
            Body.setStatic(en.body, false);
            Body.setVelocity(en.body, { x: 0, y: 0 });
          }
        });
        engine.gravity.y = 4 * env.g;
        buildTerrain(env.key);
        // Depth lanes are honest 3D: objects in different lanes must not
        // collide — and rectangle bodies around non-rectangular art
        // create invisible ledges. On surface envs, each object only
        // interacts with its own ground lane (negative group = never
        // collide with each other; walls/drag unaffected).
        const lanes = !!SURFACE_PROFILES[env.key];
        physEntries.forEach(en => { en.body.collisionFilter.group = lanes ? -2 : 0; });
        setCeiling(env.g < 0.05);
        physEntries.forEach(en => {
          en.body.frictionAir = 0.0008 + (en.baseAir || 0.015) * env.air;
          if (en.body.isStatic) return;
          // Nudge so the change is immediately visible; in freefall,
          // set everything gently adrift.
          if (env.g < 0.05) {
            Body.setVelocity(en.body, {
              x: en.body.velocity.x + (Math.random() - .5) * 2.4,
              y: en.body.velocity.y - (0.8 + Math.random() * 1.6),
            });
            Body.setAngularVelocity(en.body, (Math.random() - .5) * 0.12);
          } else {
            Body.setVelocity(en.body, {
              x: en.body.velocity.x + (Math.random() - .5) * 0.5,
              y: en.body.velocity.y - 0.5,
            });
          }
        });
      }
      if (window.EGGravity) EGGravity.onChange(function(env) {
        applyEnv(env);
        // Re-drop everything under the new gravity so the difference
        // is impossible to miss (only when the hero is on screen)
        if (window.pageYOffset < window.innerHeight * 0.8 &&
            typeof window.replayRain === 'function') {
          window.replayRain();
        }
      });

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

        dragMouse = mouse;
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
        dragMC = mc;
        Events.on(mc, 'startdrag', function() {
          if (window._egDismissTossCue) window._egDismissTossCue();
          cv.style.cursor = 'grabbing';
          const den = physEntries.find(e => e.body === mc.body);
          if (den) den._labelUntil = performance.now() + 3000;
        });
        Events.on(mc, 'enddrag', function() { cv.style.cursor = ''; });

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

        /* Stop tease the moment user first drags + play drag sound.
           The hint line itself stays visible until the visitor has
           accumulated enough real drag time AND a few separate
           grab-and-tosses to show clear intent — a single quick
           touch/swipe shouldn't make it vanish before they've even
           registered it. */
        var dragHumInterval = null;
        var heroDragAccumMs = 0;
        var heroDragStartTime = null;
        var heroDragCount = 0;
        var HERO_HINT_DISMISS_MS = 1500;
        var HERO_HINT_DISMISS_DRAGS = 3;
        Events.on(mc, 'startdrag', (e) => {
          cv.style.cursor = 'grabbing';
          teaseActive = false;
          clearTimeout(teaseTimer);
          heroDragStartTime = performance.now();
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
          // Accumulate real drag time + count; only dismiss the hint
          // once the visitor has clearly been playing with the
          // elements, not on the very first quick touch.
          if (heroDragStartTime) {
            heroDragAccumMs += performance.now() - heroDragStartTime;
            heroDragStartTime = null;
          }
          heroDragCount++;
          if (heroDragAccumMs >= HERO_HINT_DISMISS_MS && heroDragCount >= HERO_HINT_DISMISS_DRAGS && hint) {
            hint.style.opacity = '0';
            hint.classList.remove('show');
          }
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
      /* Ground shadows — light source is top-RIGHT (see the lit side
         of Earth in the surface art), so shadows sit on each object's
         own ground line, sliding LEFT and fading as the object rises. */
      const labelEls = {};
      function getLabelEl(en) {
        let lb = labelEls[en.key];
        if (!lb) {
          lb = document.createElement('div');
          lb.className = 'mat-label';
          cv.parentElement.appendChild(lb);
          labelEls[en.key] = lb;
        }
        return lb;
      }
      const shadowEls = {};
      function getShadowEl(en) {
        let sh = shadowEls[en.key];
        if (!sh) {
          sh = document.createElement('img');
          sh.className = 'eg-ground-shadow';
          sh.src = en.mat ? matSrc(en.mat) : EGAudio.url(CARDS[en.key].src);
          sh.alt = '';
          cv.parentElement.appendChild(sh);
          shadowEls[en.key] = sh;
        }
        return sh;
      }

      function drawPhysics() {
        ctx.imageSmoothingEnabled = true;
        if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
        const visibleRainEls = new Set();
        const visibleShadows = new Set();
        physEntries.forEach(en => {
          if (!imgCache[en.key] || en.hidden) return;
          const { position: p, angle: a } = en.body;
          const el = rainImgEls[en.key];
          // 2.5D: scale + dim with distance (far = deeper in the scene)
          const lanes = !!SURFACE_PROFILES[terrainEnvKey];
          const s = depthScale(en);
          const ox = (en.ox !== undefined ? en.ox : en.dW / 2) * s;
          const oy = (en.oy !== undefined ? en.oy : en.dH / 2) * s;
          if (el) {
            if (!el.src) el.src = en.mat ? matSrc(en.mat) : EGAudio.url(CARDS[en.key].src);
            visibleRainEls.add(el);
            el.style.display = 'block';
            el.style.width  = (en.dW * s) + 'px';
            el.style.height = (en.dH * s) + 'px';
            if (lanes) {
              const zi = String(2 + Math.round((en.depthFrac || 0) * 20));
              if (el.style.zIndex !== zi) el.style.zIndex = zi;
              const f = 'brightness(' + (0.58 + 0.42 * (en.depthFrac || 0)).toFixed(2) + ') saturate(' + (0.8 + 0.2 * (en.depthFrac || 0)).toFixed(2) + ')';
              if (en._f !== f) { el.style.filter = f; en._f = f; }
            } else if (en._f) {
              el.style.filter = ''; en._f = null; el.style.zIndex = '1';
            }
            // Rotate about the artwork's center (the physics body),
            // not the padded file's center.
            el.style.transformOrigin = ox + 'px ' + oy + 'px';
            el.style.transform =
              'translate(' + (p.x - ox) + 'px,' + (p.y - oy) + 'px) rotate(' + a + 'rad)';

            if (en.floorY) {
              const halfH = (en.bh || en.dH) * s / 2;
              const alt = Math.max(0, en.floorY - (p.y + halfH));
              if (en.mat && en.mat.label) {
                const lb = getLabelEl(en);
                const v = en.body.velocity;
                const settled = alt < 8 && Math.abs(v.x) + Math.abs(v.y) < 0.6 && !en.body.isStatic;
                if (en.key === 'mat_bouncy' && tossCueRound) {
                  const cue = getTossCue();
                  if (settled) {
                    cue.classList.add('show');
                    cue.style.transform = 'translate(' + (p.x - 46) + 'px,' + (p.y - en.dH * s / 2 - 92) + 'px)';
                  } else {
                    cue.classList.remove('show');
                  }
                }
                const dragging = dragMC && dragMC.body === en.body;
                const labelOk = W >= 768 || (en._labelUntil && performance.now() < en._labelUntil);
                if (dragging || (settled && labelOk)) {
                  const env = window.EGGravity ? EGGravity.get() : { air: 1 };
                  const txt = en.mat.label(env);
                  if (lb.textContent !== txt) lb.textContent = txt;
                  lb.style.opacity = '1';
                  lb.style.zIndex = String((parseInt(el.style.zIndex, 10) || 2) + 1);
                  const ly = dragging ? (p.y + (en.dH * s) / 2 + 14) : (en.floorY + 10);
                  lb.style.transform = 'translate(' + p.x + 'px,' + ly + 'px) translate(-50%,0)';
                } else {
                  lb.style.opacity = '0';
                }
              }
              if (alt < 420) {
                const sh = getShadowEl(en);
                visibleShadows.add(sh);
                // Dark at contact (vacuum shadow), fades fast with height
                const op = Math.max(0, 0.6 - alt / 300 * 0.52);
                const spread = 1 + alt / 420 * 0.35;   // grows slightly when airborne
                sh.style.display = 'block';
                sh.style.width  = (en.dW * s) + 'px';
                sh.style.height = (en.dH * s) + 'px';
                sh.style.opacity = op.toFixed(3);
                sh.style.zIndex = String(Math.max(1, (parseInt(el.style.zIndex, 10) || 2) - 1));
                sh.style.transformOrigin = ox + 'px ' + oy + 'px';
                // Project the sprite onto the ground: squash vertically,
                // keep its rotation, throw it left of the sun.
                sh.style.transform =
                  'translate(' + (p.x - ox - (en.bw || en.dW) * s * 0.06 - alt * 0.4) + 'px,' +
                  (en.floorY - oy) + 'px) scale(' + spread + ',' + (0.22 * spread) + ') rotate(' + a + 'rad)';
              }
            }
            return;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(a);
          ctx.drawImage(imgCache[en.key], -ox, -oy, en.dW, en.dH);
          ctx.restore();
        });
        Object.values(rainImgEls).forEach(el => {
          if (!visibleRainEls.has(el)) el.style.display = 'none';
        });
        Object.values(shadowEls).forEach(sh => {
          if (!visibleShadows.has(sh)) sh.style.display = 'none';
        });
        physEntries.forEach(en => {
          if (en.hidden && labelEls[en.key]) labelEls[en.key].style.opacity = '0';
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
          'text-shadow:0 0 34px rgba(170,89,200,.75),0 0 90px rgba(170,89,200,.35),2px 3px 6px rgba(0,0,0,.9);' +
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

        var r = Math.round(255 + (170 - 255) * p);
        var g = Math.round(255 + (89  - 255) * p);
        var b = Math.round(255 + (200 - 255) * p);
        clone.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';

        var a = 1 - p;
        clone.style.textShadow =
          '0 0 34px rgba(170,89,200,' + (0.75 * a) + '),' +
          '2px 3px 6px rgba(0,0,0,' + (0.9 * a) + ')';

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
      // Funnel: fires once per modal-open when the user starts typing
      if (modal && !modal._formStartArmed) {
        modal._formStartArmed = true;
        modal.addEventListener('input', function onFirstInput() {
          modal.removeEventListener('input', onFirstInput);
          if (typeof gtag === 'function') gtag('event', 'preorder_form_started', { event_category: 'funnel' });
          if (typeof fbq === 'function') fbq('trackCustom', 'PreOrderFormStarted');
        });
      }
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
      if (typeof gtag === 'function') gtag('event', 'preorder_modal_closed', { event_category: 'funnel', event_label: (name.trim() || phone.trim()) ? 'with_details' : 'empty' });
      if (typeof fbq === 'function') fbq('trackCustom', 'PreOrderAbandoned', { had_details: !!(name.trim() || phone.trim()) });
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
        gtag('event', 'begin_checkout', { value: 2499, currency: 'INR', items: [{ item_name: 'EscapeGravity Pre-Order', price: 2499, quantity: 1 }] });
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
              if (typeof gtag === 'function') {
                gtag('event', 'preorder_paid', { event_category: 'conversion' });
                gtag('event', 'purchase', { transaction_id: paymentId, value: 2499, currency: 'INR', items: [{ item_name: 'EscapeGravity Pre-Order', price: 2499, quantity: 1 }] });
                gtag('event', 'conversion', { 'send_to': 'AW-11336704198/ob8dCOfhsqAcEMbB4Z0q', 'value': 2499, 'currency': 'INR' });
              }
              if (typeof fbq === 'function') fbq('track', 'Purchase', { value: 2499, currency: 'INR', content_name: 'EscapeGravity' });
              var params = new URLSearchParams({ name: name, phone: fullNumber, address: fullAddress, payment_id: paymentId });
              // Wait for the email/sheet write to actually finish before navigating
              // away — navigating too early can abort the requests mid-flight.
              // Timeout caps the wait so a slow/blocked network can't strand the user.
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
            if (typeof gtag === 'function') gtag('event', 'payment_cancelled', { event_category: 'funnel' });
            if (typeof fbq === 'function') fbq('trackCustom', 'PaymentCancelled');
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
        if (typeof gtag === 'function') gtag('event', 'payment_failed', { event_category: 'funnel', event_label: response.error && response.error.code });
        if (typeof fbq === 'function') fbq('trackCustom', 'PaymentFailed');
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
