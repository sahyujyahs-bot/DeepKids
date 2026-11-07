import type { Ctx } from "./core";
import { INK, WHITE, RED, SH, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, write, hand, person, bowl, cards } from "./flatKit";

// THE IMMUNE SYSTEM (L4) · set-up cards for the Key Shop (coin codes) and Spread and Shield (a 5 x 5 town),
// then the flow pictures and two term cards. Flat kit look: bold ink outline, flat colour, shade on the lower right.

// ---------------------------------------------------------------- small helpers
// H and T (coin faces) and a question mark, in the same stroke style as the kit's numbers
const LET: Record<string, number[][][]> = {
  H: [[[0, 0], [0, 1]], [[0.6, 0], [0.6, 1]], [[0, 0.5], [0.6, 0.5]]],
  T: [[[0, 0], [0.6, 0]], [[0.3, 0], [0.3, 1]]],
  "?": [[[0.02, 0.22], [0.3, 0], [0.58, 0.22], [0.3, 0.52], [0.3, 0.7]], [[0.3, 0.93], [0.3, 1]]],
};
const txt = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  let cx = x;
  for (const ch of t) {
    if (ch === " ") { cx += h * 0.35; continue; }
    const g = LET[ch];
    if (g) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; g.forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); }); }
    else write(c, ch, cx, y, h, col, w);
    cx += h * 0.8;
  }
};
const tw = (t: string, h: number) => [...t].reduce((s, ch) => s + (ch === " " ? h * 0.35 : h * 0.8), 0) - h * 0.2;
const ctxt = (c: Ctx, t: string, cx: number, y: number, h: number, col: string = INK, w = 6) => txt(c, t, cx - tw(t, h) / 2, y, h, col, w);
// a sheet of paper lying flat, top-left corner at (x, y)
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x + 14, y + 16, w, h, 10), SH, 0); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6); };
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -14, len - 50, 28, 4), COL.yellow, 5);
  shape(c, () => rrect(c, -30, -15, 36, 30, 6), COL.pink, 5);
  shape(c, () => polyP(c, [[len - 50, -14], [len, 0], [len - 50, 14]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len - 16, -5], [len, 0], [len - 16, 5]]), INK, 0);
  c.restore();
};
const coin = (c: Ctx, x: number, y: number, r: number, face: string) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.3, -r * 0.25, 0.5);
  shape(c, () => ell(c, x, y, r * 0.7, r * 0.7), COL.yellow, 4);
  ctxt(c, face, x, y - r * 0.42, r * 0.84, INK, Math.max(4, r * 0.12));
};
// a coin tossed up: the coin spinning above a hand, a curved arrow round it
const flipping = (c: Ctx, x: number, y: number, r: number, face: string) => {
  coin(c, x, y, r, face);
  const pts: number[][] = []; for (let k = 0; k <= 12; k++) { const a = -2.6 + (k / 12) * 2.9; pts.push([x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]); }
  arrow(c, pts, RED, 8);
};
// a germ: round, spiky, two eyes (closed when it is a weakened, sleepy one)
const germ = (c: Ctx, x: number, y: number, r: number, col: string = COL.green, dk: string = COL.greenDk, sleepy = false) => {
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + 0.3, p: number[][] = [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35]];
    line(c, p, Math.max(6, r * 0.26), INK); line(c, p, Math.max(2, r * 0.12), col);
    shape(c, () => ell(c, p[1][0], p[1][1], r * 0.15, r * 0.15), col, Math.max(3, r * 0.07));
  }
  shape(c, () => ell(c, x, y, r, r), col, Math.max(4, r * 0.09));
  shade(c, () => ell(c, x, y, r, r), dk, -r * 0.3, -r * 0.22);
  for (const s of [-1, 1]) {
    if (sleepy) { c.beginPath(); c.arc(x + s * r * 0.33, y - r * 0.05, r * 0.16, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = Math.max(3, r * 0.07); c.stroke(); }
    else { shape(c, () => ell(c, x + s * r * 0.33, y - r * 0.1, r * 0.17, r * 0.2), WHITE, Math.max(2, r * 0.05)); shape(c, () => ell(c, x + s * r * 0.33, y - r * 0.07, r * 0.08, r * 0.1), INK, 0); }
  }
};
// a Y-shaped antibody, stem down, arms up; centre of the Y at (x, y)
const yShape = (c: Ctx, x: number, y: number, s: number, rot: number, col: string = COL.blue) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p: number[][][] = [[[0, s * 0.9], [0, 0], [-s * 0.6, -s * 0.8]], [[0, 0], [s * 0.6, -s * 0.8]]];
  p.forEach((q) => line(c, q, s * 0.46, INK)); p.forEach((q) => line(c, q, s * 0.24, col));
  c.restore();
};
// a B cell: a round cell with antibodies sticking out all round
const bcell = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 - Math.PI / 2; yShape(c, x + Math.cos(a) * r * 1.15, y + Math.sin(a) * r * 1.15, r * 0.3, a + Math.PI / 2); }
  shape(c, () => ell(c, x, y, r, r), "#d9b8e8", Math.max(4, r * 0.1));
  shade(c, () => ell(c, x, y, r, r), COL.purple, -r * 0.3, -r * 0.22, 0.45);
  shape(c, () => ell(c, x - r * 0.1, y + r * 0.05, r * 0.36, r * 0.32), COL.purple, Math.max(3, r * 0.07));
};
const shieldMark = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - s, y - s * 0.95); c.lineTo(x + s, y - s * 0.95); c.lineTo(x + s, y + s * 0.15); c.quadraticCurveTo(x + s, y + s * 0.85, x, y + s * 1.2); c.quadraticCurveTo(x - s, y + s * 0.85, x - s, y + s * 0.15); c.closePath(); };
  shape(c, p, COL.green, Math.max(3, s * 0.14)); shade(c, p, COL.greenDk, -s * 0.35, -s * 0.2);
  line(c, [[x - s * 0.45, y + s * 0.05], [x - s * 0.1, y + s * 0.4], [x + s * 0.5, y - s * 0.4]], Math.max(3, s * 0.17), WHITE);
};
// an n x n town grid, top-left at (x0, y0): "w" well, "r" sick (red), "g" shielded
type Cell = "w" | "r" | "g";
const grid = (c: Ctx, x0: number, y0: number, n: number, cell: number, st: (i: number) => Cell, numbered: boolean) => {
  for (let i = 0; i < n * n; i++) {
    const cx = x0 + (i % n) * cell, cy = y0 + Math.floor(i / n) * cell, s = st(i);
    shape(c, () => rrect(c, cx, cy, cell, cell, 2), s === "r" ? COL.red : WHITE, Math.max(3, cell * 0.03));
    if (s === "g") shieldMark(c, cx + cell / 2, cy + cell * (numbered ? 0.42 : 0.47), cell * 0.26);
    if (numbered) ctxt(c, String(i + 1), cx + cell / 2, cy + cell * (s === "g" ? 0.7 : 0.35), cell * (s === "g" ? 0.2 : 0.3), s === "r" ? WHITE : INK, Math.max(3, cell * 0.035));
  }
};
const town = (red: number[], green: number[]) => (i: number): Cell => (red.includes(i + 1) ? "r" : green.includes(i + 1) ? "g" : "w");
// a die, front face centred at (x, y), side s, showing `face` on the front
const die = (c: Ctx, x: number, y: number, s: number, face: number) => {
  const h = s / 2, k = s * 0.42;
  shadow(c, x + s * 0.25, y + h + 8, s * 0.75, s * 0.14);
  shape(c, () => polyP(c, [[x - h, y - h], [x - h + k, y - h - k], [x + h + k, y - h - k], [x + h, y - h]]), WHITE);
  shape(c, () => polyP(c, [[x + h, y - h], [x + h + k, y - h - k], [x + h + k, y + h - k], [x + h, y + h]]), COL.steel);
  shape(c, () => rrect(c, x - h, y - h, s, s, s * 0.08), WHITE);
  const P: Record<number, number[][]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  P[face].forEach(([u, v]) => shape(c, () => ell(c, x + u * s * 0.27, y + v * s * 0.27, s * 0.09, s * 0.09), INK, 0));
  shape(c, () => ell(c, x + k * 0.5 + s * 0.08, y - h - k * 0.5, s * 0.07, s * 0.045), INK, 0); shape(c, () => ell(c, x + k * 0.5 + s * 0.08 + s * 0.3, y - h - k * 0.5, s * 0.07, s * 0.045), INK, 0);
  shape(c, () => ell(c, x + h + k * 0.5, y - k * 0.5, s * 0.05, s * 0.08), INK, 0);
};
// a stopwatch showing a number of seconds
const timer = (c: Ctx, x: number, y: number, r: number, t: string) => {
  shadow(c, x + r * 0.1, y + r + 6, r * 0.8, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.16, y - r * 1.3, r * 0.32, r * 0.4, 5), COL.steelDk, 5);
  shape(c, () => rrect(c, x - r * 0.26, y - r * 1.42, r * 0.52, r * 0.16, 5), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel); shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.25, -r * 0.2);
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), WHITE, 5);
  ctxt(c, t, x, y - r * 0.3, r * 0.6, INK, Math.max(4, r * 0.09));
};
// a syringe pointing along angle an from its plunger end at (x, y); len is the whole length
const syringe = (c: Ctx, x: number, y: number, len: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -s * 0.8, s * 0.26, s * 1.6, 5), COL.steelDk, 5);
  shape(c, () => rrect(c, s * 0.2, -s * 0.2, len * 0.22, s * 0.4, 4), COL.steel, 5);
  shape(c, () => rrect(c, len * 0.22, -s * 0.9, s * 0.22, s * 1.8, 5), COL.steelDk, 5);
  shape(c, () => rrect(c, len * 0.24, -s * 0.5, len * 0.44, s, 8), WHITE, 6);
  shape(c, () => rrect(c, len * 0.3, -s * 0.5 + 6, len * 0.38, s - 12, 6), COL.sky, 0);
  shape(c, () => rrect(c, len * 0.3, -s * 0.5, s * 0.12, s, 2), COL.greyDk, 0);
  for (let k = 1; k < 6; k++) line(c, [[len * 0.3 + k * len * 0.06, -s * 0.5], [len * 0.3 + k * len * 0.06, -s * 0.15]], 3, INK);
  shape(c, () => polyP(c, [[len * 0.68, -s * 0.3], [len * 0.76, -s * 0.12], [len * 0.76, s * 0.12], [len * 0.68, s * 0.3]]), COL.steel, 5);
  line(c, [[len * 0.76, 0], [len, 0]], 10, INK); line(c, [[len * 0.76, 0], [len, 0]], 4, COL.steel);
  c.restore();
};
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.4); c.quadraticCurveTo(x + r * 0.9, y - r * 0.2, x + r * 0.9, y + r * 0.2); c.arc(x, y + r * 0.2, r * 0.9, 0, Math.PI); c.quadraticCurveTo(x - r * 0.9, y - r * 0.2, x, y - r * 1.4); c.closePath(); }, COL.water, 5);
const tick = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.9]], s * 0.5, INK); line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.9]], s * 0.26, COL.green); };

// ---------------------------------------------------------------- set-up cards: the Key Shop (e1)
// 1. flip the coin three times to give the germ a code; write it on a card
const e1s0 = (c: Ctx) => {
  ground(c);
  sheet(c, 520, 290, 460, 340);
  germ(c, 600, 370, 40);
  ctxt(c, "H T H", 760, 470, 110, INK, 9);
  hand(c, 230, 760, -0.3, 1.8, SKIN.child, CLOTH.child, true);
  flipping(c, 400, 430, 70, "H");
  arrow(c, [[410, 640], [405, 560]], RED, 8);
};
// 2. the list of all eight codes, HHH to TTT
const e1s1 = (c: Ctx) => {
  ground(c);
  sheet(c, 250, 80, 580, 920);
  const codes = ["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"];
  codes.forEach((k, i) => { const y = 130 + i * 88; write(c, String(i + 1), 310, y + 12, 40, COL.greyDk, 5); txt(c, k, 400, y, 60, INK, 7); });
  shape(c, () => ell(c, 700, 905, 52, 52), WHITE, 6); ctxt(c, "8", 700, 875, 64, RED, 8);
};
// 3. make a defender cell: three flips, written under its own column
const e1s2 = (c: Ctx) => {
  ground(c);
  sheet(c, 430, 110, 570, 860);
  const cols = ["TTH", "HHT", "HT"];
  cols.forEach((k, i) => { const cx = 490 + i * 180; bcell(c, cx + 46, 210, 32); write(c, String(i + 1), cx + 112, 180, 48, INK, 6); line(c, [[cx + 10, 290], [cx + 170, 290]], 4, COL.greyDk); txt(c, k, cx + 18, 320, 54, INK, 6); });
  pencil(c, 1003, 573, 200, -1.84);
  hand(c, 110, 850, -0.5, 1.4, SKIN.child, CLOTH.child, true);
  flipping(c, 250, 560, 52, "T");
  arrow(c, [[248, 740], [246, 680]], RED, 7);
};
// 4. the results table: how many cells each round took, for codes of two, three and four flips
const e1s3 = (c: Ctx) => {
  ground(c);
  sheet(c, 90, 150, 900, 740);
  const x0 = 120, y0 = 200, rh = 160, cw = [210, 190, 190, 190];
  const xs = [x0]; cw.forEach((w) => xs.push(xs[xs.length - 1] + w));
  for (let r = 0; r <= 4; r++) line(c, [[x0, y0 + (r ? 100 + (r - 1) * rh : 0)], [xs[4], y0 + (r ? 100 + (r - 1) * rh : 0)]], 4);
  xs.forEach((x) => line(c, [[x, y0], [x, y0 + 100 + 3 * rh]], 4));
  for (let k = 0; k < 3; k++) { const cx = (xs[k + 1] + xs[k + 2]) / 2; shape(c, () => ell(c, cx, y0 + 50, 34, 34), COL.sky, 5); ctxt(c, String(k + 1), cx, y0 + 28, 44, INK, 6); }
  const rows = [[2, "3", "6", "2"], [3, "11", "5", "9"], [4, "20", "14", "17"]] as const;
  rows.forEach(([n, ...v], r) => {
    const cy = y0 + 100 + r * rh + rh / 2;
    for (let k = 0; k < n; k++) coin(c, x0 + 40 + k * 46, cy, 22, k % 2 ? "T" : "H");
    v.forEach((t, k) => ctxt(c, t, (xs[k + 1] + xs[k + 2]) / 2, cy - 36, 72, INK, 7));
  });
};

// ---------------------------------------------------------------- set-up cards: Spread and Shield (e2)
// 1. a 5 x 5 grid numbered 1 to 25, square 13 red
const e2s0 = (c: Ctx) => { ground(c); sheet(c, 140, 110, 800, 860); grid(c, 215, 170, 5, 140, town([13], []), true); };
// 2. draw a numbered slip from the bowl; mark that square with a shield
const e2s1 = (c: Ctx) => {
  ground(c);
  sheet(c, 440, 110, 560, 580); grid(c, 470, 140, 5, 100, town([13], [7]), true);
  bowl(c, 230, 790, 150);
  for (let k = 0; k < 5; k++) { const x = 130 + k * 50, y = 775 + (k % 2) * 10; shape(c, () => rrect(c, x - 26, y - 16, 52, 32, 3), WHITE, 4); }
  hand(c, 150, 560, -0.95, 1.4, SKIN.child, CLOTH.child);
  c.save(); c.translate(150 + Math.cos(-0.95) * 98, 560 + Math.sin(-0.95) * 98); c.rotate(-0.95);
  shape(c, () => rrect(c, -40, -58, 80, 116, 4), WHITE, 5); ctxt(c, "7", 0, -27, 54, INK, 6); c.restore();
  arrow(c, [[300, 400], [560, 300]], RED, 9);
};
// 3. for each neighbour of a sick square, roll the die
const e2s2 = (c: Ctx) => {
  ground(c);
  sheet(c, 110, 90, 860, 900);
  const cx = 470, cy = 470, s = 160;
  const sq = (x: number, y: number, red: boolean, n: string) => { shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 3), red ? COL.red : WHITE, 5); ctxt(c, n, x, y - 22, 44, red ? WHITE : INK, 5); };
  sq(cx, cy - s, false, "8"); sq(cx - s, cy, false, "12"); sq(cx + s, cy, false, "14"); sq(cx, cy + s, false, "18"); sq(cx, cy, true, "13");
  arrow(c, [[cx, cy - 50], [cx, cy - s + 50]], RED, 9); arrow(c, [[cx, cy + 50], [cx, cy + s - 50]], RED, 9);
  arrow(c, [[cx - 50, cy], [cx - s + 50, cy]], RED, 9); arrow(c, [[cx + 50, cy], [cx + s - 50, cy]], RED, 9);
  die(c, 820, 800, 130, 3);
};
// 4. the finished town: many sick squares, a few shields, a few lucky well squares
const e2s3 = (c: Ctx) => {
  ground(c); sheet(c, 140, 110, 800, 860);
  grid(c, 215, 170, 5, 140, town([2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 22, 23, 24], [4, 7, 16, 20]), true);
};

// ---------------------------------------------------------------- flow pictures
// the Key Shop: the germ's code at the top; random cells below; the fourth one fits
const flowE1 = (c: Ctx) => {
  ground(c);
  coin(c, 150, 190, 60, "H");
  sheet(c, 330, 70, 440, 240); germ(c, 420, 190, 52); ctxt(c, "HTH", 610, 145, 96, INK, 8);
  const codes = ["TTH", "HHT", "THT", "HTH"];
  codes.forEach((k, i) => { const x = 70 + i * 250; sheet(c, x, 520, 210, 320); bcell(c, x + 105, 630, 46); ctxt(c, k, x + 105, 740, 54, INK, 6); });
  c.setLineDash([16, 14]); line(c, [[600, 330], [700, 420], [850, 500]], 6, COL.greyDk); c.setLineDash([]);
  tick(c, 925, 540, 40);
  for (let i = 0; i < 3; i++) line(c, [[110 + i * 250, 600], [240 + i * 250, 760]], 10, RED);
};
// Spread and Shield: three towns, no shields, 8 shields, 16 shields
const flowE2 = (c: Ctx) => {
  ground(c);
  germ(c, 540, 150, 60, COL.red, "#b23a2b");
  const towns: [number[], number[], string][] = [
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24], [], "0"],
    [[13, 8, 12, 14, 18, 3, 7, 4, 17, 23], [2, 6, 9, 11, 15, 19, 22, 24], "8"],
    [[13, 8, 12], [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25, 2, 4, 22, 24], "16"],
  ];
  towns.forEach(([r, g, n], i) => {
    const x0 = 60 + i * 350; sheet(c, x0 - 20, 290, 300, 300); grid(c, x0, 310, 5, 52, town(r, g), false);
    shieldMark(c, x0 + 90, 690, 34); ctxt(c, n, x0 + 180, 660, 64, INK, 7);
  });
};
// Read the vaccination card: parent and child on the floor, the card open between them
const flowA1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d5b8"; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 5, "#d1bf9d");
  // the open card: two pages with rows of dates
  shape(c, () => rrect(c, 428, 690, 236, 160, 6), SH, 0);
  shape(c, () => rrect(c, 420, 680, 220, 150, 6), COL.paper, 5); line(c, [[530, 680], [530, 830]], 4);
  for (let r = 0; r < 5; r++) { const y = 705 + r * 26; line(c, [[435, y], [518, y]], 3, COL.greyDk); write(c, String(r * 3 + 2), 545, y - 8, 16, INK, 3); write(c, String(r * 2 + 7), 590, y - 8, 16, INK, 3); }
  person(c, 300, 830, 440, { sit: true, dir: 1, reachR: [450, 745] });
  person(c, 800, 830, 560, { sit: true, dir: -1, adult: true, reachL: [610, 735] });
};
// Faster the second time: the same six scrambled words, two stopwatches
const flowA2 = (c: Ctx) => {
  ground(c);
  const tiles = (x0: number, y0: number, neat: boolean, seedN: number) => {
    const cols = [COL.sky, COL.yellow, COL.pink, COL.greenLt, COL.orange];
    for (let r = 0; r < 6; r++) for (let k = 0; k < 5; k++) {
      const j = neat ? 0 : Math.sin(seedN + r * 7 + k * 3) * 10, rot = neat ? 0 : Math.sin(seedN * 3 + r + k * 5) * 0.35;
      c.save(); c.translate(x0 + 32 + k * 62, y0 + 32 + r * 74 + j); c.rotate(rot); shape(c, () => rrect(c, -22, -22, 44, 44, 5), cols[(r + k * 2 + (neat ? 0 : 3)) % 5], 4); c.restore();
    }
  };
  sheet(c, 70, 260, 400, 540); tiles(108, 300, false, 2);
  sheet(c, 610, 260, 400, 540); tiles(648, 300, true, 5);
  timer(c, 270, 150, 78, "95"); timer(c, 810, 150, 78, "40");
  arrow(c, [[495, 530], [585, 530]], RED, 10);
  tick(c, 940, 760, 30);
  pencil(c, 560, 900, 220, -0.35);
};
// Find your lymph nodes: the drawing the child makes, a neck with dots where the nodes were felt
const flowA3 = (c: Ctx) => {
  ground(c);
  sheet(c, 150, 70, 780, 940);
  const x = 540, hy = 330;
  // a pencil sketch of head, neck and shoulders
  shape(c, () => { c.moveTo(x - 220, 760); c.quadraticCurveTo(x - 200, 640, x - 60, 610); c.lineTo(x - 60, 540); c.lineTo(x + 60, 540); c.lineTo(x + 60, 610); c.quadraticCurveTo(x + 200, 640, x + 220, 760); c.lineTo(x + 240, 920); c.lineTo(x - 240, 920); c.closePath(); }, COL.paper, 5);
  shape(c, () => ell(c, x, hy, 150, 180), COL.paper, 5);
  shape(c, () => ell(c, x - 165, hy + 20, 20, 36), COL.paper, 4); shape(c, () => ell(c, x + 165, hy + 20, 20, 36), COL.paper, 4);
  // the dots: under the jaw, behind the ear, in the armpit
  const dot = (dx: number, dy: number) => shape(c, () => ell(c, dx, dy, 16, 16), COL.green, 4);
  dot(x - 80, 500); dot(x - 50, 520); dot(x + 80, 500); dot(x + 50, 520);
  dot(x - 190, hy + 60); dot(x + 190, hy + 60);
  dot(x - 160, 790); dot(x + 160, 790);
  pencil(c, 990, 1010, 210, -1.5);
};
// Once or again? the child asks a grown-up, notebook in hand
const flowA4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d5b8"; c.fillRect(0, 960, 1080, 120); line(c, [[0, 960], [1080, 960]], 5, "#d1bf9d");
  const h = person(c, 330, 960, 480, { dir: 1, reachL: [210, 752] });
  const [nx, ny] = h.handL;
  shape(c, () => rrect(c, nx - 150, ny - 190, 170, 200, 6), COL.paper, 5); line(c, [[nx - 150, ny - 150], [nx + 20, ny - 150]], 4, INK);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) line(c, [[nx - 130 + k * 14, ny - 130 + r * 40], [nx - 130 + k * 14, ny - 100 + r * 40]], 3, INK);
  for (let r = 0; r < 3; r++) line(c, [[nx - 60, ny - 130 + r * 40], [nx - 50 + (r % 2) * 20, ny - 100 + r * 40]], 3, INK);
  person(c, 760, 960, 600, { dir: -1, adult: true });
  // the question, and the answer: once
  shape(c, () => { c.moveTo(420, 470); c.quadraticCurveTo(420, 400, 490, 400); c.lineTo(560, 400); c.quadraticCurveTo(630, 400, 630, 470); c.quadraticCurveTo(630, 540, 560, 540); c.lineTo(500, 540); c.lineTo(440, 580); c.lineTo(460, 540); c.quadraticCurveTo(420, 540, 420, 470); c.closePath(); }, WHITE, 5);
  ctxt(c, "?", 525, 432, 80, INK, 8);
};
// Paper keys: three germs with notches, three antibodies, the middle one fits
const flowA5 = (c: Ctx) => {
  ground(c);
  const kinds = ["tri", "round", "square"];
  kinds.forEach((k, i) => {
    const cx = 210 + i * 330, bot = 380;
    const card = () => {
      c.moveTo(cx - 100, 140); c.lineTo(cx + 100, 140); c.lineTo(cx + 100, bot); c.lineTo(cx + 40, bot);
      if (k === "tri") c.lineTo(cx, bot - 60); else if (k === "round") c.arc(cx, bot, 40, 0, Math.PI, true); else { c.lineTo(cx + 40, bot - 60); c.lineTo(cx - 40, bot - 60); }
      c.lineTo(cx - 40, bot); c.lineTo(cx - 100, bot); c.closePath();
    };
    shape(c, () => { c.save(); c.translate(12, 14); card(); c.restore(); }, SH, 0);
    shape(c, card, COL.greenLt, 6);
    germ(c, cx, 230, 40);
    const T = i === 1 ? bot : bot + 90;
    const key = () => {
      c.moveTo(cx - 28, T); c.lineTo(cx - 36, T);
      if (k === "tri") c.lineTo(cx, T - 56); else if (k === "round") c.arc(cx, T, 36, Math.PI, Math.PI * 2, false); else { c.lineTo(cx - 36, T - 56); c.lineTo(cx + 36, T - 56); }
      c.lineTo(cx + 36, T); c.lineTo(cx + 28, T); c.lineTo(cx + 28, T + 110); c.lineTo(cx + 84, T + 200); c.lineTo(cx + 44, T + 224); c.lineTo(cx, T + 150); c.lineTo(cx - 44, T + 224); c.lineTo(cx - 84, T + 200); c.lineTo(cx - 28, T + 110); c.closePath();
    };
    shape(c, () => { c.save(); c.translate(12, 14); key(); c.restore(); }, SH, 0);
    shape(c, key, COL.blue, 6);
    if (i !== 1) arrow(c, [[cx + 120, T + 40], [cx + 120, T - 70]], RED, 8);
  });
  tick(c, 540, 700, 34);
};
// the smallpox timeline poster, the child pointing at the last box
const flowP1 = (c: Ctx) => {
  ground(c);
  sheet(c, 70, 100, 940, 440);
  line(c, [[120, 330], [980, 330]], 7);
  const box = (x: number, y: number, label: string) => { shape(c, () => rrect(c, x - 85, y - 75, 170, 150, 6), WHITE, 5); line(c, [[x, y > 330 ? y - 75 : y + 75], [x, 330]], 5); ctxt(c, label, x, y > 330 ? 290 : 345, 30, INK, 4); };
  box(190, 215, "1796"); box(402, 445, "1853"); box(880, 215, "1980");
  // a brown cow with a white star
  shape(c, () => ell(c, 180, 225, 58, 34), COL.brown, 5); shape(c, () => ell(c, 235, 205, 24, 22), COL.brown, 5);
  shape(c, () => polyP(c, [[235, 190], [228, 200], [242, 200]]), WHITE, 2); line(c, [[224, 186], [218, 174]], 4); line(c, [[246, 186], [252, 174]], 4);
  for (const lx of [150, 170, 195, 215]) line(c, [[lx, 250], [lx, 278]], 7);
  line(c, [[122, 225], [110, 255]], 4);
  syringe(c, 340, 470, 130, -0.4, 22);
  shape(c, () => ell(c, 880, 215, 50, 50), COL.sky, 5);
  shape(c, () => { c.moveTo(850, 195); c.quadraticCurveTo(875, 180, 890, 200); c.quadraticCurveTo(880, 225, 860, 220); c.closePath(); }, COL.green, 3);
  shape(c, () => { c.moveTo(895, 235); c.quadraticCurveTo(915, 225, 920, 245); c.quadraticCurveTo(905, 258, 892, 250); c.closePath(); }, COL.green, 3);
  tick(c, 915, 180, 22);
  person(c, 230, 1000, 460, { dir: 1, reachR: [880, 300] });
};

// ---------------------------------------------------------------- term cards
// Vaccine: a syringe, a drop, and inside the drop a weakened, sleepy germ
const termVaccine = (c: Ctx) => {
  ground(c);
  syringe(c, 140, 820, 660, -0.55, 70);
  const tx = 140 + Math.cos(-0.55) * 660, ty = 820 + Math.sin(-0.55) * 660;
  drop(c, tx, ty + 46, 34);
  line(c, [[tx + 28, ty + 30], [770, 300]], 4, COL.greyDk); line(c, [[tx + 28, ty + 70], [950, 440]], 4, COL.greyDk);
  shadow(c, 860, 320, 150, 150);
  shape(c, () => ell(c, 850, 300, 150, 150), COL.sky, 8);
  germ(c, 850, 300, 64, COL.green, COL.greenDk, true);
  const z = (zx: number, zy: number, zs: number) => line(c, [[zx, zy], [zx + zs, zy], [zx, zy + zs], [zx + zs, zy + zs]], 5, INK);
  z(750, 190, 22); z(775, 218, 16);
};
// Herd protection: a crowd where most wear a green shield; the two without are surrounded
const termHerd = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d5b8"; c.fillRect(0, 1000, 1080, 80);
  const rows: [number, number, number, boolean, number[]][] = [
    [600, 250, 4, true, [210, 430, 650, 870]],
    [800, 290, 3, false, [320, 540, 760]],
    [1000, 320, 4, false, [200, 440, 680, 920]],
  ];
  const bare = new Set(["600-430", "800-540"]);
  rows.forEach(([y, h, , adult, xs]) => xs.forEach((x) => {
    person(c, x, y, h, { adult, dir: x < 540 ? 1 : -1 });
    const sh = y - (adult ? 0.76 : 0.67) * h;
    if (!bare.has(`${y}-${x}`)) shieldMark(c, x, sh + h * 0.14, h * 0.075);
  }));
  germ(c, 78, 470, 38, COL.red, "#b23a2b"); germ(c, 1015, 480, 34, COL.red, "#b23a2b");
  for (const a of [-0.6, 0, 0.6]) { line(c, [[136 + Math.cos(a) * 4, 460 + Math.sin(a) * 4], [136 + Math.cos(a) * 22, 460 + Math.sin(a) * 22]], 5, RED); line(c, [[952 - Math.cos(a) * 4, 465 + Math.sin(a) * 4], [952 - Math.cos(a) * 22, 465 + Math.sin(a) * 22]], 5, RED); }
};

export const ic_bodyImmuneSystemL4 = cards("sci.body.immune-system.L4", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, termVaccine, termHerd,
]);
