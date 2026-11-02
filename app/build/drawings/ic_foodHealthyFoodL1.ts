import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, person, write, cards } from "./flatKit";

// HEALTHY FOOD L1 · which foods hold water? Flat set-up cards and card pictures.
// Same child (orange top) and grown-up (blue top) on every card.

const PALE = "#dff2bf", SEEDC = "#f3f6d9", TAN = "#e2b56c", TANDK = "#c4913f", RICE = "#fbf7ee", MELON = "#ef5a4a", DAL = "#f3c84a";

// a water drop, tip up, centre (x, y), size s
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.8, y - s * 0.05, x + s * 0.6, y + s * 0.35); c.arc(x, y + s * 0.35, s * 0.6, 0, Math.PI); c.quadraticCurveTo(x - s * 0.8, y - s * 0.05, x, y - s); c.closePath(); }, col, Math.max(3, s * 0.12));
// a cucumber slice seen from above, radius r (ry squashes it when lying on a plate)
const cucSlice = (c: Ctx, x: number, y: number, r: number, ry = r) => {
  shape(c, () => ell(c, x, y, r, ry), COL.green, 5);
  shape(c, () => ell(c, x, y, r * 0.8, ry * 0.8), PALE, 3);
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + 0.3; shape(c, () => ell(c, x + Math.cos(a) * r * 0.4, y + Math.sin(a) * ry * 0.4, r * 0.13, r * 0.08, a), SEEDC, 2); }
};
// a watermelon wedge, tip up, rind at the bottom
const melon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y - s); c.lineTo(x + s * 0.9, y + s * 0.55); c.quadraticCurveTo(x, y + s * 1.0, x - s * 0.9, y + s * 0.55); c.closePath(); }, MELON, 5);
  shape(c, () => { c.moveTo(x + s * 0.9, y + s * 0.55); c.quadraticCurveTo(x, y + s * 1.0, x - s * 0.9, y + s * 0.55); c.quadraticCurveTo(x, y + s * 0.82, x + s * 0.9, y + s * 0.55); c.closePath(); }, COL.green, 4);
  [[0, 0.1], [-0.3, 0.4], [0.3, 0.4]].forEach(([u, v]) => shape(c, () => ell(c, x + u * s, y + v * s, s * 0.07, s * 0.1), INK, 0));
};
// a banana, curved, left end at (x, y), length l
const banana = (c: Ctx, x: number, y: number, l: number, w: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([x + t * l, y - Math.sin(t * Math.PI) * l * 0.28]); }
  line(c, pts, w + 10, INK); line(c, pts, w, COL.yellow); line(c, pts.slice(2, 7), w * 0.3, "#e0b52f");
  shape(c, () => ell(c, x + l, y, w * 0.3, w * 0.3), COL.brown, 4);
};
// a round plain biscuit
const biscuit = (c: Ctx, x: number, y: number, r: number, ry = r) => {
  shape(c, () => ell(c, x, y, r, ry), TAN, 5);
  shape(c, () => ell(c, x, y, r * 0.78, ry * 0.78), TAN, 3);
  for (let k = 0; k < 7; k++) { const a = k * Math.PI * 2 / 7, rr = k ? 0.42 : 0; shape(c, () => ell(c, x + Math.cos(a) * r * rr, y + Math.sin(a) * ry * rr, r * 0.07, ry * 0.07), TANDK, 0); }
};
// a mound of something at (x, y) (base centre), width w, height h, with little bits of colour dot
const mound = (c: Ctx, x: number, y: number, w: number, h: number, col: string, bit: string, n: number, seedN: number, bitR = 9) => {
  const p = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.4, y - h * 1.3, x + w * 0.4, y - h * 1.3, x + w / 2, y); c.closePath(); };
  shape(c, p, col, 5);
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const t = r(), u = r(); const px = x - w / 2 + t * w, top = y - Math.sin(t * Math.PI) * h * 0.9; const py = top + u * (y - top - 6); shape(c, () => ell(c, px, py, bitR, bitR * 0.65, r() * 3), bit, 2); }
};
const rice = (c: Ctx, x: number, y: number, w: number, h: number, s = 3) => mound(c, x, y, w, h, RICE, WHITE, Math.round(w / 6), s, w * 0.03);
const chana = (c: Ctx, x: number, y: number, w: number, h: number, s = 4) => mound(c, x, y, w, h, COL.brown, "#d9a062", Math.round(w / 7), s, w * 0.045);
const murmura = (c: Ctx, x: number, y: number, w: number, h: number, s = 5) => mound(c, x, y, w, h, "#f1e7cf", "#fffaf0", Math.round(w / 7), s, w * 0.045);
// a red cross (meaning "no")
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 12, RED); line(c, [[x + s, y - s], [x - s, y + s]], 12, RED); };
// a sun in a window, top right
const sunWindow = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s, y - s, s * 2, s * 2, 14), COL.sky, 6);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; line(c, [[x + Math.cos(a) * s * 0.5, y + Math.sin(a) * s * 0.5], [x + Math.cos(a) * s * 0.78, y + Math.sin(a) * s * 0.78]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, s * 0.38, s * 0.38), COL.yellow, 5);
  line(c, [[x - s, y], [x + s, y]], 6); line(c, [[x, y - s], [x, y + s]], 6);
};
// the six test foods in a row at height y, spacing dx, centred on cx
const sixFoods = (c: Ctx, cx: number, y: number, dx: number, k = 1) => {
  const x0 = cx - dx * 2.5;
  cucSlice(c, x0, y, 52 * k, 40 * k);
  melon(c, x0 + dx, y - 10 * k, 56 * k);
  banana(c, x0 + dx * 2 - 55 * k, y + 10 * k, 110 * k, 26 * k);
  rice(c, x0 + dx * 3, y + 30 * k, 120 * k, 60 * k);
  biscuit(c, x0 + dx * 4, y, 52 * k, 42 * k);
  chana(c, x0 + dx * 5, y + 30 * k, 110 * k, 55 * k);
};
// a sheet of paper, slightly tilted, centre (x, y)
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 16, y + 20, w * 0.55, h * 0.55); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), COL.paper, 6); };
// a cloth hanky bundle with green bits, twisted tail going up to (tx, ty)
const hankyBundle = (c: Ctx, x: number, y: number, r: number, tx: number, ty: number) => {
  // twisted tail
  const tail = () => { c.moveTo(x - r * 0.35, y - r * 0.7); c.quadraticCurveTo(tx - 50, (y + ty) / 2, tx - 36, ty); c.lineTo(tx + 36, ty); c.quadraticCurveTo(tx + 50, (y + ty) / 2, x + r * 0.35, y - r * 0.7); c.closePath(); };
  shape(c, tail, COL.cloth, 6);
  for (let k = 0; k < 5; k++) { const t = 0.15 + k * 0.17, px = x + (tx - x) * t, py = (y - r * 0.7) + (ty - y + r * 0.7) * t; line(c, [[px - 34, py + 14], [px + 34, py - 14]], 4, "#cfc6b2"); }
  shape(c, () => ell(c, x, y, r, r * 0.85), COL.cloth, 6);
  shade(c, () => ell(c, x, y, r, r * 0.85), "#d9d0bb", r * 0.3, r * 0.1, 0.7);
  const rr = rnd(21);
  for (let i = 0; i < 9; i++) { const a = rr() * Math.PI * 2, d = rr() * r * 0.55; shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, 16, 11, rr() * 3), COL.greenLt, 3); }
  // folds on the bundle
  line(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.2, y + r * 0.4]], 4, "#cfc6b2"); line(c, [[x + r * 0.5, y - r * 0.1], [x + r * 0.25, y + r * 0.45]], 4, "#cfc6b2");
};

// ---------------------------------------------------------------- set-up cards
// 1. six foods in a row on a steel plate
const setup0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 520, 300);
  sixFoods(c, 540, 600, 165, 1.45);
};
// 2. a child's hand pressing cucumber onto a paper square, wet patch round it
const setup1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 640, 300, 250);
  c.save(); c.translate(540, 620); c.rotate(-0.06);
  shape(c, () => rrect(c, -270, -250, 540, 500, 8), COL.paper, 6);
  c.restore();
  // wet patch
  shape(c, () => { c.moveTo(380, 640); c.bezierCurveTo(360, 520, 720, 480, 730, 620); c.bezierCurveTo(740, 740, 420, 760, 380, 640); c.closePath(); }, COL.sky, 0);
  cucSlice(c, 550, 630, 95, 80);
  // flat hand pressing from the top, fingers over the slice
  hand(c, 560, 420, Math.PI / 2, 1.55, SKIN.child, CLOTH.child, true);
  arrow(c, [[820, 330], [820, 500]]);
  // count to ten
  write(c, "10", 150, 150, 110, INK, 9);
};
// 3. grown-up and child twisting the hanky over the glass
const setup2 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 1030, 290, 330, 0.25);
  drop(c, 530, 790, 22); drop(c, 565, 720, 18); drop(c, 525, 660, 14);
  hankyBundle(c, 540, 470, 175, 540, 150);
  hand(c, 462, 320, 0, 1.3, SKIN.adult, CLOTH.adult);
  hand(c, 606, 200, Math.PI, 1.1, SKIN.child, CLOTH.child);
  // twist arrows
  arrow(c, [[250, 420], [300, 480], [380, 500]]); arrow(c, [[840, 120], [790, 90], [720, 100]]);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: six foods, drops under the wet ones, crosses under the dry ones
const flowE1 = (c: Ctx) => {
  ground(c);
  line(c, [[80, 560], [1000, 560]], 5, COL.grey);
  sixFoods(c, 540, 400, 175, 1.5);
  const xs = [0, 1, 2, 3, 4, 5].map((i) => 540 - 175 * 2.5 + i * 175);
  // cucumber: lots; melon: lots, pink; banana: one; rice: one small; biscuit: cross; chana: cross
  drop(c, xs[0] - 40, 680, 34); drop(c, xs[0] + 40, 680, 34); drop(c, xs[0], 800, 34); drop(c, xs[0] - 40, 920, 34); drop(c, xs[0] + 40, 920, 34);
  drop(c, xs[1] - 40, 680, 34, COL.pink); drop(c, xs[1] + 40, 680, 34, COL.pink); drop(c, xs[1], 800, 34, COL.pink); drop(c, xs[1] - 40, 920, 34, COL.pink); drop(c, xs[1] + 40, 920, 34, COL.pink);
  drop(c, xs[2], 700, 24);
  drop(c, xs[3], 700, 18);
  cross(c, xs[4], 720, 50); cross(c, xs[5], 720, 50);
};
// flow.a1: the feely bag, the child's hand inside
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 330, 40);
  hand(c, 470, 290, Math.PI * 0.55, 1.9, SKIN.child, CLOTH.child);
  const bag = () => { c.moveTo(380, 430); c.quadraticCurveTo(190, 520, 210, 760); c.quadraticCurveTo(240, 910, 540, 920); c.quadraticCurveTo(840, 910, 870, 760); c.quadraticCurveTo(890, 520, 700, 430); c.closePath(); };
  shape(c, bag, COL.cloth, 6);
  shade(c, bag, "#d9d0bb", 60, 30, 0.6);
  // bumps of the hidden foods
  shape(c, () => ell(c, 330, 720, 70, 60), COL.cloth, 4); shape(c, () => ell(c, 690, 760, 90, 70), COL.cloth, 4); shape(c, () => ell(c, 520, 820, 80, 45), COL.cloth, 4);
  // gathered neck
  shape(c, () => ell(c, 540, 430, 170, 42), "#e4dccb", 6);
  for (let k = -3; k <= 3; k++) line(c, [[540 + k * 42, 400], [540 + k * 46, 460]], 4, "#cfc6b2");
  // the foods waiting beside the bag
  shape(c, () => ell(c, 130, 860, 50, 40), COL.yellow, 5); shape(c, () => ell(c, 960, 870, 46, 46), COL.red, 5);
  shape(c, () => { c.moveTo(900, 560); c.lineTo(1040, 500); c.lineTo(1050, 540); c.lineTo(930, 620); c.closePath(); }, COL.orange, 5);
  shape(c, () => ell(c, 540, 960, 70, 60), "#d9a062", 5); line(c, [[540, 900], [560, 870]], 5);
};
// flow.a2: the kosambari bowl, lemon squeezed over it
const flowA2 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 700, 330);
  const heap = () => { c.moveTo(220, 700); c.bezierCurveTo(300, 540, 780, 540, 860, 700); c.closePath(); };
  shape(c, heap, DAL, 5);
  const r = rnd(33);
  for (let i = 0; i < 70; i++) { const t = r(), u = r(); const x = 240 + t * 600, top = 700 - Math.sin(t * Math.PI) * 115; const y = top + u * (700 - top - 4); const k = r(); if (k < 0.4) shape(c, () => ell(c, x, y, 11, 8, r() * 3), "#f8dd7c", 2); else if (k < 0.72) shape(c, () => rrect(c, x - 14, y - 12, 28, 24, 5), COL.greenLt, 3); else line(c, [[x - 18, y - 6], [x + 18, y + 6]], 7, COL.orange); }
  shape(c, () => ell(c, 540, 700, 330, 66), "rgba(0,0,0,0)", 5);
  // lemon half in the child's hand, drops falling
  hand(c, 640, 150, Math.PI * 0.95, 1.2, SKIN.child, CLOTH.child);
  shape(c, () => ell(c, 530, 250, 70, 62), COL.yellow, 5);
  shape(c, () => ell(c, 530, 250, 52, 44), "#fff3a8", 3);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; line(c, [[530, 250], [530 + Math.cos(a) * 46, 250 + Math.sin(a) * 40]], 3, "#e0b52f"); }
  drop(c, 520, 380, 16, "#fff3a8"); drop(c, 560, 450, 14, "#fff3a8"); drop(c, 530, 510, 12, "#fff3a8");
  arrow(c, [[820, 160], [720, 240]]);
};
// flow.a3: the water chart: a tumbler drawn on paper, seven drops, the child drawing the last one
const flowA3 = (c: Ctx) => {
  ground(c);
  sheet(c, 500, 540, 660, 860);
  // the drawn tumbler
  shape(c, () => polyP(c, [[400, 170], [600, 170], [575, 410], [425, 410]]), COL.water, 6);
  line(c, [[420, 220], [580, 220]], 5);
  for (let i = 0; i < 7; i++) { const col = i % 4, row = Math.floor(i / 4); drop(c, 320 + col * 120, 560 + row * 170, 38); }
  write(c, "7", 760, 820, 110, INK, 9);
  // crayon in the child's hand touching the last drop
  hand(c, 870, 440, Math.PI * 0.72, 1.3, SKIN.child, CLOTH.child);
  shape(c, () => { c.save(); c.translate(760, 660); c.rotate(-1.15); rrect(c, -16, -130, 32, 170, 8); c.restore(); }, COL.blue, 5);
  shape(c, () => { c.moveTo(690, 720); c.lineTo(720, 700); c.lineTo(710, 740); c.closePath(); }, COL.blue, 4);
};
// flow.p1: ten faces on a sheet, from frown to smile; a spoon with a tiny piece of karela
const flowP1 = (c: Ctx) => {
  ground(c);
  sheet(c, 540, 420, 920, 540);
  const mouths = [-1, -1, -1, -0.5, 0, 0, 0, 0.4, 0.7, 1];
  for (let i = 0; i < 10; i++) {
    const x = 170 + (i % 5) * 185, y = 300 + Math.floor(i / 5) * 240, m = mouths[i];
    shape(c, () => ell(c, x, y, 72, 72), COL.yellow, 5);
    shape(c, () => ell(c, x - 24, y - 16, 7, 9), INK, 0); shape(c, () => ell(c, x + 24, y - 16, 7, 9), INK, 0);
    c.beginPath(); if (Math.abs(m) < 0.1) { c.moveTo(x - 28, y + 26); c.lineTo(x + 28, y + 26); } else { c.moveTo(x - 30, y + 26 - m * 6); c.quadraticCurveTo(x, y + 26 + m * 34, x + 30, y + 26 - m * 6); } c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
  }
  // the spoon with a pea-sized bit of karela
  shadow(c, 560, 900, 240, 24);
  shape(c, () => rrect(c, 330, 870, 260, 30, 15), COL.steel, 5);
  shape(c, () => ell(c, 660, 880, 90, 55), COL.steel, 5); shape(c, () => ell(c, 660, 880, 70, 38), COL.steelIn, 3);
  shape(c, () => ell(c, 660, 876, 22, 18), COL.greenDk, 4); shape(c, () => ell(c, 652, 870, 6, 5), COL.greenLt, 0);
  hand(c, 230, 885, 0, 1.0, SKIN.child, CLOTH.child);
};
// term.1 Thirsty: a hot child reaching for a steel tumbler of water
const term1 = (c: Ctx) => {
  ground(c);
  sunWindow(c, 880, 220, 140);
  // table
  shape(c, () => rrect(c, 600, 700, 480, 50, 8), COL.wood, 6); line(c, [[660, 750], [660, 1000]], 20, INK); line(c, [[1010, 750], [1010, 1000]], 20, INK);
  shadow(c, 340, 985, 150, 22);
  person(c, 330, 980, 620, { armR: [-0.15, 0.05] });
  // hot red cheeks and sweat
  const head = 620 * 0.13, hy = 980 - 620 * 0.74 - head * 1.05;
  shape(c, () => ell(c, 330 - head * 0.55, hy + head * 0.35, head * 0.22, head * 0.15), "#f08a7a", 0); shape(c, () => ell(c, 330 + head * 0.55, hy + head * 0.35, head * 0.22, head * 0.15), "#f08a7a", 0);
  drop(c, 330 - head * 0.9, hy - head * 0.25, 13, COL.sky); drop(c, 330 + head * 0.75, hy - head * 0.5, 12, COL.sky);
  // the steel tumbler on the table
  shadow(c, 850, 705, 110, 18);
  shape(c, () => polyP(c, [[740, 470], [940, 470], [920, 700], [760, 700]]), COL.steel, 6);
  shade(c, () => polyP(c, [[740, 470], [940, 470], [920, 700], [760, 700]]), COL.steelDk, 60, 0);
  shape(c, () => ell(c, 840, 470, 100, 24), COL.water, 6);
  shine(c, [[770, 520], [778, 660]], 8);
  arrow(c, [[600, 600], [720, 580]]);
};
// term.2 Sweat: a child's face with drops of sweat on the forehead, the sun in the window
const term2 = (c: Ctx) => {
  ground(c);
  sunWindow(c, 880, 200, 150);
  shadow(c, 560, 1000, 300, 30);
  shape(c, () => rrect(c, 330, 780, 420, 300, 60), CLOTH.child, 6);
  line(c, [[480, 780], [480, 860]], 24, INK); line(c, [[480, 780], [480, 860]], 14, SKIN.child);
  shape(c, () => ell(c, 540, 500, 260, 280), SKIN.child, 6);
  shape(c, () => { c.moveTo(275, 470); c.bezierCurveTo(280, 120, 800, 120, 805, 470); c.quadraticCurveTo(540, 330, 275, 470); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 790, 480, 80, 140), CLOTH.hair, 4);
  shape(c, () => ell(c, 450, 540, 22, 30), INK, 0); shape(c, () => ell(c, 630, 540, 22, 30), INK, 0);
  shape(c, () => ell(c, 400, 620, 50, 30), "#f08a7a", 0); shape(c, () => ell(c, 680, 620, 50, 30), "#f08a7a", 0);
  line(c, [[480, 670], [540, 690], [600, 670]], 7);
  // sweat drops on the forehead
  drop(c, 420, 420, 26, COL.sky); drop(c, 520, 400, 24, COL.sky); drop(c, 620, 430, 26, COL.sky); drop(c, 380, 520, 20, COL.sky); drop(c, 700, 540, 20, COL.sky);
};
// expl.0: a banana-leaf meal with rice, sambar, a vegetable, curd and water
const expl0 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 700, 470, 290);
  shape(c, () => { c.moveTo(60, 660); c.bezierCurveTo(60, 420, 300, 380, 540, 380); c.bezierCurveTo(780, 380, 1020, 420, 1020, 660); c.bezierCurveTo(1020, 900, 780, 960, 540, 960); c.bezierCurveTo(300, 960, 60, 900, 60, 660); c.closePath(); }, COL.leaf, 6);
  line(c, [[70, 660], [1010, 660]], 8, COL.leafDk);
  for (let k = 0; k < 10; k++) { const x = 130 + k * 90; line(c, [[x, 420 + Math.abs(k - 4.5) * 10], [x + 30, 650]], 3, COL.leafDk); line(c, [[x + 30, 670], [x, 900 - Math.abs(k - 4.5) * 10]], 3, COL.leafDk); }
  rice(c, 420, 760, 360, 150, 7);
  bowl(c, 760, 520, 110, "#e58a3c"); shape(c, () => ell(c, 730, 515, 24, 10), "#f6b05e", 3);
  mound(c, 780, 800, 190, 80, COL.green, COL.greenLt, 14, 8, 12);
  bowl(c, 230, 500, 95, WHITE);
  glass(c, 960, 360, 150, 240, 0.7);
};
// expl.2: a cucumber cut open, a bowl of cooked rice, a heap of dry murmura
const expl2 = (c: Ctx) => {
  ground(c);
  shadow(c, 420, 560, 360, 60);
  c.save(); c.translate(380, 470); c.rotate(-0.35);
  shape(c, () => rrect(c, -330, -90, 600, 180, 70), COL.greenDk, 6);
  shade(c, () => rrect(c, -330, -90, 600, 180, 70), "#2f5a22", 0, 40, 0.5);
  shine(c, [[-280, -50], [180, -50]], 9);
  c.restore();
  // the cut face
  c.save(); c.translate(636, 375); c.rotate(-0.35);
  shape(c, () => ell(c, 0, 0, 40, 90), COL.green, 6); shape(c, () => ell(c, 0, 0, 30, 74), PALE, 3);
  for (let k = 0; k < 5; k++) shape(c, () => ell(c, (k % 2 ? 10 : -10), -50 + k * 25, 7, 11), SEEDC, 2);
  c.restore();
  drop(c, 660, 500, 20); drop(c, 700, 560, 16); drop(c, 640, 590, 14);
  bowl(c, 260, 800, 200); rice(c, 260, 800, 340, 110, 9);
  murmura(c, 780, 900, 420, 160, 10);
  shape(c, () => ell(c, 780, 900, 210, 40), "#f1e7cf", 5);
};
// expl.3: a small child tasting a tiny piece of karela, the grown-up smiling beside her
const expl3 = (c: Ctx) => {
  ground(c);
  shadow(c, 380, 985, 130, 22); shadow(c, 780, 985, 170, 26);
  person(c, 780, 980, 820, { adult: true, armL: [Math.PI * 0.75, Math.PI * 0.95] });
  person(c, 380, 980, 560, { armR: [-1.25, Math.PI * 1.02] });
  // the spoon at the child's mouth, a pea-sized green bit on it
  shape(c, () => rrect(c, 395, 545, 150, 22, 11), COL.steel, 5);
  shape(c, () => ell(c, 395, 552, 40, 26), COL.steel, 5); shape(c, () => ell(c, 395, 552, 28, 16), COL.steelIn, 2);
  shape(c, () => ell(c, 395, 548, 16, 13), COL.greenDk, 4);
  // a katori of karela slices on a stool
  shape(c, () => rrect(c, 490, 820, 160, 30, 8), COL.wood, 5); line(c, [[520, 850], [520, 980]], 14, INK); line(c, [[620, 850], [620, 980]], 14, INK);
  bowl(c, 570, 790, 80, COL.steelIn);
  for (let k = 0; k < 4; k++) { const x = 525 + k * 30; shape(c, () => ell(c, x, 775, 20, 12), COL.greenDk, 4); shape(c, () => ell(c, x, 775, 11, 6), COL.greenLt, 0); }
};

export const ic_foodHealthyFoodL1 = cards("sci.food.healthy-food.L1", [
  setup0, setup1, setup2,
  flowE1, flowA1, flowA2, flowA3, flowP1,
  term1, term2, expl0, expl2, expl3,
]);
