import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, hand, write, cards } from "./flatKit";

// CHEMICAL BONDS (L3) · fill cards: cover, main idea, three experiments and the molecule book.

// a pencil sharpened at both ends, tip at (x1, y1), top at (x2, y2); a wire wrapped round the top
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 44) => {
  const an = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), tip = w * 1.6;
  c.save(); c.translate(x1, y1); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [tip, -w / 2], [tip, w / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[0, 0], [tip * 0.45, -w * 0.22], [tip * 0.45, w * 0.22]]), COL.black, 4);
  shape(c, () => { c.rect(tip, -w / 2, L - tip * 1.7, w); }, COL.yellow, 5);
  c.fillStyle = COL.orange; c.fillRect(tip + 2, w * 0.15, L - tip * 1.7 - 4, w * 0.3);
  shape(c, () => polyP(c, [[L - tip * 0.7, -w / 2], [L, -w * 0.2], [L, w * 0.2], [L - tip * 0.7, w / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[L - tip * 0.25, -w * 0.2], [L, -w * 0.2], [L, w * 0.2], [L - tip * 0.25, w * 0.2]]), COL.black, 3);
  c.restore();
};
// a wire from (x1, y1) to (x2, y2) bowing through (mx, my)
const wire = (c: Ctx, x1: number, y1: number, mx: number, my: number, x2: number, y2: number, col: string) => {
  const p = () => { c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(mx, my, x2, y2); };
  p(); c.strokeStyle = INK; c.lineWidth = 16; c.lineCap = "round"; c.stroke(); p(); c.strokeStyle = col; c.lineWidth = 8; c.stroke();
};
// a 9-volt battery standing with its bottom centre at (x, y)
const battery = (c: Ctx, x: number, y: number, w = 150, h = 240) => {
  shadow(c, x + 14, y + 8, w * 0.75, w * 0.14);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 14), COL.black);
  shade(c, () => rrect(c, x - w / 2, y - h, w, h, 14), "#1c1922", w * 0.3, 0);
  c.fillStyle = COL.yellow; c.fillRect(x - w / 2 + 6, y - h * 0.62, w - 12, h * 0.26);
  write(c, "9", x - w * 0.1, y - h * 0.58, h * 0.18, INK, 7);
  shape(c, () => rrect(c, x - w * 0.34, y - h - 26, w * 0.24, 30, 6), COL.steel, 5);
  shape(c, () => ell(c, x + w * 0.24, y - h - 14, w * 0.14, w * 0.14), COL.steel, 5);
};
// a stream of bubbles rising from (x, y) up to yTop; n bubbles
const bubbles = (c: Ctx, x: number, y: number, yTop: number, n: number, seed: number) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, by = y - (y - yTop) * t, bx = x + Math.sin(t * 9 + seed) * 22 + (r() - 0.5) * 30, br = 7 + t * 9 + r() * 4; shape(c, () => ell(c, bx, by, br, br), COL.drop, 3.5); }
};
// a round atom with a shade side
const atom = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  shape(c, () => ell(c, x, y, r, r), col, 7);
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.3, r * 0.22);
  shine(c, [[x - r * 0.55, y - r * 0.45], [x - r * 0.3, y - r * 0.62]], r * 0.14);
};
const bond = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 34) => { line(c, [[x1, y1], [x2, y2]], w + 12, INK); line(c, [[x1, y1], [x2, y2]], w, COL.grey); };

// intro: a glass of water, two pencils, a battery, bubbles from both tips
const intro = (c: Ctx) => {
  ground(c);
  glass(c, 480, 860, 400, 560, 0.74);
  pencil(c, 400, 790, 330, 230); pencil(c, 560, 790, 630, 230);
  bubbles(c, 400, 770, 460, 9, 3); bubbles(c, 560, 770, 460, 9, 4);
  battery(c, 880, 860);
  wire(c, 330, 250, 460, 60, 830, 600, RED); wire(c, 630, 250, 760, 150, 920, 606, INK);
};

// summary: one water molecule, big: two hydrogens held to one oxygen, with the shared electrons
const summary = (c: Ctx) => {
  ground(c);
  const ox = 540, oy = 470, hs: number[][] = [[300, 680], [780, 680]];
  shadow(c, 560, 850, 330, 40);
  hs.forEach(([hx, hy]) => bond(c, ox, oy, hx, hy));
  atom(c, ox, oy, 190, COL.red, "#b23a28");
  hs.forEach(([hx, hy]) => atom(c, hx, hy, 118, WHITE, COL.steel));
  hs.forEach(([hx, hy]) => { const mx = (ox + hx) / 2, my = (oy + hy) / 2, nx = (hy - oy), ny = -(hx - ox), l = Math.hypot(nx, ny); for (const s of [-1, 1]) shape(c, () => ell(c, mx + (nx / l) * 16 * s, my + (ny / l) * 16 * s, 11, 11), COL.yellow, 4); });
};

// e1: under the water, the two pencil tips: bubbles from both, twice as many from one
const e1 = (c: Ctx) => {
  ground(c, COL.water);
  c.fillStyle = BG; c.fillRect(0, 0, D, 150);
  shape(c, () => { c.moveTo(-10, 150); c.quadraticCurveTo(270, 125, 540, 150); c.quadraticCurveTo(810, 175, 1090, 150); c.lineTo(1090, 200); c.lineTo(-10, 200); c.closePath(); }, COL.water, 0);
  line(c, [[-10, 150], [270, 125], [540, 150], [810, 175], [1090, 150]], 7, INK);
  pencil(c, 300, 820, 200, -60, 70); pencil(c, 780, 820, 880, -60, 70);
  bubbles(c, 300, 790, 200, 16, 11); bubbles(c, 330, 760, 220, 14, 12); bubbles(c, 780, 790, 220, 8, 13);
  arrow(c, [[150, 700], [150, 300]], RED, 12); arrow(c, [[930, 700], [930, 300]], RED, 12);
  write(c, "2", 90, 720, 90, INK, 9); write(c, "1", 880, 720, 90, INK, 9);
};

// e2: a grown-up heats wax and sugar on two spoons over a candle; the wax melts clear, the sugar turns brown
const spoon = (c: Ctx, x: number, y: number, dir: number, stuff: string, dk: string, bubbly: boolean) => {
  line(c, [[x + dir * 210, y + 30], [x + dir * 60, y + 8]], 26, INK); line(c, [[x + dir * 210, y + 30], [x + dir * 60, y + 8]], 16, COL.steel);
  hand(c, x + dir * 150, y + 30, dir > 0 ? Math.PI : 0, 1.1, SKIN.adult, CLOTH.adult);
  shape(c, () => ell(c, x, y, 110, 46), COL.steel, 6);
  shape(c, () => ell(c, x, y + 4, 88, 32), stuff, 4);
  shade(c, () => ell(c, x, y + 4, 88, 32), dk, 20, 8, 0.4);
  if (bubbly) for (const [bx, by] of [[-40, 0], [10, -8], [45, 6], [-10, 12]]) shape(c, () => ell(c, x + bx, y + 4 + by, 9, 7), dk, 3);
};
const e2 = (c: Ctx) => {
  ground(c);
  // the candle on a steel plate
  shadow(c, 560, 960, 150, 24);
  shape(c, () => ell(c, 540, 950, 150, 32), COL.steel, 6);
  shape(c, () => rrect(c, 490, 700, 100, 250, 12), COL.paper);
  shade(c, () => rrect(c, 490, 700, 100, 250, 12), COL.grey, 30, 0, 0.45);
  shape(c, () => ell(c, 540, 700, 50, 12), COL.cloth, 5);
  line(c, [[540, 700], [540, 650]], 6, INK);
  shape(c, () => { c.moveTo(540, 540); c.quadraticCurveTo(610, 620, 540, 672); c.quadraticCurveTo(470, 620, 540, 540); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(540, 590); c.quadraticCurveTo(575, 635, 540, 665); c.quadraticCurveTo(505, 635, 540, 590); c.closePath(); }, COL.yellow, 0);
  arrow(c, [[460, 560], [360, 470]], RED, 9); arrow(c, [[620, 560], [720, 470]], RED, 9);
  spoon(c, 270, 430, -1, "#f3eedd", COL.grey, false);
  spoon(c, 810, 430, 1, COL.brown, COL.soilDk, true);
  // a little smoke over the sugar
  c.globalAlpha = 0.6; line(c, [[800, 360], [820, 320], [795, 280], [815, 240]], 7, COL.greyDk); c.globalAlpha = 1;
};

// e3: three glasses with pencils and the battery: plain water, sugar water, soda water; soda water bubbles most
const e3 = (c: Ctx) => {
  ground(c);
  const xs = [200, 540, 880];
  xs.forEach((x, i) => {
    glass(c, x, 760, 230, 330, 0.72);
    pencil(c, x - 42, 720, x - 70, 380, 26); pencil(c, x + 42, 720, x + 70, 380, 26);
    const n = i === 2 ? 12 : 3;
    bubbles(c, x - 42, 700, 530, n, 21 + i); bubbles(c, x + 42, 700, 530, Math.max(2, n - 3), 31 + i);
  });
  arrow(c, [[1030, 700], [1030, 480]], RED, 11);
  // what went in: nothing, sugar cubes, a katori of cooking soda
  const cube = (x: number, y: number) => { shape(c, () => rrect(c, x, y, 54, 46, 6), WHITE, 5); shape(c, () => polyP(c, [[x, y], [x + 14, y - 14], [x + 68, y - 14], [x + 54, y]]), COL.steelIn, 4); shape(c, () => polyP(c, [[x + 54, y], [x + 68, y - 14], [x + 68, y + 32], [x + 54, y + 46]]), COL.steel, 4); };
  cube(470, 880); cube(540, 880); cube(505, 840);
  bowl(c, 880, 870, 90, WHITE);
  shape(c, () => ell(c, 880, 862, 70, 24), WHITE, 0);
  shape(c, () => { c.moveTo(820, 866); c.quadraticCurveTo(880, 810, 940, 866); c.closePath(); }, WHITE, 5);
  write(c, "1", 170, 820, 90, INK, 9); write(c, "2", 400, 820, 90, INK, 9); write(c, "3", 740, 820, 90, INK, 9);
};

// p1: the finished molecule book, open, with the chana-and-moong models in front of it
const p1 = (c: Ctx) => {
  ground(c);
  // the open book
  shadow(c, 560, 600, 430, 40);
  for (const s of [-1, 1]) {
    shape(c, () => { c.moveTo(540, 220); c.quadraticCurveTo(540 + s * 200, 190, 540 + s * 400, 230); c.lineTo(540 + s * 400, 600); c.quadraticCurveTo(540 + s * 200, 560, 540, 600); c.closePath(); }, COL.paper, 6);
    for (let k = 0; k < 4; k++) line(c, [[540 + s * 90, 300 + k * 70], [540 + s * 330, 310 + k * 70]], 5, COL.grey);
  }
  line(c, [[540, 220], [540, 600]], 6, INK);
  // drawings on the pages: a water molecule left, an oxygen pair right
  bond(c, 300, 390, 230, 450, 14); bond(c, 300, 390, 370, 450, 14);
  atom(c, 300, 390, 40, COL.red, "#b23a28"); atom(c, 230, 450, 26, WHITE, COL.steel); atom(c, 370, 450, 26, WHITE, COL.steel);
  bond(c, 700, 420, 820, 420, 14); atom(c, 700, 420, 40, COL.red, "#b23a28"); atom(c, 820, 420, 40, COL.red, "#b23a28");
  // the models: methane big in front, ammonia and a peroxide to its sides
  const pick = (x1: number, y1: number, x2: number, y2: number) => { line(c, [[x1, y1], [x2, y2]], 14, INK); line(c, [[x1, y1], [x2, y2]], 7, COL.wood); };
  const chana = (x: number, y: number, r: number) => atom(c, x, y, r, COL.brown, COL.soilDk);
  const moong = (x: number, y: number, r: number) => atom(c, x, y, r, COL.greenLt, COL.green);
  shadow(c, 560, 985, 150, 22); shadow(c, 190, 930, 110, 18); shadow(c, 920, 930, 110, 18);
  // ammonia: one chana, three moong
  [[90, 900], [190, 940], [290, 900]].forEach(([x, y]) => pick(190, 800, x, y)); [[90, 900], [190, 940], [290, 900]].forEach(([x, y]) => moong(x, y, 36)); chana(190, 800, 62);
  // hydrogen peroxide: two chana, two moong
  pick(860, 850, 980, 850); pick(860, 850, 800, 940); pick(980, 850, 1040, 760); moong(800, 940, 34); moong(1040, 760, 34); chana(860, 850, 56); chana(980, 850, 56);
  // methane: one chana, four moong
  [[400, 760], [700, 780], [440, 980], [680, 970]].forEach(([x, y]) => pick(560, 850, x, y)); [[400, 760], [700, 780], [440, 980], [680, 970]].forEach(([x, y]) => moong(x, y, 46)); chana(560, 850, 86);
};

export const ic_chemistryBondsL3Fill = cards("sci.chemistry.bonds.L3 fill", [intro, summary, e1, e2, e3, p1]);
