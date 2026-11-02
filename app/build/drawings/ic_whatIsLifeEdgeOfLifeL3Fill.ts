import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, arrow, cards, ell, ground, hand, line, person, plate, rnd, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// THE EDGE OF LIFE (L3) · fill cards: cover, main idea, three experiments, the museum project.

// a candle standing on a small steel dish, base centre (x, y), body height h
const candle = (c: Ctx, x: number, y: number, h: number, lit: boolean, w = 70) => {
  shadow(c, x + 20, y + 10, w * 1.4, 18);
  shape(c, () => ell(c, x, y, w * 1.3, 22), COL.steel, 5);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 10), "#fff4d6");
  shade(c, () => rrect(c, x - w / 2, y - h, w, h, 10), "#e2cfa6", w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.16), "#fff9e8", 5);
  line(c, [[x, y - h - 2], [x, y - h - 26]], 5, INK);
  if (lit) {
    shape(c, () => { c.moveTo(x, y - h - 150); c.bezierCurveTo(x + 48, y - h - 90, x + 40, y - h - 20, x, y - h - 18); c.bezierCurveTo(x - 40, y - h - 20, x - 48, y - h - 90, x, y - h - 150); c.closePath(); }, COL.yellow, 5);
    shape(c, () => { c.moveTo(x, y - h - 96); c.bezierCurveTo(x + 22, y - h - 66, x + 20, y - h - 24, x, y - h - 22); c.bezierCurveTo(x - 20, y - h - 24, x - 22, y - h - 66, x, y - h - 96); c.closePath(); }, COL.orange, 0);
  }
};
// a steel spoon, bowl centre (x, y), handle going off at angle an; misted = pale fog on the bowl
const spoon = (c: Ctx, x: number, y: number, an: number, misted: boolean, s = 1) => {
  const hx = x + Math.cos(an) * 260 * s, hy = y + Math.sin(an) * 260 * s;
  line(c, [[x, y], [hx, hy]], 30 * s, INK); line(c, [[x, y], [hx, hy]], 20 * s, COL.steel);
  shape(c, () => ell(c, x, y, 70 * s, 48 * s, an), COL.steel, 6);
  shape(c, () => ell(c, x, y, 52 * s, 32 * s, an), COL.steelIn, 4);
  if (misted) { shape(c, () => ell(c, x, y, 52 * s, 32 * s, an), "rgba(220,240,255,0.9)", 0); const r = rnd(3); for (let i = 0; i < 9; i++) { const a = r() * 6.3, d = r() * 36 * s; shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6, 6 * s, 6 * s), COL.water, 2); } }
};
// a small plastic bottle, base centre (x, y); balloon on the neck inflated 0..1; cloudy liquid with yeast
const bottle = (c: Ctx, x: number, y: number, inflate: number, bubbles: boolean, liquid: string) => {
  shadow(c, x + 18, y + 8, 90, 18);
  const body = () => { c.moveTo(x - 80, y); c.lineTo(x - 80, y - 250); c.quadraticCurveTo(x - 80, y - 320, x - 30, y - 340); c.lineTo(x - 30, y - 380); c.lineTo(x + 30, y - 380); c.lineTo(x + 30, y - 340); c.quadraticCurveTo(x + 80, y - 320, x + 80, y - 250); c.lineTo(x + 80, y); c.closePath(); };
  shape(c, () => { c.moveTo(x - 76, y - 4); c.lineTo(x - 76, y - 200); c.lineTo(x + 76, y - 200); c.lineTo(x + 76, y - 4); c.closePath(); }, liquid, 0);
  if (bubbles) { const r = rnd(5); for (let i = 0; i < 14; i++) { const bx = x - 60 + r() * 120, by = y - 20 - r() * 170; shape(c, () => ell(c, bx, by, 7 + r() * 6, 7 + r() * 6), WHITE, 2.5); } }
  shape(c, body, COL.glass, 6);
  shine(c, [[x - 58, y - 230], [x - 58, y - 60]], 8);
  // the balloon over the neck
  const br = 26 + inflate * 120;
  shape(c, () => rrect(c, x - 38, y - 400, 76, 30, 8), COL.red, 5);
  shape(c, () => ell(c, x, y - 400 - br * (inflate > 0.2 ? 1 : 0.5) - 6, br * 0.82, br), COL.red, 6);
  shade(c, () => ell(c, x, y - 400 - br * (inflate > 0.2 ? 1 : 0.5) - 6, br * 0.82, br), "#b53a29", br * 0.3, 0);
  if (inflate > 0.2) shine(c, [[x - br * 0.4, y - 400 - br * 1.6], [x - br * 0.5, y - 400 - br * 1.1]], 7);
};
// a wide glass jar, base centre (x, y), a pencil across the top with a thread hanging into the water
const jar = (c: Ctx, x: number, y: number, water: string) => {
  shadow(c, x + 22, y + 10, 150, 26);
  shape(c, () => { c.moveTo(x - 140, y - 20); c.lineTo(x - 140, y - 400); c.lineTo(x + 140, y - 400); c.lineTo(x + 140, y - 20); c.quadraticCurveTo(x + 140, y, x + 120, y); c.lineTo(x - 120, y); c.quadraticCurveTo(x - 140, y, x - 140, y - 20); c.closePath(); }, water, 0);
  shape(c, () => { c.moveTo(x - 140, y - 20); c.lineTo(x - 140, y - 400); c.lineTo(x + 140, y - 400); c.lineTo(x + 140, y - 20); c.quadraticCurveTo(x + 140, y, x + 120, y); c.lineTo(x - 120, y); c.quadraticCurveTo(x - 140, y, x - 140, y - 20); c.closePath(); }, COL.glass, 6);
  shape(c, () => ell(c, x, y - 400, 140, 26), "rgba(255,255,255,0.4)", 5);
  shine(c, [[x - 110, y - 360], [x - 110, y - 80]], 8);
  // pencil
  shape(c, () => rrect(c, x - 200, y - 428, 400, 26, 6), COL.yellow, 5);
  shape(c, () => { c.moveTo(x + 200, y - 428); c.lineTo(x + 240, y - 415); c.lineTo(x + 200, y - 402); c.closePath(); }, COL.wood, 5);
  shape(c, () => { c.moveTo(x + 226, y - 420); c.lineTo(x + 240, y - 415); c.lineTo(x + 226, y - 410); c.closePath(); }, INK, 0);
  // thread with a button at the end
  line(c, [[x, y - 414], [x, y - 60]], 4, INK);
  shape(c, () => ell(c, x, y - 52, 22, 12), COL.blue, 4);
};
// a cube-shaped salt crystal, centre (x, y), size s
const crystal = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s, y - s, s * 2, s * 2, 3), "#f6f8ff", 4);
  shade(c, () => rrect(c, x - s, y - s, s * 2, s * 2, 3), COL.steel, s * 0.6, 0, 0.5);
};
// a sprouting seed: soaked moong, white root curling down, a small green shoot up
const sprout = (c: Ctx, x: number, y: number, r: number, rootLen: number, shoot: boolean) => {
  if (rootLen > 0) { const p = [[x, y + r * 0.3], [x + r * 0.5, y + r * 0.3 + rootLen * 0.5], [x + r * 0.2, y + r * 0.3 + rootLen]]; line(c, p, r * 0.55 + 8, INK); line(c, p, r * 0.55, COL.paper); }
  if (shoot) { line(c, [[x, y - r * 0.4], [x - r * 0.3, y - r * 1.6]], r * 0.3 + 8, INK); line(c, [[x, y - r * 0.4], [x - r * 0.3, y - r * 1.6]], r * 0.3, COL.greenLt); shape(c, () => ell(c, x - r * 0.75, y - r * 1.9, r * 0.5, r * 0.3, -0.5), COL.leaf, 4); shape(c, () => ell(c, x + r * 0.05, y - r * 2.0, r * 0.5, r * 0.3, 0.5), COL.leaf, 4); }
  shape(c, () => ell(c, x, y, r, r * 0.75), COL.greenLt, 5);
  shade(c, () => ell(c, x, y, r, r * 0.75), COL.green, r * 0.3, r * 0.2);
  line(c, [[x - r * 0.4, y - r * 0.1], [x + r * 0.4, y - r * 0.1]], r * 0.16, "#f4f1e4");
};
// a cotton pad lying on a plate centred (x, y)
const cotton = (c: Ctx, x: number, y: number, rx: number, ry: number, wet: boolean) => {
  shape(c, () => { c.moveTo(x - rx, y - ry * 0.3); c.quadraticCurveTo(x - rx * 0.6, y - ry * 1.2, x, y - ry); c.quadraticCurveTo(x + rx * 0.7, y - ry * 1.2, x + rx, y - ry * 0.2); c.quadraticCurveTo(x + rx * 0.9, y + ry * 1.1, x, y + ry); c.quadraticCurveTo(x - rx * 0.8, y + ry * 1.15, x - rx, y - ry * 0.3); c.closePath(); }, wet ? COL.sky : COL.cloth, 5);
};

// cover: three tricky cases side by side on the counter: a lit candle, a sprouting seed, a salt crystal
const intro = (c: Ctx) => {
  ground(c);
  candle(c, 230, 760, 260, true, 90);
  plate(c, 560, 780, 190, 70);
  cotton(c, 560, 775, 130, 42, true);
  sprout(c, 560, 700, 56, 90, true);
  const px = 860, py = 780;
  shadow(c, px + 18, py + 44, 120, 24);
  shape(c, () => ell(c, px, py + 30, 120, 30), COL.black, 5);
  crystal(c, px, py - 30, 70); crystal(c, px - 60, py - 10, 36); crystal(c, px + 70, py - 4, 30);
  line(c, [[0, 835], [1080, 835]], 6, INK);
};

// main idea: a spoon held over a candle flame mists over; a child breathing on a spoon mists it too
const summary = (c: Ctx) => {
  ground(c);
  line(c, [[0, 900], [1080, 900]], 6, INK);
  candle(c, 300, 890, 220, true, 80);
  arrow(c, [[300, 560], [300, 470]]);
  spoon(c, 300, 390, -0.35, true, 1.1);
  hand(c, 640, 290, Math.PI, 1.2, SKIN.adult, CLOTH.adult);
  // the child blowing on a spoon
  person(c, 860, 900, 560, { armL: [Math.PI * 0.85, -Math.PI * 0.5], armR: [Math.PI * 0.6, Math.PI * 0.5] });
  shape(c, () => ell(c, 860, 525, 14, 12), INK, 0);
  arrow(c, [[830, 525], [740, 525]]);
  spoon(c, 690, 525, Math.PI * 0.5, true, 0.8);
};

// e1: three plates after six days: seeds on wet cotton sprout; pebbles on wet cotton and seeds on dry cotton do nothing
const e1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 1000], [1080, 1000]], 6, INK);
  // wet cotton + seeds: sprouted, big and front
  plate(c, 540, 700, 330, 130);
  cotton(c, 540, 690, 240, 80, true);
  sprout(c, 430, 650, 40, 70, true); sprout(c, 540, 690, 42, 60, true); sprout(c, 650, 640, 38, 75, true); sprout(c, 600, 730, 36, 40, true); sprout(c, 480, 740, 34, 30, false);
  arrow(c, [[760, 640], [760, 480]]);
  // wet cotton + pebbles
  plate(c, 230, 300, 190, 72);
  cotton(c, 230, 296, 135, 44, true);
  const r = rnd(11);
  for (let i = 0; i < 8; i++) { const x = 150 + (i % 4) * 54 + r() * 8, y = 275 + Math.floor(i / 4) * 40 + r() * 6; shape(c, () => ell(c, x, y, 16, 12, r()), COL.grey, 4); }
  // dry cotton + seeds
  plate(c, 850, 300, 190, 72);
  cotton(c, 850, 296, 135, 44, false);
  for (let i = 0; i < 8; i++) { const x = 770 + (i % 4) * 54 + r() * 8, y = 275 + Math.floor(i / 4) * 40 + r() * 6; shape(c, () => ell(c, x, y, 14, 10, r()), COL.green, 4); }
};

// e2: three bottles with balloons: warm sugar water + yeast blows its balloon up; cold stays small; no yeast stays flat
const e2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 900], [1080, 900]], 6, INK);
  const yeast = "#e8d7b6";
  bottle(c, 200, 880, 1, true, yeast);
  bottle(c, 540, 880, 0.3, false, yeast);
  bottle(c, 880, 880, 0, false, COL.water);
  arrow(c, [[360, 620], [360, 360]]);
  write(c, "1", 180, 920, 60); write(c, "2", 515, 920, 60); write(c, "3", 855, 920, 60);
};

// e3: two jars side by side: salty water grows white crystals on the thread; plain water grows nothing
const e3 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 960], [1080, 960]], 6, INK);
  jar(c, 300, 920, "#d9edf7");
  const r = rnd(21);
  for (let i = 0; i < 16; i++) { const t = r(), s = 10 + r() * 22; crystal(c, 300 + (r() - 0.5) * 50, 600 + t * 290, s); }
  for (let i = 0; i < 12; i++) crystal(c, 180 + r() * 240, 905 + r() * 10, 8 + r() * 10);
  arrow(c, [[520, 560], [520, 800]]);
  jar(c, 790, 920, COL.water);
};

// p1: the museum: a long table with six tricky cases, each on a label card, a child showing them
const p1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 1000], [1080, 1000]], 6, INK);
  shadow(c, 560, 990, 500, 24);
  shape(c, () => { c.moveTo(60, 560); c.lineTo(1020, 560); c.lineTo(1060, 700); c.lineTo(20, 700); c.closePath(); }, COL.wood);
  shape(c, () => rrect(c, 20, 700, 1040, 50, 6), COL.woodDk, 5);
  for (const lx of [70, 990]) { line(c, [[lx, 750], [lx, 990]], 26, INK); line(c, [[lx, 750], [lx, 990]], 16, COL.woodDk); }
  // label cards on the table
  for (let i = 0; i < 6; i++) shape(c, () => rrect(c, 70 + i * 160, 620, 110, 60, 6), COL.paper, 4);
  for (let i = 0; i < 6; i++) { const lx = 85 + i * 160; line(c, [[lx, 640], [lx + 60, 640]], 4, COL.greyDk); line(c, [[lx, 660], [lx + 40, 660]], 4, COL.greyDk); }
  // exhibits standing behind the cards, left to right
  // 1 a small glass with the crystal thread hanging from a pencil
  shape(c, () => rrect(c, 90, 440, 100, 150, 8), COL.glass, 5);
  shape(c, () => rrect(c, 60, 426, 160, 16, 4), COL.yellow, 4);
  line(c, [[140, 442], [140, 560]], 3, INK);
  for (let k = 0; k < 5; k++) crystal(c, 140 + (k % 2 ? 7 : -6), 470 + k * 20, 10 + (k % 3) * 3);
  // 2 sprouted seed on a small plate
  plate(c, 300, 585, 70, 26); sprout(c, 300, 560, 26, 30, true);
  // 3 unlit candle
  candle(c, 450, 592, 120, false, 44);
  // 4 toy robot
  shape(c, () => rrect(c, 580, 470, 110, 120, 10), COL.blue); shade(c, () => rrect(c, 580, 470, 110, 120, 10), COL.blueDk, 30, 0);
  shape(c, () => rrect(c, 595, 400, 80, 70, 10), COL.steel, 5);
  shape(c, () => ell(c, 618, 432, 10, 10), INK, 0); shape(c, () => ell(c, 652, 432, 10, 10), INK, 0);
  line(c, [[635, 400], [635, 375]], 4, INK); shape(c, () => ell(c, 635, 368, 9, 9), COL.red, 3);
  shape(c, () => rrect(c, 560, 480, 22, 70, 8), COL.steel, 4); shape(c, () => rrect(c, 688, 480, 22, 70, 8), COL.steel, 4);
  // 5 drawing of a virus on paper
  shape(c, () => rrect(c, 740, 420, 130, 170, 6), COL.paper, 5);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[805, 505], [805 + Math.cos(a) * 50, 505 + Math.sin(a) * 50]], 5, COL.purple); shape(c, () => ell(c, 805 + Math.cos(a) * 50, 505 + Math.sin(a) * 50, 6, 6), COL.purple, 2); }
  shape(c, () => ell(c, 805, 505, 32, 32), COL.purple, 4);
  // 6 drawing of a water bear on paper
  shape(c, () => rrect(c, 900, 420, 150, 170, 6), COL.paper, 5);
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) shape(c, () => ell(c, 935 + k * 26, 505 + s * 30, 9, 16), COL.teal, 3);
  shape(c, () => ell(c, 975, 505, 60, 32), COL.teal, 4); shade(c, () => ell(c, 975, 505, 60, 32), COL.tealDk, 14, 10);
  shape(c, () => ell(c, 1022, 505, 18, 14), COL.teal, 4); shape(c, () => ell(c, 1028, 503, 4, 4), INK, 0);
  // the child presenting, standing in front at the left
  person(c, 150, 990, 440, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [-Math.PI * 0.25, -Math.PI * 0.15] });
};

export const ic_whatIsLifeEdgeOfLifeL3Fill = cards("sci.what-is-life.edge-of-life.L3 fill", [intro, summary, e1, e2, e3, p1]);
