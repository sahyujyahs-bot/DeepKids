import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, write, cards } from "./flatKit";

const OIL = "#f6c33b", OILDK = "#d9a21f", TURM = "#e29a12", CLOUD = "#f2e2a0", MOULD = "#4f9a34";
const num = (c: Ctx, t: string, cx: number, y: number, h: number) => write(c, t, cx - t.length * 0.4 * h + 0.2 * h, y, h, INK, 7);

// a steel tap on the wall: spout centre (x, y), pipe running right to a wall flange
const tap = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 10, y + 120, 40, 10);
  shape(c, () => rrect(c, x - 30, y - 30, 1000 - x, 60, 18), COL.steel);
  shade(c, () => rrect(c, x - 30, y - 30, 1000 - x, 60, 18), COL.steelDk, 0, 20);
  shape(c, () => rrect(c, 990, y - 80, 40, 160, 12), COL.steelDk);
  shape(c, () => rrect(c, x - 30, y - 30, 60, 110, 16), COL.steel);
  shape(c, () => rrect(c, x - 22, y + 70, 44, 30, 8), COL.steelDk);
  shape(c, () => rrect(c, x + 230, y - 56, 24, 30, 6), COL.steelDk);
  shape(c, () => ell(c, x + 242, y - 66, 46, 22), COL.teal);
};
// a clock face with the first `sec` seconds shaded red, and the number under it
const clock = (c: Ctx, x: number, y: number, r: number, sec: number) => {
  shadow(c, x + 12, y + r * 0.95, r, r * 0.16);
  shape(c, () => ell(c, x, y, r, r), WHITE, 8);
  const a = (sec / 60) * Math.PI * 2 - Math.PI / 2;
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r - 12, -Math.PI / 2, a); c.closePath(); c.fillStyle = "#f5b7a8"; c.fill();
  for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(t) * (r - 12), y + Math.sin(t) * (r - 12)], [x + Math.cos(t) * (r - 30), y + Math.sin(t) * (r - 30)]], 6); }
  line(c, [[x, y], [x + Math.cos(a) * (r - 28), y + Math.sin(a) * (r - 28)]], 10, RED);
  shape(c, () => ell(c, x, y, 11, 11), INK, 0);
  num(c, String(sec), x, y + r + 30, 80);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.9, y + s * 0.2, x, y + s * 0.8); c.quadraticCurveTo(x - s * 0.9, y + s * 0.2, x, y - s); c.closePath(); }, col, 4);
// a glass jar; layers bottom to top as [fraction of height, colour]; lid = steel lid on top
const jar = (c: Ctx, cx: number, base: number, w: number, h: number, layers: [number, string][], lid = false) => {
  shadow(c, cx + w * 0.12, base + 8, w * 0.62, w * 0.1);
  const body = () => rrect(c, cx - w / 2, base - h, w, h, 30);
  c.save(); c.beginPath(); body(); c.clip();
  let y = base;
  layers.forEach(([f, col]) => { const t = y - h * f; c.fillStyle = col; c.fillRect(cx - w, t, w * 2, y - t); c.fillStyle = "rgba(43,35,64,0.12)"; c.fillRect(cx + w * 0.22, t, w, y - t); line(c, [[cx - w, t], [cx + w, t]], 4); y = t; });
  c.restore();
  shape(c, body, "rgba(214,236,250,0.35)", 7);
  shine(c, [[cx - w * 0.36, base - h * 0.88], [cx - w * 0.36, base - h * 0.2]], 11);
  if (lid) { shape(c, () => rrect(c, cx - w / 2 - 8, base - h - 46, w + 16, 52, 14), COL.steel); shade(c, () => rrect(c, cx - w / 2 - 8, base - h - 46, w + 16, 52, 14), COL.steelDk, w * 0.3, 0); }
};
// a slice of bread, centre (x, y), size s
const bread = (c: Ctx, x: number, y: number, s: number) => {
  const p = (k: number) => () => { const X = (v: number) => x + v * s * k, Y = (v: number) => y + v * s * k; c.moveTo(X(-0.4), Y(0.46)); c.lineTo(X(-0.4), Y(0)); c.bezierCurveTo(X(-0.62), Y(-0.02), X(-0.6), Y(-0.46), X(-0.32), Y(-0.46)); c.bezierCurveTo(X(-0.2), Y(-0.54), X(0.2), Y(-0.54), X(0.32), Y(-0.46)); c.bezierCurveTo(X(0.6), Y(-0.46), X(0.62), Y(-0.02), X(0.4), Y(0)); c.lineTo(X(0.4), Y(0.46)); c.closePath(); };
  shape(c, p(1), "#c88a4a", 6); shape(c, p(0.84), "#f6e2b3", 3);
  shade(c, p(1), "#a46a30", s * 0.06, s * 0.05, 0.3);
};
const mould = (c: Ctx, x: number, y: number, r: number, col: string = MOULD) => { shape(c, () => ell(c, x, y, r, r * 0.85), col, 3); shape(c, () => ell(c, x - r * 0.25, y - r * 0.2, r * 0.35, r * 0.3), "#8fcf6a", 0); };
type Icon = "spoon" | "mud" | "water" | "soap";
const icon = (c: Ctx, k: Icon, x: number, y: number, s: number) => {
  if (k === "spoon") { shape(c, () => rrect(c, x - s * 0.08, y, s * 0.16, s * 0.9, s * 0.06), COL.steel, 4); shape(c, () => ell(c, x, y - s * 0.05, s * 0.28, s * 0.38), COL.steel, 4); }
  if (k === "mud") { shape(c, () => rrect(c, x - s * 0.3, y, s * 0.6, s * 0.55, s * 0.12), COL.soil, 4); for (let i = 0; i < 4; i++) shape(c, () => rrect(c, x - s * 0.3 + i * s * 0.16, y - s * 0.38, s * 0.12, s * 0.5, s * 0.06), COL.soil, 4); shape(c, () => ell(c, x - s * 0.1, y + s * 0.25, s * 0.07, s * 0.06), COL.soilDk, 0); }
  if (k === "water") drop(c, x, y + s * 0.4, s * 0.55);
  if (k === "soap") { shape(c, () => rrect(c, x - s * 0.36, y + s * 0.1, s * 0.72, s * 0.5, s * 0.14), COL.pink, 4); shape(c, () => ell(c, x - s * 0.22, y - s * 0.02, s * 0.14, s * 0.14), WHITE, 3); shape(c, () => ell(c, x + s * 0.08, y - s * 0.12, s * 0.1, s * 0.1), WHITE, 3); }
};
// a zip bag with a picture tag and a slice of bread inside; moulds: [dx, dy, r, colour] relative to the bread, in bag widths
const bag = (c: Ctx, x: number, y: number, w: number, h: number, k: Icon, spots: number[][] = []) => {
  shadow(c, x + w * 0.55, y + h + 6, w * 0.55, w * 0.07);
  const body = () => rrect(c, x, y, w, h, 24);
  shape(c, body, "rgba(214,236,250,0.5)", 6);
  shape(c, () => rrect(c, x, y, w, h * 0.07, 10), COL.blue, 5);
  shape(c, () => rrect(c, x + w * 0.66, y - 6, w * 0.12, h * 0.07 + 12, 6), COL.blueDk, 4);
  const tw = w * 0.5, tx = x + w / 2 - tw / 2, ty = y + h * 0.12;
  shape(c, () => rrect(c, tx, ty, tw, h * 0.2, 10), WHITE, 4);
  icon(c, k, x + w / 2, ty + h * 0.03, h * 0.14);
  const bx = x + w / 2, by = y + h * 0.65, bs = w * 0.7;
  bread(c, bx, by, bs);
  spots.forEach(([dx, dy, r, dark]) => mould(c, bx + dx * bs, by + dy * bs, r * bs, dark ? COL.black : MOULD));
  shine(c, [[x + w * 0.1, y + h * 0.4], [x + w * 0.1, y + h * 0.9]], 9);
};
const jarsShaken = (c: Ctx, cx: number, base: number, w: number, h: number, soap: boolean, seed: number) => {
  jar(c, cx, base, w, h, soap ? [[0.78, CLOUD]] : [[0.5, COL.water], [0.28, OIL]], true);
  const r = rnd(seed);
  for (let i = 0; i < 14; i++) { const x = cx - w * 0.38 + r() * w * 0.76, y = base - h * (0.1 + r() * 0.62); soap ? shape(c, () => ell(c, x, y, 6 + r() * 5, 6 + r() * 5), "rgba(255,255,255,0.75)", 2) : shape(c, () => ell(c, x, y, 9 + r() * 14, 8 + r() * 9), OIL, 3); }
};

// setup.e1.0
const card0 = (c: Ctx) => {
  ground(c);
  tap(c, 700, 200);
  hand(c, 330, 720, -0.15, 3.8, SKIN.child, CLOTH.child, true);
  c.save(); c.translate(330, 720); c.rotate(-0.15); c.scale(3.8, 3.8);
  shape(c, () => ell(c, 4, 0, 24, 15), OIL, 1.6); shine(c, [[-8, -3], [6, -8]], 3);
  shape(c, () => polyP(c, [[28, 12], [41, -14], [55, 12]]), TURM, 1.6);
  shape(c, () => ell(c, 41, 12, 19, 6), TURM, 1.6);
  shade(c, () => polyP(c, [[28, 12], [41, -14], [55, 12]]), "#b87408", 4, 0, 0.5);
  const r = rnd(5); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 28 + r() * 26, 11 + r() * 6, 1.2, 1), TURM, 0);
  c.restore();
};
// setup.e1.1
const card1 = (c: Ctx) => {
  ground(c);
  tap(c, 520, 120);
  shape(c, () => rrect(c, 492, 200, 56, 480, 10), COL.water, 5); shine(c, [[506, 230], [506, 600]], 8);
  hand(c, 330, 840, -0.35, 3, "#e8b03a", CLOTH.child, true);
  [[360, 745], [445, 725], [530, 710]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 18, 12), COL.drop, 4));
  [[580, 700, 1], [620, 650, 1], [555, 800, 1], [605, 870, 1]].forEach(([x, y]) => drop(c, x, y, 22));
  clock(c, 800, 500, 150, 20);
};
// setup.e1.2
const card2 = (c: Ctx) => {
  ground(c);
  hand(c, 400, 540, 0, 3.4, SKIN.child, CLOTH.child, true);
  c.save(); c.translate(400, 540); c.scale(3.4, 3.4);
  line(c, [[66, 3], [90, 3]], 5, "#e8b03a"); line(c, [[66, 20.5], [88, 20.5]], 5, "#e8b03a");
  shape(c, () => ell(c, 57, -43, 7, 5), "#e8b03a", 2); c.restore();
  const r = rnd(9);
  for (let i = 0; i < 26; i++) { const t = r() * 6.28, d = Math.sqrt(r()); shape(c, () => ell(c, 460 + Math.cos(t) * 145 * d, 540 + Math.sin(t) * 115 * d, 24 + r() * 20, 22 + r() * 16), WHITE, 3.5); }
  arrow(c, [[860, 600], [730, 610]]); arrow(c, [[700, 270], [620, 375]]);
  shadow(c, 300, 920, 170, 24);
  shape(c, () => rrect(c, 160, 820, 260, 100, 30), COL.pink); shade(c, () => rrect(c, 160, 820, 260, 100, 30), "#c76a8a", 20, 14, 0.4);
  [[220, 810, 30], [300, 790, 38], [370, 815, 28]].forEach(([x, y, rr]) => shape(c, () => ell(c, x, y, rr, rr), WHITE, 4));
};
// setup.e3.0
const card3 = (c: Ctx) => {
  ground(c);
  jar(c, 250, 840, 260, 470, [[0.5, COL.water], [0.25, OIL]]);
  jar(c, 600, 840, 260, 470, [[0.5, COL.water], [0.25, OIL]]);
  shadow(c, 850, 850, 90, 16);
  shape(c, () => rrect(c, 770, 590, 160, 250, 40), COL.teal); shade(c, () => rrect(c, 770, 590, 160, 250, 40), COL.tealDk, 40, 0, 0.5);
  shape(c, () => rrect(c, 830, 530, 40, 70, 8), COL.steelDk); shape(c, () => rrect(c, 760, 510, 120, 36, 14), COL.steel);
  shape(c, () => ell(c, 850, 710, 50, 50), WHITE, 4); drop(c, 850, 710, 30, COL.pink);
  shape(c, () => { c.moveTo(600, 260); c.quadraticCurveTo(650, 340, 600, 345); c.quadraticCurveTo(550, 340, 600, 260); c.closePath(); }, WHITE, 5);
  arrow(c, [[600, 170], [600, 240]]);
};
// setup.e3.1
const card4 = (c: Ctx) => {
  ground(c);
  jarsShaken(c, 400, 790, 230, 420, false, 3);
  jarsShaken(c, 700, 790, 230, 420, true, 4);
  hand(c, 200, 600, 0, 2, SKIN.child, CLOTH.child);
  hand(c, 900, 600, Math.PI, 2, SKIN.child, CLOTH.child);
  [400, 700].forEach((x) => { arrow(c, [[x, 250], [x, 150]]); arrow(c, [[x + 70, 150], [x + 70, 250]]); });
};
// setup.e3.2
const card5 = (c: Ctx) => {
  ground(c);
  jar(c, 300, 850, 300, 540, [[0.5, COL.water], [0.28, OIL]]);
  jar(c, 740, 850, 300, 540, [[0.8, CLOUD]]);
  const r = rnd(8);
  for (let i = 0; i < 40; i++) shape(c, () => ell(c, 740 - 120 + r() * 240, 850 - 60 - r() * 340, 5 + r() * 5, 5 + r() * 5), "rgba(255,255,255,0.8)", 2);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 640 + i * 33, 430 + (i % 2) * 8, 22, 18), WHITE, 3.5);
};
// setup.e4.0
const card6 = (c: Ctx) => {
  ground(c);
  bag(c, 105, 60, 330, 400, "spoon");
  bag(c, 645, 60, 330, 400, "mud");
  bag(c, 105, 570, 330, 400, "water");
  bag(c, 645, 570, 330, 400, "soap");
};
// setup.e4.1
const card7 = (c: Ctx) => {
  ground(c);
  plate(c, 500, 830, 400, 120);
  bread(c, 500, 640, 480);
  hand(c, 250, 470, 0.25, 2.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[380, 300], [640, 300]]); arrow(c, [[640, 300], [380, 300]]);
  clock(c, 880, 560, 120, 10);
};
// setup.e4.2
const card8 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 130, 1020, 830, 20), "#b98150", 8);
  shape(c, () => rrect(c, 60, 160, 960, 740, 10), "#6a4128", 6);
  shape(c, () => rrect(c, 40, 880, 1000, 70, 10), COL.wood, 7);
  const w = 215, h = 470, y = 410;
  bag(c, 75, y, w, h, "spoon");
  bag(c, 313, y, w, h, "mud", [[-0.2, -0.25, 0.17, 0], [0.2, -0.2, 0.2, 1], [0, 0.05, 0.2, 0], [-0.22, 0.25, 0.16, 1], [0.2, 0.28, 0.17, 0], [-0.05, -0.35, 0.1, 1]]);
  bag(c, 551, y, w, h, "water", [[-0.2, -0.1, 0.1, 0], [0.18, 0.2, 0.12, 1], [0.1, -0.3, 0.07, 0]]);
  bag(c, 789, y, w, h, "soap", [[0.18, 0.28, 0.05, 0]]);
};

export const su_healthHygiene = cards("sci.health.hygiene.L3 set-up", [card0, card1, card2, card3, card4, card5, card6, card7, card8]);
