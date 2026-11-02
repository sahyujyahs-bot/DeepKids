import type { Ctx } from "./core";
import { COL, INK, BG, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, glass, write, cards, rnd } from "./flatKit";

// sci.animals.insects.L2 set-up cards: ants and biscuit crumbs, earthworms damp or dry.
const BISC = "#d9a45c", BISCDK = "#b67f3a";
const FLOOR = "#e6d9c0";

const crumb = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  shape(c, () => ell(c, x, y, r, r * 0.75, rot), BISC, Math.max(2.5, r * 0.16));
  shade(c, () => ell(c, x, y, r, r * 0.75, rot), BISCDK, r * 0.3, r * 0.25, 0.5);
};
// an ant seen from above, head to the right when an = 0; s = length scale
const ant = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 0, 1]) for (const sd of [-1, 1]) line(c, [[k * 16, 0], [k * 16 + 6, sd * 18], [k * 16 - 6, sd * 30]], 4.5);
  shape(c, () => ell(c, -34, 0, 22, 14), "#6a3b25", 4.5);
  shape(c, () => ell(c, -4, 0, 12, 9), "#7a4630", 4.5);
  shape(c, () => ell(c, 26, 0, 14, 12), "#6a3b25", 4.5);
  line(c, [[34, -6], [48, -16], [56, -10]], 3.5); line(c, [[34, 6], [48, 16], [56, 10]], 3.5);
  c.restore();
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x + 14, y + 16, w, h, 6), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, x, y, w, h, 6), WHITE, 6);
};
const fl = (c: Ctx) => ground(c, FLOOR);

const S = [6, 11, 17, 27];
// e1.0 break a biscuit into four sizes of crumbs
const e1_0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 640, 470, 330);
  const R = rnd(4);
  const heap = (cx: number, cy: number, r: number) => { for (let i = 0; i < 5; i++) crumb(c, cx + (i % 3 - 1) * r * 2.2 + (R() - 0.5) * 6, cy + (i < 3 ? 0 : r * 1.7), r, R() * 3); };
  heap(350, 560, 12); heap(730, 560, 20); heap(350, 730, 32); heap(730, 730, 48);
  // spoon pressing a biscuit piece, big, at the top
  shape(c, () => polyP(c, [[130, 130], [270, 100], [290, 220], [150, 250]]), BISC, 7);
  shade(c, () => polyP(c, [[130, 130], [270, 100], [290, 220], [150, 250]]), BISCDK, 16, 16, 0.5);
  c.save(); c.translate(230, 170); c.rotate(-0.25); c.scale(1.5, 1.5);
  shape(c, () => rrect(c, 40, -14, 240, 28, 12), COL.steel, 5);
  shape(c, () => ell(c, 20, 0, 52, 36), COL.steel, 5);
  shape(c, () => ell(c, 20, 0, 36, 22), COL.steelIn, 4);
  c.restore();
  arrow(c, [[70, 30], [70, 150]], RED, 12);
};

// e1.1 paper on the floor, pencil line, 20 crumbs in a row, ants beside
const e1_1 = (c: Ctx) => {
  fl(c);
  paper(c, 60, 300, 700, 500);
  line(c, [[100, 600], [720, 600]], 8, "#6b6577");
  const R = rnd(11);
  const order = [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 3, 1, 2, 0, 1, 3, 1, 3, 0, 2];
  let x = 96; order.forEach((k, i) => { const r = S[k] * 1.05; x += r; crumb(c, x, 600 - r * 0.3, r, R() * 3); x += r + 3; });
  [[880, 380, 3.3], [930, 520, 3.0], [890, 650, 3.2], [940, 770, 2.9]].forEach(([ax, ay, an]) => ant(c, ax, ay, an, 1.0));
  crumb(c, 470, 430, 22, 0.5);
  hand(c, 330, 330, 0.2, 1.7, SKIN.child, CLOTH.child, false);
  arrow(c, [[560, 400], [560, 510]], RED, 12);
};

// e1.2 close-up of ants working on three crumbs, with a 20 timer
const e1_2 = (c: Ctx) => {
  fl(c);
  paper(c, 40, 60, 920, 900);
  ant(c, 200, 220, 0.1, 1.6); crumb(c, 345, 215, 16, 0.4);
  crumb(c, 760, 480, 40, 0.4);
  ant(c, 640, 390, 0.45, 1.5); ant(c, 640, 560, -0.5, 1.5); ant(c, 860, 600, -2.5, 1.5);
  crumb(c, 300, 720, 130, 0.2);
  [[210, 650, 1], [310, 620, 2.5], [400, 680, 4], [250, 750, 0.3], [370, 790, 3.2], [180, 760, 5], [330, 700, 1.8]].forEach(([ax, ay, an]) => ant(c, ax, ay, an, 1.0));
  shape(c, () => ell(c, 800, 830, 100, 100), WHITE, 7);
  shape(c, () => ell(c, 800, 830, 80, 80), "#f6efe0", 3);
  write(c, "20", 755, 800, 60, INK, 9);
};

// e1.3 child counting crumbs left, results table beside
const e1_3 = (c: Ctx) => {
  fl(c);
  paper(c, 50, 150, 460, 640);
  const keep = [3, 2, 4, 1], R = rnd(3);
  S.forEach((r, k) => { for (let i = 0; i < keep[k]; i++) crumb(c, 110 + k * 105 + (R() - 0.5) * 16, 230 + i * 120 + (R() - 0.5) * 10, r * 1.5, R() * 3); });
  shape(c, () => rrect(c, 570, 150, 420, 640, 14), WHITE, 7);
  S.forEach((r, k) => {
    const y = 240 + k * 150;
    if (k) line(c, [[590, y - 75], [970, y - 75]], 4, "#b9b4ab");
    crumb(c, 660, y, r * 1.5, 0.3);
    write(c, String(keep[k]), 820, y - 45, 90, INK, 10);
  });
  hand(c, 300, 930, -1.57, 1.7, SKIN.child, CLOTH.child, true);
};

// tray from above
const tray = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x + 16, y + 20, w, h, 28), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, x, y, w, h, 28), COL.steel, 7);
  shape(c, () => rrect(c, x + 28, y + 28, w - 56, h - 56, 14), COL.steelIn, 5);
};
const towels = (c: Ctx, drops = true) => {
  const x = 50, y = 380, w = 940, h = 500;
  tray(c, x, y, w, h);
  shape(c, () => rrect(c, x + 44, y + 44, w / 2 - 44, h - 88, 6), "#5a6a86", 5);
  shape(c, () => rrect(c, x + w / 2, y + 44, w / 2 - 44, h - 88, 6), "#f3ead6", 5);
  if (drops) for (const [dx, dy] of [[130, 140], [260, 240], [170, 360], [330, 130], [360, 350], [110, 250]]) {
    shape(c, () => { const px = x + dx, py = y + dy; c.moveTo(px, py - 30); c.quadraticCurveTo(px + 25, py + 6, px, py + 18); c.quadraticCurveTo(px - 25, py + 6, px, py - 30); }, COL.drop, 3);
  }
};

// e2.0 damp left, dry right
const e2_0 = (c: Ctx) => {
  ground(c);
  towels(c, false);
  c.save(); c.translate(330, 250); c.rotate(-0.9);
  glass(c, 0, 0, 190, 230, 0.45);
  c.restore();
  for (const [dx, dy] of [[250, 330], [300, 390], [350, 330], [270, 450]]) shape(c, () => { c.moveTo(dx, dy - 24); c.quadraticCurveTo(dx + 20, dy + 4, dx, dy + 14); c.quadraticCurveTo(dx - 20, dy + 4, dx, dy - 24); }, COL.drop, 3);
  arrow(c, [[540, 150], [540, 290]], RED, 12);
};

const worm = (c: Ctx, x: number, y: number, len: number, ph: number) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([x + (u - 0.5) * len, y + Math.sin(u * 7 + ph) * 10]); }
  line(c, pts, 48, INK); line(c, pts, 36, "#d98a8a");
  line(c, pts.slice(9, 14), 36, "#b86b72");
  line(c, pts.slice(1, 20).map(([a, b]) => [a, b - 9]), 6, "rgba(255,255,255,0.4)");
};

// e2.1 three worms across the middle line
const e2_1 = (c: Ctx) => {
  ground(c);
  towels(c);
  worm(c, 520, 550, 440, 0); worm(c, 520, 640, 440, 2); worm(c, 520, 730, 440, 4);
  hand(c, 400, 150, 1.57, 1.7, SKIN.child, CLOTH.child, true);
  arrow(c, [[760, 150], [760, 330]], RED, 12);
};

// e2.2 cloth over the tray, phone timer with 10
const e2_2 = (c: Ctx) => {
  ground(c);
  tray(c, 40, 380, 640, 420);
  const cl = () => { c.moveTo(30, 450); c.quadraticCurveTo(360, 360, 700, 450); c.lineTo(730, 780); c.quadraticCurveTo(360, 850, 30, 790); c.closePath(); };
  shape(c, cl, COL.cloth, 7); shade(c, cl, "#d8cfba", 14, 14, 0.5);
  line(c, [[230, 470], [210, 780]], 4, "#d8cfba"); line(c, [[470, 470], [500, 790]], 4, "#d8cfba");
  shape(c, () => rrect(c, 784, 300, 240, 520, 36), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, 770, 280, 240, 520, 36), "#3a3540", 7);
  shape(c, () => rrect(c, 790, 320, 200, 440, 14), "#22303a", 4);
  write(c, "10", 805, 480, 120, COL.yellow, 14);
  hand(c, 330, 150, 1.57, 1.7, SKIN.child, CLOTH.child, true);
  arrow(c, [[150, 190], [150, 340]], RED, 12);
};

export const su_animalsInsectsL2 = cards("sci.animals.insects.L2 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
