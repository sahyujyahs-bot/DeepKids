/* Shared pieces of UI: icons, the blob friends, pills, sounds, toasts, little celebrations */
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fh = (h) => (Math.round(h * 4) / 4).toString();
const mins = (h) => {
  const m = Math.round(h * 60);
  return m >= 60 ? `${fh(m / 60)} h` : `${m} min`;
};
let AC = null,
  soundOn = true;
function tone(f, t0, d, type = "sine", g = 0.12) {
  const o = AC.createOscillator(),
    v = AC.createGain(),
    t = AC.currentTime + t0;
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  v.gain.setValueAtTime(0, t);
  v.gain.linearRampToValueAtTime(g, t + 0.01);
  v.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(v).connect(AC.destination);
  o.start(t);
  o.stop(t + d + 0.02);
}
const SFX = {
  tap: () => tone(660, 0, 0.07, "triangle", 0.08),
  tick: () => {
    tone(784, 0, 0.08);
    tone(1046, 0.07, 0.12);
  },
  ok: () => {
    tone(523, 0, 0.1);
    tone(659, 0.09, 0.1);
    tone(784, 0.18, 0.18);
  },
  no: () => {
    tone(220, 0, 0.18, "square", 0.05);
    tone(180, 0.12, 0.2, "square", 0.05);
  },
  flip: () => {
    tone(400, 0, 0.06, "triangle", 0.06);
    tone(600, 0.05, 0.08, "triangle", 0.06);
  },
  win: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.08, 0.22, "triangle", 0.1)),
  key: () => tone(900, 0, 0.03, "square", 0.03),
};
function sfx(k) {
  if (!soundOn || !SFX[k]) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    SFX[k]();
  } catch (e) {}
}
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.className = "confetti";
  c.width = innerWidth;
  c.height = innerHeight;
  document.body.appendChild(c);
  const x = c.getContext("2d");
  const cols = ["#F2603F", "#FFB21E", "#38A862", "#3E86F5", "#8C5CF0", "#F06BA8"];
  const P = Array.from({ length: 90 }, () => ({
    x: innerWidth / 2,
    y: innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 14 - 4,
    r: Math.random() * 6 + 4,
    c: cols[(Math.random() * 6) | 0],
    a: Math.random() * 6,
  }));
  let n = 0;
  (function f() {
    x.clearRect(0, 0, c.width, c.height);
    P.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.a += 0.2;
      x.save();
      x.translate(p.x, p.y);
      x.rotate(p.a);
      x.fillStyle = p.c;
      x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      x.restore();
    });
    if (++n < 80) requestAnimationFrame(f);
    else c.remove();
  })();
}
function toast(m, ms) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = m;
  // inside the open dialog on top (a sheet, the chat, a unit), or the message would be hidden behind it
  ([...document.querySelectorAll("dialog[open]")].pop() || document.body).appendChild(t);
  setTimeout(() => t.remove(), ms || Math.max(2200, m.length * 60));
}
const IC = {
  grid: '<rect x="4" y="4" width="7" height="7" rx="2.5"/><rect x="13" y="4" width="7" height="7" rx="2.5"/><rect x="4" y="13" width="7" height="7" rx="2.5"/><circle cx="16.5" cy="16.5" r="3.5"/>',
  today:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  week: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M16 14h.5"/>',
  library: '<path d="M4 4.5h4.5v15H4zM10 4.5h4.5v15H10zM16 5.5l3.8-1 3 14.2-3.8 1z" transform="translate(-1 0)"/>',
  tasks:
    '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="M3.5 6.5l1.6 1.6 2.7-2.9M3.5 12l1.6 1.6 2.7-2.9M3.5 17.5l1.6 1.6 2.7-2.9"/>',
  journey: '<path d="M3 20l6.5-11 4.5 7 2.5-3.5L21 20z"/><path d="M9.5 9V3.5l4 1.5-4 1.5"/>',
  read: '<path d="M3.5 5.5c0-.8.7-1.5 1.5-1.5h6v16H5a1.5 1.5 0 0 1-1.5-1.5zM20.5 5.5c0-.8-.7-1.5-1.5-1.5h-6v16h6c.8 0 1.5-.7 1.5-1.5z"/>',
  learn:
    '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  ws: '<path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/>',
  exp: '<path d="M9 3h6M10 3v6l-5.2 9.1A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.9L14 9V3M7.2 15h9.6"/>',
  act: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  game: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01" stroke-width="3"/>',
  proj: '<path d="M14 3.5l6.5 6.5-3 3L11 6.5zM11.5 7l-8 8 4 4 8-8"/>',
  prep: '<path d="M9 3.5h6v3H9zM7 5H5v16h14V5h-2M8.5 13l2.5 2.5 4.5-5"/>',
  event: '<path d="M5 21V4h11.5l-2.2 4 2.2 4H5"/>',
  warm: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" stroke-width="2.2"/>',
  brk: '<path d="M5 9h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2 2 0 0 1 0 4H16M8.5 3.5v2.5M12 3.5v2.5"/>',
  exps: '<path d="M12 21v-8M12 13c0-4-3-6.5-7.5-6.5 0 4.2 3 6.5 7.5 6.5zM12 11c0-3.5 2.4-6.5 7-6.5 0 3.5-2.4 6.5-7 6.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.4"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  sound: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM17 9.5l4.5 5M21.5 9.5L17 14.5"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13" stroke-width="2.4"/>',
  spark: '<path d="M12 3l2.2 6.3L20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.7z"/>',
};
const icon = (n, c = "") => `<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || IC.spark}</svg>`;
const KL = {
  read: "Read together",
  learn: "Learn & think",
  ws: "Worksheet",
  exp: "Experiment",
  act: "Activity",
  game: "Game",
  proj: "Project",
  step: "Step",
};
const ROLE = { you: "For you", both: "Together", kid: "Child goes", out: "Outing", free: "Break" };
const pillS = (s) => `<span class="pill ${s}">${STATUS[s]}</span>`;
const SC = (s) => "s-" + s;
const MTIPS = [
  "Tap Start when you're both ready. No rush.",
  "Did it already? Tap the tick and choose.",
  "Busy day? Later today moves it out of the way.",
  "Photos of work go in Add photos.",
  "Tell me plans in the Planner, like a message.",
  "Small steps every day add up.",
  "Need a break? That's part of learning too.",
];
function streak() {
  const ds = new Set(S.log.filter((l) => l.kind !== "skipped").map((l) => l.date));
  let n = 0,
    d = ds.has(today) ? today : addDays(today, -1);
  while (ds.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}
function dayRing() {
  const it = dayPlan(today).filter((i) => i.kind !== "brk" && OURS(i)),
    n = it.length,
    dn = it.filter((i) => i.done).length;
  if (!n) return "";
  const C = 2 * Math.PI * 16,
    p = dn / n,
    prev = ui.ringP ?? p;
  ui.ringP = p;
  setTimeout(animRings, 40);
  if (p === 1 && prev < 1 && Date.now() - lastTap < 5000 && !(S.cel || {})[today]) {
    S.cel = { [today]: 1 };
    setTimeout(() => {
      sfx("win");
      confetti();
      toast(`All done for today! ${S.child || ""} did great.`.replace(" !", "!"));
    }, 500);
    setTimeout(save, 0);
  }
  return `<span class="dring ${p === 1 ? "full" : ""}" title="${dn} of ${n} DeepKids items done today"><svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" class="rbg"/><circle cx="20" cy="20" r="16" class="rfg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - prev)}" data-to="${C * (1 - p)}"/></svg><b>${p === 1 ? "✓" : dn + "/" + n}</b></span>`;
}
function animRings() {
  document.querySelectorAll(".dring .rfg[data-to]").forEach((c) => {
    c.style.strokeDashoffset = c.dataset.to;
  });
}
const CHEER = ["Nice!", "Shabash!", "Well done!", "Lovely!", "One more done!", "Super!"];
function burst(x, y, txt) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const e = document.createElement("div");
  e.className = "burst";
  e.textContent = txt;
  e.style.left = x + "px";
  e.style.top = y + "px";
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 900);
}
function keepInputs(root) {
  const o = {};
  root.querySelectorAll("input[id],textarea[id],select[id]").forEach((e) => {
    if (e.dataset.dirty && e.type !== "file") o[e.id] = e.type === "checkbox" ? e.checked : e.value;
  });
  const a = document.activeElement;
  return {
    o,
    focus: a && root.contains(a) && a.id ? a.id : null,
    sel: a && typeof a.selectionStart === "number" ? a.selectionStart : null,
  };
}
function restoreInputs(root, k) {
  Object.entries(k.o).forEach(([id, v]) => {
    const e = root.querySelector("#" + CSS.escape(id));
    if (!e) return;
    if (e.type === "checkbox") e.checked = v;
    else e.value = v;
    e.dataset.dirty = "1";
  });
  if (k.focus) {
    const e = root.querySelector("#" + CSS.escape(k.focus));
    if (e && document.activeElement !== e) {
      e.focus({ preventScroll: true });
      try {
        if (k.sel != null) e.setSelectionRange(k.sel, k.sel);
      } catch (x) {}
    }
  }
}
function clearIn(id) {
  document.querySelectorAll("#" + CSS.escape(id)).forEach((e) => {
    e.value = "";
    delete e.dataset.dirty;
  });
}
function rng(seed) {
  let s = (seed * 9973) % 233280 || 7;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
function blobD(seed, cx = 50, cy = 56, r = 37, n = 7) {
  const R = rng(seed),
    P = [...Array(n)].map((_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2,
        k = 0.86 + R() * 0.26;
      return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
    });
  const f = (v) => v.toFixed(1);
  let d = `M${f(P[0][0])},${f(P[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n],
      p1 = P[i],
      p2 = P[(i + 1) % n],
      p3 = P[(i + 2) % n];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}
function blob(col, seed = 1, mood = "happy", cls = "bl", attrs = "") {
  const k = "#2B2340";
  const eyes =
    mood === "sleepy"
      ? `<path d="M35 52q6 5 12 0M53 52q6 5 12 0" stroke="${k}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="41" cy="51" rx="4.3" ry="5.4" fill="${k}"/><ellipse cx="59" cy="51" rx="4.3" ry="5.4" fill="${k}"/><circle cx="42.5" cy="48.8" r="1.6" fill="#fff"/><circle cx="60.5" cy="48.8" r="1.6" fill="#fff"/>`;
  const mouth =
    mood === "wow"
      ? `<ellipse cx="50" cy="64" rx="4" ry="5" fill="${k}"/>`
      : mood === "calm"
        ? `<path d="M45 63h10" stroke="${k}" stroke-width="3.4" stroke-linecap="round"/>`
        : `<path d="M43 61q7 7.5 14 0" stroke="${k}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  return `<svg class="${cls}" ${attrs} viewBox="0 0 100 100" aria-hidden="true"><path d="${blobD(seed)}" fill="${col}"/><circle cx="32" cy="61" r="4.6" fill="#FF6F9F" opacity=".45"/><circle cx="68" cy="61" r="4.6" fill="#FF6F9F" opacity=".45"/>${eyes}${mouth}</svg>`;
}
const PAL = ["var(--aqua)", "var(--gum)", "var(--sun)", "var(--pist)", "var(--peri)", "var(--tang)", "var(--sky)"];
const SUBJ_BLOB = {
  math: ["var(--aqua)", 3],
  eng: ["var(--gum)", 7],
  hin: ["var(--tang)", 11],
  sci: ["var(--forest)", 5],
  wml: ["var(--sun)", 13],
  wart: ["var(--gum)", 17],
};
function sblob(s, mood = "happy", cls = "bl", attrs = "") {
  const b = SUBJ_BLOB[s] || ["var(--peri)", 2];
  return blob(b[0], b[1], mood, cls, attrs);
}
const kidBlob = (cls = "bl", mood = "happy", attrs = "") => blob("var(--sky)", 13, mood, cls, attrs);
const youBlob = (cls = "bl", mood = "happy", attrs = "") => blob("var(--peri)", 17, mood, cls, attrs);
function flower(x, y, col, i, bloomed, isNow) {
  if (!bloomed)
    return `<g class="${isNow ? "bob" : "sway"}"><path d="M${x} ${y}v-16" stroke="var(--forest)" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y - 8}q-9-2-11-10q9 0 11 8zM${x} ${y - 11}q9-3 10-11q-9 1-10 9z" fill="var(--forest)"/>${isNow ? `<path d="M${x + 13} ${y - 34}l2.2 4.4 4.4 2.2-4.4 2.2-2.2 4.4-2.2-4.4-4.4-2.2 4.4-2.2z" fill="#fff"/>` : ""}</g>`;
  const h = 34 + (i % 3) * 9,
    cy = y - h,
    pet = [0, 72, 144, 216, 288]
      .map((a) => {
        const r = (a * Math.PI) / 180,
          px = x + Math.cos(r) * 9.5,
          py = cy + Math.sin(r) * 9.5;
        return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="8" ry="6.2" transform="rotate(${a} ${px.toFixed(1)} ${py.toFixed(1)})" fill="${col}"/>`;
      })
      .join("");
  return `<g class="bloom" style="animation-delay:${(i * 0.07).toFixed(2)}s"><g class="sway" style="animation-delay:${(i * 0.3).toFixed(1)}s"><path d="M${x} ${y}V${cy}" stroke="var(--forest)" stroke-width="3.2" stroke-linecap="round"/><path d="M${x} ${y - 12}q-12-2-14-12q12 0 14 10z" fill="var(--forest)"/>${pet}<circle cx="${x}" cy="${cy}" r="7.5" fill="var(--sun)"/><circle cx="${x - 2.6}" cy="${cy - 1}" r="1.3" fill="#2B2340"/><circle cx="${x + 2.6}" cy="${cy - 1}" r="1.3" fill="#2B2340"/><path d="M${x - 2.6} ${cy + 2.2}q2.6 2.6 5.2 0" stroke="#2B2340" stroke-width="1.3" fill="none" stroke-linecap="round"/></g></g>`;
}
const KICO = {
  lesson: "read",
  prep: "prep",
  warm: "warm",
  exps: "exps",
  event: "event",
  todo: "prep",
  refresh: "game",
  plan: "week",
};
function pathMap(units, covOf) {
  const n = units.length;
  if (!n) return "";
  const step = 118,
    top = 56,
    H = top + n * step,
    xs = [50, 78, 50, 22];
  const P = units.map((u, i) => [xs[i % 4], top + i * step]);
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 1; i < n; i++)
    d += ` C${P[i - 1][0]} ${P[i - 1][1] + step * 0.55} ${P[i][0]} ${P[i][1] - step * 0.55} ${P[i][0]} ${P[i][1]}`;
  const nextI = units.findIndex((u) => rank[covOf(u)] < 2);
  const deco = units
    .map((u, i) =>
      i % 3 === 1
        ? `<div style="position:absolute;left:${100 - xs[i % 4] > 50 ? 88 : 6}%;top:${P[i][1] - 30}px;width:34px">${blob(PAL[(i + 2) % PAL.length], 40 + i, "sleepy", "", 'width="34" height="34"')}</div>`
        : "",
    )
    .join("");
  return `<div class="pathmap" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="var(--soil)" stroke-width="26" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".8"/></svg>${deco}
   ${units
     .map((u, i) => {
       const cs = covOf(u),
         ts = u.c?.x ? chapterTasks(u) : null,
         td = ts ? ts.filter((a) => taskDone(u.k, a[0])).length : 0;
       return `<button class="node ${SC(u.subj)} ${cs} ${i === nextI ? "next" : ""}" style="left:${P[i][0]}%;top:${P[i][1] + 12}px" data-act="chapter" data-k="${u.k}">${i === nextI ? kidBlob("", "happy", 'width="34" height="34" style="margin-bottom:-10px"') : ""}<span class="dot">${rank[cs] >= 2 ? `<svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#fff"/></svg>` : /^\d+$/.test(u.n) ? u.n : esc(u.n)}</span><span class="lbl">${esc(u.title)}</span><span class="sub">${ts ? `${td}/${ts.length} tasks · ` : ""}${STATUS[cs]}</span></button>`;
     })
     .join("")}</div>`;
}
