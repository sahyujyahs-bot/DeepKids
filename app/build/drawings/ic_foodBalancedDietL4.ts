import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, glass, bowl, plate, seed, leaf, hand, person, write, cards } from "./flatKit";

// ONE BOWL, SIX TASTES (sci.food.balanced-diet.L4) · flat set-up cards and card pictures.
// The same child (orange shirt) and grown-up (blue shirt) on every card; light from the upper left.

const TABLE = "#e2d3b4", WALL = "#f3ead8", COUNTER = "#d9b77a", DARK = "#6f6257", DARK2 = "#5f544a";
const LIQ = { sugar: COL.water, salt: COL.water, lemon: "#f3e3a0", karela: "#cfe3a8", water: COL.water };
const CUPS = [LIQ.sugar, LIQ.salt, LIQ.lemon, LIQ.karela, LIQ.water];
const TASTE = { sweet: COL.pink, salty: COL.blue, sour: COL.yellow, bitter: COL.green };

// ---------------------------------------------------------------- small helpers
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.13, 0.65], [0.47, 0.65]]],
  B: [[[0.05, 1], [0.05, 0], [0.38, 0], [0.55, 0.12], [0.55, 0.38], [0.38, 0.5], [0.05, 0.5]], [[0.38, 0.5], [0.58, 0.62], [0.58, 0.88], [0.38, 1], [0.05, 1]]],
  C: [[[0.58, 0.15], [0.35, 0], [0.1, 0.15], [0.02, 0.5], [0.1, 0.85], [0.35, 1], [0.58, 0.85]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a white paper tag centred at (x, y) with a number (or one letter A/B/C) on it
const tag = (c: Ctx, x: number, y: number, t: string, isLetter = false) => {
  const w = 40 + t.length * 34, h = 64, th = 40, tw = isLetter ? th * 0.6 : (t.length - 1) * th * 0.8 + th * 0.6;
  shadow(c, x + 6, y + h / 2 + 4, w / 2, 8);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), WHITE, 5);
  if (isLetter) letter(c, t, x - tw / 2, y - th / 2, th); else write(c, t, x - tw / 2, y - th / 2, th, INK, 6);
};
// the table or floor: a darker flat band from y down, with an edge line
const floor = (c: Ctx, y: number, col = TABLE) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
// where person() put the head: its radius and centre y, for drawing on the face afterwards
const face = (y: number, h: number, ad = false) => { const head = h * (ad ? 0.115 : 0.15); return { head, hy: y - h * (ad ? 0.76 : 0.67) - head * 1.12 }; };
const eyesShut = (c: Ctx, x: number, y: number, h: number, ad = false) => {
  const { head, hy } = face(y, h, ad), skin = ad ? SKIN.adult : SKIN.child;
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.16, head * 0.2, head * 0.25), skin, 0);
    c.beginPath(); c.arc(x + s * head * 0.38, hy + head * 0.08, head * 0.15, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  }
};
// an open mouth with the tongue stuck out; returns the tongue's tip
const tongueOut = (c: Ctx, x: number, y: number, h: number): [number, number] => {
  const { head, hy } = face(y, h), my = hy + head * 0.5;
  shape(c, () => ell(c, x, my, head * 0.3, head * 0.16), INK, 0);
  shape(c, () => { c.moveTo(x - head * 0.2, my); c.lineTo(x + head * 0.2, my); c.quadraticCurveTo(x + head * 0.24, my + head * 0.6, x, my + head * 0.62); c.quadraticCurveTo(x - head * 0.24, my + head * 0.6, x - head * 0.2, my); c.closePath(); }, COL.pink, 4);
  line(c, [[x, my + head * 0.15], [x, my + head * 0.48]], 2.5, "#d87a98");
  return [x, my + head * 0.62];
};
// a cotton bud from the hand (x1, y1) to its tip at (x2, y2)
const bud = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), ex = x1 - Math.cos(an) * 26, ey = y1 - Math.sin(an) * 26;
  line(c, [[ex, ey], [x2, y2]], 11, INK); line(c, [[ex, ey], [x2, y2]], 5, WHITE);
  for (const [px, py] of [[ex, ey], [x2, y2]]) shape(c, () => ell(c, px, py, 13, 10, an), WHITE, 4);
};
// a flat digital kitchen scale, bottom centre (x, y), showing txt (digits and g)
const scaleDev = (c: Ctx, x: number, y: number, w: number, txt: string) => {
  const h = w * 0.28, top = y - h;
  shadow(c, x + 10, y + 8, w * 0.55, 16);
  shape(c, () => polyP(c, [[x - w * 0.42, top], [x + w * 0.42, top], [x + w * 0.5, top + h * 0.6], [x - w * 0.5, top + h * 0.6]]), COL.teal);
  shape(c, () => polyP(c, [[x - w * 0.5, top + h * 0.6], [x + w * 0.5, top + h * 0.6], [x + w * 0.5, y], [x - w * 0.5, y]]), COL.tealDk);
  shape(c, () => rrect(c, x - w * 0.2, top + h * 0.64, w * 0.4, h * 0.32, 6), "#22303a", 4);
  const th = h * 0.2, tw = (txt.length - 1) * th * 0.8 + th * 0.6;
  write(c, txt, x - tw / 2, top + h * 0.7, th, "#c9f06b", 5);
};
// a steel cooking pan seen from the front, bottom centre (x, y), two ear handles
const pan = (c: Ctx, x: number, y: number, w: number, h: number, liquid = COL.water) => {
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 + 10) - 12, y - h + 8, 24, 14, 6), COL.black, 4);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 10);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.13), liquid, 5);
};
// a kitchen timer or clock, centre (x, y): the red sector and hand show frac of a turn gone
const timer = (c: Ctx, x: number, y: number, r: number, frac: number) => {
  shape(c, () => rrect(c, x - r * 0.25, y - r - 14, r * 0.5, 20, 5), COL.red, 4);
  shape(c, () => ell(c, x, y, r, r), WHITE, 5);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], k % 3 ? 2.5 : 5); }
  const a = -Math.PI / 2 + frac * Math.PI * 2;
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.7, -Math.PI / 2, a); c.closePath(); c.fillStyle = COL.red; c.globalAlpha = 0.3; c.fill(); c.globalAlpha = 1;
  line(c, [[x, y], [x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72]], 6, RED);
  shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), INK, 0);
};
// a steel spoon: handle end in the hand at (hx, hy), bowl centre at (bx, by)
const spoon = (c: Ctx, hx: number, hy: number, bx: number, by: number, r = 26) => {
  const an = Math.atan2(by - hy, bx - hx), p1 = [hx - Math.cos(an) * 22, hy - Math.sin(an) * 22], p2 = [bx - Math.cos(an) * r * 0.8, by - Math.sin(an) * r * 0.8];
  line(c, [p1, p2], 16, INK); line(c, [p1, p2], 8, COL.steel);
  shape(c, () => ell(c, bx, by, r, r * 0.68, an), COL.steel, 5); shape(c, () => ell(c, bx, by, r * 0.62, r * 0.4, an), COL.steelDk, 0);
};
// a pencil with its tip at (tx, ty), the body running back at angle an
const pencil = (c: Ctx, tx: number, ty: number, an: number, len = 150) => {
  c.save(); c.translate(tx, ty); c.rotate(an);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(26, -10); c.lineTo(26, 10); c.closePath(); }, "#e8c9a0", 4);
  shape(c, () => rrect(c, 26, -10, len - 26, 20, 3), COL.yellow, 4);
  shape(c, () => rrect(c, len - 18, -10, 18, 20, 3), COL.pink, 4);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(9, -3.5); c.lineTo(9, 3.5); c.closePath(); }, INK, 0);
  c.restore();
};
// a white sprout root along pts
const tail = (c: Ctx, pts: number[][], w: number) => {
  const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; p(); c.strokeStyle = INK; c.lineWidth = w + 7; c.stroke(); p(); c.strokeStyle = COL.paper; c.lineWidth = w; c.stroke();
};
// a heap of moong seeds filling an ellipse (x, y, rx, ry)
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, r: number, soaked: boolean, sd: number, tails = false) => {
  shape(c, () => ell(c, x, y, rx, ry), soaked ? COL.green : COL.greenDk, 5);
  const g = rnd(sd);
  for (let i = 0; i < n; i++) {
    const a = g() * Math.PI * 2, d = Math.sqrt(g()), sx = x + Math.cos(a) * (rx - r) * d, sy = y + Math.sin(a) * (ry - r * 0.7) * d;
    if (tails) tail(c, [[sx, sy], [sx + 8 + g() * 10, sy + 12 + g() * 8], [sx + 14 + g() * 14, sy + 26 + g() * 8]], r * 0.3);
    seed(c, sx, sy, r, g() * 3, soaked);
  }
};
// a tongue seen from above: x centre, y the back edge, h down to the tip
const tongueTop = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w / 2, y + 30); c.quadraticCurveTo(x, y - 20, x + w / 2, y + 30); c.bezierCurveTo(x + w / 2, y + h * 0.55, x + w * 0.3, y + h, x, y + h); c.bezierCurveTo(x - w * 0.3, y + h, x - w / 2, y + h * 0.55, x - w / 2, y + 30); c.closePath(); };
  shape(c, p, COL.pink); shade(c, p, "#d87a98", w * 0.08, -h * 0.03, 0.35);
  line(c, [[x, y + h * 0.12], [x, y + h * 0.86]], 5, "#c9607f");
};
// the four test zones drawn on a tongue: back, two edges, tip
const zones = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.save(); c.setLineDash([14, 12]);
  line(c, [[x - w / 2, y + h * 0.3], [x + w / 2, y + h * 0.3]], 4); line(c, [[x - w * 0.42, y + h * 0.75], [x + w * 0.42, y + h * 0.75]], 4);
  line(c, [[x - w * 0.22, y + h * 0.3], [x - w * 0.22, y + h * 0.75]], 4); line(c, [[x + w * 0.22, y + h * 0.3], [x + w * 0.22, y + h * 0.75]], 4);
  c.restore();
};
const dot = (c: Ctx, x: number, y: number, col: string, r = 16) => shape(c, () => ell(c, x, y, r, r), col, 4);
const tick = (c: Ctx, x: number, y: number, s = 1) => line(c, [[x - 14 * s, y], [x - 4 * s, y + 12 * s], [x + 16 * s, y - 14 * s]], 5, COL.greenDk);
// a sheet of paper
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 14); shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 5); };
// a heap of rice: white dome with a few grain marks
const rice = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 5);
  const g = rnd(31); for (let i = 0; i < 9; i++) { const gx = x - rx * 0.6 + g() * rx * 1.2, gy = y - ry * 0.5 + g() * ry; line(c, [[gx, gy], [gx + rx * 0.08, gy + ry * 0.06]], 3, COL.grey); }
};
// a round flatbread
const roti = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, spot: string, sd = 5) => {
  shape(c, () => ell(c, x, y, rx, ry), col, 5);
  const g = rnd(sd); for (let i = 0; i < 7; i++) { const a = g() * Math.PI * 2, d = Math.sqrt(g()) * 0.7; shape(c, () => ell(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, rx * 0.09, ry * 0.09), spot, 0); }
};
const laddu = (c: Ctx, x: number, y: number, r: number, col = COL.orange, dots = COL.yellow) => {
  shape(c, () => ell(c, x, y, r, r), col, 5); shade(c, () => ell(c, x, y, r, r), COL.woodDk, r * 0.3, -r * 0.1, 0.35);
  for (let k = 0; k < 5; k++) { const a = k * 1.3 + 0.4; shape(c, () => ell(c, x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.1, r * 0.1), dots, 0); }
};
// a banana leaf lying flat, centre (x, y)
const bananaLeaf = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w / 2, y - h / 2, x - w * 0.2, y - h / 2); c.lineTo(x + w * 0.3, y - h / 2); c.quadraticCurveTo(x + w / 2, y - h / 2, x + w / 2, y); c.quadraticCurveTo(x + w / 2, y + h / 2, x + w * 0.3, y + h / 2); c.lineTo(x - w * 0.2, y + h / 2); c.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y); c.closePath(); };
  shadow(c, x + 12, y + h / 2 + 6, w / 2, 16);
  shape(c, p, COL.leaf); shade(c, p, COL.leafDk, w * 0.04, -h * 0.05, 0.3);
  line(c, [[x - w / 2 + 10, y], [x + w / 2 - 10, y]], 7, COL.leafDk);
  c.save(); c.beginPath(); p(); c.clip(); c.globalAlpha = 0.5;
  for (let k = -6; k <= 6; k++) { const vx = x + k * w * 0.075; line(c, [[vx, y], [vx + 18, y - h * 0.46]], 2.5, COL.leafDk); line(c, [[vx, y], [vx + 18, y + h * 0.46]], 2.5, COL.leafDk); }
  c.restore(); c.globalAlpha = 1;
};

// ---------------------------------------------------------------- e1 · the blind taste test
// 1. five numbered cups in a row, the folded key beside them
const sE1_0 = (c: Ctx) => {
  ground(c, WALL); floor(c, 260);
  for (let i = 0; i < 5; i++) {
    const x = 140 + i * 200; bowl(c, x, 470, 100, CUPS[i]);
    if (i < 2) { const g = rnd(3 + i); for (let k = 0; k < 7; k++) shape(c, () => ell(c, x - 55 + g() * 110, 466 + g() * 10, 3, 2.5), WHITE, 0); }
    tag(c, x, 650, String(i + 1));
  }
  // the key: a sheet folded in half, lying face down
  shadow(c, 560, 930, 180, 16);
  shape(c, () => rrect(c, 380, 830, 320, 90, 6), COL.paper, 5);
  shape(c, () => rrect(c, 380, 780, 320, 70, 6), "#f1e8d6", 5);
  line(c, [[380, 850], [700, 850]], 4, COL.greyDk);
};
// 2. the child, eyes shut and tongue out; the grown-up touches a damp bud to the tip of the tongue
const sE1_1 = (c: Ctx) => {
  ground(c, WALL); floor(c, 900);
  person(c, 360, 900, 540);
  eyesShut(c, 360, 900, 540);
  const tip = tongueOut(c, 360, 900, 540);
  const ad = person(c, 680, 900, 720, { adult: true, reachL: [448, 498] });
  bud(c, ad.handL[0], ad.handL[1], tip[0] + 6, tip[1] - 8);
};
// 3. the tongue drawing with its four zones, and the table to tick
const sE1_2 = (c: Ctx) => {
  ground(c); paper(c, 60, 70, 960, 940);
  tongueTop(c, 400, 200, 400, 560); zones(c, 400, 200, 400, 560);
  // the table: 4 zones across, 5 cups down
  const gx = 660, gy = 420, cw = 80, ch = 80;
  shape(c, () => rrect(c, gx, gy, cw * 4, ch * 5, 4), WHITE, 5);
  for (let k = 1; k < 4; k++) line(c, [[gx + k * cw, gy], [gx + k * cw, gy + ch * 5]], 3); for (let k = 1; k < 5; k++) line(c, [[gx, gy + k * ch], [gx + cw * 4, gy + k * ch]], 3);
  for (let k = 0; k < 5; k++) write(c, String(k + 1), gx - 50, gy + k * ch + 22, 36, INK, 5);
  [[0, 0], [1, 0], [3, 0], [2, 1], [0, 1]].forEach(([i, j]) => tick(c, gx + i * cw + cw / 2, gy + j * ch + ch / 2));
  pencil(c, 640, 930, -0.35, 200);
};
// 4. rinse and spit into a bowl; the clock shows 20 seconds
const sE1_3 = (c: Ctx) => {
  ground(c, WALL); floor(c, 900);
  timer(c, 850, 270, 130, 20 / 60); write(c, "20", 762, 292, 56, RED, 7);
  glass(c, 560, 668, 72, 120, 0.4);
  bowl(c, 180, 620, 100, COL.water);
  person(c, 430, 900, 560, { reachL: [272, 614], reachR: [548, 612] });
  const { head, hy } = face(900, 560), my = hy + head * 0.5;
  shape(c, () => ell(c, 430, my, head * 0.16, head * 0.12), INK, 0);
  c.beginPath(); c.moveTo(414, my + 4); c.quadraticCurveTo(300, 500, 205, 606); c.strokeStyle = COL.waterDk; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  for (const [px, py] of [[350, 505], [290, 540], [240, 585]]) shape(c, () => ell(c, px, py, 6, 8), COL.drop, 3);
};

// ---------------------------------------------------------------- e2 · wake up the moong
// 1. three bowls A, B, C with 50 g of moong each; A on the scale, B and C in water
const sE2_0 = (c: Ctx) => {
  ground(c, WALL); floor(c, 330);
  scaleDev(c, 540, 920, 460, "50 g");
  bowl(c, 540, 720, 105); heap(c, 540, 700, 90, 40, 60, 12, false, 7); tag(c, 540, 592, "A", true);
  for (const [x, sd] of [[175, 11], [905, 12]]) { bowl(c, x, 640, 125, COL.water); const g = rnd(sd); for (let k = 0; k < 22; k++) { const a = g() * Math.PI * 2, d = Math.sqrt(g()); seed(c, x + Math.cos(a) * 96 * d, 640 + Math.sin(a) * 14 * d, 12, g() * 3, true); } }
  tag(c, 175, 470, "B", true); tag(c, 905, 470, "C", true);
};
// 2. the soaked moong draining in a sieve under a damp cloth, in a dark corner
const sE2_1 = (c: Ctx) => {
  ground(c, DARK); c.fillStyle = DARK2; c.fillRect(760, 0, D - 760, 620); line(c, [[760, 0], [760, 620]], 4, "#4a413a");
  floor(c, 620);
  plate(c, 520, 770, 240, 70);
  for (const [x, y] of [[470, 700], [540, 720], [600, 690]]) shape(c, () => { c.moveTo(x, y - 18); c.quadraticCurveTo(x + 12, y, x, y + 8); c.quadraticCurveTo(x - 12, y, x, y - 18); c.closePath(); }, COL.drop, 3);
  const sv = () => { c.moveTo(320, 560); c.bezierCurveTo(340, 720, 700, 720, 720, 560); c.closePath(); };
  shape(c, sv, COL.steelIn);
  c.save(); c.beginPath(); sv(); c.clip(); c.globalAlpha = 0.6; for (let k = 330; k < 720; k += 26) line(c, [[k, 540], [k, 720]], 2.5, COL.steelDk); for (let k = 580; k < 700; k += 26) line(c, [[300, k], [740, k]], 2.5, COL.steelDk); c.restore(); c.globalAlpha = 1;
  line(c, [[720, 560], [900, 548]], 22, INK); line(c, [[720, 560], [900, 548]], 12, COL.black); shape(c, () => ell(c, 912, 547, 16, 16), COL.black, 5);
  shape(c, () => ell(c, 520, 560, 200, 34), COL.steel, 6);
  heap(c, 520, 552, 170, 26, 45, 15, true, 21);
  // the damp cloth lies over the right half of the sieve and hangs down its side
  const cl = () => { c.moveTo(480, 528); c.quadraticCurveTo(560, 500, 640, 516); c.quadraticCurveTo(700, 530, 740, 540); c.quadraticCurveTo(790, 600, 770, 680); c.quadraticCurveTo(730, 712, 690, 690); c.quadraticCurveTo(650, 716, 610, 690); c.quadraticCurveTo(570, 712, 540, 680); c.quadraticCurveTo(500, 620, 480, 528); c.closePath(); };
  shape(c, cl, "#dfe6ea"); shade(c, cl, "#b3c2cb", 36, -16, 0.4);
  c.beginPath(); c.moveTo(560, 520); c.quadraticCurveTo(580, 600, 600, 690); c.strokeStyle = "#9aacb6"; c.lineWidth = 3; c.stroke();
  c.beginPath(); c.moveTo(660, 522); c.quadraticCurveTo(690, 600, 690, 690); c.stroke();
  for (const [x, y] of [[600, 560], [700, 580], [640, 630]]) shape(c, () => ell(c, x, y, 8, 6), COL.drop, 2.5);
};
// 3. measuring a sprout's tail on the ruler; the scale shows the heavier batch
const sE2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 580, 715, 340, 16);
  shape(c, () => rrect(c, 240, 600, 660, 100, 6), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(243, 682, 654, 15);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 58; mm++) { const x = 270 + mm * 10.4, h = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, 600); c.lineTo(x, 600 + h); c.stroke(); }
  for (let cm = 0; cm <= 5; cm++) write(c, String(cm), 270 + cm * 104 - 10, 642, 30, INK, 5);
  hand(c, 170, 650, 0, 1.1);
  tail(c, [[334, 582], [392, 594], [448, 599]], 14);
  seed(c, 304, 574, 38, 0.15, true);
  line(c, [[448, 584], [448, 612]], 6, RED);
  bowl(c, 800, 860, 110); heap(c, 800, 842, 95, 36, 40, 14, true, 23, true);
  scaleDev(c, 800, 1000, 420, "105 g");
};
// 4. three pans on the stove with three timers; the grown-up lifts a seed onto the plate
const sE2_3 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 60, 430, 600, 20, 4), COL.wood, 5);
  for (const x of [140, 350, 560]) timer(c, x, 388, 42, 0.25);
  c.fillStyle = COUNTER; c.fillRect(0, 640, 800, 260); line(c, [[0, 640], [800, 640], [800, 900]], 5); line(c, [[400, 660], [400, 880]], 4, COL.woodDk);
  floor(c, 900);
  shape(c, () => rrect(c, 60, 580, 580, 60, 8), COL.black);
  for (const [x, sd] of [[140, 1], [350, 2], [560, 3]]) {
    shape(c, () => ell(c, x, 584, 62, 12), COL.greyDk, 3);
    for (const dx of [-30, 0, 30]) shape(c, () => { c.moveTo(x + dx - 10, 592); c.lineTo(x + dx, 566); c.lineTo(x + dx + 10, 592); c.closePath(); }, COL.blue, 3);
    pan(c, x, 586, 140, 78);
    const g = rnd(sd); for (let k = 0; k < 8; k++) seed(c, x - 45 + g() * 90, 505 + g() * 8, 8, g() * 3, sd > 1);
  }
  plate(c, 720, 628, 72, 20); seed(c, 712, 624, 10, 0.3, true);
  const ad = person(c, 920, 900, 600, { adult: true, reachL: [780, 520] });
  spoon(c, ad.handL[0], ad.handL[1], 735, 585, 24); seed(c, 735, 582, 9, 0.2, true);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the test laid out: five cups, the tongue sheet with every taste found in every zone, water and buds
const fE1 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200; bowl(c, x, 230, 80, CUPS[i]); tag(c, x, 345, String(i + 1)); }
  paper(c, 80, 410, 560, 600);
  tongueTop(c, 360, 450, 380, 500); zones(c, 360, 450, 380, 500);
  const cols = [TASTE.sweet, TASTE.salty, TASTE.sour, TASTE.bitter];
  const cluster = (x: number, y: number) => cols.forEach((col, k) => dot(c, x + (k % 2 ? 22 : -22), y + (k < 2 ? -22 : 22), col, 15));
  cluster(360, 520); cluster(205, 715); cluster(515, 715); cluster(360, 880);
  glass(c, 840, 760, 130, 220, 0.6);
  for (const [x1, y1, x2, y2] of [[700, 900, 900, 870], [720, 950, 920, 925], [740, 1000, 940, 980]]) bud(c, x1, y1, x2, y2);
};
// flow.e2: the three batches side by side: dry, soaked, sprouted
const fE2 = (c: Ctx) => {
  ground(c, WALL); floor(c, 330);
  plate(c, 200, 600, 150, 58); heap(c, 200, 585, 100, 36, 45, 11, false, 41);
  plate(c, 540, 600, 150, 58); heap(c, 540, 583, 105, 38, 38, 15, true, 42);
  plate(c, 880, 600, 150, 58); heap(c, 880, 583, 105, 38, 30, 15, true, 43, true);
  tag(c, 200, 420, "A", true); tag(c, 540, 420, "B", true); tag(c, 880, 420, "C", true);
};
// flow.a1: six spoons round a bowl of pachadi: jaggery, tamarind, salt, karela, pepper, raw mango
const fA1 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 600, 190, "#9c8a4a");
  const g = rnd(55); for (let k = 0; k < 26; k++) { const a = g() * Math.PI * 2, d = Math.sqrt(g()) * 0.85, x = 540 + Math.cos(a) * 185 * d, y = 600 + Math.sin(a) * 34 * d, kind = k % 4; shape(c, () => (kind === 0 ? rrect(c, x - 10, y - 8, 20, 16, 4) : ell(c, x, y, kind === 1 ? 9 : 6, kind === 1 ? 7 : 6)), kind === 0 ? COL.greenLt : kind === 1 ? "#5a3a24" : kind === 2 ? COL.black : COL.leaf, 2.5); }
  const items = ["jaggery", "tamarind", "salt", "karela", "pepper", "mango"];
  items.forEach((it, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3, bx = 540 + Math.cos(a) * 330, by = 600 + Math.sin(a) * 300, hx = 540 + Math.cos(a) * 470, hy = 600 + Math.sin(a) * 440;
    spoon(c, hx, hy, bx, by, 44);
    if (it === "jaggery") { shape(c, () => rrect(c, bx - 24, by - 26, 48, 40, 8), COL.brown, 5); shade(c, () => rrect(c, bx - 24, by - 26, 48, 40, 8), COL.soilDk, 12, -6, 0.4); }
    if (it === "tamarind") shape(c, () => ell(c, bx, by - 8, 28, 22), "#5a3a24", 5);
    if (it === "salt") { shape(c, () => ell(c, bx, by - 6, 30, 20), WHITE, 5); for (let k = 0; k < 6; k++) shape(c, () => ell(c, bx - 18 + k * 7, by - 8 + (k % 2) * 8, 2.5, 2.5), COL.grey, 0); }
    if (it === "karela") { shape(c, () => ell(c, bx, by - 8, 30, 26), COL.green, 5); shape(c, () => ell(c, bx, by - 8, 18, 15), COL.greenLt, 3); for (let k = 0; k < 8; k++) { const t = (k / 8) * Math.PI * 2; shape(c, () => ell(c, bx + Math.cos(t) * 30, by - 8 + Math.sin(t) * 26, 5, 5), COL.greenDk, 0); } }
    if (it === "pepper") for (let k = 0; k < 9; k++) shape(c, () => ell(c, bx - 22 + (k % 3) * 20, by - 20 + Math.floor(k / 3) * 14, 7, 7), COL.black, 3);
    if (it === "mango") { const m = () => { c.moveTo(bx - 30, by - 4); c.quadraticCurveTo(bx - 20, by - 36, bx + 14, by - 30); c.quadraticCurveTo(bx + 34, by - 20, bx + 24, by + 8); c.closePath(); }; shape(c, m, COL.greenLt, 5); line(c, [[bx - 22, by - 6], [bx + 10, by - 24]], 4, COL.green); }
  });
};
// flow.a2: the seven-day diary: a row for each food job and one for sweets and packets, tally marks going in
const fA2 = (c: Ctx) => {
  ground(c); paper(c, 70, 100, 940, 870);
  const gx = 110, gy = 160, lw = 130, cw = 104, hh = 70, rh = 150;
  shape(c, () => rrect(c, gx, gy, lw + cw * 7, hh + rh * 4, 4), WHITE, 5);
  line(c, [[gx + lw, gy], [gx + lw, gy + hh + rh * 4]], 4); for (let k = 1; k < 7; k++) line(c, [[gx + lw + k * cw, gy], [gx + lw + k * cw, gy + hh + rh * 4]], 3);
  for (let k = 0; k < 4; k++) line(c, [[gx, gy + hh + k * rh], [gx + lw + cw * 7, gy + hh + k * rh]], 3);
  for (let k = 0; k < 7; k++) write(c, String(k + 1), gx + lw + k * cw + 38, gy + 16, 40, INK, 6);
  const ry = (k: number) => gy + hh + k * rh + rh / 2, lx = gx + lw / 2;
  roti(c, lx, ry(0), 44, 34, COL.wood, COL.woodDk);
  bowl(c, lx, ry(1) - 6, 40, COL.yellow);
  leaf(c, lx - 30, ry(2) + 26, 70, -0.9);
  shape(c, () => rrect(c, lx - 28, ry(3) - 40, 56, 80, 8), COL.red, 5); shape(c, () => ell(c, lx, ry(3), 16, 20), COL.yellow, 3);
  const cols = [COL.orange, COL.blue, COL.green, COL.red], counts = [[3, 3, 2, 3, 3, 2, 3], [2, 1, 2, 2, 1, 2, 2], [2, 1, 1, 0, 1, 2, 1], [1, 2, 0, 1, 2, 1, 0]];
  counts.forEach((row, r) => row.forEach((n, d) => { for (let k = 0; k < n; k++) line(c, [[gx + lw + d * cw + 30 + k * 22, ry(r) - 30], [gx + lw + d * cw + 30 + k * 22, ry(r) + 30]], 7, cols[r]); }));
  pencil(c, 700, 960, -0.25, 220);
};
// flow.a3: the year wheel with five festival foods in their months
const fA3 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 560, R = 360;
  shadow(c, cx + 14, cy + 18, R, R);
  shape(c, () => ell(c, cx, cy, R, R), COL.paper, 6);
  for (let k = 0; k < 12; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 6; line(c, [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 3, COL.grey); }
  for (let k = 0; k < 12; k++) { const a = -Math.PI / 2 + ((k + 0.5) * Math.PI) / 6, t = String(k + 1), tw = (t.length - 1) * 24 + 18; write(c, t, cx + Math.cos(a) * R * 0.9 - tw / 2, cy + Math.sin(a) * R * 0.9 - 15, 30, INK, 4.5); }
  shape(c, () => ell(c, cx, cy, 14, 14), INK, 0);
  const at = (m: number, r: number): [number, number] => { const a = -Math.PI / 2 + ((m + 0.5) * Math.PI) / 6; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  // January: the Pongal pot boiling over, and til-gul laddus for Sankranti
  let [x, y] = at(0, 230);
  shape(c, () => { c.moveTo(x - 30, y - 26); c.bezierCurveTo(x - 60, y + 10, x - 40, y + 44, x, y + 44); c.bezierCurveTo(x + 40, y + 44, x + 60, y + 10, x + 30, y - 26); c.closePath(); }, COL.soil, 5);
  shape(c, () => ell(c, x, y - 26, 34, 10), COL.soilDk, 5); shape(c, () => { c.moveTo(x - 30, y - 28); c.quadraticCurveTo(x - 20, y - 60, x, y - 56); c.quadraticCurveTo(x + 24, y - 62, x + 30, y - 28); c.closePath(); }, WHITE, 4);
  [x, y] = at(0, 120); laddu(c, x - 16, y + 6, 16, COL.brown, COL.paper); laddu(c, x + 16, y - 4, 16, COL.brown, COL.paper);
  // April: Ugadi pachadi in a steel bowl
  [x, y] = at(3, 225); bowl(c, x, y, 48, "#9c8a4a");
  // September: the Onam sadya on a banana leaf
  [x, y] = at(8, 190); bananaLeaf(c, x, y, 120, 66); rice(c, x - 16, y + 8, 22, 13); shape(c, () => ell(c, x + 26, y - 10, 11, 8), COL.yellow, 3); shape(c, () => ell(c, x + 30, y + 14, 10, 7), COL.red, 3); shape(c, () => ell(c, x - 32, y - 14, 11, 8), WHITE, 3);
  // November: Diwali sweets on a plate
  [x, y] = at(10, 215); plate(c, x, y + 10, 62, 26); laddu(c, x - 22, y, 19); laddu(c, x + 22, y, 19); laddu(c, x, y - 18, 19);
};
// flow.a4: ragi porridge and rice porridge side by side, their flour packets behind
const fA4 = (c: Ctx) => {
  ground(c, WALL); floor(c, 330);
  const packet = (x: number, col: string, grain: string) => {
    shadow(c, x + 110, 596, 100, 12);
    shape(c, () => rrect(c, x, 200, 200, 390, 10), col); shade(c, () => rrect(c, x, 200, 200, 390, 10), INK, 30, 0, 0.12);
    line(c, [[x + 10, 230], [x + 190, 230]], 4, INK); line(c, [[x + 10, 560], [x + 190, 560]], 4, INK);
    shape(c, () => ell(c, x + 100, 400, 60, 60), COL.paper, 5);
    const g = rnd(x); for (let k = 0; k < 40; k++) { const a = g() * Math.PI * 2, d = Math.sqrt(g()) * 48; shape(c, () => ell(c, x + 100 + Math.cos(a) * d, 400 + Math.sin(a) * d, grain === "ragi" ? 4 : 7, grain === "ragi" ? 4 : 3, g() * 3), grain === "ragi" ? "#7a3b2e" : WHITE, 1.5); }
  };
  packet(220, "#b5613f", "ragi"); packet(660, "#5b8fd6", "rice");
  bowl(c, 300, 780, 150, "#6b3f2a"); shape(c, () => ell(c, 300, 778, 120, 22), "#7d4a33", 0);
  bowl(c, 780, 780, 150, "#f4efe2"); shape(c, () => ell(c, 780, 778, 120, 22), WHITE, 0);
  spoon(c, 600, 960, 520, 860, 34);
};
// flow.p1: the family feast served on a banana leaf, with its menu card
const fP1 = (c: Ctx) => {
  ground(c, TABLE);
  bananaLeaf(c, 520, 600, 920, 560);
  rice(c, 520, 700, 150, 70);
  bowl(c, 760, 560, 70, COL.orange); bowl(c, 900, 660, 60, "#f6dfc8");
  shape(c, () => ell(c, 330, 470, 70, 40), COL.yellow, 5);
  shape(c, () => ell(c, 500, 450, 70, 36), COL.leaf, 5); for (let k = 0; k < 6; k++) shape(c, () => ell(c, 460 + k * 16, 444 + (k % 2) * 12, 6, 5), WHITE, 0);
  shape(c, () => ell(c, 660, 440, 60, 34), "#f1e7c8", 5); for (let k = 0; k < 5; k++) shape(c, () => ell(c, 630 + k * 15, 436 + (k % 2) * 10, 7, 6), COL.leaf, 2);
  shape(c, () => ell(c, 220, 600, 44, 30), COL.red, 5);
  roti(c, 250, 760, 80, 62, "#f6e6b8", "#e4c98a", 9);
  shape(c, () => { c.moveTo(820, 790); c.quadraticCurveTo(880, 720, 940, 760); c.quadraticCurveTo(900, 760, 830, 810); c.closePath(); }, COL.yellow, 5);
  // the menu card standing at the back
  shadow(c, 880, 300, 90, 10);
  shape(c, () => polyP(c, [[800, 140], [960, 140], [960, 300], [800, 300]]), COL.paper, 5);
  for (let k = 0; k < 5; k++) line(c, [[820, 175 + k * 26], [820 + (k ? 100 : 60) + (k % 2) * 20, 175 + k * 26]], 4, k ? COL.greyDk : INK);
};
// term.0 staple food: four plates, four staples: rice, roti, a ragi ball, a bajra roti
const t0 = (c: Ctx) => {
  ground(c, WALL); floor(c, 240);
  const P: [number, number][] = [[290, 440], [790, 440], [290, 800], [790, 800]];
  P.forEach(([x, y]) => plate(c, x, y, 200, 90));
  rice(c, 290, 430, 130, 62);
  roti(c, 790, 430, 150, 72, COL.wood, COL.woodDk, 4);
  shape(c, () => ell(c, 290, 770, 100, 92), "#6b3f2a", 5); shade(c, () => ell(c, 290, 770, 100, 92), "#4a2a1a", 30, -12, 0.4);
  roti(c, 790, 790, 140, 66, "#c9b089", "#8f7a5a", 8); c.save(); c.beginPath(); ell(c, 790, 790, 140, 66); c.clip(); line(c, [[700, 770], [760, 800], [820, 780], [880, 810]], 4, "#8f7a5a"); c.restore();
};
// term.10 sprouting: a dry seed, a soaked seed, a sprouted seed with its white tail
const t10 = (c: Ctx) => {
  ground(c);
  seed(c, 190, 540, 78, 0.1, false);
  seed(c, 540, 540, 104, 0.1, true); line(c, [[470, 560], [610, 560]], 5, COL.green);
  tail(c, [[860, 600], [890, 720], [840, 820], [760, 860]], 26);
  seed(c, 880, 520, 104, 0.1, true);
  arrow(c, [[300, 540], [400, 540]]); arrow(c, [[670, 540], [750, 540]]);
};
// term.11 fermented food: a steel pot of idli batter risen to the brim, bubbles on top
const t11 = (c: Ctx) => {
  ground(c, WALL); floor(c, 330);
  shadow(c, 570, 905, 300, 36);
  const pot = () => rrect(c, 290, 440, 500, 450, 30);
  shape(c, pot, COL.steel); shade(c, pot, COL.steelDk, 140, 0);
  shape(c, () => { c.moveTo(300, 450); c.bezierCurveTo(330, 330, 750, 330, 780, 450); c.closePath(); }, "#f4efe2", 5);
  shape(c, () => ell(c, 540, 450, 260, 40), "#f4efe2", 6);
  const g = rnd(77); for (let k = 0; k < 22; k++) { const x = 320 + g() * 440, y = 395 + g() * 60 + Math.abs(x - 540) * 0.12, r = 7 + g() * 12; shape(c, () => ell(c, x, y, r, r * 0.8), WHITE, 3); }
};

export const ic_foodBalancedDietL4 = cards("sci.food.balanced-diet.L4", [sE1_0, sE1_1, sE1_2, sE1_3, sE2_0, sE2_1, sE2_2, sE2_3, fE1, fE2, fA1, fA2, fA3, fA4, fP1, t0, t10, t11]);
