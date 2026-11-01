import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, hand, line, polyP, rrect, shade, shadow, shape, write } from "./flatKit";
import type { Ctx } from "./core";

// sci.sky.solar-system.L3 set-up cards.
// e1 (light through a window): one scene seen from a corner of the table; the beam runs away up and to the right,
// 1 cm = 13 px across and 5 px up. e2 (marble and missing rim): the plate seen from above on a newspaper.
const CLOTHBG = "#bcd9d3", CLOTHLN = "#a3c6bf", KRAFT = "#e7c28c", KRAFT_DK = "#c99e5e", BEAM = "rgba(255,214,60,0.42)";

// ---------------------------------------------------------------- e1 scene
const X0 = 110, Y0 = 920, DX = 13, DY = 5;
const P = (x: number, h: number, z: number): number[] => [X0 + x + z * DX, Y0 - h - z * DY];
const TORCH_H = 200;

const tableTop = (c: Ctx) => {
  ground(c);
  c.fillStyle = CLOTHBG; c.fillRect(0, 150, 1080, 930);
  line(c, [[0, 150], [1080, 150]], 6);
  for (let x0 = -700; x0 < 1100; x0 += 130) line(c, [[x0, 1080 + 30], [x0 + 15 * 130, 1080 + 30 - 7 * 130]], 4, CLOTHLN);
  line(c, [[0, 150], [1080, 150]], 6);
};
const ruler = (c: Ctx, len: number) => {
  const a = 215, b = 255, z1 = len;
  shape(c, () => polyP(c, [P(a, 0, 0), P(b, 0, 0), P(b, 0, z1), P(a, 0, z1)]), COL.wood, 5);
  for (let z = 0; z <= z1; z += 2) { const [x, y] = P(a, 0, z); line(c, [[x, y], [x + (z % 10 === 0 ? 22 : z % 5 === 0 ? 16 : 9), y - (z % 10 === 0 ? 10 : z % 5 === 0 ? 7 : 4)]], z % 10 === 0 ? 4 : 2.5); }
  for (let z = 10; z <= z1; z += 10) { const [x, y] = P(b + 12, 0, z); write(c, String(z), x, y - 22, 30, INK, 5); if (z + 10 > z1) write(c, "cm", x + 52, y - 18, 24, INK, 5); }
};
const phone = (c: Ctx) => {
  const [x, y] = P(-45, 220, 0);
  shape(c, () => rrect(c, x, y, 90, 220, 14), COL.teal, 6);
  shade(c, () => rrect(c, x, y, 90, 220, 14), COL.tealDk, -12, -12, 0.55);
  shape(c, () => rrect(c, x + 10, y + 14, 70, 188, 8), "#22303a", 4);
  line(c, [[x + 20, y + 30], [x + 20, y + 100]], 6, "rgba(255,255,255,0.35)");
};
const books = (c: Ctx) => {
  const cols = [COL.red, COL.blue, COL.yellow];
  cols.forEach((col, i) => {
    const [x, y] = P(-75, (i + 1) * 28, 3);
    shape(c, () => rrect(c, x, y, 150, 28, 4), col, 5);
    shape(c, () => rrect(c, x + 16, y + 8, 130, 12, 3), COL.paper, 3);
  });
};
const glow = (c: Ctx) => {
  const [x, y] = P(0, TORCH_H + 6, 0);
  for (let k = 0; k < 10; k++) { const a = -Math.PI * 0.1 - k * (Math.PI * 1.2 / 9); line(c, [[x + Math.cos(a) * 36, y + Math.sin(a) * 36], [x + Math.cos(a) * 70, y + Math.sin(a) * 70]], 7, COL.yellow); }
  c.beginPath(); ell(c, x, y, 36, 36); c.fillStyle = "rgba(255,226,90,0.55)"; c.fill();
  shape(c, () => ell(c, x, y, 20, 20), WHITE, 5);
};
const card = (c: Ctx) => {
  const z = 10, l = P(-60, 25, z), tr = P(60, 290, z);
  const w = 120, h = 265, x = l[0], y = tr[1], hole = P(-15, TORCH_H + 15, z);
  const path = () => { rrect(c, x, y, w, h, 6); c.moveTo(hole[0], hole[1]); c.lineTo(hole[0], hole[1] + 30); c.lineTo(hole[0] + 30, hole[1] + 30); c.lineTo(hole[0] + 30, hole[1]); c.closePath(); };
  shadow(c, x + w / 2 + 14, y + h + 4, 70, 14);
  shape(c, path, KRAFT, 6);
  shade(c, path, KRAFT_DK, -14, -10, 0.5);
  c.save(); c.beginPath(); path(); c.clip();
  const [hx, hy] = [hole[0] + 15, hole[1] + 15];
  for (const r of [150, 110, 70]) { c.beginPath(); ell(c, hx, hy, r, r); c.fillStyle = "rgba(255,226,90,0.2)"; c.fill(); }
  c.restore();
  shape(c, path, "rgba(0,0,0,0)", 6);
  // the lump of dough that holds it up
  const [dx, dy] = P(0, 0, z - 0.6);
  shape(c, () => { c.moveTo(dx - 62, dy); c.bezierCurveTo(dx - 70, dy - 52, dx - 20, dy - 62, dx + 4, dy - 52); c.bezierCurveTo(dx + 40, dy - 66, dx + 74, dy - 40, dx + 62, dy); c.bezierCurveTo(dx + 30, dy + 12, dx - 30, dy + 12, dx - 62, dy); c.closePath(); }, "#efdcb6", 6);
  shade(c, () => { c.moveTo(dx - 62, dy); c.bezierCurveTo(dx - 70, dy - 52, dx - 20, dy - 62, dx + 4, dy - 52); c.bezierCurveTo(dx + 40, dy - 66, dx + 74, dy - 40, dx + 62, dy); c.bezierCurveTo(dx + 30, dy + 12, dx - 30, dy + 12, dx - 62, dy); c.closePath(); }, "#d8bf8e", -10, -10, 0.55);
};
const quads = (c: Ctx, a: number[][], b: number[][], col: string) => {
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; c.beginPath(); polyP(c, [a[i], a[j], b[j], b[i]]); c.fillStyle = col; c.fill(); }
};
const square = (z: number, half: number): number[][] => [P(-half, TORCH_H + half, z), P(half, TORCH_H + half, z), P(half, TORCH_H - half, z), P(-half, TORCH_H - half, z)];
// the squared paper on its book, z cm from the phone; n = the lit patch is n x n squares
const paperBoard = (c: Ctx, z: number, n: number, dim: boolean) => {
  const bl = P(-130, 0, z), th = [30, -14];
  shadow(c, bl[0] + 150, bl[1] + 8, 170, 20);
  shape(c, () => polyP(c, [[bl[0] + 260, bl[1]], [bl[0] + 260 + th[0], bl[1] + th[1]], [bl[0] + 260 + th[0], bl[1] - 330 + th[1]], [bl[0] + 260, bl[1] - 330]]), COL.paper, 5);
  shape(c, () => polyP(c, [[bl[0], bl[1] - 330], [bl[0] + th[0], bl[1] - 330 + th[1]], [bl[0] + 260 + th[0], bl[1] - 330 + th[1]], [bl[0] + 260, bl[1] - 330]]), COL.blueDk, 5);
  shape(c, () => rrect(c, bl[0], bl[1] - 330, 260, 330, 6), COL.blue, 6);
  // the paper
  const px = bl[0] + 10, py = bl[1] - 290;
  shape(c, () => rect(c, px, py, 240, 210), WHITE, 5);
  // the lit patch under the grid
  const half = 15 * n, cx = P(0, TORCH_H, z);
  c.fillStyle = dim ? "#fff1b0" : "#ffe14a"; c.fillRect(cx[0] - half, cx[1] - half, half * 2, half * 2);
  for (let k = 1; k < 8; k++) line(c, [[px + k * 30, py], [px + k * 30, py + 210]], 2, "#7fa6c8");
  for (let k = 1; k < 7; k++) line(c, [[px, py + k * 30], [px + 240, py + k * 30]], 2, "#7fa6c8");
  c.lineWidth = 4; c.strokeStyle = INK; c.strokeRect(cx[0] - half, cx[1] - half, half * 2, half * 2);
  for (const sx of [px + 30, px + 180]) shape(c, () => polyP(c, [[sx, py - 8], [sx + 40, py - 8], [sx + 40, py + 14], [sx, py + 14]]), "rgba(255,240,170,0.8)", 2);
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };

const e1 = (c: Ctx, o: { s: number; tx: number; ty: number; ruler: number; z?: number; n?: number; dim?: boolean; move?: boolean }) => {
  tableTop(c);
  c.save(); c.translate(o.tx, o.ty); c.scale(o.s, o.s);
  ruler(c, o.ruler);
  if (o.z && o.n) {
    paperBoard(c, o.z, o.n, !!o.dim);
    quads(c, square(10, 15), square(o.z, 15 * o.n), BEAM);
    for (let i = 0; i < 4; i++) line(c, [square(10, 15)[i], square(o.z, 15 * o.n)[i]], 3, "rgba(255,190,30,0.85)");
  }
  card(c);
  quads(c, [P(0, TORCH_H, 0), P(0, TORCH_H, 0), P(0, TORCH_H, 0), P(0, TORCH_H, 0)], square(10, 15), "rgba(255,214,60,0.5)");
  shadow(c, P(8, 0, 0)[0], P(0, 0, 0)[1] + 6, 62, 14);
  books(c); phone(c); glow(c);
  if (o.move) arrow(c, [P(168, 0, 25), P(168, 0, 36)], RED, 12);
  c.restore();
};

// setup.e1.0
const e1s0 = (c: Ctx) => e1(c, { s: 1.8, tx: -56, ty: -837, ruler: 14 });
// setup.e1.1
const e1s1 = (c: Ctx) => e1(c, { s: 1.3, tx: -26, ty: -383, ruler: 26, z: 20, n: 2 });
// setup.e1.2
const e1s2 = (c: Ctx) => e1(c, { s: 1.1, tx: -39, ty: -186, ruler: 42, z: 40, n: 4, dim: true, move: true });

// ---------------------------------------------------------------- e2 scene
const GAP0 = -Math.PI / 4, GAP1 = Math.PI / 4, R = 260, FLOOR = R * 0.68, NEWS = "#ece7da";
const bars = (c: Ctx, x: number, y: number, w: number, n: number, col = "#c4bfb3") => { for (let k = 0; k < n; k++) shape(c, () => rrect(c, x, y + k * 26, k % 5 === 4 ? w * 0.6 : w, 10, 5), col, 0); };
const newspaper = (c: Ctx) => {
  ground(c, CLOTHBG);
  c.save(); c.translate(540, 540); c.rotate(-0.05);
  shadow(c, 14, 22, 505, 480);
  shape(c, () => rrect(c, -480, -470, 960, 940, 6), NEWS, 6);
  shape(c, () => rrect(c, -440, -430, 880, 70, 6), "#8d8a94", 0);
  line(c, [[-440, -340], [440, -340]], 4, "#8d8a94");
  for (let i = 0; i < 3; i++) bars(c, -440 + i * 300, -310, 280, 22);
  line(c, [[-480, 0], [480, 0]], 3, "rgba(43,35,64,0.12)");
  c.restore();
};
// a piece of the plate's rim: the part of the ring from angle a0 to a1 round (cx, cy)
const rimPath = (c: Ctx, cx: number, cy: number, a0: number, a1: number) => () => { c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, FLOOR, a1, a0, true); c.closePath(); };
const pleats = (c: Ctx, cx: number, cy: number, a0: number, a1: number) => { for (let a = a0 + 0.1; a < a1 - 0.05; a += 0.17) line(c, [[cx + Math.cos(a) * (FLOOR + 14), cy + Math.sin(a) * (FLOOR + 14)], [cx + Math.cos(a) * (R - 12), cy + Math.sin(a) * (R - 12)]], 3, "rgba(43,35,64,0.28)"); };
const plateTop = (c: Ctx, cx: number, cy: number, cut = true) => {
  const a0 = cut ? GAP1 : 0, a1 = cut ? GAP0 + Math.PI * 2 : Math.PI * 2;
  c.save(); c.translate(16, 22); c.fillStyle = "rgba(43,35,64,0.16)"; c.beginPath(); rimPath(c, cx, cy, a0, a1)(); c.fill(); c.beginPath(); ell(c, cx, cy, FLOOR, FLOOR); c.fill(); c.restore();
  shape(c, rimPath(c, cx, cy, a0, a1), "#ffd96b", 6);
  shade(c, rimPath(c, cx, cy, a0, a1), "#e3a93f", -16, -16, 0.5);
  pleats(c, cx, cy, a0, a1);
  shape(c, () => ell(c, cx, cy, FLOOR, FLOOR), COL.paper, 6);
  shade(c, () => ell(c, cx, cy, FLOOR, FLOOR), COL.cloth, -10, -10, 0.8);
};
const marble = (c: Ctx, x: number, y: number) => {
  const r = 34;
  shadow(c, x + 9, y + 12, r, r * 0.85);
  shape(c, () => ell(c, x, y, r, r), COL.blue, 5);
  shade(c, () => ell(c, x, y, r, r), COL.blueDk, -9, -9, 0.6);
  line(c, [[x - 18, y + 4], [x - 4, y - 10], [x + 12, y - 6], [x + 20, y + 8]], 5, WHITE);
  line(c, [[x - 4, y + 16], [x + 8, y + 10]], 4, COL.yellow);
  shape(c, () => ell(c, x - 10, y - 12, 6, 4, -0.6), WHITE, 0);
};
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number): number[][] => { const out: number[][] = [], n = 16; for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return out; };
const deg = (d: number) => (d * Math.PI) / 180;

// setup.e2.0
const e2s0 = (c: Ctx) => {
  newspaper(c);
  plateTop(c, 400, 500);
  // the quarter of the rim that was cut off, lying beside
  const pcx = 990, pcy = 860, a0 = deg(135), a1 = deg(225);
  c.save(); c.translate(16, 22); c.fillStyle = "rgba(43,35,64,0.16)"; c.beginPath(); rimPath(c, pcx, pcy, a0, a1)(); c.fill(); c.restore();
  shape(c, rimPath(c, pcx, pcy, a0, a1), "#ffd96b", 6);
  shade(c, rimPath(c, pcx, pcy, a0, a1), "#e3a93f", -14, -14, 0.5);
  pleats(c, pcx, pcy, a0, a1);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  newspaper(c);
  const cx = 430, cy = 480;
  plateTop(c, cx, cy);
  arrow(c, arcPts(cx, cy, 112, deg(112), deg(245)), RED, 12);
  const a = deg(100), mx = cx + Math.cos(a) * (FLOOR - 6), my = cy + Math.sin(a) * (FLOOR - 6);
  marble(c, mx, my);
  hand(c, 590, 830, Math.atan2(my - 830, mx - 590) + 0.05, 2, SKIN.child, CLOTH.child);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  newspaper(c);
  const cx = 330, cy = 470, sx = cx + Math.cos(GAP0) * FLOOR, sy = cy + Math.sin(GAP0) * FLOOR, ex = sx + 0.707 * 440, ey = sy + 0.707 * 440;
  plateTop(c, cx, cy);
  line(c, [[sx, sy], [ex, ey]], 9, "#5d5866");
  marble(c, ex, ey);
  arrow(c, [[sx + 120 + 30, sy + 120 - 30], [sx + 300 + 30, sy + 300 - 30]], RED, 12);
  // the pencil that drew the line
  c.save(); c.translate(250, 900); c.rotate(-0.1);
  shadow(c, 190, 36, 230, 16);
  shape(c, () => rrect(c, 0, -20, 40, 40, 8), COL.pink, 5);
  shape(c, () => rect(c, 40, -20, 24, 40), COL.steelDk, 5);
  shape(c, () => rect(c, 64, -20, 280, 40), COL.yellow, 5);
  shade(c, () => rect(c, 64, -20, 280, 40), COL.orange, 0, -12, 0.5);
  shape(c, () => polyP(c, [[344, -20], [344, 20], [420, 0]]), COL.wood, 5);
  shape(c, () => polyP(c, [[392, -8], [392, 8], [420, 0]]), "#5d5866", 3);
  c.restore();
};

export const su_skySolarSystem = cards("sci.sky.solar-system.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2]);
