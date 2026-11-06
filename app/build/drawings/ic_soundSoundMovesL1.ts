import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, cards, write } from "./flatKit";
import type { Pose } from "./flatKit";

// SOUND TRAVELS (L1) · set-up cards and card pictures. One grown-up (blue kurta) and one child (orange),
// drawn with person(); every hand is placed by two-link inverse kinematics so it lands on what it holds.

const WALL = "#f4ecdc", FLOOR = COL.wood, FLOOR_Y = 760, FEET = 960, NIGHT = "#1c2747", NIGHT_LT = "#2d3b66";
const room = (c: Ctx, wall = WALL) => { ground(c, wall); c.fillStyle = FLOOR; c.fillRect(0, FLOOR_Y, D, D - FLOOR_Y); line(c, [[0, FLOOR_Y], [D, FLOOR_Y]], 6); };

// ---------------------------------------------------------------- people, with hands that land where they should
type Joints = { sx: [number, number]; sy: number; hy: number; head: number; mouth: [number, number]; ear: [[number, number], [number, number]] };
const joints = (x: number, y: number, h: number, sit = false): Joints => {
  const head = h * 0.13, hip = sit ? y - h * 0.06 : y - h * 0.42, sh = sit ? hip - h * 0.32 : y - h * 0.74, hy = sh - head * 1.05;
  return { sx: [x - h * 0.11, x + h * 0.11], sy: sh + h * 0.03, hy, head, mouth: [x, hy + head * 0.38], ear: [[x - head * 1.02, hy + head * 0.05], [x + head * 1.02, hy + head * 0.05]] };
};
// shoulder (sx, sy) to a hand at (tx, ty): the upper arm and forearm angles; bend = +1 puts the elbow clockwise of the reach
const ik = (sx: number, sy: number, tx: number, ty: number, h: number, bend: number): [number, number] => {
  const l1 = h * 0.17, l2 = h * 0.16; let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
  const max = l1 + l2 - 2; if (d > max) { dx *= max / d; dy *= max / d; d = max; }
  const a = Math.atan2(dy, dx), cosA = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))), a1 = a + bend * Math.acos(cosA);
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};
type Reach = { L?: [number, number, number?]; R?: [number, number, number?]; adult?: boolean; sit?: boolean; eyesShut?: boolean; lean?: number };
// a person whose left/right hand is placed on a target [x, y, bend]; returns the joints
const figure = (c: Ctx, x: number, y: number, h: number, r: Reach = {}): Joints => {
  const j = joints(x, y, h, r.sit), p: Pose = { adult: r.adult, sit: r.sit };
  if (r.L) p.armL = ik(j.sx[0], j.sy, r.L[0], r.L[1], h, r.L[2] ?? -1);
  if (r.R) p.armR = ik(j.sx[1], j.sy, r.R[0], r.R[1], h, r.R[2] ?? 1);
  c.save(); if (r.lean) { c.translate(x, y); c.rotate(r.lean); c.translate(-x, -y); }
  shadow(c, x + 10, y + 8, h * 0.22, h * 0.035);
  person(c, x, y, h, p);
  if (r.eyesShut) { const skin = r.adult ? SKIN.adult : SKIN.child; for (const s of [-1, 1]) { const ex = x + s * j.head * 0.35, ey = j.hy + j.head * 0.12; shape(c, () => ell(c, ex, ey, j.head * 0.16, j.head * 0.18), skin, 0); c.beginPath(); c.arc(ex, ey - j.head * 0.04, j.head * 0.12, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); } }
  c.restore();
  return j;
};
// the hand drawn again over the thing it holds
const handOver = (c: Ctx, x: number, y: number, h: number, adult = false) => shape(c, () => ell(c, x, y, h * 0.037, h * 0.037), adult ? SKIN.adult : SKIN.child, 5);
// a hand held up showing n fingers, wrist at (x, y)
const fingersUp = (c: Ctx, x: number, y: number, s: number, n: number, skin: string) => {
  shape(c, () => rrect(c, x - 34 * s, y - 44 * s, 68 * s, 70 * s, 18 * s), skin, 5);
  for (let k = 0; k < n; k++) { const fx = x - 30 * s + k * 20 * s + (4 - n) * 10 * s; shape(c, () => rrect(c, fx, y - 100 * s, 16 * s, 66 * s, 8 * s), skin, 5); }
  shape(c, () => rrect(c, x + 30 * s, y - 40 * s, 16 * s, 46 * s, 8 * s), skin, 5);
};

// ---------------------------------------------------------------- things
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5);
  shine(c, [[x - w * 0.32, y - h * 0.85], [x - w * 0.28, y - h * 0.25]], 7);
};
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  line(c, [[x, y], [tx, ty]], 18, INK); line(c, [[x, y], [tx, ty]], 9, COL.steel);
  shape(c, () => ell(c, tx + Math.cos(an) * len * 0.12, ty + Math.sin(an) * len * 0.12, len * 0.16, len * 0.1, an), COL.steel, 5);
};
// a plastic carry bag hanging from (x, y)
const bag = (c: Ctx, x: number, y: number, w: number, h: number) => {
  line(c, [[x - w * 0.2, y], [x - w * 0.42, y + h * 0.28]], 6); line(c, [[x + w * 0.2, y], [x + w * 0.42, y + h * 0.28]], 6);
  shape(c, () => { c.moveTo(x - w * 0.42, y + h * 0.28); c.lineTo(x + w * 0.42, y + h * 0.28); c.lineTo(x + w * 0.5, y + h); c.quadraticCurveTo(x, y + h * 1.08, x - w * 0.5, y + h); c.closePath(); }, COL.sky);
  line(c, [[x - w * 0.15, y + h * 0.4], [x - w * 0.05, y + h * 0.75]], 3, COL.glassEdge); line(c, [[x + w * 0.18, y + h * 0.45], [x + w * 0.1, y + h * 0.85]], 3, COL.glassEdge);
};
// a rolled newspaper cone: narrow end at (x, y), pointing along an
const cone = (c: Ctx, x: number, y: number, an: number, len: number, rN: number, rW: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => polyP(c, [[0, -rN], [len, -rW], [len, rW], [0, rN]]), COL.paper);
  shade(c, () => polyP(c, [[0, -rN], [len, -rW], [len, rW], [0, rN]]), COL.grey, 0, rW * 0.55, 0.35);
  c.save(); c.beginPath(); polyP(c, [[0, -rN], [len, -rW], [len, rW], [0, rN]]); c.clip();
  for (let i = 0; i < 9; i++) { const t = 0.15 + i * 0.1, r = rN + (rW - rN) * t; line(c, [[len * t, -r * 0.7], [len * t, r * 0.7]], 3, COL.grey); }
  c.restore();
  shape(c, () => ell(c, len, 0, rW * 0.22, rW), COL.greyDk, 5);
  c.restore();
};
// sound: arcs facing direction dir, fading as they go
const soundArcs = (c: Ctx, x: number, y: number, dir: number, n: number, r0: number, step: number, w = 9, spread = 0.5, fade = true) => {
  for (let i = 0; i < n; i++) { c.globalAlpha = fade ? Math.max(0.12, 1 - (i / n) * 0.95) : 1; c.beginPath(); c.arc(x, y, r0 + i * step, dir - spread, dir + spread); c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
  c.globalAlpha = 1;
};
const rings = (c: Ctx, x: number, y: number, n: number, r0: number, step: number, w = 9, fade = true) => {
  for (let i = 0; i < n; i++) { c.globalAlpha = fade ? Math.max(0.12, 1 - (i / n) * 0.9) : 1; c.beginPath(); c.arc(x, y, r0 + i * step, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = w; c.stroke(); }
  c.globalAlpha = 1;
};
const chappal = (c: Ctx, x: number, y: number, s: number, col = COL.brown) => {
  shadow(c, x + 6 * s, y + 8 * s, 70 * s, 26 * s);
  shape(c, () => { c.moveTo(x - 70 * s, y); c.quadraticCurveTo(x - 70 * s, y - 30 * s, x - 20 * s, y - 28 * s); c.quadraticCurveTo(x + 40 * s, y - 34 * s, x + 72 * s, y - 6 * s); c.quadraticCurveTo(x + 72 * s, y + 26 * s, x + 20 * s, y + 26 * s); c.quadraticCurveTo(x - 60 * s, y + 30 * s, x - 70 * s, y); c.closePath(); }, col);
  line(c, [[x - 10 * s, y - 24 * s], [x + 40 * s, y - 2 * s], [x - 10 * s, y + 22 * s]], 6 * s, INK); line(c, [[x - 10 * s, y - 24 * s], [x + 40 * s, y - 2 * s], [x - 10 * s, y + 22 * s]], 3 * s, COL.red);
};
const stool = (c: Ctx, x: number, y: number, w: number) => { shadow(c, x + 8, y + 6, w * 0.6, 12); shape(c, () => rrect(c, x - w / 2, y - 26, w, 26, 6), COL.wood); shade(c, () => rrect(c, x - w / 2, y - 26, w, 26, 6), COL.woodDk, 0, 12, 0.5); };
const doorway = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x - w / 2 - 22, y - h - 22, w + 44, h + 22, 8), COL.wood); c.fillStyle = "#d8ccb4"; c.fillRect(x - w / 2, y - h, w, h); line(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y]], 6); line(c, [[x - w / 2, y - h], [x - w / 2, y]], 6); };
// a stove with a pressure cooker on it; the cooker's bottom centre at (x, y)
const cooker = (c: Ctx, x: number, y: number, s: number, whistling = true) => {
  shape(c, () => rrect(c, x - 150 * s, y, 300 * s, 36 * s, 8 * s), COL.black); shape(c, () => rrect(c, x - 60 * s, y - 10 * s, 120 * s, 12 * s, 4 * s), COL.greyDk, 4);
  const body = () => rrect(c, x - 95 * s, y - 180 * s, 190 * s, 172 * s, 18 * s);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 55 * s, 0);
  shape(c, () => { c.moveTo(x - 102 * s, y - 180 * s); c.lineTo(x + 102 * s, y - 180 * s); c.lineTo(x + 102 * s, y - 196 * s); c.lineTo(x - 102 * s, y - 196 * s); c.closePath(); }, COL.steelIn, 5);
  shape(c, () => rrect(c, x + 100 * s, y - 196 * s, 70 * s, 26 * s, 10 * s), COL.black, 5);
  shape(c, () => rrect(c, x - 10 * s, y - 232 * s, 20 * s, 38 * s, 4 * s), COL.steelDk, 5); shape(c, () => rrect(c, x - 20 * s, y - 250 * s, 40 * s, 24 * s, 8 * s), COL.black, 5);
  shine(c, [[x - 70 * s, y - 160 * s], [x - 70 * s, y - 60 * s]], 8 * s);
  if (whistling) { for (let i = 0; i < 3; i++) line(c, [[x - 18 * s + i * 18 * s, y - 262 * s], [x - 24 * s + i * 18 * s, y - 290 * s - i * 6 * s]], 4 * s, COL.greyDk); soundArcs(c, x, y - 250 * s, -Math.PI / 2, 3, 60 * s, 34 * s, 7, 0.75); }
};
// a closed window at night with a city and lightning far away; frame from (x, y), w by h
const windowNight = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - 24, y - 24, w + 48, h + 48, 10), COL.wood);
  c.fillStyle = NIGHT; c.fillRect(x, y, w, h);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.fillStyle = NIGHT_LT; c.beginPath(); ell(c, x + w * 0.5, y + h * 0.1, w * 0.7, h * 0.3); c.fill();
  const bolt = [[x + w * 0.62, y + h * 0.05], [x + w * 0.55, y + h * 0.3], [x + w * 0.63, y + h * 0.32], [x + w * 0.52, y + h * 0.56]];
  line(c, bolt, 16, COL.yellow); line(c, bolt, 6, WHITE);
  const bld = [[0.02, 0.62, 0.12], [0.16, 0.55, 0.1], [0.28, 0.68, 0.14], [0.44, 0.6, 0.1], [0.56, 0.7, 0.16], [0.74, 0.58, 0.12], [0.88, 0.66, 0.1]];
  for (const [bx, by, bw] of bld) { c.fillStyle = "#101729"; c.fillRect(x + w * bx, y + h * by, w * bw, h * (1 - by)); for (let k = 0; k < 3; k++) { c.fillStyle = COL.yellow; c.fillRect(x + w * bx + w * bw * 0.25, y + h * by + 20 + k * 30, 10, 12); } }
  c.strokeStyle = "rgba(191,224,245,0.5)"; c.lineWidth = 3; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(x + 20 + i * (w / 14), y + 10); c.lineTo(x + 8 + i * (w / 14), y + 60); c.stroke(); }
  c.restore();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 8); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 8); line(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], 6);
};
// a child's map of the flat on a paper sheet; cols fills the rooms when given
const flatMap = (c: Ctx, cols?: Record<string, string>) => {
  shadow(c, 560, 1000, 420, 30);
  shape(c, () => rrect(c, 110, 90, 860, 900, 14), COL.paper);
  const R: Record<string, number[]> = { kitchen: [160, 150, 300, 260], hall: [460, 150, 360, 420], bed1: [820, 150, 110, 260], bed2: [700, 410, 230, 320], bath: [160, 410, 240, 160], balcony: [160, 740, 770, 200] };
  R.bed1 = [700, 150, 230, 260]; R.hall = [460, 150, 240, 420]; R.bath = [160, 410, 300, 320];
  for (const [k, [x, y, w, h]] of Object.entries(R)) { c.fillStyle = cols?.[k] ?? COL.paper; c.fillRect(x, y, w, h); line(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], 7); }
  cooker(c, 310, 340, 0.5, false);
  // hall: a sofa
  shape(c, () => rrect(c, 500, 300, 160, 70, 14), COL.purple); shape(c, () => rrect(c, 490, 320, 30, 70, 8), COL.purple, 5); shape(c, () => rrect(c, 640, 320, 30, 70, 8), COL.purple, 5);
  // bedrooms: beds
  for (const [bx, by] of [[740, 230], [740, 520]]) { shape(c, () => rrect(c, bx, by, 150, 90, 10), COL.teal); shape(c, () => rrect(c, bx + 8, by + 8, 44, 34, 8), WHITE, 4); }
  // bathroom: a bucket and mug
  shape(c, () => { c.moveTo(250, 520); c.lineTo(350, 520); c.lineTo(335, 640); c.lineTo(265, 640); c.closePath(); }, COL.blue); shape(c, () => ell(c, 300, 520, 50, 12), COL.sky, 5);
  // balcony: a plant pot and railing
  for (let i = 0; i < 12; i++) line(c, [[200 + i * 60, 760], [200 + i * 60, 920]], 4, COL.greyDk); line(c, [[180, 760], [910, 760]], 6);
  shape(c, () => { c.moveTo(560, 850); c.lineTo(620, 850); c.lineTo(610, 920); c.lineTo(570, 920); c.closePath(); }, COL.soil); shape(c, () => ell(c, 590, 820, 40, 34), COL.leaf);
};
// a big paper ear taped to the wall, centre (x, y)
const paperEar = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 110 * s, y - 150 * s, 220 * s, 300 * s, 8 * s), WHITE);
  shape(c, () => { c.moveTo(x - 40 * s, y - 110 * s); c.bezierCurveTo(x + 90 * s, y - 130 * s, x + 90 * s, y + 10 * s, x + 20 * s, y + 60 * s); c.bezierCurveTo(x - 10 * s, y + 90 * s, x - 10 * s, y + 130 * s, x - 50 * s, y + 120 * s); c.bezierCurveTo(x - 80 * s, y + 110 * s, x - 70 * s, y + 60 * s, x - 60 * s, y + 20 * s); c.bezierCurveTo(x - 90 * s, y - 60 * s, x - 90 * s, y - 100 * s, x - 40 * s, y - 110 * s); c.closePath(); }, SKIN.child, 6);
  c.beginPath(); c.moveTo(x - 20 * s, y - 70 * s); c.bezierCurveTo(x + 40 * s, y - 70 * s, x + 40 * s, y + 10 * s, x - 10 * s, y + 30 * s); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  for (const [tx, ty] of [[x - 110 * s, y - 150 * s], [x + 110 * s, y - 150 * s]]) { c.save(); c.translate(tx, ty); c.rotate(tx < x ? -0.7 : 0.7); shape(c, () => rrect(c, -34 * s, -12 * s, 68 * s, 24 * s, 4), "rgba(255,230,150,0.85)", 3); c.restore(); }
};

// ================================================================ set-up cards
// e1.0 the grown-up at one end of the hall holding the tumbler, spoon and bag; the child right beside her
const e1s0 = (c: Ctx) => {
  room(c); doorway(c, 930, FLOOR_Y, 180, 520);
  const ax = 400, ah = 560, aj = joints(ax, FEET, ah);
  const lh: [number, number] = [ax - ah * 0.3, FEET - ah * 0.5], rh: [number, number] = [ax + ah * 0.27, FEET - ah * 0.72];
  figure(c, ax, FEET, ah, { adult: true, L: [lh[0], lh[1], -1], R: [rh[0], rh[1], 1] });
  tumbler(c, lh[0] - 38, lh[1] + 40, 78, 110); handOver(c, lh[0], lh[1], ah, true);
  spoon(c, rh[0], rh[1] + 10, -Math.PI / 2, 120); bag(c, rh[0], rh[1], 110, 170); handOver(c, rh[0], rh[1], ah, true);
  figure(c, 730, FEET, 430, {});
  void aj;
};
// e1.1 the child a few steps away with eyes shut; the grown-up rubs two fingers by her own ear
const e1s1 = (c: Ctx) => {
  room(c);
  const ax = 300, ah = 560, aj = joints(ax, FEET, ah), ear = aj.ear[1];
  const rh: [number, number] = [ear[0] + 60, ear[1] + 10];
  figure(c, ax, FEET, ah, { adult: true, R: [rh[0], rh[1], 1] });
  line(c, [[rh[0] + 8, rh[1] - 20], [rh[0] + 30, rh[1] - 50]], 10, SKIN.adult); line(c, [[rh[0] + 18, rh[1] - 10], [rh[0] + 44, rh[1] - 36]], 10, SKIN.adult);
  soundArcs(c, rh[0] + 30, rh[1] - 30, 0, 4, 50, 36, 7, 0.55);
  figure(c, 800, FEET, 430, { eyesShut: true });
};
// e1.2 the child takes one heel-to-toe step back along the hall
const e1s2 = (c: Ctx) => {
  room(c);
  figure(c, 130, FEET, 560, { adult: true, R: [130 + 560 * 0.13 + 60, FEET - 560 * 0.87, 1] });
  soundArcs(c, 240, FEET - 560 * 0.9, 0, 3, 40, 30, 6, 0.5);
  const cx = 560;
  // footprints on the floor behind her, heel touching toe
  figure(c, cx, FEET, 430, { eyesShut: true });
  arrow(c, [[cx + 120, FEET - 300], [cx + 330, FEET - 300]]);
};
// e1.3 three chappals mark where each sound faded: fingers nearest, the bag, the tumbler furthest
const e1s3 = (c: Ctx) => {
  room(c);
  figure(c, 130, FEET, 560, { adult: true });
  const marks: [number, (x: number, y: number) => void][] = [
    [400, (x, y) => { shape(c, () => rrect(c, x - 44, y - 90, 88, 70, 12), SKIN.adult, 5); for (let k = 0; k < 3; k++) shape(c, () => rrect(c, x - 36 + k * 26, y - 140, 20, 60, 10), SKIN.adult, 5); shape(c, () => rrect(c, x + 36, y - 84, 20, 44, 10), SKIN.adult, 5); }],
    [640, (x, y) => bag(c, x, y - 160, 90, 130)],
    [900, (x, y) => tumbler(c, x, y - 10, 70, 100)],
  ];
  for (const [x, draw] of marks) { chappal(c, x, FEET + 30, 1, [COL.red, COL.teal, COL.purple][marks.findIndex((m) => m[0] === x)]); draw(x, FEET - 60); }
  arrow(c, [[300, 300], [960, 300]]);
};
// e2.0 the grown-up and the boy roll newspaper into a cone at a table and tape it
const e2s0 = (c: Ctx) => {
  room(c);
  const ty = 700, ax = 330, ah = 560, bx = 760, bh = 430;
  figure(c, ax, FEET, ah, { adult: true, L: [ax - 70, ty - 40, -1], R: [ax + 150, ty - 40, 1] });
  figure(c, bx, FEET, bh, { L: [bx - 90, ty - 30, -1], R: [bx + 60, ty - 30, 1] });
  // the table, in front of them
  shadow(c, 560, 1010, 480, 24);
  shape(c, () => rrect(c, 90, ty, 900, 50, 10), COL.wood); shade(c, () => rrect(c, 90, ty, 900, 50, 10), COL.woodDk, 0, 26, 0.5);
  for (const lx of [150, 940]) { line(c, [[lx, ty + 50], [lx, 1000]], 26, INK); line(c, [[lx, ty + 50], [lx, 1000]], 14, COL.woodDk); }
  // the cone lying on the table, wide end to the left; the grown-up's hands on it
  cone(c, ax + 180, ty - 40, Math.PI, 290, 16, 70);
  handOver(c, ax - 70, ty - 40, ah, true); handOver(c, ax + 150, ty - 40, ah, true);
  // the tape roll in the boy's left hand, a strip in his right
  shape(c, () => ell(c, bx - 90, ty - 30, 40, 40), COL.yellow); shape(c, () => ell(c, bx - 90, ty - 30, 20, 20), COL.paper, 5);
  shape(c, () => rrect(c, bx - 20, ty - 40, 80, 18, 4), "rgba(255,230,150,0.9)", 4);
  handOver(c, bx - 90, ty - 30, bh); handOver(c, bx + 60, ty - 30, bh);
};
// e2.1 the boy far away; the grown-up speaks quietly with no cone
const e2s1 = (c: Ctx) => {
  room(c);
  const aj = figure(c, 220, FEET, 560, { adult: true });
  soundArcs(c, aj.mouth[0], aj.mouth[1], 0, 3, 95, 42, 7, 1.0);
  soundArcs(c, aj.mouth[0], aj.mouth[1], Math.PI, 2, 115, 42, 7, 0.55);
  figure(c, 880, FEET, 430, {});
};
// e2.2 the grown-up speaks into the cone's narrow end, the wide end aimed at the boy
const coneTo = (c: Ctx, dir: number, boyX: number, lean = 0, earHand = false, ax = 300) => {
  room(c);
  const ah = 560, j = joints(ax, FEET, ah), m = j.mouth, len = 270;
  const at = (t: number): [number, number] => [m[0] + Math.cos(dir) * len * t + Math.sin(dir) * 30, m[1] + Math.sin(dir) * len * t - Math.cos(dir) * 30];
  const L = at(0.35), R = at(0.7);
  figure(c, ax, FEET, ah, { adult: true, L: [L[0], L[1], -1], R: [R[0], R[1], 1] });
  cone(c, m[0] + Math.cos(dir) * 14, m[1] + Math.sin(dir) * 14, dir, len, 16, 70);
  handOver(c, L[0], L[1], ah, true); handOver(c, R[0], R[1], ah, true);
  soundArcs(c, m[0] + Math.cos(dir) * (len + 20), m[1] + Math.sin(dir) * (len + 20), dir, 4, 50, 40, 8, 0.45, false);
  if (earHand) { const bj = joints(boyX, FEET, 430); figure(c, boyX, FEET, 430, { lean, L: [bj.ear[0][0] - 14, bj.ear[0][1] + 10, -1] }); } else figure(c, boyX, FEET, 430, {});
};
const e2s2 = (c: Ctx) => coneTo(c, 0, 880);
// e2.3 the cone aimed at the side wall; the boy leans forward to listen
const e2s3 = (c: Ctx) => { coneTo(c, Math.PI, 880, -0.14, true, 400); };
// a1.0 the grown-up on a low stool taps the tumbler; the girl in front with eyes shut
const a1s0 = (c: Ctx) => {
  room(c);
  const ax = 420, ah = 560, aj = joints(ax, FEET, ah, true);
  stool(c, ax - 10, FEET - ah * 0.02, ah * 0.3);
  const L: [number, number] = [ax - 140, FEET - 100], R: [number, number] = [ax + 60, FEET - 110];
  figure(c, ax, FEET, ah, { adult: true, sit: true, L: [L[0], L[1], -1], R: [R[0], R[1], 1] });
  tumbler(c, L[0] - 36, L[1] + 50, 80, 115); handOver(c, L[0], L[1], ah, true);
  const rim: [number, number] = [L[0] - 10, L[1] - 68], san = Math.atan2(rim[1] - R[1], rim[0] - R[0]), slen = Math.hypot(rim[0] - R[0], rim[1] - R[1]) / 1.12;
  spoon(c, R[0], R[1], san, slen); handOver(c, R[0], R[1], ah, true);
  soundArcs(c, L[0] - 36, L[1] - 70, -Math.PI / 2, 3, 60, 36, 7, 0.7);
  void aj;
  figure(c, 820, FEET + 40, 430, { eyesShut: true });
};
// a1.1 the room from above: the stool in the middle, footprints in front, behind, at both sides and round the door
const a1s1 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = COL.wood; c.fillRect(140, 120, 800, 760);
  line(c, [[140, 120], [940, 120], [940, 880], [140, 880], [140, 120]], 10);
  // the door: a gap at the bottom right, the door swung open outwards
  c.fillStyle = BG; c.fillRect(720, 870, 150, 24); line(c, [[720, 880], [720, 1010]], 10); line(c, [[720, 880], [870, 880]], 0);
  c.beginPath(); c.arc(720, 880, 150, 0, Math.PI / 2); c.strokeStyle = INK; c.lineWidth = 4; c.setLineDash([12, 10]); c.stroke(); c.setLineDash([]);
  // the stool with the tumbler on it, rings of sound going out on every side
  rings(c, 540, 500, 5, 120, 70, 8);
  shape(c, () => ell(c, 540, 500, 80, 80), COL.wood); shape(c, () => ell(c, 540, 500, 36, 36), COL.steel); shape(c, () => ell(c, 540, 500, 26, 26), COL.steelIn, 4);
  const feet = (x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); for (const s of [-1, 1]) shape(c, () => ell(c, s * 22, 0, 16, 34), COL.orange, 4); c.restore(); };
  feet(540, 790, 0); feet(540, 220, Math.PI); feet(240, 500, Math.PI / 2); feet(840, 500, -Math.PI / 2); feet(800, 970, 0);
};
// a2.0 the boy and his mother at a closed window at night, lightning over the city
const a2s0 = (c: Ctx) => {
  ground(c, "#5a4e6e"); c.fillStyle = "#3f3652"; c.fillRect(0, FLOOR_Y, D, D - FLOOR_Y); line(c, [[0, FLOOR_Y], [D, FLOOR_Y]], 6);
  windowNight(c, 250, 110, 620, 440);
  const bx = 400, bh = 430;
  figure(c, 700, FEET, 560, { adult: true });
  figure(c, bx, FEET, bh, { R: [bx + 150, FEET - bh * 1.0, 1] });
};
// a2.1 the boy counts on his fingers; his mother writes the number down
const a2s1 = (c: Ctx) => {
  room(c);
  const bx = 330, bh = 430, bj = joints(bx, FEET, bh);
  const R: [number, number] = [bx + 120, bj.hy + 20];
  figure(c, bx, FEET, bh, { R: [R[0], R[1], 1] });
  fingersUp(c, R[0], R[1], 1.1, 3, SKIN.child);
  const ax = 760, ah = 560, aj = joints(ax, FEET, ah);
  const L: [number, number] = [ax - 120, aj.sy + 160], P: [number, number] = [ax + 40, aj.sy + 150];
  figure(c, ax, FEET, ah, { adult: true, L: [L[0], L[1], -1], R: [P[0], P[1], 1] });
  shape(c, () => rrect(c, L[0] - 10, L[1] - 120, 190, 220, 6), COL.paper); handOver(c, L[0], L[1], ah, true);
  write(c, "3", L[0] + 50, L[1] - 70, 70, INK, 7);
  line(c, [[P[0] + 18, P[1] - 90], [P[0], P[1]]], 16, INK); line(c, [[P[0] + 18, P[1] - 90], [P[0], P[1]]], 8, COL.yellow); handOver(c, P[0], P[1], ah, true);
};
// a3.0 the girl is the drum with a steel plate; three family members are the air; a paper ear on the wall
const lineUp = (c: Ctx, passing: boolean) => {
  room(c);
  paperEar(c, 980, 440, 0.9);
  const xs = [120, 400, 620, 840], hs = [330, 440, 440, 440];
  const gj = joints(xs[0], FEET, hs[0]);
  const pl: [number, number] = [xs[0] + 60, gj.sy + 140], sp: [number, number] = [xs[0] + 110, gj.sy + 40];
  // the people from the right, so each hand that reaches forward lies over the next person's shoulder
  for (let i = 3; i >= 1; i--) {
    const tj = i < 3 ? joints(xs[i + 1], FEET, hs[i + 1]) : null;
    const target: [number, number] = i === 3 ? [930, 470] : [tj!.sx[0] - 6, tj!.sy - 10];
    if (passing) figure(c, xs[i], FEET, hs[i], { adult: true, R: [target[0], target[1], 1] }); else figure(c, xs[i], FEET, hs[i], { adult: true });
  }
  figure(c, xs[0], FEET, hs[0], { L: [pl[0] - 70, pl[1] + 30, -1], R: [sp[0], sp[1], 1] });
  shape(c, () => ell(c, pl[0], pl[1], 90, 44), COL.steel); shape(c, () => ell(c, pl[0], pl[1] - 2, 72, 32), COL.steelIn, 4); handOver(c, pl[0] - 70, pl[1] + 30, hs[0]);
  spoon(c, sp[0], sp[1], Math.PI * 0.6, 90); handOver(c, sp[0], sp[1], hs[0]);
  soundArcs(c, pl[0] + 30, pl[1] - 60, -Math.PI / 2, 2, 50, 30, 6, 0.6);
};
const a3s0 = (c: Ctx) => lineUp(c, false);
const a3s1 = (c: Ctx) => lineUp(c, true);
// p1.0 the child's map of the flat with the cooker in the kitchen
const p1s0 = (c: Ctx) => { ground(c, BG); flatMap(c); };
// p1.1 the girl stands in a bedroom doorway listening; the cooker whistles far off in the kitchen
const p1s1 = (c: Ctx) => {
  room(c);
  cooker(c, 190, 620, 0.75);
  doorway(c, 800, FLOOR_Y + 200, 300, 620);
  const gx = 800, gh = 430, gj = joints(gx, FEET, gh);
  figure(c, gx, FEET, gh, { L: [gj.ear[0][0] - 12, gj.ear[0][1] + 8, -1] });
  soundArcs(c, 190, 620 - 190, 0, 5, 90, 60, 8, 0.5);
};
// p1.2 the map coloured in: kitchen and hall red, bedrooms yellow, the balcony blue
const p1s2 = (c: Ctx) => { ground(c, BG); flatMap(c, { kitchen: "#f0a79b", hall: "#f0a79b", bed1: "#ffe58a", bed2: "#ffe58a", bath: "#ffe58a", balcony: "#a9d4f2" }); };

// ================================================================ card pictures
// flow.e1 the grown-up taps the tumbler; the sound fades along the hall before the far child
const flowE1 = (c: Ctx) => {
  room(c);
  // the tumbler stands on a low stool to her right; she taps its rim with the spoon
  const ax = 200, ah = 560, aj = joints(ax, FEET, ah), tx = 430, top = FEET - 30 - 140;
  const R: [number, number] = [ax + 150, aj.sy + 20];
  figure(c, ax, FEET, ah, { adult: true, R: [R[0], R[1], 1] });
  stool(c, tx, FEET, 170); tumbler(c, tx, FEET - 30, 100, 140);
  const rim: [number, number] = [tx - 10, top - 6], san = Math.atan2(rim[1] - R[1], rim[0] - R[0]), slen = Math.hypot(rim[0] - R[0], rim[1] - R[1]) / 1.12;
  spoon(c, R[0], R[1], san, slen); handOver(c, R[0], R[1], ah, true);
  soundArcs(c, tx + 40, top - 40, 0, 6, 90, 55, 9, 0.6);
  figure(c, 900, FEET, 430, { eyesShut: true });
};
// flow.e2 the child calls through the paper cone; the sound goes out one way
const flowE2 = (c: Ctx) => {
  room(c);
  const gx = 300, gh = 460, j = joints(gx, FEET, gh), m = j.mouth, len = 300;
  const L: [number, number] = [m[0] + len * 0.35, m[1] + 32], R: [number, number] = [m[0] + len * 0.7, m[1] + 40];
  figure(c, gx, FEET, gh, { L: [L[0], L[1], -1], R: [R[0], R[1], 1] });
  cone(c, m[0] + 14, m[1], 0, len, 16, 80);
  handOver(c, L[0], L[1], gh); handOver(c, R[0], R[1], gh);
  soundArcs(c, m[0] + len + 20, m[1], 0, 5, 50, 48, 9, 0.4, false);
  figure(c, 900, FEET, 560, { adult: true, L: [900 - 560 * 0.14 - 12, joints(900, FEET, 560).ear[0][1] + 8, -1] });
};
// flow.a1 the tapped tumbler in the middle; rings of sound reach every side
const flowA1 = (c: Ctx) => {
  room(c);
  rings(c, 540, 560, 6, 130, 72, 9);
  stool(c, 540, FEET - 40, 220);
  tumbler(c, 540, FEET - 66, 130, 180);
  // a grown-up's hand comes in from the upper right and taps the rim with the spoon
  const w: [number, number] = [820, 400], rim: [number, number] = [566, 712], san = Math.atan2(rim[1] - w[1], rim[0] - w[0]);
  spoon(c, w[0] + Math.cos(san) * 30, w[1] + Math.sin(san) * 30, san, (Math.hypot(rim[0] - w[0], rim[1] - w[1]) - 30) / 1.12);
  hand(c, w[0], w[1], san, 1.3, SKIN.adult, CLOTH.adult);
  figure(c, 120, FEET, 400, { eyesShut: true }); figure(c, 960, FEET, 400, { eyesShut: true });
};
// flow.a2 count after the flash: the window, the boy with fingers up
const flowA2 = (c: Ctx) => {
  ground(c, "#5a4e6e"); c.fillStyle = "#3f3652"; c.fillRect(0, FLOOR_Y, D, D - FLOOR_Y); line(c, [[0, FLOOR_Y], [D, FLOOR_Y]], 6);
  windowNight(c, 330, 90, 620, 440);
  const bx = 260, bh = 460, bj = joints(bx, FEET, bh), R: [number, number] = [bx + 140, bj.hy + 70];
  figure(c, bx, FEET, bh, { R: [R[0], R[1], 1] });
  fingersUp(c, R[0], R[1], 1.15, 4, SKIN.child);
  write(c, "4", 660, 620, 110, WHITE, 10);
};
const flowA3 = (c: Ctx) => lineUp(c, true);
const flowP1 = (c: Ctx) => { ground(c, BG); flatMap(c, { kitchen: "#f0a79b", hall: "#f0a79b", bed1: "#ffe58a", bed2: "#ffe58a", bath: "#ffe58a", balcony: "#a9d4f2" }); soundArcs(c, 310, 100, Math.PI / 2, 4, 120, 80, 8, 0.5); };
// term.0 the sound source: a pressure cooker whistling on the stove
const term0 = (c: Ctx) => {
  room(c); shape(c, () => rrect(c, 60, 700, 960, 40, 6), COL.grey);
  cooker(c, 540, 700, 1.6);
};
// term.3 a megaphone: the girl speaks into the narrow end, sound out of the wide end
const term3 = (c: Ctx) => {
  room(c);
  const gx = 320, gh = 520, j = joints(gx, FEET, gh), m = j.mouth, len = 360;
  const L: [number, number] = [m[0] + len * 0.3, m[1] + 36], R: [number, number] = [m[0] + len * 0.62, m[1] + 48];
  figure(c, gx, FEET, gh, { L: [L[0], L[1], -1], R: [R[0], R[1], 1] });
  cone(c, m[0] + 14, m[1], 0, len, 18, 100);
  handOver(c, L[0], L[1], gh); handOver(c, R[0], R[1], gh);
  soundArcs(c, m[0] + len + 24, m[1], 0, 4, 60, 60, 10, 0.4, false);
};

export const ic_soundSoundMovesL1 = cards("sci.sound.sound-moves.L1", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, p1s0, p1s1, p1s2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, term0, term3,
]);
void RED;
