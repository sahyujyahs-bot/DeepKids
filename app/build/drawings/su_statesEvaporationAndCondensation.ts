import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, bowl, rnd, cards } from "./flatKit";

// sci.states.evaporation-and-condensation.L3 · set-up cards. Same clear box, wet cloth, steel tumbler, shelf and stopwatch across an experiment.

const WET = "#8fb3dc", WETDK = "#6a92c2";
const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const dropP = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.4); c.arc(x, y + s * 0.3, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, COL.drop, 3);

// ---------------------------------------------------------------- experiment 1: two clear boxes
const BW = 300, BH = 280, BY = 830;
const tableRoom = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, 690, 1080, 390);
  line(c, [[0, 690], [1080, 690]], 5);
};
// a wet cloth lying flat on the floor of a box, seen through the clear wall
const flatCloth = (c: Ctx, x: number, yb: number, w: number) => {
  shape(c, () => polyP(c, [[x - w * 0.4, yb - 8], [x + w * 0.4, yb - 8], [x + w * 0.31, yb - 44], [x - w * 0.31, yb - 44]]), WET, 5);
  shade(c, () => polyP(c, [[x - w * 0.4, yb - 8], [x + w * 0.4, yb - 8], [x + w * 0.31, yb - 44], [x - w * 0.31, yb - 44]]), WETDK, 0, 14, 0.6);
  for (const k of [-0.2, 0.05, 0.25]) shape(c, () => ell(c, x + w * k, yb - 26, 8, 5), COL.drop, 2.5);
};
// the clear box: kind "open" shows the rim, "lid" has its lid on
const box = (c: Ctx, x: number, kind: "open" | "lid", wet = true) => {
  const yb = BY, h = BH, w = BW;
  shadow(c, x + 24, yb + 8, w * 0.62, 24);
  if (wet) flatCloth(c, x, yb, w);
  const body = () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.46, yb], [x - w * 0.46, yb]]);
  shape(c, body, "rgba(214,236,250,0.5)", 6);
  shine(c, [[x - w * 0.38, yb - h * 0.85], [x - w * 0.34, yb - h * 0.2]], 8);
  if (kind === "open") shape(c, () => ell(c, x, yb - h, w / 2, 20), "rgba(255,255,255,0.3)", 5);
  else {
    shape(c, () => rrect(c, x - w / 2 - 12, yb - h - 28, w + 24, 32, 10), COL.teal, 6);
    shade(c, () => rrect(c, x - w / 2 - 12, yb - h - 28, w + 24, 32, 10), COL.tealDk, 0, 14, 0.7);
  }
};
const lyingLid = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 18, y + 26, 150, 24);
  shape(c, () => polyP(c, [[x - 130, y - 26], [x + 130, y - 26], [x + 150, y + 14], [x - 150, y + 14]]), COL.teal, 6);
  shape(c, () => polyP(c, [[x - 150, y + 14], [x + 150, y + 14], [x + 150, y + 36], [x - 150, y + 36]]), COL.tealDk, 6);
};

// setup.e1.0
const e1s0 = (c: Ctx) => {
  tableRoom(c);
  box(c, 240, "open"); box(c, 640, "open", false);
  // a hand lowering a wet, squeezed cloth into the right box
  shape(c, () => { c.moveTo(540, 250); c.lineTo(740, 250); c.lineTo(745, 420); c.quadraticCurveTo(700, 450, 650, 425); c.quadraticCurveTo(595, 450, 540, 420); c.closePath(); }, WET, 6);
  shade(c, () => { c.moveTo(540, 250); c.lineTo(740, 250); c.lineTo(745, 420); c.quadraticCurveTo(700, 450, 650, 425); c.quadraticCurveTo(595, 450, 540, 420); c.closePath(); }, WETDK, 40, 0, 0.6);
  dropP(c, 600, 500, 12); dropP(c, 690, 530, 12);
  hand(c, 640, 175, Math.PI / 2, 1.7, SKIN.child, CLOTH.child);
  arrow(c, [[850, 250], [850, 420]]);
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  tableRoom(c);
  // the clock on the wall
  shape(c, () => ell(c, 540, 160, 100, 100), COL.orange, 6);
  shape(c, () => ell(c, 540, 160, 80, 80), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[540 + Math.cos(a) * 62, 160 + Math.sin(a) * 62], [540 + Math.cos(a) * 72, 160 + Math.sin(a) * 72]], 4); }
  line(c, [[540, 160], [540, 105]], 7); line(c, [[540, 160], [585, 175]], 7);
  box(c, 220, "lid"); box(c, 570, "open"); lyingLid(c, 890, 800);
  hand(c, 220, 320, Math.PI / 2, 2, SKIN.child, CLOTH.child, true);
  arrow(c, [[410, 290], [410, 470]]);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  const x = 540, yb = 880, w = 600, h = 420, lt = yb - h - 30;
  shadow(c, x + 30, yb + 8, w * 0.62, 26);
  flatCloth(c, x, yb, w);
  const body = () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.46, yb], [x - w * 0.46, yb]]);
  shape(c, body, "rgba(214,236,250,0.5)", 6);
  // the water going up from the cloth, and the drops forming under the lid
  for (const dx of [-110, 0, 120]) line(c, [[x + dx, yb - 70], [x + dx + 16, yb - 140], [x + dx - 14, yb - 210], [x + dx + 10, yb - 280]], 8, "rgba(255,255,255,0.85)");
  for (const [dx, s] of [[-160, 12], [-100, 16], [-40, 13], [30, 17], [100, 13], [160, 15], [-10, 11], [70, 10]]) dropP(c, x + dx, yb - h + 28 + s * 0.4, s);
  dropP(c, x - 70, yb - h + 140, 11); dropP(c, x + 110, yb - h + 170, 10);
  shine(c, [[x - w * 0.4, yb - h * 0.8], [x - w * 0.37, yb - h * 0.3]], 9);
  shape(c, () => rrect(c, x - w / 2 - 14, yb - h - 34, w + 28, 38, 12), COL.teal, 6);
  shade(c, () => rrect(c, x - w / 2 - 14, yb - h - 34, w + 28, 38, 12), COL.tealDk, 0, 17, 0.7);
  // the steel bowl of ice on the lid
  bowl(c, x, lt - 70, 160);
  const r = rnd(5);
  for (const [dx, dy, a] of [[-90, -18, -0.2], [-20, -34, 0.15], [60, -20, -0.1], [-50, 0, 0.1], [30, 4, 0.2], [110, 2, -0.15]]) {
    const cx = x + dx, cy = lt - 70 + dy - 14, s = 40 + r() * 6;
    shape(c, () => rrect(c, cx - s / 2, cy - s / 2, s, s, 8), "#e3f4fb", 5);
    shade(c, () => rrect(c, cx - s / 2, cy - s / 2, s, s, 8), "#a8d4ea", 12, 12, 0.6); void a;
    shine(c, [[cx - s * 0.3, cy - s * 0.1], [cx - s * 0.1, cy - s * 0.3]], 5);
  }
  arrow(c, [[540, 90], [540, 220]]);
};

// ---------------------------------------------------------------- experiment 2: the steel tumbler
const shelfRoom = (c: Ctx, sy: number) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, sy, 1080, 1080 - sy); line(c, [[0, sy], [1080, sy]], 5);
};
// the steel tumbler: open top (rim ellipse); inside(...) draws what is seen in the opening; mist 0..1 dulls the outside
const tumbler = (c: Ctx, x: number, yb: number, wt: number, wb: number, h: number, inside?: (ix: number, iy: number, irx: number, iry: number) => void, mist = 0) => {
  const ry = wt * 0.12, top = yb - h;
  shadow(c, x + wt * 0.12, yb + 6, wt * 0.6, wb * 0.1);
  const body = () => { c.moveTo(x - wt / 2, top); c.lineTo(x + wt / 2, top); c.lineTo(x + wb / 2, yb); c.quadraticCurveTo(x, yb + wb * 0.14, x - wb / 2, yb); c.closePath(); };
  shape(c, body, COL.steel, 6);
  shade(c, body, COL.steelDk, wt * 0.3, 0, 0.7);
  if (mist > 0) {
    c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = "#e8edf0"; c.globalAlpha = mist * 0.8; c.fillRect(x - wt, top, wt * 2, h + 60); c.restore(); c.globalAlpha = 1;
    const r = rnd(21);
    for (let i = 0; i < 90; i++) { const u = r(), v = r(), px = x - wt * 0.48 + u * wt * 0.96, py = top + 30 + v * (h - 30), edge = (wt - (wt - wb) * ((py - top) / h)) / 2; if (Math.abs(px - x) > edge - 16) continue; c.beginPath(); c.arc(px, py, 3 + r() * 4, 0, 7); c.fillStyle = WHITE; c.globalAlpha = 0.85; c.fill(); }
    c.globalAlpha = 1; line(c, [[x - wt * 0.45, top], [x + wt * 0.5, top], [x + wb * 0.5, yb], [x - wb * 0.5, yb]], 0);
    shape(c, body, "rgba(0,0,0,0)", 6);
  } else shine(c, [[x - wt * 0.36, top + h * 0.1], [x - wb * 0.34, yb - h * 0.12]], 14);
  shape(c, () => ell(c, x, top, wt / 2, ry), COL.steel, 6);
  shape(c, () => ell(c, x, top, wt / 2 - 12, ry - 8), COL.steelIn, 4);
  if (inside) { c.save(); c.beginPath(); ell(c, x, top, wt / 2 - 12, ry - 8); c.clip(); inside(x, top, wt / 2 - 12, ry - 8); c.restore(); shape(c, () => ell(c, x, top, wt / 2 - 12, ry - 8), "rgba(0,0,0,0)", 4); }
};
const cube = (c: Ctx, x: number, y: number, s: number, a = 0) => {
  c.save(); c.translate(x, y); c.rotate(a);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.2), "#e3f4fb", 4); shade(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.2), "#a8d4ea", s * 0.3, s * 0.3, 0.6);
  c.restore();
};
const TX = 380, TW = 380, TB = 290, TH = 470;

// setup.e2.0
const e2s0 = (c: Ctx) => {
  shelfRoom(c, 800);
  const yb = 900;
  tumbler(c, TX, yb, TW, TB, TH, (ix, iy, rx, ry) => {
    c.fillStyle = COL.water; c.fillRect(ix - rx, iy - ry, rx * 2, ry * 2);
    cube(c, ix - 70, iy - 4, 36, 0.3); cube(c, ix + 40, iy + 8, 34, -0.2); cube(c, ix + 85, iy - 10, 30, 0.5);
  });
  // the spoon stirring
  thick(c, [[TX - 90, yb - TH + 10], [TX - 160, yb - TH - 160]], 14, COL.steelDk);
  shape(c, () => ell(c, TX - 82, yb - TH + 8, 36, 16, 0.3), COL.steelDk, 4);
  // the jug of ice water, tilted over the tumbler
  const jx = 700, jy = 300, rot = -0.9;
  c.save(); c.translate(jx, jy); c.scale(1.3, 1.3); c.rotate(rot);
  const jb = () => { c.moveTo(-95, -130); c.lineTo(-135, -150); c.lineTo(-95, -108); c.lineTo(-95, 130); c.quadraticCurveTo(0, 150, 95, 130); c.lineTo(95, -130); c.closePath(); };
  shape(c, jb, "rgba(214,236,250,0.65)", 6);
  c.save(); c.beginPath(); jb(); c.clip(); c.rotate(-rot);
  c.fillStyle = COL.water; c.fillRect(-300, 10, 600, 400);
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.5; c.fillRect(-300, 120, 600, 300); c.globalAlpha = 1;
  cube(c, -30, 40, 44, 0.3); cube(c, 40, 70, 40, -0.4); cube(c, -50, 100, 38, 0.2);
  c.restore();
  shape(c, jb, "rgba(0,0,0,0)", 6);
  thick(c, [[95, -100], [150, -90], [150, 20], [95, 40]], 14, COL.teal);
  c.restore();
  // the stream
  thick(c, [[445, 325], [432, 380], [424, 450]], 16, COL.water);
  dropP(c, 400, 400, 9); dropP(c, 470, 380, 8);
  arrow(c, [[560, 60], [480, 110], [420, 200]]);
  hand(c, 915, 125, Math.PI, 1.7, SKIN.child, CLOTH.child);
};
// the phone showing a stopwatch
const phone = (c: Ctx, x: number, yb: number, frac: number) => {
  const w = 170, h = 300;
  shadow(c, x + 20, yb + 4, w * 0.6, 14);
  shape(c, () => rrect(c, x - w / 2, yb - h, w, h, 22), COL.black, 6);
  shape(c, () => rrect(c, x - w / 2 + 12, yb - h + 22, w - 24, h - 44, 10), "#2d3a44", 3);
  const cy = yb - h / 2, r = 54;
  shape(c, () => ell(c, x, cy, r, r), WHITE, 4);
  c.beginPath(); c.moveTo(x, cy); c.arc(x, cy, r - 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.closePath(); c.fillStyle = RED; c.fill();
  shape(c, () => ell(c, x, cy, r, r), "rgba(0,0,0,0)", 4);
  line(c, [[x, cy], [x, cy - r + 10]], 5);
};
const mirror = (c: Ctx, foggy: boolean) => {
  shape(c, () => rrect(c, 60, 50, 380, 300, 28), "#e7f1f6", 8);
  shine(c, [[110, 100], [160, 300]], 12);
  if (foggy) { c.fillStyle = WHITE; c.globalAlpha = 0.7; for (const [fx, fy, fr] of [[230, 150, 100], [340, 230, 110], [160, 270, 70], [370, 110, 60]]) { c.beginPath(); c.arc(fx, fy, fr, 0, 7); c.fill(); } c.globalAlpha = 1; }
  shape(c, () => rrect(c, 60, 50, 380, 300, 28), "rgba(0,0,0,0)", 8);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  shelfRoom(c, 780);
  mirror(c, true);
  shape(c, () => rrect(c, 0, 780, 1080, 60), COL.brown, 6);
  const yb = 780, x = 640;
  phone(c, 210, yb, 0.08);
  tumbler(c, x, yb, TW, TB, TH);
  // the cloth wiping the outside
  shape(c, () => rrect(c, x + 125, 510, 90, 170, 22), COL.cloth, 6);
  shade(c, () => rrect(c, x + 125, 510, 90, 170, 22), "#e4dccb", 24, 0, 0.8);
  hand(c, 940, 600, Math.PI, 1.6, SKIN.child, CLOTH.child);
  arrow(c, [[900, 480], [900, 380]]);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  shelfRoom(c, 900);
  const x = 540, yb = 900, wt = 540, wb = 420, h = 660;
  shadow(c, x + 80, yb + 30, 300, 30);
  tumbler(c, x, yb, wt, wb, h, undefined, 1);
  const r = rnd(33);
  // drops running down the dull steel
  for (const [dx, dy, len] of [[-170, 360, 120], [-80, 300, 160], [20, 420, 100], [110, 330, 190], [190, 380, 130], [-30, 560, 90], [-140, 540, 110], [150, 590, 80]]) {
    const px = x + dx, py = yb - h + dy; void r;
    line(c, [[px, py - len], [px + 2, py]], 12, "rgba(255,255,255,0.9)");
    shape(c, () => ell(c, px + 2, py + 4, 15, 20), COL.drop, 4);
  }
  // water gathered at the foot
  shape(c, () => ell(c, x, yb + 22, 270, 20), "rgba(143,195,234,0.8)", 4);
};

export const su_statesEvaporationAndCondensation = cards("sci.states.evaporation-and-condensation.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2]);
