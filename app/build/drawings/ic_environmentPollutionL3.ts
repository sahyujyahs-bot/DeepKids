import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, BG, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, glass, leaf, write, cards } from "./flatKit";

// sci.environment.pollution.L3 · picture cards (intro, activities, experiments, challenges, terms, explanations).
// Smoke is grey, dust is brown-black specks, clean air is light blue.

const SMK = "#a7a3ae", SMKDK = "#7d7885", DUSTC = "#4a3f3a", AIRC = "#7fb6e6", SKYC = "#bfe0f5", WALL = "#f4dcc0", HAZE = "#d9cfba";

// a union of circles drawn as one outlined blob
const blob = (c: Ctx, circ: number[][], col: string, lw = 6) => {
  circ.forEach(([x, y, r]) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = col; c.fill(); c.lineWidth = lw * 2; c.strokeStyle = INK; c.stroke(); });
  circ.forEach(([x, y, r]) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = col; c.fill(); });
};
const smoke = (c: Ctx, x: number, y: number, s: number, col = SMK) =>
  blob(c, [[x, y, 50 * s], [x - 55 * s, y + 18 * s, 38 * s], [x + 55 * s, y + 14 * s, 40 * s], [x - 15 * s, y - 40 * s, 40 * s], [x + 30 * s, y - 38 * s, 34 * s]], col);
const speck = (c: Ctx, x: number, y: number, r: number, col = INK) => { c.beginPath(); ell(c, x, y, r, r * 0.8, x); c.fillStyle = col; c.fill(); };
const flame = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y - 110 * s); c.bezierCurveTo(x + 70 * s, y - 40 * s, x + 50 * s, y, x, y); c.bezierCurveTo(x - 50 * s, y, x - 70 * s, y - 40 * s, x, y - 110 * s); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(x, y - 55 * s); c.bezierCurveTo(x + 30 * s, y - 25 * s, x + 24 * s, y, x, y); c.bezierCurveTo(x - 24 * s, y, x - 30 * s, y - 25 * s, x, y - 55 * s); c.closePath(); }, COL.yellow, 0);
};
const flats = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  shape(c, () => rrect(c, x, y, w, h, 6), col);
  shade(c, () => rrect(c, x, y, w, h, 6), dk, w * 0.12, 0);
  for (let r = 0; r < Math.floor(h / 90); r++) for (let k = 0; k < Math.floor(w / 70); k++) shape(c, () => rrect(c, x + 18 + k * 70, y + 20 + r * 90, 36, 48, 4), COL.sky, 4);
};
const bus = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x, y - 130 * s, 340 * s, 130 * s, 18 * s), COL.red);
  shade(c, () => rrect(c, x, y - 130 * s, 340 * s, 130 * s, 18 * s), "#b83a28", 20 * s, 0);
  for (let k = 0; k < 5; k++) shape(c, () => rrect(c, x + 20 * s + k * 62 * s, y - 108 * s, 50 * s, 44 * s, 6), COL.sky, 4);
  [70, 270].forEach((wx) => { shape(c, () => ell(c, x + wx * s, y, 26 * s, 26 * s), COL.black); shape(c, () => ell(c, x + wx * s, y, 10 * s, 10 * s), COL.steel, 3); });
};
const plant = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - 70 * s, y - 100 * s], [x + 70 * s, y - 100 * s], [x + 50 * s, y], [x - 50 * s, y]]), "#c9703f");
  shape(c, () => rrect(c, x - 80 * s, y - 120 * s, 160 * s, 30 * s, 8), "#d98650");
  leaf(c, x, y - 118 * s, 190 * s, -Math.PI * 0.5, COL.leaf); leaf(c, x, y - 118 * s, 170 * s, -Math.PI * 0.85, COL.leaf); leaf(c, x, y - 118 * s, 170 * s, -Math.PI * 0.15, COL.leaf);
};
// a leaf shape that can be clipped: base (x, y), pointing at angle an
const leafPath = (c: Ctx, x: number, y: number, len: number, an: number, wd = 0.32) => () => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wd, ny = Math.cos(an) * len * wd, mx = (x + tx) / 2, my = (y + ty) / 2;
  c.moveTo(x, y); c.quadraticCurveTo(mx + nx * 1.6, my + ny * 1.6, tx, ty); c.quadraticCurveTo(mx - nx * 1.6, my - ny * 1.6, x, y); c.closePath();
};
// a window view with a far tower: hazy 0 (clear) .. 4 (very hazy)
const hazyView = (c: Ctx, x: number, y: number, w: number, h: number, hz: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 14); c.clip();
  c.fillStyle = SKYC; c.fillRect(x, y, w, h);
  shape(c, () => ell(c, x + w * 0.2, y + h * 0.18, w * 0.09, w * 0.09), COL.yellow, 4);
  const tw = w * 0.2, tx = x + w * 0.58, ty = y + h * 0.2;
  c.globalAlpha = 1 - hz * 0.2;
  shape(c, () => rrect(c, tx, ty, tw, h * 0.6, 4), "#c96f5a", 5);
  line(c, [[tx + tw / 2, ty], [tx + tw / 2, ty - h * 0.12]], 6);
  for (let r = 0; r < 5; r++) shape(c, () => rrect(c, tx + tw * 0.2, ty + 30 + r * h * 0.1, tw * 0.6, h * 0.05, 3), COL.sky, 3);
  c.globalAlpha = 1;
  shape(c, () => rrect(c, x + w * 0.04, y + h * 0.62, w * 0.3, h * 0.4, 4), "#8fa2b8", 5);
  shape(c, () => rrect(c, x + w * 0.76, y + h * 0.7, w * 0.3, h * 0.4, 4), "#8fa2b8", 5);
  c.globalAlpha = hz * 0.18; c.fillStyle = HAZE; c.fillRect(x, y, w, h); c.globalAlpha = 1;
  c.restore();
  c.beginPath(); rrect(c, x, y, w, h, 14); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
};
const droplet = (c: Ctx, x: number, y: number, s: number, col = COL.water) =>
  shape(c, () => { c.moveTo(x, y - 20 * s); c.quadraticCurveTo(x + 18 * s, y + 4 * s, x + 12 * s, y + 12 * s); c.quadraticCurveTo(x, y + 22 * s, x - 12 * s, y + 12 * s); c.quadraticCurveTo(x - 18 * s, y + 4 * s, x, y - 20 * s); c.closePath(); }, col, 3);
const wall = (c: Ctx) => { ground(c, WALL); };

// 0 intro: two cloths in a child's hand
const intro = (c: Ctx) => {
  ground(c);
  const cl = (pts: number[][], dirty: boolean) => {
    shape(c, () => polyP(c, pts), COL.cloth, 6);
    shade(c, () => polyP(c, pts), "#e4dccb", 20, 0);
    if (dirty) { c.save(); c.beginPath(); polyP(c, pts); c.clip(); const r = rnd(4); c.beginPath(); c.moveTo(100, 470); c.bezierCurveTo(250, 400, 400, 520, 560, 440); c.lineTo(560, 640); c.bezierCurveTo(400, 700, 250, 590, 100, 660); c.closePath(); c.fillStyle = "rgba(60,52,60,0.5)"; c.fill(); for (let i = 0; i < 30; i++) speck(c, 160 + r() * 330, 470 + r() * 180, 6 + r() * 8, "rgba(43,35,50,0.6)"); c.restore(); }
    line(c, [pts[0], pts[1]], 6);
  };
  shadow(c, 560, 940, 400, 36);
  cl([[130, 200], [500, 180], [520, 950], [190, 970]], true);
  cl([[570, 180], [940, 200], [890, 970], [560, 950]], false);
  line(c, [[240, 330], [240, 330]], 1);
  hand(c, 540, 1010, -Math.PI / 2, 1.7);
};

// 1 e1 sticky card test: three places, three cards, different amounts of dust
const e1 = (c: Ctx) => {
  ground(c);
  const panel = (x: number, bg: string, kind: number, n: number) => {
    shape(c, () => rrect(c, x, 150, 310, 760, 18), bg, 7);
    if (kind === 0) { shape(c, () => rrect(c, x + 30, 190, 250, 300, 6), SKYC, 6); line(c, [[x + 155, 190], [x + 155, 490]], 6); line(c, [[x + 30, 340], [x + 280, 340]], 6); smoke(c, x + 90, 270, 0.55, SMK); }
    else if (kind === 1) { shape(c, () => rrect(c, x + 20, 200, 270, 28, 4), COL.wood); shape(c, () => rrect(c, x + 60, 230, 70, 70, 6), COL.teal); shape(c, () => ell(c, x + 220, 262, 30, 36), COL.leaf); }
    else { shape(c, () => rrect(c, x + 20, 190, 270, 330, 6), "#7a5a40", 6); line(c, [[x + 155, 190], [x + 155, 520]], 6); shape(c, () => ell(c, x + 132, 360, 9, 9), COL.yellow, 3); shape(c, () => ell(c, x + 178, 360, 9, 9), COL.yellow, 3); }
    shadow(c, x + 170, 880, 120, 18);
    shape(c, () => rrect(c, x + 55, 540, 200, 310, 8), WHITE, 6);
    shape(c, () => rrect(c, x + 90, 620, 130, 130, 4), "rgba(0,0,0,0)", 4);
    const r = rnd(n + 3); for (let i = 0; i < n; i++) speck(c, x + 100 + r() * 110, 630 + r() * 110, 4 + r() * 4, DUSTC);
  };
  panel(40, "#e9eef5", 0, 46); panel(385, "#f3e3ce", 1, 15); panel(730, "#e4d9c9", 2, 3);
};

// 2 e2 leaf wipe
const e2 = (c: Ctx) => {
  ground(c);
  const lp = leafPath(c, 230, 850, 760, -0.42, 0.3);
  shape(c, lp, COL.leaf, 6);
  c.save(); c.beginPath(); lp(); c.clip();
  c.globalAlpha = 0.6; c.fillStyle = "#8f8a84"; c.fillRect(520, 0, 700, 1000); c.globalAlpha = 1;
  const r = rnd(5); for (let i = 0; i < 90; i++) speck(c, 540 + r() * 380, 300 + r() * 450, 3 + r() * 3, "#5b524a");
  c.restore();
  line(c, [[230, 850], [820, 560]], 4, COL.leafDk);
  c.beginPath(); lp(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => polyP(c, [[110, 1040], [330, 1040], [300, 880], [140, 880]]), "#c9703f");
  shape(c, () => rrect(c, 100, 850, 240, 40, 8), "#d98650");
  shape(c, () => rrect(c, 450, 500, 170, 130, 40), WHITE, 6);
  shape(c, () => ell(c, 535, 570, 45, 30), "rgba(120,110,105,0.7)", 0);
  hand(c, 594, 486, 2.2, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[600, 760], [790, 680]], RED, 12);
};

// 3 e3 through the soil
const e3 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 1000, 320, 280, 0.3, COL.drop);
  shape(c, () => polyP(c, [[330, 400], [750, 400], [600, 760], [480, 760]]), "rgba(214,236,250,0.5)", 6);
  const soil = () => polyP(c, [[350, 480], [730, 480], [600, 760], [480, 760]]);
  shape(c, soil, COL.soil, 0);
  c.save(); c.beginPath(); soil(); c.clip(); const r = rnd(9); for (let i = 0; i < 40; i++) speck(c, 400 + r() * 280, 490 + r() * 260, 5 + r() * 4, COL.soilDk); c.restore();
  const crust = rnd(2); for (let i = 0; i < 20; i++) speck(c, 380 + crust() * 320, 478 + crust() * 20, 6, DUSTC);
  shape(c, () => rrect(c, 495, 760, 90, 70, 6), "rgba(214,236,250,0.5)", 6);
  droplet(c, 540, 855, 1.1, COL.drop); droplet(c, 520, 910, 1, COL.drop);
  shape(c, () => polyP(c, [[470, 130], [680, 130], [690, 270], [480, 270]]), COL.steel);
  shape(c, () => polyP(c, [[470, 270], [690, 270], [650, 320], [510, 320]]), COL.steelDk, 0);
  shape(c, () => { c.moveTo(480, 270); c.quadraticCurveTo(500, 330, 530, 380); c.lineTo(580, 380); c.quadraticCurveTo(560, 320, 560, 270); c.closePath(); }, "#8b6a45", 5);
  arrow(c, [[860, 250], [760, 360]], RED, 12);
};

// 4 a1 white cloth wipe on a window grill
const a1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 110, 900, 800, 14), SKYC, 8);
  for (let k = 0; k < 7; k++) shape(c, () => rrect(c, 160 + k * 120, 120, 28, 780, 6), COL.steelDk, 5);
  shape(c, () => rrect(c, 100, 470, 880, 52, 8), COL.steelDk, 6);
  const gr = rnd(8);
  for (let i = 0; i < 60; i++) speck(c, 110 + gr() * 450, 480 + gr() * 34, 6 + gr() * 6, DUSTC);
  shape(c, () => rrect(c, 540, 470, 440, 52, 8), COL.steelIn, 6);
  shape(c, () => rrect(c, 470, 395, 180, 200, 40), WHITE, 6);
  shape(c, () => ell(c, 500, 500, 22, 60), "rgba(60,52,60,0.6)", 0);
  hand(c, 960, 495, Math.PI, 1.35, SKIN.child, CLOTH.child, true);
  arrow(c, [[640, 340], [380, 340]], RED, 12);
};

// 5 a2 smoke and dust hunt: a notebook list
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 400, 36);
  shape(c, () => rrect(c, 160, 90, 760, 860, 18), WHITE, 7);
  line(c, [[160, 150], [920, 150]], 5, COL.red);
  const row = (y: number, draw: () => void) => { draw(); shape(c, () => rrect(c, 760, y - 40, 80, 80, 8), WHITE, 5); line(c, [[775, y], [795, y + 22], [830, y - 28]], 9, COL.green); };
  row(260, () => { flame(c, 280, 300, 0.7); shape(c, () => rrect(c, 230, 300, 120, 20, 6), COL.steelDk, 4); smoke(c, 420, 240, 0.5); });
  row(450, () => { bus(c, 210, 495, 0.5); smoke(c, 440, 440, 0.5, SMKDK); });
  row(640, () => { shape(c, () => rrect(c, 230, 600, 70, 60, 4), COL.brown); shape(c, () => rrect(c, 310, 650, 90, 20, 4), COL.steelDk); smoke(c, 420, 600, 0.45, "#c9b79a"); });
  row(830, () => { shape(c, () => rrect(c, 250, 770, 70, 90, 4), COL.greyDk); smoke(c, 285, 750, 0.5); shape(c, () => rrect(c, 350, 810, 100, 50, 4), COL.steelDk); });
};

// 6 a3 nose dust catcher: two tissues, a mirror and a torch
const a3 = (c: Ctx) => {
  ground(c);
  const tissue = (x: number, n: number) => {
    shadow(c, x + 220, 700, 200, 24);
    shape(c, () => polyP(c, [[x, 320], [x + 400, 300], [x + 420, 690], [x + 20, 690]]), WHITE, 6);
    shade(c, () => polyP(c, [[x, 320], [x + 400, 300], [x + 420, 690], [x + 20, 690]]), "#ece5d6", 22, 0);
    line(c, [[x + 205, 310], [x + 215, 690]], 3, COL.grey);
    const r = rnd(n + 1); for (let i = 0; i < n; i++) speck(c, x + 50 + r() * 320, 360 + r() * 300, 4 + r() * 6, "#6e6660");
  };
  tissue(80, 70); tissue(580, 5);
  bus(c, 110, 260, 0.45); smoke(c, 60, 130, 0.5, SMKDK);
  shape(c, () => rrect(c, 680, 80, 200, 150, 6), "#f2e0c6"); shape(c, () => polyP(c, [[660, 90], [780, 10], [900, 90]]), COL.red);
  shape(c, () => rrect(c, 760, 140, 40, 90, 4), COL.wood, 4);
  // torch and mirror
  shape(c, () => rrect(c, 120, 840, 280, 100, 24), COL.yellow); shape(c, () => rrect(c, 380, 825, 70, 130, 14), COL.steelDk);
  polygon(c, [[450, 860], [650, 790], [650, 990], [450, 930]]);
  shape(c, () => ell(c, 830, 890, 120, 120), COL.glass, 7); shine(c, [[760, 830], [810, 800]], 9);
  shape(c, () => rrect(c, 812, 1000, 36, 70, 8), COL.wood, 5);
};
const polygon = (c: Ctx, pts: number[][]) => { c.beginPath(); polyP(c, pts); c.fillStyle = "rgba(255,230,120,0.5)"; c.fill(); };

// 7 a4 haze watch: the same tower over five days
const a4 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) { hazyView(c, 30 + i * 204, 220, 190, 560, i); write(c, String(i + 1), 100 + i * 204, 840, 80, INK, 9); }
  arrow(c, [[60, 960], [1020, 960]], RED, 12);
};

// 8 p1 clean-air week: smoky kitchen, then a kitchen with a lid and an exhaust fan
const p1 = (c: Ctx) => {
  ground(c);
  const kitchen = (x: number, good: boolean) => {
    shape(c, () => rrect(c, x, 90, 480, 760, 16), WALL, 7);
    shape(c, () => rrect(c, x, 700, 480, 150, 8), COL.teal, 7);
    shape(c, () => rrect(c, x + 150, 650, 190, 56, 8), COL.steelDk, 5);
    shape(c, () => polyP(c, [[x + 160, 650], [x + 330, 650], [x + 320, 540], [x + 170, 540]]), COL.steel, 6);
    if (good) shape(c, () => rrect(c, x + 150, 520, 190, 36, 14), COL.steelDk, 5); else flame(c, x + 250, 650, 0.45);
    // card on the wall
    shape(c, () => rrect(c, x + 40, 130, 130, 170, 6), WHITE, 6); const r = rnd(good ? 3 : 4); for (let i = 0; i < (good ? 4 : 36); i++) speck(c, x + 60 + r() * 90, 160 + r() * 120, 4 + r() * 3, DUSTC);
    if (good) { shape(c, () => ell(c, x + 380, 190, 70, 70), COL.steelIn, 7); for (let k = 0; k < 4; k++) { c.save(); c.translate(x + 380, 190); c.rotate(k * Math.PI / 2 + 0.4); shape(c, () => ell(c, 0, -32, 16, 32), COL.steelDk, 4); c.restore(); } smoke(c, x + 250, 440, 0.4, "#d3d0d8"); arrow(c, [[x + 300, 380], [x + 370, 270]], COL.blue, 8); }
    else { smoke(c, x + 250, 420, 1.1, SMKDK); smoke(c, x + 320, 300, 1.0, SMKDK); }
  };
  kitchen(30, false); kitchen(570, true);
  arrow(c, [[200, 960], [880, 960]], RED, 12);
};

// 9 c1 window dust filter
const c1 = (c: Ctx) => {
  ground(c, SKYC);
  c.fillStyle = WALL; c.fillRect(540, 0, 540, D);
  shape(c, () => rrect(c, 400, 120, 280, 820, 14), "rgba(0,0,0,0)", 12);
  shape(c, () => rrect(c, 410, 130, 260, 800, 8), COL.cloth, 8);
  c.save(); c.beginPath(); rrect(c, 410, 130, 260, 800, 8); c.clip(); c.strokeStyle = COL.grey; c.lineWidth = 3;
  for (let k = 0; k < 20; k++) { line(c, [[410 + k * 14, 130], [410 + k * 14, 930]], 2, COL.grey); line(c, [[410, 130 + k * 40], [670, 130 + k * 40]], 2, COL.grey); }
  c.restore();
  const r = rnd(6); for (let i = 0; i < 22; i++) speck(c, 330 + r() * 70, 160 + r() * 740, 6 + r() * 5, DUSTC);
  for (let i = 0; i < 14; i++) speck(c, 60 + r() * 220, 160 + r() * 740, 6 + r() * 5, DUSTC);
  [260, 450, 640, 820].forEach((y) => arrow(c, [[740, y], [1000, y]], COL.blueDk, 10));
  for (let i = 0; i < 10; i++) { c.beginPath(); ell(c, 720 + r() * 280, 180 + r() * 700, 9, 9); c.fillStyle = "rgba(255,255,255,0.85)"; c.fill(); }
};

// 10 c2 a Bhogi without smoke: old things go in a box, a lamp is lit
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 480, 34);
  // old chair
  shape(c, () => rrect(c, 120, 600, 150, 26, 4), COL.wood); line(c, [[135, 626], [135, 800]], 14); line(c, [[255, 626], [255, 800]], 14);
  shape(c, () => rrect(c, 112, 400, 30, 210, 6), COL.wood); shape(c, () => rrect(c, 112, 400, 100, 26, 6), COL.wood);
  // old clothes bundle
  shape(c, () => ell(c, 220, 810, 150, 85), COL.pink, 6); shape(c, () => ell(c, 330, 850, 95, 60), COL.teal, 6);
  shape(c, () => rrect(c, 110, 830, 90, 70, 6), COL.purple, 6);
  arrow(c, [[430, 600], [620, 600]], RED, 14);
  // box
  shape(c, () => polyP(c, [[630, 620], [940, 620], [920, 900], [650, 900]]), "#c99a63"); shade(c, () => polyP(c, [[630, 620], [940, 620], [920, 900], [650, 900]]), "#a6753f", 20, 0);
  shape(c, () => polyP(c, [[630, 620], [700, 570], [980, 570], [940, 620]]), "#dcae75");
  shape(c, () => { c.moveTo(785, 790); c.bezierCurveTo(710, 740, 740, 690, 785, 725); c.bezierCurveTo(830, 690, 860, 740, 785, 790); c.closePath(); }, RED, 5);
  // diya
  shape(c, () => { c.moveTo(780, 270); c.bezierCurveTo(800, 340, 960, 340, 980, 270); c.lineTo(1010, 250); c.lineTo(780, 255); c.closePath(); }, "#c9703f");
  flame(c, 880, 255, 0.55);
};

// terms
const t0 = (c: Ctx) => {
  ground(c, SKYC);
  c.fillStyle = "#cfc9be"; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  flats(c, 640, 250, 200, 530, "#e7b79a", "#c78f70"); flats(c, 840, 380, 190, 400, "#b9cde3", "#8fabc7");
  for (const [x, y, r] of [[120, 780, 130], [220, 760, 110], [320, 780, 120]]) { c.beginPath(); ell(c, x, y, r, r * 0.55); c.fillStyle = COL.brown; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); }
  shape(c, () => ell(c, 200, 700, 190, 80), "#8a6a4f", 6);
  [[110, 690], [200, 670], [300, 700]].forEach(([x, y], i) => shape(c, () => rrect(c, x - 30, y - 20, 60, 36, 6), [COL.pink, COL.steel, COL.yellow][i], 4));
  flame(c, 200, 670, 0.9);
  smoke(c, 300, 450, 1.1); smoke(c, 470, 400, 1.2); smoke(c, 620, 380, 1.3, SMKDK);
};
const t1 = (c: Ctx) => {
  ground(c);
  const pan = (x: number, y: number) => shape(c, () => rrect(c, x, y, 460, 460, 22), "#f7f0e2", 7);
  pan(40, 40); pan(580, 40); pan(40, 580); pan(580, 580);
  smoke(c, 270, 270, 1.6);
  blob(c, [[820, 270, 38], [850, 290, 28], [790, 295, 22], [870, 245, 18]], COL.black); [[760, 220], [900, 330], [740, 330]].forEach(([x, y]) => speck(c, x, y, 7, COL.black));
  shape(c, () => rrect(c, 40, 700, 250, 80, 10), COL.steelDk);
  shape(c, () => { c.moveTo(290, 706); c.bezierCurveTo(400, 706, 440, 740, 440, 860); c.lineTo(380, 860); c.bezierCurveTo(380, 790, 350, 774, 290, 774); c.closePath(); }, "#8b6a45", 5);
  shape(c, () => ell(c, 410, 960, 110, 36), "#8b6a45", 5);
  
  [[700, 790], [800, 790]].forEach(([x]) => { c.beginPath(); c.arc(x + 20, 790, 50, Math.PI, 0); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 5; c.strokeStyle = "#f4f9fc"; c.stroke(); });
  shape(c, () => { c.moveTo(690, 790); c.lineTo(890, 790); c.lineTo(920, 1000); c.lineTo(660, 1000); c.closePath(); }, "rgba(235,245,252,0.92)", 6);
  shine(c, [[720, 830], [710, 950]], 9);
};
const t2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 36);
  shape(c, () => rrect(c, 90, 150, 880, 780, 14), WHITE, 7);
  const r = rnd(11); for (let i = 0; i < 90; i++) speck(c, 120 + r() * 820, 180 + r() * 720, 1.8 + r() * 2.2, "#7a726c");
  shape(c, () => polyP(c, [[640, 640], [700, 600], [900, 880], [840, 920]]), COL.wood, 6);
  c.save(); c.beginPath(); ell(c, 480, 480, 290, 290); c.clip(); c.fillStyle = WHITE; c.fillRect(0, 0, D, D);
  const q = rnd(2); const cols = [COL.black, "#7b5a3f", COL.grey];
  for (let i = 0; i < 26; i++) speck(c, 270 + q() * 420, 270 + q() * 420, 10 + q() * 22, cols[i % 3]);
  c.restore();
  c.beginPath(); ell(c, 480, 480, 290, 290); c.fillStyle = "rgba(214,236,250,0.35)"; c.fill(); c.lineWidth = 22; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, 480, 480, 290, 290); c.lineWidth = 8; c.strokeStyle = COL.steelDk; c.stroke();
  shine(c, [[300, 340], [360, 280]], 14);
};
const t3 = (c: Ctx) => {
  ground(c, "#f2e4cc");
  const smudge = rnd(1);
  for (let i = 0; i < 22; i++) { c.beginPath(); ell(c, 540 + (smudge() - 0.5) * 60, 200 + i * 15, 70 - i * 1.3 + 20, 40); c.fillStyle = "rgba(43,35,64,0.09)"; c.fill(); }
  shape(c, () => rrect(c, 40, 830, 1000, 70, 6), COL.wood, 7);
  shadow(c, 560, 830, 280, 20);
  shape(c, () => { c.moveTo(310, 700); c.bezierCurveTo(330, 830, 750, 830, 770, 700); c.lineTo(840, 670); c.bezierCurveTo(780, 700, 800, 710, 770, 700); c.closePath(); }, "#c9703f");
  shape(c, () => ell(c, 540, 700, 230, 30), "#a5562e", 6);
  line(c, [[540, 690], [540, 672]], 8, COL.black);
  flame(c, 540, 670, 0.9);
};
const t4 = (c: Ctx) => {
  ground(c);
  // one hair: a thick band, and a column of 30 tiny dots exactly as tall as the band is thick
  const top = 330, th = 420;
  c.lineCap = "round"; line(c, [[-100, top + th / 2], [440, top + th / 2]], th + 12, INK); line(c, [[-100, top + th / 2], [440, top + th / 2]], th, "#3b3350");
  c.lineCap = "round"; [[top + 90, 0.5], [top + 200, 0.3], [top + 310, 0.5]].forEach(([y, al]) => { c.globalAlpha = al; line(c, [[-60, y], [400, y]], 14, WHITE); c.globalAlpha = 1; });
  for (let i = 0; i < 30; i++) { c.beginPath(); ell(c, 800, top + 7 + i * 14, 7.5, 7.5); c.fillStyle = COL.grey; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  line(c, [[560, top], [900, top]], 5, RED); line(c, [[560, top + th], [900, top + th]], 5, RED);
  write(c, "30", 880, top + th / 2 - 50, 100, RED, 11);
};
const t5 = (c: Ctx) => {
  ground(c, "#f6e8e0");
  const pts = [[150, 880], [330, 760], [560, 600], [820, 380], [940, 200]];
  const stroke = (w: number, col: string) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.lineWidth = w; c.strokeStyle = col; c.lineCap = "butt"; c.lineJoin = "round"; c.stroke(); };
  stroke(330, INK); stroke(318, "#e9908a"); stroke(250, "#bfe3ee"); stroke(130, "#fff6ee");
  const r = rnd(12);
  const along = (t: number) => { const s = t * 4, i = Math.min(3, Math.floor(s)), f = s - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f, Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; };
  for (let k = 0; k < 9; k++) { const [x, y, an] = along(0.1 + k * 0.1); const s = k % 2 ? 1 : -1; speck(c, x - Math.sin(an) * s * (95 + r() * 18), y + Math.cos(an) * s * (95 + r() * 18), 9 + r() * 6, COL.greyDk); }
  for (let k = 0; k < 7; k++) { const [x, y, an] = along(0.08 + k * 0.05); speck(c, x + Math.sin(an) * (30 - k * 10), y - Math.cos(an) * (30 - k * 10), 8, COL.greyDk); }
  for (let k = 0; k < 6; k++) { const [x, y, an] = along(0.04 + k * 0.05); for (const sg of [-1, 1]) { const nx = -Math.sin(an) * sg, ny = Math.cos(an) * sg; line(c, [[x + nx * 125, y + ny * 125], [x + nx * 62, y + ny * 62]], 7, INK); } }
  arrow(c, [[170, 780], [420, 640]], COL.blueDk, 10);
};
const t6 = (c: Ctx) => {
  ground(c, SKYC);
  c.fillStyle = "#87b95e"; c.fillRect(0, 640, D, 160); line(c, [[0, 640], [D, 640]], 6);
  flats(c, 40, 280, 220, 360, "#e7b79a", "#c78f70"); flats(c, 280, 380, 200, 260, "#b9cde3", "#8fabc7");
  shape(c, () => rrect(c, 480, 690, 340, 36, 10), COL.steelDk, 6);
  shape(c, () => rrect(c, 800, 680, 70, 56, 8), COL.steelDk, 6);
  shape(c, () => { c.moveTo(850, 710); c.quadraticCurveTo(940, 740, 940, 840); c.lineTo(830, 840); c.closePath(); }, "#8b6a45", 5);
  c.fillStyle = COL.waterDk; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  shape(c, () => ell(c, 800, 900, 270, 80), "#8b6a45", 0); c.globalAlpha = 0.9;
  for (let k = 0; k < 6; k++) line(c, [[40 + k * 180, 880 + (k % 2) * 60], [110 + k * 180, 880 + (k % 2) * 60]], 6, "#b7d6ee");
  c.globalAlpha = 1;
};
const t7 = (c: Ctx) => ugwater(c, false);
const ugwater = (c: Ctx, dirty: boolean) => {
  ground(c, SKYC);
  const g = dirty ? 470 : 240, s = g + 260, w = 760;
  c.fillStyle = COL.soil; c.fillRect(0, g, D, s - g); c.fillStyle = "#9b958f"; c.fillRect(0, s, D, D - s);
  const r = rnd(5); for (let i = 0; i < 50; i++) speck(c, r() * D, g + 20 + r() * (s - g - 40), 7 + r() * 8, COL.soilDk);
  for (let i = 0; i < 16; i++) { shape(c, () => ell(c, 40 + (i % 8) * 140 + r() * 40, s + 40 + Math.floor(i / 8) * 90 + r() * 30, 50 + r() * 30, 34 + r() * 14, r()), COL.greyDk, 5); }
  c.fillStyle = dirty ? "#8a7d78" : COL.water; c.fillRect(0, w + 70, D, D - w - 70);
  for (let i = 0; i < 8; i++) shape(c, () => ell(c, 60 + i * 135 + r() * 30, w + 150 + r() * 120, 56 + r() * 20, 40 + r() * 10, r()), COL.greyDk, 5);
  c.fillStyle = COL.grass ?? COL.green; c.fillRect(0, g - 28, D, 28); line(c, [[0, g - 28], [D, g - 28]], 6); line(c, [[0, g], [D, g]], 5);
  // the borewell: a steel pipe from the surface down into the water
  shape(c, () => rrect(c, 830, g - 120, 60, w - g + 260, 8), COL.steel, 6); shape(c, () => rrect(c, 815, g - 150, 90, 40, 8), COL.steelDk, 6);
  c.fillStyle = dirty ? "#8a7d78" : COL.water; c.fillRect(0, w + 70, 815, D - w - 70);
};
const t8 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1040, 280, 22);
  shape(c, () => rrect(c, 250, 70, 580, 960, 60), COL.black, 8);
  shape(c, () => rrect(c, 285, 130, 510, 840, 24), "#fff6e8", 5);
  write(c, "152", 365, 210, 180, INK, 20);
  const segs = ["#4caf50", "#ffd34d", "#f39a3c", "#d7372b", "#8b4fa8", "#7a2230"];
  segs.forEach((col, i) => { c.fillStyle = col; c.fillRect(315 + i * 74, 560, 74, 90); });
  c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(315, 560, 444, 90);
  shape(c, () => polyP(c, [[315 + 74 * 3.4, 540], [315 + 74 * 3.4 - 26, 490], [315 + 74 * 3.4 + 26, 490]]), INK, 4);
  smoke(c, 540, 810, 0.8, SMK);
};
const t9 = (c: Ctx) => { ground(c); hazyView(c, 40, 160, 470, 760, 0); hazyView(c, 570, 160, 470, 760, 4); };

// explanations
const x0 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[520, 300], [560, 300], [600, 960], [480, 960]]), COL.steelDk, 6);
  shape(c, () => rrect(c, 360, 940, 360, 50, 14), COL.steel, 6);
  const an = 0.14; c.save(); c.translate(540, 300); c.rotate(an); shape(c, () => rrect(c, -300, -14, 600, 28, 12), COL.black, 6); c.restore();
  const ex = 540 + Math.cos(an) * 300, ey = 300 + Math.sin(an) * 300, lx = 540 - Math.cos(an) * 300, ly = 300 - Math.sin(an) * 300;
  shape(c, () => ell(c, 540, 300, 28, 28), COL.yellow, 6);
  const pan = (x: number, y: number) => { line(c, [[x, y], [x - 120, y + 230]], 5); line(c, [[x, y], [x + 120, y + 230]], 5); shape(c, () => rrect(c, x - 140, y + 220, 280, 30, 14), COL.steel, 6); return y + 220; };
  const ly2 = pan(lx, ly), ey2 = pan(ex, ey);
  smoke(c, lx - 40, ly2 - 50, 0.55); shape(c, () => ell(c, lx + 60, ly2 - 130, 60, 36), COL.sky, 5); [lx + 30, lx + 60, lx + 90].forEach((x) => droplet(c, x, ly2 - 70, 0.6));
  smoke(c, ex - 70, ey2 - 70, 1.0, SMKDK); smoke(c, ex + 50, ey2 - 90, 1.1, SMKDK); smoke(c, ex - 10, ey2 - 190, 1.0, SMKDK);
};
const x1 = (c: Ctx) => {
  ground(c, SKYC);
  c.fillStyle = "#cfc9be"; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  flats(c, 30, 330, 250, 510, "#e7b79a", "#c78f70"); smoke(c, 150, 250, 0.45, "#d3d0d8");
  shape(c, () => rrect(c, 330, 560, 250, 280, 6), "#b9b4ab"); shape(c, () => rrect(c, 520, 280, 56, 290, 4), COL.greyDk); smoke(c, 548, 200, 0.8, SMKDK); smoke(c, 660, 130, 0.7, SMKDK);
  line(c, [[700, 840], [700, 400]], 14); line(c, [[700, 400], [900, 400]], 14); line(c, [[880, 400], [880, 520]], 5);
  shape(c, () => rrect(c, 760, 600, 220, 240, 4), "#e0c9a0"); c.beginPath(); ell(c, 810, 600, 90, 50); c.fillStyle = "rgba(160,140,110,0.7)"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  bus(c, 110, 960, 1.0); smoke(c, 70, 880, 0.6, COL.black);
  shape(c, () => ell(c, 780, 920, 110, 40), COL.brown, 6); flame(c, 780, 910, 0.55); smoke(c, 800, 700, 0.5);
};
const x2 = (c: Ctx) => {
  wall(c);
  shape(c, () => rrect(c, -20, 760, 1120, 340, 8), COL.teal, 7);
  shape(c, () => rrect(c, 330, 720, 400, 56, 8), COL.steelDk, 5);
  shape(c, () => polyP(c, [[400, 720], [650, 720], [670, 640], [380, 640]]), COL.steel, 6); shape(c, () => rrect(c, 380, 610, 290, 40, 16), COL.steelDk, 5);
  flame(c, 520, 720, 0.4);
  smoke(c, 480, 520, 0.8, "#d3d0d8"); smoke(c, 560, 360, 0.9, "#d3d0d8");
  shape(c, () => ell(c, 860, 230, 120, 120), COL.steelIn, 8);
  for (let k = 0; k < 4; k++) { c.save(); c.translate(860, 230); c.rotate(k * Math.PI / 2 + 0.4); shape(c, () => ell(c, 0, -52, 26, 52), COL.steelDk, 5); c.restore(); }
  arrow(c, [[640, 400], [740, 290]], RED, 12);
  arrow(c, [[960, 230], [1060, 230]], RED, 12);
};
const x4 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 5, COL.grey);
  const sun = (x: number) => { shape(c, () => ell(c, x, 110, 60, 60), COL.yellow, 6); };
  sun(270); sun(810);
  const SUN = "#f2a516";
  // dusty leaf
  const lp1 = leafPath(c, 70, 900, 430, -0.55, 0.25), lp2 = leafPath(c, 590, 900, 430, -0.55, 0.25);
  shape(c, lp1, COL.leaf, 6); c.save(); c.beginPath(); lp1(); c.clip(); c.globalAlpha = 0.65; c.fillStyle = "#8f8a84"; c.fillRect(0, 0, D, D); c.globalAlpha = 1; const r = rnd(3); for (let i = 0; i < 90; i++) speck(c, 100 + r() * 300, 650 + r() * 230, 3 + r() * 3, "#5b524a"); c.restore();
  c.beginPath(); lp1(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, lp2, COL.leaf, 6); shade(c, lp2, COL.leafDk, 20, 20); shine(c, [[680, 830], [790, 730]], 12);
  line(c, [[590, 900], [957, 675]], 4, COL.leafDk);
  arrow(c, [[220, 200], [250, 420]], SUN, 10); arrow(c, [[330, 420], [410, 250]], SUN, 10); 
  arrow(c, [[760, 200], [790, 440]], SUN, 12); arrow(c, [[860, 200], [890, 520]], SUN, 12);
  droplet(c, 840, 850, 1.3);
};
const x5 = (c: Ctx) => {
  ugwater(c, true);
  // rain
  blob(c, [[200, 130, 60], [270, 140, 50], [130, 145, 45], [220, 90, 45]], COL.sky);
  [120, 190, 260].forEach((x) => droplet(c, x, 260, 0.9)); [160, 230].forEach((x) => droplet(c, x, 330, 0.9));
  // heap of rubbish
  shape(c, () => ell(c, 360, 450, 210, 90), "#8a6a4f", 6);
  [[290, 410], [380, 400], [450, 440]].forEach(([x, y], i) => shape(c, () => rrect(c, x - 28, y - 18, 56, 34, 6), [COL.pink, COL.steel, COL.yellow][i], 4));
  // dark water seeping down to the groundwater
  c.save(); c.globalAlpha = 0.55; c.fillStyle = "#4a3f3a"; c.fillRect(300, 470, 130, 330); c.restore();
  arrow(c, [[365, 520], [365, 740]], RED, 12);
};
const x6 = (c: Ctx) => {
  ground(c);
  // left: a sealed glass box with one plant
  shape(c, () => rrect(c, 40, 340, 400, 520, 12), COL.glass, 8);
  shine(c, [[70, 380], [70, 520]], 10);
  plant(c, 240, 850, 0.9);
  shape(c, () => rrect(c, 28, 320, 424, 40, 8), COL.steelDk, 6);
  line(c, [[500, 100], [500, 1000]], 5, COL.grey);
  // right: a room with an open window and two plants
  shape(c, () => rrect(c, 540, 120, 500, 760, 12), WALL, 7);
  shape(c, () => rrect(c, 580, 180, 260, 320, 8), SKYC, 7); line(c, [[710, 180], [710, 500]], 6);
  shape(c, () => rrect(c, 540, 840, 500, 60, 8), COL.wood, 7);
  plant(c, 650, 840, 0.75); plant(c, 920, 840, 0.7);
  arrow(c, [[520, 340], [660, 340], [920, 400]], COL.blueDk, 10);
  arrow(c, [[920, 520], [780, 520]], COL.blueDk, 10);
};

const LIST = [intro, e1, e2, e3, a1, a2, a3, a4, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, x0, x1, x2, x4, x5, x6];
export const ic_environmentPollutionL3 = cards("sci.environment.pollution.L3 cards", LIST);
