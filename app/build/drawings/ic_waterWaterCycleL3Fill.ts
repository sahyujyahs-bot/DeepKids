import type { Ctx } from "./core";
import { D, INK, COL, WHITE, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, leaf, cards } from "./flatKit";

// WATER CYCLE L3 · fill cards for the experiments and the project: flat kit look, the set-up big and
// central, red arrows for where the water goes.

const DARK = "#3b3652", ICE = "#dff2fb", PINK = "#f29ab4", FRESH = "#cfe8f8";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
// a water drop hanging from a point, tip up
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.drop) =>
  shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.4, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.4, x, y - r * 1.6); c.closePath(); }, col, 4);
// a steel tumbler, bottom centre (x, y), top width w, height h; inside colour shows at the rim
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, inside: string) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.1);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), inside, 5);
  shine(c, [[x - top * 0.6, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 8);
};
const iceCube = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.2), ICE, 4); shine(c, [[x - s * 0.3, y - s * 0.25], [x - s * 0.1, y - s * 0.35]], 4); };

// e1 · Sea in a Bowl, cut open: salty water in a wide bowl, a short cup in the middle, cling film with a
// pebble on top; vapour rises, drops form under the film and fall into the cup. Sun above.
const e1 = (c: Ctx) => {
  ground(c);
  sun(c, 880, 170, 70);
  shadow(c, 560, 850, 420, 36);
  const bowl = () => { c.moveTo(130, 520); c.lineTo(200, 840); c.quadraticCurveTo(540, 880, 880, 840); c.lineTo(950, 520); c.closePath(); };
  shape(c, bowl, COL.steel);
  shade(c, bowl, COL.steelDk, -70, 0);
  // the salty water
  shape(c, () => { c.moveTo(190, 640); c.lineTo(230, 812); c.quadraticCurveTo(540, 846, 850, 812); c.lineTo(890, 640); c.closePath(); }, COL.waterDk, 5);
  // the short cup in the middle, with a little fresh water collected
  shape(c, () => polyP(c, [[460, 600], [620, 600], [605, 808], [475, 808]]), COL.steel);
  shape(c, () => polyP(c, [[484, 740], [596, 740], [605, 806], [475, 806]]), FRESH, 4);
  line(c, [[460, 600], [475, 808]], 6); line(c, [[620, 600], [605, 808]], 6);
  // the cling film, sagging to the middle under a pebble
  shape(c, () => { c.moveTo(118, 512); c.quadraticCurveTo(540, 600, 962, 512); c.lineTo(962, 530); c.quadraticCurveTo(540, 618, 118, 530); c.closePath(); }, COL.glass, 5);
  shape(c, () => ell(c, 540, 548, 42, 26), COL.grey);
  // drops under the film, one falling
  drop(c, 500, 592, 13); drop(c, 580, 592, 13); drop(c, 540, 610, 16);
  arrow(c, [[540, 640], [540, 710]], RED, 9);
  // vapour rising from the salty water
  arrow(c, [[320, 640], [320, 568]], RED, 9); arrow(c, [[760, 640], [760, 568]], RED, 9);
};

// e2 · A Cloud in a Jar: hot water in a glass jar, a steel plate of ice on top, a cloud forming inside,
// against a dark cloth
const e2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = DARK; c.fillRect(0, 0, D, 880);
  line(c, [[0, 880], [D, 880]], 6);
  shadow(c, 560, 886, 250, 26);
  const jar = () => rrect(c, 320, 300, 440, 580, 34);
  shape(c, jar, "rgba(214,236,250,0.35)", 0);
  c.save(); c.beginPath(); jar(); c.clip();
  shape(c, () => { c.moveTo(320, 730); c.lineTo(760, 730); c.lineTo(760, 880); c.lineTo(320, 880); c.closePath(); }, COL.water, 0);
  shape(c, () => ell(c, 540, 730, 220, 18), COL.drop, 0);
  // the cloud
  const cloud = () => { c.moveTo(380, 600); c.arc(430, 580, 60, Math.PI * 0.9, Math.PI * 1.6); c.arc(520, 530, 80, Math.PI * 1.1, Math.PI * 1.85); c.arc(630, 560, 65, Math.PI * 1.3, Math.PI * 0.1); c.arc(560, 635, 60, Math.PI * 1.9, Math.PI * 0.5); c.arc(450, 640, 55, 0, Math.PI * 0.8); c.closePath(); };
  shape(c, cloud, WHITE, 6);
  shade(c, cloud, COL.steel, -24, -18, 0.5);
  c.restore();
  shape(c, jar, "rgba(0,0,0,0)", 7);
  shine(c, [[360, 360], [360, 700]], 10);
  // rising vapour
  arrow(c, [[540, 715], [540, 680]], RED, 10);
  // the steel plate, upside down, with ice cubes
  shape(c, () => ell(c, 540, 300, 290, 50), COL.steel);
  shape(c, () => ell(c, 540, 300, 250, 36), COL.steelIn, 4);
  iceCube(c, 440, 262, 70); iceCube(c, 530, 252, 76); iceCube(c, 620, 262, 70); iceCube(c, 485, 230, 62); iceCube(c, 575, 228, 64);
};

// e4 · The Cold Tumbler: two steel tumblers of coloured water, one with ice. Only the icy one is wet
// outside, and its drops are clear, not coloured: they come from the air.
const e4 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 820], [D, 820]], 6);
  // the puddle ring under the cold one
  shape(c, () => ell(c, 330, 822, 150, 22), COL.water, 4);
  tumbler(c, 330, 820, 270, 400, PINK);
  tumbler(c, 760, 820, 270, 400, PINK);
  // ice poking out of the cold one
  iceCube(c, 285, 410, 66); iceCube(c, 370, 402, 70); iceCube(c, 328, 378, 58);
  // clear drops on the outside of the cold tumbler
  const spots: number[][] = [[260, 520], [340, 500], [410, 540], [290, 600], [380, 620], [250, 690], [330, 700], [405, 720], [300, 770], [370, 780]];
  spots.forEach(([x, y], i) => shape(c, () => ell(c, x, y, 16 + (i % 3) * 3, 20 + (i % 2) * 4), COL.drop, 4));
  // water from the air lands on the cold side
  arrow(c, [[90, 470], [120, 560], [185, 600]], RED, 10);
  for (const [x, y] of [[80, 380], [130, 330], [60, 300]]) shape(c, () => ell(c, x, y, 7, 7), COL.drop, 3);
};

// e5 · The Evaporation Race: the same water in three plates and a glass. Sun, fan, shade, narrow glass.
const e5 = (c: Ctx) => {
  ground(c);
  const plateAt = (x: number, y: number, puddle: number) => {
    shadow(c, x + 14, y + 20, 200, 70);
    shape(c, () => ell(c, x, y, 200, 70), COL.steel);
    shape(c, () => ell(c, x, y - 3, 168, 56), COL.steelIn, 4);
    if (puddle > 0) shape(c, () => ell(c, x, y, 150 * puddle, 46 * puddle), COL.water, 4);
  };
  // sun: almost dry
  sun(c, 150, 130, 58);
  plateAt(300, 390, 0.3);
  arrow(c, [[240, 300], [240, 230]], RED, 8); arrow(c, [[360, 300], [360, 230]], RED, 8);
  // fan: half gone
  plateAt(780, 420, 0.6);
  shape(c, () => rrect(c, 960, 300, 60, 180, 14), COL.greyDk);
  shape(c, () => ell(c, 990, 480, 80, 24), COL.greyDk);
  shape(c, () => ell(c, 990, 250, 110, 110), COL.steel);
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; shape(c, () => ell(c, 990 + Math.cos(a) * 52, 250 + Math.sin(a) * 52, 42, 22, a), COL.teal, 4); }
  shape(c, () => ell(c, 990, 250, 22, 22), COL.greyDk);
  arrow(c, [[880, 330], [720, 340]], RED, 8); arrow(c, [[880, 400], [700, 410]], RED, 8);
  // shade: a grey canopy, the water still there
  shape(c, () => rrect(c, 90, 580, 420, 46, 18), COL.greyDk);
  line(c, [[110, 626], [110, 820]], 10); line(c, [[490, 626], [490, 820]], 10);
  shape(c, () => ell(c, 300, 800, 210, 80), "rgba(43,35,64,0.12)", 0);
  plateAt(300, 790, 0.95);
  // the narrow glass in the shade, full
  shadow(c, 800, 850, 90, 18);
  shape(c, () => polyP(c, [[740, 560], [860, 560], [850, 840], [750, 840]]), COL.glass, 5);
  shape(c, () => polyP(c, [[744, 640], [856, 640], [850, 838], [750, 838]]), COL.water, 0);
  shape(c, () => ell(c, 800, 640, 56, 10), COL.drop, 4);
  shape(c, () => ell(c, 800, 560, 60, 10), "rgba(255,255,255,0.4)", 5);
  shine(c, [[756, 590], [760, 800]], 7);
};

// p1 · Rain Forest in a Jar: pebbles, charcoal, soil and small plants in a closed jar; water rises from the
// plants, gathers as drops under the lid and falls back, round and round.
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 300, 30);
  const jar = () => rrect(c, 270, 170, 540, 760, 44);
  shape(c, jar, "rgba(214,236,250,0.35)", 0);
  c.save(); c.beginPath(); jar(); c.clip();
  // layers
  shape(c, () => { c.moveTo(270, 820); c.lineTo(810, 820); c.lineTo(810, 930); c.lineTo(270, 930); c.closePath(); }, COL.steel, 0);
  for (let i = 0; i < 22; i++) { const x = 290 + (i % 11) * 50 + (Math.floor(i / 11) ? 25 : 0), y = 848 + Math.floor(i / 11) * 48; shape(c, () => ell(c, x, y, 24, 20), i % 3 ? COL.grey : COL.steelDk, 4); }
  shape(c, () => { c.moveTo(270, 790); c.lineTo(810, 790); c.lineTo(810, 824); c.lineTo(270, 824); c.closePath(); }, COL.black, 4);
  shape(c, () => { c.moveTo(270, 660); c.quadraticCurveTo(540, 630, 810, 660); c.lineTo(810, 794); c.lineTo(270, 794); c.closePath(); }, COL.soil, 5);
  shade(c, () => { c.moveTo(270, 660); c.quadraticCurveTo(540, 630, 810, 660); c.lineTo(810, 794); c.lineTo(270, 794); c.closePath(); }, COL.soilDk, 0, -40, 0.45);
  // moss
  for (const [x, y, r] of [[330, 655, 48], [720, 660, 44], [540, 648, 40]]) shape(c, () => ell(c, x, y, r, r * 0.5), COL.greenLt, 4);
  // two small ferns
  for (const [bx, by, flip] of [[430, 650, 1], [650, 652, -1]]) {
    line(c, [[bx, by], [bx + 10 * flip, 470]], 7, COL.leafDk);
    for (let k = 0; k < 5; k++) { const t = k / 5, y = by - 20 - t * 150, x = bx + (by - y) * 0.06 * flip; leaf(c, x, y, 95 - k * 12, -Math.PI * 0.18 * flip + (flip > 0 ? -Math.PI * 0.72 : -Math.PI * 0.1), COL.leaf); leaf(c, x, y, 85 - k * 12, flip > 0 ? -Math.PI * 0.05 : -Math.PI * 0.95, COL.green); }
  }
  // drops under the lid
  for (const [x, y, r] of [[380, 250, 11], [470, 262, 14], [560, 248, 11], [650, 262, 14], [730, 250, 11]]) drop(c, x, y, r);
  c.restore();
  shape(c, jar, "rgba(0,0,0,0)", 7);
  shine(c, [[316, 260], [316, 820]], 10);
  // the lid
  shape(c, () => rrect(c, 250, 120, 580, 66, 18), COL.steel);
  shade(c, () => rrect(c, 250, 120, 580, 66, 18), COL.steelDk, -40, 0, 0.5);
  // round and round
  arrow(c, [[360, 560], [330, 420], [380, 300]], RED, 10);
  arrow(c, [[690, 300], [740, 420], [700, 560]], RED, 10);
};

export const ic_waterWaterCycleL3Fill = cards("sci.water.water-cycle.L3 fill", [e1, e2, e4, e5, p1]);
