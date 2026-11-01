import type { Ctx } from "./core";
import { COL, INK, BG, WHITE, RED, SKIN, CLOTH, cards, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, plate, hand, rnd } from "./flatKit";

// sci.basic-needs.basic-needs.L3 · set-up cards: the hidden water test (hand bag / tumbler bag) and the water ring (ants).

// ---------------------------------------------------------------- shared pieces
const steelTumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel, 6);
  shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.09), COL.steelIn, 5);
  line(c, [[x - top * 0.92, y - h * 0.8], [x + top * 0.82, y - h * 0.8]], 3, COL.steelDk);
  shine(c, [[x - top * 0.6, y - h * 0.68], [x - bot * 0.62, y - h * 0.15]], 8);
};
const hairBand = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = INK; c.lineWidth = 24; c.stroke();
  c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = COL.pink; c.lineWidth = 13; c.stroke();
};
const BAG = "rgba(214,236,250,0.5)";
const dropP = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x, y - r * 1.7); c.bezierCurveTo(x + r * 0.2, y - r * 0.8, x + r, y - r * 0.5, x + r, y + r * 0.2); c.arc(x, y + r * 0.2, r, 0, Math.PI); c.bezierCurveTo(x - r, y - r * 0.5, x - r * 0.2, y - r * 0.8, x, y - r * 1.7); c.closePath(); }, COL.drop, 3.5);
};
// the same two bags on every card of the hand experiment
const HX = 215, HY = 600, TX = 835, TY = 920;
const handBagPath = (c: Ctx) => { c.moveTo(262, HY - 108); c.bezierCurveTo(400, HY - 175, 580, HY - 140, 580, HY); c.bezierCurveTo(580, HY + 140, 400, HY + 175, 262, HY + 108); c.closePath(); };
const tumblerBagPath = (c: Ctx) => { c.moveTo(TX - 40, TY - 520); c.bezierCurveTo(TX - 190, TY - 490, TX - 185, TY - 330, TX - 175, TY - 20); c.bezierCurveTo(TX - 170, TY + 60, TX + 170, TY + 60, TX + 175, TY - 20); c.bezierCurveTo(TX + 185, TY - 330, TX + 190, TY - 490, TX + 40, TY - 520); c.closePath(); };
const handBag = (c: Ctx, misty: boolean) => {
  hand(c, HX, HY, 0, 2.5, SKIN.child, CLOTH.child, true);
  shape(c, () => handBagPath(c), misty ? "rgba(235,246,255,0.5)" : "rgba(214,236,250,0.28)", 5);
  shine(c, [[330, HY - 110], [500, HY - 100]], 9);
  if (misty) {
    const r = rnd(5);
    for (let i = 0; i < 16; i++) dropP(c, 310 + r() * 240, HY - 100 + r() * 200, 11 + r() * 6);
  }
  line(c, [[262, HY - 108], [225, HY - 140]], 5); line(c, [[262, HY + 108], [225, HY + 140]], 5);
  hairBand(c, 264, HY, 17, 112);
};
const tumblerBag = (c: Ctx) => {
  steelTumbler(c, TX, TY, 250, 420);
  shape(c, () => tumblerBagPath(c), BAG, 5);
  shine(c, [[TX - 150, TY - 420], [TX - 155, TY - 80]], 9);
  line(c, [[TX - 40, TY - 520], [TX - 62, TY - 575]], 5); line(c, [[TX + 40, TY - 520], [TX + 62, TY - 575]], 5); line(c, [[TX, TY - 520], [TX, TY - 580]], 5);
  hairBand(c, TX, TY - 505, 52, 13);
};

const ant = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const k of [-1, 0, 1]) { line(c, [[k * 16, 0], [k * 16 + 8, 26], [k * 16 + 4, 38]], 5); line(c, [[k * 16, 0], [k * 16 + 8, -26], [k * 16 + 4, -38]], 5); }
  line(c, [[38, -6], [58, -26], [66, -22]], 4); line(c, [[38, 6], [58, 26], [66, 22]], 4);
  shape(c, () => ell(c, -32, 0, 24, 17), "#7a3a22", 5);
  shape(c, () => ell(c, 0, 0, 14, 11), "#7a3a22", 5);
  shape(c, () => ell(c, 34, 0, 14, 13), "#7a3a22", 5);
  c.beginPath(); ell(c, -38, -6, 10, 5); c.fillStyle = "rgba(255,255,255,0.35)"; c.fill();
  c.restore();
};
const SUGAR = "#fffdf5";
const cap = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.45, r * 1.05, r * 0.36);
  const body = () => { c.moveTo(x - r, y - r * 0.1); c.lineTo(x - r, y + r * 0.35); c.bezierCurveTo(x - r, y + r * 0.7, x + r, y + r * 0.7, x + r, y + r * 0.35); c.lineTo(x + r, y - r * 0.1); c.closePath(); };
  shape(c, body, COL.purple, 5); shade(c, body, "#5e449a", r * 0.5, 0);
  shape(c, () => ell(c, x, y - r * 0.1, r, r * 0.38), "#d9d0f0", 5);
  const rd = rnd(3);
  shape(c, () => { c.moveTo(x - r * 0.8, y - r * 0.1); c.quadraticCurveTo(x, y - r * 1.25, x + r * 0.8, y - r * 0.1); c.quadraticCurveTo(x, y + r * 0.2, x - r * 0.8, y - r * 0.1); }, SUGAR, 4);
  for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(x - r * 0.55 + rd() * r * 1.1, y - r * 0.2 - rd() * r * 0.4, 2.6, 0, 7); c.fillStyle = "#e4dcc8"; c.fill(); }
};
const floor = (c: Ctx) => {
  ground(c, "#ece0c8");
  c.strokeStyle = "rgba(43,35,64,0.12)"; c.lineWidth = 4;
  for (const p of [270, 810]) { c.beginPath(); c.moveTo(p, 0); c.lineTo(p, 1080); c.stroke(); }
  for (const p of [540]) { c.beginPath(); c.moveTo(0, p); c.lineTo(1080, p); c.stroke(); }
};
// two plates on the floor: top one dry with a sugar cap, bottom one with the water ring, the upturned katori and the cap on top
const LX = 540, LY = 270, RX = 540, RY = 770, PRX = 400, PRY = 165, WX = 0.66, WY = 0.6;
const plates = (c: Ctx) => {
  floor(c);
  plate(c, LX, LY, PRX, PRY);
  cap(c, LX, LY - 10, 90);
  plate(c, RX, RY, PRX, PRY);
  shape(c, () => ell(c, RX, RY - PRY * 0.04, PRX * WX, PRY * WY), COL.water, 5);
  c.beginPath(); ell(c, RX - 170, RY - 20, 60, 9); c.fillStyle = COL.drop; c.fill();
  // upturned katori: wide base on the water, narrower flat top
  const kb = RY + 30, kt = RY - 150, kbody = () => { c.moveTo(RX - 130, kb); c.bezierCurveTo(RX - 130, kb - 90, RX - 85, kt, RX - 72, kt); c.lineTo(RX + 72, kt); c.bezierCurveTo(RX + 85, kt, RX + 130, kb - 90, RX + 130, kb); c.bezierCurveTo(RX + 130, kb + 40, RX - 130, kb + 40, RX - 130, kb); c.closePath(); };
  shape(c, kbody, COL.steel, 6); shade(c, kbody, COL.steelDk, 64, 0);
  shape(c, () => ell(c, RX, kt, 72, 17), COL.steelIn, 5);
  cap(c, RX, kt - 30, 66);
};

// ---------------------------------------------------------------- experiment e1: the hidden water test
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // a towel with a stripe at each end, a flat hand pressing on it, drops soaking in
  shadow(c, 340, 905, 300, 36);
  const tow = () => rrect(c, 60, 400, 560, 470, 26);
  shape(c, tow, COL.cloth, 6); shade(c, tow, "#e4dccb", 20, 20);
  for (const sx of [100, 540]) { shape(c, () => rrect(c, sx, 400, 40, 470, 0), COL.teal, 0); }
  line(c, [[100, 402], [100, 868]], 4); line(c, [[140, 402], [140, 868]], 4); line(c, [[540, 402], [540, 868]], 4); line(c, [[580, 402], [580, 868]], 4);
  hand(c, 240, 590, 0.35, 2.5, SKIN.child, CLOTH.child, true);
  dropP(c, 400, 790, 14); dropP(c, 470, 840, 12); dropP(c, 330, 840, 12);
  // the things on the table: steel tumbler, two clear bags, two hair bands
  steelTumbler(c, 850, 590, 190, 280);
  const bag = (x: number, y: number) => { shape(c, () => rrect(c, x, y, 300, 150, 18), BAG, 5); line(c, [[x + 20, y + 24], [x + 280, y + 24]], 3, COL.glassEdge); };
  shadow(c, 880, 960, 190, 28);
  bag(740, 760); bag(710, 800);
  hairBand(c, 760, 700, 44, 14); hairBand(c, 960, 700, 44, 14);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  handBag(c, false);
  tumblerBag(c);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  handBag(c, true);
  tumblerBag(c);
};

// ---------------------------------------------------------------- experiment e2: the water ring
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, "#cfe3ee");
  // a kitchen counter edge with a line of ants walking along it, a hand showing them
  const top = () => c.rect(0, 380, 1080, 300), edge = () => c.rect(0, 680, 1080, 110);
  shape(c, top, COL.wood, 0); shade(c, top, COL.woodDk, 0, 160, 0.35);
  shape(c, edge, COL.brown, 0);
  line(c, [[0, 680], [1080, 680]], 7); line(c, [[0, 790], [1080, 790]], 7);
  const xs = [110, 320, 530, 740, 950];
  xs.forEach((x, i) => ant(c, x, 600 + (i % 2) * 14, 1.7, Math.PI * 0 + (i % 2) * 0.08));
  hand(c, 850, 930, -2.3, 2.1, SKIN.child, CLOTH.child, true);
};
// setup.e2.1
const e2_1 = (c: Ctx) => { plates(c); };
// setup.e2.2
const e2_2 = (c: Ctx) => {
  plates(c);
  // crowd of ants on the dry plate and on the cap
  const r = rnd(21);
  const spots: number[][] = [[LX - 150, LY - 60, 0.5], [LX - 100, LY + 30, 0.3], [LX + 20, LY - 120, 1.4], [LX + 130, LY - 70, 2.4], [LX + 190, LY + 10, 3.0], [LX - 220, LY + 20, 0.1], [LX - 60, LY + 90, -0.9], [LX + 60, LY + 95, -2.2], [LX + 160, LY + 80, -2.6], [LX - 175, LY + 80, -0.4], [LX - 40, LY - 55, 0.9], [LX + 55, LY - 45, 2.2], [LX + 245, LY - 20, 3.2], [LX - 15, LY + 8, -1.5]];
  spots.forEach(([x, y, a]) => ant(c, x, y, 0.85, a + r() * 0.2));
  // a few ants stopped at the water edge on the lower plate
  [[RX - 300, RY - 5, 0], [RX + 200, RY - 85, 2.6], [RX + 280, RY + 30, 3.1]].forEach(([x, y, a]) => ant(c, x, y, 0.85, a));
};

export const su_basicNeedsBasicNeeds = cards("sci.basic-needs.basic-needs.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
