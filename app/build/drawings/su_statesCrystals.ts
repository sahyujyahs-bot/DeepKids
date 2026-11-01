import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, person, cards } from "./flatKit";

// sci.states.crystals.L3 set-up cards: salt water on a plate or in a glass, phitkari, a phone zoomed on crystals.
// Same objects on every card: the steel tumbler with a clear window, the clear glass, the steel plate, the phone.

// a long sleeve behind a hand so the arm comes in from the edge of the card
const forearm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string) => {
  const dx = Math.cos(an), dy = Math.sin(an);
  line(c, [[x - dx * 60 * s, y - dy * 60 * s], [x - dx * 1200, y - dy * 1200]], 72 * s + 12, INK);
  line(c, [[x - dx * 60 * s, y - dy * 60 * s], [x - dx * 1200, y - dy * 1200]], 72 * s, sleeve);
};
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number) => { forearm(c, x, y, an, s, CLOTH.adult); hand(c, x, y, an, s, SKIN.adult, CLOTH.adult); };
const childHand = (c: Ctx, x: number, y: number, an: number, s: number) => { forearm(c, x, y, an, s, CLOTH.child); hand(c, x, y, an, s, SKIN.child, CLOTH.child); };

// a steel tumbler, bottom centre (x, y), mouth width w. A clear window shows what is inside:
// water up to level (0..1 of the window) and a heap of salt on the bottom
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, o: { level?: number; salt?: boolean; mouth?: boolean; noShadow?: boolean; tilt?: number } = {}) => {
  if (!o.noShadow) shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.1);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -w * 0.3, 0, 0.6);
  shine(c, [[x - top * 0.8, y - h * 0.92], [x - bot * 0.85, y - h * 0.06]], 8);
  const hw = (yy: number) => (bot + (top - bot) * ((y - yy) / h)) * 0.62, y1 = y - h * 0.64, y2 = y - h * 0.1, xo = w * 0.04;
  const win = () => { c.moveTo(x + xo - hw(y1), y1); c.lineTo(x + xo + hw(y1), y1); c.lineTo(x + xo + hw(y2), y2); c.lineTo(x + xo - hw(y2), y2); c.closePath(); };
  shape(c, win, "#eaf4fb", 0);
  c.save(); c.beginPath(); win(); c.clip();
  if (o.level) { const ly = y2 - (y2 - y1) * o.level; c.fillStyle = COL.water; c.fillRect(x - w, ly, w * 2, y2 - ly + 5); line(c, [[x - w, ly], [x + w, ly]], 6, COL.waterDk); }
  if (o.tilt !== undefined) { c.save(); c.translate(x + xo, (y1 + y2) / 2); c.rotate(-o.tilt); c.fillStyle = COL.water; c.fillRect(-w, 10, w * 2, w); line(c, [[-w, 10], [w, 10]], 6, COL.waterDk); c.restore(); }
  if (o.salt) {
    const hh = (y2 - y1) * 0.34, r = rnd(5);
    shape(c, () => { c.moveTo(x + xo - hw(y2) * 1.1, y2 + 4); c.bezierCurveTo(x + xo - hw(y2) * 0.6, y2 - hh * 1.5, x + xo + hw(y2) * 0.6, y2 - hh * 1.5, x + xo + hw(y2) * 1.1, y2 + 4); c.closePath(); }, WHITE, 5);
    for (let i = 0; i < 16; i++) { const gx = x + xo + (r() - 0.5) * hw(y2) * 1.3, gy = y2 - r() * hh * 0.8; shape(c, () => rrect(c, gx - 4, gy - 4, 8, 8, 2), "#dfe6ee", 2); }
  }
  c.restore();
  shape(c, win, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + 3, top * 0.84, w * 0.075), o.mouth ? COL.water : COL.steelDk, 0);
  if (o.mouth) shine(c, [[x - top * 0.5, y - h], [x - top * 0.2, y - h - 3]], 6);
};

const spoon = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  line(c, [[x0, y0], [x1, y1]], 36, INK); line(c, [[x0, y0], [x1, y1]], 24, COL.steel);
  const an = Math.atan2(y1 - y0, x1 - x0);
  shape(c, () => ell(c, x1, y1, 40, 28, an), COL.steel, 5);
};

const stream = (c: Ctx, pts: number[][]) => { line(c, pts, 30, INK); line(c, pts, 20, COL.water); line(c, pts.map(([x, y]) => [x - 4, y]), 5, COL.drop); };

// a salt cube with a lit top and a shade side
const cube = (c: Ctx, x: number, y: number, s: number, rot = 0, lw = 5) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const d = s * 0.35, fx = -s / 2 - d / 2, fy = -s / 2 + d / 2;
  shape(c, () => polyP(c, [[fx, fy], [fx + d, fy - d], [fx + s + d, fy - d], [fx + s, fy]]), "#f1f5f9", lw);
  shape(c, () => polyP(c, [[fx + s, fy], [fx + s + d, fy - d], [fx + s + d, fy + s - d], [fx + s, fy + s]]), "#c9d3e0", lw);
  shape(c, () => polyP(c, [[fx, fy], [fx + s, fy], [fx + s, fy + s], [fx, fy + s]]), WHITE, lw);
  c.restore();
};
// a phitkari crystal: a clear double pyramid, every face a triangle
const octa = (c: Ctx, x: number, y: number, s: number, rot = 0, lw = 4) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const T = [0, -s], R = [s * 0.78, -s * 0.08], B = [0, s], L = [-s * 0.78, -s * 0.08], F = [s * 0.1, s * 0.14];
  const tri = (a: number[], b: number[], col: string) => shape(c, () => polyP(c, [a, b, F]), col, lw * 0.7);
  tri(L, T, "#ffffff"); tri(T, R, "#e1f2fb"); tri(R, B, "#a9d2ea"); tri(B, L, "#cbe6f4");
  shape(c, () => polyP(c, [T, R, B, L]), "rgba(0,0,0,0)", lw);
  c.restore();
};
// a sugar crystal: a clear block with slanted ends (longer than a salt cube, not a square)
const block = (c: Ctx, x: number, y: number, s: number, rot = 0, lw = 4) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const w = s * 0.7, h = s * 0.5, sl = s * 0.3, d = s * 0.3;
  const P = [[-w + sl - d / 2, -h + d / 2], [w + sl - d / 2, -h + d / 2], [w - sl - d / 2, h + d / 2], [-w - sl - d / 2, h + d / 2]];
  shape(c, () => polyP(c, [P[0], P[1], [P[1][0] + d, P[1][1] - d], [P[0][0] + d, P[0][1] - d]]), "#fffdf5", lw);
  shape(c, () => polyP(c, [P[1], [P[1][0] + d, P[1][1] - d], [P[2][0] + d, P[2][1] - d], P[2]]), "#dccaa0", lw);
  shape(c, () => polyP(c, P), "#f6ebcf", lw);
  c.restore();
};

const phone = (c: Ctx, x: number, y: number, w: number, h: number, content: (sw: number, sh: number) => void) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 48), "#3a3f4d", 7);
  const sw = w - 40, sh = h - 70;
  c.save(); c.beginPath(); rrect(c, x - sw / 2, y - sh / 2 + 6, sw, sh, 26); c.clip(); c.translate(x, y + 6); content(sw, sh); c.restore();
  shape(c, () => rrect(c, x - sw / 2, y - sh / 2 + 6, sw, sh, 26), "rgba(0,0,0,0)", 5);
  shape(c, () => ell(c, x, y - h / 2 + 22, 9, 9), "#1d2029", 0);
};

const tag = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 12, y + h / 2 + 8, w * 0.5, 16); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 30), WHITE, 7); };
const bolt = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x + 30 * s, y - 100 * s], [x - 45 * s, y + 15 * s], [x - 5 * s, y + 15 * s], [x - 30 * s, y + 100 * s], [x + 50 * s, y - 25 * s], [x + 8 * s, y - 25 * s]]), COL.yellow, 6);
const snail = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 130 * s, y + 10 * s, 260 * s, 50 * s, 25 * s), COL.greenLt, 6);
  shape(c, () => ell(c, x + 120 * s, y - 10 * s, 28 * s, 52 * s), COL.greenLt, 6);
  line(c, [[x + 112 * s, y - 50 * s], [x + 100 * s, y - 95 * s]], 6); line(c, [[x + 135 * s, y - 50 * s], [x + 150 * s, y - 92 * s]], 6);
  shape(c, () => ell(c, x + 100 * s, y - 100 * s, 9 * s, 9 * s), INK, 0); shape(c, () => ell(c, x + 150 * s, y - 97 * s, 9 * s, 9 * s), INK, 0);
  shape(c, () => ell(c, x - 20 * s, y - 25 * s, 85 * s, 85 * s), COL.orange, 6);
  const sp: number[][] = []; for (let t = 0; t < 10.5; t += 0.3) sp.push([x - 20 * s + Math.cos(t) * (6 + t * 6.5) * s, y - 25 * s + Math.sin(t) * (6 + t * 6.5) * s]);
  line(c, sp, 6 * s);
};

// a heap of crystals of one kind on a plate
const heap = (c: Ctx, x: number, y: number, rx: number, h: number, kind: "salt" | "sugar" | "alum", sd: number) => {
  const r = rnd(sd), base = { salt: "#dfe6ee", sugar: "#e4d8ba", alum: "#a9d2ea" }[kind];
  shadow(c, x + rx * 0.12, y + 6, rx * 1.05, 18);
  shape(c, () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.6, y - h * 1.3, x + rx * 0.6, y - h * 1.3, x + rx, y); c.closePath(); }, base, 5);
  const ps: number[][] = [];
  for (let i = 0; i < 46; i++) { const t = r() * 2 - 1, top = y - h * 0.98 * (1 - t * t); ps.push([x + t * rx * 0.86, top + 6 + r() * (y - top - 10), r(), r()]); }
  ps.sort((a, b) => a[1] - b[1]);
  for (const [px, py, a, b] of ps) {
    if (kind === "salt") cube(c, px, py, 17 + a * 6, b * 0.8 - 0.4, 2.5);
    else if (kind === "sugar") block(c, px, py, 15 + a * 5, b * 0.8 - 0.4, 2.5);
    else octa(c, px, py, 17 + a * 6, b * 0.8 - 0.4, 3);
  }
};

// setup.e1.0: stirring salt into a steel tumbler of water, some salt left at the bottom
const su_e1_0 = (c: Ctx) => {
  ground(c);
  tumbler(c, 440, 960, 400, 500, { level: 0.82, salt: true, mouth: true });
  const dx = 0.81, dy = -0.585, mx = 440, my = 460, gx = mx + dx * 330, gy = my + dy * 330;
  spoon(c, mx, my, gx, gy);
  childHand(c, gx + dx * 113, gy + dy * 113, Math.atan2(-dy, -dx), 2);
  const pts: number[][] = []; for (let a = 0.15; a < 0.95; a += 0.1) pts.push([mx + Math.cos(Math.PI * a) * 190, my + 70 + Math.sin(Math.PI * a) * 40]);
  arrow(c, pts.reverse());
};

// setup.e1.1: pouring the clear salt water from one steel tumbler into the second, salt stays behind
const su_e1_1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 800, 990, 320, 400, { level: 0.55, mouth: true });
  const tilt = 0.95, px = 270, py = 560;
  c.save(); c.translate(px, py); c.rotate(tilt); tumbler(c, 0, 0, 320, 400, { salt: true, mouth: true, noShadow: true, tilt }); c.restore();
  const lx = px + 160 * Math.cos(tilt) + 400 * Math.sin(tilt), ly = py + 160 * Math.sin(tilt) - 400 * Math.cos(tilt);
  stream(c, [[lx - 6, ly + 6], [lx + 30, ly + 40], [lx + 66, ly + 100], [775, 585]]);
  childHand(c, 215, 705, -0.7, 1.9);
  arrow(c, [[230, 300], [320, 215], [440, 175], [560, 195]]);
};

// setup.e1.2: a plate with a thin film of salt water and a small glass with salt water, side by side on a shelf
const su_e1_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[20, 770], [1060, 770], [1060, 830], [20, 830]]), COL.wood, 6);
  shape(c, () => polyP(c, [[20, 830], [1060, 830], [1060, 900], [20, 900]]), COL.woodDk, 6);
  plate(c, 320, 740, 300, 85);
  shape(c, () => ell(c, 320, 738, 250, 62), COL.water, 0);
  shine(c, [[200, 725], [300, 705]], 8);
  glass(c, 810, 768, 250, 300, 0.17);
  tag(c, 320, 300, 300, 270); bolt(c, 320, 300, 1.3);
  tag(c, 810, 300, 300, 270); snail(c, 810, 320, 0.85);
};

// setup.e1.3: a phone zoomed over the plate shows the tiny salt cubes
const su_e1_3 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 900, 440, 120);
  shape(c, () => ell(c, 540, 898, 330, 80), "#f4f6f9", 0);
  const r = rnd(9); for (let i = 0; i < 40; i++) cube(c, 260 + r() * 560, 860 + r() * 70, 14, r(), 2.5);
  shadow(c, 560, 880, 220, 36);
  phone(c, 440, 340, 440, 620, (sw, sh) => {
    c.fillStyle = COL.steelIn; c.fillRect(-sw / 2, -sh / 2, sw, sh);
    cube(c, -80, -150, 120, 0.15); cube(c, 90, -80, 90, -0.2); cube(c, -30, 40, 150, 0.3); cube(c, 120, 130, 80, 0.1);
    c.fillStyle = COL.wood; c.fillRect(-sw / 2, sh / 2 - 60, sw, 60);
    for (let i = 0; i <= 14; i++) line(c, [[-sw / 2 + 15 + i * 25, sh / 2 - 60], [-sw / 2 + 15 + i * 25, sh / 2 - (i % 5 ? 40 : 25)]], 3);
  });
  childHand(c, 790, 420, 3.0, 1.9);
};

// setup.e2.0: a grown-up pours hot water from a kettle onto phitkari powder in a glass, the child watches from away
const su_e2_0 = (c: Ctx) => {
  ground(c);
  glass(c, 450, 940, 330, 380, 0.14);
  shape(c, () => { c.moveTo(340, 940); c.bezierCurveTo(360, 850, 540, 850, 560, 940); c.closePath(); }, WHITE, 5);
  const r = rnd(4); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 390 + r() * 120, 905 + r() * 25, 5, 4), "#e5ecf3", 2);
  stream(c, [[452, 414], [430, 440], [426, 520], [440, 880]]);
  line(c, [[520, 440], [545, 410], [520, 380], [545, 350]], 8, "#b5c3d4"); line(c, [[590, 470], [615, 440], [590, 410], [615, 380]], 8, "#b5c3d4");
  c.save(); c.translate(700, 340); c.rotate(-0.7);
  line(c, [[150, -70], [270, -70], [270, 70], [150, 70]], 40, INK); line(c, [[150, -70], [270, -70], [270, 70], [150, 70]], 28, "#4a4558");
  shape(c, () => polyP(c, [[-135, 30], [-135, -30], [-235, -110], [-258, -86], [-180, 30]]), COL.steel, 6);
  shape(c, () => rrect(c, -150, -110, 300, 240, 70), COL.steel);
  shade(c, () => rrect(c, -150, -110, 300, 240, 70), COL.steelDk, -90, 0, 0.6);
  shape(c, () => { c.moveTo(-90, -110); c.bezierCurveTo(-80, -170, 80, -170, 90, -110); c.closePath(); }, COL.steelIn, 6);
  shape(c, () => ell(c, 0, -158, 20, 14), "#4a4558", 5);
  c.restore();
  adultHand(c, 988, 124, 2.6, 1.8);
  person(c, 130, 1040, 440);
};

// setup.e2.1: the next morning, big clear crystals with triangle faces on the bottom of the glass
const su_e2_1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(150, 150);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[Math.cos(a) * 85, Math.sin(a) * 85], [Math.cos(a) * 125, Math.sin(a) * 125]], 10, COL.orange); }
  c.restore();
  shape(c, () => ell(c, 150, 150, 62, 62), COL.yellow, 6);
  glass(c, 590, 980, 520, 720, 0.85);
  octa(c, 480, 862, 108, -0.2); octa(c, 720, 865, 105, 0.25); octa(c, 600, 835, 135, 0.1);
  octa(c, 535, 725, 88, -0.3); octa(c, 665, 720, 84, 0.2);
};

// setup.e2.2: salt cubes, sugar grains and phitkari crystals on a dark plate, a phone zoomed over them
const su_e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 470, 60);
  shape(c, () => ell(c, 540, 850, 470, 190), "#5a5470");
  shape(c, () => ell(c, 540, 846, 400, 155), "#3a3540", 4);
  heap(c, 270, 890, 140, 130, "salt", 3); heap(c, 540, 915, 140, 130, "sugar", 8); heap(c, 810, 890, 140, 130, "alum", 13);
  phone(c, 420, 290, 400, 540, (sw, sh) => {
    c.fillStyle = "#3a3540"; c.fillRect(-sw / 2, -sh / 2, sw, sh);
    cube(c, -5, -150, 105, 0.12);
    block(c, 0, 5, 92, -0.1);
    octa(c, 0, 148, 64, 0.1);
  });
  childHand(c, 746, 300, 3.0, 1.9);
};

export const su_statesCrystals = cards("sci.states.crystals.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e1_3, su_e2_0, su_e2_1, su_e2_2]);
