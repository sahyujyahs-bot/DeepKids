import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, bowl, cards, ell, glass, ground, leaf, line, person, plate, polyP, rrect, seed, shade, shadow, shape, shine, write } from "./flatKit";

// sci.food.where-food-comes-from.L3 · picture cards for activities, experiments, project, challenge and terms.
// Flat DeepKids look; red arrows = movement or change; no words.

const PI = Math.PI, MILK = "#fffdf4", MILKDK = "#ece4cc", IODINE = "#b8601c", BLUEBLK = "#2a2a5c", CHAP = "#e8c07a", SAND = "#e9d3a5";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6, p = [[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]]; line(c, p, r * 0.2, INK); line(c, p, r * 0.1, COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), COL.orange, 0); c.globalAlpha = 0.5; shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), COL.yellow, 0); c.globalAlpha = 1;
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const dropP = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - r * 2.1); c.quadraticCurveTo(x - r * 1.2, y - r * 0.6, x - r, y); c.arc(x, y, r, PI, 0, true); c.quadraticCurveTo(x + r * 1.2, y - r * 0.6, x, y - r * 2.1); c.closePath(); }, col, Math.max(3, r * 0.2));
const rod = (c: Ctx, x: number, y: number, L: number, W: number, rot: number, col: string = COL.teal) => {
  c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -L / 2, -W / 2, L, W, W / 2), col, Math.max(3, W * 0.14)); c.globalAlpha = 0.5; line(c, [[-L * 0.3, -W * 0.18], [L * 0.2, -W * 0.18]], W * 0.16, WHITE); c.restore(); c.globalAlpha = 1;
};
const lens = (c: Ctx, x: number, y: number, r: number, fill: string, inner: () => void, handle = true) => {
  if (handle) { const a = PI * 0.3; line(c, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + r * 0.55), y + Math.sin(a) * (r + r * 0.55)]], r * 0.16 + 10, INK); line(c, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + r * 0.55), y + Math.sin(a) * (r + r * 0.55)]], r * 0.16, COL.wood); }
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.fillStyle = fill; c.fillRect(x - r, y - r, r * 2, r * 2); inner(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = r * 0.07; c.strokeStyle = INK; c.stroke(); c.beginPath(); ell(c, x, y, r - r * 0.07, r - r * 0.07); c.lineWidth = r * 0.04; c.strokeStyle = COL.steel; c.stroke();
};
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, dk: string) => {
  const p = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.8, y - ry * 1.4, x + rx * 0.8, y - ry * 1.4, x + rx, y); c.closePath(); };
  shape(c, p, col, 5); shade(c, p, dk, rx * 0.3, ry * 0.1);
};
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.88), COL.red, 6); shade(c, () => ell(c, x, y, r, r * 0.88), "#b73a29", r * 0.25, r * 0.2);
  for (let i = 0; i < 5; i++) { const a = -PI / 2 + (i * 2 * PI) / 5 + 0.3; leaf(c, x, y - r * 0.8, r * 0.4, a, COL.leaf); }
  shine(c, [[x - r * 0.6, y - r * 0.1], [x - r * 0.4, y - r * 0.45]], r * 0.1);
};
const potato = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  shape(c, () => ell(c, x, y, rx, ry, rot), "#c99a62", 6); shade(c, () => ell(c, x, y, rx, ry, rot), "#a77a46", rx * 0.2, ry * 0.2);
  for (const [dx, dy] of [[-0.4, -0.2], [0.2, 0.3], [0.45, -0.25], [-0.1, 0.45]]) shape(c, () => ell(c, x + dx * rx, y + dy * ry, rx * 0.06, ry * 0.05), "#6a4128", 0);
};
const carrot = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); const w = len * 0.17;
  leaf(c, 0, 0, len * 0.35, PI + 0.5, COL.leaf); leaf(c, 0, 0, len * 0.4, PI, COL.leaf); leaf(c, 0, 0, len * 0.35, PI - 0.5, COL.leaf);
  shape(c, () => { c.moveTo(0, -w); c.quadraticCurveTo(len * 0.6, -w * 0.8, len, 0); c.quadraticCurveTo(len * 0.6, w * 0.8, 0, w); c.closePath(); }, COL.orange, 6);
  for (const t of [0.3, 0.55, 0.75]) line(c, [[len * t, -w * 0.5], [len * t, w * 0.3]], 3, "#c27424"); c.restore();
};
const cane = (c: Ctx, x: number, y: number, L: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); const W = L * 0.1;
  shape(c, () => rrect(c, 0, -W / 2, L, W, W * 0.3), "#8a6fa6", 6); shade(c, () => rrect(c, 0, -W / 2, L, W, W * 0.3), "#5e4a7a", 0, W * 0.25);
  for (let i = 1; i < 6; i++) { const px = (L * i) / 6; line(c, [[px, -W / 2], [px, W / 2]], 5, INK); shape(c, () => ell(c, px, 0, W * 0.07, W * 0.5), "#c7b68a", 3); }
  c.restore();
};
const grass = (c: Ctx, x: number, y: number, s: number) => { for (let i = -3; i <= 3; i++) leaf(c, x + i * s * 0.1, y, s * (0.7 + 0.2 * Math.cos(i)), -PI / 2 + i * 0.16, i % 2 ? COL.green : COL.leaf); };
const cowHead = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * s * 0.5, y - s * 0.62, s * 0.16, s * 0.08, k * 0.2), "#f4efe0", 5); shape(c, () => ell(c, x + k * s * 0.72, y - s * 0.28, s * 0.3, s * 0.13, k * -0.4), COL.brown, 5); }
  shape(c, () => rrect(c, x - s * 0.5, y - s * 0.8, s, s * 1.4, s * 0.4), "#f4efe0", 6);
  shape(c, () => ell(c, x - s * 0.28, y - s * 0.55, s * 0.2, s * 0.17), COL.brown, 0);
  shape(c, () => ell(c, x, y + s * 0.38, s * 0.4, s * 0.28), COL.pink, 6);
  shape(c, () => ell(c, x - s * 0.15, y + s * 0.38, s * 0.05, s * 0.07), INK, 0); shape(c, () => ell(c, x + s * 0.15, y + s * 0.38, s * 0.05, s * 0.07), INK, 0);
  shape(c, () => ell(c, x - s * 0.25, y - s * 0.1, s * 0.07, s * 0.09), INK, 0); shape(c, () => ell(c, x + s * 0.25, y - s * 0.1, s * 0.07, s * 0.09), INK, 0);
};
const cowSide = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 0, 72, 200, 18);
  line(c, [[-150, -140], [-185, -100], [-180, -30]], 12, INK); line(c, [[-150, -140], [-185, -100], [-180, -30]], 5, "#f4efe0"); shape(c, () => ell(c, -180, -22, 14, 22), COL.brown, 5);
  for (const lx of [-120, -75, 65, 110]) shape(c, () => rrect(c, lx - 18, -70, 36, 138, 12), lx < 0 ? "#e6dfcc" : "#f4efe0", 6);
  for (const lx of [-120, -75, 65, 110]) shape(c, () => rrect(c, lx - 18, 50, 36, 20, 8), INK, 0);
  shape(c, () => rrect(c, -160, -190, 320, 150, 66), "#f4efe0", 6); shade(c, () => rrect(c, -160, -190, 320, 150, 66), "#d9d0b8", 20, 30);
  shape(c, () => ell(c, -60, -140, 50, 34, 0.3), COL.brown, 0); shape(c, () => ell(c, 40, -90, 38, 28, -0.2), COL.brown, 0);
  shape(c, () => rrect(c, 125, -200, 85, 100, 40), "#f4efe0", 6); shape(c, () => ell(c, 195, -118, 36, 28), COL.pink, 6);
  shape(c, () => ell(c, 130, -205, 30, 14, -0.5), COL.brown, 5); shape(c, () => ell(c, 148, -222, 8, 18, 0.3), "#fbf4d6", 4);
  shape(c, () => ell(c, 168, -160, 7, 9), INK, 0);
  c.restore();
};
const wheat = (c: Ctx, x: number, y: number, h: number) => {
  line(c, [[x, y], [x, y - h]], 12, INK); line(c, [[x, y], [x, y - h]], 5, COL.greenLt);
  leaf(c, x, y - h * 0.2, h * 0.4, -PI / 2 - 0.9, COL.leaf); leaf(c, x, y - h * 0.3, h * 0.35, -PI / 2 + 0.9, COL.leaf);
  for (let i = 0; i < 7; i++) for (const k of [-1, 1]) shape(c, () => ell(c, x + k * 14, y - h + 10 - i * 22, 9, 17, k * -0.5), COL.woodDk, 4);
  shape(c, () => ell(c, x, y - h - 150 + 140, 9, 17), COL.woodDk, 4);
  for (let i = 0; i < 4; i++) line(c, [[x, y - h - 10 + i * 6], [x + (i % 2 ? 22 : -22), y - h - 80]], 3, INK);
};
const chapati = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), CHAP, 6); shade(c, () => ell(c, x, y, rx, ry), "#c99a4a", rx * 0.1, ry * 0.15);
  for (const [dx, dy] of [[-0.4, -0.2], [0.3, -0.35], [0.1, 0.3], [-0.2, 0.4], [0.5, 0.1]]) shape(c, () => ell(c, x + dx * rx, y + dy * ry, rx * 0.1, ry * 0.12), "#a8722f", 0);
};
const rice = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  heap(c, x, y, rx, ry, MILK, MILKDK);
  for (let i = 0; i < 20; i++) { const t = (i * 0.37) % 1, u = (i * 0.61) % 1; rod(c, x - rx * 0.7 + t * rx * 1.4, y - ry * 0.15 - Math.sin(t * PI) * ry * 0.8 * u, rx * 0.16, rx * 0.06, (i * 1.7) % 3, "#fff7e0"); }
};
const katoriTop = (c: Ctx, x: number, y: number, r: number, inside: string) => {
  shadow(c, x + r * 0.1, y + r * 0.12, r * 1.02, r * 0.95); shape(c, () => ell(c, x, y, r, r), COL.steel, 5); shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), inside, 4);
};
const mound = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, n = 28, sd = 1) => {
  for (let i = 0; i < n; i++) { const a = i * 2.4 * sd, d = Math.sqrt(i / n) * r; seed(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.9, r * 0.17, a, false, col, dk); }
};
const dropperBottle = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -50, 0, 100, 130, 24), "#9a5a22", 6); shape(c, () => rrect(c, -22, -40, 44, 50, 6), "#4a4a5a", 5);
  shape(c, () => { c.moveTo(-18, -40); c.quadraticCurveTo(0, -140, 0, -170); c.quadraticCurveTo(0, -140, 18, -40); c.closePath(); }, "rgba(214,236,250,0.8)", 5);
  c.restore();
};
const sprout = (c: Ctx, x: number, y: number, h: number, bend: number, stem: string, lf: string, thick = 14) => {
  const pts = [[x, y], [x + bend * 0.3, y - h * 0.5], [x + bend, y - h]];
  line(c, pts, thick + 8, INK); line(c, pts, thick, stem);
  const [tx, ty] = pts[2]; shape(c, () => ell(c, tx - 20, ty + 4, 24, 12, -0.5), lf, 4); shape(c, () => ell(c, tx + 20, ty + 4, 24, 12, 0.5), lf, 4);
};
const star = (c: Ctx, x: number, y: number, r: number, fill: string) => shape(c, () => { for (let i = 0; i < 10; i++) { const a = (i * PI) / 5 - PI / 2, d = i % 2 ? r * 0.5 : r; c[i ? "lineTo" : "moveTo"](x + Math.cos(a) * d, y + Math.sin(a) * d); } c.closePath(); }, fill, 4);

// ------------------------------------------------------------------ flows
// e1: milk + a spoon of old curd -> thick curd
const e1 = (c: Ctx) => {
  ground(c);
  glass(c, 250, 800, 230, 340, 0.75, MILK);
  // spoon of curd above the glass
  line(c, [[140, 250], [290, 360]], 26, INK); line(c, [[140, 250], [290, 360]], 12, COL.steel);
  shape(c, () => ell(c, 330, 395, 62, 40, 0.6), COL.steel, 6); shape(c, () => ell(c, 332, 390, 48, 28, 0.6), MILK, 3);
  arrow(c, [[320, 460], [270, 550]], RED, 10);
  // the katori of set curd
  bowl(c, 780, 680, 200, MILK); heap(c, 780, 680, 170, 70, MILK, MILKDK);
  bowl(c, 780, 680, 200, MILK);
  heap(c, 780, 676, 160, 70, MILK, MILKDK);
  shape(c, () => ell(c, 780, 680, 200, 40), "rgba(0,0,0,0)", 5);
  arrow(c, [[455, 640], [575, 640]], RED, 12);
  lens(c, 830, 290, 150, "#f3ecd4", () => { rod(c, 790, 260, 86, 30, 0.5); rod(c, 870, 320, 86, 30, -0.4); rod(c, 830, 230, 70, 26, -0.2); rod(c, 780, 335, 70, 26, 0.9); rod(c, 900, 245, 66, 24, 1.2); }, false);
};
// e2: dry seeds -> soaked, sprouted seeds
const e2 = (c: Ctx) => {
  ground(c);
  plate(c, 270, 700, 250, 120);
  for (let i = 0; i < 20; i++) seed(c, 160 + (i % 5) * 52 + (i % 3) * 4, 650 + Math.floor(i / 5) * 32, 14, i * 0.9, false);
  plate(c, 810, 700, 250, 120);
  for (let i = 0; i < 9; i++) { const x = 680 + (i % 3) * 120, y = 640 + Math.floor(i / 3) * 44; line(c, [[x, y], [x + 30, y + 18], [x + 56, y + 14]], 16, INK); line(c, [[x, y], [x + 30, y + 18], [x + 56, y + 14]], 8, "#fffaf0"); seed(c, x, y, 24, 0.4 + i, true); }
  sprout(c, 730, 640, 70, 20, "#fffaf0", COL.greenLt, 9); sprout(c, 860, 700, 70, -20, "#fffaf0", COL.greenLt, 9);
  dropP(c, 540, 320, 34); dropP(c, 480, 250, 26); dropP(c, 600, 250, 26);
  arrow(c, [[420, 460], [660, 460]], RED, 14);
};
// e3: iodine on potato and rice turns blue-black; on cucumber it stays brown
const e3 = (c: Ctx) => {
  ground(c);
  // potato slice
  shadow(c, 215, 725, 150, 36); shape(c, () => ell(c, 200, 700, 140, 112), "#c99a62", 6); shape(c, () => ell(c, 200, 700, 118, 92), "#f5ecc8", 4);
  shape(c, () => ell(c, 205, 702, 84, 62, 0.3), BLUEBLK, 0);
  // rice
  shadow(c, 540, 745, 150, 36); katoriTop(c, 540, 700, 130, "#fffdf0"); mound(c, 540, 700, 90, "#fff7e0", MILKDK, 18);
  shape(c, () => ell(c, 545, 702, 70, 56, 0.2), BLUEBLK, 0); c.globalAlpha = 0.9; mound(c, 545, 702, 55, "#4a4a7a", BLUEBLK, 14); c.globalAlpha = 1;
  // cucumber slice
  shadow(c, 875, 725, 150, 36); shape(c, () => ell(c, 860, 700, 140, 112), COL.leafDk, 6); shape(c, () => ell(c, 860, 700, 120, 94), "#cfe9a0", 4);
  for (let i = 0; i < 10; i++) { const a = i * 0.63; shape(c, () => ell(c, 860 + Math.cos(a) * 55, 700 + Math.sin(a) * 42, 10, 6, a), "#f6f2d0", 3); }
  shape(c, () => ell(c, 860, 700, 36, 28), IODINE, 0); c.globalAlpha = 0.85; shape(c, () => ell(c, 860, 700, 36, 28), IODINE, 0); c.globalAlpha = 1;
  // the dropper and its drops
  dropperBottle(c, 510, 330, 1.2, 0.0);
  dropP(c, 510, 560, 20, IODINE);
  arrow(c, [[420, 520], [260, 590]], RED, 10); arrow(c, [[600, 520], [800, 590]], RED, 10);
};
// a1: four plates, a leaf, a cow, a mushroom, a salt crystal and a drop
const mushroom = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.22, y - s * 0.1, s * 0.44, s * 0.7, s * 0.14), "#f6ecd8", 5);
  const cap = () => { c.moveTo(x - s * 0.65, y); c.bezierCurveTo(x - s * 0.65, y - s * 0.85, x + s * 0.65, y - s * 0.85, x + s * 0.65, y); c.closePath(); };
  shape(c, cap, "#c98a58", 6); shade(c, cap, "#a8683c", s * 0.2, s * 0.1);
  for (const [dx, dy, r] of [[-0.3, -0.3, 0.08], [0.1, -0.5, 0.09], [0.35, -0.2, 0.07]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s), "#fbf0dc", 0);
};
const saltCube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - s, y - s * 0.6], [x, y - s * 1.1], [x + s, y - s * 0.6], [x, y - s * 0.1]]), WHITE, 5);
  shape(c, () => polyP(c, [[x - s, y - s * 0.6], [x, y - s * 0.1], [x, y + s * 0.9], [x - s, y + s * 0.4]]), "#e6eef6", 5);
  shape(c, () => polyP(c, [[x, y - s * 0.1], [x + s, y - s * 0.6], [x + s, y + s * 0.4], [x, y + s * 0.9]]), "#c9d8e6", 5);
};
const a1 = (c: Ctx) => {
  ground(c);
  const P: [number, number][] = [[290, 300], [790, 300], [290, 770], [790, 770]];
  P.forEach(([x, y]) => plate(c, x, y, 220, 120));
  leaf(c, 250, 345, 140, -0.9); leaf(c, 250, 345, 120, -2.2, COL.leafDk); leaf(c, 250, 345, 105, -1.55, COL.green);
  cowHead(c, 790, 290, 120);
  mushroom(c, 290, 770, 110); mushroom(c, 215, 800, 60);
  saltCube(c, 740, 800, 50); saltCube(c, 800, 780, 40); dropP(c, 860, 780, 24);
};
// a2: the six plant parts on a thali
const flowerHead = (c: Ctx, x: number, y: number, r: number) => {
  for (const k of [-1, 1]) leaf(c, x + k * r * 0.3, y + r * 0.6, r * 1.1, k > 0 ? -0.7 : -PI + 0.7, COL.leaf);
  shape(c, () => ell(c, x, y, r, r * 0.85), WHITE, 6);
  for (const [dx, dy] of [[-0.5, -0.1], [0, -0.45], [0.5, -0.1], [-0.2, 0.2], [0.3, 0.25]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * 0.4, r * 0.34), "#f6f1e0", 4);
};
const a2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 560, 470, 330);
  carrot(c, 120, 500, 270, -0.25);
  cane(c, 400, 420, 330, 0.45);
  leaf(c, 790, 520, 190, -0.4, COL.green); leaf(c, 790, 520, 190, -1.5); leaf(c, 790, 520, 170, -2.6, COL.leafDk);
  flowerHead(c, 260, 710, 115);
  tomato(c, 560, 730, 125);
  heap(c, 830, 790, 130, 70, COL.green, COL.greenDk); mound(c, 830, 770, 100, COL.green, COL.greenDk, 22);
};
// a3: four dinner foods, each with a line back to the Sun
const a3 = (c: Ctx) => {
  ground(c);
  sun(c, 540, 200, 110);
  const X = [150, 400, 680, 930];
  X.forEach((x) => arrow(c, [[x, 640], [540 + (x - 540) * 0.25, 360]], RED, 9));
  plate(c, 150, 790, 120, 55); chapati(c, 150, 770, 85, 50);
  plate(c, 400, 790, 130, 60); rice(c, 400, 780, 90, 80);
  bowl(c, 680, 770, 100, "#f2c640"); heap(c, 680, 765, 85, 28, "#f2c640", "#c9a020");
  glass(c, 930, 850, 130, 190, 0.8, MILK);
};
// a4: six small bowls of the six tastes
const lemonSlice = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), "#fff3a8", 3); for (let i = 0; i < 8; i++) line(c, [[x, y], [x + Math.cos((i * PI) / 4) * r * 0.8, y + Math.sin((i * PI) / 4) * r * 0.8]], 3, COL.yellow); };
const a4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 540, 480, 400);
  const pos = [[810, 540], [675, 340], [405, 340], [270, 540], [405, 750], [675, 750]];
  pos.forEach(([x, y]) => katoriTop(c, x, y, 105, "#f6f1e6"));
  for (const [dx, dy] of [[-40, -20], [20, -30], [10, 25]]) { shape(c, () => polyP(c, [[675 + dx - 24, 340 + dy - 20], [675 + dx + 24, 340 + dy - 24], [675 + dx + 28, 340 + dy + 20], [675 + dx - 20, 340 + dy + 24]]), "#8a4a1e", 4); }
  lemonSlice(c, 810, 540, 70);
  saltCube(c, 405, 330, 36); saltCube(c, 380, 360, 26); saltCube(c, 435, 365, 26);
  for (const k of [-1, 1]) { line(c, [[270 - 50, 540 + k * 20], [270 + 20, 540 + k * 8], [270 + 50, 540 + k * 28]], 22, INK); line(c, [[270 - 50, 540 + k * 20], [270 + 20, 540 + k * 8], [270 + 50, 540 + k * 28]], 12, COL.red); }
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 385 + i * 30, 740 + (i % 2) * 30, 38, 20, 0.5 + i * 0.4), "#2f6a2c", 5);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 640 + i * 36, 745 + (i % 2) * 25, 24, 24), "#dfe8a8", 5);
};
// a5: a vegetable cart, a child with a notebook, a grown-up
const a5 = (c: Ctx) => {
  ground(c);
  person(c, 880, 960, 600, { adult: true, armL: [PI * 0.55, PI * 0.5], armR: [PI * 0.45, PI * 0.5] });
  // cart
  shadow(c, 520, 930, 340, 36);
  for (const wx of [300, 740]) { shape(c, () => ell(c, wx, 880, 66, 66), "#6a4128", 6); shape(c, () => ell(c, wx, 880, 24, 24), COL.woodDk, 4); }
  shape(c, () => polyP(c, [[190, 560], [830, 560], [800, 800], [220, 800]]), COL.wood, 6); shade(c, () => polyP(c, [[190, 560], [830, 560], [800, 800], [220, 800]]), COL.woodDk, 20, 30);
  line(c, [[830, 600], [960, 540]], 14, INK); line(c, [[830, 600], [960, 540]], 7, COL.woodDk);
  const R = [[270, 520, 60, COL.red], [360, 480, 56, COL.orange], [460, 520, 60, COL.red], [560, 490, 58, COL.purple], [650, 525, 60, COL.red], [740, 500, 54, COL.orange], [400, 560, 54, COL.greenLt], [520, 565, 56, COL.green], [620, 570, 56, COL.greenLt]] as const;
  R.forEach(([x, y, r, col]) => { shape(c, () => ell(c, x, y, r, r * 0.88), col, 6); shine(c, [[x - r * 0.5, y - r * 0.1], [x - r * 0.3, y - r * 0.4]], r * 0.12); });
  person(c, 140, 960, 560, { armL: [PI * 0.45, PI * 0.45], armR: [PI * 0.3, -PI * 0.2] });
  shape(c, () => polyP(c, [[180, 580], [300, 560], [310, 680], [190, 700]]), WHITE, 5); line(c, [[200, 610], [280, 598]], 4, COL.blue); line(c, [[200, 640], [285, 628]], 4, COL.blue);
};
// a6: the round steel masala box, open
const a6 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 440, 80);
  shape(c, () => ell(c, 540, 600, 430, 300), COL.steel, 6); shape(c, () => ell(c, 540, 580, 380, 258), COL.steelIn, 5);
  shape(c, () => polyP(c, [[110, 600], [970, 600], [940, 700], [140, 700]]), COL.steel, 0);
  const sp: [number, number, string, string][] = [[540, 580, "#e4523b", "#b73a29"], [350, 470, COL.yellow, COL.woodDk], [730, 470, "#8a5a3c", "#6a4128"], [270, 640, "#c99a62", "#a77a46"], [810, 640, "#3a2a20", "#201510"], [450, 710, COL.orange, "#c27424"], [650, 710, "#6a8a3a", "#46752a"]];
  sp.forEach(([x, y, col, dk]) => { katoriTop(c, x, y, 85, col); shape(c, () => ell(c, x, y, 70, 66), col, 0); c.save(); c.beginPath(); ell(c, x, y, 70, 66); c.clip(); c.beginPath(); ell(c, x + 20, y + 22, 70, 66); c.fillStyle = dk; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1; });
  line(c, [[780, 330], [880, 230]], 16, INK); line(c, [[780, 330], [880, 230]], 8, COL.steel); shape(c, () => ell(c, 925, 190, 64, 36, -0.8), COL.steel, 6); shape(c, () => ell(c, 925, 190, 48, 24, -0.8), COL.yellow, 3);
};
// p1: windowsill farm, greens in the light and in the dark
const p1 = (c: Ctx) => {
  ground(c, "#e9efe2");
  shape(c, () => rrect(c, 90, 70, 900, 560, 24), COL.sky, 8); sun(c, 800, 210, 60);
  line(c, [[540, 70], [540, 630]], 12, INK); line(c, [[90, 350], [990, 350]], 12, INK);
  shape(c, () => rrect(c, 60, 620, 960, 70, 12), COL.wood, 6);
  // trays
  shape(c, () => polyP(c, [[130, 560], [480, 560], [470, 620], [140, 620]]), "#c9d1dc", 5);
  shape(c, () => polyP(c, [[130, 590], [480, 590], [470, 625], [140, 625]]), "#8a5a3c", 5);
  for (let i = 0; i < 9; i++) sprout(c, 160 + i * 38, 585, 120 + (i % 3) * 20, (i % 2 ? 8 : -8), COL.greenLt, COL.green, 12);
  shape(c, () => polyP(c, [[600, 560], [950, 560], [940, 620], [610, 620]]), "#c9d1dc", 5);
  for (let i = 0; i < 9; i++) sprout(c, 630 + i * 38, 585, 160 + (i % 3) * 20, (i % 2 ? 26 : -26), "#f3e7a8", "#f0dd70", 8);
  // the dark cover over the second tray, with a flap lifted to show inside
  shape(c, () => polyP(c, [[580, 380], [970, 380], [970, 630], [580, 630]]), "#4a3a30", 6); shade(c, () => polyP(c, [[580, 380], [970, 380], [970, 630], [580, 630]]), "#2e231c", 30, 30, 0.6);
  shape(c, () => rrect(c, 650, 480, 250, 130, 20), "#2e231c", 4);
  for (let i = 0; i < 5; i++) sprout(c, 680 + i * 50, 600, 90 + (i % 2) * 14, (i % 2 ? 18 : -18), "#f3e7a8", "#f0dd70", 8);
};
// c1: a seed safe: a sealed jar of moong; water and an insect kept out
const beetle = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 0, 1]) for (const sd of [-1, 1]) line(c, [[x + k * s * 0.3, y], [x + k * s * 0.45 + sd * s * 0.1, y + sd * s * 0.7]], 6, INK);
  line(c, [[x + s * 0.6, y - s * 0.15], [x + s * 0.9, y - s * 0.55]], 5, INK); line(c, [[x + s * 0.6, y + s * 0.05], [x + s * 0.95, y - s * 0.3]], 5, INK);
  shape(c, () => ell(c, x, y, s * 0.7, s * 0.45), "#6a4128", 6); shape(c, () => ell(c, x + s * 0.7, y - s * 0.05, s * 0.3, s * 0.28), "#4a2d18", 5);
  line(c, [[x, y - s * 0.44], [x, y + s * 0.44]], 4, INK); shine(c, [[x - s * 0.4, y - s * 0.2], [x - s * 0.2, y - s * 0.3]], 6);
};
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 260, 34);
  shape(c, () => rrect(c, 340, 260, 400, 60, 14), COL.steel, 6);
  shape(c, () => rrect(c, 310, 320, 460, 570, 70), COL.glass, 6);
  c.save(); c.beginPath(); rrect(c, 310, 320, 460, 570, 70); c.clip();
  for (let i = 0; i < 90; i++) { const x = 345 + (i % 9) * 48 + ((i * 7) % 5), y = 480 + Math.floor(i / 9) * 44 + ((i * 3) % 6); seed(c, x, y, 20, i * 0.8, false); }
  c.restore(); shape(c, () => rrect(c, 310, 320, 460, 570, 70), "rgba(214,236,250,0.25)", 6); shine(c, [[350, 400], [350, 700]], 9);
  dropP(c, 130, 560, 44); dropP(c, 140, 330, 30);
  beetle(c, 900, 600, 85);
  for (const [x, y] of [[130, 500], [900, 600]]) { arrow(c, [[x - 25, y - 55], [x + 25, y + 55]], RED, 12); arrow(c, [[x + 25, y - 55], [x - 25, y + 55]], RED, 12); }
};

// ------------------------------------------------------------------ terms
const t0 = (c: Ctx) => {
  ground(c);
  person(c, 540, 900, 620);
  shape(c, () => polyP(c, [[110, 770], [970, 770], [1040, 940], [40, 940]]), COL.wood, 6); shade(c, () => polyP(c, [[110, 770], [970, 770], [1040, 940], [40, 940]]), COL.woodDk, 0, 40);
  plate(c, 540, 850, 280, 80); rice(c, 480, 850, 120, 90); bowl(c, 680, 835, 80, "#f2c640"); heap(c, 680, 832, 66, 24, "#f2c640", "#c9a020");
  // battery (energy) and bricks (building)
  shape(c, () => rrect(c, 80, 400, 200, 110, 18), COL.steel, 6); shape(c, () => rrect(c, 280, 430, 24, 50, 6), COL.steelDk, 5);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 100 + i * 58, 418, 46, 74, 8), COL.greenLt, 4);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) shape(c, () => rrect(c, 800 + k * 120 + (r % 2) * 55 - 40, 400 + r * 56, 110, 50, 6), COL.orange, 5);
  arrow(c, [[330, 760], [260, 560]], RED, 10); arrow(c, [[750, 760], [850, 640]], RED, 10);
};
const t3 = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 880, 300, 30);
  cane(c, 110, 900, 700, -0.75);
  for (const a of [-1.9, -1.3, -2.6, -0.5]) leaf(c, 622, 423, 200, a, COL.leaf);
  potato(c, 760, 720, 190, 130, -0.2);
  shape(c, () => ell(c, 760, 860, 180, 20), SH_, 0);
};
const SH_ = "rgba(43,35,64,0.16)";
const t6 = (c: Ctx) => {
  ground(c);
  // cut tomato
  shadow(c, 300, 800, 220, 30);
  shape(c, () => ell(c, 290, 520, 230, 215), COL.red, 7); shape(c, () => ell(c, 290, 520, 190, 178), "#f6a08a", 4);
  for (let i = 0; i < 4; i++) { const a = (i * PI) / 2 + PI / 4; const cx = 290 + Math.cos(a) * 82, cy = 520 + Math.sin(a) * 78; shape(c, () => ell(c, cx, cy, 60, 52, a), "#f9d58a", 4); for (let k = 0; k < 4; k++) shape(c, () => ell(c, cx + (k - 1.5) * 20, cy + (k % 2) * 14 - 8, 8, 5, k), "#fff8dc", 3); }
  shape(c, () => ell(c, 290, 520, 22, 22), "#f6a08a", 3);
  // bhindi pod and its cut slice
  shadow(c, 770, 800, 220, 26);
  shape(c, () => { c.moveTo(560, 830); c.quadraticCurveTo(700, 770, 920, 520); c.quadraticCurveTo(940, 500, 930, 540); c.quadraticCurveTo(780, 810, 580, 860); c.closePath(); }, COL.leaf, 6);
  line(c, [[600, 835], [900, 560]], 4, COL.leafDk); shape(c, () => ell(c, 560, 845, 24, 24), COL.leafDk, 5);
  shape(c, () => ell(c, 770, 360, 150, 150), COL.leaf, 7); shape(c, () => ell(c, 770, 360, 122, 122), "#d8eaa4", 4);
  for (let i = 0; i < 5; i++) { const a = (i * 2 * PI) / 5 - PI / 2; const cx = 770 + Math.cos(a) * 62, cy = 360 + Math.sin(a) * 62; shape(c, () => ell(c, cx, cy, 36, 30, a), "#b7d878", 3); shape(c, () => ell(c, cx, cy, 11, 11), "#f4f1e4", 3); }
};
const t7 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 840, 400, 30);
  shape(c, () => ell(c, 300, 560, 220, 280, 0.12), "#e6c98a", 7); shade(c, () => ell(c, 300, 560, 220, 280, 0.12), "#c9a45a", 20, 40);
  shape(c, () => ell(c, 780, 560, 220, 280, -0.12), "#e6c98a", 7); shade(c, () => ell(c, 780, 560, 220, 280, -0.12), "#c9a45a", 20, 40);
  // the tiny baby plant between the halves
  line(c, [[540, 760], [535, 640], [545, 560]], 30, INK); line(c, [[540, 760], [535, 640], [545, 560]], 16, WHITE);
  shape(c, () => ell(c, 500, 520, 52, 24, -0.6), COL.greenLt, 6); shape(c, () => ell(c, 585, 520, 52, 24, 0.6), COL.greenLt, 6);
  line(c, [[540, 770], [525, 830], [560, 870]], 14, INK); line(c, [[540, 770], [525, 830], [560, 870]], 7, WHITE);
};
const t11 = (c: Ctx) => {
  ground(c);
  bowl(c, 220, 840, 140, MILK); heap(c, 220, 836, 118, 44, MILK, MILKDK); bowl(c, 220, 840, 140, MILK); heap(c, 220, 834, 110, 44, MILK, MILKDK);
  lens(c, 600, 460, 330, "#f3ecd4", () => {
    const R: [number, number, number, number, string][] = [[470, 330, 120, 42, COL.teal], [680, 290, 110, 40, COL.purple], [560, 460, 130, 44, COL.blue], [750, 450, 120, 42, COL.teal], [470, 590, 110, 40, COL.pink], [680, 610, 126, 42, COL.orange], [600, 380, 90, 34, COL.green], [400, 450, 90, 34, COL.blue]];
    R.forEach(([x, y, L, W, col], i) => rod(c, x, y, L, W, (i * 1.1) % 3, col));
  });
  arrow(c, [[330, 770], [400, 690]], RED, 10);
};
const t12 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 440, 440), MILK, 7); c.save(); c.beginPath(); ell(c, 540, 540, 440, 440); c.clip();
  for (const [x, y, a] of [[230, 300, 0.5], [850, 320, -0.7], [250, 790, -0.4], [860, 780, 0.6], [540, 170, 0.1]]) rod(c, x, y, 120, 42, a, COL.teal);
  c.restore(); shape(c, () => ell(c, 540, 540, 440, 440), "rgba(0,0,0,0)", 7);
  // one big bacterium: a single cell with its tail
  const wave = [[240, 560], [200, 520], [160, 580], [120, 530]]; line(c, wave, 16, INK); line(c, wave, 8, COL.tealDk);
  shape(c, () => rrect(c, 250, 420, 480, 240, 120), COL.teal, 8); shade(c, () => rrect(c, 250, 420, 480, 240, 120), COL.tealDk, 24, 36);
  line(c, [[340, 540], [400, 500], [460, 580], [520, 500], [580, 580], [640, 520]], 12, "#e8fff8");
  shine(c, [[300, 470], [450, 450]], 12);
};
const t13 = (c: Ctx) => {
  ground(c);
  const jar = (x: number, level: number, bubbles: boolean) => {
    shadow(c, x + 10, 880, 190, 28);
    shape(c, () => rrect(c, x - 160, 380, 320, 480, 40), COL.steel, 6);
    c.save(); c.beginPath(); rrect(c, x - 160, 380, 320, 480, 40); c.clip(); c.fillStyle = "#faf3dc"; c.fillRect(x - 160, 860 - level, 320, level); c.restore();
    if (bubbles) { heap(c, x, 380, 170, 90, "#faf3dc", MILKDK); for (let i = 0; i < 14; i++) shape(c, () => ell(c, x - 110 + ((i * 53) % 220), 400 + ((i * 37) % 180) , 12 + (i % 3) * 5, 12 + (i % 3) * 5), "#fffdf4", 4); }
    else for (let i = 0; i < 3; i++) shape(c, () => ell(c, x - 60 + i * 60, 860 - level, 8, 8), "#fffdf4", 3);
    shape(c, () => rrect(c, x - 160, 380, 320, 480, 40), "rgba(0,0,0,0)", 6);
    line(c, [[x - 160, 560], [x - 120, 560]], 5, INK);
  };
  jar(240, 160, false); jar(820, 330, true);
  // moon: it rests overnight
  shape(c, () => { c.arc(540, 230, 90, -PI * 0.5, PI * 0.5, false); c.arc(590, 230, 90, PI * 0.5, -PI * 0.5, true); c.closePath(); }, COL.yellow, 6);
  arrow(c, [[400, 640], [660, 640]], RED, 14);
};
const t15 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 900, 1080, 180, 0), COL.soil, 0); line(c, [[0, 900], [1080, 900]], 6);
  // stem and big leaf
  line(c, [[300, 900], [320, 700], [420, 620]], 32, INK); line(c, [[300, 900], [320, 700], [420, 620]], 18, COL.greenLt);
  const L = () => { c.moveTo(380, 640); c.bezierCurveTo(480, 380, 800, 330, 980, 420); c.bezierCurveTo(900, 640, 640, 760, 380, 640); c.closePath(); };
  shape(c, L, COL.leaf, 7); shade(c, L, COL.leafDk, 0, 50); line(c, [[400, 640], [650, 560], [940, 430]], 10, COL.leafDk);
  for (const [a, b] of [[540, 580, ], [700, 540]] as number[][]) { line(c, [[a, b], [a + 90, b - 100]], 6, COL.leafDk); line(c, [[a, b], [a + 40, b + 70]], 6, COL.leafDk); }
  sun(c, 130, 150, 80); arrow(c, [[230, 260], [440, 440]], RED, 12);
  // air: a cloud with an arrow in
  const cloud = (x: number, y: number) => shape(c, () => { c.moveTo(x - 100, y + 30); c.arc(x - 60, y, 50, PI * 0.8, PI * 1.6); c.arc(x + 10, y - 30, 56, PI * 1.2, PI * 1.85); c.arc(x + 80, y + 4, 44, PI * 1.5, PI * 0.5); c.lineTo(x - 100, y + 48); c.closePath(); }, WHITE, 6);
  cloud(850, 170); arrow(c, [[820, 250], [780, 360]], RED, 12);
  dropP(c, 210, 760, 24); dropP(c, 205, 840, 20); arrow(c, [[220, 720], [270, 640]], COL.blueDk, 10);
  // sugar going out
  for (let i = 0; i < 3; i++) saltCube(c, 760 + i * 70, 810 - (i % 2) * 40, 26);
  arrow(c, [[780, 700], [790, 760]], RED, 12);
};
const t16 = (c: Ctx) => {
  ground(c); c.save(); c.translate(30, -250);
  grass(c, 100, 930, 300);
  cowSide(c, 450, 900, 0.8);
  person(c, 880, 960, 460, { armL: [PI * 0.45, PI * 0.5], armR: [PI * 0.45, PI * 0.5] });
  glass(c, 740, 960, 90, 140, 0.8, MILK);
  arrow(c, [[190, 740], [290, 740]], RED, 12);
  arrow(c, [[640, 740], [740, 740]], RED, 12);
  c.restore();
};
const t17 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 400, 36);
  shape(c, () => ell(c, 540, 700, 400, 230), "#a77a46", 7); shape(c, () => ell(c, 540, 700, 370, 205), "#f5ecc8", 4);
  shape(c, () => ell(c, 480, 700, 230, 120, 0.1), BLUEBLK, 0);
  for (const [x, y] of [[300, 690], [700, 780], [400, 790]]) shape(c, () => ell(c, x, y, 10, 10), "#e6dcb0", 0);
  dropperBottle(c, 780, 260, 1.15, 0.5);
  dropP(c, 540, 480, 24, IODINE); arrow(c, [[540, 530], [520, 590]], RED, 10);
};
const mango = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, s, s * 0.78, -0.5), "#f6b73c", 6); shade(c, () => ell(c, x, y, s, s * 0.78, -0.5), "#e48a2a", s * 0.2, s * 0.2);
  shape(c, () => ell(c, x - s * 0.35, y - s * 0.1, s * 0.35, s * 0.26, -0.5), "#e4523b", 0); c.globalAlpha = 0.6; shape(c, () => ell(c, x - s * 0.35, y - s * 0.1, s * 0.35, s * 0.26, -0.5), "#e4523b", 0); c.globalAlpha = 1;
  leaf(c, x + s * 0.55, y - s * 0.55, s * 0.5, -0.7, COL.leaf);
};
const pea = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s, -s * 0.2, s * 2, s * 0.4, s * 0.2), COL.leaf, 6);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, -s * 0.6 + i * s * 0.4, 0, s * 0.13, s * 0.13), COL.greenLt, 3); c.restore();
};
const t19 = (c: Ctx) => {
  c.fillStyle = "#fbe4a6"; c.fillRect(0, 0, 540, 1080); c.fillStyle = "#cfe3f1"; c.fillRect(540, 0, 540, 1080);
  sun(c, 270, 170, 80);
  // cloud and a pale sun for the cool season
  c.globalAlpha = 0.55; sun(c, 800, 170, 50); c.globalAlpha = 1;
  shape(c, () => { const x = 800, y = 190; c.moveTo(x - 110, y + 40); c.arc(x - 70, y + 10, 50, PI * 0.8, PI * 1.6); c.arc(x, y - 20, 60, PI * 1.2, PI * 1.85); c.arc(x + 80, y + 14, 46, PI * 1.5, PI * 0.5); c.lineTo(x - 110, y + 60); c.closePath(); }, WHITE, 6);
  shape(c, () => rrect(c, 60, 640, 420, 80, 12), COL.wood, 6); shape(c, () => rrect(c, 600, 640, 420, 80, 12), COL.wood, 6);
  mango(c, 170, 590, 70); mango(c, 290, 570, 74); mango(c, 400, 590, 68); mango(c, 230, 480, 72); mango(c, 350, 460, 70);
  carrot(c, 640, 560, 200, -0.2); carrot(c, 700, 600, 190, -0.5); carrot(c, 760, 570, 200, -0.1); pea(c, 880, 560, 90, 0.2); pea(c, 900, 610, 80, -0.3); pea(c, 840, 500, 80, 0.5);
  line(c, [[540, 0], [540, 1080]], 10, INK);
};
const t23 = (c: Ctx) => {
  ground(c, "#cfe3f1");
  shape(c, () => polyP(c, [[40, 1000], [420, 150], [540, 280], [620, 120], [1040, 1000]]), "#eef3f7", 7);
  shade(c, () => polyP(c, [[40, 1000], [420, 150], [540, 280], [620, 120], [1040, 1000]]), "#b7c8d6", 60, 20);
  // the doorway into the mountain, cut open to show the shelves
  shape(c, () => { c.moveTo(220, 1000); c.lineTo(220, 640); c.arc(540, 640, 320, PI, 0); c.lineTo(860, 1000); c.closePath(); }, "#4a3a30", 7);
  for (let r = 0; r < 4; r++) { line(c, [[250, 700 + r * 75], [830, 700 + r * 75]], 8, INK); for (let k = 0; k < 8; k++) { const col = [COL.red, COL.yellow, COL.green, COL.blue, COL.orange, COL.pink][(r + k) % 6]; shape(c, () => rrect(c, 262 + k * 70, 650 + r * 75 + 20, 54, 54, 6), col, 4); } }
  shape(c, () => ell(c, 540, 1010, 340, 22), SH_, 0);
};
const t24 = (c: Ctx) => {
  ground(c, "#14304f");
  c.fillStyle = "#1c3d60"; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  // black smoke
  for (const [x, y, r] of [[500, 200, 80], [560, 90, 70], [450, 100, 60], [600, 250, 60]]) shape(c, () => ell(c, x, y, r, r * 0.8), "#3a3a4a", 0);
  // chimney
  shape(c, () => polyP(c, [[400, 900], [440, 360], [470, 310], [520, 330], [560, 300], [610, 350], [650, 900]]), "#4a4a56", 7); shade(c, () => polyP(c, [[400, 900], [440, 360], [470, 310], [520, 330], [560, 300], [610, 350], [650, 900]]), "#2a2a36", 50, 0);
  // tube worms
  const worm = (x: number, y: number, h: number) => { shape(c, () => rrect(c, x - 18, y - h, 36, h, 14), "#f6f0e0", 5); for (let i = 0; i < 5; i++) { const a = -PI / 2 + (i - 2) * 0.3; shape(c, () => ell(c, x + Math.cos(a) * 18, y - h + Math.sin(a) * 18 - 10, 12, 34, a + PI / 2), "#e03a3a", 4); } };
  worm(220, 900, 260); worm(300, 900, 200); worm(800, 900, 280); worm(880, 900, 190); worm(730, 900, 160);
  // a white crab
  shape(c, () => ell(c, 130, 900, 60, 36), "#f6f0e0", 5); for (const k of [-1, 1]) { line(c, [[130 + k * 50, 890], [130 + k * 85, 920]], 6, "#f6f0e0"); shape(c, () => ell(c, 130 + k * 70, 870, 16, 12), "#f6f0e0", 4); }
  // heat: red arrows rising
  for (const x of [470, 560, 620]) arrow(c, [[x, 880], [x, 780]], RED, 0);
};
const t25 = (c: Ctx) => {
  ground(c);
  // a grain of dal, small
  shape(c, () => ell(c, 170, 240, 80, 60, -0.3), COL.orange, 6); shade(c, () => ell(c, 170, 240, 80, 60, -0.3), "#c27424", 14, 14);
  arrow(c, [[260, 320], [370, 440]], RED, 12);
  lens(c, 560, 600, 300, "#fff8e4", () => {
    c.translate(560, 600); c.scale(0.8, 0.8); c.translate(-640, -640);
    const B: [number, number, number, string][] = [[640, 640, 90, COL.red], [520, 520, 70, COL.blue], [770, 540, 70, COL.blue], [530, 770, 70, COL.blue], [790, 760, 66, COL.teal], [650, 480, 54, COL.purple], [650, 810, 56, COL.orange]];
    for (const [x, y] of B.slice(1)) line(c, [[640, 640], [x, y]], 12, INK);
    B.forEach(([x, y, r, col]) => { shape(c, () => ell(c, x, y, r, r), col, 6); shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.25, y - r * 0.55]], r * 0.14); });
  });
};
const banana = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - s, y - s * 0.2); c.quadraticCurveTo(x - s * 0.3, y + s * 0.8, x + s, y - s * 0.3); c.quadraticCurveTo(x + s * 0.2, y + s * 0.35, x - s, y - s * 0.2); c.closePath(); };
  shape(c, p, COL.yellow, 6); shade(c, p, COL.orange, 0, s * 0.12); shape(c, () => ell(c, x - s, y - s * 0.22, s * 0.07, s * 0.07), "#6a4128", 4); shape(c, () => ell(c, x + s, y - s * 0.32, s * 0.07, s * 0.07), "#6a4128", 4);
};
const t26 = (c: Ctx) => {
  ground(c);
  sun(c, 150, 170, 90);
  banana(c, 440, 520, 150);
  person(c, 820, 940, 560, { armL: [PI * 0.9, PI * 0.5], armR: [PI * 0.1, -PI * 0.4] });
  arrow(c, [[250, 290], [360, 440]], RED, 12); arrow(c, [[540, 560], [660, 620]], RED, 12);
  for (const k of [0, 1, 2]) line(c, [[560 + k * 12, 800 + k * 40], [640 + k * 12, 800 + k * 40]], 9, COL.grey);
};

export const ic_foodWhereFoodComesFromL3 = cards("sci.food.where-food-comes-from.L3 cards", [e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, t0, t3, t6, t7, t11, t12, t13, t15, t16, t17, t19, t23, t24, t25, t26]);
