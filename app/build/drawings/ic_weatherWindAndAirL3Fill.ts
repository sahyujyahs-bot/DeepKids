import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, person, cards } from "./flatKit";

// WIND AND AIR (L3) · fill-in cards: cover, main idea, the open fridge, soil vs water in the sun,
// the breeze diary strip. Same flat look as the other DeepKids cards.

const sky = (c: Ctx, h = D) => { c.fillStyle = COL.sky; c.fillRect(0, 0, D, h); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.2, 0.45);
};
const cloud = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - 90 * s, y + 30 * s); c.arc(x - 50 * s, y + 10 * s, 40 * s, Math.PI, Math.PI * 1.6); c.arc(x + 5 * s, y - 20 * s, 52 * s, Math.PI * 1.1, Math.PI * 1.9); c.arc(x + 60 * s, y + 8 * s, 40 * s, Math.PI * 1.35, Math.PI * 2.1); c.lineTo(x + 95 * s, y + 30 * s); c.closePath(); };
  shape(c, p, WHITE, 5);
};
// a thin line of smoke from a point, bending to the side (dx) as it rises
const smoke = (c: Ctx, x: number, y: number, dx: number, len: number) => {
  const p = (w: number, col: string) => { c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x, y - len * 0.35, x + dx * 0.4, y - len * 0.5, x + dx, y - len * 0.75); c.bezierCurveTo(x + dx * 1.3, y - len * 0.85, x + dx * 1.5, y - len * 0.95, x + dx * 1.6, y - len); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); };
  p(14, INK); p(8, "#d9d4cc");
};
// a glass thermometer standing in a bowl, bulb at (x, y); fill 0..1 of the red column
const thermometer = (c: Ctx, x: number, y: number, h: number, fill: number) => {
  shape(c, () => rrect(c, x - 16, y - h, 32, h, 16), WHITE, 5);
  shape(c, () => rrect(c, x - 7, y - h + 20, 14, h - 36, 7), "#f3d9d6", 0);
  shape(c, () => rrect(c, x - 7, y - 16 - (h - 36) * fill, 14, (h - 36) * fill, 7), RED, 0);
  shape(c, () => ell(c, x, y, 26, 26), RED, 5);
  for (let i = 1; i <= 5; i++) line(c, [[x + 18, y - 30 - i * (h - 60) / 5], [x + 32, y - 30 - i * (h - 60) / 5]], 3, INK);
};

// card: a kite high in the wind, the child holding the string
const intro = (c: Ctx) => {
  ground(c); sky(c, 860);
  cloud(c, 190, 250, 1); cloud(c, 900, 170, 0.8);
  shape(c, () => { c.moveTo(0, 860); c.quadraticCurveTo(540, 790, D, 860); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, COL.green);
  // the wind, three red arrows across the sky
  arrow(c, [[60, 420], [300, 420]]); arrow(c, [[80, 530], [330, 530]]); arrow(c, [[60, 640], [280, 640]]);
  // string from the child's hand to the kite
  line(c, [[700, 740], [600, 560], [560, 420], [585, 290]], 5, INK);
  // tail with bows
  const tail: number[][] = [[600, 420], [560, 470], [590, 520], [540, 570], [560, 620]];
  line(c, tail, 5, INK);
  tail.slice(1).forEach(([x, y], i) => shape(c, () => { c.moveTo(x - 26, y - 14); c.lineTo(x + 26, y + 14); c.lineTo(x + 26, y - 14); c.lineTo(x - 26, y + 14); c.closePath(); }, i % 2 ? COL.yellow : COL.pink, 4));
  // the kite: a big diamond leaning into the wind
  c.save(); c.translate(600, 250); c.rotate(0.3);
  shape(c, () => polyP(c, [[0, -170], [150, 0], [0, 170], [-150, 0]]), COL.red);
  shape(c, () => polyP(c, [[0, -170], [150, 0], [0, 0]]), COL.yellow, 6);
  shape(c, () => polyP(c, [[0, 170], [-150, 0], [0, 0]]), COL.yellow, 6);
  line(c, [[0, -170], [0, 170]], 6); line(c, [[-150, 0], [150, 0]], 6);
  c.restore();
  // the child, looking up, one arm up holding the string
  shadow(c, 800, 1010, 150, 24);
  person(c, 780, 1000, 420, { armL: [-Math.PI * 0.62, -Math.PI * 0.48], armR: [Math.PI * 0.6, Math.PI * 0.55] });
};

// card: the main idea, warm air over land rises, cooler air from the sea moves in (the sea breeze)
const summary = (c: Ctx) => {
  ground(c); sky(c, 700);
  sun(c, 870, 170, 95);
  // sea on the left, land on the right
  shape(c, () => { c.moveTo(0, 700); c.lineTo(540, 700); c.lineTo(540, D); c.lineTo(0, D); c.closePath(); }, COL.water, 0);
  for (let i = 0; i < 4; i++) shine(c, [[60 + i * 40, 770 + i * 60], [160 + i * 40, 770 + i * 60]], 8);
  shape(c, () => { c.moveTo(500, 700); c.quadraticCurveTo(600, 640, 760, 660); c.quadraticCurveTo(900, 680, D, 650); c.lineTo(D, D); c.lineTo(500, D); c.closePath(); }, COL.soil);
  shade(c, () => { c.moveTo(500, 700); c.quadraticCurveTo(600, 640, 760, 660); c.quadraticCurveTo(900, 680, D, 650); c.lineTo(D, D); c.lineTo(500, D); c.closePath(); }, COL.soilDk, 0, 160, 0.5);
  line(c, [[0, 700], [540, 700]], 6, INK);
  // a small hut on the land so it reads as land
  shape(c, () => polyP(c, [[760, 640], [840, 560], [920, 640]]), COL.red, 5);
  shape(c, () => rrect(c, 775, 640, 130, 80, 4), COL.paper, 5);
  // warm land: wavy heat lines rising
  for (const x of [640, 700, 980]) { c.beginPath(); c.moveTo(x, 640); c.bezierCurveTo(x - 18, 610, x + 18, 580, x, 550); c.strokeStyle = COL.orange; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  // the loop of air: up over land, out to sea high, down over sea, in to land low
  arrow(c, [[800, 560], [800, 360]], RED, 14);
  arrow(c, [[760, 300], [300, 300]], RED, 14);
  arrow(c, [[230, 340], [230, 560]], COL.blueDk, 14);
  arrow(c, [[260, 620], [720, 620]], COL.blueDk, 14);
};

// card: the open fridge from the side, agarbatti smoke bending out at the bottom and in at the top
const flowE1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d5bb"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6, INK);
  // the fridge body, seen from the side (its open side on the right)
  shadow(c, 420, 915, 260, 28);
  shape(c, () => rrect(c, 160, 160, 440, 750, 24), COL.steel);
  shade(c, () => rrect(c, 160, 160, 440, 750, 24), COL.steelDk, -60, 0, 0.35);
  // the inside: cold blue, with two shelves and a few things
  shape(c, () => polyP(c, [[520, 190], [600, 190], [600, 880], [520, 880]]), COL.sky, 5);
  for (const y of [420, 640]) line(c, [[520, y], [600, y]], 5, INK);
  shape(c, () => rrect(c, 540, 350, 40, 66, 6), COL.green, 4);
  shape(c, () => rrect(c, 545, 580, 40, 56, 6), COL.yellow, 4);
  shape(c, () => ell(c, 560, 850, 24, 24), COL.orange, 4);
  // the door, swung open towards us, hinged on the right edge
  shape(c, () => polyP(c, [[600, 180], [700, 120], [700, 950], [600, 890]]), COL.steelIn);
  shape(c, () => polyP(c, [[612, 220], [690, 180], [690, 420], [612, 440]]), COL.steel, 4);
  shape(c, () => rrect(c, 660, 500, 14, 180, 7), COL.greyDk, 4);
  // the smoke: a grown-up holds the agarbatti at the bottom edge, smoke pushed out; at the top it bends in
  hand(c, 980, 870, Math.PI, 1.05, SKIN.adult, CLOTH.adult);
  shape(c, () => rrect(c, 790, 862, 150, 14, 7), COL.brown, 4);
  shape(c, () => ell(c, 790, 869, 10, 10), COL.red, 3);
  smoke(c, 790, 860, 110, 180);
  // the arrows: cold air out at the bottom, room air in at the top
  arrow(c, [[640, 780], [900, 780]], COL.blueDk, 14);
  arrow(c, [[960, 300], [740, 300]], RED, 14);
};

// card: a bowl of soil and a bowl of water side by side in the sun, thermometers in both, the soil warmer
const flowE3 = (c: Ctx) => {
  ground(c); sky(c, 560);
  sun(c, 540, 150, 90);
  shape(c, () => { c.moveTo(0, 560); c.lineTo(D, 560); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, "#e3d5bb", 0);
  line(c, [[0, 560], [D, 560]], 6, INK);
  // sunshine falling on both bowls
  for (const x of [330, 760]) line(c, [[540 + (x - 540) * 0.45, 290], [x, 520]], 6, COL.yellow);
  shadow(c, 330, 800, 200, 36); shadow(c, 760, 800, 200, 36);
  bowl(c, 310, 700, 190, COL.soil);
  shape(c, () => ell(c, 310, 700, 170, 32), COL.soilDk, 0);
  bowl(c, 770, 700, 190, COL.water);
  shape(c, () => ell(c, 770, 700, 170, 32), COL.waterDk, 0);
  shine(c, [[700, 690], [760, 686]], 7);
  thermometer(c, 310, 690, 330, 0.8);
  thermometer(c, 770, 690, 330, 0.42);
  // soil warms faster: a red arrow pushing the soil's column up
  arrow(c, [[400, 560], [400, 400]], RED, 12);
};

// card: a tissue strip tied to the window grill, streaming in the breeze; the child notes it down
const flowP1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f7efe0"; c.fillRect(0, 0, D, D);
  // the window: frame, sky outside, grill bars
  shape(c, () => rrect(c, 150, 90, 780, 640, 12), COL.wood);
  shape(c, () => rrect(c, 200, 140, 680, 540, 6), COL.sky, 6);
  cloud(c, 700, 260, 0.9); cloud(c, 330, 480, 0.6);
  for (let i = 1; i < 6; i++) line(c, [[200 + i * 113, 140], [200 + i * 113, 680]], 10, INK);
  for (let i = 1; i < 3; i++) line(c, [[200, 140 + i * 180], [880, 140 + i * 180]], 10, INK);
  // the wind, from the left
  arrow(c, [[40, 400], [240, 400]], RED, 14);
  // the strip, tied to the second bar, streaming right and rippling
  shape(c, () => ell(c, 426, 320, 16, 14), COL.cloth, 5);
  const strip = (w: number, col: string, ln: number) => shape(c, () => { c.moveTo(426, 308); c.bezierCurveTo(520, 290, 600, 350, 700, 330); c.bezierCurveTo(760, 318, 800, 300, 850, 312); c.lineTo(846, 312 + w); c.bezierCurveTo(800, 300 + w, 760, 318 + w, 700, 330 + w); c.bezierCurveTo(600, 350 + w, 520, 290 + w, 426, 308 + w); c.closePath(); }, col, ln);
  strip(34, COL.cloth, 5);
  // the child below the window, pencil to notebook
  shadow(c, 560, 1040, 200, 26);
  person(c, 540, 1030, 400, { armL: [Math.PI * 0.3, -Math.PI * 0.1], armR: [Math.PI * 0.7, Math.PI * 1.05] });
  shape(c, () => rrect(c, 620, 800, 150, 110, 8), COL.paper, 5);
  for (let i = 0; i < 3; i++) line(c, [[640, 830 + i * 26], [740, 830 + i * 26]], 4, COL.grey);
  shape(c, () => rrect(c, 608, 745, 12, 90, 5), COL.yellow, 4);
  shape(c, () => polyP(c, [[608, 835], [620, 835], [614, 852]]), INK, 0);
};

export const ic_weatherWindAndAirL3Fill = cards("sci.weather.wind-and-air.L3 fill", [intro, summary, flowE1, flowE3, flowP1]);
