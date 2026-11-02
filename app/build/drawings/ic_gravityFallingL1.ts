import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, bowl, leaf, hand, person, cards } from "./flatKit";

// THINGS FALL (sci.gravity.falling.L1) · set-up cards for the two experiments, then card pictures.
// Same girl (SKIN.child, orange top) and the same mother (SKIN.adult, blue top) on every card.

const FLOOR = "#e2d3b6", TILE = "#cdbc9a", MAT = "#b7d9c8";
const floor = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
const tiles = (c: Ctx, y: number) => {
  floor(c, y); c.strokeStyle = TILE; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 135) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, D); c.stroke(); }
  for (let yy = y + 135; yy < D; yy += 135) { c.beginPath(); c.moveTo(0, yy); c.lineTo(D, yy); c.stroke(); }
};

// ---------------------------------------------------------------- the ten things
const spoon = (c: Ctx, x: number, y: number, an: number, s = 1, water = false) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -110, -12, 150, 24, 12), COL.steel, 5);
  shape(c, () => ell(c, 70, 0, 44, 30), COL.steel, 5);
  shape(c, () => ell(c, 72, 2, 30, 18), water ? COL.water : COL.steelIn, 0);
  shine(c, [[-90, -4], [0, -4]], 5);
  c.restore();
};
const lemon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x - r, y, r * 0.2, r * 0.16), COL.yellow, 4); shape(c, () => ell(c, x + r, y, r * 0.2, r * 0.16), COL.yellow, 4);
  shape(c, () => ell(c, x, y, r, r * 0.78), COL.yellow); shade(c, () => ell(c, x, y, r, r * 0.78), "#d9a914", r * 0.3, r * 0.25, 0.5);
  shine(c, [[x - r * 0.5, y - r * 0.35], [x - r * 0.2, y - r * 0.5]], 7);
};
const cap = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95]], 3, COL.blueDk); }
  shape(c, () => ell(c, x, y, r * 0.6, r * 0.6), COL.blueDk, 3);
};
const feather = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => { c.moveTo(0, 0); c.quadraticCurveTo(len * 0.5, -len * 0.34, len, -len * 0.05); c.quadraticCurveTo(len * 0.5, len * 0.3, 0, 0); c.closePath(); }, "#f6f2ea", 5);
  for (let i = 1; i < 6; i++) { const t = i / 6, s = Math.sin(t * Math.PI); line(c, [[len * t, -len * 0.02], [len * t + len * 0.06, -len * 0.2 * s]], 3, COL.grey); line(c, [[len * t, -len * 0.02], [len * t + len * 0.06, len * 0.18 * s]], 3, COL.grey); }
  line(c, [[-len * 0.15, 0], [len * 0.95, -len * 0.05]], 4, COL.greyDk);
  c.restore();
};
const balloon = (c: Ctx, x: number, y: number, r: number, col = COL.red, string = true) => {
  const p = () => ell(c, x, y, r, r * 1.18);
  shape(c, p, col); shade(c, p, "#9c2f22", r * 0.3, r * 0.2, 0.35);
  shape(c, () => polyP(c, [[x - r * 0.2, y + r * 1.32], [x + r * 0.2, y + r * 1.32], [x, y + r * 1.1]]), col, 4);
  shine(c, [[x - r * 0.55, y - r * 0.45], [x - r * 0.35, y - r * 0.78]], 8);
  if (string) line(c, [[x, y + r * 1.32], [x - r * 0.2, y + r * 1.7], [x + r * 0.1, y + r * 2.1]], 3, INK);
};
const cotton = (c: Ctx, x: number, y: number, r: number) => {
  const P = [[0, 0, r], [-r * 0.7, -r * 0.3, r * 0.7], [r * 0.7, -r * 0.25, r * 0.72], [-r * 0.35, r * 0.55, r * 0.65], [r * 0.4, r * 0.55, r * 0.66], [0, -r * 0.7, r * 0.6]];
  P.forEach(([dx, dy, rr]) => shape(c, () => ell(c, x + dx, y + dy, rr, rr), WHITE, 5));
  P.forEach(([dx, dy, rr]) => shape(c, () => ell(c, x + dx, y + dy, rr - 3, rr - 3), WHITE, 0));
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, col = COL.paper) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), col, 5); c.restore(); };
const hanky = (c: Ctx, x: number, y: number, w: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -w / 2, w, w, 6), COL.sky, 5);
  c.save(); c.beginPath(); rrect(c, -w / 2, -w / 2, w, w, 6); c.clip();
  for (let i = -2; i <= 2; i++) { line(c, [[i * w * 0.22, -w / 2], [i * w * 0.22, w / 2]], 5, COL.blue); line(c, [[-w / 2, i * w * 0.22], [w / 2, i * w * 0.22]], 5, COL.blue); }
  c.restore(); c.restore();
};
const rice = (c: Ctx, x: number, y: number, n: number, seedN: number) => { const r = rnd(seedN); for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = r() * 60; shape(c, () => ell(c, x + Math.cos(a) * d * 1.3, y + Math.sin(a) * d * 0.6, 13, 6, r() * 3), WHITE, 3); } };

// ---------------------------------------------------------------- other things
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const top = w * 0.5, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.12), COL.steelIn, 5);
  shine(c, [[x - top * 0.6, y - h * 0.85], [x - bot * 0.65, y - h * 0.2]], 7);
};
const book = (c: Ctx, x: number, y: number, w: number, col = COL.purple) => {
  shape(c, () => rrect(c, x - w / 2, y - 22, w, 44, 6), col);
  shape(c, () => rrect(c, x - w / 2 + 14, y - 11, w - 20, 22, 3), COL.paper, 3);
  for (let i = 0; i < 3; i++) line(c, [[x - w / 2 + 22, y - 6 + i * 6], [x + w / 2 - 12, y - 6 + i * 6]], 1.5, COL.grey);
};
const cushion = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 14, y + h * 0.55, w * 0.55, h * 0.25); const p = () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.45);
  shape(c, p, COL.teal); shade(c, p, COL.tealDk, w * 0.08, h * 0.2); shape(c, () => ell(c, x, y, 8, 8), COL.tealDk, 3);
};
const mug = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.65, w * 0.14); const body = () => rrect(c, x - w / 2, y - h, w, h, 10);
  shape(c, () => { c.moveTo(x + w / 2 - 4, y - h * 0.78); c.bezierCurveTo(x + w * 1.0, y - h * 0.8, x + w * 1.0, y - h * 0.25, x + w / 2 - 4, y - h * 0.28); c.lineTo(x + w / 2 - 4, y - h * 0.4); c.bezierCurveTo(x + w * 0.78, y - h * 0.4, x + w * 0.78, y - h * 0.66, x + w / 2 - 4, y - h * 0.66); c.closePath(); }, COL.steel, 5);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.12), COL.steelIn, 5);
};
const newspaper = (c: Ctx, pts: number[][]) => {
  shape(c, () => polyP(c, pts), COL.paper, 5);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs) + 30, x1 = Math.max(...xs) - 30, y0 = Math.min(...ys) + 30, y1 = Math.max(...ys) - 30;
  c.save(); c.beginPath(); polyP(c, pts); c.clip();
  line(c, [[x0, y0 + 10], [x0 + (x1 - x0) * 0.6, y0 + 10]], 16, COL.greyDk);
  shape(c, () => rrect(c, x0 + (x1 - x0) * 0.66, y0, (x1 - x0) * 0.34, (y1 - y0) * 0.3, 4), COL.grey, 3);
  const cw = (x1 - x0) / 3;
  for (let col = 0; col < 3; col++) for (let y = y0 + 44; y < y1; y += 20) { if (col === 2 && y < y0 + (y1 - y0) * 0.3 + 10) continue; line(c, [[x0 + col * cw, y], [x0 + col * cw + cw - 24, y]], 5, COL.grey); }
  c.restore();
};
const dot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.8), COL.blueDk, 0);
const dashed = (c: Ctx, x: number, y0: number, y1: number) => { for (let y = y0; y < y1; y += 28) line(c, [[x, y], [x, Math.min(y1, y + 14)]], 4, COL.greyDk); };
const girlArmOut = (c: Ctx, x: number, y: number, h: number) => { shadow(c, x + 10, y + 8, h * 0.2, 16); person(c, x, y, h, { armR: [0, 0] }); };

// ================================================================ set-up cards
// setup.e1.0 · ten things on a mat
const se1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 580, 470, 410); shape(c, () => rrect(c, 80, 140, 920, 820, 40), MAT, 6);
  spoon(c, 200, 300, -0.35, 1.1); cap(c, 430, 300, 50); lemon(c, 660, 300, 62); paper(c, 890, 300, 120, 150, 0.12);
  cotton(c, 200, 570, 48); feather(c, 350, 600, -0.4, 170); balloon(c, 660, 520, 60); rice(c, 890, 560, 26, 3);
  spoon(c, 300, 830, 0.1, 1.1, true); hanky(c, 650, 830, 170, 0.08);
};
// setup.e1.1 · guessing: FALLS sheet and STAYS UP sheet, the girl putting the balloon on STAYS UP
const se1_1 = (c: Ctx) => {
  ground(c); floor(c, 640);
  shadow(c, 540 + 10, 708, 110, 16); person(c, 540, 700, 520, { armR: [Math.PI * 0.3, Math.PI * 0.45] });
  shape(c, () => polyP(c, [[140, 760], [430, 760], [460, 1010], [90, 1010]]), COL.paper, 5);
  shape(c, () => polyP(c, [[650, 760], [940, 760], [990, 1010], [620, 1010]]), COL.paper, 5);
  arrow(c, [[290, 790], [290, 900]], INK, 10); line(c, [[700, 870], [910, 870]], 10, INK);
  spoon(c, 190, 965, 0.1, 0.6); lemon(c, 380, 965, 32);
  balloon(c, 675, 566, 60, COL.red, false);
  arrow(c, [[750, 640], [790, 830]]);
};
// setup.e1.2 · hold the spoon out, open the hand
const se1_2 = (c: Ctx) => {
  ground(c); floor(c, 760);
  plate(c, 700, 920, 160, 48);
  girlArmOut(c, 360, 880, 620); hand(c, 632, 440, 0, 0.8, SKIN.child, CLOTH.child, true);
  spoon(c, 700, 600, Math.PI / 2, 1.1);
  arrow(c, [[800, 520], [800, 720]]);
};
// setup.e1.3 · the balloon drifts down and lands beside the plate
const se1_3 = (c: Ctx) => {
  ground(c); floor(c, 760);
  plate(c, 640, 920, 160, 48); spoon(c, 640, 905, 0.15, 1);
  girlArmOut(c, 360, 880, 620); hand(c, 632, 440, 0, 0.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[720, 480], [790, 560], [730, 650], [820, 740], [830, 780]]);
  shadow(c, 900, 950, 70, 14); balloon(c, 890, 870, 60, COL.red, false);
};
// setup.e2.0 · a big dot in the middle of a newspaper on a tiled floor
const se2_0 = (c: Ctx) => {
  ground(c); tiles(c, 0);
  shadow(c, 560, 560, 440, 400);
  c.save(); c.translate(540, 540); c.rotate(-0.04); c.translate(-540, -540);
  newspaper(c, [[120, 160], [960, 160], [960, 920], [120, 920]]);
  c.restore();
  dot(c, 540, 560, 75);
  c.save(); c.translate(820, 860); c.rotate(-0.5); shape(c, () => rrect(c, -90, -18, 180, 36, 10), COL.blueDk); shape(c, () => rrect(c, 50, -18, 40, 36, 8), INK, 0); c.restore();
};
// setup.e2.1 · the lemon held right above the dot
const se2_1 = (c: Ctx) => {
  ground(c); tiles(c, 640);
  newspaper(c, [[200, 720], [880, 720], [960, 1020], [120, 1020]]); dot(c, 553, 900, 55);
  shadow(c, 370, 868, 120, 16); person(c, 360, 860, 620, { armR: [0, Math.PI / 2] });
  lemon(c, 550, 565, 50);
  dashed(c, 553, 625, 845);
};
// setup.e2.2 · the lemon on the dot; the paper rocks sideways and lands away
const se2_2 = (c: Ctx) => {
  ground(c); tiles(c, 560);
  newspaper(c, [[150, 620], [720, 620], [760, 1000], [90, 1000]]); dot(c, 420, 830, 55);
  shadow(c, 430, 842, 60, 12); lemon(c, 420, 800, 50);
  arrow(c, [[420, 450], [420, 700]]);
  paper(c, 830, 420, 170, 220, 0.5);
  arrow(c, [[860, 560], [930, 640], [850, 720], [920, 800], [930, 840]]);
  shape(c, () => polyP(c, [[800, 880], [1010, 870], [1040, 970], [820, 980]]), COL.paper, 5);
};

// ================================================================ card pictures
// flow.e1 · the girl lets go: spoon, lemon, balloon and feather all going down to the plate
const fe1 = (c: Ctx) => {
  ground(c); floor(c, 760);
  plate(c, 760, 930, 190, 55);
  girlArmOut(c, 300, 880, 620); hand(c, 572, 440, 0, 0.8, SKIN.child, CLOTH.child, true);
  spoon(c, 650, 620, Math.PI / 2, 1); lemon(c, 790, 700, 50); balloon(c, 900, 560, 58, COL.red, false); feather(c, 940, 300, 1.2, 160);
  arrow(c, [[560, 540], [560, 740]]);
};
// flow.e2 · the lemon falls straight from the open hand onto the dot
const fe2 = (c: Ctx) => {
  ground(c); tiles(c, 560);
  newspaper(c, [[150, 620], [850, 620], [930, 1000], [70, 1000]]); dot(c, 540, 850, 60);
  hand(c, 400, 300, 0, 1.6, SKIN.child, CLOTH.child, true);
  lemon(c, 540, 480, 60);
  arrow(c, [[660, 440], [660, 740]]);
};
// flow.a1 · the mother slides the book away; the tumbler falls onto the cushion
const fa1 = (c: Ctx) => {
  ground(c); floor(c, 760);
  cushion(c, 560, 880, 420, 120);
  shadow(c, 310, 908, 130, 16); person(c, 300, 900, 680, { adult: true, armR: [0, 0] });
  book(c, 740, 420, 280);
  arrow(c, [[760, 340], [920, 340]]);
  tumbler(c, 560, 640, 110, 150);
  arrow(c, [[470, 500], [470, 770]]);
};
// flow.a2 · water falls from the tap into a steel mug; the girl points
const fa2 = (c: Ctx) => {
  ground(c); floor(c, 860);
  line(c, [[760, 200], [760, 470], [820, 470], [820, 545]], 62, INK); line(c, [[760, 200], [760, 470], [820, 470], [820, 545]], 50, COL.steel);
  shine(c, [[760, 230], [760, 440]], 8);
  shape(c, () => ell(c, 760, 180, 42, 42), COL.red); line(c, [[730, 180], [790, 180]], 5, INK); line(c, [[760, 150], [760, 210]], 5, INK);
  mug(c, 820, 960, 150, 190);
  line(c, [[820, 560], [820, 780]], 30, COL.water); shine(c, [[812, 580], [812, 760]], 7);
  shadow(c, 330, 1008, 120, 16); person(c, 320, 1000, 620, { armR: [-Math.PI * 0.2, -Math.PI * 0.1] });
  arrow(c, [[920, 580], [920, 760]]);
};
// flow.a3 · jump! the girl in the air above the mat, the pull straight down
const fa3 = (c: Ctx) => {
  ground(c); floor(c, 820);
  shadow(c, 560, 870, 400, 40); shape(c, () => rrect(c, 140, 800, 800, 100, 30), COL.purple, 6);
  shadow(c, 540, 800, 90, 14);
  person(c, 540, 640, 600, { armL: [-Math.PI * 0.75, -Math.PI * 0.6], armR: [-Math.PI * 0.25, -Math.PI * 0.4] });
  line(c, [[470, 680], [440, 720]], 5, INK); line(c, [[610, 680], [640, 720]], 5, INK);
  arrow(c, [[700, 640], [700, 790]]);
};
// flow.p1 · the wall marble run: zig-zag tubes on a cupboard door, the marble ends in the bowl
const tube = (c: Ctx, a: number[], b: number[], w = 64) => {
  line(c, [a, b], w + 10, INK); line(c, [a, b], w, "#d9b38c"); line(c, [a, b], w * 0.3, "#b98a5c");
  const an = Math.atan2(b[1] - a[1], b[0] - a[0]);
  for (const p of [a, b]) { c.save(); c.translate(p[0], p[1]); c.rotate(an); shape(c, () => rrect(c, -14, -w * 0.75, 28, w * 1.5, 4), "#f1e6c8", 3); c.restore(); }
};
const marble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.blue); shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.3, r * 0.3, 0.5); shape(c, () => ell(c, x - r * 0.35, y - r * 0.35, r * 0.22, r * 0.22), WHITE, 0); };
const fp1 = (c: Ctx) => {
  ground(c); floor(c, 980);
  shape(c, () => rrect(c, 190, 40, 700, 960, 14), COL.wood, 6); shape(c, () => rrect(c, 820, 500, 24, 90, 10), COL.woodDk, 4);
  tube(c, [280, 190], [720, 300]); tube(c, [790, 400], [320, 520]); tube(c, [280, 620], [720, 740]);
  marble(c, 270, 110, 28); arrow(c, [[330, 90], [330, 160]]);
  arrow(c, [[500, 180], [640, 215]]); arrow(c, [[600, 410], [460, 446]]); arrow(c, [[500, 610], [640, 646]]);
  bowl(c, 800, 900, 100); marble(c, 770, 820, 28); arrow(c, [[860, 740], [860, 830]]);
};
// term.0 · a ripe mango falls from the branch towards the grass
const mango = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - s * 0.1, y - s * 0.95); c.bezierCurveTo(x + s * 0.9, y - s * 0.9, x + s * 0.95, y + s * 0.5, x + s * 0.3, y + s * 0.95); c.bezierCurveTo(x - s * 0.3, y + s * 1.1, x - s * 0.95, y + s * 0.3, x - s * 0.75, y - s * 0.4); c.bezierCurveTo(x - s * 0.6, y - s * 0.85, x - s * 0.3, y - s * 1.0, x - s * 0.1, y - s * 0.95); c.closePath(); };
  shape(c, p, COL.yellow); shade(c, p, "#e8a62a", s * 0.3, s * 0.25, 0.5);
  line(c, [[x - s * 0.1, y - s * 0.95], [x - s * 0.15, y - s * 1.2]], 6, COL.brown);
  shine(c, [[x - s * 0.5, y - s * 0.45], [x - s * 0.3, y - s * 0.7]], 9);
};
const t0 = (c: Ctx) => {
  ground(c, "#dff0f8");
  c.fillStyle = COL.green; c.fillRect(0, 860, D, D - 860); line(c, [[0, 860], [D, 860]], 5);
  for (let x = 20; x < D; x += 70) shape(c, () => polyP(c, [[x, 862], [x + 18, 800 - (x % 3) * 12], [x + 40, 862]]), COL.greenLt, 4);
  line(c, [[0, 110], [330, 170], [700, 190]], 50, INK); line(c, [[0, 110], [330, 170], [700, 190]], 38, COL.brown);
  [[150, 140, 2.0], [300, 160, 1.7], [450, 180, 2.4], [600, 185, 1.9], [690, 190, 0.3]].forEach(([x, y, a]) => leaf(c, x, y, 130, a));
  line(c, [[560, 190], [565, 260]], 5, COL.brown);
  shadow(c, 600, 880, 110, 20); mango(c, 590, 540, 130);
  arrow(c, [[780, 470], [780, 760]]);
};
// term.2 · a wooden shelf holding up books and a steel tumbler
const t2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 700, 440, 30);
  const B: [number, number, number, string][] = [[200, 80, 300, COL.red], [285, 70, 250, COL.teal], [360, 76, 290, COL.yellow], [441, 60, 230, COL.purple], [506, 80, 300, COL.green]];
  B.forEach(([x, w, h, col]) => { shape(c, () => rrect(c, x, 600 - h, w, h, 5), col); line(c, [[x + 14, 600 - h + 16], [x + 14, 584]], 4, INK); shape(c, () => rrect(c, x + 10, 600 - h + 8, w - 20, 10, 3), COL.paper, 3); });
  c.save(); c.translate(640, 600); c.rotate(-0.28); shape(c, () => rrect(c, 0, -280, 70, 280, 5), COL.blue); line(c, [[14, -264], [14, -16]], 4, INK); c.restore();
  tumbler(c, 850, 600, 120, 170);
  shape(c, () => rrect(c, 120, 600, 840, 44, 8), COL.wood); shade(c, () => rrect(c, 120, 600, 840, 44, 8), COL.woodDk, 0, 22);
  for (const x of [230, 790]) shape(c, () => polyP(c, [[x, 644], [x + 70, 644], [x, 720]]), COL.woodDk);
};
// expl.0 · a row of things falling side by side; the feather is still high up
const x0 = (c: Ctx) => {
  ground(c); floor(c, 820);
  spoon(c, 170, 560, Math.PI / 2, 1.1); lemon(c, 380, 600, 60); cap(c, 570, 580, 52); rice(c, 760, 600, 26, 5); feather(c, 900, 360, 1.1, 170);
  for (const x of [240, 450, 640, 830]) arrow(c, [[x, 680], [x, 790]], RED, 8);
  arrow(c, [[960, 560], [1000, 620], [960, 690], [990, 760]], RED, 8);
};
// expl.1 · the mother's hand slides the book out; the tumbler drops onto the cushion
const x1 = (c: Ctx) => {
  ground(c); floor(c, 800);
  cushion(c, 500, 900, 520, 130);
  book(c, 770, 520, 300);
  hand(c, 900, 520, Math.PI, 1.2, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[700, 430], [900, 430]]);
  tumbler(c, 420, 620, 120, 170);
  arrow(c, [[310, 520], [310, 760]]);
};

export const ic_gravityFallingL1 = cards("sci.gravity.falling.L1", [
  se1_0, se1_1, se1_2, se1_3, se2_0, se2_1, se2_2, // 0-6 set-up
  fe1, fe2, fa1, fa2, fa3, fp1, // 7-12 flow
  t0, t2, x0, x1, // 13-16 term.0 term.2 expl.0 expl.1
]);
