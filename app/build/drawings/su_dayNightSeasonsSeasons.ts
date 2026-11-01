import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards } from "./flatKit";

// ---------------------------------------------------------------- shared pieces
// a leaf lying flat, base at (x, y), blade pointing right, length w, width h
const leafAt = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.leaf, dk: string = COL.leafDk) => {
  c.save(); c.translate(x, y);
  const blade = () => { c.moveTo(0, 0); c.bezierCurveTo(w * 0.15, -h * 0.62, w * 0.75, -h * 0.55, w, 0); c.bezierCurveTo(w * 0.75, h * 0.55, w * 0.15, h * 0.62, 0, 0); c.closePath(); };
  line(c, [[-w * 0.16, 0], [2, 0]], 22, INK); line(c, [[-w * 0.16, 0], [2, 0]], 11, col);
  shape(c, blade, col, 6);
  shade(c, blade, dk, w * 0.04, h * 0.2, 0.5);
  line(c, [[0, 0], [w * 0.94, 0]], 5, dk);
  for (const t of [0.25, 0.45, 0.65]) { line(c, [[w * t, 0], [w * (t + 0.14), -h * 0.3]], 3.5, dk); line(c, [[w * t, 0], [w * (t + 0.14), h * 0.3]], 3.5, dk); }
  c.restore();
};
// a white blotting-paper strip standing up: x, y top-left, w, h
const stripAt = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.beginPath(); c.rect(x + 14, y + 14, w, h); c.fillStyle = SH; c.fill();
  shape(c, () => c.rect(x, y, w, h), WHITE, 6);
  shade(c, () => c.rect(x, y, w, h), COL.grey, 16, 0, 0.35);
};
// a 1 cm = 63 px tumbler with a little clear liquid and a paper strip standing in it
const tumblerWithStrip = (c: Ctx, x: number, lineCol: string) => {
  const gy = 900, gw = 300, gh = 420, sw = 90, sx = x - sw / 2 - 10;
  glass(c, x, gy, gw, gh, 63 / gh, "#cfe6f3");
  const stripTop = 300, stripBot = 880;
  c.beginPath(); c.rect(sx, stripTop, sw, stripBot - stripTop); c.fillStyle = WHITE; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  // pencil line and the leaf colour line, 2 cm up the strip
  line(c, [[sx, 760], [sx + sw, 760]], 5, COL.greyDk);
  line(c, [[sx + 2, 748], [sx + sw - 2, 748]], 18, lineCol);
  // the wet part of the strip
  c.beginPath(); c.rect(sx + 3, 837, sw - 6, stripBot - 837); c.fillStyle = "rgba(143,195,234,0.55)"; c.fill();
  // the glass front over the strip
  const top = gw / 2, bot = gw * 0.4;
  shape(c, () => { c.moveTo(x - top, gy - gh); c.lineTo(x + top, gy - gh); c.lineTo(x + bot, gy); c.lineTo(x - bot, gy); c.closePath(); }, "rgba(214,236,250,0.35)", 5);
  shape(c, () => ell(c, x, gy - gh, top, gw * 0.08), "rgba(255,255,255,0.2)", 5);
  shine(c, [[x - top * 0.65, gy - gh * 0.85], [x - bot * 0.7, gy - gh * 0.2]], 7);
};
// a torch: lens centre at (hx, hy), beam pointing at angle a (radians, 0 = right, PI/2 = down)
const torch = (c: Ctx, hx: number, hy: number, a: number, len = 280) => {
  const lsh = (dx: number, dy: number): [number, number] => [dx * Math.cos(a) + dy * Math.sin(a), -dx * Math.sin(a) + dy * Math.cos(a)];
  c.save(); c.translate(hx, hy); c.rotate(a);
  const [sx, sy] = lsh(9, 12);
  const body = () => rrect(c, -len, -38, len - 50, 76, 16), head = () => polyP(c, [[-62, -38], [0, -70], [0, 70], [-62, 38]]);
  shape(c, body, COL.teal, 6); shade(c, body, COL.tealDk, sx, sy, 0.7);
  shape(c, () => rrect(c, -len * 0.62, -50, 54, 18, 7), COL.orange, 5);
  shape(c, head, COL.steel, 6); shade(c, head, COL.steelDk, sx, sy, 0.7);
  shape(c, () => ell(c, 0, 0, 14, 62), "#fff7c4", 5);
  c.restore();
};
// squared paper as a quad (corners clockwise from top-left) with n x m squares
const paperQuad = (c: Ctx, P: number[][], n: number, m: number) => {
  const at = (u: number, v: number) => { const t = [P[0][0] + (P[1][0] - P[0][0]) * u, P[0][1] + (P[1][1] - P[0][1]) * u], b = [P[3][0] + (P[2][0] - P[3][0]) * u, P[3][1] + (P[2][1] - P[3][1]) * u]; return [t[0] + (b[0] - t[0]) * v, t[1] + (b[1] - t[1]) * v]; };
  c.beginPath(); polyP(c, P.map(([x, y]) => [x + 14, y + 14])); c.fillStyle = SH; c.fill();
  shape(c, () => polyP(c, P), WHITE, 6);
  for (let i = 1; i < n; i++) line(c, [at(i / n, 0), at(i / n, 1)], 2.5, "#9cc7de");
  for (let j = 1; j < m; j++) line(c, [at(0, j / m), at(1, j / m)], 2.5, "#9cc7de");
  shape(c, () => polyP(c, P), "rgba(0,0,0,0)", 6);
};
const patch = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), "#fff3b0", 4); c.beginPath(); ell(c, x, y, rx * 0.55, ry * 0.55); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); };
const beam = (c: Ctx, pts: number[][]) => { c.beginPath(); polyP(c, pts); c.fillStyle = "rgba(255,226,110,0.5)"; c.fill(); line(c, [pts[0], pts[1]], 3, "rgba(240,180,40,0.9)"); line(c, [pts[3], pts[2]], 3, "rgba(240,180,40,0.9)"); };

// ---------------------------------------------------------------- e1 Hidden colours
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // the strip and the leaf laid across the pencil line
  stripAt(c, 400, 380, 280, 640);
  line(c, [[400, 660], [680, 660]], 5, COL.greyDk);
  leafAt(c, 270, 660, 570, 250);
  // the green line the coin has drawn so far
  line(c, [[340, 660], [600, 660]], 18, COL.leafDk);
  // the arm, the coin standing on its edge, the hand pinching it
  shape(c, () => rrect(c, 551, -20, 98, 380, 10), CLOTH.child, 6);
  shade(c, () => rrect(c, 551, -20, 98, 380, 10), CLOTH.childDk, 22, 0, 0.7);
  shape(c, () => ell(c, 600, 580, 80, 80), COL.steel, 6);
  shade(c, () => ell(c, 600, 580, 80, 80), COL.steelDk, 16, 18, 0.7);
  shape(c, () => ell(c, 600, 580, 58, 58), COL.steelIn, 4);
  write(c, "1", 586, 562, 56, INK, 7);
  hand(c, 600, 449, Math.PI / 2, 1.35);
  arrow(c, [[740, 470], [900, 470]]);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  tumblerWithStrip(c, 400, "#4f9f3a");
  tumblerWithStrip(c, 790, "#b9b53a");
  // 1 cm of liquid
  write(c, "1 cm", 22, 806, 36, INK, 6);
  line(c, [[168, 817], [168, 900]], 6); line(c, [[152, 817], [184, 817]], 6); line(c, [[152, 900], [184, 900]], 6);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const band = (x: number, y: number, h: number, col: string, w = 214) => { shape(c, () => rrect(c, x - w / 2, y, w, h, Math.min(26, h / 2)), col, 0); };
  for (const x of [300, 780]) { stripAt(c, x - 125, 90, 250, 700); line(c, [[x - 125, 730], [x + 125, 730]], 5, COL.greyDk); }
  // left: a big green band with a thin yellow band above it
  band(300, 560, 130, "#4f9f3a"); band(300, 470, 30, "#f4c82a");
  // right: a strong yellow band, only a little green
  band(780, 330, 190, "#f6b81f"); band(780, 640, 32, "#4f9f3a");
  leafAt(c, 170, 930, 260, 120);
  leafAt(c, 650, 930, 260, 120, "#e3c93f", "#b9982a");
};

// ---------------------------------------------------------------- e2 Straight or slanting
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  paperQuad(c, [[180, 780], [900, 780], [1020, 990], [60, 990]], 8, 4);
  patch(c, 580, 885, 82, 28);
  beam(c, [[515, 392], [645, 392], [665, 880], [495, 880]]);
  // a ruler standing on the paper, 20 at the level of the torch
  shadow(c, 215, 886, 70, 14);
  shape(c, () => c.rect(170, 360, 80, 524), COL.wood, 6);
  shade(c, () => c.rect(170, 360, 80, 524), COL.woodDk, 14, 0, 0.5);
  for (let k = 0; k <= 20; k++) { const y = 880 - k * 24.5; line(c, [[250, y], [k % 5 === 0 ? 205 : 228, y]], k % 5 === 0 ? 5 : 3); }
  write(c, "0", 182, 835, 28, INK, 5); write(c, "10", 182, 585, 28, INK, 5);
  line(c, [[250, 392], [515, 392]], 4, INK);
  write(c, "20 cm", 262, 322, 44, INK, 7);
  // torch pointing straight down, held by a hand from the right
  torch(c, 580, 392, Math.PI / 2, 300);
  shape(c, () => rrect(c, 640, 205, 460, 90, 10), CLOTH.child, 6);
  c.save(); c.translate(0, 500); c.scale(1, -1); hand(c, 685, 250, Math.PI, 1.5); c.restore();
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  paperQuad(c, [[420, 790], [980, 790], [1050, 995], [330, 995]], 8, 4);
  patch(c, 792, 890, 160, 52);
  beam(c, [[512, 560], [952, 880], [632, 890], [428, 660]]);
  // two piles of books, a staircase the torch rests on
  const books = (x: number, w: number, top: number, cols: string[]) => {
    const h = (820 - top) / cols.length;
    cols.forEach((col, i) => { const y = top + i * h; shape(c, () => rrect(c, x + (i % 2) * 8, y, w - (i % 2) * 8, h, 6), col, 6); line(c, [[x + (i % 2) * 8 + 14, y + h * 0.5], [x + w - 14, y + h * 0.5]], 4, WHITE); });
  };
  shadow(c, 240, 826, 220, 16);
  books(80, 220, 517, [COL.red, COL.blue, COL.green, COL.purple, COL.orange]);
  books(300, 100, 601, [COL.teal, COL.yellow, COL.pink]);
  torch(c, 470, 610, 0.698 + 0.0, 280);
  // 20 cm measured along the beam
  const d = [Math.cos(0.698), Math.sin(0.698)], n = [-d[1], d[0]], A = [470 - n[0] * 135, 610 - n[1] * 135], B = [A[0] + d[0] * 420, A[1] + d[1] * 420];
  line(c, [A, B], 5); for (const P of [A, B]) line(c, [[P[0] - n[0] * 18, P[1] - n[1] * 18], [P[0] + n[0] * 18, P[1] + n[1] * 18]], 5);
  write(c, "20 cm", 690, 560, 44, INK, 7);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  c.beginPath(); c.rect(94, 114, 920, 880); c.fillStyle = SH; c.fill();
  shape(c, () => c.rect(80, 100, 920, 880), WHITE, 6);
  for (let i = 1; i < 23; i++) line(c, [[80 + i * 40, 100], [80 + i * 40, 980]], 2.5, "#9cc7de");
  for (let j = 1; j < 22; j++) line(c, [[80, 100 + j * 40], [1000, 100 + j * 40]], 2.5, "#9cc7de");
  const outline = (x: number, y: number, rx: number, ry: number, num: string) => {
    c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = "rgba(255,226,110,0.45)"; c.fill();
    c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = "#4a4552"; c.lineWidth = 7; c.stroke();
    write(c, num, x - 40, y - 28, 56, INK, 8);
  };
  outline(280, 340, 80, 80, "13");
  outline(720, 300, 120, 80, "19");
  outline(520, 700, 280, 80, "44");
  // a pencil lying on the paper
  c.save(); c.translate(560, 920); c.rotate(-0.08);
  shadow(c, 150, 38, 260, 16);
  shape(c, () => polyP(c, [[-110, -24], [-110, 24], [-190, 0]]), COL.wood, 6);
  shape(c, () => polyP(c, [[-166, -8], [-166, 8], [-190, 0]]), INK, 3);
  shape(c, () => rrect(c, -110, -24, 360, 48, 6), COL.yellow, 6);
  line(c, [[-110, 2], [250, 2]], 3, COL.woodDk);
  shape(c, () => c.rect(250, -24, 36, 48), COL.steel, 6);
  shape(c, () => rrect(c, 286, -24, 50, 48, 12), COL.pink, 6);
  c.restore();
};

// ---------------------------------------------------------------- the cards, in order
export const su_dayNightSeasonsSeasons = cards("sci.day-night-seasons.seasons.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
