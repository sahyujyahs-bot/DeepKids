import type { Ctx } from "./flatKit";
import { COL, INK, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, write, hand, cards, rnd } from "./flatKit";

// a bill (shop receipt): paper with a coloured shop bar, item lines with prices, a total and a zigzag tear; tax = yellow band on the tax lines
const D2 = "2345679";
const BILLBAR = [COL.orange, COL.teal, COL.purple, COL.red, COL.blue, COL.green];
const bill = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, seed: number, tax = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 14, h / 2 + 4, w * 0.5, 14);
  const n = Math.max(4, Math.round(w / 24)), tw = w / n, p = () => { c.moveTo(-w / 2, -h / 2); c.lineTo(w / 2, -h / 2); c.lineTo(w / 2, h / 2 - 12); for (let k = 0; k < n; k++) { c.lineTo(w / 2 - (k + 0.5) * tw, h / 2); c.lineTo(w / 2 - (k + 1) * tw, h / 2 - 12); } c.closePath(); };
  shape(c, p, COL.paper, 6);
  shade(c, p, COL.grey, w * 0.45, 0, 0.35);
  const r = rnd(seed), pad = w * 0.1, fs = Math.max(16, w * 0.095), left = -w / 2 + pad, right = w / 2 - pad;
  shape(c, () => rrect(c, left, -h / 2 + pad * 0.8, w - 2 * pad, Math.max(14, h * 0.07), 5), BILLBAR[seed % 6], 4);
  const top = -h / 2 + pad * 0.8 + Math.max(14, h * 0.07) + fs * 1.1, rows = Math.max(1, Math.floor((h * 0.72 - fs * 4) / (fs * 1.9)));
  for (let i = 0; i < rows; i++) {
    const yy = top + i * fs * 1.9;
    if (tax && i >= rows - 2) { c.globalAlpha = 0.85; shape(c, () => rrect(c, left - 4, yy - fs * 0.45, w - 2 * pad + 8, fs * 1.75, 6), COL.yellow, 0); c.globalAlpha = 1; }
    line(c, [[left, yy + fs * 0.4], [left + (w - 2 * pad) * (0.3 + r() * 0.3), yy + fs * 0.4]], 6, COL.greyDk);
    write(c, D2[Math.floor(r() * 7)] + D2[Math.floor(r() * 7)], right - fs * 1.4, yy - fs * 0.1, fs * 0.8, INK, 3.5);
  }
  const ty = top + rows * fs * 1.9 + fs * 0.1;
  line(c, [[left, ty - fs * 0.3], [right, ty - fs * 0.3]], 4, INK);
  line(c, [[left, ty + fs * 0.6], [left + (w - 2 * pad) * 0.3, ty + fs * 0.6]], 9, INK);
  write(c, D2[Math.floor(r() * 7)] + D2[Math.floor(r() * 7)] + "0", right - fs * 2.2, ty + fs * 0.1, fs * 0.95, INK, 5);
  if (h > 280) for (let k = 0; k < 14; k++) line(c, [[left + k * ((w - 2 * pad) / 13), h / 2 - 78], [left + k * ((w - 2 * pad) / 13), h / 2 - 38]], k % 3 ? 3 : 6, INK);
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
  // bills lined up in order, most tax first, the tax lines in yellow
  [310, 260, 210, 160, 120].forEach((hh, i) => bill(c, 190 + i * 175, 500 - hh / 2, 130, hh, 0, 20 + i, true));
  arrow(c, [[150, 545], [920, 545]], RED, 10);
  notebook(c, 540, 810, 900, 380);
  // table: a tinted heading row and three rows of numbers
  c.globalAlpha = 0.9; shape(c, () => rrect(c, 160, 630, 770, 75, 4), COL.yellow, 0); c.globalAlpha = 1;
  for (let i = 0; i <= 4; i++) line(c, [[160, 630 + i * 75], [930, 630 + i * 75]], 5, INK);
  for (let j = 0; j <= 4; j++) line(c, [[160 + j * 192.5, 630], [160 + j * 192.5, 930]], 5, INK);
  for (let j = 0; j < 4; j++) line(c, [[185 + j * 192.5, 668], [290 + j * 192.5, 668]], 9, COL.greyDk);
  const nums = [["3", "6", "9", "5"], ["2", "4", "7", "1"], ["8", "5", "6", "3"]];
  nums.forEach((row, ri) => row.forEach((n, ci) => write(c, n, 240 + ci * 192.5, 712 + ri * 75, 50, INK, 7)));
  pencil(c, 780, 985, -0.04, COL.orange);
};

// a small household thing on the mat, centred (x, y)
const thingBiscuit = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 50, y - 62, 100, 124, 8), COL.orange); shape(c, () => rrect(c, x - 50, y - 62, 100, 18, 6), COL.red, 5); shape(c, () => ell(c, x, y + 5, 30, 30), COL.wood, 5); [[-10, 0], [8, 10], [0, 16]].forEach(([dx, dy]) => shape(c, () => ell(c, x + dx, y + dy, 3, 3), COL.woodDk, 0)); };
const thingShirt = (c: Ctx, x: number, y: number) => { shape(c, () => polyP(c, [[x - 30, y - 60], [x - 12, y - 48], [x + 12, y - 48], [x + 30, y - 60], [x + 75, y - 30], [x + 55, y - 5], [x + 40, y - 15], [x + 40, y + 60], [x - 40, y + 60], [x - 40, y - 15], [x - 55, y - 5], [x - 75, y - 30]]), COL.blue); shape(c, () => { c.moveTo(x - 12, y - 48); c.quadraticCurveTo(x, y - 24, x + 12, y - 48); c.closePath(); }, COL.blueDk, 4); };
const thingTorch = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 20, y - 10, 40, 80, 8), COL.red); shape(c, () => polyP(c, [[x - 20, y - 10], [x - 42, y - 52], [x + 42, y - 52], [x + 20, y - 10]]), COL.steel); shape(c, () => ell(c, x, y - 52, 42, 10), COL.yellow, 4); };
const thingCar = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 70, y - 10, 140, 40, 10), COL.red); shape(c, () => polyP(c, [[x - 35, y - 10], [x - 20, y - 40], [x + 25, y - 40], [x + 45, y - 10]]), COL.sky); [-40, 40].forEach((d) => shape(c, () => ell(c, x + d, y + 32, 16, 16), INK, 4)); };
const thingPhoneBox = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 52, y - 62, 104, 124, 8), COL.teal); shape(c, () => rrect(c, x - 22, y - 40, 44, 76, 8), INK, 4); shape(c, () => rrect(c, x - 16, y - 32, 32, 54, 3), COL.sky, 0); };
const thingChappal = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x - 22, y, 28, 66, 0.12), COL.brown); shape(c, () => ell(c, x + 28, y + 6, 28, 66, 0.12), COL.brown); line(c, [[x - 40, y - 15], [x - 22, y - 36], [x - 4, y - 15]], 8, COL.black); line(c, [[x + 10, y - 9], [x + 28, y - 30], [x + 46, y - 9]], 8, COL.black); };
const thingPen = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 70, y - 11, 120, 22, 6), COL.purple, 5); shape(c, () => polyP(c, [[x + 50, y - 11], [x + 74, y], [x + 50, y + 11]]), COL.wood, 5); };
const thingBall = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 48, 48), COL.green); shape(c, () => { c.moveTo(x - 46, y - 8); c.quadraticCurveTo(x, y + 24, x + 46, y - 8); }, "rgba(0,0,0,0)", 5); line(c, [[x, y - 48], [x, y + 48]], 4, INK); };
const thingTumbler = (c: Ctx, x: number, y: number) => { shape(c, () => polyP(c, [[x - 42, y - 56], [x + 42, y - 56], [x + 32, y + 56], [x - 32, y + 56]]), COL.steel); shade(c, () => polyP(c, [[x - 42, y - 56], [x + 42, y - 56], [x + 32, y + 56], [x - 32, y + 56]]), COL.steelDk, 18, 0, 0.5); shape(c, () => ell(c, x, y - 56, 42, 10), COL.steelIn, 5); };
const thingBook = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 55, y - 50, 110, 100, 6), COL.purple); shape(c, () => rrect(c, x - 55, y - 50, 18, 100, 6), COL.blueDk, 5); shape(c, () => rrect(c, x - 20, y - 30, 60, 34, 4), COL.paper, 4); };
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  // a woven mat with the household things spread over it
  shape(c, () => rrect(c, 40, 80, 1000, 920, 30), COL.cloth, 7);
  shape(c, () => rrect(c, 66, 106, 948, 868, 18), "rgba(0,0,0,0)", 0); line(c, [[70, 110], [1010, 110], [1010, 970], [70, 970], [70, 110]], 12, COL.teal);
  const f = [thingBiscuit, thingShirt, thingTorch, thingCar, thingPhoneBox, thingChappal, thingPen, thingBall, thingTumbler, thingBook];
  const r = rnd(7);
  for (let i = 0; i < 20; i++) {
    const col = i % 5, row = Math.floor(i / 5), x = 180 + col * 180 + (r() - 0.5) * 16, y = 215 + row * 215 + (r() - 0.5) * 24, rot = (r() - 0.5) * 0.5, k = f[(i * 7 + 3) % f.length];
    shadow(c, x + 10, y + 64, 58, 12);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(1.1, 1.1); k(c, 0, 0); c.restore();
  }
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  // a shirt turned inside out at the neck, a "Made in" label sewn inside, a finger pointing at it
  const S = 5.4, cx = 540, cy = 470, P = (pts: number[][]) => pts.map(([u, v]) => [cx + u * S, cy + v * S]);
  const body = P([[-30, -60], [-12, -48], [12, -48], [30, -60], [75, -30], [55, -5], [40, -15], [40, 60], [-40, 60], [-40, -15], [-55, -5], [-75, -30]]);
  shadow(c, 570, 825, 380, 24);
  shape(c, () => polyP(c, body), COL.blue, 7);
  shade(c, () => polyP(c, body), COL.blueDk, 40, 0, 0.5);
  line(c, [[cx - 40 * S + 12, cy + 52 * S], [cx + 40 * S - 12, cy + 52 * S]], 5, COL.sky);
  shape(c, () => ell(c, cx, 190, 150, 52), COL.blueDk, 7);
  shape(c, () => ell(c, cx, 200, 128, 36), COL.sky, 0);
  shape(c, () => rrect(c, 435, 225, 210, 150, 10), WHITE, 7);
  for (let k = 0; k < 3; k++) line(c, [[465, 265 + k * 38], [465 + 100 + (k % 2) * 40, 265 + k * 38]], 13, COL.greyDk);
  line(c, [[447, 232], [633, 232]], 3, COL.grey);
  // pointing hand from the lower right, finger tip on the label
  c.save(); c.translate(715, 590); c.rotate(-Math.PI * 0.64); c.scale(1.35, 1.35);
  shape(c, () => rrect(c, -150, -45, 90, 90, 14), CLOTH.child, 6);
  shape(c, () => rrect(c, -62, -50, 120, 100, 28), SKIN.child, 6);
  [0, 1, 2].forEach((k) => shape(c, () => rrect(c, 0, -2 + k * 20, 70, 22, 11), SKIN.child, 5));
  shape(c, () => rrect(c, 40, -42, 150, 34, 17), SKIN.child, 6);
  shape(c, () => rrect(c, -20, -62, 80, 26, 13), SKIN.child, 5);
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
