import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, glass, plate, leaf, hand, person, write, cards } from "./flatKit";

// SIGNS OF LIFE L1 · the droopy-mint set-up cards and the card pictures: three plates of kitchen things,
// breath on a steel plate, a hand drawn round, a paper snake, the mother-and-baby cards, wiggle / sit / statue.
const PI = Math.PI;
const q = (p0: number[], p1: number[], p2: number[], t: number): number[] => [
  (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
  (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
];
const qTan = (p0: number[], p1: number[], p2: number[], t: number) =>
  Math.atan2(2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]), 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]));
const mixAng = (a: number, b: number, k: number) => Math.atan2((1 - k) * Math.sin(a) + k * Math.sin(b), (1 - k) * Math.cos(a) + k * Math.cos(b));
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e3d4b8"; c.fillRect(0, y, D, D - y); };
const smooth = (c: Ctx, pts: number[][]) => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };

// ---------------------------------------------------------------- leaves
// a mint sprig: the stalk runs from p0 through p1 to p2, with pairs of leaves; droop 0 = firm and perky, 1 = leaves hanging limp
const mint = (c: Ctx, p0: number[], p1: number[], p2: number[], pairs = 3, len = 70, droop = 0) => {
  const col = droop > 0.5 ? COL.green : COL.leaf;
  const stalk = () => { c.moveTo(p0[0], p0[1]); c.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); };
  c.beginPath(); stalk(); c.strokeStyle = INK; c.lineWidth = 14; c.lineCap = "round"; c.stroke();
  c.beginPath(); stalk(); c.strokeStyle = COL.greenDk; c.lineWidth = 7; c.stroke();
  for (let i = 0; i < pairs; i++) {
    const t = 0.25 + (0.6 * i) / Math.max(1, pairs - 1), [x, y] = q(p0, p1, p2, t), a = qTan(p0, p1, p2, t);
    for (const s of [-1, 1]) leaf(c, x, y, len, mixAng(a + s * 0.95, PI / 2 + s * 0.3, droop), col);
  }
  leaf(c, p2[0], p2[1], len * 0.85, mixAng(qTan(p0, p1, p2, 1), PI / 2, droop), col);
};
// a dry tej patta (bay leaf): long, brown, stiff, with a dark midrib and side veins; base (x, y), pointing at an
const tej = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.2, ny = Math.cos(an) * len * 0.2, mx = (x + tx) / 2, my = (y + ty) / 2;
  line(c, [[x - Math.cos(an) * len * 0.1, y - Math.sin(an) * len * 0.1], [x, y]], 12, INK); line(c, [[x - Math.cos(an) * len * 0.1, y - Math.sin(an) * len * 0.1], [x, y]], 6, "#7d5329");
  const blade = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); };
  shape(c, blade, "#b8824a", 5); shade(c, blade, "#8a5a30", len * 0.06, len * 0.06, 0.5);
  line(c, [[x, y], [x + Math.cos(an) * len * 0.92, y + Math.sin(an) * len * 0.92]], 3.5, "#6e4522");
  for (const k of [0.3, 0.55]) for (const s of [-1, 1]) {
    const px = x + Math.cos(an) * len * k, py = y + Math.sin(an) * len * k;
    line(c, [[px, py], [px + Math.cos(an) * len * 0.18 + s * nx * 0.55, py + Math.sin(an) * len * 0.18 + s * ny * 0.55]], 2.5, "#6e4522");
  }
};
// a leaf shape cut from newspaper, on a long paper stalk: base of the stalk at (x, y), stalk pointing at an, the blade
// turned by bend from the stalk (0 = straight on; a big bend = flopped over)
const paperLeaf = (c: Ctx, x: number, y: number, len: number, an: number, bend = 0) => {
  const sl = len * 0.55, ex = x + Math.cos(an) * sl, ey = y + Math.sin(an) * sl;
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -9, sl, 18, 5), COL.paper, 4);
  c.strokeStyle = COL.greyDk; c.lineWidth = 2; for (let k = 12; k < sl - 14; k += 16) { c.beginPath(); c.moveTo(k, -4); c.lineTo(k + 8, -4); c.moveTo(k + 2, 3); c.lineTo(k + 9, 3); c.stroke(); }
  c.restore();
  const a2 = an + bend, bl = len * 0.7, tx = ex + Math.cos(a2) * bl, ty = ey + Math.sin(a2) * bl, nx = -Math.sin(a2) * bl * 0.32, ny = Math.cos(a2) * bl * 0.32, mx = (ex + tx) / 2, my = (ey + ty) / 2;
  const blade = () => { c.moveTo(ex, ey); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, ex, ey); c.closePath(); };
  shape(c, blade, COL.paper, 5);
  c.save(); c.beginPath(); blade(); c.clip(); c.strokeStyle = COL.greyDk; c.lineWidth = 2.5;
  for (let k = 0.12; k < 0.95; k += 0.09) { const px = ex + Math.cos(a2) * bl * k, py = ey + Math.sin(a2) * bl * k; c.beginPath(); c.moveTo(px - nx, py - ny); c.lineTo(px + nx, py + ny); c.stroke(); }
  c.restore();
};

// ---------------------------------------------------------------- kitchen things
// a steel tumbler of water, bottom centre at (x, y): the water shows in the open top
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y - h, top, w * 0.13), COL.water, 5);
  shape(c, () => ell(c, x - top * 0.35, y - h - w * 0.02, top * 0.28, w * 0.035), COL.drop, 0);
  shine(c, [[x - top * 0.7, y - h * 0.85], [x - bot * 0.8, y - h * 0.2]], 8);
};
// the front rim of a tumbler, drawn over whatever stands in it
const rimFront = (c: Ctx, x: number, yTop: number, w: number) => {
  c.beginPath(); c.ellipse(x, yTop, w / 2, w * 0.13, 0, 0, PI); c.strokeStyle = COL.steelIn; c.lineWidth = 10; c.stroke();
  c.beginPath(); c.ellipse(x, yTop + 3, w / 2, w * 0.13, 0, 0, PI); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
// a spoon lying with its middle at (x, y), the bowl toward angle an
const spoon = (c: Ctx, x: number, y: number, len: number, an: number, col = COL.wood, dk = COL.woodDk, inner = COL.woodDk) => {
  c.beginPath(); ell(c, x + 8, y + 12, len * 0.5, 18, an); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill();
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len * 0.5, -12, len * 0.68, 24, 12), col, 5);
  const bowl = () => ell(c, len * 0.32, 0, len * 0.2, len * 0.13);
  shape(c, bowl, col, 5); shade(c, bowl, dk, len * 0.06, len * 0.05, 0.5);
  shape(c, () => ell(c, len * 0.32, 0, len * 0.13, len * 0.08), inner, 3);
  c.restore();
};
const stone = (c: Ctx, x: number, y: number, r: number, seed = 1) => {
  const g = rnd(seed), pts: number[][] = [];
  for (let i = 0; i < 9; i++) { const a = (i / 9) * PI * 2, k = r * (0.82 + g() * 0.25); pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k * 0.8]); }
  const path = () => { c.moveTo((pts[8][0] + pts[0][0]) / 2, (pts[8][1] + pts[0][1]) / 2); for (let i = 0; i < 9; i++) { const n = pts[(i + 1) % 9]; c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + n[0]) / 2, (pts[i][1] + n[1]) / 2); } c.closePath(); };
  shadow(c, x + r * 0.1, y + r * 0.75, r * 0.95, r * 0.2);
  shape(c, path, COL.grey); shade(c, path, COL.greyDk, r * 0.3, r * 0.25, 0.5);
  shine(c, [[x - r * 0.5, y - r * 0.35], [x - r * 0.2, y - r * 0.5]], 6);
};
// a small heap of salt, its base centre at (x, y)
const salt = (c: Ctx, x: number, y: number, r: number) => {
  const path = () => { c.moveTo(x - r, y); c.quadraticCurveTo(x - r * 0.6, y - r * 0.95, x + r * 0.05, y - r); c.quadraticCurveTo(x + r * 0.6, y - r * 0.9, x + r, y); c.quadraticCurveTo(x, y + r * 0.3, x - r, y); c.closePath(); };
  shadow(c, x + r * 0.1, y + r * 0.12, r, r * 0.2);
  shape(c, path, WHITE, 5); shade(c, path, COL.steelIn, r * 0.3, r * 0.2, 0.9);
  const g = rnd(5); for (let i = 0; i < 12; i++) { const a = g() * PI, k = g() * 0.8; shape(c, () => ell(c, x + Math.cos(a) * r * k, y - Math.sin(a) * r * k * 0.85 - 2, 3, 3), COL.steelDk, 0); }
};
const potato = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  const p = () => ell(c, x, y, rx, ry, rot);
  shadow(c, x + rx * 0.1, y + ry * 0.85, rx, ry * 0.3);
  shape(c, p, "#cfa46b"); shade(c, p, "#a57a46", rx * 0.25, ry * 0.3, 0.5);
  for (const [dx, dy] of [[-0.45, -0.3], [0.1, -0.5], [0.4, 0.1], [-0.2, 0.4]]) shape(c, () => ell(c, x + dx * rx, y + dy * ry, 5, 3.5), "#7d5a33", 0);
};
// half a coconut shell, cut side up
const coconut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.75, r * 0.9, r * 0.18);
  const cup = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 0.95, x + r * 0.95, y + r * 0.95, x + r, y); c.closePath(); };
  shape(c, cup, "#6d4a2c"); shade(c, cup, "#4e331c", r * 0.3, 0, 0.5);
  for (let i = 0; i < 7; i++) { const u = -0.8 + i * 0.27; line(c, [[x + u * r, y + r * 0.25], [x + u * r + 6, y + r * 0.55]], 3, "#4e331c"); }
  shape(c, () => ell(c, x, y, r, r * 0.32), "#f6efe0", 5);
  shape(c, () => ell(c, x, y, r * 0.7, r * 0.2), "#fffaf0", 3);
};
const marble = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.9, r, r * 0.3);
  shape(c, () => ell(c, x, y, r, r), COL.sky, 4);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); line(c, [[x - r, y + r * 0.3], [x - r * 0.2, y - r * 0.4], [x + r * 0.4, y + r * 0.5], [x + r, y - r * 0.2]], r * 0.35, COL.blue); c.restore();
  shine(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.25, y - r * 0.65]], 6);
};
// a woven basket: the back (rim and dark inside) goes under the things in it, the front over them
const basketBack = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.08);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.14), COL.soilDk, 5);
};
const basketFront = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const ry = w * 0.14, top = y - h, hw = w / 2, bw = w * 0.4;
  const body = () => { c.moveTo(x - hw, top); c.lineTo(x - bw, y); c.lineTo(x + bw, y); c.lineTo(x + hw, top); c.ellipse(x, top, hw, ry, 0, 0, PI, false); c.closePath(); };
  shape(c, body, COL.wood);
  c.save(); c.beginPath(); body(); c.clip();
  c.strokeStyle = COL.woodDk; c.lineWidth = 4; c.globalAlpha = 0.7;
  for (let yy = top + ry + 26; yy < y; yy += 30) { c.beginPath(); c.moveTo(x - hw, yy); c.quadraticCurveTo(x, yy + 14, x + hw, yy); c.stroke(); }
  c.lineWidth = 3; for (let xx = x - hw + 40; xx < x + hw; xx += 46) { c.beginPath(); c.moveTo(xx, top); c.lineTo(xx - (xx - x) * 0.2, y); c.stroke(); }
  c.globalAlpha = 1; c.restore();
  shade(c, body, COL.woodDk, w * 0.25, 0, 0.35);
  c.beginPath(); c.ellipse(x, top, hw, ry, 0, 0, PI); c.strokeStyle = COL.woodDk; c.lineWidth = 16; c.stroke();
  c.beginPath(); c.ellipse(x, top, hw, ry, 0, 0, PI); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.beginPath(); c.ellipse(x, top + 11, hw - 4, ry, 0, 0.1, PI - 0.1); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// a pencil from its blunt end (x1, y1) to its tip (x2, y2)
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 24) => {
  const an = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
  c.save(); c.translate(x1, y1); c.rotate(an);
  shape(c, () => rrect(c, 0, -w / 2, L - w * 1.3, w, 3), COL.yellow, 4);
  shape(c, () => polyP(c, [[L - w * 1.4, -w / 2], [L, 0], [L - w * 1.4, w / 2]]), "#e8c89a", 4);
  shape(c, () => polyP(c, [[L - w * 0.5, -w * 0.18], [L, 0], [L - w * 0.5, w * 0.18]]), INK, 0);
  shape(c, () => rrect(c, 0, -w / 2, w * 0.9, w, 3), COL.pink, 4);
  c.restore();
};
// a paper label with a small drawing on it
const tag = (c: Ctx, x: number, y: number, icon: () => void) => { shadow(c, x + 6, y + 48, 60, 8); shape(c, () => rrect(c, x - 60, y - 42, 120, 84, 8), COL.paper, 5); icon(); };
const plantIcon = (c: Ctx, x: number, y: number) => { line(c, [[x, y + 30], [x, y - 22]], 6, COL.greenDk); leaf(c, x, y + 8, 30, PI * 1.2); leaf(c, x, y - 4, 30, -PI * 0.2); leaf(c, x, y - 20, 28, -PI / 2); };
const tickLeafIcon = (c: Ctx, x: number, y: number) => { leaf(c, x - 42, y + 18, 70, -0.5, "#b8824a"); line(c, [[x + 4, y + 2], [x + 18, y + 22], [x + 46, y - 20]], 8, COL.greenDk); };
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.9, r, r * 0.25);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; line(c, [[x + Math.cos(a) * r * 0.84, y + Math.sin(a) * r * 0.84], [x + Math.cos(a) * r * (i % 3 ? 0.74 : 0.66), y + Math.sin(a) * r * (i % 3 ? 0.74 : 0.66)]], i % 3 ? 3 : 5, INK); }
  line(c, [[x, y], [x, y - r * 0.68]], 6, INK);
  const a = -PI / 2 + PI / 6; line(c, [[x, y], [x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45]], 8, INK);
  shape(c, () => ell(c, x, y, 7, 7), INK, 0);
};
// breath: three wavy puffs of wet air from x1 to x2 at height y, and the cloudy patch they leave
const breath = (c: Ctx, x1: number, y: number, x2: number) => {
  for (const dy of [-20, 0, 20]) { const pts: number[][] = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push([x1 + (x2 - x1) * t, y + dy + Math.sin(t * PI * 2.5) * 7]); } c.globalAlpha = 0.85; line(c, pts, 7, COL.waterDk); c.globalAlpha = 1; }
};
const cloud = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.globalAlpha = 0.92; c.beginPath();
  for (const [dx, dy, k] of [[0, 0, 1], [-0.45, -0.35, 0.6], [0.4, -0.4, 0.55], [0.45, 0.4, 0.6], [-0.4, 0.45, 0.55]]) { c.moveTo(x + dx * rx + rx * k, y + dy * ry); ell(c, x + dx * rx, y + dy * ry, rx * k, ry * k); }
  c.fillStyle = "#eef6ff"; c.fill(); c.globalAlpha = 1;
};
// an open mouth saying "haaa", on a face whose centre is (x, hy) with head radius head
const sayHaa = (c: Ctx, x: number, hy: number, head: number, skin: string) => {
  shape(c, () => ell(c, x, hy + head * 0.52, head * 0.36, head * 0.3), skin, 0);
  shape(c, () => ell(c, x, hy + head * 0.52, head * 0.2, head * 0.19), "#7a3b45", 3);
};
// a steel plate seen face on, standing up, centre (x, y)
const plateUp = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.steel); shade(c, () => ell(c, x, y, rx, ry), COL.steelDk, rx * 0.25, ry * 0.1, 0.4);
  shape(c, () => ell(c, x, y - ry * 0.03, rx * 0.84, ry * 0.84), COL.steelIn, 4);
};

// ---------------------------------------------------------------- animals, small
const hen = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const B = "#c9773c", BD = "#9c5728";
  shape(c, () => polyP(c, [[-38, -8], [-82, -58], [-64, -16], [-92, -30], [-58, 6]]), BD, 5);
  for (const k of [-14, 14]) { line(c, [[k, 30], [k + 2, 62]], 10, INK); line(c, [[k, 30], [k + 2, 62]], 5, COL.orange); line(c, [[k - 12, 66], [k + 2, 62], [k + 14, 66]], 5, COL.orange); line(c, [[k + 2, 62], [k + 2, 70]], 5, COL.orange); }
  const body = () => ell(c, 0, 0, 56, 38); shape(c, body, B); shade(c, body, BD, 14, 10, 0.5);
  shape(c, () => { c.moveTo(-20, -14); c.quadraticCurveTo(30, -18, 26, 14); c.quadraticCurveTo(0, 22, -20, -14); c.closePath(); }, BD, 4);
  shape(c, () => { c.moveTo(22, -28); c.quadraticCurveTo(36, -60, 56, -52); c.lineTo(58, -20); c.closePath(); }, B, 5);
  shape(c, () => ell(c, 52, -46, 22, 20), B, 5);
  for (const k of [-10, 2, 14]) shape(c, () => ell(c, 50 + k, -66 + Math.abs(k) * 0.3, 7, 8), COL.red, 3);
  shape(c, () => polyP(c, [[70, -50], [92, -42], [70, -34]]), COL.yellow, 4);
  shape(c, () => ell(c, 66, -28, 6, 9), COL.red, 3);
  shape(c, () => ell(c, 58, -50, 4, 4), INK, 0);
  c.restore();
};
const chick = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const k of [-10, 10]) { line(c, [[k, 24], [k, 44]], 8, INK); line(c, [[k, 24], [k, 44]], 4, COL.orange); line(c, [[k - 9, 47], [k, 44], [k + 9, 47]], 4, COL.orange); }
  const body = () => ell(c, 0, 4, 32, 26); shape(c, body, COL.yellow); shade(c, body, "#e0b020", 8, 6, 0.45);
  shape(c, () => { c.moveTo(-6, -2); c.quadraticCurveTo(-30, 0, -22, 16); c.quadraticCurveTo(-6, 16, -6, -2); c.closePath(); }, "#e0b020", 3);
  shape(c, () => ell(c, 16, -22, 22, 20), COL.yellow, 5);
  shape(c, () => polyP(c, [[34, -24], [50, -18], [34, -12]]), COL.orange, 3);
  shape(c, () => ell(c, 22, -26, 3.5, 3.5), INK, 0);
  c.restore();
};
const crow = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const k of [-12, 8]) { line(c, [[k, 20], [k + 2, 40]], 5, INK); line(c, [[k - 8, 42], [k + 2, 40], [k + 12, 42]], 4, INK); }
  shape(c, () => polyP(c, [[-40, -4], [-80, -24], [-74, 4], [-40, 12]]), COL.black, 4);
  const body = () => ell(c, 0, 0, 46, 24); shape(c, body, COL.black, 4); shade(c, body, "#1c1826", 10, 6, 0.6);
  shape(c, () => { c.moveTo(-18, -12); c.quadraticCurveTo(26, -16, 20, 10); c.quadraticCurveTo(0, 14, -18, -12); c.closePath(); }, "#4a4458", 3);
  shape(c, () => ell(c, 40, -20, 19, 16), COL.black, 4);
  shape(c, () => polyP(c, [[56, -24], [82, -16], [56, -11]]), COL.greyDk, 3);
  shape(c, () => ell(c, 46, -24, 5, 5), WHITE, 2); shape(c, () => ell(c, 47, -24, 2.5, 2.5), INK, 0);
  c.restore();
};

// ================================================================ set-up cards: the droopy mint experiment
// 1. a plate with two droopy mint sprigs, a dry tej patta and a paper leaf; the child's hand feels a sprig
const setupE1a = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 450, 250);
  mint(c, [200, 500], [370, 400], [530, 440], 3, 80, 0.75);
  mint(c, [220, 690], [390, 600], [540, 640], 3, 80, 0.75);
  paperLeaf(c, 590, 520, 290, -0.12, 0);
  tej(c, 600, 690, 270, 0.15);
  hand(c, 470, 870, -1.9, 1.4, SKIN.child, CLOTH.child, true);
};
// 2. three tumblers of water: droopy mint, tej patta, paper leaf; one droopy sprig on a dry plate
const setupE1b = (c: Ctx) => {
  ground(c);
  for (const x of [180, 420, 660]) tumbler(c, x, 760, 170, 250);
  mint(c, [180, 508], [178, 330], [262, 318], 3, 62, 0.85); rimFront(c, 180, 510, 170);
  tej(c, 425, 505, 250, -1.15); rimFront(c, 420, 510, 170);
  paperLeaf(c, 655, 505, 260, -1.35, 0); rimFront(c, 660, 510, 170);
  plate(c, 905, 800, 140, 72);
  mint(c, [800, 800], [900, 740], [1000, 790], 3, 50, 0.7);
};
// 3. an hour later: the mint stands up firm, the tej patta is the same, the paper leaf has flopped over
const setupE1c = (c: Ctx) => {
  ground(c);
  for (const x of [180, 420, 660]) tumbler(c, x, 760, 170, 250);
  mint(c, [180, 508], [184, 380], [195, 240], 3, 64, 0); rimFront(c, 180, 510, 170);
  tej(c, 425, 505, 250, -1.15); rimFront(c, 420, 510, 170);
  paperLeaf(c, 655, 505, 260, -1.35, 2.4); rimFront(c, 660, 510, 170);
  plate(c, 905, 800, 140, 72);
  mint(c, [800, 805], [900, 770], [1000, 800], 3, 44, 1);
  clock(c, 930, 170, 70);
};

// ================================================================ card pictures
// three plates: alive (potato, mint in a glass), once alive (wooden spoon, coconut shell, tej patta), never alive (steel spoon, stone, salt, marble)
const flowA1 = (c: Ctx) => {
  ground(c);
  plate(c, 300, 400, 210, 105); plate(c, 780, 400, 210, 105); plate(c, 540, 770, 220, 110);
  potato(c, 230, 400, 72, 52, 0.2);
  glass(c, 385, 440, 70, 120, 0.55); mint(c, [385, 322], [388, 250], [395, 190], 2, 55, 0);
  spoon(c, 740, 370, 230, -0.45); coconut(c, 895, 400, 55); tej(c, 690, 470, 150, 0.1);
  spoon(c, 450, 775, 210, -0.5, COL.steel, COL.steelDk, COL.steelIn); stone(c, 640, 740, 50, 3); salt(c, 615, 835, 55); marble(c, 710, 800, 22);
  tag(c, 170, 250, () => plantIcon(c, 170, 250));
  tag(c, 900, 250, () => tickLeafIcon(c, 900, 250));
  tag(c, 330, 630, () => stone(c, 330, 632, 32, 7));
};
// breath on a steel plate: the grown-up holds the plate, the child breathes "haaa" on it, a cloudy patch appears
const flowA2 = (c: Ctx) => {
  ground(c); floor(c, 950);
  person(c, 330, 950, 720, { adult: true, reachR: [490, 578] });
  plateUp(c, 585, 560, 95, 135);
  cloud(c, 622, 560, 40, 58);
  person(c, 850, 950, 520, {});
  sayHaa(c, 850, 950 - 0.838 * 520, 78, SKIN.child);
  breath(c, 762, 556, 690);
};
// I am growing: the child's hand flat on paper, the grown-up draws round it with a pencil, the date beside
const flowA3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1030, 420, 20);
  shape(c, () => rrect(c, 110, 250, 830, 780, 6), COL.paper, 5);
  write(c, "6-11-2026", 520, 320, 54, INK, 6);
  const hx = 470, hy = 840, s = 2.2;
  const local: number[][] = [[-30, 50], [40, 50], [84, 47], [96, 40], [100, 28], [104, 20], [106, 10], [104, -2], [105, -10], [100, -20], [98, -30], [90, -40], [72, -56], [60, -64]];
  const pts = local.map(([px, py]) => [hx + py * s, hy - px * s]);
  c.beginPath(); smooth(c, pts); c.strokeStyle = "#6f6a73"; c.lineWidth = 5; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  hand(c, hx, hy, -PI / 2, s, SKIN.child, CLOTH.child, true);
  pencil(c, 202, 403, 329, 708);
  hand(c, 184, 650, -0.395, 1.6, SKIN.adult, CLOTH.adult);
};
// a toy that seems alive: the child holds a string, a folded paper snake wiggles on it
const flowC1 = (c: Ctx) => {
  ground(c); floor(c, 940);
  shape(c, () => { ell(c, 170, 905, 50, 22); c.moveTo(200, 905); ell(c, 170, 905, 28, 12); }, COL.steelIn, 5);
  for (const [x, col] of [[250, COL.red], [285, COL.blue], [320, COL.green]] as [number, string][]) shape(c, () => rrect(c, x, 880, 16, 50, 4), col, 4);
  const { handR } = person(c, 440, 940, 620, { reachR: [640, 430] });
  const hx = handR[0], hy = handR[1];
  line(c, [[hx, hy], [hx, hy + 60]], 4, INK);
  const pts: number[][] = [[hx, hy + 120], [hx - 42, hy + 178], [hx + 42, hy + 236], [hx - 42, hy + 294], [hx + 42, hy + 352], [hx - 42, hy + 410], [hx + 30, hy + 468], [hx + 150, 925]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], an = Math.atan2(by - ay, bx - ax), nx = -Math.sin(an) * 17, ny = Math.cos(an) * 17;
    shape(c, () => polyP(c, [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]]), i % 2 ? COL.greenLt : COL.green, 5);
  }
  shape(c, () => ell(c, hx, hy + 92, 42, 32), COL.green, 5);
  for (const s of [-1, 1]) { shape(c, () => ell(c, hx + s * 16, hy + 84, 9, 9), WHITE, 3); shape(c, () => ell(c, hx + s * 16, hy + 85, 4, 4), INK, 0); }
  line(c, [[hx + 40, hy + 100], [hx + 66, hy + 104], [hx + 76, hy + 96]], 4, COL.red); line(c, [[hx + 66, hy + 104], [hx + 76, hy + 112]], 4, COL.red);
  for (const [x, y, s] of [[hx - 90, hy + 240, -1], [hx + 90, hy + 300, 1], [hx - 90, hy + 380, -1]]) { c.beginPath(); c.arc(x, y, 24, s > 0 ? -1.2 : PI - 1.2, s > 0 ? 1.2 : PI + 1.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
// mother and baby: cards face down in four rows of five, two turned up: a hen and a chick
const flowG1 = (c: Ctx) => {
  ground(c);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) {
    const x = 160 + k * 190, y = 210 + r * 220, up = (r === 1 && k === 1) || (r === 1 && k === 3);
    shadow(c, x + 8, y + 102, 72, 10);
    shape(c, () => rrect(c, x - 75, y - 97, 150, 194, 10), up ? COL.paper : COL.blue, 5);
    if (!up) { c.strokeStyle = COL.sky; c.lineWidth = 4; c.beginPath(); rrect(c, x - 61, y - 83, 122, 166, 6); c.stroke(); c.beginPath(); polyP(c, [[x, y - 50], [x + 40, y], [x, y + 50], [x - 40, y]]); c.stroke(); }
    else if (k === 1) hen(c, x, y + 10, 0.72); else chick(c, x, y + 14, 1.25);
  }
};
// wiggle, sit or statue: the three moves, each with its calling card above
const y0 = 300;
const flowG2 = (c: Ctx) => {
  ground(c); floor(c, 932);
  for (const x of [215, 540, 865]) { shadow(c, x + 6, y0 + 60, 78, 10); shape(c, () => rrect(c, x - 75, y0 - 55, 150, 110, 8), COL.paper, 5); }
  crow(c, 215, y0 + 8, 0.75); spoon(c, 540, y0, 110, -0.6); stone(c, 865, y0 + 8, 34, 9);
  c.save(); c.translate(215, 932); c.rotate(0.1); c.translate(-215, -932);
  person(c, 215, 932, 400, { armL: [-PI * 0.8, -PI * 0.4], armR: [-PI * 0.2, -PI * 0.6] });
  c.restore();
  for (const [x, y, s] of [[105, 620, -1], [335, 690, 1], [95, 760, -1]]) { c.beginPath(); c.arc(x, y, 22, s > 0 ? -1.2 : PI - 1.2, s > 0 ? 1.2 : PI + 1.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  person(c, 540, 932, 400, { sit: true, dir: 1, reachL: [450, 895], reachR: [630, 895] });
  shape(c, () => rrect(c, 790, 900, 150, 32, 4), COL.grey, 5);
  person(c, 865, 900, 400, { armL: [PI * 0.6, PI * 0.6], armR: [PI * 0.4, PI * 0.4] });
};
// never alive: a stone, a steel spoon and a heap of salt on a plate
const term1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 620, 440, 235);
  stone(c, 300, 600, 95, 3);
  spoon(c, 560, 650, 330, -0.5, COL.steel, COL.steelDk, COL.steelIn);
  salt(c, 820, 640, 85);
};
// once alive and never alive: two baskets
const expl1 = (c: Ctx) => {
  ground(c);
  basketBack(c, 290, 820, 430, 250);
  spoon(c, 200, 520, 300, -1.25); coconut(c, 330, 520, 60); tej(c, 400, 560, 200, -1.0);
  basketFront(c, 290, 820, 430, 250);
  basketBack(c, 790, 820, 430, 250);
  tumbler(c, 700, 700, 150, 220); stone(c, 840, 560, 60, 11); spoon(c, 900, 560, 240, -1.1, COL.steel, COL.steelDk, COL.steelIn); salt(c, 935, 486, 40);
  basketFront(c, 790, 820, 430, 250);
};
// breathe: the child holds a cool steel plate and breathes out on it; a cloudy patch appears
const term3 = (c: Ctx) => {
  ground(c); floor(c, 960);
  person(c, 500, 960, 600, { reachR: [693, 480] });
  plateUp(c, 780, 500, 85, 125);
  cloud(c, 812, 500, 36, 52);
  sayHaa(c, 500, 960 - 0.838 * 600, 90, SKIN.child);
  breath(c, 600, 500, 690);
};

export const ic_whatIsLifeSignsOfLifeL1 = cards("sci.what-is-life.signs-of-life.L1", [setupE1a, setupE1b, setupE1c, flowA1, flowA2, flowA3, flowC1, flowG1, flowG2, term1, expl1, term3]);
