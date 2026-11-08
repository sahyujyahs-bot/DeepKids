import type { Ctx } from "./core";
import { BG, COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.motion.swings-and-pendulums.L4 · set-up cards and picture cards: the Peg Test, Height and Hit,
// How Many Swings, marble in a bowl, pumping with a straw, the ruler pendulum, the swing in water,
// weighing the Earth's pull at a door frame, and the Swap Shop card game.
// Flat DeepKids look, same bag of five coins as the L3 cards; red arrows = movement; numbers only, no words.

const PI = Math.PI, FLOOR = 1030, SLAB = 340, PX = 640, PY = SLAB;
const BAG = "#dcecf7", BAGDK = "#9fc3df", PENCIL = "#f7c948", TAPE = "rgba(245,230,184,0.9)", CARD = "#cfe6f5", WALLSHEET = "#fffaf0";

// ------------------------------------------------------------------ scenery
const floorBg = (c: Ctx, y = FLOOR) => { ground(c); c.fillStyle = "#e3d4b6"; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const table = (c: Ctx, x0: number, x1: number, top = SLAB) => {
  for (const lx of [x0 + 14, x1 - 64]) {
    shadow(c, lx + 40, FLOOR + 12, 52, 9);
    shape(c, () => rrect(c, lx, top + 40, 50, FLOOR - top - 40, 6), COL.brown);
    shade(c, () => rrect(c, lx, top + 40, 50, FLOOR - top - 40, 6), COL.soilDk, -14, 0, 0.5);
  }
  shape(c, () => rrect(c, x0, top, x1 - x0, 58, 10), COL.brown);
  shade(c, () => rrect(c, x0, top, x1 - x0, 58, 10), COL.soilDk, -8, -12, 0.5);
  line(c, [[x0 + 16, top + 12], [x1 - 16, top + 12]], 4, COL.wood);
};
// a wooden ruler lying flat, its lower edge at y
const ruler = (c: Ctx, x0: number, x1: number, y = SLAB - 20) => {
  shape(c, () => rrect(c, x0, y, x1 - x0, 20, 3), COL.wood);
  for (let x = x0 + 12, k = 0; x < x1 - 6; x += 15, k++) line(c, [[x, y], [x, y + (k % 5 === 0 ? 13 : 8)]], 3);
};
const books = (c: Ctx, x0: number, x1: number, y = SLAB - 20) => {
  const tones = [COL.purple, COL.teal, COL.orange], dx = [0, 14, 4];
  tones.forEach((col, i) => {
    const by = y - 50 * (i + 1), a = x0 + dx[i], w = x1 - x0 - dx[i] - (i === 1 ? 10 : 0);
    shape(c, () => rrect(c, a, by, w, 50, 6), col);
    shape(c, () => rrect(c, a + 18, by + 9, w - 24, 32, 3), COL.paper, 3);
    line(c, [[a + 34, by + 20], [a + w - 20, by + 20]], 2, COL.grey); line(c, [[a + 34, by + 30], [a + w - 20, by + 30]], 2, COL.grey);
  });
};
// the table at the left, a ruler weighted by books sticking out over the edge; the pivot is the ruler tip (PX, PY)
const tableSet = (c: Ctx) => { floorBg(c); table(c, 40, 340); ruler(c, 250, PX); books(c, 190, 335); };
// a sheet of paper taped on the wall
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 4), WALLSHEET, 5);
  for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) { c.save(); c.translate(cx, cy); c.rotate(cx > x ? -PI / 4 : PI / 4); shape(c, () => rrect(c, -36, -12, 72, 24, 3), TAPE, 3); c.restore(); }
};
const pencilMark = (c: Ctx, x0: number, x1: number, y: number) => line(c, [[x0, y], [x1, y]], 4, COL.greyDk);
const dash = (c: Ctx, pts: number[][], col: string = COL.greyDk, w = 4) => { c.setLineDash([14, 12]); line(c, pts, w, col); c.setLineDash([]); };
const dbl = (c: Ctx, pts: number[][], w = 10) => { arrow(c, pts, RED, w); arrow(c, [...pts].reverse(), RED, w); };
const dimV = (c: Ctx, x: number, y0: number, y1: number) => { line(c, [[x, y0], [x, y1]], 5, COL.greyDk); line(c, [[x - 12, y0], [x + 12, y0]], 5, COL.greyDk); line(c, [[x - 12, y1], [x + 12, y1]], 5, COL.greyDk); };
// a pencil taped to the wall at (x, y), blunt end out toward us: the body comes out and down-right in a short foreshortened stub
const peg = (c: Ctx, x: number, y: number) => {
  const ex = x + 56, ey = y + 54, w = 30, an = Math.atan2(ey - y, ex - x);
  line(c, [[x, y], [ex, ey]], w + 10, INK); line(c, [[x, y], [ex, ey]], w, PENCIL);
  line(c, [[x - Math.sin(an) * w * 0.3, y + Math.cos(an) * w * 0.3], [ex - Math.sin(an) * w * 0.3, ey + Math.cos(an) * w * 0.3]], w * 0.3, COL.woodDk);
  shape(c, () => ell(c, ex, ey, w / 2 + 3, w / 2 + 3), COL.steel, 5);
  shape(c, () => ell(c, ex, ey, w / 2 - 5, w / 2 - 5), COL.pink, 4);
  c.save(); c.translate(x + (ex - x) * 0.3, y + (ey - y) * 0.3); c.rotate(an + PI / 2); shape(c, () => rrect(c, -48, -13, 96, 26, 3), TAPE, 3); c.restore();
};

// ------------------------------------------------------------------ the bag of coins
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 4);
  c.beginPath(); ell(c, x, y, r * 0.6, r * 0.6); c.strokeStyle = COL.woodDk; c.lineWidth = 3; c.stroke();
  shade(c, () => ell(c, x, y, r, r), COL.woodDk, -r * 0.3, -r * 0.3, 0.5);
};
// a clear bag of five coins twisted shut and tied; the knot at (x, y), the round part below it
const bag = (c: Ctx, x: number, y: number, r: number, alpha = 1) => {
  c.save(); c.globalAlpha = alpha;
  const body = () => { c.moveTo(x - r * 0.2, y + r * 0.3); c.bezierCurveTo(x - r * 1.25, y + r * 0.7, x - r * 1.15, y + r * 2.15, x, y + r * 2.15); c.bezierCurveTo(x + r * 1.15, y + r * 2.15, x + r * 1.25, y + r * 0.7, x + r * 0.2, y + r * 0.3); c.closePath(); };
  shape(c, body, BAG, 0);
  shade(c, body, BAGDK, -r * 0.3, -r * 0.1, 0.55);
  [[-0.5, 1.78], [0.05, 1.86], [0.56, 1.72], [-0.22, 1.4], [0.34, 1.34]].forEach(([dx, dy]) => coin(c, x + dx * r, y + dy * r, r * 0.37));
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 5; c.lineJoin = "round"; c.stroke();
  shine(c, [[x - r * 0.85, y + r * 0.95], [x - r * 0.75, y + r * 1.5]], 7);
  shape(c, () => polyP(c, [[x - r * 0.2, y + r * 0.3], [x - r * 0.07, y + r * 0.04], [x + r * 0.07, y + r * 0.04], [x + r * 0.2, y + r * 0.3]]), BAG, 4);
  shape(c, () => rrect(c, x - r * 0.27, y + r * 0.2, r * 0.54, r * 0.16, 4), COL.purple, 4);
  c.restore();
};
const KN = 1.35; // knot to the middle of the round part, in bag radii
const at = (px: number, py: number, L: number, a: number): [number, number] => [px + L * Math.sin(a), py + L * Math.cos(a)];
// a coin pendulum from (px, py): L is the length to the MIDDLE of the bag, a the angle (+ = bob to the right). Returns the bag's middle.
const pend = (c: Ctx, px: number, py: number, L: number, a: number, r = 34, ghost = false, thr = true): [number, number] => {
  const [kx, ky] = at(px, py, L - KN * r, a);
  c.save();
  if (ghost) dash(c, [[px, py], [kx, ky]], "rgba(125,120,112,0.6)"); else if (thr) line(c, [[px, py], [kx, ky]], 5);
  c.translate(kx, ky); c.rotate(-a); bag(c, 0, 0, r, ghost ? 0.35 : 1);
  c.restore();
  return at(px, py, L, a);
};
// points along the bob's path round (px, py) at radius R from angle t0 to t1
const arcPts = (px: number, py: number, R: number, t0: number, t1: number, n = 24) => Array.from({ length: n + 1 }, (_, i) => at(px, py, R, t0 + ((t1 - t0) * i) / n));
// a hand gripping from the right, thumb up (the kit's hand mirrored)
const handM = (c: Ctx, x: number, y: number, an: number, s = 1, skin: string = SKIN.child, sleeve: string = CLOTH.child, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, an, s, skin, sleeve, open); c.restore(); };
// a hand holding the bag's neck, coming down along the thread: a = the thread's angle, (kx, ky) the knot
const holdKnot = (c: Ctx, kx: number, ky: number, a: number, s = 0.85, skin: string = SKIN.child, sleeve: string = CLOTH.child) => hand(c, kx - 70 * s * Math.sin(a), ky - 70 * s * Math.cos(a), PI / 2 - a, s, skin, sleeve);

// ------------------------------------------------------------------ measuring things
// numbers with a decimal point
const writeT = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  let cx = x;
  for (const ch of t) {
    if (ch === ".") { shape(c, () => ell(c, cx + h * 0.12, y + h * 0.93, w * 0.7, w * 0.7), col, 0); cx += h * 0.3; }
    else { write(c, ch, cx, y, h, col, w); cx += h * (ch === "m" ? 0.95 : ch === " " ? 0.35 : 0.8); }
  }
};
const textW = (t: string, h: number) => [...t].reduce((s, ch) => s + h * (ch === "." ? 0.3 : ch === "m" ? 0.95 : ch === " " ? 0.35 : 0.8), 0);
// a phone showing a stopwatch ring and a time, standing on y = b with its left edge at x
const phone = (c: Ctx, x: number, b: number, w: number, h: number, txt: string) => {
  shadow(c, x + w / 2 + 14, b + 4, w * 0.7, 9);
  shape(c, () => rrect(c, x - 14, b - 16, w + 28, 16, 5), COL.steel);
  shape(c, () => rrect(c, x, b - 16 - h, w, h, 18), COL.black);
  shape(c, () => rrect(c, x + 9, b - 16 - h + 14, w - 18, h - 28, 10), "#22303a", 3);
  const cx = x + w / 2, cy = b - 16 - h / 2;
  c.beginPath(); c.arc(cx, cy, w * 0.36, 0, PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 6; c.stroke();
  line(c, [[cx, cy - w * 0.36], [cx, cy - w * 0.36 - 12]], 6, "#c9f06b");
  const th = w * (txt.length > 3 ? 0.21 : 0.27); writeT(c, txt, cx - textW(txt, th) / 2, cy - th * 0.5, th, "#c9f06b", 6);
};
// a phone held flat in two hands, its middle at (x, y)
const phoneHeld = (c: Ctx, x: number, y: number, w: number, h: number, txt: string) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 16), COL.black);
  shape(c, () => rrect(c, x - w / 2 + 8, y - h / 2 + 12, w - 16, h - 24, 9), "#22303a", 3);
  c.beginPath(); c.arc(x, y, w * 0.34, 0, PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 5; c.stroke();
  const th = w * (txt.length > 3 ? 0.2 : 0.25); writeT(c, txt, x - textW(txt, th) / 2, y - th * 0.5, th, "#c9f06b", 5);
};
// a ruler standing upright on the floor, cm marks up its left edge, numbers every 10
const rulerUp = (c: Ctx, x: number, bot: number, cmPx: number, cm: number) => {
  const top = bot - cm * cmPx;
  shadow(c, x + 22, bot + 6, 40, 8);
  shape(c, () => rrect(c, x, top, 36, cm * cmPx, 4), COL.wood);
  for (let k = 0; k <= cm; k++) { const y = bot - k * cmPx; line(c, [[x, y], [x + (k % 10 === 0 ? 20 : k % 5 === 0 ? 14 : 8), y]], 3); if (k % 10 === 0 && k > 0) write(c, String(k), x + 10, y - 10, 20, INK, 3); }
};
// a yellow tape measure pulled out straight down from (x, y0) to y1, the number at its end
const tapeDown = (c: Ctx, x: number, y0: number, y1: number, label: string, cmPx: number) => {
  shape(c, () => rrect(c, x - 18, y0, 36, y1 - y0, 3), COL.yellow, 4);
  for (let y = y0, k = 0; y <= y1; y += cmPx, k++) line(c, [[x - 18, y], [x - 18 + (k % 10 === 0 ? 20 : k % 5 === 0 ? 13 : 7), y]], 2.5);
  shape(c, () => rrect(c, x - 42, y1, 84, 34, 6), COL.yellow, 5);
  write(c, label, x - textW(label, 26) / 2, y1 + 5, 26, INK, 4);
};

// ------------------------------------------------------------------ things on the floor and the table
// a small cardboard box lying on the floor, its bottom-left corner at (x, y)
const box = (c: Ctx, x: number, y: number, w = 120, h = 95) => {
  shadow(c, x + w / 2 + 10, y + 6, w * 0.6, 10);
  shape(c, () => rrect(c, x, y - h, w, h, 6), "#d9a66a");
  shade(c, () => rrect(c, x, y - h, w, h, 6), COL.woodDk, -12, -12, 0.45);
  line(c, [[x + 8, y - h * 0.62], [x + w - 8, y - h * 0.62]], 3, COL.woodDk);
  shape(c, () => rrect(c, x + w * 0.38, y - h - 4, w * 0.24, h * 0.4, 3), TAPE, 3);
};
// a tape measure lying on the floor from x0 (its hook end) to x1 (its case), on the line y
const tapeFlat = (c: Ctx, x0: number, x1: number, y: number) => {
  shape(c, () => rrect(c, x0, y - 18, x1 - x0, 36, 3), COL.yellow, 4);
  for (let x = x0, k = 0; x < x1 - 4; x += 11.6, k++) line(c, [[x, y - 18], [x, y - 18 + (k % 10 === 0 ? 20 : k % 5 === 0 ? 13 : 7)]], 2.5);
  for (let k = 0; k * 11.6 < x1 - x0 - 30; k += 5) write(c, String(k), x0 + k * 11.6 + 4, y - 1, 16, INK, 3);
  shape(c, () => rrect(c, x0 - 8, y - 24, 8, 48, 2), COL.steel, 3);
  shadow(c, x1 + 44, y + 30, 50, 8);
  shape(c, () => rrect(c, x1, y - 44, 88, 72, 16), COL.teal); shade(c, () => rrect(c, x1, y - 44, 88, 72, 16), COL.tealDk, -10, -10, 0.5);
  shape(c, () => ell(c, x1 + 44, y - 8, 18, 18), COL.black, 3);
};
// a steel bowl cut open so we see inside: rim at height y, from x-R to x+R, depth Dp
const bowlCut = (c: Ctx, x: number, y: number, R: number, Dp: number) => {
  const t = 22;
  shadow(c, x + 20, y + Dp + 6, R * 0.7, 14);
  c.beginPath(); c.ellipse(x, y, R, Dp, 0, 0, PI); c.fillStyle = COL.steel; c.fill();
  c.beginPath(); c.ellipse(x, y, R - t, Dp - t, 0, 0, PI); c.fillStyle = COL.steelIn; c.fill();
  c.save(); c.beginPath(); c.ellipse(x, y, R - t, Dp - t, 0, 0, PI); c.clip(); c.beginPath(); c.ellipse(x + R * 0.3, y - Dp * 0.3, R, Dp, 0, 0, PI * 2); c.fillStyle = COL.steelDk; c.globalAlpha = 0.25; c.fill(); c.restore(); c.globalAlpha = 1;
  c.beginPath(); c.ellipse(x, y, R, Dp, 0, 0, PI); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.ellipse(x, y, R - t, Dp - t, 0, 0, PI); c.lineWidth = 5; c.stroke();
  line(c, [[x - R, y], [x - R + t, y]], 6); line(c, [[x + R - t, y], [x + R, y]], 6);
};
// a point on the inside of that bowl where a marble of radius r sits, t = 0 (right rim) .. PI (left rim)
const inBowl = (x: number, y: number, R: number, Dp: number, r: number, t: number): [number, number] => [x + (R - 22 - r) * Math.cos(t), y + (Dp - 22 - r) * Math.sin(t)];
const marble = (c: Ctx, x: number, y: number, r: number, alpha = 1) => {
  c.save(); c.globalAlpha = alpha;
  shape(c, () => ell(c, x, y, r, r), COL.blue, 5);
  shape(c, () => { c.moveTo(x - r * 0.6, y + r * 0.3); c.quadraticCurveTo(x, y - r * 0.9, x + r * 0.6, y + r * 0.2); c.quadraticCurveTo(x, y + r * 0.1, x - r * 0.6, y + r * 0.3); c.closePath(); }, COL.orange, 0);
  shape(c, () => ell(c, x - r * 0.4, y - r * 0.4, r * 0.22, r * 0.14, -0.6), WHITE, 0);
  c.restore();
};
// a blue plastic tape mark on the bowl's outer wall near the left rim
const bowlTape = (c: Ctx, x: number, y: number) => shape(c, () => rrect(c, x - 24, y, 26, 42, 3), COL.blue, 4);
// a drinking straw standing upright, middle at x from y0 to y1
const straw = (c: Ctx, x: number, y0: number, y1: number) => { shape(c, () => rrect(c, x - 12, y0, 24, y1 - y0, 5), "#9ad7ea", 5); line(c, [[x + 4, y0 + 8], [x + 4, y1 - 8]], 4, "#5fb3cf"); };
// a clear bucket with water, top rim at y = top (half-width rt), bottom at bot (half-width rb); things inside are drawn by `inside` before the glass wall goes over them
const bucket = (c: Ctx, x: number, top: number, bot: number, rt: number, rb: number, water: number, inside: () => void) => {
  const body = () => { c.moveTo(x - rt, top); c.lineTo(x + rt, top); c.lineTo(x + rb, bot - 24); c.quadraticCurveTo(x, bot + 14, x - rb, bot - 24); c.closePath(); };
  shadow(c, x + 20, bot + 4, rb * 1.1, 14);
  const rw = rt + ((rb - rt) * (water - top)) / (bot - top);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - rt - 10, water, rt * 2 + 20, bot - water + 20); c.restore();
  inside();
  shape(c, body, COL.glass, 6);
  shape(c, () => ell(c, x, water, rw, 16), COL.waterDk, 4); shape(c, () => ell(c, x - rw * 0.3, water, rw * 0.3, 6), COL.drop, 0);
  shape(c, () => ell(c, x, top, rt, 18), "rgba(255,255,255,0.3)", 6);
  shine(c, [[x - rt * 0.8, top + 40], [x - rb * 0.85, bot - 60]], 8);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * (rt - 6), top, 12, 12), COL.steel, 4);
};
// a door frame: lintel and two jambs, the doorway pale behind
const doorFrame = (c: Ctx) => {
  floorBg(c);
  c.fillStyle = "#f8f2e6"; c.fillRect(230, 160, 620, FLOOR - 160);
  line(c, [[230, 160], [230, FLOOR]], 4, COL.grey); line(c, [[850, 160], [850, FLOOR]], 4, COL.grey);
  for (const [x, w, h] of [[190, 40, FLOOR - 160], [850, 40, FLOOR - 160]]) { shape(c, () => rrect(c, x, 160, w, h, 0), COL.brown); shade(c, () => rrect(c, x, 160, w, h, 0), COL.soilDk, -12, 0, 0.45); }
  shape(c, () => rrect(c, 180, 110, 720, 54, 4), COL.brown); shade(c, () => rrect(c, 180, 110, 720, 54, 4), COL.soilDk, 0, -14, 0.45);
  line(c, [[200, 128], [880, 128]], 4, COL.wood);
};
const DP: [number, number] = [540, 164]; // where the thread is taped under the lintel

// ------------------------------------------------------------------ the card game
// a Height token (yellow, an up arrow) or a Movement token (teal, speed lines); face down = grey back
const token = (c: Ctx, x: number, y: number, kind: "h" | "m" | "down", r = 34) => {
  shadow(c, x + 6, y + r * 0.9, r * 0.9, 8);
  shape(c, () => ell(c, x, y, r, r), kind === "h" ? COL.yellow : kind === "m" ? COL.teal : COL.grey, 5);
  if (kind === "h") { line(c, [[x, y + r * 0.5], [x, y - r * 0.45]], 6); line(c, [[x - r * 0.35, y - r * 0.1], [x, y - r * 0.5], [x + r * 0.35, y - r * 0.1]], 6); }
  else if (kind === "m") for (let k = -1; k <= 1; k++) line(c, [[x - r * 0.5 + Math.abs(k) * r * 0.15, y + k * r * 0.3], [x + r * 0.5 - Math.abs(k) * r * 0.15, y + k * r * 0.3]], 6);
  else { c.beginPath(); c.arc(x, y, r * 0.6, 0, PI * 2); c.strokeStyle = COL.greyDk; c.lineWidth = 3; c.stroke(); }
};
// a card lying or held with its top-left corner at (x, y): the front shows a little swing moment, the back the answer token
const card = (c: Ctx, x: number, y: number, w: number, h: number, back: "h" | "m" | null = null, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, 0, 0, w, h, 10), back ? COL.purple : CARD, 5);
  if (back) { shape(c, () => rrect(c, 10, 10, w - 20, h - 20, 7), COL.paper, 3); token(c, w / 2, h * 0.42, back, w * 0.22); line(c, [[w * 0.25, h * 0.72], [w * 0.75, h * 0.72]], 4, COL.grey); line(c, [[w * 0.25, h * 0.82], [w * 0.65, h * 0.82]], 4, COL.grey); }
  else { shape(c, () => rrect(c, 10, 10, w - 20, h - 20, 7), WHITE, 3); line(c, [[w * 0.3, h * 0.2], [w * 0.7, h * 0.2]], 4); line(c, [[w * 0.5, h * 0.2], [w * 0.72, h * 0.62]], 3); shape(c, () => ell(c, w * 0.74, h * 0.68, w * 0.09, w * 0.09), COL.yellow, 3); dash(c, [[w * 0.5, h * 0.2], [w * 0.5, h * 0.75]], COL.grey, 3); }
  c.restore();
};
const cardPile = (c: Ctx, x: number, y: number) => { shadow(c, x + 70, y + 190, 110, 16); for (let k = 0; k < 7; k++) card(c, x + (k % 3) * 4 - 4, y - k * 5, 130, 180, null, (k % 2 ? -1 : 1) * 0.04 * (k % 3)); };
// the floor, seen from a sitting child's height: wall above, a big floor below
const roomBg = (c: Ctx, horizon = 560) => { ground(c); c.fillStyle = "#e3d4b6"; c.fillRect(0, horizon, 1080, 1080 - horizon); line(c, [[0, horizon], [1080, horizon]], 5); };
// the child sitting on the floor, holding a card up to read (or turned round to show the back)
const readerChild = (c: Ctx, x: number, y: number, back: "h" | "m" | null) => {
  const hands = person(c, x, y, 470, { sit: true, dir: 1, reachR: [x + 150, y - 240] });
  const [hx, hy] = hands.handR;
  card(c, hx - 12, hy - 160, 112, 158, back, 0.06);
};

// ================================================================== set-up cards
// g1.0 · the pile of cards with a Height and a Movement token in front of each player
const g1s0 = (c: Ctx) => {
  roomBg(c, 0);
  cardPile(c, 475, 450);
  for (const [tx, ty] of [[540, 880], [540, 220], [200, 560], [880, 560]]) { token(c, tx - 48, ty, "h"); token(c, tx + 48, ty, "m"); }
};
// g1.1 · the reader reads a card; the others put a token face down
const g1s1 = (c: Ctx) => {
  roomBg(c);
  cardPile(c, 190, 640);
  readerChild(c, 540, 920, null);
  hand(c, 150, 930, -0.5, 1, SKIN.adult, CLOTH.adult); token(c, 150 + 70 * Math.cos(-0.5), 930 + 70 * Math.sin(-0.5), "down", 30);
  handM(c, 930, 930, -0.5, 1); token(c, 930 - 70 * Math.cos(-0.5), 930 + 70 * Math.sin(-0.5), "down", 30);
};
// g1.2 · the reader turns the card over: the answer token is printed on the back; tallies beside the players
const g1s2 = (c: Ctx) => {
  roomBg(c);
  readerChild(c, 540, 920, "m");
  const tally = (x: number, y: number, n: number) => { shape(c, () => rrect(c, x, y, 150, 100, 6), COL.paper, 4); for (let k = 0; k < n; k++) line(c, [[x + 30 + k * 26, y + 24], [x + 30 + k * 26, y + 76]], 5); };
  token(c, 120, 850, "h"); token(c, 200, 850, "m"); tally(100, 900, 3);
  token(c, 880, 850, "h"); token(c, 960, 850, "m"); tally(830, 900, 2);
};

// the Peg Test geometry: thread 400 px to the bag's middle (50 cm), the bag at rest at (640, 740); the top line 6 cm = 48 px above
const E1 = { L: 400, rest: 740, top: 692, rise: 48 };
const e1Bg = (c: Ctx, marks = true) => { tableSet(c); sheet(c, 430, 470, 610, 360); if (marks) { pencilMark(c, 520, 760, E1.rest); pencilMark(c, 520, 760, E1.top); } };
const angFor = (L: number, rise: number) => Math.acos((L - rise) / L);
// e1.0 · the pendulum hanging still in front of the paper with the two lines
const e1s0 = (c: Ctx) => { e1Bg(c); pend(c, PX, PY, E1.L, 0); };
// e1.1 · let go at the top line on the right; the bag swings to the left and stops at the dotted line, the same height
const e1s1 = (c: Ctx) => {
  e1Bg(c);
  const a = angFor(E1.L, E1.rise);
  dash(c, [[440, E1.top], [1030, E1.top]], RED);
  pend(c, PX, PY, E1.L, -a, 34, true);
  arrow(c, arcPts(PX, PY, E1.L + 60, a * 0.8, -a * 0.8), RED, 9);
  const b = pend(c, PX, PY, E1.L, a);
  handM(c, b[0] + 128, b[1] + 4, 0, 0.9, SKIN.child, CLOTH.child, true);
};
// e1.2 · a pencil taped to the wall right under the pivot, 25 cm above the resting bag, the hanging thread just touching it
const e1s2 = (c: Ctx) => { e1Bg(c); pend(c, PX, PY, E1.L, 0); peg(c, PX, E1.rest - 200); };
// e1.3 / e1.4 · with the peg, the bag swings a tight curve round it, up to the same dotted line
const pegSwing = (c: Ctx, below: number) => {
  e1Bg(c);
  const gy = E1.rest - below, a0 = angFor(E1.L, E1.rise), a1 = angFor(below, E1.rise);
  dash(c, [[440, E1.top], [1030, E1.top]], RED);
  pend(c, PX, PY, E1.L, a0, 34, true);
  line(c, [[PX, PY], [PX, gy]], 5);
  arrow(c, arcPts(PX, gy, below + 60, 0.1, -a1 * 0.85), RED, 9);
  pend(c, PX, gy, below, -a1);
  peg(c, PX, gy);
};
const e1s3 = (c: Ctx) => pegSwing(c, 200);
const e1s4 = (c: Ctx) => pegSwing(c, 96);

// Height and Hit: thread 635 px to the bag's middle, the bag just above the floor; 1 cm = 11.6 px
const E2 = { L: 635, rest: FLOOR - 55, cm: 11.6 };
const e2Bg = (c: Ctx) => { tableSet(c); };
// e2.0 · the bag hangs just above the floor, touching the end of a small box
const e2s0 = (c: Ctx) => { e2Bg(c); box(c, 482, FLOOR); pend(c, PX, PY, E2.L, 0); };
// e2.1 · a hand holds the bag 5 cm above its rest, beside a ruler standing on the floor
const e2s1 = (c: Ctx) => {
  e2Bg(c);
  box(c, 482, FLOOR);
  pend(c, PX, PY, E2.L, 0, 34, true);
  const a = angFor(E2.L, 5 * E2.cm), b = pend(c, PX, PY, E2.L, a), k = at(PX, PY, E2.L - KN * 34, a);
  holdKnot(c, k[0], k[1], a);
  rulerUp(c, 975, FLOOR, E2.cm, 30);
  dash(c, [[b[0] + 50, E2.rest], [975, E2.rest]]); dash(c, [[b[0] + 50, b[1]], [975, b[1]]]);
  dimV(c, 950, b[1], E2.rest);
};
// e2.2 · the bag at the bottom hits the box; the box slides
const e2s2 = (c: Ctx) => {
  e2Bg(c);
  const a = angFor(E2.L, 10 * E2.cm);
  dash(c, arcPts(PX, PY, E2.L, a, 0.08), COL.greyDk);
  box(c, 470, FLOOR);
  pend(c, PX, PY, E2.L, 0);
  for (const dy of [-30, 0, 30]) line(c, [[700, E2.rest + dy], [760 - Math.abs(dy) * 0.6, E2.rest + dy]], 5, COL.greyDk);
  arrow(c, [[460, E2.rest - 20], [370, E2.rest - 20]], RED, 10);
};
// e2.3 · a tape measure along the floor from the starting spot to the front of the slid box
const e2s3 = (c: Ctx) => {
  e2Bg(c);
  box(c, 330, FLOOR);
  shape(c, () => rrect(c, 584, FLOOR - 8, 18, 14, 2), COL.blue, 3);
  pend(c, PX, PY, E2.L, 0);
  tapeFlat(c, 450, 603, FLOOR + 30);
};
// e2.4 · a bar chart: the mean slide for 5, 10 and 20 cm, each bar taller than the one before
const e2s4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 110, 90, 860, 900, 8), COL.paper, 6);
  const x0 = 250, y0 = 860, x1 = 920, y1 = 170;
  line(c, [[x0, y1], [x0, y0], [x1, y0]], 6);
  for (let k = 1; k <= 6; k++) line(c, [[x0 - 14, y0 - k * 105], [x0, y0 - k * 105]], 4);
  [[5, 1], [10, 2], [20, 4]].forEach(([cm, h], i) => {
    const bx = x0 + 70 + i * 215, bh = h * 150;
    shape(c, () => rrect(c, bx, y0 - bh, 130, bh, 6), [COL.teal, COL.blue, COL.purple][i], 5);
    const lbl = `${cm}cm`; write(c, lbl, bx + 65 - textW(lbl, 36) / 2, y0 + 24, 36, INK, 5);
  });
};

// How Many Swings: a 25 cm pendulum = 300 px to the bag's middle
const E3 = { L: 300 };
// e3.0 · the short pendulum, the thread measured 25 cm from the ruler to the middle of the bag
const e3s0 = (c: Ctx) => {
  tableSet(c);
  const b = pend(c, PX, PY, E3.L, 0);
  dash(c, [[b[0] + 40, b[1]], [800, b[1]]]); dash(c, [[PX + 40, PY], [800, PY]]);
  tapeDown(c, 760, PY, b[1], "25", 12);
};
// e3.1 · a hand pulls the bag a hand-width aside; the phone's stopwatch waits at zero on the table
const e3s1 = (c: Ctx) => {
  tableSet(c);
  phone(c, 50, SLAB, 130, 230, "0.0");
  const a = 0.36, k = at(PX, PY, E3.L - KN * 34, a);
  pend(c, PX, PY, E3.L, 0, 34, true);
  pend(c, PX, PY, E3.L, a);
  handM(c, k[0] + 60, k[1] + 2, 0, 0.85);
};

// Marble in a Bowl: a cut-open steel bowl on the table
const B = { x: 540, y: 560, R: 360, Dp: 280, r: 26 };
const bowlBg = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, B.y + B.Dp, 1000, 60, 8), COL.brown); shade(c, () => rrect(c, 40, B.y + B.Dp, 1000, 60, 8), COL.soilDk, 0, -14, 0.45);
  c.fillStyle = "#e3d4b6"; c.fillRect(0, B.y + B.Dp + 60, 1080, 1080);
  bowlCut(c, B.x, B.y, B.R, B.Dp);
  bowlTape(c, B.x - B.R + 4, B.y + 12);
};
const startT = PI - Math.asin(42 / (B.Dp - 22 - B.r));
// a1.0 · the marble held against the inside near the left rim, level with the tape
const a1s0 = (c: Ctx) => {
  bowlBg(c);
  const [mx, my] = inBowl(B.x, B.y, B.R, B.Dp, B.r, startT);
  marble(c, mx, my, B.r);
  hand(c, mx - 70 * 0.8 * Math.cos(1.15), my - 70 * 0.8 * Math.sin(1.15), 1.15, 0.8);
};
// a1.1 · let go: the marble rolls down and up the far side to the dotted line at the tape's height
const a1s1 = (c: Ctx) => {
  bowlBg(c);
  const [sx, sy] = inBowl(B.x, B.y, B.R, B.Dp, B.r, startT), endT = PI - startT, [ex, ey] = inBowl(B.x, B.y, B.R, B.Dp, B.r, endT);
  dash(c, [[B.x - B.R - 30, sy], [B.x + B.R + 30, sy]], RED);
  marble(c, sx, sy, B.r, 0.35);
  const path = Array.from({ length: 25 }, (_, i) => { const t = startT + ((endT + 0.22 - startT) * i) / 24; return inBowl(B.x, B.y, B.R, B.Dp, B.r + 50, t); });
  arrow(c, path, RED, 9);
  marble(c, ex, ey, B.r);
};

// Pump the Pendulum: a thread through a straw held in one hand; the bag hangs 300 px below the straw's end
const A2 = { sx: 560, st: 420, sb: 660, L: 300 };
const strawBg = (c: Ctx) => { ground(c); };
const strawHeld = (c: Ctx) => { hand(c, A2.sx - 70 * 1.1, 560, 0, 1.1); };
// a2.0 · the thread through the straw, the bag hanging from its lower end, the free end coming out of the top
const a2s0 = (c: Ctx) => {
  strawBg(c);
  line(c, [[A2.sx, A2.st], [A2.sx + 150, A2.st - 90]], 5);
  pend(c, A2.sx, A2.sb, A2.L, 0);
  straw(c, A2.sx, A2.st, A2.sb);
  strawHeld(c);
  handM(c, A2.sx + 150 + 60, A2.st - 90, 0, 0.85);
};
// a2.1 · as the bag passes the bottom, the other hand pulls the thread up 3 cm
const a2s1 = (c: Ctx) => {
  strawBg(c);
  const fx = A2.sx + 130, fy = A2.st - 170;
  line(c, [[A2.sx, A2.st], [fx, fy]], 5);
  pend(c, A2.sx, A2.sb, A2.L - 30, 0);
  for (const s of [-1, 1]) for (const dy of [-26, 0, 26]) line(c, [[A2.sx + s * 90, A2.sb + A2.L - 30 + dy], [A2.sx + s * (140 - Math.abs(dy) * 0.8), A2.sb + A2.L - 30 + dy]], 5, COL.greyDk);
  straw(c, A2.sx, A2.st, A2.sb);
  strawHeld(c);
  handM(c, fx + 60, fy, 0, 0.85);
  arrow(c, [[fx + 60, fy - 70], [fx + 60, fy - 190]], RED, 10);
};
// a2.2 · at the end of the swing the thread is let out again
const a2s2 = (c: Ctx) => {
  strawBg(c);
  const fx = A2.sx + 150, fy = A2.st - 80;
  line(c, [[A2.sx, A2.st], [fx, fy]], 5);
  pend(c, A2.sx, A2.sb, A2.L, -0.62);
  straw(c, A2.sx, A2.st, A2.sb);
  strawHeld(c);
  handM(c, fx + 60, fy, 0, 0.85);
  arrow(c, [[fx + 60, fy + 70], [fx + 60, fy + 170]], RED, 10);
};

// The Ruler Pendulum: two stacks of books on a table, a pencil across them; the ruler hangs over the table edge
const A3 = { top: 580, pen: 330, rx: 430, tx: 600 };
const a3Bg = (c: Ctx) => {
  floorBg(c);
  for (const lx of [54, 976]) { shape(c, () => rrect(c, lx, A3.top + 40, 50, FLOOR - A3.top - 40, 6), COL.brown); shade(c, () => rrect(c, lx, A3.top + 40, 50, FLOOR - A3.top - 40, 6), COL.soilDk, -14, 0, 0.5); }
  shape(c, () => rrect(c, 30, A3.top, 1020, 50, 10), COL.brown); shade(c, () => rrect(c, 30, A3.top, 1020, 50, 10), COL.soilDk, -8, -12, 0.5);
  const tones = [COL.purple, COL.teal, COL.orange, COL.green, COL.red];
  for (const sx of [150, 740]) tones.forEach((col, i) => { const y = A3.top - 50 * (i + 1), w = 170 - (i % 2) * 14; shape(c, () => rrect(c, sx + (i % 2) * 8, y, w, 50, 6), col); shape(c, () => rrect(c, sx + (i % 2) * 8 + 16, y + 9, w - 22, 32, 3), COL.paper, 3); });
  // the pencil lying across the two stacks
  shape(c, () => rrect(c, 110, A3.pen - 14, 820, 28, 4), PENCIL, 5);
  line(c, [[120, A3.pen + 6], [920, A3.pen + 6]], 6, COL.woodDk);
  shape(c, () => rrect(c, 80, A3.pen - 16, 50, 32, 6), COL.pink, 5); shape(c, () => rrect(c, 120, A3.pen - 15, 24, 30, 2), COL.steel, 4);
  shape(c, () => polyP(c, [[930, A3.pen - 14], [980, A3.pen], [930, A3.pen + 14]]), COL.wood, 5); shape(c, () => polyP(c, [[964, A3.pen - 5], [980, A3.pen], [964, A3.pen + 5]]), INK, 0);
};
// the ruler hanging from the pencil by a hole at its end, tilted by a (radians, + = bottom to the right)
const rulerHung = (c: Ctx, x: number, a: number) => {
  c.save(); c.translate(x, A3.pen); c.rotate(-a);
  shape(c, () => rrect(c, -24, -22, 48, 384, 5), COL.wood);
  for (let k = 0; k <= 30; k++) line(c, [[-24, 10 + k * 11.5], [-24 + (k % 10 === 0 ? 20 : k % 5 === 0 ? 14 : 8), 10 + k * 11.5]], 2.5);
  shape(c, () => ell(c, 0, 0, 9, 9), BG, 4);
  c.restore();
};
// a3.0 · the ruler swinging on the pencil
const a3s0 = (c: Ctx) => {
  a3Bg(c);
  rulerHung(c, 540, 0.2);
  dbl(c, arcPts(540, A3.pen, 420, 0.42, -0.42, 20), 9);
};
// a3.1 · a 20 cm coin pendulum beside it, both swinging in step; the stopwatch reads the same for both
const a3s1 = (c: Ctx) => {
  a3Bg(c);
  rulerHung(c, A3.rx, 0.2);
  pend(c, A3.tx, A3.pen, 240, 0.2);
  phone(c, 945, A3.top, 100, 180, "9.0");
  dbl(c, arcPts(A3.rx, A3.pen, 420, 0.4, -0.4, 20), 8);
  dbl(c, arcPts(A3.tx, A3.pen, 300, 0.4, -0.4, 20), 8);
};

// Swing in Water: a clear bucket on the floor under the ruler, the bag dipping into the water
const A4 = { top: 760, water: 800, L: 560 };
const bucketScene = (c: Ctx, a: number, curls = false) => {
  tableSet(c);
  bucket(c, PX, A4.top, FLOOR, 180, 150, A4.water, () => {
    const b = pend(c, PX, PY, A4.L, a);
    const s = a < 0 ? -1 : 1;
    if (curls) for (const [dx, dy, r] of [[-90, -10, 22], [-130, 30, 16], [-80, 50, 13]]) { c.beginPath(); c.arc(b[0] + s * dx, b[1] + dy, r, 0.3, PI * 1.6); c.strokeStyle = WHITE; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  });
};
// a4.0 · the bag hangs so it dips into the bucket
const a4s0 = (c: Ctx) => bucketScene(c, 0);
// a4.1 · the bag pulled aside in the water, curls of water behind it, the thread held above the water
const a4s1 = (c: Ctx) => {
  bucketScene(c, 0.19, true);
  const k = at(PX, PY, 330, 0.19);
  hand(c, k[0] - 63, k[1], 0, 0.9);
};

// Weigh the Pull of the Earth: a thread taped under the lintel, 100 cm = 435 px to the bag's middle
const P1 = { L: 435 };
const lintelTape = (c: Ctx) => shape(c, () => rrect(c, DP[0] - 40, DP[1] - 8, 80, 22, 3), TAPE, 3);
// p1.0 · the bag hangs from the door frame beside a tape measure reading 100 cm
const p1s0 = (c: Ctx) => {
  doorFrame(c);
  const b = pend(c, DP[0], DP[1], P1.L, 0);
  lintelTape(c);
  dash(c, [[b[0] + 40, b[1]], [700, b[1]]]);
  tapeDown(c, 660, DP[1] + 14, b[1], "100", 4.35);
};
// p1.1 · the child holds the bag aside by a hand-width; the grown-up holds the phone's stopwatch
const p1s1 = (c: Ctx) => {
  doorFrame(c);
  const a = 0.27, k = at(DP[0], DP[1], P1.L - KN * 34, -a);
  pend(c, DP[0], DP[1], P1.L, 0, 34, true);
  const hands = person(c, 300, FLOOR, 560, { reachR: [k[0], k[1] + 6] });
  pend(c, DP[0], DP[1], P1.L, -a);
  lintelTape(c);
  const ad = person(c, 760, FLOOR, 760, { adult: true, reachL: [716, 700], reachR: [804, 700] });
  phoneHeld(c, (ad.handL[0] + ad.handR[0]) / 2, 600, 110, 190, "0.0");
  void hands;
};

// ================================================================== picture cards
// flow.e1 · the Peg Test: let go from the top line, the thread catches the pencil, the bag still reaches the dotted line
const fE1 = (c: Ctx) => {
  e1Bg(c);
  const gy = E1.rest - 200, a0 = angFor(E1.L, E1.rise), a1 = angFor(200, E1.rise);
  dash(c, [[440, E1.top], [1030, E1.top]], RED);
  pend(c, PX, gy, 200, -a1, 34, true);
  arrow(c, arcPts(PX, PY, E1.L + 60, a0 * 0.85, 0.12), RED, 9);
  arrow(c, arcPts(PX, gy, 260, -0.1, -a1 * 0.85), RED, 9);
  const b = pend(c, PX, PY, E1.L, a0);
  peg(c, PX, gy);
  handM(c, b[0] + 128, b[1] + 4, 0, 0.9, SKIN.child, CLOTH.child, true);
};
// flow.e2 · Height and Hit: the bag held up beside the ruler, its path down to the box
const fE2 = (c: Ctx) => {
  e2Bg(c);
  box(c, 482, FLOOR);
  const a = angFor(E2.L, 10 * E2.cm), b = pend(c, PX, PY, E2.L, a), k = at(PX, PY, E2.L - KN * 34, a);
  holdKnot(c, k[0], k[1], a);
  arrow(c, arcPts(PX, PY, E2.L + 40, a * 0.8, 0.1), RED, 9);
  rulerUp(c, 975, FLOOR, E2.cm, 30);
  dash(c, [[b[0] + 50, b[1]], [975, b[1]]]);
};
// flow.e3 · How Many Swings: the short pendulum swinging, the stopwatch running on the table
const fE3 = (c: Ctx) => {
  tableSet(c);
  phone(c, 50, SLAB, 130, 230, "30.6");
  pend(c, PX, PY, E3.L, 0.36, 34, true);
  pend(c, PX, PY, E3.L, -0.36);
  dbl(c, arcPts(PX, PY, E3.L + 70, 0.42, -0.42, 20), 9);
};
// flow.a1 · the marble halfway up the far side, the dotted line where it will stop
const fA1 = (c: Ctx) => {
  bowlBg(c);
  const [sx, sy] = inBowl(B.x, B.y, B.R, B.Dp, B.r, startT), endT = PI - startT;
  dash(c, [[B.x - B.R - 30, sy], [B.x + B.R + 30, sy]], RED);
  marble(c, sx, sy, B.r, 0.35);
  const mid = PI * 0.3, [mx, my] = inBowl(B.x, B.y, B.R, B.Dp, B.r, mid);
  const path = Array.from({ length: 25 }, (_, i) => { const t = startT + ((mid + 0.28 - startT) * i) / 24; return inBowl(B.x, B.y, B.R, B.Dp, B.r + 50, t); });
  arrow(c, path, RED, 9);
  marble(c, mx, my, B.r);
  arrow(c, Array.from({ length: 8 }, (_, i) => inBowl(B.x, B.y, B.R, B.Dp, B.r + 50, mid - 0.05 - (i * (mid - 0.05 - endT)) / 7)), COL.greyDk, 6);
};
// flow.a2 · pumping: pull the thread at the bottom, the bag swings higher (the two end positions ghosted)
const fA2 = (c: Ctx) => {
  strawBg(c);
  const fx = A2.sx + 130, fy = A2.st - 170;
  line(c, [[A2.sx, A2.st], [fx, fy]], 5);
  pend(c, A2.sx, A2.sb, A2.L, 0.6, 34, true); pend(c, A2.sx, A2.sb, A2.L, -0.6, 34, true);
  pend(c, A2.sx, A2.sb, A2.L - 30, 0);
  dbl(c, arcPts(A2.sx, A2.sb, A2.L + 60, 0.5, -0.5, 20), 9);
  straw(c, A2.sx, A2.st, A2.sb);
  strawHeld(c);
  handM(c, fx + 60, fy, 0, 0.85);
  arrow(c, [[fx + 60, fy - 70], [fx + 60, fy - 190]], RED, 10);
};
// flow.a3 · the ruler and the coin pendulum two thirds its length, hanging side by side at rest
const fA3 = (c: Ctx) => {
  a3Bg(c);
  rulerHung(c, A3.rx, 0);
  pend(c, A3.tx, A3.pen, 240, 0);
  dash(c, [[A3.rx - 60, A3.pen + 362], [A3.tx + 70, A3.pen + 362]]); dash(c, [[A3.tx - 60, A3.pen + 240], [A3.tx + 70, A3.pen + 240]]);
  dimV(c, A3.tx + 60, A3.pen, A3.pen + 240); dimV(c, A3.rx - 60, A3.pen, A3.pen + 362);
};
// flow.a4 · the bag swinging in the bucket of water, slowed by the water
const fA4 = (c: Ctx) => bucketScene(c, -0.17, true);
// flow.p1 · the 1 metre pendulum at the door frame swinging; the grown-up times it
const fP1 = (c: Ctx) => {
  doorFrame(c);
  pend(c, DP[0], DP[1], P1.L, -0.22, 34, true);
  pend(c, DP[0], DP[1], P1.L, 0.22);
  lintelTape(c);
  dbl(c, arcPts(DP[0], DP[1], P1.L + 70, 0.26, -0.26, 20), 9);
  const ad = person(c, 820, FLOOR, 760, { adult: true, reachL: [776, 700], reachR: [864, 700] });
  phoneHeld(c, (ad.handL[0] + ad.handR[0]) / 2, 600, 110, 190, "60.2");
};
// flow.g1 · Swap Shop: the reader with a card, the pile and the tokens on the floor
const fG1 = (c: Ctx) => {
  roomBg(c);
  cardPile(c, 190, 640);
  readerChild(c, 540, 920, null);
  token(c, 850, 880, "h"); token(c, 940, 880, "m");
  token(c, 850, 980, "h"); token(c, 940, 980, "m");
};
// term.0 · Pendulum: a bag of coins on a thread from a ruler, a curved arrow for the swing
const tPend = (c: Ctx) => {
  tableSet(c);
  pend(c, PX, PY, 440, -0.4, 34, true);
  pend(c, PX, PY, 440, 0.4, 34, true);
  pend(c, PX, PY, 440, 0);
  dbl(c, arcPts(PX, PY, 510, 0.45, -0.45, 24), 10);
};

export const ic_motionSwingsAndPendulumsL4 = cards("sci.motion.swings-and-pendulums.L4", [
  g1s0, g1s1, g1s2, e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, e2s4, e3s0, e3s1, a1s0, a1s1, a2s0, a2s1, a2s2, a3s0, a3s1, a4s0, a4s1, p1s0, p1s1,
  fE1, fE2, fE3, fA1, fA2, fA3, fA4, fP1, fG1, tPend,
]);
