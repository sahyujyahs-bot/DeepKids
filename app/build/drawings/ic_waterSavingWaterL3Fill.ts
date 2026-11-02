import type { Ctx } from "./core";
import { D, INK, COL, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, leaf, person, write, cards } from "./flatKit";

// sci.water.saving-water.L3 · missing pictures: summary, flow.e2, flow.e3, flow.p1

const MUD = "#9a6b45", MUD_DK = "#6d4a2e", TERRA = "#c8724a", TERRA_DK = "#a0552f", DRY = "#cdae82", FLOOR = "#e2d3b8";

// a kitchen tap standing on a counter at (x, y): pipe up, spout turning right, a handle on top; on = water running from the spout down to yTo
const tap = (c: Ctx, x: number, y: number, on: boolean, yTo: number) => {
  shape(c, () => rrect(c, x - 40, y - 24, 80, 24, 8), COL.steelDk);
  shape(c, () => rrect(c, x - 20, y - 150, 40, 130, 12), COL.steel);
  shape(c, () => { c.moveTo(x - 20, y - 140); c.quadraticCurveTo(x - 20, y - 215, x + 60, y - 215); c.lineTo(x + 110, y - 215); c.lineTo(x + 110, y - 150); c.lineTo(x + 70, y - 150); c.lineTo(x + 70, y - 180); c.quadraticCurveTo(x + 20, y - 180, x + 20, y - 140); c.closePath(); }, COL.steel);
  shape(c, () => rrect(c, x - 34, y - 190, 68, 22, 8), COL.steelDk);
  shape(c, () => rrect(c, x - 8, y - 230, 16, 44, 6), COL.steelDk);
  if (on) { shape(c, () => rrect(c, x + 78, y - 150, 24, yTo - (y - 150), 6), COL.water, 4); shine(c, [[x + 84, y - 130], [x + 84, yTo - 20]], 5); }
};
// an open steel tub (basin) with its bottom centre at (x, y); fill 0..1 of water
const tub = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  const top = w / 2, bot = w * 0.4;
  shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), COL.steelIn, 5);
  if (fill > 0) { const ly = y - h * (0.15 + 0.8 * fill); shape(c, () => ell(c, x, ly, top - 10 - (1 - fill) * 8, w * 0.085), COL.water, 4); shape(c, () => ell(c, x - top * 0.35, ly - 2, top * 0.2, w * 0.02), COL.drop, 0); }
  shine(c, [[x - top * 0.8, y - h * 0.85], [x - bot * 0.85, y - h * 0.15]], 7);
};
// a steel plate standing on its edge, seen a little from the side, its bottom at (x, y)
const plateUp = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y - r, r * 0.42, r, 0.12), COL.steel);
  shape(c, () => ell(c, x - r * 0.06, y - r, r * 0.3, r * 0.78, 0.12), COL.steelIn, 4);
};
// a clay pot with its bottom centre at (x, y), rim radius r
const pot = (c: Ctx, x: number, y: number, r: number, h: number, soil: string) => {
  shadow(c, x + r * 0.15, y + 8, r * 0.9, r * 0.14);
  const body = () => { c.moveTo(x - r, y - h); c.lineTo(x + r, y - h); c.lineTo(x + r * 0.72, y); c.lineTo(x - r * 0.72, y); c.closePath(); };
  shape(c, body, TERRA); shade(c, body, TERRA_DK, r * 0.5, 0);
  shape(c, () => rrect(c, x - r - 14, y - h - 40, r * 2 + 28, 48, 10), TERRA); shade(c, () => rrect(c, x - r - 14, y - h - 40, r * 2 + 28, 48, 10), TERRA_DK, r * 0.5, 0);
  shape(c, () => ell(c, x, y - h - 40, r + 14, r * 0.22), soil, 5);
};
// a sun in the top corner
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
// a bucket with its bottom centre at (x, y)
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.water, 5);
  c.beginPath(); c.arc(x, y - h, w * 0.5, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = INK; c.lineWidth = 9; c.stroke();
};
// a steel mug with its bottom centre at (x, y)
const mug = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 4, w * 0.6, w * 0.1);
  shape(c, () => { c.moveTo(x + w / 2, y - h * 0.75); c.quadraticCurveTo(x + w, y - h * 0.75, x + w, y - h * 0.4); c.quadraticCurveTo(x + w, y - h * 0.1, x + w / 2, y - h * 0.15); c.closePath(); }, COL.steelDk, 5);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 8), COL.steel); shade(c, () => rrect(c, x - w / 2, y - h, w, h, 8), COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.12), COL.steelIn, 4);
};
// a white alum (phitkari) crystal, centre (x, y)
const alum = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => polyP(c, [[x, y - r], [x + r * 0.9, y - r * 0.4], [x + r * 0.8, y + r * 0.6], [x, y + r], [x - r * 0.85, y + r * 0.5], [x - r * 0.9, y - r * 0.45]]), COL.paper);
  line(c, [[x - r * 0.3, y - r * 0.5], [x + r * 0.1, y - r * 0.05], [x - r * 0.2, y + r * 0.5]], 4, COL.grey);
};

// summary: a glass of muddy water, a pinch of alum, then clear water with mud settled at the bottom
const summary = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 830, D, D - 830); line(c, [[0, 830], [D, 830]], 5);
  glass(c, 300, 830, 280, 440, 0.78, MUD);
  // the clear glass: water, then a layer of settled mud at the bottom
  glass(c, 780, 830, 280, 440, 0.78, COL.water);
  shape(c, () => { c.moveTo(780 - 124, 760); c.lineTo(780 + 124, 760); c.lineTo(780 + 112, 826); c.lineTo(780 - 112, 826); c.closePath(); }, MUD_DK, 0);
  shape(c, () => ell(c, 780, 760, 124, 18), MUD, 0);
  arrow(c, [[460, 560], [620, 560]], undefined, 12);
  // the alum crystal, dropped in
  alum(c, 780, 230, 60);
  arrow(c, [[780, 310], [780, 372]], undefined, 9);
};

// e2: three ways of washing a plate (tap running, tap off, a bowl) and the water each one caught
const plateTest = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 440, D, 40); line(c, [[0, 440], [D, 440]], 5); line(c, [[0, 480], [D, 480]], 4);
  const xs = [190, 540, 890], fills = [0.95, 0.5, 0.18];
  tap(c, 110, 440, true, 900 - 190 * 0.95);
  tap(c, 460, 440, false, 0);
  // the bowl way: a bowl of water with the plate dipped in it
  shape(c, () => ell(c, 890, 300, 44, 110, 0.25), COL.steel); shape(c, () => ell(c, 884, 300, 30, 86, 0.25), COL.steelIn, 4);
  bowl(c, 890, 350, 130, COL.water);
  xs.forEach((x, i) => {
    plateUp(c, x + 20, 915, 120);
    tub(c, x, 960, 300, 200, fills[i]);
    arrow(c, [[x, 540], [x, 640]], undefined, 9);
  });
};

// e3: two pots in the sun, bare soil dried out and giving off its water, soil under a blanket of dry leaves still dark and wet
const leafBlanket = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 5);
  sun(c, 150, 150, 80);
  pot(c, 310, 900, 150, 300, DRY);
  // cracks in the dry soil
  line(c, [[240, 560], [290, 568], [330, 556], [380, 566]], 4, COL.brown); line(c, [[290, 568], [300, 585]], 4, COL.brown); line(c, [[330, 556], [320, 540]], 4, COL.brown);
  pot(c, 770, 900, 150, 300, COL.soilDk);
  // a blanket of dry leaves over the wet soil
  const leaves: [number, number, number, number, string][] = [
    [640, 575, 110, -0.5, COL.brown], [720, 560, 120, -2.7, COL.orange], [800, 585, 115, -0.2, COL.brown], [880, 570, 100, -2.4, COL.woodDk],
    [680, 540, 105, -1.1, COL.woodDk], [770, 545, 110, -1.9, COL.orange], [850, 548, 100, -0.9, COL.brown], [730, 525, 95, -1.5, COL.woodDk],
  ];
  leaves.forEach(([x, y, l, a, col]) => leaf(c, x, y, l, a, col));
  // water leaving the bare soil as vapour
  for (const dx of [-70, 0, 70]) { shape(c, () => ell(c, 310 + dx, 470, 10, 10), COL.water, 3); arrow(c, [[310 + dx, 440], [310 + dx, 330]], undefined, 8); }
};

// p1: the family's week chart with ticks, a bucket and mug, the child pointing at today's tick
const waterWeek = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 840, D, D - 840); line(c, [[0, 840], [D, 840]], 5);
  // the chart paper on the wall
  shadow(c, 450, 690, 330, 24);
  shape(c, () => rrect(c, 90, 110, 660, 560, 14), COL.paper, 6);
  const x0 = 200, y0 = 220, cw = 76, rh = 130;
  for (let i = 0; i <= 7; i++) line(c, [[x0 + i * cw, y0 - 70], [x0 + i * cw, y0 + 3 * rh]], 3, COL.grey);
  for (let j = 0; j <= 3; j++) line(c, [[x0 - 90, y0 + j * rh], [x0 + 7 * cw, y0 + j * rh]], 3, COL.grey);
  line(c, [[x0 - 90, y0 - 70], [x0 + 7 * cw, y0 - 70]], 3, COL.grey);
  for (let i = 0; i < 7; i++) write(c, String(i + 1), x0 + i * cw + 16, y0 - 55, 42, INK, 6);
  // the three changes, as pictures: a tap, a bucket, a plant
  const rx = x0 - 46;
  shape(c, () => rrect(c, rx - 8, y0 + 20, 16, 60, 6), COL.steel, 4); shape(c, () => { c.moveTo(rx - 8, y0 + 30); c.quadraticCurveTo(rx - 8, y0 + 8, rx + 14, y0 + 8); c.lineTo(rx + 30, y0 + 8); c.lineTo(rx + 30, y0 + 28); c.lineTo(rx + 20, y0 + 28); c.lineTo(rx + 20, y0 + 20); c.lineTo(rx + 8, y0 + 20); c.lineTo(rx + 8, y0 + 30); c.closePath(); }, COL.steel, 4);
  line(c, [[rx + 26, y0 + 30], [rx + 26, y0 + 70]], 5, COL.red); line(c, [[rx + 14, y0 + 44], [rx + 38, y0 + 60]], 5, COL.red);
  bucket(c, rx, y0 + rh + 105, 56, 70);
  shape(c, () => polyP(c, [[rx - 24, y0 + 2 * rh + 70], [rx + 24, y0 + 2 * rh + 70], [rx + 18, y0 + 2 * rh + 110], [rx - 18, y0 + 2 * rh + 110]]), TERRA, 4);
  line(c, [[rx, y0 + 2 * rh + 70], [rx, y0 + 2 * rh + 25]], 4, COL.leafDk); leaf(c, rx, y0 + 2 * rh + 50, 30, -2.6); leaf(c, rx, y0 + 2 * rh + 40, 30, -0.5);
  // ticks for the days done so far
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) { if (j === 1 && i === 2) continue; const tx = x0 + i * cw + 14, ty = y0 + j * rh + 60; line(c, [[tx, ty], [tx + 18, ty + 20], [tx + 50, ty - 28]], 8, COL.green); }
  // the bucket and mug of water caught
  bucket(c, 230, 990, 190, 230); mug(c, 400, 990, 80, 110);
  // the child points at today's column
  person(c, 900, 1000, 560, { armL: [Math.PI * 1.08, Math.PI * 1.12], armR: [Math.PI * 0.55, Math.PI * 0.5] });
};

export const ic_waterSavingWaterL3Fill = cards("sci.water.saving-water.L3 fill", [summary, plateTest, leafBlanket, waterWeek]);
