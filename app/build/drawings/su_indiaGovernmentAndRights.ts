import type { Ctx } from "./flatKit";
import { COL, INK, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, write, hand, cards, rnd } from "./flatKit";

// a bill (shop receipt): paper with grey text lines, centre (x, y), rotated
const bill = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, seed: number, crumple = true) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 14, h / 2 + 4, w * 0.5, 14);
  const p = () => rrect(c, -w / 2, -h / 2, w, h, 6);
  shape(c, p, COL.paper, 6);
  shade(c, p, COL.grey, w * 0.45, 0, 0.35);
  const r = rnd(seed);
  for (let i = 0; i < Math.floor((h - 50) / 26); i++) { const ww = w * (0.4 + r() * 0.4); line(c, [[-w / 2 + 18, -h / 2 + 26 + i * 26], [-w / 2 + 18 + ww, -h / 2 + 26 + i * 26]], 6, COL.greyDk); }
  if (crumple) { line(c, [[-w / 2 + 6, -h * 0.1], [-w * 0.1, -h * 0.02], [w * 0.2, -h * 0.14]], 3, COL.grey); line(c, [[w * 0.1, h * 0.2], [w * 0.3, h * 0.3]], 3, COL.grey); }
  c.restore();
};
const pencil = (c: Ctx, x: number, y: number, rot: number, body: string = COL.yellow) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -110, -13, 170, 26, 4), body, 5);
  shape(c, () => polyP(c, [[60, -13], [100, 0], [60, 13]]), COL.wood, 5);
  shape(c, () => polyP(c, [[88, -4], [100, 0], [88, 4]]), INK, 2);
  shape(c, () => rrect(c, -125, -13, 24, 26, 4), COL.pink, 5);
  c.restore();
};
const highlighter = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -90, -24, 150, 48, 10), COL.yellow, 6);
  shape(c, () => rrect(c, -90, -24, 55, 48, 10), COL.orange, 6);
  shape(c, () => polyP(c, [[60, -24], [100, -12], [100, 12], [60, 24]]), COL.yellow, 6);
  shape(c, () => rrect(c, 96, -9, 22, 18, 4), COL.orange, 5);
  c.restore();
};
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 16, y + h / 2 + 10, w * 0.52, 20);
  const p = () => rrect(c, x - w / 2, y - h / 2, w, h, 12);
  shape(c, p, COL.paper, 7); shade(c, p, COL.grey, w * 0.5, 0, 0.3);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, 46, h, 12), COL.blue, 6);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 150, 940, 800, 30), COL.cloth, 6);
  bill(c, 280, 330, 230, 340, -0.1, 1); bill(c, 560, 300, 210, 300, 0.08, 2); bill(c, 820, 340, 230, 330, 0.15, 3);
  bill(c, 300, 700, 220, 310, 0.12, 4); bill(c, 560, 700, 240, 340, -0.07, 5); bill(c, 800, 700, 210, 300, -0.15, 6);
  pencil(c, 220, 905, -0.05, COL.orange);
  highlighter(c, 720, 890, 0.05);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const w = 640, h = 900, x = 540, y = 600;
  shadow(c, x + 30, y + h / 2 - 80, w * 0.5, 22);
  shape(c, () => rrect(c, x - w / 2, 120, w, 880, 8), COL.paper, 7);
  shade(c, () => rrect(c, x - w / 2, 120, w, 880, 8), COL.grey, 300, 0, 0.3);
  const r = rnd(9);
  for (let i = 0; i < 6; i++) { const ww = 200 + r() * 260; line(c, [[x - w / 2 + 50, 190 + i * 60], [x - w / 2 + 50 + ww, 190 + i * 60]], 12, COL.greyDk); line(c, [[x + w / 2 - 130, 190 + i * 60], [x + w / 2 - 50, 190 + i * 60]], 12, COL.greyDk); }
  line(c, [[x - w / 2 + 40, 580], [x + w / 2 - 40, 580]], 5, INK);
  // two highlighted tax lines
  for (const yy of [650, 760]) {
    c.globalAlpha = 0.85; shape(c, () => rrect(c, x - w / 2 + 30, yy - 30, w - 60, 62, 10), COL.yellow, 0); c.globalAlpha = 1;
    line(c, [[x - w / 2 + 60, yy], [x - w / 2 + 330, yy]], 12, INK); line(c, [[x + w / 2 - 150, yy], [x + w / 2 - 60, yy]], 12, INK);
  }
  line(c, [[x - w / 2 + 40, 850], [x + w / 2 - 40, 850]], 5, INK);
  line(c, [[x - w / 2 + 60, 920], [x - w / 2 + 250, 920]], 14, COL.greyDk); line(c, [[x + w / 2 - 180, 920], [x + w / 2 - 60, 920]], 14, COL.greyDk);
  // hand holding the highlighter, pen tip on the line
  highlighter(c, 790, 690, Math.PI + 0.35);
  hand(c, 960, 690, Math.PI + 0.35, 1.5);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // bills lined up in order, tallest stack first
  [230, 190, 150, 110, 80].forEach((hh, i) => bill(c, 190 + i * 175, 510 - hh * 0.675, 120, hh * 1.35, 0, 20 + i, false));
  arrow(c, [[170, 550], [900, 550]], RED, 10);
  notebook(c, 540, 800, 900, 360);
  // table grid
  for (let i = 0; i <= 3; i++) line(c, [[160, 630 + i * 100], [930, 630 + i * 100]], 5, INK);
  for (let j = 0; j <= 4; j++) line(c, [[160 + j * 192, 630], [160 + j * 192, 930]], 5, INK);
  const nums = [["3", "6", "9", "5"], ["2", "4", "7", "1"], ["8", "5", "6", "3"]];
  nums.forEach((row, ri) => row.forEach((n, ci) => write(c, n, 200 + ci * 192, 650 + ri * 100, 60, INK, 7)));
};

// a small household thing on the mat, centred (x, y)
const thingBiscuit = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 50, y - 60, 100, 120, 8), COL.orange); shape(c, () => ell(c, x, y, 28, 28), COL.wood, 5); };
const thingShirt = (c: Ctx, x: number, y: number) => shape(c, () => polyP(c, [[x - 30, y - 60], [x - 12, y - 48], [x + 12, y - 48], [x + 30, y - 60], [x + 75, y - 30], [x + 55, y - 5], [x + 40, y - 15], [x + 40, y + 60], [x - 40, y + 60], [x - 40, y - 15], [x - 55, y - 5], [x - 75, y - 30]]), COL.blue);
const thingTorch = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 20, y - 10, 40, 80, 8), COL.red); shape(c, () => polyP(c, [[x - 20, y - 10], [x - 40, y - 50], [x + 40, y - 50], [x + 20, y - 10]]), COL.steel); };
const thingCar = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 70, y - 10, 140, 40, 10), COL.red); shape(c, () => polyP(c, [[x - 35, y - 10], [x - 20, y - 40], [x + 25, y - 40], [x + 45, y - 10]]), COL.sky); [-40, 40].forEach((d) => shape(c, () => ell(c, x + d, y + 32, 16, 16), INK, 4)); };
const thingBox = (c: Ctx, x: number, y: number) => shape(c, () => rrect(c, x - 55, y - 40, 110, 80, 6), COL.teal);
const thingChappal = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 32, 70, 0.15), COL.brown); line(c, [[x - 20, y - 20], [x, y - 40], [x + 20, y - 20]], 8, COL.black); };
const thingPen = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 70, y - 9, 140, 18, 6), COL.purple, 5); };
const thingBall = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 45, 45), COL.green);
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 90, 980, 900, 36), COL.pink, 7);
  const f = [thingBiscuit, thingShirt, thingTorch, thingCar, thingBox, thingChappal, thingPen, thingBall];
  const r = rnd(3);
  for (let i = 0; i < 20; i++) { const col = i % 5, row = Math.floor(i / 5); const x = 150 + col * 195, y = 200 + row * 220; shadow(c, x + 10, y + 55, 55, 14); f[i % f.length](c, x + (r() - 0.5) * 10, y); }
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  // inside back of a shirt collar with a label
  const p = () => polyP(c, [[60, 80], [1020, 80], [1020, 1000], [60, 1000]]);
  shape(c, p, COL.blue, 7);
  shape(c, () => { c.moveTo(150, 130); c.quadraticCurveTo(540, 330, 930, 130); c.lineTo(980, 330); c.quadraticCurveTo(540, 560, 100, 330); c.closePath(); }, COL.blueDk, 7);
  line(c, [[130, 300], [540, 500], [950, 300]], 5, COL.sky);
  shadow(c, 560, 680, 290, 20);
  shape(c, () => rrect(c, 300, 450, 480, 220, 12), WHITE, 7);
  const r = rnd(4);
  for (let i = 0; i < 3; i++) line(c, [[340, 500 + i * 55], [340 + 200 + r() * 160, 500 + i * 55]], 11, COL.greyDk);
  shape(c, () => ell(c, 700, 560, 30, 30), COL.orange, 4);
  shape(c, () => ell(c, 700, 560, 12, 12), COL.green, 3);
  // pointing hand from the lower right
  c.save(); c.translate(760, 870); c.rotate(-Math.PI * 0.62);
  shape(c, () => rrect(c, -150, -45, 90, 90, 14), CLOTH.child, 6);
  shape(c, () => rrect(c, -62, -50, 120, 100, 28), SKIN.child, 6);
  shape(c, () => rrect(c, 40, -42, 150, 34, 17), SKIN.child, 6);
  [0, 1, 2].forEach((k) => shape(c, () => rrect(c, 0, -2 + k * 20, 70, 22, 11), SKIN.child, 5));
  c.restore();
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  notebook(c, 290, 560, 500, 760);
  // bars of different heights
  line(c, [[190, 280], [190, 880], [510, 880]], 7, INK);
  [[460, COL.orange], [330, COL.teal], [250, COL.purple], [150, COL.red], [90, COL.green]].forEach(([hh, col], i) => shape(c, () => rrect(c, 210 + i * 60, 880 - (hh as number), 48, hh as number, 4), col as string, 5));
  // world map
  shadow(c, 780, 880, 250, 20);
  shape(c, () => rrect(c, 540, 330, 480, 520, 18), COL.sky, 7);
  const land = (pts: number[][]) => shape(c, () => polyP(c, pts), COL.greenLt, 5);
  land([[580, 420], [700, 390], [760, 470], [680, 560], [610, 520]]);
  land([[700, 590], [770, 600], [790, 720], [730, 780], [690, 680]]);
  land([[800, 410], [940, 400], [990, 520], [900, 600], [820, 540]]);
  land([[840, 660], [940, 650], [960, 740], [870, 760]]);
  // circled countries
  [[700, 470], [900, 500], [740, 690]].forEach(([x, y]) => { c.beginPath(); ell(c, x, y, 38, 30, 0.3); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); });
};

export const su_indiaGovernmentAndRights = cards("sci.india.government-and-rights.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
