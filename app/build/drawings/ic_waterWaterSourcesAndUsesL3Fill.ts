import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, person, hand, cards } from "./flatKit";

// WATER SOURCES AND USES L3 · fill-in cards: cover, four experiments, one project.

const SKY = "#dcefFb";
const CLAY = "#b8623a", CLAYDK = "#8f4728";

// a rain cloud with drops falling from it
const cloud = (c: Ctx, x: number, y: number, s: number, drops = 6, dropLen = 60) => {
  const p = () => { c.moveTo(x - 110 * s, y + 30 * s); c.arc(x - 70 * s, y + 10 * s, 50 * s, Math.PI * 0.6, Math.PI * 1.45); c.arc(x - 10 * s, y - 30 * s, 62 * s, Math.PI * 0.95, Math.PI * 1.9); c.arc(x + 65 * s, y - 5 * s, 55 * s, Math.PI * 1.2, Math.PI * 0.1); c.arc(x + 20 * s, y + 35 * s, 40 * s, 0, Math.PI * 0.5); c.closePath(); };
  shape(c, p, "#f2f6fb");
  shade(c, p, COL.steel, 18 * s, 14 * s, 0.45);
  for (let i = 0; i < drops; i++) { const dx = x - 95 * s + (i * 190 * s) / Math.max(1, drops - 1), dy = y + 75 * s + (i % 2) * 22; line(c, [[dx, dy], [dx - 6, dy + dropLen]], 8, COL.blueDk); }
};
// a plain drop shape, point up, centre (x,y)
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.05, y - r * 0.2, x + r, y + r * 0.1); c.arc(x, y + r * 0.1, r, 0, Math.PI, false); c.quadraticCurveTo(x - r * 1.05, y - r * 0.2, x, y - r * 1.6); c.closePath(); }, col, 5);
  shine(c, [[x - r * 0.45, y - r * 0.1], [x - r * 0.3, y + r * 0.4]], 5);
};
// a side-view box (tub) with its contents coloured; top edge at y, from x to x+w, depth h
const tub = (c: Ctx, x: number, y: number, w: number, h: number, fillCol: string, lineCol = INK) => {
  shadow(c, x + w / 2 + 10, y + h + 8, w * 0.55, 14);
  shape(c, () => rrect(c, x, y, w, h, 10), "#e8eef3", 6);
  shape(c, () => { c.rect(x + 8, y + h * 0.3, w - 16, h * 0.7 - 8); }, fillCol, 0);
  line(c, [[x + 8, y + h * 0.3], [x + w - 8, y + h * 0.3]], 4, lineCol);
};
// pebbles sprinkled inside a rectangle
const pebbles = (c: Ctx, x: number, y: number, w: number, h: number, n: number, r: number, seed: number, col = COL.grey) => {
  const R = rnd(seed);
  for (let i = 0; i < n; i++) { const px = x + r + R() * (w - 2 * r), py = y + r + R() * (h - 2 * r); shape(c, () => ell(c, px, py, r * (0.8 + R() * 0.4), r * 0.75, R() * 3), col, 3.5); }
};
// a steel bottle standing, base centre (x,y)
const steelBottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.65, w * 0.14);
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.72); c.quadraticCurveTo(x - w / 2, y - h * 0.86, x - w * 0.22, y - h * 0.88); c.lineTo(x + w * 0.22, y - h * 0.88); c.quadraticCurveTo(x + w / 2, y - h * 0.86, x + w / 2, y - h * 0.72); c.lineTo(x + w / 2, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0, 0.5);
  shape(c, () => rrect(c, x - w * 0.22, y - h, w * 0.44, h * 0.13, 6), COL.black);
  shine(c, [[x - w * 0.3, y - h * 0.7], [x - w * 0.3, y - h * 0.2]], 8);
};
// a thermometer: bulb at (x,y), standing up to height h, mercury fraction f
const thermo = (c: Ctx, x: number, y: number, h: number, f: number) => {
  shape(c, () => rrect(c, x - 14, y - h, 28, h, 14), WHITE, 5);
  line(c, [[x, y - 20], [x, y - 20 - (h - 40) * f]], 10, RED);
  shape(c, () => ell(c, x, y, 24, 24), RED, 5);
  for (let i = 1; i < 6; i++) line(c, [[x + 4, y - 30 - i * (h - 60) / 6], [x + 12, y - 30 - i * (h - 60) / 6]], 3, INK);
};

// ---------------------------------------------------------------- intro: where water comes from
const intro = (c: Ctx) => {
  ground(c, SKY);
  // ground cut-away: soil, then pebbles with groundwater
  shape(c, () => { c.rect(0, 560, D, 520); }, COL.soil, 0);
  shape(c, () => { c.rect(0, 760, D, 320); }, COL.water, 0);
  pebbles(c, 0, 770, D, 300, 60, 26, 4, COL.steel);
  line(c, [[0, 560], [D, 560]], 7); line(c, [[0, 760], [D, 760]], 5, COL.waterDk);
  // grass line
  shape(c, () => { c.rect(0, 545, D, 22); }, COL.green, 0); line(c, [[0, 545], [D, 545]], 6);
  // rain cloud and rain soaking in
  cloud(c, 300, 180, 1.25, 7, 90);
  for (let i = 0; i < 4; i++) arrow(c, [[170 + i * 85, 600], [170 + i * 85, 730]], COL.blueDk, 7);
  // borewell: pipe from a tap at the top down into the water
  shape(c, () => rrect(c, 745, 330, 44, 560, 6), COL.steel); shade(c, () => rrect(c, 745, 330, 44, 560, 6), COL.steelDk, 14, 0, 0.6);
  shape(c, () => rrect(c, 735, 300, 64, 40, 8), COL.blueDk, 6);
  shape(c, () => rrect(c, 789, 318, 90, 26, 8), COL.blueDk, 6);
  arrow(c, [[767, 850], [767, 620]], RED, 9);
  // water falling from the tap into the child's glass
  line(c, [[875, 345], [875, 420]], 14, COL.water);
  // the child holding a glass under the tap
  person(c, 960, 545, 300, { armL: [Math.PI * 0.75, Math.PI * 1.55], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  glass(c, 880, 480, 70, 100, 0.6);
};

// ---------------------------------------------------------------- e1: rain on four grounds
const e1 = (c: Ctx) => {
  ground(c);
  const tops = 640, w = 215, h = 220;
  const xs = [45, 300, 555, 810];
  tub(c, xs[0], tops, w, h, COL.soil); // soil: water soaked in, dark patch
  shape(c, () => ell(c, xs[0] + w / 2, tops + h * 0.3 + 40, 70, 40), COL.soilDk, 0);
  tub(c, xs[1], tops, w, h, "#e9d49a"); // sand
  pebbles(c, xs[1] + 12, tops + h * 0.32, w - 24, h * 0.6, 30, 5, 3, "#d9bf7d");
  tub(c, xs[2], tops, w, h, COL.greyDk); // gravel
  pebbles(c, xs[2] + 12, tops + h * 0.32, w - 24, h * 0.62, 22, 16, 5, COL.grey);
  shape(c, () => { c.rect(xs[2] + 8, tops + h * 0.75, w - 16, h * 0.25 - 8); }, COL.water, 0);
  line(c, [[xs[2] + 8, tops + h * 0.75], [xs[2] + w - 8, tops + h * 0.75]], 4, COL.waterDk);
  // the tile on a tray: water runs off and pools
  shadow(c, xs[3] + w / 2 + 10, tops + h + 8, w * 0.55, 14);
  shape(c, () => rrect(c, xs[3], tops + h * 0.55, w, h * 0.45, 8), "#e8eef3", 6);
  shape(c, () => { c.rect(xs[3] + 8, tops + h * 0.75, w - 16, h * 0.25 - 8); }, COL.water, 0);
  shape(c, () => rrect(c, xs[3] + 30, tops + h * 0.4, w - 60, h * 0.26, 4), "#f0e3d6", 6);
  shade(c, () => rrect(c, xs[3] + 30, tops + h * 0.4, w - 60, h * 0.26, 4), COL.grey, 12, 10, 0.4);
  arrow(c, [[xs[3] + w * 0.55, tops + h * 0.36], [xs[3] + w * 0.9, tops + h * 0.36], [xs[3] + w * 0.98, tops + h * 0.7]], RED, 7);
  arrow(c, [[xs[0] + w / 2, tops + h * 0.2], [xs[0] + w / 2, tops + h * 0.75]], RED, 7);
  // the mug, tipped, pouring on the soil tub; a child's hand holds it
  const mx = 250, my = 320;
  c.save(); c.translate(mx, my); c.rotate(-2.2);
  shape(c, () => rrect(c, -80, -110, 160, 220, 20), COL.teal); shade(c, () => rrect(c, -80, -110, 160, 220, 20), COL.tealDk, 40, 0, 0.5);
  line(c, [[-60, -40], [60, -40]], 6, WHITE);
  shape(c, () => ell(c, 0, -110, 80, 22), COL.water, 6);
  c.restore();
  hand(c, 330, 290, Math.PI, 1.05, SKIN.child, CLOTH.child);
  // water pouring
  shape(c, () => { c.moveTo(130, 390); c.quadraticCurveTo(115, 450, 125, 560); c.lineTo(175, 560); c.quadraticCurveTo(170, 460, 180, 400); c.closePath(); }, COL.water, 5);
  // a clock
  shape(c, () => ell(c, 880, 300, 95, 95), WHITE, 6);
  line(c, [[880, 300], [880, 240]], 7); line(c, [[880, 300], [925, 320]], 7, RED);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[880 + Math.cos(a) * 78, 300 + Math.sin(a) * 78], [880 + Math.cos(a) * 88, 300 + Math.sin(a) * 88]], 4); }
};

// ---------------------------------------------------------------- e2: a well in a jar
const e2 = (c: Ctx) => {
  ground(c);
  const x = 330, y = 390, w = 440, h = 570;
  shadow(c, x + w / 2 + 20, y + h + 10, w * 0.55, 22);
  // layers: pebbles at the bottom, sand, soil on top
  shape(c, () => { c.rect(x, y + h * 0.5, w, h * 0.5); }, COL.grey, 0);
  shape(c, () => { c.rect(x, y + h * 0.6, w, h * 0.4); }, COL.water, 0);
  pebbles(c, x + 6, y + h * 0.5, w - 12, h * 0.5 - 8, 70, 24, 11, "#d6d2c8");
  shape(c, () => { c.rect(x, y + h * 0.3, w, h * 0.2); }, "#e9d49a", 0);
  pebbles(c, x + 8, y + h * 0.3, w - 16, h * 0.2, 60, 5, 21, "#d9bf7d");
  shape(c, () => { c.rect(x, y + h * 0.17, w, h * 0.13); }, COL.soil, 0);
  line(c, [[x, y + h * 0.3], [x + w, y + h * 0.3]], 4); line(c, [[x, y + h * 0.5], [x + w, y + h * 0.5]], 4);
  line(c, [[x, y + h * 0.6], [x + w, y + h * 0.6]], 5, COL.waterDk);
  // the straw well from above the soil down into the water, water inside it to the same level
  shape(c, () => rrect(c, x + w / 2 - 22, y - 40, 44, h * 0.88 + 40, 8), "#f6f1ea", 6);
  shape(c, () => { c.rect(x + w / 2 - 16, y + h * 0.6, 32, h * 0.26); }, COL.waterDk, 0);
  // the jar, drawn over the layers so the glass shows
  shape(c, () => rrect(c, x, y, w, h, 26), COL.glass, 7);
  shine(c, [[x + 40, y + 60], [x + 40, y + h - 80]], 10);
  // the syringe pulling water up out of the straw
  const sx = x + w / 2, sy = y - 40;
  shape(c, () => rrect(c, sx - 40, sy - 200, 80, 160, 10), COL.glass, 6);
  shape(c, () => { c.rect(sx - 34, sy - 130, 68, 84); }, COL.water, 0);
  shape(c, () => rrect(c, sx - 10, sy - 40, 20, 40, 4), COL.steel, 5);
  shape(c, () => rrect(c, sx - 10, sy - 290, 20, 100, 6), COL.black, 5);
  shape(c, () => rrect(c, sx - 70, sy - 305, 140, 28, 8), COL.black, 5);
  arrow(c, [[sx + 130, sy - 40], [sx + 130, sy - 230]], RED, 9);
  // the grown-up's hand on the plunger
  hand(c, sx - 220, sy - 291, 0, 1.15, SKIN.adult, CLOTH.adult);
  // rain from a cup, soaking into the soil
  cloud(c, 160, 200, 0.75, 4, 50);
  arrow(c, [[160, 320], [160, 380], [x - 30, y + h * 0.17 + 40]], COL.blueDk, 8);
  // marker line of the water level on the jar
  line(c, [[x + w + 8, y + h * 0.6], [x + w + 60, y + h * 0.6]], 8, RED);
};

// ---------------------------------------------------------------- e3: the cool matka test
const e3 = (c: Ctx) => {
  ground(c);
  // sun
  shape(c, () => ell(c, 920, 150, 80, 80), COL.yellow, 6);
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[920 + Math.cos(a) * 105, 150 + Math.sin(a) * 105], [920 + Math.cos(a) * 135, 150 + Math.sin(a) * 135]], 7, COL.orange); }
  // table line
  line(c, [[40, 860], [1040, 860]], 7);
  // the matka: round clay pot with a lid, big in the middle
  const mx = 380, my = 860;
  shadow(c, mx + 40, my + 2, 230, 34);
  const pot = () => { c.moveTo(mx - 130, my - 470); c.bezierCurveTo(mx - 300, my - 420, mx - 290, my - 60, mx - 110, my); c.lineTo(mx + 110, my); c.bezierCurveTo(mx + 290, my - 60, mx + 300, my - 420, mx + 130, my - 470); c.closePath(); };
  shape(c, pot, CLAY); shade(c, pot, CLAYDK, 70, 0, 0.5);
  shape(c, () => ell(c, mx, my - 470, 130, 30), CLAYDK, 6);
  // small drops sweating through the clay
  for (let i = 0; i < 7; i++) drop(c, mx - 170 + i * 50 + (i % 2) * 20, my - 280 + (i % 3) * 60, 11, COL.drop);
  // the lid, lifted a little, with a thermometer going in
  shape(c, () => ell(c, mx + 90, my - 520, 150, 34), "#f0e3d6", 6);
  thermo(c, mx, my - 440, 330, 0.3);
  // two steel bottles: one plain, one wrapped in a wet cloth
  steelBottle(c, 760, 860, 120, 420);
  steelBottle(c, 950, 860, 120, 420);
  const cl = () => rrect(c, 950 - 76, 860 - 320, 152, 290, 14);
  shape(c, cl, COL.water); shade(c, cl, COL.waterDk, 30, 0, 0.5);
  for (let i = 0; i < 4; i++) line(c, [[950 - 60, 860 - 270 + i * 60], [950 + 60, 860 - 260 + i * 60]], 4, COL.waterDk);
  for (let i = 0; i < 3; i++) drop(c, 950 - 50 + i * 50, 860 - 10 - (i % 2) * 20, 9, COL.drop);
};

// ---------------------------------------------------------------- e4: the invisible ring
const e4 = (c: Ctx) => {
  ground(c);
  // two glasses that look the same
  glass(c, 170, 420, 180, 260, 0.75);
  glass(c, 420, 420, 180, 260, 0.75);
  // dark plate, big, with the dried rings on it
  const px = 540, py = 760;
  shadow(c, px + 20, py + 40, 430, 150);
  shape(c, () => ell(c, px, py, 430, 150), COL.black);
  shape(c, () => ell(c, px, py - 6, 370, 118), "#4a4550", 4);
  // left spot: tap water, almost nothing; middle: salt water, a white ring; right: soil water, a brown ring
  shape(c, () => ell(c, px - 240, py, 70, 32), "#55505b", 3);
  c.save(); c.lineWidth = 14; c.strokeStyle = WHITE; c.beginPath(); ell(c, px - 20, py, 95, 42); c.stroke(); c.restore();
  const R = rnd(31); for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2; shape(c, () => ell(c, px - 20 + Math.cos(a) * 95, py + Math.sin(a) * 42, 6, 5), WHITE, 0); }
  c.save(); c.lineWidth = 14; c.strokeStyle = COL.brown; c.beginPath(); ell(c, px + 210, py, 90, 40); c.stroke(); c.restore();
  shape(c, () => ell(c, px + 210, py + 6, 50, 22), COL.soil, 0);
  // the spoon tipping a spoonful onto the plate, held by the child's hand
  c.save(); c.translate(560, 330); c.rotate(0.35);
  shape(c, () => rrect(c, 60, -14, 300, 28, 14), COL.steel, 6);
  shape(c, () => ell(c, 0, 0, 80, 54), COL.steel, 6); shape(c, () => ell(c, -6, -2, 56, 36), COL.steelIn, 4);
  c.restore();
  hand(c, 960, 410, Math.PI * 0.87, 1.05, SKIN.child, CLOTH.child);
  drop(c, 520, 470, 16); drop(c, 528, 560, 16); drop(c, 522, 650, 16);
  arrow(c, [[580, 420], [580, 640]], RED, 8);
  // sun drying it
  shape(c, () => ell(c, 930, 130, 70, 70), COL.yellow, 6);
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; line(c, [[930 + Math.cos(a) * 92, 130 + Math.sin(a) * 92], [930 + Math.cos(a) * 118, 130 + Math.sin(a) * 118]], 6, COL.orange); }
};

// ---------------------------------------------------------------- p1: catch the rain, a model rooftop tank
const p1 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 900], [1040, 900]], 7);
  // the shoebox house
  const bx = 200, by = 900, bw = 460, bh = 330;
  shadow(c, bx + bw / 2 + 30, by + 4, bw * 0.6, 26);
  shape(c, () => { c.rect(bx, by - bh, bw, bh); }, COL.wood); shade(c, () => { c.rect(bx, by - bh, bw, bh); }, COL.woodDk, bw * 0.3, 0, 0.5);
  shape(c, () => rrect(c, bx + 170, by - 140, 100, 140, 8), COL.brown, 6);
  shape(c, () => rrect(c, bx + 50, by - 260, 90, 80, 6), COL.sky, 6);
  // the sloping foil roof, high on the left, low towards the gutter on the right
  const roof = () => { c.moveTo(bx - 50, by - bh - 150); c.lineTo(bx + bw + 20, by - bh - 30); c.lineTo(bx + bw + 20, by - bh + 4); c.lineTo(bx - 50, by - bh - 116); c.closePath(); };
  shape(c, roof, COL.steelIn); shade(c, roof, COL.steel, 0, 20, 0.5);
  shine(c, [[bx + 10, by - bh - 120], [bx + 300, by - bh - 44]], 7);
  // gutter: half bottle along the roof's low edge, tipping towards the tank
  const gx = bx + bw + 20, gy = by - bh + 10;
  shape(c, () => { c.moveTo(gx - 60, gy - 20); c.lineTo(gx + 70, gy); c.lineTo(gx + 70, gy + 50); c.quadraticCurveTo(gx, gy + 90, gx - 60, gy + 30); c.closePath(); }, COL.glass, 6);
  // water running from roof, into the gutter, down into the bottle tank
  shape(c, () => { c.moveTo(gx + 40, gy + 30); c.lineTo(gx + 72, gy + 30); c.lineTo(gx + 72, by - 70); c.lineTo(gx + 40, by - 70); c.closePath(); }, COL.water, 0);
  arrow(c, [[bx + 120, by - bh - 120], [bx + 430, by - bh - 38]], RED, 9);
  arrow(c, [[gx + 110, gy + 20], [gx + 110, by - 180]], RED, 9);
  // the tank: a clear bottle with the caught water in it
  const tx = gx + 56, ty = by;
  shadow(c, tx + 14, ty + 4, 90, 18);
  shape(c, () => { c.rect(tx - 64, ty - 190, 128, 190); }, COL.water, 0);
  shape(c, () => { c.moveTo(tx - 70, ty); c.lineTo(tx - 70, ty - 250); c.quadraticCurveTo(tx - 70, ty - 300, tx - 30, ty - 310); c.lineTo(tx + 30, ty - 310); c.quadraticCurveTo(tx + 70, ty - 300, tx + 70, ty - 250); c.lineTo(tx + 70, ty); c.closePath(); }, COL.glass, 7);
  shine(c, [[tx - 50, ty - 230], [tx - 50, ty - 60]], 8);
  for (let i = 1; i <= 4; i++) line(c, [[tx + 44, ty - 46 * i], [tx + 66, ty - 46 * i]], 4);
  // the rain: a watering can held by the grown-up over the roof
  const wx = 200, wy = 220;
  c.save(); c.translate(wx, wy); c.rotate(0.5);
  shape(c, () => rrect(c, -100, -70, 200, 150, 18), COL.green); shade(c, () => rrect(c, -100, -70, 200, 150, 18), COL.greenDk, 50, 0, 0.5);
  shape(c, () => rrect(c, 90, -40, 140, 26, 10), COL.green, 6);
  shape(c, () => ell(c, 240, -27, 30, 36), COL.greenDk, 6);
  shape(c, () => rrect(c, -60, -96, 120, 36, 14), COL.green, 6);
  c.restore();
  hand(c, 70, 100, Math.PI * 0.42, 1.1, SKIN.adult, CLOTH.adult);
  const R = rnd(9);
  for (let i = 0; i < 14; i++) { const dx = 300 + R() * 300, dy = 220 + R() * 160; line(c, [[dx, dy], [dx - 8, dy + 44]], 7, COL.blueDk); }
};

export const ic_waterWaterSourcesAndUsesL3Fill = cards("sci.water.water-sources-and-uses.L3 fill", [intro, e1, e2, e3, e4, p1]);
