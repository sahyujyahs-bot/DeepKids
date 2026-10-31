import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, WHITE, RED, BG, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards, rnd } from "./flatKit";

// SET-UP CARDS · sci.the-very-small.atoms.L3 · cut paper in half, marbles under a card, hot and cold colour

const PAP = "#fffaf0", PAPDK = "#e6d8b6", TABLE = "#bfe0f5", BOARD = "#d9a66b", BOARDDK = "#b98348";

const table = (c: Ctx) => ground(c, TABLE);
// a paper strip lying flat, left end (x, y), length w, height h
const strip = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 8, y + h + 10, w / 2, 10);
  const p = () => rrect(c, x, y, w, h, 3);
  shape(c, p, PAP, 5);
  shade(c, p, PAPDK, 0, h * 0.5, 0.7);
  shape(c, p, "rgba(0,0,0,0)", 5);
};
// a wooden ruler, 0 at x, k px per cm, n cm long
const ruler = (c: Ctx, x: number, y: number, k: number, n: number, nums: number[]) => {
  const w = n * k + 40;
  shadow(c, x + w / 2 - 20, y + 100, w / 2, 12);
  shape(c, () => rrect(c, x - 20, y, w, 90, 6), COL.wood);
  shade(c, () => rrect(c, x - 20, y, w, 90, 6), COL.woodDk, 0, 55, 0.6);
  shape(c, () => rrect(c, x - 20, y, w, 90, 6), "rgba(0,0,0,0)", 5);
  for (let i = 0; i <= n; i++) line(c, [[x + i * k, y], [x + i * k, y + (i % 5 === 0 ? 40 : 26)]], i % 5 === 0 ? 4 : 3);
  nums.forEach((v) => write(c, String(v), x + v * k - (String(v).length * 8) , y + 46, 30, INK, 5));
};
// scissors pointing along an from the pivot (x, y); s = size; open = half opening angle
const scissors = (c: Ctx, x: number, y: number, an: number, s = 1, open = 0.2, hole: string = TABLE) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) {
    c.save(); c.rotate(k * open);
    shape(c, () => ell(c, -135, 0, 52, 36), COL.red, 6);
    shape(c, () => ell(c, -135, 0, 28, 17), hole, 5);
    shape(c, () => polyP(c, [[-100, -9], [-12, -12], [262, k * 3 - 1], [262, k * 3 + 5], [-12, 14], [-100, 9]]), COL.steel, 6);
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 11, 11), COL.steelDk, 4);
  c.restore();
};
const adultHand = (c: Ctx, x: number, y: number, an: number, s = 1) => hand(c, x, y, an, s, SKIN.adult, CLOTH.adult);
const childHand = (c: Ctx, x: number, y: number, an: number, s = 1) => hand(c, x, y, an, s, SKIN.child, CLOTH.child);

// a steel tumbler standing on the floor, bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 8, w * 0.6, w * 0.13);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x - w / 2, y); c.ellipse(x, y, w / 2, w * 0.12, 0, Math.PI, 0, true); c.lineTo(x + w / 2, y - h); c.closePath(); };
  shape(c, body, COL.steel, 6);
  shade(c, body, COL.steelDk, w * 0.3, 0, 0.7);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.12), COL.steelIn, 6);
  shine(c, [[x - w * 0.3, y - h + 25], [x - w * 0.3, y - 25]], 8);
};
// a steel bowl upside down, base centre (x, y), base radius r
const bowlDown = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + 10, r * 1.05, r * 0.2);
  const p = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.4, x + r, y - r * 1.4, x + r, y); c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.closePath(); };
  shape(c, p, COL.steel, 6);
  shade(c, p, COL.steelDk, r * 0.5, 0, 0.7);
  shine(c, [[x - r * 0.6, y - r * 0.5], [x - r * 0.35, y - r * 0.85]], 9);
  shape(c, () => ell(c, x, y - r * 0.96, r * 0.2, r * 0.06), COL.steelIn, 5);
};
const marble = (c: Ctx, x: number, y: number, r: number, col: string = COL.blue) => {
  shadow(c, x + r * 0.3, y + r * 0.95, r * 0.9, r * 0.25);
  shape(c, () => ell(c, x, y, r, r), col, 5);
  shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.4, r * 0.4, 0.5);
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.38, r * 0.2, r * 0.14, -0.7), WHITE, 0);
};
// the floor with tiles in perspective
const floor = (c: Ctx) => {
  ground(c, "#e9dcc0");
  c.save(); c.globalAlpha = 0.5;
  for (let i = -6; i <= 6; i++) line(c, [[540 + i * 40, 330], [540 + i * 190, 1080]], 3, COL.grey);
  for (let k = 0; k < 9; k++) { const y = 330 + Math.pow(k / 8, 1.5) * 750; line(c, [[0, y], [1080, y]], 3, COL.grey); }
  c.restore();
  c.fillStyle = "#cfe0ea"; c.fillRect(0, 0, 1080, 330); line(c, [[0, 330], [1080, 330]], 6);
};
const cardboard = (c: Ctx, pts: number[][], thick: number) => {
  const [a, b, d, e] = pts;
  shape(c, () => polyP(c, [e, d, [d[0], d[1] + thick], [e[0], e[1] + thick]]), BOARDDK, 6);
  shape(c, () => polyP(c, [a, b, d, e]), BOARD, 6);
  for (let i = 1; i < 6; i++) { const t = i / 6; line(c, [[a[0] + (b[0] - a[0]) * t, a[1]], [e[0] + (d[0] - e[0]) * t, e[1]]], 3, BOARDDK); }
};
// the four tumblers, a bowl and the cardboard: lifted = above, else laid on the tumbler tops
const marbleScene = (c: Ctx, lifted: boolean) => {
  floor(c);
  tumbler(c, 330, 610, 130, 170); tumbler(c, 750, 610, 130, 170);
  bowlDown(c, 540, 770, 175);
  tumbler(c, 230, 880, 170, 230); tumbler(c, 850, 880, 170, 230);
  if (!lifted) cardboard(c, [[290, 438], [790, 438], [915, 650], [165, 650]], 24);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  table(c);
  const k = 800 / 24;
  strip(c, 110, 130, 800, 100);
  ruler(c, 110, 270, k, 24, [0, 12, 24]);
  write(c, "cm", 955, 310, 36, INK, 6);
  // the strip folding in half: left half flat, right half lifted over
  strip(c, 110, 740, 380, 100);
  const flap = () => polyP(c, [[490, 740], [490, 840], [770, 790], [770, 690]]);
  shape(c, flap, PAPDK, 5);
  shade(c, flap, "#c9b98f", 0, 45, 0.5);
  arrow(c, [[740, 620], [650, 540], [500, 540], [390, 650]], RED, 12);
  adultHand(c, 880, 710, Math.PI - 0.25, 1.6);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  table(c);
  const k = 700 / 24;
  [[24, 110], [12, 260], [6, 410]].forEach(([n, y]) => {
    strip(c, 90, y, n * k, 80);
    write(c, `${n} cm`, 90 + n * k + 30, y + 14, 34, INK, 6);
  });
  strip(c, 90, 690, 87, 80); strip(c, 230, 690, 87, 80);
  scissors(c, 567, 730, Math.PI, 1.4, 0.1);
  adultHand(c, 861, 745, Math.PI, 1.5);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  table(c);
  // tiny piece being cut by the grown-up
  strip(c, 260, 858, 120, 44);
  strip(c, 212, 862, 18, 40);
  scissors(c, 640, 880, Math.PI, 1.1, 0.1);
  adultHand(c, 887, 890, Math.PI, 1.4);
  // the child's magnifier over the last piece
  strip(c, 490, 372, 140, 50);
  const lx = 580, ly = 400, R = 220;
  line(c, [[lx - R, ly], [200, ly]], 44, INK); line(c, [[lx - R, ly], [200, ly]], 32, COL.brown);
  shape(c, () => ell(c, lx, ly, R, R), "#fffaf0", 0);
  c.save(); c.beginPath(); ell(c, lx, ly, R - 4, R - 4); c.clip();
  c.fillStyle = TABLE; c.fillRect(lx - R, ly - R, 2 * R, 2 * R);
  shape(c, () => rrect(c, lx - 190, ly - 85, 380, 170, 6), PAP, 5);
  const r = rnd(5);
  for (let i = 0; i < 16; i++) { const y = ly - 70 + i * 9, x0 = lx - 175 + r() * 30; line(c, [[x0, y], [x0 + 100, y + (r() - 0.5) * 24], [x0 + 220, y + (r() - 0.5) * 20], [lx + 180, y + (r() - 0.5) * 12]], 4, "#b79c6a"); }
  for (let i = 0; i < 6; i++) line(c, [[lx - 150 + i * 60, ly - 80], [lx - 120 + i * 55, ly + 80]], 3, "#cdb88a");
  c.restore();
  shape(c, () => ell(c, lx, ly, R, R), "rgba(214,236,250,0.18)", 20);
  c.beginPath(); ell(c, lx, ly, R, R); c.strokeStyle = COL.brown; c.lineWidth = 14; c.stroke();
  c.beginPath(); ell(c, lx, ly, R + 8, R + 8); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shine(c, [[lx - R * 0.6, ly - R * 0.35], [lx - R * 0.35, ly - R * 0.62]], 12);
  childHand(c, 135, ly, 0, 1.5);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  marbleScene(c, true);
  cardboard(c, [[290, 130], [790, 130], [915, 330], [165, 330]], 24);
  arrow(c, [[540, 395], [540, 485]], RED, 14);
  adultHand(c, 125, 225, 0.1, 1.5);
  adultHand(c, 958, 225, Math.PI - 0.1, 1.5);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  marbleScene(c, false);
  marble(c, 430, 940, 40);
  arrow(c, [[430, 880], [430, 790]], RED, 14);
  childHand(c, 430, 1100, -Math.PI / 2, 1.6);
  marble(c, 450, 392, 28); marble(c, 520, 372, 24, COL.teal);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, "#e9dcc0");
  [[270, 230], [810, 230], [270, 860], [810, 860]].forEach(([x, y]) => { shadow(c, x + 12, y + 14, 72, 66); shape(c, () => ell(c, x, y, 72, 72), COL.steel, 6); shape(c, () => ell(c, x, y, 56, 56), COL.steelIn, 4); });
  // the dough ball with the battery
  shadow(c, 555, 565, 70, 62); shape(c, () => ell(c, 540, 540, 66, 62), "#e0b98a", 6);
  shape(c, () => ell(c, 540, 540, 34, 34), COL.steel, 5); shape(c, () => ell(c, 540, 540, 17, 17), COL.steelDk, 4);
  // the see-through card
  const card = () => rrect(c, 200, 160, 680, 770, 14);
  c.setLineDash([22, 14]);
  shape(c, card, "rgba(217,166,107,0.28)", 8);
  c.setLineDash([]);
  [290, 410, 680, 800].forEach((y, i) => { marble(c, 110, y, 26, i % 2 ? COL.teal : COL.blue); arrow(c, [[170, y], [900, y]], RED, 12); marble(c, 985, y, 26, i % 2 ? COL.teal : COL.blue); });
  marble(c, 110, 540, 26, COL.yellow);
  arrow(c, [[170, 540], [440, 540]], RED, 12);
  arrow(c, [[455, 580], [270, 680]], RED, 12);
};
// glass of water in layers from the bottom (fractions of the water height), bottom centre (x, y)
const tumblerW = (c: Ctx, x: number, y: number, w: number, h: number, layers: [number, string][]) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, fill = 0.82, ly = y - h * fill;
  const body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  c.save(); c.beginPath(); body(); c.clip();
  let from = 0;
  layers.forEach(([upTo, col]) => { c.fillStyle = col; c.fillRect(x - w, y - h * fill * upTo, 2 * w, h * fill * (upTo - from) + 1); from = upTo; });
  c.restore();
  const lw = bot + (top - bot) * fill;
  shape(c, () => ell(c, x, ly, lw, w * 0.07), layers[layers.length - 1][1], 0);
  shape(c, body, "rgba(214,236,250,0.25)", 6);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.3)", 6);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.25]], 8);
};
const steam = (c: Ctx, x: number, y: number) => [-40, 0, 40].forEach((dx, i) => line(c, [[x + dx, y], [x + dx - 22, y - 40 - i % 2 * 10], [x + dx + 22, y - 80], [x + dx - 16, y - 125 - i % 2 * 10], [x + dx + 10, y - 165]], 9, "#ffffff"));
const paper = (c: Ctx) => {
  ground(c, "#d9b88a");
  shadow(c, 560, 1000, 450, 25);
  shape(c, () => polyP(c, [[200, 640], [880, 640], [1010, 1000], [70, 1000]]), WHITE, 6);
};
const WATER = COL.water;
const coolTag = (c: Ctx, hot: boolean, x: number, y: number) => write(c, hot ? "60°c" : "20°c", x - 80, y, 46, hot ? RED : COL.blueDk, 8);
// setup.e3.0
const e3_0 = (c: Ctx) => {
  paper(c);
  steam(c, 300, 480);
  tumblerW(c, 300, 900, 300, 380, [[1, WATER]]);
  tumblerW(c, 780, 900, 300, 380, [[1, WATER]]);
  coolTag(c, true, 300, 925); coolTag(c, false, 780, 925);
};
const dropper = (c: Ctx, x: number, y: number) => {
  shape(c, () => polyP(c, [[x - 14, y + 20], [x + 14, y + 20], [x + 5, y + 190], [x, y + 215], [x - 5, y + 190]]), "rgba(214,236,250,0.9)", 6);
  shape(c, () => ell(c, x, y - 10, 34, 62), COL.red, 6);
  shine(c, [[x - 16, y - 40], [x - 16, y - 5]], 7);
};
const drop = (c: Ctx, x: number, y: number) => shape(c, () => { c.moveTo(x, y - 34); c.quadraticCurveTo(x + 26, y + 2, x, y + 24); c.quadraticCurveTo(x - 26, y + 2, x, y - 34); c.closePath(); }, COL.red, 5);
// setup.e3.1
const e3_1 = (c: Ctx) => {
  paper(c);
  tumblerW(c, 300, 920, 300, 360, [[1, WATER]]);
  tumblerW(c, 780, 920, 300, 360, [[1, WATER]]);
  coolTag(c, true, 300, 945); coolTag(c, false, 780, 945);
  [300, 780].forEach((x) => { dropper(c, x, 200); drop(c, x, 470); adultHand(c, x, 60, Math.PI / 2, 1.8); });
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  paper(c);
  steam(c, 300, 500);
  tumblerW(c, 300, 900, 300, 380, [[1, "#ee9aa4"]]);
  tumblerW(c, 780, 900, 300, 380, [[0.3, "#c4262b"], [0.42, "#e0707a"], [1, WATER]]);
  coolTag(c, true, 300, 925); coolTag(c, false, 780, 925);
};

export const su_theVerySmallAtoms = cards("sci.the-very-small.atoms.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
