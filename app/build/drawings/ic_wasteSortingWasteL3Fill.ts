import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// SORTING WASTE L3 · four flat cards: the Two-Jar Test, the Sorting Race, Lid or No Lid, the picture sorting guide.

// a glass jar, bottom centre (x, y), with a brown liquid fill 0..1
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill = 0, liquid = "#b5651d") => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.12);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 28);
  if (fill > 0) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = liquid; c.fillRect(x - w / 2, y - h * fill, w, h * fill); c.restore(); }
  shape(c, body, COL.glass, 6);
  shine(c, [[x - w * 0.38, y - h * 0.85], [x - w * 0.34, y - h * 0.25]], 8);
};
const lidOn = (c: Ctx, x: number, y: number, w: number) => { shape(c, () => rrect(c, x - w / 2 - 8, y - 34, w + 16, 40, 10), COL.steel); shade(c, () => rrect(c, x - w / 2 - 8, y - 34, w + 16, 40, 10), COL.steelDk, 24, 0); };
// a newspaper strip (grey lines), a biscuit-box piece (orange), a milk packet strip (blue-white), rotated, stained if wet
const strip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, kind: 0 | 1 | 2, wet = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const col = kind === 0 ? COL.paper : kind === 1 ? COL.orange : COL.sky;
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), col, 4);
  if (kind === 0) for (let i = 0; i < 4; i++) line(c, [[-w * 0.38, -h * 0.3 + i * h * 0.2], [w * 0.38, -h * 0.3 + i * h * 0.2]], 3, COL.grey);
  if (kind === 1) shape(c, () => ell(c, 0, 0, w * 0.22, h * 0.26), COL.yellow, 3);
  if (kind === 2) shape(c, () => rrect(c, -w * 0.3, -h * 0.25, w * 0.6, h * 0.5, 4), COL.blue, 3);
  if (wet) { c.globalAlpha = kind === 2 ? 0.25 : 0.55; shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), "#9a5a22", 0); c.globalAlpha = 1; }
  c.restore();
};

// e1: two jars with the same dry things; the right one also has sambar poured in, the paper goes brown and soggy
const e1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 900], [D, 900]], 6);
  // dry jar
  jar(c, 300, 900, 300, 460);
  strip(c, 250, 760, 60, 300, -0.15, 0);
  strip(c, 330, 800, 130, 180, 0.25, 1);
  strip(c, 370, 720, 50, 280, 0.35, 2);
  // mixed jar: brown sambar, soggy brown strips and a few vegetable bits
  jar(c, 780, 900, 300, 460, 0.5);
  strip(c, 735, 790, 60, 290, 0.3, 0, true);
  strip(c, 820, 820, 130, 170, -0.35, 1, true);
  strip(c, 850, 740, 50, 270, 0.1, 2, true);
  const r = rnd(3);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 660 + r() * 240, 700 + r() * 170, 16, 11, r() * 3), i % 2 ? COL.orange : COL.yellow, 3);
  shape(c, () => ell(c, 780, 670, 150, 14), "#c97a2e", 4);
  // a katori of sambar above, pouring: grown-up's hand holds it
  hand(c, 560, 330, 0.4, 1.2, SKIN.adult, CLOTH.adult);
  const bx = 690, by = 390;
  shape(c, () => { c.moveTo(bx - 110, by); c.bezierCurveTo(bx - 100, by + 90, bx + 100, by + 90, bx + 110, by); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, bx, by, 110, 24), "#c97a2e", 5);
  shape(c, () => { c.moveTo(bx + 80, by + 8); c.quadraticCurveTo(bx + 120, by + 100, bx + 90, by + 240); c.quadraticCurveTo(bx + 112, by + 100, bx + 100, by + 4); c.closePath(); }, "#c97a2e", 4);
  arrow(c, [[920, 420], [910, 560], [860, 640]]);
};

// e2: three bowls (wet, paper, plastic and metal); the child drops a peel into the wet bowl; a stopwatch runs
const e2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 880], [D, 880]], 6);
  const bin = (x: number, col: string, dk: string) => {
    shadow(c, x + 20, 890, 170, 24);
    shape(c, () => polyP(c, [[x - 150, 640], [x + 150, 640], [x + 125, 880], [x - 125, 880]]), col);
    shade(c, () => polyP(c, [[x - 150, 640], [x + 150, 640], [x + 125, 880], [x - 125, 880]]), dk, 70, 0);
    shape(c, () => ell(c, x, 640, 150, 34), dk, 6);
  };
  bin(190, COL.green, COL.greenDk);
  bin(540, COL.blue, COL.blueDk);
  bin(890, COL.grey, COL.greyDk);
  // what is already in them
  shape(c, () => { c.moveTo(130, 650); c.bezierCurveTo(150, 600, 230, 600, 250, 640); c.quadraticCurveTo(190, 660, 130, 650); c.closePath(); }, COL.yellow, 4);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 170 + i * 30, 650 - (i % 2) * 8, 22, 9, 0.3), COL.leaf, 3);
  strip(c, 500, 630, 90, 60, -0.3, 0); strip(c, 580, 640, 80, 50, 0.4, 1);
  shape(c, () => ell(c, 850, 640, 30, 14), COL.red, 4); shape(c, () => ell(c, 930, 636, 30, 14), COL.steel, 4); shape(c, () => rrect(c, 870, 610, 50, 30, 6), COL.sky, 4);
  // the child's hand lets a banana peel fall into the wet bowl
  hand(c, 330, 300, 1.1, 1.25, SKIN.child, CLOTH.child, true);
  shape(c, () => { c.moveTo(320, 430); c.bezierCurveTo(260, 470, 250, 560, 230, 560); c.bezierCurveTo(300, 540, 330, 480, 360, 440); c.closePath(); }, COL.yellow, 5);
  shape(c, () => ell(c, 335, 435, 14, 10), COL.soil, 3);
  arrow(c, [[260, 520], [210, 610]]);
  // stopwatch
  shadow(c, 800, 420, 160, 28);
  shape(c, () => rrect(c, 770, 100, 60, 50, 8), COL.steel, 5);
  shape(c, () => ell(c, 800, 290, 170, 170), COL.steel);
  shape(c, () => ell(c, 800, 290, 135, 135), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[800 + Math.cos(a) * 118, 290 + Math.sin(a) * 118], [800 + Math.cos(a) * 100, 290 + Math.sin(a) * 100]], i % 3 ? 3 : 6); }
  write(c, "60", 760, 170, 40); write(c, "30", 760, 360, 40); write(c, "15", 690, 270, 40); write(c, "45", 860, 270, 40);
  line(c, [[800, 290], [860, 180]], 8, RED);
  shape(c, () => ell(c, 800, 290, 10, 10), INK, 0);
};

// e3: two dabbas side by side with banana peel; the open one has ants and flies, the closed one none
const e3 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 860], [D, 860]], 6);
  const dabba = (x: number) => {
    shadow(c, x + 30, 866, 230, 30);
    shape(c, () => rrect(c, x - 200, 600, 400, 260, 18), COL.steel);
    shade(c, () => rrect(c, x - 200, 600, 400, 260, 18), COL.steelDk, 110, 0);
  };
  // open box: the lid leans beside it, the peel shows above the rim
  dabba(300);
  shape(c, () => { c.moveTo(130, 620); c.bezierCurveTo(150, 540, 260, 530, 330, 560); c.bezierCurveTo(400, 585, 460, 580, 480, 612); c.quadraticCurveTo(300, 650, 130, 620); c.closePath(); }, COL.yellow, 5);
  shape(c, () => ell(c, 300, 600, 200, 34), COL.steelIn, 6);
  shape(c, () => { c.moveTo(140, 622); c.bezierCurveTo(170, 560, 280, 550, 340, 580); c.bezierCurveTo(390, 600, 440, 600, 460, 614); c.quadraticCurveTo(300, 640, 140, 622); c.closePath(); }, COL.yellow, 4);
  for (let i = 0; i < 5; i++) shape(c, () => ell(c, 200 + i * 60, 598 + Math.sin(i) * 6, 7, 5), COL.soil, 0);
  shape(c, () => polyP(c, [[40, 860], [120, 860], [60, 560], [20, 572]]), COL.steel, 5);
  const ant = (x: number, y: number, s: number) => {
    for (const k of [-1, 0, 1]) { line(c, [[x + k * 6 * s, y], [x + k * 14 * s - 4 * s, y + 14 * s]], 3, INK); line(c, [[x + k * 6 * s, y], [x + k * 14 * s - 4 * s, y - 12 * s]], 3, INK); }
    shape(c, () => ell(c, x - 14 * s, y, 9 * s, 7 * s), COL.black, 3); shape(c, () => ell(c, x, y, 7 * s, 6 * s), COL.black, 3); shape(c, () => ell(c, x + 16 * s, y, 11 * s, 8 * s), COL.black, 3);
  };
  const fly = (x: number, y: number, s: number) => {
    shape(c, () => ell(c, x - 12 * s, y - 14 * s, 16 * s, 8 * s, -0.5), "rgba(255,255,255,0.8)", 3); shape(c, () => ell(c, x + 12 * s, y - 14 * s, 16 * s, 8 * s, 0.5), "rgba(255,255,255,0.8)", 3);
    shape(c, () => ell(c, x, y, 14 * s, 10 * s), COL.black, 3); shape(c, () => ell(c, x - 14 * s, y - 2 * s, 7 * s, 7 * s), COL.black, 3);
    shape(c, () => ell(c, x - 16 * s, y - 4 * s, 3 * s, 3 * s), RED, 0);
  };
  // a line of ants climbing up the open box's side
  const trail: number[][] = [[560, 850], [540, 790], [520, 720], [505, 650], [470, 600], [410, 575]];
  trail.forEach(([x, y], i) => ant(x, y, 1.1 + (i % 2) * 0.15));
  ant(620, 850, 1.1); ant(690, 846, 1.2); ant(760, 852, 1.1);
  fly(250, 440, 1.4); fly(400, 390, 1.5); fly(120, 470, 1.3);
  // smell lines from the open box
  for (let i = 0; i < 3; i++) { c.globalAlpha = 0.5; line(c, [[200 + i * 80, 540], [190 + i * 80, 500], [215 + i * 80, 450], [205 + i * 80, 410]], 5, COL.greyDk); c.globalAlpha = 1; }
  // closed box: lid firmly on, nothing near it
  dabba(800);
  lidOn(c, 800, 614, 400);
  shine(c, [[640, 650], [640, 820]], 8);
  arrow(c, [[640, 760], [560, 690]]);
  arrow(c, [[1000, 500], [960, 580]], RED, 10);
};

// p1: the finished poster, three coloured columns full of pictures; the child shows it
const p1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 960], [D, 960]], 6);
  // the poster on the wall
  shadow(c, 600, 965, 420, 30);
  shape(c, () => rrect(c, 180, 130, 780, 760, 14), COL.paper, 7);
  const cols: [number, string][] = [[185, COL.green], [445, COL.blue], [705, COL.red]];
  cols.forEach(([x, col]) => { shape(c, () => rrect(c, x + 12, 148, 236, 100, 10), col, 5); line(c, [[x + 12, 265], [x + 12, 870]], 3, COL.grey); });
  // column signs: a leaf for wet, a newspaper for dry, a red cross on a battery for danger
  shape(c, () => { c.moveTo(265, 230); c.quadraticCurveTo(300, 150, 360, 170); c.quadraticCurveTo(340, 240, 265, 230); c.closePath(); }, COL.greenLt, 4); line(c, [[270, 228], [340, 180]], 3, COL.leafDk);
  shape(c, () => rrect(c, 525, 165, 90, 66, 4), WHITE, 4); for (let i = 0; i < 3; i++) line(c, [[540, 182 + i * 16], [600, 182 + i * 16]], 3, COL.grey);
  shape(c, () => rrect(c, 790, 172, 80, 52, 6), COL.yellow, 4); shape(c, () => rrect(c, 870, 188, 10, 20, 2), INK, 0); line(c, [[800, 160], [860, 236]], 8, WHITE); line(c, [[860, 160], [800, 236]], 8, WHITE);
  // wet column: peel, leaves, eggshell, tea, carrot top, apple core
  shape(c, () => { c.moveTo(230, 330); c.bezierCurveTo(250, 290, 330, 290, 350, 330); c.quadraticCurveTo(290, 350, 230, 330); c.closePath(); }, COL.yellow, 4);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 250 + i * 40, 420, 24, 10, 0.4), COL.leaf, 3);
  shape(c, () => ell(c, 290, 510, 36, 44), WHITE, 4); line(c, [[262, 500], [285, 520], [305, 495], [322, 515]], 3);
  shape(c, () => ell(c, 290, 610, 44, 30), COL.soilDk, 4);
  shape(c, () => polyP(c, [[250, 700], [330, 700], [290, 790]]), COL.orange, 4); for (let i = 0; i < 3; i++) line(c, [[290 - 20 + i * 20, 700], [290 - 30 + i * 30, 660]], 4, COL.leaf);
  shape(c, () => { c.moveTo(265, 820); c.quadraticCurveTo(290, 840, 315, 820); c.lineTo(315, 860); c.quadraticCurveTo(290, 845, 265, 860); c.closePath(); }, COL.red, 4);
  // dry column: newspaper, bottle, can, box, cap, milk packet
  shape(c, () => rrect(c, 490, 300, 150, 60, 4), WHITE, 4); for (let i = 0; i < 3; i++) line(c, [[505, 316 + i * 14], [625, 316 + i * 14]], 3, COL.grey);
  shape(c, () => rrect(c, 530, 400, 60, 100, 12), COL.sky, 4); shape(c, () => rrect(c, 548, 384, 24, 22, 4), COL.blue, 3);
  shape(c, () => rrect(c, 500, 540, 60, 80, 8), COL.steel, 4); shape(c, () => ell(c, 530, 540, 30, 8), COL.steelIn, 3);
  shape(c, () => rrect(c, 580, 550, 60, 70, 4), COL.orange, 4); shape(c, () => ell(c, 610, 585, 14, 16), COL.yellow, 3);
  shape(c, () => ell(c, 530, 680, 26, 26), COL.red, 4); shape(c, () => ell(c, 600, 680, 26, 26), COL.blue, 4);
  shape(c, () => rrect(c, 505, 740, 140, 110, 8), COL.sky, 4); shape(c, () => rrect(c, 535, 770, 80, 50, 4), COL.blue, 3);
  // danger column: battery, bulb, broken glass, medicine strip, bandage, blade
  shape(c, () => rrect(c, 770, 300, 110, 46, 6), COL.yellow, 4); shape(c, () => rrect(c, 880, 313, 12, 20, 2), INK, 0); shape(c, () => rrect(c, 770, 300, 36, 46, 6), COL.black, 4);
  shape(c, () => ell(c, 830, 420, 38, 42), COL.yellow, 4); shape(c, () => rrect(c, 812, 455, 36, 30, 4), COL.steelDk, 4);
  shape(c, () => polyP(c, [[770, 560], [820, 505], [860, 540], [900, 500], [905, 580], [850, 600], [790, 590]]), COL.sky, 4); line(c, [[820, 520], [845, 575]], 3, COL.glassEdge);
  shape(c, () => rrect(c, 770, 640, 130, 56, 6), COL.steel, 4); for (let i = 0; i < 4; i++) shape(c, () => ell(c, 790 + i * 30, 668, 10, 10), WHITE, 3);
  shape(c, () => rrect(c, 770, 740, 130, 40, 20), COL.pink, 4); shape(c, () => rrect(c, 815, 750, 40, 20, 4), WHITE, 3);
  shape(c, () => polyP(c, [[780, 820], [900, 820], [900, 860], [780, 860]]), COL.steelIn, 4); line(c, [[780, 860], [900, 860]], 6, COL.steelDk);
  // the child stands beside the poster, pointing at it
  person(c, 985, 960, 540, { armL: [-Math.PI * 0.72, -Math.PI * 0.9], armR: [Math.PI * 0.55, Math.PI * 0.5] });
};

export const ic_wasteSortingWasteL3Fill = cards("sci.waste.sorting-waste.L3 fill", [e1, e2, e3, p1]);
