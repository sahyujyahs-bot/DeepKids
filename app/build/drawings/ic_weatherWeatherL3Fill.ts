import type { Ctx } from "./core";
import { COL, D, INK, RED, SH, WHITE, arrow, cards, ell, ground, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// MEASURING THE WEATHER · fill-in cards: cover, main idea, and the key moment of each experiment.
// A home weather station on a balcony: a glass thermometer under a white paper roof, a straight jar
// with a ruler as a rain gauge, a card-and-straw wind vane on a bottle, a child's notebook.

// a glass thermometer on a white card, hanging from a thread tied at (x, top); card height h; frac = how high the red liquid is
const thermometer = (c: Ctx, x: number, top: number, h: number, frac: number, thread = 60) => {
  line(c, [[x, top - thread], [x, top]], 4, INK);
  shadow(c, x + 14, top + h + 10, 50, 10);
  shape(c, () => rrect(c, x - 58, top, 116, h, 18), WHITE);
  shade(c, () => rrect(c, x - 58, top, 116, h, 18), COL.steel, 22, 0, 0.35);
  const tubeTop = top + 34, bulbY = top + h - 46, bulbR = 32;
  for (let i = 0; i <= 10; i++) { const y = tubeTop + 10 + (i * (bulbY - 50 - tubeTop - 10)) / 10; line(c, [[x - 40, y], [x - (i % 5 === 0 ? 18 : 28), y]], i % 5 === 0 ? 4 : 2.5, INK); }
  shape(c, () => rrect(c, x + 2, tubeTop, 22, bulbY - tubeTop, 11), COL.glass, 4);
  const lvl = bulbY - 20 - frac * (bulbY - 60 - tubeTop);
  shape(c, () => rrect(c, x + 6, lvl, 14, bulbY - lvl, 7), COL.red, 0);
  shape(c, () => ell(c, x + 13, bulbY, bulbR, bulbR), COL.red);
  shade(c, () => ell(c, x + 13, bulbY, bulbR, bulbR), "#a9301f", 10, 8);
  shine(c, [[x + 2, bulbY - 14], [x + 4, bulbY - 2]], 5);
};
// a folded white paper roof, peak at (x, y), width w
const paperRoof = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => polyP(c, [[x, y], [x - w / 2, y + w * 0.3], [x - w / 2, y + w * 0.3 + 16], [x, y + 16]]), COL.paper);
  shape(c, () => polyP(c, [[x, y], [x + w / 2, y + w * 0.3], [x + w / 2, y + w * 0.3 + 16], [x, y + 16]]), COL.cloth);
  shade(c, () => polyP(c, [[x, y], [x + w / 2, y + w * 0.3], [x + w / 2, y + w * 0.3 + 16], [x, y + 16]]), COL.grey, 0, 14, 0.45);
};
const sun = (c: Ctx, x: number, y: number, r: number, rays = true) => {
  if (rays) for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.85, y + Math.sin(a) * r * 1.85]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.25, 0.5);
};
// a balcony: a rail with bars down to the floor line at floorY
const balcony = (c: Ctx, railY: number, floorY: number) => {
  c.fillStyle = "#e4d6bb"; c.fillRect(0, floorY, D, D - floorY);
  line(c, [[0, floorY], [D, floorY]], 6, INK);
  for (let x = 60; x < D; x += 120) line(c, [[x, railY], [x, floorY]], 12, COL.greyDk);
  shape(c, () => rrect(c, -10, railY - 16, D + 20, 32, 10), COL.grey);
};
// a straight-sided jar with a ruler standing in it, bottom centre (x, y); water depth wd
const rainJar = (c: Ctx, x: number, y: number, w: number, h: number, wd: number, steel = false) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 10), steel ? COL.steel : COL.glass, 0);
  if (steel) shade(c, () => rrect(c, x - w / 2, y - h, w, h, 10), COL.steelDk, w * 0.3, 0);
  shape(c, () => c.rect(x - w / 2 + 4, y - wd, w - 8, wd - 4), COL.water, 0);
  line(c, [[x - w / 2 + 4, y - wd], [x + w / 2 - 4, y - wd]], 4, COL.waterDk);
  // the ruler, leaning on the far wall
  const rx = x - w * 0.22;
  shape(c, () => c.rect(rx - 16, y - h - 70, 32, h + 64), COL.wood, 4);
  for (let i = 0; i < 12; i++) { const ty = y - 6 - i * 18; if (ty < y - h - 60) break; line(c, [[rx - 14, ty], [rx - 14 + (i % 5 === 0 ? 18 : 10), ty]], 2.5, INK); }
  if (!steel) { shape(c, () => rrect(c, x - w / 2, y - h, w, h, 10), "rgba(214,236,250,0.25)", 5); shine(c, [[x + w * 0.3, y - h * 0.85], [x + w * 0.3, y - h * 0.3]], 6); }
  else shape(c, () => rrect(c, x - w / 2, y - h, w, h, 10), "rgba(0,0,0,0)", 6);
};
// a wind vane: a bottle, a straw, a card arrow on top pointing left (into the wind); bottle bottom centre (x, y)
const windVane = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 10 * s, y + 6, 50 * s, 10 * s);
  shape(c, () => { c.moveTo(x - 42 * s, y); c.lineTo(x - 42 * s, y - 150 * s); c.quadraticCurveTo(x - 42 * s, y - 200 * s, x - 14 * s, y - 215 * s); c.lineTo(x - 14 * s, y - 240 * s); c.lineTo(x + 14 * s, y - 240 * s); c.lineTo(x + 14 * s, y - 215 * s); c.quadraticCurveTo(x + 42 * s, y - 200 * s, x + 42 * s, y - 150 * s); c.lineTo(x + 42 * s, y); c.closePath(); }, COL.glass, 5);
  shape(c, () => c.rect(x - 42 * s, y - 60 * s, 84 * s, 60 * s), COL.water, 5);
  line(c, [[x, y - 240 * s], [x, y - 340 * s]], 9 * s, COL.pink);
  line(c, [[x, y - 240 * s], [x, y - 340 * s]], 3 * s, INK);
  const ay = y - 340 * s;
  shape(c, () => polyP(c, [[x - 120 * s, ay], [x - 60 * s, ay - 26 * s], [x - 60 * s, ay + 26 * s]]), COL.paper, 5);
  shape(c, () => c.rect(x - 60 * s, ay - 6 * s, 150 * s, 12 * s), COL.wood, 4);
  shape(c, () => polyP(c, [[x + 90 * s, ay - 40 * s], [x + 150 * s, ay - 40 * s], [x + 150 * s, ay + 40 * s], [x + 90 * s, ay + 40 * s]]), COL.paper, 5);
  shape(c, () => ell(c, x, ay, 10 * s, 10 * s), INK, 0);
};
// a notebook page with ruled lines, top left (x, y)
const page = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 8, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, h, 12), COL.paper);
  line(c, [[x, y + 50], [x + w, y + 50]], 4, COL.red);
};

// cover: the home weather station on a balcony, the thermometer under its paper roof in the middle
const intro = (c: Ctx) => {
  ground(c);
  sun(c, 930, 130, 70);
  balcony(c, 220, 780);
  rainJar(c, 230, 790, 150, 220, 70);
  windVane(c, 860, 790, 1.05);
  paperRoof(c, 540, 270, 300);
  thermometer(c, 540, 350, 330, 0.5, 60);
};

// main idea: the same air, one thermometer in the sun reads far more than one under the paper roof
const summary = (c: Ctx) => {
  ground(c);
  sun(c, 150, 130, 72);
  for (let i = 0; i < 5; i++) line(c, [[230 + i * 8, 190 + i * 12], [300 + i * 10, 270 + i * 14]], 6, COL.orange);
  balcony(c, 250, 850);
  thermometer(c, 340, 330, 360, 0.88, 70);
  write(c, "43°c", 240, 730, 70, INK, 8);
  arrow(c, [[240, 520], [240, 400]], RED, 9);
  paperRoof(c, 760, 262, 300);
  thermometer(c, 760, 330, 360, 0.45, 50);
  write(c, "33°c", 660, 730, 70, INK, 8);
};

// e1: one thermometer moved through three places: shade, sun, and sun under a paper roof
const flowE1 = (c: Ctx) => {
  ground(c);
  sun(c, 950, 120, 64);
  balcony(c, 250, 860);
  c.fillStyle = SH; c.fillRect(0, 0, 360, 860);
  line(c, [[360, 0], [360, 860]], 6, INK);
  thermometer(c, 190, 330, 330, 0.45, 70);
  write(c, "33", 140, 700, 64, INK, 7);
  thermometer(c, 540, 330, 330, 0.88, 70);
  write(c, "43", 490, 700, 64, INK, 7);
  paperRoof(c, 890, 268, 280);
  thermometer(c, 890, 330, 330, 0.55, 50);
  write(c, "36", 840, 700, 64, INK, 7);
  arrow(c, [[290, 790], [370, 820], [440, 790]], RED, 9);
  arrow(c, [[640, 790], [720, 820], [790, 790]], RED, 9);
};

// e2: rain from a chalni over a wide dabba and a narrow glass; the water is the same depth in both
const flowE2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d6bb"; c.fillRect(0, 840, D, D - 840);
  line(c, [[0, 840], [D, 840]], 6, INK);
  rainJar(c, 330, 840, 340, 220, 48, true);
  rainJar(c, 720, 840, 120, 300, 48);
  write(c, "12", 500, 760, 54, INK, 6);
  write(c, "12", 810, 760, 54, INK, 6);
  // the chalni: a steel bowl with holes, held by its handle
  const cx = 530, cy = 430;
  shape(c, () => { c.moveTo(cx - 190, cy); c.bezierCurveTo(cx - 170, cy + 130, cx + 170, cy + 130, cx + 190, cy); c.closePath(); }, COL.steel);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6 + r * 4; i++) { const t = (i + 0.5) / (6 + r * 4), hx = cx - 150 + t * 300, hy = cy + 24 + r * 30 - Math.pow((t - 0.5) * 2, 2) * (30 + r * 14); if (Math.abs(hx - cx) < 150 - r * 25) shape(c, () => ell(c, hx, hy, 6, 6), COL.steelDk, 0); }
  shape(c, () => ell(c, cx, cy, 190, 30), COL.steelIn, 5);
  shape(c, () => rrect(c, cx + 180, cy - 12, 170, 24, 12), COL.wood, 5);
  // rain drops from the chalni onto both containers
  for (let i = 0; i < 16; i++) { const dx = cx - 170 + i * 22, dy = 600 + ((i * 37) % 120); shape(c, () => { c.moveTo(dx, dy - 16); c.quadraticCurveTo(dx + 11, dy, dx, dy + 8); c.quadraticCurveTo(dx - 11, dy, dx, dy - 16); }, COL.water, 3); }
  // the mug pouring in, held by a grown-up
  c.save(); c.translate(560, 240); c.rotate(-0.6);
  shape(c, () => rrect(c, -70, -60, 140, 130, 14), COL.teal); shade(c, () => rrect(c, -70, -60, 140, 130, 14), COL.tealDk, 30, 0);
  shape(c, () => ell(c, 0, -60, 70, 18), COL.water, 5);
  shape(c, () => { c.moveTo(70, -30); c.bezierCurveTo(130, -30, 130, 50, 70, 50); c.lineTo(70, 30); c.bezierCurveTo(105, 30, 105, -10, 70, -10); c.closePath(); }, COL.teal, 5);
  c.restore();
  shape(c, () => { c.moveTo(498, 212); c.quadraticCurveTo(470, 300, 480, 400); c.lineTo(520, 400); c.quadraticCurveTo(515, 300, 540, 220); c.closePath(); }, COL.water, 4);
  arrow(c, [[400, 200], [380, 300], [420, 390]], RED, 9);
};

// e3: the sun crosses the sky; the shaded thermometer is read six times and the chart peaks in the afternoon
const flowE3 = (c: Ctx) => {
  ground(c);
  c.save(); c.setLineDash([18, 18]); c.beginPath(); c.arc(540, 620, 470, Math.PI * 1.08, Math.PI * 1.92); c.strokeStyle = COL.orange; c.lineWidth = 5; c.stroke(); c.restore();
  sun(c, 120, 500, 38, false);
  sun(c, 540, 160, 56);
  sun(c, 960, 500, 38, false);
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * 1.2 + (i / 8) * Math.PI * 0.6; pts.push([540 + Math.cos(a) * 520, 620 + Math.sin(a) * 520]); }
  arrow(c, pts, RED, 9);
  shape(c, () => rrect(c, 330, 334, 420, 26, 10), COL.grey);
  paperRoof(c, 540, 400, 260);
  thermometer(c, 540, 460, 280, 0.75, 50);
  // the notebook chart: temperature through the day, up then down
  page(c, 100, 790, 880, 250);
  line(c, [[170, 830], [170, 1000], [920, 1000]], 5, INK);
  const d = [28, 32, 34, 36, 35, 31], xs = d.map((_, i) => 230 + i * 130), ys = d.map((v) => 1000 - (v - 26) * 15);
  line(c, xs.map((x, i) => [x, ys[i]]), 7, COL.blue);
  xs.forEach((x, i) => shape(c, () => ell(c, x, ys[i], 11, 11), i === 3 ? RED : COL.blue, 3));
  xs.forEach((x) => sun(c, x, 1024, 9, false));
  write(c, "36", 592, 790, 44, RED, 6);
  write(c, "28", 150, 930, 44, INK, 6);
};

// p1: the finished weather station, and the child's diary with a week of readings
const flowP1 = (c: Ctx) => {
  ground(c);
  balcony(c, 220, 760);
  paperRoof(c, 250, 250, 240);
  thermometer(c, 250, 310, 280, 0.5, 60);
  rainJar(c, 520, 770, 130, 190, 60);
  windVane(c, 720, 770, 0.9);
  person(c, 900, 1030, 470, { armL: [Math.PI * 0.5, 0.15], armR: [Math.PI * 0.65, Math.PI * 0.9] });
  page(c, 790, 700, 220, 240);
  for (let r = 1; r <= 7; r++) line(c, [[800, 700 + r * 30], [1000, 700 + r * 30]], 2.5, COL.grey);
  for (let r = 0; r < 7; r++) write(c, String(28 + ((r * 5) % 9)), 820, 706 + r * 30, 22, INK, 3);
  line(c, [[880, 700], [880, 940]], 2.5, COL.grey); line(c, [[940, 700], [940, 940]], 2.5, COL.grey);
  for (let r = 0; r < 7; r++) { const y = 718 + r * 30; if (r % 3 === 1) shape(c, () => ell(c, 970, y, 16, 10), COL.steel, 2.5); else sun(c, 970, y, 9, false); }
  for (let r = 0; r < 7; r++) write(c, String(r === 2 ? 15 : r === 5 ? 4 : 0), 896, 706 + r * 30, 22, COL.blue, 3);
};

export const ic_weatherWeatherL3Fill = cards("sci.weather.weather.L3 fill", [intro, summary, flowE1, flowE2, flowE3, flowP1]);
