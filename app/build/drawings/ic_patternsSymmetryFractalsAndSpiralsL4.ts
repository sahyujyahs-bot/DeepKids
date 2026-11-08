import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, leaf, write, cards } from "./flatKit";

// FRACTALS AND SPIRALS L4 · flat cards. No people: geometry, plants, paper. Everything is computed, nothing is placed by eye.
const PI = Math.PI;
const GRID = "#b9c7dd";
const ctrX = (t: string, cx: number, h: number) => cx - ((t.length - 1) * 0.8 * h + 0.6 * h) / 2;
const num = (c: Ctx, t: string, cx: number, y: number, h: number, col: string = INK, w = 6) => write(c, t, ctrX(t, cx, h), y, h, col, w);
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x + 14, y + 16, w, h, 10), SH, 0);
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6);
};
const dot = (c: Ctx, x: number, y: number, r: number, col: string, lw = 4) => shape(c, () => ell(c, x, y, r, r), col, lw);
const bubble = (c: Ctx, x: number, y: number, r: number, t: string) => { dot(c, x, y, r, WHITE, 5); num(c, t, x, y - r * 0.5, r * 1.0, INK, 5); };

// ---------------------------------------------------------------- the coast (unit square), same on every card
const coastU = (() => {
  const r = rnd(11);
  let pts: number[][] = [[0.04, 0.5], [0.96, 0.5]];
  for (let lv = 0; lv < 7; lv++) {
    const out: number[][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), d = (r() - 0.5) * len * 0.85;
      const mx = Math.min(0.94, Math.max(0.06, (a[0] + b[0]) / 2 - (dy / len) * d)), my = Math.min(0.94, Math.max(0.06, (a[1] + b[1]) / 2 + (dx / len) * d));
      out.push(a, [mx, my]);
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
})();
// boxes (cm wide, page is 20 cm) that the coast passes through
const touched = (cm: number) => {
  const n = 20 / cm, set = new Set<number>();
  for (let i = 0; i < coastU.length - 1; i++) {
    const [ax, ay] = coastU[i], [bx, by] = coastU[i + 1], steps = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay) / 0.0015));
    for (let s = 0; s <= steps; s++) { const x = ax + ((bx - ax) * s) / steps, y = ay + ((by - ay) * s) / steps; set.add(Math.min(n - 1, Math.floor(y * n)) * n + Math.min(n - 1, Math.floor(x * n))); }
  }
  return set;
};
// a square page S wide at (x, y); cm = box width (0: plain page); the coast drawn on it
const coastPage = (c: Ctx, x: number, y: number, S: number, cm: number, shaded: boolean, coast = true) => {
  paper(c, x, y, S, S);
  if (cm > 0) {
    const n = 20 / cm, q = S / n;
    if (shaded) { c.fillStyle = "rgba(255,211,77,0.75)"; touched(cm).forEach((id) => c.fillRect(x + (id % n) * q, y + Math.floor(id / n) * q, q, q)); }
    c.strokeStyle = cm >= 2 ? COL.blueDk : GRID; c.lineWidth = cm >= 4 ? 5 : cm >= 2 ? 3 : 1.6; c.lineCap = "butt";
    for (let i = 1; i < n; i++) { c.beginPath(); c.moveTo(x + i * q, y + 3); c.lineTo(x + i * q, y + S - 3); c.moveTo(x + 3, y + i * q); c.lineTo(x + S - 3, y + i * q); c.stroke(); }
    shape(c, () => rrect(c, x, y, S, S, 10), "rgba(0,0,0,0)", 6);
  }
  if (coast) line(c, coastU.map(([u, v]) => [x + u * S, y + v * S]), Math.max(4, S * 0.011), RED);
};

// ================================================================ SET-UP CARDS
const setupE1_0 = (c: Ctx) => {
  ground(c);
  paper(c, 140, 140, 800, 800);
  c.fillStyle = "rgba(255,211,77,0.8)"; c.fillRect(140, 500, 800, 40);
  c.strokeStyle = GRID; c.lineWidth = 3;
  for (let i = 1; i < 20; i++) { c.beginPath(); c.moveTo(140 + i * 40, 143); c.lineTo(140 + i * 40, 937); c.moveTo(143, 140 + i * 40); c.lineTo(937, 140 + i * 40); c.stroke(); }
  shape(c, () => rrect(c, 140, 140, 800, 800, 10), "rgba(0,0,0,0)", 6);
  line(c, [[140, 520], [940, 520]], 12, RED);
  line(c, [[140, 490], [140, 550]], 8, RED); line(c, [[940, 490], [940, 550]], 8, RED);
  write(c, "20 cm", 410, 972, 70);
};
const setupE1_1 = (c: Ctx) => { ground(c); coastPage(c, 140, 140, 800, 0, false); };
const setupE1_2 = (c: Ctx) => { ground(c); coastPage(c, 140, 120, 800, 4, true); write(c, "4 cm", 440, 965, 70); };
const setupE1_3 = (c: Ctx) => {
  ground(c);
  coastPage(c, 40, 270, 470, 2, true); coastPage(c, 570, 270, 470, 1, true);
  write(c, "2 cm", 190, 800, 60); write(c, "1 cm", 720, 800, 60);
};

// the potted plant: leaves climb the stem, one on each side in turn, a numbered paper tag on each
const setupE2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 935, 250, 32);
  shape(c, () => polyP(c, [[425, 845], [655, 845], [632, 932], [448, 932]]), COL.orange);
  shade(c, () => polyP(c, [[425, 845], [655, 845], [632, 932], [448, 932]]), "#d27c25", -40, 0, 0.6);
  shape(c, () => rrect(c, 395, 805, 290, 52, 12), COL.orange);
  shape(c, () => ell(c, 540, 812, 125, 14), COL.soilDk, 4);
  line(c, [[540, 812], [540, 190]], 26, INK); line(c, [[540, 812], [540, 190]], 14, COL.green);
  const tags: [number, number, number][] = [];
  for (let k = 0; k < 9; k++) {
    const y = 760 - 68 * k, len = 250 - 14 * k, an = k % 2 === 0 ? -0.5 : PI + 0.5;
    leaf(c, 540, y, len, an, k % 2 ? COL.leaf : COL.greenLt);
    tags.push([540 + Math.cos(an) * len, y + Math.sin(an) * len, k]);
  }
  leaf(c, 540, 200, 70, -PI / 2, COL.greenLt);
  tags.forEach(([tx, ty, k]) => {
    line(c, [[tx, ty], [tx, ty + 34]], 4);
    shape(c, () => rrect(c, tx - 32, ty + 34, 64, 58, 8), WHITE, 5);
    num(c, String(k), tx, ty + 34 + 10, 38);
  });
};

// the same plant from above: leaf k is turned 144 degrees from leaf k-1 (2 turns in 5 leaves); a thread follows 0, 1, 2 ...
const topLeaves = (c: Ctx, cx: number, cy: number, L: (k: number) => number, n: number) => {
  const tips: number[][] = [];
  for (let k = 0; k < n; k++) {
    const an = -PI / 2 + k * 2.5132741, len = L(k);
    leaf(c, cx, cy, len, an, k % 2 ? COL.leaf : COL.greenLt);
    tips.push([cx + Math.cos(an) * len, cy + Math.sin(an) * len]);
  }
  dot(c, cx, cy, 20, COL.brown, 5);
  return tips;
};
const setupE2_1 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 560, tips = topLeaves(c, cx, cy, (k) => 380 - 34 * k, 9);
  line(c, tips.slice(0, 6), 8, RED);
  tips.forEach(([x, y], k) => bubble(c, x, y, 30, String(k)));
};
const setupE2_2 = (c: Ctx) => {
  ground(c);
  paper(c, 130, 190, 820, 600);
  const cw = 205, hy = 190, hh = 140, rh = 150;
  c.strokeStyle = INK; c.lineWidth = 5;
  for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(130 + i * cw, hy); c.lineTo(130 + i * cw, hy + 600); c.stroke(); }
  for (let j = 0; j < 3; j++) { c.beginPath(); c.moveTo(130, hy + hh + j * rh); c.lineTo(950, hy + hh + j * rh); c.stroke(); }
  c.fillStyle = "rgba(143,195,234,0.45)"; c.fillRect(133, hy + 3, 814, hh - 3);
  // headings in pictures: a leaf, a turn, a fraction, an angle
  const cell = (i: number) => 130 + i * cw + cw / 2, hc = hy + hh / 2;
  leaf(c, cell(0) - 50, hc + 20, 100, -0.5, COL.leaf);
  c.beginPath(); c.arc(cell(1), hc, 40, -2.4, 2.6); c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
  arrow(c, [[cell(1) + 36, hc + 28], [cell(1) + 28, hc + 40]], INK, 9);
  line(c, [[cell(2) - 30, hc], [cell(2) + 30, hc]], 8); dot(c, cell(2), hc - 30, 9, INK, 0); dot(c, cell(2), hc + 30, 9, INK, 0);
  line(c, [[cell(3) - 55, hc + 45], [cell(3) + 55, hc + 45], [cell(3) + 20, hc - 45]], 8);
  c.beginPath(); c.arc(cell(3) - 55, hc + 45, 40, -0.9, 0); c.strokeStyle = RED; c.lineWidth = 7; c.stroke();
  const ry = hy + hh + rh / 2;
  num(c, "5", cell(0), ry - 38, 76); num(c, "2", cell(1), ry - 38, 76);
  num(c, "2", cell(2), ry - 62, 56); line(c, [[cell(2) - 38, ry], [cell(2) + 38, ry]], 7); num(c, "5", cell(2), ry + 12, 56);
  num(c, "144°", cell(3) + 6, ry - 34, 68);
  // a pencil lying across the foot of the page
  c.save(); c.translate(540, 905); c.rotate(-0.06);
  shape(c, () => rrect(c, -300, -20, 480, 40, 6), COL.yellow, 5);
  shape(c, () => polyP(c, [[180, -20], [250, 0], [180, 20]]), "#f1d2a6", 5);
  shape(c, () => polyP(c, [[232, -7], [250, 0], [232, 7]]), INK, 2);
  shape(c, () => rrect(c, -300, -20, 50, 40, 6), COL.pink, 5);
  c.restore();
};

// ================================================================ CARD PICTURES
const flowE1 = (c: Ctx) => {
  ground(c);
  const S = 310, xs = [55, 385, 715], cms = [4, 2, 1];
  xs.forEach((x, i) => {
    coastPage(c, x, 250, S, cms[i], true);
    num(c, String(touched(cms[i]).size), x + S / 2, 640, 110, INK, 11);
    write(c, `${cms[i]} cm`, x + S / 2 - 70, 800, 54);
  });
};
const flowE2 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 520, tips = topLeaves(c, cx, cy, () => 300, 5);
  for (let k = 0; k < 5; k++) { const a = tips[k], b = tips[(k + 1) % 5]; arrow(c, [a, [a[0] + (b[0] - a[0]) * 0.9, a[1] + (b[1] - a[1]) * 0.9]], RED, 8); }
  tips.forEach(([x, y], k) => bubble(c, x, y, 30, String(k)));
  const arc: number[][] = []; for (let i = 0; i <= 20; i++) { const a = -PI / 2 + (2.5132741 * i) / 20; arc.push([cx + Math.cos(a) * 95, cy + Math.sin(a) * 95]); }
  arrow(c, arc, INK, 9);
  shape(c, () => rrect(c, 410, 880, 260, 110, 18), WHITE, 6);
  num(c, "144°", 540, 905, 66);
};

const kochPts = (a: number[], b: number[], d: number): number[][] => {
  if (d === 0) return [a, b];
  const dx = (b[0] - a[0]) / 3, dy = (b[1] - a[1]) / 3, p1 = [a[0] + dx, a[1] + dy], p3 = [a[0] + 2 * dx, a[1] + 2 * dy];
  const co = Math.cos(-PI / 3), si = Math.sin(-PI / 3), p2 = [p1[0] + dx * co - dy * si, p1[1] + dx * si + dy * co];
  return [...kochPts(a, p1, d - 1).slice(0, -1), ...kochPts(p1, p2, d - 1).slice(0, -1), ...kochPts(p2, p3, d - 1).slice(0, -1), ...kochPts(p3, b, d - 1)];
};
const flowA1 = (c: Ctx) => {
  ground(c);
  const rows: [number, number, string, string][] = [[280, 0, "27", INK], [600, 1, "36", COL.blueDk], [920, 2, "48", COL.purple]];
  rows.forEach(([y, d, n, col]) => {
    shadow(c, 540, y + 16, 380, 9);
    line(c, kochPts([190, y], [890, y], d), 12, INK); line(c, kochPts([190, y], [890, y], d), 6, col);
    write(c, `${n} cm`, 30, y - 70, 40);
  });
};

const spiralDots = (c: Ctx, cx: number, cy: number, rs: number[]) => rs.forEach((r) => dot(c, cx + r, cy, 11, RED, 4));
const ruler = (c: Ctx, x: number, y: number, len: number) => {
  shape(c, () => rrect(c, x, y - 18, len, 36, 4), COL.wood, 5);
  c.strokeStyle = INK; c.lineWidth = 3;
  for (let i = 0; i * 14 < len - 10; i++) { c.beginPath(); c.moveTo(x + 8 + i * 14, y + 18); c.lineTo(x + 8 + i * 14, y + (i % 5 === 0 ? 4 : 10)); c.stroke(); }
};
const flowA2 = (c: Ctx) => {
  ground(c);
  const cy = 470, lx = 270, rx = 800, b = 70 / (2 * PI);
  // rope coil: equal gaps
  const rope: number[][] = []; for (let t = 0; t <= 6 * PI; t += 0.05) { const r = 30 + b * t; rope.push([lx + r * Math.cos(t), cy + r * Math.sin(t)]); }
  line(c, rope, 38, INK); line(c, rope, 26, "#d9a35c");
  // shell: each turn 1.5 times wider than the one inside it
  const k = Math.log(1.5) / (2 * PI), r0 = 240 / Math.pow(1.5, 4), sh: number[][] = [], wd: number[] = [];
  for (let t = 0; t <= 8 * PI; t += 0.05) { const r = r0 * Math.exp(k * t); sh.push([rx + r * Math.cos(t), cy + r * Math.sin(t)]); wd.push(8 + r * 0.16); }
  for (let i = 1; i < sh.length; i++) line(c, [sh[i - 1], sh[i]], wd[i] + 10, INK);
  for (let i = 1; i < sh.length; i++) line(c, [sh[i - 1], sh[i]], wd[i], COL.pink);
  ruler(c, lx, cy, 275); ruler(c, rx, cy, 275);
  const ra = [30, 100, 170, 240], rb = [0, 1, 2, 3, 4].map((n) => r0 * Math.pow(1.5, n));
  spiralDots(c, lx, cy, ra); spiralDots(c, rx, cy, rb.map((r) => r));
  // the gaps measured, as bars
  const bars = (x0: number, rs: number[]) => { for (let i = 1; i < rs.length; i++) shape(c, () => rrect(c, x0 + rs[i - 1], 800, rs[i] - rs[i - 1], 44, 4), i % 2 ? COL.orange : COL.teal, 5); };
  bars(lx, ra); bars(rx, rb);
};

const dragonPts = (order: number) => {
  let x = 0, y = 0, h = 0; const pts = [[0, 0]]; const n = 2 ** order;
  for (let i = 0; i <= n - 1; i++) {
    if (i > 0) { let m = i; while (m % 2 === 0) m /= 2; h += m % 4 === 1 ? 1 : -1; }
    x += Math.cos((h * PI) / 2); y += Math.sin((h * PI) / 2); pts.push([Math.round(x), Math.round(y)]);
  }
  return pts;
};
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 170, 800, 44, 6), COL.paper, 5);
  for (let i = 1; i < 16; i++) line(c, [[140 + i * 50, 170], [140 + i * 50, 214]], 5, RED);
  arrow(c, [[540, 245], [540, 330]], RED, 10);
  const p = dragonPts(4), xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = Math.min(760 / (x1 - x0), 560 / (y1 - y0));
  const ox = 540 - ((x0 + x1) / 2) * s, oy = 690 - ((y0 + y1) / 2) * s, q = p.map(([x, y]) => [ox + x * s, oy + y * s]);
  line(c, q, 30, INK); line(c, q, 20, COL.yellow);
};

const flowA4 = (c: Ctx) => {
  ground(c);
  paper(c, 90, 120, 900, 860);
  const A = [170, 860], B = [910, 860], C = [540, 219], r = rnd(3);
  let x = 540, y = 600;
  for (let i = 0; i < 900; i++) { const t = [A, B, C][Math.floor(r() * 3)]; x = (x + t[0]) / 2; y = (y + t[1]) / 2; if (i > 4) dot(c, x, y, 4.5, COL.purple, 0); }
  dot(c, A[0], A[1], 22, COL.red); dot(c, B[0], B[1], 22, COL.blue); dot(c, C[0], C[1], 22, COL.green);
  // a die lying on the page showing 4
  c.save(); c.translate(850, 260); c.rotate(0.15);
  shadow(c, 12, 70, 70, 14);
  shape(c, () => rrect(c, -60, -60, 120, 120, 18), WHITE, 6);
  [[-28, -28], [28, -28], [-28, 28], [28, 28]].forEach(([px, py]) => dot(c, px, py, 11, INK, 0));
  c.restore();
};

const sier = (c: Ctx, x: number, y: number, s: number, d: number, idx: { n: number }) => {
  if (d === 0) {
    const col = Math.floor(idx.n / 3) % 2 ? COL.teal : COL.orange; idx.n++;
    shape(c, () => polyP(c, [[x, y], [x + s, y], [x + s / 2, y - s * 0.866]]), col, 4);
    return;
  }
  sier(c, x, y, s / 2, d - 1, idx); sier(c, x + s / 2, y, s / 2, d - 1, idx); sier(c, x + s / 4, y - s * 0.433, s / 2, d - 1, idx);
};
const flowP1 = (c: Ctx) => {
  ground(c);
  paper(c, 100, 110, 880, 860);
  sier(c, 150, 878, 780, 3, { n: 0 });
};

// ---- terms
const nautilus = (c: Ctx) => {
  ground(c);
  const R = 420, k = Math.log(3) / (2 * PI), cx = 451, cy = 608, t0 = 2.2 * PI, t1 = 6 * PI;
  const P = (t: number, sc = 1): number[] => { const r = R * Math.exp(k * (t - t1)) * sc; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const outer: number[][] = []; for (let t = t0; t <= t1; t += 0.04) outer.push(P(t));
  const last: number[][] = []; for (let t = 4 * PI; t <= t1; t += 0.04) last.push(P(t));
  shadow(c, cx + 60, cy + 175, 300, 22);
  shape(c, () => polyP(c, last), "#fff1d6", 0);
  for (let t = 4.2 * PI; t <= 5.9 * PI; t += 0.21 * PI) {
    const a = P(t), bq = P(t - 2 * PI), m = P(t - 0.55, 0.58);
    c.beginPath(); c.moveTo(bq[0], bq[1]); c.quadraticCurveTo(m[0], m[1], a[0], a[1]); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  }
  line(c, outer, 26, INK); line(c, outer, 14, COL.orange);
  const gap = (n: number) => { const a = P(2 * PI * n), b = P(2 * PI * (n + 1)), y = cy; arrow(c, [[(a[0] + b[0]) / 2, y], [a[0] + 14, y]], RED, 8); arrow(c, [[(a[0] + b[0]) / 2, y], [b[0] - 14, y]], RED, 8); };
  gap(1); gap(2);
};
const whorlShell = (c: Ctx) => {
  ground(c);
  const cx = 540, Y = [140, 262, 378, 492, 606, 728, 905], W = [8, 42, 76, 110, 146, 184, 222], cols = [COL.pink, COL.orange, COL.yellow, COL.greenLt, COL.teal, COL.purple], sl = 14;
  shadow(c, cx + 20, 925, 270, 26);
  for (let i = 0; i < 6; i++) {
    const wt = W[i], wb = W[i + 1], yt = Y[i], yb = Y[i + 1], bw = (wt + wb) / 2 + 14;
    const path = () => { c.moveTo(cx - wt, yt - sl); c.quadraticCurveTo(cx, yt + 22, cx + wt, yt + sl); c.quadraticCurveTo(cx + bw + 6, (yt + yb) / 2, cx + wb, yb + sl); c.quadraticCurveTo(cx, yb + 36, cx - wb, yb - sl); c.quadraticCurveTo(cx - bw - 6, (yt + yb) / 2, cx - wt, yt - sl); c.closePath(); };
    shape(c, path, cols[i], 6); shade(c, path, "rgba(43,35,64,0.5)", -34, 0, 0.35);
  }
  shape(c, () => ell(c, cx + 70, 835, 70, 46, 0.35), "#7a3b2e", 6);
  shape(c, () => ell(c, cx + 70, 840, 46, 28, 0.35), "#4a2220", 0);
};
const cyclone = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); rrect(c, 140, 140, 800, 800, 24); c.clip();
  c.fillStyle = "#1f5a99"; c.fillRect(140, 140, 800, 800);
  c.fillStyle = "#8a7a4a"; c.beginPath(); c.moveTo(140, 640); c.lineTo(205, 610); c.lineTo(250, 680); c.lineTo(235, 770); c.lineTo(300, 850); c.lineTo(270, 940); c.lineTo(140, 940); c.closePath(); c.fill();
  const cx = 560, cy = 540;
  c.lineCap = "round"; c.lineJoin = "round";
  [[70, 0.30], [48, 0.5], [24, 0.85]].forEach(([w, al]) => {
    c.strokeStyle = `rgba(255,255,255,${al})`;
    for (let a = 0; a < 4; a++) { c.beginPath(); for (let i = 0; i <= 60; i++) { const t = i / 60, ang = a * (PI / 2) - 4.4 * t, r = 360 * Math.pow(1 - t, 1.25) + 60; c.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang)); } c.lineWidth = w * 0.75; c.stroke(); }
  });
  c.beginPath(); ell(c, cx, cy, 78, 78); c.fillStyle = "rgba(255,255,255,0.95)"; c.fill();
  c.beginPath(); ell(c, cx, cy, 34, 34); c.fillStyle = "#1f5a99"; c.fill();
  c.restore();
  shape(c, () => rrect(c, 140, 140, 800, 800, 24), "rgba(0,0,0,0)", 8);
};

export const ic_patternsSymmetryFractalsAndSpiralsL4 = cards("sci.patterns-symmetry.fractals-and-spirals.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE2_0, setupE2_1, setupE2_2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, nautilus, whorlShell, cyclone,
]);
void D; void BG;
