import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, cards } from "./flatKit";

// FALLING (sci.gravity.falling.L4) · set-up cards for the three experiments, then one card per
// experiment, activity and project, and three term cards. Flat kit look: see flatKit.ts.

const FLOOR = "#dcc9a6", TAPE = "#f3dfa0", DOUGH = "#d9b98a", DOUGHDK = "#b8966a", LCD = "#c9f06b", SCREEN = "#22303a", BLUE = "#3f6fb3";

// a room seen from the front: wall above the line, floor below
const room = (c: Ctx, fy: number) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, fy, D, D - fy); line(c, [[0, fy], [D, fy]], 5); };
// a table top (a wooden plank) across the card with its surface at y
const table = (c: Ctx, y: number) => { shape(c, () => polyP(c, [[40, y], [1040, y], [1040, y + 44], [40, y + 44]]), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(43, y + 30, 994, 11); for (const x of [120, 960]) shape(c, () => polyP(c, [[x - 22, y + 44], [x + 22, y + 44], [x + 22, D], [x - 22, D]]), COL.woodDk, 5); };
// dots along a path given as points
const dotted = (c: Ctx, pts: number[][], r = 6, col = INK) => { for (const [x, y] of pts) { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = col; c.fill(); } };
// points along the path of a thing that moves sideways at a steady pace and falls: from (x0, y0), forward dx, down dy, n dots
const fallPath = (x0: number, y0: number, dx: number, dy: number, n: number) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [x0 + dx * t, y0 + dy * t * t]; });
// a toss: up then down along a parabola from (x0, y0) forward dx, rising rise
const tossPath = (x0: number, y0: number, dx: number, rise: number, n: number) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [x0 + dx * t, y0 - rise * 4 * t * (1 - t)]; });

// a paper cupcake liner, opening up, bottom centre at (x, y), rim width w; n nested liners, each rim a little higher
const liner = (c: Ctx, x: number, y: number, w: number, n = 1, onTable = true) => {
  const h = w * 0.5, bw = w * 0.62, lift = w * 0.075;
  if (onTable) shadow(c, x + w * 0.1, y + 4, w * 0.45, w * 0.08);
  for (let i = 0; i < n; i++) {
    const yb = y - i * lift * 0.4, yt = yb - h - i * lift * 0.6;
    const body = () => { c.moveTo(x - w / 2, yt); c.lineTo(x + w / 2, yt); c.lineTo(x + bw / 2, yb); c.lineTo(x - bw / 2, yb); c.closePath(); };
    shape(c, body, COL.paper);
    shade(c, body, COL.grey, -w * 0.28, 0, 0.35);
    c.save(); c.beginPath(); body(); c.clip();
    for (let k = 1; k < 9; k++) { const u = -0.5 + k / 9; line(c, [[x + u * w, yt], [x + u * bw, yb]], 2.5, "rgba(43,35,64,0.35)"); }
    c.restore();
    shape(c, () => ell(c, x, yt, w / 2, w * 0.1), COL.cloth, 5);
    if (i === n - 1) shape(c, () => ell(c, x, yt + w * 0.01, w * 0.4, w * 0.065), "#e6dfd0", 0);
  }
};
// a strip of masking tape with torn ends, centre (x, y), long side w, turned by rot
const tape = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => polyP(c, [[-w / 2, -h / 2], [w / 2 - 7, -h / 2], [w / 2, -h / 6], [w / 2 - 6, h / 6], [w / 2, h / 2], [-w / 2 + 6, h / 2], [-w / 2, h / 6], [-w / 2 + 7, -h / 6]]), TAPE, 4);
  c.restore();
};
// a wooden ruler standing upright, its bottom end at (x, y); cm marks every px pixels, numbers every 10 cm
const rulerV = (c: Ctx, x: number, y: number, cmCount: number, px: number, w = 84) => {
  const len = cmCount * px + 40;
  shape(c, () => rrect(c, x - w / 2, y - len, w, len, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + w / 2 - 14, y - len + 4, 11, len - 8);
  for (let i = 0; i <= cmCount; i++) { const yy = y - 20 - i * px, l = i % 10 === 0 ? w * 0.4 : i % 5 === 0 ? w * 0.28 : w * 0.16; line(c, [[x - w / 2, yy], [x - w / 2 + l, yy]], i % 10 === 0 ? 4 : 2.5); }
  for (let i = 0; i <= cmCount; i += 10) write(c, String(i), x - w / 2 + w * 0.46, y - 20 - i * px - 11, 22, INK, 4);
  return (cm: number) => y - 20 - cm * px;
};
// a wooden ruler lying flat, seen edge on: left end at (x, y), its top edge at y
const rulerEdge = (c: Ctx, x: number, y: number, len: number, t = 26) => { shape(c, () => rrect(c, x, y, len, t, 4), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + t - 9, len - 6, 6); for (let i = 0; i <= 30; i++) line(c, [[x + 20 + i * (len - 40) / 30, y], [x + 20 + i * (len - 40) / 30, y + (i % 5 === 0 ? 11 : 6)]], 2.5); };
// a phone showing a stopwatch: centre (x, y), width w, height h, reading a.b seconds
const phone = (c: Ctx, x: number, y: number, w: number, h: number, a = "0", b = "00") => {
  shadow(c, x + 8, y + h / 2 + 4, w * 0.5, w * 0.1);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), COL.black);
  shape(c, () => rrect(c, x - w / 2 + w * 0.08, y - h / 2 + h * 0.07, w * 0.84, h * 0.86, w * 0.08), SCREEN, 3);
  const fh = w * 0.3, tw = (a.length + b.length) * fh * 0.8 + fh * 0.3, x0 = x - tw / 2;
  write(c, a, x0, y - fh * 0.6, fh, LCD, 5); c.beginPath(); ell(c, x0 + a.length * fh * 0.8 + fh * 0.08, y + fh * 0.4, fh * 0.07, fh * 0.07); c.fillStyle = LCD; c.fill(); write(c, b, x0 + a.length * fh * 0.8 + fh * 0.3, y - fh * 0.6, fh, LCD, 5);
  shape(c, () => ell(c, x, y + h * 0.3, w * 0.12, w * 0.12), COL.green, 3);
};
// a ball of atta dough
const doughBall = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), DOUGH); shade(c, () => ell(c, x, y, r, r), DOUGHDK, -r * 0.3, -r * 0.22, 0.5); shine(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.25, y - r * 0.62]], Math.max(4, r * 0.16)); };
// a yellow sticky note lying on the floor (a flat square seen from in front, so a little squashed)
const sticky = (c: Ctx, x: number, y: number, s: number, squash = 0.45) => shape(c, () => polyP(c, [[x - s / 2 - s * 0.1, y + s * squash / 2], [x + s / 2 - s * 0.1, y + s * squash / 2], [x + s / 2 + s * 0.1, y - s * squash / 2], [x - s / 2 + s * 0.1, y - s * squash / 2]]), COL.yellow, 4);
// a glass marble
const marble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.sky); shade(c, () => ell(c, x, y, r, r), COL.blue, -r * 0.35, -r * 0.25, 0.5); line(c, [[x - r * 0.5, y + r * 0.2], [x - r * 0.1, y - r * 0.3], [x + r * 0.45, y - r * 0.1]], Math.max(3, r * 0.14), COL.blueDk); shine(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.3, y - r * 0.6]], Math.max(4, r * 0.16)); };
// a lime
const lime = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r * 1.05, r), COL.green); shade(c, () => ell(c, x, y, r * 1.05, r), COL.greenDk, -r * 0.3, -r * 0.25, 0.5); shape(c, () => ell(c, x + r * 0.95, y, r * 0.18, r * 0.14), COL.greenLt, 3); shine(c, [[x - r * 0.5, y - r * 0.4], [x - r * 0.25, y - r * 0.6]], Math.max(4, r * 0.15)); };
// a tennis ball
const ball = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.greenLt); shade(c, () => ell(c, x, y, r, r), COL.green, -r * 0.3, -r * 0.22, 0.5); c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); line(c, [[x - r, y - r * 0.2], [x - r * 0.4, y + r * 0.35], [x + r * 0.4, y + r * 0.35], [x + r, y - r * 0.2]], 4, WHITE); c.restore(); };
// a slab of soft dough in a tray, seen from the side as a section: top of the dough at y, from x0 to x1, thickness t;
// dents are [centre x, width, depth]; the tray's two walls stand a little above the dough
const doughSlab = (c: Ctx, x0: number, x1: number, y: number, t: number, dents: number[][] = []) => {
  shadow(c, (x0 + x1) / 2 + 20, y + t + 10, (x1 - x0) / 2, 18);
  const top = () => {
    c.moveTo(x0, y);
    for (const [dx, dw, dd] of [...dents].sort((a, b) => a[0] - b[0])) { c.lineTo(dx - dw / 2, y); c.bezierCurveTo(dx - dw / 2, y + dd * 1.35, dx + dw / 2, y + dd * 1.35, dx + dw / 2, y); }
    c.lineTo(x1, y); c.lineTo(x1, y + t); c.lineTo(x0, y + t); c.closePath();
  };
  shape(c, top, DOUGH);
  shade(c, top, DOUGHDK, 0, -t * 0.4, 0.45);
  for (const x of [x0, x1]) shape(c, () => rrect(c, x - 12, y - 26, 24, t + 30, 4), COL.steel, 5);
  shape(c, () => rrect(c, x0 - 12, y + t, x1 - x0 + 24, 14, 3), COL.steelDk, 5);
};
// a cube built of n x n x n small cubes, drawn in isometric view, the front bottom corner at (x, y), full side L
const isoCube = (c: Ctx, x: number, y: number, L: number, n: number) => {
  const r = [Math.cos(Math.PI / 6) * L, -Math.sin(Math.PI / 6) * L], l = [-r[0], r[1]];
  const A = [x, y], B = [x + r[0], y + r[1]], C = [x + l[0], y + l[1]], Dp = [x, y + r[1] * 2], up = (p: number[]) => [p[0], p[1] - L];
  shadow(c, x + 30, y + 10, L * 0.95, L * 0.3);
  shape(c, () => polyP(c, [A, B, up(B), up(A)]), COL.cloth);
  shape(c, () => polyP(c, [A, C, up(C), up(A)]), COL.paper);
  shape(c, () => polyP(c, [up(A), up(B), up(Dp), up(C)]), WHITE);
  c.strokeStyle = "rgba(43,35,64,0.5)"; c.lineWidth = 3;
  for (let k = 1; k < n; k++) {
    const f = k / n;
    line(c, [[A[0] + r[0] * f, A[1] + r[1] * f], [A[0] + r[0] * f, A[1] + r[1] * f - L]], 3, "rgba(43,35,64,0.5)");
    line(c, [[A[0], A[1] - L * f], [B[0], B[1] - L * f]], 3, "rgba(43,35,64,0.5)");
    line(c, [[A[0] + l[0] * f, A[1] + l[1] * f], [A[0] + l[0] * f, A[1] + l[1] * f - L]], 3, "rgba(43,35,64,0.5)");
    line(c, [[A[0], A[1] - L * f], [C[0], C[1] - L * f]], 3, "rgba(43,35,64,0.5)");
    line(c, [[up(A)[0] + r[0] * f, up(A)[1] + r[1] * f], [up(C)[0] + r[0] * f, up(C)[1] + r[1] * f]], 3, "rgba(43,35,64,0.5)");
    line(c, [[up(A)[0] + l[0] * f, up(A)[1] + l[1] * f], [up(B)[0] + l[0] * f, up(B)[1] + l[1] * f]], 3, "rgba(43,35,64,0.5)");
  }
};
// a steel washer hanging at (x, y)
const washer = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.steel); shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.3, -r * 0.25, 0.5); shape(c, () => ell(c, x, y, r * 0.4, r * 0.4), BG, 4); };
// a grey stone
const stone = (c: Ctx, x: number, y: number, r: number) => { const p = () => polyP(c, [[x - r, y - r * 0.2], [x - r * 0.55, y - r * 0.85], [x + r * 0.35, y - r * 0.95], [x + r * 0.95, y - r * 0.3], [x + r * 0.85, y + r * 0.6], [x + r * 0.1, y + r], [x - r * 0.75, y + r * 0.65]]); shape(c, p, COL.grey); shade(c, p, COL.greyDk, -r * 0.35, -r * 0.3, 0.5); };
// a pencil lying at an angle, centre (x, y)
const pencil = (c: Ctx, x: number, y: number, len: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => polyP(c, [[-len / 2, -13], [len / 2 - 50, -13], [len / 2, 0], [len / 2 - 50, 13], [-len / 2, 13]]), COL.yellow, 5); shape(c, () => polyP(c, [[len / 2 - 50, -13], [len / 2, 0], [len / 2 - 50, 13]]), COL.wood, 4); shape(c, () => polyP(c, [[len / 2 - 16, -4], [len / 2, 0], [len / 2 - 16, 4]]), INK, 2); shape(c, () => rrect(c, -len / 2 - 4, -13, 30, 26, 4), COL.pink, 4); c.restore(); };
// a sheet of paper
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 6, w / 2, 16); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 5); };

// ---------------------------------------------------------------- set-up cards: e1 Liner Stacks
// 1. stacks of one, two, three and four liners in a row on a table
const e1s0 = (c: Ctx) => {
  ground(c); table(c, 700);
  [1, 2, 3, 4].forEach((n, i) => { const x = 180 + i * 240; liner(c, x, 700, 200, n); write(c, String(n), x - 22, 790, 70, INK, 8); });
};
// 2. tape on the wall at a grown-up's raised hand, a ruler taped beside it
const e1s1 = (c: Ctx) => {
  room(c, 950);
  const hands = person(c, 400, 960, 780, { adult: true, reachR: [540, 165] });
  const [hx, hy] = hands.handR;
  tape(c, hx + 190, hy, 170, 38);
  const rx = hx + 360, top = hy - 110;
  shape(c, () => rrect(c, rx - 42, top, 84, 330, 6), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(rx + 28, top + 4, 11, 322);
  for (let i = 0; i <= 30; i++) { const yy = top + 20 + i * 9.6; line(c, [[rx - 42, yy], [rx - 42 + (i % 10 === 0 ? 34 : i % 5 === 0 ? 24 : 13), yy]], i % 10 === 0 ? 4 : 2.5); }
  for (let i = 0; i <= 30; i += 10) write(c, String(i), rx - 4, top + 20 + i * 9.6 - 11, 22, INK, 4);
  tape(c, rx, top + 4, 70, 26, 0.1); tape(c, rx, top + 326, 70, 26, -0.08);
};
// 3. holding a single liner and a stack of four at the mark, openings up
const e1s2 = (c: Ctx) => {
  room(c, 950);
  tape(c, 540, 150, 720, 40);
  const hands = person(c, 540, 960, 780, { adult: true, reachL: [330, 170], reachR: [750, 170] });
  liner(c, hands.handL[0], hands.handL[1] - 14, 180, 4, false);
  liner(c, hands.handR[0], hands.handR[1] - 14, 180, 1, false);
};
// 4. a child at floor level timing a liner that floats down past the tape mark
const e1s3 = (c: Ctx) => {
  room(c, 900);
  tape(c, 760, 170, 420, 36);
  const hands = person(c, 240, 930, 520, { sit: true, reachR: [400, 700], reachL: [120, 900] });
  phone(c, hands.handR[0] + 6, hands.handR[1] - 60, 100, 180, "0", "8");
  liner(c, 790, 520, 190, 1, false);
  arrow(c, [[790, 580], [790, 760]]);
};
// 5. a bar for each stack on paper
const e1s4 = (c: Ctx) => {
  ground(c);
  paper(c, 130, 110, 820, 800);
  line(c, [[250, 180], [250, 800], [880, 800]], 6);
  [560, 330, 250, 200].forEach((h, i) => { const x = 300 + i * 150; shape(c, () => polyP(c, [[x, 800], [x + 100, 800], [x + 100, 800 - h], [x, 800 - h]]), COL.teal); write(c, String(i + 1), x + 28, 822, 56, INK, 7); });
  pencil(c, 560, 985, 420, 0.04);
};

// ---------------------------------------------------------------- set-up cards: e2 The Walking Drop
// 1. a tape line on the floor and a cross strip for the drop mark
const e2s0 = (c: Ctx) => {
  room(c, 230);
  const p: number[][] = [[150, 900], [900, 330]];
  line(c, p, 36, INK); line(c, p, 28, TAPE);
  const t = 0.78, mx = p[0][0] + (p[1][0] - p[0][0]) * t, my = p[0][1] + (p[1][1] - p[0][1]) * t, an = Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]);
  tape(c, mx, my, 150, 30, an + Math.PI / 2);
  write(c, "3 m", 250, 470, 90, INK, 10);
};
// 2. standing still, hand over the mark, the ball falls straight down to the note
const e2s1 = (c: Ctx) => {
  room(c, 900);
  const hands = person(c, 380, 930, 620, { reachR: [640, 520] });
  const [hx, hy] = hands.handR;
  tape(c, hx, 926, 170, 24);
  sticky(c, hx, 924, 110);
  doughBall(c, hx, hy + 150, 40);
  arrow(c, [[hx, hy + 210], [hx, hy + 330]]);
};
// 3. walking along the line and letting go as the hand passes the mark, a helper beside the line
const e2s2 = (c: Ctx) => {
  room(c, 900);
  line(c, [[60, 930], [1020, 930]], 32, INK); line(c, [[60, 930], [1020, 930]], 24, TAPE);
  const hands = person(c, 300, 930, 620, { reachR: [560, 520] });
  const [hx, hy] = hands.handR;
  tape(c, hx, 930, 24, 120);
  arrow(c, [[240, 250], [370, 250]]);
  const path = fallPath(hx, hy + 30, 120, 370, 12);
  dotted(c, path.slice(3), 6);
  doughBall(c, path[2][0], path[2][1], 38);
  person(c, 900, 950, 460, { sit: true, adult: true, dir: -1, reachL: [770, 920], reachR: [1030, 920] });
};
// 4. the landing note and a tape measure back to the mark, seen from above
const e2s3 = (c: Ctx) => {
  ground(c, FLOOR);
  line(c, [[0, 420], [D, 420]], 40, INK); line(c, [[0, 420], [D, 420]], 32, TAPE);
  tape(c, 230, 420, 40, 190, 0);
  shape(c, () => rrect(c, 745, 350, 160, 160, 8), COL.yellow, 5);
  shape(c, () => ell(c, 825, 430, 58, 50), DOUGH); shade(c, () => ell(c, 825, 430, 58, 50), DOUGHDK, -16, -12, 0.5);
  // the tape measure: hook at the mark, yellow blade, case near the note
  shape(c, () => rrect(c, 236, 640, 560, 44, 4), COL.yellow, 5);
  for (let i = 0; i <= 50; i++) line(c, [[240 + i * 11, 640], [240 + i * 11, 640 + (i % 10 === 0 ? 24 : i % 5 === 0 ? 16 : 9)]], 2.5);
  shape(c, () => rrect(c, 222, 628, 14, 68, 3), COL.steel, 4);
  shape(c, () => rrect(c, 790, 580, 170, 170, 26), COL.black);
  shape(c, () => ell(c, 875, 665, 48, 48), COL.yellow, 4);
};

// ---------------------------------------------------------------- set-up cards: e3 Dents in Dough
// 1. dough pressed flat in a tray, a spoon smoothing the top
const e3s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 420, 40);
  shape(c, () => rrect(c, 130, 300, 820, 520, 40), COL.steel);
  shade(c, () => rrect(c, 130, 300, 820, 520, 40), COL.steelDk, -30, -24, 0.5);
  shape(c, () => rrect(c, 180, 345, 720, 430, 26), DOUGH, 5);
  shade(c, () => rrect(c, 180, 345, 720, 430, 26), DOUGHDK, 40, 36, 0.35);
  // the spoon lies with its back on the dough, handle to the upper right
  c.save(); c.translate(560, 590); c.rotate(-0.55);
  shape(c, () => rrect(c, 40, -16, 330, 32, 16), COL.steel);
  shape(c, () => ell(c, -20, 0, 100, 68), COL.steel); shade(c, () => ell(c, -20, 0, 100, 68), COL.steelDk, -30, -20, 0.5);
  shine(c, [[-70, -25], [-20, -40]], 8);
  c.restore();
  arrow(c, [[330, 680], [460, 700], [600, 690]]);
};
// 2. a ruler upright beside the tray, the marble held at the 10 cm mark
const e3s1 = (c: Ctx) => {
  ground(c);
  doughSlab(c, 380, 980, 880, 90);
  const at = rulerV(c, 230, 900, 30, 18);
  const y10 = at(10);
  line(c, [[290, y10], [520, y10]], 4, RED);
  for (let x = 300; x < 520; x += 30) line(c, [[x, y10], [x + 14, y10]], 5, RED);
  marble(c, 600, y10 - 34, 34);
  hand(c, 600, y10 - 34 - 63, Math.PI / 2, 0.9);
  marble(c, 600, y10 - 34, 34);
};
// 3. three dents of growing depth, the marble sitting in the deepest
const e3s2 = (c: Ctx) => {
  ground(c);
  doughSlab(c, 100, 980, 640, 180, [[300, 110, 28], [540, 120, 52], [800, 130, 95]]);
  marble(c, 800, 640 + 95 - 20, 42);
  write(c, "10", 258, 480, 60, INK, 7); write(c, "20", 498, 480, 60, INK, 7); write(c, "40", 758, 480, 60, INK, 7);
  write(c, "cm", 490, 370, 40, INK, 5);
};
// 4. a ruler across the dent, a toothpick pushed to the bottom and pinched at the ruler's edge
const e3s3 = (c: Ctx) => {
  ground(c);
  doughSlab(c, 100, 980, 640, 180, [[540, 190, 110]]);
  rulerEdge(c, 240, 614, 600, 26);
  shape(c, () => polyP(c, [[533, 750], [547, 750], [546, 430], [534, 430]]), COL.wood, 4);
  line(c, [[526, 614], [554, 614]], 7, RED);
  hand(c, 540 + 63, 560, Math.PI, 0.9);
};

// ---------------------------------------------------------------- experiment, activity and project cards
// Liner Stacks: the grown-up has let go; the stack of four is ahead of the single liner, the child times
const fE1 = (c: Ctx) => {
  room(c, 900);
  tape(c, 690, 150, 560, 40);
  const ad = person(c, 690, 950, 780, { adult: true, reachL: [500, 170], reachR: [880, 170] });
  liner(c, ad.handL[0], 620, 150, 4, false); arrow(c, [[ad.handL[0], 670], [ad.handL[0], 790]]);
  liner(c, ad.handR[0], 420, 150, 1, false); arrow(c, [[ad.handR[0], 460], [ad.handR[0], 540]]);
  const ch = person(c, 190, 930, 480, { sit: true, reachR: [330, 720], reachL: [80, 900] });
  phone(c, ch.handR[0] + 6, ch.handR[1] - 56, 92, 166, "0", "6");
};
// The Walking Drop: walking, letting go at the mark, the ball lands ahead of the mark
const fE2 = (c: Ctx) => {
  room(c, 900);
  line(c, [[60, 930], [1020, 930]], 32, INK); line(c, [[60, 930], [1020, 930]], 24, TAPE);
  const hands = person(c, 330, 930, 640, { reachR: [600, 510] });
  const [hx, hy] = hands.handR;
  tape(c, hx, 930, 24, 120);
  arrow(c, [[hx - 60, 700], [hx + 70, 700]]);
  const path = fallPath(hx, hy + 30, 160, 370, 14);
  dotted(c, path.slice(3), 6);
  doughBall(c, path[2][0], path[2][1], 38);
  sticky(c, hx + 160, 928, 110);
  arrow(c, [[hx, 1010], [hx + 160, 1010]], BLUE, 8);
};
// Dents in Dough: the marble from 10, 20 and 40 cm, and the dent each makes
const fE3 = (c: Ctx) => {
  ground(c);
  doughSlab(c, 300, 1000, 800, 120, [[480, 90, 22], [680, 100, 42], [880, 110, 80]]);
  const at = rulerV(c, 180, 920, 40, 15, 80);
  for (const [cm, x] of [[10, 480], [20, 680], [40, 880]]) { const y = at(cm); for (let k = 0; k < 9; k++) line(c, [[x - 120 + k * 30, y], [x - 106 + k * 30, y]], 4, RED); marble(c, x, y - 30, 30); dotted(c, Array.from({ length: Math.floor((800 - y) / 36) }, (_, i) => [x, y + 20 + i * 36]), 4, COL.greyDk); }
};
// Toss on the Move: walking and tossing a lime straight up; it moves forward with her
const fA1 = (c: Ctx) => {
  room(c, 900);
  const hands = person(c, 400, 930, 640, { reachR: [560, 300] });
  const [hx, hy] = hands.handR;
  arrow(c, [[hx - 40, 760], [hx + 110, 760]]);
  const path = tossPath(hx, hy - 20, 260, 240, 16);
  dotted(c, path.slice(1), 6);
  lime(c, path[8][0], path[8][1], 40);
};
// Cube Animals: one cube, a 2 x 2 x 2 cube and a 3 x 3 x 3 cube
const fA2 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.wood; c.fillRect(0, 560, D, D - 560); line(c, [[0, 560], [D, 560]], 5); c.fillStyle = COL.woodDk; c.fillRect(0, 1040, D, 40);
  isoCube(c, 118, 720, 85, 1); isoCube(c, 400, 760, 170, 2); isoCube(c, 820, 820, 255, 3);
  write(c, "1", 96, 800, 70, INK, 8); write(c, "8", 376, 840, 70, INK, 8); write(c, "27", 770, 900, 70, INK, 8);
};
// Swings: a washer on a string from a door frame, pulled to one side, with a ruler and a stopwatch
const fA3 = (c: Ctx) => {
  room(c, 960);
  for (const x of [60, 980]) { shape(c, () => rrect(c, x, 60, 44, 920, 6), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(x + 30, 64, 10, 912); }
  shape(c, () => rrect(c, 60, 60, 964, 54, 6), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(64, 100, 956, 10);
  const px = 540, py = 114, L = 560, an = 0.42, wx = px + Math.sin(an) * L, wy = py + Math.cos(an) * L;
  tape(c, px, py + 6, 70, 26);
  for (let i = 0; i < 12; i++) { const t = (i + 0.5) / 12; c.beginPath(); ell(c, px, py + L * t, 4, 4); c.fillStyle = COL.greyDk; c.fill(); }
  line(c, [[px, py], [wx, wy]], 5, COL.greyDk);
  washer(c, wx, wy, 44);
  c.beginPath(); c.arc(px, py, L, Math.PI / 2 - an + 0.1, Math.PI / 2 + 0.02, false); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  arrow(c, [[px + Math.sin(0) * L, py + Math.cos(0) * L], [px + Math.sin(-0.07) * L, py + Math.cos(-0.07) * L]]);
  const at = rulerV(c, 360, py + L + 50, 50, 10.4, 80);
  line(c, [[400, at(50)], [500, at(50)]], 4, RED); line(c, [[400, at(0)], [500, at(0)]], 4, RED);
  phone(c, 820, 860, 120, 210, "20", "0");
};
// Falling on Video: a tape measure up the wall with flags, a phone on books filming, the ball falling past the tape
const fP1 = (c: Ctx) => {
  room(c, 900);
  shape(c, () => rrect(c, 374, 180, 52, 720, 4), COL.yellow, 5);
  for (let i = 0; i <= 100; i++) { const y = 900 - i * 7.2; line(c, [[374, y], [374 + (i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11), y]], i % 10 === 0 ? 4 : 2); }
  for (let i = 1; i <= 10; i++) tape(c, 455, 900 - i * 72, 70, 24);
  write(c, "2 m", 300, 100, 60, INK, 7);
  ball(c, 540, 500, 40); arrow(c, [[540, 560], [540, 690]]);
  for (let i = 0; i < 3; i++) shape(c, () => rrect(c, 700 + (i % 2) * 10, 900 - (i + 1) * 46, 240, 46, 6), [COL.red, COL.blue, COL.green][i], 5);
  shape(c, () => rrect(c, 790, 762 - 150, 70, 150, 10), COL.black);
  shape(c, () => rrect(c, 798, 622, 54, 130, 6), SCREEN, 3);
  shape(c, () => ell(c, 806, 640, 7, 7), COL.steelDk, 2);
  dotted(c, Array.from({ length: 9 }, (_, i) => [775 - i * 38, 660 - i * 6]), 4, COL.greyDk);
};

// ---------------------------------------------------------------- term and explanation cards
// Acceleration: a falling stone drawn three times, with the speeds 10, 20 and 30 beside it
const tAccel = (c: Ctx) => {
  ground(c);
  for (let y = 60; y < D; y += 40) line(c, [[540, y], [540, y + 16]], 3, COL.greyDk);
  [[200, 10], [430, 20], [800, 30]].forEach(([y, v]) => { stone(c, 540, y, 60); arrow(c, [[640, y - 10], [640, y - 10 + v * 7]]); write(c, String(v), 700, y - 20, 90, INK, 9); });
};
// a heavier thing of the same shape falls faster: one liner and a stack of four, the stack ahead
const xStack = (c: Ctx) => {
  room(c, 920);
  liner(c, 330, 420, 240, 1, false); arrow(c, [[330, 470], [330, 580]]);
  liner(c, 750, 720, 240, 4, false); arrow(c, [[750, 770], [750, 890]]);
};
// Terminal speed: a raindrop, the pull down and the push of the air up, equal
const tTerminal = (c: Ctx) => {
  ground(c);
  const x = 540, y = 460, r = 150;
  const drop = () => { c.moveTo(x, y - r * 1.9); c.bezierCurveTo(x + r * 0.25, y - r * 1.1, x + r, y - r * 0.7, x + r, y); c.arc(x, y, r, 0, Math.PI, false); c.bezierCurveTo(x - r, y - r * 0.7, x - r * 0.25, y - r * 1.1, x, y - r * 1.9); c.closePath(); };
  shape(c, drop, COL.water); shade(c, drop, COL.waterDk, -r * 0.3, -r * 0.3, 0.5); shine(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.35, y - r * 0.75]], 14);
  arrow(c, [[x - 290, y], [x - 290, y + 380]], RED, 14);
  arrow(c, [[x + 290, y + 380], [x + 290, y]], BLUE, 14);
  for (let i = 0; i < 5; i++) { const px = x - 90 + i * 45, py = y + r + 70 + (i % 2) * 40; c.beginPath(); ell(c, px, py, 16, 16); c.fillStyle = COL.sky; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); line(c, [[px, py + 30], [px, py + 70]], 4, BLUE); }
};

export const ic_gravityFallingL4 = cards("sci.gravity.falling.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, e3s0, e3s1, e3s2, e3s3,
  fE1, fE2, fE3, fA1, fA2, fA3, fP1, tAccel, xStack, tTerminal,
]);
