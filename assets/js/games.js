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

  // ── Sound effects (synth tones via EGAudio — no files needed) ────
  function playTone(freq, dur, type, vol, slide) {
    EGAudio.tone(freq, dur, { type: type, vol: vol, slide: slide });
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

// ─────────────────────────────────────────────

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
  function tone(f, d, t, v) {
    EGAudio.tone(f, d, { type: t, vol: v || 0.12 });
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

// ─────────────────────────────────────────────

(function(){
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  egRevealOnce(items, 'visible', 0.1, 0.08);
})();

// ─────────────────────────────────────────────

(function(){
  var pins = document.querySelectorAll('.more-pin');
  if (!pins.length) return;

  // Staggered reveal on scroll
  egRevealOnce(pins, 'visible', 0.1, 0.06);

  // Sound on hover/touch
  pins.forEach(function(pin) {
    pin.addEventListener('mouseenter', function() {
      window.egScrollSound(0.1);
    });
    pin.addEventListener('click', function() {
      window.egFlipSound(0.3);
    });
  });
})();

// ─────────────────────────────────────────────
