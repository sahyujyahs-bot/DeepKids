import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// EXERCISE AND REST · set-up cards. One spring clothes peg, one stopwatch, one child, one grown-up.
const PALE = "#d8b392", FLUSH = "#cf6a55", WALL_DAY = "#f6e7c1", WALL_NIGHT = "#8a8cc4";

// numbers centred on (cx, cy)
const writeC = (c: Ctx, t: string, cx: number, cy: number, h: number, col: string = INK, w = 6) => write(c, t, cx - ((t.length - 1) * 0.8 * h + 0.6 * h) / 2, cy - h / 2, h, col, w);
const limb = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };

// a wooden spring clothes peg lying along x, centre at the origin; t = 0 relaxed (jaws shut), 1 squeezed (handles touch, jaws open)
const pegShape = (c: Ctx, t: number) => {
  const hc = 44 - 24 * t, jc = 20 + 24 * t;
  for (const g of [1, -1]) {
    const pts = [[-150, -g * hc], [0, 0], [150, g * jc]];
    line(c, pts, 50, INK); line(c, pts, 38, COL.wood); line(c, [[-150, -g * hc + 12], [0, 12], [150, g * jc + 12]], 9, COL.woodDk);
  }
  shape(c, () => ell(c, -40, 0, 26, 26), COL.steel, 5);
  line(c, [[-56, -10], [-24, -10]], 4, COL.steelDk); line(c, [[-56, 4], [-24, 4]], 4, COL.steelDk); line(c, [[-56, 16], [-24, 16]], 4, COL.steelDk);
};
// a hand pinching the handles of the peg: peg centre at (x, y), the arm coming from the direction an+180°
const pinchPeg = (c: Ctx, x: number, y: number, an: number, s: number, t: number, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  const hc = 44 - 24 * t, dk = skin === SKIN.child ? SKIN.childDk : SKIN.adultDk;
  pegShape(c, t);
  shape(c, () => rrect(c, -430, -88, 120, 176, 20), sleeve, 6);
  shape(c, () => ell(c, -255, 0, 88, 90), skin, 6);
  limb(c, [[-270, 100], [-205, 135], [-165, 120]], 40, skin);
  limb(c, [[-290, -62], [-215, -92], [-140, -hc - 14]], 46, skin);
  limb(c, [[-290, 62], [-215, 92], [-140, hc + 14]], 46, skin);
  line(c, [[-250, -10], [-225, 10]], 4, dk);
  c.restore();
};
const stopwatch = (c: Ctx, x: number, y: number, r: number, label: string, wedge = Math.PI * 2) => {
  shadow(c, x + r * 0.12, y + r + 4, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - 20, y - r - 38, 40, 40, 8), COL.steelDk);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.76, -Math.PI / 2, -Math.PI / 2 + wedge); c.closePath(); c.fillStyle = "rgba(243,154,60,0.55)"; c.fill();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], 4); }
  writeC(c, label, x, y + 4, r * 0.7, INK, 8);
};
const peg = (c: Ctx, x: number, y: number, s: number, t: number) => { c.save(); c.translate(x, y); c.scale(s, s); pegShape(c, t); c.restore(); };
const phone = (c: Ctx, x: number, y: number, w: number, h: number, label: string) => {
  shadow(c, x + w * 0.1, y + h / 2 + 8, w * 0.55, 16);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 30), INK, 5);
  shape(c, () => rrect(c, x - w / 2 + 14, y - h / 2 + 22, w - 28, h - 44, 14), "#22303a", 3);
  c.beginPath(); c.arc(x, y, w * 0.38, 0, Math.PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 8; c.stroke();
  writeC(c, label, x, y + 4, w * 0.36, "#c9f06b", 9);
};
const stool = (c: Ctx, x: number, top: number, w: number, floor: number) => {
  shadow(c, x + 20, floor + 4, w * 0.6, 16);
  for (const s of [-1, 1]) { line(c, [[x + s * w * 0.36, top + 30], [x + s * w * 0.44, floor]], 26, INK); line(c, [[x + s * w * 0.36, top + 30], [x + s * w * 0.44, floor]], 16, COL.brown); }
  shape(c, () => rrect(c, x - w / 2, top, w, 36, 10), COL.wood);
};
const room = (c: Ctx, night: boolean) => {
  ground(c, night ? WALL_NIGHT : WALL_DAY);
  c.fillStyle = night ? "#6a5a7a" : "#d9a766"; c.fillRect(0, 930, D, 150);
  line(c, [[0, 930], [D, 930]], 6);
};
const feet = (c: Ctx, x: number, y: number, h: number) => { for (const s of [-1, 1]) shape(c, () => ell(c, x + s * h * 0.075 + 12, y + 6, h * 0.05, h * 0.024), SKIN.child, 5); };
const book = (c: Ctx, x1: number, x2: number, y: number) => {
  shape(c, () => rrect(c, x1, y - 38, x2 - x1, 38, 6), COL.teal);
  shape(c, () => rrect(c, x1 + 10, y - 30, x2 - x1 - 20, 22, 3), COL.paper, 3);
};
const pencil = (c: Ctx, tx: number, ty: number, bx: number, by: number) => {
  const a = Math.atan2(by - ty, bx - tx), L = Math.hypot(bx - tx, by - ty), nx = -Math.sin(a), ny = Math.cos(a), cp = 0.14 * L;
  const at = (u: number, v: number) => [tx + Math.cos(a) * u + nx * v, ty + Math.sin(a) * u + ny * v];
  shape(c, () => polyP(c, [at(cp, -16), at(L, -16), at(L, 16), at(cp, 16)]), COL.yellow);
  shape(c, () => polyP(c, [at(0, 0), at(cp, -16), at(cp, 16)]), COL.wood);
  shape(c, () => polyP(c, [at(0, 0), at(cp * 0.4, -6), at(cp * 0.4, 6)]), INK, 0);
};
const pencilMark = (c: Ctx, x1: number, x2: number, y: number, col = "#5d576b") => line(c, [[x1, y], [x2, y]], 7, col);
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 7, INK); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const moon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.arc(x, y, r, 0, Math.PI * 2); }, COL.yellow);
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip(); c.beginPath(); c.arc(x + r * 0.55, y - r * 0.2, r * 0.9, 0, Math.PI * 2); c.fillStyle = "#3c3f73"; c.fill(); c.restore();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const star = (c: Ctx, x: number, y: number, r: number) => shape(c, () => polyP(c, [[x, y - r], [x + r * 0.3, y - r * 0.3], [x + r, y], [x + r * 0.3, y + r * 0.3], [x, y + r], [x - r * 0.3, y + r * 0.3], [x - r, y], [x - r * 0.3, y - r * 0.3]]), COL.yellow, 4);
const window_ = (c: Ctx, night: boolean) => {
  shape(c, () => rrect(c, 760, 30, 230, 150, 10), night ? "#2e2f5e" : COL.sky, 6);
  if (night) { moon(c, 840, 105, 40); star(c, 920, 70, 14); star(c, 945, 135, 10); star(c, 890, 150, 8); } else sun(c, 870, 105, 36);
  line(c, [[875, 30], [875, 180]], 6);
};
// the child against the wall, a book flat on her head; returns the top of her head
const headTop = (y: number, h: number) => y - 1.0225 * h + 18;
const wallHeight = (c: Ctx, night: boolean, h: number, sleepy: boolean) => {
  const x = 380, y = 1000;
  room(c, night); window_(c, night);
  shadow(c, x + 14, y + 6, 130, 18);
  person(c, x, y, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] }); feet(c, x, y, h);
  if (sleepy) {
    const head = 0.13 * h, hy = y - 0.74 * h - head * 1.05;
    for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.2, head * 0.22), SKIN.child, 0); c.beginPath(); c.arc(x + s * head * 0.35, hy + head * 0.08, head * 0.16, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  }
  return headTop(y, h);
};
const pencilHandAndBook = (c: Ctx, top: number, lineEnd: number) => {
  book(c, 200, 620, top);
  // grown-up's hand from the right holds the book's end
  limb(c, [[681, top - 19], [1100, top - 19]], 82, CLOTH.adult);
  hand(c, 681, top - 19, Math.PI, 1.2, SKIN.adult, CLOTH.adult);
  // the other hand holds the pencil, its tip on the wall
  const tx = lineEnd, ty = top, bx = tx + 134, by = ty - 268;
  pencil(c, tx, ty, bx, by);
  limb(c, [[60, -60], [107, 100]], 82, CLOTH.adult);
  hand(c, 107, 100, 0.5, 1.2, SKIN.adult, CLOTH.adult);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 640, 880, 360, 28);
  pinchPeg(c, 760, 520, 0, 1.4, 1);
  arrow(c, [[660, 290], [660, 400]]); arrow(c, [[660, 750], [660, 640]]);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  pinchPeg(c, 560, 270, 0, 1, 0.7);
  phone(c, 850, 520, 260, 470, "30");
  limb(c, [[850, 1120], [850, 860]], 120, CLOTH.adult);
  hand(c, 850, 860, -Math.PI / 2, 1.6, SKIN.adult, CLOTH.adult);
  // paper table: five rounds, counts written for the first three
  shadow(c, 340, 960, 300, 20);
  shape(c, () => rrect(c, 60, 520, 560, 420, 8), COL.paper, 6);
  for (let i = 1; i < 5; i++) line(c, [[60 + i * 112, 520], [60 + i * 112, 940]], 4);
  line(c, [[60, 650], [620, 650]], 4);
  for (let i = 0; i < 5; i++) writeC(c, String(i + 1), 116 + i * 112, 585, 44, INK, 6);
  ["40", "36", "31"].forEach((t, i) => writeC(c, t, 116 + i * 112, 790, 56, COL.blueDk, 8));
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[0, 800], [D, 800], [D, D], [0, D]]), COL.wood, 0); line(c, [[0, 800], [D, 800]], 6);
  shadow(c, 330, 806, 300, 30);
  hand(c, 260, 700, 0, 2.8, SKIN.child, CLOTH.child, true);
  stopwatch(c, 800, 600, 180, "2", Math.PI * 2 * (2 / 5));
  peg(c, 420, 920, 0.6, 0);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  hand(c, 300, 800, -Math.PI / 2, 2.8, PALE, CLOTH.child, true);
  hand(c, 780, 280, Math.PI / 2, 2.8, FLUSH, CLOTH.child, true);
  arrow(c, [[300, 480], [300, 230]]); arrow(c, [[780, 610], [780, 860]]);
};
const standWall = (c: Ctx, armUp: boolean) => {
  const x = 420, y = 1000, h = 600;
  room(c, false);
  stool(c, 850, 700, 190, 1000); stopwatch(c, 850, 590, 105, "1");
  shadow(c, x + 14, y + 6, 120, 18);
  person(c, x, y, h, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: armUp ? [-Math.PI / 2, -Math.PI / 2] : [Math.PI / 2, Math.PI / 2] }); feet(c, x, y, h);
  const sh = y - 0.74 * h + 0.03 * h, wy = armUp ? sh - 0.33 * h : sh + 0.33 * h, wx = x + 0.11 * h, d = armUp ? -1 : 1;
  pinchPeg(c, wx, wy + d * 285 * 0.55, d * Math.PI / 2, 0.55, 1);
};
// setup.e2.1
const e2_1 = (c: Ctx) => standWall(c, false);
// setup.e2.2
const e2_2 = (c: Ctx) => { standWall(c, true); };
// setup.e3.0
const e3_0 = (c: Ctx) => {
  const top = wallHeight(c, true, 720, false);
  pencilHandAndBook(c, top, 150);
  for (const dy of [-6, 0, 5]) pencilMark(c, 40 + Math.abs(dy), 150, top + dy);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  const top = wallHeight(c, false, 745, true);
  pencilMark(c, 40, 170, top + 31, "#b5ad9f");
  pencilHandAndBook(c, top, 150);
  pencilMark(c, 40, 150, top);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, WALL_DAY);
  pencilMark(c, 180, 700, 560); pencilMark(c, 180, 700, 480);
  moon(c, 100, 560, 34); sun(c, 100, 480, 26);
  // the tape, shown close up: a number for every centimetre
  shadow(c, 790, 1010, 120, 16);
  shape(c, () => polyP(c, [[700, 1000], [700, 190], [716, 150], [884, 150], [900, 190], [900, 1000]]), COL.yellow);
  c.fillStyle = "rgba(215,55,43,0.35)"; c.fillRect(702, 480, 196, 80);
  for (let n = 2; n <= 10; n++) { const yy = 960 - (n - 1) * 80; line(c, [[700, yy], [760, yy]], 5); line(c, [[700, yy + 40], [735, yy + 40]], 4); writeC(c, String(n), 830, yy, 40, INK, 6); }
  shape(c, () => rrect(c, 680, 940, 240, 100, 30), COL.teal);
  arrow(c, [[660, 560], [660, 490]], RED, 9);
};

export const su_healthExerciseAndRest = cards("sci.health.exercise-and-rest.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
