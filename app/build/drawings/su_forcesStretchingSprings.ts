import type { Ctx } from "./core";
import {
  D, INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow,
  hand, person, write, cards,
} from "./flatKit";

// sci.forces.stretching-springs.L3 set-up cards. Shared things: a blue rubber band, a wooden ruler in cm,
// a paper cup, yellow coins, a pencil on two chairs, a tennis ball, a ball of dough, a paper strip on a wall.
const FLOOR = "#e2d2b0", FLOORLN = "#bfae88", TILE = "#ead9b8";
const BAND = COL.blue;
const DOUGH = "#ecd3a2", DOUGHDK = "#cfae78";
const STRAW = "#f3d98b", STRAWDK = "#d9b45a";
const BALL = "#d4e24a", BALLDK = "#a9b82a";

const dash = (c: Ctx, on: number[], f: () => void) => { c.save(); c.setLineDash(on); f(); c.restore(); };
const sleeveTape = "rgba(255,240,170,0.9)";

// wall behind, floor in front from y = top
const room = (c: Ctx, top = 840) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, top, D, D - top);
  line(c, [[0, top], [D, top]], 6);
};

// a rubber band lying flat (a stadium loop) with its top-left at (x, y)
const bandFlat = (c: Ctx, x: number, y: number, w: number, h: number, t = 14) => {
  for (const [col, lw] of [[INK, t + 9], [BAND, t]] as [string, number][]) { c.beginPath(); rrect(c, x, y, w, h, h / 2); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = "round"; c.stroke(); }
  shine(c, [[x + h * 0.5, y - 1], [x + w * 0.5, y - 1]], 4);
};
const coin = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  shape(c, () => ell(c, x, y, r, r * 0.8, rot), COL.yellow, 5);
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.5, rot), COL.orange, 0);
  c.beginPath(); ell(c, x, y, r * 0.62, r * 0.5, rot); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};

// a ruler lying across the card; 0 at zeroX, steps of `step` px per cm, n cm, labels every `lab`; dir -1 = counting leftwards
const rulerH = (c: Ctx, x: number, y: number, w: number, h: number, zeroX: number, step: number, n: number, lab: number, dir = 1, size = 28) => {
  shadow(c, x + w / 2 + 10, y + h + 12, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood);
  shade(c, () => rrect(c, x, y, w, h, 8), COL.woodDk, 0, h * 0.82, 0.7);
  for (let i = 0; i <= n; i++) {
    const tx = zeroX + dir * i * step;
    line(c, [[tx, y + 2], [tx, y + (i % lab === 0 ? h * 0.38 : h * 0.24)]], i % lab === 0 ? 5 : 3);
    if (i < n) line(c, [[tx + dir * step / 2, y + 2], [tx + dir * step / 2, y + h * 0.14]], 2.5);
    if (i % lab === 0) write(c, String(i), tx - String(i).length * 0.4 * size + size * 0.1, y + h * 0.42, size, INK, 5);
  }
};
// the same standing upright; 0 at zeroY going down
const rulerV = (c: Ctx, x: number, y: number, w: number, h: number, zeroY: number, step: number, n: number, lab: number, size = 24) => {
  shape(c, () => rrect(c, x, y, w, h, 7), COL.wood);
  shade(c, () => rrect(c, x, y, w, h, 7), COL.woodDk, w * 0.8, 0, 0.7);
  for (let i = 0; i <= n; i++) {
    const ty = zeroY + i * step;
    line(c, [[x + 2, ty], [x + (i % lab === 0 ? w * 0.45 : w * 0.28), ty]], i % lab === 0 ? 4.5 : 3);
    if (i % lab === 0) write(c, String(i), x + w * 0.5, ty - size * 0.5, size, INK, 4.5);
  }
};

// ---------------------------------------------------------------- the hanging band on two chairs
const chair = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 30, y + 8, 125, 18);
  for (const lx of [-92, 62]) shape(c, () => rrect(c, x + lx, y - 300, 30, 300, 6), COL.brown);
  shape(c, () => rrect(c, x - 112, y - 330, 224, 44, 10), COL.wood);
  shade(c, () => rrect(c, x - 112, y - 330, 224, 44, 10), COL.woodDk, 0, 22, 0.7);
  for (const lx of [-92, 62]) shape(c, () => rrect(c, x + lx, y - 620, 30, 300, 6), COL.brown);
  shape(c, () => rrect(c, x - 104, y - 520, 208, 34, 8), COL.wood);
  shape(c, () => rrect(c, x - 108, y - 628, 216, 46, 10), COL.wood);
  shade(c, () => rrect(c, x - 108, y - 628, 216, 46, 10), COL.woodDk, 0, 24, 0.7);
};
const pencil = (c: Ctx, x0: number, x1: number, y: number) => {
  const r = 15;
  shape(c, () => polyP(c, [[x0, y], [x0 + 50, y - r], [x0 + 50, y + r]]), "#f1d9a8", 5);
  shape(c, () => polyP(c, [[x0, y], [x0 + 18, y - 5.5], [x0 + 18, y + 5.5]]), INK, 2);
  shape(c, () => rrect(c, x0 + 50, y - r, x1 - x0 - 90, 2 * r, 3), COL.yellow, 5);
  shade(c, () => rrect(c, x0 + 50, y - r, x1 - x0 - 90, 2 * r, 3), COL.orange, 0, r * 0.9, 0.6);
  shape(c, () => rrect(c, x1 - 40, y - r, 18, 2 * r, 2), COL.steel, 5);
  shape(c, () => rrect(c, x1 - 22, y - r, 24, 2 * r, 8), COL.pink, 5);
};
const paperCup = (c: Ctx, x: number, top: number) => {
  const h = 150, tw = 72, bw = 48;
  shadow(c, x + 14, top + h + 6, 70, 12);
  shape(c, () => polyP(c, [[x - tw, top], [x + tw, top], [x + bw, top + h], [x - bw, top + h]]), WHITE, 5);
  shade(c, () => polyP(c, [[x - tw, top], [x + tw, top], [x + bw, top + h], [x - bw, top + h]]), "#d8d2c4", 38, 0, 0.7);
  c.save(); c.beginPath(); polyP(c, [[x - tw, top], [x + tw, top], [x + bw, top + h], [x - bw, top + h]]); c.clip();
  c.fillStyle = COL.teal; c.fillRect(x - 100, top + 50, 200, 40); c.restore();
  line(c, [[x - 63, top + 50], [x + 63, top + 50]], 4); line(c, [[x - 57, top + 90], [x + 57, top + 90]], 4);
  shape(c, () => ell(c, x, top, tw, 14), "#f3eee0", 5);
};
// pencil, chairs, ruler, band down to bb, cup, n coins in it; the floor is at y = 900
const HX = 540;
const hangSet = (c: Ctx, bb: number, coins = 0) => {
  chair(c, 240, 900); chair(c, 840, 900);
  pencil(c, 175, 905, 285);
  // the ruler, taped under the pencil at its top
  rulerV(c, 372, 292, 56, 560, 308, 30, 17, 2);
  shape(c, () => rrect(c, 362, 276, 76, 30, 4), sleeveTape, 4);
  // the band: a long loop over the pencil, the cup string hooked on its lower end
  for (const [col, lw] of [[INK, 21], [BAND, 12]] as [string, number][]) { c.beginPath(); rrect(c, HX - 24, 262, 48, bb - 262 + 20, 24); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); }
  const rim = bb + 80;
  line(c, [[HX - 62, rim], [HX, bb + 8], [HX + 62, rim]], 8, INK); line(c, [[HX - 62, rim], [HX, bb + 8], [HX + 62, rim]], 3.5, "#f5efe0");
  paperCup(c, HX, rim);
  for (let i = 0; i < coins; i++) coin(c, HX - 36 + (i % 3) * 36 + (i > 2 ? 18 : 0), rim - 4 - Math.floor(i / 3) * 14, 24, 0.2 * i);
};

// ---------------------------------------------------------------- more shared things
// a pen spring: wire loops from x0 to x1 (tight when x1 - x0 is small), a ring at each end
const spring = (c: Ctx, x0: number, x1: number, y: number, amp: number, turns: number) => {
  const pitch = (x1 - x0) / turns, r = pitch * 0.42, per = 18;
  const at = (th: number): number[] => [x0 + (pitch * th) / (Math.PI * 2) - r * Math.cos(th) + r, y + amp * Math.sin(th)];
  for (let k = 0; k < turns * 2; k++) {
    const pts: number[][] = [];
    for (let i = 0; i <= per; i++) pts.push(at(Math.PI * (k + i / per)));
    line(c, pts, 21, INK); line(c, pts, 12, k % 2 ? COL.steelDk : COL.steel);
  }
  for (const [rx, dir] of [[x0, -1], [x1, 1]] as [number, number][]) {
    c.beginPath(); ell(c, rx + dir * 26, y, 22, 20); c.strokeStyle = INK; c.lineWidth = 21; c.stroke();
    c.beginPath(); ell(c, rx + dir * 26, y, 22, 20); c.strokeStyle = COL.steel; c.lineWidth = 12; c.stroke();
  }
};
// the child's wrist (where hand() goes) for a person at (x, y), height h, arm angles
const wristOf = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number], sit = false) => {
  const sx = x + side * h * 0.11, sy = (sit ? y - h * 0.38 : y - h * 0.74) + h * 0.03;
  const ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const tennis = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), BALL, 6);
  shade(c, () => ell(c, x, y, r, r), BALLDK, r * 0.38, r * 0.3, 0.7);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  c.beginPath(); c.arc(x - r * 1.2, y, r * 0.95, -0.85, 0.85); c.strokeStyle = WHITE; c.lineWidth = r * 0.13; c.stroke();
  c.beginPath(); c.arc(x + r * 1.2, y, r * 0.95, Math.PI - 0.85, Math.PI + 0.85); c.stroke();
  c.restore(); c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const doughBall = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.95), DOUGH, 6);
  shade(c, () => ell(c, x, y, r, r * 0.95), DOUGHDK, r * 0.36, r * 0.3, 0.8);
  line(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.2, y - r * 0.62]], 5, WHITE);
};
// a paper strip taped to the wall, marked every 10 cm; 0 at the floor line (y = 840), 100 at y = 300
const stripV = (c: Ctx, x: number) => {
  const w = 110;
  shadow(c, x + w / 2 + 14, 850, w / 2 + 8, 12);
  c.fillStyle = SH; c.fillRect(x + 12, 276, w, 572);
  shape(c, () => rrect(c, x, 264, w, 582, 4), COL.paper, 5);
  for (let i = 0; i <= 10; i++) {
    const ty = 840 - i * 54;
    line(c, [[x + 3, ty], [x + (i % 5 === 0 ? 34 : 22), ty]], i % 5 === 0 ? 5 : 3.5);
    write(c, String(i * 10), x + 40, ty - 11, 22, INK, 4);
  }
  for (const ty of [252, 832]) shape(c, () => rrect(c, x - 10, ty, w + 20, 34, 4), sleeveTape, 4);
};

// ---------------------------------------------------------------- the card functions

// setup.e1.0
const e1_0 = (c: Ctx) => {
  room(c);
  hangSet(c, 450);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  room(c);
  c.save(); c.translate(355, 306); c.scale(0.66, 0.66); hangSet(c, 450); c.restore();
  // the child sits on the floor, eyes level with the bottom of the band
  person(c, 190, 900, 560, { sit: true, armL: [1.9, 1.2], armR: [1.2, 0.6] });
  dash(c, [14, 12], () => line(c, [[236, 612], [660, 603]], 5, RED));
  // the results table on the floor
  c.save(); c.translate(0, 0);
  shape(c, () => polyP(c, [[70, 940], [430, 940], [480, 1060], [20, 1060]]), WHITE, 5);
  line(c, [[250, 940], [250, 1060]], 4); line(c, [[58, 980], [455, 980]], 4); line(c, [[40, 1020], [468, 1020]], 4);
  write(c, "0", 130, 945, 26, INK, 5); write(c, "5", 125, 985, 26, INK, 5); write(c, "10", 105, 1025, 26, INK, 5);
  write(c, "6", 330, 945, 26, INK, 5); write(c, "9", 330, 985, 26, INK, 5); write(c, "13", 310, 1025, 26, INK, 5);
  c.restore();
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  room(c);
  hangSet(c, 540);
  // where the bottom of the band was before
  dash(c, [12, 10], () => line(c, [[430, 458], [520, 458]], 5, RED));
  // the hand lets 5 coins fall into the cup
  coin(c, 690, 440, 30, 0.3);
  coin(c, 650, 485, 30, 1.0); coin(c, 600, 515, 30, 0.5); coin(c, 606, 566, 30, 1.3); coin(c, 566, 612, 30, 0.2);
  hand(c, 830, 400, 2.9, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[470, 450], [470, 545]]);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  rulerH(c, 100, 640, 900, 110, 170, 70, 11, 1, 1, 32);
  spring(c, 170, 640, 490, 52, 7);
  dash(c, [10, 9], () => line(c, [[666, 560], [666, 640]], 5, RED));
  // a fingertip holds the spring's end at 0; the other hand pulls the far end out to a mark
  hand(c, 150, 330, 1.35, 1.7, SKIN.child, CLOTH.child, true);
  hand(c, 790, 490, Math.PI, 1.4, SKIN.child, CLOTH.child, false);
  arrow(c, [[830, 380], [980, 380]]);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  room(c, 780);
  // grout lines of the floor, and the tape start line
  for (const y of [800, 850, 925, 1030]) line(c, [[0, y], [D, y]], 3, FLOORLN);
  for (let k = -2; k < 9; k++) line(c, [[k * 190, 785], [k * 190 + 100, 1080]], 3, FLOORLN);
  shape(c, () => polyP(c, [[580, 786], [622, 786], [706, 1080], [650, 1080]]), COL.teal, 5);
  const sit = { sit: true, armL: [0.1, 0.0] as [number, number], armR: [0.15, 0.0] as [number, number] };
  person(c, 170, 930, 620, sit);
  // the ruler held flat, level; the band hooked over the 0 end
  const [wx, wy] = wristOf(170, 930, 620, 1, sit.armR, true);
  rulerH(c, 310, wy - 33, 600, 66, 900, 20, 30, 10, -1, 24);
  hand(c, wx - 20, wy + 4, 0, 1.15, SKIN.child, CLOTH.child, false);
  for (const [col, lw] of [[INK, 22], [BAND, 12]] as [string, number][]) { c.beginPath(); ell(c, 906, wy, 26, 52); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); }
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  rulerH(c, 110, 520, 860, 120, 900, 66, 12, 2, -1, 34);
  // the band hooked over the 0 end, pulled back along the ruler to 10 cm
  const band = () => { c.beginPath(); c.moveTo(930, 548); c.lineTo(270, 580); c.lineTo(930, 612); c.quadraticCurveTo(1010, 580, 930, 548); c.closePath(); };
  for (const [col, lw] of [[INK, 23], [BAND, 14]] as [string, number][]) { band(); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = "round"; c.stroke(); }
  // thumb and finger pinching the band
  shape(c, () => rrect(c, 12, 470, 80, 220, 18), CLOTH.child, 6);
  shape(c, () => { c.moveTo(70, 480); c.lineTo(200, 500); c.lineTo(200, 680); c.lineTo(70, 690); c.closePath(); }, SKIN.child, 6);
  line(c, [[170, 520], [262, 573]], 62, INK); line(c, [[170, 520], [262, 573]], 50, SKIN.child);
  line(c, [[170, 665], [262, 600]], 62, INK); line(c, [[170, 665], [262, 600]], 50, SKIN.childDk);
  shape(c, () => ell(c, 258, 574, 14, 11, 0.5), "#e7b392", 3); shape(c, () => ell(c, 258, 602, 14, 11, -0.5), "#e7b392", 3);
  arrow(c, [[780, 400], [440, 400]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  c.fillStyle = TILE; c.fillRect(0, 0, D, D);
  for (let k = 0; k < 7; k++) { line(c, [[150 + k * 190, 0], [150 + k * 190, D]], 5, FLOORLN); line(c, [[0, 90 + k * 190], [D, 90 + k * 190]], 5, FLOORLN); }
  shape(c, () => rrect(c, 100, -10, 54, 1100, 0), COL.teal, 5);
  const num = (t: string, x: number) => write(c, t, x, 515, 100, "#a58f62", 12);
  num("1", 213); num("2", 403); num("3", 593);
  bandFlat(c, 755, 520, 150, 72, 15);
  coin(c, 960, 640, 36);
  hand(c, 330, 735, -1.0, 1.7, SKIN.child, CLOTH.child, true);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  rulerH(c, 50, 60, 1000, 100, 80, 56, 17, 5, 1, 30);
  const row = (y: number, xEnd: number, draw: () => void) => { dash(c, [10, 10], () => line(c, [[xEnd, 168], [xEnd, y + 60]], 4, "rgba(43,35,64,0.45)")); draw(); };
  row(330, 528, () => bandFlat(c, 80, 285, 448, 100, 20));
  row(530, 640, () => {
    shadow(c, 360, 578, 290, 14);
    shape(c, () => rrect(c, 80, 500, 560, 66, 8), COL.pink, 5);
    shade(c, () => rrect(c, 80, 500, 560, 66, 8), "#d9768f", 0, 38, 0.6);
    shine(c, [[110, 515], [400, 515]], 6);
  });
  row(730, 696, () => {
    const p = () => { c.beginPath(); c.moveTo(100, 730); for (let i = 1; i <= 40; i++) c.lineTo(100 + i * 14.9, 730 + Math.sin(i * 0.4) * 10); };
    shadow(c, 390, 778, 310, 14);
    p(); c.strokeStyle = INK; c.lineWidth = 56; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
    p(); c.strokeStyle = DOUGH; c.lineWidth = 44; c.stroke();
    line(c, [[110, 722], [600, 724]], 6, WHITE);
  });
  row(920, 864, () => {
    shadow(c, 470, 948, 400, 8);
    line(c, [[80, 920], [864, 920]], 26, INK); line(c, [[80, 920], [864, 920]], 16, STRAW);
    line(c, [[90, 925], [850, 925]], 5, STRAWDK);
  });
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  rulerH(c, 60, 740, 940, 110, 200, 36, 20, 5, 1, 32);
  // the plastic strip pulled to about twice its length
  shadow(c, 560, 515, 380, 14);
  shape(c, () => rrect(c, 200, 440, 720, 52, 8), COL.pink, 5);
  shade(c, () => rrect(c, 200, 440, 720, 52, 8), "#d9768f", 0, 30, 0.6);
  shine(c, [[240, 452], [800, 452]], 5);
  hand(c, 160, 385, 1.0, 1.35, SKIN.child, CLOTH.child, false);
  hand(c, 960, 385, Math.PI - 1.0, 1.35, SKIN.child, CLOTH.child, false);
  arrow(c, [[150, 640], [50, 640]]); arrow(c, [[970, 640], [1050, 640]]);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  rulerH(c, 60, 740, 940, 110, 200, 36, 20, 5, 1, 32);
  // the strip stays long and thin; the band is back to its first size
  const ghost = () => rrect(c, 200, 545, 360, 66, 8);
  dash(c, [12, 10], () => { c.beginPath(); ghost(); c.strokeStyle = "rgba(43,35,64,0.5)"; c.lineWidth = 5; c.stroke(); });
  shadow(c, 480, 600, 300, 12);
  shape(c, () => rrect(c, 200, 565, 580, 28, 6), COL.pink, 5);
  shade(c, () => rrect(c, 200, 565, 580, 28, 6), "#d9768f", 0, 16, 0.6);
  bandFlat(c, 200, 230, 320, 90, 18);
};

// setup.e3.3
const e3_3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 990, 400, 20);
  const piece = (pts: number[][]) => { line(c, pts, 26, INK); line(c, pts, 15, STRAW); };
  piece([[170, 740], [235, 520], [420, 420], [490, 455]]);
  piece([[910, 740], [845, 520], [660, 420], [590, 455]]);
  line(c, [[498, 428], [470, 380]], 5); line(c, [[566, 430], [592, 384]], 5); line(c, [[534, 410], [534, 350]], 5);
  for (const [x, y, r] of [[520, 560, 0.3], [575, 620, 1.1], [500, 690, 0.7]]) line(c, [[x, y], [x + Math.cos(r) * 26, y + Math.sin(r) * 26]], 12, INK), line(c, [[x, y], [x + Math.cos(r) * 26, y + Math.sin(r) * 26]], 6, STRAW);
  hand(c, 132, 840, -1.2, 1.5, SKIN.child, CLOTH.child, false);
  hand(c, 948, 840, Math.PI + 1.2, 1.5, SKIN.child, CLOTH.child, false);
  arrow(c, [[300, 960], [420, 960]]); arrow(c, [[780, 960], [660, 960]]);
};

// setup.e4.0
const e4_0 = (c: Ctx) => {
  room(c);
  stripV(c, 180);
  for (const [x, r, k] of [[500, 84, 0], [710, 74, 1], [905, 80, 2]]) {
    shadow(c, x + 14, 936, r * 0.95, r * 0.16);
    if (k === 0) tennis(c, x, 930 - r, r); else if (k === 1) { shape(c, () => ell(c, x, 930 - r, r, r), COL.red, 6); shade(c, () => ell(c, x, 930 - r, r, r), "#b83a28", r * 0.35, r * 0.3, 0.7); line(c, [[x - r * 0.5, 930 - r * 1.5], [x - r * 0.15, 930 - r * 1.62]], 6, WHITE); } else doughBall(c, x, 930 - r, r);
  }
};

// setup.e4.1
const e4_1 = (c: Ctx) => {
  room(c);
  stripV(c, 700);
  const arms = { armL: [1.5, 1.6] as [number, number], armR: [-1.1, -0.5] as [number, number] };
  person(c, 200, 930, 620, arms);
  const [wx, wy] = wristOf(200, 930, 620, 1, arms.armR);
  const bx = wx + 77 * Math.cos(-0.5), by = wy + 77 * Math.sin(-0.5);
  tennis(c, bx, by, 50);
  hand(c, wx, wy, -0.5, 1.1, SKIN.child, CLOTH.child, false);
  dash(c, [14, 12], () => line(c, [[bx + 60, 300], [690, 300]], 5, RED));
  arrow(c, [[bx + 10, by + 90], [bx + 10, by + 250]]);
};

// setup.e4.2
const e4_2 = (c: Ctx) => {
  room(c);
  stripV(c, 700);
  person(c, 230, 930, 700, { sit: true, adult: true, armL: [1.4, 1.5], armR: [1.4, 1.5] });
  shadow(c, 570, 936, 52, 9);
  tennis(c, 560, 560, 52);
  arrow(c, [[560, 880], [560, 660]]);
  dash(c, [14, 12], () => line(c, [[330, 560], [690, 560]], 5, RED));
};

// setup.e4.3
const e4_3 = (c: Ctx) => {
  room(c);
  stripV(c, 700);
  dash(c, [12, 10], () => { c.beginPath(); ell(c, 480, 352, 52, 50); c.strokeStyle = "rgba(43,35,64,0.55)"; c.lineWidth = 6; c.stroke(); });
  arrow(c, [[480, 430], [480, 800]]);
  shadow(c, 500, 944, 175, 16);
  shape(c, () => ell(c, 480, 915, 165, 36), DOUGH, 6);
  shade(c, () => ell(c, 480, 915, 165, 36), DOUGHDK, 40, 14, 0.8);
  line(c, [[370, 900], [470, 890]], 6, WHITE);
};

export const su_forcesStretchingSprings = cards("sci.forces.stretching-springs.L3 set-up", [
  e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e3_3, e4_0, e4_1, e4_2, e4_3,
]);
