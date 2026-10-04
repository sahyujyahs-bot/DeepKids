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
  var sndCardScroll  = EGAudio.el('cardsscrollsound.mp3');
  var sndCardFlip    = EGAudio.el('cardflip sound.mp3');
  var sndDiceRoll    = EGAudio.el('dice roll sound2.mp3');
  var sndTokenMove11 = EGAudio.el('token move to tile 11.mp3');
  var sndTokenDrop   = EGAudio.el('token drops to tiles 7,3,2.mp3');
  var sndBallBounce  = EGAudio.el('ball bounce.mp3');
  var playSound = EGAudio.playEl;
  var stopSound = EGAudio.stopEl;
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
  boardImg.src = EGAudio.url('s2-board-full.webp');

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
  var spinSound = EGAudio.el('spin sound.mp3');
  function playSpinSound() { EGAudio.playEl(spinSound, 0.45); }
  function stopSpinSound() { EGAudio.stopEl(spinSound); }

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
  var tabs = document.querySelectorAll('.s2-tab[data-panel]');
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

  var CARD_BACK  = EGAudio.url('s2-card-back.webp');
  var CARD_FRONT = EGAudio.url('s2-card-front.webp');
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
  var ICON_EARTH = '<img class="s2-bubble-icon" src="' + EGAudio.url('IMG_4700.webp') + '" alt="Earth">';
  var ICON_BODY  = '<img class="s2-bubble-icon" src="' + EGAudio.url('IMG_4705.webp') + '" alt="Body">';
  var ICON_TWO   = '<img class="s2-bubble-icon s2-bubble-icon-lg" src="' + EGAudio.url('IMG_5300.webp') + '" alt="Any 2 Cards">';

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
            EGAudio.playElClone(window.sndBallBounce, 0.4, 300);
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

// ─────────────────────────────────────────────
