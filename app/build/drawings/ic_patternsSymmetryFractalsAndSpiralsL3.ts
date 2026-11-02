import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, bowl, plate, leaf, write, cards } from "./flatKit";

// sci.patterns-symmetry.fractals-and-spirals.L3 · picture cards. Everything is built from a few
// repeating shapes (a clump of lobes, a branching stem, a coast, a spiral), because that is the idea.

const { PI, cos, sin, sqrt, atan2, hypot } = Math;
const CAULI = "#fbf3dc", CAULIDK = "#e6d6ab", BROC = "#4f9a3e", BROCDK = "#2f6f2c";
const PAPER = "#fffaf0", SEA = "#8fc3ea", LAND = "#cfe3a0", SAND = "#f0dfb0", PURPLE = "#7a4bb0";

type Seg = { p: number[][]; w: number; col: string };
const drawSegs = (c: Ctx, s: Seg[], ink = true, extra = 8) => {
  if (ink) s.forEach((g) => line(c, g.p, g.w + extra, INK));
  s.forEach((g) => line(c, g.p, g.w, g.col));
};
const tile = (c: Ctx, x: number, y: number, w: number, h: number, fill: string = PAPER) => shape(c, () => rrect(c, x, y, w, h, 28), fill, 6);
const clipTile = (c: Ctx, x: number, y: number, w: number, h: number, draw: () => void) => { c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); draw(); c.restore(); };
const circ = (c: Ctx, x: number, y: number, r: number, fill: string, lw = 6) => shape(c, () => ell(c, x, y, r, r), fill, lw);

// ------------------------------------------------------------ cauliflower: a clump of lobes made of lobes
const clump = (c: Ctx, x: number, y: number, r: number, depth: number, rot = 0, col = CAULI, dk = CAULIDK) => {
  const lw = Math.max(2.5, r * 0.045);
  shape(c, () => ell(c, x, y, r, r), col, lw);
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.16, r * 0.14, 0.7);
  if (depth <= 0) return;
  for (let k = 0; k < 6; k++) { const a = rot + k * PI / 3; clump(c, x + cos(a) * r * 0.6, y + sin(a) * r * 0.6, r * 0.42, depth - 1, rot + 0.4, col, dk); }
  clump(c, x, y, r * 0.44, depth - 1, rot + 0.2, col, dk);
};
const cauli = (c: Ctx, x: number, y: number, r: number, depth = 3) => {
  for (const a of [0.15, 0.5, 0.85]) leaf(c, x + (a - 0.5) * r * 1.3, y + r * 0.55, r * 1.05, PI * a, COL.leaf);
  shadow(c, x + r * 0.1, y + r * 1.08, r * 0.9, r * 0.1);
  clump(c, x, y, r, depth);
};
const stem = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x - w / 2, y, w, h, w * 0.3), COL.greenLt, 5);
const floret = (c: Ctx, x: number, y: number, r: number, depth: number) => { stem(c, x, y + r * 0.5, r * 0.5, r * 0.85); clump(c, x, y, r, depth); };
const broccoli = (c: Ctx, x: number, y: number, r: number, depth = 3) => {
  shape(c, () => rrect(c, x - r * 0.25, y + r * 0.4, r * 0.5, r * 0.9, r * 0.12), COL.greenLt, 5);
  clump(c, x, y, r, depth, 0, BROC, BROCDK);
};

// ------------------------------------------------------------ branching stems
const treeSegs = (x: number, y: number, len: number, ang: number, d: number, w: number, col: string, out: Seg[], r: () => number, spread = 0.55, k = 0.74): Seg[] => {
  const tx = x + cos(ang) * len, ty = y + sin(ang) * len;
  out.push({ p: [[x, y], [tx, ty]], w, col });
  if (d > 0) for (const s of [-1, 1]) treeSegs(tx, ty, len * (k + (r() - 0.5) * 0.14), ang + s * spread + (r() - 0.5) * 0.3, d - 1, w * 0.68, col, out, r, spread, k);
  return out;
};
type FO = { bend: number; leafy?: boolean; ang?: number };
const frondSegs = (x: number, y: number, len: number, ang: number, d: number, w: number, col: string, out: Seg[], o: FO) => {
  const N = 10, pts: number[][] = [[x, y]], as: number[] = [];
  let a = ang, px = x, py = y;
  for (let i = 0; i < N; i++) { a += o.bend / N; px += cos(a) * len / N; py += sin(a) * len / N; pts.push([px, py]); as.push(a); }
  out.push({ p: pts, w: Math.max(w, 4), col });
  if (d > 0) {
    const n = o.leafy ? 6 : 7;
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1), i = Math.round(t * N), [bx, by] = pts[i];
      const cl = o.leafy ? len * 0.55 * sin(PI * (0.12 + 0.76 * t)) * 0.8 : len * 0.5 * (1 - t * 0.85);
      for (const s of [-1, 1]) frondSegs(bx, by, cl, as[Math.min(i, N - 1)] + s * (o.ang ?? 1.05), d - 1, w * 0.62, col, out, { ...o, bend: -s * 0.35 });
    }
  }
  return out;
};
const fern = (c: Ctx, x: number, y: number, len: number, ang: number, d = 2, w = 14) => drawSegs(c, frondSegs(x, y, len, ang, d, w, COL.green, [], { bend: 0.3 }), true, 7);
const tree = (c: Ctx, x: number, y: number, len: number, d: number, w: number, col: string = COL.brown, ink = true, seed = 3, spread = 0.55) => drawSegs(c, treeSegs(x, y, len, -PI / 2, d, w, col, [], rnd(seed), spread), ink, 8);

// ------------------------------------------------------------ coasts and spirals
const coastU = (seed: number, depth = 7, rough = 0.62) => {
  const r = rnd(seed); let pts: number[][] = [[0, 0], [1, 0]], amp = 0.3;
  for (let d = 0; d < depth; d++) {
    const n: number[][] = [];
    for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; n.push(a, [(a[0] + b[0]) / 2 + (r() - 0.5) * amp * 0.9, (a[1] + b[1]) / 2 + (r() - 0.5) * 2 * amp]); }
    n.push(pts[pts.length - 1]); pts = n; amp *= rough;
  }
  return pts;
};
const walkPts = (pts: number[][], s: number) => {
  const out = [pts[0]]; let cur = pts[0];
  for (let i = 1; i < pts.length; i++) if (hypot(pts[i][0] - cur[0], pts[i][1] - cur[1]) >= s) { cur = pts[i]; out.push(cur); }
  if (cur !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
  return out;
};
const spiralPts = (cx: number, cy: number, r0: number, r1: number, turns: number, rot = 0, n = 200) => {
  const o: number[][] = [];
  for (let i = 0; i <= n; i++) { const t = i / n, a = rot + t * turns * 2 * PI, r = r0 + (r1 - r0) * t; o.push([cx + cos(a) * r, cy + sin(a) * r]); }
  return o;
};
const shell = (c: Ctx, x: number, y: number, R: number, rot = 0, trace = false) => {
  shadow(c, x + R * 0.12, y + R * 1.02, R * 0.95, R * 0.14);
  shape(c, () => ell(c, x, y, R, R), "#e8b36b");
  shade(c, () => ell(c, x, y, R, R), "#c98a45", R * 0.2, R * 0.18, 0.7);
  const sp = spiralPts(x, y, R * 0.06, R * 0.86, 2.6, rot);
  line(c, sp, Math.max(6, R * 0.06) + 6, INK); line(c, sp, Math.max(6, R * 0.06), "#8a5a3c");
  if (trace) line(c, sp, 7, RED);
};
const pineapple = (c: Ctx, x: number, cy: number, rx: number, ry: number) => {
  for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * 0.34; leaf(c, x + sin(a + PI / 2) * rx * 0.1, cy - ry * 0.85, ry * 0.75, a, i % 2 ? COL.leaf : COL.green); }
  shadow(c, x + rx * 0.1, cy + ry * 1.0, rx * 0.95, rx * 0.15);
  shape(c, () => ell(c, x, cy, rx, ry), COL.yellow);
  c.save(); c.beginPath(); ell(c, x, cy, rx, ry); c.clip();
  for (let k = -9; k <= 9; k++) { line(c, [[x + k * rx * 0.3 - ry, cy - ry], [x + k * rx * 0.3 + ry, cy + ry]], 4, COL.orangeDk ?? "#d98a2a"); line(c, [[x + k * rx * 0.3 + ry, cy - ry], [x + k * rx * 0.3 - ry, cy + ry]], 4, "#d98a2a"); }
  c.restore(); shade(c, () => ell(c, x, cy, rx, ry), COL.orange, rx * 0.25, ry * 0.1, 0.35);
  c.beginPath(); ell(c, x, cy, rx, ry); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const GA = 137.5 * PI / 180;
const sunflower = (c: Ctx, x: number, y: number, R: number) => {
  for (let k = 0; k < 18; k++) { const a = k * PI / 9; shape(c, () => ell(c, x + cos(a) * R * 0.95, y + sin(a) * R * 0.95, R * 0.34, R * 0.14, a), COL.yellow, 5); }
  circ(c, x, y, R * 0.8, "#6a4128");
  for (let i = 1; i < 260; i++) { const rr = R * 0.76 * sqrt(i / 260), a = i * GA; circ(c, x + cos(rr * 0 + a) * rr, y + sin(a) * rr, R * 0.032, i % 2 ? "#a8723f" : "#8a5a3c", 1.5); }
};

// ------------------------------------------------------------ cards
// 0 intro: a child's hands hold a whole cauliflower and one small floret
const intro = (c: Ctx) => {
  ground(c);
  cauli(c, 300, 430, 215, 3);
  const arm = (x: number, y: number, s: number) => shape(c, () => rrect(c, x - 36 * s, y + 20 * s, 72 * s, D, 14), CLOTH.child, 6);
  arm(300, 640, 1.7); hand(c, 300, 640, -PI / 2, 1.7);
  stem(c, 790, 520, 70, 120); clump(c, 790, 440, 130, 2);
  arm(790, 700, 1.1); hand(c, 790, 700, -PI / 2, 1.1);
};
// 1 cover: the whole unit in six tiles
const summary = (c: Ctx) => {
  ground(c);
  const X = [30, 375, 720], Y = [170, 570], W = 330, H = 340;
  const T = (i: number, fill: string) => { const x = X[i % 3], y = Y[Math.floor(i / 3)]; tile(c, x, y, W, H, fill); return [x + W / 2, y + H / 2]; };
  let [x, y] = T(0, PAPER); cauli(c, x, y - 10, 90, 3);
  [x, y] = T(1, PAPER); fern(c, x - 10, y + 140, 250, -PI / 2, 2, 11);
  { const px = X[2], py = Y[0]; clipTile(c, px, py, W, H, () => {
    c.fillStyle = SEA; c.fillRect(px, py, W, H); const u = coastU(14);
    c.beginPath(); u.forEach(([a, b], i) => (i ? c.lineTo(px + a * W, py + 150 + b * W * 0.8) : c.moveTo(px + a * W, py + 150 + b * W * 0.8))); c.lineTo(px + W, py + H); c.lineTo(px, py + H); c.closePath(); c.fillStyle = LAND; c.fill();
    line(c, u.map(([a, b]) => [px + a * W, py + 150 + b * W * 0.8]), 6, INK);
    line(c, walkPts(u, 0.09).map(([a, b]) => [px + a * W, py + 150 + b * W * 0.8]), 8, RED); }); tile(c, px, py, W, H, "rgba(0,0,0,0)"); }
  [x, y] = T(3, PAPER); shell(c, x, y - 5, 120, 0.5);
  [x, y] = T(4, PAPER); pineapple(c, x, y + 20, 90, 125);
  [x, y] = T(5, PAPER); sunflower(c, x, y, 130);
};

// 2 e1: the same coast measured with long strips and with short strips on a map
const coastPanel = (c: Ctx, px: number, py: number, w: number, h: number, step: number, strip: number, stripCol: string, label: string) => {
  const u = coastU(21), P = (p: number[]) => [px + p[0] * w, py + h * 0.45 + p[1] * w * 0.9];
  tile(c, px, py, w, h, PAPER);
  clipTile(c, px, py, w, h, () => {
    c.fillStyle = SEA; c.fillRect(px, py, w, h);
    c.beginPath(); u.map(P).forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.lineTo(px + w, py + h); c.lineTo(px, py + h); c.closePath(); c.fillStyle = LAND; c.fill();
  });
  line(c, u.map(P), 5, INK);
  const n = walkPts(u, step).map(P);
  line(c, n, strip + 8, INK); line(c, n, strip, stripCol);
  for (let i = 1; i < n.length - 1; i++) circ(c, n[i][0], n[i][1], strip * 0.45 + 2, RED, 3);
  tile(c, px, py, w, h, "rgba(0,0,0,0)");
  write(c, label, px + w / 2 - 110, py + h - 80, 56, INK, 8);
};
const e1 = (c: Ctx) => { ground(c); coastPanel(c, 30, 200, 490, 640, 0.34, 26, COL.wood, "20 cm"); coastPanel(c, 560, 200, 490, 640, 0.08, 12, COL.yellow, "31 cm"); };

// 3 a1: the pieces laid in a row on a plate, biggest to smallest
const a1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 640, 480, 230);
  cauli(c, 250, 560, 120, 3);
  floret(c, 540, 580, 88, 2);
  floret(c, 790, 600, 54, 1);
  arrow(c, [[200, 330], [880, 330]]);
};
// 4 a2: a leaf held up to the window, its veins branching again and again
const a2 = (c: Ctx) => {
  ground(c, "#f2e8d3");
  shape(c, () => rrect(c, 120, 80, 840, 800, 24), COL.wood, 8);
  shape(c, () => rrect(c, 170, 130, 740, 700, 10), COL.sky, 6);
  circ(c, 330, 280, 70, COL.yellow, 6);
  for (let k = 0; k < 12; k++) { const a = k * PI / 6; line(c, [[330 + cos(a) * 92, 280 + sin(a) * 92], [330 + cos(a) * 130, 280 + sin(a) * 130]], 8, COL.orange); }
  line(c, [[540, 130], [540, 830]], 10); line(c, [[170, 480], [910, 480]], 10);
  const leafP = () => { c.moveTo(540, 760); c.bezierCurveTo(250, 560, 300, 250, 540, 150); c.bezierCurveTo(780, 250, 830, 560, 540, 760); c.closePath(); };
  line(c, [[540, 760], [540, 880]], 14); line(c, [[540, 760], [540, 880]], 8, COL.leafDk);
  shape(c, leafP, COL.greenLt, 7);
  c.save(); c.beginPath(); leafP(); c.clip();
  drawSegs(c, frondSegs(540, 760, 610, -PI / 2, 2, 14, COL.leafDk, [], { bend: 0, leafy: true, ang: 0.95 }), false);
  c.restore();
  c.beginPath(); leafP(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  c.fillStyle = CLOTH.child; c.beginPath(); rrect(c, 540 - 100, 960, 200, 200, 14); c.fill();
  shape(c, () => rrect(c, 540 - 66, 930, 132, 200, 14), CLOTH.child, 6);
  hand(c, 540, 960, -PI / 2, 1.1);
};
// 5 a3: paint pressed between two sheets, then pulled apart: it branches like a tree
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 260, 800, 220, 28);
  shape(c, () => polyP(c, [[60, 560], [450, 560], [480, 790], [30, 790]]), PAPER);
  shape(c, () => ell(c, 255, 700, 120, 36), PURPLE, 5);
  c.save(); c.translate(0, -230);
  shape(c, () => polyP(c, [[60, 560], [450, 560], [480, 790], [30, 790]]), "#eaf3fb");
  c.restore();
  arrow(c, [[255, 220], [255, 410]]);
  arrow(c, [[500, 540], [600, 540]]);
  shadow(c, 810, 850, 240, 30);
  shape(c, () => polyP(c, [[600, 230], [1030, 230], [1060, 840], [570, 840]]), PAPER);
  c.save(); c.beginPath(); polyP(c, [[600, 230], [1030, 230], [1060, 840], [570, 840]]); c.clip();
  const r = rnd(5), out: Seg[] = [];
  for (let k = 0; k < 7; k++) treeSegs(815, 540, 70, k * 2 * PI / 7 + 0.3, 4, 16, PURPLE, out, r, 0.6, 0.82);
  drawSegs(c, out, false);
  circ(c, 815, 540, 34, PURPLE, 0);
  c.restore();
};
// 6 a4: a fractal tree and a triangle of triangles drawn in a notebook
const sier = (c: Ctx, x: number, y: number, s: number, d: number) => {
  if (d === 0) { shape(c, () => polyP(c, [[x, y], [x + s, y], [x + s / 2, y - s * 0.866]]), COL.blue, 3); return; }
  sier(c, x, y, s / 2, d - 1); sier(c, x + s / 2, y, s / 2, d - 1); sier(c, x + s / 4, y - s * 0.433, s / 2, d - 1);
};
const a4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 150, 980, 800, 18), PAPER, 7);
  for (let y = 230; y < 930; y += 50) line(c, [[80, y], [1000, y]], 2, "#c9d8e6");
  for (let k = 0; k < 8; k++) circ(c, 50, 200 + k * 95, 14, COL.steelDk, 5);
  tree(c, 300, 880, 135, 5, 18, COL.brown, true, 8, 0.52);
  sier(c, 590, 830, 400, 4);
  shape(c, () => polyP(c, [[940, 930], [1030, 760], [1050, 780], [960, 950]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[1030, 760], [1050, 780], [1068, 740]]), "#e9c9a0", 5);
};
// 7 a6: a hunt with a magnifying glass over a broccoli, a shell and a pineapple on the table
const a6 = (c: Ctx) => {
  ground(c, "#f2e8d3");
  shape(c, () => rrect(c, -20, 760, 1120, 340, 4), COL.wood, 6);
  shell(c, 180, 680, 90, 0.2);
  pineapple(c, 880, 560, 100, 135);
  broccoli(c, 440, 600, 140, 3);
  line(c, [[540, 430], [740, 230]], 46, INK); line(c, [[540, 430], [740, 230]], 30, COL.brown);
  c.save(); c.beginPath(); ell(c, 440, 500, 190, 190); c.clip(); c.fillStyle = COL.sky; c.fillRect(200, 300, 500, 400);
  broccoli(c, 440, 520, 190, 3); c.restore();
  circ(c, 440, 500, 190, "rgba(214,236,250,0.18)", 18);
  c.beginPath(); c.arc(440, 500, 160, PI * 1.1, PI * 1.45); c.strokeStyle = WHITE; c.lineWidth = 12; c.lineCap = "round"; c.stroke();
};
// 8 p1: a notebook page: the whole leaf, a part of it, a part of the part
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 140, 1000, 800, 20), "#dfc79a", 7);
  shape(c, () => rrect(c, 70, 170, 450, 740, 10), PAPER, 6); shape(c, () => rrect(c, 560, 170, 450, 740, 10), PAPER, 6);
  fern(c, 270, 860, 600, -PI / 2, 2, 14);
  circ(c, 785, 320, 150, "#f3f8ec"); circ(c, 785, 700, 150, "#f3f8ec");
  c.save(); c.beginPath(); ell(c, 785, 320, 150, 150); c.clip(); fern(c, 700, 440, 270, -PI / 2.4, 1, 13); c.restore();
  leaf(c, 690, 790, 230, -PI / 4.5, COL.green);
  circ(c, 785, 320, 150, "rgba(0,0,0,0)"); circ(c, 785, 700, 150, "rgba(0,0,0,0)");
  arrow(c, [[540, 560], [620, 520]]); arrow(c, [[785, 490], [785, 530]]);
};
// 9 c1: an island with a very long coast inside a small square
const koch = (a: number[], b: number[], d: number): number[][] => {
  if (d === 0) return [a];
  const dx = (b[0] - a[0]) / 3, dy = (b[1] - a[1]) / 3, p1 = [a[0] + dx, a[1] + dy], p2 = [a[0] + 2 * dx, a[1] + 2 * dy];
  const pk = [p1[0] + dx * cos(-PI / 3) - dy * sin(-PI / 3), p1[1] + dx * sin(-PI / 3) + dy * cos(-PI / 3)];
  return [...koch(a, p1, d - 1), ...koch(p1, pk, d - 1), ...koch(pk, p2, d - 1), ...koch(p2, b, d - 1)];
};
const c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 170, 800, 800, 10), SEA, 10);
  const L = 440, cx = 540, cy = 590, A = [cx - L / 2, cy + L * 0.29], B = [cx + L / 2, cy + L * 0.29], C = [cx, cy - L * 0.577];
  const pts = [...koch(A, C, 3), ...koch(C, B, 3), ...koch(B, A, 3)];
  shape(c, () => polyP(c, pts), LAND, 4);
  line(c, [...pts, pts[0]], 4, RED);
};
// 10 c2: seeds placed a golden turn apart fill the head; a quarter turn leaves gaps
const seedPanel = (c: Ctx, px: number, py: number, ang: number, N: number, label: string) => {
  tile(c, px, py, 490, 640, "#f6efe0");
  const cx = px + 245, cy = py + 320, R = 200;
  circ(c, cx, cy, R + 20, "#6a4128");
  for (let i = 1; i <= N; i++) { const rr = R * sqrt(i / N), a = i * ang; circ(c, cx + cos(a) * rr, cy + sin(a) * rr, 11, COL.yellow, 3); }
  void label;
};
const c2 = (c: Ctx) => { ground(c); seedPanel(c, 30, 220, GA, 150, ""); seedPanel(c, 560, 220, PI / 2, 150, ""); };

// terms
const t1 = (c: Ctx) => {
  ground(c);
  cauli(c, 360, 640, 250, 3);
  const ax = 360 + cos(-0.8) * 250 * 0.6, ay = 640 + sin(-0.8) * 250 * 0.6;
  c.beginPath(); c.arc(ax, ay, 250 * 0.42 + 14, 0, 2 * PI); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
  arrow(c, [[ax + 80, ay - 130], [700, 270]]);
  circ(c, 830, 250, 190, "#f6efe0", 8);
  stem(c, 830, 290, 80, 130); clump(c, 830, 220, 130, 2, 0.1);
};
const t3 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = COL.greenLt; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  tree(c, 540, 930, 230, 5, 64, COL.brown, true, 11, 0.5);
};
const t5 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 560, 330);
  const P: [number, number, number][] = [[400, 500, 100], [680, 500, 100], [540, 470, 110], [330, 560, 85], [750, 560, 85], [470, 575, 95], [620, 580, 95]];
  P.forEach(([x, y, r]) => floret(c, x, y - 40, r, 2));
};
const t6 = (c: Ctx) => {
  ground(c, SEA);
  const l = coastU(33, 7, 0.58), r2 = coastU(44, 7, 0.58);
  const left = l.map(([u, v]) => [150 + u * 390 + v * 400 * 0.8, -40 + u * 1040]);
  const right = r2.map(([u, v]) => [930 - u * 390 + v * 400 * 0.8, -40 + u * 1040]);
  const land = [[150, -60], ...left, ...right.slice().reverse(), [930, -60]];
  shape(c, () => polyP(c, land), LAND, 0);
  line(c, left, 16, COL.blueDk); line(c, right, 16, COL.blueDk);
  line(c, left, 6, WHITE); line(c, right, 6, WHITE);
};
const t7 = (c: Ctx) => {
  ground(c);
  const sp = (x: number, y: number, R: number, rot: number, trace: boolean, col: string, thick: number) => {
    const p = spiralPts(x, y, 12, R, 3, rot);
    line(c, p, thick + 10, INK); line(c, p, thick, col);
    if (trace) line(c, p, 7, RED);
  };
  plate(c, 540, 600, 490, 250);
  sp(190, 560, 120, 0, true, COL.orange, 34);
  sp(540, 560, 130, 1, true, "#d9a566", 30);
  shell(c, 890, 540, 125, 0.3, true);
};
const t9 = (c: Ctx) => {
  ground(c);
  circ(c, 540, 540, 420, WHITE, 10);
  for (let k = 0; k < 60; k++) { const a = k * PI / 30, l = k % 5 === 0 ? 40 : 18; line(c, [[540 + cos(a) * 395, 540 + sin(a) * 395], [540 + cos(a) * (395 - l), 540 + sin(a) * (395 - l)]], k % 5 === 0 ? 8 : 4); }
  const a0 = -PI / 2, a1 = a0 + GA;
  c.beginPath(); c.moveTo(540, 540); c.arc(540, 540, 330, a0, a1); c.closePath(); c.fillStyle = "rgba(231,82,59,0.35)"; c.fill();
  line(c, [[540, 540], [540 + cos(a0) * 340, 540 + sin(a0) * 340]], 18); line(c, [[540, 540], [540 + cos(a1) * 270, 540 + sin(a1) * 270]], 18);
  circ(c, 540, 540, 26, INK, 0);
  write(c, "23", 600, 480, 80, INK, 12);
};
const fibSquares = () => {
  const f = [1, 1, 2, 3, 5, 8], sq: number[][] = [[0, 0, 1]];
  let [x0, y0, x1, y1] = [0, 0, 1, 1];
  const sides = ["R", "T", "L", "B"];
  for (let i = 1; i < f.length; i++) {
    const s = f[i], side = sides[(i - 1) % 4];
    const [x, y] = side === "R" ? [x1, y0] : side === "L" ? [x0 - s, y0] : side === "T" ? [x0, y0 - s] : [x0, y1];
    sq.push([x, y, s]); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + s); y1 = Math.max(y1, y + s);
  }
  return sq;
};
const t10 = (c: Ctx) => {
  ground(c);
  const sq = fibSquares(), u = 68, minX = Math.min(...sq.map((s) => s[0])), minY = Math.min(...sq.map((s) => s[1])), ox = 540 - 6.5 * u, oy = 540 - 4 * u;
  const P = (x: number, y: number) => [ox + (x - minX) * u, oy + (y - minY) * u];
  const cols = [COL.yellow, COL.pink, COL.sky, COL.greenLt, COL.orange, COL.teal];
  sq.forEach(([x, y, s], i) => { const [px, py] = P(x, y); shape(c, () => c.rect(px, py, s * u, s * u), cols[i], 6); });
  const eq = (a: number[], b: number[]) => a[0] === b[0] && a[1] === b[1];
  const arcsOf = ([x, y, s]: number[]) => { const cs = [[x, y], [x + s, y], [x + s, y + s], [x, y + s]], res: { cen: number[]; p: number[]; q: number[] }[] = []; for (let i = 0; i < 4; i++) { const cen = cs[i], p = cs[(i + 1) % 4], q = cs[(i + 3) % 4]; res.push({ cen, p, q }, { cen, p: q, q: p }); } return res; };
  const go = (i: number, end: number[] | null, acc: { cen: number[]; p: number[]; q: number[] }[]): any => { if (i === sq.length) return acc; for (const a of arcsOf(sq[i])) { if (end && !eq(a.p, end)) continue; const r = go(i + 1, a.q, [...acc, a]); if (r) return r; } return null; };
  const arcs = go(0, null, []) ?? [];
  c.lineCap = "round";
  const path = () => { c.beginPath(); arcs.forEach((a: any) => { const [cx, cy] = P(a.cen[0], a.cen[1]), [px, py] = P(a.p[0], a.p[1]), [qx, qy] = P(a.q[0], a.q[1]); const a0 = atan2(py - cy, px - cx), a1 = atan2(qy - cy, qx - cx); let d = a1 - a0; while (d > PI) d -= 2 * PI; while (d < -PI) d += 2 * PI; c.arc(cx, cy, hypot(px - cx, py - cy), a0, a1, d < 0); }); };
  path(); c.strokeStyle = INK; c.lineWidth = 16; c.stroke(); path(); c.strokeStyle = RED; c.lineWidth = 8; c.stroke();
  sq.forEach(([x, y, s], i) => { const [px, py] = P(x, y), h = Math.min(s * u * 0.4, 64), t = String([1, 1, 2, 3, 5, 8][i]); write(c, t, px + s * u * (i === 5 ? 0.3 : 0.5) - h * 0.3, py + s * u * (i === 5 ? 0.5 : 0.5) - h * 0.5 - (s === 1 ? 0 : 0), h, INK, 8); });
};
const snow = (c: Ctx, x: number, y: number, L: number) => {
  const out: Seg[] = [];
  const arm = (bx: number, by: number, len: number, ang: number, d: number, w: number) => {
    out.push({ p: [[bx, by], [bx + cos(ang) * len, by + sin(ang) * len]], w, col: "#eaf6ff" });
    if (d > 0) for (const [t, f] of [[0.42, 0.42], [0.7, 0.3]]) for (const s of [-1, 1]) arm(bx + cos(ang) * len * t, by + sin(ang) * len * t, len * f, ang + s * PI / 3, d - 1, w * 0.72);
  };
  for (let k = 0; k < 6; k++) arm(x, y, L, k * PI / 3 - PI / 2, 2, L * 0.06);
  drawSegs(c, out, true, 8);
};
const t12 = (c: Ctx) => { ground(c, COL.blue); snow(c, 540, 540, 380); };

// explanations
const x0 = (c: Ctx) => {
  ground(c);
  const P = [[230, 260], [540, 540], [850, 820]];
  P.forEach(([x, y]) => circ(c, x, y, 190, "#f6efe0", 8));
  cauli(c, 230, 250, 120, 3);
  floret(c, 540, 520, 108, 2);
  floret(c, 850, 810, 78, 1);
  arrow(c, [[380, 410], [400, 430]]); arrow(c, [[690, 690], [710, 710]]);
};
const x1 = (c: Ctx) => {
  ground(c);
  const X = [30, 375, 720], Y = 260, W = 330, H = 560;
  X.forEach((x) => tile(c, x, Y, W, H, "#eef6e4"));
  drawSegs(c, treeSegs(195, Y + H - 40, 92, -PI / 2, 5, 22, COL.green, [], rnd(9), 0.55, 0.72), true, 7);
  // lungs: a windpipe splitting into two sides, each splitting again and again
  const lx = 540, lt = Y + 90;
  const lung = (s: number) => shape(c, () => { c.moveTo(lx + s * 20, lt + 60); c.bezierCurveTo(lx + s * 120, lt + 20, lx + s * 150, lt + 360, lx + s * 120, lt + 410); c.bezierCurveTo(lx + s * 60, lt + 430, lx + s * 20, lt + 380, lx + s * 20, lt + 320); c.closePath(); }, "#f7c6c6", 6);
  lung(-1); lung(1);
  const out: Seg[] = [{ p: [[lx, lt - 20], [lx, lt + 70]], w: 12, col: COL.green }];
  for (const s of [-1, 1]) treeSegs(lx, lt + 70, 62, PI / 2 + s * 0.55, 4, 9, COL.green, out, rnd(4 + s), 0.5, 0.78);
  drawSegs(c, out, true, 6);
  // leaf with veins
  const lp = () => { c.moveTo(885, Y + H - 40); c.bezierCurveTo(740, Y + 330, 770, Y + 120, 885, Y + 60); c.bezierCurveTo(1000, Y + 120, 1030, Y + 330, 885, Y + H - 40); c.closePath(); };
  shape(c, lp, COL.greenLt, 7);
  c.save(); c.beginPath(); lp(); c.clip(); drawSegs(c, frondSegs(885, Y + H - 40, 480, -PI / 2, 2, 10, COL.leafDk, [], { bend: 0, leafy: true, ang: 0.95 }), false); c.restore();
  c.beginPath(); lp(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
};
const x2 = (c: Ctx) => {
  ground(c);
  const u = coastU(21);
  const panel = (py: number, step: number) => {
    const px = 40, w = 1000, h = 400, P = (p: number[]) => [px + p[0] * w, py + h * 0.5 + p[1] * w * 0.35];
    tile(c, px, py, w, h, PAPER);
    clipTile(c, px, py, w, h, () => {
      c.fillStyle = SEA; c.fillRect(px, py, w, h);
      c.beginPath(); u.map(P).forEach(([a, b], i) => (i ? c.lineTo(a, b) : c.moveTo(a, b))); c.lineTo(px + w, py + h); c.lineTo(px, py + h); c.closePath(); c.fillStyle = LAND; c.fill();
    });
    line(c, u.map(P), 5, INK);
    const n = walkPts(u, step).map(P);
    line(c, n, 12, RED);
    n.forEach(([a, b]) => circ(c, a, b, 12, WHITE, 4));
    tile(c, px, py, w, h, "rgba(0,0,0,0)");
  };
  panel(110, 0.34); panel(570, 0.07);
};
const x4 = (c: Ctx) => {
  ground(c);
  circ(c, 540, 540, 400, COL.green, 10);
  circ(c, 540, 540, 340, COL.greenLt, 0);
  const K = 80, bump = (m: number) => { const rr = K * sqrt(m + 0.6), a = m * GA; return [540 + cos(a) * rr, 540 + sin(a) * rr, 24 + rr * 0.12]; };
  for (let m = 16; m >= 1; m--) { const [x, y, r] = bump(m); circ(c, x, y, r, m > 9 ? COL.leaf : COL.greenLt, 5); }
  const [nx, ny] = bump(0);
  c.beginPath(); c.arc(nx, ny, 36, 0, 2 * PI); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
  arrow(c, [[nx + 230, ny - 230], [nx + 50, ny - 50]]);
};
const x6 = (c: Ctx) => {
  ground(c);
  const X = [30, 375, 720], Y = 260, W = 330, H = 560;
  tile(c, X[0], Y, W, H, COL.blue); snow(c, X[0] + W / 2, Y + H / 2, 150);
  tile(c, X[1], Y, W, H, "#2b2f5c");
  clipTile(c, X[1], Y, W, H, () => {
    for (const [cx, cy, r] of [[480, 290, 70], [545, 270, 85], [610, 295, 65], [440, 305, 50]]) circ(c, cx, cy, r, "#9aa0b8", 0);
    const rr = rnd(2), o: number[][] = [[540, 350]]; for (let i = 0; i < 6; i++) o.push([o[i][0] + (rr() - 0.5) * 90, 350 + (i + 1) * 70]);
    const br = (s: number[], dir: number) => { const b = [s]; for (let i = 0; i < 3; i++) b.push([b[i][0] + dir * (30 + rr() * 30), b[i][1] + 40 + rr() * 20]); return b; };
    const bs = [br(o[2], -1), br(o[3], 1), br(o[4], -1)];
    [o, ...bs].forEach((p, i) => { line(c, p, i ? 14 : 24, COL.yellow); line(c, p, i ? 5 : 9, WHITE); });
  });
  tile(c, X[1], Y, W, H, "rgba(0,0,0,0)");
  tile(c, X[2], Y, W, H, "#eaf3fb");
  clipTile(c, X[2], Y, W, H, () => { const r = rnd(7), out: Seg[] = []; for (let k = 0; k < 7; k++) treeSegs(X[2] + W / 2, Y + H / 2, 55, k * 2 * PI / 7 + 0.2, 4, 14, PURPLE, out, r, 0.6, 0.82); drawSegs(c, out, false); circ(c, X[2] + W / 2, Y + H / 2, 26, PURPLE, 0); });
  tile(c, X[2], Y, W, H, "rgba(0,0,0,0)");
};
const tower = (c: Ctx, cx: number, by: number, w: number, h: number, d: number, col: string, dk: string) => {
  if (d > 0) for (const s of [-1, 1]) { tower(c, cx + s * w * 0.4, by, w * 0.48, h * 0.62, d - 1, col, dk); tower(c, cx + s * w * 0.22, by, w * 0.4, h * 0.82, d - 1, col, dk); }
  const body = () => { c.moveTo(cx - w / 2, by); c.bezierCurveTo(cx - w * 0.42, by - h * 0.55, cx - w * 0.1, by - h * 0.8, cx, by - h); c.bezierCurveTo(cx + w * 0.1, by - h * 0.8, cx + w * 0.42, by - h * 0.55, cx + w / 2, by); c.closePath(); };
  shape(c, body, col, 5);
  shade(c, body, dk, w * 0.12, 0, 0.6);
  for (let k = 1; k < 5; k++) { const y = by - h * k * 0.18, hw = w * 0.5 * (1 - k * 0.2) * 0.9; line(c, [[cx - hw, y], [cx + hw, y]], 3, INK); }
  circ(c, cx, by - h - 8, Math.max(6, w * 0.05), COL.yellow, 4);
};
const x7 = (c: Ctx) => {
  ground(c);
  tile(c, 30, 200, 600, 700, COL.sky);
  clipTile(c, 30, 200, 600, 700, () => { c.fillStyle = COL.soil; c.fillRect(30, 820, 600, 100); tower(c, 330, 830, 440, 560, 2, "#e8b87a", "#c98f55"); });
  tile(c, 30, 200, 600, 700, "rgba(0,0,0,0)");
  tile(c, 670, 330, 380, 440, "#3a3540");
  const kx = 860, ky = 550;
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (Math.abs(i) + Math.abs(j) <= 2) circ(c, kx + i * 56, ky + j * 56, 8, WHITE, 0);
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (Math.abs(i) + Math.abs(j) <= 2) { c.beginPath(); ell(c, kx + i * 56, ky + j * 56, 40, 40); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke(); }
};
const x8 = (c: Ctx) => {
  ground(c);
  fern(c, 240, 960, 800, -PI / 2 + 0.05, 2, 16);
  const R = 140, xs = 800, ys = [190, 540, 890];
  ys.forEach((y) => circ(c, xs, y, R, "#f3f8ec", 8));
  c.save(); c.beginPath(); ell(c, xs, ys[0], R, R); c.clip(); fern(c, xs - 90, ys[0] + 110, 230, -PI / 2.3, 1, 12); c.restore();
  c.save(); c.beginPath(); ell(c, xs, ys[1], R, R); c.clip(); drawSegs(c, frondSegs(xs - 100, ys[1] + 90, 200, -PI / 5, 1, 12, COL.green, [], { bend: 0.3, ang: 1.1 }), true, 6); c.restore();
  leaf(c, xs - 70, ys[2] + 60, 190, -PI / 5, COL.green);
  ys.forEach((y) => circ(c, xs, y, R, "rgba(0,0,0,0)", 8));
  arrow(c, [[xs, ys[0] + R + 8], [xs, ys[1] - R - 8]]); arrow(c, [[xs, ys[1] + R + 8], [xs, ys[2] - R - 8]]);
};

export const ic_patternsSymmetryFractalsAndSpiralsL3 = cards("sci.patterns-symmetry.fractals-and-spirals.L3 cards", [
  intro, summary, e1, a1, a2, a3, a4, a6, p1, c1, c2, t1, t3, t5, t6, t7, t9, t10, t12, x0, x1, x2, x4, x6, x7, x8,
]);
void SKIN; void D; void COL.orange;
