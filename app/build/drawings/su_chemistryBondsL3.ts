import type { Ctx } from "./core";
import { INK, COL, SKIN, CLOTH, WHITE, RED, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, write, cards, rnd } from "./flatKit";

// sci.chemistry.bonds.L3 set-up cards: steam to water, pencils and a 9-volt battery in soda water,
// wax and sugar on spoons over a flame, and three glasses of plain, sugar and soda water.

const WAX = "#fbf3d6", WIRE_BLK = "#5a5566", CARD = "#cfa56a";

// a water drop with its point up, round bottom at (x, y), radius s
const drop = (c: Ctx, x: number, y: number, s: number) =>
  shape(c, () => { c.moveTo(x, y - s * 1.8); c.bezierCurveTo(x + s * 0.3, y - s * 1.0, x + s, y - s * 0.6, x + s, y); c.arc(x, y, s, 0, Math.PI); c.bezierCurveTo(x - s, y - s * 0.6, x - s * 0.3, y - s * 1.0, x, y - s * 1.8); c.closePath(); }, COL.water, 4);
// points along a quadratic curve
const curve = (a: number[], b: number[], e: number[], n = 30) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * e[0], u * u * a[1] + 2 * u * t * b[1] + t * t * e[1]]; });
// a wavy curl of steam going up from (x, y0) to (x, y1)
const steam = (c: Ctx, x: number, y0: number, y1: number, amp = 22) => {
  const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([x + Math.sin(t * Math.PI * 3) * amp, y0 + (y1 - y0) * t]); }
  line(c, pts, 20, INK); line(c, pts, 11, "#f4f7fb");
};
const cube = (c: Ctx, x: number, y: number, s: number) => {
  const k = s * 0.87;
  shape(c, () => polyP(c, [[x - k, y - s * 0.5], [x, y], [x, y + s], [x - k, y + s * 0.5]]), "#f0f2f7", 4);
  shape(c, () => polyP(c, [[x, y], [x + k, y - s * 0.5], [x + k, y + s * 0.5], [x, y + s]]), "#cfd5e2", 4);
  shape(c, () => polyP(c, [[x, y - s], [x + k, y - s * 0.5], [x, y], [x - k, y - s * 0.5]]), WHITE, 4);
};
// a small white heap of powder
const heap = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - s, y); c.bezierCurveTo(x - s * 0.6, y - s * 0.9, x + s * 0.6, y - s * 0.9, x + s, y); c.closePath(); };
  shape(c, p, WHITE, 4); shade(c, p, "#b9c3d3", s * 0.3, s * 0.1, 0.5);
  const r = rnd(5); for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, x - s * 0.5 + r() * s, y - s * 0.12 - r() * s * 0.35, 2.5, 2.5); c.fillStyle = COL.greyDk; c.fill(); }
};
// a paper sticker on a glass: nothing, a sugar cube, or a heap of soda
const sticker = (c: Ctx, x: number, y: number, kind: "plain" | "sugar" | "soda", w = 110, h = 84) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 5);
  if (kind === "plain") drop(c, x, y + h * 0.14, h * 0.22);
  else if (kind === "sugar") cube(c, x, y - h * 0.12, h * 0.3);
  else heap(c, x, y + h * 0.22, h * 0.36);
};

// ---------------------------------------------------------------- pencils, battery, glass
// a pencil sharpened at both ends: top point at (x, top), bottom point at (x, bot)
const pencil = (c: Ctx, x: number, top: number, bot: number, pw: number) => {
  const L = pw * 1.6, h = pw / 2;
  const body = () => rrect(c, x - h, top + L, pw, bot - top - 2 * L, 2);
  shape(c, body, COL.yellow); shade(c, body, COL.woodDk, pw * 0.35, 0, 0.6);
  line(c, [[x - h * 0.45, top + L + 8], [x - h * 0.45, bot - L - 8]], 4, WHITE);
  for (const s of [1, -1]) {
    const y0 = s === 1 ? top + L : bot - L, y1 = s === 1 ? top : bot, tip = s === 1 ? top + L * 0.4 : bot - L * 0.4;
    shape(c, () => polyP(c, [[x - h, y0], [x + h, y0], [x, y1]]), "#f4d9a0", 5);
    shape(c, () => polyP(c, [[x - h * 0.3, tip], [x + h * 0.3, tip], [x, y1]]), COL.black, 3);
  }
};
type Electro = { gx: number; gy: number; gw: number; gh: number; bx: number; bw: number; bh: number; nRed: number; nBlk: number; seed: number };
// a glass of water, a cardboard strip across it, two pencils through the strip, a 9-volt battery beside it
// with a red wire round the far pencil and a black wire round the near one, bubbles at the tips
const electro = (c: Ctx, o: Electro) => {
  const { gx, gy, gw, gh, bx, bw, bh } = o, top = gy - gh, fill = 0.8, ly = gy - gh * fill;
  const gap = gw * 0.42, px1 = gx - gap / 2, px2 = gx + gap / 2, pw = gw * 0.1, ptop = top - 250, pbot = gy - gh * 0.38, coilY = ptop + pw * 1.6 + 60;
  glass(c, gx, gy, gw, gh, fill);
  shape(c, () => rrect(c, gx - gw / 2 - 50, top - 14, gw + 100, 28, 5), CARD, 5);
  pencil(c, px1, ptop, pbot, pw); pencil(c, px2, ptop, pbot, pw);
  const bot = gw * 0.4, lw = bot + (gw / 2 - bot) * fill;
  c.beginPath(); c.moveTo(gx - lw, ly); c.lineTo(gx + lw, ly); c.lineTo(gx + bot, gy); c.lineTo(gx - bot, gy); c.closePath(); c.fillStyle = "rgba(143,195,234,0.4)"; c.fill();
  const r = rnd(o.seed);
  const bubbles = (px: number, n: number) => { for (let i = 0; i < n; i++) { const rr = 7 + r() * 8, y = ly + 14 + (pbot - ly - 10) * (i / Math.max(1, n - 1)) * (0.6 + r() * 0.4); c.beginPath(); ell(c, px + (r() - 0.5) * gap * 0.55, y, rr, rr); c.fillStyle = "rgba(255,255,255,0.75)"; c.fill(); c.lineWidth = 3.5; c.strokeStyle = INK; c.stroke(); } };
  bubbles(px1, o.nRed); bubbles(px2, o.nBlk);
  // the battery, upright beside the glass, its two clip knobs on top
  const bTop = gy - bh, kn = bw * 0.24;
  shadow(c, bx + bw * 0.1, gy + 6, bw * 0.7, bw * 0.12);
  for (const k of [-1, 1]) shape(c, () => rrect(c, bx + k * kn - bw * 0.1, bTop - bw * 0.14, bw * 0.2, bw * 0.18, 6), COL.steel, 5);
  const body = () => rrect(c, bx - bw / 2, bTop, bw, bh, 14);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, bw * 0.16, 0, 0.6);
  shape(c, () => rrect(c, bx - bw / 2 + 5, bTop + bh * 0.55, bw - 10, bh * 0.25, 6), COL.yellow, 4);
  write(c, "9", bx - bh * 0.1, bTop + bh * 0.12, bh * 0.28, WHITE, 8);
  // wires: black from the left knob to the near pencil, red from the right knob over it to the far pencil
  const kY = bTop - bw * 0.1;
  const wire = (pts: number[][], col: string) => { line(c, pts, 17, INK); line(c, pts, 10, col); };
  wire(curve([bx - kn, kY], [px2 + (bx - kn - px2) * 0.35, coilY - 70], [px2 + pw / 2, coilY + 14]), WIRE_BLK);
  wire(curve([bx + kn, kY], [(bx + kn + px1) / 2, ptop - 300], [px1, coilY + 14]), RED);
  for (const [px, col] of [[px1, RED], [px2, WIRE_BLK]] as [number, string][]) for (let k = 0; k < 3; k++) { const y = coilY + k * 15; line(c, [[px - pw / 2 - 3, y + 8], [px + pw / 2 + 3, y - 8]], 14, INK); line(c, [[px - pw / 2 - 3, y + 8], [px + pw / 2 + 3, y - 8]], 8, col); }
};

// ---------------------------------------------------------------- spoons
// a steel spoon seen from above, bowl centre at (x, y), handle pointing along rot; content draws in the
// bowl's own coordinates (centre 0,0, inside about 128 x 85)
const spoon = (c: Ctx, x: number, y: number, rot: number, k: number, content: (c: Ctx) => void) => {
  const handle = () => { c.moveTo(100, -13); c.lineTo(560, -22); c.quadraticCurveTo(595, -22, 595, 0); c.quadraticCurveTo(595, 22, 560, 22); c.lineTo(100, 13); c.closePath(); };
  c.save(); c.translate(x + 16, y + 18); c.rotate(rot); c.scale(k, k); c.beginPath(); handle(); ell(c, 0, 0, 150, 105); c.fillStyle = SH; c.fill(); c.restore();
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  shape(c, handle, COL.steel, 6 / k); shade(c, handle, COL.steelDk, 0, 9, 0.6);
  shape(c, () => ell(c, 0, 0, 150, 105), COL.steel, 6 / k);
  shape(c, () => ell(c, -4, -2, 128, 85), COL.steelIn, 4 / k);
  content(c);
  c.restore();
};
const sugarPile = (c: Ctx) => {
  const p = () => ell(c, 0, 6, 100, 60);
  shape(c, p, WHITE, 5); shade(c, p, "#b9c3d3", 22, 18, 0.5);
  const r = rnd(3); for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 82; c.save(); c.translate(Math.cos(a) * d, 6 + Math.sin(a) * d * 0.55); c.rotate(r() * 3); c.beginPath(); c.rect(-5, -5, 10, 10); c.fillStyle = "#f4f7ff"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = INK; c.stroke(); c.restore(); }
};
const waxShavings = (c: Ctx) => {
  const spots = [[-60, -10], [10, -25], [60, 5], [-30, 28], [30, 30], [-85, 25], [0, 5]];
  spots.forEach(([cx, cy], i) => { const rr = 17 + (i % 3) * 5, a0 = i * 1.1; c.beginPath(); c.arc(cx, cy, rr, a0, a0 + 4.3); c.lineCap = "round"; c.strokeStyle = INK; c.lineWidth = 17; c.stroke(); c.beginPath(); c.arc(cx, cy, rr, a0, a0 + 4.3); c.strokeStyle = WAX; c.lineWidth = 9; c.stroke(); });
};

// ================================================================ e1: split water
// 1. a grown-up holds a steel plate over a mug of hot water; drops form under the plate
const setup_e1_0 = (c: Ctx) => {
  ground(c);
  // mug of hot water
  shadow(c, 580, 990, 220, 30);
  const hd = curve([690, 770], [790, 770], [790, 860], 20).concat(curve([790, 860], [790, 940], [690, 930], 20));
  line(c, hd, 46, INK); line(c, hd, 30, COL.teal);
  const mug = () => { c.moveTo(380, 710); c.lineTo(700, 710); c.lineTo(680, 960); c.quadraticCurveTo(540, 990, 400, 960); c.closePath(); };
  shape(c, mug, COL.teal); shade(c, mug, COL.tealDk, 60, 0, 0.6);
  shape(c, () => ell(c, 540, 710, 160, 34), COL.water, 5);
  shine(c, [[420, 780], [430, 920]], 10);
  // steam up to the plate
  steam(c, 450, 680, 470); steam(c, 540, 670, 450, -22); steam(c, 630, 680, 470);
  // the plate, edge on, with drops under it
  const sl = () => { c.moveTo(200, 330); c.lineTo(890, 330); c.quadraticCurveTo(870, 392, 800, 392); c.lineTo(290, 392); c.quadraticCurveTo(220, 392, 200, 330); c.closePath(); };
  shape(c, sl, COL.steel); shade(c, sl, COL.steelDk, 0, 16, 0.6); shine(c, [[260, 346], [560, 346]], 7);
  for (const [x, y, s] of [[330, 436, 14], [455, 428, 18], [580, 434, 15], [700, 430, 17], [395, 466, 10], [640, 470, 11]]) drop(c, x, y, s);
  hand(c, 990, 354, Math.PI, 1.3, SKIN.adult, CLOTH.adult);
  arrow(c, [[860, 650], [860, 500]]);
};

// 2. two pencils sharpened at both ends through a cardboard strip across a glass of soda water, 2 cm apart
const setup_e1_1 = (c: Ctx) => {
  ground(c);
  const gx = 540, gy = 940, gw = 440, gh = 420, top = gy - gh, gap = gw * 0.42, px1 = gx - gap / 2, px2 = gx + gap / 2, pw = gw * 0.1, ptop = top - 250, pbot = gy - gh * 0.38;
  glass(c, gx, gy, gw, gh, 0.8);
  shape(c, () => rrect(c, gx - gw / 2 - 50, top - 14, gw + 100, 28, 5), CARD, 5);
  pencil(c, px1, ptop, pbot, pw); pencil(c, px2, ptop, pbot, pw);
  const bot = gw * 0.4, ly = gy - gh * 0.8, lw = bot + (gw / 2 - bot) * 0.8;
  c.beginPath(); c.moveTo(gx - lw, ly); c.lineTo(gx + lw, ly); c.lineTo(gx + bot, gy); c.lineTo(gx - bot, gy); c.closePath(); c.fillStyle = "rgba(143,195,234,0.4)"; c.fill();
  // 2 cm between the pencils
  line(c, [[px1 + pw / 2 + 6, top - 40], [px2 - pw / 2 - 6, top - 40]], 4);
  line(c, [[px1 + pw / 2 + 6, top - 52], [px1 + pw / 2 + 6, top - 28]], 4); line(c, [[px2 - pw / 2 - 6, top - 52], [px2 - pw / 2 - 6, top - 28]], 4);
  write(c, "2 cm", gx - 49, top - 100, 34);
  arrow(c, [[px1, 60], [px1, 190]]); arrow(c, [[px2, 60], [px2, 190]]);
};

// 3. the battery joined: red wire on one pencil, black on the other, more bubbles at the black side
const setup_e1_2 = (c: Ctx) => {
  ground(c);
  electro(c, { gx: 340, gy: 960, gw: 400, gh: 400, bx: 860, bw: 160, bh: 240, nRed: 4, nBlk: 11, seed: 4 });
  arrow(c, [[570, 880], [570, 700]]);
};

// ================================================================ e2: wax or sugar
// 1. sugar on one spoon, wax shavings on the other
const setup_e2_0 = (c: Ctx) => {
  ground(c);
  spoon(c, 290, 330, Math.PI / 2, 1.0, sugarPile);
  spoon(c, 790, 330, Math.PI / 2, 1.0, waxShavings);
  arrow(c, [[290, 50], [290, 170]]); arrow(c, [[790, 50], [790, 170]]);
};

// 2. a grown-up holds a spoon wrapped in cloth over a gas flame, the sugar going brown
const setup_e2_1 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -50);
  const bx = 380, by = 450, r = 170;
  // hob and burner
  shape(c, () => rrect(c, 90, 850, 620, 70, 14), COL.steel); shade(c, () => rrect(c, 90, 850, 620, 70, 14), COL.steelDk, 0, 26, 0.6);
  shape(c, () => rrect(c, 270, 800, 220, 52, 12), COL.black);
  for (let i = 0; i < 5; i++) line(c, [[300 + i * 40, 812], [300 + i * 40, 838]], 5, COL.greyDk);
  // flame
  for (const [x, h, w] of [[310, 150, 30], [380, 215, 38], [450, 150, 30]]) {
    const f = (s: number) => { c.moveTo(x - w * s, 802); c.quadraticCurveTo(x - w * s, 802 - h * s * 0.5, x, 802 - h * s); c.quadraticCurveTo(x + w * s, 802 - h * s * 0.5, x + w * s, 802); c.closePath(); };
    shape(c, () => f(1), COL.orange, 5); shape(c, () => f(0.6), COL.yellow, 0);
    c.beginPath(); c.moveTo(x - w * 0.3, 802); c.quadraticCurveTo(x - w * 0.3, 802 - h * 0.15, x, 802 - h * 0.28); c.quadraticCurveTo(x + w * 0.3, 802 - h * 0.15, x + w * 0.3, 802); c.closePath(); c.fillStyle = COL.blue; c.fill();
  }
  // the spoon handle, a cloth wrapped on it
  const hdl = () => { c.moveTo(bx + 100, by - 14); c.lineTo(960, by - 20); c.lineTo(960, by + 20); c.lineTo(bx + 100, by + 14); c.closePath(); };
  shape(c, hdl, COL.steel);
  shape(c, () => rrect(c, 640, by - 36, 170, 72, 16), COL.cloth, 6); shade(c, () => rrect(c, 640, by - 36, 170, 72, 16), "#d9cfb8", 0, 24, 0.6);
  line(c, [[690, by - 28], [682, by + 28]], 4, COL.grey); line(c, [[740, by - 30], [734, by + 30]], 4, COL.grey);
  // the bowl of the spoon: caramel inside, a few white crystals left at one edge
  const body = () => { c.moveTo(bx - r, by); c.bezierCurveTo(bx - r * 0.9, by + r * 0.75, bx + r * 0.9, by + r * 0.75, bx + r, by); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.35, -r * 0.05, 0.6);
  shape(c, () => ell(c, bx, by, r, r * 0.22), "#a8581c", 5);
  shape(c, () => ell(c, bx + 25, by + 2, r * 0.62, r * 0.14), "#7a3f12", 0);
  const q = rnd(8); for (let i = 0; i < 5; i++) { c.save(); c.translate(bx - r * 0.78 + i * 15 + q() * 8, by - 6 + q() * 20); c.rotate(q() * 3); c.beginPath(); c.rect(-6, -6, 12, 12); c.fillStyle = WHITE; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); c.restore(); }
  for (const [x, y] of [[bx + 20, by - 4], [bx + 80, by + 8], [bx + 48, by + 14]]) { c.beginPath(); ell(c, x, y, 7, 5); c.fillStyle = "#e0a05a"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = INK; c.stroke(); }
  hand(c, 930, by, Math.PI, 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[640, 830], [640, 650]]); c.restore();
};

// 3. two cooled spoons on a steel plate: hard white wax, a brown glassy lump
const setup_e2_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 470, 330);
  spoon(c, 290, 430, 0, 0.9, (c) => {
    const p = () => ell(c, 0, 4, 102, 62);
    shape(c, p, WAX, 5); shade(c, p, "#d9cfae", 22, 18, 0.5); shine(c, [[-60, -14], [-10, -30]], 9);
  });
  spoon(c, 290, 720, 0, 0.9, (c) => {
    const p = () => { c.moveTo(-95, 12); c.bezierCurveTo(-100, -40, -40, -62, 10, -52); c.bezierCurveTo(70, -58, 108, -20, 96, 22); c.bezierCurveTo(70, 62, -50, 64, -95, 12); c.closePath(); };
    shape(c, p, "#c0722a", 5); shade(c, p, "#7a3f12", 28, 20, 0.6);
    shine(c, [[-62, -10], [-30, -34], [10, -40]], 10); shine(c, [[30, 22], [64, 10]], 7);
  });
  arrow(c, [[540, 60], [540, 190]]);
};

// ================================================================ e3: plain, sugar, soda
// 1. three glasses of water, labelled; sugar and soda being added to two of them
const setup_e3_0 = (c: Ctx) => {
  ground(c);
  const gy = 960, gh = 390, xs = [190, 540, 890];
  xs.forEach((x) => glass(c, x, gy, 290, gh, 0.75));
  sticker(c, xs[0], gy - 120, "plain"); sticker(c, xs[1], gy - 120, "sugar"); sticker(c, xs[2], gy - 120, "soda");
  cube(c, xs[1] - 30, 270, 38); cube(c, xs[1] + 40, 282, 38); cube(c, xs[1] + 5, 222, 38);
  heap(c, xs[2], 310, 78);
  arrow(c, [[xs[1], 360], [xs[1], 490]]); arrow(c, [[xs[2], 360], [xs[2], 490]]);
};

// 2. the pencils and battery in the soda glass with many bubbles, in the sugar glass almost none
const setup_e3_1 = (c: Ctx) => {
  ground(c);
  const gy = 970, gh = 300;
  electro(c, { gx: 195, gy, gw: 270, gh, bx: 470, bw: 110, bh: 170, nRed: 6, nBlk: 14, seed: 6 });
  electro(c, { gx: 715, gy, gw: 270, gh, bx: 990, bw: 110, bh: 170, nRed: 0, nBlk: 1, seed: 9 });
  sticker(c, 195, gy - 50, "soda", 100, 70); sticker(c, 715, gy - 50, "sugar", 100, 70);
};

export const su_chemistryBondsL3 = cards("sci.chemistry.bonds.L3 set-up", [setup_e1_0, setup_e1_1, setup_e1_2, setup_e2_0, setup_e2_1, setup_e2_2, setup_e3_0, setup_e3_1]);
