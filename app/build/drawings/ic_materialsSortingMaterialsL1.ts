import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, person, write, cards } from "./flatKit";

// SORTING MATERIALS L1 · set-up cards for the Sink or Float Sort, then the card pictures.
// Kitchen things: a steel spoon, a steel katori, a one-rupee coin, a key, a wooden spoon, a yellow
// pencil, a red bottle cap and a blue comb. A blue bucket drawn see-through so the water and what is
// in it can be seen. The same girl (SKIN.child, CLOTH.child) and grown-up on every card.

// ---------------------------------------------------------------- things
// a blue bucket, bottom centre (x, y), see-through: pale inside above the water, water below. Returns the water line y.
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, fill = 0.72) => {
  const tw = w / 2, bw = w * 0.46, ry = w * 0.09, i = 14;
  shadow(c, x + w * 0.1, y + 10, w * 0.55, w * 0.1);
  const body = () => { c.moveTo(x - tw, y - h); c.lineTo(x + tw, y - h); c.lineTo(x + bw, y); c.lineTo(x - bw, y); c.closePath(); };
  shape(c, body, COL.blue);
  shade(c, body, COL.blueDk, w * 0.28, 0);
  shape(c, () => { c.moveTo(x - tw + i, y - h); c.lineTo(x + tw - i, y - h); c.lineTo(x + bw - i, y - i); c.lineTo(x - bw + i, y - i); c.closePath(); }, COL.sky, 0);
  const ly = y - h * fill, lw = bw + (tw - bw) * fill - i;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bw - i, y - i); c.lineTo(x - bw + i, y - i); c.closePath(); }, COL.water, 0);
  shape(c, () => ell(c, x, ly, lw, ry * 0.7), COL.water, 4);
  shine(c, [[x - lw * 0.7, ly + 2], [x - lw * 0.3, ly + 4]], 7);
  shape(c, () => ell(c, x, y - h, tw, ry), COL.blueDk, 6);
  shape(c, () => ell(c, x, y - h, tw - i, ry * 0.6), COL.sky, 4);
  return ly;
};
// a bubble in the water
const bubble = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), COL.drop, 3);
// a spoon centred at (x, y), handle to the left and bowl to the right before rotation; steel unless told
const spoon = (c: Ctx, x: number, y: number, len: number, rot: number, col: string = COL.steel, dk: string = COL.steelDk) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const hw = len * 0.045, bowlP = () => ell(c, len * 0.33, 0, len * 0.18, len * 0.125);
  shape(c, () => rrect(c, -len * 0.5, -hw, len * 0.7, hw * 2, hw), col);
  shape(c, bowlP, col);
  shade(c, bowlP, dk, len * 0.06, len * 0.04);
  shine(c, [[len * 0.2, -len * 0.05], [len * 0.3, -len * 0.08]], Math.max(4, len * 0.03));
  c.restore();
};
const woodSpoon = (c: Ctx, x: number, y: number, len: number, rot: number) => spoon(c, x, y, len, rot, COL.wood, COL.woodDk);
// a steel key centred at (x, y), ring to the left and teeth to the right before rotation
const key = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const r = len * 0.17;
  shape(c, () => rrect(c, -len * 0.3, -len * 0.055, len * 0.8, len * 0.11, len * 0.05), COL.steel);
  shape(c, () => rrect(c, len * 0.27, 0, len * 0.08, len * 0.18, 3), COL.steel, 4);
  shape(c, () => rrect(c, len * 0.4, 0, len * 0.08, len * 0.14, 3), COL.steel, 4);
  shape(c, () => ell(c, -len * 0.33, 0, r, r), COL.steel);
  shade(c, () => ell(c, -len * 0.33, 0, r, r), COL.steelDk, r * 0.3, r * 0.2);
  shape(c, () => ell(c, -len * 0.33, 0, r * 0.4, r * 0.4), BG, 4);
  c.restore();
};
// a one-rupee coin, face up
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, r * 0.25, r * 0.2);
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), COL.steelIn, 4);
  write(c, "1", x - r * 0.2, y - r * 0.42, r * 0.85, INK, Math.max(4, r * 0.12));
};
// a yellow pencil centred at (x, y), eraser left and point right before rotation
const pencil = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const hw = len * 0.05;
  shape(c, () => rrect(c, -len * 0.5, -hw, len * 0.78, hw * 2, 2), COL.yellow);
  line(c, [[-len * 0.42, hw * 0.45], [len * 0.26, hw * 0.45]], hw * 0.5, "#e2b23a");
  shape(c, () => rrect(c, -len * 0.5, -hw, len * 0.07, hw * 2, 2), COL.steel, 4);
  shape(c, () => rrect(c, -len * 0.58, -hw, len * 0.1, hw * 2, hw * 0.6), COL.pink, 4);
  shape(c, () => polyP(c, [[len * 0.28, -hw], [len * 0.5, 0], [len * 0.28, hw]]), COL.wood, 4);
  shape(c, () => polyP(c, [[len * 0.43, -hw * 0.32], [len * 0.5, 0], [len * 0.43, hw * 0.32]]), COL.black, 2);
  c.restore();
};
// a blue plastic comb centred at (x, y), teeth pointing down before rotation
const comb = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const h = len * 0.36, n = 13, step = (len - 16) / n;
  for (let k = 0; k < n; k++) shape(c, () => rrect(c, -len / 2 + 8 + k * step + step * 0.2, -h * 0.1, step * 0.55, h * 0.6, 3), COL.blue, 3);
  shape(c, () => rrect(c, -len / 2, -h / 2, len, h * 0.45, 8), COL.blue);
  shade(c, () => rrect(c, -len / 2, -h / 2, len, h * 0.45, 8), COL.blueDk, 0, h * 0.2);
  c.restore();
};
// a red plastic bottle cap seen from above
const cap = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.red);
  for (let k = 0; k < 18; k++) { const a = (k / 18) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 3, INK); }
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.62), "#f07a66", 3);
  shade(c, () => ell(c, x, y, r, r), "#b53a2c", r * 0.3, r * 0.22, 0.35);
};
// a steel tumbler, bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.09), COL.steelIn, 5);
  shine(c, [[x - top * 0.6, y - h * 0.85], [x - bot * 0.7, y - h * 0.25]], 8);
};
// a cloth towel lying flat
const towel = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 14, y + h + 6, w / 2, 22);
  shape(c, () => rrect(c, x, y, w, h, 24), COL.cloth);
  for (const dy of [26, h - 38]) line(c, [[x + 30, y + dy], [x + w - 30, y + dy]], 10, COL.pink);
};
// a ring of folded dupatta on the floor
const ring = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, dk: string) => {
  shape(c, () => ell(c, x, y, rx, ry), col);
  shade(c, () => ell(c, x, y, rx, ry), dk, rx * 0.15, ry * 0.2);
  shape(c, () => ell(c, x, y, rx - 46, ry - 34), BG, 6);
};
// a small white card with a green tick or a red cross
const yesNoCard = (c: Ctx, x: number, y: number, ok: boolean) => {
  shadow(c, x + 10, y + 50, 60, 10);
  shape(c, () => rrect(c, x - 62, y - 46, 124, 92, 10), WHITE, 5);
  if (ok) line(c, [[x - 32, y + 2], [x - 8, y + 26], [x + 34, y - 24]], 10, COL.green);
  else { line(c, [[x - 26, y - 26], [x + 26, y + 26]], 10, RED); line(c, [[x + 26, y - 26], [x - 26, y + 26]], 10, RED); }
};
// a girl standing or sitting (the same child on every card)
const girl = (c: Ctx, x: number, y: number, h: number, p: Parameters<typeof person>[4] = {}) => person(c, x, y, h, p);

// ---------------------------------------------------------------- set-up cards for the Sink or Float Sort
// 1. the eight things on a towel in three piles: metal, wood, plastic
const setup0 = (c: Ctx) => {
  ground(c);
  towel(c, 60, 250, 960, 640);
  spoon(c, 210, 450, 250, -1.15); bowl(c, 220, 660, 92); coin(c, 330, 530, 44); key(c, 200, 820, 180, 0.1);
  woodSpoon(c, 540, 470, 270, -1.3); pencil(c, 540, 750, 310, 0.15);
  cap(c, 850, 470, 60); comb(c, 850, 740, 260, 0.08);
};
// 2. the girl puts the katori on the water while the grown-up watches
const setup1 = (c: Ctx) => {
  ground(c);
  person(c, 150, 1010, 800, { adult: true });
  bucket(c, 520, 940, 440, 440);
  girl(c, 880, 1000, 620, { armL: [Math.PI * 0.95, Math.PI * 0.85] });
  bowl(c, 595, 600, 80);
  arrow(c, [[470, 470], [470, 580]]);
};
// 3. the bucket from the side: four things float, four sink
const setup2 = (c: Ctx) => {
  ground(c);
  const ly = bucket(c, 540, 960, 680, 600);
  bowl(c, 320, ly - 8, 66); woodSpoon(c, 490, ly, 170, 0.08); pencil(c, 690, ly - 4, 190, -0.08); cap(c, 820, ly, 36);
  spoon(c, 340, 912, 190, 0.05); coin(c, 500, 918, 38); key(c, 620, 912, 140, 0.05); comb(c, 770, 900, 140, 0.05);
  bubble(c, 430, 800, 9); bubble(c, 455, 760, 7); bubble(c, 660, 820, 8);
};
// 4. the girl pours water into the floating katori, and it tips down
const setup3 = (c: Ctx) => {
  ground(c);
  const ly = bucket(c, 420, 960, 520, 500);
  c.save(); c.translate(380, ly + 10); c.rotate(0.35); bowl(c, 0, 0, 80, COL.water); c.restore();
  girl(c, 860, 1010, 640, { armL: [Math.PI * 1.15, Math.PI * 0.9] });
  c.save(); c.translate(600, 525); c.rotate(-1.0); tumbler(c, 0, 50, 120, 170); c.restore();
  line(c, [[530, 500], [470, 540], [400, 585]], 14, COL.water);
  arrow(c, [[300, 690], [330, 780]]);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the girl kneels by the bucket; the katori floats, the spoon, key and coin lie at the bottom; two piles beside
const flowE1 = (c: Ctx) => {
  ground(c);
  girl(c, 220, 960, 560, { sit: true, armR: [-0.3, 0.2] });
  const ly = bucket(c, 640, 960, 480, 460);
  bowl(c, 640, ly - 8, 70);
  spoon(c, 540, 918, 160, 0.05); coin(c, 670, 922, 30); key(c, 780, 916, 110, 0.05);
  pencil(c, 965, 430, 220, -1.3); woodSpoon(c, 1020, 440, 200, -1.2);
  comb(c, 965, 760, 150, -1.2); cap(c, 1010, 890, 36);
};
// flow.a1: a yes circle and a no circle of dupatta; the girl holds a key over the yes circle
const flowA1 = (c: Ctx) => {
  ground(c);
  ring(c, 300, 640, 240, 150, COL.pink, "#d47a95");
  ring(c, 790, 640, 240, 150, COL.purple, "#6c4fa8");
  girl(c, 540, 560, 520, { armL: [Math.PI * 0.62, Math.PI * 0.7] });
  key(c, 380, 420, 130, Math.PI * 0.5);
  arrow(c, [[380, 500], [340, 560]]);
  yesNoCard(c, 300, 560, true); yesNoCard(c, 790, 560, false);
  spoon(c, 240, 690, 170, 0.2); coin(c, 390, 710, 34);
  pencil(c, 740, 690, 200, -0.15); comb(c, 850, 720, 140, 0.1);
};
// flow.a2: a steel plate with a spoon, a key, a coin and a pencil: which one is different?
const flowA2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 420, 210);
  spoon(c, 370, 600, 240, -1.1); key(c, 520, 600, 160, -1.2); coin(c, 650, 600, 46); pencil(c, 810, 600, 270, -1.2);
};
// flow.a3: three bags with picture labels; the girl drops a plastic bottle into the plastic bag
const bottle = (c: Ctx, x: number, y: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const w = h * 0.4;
  shape(c, () => { c.moveTo(-w / 2, h * 0.5); c.lineTo(-w / 2, -h * 0.15); c.quadraticCurveTo(-w / 2, -h * 0.3, -w * 0.2, -h * 0.35); c.lineTo(-w * 0.2, -h * 0.5); c.lineTo(w * 0.2, -h * 0.5); c.lineTo(w * 0.2, -h * 0.35); c.quadraticCurveTo(w / 2, -h * 0.3, w / 2, -h * 0.15); c.lineTo(w / 2, h * 0.5); c.closePath(); }, COL.glass, 5);
  shape(c, () => rrect(c, -w * 0.24, -h * 0.55, w * 0.48, h * 0.1, 4), COL.blue, 4);
  shine(c, [[-w * 0.3, -h * 0.1], [-w * 0.3, h * 0.3]], 6);
  c.restore();
};
const bag = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string, label: (c: Ctx, x: number, y: number) => void) => {
  shadow(c, x + 16, y + 6, w * 0.55, 18);
  const body = () => { c.moveTo(x - w * 0.42, y - h); c.lineTo(x + w * 0.42, y - h); c.quadraticCurveTo(x + w * 0.5, y - h * 0.5, x + w * 0.5, y); c.lineTo(x - w * 0.5, y); c.quadraticCurveTo(x - w * 0.5, y - h * 0.5, x - w * 0.42, y - h); c.closePath(); };
  shape(c, body, col);
  shade(c, body, dk, w * 0.25, 0);
  shape(c, () => ell(c, x, y - h, w * 0.42, w * 0.1), COL.greyDk, 5);
  shape(c, () => rrect(c, x - 70, y - h * 0.62, 140, 110, 10), WHITE, 5);
  label(c, x, y - h * 0.62 + 55);
};
const flowA3 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 640], [D, 640]], 5, "#d9cdb3");
  girl(c, 720, 900, 600, { armL: [Math.PI * 0.7, Math.PI * 0.6] });
  bottle(c, 560, 590, 120, 0.4);
  arrow(c, [[460, 560], [500, 650]]);
  bag(c, 200, 980, 280, 320, COL.grey, COL.greyDk, (c, x, y) => { shape(c, () => rrect(c, x - 42, y - 34, 84, 68, 4), COL.paper, 4); for (let k = 0; k < 4; k++) line(c, [[x - 30, y - 18 + k * 13], [x + 30, y - 18 + k * 13]], 4, COL.greyDk); });
  bag(c, 540, 980, 280, 320, COL.teal, COL.tealDk, (c, x, y) => bottle(c, x, y, 76));
  bag(c, 880, 980, 280, 320, COL.orange, "#d27c25", (c, x, y) => { shape(c, () => rrect(c, x - 28, y - 36, 56, 72, 4), COL.steel, 4); shape(c, () => ell(c, x, y - 36, 28, 8), COL.steelIn, 3); });
};
// flow.p1: a little stapled book open on a page with two circles of drawn toys
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 870, 460, 40);
  shape(c, () => rrect(c, 110, 260, 860, 600, 18), COL.paper);
  shape(c, () => rrect(c, 540, 260, 430, 600, 18), "#f3ecda");
  for (const y of [360, 560, 760]) line(c, [[540, y - 24], [540, y + 24]], 7, COL.greyDk);
  for (const [x, col] of [[325, COL.teal], [755, COL.purple]] as [number, string][]) { c.beginPath(); ell(c, x, 580, 160, 200); c.strokeStyle = col; c.lineWidth = 8; c.stroke(); }
  // toy cars and a block in the first circle
  const car = (x: number, y: number, col: string) => { shape(c, () => rrect(c, x - 50, y - 20, 100, 40, 10), col); shape(c, () => rrect(c, x - 26, y - 42, 52, 26, 8), col, 4); shape(c, () => ell(c, x - 28, y + 22, 12, 12), COL.black, 3); shape(c, () => ell(c, x + 28, y + 22, 12, 12), COL.black, 3); };
  car(325, 470, COL.red); car(325, 580, COL.blue);
  shape(c, () => rrect(c, 290, 660, 70, 70, 6), COL.yellow, 4); shape(c, () => rrect(c, 300, 670, 50, 50, 4), COL.orange, 3);
  // a doll and a cloth rabbit in the second circle
  person(c, 720, 640, 180);
  shape(c, () => ell(c, 800, 660, 36, 48), COL.cloth); shape(c, () => ell(c, 800, 590, 30, 30), COL.cloth); shape(c, () => ell(c, 788, 548, 9, 30), COL.cloth, 4); shape(c, () => ell(c, 812, 548, 9, 30), COL.cloth, 4);
  shape(c, () => ell(c, 792, 586, 4, 4), INK, 0); shape(c, () => ell(c, 808, 586, 4, 4), INK, 0);
};
// term.0 Material: a steel spoon, a wooden spoon and a red plastic spoon
const term0 = (c: Ctx) => {
  ground(c);
  for (const x of [300, 540, 780]) shadow(c, x + 20, 850, 60, 18);
  spoon(c, 300, 540, 520, -Math.PI / 2);
  woodSpoon(c, 540, 540, 520, -Math.PI / 2);
  spoon(c, 780, 540, 520, -Math.PI / 2, COL.red, "#b53a2c");
};
// term.3 Test: the girl taps a steel tumbler with a spoon, and it rings
const term3 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 836, 150, 28);
  tumbler(c, 460, 830, 230, 320);
  girl(c, 860, 1010, 640, { armL: [Math.PI * 0.9, Math.PI * 0.85] });
  spoon(c, 650, 640, 200, Math.PI - 0.15);
  for (const [dx, s] of [[-210, -1], [-260, -1], [210, 1], [260, 1]] as number[][]) { c.beginPath(); c.arc(460 + dx * 0.2, 640, Math.abs(dx), s < 0 ? Math.PI * 0.75 : -Math.PI * 0.25, s < 0 ? Math.PI * 1.25 : Math.PI * 0.25); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
};
// term.4 Float: a pencil floating on the water in a bucket
const term4 = (c: Ctx) => {
  ground(c);
  const ly = bucket(c, 540, 960, 640, 600);
  pencil(c, 540, ly - 4, 420, -0.04);
};
// term.5 Sink: a coin at the bottom of the bucket, bubbles above it
const term5 = (c: Ctx) => {
  ground(c);
  bucket(c, 540, 960, 640, 600);
  coin(c, 540, 900, 60);
  bubble(c, 560, 790, 10); bubble(c, 535, 720, 8); bubble(c, 575, 660, 7);
};
// expl.3: the steel spoon sinks, the steel katori floats, water pushing up under it
const expl3 = (c: Ctx) => {
  ground(c);
  bucket(c, 290, 940, 440, 480);
  spoon(c, 290, 905, 200, 0.08);
  arrow(c, [[290, 640], [290, 760]], RED, 8);
  const ly = bucket(c, 790, 940, 440, 480);
  bowl(c, 790, ly - 8, 78);
  for (const x of [730, 790, 850]) arrow(c, [[x, 790], [x, 700]], RED, 8);
};

export const ic_materialsSortingMaterialsL1 = cards("sci.materials.sorting-materials.L1", [
  setup0, setup1, setup2, setup3,
  flowE1, flowA1, flowA2, flowA3, flowP1, term0, term3, term4, term5, expl3,
]);
