import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, bowl, seed, hand, write, rnd, cards } from "./flatKit";

// sci.ecology.interdependence.L3 set-up cards: tomato seeds in juice and water, banana and fruit flies.
const CREAM = "#f3e3a8", CREAMDK = "#cdb472", JELLY = "#a8cf5a", TOM = "#e4523b", TOMDK = "#b83a28";
const WETT = "#a9d3f0", JUICE = "#e0604d";

const tseed = (c: Ctx, x: number, y: number, r: number, rot: number, col = CREAM, dk = CREAMDK) => seed(c, x, y, r, rot, false, col, dk);
const dropShape = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.2, y - s * 0.5, x + s * 0.8, y - s * 0.1, x + s * 0.8, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.8, 0, Math.PI); c.bezierCurveTo(x - s * 0.8, y - s * 0.1, x - s * 0.2, y - s * 0.5, x, y - s); c.closePath(); }, col, 5);
const tomatoIcon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), TOM, 5);
  shade(c, () => ell(c, x, y, r, r * 0.9), TOMDK, r * 0.3, r * 0.2);
  shape(c, () => { c.moveTo(x, y - r * 0.9); c.lineTo(x + r * 0.35, y - r * 1.15); c.lineTo(x + r * 0.15, y - r * 0.75); c.lineTo(x + r * 0.5, y - r * 0.8); c.lineTo(x, y - r * 0.55); c.lineTo(x - r * 0.5, y - r * 0.8); c.lineTo(x - r * 0.15, y - r * 0.75); c.lineTo(x - r * 0.35, y - r * 1.15); c.closePath(); }, COL.green, 4);
};
const board = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w / 2 + 10, 24);
  shape(c, () => rrect(c, x, y, w, h, 30), COL.wood);
  shade(c, () => rrect(c, x, y, w, h, 30), COL.woodDk, 16, 16);
  shape(c, () => rrect(c, x, y, w, h, 30), "rgba(0,0,0,0)", 6);
};
// a tomato cut in half, seen from the cut side: red ring, pale flesh, green jelly chambers with seeds
const tomatoHalf = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), TOM);
  shade(c, () => ell(c, x, y, r, r), TOMDK, r * 0.12, r * 0.12, 0.5);
  shape(c, () => ell(c, x, y, r * 0.88, r * 0.88), "#f5876f", 4);
  const rd = rnd(5);
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + k * (Math.PI * 2 / 5), cx = x + Math.cos(a) * r * 0.45, cy = y + Math.sin(a) * r * 0.45;
    shape(c, () => ell(c, cx, cy, r * 0.27, r * 0.22, a), JELLY, 4);
    for (let i = 0; i < 4; i++) tseed(c, cx + (rd() - 0.5) * r * 0.26, cy + (rd() - 0.5) * r * 0.2, r * 0.07, rd() * 3);
  }
  shape(c, () => ell(c, x, y, r * 0.12, r * 0.12), "#fbe6d8", 3);
};
const tap = (c: Ctx, x: number, spoutY: number) => {
  shape(c, () => rrect(c, x - 320, spoutY - 120, 340, 64, 22), COL.steel);
  shade(c, () => rrect(c, x - 320, spoutY - 120, 340, 64, 22), COL.steelDk, 0, 14);
  shape(c, () => rrect(c, x - 56, spoutY - 120, 76, 120, 18), COL.steel);
  shade(c, () => rrect(c, x - 56, spoutY - 120, 76, 120, 18), COL.steelDk, 18, 0);
  shape(c, () => rrect(c, x - 220, spoutY - 170, 40, 54, 10), COL.red);
};
const stream = (c: Ctx, x: number, y0: number, y1: number) => {
  shape(c, () => rrect(c, x - 22, y0, 44, y1 - y0, 16), COL.water, 5);
  shine(c, [[x - 8, y0 + 14], [x - 8, y1 - 14]], 6);
};
// the tea strainer: a wide shallow mesh bowl with a handle on the right; rim centre (x, y)
const strainer = (c: Ctx, x: number, y: number, rx: number) => {
  const body = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.9, y + 300, x + rx * 0.9, y + 300, x + rx, y); c.closePath(); };
  shadow(c, x + 30, y + 250, rx * 0.8, 24);
  shape(c, () => rrect(c, x + rx - 30, y - 6, 180, 40, 20), COL.steelDk);
  shape(c, body, COL.steelIn);
  c.save(); c.beginPath(); body(); c.clip(); c.strokeStyle = COL.steelDk; c.lineWidth = 3;
  for (let i = -rx; i < rx * 2; i += 28) { line(c, [[x - rx + i, y], [x - rx + i - 120, y + 300]], 3, COL.steelDk); line(c, [[x - rx + i - 120, y], [x - rx + i, y + 300]], 3, COL.steelDk); }
  c.restore();
  shade(c, body, COL.steelDk, rx * 0.3, -10, 0.35);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y, rx, rx * 0.2), "#eef2f6", 6);
};
const tiffin = (c: Ctx, x: number, y: number, w: number, h: number, tissue: string, stain = false) => {
  shadow(c, x + 16, y + h / 2 + 14, w / 2 + 6, 28);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 40), COL.steel);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 40), COL.steelDk, 18, 18, 0.5);
  shape(c, () => rrect(c, x - w / 2 + 22, y - h / 2 + 22, w - 44, h - 44, 24), tissue, 5);
  const rd = rnd(3);
  if (stain) for (let i = 0; i < 6; i++) shape(c, () => ell(c, x + (rd() - 0.5) * (w - 140), y + (rd() - 0.5) * (h - 120), 40 + rd() * 30, 22 + rd() * 14, rd() * 3), "#c4443a", 0);
  else for (let i = 0; i < 8; i++) shape(c, () => ell(c, x + (rd() - 0.5) * (w - 120), y + (rd() - 0.5) * (h - 110), 12, 8), COL.drop, 2.5);
  line(c, [[x - w / 2 + 34, y - h / 2 + 34], [x + w / 2 - 34, y - h / 2 + 34]], 3, "rgba(43,35,64,0.25)");
};
const rowPos = (x: number, y: number, w: number, h: number) => {
  const p: number[][] = [];
  for (let r = 0; r < 2; r++) for (let k = 0; k < 5; k++) p.push([x - w / 2 + 84 + k * ((w - 168) / 4), y - h / 2 + 80 + r * (h - 160) + (k % 2) * 8]);
  return p;
};
const root = (c: Ctx, x: number, y: number, len: number, an: number, w = 17) => {
  const ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len, mx = x + Math.cos(an + 0.5) * len * 0.55, my = y + Math.sin(an + 0.5) * len * 0.55;
  const p = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, ex, ey); };
  p(); c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  p(); c.strokeStyle = WHITE; c.lineWidth = w - 9; c.stroke();
};
const tag = (c: Ctx, x: number, y: number, icon: () => void) => {
  shape(c, () => rrect(c, x - 90, y - 70, 180, 140, 26), WHITE, 5);
  icon();
};

// ---- bananas
const banana = (c: Ctx, x: number, y: number, L: number, ripe: boolean) => {
  const T = 78, sag = 70, col = ripe ? COL.yellow : COL.greenLt, dk = ripe ? COL.woodDk : COL.green, pts: number[][] = [], low: number[][] = [];
  for (let i = 0; i <= 24; i++) { const u = -1 + i / 12, px = x + u * L / 2, py = y + sag * (1 - u * u), t = T * (0.75 + 0.25 * (1 - u * u)); pts.push([px, py - t / 2]); low.push([px, py + t / 2]); }
  const path = () => { c.moveTo(pts[0][0], pts[0][1]); pts.forEach(([a, b]) => c.lineTo(a, b)); [...low].reverse().forEach(([a, b]) => c.lineTo(a, b)); c.closePath(); };
  shadow(c, x + 20, y + sag + 52, L * 0.45, 20);
  shape(c, () => rrect(c, x - L / 2 - 34, y - 26, 44, 34, 8), COL.brown, 5);
  shape(c, path, col); shade(c, path, dk, 0, 26, 0.6);
  shape(c, path, "rgba(0,0,0,0)", 6);
  if (ripe) { const rd = rnd(11); for (let i = 0; i < 16; i++) { const u = -0.85 + rd() * 1.7; shape(c, () => ell(c, x + u * L / 2, y + sag * (1 - u * u) + (rd() - 0.5) * 36, 7 + rd() * 6, 5 + rd() * 4, rd() * 3), "#7a4a24", 0); } }
  else line(c, [[x - L * 0.4, y + sag * 0.55], [x + L * 0.4, y + sag * 0.55]], 3, COL.green);
  const ex = pts[24][0], ey = (pts[24][1] + low[24][1]) / 2;
  shape(c, () => ell(c, ex, ey, 12, T * 0.3), "#fff3c4", 5);
};
const chunk = (c: Ctx, x: number, y: number, ripe: boolean, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const col = ripe ? COL.yellow : COL.greenLt, dk = ripe ? COL.woodDk : COL.green, b = () => rrect(c, -70, -48, 140, 96, 34);
  shape(c, b, col); shade(c, b, dk, 0, 22, 0.6); shape(c, b, "rgba(0,0,0,0)", 6);
  if (ripe) { const rd = rnd(4); for (let i = 0; i < 5; i++) shape(c, () => ell(c, -50 + rd() * 90, -26 + rd() * 56, 6 + rd() * 4, 5, rd() * 3), "#7a4a24", 0); }
  shape(c, () => ell(c, 66, 0, 20, 44), "#fff3c4", 5);
  for (const [a, b2] of [[66, -14], [62, 8], [70, 20]]) shape(c, () => ell(c, a, b2, 3, 3), "#7a4a24", 0);
  c.restore();
};

// ---- window sill scene for the banana cards
const sill = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 130, 40, 820, 360, 22), COL.sky, 8);
  shape(c, () => ell(c, 780, 150, 60, 60), COL.yellow, 5);
  line(c, [[540, 40], [540, 400]], 12); line(c, [[130, 220], [950, 220]], 12);
  shape(c, () => ell(c, 300, 320, 100, 34), WHITE, 0); shape(c, () => ell(c, 370, 290, 70, 30), WHITE, 0);
  shape(c, () => { c.moveTo(30, 420); c.lineTo(1050, 420); c.lineTo(1050, 810); c.lineTo(30, 810); c.closePath(); }, COL.wood);
  shape(c, () => { c.moveTo(30, 810); c.lineTo(1050, 810); c.lineTo(1050, 910); c.lineTo(30, 910); c.closePath(); }, COL.woodDk);
};
const sillBowls = (c: Ctx) => {
  bowl(c, 290, 640, 230); bowl(c, 790, 640, 230);
  chunk(c, 290, 620, true, 2.1); chunk(c, 790, 620, false, 2.1);
};
const fly = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => ell(c, -8, -14, 22, 10, -0.5), "rgba(230,240,250,0.85)", 3); shape(c, () => ell(c, 8, -14, 22, 10, 0.5), "rgba(230,240,250,0.85)", 3);
  shape(c, () => ell(c, 0, 0, 24, 14), COL.black, 4); shape(c, () => ell(c, 22, -2, 12, 12), COL.black, 4); shape(c, () => ell(c, 26, -6, 6, 6), RED, 2);
  c.restore();
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  board(c, 40, 200, 1000, 810);
  tomatoHalf(c, 340, 660, 245);
  bowl(c, 810, 830, 160);
  for (const [x, y] of [[750, 830], [800, 845], [860, 828], [820, 818], [770, 855], [850, 855]]) tseed(c, x, y, 20, x);
  // the spoon: handle to the tomato's jelly, bowl of the spoon with jelly and seeds
  const d = 2.0, T = [430, 570], g = [T[0] - Math.cos(d) * 270, T[1] - Math.sin(d) * 270];
  line(c, [[g[0], g[1]], T], 32, INK); line(c, [[g[0], g[1]], T], 18, COL.steel);
  shape(c, () => ell(c, T[0], T[1], 56, 40, d), COL.steel, 5); shape(c, () => ell(c, T[0], T[1], 40, 27, d), JELLY, 3);
  tseed(c, T[0] - 10, T[1] - 4, 11, 0.3); tseed(c, T[0] + 12, T[1] + 6, 11, 1);
  hand(c, g[0] - Math.cos(d) * 140, g[1] - Math.sin(d) * 140, d, 2);
  arrow(c, [[600, 800], [600, 700], [700, 700]], RED, 13);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  tap(c, 640, 190);
  stream(c, 640, 190, 490);
  strainer(c, 600, 520, 280);
  const rd = rnd(8);
  for (let i = 0; i < 24; i++) tseed(c, 420 + rd() * 360, 505 + rd() * 26, 22, rd() * 3);
  for (const [x, y] of [[470, 870], [580, 940], [680, 860], [520, 1010], [650, 1020]]) dropShape(c, x, y, 26, COL.water);
  hand(c, 210, 380, 0.45, 2.2, SKIN.child, "#f39a3c", true);
};

// setup.e1.2
const boxes = (c: Ctx, grown: boolean) => {
  ground(c);
  tiffin(c, 640, 300, 740, 340, WETT, false);
  tiffin(c, 640, 730, 740, 340, JUICE, true);
  const a = rowPos(640, 300, 740, 340), b = rowPos(640, 730, 740, 340);
  const rd = rnd(21);
  a.forEach(([x, y], i) => { if (grown && i !== 3 && i !== 8) root(c, x + 8, y + 8, 105, i < 5 ? 0.9 + rd() * 0.4 : i === 9 ? 3.3 : 0.05 + rd() * 0.4, 24); });
  a.forEach(([x, y], i) => tseed(c, x, y, 36, i * 0.6));
  b.forEach(([x, y], i) => tseed(c, x, y, 36, i * 0.6 + 1));
  tag(c, 120, 300, () => dropShape(c, 120, 300, 52));
  tag(c, 120, 730, () => tomatoIcon(c, 120, 735, 50));
};
const e1_2 = (c: Ctx) => boxes(c, false);

// setup.e1.3
const e1_3 = (c: Ctx) => boxes(c, true);

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  tap(c, 380, 190);
  stream(c, 380, 190, 490);
  strainer(c, 380, 520, 280);
  const rd = rnd(9);
  for (let i = 0; i < 24; i++) tseed(c, 200 + rd() * 360, 505 + rd() * 26, 22, rd() * 3, "#e9a79a", "#c4443a");
  for (const [x, y] of [[300, 870], [400, 940], [490, 860], [340, 1010], [470, 1020]]) dropShape(c, x, y, 26, "#f08a7a");
  hand(c, 890, 536, Math.PI, 2.2);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  tiffin(c, 540, 770, 860, 420, WETT, false);
  const p = rowPos(540, 770, 860, 420), rd = rnd(2);
  p.slice(2).forEach(([x, y], i) => tseed(c, x + 20, y + 6, 36, i * 0.7 + rd()));
  hand(c, 330, 290, 0.8, 2.2);
  tseed(c, 480, 450, 34, 0.4);
  arrow(c, [[700, 300], [700, 420], [700, 500]], RED, 13);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  tiffin(c, 540, 540, 940, 640, WETT, false);
  const p = rowPos(540, 540, 940, 640), rd = rnd(6);
  p.forEach(([x, y], i) => { if (i !== 4 && i !== 7) root(c, x + 8, y + 10, 130, 0.9 + rd() * 0.6); });
  p.forEach(([x, y], i) => tseed(c, x, y, 40, i * 0.6));
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  board(c, 50, 130, 980, 820);
  banana(c, 340, 250, 520, true);
  banana(c, 340, 600, 520, false);
  chunk(c, 840, 330, true, 1.5);
  chunk(c, 840, 670, false, 1.5);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  sill(c);
  sillBowls(c);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  sill(c);
  sillBowls(c);
  const F: [number, number, number, number][] = [[100, 485, 1.9, 0.3], [250, 468, 1.9, -0.4], [400, 480, 1.9, 0.2], [490, 560, 1.9, 3.3], [175, 560, 1.9, 0.6], [330, 545, 1.9, -0.2], [430, 620, 1.9, 3.0], [260, 625, 1.9, 0.1], [95, 625, 1.9, 3.2]];
  F.forEach(([x, y, s, r]) => fly(c, x, y, s, r));
};

export const su_ecologyInterdependence = cards("sci.ecology.interdependence.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
