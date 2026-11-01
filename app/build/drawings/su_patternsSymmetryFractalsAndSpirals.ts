import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, WHITE, arrow, cards, ell, ground, hand, leaf, line, plate, polyP, rrect, shade, shadow, shape, write } from "./flatKit";

// FRACTALS AND SPIRALS L3 · set-up cards: measuring a coast with strips and thread (e1), counting
// the spiral rows on a pineapple (e2).

// ---------------------------------------------------------------- shared pieces
// the coast line of a map (west coast: sea on the left, land on the right), as many points
const BASE: number[][] = [[600, 20], [500, 150], [650, 270], [480, 400], [660, 530], [490, 660], [650, 790], [500, 920], [600, 1040]];
const coast = (sx: number, ox: number, oy: number): number[][] => {
  const P = BASE.map(([x, y]) => [ox + x * sx, oy + y * sx]), out: number[][] = [P[0]];
  let prev = P[0];
  for (let i = 1; i < P.length - 1; i++) {
    const m = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2];
    for (let t = 1; t <= 16; t++) { const u = t / 16, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u; out.push([a * prev[0] + b * P[i][0] + d * m[0], a * prev[1] + b * P[i][1] + d * m[1]]); }
    prev = m;
  }
  out.push(P[P.length - 1]);
  return out;
};
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const curveLen = (S: number[][]) => S.slice(1).reduce((s, p, i) => s + dist(p, S[i]), 0);
// dots a strip of length d would mark: each next dot is the first coast point a strip's length from the last
const stepDots = (S: number[][], d: number) => { const out = [S[0]]; for (const p of S) if (dist(p, out[out.length - 1]) >= d) out.push(p); return out; };

// a paper map: sea on the left, land on the right, the coast in ink
const mapSheet = (c: Ctx, x: number, y: number, w: number, h: number, S: number[][]) => {
  shape(c, () => rrect(c, x + 14, y + 18, w, h, 14), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, x, y, w, h, 14), COL.water, 0);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 14); c.clip();
  const ext = [[S[0][0], y - 300], ...S, [S[S.length - 1][0], y + h + 300]];
  c.beginPath(); ext.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py))); c.lineTo(x + w + 50, y + h + 300); c.lineTo(x + w + 50, y - 300); c.closePath(); c.fillStyle = COL.greenLt; c.fill();
  line(c, ext, 7);
  c.globalAlpha = 0.7; for (let k = 0; k < 4; k++) { const wy = y + h * (0.15 + k * 0.22), wx = x + w * 0.1 + (k % 2) * w * 0.07; line(c, [[wx, wy], [wx + w * 0.05, wy - 10], [wx + w * 0.1, wy]], 6, WHITE); }
  c.globalAlpha = 1; c.restore();
  shape(c, () => rrect(c, x, y, w, h, 14), "rgba(0,0,0,0)", 6);
};
// a card strip lying between two points (width wd), yellow with an ink outline
const strip = (c: Ctx, a: number[], b: number[], wd: number) => {
  c.save(); c.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); c.rotate(Math.atan2(b[1] - a[1], b[0] - a[0]));
  const L = dist(a, b); shape(c, () => rrect(c, -L / 2, -wd / 2, L, wd, 6), COL.yellow, 6); shade(c, () => rrect(c, -L / 2, -wd / 2, L, wd, 6), COL.woodDk, -2, -wd * 0.3, 0.7); c.restore();
};
const dot = (c: Ctx, p: number[], r = 14, col = INK) => { c.beginPath(); c.arc(p[0], p[1], r, 0, Math.PI * 2); c.fillStyle = col; c.fill(); };
// a hand reaching in from the right, wrist at (wx, wy), pointing at angle an; `under` draws in the hand's own frame (arm already drawn)
const reach = (c: Ctx, wx: number, wy: number, an: number, s: number, under?: () => void) => {
  const mirror = Math.cos(an) < 0, a = mirror ? Math.PI - an : an;
  c.save(); c.translate(wx, wy); if (mirror) c.scale(-1, 1);
  c.save(); c.rotate(a); shape(c, () => rrect(c, -700, -34 * s, 700 - 50 * s, 68 * s, 10), CLOTH.child, 6); under?.(); c.restore();
  hand(c, 0, 0, a, s); c.restore();
};
// a pen or pencil held in the hand, drawn in the hand's frame; its point is 300*s from the wrist
const pencil = (c: Ctx, s: number, body: string, tip: string) => {
  shape(c, () => rrect(c, 10 * s, -13 * s, 230 * s, 26 * s, 8 * s), body, 5);
  shape(c, () => polyP(c, [[240 * s, -13 * s], [300 * s, -3.5 * s], [300 * s, 3.5 * s], [240 * s, 13 * s]]), tip, 5);
  shape(c, () => polyP(c, [[284 * s, -4 * s], [300 * s, -3.5 * s], [300 * s, 3.5 * s], [284 * s, 4 * s]]), INK, 0);
};
// a pencil held so that its point rests on t, coming in from the right and a little above
const pencilAt = (c: Ctx, t: number[], s: number, body: string, tip: string) => {
  const an = Math.PI - 0.3, wx = t[0] - Math.cos(an) * 300 * s, wy = t[1] - Math.sin(an) * 300 * s;
  reach(c, wx, wy, an, s, () => pencil(c, s, body, tip));
};

// ---------------------------------------------------------------- the pineapple
const PX = 540, PY = 620, PR = 190, PH = 250, DPHI = (2 * Math.PI) / 10, DV = 0.18;
// the scale in row-lattice place (m, n): n goes up the fruit, m is the column it starts from
const scalePos = (m: number, n: number) => {
  const phi = (m + 0.5 * n) * DPHI, v = n * DV, rw = Math.sqrt(1 - v * v);
  return { phi, vis: Math.cos(phi) > 0.3, x: PX + PR * rw * Math.sin(phi), y: PY - PH * v, wx: 0.5 * DPHI * PR * rw * Math.cos(phi), hy: DV * PH };
};
const pineapple = (c: Ctx) => {
  plate(c, PX, 870, 370, 100);
  shadow(c, PX + 28, 872, 170, 32);
  for (let k = -4; k <= 4; k++) leaf(c, PX + k * 15, PY - PH + 24, 250 - Math.abs(k) * 22, -Math.PI / 2 + k * 0.2, k % 2 ? COL.leafDk : COL.leaf);
  const body = () => ell(c, PX, PY, PR, PH);
  shape(c, body, COL.orange, 0);
  c.save(); c.beginPath(); body(); c.clip();
  for (let n = -4; n <= 4; n++) for (let m = -10; m <= 10; m++) {
    const s = scalePos(m, n); if (!s.vis) continue;
    shape(c, () => polyP(c, [[s.x - s.wx, s.y], [s.x, s.y - s.hy], [s.x + s.wx, s.y], [s.x, s.y + s.hy]]), s.phi > 0.45 ? COL.orange : COL.yellow, 4);
    shape(c, () => polyP(c, [[s.x - s.wx * 0.28, s.y + s.hy * 0.12], [s.x, s.y - s.hy * 0.3], [s.x + s.wx * 0.28, s.y + s.hy * 0.12], [s.x, s.y + s.hy * 0.4]]), COL.brown, 0);
  }
  c.restore();
  shade(c, body, COL.soilDk, -PR * 0.38, -PH * 0.06, 0.28);
  shape(c, body, "rgba(0,0,0,0)", 7);
};
// a row of scales marked with a coloured line: (m, n) pairs
const trace = (c: Ctx, col: string, ids: number[][]) => {
  const pts = ids.map(([m, n]) => scalePos(m, n)).filter((s) => s.vis).map((s) => [s.x, s.y]);
  line(c, pts, 20, INK); line(c, pts, 11, col);
};
const rowRed = (): number[][] => [-4, -3, -2, -1, 0, 1, 2].map((n) => [1, n]);
const rowBlue = (k: number): number[][] => [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((n) => [k - n, n]);

// ---------------------------------------------------------------- the cards
// setup.e1.0
const cardCoastKit = (c: Ctx) => {
  ground(c);
  mapSheet(c, 160, 80, 760, 560, coast(0.58, 215, 68));
  // the 4 cm strip, the 1 cm strip (a quarter as long), and a ball of thread
  shadow(c, 340, 800, 270, 40); shadow(c, 700, 800, 80, 28);
  strip(c, [100, 765], [580, 765], 76); write(c, "4 cm", 270, 740, 48, INK, 7);
  strip(c, [640, 765], [760, 765], 76); write(c, "1 cm", 650, 745, 36, INK, 6);
  shadow(c, 905, 870, 100, 26);
  line(c, [[820, 830], [760, 880], [690, 860], [640, 890]], 20, INK); line(c, [[820, 830], [760, 880], [690, 860], [640, 890]], 10, COL.purple);
  shape(c, () => ell(c, 900, 810, 82, 82), COL.purple, 6);
  shade(c, () => ell(c, 900, 810, 82, 82), COL.black, -26, -26, 0.4);
  for (let k = -2; k <= 2; k++) line(c, [[900 - 70, 810 + k * 26 + 10], [900, 810 + k * 26 + 28], [900 + 70, 810 + k * 26 + 10]], 4, "#5d45a0");
};
// setup.e1.1
const cardStep4 = (c: Ctx) => {
  ground(c);
  const S = coast(1, 0, 0); mapSheet(c, 30, 30, 1020, 1020, S);
  const D = stepDots(S, 240), p = D[1], a = D[2], b = D[3];
  // where the strip was a moment ago (faint), the dots already made, the strip now: it turns round its end on the dot at a
  c.globalAlpha = 0.4; strip(c, p, a, 52); c.globalAlpha = 1;
  dot(c, D[0], 16); dot(c, p, 16);
  strip(c, a, b, 52);
  dot(c, a, 16); dot(c, b, 16);
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ux = (b[0] - a[0]) / dist(a, b), uy = (b[1] - a[1]) / dist(a, b);
  let nx = -uy, ny = ux; if (nx < 0) { nx = -nx; ny = -ny; }
  reach(c, mx + nx * 70 * 1.5, my + ny * 70 * 1.5, Math.atan2(-ny, -nx), 1.5);
  // the red arrow swings from the old strip end round to the new one, centred on the pivot dot
  const r = 205, a1 = Math.atan2(p[1] - a[1], p[0] - a[0]);
  let a2 = Math.atan2(b[1] - a[1], b[0] - a[0]); while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
  arrow(c, [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.96].map((u) => [a[0] + Math.cos(a1 + (a2 - a1) * u) * r, a[1] + Math.sin(a1 + (a2 - a1) * u) * r]), RED, 12);
};
// setup.e1.2
const cardStep1 = (c: Ctx) => {
  ground(c);
  const S = coast(1, 0, 0); mapSheet(c, 30, 30, 1020, 1020, S);
  const D = stepDots(S, 60), k = 13;
  for (let i = 0; i <= k; i++) dot(c, D[i], 11);
  strip(c, D[k], D[k + 1], 36);
  dot(c, D[k], 11); dot(c, D[k + 1], 11, COL.black);
  pencilAt(c, D[k + 1], 1.2, COL.teal, COL.wood);
};
// setup.e1.3
const cardThread = (c: Ctx) => {
  ground(c);
  const S = coast(0.56, 232, 36); mapSheet(c, 160, 30, 760, 590, S);
  const L = curveLen(S);
  line(c, S, 22, INK); line(c, S, 12, COL.purple);
  // the same thread straightened beside a ruler
  shadow(c, 560, 830, 450, 24);
  shape(c, () => rrect(c, 60, 735, 960, 100, 8), COL.wood, 6);
  for (let i = 0; i <= 10; i++) { const x = 100 + i * 90; line(c, [[x, 735], [x, 735 + 40]], 5); write(c, String(i), x - 12, 785, 36, INK, 5); }
  for (let i = 0; i < 10; i++) line(c, [[145 + i * 90, 735], [145 + i * 90, 735 + 22]], 3);
  const end = [100 + L, 705];
  line(c, [[100, 705], end], 20, INK); line(c, [[100, 705], end], 10, COL.purple);
  reach(c, end[0] + 70 * 0.95, end[1], Math.PI, 0.95);
};
// setup.e2.0
const cardRowRight = (c: Ctx) => { ground(c); pineapple(c); trace(c, RED, rowRed()); };
// setup.e2.1
const cardMark = (c: Ctx) => {
  ground(c); pineapple(c);
  const s = scalePos(1, -4), t = [s.x, s.y];
  // a big purple dot on one scale, the pen point resting right on it
  dot(c, t, 30, INK); dot(c, t, 22, COL.purple);
  const sc = 1.1, an = 2.7, wx = t[0] - Math.cos(an) * 300 * sc, wy = t[1] - Math.sin(an) * 300 * sc;
  reach(c, wx, wy, an, sc, () => pencil(c, sc, COL.purple, "#5d45a0"));
};
// setup.e2.2
const cardRowsLeft = (c: Ctx) => {
  ground(c); pineapple(c);
  trace(c, COL.blue, rowBlue(-1)); trace(c, COL.blue, rowBlue(1)); trace(c, RED, rowRed());
};

export const su_patternsSymmetryFractalsAndSpirals = cards("sci.patterns-symmetry.fractals-and-spirals.L3 set-up", [
  cardCoastKit, cardStep4, cardStep1, cardThread, cardRowRight, cardMark, cardRowsLeft,
]);
