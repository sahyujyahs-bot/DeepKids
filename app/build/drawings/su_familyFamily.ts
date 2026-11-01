import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, WHITE, RED, BG, D, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, ground, cards } from "./flatKit";

// FAMILY WORK · set-up cards for sci.family.family.L3 (time and fair share of home jobs).
const WALL = "#f8e6bd", FLOOR = "#d9b98a", MAT = "#a5dcd5", MATDK = "#82c6bd", GRAN = "#d9d4cc";

// a round clock face: hour and minute hands as angles (clockwise from 12); wedge = shaded quarter-hour pie
const clk = (c: Ctx, x: number, y: number, r: number, hA: number, mA: number, wedge = false) => {
  shadow(c, x + r * 0.12, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  if (wedge) { c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.88, -Math.PI / 2, 0); c.closePath(); c.fillStyle = COL.yellow; c.fill(); }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78], [x + Math.sin(a) * r * 0.9, y - Math.cos(a) * r * 0.9]], Math.max(3, r * 0.045)); }
  line(c, [[x, y], [x + Math.sin(hA) * r * 0.5, y - Math.cos(hA) * r * 0.5]], Math.max(5, r * 0.08));
  line(c, [[x, y], [x + Math.sin(mA) * r * 0.74, y - Math.cos(mA) * r * 0.74]], Math.max(4, r * 0.055));
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
// a round face dot for a family member
const faceDot = (c: Ctx, x: number, y: number, r: number, skin: string, hair: string, bun = false) => {
  if (bun) shape(c, () => ell(c, x, y - r * 1.05, r * 0.38, r * 0.38), hair, 4);
  shape(c, () => ell(c, x, y, r, r), skin, 5);
  shape(c, () => { c.moveTo(x - r, y - r * 0.05); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r, y - r * 0.05); c.quadraticCurveTo(x, y - r * 0.6, x - r, y - r * 0.05); c.closePath(); }, hair, 4);
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.2, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.2, r * 0.09, r * 0.12), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.42, r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const PEOPLE = [
  (c: Ctx, x: number, y: number, r: number) => faceDot(c, x, y, r, SKIN.child, CLOTH.hair),
  (c: Ctx, x: number, y: number, r: number) => faceDot(c, x, y, r, SKIN.adult, CLOTH.hair, true),
  (c: Ctx, x: number, y: number, r: number) => faceDot(c, x, y, r, SKIN.adult, GRAN, true),
];

// a T-shirt seen from above, centre (x, y), width w, turned by rot
const tshirt = (c: Ctx, x: number, y: number, w: number, col: string, dk: string, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); const u = w / 100;
  const P = [[-22, -45], [-9, -40], [9, -40], [22, -45], [50, -22], [38, -2], [24, -12], [24, 45], [-24, 45], [-24, -12], [-38, -2], [-50, -22]].map(([a, b]) => [a * u, b * u]);
  shadow(c, 10 * u, 50 * u, 46 * u, 8 * u);
  shape(c, () => polyP(c, P), col, 6); shade(c, () => polyP(c, P), dk, 14 * u, 6 * u);
  c.beginPath(); c.ellipse(0, -40 * u, 11 * u, 7 * u, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.restore();
};
// a folded shirt: a thick rounded slab
const folded = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.3), col, 6);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.3), dk, w * 0.06, h * 0.2);
  line(c, [[x - w * 0.3, y - h * 0.15], [x + w * 0.3, y - h * 0.15]], 4, dk);
};
const SHIRTS: [string, string][] = [[COL.orange, "#d27c25"], [COL.blue, COL.blueDk], [COL.yellow, "#d9ae2e"], [COL.pink, "#d17a97"], [COL.purple, "#6a4fa8"], [COL.red, "#b83d2a"], [COL.paper, "#d8cfbd"]];
// the mat the clothes lie on, from above
const mat = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 480, 36);
  shape(c, () => rrect(c, 50, 50, 980, 960, 44), MAT, 7);
  c.save(); c.beginPath(); rrect(c, 50, 50, 980, 960, 44); c.clip();
  for (let y = 110; y < 1010; y += 70) line(c, [[50, y], [1030, y]], 5, MATDK);
  c.restore();
  shape(c, () => rrect(c, 50, 50, 980, 960, 44), "rgba(0,0,0,0)", 7);
};
// a phone lying on the mat showing a stopwatch: hand angle, and the time as digits
const phone = (c: Ctx, x: number, y: number, s: number, ang: number, time: string, running = true) => {
  c.save(); c.translate(x, y); c.rotate(-0.06); c.scale(s, s);
  shadow(c, 18, 240, 120, 20);
  shape(c, () => rrect(c, -125, -235, 250, 470, 34), COL.black, 7);
  shape(c, () => rrect(c, -108, -205, 216, 410, 16), "#22303a", 4);
  shape(c, () => rrect(c, -14, -222, 28, 8, 4), COL.greyDk, 0);
  shape(c, () => rrect(c, -16, -128, 32, 22, 6), COL.steelDk, 4);
  shape(c, () => ell(c, 0, -30, 88, 88), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[Math.sin(a) * 68, -30 - Math.cos(a) * 68], [Math.sin(a) * 78, -30 - Math.cos(a) * 78]], 4); }
  if (running) { c.beginPath(); c.moveTo(0, -30); c.arc(0, -30, 70, -Math.PI / 2, ang - Math.PI / 2); c.closePath(); c.fillStyle = COL.yellow; c.fill(); }
  line(c, [[0, -30], [Math.sin(ang) * 66, -30 - Math.cos(ang) * 66]], 7, RED);
  shape(c, () => ell(c, 0, -30, 7, 7), INK, 0);
  write(c, time, -52, 100, 56, "#c9f06b", 8);
  c.restore();
};

// ---- e1 (Writing the jobs): what each card shows ----
// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[0, 0], [D, 0], [D, 800], [0, 800]]), WALL, 0);
  shape(c, () => polyP(c, [[0, 800], [D, 800], [D, D], [0, D]]), FLOOR, 0);
  line(c, [[0, 800], [D, 800]], 6);
  // wall clock, big
  clk(c, 600, 215, 150, Math.PI * 0.2, Math.PI * 1.0);
  // grandmother at the stove, behind it
  person(c, 870, 810, 520, { adult: true, armL: [Math.PI * 0.4, Math.PI * 0.2], armR: [Math.PI * 0.4, Math.PI * 0.8] });
  shape(c, () => rrect(c, 670, 640, 380, 170, 14), COL.teal, 6); shade(c, () => rrect(c, 670, 640, 380, 170, 14), COL.tealDk, 24, 0);
  shape(c, () => rrect(c, 670, 625, 380, 30, 10), COL.steelDk, 6);
  for (const kx of [740, 810]) shape(c, () => ell(c, kx, 720, 22, 22), COL.steelIn, 5);
  shape(c, () => rrect(c, 840, 590, 140, 50, 12), COL.steel, 6); shape(c, () => ell(c, 910, 590, 70, 14), COL.steelIn, 5);
  for (const sx of [880, 930]) line(c, [[sx, 560], [sx - 14, 520], [sx + 14, 480]], 6, WHITE);
  // girl at the table with a notebook, looking up at the clock
  person(c, 270, 880, 560, { armR: [0.9, -0.35], armL: [1.3, 0.1] });
  shape(c, () => rrect(c, 40, 735, 640, 40, 10), COL.wood, 6);
  for (const lx of [80, 620]) shape(c, () => rrect(c, lx, 770, 28, 130, 6), COL.woodDk, 6);
  shape(c, () => polyP(c, [[330, 738], [590, 738], [620, 700], [360, 700]]), WHITE, 6);
  for (const ly of [712, 725]) line(c, [[385, ly], [585, ly]], 3, COL.glassEdge);
  line(c, [[470, 728], [510, 700]], 13, INK); line(c, [[470, 728], [510, 700]], 8, COL.yellow); line(c, [[470, 728], [468, 731]], 9, INK);
  arrow(c, [[320, 440], [400, 360], [470, 300]], RED, 9);
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 440, 30);
  shape(c, () => rrect(c, 110, 60, 860, 940, 26), WHITE, 7);
  shape(c, () => rrect(c, 70, 60, 60, 940, 14), COL.teal, 7);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 100, 150 + i * 160, 12, 12), BG, 4);
  for (const y of [260, 480, 700, 920]) line(c, [[170, y], [940, y]], 5);
  line(c, [[170, 100], [940, 100]], 5);
  for (const x of [330, 675]) line(c, [[x, 100], [x, 920]], 5);
  // headers: a clock at the start, a clock at the end, the minutes
  clk(c, 440, 180, 62, Math.PI * 0.3, Math.PI * 1.0);
  clk(c, 580, 180, 62, Math.PI * 0.6, Math.PI * 0.5);
  clk(c, 800, 180, 62, 0, 0, true);
  shape(c, () => rrect(c, 690, 270, 240, 640, 14), "#fff0b8", 0);
  const rows: [string, string, string][] = [["6 30", "7 15", "45"], ["7 00", "7 30", "30"], ["5 45", "6 45", "60"]];
  rows.forEach(([a, b, m], i) => {
    const y = 370 + i * 220;
    PEOPLE[i](c, 250, y, 62);
    write(c, a, 345, y - 25, 50, INK, 8);
    write(c, b, 520, y - 25, 50, INK, 8);
    write(c, m, 745, y - 40, 80, RED, 11);
  });
  // a pencil writing in the last cell
  line(c, [[880, 880], [1010, 760]], 24, INK); line(c, [[880, 880], [1010, 760]], 16, COL.yellow);
  shape(c, () => polyP(c, [[864, 896], [880, 880], [892, 892]]), COL.wood, 4);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 440, 36);
  shape(c, () => rrect(c, 70, 90, 940, 900, 26), WHITE, 7);
  for (let y = 150; y < 980; y += 50) line(c, [[70, y], [1010, y]], 2, COL.sky);
  // key: one clock = 15
  shape(c, () => rrect(c, 330, 120, 420, 130, 20), "#fff0b8", 5);
  clk(c, 400, 185, 52, 0, 0, true);
  write(c, "15", 500, 150, 70, INK, 9);
  const counts = [3, 2, 4];
  counts.forEach((n, i) => {
    const y = 420 + i * 220;
    PEOPLE[i](c, 160, y, 60);
    line(c, [[240, y + 100], [980, y + 100]], 4, COL.greyDk);
    for (let k = 0; k < n; k++) clk(c, 330 + k * 160, y, 62, 0, 0, true);
  });
};

// ---- e2 (Folding clothes) ----
// setup.e2.0
const e2s0 = (c: Ctx) => {
  mat(c);
  const pos: [number, number, number][] = [[-70, 70, -0.5], [60, 80, 0.6], [-30, -20, 0.2], [70, -10, -0.7], [0, 50, 0.1], [-40, 100, 2.6], [40, 20, -1.2]];
  pos.forEach(([dx, dy, r], i) => tshirt(c, 360 + dx * 1.2, 630 + dy * 1.2, 340, SHIRTS[i][0], SHIRTS[i][1], r));
  // the count on a tag
  shape(c, () => rrect(c, 250, 160, 230, 120, 24), WHITE, 6);
  write(c, "20", 295, 185, 70, INK, 10);
  phone(c, 810, 580, 1, 0, "0 00", false);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  mat(c);
  tshirt(c, 400, 600, 440, SHIRTS[1][0], SHIRTS[1][1]);
  hand(c, 120, 600, 0, 1.4, SKIN.child, CLOTH.child, true);
  hand(c, 760, 600, Math.PI, 1.4, SKIN.child, CLOTH.child, true);
  arrow(c, [[170, 440], [260, 380], [360, 380]], RED, 11);
  arrow(c, [[630, 440], [540, 380], [440, 380]], RED, 11);
  phone(c, 850, 260, 0.7, 2.0, "0 20");
  [0, 1].forEach((i) => folded(c, 850, 930 - i * 62, 220, 60, SHIRTS[i + 2][0], SHIRTS[i + 2][1]));
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  mat(c);
  tshirt(c, 300, 400, 260, SHIRTS[1][0], SHIRTS[1][1]);
  tshirt(c, 780, 400, 260, SHIRTS[2][0], SHIRTS[2][1]);
  tshirt(c, 540, 700, 260, SHIRTS[3][0], SHIRTS[3][1]);
  hand(c, 130, 400, 0, 1.4, SKIN.child, CLOTH.child, true);
  hand(c, 920, 400, Math.PI, 1.4, SKIN.adult, CLOTH.adult, true);
  hand(c, 540, 930, -Math.PI / 2, 1.4, SKIN.adult, COL.pink, true);
  [0, 1, 2, 3, 4].forEach((i) => folded(c, 540, 460 - i * 34, 190, 52, SHIRTS[i][0], SHIRTS[i][1]));
  phone(c, 180, 810, 0.55, 3.6, "0 10");
};

export const su_familyFamily = cards("sci.family.family.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2]);
