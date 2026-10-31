import type { Ctx } from "./core";
import { CLOTH, COL, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, SH, write } from "./flatKit";

// sci.light.reflection.L3 set-up cards: torch + slit card, standing mirror, star race, two mirrors and a toy elephant.
type Q = number[][];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const PAPER: Q = [[200, 480], [880, 480], [950, 850], [130, 850]];
const LIGHT = "#ffd34d";

const paperSheet = (c: Ctx, q: Q) => {
  shape(c, () => polyP(c, q.map(([x, y]) => [x + 16, y + 18])), SH, 0);
  shape(c, () => polyP(c, q), COL.paper, 6);
};
// a mirror standing upright, seen from the front: bottom edge at yBot
const standMirror = (c: Ctx, x0: number, x1: number, yTop: number, yBot: number) => {
  const w = x1 - x0;
  shadow(c, (x0 + x1) / 2 + 24, yBot + 4, w * 0.55, 14);
  shape(c, () => rrect(c, x0, yTop, w, yBot - yTop, 14), COL.steel, 6);
  shape(c, () => rrect(c, x0 + 16, yTop + 16, w - 32, yBot - yTop - 32, 6), COL.sky, 4);
  shade(c, () => rrect(c, x0 + 16, yTop + 16, w - 32, yBot - yTop - 32, 6), COL.glassEdge, w * 0.2, 0, 0.25);
  shine(c, [[x0 + w * 0.2, yTop + 50], [x0 + w * 0.1, yTop + 120]], 10);
  shine(c, [[x0 + w * 0.32, yTop + 40], [x0 + w * 0.12, yTop + 160]], 6);
};
const dashed = (c: Ctx, a: number[], b: number[], w = 7, col: string = COL.greyDk, on = 22, off = 16) => {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d;
  for (let t = 0; t < d; t += on + off) line(c, [[a[0] + ux * t, a[1] + uy * t], [a[0] + ux * Math.min(d, t + on), a[1] + uy * Math.min(d, t + on)]], w, col);
};
const beam = (c: Ctx, pts: number[][]) => { line(c, pts, 24, "rgba(243,154,60,0.45)"); line(c, pts, 14, LIGHT); line(c, pts, 5, WHITE); };
const pencil = (c: Ctx, x: number, y: number, an: number, len = 190) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [46, -13], [46, 13]]), "#f2d6a6", 5);
  shape(c, () => polyP(c, [[0, 0], [15, -4.5], [15, 4.5]]), INK, 0);
  shape(c, () => rrect(c, 46, -13, len - 68, 26, 4), COL.yellow, 5);
  line(c, [[52, 6], [len - 26, 6]], 5, COL.woodDk);
  shape(c, () => rrect(c, len - 22, -13, 14, 26, 2), COL.steel, 5);
  shape(c, () => rrect(c, len - 8, -12, 16, 24, 6), COL.pink, 5);
  c.restore();
};
// torch lying with its head at (x, y), pointing at angle an; the slit card is taped over the glass
const torch = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  c.beginPath(); ell(c, -170, 60, 190, 26); c.fillStyle = SH; c.fill();
  const body = () => rrect(c, -300, -52, 270, 104, 26);
  shape(c, body, COL.teal);
  shade(c, body, COL.tealDk, 0, 22, 0.7);
  line(c, [[-250, -30], [-250, 30]], 6, COL.tealDk); line(c, [[-225, -30], [-225, 30]], 6, COL.tealDk);
  shape(c, () => rrect(c, -190, -68, 56, 24, 8), COL.red);
  shape(c, () => polyP(c, [[-40, -52], [-8, -84], [14, -84], [14, 84], [-8, 84], [-40, 52]]), COL.steel);
  shape(c, () => polyP(c, [[4, -96], [46, -80], [46, 96], [4, 80]]), COL.paper);
  line(c, [[25, -54], [25, 54]], 17, INK); line(c, [[25, -54], [25, 54]], 8, LIGHT);
  shape(c, () => polyP(c, [[-8, -106], [34, -92], [40, -62], [0, -74]]), "rgba(243,154,60,0.85)", 4);
  shape(c, () => polyP(c, [[-8, 106], [34, 92], [40, 62], [0, 74]]), "rgba(243,154,60,0.85)", 4);
  c.restore();
};
const cross = (c: Ctx, x: number, y: number, r: number, col: string = RED) => { line(c, [[x - r, y - r], [x + r, y + r]], 9, col); line(c, [[x - r, y + r], [x + r, y - r]], 9, col); };

// ---------------------------------------------------------------- e1 Catch the Beam
const e1s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[470, 650], [1000, 600], [1050, 900], [420, 940]].map(([x, y]) => [x + 16, y + 18])), SH, 0);
  shape(c, () => polyP(c, [[470, 650], [1000, 600], [1050, 900], [420, 940]]), COL.paper, 6);
  torch(c, 450, 400, 0.55, 1);
  c.beginPath(); c.moveTo(473, 410); c.lineTo(884, 672); c.lineTo(900, 654); c.lineTo(473, 420); c.closePath(); c.fillStyle = "rgba(255,211,77,0.65)"; c.fill();
  line(c, [[890, 640], [900, 770]], 24, "rgba(243,154,60,0.45)"); line(c, [[890, 640], [900, 770]], 14, LIGHT); line(c, [[890, 650], [899, 760]], 5, WHITE);
};
const mirrorPaper = (c: Ctx) => {
  ground(c);
  paperSheet(c, PAPER);
  standMirror(c, 390, 690, 250, 486);
};
const e1s1 = (c: Ctx) => {
  mirrorPaper(c);
  dashed(c, [540, 490], [540, 846]);
  pencil(c, 540, 700, 0.85, 200);
};
const e1s2 = (c: Ctx) => {
  mirrorPaper(c);
  dashed(c, [540, 490], [540, 830], 5);
  beam(c, [[350, 810], [540, 486]]);
  beam(c, [[540, 486], [730, 810]]);
  torch(c, 350, 810, -1.04, 0.8);
  cross(c, 730, 815, 18);
  for (const [a, b] of [[350, 540], [540, 730]]) { line(c, [[a, 892], [b, 892]], 5); line(c, [[a, 878], [a, 906]], 5); line(c, [[b, 878], [b, 906]], 5); write(c, "10 cm", (a + b) / 2 - 60, 920, 34, INK, 5); }
};

// ---------------------------------------------------------------- e2 The Mirror Drawing Race
const starPts = (cx: number, cy: number, R: number, sy: number, k = 0.45, rot = -Math.PI / 2) =>
  Array.from({ length: 10 }, (_, i) => { const a = rot + (i * Math.PI) / 5, r = i % 2 ? R * k : R; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * sy]; });
const starRace = (c: Ctx, cx: number, cy: number, R: number, sy: number, rot = -Math.PI / 2, lw = 6) => {
  shape(c, () => polyP(c, starPts(cx, cy, R, sy, 0.45, rot)), "#ffe9a8", lw);
  shape(c, () => polyP(c, starPts(cx, cy, R * 0.7, sy, 0.45, rot)), COL.paper, lw * 0.8);
};
const e2s0 = (c: Ctx) => {
  mirrorPaper(c);
  c.save(); c.beginPath(); rrect(c, 406, 266, 268, 204, 6); c.clip();
  starRace(c, 540, 372, 70, 1, Math.PI / 2, 4);
  c.restore();
  starRace(c, 540, 690, 180, 0.74);
};
const e2s1 = (c: Ctx) => {
  ground(c);
  person(c, 215, 810, 600, { sit: true, armR: [-0.55, -0.2], armL: [1.2, 0.9] });
  const T: Q = [[330, 600], [1040, 600], [1060, 750], [300, 750]];
  shape(c, () => polyP(c, T), COL.wood, 6);
  shape(c, () => polyP(c, [[300, 750], [1060, 750], [1060, 785], [300, 785]]), COL.woodDk, 6);
  shape(c, () => rrect(c, 330, 785, 40, 105, 6), COL.woodDk, 6); shape(c, () => rrect(c, 990, 785, 40, 105, 6), COL.woodDk, 6);
  shape(c, () => polyP(c, [[565, 620], [865, 620], [885, 740], [545, 740]]), COL.paper, 5);
  starRace(c, 715, 682, 62, 0.5, -Math.PI / 2, 4);
  standMirror(c, 885, 1035, 250, 640);
  c.save(); c.beginPath(); rrect(c, 901, 266, 118, 358, 6); c.clip();
  starRace(c, 960, 520, 46, 1, Math.PI / 2, 4);
  line(c, [[930, 500], [944, 510], [940, 526], [956, 520]], 7, COL.purple);
  c.restore();
  shape(c, () => rrect(c, 400, 430, 120, 175, 8), COL.purple);
  shape(c, () => rrect(c, 400, 430, 26, 175, 8), "#6b4fa8");
  line(c, [[448, 490], [498, 490]], 9, COL.yellow); line(c, [[448, 525], [498, 525]], 9, COL.yellow);
  shape(c, () => ell(c, 462, 560, 24, 24), SKIN.child, 5);
  line(c, [[275, 600], [380, 650], [490, 676]], 64, INK); line(c, [[275, 600], [380, 650], [490, 676]], 52, CLOTH.child);
  hand(c, 540, 684, 0.15, 0.95, SKIN.child, CLOTH.child);
  pencil(c, 690, 694, -2.95, 150);
  arrow(c, [[300, 440], [420, 350], [700, 330], [860, 400]]);
};
const e2s2 = (c: Ctx) => {
  mirrorPaper(c);
  const cx = 540, cy = 685, sy = 0.74, mid = starPts(cx, cy, 205, sy);
  const pts: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = mid[i], b = mid[(i + 1) % 10]; for (let k = 0; k < 12; k++) pts.push([lerp(a[0], b[0], k / 12), lerp(a[1], b[1], k / 12)]); }
  starRace(c, cx, cy, 235, sy);
  const bumps = [22, 66, 104], out: number[][] = [];
  pts.forEach(([x, y], i) => {
    const d = Math.hypot(x - cx, y - cy), nx = (x - cx) / d, ny = (y - cy) / d;
    let o = 6 * Math.sin(i * 0.6) + 3 * Math.sin(i * 1.4);
    bumps.forEach((b) => (o += 55 * Math.exp(-(((i - b) / 4) ** 2))));
    out.push([x + nx * o, y + ny * o]);
  });
  out.push(out[0]);
  line(c, out, 8, COL.purple);
  bumps.forEach((b) => { const [x, y] = pts[b], d = Math.hypot(x - cx, y - cy); cross(c, x + ((x - cx) / d) * 78, y + ((y - cy) / d) * 78, 14); });
};

// ---------------------------------------------------------------- e3 How Many of Me?
const QL: Q = [[540, 220], [540, 520], [270, 880], [270, 580]];
const QR: Q = [[540, 220], [540, 520], [810, 880], [810, 580]];
const qp = (q: Q, u: number, v: number) => { const t = [lerp(q[0][0], q[3][0], u), lerp(q[0][1], q[3][1], u)], b = [lerp(q[1][0], q[2][0], u), lerp(q[1][1], q[2][1], u)]; return [lerp(t[0], b[0], v), lerp(t[1], b[1], v)]; };
const facePts = (q: Q) => [qp(q, 0.05, 0.06), qp(q, 0.95, 0.06), qp(q, 0.95, 0.94), qp(q, 0.05, 0.94)];
const mirrorPanel = (c: Ctx, q: Q) => {
  shape(c, () => polyP(c, [q[1], q[2], [q[2][0] + 34, q[2][1] + 14], [q[1][0] + 34, q[1][1] + 14]]), SH, 0);
  shape(c, () => polyP(c, q), COL.steel, 6);
  shape(c, () => polyP(c, facePts(q)), COL.sky, 4);
  shine(c, [qp(q, 0.35, 0.14), qp(q, 0.2, 0.4)], 10);
  shine(c, [qp(q, 0.5, 0.12), qp(q, 0.3, 0.52)], 6);
};
const elephant = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  shadow(c, 8, 4, 110, 14);
  for (const lx of [-30, 68, -68, 30]) { const far = lx === -30 || lx === 68; shape(c, () => rrect(c, lx - 17, -66, 34, 66, 10), far ? COL.blueDk : COL.blue); }
  line(c, [[98, -125], [118, -88]], 6); shape(c, () => ell(c, 120, -82, 7, 9), INK, 0);
  const body = () => ell(c, 0, -112, 100, 68);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, 24, 26, 0.55);
  shape(c, () => rrect(c, -34, -176, 70, 30, 10), COL.orange, 5);
  line(c, [[-128, -118], [-152, -92], [-156, -58], [-138, -38]], 40, INK); line(c, [[-128, -118], [-152, -92], [-156, -58], [-138, -38]], 28, COL.blue);
  shape(c, () => ell(c, -92, -138, 52, 50), COL.blue);
  shape(c, () => ell(c, -66, -132, 34, 46, 0.25), COL.blueDk, 5);
  shape(c, () => ell(c, -64, -128, 17, 28, 0.25), COL.pink, 0);
  shape(c, () => ell(c, -112, -148, 6, 7), INK, 0);
  line(c, [[-132, -108], [-150, -84]], 9, WHITE);
  c.restore();
};
const e3s0 = (c: Ctx) => {
  ground(c);
  mirrorPanel(c, QL); mirrorPanel(c, QR);
  shape(c, () => rrect(c, 520, 212, 40, 316, 6), "rgba(243,154,60,0.9)", 5);
  line(c, [[528, 250], [552, 250]], 4, COL.woodDk); line(c, [[528, 480], [552, 480]], 4, COL.woodDk);
};
const guideLines = (c: Ctx) => {
  const P = [540, 520];
  shape(c, () => polyP(c, [[170, 480], [910, 480], [1000, 950], [80, 950]].map(([x, y]) => [x + 16, y + 18])), SH, 0);
  shape(c, () => polyP(c, [[170, 480], [910, 480], [1000, 950], [80, 950]]), COL.paper, 6);
  line(c, [P, [230, 934]], 8, COL.greyDk); line(c, [P, [850, 934]], 8, COL.greyDk);
};
const e3s1 = (c: Ctx) => {
  ground(c);
  guideLines(c);
  mirrorPanel(c, QL); mirrorPanel(c, QR);
  write(c, "90°", 488, 636, 40, INK, 6);
  elephant(c, 540, 845, 0.7);
};
const e3s2 = (c: Ctx) => {
  ground(c);
  guideLines(c);
  mirrorPanel(c, QL); mirrorPanel(c, QR);
  c.save(); c.beginPath(); polyP(c, facePts(QL)); polyP(c, facePts(QR)); c.clip();
  elephant(c, 405, 740, 0.72, true); elephant(c, 675, 740, 0.72, false); elephant(c, 540, 528, 0.62, true);
  c.restore();
  elephant(c, 540, 845, 0.7);
  shape(c, () => ell(c, 900, 150, 72, 72), COL.yellow);
  write(c, "4", 872, 108, 84, INK, 9);
};

export const su_lightReflection = cards("sci.light.reflection.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
