import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards, bowl } from "./flatKit";

// PUSHES AND PULLS (L1) · set-up cards and card pictures in the flat kit look.
// Same girl (SKIN.child, CLOTH.child) and same grown-up (SKIN.adult, CLOTH.adult) on every card.

const FLOOR = "#f3ebdc", TILE = "#d6cab6", BAND = "#d98b5f";
// a room: plain wall above, a tiled floor below the line at fy
const room = (c: Ctx, fy = 400) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, fy, D, D - fy);
  for (let x = 90; x < D; x += 180) line(c, [[x, fy], [x, D]], 3, TILE);
  for (let y = fy + 160; y < D; y += 160) line(c, [[0, y], [D, y]], 3, TILE);
  line(c, [[0, fy], [D, fy]], 5, INK);
};
// the dupatta start line, a pink strip laid down the floor at x
const startLine = (c: Ctx, x: number, fy = 400) => {
  shape(c, () => rrect(c, x - 20, fy + 30, 40, D - fy - 70, 12), COL.pink, 5);
  for (let y = fy + 70; y < D - 60; y += 60) shape(c, () => ell(c, x, y, 7, 7), COL.purple, 0);
};
// a lunch box, bottom centre at (x, y); open shows the inside, rice fills it
const lunchbox = (c: Ctx, x: number, y: number, w: number, h: number, open = false, rice = false) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 18);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, w * 0.12, 0);
  if (!open) {
    const lid = () => rrect(c, x - w / 2 - 8, y - h - 22, w + 16, h * 0.32, 14);
    shape(c, lid, COL.sky); shade(c, lid, COL.blue, w * 0.12, 0, 0.35);
    shape(c, () => rrect(c, x - 22, y - h - 32, 44, 28, 8), COL.yellow, 5);
  } else {
    shape(c, () => rrect(c, x - w / 2 + 12, y - h + 10, w - 24, h * 0.32, 10), rice ? COL.paper : COL.blueDk, 4);
    if (rice) { const r = rnd(3); for (let i = 0; i < 50; i++) shape(c, () => ell(c, x - w / 2 + 24 + r() * (w - 48), y - h + 18 + r() * (h * 0.26), 7, 4, r() * 3), WHITE, 2); }
  }
};
// a chappal lying on the floor, centre (x, y)
const chappal = (c: Ctx, x: number, y: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); shadow(c, 8, 8, 72, 30);
  shape(c, () => { c.moveTo(-70, 0); c.bezierCurveTo(-70, -34, -20, -36, 10, -30); c.bezierCurveTo(50, -26, 72, -14, 72, 0); c.bezierCurveTo(72, 16, 50, 28, 10, 30); c.bezierCurveTo(-20, 34, -70, 32, -70, 0); c.closePath(); }, COL.brown);
  line(c, [[-40, -20], [12, 2], [-40, 22]], 7, COL.red); line(c, [[12, 2], [40, 0]], 7, COL.red);
  c.restore();
};
// a coin and a spoon lying flat, as the other markers
const coin = (c: Ctx, x: number, y: number) => { shadow(c, x + 4, y + 4, 26, 14); shape(c, () => ell(c, x, y, 26, 14), COL.yellow, 4); };
const spoon = (c: Ctx, x: number, y: number) => { shadow(c, x + 6, y + 6, 70, 18); shape(c, () => ell(c, x - 40, y, 32, 20), COL.steel, 4); shape(c, () => rrect(c, x - 10, y - 7, 90, 14, 7), COL.steel, 4); };
// a cardboard box with a book standing inside, bottom centre at (x, y)
const cbox = (c: Ctx, x: number, y: number, w: number, h: number, book = true) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  if (book) { shape(c, () => rrect(c, x - w * 0.26, y - h - 46, w * 0.52, 80, 6), COL.red); line(c, [[x - w * 0.26 + 12, y - h - 34], [x + w * 0.26 - 12, y - h - 34]], 4, COL.paper); }
  const body = () => rrect(c, x - w / 2, y - h, w, h, 10);
  shape(c, body, COL.wood); shade(c, body, COL.woodDk, w * 0.12, 0);
  line(c, [[x - w / 2, y - h + 26], [x + w / 2, y - h + 26]], 5, INK);
  line(c, [[x, y - h + 26], [x, y]], 5, COL.woodDk);
};
const str = (c: Ctx, pts: number[][]) => { line(c, pts, 9, INK); line(c, pts, 4, COL.cloth); };
// a rubber band loop from (x, y), length len, at angle an
const band = (c: Ctx, x: number, y: number, len: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  c.beginPath(); rrect(c, 0, -13, len, 26, 13); c.strokeStyle = INK; c.lineWidth = 15; c.lineJoin = "round"; c.stroke(); c.strokeStyle = BAND; c.lineWidth = 7; c.stroke();
  c.restore();
};
// a doorway in a wall, bottom-left of the opening at (x, y), and a door panel hinged on the left,
// open toward the viewer (its free edge comes down and out)
const doorway = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - 26, y - h - 26, w + 52, h + 26, 8), COL.woodDk);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y], [x, y]]), COL.sky, 5);
};
const doorPanel = (c: Ctx, x: number, y: number, w: number, h: number, k: number) => {
  const p = () => polyP(c, [[x, y - h], [x + w, y - h + k], [x + w, y + k], [x, y]]);
  shape(c, p, COL.wood); shade(c, p, COL.woodDk, w * 0.12, 0, 0.4);
  shape(c, () => polyP(c, [[x + 30, y - h + 60], [x + w - 30, y - h + k + 60], [x + w - 30, y + k - 60], [x + 30, y - 60]]), COL.wood, 4);
  shape(c, () => ell(c, x + w - 48, y - h / 2 + k / 2, 14, 14), COL.yellow, 4);
};
// a person seen from above (for the door-from-above card), facing angle `an`, hands reaching `reach`
const topPerson = (c: Ctx, x: number, y: number, an: number, reach = 130, adult = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, cloth = adult ? CLOTH.adult : CLOTH.child;
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => ell(c, 0, 0, 62, 112), cloth);
  for (const s of [-1, 1]) { line(c, [[10, s * 85], [reach, s * 60]], 28, INK); line(c, [[10, s * 85], [reach, s * 60]], 16, cloth); shape(c, () => ell(c, reach, s * 60, 17, 17), skin, 5); }
  shape(c, () => ell(c, 0, 0, 54, 54), skin);
  shape(c, () => { c.arc(0, 0, 57, Math.PI * 0.42, Math.PI * 1.58); c.closePath(); }, CLOTH.hair, 5);
  c.restore();
};

// ------------------------------------------------------------------ set-up cards, e1
// 1. start line, empty box just behind it
const e1s0 = (c: Ctx) => {
  room(c);
  startLine(c, 620);
  lunchbox(c, 380, 880, 260, 200);
};
// 2. the girl kneels and pushes the box, letting go at the line; the box slides away
const e1s1 = (c: Ctx) => {
  room(c);
  startLine(c, 520);
  person(c, 180, 1000, 520, { sit: true, armR: [0, 0], armL: [0.1, 0] });
  lunchbox(c, 640, 940, 200, 160);
  hand(c, 400, 819, 0, 1.05, SKIN.child, CLOTH.child, true);
  arrow(c, [[770, 760], [960, 760]]);
};
// 3. a chappal beside the stopped box; the girl walks heel to toe from the line, counting
const e1s2 = (c: Ctx) => {
  room(c);
  startLine(c, 230);
  person(c, 470, 760, 400, { armR: [0.2, -0.3], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  lunchbox(c, 860, 820, 180, 140);
  chappal(c, 880, 950, 0.25);
  const xs = [310, 400, 490, 580, 670];
  xs.forEach((x, i) => { shape(c, () => ell(c, x, 905 + (i % 2) * 36, 40, 17), "#c9b99a", 3); shape(c, () => ell(c, x + 28, 905 + (i % 2) * 36, 14, 14), "#c9b99a", 3); write(c, String(i + 1), x - 18, 830 + (i % 2) * 36, 44); });
};
// 4. a grown-up pours rice into the open box; the girl waits to push again
const e1s3 = (c: Ctx) => {
  room(c);
  person(c, 190, 1000, 520, { armR: [0.1, -0.2] });
  lunchbox(c, 600, 900, 300, 170, true, true);
  const r = rnd(5); for (let i = 0; i < 26; i++) shape(c, () => ell(c, 655 + r() * 30 - (i / 26) * 50, 560 + i * 7 + r() * 10, 7, 4, r() * 3), WHITE, 2);
  c.save(); c.translate(760, 520); c.rotate(-0.8); bowl(c, 0, 0, 95, COL.paper); const rr = rnd(8); for (let i = 0; i < 30; i++) shape(c, () => ell(c, -80 + rr() * 160, -4 + rr() * 10, 7, 4, rr() * 3), WHITE, 2); c.restore();
  hand(c, 900, 470, Math.PI, 1.1, SKIN.adult, CLOTH.adult);
  arrow(c, [[520, 600], [520, 700]]);
};
// ------------------------------------------------------------------ set-up cards, e2
// 1. three boxes tied in a row, a book in each
const e2s0 = (c: Ctx) => {
  room(c);
  str(c, [[330, 840], [430, 840]]); str(c, [[650, 840], [750, 840]]);
  cbox(c, 220, 920, 230, 190); cbox(c, 540, 920, 230, 190); cbox(c, 860, 920, 230, 190);
};
// 2. the string from the front box to a rubber band, hooked on the girl's finger
const e2s1 = (c: Ctx) => {
  room(c);
  cbox(c, 230, 920, 260, 210);
  str(c, [[360, 790], [600, 790]]);
  band(c, 600, 790, 215);
  hand(c, 915, 790, Math.PI, 1.4);
};
// 3. pulling slowly: the band stretched long beside a paper strip, a grown-up marking it
const e2s2 = (c: Ctx) => {
  room(c);
  cbox(c, 160, 1000, 200, 180);
  person(c, 860, 1000, 520, { sit: true, armL: [Math.PI, Math.PI], armR: [Math.PI * 0.9, Math.PI] });
  str(c, [[255, 860], [390, 819]]);
  band(c, 390, 819, 240);
  shape(c, () => rrect(c, 370, 870, 310, 48, 6), WHITE, 4);
  line(c, [[480, 878], [480, 910]], 5, INK); line(c, [[560, 878], [560, 910]], 5, INK);
  line(c, [[630, 878], [630, 910]], 6, RED);
  hand(c, 700, 955, -1.9, 1.0, SKIN.adult, CLOTH.adult);
  line(c, [[645, 950], [628, 912]], 12, INK); line(c, [[645, 950], [628, 912]], 7, COL.yellow);
  arrow(c, [[520, 720], [700, 720]]);
};

// ------------------------------------------------------------------ card pictures
// the box test: a big push, the marks ahead
const fE1 = (c: Ctx) => {
  room(c);
  startLine(c, 500);
  coin(c, 660, 1000); spoon(c, 820, 1010); chappal(c, 980, 990, 0.3);
  person(c, 180, 1000, 520, { sit: true, armR: [0, 0], armL: [0.1, 0] });
  lunchbox(c, 620, 900, 200, 160);
  hand(c, 400, 819, 0, 1.05, SKIN.child, CLOTH.child, true);
  arrow(c, [[740, 740], [1000, 740]]);
};
// the pull-along train: three boxes, the band stretched long
const fE2 = (c: Ctx) => {
  room(c);
  str(c, [[180, 900], [230, 900]]); str(c, [[400, 900], [450, 900]]);
  cbox(c, 120, 1000, 140, 150); cbox(c, 340, 1000, 140, 150); cbox(c, 560, 1000, 140, 150);
  person(c, 900, 1000, 520, { armL: [Math.PI * 0.8, Math.PI * 0.9], armR: [Math.PI * 0.7, Math.PI * 0.85] });
  str(c, [[630, 870], [565, 755]]);
  band(c, 565, 755, 190, -0.22);
  arrow(c, [[560, 560], [760, 560]]);
};
// push hands, pull hands: the grown-up opens the fridge, the girl shows the fist sign
const fA1 = (c: Ctx) => {
  room(c);
  shadow(c, 740, 990, 220, 30);
  shape(c, () => rrect(c, 560, 300, 300, 690, 14), COL.steelIn);
  for (let y = 460; y < 960; y += 160) line(c, [[575, y], [845, y]], 5, COL.steelDk);
  shape(c, () => rrect(c, 700, 380, 50, 80, 8), COL.green, 4); shape(c, () => rrect(c, 760, 540, 70, 70, 8), COL.red, 4); shape(c, () => rrect(c, 600, 700, 90, 100, 8), COL.yellow, 4);
  const p = () => polyP(c, [[560, 300], [390, 380], [390, 930], [560, 990]]);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, 40, 0, 0.4);
  shape(c, () => rrect(c, 410, 560, 24, 130, 10), COL.greyDk, 4);
  arrow(c, [[420, 470], [250, 420]]);
  person(c, 160, 1000, 640, { adult: true, armR: [0.1, 0.05], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  person(c, 980, 1000, 500, { armL: [Math.PI * 0.75, -Math.PI * 0.45], armR: [Math.PI * 0.45, Math.PI * 0.5] });
};
// the two-sided door: the girl pushes the door shut, the grown-up watches
const fA2 = (c: Ctx) => {
  room(c);
  doorway(c, 380, 1000, 340, 640);
  doorPanel(c, 380, 1000, 240, 640, 40);
  person(c, 180, 1000, 520, { armR: [0, 0], armL: [0.05, 0] });
  hand(c, 395, 631, 0, 1.05, SKIN.child, CLOTH.child, true);
  arrow(c, [[650, 560], [780, 540]]);
  person(c, 920, 1000, 640, { adult: true });
};
// the bedsheet ride: the girl sits on the sheet, the grown-up pulls it along
const fA4 = (c: Ctx) => {
  room(c);
  shape(c, () => polyP(c, [[200, 790], [720, 790], [820, 990], [110, 990]]), COL.cloth);
  line(c, [[300, 850], [420, 870]], 4, TILE); line(c, [[520, 900], [640, 920]], 4, TILE);
  person(c, 330, 960, 460, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.4], armR: [Math.PI * 0.35, Math.PI * 0.4] });
  person(c, 900, 1000, 640, { adult: true, armL: [Math.PI * 0.85, Math.PI * 0.95], armR: [Math.PI * 0.6, Math.PI * 0.9] });
  shape(c, () => polyP(c, [[650, 615], [720, 790], [820, 990], [690, 850]]), COL.cloth);
  arrow(c, [[380, 560], [600, 560]]);
};
// the pull-along toy: a tiger box on a string, a pencil push stick at its back
const fP1 = (c: Ctx) => {
  room(c);
  person(c, 200, 1000, 520, { armR: [Math.PI * 0.2, Math.PI * 0.1], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  shadow(c, 700, 950, 150, 20);
  line(c, [[820, 880], [980, 880]], 14, INK); line(c, [[820, 880], [980, 880]], 8, COL.yellow); line(c, [[960, 880], [980, 880]], 8, COL.pink);
  shape(c, () => rrect(c, 810, 860, 40, 40, 6), COL.grey, 3);
  const body = () => rrect(c, 560, 800, 260, 140, 20);
  shape(c, body, COL.orange); shade(c, body, COL.woodDk, 30, 0, 0.4);
  for (const x of [640, 700, 760]) line(c, [[x, 808], [x - 12, 860]], 10, INK);
  shape(c, () => ell(c, 585, 800, 22, 22), COL.orange, 5); shape(c, () => ell(c, 650, 800, 22, 22), COL.orange, 5);
  shape(c, () => ell(c, 590, 850, 9, 9), INK, 0); shape(c, () => ell(c, 630, 850, 9, 9), INK, 0); shape(c, () => ell(c, 575, 885, 12, 8), INK, 0);
  str(c, [[560, 870], [407, 708]]);
  arrow(c, [[700, 700], [500, 640]]);
};
// term: push · the girl pushes a swing with a smaller child on it
const tPush = (c: Ctx) => {
  room(c, 500);
  for (const x of [150, 930]) { line(c, [[x, 260], [x - 80, 1000]], 16, INK); line(c, [[x, 260], [x + 80, 1000]], 16, INK); line(c, [[x, 260], [x - 80, 1000]], 8, COL.teal); line(c, [[x, 260], [x + 80, 1000]], 8, COL.teal); }
  line(c, [[150, 260], [930, 260]], 18, INK); line(c, [[150, 260], [930, 260]], 10, COL.teal);
  line(c, [[560, 260], [530, 730]], 7, INK); line(c, [[700, 260], [670, 730]], 7, INK);
  shape(c, () => rrect(c, 500, 725, 200, 28, 8), COL.wood);
  person(c, 600, 770, 280, { sit: true, armL: [Math.PI * 0.6, -Math.PI * 0.45], armR: [Math.PI * 0.4, -Math.PI * 0.5] });
  person(c, 330, 1000, 520, { armR: [0.1, 0.05], armL: [0.15, 0.05] });
  arrow(c, [[740, 620], [900, 580]]);
};
// term: pull · the child pulls a kitchen drawer open, towards himself
const tPull = (c: Ctx) => {
  room(c);
  shadow(c, 760, 1010, 250, 24);
  shape(c, () => rrect(c, 540, 460, 440, 540, 10), COL.wood); shade(c, () => rrect(c, 540, 460, 440, 540, 10), COL.woodDk, 40, 0, 0.4);
  shape(c, () => rrect(c, 520, 430, 480, 40, 8), COL.grey);
  line(c, [[560, 720], [960, 720]], 5, INK); shape(c, () => ell(c, 760, 860, 14, 14), COL.greyDk, 4);
  shape(c, () => polyP(c, [[320, 560], [560, 560], [560, 700], [320, 700]]), COL.woodDk);
  shape(c, () => rrect(c, 290, 540, 50, 180, 8), COL.wood);
  shape(c, () => ell(c, 315, 630, 14, 14), COL.greyDk, 4);
  person(c, 150, 1000, 520, { armR: [0.05, 0], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  arrow(c, [[420, 470], [250, 470]]);
};
// term: machine · a tractor pulls a trolley piled with sugarcane along a village road
const tMachine = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.greenLt; c.fillRect(0, 620, D, D - 620);
  c.fillStyle = COL.soil; c.fillRect(0, 760, D, 220); line(c, [[0, 760], [D, 760]], 5, INK); line(c, [[0, 980], [D, 980]], 5, INK);
  for (let x = 40; x < D; x += 160) line(c, [[x, 870], [x + 70, 870]], 6, COL.wood);
  // trolley
  str(c, [[540, 830], [640, 830]]);
  shape(c, () => rrect(c, 110, 700, 430, 130, 10), COL.wood); shade(c, () => rrect(c, 110, 700, 430, 130, 10), COL.woodDk, 30, 0, 0.4);
  const r = rnd(11); for (let i = 0; i < 14; i++) { const y = 690 - i * 14, x = 130 + r() * 60, len = 330 + r() * 70; c.save(); c.translate(x, y); c.rotate(-0.06 + r() * 0.1); shape(c, () => rrect(c, 0, -9, len, 18, 9), i % 2 ? COL.yellow : COL.greenLt, 4); c.restore(); }
  for (const [x, y, a] of [[470, 500, -0.9], [500, 520, -0.4], [440, 480, -1.4]]) { const tx = x + Math.cos(a) * 150, ty = y + Math.sin(a) * 150; shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(x + 40, y - 80, tx, ty); c.quadraticCurveTo(x - 20, y - 40, x, y); }, COL.leaf, 4); }
  for (const x of [230, 430]) { shape(c, () => ell(c, x, 880, 70, 70), COL.black); shape(c, () => ell(c, x, 880, 28, 28), COL.grey, 4); }
  // tractor
  shape(c, () => rrect(c, 660, 540, 250, 30, 6), COL.red); line(c, [[690, 570], [690, 700]], 10, INK); line(c, [[880, 570], [880, 700]], 10, INK);
  shape(c, () => rrect(c, 640, 690, 220, 130, 12), COL.red); shade(c, () => rrect(c, 640, 690, 220, 130, 12), "#a3301f", 30, 0, 0.4);
  person(c, 720, 740, 280, { sit: true, adult: true, armR: [0.2, 0.1], armL: [0.3, 0.1] });
  shape(c, () => rrect(c, 850, 720, 180, 110, 14), COL.red); shade(c, () => rrect(c, 850, 720, 180, 110, 14), "#a3301f", 30, 0, 0.4);
  line(c, [[900, 720], [900, 600]], 16, INK); line(c, [[900, 720], [900, 600]], 9, COL.greyDk);
  shape(c, () => ell(c, 910, 570, 30, 22), COL.grey, 4);
  shape(c, () => ell(c, 850, 760, 16, 16), COL.yellow, 4);
  shape(c, () => ell(c, 730, 880, 110, 110), COL.black); shape(c, () => ell(c, 730, 880, 45, 45), COL.grey, 4);
  shape(c, () => ell(c, 980, 915, 65, 65), COL.black); shape(c, () => ell(c, 980, 915, 26, 26), COL.grey, 4);
  arrow(c, [[700, 440], [920, 440]]);
};
// expl: push means away, pull means towards · the door from above, pushed and pulled the same way
const xDoor = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 540);
  c.fillStyle = FLOOR; c.fillRect(0, 540, D, 540);
  for (let x = 90; x < D; x += 180) line(c, [[x, 540], [x, D]], 3, TILE);
  for (let y = 700; y < D; y += 160) line(c, [[0, y], [D, y]], 3, TILE);
  line(c, [[0, 540], [390, 540]], 30, INK); line(c, [[690, 540], [D, 540]], 30, INK);
  line(c, [[0, 540], [390, 540]], 18, COL.grey); line(c, [[690, 540], [D, 540]], 18, COL.grey);
  const hx = 390, hy = 540, L = 290, an = 0.5;
  // the swing of the door
  const pts: number[][] = []; for (let t = 0; t <= 1; t += 0.2) { const a = an - t * (an - 0.08); pts.push([hx + Math.cos(a) * (L + 50), hy + Math.sin(a) * (L + 50)]); }
  arrow(c, pts);
  topPerson(c, 530, 820, -1.7, 150);
  topPerson(c, 760, 400, 2.1, 150);
  c.save(); c.translate(hx, hy); c.rotate(an);
  shape(c, () => rrect(c, 0, -14, L, 28, 8), COL.wood); shape(c, () => ell(c, L - 36, -22, 10, 10), COL.yellow, 4);
  c.restore();
  shape(c, () => ell(c, hx, hy, 16, 16), COL.greyDk, 4);
};

export const ic_forcesPushAndPullL1 = cards("sci.forces.push-and-pull.L1", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2,
  fE1, fE2, fA1, fA2, fA4, fP1, tPush, tPull, tMachine, xDoor,
]);
