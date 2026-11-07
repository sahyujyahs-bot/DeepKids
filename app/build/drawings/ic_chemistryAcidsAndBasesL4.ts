import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, hand, person, write, cards } from "./flatKit";

// ACIDS AND BASES L4 · the pH scale, stomach acid and antacids. Flat set-up cards: cabbage water
// (pink in acid, purple when neutral, green in a base), a dark food colour fading ten times a cup,
// pH strips against a 0..14 chart, and the powders raced against a glass of vinegar.

const PINK = "#ee5a8f", PURPLE = "#7d55bd", GREEN = "#4fae6e", DYE = "#b0102c", LEMON = "#f6d23a", SOAP = "#9fd8c8", VINEGAR = "#f3e3a2", PAPER = "#f6efdc";
const PH = ["#c81d1d", "#d93a1f", "#e8622a", "#f08a2b", "#f2b22c", "#e8d12e", "#b7cf3a", "#5fb04f", "#3f9f7b", "#3a8fa6", "#3a6fb8", "#4a56b4", "#5a3f9f", "#6a2f8a", "#5a2070"];
const mix = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [p, q] = [h(a), h(b)];
  return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * t)).join(",")})`;
};

// ---------------------------------------------------------------- letters the kit does not have
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.64], [0.48, 0.64]]],
  B: [[[0, 1], [0, 0], [0.4, 0], [0.56, 0.12], [0.56, 0.36], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.6, 0.6], [0.6, 0.88], [0.42, 1], [0, 1]]],
  C: [[[0.58, 0.15], [0.4, 0], [0.18, 0], [0, 0.2], [0, 0.8], [0.18, 1], [0.4, 1], [0.58, 0.85]]],
  D: [[[0, 1], [0, 0], [0.35, 0], [0.58, 0.2], [0.58, 0.8], [0.35, 1], [0, 1]]],
  T: [[[0, 0], [0.6, 0]], [[0.3, 0], [0.3, 1]]],
  H: [[[0, 0], [0, 1]], [[0.6, 0], [0.6, 1]], [[0, 0.5], [0.6, 0.5]]],
  p: [[[0, 0.3], [0, 1.3]], [[0, 0.42], [0.3, 0.3], [0.55, 0.5], [0.55, 0.78], [0.3, 0.98], [0, 0.86]]],
  "?": [[[0.02, 0.22], [0.15, 0.03], [0.45, 0.03], [0.58, 0.22], [0.5, 0.45], [0.3, 0.58], [0.3, 0.74]], [[0.3, 0.96], [0.3, 1]]],
};
const letters = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  let cx = x;
  for (const ch of t) {
    if (LET[ch]) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); }); }
    else write(c, ch, cx, y, h, col, w);
    cx += h * 0.8;
  }
};
// a white paper tag with a letter or number on it, centred at (x, y)
const tag = (c: Ctx, x: number, y: number, t: string, h = 40) => {
  const w = t.length * h * 0.8 + 26;
  shape(c, () => rrect(c, x - w / 2, y - h / 2 - 12, w, h + 24, 8), WHITE, 5);
  letters(c, t, x - w / 2 + 13 + h * 0.1, y - h / 2, h, INK, Math.max(5, h * 0.14));
};

// ---------------------------------------------------------------- things on the table
// a teaspoon: bowl centre (bx, by), the handle running off at angle a; hold = what sits in the bowl
const spoon = (c: Ctx, bx: number, by: number, a: number, len = 170, hold?: { col: string; powder?: boolean }) => {
  c.save(); c.translate(bx, by); c.rotate(a);
  line(c, [[30, 0], [len, 0]], 28, INK); line(c, [[30, 0], [len, 0]], 16, COL.steel);
  shape(c, () => ell(c, 0, 0, 46, 32), COL.steel, 5);
  shape(c, () => ell(c, 0, 0, 34, 21), COL.steelDk, 0);
  if (hold) {
    if (hold.powder) shape(c, () => { c.moveTo(-32, 4); c.quadraticCurveTo(0, -34, 32, 4); c.closePath(); }, WHITE, 4);
    else shape(c, () => ell(c, 0, 2, 32, 18), hold.col, 0);
  }
  c.restore();
};
// a hand gripping an object whose middle is at (gx, gy); an = where the fingers point
const grip = (c: Ctx, gx: number, gy: number, an: number) => hand(c, gx - 70 * Math.cos(an), gy - 70 * Math.sin(an), an, 1);
// a bottle, mouth at (mx, my), its body running off at angle a (down = standing); liquid col, body length len
const bottle = (c: Ctx, mx: number, my: number, a: number, len: number, wd: number, col: string, cap = false) => {
  c.save(); c.translate(mx, my); c.rotate(a);
  const neck = wd * 0.42;
  const body = () => { c.moveTo(0, -neck / 2); c.lineTo(len * 0.22, -neck / 2); c.quadraticCurveTo(len * 0.3, -wd / 2, len * 0.42, -wd / 2); c.lineTo(len - 14, -wd / 2); c.quadraticCurveTo(len, -wd / 2, len, -wd / 2 + 14); c.lineTo(len, wd / 2 - 14); c.quadraticCurveTo(len, wd / 2, len - 14, wd / 2); c.lineTo(len * 0.42, wd / 2); c.quadraticCurveTo(len * 0.3, wd / 2, len * 0.22, neck / 2); c.lineTo(0, neck / 2); c.closePath(); };
  shape(c, body, col); shade(c, body, INK, -wd * 0.18, wd * 0.18, 0.18);
  shape(c, () => rrect(c, len * 0.5, -wd * 0.3, len * 0.32, wd * 0.6, 6), PAPER, 4);
  if (cap) shape(c, () => rrect(c, -16, -neck / 2 - 6, 26, neck + 12, 5), COL.black, 4);
  shine(c, [[len * 0.46, wd * 0.32], [len * 0.9, wd * 0.32]], 7);
  c.restore();
};
// a jug with a spout to the left and a handle to the right, bottom centre (x, y)
const jug = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, col: string) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.65, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x - w * 0.62, y - h * 0.88); c.lineTo(x - w * 0.46, y - h * 0.8); c.lineTo(x - w * 0.4, y); c.lineTo(x + w * 0.4, y); c.lineTo(x + w / 2, y - h); c.closePath(); };
  shape(c, () => { c.moveTo(x + w * 0.46, y - h * 0.85); c.bezierCurveTo(x + w * 0.95, y - h * 0.85, x + w * 0.95, y - h * 0.3, x + w * 0.42, y - h * 0.3); }, "rgba(0,0,0,0)", 22);
  c.beginPath(); c.moveTo(x + w * 0.46, y - h * 0.85); c.bezierCurveTo(x + w * 0.95, y - h * 0.85, x + w * 0.95, y - h * 0.3, x + w * 0.42, y - h * 0.3); c.strokeStyle = COL.glassEdge; c.lineWidth = 11; c.stroke();
  if (fill > 0) { const ly = y - h * fill, lw = w * 0.4 + (w * 0.1) * fill; shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); }, col, 0); shape(c, () => ell(c, x, ly, lw, w * 0.06), COL.drop, 0); }
  shape(c, body, COL.glass, 5);
  shine(c, [[x - w * 0.3, y - h * 0.8], [x - w * 0.24, y - h * 0.2]], 7);
};
// a stream of liquid from a to b, bulging a little on the way down
const pour = (c: Ctx, from: number[], to: number[], col: string, w = 14) => {
  const mid = [(from[0] + to[0]) / 2 + (to[0] - from[0]) * 0.1, (from[1] + to[1]) / 2 + 20];
  const path = () => { c.beginPath(); c.moveTo(from[0], from[1]); c.quadraticCurveTo(mid[0], mid[1], to[0], to[1]); };
  path(); c.strokeStyle = INK; c.lineWidth = w + 6; c.lineCap = "round"; c.stroke();
  path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
// small bubbles inside a liquid, in the box (x0, y0)-(x1, y1)
const fizz = (c: Ctx, x0: number, y0: number, x1: number, y1: number, seed: number, n = 14) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), rr = 5 + r() * 9; shape(c, () => ell(c, x, y, rr, rr), "rgba(255,255,255,0.8)", 3); }
};
// a drop falling, tip up, centre (x, y)
const drop = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.1, y - r * 0.2, x + r, y + r * 0.3); c.arc(x, y + r * 0.3, r, 0, Math.PI); c.quadraticCurveTo(x - r * 1.1, y - r * 0.2, x, y - r * 1.6); c.closePath(); }, col, 4);
// a white powder heap in a bowl at (x, y) rim radius r; kind: 0 fine powder, 1 tablets, 2 eggshell bits, 3 salt grains
const heap = (c: Ctx, x: number, y: number, r: number, kind: number) => {
  const mound = () => { c.moveTo(x - r * 0.8, y + 2); c.quadraticCurveTo(x, y - r * 0.75, x + r * 0.8, y + 2); c.closePath(); };
  if (kind === 1) { for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + (i - 1) * r * 0.42, y - r * 0.1 + Math.abs(i - 1) * 6, r * 0.3, r * 0.14), WHITE, 4); shape(c, () => ell(c, x, y - r * 0.38, r * 0.3, r * 0.14), WHITE, 4); return; }
  shape(c, mound, WHITE, 4);
  if (kind === 2) { const g = rnd(5); for (let i = 0; i < 9; i++) { const px = x - r * 0.5 + g() * r, py = y - r * 0.45 + g() * r * 0.4 + Math.abs(px - x) * 0.3; shape(c, () => polyP(c, [[px - 12, py + 6], [px - 4, py - 10], [px + 10, py - 6], [px + 12, py + 7]]), "#f4ecdc", 3); } }
  if (kind === 3) { const g = rnd(8); for (let i = 0; i < 22; i++) { const px = x - r * 0.55 + g() * r * 1.1, py = y - r * 0.5 + g() * r * 0.45 + Math.abs(px - x) * 0.4; shape(c, () => rrect(c, px - 5, py - 5, 10, 10, 2), "#f7f7f7", 2.5); } }
};
const lemon = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.78, r * 0.95, r * 0.18);
  const body = () => { c.moveTo(x - r * 1.18, y); c.quadraticCurveTo(x - r * 1.05, y - r * 0.8, x, y - r * 0.76); c.quadraticCurveTo(x + r * 1.05, y - r * 0.8, x + r * 1.18, y); c.quadraticCurveTo(x + r * 1.05, y + r * 0.8, x, y + r * 0.76); c.quadraticCurveTo(x - r * 1.05, y + r * 0.8, x - r * 1.18, y); c.closePath(); };
  shape(c, body, LEMON); shade(c, body, "#d8a81e", -r * 0.25, -r * 0.22, 0.5);
  shape(c, () => ell(c, x - r * 1.2, y, r * 0.12, r * 0.09), "#c99a1a", 3); shape(c, () => ell(c, x + r * 1.2, y, r * 0.12, r * 0.09), "#c99a1a", 3);
  shine(c, [[x - r * 0.6, y - r * 0.42], [x - r * 0.2, y - r * 0.52]], 6);
};
const soap = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 8, y + h * 0.55, w * 0.55, h * 0.18);
  const body = () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.4);
  shape(c, body, SOAP); shade(c, body, "#5fae9b", -w * 0.08, -h * 0.22, 0.45);
  shape(c, () => rrect(c, x - w * 0.28, y - h * 0.16, w * 0.56, h * 0.32, 8), "#c7ece2", 3);
  for (const [bx, by, br] of [[x + w * 0.38, y - h * 0.7, 14], [x + w * 0.52, y - h * 0.95, 9], [x + w * 0.25, y - h * 0.98, 7]]) shape(c, () => ell(c, bx, by, br, br), "rgba(255,255,255,0.85)", 3);
};
// the 0..14 colour chart as a strip of cells, top left (x, y), cell size s, with the numbers under it
const chart = (c: Ctx, x: number, y: number, s: number, numbers = true) => {
  PH.forEach((col, i) => shape(c, () => c.rect(x + i * s, y, s, s), col, 0));
  shape(c, () => rrect(c, x, y, s * 15, s, 4), "rgba(0,0,0,0)", 5);
  for (let i = 1; i < 15; i++) line(c, [[x + i * s, y], [x + i * s, y + s]], 2, "rgba(43,35,64,0.5)");
  if (numbers) for (let i = 0; i < 15; i++) { const t = String(i), w = t.length * s * 0.38 - s * 0.1; write(c, t, x + i * s + s / 2 - w / 2 - (t.length === 1 ? s * 0.06 : 0), y + s + 12, s * 0.5, INK, 5); }
};
// a pH strip hanging straight down from (x, y) (its top), length len, the bottom tip coloured
const strip = (c: Ctx, x: number, y: number, len: number, col: string, w = 34) => {
  shape(c, () => rrect(c, x - w / 2, y, w, len, 6), PAPER, 4);
  shape(c, () => rrect(c, x - w / 2 + 3, y + len - w * 1.6, w - 6, w * 1.4, 4), col, 0);
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 10, y + h + 6, w * 0.52, 10); shape(c, () => c.rect(x, y, w, h), WHITE, 5); };
// a low wooden table: top at y from x0 to x1, legs down to the floor at fy
const table = (c: Ctx, x0: number, x1: number, y: number, fy: number) => {
  for (const lx of [x0 + 40, x1 - 40]) shape(c, () => c.rect(lx - 14, y, 28, fy - y), COL.woodDk, 5);
  shape(c, () => rrect(c, x0, y - 24, x1 - x0, 30, 6), COL.wood, 5);
};
// a small jar of dark food colour standing with its bottom at (x, y)
const dyeBottle = (c: Ctx, x: number, y: number, h: number) => { shadow(c, x + 8, y + 5, h * 0.28, h * 0.06); bottle(c, x, y - h, Math.PI / 2, h, h * 0.42, DYE, true); };

// ---------------------------------------------------------------- set-up cards: e1, the antacid showdown
// 1. four powders in four bowls (cooking soda, antacid, eggshell, salt), five glasses A..D and T
const e1s0 = (c: Ctx) => {
  ground(c);
  const bx = [175, 420, 665, 910];
  bx.forEach((x, i) => { bowl(c, x, 330, 85); heap(c, x, 330, 85, i); });
  // what each powder is: a soda tub, a tablet, an egg, a salt sprinkler
  const ty = 470;
  shape(c, () => rrect(c, bx[0] - 30, ty - 28, 60, 56, 6), COL.orange, 4); shape(c, () => rrect(c, bx[0] - 34, ty - 34, 68, 16, 4), WHITE, 4);
  shape(c, () => ell(c, bx[1], ty, 30, 30), WHITE, 4); line(c, [[bx[1] - 18, ty], [bx[1] + 18, ty]], 4, COL.greyDk);
  shape(c, () => { c.moveTo(bx[2], ty - 36); c.bezierCurveTo(bx[2] + 34, ty - 36, bx[2] + 34, ty + 30, bx[2], ty + 30); c.bezierCurveTo(bx[2] - 34, ty + 30, bx[2] - 34, ty - 36, bx[2], ty - 36); c.closePath(); }, "#fff6e4", 4);
  shape(c, () => rrect(c, bx[3] - 22, ty - 20, 44, 52, 6), COL.steelIn, 4); shape(c, () => rrect(c, bx[3] - 24, ty - 36, 48, 20, 6), COL.steel, 4);
  for (const [dx, dy] of [[-10, -28], [0, -30], [10, -28]]) shape(c, () => ell(c, bx[3] + dx, ty + dy, 3, 3), INK, 0);
  // five empty glasses in a row, each with its letter
  ["A", "B", "C", "D", "T"].forEach((t, i) => { const x = 130 + i * 205; glass(c, x, 960, 130, 210); tag(c, x, 860, t, 42); });
};
// 2. vinegar poured from a bottle into a glass that already holds cabbage water: it turns pink
const e1s1 = (c: Ctx) => {
  ground(c);
  jug(c, 190, 900, 210, 270, 0.6, PURPLE);
  glass(c, 540, 900, 230, 330, 0.45, PINK);
  const a = -Math.PI / 4, mx = 610, my = 470;
  pour(c, [mx, my], [560, 752], VINEGAR, 16);
  bottle(c, mx, my, a, 300, 110, VINEGAR);
  grip(c, mx + 180 * Math.cos(a), my + 180 * Math.sin(a), a - Math.PI / 2);
};
// 3. a level quarter-teaspoon of powder tipped into the pink glass; small bubbles rise
const e1s2 = (c: Ctx) => {
  ground(c);
  glass(c, 520, 900, 240, 340, 0.5, PINK);
  fizz(c, 440, 760, 600, 880, 3, 12);
  const a = -0.6, bx = 560, by = 520;
  spoon(c, bx, by, a, 170, { col: WHITE, powder: true });
  const r = rnd(11);
  for (let i = 0; i < 11; i++) { const y = 560 + i * 17 + r() * 8, x = 530 - i * 4 + r() * 24; shape(c, () => ell(c, x, y, 6 + r() * 3, 5), WHITE, 3); }
  grip(c, bx + 140 * Math.cos(a), by + 140 * Math.sin(a), a - Math.PI / 2);
};
// 4. the pink glass beside the purple target T; the child holds the score sheet and writes a number
const e1s3 = (c: Ctx) => {
  ground(c);
  table(c, 70, 520, 700, 1000);
  glass(c, 190, 690, 150, 230, 0.5, PINK);
  glass(c, 400, 690, 150, 230, 0.5, PURPLE);
  tag(c, 400, 560, "T", 40);
  const { handL, handR } = person(c, 790, 1000, 600, { reachL: [660, 700], reachR: [800, 730], dir: -1 });
  // the sheet hangs from the left hand; a small table of letters and scoop counts on it
  const px = handL[0] - 8, py = handL[1] - 10;
  sheet(c, px, py, 180, 210);
  for (let i = 0; i < 4; i++) { const ry = py + 20 + i * 46; line(c, [[px + 14, ry + 40], [px + 166, ry + 40]], 2, COL.grey); letters(c, "ABCD"[i], px + 24, ry + 4, 30, INK, 5); if (i < 3) write(c, ["3", "5", "7"][i], px + 110, ry + 4, 30, INK, 5); }
  line(c, [[px + 90, py + 14], [px + 90, py + 196]], 2, COL.grey);
  // the pencil in the right hand, its tip on the sheet
  const d = [-0.59, 0.81], tip = [handR[0] + d[0] * 70, handR[1] + d[1] * 70], top = [handR[0] - d[0] * 60, handR[1] - d[1] * 60];
  line(c, [top, tip], 22, INK); line(c, [top, [tip[0] - d[0] * 18, tip[1] - d[1] * 18]], 12, COL.yellow); line(c, [[tip[0] - d[0] * 18, tip[1] - d[1] * 18], tip], 7, "#e9c9a4");
  // the hand drawn again over the pencil so it holds it
  shape(c, () => ell(c, handR[0], handR[1], 24, 19, 0.9), SKIN.child, 5);
};

// ---------------------------------------------------------------- set-up cards: e2, the ten-times ladder
const CUPX = (i: number) => 120 + i * 140;
const FADE = [1, 0.62, 0.38, 0.22, 0.12, 0.06, 0.025];
// 1. seven cups numbered 0 to 6, a bottle of dark colour and a jug of water behind them
const e2s0 = (c: Ctx) => {
  ground(c);
  dyeBottle(c, 330, 600, 200);
  jug(c, 740, 600, 220, 280, 0.7, COL.water);
  for (let i = 0; i < 7; i++) { glass(c, CUPX(i), 940, 110, 170); tag(c, CUPX(i), 860, String(i), 36); }
};
// 2. cup 0: a teaspoon of water going in from the left, three drops of colour falling from the bottle on the right
const e2s1 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 900, 240, 330, 0.4, mix("#8fc3ea", DYE, 0.25));
  tag(c, 540, 820, "0", 40);
  // the spoon of water from the left
  const a = Math.PI + 0.55, bx = 430, by = 560;
  pour(c, [bx + 36, by + 18], [500, 768], COL.water, 12);
  spoon(c, bx, by, a, 170, { col: COL.water });
  grip(c, bx + 140 * Math.cos(a), by + 140 * Math.sin(a), a + Math.PI / 2);
  // the bottle of colour from the right, three drops below its mouth
  const b = -0.9, mx = 600, my = 470;
  drop(c, 600, 560, 14, DYE); drop(c, 600, 640, 14, DYE); drop(c, 600, 720, 14, DYE);
  bottle(c, mx, my, b, 200, 80, DYE);
  grip(c, mx + 130 * Math.cos(b), my + 130 * Math.sin(b), b - Math.PI / 2);
  write(c, "3", 700, 600, 70, INK, 8);
};
// 3. one teaspoon carried from cup 0 to cup 1, which already holds plain water
const e2s2 = (c: Ctx) => {
  ground(c);
  glass(c, 280, 900, 220, 300, 0.45, DYE); tag(c, 280, 820, "0", 40);
  glass(c, 800, 900, 220, 300, 0.42, COL.water); tag(c, 800, 820, "1", 40);
  arrow(c, [[320, 560], [540, 450], [690, 520]]);
  const a = -0.5, bx = 760, by = 560;
  pour(c, [bx - 20, by + 26], [790, 774], DYE, 12);
  spoon(c, bx, by, a, 170, { col: DYE });
  grip(c, bx + 140 * Math.cos(a), by + 140 * Math.sin(a), a - Math.PI / 2);
};
// 4. the seven cups against a sheet of white paper: dark red fading to nearly clear
const e2s3 = (c: Ctx) => {
  ground(c);
  sheet(c, 60, 300, 960, 580);
  for (let i = 0; i < 7; i++) { glass(c, CUPX(i), 940, 110, 190, 0.6, mix("#d6ecfa", DYE, FADE[i])); tag(c, CUPX(i), 790, String(i), 36); }
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the race. Four glasses after their powders: the count of scoops above each; salt never wins
const flowE1 = (c: Ctx) => {
  ground(c);
  const xs = [160, 410, 660, 910], cols = [PURPLE, PURPLE, mix(PINK, PURPLE, 0.75), PINK], n = ["2", "3", "6", ""];
  xs.forEach((x, i) => {
    spoon(c, x - 50, 330, Math.PI + 0.4, 90, { col: WHITE, powder: true });
    if (n[i]) write(c, n[i], x + 20, 290, 80, INK, 9);
    else { line(c, [[x + 10, 240], [x + 70, 300]], 10, RED); line(c, [[x + 70, 240], [x + 10, 300]], 10, RED); }
    glass(c, x, 760, 170, 280, 0.5, cols[i]);
    tag(c, x, 660, "ABCD"[i], 40);
    bowl(c, x, 930, 60); heap(c, x, 930, 60, i);
  });
};
// flow.e2: the ladder. Seven cups down seven steps, each ten times paler than the one above
const flowE2 = (c: Ctx) => {
  ground(c);
  const pts: number[][] = [[40, 400]];
  for (let i = 0; i < 7; i++) { pts.push([40 + i * 143, 400 + i * 70]); pts.push([40 + (i + 1) * 143, 400 + i * 70]); }
  pts.push([1041, 1000], [40, 1000]);
  shape(c, () => polyP(c, pts), COL.wood);
  for (let i = 0; i < 7; i++) { const x = 112 + i * 143, y = 400 + i * 70; shape(c, () => c.rect(40 + i * 143, y + 48, 143, 22), COL.woodDk, 0); glass(c, x, y - 2, 100, 150, 0.6, mix("#d6ecfa", DYE, FADE[i])); tag(c, x, y - 85, String(i), 34); }
  shape(c, () => polyP(c, pts), "rgba(0,0,0,0)", 6);
};
// flow.a1: the Eno mystery. Fruit salt from a spoon fizzes in purple cabbage water; a question mark
const flowA1 = (c: Ctx) => {
  ground(c);
  // the sachet
  shadow(c, 220, 905, 110, 20);
  shape(c, () => rrect(c, 110, 620, 220, 280, 10), "#e9f3df", 6);
  shape(c, () => rrect(c, 110, 620, 220, 60, 10), GREEN, 5);
  shape(c, () => ell(c, 220, 790, 62, 62), COL.orange, 5); shape(c, () => ell(c, 220, 790, 40, 40), COL.yellow, 4);
  for (let i = 0; i < 9; i++) line(c, [[120 + i * 25, 625], [132 + i * 25, 640]], 3, INK);
  // the glass, fizzing
  glass(c, 620, 900, 270, 370, 0.55, mix(PURPLE, "#4f7fd0", 0.5));
  fizz(c, 520, 720, 720, 880, 21, 22);
  shape(c, () => { c.moveTo(498, 700); c.quadraticCurveTo(540, 650, 580, 690); c.quadraticCurveTo(620, 640, 660, 690); c.quadraticCurveTo(700, 650, 742, 700); c.closePath(); }, "rgba(255,255,255,0.9)", 4);
  const a = -0.55, bx = 640, by = 500;
  spoon(c, bx, by, a, 170, { col: WHITE, powder: true });
  const r = rnd(4); for (let i = 0; i < 8; i++) shape(c, () => ell(c, 612 - i * 6 + r() * 20, 545 + i * 18, 6, 5), WHITE, 3);
  grip(c, bx + 140 * Math.cos(a), by + 140 * Math.sin(a), a - Math.PI / 2);
  letters(c, "?", 300, 330, 200, RED, 22);
};
// flow.a2: pH strips in lemon juice, water and soapy water, read against the chart
const flowA2 = (c: Ctx) => {
  ground(c);
  chart(c, 90, 160, 60);
  const cups: [number, string, string][] = [[220, "#f3dd6a", PH[2]], [540, COL.water, PH[7]], [860, "#e9f0f4", PH[9]]];
  cups.forEach(([x, col, tip]) => { glass(c, x, 940, 200, 300, 0.55, col); strip(c, x + 30, 560, 300, tip); });
  fizz(c, 790, 790, 930, 900, 9, 8);
  lemon(c, 90, 980, 50);
  soap(c, 1000, 990, 130, 60);
};
// flow.a3: the label hunt. Toothpaste, soap, an antacid strip under a magnifying glass, a soda tub, tamarind
const flowA3 = (c: Ctx) => {
  ground(c);
  const gy = 780;
  // toothpaste tube lying down
  shadow(c, 140, gy + 6, 110, 16);
  shape(c, () => { c.moveTo(40, gy - 60); c.lineTo(200, gy - 70); c.lineTo(200, gy + 2); c.lineTo(40, gy - 8); c.closePath(); }, WHITE, 5);
  shape(c, () => c.rect(70, gy - 52, 110, 30), COL.blue, 4);
  shape(c, () => rrect(c, 200, gy - 62, 34, 60, 6), COL.blueDk, 5);
  soap(c, 325, gy - 40, 160, 80);
  // the antacid strip of tablets
  shadow(c, 550, gy + 6, 110, 16);
  shape(c, () => rrect(c, 440, gy - 100, 200, 100, 8), COL.steelIn, 5);
  for (let i = 0; i < 8; i++) shape(c, () => ell(c, 470 + (i % 4) * 47, gy - 75 + Math.floor(i / 4) * 50, 17, 17), WHITE, 4);
  // soda tub
  shadow(c, 770, gy + 6, 80, 14);
  shape(c, () => rrect(c, 700, gy - 140, 130, 140, 10), COL.orange, 5); shape(c, () => rrect(c, 694, gy - 158, 142, 30, 8), WHITE, 5);
  shape(c, () => rrect(c, 720, gy - 100, 90, 60, 6), WHITE, 4);
  // tamarind packet
  shadow(c, 960, gy + 6, 70, 14);
  shape(c, () => rrect(c, 890, gy - 130, 140, 130, 8), "#7a4a2a", 5);
  for (let i = 0; i < 7; i++) line(c, [[895 + i * 20, gy - 128], [905 + i * 20, gy - 140]], 3, INK);
  shape(c, () => ell(c, 960, gy - 65, 40, 24, 0.3), "#5a3016", 4);
  // the magnifying glass over the antacid strip, handle straight down
  line(c, [[540, gy - 50 + 118], [540, gy + 150]], 30, INK); line(c, [[540, gy - 50 + 118], [540, gy + 150]], 18, COL.woodDk);
  shape(c, () => ell(c, 540, gy - 50, 125, 125), "rgba(214,236,250,0.35)", 16);
  shape(c, () => ell(c, 540, gy - 50, 125, 125), "rgba(0,0,0,0)", 6);
  shine(c, [[470, gy - 110], [500, gy - 140]], 10);
};
// flow.p1: the water diary. Six numbered cups of water on a steel tray, a pH strip in the first
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 950, 470, 40);
  shape(c, () => rrect(c, 60, 700, 960, 230, 40), COL.steel, 6);
  shape(c, () => rrect(c, 90, 720, 900, 170, 30), COL.steelIn, 4);
  const cols = [COL.water, COL.water, COL.water, "#f1e9c6", "#9a6b45", COL.water];
  cols.forEach((col, i) => { const x = 165 + i * 150; glass(c, x, 860, 120, 190, 0.55, col); tag(c, x, 600, String(i + 1), 34); });
  strip(c, 212, 560, 220, PH[7]);
  chart(c, 300, 220, 48);
};
// term.3: an indicator. Cabbage water pink with lemon, purple with water, green with soap
const termIndicator = (c: Ctx) => {
  ground(c);
  const xs = [220, 540, 860], cols = [PINK, PURPLE, GREEN];
  xs.forEach((x, i) => glass(c, x, 720, 200, 300, 0.6, cols[i]));
  lemon(c, 220, 930, 70);
  glass(c, 540, 1010, 120, 160, 0.6, COL.water);
  soap(c, 860, 940, 190, 90);
};
// term.0: pH. The scale from 0 to 14 with a lemon at 2, water at 7 and soap at 9
const termPH = (c: Ctx) => {
  ground(c);
  letters(c, "pH", 440, 110, 120, INK, 14);
  const x0 = 60, s = 64, y = 560;
  chart(c, x0, y, s);
  const cx = (i: number) => x0 + (i + 0.5) * s;
  for (const i of [2, 7, 9]) line(c, [[cx(i), y - 30], [cx(i), y - 4]], 5, INK);
  lemon(c, cx(2), 440, 56);
  glass(c, cx(7), 500, 90, 150, 0.6, COL.water);
  soap(c, cx(9) + 18, 440, 130, 62);
};
// term.11: neutralise. A scoop of powder goes into the pink glass; it turns purple
const termNeutralise = (c: Ctx) => {
  ground(c);
  glass(c, 250, 880, 230, 330, 0.5, PINK);
  fizz(c, 180, 740, 320, 860, 6, 10);
  glass(c, 830, 880, 230, 330, 0.5, PURPLE);
  arrow(c, [[420, 720], [660, 720]]);
  const a = Math.PI + 0.6, bx = 300, by = 520;
  spoon(c, bx, by, a, 170, { col: WHITE, powder: true });
  const r = rnd(2); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 300 - i * 3 + r() * 24, 560 + i * 17, 6, 5), WHITE, 3);
  grip(c, bx + 140 * Math.cos(a), by + 140 * Math.sin(a), a + Math.PI / 2);
};
// term.10: antacid. A white tablet drops into the acid; the acid line falls from where it was
const termAntacid = (c: Ctx) => {
  ground(c);
  glass(c, 540, 900, 300, 400, 0.36, PINK);
  fizz(c, 430, 780, 650, 880, 13, 16);
  // where the acid used to reach: a dashed line, and the red arrow down to where it is now
  const oldY = 900 - 400 * 0.62, newY = 900 - 400 * 0.36;
  c.setLineDash([16, 14]); line(c, [[400, oldY], [680, oldY]], 6, COL.greyDk); c.setLineDash([]);
  arrow(c, [[760, oldY], [760, newY - 10]]);
  // the tablet, falling, with speed lines above it
  shape(c, () => ell(c, 540, 430, 70, 38, -0.35), WHITE, 6); line(c, [[495, 420], [585, 446]], 5, COL.grey);
  for (const dx of [-40, 0, 40]) line(c, [[540 + dx, 300], [540 + dx, 360]], 6, COL.greyDk);
  drop(c, 470, 600, 10, PINK); drop(c, 620, 630, 9, PINK);
};

export const ic_chemistryAcidsAndBasesL4 = cards("sci.chemistry.acids-and-bases.L4", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, termIndicator, termPH, termNeutralise, termAntacid,
]);
