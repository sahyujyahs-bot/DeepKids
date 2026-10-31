import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// SIMPLE MACHINES L3 · set-up cards: levers (ruler on a pencil), a rubber-band load, a windlass (box, pencil, bottle).
const BGHOLE = "#efe4cf", WOODTOP = "#ead2a2", WOODSIDE = "#c9a06a", STRING = "#efe3c4", TAPE = "rgba(255,244,200,0.88)";
const CARD = "#cf9f5e", CARDSH = "#a97b3f", CARDLT = "#e2bd82", CARDIN = "#6b4a2a", CARDIN2 = "#8d6238";
const PX = 26; // pixels per cm on the ruler

const tableBand = (c: Ctx, y: number) => {
  c.fillStyle = WOODTOP; c.fillRect(-600, y, D + 1200, 2000);
  c.globalAlpha = 0.25; for (let k = 1; k < 5; k++) line(c, [[-100, y + k * 48], [D + 100, y + k * 48 - 10]], 3, WOODSIDE); c.globalAlpha = 1;
  line(c, [[-100, y], [D + 100, y]], 6);
};
const textW = (t: string, h: number) => [...t].reduce((a, ch) => a + h * (ch === " " ? 0.35 : ch === "m" ? 0.95 : 0.8), 0) - h * 0.2;
const num = (c: Ctx, t: string, cx: number, y: number, h: number, col: string = INK, w = 6) => write(c, t, cx - textW(t, h) / 2, y, h, col, w);
const stringLine = (c: Ctx, pts: number[][]) => { line(c, pts, 10, INK); line(c, pts, 5, STRING); };

// ---------------------------------------------------------------- lever things
// a 30 cm wooden ruler, drawn in the current frame: the pivot (cm mark pv) sits at x = 0, the top face is y = -52..0
const ruler = (c: Ctx, pv: number) => {
  const x = -(20 + pv * PX), p = () => rrect(c, x, -52, 820, 52, 6);
  shape(c, p, COL.wood); shade(c, p, COL.woodDk, 0, -9, 0.55);
  for (let i = 0; i <= 30; i++) { const tx = x + 20 + i * PX, five = i % 5 === 0; line(c, [[tx, -52], [tx, -52 + (five ? 22 : 12)]], five ? 4 : 3); if (five) num(c, String(i), tx, -26, 20, INK, 4); }
};
// a coin seen from the side; a stack of n coins standing on y (the ruler top), centred at cx
const coins = (c: Ctx, cx: number, y: number, n: number) => {
  for (let k = 0; k < n; k++) { const p = () => rrect(c, cx - 46, y - 20 * (k + 1), 92, 20, 8); shape(c, p, COL.steel, 5); shade(c, p, COL.steelDk, 0, -5, 0.6); }
  shine(c, [[cx - 30, y - 20 * n + 7], [cx + 6, y - 20 * n + 7]], 4);
};
// the round pencil seen end-on, resting on the table (table top at y + r)
const pencilEnd = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.25, y + r + 3, r * 1.15, r * 0.16);
  const p = () => ell(c, x, y, r, r);
  shape(c, p, COL.yellow); shade(c, p, COL.orange, -r * 0.25, -r * 0.25, 0.5);
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.62), COL.wood, 4); shape(c, () => ell(c, x, y, r * 0.26, r * 0.26), COL.black, 3);
};
// a measuring bracket with a label above it, in the current frame
const bracket = (c: Ctx, x1: number, x2: number, y: number, label: string) => {
  line(c, [[x1, y], [x2, y]], 5, COL.blueDk); line(c, [[x1, y - 12], [x1, y + 12]], 5, COL.blueDk); line(c, [[x2, y - 12], [x2, y + 12]], 5, COL.blueDk);
  num(c, label, (x1 + x2) / 2, y - 50, 34, COL.blueDk, 6);
};
// a ruler on a pencil, tilted by an radians about the pencil top (px, 745); body draws the things on the ruler,
// over draws hands and arrows; the whole scene is scaled by k about x = cx and moved down by ty
const leverScene = (c: Ctx, px: number, pv: number, an: number, k: number, ty: number, cx: number, body: () => void, over: () => void) => {
  ground(c); c.save(); c.translate(cx * (1 - k), ty); c.scale(k, k);
  tableBand(c, 855); pencilEnd(c, px, 800, 55);
  c.save(); c.translate(px, 745); c.rotate(an); ruler(c, pv); body(); c.restore();
  over(); c.restore();
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  leverScene(c, 540, 15, 0, 1.2, -250, 540, () => {}, () => { arrow(c, [[455, 610], [330, 610]]); arrow(c, [[625, 610], [750, 610]]); });
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  leverScene(c, 540, 15, -0.1, 1.2, -250, 540, () => { coins(c, -6 * PX, -52, 2); bracket(c, -6 * PX, 0, -135, "6 cm"); }, () => {});
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  leverScene(c, 540, 15, 0, 1.1, -120, 540, () => { coins(c, -6 * PX, -52, 2); coins(c, 12 * PX, -52, 1); bracket(c, -6 * PX, 0, -200, "6 cm"); bracket(c, 0, 12 * PX, -200, "12 cm"); }, () => {
    hand(c, 711, 652, 0, 0.91, SKIN.child, CLOTH.child, true);
    arrow(c, [[900, 612], [985, 612]]);
  });
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  leverScene(c, 300, 5, 0.16, 1.1, -100, 560, () => {
    const t = -98, p = () => rrect(c, -146, t, 140, 46, 5);
    shape(c, p, COL.blue); shape(c, () => rrect(c, -140, t + 9, 128, 28, 3), COL.paper, 4);
    line(c, [[-132, t + 20], [-20, t + 20]], 3, COL.grey); line(c, [[-132, t + 28], [-20, t + 28]], 3, COL.grey);
    shade(c, p, COL.blueDk, 0, -8, 0.35);
  }, () => {
    arrow(c, [[780, 480], [780, 690]]);
    hand(c, 905, 665, Math.PI / 2, 1.3, SKIN.child, CLOTH.child, true);
  });
};

// ---------------------------------------------------------------- the loaded truck
// a toy truck facing left: front bumper at x, wheels on y
const truck = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 230, y + 4, 230, 14);
  shape(c, () => rrect(c, x, y - 90, 430, 34, 8), COL.blueDk);
  shape(c, () => polyP(c, [[x, y - 90], [x, y - 140], [x + 35, y - 185], [x + 150, y - 185], [x + 150, y - 90]]), COL.blue);
  shape(c, () => polyP(c, [[x + 42, y - 172], [x + 78, y - 172], [x + 78, y - 125], [x + 20, y - 125]]), COL.sky, 5);
  const bed = () => rrect(c, x + 158, y - 132, 272, 44, 6);
  shape(c, bed, COL.yellow); shade(c, bed, COL.woodDk, 0, -10, 0.5);
  for (const wx of [x + 85, x + 340]) { shape(c, () => ell(c, wx, y - 40, 40, 40), COL.black); shape(c, () => ell(c, wx, y - 40, 15, 15), COL.steel, 4); }
  shape(c, () => ell(c, x - 6, y - 104, 9, 9), COL.steel, 4);
  // the packet of dal taped on the bed
  const bx = x + 190, by = y - 134, pw = 200, ph = 96, pouch = () => rrect(c, bx, by - ph, pw, ph, 12);
  shape(c, pouch, "#f3dc8e"); shade(c, pouch, COL.orange, 0, -10, 0.3);
  const r = [0.13, 0.57, 0.31, 0.83, 0.47, 0.71, 0.19, 0.93, 0.39, 0.64];
  for (let i = 0; i < 28; i++) shape(c, () => ell(c, bx + 14 + ((i * 37) % 172) + r[i % 10] * 6, by - 14 - ((i * 23) % 62) - r[(i + 3) % 10] * 8, 8, 5.5, i), COL.orange, 2);
  for (let k = 0; k < 9; k++) line(c, [[bx + 8 + k * 23, by - ph + 12 - (k % 2) * 6], [bx + 20 + k * 23, by - ph + 12 - ((k + 1) % 2) * 6]], 3, COL.grey);
  shine(c, [[bx + 14, by - ph + 24], [bx + 14, by - 30]], 6);
  for (const tx of [bx + 22, bx + pw - 60]) shape(c, () => rrect(c, tx, by - ph - 8, 38, ph + 20, 4), TAPE, 4);
};
// a rubber band held by a hand: left loop at (x1, y), right loop at x2
const band = (c: Ctx, x1: number, x2: number, y: number) => {
  const p = () => { c.beginPath(); rrect(c, x1 - 26, y - 25, x2 - x1 + 52, 50, 25); };
  p(); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); p(); c.strokeStyle = COL.teal; c.lineWidth = 12; c.stroke();
};
const bandUp = (c: Ctx, x: number, y1: number, y2: number) => {
  const p = () => { c.beginPath(); rrect(c, x - 25, y1 - 25, 50, y2 - y1 + 50, 25); };
  p(); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); p(); c.strokeStyle = COL.teal; c.lineWidth = 12; c.stroke();
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -170); tableBand(c, 800);
  truck(c, 560, 800);
  band(c, 232, 440, 690); stringLine(c, [[466, 690], [554, 696]]);
  hand(c, 110, 690, 0, 1.2, SKIN.child, CLOTH.child);
  c.restore();
};
// a metre-style ruler standing upright on y = 1030, 0 at the table
const rulerUp = (c: Ctx, x: number) => {
  const p = () => rrect(c, x, 1030 - 24 * 30 - 20, 54, 24 * 30 + 20, 6);
  shape(c, p, COL.wood); shade(c, p, COL.woodDk, -9, 0, 0.55);
  for (let i = 0; i <= 30; i++) { const ty = 1030 - i * 24, five = i % 5 === 0; line(c, [[x, ty], [x + (five ? 24 : 13), ty]], five ? 4 : 3); if (five) num(c, String(i), x + 38, ty - 11, 20, INK, 4); }
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); tableBand(c, 1030);
  const cols = [COL.purple, COL.orange, COL.teal, COL.blue];
  cols.forEach((col, k) => {
    const y = 1030 - (k + 1) * 60, p = () => rrect(c, 745 + (k % 2) * 10, y, 250, 60, 6);
    shape(c, p, col); shade(c, p, INK, 0, -8, 0.18); shape(c, () => rrect(c, 770 + (k % 2) * 10, y + 14, 200, 32, 3), COL.paper, 3);
  });
  rulerUp(c, 640);
  truck(c, 150, 790);
  stringLine(c, [[440, 470], [372, 556]]); stringLine(c, [[440, 470], [508, 556]]);
  bandUp(c, 440, 345, 450);
  hand(c, 440, 232, Math.PI / 2, 1.4, SKIN.child, CLOTH.child);
  line(c, [[500, 330], [640, 330]], 4, RED); line(c, [[500, 470], [640, 470]], 4, RED);
};

// ---------------------------------------------------------------- the box, pencil and bottle
// a cardboard box with an open top, drawn in a slight three-quarter view; p(u, d, hh) is a point across, in depth, at height
const box = (c: Ctx, X: number, Y: number, w: number, h: number, dx: number, dy: number) => {
  const p = (u: number, d: number, hh: number) => [X + u + dx * d, Y - hh + dy * d];
  shadow(c, X + w / 2 + 40, Y + 6, w * 0.6, 16);
  shape(c, () => polyP(c, [p(w, 0, h), p(w, 1, h), p(w, 1, 0), p(w, 0, 0)]), CARDSH);
  const front = () => polyP(c, [p(0, 0, h), p(w, 0, h), p(w, 0, 0), p(0, 0, 0)]);
  shape(c, front, CARD); shade(c, front, CARDSH, 0, -14, 0.35);
  shape(c, () => polyP(c, [p(0, 0, h), p(w, 0, h), p(w, 1, h), p(0, 1, h)]), CARDLT);
  const open = () => polyP(c, [p(16, 0.14, h), p(w - 16, 0.14, h), p(w - 16, 0.9, h), p(16, 0.9, h)]);
  shape(c, open, CARDIN, 4);
  c.save(); c.beginPath(); open(); c.clip(); c.fillStyle = CARDIN2; polyP(c, [p(16, 0.9, h), p(w - 16, 0.9, h), p(w - 16, 0.9, h - 110), p(16, 0.9, h - 110)]); c.fill(); c.restore();
  return p;
};
const waterBottle = (c: Ctx, x: number, y: number) => {
  const w = 112, h = 270, body = () => { c.moveTo(x - 22, y + 56); c.bezierCurveTo(x - 22, y + 90, x - w / 2, y + 85, x - w / 2, y + 125); c.lineTo(x - w / 2, y + h - 18); c.quadraticCurveTo(x - w / 2, y + h, x - w / 2 + 18, y + h); c.lineTo(x + w / 2 - 18, y + h); c.quadraticCurveTo(x + w / 2, y + h, x + w / 2, y + h - 18); c.lineTo(x + w / 2, y + 125); c.bezierCurveTo(x + w / 2, y + 85, x + 22, y + 90, x + 22, y + 56); c.closePath(); };
  shape(c, body, COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, y + 110, 2 * w, h); c.fillStyle = COL.waterDk; c.globalAlpha = 0.5; c.fillRect(x + 10, y + 110, w, h); c.restore(); c.globalAlpha = 1;
  line(c, [[x - w / 2, y + 110], [x + w / 2, y + 110]], 4, COL.glassEdge);
  shape(c, () => rrect(c, x - w / 2, y + 160, w, 70, 4), COL.teal, 4);
  shape(c, body, "rgba(0,0,0,0)", 5); shine(c, [[x - w / 2 + 14, y + 135], [x - w / 2 + 14, y + 150]], 7);
  shape(c, () => rrect(c, x - 26, y, 52, 34, 8), COL.blue, 5);
};
// the pencil, lying across: bare (flat) end at x1, sharp end at x2
const pencilH = (c: Ctx, x1: number, x2: number, y: number) => {
  const t = 30, body = () => rrect(c, x1, y - t / 2, x2 - x1 - 54, t, 4);
  shape(c, () => polyP(c, [[x2 - 56, y - t / 2], [x2, y], [x2 - 56, y + t / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x2 - 20, y - 4], [x2, y], [x2 - 20, y + 4]]), COL.black, 3);
  shape(c, body, COL.yellow); shade(c, body, COL.orange, 0, -9, 0.55);
  shape(c, () => rrect(c, x1, y - t / 2, 14, t, 3), COL.wood, 4);
};
const TOP = 460; // the pencil's height on the cards
// the table edge, the box with the book on it and the pencil across; returns where the string hangs
const windlass = (c: Ctx, x1: number, wraps: number, bottleTop: number, tape: boolean) => {
  ground(c);
  shape(c, () => polyP(c, [[400, 760], [1080, 760], [1080, 620], [470, 620]]), WOODTOP);
  shape(c, () => polyP(c, [[400, 760], [1080, 760], [1080, 850], [400, 850]]), WOODSIDE);
  const p = box(c, 420, 760, 380, 260, 70, -140), h = 260;
  // the book resting across the open top, at the back
  const b0 = -15, b1 = 395, d0 = 0.66, d1 = 1.0, bt = h + 46;
  shape(c, () => polyP(c, [p(b1, d0, h), p(b1, d1, h), p(b1, d1, bt), p(b1, d0, bt)]), COL.blueDk);
  const bf = () => polyP(c, [p(b0, d0, h), p(b1, d0, h), p(b1, d0, bt), p(b0, d0, bt)]);
  shape(c, bf, COL.blue); shape(c, () => polyP(c, [p(b0, d0, h + 9), p(b1, d0, h + 9), p(b1, d0, bt - 9), p(b0, d0, bt - 9)]), COL.paper, 3);
  line(c, [p(b0, d0, h + 22), p(b1, d0, h + 22)], 3, COL.grey);
  shape(c, () => polyP(c, [p(b0, d0, bt), p(b1, d0, bt), p(b1, d1, bt), p(b0, d1, bt)]), COL.blue);
  shape(c, () => polyP(c, [p(60, 0.7, bt), p(330, 0.7, bt), p(330, 0.92, bt), p(60, 0.92, bt)]), COL.paper, 3);
  const [hx, hy] = p(380, 0.5, 230);
  shape(c, () => ell(c, hx, hy, 9, 22), CARDIN, 4);
  pencilH(c, x1, 990, TOP);
  const sx = 300 + wraps * 9;
  if (tape) shape(c, () => rrect(c, 292, TOP - 24, 24, 48, 4), TAPE, 4);
  for (let k = 0; k < wraps; k++) { line(c, [[290 + k * 9, TOP - 14], [298 + k * 9, TOP + 14]], 9, INK); line(c, [[290 + k * 9, TOP - 14], [298 + k * 9, TOP + 14]], 5, STRING); }
  stringLine(c, [[sx, TOP + 14], [sx, bottleTop + 4]]);
  waterBottle(c, sx, bottleTop);
  return sx;
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); tableBand(c, 690);
  const X = 200, Y = 840, w = 600, h = 300, dx = 110, dy = -90, p = box(c, X, Y, w, h, dx, dy);
  void p;
  const tip = [450, 610], dir = [-0.8, -0.6], an = Math.atan2(dir[1], dir[0]), L = 380, s = 1.6;
  shape(c, () => ell(c, tip[0], tip[1], 18, 18), CARDIN, 4);
  const ox = tip[0] - L * dir[0], oy = tip[1] - L * dir[1];
  c.save(); c.translate(ox, oy); c.rotate(an);
  shape(c, () => ell(c, -4, -34, 56, 34), COL.teal, 7); shape(c, () => ell(c, -4, 34, 56, 34), COL.teal, 7);
  shape(c, () => ell(c, -4, -34, 30, 16), BGHOLE, 5); shape(c, () => ell(c, -4, 34, 30, 16), BGHOLE, 5);
  shape(c, () => polyP(c, [[40, -24], [L, 0], [40, 6]]), COL.steelDk, 6); shape(c, () => polyP(c, [[40, -6], [L, 0], [40, 24]]), COL.steel, 6);
  shape(c, () => ell(c, 90, 0, 12, 12), COL.steelDk, 4);
  c.restore();
  hand(c, ox - 70 * s * dir[0], oy - 70 * s * dir[1], an, s, SKIN.adult, CLOTH.adult);
};
// setup.e3.1
const e3_1 = (c: Ctx) => { windlass(c, 150, 0, 700, true); };
// a circular arrow round the bare end: ellipse centre (cx, cy), going down the left side
const turnArrow = (c: Ctx, cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 20; i++) { const a = a0 + ((a1 - a0) * i) / 20; pts.push([cx - rx * Math.sin(a), cy - ry * Math.cos(a)]); }
  arrow(c, pts);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  windlass(c, 150, 4, 640, true);
  arrow(c, [[230, 800], [230, 700]]);
  hand(c, 190, TOP - 95, Math.PI / 2, 1.35, SKIN.child, CLOTH.child);
  turnArrow(c, 125, TOP, 34, 90, 0.3, 2.9);
};
// setup.e3.3
const e3_3 = (c: Ctx) => {
  windlass(c, 150, 7, 540, true);
  const sp = () => rrect(c, 115, 160, 70, 350, 6);
  shape(c, sp, COL.pink); shade(c, sp, COL.purple, 0, -10, 0.35);
  shape(c, () => rrect(c, 188, TOP - 28, 24, 56, 4), TAPE, 4); shape(c, () => rrect(c, 90, TOP - 28, 24, 56, 4), TAPE, 4);
  hand(c, 150 + 84, 175, Math.PI, 1.2, SKIN.child, CLOTH.child);
  turnArrow(c, 150, TOP, 95, 300, 0.55, 2.6);
};

export const su_forcesSimpleMachines = cards("sci.forces.simple-machines.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e3_0, e3_1, e3_2, e3_3]);
