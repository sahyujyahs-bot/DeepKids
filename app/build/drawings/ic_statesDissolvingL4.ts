import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, person, write, cards } from "./flatKit";

// DISSOLVING L4 · water or oil, fizz and warmth, kulfi in a bag: set-up cards and card pictures in the flat kit look.

const TABLE = "#dccbaa", OIL = "#f7d868", GOLD = "#e8a826", ORANGE_RED = "#e0642a", TURM = "#e9b421", CHILLI = "#c8371f", FOOD = "#e03a3a";
const MILK = "#fbf7ee", SODA = "#dfeef4", ICE = "#dff3fb", ICE_DK = "#a9d4e8", KULFI = "#f6ecd2", STRING = "#f4e9cf";

// the counter: its far edge at ty, the surface running down to the bottom of the card
const table = (c: Ctx, ty: number) => { c.fillStyle = TABLE; c.fillRect(0, ty, D, D - ty); line(c, [[0, ty], [D, ty]], 6); };
// a white sheet of paper standing on the counter, bottom-left corner at (x, y)
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + 4, w * 0.5, 10); shape(c, () => rrect(c, x, y - h, w, h, 8), WHITE, 5); };
// the liquid area of a kit glass (same geometry as glass())
const liqPath = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => { const top = w / 2, bot = w * 0.4, ly = y - h * fill, lw = bot + (top - bot) * fill; c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
type JarOpts = { bits?: string; n?: number; settle?: boolean; beads?: string; seed?: number };
// a jar: a kit glass, plus undissolved bits (floating, or mostly settled with a layer at the bottom) or beads on the bottom
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, o: JarOpts = {}) => {
  glass(c, x, y, w, h, fill, liquid);
  const r = rnd(o.seed ?? 3), bot = w * 0.4, ly = y - h * fill;
  if (o.bits) {
    c.save(); c.beginPath(); liqPath(c, x, y, w, h, fill); c.clip();
    if (o.settle) shape(c, () => rrect(c, x - bot - 4, y - h * 0.09, bot * 2 + 8, h * 0.09 + 6, 4), o.bits, 0);
    for (let i = 0; i < (o.n ?? 40); i++) { const t = r(), by = ly + 8 + (y - ly - 12) * (o.settle ? Math.pow(t, 0.35) : t), bx = x + (r() - 0.5) * 2 * bot * 0.85; shape(c, () => ell(c, bx, by, 3.5 + r() * 3, 2.5 + r() * 2), o.bits, 1.5); }
    c.restore();
  }
  if (o.beads) for (let i = 0; i < 6; i++) { const bx = x - bot * 0.65 + i * bot * 0.26; shape(c, () => ell(c, bx, y - 9, 8, 6), o.beads, 2.5); }
};
// a drop symbol, tip at the top
const drop = (c: Ctx, x: number, y: number, s: number, col: string) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.95, y + s * 0.15, x + s * 0.58, y + s * 0.6); c.arc(x, y + s * 0.45, s * 0.6, 0.25, Math.PI - 0.25); c.quadraticCurveTo(x - s * 0.95, y + s * 0.15, x, y - s); c.closePath(); }, col, 4);
// a paper label stuck on a jar: a blue drop for water, a golden drop for oil, grains for salt or soil, a white drop for milk
const label = (c: Ctx, x: number, y: number, kind: "water" | "oil" | "salt" | "soil" | "milk" | "plain") => {
  shape(c, () => rrect(c, x - 42, y - 28, 84, 56, 6), WHITE, 4);
  if (kind === "water") drop(c, x, y - 2, 17, COL.blueDk);
  else if (kind === "oil") drop(c, x, y - 2, 17, GOLD);
  else if (kind === "milk") drop(c, x, y - 2, 17, "#f3eee0");
  else if (kind === "plain") { c.beginPath(); c.arc(x, y, 14, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); }
  else { const r = rnd(kind === "salt" ? 4 : 9); for (let i = 0; i < 9; i++) shape(c, () => ell(c, x - 22 + r() * 44, y - 14 + r() * 28, 5, 4), kind === "salt" ? WHITE : COL.soil, 2.5); }
};
// a torch: body, wider head, lens; pointing at angle an from its tail at (x, y)
const torch = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -len * 0.12, len * 0.72, len * 0.24, len * 0.08), COL.black);
  shape(c, () => polyP(c, [[len * 0.7, -len * 0.13], [len, -len * 0.2], [len, len * 0.2], [len * 0.7, len * 0.13]]), COL.greyDk);
  shape(c, () => ell(c, len, 0, len * 0.04, len * 0.2), COL.yellow, 4);
  shape(c, () => rrect(c, len * 0.1, -len * 0.05, len * 0.14, len * 0.1, 4), COL.teal, 3);
  c.restore();
};
// a wedge of light from a to b, half-widths w0 and w1
const beam = (c: Ctx, a: [number, number], b: [number, number], w0: number, w1: number, alpha: number) => {
  const an = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(an), ny = Math.cos(an);
  c.beginPath(); c.moveTo(a[0] + nx * w0, a[1] + ny * w0); c.lineTo(b[0] + nx * w1, b[1] + ny * w1); c.lineTo(b[0] - nx * w1, b[1] - ny * w1); c.lineTo(a[0] - nx * w0, a[1] - ny * w0); c.closePath();
  c.fillStyle = `rgba(255,232,120,${alpha})`; c.fill();
};
type BottleOpts = { cap?: boolean; bubbles?: number; seed?: number; band?: string; level?: number; tilt?: number; thread?: boolean };
// a 500 ml plastic soda bottle, bottom centre (x, y), height h to the top of the cap; fill 0..1 of liquid.
// level (world-y relative to the current origin, for a tilted bottle) makes the liquid surface horizontal on the card.
const bottle = (c: Ctx, x: number, y: number, h: number, fill: number, liq: string, o: BottleOpts = {}) => {
  const bw = h * 0.17, nw = h * 0.07, sy = y - h * 0.66, ny = y - h * 0.8, ty = y - h * 0.9;
  const body = () => { c.moveTo(x - bw, y - bw * 0.3); c.quadraticCurveTo(x - bw, y, x - bw * 0.7, y); c.lineTo(x + bw * 0.7, y); c.quadraticCurveTo(x + bw, y, x + bw, y - bw * 0.3); c.lineTo(x + bw, sy); c.quadraticCurveTo(x + bw, ny - 12, x + nw, ny); c.lineTo(x + nw, ty); c.lineTo(x - nw, ty); c.lineTo(x - nw, ny); c.quadraticCurveTo(x - bw, ny - 12, x - bw, sy); c.closePath(); };
  shape(c, body, "rgba(236,246,252,0.92)", 0);
  c.save(); c.beginPath(); body(); c.clip();
  if (o.level !== undefined) { c.save(); c.rotate(-(o.tilt ?? 0)); c.fillStyle = liq; c.fillRect(-900, o.level, 1800, 1200); c.restore(); }
  else { c.fillStyle = liq; c.fillRect(x - bw - 2, y - h * fill, bw * 2 + 4, h * fill + 2); }
  const r = rnd(o.seed ?? 5);
  if (o.bubbles) for (let i = 0; i < o.bubbles; i++) { const bx = o.thread ? x + (r() - 0.5) * 16 : x + (r() - 0.5) * bw * 1.6, by = y - 10 - r() * (h * fill - 14); shape(c, () => ell(c, bx, by, 3 + r() * 3, 3 + r() * 3), "rgba(255,255,255,0.95)", 1.5); }
  c.restore();
  shade(c, body, "#9fb8c8", -bw * 0.45, 0, 0.35);
  if (o.band) shape(c, () => rrect(c, x - bw - 1, y - h * 0.5, bw * 2 + 2, h * 0.16, 4), o.band, 4);
  shape(c, body, "rgba(0,0,0,0)", 5);
  shine(c, [[x - bw * 0.62, y - h * 0.58], [x - bw * 0.62, y - h * 0.12]], 7);
  if (o.cap !== false) { shape(c, () => rrect(c, x - nw - 7, ty - h * 0.07, nw * 2 + 14, h * 0.07 + 4, 5), RED); for (let k = 1; k < 4; k++) line(c, [[x - nw - 7 + k * (nw * 2 + 14) / 4, ty - h * 0.06], [x - nw - 7 + k * (nw * 2 + 14) / 4, ty - h * 0.02]], 2.5, "#a52a20"); }
  else shape(c, () => ell(c, x, ty, nw, nw * 0.4), COL.steelIn, 4);
  return { bw, nw, top: ty };
};
// a balloon stretched over a bottle neck whose top is at (x, ty); size 0 = limp, else the inflated radius
const balloonOn = (c: Ctx, x: number, ty: number, nw: number, size: number, col: string, dk: string) => {
  const cw = nw + 9;
  if (size <= 0) { shape(c, () => { c.moveTo(x - cw, ty + 4); c.quadraticCurveTo(x - cw - 10, ty + 70, x + 10, ty + 110); c.quadraticCurveTo(x + 60, ty + 120, x + 70, ty + 80); c.quadraticCurveTo(x + 50, ty + 60, x + cw, ty + 4); c.closePath(); }, col, 5); }
  else {
    const rx = size * 0.85, ry = size, cy = ty - size * 0.35 - ry;
    const path = () => { c.moveTo(x - cw, ty + 6); c.bezierCurveTo(x - cw, ty - size * 0.45, x - rx, cy + ry * 0.95, x - rx, cy); c.bezierCurveTo(x - rx, cy - ry * 1.35, x + rx, cy - ry * 1.35, x + rx, cy); c.bezierCurveTo(x + rx, cy + ry * 0.95, x + cw, ty - size * 0.45, x + cw, ty + 6); c.closePath(); };
    shape(c, path, col); shade(c, path, dk, -rx * 0.35, -ry * 0.1, 0.45);
    shine(c, [[x - rx * 0.5, cy - ry * 0.55], [x - rx * 0.62, cy - ry * 0.1]], 9);
  }
  shape(c, () => rrect(c, x - cw, ty - 4, cw * 2, 34, 6), dk, 4);
};
// a wide steel tub of water with things standing in it: content() draws them, then the front wall and water hide their feet
const tub = (c: Ctx, x: number, y: number, r: number, water: string, content: () => void) => {
  const curve = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); };
  const body = () => { curve(); c.closePath(); };
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  shape(c, body, COL.steel); shape(c, () => ell(c, x, y, r, r * 0.2), water, 5);
  content();
  c.save(); c.beginPath(); c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.closePath(); c.fillStyle = water; c.fill(); c.restore();
  c.save(); c.beginPath(); body(); ell(c, x, y, r, r * 0.2); c.clip("evenodd"); c.fillStyle = COL.steel; c.fillRect(x - r - 10, y - 10, r * 2 + 20, r); shade(c, body, COL.steelDk, r * 0.35, -r * 0.05); c.restore();
  c.beginPath(); curve(); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.stroke();
};
// an ice cube, centre (x, y), side s
const ice = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18);
  shape(c, p, ICE, 4); shade(c, p, ICE_DK, -s * 0.3, -s * 0.1, 0.5); shine(c, [[-s * 0.28, -s * 0.3], [-s * 0.28, s * 0.05]], Math.max(4, s * 0.08));
  c.restore();
};
// wisps of steam rising from (x, y)
const steam = (c: Ctx, x: number, y: number, n: number, h: number) => {
  c.globalAlpha = 0.7;
  for (let i = 0; i < n; i++) { const sx = x + (i - (n - 1) / 2) * 44; c.beginPath(); c.moveTo(sx, y); c.bezierCurveTo(sx - 18, y - h * 0.3, sx + 18, y - h * 0.6, sx, y - h); c.strokeStyle = WHITE; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  c.globalAlpha = 1;
};
// a clear zip bag, bottom centre (x, y): inner() draws what is inside; open = the top is open (no zip seal)
const bag = (c: Ctx, x: number, y: number, w: number, h: number, zip: string, inner: () => void, open = false) => {
  const body = () => rrect(c, x - w / 2, y - h, w, h, 18);
  shadow(c, x + 12, y + 6, w * 0.5, 12);
  shape(c, body, "rgba(255,255,255,0.5)", 0);
  c.save(); c.beginPath(); body(); c.clip(); inner(); c.restore();
  shape(c, body, "rgba(255,255,255,0.2)", 5);
  if (open) shape(c, () => ell(c, x, y - h, w / 2 - 6, 12), COL.steelIn, 4);
  else { shape(c, () => rrect(c, x - w / 2, y - h, w, h * 0.085, 8), zip, 4); line(c, [[x - w / 2 + 12, y - h + h * 0.042], [x + w / 2 - 12, y - h + h * 0.042]], 3); }
  shine(c, [[x - w * 0.38, y - h * 0.82], [x - w * 0.32, y - h * 0.45]], 7);
};
// a steel spoon, handle end at (x, y), pointing along an; filled = a mound of something in its bowl
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, filled?: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  line(c, [[0, 0], [len * 0.72, 0]], 20, INK); line(c, [[0, 0], [len * 0.72, 0]], 11, COL.steel);
  shape(c, () => ell(c, len * 0.84, 0, len * 0.17, len * 0.11), COL.steel, 5); shape(c, () => ell(c, len * 0.84, 0, len * 0.11, len * 0.06), COL.steelDk, 0);
  if (filled) shape(c, () => ell(c, len * 0.84, -len * 0.03, len * 0.14, len * 0.1), filled, 4);
  c.restore();
};
// an ice-cream stick for stirring, from a to b
const stick = (c: Ctx, a: [number, number], b: [number, number]) => { line(c, [a, b], 22, INK); line(c, [a, b], 13, COL.wood); };
// small grains (salt, turmeric, chilli) scattered round (x, y)
const grains = (c: Ctx, x: number, y: number, n: number, spread: number, col: string, seed = 2, size = 4) => { const r = rnd(seed); for (let i = 0; i < n; i++) shape(c, () => ell(c, x + (r() - 0.5) * spread * 2, y + (r() - 0.5) * spread, size, size * 0.8), col, 1.5); };
// grains falling from a to b
const fall = (c: Ctx, a: [number, number], b: [number, number], n: number, col: string, seed = 6) => { const r = rnd(seed); for (let i = 0; i < n; i++) { const t = r(), x = a[0] + (b[0] - a[0]) * t + (r() - 0.5) * 18, y = a[1] + (b[1] - a[1]) * t; shape(c, () => ell(c, x, y, 4, 3.5), col, 1.5); } };
// a thermometer standing with its bulb at (x, y); frac = how far up the red column reaches (0.5 = the zero mark)
const thermo = (c: Ctx, x: number, y: number, h: number, frac: number) => {
  shape(c, () => rrect(c, x - 14, y - h, 28, h, 14), WHITE, 5);
  shape(c, () => rrect(c, x - 6, y - h * frac, 12, h * frac + 10, 6), RED, 0);
  shape(c, () => ell(c, x, y, 24, 24), RED, 5);
  for (let k = 1; k < 10; k++) line(c, [[x + 14, y - h * k * 0.1], [x + (k === 5 ? 34 : 24), y - h * k * 0.1]], k === 5 ? 4 : 2.5);
};
// a mitten hand drawn over a held thing, at a hand point person() returned; an = the way the forearm points
const grip = (c: Ctx, p: [number, number], an: number, adult = false, h = 600) => { const r = h * 0.062 * 0.7; c.save(); c.translate(p[0], p[1]); c.rotate(an); shape(c, () => ell(c, r * 0.5, 0, r * 1.05, r * 0.8), adult ? SKIN.adult : SKIN.child, 5); c.restore(); };
// a kitchen timer face, centre (x, y)
const timer = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 8, y + r + 6, r * 0.9, 12);
  shape(c, () => rrect(c, x - r * 0.3, y - r - 16, r * 0.6, 24, 6), COL.steelDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.teal); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6]], 3); }
  line(c, [[x, y], [x, y - r * 0.55]], 5); line(c, [[x, y], [x + r * 0.45, y - r * 0.3]], 5, RED);
  write(c, "10", x - r * 0.3, y + r * 0.15, r * 0.4, INK, 4);
};
// a short green chilli from (x, y) curving to the right
const chilli = (c: Ctx, x: number, y: number, len: number) => {
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(x + len * 0.5, y - len * 0.3, x + len, y - len * 0.05); c.quadraticCurveTo(x + len * 0.5, y + len * 0.02, x, y + len * 0.12); c.closePath(); }, COL.green, 4);
  line(c, [[x, y + len * 0.06], [x - len * 0.18, y - len * 0.02]], 7, COL.leafDk);
};

// ================================================================ e1 · Water or Oil?
// six jars: back row oil, front row water, labelled with a drop
const sixJars = (c: Ctx, oilFills: ((x: number) => void)[], waterFills: ((x: number) => void)[]) => {
  ground(c); table(c, 470);
  const xs = [300, 540, 780];
  xs.forEach((x, i) => { oilFills[i](x); label(c, x, 600, "oil"); });
  xs.forEach((x, i) => { waterFills[i](x); label(c, x, 820, "water"); });
};
const setupE1_0 = (c: Ctx) => sixJars(c,
  [0, 1, 2].map(() => (x: number) => jar(c, x, 700, 140, 190, 0.5, OIL)),
  [0, 1, 2].map(() => (x: number) => jar(c, x, 920, 140, 190, 0.5, COL.water)));
const flowE1 = (c: Ctx) => sixJars(c,
  [(x: number) => jar(c, x, 700, 140, 190, 0.5, GOLD, { bits: TURM, n: 6, settle: true, seed: 11 }), (x: number) => jar(c, x, 700, 140, 190, 0.5, ORANGE_RED, { bits: CHILLI, n: 6, settle: true, seed: 12 }), (x: number) => jar(c, x, 700, 140, 190, 0.5, OIL, { beads: FOOD })],
  [(x: number) => jar(c, x, 920, 140, 190, 0.5, "#f1e2a0", { bits: TURM, n: 40, settle: true, seed: 13 }), (x: number) => jar(c, x, 920, 140, 190, 0.5, "#f0c9b8", { bits: CHILLI, n: 40, settle: true, seed: 14 }), (x: number) => jar(c, x, 920, 140, 190, 0.5, FOOD)]);

// a child tipping a pinch of turmeric into the water jar; the oil jar, chilli powder and food colour wait beside
const setupE1_1 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 330, 1010, 600, { reachR: [540, 560] });
  table(c, 720);
  bowl(c, 150, 830, 60, TURM); grains(c, 150, 826, 10, 40, "#f3cf5a", 3, 4);
  jar(c, 540, 800, 130, 170, 0.5, COL.water, { bits: TURM, n: 8, seed: 21 }); label(c, 540, 745, "water");
  fall(c, [hands.handR[0] + 4, hands.handR[1] + 18], [540, 660], 12, TURM);
  jar(c, 740, 800, 130, 170, 0.5, OIL); label(c, 740, 745, "oil");
  bowl(c, 900, 810, 52, CHILLI); grains(c, 900, 806, 8, 34, "#e05a3a", 5, 4);
  // a small dropper bottle of red food colour
  shadow(c, 1010, 822, 30, 8); shape(c, () => rrect(c, 988, 740, 44, 80, 8), FOOD, 5); shape(c, () => rrect(c, 996, 712, 28, 30, 5), COL.black, 4);
};
// a child stirring the first jar, counting aloud; torch beside the jars, white paper behind them
const setupE1_2 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 330, 1010, 600, { reachR: [535, 555] });
  table(c, 720);
  paper(c, 440, 790, 540, 180);
  jar(c, 520, 800, 130, 170, 0.5, "#f1e2a0", { bits: TURM, n: 25, seed: 31 }); label(c, 520, 745, "water");
  stick(c, hands.handR, [500, 775]); grip(c, hands.handR, Math.PI * 0.62);
  jar(c, 700, 800, 130, 170, 0.5, GOLD, { bits: TURM, n: 10, seed: 32 }); label(c, 700, 745, "oil");
  jar(c, 870, 800, 130, 170, 0.5, "#f0c9b8", { bits: CHILLI, n: 25, seed: 33 }); label(c, 870, 745, "water");
  shadow(c, 880, 950, 110, 14); torch(c, 1000, 940, Math.PI, 200);
  // speech bubble: counting
  shape(c, () => { rrect(c, 40, 350, 200, 90, 20); }, WHITE, 5);
  shape(c, () => { c.moveTo(190, 436); c.lineTo(245, 480); c.lineTo(215, 436); c.closePath(); }, WHITE, 5); line(c, [[192, 437], [213, 437]], 6, WHITE);
  write(c, "1 2 3", 62, 372, 46, INK, 6);
};
// six jars against the white paper, a torch beam from the left: the beam shows in the cloudy water jars, not in the clear oil
const setupE1_3 = (c: Ctx) => {
  ground(c); table(c, 520);
  paper(c, 150, 905, 900, 580);
  const xs = [270, 410, 550, 690, 830, 970], y = 860, w = 110, h = 170, f = 0.55, ly = y - h * f;
  const beamY = (y + ly) / 2;
  beam(c, [190, beamY], [1050, beamY], 22, 40, 0.18);
  const kinds: ("water" | "oil")[] = ["water", "oil", "water", "oil", "water", "oil"];
  xs.forEach((x, i) => {
    if (i === 0) jar(c, x, y, w, h, f, "#f1e2a0", { bits: TURM, n: 30, settle: true, seed: 41 });
    else if (i === 1) jar(c, x, y, w, h, f, GOLD, { bits: TURM, n: 5, settle: true, seed: 42 });
    else if (i === 2) jar(c, x, y, w, h, f, "#f0c9b8", { bits: CHILLI, n: 30, settle: true, seed: 43 });
    else if (i === 3) jar(c, x, y, w, h, f, ORANGE_RED, { bits: CHILLI, n: 5, settle: true, seed: 44 });
    else if (i === 4) jar(c, x, y, w, h, f, FOOD);
    else jar(c, x, y, w, h, f, OIL, { beads: FOOD });
    // the beam lights up the cloudy water jars
    if (i === 0 || i === 2) { c.save(); c.beginPath(); liqPath(c, x, y, w, h, f); c.clip(); beam(c, [190, beamY], [1050, beamY], 22, 40, 0.8); c.restore(); }
    label(c, x, y - h - 40, kinds[i]);
  });
  shadow(c, 100, beamY + 50, 90, 12); torch(c, 40, beamY, 0, 150);
};

// ================================================================ e2 · Fizz and Warmth
// two bottles standing in tubs: left in ice water, right in warm water; balloons on the necks if sizes are given
const twoTubs = (c: Ctx, caps: boolean, balloons?: [number, number]) => {
  ground(c); table(c, 560);
  const draw = (x: number, cold: boolean, size: number) => {
    tub(c, x, 760, 190, cold ? "#bfe3f2" : "#9ccbe6", () => {
      if (cold) { ice(c, x - 130, 752, 46, 0.2); ice(c, x + 120, 748, 42, -0.3); ice(c, x - 60, 770, 40, 0.5); ice(c, x + 70, 772, 44, -0.1); }
      const b = bottle(c, x, 782, 420, 0.62, SODA, { cap: caps, band: cold ? COL.blue : COL.orange, bubbles: caps ? 0 : 18, seed: cold ? 51 : 52 });
      if (!caps && balloons) balloonOn(c, x, b.top, b.nw, cold ? balloons[0] : balloons[1], cold ? "#5b8fd6" : "#e4523b", cold ? "#3f6fb3" : "#b23a28");
    });
    if (!cold) steam(c, x, 735, 3, 110);
  };
  draw(300, true, 0); draw(780, false, 0);
};
const setupE2_0 = (c: Ctx) => twoTubs(c, true);
const setupE2_2 = (c: Ctx) => twoTubs(c, false, [55, 125]);
// a grown-up opening a bottle slowly over the sink; a child holds a stretched balloon ready
const setupE2_1 = (c: Ctx) => {
  ground(c);
  const kid = person(c, 250, 1010, 600, { reachL: [95, 660], reachR: [405, 660] });
  // the bottle stands in the sink; the grown-up's right hand rests on the cap, turning it slowly
  const ad = person(c, 640, 1010, 760, { adult: true, reachR: [790, 640] });
  table(c, 720);
  // the sink set into the counter, the bottle standing in it
  shape(c, () => rrect(c, 600, 850, 380, 120, 30), COL.steelDk, 5); shape(c, () => rrect(c, 620, 865, 340, 90, 24), COL.steel, 4);
  bottle(c, 790, 930, 300, 0.62, SODA, { cap: true, band: COL.teal, bubbles: 10, seed: 53 });
  shape(c, () => rrect(c, 600, 905, 380, 65, 30), COL.steelDk, 5); shape(c, () => ell(c, 700, 935, 18, 10), COL.black, 3);
  grip(c, ad.handR, Math.PI * 0.6, true, 760);
  // the stretched balloon between the child's hands: a long limp strip with its mouth ring at the right
  const [a, b] = [kid.handL, kid.handR];
  shape(c, () => { c.moveTo(a[0], a[1] - 14); c.quadraticCurveTo((a[0] + b[0]) / 2, a[1] - 34, b[0] - 20, b[1] - 12); c.lineTo(b[0] - 20, b[1] + 12); c.quadraticCurveTo((a[0] + b[0]) / 2, a[1] + 34, a[0], a[1] + 14); c.closePath(); }, "#e4523b", 5);
  shape(c, () => rrect(c, b[0] - 26, b[1] - 18, 20, 36, 6), "#b23a28", 4);
  grip(c, a, Math.PI * 0.9); grip(c, b, Math.PI * 0.1);
};
// a child wrapping a string round the widest part of the balloon; a ruler on the counter with a string laid along it
const setupE2_3 = (c: Ctx) => {
  ground(c); table(c, 560);
  // the ruler on the floor to the right, a measured string laid along it
  shadow(c, 900, 850, 170, 12);
  shape(c, () => rrect(c, 740, 790, 300, 50, 4), COL.wood, 5); c.fillStyle = COL.woodDk; c.fillRect(743, 826, 294, 11);
  for (let mm = 0; mm <= 25; mm++) { const x = 760 + mm * 10.4, hh = mm % 10 === 0 ? 24 : mm % 5 === 0 ? 16 : 9; c.strokeStyle = INK; c.lineWidth = mm % 10 === 0 ? 3 : 2; c.beginPath(); c.moveTo(x, 790); c.lineTo(x, 790 + hh); c.stroke(); }
  for (let cm = 0; cm <= 2; cm++) write(c, String(cm * 10), 760 + cm * 104 - 12, 795, 16, INK, 3);
  // the child sits on the floor; the left hand pinches the string where it meets round the balloon, the right hand on the ruler
  const b = bottle(c, 400, 900, 240, 0.55, SODA, { cap: false, band: COL.orange, bubbles: 10, seed: 54 });
  const size = 80, ry = size, rx = size * 0.85, cy = b.top - size * 0.35 - ry;
  balloonOn(c, 400, b.top, b.nw, size, "#e4523b", "#b23a28");
  const hands = person(c, 640, 900, 600, { sit: true, dir: -1, reachL: [482, cy + 6], reachR: [800, 800] });
  // the string round the widest part: the front half of a thin loop, both ends meeting at the fingers
  c.beginPath(); c.ellipse(400, cy, rx + 4, 12, 0, 0, Math.PI); c.strokeStyle = STRING; c.lineWidth = 8; c.stroke(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  line(c, [[400 + rx + 4, cy], hands.handL], 8, STRING); line(c, [[400 + rx + 4, cy], hands.handL], 4);
  line(c, [hands.handL, [hands.handL[0] + 30, hands.handL[1] + 60]], 8, STRING); line(c, [hands.handL, [hands.handL[0] + 30, hands.handL[1] + 60]], 4);
  grip(c, hands.handL, -Math.PI * 0.6);
  c.beginPath(); c.moveTo(hands.handR[0], hands.handR[1] - 10); c.bezierCurveTo(850, 760, 920, 790, 1000, 776); c.strokeStyle = STRING; c.lineWidth = 8; c.stroke(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  grip(c, hands.handR, Math.PI * 0.3);
};
// two bottles opened: the cold one with a thin thread of bubbles, the warm one gushing foam
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 520);
  // cold: ice cubes at its foot, a calm thread of bubbles
  const L = bottle(c, 330, 900, 520, 0.6, SODA, { cap: false, band: COL.blue, bubbles: 22, thread: true, seed: 61 });
  ice(c, 200, 880, 56, 0.15); ice(c, 450, 890, 52, -0.25); ice(c, 165, 930, 44, 0.4);
  shape(c, () => rrect(c, 230, 950, 50, 30, 5), RED, 4);
  const r = rnd(62); for (let i = 0; i < 7; i++) shape(c, () => ell(c, 330 + (r() - 0.5) * 30, L.top - 20 - i * 26, 4 + r() * 3, 4 + r() * 3), "rgba(255,255,255,0.95)", 2);
  // warm: foam bursting from the mouth and running down, gas dots leaving
  const R = bottle(c, 750, 900, 520, 0.5, SODA, { cap: false, band: COL.orange, bubbles: 40, seed: 63 });
  shape(c, () => rrect(c, 830, 950, 50, 30, 5), RED, 4);
  const foam = (x: number, y: number, rr: number) => shape(c, () => ell(c, x, y, rr, rr * 0.85), WHITE, 4);
  foam(750, R.top - 30, 46); foam(705, R.top - 10, 34); foam(800, R.top - 5, 36); foam(770, R.top - 70, 28); foam(725, R.top - 62, 24);
  foam(690, R.top + 40, 26); foam(812, R.top + 50, 26); foam(680, R.top + 90, 20); foam(822, R.top + 100, 22); foam(672, R.top + 135, 16);
  const rg = rnd(64); for (let i = 0; i < 16; i++) { const gx = 750 + (rg() - 0.5) * 300, gy = R.top - 90 - rg() * 180; shape(c, () => ell(c, gx, gy, 4 + rg() * 4, 4 + rg() * 4), "rgba(255,255,255,0.9)", 2.5); }
  steam(c, 940, 560, 2, 120);
};

// ================================================================ e3 · Kulfi in a Bag
// a small zip bag with milk (or kulfi) inside
const milkBag = (c: Ctx, x: number, y: number, w: number, h: number, kulfi: boolean) => bag(c, x, y, w, h, COL.blue, () => {
  if (!kulfi) { shape(c, () => rrect(c, x - w / 2, y - h * 0.5, w, h * 0.5, 4), MILK, 0); line(c, [[x - w / 2, y - h * 0.5], [x + w / 2, y - h * 0.5]], 3, "#e8e0cc"); }
  else {
    shape(c, () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.48); c.quadraticCurveTo(x - w * 0.3, y - h * 0.66, x - w * 0.1, y - h * 0.54); c.quadraticCurveTo(x + w * 0.1, y - h * 0.7, x + w * 0.3, y - h * 0.56); c.quadraticCurveTo(x + w * 0.42, y - h * 0.5, x + w / 2, y - h * 0.58); c.lineTo(x + w / 2, y); c.closePath(); }, KULFI, 4);
    grains(c, x, y - h * 0.3, 14, w * 0.4, WHITE, 7, 3);
  }
});
// a cup of sweet milk being stirred, poured into two small bags
const setupE3_0 = (c: Ctx) => {
  ground(c); table(c, 560);
  bowl(c, 130, 870, 58, WHITE); grains(c, 130, 866, 12, 38, "#f0ebe0", 8, 3.5);
  glass(c, 300, 820, 190, 250, 0.72, MILK);
  spoon(c, 400, 560, Math.PI * 0.68, 300);
  milkBag(c, 640, 900, 180, 250, false); milkBag(c, 880, 900, 180, 250, false);
  arrow(c, [[400, 620], [520, 590], [625, 635]]); arrow(c, [[400, 600], [640, 500], [865, 635]]);
};
// two big bags of ice, each with a small milk bag; a hand spooning salt into the right one only
const bigBag = (c: Ctx, x: number, y: number, w: number, h: number, salted: boolean, open: boolean, milkKulfi: boolean | null, seed: number) => bag(c, x, y, w, h, COL.yellow, () => {
  const r = rnd(seed);
  for (let i = 0; i < 9; i++) ice(c, x - w * 0.38 + r() * w * 0.76, y - 40 - r() * (h * 0.55), 58 + r() * 14, (r() - 0.5) * 0.8);
  if (milkKulfi !== null) milkBag(c, x, y - 30, w * 0.46, h * 0.5, milkKulfi);
  for (let i = 0; i < 6; i++) ice(c, x - w * 0.4 + r() * w * 0.8, y - 30 - r() * (h * 0.25), 54 + r() * 14, (r() - 0.5) * 0.8);
  if (salted) grains(c, x, y - h * 0.4, 70, w * 0.4, WHITE, seed + 1, 3.5);
}, open);
const setupE3_1 = (c: Ctx) => {
  ground(c); table(c, 520);
  bigBag(c, 300, 940, 380, 500, false, true, false, 71);
  bigBag(c, 780, 940, 380, 500, true, true, false, 72);
  // the salt spoon tipping over the right bag
  const wx = 980, wy = 320, an = 2.6, s = 1.1, gx = wx + Math.cos(an) * 70 * s, gy = wy + Math.sin(an) * 70 * s;
  spoon(c, gx + Math.cos(an + Math.PI) * 60, gy + Math.sin(an + Math.PI) * 60, an, 210, WHITE);
  hand(c, wx, wy, an, s);
  fall(c, [gx + Math.cos(an) * 150, gy + Math.sin(an) * 150 + 10], [800, 560], 16, WHITE, 73);
};
// a child shaking the big bag wrapped in a tea towel; a timer on the counter
const setupE3_2 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 480, 1010, 600, { reachL: [368, 700], reachR: [592, 700] });
  table(c, 800);
  const bundle = () => ell(c, 480, 700, 128, 92);
  shape(c, bundle, "#efd9b6");
  c.save(); c.beginPath(); bundle(); c.clip(); for (let k = -4; k <= 4; k++) line(c, [[480 + k * 34, 600], [480 + k * 34 - 20, 800]], 8, "#d98a5a"); for (let k = -3; k <= 3; k++) line(c, [[340, 700 + k * 28], [620, 700 + k * 28]], 6, "rgba(217,138,90,0.6)"); c.restore();
  c.beginPath(); bundle(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[430, 630], [470, 680], [440, 740]], 4, "#b8763f"); line(c, [[540, 640], [510, 700], [550, 760]], 4, "#b8763f");
  grip(c, hands.handL, Math.PI * 0.85); grip(c, hands.handR, Math.PI * 0.15);
  // shake marks
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(480, 700, 160 + k * 22, s > 0 ? -0.35 : Math.PI - 0.35, s > 0 ? 0.35 : Math.PI + 0.35); c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  timer(c, 880, 930, 62);
};
// the two small bags afterwards: runny milk, and thick slushy kulfi
const setupE3_3 = (c: Ctx) => {
  ground(c); table(c, 520);
  milkBag(c, 300, 900, 300, 380, false); milkBag(c, 780, 900, 300, 380, true);
  // a few rinse drops on both bags, frost sparkle on the kulfi one
  for (const [x, y] of [[230, 640], [370, 720], [180, 800], [710, 650], [860, 720]]) shape(c, () => ell(c, x, y, 9, 11), COL.drop, 2.5);
  for (const [x, y] of [[700, 560], [880, 580], [800, 520]]) { line(c, [[x - 14, y], [x + 14, y]], 3, COL.blueDk); line(c, [[x, y - 14], [x, y + 14]], 3, COL.blueDk); }
};
// the two big bags with thermometers: plain ice at zero, ice and salt far below
const flowE3 = (c: Ctx) => {
  ground(c); table(c, 520);
  bigBag(c, 290, 940, 360, 480, false, false, false, 74);
  bigBag(c, 790, 940, 360, 480, true, false, true, 75);
  thermo(c, 400, 860, 300, 0.5); thermo(c, 900, 860, 300, 0.2);
  shape(c, () => rrect(c, 110, 360, 150, 84, 12), WHITE, 5); write(c, "0°", 150, 378, 50, INK, 6);
  shape(c, () => rrect(c, 640, 360, 250, 84, 12), WHITE, 5); write(c, "-15°", 660, 378, 50, INK, 6);
};

// ================================================================ activities and the project
// a child pouring cold soda slowly down the side of a tilted glass: bubbles start on the glass wall
const flowA1 = (c: Ctx) => {
  ground(c);
  const hands = person(c, 540, 1010, 600, { reachL: [430, 790], reachR: [760, 540] });
  table(c, 800);
  // the glass, tilted so its top leans toward the bottle; the liquid stays level
  const tilt = 0.45, gw = 120;
  c.save(); c.translate(hands.handL[0], hands.handL[1]); c.rotate(tilt);
  const top = gw / 2, bot = gw * 0.4, body = () => { c.moveTo(-top, -80); c.lineTo(top, -80); c.lineTo(bot, 80); c.lineTo(-bot, 80); c.closePath(); };
  c.save(); c.beginPath(); body(); c.clip(); c.rotate(-tilt); c.fillStyle = SODA; c.fillRect(-300, 40, 600, 300); c.restore();
  shape(c, body, COL.glass, 5); shape(c, () => ell(c, 0, -80, top, gw * 0.08), "rgba(255,255,255,0.35)", 5);
  const rb = rnd(81); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 44 - i * 1.3 + (rb() - 0.5) * 10, -60 + i * 11, 4, 4), WHITE, 1.5);
  c.restore();
  // the bottle, held by its middle and tipped so its mouth points down-left at the glass rim; liquid level horizontal
  const th = -2.4, bh = 280;
  c.save(); c.translate(hands.handR[0], hands.handR[1]); c.rotate(th);
  bottle(c, 0, bh * 0.38, bh, 0.6, SODA, { cap: false, band: COL.blue, level: 30, tilt: th });
  c.restore();
  // the stream falls from the mouth onto the inside of the glass rim
  const md = bh * 0.9 - bh * 0.38, mouth: [number, number] = [hands.handR[0] + md * Math.sin(th), hands.handR[1] - md * Math.cos(th)];
  const lip: [number, number] = [hands.handL[0] + 52 * Math.cos(tilt) + 78 * Math.sin(tilt), hands.handL[1] + 52 * Math.sin(tilt) - 78 * Math.cos(tilt)];
  const stream = () => { c.beginPath(); c.moveTo(mouth[0], mouth[1]); c.quadraticCurveTo(mouth[0] - 40, lip[1] - 4, lip[0] + 2, lip[1] - 4); };
  stream(); c.strokeStyle = SODA; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); stream(); c.strokeStyle = "#b9d3df"; c.lineWidth = 4; c.stroke();
  grip(c, hands.handL, Math.PI * 0.6); grip(c, hands.handR, -Math.PI * 0.3);
};
// four glasses lit from the side: the beam shows in muddy water and milk, not in plain or salt water
const flowA2 = (c: Ctx) => {
  ground(c); table(c, 520);
  const xs = [245, 460, 675, 890], y = 880, w = 160, h = 210, f = 0.6, ly = y - h * f, by = (y + ly) / 2;
  beam(c, [160, by], [1060, by], 26, 46, 0.18);
  const kinds: ("plain" | "salt" | "soil" | "milk")[] = ["plain", "salt", "soil", "milk"];
  xs.forEach((x, i) => {
    if (i === 0) jar(c, x, y, w, h, f, COL.water);
    else if (i === 1) jar(c, x, y, w, h, f, COL.water, { bits: WHITE, n: 0 });
    else if (i === 2) jar(c, x, y, w, h, f, "#c9a97a", { bits: COL.soil, n: 30, settle: true, seed: 91 });
    else jar(c, x, y, w, h, f, MILK);
    if (i >= 2) { c.save(); c.beginPath(); liqPath(c, x, y, w, h, f); c.clip(); beam(c, [160, by], [1060, by], 26, 46, 0.8); c.restore(); }
    label(c, x, y - h - 42, kinds[i]);
  });
  shadow(c, 90, by + 46, 80, 12); torch(c, 30, by, 0, 130);
};
// a hand lifting the salted thread, and the ice cube coming up with it out of the glass
const flowA3 = (c: Ctx) => {
  ground(c); table(c, 520);
  glass(c, 643, 940, 300, 330, 0.75, COL.water);
  const wx = 700, wy = 270, an = Math.PI * 0.75, s = 1.15, gx = wx + Math.cos(an) * 70 * s, gy = wy + Math.sin(an) * 70 * s;
  // the thread from the fingers down to the cube and across its top
  line(c, [[gx, gy], [gx, 520]], 8, STRING); line(c, [[gx, gy], [gx, 520]], 4);
  ice(c, gx, 575, 110, 0);
  line(c, [[gx - 55, 522], [gx + 55, 522]], 8, STRING); line(c, [[gx - 55, 522], [gx + 55, 522]], 4);
  grains(c, gx, 528, 14, 42, WHITE, 92, 4);
  hand(c, wx, wy, an, s);
  for (const [x, y] of [[gx - 30, 660], [gx + 36, 672]]) shape(c, () => ell(c, x, y, 7, 10), COL.drop, 2.5);
};
// a grown-up taking curd after a chilli, a glass of water and the chilli on a plate, a child keeping score
const flowA4 = (c: Ctx) => {
  ground(c);
  const kid = person(c, 260, 1010, 600, { reachL: [182, 722], reachR: [338, 722] });
  const ad = person(c, 700, 1010, 760, { adult: true, reachL: [600, 612], reachR: [762, 402] });
  table(c, 800);
  // the score sheet in the child's hands
  shape(c, () => rrect(c, 172, 560, 176, 186, 8), WHITE, 5);
  for (let k = 0; k < 4; k++) line(c, [[190, 600 + k * 36], [330, 600 + k * 36]], 2.5, COL.grey);
  write(c, "30", 196, 572, 22, INK, 3); write(c, "60", 276, 572, 22, INK, 3);
  for (let k = 0; k < 3; k++) for (let m = 0; m < 3 + k; m++) line(c, [[200 + m * 12, 612 + k * 36], [200 + m * 12, 630 + k * 36]], 3);
  grip(c, kid.handL, Math.PI * 0.6); grip(c, kid.handR, Math.PI * 0.4);
  // curd bowl in the left hand, spoon of curd in the right hand near the mouth
  bowl(c, 600, 560, 70, MILK);
  grip(c, ad.handL, Math.PI * 0.5, true, 760);
  spoon(c, ad.handR[0], ad.handR[1], Math.atan2(378 - ad.handR[1], 712 - ad.handR[0]), 85, MILK);
  grip(c, ad.handR, Math.PI * 0.8, true, 760);
  glass(c, 470, 950, 120, 160, 0.65, COL.water);
  plate(c, 900, 930, 110, 44); chilli(c, 850, 930, 100);
};
// a TDS meter dipping into a glass of tap water, the screen showing the number
const flowA5 = (c: Ctx) => {
  ground(c); table(c, 520);
  glass(c, 570, 900, 320, 340, 0.7, COL.water);
  // the probe, then the body
  line(c, [[552, 560], [552, 700]], 12, INK); line(c, [[552, 560], [552, 700]], 6, COL.steel); line(c, [[588, 560], [588, 700]], 12, INK); line(c, [[588, 560], [588, 700]], 6, COL.steel);
  shadow(c, 580, 565, 60, 10);
  shape(c, () => rrect(c, 515, 250, 110, 310, 16), WHITE); shade(c, () => rrect(c, 515, 250, 110, 310, 16), "#c9d1dc", -30, 0, 0.5);
  shape(c, () => rrect(c, 527, 268, 86, 60, 6), "#22303a", 4); write(c, "320", 536, 282, 34, "#c9f06b", 5);
  shape(c, () => ell(c, 570, 365, 14, 14), COL.teal, 3); shape(c, () => ell(c, 570, 405, 14, 14), COL.grey, 3);
  hand(c, 657, 440, Math.PI, 1.25);
};
// four dyed cloth squares hanging on a string with pegs
const flowP1 = (c: Ctx) => {
  ground(c);
  const sy = (x: number) => 300 + 60 * (1 - Math.pow((x - 540) / 500, 2));
  c.beginPath(); c.moveTo(40, 300); c.quadraticCurveTo(540, 420, 1040, 300); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  const cols: [string, string][] = [["#c9803a", "#a8642a"], ["#f0c030", "#d6a322"], ["#c8406a", "#a52f55"], ["#b08458", "#8f6943"]];
  [160, 400, 640, 880].forEach((x, i) => {
    const y = sy(x), w = 190, h = 230;
    const p = () => { c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2 + 6, y + h); c.quadraticCurveTo(x, y + h + 16, x - w / 2 - 6, y + h); c.closePath(); };
    shadow(c, x + 16, y + h + 14, w * 0.5, 10);
    shape(c, p, cols[i][0]); shade(c, p, cols[i][1], -w * 0.3, 0, 0.45);
    // a wooden peg over the string
    shape(c, () => rrect(c, x - 14, y - 34, 28, 62, 6), COL.wood, 4); line(c, [[x, y - 10], [x, y + 24]], 3, COL.woodDk);
    shape(c, () => ell(c, x + 30, y + h + 30, 7, 10), COL.drop, 2.5);
  });
};
// term: a mixture, salt and sand in a steel bowl with a spoon
const termMixture = (c: Ctx) => {
  ground(c); table(c, 520);
  bowl(c, 540, 640, 330, "#d9b77c");
  c.save(); c.beginPath(); ell(c, 540, 640, 320, 60); c.clip();
  grains(c, 540, 640, 90, 300, WHITE, 101, 7); grains(c, 540, 640, 90, 300, COL.soil, 102, 6);
  c.restore();
  spoon(c, 930, 400, Math.PI * 0.78, 330);
};

export const ic_statesDissolvingL4 = cards("sci.states.dissolving.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3,
  setupE2_0, setupE2_1, setupE2_2, setupE2_3,
  setupE3_0, setupE3_1, setupE3_2, setupE3_3,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, termMixture,
]);
