import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, glass, bowl, plate, leaf, write, cards } from "./flatKit";

// sci.chemistry.acids-and-bases.L3 · picture cards (cover, activities, terms, explanations).
// Cabbage-water colours run pink (acid) - purple (neutral) - green (base).

const PINK = "#e2578f", PP = "#b768b5", PUR = "#8b5fbf", BLU = "#5f7fd8", TEAL = "#4fb6a0", GRN = "#6cbf6a";
const LEMON = "#ffd84a", LEMONDK = "#e5b422", SOAP = "#f6c3d4";
const NONE = "rgba(0,0,0,0)";

const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
// whole lemon, centre (x, y), half-length r
const lemon = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.7, r * 0.9, r * 0.14);
  shape(c, () => { c.moveTo(x - r * 1.12, y); c.quadraticCurveTo(x - r * 0.9, y - r * 0.82, x, y - r * 0.8); c.quadraticCurveTo(x + r * 0.9, y - r * 0.82, x + r * 1.12, y); c.quadraticCurveTo(x + r * 0.9, y + r * 0.82, x, y + r * 0.8); c.quadraticCurveTo(x - r * 0.9, y + r * 0.82, x - r * 1.12, y); c.closePath(); }, LEMON, 6);
  shade(c, () => ell(c, x, y, r, r * 0.8), LEMONDK, r * 0.3, r * 0.25, 0.7);
  c.beginPath(); ell(c, x, y, r * 1.05, r * 0.82); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shine(c, [[x - r * 0.6, y - r * 0.35], [x - r * 0.25, y - r * 0.6]], 8);
  leaf(c, x + r * 0.3, y - r * 0.78, r * 0.5, -0.5, COL.leaf);
};
// a lemon cut in half, face towards us, centre (x, y), radius r
const lemonHalf = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), LEMON, 6);
  shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), "#fff3a8", 4);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.1, y + Math.sin(a) * r * 0.1], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 4, "#e5b422"); }
  shape(c, () => ell(c, x, y, r * 0.1, r * 0.1), WHITE, 3);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = LEMON) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.3); c.quadraticCurveTo(x, y + s * 1.1, x - s * 0.8, y + s * 0.3); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, Math.max(3, s * 0.2));
const bubble = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = "rgba(255,255,255,0.55)"; c.fill(); c.lineWidth = Math.max(3, r * 0.14); c.strokeStyle = INK; c.stroke(); shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.2, y - r * 0.55]], Math.max(3, r * 0.2)); };
// a soap bar, centre (x, y), width w
const soap = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 0.55;
  shadow(c, x + w * 0.1, y + h * 0.5, w * 0.55, h * 0.16);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.35), SOAP, 6);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.35), "#e59ab5", w * 0.08, h * 0.12, 0.6);
  shine(c, [[x - w * 0.35, y - h * 0.15], [x - w * 0.1, y - h * 0.25]], 8);
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, col: string, cap: string = COL.red) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  shape(c, () => rrect(c, x - w * 0.18, y - h - 36, w * 0.36, 50, 6), cap, 5);
  shape(c, () => rrect(c, x - w * 0.5, y - h * 0.8, w, h * 0.8, w * 0.2), col, 6);
  shape(c, () => rrect(c, x - w * 0.2, y - h - 4, w * 0.4, h * 0.3, 6), col, 6);
  shade(c, () => rrect(c, x - w * 0.5, y - h * 0.8, w, h * 0.8, w * 0.2), "rgba(43,35,64,0.5)", w * 0.15, 0, 0.3);
  shape(c, () => rrect(c, x - w * 0.32, y - h * 0.55, w * 0.64, h * 0.3, 6), WHITE, 4);
};
const fill = (c: Ctx, x: number, y: number, w: number, h: number, col: string, lvl = 0.78) => glass(c, x, y, w, h, lvl, col);
const spoon = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  line(c, [[x0, y0], [x1, y1]], 22, INK); line(c, [[x0, y0], [x1, y1]], 12, COL.steel);
  const an = Math.atan2(y1 - y0, x1 - x0);
  shape(c, () => ell(c, x1 + Math.cos(an) * 34, y1 + Math.sin(an) * 34, 52, 36, an), COL.steel, 6);
};
const tag = (c: Ctx, x: number, y: number, t: string, h = 70) => write(c, t, x, y, h, INK, 9);
const mound = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  const p = () => { c.moveTo(x - w, y); c.bezierCurveTo(x - w * 0.7, y - h * 1.3, x + w * 0.7, y - h * 1.3, x + w, y); c.closePath(); };
  shape(c, p, col, 5); shade(c, p, dk, w * 0.3, 0, 0.5);
};

// ------------------------------------------------------------------ cover
const summary = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 360, 1040, 540, 14), WHITE, 6);
  lemon(c, 110, 740, 75);
  [PINK, PP, PUR, BLU, GRN].forEach((col, i) => fill(c, 285 + i * 140, 840, 120, 400, col));
  soap(c, 985, 780, 130);
  arrow(c, [[130, 250], [940, 250]], RED, 12);
};
// ------------------------------------------------------------------ flows
const flowE1 = (c: Ctx) => {
  ground(c);
  fill(c, 400, 930, 280, 440, PUR);
  spoon(c, 230, 300, 360, 340);
  hand(c, 120, 260, 0.3, 1.3);
  drop(c, 450, 470, 22, PINK);
  arrow(c, [[455, 520], [455, 590]]);
  lemon(c, 770, 880, 58);
  bottle(c, 890, 940, 80, 210, "#e8d9a8");
  soap(c, 990, 900, 80);
  table(c, 940);
};
const flowE2 = (c: Ctx) => {
  ground(c);
  lemonHalf(c, 290, 330, 85);
  bowl(c, 640, 330, 95, "#fffaf0");
  fill(c, 290, 880, 200, 330, PINK);
  fill(c, 640, 880, 200, 330, PINK);
  spoon(c, 800, 150, 880, 260);
  [0, 1, 2].forEach((i) => drop(c, 960, 400 + i * 85, 22, COL.sky));
  fill(c, 960, 880, 180, 330, PUR);
  arrow(c, [[400, 640], [520, 640]]);
};
const flowE3 = (c: Ctx) => {
  ground(c);
  bowl(c, 270, 400, 150, "#fffaf0");
  bowl(c, 810, 400, 150, "#f3e3b0");
  [[760, 395], [830, 410], [800, 380], [860, 390]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 18, 8), "#fff3c8", 3));
  fill(c, 270, 940, 190, 300, PUR);
  fill(c, 810, 940, 190, 300, PP);
  arrow(c, [[420, 760], [660, 760]]);
  tag(c, 235, 70, "1", 100); tag(c, 775, 70, "2", 100);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  fill(c, 300, 930, 250, 400, PUR);
  lemonHalf(c, 300, 270, 90);
  [0, 1].forEach((i) => drop(c, 285 + i * 30, 440 + i * 50, 20));
  fill(c, 800, 930, 250, 400, PINK);
  arrow(c, [[460, 700], [640, 700]]);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  lemonHalf(c, 250, 700, 150);
  bowl(c, 760, 560, 230, "#dff0fa");
  [[640, 540, 28], [720, 580, 36], [860, 535, 30], [900, 585, 22], [790, 520, 22]].forEach(([x, y, r]) => bubble(c, x, y, r));
  hand(c, 750, 150, 1.45, 1.7, SKIN.child, CLOTH.child, true);
  [[610, 410, 26], [930, 440, 30], [830, 360, 20]].forEach(([x, y, r]) => bubble(c, x, y, r));
};
const flowA3 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 830, 400, 120);
  mound(c, 540, 800, 150, 100, WHITE, "#d9d4c6");
  lemonHalf(c, 280, 260, 95);
  [0, 1, 2].forEach((i) => drop(c, 360 + i * 40, 400 + i * 55, 20));
  [[430, 650, 20], [510, 600, 28], [600, 560, 18], [680, 640, 26], [560, 480, 16], [650, 470, 22], [740, 560, 16]].forEach(([x, y, r]) => bubble(c, x, y, r));
  arrow(c, [[860, 700], [860, 430]]);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  lemon(c, 180, 770, 75);
  soap(c, 440, 800, 170);
  fill(c, 690, 850, 150, 270, COL.sky, 0.7);
  bottle(c, 900, 850, 120, 300, "#8fd0c4", COL.red);
  line(c, [[830, 540], [970, 660]], 14, RED); line(c, [[970, 540], [830, 660]], 14, RED);
  table(c, 850);
};
const flowP1 = (c: Ctx) => {
  ground(c);
  line(c, [[60, 160], [1020, 160]], 8);
  [[150, PUR], [370, GRN], [590, PUR], [810, PINK]].forEach(([x, col]) => {
    shape(c, () => rrect(c, (x as number) - 50, 160, 100, 320, 6), PUR, 6);
    if (col !== PUR) shape(c, () => ell(c, x as number, 400, 36, 36), col as string, 4);
    shape(c, () => rrect(c, (x as number) - 56, 140, 112, 40, 6), COL.wood, 5);
  });
  shape(c, () => polyP(c, [[130, 650], [950, 650], [900, 880], [180, 880]]), COL.steel, 6);
  shape(c, () => polyP(c, [[165, 665], [915, 665], [880, 800], [195, 800]]), "#7b57a8", 4);
  shape(c, () => rrect(c, 480, 540, 90, 240, 6), "#a285cc", 5);
  arrow(c, [[640, 560], [640, 640]]);
};
const flowC1 = (c: Ctx) => {
  ground(c);
  [PINK, PP, PUR, BLU, TEAL, GRN].forEach((col, i) => fill(c, 165 + i * 150, 860, 110, 240, col));
  table(c, 860);
  lemonHalf(c, 200, 400, 75);
  mound(c, 540, 470, 130, 70, WHITE, "#d9d4c6");
  spoon(c, 620, 420, 740, 330);
  soap(c, 900, 450, 140);
};
const flowC2 = (c: Ctx) => {
  ground(c);
  bowl(c, 260, 640, 180, COL.steelIn);
  mound(c, 260, 640, 130, 60, "#f0b323", "#c58d12");
  shape(c, () => rrect(c, 520, 430, 440, 380, 12), WHITE, 6);
  shape(c, () => ell(c, 740, 640, 130, 120), "#f0b323", 4);
  shape(c, () => ell(c, 740, 640, 55, 50), "#c8402a", 4);
  drop(c, 740, 330, 26, "#dff0fa");
  arrow(c, [[460, 640], [510, 640]]);
};
// ------------------------------------------------------------------ terms
const termAcid = (c: Ctx) => {
  ground(c);
  lemon(c, 340, 560, 220);
  drop(c, 560, 250, 28);
  fill(c, 820, 900, 230, 380, PINK);
};
const termBase = (c: Ctx) => {
  ground(c);
  soap(c, 360, 640, 480);
  [[250, 450, 40], [420, 400, 56], [560, 480, 30], [320, 330, 26], [500, 300, 36]].forEach(([x, y, r]) => bubble(c, x, y, r));
  fill(c, 830, 900, 230, 380, GRN);
};
const termAlkali = (c: Ctx) => {
  ground(c);
  line(c, [[130, 800], [330, 740]], 36, INK); line(c, [[130, 800], [330, 740]], 24, "#4a3a3a");
  mound(c, 270, 790, 190, 160, COL.grey, COL.greyDk);
  [[210, 730], [290, 700], [340, 745], [250, 765]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 9, 6), COL.greyDk, 3));
  arrow(c, [[480, 600], [640, 600]]);
  fill(c, 810, 900, 250, 400, COL.sky, 0.7);
  mound(c, 810, 640, 70, 40, WHITE, "#d9d4c6");
};
const termNeutral = (c: Ctx) => {
  ground(c);
  fill(c, 540, 930, 300, 480, PUR);
  fill(c, 170, 930, 180, 280, COL.sky, 0.75);
  bowl(c, 900, 760, 120, COL.steelIn);
  mound(c, 900, 760, 85, 40, WHITE, "#d9d4c6");
  [[870, 735], [915, 740], [900, 712]].forEach(([x, y]) => shape(c, () => rrect(c, x - 14, y - 14, 28, 28, 4), "#fffaf0", 3));
};
const termIndicator = (c: Ctx) => {
  ground(c);
  fill(c, 260, 930, 260, 430, PUR);
  [[820, 360, PINK], [820, 660, PUR], [820, 960, GRN]].forEach(([x, y, col]) => fill(c, x as number, y as number, 130, 220, col as string));
  arrow(c, [[430, 600], [660, 380]]);
  arrow(c, [[440, 700], [660, 700]]);
  arrow(c, [[430, 800], [660, 960]]);
};
const termPigment = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 830, 250, 40);
  shape(c, () => ell(c, 390, 560, 250, 250), PUR, 6);
  shape(c, () => ell(c, 390, 560, 215, 215), "#c9a6e0", 4);
  for (let k = 0; k < 4; k++) { const r = 190 - k * 45; c.beginPath(); c.arc(390, 560, r, 0.5 + k, 4.6 + k); c.lineWidth = 9; c.strokeStyle = PUR; c.stroke(); }
  [[780, 450], [850, 500], [810, 560]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 38, 54, 0.3), "#4a2a6e", 5));
  const g = [[760, 700], [830, 700], [895, 700], [795, 765], [865, 765], [830, 830]];
  g.forEach(([x, y]) => shape(c, () => ell(c, x, y, 36, 36), "#6b3fa0", 5));
  line(c, [[830, 640], [830, 640]], 1); leaf(c, 830, 660, 100, -1.2);
};
const termPh = (c: Ctx) => {
  ground(c);
  const cols = ["#d7372b", "#e24a2c", "#ec6a2b", "#f39a3c", "#f6c23c", "#d6d84a", "#a6cf55", "#6aa53f", "#4fb6a0", "#3fb1a8", "#3f8fb3", "#5b78d6", "#5f64c9", "#6b4fb5", "#5b3d9c"];
  const w = 62, x0 = 75;
  cols.forEach((col, i) => { shape(c, () => rrect(c, x0 + i * w, 540, w, 110, 4), col, 5); });
  const cx = (i: number) => x0 + (i + 0.5) * w;
  lemon(c, cx(2), 420, 55);
  fill(c, cx(7), 510, 110, 180, COL.sky, 0.7);
  soap(c, cx(10), 460, 130);
  tag(c, cx(0) - 20, 700, "0", 90); tag(c, cx(7) - 20, 700, "7", 90); tag(c, cx(14) - 70, 700, "14", 90);
};
const termNeutralise = (c: Ctx) => {
  ground(c);
  fill(c, 170, 520, 190, 340, PINK);
  fill(c, 170, 980, 190, 340, GRN);
  fill(c, 880, 930, 260, 440, PUR);
  arrow(c, [[330, 400], [610, 650]]);
  arrow(c, [[330, 800], [610, 740]]);
};
const termCo2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 250, 34);
  shape(c, () => rrect(c, 420, 620, 280, 310, 40), COL.glass, 6);
  shape(c, () => rrect(c, 428, 740, 264, 182, 34), "#fff1a8", 0);
  shape(c, () => rrect(c, 495, 500, 130, 140, 8), COL.glass, 6);
  // the balloon, filled with gas, on the neck
  shape(c, () => { c.moveTo(560, 520); c.bezierCurveTo(400, 480, 380, 150, 560, 130); c.bezierCurveTo(740, 150, 720, 480, 560, 520); c.closePath(); }, COL.pink, 6);
  shade(c, () => ell(c, 560, 320, 150, 190), "#d9708e", 50, 30, 0.5);
  shine(c, [[470, 260], [490, 190]], 10);
  [[500, 800, 16], [600, 760, 22], [560, 840, 14], [640, 840, 18], [520, 700, 14]].forEach(([x, y, r]) => bubble(c, x, y, r));
  arrow(c, [[800, 780], [800, 450]]);
};
// ------------------------------------------------------------------ explanations
const explAcid = (c: Ctx) => {
  ground(c);
  lemon(c, 170, 710, 85);
  bottle(c, 390, 790, 130, 330, "#e8d9a8");
  [0, 1, 2].forEach((i) => shape(c, () => { c.moveTo(560 + i * 14, 740 - i * 40); c.quadraticCurveTo(650, 640 + i * 16, 760, 700 + i * 26); c.quadraticCurveTo(650, 740 + i * 16, 560 + i * 14, 740 - i * 40); c.closePath(); }, COL.brown, 5));
  bowl(c, 900, 700, 110, "#fffaf0");
  mound(c, 900, 700, 90, 40, "#fffaf0", "#e4dccb");
  table(c, 800);
};
const explBase = (c: Ctx) => {
  ground(c);
  soap(c, 210, 700, 280);
  [[130, 560, 28], [250, 520, 40], [330, 600, 22]].forEach(([x, y, r]) => bubble(c, x, y, r));
  bowl(c, 560, 690, 130, COL.steelIn);
  mound(c, 560, 690, 100, 50, WHITE, "#d9d4c6");
  bottle(c, 880, 790, 160, 420, "#5b8fd6", "#ffd34d");
  table(c, 800);
};
const explCabbage = (c: Ctx) => {
  ground(c);
  shadow(c, 290, 880, 220, 36);
  shape(c, () => ell(c, 290, 620, 215, 215), PUR, 6);
  shape(c, () => ell(c, 290, 620, 185, 185), "#c9a6e0", 4);
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(290, 620, 160 - k * 45, 0.5 + k, 4.6 + k); c.lineWidth = 9; c.strokeStyle = PUR; c.stroke(); }
  fill(c, 760, 930, 240, 400, PUR);
  shape(c, () => rrect(c, 735, 240, 50, 200, 8), COL.steel, 6);
  shape(c, () => ell(c, 760, 220, 55, 70), COL.red, 6);
  drop(c, 760, 490, 22, PINK);
  arrow(c, [[760, 530], [760, 600]]);
};
const explAnt = (c: Ctx) => {
  ground(c);
  leaf(c, 60, 860, 560, -0.35, COL.leaf); leaf(c, 1020, 860, 520, -2.8, COL.leafDk);
  const ant = "#e8643a", antDk = "#b9421f";
  [[-1, 0], [0, 0], [1, 0]].forEach(([k]) => { [-1, 1].forEach((s) => { const bx = 450 + k * 30; line(c, [[bx, 560], [bx + k * 70 - 20, 560 + s * 110], [bx + k * 110 - 30, 560 + s * 190]], 20, INK); line(c, [[bx, 560], [bx + k * 70 - 20, 560 + s * 110], [bx + k * 110 - 30, 560 + s * 190]], 10, ant); }); });
  line(c, [[300, 500], [250, 400], [180, 360]], 18, INK); line(c, [[300, 500], [250, 400], [180, 360]], 8, ant);
  line(c, [[300, 560], [230, 590], [170, 560]], 18, INK); line(c, [[300, 560], [230, 590], [170, 560]], 8, ant);
  shape(c, () => ell(c, 640, 560, 105, 78), ant, 6);
  shade(c, () => ell(c, 640, 560, 105, 78), antDk, 28, 22, 0.6);
  shape(c, () => ell(c, 450, 560, 52, 42), ant, 6);
  shape(c, () => ell(c, 330, 560, 56, 52), ant, 6);
  shape(c, () => ell(c, 320, 548, 10, 12), INK, 0);
  [0, 1].forEach((i) => drop(c, 810 + i * 70, 590 + i * 60, 20, "#fff1a8"));
  arrow(c, [[760, 520], [900, 480]]);
};

export const ic_chemistryAcidsAndBasesL3 = cards("sci.chemistry.acids-and-bases.L3 cards", [
  summary, flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowP1, flowC1, flowC2,
  termAcid, termBase, termAlkali, termNeutral, termIndicator, termPigment, termPh, termNeutralise, termCo2,
  explAcid, explBase, explCabbage, explAnt,
]);
