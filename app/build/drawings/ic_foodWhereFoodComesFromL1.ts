import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, leaf, hand, person, write, cards } from "./flatKit";

// WHERE FOOD COMES FROM · L1 · set-up cards for the nectar-to-honey test, then card pictures.
// Flat kit look: bold outline, flat colours, shade to the lower right, soft shadow.

const HONEY = "#f0a52a", HONEY_DK = "#c77d12", SUGAR = "#f6f1e6";

// ---------------------------------------------------------------- shared bits
// a ceiling fan hanging from the top edge, hub at (x, y)
const fan = (c: Ctx, x: number, y: number) => {
  line(c, [[x, 0], [x, y - 40]], 14, INK); line(c, [[x, 0], [x, y - 40]], 6, COL.grey);
  shape(c, () => ell(c, x - 230, y, 210, 24), COL.cloth); shade(c, () => ell(c, x - 230, y, 210, 24), COL.grey, 0, 10);
  shape(c, () => ell(c, x + 230, y, 210, 24), COL.cloth); shade(c, () => ell(c, x + 230, y, 210, 24), COL.grey, 0, 10);
  shape(c, () => ell(c, x, y + 30, 70, 38), COL.cloth); shade(c, () => ell(c, x, y + 30, 70, 38), COL.grey, 0, 14);
  shape(c, () => ell(c, x, y - 10, 58, 36), COL.teal); shade(c, () => ell(c, x, y - 10, 58, 36), COL.tealDk, 16, 10);
};
// wavy moving-air lines going down from (x, y)
const air = (c: Ctx, x: number, y: number, len: number, w = 5, col = COL.steelDk) => {
  c.save(); c.globalAlpha = 0.7; c.beginPath(); c.moveTo(x, y);
  for (let k = 0; k < len; k += 40) c.quadraticCurveTo(x + (Math.floor(k / 40) % 2 ? -18 : 18), y + k + 20, x, y + k + 40);
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); c.restore();
};
// wavy lines rising from (x, y)
const steam = (c: Ctx, x: number, y: number, len: number) => {
  c.save(); c.globalAlpha = 0.55; c.beginPath(); c.moveTo(x, y);
  for (let k = 0; k < len; k += 40) c.quadraticCurveTo(x + (Math.floor(k / 40) % 2 ? -16 : 16), y - k - 20, x, y - k - 40);
  c.strokeStyle = COL.blueDk; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); c.restore();
};
// a coin-sized drop of thin sugar water lying on a plate
const thinDrop = (c: Ctx, x: number, y: number, r = 48) => { shape(c, () => ell(c, x, y, r, r * 0.42), COL.water, 4); shine(c, [[x - r * 0.5, y - r * 0.12], [x - r * 0.1, y - r * 0.2]], 6); };
// a thick golden blob of honey-like sugar
const thickDrop = (c: Ctx, x: number, y: number, r = 40) => { shadow(c, x + 6, y + r * 0.45, r, r * 0.25); shape(c, () => ell(c, x, y, r, r * 0.6), HONEY, 5); shade(c, () => ell(c, x, y, r, r * 0.6), HONEY_DK, r * 0.3, r * 0.15); shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.2, y - r * 0.3]], 6); };
// an upside-down katori covering something, rim centre (x, y), radius r
const dome = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.12, r * 1.05, r * 0.22);
  const p = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y - r * 0.9, x + r * 0.95, y - r * 0.9, x + r, y); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, r * 0.35, 0);
  shape(c, () => ell(c, x, y, r, r * 0.2), COL.steelDk, 5);
  shine(c, [[x - r * 0.55, y - r * 0.4], [x - r * 0.3, y - r * 0.6]], 8);
};
// a spoon, bowl at (x, y), handle pointing at angle an
const spoon = (c: Ctx, x: number, y: number, an: number, len = 220, heap?: string) => {
  const hx = x + Math.cos(an) * len, hy = y + Math.sin(an) * len;
  line(c, [[x, y], [hx, hy]], 30, INK); line(c, [[x, y], [hx, hy]], 18, COL.steel);
  shape(c, () => ell(c, x, y, 48, 34, an), COL.steel); shade(c, () => ell(c, x, y, 48, 34, an), COL.steelDk, 12, 8);
  if (heap) { shape(c, () => ell(c, x, y - 8, 34, 20, an), heap, 4); }
};
// a wooden table top across the card at height y
const table = (c: Ctx, y: number, x0 = 60, x1 = 1020) => {
  shadow(c, (x0 + x1) / 2, y + 150, (x1 - x0) / 2, 24);
  for (const lx of [x0 + 70, x1 - 70]) { shape(c, () => rrect(c, lx - 22, y + 40, 44, 180, 8), COL.woodDk); }
  shape(c, () => rrect(c, x0, y, x1 - x0, 48, 10), COL.wood); shade(c, () => rrect(c, x0, y, x1 - x0, 48, 10), COL.woodDk, 0, 26);
};

// ---------------------------------------------------------------- set-up cards
// 1. the child stirs a spoon of sugar into a cup of water
const setup0 = (c: Ctx) => {
  ground(c);
  // sugar in a small jar at the left, 1 spoon; water, 4 spoons
  shadow(c, 200, 760, 110, 24);
  shape(c, () => rrect(c, 100, 540, 200, 220, 24), COL.glass, 5); shape(c, () => rrect(c, 110, 620, 180, 132, 18), SUGAR, 3); shape(c, () => rrect(c, 90, 510, 220, 44, 12), COL.teal); shade(c, () => rrect(c, 90, 510, 220, 44, 12), COL.tealDk, 30, 0);
  write(c, "1", 150, 420, 70);
  // the mixing cup, big and central, with water
  bowl(c, 600, 640, 250, COL.water);
  shape(c, () => ell(c, 600, 640, 250, 50), COL.water, 0);
  shine(c, [[420, 620], [470, 605]], 8);
  write(c, "4", 570, 760, 70);
  // the spoon in the water, held by the child's hand
  spoon(c, 560, 625, -1.05, 300, SUGAR);
  hand(c, 671, 432, -1.05, 1.1);
  // the stirring arrow round the cup
  arrow(c, [[380, 560], [430, 520], [520, 505], [640, 510], [740, 540]], RED, 10);
};
// 2. two plates under the fan, a drop on each, one covered by a katori
const setup1 = (c: Ctx) => {
  ground(c);
  fan(c, 540, 130);
  for (const x of [330, 540, 750]) air(c, x, 230, 300);
  table(c, 720);
  plate(c, 330, 690, 210, 70); thinDrop(c, 330, 686);
  plate(c, 760, 690, 210, 70); thinDrop(c, 760, 686); dome(c, 760, 690, 110);
};
// 3. next morning: both plates tilted, the open drop stays, the covered drop runs
const setup2 = (c: Ctx) => {
  ground(c);
  const tilted = (x: number, y: number, draw: () => void) => {
    c.save(); c.translate(x, y); c.rotate(-0.45);
    shadow(c, 20, 40, 210, 180); shape(c, () => ell(c, 0, 0, 210, 180), COL.steel); shape(c, () => ell(c, 0, -6, 176, 146), COL.steelIn, 4);
    draw(); c.restore();
  };
  tilted(300, 560, () => { thickDrop(c, -20, -40, 44); });
  tilted(790, 560, () => { thinDrop(c, -30, -60, 40); line(c, [[-20, -40], [40, 40], [90, 110]], 9, COL.waterDk); line(c, [[-20, -40], [40, 40], [90, 110]], 4, COL.drop); });
  // the child's hands tilting each plate up at the left rim
  hand(c, 179, 453, -0.9, 1); hand(c, 669, 453, -0.9, 1);
  arrow(c, [[640, 760], [760, 880]], RED, 9);
};

// ---------------------------------------------------------------- card pictures
// flow.e1 · the child watches the two drops under the fan
const flowE1 = (c: Ctx) => {
  ground(c);
  fan(c, 600, 120);
  for (const x of [480, 640, 800]) air(c, x, 215, 330);
  person(c, 200, 1000, 640, { armR: [-0.15, -0.35] });
  table(c, 740, 360, 1040);
  plate(c, 540, 710, 170, 58); thinDrop(c, 540, 706, 40);
  plate(c, 880, 710, 150, 52); thinDrop(c, 880, 706, 36); dome(c, 880, 710, 86);
  arrow(c, [[640, 300], [600, 560], [560, 650]], RED, 9);
};
// flow.a2 · the feely bag: the child's hand inside, the grown-up watches, whole foods on the mat
const flowA2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 820, 960, 180, 30), COL.wood, 5);
  person(c, 330, 930, 620, { armR: [0.3, 0.1] });
  person(c, 880, 950, 780, { adult: true, armL: [Math.PI * 0.75, Math.PI * 0.62] });
  // the cloth bag with a gathered mouth
  shadow(c, 660, 860, 190, 32);
  shape(c, () => { c.moveTo(560, 520); c.bezierCurveTo(430, 600, 430, 860, 640, 860); c.bezierCurveTo(850, 860, 850, 600, 740, 520); c.closePath(); }, COL.cloth);
  shade(c, () => { c.moveTo(560, 520); c.bezierCurveTo(430, 600, 430, 860, 640, 860); c.bezierCurveTo(850, 860, 850, 600, 740, 520); c.closePath(); }, COL.grey, 60, 0, 0.35);
  shape(c, () => ell(c, 650, 520, 96, 30), COL.greyDk, 5);
  line(c, [[560, 520], [740, 520]], 8, INK);
  for (let k = 0; k < 5; k++) line(c, [[590 + k * 30, 540], [585 + k * 30, 600]], 3, COL.greyDk);
  // the child's forearm going into the mouth of the bag
  line(c, [[493, 489], [640, 528]], 47, INK); line(c, [[493, 489], [640, 528]], 37, CLOTH.child);
  shape(c, () => ell(c, 648, 530, 24, 18), SKIN.child, 5);
  // whole foods in a row in front
  shadow(c, 420, 955, 70, 14); shape(c, () => ell(c, 400, 935, 62, 44), COL.brown); shade(c, () => ell(c, 400, 935, 62, 44), COL.soilDk, 18, 10);
  shadow(c, 560, 958, 60, 14); shape(c, () => ell(c, 545, 930, 50, 52), COL.pink); shade(c, () => ell(c, 545, 930, 50, 52), COL.purple, 16, 8, 0.4); line(c, [[545, 878], [550, 858]], 6, COL.greenDk);
  shadow(c, 690, 958, 55, 12); shape(c, () => ell(c, 675, 935, 54, 40), COL.yellow); shade(c, () => ell(c, 675, 935, 54, 40), COL.orange, 16, 8, 0.4);
  shape(c, () => { c.moveTo(760, 900); c.quadraticCurveTo(860, 870, 950, 920); c.quadraticCurveTo(940, 955, 920, 950); c.quadraticCurveTo(860, 910, 770, 935); c.closePath(); }, COL.yellow);
};
// flow.p1 · the food week sheet: seven boxes of lunches with green and red dots, a crayon in hand
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 420, 40);
  shape(c, () => rrect(c, 110, 120, 880, 800, 10), COL.paper, 6);
  const bw = 220, bh = 400;
  for (let i = 1; i < 4; i++) line(c, [[110 + i * bw, 120], [110 + i * bw, 920]], 4, COL.greyDk);
  line(c, [[110, 520], [990, 520]], 4, COL.greyDk);
  const r = rnd(5);
  const lunch = (x: number, y: number, k: number) => {
    // a small round plate with rice, a dal blob, a green veg, and curd on some days
    shape(c, () => ell(c, x, y, 80, 54), COL.steel, 4); shape(c, () => ell(c, x, y - 2, 66, 42), COL.steelIn, 3);
    shape(c, () => ell(c, x - 20, y - 2, 30, 20), WHITE, 3); shape(c, () => ell(c, x + 26, y + 10, 22, 14), COL.yellow, 3);
    leaf(c, x + 10, y - 26, 40, -0.6);
    const curd = k % 3 !== 1; if (curd) shape(c, () => ell(c, x + 34, y - 18, 18, 12), WHITE, 3);
    const dots = (n: number, col: string, yy: number) => { for (let j = 0; j < n; j++) shape(c, () => ell(c, x - 60 + j * 32, yy, 11, 11), col, 3); };
    dots(3 + Math.floor(r() * 2), COL.green, y + 90); dots(curd ? 1 + Math.floor(r() * 2) : 0, COL.red, y + 130);
  };
  for (let k = 0; k < 7; k++) { const col = k % 4, row = Math.floor(k / 4); write(c, String(k + 1), 130 + col * bw, 135 + row * bh, 44); lunch(220 + col * bw, 300 + row * bh, k); }
  // the eighth box: the two totals in their colours
  shape(c, () => ell(c, 800, 740, 20, 20), COL.green, 4); write(c, "23", 840, 712, 60, COL.greenDk, 8);
  shape(c, () => ell(c, 800, 850, 20, 20), COL.red, 4); write(c, "7", 840, 822, 60, COL.red, 8);
  // the child's hand with a green crayon, drawing a dot
  line(c, [[590, 1010], [500, 760]], 26, INK); line(c, [[590, 1010], [500, 760]], 16, COL.green);
  hand(c, 760, 1010, -1.95, 1.1);
};
// term.0 · Food: a steel plate with rice, a banana and a glass of milk
const term0 = (c: Ctx) => {
  ground(c);
  plate(c, 500, 660, 400, 190);
  const r = rnd(3);
  shape(c, () => { c.moveTo(250, 660); c.bezierCurveTo(260, 540, 560, 540, 580, 660); c.closePath(); }, WHITE, 5);
  for (let i = 0; i < 90; i++) { const t = r(), u = r(); const x = 268 + t * 296, top = 660 - Math.sin(t * Math.PI) * 84; const y = top + u * (660 - top); shape(c, () => ell(c, x, y, 9, 4.5, r() * 3), "#fbf8ef", 1.5); }
  shape(c, () => { c.moveTo(560, 700); c.quadraticCurveTo(700, 640, 840, 700); c.quadraticCurveTo(850, 740, 820, 745); c.quadraticCurveTo(700, 690, 580, 740); c.quadraticCurveTo(545, 730, 560, 700); c.closePath(); }, COL.yellow);
  shade(c, () => { c.moveTo(560, 700); c.quadraticCurveTo(700, 640, 840, 700); c.quadraticCurveTo(850, 740, 820, 745); c.quadraticCurveTo(700, 690, 580, 740); c.quadraticCurveTo(545, 730, 560, 740); c.closePath(); }, COL.orange, 0, 18, 0.4);
  line(c, [[836, 700], [856, 696]], 8, COL.greenDk);
  glass(c, 760, 560, 170, 300, 0.8, WHITE);
};
// term.4 · Evaporate: clothes drying on a balcony line, water going up into the air
const term4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 700);
  shape(c, () => ell(c, 150, 150, 90, 90), COL.yellow, 5);
  // railing
  shape(c, () => rrect(c, 0, 700, D, 380, 0), COL.grey, 0);
  for (let x = 60; x < D; x += 120) line(c, [[x, 720], [x, 1080]], 14, COL.greyDk);
  line(c, [[0, 700], [D, 700]], 16, INK); line(c, [[0, 700], [D, 700]], 8, COL.greyDk);
  // the line, hooked at both edges
  line(c, [[0, 300], [540, 330], [D, 300]], 7, INK);
  // shirt, towel, dress, each with two pegs
  const peg = (x: number, y: number) => { shape(c, () => rrect(c, x - 9, y - 22, 18, 46, 5), COL.wood, 3); };
  shape(c, () => { c.moveTo(130, 330); c.lineTo(340, 330); c.lineTo(370, 400); c.lineTo(330, 420); c.lineTo(325, 620); c.lineTo(145, 620); c.lineTo(140, 420); c.lineTo(100, 400); c.closePath(); }, CLOTH.child);
  shade(c, () => { c.moveTo(130, 330); c.lineTo(340, 330); c.lineTo(370, 400); c.lineTo(330, 420); c.lineTo(325, 620); c.lineTo(145, 620); c.lineTo(140, 420); c.lineTo(100, 400); c.closePath(); }, CLOTH.childDk, 50, 0, 0.5);
  peg(150, 325); peg(320, 325);
  shape(c, () => rrect(c, 430, 320, 220, 320, 8), COL.blue); shade(c, () => rrect(c, 430, 320, 220, 320, 8), COL.blueDk, 60, 0, 0.5);
  for (let y = 360; y < 640; y += 40) line(c, [[440, y], [640, y]], 3, COL.blueDk);
  peg(450, 318); peg(630, 318);
  shape(c, () => { c.moveTo(770, 320); c.lineTo(900, 320); c.lineTo(990, 650); c.lineTo(680, 650); c.closePath(); }, COL.pink);
  shade(c, () => { c.moveTo(770, 320); c.lineTo(900, 320); c.lineTo(990, 650); c.lineTo(680, 650); c.closePath(); }, COL.purple, 70, 0, 0.3);
  peg(780, 312); peg(890, 312);
  // water going up into the air
  for (const x of [170, 250, 480, 560, 640, 760, 860]) steam(c, x, 300, 200);
  for (const x of [220, 540, 820]) arrow(c, [[x, 290], [x, 160]], RED, 7);
};

export const ic_foodWhereFoodComesFromL1 = cards("sci.food.where-food-comes-from.L1", [setup0, setup1, setup2, flowE1, flowA2, flowP1, term0, term4]);
