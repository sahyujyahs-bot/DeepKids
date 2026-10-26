/* ---------- sound: a tiny synth; the browser only allows it after a tap ---------- */
let AC = null,
  soundOn = true;
try {
  soundOn = localStorage.getItem("dk-sound") !== "off";
} catch (e) {}
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
  const sh = document.getElementById("sheet");
  (sh && sh.open ? sh : document.body).appendChild(t);
  setTimeout(() => t.remove(), ms || Math.max(2200, m.length * 60));
}
