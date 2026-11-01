import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// ENERGY AROUND US · experiments: marble drop into atta (e1) and tumblers in sun and shade (e2).
// Same tub, atta, marble and tumbler on every card of one experiment.

const ATTA = "#f3ead8", ATTA_DK = "#d8cbb2", RAGI = "#5b4030", FLOOR = "#e4d3b3", WALL = "#f6efe0";
const WARM = "#f7e3a6", COOL = "#cfd6e6";

// ---------------------------------------------------------------- shared pieces
// a hand coming from the right, pointing left (the kit hand mirrored)
const handL = (c: Ctx, x: number, y: number, an: number, s: number) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, an, s); c.restore(); };
// dark ragi dust: little specks inside an ellipse
const dust = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n: number, seedN: number) => {
  const r = rnd(seedN); c.save(); c.beginPath(); ell(c, cx, cy, rx, ry); c.clip();
  for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()); c.beginPath(); ell(c, cx + Math.cos(a) * d * rx, cy + Math.sin(a) * d * ry, 3 + r() * 4, 2 + r() * 3, r() * 3); c.fillStyle = RAGI; c.globalAlpha = 0.55 + r() * 0.4; c.fill(); }
  c.restore(); c.globalAlpha = 1;
};
// the plastic tub seen from the side and above: rim centre (cx, cy), rim radii rx, ry, body depth
const tub = (c: Ctx, cx: number, cy: number, rx: number, ry: number, depth: number, n = 160) => {
  shadow(c, cx + rx * 0.08, cy + depth + ry * 0.55, rx * 1.02, ry * 0.5);
  const body = () => { c.moveTo(cx - rx, cy); c.lineTo(cx - rx * 0.9, cy + depth); c.bezierCurveTo(cx - rx * 0.6, cy + depth + ry * 1.5, cx + rx * 0.6, cy + depth + ry * 1.5, cx + rx * 0.9, cy + depth); c.lineTo(cx + rx, cy); c.closePath(); };
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, -rx * 0.3, 0, 0.6);
  shape(c, () => ell(c, cx, cy, rx, ry), COL.blue);
  shape(c, () => ell(c, cx, cy + 4, rx - 24, ry - 14), ATTA, 5);
  dust(c, cx, cy + 4, rx - 28, ry - 18, n, 11);
};
// a newspaper flat on the floor
const newspaper = (c: Ctx, x0: number, y0: number, x1: number, y1: number, skew: number) => {
  shape(c, () => polyP(c, [[x0 + skew, y0], [x1 - skew, y0], [x1, y1], [x0, y1]]), "#f1ede2");
  const r = rnd(5);
  for (let k = 0; k < 9; k++) { const y = y0 + 24 + k * ((y1 - y0 - 40) / 9), t = (y - y0) / (y1 - y0), a = x0 + skew * (1 - t) + 30, b = x1 - skew * (1 - t) - 30; line(c, [[a, y], [a + (b - a) * (0.5 + r() * 0.5), y]], k % 4 === 0 ? 14 : 6, k % 4 === 0 ? COL.greyDk : COL.grey); }
};
// a glass marble
const marble = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.3, y + r * 1.15, r * 0.9, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), COL.teal, 5); shade(c, () => ell(c, x, y, r, r), COL.tealDk, -r * 0.5, -r * 0.3, 0.7);
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.25, y - r * 0.6]], 8);
};
// atta close-up from above inside the blue tub rim; craters are drawn on it
const attaTop = (c: Ctx) => {
  ground(c, COL.blue);
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 90), ATTA, 6);
  c.save(); c.beginPath(); rrect(c, 40, 40, 1000, 1000, 90); c.clip(); dust(c, 540, 540, 560, 560, 700, 21); c.restore();
};
// a crater in the atta from above: white atta thrown out in streaks, a hollow with its shade side
const crater = (c: Ctx, x: number, y: number, r: number, seedN: number) => {
  const rd = rnd(seedN);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 6.283 + rd() * 0.3, len = r * (0.35 + rd() * 0.5), w = r * 0.07;
    shape(c, () => polyP(c, [[x + Math.cos(a) * r * 0.95 - Math.sin(a) * w, y + Math.sin(a) * r * 0.95 + Math.cos(a) * w], [x + Math.cos(a) * (r + len), y + Math.sin(a) * (r + len)], [x + Math.cos(a) * r * 0.95 + Math.sin(a) * w, y + Math.sin(a) * r * 0.95 - Math.cos(a) * w]]), WHITE, 0);
  }
  shape(c, () => ell(c, x, y, r * 1.12, r * 1.12), WHITE, 0);
  shape(c, () => ell(c, x, y, r, r), "#f7f0e0", 6); shade(c, () => ell(c, x, y, r, r), ATTA_DK, r * 0.28, r * 0.28, 0.9);
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const steelTumbler = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, yb + 8, w * 0.62, w * 0.1);
  const bw = w * 0.84, top = yb - h, body = () => { c.moveTo(x - w / 2, top); c.lineTo(x + w / 2, top); c.lineTo(x + bw / 2, yb); c.quadraticCurveTo(x, yb + w * 0.08, x - bw / 2, yb); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.3, 0, 0.7);
  shine(c, [[x - w * 0.36, top + h * 0.12], [x - w * 0.3, yb - h * 0.15]], 9);
  line(c, [[x - w * 0.46, top + h * 0.1], [x + w * 0.46, top + h * 0.1]], 3, COL.steelDk);
  shape(c, () => ell(c, x, top, w / 2, w * 0.14), COL.steelIn, 5);
  shape(c, () => ell(c, x, top + 3, w * 0.43, w * 0.1), COL.water, 3);
  shine(c, [[x - w * 0.2, top + 2], [x - w * 0.05, top - 3]], 5);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], r * 0.16, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.3, -r * 0.3, 0.6);
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const plank = (c: Ctx, x0: number, x1: number, y: number) => {
  shape(c, () => rrect(c, x0, y, x1 - x0, 64, 10), COL.wood); shade(c, () => rrect(c, x0, y, x1 - x0, 64, 10), COL.woodDk, 0, -26, 0.8);
};

// ---------------------------------------------------------------- experiment 1: the marble drops
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, FLOOR);
  newspaper(c, 70, 640, 1010, 1030, 70);
  tub(c, 540, 560, 400, 170, 200, 260);
  // a hand over the tub, dusting dark ragi on top
  hand(c, 780, 175, Math.PI / 2, 1.6, SKIN.child, CLOTH.child, true);
  const r = rnd(9);
  for (let i = 0; i < 30; i++) { const x = 650 + r() * 200, y = 340 + r() * 150; c.beginPath(); ell(c, x, y, 4 + r() * 4, 3 + r() * 3, r() * 3); c.fillStyle = RAGI; c.fill(); }
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  c.fillStyle = WALL; c.fillRect(0, 0, D, D); c.fillStyle = FLOOR; c.fillRect(0, 770, D, 310); line(c, [[0, 770], [D, 770]], 5);
  tub(c, 620, 850, 400, 90, 110, 140);
  // tape fixed upright on the wall, 0 at the atta, 15 px per cm
  shape(c, () => rrect(c, 90, 380, 110, 480, 6), COL.yellow);
  for (let cm = 0; cm <= 30; cm += 5) { const y = 860 - cm * 15; line(c, [[200, y], [200 - (cm % 10 === 0 ? 50 : 28), y]], 5); }
  write(c, "10", 100, 700, 36, INK, 5); write(c, "20", 100, 550, 36, INK, 5); write(c, "30", 100, 400, 36, INK, 5);
  // 20 cm level
  line(c, [[200, 560], [650, 560]], 6, RED);
  write(c, "20 cm", 250, 495, 44, RED, 7);
  handL(c, 910, 560, 0, 2.0);
  marble(c, 690, 560, 40);
  arrow(c, [[690, 630], [690, 750]]);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  attaTop(c);
  crater(c, 440, 640, 150, 3);
  // the ruler across the hole, 0 at the left edge, 65 px per cm
  shape(c, () => rrect(c, 300, 662, 500, 70, 8), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, 290, 610, 500, 70, 8), COL.wood); shade(c, () => rrect(c, 290, 610, 500, 70, 8), COL.woodDk, 0, -26, 0.8);
  for (let i = 0; i <= 6; i++) { const x = 290 + i * 75; line(c, [[x, 610], [x, 650]], 5); write(c, String(i), x - 13, 646, 26, INK, 5); }
  arrow(c, [[440, 520], [596, 520]]); arrow(c, [[440, 520], [284, 520]]);
  line(c, [[290, 535], [290, 600]], 6, RED); line(c, [[590, 535], [590, 600]], 6, RED);
  handL(c, 900, 645, 0, 1.6);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  attaTop(c);
  const list: [number, number, string, number][] = [[180, 70, "20 cm", 31], [450, 112, "40 cm", 32], [830, 152, "80 cm", 33]];
  c.save(); c.beginPath(); rrect(c, 40, 40, 1000, 1000, 90); c.clip();
  for (const [x, r, , s] of list) crater(c, x, 640, r, s);
  c.restore();
  for (const [x, r, t] of list) {
    write(c, t, x - 105, 100, 56, INK, 8); arrow(c, [[x, 200], [x, 270]]);
    const y = 640 + r * 1.5 + 36; line(c, [[x - r, y], [x + r, y]], 7, INK); line(c, [[x - r, y - 16], [x - r, y + 16]], 7, INK); line(c, [[x + r, y - 16], [x + r, y + 16]], 7, INK);
  }
};

// ---------------------------------------------------------------- experiment 2: sun and shade
// the wall behind: warm on the left (sun), cool on the right (shade)
const sunShadeWall = (c: Ctx, split: number) => { c.fillStyle = WARM; c.fillRect(0, 0, split, D); c.fillStyle = COOL; c.fillRect(split, 0, D - split, D); line(c, [[split, 0], [split, D]], 6); };
// setup.e2.0
const e2_0 = (c: Ctx) => {
  sunShadeWall(c, 540);
  // window with sun and a shaft of light
  shape(c, () => rrect(c, 70, 70, 400, 330, 14), COL.sky, 8); line(c, [[270, 70], [270, 400]], 8); line(c, [[70, 235], [470, 235]], 8);
  sun(c, 170, 160, 50);
  c.save(); c.globalAlpha = 0.45; shape(c, () => polyP(c, [[110, 400], [430, 400], [440, 760], [100, 760]]), COL.yellow, 0); c.restore(); c.globalAlpha = 1;
  for (const x of [190, 280, 370]) line(c, [[x, 420], [x + 4, 520]], 8, COL.orange);
  plank(c, 50, 500, 790); plank(c, 580, 1030, 790);
  line(c, [[640, 854], [640, 920]], 10); line(c, [[970, 854], [970, 920]], 10);
  steelTumbler(c, 275, 790, 240, 300); steelTumbler(c, 805, 790, 240, 300);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  c.fillStyle = BG; c.fillRect(0, 0, D, D); c.fillStyle = WARM; c.fillRect(0, 0, 300, D); c.fillStyle = COOL; c.fillRect(780, 0, 300, D);
  line(c, [[300, 0], [300, D]], 5); line(c, [[780, 0], [780, D]], 5);
  sun(c, 150, 270, 55);
  plank(c, 20, 280, 830); plank(c, 800, 1060, 830);
  steelTumbler(c, 150, 830, 190, 250); steelTumbler(c, 930, 830, 190, 250);
  // the clock: both hands at the start, a red arrow once round
  shadow(c, 560, 770, 220, 30);
  shape(c, () => ell(c, 540, 500, 215, 215), WHITE, 12);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[540 + Math.cos(a) * 192, 500 + Math.sin(a) * 192], [540 + Math.cos(a) * 208, 500 + Math.sin(a) * 205]], 6); }
  write(c, "12", 540 - 32, 318, 44, INK, 7); write(c, "6", 540 - 13, 590, 44, INK, 7); write(c, "3", 540 + 128, 478, 44, INK, 7); write(c, "9", 540 - 160, 478, 44, INK, 7);
  line(c, [[540, 500], [540, 385]], 12); line(c, [[540, 500], [540, 435]], 18);
  shape(c, () => ell(c, 540, 500, 16, 16), INK, 0);
  const pts: number[][] = []; for (let k = 0; k <= 40; k++) { const a = (-70 + (k / 40) * 320) * Math.PI / 180; pts.push([540 + Math.cos(a) * 262, 500 + Math.sin(a) * 262]); }
  arrow(c, pts, RED, 14);
};
// a child's arm from above, one finger pointing down at (tx, ty); lean tilts the arm
const fingerDown = (c: Ctx, tx: number, ty: number, lean: number) => {
  c.save(); c.translate(tx, ty); c.rotate(lean); c.scale(1.15, 1.15);
  shape(c, () => rrect(c, -56, -700, 112, 250, 20), CLOTH.child); shade(c, () => rrect(c, -56, -700, 112, 250, 20), CLOTH.childDk, -34, 0, 0.7);
  shape(c, () => rrect(c, -40, -460, 80, 260, 14), SKIN.child); shade(c, () => rrect(c, -40, -460, 80, 260, 14), SKIN.childDk, -22, 0, 0.7);
  shape(c, () => rrect(c, -54, -215, 108, 120, 34), SKIN.child); shade(c, () => rrect(c, -54, -215, 108, 120, 34), SKIN.childDk, -26, 0, 0.7);
  shape(c, () => ell(c, -50, -160, 20, 42, 0.25), SKIN.child, 5);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 20, -170 + k * 22, 40, 24, 12), SKIN.child, 5);
  shape(c, () => rrect(c, -16, -140, 32, 150, 16), SKIN.child, 6); shade(c, () => rrect(c, -16, -140, 32, 150, 16), SKIN.childDk, -9, 0, 0.7);
  c.restore();
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  sunShadeWall(c, 540);
  plank(c, 40, 540, 930); plank(c, 590, 1040, 930);
  steelTumbler(c, 290, 930, 300, 360); steelTumbler(c, 800, 930, 300, 360);
  for (const [x, lean] of [[290, -0.1], [800, 0.1]] as [number, number][]) {
    const wy = 570 + 14;
    fingerDown(c, x - lean * 150, 612, lean);
    // the water covers the dipped fingertip, with ripples
    c.save(); c.beginPath(); ell(c, x, 570 + 3, 300 * 0.43, 300 * 0.1); c.clip(); c.beginPath(); c.rect(0, wy, D, 100); c.fillStyle = "rgba(143,195,234,0.7)"; c.fill(); c.restore();
    for (const k of [1, 1.7]) { c.beginPath(); c.ellipse(x - lean * 135, wy + 4, 34 * k, 10 * k, 0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); }
  }
};

export const su_energyEnergyAroundUs = cards("sci.energy.energy-around-us.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
