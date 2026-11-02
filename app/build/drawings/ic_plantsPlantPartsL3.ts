import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, D, arrow, cards, ell, glass, ground, leaf, line, polyP, person, hand, rnd, rrect, shade, shadow, shape, shine, seed, write } from "./flatKit";

// sci.plants.plant-parts.L3 · picture cards. Flat DeepKids look; same child (orange shirt) and grown-up
// (blue shirt) as the set-up cards; red arrows = movement or change.

const PI = Math.PI, ROOT = "#fff3dc", POT = "#d9a86a", POTDK = "#b8844a", CARROT = "#f08a2e", CARROTDK = "#cf6a17", CANE = "#9cc060";
const soilBlock = (c: Ctx, y: number) => {
  shape(c, () => c.rect(-10, y, D + 20, D - y + 10), COL.soil, 0);
  const r = rnd(7); for (let i = 0; i < 40; i++) { c.beginPath(); ell(c, r() * D, y + 30 + r() * (D - y - 40), 7 + r() * 8, 5 + r() * 5); c.fillStyle = r() > 0.5 ? COL.soilDk : "#a06d4a"; c.fill(); }
  line(c, [[-10, y], [D + 10, y]], 7);
};
const rootLine = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 8, INK); line(c, pts, w, ROOT); };
const stemLine = (c: Ctx, pts: number[][], w: number, col: string = COL.green) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const potato = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0, eyes = true) => {
  const p = () => ell(c, x, y, rx, ry, rot);
  shape(c, p, POT, 6); shade(c, p, POTDK, rx * 0.25, ry * 0.25);
  if (eyes) for (const [u, v] of [[-0.4, -0.2], [0.3, -0.45], [0.1, 0.35], [-0.2, 0.5], [0.55, 0.1]]) { c.beginPath(); ell(c, x + u * rx, y + v * ry, rx * 0.05, ry * 0.07); c.fillStyle = "#6a4128"; c.fill(); }
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 46), y + Math.sin(a) * (r + 46)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const carrot = (c: Ctx, x: number, y: number, w: number, h: number, leaves = true) => {
  if (leaves) for (const a of [-2.2, -1.57, -0.95]) stemLine(c, [[x, y + 4], [x + Math.cos(a) * h * 0.3, y + Math.sin(a) * h * 0.3]], 9);
  const p = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x, y - w * 0.12, x + w / 2, y); c.quadraticCurveTo(x + w * 0.3, y + h * 0.6, x, y + h); c.quadraticCurveTo(x - w * 0.3, y + h * 0.6, x - w / 2, y); c.closePath(); };
  shape(c, p, CARROT, 6); shade(c, p, CARROTDK, w * 0.2, 0);
  for (const f of [0.25, 0.45, 0.65]) { const hw = w * 0.5 * (1 - f) * 0.9; line(c, [[x - hw, y + h * f], [x - hw * 0.4, y + h * f + 8]], 4, CARROTDK); }
};
const sprout = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len; stemLine(c, [[x, y], [tx, ty]], 16, "#c5e08e");
  shape(c, () => ell(c, tx, ty, 14, 14), COL.greenLt, 5);
};
const bookStack = (c: Ctx, x: number, y: number, w: number) => {
  const cols = [COL.blue, COL.red, COL.yellow]; cols.forEach((col, i) => { const by = y - (i + 1) * 62; shape(c, () => rrect(c, x - w / 2 + (i === 1 ? 10 : 0), by, w, 62, 6), col, 6); line(c, [[x - w / 2 + 20 + (i === 1 ? 10 : 0), by + 31], [x + w / 2 - 20, by + 31]], 5, WHITE); });
};
const tray = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, 14), COL.steel, 6);

// 0 summary: a potato (a stem) and a carrot (a root), both under the ground
const sSummary = (c: Ctx) => {
  ground(c); soilBlock(c, 430);
  stemLine(c, [[300, 690], [300, 430], [310, 330]], 14); leaf(c, 308, 400, 150, -2.6, COL.leaf); leaf(c, 308, 400, 150, -0.5, COL.leaf); leaf(c, 310, 335, 120, -1.57, COL.leaf);
  potato(c, 300, 790, 190, 120, 0.1);
  carrot(c, 790, 430, 160, 540, false);
  for (const [dx, a] of [[-20, -2.2], [0, -1.57], [20, -0.95]]) { stemLine(c, [[790 + dx, 430], [790 + dx + Math.cos(a) * 130, 430 + Math.sin(a) * 130]], 11); }
  leaf(c, 770, 300, 110, -2.4, COL.leaf); leaf(c, 810, 300, 110, -0.7, COL.leaf);
};
// 1 e1: a sprouting potato on a plate, no soil
const sE1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 900, 400, 56); shape(c, () => ell(c, 540, 840, 380, 100), COL.steel, 6); shape(c, () => ell(c, 540, 830, 310, 70), COL.steelIn, 4);
  potato(c, 540, 700, 210, 140, 0);
  sprout(c, 450, 620, 190, -1.9); sprout(c, 560, 575, 250, -1.6); sprout(c, 670, 630, 190, -1.2); sprout(c, 620, 770, 70, 0.5);
  leaf(c, 468, 440, 80, -2.5, COL.greenLt); leaf(c, 557, 330, 90, -0.9, COL.greenLt);
  glass(c, 930, 900, 130, 210, 0.7);
};
// 2 e2: a drop of iodine on a potato slice turns blue-black
const sE2 = (c: Ctx) => {
  ground(c); shadow(c, 560, 910, 420, 50); shape(c, () => ell(c, 540, 840, 400, 100), COL.steel, 6); shape(c, () => ell(c, 540, 830, 330, 70), COL.steelIn, 4);
  shape(c, () => ell(c, 540, 700, 280, 140), POT, 6); shape(c, () => ell(c, 540, 700, 258, 124), "#f6ead0", 0);
  shape(c, () => { c.moveTo(430, 700); c.bezierCurveTo(440, 620, 650, 625, 650, 700); c.bezierCurveTo(655, 770, 440, 775, 430, 700); }, "#1f1b4d", 0);
  for (const [x, y] of [[372, 640], [700, 760], [470, 770]]) { c.beginPath(); ell(c, x, y, 14, 9); c.fillStyle = "#e6d8b0"; c.fill(); }
  // dropper
  shape(c, () => rrect(c, 505, 90, 70, 120, 30), "#a33b3b", 6);
  shape(c, () => { c.moveTo(512, 210); c.lineTo(568, 210); c.lineTo(556, 450); c.lineTo(540, 500); c.lineTo(524, 450); c.closePath(); }, COL.glass, 6);
  shape(c, () => { c.moveTo(517, 300); c.lineTo(563, 300); c.lineTo(554, 450); c.lineTo(540, 490); c.lineTo(526, 450); c.closePath(); }, "#9a5a2a", 0);
  shape(c, () => { c.moveTo(540, 540); c.quadraticCurveTo(520, 580, 540, 600); c.quadraticCurveTo(560, 580, 540, 540); }, "#9a5a2a", 5);
  arrow(c, [[640, 330], [640, 520]]);
};
// 3 e3: sun on a leaf, and a leaf hidden under a black card
const sE3 = (c: Ctx) => {
  ground(c); sun(c, 200, 170, 90);
  shape(c, () => polyP(c, [[400, 900], [680, 900], [650, 1040], [430, 1040]]), "#c9693a", 6); shape(c, () => rrect(c, 380, 870, 320, 50, 12), "#d97c4a", 6);
  stemLine(c, [[540, 880], [540, 640], [545, 520]], 20);
  leaf(c, 540, 700, 340, -2.7, COL.leaf); leaf(c, 540, 640, 340, -0.45, COL.leaf);
  shape(c, () => rrect(c, 640, 460, 210, 170, 8), "#2f2a3a", 6); line(c, [[700, 460], [700, 630]], 4, "#4a4458"); line(c, [[790, 460], [790, 630]], 4, "#4a4458");
  arrow(c, [[300, 270], [330, 420]]); arrow(c, [[380, 230], [440, 390]]);
};
// 4 e4: grass roots hold the soil, bare soil washes away
const sE4 = (c: Ctx) => {
  ground(c);
  const box = (x: number) => { shape(c, () => rrect(c, x, 560, 430, 280, 10), COL.soil, 6); const r = rnd(x); for (let i = 0; i < 14; i++) { c.beginPath(); ell(c, x + 20 + r() * 390, 580 + r() * 240, 8, 6); c.fillStyle = COL.soilDk; c.fill(); } };
  box(60); box(590);
  for (let i = 0; i < 6; i++) { const gx = 110 + i * 65; for (const a of [-2.0, -1.57, -1.2]) stemLine(c, [[gx, 565], [gx + Math.cos(a) * 110, 565 + Math.sin(a) * 110]], 7); rootLine(c, [[gx, 570], [gx - 14 + (i % 2) * 28, 700], [gx + (i % 3 - 1) * 20, 810]], 8); }
  shape(c, () => polyP(c, [[1020, 560], [1020, 560], [1020, 840], [770, 840], [720, 740], [640, 650], [590, 640], [590, 560]]), "#a88a6e", 0);
  shape(c, () => { c.moveTo(1020, 840); c.quadraticCurveTo(800, 930, 600, 940); c.lineTo(600, 1010); c.lineTo(1020, 1010); c.closePath(); }, "#a8783f", 6);
  shape(c, () => rrect(c, 60, 870, 430, 40, 12), COL.water, 6);
  for (const x of [160, 330, 700, 880]) arrow(c, [[x, 330], [x, 470]], COL.blueDk);
  c.beginPath(); ell(c, 280, 400, 70, 22); c.fillStyle = COL.sky; c.fill(); c.beginPath(); ell(c, 810, 400, 70, 22); c.fillStyle = COL.sky; c.fill();
};
// 5 a1: a child's hand with a lens over a potato, a carrot beside it
const sA1 = (c: Ctx) => {
  ground(c); shadow(c, 540, 930, 480, 50); shape(c, () => rrect(c, 40, 880, 1000, 90, 16), COL.wood, 6);
  carrot(c, 215, 640, 190, 300, false);
  for (const a of [-2.3, -1.57, -0.9]) stemLine(c, [[215, 640], [215 + Math.cos(a) * 120, 640 + Math.sin(a) * 120]], 11);
  potato(c, 640, 770, 190, 110, 0.1);
  line(c, [[770, 500], [900, 500]], 24, INK); line(c, [[770, 500], [900, 500]], 14, COL.woodDk);
  shape(c, () => ell(c, 640, 500, 160, 160), "rgba(214,236,250,0.7)", 12);
  shape(c, () => ell(c, 640, 510, 120, 90, 0.1), POT, 4);
  for (const [u, v] of [[-50, -10], [30, -30], [10, 30]]) { shape(c, () => ell(c, 640 + u, 510 + v, 20, 14), "#6a4128", 3); sprout(c, 640 + u, 510 + v, 25, -1.4); }
  hand(c, 960, 500, PI, 1.2);
};
// 6 a3: a tendril before, after 30 minutes, after 2 hours
const coil = (c: Ctx, x: number, y0: number, y1: number) => { const pts: number[][] = []; for (let i = 0; i <= 60; i++) { const t = i / 60; pts.push([x + Math.sin(t * PI * 10) * 38, y0 + (y1 - y0) * t]); } stemLine(c, pts, 10); };
const sA3 = (c: Ctx) => {
  ground(c); stemLine(c, [[30, 200], [540, 190], [1050, 200]], 26); leaf(c, 190, 195, 150, -2.5, COL.leaf); leaf(c, 880, 195, 150, -0.6, COL.leaf);
  stemLine(c, [[200, 200], [200, 700]], 11);
  stemLine(c, [[540, 200], [545, 420], [590, 640], [700, 740]], 11);
  stemLine(c, [[880, 200], [880, 330]], 11); coil(c, 880, 330, 800);
  line(c, [[40, 760], [260, 560]], 22, INK); line(c, [[40, 760], [260, 560]], 12, COL.woodDk);
  arrow(c, [[250, 880], [250, 800], [150, 800]]);
  arrow(c, [[360, 480], [420, 480]]); arrow(c, [[710, 480], [780, 480]]);
};
// 7 a5: a child stands wide and reaches up: roots below, a Sun above
const sA5 = (c: Ctx) => {
  ground(c); sun(c, 880, 160, 80); soilBlock(c, 640);
  rootLine(c, [[540, 640], [540, 830], [520, 960]], 14); rootLine(c, [[540, 700], [400, 790], [320, 960]], 12); rootLine(c, [[540, 700], [690, 800], [760, 940]], 12); rootLine(c, [[420, 780], [300, 800]], 9); rootLine(c, [[670, 790], [800, 790]], 9);
  person(c, 540, 640, 500, { armL: [-2.3, -1.85], armR: [-0.85, -1.3] });
  arrow(c, [[820, 330], [680, 330]]);
};
// 8 c2: three paper stems, the tube holds the books
const sC2 = (c: Ctx) => {
  ground(c); shadow(c, 540, 925, 480, 40);
  // tube
  shape(c, () => { c.moveTo(450, 600); c.lineTo(450, 900); c.bezierCurveTo(450, 950, 630, 950, 630, 900); c.lineTo(630, 600); c.closePath(); }, COL.paper, 6);
  shade(c, () => { c.moveTo(450, 600); c.lineTo(450, 900); c.bezierCurveTo(450, 950, 630, 950, 630, 900); c.lineTo(630, 600); c.closePath(); }, "#d8cfb8", 60, 0);
  shape(c, () => ell(c, 540, 600, 90, 24), "#e9e0c8", 6);
  shape(c, () => rrect(c, 410, 560, 260, 30, 6), "#d3b27a", 6);
  bookStack(c, 540, 560, 230);
  // zigzag
  for (let i = 0; i < 5; i++) shape(c, () => polyP(c, [[60 + i * 50, 600], [110 + i * 50, 600 + (i % 2 ? 12 : -12)], [110 + i * 50, 900], [60 + i * 50, 900]]), i % 2 ? "#d8cfb8" : COL.paper, 6);
  // square column
  shape(c, () => polyP(c, [[770, 640], [880, 640], [880, 900], [770, 900]]), COL.paper, 6); shape(c, () => polyP(c, [[880, 640], [950, 610], [950, 870], [880, 900]]), "#d8cfb8", 6); shape(c, () => polyP(c, [[770, 640], [880, 640], [950, 610], [840, 610]]), "#efe7d2", 6);
};
// 9 term.0 root
const sRoot = (c: Ctx) => {
  ground(c); soilBlock(c, 450);
  stemLine(c, [[540, 460], [540, 250]], 16); leaf(c, 540, 280, 220, -2.5, COL.leaf); leaf(c, 540, 280, 220, -0.65, COL.leaf);
  rootLine(c, [[540, 450], [540, 700], [530, 930]], 20);
  for (const [sx, sy, ex, ey] of [[540, 540, 400, 640], [540, 600, 690, 700], [535, 700, 410, 790], [535, 760, 660, 860], [540, 840, 470, 940]]) rootLine(c, [[sx, sy], [ex, ey]], 10);
  arrow(c, [[900, 560], [760, 650]]);
};
// 10 term.1 stem
const sStem = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, -10, 880, D + 20, 210, 0), COL.soil, 0); line(c, [[-10, 880], [D + 10, 880]], 7);
  shape(c, () => polyP(c, [[250, 880], [285, 450], [395, 450], [430, 880]]), "#8a5a3c", 6); shade(c, () => polyP(c, [[250, 880], [285, 450], [395, 450], [430, 880]]), COL.soilDk, 40, 0);
  shape(c, () => ell(c, 340, 330, 230, 190), COL.leaf, 6); shape(c, () => ell(c, 250, 280, 120, 100), COL.greenLt, 0); shape(c, () => ell(c, 340, 330, 230, 190), "rgba(0,0,0,0)", 6);
  stemLine(c, [[780, 880], [780, 530]], 14);
  for (const [a, dx] of [[-2.4, 0], [-0.75, 0]]) { stemLine(c, [[780, 560], [780 + Math.cos(a) * 110, 560 + Math.sin(a) * 110]], 8); leaf(c, 780 + Math.cos(a) * 110, 560 + Math.sin(a) * 110, 100, a - 0.5, COL.greenLt); leaf(c, 780 + Math.cos(a) * 110, 560 + Math.sin(a) * 110, 100, a + 0.5, COL.greenLt); }
  stemLine(c, [[780, 530], [780, 470]], 10); leaf(c, 780, 470, 100, -1.57, COL.greenLt); leaf(c, 780, 470, 90, -2.3, COL.greenLt); leaf(c, 780, 470, 90, -0.85, COL.greenLt);
  arrow(c, [[570, 780], [460, 700]]); arrow(c, [[600, 780], [700, 720]]);
};
// 11 term.4 shape suits job: wide flat leaf to the Sun, thin root between soil grains
const sShape = (c: Ctx) => {
  ground(c); sun(c, 150, 130, 70); soilBlock(c, 480);
  stemLine(c, [[540, 490], [540, 330]], 14); leaf(c, 540, 330, 330, -2.75, COL.leaf); leaf(c, 540, 330, 330, -0.4, COL.leaf);
  const path = (y: number) => 540 + Math.sin(y / 55) * 45;
  const r = rnd(5); const grains: number[][] = [];
  for (let i = 0; i < 400 && grains.length < 70; i++) { const x = 40 + r() * 1000, y = 520 + r() * 520, rad = 26 + r() * 20; if (Math.abs(x - path(y)) < rad + 22) continue; if (grains.some(([gx, gy, gr]) => Math.hypot(gx - x, gy - y) < gr + rad + 4)) continue; grains.push([x, y, rad]); }
  const tones = ["#a8723f", "#8a5a3c", "#c28b57"]; grains.forEach(([x, y, rad], i) => shape(c, () => ell(c, x, y, rad, rad * 0.8, i), tones[i % 3], 4));
  const pts: number[][] = []; for (let y = 480; y <= 1040; y += 20) pts.push([path(y), y]); rootLine(c, pts, 12);
};
// 12 term.6 tap root
const sTap = (c: Ctx) => {
  ground(c); stemLine(c, [[540, 380], [540, 250]], 14); leaf(c, 540, 270, 200, -2.5, COL.leaf); leaf(c, 540, 270, 200, -0.65, COL.leaf); leaf(c, 540, 255, 150, -1.57, COL.leaf);
  const p = () => { c.moveTo(500, 380); c.quadraticCurveTo(540, 360, 580, 380); c.quadraticCurveTo(560, 700, 542, 1000); c.quadraticCurveTo(536, 700, 500, 380); };
  shape(c, p, ROOT, 6);
  for (const [sx, sy, ex, ey] of [[525, 470, 380, 560], [558, 500, 700, 590], [545, 600, 400, 700], [550, 650, 690, 760], [545, 780, 440, 860], [545, 840, 640, 920]]) rootLine(c, [[sx, sy], [ex, ey]], 9);
  const r = rnd(3); for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, 480 + r() * 120, 400 + r() * 40, 10, 7); c.fillStyle = COL.soilDk; c.fill(); }
};
// 13 term.7 fibrous roots
const sFib = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 9; i++) { const x = 400 + i * 35, a = -1.57 + (i - 4) * 0.17; stemLine(c, [[x, 470], [x + Math.cos(a) * 280, 470 + Math.sin(a) * 280]], 9, COL.greenLt); }
  shape(c, () => rrect(c, 360, 450, 360, 50, 20), COL.soil, 6);
  for (let i = 0; i < 17; i++) { const x = 380 + i * 20, d = (i - 8) / 8; rootLine(c, [[x, 495], [x + d * 70, 640], [x + d * 160, 780 + (i % 3) * 30]], 6); }
};
// 14 term.8 root hairs, white on black paper
const sHair = (c: Ctx) => {
  c.fillStyle = "#1d1830"; c.fillRect(0, 0, D, D);
  seed(c, 220, 220, 90, -0.4, true);
  const pts: number[][] = []; for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push([260 + t * 560 + Math.sin(t * 5) * 30, 280 + t * 600 - Math.sin(t * 3) * 10]); }
  const wd = (t: number) => 54 - 40 * t;
  for (let i = 0; i < 30; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; const an = Math.atan2(y1 - y0, x1 - x0), t = i / 30; line(c, [[x0, y0], [x1, y1]], wd(t), "#fff3dc"); if (t > 0.2 && t < 0.92) for (const s of [-1, 1]) for (let k = 0; k < 2; k++) { const px = x0 + (x1 - x0) * k / 2, py = y0 + (y1 - y0) * k / 2, l = 55 + ((i * 7 + k * 3) % 5) * 10, aa = an + s * (PI / 2 + (((i + k) % 3) - 1) * 0.3); line(c, [[px, py], [px + Math.cos(aa) * l, py + Math.sin(aa) * l]], 5, "#fff3dc"); } }
};
// 15 term.9 storage roots
const sStore = (c: Ctx) => {
  ground(c); shadow(c, 540, 930, 480, 36);
  const top = (x: number, y: number) => { for (let i = 0; i < 3; i++) { const a = -1.57 + (i - 1) * 0.5; stemLine(c, [[x, y], [x + Math.cos(a) * 130, y + Math.sin(a) * 130]], 10); } };
  top(130, 440); carrot(c, 130, 440, 150, 480, false);
  top(380, 520); const rd = () => { c.moveTo(380 - 100, 640); c.bezierCurveTo(380 - 110, 520, 380 + 110, 520, 380 + 100, 640); c.bezierCurveTo(380 + 95, 770, 380 + 20, 800, 380, 930); c.bezierCurveTo(380 - 20, 800, 380 - 95, 770, 380 - 100, 640); };
  shape(c, rd, "#f2b6c4", 6); shade(c, rd, "#d98fa3", 40, 0);
  top(640, 500); shape(c, () => ell(c, 640, 650, 130, 150), "#8b2e55", 6); shade(c, () => ell(c, 640, 650, 130, 150), "#5f1c3b", 45, 30); line(c, [[640, 800], [650, 920]], 7, INK);
  const sp = () => { c.moveTo(790, 720); c.bezierCurveTo(800, 590, 1000, 590, 1010, 720); c.bezierCurveTo(1020, 850, 940, 900, 905, 930); c.bezierCurveTo(850, 900, 780, 850, 790, 720); };
  shape(c, sp, "#c4795c", 6); shade(c, sp, "#9e5a42", 40, 20);
};
// 16 term.12 tuber: a potato plant dug up, potatoes on underground stems
const sTuber = (c: Ctx) => {
  ground(c); soilBlock(c, 420);
  stemLine(c, [[540, 420], [540, 130]], 16); leaf(c, 540, 330, 170, -2.6, COL.leaf); leaf(c, 540, 330, 170, -0.55, COL.leaf); leaf(c, 540, 220, 150, -2.3, COL.leaf); leaf(c, 540, 220, 150, -0.85, COL.leaf); leaf(c, 540, 135, 110, -1.57, COL.leaf);
  const arms: [number[][], number, number, number, number][] = [[[[540, 430], [440, 560], [300, 700]], 300, 780, 150, 95], [[[540, 440], [680, 570], [790, 700]], 790, 780, 140, 90], [[[540, 440], [540, 640], [520, 780]], 520, 880, 120, 80], [[[540, 430], [350, 470], [170, 520]], 150, 580, 90, 65]];
  for (const [pts, px, py, rx, ry] of arms) { rootLine(c, pts, 9); potato(c, px, py, rx, ry, 0.2); }
};
// 17 term.11 node: rings on sugarcane and ginger
const sNode = (c: Ctx) => {
  ground(c); shadow(c, 540, 960, 440, 36);
  const cane = () => rrect(c, 190, 160, 150, 780, 30); shape(c, cane, CANE, 6); shade(c, cane, "#7ea23f", 35, 0);
  for (const y of [330, 560, 790]) { shape(c, () => ell(c, 265, y, 80, 18), "#6b8a3a", 5); shape(c, () => ell(c, 265, y - 6, 10, 6), "#3b4a1f", 0); }
  const gx = 700; const gin = () => { c.moveTo(gx - 220, 700); c.bezierCurveTo(gx - 230, 560, gx - 120, 520, gx - 50, 560); c.bezierCurveTo(gx - 20, 440, gx + 80, 430, gx + 100, 520); c.bezierCurveTo(gx + 180, 470, gx + 260, 540, gx + 230, 640); c.bezierCurveTo(gx + 250, 760, gx + 100, 820, gx - 20, 790); c.bezierCurveTo(gx - 130, 840, gx - 230, 800, gx - 220, 700); };
  shape(c, gin, "#e3b679", 6); shade(c, gin, "#c28f4f", 30, 30);
  for (const x of [gx - 130, gx - 20, gx + 90]) line(c, [[x, 640], [x + 30, 760]], 6, "#9a6a35");
  for (const [x, y] of [[265, 330], [265, 560], [gx - 130, 700], [gx - 20, 700]]) { c.beginPath(); ell(c, x, y, x < 400 ? 110 : 70, x < 400 ? 52 : 90); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); }
};
// 18 term.14 bulb: an onion cut in half
const sBulb = (c: Ctx) => {
  ground(c); shadow(c, 560, 880, 340, 36);
  for (const [x, a] of [[500, -1.7], [560, -1.57], [620, -1.45]]) stemLine(c, [[x, 330], [x + Math.cos(a) * 130, 330 + Math.sin(a) * 250]], 12, COL.greenLt);
  const onion = (k: number) => () => { const w = 330 * k, h = 270 * k; c.moveTo(560, 250 + (1 - k) * 240); c.bezierCurveTo(560 + w * 0.2, 330, 560 + w, 400, 560 + w, 560); c.bezierCurveTo(560 + w, 760 - (1 - k) * 80, 560 + w * 0.5, 800 - (1 - k) * 60, 560, 810 - (1 - k) * 60); c.bezierCurveTo(560 - w * 0.5, 800 - (1 - k) * 60, 560 - w, 760 - (1 - k) * 80, 560 - w, 560); c.bezierCurveTo(560 - w, 400, 560 - w * 0.2, 330, 560, 250 + (1 - k) * 240); void h; };
  shape(c, onion(1), "#c68a4f", 6); shape(c, onion(0.93), "#f6e6ee", 5); shape(c, onion(0.78), "#ecd0e0", 5); shape(c, onion(0.6), "#f6e6ee", 5); shape(c, onion(0.4), "#ecd0e0", 5); shape(c, onion(0.2), "#f6e6ee", 5);
  shape(c, () => rrect(c, 400, 780, 320, 46, 14), "#9a7a4a", 6);
  for (let i = 0; i < 7; i++) { const x = 420 + i * 46; rootLine(c, [[x, 825], [x + (i - 3) * 8, 900]], 6); }
};
// 19 term.16 twiner: a bean stem winds round a stick
const sTwine = (c: Ctx) => {
  ground(c); soilBlock(c, 930);
  const pt = (t: number): number[] => [540 + Math.cos(t * 9 * PI / 2) * 95, 930 - t * 750];
  const seg = (a: number, b: number) => { const pts: number[][] = []; for (let i = 0; i <= 12; i++) pts.push(pt(a + (b - a) * i / 12)); stemLine(c, pts, 14); };
  for (let k = 0; k < 18; k++) { const t0 = k / 18, t1 = (k + 1) / 18; if (Math.sin(t0 * 9 * PI / 2 + 0.2) < 0) seg(t0, t1); }
  shape(c, () => rrect(c, 505, 110, 70, 830, 18), COL.wood, 6); shade(c, () => rrect(c, 505, 110, 70, 830, 18), COL.woodDk, 22, 0);
  for (let k = 0; k < 18; k++) { const t0 = k / 18, t1 = (k + 1) / 18; if (Math.sin(t0 * 9 * PI / 2 + 0.2) >= 0) seg(t0, t1); }
  for (const t of [0.2, 0.45, 0.7]) { const [x, y] = pt(t); const left = Math.cos(t * 9 * PI / 2) < 0; leaf(c, x, y, 170, left ? PI + 0.25 : -0.25, COL.leaf); }
  arrow(c, [[780, 800], [780, 560]]);
};
// 20 term.20 breathing roots
const sBreath = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -10, 700, D + 20, 400, 0), "#7a5b43", 0); line(c, [[-10, 700], [D + 10, 700]], 6);
  shape(c, () => rrect(c, -10, 700, D + 20, 60, 0), COL.water, 0); line(c, [[-10, 700], [D + 10, 700]], 6);
  shape(c, () => polyP(c, [[500, 700], [525, 360], [585, 360], [610, 700]]), COL.brown, 6); shape(c, () => ell(c, 555, 300, 300, 200), COL.leaf, 6); shape(c, () => ell(c, 450, 260, 130, 100), COL.greenLt, 0);
  rootLine(c, [[-10, 940], [300, 960], [555, 940], [800, 960], [1090, 940]], 18);
  const xs = [90, 170, 250, 330, 410, 700, 780, 860, 940, 1010]; xs.forEach((x, i) => { const top = 590 + (i * 37) % 70; const p = () => { c.moveTo(x - 14, 950); c.lineTo(x - 11, top + 12); c.lineTo(x, top); c.lineTo(x + 11, top + 12); c.lineTo(x + 14, 950); c.closePath(); }; shape(c, p, "#d9c3a1", 5); });
  arrow(c, [[250, 480], [250, 590]], COL.blueDk);
};
// 21 term.23 stoma
const sStoma = (c: Ctx) => {
  c.fillStyle = "#cfe8a8"; c.fillRect(0, 0, D, D);
  const r = rnd(2); const cell = (x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, 40), "#a9d17a", 5);
  cell(30, 40, 300, 300); cell(380, 20, 320, 260); cell(760, 60, 280, 280); cell(30, 760, 330, 280); cell(430, 800, 300, 240); cell(780, 740, 260, 300);
  const g = (s: number) => () => { c.moveTo(540 + s * 30, 300); c.bezierCurveTo(540 + s * 330, 330, 540 + s * 330, 750, 540 + s * 30, 780); c.bezierCurveTo(540 + s * 150, 650, 540 + s * 150, 430, 540 + s * 30, 300); };
  shape(c, g(-1), COL.green, 6); shape(c, g(1), COL.green, 6);
  for (const [x, y] of [[400, 480], [380, 600], [440, 680], [680, 470], [700, 600], [660, 690]]) { shape(c, () => ell(c, x, y, 26, 18), "#2f7a33", 4); }
  void r;
  arrow(c, [[540, 130], [540, 280]], COL.blueDk, 12); arrow(c, [[540, 950], [540, 800]], COL.blueDk, 12);
};
// 22 term.24 chlorophyll: zoom from a leaf to green blobs in cells
const sChloro = (c: Ctx) => {
  ground(c); leaf(c, 70, 250, 330, -0.2, COL.leaf); leaf(c, 90, 220, 280, -0.7, COL.leaf);
  line(c, [[330, 190], [420, 80]], 6, INK); line(c, [[300, 330], [420, 720]], 6, INK);
  c.save(); c.beginPath(); ell(c, 650, 560, 400, 400); c.clip(); c.fillStyle = "#d9ecbb"; c.fillRect(0, 0, D, D);
  const cl = (x: number, y: number, w: number, h: number, s: number) => { shape(c, () => rrect(c, x, y, w, h, 30), "#e9f5d3", 5); const r = rnd(s); for (let i = 0; i < 6; i++) shape(c, () => ell(c, x + 50 + r() * (w - 100), y + 50 + r() * (h - 100), 28, 20, r() * 3), COL.green, 4); };
  cl(290, 200, 330, 270, 1); cl(640, 190, 340, 270, 2); cl(260, 500, 320, 280, 3); cl(610, 500, 360, 280, 4); cl(320, 820, 600, 200, 5);
  c.restore(); c.beginPath(); ell(c, 650, 560, 400, 400); c.lineWidth = 12; c.strokeStyle = INK; c.stroke();
};
// 23 term.25 spine
const sSpine = (c: Ctx) => {
  ground(c); shadow(c, 560, 960, 360, 40);
  const body = () => { c.moveTo(300, 920); c.bezierCurveTo(250, 600, 300, 260, 540, 200); c.bezierCurveTo(780, 260, 830, 600, 780, 920); c.bezierCurveTo(640, 980, 440, 980, 300, 920); };
  shape(c, body, COL.leaf, 6); shade(c, body, COL.leafDk, 90, 0);
  for (const x of [420, 540, 660]) line(c, [[x, 230 + Math.abs(x - 540) * 0.4], [x + (x - 540) * 0.3, 930]], 6, COL.leafDk);
  const asp = (x: number, y: number) => { for (let k = 0; k < 7; k++) { const a = -PI / 2 + (k - 3) * 0.42, l = 78 + (k % 2) * 14; line(c, [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]], 9, INK); line(c, [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]], 5, "#fff3dc"); } shape(c, () => ell(c, x, y, 17, 13), "#d9c3a1", 4); };
  for (const [x, y] of [[480, 330], [600, 330], [420, 480], [540, 480], [660, 480], [440, 640], [560, 640], [680, 640], [490, 800], [610, 800]]) asp(x, y);
};
// 24 term.26 cell: brick cells under a microscope
const sCell = (c: Ctx) => {
  ground(c); c.save(); c.beginPath(); ell(c, 540, 540, 460, 460); c.clip(); c.fillStyle = "#f9e6ee"; c.fillRect(0, 0, D, D);
  for (let row = 0; row < 7; row++) for (let col = -1; col < 5; col++) { const x = 80 + col * 270 + (row % 2) * 135, y = 90 + row * 130; shape(c, () => rrect(c, x, y, 250, 112, 14), "#f4cfe0", 5); c.beginPath(); ell(c, x + 90 + (row % 3) * 20, y + 56, 20, 16); c.fillStyle = COL.purple; c.fill(); }
  c.restore(); c.beginPath(); ell(c, 540, 540, 460, 460); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
};
// 25 term.27 botanist: a grown-up with a lens over a flowering plant
const sBotanist = (c: Ctx) => {
  ground(c); shadow(c, 560, 960, 460, 36); shape(c, () => rrect(c, -10, 940, D + 20, 160, 0), COL.green, 0); line(c, [[-10, 940], [D + 10, 940]], 6);
  const h = 760, x = 300, y = 940; const sx = x + h * 0.11, sy = y - h * 0.74 + h * 0.03, a1 = 0.05, a2 = -0.35, l1 = h * 0.17, l2 = h * 0.16;
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1, wx = ex + Math.cos(a2) * l2, wy = ey + Math.sin(a2) * l2;
  stemLine(c, [[800, 960], [800, 560]], 14); leaf(c, 800, 800, 130, -2.5, COL.leaf); leaf(c, 800, 720, 130, -0.6, COL.leaf);
  for (const [fx, fy] of [[800, 520], [740, 600], [870, 610]]) { for (let k = 0; k < 6; k++) { const a = (k * PI) / 3; shape(c, () => ell(c, fx + Math.cos(a) * 34, fy + Math.sin(a) * 34, 24, 16, a), k % 2 ? COL.pink : "#f7b6cb", 4); } shape(c, () => ell(c, fx, fy, 16, 16), COL.yellow, 4); }
  person(c, x, y, h, { adult: true, armR: [a1, a2], armL: [PI * 0.55, PI * 0.5] });
  line(c, [[wx, wy], [wx + 90, wy - 40]], 18, INK); line(c, [[wx, wy], [wx + 90, wy - 40]], 9, COL.woodDk);
  shape(c, () => ell(c, wx + 160, wy - 70, 80, 80), "rgba(214,236,250,0.7)", 10);
};
export const ic_plantsPlantPartsL3 = cards("sci.plants.plant-parts.L3 cards", [sSummary, sE1, sE2, sE3, sE4, sA1, sA3, sA5, sC2, sRoot, sStem, sShape, sTap, sFib, sHair, sStore, sTuber, sNode, sBulb, sTwine, sBreath, sStoma, sChloro, sSpine, sCell, sBotanist]);
