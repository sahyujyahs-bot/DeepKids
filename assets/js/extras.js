(function(){
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

// ─────────────────────────────────────────────

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
    window.egFlipSound(0.35);
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

// ─────────────────────────────────────────────

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
      window.egFlipSound(0.4);
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

// ─────────────────────────────────────────────

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
    window.egFlipSound(vol || 0.3);
  }
  function playScrollSound(vol) {
    window.egScrollSound(vol || 0.15);
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

// ─────────────────────────────────────────────

// Disable right-click context menu (deterrent only — does not hide source code)
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
