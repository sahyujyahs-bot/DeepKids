import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, leaf, hand, person, write, cards } from "./flatKit";

// FIVE SENSES (L1) · set-up cards for the Smell Steps experiment, then the card pictures.
// Same child (orange top) and grown-up (blue top) on every card; a pink dupatta covers the eyes.

const FLOOR = "#e2d3b4";
const room = (c: Ctx, fy = 600) => { ground(c, BG); c.fillStyle = FLOOR; c.fillRect(0, fy, D, D - fy); line(c, [[0, fy], [D, fy]], 5); };
// a shut window on the wall (the windows are shut for the smell test)
const window_ = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), COL.wood);
  shape(c, () => rrect(c, x + 18, y + 18, w - 36, h - 36, 4), COL.sky, 5);
  line(c, [[x + w / 2, y + 18], [x + w / 2, y + h - 18]], 8); line(c, [[x + 18, y + h / 2], [x + w - 18, y + h / 2]], 8);
};
// a low wooden table: top face from yTop, depth deep, then a front edge and two legs
const table = (c: Ctx, x: number, yTop: number, w: number, deep: number, legH: number) => {
  const yF = yTop + deep;
  shadow(c, x + 24, yF + 30 + legH + 4, w / 2 + 10, 16);
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 - 25) - 15, yF + 28, 30, legH, 4), COL.woodDk);
  shape(c, () => polyP(c, [[x - w / 2 + 36, yTop], [x + w / 2 - 36, yTop], [x + w / 2, yF], [x - w / 2, yF]]), COL.wood);
  shape(c, () => rrect(c, x - w / 2, yF, w, 30, 4), COL.woodDk);
};
const chalk = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => { line(c, [[x0, y0], [x1, y1]], 24, "rgba(43,35,64,0.25)"); line(c, [[x0, y0], [x1, y1]], 16, WHITE); };

// ---------------------------------------------------------------- people helpers
const geo = (x: number, y: number, h: number, sit = false) => {
  const hip = sit ? y - h * 0.06 : y - h * 0.42, sh = sit ? hip - h * 0.32 : y - h * 0.74, head = h * 0.13;
  return { hip, sh, head, hy: sh - head * 1.05, sy: sh + h * 0.03, sxL: x - h * 0.11, sxR: x + h * 0.11, nose: [x, sh - head * 1.05 + head * 0.28] as [number, number] };
};
// joint angles that put the hand at (tx, ty); bend = +1 puts the elbow on the clockwise side of the shoulder-to-hand line
const reach = (x: number, y: number, h: number, side: -1 | 1, tx: number, ty: number, bend = 1, sit = false): [number, number] => {
  const g = geo(x, y, h, sit), sx = side < 0 ? g.sxL : g.sxR, sy = g.sy, l1 = h * 0.17, l2 = h * 0.16;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const m = l1 + l2 - 2; if (d > m) { dx *= m / d; dy *= m / d; d = m; }
  const th = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const a1 = th + bend * al, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};
// the hand drawn again over a held object
const grip = (c: Ctx, x: number, y: number, h: number, adult = false) => shape(c, () => ell(c, x, y, h * 0.037, h * 0.037), adult ? SKIN.adult : SKIN.child, 5);
const blindfold = (c: Ctx, x: number, y: number, h: number, sit = false) => {
  const g = geo(x, y, h, sit), r = g.head;
  shape(c, () => { c.moveTo(x + r * 0.9, g.hy + r * 0.05); c.quadraticCurveTo(x + r * 1.7, g.hy + r * 0.15, x + r * 1.55, g.hy + r * 0.95); c.quadraticCurveTo(x + r * 1.35, g.hy + r * 0.6, x + r * 0.9, g.hy + r * 0.4); c.closePath(); }, COL.pink, 5);
  shape(c, () => rrect(c, x - r * 1.1, g.hy - r * 0.12, r * 2.2, r * 0.5, r * 0.2), COL.pink, 5);
};
const eyesShut = (c: Ctx, x: number, y: number, h: number, sit = false, adult = false) => {
  const g = geo(x, y, h, sit), r = g.head;
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * r * 0.35, g.hy + r * 0.12, r * 0.17, r * 0.2), adult ? SKIN.adult : SKIN.child, 0);
    c.beginPath(); c.arc(x + s * r * 0.35, g.hy + r * 0.02, r * 0.15, 0.35, Math.PI - 0.35); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  }
};
// faint wavy lines of smell drifting from (x0, y0) to (x1, y1)
const smell = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n = 3, spread = 34) => {
  const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * spread, pts: number[][] = [];
    for (let t = 0; t <= 1.001; t += 0.04) { const w = Math.sin(t * Math.PI * 4 + i * 1.3) * 12; pts.push([x0 + (x1 - x0) * t + (nx / L) * (off + w), y0 + (y1 - y0) * t + (ny / L) * (off + w)]); }
    c.globalAlpha = 0.55; line(c, pts, 6, COL.greyDk); c.globalAlpha = 1;
  }
};

// ---------------------------------------------------------------- things
const orangeWhole = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.95, r * 0.9, r * 0.22);
  shape(c, () => ell(c, x, y, r, r), COL.orange); shade(c, () => ell(c, x, y, r, r), "#c7731f", r * 0.35, r * 0.2);
  shape(c, () => ell(c, x - r * 0.1, y - r * 0.95, r * 0.12, r * 0.08), COL.greenDk, 3); leaf(c, x - r * 0.05, y - r * 0.95, r * 0.6, -0.6);
};
const FLESH = "#f8b956", FLESH_DK = "#e08f33", PITH = "#fde7b8";
const flesh = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), FLESH); shade(c, () => ell(c, x, y, r, r), FLESH_DK, r * 0.35, r * 0.2);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.15, y + Math.sin(a) * r * 0.15], [x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92]], r * 0.09, PITH); }
};
const peelCurl = (c: Ctx, pts: number[][]) => { line(c, pts, 26, INK); line(c, pts, 16, COL.orange); };
const orangePeeled = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.95, r * 0.9, r * 0.22); flesh(c, x, y, r);
  peelCurl(c, [[x - r * 1.9, y + r * 0.9], [x - r * 1.5, y + r * 0.5], [x - r * 1.1, y + r * 0.9]]);
  peelCurl(c, [[x + r * 1.2, y + r * 1.0], [x + r * 1.7, y + r * 0.6], [x + r * 2.1, y + r * 1.0]]);
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 5, w * 0.6, w * 0.12);
  const p = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, w * 0.3, 0); shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5); shine(c, [[x - w * 0.3, y - h * 0.8], [x - w * 0.25, y - h * 0.25]], 6);
};
// a steel spoon, handle end at (x0, y0), bowl at (x1, y1)
const spoon = (c: Ctx, x0: number, y0: number, x1: number, y1: number, s = 1) => {
  line(c, [[x0, y0], [x1, y1]], 22 * s, INK); line(c, [[x0, y0], [x1, y1]], 12 * s, COL.steel);
  const an = Math.atan2(y1 - y0, x1 - x0), bx = x1 + Math.cos(an) * 18 * s, by = y1 + Math.sin(an) * 18 * s;
  shape(c, () => ell(c, bx, by, 30 * s, 20 * s, an), COL.steel, 5); shape(c, () => ell(c, bx, by, 20 * s, 12 * s, an), COL.steelIn, 0);
};
// a small bottle standing with its bottom centre at (x, y)
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 4, w * 0.55, w * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h * 0.78, w, h * 0.78, w * 0.25), WHITE); shade(c, () => rrect(c, x - w / 2, y - h * 0.78, w, h * 0.78, w * 0.25), "#d8d3c8", w * 0.3, 0);
  shape(c, () => rrect(c, x - w * 0.32, y - h, w * 0.64, h * 0.26, 6), COL.blue);
};
const sprig = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len; line(c, [[x, y], [tx, ty]], 5, COL.leafDk);
  for (let k = 1; k <= 3; k++) { const px = x + ((tx - x) * k) / 3.2, py = y + ((ty - y) * k) / 3.2; leaf(c, px, py, len * 0.32, an - 0.9); leaf(c, px, py, len * 0.32, an + 0.9); }
  leaf(c, tx, ty, len * 0.3, an);
};
const shake = (c: Ctx, x: number, y: number, s: number) => { for (const dy of [-26, 0, 26]) line(c, [[x, y + dy], [x + s * 22, y + dy * 1.3]], 6, COL.greyDk); };

// ================================================================ set-up cards
// 1. the plate with a whole orange on a low table, a chalk line six small steps away
const setup0 = (c: Ctx) => {
  room(c); window_(c, 120, 110, 300, 300);
  chalk(c, 300, 780, 220, 1010);
  const r = rnd(3);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 365 + i * 58, 900 + (i % 2 ? -22 : 22), 24, 13, (r() - 0.5) * 0.3), "rgba(43,35,64,0.16)", 0);
  table(c, 820, 660, 360, 70, 190);
  plate(c, 820, 700, 150, 48); orangeWhole(c, 820, 658, 50);
};
// 2. the girl at the line, eyes covered; the grown-up peels the orange over the plate
const setup1 = (c: Ctx) => {
  room(c); window_(c, 120, 110, 300, 300);
  chalk(c, 300, 900, 230, 1010);
  person(c, 260, 965, 480); blindfold(c, 260, 965, 480);
  const A = [700, 985, 600] as const, O: [number, number] = [600, 662], P: [number, number] = [700, 640];
  person(c, A[0], A[1], A[2], { adult: true, armL: reach(A[0], A[1], A[2], -1, O[0], O[1], 1), armR: reach(A[0], A[1], A[2], 1, P[0], P[1], -1) });
  table(c, 640, 720, 320, 70, 160);
  plate(c, 640, 760, 125, 38);
  peelCurl(c, [[560, 775], [590, 745], [620, 775]]);
  // the orange, half peeled: flesh showing on the right, peel still on the left
  flesh(c, O[0], O[1], 46);
  shape(c, () => { c.moveTo(O[0], O[1]); c.arc(O[0], O[1], 46, Math.PI * 0.3, Math.PI * 1.7); c.closePath(); }, COL.orange);
  peelCurl(c, [[P[0], P[1]], [P[0] + 22, P[1] + 55], [P[0] - 10, P[1] + 105]]);
  grip(c, O[0] - 20, O[1] + 10, 600, true); grip(c, P[0], P[1], 600, true);
};
// 3. one step from the table, hand raised high
const setup2 = (c: Ctx) => {
  room(c); window_(c, 120, 110, 300, 300);
  chalk(c, 150, 820, 90, 1010);
  table(c, 770, 690, 320, 70, 180);
  plate(c, 770, 728, 125, 38); orangePeeled(c, 765, 690, 42);
  person(c, 430, 965, 480, { armL: [-Math.PI / 2, -Math.PI / 2] }); blindfold(c, 430, 965, 480);
  smell(c, 740, 675, 470, 565);
};

// ================================================================ card pictures
// flow.e1: the smell steps, the grown-up beside her counting
const flowE1 = (c: Ctx) => {
  room(c);
  chalk(c, 190, 830, 130, 1010);
  const A = [250, 990, 600] as const;
  person(c, A[0], A[1], A[2], { adult: true, armR: reach(A[0], A[1], A[2], 1, 400, 600, 1) });
  write(c, "3", 395, 470, 80, INK, 8);
  person(c, 560, 975, 470); blindfold(c, 560, 975, 470);
  table(c, 870, 690, 280, 70, 180);
  plate(c, 870, 728, 110, 34); orangePeeled(c, 865, 692, 38);
  smell(c, 840, 678, 600, 565);
};
// flow.a1: the senses tray; the child crushes a curry leaf at his nose
const flowA1 = (c: Ctx) => {
  room(c);
  const K = [300, 975, 480] as const, g = geo(K[0], K[1], K[2]), H: [number, number] = [200, g.nose[1] + 12];
  person(c, K[0], K[1], K[2], { armL: reach(K[0], K[1], K[2], -1, H[0], H[1], -1) }); eyesShut(c, K[0], K[1], K[2]);
  sprig(c, H[0], H[1], -0.25, 50); grip(c, H[0], H[1], K[2]);
  table(c, 770, 610, 440, 170, 140);
  shape(c, () => rrect(c, 585, 640, 370, 120, 30), COL.steel); shape(c, () => rrect(c, 600, 652, 340, 96, 22), COL.steelIn, 4);
  tumbler(c, 648, 725, 60, 90); spoon(c, 660, 690, 690, 600, 0.9);
  sprig(c, 735, 735, -1.3, 60);
  shape(c, () => rrect(c, 790, 680, 46, 40, 6), COL.brown); shade(c, () => rrect(c, 790, 680, 46, 40, 6), COL.soilDk, 14, 0);
  for (const [dx, dy] of [[-12, 0], [12, -4], [0, 10], [2, -12]]) shape(c, () => ell(c, 875 + dx, 700 + dy, 18, 18), WHITE, 4);
  shape(c, () => rrect(c, 905, 668, 60, 78, 4), COL.red); shape(c, () => rrect(c, 915, 678, 40, 44, 3), COL.blue, 3);
};
// flow.a2: lights out; the grown-up taps a tumbler, the girl smells a cut lemon
const flowA2 = (c: Ctx) => {
  room(c, 640);
  shape(c, () => rrect(c, 70, 830, 940, 130, 30), "#d9c9ea");
  const A = [280, 870, 600] as const, T: [number, number] = [175, 790], S: [number, number] = [262, 742];
  person(c, A[0], A[1], A[2], { adult: true, sit: true, armL: reach(A[0], A[1], A[2], -1, T[0], T[1], 1, true), armR: reach(A[0], A[1], A[2], 1, S[0], S[1], -1, true) });
  tumbler(c, 175, 845, 80, 110); grip(c, T[0], T[1], 600, true);
  spoon(c, S[0], S[1], 198, 728); grip(c, S[0], S[1], 600, true);
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(150, 705, 24 + k * 16, Math.PI * 1.1, Math.PI * 1.6); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  const K = [700, 870, 460] as const, L: [number, number] = [668, 672];
  person(c, K[0], K[1], K[2], { sit: true, armL: reach(K[0], K[1], K[2], -1, L[0], L[1], -1, true) });
  shape(c, () => ell(c, L[0], L[1], 28, 28), COL.yellow); shape(c, () => ell(c, L[0], L[1], 20, 20), "#fff6b0", 3);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; line(c, [[L[0], L[1]], [L[0] + Math.cos(a) * 19, L[1] + Math.sin(a) * 19]], 3, COL.yellow); }
  grip(c, L[0] - 14, L[1] + 16, K[2]);
  // the torch, switched off, lying on the mattress
  shape(c, () => rrect(c, 470, 835, 150, 40, 10), COL.grey); shape(c, () => rrect(c, 600, 828, 40, 54, 8), COL.greyDk);
  c.fillStyle = "rgba(20,18,60,0.5)"; c.fillRect(0, 0, D, D);
  shape(c, () => rrect(c, 720, 120, 280, 280, 10), "#1d2250");
  shape(c, () => ell(c, 860, 260, 60, 60), "#f3e9b4", 0); shape(c, () => ell(c, 885, 245, 52, 52), "#1d2250", 0);
};
// flow.a3: eyes covered, feeling a coconut scrubber; the other things wait on the mat
const flowA3 = (c: Ctx) => {
  room(c, 640);
  shape(c, () => rrect(c, 420, 770, 630, 200, 24), "#b8a6dc");
  // scrubber, towel, comb, cotton, spoon, banana
  shape(c, () => ell(c, 455, 835, 48, 30), COL.brown); for (let k = 0; k < 7; k++) line(c, [[418 + k * 12, 820 + (k % 2) * 6], [426 + k * 12, 852 - (k % 2) * 6]], 3, COL.soilDk);
  shape(c, () => rrect(c, 540, 815, 96, 60, 10), COL.sky); line(c, [[540, 845], [636, 845]], 4, COL.blueDk);
  shape(c, () => rrect(c, 670, 822, 90, 44, 6), COL.black); for (let k = 0; k < 8; k++) line(c, [[680 + k * 10, 840], [680 + k * 10, 864]], 3, COL.steelIn);
  for (const [dx, dy] of [[-14, 2], [14, -2], [0, 12], [2, -12]]) shape(c, () => ell(c, 810 + dx, 842 + dy, 20, 20), WHITE, 4);
  spoon(c, 870, 880, 912, 826, 0.9);
  line(c, [[960, 870], [1000, 820], [1050, 860]], 34, INK); line(c, [[960, 870], [1000, 820], [1050, 860]], 24, COL.yellow);
  const K = [270, 920, 500] as const, T: [number, number] = [455, 832];
  person(c, K[0], K[1], K[2], { sit: true, armR: reach(K[0], K[1], K[2], 1, T[0], T[1], -1, true) }); blindfold(c, K[0], K[1], K[2], true);
  grip(c, T[0], T[1], K[2]);
  arrow(c, [[430, 790], [480, 790]], RED, 7);
};
// flow.a4: a bottle shaken at each ear, four more on the floor
const flowA4 = (c: Ctx) => {
  room(c, 640);
  for (const x of [200, 320, 760, 880]) bottle(c, x, 1000, 50, 92);
  const K = [540, 980, 480] as const, L: [number, number] = [445, 578], R: [number, number] = [635, 578];
  person(c, K[0], K[1], K[2], { armL: reach(K[0], K[1], K[2], -1, L[0], L[1], -1), armR: reach(K[0], K[1], K[2], 1, R[0], R[1], 1) });
  bottle(c, L[0], L[1] + 42, 46, 84); grip(c, L[0], L[1], K[2]);
  bottle(c, R[0], R[1] + 42, 46, 84); grip(c, R[0], R[1], K[2]);
  shake(c, 405, 560, -1); shake(c, 675, 560, 1);
};
// flow.p1: the little book open at the ears page, a temple bell drawn on it
const flowP1 = (c: Ctx) => {
  ground(c, FLOOR);
  shadow(c, 560, 830, 430, 30);
  // the book lies flat and open: two pages, a few page edges showing, red thread stitched down the middle
  for (const s of [-1, 1]) {
    for (let k = 2; k >= 0; k--) shape(c, () => rrect(c, s < 0 ? 140 - k * 6 : 544, 262 + k * 6, 396, 560, 10), COL.paper, 5);
  }
  line(c, [[540, 262], [540, 822]], 6);
  for (let k = 0; k < 4; k++) line(c, [[540, 330 + k * 120], [540, 390 + k * 120]], 9, COL.red);
  shape(c, () => ell(c, 540, 300, 12, 12), COL.red, 4);
  // ear at the top of the left page
  const ex = 340, ey = 380;
  shape(c, () => { c.moveTo(ex - 22, ey - 42); c.bezierCurveTo(ex + 50, ey - 55, ex + 50, ey + 45, ex - 8, ey + 48); c.bezierCurveTo(ex - 36, ey + 48, ex - 36, ey + 18, ex - 18, ey + 8); c.quadraticCurveTo(ex - 40, ey - 20, ex - 22, ey - 42); c.closePath(); }, SKIN.child);
  line(c, [[ex - 10, ey - 25], [ex + 18, ey - 15], [ex + 14, ey + 20]], 4);
  // the temple bell, hanging from a chain
  const bx = 340, by = 600;
  line(c, [[bx, 440], [bx, by - 70]], 8, COL.greyDk); for (let k = 0; k < 5; k++) shape(c, () => ell(c, bx, 455 + k * 22, 8, 12), COL.grey, 3);
  shape(c, () => ell(c, bx, by - 72, 16, 16), "#e0b53a");
  shape(c, () => { c.moveTo(bx - 75, by + 60); c.bezierCurveTo(bx - 80, by - 60, bx + 80, by - 60, bx + 75, by + 60); c.closePath(); }, "#e0b53a");
  shade(c, () => { c.moveTo(bx - 75, by + 60); c.bezierCurveTo(bx - 80, by - 60, bx + 80, by - 60, bx + 75, by + 60); c.closePath(); }, "#b88a20", 28, 0);
  shape(c, () => rrect(c, bx - 86, by + 52, 172, 28, 6), "#b88a20");
  shape(c, () => ell(c, bx, by + 100, 18, 18), "#b88a20");
  // the nose on the next page
  const nx = 740, ny = 380;
  shape(c, () => { c.moveTo(nx - 6, ny - 45); c.quadraticCurveTo(nx + 30, ny + 10, nx + 26, ny + 32); c.quadraticCurveTo(nx + 10, ny + 48, nx - 12, ny + 36); c.quadraticCurveTo(nx - 34, ny + 36, nx - 22, ny + 14); c.quadraticCurveTo(nx - 8, ny - 10, nx - 6, ny - 45); c.closePath(); }, SKIN.child);
  // crayons
  for (const [i, col] of [COL.red, COL.green, COL.blue].entries()) { const x = 790 + i * 60, y = 950; line(c, [[x, y], [x + 60, y - 110]], 30, INK); line(c, [[x, y], [x + 60, y - 110]], 20, col); shape(c, () => polyP(c, [[x + 52, y - 118], [x + 68, y - 128], [x + 72, y - 108]]), col, 4); }
};
// term.2 Smell: banana chips, the smell drifting to a child's nose
const term2 = (c: Ctx) => {
  room(c);
  table(c, 330, 680, 360, 80, 180);
  plate(c, 330, 724, 150, 48);
  const r = rnd(5);
  for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, d = r(); const x = 330 + Math.cos(a) * 105 * d, y = 712 + Math.sin(a) * 28 * d; shape(c, () => ell(c, x, y, 24, 20), COL.yellow, 4); shape(c, () => ell(c, x, y, 15, 11), "#f7e27a", 0); }
  const K = [800, 980, 500] as const;
  person(c, K[0], K[1], K[2]); eyesShut(c, K[0], K[1], K[2]);
  smell(c, 360, 655, 770, geo(K[0], K[1], K[2]).nose[1], 3, 38);
};
// term.3 Skin: bare feet on a cool stone floor, a hand stroking a soft towel
const term3 = (c: Ctx) => {
  ground(c, BG);
  shadow(c, 720, 470, 240, 24);
  shape(c, () => rrect(c, 480, 230, 460, 220, 30), COL.sky); line(c, [[500, 290], [920, 290]], 6, COL.blueDk); line(c, [[500, 390], [920, 390]], 6, COL.blueDk); line(c, [[480, 340], [940, 340]], 4, INK);
  hand(c, 440, 340, 0, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[640, 190], [780, 190]], RED, 8);
  c.fillStyle = "#b8bcc4"; c.fillRect(0, 600, D, D - 600);
  c.strokeStyle = "#8f949c"; c.lineWidth = 4; for (let x = 60; x < D; x += 160) { c.beginPath(); c.moveTo(x, 600); c.lineTo(x, D); c.stroke(); } for (let y = 760; y < D; y += 160) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, 600], [D, 600]], 5);
  for (const [fx, flip] of [[430, -1], [650, 1]] as [number, number][]) {
    shadow(c, fx + 12, 900, 50, 100);
    shape(c, () => { c.moveTo(fx - 46, 780); c.bezierCurveTo(fx - 56, 860, fx - 50, 960, fx, 975); c.bezierCurveTo(fx + 50, 960, fx + 56, 860, fx + 46, 780); c.quadraticCurveTo(fx, 740, fx - 46, 780); c.closePath(); }, SKIN.child);
    for (let k = 0; k < 5; k++) { const t = flip < 0 ? k : 4 - k, x = fx - 40 + k * 20, rr = 14 - t * 1.6; shape(c, () => ell(c, x, 752 + t * 6, rr, rr), SKIN.child, 4); }
  }
};
// expl.2: tiny bits of the orange float through the air into the nose
const expl2 = (c: Ctx) => {
  room(c);
  table(c, 300, 720, 340, 80, 170);
  plate(c, 300, 764, 140, 44); orangePeeled(c, 290, 726, 42);
  const K = [840, 980, 480] as const, N = geo(K[0], K[1], K[2]).nose;
  person(c, K[0], K[1], K[2]); eyesShut(c, K[0], K[1], K[2]);
  const r = rnd(9), dot = (x: number, y: number) => shape(c, () => ell(c, x, y, 6, 6), COL.orange, 2.5);
  for (let i = 0; i < 28; i++) { const t = i / 27, x = 300 + (N[0] - 30 - 300) * t, y = 690 + (N[1] - 690) * t - Math.sin(t * Math.PI) * 170; dot(x + (r() - 0.5) * 50, y + (r() - 0.5) * 40); }
  // the big circle: inside the nose
  line(c, [[640, 470], [N[0] - 20, N[1] - 10]], 5); line(c, [[760, 420], [N[0] - 10, N[1] - 12]], 5);
  shape(c, () => ell(c, 560, 290, 200, 200), WHITE, 8);
  c.save(); c.beginPath(); ell(c, 560, 290, 196, 196); c.clip();
  // a face in profile, looking left: forehead, nose, lips, chin
  const prof = () => { c.moveTo(800, 60); c.lineTo(670, 60); c.quadraticCurveTo(640, 150, 648, 220); c.quadraticCurveTo(650, 250, 600, 300); c.quadraticCurveTo(590, 322, 626, 330); c.quadraticCurveTo(640, 340, 628, 355); c.quadraticCurveTo(622, 372, 636, 380); c.quadraticCurveTo(618, 398, 640, 420); c.quadraticCurveTo(650, 450, 668, 470); c.lineTo(668, 520); c.lineTo(800, 520); c.closePath(); };
  shape(c, prof, SKIN.child);
  shape(c, () => { c.moveTo(640, 150); c.quadraticCurveTo(650, 60, 760, 60); c.lineTo(800, 60); c.lineTo(800, 180); c.quadraticCurveTo(730, 160, 690, 190); c.quadraticCurveTo(660, 200, 640, 150); c.closePath(); }, CLOTH.hair, 5);
  c.beginPath(); c.arc(690, 240, 12, 0.35, Math.PI - 0.35); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, () => ell(c, 622, 322, 14, 8), SKIN.childDk, 4);
  for (let i = 0; i < 7; i++) dot(390 + i * 30, 320 - Math.sin(i * 0.9) * 14);
  arrow(c, [[540, 300], [608, 320]], RED, 7);
  c.restore();
};
// expl.3: a dog, an ant, a fly and a touch-me-not, each sensing in their own way
const expl3 = (c: Ctx) => {
  ground(c, BG);
  const Q = (ox: number, oy: number, f: () => void) => { c.save(); c.translate(ox, oy); f(); c.restore(); };
  Q(0, 0, () => {
    shape(c, () => polyP(c, [[0, 400], [540, 400], [540, 470], [0, 470]]), COL.soil, 5);
    for (let k = 0; k < 3; k++) shape(c, () => ell(c, 120 + k * 150, 436, 16, 11), COL.soilDk, 0);
    const B = "#c48a4a";
    line(c, [[415, 268], [450, 230], [470, 190]], 20, INK); line(c, [[415, 268], [450, 230], [470, 190]], 11, B);
    for (const x of [215, 255, 350, 390]) shape(c, () => rrect(c, x - 13, 320, 26, 84, 6), B);
    shape(c, () => ell(c, 300, 300, 120, 65), B); shade(c, () => ell(c, 300, 300, 120, 65), "#9a6630", 30, 12);
    shape(c, () => ell(c, 150, 330, 48, 48), B); shape(c, () => ell(c, 105, 362, 40, 25), B);
    shape(c, () => ell(c, 170, 308, 18, 38, 0.3), "#9a6630"); shape(c, () => ell(c, 70, 366, 10, 9), INK, 0); shape(c, () => ell(c, 140, 320, 5, 6), INK, 0);
    smell(c, 90, 398, 78, 372, 2, 16);
  });
  Q(540, 0, () => {
    line(c, [[40, 362], [500, 362]], 5);
    shape(c, () => rrect(c, 90, 302, 60, 60, 6), WHITE); shade(c, () => rrect(c, 90, 302, 60, 60, 6), "#d8d3c8", 18, 0);
    const A = COL.black;
    for (const [x, tx] of [[278, 236], [296, 288], [316, 340]]) { line(c, [[x, 296], [tx - 14, 338], [tx, 362]], 5, COL.greyDk); }
    for (const [x, tx] of [[285, 250], [300, 300], [318, 352]]) { line(c, [[x, 300], [tx - 10, 345], [tx, 364]], 6); }
    shape(c, () => ell(c, 390, 300, 60, 40), A); shape(c, () => ell(c, 300, 290, 38, 28), A); shape(c, () => ell(c, 235, 285, 30, 30), A);
    shape(c, () => ell(c, 222, 280, 6, 6), WHITE, 0);
    line(c, [[215, 265], [180, 240], [152, 310]], 6); line(c, [[218, 290], [175, 300], [150, 336]], 6);
  });
  Q(0, 540, () => {
    plate(c, 270, 420, 150, 40);
    shape(c, () => ell(c, 270, 345, 85, 85), COL.orange); shade(c, () => ell(c, 270, 345, 85, 85), "#c7731f", 30, 14);
    const r = rnd(4); for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 70; shape(c, () => ell(c, 270 + Math.cos(a) * d, 345 + Math.sin(a) * d, 5, 5), "#c7731f", 0); }
    for (const [x, tx] of [[255, 230], [265, 255], [280, 290], [290, 312]]) line(c, [[x, 240], [tx, 262 + Math.abs(tx - 270) * 0.12]], 4);
    shape(c, () => ell(c, 300, 190, 56, 18, -0.4), "rgba(214,236,250,0.8)", 4); shape(c, () => ell(c, 316, 212, 52, 16, -0.15), "rgba(214,236,250,0.8)", 4);
    const F = "#5b5f6b";
    shape(c, () => ell(c, 312, 236, 38, 22), F); for (let k = 0; k < 3; k++) line(c, [[300 + k * 14, 218], [300 + k * 14, 254]], 4, INK);
    shape(c, () => ell(c, 268, 226, 30, 24), F); shape(c, () => ell(c, 236, 230, 18, 18), F); shape(c, () => ell(c, 228, 228, 9, 9), RED, 3);
  });
  Q(540, 540, () => {
    line(c, [[270, 480], [270, 150]], 9, COL.leafDk);
    for (const y of [420, 360, 300]) { leaf(c, 270, y, 58, Math.PI + 0.55); leaf(c, 270, y, 58, -0.55); }
    for (const y of [250, 205]) { leaf(c, 270, y, 50, -Math.PI / 2 - 0.22); leaf(c, 270, y, 50, -Math.PI / 2 + 0.22); }
    hand(c, 361, 146, 2.48, 0.9, SKIN.child, CLOTH.child, true);
  });
  line(c, [[540, 0], [540, D]], 6); line(c, [[0, 540], [D, 540]], 6);
};

export const ic_sensesFiveSensesL1 = cards("sci.senses.five-senses.L1", [setup0, setup1, setup2, flowE1, flowA1, flowA2, flowA3, flowA4, flowP1, term2, term3, expl2, expl3]);
