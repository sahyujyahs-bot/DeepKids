import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, cards } from "./flatKit";

// sci.food.where-food-comes-from.L3 set-up cards: curd in three katoris (e1) and the iodine starch test (e3).

const MILK = "#fffaf0", MILKDK = "#e6dcc2", CURD = "#fae6a0", CURDDK = "#e3c46c", IODINE = "#d9822b", BLUEBLACK = "#262658", NOSTARCH = "#c0702c";

// ---------------------------------------------------------------- shared things
// a capital letter A, B or C as strokes (a label, not a word)
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 8) => {
  const P: Record<string, number[][][]> = {
    A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.65], [0.5, 0.65]]],
    B: [[[0, 0], [0, 1], [0.35, 1], [0.58, 0.8], [0.35, 0.52], [0, 0.52]], [[0.35, 0.52], [0.52, 0.28], [0.32, 0], [0, 0]]],
    C: [[[0.58, 0.15], [0.3, 0], [0.05, 0.3], [0.05, 0.7], [0.3, 1], [0.58, 0.85]]],
  };
  P[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
};
// a small paper tag with a letter, centre (x, y)
const tag = (c: Ctx, x: number, y: number, ch: string, s = 1) => {
  shadow(c, x + 10 * s, y + 52 * s, 56 * s, 10 * s);
  shape(c, () => rrect(c, x - 55 * s, y - 50 * s, 110 * s, 100 * s, 14 * s), COL.paper, 5);
  letter(c, ch, x - 0.3 * 66 * s, y - 33 * s, 66 * s, INK, 9 * s);
};
// steam curls rising
const steam = (c: Ctx, x: number, y: number, h: number) => {
  for (const dx of [-34, 0, 34]) {
    const pts: number[][] = [];
    for (let i = 0; i <= 12; i++) pts.push([x + dx + Math.sin(i * 0.9 + dx) * 12, y - (i / 12) * h * (dx === 0 ? 1 : 0.8)]);
    line(c, pts, 9, "#c6bfd8");
  }
};
// a steel katori of warm milk (rim centre x, y)
const milkKatori = (c: Ctx, x: number, y: number, r: number) => {
  bowl(c, x, y, r, COL.steelIn);
  shape(c, () => ell(c, x, y + r * 0.015, r * 0.88, r * 0.145), MILK, 3);
  line(c, [[x - r * 0.5, y - r * 0.01], [x - r * 0.2, y + r * 0.05]], 5, MILKDK);
};
// curd heaped in a katori
const curdHeap = (c: Ctx, x: number, y: number, r: number) => {
  const path = () => { c.moveTo(x - r * 0.86, y + r * 0.03); c.bezierCurveTo(x - r * 0.7, y - r * 0.5, x + r * 0.7, y - r * 0.5, x + r * 0.86, y + r * 0.03); c.quadraticCurveTo(x, y + r * 0.24, x - r * 0.86, y + r * 0.03); c.closePath(); };
  shape(c, path, CURD, 5);
  shade(c, path, CURDDK, r * 0.2, r * 0.05, 0.7);
  line(c, [[x - r * 0.4, y - r * 0.12], [x - r * 0.2, y - r * 0.02]], 4, CURDDK); line(c, [[x + r * 0.15, y - r * 0.2], [x + r * 0.4, y - r * 0.08]], 4, CURDDK);
};
const katoriOfCurd = (c: Ctx, x: number, y: number, r: number) => { milkKatori(c, x, y, r); curdHeap(c, x, y, r); };
// a steel spoon: bowl end at (hx, hy), handle going to (tx, ty)
const spoon = (c: Ctx, hx: number, hy: number, tx: number, ty: number, curd = false) => {
  line(c, [[hx, hy], [tx, ty]], 26, INK); line(c, [[hx, hy], [tx, ty]], 15, COL.steel);
  const an = Math.atan2(ty - hy, tx - hx);
  shape(c, () => ell(c, hx, hy, 50, 34, an), COL.steel, 6);
  shape(c, () => ell(c, hx, hy, 36, 22, an), curd ? CURD : COL.steelIn, 4);
};
const table = (c: Ctx, y: number) => { c.fillStyle = "#e6d6b8"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- curd (e1)
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  [185, 540, 895].forEach((x, i) => { steam(c, x, 250, 150); milkKatori(c, x, 360, 150); tag(c, x, 610, "ABC"[i]); });
  katoriOfCurd(c, 330, 860, 135);
  spoon(c, 650, 900, 960, 820, true);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  milkKatori(c, 150, 230, 95); tag(c, 150, 380, "B", 0.8);
  katoriOfCurd(c, 395, 230, 95); tag(c, 395, 380, "C", 0.8);
  tag(c, 90, 840, "A");
  const ax = 430, ay = 760, ar = 270;
  milkKatori(c, ax, ay, ar);
  // the curd stirred in: a pale dollop and swirls
  c.beginPath(); ell(c, ax - 20, ay + 6, 120, 20); c.fillStyle = CURD; c.fill();
  line(c, [[ax - 190, ay + 6], [ax - 110, ay + 16], [ax - 60, ay + 8]], 6, CURDDK);
  line(c, [[ax + 80, ay - 4], [ax + 170, ay + 4]], 6, MILKDK);
  const hx = ax, hy = ay + 4;
  spoon(c, hx, hy, 780, 380, true);
  hand(c, 825, 306, 2.05, 2, SKIN.child, CLOTH.child);
  const pts: number[][] = [];
  for (let t = 0.0; t <= 0.8; t += 0.05) pts.push([hx - Math.cos(Math.PI * t) * 215, hy + 20 + Math.sin(Math.PI * t) * 36]);
  arrow(c, pts, RED, 12);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, "#fde7bf");
  // right half: inside of a fridge
  shape(c, () => rrect(c, 580, 60, 460, 960, 24), "#e9f1f7", 7);
  shape(c, () => rrect(c, 612, 92, 396, 896, 14), "#cfe6f5", 5);
  const shelf = (y: number) => { shape(c, () => rrect(c, 612, y, 396, 26, 6), COL.steel, 5); };
  shelf(580); shelf(860);
  // a snowflake
  for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[810 - Math.cos(a) * 70, 250 - Math.sin(a) * 70], [810 + Math.cos(a) * 70, 250 + Math.sin(a) * 70]], 10, COL.blue); }
  milkKatori(c, 810, 500, 130);
  tag(c, 810, 740, "C", 0.9);
  // left half: a warm corner with a sunny window and a counter
  shape(c, () => rrect(c, 90, 90, 300, 300, 18), COL.sky, 6);
  shape(c, () => ell(c, 240, 240, 62, 62), COL.yellow, 6);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.4; line(c, [[240 + Math.cos(a) * 85, 240 + Math.sin(a) * 85], [240 + Math.cos(a) * 118, 240 + Math.sin(a) * 118]], 9, COL.orange); }
  line(c, [[240, 90], [240, 390]], 6); line(c, [[90, 240], [390, 240]], 6);
  shape(c, () => rrect(c, 0, 660, 560, 480, 0), COL.wood, 6);
  shade(c, () => rrect(c, 0, 660, 560, 480, 0), COL.woodDk, 0, 70, 0.5);
  milkKatori(c, 150, 590, 120); milkKatori(c, 410, 590, 120);
  tag(c, 150, 840, "A", 0.9); tag(c, 410, 840, "B", 0.9);
  line(c, [[580, 40], [580, 1040]], 8, INK);
};

// a katori tilted by th (clockwise), milk stays level; curd keeps its heap
const tilted = (c: Ctx, cx: number, cy: number, r: number, th: number, curd: boolean) => {
  const body = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r * 0.9, r * 0.75, r * 0.9, r * 0.75, r, 0); c.closePath(); };
  const ry = r * 0.42;
  c.save(); c.translate(cx, cy); c.rotate(th);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, 0, 0, r, ry), COL.steelDk, 5);
  if (curd) {
    const heap = () => { c.moveTo(-r * 0.88, 0); c.bezierCurveTo(-r * 0.75, -r * 0.62, r * 0.75, -r * 0.62, r * 0.88, 0); c.quadraticCurveTo(0, ry * 0.9, -r * 0.88, 0); c.closePath(); };
    shape(c, heap, CURD, 5); shade(c, heap, CURDDK, r * 0.18, r * 0.06, 0.7);
  } else {
    c.save(); c.beginPath(); ell(c, 0, 0, r * 0.95, ry * 0.92); c.clip(); c.rotate(-th); c.fillStyle = MILK; c.fillRect(-500, r * 0.12, 1000, 500); c.restore();
    c.beginPath(); ell(c, 0, 0, r, ry); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  }
  c.restore();
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  table(c, 905);
  const th = 0.72, r = 165, cy = 380, lx = 330, rx = 800;
  const mx = lx + Math.cos(th) * r * 0.98, my = cy + Math.sin(th) * r * 0.98;
  // runny milk on the left: a stream out of the lip and a puddle
  c.beginPath(); ell(c, mx + 40, 960, 200, 34); c.fillStyle = MILK; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  shape(c, () => { c.moveTo(mx - 10, my - 12); c.bezierCurveTo(mx + 50, my - 6, mx + 62, my + 80, mx + 56, 950); c.lineTo(mx + 22, 950); c.bezierCurveTo(mx + 26, my + 100, mx + 20, my + 40, mx - 14, my + 22); c.closePath(); }, MILK, 5);
  tilted(c, lx, cy, r, th, false);
  hand(c, 194, 608, -1.0, 2, SKIN.child, CLOTH.child);
  // set curd on the right: the heap stays, nothing falls
  tilted(c, rx, cy, r, th, true);
  hand(c, 704, 608, -1.0, 2, SKIN.child, CLOTH.child);
};

// ---------------------------------------------------------------- iodine on foods (e3)
const pile = (c: Ctx, rx: number, ry: number, base: string, dot: string, seedN: number, n: number, rot = false) => {
  shape(c, () => { c.moveTo(-rx, 8); c.bezierCurveTo(-rx * 0.7, -ry * 1.6, rx * 0.7, -ry * 1.6, rx, 8); c.quadraticCurveTo(0, ry * 0.6, -rx, 8); c.closePath(); }, base, 5);
  let s = seedN;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < n; i++) {
    const u = r(), v = r(), x = (u * 2 - 1) * rx * 0.72, top = -Math.sin(Math.acos(Math.min(1, Math.abs(x) / rx))) * ry * 1.05, y = top * 0.55 + v * 20 - 4;
    if (rot) shape(c, () => ell(c, x, y, 11, 5.5, r() * 3), WHITE, 2.5); else shape(c, () => ell(c, x, y, 5, 5), dot, 0);
  }
};
const potato = (c: Ctx) => {
  shape(c, () => ell(c, 0, 0, 90, 62, -0.1), "#b98a4e", 5);
  shape(c, () => ell(c, 0, -2, 77, 50, -0.1), "#f6e3ae", 3);
  shade(c, () => ell(c, 0, 0, 90, 62, -0.1), "#a07838", 18, 12, 0.35);
  for (const [x, y] of [[-30, -12], [24, 10], [-6, 24], [34, -22]]) shape(c, () => ell(c, x, y, 5, 3.5), "#d7bb7c", 0);
};
const rice = (c: Ctx) => pile(c, 88, 52, "#f3efe6", WHITE, 5, 26, true);
const chapati = (c: Ctx) => {
  shape(c, () => ell(c, 0, 0, 94, 64), "#e8b87a", 5);
  shade(c, () => ell(c, 0, 0, 94, 64), "#c88b4c", 18, 14, 0.4);
  for (const [x, y, s] of [[-40, -14, 11], [20, -24, 9], [38, 12, 12], [-14, 18, 10], [-58, 14, 7]]) shape(c, () => ell(c, x, y, s, s * 0.7), "#9a5b2a", 0);
};
const banana = (c: Ctx) => {
  const p = () => { c.moveTo(0, -62); c.bezierCurveTo(30, -62, 86, 30, 70, 50); c.bezierCurveTo(60, 62, -60, 62, -70, 50); c.bezierCurveTo(-86, 30, -30, -62, 0, -62); c.closePath(); };
  shape(c, p, "#7fae4a", 5);
  shape(c, () => { c.save(); c.translate(0, 8); c.scale(0.78, 0.76); p(); c.restore(); }, "#f4efc4", 3);
  for (const [x, y] of [[-14, 14], [0, 24], [14, 14]]) shape(c, () => ell(c, x, y, 4, 4), "#9a8a54", 0);
};
const cucumber = (c: Ctx) => {
  shape(c, () => ell(c, 0, 0, 80, 60), "#4a8a3a", 5);
  shape(c, () => ell(c, 0, 0, 66, 47), "#cfe6a2", 3);
  for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 + 0.3; line(c, [[Math.cos(a) * 14, Math.sin(a) * 10], [Math.cos(a) * 46, Math.sin(a) * 33]], 4, "#a5c97c"); }
};
const paneer = (c: Ctx) => {
  const cube = (x: number, y: number, s: number) => {
    shape(c, () => polyP(c, [[x, y - s], [x + s * 0.95, y - s * 0.5], [x, y], [x - s * 0.95, y - s * 0.5]]), "#fffaf0", 4);
    shape(c, () => polyP(c, [[x - s * 0.95, y - s * 0.5], [x, y], [x, y + s], [x - s * 0.95, y + s * 0.5]]), "#eee3c8", 4);
    shape(c, () => polyP(c, [[x + s * 0.95, y - s * 0.5], [x, y], [x, y + s], [x + s * 0.95, y + s * 0.5]]), "#d6c8a6", 4);
  };
  cube(-30, -8, 44); cube(40, 8, 40);
};
const sugar = (c: Ctx) => pile(c, 80, 48, "#fff6e0", "#d9c7a0", 9, 40);
const salt = (c: Ctx) => pile(c, 80, 48, "#eaf0f8", "#8e9bb0", 13, 40);
const besan = (c: Ctx) => pile(c, 86, 54, "#f2c94c", "#c79a1c", 21, 40);

const FOODS: { draw: (c: Ctx) => void; starch: boolean }[] = [
  { draw: potato, starch: true }, { draw: rice, starch: true }, { draw: chapati, starch: true },
  { draw: banana, starch: true }, { draw: cucumber, starch: false }, { draw: paneer, starch: false },
  { draw: sugar, starch: false }, { draw: salt, starch: false }, { draw: besan, starch: true },
];
const foodSpot = (i: number) => [540 + ((i % 3) - 1) * 262, 530 + (Math.floor(i / 3) - 1) * 210];
const FOODK = 1.25;
const putFood = (c: Ctx, i: number) => { const [x, y] = foodSpot(i); c.save(); c.translate(x, y); c.scale(FOODK, FOODK); shadow(c, 8, 44, 82, 14); FOODS[i].draw(c); c.restore(); };
const bigPlate = (c: Ctx) => {
  shadow(c, 570, 985, 480, 50);
  shape(c, () => ell(c, 540, 530, 500, 470), COL.steel);
  shape(c, () => ell(c, 540, 524, 425, 395), COL.steelIn, 4);
};
// a blotch over a food after the iodine
const blotch = (c: Ctx, x: number, y: number, col: string, k = 1) => {
  shape(c, () => {
    c.moveTo(x - 66 * k, y - 4 * k); c.bezierCurveTo(x - 60 * k, y - 50 * k, x + 20 * k, y - 56 * k, x + 58 * k, y - 26 * k);
    c.bezierCurveTo(x + 84 * k, y + 14 * k, x + 36 * k, y + 52 * k, x - 14 * k, y + 46 * k); c.bezierCurveTo(x - 56 * k, y + 40 * k, x - 72 * k, y + 20 * k, x - 66 * k, y - 4 * k);
  }, col, 3);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); bigPlate(c);
  FOODS.forEach((_, i) => putFood(c, i));
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 860, 520, 175);
  c.save(); c.translate(540, 830); c.scale(2.9, 2.6); potato(c); c.restore();
  // the spot: blue-black in the middle, an orange rim of fresh iodine
  c.save(); c.translate(540, 820);
  shape(c, () => ell(c, 0, 0, 150, 78), IODINE, 4);
  shape(c, () => ell(c, 0, 0, 112, 56), BLUEBLACK, 0);
  c.restore();
  // the dropper
  shape(c, () => ell(c, 540, 150, 62, 74), "#3a3540", 6);
  shine(c, [[505, 120], [500, 165]], 8);
  shape(c, () => rrect(c, 488, 210, 104, 34, 8), COL.steel, 5);
  shape(c, () => { c.moveTo(508, 244); c.lineTo(572, 244); c.lineTo(566, 500); c.lineTo(540, 560); c.lineTo(514, 500); c.closePath(); }, COL.glass, 5);
  shape(c, () => { c.moveTo(512, 370); c.lineTo(568, 370); c.lineTo(566, 500); c.lineTo(540, 556); c.lineTo(514, 500); c.closePath(); }, IODINE, 0);
  c.beginPath(); c.moveTo(508, 244); c.lineTo(572, 244); c.lineTo(566, 500); c.lineTo(540, 560); c.lineTo(514, 500); c.closePath(); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shine(c, [[522, 262], [524, 440]], 7);
  // the falling drop
  shape(c, () => { c.moveTo(540, 592); c.quadraticCurveTo(580, 650, 540, 676); c.quadraticCurveTo(500, 650, 540, 592); c.closePath(); }, IODINE, 5);
  hand(c, 393, 330, 0, 2.1, SKIN.adult, CLOTH.adult);
  arrow(c, [[720, 470], [720, 650]], RED, 12);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c); bigPlate(c);
  FOODS.forEach((f, i) => {
    const [x, y] = foodSpot(i);
    putFood(c, i);
    blotch(c, x, y, f.starch ? BLUEBLACK : NOSTARCH, 0.95);
  });
};

export const su_foodWhereFoodComesFrom = cards("sci.food.where-food-comes-from.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e3_0, e3_1, e3_2]);
