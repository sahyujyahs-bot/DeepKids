import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, person, cards } from "./flatKit";
import type { Pose } from "./flatKit";

// SOURCES OF SOUND (level 1) · set-up cards and card pictures in the flat kit.
// Sound is drawn as zigzag lines radiating from the thing that moves: big and many for loud, one tiny one for soft,
// none for a thing that sits still.

// ---------------------------------------------------------------- sound and motion marks
const zig = (c: Ctx, x: number, y: number, an: number, len: number, amp: number, w = 7, col = INK) => {
  const n = Math.max(3, Math.round(len / (amp * 1.3))), pts: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * len, off = i === 0 || i === n ? 0 : i % 2 ? amp : -amp;
    pts.push([x + Math.cos(an) * t - Math.sin(an) * off, y + Math.sin(an) * t + Math.cos(an) * off]);
  }
  line(c, pts, w, col);
};
// zigzags radiating from (x, y), starting r away; sides 1 = right only, -1 = left only, 0 = both
const burst = (c: Ctx, x: number, y: number, r: number, len: number, amp: number, w: number, n: number, sides = 0, tilt = 0) => {
  for (const s of sides === 0 ? [-1, 1] : [sides])
    for (let i = 0; i < n; i++) {
      const an = (n === 1 ? 0 : -0.65 + (1.3 * i) / (n - 1)) + tilt, a = s === 1 ? an : Math.PI - an;
      zig(c, x + Math.cos(a) * r, y + Math.sin(a) * r, a, len, amp, w);
    }
};
const loud = (c: Ctx, x: number, y: number, r: number, sides = 0, tilt = 0) => burst(c, x, y, r, 120, 16, 8, 3, sides, tilt);
const soft = (c: Ctx, x: number, y: number, r: number, sides = 0, tilt = 0) => burst(c, x, y, r, 42, 6, 5, 1, sides, tilt);
// short arcs either side of a shaken thing (rx, ry its half size)
const shakeMarks = (c: Ctx, x: number, y: number, rx: number, ry: number, big = true) => {
  for (const s of [-1, 1])
    for (let k = 0; k < (big ? 2 : 1); k++) {
      const a0 = s === 1 ? -0.4 : Math.PI - 0.4;
      c.beginPath(); c.ellipse(x, y, rx + 24 + k * 22, ry + 24 + k * 22, 0, a0, a0 + 0.8); c.strokeStyle = INK; c.lineWidth = big ? 7 : 5; c.lineCap = "round"; c.stroke();
    }
};
// a dashed fall line straight down from (x, y0) to y1
const fallLine = (c: Ctx, x: number, y0: number, y1: number) => {
  c.save(); c.setLineDash([16, 14]); line(c, [[x, y0], [x, y1 - 30]], 6, RED); c.restore();
  line(c, [[x - 18, y1 - 50], [x, y1 - 28], [x + 18, y1 - 50]], 6, RED);
};
// lines around a foot that just stamped
const stampMarks = (c: Ctx, x: number, y: number, big = true) => {
  const l = big ? 34 : 18;
  for (const [dx, dy] of [[-1, -0.3], [-0.8, -0.9], [1, -0.3], [0.8, -0.9]]) line(c, [[x + dx * 36, y + dy * 10 - 4], [x + dx * (36 + l), y + dy * (10 + l) - 4]], big ? 6 : 4);
};

// ---------------------------------------------------------------- rooms and surfaces
// a tiled floor from the wall line y down; feet and far things sit lower or higher on it
const floor = (c: Ctx, y: number) => {
  c.fillStyle = "#e4d7bc"; c.fillRect(0, y, D, D - y);
  c.strokeStyle = INK; c.globalAlpha = 0.14; c.lineWidth = 3;
  for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(0, y + ((D - y) * i) / 5); c.lineTo(D, y + ((D - y) * i) / 5); c.stroke(); }
  for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo((D * i) / 5, y); c.lineTo((D * i) / 5, D); c.stroke(); }
  c.globalAlpha = 1; line(c, [[0, y], [D, y]], 5);
};
// a wooden table top seen a little from above: back edge at yb, front edge at yf
const tableTop = (c: Ctx, x0: number, x1: number, yb: number, yf: number) => {
  shape(c, () => polyP(c, [[x0 + 70, yb], [x1 - 70, yb], [x1, yf], [x0, yf]]), COL.wood);
  shape(c, () => polyP(c, [[x0, yf], [x1, yf], [x1, yf + 34], [x0, yf + 34]]), COL.woodDk);
};
const mat = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.red);
  c.beginPath(); ell(c, x, y, rx - 26, ry - 16); c.strokeStyle = COL.yellow; c.lineWidth = 7; c.stroke();
};

// ---------------------------------------------------------------- things
type Fill = "chana" | "rice" | "cotton" | "empty";
const CHANA = "#d3a362", CHANA_DK = "#a37338", RICE = "#fbf7ea", PLASTIC = "#e6eff8";
const chanaDot = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.9), CHANA, Math.max(2.5, r * 0.3)); shape(c, () => ell(c, x + r * 0.25, y + r * 0.25, r * 0.4, r * 0.3), CHANA_DK, 0); };
const riceGrain = (c: Ctx, x: number, y: number, r: number, rot: number) => shape(c, () => ell(c, x, y, r, r * 0.45, rot), RICE, 2.5);
const cottonBall = (c: Ctx, x: number, y: number, r: number, seedN: number) => {
  const g = rnd(seedN);
  shape(c, () => { for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; c.moveTo(x + Math.cos(a) * r * 0.55 + r * 0.5, y + Math.sin(a) * r * 0.55); c.arc(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5 + g() * r * 0.1, 0, Math.PI * 2); } }, WHITE, 4);
  shape(c, () => ell(c, x, y, r * 0.6, r * 0.6), WHITE, 0);
};
// a small plastic bottle, bottom centre (x, y); what is inside sits in a heap, or flies about when shaken
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill: Fill, o: { cap?: boolean; shake?: boolean; label?: boolean } = {}) => {
  const bh = h * 0.7, nh = h * 0.12, ch = h * 0.1, r = w * 0.2, body = () => rrect(c, x - w / 2, y - bh, w, bh, r);
  shadow(c, x + w * 0.1, y + 4, w * 0.6, w * 0.12);
  shape(c, () => rrect(c, x - w * 0.24, y - bh - nh, w * 0.48, nh + r, 6), PLASTIC, 6);
  if (o.cap !== false) { const cap = () => rrect(c, x - w * 0.3, y - bh - nh - ch, w * 0.6, ch + 4, 6); shape(c, cap, COL.blue); shade(c, cap, COL.blueDk, w * 0.2, 0); }
  shape(c, body, PLASTIC, 0);
  c.save(); c.beginPath(); body(); c.clip();
  const g = rnd(Math.round(x) * 7 + fill.length), top = o.shake ? y - bh + w * 0.2 : y - bh * 0.4;
  if (fill === "chana") for (let i = 0; i < (o.shake ? 16 : 22); i++) chanaDot(c, x - w * 0.4 + g() * w * 0.8, top + g() * (y - w * 0.12 - top), w * 0.085);
  if (fill === "rice") for (let i = 0; i < (o.shake ? 40 : 90); i++) riceGrain(c, x - w * 0.42 + g() * w * 0.84, top + g() * (y - w * 0.08 - top), w * 0.055, g() * 3);
  if (fill === "cotton") { cottonBall(c, x - w * 0.12, y - w * 0.4, w * 0.34, 3); cottonBall(c, x + w * 0.14, y - w * 0.95, w * 0.32, 5); }
  c.restore();
  shape(c, body, "rgba(214,236,250,0.3)", 6);
  shine(c, [[x - w * 0.32, y - bh * 0.88], [x - w * 0.32, y - bh * 0.45]], 7);
  if (o.label) {
    const lw = w * 0.62, lh = w * 0.5, lx = x - lw / 2, ly = y - bh * 0.95;
    shape(c, () => rrect(c, lx, ly, lw, lh, 5), COL.paper, 4);
    shape(c, () => rrect(c, x - w * 0.12, ly - 8, w * 0.24, 16, 3), "rgba(255,211,77,0.85)", 0);
    const cx = x, cy = ly + lh * 0.55;
    if (fill === "chana") chanaDot(c, cx, cy, lh * 0.26);
    if (fill === "rice") riceGrain(c, cx, cy, lh * 0.3, -0.5);
    if (fill === "cotton") cottonBall(c, cx, cy, lh * 0.32, 9);
    if (fill === "empty") { c.beginPath(); ell(c, cx, cy, lh * 0.26, lh * 0.26); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  }
};
// a steel spoon: handle end at (x, y), bowl len along angle an
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, wood = false) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const col = wood ? COL.wood : COL.steel, dk = wood ? COL.woodDk : COL.steelDk, hw = len * (wood ? 0.11 : 0.08);
  shape(c, () => rrect(c, 0, -hw / 2, len * 0.74, hw, hw / 2), col, 5);
  shape(c, () => ell(c, len * 0.84, 0, len * 0.18, len * 0.12), col, 5);
  shape(c, () => ell(c, len * 0.86, len * 0.015, len * 0.11, len * 0.065), dk, 0);
  c.restore();
};
const pillow = (c: Ctx, x: number, y: number, w: number, h: number, dent = false) => {
  shadow(c, x + 14, y + 10, w * 0.5, h * 0.2);
  const p = () => { c.moveTo(x - w / 2, y - h / 2); c.quadraticCurveTo(x, y - h * 0.62, x + w / 2, y - h / 2); c.quadraticCurveTo(x + w * 0.56, y, x + w / 2, y + h / 2); c.quadraticCurveTo(x, y + h * 0.62, x - w / 2, y + h / 2); c.quadraticCurveTo(x - w * 0.56, y, x - w / 2, y - h / 2); c.closePath(); };
  shape(c, p, "#e3ebf8"); shade(c, p, "#b8c7e0", w * 0.08, h * 0.1, 0.5);
  if (dent) { c.beginPath(); c.ellipse(x, y + 4, w * 0.22, h * 0.2, 0, 0, Math.PI * 2); c.strokeStyle = "#b8c7e0"; c.lineWidth = 5; c.stroke(); }
};
const towel = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 12, y + h * 0.5 + 6, w * 0.5, h * 0.12);
  const p = () => rrect(c, x - w / 2, y - h / 2, w, h, 14);
  shape(c, p, COL.pink);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = WHITE; for (let i = 0; i < 3; i++) c.fillRect(x - w / 2, y - h / 2 + h * (0.15 + i * 0.3), w, h * 0.1); c.restore();
  line(c, [[x - w / 2, y], [x + w / 2, y]], 4, "#c7708c");
};
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 12, y + h * 0.5 + 6, w * 0.5, h * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 6), "#f3f1ea");
  c.fillStyle = COL.greyDk; c.fillRect(x - w * 0.4, y - h * 0.38, w * 0.8, h * 0.12);
  for (let i = 0; i < 4; i++) line(c, [[x - w * 0.4, y - h * 0.1 + i * h * 0.13], [x + w * 0.4, y - h * 0.1 + i * h * 0.13]], 3, COL.grey);
  line(c, [[x, y - h / 2], [x, y + h / 2]], 4, COL.grey);
};
const funnel = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => polyP(c, [[x - 60 * s, y - 130 * s], [x + 60 * s, y - 130 * s], [x + 9 * s, y - 30 * s], [x + 9 * s, y], [x - 9 * s, y], [x - 9 * s, y - 30 * s]]);
  shape(c, p, COL.paper); shade(c, p, "#d9d1be", 18 * s, 0, 0.5);
  shape(c, () => ell(c, x, y - 130 * s, 60 * s, 10 * s), WHITE, 5);
};
// a bunch of keys hanging from a ring at (x, y)
const keys = (c: Ctx, x: number, y: number) => {
  for (const [a, l] of [[1.25, 70], [1.6, 82], [1.95, 68]]) {
    c.save(); c.translate(x, y + 14); c.rotate(a - Math.PI / 2);
    shape(c, () => ell(c, 0, 22, 16, 16), COL.yellow, 5);
    shape(c, () => rrect(c, -7, 30, 14, l, 4), COL.yellow, 5);
    shape(c, () => polyP(c, [[7, l + 8], [20, l + 8], [20, l + 18], [7, l + 18]]), COL.yellow, 4);
    c.restore();
  }
  c.beginPath(); ell(c, x, y, 24, 24); c.strokeStyle = INK; c.lineWidth = 12; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 5; c.stroke();
};
// a plastic bucket turned upside down, rim on the floor at (x, y)
const bucketDown = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.12);
  const p = () => polyP(c, [[x - w * 0.38, y - h], [x + w * 0.38, y - h], [x + w / 2, y], [x - w / 2, y]]);
  shape(c, p, COL.blue); shade(c, p, COL.blueDk, w * 0.2, 0);
  shape(c, () => ell(c, x, y - h, w * 0.38, w * 0.1), COL.blueDk, 6);
  shape(c, () => polyP(c, [[x - w * 0.48, y - 24], [x + w * 0.48, y - 24], [x + w / 2, y], [x - w / 2, y]]), COL.blueDk, 6);
  c.beginPath(); c.arc(x + w * 0.5, y - h * 0.55, h * 0.3, -1.2, 1.2); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.42, y], [x - w * 0.42, y]]);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.14), COL.steelIn, 5);
};
const cloud = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { for (const [dx, dy, r] of [[-1.1, 0.1, 0.7], [-0.3, -0.45, 0.9], [0.6, -0.2, 0.8], [1.2, 0.25, 0.6], [0, 0.35, 0.7]]) { c.moveTo(x + (dx + r) * s, y + dy * s); c.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); } }, "#cfd6e2", 6);
const rain = (c: Ctx, x0: number, x1: number, y0: number, y1: number, seedN: number) => {
  const g = rnd(seedN);
  for (let i = 0; i < 36; i++) { const x = x0 + g() * (x1 - x0), y = y0 + g() * (y1 - y0); line(c, [[x, y], [x - 8, y + 34]], 5, COL.waterDk); }
};
const ceilingFan = (c: Ctx, x: number, y: number) => {
  line(c, [[x, 0], [x, y - 20]], 10, COL.greyDk);
  for (let i = 0; i < 3; i++) { c.save(); c.translate(x, y); c.rotate((i * Math.PI * 2) / 3 + 0.3); c.scale(1, 0.45); shape(c, () => rrect(c, 30, -26, 190, 52, 22), COL.cloth, 6); c.restore(); }
  shape(c, () => ell(c, x, y, 34, 18), COL.greyDk, 6);
  shape(c, () => ell(c, x, y - 10, 20, 10), COL.grey, 4);
};

// ---------------------------------------------------------------- people: extra poses on top of person()
const headOf = (y: number, h: number, p: Pose) => { const ad = !!p.adult, head = h * (ad ? 0.115 : 0.15), hip = p.sit ? y - h * 0.07 : y - h * (ad ? 0.46 : 0.4), sh = hip - h * (ad ? 0.3 : 0.27); return { hy: sh - head * 1.12, head, sh }; };
const eyesClosed = (c: Ctx, x: number, y: number, h: number, p: Pose = {}) => {
  const { hy, head } = headOf(y, h, p), skin = p.adult ? SKIN.adult : SKIN.child;
  for (const s of [-1, 1]) {
    const ex = x + s * head * 0.38, ey = hy + head * 0.16;
    shape(c, () => ell(c, ex, ey, head * 0.21, head * 0.25), skin, 0);
    c.beginPath(); c.arc(ex, ey - head * 0.05, head * 0.14, 0.2 * Math.PI, 0.8 * Math.PI); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
  }
};
// the angle of the forearm when a hand reaches a target (the same two-bone solve as person())
const foreArm = (x: number, y: number, h: number, p: Pose, side: number, t: [number, number]) => {
  const ad = !!p.adult, hip = p.sit ? y - h * 0.07 : y - h * (ad ? 0.46 : 0.4), sh = hip - h * (ad ? 0.3 : 0.27), torsoW = h * (ad ? 0.27 : 0.25);
  const sx = x + side * torsoW * 0.42, sy = sh + h * 0.03, l1 = h * 0.17, l2 = h * 0.155, full = l1 + l2;
  const dx = t[0] - sx, dy = t[1] - sy, d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1), full * 0.999), a = Math.atan2(dy, dx);
  const th = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), ea = a + side * th;
  return Math.atan2(sy + Math.sin(a) * d - (sy + Math.sin(ea) * l1), sx + Math.cos(a) * d - (sx + Math.cos(ea) * l1));
};
// fingers wrapped round a held thing, drawn over it at the wrist point w, forearm angle an
const grip = (c: Ctx, w: [number, number], an: number, h: number, adult = false) => {
  const r = h * 0.0434, skin = adult ? SKIN.adult : SKIN.child, dk = adult ? SKIN.adultDk : SKIN.childDk;
  c.save(); c.translate(w[0], w[1]); c.rotate(an);
  shape(c, () => rrect(c, -r * 0.25, -r * 0.75, r * 1.55, r * 1.5, r * 0.4), skin, 4);
  for (let k = 1; k < 4; k++) line(c, [[-r * 0.25 + (r * 1.55 * k) / 4, -r * 0.45], [-r * 0.25 + (r * 1.55 * k) / 4, r * 0.45]], 3, dk);
  c.restore();
};
// one finger pointing on along the forearm
const pointFinger = (c: Ctx, w: [number, number], an: number, h: number) => {
  const r = h * 0.0434;
  c.save(); c.translate(w[0], w[1]); c.rotate(an);
  shape(c, () => rrect(c, r * 0.9, -r * 0.22, r * 1.5, r * 0.44, r * 0.22), SKIN.child, 4);
  c.restore();
};
// an open hand showing three fingers, in place of the mitten
const threeFingers = (c: Ctx, w: [number, number], an: number, h: number) => {
  const r = h * 0.0434;
  c.save(); c.translate(w[0], w[1]); c.rotate(an);
  shape(c, () => rrect(c, -r * 0.2, -r * 0.85, r * 1.4, r * 1.7, r * 0.4), SKIN.child, 4);
  for (const off of [-0.52, 0, 0.52]) shape(c, () => rrect(c, r * 0.9, off * r - r * 0.22, r * 1.4, r * 0.44, r * 0.22), SKIN.child, 4);
  shape(c, () => rrect(c, r * 0.1, -r * 1.35, r * 0.44, r * 0.9, r * 0.22), SKIN.child, 4);
  shape(c, () => rrect(c, r * 0.9, r * 0.72, r * 0.5, r * 0.4, r * 0.2), SKIN.child, 4);
  c.restore();
};

// ================================================================ set-up cards
// e1 · 1. Fill three bottles. Leave one empty. Close the caps.
const setupE1_0 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e4d7bc"; c.fillRect(0, 880, D, 200);
  tableTop(c, 30, 1050, 470, 850);
  const xs = [180, 420, 660, 900];
  xs.forEach((x, i) => { bottle(c, x, 590, 120, 300, "empty", { cap: false }); shape(c, () => ell(c, x + 70, 592, 30, 11), COL.blueDk, 5); shape(c, () => ell(c, x + 70, 584, 30, 11), COL.blue, 5); if (i === 0) funnel(c, x, 350, 0.75); });
  const r = rnd(4);
  bowl(c, 230, 760, 95); shape(c, () => ell(c, 230, 748, 80, 26), CHANA_DK, 0); for (let i = 0; i < 20; i++) chanaDot(c, 160 + r() * 140, 735 + r() * 26, 11);
  bowl(c, 520, 770, 95); shape(c, () => ell(c, 520, 758, 80, 26), "#e8e2cf", 0); for (let i = 0; i < 70; i++) riceGrain(c, 445 + r() * 150, 745 + r() * 28, 8, r() * 3);
  bowl(c, 810, 760, 95); cottonBall(c, 775, 735, 42, 21); cottonBall(c, 850, 740, 40, 22);
};
// e1 · 2. Listen to the shakers sitting still.
const setupE1_1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  tableTop(c, 20, 700, 560, 800);
  const fills: Fill[] = ["chana", "rice", "cotton", "empty"];
  fills.forEach((f, i) => bottle(c, 110 + i * 160, 690, 110, 280, f, { label: true }));
  const x = 880, y = 1000, h = 600;
  c.save(); c.translate(x, y); c.rotate(-0.2); c.translate(-x, -y);
  const ear: [number, number] = [x - 112, 505];
  person(c, x, y, h, { reachL: ear, armR: [Math.PI * 0.55, Math.PI * 0.5], dir: -1 });
  c.restore();
};
// e1 · 3. Shake each one five times. Listen with your eyes closed.
const setupE1_2 = (c: Ctx) => {
  ground(c); floor(c, 640);
  const gx = 270, gy = 1000, gh = 560;
  mat(c, gx + 40, gy - 6, 250, 44);
  person(c, gx, gy, gh, { sit: true, dir: 1, reachL: [gx - 120, gy - 70], reachR: [gx + 120, gy - 70] });
  eyesClosed(c, gx, gy, gh, { sit: true });
  const ax = 770, ay = 1000, ah = 820, p: Pose = { adult: true, reachL: [ax - 60, 575], reachR: [ax + 60, 575] };
  const hands = person(c, ax, ay, ah, p);
  bottle(c, ax, 690, 120, 250, "chana", { shake: true });
  grip(c, hands.handL, foreArm(ax, ay, ah, p, -1, p.reachL!), ah, true);
  grip(c, hands.handR, foreArm(ax, ay, ah, p, 1, p.reachR!), ah, true);
  // the dupatta thrown over hands and bottle
  c.globalAlpha = 0.8;
  shape(c, () => { c.moveTo(ax - 150, 470); c.quadraticCurveTo(ax, 440, ax + 150, 470); c.lineTo(ax + 175, 720); c.quadraticCurveTo(ax + 120, 690, ax + 80, 735); c.quadraticCurveTo(ax + 40, 700, ax, 740); c.quadraticCurveTo(ax - 40, 700, ax - 80, 735); c.quadraticCurveTo(ax - 120, 690, ax - 175, 720); c.closePath(); }, COL.purple);
  c.globalAlpha = 1;
  shakeMarks(c, ax, 600, 160, 120);
  for (const s of [-1, 1]) for (const a of [-0.28, 0.28]) { const an = s === 1 ? a : Math.PI - a; zig(c, ax + Math.cos(an) * 225, 600 + Math.sin(an) * 225, an, 120, 16, 8); }
};
// e1 · 4. Shake the chana bottle gently, then hard.
const girlShaking = (c: Ctx, x: number, hard: boolean) => {
  const y = 1000, h = 560, t: [number, number] = [x + 170, 600], p: Pose = { reachR: t, armL: [Math.PI * 0.56, Math.PI * 0.5] };
  const hands = person(c, x, y, h, p);
  const hx = hands.handR[0], hy = hands.handR[1];
  bottle(c, hx, hy + 100, 100, 215, "chana", { shake: true });
  grip(c, hands.handR, foreArm(x, y, h, p, 1, t), h);
  shakeMarks(c, hx, hy - 10, 50, 110, hard);
  if (hard) { burst(c, hx, hy - 10, 90, 110, 16, 8, 3, 1, -0.3); zig(c, hx - 10, hy - 140, -1.5, 110, 16, 8); } else { soft(c, hx, hy - 10, 85, 1); zig(c, hx - 5, hy - 135, -1.5, 42, 6, 5); }
};
const setupE1_3 = (c: Ctx) => {
  ground(c); floor(c, 640);
  girlShaking(c, 180, false);
  girlShaking(c, 650, true);
  arrow(c, [[470, 330], [600, 330]], RED, 10);
};
// e2 · 1. Lay out the newspaper, the towel and the pillow on the floor.
const setupE2_0 = (c: Ctx) => {
  ground(c); floor(c, 180);
  spoon(c, 90, 560, 0.35, 230);
  newspaper(c, 420, 600, 250, 190);
  towel(c, 700, 600, 240, 180);
  pillow(c, 950, 600, 230, 200);
};
// e2 · 2. Hold the spoon at your knee. Let it fall.
const setupE2_1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  const x = 500, y = 1000, h = 620, t: [number, number] = [x + 118, 782], p: Pose = { reachR: t, armL: [Math.PI * 0.56, Math.PI * 0.5] };
  const hands = person(c, x, y, h, p);
  spoon(c, hands.handR[0] + 2, hands.handR[1] - 10, Math.PI / 2, 135);
  grip(c, hands.handR, foreArm(x, y, h, p, 1, t), h);
  fallLine(c, hands.handR[0] + 2, hands.handR[1] + 150, 990);
};
// e2 · 3. Listen to each landing. Which is loud? Which is soft?
const setupE2_2 = (c: Ctx) => {
  ground(c); floor(c, 400);
  c.save(); c.setLineDash([14, 14]); line(c, [[540, 440], [540, 1040]], 4, COL.greyDk); c.restore();
  pillow(c, 275, 760, 300, 210, true);
  spoon(c, 170, 770, -0.15, 200);
  spoon(c, 690, 790, -0.12, 200);
  shadow(c, 800, 800, 120, 14);
  loud(c, 790, 760, 110, 0, -0.3);
  for (const x of [275, 790]) { c.save(); c.setLineDash([14, 14]); line(c, [[x, 470], [x, 640]], 5, RED); c.restore(); line(c, [[x - 16, 622], [x, 644], [x + 16, 622]], 5, RED); }
};

// ================================================================ card pictures
// flow.e1 · the Shaker Test: three shakers still on the table, the girl shaking the chana one
const flowE1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  tableTop(c, 20, 560, 560, 800);
  (["rice", "cotton", "empty"] as Fill[]).forEach((f, i) => bottle(c, 110 + i * 160, 690, 110, 270, f, { label: true }));
  const x = 680, y = 1000, h = 620, t: [number, number] = [x + 180, 590], p: Pose = { reachR: t, armL: [Math.PI * 0.56, Math.PI * 0.5] };
  const hands = person(c, x, y, h, p);
  const [hx, hy] = hands.handR;
  bottle(c, hx, hy + 100, 100, 220, "chana", { shake: true });
  grip(c, hands.handR, foreArm(x, y, h, p, 1, t), h);
  shakeMarks(c, hx, hy - 10, 50, 112, true);
  burst(c, hx, hy - 10, 85, 90, 14, 8, 3, 1, -0.3);
  zig(c, hx - 10, hy - 145, -1.5, 110, 16, 8);
};
// flow.e2 · Soft Landing: the spoon just let go, falling to the bare floor; the other landings in a row
const flowE2 = (c: Ctx) => {
  ground(c); floor(c, 560);
  const x = 280, y = 1000, h = 620, t: [number, number] = [x + 118, 770], p: Pose = { reachR: t, armL: [Math.PI * 0.56, Math.PI * 0.5] };
  const hands = person(c, x, y, h, p);
  const sx = hands.handR[0] + 10;
  spoon(c, sx, 805, Math.PI / 2, 100);
  fallLine(c, sx, 915, 992);
  newspaper(c, 560, 860, 190, 130);
  towel(c, 770, 860, 180, 130);
  pillow(c, 960, 860, 180, 140);
};
// flow.a1 · One Minute of Listening: both on the mat with eyes closed, the child counting three sounds
const flowA1 = (c: Ctx) => {
  ground(c); floor(c, 620);
  ceilingFan(c, 540, 150); soft(c, 540, 150, 230, 0, 0);
  mat(c, 540, 985, 470, 56);
  const ax = 340, ay = 1000, ah = 700, pa: Pose = { adult: true, sit: true, dir: 1, reachL: [ax - 145, ay - 55], reachR: [ax + 145, ay - 55] };
  person(c, ax, ay, ah, pa); eyesClosed(c, ax, ay, ah, pa);
  const kx = 760, ky = 1000, kh = 560, t: [number, number] = [kx + 150, ky - 300], pk: Pose = { sit: true, dir: -1, reachL: [kx - 125, ky - 55], reachR: t };
  const hands = person(c, kx, ky, kh, pk); eyesClosed(c, kx, ky, kh, pk);
  threeFingers(c, hands.handR, foreArm(kx, ky, kh, pk, 1, t), kh);
};
// flow.a2 · My Body Band: a clap, a stamp, knees patted
const flowA2 = (c: Ctx) => {
  ground(c); floor(c, 620);
  mat(c, 540, 990, 520, 52);
  const gx = 190, gy = 1000, gh = 560;
  const g = person(c, gx, gy, gh, { reachL: [gx - 12, 700], reachR: [gx + 12, 700] });
  loud(c, (g.handL[0] + g.handR[0]) / 2, 700, 55, 0, 0);
  const bx = 540, by = 1000, bh = 560;
  person(c, bx, by, bh, { armL: [Math.PI * 0.6, Math.PI * 0.7], armR: [Math.PI * 0.4, Math.PI * 0.3] });
  stampMarks(c, bx + bh * 0.075, by, true);
  burst(c, bx + 60, by - 20, 50, 90, 14, 8, 3, 1, -1.0);
  const ax = 850, ay = 1000, ah = 660, pa: Pose = { adult: true, sit: true, dir: -1, reachL: [ax - 135, ay - 55], reachR: [ax + 135, ay - 55] };
  const a = person(c, ax, ay, ah, pa);
  soft(c, a.handL[0], a.handL[1] - 10, 40, -1, 0.8); soft(c, a.handR[0], a.handR[1] - 10, 40, 1, -0.8);
};
// flow.a4 · Sound Scavenger Hunt: the girl at the balcony door points at the rain; the mixie inside
const flowA4 = (c: Ctx) => {
  ground(c); floor(c, 720);
  // the open balcony door
  shape(c, () => rrect(c, 540, 60, 500, 680, 8), COL.sky);
  rain(c, 560, 1020, 150, 560, 8);
  cloud(c, 800, 170, 70);
  for (let i = 0; i < 9; i++) line(c, [[575 + i * 54, 500], [575 + i * 54, 740]], 8, COL.steelDk);
  line(c, [[550, 500], [1030, 500]], 12, COL.steelDk);
  // a shelf inside with the mixie
  shape(c, () => rrect(c, 60, 430, 320, 22, 4), COL.woodDk, 5);
  shape(c, () => rrect(c, 180, 350, 120, 80, 10), COL.greyDk); shape(c, () => ell(c, 265, 400, 12, 12), COL.red, 4);
  shape(c, () => polyP(c, [[195, 350], [285, 350], [275, 230], [205, 230]]), "rgba(214,236,250,0.8)", 6);
  shape(c, () => rrect(c, 198, 212, 84, 22, 6), COL.greyDk, 5);
  // the girl pointing at the cloud
  const x = 420, y = 1000, h = 620, sx = x + 65, sy = 604, dx = 800 - sx, dy = 200 - sy, d = Math.hypot(dx, dy);
  const t: [number, number] = [sx + (dx / d) * 190, sy + (dy / d) * 190], p: Pose = { reachR: t, armL: [Math.PI * 0.56, Math.PI * 0.5], dir: 1 };
  const hands = person(c, x, y, h, p);
  pointFinger(c, hands.handR, foreArm(x, y, h, p, 1, t), h);
};
// flow.g1 · Sound Detective: the girl sits with her eyes closed; the grown-up behind her shakes the keys
const flowG1 = (c: Ctx) => {
  ground(c); floor(c, 600);
  const ax = 760, ay = 905, ah = 760, t: [number, number] = [ax - 200, 500], pa: Pose = { adult: true, reachL: t, armR: [Math.PI * 0.55, Math.PI * 0.5] };
  const a = person(c, ax, ay, ah, pa);
  keys(c, a.handL[0] - 14, a.handL[1] + 22);
  grip(c, a.handL, foreArm(ax, ay, ah, pa, -1, t), ah, true);
  shakeMarks(c, a.handL[0] - 14, a.handL[1] + 60, 40, 60, true);
  loud(c, a.handL[0] - 14, a.handL[1] + 50, 110, -1, 0.3);
  mat(c, 360, 992, 250, 42);
  const gx = 360, gy = 1000, gh = 560, pg: Pose = { sit: true, dir: 1, reachL: [gx - 120, gy - 70], reachR: [gx + 120, gy - 70] };
  person(c, gx, gy, gh, pg); eyesClosed(c, gx, gy, gh, pg);
};
// flow.g2 · Stamp, Tiptoe, Freeze: the grown-up beats the upside-down bucket; two children stamp
const flowG2 = (c: Ctx) => {
  ground(c); floor(c, 620);
  const ax = 220, ay = 1000, ah = 780, t: [number, number] = [ax + 178, 600], pa: Pose = { adult: true, reachR: t, armL: [Math.PI * 0.56, Math.PI * 0.5] };
  bucketDown(c, 470, 1000, 220, 230);
  const a = person(c, ax, ay, ah, pa);
  const [hx, hy] = a.handR, an = Math.atan2(770 - hy, 470 - hx);
  spoon(c, hx, hy, an, 180, true);
  grip(c, a.handR, foreArm(ax, ay, ah, pa, 1, t), ah, true);
  c.beginPath(); c.arc(hx + 30, hy - 40, 90, -2.3, -1.0); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  burst(c, 470, 770, 50, 90, 14, 8, 3, 1, -1.0);
  for (const [x, flip] of [[720, 1], [930, -1]]) {
    person(c, x, 1000, 540, { armL: [Math.PI * 0.6, Math.PI * 0.56], armR: [Math.PI * 0.4, Math.PI * 0.44] });
    stampMarks(c, x + flip * 540 * 0.075, 1000, true);
  }
};
// flow.p1 · My Loud and Soft Sound Book: a bus horn on the loud page, a ticking clock on the soft page
const flowP1 = (c: Ctx) => {
  ground(c); tableTop(c, 0, 1080, 140, 1080);
  shadow(c, 560, 830, 470, 40);
  for (const s of [-1, 1]) {
    const p = () => { c.moveTo(540, 300); c.lineTo(540 + s * 440, 270); c.lineTo(540 + s * 440, 790); c.lineTo(540, 820); c.closePath(); };
    shape(c, p, COL.paper); shade(c, p, "#e8e0cc", s * 20, 0, 0.35);
  }
  line(c, [[540, 300], [540, 820]], 6);
  // the bus, drawn like a child draws it
  shape(c, () => rrect(c, 180, 480, 250, 130, 18), COL.yellow, 5);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 200 + i * 74, 500, 56, 48, 6), COL.sky, 4);
  for (const wx of [240, 370]) shape(c, () => ell(c, wx, 615, 28, 28), COL.black, 5);
  loud(c, 305, 545, 150, 1, 0);
  // the clock
  shape(c, () => ell(c, 790, 545, 70, 70), WHITE, 5);
  for (let i = 0; i < 12; i++) line(c, [[790 + Math.cos((i / 6) * Math.PI) * 58, 545 + Math.sin((i / 6) * Math.PI) * 58], [790 + Math.cos((i / 6) * Math.PI) * 50, 545 + Math.sin((i / 6) * Math.PI) * 50]], 3);
  line(c, [[790, 545], [790, 505]], 5); line(c, [[790, 545], [818, 560]], 5);
  soft(c, 790, 545, 85, 1, 0);
  // crayons at the front
  for (const [x, col, a] of [[300, COL.red, 0.1], [520, COL.green, -0.05], [760, COL.blue, 0.12]] as [number, string, number][]) {
    c.save(); c.translate(x, 930); c.rotate(a); shape(c, () => rrect(c, -90, -14, 160, 28, 6), col, 5); shape(c, () => polyP(c, [[70, -14], [100, 0], [70, 14]]), col, 5); c.restore();
  }
};
// flow.c1 · Don't Wake the Baby: steel on a towel on a tray, the baby asleep in the next room
const flowC1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  // the doorway to the next room, the cradle in it
  shape(c, () => rrect(c, 700, 120, 340, 540, 6), "#d9c9b0", 7);
  const cx = 870, cy = 640;
  shape(c, () => { c.moveTo(cx - 130, cy - 180); c.quadraticCurveTo(cx - 140, cy - 20, cx, cy - 20); c.quadraticCurveTo(cx + 140, cy - 20, cx + 130, cy - 180); c.closePath(); }, COL.wood);
  c.beginPath(); c.arc(cx, cy - 170, 170, 0.35, Math.PI - 0.35); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  shape(c, () => ell(c, cx + 20, cy - 150, 95, 34), COL.teal, 5);
  shape(c, () => ell(c, cx - 75, cy - 165, 30, 30), SKIN.child, 4);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(cx - 75 + s * 11, cy - 168, 6, 0.2 * Math.PI, 0.8 * Math.PI); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); }
  // the girl carrying the tray
  const x = 380, y = 1000, h = 620, p: Pose = { reachL: [x - 112, 735], reachR: [x + 112, 735] };
  const hands = person(c, x, y, h, p);
  shape(c, () => rrect(c, x - 185, 710, 370, 34, 8), COL.steel, 6);
  shape(c, () => rrect(c, x - 165, 690, 330, 24, 8), COL.pink, 5);
  for (const tx of [x - 115, x - 35, x + 45]) tumbler(c, tx, 692, 58, 92);
  shape(c, () => ell(c, x + 130, 692, 44, 14), COL.steel, 5); shape(c, () => ell(c, x + 130, 690, 34, 9), COL.steelIn, 3);
  grip(c, hands.handL, foreArm(x, y, h, p, -1, p.reachL!), h);
  grip(c, hands.handR, foreArm(x, y, h, p, 1, p.reachR!), h);
};
// term.1 · Sound source: the pressure cooker whistles
const term1 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 850;
  // the stove
  shape(c, () => rrect(c, x - 360, y - 10, 720, 110, 16), COL.black);
  shape(c, () => ell(c, x, y, 170, 30), COL.greyDk, 6); shape(c, () => ell(c, x, y, 120, 20), COL.black, 5);
  for (let i = -2; i <= 2; i++) shape(c, () => { const fx = x + i * 60; c.moveTo(fx - 16, y - 2); c.quadraticCurveTo(fx, y - 60, fx + 16, y - 2); c.closePath(); }, COL.blue, 4);
  // the cooker
  const body = () => rrect(c, x - 200, y - 360, 400, 330, 36);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 90, 0);
  shape(c, () => rrect(c, x - 215, y - 372, 430, 40, 14), COL.steelDk, 6);
  shape(c, () => ell(c, x, y - 372, 215, 30), COL.steelIn, 6);
  shape(c, () => rrect(c, x + 195, y - 318, 190, 34, 16), COL.black, 6);
  shape(c, () => rrect(c, x - 265, y - 318, 80, 34, 16), COL.black, 6);
  shape(c, () => rrect(c, x - 24, y - 430, 48, 50, 8), COL.black, 6);
  shape(c, () => ell(c, x, y - 430, 30, 10), COL.greyDk, 5);
  // steam
  for (const [dx, dy, r] of [[10, -500, 36], [-20, -560, 46], [30, -640, 58], [-10, -720, 72]]) shape(c, () => ell(c, x + dx, y + dy, r, r * 0.85), WHITE, 6);
  loud(c, x, y - 640, 110, 0, 0);
};

export const ic_soundSourcesOfSoundL1 = cards("sci.sound.sources-of-sound.L1", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE2_0, setupE2_1, setupE2_2,
  flowE1, flowE2, flowA1, flowA2, flowA4, flowG1, flowG2, flowP1, flowC1, term1,
]);
