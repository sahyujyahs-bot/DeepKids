import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, plate, write, cards } from "./flatKit";

// sci.sky.exploring-space.L3 · picture cards (terms, explanations, activities).
const SPACE = "#1d2140", SPACE2 = "#2c3262", MOON = "#c9c4bb", MOONDK = "#9d978d", AIR = "#9ccbef";
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
const stars = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seedN = 3) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), s = 3 + r() * 4; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6c8"; c.fill(); }
};
const dot = (c: Ctx, x: number, y: number, r: number, col: string = AIR) => shape(c, () => ell(c, x, y, r, r), col, Math.max(2.5, r * 0.22));
// flames: pointing up (flameUp) or down (flameDown); base at (x, y)
const flameUp = (c: Ctx, x: number, y: number, w: number, len: number, o: string = COL.orange, i: string = COL.yellow) => {
  const f = (k: number) => () => { c.moveTo(x - w * k, y); c.bezierCurveTo(x - w * k * 1.3, y - len * 0.45 * k, x - w * k * 0.2, y - len * 0.7 * k, x, y - len * k); c.bezierCurveTo(x + w * k * 0.2, y - len * 0.7 * k, x + w * k * 1.3, y - len * 0.45 * k, x + w * k, y); c.closePath(); };
  shape(c, f(1), o, 5); shape(c, f(0.55), i, 0);
};
const flameDown = (c: Ctx, x: number, y: number, w: number, len: number) => {
  const f = (k: number) => () => { c.moveTo(x - w * k, y); c.bezierCurveTo(x - w * k * 1.2, y + len * 0.5 * k, x - w * k * 0.2, y + len * 0.75 * k, x, y + len * k); c.bezierCurveTo(x + w * k * 0.2, y + len * 0.75 * k, x + w * k * 1.2, y + len * 0.5 * k, x + w * k, y); c.closePath(); };
  shape(c, f(1), COL.orange, 6); shape(c, f(0.6), COL.yellow, 0);
};
// a rocket standing with its base at (x, yb)
const rocket = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  const hw = w / 2, body = () => { c.moveTo(x - hw, yb); c.lineTo(x - hw, yb - h * 0.62); c.bezierCurveTo(x - hw, yb - h * 0.88, x - hw * 0.35, yb - h * 0.97, x, yb - h); c.bezierCurveTo(x + hw * 0.35, yb - h * 0.97, x + hw, yb - h * 0.88, x + hw, yb - h * 0.62); c.lineTo(x + hw, yb); c.closePath(); };
  shape(c, () => polyP(c, [[x - hw, yb - h * 0.34], [x - hw * 1.9, yb + 4], [x - hw, yb - 6]]), COL.red, 6);
  shape(c, () => polyP(c, [[x + hw, yb - h * 0.34], [x + hw * 1.9, yb + 4], [x + hw, yb - 6]]), COL.red, 6);
  shape(c, () => polyP(c, [[x - hw * 0.55, yb], [x + hw * 0.55, yb], [x + hw * 0.4, yb + h * 0.07], [x - hw * 0.4, yb + h * 0.07]]), COL.steelDk, 6);
  shape(c, body, WHITE, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.red; c.fillRect(x - w, yb - h * 1.05, w * 2, h * 0.2); c.restore();
  shade(c, body, COL.steelDk, hw * 0.35, 0, 0.45);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, yb - h * 0.55, hw * 0.42, hw * 0.42), COL.blue, 6);
  shine(c, [[x - hw * 0.2, yb - h * 0.6], [x - hw * 0.08, yb - h * 0.66]], 6);
};
const astro = (c: Ctx, x: number, y: number, u: number, suit = "#f4f1ea", suitDk = "#cfc9bb", helmet = true, hair = false, longHair = false) => {
  shape(c, () => rrect(c, x - 34 * u, y - 78 * u, 68 * u, 46 * u, 10 * u), COL.steelDk, 6);
  for (const s of [-1, 1]) { shape(c, () => rrect(c, x + (s < 0 ? -22 : 4) * u, y - 34 * u, 18 * u, 34 * u, 6 * u), suit, 6); shape(c, () => rrect(c, x + (s < 0 ? -25 : 3) * u, y - 10 * u, 22 * u, 12 * u, 5 * u), COL.steelDk, 5); }
  const torso = () => rrect(c, x - 26 * u, y - 80 * u, 52 * u, 52 * u, 14 * u);
  shape(c, torso, suit); shade(c, torso, suitDk, 10 * u, 0);
  for (const s of [-1, 1]) { shape(c, () => rrect(c, x + (s < 0 ? -42 : 26) * u, y - 76 * u, 16 * u, 42 * u, 8 * u), suit, 6); shape(c, () => ell(c, x + (s < 0 ? -34 : 34) * u, y - 32 * u, 9 * u, 9 * u), COL.steelDk, 5); }
  shape(c, () => rrect(c, x - 10 * u, y - 62 * u, 20 * u, 14 * u, 4 * u), COL.blue, 4);
  shape(c, () => ell(c, x, y - 82 * u, 14 * u, 6 * u), COL.steelDk, 5);
  const hy = y - 100 * u;
  if (helmet) {
    shape(c, () => ell(c, x, hy, 24 * u, 24 * u), suit); shade(c, () => ell(c, x, hy, 24 * u, 24 * u), suitDk, 7 * u, 0);
    shape(c, () => ell(c, x + 2 * u, hy + 1 * u, 16 * u, 14 * u), "#26324f", 5); shine(c, [[x - 6 * u, hy - 5 * u], [x + 2 * u, hy - 8 * u]], 4 * u);
  } else {
    if (longHair) shape(c, () => rrect(c, x - 26 * u, hy - 6 * u, 52 * u, 56 * u, 18 * u), CLOTH.hair, 5);
    shape(c, () => ell(c, x, hy, 21 * u, 22 * u), SKIN.adult);
    shape(c, () => { c.moveTo(x - 22 * u, hy - 2 * u); c.bezierCurveTo(x - 22 * u, hy - 32 * u, x + 22 * u, hy - 32 * u, x + 22 * u, hy - 2 * u); c.quadraticCurveTo(x, hy - 16 * u, x - 22 * u, hy - 2 * u); c.closePath(); }, CLOTH.hair, 5);
    shape(c, () => ell(c, x - 8 * u, hy + 3 * u, 2.6 * u, 3.4 * u), INK, 0); shape(c, () => ell(c, x + 8 * u, hy + 3 * u, 2.6 * u, 3.4 * u), INK, 0);
    c.beginPath(); c.arc(x, hy + 9 * u, 7 * u, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
    void hair;
  }
};
// the Moon: a rounded grey hill from y down, with a few craters
const moonGround = (c: Ctx, y: number) => {
  shape(c, () => { c.moveTo(-20, y + 30); c.bezierCurveTo(250, y - 40, 800, y - 40, 1100, y + 30); c.lineTo(1100, D + 20); c.lineTo(-20, D + 20); c.closePath(); }, MOON, 6);
  for (const [x, yy, r] of [[170, y + 120, 60], [560, y + 200, 80], [880, y + 100, 50], [330, y + 240, 40]]) { shape(c, () => ell(c, x, yy, r, r * 0.35), MOONDK, 4); }
};
const planet = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => { const p = () => ell(c, x, y, r, r); shape(c, p, col, 5); shade(c, p, dk, r * 0.3, r * 0.15); };
const satIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const d of [-1, 1]) { shape(c, () => rrect(c, x + d * 40 * s - 30 * s, y - 16 * s, 60 * s, 32 * s, 3 * s), COL.blue, 5); line(c, [[x + d * 40 * s - 10 * s, y - 16 * s], [x + d * 40 * s - 10 * s, y + 16 * s]], 3, WHITE); line(c, [[x + d * 40 * s + 10 * s, y - 16 * s], [x + d * 40 * s + 10 * s, y + 16 * s]], 3, WHITE); }
  shape(c, () => rrect(c, x - 22 * s, y - 24 * s, 44 * s, 48 * s, 8 * s), COL.yellow, 6);
  line(c, [[x, y - 24 * s], [x, y - 44 * s]], 5); shape(c, () => ell(c, x, y - 46 * s, 6 * s, 6 * s), COL.red, 4);
};
const landerIcon = (c: Ctx, x: number, y: number, s: number) => {
  for (const d of [-1, 1]) { line(c, [[x + d * 18 * s, y - 20 * s], [x + d * 44 * s, y]], 6); line(c, [[x + d * 44 * s, y], [x + d * 54 * s, y]], 6); }
  shape(c, () => rrect(c, x - 28 * s, y - 56 * s, 56 * s, 42 * s, 8 * s), COL.yellow, 6);
  shape(c, () => ell(c, x, y - 36 * s, 9 * s, 9 * s), "#26324f", 4);
};

// ---------------------------------------------------------------- expl.0  Where space begins
const where = (c: Ctx) => {
  const bands = 24;
  for (let i = 0; i < bands; i++) { const y0 = (i * 1010) / bands; c.fillStyle = mix("#7fc0ec", SPACE, Math.pow(1 - (i + 0.5) / bands, 0.2) * 0 + (1 - i / bands) ** 0 * 0 + Math.min(1, Math.max(0, 1 - (y0 + 40) / 900))); c.fillRect(0, y0, D, 1010 / bands + 2); }
  stars(c, 0, 0, D, 280, 28, 5);
  // thin air dots, fewer higher up
  const r = rnd(9);
  for (let i = 0; i < 70; i++) { const y = 260 + Math.pow(r(), 0.55) * 640; const keep = (y - 250) / 650; if (r() < keep) { c.beginPath(); ell(c, 40 + r() * 1000, y, 6, 6); c.fillStyle = "rgba(255,255,255,0.75)"; c.fill(); } }
  // ground and city
  shape(c, () => rrect(c, -20, 940, 1120, 170, 6), COL.leaf, 6);
  for (const [x, w, h, col] of [[80, 90, 110, COL.orange], [190, 70, 150, COL.pink], [270, 100, 90, COL.yellow], [800, 90, 130, COL.purple], [910, 100, 100, COL.orange]] as [number, number, number, string][]) {
    shape(c, () => rrect(c, x, 940 - h, w, h, 6), col, 5);
    for (let k = 0; k < 2; k++) shape(c, () => rrect(c, x + 14 + k * (w / 2 - 6), 940 - h + 20, w / 3.5, h / 4, 3), COL.sky, 3);
  }
  // mountain top
  shape(c, () => polyP(c, [[300, 940], [470, 700], [540, 760], [610, 690], [800, 940]]), "#8a8fa0", 6);
  shape(c, () => polyP(c, [[552, 745], [610, 690], [650, 745], [610, 735], [585, 760]]), WHITE, 4);
  // pigeon
  shape(c, () => ell(c, 220, 720, 40, 26), "#9aa3b2", 5); shape(c, () => ell(c, 258, 698, 18, 17), "#9aa3b2", 5); shape(c, () => polyP(c, [[272, 696], [292, 702], [272, 708]]), COL.orange, 4);
  shape(c, () => polyP(c, [[185, 716], [150, 740], [190, 730]]), "#7f8898", 5); shape(c, () => ell(c, 220, 708, 26, 12, -0.5), "#7f8898", 4);
  // plane
  shape(c, () => ell(c, 440, 520, 120, 24), WHITE, 6); shape(c, () => polyP(c, [[470, 520], [420, 590], [395, 590], [420, 520]]), COL.steel, 5);
  shape(c, () => polyP(c, [[330, 515], [320, 465], [350, 465], [375, 515]]), COL.red, 5);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 400 + k * 28, 514, 7, 7), COL.sky, 3);
  // the line of space
  for (let x = 20; x < 1060; x += 60) line(c, [[x, 270], [x + 34, 270]], 9, RED);
  arrow(c, [[960, 700], [960, 320]], WHITE, 12);
};

// ---------------------------------------------------------------- term.2  Oxygen
const oxygen = (c: Ctx) => {
  ground(c);
  const air = (x: number, y: number) => dot(c, x, y, 17);
  for (const [x, y] of [[420, 150], [500, 120], [580, 160], [470, 210], [550, 230], [630, 120], [380, 230]]) air(x, y);
  // candle
  shadow(c, 290, 880, 170, 24);
  plate(c, 280, 860, 150, 34);
  shape(c, () => rrect(c, 235, 620, 90, 235, 12), "#fff3d6", 6); shade(c, () => rrect(c, 235, 620, 90, 235, 12), "#e9d3a4", 28, 0);
  line(c, [[280, 620], [280, 588]], 6); flameUp(c, 280, 596, 36, 130);
  // child
  person(c, 790, 960, 560, {});
  arrow(c, [[400, 270], [330, 380], [300, 420]], RED, 10);
  arrow(c, [[620, 260], [700, 330], [735, 370]], RED, 10);
};

// ---------------------------------------------------------------- term.3  Fuel
const fuel = (c: Ctx) => {
  ground(c);
  // gas stove
  shadow(c, 270, 790, 230, 30);
  shape(c, () => polyP(c, [[90, 640], [450, 640], [500, 760], [40, 760]]), COL.steel, 6);
  shape(c, () => polyP(c, [[40, 760], [500, 760], [500, 800], [40, 800]]), COL.steelDk, 6);
  shape(c, () => ell(c, 270, 690, 100, 28), COL.black, 5);
  for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2, fx = 270 + Math.cos(a) * 80, fy = 692 + Math.sin(a) * 20; flameUp(c, fx, fy, 14, 70 - Math.max(0, -Math.sin(a)) * 20, "#6ea8e8", "#bfe0f5"); }
  for (const kx of [140, 270, 400]) shape(c, () => ell(c, kx, 782, 16, 12), COL.black, 4);
  // rocket with its flame
  shadow(c, 800, 905, 190, 24);
  shape(c, () => rrect(c, 650, 840, 300, 60, 10), COL.steel, 6);
  rocket(c, 800, 560, 130, 430);
  flameDown(c, 800, 600, 62, 230);
  for (const [x, y, r] of [[660, 835, 55], [725, 845, 45], [880, 838, 60], [945, 840, 42]]) shape(c, () => ell(c, x, y, r, r * 0.6), "#e6e0d6", 5);
};

// ---------------------------------------------------------------- term.13  Mission
const back = (c: Ctx, x: number, y: number, s: number, cloth: string, bun = false) => {
  shape(c, () => rrect(c, x - 70 * s, y - 40 * s, 140 * s, 150 * s, 40 * s), cloth, 6);
  if (bun) shape(c, () => ell(c, x, y - 118 * s, 26 * s, 26 * s), CLOTH.hair, 5);
  shape(c, () => ell(c, x, y - 70 * s, 50 * s, 54 * s), CLOTH.hair, 6);
  shape(c, () => ell(c, x - 50 * s, y - 70 * s, 10 * s, 16 * s), SKIN.adult, 4); shape(c, () => ell(c, x + 50 * s, y - 70 * s, 10 * s, 16 * s), SKIN.adult, 4);
};
const mission = (c: Ctx) => {
  ground(c, "#cfe0e8");
  shape(c, () => rrect(c, 110, 70, 860, 440, 20), "#232b3e", 8);
  stars(c, 130, 90, 950, 490, 22, 8);
  planet(c, 740, 290, 120, COL.red, "#b6402c");
  shape(c, () => ell(c, 700, 250, 22, 10), "#cc6a55", 3);
  satIcon(c, 340, 260, 1.3);
  for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, 440 + i * 36, 262 - Math.sin(i * 0.5) * 6, 6, 6); c.fillStyle = WHITE; c.fill(); }
  arrow(c, [[420, 290], [560, 290]], WHITE, 8);
  shape(c, () => rrect(c, 40, 640, 1000, 90, 16), COL.wood, 6);
  for (const x of [200, 540, 880]) shape(c, () => rrect(c, x - 90, 560, 180, 90, 8), COL.black, 6);
  back(c, 210, 880, 1.15, CLOTH.adult); back(c, 540, 900, 1.15, CLOTH.child, true); back(c, 870, 880, 1.15, "#6aa53f");
};

// ---------------------------------------------------------------- expl.2  Rocket carries oxygen
const cutaway = (c: Ctx) => {
  ground(c);
  const x = 470, yb = 800, hw = 150, h = 700;
  shape(c, () => polyP(c, [[x - hw, yb - 250], [x - hw * 1.75, yb + 6], [x - hw, yb - 10]]), COL.red, 6);
  shape(c, () => polyP(c, [[x + hw, yb - 250], [x + hw * 1.75, yb + 6], [x + hw, yb - 10]]), COL.red, 6);
  shape(c, () => polyP(c, [[x - 80, yb], [x + 80, yb], [x + 120, yb + 70], [x - 120, yb + 70]]), COL.steelDk, 6);
  const body = () => { c.moveTo(x - hw, yb); c.lineTo(x - hw, yb - h * 0.6); c.bezierCurveTo(x - hw, yb - h * 0.88, x - hw * 0.3, yb - h * 0.97, x, yb - h); c.bezierCurveTo(x + hw * 0.3, yb - h * 0.97, x + hw, yb - h * 0.88, x + hw, yb - h * 0.6); c.lineTo(x + hw, yb); c.closePath(); };
  shape(c, body, COL.steelIn, 7);
  // oxygen tank (top): pale blue with air dots
  shape(c, () => rrect(c, x - 118, yb - 600, 236, 220, 40), "#cfe6f7", 6);
  const r = rnd(2); for (let i = 0; i < 9; i++) dot(c, x - 85 + (i % 3) * 85 + r() * 14, yb - 565 + Math.floor(i / 3) * 62 + r() * 10, 14);
  // fuel tank (middle): orange liquid
  shape(c, () => rrect(c, x - 118, yb - 340, 236, 200, 40), COL.orange, 6);
  shade(c, () => rrect(c, x - 118, yb - 340, 236, 200, 40), "#d27c25", 30, 0);
  for (let i = 0; i < 3; i++) line(c, [[x - 80 + i * 70, yb - 310], [x - 60 + i * 70, yb - 290]], 7, COL.yellow);
  // pipes to the engine
  line(c, [[x - 50, yb - 380], [x - 50, yb - 360]], 18); line(c, [[x - 50, yb - 140], [x - 50, yb - 40], [x - 20, yb]], 22); line(c, [[x - 50, yb - 140], [x - 50, yb - 40], [x - 20, yb]], 12, COL.steel);
  flameDown(c, x, yb + 66, 90, 200);
  // the two things shown large at the side: an air bubble and a fuel drop, with arrows into the flame
  dot(c, 860, 260, 44); dot(c, 800, 330, 30); dot(c, 900, 340, 26);
  shape(c, () => { c.moveTo(860, 540); c.quadraticCurveTo(790, 640, 800, 700); c.arc(860, 700, 60, Math.PI, 0, true); c.quadraticCurveTo(930, 640, 860, 540); c.closePath(); }, COL.orange, 6);
  arrow(c, [[790, 300], [700, 300], [620, 300]], RED, 10);
  arrow(c, [[780, 620], [700, 600], [620, 580]], RED, 10);
};

// ---------------------------------------------------------------- expl.7  India in space
const marsIcon = (c: Ctx, x: number, y: number, s: number) => { planet(c, x, y, 55 * s, COL.red, "#b6402c"); c.beginPath(); c.ellipse(x, y, 80 * s, 24 * s, -0.4, 0, Math.PI * 2); c.lineWidth = 4; c.setLineDash([10, 10]); c.strokeStyle = WHITE; c.stroke(); c.setLineDash([]); shape(c, () => rrect(c, x + 52 * s, y - 40 * s, 22 * s, 18 * s, 4), COL.yellow, 4); };
const moonIcon = (c: Ctx, x: number, y: number, s: number) => { planet(c, x, y, 64 * s, MOON, MOONDK); shape(c, () => ell(c, x - 22 * s, y - 14 * s, 14 * s, 9 * s), MOONDK, 3); landerIcon(c, x + 4 * s, y - 56 * s, 0.75 * s); };
const timeline = (c: Ctx) => {
  ground(c, SPACE);
  stars(c, 0, 0, D, D, 40, 12);
  const pts: number[][] = [[170, 930], [350, 700], [600, 520], [860, 260]];
  const trail: number[][] = []; for (let i = 0; i <= 30; i++) { const t = i / 30; trail.push([150 + t * 800, 960 - Math.pow(t, 0.7) * 760 + Math.sin(t * 9) * 8]); }
  line(c, trail, 14, "#f39a3c"); line(c, trail, 6, COL.yellow);
  rocket(c, 170, 800, 52, 170); flameDown(c, 170, 812, 20, 60);
  satIcon(c, 360, 640, 0.9);
  marsIcon(c, 620, 450, 1);
  moonIcon(c, 880, 200, 1);
  void pts;
  write(c, "1963", 100, 940, 44, WHITE, 7); write(c, "1975", 290, 738, 40, WHITE, 6.5); write(c, "2014", 560, 535, 40, WHITE, 6.5); write(c, "2023", 800, 305, 40, WHITE, 6.5);
};

// ---------------------------------------------------------------- expl.8  Indian astronauts
const flagPatch = (c: Ctx, x: number, y: number, u: number) => { shape(c, () => rrect(c, x, y, 16 * u, 4 * u, 0), "#f39a3c", 2); shape(c, () => rrect(c, x, y + 4 * u, 16 * u, 4 * u, 0), WHITE, 2); shape(c, () => rrect(c, x, y + 8 * u, 16 * u, 4 * u, 0), "#3a9a4a", 2); };
const indians = (c: Ctx) => {
  ground(c, "#cfe0f2");
  shape(c, () => rrect(c, -20, 860, 1120, 260, 6), COL.steel, 6);
  shadow(c, 540, 930, 470, 30);
  astro(c, 170, 920, 4.4, "#bcd6f0", "#8fb3dc", false);
  flagPatch(c, 170 - 42 * 4.4, 920 - 70 * 4.4, 4);
  astro(c, 540, 920, 4.4, COL.orange, "#d27c25", false, false, true);
  flagPatch(c, 540 - 42 * 4.4, 920 - 70 * 4.4, 4);
  astro(c, 910, 920, 4.4, "#f4f1ea", "#cfc9bb", false);
  flagPatch(c, 910 - 42 * 4.4, 920 - 70 * 4.4, 4);
};

// ---------------------------------------------------------------- expl.9  Robot or person
const roverIcon = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x + 60 * s, y - 60 * s], [x + 60 * s, y - 130 * s]], 9); shape(c, () => rrect(c, x + 30 * s, y - 170 * s, 70 * s, 44 * s, 10), COL.steelIn, 6); shape(c, () => ell(c, x + 82 * s, y - 148 * s, 10 * s, 10 * s), "#26324f", 4);
  shape(c, () => rrect(c, x - 110 * s, y - 100 * s, 240 * s, 80 * s, 14 * s), COL.steel, 6);
  shape(c, () => polyP(c, [[x - 100 * s, y - 100 * s], [x - 20 * s, y - 100 * s], [x - 60 * s, y - 150 * s], [x - 140 * s, y - 150 * s]]), COL.blue, 6);
  for (const dx of [-90, -10, 80]) { shape(c, () => ell(c, x + dx * s, y - 4 * s, 38 * s, 38 * s), COL.black, 6); shape(c, () => ell(c, x + dx * s, y - 4 * s, 12 * s, 12 * s), COL.steelDk, 4); }
};
const choice = (c: Ctx) => {
  ground(c, SPACE);
  stars(c, 0, 0, D, 700, 36, 14);
  planet(c, 880, 160, 70, COL.blue, COL.blueDk);
  moonGround(c, 720);
  roverIcon(c, 250, 840, 1.15);
  astro(c, 800, 900, 5.8);
  // question mark
  const q = [[460, 300], [490, 240], [560, 230], [610, 275], [590, 340], [540, 385], [540, 440]];
  line(c, q, 40, INK); line(c, q, 22, COL.yellow); shape(c, () => ell(c, 540, 510, 24, 24), COL.yellow, 6);
};

// ---------------------------------------------------------------- flow.a1  Lime-sized Earth
const lime = (c: Ctx) => {
  ground(c);
  shadow(c, 500, 900, 300, 30);
  shape(c, () => ell(c, 440, 520, 336, 336), "#a9d6f2", 6);
  const l = () => ell(c, 440, 520, 310, 310);
  shape(c, l, COL.greenLt, 6); shade(c, l, COL.green, 90, 70, 0.6);
  for (const [x, y] of [[300, 380], [380, 640], [520, 330], [250, 560], [560, 600], [470, 470], [340, 480]]) shape(c, () => ell(c, x, y, 5, 5), COL.greenDk, 0);
  shape(c, () => ell(c, 440, 214, 20, 8), COL.greenDk, 4);
  shine(c, [[290, 360], [340, 300]], 14);
  // four sheets of paper held by a hand: a thin stack, to compare with the thin band of air
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 640, 180 + k * 14, 260, 14, 2), WHITE, 4);
  hand(c, 880, 208, Math.PI, 1, SKIN.adult, CLOTH.adult);
  arrow(c, [[740, 270], [705, 300], [690, 320]], RED, 10);
};

// ---------------------------------------------------------------- flow.a3  Pack for space
const slip = (c: Ctx, x: number, y: number, draw: () => void) => { shape(c, () => rrect(c, x - 80, y - 90, 160, 180, 8), WHITE, 6); draw(); };
const pack = (c: Ctx) => {
  ground(c);
  slip(c, 230, 220, () => shape(c, () => { c.moveTo(230, 160); c.quadraticCurveTo(170, 230, 180, 260); c.arc(230, 260, 50, Math.PI, 0, true); c.quadraticCurveTo(290, 230, 230, 160); c.closePath(); }, COL.water, 5));
  slip(c, 540, 220, () => { for (const [x, y] of [[510, 190], [570, 200], [535, 250], [585, 260], [500, 260]]) dot(c, x, y, 15); });
  slip(c, 850, 220, () => { shape(c, () => ell(c, 850, 240, 56, 30), COL.steel, 5); shape(c, () => ell(c, 850, 228, 44, 16), COL.orange, 4); });
  const box = (x: number, label: () => void) => {
    shadow(c, x + 20, 900, 230, 30);
    shape(c, () => polyP(c, [[x - 220, 560], [x + 220, 560], [x + 220, 880], [x - 220, 880]]), COL.brown, 6);
    shade(c, () => polyP(c, [[x - 220, 560], [x + 220, 560], [x + 220, 880], [x - 220, 880]]), "#8a5a3c", 40, 0);
    shape(c, () => polyP(c, [[x - 240, 520], [x + 240, 520], [x + 220, 565], [x - 220, 565]]), COL.woodDk, 6);
    label();
  };
  box(280, () => { rocket(c, 280, 850, 70, 230); });
  box(800, () => {
    for (const s of [-1, 1]) { const a0 = s < 0 ? 3.4 : 0.25; c.beginPath(); c.arc(800, 720, 70, a0, a0 + 2.5); c.strokeStyle = COL.green; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); const an = a0 + 2.5, px = 800 + Math.cos(an) * 70, py = 720 + Math.sin(an) * 70; shape(c, () => polyP(c, [[px + Math.cos(an + 1.57) * 26, py + Math.sin(an + 1.57) * 26], [px - Math.cos(an + 1.57) * 26, py - Math.sin(an + 1.57) * 26], [px + Math.cos(an) * 40, py + Math.sin(an) * 40]]), COL.green, 4); }
  });
  arrow(c, [[230, 340], [250, 440], [280, 500]], RED, 10);
  arrow(c, [[850, 340], [830, 440], [810, 500]], RED, 10);
};

// ---------------------------------------------------------------- flow.a4  String timeline
const chair = (c: Ctx, x: number, d: number) => {
  shape(c, () => rrect(c, x - 18, 330, 36, 290, 8), COL.wood, 6);
  shape(c, () => rrect(c, Math.min(x, x + d * 150) - 18, 600, 186, 36, 8), COL.wood, 6);
  line(c, [[x - 4, 636], [x - 4, 890]], 18); line(c, [[x - 4, 636], [x - 4, 890]], 8, COL.woodDk);
  line(c, [[x + d * 140, 636], [x + d * 140, 890]], 18); line(c, [[x + d * 140, 636], [x + d * 140, 890]], 8, COL.woodDk);
};
const stringLine = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 905, 500, 22);
  chair(c, 90, 1); chair(c, 990, -1);
  const P0 = [90, 345], P1 = [540, 485], P2 = [990, 345];
  const at = (t: number) => [(1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0], (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1]];
  const curve: number[][] = []; for (let i = 0; i <= 24; i++) curve.push(at(i / 24));
  line(c, curve, 7);
  const icons: ((x: number, y: number) => void)[] = [
    (x, y) => { rocket(c, x, y + 55, 34, 110); },
    (x, y) => satIcon(c, x, y, 0.62),
    (x, y) => marsIcon(c, x, y, 0.62),
    (x, y) => moonIcon(c, x, y, 0.6),
  ];
  const years = ["1963", "1975", "2014", "2023"];
  [0.2, 0.4, 0.6, 0.8].forEach((t, i) => {
    const [x, y] = at(t);
    shadow(c, x + 12, y + 250, 78, 12);
    shape(c, () => rrect(c, x - 90, y + 8, 180, 240, 8), WHITE, 6);
    shape(c, () => rrect(c, x - 10, y - 14, 20, 40, 5), COL.yellow, 5);
    icons[i](x, y + 100);
    write(c, years[i], x - 59, y + 180, 36, INK, 6);
  });
};

// ---------------------------------------------------------------- flow.c2  Moon home
const moonHome = (c: Ctx) => {
  ground(c, SPACE);
  stars(c, 0, 0, D, 560, 34, 21);
  planet(c, 910, 150, 62, COL.blue, COL.blueDk);
  moonGround(c, 700);
  const cx = 400, cy = 780, rx = 330, ry = 330;
  const dome = () => { c.moveTo(cx - rx, cy); c.bezierCurveTo(cx - rx, cy - ry * 1.35, cx + rx, cy - ry * 1.35, cx + rx, cy); c.closePath(); };
  shape(c, dome, "#e3f2fb", 0);
  c.save(); c.beginPath(); dome(); c.clip();
  const r = rnd(6); for (let i = 0; i < 28; i++) dot(c, cx - rx + 40 + r() * (2 * rx - 80), cy - 250 + r() * 220, 9);
  c.restore();
  shape(c, dome, "rgba(0,0,0,0)", 7);
  shine(c, [[cx - 230, cy - 160], [cx - 170, cy - 290]], 12);
  shape(c, () => rrect(c, cx - rx - 10, cy - 8, 2 * rx + 20, 36, 8), COL.steel, 6);
  person(c, 300, 780, 270, { adult: true }); person(c, 470, 780, 200, {});
  // airlock with two doors
  shape(c, () => rrect(c, cx + rx - 10, cy - 130, 260, 150, 14), COL.steelIn, 7);
  shape(c, () => rrect(c, cx + rx + 10, cy - 105, 80, 125, 8), COL.steelDk, 5);
  shape(c, () => rrect(c, cx + rx + 160, cy - 105, 70, 125, 8), COL.steelDk, 5);
  dot(c, cx + rx + 125, cy - 60, 11);
  arrow(c, [[980, 600], [900, 640], [850, 690]], RED, 10);
};

export const ic_skyExploringSpaceL3 = cards("sci.sky.exploring-space.L3 cards", [where, oxygen, fuel, mission, cutaway, timeline, indians, choice, lime, pack, stringLine, moonHome]);
