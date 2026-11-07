import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, seed, leaf, hand, write, cards } from "./flatKit";

// WET BUT THIRSTY (sci.plants.water-transport.L4) · set-up cards for the salt-and-sprouts test, the fan/bag
// sprig test, salted cucumber slices, the salt-crust strip and the paper-strip staircase, then card pictures.

type P = [number, number];
const PAPER = COL.paper, WET = "#bcd6ea", CUCRIM = "#58a14a", CUCIN = "#e3f2c4", CUCWET = "#86b85a", CUCWETIN = "#d2e6b2", OIL = "#f5d04a", JUICE = "#dcecc9", SUGAR = "#fff1bf";

// ---------------------------------------------------------------- small helpers
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.64], [0.48, 0.64]]],
  B: [[[0, 1], [0, 0], [0.38, 0], [0.55, 0.12], [0.55, 0.36], [0.38, 0.48], [0, 0.48]], [[0.38, 0.48], [0.6, 0.6], [0.6, 0.86], [0.4, 1], [0, 1]]],
  C: [[[0.58, 0.16], [0.4, 0.02], [0.16, 0.06], [0.02, 0.3], [0.02, 0.7], [0.16, 0.94], [0.4, 0.98], [0.58, 0.84]]],
  D: [[[0, 1], [0, 0], [0.32, 0], [0.58, 0.22], [0.58, 0.78], [0.32, 1], [0, 1]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 8) => (LET[ch] ?? []).forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
// a white paper tag with one letter, centred at (x, y)
const tag = (c: Ctx, ch: string, x: number, y: number, s = 1) => { shape(c, () => rrect(c, x - 42 * s, y - 38 * s, 84 * s, 76 * s, 8 * s), PAPER, 5); letter(c, ch, x - 17 * s, y - 25 * s, 50 * s, INK, 8 * s); };
// grains of salt (or sugar: bigger, pale yellow) scattered inside an ellipse
const grains = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, sd: number, sz = 6, col: string = WHITE) => {
  const r = rnd(sd);
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); c.save(); c.translate(x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d); c.rotate(r() * 1.5); shape(c, () => rrect(c, -sz / 2, -sz / 2, sz, sz, 1.5), col, 2); c.restore(); }
};
// a little mound of salt or sugar, base centre (x, y)
const heap = (c: Ctx, x: number, y: number, w: number, h: number, col: string = WHITE) => shape(c, () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w / 2, y - h * 1.33, x + w / 2, y - h * 1.33, x + w / 2, y); c.closePath(); }, col, 4);
// a teaspoon lying on the table: bowl centre (x, y), handle running off at angle an; amount = how full of salt (0..1)
const spoon = (c: Ctx, x: number, y: number, an: number, s: number, amount = 0, col: string = WHITE) => {
  const hx = x + Math.cos(an) * 150 * s, hy = y + Math.sin(an) * 150 * s, sx = x + Math.cos(an) * 34 * s, sy = y + Math.sin(an) * 34 * s;
  shadow(c, x + 8, y + 10, 46 * s, 26 * s);
  line(c, [[sx, sy], [hx, hy]], 22 * s, INK); line(c, [[sx, sy], [hx, hy]], 12 * s, COL.steel);
  shape(c, () => ell(c, x, y, 44 * s, 28 * s, an), COL.steel); shape(c, () => ell(c, x, y, 32 * s, 18 * s, an), COL.steelDk, 0);
  if (amount > 0) heap(c, x, y + 4 * s, (34 + 30 * amount) * s, (8 + 30 * amount) * s, col);
};
// a white root, outlined
const root = (c: Ctx, pts: number[][], w: number) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 8; c.stroke(); path(); c.strokeStyle = PAPER; c.lineWidth = w; c.stroke();
};
// a drop of water, tip up, centre of the round part at (x, y + 0.3 r)
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.5); c.quadraticCurveTo(x + r, y - r * 0.2, x + r, y + r * 0.3); c.arc(x, y + r * 0.3, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.5); c.closePath(); }, COL.water, 3);
// a steel katori seen from straight above, with a folded wet paper towel in it
const katoriTop = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.06, y + r * 0.08, r * 1.02, r * 1.02);
  shape(c, () => ell(c, x, y, r, r), COL.steel); shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.14, -r * 0.14, 0.45);
  shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), COL.steelIn, 5);
  const t = r * 0.6; shape(c, () => rrect(c, x - t, y - t, 2 * t, 2 * t, r * 0.08), WET, 5);
  line(c, [[x, y - t + 8], [x, y + t - 8]], 3, "#9bb8d0"); line(c, [[x - t + 8, y], [x + t - 8, y]], 3, "#9bb8d0");
};
// a ruler in millimetres lying across, top-left corner (x, y); mm = pixels per millimetre
const rulerH = (c: Ctx, x: number, y: number, w: number, h: number, mm: number, ncm: number) => {
  shadow(c, x + w / 2 + 10, y + h + 8, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + h - 18, w - 6, 15);
  c.strokeStyle = INK; c.lineCap = "butt"; const x0 = x + 40;
  for (let i = 0; i <= ncm * 10; i++) { const tx = x0 + i * mm, th = i % 10 === 0 ? 34 : i % 5 === 0 ? 24 : 13; c.lineWidth = i % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(tx, y); c.lineTo(tx, y + th); c.stroke(); }
  for (let k = 0; k <= ncm; k++) write(c, String(k), x0 + k * mm * 10 - 10, y + 44, 30, INK, 5);
};
// the same ruler standing upright, ticks on its left edge, top-left corner (x, y)
const rulerV = (c: Ctx, x: number, y: number, w: number, h: number, mm: number, ncm: number) => {
  shadow(c, x + w / 2 + 12, y + h + 6, w / 2 + 10, 12);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(x + w - 18, y + 3, 15, h - 6);
  c.strokeStyle = INK; c.lineCap = "butt"; const y0 = y + 20;
  for (let i = 0; i <= ncm * 10; i++) { const ty = y0 + i * mm, th = i % 10 === 0 ? 34 : i % 5 === 0 ? 24 : 13; c.lineWidth = i % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, ty); c.lineTo(x + th, ty); c.stroke(); }
  for (let k = 0; k <= ncm; k++) write(c, String(k), x + 42, y0 + k * mm * 10 - 12, 26, INK, 4);
};
// a clear plastic water bottle, bottom centre (x, y), filled to the neck with a layer of oil on top.
// drop = how far (px) the oil has sunk from the tape mark; tape = a tape strip marking the first level; tick = a red mark at the new level
type BottleOpt = { drop?: number; tape?: boolean; tick?: boolean; label?: string };
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, o: BottleOpt = {}) => {
  const nw = w * 0.42, nh = h * 0.16, sh = h * 0.1, r = w * 0.1;
  const P = () => { c.moveTo(x - nw / 2, y - h); c.lineTo(x + nw / 2, y - h); c.lineTo(x + nw / 2, y - h + nh); c.quadraticCurveTo(x + w / 2, y - h + nh, x + w / 2, y - h + nh + sh); c.lineTo(x + w / 2, y - r); c.quadraticCurveTo(x + w / 2, y, x + w / 2 - r, y); c.lineTo(x - w / 2 + r, y); c.quadraticCurveTo(x - w / 2, y, x - w / 2, y - r); c.lineTo(x - w / 2, y - h + nh + sh); c.quadraticCurveTo(x - w / 2, y - h + nh, x - nw / 2, y - h + nh); c.closePath(); };
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.12);
  const ty = y - h + h * 0.03, lvl = ty + (o.drop ?? 0), oilH = h * 0.045;
  c.save(); c.beginPath(); P(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, lvl + oilH, 2 * w, y - lvl); c.fillStyle = OIL; c.fillRect(x - w, lvl, 2 * w, oilH); c.restore();
  shape(c, P, COL.glass, 5);
  shine(c, [[x - w * 0.38, y - h + nh + sh + 20], [x - w * 0.38, y - h * 0.3]], 7);
  if (o.tape) { shape(c, () => rrect(c, x - 4, ty - 10, nw / 2 + 16, 34, 3), PAPER, 4); line(c, [[x - 4, ty], [x + nw / 2 + 12, ty]], 4, INK); }
  if (o.tick) line(c, [[x - nw / 2 - 12, lvl], [x - 6, lvl]], 6, RED);
  if (o.label) tag(c, o.label, x, y - h * 0.4, 0.72);
};
// a mint sprig: stem from (x, y) up by h, leaning a little, with pairs of leaves on the upper part
const sprig = (c: Ctx, x: number, y: number, h: number, lean = 0) => {
  const top: P = [x + lean, y - h], mid: P = [x + lean * 0.4, y - h * 0.5];
  line(c, [[x, y], mid, top], 14, INK); line(c, [[x, y], mid, top], 7, COL.greenDk);
  for (let i = 0; i < 4; i++) { const t = 0.5 + i * 0.14, px = x + lean * (t < 0.5 ? t * 0.8 : 0.4 + (t - 0.5) * 1.2), py = y - h * t, L = h * (0.3 - i * 0.035); leaf(c, px, py, L, -0.3 - i * 0.1); leaf(c, px, py, L, Math.PI + 0.3 + i * 0.1); }
  leaf(c, top[0], top[1], h * 0.2, -Math.PI / 2 - 0.35); leaf(c, top[0], top[1], h * 0.2, -Math.PI / 2 + 0.35);
};
// a clear plastic bag (a polygon); drops = droplets running down its inside walls
const bag = (c: Ctx, pts: number[][], drops = false) => {
  shape(c, () => polyP(c, pts), COL.glass, 5);
  if (!drops) return;
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length]; [0.2, 0.5, 0.8].forEach((t, k) => { const px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t, qx = px + (cx - px) * (0.1 + k * 0.05), qy = py + (cy - py) * (0.1 + k * 0.05); line(c, [[qx, qy - 20], [qx, qy - 6]], 3, COL.waterDk); shape(c, () => ell(c, qx, qy, 7, 9), COL.drop, 2.5); }); });
};
// a string tied round a bag at a neck, centre (x, y), width w, with a small bow on the right
const tie = (c: Ctx, x: number, y: number, w: number) => {
  line(c, [[x - w / 2, y], [x + w / 2, y]], 14, INK); line(c, [[x - w / 2, y], [x + w / 2, y]], 7, COL.orange);
  shape(c, () => ell(c, x + w / 2 + 14, y - 10, 16, 9, -0.6), COL.orange, 4); shape(c, () => ell(c, x + w / 2 + 14, y + 10, 16, 9, 0.6), COL.orange, 4);
};
// a cucumber slice seen a little from above: dark rim, pale inside, a ring of seeds
const slice = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0, wet = false) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, ry / rx);
  shape(c, () => ell(c, 0, 0, rx, rx), wet ? CUCWET : CUCRIM, 4); shape(c, () => ell(c, 0, 0, rx * 0.84, rx * 0.84), wet ? CUCWETIN : CUCIN, 3);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; shape(c, () => ell(c, Math.cos(a) * rx * 0.42, Math.sin(a) * rx * 0.42, rx * 0.13, rx * 0.075, a), "#f3eec9", 2); }
  c.restore();
};
// a wall clock, hands at 12 o'clock and twenty past, a red arc for the twenty minutes
const clock = (c: Ctx, x: number, y: number, r: number, minute: number) => {
  shadow(c, x + 14, y + 16, r, r);
  shape(c, () => ell(c, x, y, r, r), COL.teal, 7); shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], i % 3 ? 4 : 7); }
  write(c, "12", x - 28, y - r * 0.64, 36, INK, 5); write(c, "3", x + r * 0.5, y - 18, 36, INK, 5); write(c, "6", x - 12, y + r * 0.42, 36, INK, 5); write(c, "9", x - r * 0.62, y - 18, 36, INK, 5);
  const ma = -Math.PI / 2 + (minute / 60) * Math.PI * 2;
  c.beginPath(); c.arc(x, y, r * 0.58, -Math.PI / 2, ma); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  arrow(c, [[x + Math.cos(ma - 0.12) * r * 0.58, y + Math.sin(ma - 0.12) * r * 0.58], [x + Math.cos(ma) * r * 0.58, y + Math.sin(ma) * r * 0.58]], RED, 10);
  line(c, [[x, y], [x, y - r * 0.4]], 14); line(c, [[x, y], [x + Math.cos(ma) * r * 0.62, y + Math.sin(ma) * r * 0.62]], 10);
  shape(c, () => ell(c, x, y, 12, 12), INK, 0);
};
// scissors: pivot at (x, y), blades pointing along an, red handles behind
const scissors = (c: Ctx, x: number, y: number, an: number, s: number, open = 0.4) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) {
    c.save(); c.rotate((k * open) / 2);
    shape(c, () => { c.moveTo(0, -10); c.lineTo(150, -4); c.lineTo(166, 0); c.lineTo(150, 4); c.lineTo(0, 10); c.closePath(); }, COL.steel, 4);
    line(c, [[0, 0], [-70, k * 22]], 16, INK); line(c, [[0, 0], [-70, k * 22]], 9, COL.red);
    shape(c, () => ell(c, -100, k * 32, 36, 24, k * 0.3), COL.red, 5); shape(c, () => ell(c, -100, k * 32, 20, 11, k * 0.3), BG, 4);
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 7, 7), INK, 0); c.restore();
};
// small pictures standing for the six places of the staircase: wet soil, root, stem, leaf, humid air, dry air
const pict = (c: Ctx, k: string, x: number, y: number, s: number) => {
  if (k === "soil") { shape(c, () => { c.moveTo(x - s, y + s * 0.7); c.quadraticCurveTo(x, y - s * 0.9, x + s, y + s * 0.7); c.closePath(); }, COL.soil, 4); drop(c, x - s * 0.3, y + s * 0.15, s * 0.2); drop(c, x + s * 0.35, y, s * 0.2); }
  else if (k === "root") { root(c, [[x - s * 0.1, y - s * 0.9], [x + s * 0.15, y], [x - s * 0.05, y + s * 0.9]], s * 0.3); for (let i = 0; i < 4; i++) { const yy = y - s * 0.5 + i * s * 0.35, side = i % 2 ? 1 : -1; line(c, [[x + side * s * 0.1, yy], [x + side * s * 0.6, yy - s * 0.15]], 4, PAPER); } }
  else if (k === "stem") { line(c, [[x, y + s * 0.9], [x, y - s * 0.9]], s * 0.55, INK); line(c, [[x, y + s * 0.9], [x, y - s * 0.9]], s * 0.32, COL.greenDk); line(c, [[x - s * 0.2, y], [x + s * 0.2, y]], 4, COL.leafDk); leaf(c, x, y - s * 0.4, s * 0.7, -0.6); }
  else if (k === "leaf") leaf(c, x - s * 0.75, y + s * 0.7, s * 1.8, -0.75);
  else if (k === "humid") { for (const [dx, dy, rr] of [[-0.45, 0.05, 0.4], [0.45, 0.05, 0.4], [0, -0.2, 0.52]]) shape(c, () => ell(c, x + dx * s, y + dy * s, rr * s, rr * s * 0.85), "#e8eef3", 4); drop(c, x - s * 0.35, y + s * 0.7, s * 0.16); drop(c, x + s * 0.3, y + s * 0.8, s * 0.16); }
  else if (k === "dry") { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line(c, [[x + Math.cos(a) * s * 0.6, y + Math.sin(a) * s * 0.6], [x + Math.cos(a) * s * 0.95, y + Math.sin(a) * s * 0.95]], 5, COL.orange); } shape(c, () => ell(c, x, y, s * 0.45, s * 0.45), COL.yellow, 4); }
};
const PLACES = ["soil", "root", "stem", "leaf", "humid", "dry"], PULL = [1, 5, 10, 15, 140, 940];
// a paper strip lying across, left end at (x, y - h/2)
const strip = (c: Ctx, x: number, y: number, len: number, h = 44) => shape(c, () => rrect(c, x, y - h / 2, Math.max(len, 8), h, 4), PAPER, 5);
// a tall glass with a paper strip leaning in it, one end in the water; wet = how far up the strip is wet (0..1 of its length)
const glassStrip = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, wet: number, mark = false, crust = false) => {
  glass(c, x, y, w, h, fill);
  const p0: P = [x - w * 0.25, y - 40], p1: P = [x + w * 0.75, y - h - 190], L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), an = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  c.save(); c.translate(p0[0], p0[1]); c.rotate(an);
  shape(c, () => rrect(c, 0, -28, L, 56, 4), PAPER, 0);
  if (wet > 0) shape(c, () => rrect(c, 0, -28, L * wet, 56, 4), WET, 0);
  shape(c, () => rrect(c, 0, -28, L, 56, 4), "rgba(0,0,0,0)", 5);
  if (mark) line(c, [[L * wet, -36], [L * wet, 36]], 7, INK);
  if (crust) { const r = rnd(5); for (let i = 0; i < 30; i++) { const u = L * wet - 34 + r() * 48, v = -30 + r() * 60; c.save(); c.translate(u, v); c.rotate(r()); shape(c, () => rrect(c, -6, -6, 12, 12, 2), WHITE, 2.5); c.restore(); } }
  c.restore();
  // the rim drawn again so the strip passes through the mouth of the glass
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), "rgba(255,255,255,0.35)", 5);
};
// a pencil lying on the table, point at (x, y), body running off at angle an
const pencil = (c: Ctx, x: number, y: number, an: number, len = 220) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 40, -13, len, 26, 3), COL.yellow, 5); shape(c, () => rrect(c, len + 30, -13, 26, 26, 3), COL.pink, 4);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(42, -13); c.lineTo(42, 13); c.closePath(); }, "#f0d9b5", 4); shape(c, () => { c.moveTo(0, 0); c.lineTo(14, -4); c.lineTo(14, 4); c.closePath(); }, INK, 0);
  c.restore();
};
// a coriander leaf: three small lobes on a short stalk, pointing along an from (x, y)
const corLeaf = (c: Ctx, x: number, y: number, an: number, s: number) => { line(c, [[x, y], [x + Math.cos(an) * s * 0.5, y + Math.sin(an) * s * 0.5]], 4, COL.leafDk); const bx = x + Math.cos(an) * s * 0.45, by = y + Math.sin(an) * s * 0.45; leaf(c, bx, by, s * 0.7, an - 0.7); leaf(c, bx, by, s * 0.7, an + 0.7); leaf(c, bx, by, s * 0.85, an); };

// ---------------------------------------------------------------- set-up cards · e1 salt and the sprouts
// 1. four tumblers A to D; salt beside B, C and D, more each time
const e1s0 = (c: Ctx) => {
  ground(c);
  const xs = [165, 415, 665, 915];
  xs.forEach((x, i) => { glass(c, x, 620, 170, 330, 0.72); shape(c, () => rrect(c, x - 40, 420, 80, 74, 6), PAPER, 4); letter(c, "ABCD"[i], x - 17, 433, 48); });
  [0.3, 0.6, 1].forEach((a, i) => spoon(c, xs[i + 1] - 30, 800, 0.55, 1.1, a));
};
// 2. a katori from above: wet folded towel, ten soaked moong spread out
const e1s1 = (c: Ctx) => {
  ground(c); katoriTop(c, 540, 540, 350);
  const r = rnd(3);
  for (let i = 0; i < 10; i++) seed(c, 400 + (i % 5) * 70, i < 5 ? 470 : 610, 26, r() * 3, true);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 360 + r() * 360, 360 + r() * 360, 7, 5), COL.drop, 2);
};
// 3. four covered katoris in a shady corner
const e1s2 = (c: Ctx) => {
  ground(c); c.fillStyle = "#cdbfa8"; c.fillRect(0, 0, D, 600); shape(c, () => polyP(c, [[0, 0], [130, 60], [130, 600], [0, 690]]), "#bfae95", 5); line(c, [[130, 600], [D, 600]], 5);
  [175, 420, 665, 910].forEach((x, i) => { bowl(c, x, 700, 108); plate(c, x, 694, 118, 30); tag(c, "ABCD"[i], x, 840, 0.8); });
};
// 4. a sprout lying along a millimetre ruler, the root tip marked
const e1s3 = (c: Ctx) => {
  ground(c); rulerH(c, 110, 660, 880, 110, 10, 8);
  root(c, [[205, 600], [300, 612], [400, 622], [520, 640]], 14); seed(c, 180, 590, 44, 0.25, true);
  line(c, [[520, 648], [520, 672]], 6, RED); write(c, "37", 468, 500, 54, RED, 7);
};
// ---------------------------------------------------------------- e2 fan, still air or bag
// 1. three bottles filled to the neck, oil on top, tape at the level
const e2s0 = (c: Ctx) => { ground(c); [215, 540, 865].forEach((x) => bottle(c, x, 880, 190, 560, { tape: true })); };
// 2. a sprig in a bottle, a bag tied loosely over the leaves and neck
const e2s1 = (c: Ctx) => {
  ground(c); bottle(c, 440, 980, 270, 660, { tape: true }); sprig(c, 440, 560, 420, 20);
  bag(c, [[375, 362], [505, 362], [660, 200], [620, 40], [260, 40], [220, 200]]); tie(c, 440, 370, 140);
};
// 3. A under the ceiling fan; B and C on the same shelf behind a standing book
const e2s2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 30], [D, 30]], 6); line(c, [[250, 30], [250, 92]], 12); shape(c, () => ell(c, 250, 100, 32, 18), COL.grey, 5);
  [0.2, 2.3, 4.3].forEach((a) => shape(c, () => ell(c, 250 + Math.cos(a) * 150, 100 + Math.sin(a) * 20, 150, 20, Math.atan2(Math.sin(a) * 20, Math.cos(a) * 150)), COL.wood, 5));
  for (const dx of [-50, 0, 50]) arrow(c, [[250 + dx, 140], [262 + dx, 160], [250 + dx, 180], [262 + dx, 200], [250 + dx, 218]], "#7fa6c8", 6);
  shape(c, () => rrect(c, 80, 700, 920, 26, 4), COL.wood, 5); c.fillStyle = COL.woodDk; c.fillRect(84, 712, 912, 11);
  shape(c, () => polyP(c, [[200, 726], [240, 726], [220, 780]]), COL.woodDk, 4); shape(c, () => polyP(c, [[860, 726], [900, 726], [880, 780]]), COL.woodDk, 4);
  bottle(c, 250, 700, 110, 300, { tape: true, label: "A" }); sprig(c, 250, 470, 200, 8);
  shape(c, () => rrect(c, 470, 400, 90, 300, 6), COL.purple, 5); c.fillStyle = PAPER; c.fillRect(486, 406, 70, 288); shape(c, () => rrect(c, 470, 400, 24, 300, 6), "#6e52a8", 4);
  bottle(c, 730, 700, 110, 300, { tape: true, label: "B" }); sprig(c, 730, 470, 200, -8);
  bottle(c, 920, 700, 110, 300, { tape: true, label: "C" }); sprig(c, 920, 470, 200, 6);
  bag(c, [[890, 412], [950, 412], [1030, 340], [1010, 215], [830, 215], [810, 340]]); tie(c, 920, 418, 70);
};
// 4. a ruler held beside the neck, a red tick at the new oil level, drops inside the bag
const e2s3 = (c: Ctx) => {
  ground(c); bottle(c, 400, 960, 240, 600, { tape: true, drop: 48, tick: true }); sprig(c, 400, 520, 340, 15);
  bag(c, [[340, 378], [460, 378], [600, 240], [560, 60], [240, 60], [200, 240]], true); tie(c, 400, 386, 130);
  line(c, [[462, 426], [618, 426]], 4, RED);
  rulerV(c, 620, 378, 90, 400, 10, 3);
  hand(c, 665, 850, -Math.PI / 2, 1.1);
};
// ---------------------------------------------------------------- a1 salted slices
const ringOfSlices = (c: Ctx, x: number, y: number, rx: number, ry: number, sr: number, wet = false) => { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; slice(c, x + Math.cos(a) * rx, y + Math.sin(a) * ry, sr, sr * (wet ? 0.55 : 0.7), 0, wet); } };
// 1. three plates of eight slices: nothing, salt, sugar
const a1s0 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x, i) => { plate(c, x, 560, 165, 100); ringOfSlices(c, x, 556, 98, 56, 30); if (i === 1) grains(c, x, 556, 125, 72, 70, 5, 5); if (i === 2) grains(c, x, 556, 125, 72, 45, 6, 8, SUGAR); });
  spoon(c, 540, 770, 0.5, 0.8, 0.6); spoon(c, 890, 770, 0.5, 0.8, 0.6, SUGAR);
};
// 2. twenty minutes on the clock, the plates left alone
const a1s1 = (c: Ctx) => {
  ground(c); clock(c, 540, 330, 230, 20);
  [190, 540, 890].forEach((x, i) => { plate(c, x, 840, 150, 72); ringOfSlices(c, x, 837, 85, 40, 24); if (i === 1) grains(c, x, 837, 110, 50, 50, 5, 4); if (i === 2) grains(c, x, 837, 110, 50, 30, 6, 7, SUGAR); });
};
// 3. a firm slice on one hand, a floppy slice drooping over the other; a spoon scooping liquid off a tilted plate
const a1s2 = (c: Ctx) => {
  ground(c);
  hand(c, 300, 560, -Math.PI / 2, 1.4, SKIN.child, CLOTH.child, true); slice(c, 300, 418, 95, 22);
  hand(c, 760, 560, -Math.PI / 2, 1.4, SKIN.child, CLOTH.child, true);
  shape(c, () => { c.moveTo(665, 530); c.quadraticCurveTo(760, 372, 855, 530); c.lineTo(828, 530); c.quadraticCurveTo(760, 404, 692, 530); c.closePath(); }, CUCWET, 4);
  c.save(); c.translate(540, 850); c.rotate(-0.2); plate(c, 0, 0, 280, 105); shape(c, () => ell(c, -110, 18, 115, 42), JUICE, 3); ringOfSlices(c, 40, -20, 150, 50, 30, true); spoon(c, -130, 20, -1.1, 1.0, 0); c.restore();
};
// ---------------------------------------------------------------- a2 leave the salt behind
const saltMark = (c: Ctx, x: number, y: number) => { spoon(c, x, y, 0.4, 0.9, 0.7); grains(c, x + 90, y + 10, 60, 20, 10, 8, 5); };
// 1. two tall glasses, a paper strip leaning in each
const a2s0 = (c: Ctx) => { ground(c); glassStrip(c, 330, 820, 200, 440, 0.45, 0.27); glassStrip(c, 760, 820, 200, 440, 0.45, 0.27); saltMark(c, 290, 930); };
// 2. after an hour: wet halfway up, a pencil line at the wet edge
const a2s1 = (c: Ctx) => { ground(c); glassStrip(c, 330, 820, 200, 440, 0.42, 0.55, true); glassStrip(c, 760, 820, 200, 440, 0.42, 0.55, true); saltMark(c, 290, 930); pencil(c, 560, 960, -0.1); };
// 3. next morning: a white crust on the salt-water strip, the plain one clean
const a2s2 = (c: Ctx) => { ground(c); glassStrip(c, 330, 820, 200, 440, 0.3, 0.72, false, true); glassStrip(c, 760, 820, 200, 440, 0.3, 0.72); saltMark(c, 290, 930); };
// ---------------------------------------------------------------- a3 the string staircase
// 1. six labels in a row and a pile of paper strips
const a3s0 = (c: Ctx) => {
  ground(c);
  PLACES.forEach((k, i) => { const x = 165 + i * 150; shadow(c, x + 8, 448, 70, 12); shape(c, () => rrect(c, x - 70, 325, 140, 110, 8), PAPER, 5); pict(c, k, x, 380, 34); });
  for (let i = 0; i < 6; i++) strip(c, 230 + i * 8, 700 + i * 18, 620);
  pencil(c, 560, 920, 0.05, 240);
};
// 2. cutting the strips: 1 mm of paper for every 0.1 of pull number (drawn at 0.7 px per mm)
const a3s1 = (c: Ctx) => {
  ground(c); const S = 0.7;
  pict(c, "dry", 70, 300, 28); strip(c, 120, 300, 900); line(c, [[120 + PULL[5] * S, 276], [120 + PULL[5] * S, 324]], 3, BG);
  scissors(c, 830, 230, 2.2, 0.9); hand(c, 928, 95, 2.2, 1.1);
  PLACES.slice(0, 5).forEach((k, i) => { const y = 440 + i * 100; pict(c, k, 70, y, 28); strip(c, 120, y, PULL[i] * S); });
};
// 3. the six strips side by side, shortest first (0.85 px per mm)
const a3s2 = (c: Ctx) => { ground(c); PLACES.forEach((k, i) => { const y = 140 + i * 132; pict(c, k, 70, y, 30); strip(c, 120, y, PULL[i] * 0.85); }); };

// ---------------------------------------------------------------- card pictures
// the result of the sprout test: A sprouts well, B less, C hardly, D not at all
const flowE1 = (c: Ctx) => {
  ground(c);
  [[290, 290, 9, 60], [790, 290, 7, 42], [290, 790, 3, 22], [790, 790, 0, 0]].forEach(([cx, cy, n, len], k) => {
    katoriTop(c, cx, cy, 215); const r = rnd(11 + k);
    for (let i = 0; i < 10; i++) { const sx = cx - 120 + (i % 5) * 60, sy = i < 5 ? cy - 42 : cy + 42; if (i < n) root(c, [[sx + 6, sy + 6], [sx + 16, sy + 20 + len * 0.3], [sx + 10 + r() * 14, sy + 14 + len]], 7); }
    for (let i = 0; i < 10; i++) seed(c, cx - 120 + (i % 5) * 60, i < 5 ? cy - 42 : cy + 42, 17, r() * 3, true);
    tag(c, "ABCD"[k], cx - 150, cy - 150, 0.8);
  });
};
// the result of the sprig test: the fanned bottle lost most, the bagged one least
const flowE2 = (c: Ctx) => {
  ground(c);
  for (const dy of [-40, 0, 40]) arrow(c, [[20, 300 + dy], [45, 290 + dy], [70, 302 + dy], [95, 292 + dy], [125, 300 + dy]], "#7fa6c8", 6);
  bottle(c, 230, 900, 170, 520, { tape: true, drop: 90, tick: true, label: "A" }); sprig(c, 230, 500, 280, 10);
  bottle(c, 560, 900, 170, 520, { tape: true, drop: 45, tick: true, label: "B" }); sprig(c, 560, 500, 280, -8);
  bottle(c, 880, 900, 170, 520, { tape: true, drop: 10, tick: true, label: "C" }); sprig(c, 880, 500, 280, 6);
  bag(c, [[840, 396], [920, 396], [1030, 300], [1000, 130], [760, 130], [730, 300]], true); tie(c, 880, 404, 100);
};
// the salted slices after twenty minutes: a puddle under the salted and the sugared slices, none under the plain ones
const flowA1 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x, i) => { plate(c, x, 560, 165, 100); if (i) { shape(c, () => ell(c, x, 560, 128, 68), JUICE, 3); ringOfSlices(c, x, 556, 98, 56, 30, true); } else ringOfSlices(c, x, 556, 98, 56, 30); if (i === 1) grains(c, x, 556, 125, 72, 50, 5, 5); if (i === 2) grains(c, x, 556, 125, 72, 32, 6, 8, SUGAR); });
  spoon(c, 540, 770, 0.5, 0.8, 0.6); spoon(c, 890, 770, 0.5, 0.8, 0.6, SUGAR);
};
// the crust strip looked at through a magnifying glass
const flowA2 = (c: Ctx) => {
  ground(c); glassStrip(c, 300, 840, 180, 380, 0.3, 0.72, false, true); glassStrip(c, 800, 840, 180, 380, 0.3, 0.72); saltMark(c, 250, 950);
  const lx = 385, ly = 418, R = 95, an = 0.9;
  const hx = lx + Math.cos(an) * (R + 14), hy = ly + Math.sin(an) * (R + 14), ex = lx + Math.cos(an) * (R + 180), ey = ly + Math.sin(an) * (R + 180);
  line(c, [[hx, hy], [ex, ey]], 36, INK); line(c, [[hx, hy], [ex, ey]], 24, COL.wood);
  shape(c, () => ell(c, lx, ly, R, R), "rgba(214,236,250,0.7)", 0);
  c.save(); c.beginPath(); ell(c, lx, ly, R, R); c.clip(); const r = rnd(9); for (let i = 0; i < 9; i++) { c.save(); c.translate(lx - 60 + r() * 120, ly - 60 + r() * 120); c.rotate(r()); shape(c, () => rrect(c, -14, -14, 28, 28, 3), WHITE, 4); c.restore(); } c.restore();
  c.beginPath(); ell(c, lx, ly, R, R); c.lineWidth = 18; c.strokeStyle = INK; c.stroke(); c.beginPath(); ell(c, lx, ly, R, R); c.lineWidth = 8; c.strokeStyle = COL.steel; c.stroke();
  hand(c, 592, 681, -2.24, 1.2);
};
// the staircase of pull numbers as standing strips: tiny steps inside the plant, a cliff into dry air
const flowA3 = (c: Ctx) => {
  ground(c); const base = 900, S = 0.85;
  line(c, [[60, base], [1020, base]], 6);
  const tops = PULL.map((v) => base - Math.max(8, v * S));
  PLACES.forEach((k, i) => { const x = 110 + i * 150; shape(c, () => rrect(c, x, tops[i], 84, base - tops[i], 4), PAPER, 5); pict(c, k, x + 42, 962, 30); });
  for (let i = 0; i < 5; i++) arrow(c, [[152 + i * 150, tops[i] - 24], [302 + i * 150, tops[i + 1] - 24]], COL.blue, 8);
  drop(c, 152, tops[0] - 60, 16);
};
// term 1 · osmosis: salt on a cucumber slice pulls water up out of it
const termOsmosis = (c: Ctx) => {
  ground(c); shape(c, () => ell(c, 560, 700, 380, 56), JUICE, 3);
  shape(c, () => { c.moveTo(210, 600); c.ellipse(540, 600, 330, 150, 0, Math.PI, 0, true); c.lineTo(870, 670); c.ellipse(540, 670, 330, 150, 0, 0, Math.PI); c.closePath(); }, "#4f8f3f", 5);
  shape(c, () => ell(c, 540, 600, 330, 150), CUCRIM, 5); shape(c, () => ell(c, 540, 600, 285, 122), CUCIN, 3);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2; shape(c, () => ell(c, 540 + Math.cos(a) * 150, 600 + Math.sin(a) * 62, 26, 14, a), "#f3eec9", 2); }
  heap(c, 540, 560, 220, 50); grains(c, 540, 560, 180, 60, 40, 4, 8);
  for (const [x, y] of [[300, 640], [420, 680], [660, 680], [780, 640]]) { arrow(c, [[x, y + 40], [x, y - 70]], COL.blue, 8); drop(c, x, y - 110, 14); }
};
// term 6 · wilting: a bunch of coriander drooping over the edge of a steel plate
const termWilting = (c: Ctx) => {
  ground(c); plate(c, 540, 620, 330, 130);
  const stems: number[][][] = [[[380, 580], [600, 556], [790, 596], [890, 720], [905, 860]], [[370, 596], [600, 576], [800, 622], [920, 740], [940, 880]], [[390, 566], [610, 540], [780, 574], [860, 700], [860, 840]]];
  stems.forEach((s) => { line(c, s, 14, INK); line(c, s, 7, COL.leaf); });
  [[905, 860, 1.4], [940, 880, 1.7], [860, 840, 1.2], [890, 760, 1.9], [930, 800, 1.3], [850, 720, 2.1], [800, 620, 2.0], [760, 580, 1.6]].forEach(([x, y, a]) => corLeaf(c, x, y, a, 70));
  [[600, 556, 2.6], [650, 560, 0.6], [700, 580, 2.9]].forEach(([x, y, a]) => corLeaf(c, x, y, a, 60));
  shape(c, () => ell(c, 455, 574, 16, 30, 0.2), COL.red, 4);
};
// term 7 · transpiration: a bag over a leafy twig, droplets running down inside
const termTranspiration = (c: Ctx) => {
  ground(c); glass(c, 540, 1040, 180, 300, 0.6);
  line(c, [[540, 1000], [548, 700], [560, 280]], 22, INK); line(c, [[540, 1000], [548, 700], [560, 280]], 12, COL.brown);
  for (const [bx, by, ex, ey] of [[552, 560, 420, 380], [556, 460, 690, 320], [550, 640, 390, 540], [558, 400, 680, 220]]) { line(c, [[bx, by], [ex, ey]], 16, INK); line(c, [[bx, by], [ex, ey]], 8, COL.brown); }
  [[420, 380, -2.2], [460, 440, -1.2], [690, 320, -0.7], [650, 390, 0.4], [390, 540, -2.6], [440, 520, 2.4], [680, 220, -0.9], [630, 270, -2.0], [560, 280, -1.6], [560, 280, -1.0], [520, 600, 2.9], [610, 500, 0.3]].forEach(([x, y, a]) => leaf(c, x, y, 90, a));
  bag(c, [[470, 712], [610, 712], [790, 560], [770, 110], [310, 110], [290, 560]], true); tie(c, 540, 718, 150);
};
// term 10 · xylem: a celery stalk that stood in blue ink, the strings showing blue
const termXylem = (c: Ctx) => {
  ground(c); glass(c, 230, 360, 160, 250, 0.55, COL.blueDk);
  shadow(c, 600, 650, 380, 40);
  const body = () => { c.moveTo(240, 490); c.lineTo(900, 470); c.quadraticCurveTo(960, 560, 900, 650); c.lineTo(240, 640); c.closePath(); };
  shape(c, body, "#c9e39a", 5);
  [508, 538, 568, 598, 626].forEach((y, i) => line(c, [[250, y + 4 - i], [895, y - 6 - i * 4]], 5, COL.blueDk));
  shape(c, () => ell(c, 240, 565, 42, 80), "#e1f0c0", 5);
  [508, 538, 568, 598, 626].forEach((y) => shape(c, () => ell(c, 236, y + 2, 7, 7), COL.blueDk, 2));
  [[930, 510, -1.2], [950, 550, -0.4], [930, 600, 0.5]].forEach(([x, y, a]) => { line(c, [[x - 30, y + 10], [x + 20, y]], 10, INK); line(c, [[x - 30, y + 10], [x + 20, y]], 5, COL.leafDk); leaf(c, x + 20, y, 90, a); });
};
// term 13 · mangroves on arched roots in the mud at low tide, a boat on the creek
const mangrove = (c: Ctx, x: number, gy: number, s: number) => {
  for (const k of [-3, -2, -1, 1, 2, 3]) { const pts: number[][] = [[x + k * 6, gy - 220 * s], [x + k * 60 * s, gy - 140 * s], [x + k * 68 * s, gy]]; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); c.strokeStyle = INK; c.lineWidth = 24 * s; c.lineCap = "round"; c.stroke(); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); c.strokeStyle = COL.brown; c.lineWidth = 14 * s; c.stroke(); }
  line(c, [[x, gy - 200 * s], [x, gy - 440 * s]], 44 * s, INK); line(c, [[x, gy - 200 * s], [x, gy - 440 * s]], 32 * s, COL.brown);
  const cy = gy - 480 * s; [[-110, 40, 90], [110, 40, 90], [-60, -50, 95], [60, -50, 95], [0, 10, 110], [0, -90, 80]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx * s, cy + dy * s, r * s, r * s * 0.85), COL.green, 5));
};
const termMangrove = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 560); c.fillStyle = "#9b8a6e"; c.fillRect(0, 520, D, 160); line(c, [[0, 520], [D, 520]], 4);
  shape(c, () => { c.moveTo(0, 680); c.quadraticCurveTo(300, 650, 600, 690); c.quadraticCurveTo(900, 720, D, 670); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, "#8a6a4a", 5);
  for (const [x, y, rx] of [[200, 900, 90], [620, 980, 120], [930, 930, 70]]) shape(c, () => ell(c, x, y, rx, rx * 0.3), "#9b8a6e", 3);
  shape(c, () => { c.moveTo(70, 560); c.quadraticCurveTo(170, 620, 290, 560); c.lineTo(260, 540); c.lineTo(100, 540); c.closePath(); }, COL.brown, 5); line(c, [[180, 540], [180, 470]], 8); shape(c, () => polyP(c, [[184, 470], [240, 530], [184, 530]]), PAPER, 4);
  mangrove(c, 400, 860, 1.15); mangrove(c, 890, 880, 0.85); mangrove(c, 690, 900, 1.3);
};

export const ic_plantsWaterTransportL4 = cards("sci.plants.water-transport.L4", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, a1s0, a1s1, a1s2, a2s0, a2s1, a2s2, a3s0, a3s1, a3s2,
  flowE1, flowE2, flowA1, flowA2, flowA3, termOsmosis, termWilting, termTranspiration, termXylem, termMangrove,
]);
