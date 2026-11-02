import type { Ctx } from "./core";
import {
  COL, INK, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards, rnd, leaf, glass, bowl,
} from "./flatKit";

// Cards for sci.ecology.cycles-and-decomposers.L3: one idea per picture, flat DeepKids look.
const MOULD = "#7f9a5a", MOULD_DK = "#566f3c", CREAM = "#fff6e0", THREAD = "#fffaf0";
const ST = (c: Ctx, g: () => void, col: string, dk: string, dx = 8, dy = 8, w = 6) => { shape(c, g, col, w); shade(c, g, dk, dx, dy); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string, w = 3) => shape(c, () => ell(c, x, y, r, r), col, w);

// thin white fungus threads branching out from (x, y); outlined so they read on any ground
const threads = (c: Ctx, x: number, y: number, an: number, len: number, w: number, r: () => number, depth: number) => {
  const x2 = x + Math.cos(an) * len, y2 = y + Math.sin(an) * len, mx = (x + x2) / 2 + (r() - 0.5) * len * 0.3, my = (y + y2) / 2 + (r() - 0.5) * len * 0.3;
  const p = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, x2, y2); };
  c.lineCap = "round"; p(); c.strokeStyle = INK; c.lineWidth = w + 4; c.stroke(); p(); c.strokeStyle = THREAD; c.lineWidth = w; c.stroke();
  if (depth > 0) { threads(c, x2, y2, an + 0.5 + r() * 0.3, len * 0.72, w * 0.85, r, depth - 1); threads(c, x2, y2, an - 0.5 - r() * 0.3, len * 0.72, w * 0.85, r, depth - 1); if (r() > 0.5) threads(c, mx, my, an + (r() - 0.5) * 2, len * 0.5, w * 0.7, r, depth - 1); }
};

const mushroom = (c: Ctx, x: number, y: number, s: number, cap: string = COL.red, spots = true) => {
  const stem = () => rrect(c, x - 34 * s, y - 150 * s, 68 * s, 150 * s, 24 * s);
  shadow(c, x + 30 * s, y + 4, 110 * s, 16 * s);
  ST(c, stem, CREAM, "#e3d3b0", 18 * s, 0);
  const r = 130 * s, cy = y - 140 * s, g = () => { c.moveTo(x - r, cy); c.bezierCurveTo(x - r, cy - r * 1.15, x + r, cy - r * 1.15, x + r, cy); c.quadraticCurveTo(x, cy + r * 0.3, x - r, cy); c.closePath(); };
  ST(c, g, cap, "#b53a28", r * 0.3, r * 0.15);
  if (spots) [[-0.45, -0.55, 0.16], [0.1, -0.78, 0.13], [0.5, -0.4, 0.15], [-0.05, -0.35, 0.1]].forEach(([a, b, k]) => dot(c, x + a * r, cy + b * r, k * r, WHITE, 3));
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  ST(c, () => ell(c, x, y, r, r), COL.yellow, COL.orange, r * 0.2, r * 0.2);
};
const drop = (c: Ctx, x: number, y: number, s: number) => {
  const g = () => { c.moveTo(x, y - 60 * s); c.bezierCurveTo(x + 18 * s, y - 20 * s, x + 46 * s, y + 6 * s, x + 46 * s, y + 24 * s); c.arc(x, y + 24 * s, 46 * s, 0, Math.PI); c.bezierCurveTo(x - 46 * s, y + 6 * s, x - 18 * s, y - 20 * s, x, y - 60 * s); c.closePath(); };
  ST(c, g, COL.water, COL.waterDk, 10 * s, 6 * s); shine(c, [[x - 22 * s, y + 6 * s], [x - 22 * s, y + 26 * s]], 7);
};
const swirl = (c: Ctx, x: number, y: number, s: number) => {
  for (const [dy, a] of [[-40, 0], [0, 1], [40, 2]] as const) { c.beginPath(); c.moveTo(x - 60 * s, y + dy * s); c.bezierCurveTo(x - 20 * s, y + (dy - 26) * s, x + 20 * s, y + (dy + 26) * s, x + 56 * s, y + dy * s); c.bezierCurveTo(x + 76 * s, y + (dy - 14) * s, x + 70 * s, y + (dy - 38) * s, x + 46 * s, y + (dy - 30) * s); c.strokeStyle = INK; c.lineWidth = 11 * s; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.sky; c.lineWidth = 6 * s; c.stroke(); void a; }
};
const dryLeaf = (c: Ctx, x: number, y: number, len: number, an: number, col = COL.orange) => leaf(c, x, y, len, an, col);
const peel = (c: Ctx, x: number, y: number, s: number, col: string, dk: string) => {
  const g = () => { c.moveTo(x - 120 * s, y - 10 * s); c.quadraticCurveTo(x, y + 120 * s, x + 120 * s, y - 20 * s); c.quadraticCurveTo(x + 60 * s, y + 20 * s, x, y + 22 * s); c.quadraticCurveTo(x - 70 * s, y + 20 * s, x - 120 * s, y - 10 * s); c.closePath(); };
  ST(c, g, col, dk, 12 * s, 8 * s);
  shape(c, () => rrect(c, x + 100 * s, y - 36 * s, 34 * s, 28 * s, 8 * s), dk, 5);
};
const soilBed = (c: Ctx, y0: number, y1 = 1080) => {
  shape(c, () => rrect(c, -20, y0, 1120, y1 - y0 + 40, 0), COL.soil, 6);
  const r = rnd(5); for (let i = 0; i < 40; i++) { const x = r() * 1080, y = y0 + 25 + r() * (y1 - y0 - 40); c.beginPath(); ell(c, x, y, 5 + r() * 6, 4 + r() * 3); c.fillStyle = COL.soilDk; c.fill(); }
};
const grass = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y - 36, 1120, 52, 0), COL.green, 6); const r = rnd(9); for (let x = 10; x < 1080; x += 34) line(c, [[x, y - 34], [x + (r() - 0.5) * 14, y - 60 - r() * 16]], 7, COL.greenDk); };
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.95, r * 0.17);
  ST(c, () => ell(c, x, y, r, r * 0.88), COL.red, "#b53a28", r * 0.25, r * 0.2);
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.4, y - r * 0.6]], 10);
  for (let i = 0; i < 5; i++) leaf(c, x, y - r * 0.82, r * 0.38, -Math.PI / 2 + (i - 2) * 0.7, COL.leaf);
};
const breadSlice = (c: Ctx, x: number, y: number, s: number, mould = true) => {
  const g = () => { c.moveTo(x - 200 * s, y - 120 * s); c.bezierCurveTo(x - 260 * s, y - 230 * s, x - 90 * s, y - 250 * s, x, y - 210 * s); c.bezierCurveTo(x + 90 * s, y - 250 * s, x + 260 * s, y - 230 * s, x + 200 * s, y - 120 * s); c.lineTo(x + 190 * s, y + 190 * s); c.lineTo(x - 190 * s, y + 190 * s); c.closePath(); };
  shadow(c, x + 30 * s, y + 200 * s, 230 * s, 20 * s);
  ST(c, g, COL.brown, COL.soil, 16 * s, 0);
  const g2 = () => { c.moveTo(x - 165 * s, y - 112 * s); c.bezierCurveTo(x - 220 * s, y - 200 * s, x - 80 * s, y - 215 * s, x, y - 180 * s); c.bezierCurveTo(x + 80 * s, y - 215 * s, x + 220 * s, y - 200 * s, x + 165 * s, y - 112 * s); c.lineTo(x + 158 * s, y + 158 * s); c.lineTo(x - 158 * s, y + 158 * s); c.closePath(); };
  shape(c, g2, "#f3dcae", 4);
  if (mould) { const m = () => { c.moveTo(x - 30 * s, y - 60 * s); c.bezierCurveTo(x - 90 * s, y - 40 * s, x - 100 * s, y + 40 * s, x - 40 * s, y + 70 * s); c.bezierCurveTo(x + 10 * s, y + 110 * s, x + 90 * s, y + 80 * s, x + 90 * s, y + 20 * s); c.bezierCurveTo(x + 120 * s, y - 40 * s, x + 50 * s, y - 90 * s, x - 30 * s, y - 60 * s); c.closePath(); }; ST(c, m, MOULD, MOULD_DK, 10 * s, 8 * s, 5); const r = rnd(4); for (let i = 0; i < 14; i++) dot(c, x - 60 * s + r() * 140 * s, y - 40 * s + r() * 100 * s, 6 * s + r() * 5 * s, "#e9f0d8", 2); }
};
const worm = (c: Ctx, pts: number[][], w: number) => {
  line(c, pts, w + 10, INK); line(c, pts, w, "#e58f93");
  line(c, pts.map(([x, y]) => [x + w * 0.12, y + w * 0.18]), w * 0.35, "#c9686f");
  const [x, y] = pts[0]; void x; void y;
};
const wormRings = (c: Ctx, pts: number[][], w: number) => { for (let i = 1; i < pts.length - 1; i++) { const [a, b] = [pts[i - 1], pts[i + 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, [x, y] = pts[i]; line(c, [[x - Math.cos(an) * w * 0.45, y - Math.sin(an) * w * 0.45], [x + Math.cos(an) * w * 0.45, y + Math.sin(an) * w * 0.45]], 4, "#b25a62"); } };
const pot = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.orange, dk: string = "#c9742a") => {
  shadow(c, x + w * 0.1, y + 8, w * 0.65, w * 0.1);
  const g = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.36, y); c.lineTo(x - w * 0.36, y); c.closePath(); };
  ST(c, g, col, dk, w * 0.12, 0);
  ST(c, () => rrect(c, x - w * 0.56, y - h - 34, w * 1.12, 40, 12), col, dk, 14, 0);
};
const clock = (c: Ctx, x: number, y: number, r: number, frac: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r - 6, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); c.closePath(); c.fillStyle = COL.orange; c.fill();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  line(c, [[x, y], [x, y - r * 0.7]], 6); line(c, [[x, y], [x + r * 0.45 * Math.cos(-Math.PI / 2 + frac * Math.PI * 2), y + r * 0.45 * Math.sin(-Math.PI / 2 + frac * Math.PI * 2)]], 6);
};
const iconCircle = (c: Ctx, x: number, y: number, r: number, fill: string = WHITE) => { shadow(c, x + r * 0.12, y + r * 0.95, r * 0.9, r * 0.14); shape(c, () => ell(c, x, y, r, r), fill, 6); };
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string = COL.water) => {
  // a 2-litre style bottle: body, shoulder, neck; bottom centre (x, y)
  const neckH = h * 0.14, shoulder = h * 0.16, nw = w * 0.16, g = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h + neckH + shoulder); c.quadraticCurveTo(x - w / 2, y - h + neckH + shoulder * 0.2, x - nw, y - h + neckH); c.lineTo(x - nw, y - h); c.lineTo(x + nw, y - h); c.lineTo(x + nw, y - h + neckH); c.quadraticCurveTo(x + w / 2, y - h + neckH + shoulder * 0.2, x + w / 2, y - h + neckH + shoulder); c.lineTo(x + w / 2, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  shape(c, g, COL.glass, 0);
  if (fill > 0) { c.save(); c.beginPath(); g(); c.clip(); c.fillStyle = liquid; c.fillRect(x - w, y - h * fill, w * 2, h * fill + 10); c.restore(); }
  shape(c, g, "rgba(0,0,0,0)", 6);
  shine(c, [[x - w * 0.36, y - h * 0.62], [x - w * 0.36, y - h * 0.2]], 8);
};

// 0 term.1 Decompose: a banana peel fresh, soft, nearly gone
const decompose = (c: Ctx) => {
  ground(c); soilBed(c, 760, 1080);
  peel(c, 190, 640, 1.15, COL.yellow, COL.orange);
  const b = rnd(2); peel(c, 540, 650, 1.15, "#9c6a35", "#6a4128"); for (let i = 0; i < 9; i++) dot(c, 430 + b() * 220, 600 + b() * 60, 8 + b() * 6, "#5a3a22", 2);
  const mound = () => { c.moveTo(730, 770); c.bezierCurveTo(770, 510, 980, 510, 1030, 770); c.closePath(); };
  ST(c, mound, COL.soilDk, "#4a2d1a", 14, 0);
  const g = rnd(8); for (let i = 0; i < 14; i++) dot(c, 790 + g() * 200, 700 + g() * 50, 5 + g() * 4, COL.soil, 0);
  shape(c, () => ell(c, 900, 600, 40, 14, 0.3), "#9c6a35", 4);
  arrow(c, [[290, 420], [430, 420]]); arrow(c, [[640, 420], [780, 420]]);
};
// 1 term.4 Spore
const spore = (c: Ctx) => {
  ground(c); mushroom(c, 440, 820, 1.75);
  const r = rnd(6);
  for (let i = 0; i < 46; i++) { const t = r(); dot(c, 330 + t * 330 + r() * 90, 760 + t * 180 + r() * 90 - 40, 6 + r() * 5, "#d9b98c", 3); }
  for (let i = 0; i < 24; i++) dot(c, 700 + r() * 300, 700 + r() * 280, 6 + r() * 5, "#d9b98c", 3);
};
// 2 term.5 Hyphae
const hyphae = (c: Ctx) => {
  ground(c); breadSlice(c, 520, 520, 2.0, true);
  c.save(); c.beginPath(); ell(c, 540, 470, 280, 280); c.clip(); c.fillStyle = "#c8d6a8"; c.fillRect(0, 0, 1080, 1080);
  const r = rnd(12); for (let i = 0; i < 9; i++) threads(c, 540 + (r() - 0.5) * 340, 470 + (r() - 0.5) * 340, r() * 6.28, 130 + r() * 50, 11, r, 3);
  c.restore();
  c.beginPath(); ell(c, 540, 470, 280, 280); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  line(c, [[740, 670], [930, 880]], 46, INK); line(c, [[740, 670], [930, 880]], 30, COL.wood);
};
// 3 term.6 Mycelium
const mycelium = (c: Ctx) => {
  ground(c, "#e7f1fb"); soilBed(c, 470, 1080); grass(c, 470);
  const r = rnd(21);
  c.save(); c.beginPath(); c.rect(0, 490, 1080, 600); c.clip();
  for (let i = 0; i < 11; i++) threads(c, 540, 520, 0.2 + (i / 10) * 2.75, 170 + r() * 60, 10, r, 3);
  c.restore();
  mushroom(c, 540, 450, 1.3);
};
// 4 term.7 Bacteria
const bacteria = (c: Ctx) => {
  ground(c); shape(c, () => ell(c, 540, 540, 430, 430), "#e8e0f4", 16);
  const r = rnd(33), spot: number[][] = [];
  const free = (x: number, y: number, k: number) => spot.every(([a, b, q]) => Math.hypot(a - x, b - y) > q + k + 14);
  for (let i = 0; i < 400 && spot.length < 36; i++) { const an = r() * 6.28, d = Math.sqrt(r()) * 350, x = 540 + Math.cos(an) * d, y = 540 + Math.sin(an) * d, rod = spot.length % 3 !== 2, k = rod ? 50 : 20; if (!free(x, y, k)) continue; spot.push([x, y, k]);
    if (rod) { const rot = r() * 3.14; c.save(); c.translate(x, y); c.rotate(rot); const g = () => rrect(c, -44, -17, 88, 34, 17); ST(c, g, COL.teal, COL.tealDk, 5, 7, 5); c.restore(); } else dot(c, x, y, 20, COL.pink, 5); }
};
// 5 term.9 Worm casts
const casts = (c: Ctx) => {
  ground(c); shape(c, () => ell(c, 540, 700, 480, 250), COL.green, 6);
  const r = rnd(15); for (let i = 0; i < 26; i++) { const x = 140 + r() * 800, y = 600 + r() * 190; if (((x - 540) / 470) ** 2 + ((y - 700) / 240) ** 2 < 1) line(c, [[x, y], [x + (r() - 0.5) * 14, y - 22 - r() * 12]], 6, COL.greenDk); }
  shadow(c, 360, 790, 200, 26);
  const heap = [[360, 740, 160, 54], [370, 690, 125, 46], [350, 645, 92, 40], [362, 604, 58, 32]];
  heap.forEach(([x, y, a, b]) => ST(c, () => ell(c, x, y, a, b), COL.soil, COL.soilDk, 14, 10));
  line(c, [[300, 745], [350, 770], [420, 748]], 5, COL.soilDk); line(c, [[320, 690], [372, 710], [420, 690]], 5, COL.soilDk);
  shape(c, () => ell(c, 730, 740, 96, 42), "#2a1a12", 6);
  const w = [[740, 740], [735, 690], [725, 640], [736, 590]];
  shape(c, () => ell(c, 730, 748, 70, 24), "#2a1a12", 0);
  worm(c, w, 40); wormRings(c, w, 40);
  c.save(); c.beginPath(); c.rect(600, 740, 300, 100); c.restore();
};
// 6 term.10 Compost
const compost = (c: Ctx) => {
  ground(c); pot(c, 780, 1010, 330, 250);
  ST(c, () => ell(c, 780, 775, 150, 28), COL.soilDk, "#4a2d1a", 10, 0);
  line(c, [[780, 780], [780, 610]], 12, INK); line(c, [[780, 780], [780, 610]], 6, COL.greenDk);
  [[-2.3, 90], [-0.8, 90], [-2.8, 70], [-0.3, 70], [-1.6, 90]].forEach(([a, l], i) => leaf(c, 780, 670 + i * 18, l * 1.3, a, COL.leaf));
  line(c, [[200, 270], [420, 470]], 30, INK); line(c, [[200, 270], [420, 470]], 18, COL.wood);
  const blade = () => polyP(c, [[400, 420], [470, 520], [640, 640], [660, 610], [570, 480], [490, 410]]);
  ST(c, blade, COL.steel, COL.steelDk, 10, 10);
  const h = () => { c.moveTo(430, 440); c.bezierCurveTo(470, 360, 560, 380, 580, 470); c.lineTo(540, 560); c.closePath(); };
  ST(c, h, COL.soilDk, "#4a2d1a", 10, 8);
  hand(c, 110, 190, 0.8, 1.6);
  const r = rnd(7); for (let i = 0; i < 5; i++) dot(c, 700 + r() * 30, 620 + i * 30, 11, COL.soilDk, 3);
  arrow(c, [[690, 650], [730, 735]]);
};
// 7 term.11 Nutrients
const nutrients = (c: Ctx) => {
  ground(c, "#e7f1fb"); soilBed(c, 430, 1080); grass(c, 430);
  line(c, [[540, 430], [540, 230]], 22, INK); line(c, [[540, 430], [540, 230]], 12, COL.leaf);
  [[-0.5, 150], [-2.6, 150], [-1.2, 110], [-1.95, 110]].forEach(([a, l]) => leaf(c, 540, 330 - (l < 130 ? 90 : 0), l, a, COL.leaf));
  const roots: number[][][] = [[[540, 440], [490, 560], [430, 700], [400, 780]], [[540, 440], [590, 570], [650, 690], [690, 780]], [[540, 440], [540, 600], [530, 760], [540, 850]], [[490, 560], [380, 590], [320, 600]], [[590, 570], [700, 590], [770, 580]]];
  roots.forEach((p) => { line(c, p, 22, INK); line(c, p, 11, "#f1e2c5"); });
  const cols = [COL.yellow, COL.pink, COL.blue, COL.orange, "#c9f06b"];
  [[250, 700], [200, 880], [800, 760], [870, 900], [330, 960], [700, 960], [260, 540], [820, 560], [560, 990]].forEach(([x, y], i) => dot(c, x, y, 16, cols[i % 5], 4));
  arrow(c, [[250, 730], [330, 760], [385, 790]], RED, 8); arrow(c, [[800, 790], [740, 790], [700, 790]], RED, 8); arrow(c, [[330, 930], [420, 880], [500, 840]], RED, 8); arrow(c, [[700, 930], [620, 890], [570, 850]], RED, 8);
};
// 8 term.12 Preserve
const preserve = (c: Ctx) => {
  ground(c, "#e7f1fb"); sun(c, 880, 170, 80);
  const cloth = () => polyP(c, [[110, 520], [900, 520], [1020, 940], [20, 940]]);
  shadow(c, 520, 960, 520, 30); shape(c, cloth, "#f7f3e8", 6); shade(c, cloth, "#e4dccb", 20, 18);
  const r = rnd(3);
  for (let row = 0; row < 3; row++) for (let k = 0; k < 4 - 0; k++) { const y = 590 + row * 125, t = (y - 520) / 420, left = 110 - 90 * t, wd = 790 + 100 * t, x = left + (k + 0.5) * wd / 4, rx = 52 + t * 26, ry = rx * 0.55; ST(c, () => ell(c, x, y, rx, ry), WHITE, "#e6dfd0", 8, 6, 5); for (let q = 0; q < 5; q++) dot(c, x - rx * 0.5 + r() * rx, y - ry * 0.4 + r() * ry * 0.8, 3, "#cdbf9d", 0); }
};
// 9 expl.3 What decomposers need
const needs = (c: Ctx) => {
  ground(c);
  const xs = [150, 400, 650, 900];
  xs.forEach((x) => iconCircle(c, x, 230, 108, "#fff6e0"));
  leaf(c, 150, 290, 130, -1.2, COL.leaf); leaf(c, 150, 290, 100, -2.2, COL.greenLt);
  drop(c, 400, 235, 1.2); sun(c, 650, 230, 46); swirl(c, 900, 232, 0.85);
  breadSlice(c, 540, 760, 1.0, true);
  xs.forEach((x) => arrow(c, [[x, 360], [540 + (x - 525) * 0.3, 540]], RED, 8));
};
// shelf with jar, tin, chillies, salt
const shelf = (c: Ctx, y: number, s: number, x0 = 0) => {
  const X = (x: number) => x0 + x * s;
  shape(c, () => rrect(c, X(60), y, 960 * s, 36 * s, 6), COL.wood, 6); shade(c, () => rrect(c, X(60), y, 960 * s, 36 * s, 6), COL.woodDk, 0, 14 * s);
  // jar of pickle
  const jx = X(220), jh = 250 * s, jw = 190 * s;
  shape(c, () => rrect(c, jx - jw / 2, y - jh, jw, jh, 34 * s), COL.glass, 6);
  c.save(); c.beginPath(); rrect(c, jx - jw / 2, y - jh * 0.78, jw, jh * 0.78, 30 * s); c.clip(); c.fillStyle = "#e8a23a"; c.fillRect(jx - jw, y - jh * 0.78, jw * 2, jh); c.restore();
  const r = rnd(2); for (let i = 0; i < 9; i++) shape(c, () => rrect(c, jx - jw * 0.38 + (i % 3) * jw * 0.26, y - jh * 0.7 + Math.floor(i / 3) * jh * 0.22, jw * 0.2, jh * 0.14, 6 * s), "#d35a2b", 3 + 0 * r());
  shape(c, () => rrect(c, jx - jw / 2, y - jh, jw, jh, 34 * s), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, jx - jw * 0.5, y - jh - 38 * s, jw, 44 * s, 10 * s), COL.red, 6);
  // tin
  const tx = X(470), tw = 200 * s, th = 190 * s;
  ST(c, () => rrect(c, tx - tw / 2, y - th, tw, th, 14 * s), COL.steel, COL.steelDk, 16 * s, 0);
  ST(c, () => rrect(c, tx - tw * 0.54, y - th - 30 * s, tw * 1.08, 40 * s, 12 * s), COL.steelIn, COL.steelDk, 12 * s, 0);
  // salt bowl
  const bx = X(730);
  shape(c, () => { c.moveTo(bx - 110 * s, y - 70 * s); c.bezierCurveTo(bx - 100 * s, y + 4 * s, bx + 100 * s, y + 4 * s, bx + 110 * s, y - 70 * s); c.closePath(); }, COL.teal, 6);
  shape(c, () => { c.moveTo(bx - 98 * s, y - 70 * s); c.bezierCurveTo(bx - 70 * s, y - 150 * s, bx + 70 * s, y - 150 * s, bx + 98 * s, y - 70 * s); c.closePath(); }, WHITE, 5);
  shape(c, () => ell(c, bx, y - 70 * s, 110 * s, 18 * s), "rgba(255,255,255,0.0)", 6);
  // chillies on a string hanging from the wall
  const cx = X(920); line(c, [[cx, y - 330 * s], [cx, y - 20 * s]], 6, INK);
  for (let i = 0; i < 5; i++) { const yy = y - 300 * s + i * 56 * s, sg = i % 2 ? 1 : -1; shape(c, () => { c.moveTo(cx, yy); c.quadraticCurveTo(cx + sg * 60 * s, yy + 10 * s, cx + sg * 36 * s, yy + 80 * s); c.quadraticCurveTo(cx + sg * 10 * s, yy + 40 * s, cx, yy); c.closePath(); }, COL.red, 5); }
};
// 10 expl.4
const keepers = (c: Ctx) => { ground(c, "#f5ecd8"); shelf(c, 800, 1.0); };
// node helper for the cycle
const cycle = (c: Ctx) => {
  ground(c);
  const R = 150, P: [number, number][] = [[540, 190], [870, 540], [540, 890], [210, 540]];
  // arrows on the circle between nodes
  const arc = (a0: number, a1: number) => { const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const a = a0 + (a1 - a0) * i / 12; pts.push([540 + Math.cos(a) * 350, 540 + Math.sin(a) * 350]); } arrow(c, pts, RED, 11); };
  arc(-Math.PI / 2 + 0.45, -0.38); arc(0.45, Math.PI / 2 - 0.45); arc(Math.PI / 2 + 0.45, Math.PI - 0.45); arc(Math.PI + 0.45, Math.PI * 1.5 - 0.45);
  P.forEach(([x, y]) => iconCircle(c, x, y, R));
  const [t, r, b, l] = P;
  // top: leaf on a twig
  line(c, [[t[0] - 110, t[1] + 60], [t[0] + 20, t[1] + 20]], 14, COL.brown); leaf(c, t[0] + 20, t[1] + 20, 120, -0.9, COL.leaf); leaf(c, t[0] + 20, t[1] + 20, 90, -2.0, COL.greenLt);
  // right: a dry leaf falling onto the ground, soil below
  shape(c, () => ell(c, r[0], r[1] + 80, 120, 28), COL.soil, 5); leaf(c, r[0] - 70, r[1] + 20, 130, -0.35, COL.orange); arrow(c, [[r[0] + 70, r[1] - 100], [r[0] + 70, r[1] - 20]], RED, 7);
  // bottom: earthworm and a mushroom in the soil
  shape(c, () => ell(c, b[0], b[1] + 70, 125, 36), COL.soil, 5);
  mushroom(c, b[0] + 50, b[1] + 70, 0.5); const w = [[b[0] - 110, b[1] + 50], [b[0] - 70, b[1] + 20], [b[0] - 20, b[1] + 50], [b[0] + 10, b[1] + 20]]; worm(c, w, 18);
  // left: a young plant with its roots in the soil
  shape(c, () => ell(c, l[0], l[1] + 60, 110, 26), COL.soil, 5); line(c, [[l[0], l[1] + 60], [l[0], l[1] - 40]], 10, COL.leafDk); leaf(c, l[0], l[1] - 20, 80, -0.4, COL.leaf); leaf(c, l[0], l[1] - 20, 80, -2.7, COL.leaf); leaf(c, l[0], l[1] - 40, 70, -1.57, COL.greenLt);
  line(c, [[l[0], l[1] + 70], [l[0] - 30, l[1] + 110]], 8, "#f1e2c5");
};
// 12 expl.7 earthworm at a burrow with a leaf
const burrow = (c: Ctx) => {
  ground(c); shape(c, () => ell(c, 540, 760, 500, 260), COL.soil, 6);
  const r = rnd(4); for (let i = 0; i < 30; i++) { const x = 140 + r() * 800, y = 640 + r() * 250; if (((x - 540) / 480) ** 2 + ((y - 760) / 250) ** 2 < 1) dot(c, x, y, 6 + r() * 6, COL.soilDk, 0); }
  shape(c, () => ell(c, 400, 700, 120, 46), "#2a1a12", 6);
  shadow(c, 700, 850, 240, 30);
  leaf(c, 900, 840, 520, -2.62, COL.orange);
  const w = [[400, 700], [390, 620], [400, 540], [450, 480]];
  worm(c, w, 56); wormRings(c, w, 56);
  shape(c, () => ell(c, 470, 472, 36, 32), "#e58f93", 6);
  dot(c, 468, 456, 5, INK, 0);
  line(c, [[480, 480], [500, 490]], 8, COL.orange);
};
// 13 expl.8 how long
const howLong = (c: Ctx) => {
  ground(c); soilBed(c, 560, 700);
  const xs = [150, 400, 670, 920];
  // papaya peel
  peel(c, xs[0], 520, 0.75, COL.orange, "#c9742a");
  // leaf
  leaf(c, xs[1] - 100, 540, 200, -0.2, COL.leaf);
  // twig
  line(c, [[xs[2] - 110, 560], [xs[2] + 110, 500]], 24, INK); line(c, [[xs[2] - 110, 560], [xs[2] + 110, 500]], 14, COL.brown); line(c, [[xs[2] + 20, 528], [xs[2] + 70, 450]], 16, INK); line(c, [[xs[2] + 20, 528], [xs[2] + 70, 450]], 8, COL.brown);
  // coconut shell half
  ST(c, () => { c.moveTo(xs[3] - 90, 560); c.bezierCurveTo(xs[3] - 90, 410, xs[3] + 90, 410, xs[3] + 90, 560); c.closePath(); }, "#7b4a2a", "#4a2d1a", 14, 8);
  [0, 1, 2, 3].forEach((i) => clock(c, xs[i], 880, 90, [0.1, 0.25, 0.6, 0.95][i]));
  [0, 1, 2, 3].forEach((i) => arrow(c, [[xs[i], 745], [xs[i], 780]], RED, 8));
};
// 14 flow.a1 Rot hunt
const rotHunt = (c: Ctx) => {
  ground(c); tomato(c, 600, 720, 270);
  const p = () => { c.moveTo(600, 620); c.bezierCurveTo(660, 580, 760, 630, 750, 720); c.bezierCurveTo(740, 800, 620, 790, 590, 720); c.closePath(); };
  ST(c, p, "#8a5a3c", "#6a4128", 8, 6, 5);
  const r = rnd(9); for (let i = 0; i < 12; i++) dot(c, 620 + r() * 110, 640 + r() * 130, 8 + r() * 7, "#d7e6c2", 2);
  line(c, [[210, 330], [480, 410]], 30, INK); line(c, [[210, 330], [480, 410]], 18, COL.wood);
  c.save(); c.beginPath(); ell(c, 690, 440, 190, 190); c.clip(); c.fillStyle = "#d1604a"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => ell(c, 690, 440, 120, 100), "#8a5a3c", 0);
  for (let i = 0; i < 8; i++) threads(c, 640 + (r() - 0.3) * 120, 420 + (r() - 0.3) * 120, r() * 6.28, 70 + r() * 30, 9, r, 2); c.restore();
  c.beginPath(); ell(c, 690, 440, 190, 190); c.lineWidth = 14; c.strokeStyle = INK; c.stroke();
  hand(c, 110, 300, 0.2, 1.4);
};
// 15 flow.a3 Kitchen keepers
const kitchenKeepers = (c: Ctx) => {
  ground(c, "#f5ecd8"); shelf(c, 300, 0.78, 110);
  person(c, 360, 1020, 580, { adult: true, armR: [-0.4, -0.9] });
  person(c, 700, 1020, 450, { armR: [-0.5, -0.7], armL: [Math.PI * 0.55, Math.PI * 0.5] });
};
// 16 flow.a4 Be the Recyclers
const recyclers = (c: Ctx) => {
  ground(c);
  person(c, 230, 1000, 700, { armR: [-0.7, -1.2], armL: [-0.7, -1.2] });
  leaf(c, 450, 330, 160, -0.9, COL.orange);
  const P: [number, number][] = [[740, 180], [740, 540], [740, 900]];
  P.forEach(([x, y]) => iconCircle(c, x, y, 120));
  const w = [[660, 200], [700, 150], [750, 200], [800, 150]]; worm(c, w, 22); wormRings(c, w, 22);
  mushroom(c, 740, 620, 0.65);
  line(c, [[740, 960], [740, 880]], 10, INK); line(c, [[740, 960], [740, 880]], 5, COL.leafDk); leaf(c, 740, 890, 80, -0.5, COL.leaf); leaf(c, 740, 890, 80, -2.65, COL.leaf);
  arrow(c, [[740, 320], [740, 395]], RED, 10); arrow(c, [[740, 690], [740, 750]], RED, 10); 
};
// 17 flow.a6 Draw the hidden fungus
const drawFungus = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(500, 540); c.rotate(-0.06);
  shadow(c, 20, 450, 400, 30); shape(c, () => rrect(c, -330, -420, 660, 840, 10), WHITE, 6);
  const P = "#4f4a5c";
  line(c, [[-330, 40], [330, 40]], 5, P);
  const stem = [[-24, 40], [-24, -80]]; line(c, [[-24, 40], [-24, -80]], 3, P); line(c, [[24, 40], [24, -80]], 4, P);
  void stem;
  c.beginPath(); c.moveTo(-110, -80); c.bezierCurveTo(-110, -210, 110, -210, 110, -80); c.quadraticCurveTo(0, -60, -110, -80); c.strokeStyle = P; c.lineWidth = 5; c.stroke();
  const r = rnd(5); c.save(); c.strokeStyle = P; for (let i = 0; i < 9; i++) { c.lineWidth = 4; c.beginPath(); let x = 0, y = 40, an = 0.3 + (i / 8) * 2.5; c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += Math.cos(an) * (70 + r() * 30); y += Math.sin(an) * (70 + r() * 30) * 0.9; an += (r() - 0.5) * 0.9; c.lineTo(x, y); } c.stroke(); } c.restore();
  c.restore();
  const mx = 820, my = 960; mushroom(c, mx, my, 0.8);
  line(c, [[760, 150], [980, 420]], 40, INK); line(c, [[760, 150], [980, 420]], 24, COL.yellow);
  shape(c, () => polyP(c, [[752, 140], [772, 130], [792, 170], [772, 190]]), "#f2c9a0", 5);
};
// 18 flow.e3 Balloon bottle
const balloonBottle = (c: Ctx) => {
  ground(c);
  const bx = [320, 760], by = 900, bw = 250, bh = 560;
  bottle(c, bx[0], by, bw, bh, 0.55); bottle(c, bx[1], by, bw, bh, 0.55);
  // peels in the left bottle
  const r = rnd(18); for (let i = 0; i < 9; i++) { const x = bx[0] - 80 + r() * 160, y = by - 40 - r() * 130; ST(c, () => rrect(c, x - 20, y - 10, 40, 22, 8), i % 3 ? COL.yellow : COL.orange, COL.woodDk, 5, 4, 4); }
  // balloons: round on the left, a limp one on the right
  const nx = bx[0], ny = by - bh;
  ST(c, () => ell(c, nx, ny - 170, 120, 138), COL.red, "#b53a28", 22, 18);
  shine(c, [[nx - 60, ny - 220], [nx - 40, ny - 260]], 10);
  shape(c, () => rrect(c, nx - 42, ny - 40, 84, 54, 10), COL.red, 5);
  const lx = bx[1]; shape(c, () => rrect(c, lx - 42, ny - 40, 84, 54, 10), COL.red, 5);
  shape(c, () => { c.moveTo(lx - 36, ny - 38); c.quadraticCurveTo(lx - 80, ny - 120, lx - 20, ny - 130); c.quadraticCurveTo(lx + 60, ny - 140, lx + 36, ny - 38); c.closePath(); }, COL.red, 5);
  [[bx[0] - 20, 560], [bx[0] + 50, 520]].forEach(([x, y]) => dot(c, x, y, 9, WHITE, 3));
  arrow(c, [[bx[0] + 190, 640], [bx[0] + 190, 480]]);
};
// 19 flow.p1 Bottle compost
const bottleCompost = (c: Ctx) => {
  ground(c); shape(c, () => ell(c, 540, 940, 330, 70), COL.steel, 6); shape(c, () => ell(c, 540, 930, 270, 50), COL.steelIn, 4);
  const x = 540, y = 920, w = 380, h = 700, g = () => rrect(c, x - w / 2, y - h, w, h, 30);
  shape(c, g, COL.glass, 0);
  c.save(); c.beginPath(); g(); c.clip();
  const layers: [number, string][] = [[0, COL.soil], [95, COL.orange], [165, "#a8c24a"], [235, COL.orange], [305, "#a8c24a"], [375, COL.soil]];
  layers.forEach(([o, col], i) => { const y0 = y - o - (i === 5 ? 120 : 100) , hh = i === 5 ? 120 : 100; c.fillStyle = col; c.fillRect(x - w, y0, w * 2, hh + 1); });
  const r = rnd(31); for (let i = 0; i < 40; i++) { const px = x - w / 2 + 20 + r() * (w - 40), py = y - 480 + r() * 460; dot(c, px, py, 5 + r() * 4, r() > 0.5 ? COL.soilDk : "#e8d27a", 0); }
  c.restore();
  shape(c, g, "rgba(0,0,0,0)", 6);
  for (const dx of [-110, 0, 110]) dot(c, x + dx, y - 14, 9, INK, 0);
  [[x - 60, 975], [x + 70, 985]].forEach(([a, b]) => drop(c, a, b, 0.28));
  // cloth over the top
  shape(c, () => polyP(c, [[x - 240, y - h - 40], [x + 240, y - h - 40], [x + 270, y - h + 40], [x - 270, y - h + 40]]), "#f7f3e8", 6);
  line(c, [[x - 262, y - h + 20], [x + 262, y - h + 20]], 8, COL.teal);
};
// 20 flow.c1 Balcony compost pot
const balconyPot = (c: Ctx) => {
  ground(c, "#e7f1fb");
  for (let i = 0; i < 8; i++) line(c, [[80 + i * 130, 120], [80 + i * 130, 560]], 14, INK);
  line(c, [[40, 140], [1040, 140]], 18, INK); line(c, [[40, 540], [1040, 540]], 18, INK);
  const x = 470, y = 980, w = 440, h = 560;
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.38, y); c.lineTo(x - w * 0.38, y); c.closePath(); };
  shadow(c, x + 40, y + 8, w * 0.6, 30);
  shape(c, body, "#f1ead9", 0);
  c.save(); c.beginPath(); body(); c.clip();
  const bands: [number, number, string][] = [[0, 150, COL.soil], [150, 130, COL.green], [280, 110, COL.soilDk], [390, 170, COL.orange]];
  bands.forEach(([o, hh, col]) => { c.fillStyle = col; c.fillRect(x - w, y - o - hh, w * 2, hh + 1); });
  const r = rnd(8); for (let i = 0; i < 24; i++) leaf(c, x - 180 + r() * 360, y - 420 + r() * 120, 60, r() * 6.28, i % 2 ? COL.orange : COL.woodDk);
  for (let i = 0; i < 12; i++) shape(c, () => rrect(c, x - 160 + r() * 320, y - 270 + r() * 110, 34, 18, 6), COL.yellow, 3);
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - w * 0.56, y - h - 34, w * 1.12, 40, 12), COL.steelDk, 6);
  for (const dx of [-100, 0, 100]) dot(c, x + dx, y - 16, 9, INK, 0);
  [[x - 200, y - 40], [x + 200, y - 40]].forEach(([a, b]) => dot(c, a, b, 9, INK, 0));
  // no flies
  const fx = 880, fy = 700; iconCircle(c, fx, fy, 100, WHITE);
  shape(c, () => ell(c, fx - 60, fy - 20, 26, 14, -0.6), COL.sky, 3); shape(c, () => ell(c, fx + 60, fy - 20, 26, 14, 0.6), COL.sky, 3);
  shape(c, () => ell(c, fx, fy + 6, 28, 38), COL.black, 4); dot(c, fx, fy - 40, 18, COL.black, 4);
  c.beginPath(); ell(c, fx, fy, 100, 100); c.lineWidth = 14; c.strokeStyle = RED; c.stroke(); line(c, [[fx - 70, fy - 70], [fx + 70, fy + 70]], 14, RED);
};
// 21 flow.c2 Keep a tomato fresh
const keepTomato = (c: Ctx) => {
  ground(c, "#f5ecd8");
  tomato(c, 540, 730, 240);
  iconCircle(c, 170, 190, 130); sun(c, 170, 190, 48);
  iconCircle(c, 910, 190, 130); const bx = 910; shape(c, () => { c.moveTo(bx - 80, 180); c.bezierCurveTo(bx - 70, 270, bx + 70, 270, bx + 80, 180); c.closePath(); }, COL.teal, 6); shape(c, () => { c.moveTo(bx - 70, 180); c.bezierCurveTo(bx - 45, 115, bx + 45, 115, bx + 70, 180); c.closePath(); }, WHITE, 5);
  iconCircle(c, 540, 170, 130); pot(c, 540, 250, 130, 100);
  arrow(c, [[260, 290], [340, 440]], RED, 9); arrow(c, [[820, 290], [740, 440]], RED, 9); arrow(c, [[540, 320], [540, 400]], RED, 9);
};
export const ic_ecologyCyclesAndDecomposersL3 = cards("sci.ecology.cycles-and-decomposers.L3 cards", [
  decompose, spore, hyphae, mycelium, bacteria, casts, compost, nutrients, preserve, needs, keepers, cycle, burrow, howLong, rotHunt, kitchenKeepers, recyclers, drawFungus, balloonBottle, bottleCompost, balconyPot, keepTomato,
]);
void COL; void SKIN; void CLOTH; void glass; void bowl;
