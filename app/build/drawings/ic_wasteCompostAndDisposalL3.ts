import type { Ctx } from "./core";
import {
  COL, INK, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards, rnd, leaf, bowl,
} from "./flatKit";

// Cards for sci.waste.compost-and-disposal.L3: one idea per picture, flat DeepKids look.
const SLIME = "#8f9570", SLIME_DK = "#6d7350", LIQ = "#6b5a2e", CREAM = "#fffaf0", GREY = "#a39f94", GREY_DK = "#7d7870";
const ST = (c: Ctx, g: () => void, col: string, dk: string, dx = 8, dy = 8, w = 6) => { shape(c, g, col, w); shade(c, g, dk, dx, dy); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string, w = 3) => shape(c, () => ell(c, x, y, r, r), col, w);
const circle = (c: Ctx, x: number, y: number, r: number, fill: string) => { shape(c, () => ell(c, x, y, r, r), fill, 14); };
const wavy = (c: Ctx, x: number, y: number, h: number, col: string = GREY_DK, w = 8, amp = 22, outline = false) => {
  const p = () => { c.beginPath(); c.moveTo(x, y); for (let i = 1; i <= 4; i++) c.quadraticCurveTo(x + (i % 2 ? amp : -amp), y - (h * (i - 0.5)) / 4, x, y - (h * i) / 4); };
  c.lineCap = "round";
  if (outline) { p(); c.strokeStyle = INK; c.lineWidth = w + 6; c.stroke(); }
  p(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const fly = (c: Ctx, x: number, y: number, s = 1) => {
  shape(c, () => ell(c, x - 22 * s, y - 14 * s, 20 * s, 10 * s, -0.5), COL.sky, 3); shape(c, () => ell(c, x + 22 * s, y - 14 * s, 20 * s, 10 * s, 0.5), COL.sky, 3);
  shape(c, () => ell(c, x, y, 13 * s, 20 * s), COL.black, 3); dot(c, x, y - 22 * s, 9 * s, COL.black, 3);
};
const bits = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seed: number, cols: string[], sz = 26) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { c.save(); c.translate(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)); c.rotate(r() * 3.14); shape(c, () => rrect(c, -sz * 0.6, -sz * 0.35, sz * 1.2, sz * 0.7, sz * 0.25), cols[i % cols.length], 3.5); c.restore(); }
};
const crumbs = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seed: number, r0 = 7) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) dot(c, x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), r0 + r() * 6, i % 2 ? COL.soil : "#5a3a22", 2);
};
const peel = (c: Ctx, x: number, y: number, s: number, col: string, dk: string) => {
  const g = () => { c.moveTo(x - 120 * s, y - 10 * s); c.quadraticCurveTo(x, y + 120 * s, x + 120 * s, y - 20 * s); c.quadraticCurveTo(x + 60 * s, y + 20 * s, x, y + 22 * s); c.quadraticCurveTo(x - 70 * s, y + 20 * s, x - 120 * s, y - 10 * s); c.closePath(); };
  ST(c, g, col, dk, 12 * s, 8 * s);
  shape(c, () => rrect(c, x + 100 * s, y - 36 * s, 34 * s, 28 * s, 8 * s), dk, 5);
};
const carrot = (c: Ctx, x: number, y: number, s: number) => {
  for (const a of [-2.2, -1.57, -0.9]) leaf(c, x, y - 70 * s, 70 * s, a, COL.leaf);
  ST(c, () => { c.moveTo(x - 34 * s, y - 70 * s); c.quadraticCurveTo(x, y - 90 * s, x + 34 * s, y - 70 * s); c.lineTo(x + 4 * s, y + 80 * s); c.quadraticCurveTo(x, y + 90 * s, x - 4 * s, y + 80 * s); c.closePath(); }, COL.orange, "#c9742a", 10 * s, 0);
  line(c, [[x - 14 * s, y - 30 * s], [x + 6 * s, y - 28 * s]], 4, "#c9742a"); line(c, [[x - 8 * s, y + 10 * s], [x + 8 * s, y + 12 * s]], 4, "#c9742a");
};
const onion = (c: Ctx, x: number, y: number, s: number) => {
  ST(c, () => { c.moveTo(x, y - 80 * s); c.bezierCurveTo(x + 20 * s, y - 40 * s, x + 66 * s, y - 20 * s, x + 66 * s, y + 20 * s); c.bezierCurveTo(x + 66 * s, y + 70 * s, x - 66 * s, y + 70 * s, x - 66 * s, y + 20 * s); c.bezierCurveTo(x - 66 * s, y - 20 * s, x - 20 * s, y - 40 * s, x, y - 80 * s); c.closePath(); }, COL.purple, "#6a4ca8", 12 * s, 8 * s);
  line(c, [[x - 20 * s, y - 20 * s], [x - 26 * s, y + 40 * s]], 4, "#c9b3ec"); line(c, [[x + 14 * s, y - 20 * s], [x + 20 * s, y + 44 * s]], 4, "#c9b3ec");
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.teal, dk: string = COL.tealDk) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.09);
  ST(c, () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); }, col, dk, w * 0.1, 0);
  ST(c, () => rrect(c, x - w * 0.54, y - h - 26, w * 1.08, 34, 10), col, dk, 12, 0);
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.orange, dk = "#c9742a") => {
  shadow(c, x + w * 0.1, y + 8, w * 0.65, w * 0.1);
  ST(c, () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.36, y); c.lineTo(x - w * 0.36, y); c.closePath(); }, col, dk, w * 0.12, 0);
  ST(c, () => rrect(c, x - w * 0.56, y - h - 34, w * 1.12, 40, 12), col, dk, 14, 0);
};
const sprout = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y], [x, y - 150 * s]], 12, INK); line(c, [[x, y], [x, y - 150 * s]], 6, COL.greenDk);
  leaf(c, x, y - 60 * s, 90 * s, -0.5, COL.leaf); leaf(c, x, y - 60 * s, 90 * s, -2.64, COL.leaf); leaf(c, x, y - 120 * s, 80 * s, -0.9, COL.greenLt); leaf(c, x, y - 120 * s, 80 * s, -2.24, COL.greenLt); leaf(c, x, y - 150 * s, 60 * s, -1.57, COL.greenLt);
};
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: () => void) => {
  const g = () => rrect(c, x - w / 2, y - h, w, h, 28);
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.09);
  shape(c, g, COL.glass, 0);
  c.save(); c.beginPath(); g(); c.clip(); fill(); c.restore();
  shape(c, g, "rgba(0,0,0,0)", 6);
  shine(c, [[x - w * 0.36, y - h * 0.75], [x - w * 0.36, y - h * 0.3]], 8);
  shape(c, () => rrect(c, x - w / 2 - 8, y - h - 14, w + 16, 26, 10), COL.steel, 6);
};
const rod = (c: Ctx, x: number, y: number, rot: number, s = 1, col: string = COL.teal, dk: string = COL.tealDk) => { c.save(); c.translate(x, y); c.rotate(rot); ST(c, () => rrect(c, -40 * s, -15 * s, 80 * s, 30 * s, 15 * s), col, dk, 5 * s, 7 * s, 5); c.restore(); };
const sheen = (c: Ctx, x: number, y: number, r: number) => { c.globalAlpha = 0.5; line(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.4, y - r * 0.6], [x - r * 0.05, y - r * 0.8]], 9, WHITE); c.globalAlpha = 1; };
const cloud = (c: Ctx, x: number, y: number, s: number, col = "#d8dde6") => { for (const [dx, dy, r] of [[-70, 10, 50], [-10, -20, 66], [60, 0, 54], [20, 22, 52]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s), col, 0); shape(c, () => rrect(c, x - 110 * s, y - 10 * s, 220 * s, 60 * s, 30 * s), col, 0); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  ST(c, () => ell(c, x, y, r, r), COL.yellow, COL.orange, r * 0.2, r * 0.2);
};
const hill = (c: Ctx, x: number, y: number, w: number, h: number, seed: number) => {
  const g = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.36, y - h * 1.3, x + w * 0.2, y - h * 1.45, x + w / 2, y); c.closePath(); };
  shadow(c, x + w * 0.08, y + 10, w * 0.52, 22);
  shape(c, g, GREY, 0);
  c.save(); c.beginPath(); g(); c.clip();
  const r = rnd(seed), cols = [COL.red, COL.blue, WHITE, COL.yellow, COL.steel, COL.pink, COL.teal, COL.orange];
  for (let i = 0; i < 40; i++) { c.save(); c.translate(x - w / 2 + r() * w, y - r() * h * 1.2); c.rotate(r() * 3); const s = 18 + r() * 20; shape(c, () => rrect(c, -s, -s * 0.6, s * 2, s * 1.2, s * 0.4), cols[i % cols.length], 3); c.restore(); }
  c.restore(); shade(c, g, GREY_DK, w * 0.05, h * 0.05, 0.25); shape(c, g, "rgba(0,0,0,0)", 6);
};
const truck = (c: Ctx, x: number, y: number, s: number, tip = false) => {
  shadow(c, x + 190 * s, y + 4, 250 * s, 16 * s);
  c.save(); if (tip) { c.translate(x, y - 70 * s); c.rotate(-0.42); c.translate(-x, -(y - 70 * s)); }
  ST(c, () => polyP(c, [[x, y - 190 * s], [x + 250 * s, y - 190 * s], [x + 250 * s, y - 70 * s], [x, y - 70 * s]]), COL.green, COL.greenDk, 12 * s, 12 * s);
  c.restore();
  ST(c, () => polyP(c, [[x + 262 * s, y - 150 * s], [x + 340 * s, y - 150 * s], [x + 385 * s, y - 100 * s], [x + 385 * s, y - 52 * s], [x + 262 * s, y - 52 * s]]), COL.orange, "#c9742a", 10 * s, 0);
  shape(c, () => polyP(c, [[x + 290 * s, y - 135 * s], [x + 334 * s, y - 135 * s], [x + 362 * s, y - 102 * s], [x + 290 * s, y - 102 * s]]), COL.sky, 4);
  shape(c, () => rrect(c, x - 6 * s, y - 70 * s, 396 * s, 22 * s, 6), COL.greyDk, 5);
  for (const wx of [x + 60 * s, x + 320 * s]) { dot(c, wx, y - 34 * s, 38 * s, COL.black, 6); dot(c, wx, y - 34 * s, 16 * s, COL.steel, 3); }
};
const crow = (c: Ctx, x: number, y: number, s = 1, col: string = COL.black) => {
  c.beginPath(); c.moveTo(x - 34 * s, y); c.quadraticCurveTo(x - 16 * s, y - 30 * s, x, y); c.quadraticCurveTo(x + 16 * s, y - 30 * s, x + 34 * s, y); c.strokeStyle = col; c.lineWidth = 9 * s; c.lineCap = "round"; c.stroke();
  shape(c, () => ell(c, x, y + 2 * s, 9 * s, 7 * s), col, 0);
};
const smoke = (c: Ctx, x: number, y: number, s: number) => { for (const [dx, dy, r] of [[0, 0, 40], [-30, -50, 46], [20, -100, 52], [-10, -160, 58]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s), "#d8d4cc", 5); };
const bin = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.09);
  ST(c, () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); }, col, dk, w * 0.1, 0);
  ST(c, () => rrect(c, x - w * 0.55, y - h - 30, w * 1.1, 40, 12), col, dk, 12, 0);
};
const tower = (c: Ctx, x: number, y: number, w: number, h: number) => { void c; void x; void y; void w; void h; };
void tower;
const cutaway = (c: Ctx, x: number, y: number, w: number, h: number, wall = COL.steel) => {
  shape(c, () => rrect(c, x - w / 2 - 14, y - h - 14, w + 28, h + 28, 24), wall, 6);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 14), "#f5ecd8", 5);
};

// ---------------------------------------------------------------- summary
const summary = (c: Ctx) => {
  ground(c);
  bucket(c, 260, 930, 360, 330);
  shape(c, () => { c.moveTo(105, 600); c.bezierCurveTo(100, 470, 420, 470, 415, 600); c.closePath(); }, SLIME, 6);
  bits(c, 140, 520, 380, 590, 8, 3, ["#a3a77f", "#7d8460", "#b0a36a"], 22);
  for (const dx of [-120, 0, 120]) shape(c, () => rrect(c, 260 + dx - 12, 600, 24, 70 + Math.abs(dx) * 0.2, 12), SLIME_DK, 4);
  [150, 260, 370].forEach((x, i) => wavy(c, x, 460 - (i === 1 ? 20 : 0), 170, GREY_DK, 9, 20, true));
  fly(c, 130, 260, 1); fly(c, 390, 230, 1); fly(c, 290, 160, 0.9);
  bucket(c, 680, 930, 360, 330);
  shape(c, () => { c.moveTo(525, 600); c.bezierCurveTo(520, 470, 840, 470, 835, 600); c.closePath(); }, COL.soilDk, 6);
  crumbs(c, 560, 520, 810, 590, 18, 5);
  pot(c, 970, 930, 130, 110);
  shape(c, () => ell(c, 970, 820, 57, 12), COL.soilDk, 4);
  sprout(c, 970, 820, 1.1);
};

// ---------------------------------------------------------------- flows
const slimyFill = (c: Ctx, x: number, y: number, w: number, h: number, withLiquid: boolean) => {
  c.fillStyle = SLIME; c.fillRect(x - w, y - h * 0.8, w * 2, h);
  bits(c, x - w / 2 + 20, y - h * 0.75 + 20, x + w / 2 - 20, y - 130, 14, 6, ["#a3a77f", "#7d8460", "#b0a36a"], 28);
  if (withLiquid) { c.fillStyle = LIQ; c.fillRect(x - w, y - 120, w * 2, 130); c.fillStyle = "#8a7440"; c.globalAlpha = 0.6; c.fillRect(x - w, y - 120, w * 2, 12); c.globalAlpha = 1; }
};
const e1 = (c: Ctx) => {
  ground(c);
  jar(c, 280, 930, 340, 560, () => slimyFill(c, 280, 930, 340, 560, true));
  [220, 280, 340].forEach((x, i) => wavy(c, x, 330 - (i === 1 ? 0 : 0), 190, GREY_DK, 9, 20, true));
  fly(c, 150, 260, 1);
  jar(c, 760, 930, 340, 560, () => {
    c.fillStyle = "#d9c08a"; c.fillRect(0, 930 - 450, 1080, 450);
    bits(c, 610, 500, 910, 900, 12, 11, [COL.yellow, COL.orange, COL.greenLt, "#e8d27a"], 28);
    const r = rnd(40); for (let i = 0; i < 12; i++) { c.save(); c.translate(630 + r() * 260, 520 + r() * 380); c.rotate(r() * 3); shape(c, () => rrect(c, -32, -9, 64, 18, 4), CREAM, 3.5); c.restore(); }
  });
};
const e2 = (c: Ctx) => {
  ground(c);
  const fillPeels = (x: number) => () => { c.fillStyle = "#d9c08a"; c.fillRect(x - 200, 930 - 450, 400, 450); bits(c, x - 150, 500, x + 150, 900, 14, 21 + x % 7, [COL.yellow, COL.orange, COL.greenLt, "#e8d27a"], 28); };
  jar(c, 270, 930, 340, 560, fillPeels(270));
  // ladle stirring in the left jar, round arrow
  line(c, [[360, 250], [290, 760]], 30, INK); line(c, [[360, 250], [290, 760]], 18, COL.wood);
  shape(c, () => ell(c, 285, 790, 60, 36, 0.2), COL.wood, 6);
  arrow(c, [[160, 330], [230, 270], [330, 250], [420, 290], [450, 340]], RED, 11);
  jar(c, 680, 930, 340, 560, fillPeels(680));
  line(c, [[860, 970], [1020, 950]], 28, INK); line(c, [[860, 970], [1020, 950]], 16, COL.wood);
  shape(c, () => ell(c, 850, 972, 46, 28, -0.1), COL.wood, 6);
};
const a1 = (c: Ctx) => {
  ground(c);
  pot(c, 190, 930, 240, 190);
  shape(c, () => ell(c, 190, 740, 106, 18), COL.soilDk, 4);
  sprout(c, 190, 745, 1.0);
  [130, 190, 250].forEach((x) => wavy(c, x, 420, 150, COL.green, 9, 18, true));
  person(c, 540, 1010, 680, { armR: [-0.5, -1.2], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  bin(c, 880, 930, 230, 260, COL.blue, COL.blueDk);
  bits(c, 800, 640, 960, 680, 5, 4, [COL.yellow, COL.orange, COL.greenLt], 30);
  [820, 880, 940].forEach((x) => wavy(c, x, 560, 150, GREY_DK, 9, 18, true));
  fly(c, 760, 400, 0.9); fly(c, 960, 380, 0.9);
};
const sheetPaper = (c: Ctx, x: number, col: string) => { shadow(c, x + 160, 900, 150, 16); shape(c, () => rrect(c, x, 200, 300, 690, 14), col, 6); };
const a2 = (c: Ctx) => {
  ground(c);
  sheetPaper(c, 40, "#d7ecc0"); sheetPaper(c, 390, "#ecd9b4"); sheetPaper(c, 740, "#f3cfc8");
  peel(c, 170, 380, 0.7, COL.yellow, COL.orange); carrot(c, 190, 590, 1.0); onion(c, 190, 770, 0.8);
  leaf(c, 420, 380, 150, 0.2, COL.brown); leaf(c, 600, 440, 150, 2.6, COL.woodDk);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 430 + i * 10, 540 + i * 70, 190, 44, 6), CREAM, 5);
  ST(c, () => polyP(c, [[430, 780], [650, 780], [650, 850], [430, 850]]), "#cdbba0", "#a8957a", 8, 8);
  for (let i = 0; i < 3; i++) dot(c, 470 + i * 72, 765, 22, "#cdbba0", 5);
  // battery and a plastic bottle: they do not go in the pot
  ST(c, () => rrect(c, 800, 320, 90, 200, 12), COL.steel, COL.steelDk, 12, 0);
  shape(c, () => rrect(c, 800, 380, 90, 80, 0), COL.red, 4); shape(c, () => rrect(c, 830, 300, 30, 26, 6), COL.steel, 5);
  write(c, "+", 832, 330, 40, WHITE, 6);
  c.save(); c.translate(0, 0); bottleLite(c, 960, 880, 120, 300); c.restore();
  circle(c, 890, 640, 70, "rgba(255,255,255,0.0)"); c.beginPath(); ell(c, 890, 640, 70, 70); c.lineWidth = 14; c.strokeStyle = RED; c.stroke(); line(c, [[840, 590], [940, 690]], 14, RED);
};
function bottleLite(c: Ctx, x: number, y: number, w: number, h: number) {
  const g = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.7); c.quadraticCurveTo(x - w / 2, y - h * 0.84, x - w * 0.16, y - h * 0.88); c.lineTo(x - w * 0.16, y - h); c.lineTo(x + w * 0.16, y - h); c.lineTo(x + w * 0.16, y - h * 0.88); c.quadraticCurveTo(x + w / 2, y - h * 0.84, x + w / 2, y - h * 0.7); c.lineTo(x + w / 2, y); c.closePath(); };
  ST(c, g, COL.glass, "rgba(120,170,210,0.3)", 10, 0); shape(c, () => rrect(c, x - w * 0.2, y - h - 18, w * 0.4, 22, 6), COL.blue, 5); shine(c, [[x - w * 0.3, y - h * 0.6], [x - w * 0.3, y - h * 0.2]], 8);
}
const a3 = (c: Ctx) => {
  ground(c);
  // house with a bin
  shadow(c, 170, 800, 150, 16);
  shape(c, () => rrect(c, 60, 560, 230, 240, 6), "#f3dcae", 6);
  shape(c, () => polyP(c, [[40, 570], [175, 440], [310, 570]]), COL.red, 6);
  shape(c, () => rrect(c, 140, 650, 70, 150, 6), COL.brown, 5);
  shape(c, () => rrect(c, 80, 600, 44, 44, 4), COL.sky, 4);
  bin(c, 345, 800, 70, 90, COL.blue, COL.blueDk);
  truck(c, 410, 800, 0.8);
  hill(c, 900, 800, 290, 230, 5);
  crow(c, 920, 270, 1); crow(c, 1010, 220, 0.8);
  arrow(c, [[180, 400], [300, 320], [480, 340], [540, 520]], RED, 11);
  arrow(c, [[640, 520], [720, 400], [850, 450]], RED, 11);
};
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 160, 960, 560, 36, 12), COL.steel, 6);
  const x = 440, y = 950, w = 440, h = 560;
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.38, y); c.lineTo(x - w * 0.38, y); c.closePath(); };
  shadow(c, x + 30, y + 10, w * 0.6, 24);
  shape(c, body, "#f1ead9", 0);
  c.save(); c.beginPath(); body(); c.clip();
  [[0, 150, COL.brown], [150, 70, COL.soil], [220, 170, COL.yellow]].forEach(([o, hh, col]) => { c.fillStyle = col as string; c.fillRect(x - w, y - (o as number) - (hh as number), w * 2, (hh as number) + 1); });
  const r = rnd(8); for (let i = 0; i < 16; i++) leaf(c, x - 180 + r() * 360, y - 130 + r() * 90, 60, r() * 6.28, i % 2 ? COL.woodDk : COL.orange);
  bits(c, x - 180, y - 380, x + 180, y - 240, 12, 14, [COL.yellow, COL.orange, COL.greenLt], 30);
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - w * 0.56, y - h - 34, w * 1.12, 40, 12), COL.steelDk, 6);
  for (const dx of [-120, 0, 120]) dot(c, x + dx, y - 16, 9, INK, 0);
  dot(c, x - 190, y - 100, 9, INK, 0); dot(c, x + 190, y - 100, 9, INK, 0);
  // lid leaning on the bucket
  line(c, [[960, 520], [900, 940]], 30, INK); line(c, [[960, 520], [900, 940]], 18, COL.wood);
  // bowl of peels with a pouring arrow
  bowl(c, 250, 330, 140);
  bits(c, 150, 280, 350, 320, 6, 17, [COL.yellow, COL.orange, COL.greenLt], 30);
  arrow(c, [[400, 380], [440, 440], [440, 500]], RED, 11);
};
const c1 = (c: Ctx) => {
  ground(c);
  const x = 520, y = 960, w = 430, h = 520;
  bucket(c, x, y, w, h);
  for (let r = 0; r < 3; r++) for (const dx of [-150, -75, 0, 75, 150]) dot(c, x + dx * (1 - r * 0.03), y - 100 - r * 110, 11, INK, 0);
  // cloth over the opening, lid lifted above it
  shape(c, () => polyP(c, [[x - 250, y - h - 20], [x + 250, y - h - 20], [x + 280, y - h + 50], [x - 280, y - h + 50]]), "#f7f3e8", 6);
  line(c, [[x - 270, y - h + 25], [x + 270, y - h + 25]], 8, COL.red);
  ST(c, () => rrect(c, x - 250, y - h - 140, 500, 50, 14), COL.steelDk, "#6e7a8a", 14, 0);
  // air in through the holes
  arrow(c, [[120, y - 210], [x - 190, y - 210]], COL.blueDk, 9);
  arrow(c, [[920, y - 100], [x + 190, y - 100]], COL.blueDk, 9);
  // a fly kept out
  const fx = 880, fy = 330; circle(c, fx, fy, 110, WHITE);
  fly(c, fx, fy + 6, 1.5);
  c.beginPath(); ell(c, fx, fy, 110, 110); c.lineWidth = 16; c.strokeStyle = RED; c.stroke(); line(c, [[fx - 78, fy - 78], [fx + 78, fy + 78]], 16, RED);
};

// ---------------------------------------------------------------- terms
const compostTerm = (c: Ctx) => {
  ground(c);
  pot(c, 760, 1000, 380, 280);
  shape(c, () => ell(c, 760, 730, 175, 30), COL.soilDk, 6);
  sprout(c, 760, 735, 0.9);
  hand(c, 240, 480, 0, 1.8, SKIN.child, CLOTH.child, true);
  shape(c, () => { c.moveTo(290, 400); c.bezierCurveTo(300, 290, 490, 280, 490, 400); c.closePath(); }, COL.soilDk, 6);
  crumbs(c, 320, 330, 470, 390, 8, 6, 9);
  for (const [a, b] of [[520, 450], [550, 560], [590, 650]]) dot(c, a, b, 11, COL.soilDk, 3);
  arrow(c, [[530, 340], [620, 400], [660, 540]], RED, 10);
};
const decomposeTerm = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 760, 1120, 340, 0), COL.soil, 6);
  peel(c, 150, 690, 1.0, COL.yellow, COL.orange);
  peel(c, 450, 700, 0.85, "#d9a441", "#8a5a2a");
  peel(c, 720, 715, 0.6, "#8a5a2a", "#4a2d1a");
  crumbs(c, 850, 730, 1000, 790, 12, 12, 7);
  arrow(c, [[230, 520], [310, 470], [380, 510]], RED, 10); arrow(c, [[520, 530], [590, 480], [660, 520]], RED, 10); arrow(c, [[780, 540], [840, 490], [900, 530]], RED, 10);
};
const microbeTerm = (c: Ctx) => {
  ground(c);
  circle(c, 700, 380, 300, "#e8e0f4");
  c.save(); c.beginPath(); ell(c, 700, 380, 300, 300); c.clip();
  const sp: [number, number, number][] = [[560, 280, 0.3], [760, 240, -0.5], [640, 420, 1.2], [830, 400, 0.2], [560, 520, -0.2], [760, 540, 0.8], [700, 330, 1.5]];
  sp.forEach(([x, y, r]) => rod(c, x, y, r, 1.1)); [[880, 290], [500, 400], [690, 200], [840, 520]].forEach(([x, y]) => dot(c, x, y, 24, COL.pink, 5));
  c.restore(); c.beginPath(); ell(c, 700, 380, 300, 300); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  line(c, [[480, 560], [440, 700]], 6, INK); line(c, [[680, 660], [470, 740]], 6, INK);
  line(c, [[100, 1000], [330, 850]], 36, INK); line(c, [[100, 1000], [330, 850]], 22, COL.steel);
  ST(c, () => ell(c, 400, 790, 160, 90, -0.3), COL.steel, COL.steelDk, 14, 12);
  shape(c, () => { c.moveTo(290, 770); c.bezierCurveTo(300, 690, 500, 690, 510, 760); c.closePath(); }, COL.soilDk, 6);
  crumbs(c, 320, 725, 490, 765, 6, 3, 8);
};
const bacteriaTerm = (c: Ctx) => {
  ground(c);
  circle(c, 700, 380, 300, "#fff6e0");
  c.save(); c.beginPath(); ell(c, 700, 380, 300, 300); c.clip();
  [[560, 270, 0.3], [770, 250, -0.5], [640, 410, 1.2], [840, 410, 0.2], [570, 530, -0.2], [770, 540, 0.8], [700, 330, 1.7]].forEach(([x, y, r]) => rod(c, x, y, r, 1.15));
  c.restore(); c.beginPath(); ell(c, 700, 380, 300, 300); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  line(c, [[470, 560], [420, 700]], 6, INK); line(c, [[690, 670], [470, 770]], 6, INK);
  bowl(c, 300, 790, 220, WHITE);
  shape(c, () => { c.moveTo(100, 790); c.bezierCurveTo(130, 680, 470, 680, 500, 790); c.closePath(); }, WHITE, 6);
  shade(c, () => { c.moveTo(100, 790); c.bezierCurveTo(130, 680, 470, 680, 500, 790); c.closePath(); }, "#e6dfd0", 24, 16);
  shape(c, () => ell(c, 300, 790, 220, 38), WHITE, 5);
  shine(c, [[170, 770], [220, 730]], 9);
};
const aerobicTerm = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 330, 900, 640, 30), COL.soilDk, 8);
  const r = rnd(60);
  for (let i = 0; i < 26; i++) { const x = 140 + (i % 6) * 150 + r() * 40, y = 400 + Math.floor(i / 6) * 130 + r() * 30; shape(c, () => ell(c, x, y, 52 + r() * 14, 40, r()), COL.soil, 4); }
  for (const [x, y, k] of [[210, 480, 30], [420, 440, 26], [580, 560, 34], [790, 470, 28], [300, 690, 30], [500, 810, 26], [720, 700, 34], [870, 840, 26], [160, 880, 24]]) { dot(c, x, y, k, "#dcf0fb", 4); sheen(c, x, y, k); }
  [[330, 560, 0.4], [650, 420, -0.4], [430, 740, 1.1], [830, 610, 0.2], [610, 900, -0.3], [250, 800, 0.9]].forEach(([x, y, a]) => rod(c, x, y, a, 0.7));
  arrow(c, [[300, 120], [300, 300]], COL.blueDk, 10); arrow(c, [[540, 120], [540, 300]], COL.blueDk, 10); arrow(c, [[780, 120], [780, 300]], COL.blueDk, 10);
};
const anaerobicTerm = (c: Ctx) => {
  ground(c);
  cutaway(c, 540, 960, 520, 560, COL.blue);
  c.save(); c.beginPath(); rrect(c, 280, 400, 520, 560, 14); c.clip();
  c.fillStyle = SLIME; c.fillRect(280, 540, 520, 420);
  bits(c, 300, 560, 780, 900, 40, 22, ["#a3a77f", "#7d8460", "#b0a36a"], 34);
  c.fillStyle = LIQ; c.fillRect(280, 860, 520, 100);
  [[420, 900], [540, 920], [660, 900]].forEach(([x, y]) => dot(c, x, y, 16, COL.pink, 4));
  c.restore();
  shape(c, () => rrect(c, 260, 360, 560, 50, 14), COL.blue, 6);
  [420, 540, 660].forEach((x, i) => wavy(c, x, 330, 190 - i * 10, GREY_DK, 9, 20, true));
};
const greensTerm = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 40);
  peel(c, 330, 640, 1.2, COL.yellow, COL.orange);
  carrot(c, 740, 620, 1.5);
  onion(c, 560, 800, 1.3);
  ST(c, () => { c.moveTo(150, 840); c.quadraticCurveTo(300, 960, 450, 840); c.quadraticCurveTo(300, 900, 150, 840); c.closePath(); }, COL.orange, "#c9742a", 8, 6);
  for (const x of [250, 300, 350]) dot(c, x, 868, 8, COL.black, 0);
  leaf(c, 850, 880, 120, -0.3, COL.leaf);
  bits(c, 150, 770, 300, 820, 3, 8, [COL.greenLt], 28);
};
const brownsTerm = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 440, 40);
  [[160, 760, 0.1], [250, 860, -0.5], [120, 900, 0.6], [300, 700, -0.9], [200, 640, 0.3]].forEach(([x, y, a], i) => leaf(c, x, y, 190, a, i % 2 ? COL.brown : COL.woodDk));
  for (let i = 0; i < 5; i++) { c.save(); c.translate(560, 560 + i * 74); c.rotate(i % 2 ? 0.06 : -0.05); shape(c, () => rrect(c, -150, -24, 300, 48, 6), CREAM, 5); line(c, [[-120, -6], [90, -6]], 3, COL.grey); line(c, [[-120, 8], [60, 8]], 3, COL.grey); c.restore(); }
  ST(c, () => polyP(c, [[740, 820], [1010, 820], [1010, 920], [740, 920]]), "#cdbba0", "#a8957a", 8, 8);
  for (let i = 0; i < 3; i++) { dot(c, 790 + i * 90, 800, 34, "#cdbba0", 5); shape(c, () => ell(c, 790 + i * 90, 806, 18, 10), "#a8957a", 3); }
};
const vermiTerm = (c: Ctx) => {
  ground(c);
  cutaway(c, 540, 930, 700, 560, COL.blue);
  c.save(); c.beginPath(); rrect(c, 190, 370, 700, 560, 14); c.clip();
  c.fillStyle = COL.soilDk; c.fillRect(190, 500, 700, 440); crumbs(c, 210, 520, 870, 910, 36, 31, 8);
  bits(c, 220, 400, 860, 470, 10, 16, [COL.yellow, COL.orange, COL.greenLt, "#e8d27a"], 36);
  c.restore();
  const W: number[][][] = [[[260, 650], [330, 590], [400, 690], [470, 620]], [[500, 800], [570, 750], [640, 820], [710, 770]], [[300, 860], [360, 820], [430, 880]], [[620, 620], [690, 580], [760, 640], [820, 600]], [[420, 740], [470, 700], [520, 740]]];
  W.forEach((w) => {
    const path = () => { c.beginPath(); c.moveTo(w[0][0], w[0][1]); for (let i = 1; i < w.length - 1; i++) c.quadraticCurveTo(w[i][0], w[i][1], (w[i][0] + w[i + 1][0]) / 2, (w[i][1] + w[i + 1][1]) / 2); c.lineTo(w[w.length - 1][0], w[w.length - 1][1]); };
    c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = 40; c.stroke(); path(); c.strokeStyle = "#d0605a"; c.lineWidth = 28; c.stroke(); path(); c.strokeStyle = "#a53f3a"; c.lineWidth = 6; c.setLineDash([4, 16]); c.stroke(); c.setLineDash([]);
  });
};
const methaneTerm = (c: Ctx) => {
  ground(c, "#e7f1fb");
  hill(c, 540, 960, 900, 520, 9);
  const r = rnd(70);
  for (let i = 0; i < 9; i++) { const x = 250 + r() * 580, y = 160 + r() * 320, k = 22 + r() * 20; dot(c, x, y, k, "#dcf0fb", 5); sheen(c, x, y, k); }
  arrow(c, [[540, 450], [540, 380]], RED, 9);
};
const landfillTerm = (c: Ctx) => {
  ground(c, "#e7f1fb");
  hill(c, 700, 960, 740, 480, 12);
  shape(c, () => rrect(c, -20, 960, 1120, 140, 0), COL.soil, 6);
  truck(c, 40, 960, 0.85, true);
  for (let i = 0; i < 5; i++) { c.save(); c.translate(330 + i * 40, 920 - i * 12); shape(c, () => rrect(c, -22, -16, 44, 32, 10), [COL.red, COL.blue, WHITE, COL.yellow, COL.pink][i], 3.5); c.restore(); }
  crow(c, 520, 220, 1.4); crow(c, 650, 150, 1.2); crow(c, 800, 250, 1.4); crow(c, 940, 170, 1.1); crow(c, 420, 140, 1);
};
const binsTerm = (c: Ctx) => {
  ground(c);
  bin(c, 290, 930, 380, 520, COL.green, COL.greenDk); bin(c, 790, 930, 380, 520, COL.blue, COL.blueDk);
  bits(c, 170, 360, 400, 430, 5, 5, [COL.yellow, COL.orange, COL.greenLt], 36);
  peel(c, 290, 410, 0.7, COL.yellow, COL.orange);
  // dry bin: milk packet and bottle
  ST(c, () => polyP(c, [[690, 440], [820, 440], [820, 300], [690, 300]]), WHITE, COL.cloth, 8, 8);
  shape(c, () => polyP(c, [[690, 340], [820, 340], [820, 380], [690, 380]]), COL.blue, 4);
  shape(c, () => polyP(c, [[690, 300], [820, 300], [800, 270], [710, 270]]), WHITE, 5);
  bottleLite(c, 900, 440, 100, 280);
};

// ---------------------------------------------------------------- explanations
const explCompost = (c: Ctx) => {
  ground(c);
  peel(c, 170, 560, 0.9, COL.yellow, COL.orange);
  shape(c, () => { c.moveTo(330, 760); c.bezierCurveTo(360, 450, 720, 450, 750, 760); c.closePath(); }, COL.soilDk, 6);
  crumbs(c, 380, 560, 700, 740, 22, 41, 8);
  pot(c, 920, 800, 190, 150);
  shape(c, () => ell(c, 920, 650, 84, 14), COL.soilDk, 4);
  sprout(c, 920, 654, 1.1);
  arrow(c, [[300, 400], [450, 330], [600, 400]], RED, 11);
  arrow(c, [[760, 380], [830, 330], [900, 360]], RED, 11);
};
const explDoers = (c: Ctx) => {
  ground(c);
  cutaway(c, 330, 940, 560, 520, COL.orange);
  c.save(); c.beginPath(); rrect(c, 50, 420, 560, 520, 14); c.clip();
  c.fillStyle = COL.soilDk; c.fillRect(50, 420, 560, 520); crumbs(c, 70, 440, 590, 920, 30, 52, 8);
  c.restore();
  peel(c, 330, 640, 1.0, COL.yellow, COL.orange);
  const r = rnd(5);
  for (let i = 0; i < 4; i++) {
    const x = 240 + i * 38, y = 650, an = -0.9 - i * 0.12; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 20, y - 40, x + Math.cos(an) * 60, y + Math.sin(an) * 60); c.strokeStyle = INK; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); c.strokeStyle = CREAM; c.lineWidth = 5; c.stroke();
  }
  for (let i = 0; i < 6; i++) { const x = 180 + r() * 300, y = 600 + r() * 60; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 80, y - 20 - r() * 30); c.strokeStyle = INK; c.lineWidth = 9; c.stroke(); c.strokeStyle = CREAM; c.lineWidth = 4; c.stroke(); }
  const w = [[100, 840], [200, 800], [300, 860], [420, 820], [520, 860]]; line(c, w, 50, INK); line(c, w, 38, "#e58f93"); line(c, w.map(([x, y]) => [x + 4, y + 8]), 12, "#c9686f");
  shape(c, () => ell(c, 530, 860, 30, 26), "#e58f93", 6);
  // a mite
  shape(c, () => ell(c, 470, 520, 34, 26), "#b5683a", 5);
  for (let k = 0; k < 4; k++) { line(c, [[455 + k * 10, 540], [440 + k * 14 - 10, 566]], 5, INK); line(c, [[455 + k * 10, 500], [440 + k * 14 - 10, 478]], 5, INK); }
  // magnified bacteria on a peel
  circle(c, 820, 300, 230, COL.orange);
  c.save(); c.beginPath(); ell(c, 820, 300, 230, 230); c.clip();
  [[720, 220, 0.3], [870, 190, -0.4], [790, 330, 1.2], [910, 340, 0.2], [720, 400, -0.2], [860, 430, 0.8]].forEach(([x, y, a]) => rod(c, x, y, a, 0.9));
  c.restore(); c.beginPath(); ell(c, 820, 300, 230, 230); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  line(c, [[640, 450], [560, 580]], 6, INK);
};
const explAir = (c: Ctx) => {
  ground(c);
  // left: air
  circle(c, 270, 560, 240, "#f3e4c4");
  c.save(); c.beginPath(); ell(c, 270, 560, 240, 240); c.clip();
  bits(c, 90, 400, 450, 700, 7, 77, [COL.yellow, COL.orange, COL.greenLt], 34);
  [[170, 470, 28], [370, 480, 24], [270, 600, 30], [160, 670, 24], [380, 650, 28], [270, 420, 20]].forEach(([x, y, k]) => { dot(c, x, y, k, "#dcf0fb", 4); sheen(c, x, y, k); });
  [[200, 540, 0.3], [340, 570, -0.5], [280, 700, 0.2]].forEach(([x, y, a]) => rod(c, x, y, a, 0.6));
  c.restore(); c.beginPath(); ell(c, 270, 560, 240, 240); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  // right: no air, sour
  circle(c, 810, 560, 240, SLIME);
  c.save(); c.beginPath(); ell(c, 810, 560, 240, 240); c.clip();
  bits(c, 600, 340, 1030, 780, 44, 78, ["#a3a77f", "#7d8460", "#b0a36a"], 40);
  c.fillStyle = LIQ; c.fillRect(560, 700, 500, 120);
  [[760, 560], [880, 620], [820, 470], [700, 640], [920, 500]].forEach(([x, y]) => dot(c, x, y, 20, COL.pink, 5));
  c.restore(); c.beginPath(); ell(c, 810, 560, 240, 240); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  [740, 810, 880].forEach((x) => wavy(c, x, 290, 170, GREY_DK, 9, 18, true));
  arrow(c, [[150, 200], [200, 280]], COL.blueDk, 9); arrow(c, [[390, 200], [340, 280]], COL.blueDk, 9);
};
const explLayers = (c: Ctx) => {
  ground(c);
  const x = 540, y = 970, w = 520, h = 700;
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shadow(c, x + 30, y + 10, w * 0.6, 26);
  shape(c, body, "#f1ead9", 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.soilDk; c.fillRect(x - w, y - 120, w * 2, 121);
  c.fillStyle = "#d9c08a"; c.fillRect(x - w, y - 270, w * 2, 150); bits(c, x - 200, y - 260, x + 200, y - 130, 10, 3, [COL.yellow, COL.orange, COL.greenLt], 32);
  c.fillStyle = "#f0e6d0"; c.fillRect(x - w, y - 400, w * 2, 130); for (let i = 0; i < 6; i++) { c.save(); c.translate(x - 200 + i * 80, y - 335); c.rotate(i % 2 ? 0.3 : -0.3); shape(c, () => rrect(c, -50, -12, 100, 24, 4), CREAM, 4); c.restore(); }
  c.fillStyle = "#d9c08a"; c.fillRect(x - w, y - 540, w * 2, 140); bits(c, x - 200, y - 530, x + 200, y - 410, 10, 4, [COL.yellow, COL.orange, COL.greenLt], 32);
  c.fillStyle = "#e8cf9a"; c.fillRect(x - w, y - h, w * 2, 160); const r = rnd(9); for (let i = 0; i < 10; i++) leaf(c, x - 200 + r() * 400, y - 640 + r() * 70, 70, r() * 6.28, i % 2 ? COL.orange : COL.woodDk);
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - w * 0.56, y - h - 34, w * 1.12, 40, 12), COL.steelDk, 6);
  for (const [dx, dy] of [[-w * 0.46, 200], [w * 0.44, 320], [-w * 0.43, 440], [w * 0.41, 560]]) dot(c, x + dx, y - dy, 10, INK, 0);
  arrow(c, [[110, y - 200], [x - w * 0.44, y - 200]], COL.blueDk, 9); arrow(c, [[980, y - 320], [x + w * 0.42, y - 320]], COL.blueDk, 9);
  arrow(c, [[110, y - 440], [x - w * 0.41, y - 440]], COL.blueDk, 9); arrow(c, [[980, y - 560], [x + w * 0.4, y - 560]], COL.blueDk, 9);
};
const explRain = (c: Ctx) => {
  ground(c, "#e7f1fb");
  shape(c, () => rrect(c, -20, 700, 1120, 400, 0), "#b5533a", 6);
  line(c, [[100, 780], [160, 830], [140, 900]], 5, "#7e3624"); line(c, [[820, 820], [900, 860], [870, 940]], 5, "#7e3624"); line(c, [[400, 900], [480, 940]], 5, "#7e3624");
  cloud(c, 300, 130, 1.5, "#c1c8d4");
  for (let i = 0; i < 12; i++) { const x = 100 + (i % 6) * 100 + (i > 5 ? 50 : 0), y = 300 + Math.floor(i / 6) * 150; line(c, [[x, y], [x - 24, y + 70]], 9, COL.waterDk); }
  // magnified circle
  circle(c, 790, 400, 270, "#c98a62");
  c.save(); c.beginPath(); ell(c, 790, 400, 270, 270); c.clip();
  const r = rnd(81);
  for (let i = 0; i < 6; i++) { let x = 790, y = 400, an = r() * 6.28; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += Math.cos(an) * 60; y += Math.sin(an) * 60; an += (r() - 0.5) * 1.4; c.lineTo(x, y); } c.strokeStyle = INK; c.lineWidth = 14; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 7; c.stroke(); }
  // springtail
  shape(c, () => ell(c, 870, 520, 56, 24, -0.2), "#cfc9c0", 5); dot(c, 920, 510, 18, "#cfc9c0", 5);
  for (let k = 0; k < 3; k++) line(c, [[850 + k * 20, 535], [842 + k * 22, 565]], 5, INK);
  line(c, [[935, 495], [965, 470]], 4, INK); line(c, [[815, 530], [790, 560], [830, 575]], 5, INK);
  c.restore(); c.beginPath(); ell(c, 790, 400, 270, 270); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  line(c, [[600, 590], [420, 720]], 6, INK);
};
const explHeat = (c: Ctx) => {
  ground(c, "#e7f1fb");
  sun(c, 160, 260, 70);
  shape(c, () => rrect(c, -20, 800, 1120, 300, 0), COL.green, 6);
  const heap = () => { c.moveTo(60, 900); c.bezierCurveTo(140, 460, 400, 340, 560, 350); c.bezierCurveTo(760, 360, 920, 500, 1020, 900); c.closePath(); };
  shadow(c, 580, 910, 500, 36);
  ST(c, heap, COL.soilDk, "#4a2d1a", 24, 16);
  crumbs(c, 200, 520, 880, 860, 40, 91, 8);
  bits(c, 280, 480, 760, 600, 5, 5, [COL.orange, COL.yellow, COL.greenLt], 30);
  [330, 480, 640, 780].forEach((x, i) => wavy(c, x, 330 - (i % 2) * 20, 200, WHITE, 18, 24, true));
  // thermometer pushed into the heap
  line(c, [[800, 300], [720, 470]], 40, INK); line(c, [[800, 300], [720, 470]], 24, WHITE); line(c, [[780, 340], [720, 470]], 10, RED);
  circle(c, 880, 220, 80, WHITE); write(c, "60", 840, 185, 70, INK, 9);
};
const explWormBody = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 740, 1120, 360, 0), COL.soil, 6); crumbs(c, 20, 780, 1060, 1060, 24, 5, 8);
  const pts = [[150, 560], [290, 520], [450, 565], [620, 525], [790, 560]];
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  shadow(c, 470, 700, 360, 22);
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = 124; c.stroke(); path(); c.strokeStyle = "#e58f93"; c.lineWidth = 110; c.stroke();
  for (let i = 0; i < 14; i++) { const x = 190 + i * 42; if (x > 340 && x < 600) continue; line(c, [[x, 505 + (i % 3) * 3], [x + 6, 615]], 4, "#b25a62"); }
  // a cut-away window showing the inside: the gut and the gizzard with sand grains
  shape(c, () => rrect(c, 330, 480, 280, 150, 40), "#f8d4d4", 5);
  line(c, [[345, 555], [420, 548]], 36, INK); line(c, [[345, 555], [420, 548]], 24, "#b25a62");
  ST(c, () => ell(c, 470, 552, 62, 44), "#6a4128", "#4a2d1a", 8, 8);
  for (const [x, y] of [[450, 540], [480, 560], [500, 538], [468, 524], [488, 576], [440, 566]]) dot(c, x, y, 6, "#f0e3c0", 1);
  line(c, [[535, 552], [605, 560]], 36, INK); line(c, [[535, 552], [605, 560]], 24, "#b25a62");
  // mouth end
  shape(c, () => ell(c, 128, 560, 26, 34), "#c9686f", 5);
  leaf(c, 20, 470, 110, 0.15, COL.woodDk);
  arrow(c, [[40, 640], [80, 600]], RED, 9);
  shape(c, () => { c.moveTo(830, 710); c.bezierCurveTo(840, 600, 1010, 600, 1020, 710); c.closePath(); }, COL.soilDk, 6);
  crumbs(c, 860, 650, 990, 700, 5, 8, 7);
  arrow(c, [[800, 440], [860, 480], [900, 560]], RED, 9);
};
const explDump = (c: Ctx) => {
  ground(c, "#e7f1fb");
  hill(c, 580, 820, 900, 520, 77);
  shape(c, () => rrect(c, -20, 820, 1120, 80, 0), "#bfb9ae", 6);
  smoke(c, 660, 400, 1.1);
  // dark trickle at the bottom
  shape(c, () => rrect(c, -20, 880, 1120, 220, 0), COL.soil, 6);
  shape(c, () => { c.moveTo(860, 840); c.bezierCurveTo(900, 900, 960, 900, 980, 960); c.bezierCurveTo(1000, 1020, 930, 1040, 880, 1000); c.bezierCurveTo(820, 960, 850, 900, 820, 860); c.closePath(); }, "#2a1a12", 5);
  truck(c, 20, 900, 0.6);
};
const explTwo = (c: Ctx) => {
  ground(c);
  // left: balcony
  shape(c, () => rrect(c, 0, 0, 520, 1080, 0), "#e7f1fb", 0);
  line(c, [[0, 760], [520, 760]], 10, INK); for (let i = 0; i < 6; i++) line(c, [[20 + i * 100, 760], [20 + i * 100, 960]], 8, INK);
  person(c, 120, 760, 440, { adult: true, armR: [0.4, 0.8] });
  person(c, 260, 760, 330, { armR: [0.5, 0.9] });
  pot(c, 410, 760, 130, 100); pot(c, 410, 650, 130, 100); pot(c, 410, 540, 130, 100);
  shape(c, () => rrect(c, 520, 0, 560, 1080, 0), "#f5ecd8", 0);
  // right: big plant with long rows
  for (let i = 0; i < 3; i++) { const y = 600 + i * 120, wd = 380 + i * 60; ST(c, () => polyP(c, [[800 - wd / 2, y], [800 + wd / 2, y], [800 + wd / 2 + 30, y + 70], [800 - wd / 2 - 30, y + 70]]), COL.soilDk, "#4a2d1a", 12, 10); [680, 800, 920].forEach((x) => wavy(c, x, y - 4, 90, WHITE, 12, 14, true)); }
  truck(c, 560, 460, 0.65);
  line(c, [[520, 0], [520, 1080]], 14, INK);
};

export const ic_wasteCompostAndDisposalL3 = cards("sci.waste.compost-and-disposal.L3 cards", [
  summary, e1, e2, a1, a2, a3, p1, c1,
  compostTerm, decomposeTerm, microbeTerm, bacteriaTerm, aerobicTerm, anaerobicTerm, greensTerm, brownsTerm, vermiTerm, methaneTerm, landfillTerm, binsTerm,
  explCompost, explDoers, explAir, explLayers, explRain, explHeat, explWormBody, explDump, explTwo,
]);
void COL; void SKIN; void CLOTH;
