import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, D, BG, arrow, cards, ell, glass, ground, leaf, line, polyP, rnd, rrect, shade, shadow, shape, shine, seed } from "./flatKit";

// sci.seeds-and-life-cycles.plant-life-cycle.L3 · picture cards (flat DeepKids look; red arrows = change or movement)
const PI = Math.PI, ROOT = "#fff3dc", PETAL = "#f6e08a", PETALDK = "#e0c15c", TERRA = "#d9794a", TERRADK = "#b85c33";
const stem = (c: Ctx, pts: number[][], w: number, col: string = COL.green) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const rootL = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 7, INK); line(c, pts, w, ROOT); };
const soilBlock = (c: Ctx, y: number, x0 = -10, x1 = D + 10) => {
  shape(c, () => c.rect(x0, y, x1 - x0, D - y + 10), COL.soil, 0);
  const r = rnd(7); for (let i = 0; i < 30; i++) { c.beginPath(); ell(c, x0 + r() * (x1 - x0), y + 25 + r() * (D - y - 35), 7 + r() * 8, 5 + r() * 5); c.fillStyle = r() > 0.5 ? COL.soilDk : "#a06d4a"; c.fill(); }
  line(c, [[x0, y], [x1, y]], 7);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 44), y + Math.sin(a) * (r + 44)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const flower = (c: Ctx, x: number, y: number, R: number, n = 5, col = PETAL, dk = PETALDK, mid: string = COL.orange, rot = -PI / 2) => {
  for (let i = 0; i < n; i++) { const a = rot + (i * 2 * PI) / n, px = x + Math.cos(a) * R * 0.55, py = y + Math.sin(a) * R * 0.55, p = () => ell(c, px, py, R * 0.5, R * (n > 6 ? 0.2 : 0.37), a); shape(c, p, col, 5); shade(c, p, dk, R * 0.08, R * 0.08); }
  shape(c, () => ell(c, x, y, R * 0.24, R * 0.24), mid, 5);
};
const star = (c: Ctx, x: number, y: number, r: number, col: string = COL.leaf) => { for (let i = 0; i < 5; i++) leaf(c, x, y, r, -PI / 2 + (i * 2 * PI) / 5, col); };
const tomato = (c: Ctx, x: number, y: number, r: number, withStar = true) => {
  shadow(c, x + r * 0.15, y + r * 0.85, r * 0.9, r * 0.14);
  const p = () => ell(c, x, y, r, r * 0.88); shape(c, p, COL.red); shade(c, p, "#b83a28", r * 0.22, r * 0.18); shine(c, [[x - r * 0.6, y - r * 0.25], [x - r * 0.35, y - r * 0.6]], 8);
  if (withStar) star(c, x, y - r * 0.72, r * 0.42);
};
const spots = (c: Ctx, pts: number[][], rx: number, ry: number, col = "#fff3c4") => pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, rx, ry), col, 3));
const cutTomato = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 0.85, r * 0.95, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.red); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), "#f48a6e", 4);
  for (let i = 0; i < 4; i++) { const a = PI / 4 + (i * PI) / 2; const cx = x + Math.cos(a) * r * 0.42, cy = y + Math.sin(a) * r * 0.42; shape(c, () => ell(c, cx, cy, r * 0.3, r * 0.22, a), "#f7a98f", 3); spots(c, [[cx - 6, cy - 4], [cx + 8, cy + 4], [cx, cy + 9]], r * 0.06, r * 0.04); }
  line(c, [[x - r * 0.1, y - r * 0.1], [x + r * 0.1, y + r * 0.1]], 3);
};
const bhindiCut = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.12, y + r * 0.9, r, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.greenDk); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), "#cfe8a2", 4);
  for (let i = 0; i < 5; i++) { const a = -PI / 2 + (i * 2 * PI) / 5, cx = x + Math.cos(a) * r * 0.42, cy = y + Math.sin(a) * r * 0.42; shape(c, () => ell(c, cx, cy, r * 0.24, r * 0.2, a), "#e7f3c9", 3); spots(c, [[cx, cy]], r * 0.09, r * 0.09, WHITE); }
};
const peaPod = (c: Ctx, x: number, y: number, len: number, wd: number, peas = 5, open = true) => {
  const p = () => { c.moveTo(x - len / 2, y); c.quadraticCurveTo(x, y - wd * 1.2, x + len / 2, y - wd * 0.2); c.quadraticCurveTo(x, y + wd * 1.1, x - len / 2, y); c.closePath(); };
  shape(c, p, COL.leaf); shade(c, p, COL.leafDk, 0, wd * 0.35);
  if (open) { shape(c, () => ell(c, x, y - wd * 0.05, len * 0.43, wd * 0.5, -0.06), "#d6ecb0", 3); for (let i = 0; i < peas; i++) { const t = (i + 0.5) / peas; shape(c, () => ell(c, x - len * 0.38 + t * len * 0.76, y - wd * 0.05 - t * wd * 0.1, wd * 0.34, wd * 0.34), COL.greenLt, 4); } }
};
const mango = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, blush = "") => {
  const p = () => { c.moveTo(x - s, y); c.bezierCurveTo(x - s, y - s * 0.95, x + s * 0.6, y - s * 0.9, x + s * 1.1, y - s * 0.1); c.bezierCurveTo(x + s * 0.8, y + s * 0.95, x - s, y + s * 0.95, x - s, y); c.closePath(); };
  shadow(c, x + s * 0.2, y + s * 0.95, s * 0.9, s * 0.13); shape(c, p, col); shade(c, p, dk, s * 0.25, s * 0.2);
  if (blush) { c.save(); c.beginPath(); p(); c.clip(); c.beginPath(); ell(c, x - s * 0.7, y - s * 0.5, s * 0.6, s * 0.5); c.fillStyle = blush; c.globalAlpha = 0.7; c.fill(); c.restore(); c.globalAlpha = 1; shape(c, () => {}, "none", 0); line(c, [[x - s, y], [x - s, y]], 1); }
  shine(c, [[x - s * 0.5, y - s * 0.45], [x - s * 0.15, y - s * 0.65]], 9);
};
const jag = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.leaf) => {
  const pts: number[][] = [[0, 0]]; const n = 6;
  for (let i = 1; i <= n; i++) { const t = i / n, w = Math.sin(t * PI * 0.9 + 0.2) * len * 0.3; pts.push([t * len, -w * (i % 2 ? 1.15 : 0.8)]); }
  for (let i = n; i >= 1; i--) { const t = i / n, w = Math.sin(t * PI * 0.9 + 0.2) * len * 0.3; pts.push([t * len, w * (i % 2 ? 1.15 : 0.8)]); }
  c.save(); c.translate(x, y); c.rotate(an); shape(c, () => polyP(c, pts), col, 5); line(c, [[0, 0], [len * 0.85, 0]], 3, COL.leafDk); c.restore();
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 30, y + h + 6, w * 0.6, 22);
  shape(c, () => polyP(c, [[x - w / 2, y], [x + w / 2, y], [x + w * 0.4, y + h], [x - w * 0.4, y + h]]), TERRA); shade(c, () => polyP(c, [[x - w / 2, y], [x + w / 2, y], [x + w * 0.4, y + h], [x - w * 0.4, y + h]]), TERRADK, w * 0.18, 0);
  shape(c, () => ell(c, x, y, w / 2, 30), COL.soil, 6);
};
const glassBox = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 18), "#fff", 6); };
// mini stage pictures: centre (x, y), half-height s; ground at y + s
const mSeed = (c: Ctx, x: number, y: number, s: number) => seed(c, x, y + s * 0.6, s * 0.6, 0.4);
const mSprout = (c: Ctx, x: number, y: number, s: number) => { stem(c, [[x, y + s], [x, y + s * 0.1]], s * 0.14, COL.greenLt); leaf(c, x, y + s * 0.2, s * 0.8, -2.5, COL.leaf); leaf(c, x, y + s * 0.2, s * 0.8, -0.65, COL.leaf); };
const mPlant = (c: Ctx, x: number, y: number, s: number) => { stem(c, [[x, y + s], [x, y - s * 0.7]], s * 0.14); [0.5, 0, -0.5].forEach((k, i) => { leaf(c, x, y + s * k, s * (0.8 - i * 0.1), -2.6, COL.leaf); leaf(c, x, y + s * k, s * (0.8 - i * 0.1), -0.55, COL.leaf); }); };
const mBud = (c: Ctx, x: number, y: number, s: number) => { stem(c, [[x, y + s], [x, y - s * 0.3]], s * 0.14); leaf(c, x, y + s * 0.5, s * 0.7, -2.5); leaf(c, x, y + s * 0.5, s * 0.7, -0.6); shape(c, () => ell(c, x, y - s * 0.5, s * 0.28, s * 0.45), COL.pink, 5); star(c, x, y - s * 0.2, s * 0.32); };
const mFlower = (c: Ctx, x: number, y: number, s: number) => { stem(c, [[x, y + s], [x, y - s * 0.2]], s * 0.14); leaf(c, x, y + s * 0.5, s * 0.7, -2.5); leaf(c, x, y + s * 0.5, s * 0.7, -0.6); flower(c, x, y - s * 0.4, s * 0.62, 5, COL.yellow, COL.orange, COL.orange); };
const mWilted = (c: Ctx, x: number, y: number, s: number) => { stem(c, [[x, y + s], [x, y - s * 0.1], [x + s * 0.2, y - s * 0.4]], s * 0.14); [0, 1, 2, 3].forEach((i) => { const a = 0.6 + i * 0.7; shape(c, () => ell(c, x + s * 0.25 + Math.cos(a) * s * 0.25, y - s * 0.35 + Math.sin(a) * s * 0.25 + s * 0.15, s * 0.18, s * 0.3, a + PI / 2), "#c9a86a", 4); }); };
const mFruit = (c: Ctx, x: number, y: number, s: number) => { stem(c, [[x, y + s], [x, y - s * 0.3]], s * 0.12); leaf(c, x, y + s * 0.6, s * 0.7, -2.5); tomato(c, x + s * 0.1, y + s * 0.15, s * 0.6); };
const mDry = (c: Ctx, x: number, y: number, s: number) => { seed(c, x - s * 0.4, y + s * 0.7, s * 0.4, 0.3, false, COL.brown, COL.soilDk); seed(c, x + s * 0.4, y + s * 0.7, s * 0.4, -0.3, false, COL.brown, COL.soilDk); seed(c, x, y + s * 0.25, s * 0.4, 0.8, false, COL.brown, COL.soilDk); };
const mPodGreen = (c: Ctx, x: number, y: number, s: number) => { c.save(); c.translate(x, y); c.rotate(-0.5); peaPod(c, 0, 0, s * 2, s * 0.32, 4, false); c.restore(); };
const mPodBlack = (c: Ctx, x: number, y: number, s: number) => { c.save(); c.translate(x, y); c.rotate(-0.5); const p = () => { c.moveTo(-s, 0); c.quadraticCurveTo(0, -s * 0.5, s, -s * 0.05); c.quadraticCurveTo(0, s * 0.45, -s, 0); c.closePath(); }; shape(c, p, "#4a4048"); c.restore(); seed(c, x - s * 0.6, y + s * 0.8, s * 0.3, 0.3); seed(c, x - s * 0.1, y + s * 0.9, s * 0.3, -0.2); seed(c, x + s * 0.4, y + s * 0.8, s * 0.3, 0.5); };

// ---------- 0 e1: a flower with a red thread becomes a bhindi pod
const bhindiFlower = (c: Ctx, x: number, y: number, R: number) => {
  flower(c, x, y, R, 5, "#fbf0a8", PETALDK, "#8a2d3b");
};
const thread = (c: Ctx, x: number, y: number) => { line(c, [[x - 28, y - 4], [x + 28, y + 6]], 11, RED); line(c, [[x + 26, y + 6], [x + 50, y + 40]], 7, RED); line(c, [[x + 20, y + 8], [x + 24, y + 54]], 7, RED); };
const e1 = (c: Ctx) => {
  ground(c); soilBlock(c, 900);
  stem(c, [[250, 900], [250, 560], [255, 470]], 22); leaf(c, 250, 760, 190, -2.6); leaf(c, 250, 700, 170, -0.5);
  bhindiFlower(c, 255, 380, 150); thread(c, 250, 590);
  stem(c, [[800, 900], [800, 780], [800, 700]], 22); leaf(c, 800, 860, 190, -2.6); leaf(c, 800, 820, 170, -0.5);
  const pod = () => { c.moveTo(800, 700); c.bezierCurveTo(740, 600, 745, 420, 800, 250); c.bezierCurveTo(855, 420, 860, 600, 800, 700); c.closePath(); };
  shape(c, pod, COL.green); shade(c, pod, COL.greenDk, 22, 0); for (const dx of [-26, 0, 26]) line(c, [[800 + dx, 620], [800 + dx * 0.5, 330]], 4, COL.greenDk);
  star(c, 800, 700, 60); thread(c, 800, 770);
  arrow(c, [[440, 520], [560, 520]]);
};
// ---------- 1 e2: a tomato, a pea pod and a bhindi opened to show their seeds
const e2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 470, 70); shape(c, () => ell(c, 540, 600, 470, 270), COL.steel); shape(c, () => ell(c, 540, 595, 405, 225), COL.steelIn, 4);
  cutTomato(c, 330, 520, 130); bhindiCut(c, 770, 500, 105); peaPod(c, 560, 700, 400, 85, 6, true);
};
// ---------- 2 e3: a brush carries pollen from a male pumpkin flower to a female one
const e3 = (c: Ctx) => {
  ground(c); soilBlock(c, 920);
  stem(c, [[260, 920], [260, 740]], 22); leaf(c, 260, 860, 170, -0.5);
  shape(c, () => ell(c, 260, 660, 80, 62), COL.green); line(c, [[200, 640], [220, 690]], 4, COL.greenDk); line(c, [[260, 600], [260, 720]], 4, COL.greenDk); line(c, [[320, 640], [300, 690]], 4, COL.greenDk);
  flower(c, 260, 520, 175, 5, COL.yellow, COL.orange, COL.orange);
  stem(c, [[800, 920], [800, 560]], 14); leaf(c, 800, 820, 170, -2.6);
  flower(c, 800, 440, 165, 5, COL.yellow, COL.orange, "#d8741f"); for (const [x, y] of [[775, 425], [820, 440], [795, 468], [815, 410]]) shape(c, () => ell(c, x, y, 11, 8), "#ffe97a", 3);
  const hx = 560, hy = 190; line(c, [[hx + 250, hy - 90], [hx + 60, hy - 5]], 36, INK); line(c, [[hx + 250, hy - 90], [hx + 60, hy - 5]], 24, COL.wood);
  shape(c, () => { c.moveTo(hx + 60, hy - 5); c.quadraticCurveTo(hx - 20, hy - 70, hx - 90, hy - 5); c.quadraticCurveTo(hx - 20, hy + 60, hx + 60, hy - 5); c.closePath(); }, "#ffe97a");
  arrow(c, [[690, 420], [600, 330], [420, 330]]);
};
// ---------- 3 e4: leaf circles float in a glass in the sun, stay down in a dark cupboard
const e4 = (c: Ctx) => {
  ground(c); sun(c, 190, 150, 70);
  shape(c, () => rrect(c, 580, 260, 400, 660, 20), "#3a3050", 7);
  glass(c, 280, 880, 280, 440, 0.9); glass(c, 780, 880, 280, 440, 0.9);
  const disc = (x: number, y: number) => shape(c, () => ell(c, x, y, 26, 26), COL.leaf, 4);
  [[225, 480], [290, 470], [350, 485], [250, 520], [320, 525]].forEach(([x, y]) => disc(x, y));
  [[250, 460], [310, 455]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 7, 7), WHITE, 2));
  [[720, 850], [780, 855], [840, 850], [750, 820], [815, 815]].forEach(([x, y]) => disc(x, y));
};
// ---------- 4 a1: a hunt card with eight boxes
const a1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 960, 420, 30);
  shape(c, () => rrect(c, 110, 110, 860, 840, 26), COL.paper, 7);
  const icons = [mSeed, mSprout, mPlant, mBud, mFlower, mWilted, mFruit, mDry];
  icons.forEach((f, i) => { const bx = 160 + (i % 4) * 190, by = 200 + Math.floor(i / 4) * 370; shape(c, () => rrect(c, bx, by, 170, 330, 16), WHITE, 5); f(c, bx + 85, by + 165, 85); });
  line(c, [[420, 150], [660, 150]], 10, COL.grey);
};
// ---------- 5 a2: a paper-plate wheel with one window
const a2 = (c: Ctx) => {
  ground(c); const cx = 540, cy = 540, R = 370;
  shadow(c, cx + 20, cy + R * 0.95, R * 0.9, 40);
  shape(c, () => ell(c, cx, cy, R, R), "#fff", 7);
  for (let i = 0; i < 6; i++) { const a = -PI / 2 + (i - 0.5) * (PI / 3); line(c, [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 4, COL.grey); }
  const ic = [mFlower, mFruit, mDry, mSeed, mSprout, mPlant];
  ic.forEach((f, i) => { const a = -PI / 2 + i * (PI / 3); f(c, cx + Math.cos(a) * 250, cy + Math.sin(a) * 250, 62); });
  shape(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, R - 36, -PI / 2 + PI / 6, -PI / 2 - PI / 6 + 2 * PI); c.closePath(); }, COL.teal, 7);
  shade(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, R - 36, -PI / 2 + PI / 6, -PI / 2 - PI / 6 + 2 * PI); c.closePath(); }, COL.tealDk, 30, 20);
  shape(c, () => ell(c, cx, cy, 28, 28), RED, 6);
  const pts: number[][] = []; for (let a = -0.3; a <= 0.9; a += 0.12) pts.push([cx + Math.cos(a) * 440, cy + Math.sin(a) * 440]);
  arrow(c, pts);
};
// ---------- 6 a3: onion, money plant, potato
const e_root = (c: Ctx, x: number, y: number, dx: number, len: number) => rootL(c, [[x, y], [x + dx, y + len * 0.5], [x + dx * 1.4, y + len]], 8);
const a3 = (c: Ctx) => {
  ground(c);
  // onion on a glass
  glass(c, 180, 800, 230, 280, 0.7); [-40, -10, 25].forEach((d, i) => e_root(c, 180 + d, 530, d * 0.3, 120 + i * 20));
  stem(c, [[180, 360], [175, 250], [190, 190]], 16, COL.greenLt);
  const on = () => ell(c, 180, 440, 105, 90); shape(c, on, "#c0668a"); shade(c, on, "#9a4a6c", 25, 20); for (const dx of [-55, -20, 20, 55]) line(c, [[180 + dx, 365], [180 + dx * 1.1, 515]], 3, "#9a4a6c");
  // money plant in a bottle
  const bt = () => { c.moveTo(500, 440); c.lineTo(580, 440); c.lineTo(580, 520); c.quadraticCurveTo(650, 560, 650, 640); c.lineTo(650, 800); c.lineTo(430, 800); c.lineTo(430, 640); c.quadraticCurveTo(430, 560, 500, 520); c.closePath(); };
  shadow(c, 560, 806, 120, 18);
  stem(c, [[540, 720], [540, 330], [500, 250]], 12); leaf(c, 540, 400, 90, -2.7, COL.greenLt); leaf(c, 540, 330, 90, -0.4, COL.greenLt); leaf(c, 505, 260, 85, -1.9, COL.greenLt);
  shape(c, bt, COL.glass, 6); c.save(); c.beginPath(); bt(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.7; c.fillRect(420, 640, 240, 170); c.restore(); c.globalAlpha = 1; shape(c, bt, "rgba(0,0,0,0)", 6);
  [[-40, 40], [-10, 55], [30, 35]].forEach(([dx, dl]) => rootL(c, [[540, 700], [540 + dx, 700 + dl], [540 + dx * 1.3, 745 + dl * 0.5]], 7)); shine(c, [[455, 640], [455, 760]], 7);
  // potato on a saucer
  shadow(c, 900, 805, 140, 24); shape(c, () => ell(c, 900, 780, 135, 30), COL.steel, 5);
  [[-50, -30, -2.0], [20, -50, -1.6], [60, -20, -1.2]].forEach(([dx, dy, an]) => { const x = 900 + dx, y = 690 + dy; stem(c, [[x, y], [x + Math.cos(an) * 90, y + Math.sin(an) * 90]], 14, "#c5e08e"); shape(c, () => ell(c, x + Math.cos(an) * 95, y + Math.sin(an) * 95, 13, 13), COL.greenLt, 4); });
  const po = () => ell(c, 900, 710, 120, 80, 0.1); shape(c, po, "#d9a86a"); shade(c, po, "#b8844a", 25, 20);
  spots(c, [[850, 720], [940, 740], [900, 690]], 8, 6, "#8a5a3c");
};
// ---------- 7 a4: foods on a banana leaf: flower, stem, root, leaf, seed, fruit
const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 470, 40);
  const bl = () => ell(c, 540, 550, 500, 340); shape(c, bl, "#7fbf5a"); shade(c, bl, COL.greenDk, 40, 30); line(c, [[60, 550], [1020, 550]], 5, COL.greenDk);
  // cauliflower
  [[-45, 0, 55], [45, 0, 55], [0, -45, 60], [0, 20, 55]].forEach(([dx, dy, r]) => shape(c, () => ell(c, 250 + dx, 400 + dy, r, r), "#f7f1dc", 5)); [[-70, 70, -2.5], [70, 70, -0.6]].forEach(([dx, dy, an]) => leaf(c, 250 + dx * 0.3, 450 + dy * 0.5, 110, an));
  // potato
  const po = () => ell(c, 540, 400, 105, 70, 0.2); shape(c, po, "#d9a86a"); shade(c, po, "#b8844a", 22, 16); spots(c, [[500, 395], [570, 420], [545, 370]], 7, 5, "#8a5a3c");
  // carrot
  const ca = () => { c.moveTo(740, 360); c.quadraticCurveTo(820, 340, 900, 370); c.quadraticCurveTo(820, 400, 740, 360); c.closePath(); };
  [-2.9, -3.14, 3.4].forEach((an, i) => stem(c, [[900, 365], [900 + Math.cos(an) * 90 * -1 + 0, 365 - 30 + i * 30]], 8)); 
  shape(c, () => polyP(c, [[735, 395], [805, 340], [905, 340], [905, 400], [805, 400]].slice(0, 0).concat([[740, 370], [800, 335], [900, 330], [900, 410], [800, 405]])), "#f08a2e"); void ca;
  [-1, 0, 1].forEach((i) => leaf(c, 905, 370 + i * 25, 80, i * 0.3, COL.leaf));
  // spinach leaf
  const sp = () => { c.moveTo(250, 760); c.bezierCurveTo(140, 700, 160, 600, 250, 580); c.bezierCurveTo(350, 600, 360, 700, 250, 760); c.closePath(); };
  stem(c, [[250, 760], [250, 810]], 12); shape(c, sp, COL.greenDk); line(c, [[250, 760], [250, 620]], 4, COL.green);
  // pea pod
  peaPod(c, 540, 700, 280, 60, 5, true);
  // tomato
  tomato(c, 830, 700, 100);
};
// ---------- 8 a5: flipbook pages showing growth
const a5 = (c: Ctx) => {
  ground(c);
  const f = [mSeed, mSprout, mPlant, mFlower, mFruit];
  f.forEach((fn, i) => { const x = 50 + i * 200; shadow(c, x + 100, 700, 90, 14); shape(c, () => rrect(c, x, 260, 180, 440, 14), WHITE, 6); line(c, [[x + 18, 640], [x + 162, 640]], 5, COL.soilDk); fn(c, x + 90, 640 - 90, 90); });
  arrow(c, [[120, 830], [960, 830]]);
};
// ---------- 9 p1: moong in a bucket
const p1 = (c: Ctx) => {
  ground(c); sun(c, 170, 160, 70);
  bucket(c, 540, 700, 440, 230);
  stem(c, [[540, 700], [540, 360]], 20); [[600, -0.8], [520, -2.4], [470, -1.9], [430, -2.9]].forEach(([y, an], i) => { leaf(c, 540, y, 190, an as number); void i; });
  leaf(c, 540, 600, 200, -2.55); leaf(c, 540, 560, 200, -0.6); leaf(c, 540, 460, 170, -2.35); leaf(c, 540, 430, 170, -0.8);
  flower(c, 480, 320, 55, 5, COL.yellow, COL.orange, COL.orange); flower(c, 610, 300, 55, 5, COL.yellow, COL.orange, COL.orange);
  stem(c, [[540, 380], [560, 330]], 10);
  [[640, 470, 0.6], [440, 500, 2.5]].forEach(([x, y, a]) => { c.save(); c.translate(x, y); c.rotate(a); peaPod(c, 0, 0, 120, 20, 3, false); c.restore(); });
};
// ---------- 10 term seed: moong, mango stone, rajma
const t_seed = (c: Ctx) => {
  ground(c);
  seed(c, 170, 520, 100, 0.4);
  shadow(c, 560, 740, 190, 24); const ms = () => ell(c, 540, 520, 200, 125, -0.25); shape(c, ms, "#e8d6a8"); shade(c, ms, "#c9b27a", 30, 20); for (let i = -4; i <= 4; i++) line(c, [[470 + i * 30, 500 + i * 12], [510 + i * 30, 440 + i * 12]], 3, "#b79a5e");
  seed(c, 880, 520, 120, 0.6, false, "#9b3a32", "#6e2420");
};
// ---------- 11 term seedling: tray of methi seedlings
const t_seedling = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 430, 900, 440, 30), COL.steel); shape(c, () => rrect(c, 130, 470, 820, 350, 20), COL.soil, 5);
  [[620, 120], [770, 150]].forEach(([by, h], row) => { for (let i = 0; i < 5; i++) { const x = 220 + i * 160 + (row ? 70 : 0) * (i === 4 ? 0 : 1) * 0 + (row ? 40 : 0); stem(c, [[x, by], [x, by - h]], 11, "#c5e08e"); leaf(c, x, by - h, 70, -2.7); leaf(c, x, by - h, 70, -0.45); } });
  shape(c, () => rrect(c, 90, 800, 900, 70, 20), COL.steelDk, 6);
};
// ---------- 12 term seed leaves: bean seedling
const t_seedleaves = (c: Ctx) => {
  ground(c); soilBlock(c, 880);
  stem(c, [[540, 880], [540, 440]], 20, "#c5e08e");
  [-1, 1].forEach((s) => { const p = () => ell(c, 540 + s * 110, 600, 105, 52, s * 0.18); shape(c, p, COL.greenLt, 6); shade(c, p, COL.green, 12, 14); });
  leaf(c, 540, 460, 220, -2.45); leaf(c, 540, 460, 220, -0.7);
  stem(c, [[540, 470], [540, 400]], 14); shape(c, () => ell(c, 540, 390, 14, 24), COL.greenLt, 4);
};
// ---------- 13 term true leaves: tomato seedling
const t_trueleaves = (c: Ctx) => {
  ground(c); soilBlock(c, 880);
  stem(c, [[540, 880], [540, 400]], 18, "#c5e08e");
  [-1, 1].forEach((s) => { const p = () => ell(c, 540 + s * 105, 640, 100, 30, s * 0.1); shape(c, p, COL.greenLt, 6); });
  jag(c, 540, 480, 300, -2.5); jag(c, 540, 480, 300, -0.64); jag(c, 540, 410, 230, -1.57);
};
// ---------- 14 term bud: bud and open flower
const t_bud = (c: Ctx) => {
  ground(c);
  stem(c, [[230, 950], [230, 500]], 20); leaf(c, 230, 760, 190, -2.6); leaf(c, 230, 800, 170, -0.5);
  shape(c, () => ell(c, 230, 360, 80, 150, 0.05), "#e4523b"); line(c, [[200, 240], [235, 400], [260, 470]], 4, "#b83a28"); star(c, 230, 500, 90);
  stem(c, [[820, 950], [820, 560]], 20); leaf(c, 820, 800, 190, -2.6);
  star(c, 820, 560, 80); flower(c, 820, 400, 190, 5, COL.red, "#b83a28", COL.yellow); stem(c, [[820, 400], [880, 340]], 10, "#ffe97a");
  arrow(c, [[400, 480], [570, 480]]);
};
// ---------- 15 term fruit: fruits cut open to show seeds
const t_fruit = (c: Ctx) => {
  ground(c);
  // mango half
  const mg = () => ell(c, 280, 300, 190, 150, -0.3); shadow(c, 300, 450, 170, 20); shape(c, mg, COL.orange); shape(c, () => ell(c, 280, 300, 165, 125, -0.3), COL.yellow, 4); shape(c, () => ell(c, 280, 300, 90, 55, -0.3), "#f1e3bb", 5);
  // pea pod
  peaPod(c, 790, 300, 380, 90, 6, true);
  // cucumber slice
  shadow(c, 300, 905, 160, 20); shape(c, () => ell(c, 280, 780, 160, 160), COL.greenDk); shape(c, () => ell(c, 280, 780, 135, 135), "#d8eab0", 4); shape(c, () => ell(c, 280, 780, 80, 80), "#eef6d2", 3);
  for (let i = 0; i < 9; i++) { const a = i * 0.7; spots(c, [[280 + Math.cos(a) * 52, 780 + Math.sin(a) * 52]], 13, 7, "#fff3c4"); }
  bhindiCut(c, 790, 780, 150);
};
// ---------- 16 term ripe: green mango beside ripe mango
const t_ripe = (c: Ctx) => {
  ground(c);
  line(c, [[0, 150], [1080, 120]], 18, INK); line(c, [[0, 150], [1080, 120]], 10, COL.brown);
  stem(c, [[270, 140], [270, 270]], 8); stem(c, [[810, 128], [810, 250]], 8); leaf(c, 135, 140, 120, 0.6); leaf(c, 540, 135, 120, 0.6); leaf(c, 960, 125, 120, 2.2);
  mango(c, 270, 500, 190, COL.green, COL.greenDk); mango(c, 810, 480, 190, COL.yellow, COL.orange, COL.red);
  arrow(c, [[480, 480], [610, 480]]);
};
// ---------- 17 term annual: dry brown moong plant with black pods
const t_annual = (c: Ctx) => {
  ground(c, "#f1e2c4"); soilBlock(c, 880);
  const br = "#8b6a45";
  stem(c, [[540, 880], [530, 600], [550, 380]], 18, br);
  const arm = (x: number, y: number, pts: number[][]) => stem(c, [[x, y], ...pts], 11, br);
  arm(535, 640, [[430, 560], [380, 470]]); arm(540, 560, [[650, 500], [700, 430]]); arm(545, 460, [[470, 380], [440, 310]]);
  const pod = (x: number, y: number, a: number) => { c.save(); c.translate(x, y); c.rotate(a); shape(c, () => { c.moveTo(0, 0); c.quadraticCurveTo(25, 60, 15, 150); c.quadraticCurveTo(-18, 70, 0, 0); c.closePath(); }, "#4a4048"); c.restore(); };
  pod(380, 470, 0.15); pod(412, 500, -0.2); pod(700, 430, -0.1); pod(730, 460, 0.2); pod(440, 310, 0.1); pod(550, 380, -0.15); pod(570, 395, 0.3);
  [[420, 640, -2.7], [650, 700, -0.4], [380, 790, -2.4]].forEach(([x, y, a]) => leaf(c, 535, y > 700 ? 790 : 700, 110, a, "#b99058"));
  seed(c, 300, 900, 22, 0.3); seed(c, 700, 920, 22, 1);
};
// ---------- 18 term clone: one banana plant and identical young ones
const banana = (c: Ctx, x: number, y: number, s: number) => {
  const tr = () => rrect(c, x - 30 * s, y - 200 * s, 60 * s, 200 * s, 16 * s); shape(c, tr, "#c9e0a0", 6); shade(c, tr, "#9cc060", 14 * s, 0);
  [-2.9, -2.4, -1.9, -1.2, -0.7, -0.25].forEach((a) => leaf(c, x, y - 200 * s, 230 * s, a, COL.green));
};
const t_clone = (c: Ctx) => {
  ground(c); soilBlock(c, 930);
  banana(c, 540, 520, 1.15);
  for (let i = 0; i < 20; i++) { const t = i / 19; [150, 380, 700, 930].forEach((x) => { if (i % 2 === 0) { const sx = 540 + (x - 540) * 0 + 0; line(c, [[sx + (x - sx) * t, 540 + (800 - 540) * t], [sx + (x - sx) * (t + 0.03), 540 + (800 - 540) * (t + 0.03)]], 5, COL.greyDk); } }); }
  [150, 380, 700, 930].forEach((x) => banana(c, x, 920, 0.5));
};
// ---------- 19 term stage: stepping stones
const t_stage = (c: Ctx) => {
  ground(c);
  const ic = [mSeed, mSprout, mPlant, mFlower, mFruit], pos = [[130, 760], [330, 760], [540, 760], [750, 760], [950, 760]];
  pos.forEach(([x, y], i) => { shadow(c, x + 12, y + 20, 100, 24); shape(c, () => ell(c, x, y, 105, 40), COL.steel, 6); ic[i](c, x, y - 190, 100); if (i) arrow(c, [[pos[i - 1][0] + 75, pos[i - 1][1] - 190], [x - 75, y - 190]], RED, 8); });
};
// ---------- 20 expl1: from seed to seedling
const x_germ = (c: Ctx) => {
  ground(c);
  [30, 395, 760].forEach((x) => { shape(c, () => rrect(c, x, 230, 290, 640, 18), "#dff0fa", 6); c.save(); c.beginPath(); rrect(c, x, 230, 290, 640, 18); c.clip(); c.fillStyle = COL.soil; c.fillRect(x, 560, 290, 320); c.restore(); line(c, [[x, 560], [x + 290, 560]], 6); shape(c, () => rrect(c, x, 230, 290, 640, 18), "rgba(0,0,0,0)", 6); });
  const rajma = (x: number, y: number, r: number) => seed(c, x, y, r, 0.5, false, "#9b3a32", "#6e2420");
  rajma(175, 650, 62); line(c, [[150, 640], [200, 660]], 4, INK); rootL(c, [[160, 700], [150, 760], [128, 820]], 12);
  rajma(540, 650, 58); rootL(c, [[525, 700], [520, 770], [500, 830]], 12); stem(c, [[535, 620], [535, 480], [545, 430], [580, 405], [605, 430], [605, 470]], 16, "#c5e08e");
  rajma(905, 700, 48); rootL(c, [[895, 740], [885, 800], [870, 840]], 12); stem(c, [[905, 690], [905, 420]], 14, "#c5e08e");
  [-1, 1].forEach((s) => shape(c, () => ell(c, 905 + s * 55, 520, 52, 28, s * 0.2), COL.greenLt, 5));
  leaf(c, 905, 430, 100, -2.4); leaf(c, 905, 430, 100, -0.75);
  arrow(c, [[324, 560], [380, 560]], RED, 8); arrow(c, [[690, 560], [745, 560]], RED, 8);
};
// ---------- 21 expl2: leaves make food from sunlight
const x_photo = (c: Ctx) => {
  ground(c); sun(c, 170, 170, 75);
  bucket(c, 540, 810, 300, 200);
  stem(c, [[540, 810], [540, 400]], 20); [720, 620, 520, 430].forEach((y, i) => { leaf(c, 540, y, 190 - i * 15, i % 2 ? -2.55 : -2.7); leaf(c, 540, y - 20, 190 - i * 15, i % 2 ? -0.5 : -0.7); });
  arrow(c, [[900, 300], [800, 360], [690, 400]]); [[880, 230], [930, 260], [960, 330]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 22, 16), "#e6e9ee", 3));
  arrow(c, [[740, 700], [740, 560]]); shape(c, () => ell(c, 740, 740, 14, 18), COL.drop, 4); shape(c, () => ell(c, 790, 720, 14, 18), COL.drop, 4);
  [[240, 330, 18], [190, 400, 14], [270, 260, 12], [150, 290, 16]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), COL.glass, 4));
  arrow(c, [[400, 420], [310, 360]]);
};
// ---------- 22 expl4: a flower cut in half
const x_flower = (c: Ctx) => {
  ground(c);
  stem(c, [[540, 1020], [540, 830]], 24);
  [-1, 1].forEach((s) => { const p = () => { c.moveTo(540, 760); c.bezierCurveTo(540 + s * 150, 740, 540 + s * 360, 560, 540 + s * 340, 250); c.bezierCurveTo(540 + s * 190, 380, 540 + s * 90, 560, 540, 760); c.closePath(); }; shape(c, p, COL.red); shade(c, p, "#b83a28", 20 * s, 10); });
  [-1, 1].forEach((s) => leaf(c, 540 + s * 20, 830, 150, s < 0 ? -2.4 : -0.74));
  [[-120, 360], [-60, 330], [60, 330], [120, 360]].forEach(([dx, ty]) => { stem(c, [[540, 700], [540 + dx * 0.7, 600], [540 + dx, ty + 30]], 8, "#fff3dc"); shape(c, () => ell(c, 540 + dx, ty + 20, 22, 14, dx / 200), COL.yellow, 4); });
  const ov = () => ell(c, 540, 770, 95, 75); shape(c, ov, COL.greenLt); shape(c, () => ell(c, 540, 770, 70, 52), "#e7f3c9", 4); spots(c, [[510, 760], [560, 750], [540, 790], [500, 795], [575, 790]], 10, 7, WHITE);
  stem(c, [[540, 700], [540, 440]], 16, COL.greenLt); shape(c, () => ell(c, 540, 420, 28, 24), COL.yellow, 5);
};
// ---------- 23 expl5: the flower's leftovers on a tomato, a brinjal and a pomegranate
const x_leftover = (c: Ctx) => {
  ground(c);
  tomato(c, 220, 620, 150);
  shadow(c, 570, 830, 150, 24); const bj = () => { c.moveTo(500, 420); c.bezierCurveTo(430, 560, 470, 790, 590, 800); c.bezierCurveTo(690, 790, 690, 600, 640, 420); c.closePath(); }; shape(c, bj, "#6a3a8a"); shade(c, bj, "#4a2763", 30, 0); shine(c, [[505, 540], [510, 720]], 9);
  [-1, 0, 1].forEach((d) => leaf(c, 570, 430, 110, -PI / 2 + d * 0.9)); shape(c, () => ell(c, 570, 430, 90, 35), COL.leaf, 5); stem(c, [[570, 410], [575, 330]], 16, COL.leafDk);
  const pg = () => ell(c, 880, 620, 135, 125); shadow(c, 900, 760, 130, 22); shape(c, pg, "#d6452f"); shade(c, pg, "#a8301f", 25, 20);
  shape(c, () => polyP(c, [[820, 505], [835, 440], [860, 485], [880, 430], [900, 485], [925, 440], [940, 505]]), "#d6452f", 5);
  arrow(c, [[110, 330], [190, 440]]); arrow(c, [[410, 330], [520, 400]]); arrow(c, [[780, 330], [840, 410]]);
};
// ---------- 24 expl6: a bird eats a chilli and drops the seeds far away
const x_bird = (c: Ctx) => {
  ground(c); soilBlock(c, 860);
  line(c, [[40, 380], [500, 360]], 22, INK); line(c, [[40, 380], [500, 360]], 12, COL.brown);
  leaf(c, 80, 376, 100, -1.0); leaf(c, 300, 368, 90, -2.0);
  line(c, [[205, 290], [190, 365]], 8); line(c, [[245, 290], [235, 365]], 8);
  shape(c, () => polyP(c, [[110, 190], [220, 220], [200, 290], [60, 330]]), "#6b5a4a", 5);
  shape(c, () => ell(c, 250, 230, 120, 80, -0.25), "#8a7a68"); shape(c, () => ell(c, 285, 255, 70, 40, -0.25), "#f1e8d8", 3);
  shape(c, () => ell(c, 130, 270, 22, 18), RED, 4);
  shape(c, () => ell(c, 365, 150, 58, 58), "#3a3540"); shape(c, () => polyP(c, [[340, 105], [365, 60], [390, 110]]), "#3a3540", 5);
  shape(c, () => ell(c, 385, 142, 12, 12), WHITE, 3); shape(c, () => ell(c, 388, 142, 5, 5), INK, 0);
  shape(c, () => polyP(c, [[418, 160], [465, 170], [420, 190]]), "#2b2340", 4);
  line(c, [[455, 175], [560, 200], [620, 260]], 28, INK); line(c, [[455, 175], [560, 200], [620, 260]], 16, COL.red);
  arrow(c, [[500, 420], [650, 540], [760, 740]]);
  [[640, 520], [700, 590], [740, 660]].forEach(([x, y]) => seed(c, x, y, 18, 0.5, false, "#fff0b0", "#d9c47a"));
  stem(c, [[860, 860], [860, 760]], 12, "#c5e08e"); leaf(c, 860, 790, 70, -2.6); leaf(c, 860, 790, 70, -0.55);
};
// ---------- 25 expl7: short to long life cycles
const x_time = (c: Ctx) => {
  ground(c); soilBlock(c, 800);
  // moong
  stem(c, [[130, 800], [130, 700]], 10); leaf(c, 130, 740, 55, -2.6); leaf(c, 130, 740, 55, -0.5); leaf(c, 130, 700, 50, -1.4);
  // rice
  [-30, 0, 30].forEach((dx) => { stem(c, [[390 + dx, 800], [390 + dx * 1.5, 560]], 8); leaf(c, 390 + dx, 740, 120, -2.3 + dx * 0.01, COL.greenLt); shape(c, () => ell(c, 390 + dx * 1.7, 535, 12, 35, dx * 0.02), COL.wood, 4); });
  // mango tree
  const tk = () => polyP(c, [[615, 800], [680, 800], [672, 440], [625, 440]]); shape(c, tk, COL.brown, 6);
  [[560, 400, 110], [740, 400, 110], [650, 320, 130], [650, 440, 100]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.85), COL.leaf, 6));
  spots(c, [[600, 480], [720, 470]], 14, 18, COL.yellow);
  // neelakurinji bush on a hill
  shape(c, () => ell(c, 910, 800, 160, 60), COL.green, 6); shape(c, () => ell(c, 910, 700, 90, 100), COL.leafDk, 6);
  for (let i = 0; i < 14; i++) { const a = i * 2.4, rr = 20 + (i % 4) * 14; flower(c, 910 + Math.cos(a) * rr * 1.8, 690 + Math.sin(a) * rr * 1.8, 28, 5, "#7d8be0", "#5a66b8", "#f1d95a"); }
  arrow(c, [[80, 920], [540, 940], [1000, 920]]);
};
// ---------- 26 expl8: new plants without seeds
const x_noseed = (c: Ctx) => {
  ground(c);
  const lf = () => c.ellipse(540, 330, 280, 150, 0, 0, PI * 2); shape(c, lf, COL.greenLt); shade(c, lf, COL.green, 30, 20); line(c, [[300, 330], [780, 330]], 4, COL.greenDk);
  [[320, 230], [440, 190], [560, 180], [680, 195], [770, 240], [330, 430], [770, 430]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 18, 12), WHITE, 3); stem(c, [[x, y - 10], [x - 5, y - 55]], 6); leaf(c, x - 5, y - 55, 35, -2.4); leaf(c, x - 5, y - 55, 35, -0.7); });
  [[330, 440], [660, 470]].forEach(([x, y]) => rootL(c, [[x, y], [x - 8, y + 24], [x - 18, y + 40]], 6));
  shadow(c, 260, 910, 180, 24); const po = () => ell(c, 250, 800, 130, 85, 0.1); shape(c, po, "#d9a86a"); shade(c, po, "#b8844a", 25, 20); spots(c, [[200, 810], [300, 830], [250, 770]], 8, 6, "#8a5a3c");
  [[-60, -50, -1.9], [40, -70, -1.5], [90, -30, -1.1]].forEach(([dx, dy, an]) => { const x = 250 + dx, y = 790 + dy; stem(c, [[x, y], [x + Math.cos(an) * 90, y + Math.sin(an) * 90]], 14, "#c5e08e"); });
  glass(c, 820, 980, 220, 270, 0.7);
  const on = () => ell(c, 820, 650, 100, 85); shape(c, on, "#c0668a"); shade(c, on, "#9a4a6c", 22, 16); [-35, 0, 35].forEach((dx) => rootL(c, [[820 + dx, 730], [820 + dx * 1.3, 800], [820 + dx * 1.6, 860]], 7));
  stem(c, [[820, 570], [815, 500]], 16, COL.greenLt);
};
// ---------- 27 expl10: a dead plant feeds the soil and a new seedling
const x_decay = (c: Ctx) => {
  ground(c); soilBlock(c, 620);
  const br = "#8b6a45"; stem(c, [[130, 600], [260, 590], [470, 600]], 16, br);
  [[200, 585, -2.6], [330, 585, -0.4], [420, 595, 2.5]].forEach(([x, y, a]) => leaf(c, x, y, 110, a, "#b99058"));
  [[250, 560], [380, 566]].forEach(([x, y], i) => { stem(c, [[x, y], [x, y - 40 - i * 15]], 12, "#f1e8d8"); shape(c, () => ell(c, x, y - 45 - i * 15, 45, 28), i ? "#d98c5f" : "#e4523b", 5); spots(c, [[x - 12, y - 52 - i * 15], [x + 14, y - 40 - i * 15]], 6, 5, WHITE); });
  const wm = [[160, 760], [220, 710], [320, 740], [400, 790], [470, 740]]; line(c, wm, 34, INK); line(c, wm, 22, "#e8929a"); shape(c, () => ell(c, 470, 740, 16, 16), "#e8929a", 4);
  [[130, 840], [300, 880], [440, 900], [520, 820], [90, 920]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 18, 10, 0.5), "#c8e07a", 3));
  arrow(c, [[300, 650], [300, 720]], RED, 8); arrow(c, [[540, 780], [700, 740], [800, 700]]);
  stem(c, [[880, 620], [880, 480]], 16, "#c5e08e"); leaf(c, 880, 520, 100, -2.5); leaf(c, 880, 520, 100, -0.65); leaf(c, 880, 480, 80, -1.57);
};
// ---------- 28 expl0: the life cycle as a circle of six pictures
const x_cycle = (c: Ctx) => {
  ground(c); const cx = 540, cy = 540, R = 330;
  const ic = [mSeed, mSprout, mPlant, mFlower, mPodGreen, mPodBlack];
  for (let i = 0; i < 6; i++) { const a0 = -PI / 2 + i * (PI / 3), a1 = a0 + PI / 3; const pts: number[][] = []; for (let k = 0.28; k <= 0.72; k += 0.11) { const a = a0 + (a1 - a0) * k; pts.push([cx + Math.cos(a) * (R + 10), cy + Math.sin(a) * (R + 10)]); } arrow(c, pts, RED, 9); }
  ic.forEach((f, i) => { const a = -PI / 2 + i * (PI / 3), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; shape(c, () => ell(c, x, y, 105, 105), WHITE, 6); f(c, x, y - 12, 62); });
};

export const ic_seedsAndLifeCyclesPlantLifeCycleL3 = cards("sci.seeds-and-life-cycles.plant-life-cycle.L3 cards", [
  e1, e2, e3, e4, a1, a2, a3, a4, a5, p1,
  t_seed, t_seedling, t_seedleaves, t_trueleaves, t_bud, t_fruit, t_ripe, t_annual, t_clone, t_stage,
  x_germ, x_photo, x_flower, x_leftover, x_bird, x_time, x_noseed, x_decay, x_cycle,
]);
void BG; void D;
