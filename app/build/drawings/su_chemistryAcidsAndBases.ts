import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, rnd, cards, bowl, plate } from "./flatKit";

// sci.chemistry.acids-and-bases.L3 · set-up cards. Same red-cabbage water (purple), same glasses, same spoon and the same child's hand on every card.

// ---------------------------------------------------------------- shared things
const PUR = "#7b48c4", PURDK = "#5a2f8e", PINK = "#ee3f84", PALE = "#f59ac0", BLUE = "#3b7fe0", GREEN = "#2fb45a", LEMON = "#ffe36a";
// a hand that points left (mirrored, so the thumb stays on top)
const handL = (c: Ctx, x: number, y: number, an: number, s = 1) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s); c.restore(); };
// a sheet of white paper (a quad) with a soft shadow
const sheet = (c: Ctx, pts: number[][]) => {
  c.save(); c.translate(16, 20); c.beginPath(); polyP(c, pts); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, () => polyP(c, pts), WHITE, 6);
};
// a small paper label lying on the table: a number, or a white drop for milk
const tag = (c: Ctx, x: number, y: number, w: number, h: number, t: string) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 5);
  if (t === "milk") shape(c, () => { c.moveTo(x, y - h * 0.34); c.quadraticCurveTo(x - h * 0.34, y + h * 0.02, x - h * 0.24, y + h * 0.16); c.quadraticCurveTo(x, y + h * 0.4, x + h * 0.24, y + h * 0.16); c.quadraticCurveTo(x + h * 0.34, y + h * 0.02, x, y - h * 0.34); c.closePath(); }, "#eaf2fb", 4);
  else write(c, t, x - h * 0.2, y - h * 0.3, h * 0.6, INK, 6);
};
// a glass with something in it (leaves, bubbles) drawn between the liquid and the glass wall
const glassWith = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, inside: () => void = () => {}) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, ly = y - h * fill, lw = bot + (top - bot) * fill;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, liquid, 0);
  shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 0);
  inside();
  shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, "rgba(214,236,250,0.22)", 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
// a teaspoon: handle from (x0, y0) to the bowl centre (x1, y1); returns the lip where liquid spills
const spoon = (c: Ctx, x0: number, y0: number, x1: number, y1: number, tilt: number, inner: string): number[] => {
  line(c, [[x0, y0], [x1, y1]], 18, INK); line(c, [[x0, y0], [x1, y1]], 9, COL.steelIn);
  const r = Math.atan2(y1 - y0, x1 - x0) - tilt, bx = () => ell(c, x1, y1, 50, 31, r);
  shape(c, bx, COL.steel, 6); shade(c, bx, COL.steelDk, 8, 10, 0.5);
  shape(c, () => ell(c, x1, y1, 38, 21, r), inner, 3);
  return [x1 + Math.cos(r) * 50, y1 + Math.sin(r) * 50];
};
// a spoon in a child's hand pouring into a glass: stream from the lip down to y = surf
const pour = (c: Ctx, wx: number, wy: number, an: number, s: number, d: number, inner: string, surf: number) => {
  const bx = wx + Math.cos(an) * d, by = wy + Math.sin(an) * d;
  const tip = spoon(c, wx + Math.cos(an) * 40 * s, wy + Math.sin(an) * 40 * s, bx, by, 0.5, inner);
  line(c, [tip, [tip[0] - 3, surf]], 18, INK); line(c, [tip, [tip[0] - 3, surf]], 9, inner);
  shape(c, () => ell(c, tip[0] - 3, surf, 30, 8), "rgba(255,255,255,0.7)", 3);
  handL(c, wx, wy, an, s);
};
const bubbles = (c: Ctx, pts: number[][]) => pts.forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.65)", 3));
const lemonHalf = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.28, r * 0.28, 0.45);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), "#fff3b0", 3);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.2; line(c, [[x + Math.cos(a) * r * 0.1, y + Math.sin(a) * r * 0.1], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 3, COL.yellow); }
};
// a straight steel tumbler with a pale drink showing at the rim
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, inside: string) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, w * 0.3, 0, 0.55);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), inside, 5);
  shine(c, [[x - w * 0.34, y - h * 0.82], [x - w * 0.3, y - h * 0.2]], 8);
};
// a torn red-cabbage leaf, purple with pale veins
const cabbageLeaf = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { const n = 14; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = 1 + (i % 2 ? -0.16 : 0.06); const px = Math.cos(a) * len * 0.5 * rr, py = Math.sin(a) * len * 0.34 * rr; if (i) c.lineTo(px, py); else c.moveTo(px, py); } c.closePath(); };
  shape(c, p, PURDK, 5); shade(c, p, "#4b2c78", len * 0.1, len * 0.08, 0.5);
  line(c, [[-len * 0.42, 0], [len * 0.4, 0]], 4, "#c9a6e0");
  for (const k of [-0.22, -0.1, 0.1, 0.22]) line(c, [[-len * 0.05, 0], [len * 0.2, k * len * 0.7]], 3, "#c9a6e0");
  c.restore();
};

// ---------------------------------------------------------------- experiment 1: the cabbage indicator
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // mixie: base, jar with water and torn leaves
  shadow(c, 320, 890, 220, 30);
  shape(c, () => rrect(c, 135, 790, 310, 100, 22), COL.blueDk, 6);
  shade(c, () => rrect(c, 135, 790, 310, 100, 22), "#2c4d86", 60, 0, 0.5);
  shape(c, () => ell(c, 290, 842, 30, 30), COL.yellow, 5);
  line(c, [[290, 842], [305, 828]], 5);
  shape(c, () => rrect(c, 180, 770, 220, 36, 10), COL.steel, 5);
  glassWith(c, 290, 772, 270, 470, 0.5, "#9565d0", () => {
    cabbageLeaf(c, 250, 600, 140, 0.4); cabbageLeaf(c, 330, 650, 130, -0.5); cabbageLeaf(c, 290, 380, 150, 0.9); cabbageLeaf(c, 230, 700, 100, -0.2);
  });
  cabbageLeaf(c, 310, 295, 120, -0.6);
  // jug with dark purple water and the strainer on its rim
  shadow(c, 800, 890, 170, 28);
  const jug = () => { c.moveTo(675, 520); c.lineTo(925, 520); c.lineTo(905, 880); c.lineTo(695, 880); c.closePath(); };
  line(c, [[915, 600], [1005, 620], [1000, 760], [908, 790]], 26, INK); line(c, [[915, 600], [1005, 620], [1000, 760], [908, 790]], 12, COL.glass);
  shape(c, () => polyP(c, [[686, 640], [914, 640], [905, 880], [695, 880]]), PURDK, 0);
  shape(c, jug, COL.glass, 6);
  shine(c, [[705, 600], [715, 820]], 8);
  // strainer: mesh bowl and handle
  line(c, [[900, 505], [1000, 410], [1040, 370]], 22, INK); line(c, [[900, 505], [1000, 410], [1040, 370]], 11, COL.steelIn);
  const bw = () => { c.moveTo(640, 500); c.quadraticCurveTo(800, 660, 960, 500); c.closePath(); };
  shape(c, bw, COL.steelIn, 6);
  c.save(); c.beginPath(); bw(); c.clip();
  for (let k = -5; k <= 5; k++) { line(c, [[800 + k * 30, 500], [800 + k * 30 * 0.4, 600]], 2.5, COL.steelDk); }
  for (const yy of [530, 560, 590]) line(c, [[620, yy], [980, yy]], 2.5, COL.steelDk);
  c.restore();
  shape(c, () => ell(c, 800, 500, 160, 22), PURDK, 6);
  for (const [x, y] of [[760, 500], [830, 505], [880, 497]]) shape(c, () => ell(c, x, y, 22, 8), "#4b2c78", 3);
  for (const [x, y] of [[790, 700], [812, 760]]) shape(c, () => ell(c, x, y, 9, 13), PURDK, 3);
  arrow(c, [[450, 340], [510, 300], [570, 285], [630, 300], [670, 345]]);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  sheet(c, [[90, 90], [1000, 90], [1040, 970], [50, 970]]);
  let n = 1;
  for (const y of [360, 610, 860]) for (const x of [270, 540, 810]) { glassWith(c, x, y, 160, 160, 0.5, PUR); tag(c, x, y + 46, 76, 46, String(n++)); }
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  glassWith(c, 200, 880, 230, 300, 0.5, BLUE);
  glassWith(c, 920, 880, 230, 300, 0.5, GREEN);
  glassWith(c, 560, 880, 230, 300, 0.5, PINK);
  lemonHalf(c, 385, 825, 56);
  pour(c, 890, 230, 2.7, 2, 360, LEMON, 735);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  sheet(c, [[20, 640], [1060, 640], [1060, 880], [20, 880]]);
  const cols = [PINK, "#e0509e", "#c050b5", PUR, "#6a62d0", BLUE, "#2f9fc0", "#2fb08a"];
  cols.forEach((k, i) => glassWith(c, 62 + i * 104, 800, 96, 240, 0.55, k));
  glassWith(c, 894, 650, 96, 240, 0.55, GREEN);
  handL(c, 969, 480, 2.55, 1.3);
  arrow(c, [[1015, 590], [1015, 730]]);
};

// ---------------------------------------------------------------- experiment 2: how much acid, how much base
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  sheet(c, [[70, 380], [1010, 380], [1056, 900], [24, 900]]);
  glassWith(c, 160, 790, 200, 300, 0.5, PINK);
  lemonHalf(c, 332, 728, 62);
  glassWith(c, 550, 790, 200, 300, 0.5, PALE);
  tumbler(c, 735, 790, 130, 160, "#fbf8f0");
  glassWith(c, 930, 790, 200, 300, 0.5, PUR);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  glassWith(c, 540, 900, 300, 400, 0.5, PINK, () => bubbles(c, [[500, 820, 11], [560, 770, 8], [590, 840, 13], [520, 730, 7], [610, 720, 9]]));
  pour(c, 880, 170, 2.6, 2, 380, "#e8f6ff", 700);
  bubbles(c, [[560, 585, 7], [575, 530, 6]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  glassWith(c, 330, 620, 260, 340, 0.55, PUR);
  glassWith(c, 750, 620, 260, 340, 0.5, PUR);
  line(c, [[500, 420], [580, 420]], 12); line(c, [[500, 460], [580, 460]], 12);
  sheet(c, [[190, 735], [890, 735], [900, 975], [180, 975]]);
  for (let k = 0; k < 4; k++) line(c, [[260 + k * 40, 775], [260 + k * 40, 935]], 9);
  line(c, [[245, 930], [405, 780]], 9);
  line(c, [[455, 775], [455, 935]], 9);
  write(c, "6", 640, 770, 150, INK, 12);
};

// ---------------------------------------------------------------- experiment 3: curd turns sour
// steam over warm milk
const steam = (c: Ctx, x: number, y: number) => [-70, 0, 70].forEach((dx) => { c.globalAlpha = 0.6; line(c, [[x + dx, y], [x + dx - 18, y - 40], [x + dx + 16, y - 80], [x + dx - 6, y - 120]], 10, COL.grey); c.globalAlpha = 1; });
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  steam(c, 450, 500);
  bowl(c, 450, 680, 250, "#fbf8f0");
  // ripple round the spoon tip
  c.globalAlpha = 0.9; shape(c, () => ell(c, 470, 684, 80, 20), "rgba(255,255,255,0)", 4); c.globalAlpha = 1;
  spoon(c, 900 + Math.cos(2.45) * 68, 330 + Math.sin(2.45) * 68, 470, 680, 0.1, WHITE);
  shape(c, () => ell(c, 470, 680, 26, 14), WHITE, 3);
  handL(c, 900, 330, 2.45, 1.7);
  arrow(c, [[640, 760], [520, 785], [380, 765], [300, 720]]);
  tag(c, 210, 930, 130, 80, "1");
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  // A: set thick, a spoon standing in it
  bowl(c, 230, 740, 165, "#fffaf0");
  line(c, [[270, 590], [240, 735]], 16, INK); line(c, [[270, 590], [240, 735]], 8, COL.steelIn);
  shape(c, () => ell(c, 232, 742, 30, 12, 0.1), COL.steel, 4);
  tag(c, 230, 920, 110, 70, "1");
  // B: being covered with a plate
  bowl(c, 655, 740, 165, "#fbf8f0");
  plate(c, 655, 520, 215, 62);
  handL(c, 940, 520, Math.PI, 1.6);
  arrow(c, [[655, 270], [655, 410]]);
  tag(c, 655, 920, 110, 70, "2");
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  sheet(c, [[40, 200], [1040, 200], [1060, 960], [20, 960]]);
  glassWith(c, 220, 740, 270, 380, 0.55, PUR);
  glassWith(c, 540, 740, 270, 380, 0.55, "#d255a8");
  glassWith(c, 860, 740, 270, 380, 0.55, PINK);
  tag(c, 220, 840, 130, 80, "milk"); tag(c, 540, 840, 130, 80, "2"); tag(c, 860, 840, 130, 80, "1");
};

export const su_chemistryAcidsAndBases = cards("sci.chemistry.acids-and-bases.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
