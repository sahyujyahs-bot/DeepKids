import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, plate, rnd, cards } from "./flatKit";

// sci.materials.using-materials.L3 · picture cards (flat style). Red arrows = movement or change.
type Pt = [number, number];
const CHOC = "#6b4226", CHOCDK = "#46291a", CLAY = "#c4693f", CLAYDK = "#9c4d2b", WOOL = "#e8526a", WOOLDK = "#b83a50";
const PAPER = "#fffaf0", COAT = "#ffd34d", COATDK = "#e0a92a", TOWEL = "#3fb1a8", WET = "#5f9fd3", ICE = "#d6efff", ICEDK = "#9fcbe8";

const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.waterDk) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.1, x + s * 0.9, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.9, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.1, x, y - s * 1.5); c.closePath(); }, col, 4);
const rain = (c: Ctx, pts: Pt[]) => pts.forEach(([x, y]) => line(c, [[x, y], [x - 10, y + 36]], 7, COL.waterDk));
const wave = (c: Ctx, x: number, y: number, len: number, col: string = COL.greyDk, w = 7) => { const p: Pt[] = []; for (let i = 0; i <= 24; i++) p.push([x + Math.sin(i * 0.9) * 14, y - (i / 24) * len]); line(c, p, w, col); };
const panel = (c: Ctx, i: number, col: string, draw: () => void) => {
  const x = 30 + i * 345; c.save(); c.beginPath(); rrect(c, x, 200, 330, 680, 30); c.clip(); c.fillStyle = col; c.fillRect(x, 200, 330, 680); draw(); c.restore();
  c.beginPath(); rrect(c, x, 200, 330, 680, 30); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
};
const lens = (c: Ctx, x: number, y: number, R: number, draw: () => void) => {
  c.save(); c.beginPath(); ell(c, x, y, R, R); c.fillStyle = PAPER; c.fill(); c.clip(); draw(); c.restore();
  c.beginPath(); ell(c, x, y, R, R); c.lineWidth = 10; c.strokeStyle = INK; c.stroke();
};
const grad = (c: Ctx, x1: number, y1: number, x2: number, y2: number, stops: [number, string][]) => { const g = c.createLinearGradient(x1, y1, x2, y2); stops.forEach(([t, k]) => g.addColorStop(t, k)); return g; };

// ---- objects
const spoon = (c: Ctx, x: number, y: number, len: number, rot: number, col: string, dk: string) => { // handle end at (x, y), pointing up when rot = 0
  c.save(); c.translate(x, y); c.rotate(rot);
  const hw = len * 0.035, h = () => polyP(c, [[-hw * 1.3, 0], [hw * 1.3, 0], [hw * 0.7, -len * 0.72], [-hw * 0.7, -len * 0.72]]);
  shape(c, h, col, 5); shade(c, h, dk, hw * 0.8, 0, 0.8);
  const b = () => ell(c, 0, -len * 0.86, len * 0.13, len * 0.17);
  shape(c, b, col, 5); shade(c, b, dk, len * 0.04, len * 0.04, 0.8);
  shape(c, () => ell(c, 0, -len * 0.86, len * 0.08, len * 0.11), dk, 0);
  c.restore();
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => { // steel tumbler, bottom centre
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.11);
  const b = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.4, y], [x - w * 0.4, y]]);
  shape(c, b, COL.steel, 6); shade(c, b, COL.steelDk, w * 0.2, 0, 0.8);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), COL.steelIn, 5);
  shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.25, y - h * 0.15]], 10);
};
const kadai = (c: Ctx, x: number, y: number, w: number, body: string, bodyDk: string, hcol: string, hdk: string, inside: string = COL.steelIn, hlen = 0.55) => { // rim centre (x, y)
  const d = w * 0.38, b = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w / 2 + 10, y + d * 1.25, x + w / 2 - 10, y + d * 1.25, x + w / 2, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + d * 0.95, w * 0.5, w * 0.06);
  c.save(); c.translate(x + w / 2 - 14, y + 4); c.rotate(-0.12);
  const hh = () => rrect(c, 0, -15, w * hlen, 30, 13); shape(c, hh, hcol, 6); shade(c, hh, hdk, 0, 8, 0.8); c.restore();
  shape(c, b, body, 6); shade(c, b, bodyDk, w * 0.12, -4, 0.85);
  shape(c, () => ell(c, x, y, w / 2, w * 0.085), inside, 6);
  shine(c, [[x - w * 0.36, y + d * 0.35], [x - w * 0.2, y + d * 0.75]], 9);
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => { // clay pot, bottom centre
  shadow(c, x + w * 0.1, y + 6, w * 0.45, w * 0.07);
  const b = () => { c.moveTo(x - w * 0.3, y - h); c.bezierCurveTo(x - w * 0.32, y - h * 0.8, x - w * 0.5, y - h * 0.7, x - w * 0.5, y - h * 0.38); c.bezierCurveTo(x - w * 0.5, y - h * 0.08, x - w * 0.25, y, x, y); c.bezierCurveTo(x + w * 0.25, y, x + w * 0.5, y - h * 0.08, x + w * 0.5, y - h * 0.38); c.bezierCurveTo(x + w * 0.5, y - h * 0.7, x + w * 0.32, y - h * 0.8, x + w * 0.3, y - h); c.closePath(); };
  shape(c, b, CLAY, 6); shade(c, b, CLAYDK, w * 0.14, 0, 0.75);
  shape(c, () => ell(c, x, y - h, w * 0.3, w * 0.065), CLAYDK, 6);
  line(c, [[x - w * 0.46, y - h * 0.55], [x + w * 0.46, y - h * 0.55]], 4, CLAYDK);
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string, alpha = 1) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.55, w * 0.1);
  const b = () => { c.moveTo(x - w / 2, y - h * 0.62); c.quadraticCurveTo(x - w / 2, y - h * 0.74, x - w * 0.17, y - h * 0.8); c.lineTo(x - w * 0.17, y - h * 0.92); c.lineTo(x + w * 0.17, y - h * 0.92); c.lineTo(x + w * 0.17, y - h * 0.8); c.quadraticCurveTo(x + w / 2, y - h * 0.74, x + w / 2, y - h * 0.62); c.lineTo(x + w / 2, y - 14); c.quadraticCurveTo(x + w / 2, y, x + w / 2 - 14, y); c.lineTo(x - w / 2 + 14, y); c.quadraticCurveTo(x - w / 2, y, x - w / 2, y - 14); c.closePath(); };
  c.globalAlpha = alpha; shape(c, b, col, 0); c.globalAlpha = 1; shape(c, () => { b(); }, "rgba(0,0,0,0)", 6); shade(c, b, dk, w * 0.18, 0, 0.5 * alpha);
  shape(c, () => rrect(c, x - w * 0.2, y - h, w * 0.4, h * 0.1, 6), dk, 5);
  shine(c, [[x - w * 0.32, y - h * 0.55], [x - w * 0.32, y - h * 0.15]], 8);
};
const umbrella = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, sag = 0, ribs = true) => { // top of canopy at (x, y)
  const cy = y + r * 0.55, tips: Pt[] = [];
  for (let i = 0; i <= 4; i++) tips.push([x + r - (i * r) / 2, cy + (i % 4 === 0 ? 0 : 0)]);
  line(c, [[x, cy - r * 0.2], [x, cy + r * 1.35]], 8); line(c, [[x, cy - r * 0.2], [x, cy + r * 1.35]], 4, COL.steel);
  c.beginPath(); c.arc(x - 26, cy + r * 1.35, 26, 0, Math.PI); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = RED; c.stroke();
  const cv = () => { c.moveTo(x - r, cy); c.bezierCurveTo(x - r, y - r * 0.2 + sag, x + r, y - r * 0.2 + sag, x + r, cy); for (let i = 0; i < 4; i++) c.quadraticCurveTo(x + r - i * (r / 2) - r / 4, cy - r * 0.3, x + r - (i + 1) * (r / 2), cy); c.closePath(); };
  shape(c, cv, col, 6); shade(c, cv, dk, r * 0.25, 0, 0.7);
  if (ribs) tips.slice(0, 5).forEach(([tx, ty]) => line(c, [[x, y + r * 0.02 + sag * 0.3], [tx, ty]], 4, INK));
};
const raincoat = (c: Ctx, x: number, y: number, s: number) => { // top of hood at (x, y)
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = () => polyP(c, [[-120, 130], [120, 130], [165, 520], [-165, 520]]);
  const sl = (k: number) => () => polyP(c, [[k * 118, 135], [k * 190, 150], [k * 250, 400], [k * 190, 415], [k * 135, 260]]);
  shape(c, sl(-1), COAT, 6); shape(c, sl(1), COAT, 6); shape(c, body, COAT, 6); shade(c, body, COATDK, 50, 0, 0.8);
  shape(c, () => ell(c, 0, 80, 90, 80), COAT, 6); shape(c, () => ell(c, 0, 100, 52, 50), "#6b5a8c", 5);
  line(c, [[0, 150], [0, 520]], 5);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 18, 230 + i * 100, 11, 11), COATDK, 4);
  c.restore();
};
const towel = (c: Ctx, x: number, y: number, w: number, h: number, wetFrac = 0) => { // flat folded towel, top-left (x, y)
  const t = () => rrect(c, x, y, w, h, 16);
  shape(c, t, TOWEL, 6); shade(c, t, "#2a8a83", 0, h * 0.5, 0.6);
  line(c, [[x + w * 0.12, y + 8], [x + w * 0.12, y + h - 8]], 5, WHITE); line(c, [[x + w * 0.88, y + 8], [x + w * 0.88, y + h - 8]], 5, WHITE);
  if (wetFrac > 0) { c.save(); c.beginPath(); t(); c.clip(); c.fillStyle = "rgba(63,111,179,0.7)"; c.fillRect(x, y, w * wetFrac, h); c.restore(); shape(c, t, "rgba(0,0,0,0)", 6); }
};
const ice = (c: Ctx, x: number, y: number, s: number) => { // ice cube, bottom centre
  shape(c, () => polyP(c, [[x - s, y - s * 1.6], [x + s * 0.5, y - s * 1.6], [x + s * 1.1, y - s * 1.1], [x - s * 0.4, y - s * 1.1]]), "#eef8ff", 5);
  shape(c, () => rrect(c, x - s, y - s * 1.1, s * 1.5, s * 1.1, 8), ICE, 5);
  shape(c, () => polyP(c, [[x + s * 0.5, y - s * 1.6], [x + s * 1.1, y - s * 1.1], [x + s * 1.1, y - s * 0.1], [x + s * 0.5, y]]), ICEDK, 5);
  shine(c, [[x - s * 0.8, y - s * 0.9], [x - s * 0.8, y - s * 0.3]], 7);
};
const shirt = (c: Ctx, x: number, y: number, s: number, col: string, dk: string) => { // hangs from the line at (x, y)
  const sh = () => polyP(c, [[x - 50 * s, y], [x - 20 * s, y + 14 * s], [x + 20 * s, y + 14 * s], [x + 50 * s, y], [x + 100 * s, y + 50 * s], [x + 75 * s, y + 85 * s], [x + 50 * s, y + 65 * s], [x + 50 * s, y + 200 * s], [x - 50 * s, y + 200 * s], [x - 50 * s, y + 65 * s], [x - 75 * s, y + 85 * s], [x - 100 * s, y + 50 * s]]);
  shape(c, sh, col, 6); shade(c, sh, dk, 18 * s, 0, 0.8);
};
const clock = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), PAPER, 6); line(c, [[x, y], [x, y - r * 0.65]], 6); line(c, [[x, y], [x + r * 0.45, y + r * 0.2]], 6); };
const thermo = (c: Ctx, x: number, y: number, h: number, lvl: number) => {
  shape(c, () => rrect(c, x - 22, y - h, 44, h - 30, 22), PAPER, 6);
  const top = y - 40 - (h - 90) * lvl; shape(c, () => rrect(c, x - 9, top, 18, y - 40 - top, 9), RED, 0);
  shape(c, () => ell(c, x, y - 28, 38, 38), RED, 6); shine(c, [[x - 14, y - 40], [x - 12, y - 16]], 6);
};
const sparkle = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => shape(c, () => polyP(c, [[x, y - r], [x + r * 0.28, y - r * 0.28], [x + r, y], [x + r * 0.28, y + r * 0.28], [x, y + r], [x - r * 0.28, y + r * 0.28], [x - r, y], [x - r * 0.28, y - r * 0.28]]), col, 4);
const atoms = (c: Ctx, x: number, y: number, R: number, r: number, free: boolean) => {
  const rowsN = 5, g = rnd(4);
  for (let j = 0; j < rowsN; j++) for (let i = 0; i < 6; i++) { const px = x - R * 0.7 + i * ((R * 1.4) / 5) + (j % 2) * 14, py = y - R * 0.62 + j * ((R * 1.24) / 4); shape(c, () => ell(c, px, py, r, r), COL.steel, 4); shine(c, [[px - r * 0.4, py - r * 0.2], [px - r * 0.2, py - r * 0.45]], 4); }
  if (free) for (let k = 0; k < 9; k++) { const px = x - R * 0.7 + g() * R * 1.4, py = y - R * 0.55 + g() * R * 1.1; shape(c, () => ell(c, px, py, 7, 7), COL.yellow, 3); line(c, [[px + 9, py + 9], [px + 26, py + 14]], 3, RED); }
};

// ---- 0 intro: three silly choices
const choc = (c: Ctx) => {
  shape(c, () => rrect(c, 20, 700, 290, 110, 14), COL.greyDk, 6);
  for (let i = 0; i < 4; i++) shape(c, () => { c.moveTo(70 + i * 62, 700); c.quadraticCurveTo(95 + i * 62, 640 - (i % 2) * 20, 120 + i * 62, 700); c.closePath(); }, COL.orange, 5);
  shape(c, () => ell(c, 170, 705, 120, 24), CHOCDK, 0);
  kadai(c, 160, 480, 240, CHOC, CHOCDK, CHOCDK, "#2a170d", "#8a5a3c", 0.5);
  [[100, 540, 70], [170, 560, 110], [230, 535, 60]].forEach(([dx, dy, l]) => shape(c, () => { c.moveTo(dx - 11, dy); c.lineTo(dx - 11, dy + l); c.arc(dx, dy + l, 11, Math.PI, 0, true); c.lineTo(dx + 11, dy); c.closePath(); }, CHOC, 4));
};
const intro = (c: Ctx) => {
  ground(c);
  panel(c, 0, "#fde3c4", () => choc(c));
  panel(c, 1, COL.sky, () => {
    c.save(); c.translate(345, 0); rain(c, [[40, 240], [90, 300], [150, 250], [240, 300], [290, 240], [60, 380], [260, 420]]);
    umbrella(c, 195, 430, 135, "#f4e9cf", "#cdbf9c", 40, false);
    shape(c, () => ell(c, 130, 540, 14, 20), COL.waterDk, 3); [[110, 600], [200, 620], [260, 590]].forEach(([dx, dy]) => drop(c, dx, dy, 11));
    c.restore();
  });
  panel(c, 2, "#d9f0cf", () => {
    c.save(); c.translate(690, 0);
    const sole = () => { c.moveTo(60, 380); c.bezierCurveTo(60, 300, 130, 280, 175, 330); c.bezierCurveTo(250, 400, 290, 500, 270, 620); c.bezierCurveTo(250, 800, 120, 820, 90, 700); c.bezierCurveTo(60, 600, 60, 480, 60, 380); c.closePath(); };
    shadow(c, 190, 800, 140, 26); shape(c, sole, COL.glass, 7); shade(c, sole, "#9ec3de", 30, 0, 0.35);
    shape(c, () => polyP(c, [[110, 460], [230, 430], [250, 520], [130, 560]]), "rgba(214,236,250,0.9)", 6);
    line(c, [[150, 340], [170, 450], [140, 520], [190, 600], [150, 690], [185, 770]], 7, INK); line(c, [[170, 450], [235, 480]], 6, INK); line(c, [[190, 600], [250, 640]], 6, INK);
    shine(c, [[85, 420], [85, 560]], 8); c.restore();
  });
};
// ---- 1 summary: kitchen shelf
const summary = (c: Ctx) => {
  ground(c, "#f7ead2");
  shape(c, () => rrect(c, 30, 770, 1020, 46, 10), COL.wood, 6);
  line(c, [[500, 90], [800, 90]], 10); shape(c, () => ell(c, 650, 100, 12, 12), COL.steelDk, 4);
  raincoat(c, 650, 90, 0.78);
  kadai(c, 200, 640, 300, COL.steel, COL.steelDk, COL.wood, COL.woodDk);
  pot(c, 650, 770, 190, 190);
  const tp = () => { c.moveTo(830, 770); c.bezierCurveTo(800, 640, 900, 580, 980, 640); c.bezierCurveTo(1000, 690, 1000, 740, 990, 770); c.closePath(); };
  shadow(c, 905, 775, 110, 14); shape(c, () => polyP(c, [[828, 690], [790, 640], [810, 630], [850, 670]]), COL.cloth, 6);
  shape(c, tp, COL.cloth, 6); shape(c, () => ell(c, 905, 600, 36, 12), COL.cloth, 6);
  const cosy = () => { c.moveTo(816, 770); c.bezierCurveTo(780, 600, 1000, 560, 1004, 770); c.closePath(); };
  shape(c, cosy, WOOL, 6); shade(c, cosy, WOOLDK, 40, 0, 0.8);
  for (let i = 0; i < 5; i++) line(c, [[850 + i * 34, 690], [866 + i * 34, 740]], 5, WOOLDK);
  shape(c, () => ell(c, 905, 600, 20, 20), WOOLDK, 5);
};
// ---- 2 e2 sweater and ice
const sock = (c: Ctx, x: number, y: number) => { // woollen sock lump around an ice cube
  const b = () => { c.moveTo(x - 110, y); c.bezierCurveTo(x - 140, y - 140, x - 90, y - 230, x - 70, y - 270); c.lineTo(x + 70, y - 270); c.bezierCurveTo(x + 90, y - 230, x + 140, y - 140, x + 110, y); c.closePath(); };
  shape(c, b, WOOL, 6); shade(c, b, WOOLDK, 36, 0, 0.8);
  for (let i = 0; i < 5; i++) line(c, [[x - 80 + i * 40, y - 220], [x - 70 + i * 40, y - 20]], 4, WOOLDK);
  shape(c, () => rrect(c, x - 76, y - 290, 152, 40, 12), "#f5a0ae", 6);
};
const e2 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x) => plate(c, x, 780, 150, 46));
  shape(c, () => ell(c, 190, 786, 130, 34), COL.water, 4); ice(c, 190, 770, 70);
  shape(c, () => ell(c, 890, 786, 112, 30), COL.water, 4);
  shape(c, () => ell(c, 540, 790, 42, 12), COL.water, 4); ice(c, 540, 520, 38); sock(c, 540, 780);
  const fo = () => polyP(c, [[800, 780], [790, 640], [830, 600], [880, 660], [930, 590], [975, 650], [985, 780]]);
  shape(c, fo, "#dfe5ec", 6); shade(c, fo, COL.steelDk, 40, 0, 0.5); line(c, [[830, 600], [850, 740]], 3, COL.steelDk); line(c, [[930, 590], [920, 740]], 3, COL.steelDk);
  ice(c, 890, 640, 30);
  clock(c, 540, 150, 60);
};
// ---- 3 e3 matka mystery
const e3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d3b0"; c.fillRect(0, 780, 1080, 300);
  pot(c, 150, 780, 230, 260);
  bottle(c, 390, 780, 150, 330, "rgba(143,195,234,0.85)", COL.waterDk);
  shape(c, () => rrect(c, 345, 540, 90, 12, 4), COL.waterDk, 0);
  const sb = (x: number) => { bottle(c, x, 780, 150, 330, COL.steel, COL.steelDk); };
  sb(630);
  sb(870);
  const wc = () => polyP(c, [[780, 780], [960, 780], [950, 600], [790, 600]]);
  shape(c, wc, "rgba(63,177,168,0.9)", 6); for (let i = 0; i < 5; i++) drop(c, 810 + i * 35, 650 + (i % 2) * 70, 9, WET);
  thermo(c, 1010, 760, 420, 0.35);
  clock(c, 540, 170, 70);
  drop(c, 100, 590, 12, WET); drop(c, 215, 640, 12, WET);
};
// ---- 4 a1 home hunt
const a1 = (c: Ctx) => {
  ground(c);
  const sheet = () => rrect(c, 90, 110, 380, 300, 12);
  shadow(c, 290, 430, 200, 20); shape(c, sheet, PAPER, 6);
  line(c, [[216, 120], [216, 400]], 4); line(c, [[344, 120], [344, 400]], 4);
  for (let i = 0; i < 3; i++) line(c, [[100, 200 + i * 70], [460, 200 + i * 70]], 3);
  shape(c, () => ell(c, 152, 160, 22, 22), COL.steel, 4); shape(c, () => rrect(c, 240, 140, 70, 40, 8), COL.wood, 4);
  person(c, 260, 960, 540, { armR: [-0.9, -1.3], armL: [1.2, 0.9] });
  line(c, [[420, 560], [450, 540]], 12); line(c, [[420, 560], [450, 540]], 5, COL.yellow);
  c.fillStyle = "#e6d3b0"; c.fillRect(540, 760, 540, 20); line(c, [[540, 760], [1080, 760]], 6);
  shape(c, () => rrect(c, 580, 780, 440, 20, 6), COL.woodDk, 5);
  tumbler(c, 690, 760, 130, 220);
  const bk = () => polyP(c, [[820, 540], [1020, 540], [990, 760], [850, 760]]);
  shape(c, bk, RED, 6); shade(c, bk, "#a4231a", 50, 0, 0.7); shape(c, () => ell(c, 920, 540, 100, 22), "#a4231a", 6);
  c.beginPath(); c.arc(920, 540, 100, Math.PI * 1.1, Math.PI * 1.9); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
  shape(c, () => rrect(c, 580, 780, 440, 20, 6), COL.woodDk, 5);
};
// ---- 5 a2 spoon and plate parade
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 520, 480, 20);
  spoon(c, 150, 520, 400, 0, COL.steel, COL.steelDk);
  spoon(c, 390, 520, 400, 0, COL.wood, COL.woodDk);
  spoon(c, 630, 520, 400, 0, COL.blue, COL.blueDk);
  spoon(c, 880, 520, 400, 0, "#8a5a3c", "#5e3a24");
  plate(c, 140, 780, 110, 60);
  [["#58a14a", "#3b7a33"], [WHITE, "#e0d8c8"], [CLAY, CLAYDK]].forEach(([a, b], i) => {
    const x = 400 + i * 250;
    shadow(c, x + 10, 800, 130, 60);
    if (i === 0) { shape(c, () => ell(c, x, 780, 140, 70, -0.1), a, 6); line(c, [[x - 130, 786], [x + 130, 770]], 4, b); for (let k = -3; k <= 3; k++) if (k) line(c, [[x + k * 30, 776], [x + k * 38, 735 + Math.abs(k) * 4]], 3, b); }
    else if (i === 1) { shape(c, () => ell(c, x, 780, 130, 64), a, 6); shape(c, () => ell(c, x, 780, 90, 40), b, 0); }
    else { shape(c, () => ell(c, x, 780, 130, 64), a, 6); shape(c, () => ell(c, x, 782, 92, 40), b, 0); }
  });
};
// ---- 6 a3 take it apart
const a3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d3b0"; c.fillRect(0, 860, 1080, 220); line(c, [[0, 860], [1080, 860]], 6);
  const cloth = () => polyP(c, [[60, 760], [140, 400], [330, 330], [470, 400], [330, 600], [380, 780]]);
  shadow(c, 260, 830, 230, 30); shape(c, cloth, "#5b8fd6", 6); shade(c, cloth, "#3f6fb3", 40, 0, 0.8);
  line(c, [[140, 400], [200, 600]], 4, "#3f6fb3"); line(c, [[330, 330], [300, 640]], 4, "#3f6fb3");
  for (let i = 0; i < 7; i++) { const a = -Math.PI * 0.95 + (i * Math.PI * 0.95) / 6; line(c, [[740, 560], [640 + Math.cos(a) * 170, 560 + Math.sin(a) * 170 + 100]], 12); line(c, [[740, 560], [640 + Math.cos(a) * 170, 560 + Math.sin(a) * 170 + 100]], 6, COL.steel); }
  shape(c, () => ell(c, 640, 560, 24, 24), COL.steelDk, 5);
  c.beginPath(); c.arc(920, 700, 70, Math.PI * 0.5, Math.PI * 2, false); c.lineWidth = 46; c.strokeStyle = INK; c.stroke(); c.lineWidth = 32; c.strokeStyle = RED; c.stroke();
  shape(c, () => rrect(c, 892, 420, 56, 300, 18), RED, 6);
  shadow(c, 600, 850, 200, 14);
  shape(c, () => rrect(c, 480, 800, 190, 40, 14), COL.yellow, 6); shape(c, () => rrect(c, 670, 812, 180, 16, 8), COL.steel, 5);
};
// ---- 7 a5 material orchestra
const arcs = (c: Ctx, x: number, y: number, n: number, r: number) => { for (let i = 1; i <= n; i++) { c.beginPath(); c.arc(x, y, r + i * 34, -0.9, 0.9); c.lineWidth = 8; c.strokeStyle = RED; c.lineCap = "round"; c.stroke(); c.beginPath(); c.arc(x, y, r + i * 34, Math.PI - 0.9, Math.PI + 0.9); c.stroke(); } };
const a5 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d3b0"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  // brass bell
  arcs(c, 190, 560, 3, 130);
  shadow(c, 190, 815, 140, 22);
  const bell = () => { c.moveTo(70, 780); c.bezierCurveTo(80, 700, 80, 600, 110, 520); c.bezierCurveTo(140, 450, 240, 450, 270, 520); c.bezierCurveTo(300, 600, 300, 700, 310, 780); c.closePath(); };
  shape(c, bell, COL.yellow, 6); shade(c, bell, COL.orange, 50, 0, 0.7); shape(c, () => ell(c, 190, 782, 120, 26), COL.orange, 6); shape(c, () => ell(c, 190, 800, 26, 26), COL.brown, 5);
  shape(c, () => rrect(c, 172, 445, 36, 40, 10), COL.orange, 5); shine(c, [[120, 580], [115, 700]], 10);
  // wooden block
  arcs(c, 540, 680, 1, 70);
  shadow(c, 540, 820, 140, 18);
  shape(c, () => rrect(c, 430, 620, 220, 180, 14), COL.wood, 6); shade(c, () => rrect(c, 430, 620, 220, 180, 14), COL.woodDk, 40, 0, 0.7);
  line(c, [[460, 680], [620, 680]], 4, COL.woodDk); line(c, [[460, 730], [620, 730]], 4, COL.woodDk);
  // folded cloth
  shadow(c, 880, 820, 140, 18);
  [0, 1, 2].forEach((i) => shape(c, () => rrect(c, 770, 700 + i * 34 - (i === 2 ? 0 : 0), 220 - (i % 2) * 14, 46, 18), i % 2 ? "#f29ab4" : "#f7b9cc", 6));
  // a stick hitting the bell
  c.save(); c.translate(430, 380); c.rotate(0.6); shape(c, () => rrect(c, -10, -230, 30, 280, 12), COL.wood, 6); c.restore();
  arrow(c, [[560, 400], [440, 470]], RED, 9);
};
// ---- 8 a6 be the atoms
const a6 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d3b0"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  [110, 350, 590, 830].forEach((x) => person(c, x, 940, 470, { armL: [-0.15, -0.05], armR: [0.0, -0.05] }));
  c.beginPath(); ell(c, 175, 330, 110, 110); c.fillStyle = "rgba(215,55,43,0.25)"; c.fill();
  shape(c, () => ell(c, 175, 330, 62, 62), RED, 6); shine(c, [[145, 305], [160, 285]], 8);
  arrow(c, [[280, 330], [920, 330]], RED, 10);
  arrow(c, [[480, 200], [820, 200]], RED, 8);
};
// ---- 9 p1 clay pot cooler
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 925, 380, 30);
  const outer = () => { c.moveTo(190, 330); c.bezierCurveTo(190, 900, 890, 900, 890, 330); c.closePath(); };
  shape(c, outer, CLAY, 7); shade(c, outer, CLAYDK, 40, 0, 0.5);
  const sand = () => { c.moveTo(225, 330); c.bezierCurveTo(230, 860, 850, 860, 855, 330); c.closePath(); };
  shape(c, sand, "#c9a46b", 0);
  const inner = () => { c.moveTo(390, 270); c.bezierCurveTo(385, 700, 695, 700, 690, 270); c.closePath(); };
  shape(c, inner, PAPER, 0);
  const g = rnd(5); for (let i = 0; i < 14; i++) drop(c, 245 + g() * 130, 400 + g() * 290, 9, WET);
  for (let i = 0; i < 14; i++) drop(c, 705 + g() * 130, 400 + g() * 290, 9, WET);
  shape(c, inner, "rgba(0,0,0,0)", 7); shape(c, sand, "rgba(0,0,0,0)", 5);
  shape(c, () => ell(c, 540, 270, 150, 24), CLAYDK, 6);
  // coriander
  shape(c, () => ell(c, 540, 600, 130, 50), COL.soil, 0);
  [[470, 20], [540, 0], [610, -20]].forEach(([dx]) => { line(c, [[dx + 0, 600], [dx - 10, 440]], 8, COL.leaf); });
  [[460, 440], [520, 400], [590, 420], [620, 460], [500, 480]].forEach(([x, y], i) => shape(c, () => ell(c, x, y, 40, 30, i), COL.leaf, 5));
  [[540, 250]].forEach(() => 0);
  // sand to outer wall rim, cool air rising from the outer pot
  shape(c, () => ell(c, 540, 330, 350, 30), "rgba(0,0,0,0)", 0);
  [[130, 640], [950, 640]].forEach(([x, y]) => { wave(c, x, y, 200, COL.waterDk); arrow(c, [[x, y - 215], [x, y - 270]], RED, 8); });
  line(c, [[190, 330], [390, 330]], 7); line(c, [[690, 330], [890, 330]], 7);
};
// ---- 10 c1 cosy
const c1 = (c: Ctx) => {
  ground(c);
  const cx = 480; tumbler(c, cx, 880, 300, 440);
  const cos = () => { c.moveTo(cx - 160, 840); c.lineTo(cx - 150, 560); c.lineTo(cx + 150, 560); c.lineTo(cx + 160, 840); c.closePath(); };
  shape(c, cos, WOOL, 7); shade(c, cos, WOOLDK, 60, 0, 0.8);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { const x = cx - 120 + k * 48, y = 590 + r * 62; line(c, [[x - 14, y], [x, y + 28], [x + 14, y]], 5, WOOLDK); }
  shape(c, () => ell(c, cx, 440, 150, 24), "#8a5a3c", 6);
  [-70, 0, 70].forEach((dx, i) => wave(c, cx + dx, 410 - i * 10, 170 + (i % 2) * 40, COL.greyDk, 8));
  thermo(c, 880, 880, 600, 0.75);
  clock(c, 880, 190, 70);
};
// ---- 11 c2 post the egg
const egg = (c: Ctx, x: number, y: number, s: number) => { const e = () => { c.moveTo(x, y - s * 1.3); c.bezierCurveTo(x + s * 1.1, y - s * 1.3, x + s * 1.1, y + s, x, y + s); c.bezierCurveTo(x - s * 1.1, y + s, x - s * 1.1, y - s * 1.3, x, y - s * 1.3); c.closePath(); }; shape(c, e, "#f3e7d0", 6); shade(c, e, "#d9c9a8", s * 0.3, 0, 0.7); shine(c, [[x - s * 0.5, y - s * 0.5], [x - s * 0.3, y - s * 0.9]], 8); };
const c2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d3b0"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  shape(c, () => rrect(c, 40, 540, 360, 44, 8), COL.wood, 6);
  shape(c, () => rrect(c, 80, 584, 46, 316, 6), COL.woodDk, 6); shape(c, () => rrect(c, 310, 584, 46, 316, 6), COL.woodDk, 6);
  egg(c, 230, 500, 38);
  arrow(c, [[300, 430], [440, 380], [560, 520], [650, 700]], RED, 10);
  shadow(c, 800, 905, 240, 24);
  const bx = () => polyP(c, [[580, 720], [1020, 720], [1000, 900], [600, 900]]);
  shape(c, bx, "#c89a63", 6); shade(c, bx, "#a67a45", 60, 0, 0.6);
  shape(c, () => polyP(c, [[580, 720], [640, 660], [960, 660], [1020, 720]]), "#d8ae77", 6);
  shape(c, () => { c.moveTo(620, 700); c.quadraticCurveTo(640, 640, 700, 650); c.quadraticCurveTo(760, 600, 800, 640); c.quadraticCurveTo(870, 600, 920, 650); c.quadraticCurveTo(980, 640, 990, 700); c.closePath(); }, "#f6d98a", 6);
  [[650, 680], [700, 665], [900, 670], [950, 685]].forEach(([x, y]) => line(c, [[x - 18, y + 6], [x, y - 8], [x + 18, y + 6]], 4, "#d9b25a"));
  egg(c, 800, 700, 46);
  shape(c, () => polyP(c, [[580, 720], [1020, 720], [1000, 770], [600, 770]]), "rgba(0,0,0,0)", 0);
};
// ---- 12 t0 material
const veshti = (c: Ctx, x: number, y: number) => {
  const v = () => polyP(c, [[x - 190, y], [x + 190, y], [x + 200, y + 360], [x - 200, y + 360]]);
  shadow(c, x + 10, y + 380, 210, 20); shape(c, v, WHITE, 6); shade(c, v, "#e4dccb", 70, 0, 0.8);
  shape(c, () => rrect(c, x - 200, y + 300, 400, 60, 4), COL.yellow, 6); line(c, [[x - 200, y + 320], [x + 200, y + 320]], 4, RED);
  for (let i = 0; i < 4; i++) line(c, [[x - 150 + i * 100, y + 20], [x - 140 + i * 100, y + 290]], 3, "#cfc6b0");
};
const t0 = (c: Ctx) => { ground(c); tumbler(c, 270, 880, 260, 440); veshti(c, 780, 520); };
// ---- 13 t1 object: pencil cut open
const t1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 700, 440, 24);
  shape(c, () => polyP(c, [[110, 540], [260, 450], [260, 630]]), COL.wood, 6); shape(c, () => polyP(c, [[110, 540], [152, 517], [152, 563]]), "#4a4553", 5);
  shape(c, () => rrect(c, 260, 450, 540, 90, 4), COL.yellow, 6); shade(c, () => rrect(c, 260, 450, 540, 90, 4), COL.orange, 0, 40, 0.5);
  shape(c, () => rrect(c, 260, 540, 540, 90, 4), COL.wood, 6);
  shape(c, () => rrect(c, 260, 522, 540, 36, 4), "#4a4553", 5);
  shape(c, () => rrect(c, 800, 450, 70, 180, 4), COL.steel, 6); line(c, [[820, 455], [820, 625]], 3, COL.steelDk); line(c, [[850, 455], [850, 625]], 3, COL.steelDk);
  shape(c, () => rrect(c, 870, 450, 120, 180, 24), COL.pink, 6);
  [[300, 340, 270, 500], [560, 330, 560, 470], [830, 400, 830, 560]].forEach(([x1, y1, x2, y2], i) => arrow(c, [[x1, y1], [x2, y2]], RED, 8));
};
// ---- 14 t2 property: three small pictures
const t2 = (c: Ctx) => {
  ground(c);
  panel(c, 0, "#cfe9fa", () => {
    shape(c, () => rrect(c, 85, 330, 200, 330, 12), COL.glass, 7); shine(c, [[110, 370], [110, 500]], 9); shine(c, [[140, 360], [140, 400]], 9);
    c.save(); c.globalAlpha = 0.6; polyP(c, [[285, 360], [420, 300], [420, 700], [285, 640]]); c.restore();
    [[0, -40], [0, 0], [0, 40]].forEach(([_, dy]) => line(c, [[0, 500 + dy * 3], [85, 500 + dy * 2]], 8, COL.yellow));
    [-1, 0, 1].forEach((k) => line(c, [[290, 500 + k * 90], [330, 500 + k * 100]], 8, COL.yellow));
    sparkle(c, 40, 500, 30);
  });
  panel(c, 1, "#fde3c4", () => {
    c.save(); c.translate(345, 0);
    shape(c, () => rrect(c, 60, 400, 22, 220, 8), COL.wood, 5); shape(c, () => rrect(c, 250, 400, 22, 220, 8), COL.wood, 5);
    c.beginPath(); ell(c, 166, 450, 108, 40); c.lineWidth = 16; c.strokeStyle = INK; c.stroke(); c.lineWidth = 8; c.strokeStyle = RED; c.stroke();
    arrow(c, [[200, 750], [280, 750]], RED, 9); arrow(c, [[130, 750], [50, 750]], RED, 9);
    c.restore();
  });
  panel(c, 2, "#e8f1f2", () => {
    c.save(); c.translate(690, 0);
    shape(c, () => ell(c, 165, 660, 140, 50), COL.water, 5);
    towel(c, 170, 500, 150, 110, 0);
    shape(c, () => ell(c, 130, 640, 70, 24), "#3f6fb3", 0); drop(c, 110, 430, 14); arrow(c, [[120, 560], [190, 620]], RED, 8);
    c.restore();
  });
};
// ---- 15 t4 conductor: steel spoon in coffee, heat creeping up
const t4 = (c: Ctx) => {
  ground(c);
  glass(c, 440, 880, 360, 480, 0.85, "#8a5a3c");
  c.save(); c.translate(500, 880 - 40); c.rotate(0.28);
  const L = 760, hw = 22;
  const hnd = () => polyP(c, [[-hw, -40], [hw, -40], [hw * 0.55, -L * 0.74], [-hw * 0.55, -L * 0.74]]);
  c.beginPath(); hnd(); c.fillStyle = grad(c, 0, -40, 0, -L * 0.74, [[0, "#d7372b"], [0.45, "#f39a3c"], [0.75, COL.steel], [1, COL.steel]]); c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  shape(c, () => ell(c, 0, -20, 40, 56), "#d7372b", 6);
  c.restore();
  arrow(c, [[640, 640], [690, 460]], RED, 9); arrow(c, [[760, 560], [800, 380]], RED, 9);
  [[860, 250], [150, 290]].forEach(([x, y], i) => wave(c, x, y, 120, "#d7372b", 6));
  thermo(c, 160, 880, 520, 0.6);
};
// ---- 16 t5 insulator: wooden spoon in a hot pot, cool handle end
const t5 = (c: Ctx) => {
  ground(c);
  const x = 470; shadow(c, x + 40, 880, 330, 30);
  const b = () => polyP(c, [[x - 270, 520], [x + 270, 520], [x + 240, 870], [x - 240, 870]]);
  shape(c, b, COL.steel, 7); shade(c, b, COL.steelDk, 80, 0, 0.7);
  shape(c, () => ell(c, x, 520, 270, 52), "#e8872c", 7);
  c.save(); c.translate(x + 60, 560); c.rotate(0.3);
  const hnd = () => polyP(c, [[-24, 0], [24, 0], [14, -480], [-14, -480]]);
  c.beginPath(); hnd(); c.fillStyle = grad(c, 0, 0, 0, -480, [[0, COL.wood], [0.35, COL.wood], [0.7, "#8fc3ea"], [1, "#5b8fd6"]]); c.fill(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 0, 0, 60, 40), COL.woodDk, 6); c.restore();
  [x - 120, x + 10].forEach((px, i) => wave(c, px, 470 - i * 20, 150, COL.greyDk, 8));
  [[800, 120], [900, 200]].forEach(([sx, sy]) => sparkle(c, sx, sy, 40, "#8fc3ea"));
};
// ---- 17 t6 waterproof
const t6 = (c: Ctx) => {
  ground(c, COL.sky);
  raincoat(c, 540, 300, 1.15);
  rain(c, [[120, 120], [220, 220], [320, 110], [420, 190], [660, 140], [760, 230], [880, 120], [960, 210], [510, 100]]);
  [[360, 330], [740, 330], [440, 285], [640, 285]].forEach(([x, y]) => { line(c, [[x - 30, y], [x - 50, y - 24]], 7, COL.waterDk); line(c, [[x + 30, y], [x + 50, y - 24]], 7, COL.waterDk); drop(c, x, y - 10, 8); });
  rain(c, [[360, 235], [740, 235], [440, 190], [640, 190]]);
};
// ---- 18 t7 absorbent
const t7 = (c: Ctx) => {
  ground(c, "#e9e2d0");
  c.fillStyle = "#e6d3b0"; c.fillRect(0, 0, 1080, 1080);
  const pud = () => ell(c, 400, 640, 330, 150); shape(c, pud, COL.water, 6);
  shine(c, [[200, 600], [320, 570]], 9);
  c.save(); c.translate(660, 540); c.rotate(-0.12);
  c.save(); c.translate(-660, -540);
  shape(c, () => rrect(c, 560, 470, 400, 260, 20), TOWEL, 6);
  c.save(); c.beginPath(); rrect(c, 560, 470, 400, 260, 20); c.clip(); c.fillStyle = "rgba(63,111,179,0.78)"; c.beginPath(); c.moveTo(560, 470); c.lineTo(760, 470); c.bezierCurveTo(800, 560, 740, 660, 790, 730); c.lineTo(560, 730); c.closePath(); c.fill(); c.restore();
  shape(c, () => rrect(c, 560, 470, 400, 260, 20), "rgba(0,0,0,0)", 6);
  line(c, [[900, 480], [900, 720]], 5, WHITE);
  c.restore(); c.restore();
  arrow(c, [[480, 640], [590, 620]], RED, 10); arrow(c, [[480, 720], [590, 700]], RED, 9);
  drop(c, 200, 820, 14);
};
// ---- 19 t11 brittle: bangle falls and breaks
const bangle = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.beginPath(); ell(c, x, y, rx, ry); c.lineWidth = 36; c.strokeStyle = INK; c.stroke(); c.lineWidth = 24; c.strokeStyle = "#e07bb0"; c.stroke();
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, Math.PI * 1.1, Math.PI * 1.45); c.lineWidth = 7; c.strokeStyle = WHITE; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1;
};
const t19 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#cfc7b8"; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 6);
  [150, 400, 650, 900].forEach((x) => line(c, [[x, 760], [x - 40, 1080]], 3, COL.grey));
  bangle(c, 270, 440, 130, 130);
  arrow(c, [[270, 570], [270, 710]], RED, 10);
  [[560, 840, 0.4], [650, 890, 1.6], [740, 820, -0.5], [830, 880, 1.0], [700, 960, 2.4], [880, 960, 0.2], [610, 970, 1.2]].forEach(([x, y, r]) => {
    c.save(); c.translate(x, y); c.rotate(r); shape(c, () => polyP(c, [[-50, -14], [50, -10], [44, 14], [-46, 16]]), "#e07bb0", 6); line(c, [[-30, -4], [20, -4]], 5, WHITE); c.restore();
  });
  [[600, 790, 570, 740], [720, 780, 730, 720], [820, 800, 870, 750]].forEach(([x1, y1, x2, y2]) => line(c, [[x1, y1], [x2, y2]], 7, RED));
  sparkle(c, 760, 600, 40, COL.yellow);
};
// ---- 20 t13 porous
const t13 = (c: Ctx) => {
  ground(c);
  pot(c, 270, 900, 340, 400);
  [[200, 640], [260, 700], [330, 620], [310, 780], [220, 790], [180, 720]].forEach(([x, y]) => drop(c, x, y, 10, COL.drop));
  lens(c, 740, 430, 290, () => {
    c.fillStyle = CLAY; c.fillRect(440, 140, 600, 600);
    const g = rnd(8);
    for (let i = 0; i < 6; i++) { const y = 230 + i * 85, pts: Pt[] = []; for (let k = 0; k <= 14; k++) pts.push([430 + k * 46, y + Math.sin(k * 0.8 + i) * 22 + (k - 7) * 5]); line(c, pts, 34, INK); line(c, pts, 22, "#f0d7bd"); }
    for (let i = 0; i < 11; i++) { const x = 480 + g() * 520, y = 200 + g() * 480; drop(c, x, y, 11, COL.water); }
    for (let i = 0; i < 40; i++) shape(c, () => ell(c, 450 + g() * 580, 160 + g() * 560, 8, 6), CLAYDK, 0);
  });
  arrow(c, [[560, 330], [650, 330]], RED, 9);
};
// ---- 21 t14 evaporation
const t14 = (c: Ctx) => {
  ground(c, "#cfe9fa");
  sparkle(c, 930, 150, 90, COL.yellow); shape(c, () => ell(c, 930, 150, 55, 55), COL.yellow, 5);
  c.fillStyle = "#8fc86a"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  line(c, [[40, 400], [1040, 400]], 8); shape(c, () => rrect(c, 40, 400, 14, 500, 4), COL.woodDk, 5); shape(c, () => rrect(c, 1030, 400, 14, 500, 4), COL.woodDk, 5);
  shirt(c, 260, 400, 1.3, COL.orange, "#d27c25"); shirt(c, 600, 400, 1.3, COL.teal, COL.tealDk);
  const sa = () => polyP(c, [[780, 400], [940, 400], [960, 760], [760, 760]]); shape(c, sa, COL.pink, 6); shade(c, sa, "#d77a98", 50, 0, 0.7);
  [[220, 700], [610, 700]].forEach(([x, y]) => drop(c, x, y, 10));
  [[200, 330], [260, 330], [320, 330], [560, 330], [620, 330], [680, 330], [820, 330], [880, 330]].forEach(([x, y], i) => wave(c, x, y, 150 + (i % 3) * 30, "#ffffff", 8));
  drop(c, 250, 800, 12);
};
// ---- 22 t15 composite: plywood and concrete with steel rods
const t15 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 880, 260, 26); shadow(c, 800, 880, 230, 26);
  const cols = ["#f2c063", "#d39a3a", "#f7d38a", "#d39a3a", "#f2c063"];
  for (let i = 0; i < 5; i++) { const y = 600 - i * 72, dx = i % 2 ? 18 : 0; shape(c, () => polyP(c, [[70 + dx, y + 60], [430 + dx, y + 60], [500 + dx, y], [140 + dx, y]]), cols[i], 5); shape(c, () => polyP(c, [[70 + dx, y + 60], [430 + dx, y + 60], [430 + dx, y + 136], [70 + dx, y + 136]]), cols[i], 5); line(c, i % 2 ? [[100 + dx, y + 100], [400 + dx, y + 100]] : [[100 + dx, y + 80], [400 + dx, y + 120]], 4, COL.woodDk); }
  const f = () => polyP(c, [[570, 520], [1020, 520], [1020, 860], [570, 860]]);
  shape(c, () => polyP(c, [[570, 520], [650, 450], [1070, 450], [1020, 520]]), "#c9c4ba", 6);
  shape(c, f, "#b9b4ab", 6); shape(c, () => polyP(c, [[1020, 520], [1070, 450], [1070, 790], [1020, 860]]), COL.greyDk, 6);
  const gg = rnd(3); for (let k = 0; k < 60; k++) shape(c, () => ell(c, 580 + gg() * 430, 530 + gg() * 320, 5, 4), COL.greyDk, 0);
  for (let k = 0; k < 4; k++) { const x = 700 + k * 90; line(c, [[x, 490], [x - 20, 330]], 16, INK); line(c, [[x, 490], [x - 20, 330]], 8, COL.steel); }
};
// ---- 23 e0 properties decide uses
const e0 = (c: Ctx) => {
  ground(c, "#e8f1f2");
  raincoat(c, 290, 330, 0.85);
  rain(c, [[110, 160], [210, 130], [300, 160], [400, 130], [470, 170]]);
  [[120, 340], [260, 300], [400, 300], [470, 340]].forEach(([x, y]) => { line(c, [[x - 24, y], [x - 40, y - 20]], 6, COL.waterDk); line(c, [[x + 24, y], [x + 40, y - 20]], 6, COL.waterDk); });
  c.fillStyle = "#e6d3b0"; c.fillRect(580, 860, 500, 220); line(c, [[580, 860], [1080, 860]], 6);
  rain(c, [[720, 300], [820, 340], [920, 290], [660, 380], [980, 400]]);
  towel(c, 640, 720, 340, 130, 0.55);
  shape(c, () => ell(c, 620, 860, 40, 12), COL.water, 0); drop(c, 700, 560, 14);
  arrow(c, [[700, 660], [740, 720]], RED, 9); arrow(c, [[900, 660], [860, 720]], RED, 9);
};
// ---- 24 e4 pans and handles
const e4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#6b5a8c"; c.fillRect(0, 830, 1080, 250); line(c, [[0, 830], [1080, 830]], 6);
  shape(c, () => rrect(c, 120, 780, 460, 55, 10), COL.black, 6);
  [220, 330, 440].forEach((x, i) => shape(c, () => { c.moveTo(x - 36, 780); c.quadraticCurveTo(x - 30, 700 - (i % 2) * 30, x, 650); c.quadraticCurveTo(x + 36, 700, x + 36, 780); c.closePath(); }, i % 2 ? COL.yellow : COL.orange, 5));
  kadai(c, 350, 480, 460, COL.steel, COL.steelDk, COL.black, "#1c1824", COL.steelIn, 0.62);
  arrow(c, [[200, 640], [180, 560], [170, 490]], RED, 9); arrow(c, [[280, 700], [440, 700], [590, 560], [610, 500]], RED, 9);
  hand(c, 1030, 435, Math.PI, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[630, 370], [740, 370]], "#5b8fd6", 9);
  line(c, [[780, 330], [780, 410]], 12, "#5b8fd6");
};
// ---- 25 e5 a sweater does not make heat
const e5 = (c: Ctx) => {
  ground(c);
  lens(c, 330, 460, 270, () => {
    c.fillStyle = "#fbe4e8"; c.fillRect(60, 190, 540, 540);
    const g = rnd(11);
    for (let i = 0; i < 20; i++) { const x = 100 + g() * 460, y = 230 + g() * 460; shape(c, () => ell(c, x, y, 36, 28), "#d8ecfa", 4); }
    for (let i = 0; i < 12; i++) { const x = 110 + g() * 440, y = 240 + g() * 440; c.beginPath(); c.arc(x, y, 38, 0, Math.PI * 1.5); c.lineWidth = 16; c.strokeStyle = INK; c.stroke(); c.lineWidth = 8; c.strokeStyle = WOOL; c.stroke(); }
  });
  ice(c, 790, 590, 52); sock(c, 790, 850);
  arrow(c, [[640, 380], [740, 360]], RED, 9);
  [[880, 300], [930, 360]].forEach(([x, y]) => drop(c, x, y, 10, COL.waterDk));
};
// ---- 26 e6 clay pot sweats
const e6 = (c: Ctx) => {
  ground(c, "#e8f1f2");
  c.beginPath(); ell(c, 540, 610, 400, 400); c.fillStyle = "rgba(143,195,234,0.45)"; c.fill();
  pot(c, 540, 900, 520, 580);
  const g = rnd(9); for (let i = 0; i < 24; i++) { const x = 330 + g() * 420, y = 480 + g() * 330; drop(c, x, y, 9, COL.drop); }
  [[400, 250], [540, 220], [680, 250]].forEach(([x, y], i) => { wave(c, x, y, 150, COL.waterDk, 8); arrow(c, [[x, y - 160], [x, y - 205]], RED, 8); });
};
// ---- 27 e7 umbrella made of several materials
const swatch = (c: Ctx, x: number, y: number, kind: number) => {
  shape(c, () => rrect(c, x - 56, y - 56, 112, 112, 16), kind === 0 ? "#5b8fd6" : kind === 1 ? COL.steel : RED, 6);
  if (kind === 0) for (let i = 0; i < 5; i++) { line(c, [[x - 40 + i * 20, y - 44], [x - 40 + i * 20, y + 44]], 2, "#3f6fb3"); line(c, [[x - 44, y - 40 + i * 20], [x + 44, y - 40 + i * 20]], 2, "#3f6fb3"); }
  if (kind === 1) { line(c, [[x - 36, y - 28], [x + 36, y - 28]], 8, COL.steelDk); line(c, [[x - 36, y], [x + 36, y]], 8, COL.steelDk); line(c, [[x - 36, y + 28], [x + 36, y + 28]], 8, COL.steelDk); }
  if (kind === 2) { shine(c, [[x - 30, y - 28], [x - 30, y + 20]], 9); }
};
const e7 = (c: Ctx) => {
  ground(c);
  umbrella(c, 580, 150, 330, "#5b8fd6", "#3f6fb3", 0, true);
  swatch(c, 130, 130, 0); arrow(c, [[200, 140], [400, 230]], RED, 9);
  swatch(c, 130, 450, 1); arrow(c, [[200, 430], [480, 300]], RED, 9);
  swatch(c, 130, 880, 2); arrow(c, [[200, 870], [530, 780]], RED, 9);
};
// ---- 28 e8 zoom to atoms
const e8 = (c: Ctx) => {
  ground(c);
  spoon(c, 180, 900, 700, 0.2, COL.steel, COL.steelDk);
  arrow(c, [[270, 540], [350, 540]], RED, 9);
  lens(c, 540, 540, 170, () => atoms(c, 540, 540, 170, 24, false));
  arrow(c, [[730, 540], [775, 540]], RED, 9);
  lens(c, 915, 540, 130, () => atoms(c, 915, 540, 130, 19, true));
};
// ---- 29 e11 plastic: balance
const e11 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 940, 260, 24);
  shape(c, () => polyP(c, [[470, 940], [610, 940], [570, 340], [510, 340]]), COL.steel, 6);
  shape(c, () => rrect(c, 340, 920, 400, 40, 12), COL.steelDk, 6);
  shape(c, () => rrect(c, 120, 330, 840, 36, 14), COL.steel, 6); shape(c, () => ell(c, 540, 348, 30, 30), COL.steelDk, 6);
  [[180, 348], [900, 348]].forEach(([x, y]) => { line(c, [[x, y], [x - 80, y + 330]], 5); line(c, [[x, y], [x + 80, y + 330]], 5); shape(c, () => polyP(c, [[x - 140, y + 330], [x + 140, y + 330], [x + 100, y + 372], [x - 100, y + 372]]), COL.steelDk, 6); });
  // left: drip bag + raincoat
  shape(c, () => rrect(c, 130, 540, 100, 150, 24), "rgba(214,236,250,0.9)", 6); shape(c, () => rrect(c, 134, 610, 92, 76, 20), COL.water, 0); shape(c, () => rrect(c, 130, 540, 100, 150, 24), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 160, 505, 40, 36, 8), COL.steel, 5); line(c, [[180, 690], [190, 650], [250, 640], [260, 600]], 5);
  shape(c, () => rrect(c, 250, 600, 90, 90, 12), COAT, 6); line(c, [[250, 640], [340, 640]], 4, COATDK); shape(c, () => ell(c, 295, 600, 26, 14), COATDK, 4);
  // right: bags and bottles
  bottle(c, 830, 700, 70, 150, "rgba(143,195,234,0.85)", COL.waterDk);
  [[920, 690, 0.3, COL.red], [980, 680, -0.2, COL.green], [880, 700, 0.9, COL.yellow], [950, 640, 0.1, COL.pink]].forEach(([x, y, r, col]) => { c.save(); c.translate(x, y); c.rotate(r); shape(c, () => polyP(c, [[-44, -30], [44, -36], [50, 20], [-40, 24]]), col, 5); line(c, [[-30, -10], [30, -14]], 3, WHITE); c.restore(); });
};

export const ic_materialsUsingMaterialsL3 = cards("sci.materials.using-materials.L3 cards", [
  intro, summary, e2, e3, a1, a2, a3, a5, a6, p1, c1, c2, t0, t1, t2, t4, t5, t6, t7, t19, t13, t14, t15, e0, e4, e5, e6, e7, e8, e11,
]);
