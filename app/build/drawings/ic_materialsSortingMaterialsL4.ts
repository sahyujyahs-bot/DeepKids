import type { Ctx } from "./core";
import { D, INK, SH, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// SORTING MATERIALS L4 · the Katori Map, Strict or Relaxed dal sorting, Soft or Hard voting, and the card
// pictures: flows, a sieve and a sample. Flat kit look: bold ink outline, flat colours, light from the upper left.

// ---------------------------------------------------------------- shared things
type Food = [string, string];
const F: Record<string, Food> = {
  rice: ["#f7f2e6", "#d9cfb8"], toor: ["#f0c24a", "#c99a2a"], chana: ["#e59a2e", "#b8741c"], salt: ["#ffffff", "#d8d8d8"],
  sugar: ["#fbf8f0", "#dcd6c8"], mustard: ["#4e3017", "#2f1b0a"], atta: ["#d7b88a", "#b3925f"], maida: ["#f8f2e4", "#d8cfbd"],
  poha: ["#eee4cb", "#cdbf9f"], ragi: ["#8d5a4b", "#6a3f33"], sooji: ["#eedcb0", "#cdb782"], flour: ["#f3e9d2", "#d6c9a9"],
  cumin: ["#8a6a3c", "#654a26"], fennel: ["#9fb86a", "#748c45"], coriander: ["#c9b27a", "#a08a52"], methi: ["#c89a3c", "#9a7224"], pepper: ["#3a3028", "#201a14"],
  turmeric: ["#f2b422", "#c48d14"], chilli: ["#d7372b", "#a5261c"], garam: ["#8b5a2b", "#653f1b"], amchur: ["#d9b36a", "#b08c45"],
};
const PENCIL = "#5a5560";
const grain = (c: Ctx, x: number, y: number, r: number, rot: number, f: Food) => {
  shape(c, () => ell(c, x, y, r, r * 0.55, rot), f[0], Math.max(2, r * 0.2));
  shade(c, () => ell(c, x, y, r, r * 0.55, rot), f[1], r * 0.3, r * 0.25, 0.5);
};
const domePath = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w * 0.3, y - h * 1.35, x + w * 0.3, y - h * 1.35, x + w / 2, y); c.closePath(); };
// a heap of a food, base centre (x, y), base width w, height h; gr > 0 draws grains of that radius on it
const heap = (c: Ctx, x: number, y: number, w: number, h: number, f: Food, gr = 0, seedN = 1) => {
  shape(c, () => domePath(c, x, y, w, h), f[0], 5);
  shade(c, () => domePath(c, x, y, w, h), f[1], w * 0.12, -h * 0.1, 0.45);
  if (gr) {
    const r = rnd(seedN); c.save(); c.beginPath(); domePath(c, x, y, w, h); c.clip();
    const n = Math.round((w * h) / (gr * gr * 7));
    for (let i = 0; i < n; i++) { const t = r(), u = r(); const gx = x - w / 2 + t * w, top = y - Math.sin(t * Math.PI) * h; grain(c, gx, top + u * (y - top) + gr * 0.3, gr, r() * 3, f); }
    c.restore();
  }
};
// a katori with a heap of food in it; rim centre (x, y), rim radius r
const katori = (c: Ctx, x: number, y: number, r: number, f: Food, h = r * 0.5, gr = 0) => {
  bowl(c, x, y, r); heap(c, x, y + 2, r * 1.8, h, f, gr, Math.round(x * 7 + y));
  c.beginPath(); c.ellipse(x, y, r, r * 0.2, 0, 0.06, Math.PI - 0.06); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
};
// a flat kitchen scale, x centre, y bottom edge, w width; the screen shows txt
const scale = (c: Ctx, x: number, y: number, w: number, txt: string) => {
  const fh = w * 0.11, td = w * 0.22, ins = w * 0.11;
  shadow(c, x + w * 0.03, y + 16, w * 0.52, w * 0.05);
  shape(c, () => polyP(c, [[x - w / 2 + ins, y - fh - td], [x + w / 2 - ins, y - fh - td], [x + w / 2, y - fh], [x - w / 2, y - fh]]), COL.teal);
  shape(c, () => polyP(c, [[x - w / 2, y - fh], [x + w / 2, y - fh], [x + w / 2, y], [x - w / 2, y]]), COL.tealDk);
  const sw = w * 0.32, shh = fh * 0.68; shape(c, () => rrect(c, x - sw / 2, y - fh / 2 - shh / 2, sw, shh, 6), "#22303a", 5);
  const th = shh * 0.6; write(c, txt, x - (txt.length * 0.8 * th) / 2 + th * 0.1, y - fh / 2 - th / 2, th, "#c9f06b", Math.max(4, th * 0.15));
};
// a phone standing up, bottom centre (x, y), its timer showing txt
const phone = (c: Ctx, x: number, y: number, w: number, h: number, txt: string) => {
  shadow(c, x + w * 0.2, y + 6, w * 0.6, w * 0.1);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, w * 0.14), "#3a3540");
  shape(c, () => rrect(c, x - w / 2 + w * 0.07, y - h + h * 0.06, w * 0.86, h * 0.88, w * 0.06), "#22303a", 3);
  const cy = y - h * 0.5, R = w * 0.32;
  c.beginPath(); c.arc(x, cy, R, 0, Math.PI * 2); c.strokeStyle = "#4c5a66"; c.lineWidth = 7; c.stroke();
  c.beginPath(); c.arc(x, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.7); c.strokeStyle = COL.teal; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
  const th = w * 0.24; write(c, txt, x - (txt.length * 0.8 * th) / 2 + th * 0.08, cy - th / 2, th, WHITE, 5);
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { c.fillStyle = SH; c.beginPath(); rrect(c, x + 14, y + 16, w, h, 8); c.fill(); shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 5); };
const grid = (c: Ctx, x: number, y: number, w: number, h: number, rows: number, cols: number[], lw = 3) => {
  for (let i = 0; i <= rows; i++) line(c, [[x, y + (i * h) / rows], [x + w, y + (i * h) / rows]], lw, INK);
  let cx = x; [0, ...cols].forEach((cw) => { cx += cw; line(c, [[cx, y], [cx, y + h]], lw, INK); });
};
// a pencil, tip at (x, y), body running away at angle an
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 48, -18, len - 48, 36, 4), COL.yellow, 5); line(c, [[52, 0], [len - 34, 0]], 3, COL.woodDk);
  shape(c, () => polyP(c, [[0, 0], [52, -18], [52, 18]]), "#e8c9a0", 5); shape(c, () => polyP(c, [[0, 0], [16, -6], [16, 6]]), INK, 3);
  shape(c, () => rrect(c, len - 32, -18, 32, 36, 6), COL.pink, 5); line(c, [[len - 36, -18], [len - 36, 18]], 6, COL.steelDk);
  c.restore();
};
const pencilLine = (c: Ctx, x1: number, y1: number, x2: number, y2: number, col = PENCIL, w = 6) => {
  const r = rnd(Math.round(x1 + y2 * 3)); const pts: number[][] = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + (r() - 0.5) * 5]); }
  line(c, pts, w, col);
};
const tray = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.fillStyle = SH; c.beginPath(); rrect(c, x - w / 2 + 16, y - h / 2 + 18, w, h, 24); c.fill();
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 24), COL.steel);
  shape(c, () => rrect(c, x - w / 2 + 22, y - h / 2 + 20, w - 44, h - 40, 14), COL.steelIn, 4);
};
// a wooden ruler standing up: x = left edge, y = the 0 mark (its foot), marks every mm up to mm, px per mm
const rulerV = (c: Ctx, x: number, y: number, mm: number, px: number) => {
  const h = mm * px + 30, w = 92; c.fillStyle = SH; c.fillRect(x + 10, y - h + 14, w, h);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y + 8], [x, y + 8]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + w - 16, y - h + 3, 13, h + 2);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let m = 0; m <= mm; m++) { const yy = y - m * px, L = m % 10 === 0 ? 34 : m % 5 === 0 ? 24 : 13; c.lineWidth = m % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + L, yy); c.stroke(); }
  for (let cm = 0; cm * 10 <= mm; cm++) write(c, String(cm * 10), x + 40, y - cm * 10 * px - 10, 20, INK, 4);
};
// a square map with two axes: origin (bottom left) at (x, y), side s, five ticks on each axis, unit labels
const mapAxes = (c: Ctx, x: number, y: number, s: number, xs: string[], ys: string[], xl: string, yl: string) => {
  paper(c, x - 120, y - s - 100, s + 230, s + 210);
  for (let i = 1; i <= 5; i++) { line(c, [[x + (i * s) / 5, y], [x + (i * s) / 5, y - s]], 2, "#ddd6c6"); line(c, [[x, y - (i * s) / 5], [x + s, y - (i * s) / 5]], 2, "#ddd6c6"); }
  arrow(c, [[x, y], [x + s + 50, y]], INK, 6); arrow(c, [[x, y], [x, y - s - 50]], INK, 6);
  xs.forEach((t, i) => write(c, t, x + ((i + 1) * s) / 5 - (0.8 * 24 * t.length) / 2, y + 16, 24, INK, 4));
  ys.forEach((t, i) => write(c, t, x - 20 - 0.8 * 24 * t.length, y - ((i + 1) * s) / 5 - 12, 24, INK, 4));
  write(c, xl, x + s + 64, y - 16, 30, INK, 5); write(c, yl, x - 24, y - s - 92, 30, INK, 5);
};
const dot = (c: Ctx, x: number, y: number, col: string, r = 14) => shape(c, () => ell(c, x, y, r, r), col, 4);
// a small paper name tag beside a dot: a swatch of the food's colour and two scribbled words
const tag = (c: Ctx, x: number, y: number, col: string) => {
  shape(c, () => rrect(c, x, y - 13, 56, 26, 5), WHITE, 3); shape(c, () => rrect(c, x + 6, y - 7, 14, 14, 3), col, 2);
  line(c, [[x + 27, y - 4], [x + 48, y - 4]], 3, "#8a8490"); line(c, [[x + 27, y + 5], [x + 44, y + 5]], 3, "#8a8490");
};
const ring = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0, col = RED, w = 7) => { c.beginPath(); ell(c, x, y, rx, ry, rot); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
const cross = (c: Ctx, x: number, y: number, r = 14, col = COL.blueDk) => { line(c, [[x - r, y - r], [x + r, y + r]], 6, col); line(c, [[x - r, y + r], [x + r, y - r]], 6, col); };
// dal pieces: toor is a small pale yellow disc, chana a bigger, more orange one with a crease
const toor = (c: Ctx, x: number, y: number, r = 13) => { shape(c, () => ell(c, x, y, r, r * 0.9), F.toor[0], 3); shade(c, () => ell(c, x, y, r, r * 0.9), F.toor[1], r * 0.3, r * 0.3, 0.5); };
const chana = (c: Ctx, x: number, y: number, r = 19) => { shape(c, () => ell(c, x, y, r, r * 0.9), F.chana[0], 3); shade(c, () => ell(c, x, y, r, r * 0.9), F.chana[1], r * 0.3, r * 0.3, 0.5); line(c, [[x - r * 0.1, y - r * 0.55], [x - r * 0.1, y + r * 0.2]], 2.5, F.chana[1]); };
type Piece = (c: Ctx, x: number, y: number) => void;
const dalHeap = (c: Ctx, x: number, y: number, w: number, h: number, kinds: Piece[], seedN: number) => {
  const r = rnd(seedN); shape(c, () => domePath(c, x, y, w, h), "#d9a63a", 5);
  const n = Math.round((w * h) / 190);
  for (let i = 0; i < n; i++) { const t = r(), u = r(); const gx = x - w / 2 + 14 + t * (w - 28), top = y - Math.sin(t * Math.PI) * h * 0.92; kinds[Math.floor(r() * kinds.length)](c, gx, top + 8 + u * (y - top - 20)); }
};
const bowlOf = (c: Ctx, x: number, y: number, r: number, kinds: Piece[], n: number, seedN: number, inside = "#e8b347") => {
  bowl(c, x, y, r, inside); const rr = rnd(seedN);
  for (let i = 0; i < n; i++) { const a = rr() * Math.PI * 2, d = Math.sqrt(rr()); kinds[Math.floor(rr() * kinds.length)](c, x + Math.cos(a) * d * r * 0.72, y + Math.sin(a) * d * r * 0.11); }
};
// a kitchen counter the people stand behind: top face from y down, a darker front lip at the bottom
const counter = (c: Ctx, y: number) => {
  shape(c, () => polyP(c, [[-10, y], [D + 10, y], [D + 10, D - 70], [-10, D - 70]]), COL.wood);
  shape(c, () => polyP(c, [[-10, D - 70], [D + 10, D - 70], [D + 10, D + 10], [-10, D + 10]]), COL.woodDk);
};
// a mirrored hand(): a left hand, so a hand coming in from the right keeps its thumb on top
const handM = (c: Ctx, x: number, y: number, an: number, s = 1, skin: string = SKIN.child, sleeve: string = CLOTH.child, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s, skin, sleeve, open); c.restore(); };
// a pointing hand: index finger out, the other fingers curled; fingertip at (x, y), pointing along an
const pointHand = (c: Ctx, x: number, y: number, an: number, s = 1, skin: string = SKIN.adult, sleeve: string = CLOTH.adult) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -330, -52, 72, 104, 14), sleeve, 6);
  shape(c, () => rrect(c, -272, -46, 130, 112, 34), skin, 6);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, -170, 2 + k * 22, 50, 20, 10), skin, 5);
  shape(c, () => rrect(c, -168, -48, 168, 44, 22), skin, 6);
  shape(c, () => ell(c, -205, -62, 42, 22, -0.35), skin, 5);
  c.restore();
};
// the letters H and S, for the voting slips (write() has no letters)
const letterH = (c: Ctx, x: number, y: number, h: number, col = PENCIL, w = 6) => { line(c, [[x, y], [x, y + h]], w, col); line(c, [[x + h * 0.6, y], [x + h * 0.6, y + h]], w, col); line(c, [[x, y + h / 2], [x + h * 0.6, y + h / 2]], w, col); };
const letterS = (c: Ctx, x: number, y: number, h: number, col = PENCIL, w = 6) => {
  c.beginPath(); c.moveTo(x + h * 0.58, y + h * 0.14); c.bezierCurveTo(x + h * 0.5, y - h * 0.08, x + h * 0.02, y - h * 0.06, x + h * 0.04, y + h * 0.26);
  c.bezierCurveTo(x + h * 0.06, y + h * 0.52, x + h * 0.62, y + h * 0.44, x + h * 0.6, y + h * 0.74); c.bezierCurveTo(x + h * 0.58, y + h * 1.06, x + h * 0.08, y + h * 1.08, x + h * 0.02, y + h * 0.84);
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
};

// ---------------------------------------------------------------- the ten household things (Soft or Hard), base centre (x, y)
const cottonWool = (c: Ctx, x: number, y: number, s = 1) => { shadow(c, x + 6 * s, y, 50 * s, 10 * s); for (const [dx, dy, r] of [[-28, -30, 30], [26, -34, 30], [0, -58, 32], [-6, -26, 34]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s * 0.9), WHITE, 5); };
const sponge = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 8 * s, y + 2, 64 * s, 10 * s); shape(c, () => rrect(c, x - 60 * s, y - 62 * s, 120 * s, 62 * s, 8 * s), COL.yellow); shape(c, () => rrect(c, x - 60 * s, y - 78 * s, 120 * s, 20 * s, 6 * s), COL.green, 5);
  for (const [dx, dy] of [[-38, -40], [-10, -24], [18, -44], [40, -22], [8, -14]]) shape(c, () => ell(c, x + dx * s, y + dy * s, 7 * s, 5 * s), COL.woodDk, 2);
};
const towel = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 8 * s, y + 2, 66 * s, 10 * s); shape(c, () => rrect(c, x - 64 * s, y - 60 * s, 128 * s, 60 * s, 14 * s), COL.sky);
  for (const dy of [-46, -32, -18]) line(c, [[x - 60 * s, y + dy * s], [x + 60 * s, y + dy * s]], 5 * s, COL.blue);
  line(c, [[x - 64 * s, y - 30 * s], [x + 64 * s, y - 30 * s]], 4, INK);
};
const dough = (c: Ctx, x: number, y: number, s = 1) => { shadow(c, x + 8 * s, y, 50 * s, 10 * s); shape(c, () => ell(c, x, y - 44 * s, 50 * s, 44 * s), "#efdcb8"); shade(c, () => ell(c, x, y - 44 * s, 50 * s, 44 * s), "#cdb98f", 14 * s, 10 * s, 0.5); };
const eraser = (c: Ctx, x: number, y: number, s = 1, an = -0.15) => {
  c.save(); c.translate(x, y); c.rotate(an); shadow(c, 8 * s, 2, 56 * s, 9 * s);
  shape(c, () => rrect(c, -54 * s, -40 * s, 108 * s, 40 * s, 6 * s), COL.pink); shape(c, () => rrect(c, -54 * s, -40 * s, 44 * s, 40 * s, 6 * s), "#e9e6f4", 5);
  c.restore();
};
const bottle = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 6 * s, y, 30 * s, 8 * s);
  shape(c, () => { c.moveTo(x - 26 * s, y); c.lineTo(x - 26 * s, y - 100 * s); c.quadraticCurveTo(x - 26 * s, y - 118 * s, x - 10 * s, y - 126 * s); c.lineTo(x - 10 * s, y - 136 * s); c.lineTo(x + 10 * s, y - 136 * s); c.lineTo(x + 10 * s, y - 126 * s); c.quadraticCurveTo(x + 26 * s, y - 118 * s, x + 26 * s, y - 100 * s); c.lineTo(x + 26 * s, y); c.closePath(); }, "#cfe6f5", 5);
  shape(c, () => rrect(c, x - 14 * s, y - 150 * s, 28 * s, 18 * s, 4 * s), COL.blue, 4); shine(c, [[x - 16 * s, y - 95 * s], [x - 16 * s, y - 30 * s]], 6 * s);
};
const candle = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 8 * s, y, 30 * s, 8 * s); shape(c, () => { c.moveTo(x - 22 * s, y); c.lineTo(x - 22 * s, y - 120 * s); c.lineTo(x + 22 * s, y - 120 * s); c.lineTo(x + 22 * s, y); c.closePath(); }, COL.paper);
  shade(c, () => rrect(c, x - 22 * s, y - 120 * s, 44 * s, 120 * s, 1), "#d9d0bd", 14 * s, 0, 0.5); shape(c, () => ell(c, x, y - 120 * s, 22 * s, 6 * s), WHITE, 4); line(c, [[x, y - 124 * s], [x + 3 * s, y - 142 * s]], 4 * s, INK);
};
const spoon = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(-1.1); shadow(c, 6, 10 * s, 70 * s, 8 * s);
  shape(c, () => rrect(c, -10 * s, -12 * s, 110 * s, 22 * s, 10 * s), COL.wood, 5); shape(c, () => ell(c, -34 * s, 0, 34 * s, 24 * s), COL.wood, 5); shape(c, () => ell(c, -36 * s, 0, 24 * s, 15 * s), COL.woodDk, 3);
  c.restore();
};
const cup = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 8 * s, y, 40 * s, 9 * s); shape(c, () => { c.moveTo(x + 36 * s, y - 60 * s); c.quadraticCurveTo(x + 72 * s, y - 60 * s, x + 70 * s, y - 32 * s); c.quadraticCurveTo(x + 68 * s, y - 8 * s, x + 36 * s, y - 10 * s); }, COL.teal, 6);
  shape(c, () => { c.moveTo(x - 40 * s, y - 80 * s); c.lineTo(x + 40 * s, y - 80 * s); c.lineTo(x + 32 * s, y); c.lineTo(x - 32 * s, y); c.closePath(); }, COL.teal); shape(c, () => ell(c, x, y - 80 * s, 40 * s, 10 * s), COL.steelIn, 4);
};
const THINGS = [cottonWool, sponge, towel, dough, eraser, bottle, candle, spoon, (c: Ctx, x: number, y: number, s = 1) => bowl(c, x, y - 36 * s, 50 * s), cup];
const tenThings = (c: Ctx, cx: number, cy: number, s: number) => {
  THINGS.forEach((fn, i) => fn(c, cx + (-2 + (i % 5)) * 190 * s, cy + (i < 5 ? -1 : 1) * 130 * s + 60 * s, s));
};

// ---------------------------------------------------------------- the Katori Map data: [food, mass g, heap mm]
const KMAP: [string, number, number][] = [["poha", 60, 40], ["atta", 80, 48], ["maida", 80, 49], ["ragi", 85, 46], ["sooji", 100, 33], ["rice", 120, 32], ["toor", 120, 30], ["mustard", 130, 28], ["sugar", 170, 36], ["salt", 180, 38]];
const MAP = { x: 300, y: 820, s: 520 };
const mapPt = (m: number, h: number): [number, number] => [MAP.x + (m / 200) * MAP.s, MAP.y - (h / 50) * MAP.s];
const katoriMap = (c: Ctx, x = MAP.x, y = MAP.y, s = MAP.s) => { MAP.x = x; MAP.y = y; MAP.s = s; mapAxes(c, x, y, s, ["40", "80", "120", "160", "200"], ["10", "20", "30", "40", "50"], "g", "mm"); };
const mapDots = (c: Ctx, tagged = true) => KMAP.forEach(([f, m, h], i) => { const [x, y] = mapPt(m, h); dot(c, x, y, F[f][0]); if (tagged) tag(c, x + 18, y + (i % 2 ? 22 : -22), F[f][0]); });

// ================================================================ set-up cards: e1 The Katori Map
// 1. a katori filled level with rice on a kitchen scale
const e1s0 = (c: Ctx) => {
  ground(c); scale(c, 540, 900, 760, "120 g");
  shadow(c, 560, 650, 170, 24);
  bowl(c, 540, 560, 170); heap(c, 540, 562, 300, 22, F.rice, 9, 3);
  c.beginPath(); c.ellipse(540, 560, 170, 34, 0, 0.06, Math.PI - 0.06); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
};
// 2. ten foods in a column, lightest to heaviest, a pencil line across
const e1s1 = (c: Ctx) => {
  ground(c); paper(c, 230, 70, 560, 940);
  KMAP.forEach(([f, m], i) => { const y = 140 + i * 88; katori(c, 330, y, 32, F[f], 14); write(c, String(m) + " g", 440, y - 24, 46, INK, 6); });
  pencilLine(c, 250, 538, 770, 534, PENCIL, 7);
  pencil(c, 790, 536, 250, 0.35);
};
// 3. a katori held 10 cm above a plate, food pouring into a heap
const e1s2 = (c: Ctx) => {
  ground(c); plate(c, 520, 800, 250, 90);
  heap(c, 520, 806, 150, 60, F.toor, 11, 5);
  // the stream of toor falling straight down from the lip
  const r = rnd(21); for (let i = 0; i < 46; i++) { const t = r(); toor(c, 520 + (r() - 0.5) * 26, 400 + t * 360, 9); }
  // the katori, tilted so its left lip points down at the plate; the hand grips its right side
  c.save(); c.translate(610, 350); c.rotate(-0.55);
  shape(c, () => { c.moveTo(-90, 0); c.bezierCurveTo(-80, 68, 80, 68, 90, 0); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 0, 0, 90, 20), F.toor[0], 5);
  const rr = rnd(4); for (let i = 0; i < 14; i++) toor(c, -70 + rr() * 140, -4 + (rr() - 0.5) * 16, 10);
  c.restore();
  handM(c, 762, 388, Math.PI * 1.02, 1.3);
  // 10 cm between the lip and the plate
  arrow(c, [[300, 790], [300, 420]], RED, 8); arrow(c, [[300, 420], [300, 790]], RED, 8);
  write(c, "10 cm", 90, 580, 52, RED, 7);
};
// 4. a ruler standing beside a heap, reading its height in millimetres
const e1s3 = (c: Ctx) => {
  ground(c); plate(c, 520, 820, 330, 110);
  heap(c, 440, 826, 420, 192, F.toor, 12, 8);
  rulerV(c, 700, 826, 60, 6);
  line(c, [[440, 634], [700, 634]], 5, RED); write(c, "32", 810, 606, 54, RED, 7);
};
// 5. the finished map: ten dots, three ringed
const e1s4 = (c: Ctx) => {
  ground(c); katoriMap(c); mapDots(c);
  const [ax, ay] = mapPt(82, 47.5); ring(c, ax + 6, ay, 70, 48, 0.2);
};

// ================================================================ e2 Strict or Relaxed
// 1. two heaps side by side on a tray, a hand pointing at the difference
const e2s0 = (c: Ctx) => {
  ground(c); tray(c, 540, 720, 980, 500);
  dalHeap(c, 330, 850, 320, 120, [toor], 31); dalHeap(c, 750, 850, 340, 135, [chana], 32);
  pointHand(c, 540, 700, Math.PI * 0.68, 1.15);
};
// 2. the dals mixed in one heap, two empty bowls, a timer at 30 seconds
const e2s1 = (c: Ctx) => {
  ground(c); phone(c, 190, 470, 120, 210, "30");
  tray(c, 540, 740, 980, 460);
  dalHeap(c, 400, 850, 400, 150, [toor, chana], 33);
  bowl(c, 760, 740, 85); bowl(c, 920, 830, 85);
};
// 3. a child moving pieces into the toor bowl while a grown-up watches the timer
const e2s2 = (c: Ctx) => {
  ground(c);
  const kid = person(c, 400, 1060, 520, { reachL: [330, 812], reachR: [560, 808] });
  const ad = person(c, 790, 1060, 640, { adult: true, reachL: [700, 720], dir: -1 });
  counter(c, 860);
  dalHeap(c, 320, 925, 300, 105, [toor, chana], 34);
  bowlOf(c, 590, 905, 85, [toor], 9, 35);
  arrow(c, [[390, 870], [520, 870]], RED, 8);
  toor(c, kid.handR[0] + 4, kid.handR[1] + 34, 12);
  phone(c, ad.handL[0], ad.handL[1] - 10, 84, 150, "30");
  // the grown-up's thumb holds the phone's foot
  shape(c, () => ell(c, ad.handL[0] + 10, ad.handL[1] - 8, 16, 12), SKIN.adult, 4);
};
// 4. a grown-up counting the toor bowl and pointing out the chana dal in it
const e2s3 = (c: Ctx) => {
  ground(c);
  // the bowl is held up in the left hand to count; the right hand points at the chana dal in it
  const ad = person(c, 560, 1060, 640, { adult: true, reachL: [392, 758], reachR: [600, 712] });
  counter(c, 860);
  bowlOf(c, 500, 760, 120, [toor], 18, 36);
  chana(c, 592, 772, 20); ring(c, 592, 772, 34, 30);
  write(c, "9", 880, 440, 110, INK, 10); toor(c, 835, 500, 22);
  void ad;
};
// 5. the results table: strict and relaxed rows
const e2s4 = (c: Ctx) => {
  ground(c); paper(c, 150, 300, 780, 460);
  grid(c, 180, 330, 720, 400, 3, [240, 240]);
  // header: a toor piece over the count column, a chana piece over the mistakes column
  toor(c, 540, 396, 26); chana(c, 780, 396, 30); line(c, [[760, 360], [800, 430]], 6, RED);
  // row labels: a tight bowl with few pieces for strict, an overflowing one for relaxed
  bowlOf(c, 300, 525, 56, [toor], 3, 41); bowlOf(c, 300, 655, 56, [toor, chana], 11, 42);
  write(c, "9", 516, 480, 72, INK, 8); write(c, "1", 756, 480, 72, INK, 8);
  write(c, "18", 494, 612, 72, INK, 8); write(c, "7", 756, 612, 72, INK, 8);
  pencil(c, 470, 790, 260, 0.2);
};

// ================================================================ e3 Soft or Hard
// 1. ten household things laid out on a tray
const e3s0 = (c: Ctx) => { ground(c); tray(c, 540, 580, 1000, 640); tenThings(c, 540, 560, 1); };
// 2. a hand pressing an eraser, and a pencil writing H on a slip
const e3s1 = (c: Ctx) => {
  ground(c); tray(c, 540, 700, 1000, 560);
  eraser(c, 330, 720, 1.6, 0);
  hand(c, 330, 522, Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult, true);
  // the slip, turned a little away, with H written on it
  c.save(); c.translate(760, 740); c.rotate(-0.2); paper(c, -140, -90, 280, 180); c.restore();
  letterH(c, 690, 690, 90, PENCIL, 8);
  // the pencil runs from the hand down to the paper, its tip just past the H
  const an = Math.PI * 0.3, tip: [number, number] = [790, 740], s = 1.2, d = 55 * s + 130;
  pencil(c, tip[0], tip[1], 270, an + Math.PI);
  hand(c, tip[0] - Math.cos(an) * d, tip[1] - Math.sin(an) * d, an, s, SKIN.adult, CLOTH.adult);
};
// 3. a fingernail pressed into a candle for three seconds, a small dent, a timer behind
const e3s2 = (c: Ctx) => {
  ground(c); phone(c, 210, 520, 150, 260, "3");
  plate(c, 520, 880, 230, 80);
  candle(c, 480, 870, 3.2);
  // the dent where the nail presses
  shape(c, () => ell(c, 550, 560, 10, 26), "#d9d0bd", 4);
  pointHand(c, 548, 560, Math.PI, 1.2, SKIN.child, CLOTH.child);
};
// 4. the results table with ten rows, two vote columns, and a line across
const e3s3 = (c: Ctx) => {
  ground(c); paper(c, 220, 60, 640, 960);
  const x = 250, y = 90, rowH = 84; grid(c, x, y, 580, rowH * 11, 11, [160, 210]);
  letterH(c, 495, y + 16, 54, INK, 7); letterS(c, 690, y + 16, 54, INK, 7);
  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], hard = [0, 0, 1, 1, 2, 3, 4, 5, 5, 5];
  order.forEach((k, i) => { const ry = y + rowH * (i + 1); THINGS[k](c, x + 80, ry + rowH - 14, 0.42); write(c, String(hard[i]), 490, ry + 20, 46, INK, 6); write(c, String(5 - hard[i]), 700, ry + 20, 46, INK, 6); });
  pencilLine(c, 236, y + rowH * 6 + 2, 846, y + rowH * 6 - 4, RED, 7);
};

// ================================================================ card pictures
// flow.e1: ten katoris of foods in a row and the map above them
const flowE1 = (c: Ctx) => {
  ground(c); katoriMap(c, 300, 720, 440); mapDots(c, false);
  const [ax, ay] = mapPt(82, 47.5); ring(c, ax + 6, ay, 60, 42, 0.2);
  KMAP.forEach(([f], i) => katori(c, 92 + i * 99, 950, 44, F[f], 24, f === "rice" || f === "toor" || f === "mustard" || f === "poha" ? 6 : 0));
};
// flow.e2: the mixed heap, a bowl for toor and one for chana, the timer
const flowE2 = (c: Ctx) => {
  ground(c); phone(c, 170, 460, 120, 210, "30");
  tray(c, 540, 740, 980, 460);
  dalHeap(c, 540, 870, 340, 130, [toor, chana], 51);
  bowlOf(c, 220, 800, 95, [toor], 12, 52); chana(c, 250, 806, 19);
  bowlOf(c, 870, 800, 95, [chana], 10, 53);
};
// flow.e3: the ten things and five voting slips
const flowE3 = (c: Ctx) => {
  ground(c); tray(c, 540, 400, 1000, 500); tenThings(c, 540, 400, 0.72);
  for (let i = 0; i < 5; i++) { const x = 100 + i * 190; paper(c, x, 760, 160, 220); (i % 2 ? letterS : letterH)(c, x + 50, 790, 70); for (let k = 0; k < 4; k++) line(c, [[x + 30 + k * 30, 900], [x + 30 + k * 30, 950]], 5, PENCIL); }
};
// flow.a1: the bottoms of plastic things with the triangle of arrows and a number
const resin = (c: Ctx, x: number, y: number, R: number, n: string) => {
  const v = [0, 1, 2].map((i) => { const a = -Math.PI / 2 + (i * Math.PI * 2) / 3; return [x + Math.cos(a) * R, y + Math.sin(a) * R + R * 0.12]; });
  for (let i = 0; i < 3; i++) { const a = v[i], b = v[(i + 1) % 3]; arrow(c, [[a[0] + (b[0] - a[0]) * 0.18, a[1] + (b[1] - a[1]) * 0.18], [a[0] + (b[0] - a[0]) * 0.9, a[1] + (b[1] - a[1]) * 0.9]], INK, R * 0.07); }
  write(c, n, x - R * 0.26, y - R * 0.3 + R * 0.12, R * 0.66, INK, R * 0.07);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 760, 300, 40);
  shape(c, () => ell(c, 540, 420, 290, 290), "#cfe6f5"); shape(c, () => ell(c, 540, 420, 215, 215), "#dcedf8", 4);
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 5; shape(c, () => ell(c, 540 + Math.cos(a) * 252, 420 + Math.sin(a) * 252, 26, 26), "#b9d8ee", 3); }
  resin(c, 540, 420, 120, "1");
  shadow(c, 230, 920, 140, 24); shape(c, () => rrect(c, 90, 760, 260, 220, 40), WHITE); resin(c, 220, 870, 62, "5");
  shadow(c, 870, 920, 140, 24); shape(c, () => ell(c, 850, 870, 150, 115), "#f4f1e8"); resin(c, 850, 870, 62, "2");
};
// flow.a2: twelve katoris of spices sorted into two big paper circles, seeds and powders
const flowA2 = (c: Ctx) => {
  ground(c);
  for (const cx of [285, 795]) { shadow(c, cx + 14, 640, 255, 110); shape(c, () => ell(c, cx, 600, 255, 255), COL.paper, 5); }
  const seeds = ["mustard", "cumin", "fennel", "coriander", "methi", "pepper"], powders = ["turmeric", "chilli", "garam", "amchur", "salt", "atta"];
  seeds.forEach((f, i) => katori(c, 145 + (i % 3) * 140, 540 + Math.floor(i / 3) * 150, 60, F[f], 32, 7));
  powders.forEach((f, i) => katori(c, 655 + (i % 3) * 140, 540 + Math.floor(i / 3) * 150, 60, F[f], 32));
};
// flow.a3: the star map, colour across and brightness up, a band, giants above it and a white dwarf below
const flowA3 = (c: Ctx) => {
  ground(c); paper(c, 110, 90, 880, 920);
  const x0 = 260, y0 = 860, s = 640, cell = s / 5;
  shape(c, () => rrect(c, x0, y0 - s, s, s, 4), "#2b2d52", 5);
  for (let i = 1; i < 5; i++) { line(c, [[x0 + i * cell, y0], [x0 + i * cell, y0 - s]], 2, "#4a4c78"); line(c, [[x0, y0 - i * cell], [x0 + s, y0 - i * cell]], 2, "#4a4c78"); }
  // colour strip along the bottom: red to blue; brightness up the side: a faint dot to a big bright star
  ["#e4523b", "#f39a3c", "#ffd34d", "#fff6dc", "#8fc3ea"].forEach((col, i) => shape(c, () => rrect(c, x0 + i * cell + 6, y0 + 22, cell - 12, 40, 6), col, 4));
  arrow(c, [[x0, y0 + 110], [x0 + s, y0 + 110]], INK, 6); arrow(c, [[x0 - 70, y0], [x0 - 70, y0 - s]], INK, 6);
  for (let i = 0; i < 5; i++) shape(c, () => ell(c, x0 - 120, y0 - cell * (i + 0.5), 6 + i * 6, 6 + i * 6), COL.yellow, 3);
  const r = rnd(77), cols = ["#e4523b", "#f39a3c", "#ffd34d", "#fff6dc", "#8fc3ea"];
  for (let i = 0; i < 16; i++) { const t = i / 15, col = Math.min(4, Math.floor(t * 5)); const px = x0 + cell * (0.3 + t * 4.4) + (r() - 0.5) * 50, py = y0 - cell * (0.35 + t * 4.3) + (r() - 0.5) * 60; shape(c, () => ell(c, px, py, 15, 15), cols[col], 3); }
  for (const [dx, dy] of [[0.5, 4.3], [1.3, 4.5], [0.9, 3.8]]) shape(c, () => ell(c, x0 + cell * dx, y0 - cell * dy, 22, 22), "#e4523b", 3);
  shape(c, () => ell(c, x0 + cell * 4.4, y0 - cell * 0.6, 10, 10), WHITE, 3);
  ring(c, x0 + s / 2, y0 - s / 2, 440, 120, -Math.PI / 4, COL.yellow); ring(c, x0 + cell * 0.9, y0 - cell * 4.2, 110, 90, 0, COL.yellow); ring(c, x0 + cell * 4.4, y0 - cell * 0.6, 40, 40, 0, COL.yellow);
};
// flow.a4: a kirana shelf with sacks, oil bottles and spice jars, a child noting the groups
const sack = (c: Ctx, x: number, y: number, f: Food) => {
  shadow(c, x + 12, y, 80, 14);
  shape(c, () => { c.moveTo(x - 78, y); c.lineTo(x - 72, y - 150); c.lineTo(x + 72, y - 150); c.lineTo(x + 78, y); c.closePath(); }, COL.brown);
  shade(c, () => { c.moveTo(x - 78, y); c.lineTo(x - 72, y - 150); c.lineTo(x + 72, y - 150); c.lineTo(x + 78, y); c.closePath(); }, COL.soilDk, 24, 0, 0.4);
  shape(c, () => rrect(c, x - 82, y - 178, 164, 40, 12), "#c08a52", 5);
  shape(c, () => ell(c, x, y - 178, 70, 18), f[0], 5); const r = rnd(Math.round(x)); for (let i = 0; i < 12; i++) grain(c, x - 50 + r() * 100, y - 182 + (r() - 0.5) * 16, 7, r() * 3, f);
};
const jar = (c: Ctx, x: number, y: number, f: Food, w = 70, h = 110) => {
  shadow(c, x + 8, y, w * 0.55, 10); shape(c, () => rrect(c, x - w / 2, y - h, w, h, 10), f[0]); shade(c, () => rrect(c, x - w / 2, y - h, w, h, 10), f[1], w * 0.3, 0, 0.45);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 10), COL.glass, 5); shape(c, () => rrect(c, x - w / 2 - 4, y - h - 22, w + 8, 26, 6), COL.black, 4); shine(c, [[x - w * 0.3, y - h * 0.8], [x - w * 0.3, y - h * 0.3]], 5);
};
const oilBottle = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 6, y, 36, 8);
  shape(c, () => { c.moveTo(x - 30, y); c.lineTo(x - 30, y - 130); c.quadraticCurveTo(x - 30, y - 160, x - 12, y - 168); c.lineTo(x - 12, y - 190); c.lineTo(x + 12, y - 190); c.lineTo(x + 12, y - 168); c.quadraticCurveTo(x + 30, y - 160, x + 30, y - 130); c.lineTo(x + 30, y); c.closePath(); }, "#f2c53a");
  shape(c, () => { c.moveTo(x - 30, y); c.lineTo(x - 30, y - 130); c.quadraticCurveTo(x - 30, y - 160, x - 12, y - 168); c.lineTo(x - 12, y - 190); c.lineTo(x + 12, y - 190); c.lineTo(x + 12, y - 168); c.quadraticCurveTo(x + 30, y - 160, x + 30, y - 130); c.lineTo(x + 30, y); c.closePath(); }, COL.glass, 5);
  shape(c, () => rrect(c, x - 16, y - 204, 32, 18, 4), COL.red, 4); shape(c, () => rrect(c, x - 22, y - 110, 44, 56, 6), COL.paper, 3);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d5b8"; c.fillRect(400, 0, D, D);
  for (const sy of [450, 800]) { shape(c, () => rrect(c, 410, sy, 660, 30, 6), COL.wood, 5); c.fillStyle = COL.woodDk; c.fillRect(413, sy + 18, 654, 10); }
  sack(c, 520, 450, F.rice); sack(c, 720, 450, F.toor); sack(c, 920, 450, F.fennel);
  oilBottle(c, 490, 800); oilBottle(c, 580, 800); jar(c, 720, 800, F.chilli); jar(c, 820, 800, F.turmeric); jar(c, 920, 800, F.garam);
  const kid = person(c, 210, 1040, 460, { reachL: [138, 882], reachR: [282, 882] });
  shape(c, () => rrect(c, 148, 800, 124, 164, 8), COL.paper, 5); line(c, [[160, 800], [160, 964]], 6, COL.red);
  for (let k = 0; k < 5; k++) line(c, [[178, 830 + k * 26], [178 + 40 + (k % 3) * 18, 830 + k * 26]], 4, PENCIL);
  void kid;
};
// flow.p1: the Katori Map with a cross for each guess joined to the dot where the food really landed
const flowP1 = (c: Ctx) => {
  ground(c); katoriMap(c, 300, 820, 520); mapDots(c, false);
  const nu: [string, number, number, number, number][] = [["sooji", 95, 45, 110, 36], ["cumin", 70, 20, 96, 27], ["amchur", 150, 44, 118, 42], ["fennel", 60, 14, 82, 24], ["methi", 130, 20, 150, 26], ["garam", 110, 48, 92, 44]];
  nu.forEach(([f, gm, gh, m, h]) => { const [gx, gy] = mapPt(gm, gh), [x, y] = mapPt(m, h); line(c, [[gx, gy], [x, y]], 4, COL.blueDk); cross(c, gx, gy); dot(c, x, y, F[f][0], 15); });
};
// term: a round steel sieve, flour falling through onto a plate, lumps staying on top
const termSieve = (c: Ctx) => {
  ground(c); plate(c, 540, 900, 300, 95); heap(c, 540, 905, 380, 90, F.flour);
  const r = rnd(9); for (let i = 0; i < 160; i++) { const t = r(); shape(c, () => ell(c, 300 + r() * 480, 500 + t * 340, 4 + r() * 3, 3 + r() * 2), F.flour[0], 1.5); }
  // the sieve: a steel ring, the mesh inside, lumps on the mesh
  shape(c, () => { c.moveTo(220, 400); c.lineTo(220, 460); c.bezierCurveTo(220, 560, 860, 560, 860, 460); c.lineTo(860, 400); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(220, 400); c.lineTo(220, 460); c.bezierCurveTo(220, 560, 860, 560, 860, 460); c.lineTo(860, 400); c.closePath(); }, COL.steelDk, 60, 0, 0.5);
  shape(c, () => ell(c, 540, 400, 320, 100), "#e9e3d3", 6);
  c.save(); c.beginPath(); ell(c, 540, 400, 300, 86); c.clip(); for (let i = -10; i <= 10; i++) { line(c, [[540 + i * 30, 300], [540 + i * 30, 500]], 2, COL.greyDk); line(c, [[200, 400 + i * 9], [880, 400 + i * 9]], 2, COL.greyDk); } c.restore();
  const rr = rnd(13); for (let i = 0; i < 9; i++) { const a = rr() * Math.PI * 2, d = Math.sqrt(rr()); const lx = 540 + Math.cos(a) * d * 250, ly = 400 + Math.sin(a) * d * 60; shape(c, () => ell(c, lx, ly - 6, 18 + rr() * 12, 14 + rr() * 8), F.atta[0], 4); }
  hand(c, 120, 440, 0, 1.3, SKIN.adult, CLOTH.adult); handM(c, 960, 440, Math.PI, 1.3, SKIN.adult, CLOTH.adult);
};
// term: a hand taking a handful of rice from the top of a full sack
const termSample = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1040, 330, 30);
  const body = () => { c.moveTo(230, 1040); c.lineTo(250, 600); c.lineTo(830, 600); c.lineTo(850, 1040); c.closePath(); };
  shape(c, body, COL.brown); shade(c, body, COL.soilDk, 90, 0, 0.4);
  for (let i = 0; i < 5; i++) line(c, [[250 + i * 8, 640 + i * 80], [830 - i * 8, 640 + i * 80]], 3, COL.soilDk);
  shape(c, () => rrect(c, 220, 560, 640, 70, 20), "#c08a52", 5);
  shape(c, () => ell(c, 540, 560, 290, 62), F.rice[0], 5);
  const r = rnd(5); for (let i = 0; i < 160; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); grain(c, 540 + Math.cos(a) * d * 270, 560 + Math.sin(a) * d * 50, 10, r() * 3, F.rice); }
  // the fist above the rice, grains trickling from it back onto the heap
  const an = Math.PI * 0.72, wx = 760, wy = 300, s = 1.6, fx = wx + Math.cos(an) * 70 * s, fy = wy + Math.sin(an) * 70 * s;
  for (let i = 0; i < 18; i++) grain(c, fx + (r() - 0.5) * 60, fy + 20 + r() * (540 - fy), 9, r() * 3, F.rice);
  handM(c, wx, wy, an, s, SKIN.adult, CLOTH.adult);
  for (let i = 0; i < 10; i++) grain(c, fx + (r() - 0.5) * 90, fy + (r() - 0.5) * 40, 10, r() * 3, F.rice);
};

export const ic_materialsSortingMaterialsL4 = cards("sci.materials.sorting-materials.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, e2s4, e3s0, e3s1, e3s2, e3s3,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowP1, termSieve, termSample,
]);
