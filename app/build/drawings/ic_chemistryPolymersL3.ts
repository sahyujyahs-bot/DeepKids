import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, glass, bowl, plate, write, cards } from "./flatKit";

// sci.chemistry.polymers.L3 · picture cards. Beads on a string = monomers joined into a polymer chain;
// red ties = cross-links; green = slime.

const SL = "#8fd68a", SLDK = "#5fb25f", GLUE = "#fbf8ef", GLUEDK = "#e6dfcc";
const BEAD = [COL.teal, COL.orange, COL.purple, COL.pink, COL.blue];
const TIE = RED, SULF = "#ffd34d", NOODLE = "#f6d98a";

type Pt = [number, number];
const bead = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.17));
  c.beginPath(); ell(c, x - r * 0.3, y - r * 0.32, r * 0.24, r * 0.15, -0.6); c.fillStyle = "rgba(255,255,255,0.75)"; c.fill();
};
const samples = (f: (t: number) => Pt, n: number): Pt[] => Array.from({ length: n }, (_, i) => f(i / (n - 1)));
// a chain: a dark string through n beads along the path f(t), t from 0 to 1
const chain = (c: Ctx, f: (t: number) => Pt, n: number, r: number, col: string | string[] = COL.teal) => {
  line(c, samples(f, 90), Math.max(4, r * 0.4));
  samples(f, n).forEach(([x, y], i) => bead(c, x, y, r, Array.isArray(col) ? col[i % col.length] : col));
};
const curve = (c: Ctx, pts: number[][], w: number, col: string, edge = INK) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = edge; c.lineWidth = w + 9; c.stroke();
  path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
// a round window showing something magnified
const lens = (c: Ctx, x: number, y: number, R: number, draw: () => void, handle = true) => {
  if (handle) { const p: Pt[] = [[x + R * 0.72, y + R * 0.72], [x + R * 1.3, y + R * 1.3]]; line(c, p, R * 0.2, INK); line(c, p, R * 0.2 - 10, COL.wood); }
  c.save(); c.beginPath(); ell(c, x, y, R, R); c.fillStyle = "#fffaf0"; c.fill(); c.clip(); draw(); c.restore();
  c.beginPath(); ell(c, x, y, R, R); c.lineWidth = 10; c.strokeStyle = INK; c.stroke();
};
// wavy rows of chains inside a window; ties = list of [row, t] ties to the next row (red, or tieCol)
const rows = (c: Ctx, x: number, y: number, R: number, k: number, ties: [number, number][] = [], n = 11, r = 12, tieCol = TIE) => {
  const gap = (R * 1.45) / (k - 1 || 1), f = (i: number) => (t: number): Pt => [x - R * 0.85 + t * R * 1.7, y - R * 0.72 + i * gap + Math.sin(t * 5 + i * 1.7) * 14];
  ties.forEach(([i, t]) => { const a = f(i)(t), b = f(i + 1)(t); line(c, [a, b], 10, tieCol); [a, b].forEach(([px, py]) => shape(c, () => ell(c, px, py, 9, 9), tieCol, 3)); });
  for (let i = 0; i < k; i++) chain(c, f(i), n, r, BEAD[i % 5]);
};
const tangle = (c: Ctx, x: number, y: number, R: number, r = 11) => {
  const L: [number, number, number, number, number][] = [[3, 2, 0, 0.5, 0], [2, 3, 1, 0, 1], [3, 4, 2, 1, 2], [4, 3, 0.4, 2, 3]];
  L.forEach(([a, b, p, q, ci]) => chain(c, (t) => [x + R * 0.78 * Math.sin(a * t * Math.PI * 2 + p), y + R * 0.7 * Math.sin(b * t * Math.PI * 2 + q)], 26, r, BEAD[ci]));
};
const pieces = (c: Ctx, x: number, y: number, R: number, r = 11, k = 7, seed = 3) => {
  const g = rnd(seed);
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + 0.3, px = x + Math.cos(a) * R * 0.5 + (g() - 0.5) * 20, py = y + Math.sin(a) * R * 0.5 + (g() - 0.5) * 20, d = g() * 3;
    chain(c, (t) => [px + Math.cos(d) * (t - 0.5) * r * 5, py + Math.sin(d) * (t - 0.5) * r * 5], 3, r, BEAD[i % 5]);
  }
};
const atom = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => ell(c, x, y, r, r), col, Math.max(4, r * 0.12));
  shade(c, () => ell(c, x, y, r, r), "rgba(43,35,64,0.5)", r * 0.35, r * 0.35, 0.28);
  c.beginPath(); ell(c, x - r * 0.35, y - r * 0.38, r * 0.26, r * 0.16, -0.7); c.fillStyle = "rgba(255,255,255,0.8)"; c.fill();
};
const dropShape = (c: Ctx, x: number, y: number, s: number, col: string) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.3); c.quadraticCurveTo(x, y + s * 1.1, x - s * 0.8, y + s * 0.3); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, Math.max(3, s * 0.12));
// a stretched piece of slime between two blobs, sagging in the middle
const bridge = (c: Ctx, x0: number, x1: number, y: number, r: number, thick: number, sag: number, col = SL, dk = SLDK) => {
  const up: Pt[] = [], dn: Pt[] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, hw = thick / 2 + (r - thick / 2) * Math.pow(Math.abs(1 - 2 * t), 6), cy = y + sag * Math.sin(Math.PI * t), cx = x0 + (x1 - x0) * t; up.push([cx, cy - hw]); dn.push([cx, cy + hw]); }
  const p = () => polyP(c, [...up, ...[...dn].reverse()]);
  shape(c, p, col, 6); shade(c, p, dk, 0, 14, 0.5);
};
const blob = (c: Ctx, x: number, y: number, r: number, col = SL, dk = SLDK) => {
  const p = () => { c.moveTo(x - r, y + r * 0.2); c.bezierCurveTo(x - r * 1.1, y - r * 0.9, x + r * 1.1, y - r * 1.0, x + r, y + r * 0.2); c.bezierCurveTo(x + r * 1.05, y + r * 0.75, x - r * 1.05, y + r * 0.75, x - r, y + r * 0.2); c.closePath(); };
  shadow(c, x + r * 0.12, y + r * 0.7, r * 0.95, r * 0.16);
  shape(c, p, col, 6); shade(c, p, dk, r * 0.25, r * 0.2, 0.5); shine(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.2, y - r * 0.55]], 9);
};
const spoonG = (c: Ctx, sx: number, sy: number, a: number, glue = true) => {
  const ca = Math.cos(a), sa = Math.sin(a);
  line(c, [[sx - ca * 80, sy - sa * 80], [sx - ca * 330, sy - sa * 330]], 24, INK); line(c, [[sx - ca * 80, sy - sa * 80], [sx - ca * 330, sy - sa * 330]], 13, COL.steel);
  shape(c, () => ell(c, sx, sy, 100, 62, a), COL.steel, 6);
  if (glue) shape(c, () => ell(c, sx + ca * 10, sy + sa * 6 - 4, 78, 40, a), GLUE, 4);
};
const fork = (c: Ctx, x: number, y: number, a: number, len = 300) => {
  c.save(); c.translate(x, y); c.rotate(a);
  line(c, [[0, 0], [len, 0]], 24, INK); line(c, [[0, 0], [len, 0]], 13, COL.steel);
  [-28, -9, 9, 28].forEach((o) => line(c, [[len, o], [len + 70, o]], 8, INK));
  shape(c, () => rrect(c, len - 12, -36, 30, 72, 10), COL.steel, 6);
  c.restore();
};
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20); line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
// a milk packet, centre (x, y), width w
const packet = (c: Ctx, x: number, y: number, w: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const h = w * 1.3, p = () => { c.moveTo(-w / 2, -h / 2); c.quadraticCurveTo(0, -h / 2 + 18, w / 2, -h / 2); c.lineTo(w / 2, h / 2); c.quadraticCurveTo(0, h / 2 - 18, -w / 2, h / 2); c.closePath(); };
  shape(c, p, "#e9f2fc", 6); shade(c, p, COL.blue, w * 0.1, 0, 0.18);
  shape(c, () => rrect(c, -w * 0.3, -h * 0.2, w * 0.6, h * 0.34, 10), COL.blue, 5);
  shape(c, () => ell(c, 0, -h * 0.03, w * 0.12, w * 0.12), WHITE, 4);
  c.restore();
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const bk = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 4, w * 0.5, 14);
  line(c, [[x - w / 2, y - h], [x - w * 0.4, y - h - h * 0.3], [x + w * 0.4, y - h - h * 0.3], [x + w / 2, y - h]], 10);
  shape(c, bk, COL.red, 6); shade(c, bk, "#a8331f", w * 0.15, 0, 0.4); shape(c, () => ell(c, x, y - h, w / 2, 18), "#a8331f", 6);
};
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, 14);
  shape(c, () => rrect(c, x - w * 0.18, y - h - 30, w * 0.36, 46, 6), COL.blue, 5);
  shape(c, () => rrect(c, x - w * 0.5, y - h * 0.75, w, h * 0.75, w * 0.2), COL.glass, 6);
  shape(c, () => rrect(c, x - w * 0.2, y - h - 4, w * 0.4, h * 0.3, 6), COL.glass, 6);
  shape(c, () => rrect(c, x - w * 0.5, y - h * 0.55, w, h * 0.55, w * 0.2), COL.water, 0);
  shape(c, () => rrect(c, x - w * 0.5, y - h * 0.75, w, h * 0.75, w * 0.2), "rgba(0,0,0,0)", 6);
  shine(c, [[x - w * 0.3, y - h * 0.6], [x - w * 0.3, y - h * 0.15]], 9);
};
const triangle = (c: Ctx, x: number, y: number, s: number, num: string, col = COL.greenDk) => {
  const A: Pt = [x, y - s * 0.62], B: Pt = [x + s * 0.62, y + s * 0.48], C: Pt = [x - s * 0.62, y + s * 0.48];
  const mid = (p: Pt, q: Pt, a: number): Pt => [p[0] + (q[0] - p[0]) * a, p[1] + (q[1] - p[1]) * a];
  ([[A, B], [B, C], [C, A]] as [Pt, Pt][]).forEach(([p, q]) => arrow(c, [mid(p, q, 0.08), mid(p, q, 0.92)], col, 16));
  write(c, num, x - s * 0.12, y - s * 0.12, s * 0.42, INK, 10);
};

// ------------------------------------------------------------------ cover and intro
const intro = (c: Ctx) => {
  ground(c);
  plate(c, 400, 930, 330, 85);
  curve(c, [[490, 305], [492, 520], [488, 760], [496, 880]], 14, GLUE);
  shape(c, () => ell(c, 495, 905, 110, 26), GLUE, 5);
  spoonG(c, 400, 250, 0.6);
  shape(c, () => ell(c, 484, 322, 18, 22), GLUE, 5);
  glass(c, 880, 1000, 170, 240, 0.72, COL.water);
};
const summary = (c: Ctx) => {
  ground(c);
  plate(c, 540, 930, 400, 80);
  bridge(c, 130, 950, 250, 44, 16, 140);
  hand(c, 60, 250, 0, 1.2, SKIN.child, CLOTH.child);
  hand(c, 1020, 250, Math.PI, 1.2, SKIN.adult, CLOTH.adult);
  lens(c, 540, 700, 210, () => rows(c, 540, 700, 210, 4, [[0, 0.3], [1, 0.7], [2, 0.4]], 11, 13), false);
};
// ------------------------------------------------------------------ flows
const flowE1 = (c: Ctx) => {
  ground(c);
  [200, 540, 880].forEach((x, i) => { bowl(c, x, 560, 135, SL); blob(c, x, 500, [92, 76, 66][i]); });
  [200, 540, 880].forEach((x, i) => write(c, String([1, 3, 6][i]), x - 18, 740, 100, INK, 12));
  [200, 540, 880].forEach((x, i) => { for (let k = 0; k < [1, 3, 6][i]; k++) dropShape(c, x - 100 + k * 40, 905, 14, COL.water); });
};
const flowE2 = (c: Ctx) => {
  ground(c);
  const bal = () => { c.moveTo(540, 140); c.bezierCurveTo(300, 150, 270, 560, 460, 790); c.lineTo(620, 790); c.bezierCurveTo(810, 560, 780, 150, 540, 140); c.closePath(); };
  shadow(c, 600, 980, 260, 30);
  shape(c, bal, COL.blue, 7); shade(c, bal, COL.blueDk, 50, 0, 0.45);
  shape(c, () => ell(c, 540, 160, 38, 16), COL.blueDk, 5);
  shape(c, () => polyP(c, [[520, 790], [560, 790], [575, 830], [505, 830]]), COL.blueDk, 5);
  shine(c, [[400, 300], [380, 420]], 14);
  line(c, [[565, 870], [520, 130]], 20, INK); line(c, [[565, 870], [520, 130]], 10, COL.wood);
  hand(c, 530, 940, -1.57, 1.2, SKIN.adult, CLOTH.adult);
  arrow(c, [[760, 760], [680, 420]], RED, 12);
};
const flowE3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 200, 800, 110, 8), "#e9f2fc", 6);
  for (let i = 1; i < 8; i++) line(c, [[140 + i * 100, 200], [140 + i * 100, 310]], 4, COL.blue);
  const y = 640;
  shape(c, () => polyP(c, [[100, y], [300, y], [330, y + 40], [750, y + 40], [780, y], [980, y], [980, y + 110], [780, y + 110], [750, y + 70], [330, y + 70], [300, y + 110], [100, y + 110]]), "#e9f2fc", 6);
  [150, 200, 250, 830, 880, 930].forEach((x) => line(c, [[x, y], [x, y + 110]], 4, COL.blue));
  [380, 440, 500, 560, 620, 680, 720].forEach((x) => line(c, [[x, y + 40], [x, y + 70]], 3, COL.blue));
  arrow(c, [[540, 360], [540, 560]], RED, 14);
  hand(c, -10, y + 55, 0, 1.0, SKIN.child, CLOTH.child); hand(c, 1090, y + 55, Math.PI, 1.0, SKIN.adult, CLOTH.adult);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  const g = rnd(5);
  bowl(c, 270, 700, 200, "#fffaf0");
  for (let i = 0; i < 40; i++) { const x = 140 + g() * 260, y = 655 + g() * 40; shape(c, () => ell(c, x, y, 20, 8, g() * 3), WHITE, 3); }
  bowl(c, 810, 700, 200, NOODLE);
  for (let i = 0; i < 5; i++) curve(c, [[670 + i * 15, 690], [730 + i * 40, 650 + i * 8], [820 + i * 25, 700], [900 - i * 10, 660]], 16, NOODLE);
  fork(c, 90, 90, 0.95, 330);
  [[335, 430], [352, 408], [318, 448]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 22, 9, 0.8), WHITE, 3));
  for (let i = 0; i < 6; i++) curve(c, [[860 + i * 8, 340 + i * 6], [860 + i * 18, 450], [900 - i * 14, 540], [820 + i * 24, 640]], 15, NOODLE);
  fork(c, 700, 60, 1.25, 300);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  bowl(c, 640, 700, 230, "#ead9a8");
  [[560, 705], [640, 715], [720, 705]].forEach(([x, y]) => { c.beginPath(); ell(c, x, y, 55, 12); c.fillStyle = "#f4e6bb"; c.fill(); });
  spoonG(c, 400, 250, 0.45, false);
  shape(c, () => ell(c, 410, 255, 70, 34, 0.45), "#ead9a8", 4);
  curve(c, [[450, 300], [470, 450], [520, 560], [540, 690]], 14, "#ead9a8");
  const p = () => { c.moveTo(60, 960); c.bezierCurveTo(110, 760, 330, 760, 380, 960); c.closePath(); };
  shape(c, p, "#e8d4b0", 6); shade(c, p, "#c9ac7c", 50, 0, 0.4);
  const g = rnd(9); for (let i = 0; i < 16; i++) { const x = 110 + g() * 220, y = 890 + g() * 50; shape(c, () => ell(c, x, y, 13, 6, g() * 3), "#f6ead2", 3); }
  arrow(c, [[400, 800], [510, 780]], RED, 12);
  for (const x of [660, 760]) line(c, [[x, 480], [x - 15, 420], [x + 15, 370], [x, 310]], 10, "#b9b4ab");
};
const flowA4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 930, 420, 90);
  const dy = 720, dp = () => { c.moveTo(250, dy - 60); c.bezierCurveTo(250, dy + 70, 560, dy + 70, 560, dy - 60); c.closePath(); };
  shadow(c, 420, 800, 190, 24);
  shape(c, dp, COL.orange, 6); shade(c, dp, COL.red, 50, 10, 0.4);
  shape(c, () => ell(c, 405, dy - 60, 155, 26), "#ffd8a0", 6);
  shape(c, () => { c.moveTo(405, dy - 70); c.quadraticCurveTo(350, dy - 190, 405, dy - 300); c.quadraticCurveTo(460, dy - 190, 405, dy - 70); c.closePath(); }, COL.yellow, 6);
  shape(c, () => { c.moveTo(405, dy - 75); c.quadraticCurveTo(380, dy - 150, 405, dy - 210); c.quadraticCurveTo(430, dy - 150, 405, dy - 75); c.closePath(); }, COL.orange, 0);
  hand(c, 900, 150, 2.2, 1.2, SKIN.adult, CLOTH.adult);
  line(c, [[780, 235], [470, 470]], 26, INK); line(c, [[780, 235], [470, 470]], 14, COL.steel);
  curve(c, [[470, 470], [440, 500], [420, 540]], 6, "#f3efe6");
  ([[640, 930, "#f3efe6"], [740, 940, "#d8c9a6"], [840, 930, COL.red], [690, 975, COL.blue]] as [number, number, string][]).forEach(([x, y, col], i) => { const q = [[x - 50, y], [x + 50, y + (i % 2 ? 12 : -12)]]; line(c, q, 22, INK); line(c, q, 12, col); });
};
const flowA5 = (c: Ctx) => {
  ground(c);
  table(c, 930);
  bucket(c, 200, 920, 250, 330);
  bottle(c, 850, 920, 150, 400);
  const tb = () => { c.moveTo(430, 760); c.lineTo(680, 760); c.lineTo(650, 920); c.lineTo(460, 920); c.closePath(); };
  shadow(c, 555, 925, 130, 14);
  shape(c, tb, COL.yellow, 6); shape(c, () => ell(c, 555, 760, 125, 18), "#e5b422", 6);
  lens(c, 540, 330, 220, () => { c.fillStyle = "#e9f6ee"; c.fillRect(300, 100, 520, 460); triangle(c, 540, 330, 250, "5"); }, false);
};
const flowP1 = (c: Ctx) => {
  ground(c);
  plate(c, 280, 380, 230, 80); blob(c, 280, 360, 100);
  plate(c, 800, 380, 230, 80);
  const dry = () => { c.moveTo(740, 380); c.bezierCurveTo(740, 310, 860, 310, 860, 380); c.bezierCurveTo(860, 410, 740, 410, 740, 380); c.closePath(); };
  shape(c, dry, "#b8c48a", 6); line(c, [[780, 345], [800, 375], [790, 395]], 4); line(c, [[820, 340], [815, 370]], 4);
  arrow(c, [[420, 220], [660, 220]], RED, 12);
  write(c, "1", 255, 80, 90, INK, 11); write(c, "4", 775, 80, 90, INK, 11);
  shadow(c, 540, 960, 260, 28);
  shape(c, () => rrect(c, 290, 700, 500, 240, 18), COL.blue, 6);
  shape(c, () => rrect(c, 270, 650, 540, 80, 14), COL.blueDk, 6);
  shine(c, [[340, 770], [340, 880]], 12);
  [1, 2, 3, 4].forEach((n, i) => { const bx = 850 + (i % 2) * 110, by = 700 + Math.floor(i / 2) * 120; shape(c, () => rrect(c, bx, by, 90, 100, 14), WHITE, 5); write(c, String(n), bx + 22, by + 22, 54, INK, 8); });
};
const flowC1 = (c: Ctx) => {
  ground(c);
  plate(c, 400, 900, 300, 75);
  shape(c, () => rrect(c, 800, 90, 130, 850, 8), COL.wood, 6);
  for (let i = 0; i <= 20; i++) { const y = 920 - i * 40, w = i % 5 === 0 ? 60 : 32; line(c, [[800, y], [800 + w, y]], i % 5 === 0 ? 5 : 3); }
  blob(c, 400, 400, 100);
  arrow(c, [[220, 480], [220, 760]], RED, 12); arrow(c, [[580, 760], [580, 380]], RED, 12);
};
const flowC2 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 970], [1040, 970]], 8);
  hand(c, 540, 200, -1.57, 1.2, SKIN.child, CLOTH.child);
  const rope: Pt[] = samples((t) => [540, 215 + t * 360], 40);
  line(c, rope, 34, INK); line(c, rope, 22, "#e9f2fc");
  for (let i = 0; i < 16; i++) { const y = 225 + i * 22; line(c, [[528, y], [552, y + 14]], 5, COL.blue); }
  bottle(c, 540, 930, 190, 330);
  packet(c, 170, 320, 170, -0.2); packet(c, 190, 700, 140, 0.2);
  arrow(c, [[860, 860], [860, 700]], RED, 12);
};
// ------------------------------------------------------------------ terms
const term0 = (c: Ctx) => {
  ground(c);
  dropShape(c, 250, 800, 80, COL.water);
  line(c, [[330, 760], [400, 640]], 8, COL.greyDk);
  lens(c, 620, 440, 270, () => { atom(c, 500, 400, 70, COL.red); atom(c, 720, 320, 40, COL.blue); atom(c, 690, 580, 40, COL.blue); });
};
const term1 = (c: Ctx) => {
  ground(c);
  dropShape(c, 250, 800, 80, COL.water);
  line(c, [[330, 760], [400, 640]], 8, COL.greyDk);
  lens(c, 620, 440, 270, () => { line(c, [[620, 400], [530, 510]], 22); line(c, [[620, 400], [710, 510]], 22); atom(c, 620, 380, 80, COL.red); atom(c, 520, 515, 52, COL.blue); atom(c, 720, 515, 52, COL.blue); });
};
const term2 = (c: Ctx) => {
  ground(c);
  chain(c, (t) => [90 + t * 900, 540 + Math.sin(t * 7) * 230 * Math.sin(t * Math.PI * 0.5 + 0.4)], 38, 30, COL.teal);
};
const term3 = (c: Ctx) => {
  ground(c);
  [[110, 280], [250, 430], [110, 580], [250, 730]].forEach(([x, y], i) => bead(c, x, y, 52, COL.teal));
  arrow(c, [[350, 520], [470, 520]], RED, 14);
  chain(c, (t) => [650, 220 + t * 640], 7, 52, COL.teal);
};
const clip = (c: Ctx, x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); rrect(c, -100, -48, 200, 96, 48); c.lineWidth = 24; c.strokeStyle = INK; c.stroke(); c.lineWidth = 12; c.strokeStyle = COL.steel; c.stroke(); c.restore(); };
const term4 = (c: Ctx) => {
  ground(c);
  const pts: Pt[] = [[190, 720], [340, 610], [490, 530], [640, 460], [790, 400], [920, 350]];
  pts.forEach(([x, y], i) => { if (i % 2 === 0) clip(c, x, y, -0.4); });
  pts.forEach(([x, y], i) => { if (i % 2 === 1) clip(c, x, y, -0.4); });
};
const term5 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 360, 30);
  bowl(c, 540, 700, 330, NOODLE);
  for (let i = 0; i < 7; i++) curve(c, [[300 + i * 70, 690], [360 + i * 60, 640 + (i % 2) * 20], [480 + i * 50, 700], [620 + i * 30, 660]], 17, NOODLE);
  for (let i = 0; i < 3; i++) curve(c, [[560 + i * 14, 640], [570 + i * 20, 470], [600 + i * 8, 300 - i * 20], [650, 120 + i * 10]], 16, NOODLE);
  arrow(c, [[800, 400], [800, 160]], RED, 14);
};
const term6 = (c: Ctx) => {
  ground(c);
  chain(c, (t) => [100 + t * 360, 330 + Math.sin(t * 6) * 22], 8, 22, COL.teal); chain(c, (t) => [100 + t * 360, 650 + Math.sin(t * 6 + 2) * 22], 8, 22, COL.orange);
  arrow(c, [[500, 500], [580, 500]], RED, 14);
  const f = (ph: number, y: number) => (t: number): Pt => [620 + t * 360, y + Math.sin(t * 6 + ph) * 22];
  [0.15, 0.5, 0.85].forEach((t) => { const a = f(0, 330)(t), b = f(2, 650)(t); line(c, [a, b], 14, TIE); [a, b].forEach(([x, y]) => shape(c, () => ell(c, x, y, 16, 16), TIE, 4)); });
  chain(c, f(0, 330), 8, 22, COL.teal); chain(c, f(2, 650), 8, 22, COL.orange);
};
const term7 = (c: Ctx) => {
  ground(c);
  const p = () => { c.moveTo(100, 700); c.bezierCurveTo(120, 500, 400, 500, 420, 700); c.closePath(); };
  shadow(c, 270, 830, 220, 24);
  bowl(c, 260, 720, 190, WHITE);
  shape(c, p, WHITE, 6); shade(c, p, GLUEDK, 40, 0, 0.7); bowl(c, 260, 720, 190, WHITE);
  spoonG(c, 270, 470, 0.5, false);
  glass(c, 800, 960, 280, 420, 0.7, COL.water);
  const g = rnd(2); for (let i = 0; i < 24; i++) shape(c, () => ell(c, 720 + g() * 160, 600 + g() * 300, 6, 4), WHITE, 2);
  arrow(c, [[460, 560], [620, 540]], RED, 12);
  shape(c, () => rrect(c, 735, 700, 130, 110, 8), WHITE, 5); line(c, [[760, 725], [840, 785]], 12, RED); line(c, [[840, 725], [760, 785]], 12, RED);
};
const term10 = (c: Ctx) => {
  ground(c);
  const yp = () => ell(c, 280, 780, 190, 170);
  shadow(c, 300, 950, 190, 24); shape(c, yp, COL.pink, 6); shade(c, yp, "#c9577a", 50, 40, 0.4);
  for (let i = 0; i < 5; i++) { c.save(); c.beginPath(); yp(); c.clip(); line(c, [[100 + i * 10, 640 + i * 55], [420 + i * 8, 800 + i * 30]], 7, "#c9577a"); c.restore(); }
  curve(c, [[440, 720], [560, 600], [620, 500]], 24, COL.pink);
  lens(c, 690, 300, 240, () => { for (let i = 0; i < 4; i++) chain(c, (t) => [470 + t * 450, 225 + i * 62 + t * 12], 13, 15, BEAD[i % 5]); }, false);
};
const term11 = (c: Ctx) => {
  ground(c);
  table(c, 930);
  bucket(c, 200, 920, 270, 360);
  packet(c, 520, 760, 190);
  bottle(c, 790, 920, 150, 400);
  line(c, [[950, 900], [1020, 560]], 26, INK); line(c, [[950, 900], [1020, 560]], 14, COL.teal); shape(c, () => rrect(c, 985, 480, 70, 100, 8), COL.teal, 5);
  for (let i = 0; i < 4; i++) line(c, [[997 + i * 17, 480], [997 + i * 17, 435]], 8, WHITE);
};
const term12 = (c: Ctx) => {
  ground(c);
  c.beginPath(); ell(c, 330, 600, 280, 280); c.fillStyle = "#4a4455"; c.fill(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, 330, 600, 190, 190); c.fillStyle = COL.cloth; c.fill(); c.stroke();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(c, [[330 + Math.cos(a) * 40, 600 + Math.sin(a) * 40], [330 + Math.cos(a) * 190, 600 + Math.sin(a) * 190]], 4, COL.steelDk); }
  c.beginPath(); ell(c, 330, 600, 40, 40); c.fillStyle = COL.steel; c.fill(); c.stroke();
  line(c, [[500, 470], [620, 400]], 8, COL.greyDk);
  lens(c, 800, 340, 250, () => rows(c, 800, 340, 250, 4, [[0, 0.25], [0, 0.75], [1, 0.5], [2, 0.2], [2, 0.8]], 11, 12, SULF), false);
};
// ------------------------------------------------------------------ explanations
const expl0 = (c: Ctx) => {
  ground(c);
  spoonG(c, 330, 210, 0.6);
  curve(c, [[415, 270], [420, 360], [425, 470]], 14, GLUE);
  lens(c, 640, 680, 300, () => rows(c, 640, 680, 300, 5, [], 13, 14), false);
};
const expl1 = (c: Ctx) => {
  ground(c);
  lens(c, 270, 380, 240, () => { pieces(c, 270, 380, 420, 16, 7); }, false);
  lens(c, 810, 380, 240, () => tangle(c, 810, 380, 220, 12), false);
  bowl(c, 270, 860, 150, "#fffaf0");
  const g = rnd(4); for (let i = 0; i < 30; i++) shape(c, () => ell(c, 160 + g() * 220, 835 + g() * 30, 18, 7, g() * 3), WHITE, 3);
  bowl(c, 810, 860, 150, NOODLE);
  for (let i = 0; i < 5; i++) curve(c, [[690 + i * 12, 850], [740 + i * 30, 820 + i * 6], [830 + i * 20, 860], [900 - i * 8, 830]], 14, NOODLE);
};
const expl2 = (c: Ctx) => {
  ground(c);
  lens(c, 250, 280, 200, () => rows(c, 250, 280, 200, 4, [], 9, 11), false);
  arrow(c, [[480, 280], [600, 280]], RED, 14);
  lens(c, 830, 280, 200, () => rows(c, 830, 280, 200, 4, [[0, 0.3], [1, 0.7], [2, 0.35]], 9, 11), false);
  glass(c, 250, 930, 190, 260, 0.6, GLUE);
  dropShape(c, 440, 700, 34, COL.water);
  arrow(c, [[420, 830], [620, 830]], RED, 14);
  blob(c, 830, 880, 130);
};
const expl3 = (c: Ctx) => {
  ground(c);
  chain(c, (t) => [60 + t * 960, 950 + Math.sin(t * 9) * 22], 24, 28, BEAD);
  const bx = 190, by = 430, p = () => { c.moveTo(bx - 150, by + 20); c.bezierCurveTo(bx - 180, by - 120, bx - 40, by - 190, bx, by - 110); c.bezierCurveTo(bx + 40, by - 190, bx + 180, by - 120, bx + 150, by + 20); c.bezierCurveTo(bx + 80, by + 130, bx - 80, by + 130, bx - 150, by + 20); c.closePath(); };
  shape(c, () => polyP(c, [[bx - 110, by + 60], [bx - 60, by + 150], [bx, by + 100], [bx + 60, by + 150], [bx + 110, by + 60]]), COL.leaf, 6); line(c, [[bx, by + 100], [bx, by + 210]], 14, INK); line(c, [[bx, by + 100], [bx, by + 210]], 6, COL.leaf); shape(c, p, WHITE, 6); shade(c, p, GLUEDK, 30, 20, 0.7);
  const cp = () => ell(c, 540, 460, 100, 150, 0.4);
  shadow(c, 560, 650, 120, 16); shape(c, cp, "#f6efe0", 6); shade(c, cp, "#e2d5b8", 30, 20, 0.7);
  c.save(); c.beginPath(); cp(); c.clip(); for (let i = -4; i <= 4; i++) line(c, [[440 + i * 12, 330 + i * 30], [640 + i * 12, 440 + i * 30]], 5, "#d8cba8"); c.restore();
  shadow(c, 880, 780, 150, 18);
  [-60, 60].forEach((o) => { line(c, [[880 + o, 640], [880 + o, 770]], 24, INK); line(c, [[880 + o, 640], [880 + o, 770]], 12, "#4a4455"); });
  const sb = () => ell(c, 880, 560, 160, 110);
  shape(c, sb, WHITE, 6); shade(c, sb, GLUEDK, 30, 20, 0.7);
  for (const [x, y] of [[810, 490], [880, 470], [950, 500], [850, 550], [920, 560]]) shape(c, () => ell(c, x, y, 38, 34), WHITE, 4);
  shape(c, () => ell(c, 760, 520, 55, 62), "#4a4455", 6);
  shape(c, () => ell(c, 748, 512, 9, 10), WHITE, 0); shape(c, () => ell(c, 748, 512, 4, 5), INK, 0);
};
const expl4 = (c: Ctx) => {
  ground(c);
  dropShape(c, 120, 600, 70, "#3a3540");
  arrow(c, [[220, 600], [300, 600]], RED, 12);
  [[390, 520], [460, 580], [390, 640], [460, 700]].forEach(([x, y], i) => bead(c, x, y, 32, BEAD[i % 5]));
  arrow(c, [[520, 600], [580, 600]], RED, 12);
  chain(c, (t) => [660, 400 + t * 400], 6, 30, COL.teal);
  arrow(c, [[730, 600], [790, 600]], RED, 12);
  bucket(c, 930, 760, 210, 280);
};
const expl5 = (c: Ctx) => {
  ground(c);
  lens(c, 230, 280, 190, () => rows(c, 230, 280, 190, 4, [], 8, 11), false);
  arrow(c, [[430, 280], [540, 280]], RED, 14);
  lens(c, 830, 280, 190, () => rows(c, 830, 280, 190, 4, [[0, 0.25], [0, 0.75], [1, 0.5], [2, 0.3], [2, 0.8]], 8, 11, SULF), false);
  const sp = () => { c.moveTo(60, 900); c.bezierCurveTo(80, 780, 280, 780, 300, 900); c.closePath(); };
  shadow(c, 190, 905, 140, 14);
  shape(c, sp, SULF, 6); shade(c, sp, "#e5b422", 30, 0, 0.5);
  shape(c, () => { c.moveTo(400, 910); c.quadraticCurveTo(330, 820, 400, 690); c.quadraticCurveTo(470, 820, 400, 910); c.closePath(); }, COL.orange, 6);
  shape(c, () => { c.moveTo(400, 900); c.quadraticCurveTo(370, 830, 400, 770); c.quadraticCurveTo(430, 830, 400, 900); c.closePath(); }, COL.yellow, 0);
  arrow(c, [[500, 820], [640, 820]], RED, 12);
  shadow(c, 800, 935, 110, 16);
  shape(c, () => ell(c, 800, 830, 100, 100), "#4a4455", 6); shine(c, [[740, 780], [770, 760]], 10);
  arrow(c, [[960, 940], [960, 700]], RED, 12);
};

export const ic_chemistryPolymersL3 = cards("sci.chemistry.polymers.L3 cards", [
  intro, summary, flowE1, flowE2, flowE3, flowA1, flowA2, flowA4, flowA5, flowP1, // 0-9
  flowC1, flowC2, term0, term1, term2, term3, term4, term5, term6, term7, // 10-19
  term10, term11, term12, expl0, expl1, expl2, expl3, expl4, expl5, // 20-28
]);
