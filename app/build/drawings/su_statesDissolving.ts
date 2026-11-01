import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, rnd, cards } from "./flatKit";

// SET-UP CARDS · sci.states.dissolving.L3 · salt/sugar glasses, spoons, warm/cold water. Flat kit style.
const SALT = { fill: "#ffffff", dot: "#98a3b3" }, SUGAR = { fill: "#fff0cf", dot: "#e0b25c" };
type Grain = { fill: string; dot: string };

// a heap of grains standing on a flat base: base centre (x, y), width w, height h
const heap = (c: Ctx, x: number, y: number, w: number, h: number, g: Grain, seedN = 3) => {
  const p = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.18, y - h * 1.5, x, y - h); c.quadraticCurveTo(x + w * 0.18, y - h * 1.5, x + w / 2, y); c.closePath(); };
  shape(c, p, g.fill, 5); shade(c, p, "#c9ccd6", w * 0.08, 0, 0.45);
  const r = rnd(seedN);
  for (let i = 0; i < 16; i++) { const u = r(), v = r(), px = x - w * 0.36 + u * w * 0.72, py = y - 6 - v * h * 0.55 * (1 - Math.abs(u - 0.5) * 1.3); shape(c, () => ell(c, px, py, 4.5, 3.5), g.dot, 0); }
};
// grains falling in a few lines
const falling = (c: Ctx, x: number, y0: number, y1: number, g: Grain, seedN = 5) => {
  const r = rnd(seedN);
  for (let i = 0; i < 9; i++) { const px = x + (r() - 0.5) * 36, py = y0 + (y1 - y0) * (i / 9) + r() * 14; shape(c, () => ell(c, px, py, 10, 8), g.fill, 3.5); }
};
// a teaspoon from the grip point (gx, gy) along angle an; load = grains heaped in the bowl
const spoon = (c: Ctx, gx: number, gy: number, an: number, len: number, load: Grain | null = null) => {
  c.save(); c.translate(gx, gy); c.rotate(an);
  shape(c, () => rrect(c, 0, -12, len, 24, 12), COL.steel, 6);
  shade(c, () => rrect(c, 0, -12, len, 24, 12), COL.steelDk, 0, 8, 0.5);
  shape(c, () => ell(c, len + 50, 0, 66, 42), COL.steel, 6);
  shape(c, () => ell(c, len + 52, -2, 50, 28), COL.steelIn, 4);
  if (load) { const bx = len + 52, p = () => { c.moveTo(bx - 40, -2); c.quadraticCurveTo(bx - 20, -42, bx, -34); c.quadraticCurveTo(bx + 24, -42, bx + 40, -2); c.closePath(); }; shape(c, p, load.fill, 4); for (let i = 0; i < 6; i++) shape(c, () => ell(c, bx - 24 + i * 10, -10 - (i % 3) * 5, 3.5, 3), load.dot, 0); }
  c.restore();
};
// a hand gripping at (gx, gy) along angle an
const gripHand = (c: Ctx, gx: number, gy: number, an: number, s = 2.2, open = false) =>
  hand(c, gx - Math.cos(an) * 70 * s, gy - Math.sin(an) * 70 * s, an, s, SKIN.child, CLOTH.child, open);
const mirrored = (c: Ctx, f: () => void) => { c.save(); c.translate(1080, 0); c.scale(-1, 1); f(); c.restore(); };
// a flat coloured mat under a glass: blue = cold, orange = warm, grey = room
const mat = (c: Ctx, x: number, y: number, rx: number, col: string) => shape(c, () => ell(c, x, y + 4, rx, rx * 0.2), col, 5);
const steam = (c: Ctx, x: number, y: number) => {
  for (const dx of [-60, 0, 60]) { c.globalAlpha = 0.8; line(c, [[x + dx, y], [x + dx - 22, y - 36], [x + dx + 20, y - 72], [x + dx - 18, y - 108], [x + dx + 8, y - 140]], 11, COL.grey); c.globalAlpha = 1; }
};
const ice = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.14);
  c.save(); c.translate(0, 0); shape(c, p, "#e6f6ff", 5); shade(c, p, "#9fc9e8", s * 0.16, s * 0.16, 0.5); line(c, [[x - s * 0.3, y - s * 0.2], [x - s * 0.1, y - s * 0.35]], 7, WHITE); c.restore();
};
// a glass tipped to pour to the right, pivot at its bottom centre; level = world y of the water; heap on its floor
const tiltGlass = (c: Ctx, px: number, py: number, rot: number, w: number, h: number, level: number, g: Grain) => {
  const bot = w * 0.4, T = ([x, y]: number[]) => [px + x * Math.cos(rot) - y * Math.sin(rot), py + x * Math.sin(rot) + y * Math.cos(rot)];
  const body = [T([-w / 2, -h]), T([w / 2, -h]), T([bot, 0]), T([-bot, 0])];
  shadow(c, px + 40, py + 20, w * 0.55, w * 0.1);
  c.save(); c.beginPath(); polyP(c, body); c.clip(); c.fillStyle = COL.water; c.fillRect(-100, level, 1300, 1300); c.restore();
  c.save(); c.translate(px, py); c.rotate(rot); heap(c, 0, -4, bot * 1.5, 90, g, 9); c.restore();
  shape(c, () => polyP(c, body), COL.glass, 5);
  const t0 = T([0, -h]); shape(c, () => ell(c, t0[0], t0[1], w / 2, w * 0.08, rot), "rgba(255,255,255,0.35)", 5);
  const a = T([-w * 0.3, -h * 0.85]), b = T([-bot * 0.7, -h * 0.2]); shine(c, [a, b], 7);
};
const tallyPaper = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 10, y + 215, 100, 20);
  shape(c, () => rrect(c, x - 100, y - 140, 200, 350, 10), COL.paper, 6);
  for (const [gy, n] of [[y - 90, 5], [y + 30, 3]] as [number, number][]) {
    for (let i = 0; i < Math.min(n, 4); i++) line(c, [[x - 60 + i * 28, gy], [x - 60 + i * 28, gy + 70]], 7);
    if (n === 5) line(c, [[x - 78, gy + 55], [x + 40, gy + 12]], 7, RED_);
  }
};
const RED_ = "#d7372b";

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  glass(c, 290, 760, 310, 460, 0.4); glass(c, 790, 760, 310, 460, 0.4);
  for (const [x, g, bg] of [[290, SALT, COL.sky], [790, SUGAR, COL.pink]] as [number, Grain, string][]) {
    shadow(c, x + 12, 985, 120, 18);
    shape(c, () => rrect(c, x - 120, 830, 240, 150, 14), bg, 6);
    shape(c, () => rrect(c, x - 98, 850, 196, 110, 10), COL.paper, 4);
    heap(c, x, 940, 130, 60, g, 4);
  }
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  glass(c, 720, 930, 340, 450, 0.4);
  spoon(c, 360, 250, 0.3, 270, SALT); gripHand(c, 360, 250, 0.3);
  falling(c, 690, 395, 500, SALT);
  // butter knife lying on the counter
  shadow(c, 300, 1000, 230, 14);
  shape(c, () => polyP(c, [[150, 950], [470, 935], [495, 975], [150, 1002]]), COL.steel, 6);
  shape(c, () => rrect(c, 10, 945, 170, 62, 24), COL.teal, 6);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  glass(c, 250, 780, 300, 440, 0.5); heap(c, 250, 776, 190, 70, SALT, 6);
  glass(c, 620, 780, 300, 440, 0.5);
  for (let i = 0; i < 3; i++) spoon(c, 830 + i * 84, 1030, -Math.PI / 2, 170);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  glass(c, 810, 980, 280, 360, 0.3);
  tiltGlass(c, 230, 720, 0.9, 280, 400, 580, SALT);
  c.beginPath(); c.moveTo(642, 566); c.quadraticCurveTo(740, 575, 786, 860); c.lineWidth = 26; c.strokeStyle = INK; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.moveTo(642, 566); c.quadraticCurveTo(740, 575, 786, 860); c.lineWidth = 14; c.strokeStyle = COL.water; c.stroke();
  mirrored(c, () => { spoon(c, 175, 340, 0.3, 80, SUGAR); gripHand(c, 175, 340, 0.3); });
  falling(c, 790, 420, 700, SUGAR, 8);
  arrow(c, [[420, 420], [520, 450], [590, 510]]);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], mats = [COL.blue, COL.grey, COL.orange];
  xs.forEach((x, i) => { mat(c, x, 770, 150, mats[i]); glass(c, x, 760, 250, 380, 0.6); });
  ice(c, 205, 546, 78);
  steam(c, 890, 360);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  mat(c, 700, 940, 210, COL.blue);
  spoon(c, 910, 500, 1.92, 330);
  glass(c, 700, 930, 360, 470, 0.6);
  ice(c, 600, 650, 86);
  spoon(c, 360, 230, 0.35, 270, SUGAR); gripHand(c, 360, 230, 0.35);
  falling(c, 690, 390, 640, SUGAR, 11);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  mat(c, 590, 960, 220, COL.blue);
  spoon(c, 460, 280, 1.2, 520);
  glass(c, 590, 950, 360, 500, 0.6);
  ice(c, 520, 700, 80);
  gripHand(c, 462, 285, 0.15);
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const a = 3.6 + i * 0.37; pts.push([590 + Math.cos(a) * 130, 500 + Math.sin(a) * 34]); }
  arrow(c, pts);
  tallyPaper(c, 940, 640);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  mat(c, 290, 800, 200, COL.blue); mat(c, 780, 800, 200, COL.orange);
  glass(c, 290, 790, 310, 460, 0.4); glass(c, 780, 790, 310, 460, 0.4);
  steam(c, 780, 340);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  mat(c, 720, 940, 210, COL.orange);
  glass(c, 720, 930, 340, 450, 0.4);
  steam(c, 850, 470);
  spoon(c, 360, 250, 0.3, 270, SALT); gripHand(c, 360, 250, 0.3);
  falling(c, 690, 395, 560, SALT);
};
// setup.e3.2 · same heap in both glasses, and the same four tally strokes on a paper in front of each
const e3_2 = (c: Ctx) => {
  ground(c);
  mat(c, 290, 690, 200, COL.blue); mat(c, 780, 690, 200, COL.orange);
  glass(c, 290, 680, 310, 440, 0.4); heap(c, 290, 676, 200, 80, SALT, 5);
  glass(c, 780, 680, 310, 440, 0.4); heap(c, 780, 676, 200, 80, SALT, 5);
  steam(c, 780, 240);
  for (const x of [290, 780]) {
    shadow(c, x + 8, 1035, 150, 18);
    shape(c, () => rrect(c, x - 150, 800, 300, 220, 12), COL.paper, 6);
    for (let i = 0; i < 4; i++) line(c, [[x - 90 + i * 60, 830], [x - 90 + i * 60, 990]], 10);
  }
};

export const su_statesDissolving = cards("sci.states.dissolving.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
