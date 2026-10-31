import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, shine, line, arrow, hand, person, write, cards } from "./flatKit";

// SU LIGHT TRANSPARENT / OPAQUE · set-up cards for sci.light.transparent-opaque.L3
const TABLE = "#e3cfa6", TABLE_DK = "#cdb47f", BUTTER = "rgba(255,246,214,0.62)", PAPER = "#fffdf6";

const GL: Record<string, number[][][]> = {
  L: [[[0.05, 0], [0.05, 1], [0.85, 1]]], I: [[[0.15, 0], [0.75, 0]], [[0.45, 0], [0.45, 1]], [[0.15, 1], [0.75, 1]]],
  G: [[[0.9, 0.15], [0.5, 0], [0.1, 0.2], [0, 0.5], [0.1, 0.8], [0.5, 1], [0.9, 0.85], [0.9, 0.55], [0.5, 0.55]]],
  H: [[[0.05, 0], [0.05, 1]], [[0.8, 0], [0.8, 1]], [[0.05, 0.5], [0.8, 0.5]]], T: [[[0, 0], [0.9, 0]], [[0.45, 0], [0.45, 1]]],
  E: [[[0.8, 0], [0.05, 0], [0.05, 1], [0.8, 1]], [[0.05, 0.5], [0.6, 0.5]]], F: [[[0.8, 0], [0.05, 0], [0.05, 1]], [[0.05, 0.5], [0.6, 0.5]]],
  O: [[[0.4, 0], [0.8, 0.2], [0.85, 0.5], [0.8, 0.8], [0.4, 1], [0, 0.8], [0, 0.5], [0, 0.2], [0.4, 0]]],
  P: [[[0.05, 1], [0.05, 0], [0.7, 0], [0.85, 0.25], [0.7, 0.5], [0.05, 0.5]]],
};
// one letter of the alphabet as bold strokes, box top-left (x, y), height h
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, w = h * 0.2, col = INK) => {
  GL[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h * 0.8, y + v * h]), w, col));
};

// the card with big letters on it (flat, seen from above), centre (cx, cy)
const letterCard = (c: Ctx, x: number, y: number, w: number, h: number, blur = false) => {
  shadow(c, x + w / 2 + 16, y + h + 8, w / 2, h * 0.09);
  shape(c, () => rrect(c, x, y, w, h, 14), WHITE, 6);
  const lh = h * 0.46, step = w / 5.3;
  [..."LIGHT"].forEach((ch, i) => {
    const lx = x + w * 0.07 + i * step, ly = y + h * 0.27;
    if (blur) { c.globalAlpha = 0.16; for (const [dx, dy] of [[-9, -6], [9, -6], [-9, 7], [9, 7], [0, 0]]) letter(c, ch, lx + dx, ly + dy, lh, lh * 0.22, COL.greyDk); c.globalAlpha = 1; }
    else letter(c, ch, lx, ly, lh);
  });
};

// a wooden ruler standing upright, base at (x, y), height len, cm every cm px, numbers on the left
const rulerUp = (c: Ctx, x: number, y: number, len: number, cm: number, w = 60, nums = true) => {
  shape(c, () => rrect(c, x - w / 2, y - len, w, len, 6), COL.wood, 6);
  shade(c, () => rrect(c, x - w / 2, y - len, w, len, 6), COL.woodDk, w * 0.3, 0, 0.5);
  for (let i = 0; i * cm < len - 20; i++) {
    const ty = y - i * cm;
    line(c, [[x - w / 2, ty], [x - w / 2 + (i % 2 ? w * 0.28 : w * 0.45), ty]], 4);
    for (let k = 1; k < 4; k++) if ((i + 1) * cm < len - 14) line(c, [[x - w / 2, ty - k * cm / 4], [x - w / 2 + w * 0.18, ty - k * cm / 4]], 2.5);
    if (nums && i > 0 && i * cm < len - 40) write(c, String(i), x + 4, ty - 15, 22, INK, 4);
  }
};

const drop = (c: Ctx, x: number, y: number, s: number, col: string, cross = false) => {
  shape(c, () => { c.moveTo(x, y - s * 1.1); c.bezierCurveTo(x + s * 0.95, y + s * 0.1, x + s * 0.7, y + s * 0.9, x, y + s * 0.9); c.bezierCurveTo(x - s * 0.7, y + s * 0.9, x - s * 0.95, y + s * 0.1, x, y - s * 1.1); c.closePath(); }, col, 5);
  shine(c, [[x - s * 0.4, y - s * 0.1], [x - s * 0.3, y + s * 0.4]], 6);
  if (cross) line(c, [[x - s * 1.1, y + s * 1.0], [x + s * 1.1, y - s * 1.2]], 9, RED);
};
const OIL = "#f0b829";
const icons = (c: Ctx, xs: number[], y: number, s = 34) => {
  drop(c, xs[0], y, s, COL.drop, true);
  drop(c, xs[1], y, s, COL.water);
  drop(c, xs[2], y, s, OIL);
};
// a sheet of white paper, flat, with the three pencil circles
const sheetCircles = (c: Ctx, x: number, y: number, w: number, h: number, cxs: number[], cy: number, r: number) => {
  shadow(c, x + w / 2 + 14, y + h + 10, w / 2, 20);
  shape(c, () => rrect(c, x, y, w, h, 8), PAPER, 6);
  cxs.forEach((cx) => { c.beginPath(); ell(c, cx, cy, r, r); c.strokeStyle = COL.greyDk; c.lineWidth = 8; c.stroke(); });
};

// a pencil lying at an angle, centre (x, y), length len
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len / 2, -22, len * 0.78, 44, 6), COL.yellow, 6);
  shade(c, () => rrect(c, -len / 2, -22, len * 0.78, 44, 6), COL.orange, 0, 12, 0.5);
  shape(c, () => polyP(c, [[len * 0.28, -22], [len / 2, 0], [len * 0.28, 22]]), "#f1d6a8", 6);
  shape(c, () => polyP(c, [[len * 0.43, -7], [len / 2, 0], [len * 0.43, 7]]), INK, 3);
  shape(c, () => rrect(c, -len / 2 - 22, -22, 34, 44, 8), COL.pink, 6);
  c.restore();
};

// ------------------------------------------------------------------ e1: the gap
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, TABLE);
  letterCard(c, 120, 330, 800, 400);
  // butter paper lying flat over the middle of the word: the letters show through it
  shape(c, () => polyP(c, [[250, 290], [800, 290], [800, 760], [250, 760]]), BUTTER, 6);
  c.save(); c.beginPath(); c.rect(250, 290, 550, 470); c.clip();
  c.globalAlpha = 0.7; line(c, [[270, 700], [270, 330]], 10, WHITE); c.restore(); c.globalAlpha = 1;
  arrow(c, [[525, 110], [525, 235]]);
  hand(c, 1010, 600, Math.PI, 1.7, SKIN.child, CLOTH.child, true);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = TABLE; c.fillRect(0, 790, D, 290); line(c, [[0, 790], [D, 790]], 6);
  // child: shirt behind the books, head with chin on the top book
  shape(c, () => rrect(c, 60, 560, 210, 240, 40), CLOTH.child, 6);
  shape(c, () => rrect(c, 105, 520, 100, 90, 20), SKIN.child, 6);
  [[40, 730, 340, COL.teal], [60, 660, 300, RED], [90, 590, 250, COL.yellow]].forEach(([bx, by, bw, col]) => {
    shape(c, () => rrect(c, bx as number, by as number, bw as number, 70, 8), col as string, 6);
    line(c, [[(bx as number) + 16, (by as number) + 50], [(bx as number) + (bw as number) - 24, (by as number) + 50]], 4, WHITE);
  });
  const hx = 215, hy = 450;
  shape(c, () => ell(c, hx, hy, 105, 110), SKIN.child, 6);
  shape(c, () => { c.moveTo(hx - 108, hy + 5); c.bezierCurveTo(hx - 120, hy - 150, hx + 90, hy - 150, hx + 106, hy - 20); c.quadraticCurveTo(hx + 20, hy - 60, hx - 108, hy + 5); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx - 100, hy + 20, 22, 32), SKIN.childDk, 4);
  shape(c, () => ell(c, hx + 55, hy + 10, 12, 16), INK, 0);
  line(c, [[hx + 20, hy + 70], [hx + 55, hy + 74]], 5);
  // the card on the table, seen low from the side
  shape(c, () => polyP(c, [[470, 845], [960, 845], [1030, 925], [400, 925]]), WHITE, 6);
  [..."LIGHT"].forEach((ch, i) => letter(c, ch, 510 + i * 95, 855, 56, 11));
  // the butter paper held up high, the hand gripping its right edge
  shadow(c, 760, 935, 220, 22);
  shape(c, () => polyP(c, [[500, 540], [900, 540], [980, 615], [430, 615]]), BUTTER, 6);
  hand(c, 1075, 575, Math.PI, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[720, 500], [720, 380]]);
  rulerUp(c, 395, 925, 580, 90, 56, false);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = TABLE; c.fillRect(0, 870, D, 210); line(c, [[0, 870], [D, 870]], 6);
  // card below, letters blurred, seen from above at an angle
  shadow(c, 340, 1000, 300, 20);
  shape(c, () => polyP(c, [[70, 890], [560, 890], [620, 1020], [10, 1020]]), WHITE, 6);
  c.globalAlpha = 0.18;
  [..."LIGHT"].forEach((ch, i) => { for (const [dx, dy] of [[-8, -5], [8, -5], [-8, 6], [8, 6], [0, 0]]) letter(c, ch, 70 + i * 100 + dx, 905 + dy, 95, 20, COL.greyDk); });
  c.globalAlpha = 1;
  // butter paper held up by a hand at the left, two cm above the card
  shape(c, () => polyP(c, [[140, 590], [540, 590], [600, 670], [90, 670]]), BUTTER, 6);
  hand(c, 15, 645, 0, 1.3, SKIN.child, CLOTH.child, false);
  // ruler standing on the table
  rulerUp(c, 700, 870, 700, 130, 100, true);
  line(c, [[645, 610], [750, 610]], 7, RED);
  // finger pointing at the 2 on the ruler
  hand(c, 905, 570, Math.PI, 1.8, SKIN.adult, CLOTH.adult, true);
  c.save(); c.translate(905, 570); c.rotate(Math.PI); c.scale(1.8, 1.8); shape(c, () => rrect(c, 30, -30, 110, 17, 8.5), SKIN.adult, 5); c.restore();
  write(c, "2 cm", 150, 410, 90, RED, 12);
};

// ------------------------------------------------------------------ e2: three spots
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, TABLE);
  sheetCircles(c, 60, 170, 960, 740, [250, 540, 830], 470, 115);
  icons(c, [250, 540, 830], 730, 46);
  pencil(c, 560, 290, 420, -0.05);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, TABLE);
  sheetCircles(c, 60, 170, 960, 740, [250, 540, 830], 560, 115);
  icons(c, [250, 540, 830], 790, 46);
  // the water spot already in the middle circle
  shape(c, () => ell(c, 540, 565, 62, 50, 0.3), COL.water, 5);
  shine(c, [[505, 548], [525, 535]], 8);
  // the cotton bud with an oil drop about to fall into the right circle
  const an = 2.3, d = [Math.cos(an), Math.sin(an)], tip = [770, 450], G = [tip[0] - d[0] * 190, tip[1] - d[1] * 190];
  line(c, [[G[0] - d[0] * 120, G[1] - d[1] * 120], [tip[0] - d[0] * 12, tip[1] - d[1] * 12]], 20, INK);
  line(c, [[G[0] - d[0] * 120, G[1] - d[1] * 120], [tip[0] - d[0] * 12, tip[1] - d[1] * 12]], 10, "#e9d9b5");
  shape(c, () => ell(c, tip[0], tip[1], 30, 24, an), WHITE, 6);
  shape(c, () => ell(c, tip[0] + d[0] * 10, tip[1] + d[1] * 10, 16, 13, an), OIL, 3);
  drop(c, 758, 510, 26, OIL);
  hand(c, G[0] - d[0] * 98 * 1.4, G[1] - d[1] * 98 * 1.4, an, 1.4);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, TABLE);
  // the newspaper underneath: rows of print and a headline block
  shadow(c, 560, 925, 480, 20);
  shape(c, () => rrect(c, 60, 140, 960, 780, 8), "#ece6d6", 6);
  const bars = (alpha: number) => {
    c.globalAlpha = alpha;
    shape(c, () => rrect(c, 90, 165, 400, 62, 6), INK, 0);
    for (let r = 0; r < 24; r++) { const y = 250 + r * 26; line(c, [[90, y], [90 + (r % 3 === 1 ? 800 : 880), y]], 11, INK); }
    c.globalAlpha = 1;
  };
  c.save(); c.beginPath(); c.rect(60, 140, 960, 780); c.clip(); bars(0.85); c.restore();
  // the sheet of paper held over it: opaque, apart from the three spots
  const px = 150, py = 230, pw = 780, ph = 620, cy = 480, r = 95, cx = [300, 540, 780], al = [0.1, 0.5, 0.95];
  shadow(c, 560, py + ph + 20, 380, 18);
  shape(c, () => rrect(c, px, py, pw, ph, 8), PAPER, 6);
  cx.forEach((x, i) => {
    c.save(); c.beginPath(); ell(c, x, cy, r, r); c.clip();
    c.fillStyle = PAPER; c.fillRect(x - r, cy - r, 2 * r, 2 * r);
    c.beginPath(); c.rect(60, 140, 960, 780); c.clip(); c.translate(0, 0);
    c.globalAlpha = al[i]; for (let k = 0; k < 24; k++) { const y = 250 + k * 26; line(c, [[90, y], [890, y]], 11, INK); }
    c.restore(); c.globalAlpha = 1;
    c.beginPath(); ell(c, x, cy, r, r); c.strokeStyle = COL.greyDk; c.lineWidth = 8; c.stroke();
  });
  icons(c, cx, 730, 42);
  hand(c, 985, 540, Math.PI, 1.3);
};

// ------------------------------------------------------------------ e3: the letter chart
// the eye chart paper: six rows of letters, big to small, numbered down the side; box top-left (x, y)
const chartPaper = (c: Ctx, x: number, y: number, w: number, h: number, paper = PAPER, nums = true) => {
  shape(c, () => rrect(c, x, y, w, h, 8), paper, 6);
  const hs = [0.17, 0.135, 0.105, 0.08, 0.062, 0.048], seq = "ETLFOP";
  let ry = y + h * 0.05;
  hs.forEach((fh, i) => {
    const lh = h * fh, n = i + 1, gap = lh * 0.95, rowW = n * lh * 0.8 + (n - 1) * gap, sx = x + w * 0.2 + (w * 0.74 - rowW) / 2;
    if (nums) write(c, String(i + 1), x + w * 0.05, ry + lh * 0.1, Math.max(lh * 0.55, h * 0.04), INK, Math.max(3, w * 0.012));
    for (let k = 0; k < n; k++) letter(c, seq[(i + k * 2) % 6], sx + k * (lh * 0.8 + gap), ry, lh, Math.max(3, lh * 0.2));
    ry += lh + h * 0.04;
  });
};
// sunglasses on a person() head
const shades = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05 + head * 0.12;
  [-1, 1].forEach((s) => shape(c, () => rrect(c, x + s * head * 0.4 - head * 0.3, hy - head * 0.2, head * 0.6, head * 0.42, head * 0.14), INK, 4));
  line(c, [[x - head * 0.1, hy], [x + head * 0.1, hy]], 5);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 470, 1020, 340, 18);
  chartPaper(c, 130, 50, 680, 960);
  pencil(c, 925, 540, 560, Math.PI / 2 + 0.1);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = "#e7d3b0"; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  for (let i = 1; i < 8; i++) line(c, [[i * 150 - 40, 780], [i * 190 - 200, 1080]], 3, "#c9b088");
  // the Sun, behind the child
  c.beginPath(); ell(c, 120, 130, 70, 70); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (let k = 0; k < 10; k++) { const a = k * 0.628; line(c, [[120 + Math.cos(a) * 92, 130 + Math.sin(a) * 92], [120 + Math.cos(a) * 122, 130 + Math.sin(a) * 122]], 8, COL.orange); }
  // the child (back to the Sun) and its shadow falling ahead of it
  c.beginPath(); polyP(c, [[215, 950], [290, 950], [520, 985], [440, 1010]]); c.fillStyle = SH; c.fill();
  person(c, 255, 950, 440);
  shades(c, 255, 950, 440);
  // three steps
  [400, 500, 600].forEach((x, i) => shape(c, () => ell(c, x, i % 2 ? 1015 : 995, 30, 15), "#c9b088", 4));
  write(c, "3", 485, 855, 70, INK, 9);
  // the grown-up holding the chart
  person(c, 830, 950, 540, { adult: true, armL: [2.1, 3.14], armR: [2.0, 3.14] });
  chartPaper(c, 590, 440, 215, 300, PAPER, true);
  [[620, 600], [775, 640]].forEach(([hx, hy]) => shape(c, () => ell(c, hx, hy, 24, 24), SKIN.adult, 5));
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, "#4a4468");
  c.fillStyle = "#38334f"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  // window with the curtains drawn
  shape(c, () => rrect(c, 40, 140, 300, 520, 8), "#e9d9a8", 6);
  shape(c, () => rrect(c, 30, 120, 170, 570, 10), COL.purple, 6);
  shape(c, () => rrect(c, 180, 120, 170, 570, 10), COL.purple, 6);
  for (let k = 0; k < 4; k++) { line(c, [[65 + k * 40, 130], [65 + k * 40, 680]], 4, "#6a4fa6"); line(c, [[215 + k * 40, 130], [215 + k * 40, 680]], 4, "#6a4fa6"); }
  line(c, [[10, 110], [370, 110]], 10, COL.brown);
  // the chart on the wall, the child with sunglasses in front, squinting
  chartPaper(c, 690, 220, 330, 480, "#e5e0ee", true);
  person(c, 500, 960, 540);
  shades(c, 500, 960, 540);
  const head = 540 * 0.13, hy = 960 - 540 * 0.74 - head * 1.05;
  line(c, [[500 - head * 0.8, hy - head * 0.45], [500 - head * 0.1, hy - head * 0.25]], 6);
  line(c, [[500 + head * 0.8, hy - head * 0.45], [500 + head * 0.1, hy - head * 0.25]], 6);
  c.fillStyle = "rgba(20,16,50,0.28)"; c.fillRect(0, 0, D, D);
};

export const su_lightTransparentOpaque = cards("sci.light.transparent-opaque.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
