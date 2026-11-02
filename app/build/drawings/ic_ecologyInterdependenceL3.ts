import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, seed, leaf, person, hand, write, cards } from "./flatKit";

// sci.ecology.interdependence.L3 · flat cards for the flows, terms and explanations
const CREAM = "#f1e3b0", CREAMDK = "#d8c58a", JUICE = "#d9482f", PINK = "#f28a6b", WALL = "#d9c7a8", WALLDK = "#b9a481";

// ---- shared things
const blobs = (c: Ctx, list: number[][], fill: string, dk: string) => {
  list.forEach(([x, y, rx, ry]) => shape(c, () => ell(c, x, y, rx, ry), INK, 0));
  list.forEach(([x, y, rx, ry]) => { c.beginPath(); ell(c, x, y, rx + 6, ry + 6); c.fillStyle = INK; c.fill(); });
  list.forEach(([x, y, rx, ry]) => { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = fill; c.fill(); });
  list.forEach(([x, y, rx, ry]) => { c.save(); c.beginPath(); ell(c, x, y, rx, ry); c.clip(); c.beginPath(); ell(c, x + rx * 0.3, y + ry * 0.35, rx, ry); c.fillStyle = dk; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1; });
};
const trunk = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => polyP(c, [[x - w / 2, y], [x - w * 0.35, y - h], [x + w * 0.35, y - h], [x + w / 2, y]]), COL.brown, 6);
  shade(c, () => polyP(c, [[x - w / 2, y], [x - w * 0.35, y - h], [x + w * 0.35, y - h], [x + w / 2, y]]), COL.soilDk, w * 0.3, 0, 0.5);
};
const root = (c: Ctx, pts: number[][], w: number) => {
  const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; p(); c.strokeStyle = INK; c.lineWidth = w + 8; c.stroke(); p(); c.strokeStyle = "#fffaf0"; c.lineWidth = w; c.stroke();
};
const cseed = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, CREAM, CREAMDK);
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.9, r * 0.9, r * 0.18);
  shape(c, () => ell(c, x, y, r, r * 0.88), COL.red); shade(c, () => ell(c, x, y, r, r * 0.88), "#a8301f", r * 0.35, r * 0.3, 0.5);
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.35, y - r * 0.6]], 8);
  for (let k = 0; k < 5; k++) leaf(c, x, y - r * 0.8, r * 0.38, -Math.PI / 2 + (k - 2) * 0.7, COL.green);
};
const tomatoCut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 0.95, r, r * 0.16);
  shape(c, () => ell(c, x, y, r, r), COL.red); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), "#f7b9a0", 4);
  for (let k = 0; k < 4; k++) {
    const a = k * 1.57 + 0.78, px = x + Math.cos(a) * r * 0.42, py = y + Math.sin(a) * r * 0.42;
    shape(c, () => ell(c, px, py, r * 0.3, r * 0.26, a), PINK, 4);
    for (let j = 0; j < 3; j++) cseed(c, px + (j - 1) * r * 0.13, py + (j % 2) * r * 0.08 - r * 0.04, r * 0.07, j);
  }
};
const guavaCut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 0.95, r, r * 0.16);
  shape(c, () => ell(c, x, y, r, r * 0.92), "#8bc34a"); shape(c, () => ell(c, x, y, r * 0.88, r * 0.8), "#f6cbd0", 4); shape(c, () => ell(c, x, y, r * 0.55, r * 0.5), "#f08c9c", 4);
  const rd = rnd(5); for (let i = 0; i < 16; i++) { const a = rd() * 6.28, d = rd() * r * 0.4; cseed(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.07, a); }
};
const bhindiCut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 0.95, r, r * 0.16);
  const pts: number[][] = []; for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.283 - 1.57, rr = k % 2 ? r * 0.8 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), COL.green); shape(c, () => ell(c, x, y, r * 0.68, r * 0.68), "#d9ecb0", 4);
  for (let k = 0; k < 5; k++) { const a = (k / 5) * 6.283 - 1.57 + 0.3; cseed(c, x + Math.cos(a) * r * 0.36, y + Math.sin(a) * r * 0.36, r * 0.1, a); cseed(c, x + Math.cos(a + 0.4) * r * 0.36, y + Math.sin(a + 0.4) * r * 0.36, r * 0.1, a); }
};
const guava = (c: Ctx, x: number, y: number, r: number, col = "#bfe05a") => {
  shape(c, () => ell(c, x, y, r, r * 0.92), col); shade(c, () => ell(c, x, y, r, r * 0.92), "#7da22f", r * 0.35, r * 0.3, 0.5);
  shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.3, y - r * 0.55]], 7); leaf(c, x, y - r * 0.85, r * 0.45, -2.2, COL.leaf);
};
const bee = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const k of [-1, 0, 1]) line(c, [[k * 14, 18], [k * 18, 34]], 5);
  shape(c, () => ell(c, -12, -26, 22, 34, -0.5), "rgba(214,236,250,0.85)", 5); shape(c, () => ell(c, 14, -28, 22, 34, 0.5), "rgba(214,236,250,0.85)", 5);
  shape(c, () => ell(c, 0, 0, 44, 30), COL.yellow); c.save(); c.beginPath(); ell(c, 0, 0, 44, 30); c.clip(); for (const bx of [-14, 12]) { c.fillStyle = INK; c.fillRect(bx, -40, 12, 80); } c.restore(); shape(c, () => ell(c, 0, 0, 44, 30), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, -44, -4, 20, 18), COL.black, 5); line(c, [[-52, -20], [-62, -34]], 4); line(c, [[44, 0], [58, 8]], 5);
  c.restore();
};
const wasp = (c: Ctx, x: number, y: number, s: number, pollen = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const k of [-1, 0, 1]) line(c, [[k * 12, 12], [k * 18, 32]], 4);
  shape(c, () => ell(c, -4, -24, 40, 16, -0.4), "rgba(214,236,250,0.85)", 4); shape(c, () => ell(c, 10, -26, 36, 14, -0.1), "rgba(214,236,250,0.85)", 4);
  shape(c, () => ell(c, 32, 4, 26, 14, 0.1), COL.orange, 5); line(c, [[18, 4], [8, 2]], 5);
  shape(c, () => ell(c, 0, 0, 16, 14), COL.black, 5); shape(c, () => ell(c, -22, -2, 13, 12), COL.black, 5); line(c, [[-30, -12], [-42, -28]], 3); line(c, [[-24, -12], [-30, -30]], 3);
  if (pollen) for (const [px, py] of [[2, -8], [-6, 6], [30, -6], [34, 12], [-18, 6]]) shape(c, () => ell(c, px, py, 4, 4), COL.yellow, 2);
  c.restore();
};
const fig = (c: Ctx, x: number, y: number, r: number, hole = true) => {
  shadow(c, x + r * 0.12, y + r * 0.95, r * 0.9, r * 0.14);
  const body = () => { c.moveTo(x, y - r); c.bezierCurveTo(x + r * 1.2, y - r * 0.9, x + r * 1.1, y + r * 0.75, x, y + r * 0.95); c.bezierCurveTo(x - r * 1.1, y + r * 0.75, x - r * 1.2, y - r * 0.9, x, y - r); c.closePath(); };
  shape(c, body, "#8e6bb0"); shade(c, body, "#5f4585", r * 0.35, r * 0.2, 0.5); shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.4, y - r * 0.65]], 9);
  line(c, [[x, y - r], [x + r * 0.1, y - r * 1.2]], 10, COL.brown);
  if (hole) shape(c, () => ell(c, x, y + r * 0.85, r * 0.11, r * 0.07), INK, 3);
};
const spider = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sd of [-1, 1]) for (let k = 0; k < 4; k++) { const a = -0.9 + k * 0.6; line(c, [[sd * 12, (k - 1.5) * 6], [sd * (40 + (k % 2) * 8), (k - 1.5) * 20 - 18], [sd * (62 + (k % 2) * 6), (k - 1.5) * 30 + 20]], 6); }
  shape(c, () => ell(c, 0, 16, 22, 26), COL.brown, 5); shape(c, () => ell(c, 0, -14, 14, 14), COL.brown, 5);
  shape(c, () => ell(c, -5, -17, 3, 3), WHITE, 0); shape(c, () => ell(c, 5, -17, 3, 3), WHITE, 0);
  c.restore();
};
const cup = (c: Ctx, x: number, y: number, w: number, h: number) => { // clear cup, mouth down, rim at y
  const body = () => { c.moveTo(x - w * 0.5, y); c.lineTo(x - w * 0.42, y - h); c.lineTo(x + w * 0.42, y - h); c.lineTo(x + w * 0.5, y); c.closePath(); };
  shape(c, body, "rgba(214,236,250,0.45)", 6); shape(c, () => ell(c, x, y - h, w * 0.42, w * 0.07), "rgba(255,255,255,0.4)", 5); shine(c, [[x - w * 0.34, y - h * 0.85], [x - w * 0.4, y - h * 0.2]], 8);
};
const bird = (c: Ctx, x: number, y: number, s: number, body: string, bodyDk: string, beak: string, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  line(c, [[-6, 40], [-6, 66]], 7); line(c, [[14, 40], [14, 66]], 7);
  shape(c, () => polyP(c, [[-30, 10], [-110, 40], [-100, 56], [-20, 36]]), bodyDk, 5);
  shape(c, () => ell(c, 0, 10, 56, 38, 0.2), body); shade(c, () => ell(c, 0, 10, 56, 38, 0.2), bodyDk, 16, 14, 0.5);
  shape(c, () => ell(c, 42, -26, 26, 25), body); shape(c, () => polyP(c, [[62, -34], [92, -16], [64, -10]]), beak, 5);
  shape(c, () => ell(c, 46, -32, 5, 5), WHITE, 3); shape(c, () => ell(c, 47, -32, 2.5, 2.5), INK, 0);
  shape(c, () => ell(c, -6, 8, 30, 18, 0.3), bodyDk, 4);
  c.restore();
};
const wall = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), WALL, 6); const r = rnd(3);
  for (let j = 1; j < 3; j++) line(c, [[x + 6, y + (h * j) / 3], [x + w - 6, y + (h * j) / 3]], 3, WALLDK);
  for (let j = 0; j < 3; j++) for (let k = 1; k < 4; k++) if (r() > 0.2) line(c, [[x + (w * k) / 4 + (j % 2) * 20, y + (h * j) / 3], [x + (w * k) / 4 + (j % 2) * 20, y + (h * (j + 1)) / 3]], 3, WALLDK);
};
const sprout = (c: Ctx, x: number, y: number, s: number) => { // a small seedling standing at (x, y)
  line(c, [[x, y], [x, y - 70 * s]], 9 * s, INK); line(c, [[x, y], [x, y - 70 * s]], 9 * s - 6, COL.green);
  leaf(c, x, y - 55 * s, 60 * s, -0.5, COL.leaf); leaf(c, x, y - 55 * s, 60 * s, -Math.PI + 0.5, COL.leaf);
};
const flower = (c: Ctx, x: number, y: number, r: number, petal: string) => {
  for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283; shape(c, () => ell(c, x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.5, r * 0.36, a), petal, 4); }
  shape(c, () => ell(c, x, y, r * 0.38, r * 0.38), COL.orange, 4);
};
const seedBox = (c: Ctx, x: number, y: number, w: number, h: number, inner: string) => {
  shadow(c, x + w / 2 + 10, y + h + 8, w * 0.52, 18);
  shape(c, () => rrect(c, x, y, w, h, 16), "#ffffff", 6); shape(c, () => rrect(c, x + 18, y + 18, w - 36, h - 36, 10), inner, 4);
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.38, y], [x - w * 0.38, y]]), "#c8693f", 6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.soil, 5);
};
const cow = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 20, 6, 150, 18);
  for (const lx of [-90, -60, 50, 80]) shape(c, () => rrect(c, lx - 11, 0, 22, 70, 6), "#f4ead8", 5);
  shape(c, () => rrect(c, -130, -90, 250, 100, 40), "#f4ead8"); shape(c, () => ell(c, -30, -50, 40, 28), "#8a5a3c", 0); shape(c, () => ell(c, 60, -30, 30, 22), "#8a5a3c", 0);
  shape(c, () => rrect(c, -130, -90, 250, 100, 40), "rgba(0,0,0,0)", 6);
  line(c, [[-130, -60], [-160, -10], [-152, 40]], 7);
  shape(c, () => rrect(c, 100, -110, 90, 80, 30), "#f4ead8"); shape(c, () => rrect(c, 140, -60, 62, 40, 18), "#f2b3a0"); shape(c, () => ell(c, 168, -82, 5, 5), INK, 0);
  shape(c, () => ell(c, 112, -118, 12, 6, -0.6), "#f4ead8", 4); line(c, [[118, -112], [112, -138]], 7);
  c.restore();
};
const dogAsleep = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s); shadow(c, 0, 8, 110, 16);
  shape(c, () => ell(c, 0, -34, 100, 40), "#c98b4a"); shade(c, () => ell(c, 0, -34, 100, 40), "#a06a30", 20, 18, 0.5);
  shape(c, () => ell(c, 82, -34, 36, 30), "#c98b4a"); shape(c, () => ell(c, 108, -26, 14, 11), INK, 0); shape(c, () => ell(c, 70, -62, 12, 22, 0.4), "#8a5a3c", 4);
  line(c, [[80, -38], [96, -36]], 4); shape(c, () => ell(c, -96, -44, 22, 12, -0.3), "#c98b4a", 5);
  c.restore();
};
const squirrel = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => { c.moveTo(-30, 10); c.bezierCurveTo(-120, 0, -110, -140, -40, -150); c.bezierCurveTo(-60, -90, -20, -50, -10, -20); c.closePath(); }, "#b9835a", 5);
  shape(c, () => ell(c, 0, -10, 36, 48, -0.2), "#b9835a"); shape(c, () => ell(c, 4, 0, 18, 28), "#f2dcc0", 0);
  shape(c, () => ell(c, 22, -62, 24, 22), "#b9835a"); shape(c, () => ell(c, 12, -84, 8, 12), "#b9835a", 4); shape(c, () => ell(c, 28, -66, 4, 4), INK, 0); shape(c, () => ell(c, 44, -58, 5, 4), INK, 0);
  shape(c, () => ell(c, 30, -30, 10, 10), "#f2dcc0", 4);
  c.restore();
};
const worm = (c: Ctx, x: number, y: number, s: number) => { c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 30 * s, y - 40 * s, x + 60 * s, y + 40 * s, x + 90 * s, y); c.bezierCurveTo(x + 110 * s, y - 25 * s, x + 130 * s, y + 20 * s, x + 150 * s, y - 5 * s); c.strokeStyle = INK; c.lineWidth = 22 * s; c.lineCap = "round"; c.stroke(); c.strokeStyle = "#e58a8a"; c.lineWidth = 14 * s; c.stroke(); };
const idliPlate = (c: Ctx, x: number, y: number, rx: number) => {
  plate(c, x, y, rx, rx * 0.4);
  for (const [dx, dy] of [[-0.35, 0], [0.1, -0.1], [0.4, 0.08]]) { const ix = x + dx * rx, iy = y + dy * rx; shape(c, () => ell(c, ix, iy, rx * 0.27, rx * 0.16), "#fffaf0"); shade(c, () => ell(c, ix, iy, rx * 0.27, rx * 0.16), "#d9d3c2", rx * 0.07, rx * 0.04, 0.6); }
};

// ================= flows
// flow.e1: one tomato cut open; clean seeds sprout on wet tissue, seeds left in juice do not
const e1 = (c: Ctx) => {
  ground(c); tomatoCut(c, 540, 230, 150);
  arrow(c, [[460, 400], [330, 520]]); arrow(c, [[620, 400], [750, 520]]);
  seedBox(c, 90, 560, 380, 300, "#c7dff2"); seedBox(c, 610, 560, 380, 300, JUICE);
  [[150, 700], [250, 740], [345, 700], [190, 790], [300, 800]].forEach(([x, y], i) => { root(c, [[x, y], [x + 10, y + 26], [x + 6, y + 48]], 9); cseed(c, x, y, 26, i * 0.7); });
  [[690, 700], [790, 740], [885, 700], [730, 790], [840, 800]].forEach(([x, y], i) => cseed(c, x, y, 24, i * 0.8));
};
// flow.e2: seeds from the juice are washed clean, then put on wet tissue, and now sprout
const e2 = (c: Ctx) => {
  ground(c);
  seedBox(c, 40, 360, 260, 220, JUICE); [[110, 440], [190, 480], [240, 430], [140, 520]].forEach(([x, y], i) => cseed(c, x, y, 22, i));
  // bowl of clear water with seeds
  shadow(c, 540, 590, 140, 22); shape(c, () => { c.moveTo(400, 430); c.bezierCurveTo(410, 600, 670, 600, 680, 430); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 540, 430, 140, 28), COL.water, 5); [[490, 430], [540, 438], [590, 428]].forEach(([x, y], i) => cseed(c, x, y, 18, i));
  [[510, 330], [545, 300], [575, 335]].forEach(([x, y]) => shape(c, () => { c.moveTo(x, y - 24); c.quadraticCurveTo(x + 18, y + 6, x, y + 14); c.quadraticCurveTo(x - 18, y + 6, x, y - 24); c.closePath(); }, COL.drop, 4));
  seedBox(c, 780, 360, 260, 220, "#c7dff2"); [[840, 450], [910, 490], [980, 440], [880, 530]].forEach(([x, y], i) => { root(c, [[x, y], [x + 8, y + 22], [x + 4, y + 42]], 8); cseed(c, x, y, 20, i); });
  arrow(c, [[310, 470], [390, 470]]); arrow(c, [[690, 470], [770, 470]]);
  for (const x of [170, 540, 910]) line(c, [[x, 700], [x, 700]], 1);
  write(c, "1", 150, 680, 50, INK, 7); write(c, "2", 520, 680, 50, INK, 7); write(c, "3", 890, 680, 50, INK, 7);
};
// flow.a1: a bowl of fruits, and the bird and squirrel who would eat them
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 830, 330, 40); shape(c, () => { c.moveTo(200, 640); c.bezierCurveTo(230, 860, 850, 860, 880, 640); c.closePath(); }, COL.steel);
  guava(c, 400, 620, 85); tomato(c, 560, 600, 85); guava(c, 700, 635, 80, "#f2c64a"); guava(c, 520, 700, 80, "#f08a4b");
  shape(c, () => ell(c, 540, 650, 360, 40), "rgba(0,0,0,0)", 0);
  shape(c, () => { c.moveTo(200, 640); c.bezierCurveTo(230, 860, 850, 860, 880, 640); c.bezierCurveTo(700, 690, 380, 690, 200, 640); c.closePath(); }, COL.steel); shade(c, () => { c.moveTo(200, 640); c.bezierCurveTo(230, 860, 850, 860, 880, 640); c.closePath(); }, COL.steelDk, 60, -10, 0.5);
  bird(c, 220, 230, 1.1, COL.green, COL.greenDk, COL.red); squirrel(c, 840, 330, 1.2);
  arrow(c, [[330, 330], [400, 460]]); arrow(c, [[780, 330], [700, 450]]);
};
// flow.a2: cup over the spider, card slid under, lift together
const a2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 0, 760, D, 320), "#e4d6b8", 0); line(c, [[0, 760], [D, 760]], 6);
  // left: cup placed over spider
  spider(c, 270, 700, 0.9); cup(c, 270, 770, 300, 260); hand(c, 40, 590, 0.15, 1.1, SKIN.child, CLOTH.child);
  // right: card under the cup, lifted
  shadow(c, 800, 790, 170, 18);
  shape(c, () => polyP(c, [[600, 770], [1000, 770], [1010, 790], [610, 790]]), COL.wood, 5);
  cup(c, 800, 770, 300, 260); spider(c, 800, 725, 0.7);
  arrow(c, [[500, 480], [570, 480]]);
};
// flow.a4: the child is the fig wasp, the paper fig has one small hole
const a4 = (c: Ctx) => {
  ground(c);
  for (const sd of [-1, 1]) { shape(c, () => polyP(c, [[330 + sd * 50, 470], [330 + sd * 250, 330], [330 + sd * 230, 560]]), "rgba(214,236,250,0.9)", 5); }
  person(c, 330, 900, 620, { armL: [-0.3, -0.9], armR: [-0.3, -0.9] });
  fig(c, 790, 560, 190); wasp(c, 960, 900, 1.5, true); arrow(c, [[900, 860], [820, 790]]);
};
// flow.a5: a plate of idli and the plants and animals behind it
const a5 = (c: Ctx) => {
  ground(c); idliPlate(c, 540, 540, 230);
  // rice plant
  line(c, [[130, 300], [130, 120]], 9, INK); line(c, [[130, 300], [130, 120]], 5, COL.greenLt);
  for (const a of [-2.6, -0.5]) leaf(c, 130, 270, 130, a, COL.leaf);
  for (let k = 0; k < 6; k++) shape(c, () => ell(c, 132 + (k % 2) * 16, 130 + k * 14, 11, 7, 0.4), COL.wood, 3);
  // coconut palm
  trunk(c, 900, 400, 36, 220); for (const a of [-2.6, -2.0, -1.1, -0.5]) leaf(c, 900, 190, 150, a, COL.leaf);
  shape(c, () => ell(c, 880, 210, 20, 20), COL.brown, 4); shape(c, () => ell(c, 920, 210, 20, 20), COL.brown, 4);
  // tomato plant with bee
  tomato(c, 160, 790, 70); tomato(c, 250, 830, 60); bee(c, 100, 660, 0.8);
  // milk glass and cow-ish: banana? use a cow
  cow(c, 780, 800, 0.8);
  arrow(c, [[190, 330], [330, 440]]); arrow(c, [[860, 430], [740, 480]]); arrow(c, [[250, 730], [350, 620]]); arrow(c, [[740, 700], [680, 620]]);
};

// ================= terms
// term.0 Interdependence: a crow on a neem branch eats a fruit; far off a neem seedling grows by a wall
const t0 = (c: Ctx) => {
  ground(c); line(c, [[-20, 160], [330, 260], [600, 240]], 40, INK); line(c, [[-20, 160], [330, 260], [600, 240]], 28, COL.brown);
  for (const [x, y, a] of [[100, 190, -1.0], [220, 230, -2.3], [450, 255, -0.9], [380, 270, -2.5]]) leaf(c, x, y, 110, a, COL.leaf);
  for (const [x, y] of [[170, 300], [300, 345], [430, 320], [520, 290]]) shape(c, () => ell(c, x, y, 14, 18), COL.yellow, 4);
  bird(c, 400, 195, 1.25, COL.black, "#25202e", "#6b6b6b", -1);
  wall(c, 640, 760, 400, 130); sprout(c, 800, 760, 1.5);
  c.setLineDash([2, 22]); line(c, [[470, 330], [560, 520], [760, 640]], 9, RED); c.setLineDash([]); arrow(c, [[700, 620], [770, 670]]);
};
// term.5 Fruit: tomato, bhindi, guava cut open, seeds showing
const t5 = (c: Ctx) => {
  ground(c); plate(c, 540, 600, 450, 230);
  tomatoCut(c, 340, 520, 140); bhindiCut(c, 740, 500, 120); guavaCut(c, 545, 700, 135);
};
// term.7 Germinate: seed, then a root, then a root and a shoot
const t7 = (c: Ctx) => {
  ground(c); c.save(); c.translate(540, 560); c.scale(1.08, 1.08); c.translate(-555, -560); shape(c, () => rrect(c, -200, 640, D + 400, 440), "#a9c9e6", 0); line(c, [[-200, 640], [D + 200, 640]], 6);
  seed(c, 170, 590, 62, 0.2, true);
  root(c, [[500, 620], [520, 680], [510, 730]], 14); seed(c, 520, 585, 62, 0.2, true);
  root(c, [[860, 620], [880, 690], [860, 760]], 14); seed(c, 880, 585, 62, 0.4, true);
  line(c, [[900, 560], [930, 480], [940, 410]], 14, INK); line(c, [[900, 560], [930, 480], [940, 410]], 8, COL.greenLt); leaf(c, 940, 415, 70, -0.9, COL.leaf); leaf(c, 940, 415, 70, -2.3, COL.leaf);
  arrow(c, [[260, 480], [400, 480]]); arrow(c, [[600, 480], [740, 480]]); c.restore();
};
// term.8 Mutualism: fig wasp enters the fig; both are helped
const t8 = (c: Ctx) => {
  ground(c); fig(c, 540, 400, 250); wasp(c, 760, 860, 2.2, true); arrow(c, [[690, 770], [590, 680]]);
};
// term.10 Ahimsa: carrying a spider outside under a cup and a card
const t10 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 700, 120, 300, 420, 10), "#bfe0f5", 8); line(c, [[850, 120], [850, 540]], 6); line(c, [[700, 330], [1000, 330]], 6);
  shape(c, () => rrect(c, 760, 180, 90, 150, 0), "#e8f6ff", 0); line(c, [[0, 900], [D, 900]], 6);
  person(c, 330, 900, 700, { armL: [0.5, -0.5], armR: [-0.3, -0.5] });
  cup(c, 480, 480, 200, 190); spider(c, 480, 400, 0.7);
  shape(c, () => polyP(c, [[370, 482], [590, 482], [596, 498], [376, 498]]), COL.wood, 5);
  arrow(c, [[600, 560], [680, 560]]);
};

// ================= explanations
const e_0 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 0, 820, D, 260), COL.soil, 0); line(c, [[0, 820], [D, 820]], 6);
  trunk(c, 340, 830, 100, 400); blobs(c, [[340, 250, 230, 130], [230, 340, 150, 90], [460, 340, 160, 90]], COL.leaf, COL.leafDk);
  shape(c, () => ell(c, 330, 395, 50, 24), COL.wood, 5); shape(c, () => ell(c, 330, 392, 36, 12), COL.woodDk, 3); bird(c, 330, 345, 0.45, COL.black, "#25202e", "#6b6b6b", 1);
  cow(c, 700, 800, 0.75); worm(c, 120, 930, 1.6); worm(c, 480, 990, 1.2);
  person(c, 930, 830, 380, { armR: [-1.0, -2.4] });
};
const e_1 = (c: Ctx) => { ground(c); shape(c, () => rrect(c, 0, 850, D, 240), COL.greenLt, 0); line(c, [[0, 850], [D, 850]], 6);
  line(c, [[300, 560], [150, 520]], 24, INK); line(c, [[300, 560], [150, 520]], 14, COL.brown);
  trunk(c, 300, 850, 110, 430); blobs(c, [[300, 250, 240, 150], [170, 350, 140, 90], [440, 350, 150, 90]], COL.leaf, COL.leafDk);
  line(c, [[430, 330], [430, 400]], 5); shape(c, () => ell(c, 430, 440, 30, 50), COL.wood, 5); shape(c, () => ell(c, 430, 462, 10, 10), INK, 0);
  squirrel(c, 160, 520, 0.7); guava(c, 218, 482, 24); dogAsleep(c, 520, 930, 1.1); line(c, [[820, 850], [820, 640]], 8, COL.green); flower(c, 820, 600, 55, COL.pink); bee(c, 930, 520, 0.9); };
const e_3 = (c: Ctx) => { ground(c); trunk(c, 230, 850, 90, 300); blobs(c, [[230, 280, 200, 120], [140, 360, 120, 70], [330, 360, 120, 70]], COL.leaf, COL.leafDk);
  guava(c, 140, 380, 34, "#bfe05a"); guava(c, 330, 395, 34, "#f2c64a"); bird(c, 420, 305, 1.0, COL.green, COL.greenDk, COL.red, 1);
  wall(c, 640, 760, 380, 130); sprout(c, 800, 760, 1.5); c.setLineDash([2, 22]); line(c, [[470, 430], [600, 600], [760, 660]], 9, RED); c.setLineDash([]); arrow(c, [[690, 640], [770, 690]]); };
const e_4 = (c: Ctx) => { ground(c);
  seedBox(c, 60, 300, 440, 420, "#c7dff2"); seedBox(c, 580, 300, 440, 420, JUICE);
  [[160, 440], [300, 480], [420, 440], [200, 580], [340, 600], [420, 560]].forEach(([x, y], i) => { root(c, [[x, y], [x + 8, y + 30], [x + 4, y + 52]], 10); cseed(c, x, y, 28, i); });
  [[680, 440], [820, 480], [940, 440], [720, 580], [860, 600], [940, 560]].forEach(([x, y], i) => cseed(c, x, y, 26, i * 0.8)); };
const e_7 = (c: Ctx) => { ground(c); shape(c, () => rrect(c, 0, 900, D, 180), COL.soil, 0); line(c, [[0, 900], [D, 900]], 6);
  line(c, [[300, 900], [300, 260]], 30, INK); line(c, [[300, 900], [300, 260]], 20, COL.greenLt);
  for (const [y, a] of [[800, -0.5], [700, -2.6], [600, -0.4], [500, -2.7], [400, -0.35]]) leaf(c, 300, y, 330, a, COL.leaf);
  c.save(); c.translate(500, 560); for (let k = 0; k < 6; k++) shape(c, () => ell(c, 20 + k * 22, -k * 3, 17, 15), "#8fcf5a", 4); shape(c, () => ell(c, 156, -20, 20, 18), "#8fcf5a", 4); c.restore();
  c.setLineDash([2, 22]); line(c, [[470, 520], [620, 420], [700, 300], [830, 250]], 9, RED); c.setLineDash([]);
  wasp(c, 860, 240, 0.8); wasp(c, 780, 360, 0.8); wasp(c, 920, 340, 0.8); };
const e_8 = (c: Ctx) => { ground(c); shape(c, () => rrect(c, 0, 920, D, 160), COL.greenLt, 0); line(c, [[0, 920], [D, 920]], 6);
  trunk(c, 800, 930, 80, 520); blobs(c, [[800, 330, 230, 150], [660, 420, 120, 80]], COL.leaf, COL.leafDk);
  for (const [x, y] of [[700, 310], [790, 250], [880, 330], [750, 400], [860, 420]]) flower(c, x, y, 26, WHITE);
  line(c, [[300, 930], [380, 420]], 14, COL.woodDk); line(c, [[480, 930], [430, 420]], 14, COL.woodDk); for (let y = 520; y < 900; y += 110) line(c, [[320 + (900 - y) * -0.0, y], [470, y]], 10, COL.woodDk);
  person(c, 400, 560, 480, { armL: [-0.6, -0.2], armR: [-0.7, 0.1], adult: true }); line(c, [[592, 175], [650, 165]], 8); shape(c, () => ell(c, 662, 163, 16, 10, -0.1), COL.yellow, 4); bee(c, 260, 330, 0.8); };

export const ic_ecologyInterdependenceL3 = cards("sci.ecology.interdependence.L3 cards", [e1, e2, a1, a2, a4, a5, t0, t5, t7, t8, t10, e_0, e_1, e_3, e_4, e_7, e_8]);
