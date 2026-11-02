import type { Ctx } from "./core";
import { D, INK, BG, COL, WHITE, RED, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, line, arrow, hand, person, write, cards } from "./flatKit";

// THE SUN APPEARS TO MOVE · set-up cards for the sun patch and shadow footsteps experiments, then card
// pictures. Same girl (orange kurta) and grown-up (blue) on every card. Light from the upper left.

const SUNLIGHT = "#ffe98a", GRILL = "rgba(43,35,64,0.22)", WALL = "#fbf4e6", TILE = "#d9ccb2", PARAPET = "#d9c7a8", SHADE = "rgba(43,35,64,0.5)";

// ---------------------------------------------------------------- scenery
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
// an indoor room: wall above y0, tiled floor below
const room = (c: Ctx, y0: number) => {
  ground(c, WALL); c.fillStyle = BG; c.fillRect(0, y0, D, D - y0); line(c, [[0, y0], [D, y0]], 5);
  for (let x = 135; x < D; x += 135) line(c, [[x, y0], [x, D]], 3, TILE);
  for (let y = y0 + 90; y < D; y += 90) line(c, [[0, y], [D, y]], 3, TILE);
};
// a floor seen close up
const floor = (c: Ctx) => { ground(c); for (let x = 135; x < D; x += 135) line(c, [[x, 0], [x, D]], 3, TILE); for (let y = 90; y < D; y += 90) line(c, [[0, y], [D, y]], 3, TILE); };
// a terrace: sky, a low parapet wall, the terrace floor below hz
const terrace = (c: Ctx, hz: number) => {
  ground(c, COL.sky); shape(c, () => c.rect(-10, hz - 90, D + 20, 90), PARAPET, 5);
  c.fillStyle = BG; c.fillRect(0, hz, D, D - hz); line(c, [[0, hz], [D, hz]], 5);
  for (let y = hz + 110; y < D; y += 110) line(c, [[0, y], [D, y]], 3, TILE);
};
// a balcony door with a grill, the Sun showing through its glass
const balconyDoor = (c: Ctx) => {
  shape(c, () => rrect(c, 290, 40, 500, 490, 10), COL.brown);
  shape(c, () => c.rect(330, 80, 420, 440), COL.sky, 5);
  sun(c, 420, 170, 48);
  for (let x = 400; x < 750; x += 70) line(c, [[x, 80], [x, 520]], 8);
  line(c, [[330, 300], [750, 300]], 8);
};
// a bright sun patch on the floor: a quad from (tx1..tx2, ty) to (bx1..bx2, by), with grill stripes
const patch = (c: Ctx, tx1: number, tx2: number, ty: number, bx1: number, bx2: number, by: number, n = 4) => {
  const path = () => polyP(c, [[tx1, ty], [tx2, ty], [bx2, by], [bx1, by]]);
  shape(c, path, SUNLIGHT, 4);
  c.save(); c.beginPath(); path(); c.clip();
  for (let i = 1; i <= n; i++) { const t = i / (n + 1), xt = tx1 + (tx2 - tx1) * t, xb = bx1 + (bx2 - bx1) * t, w1 = (tx2 - tx1) * 0.03, w2 = (bx2 - bx1) * 0.03; shape(c, () => polyP(c, [[xt - w1, ty], [xt + w1, ty], [xb + w2, by], [xb - w2, by]]), GRILL, 0); }
  c.restore();
};
// a one-rupee coin lying on the floor, numbered
const coin = (c: Ctx, x: number, y: number, n: string) => {
  shadow(c, x + 8, y + 10, 44, 30);
  shape(c, () => ell(c, x, y, 44, 32), "#e8b84a");
  shape(c, () => ell(c, x, y - 3, 34, 24), "#f6d57a", 3);
  write(c, n, x - 11 * n.length, y - 18, 34, INK, 5);
};
const chalkCross = (c: Ctx, x: number, y: number) => { line(c, [[x - 40, y - 14], [x + 40, y + 14]], 10, WHITE); line(c, [[x - 40, y + 14], [x + 40, y - 14]], 10, WHITE); };
// a standing person's shadow lying on the ground from the feet (x, y), len long, dir 1 = to the right
const castShadow = (c: Ctx, x: number, y: number, len: number, dir: number) => {
  c.save(); c.translate(x, y + 8); c.scale(dir, 0.4); c.beginPath();
  c.rect(0, -30, len * 0.5, 60); c.rect(len * 0.45, -48, len * 0.42, 96); c.arc(len * 0.94, 0, 56, 0, Math.PI * 2);
  c.fillStyle = SHADE; c.fill(); c.restore();
};
const stone = (c: Ctx, x: number, y: number) => { shadow(c, x + 8, y + 10, 40, 16); shape(c, () => { c.moveTo(x - 42, y + 10); c.quadraticCurveTo(x - 30, y - 30, x + 10, y - 26); c.quadraticCurveTo(x + 44, y - 20, x + 40, y + 10); c.closePath(); }, COL.grey); };
// a ginger cat asleep, curled up, centre (x, y)
const cat = (c: Ctx, x: number, y: number) => {
  const G = "#e8923a";
  shape(c, () => { c.moveTo(x + 100, y + 30); c.quadraticCurveTo(x + 190, y - 20, x + 150, y - 70); }, "rgba(0,0,0,0)", 0);
  line(c, [[x + 100, y + 30], [x + 170, y + 10], [x + 190, y - 50]], 30, INK); line(c, [[x + 100, y + 30], [x + 170, y + 10], [x + 190, y - 50]], 20, G);
  shape(c, () => ell(c, x, y, 130, 62), G);
  for (let i = -1; i <= 1; i++) line(c, [[x + i * 40 - 10, y - 50], [x + i * 40 + 10, y - 10]], 8, "#c86e22");
  shape(c, () => polyP(c, [[x - 150, y - 60], [x - 135, y - 110], [x - 105, y - 70]]), G, 5);
  shape(c, () => polyP(c, [[x - 95, y - 65], [x - 70, y - 108], [x - 55, y - 60]]), G, 5);
  shape(c, () => ell(c, x - 105, y - 35, 52, 46), G);
  c.beginPath(); c.arc(x - 125, y - 38, 10, 0.1, Math.PI - 0.1); c.arc(x - 85, y - 38, 10, 0.1, Math.PI - 0.1); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, () => ell(c, x - 105, y - 18, 7, 5), COL.pink, 3);
};

// ---------------------------------------------------------------- set-up cards, experiment 1
const s10 = (c: Ctx) => { room(c, 530); balconyDoor(c); patch(c, 340, 740, 545, 170, 920, 930); };
const s11 = (c: Ctx) => {
  floor(c); patch(c, 400, 1140, 450, 400, 1140, 1140, 3);
  shape(c, () => ell(c, 900, 170, 82, 82), COL.paper); line(c, [[900, 170], [900, 118]], 7); line(c, [[900, 170], [938, 190]], 7);
  coin(c, 400, 450, "1"); hand(c, 290, 348, 0.75, 1.6);
};
const s12 = (c: Ctx) => {
  floor(c); patch(c, 845, 1140, 600, 845, 1140, 1140, 3);
  for (let i = 0; i < 5; i++) coin(c, 170 + i * 158, 600, String(i + 1));
  arrow(c, [[190, 470], [760, 470]]);
};
const s13 = (c: Ctx) => {
  floor(c); patch(c, 960, 1140, 600, 960, 1140, 1140, 3);
  coin(c, 120, 600, "1"); coin(c, 900, 600, "5");
  hand(c, 300, 600, 0, 2, SKIN.child, CLOTH.child, true);
  arrow(c, [[520, 720], [850, 720]]);
};
// ---------------------------------------------------------------- set-up cards, experiment 2
const s20 = (c: Ctx) => { terrace(c, 540); sun(c, 150, 330, 60); castShadow(c, 330, 880, 620, 1); chalkCross(c, 330, 880); person(c, 330, 880, 440); };
const s21 = (c: Ctx) => {
  terrace(c, 540); sun(c, 150, 330, 60); castShadow(c, 260, 880, 560, 1); chalkCross(c, 260, 880);
  stone(c, 830, 900); person(c, 260, 880, 440); person(c, 940, 880, 520, { adult: true, armL: [Math.PI * 0.72, Math.PI * 0.62], armR: [Math.PI * 0.6, Math.PI * 0.55] });
  arrow(c, [[300, 990], [800, 990]]);
};
const s22 = (c: Ctx) => { terrace(c, 540); sun(c, 540, 130, 70); shape(c, () => ell(c, 540, 892, 70, 26), SHADE, 0); chalkCross(c, 540, 880); person(c, 540, 880, 440); };

// ---------------------------------------------------------------- card pictures
const fE1 = (c: Ctx) => {
  room(c, 430); patch(c, 440, 830, 480, 280, 1010, 910);
  coin(c, 440, 495, "1"); coin(c, 400, 585, "2"); coin(c, 360, 675, "3");
  cat(c, 720, 760); person(c, 170, 900, 400, { sit: true, armR: [0.15, 0.55], armL: [Math.PI * 0.6, Math.PI * 0.5] });
};
const fE2 = (c: Ctx) => {
  terrace(c, 540); sun(c, 150, 330, 60); castShadow(c, 300, 880, 600, 1); chalkCross(c, 300, 880);
  for (let i = 0; i < 6; i++) { const x = 400 + i * 92, y = 884 + (i % 2 ? 10 : -10); shape(c, () => ell(c, x, y, 36, 20), COL.paper, 4); write(c, String(i + 1), x - 12, y - 80, 34, INK, 5); }
  stone(c, 960, 905); person(c, 300, 880, 440);
};
const fA1 = (c: Ctx) => {
  room(c, 560);
  shape(c, () => rrect(c, 110, 70, 360, 360, 8), COL.brown); shape(c, () => c.rect(140, 100, 300, 300), COL.sky, 5); sun(c, 230, 190, 44); line(c, [[290, 100], [290, 400]], 8); line(c, [[140, 250], [440, 250]], 8);
  c.globalAlpha = 0.35; shape(c, () => polyP(c, [[150, 110], [440, 110], [1000, 880], [640, 880]]), SUNLIGHT, 0); c.globalAlpha = 1;
  patch(c, 640, 1000, 880, 580, 1060, 1000, 3);
  person(c, 300, 1010, 430, { armR: [-0.05, 0.25] });
};
const fA3 = (c: Ctx) => {
  room(c, 520);
  shape(c, () => rrect(c, 330, 40, 420, 420, 8), COL.brown); shape(c, () => c.rect(360, 70, 360, 360), COL.sky, 5); sun(c, 540, 160, 54);
  line(c, [[360, 330], [720, 330]], 8); line(c, [[540, 70], [540, 430]], 8);
  for (let i = 0; i < 4; i++) shape(c, () => c.rect(370 + i * 90, 360 + (i % 2) * 20, 70, 70 - (i % 2) * 20), COL.steelDk, 4);
  shape(c, () => rrect(c, 500, 700, 420, 300, 6), COL.paper);
  c.beginPath(); c.arc(710, 980, 200, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  [[1.12, 0], [1.3, 0], [1.5, 0], [1.7, 0], [1.88, 0]].forEach(([a]) => shape(c, () => ell(c, 710 + Math.cos(a * Math.PI) * 200, 980 + Math.sin(a * Math.PI) * 200, 20, 20), COL.yellow, 4));
  for (let i = 0; i < 4; i++) shape(c, () => c.rect(560 + i * 85, 930, 55, 50), COL.steelDk, 4);
  person(c, 260, 900, 400, { sit: true, armR: [0.1, 0.5], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  line(c, [[430, 820], [520, 900]], 12, INK); line(c, [[430, 820], [520, 900]], 6, COL.yellow);
};
const fA5 = (c: Ctx) => {
  terrace(c, 760);
  const R = 536, cx = 540, cy = 760, pt = (t: number): number[] => [cx + Math.cos(t) * R, cy + Math.sin(t) * R];
  c.setLineDash([14, 22]); line(c, [pt(-Math.PI * 0.95), pt(-Math.PI * 0.75), pt(-Math.PI * 0.6), pt(-Math.PI * 0.5), pt(-Math.PI * 0.4), pt(-Math.PI * 0.25), pt(-Math.PI * 0.1), pt(-Math.PI * 0.03)], 6, COL.greyDk); c.setLineDash([]);
  const pts: number[][] = []; for (let t = -Math.PI * 0.92; t <= -Math.PI * 0.42; t += 0.05) pts.push(pt(t)); arrow(c, pts);
  person(c, 540, 1000, 440, { adult: true, armR: [-0.5, -0.8], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  line(c, [[703, 601], [860, 330]], 14, INK); line(c, [[703, 601], [860, 330]], 7, COL.wood);
  sun(c, 860, 330, 58);
};
const fP1 = (c: Ctx) => {
  floor(c); patch(c, 600, 900, 300, 680, 1020, 780);
  const marks = ["9", "10", "11", "12"];
  marks.forEach((m, i) => { const xt = 150 + i * 150, xb = 230 + i * 150; line(c, [[xt, 300], [xb, 780]], 9, WHITE); write(c, m, xt - 20 - (m.length - 1) * 14, 210, 56, WHITE, 9); });
  line(c, [[150, 300], [600, 300]], 9, WHITE); line(c, [[230, 780], [680, 780]], 9, WHITE);
  shape(c, () => rrect(c, 560, 900, 150, 34, 10), WHITE);
};
const tShadow = (c: Ctx) => {
  terrace(c, 700); sun(c, 150, 150, 70);
  shape(c, () => ell(c, 640, 900, 330, 80), SHADE, 0);
  shape(c, () => polyP(c, [[500, 880], [580, 880], [565, 560], [515, 560]]), COL.brown);
  [[540, 400, 190], [380, 470, 130], [700, 470, 130], [450, 300, 110], [630, 300, 110], [540, 250, 100]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.85), COL.green));
  shape(c, () => ell(c, 470, 380, 90, 70), COL.greenLt, 0);
};
const tRotate = (c: Ctx) => {
  ground(c); line(c, [[0, 820], [D, 820]], 5);
  shadow(c, 380, 822, 120, 22);
  shape(c, () => polyP(c, [[210, 520], [510, 520], [370, 810], [350, 810]]), COL.red);
  shape(c, () => polyP(c, [[230, 560], [490, 560], [470, 600], [250, 600]]), COL.yellow, 4);
  shape(c, () => rrect(c, 340, 440, 40, 90, 10), COL.wood);
  shape(c, () => ell(c, 360, 520, 150, 40), COL.red);
  const ap: number[][] = []; for (let t = Math.PI * 0.9; t <= Math.PI * 1.9; t += 0.1) ap.push([360 + Math.cos(t) * 230, 540 + Math.sin(t) * 70]); arrow(c, ap);
  shadow(c, 810, 822, 120, 22); line(c, [[800, 740], [800, 815]], 14); shape(c, () => ell(c, 800, 815, 90, 18), COL.greyDk);
  shape(c, () => ell(c, 800, 560, 165, 165), COL.blue);
  [[740, 500, 60, 45], [860, 600, 55, 70], [760, 640, 45, 35]].forEach(([x, y, rx, ry]) => shape(c, () => ell(c, x, y, rx, ry), COL.green, 4));
  const gp: number[][] = []; for (let t = Math.PI * 0.85; t <= Math.PI * 1.95; t += 0.1) gp.push([800 + Math.cos(t) * 215, 400 + Math.sin(t) * 60]); arrow(c, gp);
};
const tPatch = (c: Ctx) => { room(c, 530); balconyDoor(c); patch(c, 340, 740, 545, 170, 920, 930); cat(c, 560, 800); };
const xShadows = (c: Ctx) => {
  terrace(c, 700);
  sun(c, 70, 520, 48); castShadow(c, 200, 920, 300, 1); person(c, 200, 920, 320);
  sun(c, 540, 110, 54); shape(c, () => ell(c, 540, 928, 52, 18), SHADE, 0); person(c, 540, 920, 320);
  sun(c, 1010, 520, 48); castShadow(c, 880, 920, 300, -1); person(c, 880, 920, 320);
};

export const ic_dayNightSeasonsSunAppearsToMoveL2 = cards("sci.day-night-seasons.sun-appears-to-move.L2", [
  s10, s11, s12, s13, s20, s21, s22,
  fE1, fE2, fA1, fA3, fA5, fP1, tShadow, tRotate, tPatch, xShadows,
]);
