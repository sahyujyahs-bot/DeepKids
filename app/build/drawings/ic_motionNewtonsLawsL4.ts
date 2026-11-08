import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// NEWTON'S SECOND LAW (L4) · set-up cards and card pictures: a toy truck pulled by a hanging bag of
// water over a pen at the table edge, ramps on book stacks, a trolley bag, a book and paper, a soft ball,
// a bathroom scale in a lift, a toy car braking on a towel. Same child and grown-up on every card.
// Arms: reachL is the arm on the viewer's left, reachR the one on the viewer's right; a hand target
// sits outward of its shoulder, never across the body.

const FLOOR = 1000;
const floor = (c: Ctx, y = FLOOR, col = "#e3d6bd") => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
const tiles = (c: Ctx, y0: number, y1 = D) => {
  c.fillStyle = "#ece6da"; c.fillRect(0, y0, D, y1 - y0); line(c, [[0, y0], [D, y0]], 4);
  c.strokeStyle = "#c9c0b1"; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 135) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); }
  for (let y = y0 + 110; y < y1; y += 110) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
};
// speed lines behind a moving thing (to the left of x when dir = 1)
const dashes = (c: Ctx, x: number, y: number, dir: number, n = 3, len = 50) => { for (let i = 0; i < n; i++) line(c, [[x - dir * i * 16, y - 24 + i * 24], [x - dir * (i * 16 + len), y - 24 + i * 24]], 6, COL.greyDk); };

// a table seen from the side: its top surface at y, legs down to the floor
const table = (c: Ctx, x0: number, x1: number, y: number) => {
  for (const lx of [x0 + 60, x1 - 60]) shape(c, () => rrect(c, lx - 18, y + 28, 36, FLOOR - y - 28, 6), COL.woodDk);
  shape(c, () => rrect(c, x0, y, x1 - x0, 36, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x0 + 4, y + 22, x1 - x0 - 8, 11);
};
// a strip of pale masking tape, centred at (x, y)
const tape = (c: Ctx, x: number, y: number, w: number, h = 14, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), "#f8ecb6", 3); c.restore(); };
// a plastic water bottle, bottom centre at (x, y) before rotation (rot = PI/2 lays it with the cap to the right)
const bottle = (c: Ctx, x: number, y: number, h: number, fill: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const w = h * 0.36, body = () => rrect(c, -w / 2, -h * 0.78, w, h * 0.78, w * 0.2);
  c.beginPath(); body(); c.fillStyle = COL.glass; c.fill();
  if (fill > 0) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(-w, -h * 0.78 * fill, 2 * w, h); c.restore(); }
  c.beginPath(); body(); c.lineWidth = 5; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  shape(c, () => polyP(c, [[-w * 0.32, -h * 0.78], [w * 0.32, -h * 0.78], [w * 0.2, -h * 0.88], [-w * 0.2, -h * 0.88]]), COL.glass, 5);
  shape(c, () => rrect(c, -w * 0.24, -h, w * 0.48, h * 0.13, 4), COL.blue, 5);
  shine(c, [[-w * 0.28, -h * 0.68], [-w * 0.28, -h * 0.3]], 5);
  c.restore();
};
// a small polythene bag of water hanging from a knot at (x, y); s = its height; fill 0..1
const bagPath = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y); c.bezierCurveTo(x - s * 0.6, y + s * 0.35, x - s * 0.55, y + s, x, y + s); c.bezierCurveTo(x + s * 0.55, y + s, x + s * 0.6, y + s * 0.35, x, y); c.closePath(); };
const bag = (c: Ctx, x: number, y: number, s: number, fill: number) => {
  c.beginPath(); bagPath(c, x, y, s); c.fillStyle = "rgba(232,241,250,0.85)"; c.fill();
  c.save(); c.beginPath(); bagPath(c, x, y, s); c.clip(); c.fillStyle = COL.water; c.fillRect(x - s, y + s * (1 - fill * 0.8), 2 * s, s); c.restore();
  c.beginPath(); bagPath(c, x, y, s); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, x - s * 0.12, y - s * 0.08, s * 0.12, s * 0.06, -0.7), "#dbe7f3", 4); shape(c, () => ell(c, x + s * 0.12, y - s * 0.08, s * 0.12, s * 0.06, 0.7), "#dbe7f3", 4);
  shape(c, () => ell(c, x, y, s * 0.08, s * 0.07), "#dbe7f3", 4);
  shine(c, [[x - s * 0.3, y + s * 0.45], [x - s * 0.22, y + s * 0.75]], 6);
};
// a ball-pen taped across the table edge, seen end on: a blue circle at the corner (x, y) of the table top, tape over it
const penEdge = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x - 17, y - 17, 17, 17), COL.blue, 5); shape(c, () => ell(c, x - 17, y - 17, 5, 5), COL.black, 0);
  c.globalAlpha = 0.8; shape(c, () => rrect(c, x - 52, y - 18, 56, 20, 3), "#f8ecb6", 3); shape(c, () => rrect(c, x - 2, y - 18, 16, 62, 3), "#f8ecb6", 3); c.globalAlpha = 1;
};
// the thread from the truck's tow point over the pen at the table corner (ex, ey) and down to the bag knot
const threadOverPen = (c: Ctx, tow: [number, number], ex: number, ey: number, knotY: number) => {
  line(c, [tow, [ex - 17, ey - 34]], 4); c.beginPath(); c.arc(ex - 17, ey - 17, 17, -Math.PI / 2, 0); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); line(c, [[ex, ey - 17], [ex, knotY]], 4);
};
// a toy truck seen from the side, wheels on (x, y), cab towards dir; nBot bottles stand strapped on the bed. Returns the tow point.
const truck = (c: Ctx, x: number, y: number, w: number, nBot: number, dir: 1 | -1 = 1, rot = 0): [number, number] => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(dir, 1);
  const r = w * 0.11, bedTop = -(r + w * 0.18), low = -r * 0.5;
  if (!rot) shadow(c, 0, 4, w * 0.55, w * 0.05);
  shape(c, () => rrect(c, -w / 2, bedTop, w * 0.66, low - bedTop, 6), COL.teal); shade(c, () => rrect(c, -w / 2, bedTop, w * 0.66, low - bedTop, 6), COL.tealDk, 0, w * 0.06);
  shape(c, () => rrect(c, w * 0.14, -(r + w * 0.42), w * 0.36, r + w * 0.42 + low, 10), COL.red);
  shape(c, () => rrect(c, w * 0.2, -(r + w * 0.37), w * 0.22, w * 0.15, 6), COL.sky, 4);
  shape(c, () => rrect(c, -w / 2 + 4, low - 4, w - 8, w * 0.07, 4), COL.black, 4);
  for (const wx of [-w * 0.3, w * 0.3]) { shape(c, () => ell(c, wx, -r, r, r), COL.black); shape(c, () => ell(c, wx, -r, r * 0.45, r * 0.45), COL.grey, 4); }
  const bh = w * 0.44, bw = bh * 0.36, span = w * 0.62, step = nBot > 1 ? Math.min(bw * 1.15, (span - bw) / (nBot - 1)) : 0, x0 = -w / 2 + w * 0.04 + bw / 2 + (span - bw - step * (nBot - 1)) / 2;
  for (let i = 0; i < nBot; i++) bottle(c, x0 + i * step, bedTop, bh, 0.9);
  if (nBot) shape(c, () => rrect(c, -w / 2 + w * 0.02, bedTop - bh * 0.5, w * 0.62, 16, 4), COL.brown, 4);
  c.restore();
  const tx = dir * (w / 2), ty = -(r + w * 0.1);
  return [x + Math.cos(rot) * tx - Math.sin(rot) * ty, y + Math.sin(rot) * tx + Math.cos(rot) * ty];
};
// a thick book lying flat, bottom-left corner at (x, y)
const bookFlat = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  shape(c, () => rrect(c, x, y - h, w, h, 4), COL.paper);
  c.strokeStyle = COL.grey; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x + 16, y - h + (h * k) / 4); c.lineTo(x + w - 4, y - h + (h * k) / 4); c.stroke(); }
  shape(c, () => rrect(c, x, y - h, w, h * 0.22, 3), col, 4); shape(c, () => rrect(c, x, y - h * 0.2, w, h * 0.2, 3), col, 4); shape(c, () => rrect(c, x, y - h, 16, h, 3), col, 4);
};
const BOOKCOL = [COL.red, COL.blue, COL.green, COL.purple, COL.orange, COL.teal, COL.pink, COL.yellow];
// a pile of n books, centre x, standing on the floor y; returns the top
const books = (c: Ctx, x: number, y: number, n: number, w = 240, h = 34) => { for (let i = 0; i < n; i++) bookFlat(c, x - w / 2 + (i % 2 ? 8 : -6), y - i * h, w, h, BOOKCOL[i % BOOKCOL.length]); return y - n * h; };
// a plank resting on the right edge of a stack (its top-right corner at (px, py)) and running down to the floor at x2.
// Returns its slope angle and a point-on-surface function.
const plankOnStack = (c: Ctx, px: number, py: number, x2: number, floorY: number, overhang = 90, t = 24) => {
  const y2 = floorY - t, surfY = py - t - 2, slope = (y2 - surfY) / (x2 - px), x1 = px - overhang, y1 = surfY - slope * overhang;
  const an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an) * t, ny = Math.cos(an) * t;
  shape(c, () => polyP(c, [[x1, y1], [x2, y2], [x2 + nx, y2 + ny], [x1 + nx, y1 + ny]]), COL.wood);
  shape(c, () => polyP(c, [[x1 + nx * 0.6, y1 + ny * 0.6], [x2 + nx * 0.6, y2 + ny * 0.6], [x2 + nx, y2 + ny], [x1 + nx, y1 + ny]]), COL.woodDk, 0);
  return { an, pt: (u: number): [number, number] => [x1 + (x2 - x1) * u, y1 + (y2 - y1) * u] };
};
// a phone showing a stopwatch, centre (x, y)
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.16), COL.black, 5);
  shape(c, () => rrect(c, x - w / 2 + 6, y - h / 2 + 16, w - 12, h - 32, 6), "#22303a", 0);
  const dh = w * 0.3; write(c, "0", x - w * 0.42, y - h * 0.22, dh, "#c9f06b", 5);
  for (const dy of [-dh * 0.3, dh * 0.3]) shape(c, () => ell(c, x - w * 0.12, y - h * 0.22 + dh / 2 + dy, 3.5, 3.5), "#c9f06b", 0);
  write(c, "00", x - w * 0.04, y - h * 0.22, dh, "#c9f06b", 5);
  shape(c, () => ell(c, x, y + h * 0.28, w * 0.16, w * 0.16), RED, 4);
};
// a wooden ruler standing on the floor, bottom-left at (x, y), cmPx pixels per centimetre, nCm long; returns its top
const rulerUp = (c: Ctx, x: number, y: number, cmPx: number, nCm: number) => {
  shape(c, () => rrect(c, x, y - nCm * cmPx - 10, 56, nCm * cmPx + 10, 4), COL.wood);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let i = 0; i <= nCm; i++) { const yy = y - i * cmPx, l = i % 5 === 0 ? 26 : 14; c.lineWidth = i % 5 === 0 ? 3.5 : 2.5; c.beginPath(); c.moveTo(x + 56, yy); c.lineTo(x + 56 - l, yy); c.stroke(); if (i % 5 === 0 && i) write(c, String(i), x + 4, yy - 9, 18, INK, 3); }
  return y - nCm * cmPx - 10;
};
// a trolley bag standing on its wheels, bottom centre (x, y); full = stuffed, with books and a rice bag showing at the top
const trolley = (c: Ctx, x: number, y: number, w: number, h: number, full = false) => {
  shadow(c, x + 14, y + 4, w * 0.6, 14);
  const top = y - 24 - h;
  for (const hx of [x - w * 0.22, x + w * 0.22]) shape(c, () => rrect(c, hx - 7, top - 170, 14, 176, 5), COL.steelDk, 4);
  shape(c, () => rrect(c, x - w * 0.22 - 14, top - 190, w * 0.44 + 28, 30, 10), COL.black, 5);
  if (full) { bookFlat(c, x - w * 0.42, top + 12, w * 0.36, 40, COL.red); bookFlat(c, x - w * 0.36, top - 28, w * 0.36, 40, COL.green); shape(c, () => rrect(c, x + w * 0.04, top - 46, w * 0.36, 70, 10), COL.cloth, 5); line(c, [[x + w * 0.09, top - 30], [x + w * 0.34, top - 30]], 4, COL.orange); line(c, [[x + w * 0.09, top - 12], [x + w * 0.34, top - 12]], 4, COL.orange); }
  const body = () => rrect(c, x - w / 2 - (full ? 10 : 0), top, w + (full ? 20 : 0), h, 22);
  shape(c, body, COL.purple); shade(c, body, "#6e52a8", w * 0.08, 0);
  shape(c, () => rrect(c, x - w * 0.34, top + h * 0.3, w * 0.68, h * 0.4, 14), "#9b7fd6", 4);
  line(c, [[x - w / 2 + 10, top + h * 0.16], [x + w / 2 - 10, top + h * 0.16]], 4, INK);
  for (const wx of [x - w * 0.36, x + w * 0.36]) shape(c, () => ell(c, wx, y - 14, 15, 15), COL.black, 4);
};
const cushion = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 16, y + h / 2 + 4, w * 0.5, 12);
  const p = () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.4);
  shape(c, p, COL.pink); shade(c, p, "#d97a98", w * 0.05, h * 0.2);
  for (const dx of [-w * 0.25, 0, w * 0.25]) shape(c, () => ell(c, x + dx, y, 6, 6), "#d97a98", 0);
};
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.2);
  c.beginPath(); c.arc(x - r * 0.15, y, r * 0.8, -1.1, 1.1); c.strokeStyle = COL.red; c.lineWidth = 5; c.stroke();
  shine(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.25, y - r * 0.65]], 7);
};
// a bathroom scale, platform top at y - 36, centre x; the front window shows the reading
const bathScale = (c: Ctx, x: number, y: number, w: number, reading: string) => {
  shadow(c, x + 12, y + 4, w * 0.55, 12);
  shape(c, () => rrect(c, x - w / 2, y - 36, w, 36, 8), COL.steel); shade(c, () => rrect(c, x - w / 2, y - 36, w, 36, 8), COL.steelDk, 0, 16);
  shape(c, () => rrect(c, x - 56, y - 32, 112, 26, 5), WHITE, 4); write(c, reading, x - 20, y - 29, 20, INK, 4);
};
// a toy car seen from the side, wheels on (x, y), nose towards dir
const toyCar = (c: Ctx, x: number, y: number, w: number, dir: 1 | -1 = 1, rot = 0, col = COL.red) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(dir, 1);
  const r = w * 0.13;
  if (!rot) shadow(c, 0, 4, w * 0.55, w * 0.05);
  shape(c, () => rrect(c, -w / 2, -r - w * 0.2, w, w * 0.2 + r * 0.5, 8), col);
  shape(c, () => polyP(c, [[-w * 0.32, -r - w * 0.2], [-w * 0.2, -r - w * 0.4], [w * 0.14, -r - w * 0.4], [w * 0.3, -r - w * 0.2]]), col);
  shape(c, () => polyP(c, [[-w * 0.25, -r - w * 0.21], [-w * 0.16, -r - w * 0.36], [w * 0.1, -r - w * 0.36], [w * 0.22, -r - w * 0.21]]), COL.sky, 4);
  for (const wx of [-w * 0.3, w * 0.3]) { shape(c, () => ell(c, wx, -r, r, r), COL.black); shape(c, () => ell(c, wx, -r, r * 0.45, r * 0.45), COL.grey, 4); }
  c.restore();
};
const towel = (c: Ctx, x0: number, x1: number, y: number, h: number) => {
  shape(c, () => rrect(c, x0, y - h, x1 - x0, h, h * 0.3), "#f3b58d");
  c.strokeStyle = "#d9895c"; c.lineWidth = 5; for (const yy of [y - h * 0.7, y - h * 0.3]) { c.beginPath(); c.moveTo(x0 + 14, yy); c.lineTo(x1 - 14, yy); c.stroke(); }
};
// a pencil, its point at (x, y), lying at angle an
const pencil = (c: Ctx, x: number, y: number, an: number, len = 200) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, 30, -10, len, 20, 3), COL.yellow, 4); shape(c, () => polyP(c, [[0, 0], [30, -10], [30, 10]]), COL.wood, 4); shape(c, () => polyP(c, [[0, 0], [10, -3.5], [10, 3.5]]), INK, 0); c.restore(); };
// a measuring jug held by its handle: the hand grips at (hx, hy), the jug tilts by an; level = world height of the water
// surface relative to the hand. Returns the spout point.
const jugPath = (c: Ctx, w: number, h: number) => { c.moveTo(70, -h * 0.6); c.lineTo(70 + w, -h * 0.6); c.lineTo(70 + w * 0.92, h * 0.4); c.lineTo(70 + w * 0.08, h * 0.4); c.closePath(); };
const jug = (c: Ctx, hx: number, hy: number, w: number, h: number, an: number, level: number): [number, number] => {
  c.save(); c.translate(hx, hy); c.rotate(an);
  const handle = () => { c.beginPath(); c.moveTo(72, -h * 0.42); c.bezierCurveTo(16, -h * 0.46, 16, h * 0.32, 72, h * 0.26); };
  handle(); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke(); handle(); c.strokeStyle = COL.glassEdge; c.lineWidth = 12; c.stroke();
  c.beginPath(); jugPath(c, w, h); c.fillStyle = COL.glass; c.fill();
  c.save(); c.beginPath(); jugPath(c, w, h); c.clip(); c.rotate(-an); c.fillStyle = COL.water; c.fillRect(-900, level, 1800, 1800); c.restore();
  c.beginPath(); jugPath(c, w, h); c.lineWidth = 6; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
  shape(c, () => polyP(c, [[70 + w - 14, -h * 0.6], [70 + w + 22, -h * 0.66], [70 + w + 4, -h * 0.5]]), COL.glass, 5);
  c.strokeStyle = INK; c.lineWidth = 3; for (let k = 1; k <= 4; k++) { const yy = h * 0.4 - k * h * 0.2; c.beginPath(); c.moveTo(70 + w * 0.9 - 30, yy); c.lineTo(70 + w * 0.9, yy); c.stroke(); }
  write(c, "100 ml", 70 + w * 0.2, -16, 30, INK, 4);
  c.restore();
  const sx = 70 + w + 22, sy = -h * 0.66;
  return [hx + Math.cos(an) * sx - Math.sin(an) * sy, hy + Math.sin(an) * sx + Math.cos(an) * sy];
};
// a sack of rice, top centre (x, y)
const sack = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const p = () => { c.moveTo(x - w * 0.3, y); c.lineTo(x + w * 0.3, y); c.quadraticCurveTo(x + w * 0.55, y + h * 0.3, x + w * 0.5, y + h); c.lineTo(x - w * 0.5, y + h); c.quadraticCurveTo(x - w * 0.55, y + h * 0.3, x - w * 0.3, y); c.closePath(); };
  shape(c, p, COL.cloth); shade(c, p, "#d8cfbb", w * 0.1, 0);
  line(c, [[x - w * 0.3, y + 10], [x + w * 0.3, y + 10]], 5, COL.brown);
  for (let k = 0; k < 3; k++) line(c, [[x - w * 0.3, y + h * 0.35 + k * h * 0.17], [x + w * 0.3, y + h * 0.35 + k * h * 0.17]], 4, COL.orange);
};
// a lorry seen from the side, wheels on (x, y), cab to the right; sacks piled on the back when loaded
const lorry = (c: Ctx, x: number, y: number, w: number, loaded: boolean) => {
  const r = w * 0.08;
  shape(c, () => rrect(c, x - w / 2, y - r - w * 0.16, w * 0.68, 60, 6), COL.steelDk);
  if (loaded) for (let row = 0; row < 3; row++) for (let k = 0; k < 4 - (row === 2 ? 1 : 0); k++) { const sx = x - w / 2 + w * 0.09 + k * w * 0.158 + (row % 2) * w * 0.05, sy = y - r - w * 0.16 - w * 0.12 - row * w * 0.105; const p = () => rrect(c, sx - w * 0.08, sy, w * 0.16, w * 0.12, w * 0.03); shape(c, p, COL.cloth); shade(c, p, "#d8cfbb", 14, 0); line(c, [[sx - w * 0.04, sy + w * 0.06], [sx + w * 0.04, sy + w * 0.06]], 4, COL.orange); }
  shape(c, () => rrect(c, x - w / 2, y - r - w * 0.08, w * 0.68, w * 0.13, 6), COL.orange);
  shape(c, () => rrect(c, x + w * 0.18, y - r - w * 0.29, w * 0.32, w * 0.34, 14), COL.red);
  shape(c, () => rrect(c, x + w * 0.24, y - r - w * 0.26, w * 0.22, w * 0.13, 8), COL.sky, 4);
  for (const wx of [x - w * 0.32, x - w * 0.08, x + w * 0.32]) { shape(c, () => ell(c, wx, y - r, r, r), COL.black); shape(c, () => ell(c, wx, y - r, r * 0.45, r * 0.45), COL.grey, 4); }
};

// ------------------------------------------------------------ the table scene of experiment e1
const TX0 = 40, TX1 = 740, TY = 620;
const e1Scene = (c: Ctx, truckX: number, nBot: number, bagKnotY: number, bagFill: number, opts: { book?: boolean; startTape?: boolean; extra?: (tow: [number, number]) => void } = {}) => {
  ground(c); c.save(); c.translate(-80, -250); c.scale(1.25, 1.25); floor(c);
  table(c, TX0, TX1, TY);
  if (opts.startTape) tape(c, truckX - 118, TY - 5, 30, 12);
  if (opts.book) bookFlat(c, 672, TY, 68, 58, COL.green);
  const tow = truck(c, truckX, TY, 230, nBot);
  penEdge(c, TX1, TY);
  threadOverPen(c, tow, TX1, TY, bagKnotY);
  bag(c, TX1, bagKnotY, 130, bagFill);
  if (opts.extra) opts.extra(tow);
  c.restore();
};

// setup.e1.0 · pen taped at the edge, truck with two bottles at the start line, thread over the pen to the bag
const e1s0 = (c: Ctx) => { e1Scene(c, 300, 2, 760, 0.6, { startTape: true }); };
// setup.e1.1 · a measuring jug pours 100 ml into the bag tied to the thread
const e1s1 = (c: Ctx) => {
  ground(c);
  // the bag hangs open from the thread by its two handles
  const bx = 630, by = 700;
  line(c, [[bx, 0], [bx, by - 70]], 4);
  const pouch = () => { c.moveTo(bx - 120, by); c.bezierCurveTo(bx - 150, by + 120, bx - 110, by + 300, bx, by + 300); c.bezierCurveTo(bx + 110, by + 300, bx + 150, by + 120, bx + 120, by); c.closePath(); };
  shape(c, pouch, "rgba(232,241,250,0.85)", 0);
  c.save(); c.beginPath(); pouch(); c.clip(); c.fillStyle = COL.water; c.fillRect(bx - 200, by + 200, 400, 200); c.restore();
  shape(c, pouch, "rgba(0,0,0,0)", 5);
  shape(c, () => ell(c, bx, by, 120, 30), "#dbe7f3", 5);
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(bx + s * 70, by - 6); c.quadraticCurveTo(bx + s * 40, by - 90, bx, by - 70); c.strokeStyle = INK; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); }
  shape(c, () => ell(c, bx, by - 72, 14, 10), "#dbe7f3", 4);
  // the grown-up's hand on the jug handle, the jug tilted so the spout sits over the bag mouth
  const hx = 300, hy = 300, an = 0.62;
  const spout = jug(c, hx, hy, 230, 240, an, 40);
  hand(c, hx, hy, an, 1.35, SKIN.adult, CLOTH.adult);
  line(c, [spout, [spout[0] + 6, by - 12]], 14, COL.water); shape(c, () => ell(c, spout[0] + 6, by + 6, 60, 16), COL.drop, 0);
  arrow(c, [[hx - 90, hy - 40], [hx - 70, hy + 60], [hx + 10, hy + 130]], RED, 9);
};
// setup.e1.2 · the child holds the truck at the start line; the grown-up holds up a phone stopwatch
const e1s2 = (c: Ctx) => {
  ground(c); floor(c);
  const kid = person(c, 330, FLOOR, 680, { reachR: [538, 522] });
  table(c, TX0, TX1, TY);
  tape(c, 352, TY - 5, 30, 12);
  const tow = truck(c, 470, TY, 200, 2);
  penEdge(c, TX1, TY);
  threadOverPen(c, tow, TX1, TY, 760);
  bag(c, TX1, 760, 130, 0.6);
  shape(c, () => ell(c, kid.handR[0], kid.handR[1], 22, 14), SKIN.child, 4);
  const ad = person(c, 920, FLOOR, 800, { adult: true, reachL: [769, 426] });
  phone(c, ad.handL[0], ad.handL[1] - 56, 84, 150);
};
// setup.e1.3 · the truck arrives at the thick book; the bag is halfway down
const e1s3 = (c: Ctx) => {
  e1Scene(c, 556, 2, 740, 0.6, { book: true, extra: () => { for (const [dx, dy] of [[-26, -30], [0, -40], [26, -30]]) line(c, [[676, TY - 70], [676 + dx, TY - 70 + dy]], 5, RED); } });
};
// setup.e1.4 · the notebook: a table of times and two bar charts
const e1s4 = (c: Ctx) => {
  ground(c, "#d9cdb3");
  shape(c, () => rrect(c, 70, 40, 940, 1000, 14), COL.paper);
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, 130 + i * 76, 44, 12, 12), COL.steel, 4);
  c.strokeStyle = "#cfd8e6"; c.lineWidth = 2; for (let y = 140; y < 1030; y += 44) { c.beginPath(); c.moveTo(90, y); c.lineTo(990, y); c.stroke(); }
  // the table: bags across the top and the times under them, then loads and their times
  const gx = 150, gy = 90, cw = 190, rh = 90;
  c.strokeStyle = INK; c.lineWidth = 4;
  for (let r = 0; r <= 4; r++) { c.beginPath(); c.moveTo(gx, gy + r * rh); c.lineTo(gx + 4 * cw, gy + r * rh); c.stroke(); }
  for (let k = 0; k <= 4; k++) { c.beginPath(); c.moveTo(gx + k * cw, gy); c.lineTo(gx + k * cw, gy + 4 * rh); c.stroke(); }
  const clock = (x: number, y: number) => { shape(c, () => ell(c, x, y, 30, 30), COL.sky, 4); shape(c, () => ell(c, x, y, 6, 6), INK, 0); line(c, [[x, y], [x, y - 20]], 4); line(c, [[x, y], [x + 14, y + 8]], 4); };
  for (let k = 0; k < 3; k++) {
    const cx = gx + cw * (k + 1.5);
    for (let b = 0; b <= k; b++) bag(c, cx - k * 16 + b * 32, gy + 14, 56, 0.7);
    write(c, ["4", "3", "2"][k], cx - 20, gy + rh + 16, 56, INK, 7);
    for (let b = 0; b <= k; b++) bottle(c, cx - k * 16 + b * 32, gy + 3 * rh - 10, 64, 0.9);
    write(c, ["2", "3", "4"][k], cx - 20, gy + 3 * rh + 16, 56, INK, 7);
  }
  clock(gx + cw / 2, gy + rh * 1.5); clock(gx + cw / 2, gy + rh * 3.5);
  // two bar charts below: more water, shorter times; more load, longer times
  const chart = (x0: number, y0: number, heads: (k: number, hx: number) => void, vals: number[], col: string) => {
    line(c, [[x0, y0 - 300], [x0, y0], [x0 + 360, y0]], 5);
    vals.forEach((v, k) => { const bx = x0 + 50 + k * 110; shape(c, () => rrect(c, bx, y0 - v * 60, 70, v * 60, 4), col, 4); heads(k, bx + 35); write(c, String(v), bx + 14, y0 - v * 60 - 46, 36, INK, 5); });
  };
  chart(160, 940, (k, hx) => { for (let b = 0; b <= k; b++) bag(c, hx - k * 14 + b * 28, 950, 46, 0.7); }, [4, 3, 2], COL.water);
  chart(600, 940, (k, hx) => { for (let b = 0; b <= k; b++) bottle(c, hx - k * 14 + b * 28, 1010, 54, 0.9); }, [2, 3, 4], COL.orange);
};

// ------------------------------------------------------------ the ramp of experiment e2
const CM = 12;
const ramp = (c: Ctx, heightCm: number, nBot: number, truckT: number, nCm: number, withRuler = true) => {
  ground(c); if (withRuler) { c.translate(0, -300); c.scale(1.3, 1.3); } floor(c);
  const stackX = 190, n = Math.round((heightCm * CM) / 36), top = books(c, stackX, FLOOR, n, 240, (heightCm * CM) / n);
  const { an, pt } = plankOnStack(c, stackX + 114, top, 800, FLOOR);
  tape(c, ...pt(0.04), 26, 10, an); tape(c, ...pt(0.9), 26, 10, an);
  const tp = pt(truckT); truck(c, tp[0], tp[1], 220, nBot, 1, an);
  if (withRuler) { const rt = rulerUp(c, 8, FLOOR, CM, nCm); line(c, [[0, top], [70, top]], 4, RED); write(c, heightCm + " cm", 10, Math.min(rt, pt(0)[1]) - 70, 40, RED, 6); }
  return { an, pt };
};
// setup.e2.0 · the board on a 12 cm stack, ruler beside it, truck at the top line
const e2s0 = (c: Ctx) => { ramp(c, 12, 0, 0.12, 15); };
// setup.e2.1 · the truck rolls down towards the finish tape; the grown-up times it
const e2s1 = (c: Ctx) => {
  const { pt } = ramp(c, 12, 0, 0.45, 15, false);
  const a = pt(0.56), b = pt(0.8); arrow(c, [[a[0], a[1] - 90], [b[0], b[1] - 90]], RED, 10);
  const ad = person(c, 940, FLOOR, 760, { adult: true, reachL: [794, 455] });
  phone(c, ad.handL[0], ad.handL[1] - 54, 80, 142);
};
// setup.e2.2 · a 24 cm stack, and the truck loaded with three bottles
const e2s2 = (c: Ctx) => { ramp(c, 24, 3, 0.14, 27); };

// ------------------------------------------------------------ activity a1: the trolley bag
const pushBag = (c: Ctx, full: boolean, arrowLen: number) => {
  ground(c); tiles(c, 560);
  const kid = person(c, 360, FLOOR, 680, { reachR: [566, 700] });
  trolley(c, 690, FLOOR, 230, 300, full);
  shape(c, () => ell(c, kid.handR[0] + 4, kid.handR[1], 14, 24), SKIN.child, 4);
  arrow(c, [[820, 760], [820 + arrowLen, 760]], RED, 10);
};
const a1s0 = (c: Ctx) => pushBag(c, false, 200);
// setup.a1.1 · the grown-up lowers a sack of rice into the open bag, books already inside
const a1s1 = (c: Ctx) => {
  ground(c); tiles(c, 560);
  shape(c, () => rrect(c, 540, 580, 380, 290, 22), "#6e52a8"); shape(c, () => rrect(c, 580, 620, 300, 210, 14), "#9b7fd6", 4);
  const ad = person(c, 730, FLOOR, 820, { adult: true, reachL: [612, 650], reachR: [848, 650] });
  sack(c, 730, ad.handL[1] - 12, 400, 180);
  for (const h of [ad.handL, ad.handR]) shape(c, () => ell(c, h[0], h[1], 22, 16), SKIN.adult, 4);
  for (const ax of [500, 960]) arrow(c, [[ax, 700], [ax, 830]], RED, 9);
  bookFlat(c, 560, 870, 150, 34, COL.red); bookFlat(c, 570, 836, 150, 34, COL.blue);
  shape(c, () => rrect(c, 520, 860, 420, 140, 22), COL.purple); shade(c, () => rrect(c, 520, 860, 420, 140, 22), "#6e52a8", 0, 50);
  shape(c, () => ell(c, 960, 980, 15, 15), COL.black, 4); shape(c, () => ell(c, 960, 900, 15, 15), COL.black, 4);
};
const a1s2 = (c: Ctx) => pushBag(c, true, 40);

// ------------------------------------------------------------ activity a2: book and paper
// a hardback seen edge on, with a sheet of paper lying on it; (x, y) = the centre of its underside
const bookPaper = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => rrect(c, x - w / 2, y - 26, w, 26, 4), COL.blue); shape(c, () => rrect(c, x - w / 2 + 6, y - 20, w - 12, 12, 2), COL.paper, 2);
  shape(c, () => rrect(c, x - w / 2 + 20, y - 34, w - 40, 8, 2), WHITE, 3);
};
const a2s0 = (c: Ctx) => {
  ground(c); floor(c, 900);
  const kid = person(c, 540, 900, 680, { reachL: [368, 560], reachR: [712, 560] });
  bookPaper(c, 540, kid.handL[1] - 8, 380);
  cushion(c, 540, 985, 380, 90);
};
const a2s1 = (c: Ctx) => {
  ground(c); floor(c, 900);
  person(c, 540, 900, 680, { reachL: [360, 500], reachR: [720, 500] });
  cushion(c, 540, 985, 380, 90);
  bookPaper(c, 540, 790, 320);
  arrow(c, [[540, 810], [540, 900]], RED, 9);
  for (const dx of [-120, 120]) line(c, [[540 + dx, 650], [540 + dx, 730]], 5, COL.greyDk);
};
const a2s2 = (c: Ctx) => {
  ground(c); floor(c, 900);
  const kid = person(c, 540, 900, 680, { reachL: [356, 560], reachR: [724, 560] });
  bottle(c, kid.handL[0] - 80, kid.handL[1], 160, 0, Math.PI / 2);
  bottle(c, kid.handR[0] - 80, kid.handR[1], 160, 0.95, Math.PI / 2);
  for (const h of [kid.handL, kid.handR]) shape(c, () => ell(c, h[0], h[1], 24, 20), SKIN.child, 4);
  cushion(c, 540, 985, 500, 90);
};

// ------------------------------------------------------------ activity a3: soft hands
const a3s0 = (c: Ctx) => {
  ground(c); floor(c);
  const kid = person(c, 540, FLOOR, 680, { reachL: [436, 775], reachR: [644, 775] });
  ball(c, 540, kid.handL[1] - 30, 74);
  dashes(c, 300, 560, 1, 3, 60); arrow(c, [[320, 620], [450, 720]], RED, 8);
};
// hands drawn back to the chest: elbows down and out, forearms up and in
const CHEST = { armL: [1.92, -0.52] as [number, number], armR: [1.22, 3.67] as [number, number] };
const a3s1 = (c: Ctx) => {
  ground(c); floor(c);
  const kid = person(c, 540, FLOOR, 680, CHEST);
  ball(c, (kid.handL[0] + kid.handR[0]) / 2, kid.handL[1] - 24, 54);
  for (const h of [kid.handL, kid.handR]) shape(c, () => ell(c, h[0], h[1], 22, 18), SKIN.child, 4);
  dashes(c, 280, 560, 1, 3, 60); arrow(c, [[300, 620], [470, 620]], RED, 8);
  for (const s of [-1, 1]) arrow(c, [[540 + s * 200, 760], [540 + s * 120, 680]], COL.blueDk, 7);
};

// ------------------------------------------------------------ activity a4: the lift scale
const a4s0 = (c: Ctx) => {
  ground(c); floor(c);
  bathScale(c, 440, FLOOR, 320, "25");
  person(c, 440, FLOOR - 36, 680, {});
  shape(c, () => rrect(c, 740, 900, 200, 90, 4), COL.paper, 4); line(c, [[770, 930], [910, 930]], 3, COL.grey); line(c, [[770, 955], [880, 955]], 3, COL.grey);
  pencil(c, 760, 890, -0.45);
};
const liftRoom = (c: Ctx) => {
  c.fillStyle = COL.steel; c.fillRect(0, 0, D, D);
  c.fillStyle = COL.steelIn; c.fillRect(60, 0, 960, FLOOR);
  c.strokeStyle = COL.steelDk; c.lineWidth = 3; for (const x of [300, 540, 780]) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, FLOOR); c.stroke(); }
  shape(c, () => rrect(c, 0, 0, 60, D, 0), COL.steelDk, 4); shape(c, () => rrect(c, 1020, 0, 60, D, 0), COL.steelDk, 4);
  c.fillStyle = "#8f98a6"; c.fillRect(60, FLOOR, 960, D - FLOOR); line(c, [[60, FLOOR], [1020, FLOOR]], 5);
  for (const x of [140, 940]) shape(c, () => rrect(c, x - 10, 590, 20, 24, 4), COL.steelDk, 4);
  shape(c, () => rrect(c, 110, 582, 860, 22, 11), COL.steelDk, 5);
};
const liftScene = (c: Ctx, reading: string) => {
  liftRoom(c);
  bathScale(c, 400, FLOOR, 300, reading);
  const kid = person(c, 400, FLOOR - 36, 680, { reachR: [560, 594] });
  shape(c, () => ell(c, kid.handR[0], kid.handR[1], 22, 20), SKIN.child, 4);
  person(c, 790, FLOOR, 840, { adult: true });
};
const a4s1 = (c: Ctx) => liftScene(c, "25");
const a4s2 = (c: Ctx) => {
  ground(c);
  const cx = 480, cy = 560, R = 380;
  shadow(c, cx + 20, cy + 30, R, R); shape(c, () => ell(c, cx, cy, R, R), COL.steel); shape(c, () => ell(c, cx, cy, R * 0.88, R * 0.88), WHITE, 5);
  const ang = (v: number) => -Math.PI * 1.25 + (v / 60) * Math.PI * 1.5;
  for (let v = 0; v <= 60; v += 1) { const a = ang(v), l = v % 10 === 0 ? 40 : v % 5 === 0 ? 26 : 14; line(c, [[cx + Math.cos(a) * R * 0.84, cy + Math.sin(a) * R * 0.84], [cx + Math.cos(a) * (R * 0.84 - l), cy + Math.sin(a) * (R * 0.84 - l)]], v % 5 === 0 ? 5 : 3); }
  for (let v = 0; v <= 60; v += 10) { const a = ang(v), s = String(v); write(c, s, cx + Math.cos(a) * R * 0.68 - s.length * 16, cy + Math.sin(a) * R * 0.68 - 22, 44, INK, 5); }
  const needle = (v: number, col: string, w: number) => { const a = ang(v); line(c, [[cx - Math.cos(a) * 50, cy - Math.sin(a) * 50], [cx + Math.cos(a) * R * 0.52, cy + Math.sin(a) * R * 0.52]], w, col); };
  needle(25, COL.grey, 8); needle(29, RED, 10);
  shape(c, () => ell(c, cx, cy, 22, 22), INK, 0);
  // the lift starting to go up
  shape(c, () => rrect(c, 900, 760, 130, 170, 8), COL.steelDk, 5); line(c, [[965, 764], [965, 926]], 4);
  arrow(c, [[965, 720], [965, 560]], RED, 12);
};

// ------------------------------------------------------------ project p1: the brake zone
const brakeZone = (c: Ctx, carT: number | null, onTowelX: number | null) => {
  ground(c); c.translate(-60, -150); c.scale(1.15, 1.15); floor(c);
  const top = books(c, 180, FLOOR, 7);
  const { an, pt } = plankOnStack(c, 294, top, 640, FLOOR);
  towel(c, 640, 890, FLOOR, 28); tape(c, 652, FLOOR - 30, 14, 30);
  if (carT !== null) { const p = pt(carT); toyCar(c, p[0], p[1], 180, 1, an); }
  if (onTowelX !== null) { toyCar(c, onTowelX, FLOOR - 28, 180); dashes(c, onTowelX - 100, FLOOR - 90, 1, 3, 50); arrow(c, [[onTowelX + 100, FLOOR - 160], [onTowelX + 200, FLOOR - 160]], RED, 10); }
};
const p1s0 = (c: Ctx) => brakeZone(c, 0.1, null);
const p1s1 = (c: Ctx) => brakeZone(c, null, 740);
// setup.p1.2 · close up: the ruler lies on the towel from the tape line to the front of the stopped car
const p1s2 = (c: Ctx) => {
  ground(c); towel(c, -40, 1120, 1000, 420);
  tape(c, 180, 640, 20, 100); line(c, [[180, 690], [180, 960]], 4, "#d9895c");
  toyCar(c, 760, 760, 240);
  line(c, [[880, 770], [880, 850]], 4, COL.greyDk);
  shape(c, () => rrect(c, 170, 860, 740, 56, 4), COL.wood);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let i = 0; i <= 35; i++) { const x = 180 + i * 20, l = i % 5 === 0 ? 24 : 12; c.lineWidth = i % 5 === 0 ? 3.5 : 2.5; c.beginPath(); c.moveTo(x, 860); c.lineTo(x, 860 + l); c.stroke(); if (i % 5 === 0) write(c, String(i), x - 8, 888, 20, INK, 3); }
  line(c, [[880, 930], [880, 980]], 7, INK);
  pencil(c, 560, 970, 0.08);
};

// ------------------------------------------------------------ card pictures
// flow.e1 · the pull along the thread and the load on the cart
const flowE1 = (c: Ctx) => {
  e1Scene(c, 330, 1, 760, 0.7, { extra: (tow) => { arrow(c, [[tow[0] + 10, tow[1] - 44], [tow[0] + 170, tow[1] - 44]], RED, 11); arrow(c, [[295, 320], [295, 430]], RED, 11); } });
};
// flow.e2 · the same slope twice: an empty truck and a loaded one, the same way down
const flowE2 = (c: Ctx) => {
  ground(c);
  for (const [k, nBot] of [[0, 0], [1, 3]] as number[][]) {
    c.save(); c.translate(0, k * 540);
    c.fillStyle = "#e3d6bd"; c.fillRect(0, 480, D, 60); line(c, [[0, 480], [D, 480]], 5);
    const top = books(c, 150, 480, 5, 160, 26);
    const { an, pt } = plankOnStack(c, 228, top, 800, 480, 70, 20);
    const tp = pt(0.2); truck(c, tp[0], tp[1], 180, nBot, 1, an);
    const a = pt(0.45), b = pt(0.72); arrow(c, [[a[0], a[1] - 70], [b[0], b[1] - 70]], RED, 10);
    c.restore();
  }
};
// flow.a1 · a hand pushes an empty bag (it rolls far) and a full one (it hardly moves)
const flowA1 = (c: Ctx) => {
  ground(c);
  for (const [k, full, len] of [[0, 0, 300], [1, 1, 50]] as number[][]) {
    c.save(); c.translate(0, k * 540);
    tiles(c, 260, 540);
    trolley(c, 420, 500, 200, 250, !!full);
    hand(c, 220, 400, 0, 1, SKIN.child, CLOTH.child, true);
    arrow(c, [[530, 400], [530 + len, 400]], RED, 10);
    c.restore();
  }
};
// flow.a2 · a sheet of paper drifts down slowly; the paper on a book falls straight with it
const flowA2 = (c: Ctx) => {
  ground(c); floor(c, 900);
  cushion(c, 280, 960, 300, 80); cushion(c, 800, 960, 300, 80);
  c.setLineDash([14, 14]); line(c, [[300, 160], [200, 330], [360, 500], [230, 680]], 5, COL.greyDk); c.setLineDash([]);
  c.save(); c.translate(230, 680); c.rotate(-0.35); shape(c, () => rrect(c, -90, -8, 180, 16, 3), WHITE, 4); c.restore();
  for (const dx of [-60, 0, 60]) arrow(c, [[230 + dx, 800], [230 + dx, 730]], COL.blueDk, 5);
  c.setLineDash([14, 14]); line(c, [[800, 160], [800, 560]], 5, COL.greyDk); c.setLineDash([]);
  bookPaper(c, 800, 620, 280);
  arrow(c, [[800, 660], [800, 860]], RED, 10);
};
// flow.a3 · soft hands: the ball arrives, the hands draw back towards the chest
const flowA3 = (c: Ctx) => {
  ground(c); floor(c);
  const kid = person(c, 540, FLOOR, 680, CHEST);
  ball(c, (kid.handL[0] + kid.handR[0]) / 2, kid.handL[1] - 24, 54);
  for (const h of [kid.handL, kid.handR]) shape(c, () => ell(c, h[0], h[1], 22, 18), SKIN.child, 4);
  dashes(c, 280, 560, 1, 3, 60); arrow(c, [[300, 620], [470, 620]], RED, 8);
  for (const s of [-1, 1]) arrow(c, [[540 + s * 200, 760], [540 + s * 120, 680]], COL.blueDk, 7);
};
// flow.a4 · the lift starts up: the scale reads more
const flowA4 = (c: Ctx) => { liftScene(c, "29"); arrow(c, [[1050, 700], [1050, 380]], RED, 14); };
// flow.p1 · from a low ramp the car stops soon; from a high one it goes far along the towel
const flowP1 = (c: Ctx) => {
  ground(c);
  for (const [k, nBooks, carX] of [[0, 2, 660], [1, 6, 940]] as number[][]) {
    c.save(); c.translate(0, k * 540);
    c.fillStyle = "#e3d6bd"; c.fillRect(0, 480, D, 60); line(c, [[0, 480], [D, 480]], 5);
    const top = books(c, 130, 480, nBooks, 160, 26);
    plankOnStack(c, 208, top, 520, 480, 60, 20);
    towel(c, 520, 1060, 480, 20); tape(c, 530, 468, 12, 24);
    toyCar(c, carX, 460, 140);
    arrow(c, [[536, 372], [carX + 70, 372]], RED, 8); line(c, [[carX + 70, 360], [carX + 70, 400]], 5);
    c.restore();
  }
};
// term.16 · thrust: a rocket lifting off, flame below, the push upwards
const termRocket = (c: Ctx) => {
  c.fillStyle = "#1f2a4d"; c.fillRect(0, 0, D, D);
  for (let i = 0; i < 40; i++) { const x = (i * 263) % D, y = (i * 157) % 700; shape(c, () => ell(c, x, y, 3, 3), WHITE, 0); }
  c.fillStyle = "#6e6a62"; c.fillRect(0, 960, D, 120);
  const x = 500;
  shape(c, () => polyP(c, [[x - 80, 520], [x - 170, 700], [x - 80, 680]]), COL.red); shape(c, () => polyP(c, [[x + 80, 520], [x + 170, 700], [x + 80, 680]]), COL.red);
  shape(c, () => { c.moveTo(x - 80, 700); c.lineTo(x - 80, 300); c.quadraticCurveTo(x, 60, x + 80, 300); c.lineTo(x + 80, 700); c.closePath(); }, WHITE);
  shape(c, () => { c.moveTo(x - 80, 300); c.quadraticCurveTo(x, 60, x + 80, 300); c.closePath(); }, COL.red, 5);
  shape(c, () => ell(c, x, 420, 40, 40), COL.sky, 5);
  shape(c, () => polyP(c, [[x - 60, 700], [x + 60, 700], [x + 80, 740], [x - 80, 740]]), COL.greyDk);
  shape(c, () => { c.moveTo(x - 70, 740); c.quadraticCurveTo(x - 90, 860, x, 960); c.quadraticCurveTo(x + 90, 860, x + 70, 740); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(x - 36, 740); c.quadraticCurveTo(x - 40, 820, x, 880); c.quadraticCurveTo(x + 40, 820, x + 36, 740); c.closePath(); }, COL.yellow, 0);
  arrow(c, [[860, 760], [860, 360]], RED, 14);
};
// term.13 · load: a lorry carrying sacks of rice, piled high, under coconut palms
const termLorry = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D);
  for (const [px, ph] of [[150, 300], [960, 240]]) { line(c, [[px, 840], [px + 20, ph]], 16, COL.brown); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.5; line(c, [[px + 20, ph], [px + 20 + Math.cos(a) * 150, ph + Math.sin(a) * 150 + 40]], 14, COL.leaf); } }
  c.fillStyle = COL.green; c.fillRect(0, 760, D, 100); c.fillStyle = "#8f8a84"; c.fillRect(0, 860, D, 220); line(c, [[0, 860], [D, 860]], 5);
  lorry(c, 540, 880, 760, true);
};
// term.14 · stopping distance: a cycle and a lorry stopped on the same road, the lorry's brake mark far longer
const termStopping = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#8f8a84"; c.fillRect(0, 300, D, 780); line(c, [[0, 300], [D, 300]], 5);
  c.setLineDash([60, 40]); line(c, [[0, 690], [D, 690]], 6, WHITE); c.setLineDash([]);
  line(c, [[680, 560], [800, 560]], 14, INK);
  const cy = 560, bx = 880;
  for (const wx of [bx - 70, bx + 70]) { shape(c, () => ell(c, wx, cy, 52, 52), "rgba(0,0,0,0)", 8); shape(c, () => ell(c, wx, cy, 10, 10), INK, 0); }
  line(c, [[bx - 70, cy], [bx - 26, cy - 66], [bx + 44, cy - 66], [bx + 70, cy]], 6); line(c, [[bx - 26, cy - 66], [bx + 8, cy]], 6); line(c, [[bx + 8, cy], [bx + 70, cy]], 6);
  line(c, [[bx - 36, cy - 92], [bx - 14, cy - 66]], 6); line(c, [[bx - 58, cy - 92], [bx - 14, cy - 92]], 7); line(c, [[bx + 44, cy - 66], [bx + 56, cy - 104]], 6); line(c, [[bx + 34, cy - 104], [bx + 80, cy - 104]], 7);
  for (const yy of [920, 950]) line(c, [[60, yy], [640, yy]], 14, INK);
  lorry(c, 810, 960, 480, false);
};

export const ic_motionNewtonsLawsL4 = cards("sci.motion.newtons-laws.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, a1s0, a1s1, a1s2, a2s0, a2s1, a2s2, a3s0, a3s1, a4s0, a4s1, a4s2, p1s0, p1s1, p1s2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, termRocket, termLorry, termStopping,
]);
