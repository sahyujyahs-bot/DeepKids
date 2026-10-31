import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, cards } from "./flatKit";

// FRICTION L3 set-up cards: two notebooks whose pages interleave (e2), and damp sand (e3).
const BOOK_L = COL.teal, BOOK_LDK = COL.tealDk, BOOK_R = COL.orange, BOOK_RDK = "#d27c25";
const TABLE = "#e6d3b0";

// a notebook seen from above, spine on the outer side; edge = the open side showing a block of pages
const bookTop = (c: Ctx, x: number, y: number, w: number, h: number, left: boolean) => {
  const col = left ? BOOK_L : BOOK_R, dk = left ? BOOK_LDK : BOOK_RDK, sp = 56, body = () => rrect(c, x, y, w, h, 12);
  shadow(c, x + w / 2 + 16, y + h + 8, w * 0.52, 26);
  shape(c, body, col, 6);
  shade(c, body, dk, 14, 14, 0.5);
  const sx = left ? x : x + w - sp;
  shape(c, () => rrect(c, sx, y, sp, h, 12), dk, 6);
  for (let k = 0; k < 4; k++) { const sy = y + h * (0.16 + k * 0.22); line(c, [[sx + 10, sy], [sx + sp - 10, sy]], 5, WHITE); }
  // the open side: a block of white pages peeking out past the cover
  const ex = left ? x + w - 6 : x - 34;
  shape(c, () => rrect(c, ex, y + 10, 40, h - 20, 6), WHITE, 5);
  for (let k = 1; k < 5; k++) { const lx = ex + 8 * k; line(c, [[lx, y + 22], [lx, y + h - 22]], 2.5, COL.grey); }
  // a label on the cover
  shape(c, () => rrect(c, x + (left ? 120 : 90), y + h * 0.28, 120, h * 0.3, 8), COL.paper, 5);
};

// a side-on stack of two notebooks whose pages are laid over each other one at a time, spines at the ends
const pagesLayer = (c: Ctx, x: number, w: number, yTop: number, lh: number, k: number) => {
  const b = () => rrect(c, x, yTop, w, lh, 5);
  shape(c, b, k % 2 ? COL.paper : WHITE, 4);
  shade(c, b, COL.grey, 0, 8, 0.45);
  line(c, [[x + 14, yTop + lh * 0.45], [x + w - 14, yTop + lh * 0.45]], 2, COL.grey);
};
const stack = (c: Ctx, o: { xl: number; xr: number; w: number; yb: number; lh: number; n: number }) => {
  const { xl, xr, w, yb, lh, n } = o, mid = (xl + xr) / 2, top = yb - lh - n * lh, spW = 36;
  shadow(c, mid + 16, yb + 8, (xr - xl) / 2 + 20, 24);
  shape(c, () => rrect(c, xl, yb - lh, mid - xl - 6, lh, 8), BOOK_L, 6);
  shape(c, () => rrect(c, mid + 6, yb - lh, xr - mid - 6, lh, 8), BOOK_R, 6);
  for (let k = 0; k < n; k++) {
    const yt = yb - lh - (k + 1) * lh;
    if (k % 2 === 0) pagesLayer(c, xl + spW - 6, w, yt, lh, k); else pagesLayer(c, xr - spW + 6 - w, w, yt, lh, k);
  }
  shape(c, () => rrect(c, xl, top, spW, yb - top, 8), BOOK_LDK, 6);
  shape(c, () => rrect(c, xr - spW, top, spW, yb - top, 8), BOOK_RDK, 6);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, TABLE);
  c.translate(0, 70);
  bookTop(c, 100, 330, 480, 420, true);
  bookTop(c, 500, 360, 480, 420, false);
  arrow(c, [[150, 230], [330, 230]]);
  arrow(c, [[930, 230], [750, 230]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, TABLE);
  c.save(); c.translate(0, 20);
  stack(c, { xl: 90, xr: 990, w: 480, yb: 760, lh: 34, n: 6 });
  // page 7, from the left book, being laid down
  pagesLayer(c, 130, 480, 478, 34, 6);
  hand(c, 96, 495, 0, 1.15, SKIN.child, CLOTH.child);
  // page 8, from the right book, held ready
  pagesLayer(c, 470, 480, 372, 34, 7);
  hand(c, 984, 389, Math.PI, 1.15, SKIN.child, CLOTH.child);
  arrow(c, [[300, 378], [300, 462]]);
  c.restore();
};

// a child straining to pull, hands on the spine, facing right; feet at (x, y)
const puller = (c: Ctx, x: number, y: number, h: number, wristY: number) => {
  person(c, x, y, h, { armR: [0.9, -0.5] });
  const sh = y - h * 0.74, head = h * 0.13, hy = sh - head * 1.05;
  // a straining face over the smile: teeth gritted, brows pulled down
  shape(c, () => ell(c, x, hy + head * 0.55, head * 0.5, head * 0.28), SKIN.child, 0);
  shape(c, () => rrect(c, x - head * 0.32, hy + head * 0.46, head * 0.64, head * 0.24, head * 0.06), WHITE, 4);
  line(c, [[x - head * 0.32, hy + head * 0.58], [x + head * 0.32, hy + head * 0.58]], 3);
  line(c, [[x - head * 0.65, hy - head * 0.22], [x - head * 0.12, hy - head * 0.02]], 6);
  line(c, [[x + head * 0.65, hy - head * 0.22], [x + head * 0.12, hy - head * 0.02]], 6);
  hand(c, x + 180, wristY, 0, 1.15, SKIN.child, CLOTH.child);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, TABLE);
  c.save(); c.translate(0, 10);
  shadow(c, 150, 936, 120, 24); shadow(c, 930, 936, 120, 24);
  stack(c, { xl: 346, xr: 734, w: 250, yb: 700, lh: 40, n: 6 });
  puller(c, 120, 930, 560, 580);
  c.save(); c.translate(D, 0); c.scale(-1, 1); puller(c, 120, 930, 560, 580); c.restore();
  arrow(c, [[330, 320], [150, 320]]);
  arrow(c, [[750, 320], [930, 320]]);
  c.restore();
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c, TABLE);
  // the tray with dry sand and one damp patch where the water falls
  shadow(c, 560, 930, 460, 36);
  shape(c, () => polyP(c, [[190, 600], [890, 600], [1000, 880], [80, 880]]), COL.steel, 6);
  shape(c, () => polyP(c, [[80, 880], [1000, 880], [1000, 930], [80, 930]]), COL.steelDk, 6);
  const sand = () => polyP(c, [[220, 625], [860, 625], [950, 850], [130, 850]]);
  shape(c, sand, "#ecd39b", 5);
  c.save(); c.beginPath(); sand(); c.clip();
  shape(c, () => ell(c, 470, 740, 190, 70), "#a98350", 0);
  shape(c, () => ell(c, 470, 748, 120, 40), "#8f6b3e", 0);
  const g = [[300, 670], [640, 660], [760, 720], [250, 800], [700, 810], [820, 780], [380, 840], [560, 650]];
  g.forEach(([gx, gy]) => shape(c, () => ell(c, gx, gy, 6, 4), "#c9a96a", 0));
  c.restore();
  line(c, [[130, 850], [950, 850]], 4);
  // the spoon, tipped, with drops falling
  const bx = 540, by = 385;
  line(c, [[830, 232], [bx + 40, by + 10]], 30, INK); line(c, [[830, 232], [bx + 40, by + 10]], 18, COL.steel);
  shape(c, () => ell(c, bx, by, 90, 55, 0.35), COL.steel, 6);
  shape(c, () => ell(c, bx - 2, by, 68, 38, 0.35), COL.steelIn, 4);
  shape(c, () => ell(c, bx - 12, by + 4, 48, 20, 0.35), COL.water, 0);
  hand(c, 880, 200, 2.6, 1.3, SKIN.child, CLOTH.child);
  const drop = (dx: number, dy: number, s: number) => shape(c, () => { c.moveTo(dx, dy - 30 * s); c.quadraticCurveTo(dx + 24 * s, dy + 6 * s, dx, dy + 22 * s); c.quadraticCurveTo(dx - 24 * s, dy + 6 * s, dx, dy - 30 * s); c.closePath(); }, COL.water, 4);
  drop(462, 475, 1); drop(466, 548, 1.1); drop(470, 628, 1.2);
};

export const su_forcesFriction = cards("sci.forces.friction.L3 set-up", [e2_0, e2_1, e2_2, e3_1]);
