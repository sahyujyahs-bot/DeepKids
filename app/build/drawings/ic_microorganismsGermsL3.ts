import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, glass, hand, write, cards } from "./flatKit";

// sci.microorganisms.germs.L3 picture cards. Germs: bacteria are purple rods or balls, viruses are red spiky balls.
// Friendly microbes are green. Red arrows = movement or change. No words.

const PUR = "#9a7ad1", PUR_DK = "#6f50ab", VIR = "#e8584a", VIR_DK = "#b93a2d", PAPER = "#f8f1e0", OK = "#3f9b4a", MIC = "#7bc66b", MIC_DK = "#4e9a46";
const WOOD = "#c98f55", WOOD_DK = "#a8723f";

// ---------------------------------------------------------------- pieces
const bact = (c: Ctx, x: number, y: number, len: number, wd: number, rot = 0, col = PUR, dk = PUR_DK) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -len / 2, -wd / 2, len, wd, wd / 2);
  shape(c, p, col, Math.max(3, wd * 0.1)); shade(c, p, dk, wd * 0.18, wd * 0.22, 0.5);
  c.beginPath(); ell(c, -len * 0.15, -wd * 0.12, wd * 0.09, wd * 0.09); c.fillStyle = "rgba(255,255,255,0.6)"; c.fill();
  c.restore();
};
const virus = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) {
    const an = (k / 12) * Math.PI * 2, x1 = x + Math.cos(an) * r * 0.9, y1 = y + Math.sin(an) * r * 0.9, x2 = x + Math.cos(an) * r * 1.42, y2 = y + Math.sin(an) * r * 1.42;
    line(c, [[x1, y1], [x2, y2]], Math.max(3, r * 0.12), INK);
    shape(c, () => ell(c, x2, y2, r * 0.19, r * 0.19), VIR_DK, Math.max(2, r * 0.07));
  }
  const p = () => ell(c, x, y, r, r);
  shape(c, p, VIR, Math.max(3, r * 0.1)); shade(c, p, VIR_DK, r * 0.25, r * 0.28, 0.5);
};
const germs = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, seed: number, r: number) => {
  const q = rnd(seed);
  for (let i = 0; i < n; i++) { const a = q() * 6.283, d = Math.sqrt(q()); bact(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, r * 2, r * 2); }
};
const sparkle = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => { for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 4, rr = i % 2 ? r * 0.36 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, col, Math.max(2, r * 0.12));
};
const GLIT = [COL.yellow, COL.pink, COL.teal, WHITE, COL.orange, COL.purple];
const spray = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, seed: number, r: number) => {
  const q = rnd(seed);
  for (let i = 0; i < n; i++) { const a = q() * 6.283, d = Math.sqrt(q()); sparkle(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, r * (0.75 + q() * 0.5), GLIT[i % GLIT.length]); }
};
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => { shape(c, () => ell(c, x, y, r, r), col, Math.max(2, r * 0.25)); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - 1.5 * s); c.bezierCurveTo(x + 0.4 * s, y - 0.8 * s, x + s, y - 0.4 * s, x + s, y + 0.2 * s); c.bezierCurveTo(x + s, y + 0.9 * s, x - s, y + 0.9 * s, x - s, y + 0.2 * s); c.bezierCurveTo(x - s, y - 0.4 * s, x - 0.4 * s, y - 0.8 * s, x, y - 1.5 * s); c.closePath(); }, col, Math.max(2.5, s * 0.14));
  line(c, [[x - s * 0.5, y + 0.1 * s], [x - s * 0.35, y + 0.5 * s]], Math.max(2.5, s * 0.14), WHITE);
};
const tick = (c: Ctx, x: number, y: number, s: number) => { const p = [[x - 0.5 * s, y], [x - 0.12 * s, y + 0.4 * s], [x + 0.55 * s, y - 0.45 * s]]; line(c, p, s * 0.32, INK); line(c, p, s * 0.18, OK); };
const cross = (c: Ctx, x: number, y: number, s: number) => { for (const p of [[[x - s, y - s], [x + s, y + s]], [[x + s, y - s], [x - s, y + s]]]) { line(c, p, s * 0.5, INK); line(c, p, s * 0.32, RED); } };
const dotArrow = (c: Ctx, x1: number, y1: number, x2: number, y2: number, col = RED, w = 9) => {
  const L = Math.hypot(x2 - x1, y2 - y1), an = Math.atan2(y2 - y1, x2 - x1), h = w * 3.2;
  for (let d = 0; d < L - w * 2; d += w * 2.3) { c.beginPath(); c.arc(x1 + Math.cos(an) * d, y1 + Math.sin(an) * d, w * 0.5, 0, 7); c.fillStyle = col; c.fill(); }
  line(c, [[x2 - Math.cos(an - 0.5) * h, y2 - Math.sin(an - 0.5) * h], [x2, y2], [x2 - Math.cos(an + 0.5) * h, y2 - Math.sin(an + 0.5) * h]], w, col);
};
const panel = (c: Ctx, x: number, y: number, w: number, h: number, draw: () => void, fill = PAPER) => {
  c.save(); shape(c, () => rrect(c, x, y, w, h, 28), fill, 0); c.clip(); draw(); c.restore(); shape(c, () => rrect(c, x, y, w, h, 28), "rgba(0,0,0,0)", 6);
};
// a child's (or grown-up's) round face
const face = (c: Ctx, x: number, y: number, r: number, mood: "smile" | "o" | "sad" | "flat" = "smile", girl = true, skin: string = SKIN.child) => {
  if (girl) { shape(c, () => ell(c, x - r * 1.0, y + r * 0.35, r * 0.28, r * 0.5), CLOTH.hair, 4); shape(c, () => ell(c, x + r * 1.0, y + r * 0.35, r * 0.28, r * 0.5), CLOTH.hair, 4); }
  shape(c, () => ell(c, x, y, r, r * 1.05), skin, Math.max(4, r * 0.07));
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.6, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, Math.max(3, r * 0.06));
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  c.strokeStyle = INK; c.lineWidth = Math.max(3, r * 0.055); c.lineCap = "round";
  if (mood === "o") shape(c, () => ell(c, x, y + r * 0.52, r * 0.16, r * 0.21), INK, 0);
  else { c.beginPath(); if (mood === "smile") c.arc(x, y + r * 0.35, r * 0.3, 0.2, Math.PI - 0.2); else if (mood === "sad") c.arc(x, y + r * 0.75, r * 0.26, Math.PI + 0.3, -0.3); else { c.moveTo(x - r * 0.22, y + r * 0.55); c.lineTo(x + r * 0.22, y + r * 0.55); } c.stroke(); }
};
const door = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const b = () => rrect(c, x, y, w, h, 14);
  shape(c, b, WOOD, 7); shade(c, b, WOOD_DK, w * 0.04, 0, 0.5);
  shape(c, () => rrect(c, x + w * 0.12, y + h * 0.07, w * 0.76, h * 0.38, 10), WOOD_DK, 5);
  shape(c, () => rrect(c, x + w * 0.12, y + h * 0.54, w * 0.76, h * 0.38, 10), WOOD_DK, 5);
};
const doorHandle = (c: Ctx, x: number, y: number, s: number, dir = 1) => {
  shape(c, () => rrect(c, x - 44 * s, y - 130 * s, 88 * s, 260 * s, 38 * s), COL.steel, 6);
  const len = 210 * s, x0 = dir > 0 ? x - 26 * s : x - len, p = () => rrect(c, x0, y - 24 * s, len + 26 * s, 48 * s, 24 * s);
  shadow(c, x + dir * len * 0.5 + 12 * s, y + 40 * s, len * 0.55, 8 * s);
  shape(c, p, COL.steelIn); shade(c, p, COL.steelDk, 0, 12 * s, 0.6);
  shape(c, () => ell(c, x, y, 34 * s, 34 * s), COL.steel, 6);
  shine(c, [[x0 + 30 * s, y - 10 * s], [x0 + len - 20 * s, y - 10 * s]], 7);
};
const scissors = (c: Ctx, x: number, y: number, s: number) => { // pivot at (x, y), blades point down
  for (const d of [-1, 1]) {
    shape(c, () => polyP(c, [[x - d * 8 * s, y - 6 * s], [x + d * 40 * s, y + 130 * s], [x + d * 22 * s, y + 130 * s], [x - d * 22 * s, y + 10 * s]]), COL.steel, 6);
    shape(c, () => ell(c, x - d * 38 * s, y - 80 * s, 32 * s, 40 * s), "rgba(0,0,0,0)", 0);
    c.beginPath(); ell(c, x - d * 38 * s, y - 80 * s, 28 * s, 38 * s); c.lineWidth = 16 * s; c.strokeStyle = INK; c.stroke(); c.lineWidth = 9 * s; c.strokeStyle = RED; c.stroke();
    line(c, [[x - d * 14 * s, y - 20 * s], [x - d * 30 * s, y - 52 * s]], 12 * s, INK);
  }
  dot(c, x, y, 11 * s, COL.steelDk);
};
const ricePile = (c: Ctx, x: number, y: number, r: number, seed: number) => {
  bowl(c, x, y, r, "#fffaf0");
  const heap = () => { c.moveTo(x - r * 0.93, y); c.bezierCurveTo(x - r * 0.7, y - r * 0.62, x + r * 0.7, y - r * 0.62, x + r * 0.93, y); c.ellipse(x, y, r * 0.93, r * 0.2, 0, 0, Math.PI, false); c.closePath(); };
  shape(c, heap, "#fffaf0", 5);
  c.save(); c.beginPath(); heap(); c.clip();
  const q = rnd(seed); for (let i = 0; i < 40; i++) { const a = q() * 6.283, d = Math.sqrt(q()); shape(c, () => ell(c, x + Math.cos(a) * r * 0.8 * d, y - r * 0.18 + Math.sin(a) * r * 0.3 * d, 12, 5, q() * 3), "#efe6d2", 1.8); }
  c.restore(); shape(c, heap, "rgba(0,0,0,0)", 5);
};
const tally = (c: Ctx, x: number, y: number, n: number) => {
  for (let g = 0; g < Math.floor(n / 5); g++) { const gx = x + g * 110; for (let i = 0; i < 4; i++) line(c, [[gx + i * 20, y], [gx + i * 20, y + 80]], 7); line(c, [[gx - 10, y + 70], [gx + 74, y + 10]], 7, RED); }
};
const handprint = (c: Ctx, x: number, y: number, s: number, rot: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha = 0.5; c.fillStyle = col;
  c.beginPath(); ell(c, 0, 0, 50, 58); c.fill();
  for (const [fx, fy, r, l] of [[-32, -76, -0.3, 34], [-11, -92, -0.1, 38], [12, -92, 0.1, 38], [34, -76, 0.3, 33]]) { c.beginPath(); ell(c, fx, fy, 12, l, r); c.fill(); }
  c.beginPath(); ell(c, -56, 6, 12, 32, -1.0); c.fill(); c.restore(); c.globalAlpha = 1;
};
const fly = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const d of [-1, 1]) {
    for (const k of [-1, 0, 1]) line(c, [[d * 10, k * 18], [d * 44, k * 28 + 10], [d * 52, k * 40 + 30]], 5);
    shape(c, () => ell(c, d * 40, -40, 22, 56, d * 0.5), "rgba(214,236,250,0.7)", 4);
  }
  shape(c, () => ell(c, 0, 8, 26, 46), "#4a4350", 5); shape(c, () => ell(c, 0, -46, 20, 18), "#4a4350", 5);
  for (const d of [-1, 1]) shape(c, () => ell(c, d * 11, -52, 8, 9), RED, 3);
  c.restore();
};
const thermo = (c: Ctx, x: number, y: number, w: number, val: string) => {
  const h = w * 5.2;
  shadow(c, x + w * 0.2, y + h + 6, w * 0.7, w * 0.12);
  const p = () => rrect(c, x - w / 2, y, w, h * 0.86, w * 0.4);
  shape(c, p, "#f4f7fa", 7); shade(c, p, "#c9d1dc", w * 0.14, 0, 0.7);
  shape(c, () => { c.moveTo(x - w * 0.28, y + h * 0.84); c.lineTo(x + w * 0.28, y + h * 0.84); c.lineTo(x + w * 0.12, y + h); c.lineTo(x - w * 0.12, y + h); c.closePath(); }, COL.steel, 6);
  shape(c, () => rrect(c, x - w * 0.38, y + h * 0.1, w * 0.76, h * 0.2, w * 0.1), "#22303a", 5);
  write(c, val, x - w * 0.34, y + h * 0.135, h * 0.095, "#c9f06b", 6);
  dot(c, x, y + h * 0.5, w * 0.17, COL.teal);
};
const fridgeBox = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 24), "#e3eef8", 7);
  shape(c, () => rrect(c, x + 14, y + 14, w - 28, h - 28, 14), "#f6fbff", 4);
};
const snow = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 10, INK); line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 5, COL.blue); } };
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 9, COL.orange); } shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); };

// ---------------------------------------------------------------- cards
const intro = (c: Ctx) => {
  ground(c);
  door(c, 180, 50, 720, 980);
  const tones = ["#b9794f", "#8d5a3b", "#e2b48a", "#a0643f", "#f0c9a4", "#7a4a30"];
  [[470, 330, 1.3, -0.4], [800, 300, 1.1, 0.5], [420, 640, 1.2, 0.3], [820, 840, 1.3, -0.3], [600, 860, 1.0, 0.1], [610, 230, 0.9, -0.1], [300, 480, 1.0, -0.8], [360, 860, 0.9, 0.6]].forEach(([x, y, s, r], i) => handprint(c, x, y, s, r, tones[i % tones.length]));
  doorHandle(c, 720, 560, 1.5, -1);
};
const summary = (c: Ctx) => {
  ground(c);
  const px = (i: number) => 30 + i * 280, W = 180, Y = 330, H = 420, cy = Y + H / 2;
  panel(c, px(0), Y, W, H, () => { face(c, px(0) + 90, cy - 20, 66, "o"); shape(c, () => ell(c, px(0) + 90, cy + 40, 34, 28), SKIN.child, 5); germs(c, px(0) + 90, cy + 40, 50, 28, 4, 3, 8); });
  panel(c, px(1), Y, W, H, () => { doorHandle(c, px(1) + 130, cy, 0.6, -1); hand(c, px(1) - 10, cy, 0, 0.85); germs(c, px(1) + 100, cy - 14, 36, 6, 3, 5, 8); });
  panel(c, px(2), Y, W, H, () => { doorHandle(c, px(2) + 50, cy, 0.6, 1); hand(c, px(2) + W + 10, cy, Math.PI, 0.85, SKIN.adult, CLOTH.adult); germs(c, px(2) + 90, cy - 14, 36, 6, 3, 6, 8); });
  panel(c, px(3), Y, W, H, () => { face(c, px(3) + 90, cy - 20, 66, "smile", false); shape(c, () => ell(c, px(3) + 90, cy + 50, 30, 26), SKIN.child, 5); germs(c, px(3) + 90, cy + 50, 46, 26, 4, 7, 8); });
  dotArrow(c, 222, cy, 296, cy); dotArrow(c, 502, cy, 524, cy, RED, 8);
  dotArrow(c, 578, cy, 590, cy, RED, 1); dotArrow(c, 782, cy, 856, cy);
  scissors(c, 540, cy - 100, 1.0);
};
const e1 = (c: Ctx) => {
  ground(c);
  const px = (i: number) => 60 + i * 340, W = 280, Y = 300, H = 480, cy = Y + H / 2;
  panel(c, px(0), Y, W, H, () => { hand(c, px(0) + 110, cy, 0, 1.6, SKIN.child, CLOTH.child, true); spray(c, px(0) + 200, cy, 60, 40, 10, 5, 16); });
  panel(c, px(1), Y, W, H, () => { doorHandle(c, px(1) + 195, cy, 0.9, -1); spray(c, px(1) + 100, cy - 6, 70, 12, 7, 6, 14); });
  panel(c, px(2), Y, W, H, () => { hand(c, px(2) + 110, cy, 0, 1.6, SKIN.adult, CLOTH.adult, true); spray(c, px(2) + 210, cy, 40, 30, 4, 7, 14); });
  arrow(c, [[px(0) + W + 8, cy], [px(1) - 8, cy]]); arrow(c, [[px(1) + W + 8, cy], [px(2) - 8, cy]]);
};
const e2 = (c: Ctx) => {
  ground(c);
  const n = [10, 6, 4, 2, 1];
  n.forEach((k, i) => {
    const x = 120 + i * 210;
    hand(c, x, 770, -Math.PI / 2, 1.15, i % 2 ? SKIN.adult : SKIN.child, i % 2 ? CLOTH.adult : CLOTH.child, true);
    spray(c, x, 600, 55, 60, k, 40 + i, 15);
    if (i < 4) arrow(c, [[x + 66, 520], [x + 144, 520]]);
  });
};
const e3 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 200, 470, 680, () => {
    shape(c, () => rrect(c, 60, 700, 430, 30, 8), WOOD, 6);
    sun(c, 120, 300, 46); ricePile(c, 280, 650, 150, 3);
    germs(c, 290, 430, 190, 120, 14, 9, 14);
    for (const x of [230, 300, 370]) line(c, [[x, 500], [x + 14, 470], [x - 6, 440], [x + 10, 410]], 7, COL.orange);
  });
  panel(c, 570, 200, 470, 680, () => {
    fridgeBox(c, 590, 220, 430, 640); line(c, [[604, 700], [1006, 700]], 8);
    snow(c, 950, 300, 40); ricePile(c, 800, 650, 150, 4);
    germs(c, 800, 500, 60, 30, 2, 12, 14);
  });
};
const a1 = (c: Ctx) => {
  ground(c);
  door(c, 80, 50, 920, 980);
  c.save(); c.translate(300, 330); c.rotate(-0.06);
  shape(c, () => rrect(c, -170, -170, 340, 340, 8), COL.yellow, 6); tally(c, -150, -60, 10); c.restore();
  doorHandle(c, 840, 640, 1.4, -1); hand(c, 380, 640, 0, 1.55);
};
const a2 = (c: Ctx) => {
  ground(c);
  [1, 2, 4, 8].forEach((k, i) => {
    const x = 150 + i * 260, y = 470;
    const col = [PAPER, PAPER, PAPER, PAPER][i];
    shadow(c, x + 8, y + 24, 112, 70); shape(c, () => ell(c, x, y, 112, 74), COL.steel); shape(c, () => ell(c, x, y - 3, 92, 60), COL.steelIn, 4);
    const pos = [[0, 0], [-30, 0], [30, 0], [-45, -14], [45, -14], [-45, 16], [45, 16], [0, 0]];
    const set: number[][][] = [[[0, 0]], [[-24, 0], [24, 0]], [[-32, -14], [32, -14], [-32, 16], [32, 16]], [[-50, -18], [-16, -18], [16, -18], [50, -18], [-50, 16], [-16, 16], [16, 16], [50, 16]]];
    void pos; void col;
    set[i].forEach(([dx, dy], j) => shape(c, () => ell(c, x + dx, y + dy, 17, 8, j % 2 ? 0.4 : -0.3), "#fffaf0", 3));
    write(c, String(k), x - 20, 640, 90, INK, 9);
    if (i < 3) arrow(c, [[x + 128, 470], [x + 132 + 0, 470], [x + 160, 470]], RED, 9);
  });
};
const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 90, 940, 900, 30), "#e9efd8", 7);
  c.fillStyle = "#cfc7b6";
  for (const r of [270, 540, 810]) c.fillRect(r - 28, 98, 56, 884);
  for (const r of [280, 660]) c.fillRect(78, r - 28, 924, 56);
  const cx = 540, cy = 660, q = rnd(5);
  const bx: number[][] = [[90, 242], [298, 512], [568, 782], [838, 1000]], by: number[][] = [[100, 252], [308, 632], [688, 980]];
  for (const [x0, x1] of bx) for (const [y0, y1] of by) {
    const nx = Math.floor((x1 - x0) / 72), ny = Math.floor((y1 - y0) / 82);
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x = x0 + ((i + 0.5) * (x1 - x0)) / nx, y = y0 + ((j + 0.5) * (y1 - y0)) / ny + 8, ill = Math.hypot(x - cx, y - cy) < 250 && q() < 0.85;
      shape(c, () => rrect(c, x - 26, y - 20, 52, 40, 6), ill ? RED : "#f1e7d3", 4);
      shape(c, () => polyP(c, [[x - 30, y - 18], [x, y - 40], [x + 30, y - 18]]), ill ? VIR_DK : COL.brown, 4);
    }
  }
  shadow(c, cx + 14, cy + 40, 50, 12);
  shape(c, () => rrect(c, cx - 22, cy - 60, 44, 100, 10), COL.blue, 6);
  shape(c, () => ell(c, cx, cy - 60, 26, 14), COL.blueDk, 5);
  line(c, [[cx + 10, cy - 50], [cx + 62, cy - 86]], 12, INK); line(c, [[cx + 10, cy - 50], [cx + 62, cy - 86]], 6, COL.steel);
  drop(c, cx - 8, cy + 56, 14);
  c.beginPath(); ell(c, cx, cy, 150, 150); c.fillStyle = "rgba(214,236,250,0.3)"; c.fill(); c.lineWidth = 16; c.strokeStyle = INK; c.stroke();
  line(c, [[cx + 106, cy + 106], [cx + 190, cy + 190]], 30, INK); line(c, [[cx + 106, cy + 106], [cx + 190, cy + 190]], 16, WOOD_DK);
};
const a4 = (c: Ctx) => {
  ground(c);
  const wall = (pts: number[][]) => line(c, pts, 16, INK);
  shape(c, () => rrect(c, 110, 170, 860, 740, 10), "#f6efdc", 0);
  shape(c, () => rrect(c, 580, 170, 390, 330, 0), "#e2eef0", 0); shape(c, () => rrect(c, 580, 500, 390, 410, 0), "#f1e2e0", 0);
  wall([[110, 170], [970, 170], [970, 910], [110, 910], [110, 170]]); wall([[580, 170], [580, 330]]); wall([[580, 440], [580, 910]]); wall([[580, 500], [970, 500]]); wall([[110, 600], [330, 600]]);
  // door gap on the left wall and the door handle
  c.fillStyle = BG; c.fillRect(100, 380, 30, 130); line(c, [[110, 380], [190, 440]], 8, WOOD_DK); line(c, [[110, 510], [190, 440]], 8, WOOD_DK, );
  shape(c, () => rrect(c, 120, 330, 22, 56, 8), WOOD_DK, 5); dot(c, 131, 358, 7, COL.steel);
  // sofa, sink with tap, basin
  shape(c, () => rrect(c, 160, 700, 300, 120, 24), COL.pink, 6); shape(c, () => rrect(c, 160, 680, 300, 50, 20), "#d77d99", 5);
  shape(c, () => rrect(c, 650, 215, 250, 90, 12), COL.steel, 6); shape(c, () => rrect(c, 680, 228, 190, 60, 14), COL.water, 4); line(c, [[775, 228], [775, 200], [800, 200]], 10, INK);
  shape(c, () => ell(c, 770, 740, 90, 70), WHITE, 6); shape(c, () => ell(c, 770, 740, 54, 38), COL.drop, 4);
  // light switch
  shape(c, () => rrect(c, 330, 185, 36, 54, 8), WHITE, 5); line(c, [[348, 200], [348, 222]], 6);
  // path of germs
  const path = [[140, 440], [260, 440], [350, 250], [440, 330], [430, 650], [520, 700]];
  void path;
  arrow(c, [[170, 470], [290, 470], [350, 300]]); arrow(c, [[400, 300], [500, 330], [500, 420], [650, 260]]); arrow(c, [[700, 330], [720, 480], [740, 600]]);
  germs(c, 131, 440, 12, 20, 2, 4, 9); germs(c, 348, 262, 22, 10, 2, 5, 9); germs(c, 330, 760, 80, 20, 3, 6, 9); germs(c, 775, 270, 70, 10, 3, 7, 9); germs(c, 770, 700, 60, 30, 3, 8, 9);
};
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 600, 90, 420, 880, 12), COL.steel, 7); line(c, [[810, 100], [810, 960]], 8);
  shape(c, () => rrect(c, 530, 440, 56, 120, 12), COL.steelIn, 5); dot(c, 558, 478, 14, COL.yellow); dot(c, 558, 524, 14, COL.yellow);
  c.save(); c.translate(240, 520); c.rotate(-0.03);
  shadow(c, 14, 20, 240, 360); shape(c, () => rrect(c, -230, -380, 460, 760, 6), WHITE, 6);
  hand(c, -150, -270, 0, 0.9, SKIN.child, CLOTH.child, true); germs(c, -60, -270, 30, 40, 3, 3, 9); arrow(c, [[-20, -250], [40, -250]], RED, 9);
  dot(c, 120, -260, 52, COL.yellow); dot(c, 120, -260, 24, COL.orange); germs(c, 120, -300, 30, 14, 2, 5, 9);
  line(c, [[-200, -120], [200, -120]], 6, COL.grey);
  hand(c, -150, 20, 0, 0.9, SKIN.child, CLOTH.child, true);
  for (const [bx, by, br] of [[-30, -30, 24], [20, 10, 30], [-20, 60, 20], [60, -30, 18]]) { shape(c, () => ell(c, bx, by, br, br), "rgba(214,236,250,0.7)", 4); }
  tick(c, 120, 220, 110);
  c.restore();
  for (const [tx, ty, tr] of [[190, 130, -0.3], [450, 130, 0.3], [190, 880, 0.3], [450, 880, -0.3]]) { c.save(); c.translate(tx, ty); c.rotate(tr); shape(c, () => rrect(c, -34, -14, 68, 28, 4), "rgba(255,211,77,0.85)", 4); c.restore(); }
};
const c1 = (c: Ctx) => {
  ground(c);
  door(c, 80, 50, 920, 980);
  doorHandle(c, 340, 400, 1.4, 1);
  // a cloth loop hanging low from the handle
  const loop = () => { c.moveTo(560, 420); c.bezierCurveTo(500, 600, 520, 840, 640, 840); c.bezierCurveTo(760, 840, 740, 600, 640, 420); };
  c.beginPath(); loop(); c.strokeStyle = INK; c.lineWidth = 36; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.blue; c.lineWidth = 22; c.stroke();
  // forearm hooked through the loop, elbow low
  const arm = [[760, 600], [640, 800]];
  line(c, [[1060, 860], [640, 820], [760, 620]], 92, INK); line(c, [[1060, 860], [640, 820], [760, 620]], 78, CLOTH.child);
  shape(c, () => ell(c, 770, 575, 52, 56), SKIN.child, 6); void arm;
  arrow(c, [[640, 940], [440, 940]]);
};

// ---- terms
const t0 = (c: Ctx) => {
  ground(c);
  bowl(c, 300, 700, 230, "#fffaf0");
  const heap = () => { c.moveTo(70 + 5, 700); c.bezierCurveTo(130, 590, 470, 590, 525, 700); c.ellipse(300, 700, 225, 46, 0, 0, Math.PI, false); c.closePath(); };
  shape(c, heap, "#fffaf0", 6);
  c.beginPath(); ell(c, 300, 640, 36, 22); c.fillStyle = "rgba(214,236,250,0.5)"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  line(c, [[330, 622], [560, 400]], 6); line(c, [[300, 618], [450, 620]], 6, "rgba(0,0,0,0)");
  c.beginPath(); ell(c, 700, 360, 280, 280); c.fillStyle = "#fffaf0"; c.fill(); c.lineWidth = 12; c.strokeStyle = INK; c.stroke();
  [[600, 280, 130, 50, 0.4], [760, 250, 120, 48, -0.3], [680, 400, 140, 52, 0.1], [820, 410, 110, 46, 0.9], [580, 440, 110, 46, -0.6], [710, 510, 120, 48, 0.3]].forEach(([x, y, l, w, r]) => bact(c, x, y, l, w, r, MIC, MIC_DK));
};
const t1 = (c: Ctx) => {
  ground(c);
  const q = rnd(11), cols = [MIC, COL.yellow, COL.teal, COL.greenLt];
  const pts: number[][] = [[180, 220], [400, 200], [640, 230], [880, 210], [260, 420], [500, 430], [740, 440], [920, 430], [160, 640], [380, 650], [620, 780], [880, 660], [240, 860], [450, 880], [830, 880]];
  pts.forEach(([x, y], i) => {
    const r = 62 + q() * 14, col = cols[i % 4];
    shape(c, () => ell(c, x, y, r, r * 0.92), col, 5); shade(c, () => ell(c, x, y, r, r * 0.92), "rgba(0,0,0,0.35)", r * 0.2, r * 0.2, 0.3);
    for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.3, y - r * 0.1, r * 0.09, r * 0.12), INK, 0);
    c.beginPath(); c.arc(x, y + r * 0.05, r * 0.28, 0.2, Math.PI - 0.2); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  });
  virus(c, 560, 640, 60); bact(c, 270, 520, 150, 56, 0.5);
  for (const [x, y, r] of [[560, 640, 130], [270, 520, 110]]) { c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 12; c.strokeStyle = RED; c.stroke(); }
};
const t3 = (c: Ctx) => {
  ground(c);
  const cell = () => ell(c, 640, 760, 400, 250);
  shape(c, cell, "#f4b6b0", 8); shade(c, cell, "#d98c86", 40, 30, 0.5);
  shape(c, () => ell(c, 690, 790, 120, 90), "#c98acb", 6);
  bact(c, 330, 380, 270, 90, 0.35);
  virus(c, 660, 500, 26);
  arrow(c, [[660, 400], [660, 450]]);
  for (const [x, y, rr] of [[480, 600, 12], [820, 640, 12]]) dot(c, x, y, rr, "#f0d6a4");
};
const t4 = (c: Ctx) => {
  ground(c);
  const leg = () => rrect(c, 120, 380, 360, 600, 60);
  shape(c, leg, SKIN.child, 7); shade(c, leg, SKIN.childDk, 40, 0, 0.5);
  shape(c, () => rrect(c, 120, 380, 360, 130, 40), COL.orange, 7);
  shape(c, () => rrect(c, 120, 860, 360, 120, 30), WHITE, 7);
  line(c, [[230, 700], [300, 720], [370, 700]], 5, SKIN.childDk);
  shape(c, () => ell(c, 300, 640, 70, 26, 0.3), RED, 6); line(c, [[250, 630], [350, 655]], 5, VIR_DK);
  c.beginPath(); ell(c, 770, 300, 270, 270); c.fillStyle = "#f8d3c6"; c.fill(); c.lineWidth = 12; c.strokeStyle = INK; c.stroke();
  line(c, [[345, 625], [585, 390]], 6);
  germs(c, 660, 290, 40, 40, 2, 2, 20); arrow(c, [[730, 310], [800, 310]], RED, 8); germs(c, 880, 310, 50, 90, 6, 4, 20);
};
const t5 = (c: Ctx) => {
  ground(c);
  [1, 2, 4, 8].forEach((k, i) => {
    const x = 150 + i * 260, y = 470;
    c.beginPath(); ell(c, x, y, 112, 112); c.fillStyle = "#e9f3ff"; c.fill(); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
    const q = rnd(i + 4), P: number[][] = [[0, 0]];
    if (k == 2) P.splice(0, 1, [-34, 0], [34, 0]); if (k == 4) P.splice(0, 1, [-36, -36], [36, -30], [-36, 36], [36, 34]);
    if (k == 8) P.splice(0, 1, [-44, -55], [30, -62], [-60, 0], [0, 4], [60, 0], [-34, 58], [26, 58], [64, 40]);
    P.forEach(([dx, dy]) => bact(c, x + dx, y + dy, k == 8 ? 44 : 60, k == 8 ? 22 : 30, q() * 3));
    write(c, String(k), x - 20, 640, 90, INK, 9);
    if (i < 3) arrow(c, [[x + 128, 470], [x + 160, 470]]);
  });
};
const t6 = (c: Ctx) => {
  ground(c);
  face(c, 400, 500, 230, "sad");
  shape(c, () => ell(c, 400, 600, 54, 36), RED, 0); c.globalAlpha = 0.5; shape(c, () => ell(c, 400, 590, 40, 28), RED, 0); c.globalAlpha = 1;
  shape(c, () => polyP(c, [[290, 560], [420, 540], [520, 640], [400, 700], [310, 660]]), WHITE, 6); line(c, [[330, 600], [440, 590]], 4, COL.grey);
  for (let k = 0; k < 3; k++) line(c, [[270 + k * 50, 300], [260 + k * 50, 260], [280 + k * 50, 230]], 9, COL.orange);
  thermo(c, 840, 220, 90, "38");
  for (const [x, y] of [[680, 760], [740, 810], [640, 840]]) drop(c, x, y, 20);
};
const t7 = (c: Ctx) => {
  ground(c);
  face(c, 210, 280, 130, "sad");
  q7(c, 210, 280);
  dotArrow(c, 400, 280, 640, 280);
  face(c, 820, 280, 130, "smile", false);
  // a leg in plaster, and no arrow to the friend
  const x = 190, y = 640;
  shape(c, () => rrect(c, x - 40, y, 150, 100, 30), SKIN.child, 6); // thigh and knee lying
  shape(c, () => rrect(c, x + 60, y + 10, 100, 280, 20), WHITE, 7);
  line(c, [[x + 78, y + 70], [x + 142, y + 70]], 4, COL.grey); line(c, [[x + 78, y + 140], [x + 142, y + 140]], 4, COL.grey); line(c, [[x + 78, y + 210], [x + 142, y + 210]], 4, COL.grey);
  shape(c, () => ell(c, x + 110, y + 310, 70, 34), SKIN.child, 6);
  dotArrow(c, 400, 780, 640, 780);
  cross(c, 520, 780, 40);
  face(c, 820, 790, 130, "smile", true);
};
const q7 = (c: Ctx, x: number, y: number) => { for (const [dx, dy] of [[-70, -20], [-20, 30], [60, -30], [40, 60], [-60, 70], [10, -70], [75, 20]]) dot(c, x + dx, y + dy, 11, RED); };
const t8 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(80, 0);
  const head = () => ell(c, 230, 400, 150, 170);
  shape(c, () => ell(c, 120, 380, 120, 175), CLOTH.hair, 6);
  shape(c, head, SKIN.child, 7); shade(c, head, SKIN.childDk, 25, 10, 0.5);
  shape(c, () => polyP(c, [[350, 390], [430, 440], [350, 470]]), SKIN.child, 6);
  shape(c, () => ell(c, 210, 340, 12, 20), INK, 0);
  c.beginPath(); c.arc(395, 520, 30, 0, 2 * Math.PI); c.fillStyle = INK; c.fill();
  shape(c, () => ell(c, 318, 520, 54, 28, 0.2), INK, 0);
  shape(c, () => rrect(c, 120, 580, 220, 400, 40), CLOTH.child, 7);
  c.restore();
  line(c, [[40, 960], [1040, 960]], 8);
  const q = rnd(9);
  for (let i = 0; i < 28; i++) { const t = q(), an = -0.5 + q() * 1.0, d = 120 + t * 480, x = 500 + Math.cos(an) * d, y = 510 + Math.sin(an) * d * 0.5 + t * t * 260, s = 20 - t * 10; drop(c, x, y, s); }
  for (const x of [640, 700, 770, 830]) drop(c, x, 940, 12);
  arrow(c, [[600, 430], [780, 400]]);
};
const t10 = (c: Ctx) => {
  ground(c);
  // steel pot with a lid
  shadow(c, 340, 880, 240, 30);
  const body = () => rrect(c, 130, 480, 420, 380, 36);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 50, 0, 0.55);
  shape(c, () => ell(c, 340, 480, 230, 42), COL.steelIn, 7); shape(c, () => rrect(c, 300, 436, 80, 30, 14), COL.steelDk, 6);
  shape(c, () => rrect(c, 70, 560, 60, 36, 16), COL.steelDk, 6); shape(c, () => rrect(c, 550, 560, 60, 36, 16), COL.steelDk, 6);
  shine(c, [[170, 540], [170, 800]], 9);
  for (const x of [270, 340, 410]) line(c, [[x, 380], [x + 20, 330], [x - 10, 280], [x + 14, 230]], 9, COL.grey);
  tick(c, 340, 160, 90);
  // a muddy open well, crossed out
  const wx = 820;
  shadow(c, wx + 10, 880, 190, 26);
  shape(c, () => rrect(c, wx - 160, 650, 320, 210, 20), COL.grey, 7);
  for (let k = 0; k < 3; k++) line(c, [[wx - 160, 715 + k * 50], [wx + 160, 715 + k * 50]], 4);
  shape(c, () => ell(c, wx, 650, 160, 56), COL.grey, 7); shape(c, () => ell(c, wx, 650, 128, 40), "#7a5a3a", 5);
  germs(c, wx, 650, 80, 22, 4, 2, 11);
  cross(c, wx, 560, 80);
};
const t11 = (c: Ctx) => {
  ground(c);
  const strip = () => rrect(c, 240, 110, 600, 250, 30);
  shape(c, strip, COL.steel); shade(c, strip, COL.steelDk, 0, 14, 0.5);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) { const x = 330 + k * 140, y = 180 + r * 110; shape(c, () => ell(c, x, y, 52, 40), COL.steelIn, 5); shape(c, () => ell(c, x, y, 30, 18), WHITE, 3); }
  arrow(c, [[420, 400], [300, 520]]); arrow(c, [[660, 400], [780, 520]]);
  bact(c, 270, 700, 220, 90, 0.2); tick(c, 270, 890, 90);
  virus(c, 790, 700, 62); cross(c, 790, 890, 50);
};

// ---- explanations
const x0 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, R = 440, q = rnd(5), cols = [MIC, COL.yellow, COL.teal, COL.greenLt];
  c.beginPath(); ell(c, cx, cy, R, R); c.fillStyle = "#e6f2db"; c.fill(); c.lineWidth = 10; c.strokeStyle = INK; c.stroke();
  const a0 = -0.28, a1 = 0.28;
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip();
  c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a0) * R * 1.1, cy + Math.sin(a0) * R * 1.1); c.lineTo(cx + Math.cos(a1) * R * 1.1, cy + Math.sin(a1) * R * 1.1); c.closePath();
  c.fillStyle = "#f6c9c0"; c.fill(); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); c.restore();
  for (let i = 0; i < 26; i++) {
    const a = 0.6 + q() * (Math.PI * 2 - 0.9), d = 90 + q() * 290, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, r = 36 + q() * 10;
    shape(c, () => ell(c, x, y, r, r * 0.92), cols[i % 4], 4);
    for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.3, y - r * 0.1, r * 0.09, r * 0.12), INK, 0);
    c.beginPath(); c.arc(x, y + r * 0.05, r * 0.28, 0.2, Math.PI - 0.2); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
  }
  virus(c, 780, 500, 30); bact(c, 700, 580, 80, 34, 0.2); virus(c, 840, 590, 22);
};
const x1 = (c: Ctx) => {
  ground(c);
  face(c, 200, 700, 130, "sad"); face(c, 880, 700, 130, "smile", false);
  const zoom = (x: number, y: number) => { c.beginPath(); ell(c, x, y, 105, 105); c.fillStyle = "#fffaf0"; c.fill(); c.lineWidth = 9; c.strokeStyle = INK; c.stroke(); virus(c, x, y, 38); };
  zoom(200, 380); zoom(880, 380); line(c, [[200, 485], [200, 590]], 6); line(c, [[880, 485], [880, 590]], 6);
  shape(c, () => ell(c, 540, 330, 110, 120), COL.drop, 6); virus(c, 540, 345, 38);
  arrow(c, [[320, 380], [410, 340]]); arrow(c, [[670, 340], [760, 380]]);
};
const x2 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 560;
  face(c, cx, cy, 120, "smile");
  hand(c, 540, 130, Math.PI / 2, 0.9, SKIN.adult, CLOTH.adult, true); germs(c, 540, 290, 40, 20, 3, 3, 12);
  doorHandle(c, 780, 350, 0.55, -1); germs(c, 720, 340, 40, 8, 3, 4, 10);
  [[0, 0], [30, 36], [-26, 46]].forEach(([dx, dy], i) => drop(c, 820 + dx, 760 + dy, 24 - i * 3));
  glass(c, 280, 880, 130, 160, 0.7); germs(c, 280, 800, 30, 14, 3, 6, 9);
  fly(c, 220, 380, 1.5);
  dotArrow(c, 540, 330, 540, 430); dotArrow(c, 690, 400, 630, 470); dotArrow(c, 780, 690, 650, 640); dotArrow(c, 300, 740, 420, 650); dotArrow(c, 290, 430, 410, 500);
};
const x3 = (c: Ctx) => {
  ground(c);
  const X = [40, 385, 730], W = 310, Y = 200, H = 680;
  panel(c, X[0], Y, W, H, () => { face(c, X[0] + 155, Y + 420, 110, "smile"); germs(c, X[0] + 155, Y + 120, 60, 25, 3, 2, 13); arrow(c, [[X[0] + 155, Y + 190], [X[0] + 155, Y + 270]]); });
  panel(c, X[1], Y, W, H, () => { face(c, X[1] + 155, Y + 420, 110, "smile"); c.beginPath(); ell(c, X[1] + 155, Y + 190, 120, 120); c.fillStyle = "#fffaf0"; c.fill(); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); germs(c, X[1] + 155, Y + 190, 70, 70, 11, 4, 13); line(c, [[X[1] + 155, Y + 310], [X[1] + 155, Y + 340]], 6); });
  panel(c, X[2], Y, W, H, () => {
    const bx = X[2];
    shape(c, () => rrect(c, bx + 20, Y + 330, 270, 140, 20), WHITE, 6);
    face(c, bx + 100, Y + 380, 70, "sad");
    shape(c, () => rrect(c, bx + 20, Y + 420, 270, 150, 20), COL.blue, 6); line(c, [[bx + 20, Y + 470], [bx + 290, Y + 470]], 5, COL.blueDk);
    thermo(c, bx + 235, Y + 90, 54, "39");
    for (let k = 0; k < 3; k++) line(c, [[bx + 70 + k * 30, Y + 280], [bx + 62 + k * 30, Y + 250], [bx + 78 + k * 30, Y + 225]], 7, COL.orange);
  });
};
const x5 = (c: Ctx) => {
  ground(c);
  const cols = [COL.pink, COL.orange, COL.yellow, COL.teal, COL.blue];
  const ring = (i: number) => { const x = 130 + i * 205; return x; };
  for (let i = 0; i < 5; i++) {
    const x = ring(i), p = () => rrect(c, x - 100, 380, 200, 300, 100);
    c.beginPath(); p(); c.lineWidth = 44; c.strokeStyle = INK; c.stroke(); c.lineWidth = 28; c.strokeStyle = cols[i]; c.stroke();
  }
  // open the third link at the top where the scissors cut
  c.fillStyle = BG; c.fillRect(ring(2) - 36, 340, 72, 70);
  const icons = [
    (x: number) => { face(c, x, 530, 54, "sad"); },
    (x: number) => { drop(c, x - 20, 520, 28); drop(c, x + 22, 560, 22); drop(c, x + 4, 480, 16); },
    (x: number) => { hand(c, x - 60, 530, 0, 0.7); germs(c, x + 30, 520, 14, 16, 3, 5, 8); },
    (x: number) => { face(c, x, 540, 50, "o", false); arrow(c, [[x, 440], [x, 480]], RED, 7); },
    (x: number) => { face(c, x, 530, 54, "smile", false); },
  ];
  icons.forEach((f, i) => f(ring(i)));
  scissors(c, ring(2), 220, 0.9);
};

export const ic_microorganismsGermsL3 = cards("sci.microorganisms.germs.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, p1, c1, t0, t1, t3, t4, t5, t6, t7, t8, t10, t11, x0, x1, x2, x3, x5,
]);
