import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, leaf, person, write, cards } from "./flatKit";

// FOOD: nutrients (L3) · picture cards for the experiments, activities, project, challenge, terms and explanations.

const MILK = "#fff4d6", WHEY = "#dfeaa6", TAN = "#e9c98c", TANDK = "#c99a58", CREAM = "#f6efdc", ORANGE = COL.orange;
const dot = (c: Ctx, x: number, y: number, r: number, col: string, w = 5) => shape(c, () => ell(c, x, y, r, r), col, w);
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - r * 1.9); c.quadraticCurveTo(x + r * 0.95, y - r * 0.6, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.95, y - r * 0.6, x, y - r * 1.9); c.closePath(); }, col, Math.max(3, r * 0.16));
  line(c, [[x - r * 0.5, y - r * 0.05], [x - r * 0.42, y + r * 0.45]], Math.max(3, r * 0.18), WHITE);
};
const flame = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.2, y - s * 0.5, x + s * 0.7, y - s * 0.3, x + s * 0.6, y + s * 0.3); c.bezierCurveTo(x + s * 0.5, y + s * 0.85, x - s * 0.5, y + s * 0.85, x - s * 0.6, y + s * 0.3); c.bezierCurveTo(x - s * 0.7, y - s * 0.1, x - s * 0.2, y - s * 0.4, x, y - s); c.closePath(); }, ORANGE, 6);
  shape(c, () => { c.moveTo(x, y - s * 0.2); c.bezierCurveTo(x + s * 0.3, y + s * 0.1, x + s * 0.35, y + s * 0.6, x, y + s * 0.65); c.bezierCurveTo(x - s * 0.35, y + s * 0.6, x - s * 0.3, y + s * 0.1, x, y - s * 0.2); c.closePath(); }, COL.yellow, 0);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 9, COL.orange); }
  dot(c, x, y, r, COL.yellow, 6);
};
const lemon = (c: Ctx, x: number, y: number, r: number) => {
  dot(c, x, y, r, COL.yellow, 6); dot(c, x, y, r * 0.84, "#fff3a8", 3);
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; line(c, [[x, y], [x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82]], 3, "#e8c85a"); }
};
const stTumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, w * 0.18, 0, 0.5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.steelIn, 5);
  shine(c, [[x - w * 0.33, y - h * 0.85], [x - w * 0.27, y - h * 0.2]], 8);
};
const idli = (c: Ctx, x: number, y: number, r: number) => {
  const b = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 0.95, x + r, y - r * 0.95, x + r, y); c.quadraticCurveTo(x, y + r * 0.3, x - r, y); c.closePath(); };
  shape(c, b, "#fffaf0", 6); shade(c, b, "#e4dccb", r * 0.25, r * 0.1, 0.7);
};
const riceHeap = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const b = () => { c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 0.5, y - h * 1.5, x, y - h); c.quadraticCurveTo(x + w * 0.5, y - h * 1.5, x + w, y); c.closePath(); };
  shadow(c, x + 10, y + 8, w, h * 0.12); shape(c, b, "#fffaf0", 6);
  const r = rnd(3); for (let i = 0; i < 22; i++) { const t = r(), u = r(); const gx = x - w * 0.8 + t * w * 1.6, gy = y - u * h * (1 - Math.abs(t - 0.5) * 1.5) * 0.9 - 8; line(c, [[gx, gy], [gx + 9, gy - 4]], 5, "#e2d6bb"); }
};
const dalHeap = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 10, y + 8, w, h * 0.12);
  shape(c, () => { c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 0.5, y - h * 1.5, x, y - h); c.quadraticCurveTo(x + w * 0.5, y - h * 1.5, x + w, y); c.closePath(); }, "#f2c04a", 6);
  const r = rnd(8); for (let i = 0; i < 18; i++) { const t = r(), u = r(); dot(c, x - w * 0.75 + t * w * 1.5, y - 14 - u * h * (1 - Math.abs(t - 0.5) * 1.6) * 0.85, 11, "#e2a82e", 3); }
};
const peanut = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { ell(c, x - s * 0.42, y, s * 0.55, s * 0.42); c.moveTo(x + s * 0.97, y); ell(c, x + s * 0.42, y, s * 0.55, s * 0.42); };
  c.beginPath(); p(); c.lineWidth = 12; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke(); c.fillStyle = TAN; c.fill();
};
const banana = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y - s * 0.3); c.quadraticCurveTo(x - s * 0.2, y + s * 0.9, x + s, y - s * 0.6); c.quadraticCurveTo(x + s * 0.2, y + s * 0.35, x - s, y - s * 0.3); c.closePath(); }, COL.yellow, 6);
  line(c, [[x + s, y - s * 0.6], [x + s * 1.12, y - s * 0.78]], 9, "#6a4128");
};
const keerai = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y + s * 0.5], [x, y]], 9, COL.leafDk);
  for (const [a, k] of [[-2.2, 1], [-1.9, 1.1], [-1.57, 1.2], [-1.25, 1.1], [-0.95, 1]]) leaf(c, x, y, s * k, a as number, COL.leaf);
  shape(c, () => rrect(c, x - s * 0.18, y + s * 0.1, s * 0.36, s * 0.2, 6), COL.red, 5);
};
const guavaCut = (c: Ctx, x: number, y: number, r: number) => {
  dot(c, x, y, r, COL.greenLt, 6); dot(c, x, y, r * 0.86, "#f6a7b4", 3); dot(c, x, y, r * 0.38, "#fdd6dc", 0);
  const g = rnd(5); for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; dot(c, x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.06, "#f1e3a0", 0); } void g;
};
const carrot = (c: Ctx, x: number, y: number, s: number) => {
  leaf(c, x, y, s * 0.5, -2.2, COL.leaf); leaf(c, x, y, s * 0.55, -1.57, COL.leaf); leaf(c, x, y, s * 0.5, -0.95, COL.leaf);
  shape(c, () => { c.moveTo(x - s * 0.22, y); c.quadraticCurveTo(x, y - s * 0.06, x + s * 0.22, y); c.lineTo(x + s * 0.03, y + s * 1.1); c.closePath(); }, COL.orange, 6);
  for (const k of [0.3, 0.55, 0.8]) line(c, [[x - s * 0.08, y + s * k], [x + s * 0.08, y + s * k]], 4, "#d27c25");
};
const eye = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => { c.moveTo(x - w, y); c.quadraticCurveTo(x, y - w * 0.8, x + w, y); c.quadraticCurveTo(x, y + w * 0.8, x - w, y); c.closePath(); }, WHITE, 6);
  dot(c, x, y, w * 0.38, "#6a4128", 5); dot(c, x, y, w * 0.18, INK, 0); dot(c, x - w * 0.1, y - w * 0.1, w * 0.07, WHITE, 0);
};
const bone = (c: Ctx, x: number, y: number, len: number, th: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const p = () => { c.moveTo(-len / 2, -th / 2); c.lineTo(len / 2, -th / 2); ell(c, len / 2, -th * 0.65, th * 0.6, th * 0.6); ell(c, len / 2, th * 0.65, th * 0.6, th * 0.6); c.moveTo(-len / 2, th / 2); ell(c, -len / 2, -th * 0.65, th * 0.6, th * 0.6); ell(c, -len / 2, th * 0.65, th * 0.6, th * 0.6); c.rect(-len / 2, -th / 2, len, th); };
  shape(c, p, "#fbf6ea", 6); c.restore();
};
const plaster = (c: Ctx, x: number, y: number, w: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -w / 2, -w * 0.2, w, w * 0.4, w * 0.2), "#f1c9a0", 6);
  shape(c, () => rrect(c, -w * 0.18, -w * 0.2, w * 0.36, w * 0.4, 4), "#fbe9d4", 4); c.restore();
};
const jar = (c: Ctx, x: number, y: number, w: number, h: number, col: string, col2: string) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 18), COL.glass, 6);
  shape(c, () => rrect(c, x - w / 2 + 6, y - h * 0.6, w - 12, h * 0.6 - 6, 12), col, 0);
  shade(c, () => rrect(c, x - w / 2 + 6, y - h * 0.6, w - 12, h * 0.6 - 6, 12), col2, w * 0.18, 0, 0.6);
  shape(c, () => rrect(c, x - w / 2 - 4, y - h - 22, w + 8, 28, 8), COL.teal, 6);
  shine(c, [[x - w * 0.32, y - h * 0.9], [x - w * 0.32, y - h * 0.25]], 8);
};
const basket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 10, y + 6, w * 0.62, 20);
  const b = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, b, COL.wood); shade(c, b, COL.woodDk, w * 0.15, 0, 0.5);
  for (const k of [0.33, 0.66]) line(c, [[x - w * 0.5 + w * 0.1 * k, y - h * (1 - k)], [x + w * 0.5 - w * 0.1 * k, y - h * (1 - k)]], 4, COL.woodDk);
  shape(c, () => ell(c, x, y - h, w / 2, 16), COL.woodDk, 6);
};
const bead = (c: Ctx, x: number, y: number, r: number, col: string) => { dot(c, x, y, r, col, 5); line(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.25, y - r * 0.55]], 5, WHITE); };
const pill = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 16), col, 6);
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -9, len, 18, 9), COL.steel, 5);
  shape(c, () => ell(c, -4, 0, 44, 30), COL.steel, 6); shape(c, () => ell(c, -4, 0, 32, 20), COL.steelIn, 3); c.restore();
};
const pan = (c: Ctx, x: number, y: number, r: number, inside: string) => {
  shadow(c, x + r * 0.1, y + r * 0.55, r * 1.05, r * 0.2);
  shape(c, () => { c.moveTo(x - r, y); c.lineTo(x - r * 0.88, y + r * 0.6); c.quadraticCurveTo(x, y + r * 0.8, x + r * 0.88, y + r * 0.6); c.lineTo(x + r, y); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x - r, y); c.lineTo(x - r * 0.88, y + r * 0.6); c.quadraticCurveTo(x, y + r * 0.8, x + r * 0.88, y + r * 0.6); c.lineTo(x + r, y); c.closePath(); }, COL.steelDk, r * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y, r, r * 0.3), inside, 6);
};
const bundle = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x, y - r * 1.5], [x, y - r * 0.95]], 8);
  const b = () => { c.moveTo(x - r * 0.12, y - r * 0.95); c.quadraticCurveTo(x - r * 0.4, y - r * 0.5, x - r, y + r * 0.1); c.bezierCurveTo(x - r * 1.1, y + r * 0.95, x + r * 1.1, y + r * 0.95, x + r, y + r * 0.1); c.quadraticCurveTo(x + r * 0.4, y - r * 0.5, x + r * 0.12, y - r * 0.95); c.closePath(); };
  shape(c, b, CREAM, 6); shade(c, b, "#e4dccb", r * 0.2, r * 0.05, 0.8);
  line(c, [[x - r * 0.3, y - r * 0.3], [x - r * 0.45, y + r * 0.3]], 4, "#c9bfa5"); line(c, [[x + r * 0.2, y - r * 0.3], [x + r * 0.45, y + r * 0.35]], 4, "#c9bfa5");
  shape(c, () => rrect(c, x - r * 0.22, y - r * 0.8, r * 0.44, r * 0.12, 5), RED, 4);
};
const lump = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.8, 0.4), WHITE, 5);
const bubbleThought = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  dot(c, x - rx * 0.9, y + ry * 1.4, 12, WHITE, 4); dot(c, x - rx * 0.6, y + ry * 1.05, 18, WHITE, 4);
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 6);
};

// ------------------------------------------------------------------ experiments, activities, project, challenges
const e1 = (c: Ctx) => {
  ground(c);
  lemon(c, 110, 190, 80); drop(c, 250, 300, 16, "#ffe35e"); arrow(c, [[200, 230], [240, 270]]);
  glass(c, 250, 820, 250, 330, 0.8, MILK);
  for (const dx of [-50, 0, 50]) line(c, [[250 + dx, 440], [262 + dx, 410], [238 + dx, 380], [250 + dx, 350]], 7, "#b9b4ab");
  arrow(c, [[420, 640], [610, 640]]);
  // cloth bundle with curds, dripping whey into a glass
  bundle(c, 820, 440, 150);
  drop(c, 820, 535, 13, WHEY); drop(c, 812, 610, 13, WHEY);
  glass(c, 820, 860, 250, 250, 0.4, WHEY);
};
const e2 = (c: Ctx) => {
  ground(c);
  sun(c, 540, 170, 70);
  // fresh cucumber slice, big
  shadow(c, 290, 700, 200, 40);
  dot(c, 270, 560, 200, "#46752a", 7); dot(c, 270, 560, 170, "#c8e08a", 3); dot(c, 270, 560, 62, "#e9f3b8", 0);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.4; shape(c, () => ell(c, 270 + Math.cos(a) * 105, 560 + Math.sin(a) * 105, 16, 9, a), "#f3f8d0", 3); }
  arrow(c, [[500, 560], [640, 560]]);
  // dried slice, small and wrinkled
  shadow(c, 800, 690, 100, 24);
  shape(c, () => { c.moveTo(740, 540); c.quadraticCurveTo(770, 480, 810, 500); c.quadraticCurveTo(870, 490, 880, 550); c.quadraticCurveTo(900, 610, 850, 625); c.quadraticCurveTo(800, 660, 750, 620); c.quadraticCurveTo(715, 590, 740, 540); c.closePath(); }, "#8a9a52", 6);
  for (const [a, b, c2, d] of [[760, 560, 800, 540], [790, 600, 840, 580], [770, 590, 790, 570]]) line(c, [[a, b], [c2, d]], 4, "#5d6b34");
  // water leaving upwards
  for (const [x, y] of [[420, 330], [600, 380], [680, 300]]) drop(c, x, y, 14);
  arrow(c, [[430, 420], [430, 350]]);
};
const e3 = (c: Ctx) => {
  ground(c);
  sun(c, 880, 160, 60);
  shadow(c, 560, 840, 460, 70);
  shape(c, () => ell(c, 540, 620, 470, 230), COL.steel); shape(c, () => ell(c, 540, 612, 400, 185), COL.steelIn, 5);
  // a wet puddle
  shape(c, () => ell(c, 330, 610, 110, 60), COL.water, 5); shape(c, () => ell(c, 300, 590, 36, 12), COL.drop, 0);
  arrow(c, [[470, 610], [610, 610]]);
  // dry white ring of minerals
  shape(c, () => ell(c, 760, 610, 120, 66), WHITE, 5); shape(c, () => ell(c, 760, 610, 76, 38), COL.steelIn, 4);
  for (const [x, y] of [[690, 590], [740, 560], [800, 570], [830, 615], [790, 655], [720, 650]]) dot(c, x, y, 7, "#e9e6dc", 0);
  drop(c, 330, 330, 22); arrow(c, [[330, 400], [330, 470]]); spoon(c, 250, 250, -0.5, 190);
};
const a1 = (c: Ctx) => {
  ground(c);
  // cucumber: all 10 caps are water
  shadow(c, 220, 400, 140, 24);
  shape(c, () => rrect(c, 90, 270, 260, 120, 60), "#46752a", 7); shape(c, () => rrect(c, 108, 286, 224, 88, 44), "#c8e08a", 3);
  const caps = (x0: number, y0: number, n: number, col: string, other: string) => { for (let i = 0; i < 10; i++) dot(c, x0 + (i % 5) * 76, y0 + Math.floor(i / 5) * 76, 31, i < n ? col : other, 5); };
  arrow(c, [[380, 330], [470, 330]]); caps(530, 290, 10, COL.water, COL.water);
  // milk: 9 water, 1 not
  glass(c, 220, 880, 180, 250, 0.85, MILK);
  arrow(c, [[380, 780], [470, 780]]); caps(530, 740, 9, COL.water, "#fffaf0");
};
const a2 = (c: Ctx) => {
  ground(c);
  // a child's face in profile breathing onto a cold steel tumbler
  const hx = 250, hy = 520;
  shape(c, () => ell(c, hx, hy, 150, 165), SKIN.child);
  shape(c, () => { c.moveTo(hx - 152, hy + 10); c.bezierCurveTo(hx - 160, hy - 230, hx + 150, hy - 230, hx + 125, hy - 70); c.quadraticCurveTo(hx, hy - 110, hx - 152, hy + 10); c.closePath(); }, "#2b2340", 6);
  shape(c, () => ell(c, hx + 150, hy + 10, 22, 30), SKIN.child, 5);
  dot(c, hx + 60, hy - 25, 11, INK, 0);
  shape(c, () => ell(c, hx + 130, hy + 85, 17, 13), "#8a3f35", 5);
  stTumbler(c, 800, 850, 280, 440);
  // fog of tiny drops on the outside
  const r = rnd(9); for (let i = 0; i < 26; i++) { const y = 560 + r() * 220; drop(c, 660 + r() * 100 + (y - 560) * 0.1, y, 7 + r() * 3, "#e9f3ff"); }
  arrow(c, [[420, 600], [520, 590], [630, 600]]); arrow(c, [[420, 620], [530, 650], [630, 690]], RED, 8);
};
const a3 = (c: Ctx) => {
  ground(c);
  person(c, 540, 930, 780, { armL: [Math.PI * 0.85, -Math.PI * 0.5], armR: [Math.PI * 0.2, Math.PI * 0.3] });
  // foods round the body, joined by lines to the part they build
  bowl(c, 150, 330, 100, "#f2c04a"); line(c, [[250, 340], [390, 410]], 6, RED);
  glass(c, 140, 860, 170, 250, 0.85, MILK); line(c, [[225, 740], [490, 760]], 6, RED);
  carrot(c, 890, 250, 150); line(c, [[850, 340], [610, 235]], 6, RED);
  keerai(c, 900, 670, 130); line(c, [[800, 600], [600, 500]], 6, RED);
};
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 460, 900, 330, 40);
  shape(c, () => rrect(c, 130, 150, 650, 740, 18), WHITE, 7);
  shape(c, () => rrect(c, 130, 150, 60, 740, 18), COL.teal, 6);
  for (let row = 0; row < 3; row++) {
    const y = 270 + row * 200;
    for (let g = 0; g < 2; g++) { const x = 270 + g * 240; for (let i = 0; i < 4; i++) line(c, [[x + i * 36, y - 50], [x + i * 36, y + 50]], 8); line(c, [[x - 14, y + 34], [x + 126, y - 34]], 8, RED); }
    drop(c, 720, y + 20, 22);
  }
  glass(c, 880, 830, 200, 300, 0.7);
};
const c1 = (c: Ctx) => {
  ground(c);
  // a jug of whey in the middle, three ways to use it
  shadow(c, 550, 700, 150, 28);
  shape(c, () => { c.moveTo(430, 440); c.lineTo(670, 440); c.lineTo(650, 690); c.lineTo(450, 690); c.closePath(); }, COL.glass, 6);
  shape(c, () => { c.moveTo(436, 520); c.lineTo(664, 520); c.lineTo(650, 690); c.lineTo(450, 690); c.closePath(); }, WHEY, 0);
  shape(c, () => ell(c, 550, 440, 120, 24), "rgba(255,255,255,0.4)", 6);
  shine(c, [[470, 470], [480, 650]], 8);
  for (const [x, y] of [[190, 200], [900, 200], [550, 860]]) arrow(c, [[550 + (x - 550) * 0.28, 570 + (y - 570) * 0.28], [550 + (x - 550) * 0.62, 570 + (y - 570) * 0.62]]);
  // dough ball for chapati
  shadow(c, 190, 280, 130, 22); shape(c, () => ell(c, 190, 200, 120, 80), TAN); shade(c, () => ell(c, 190, 200, 120, 80), TANDK, 30, 20, 0.45);
  // pot of dal, steaming
  pan(c, 900, 220, 125, "#f2c04a"); for (const dx of [-40, 20]) line(c, [[900 + dx, 150], [912 + dx, 120], [890 + dx, 90]], 7, "#b9b4ab");
  // a glass to drink
  glass(c, 550, 1000, 160, 190, 0.8, WHEY);
};
const c2 = (c: Ctx) => {
  ground(c);
  // a steel bottle with lemon, salt, jaggery and a banana
  shadow(c, 560, 860, 150, 30);
  shape(c, () => rrect(c, 430, 330, 260, 520, 50), COL.steel);
  shade(c, () => rrect(c, 430, 330, 260, 520, 50), COL.steelDk, 60, 0, 0.5);
  shape(c, () => rrect(c, 480, 240, 160, 110, 22), COL.teal); shape(c, () => rrect(c, 505, 170, 110, 80, 30), COL.tealDk);
  shine(c, [[470, 420], [470, 780]], 10);
  drop(c, 560, 640, 40, COL.water);
  lemon(c, 190, 300, 90);
  shape(c, () => polyP(c, [[110, 640], [190, 540], [270, 640]]), WHITE, 6); line(c, [[110, 640], [270, 640]], 6);
  for (const [x, y] of [[170, 660], [215, 665], [260, 662]]) dot(c, x, y, 6, WHITE, 3);
  shape(c, () => rrect(c, 790, 280, 140, 110, 22), "#a8723f", 6); shape(c, () => rrect(c, 830, 340, 130, 100, 22), "#8a5a3c", 6);
  banana(c, 850, 760, 130);
  arrow(c, [[300, 300], [410, 400]]); arrow(c, [[300, 600], [420, 600]]); arrow(c, [[780, 360], [700, 420]]);
};

// ------------------------------------------------------------------ terms
const t0 = (c: Ctx) => {
  ground(c);
  const cols: [string, string][] = [["#f2c04a", "#d39a3a"], ["#e4523b", "#b73a28"], ["#fff1a0", "#e3c95a"], ["#f39a3c", "#d27c25"], ["#e9e6dc", "#c3bfb2"], ["#8fc3ea", "#5f9fd3"]];
  cols.forEach(([a, b], i) => jar(c, 240 + (i % 3) * 300, 470 + Math.floor(i / 3) * 400, 190, 230, a, b));
};
const t1 = (c: Ctx) => {
  ground(c);
  basket(c, 200, 800, 280, 240); basket(c, 540, 800, 280, 240); basket(c, 880, 800, 280, 240);
  riceHeap(c, 200, 560, 120, 140);
  dalHeap(c, 540, 560, 120, 140);
  glass(c, 880, 580, 150, 230, 0.85, MILK);
};
const t2 = (c: Ctx) => {
  ground(c);
  flame(c, 540, 190, 130);
  plate(c, 540, 760, 480, 190);
  riceHeap(c, 560, 770, 120, 170); banana(c, 800, 790, 100);
  idli(c, 250, 740, 80); idli(c, 150, 790, 80); idli(c, 300, 830, 80);
};
const t3 = (c: Ctx) => {
  ground(c);
  const pts: number[][] = []; for (let i = 0; i < 9; i++) pts.push([130 + i * 105, 560 + Math.sin(i * 0.9) * 60]);
  line(c, pts, 10, INK);
  pts.forEach(([x, y], i) => { if (i === 6) return; bead(c, x, y, 48, COL.yellow); });
  bead(c, pts[6][0] + 40, pts[6][1] + 190, 48, COL.pink);
  arrow(c, [[pts[6][0] + 20, pts[6][1] + 60], [pts[6][0] + 38, pts[6][1] + 120]]);
};
const t4 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 760, 220, 40);
  guavaCut(c, 290, 560, 210);
  keerai(c, 770, 650, 300);
};
const t5 = (c: Ctx) => {
  ground(c);
  person(c, 330, 960, 780, { armL: [Math.PI, -Math.PI / 2], armR: [0, -Math.PI / 2] });
  bowl(c, 780, 640, 140, "#f2c04a");
  shape(c, () => polyP(c, [[740, 840], [900, 840], [900, 940], [740, 940]]), "#fffaf0", 6);
  shape(c, () => polyP(c, [[740, 840], [790, 800], [950, 800], [900, 840]]), "#fffdf5", 6);
  shape(c, () => polyP(c, [[900, 840], [950, 800], [950, 900], [900, 940]]), "#e4dccb", 6);
};
const t6 = (c: Ctx) => {
  ground(c);
  const cl = [COL.red, COL.blue, COL.green, COL.yellow, COL.purple, COL.pink, COL.orange];
  const ch = (x0: number, y: number, order: number[]) => { line(c, [[x0, y], [x0 + 6 * 100, y]], 10); order.forEach((k, i) => bead(c, x0 + i * 100, y, 42, cl[k])); };
  ch(230, 220, [0, 1, 2, 3, 4, 5, 6]);
  arrow(c, [[540, 300], [540, 400]]);
  const r = rnd(2); [[200, 540], [330, 480], [450, 560], [580, 490], [700, 560], [820, 480], [930, 550]].forEach(([x, y], i) => { bead(c, x, y, 42, cl[i]); void r; });
  arrow(c, [[540, 640], [540, 740]]);
  ch(230, 860, [3, 5, 0, 6, 2, 4, 1]);
};
const t7 = (c: Ctx) => {
  ground(c);
  bowl(c, 250, 560, 190, "#f6d46b");

  shadow(c, 760, 700, 220, 30);
  shape(c, () => { c.moveTo(560, 360); c.quadraticCurveTo(760, 820, 960, 360); c.closePath(); }, "#7a4a2a", 7);
  shape(c, () => { c.moveTo(585, 380); c.quadraticCurveTo(760, 770, 935, 380); c.closePath(); }, WHITE, 5);
  shape(c, () => ell(c, 760, 370, 200, 50), "#f5efe0", 6);
  for (const [x, y] of [[250, 850], [420, 900], [560, 830], [330, 960]]) peanut(c, x, y, 90);
};
const t9 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 910, 330, 40);
  // a steel tumbler cut open: a white ring of minerals sits at the bottom
  const o = () => { c.moveTo(250, 160); c.lineTo(830, 160); c.lineTo(740, 900); c.lineTo(340, 900); c.closePath(); };
  shape(c, o, COL.steel, 7); shade(c, o, COL.steelDk, 40, 0, 0.5);
  shape(c, () => polyP(c, [[290, 190], [790, 190], [712, 860], [368, 860]]), COL.steelIn, 5);
  shape(c, () => { c.moveTo(371, 770); c.lineTo(709, 770); c.lineTo(712, 860); c.lineTo(368, 860); c.closePath(); }, WHITE, 5);
  for (const [x, y] of [[420, 780], [500, 790], [580, 778], [660, 790], [450, 825], [600, 830]]) dot(c, x, y, 8, "#e0ddd0", 0);
  arrow(c, [[860, 560], [800, 790]]);
};
const t11 = (c: Ctx) => {
  ground(c);
  drop(c, 320, 560, 160, "#d94a3d");
  for (const [x, y] of [[270, 560], [350, 620], [330, 510]]) { dot(c, x, y, 36, "#bfe0f5", 5); }
  keerai(c, 770, 700, 280);
};
const t12 = (c: Ctx) => {
  ground(c);
  pan(c, 480, 600, 340, WHEY);
  shape(c, () => ell(c, 480, 600, 310, 78), "#e9f1b8", 0);
  for (const [x, y] of [[370, 590], [450, 620], [530, 585], [610, 615], [440, 570]]) lump(c, x, y, 46);
  spoon(c, 440, 460, -0.9, 330);
  arrow(c, [[300, 560], [330, 650], [440, 675]], RED, 9);
  lemon(c, 860, 840, 90);
};
const t13 = (c: Ctx) => {
  ground(c);
  bundle(c, 540, 400, 230);
  drop(c, 540, 700, 16, WHEY); drop(c, 530, 780, 16, WHEY);
  bowl(c, 540, 900, 230, WHEY);
};
const t14 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 900], [D, 900]], 8);
  person(c, 430, 900, 740, { armL: [Math.PI * 0.8, Math.PI * 0.4], armR: [Math.PI * 0.1, -Math.PI * 0.3] });
  for (const y of [520, 600, 680]) line(c, [[120, y], [200, y]], 8, COL.steelDk);
  bubbleThought(c, 840, 230, 170, 120); idli(c, 800, 270, 80); idli(c, 880, 280, 60);
  flame(c, 840, 600, 70);
};
const t15 = (c: Ctx) => {
  ground(c);
  sun(c, 880, 170, 80);
  line(c, [[0, 940], [D, 940]], 8);
  person(c, 360, 940, 740, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.05, -Math.PI * 0.05] });
  drop(c, 190, 360, 16); drop(c, 520, 380, 16); drop(c, 160, 480, 14);
  glass(c, 800, 900, 200, 300, 0.8);
  arrow(c, [[720, 570], [650, 570]]);
};

// ------------------------------------------------------------------ explanations
const x2 = (c: Ctx) => {
  ground(c);
  // dry toor dal: a bar of ten parts, mostly carbohydrate
  shadow(c, 540, 480, 260, 30);
  const p = () => { c.moveTo(260, 470); c.quadraticCurveTo(360, 150, 540, 300); c.quadraticCurveTo(720, 150, 820, 470); c.closePath(); };
  shape(c, p, "#f2c04a", 7);
  const r = rnd(5); for (let i = 0; i < 20; i++) dot(c, 330 + r() * 400, 330 + r() * 120, 12, "#e2a82e", 3);
  const seg = [COL.yellow, COL.yellow, COL.yellow, COL.yellow, COL.yellow, COL.yellow, COL.red, COL.red, COL.greyDk, COL.greyDk];
  seg.forEach((col, i) => shape(c, () => rrect(c, 80 + i * 92, 640, 88, 220, 8), col, 6));
  arrow(c, [[540, 520], [540, 600]]);
};
const x3 = (c: Ctx) => {
  ground(c);
  idli(c, 170, 520, 100); idli(c, 280, 590, 90);
  arrow(c, [[400, 560], [500, 560]]);
  for (const [x, y] of [[610, 480], [690, 580], [600, 620]]) bead(c, x, y, 40, COL.pink);
  arrow(c, [[740, 560], [830, 560]]);
  flame(c, 910, 480, 130);
};
const x5 = (c: Ctx) => {
  ground(c);
  // one spoon of fat gives as much energy as two spoons of sugar: two flames for fat, one for sugar
  spoon(c, 150, 600, 0, 330); shape(c, () => ell(c, 140, 600, 36, 20), "#f6d46b", 0);
  flame(c, 330, 420, 100); flame(c, 440, 420, 100);
  spoon(c, 150, 860, 0, 330); shape(c, () => ell(c, 140, 860, 36, 20), WHITE, 0);
  flame(c, 380, 700, 100);
  for (const [x, y] of [[100, 860], [140, 880], [160, 845]]) dot(c, x, y, 7, "#e9e6dc", 0);
};
const x6 = (c: Ctx) => {
  ground(c);
  carrot(c, 190, 190, 200); arrow(c, [[390, 290], [520, 290]]); eye(c, 760, 330, 150);
  guavaCut(c, 190, 560, 120); arrow(c, [[390, 570], [520, 570]]); plaster(c, 760, 570, 220, -0.4);
  sun(c, 190, 850, 60); arrow(c, [[390, 840], [520, 840]]); bone(c, 760, 850, 260, 70, -0.3);
};
const x7 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 7);
  for (const [x, y, r] of [[150, 840, 60], [330, 930, 50], [520, 820, 55]]) shape(c, () => ell(c, x, y, r, r * 0.7, 0.3), COL.grey, 6);
  // a small plant
  line(c, [[640, 700], [640, 400]], 14, INK); line(c, [[640, 700], [640, 400]], 8, COL.green);
  leaf(c, 640, 560, 160, -0.4); leaf(c, 640, 470, 150, -2.7); leaf(c, 640, 410, 120, -1.2);
  for (const dx of [-90, -40, 30, 90]) { line(c, [[640, 700], [640 + dx, 790]], 14, INK); line(c, [[640, 700], [640 + dx, 790]], 8, "#f2e9d4"); }
  arrow(c, [[470, 890], [590, 790]], RED, 10);
  arrow(c, [[770, 560], [820, 560]]); bone(c, 925, 560, 150, 46, -0.4);
};
const x8 = (c: Ctx) => {
  ground(c);
  person(c, 270, 960, 760, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  // a big drop that is more than half full
  c.save(); c.beginPath(); c.moveTo(740, 150); c.quadraticCurveTo(1010, 560, 960, 700); c.arc(740, 700, 220, 0, Math.PI); c.quadraticCurveTo(470, 560, 740, 150); c.clip();
  c.fillStyle = WHITE; c.fillRect(400, 100, 700, 900); c.fillStyle = COL.water; c.fillRect(400, 450, 700, 600); c.restore();
  shape(c, () => { c.moveTo(740, 150); c.quadraticCurveTo(1010, 560, 960, 700); c.arc(740, 700, 220, 0, Math.PI); c.quadraticCurveTo(470, 560, 740, 150); c.closePath(); }, "rgba(0,0,0,0)", 7);
};

export const ic_foodNutrientsL3 = cards("sci.food.nutrients.L3 cards", [
  e1, e2, e3, a1, a2, a3, p1, c1, c2,
  t0, t1, t2, t3, t4, t5, t6, t7, t9, t11, t12, t13, t14, t15,
  x2, x3, x5, x6, x7, x8,
]);
