import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, bowl, seed, leaf, write, cards } from "./flatKit";

// sci.what-is-life.cells.L4 · set-up cards for the two experiments (potato strips, naked egg), then
// picture cards for each experiment, activity and project, and three explanations.
// Potato flesh is pale yellow, vinegar is pale and clear, honey is golden, the naked egg is a see-through
// peach with the yolk showing. The same child (orange top) and grown-up (blue top) as on every card.

const POT = "#f3dc8e", POTDK = "#d4b25a", CURD = "#fbf7ee", DOUGH = "#e9c892", VINEGAR = "rgba(240,235,205,0.9)", CLOUDY = "#ddd3a6";
const HONEY = "rgba(242,158,24,0.92)", EGGSHELL = "#f6e9d2", EGGSHELLDK = "#d9c39a", EGGNAKED = "rgba(250,222,180,0.9)", YOLK = "#f3b640", STRING = "#efe3c2";
const ICE = "rgba(214,238,250,0.9)", ICEDK = "#9fcbe8", RAISIN = "#6b3f63", RAISINDK = "#4a2a45", AMOEBA = "#d9c7ec", PARAM = "#f3d9a0";

const table = (c: Ctx, y: number) => { shape(c, () => rrect(c, -20, y, 1120, 110, 4), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(-14, y + 72, 1108, 34); };
// A, B and C as strokes, for cup labels only
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.32, 0], [0.64, 1]], [[0.12, 0.66], [0.52, 0.66]]],
  B: [[[0, 1], [0, 0], [0.4, 0], [0.56, 0.1], [0.56, 0.38], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.6, 0.58], [0.6, 0.88], [0.44, 1], [0, 1]]],
  C: [[[0.6, 0.14], [0.44, 0], [0.16, 0], [0, 0.2], [0, 0.8], [0.16, 1], [0.44, 1], [0.6, 0.86]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, w = 6) => LET[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w));
const tag = (c: Ctx, x: number, y: number, ch: string, s = 1) => { shape(c, () => rrect(c, x - 36 * s, y - 40 * s, 72 * s, 80 * s, 8), WHITE, 5); letter(c, ch, x - 20 * s, y - 24 * s, 48 * s, 6); };
// a paper tag with a drawing on it: a water drop (plain water) or a heap of salt grains (salt water)
const iconTag = (c: Ctx, x: number, y: number, salt: boolean) => {
  shape(c, () => rrect(c, x - 60, y - 40, 120, 80, 8), WHITE, 5);
  if (salt) { shape(c, () => { c.moveTo(x - 40, y + 22); c.quadraticCurveTo(x, y - 40, x + 40, y + 22); c.closePath(); }, "#f4f1e4", 5); for (let i = 0; i < 7; i++) shape(c, () => ell(c, x - 24 + i * 8, y + 6 + (i % 2) * 8, 3.5, 3.5), WHITE, 2); }
  else shape(c, () => { c.moveTo(x, y - 30); c.quadraticCurveTo(x + 22, y, x + 22, y + 8); c.arc(x, y + 8, 22, 0, Math.PI); c.quadraticCurveTo(x - 22, y, x, y - 30); c.closePath(); }, COL.water, 5);
};
// a potato strip along a path: pale yellow, a darker shade along its lower side
const strip = (c: Ctx, pts: number[][], w = 34) => { line(c, pts, w + 10, INK); line(c, pts, w, POT); line(c, pts.map(([x, y]) => [x, y + w * 0.26]), w * 0.34, POTDK); };
// a clear tumbler like the kit's glass(), with a callback for what sits inside the liquid
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, inside?: () => void) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, ly = y - h * fill, lw = bot + (top - bot) * fill;
  const body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  if (fill > 0) shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, liquid, 0);
  inside?.();
  if (fill > 0) shape(c, () => ell(c, x, ly, lw, w * 0.07), "rgba(233,243,255,0.7)", 0);
  shape(c, body, COL.glass, 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
// a straight glass jar with a rim band; bottom centre (x, y)
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, inside?: () => void) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 22);
  if (fill > 0) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = liquid; c.fillRect(x - w / 2, y - h * fill, w, h * fill); c.restore(); }
  inside?.();
  if (fill > 0) shape(c, () => ell(c, x, y - h * fill, w / 2, w * 0.06), "rgba(255,255,255,0.45)", 0);
  shape(c, body, "rgba(214,236,250,0.28)", 5);
  shape(c, () => rrect(c, x - w / 2 - 8, y - h - 6, w + 16, 34, 10), COL.glass, 5);
  shine(c, [[x - w * 0.38, y - h * 0.8], [x - w * 0.38, y - h * 0.25]], 7);
};
const eggPath = (c: Ctx, x: number, y: number, r: number) => {
  c.moveTo(x, y - r * 1.25); c.bezierCurveTo(x + r * 0.75, y - r * 1.25, x + r, y - r * 0.1, x + r, y + r * 0.3); c.bezierCurveTo(x + r, y + r * 0.95, x + r * 0.55, y + r * 1.1, x, y + r * 1.1);
  c.bezierCurveTo(x - r * 0.55, y + r * 1.1, x - r, y + r * 0.95, x - r, y + r * 0.3); c.bezierCurveTo(x - r, y - r * 0.1, x - r * 0.75, y - r * 1.25, x, y - r * 1.25); c.closePath();
};
// an egg: with its shell, naked (see-through, yolk showing) or patchy (most of the shell gone)
const egg = (c: Ctx, x: number, y: number, r: number, kind: "shell" | "naked" | "patchy") => {
  const p = () => eggPath(c, x, y, r);
  shape(c, p, kind === "shell" ? EGGSHELL : EGGNAKED, 5);
  if (kind !== "shell") { c.save(); c.beginPath(); p(); c.clip(); c.globalAlpha = 0.5; shape(c, () => ell(c, x, y + r * 0.2, r * 0.5, r * 0.45), YOLK, 0); c.globalAlpha = 1; c.restore(); }
  shade(c, p, kind === "shell" ? EGGSHELLDK : "#d9a46c", r * 0.28, r * 0.1, 0.35);
  if (kind === "patchy") { shape(c, () => ell(c, x - r * 0.45, y - r * 0.55, r * 0.3, r * 0.2, 0.6), EGGSHELL, 3); shape(c, () => ell(c, x + r * 0.5, y + r * 0.5, r * 0.25, r * 0.18, -0.4), EGGSHELL, 3); }
};
const bubble = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.85)", 2.5);
// string tied round an egg's middle: the front half of the loop and two loose ends
const stringBand = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0.05, Math.PI - 0.05); c.strokeStyle = INK; c.lineWidth = 11; c.lineCap = "round"; c.stroke(); c.strokeStyle = STRING; c.lineWidth = 5; c.stroke();
  line(c, [[x + rx * 0.15, y + ry], [x + rx * 0.3, y + ry + rx * 0.45]], 10, INK); line(c, [[x + rx * 0.15, y + ry], [x + rx * 0.3, y + ry + rx * 0.45]], 4, STRING);
  line(c, [[x + rx * 0.15, y + ry], [x - rx * 0.05, y + ry + rx * 0.5]], 10, INK); line(c, [[x + rx * 0.15, y + ry], [x - rx * 0.05, y + ry + rx * 0.5]], 4, STRING);
};
// points along a quadratic curve from a to b bending toward cp
const qpts = (a: number[], b: number[], cp: number[], n = 12) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * cp[0] + t * t * b[0], u * u * a[1] + 2 * u * t * cp[1] + t * t * b[1]]; });
// a round kitchen timer showing t minutes
const timer = (c: Ctx, x: number, y: number, t: string, r = 70) => {
  shadow(c, x + 8, y + r + 4, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - 16, y - r - 18, 32, 22, 6), COL.red, 4);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 4); }
  const a = (Number(t) / 60) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 7, RED); shape(c, () => ell(c, x, y, 7, 7), INK, 0);
  write(c, t, x - r * 0.32, y + r * 0.18, r * 0.4, INK, 5);
};
// a teaspoon from its handle end (hx, hy) to the middle of its bowl (bx, by), with a heap of salt on it
const spoon = (c: Ctx, hx: number, hy: number, bx: number, by: number, salt = true) => {
  const an = Math.atan2(by - hy, bx - hx), ex = bx - Math.cos(an) * 34, ey = by - Math.sin(an) * 34;
  line(c, [[hx, hy], [ex, ey]], 22, INK); line(c, [[hx, hy], [ex, ey]], 12, COL.steel);
  shape(c, () => ell(c, bx, by, 44, 28, an), COL.steel, 5); shape(c, () => ell(c, bx, by, 32, 18, an), COL.steelIn, 3);
  if (salt) { shape(c, () => ell(c, bx, by - 8, 30, 18, an), "#f8f6ee", 4); for (let i = 0; i < 6; i++) shape(c, () => ell(c, bx - 20 + i * 8, by - 10 + (i % 2) * 6, 3, 3), WHITE, 1.5); }
};
const grains = (c: Ctx, pts: number[][], r = 4) => pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, r, r), WHITE, 2));
// the kit's side-view hand, but pointing left (fingers to the left, sleeve to the right)
const handLeft = (c: Ctx, x: number, y: number, s: number, skin: string, sleeve: string, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, 0, s, skin, sleeve, open); c.restore(); };
// a torch held with its middle at (x, y), pointing right; the lens is at x + len * 0.5
const torch = (c: Ctx, x: number, y: number, len: number) => {
  shape(c, () => rrect(c, x - len * 0.5, y - 26, len * 0.78, 52, 10), COL.black, 5);
  shape(c, () => polyP(c, [[x + len * 0.25, y - 30], [x + len * 0.5, y - 44], [x + len * 0.5, y + 44], [x + len * 0.25, y + 30]]), COL.grey, 5);
  shape(c, () => rrect(c, x + len * 0.46, y - 44, 14, 88, 4), COL.yellow, 4);
  shape(c, () => rrect(c, x - len * 0.3, y - 36, 30, 16, 5), COL.grey, 4);
};
// a bunch of coriander standing (up) or drooping over the rim; base of the stems at (x, y), rim at ry
const herb = (c: Ctx, x: number, y: number, ry: number, up: boolean, seedN: number) => {
  const r = rnd(seedN), lf = (lx: number, ly: number, an: number, n: number) => { for (let k = 0; k < 3; k++) leaf(c, lx, ly, 42 + r() * 10, an + (k - 1) * 0.55 + (up ? 0 : 0.2), COL.leaf); if (n > 1) leaf(c, lx, ly, 30, an + 1.6, COL.leafDk); };
  for (let i = 0; i < 5; i++) {
    const s = (i - 2) * 0.5;
    if (up) { const top = [x + s * 110, ry - 190 - r() * 60], pts = qpts([x + s * 18, y], top, [x + s * 50, ry - 40]); line(c, pts, 12, INK); line(c, pts, 6, COL.green); lf(top[0], top[1], -Math.PI / 2 + s * 0.5, 2); }
    else { const side = i < 2 ? -1 : 1, end = [x + side * (150 + r() * 40), ry + 120 + r() * 70], pts = qpts([x + s * 18, y], end, [x + side * 60, ry - 110]); line(c, pts, 12, INK); line(c, pts, 6, COL.green); lf(end[0], end[1], Math.PI / 2 + side * 0.3, 1); }
  }
};
// an ice cube seen a little from above; (x, y) is its front bottom corner, s the edge
const cubeIso = (c: Ctx, x: number, y: number, s: number, top: string, left: string, right: string, ln = 6) => {
  const R = [0.866 * s, -0.5 * s], L = [-0.866 * s, -0.5 * s], U = [0, -s];
  shape(c, () => polyP(c, [[x, y], [x + L[0], y + L[1]], [x + L[0] + U[0], y + L[1] + U[1]], [x + U[0], y + U[1]]]), left, ln);
  shape(c, () => polyP(c, [[x, y], [x + R[0], y + R[1]], [x + R[0] + U[0], y + R[1] + U[1]], [x + U[0], y + U[1]]]), right, ln);
  shape(c, () => polyP(c, [[x + U[0], y + U[1]], [x + U[0] + R[0], y + U[1] + R[1]], [x + U[0] + R[0] + L[0], y + U[1] + R[1] + L[1]], [x + U[0] + L[0], y + U[1] + L[1]]]), top, ln);
};
const raisin = (c: Ctx, x: number, y: number, plump: boolean, rot: number) => {
  const rx = plump ? 26 : 17, ry = plump ? 32 : 22;
  shape(c, () => ell(c, x, y, rx, ry, rot), plump ? RAISIN : RAISINDK, 5);
  if (plump) shine(c, [[x - rx * 0.4, y - ry * 0.5], [x - rx * 0.3, y - ry * 0.05]], 6);
  else for (let k = -1; k <= 1; k++) line(c, [[x + k * 8 - 3, y - 12], [x + k * 8 + 2, y + 12]], 3, "#2a1a28");
};
const amoeba = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => {
    c.moveTo(x - s, y); c.bezierCurveTo(x - s, y - s * 0.9, x - s * 0.3, y - s * 0.85, x + s * 0.2, y - s * 0.6); c.bezierCurveTo(x + s * 0.6, y - s * 0.55, x + s * 1.35, y - s * 0.55, x + s * 1.45, y - s * 0.05);
    c.bezierCurveTo(x + s * 1.55, y + s * 0.35, x + s * 1.2, y + s * 0.6, x + s * 0.95, y + s * 0.5); c.bezierCurveTo(x + s * 0.82, y + s * 0.44, x + s * 0.92, y + s * 0.12, x + s * 0.74, y + s * 0.1);
    c.bezierCurveTo(x + s * 0.58, y + s * 0.1, x + s * 0.62, y + s * 0.6, x + s * 0.3, y + s * 0.82); c.bezierCurveTo(x - s * 0.3, y + s * 1.05, x - s, y + s * 0.75, x - s, y); c.closePath();
  };
  shape(c, p, AMOEBA, 6); shade(c, p, "#b9a2d6", s * 0.12, s * 0.1, 0.5);
  shape(c, () => ell(c, x - s * 0.3, y + s * 0.05, s * 0.22, s * 0.19), COL.purple, 4);
  for (let i = 0; i < 5; i++) shape(c, () => ell(c, x - s * 0.55 + i * s * 0.22, y + s * 0.5 - (i % 2) * s * 0.7, s * 0.05, s * 0.05), "#8b6cc9", 2);
  shape(c, () => ell(c, x + s * 1.1, y + s * 0.1, s * 0.2, s * 0.2), COL.greenLt, 4); shape(c, () => ell(c, x + s * 1.1, y + s * 0.1, s * 0.1, s * 0.07), COL.greenDk, 0);
};
const paramecium = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < 44; i++) { const a = (i / 44) * Math.PI * 2, px = Math.cos(a) * s, py = Math.sin(a) * s * 0.42; line(c, [[px, py], [px + Math.cos(a) * 16, py + Math.sin(a) * 16]], 3, INK); }
  const p = () => { c.moveTo(-s, 0); c.bezierCurveTo(-s, -s * 0.5, -s * 0.2, -s * 0.46, s * 0.3, -s * 0.4); c.bezierCurveTo(s * 0.8, -s * 0.34, s, -s * 0.2, s, 0); c.bezierCurveTo(s, s * 0.3, s * 0.6, s * 0.44, 0, s * 0.42); c.bezierCurveTo(-s * 0.6, s * 0.4, -s, s * 0.4, -s, 0); c.closePath(); };
  shape(c, p, PARAM, 6); shade(c, p, "#dcb86f", s * 0.1, s * 0.12, 0.45);
  shape(c, () => ell(c, -s * 0.1, 0, s * 0.2, s * 0.14, 0.3), "#c98a4a", 4);
  line(c, [[s * 0.3, -s * 0.3], [s * 0.1, 0], [s * 0.4, s * 0.25]], 4, "#b07838");
  for (const vx of [-s * 0.6, s * 0.65]) { for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; line(c, [[vx, 0], [vx + Math.cos(a) * s * 0.1, Math.sin(a) * s * 0.1]], 3, "#b07838"); } shape(c, () => ell(c, vx, 0, s * 0.045, s * 0.045), WHITE, 2); }
  c.restore();
};
const euglena = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-s, 0); c.bezierCurveTo(-s * 0.5, -s * 0.5, s * 0.5, -s * 0.42, s, 0); c.bezierCurveTo(s * 0.5, s * 0.42, -s * 0.5, s * 0.5, -s, 0); c.closePath(); };
  shape(c, p, COL.green, 6); shade(c, p, COL.greenDk, s * 0.08, s * 0.1, 0.4);
  for (let i = 0; i < 5; i++) shape(c, () => ell(c, -s * 0.6 + i * s * 0.28, (i % 2 ? 1 : -1) * s * 0.12, s * 0.11, s * 0.07, 0.4), COL.greenDk, 3);
  shape(c, () => ell(c, s * 0.72, -s * 0.09, s * 0.07, s * 0.07), COL.red, 3);
  line(c, qpts([s, 0], [s * 1.9, -s * 0.35], [s * 1.35, s * 0.4]), 5, INK);
  c.restore();
};

// ---------------------------------------------------------------- set-up cards: e1 potato strips
const setupE1_0 = (c: Ctx) => {
  ground(c); table(c, 890);
  shadow(c, 560, 868, 450, 36);
  shape(c, () => rrect(c, 90, 430, 900, 430, 30), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(102, 830, 876, 24);
  // the rest of the potato, cut face toward us, at the left
  shape(c, () => ell(c, 240, 690, 140, 105, -0.15), COL.brown, 6); shape(c, () => ell(c, 240, 690, 112, 80, -0.15), POT, 4);
  const r = rnd(3); for (let i = 0; i < 7; i++) shape(c, () => ell(c, 150 + r() * 180, 620 + r() * 140, 5, 4), COL.soilDk, 0);
  // five strips already cut, lying flat on the board
  for (let i = 0; i < 5; i++) strip(c, [[650, 620 + i * 44], [955, 620 + i * 44]], 30);
  // the block being cut: top face and front face
  shape(c, () => polyP(c, [[400, 600], [590, 600], [625, 555], [435, 555]]), POT, 5); shape(c, () => rrect(c, 400, 600, 190, 80, 4), POTDK, 5);
  // the knife, its edge resting in the top of the block, handle to the right in a grown-up's hand
  shape(c, () => polyP(c, [[690, 500], [690, 572], [420, 572], [365, 545], [380, 500]]), COL.steel, 5); shine(c, [[420, 518], [640, 518]], 7);
  shape(c, () => rrect(c, 680, 508, 140, 54, 14), COL.black, 5);
  handLeft(c, 845, 535, 1.45, SKIN.adult, CLOTH.adult);
};
const setupE1_1 = (c: Ctx) => {
  ground(c); table(c, 830);
  const r = rnd(11);
  [220, 540, 860].forEach((x, i) => tumbler(c, x, 820, 200, 320, 0.6, COL.water, () => { if (i === 2) grains(c, Array.from({ length: 14 }, () => [x - 60 + r() * 120, 650 + r() * 150]), 3.5); }));
  tag(c, 220, 740, "A"); tag(c, 540, 740, "B"); tag(c, 860, 740, "C");
  // a spoon of salt tipping into B and into C; the grains fall straight down into the water
  spoon(c, 650, 400, 520, 540); grains(c, [[500, 585], [512, 605], [496, 620], [508, 635], [520, 650]]);
  write(c, "1", 690, 340, 60, INK, 7);
  spoon(c, 970, 400, 840, 540); grains(c, [[820, 585], [832, 605], [816, 620], [828, 635], [840, 650]]);
  write(c, "4", 1000, 340, 60, INK, 7);
};
const setupE1_2 = (c: Ctx) => {
  ground(c);
  // the ruler first, so the hand that holds it comes in front
  shadow(c, 740, 812, 40, 10);
  shape(c, () => rrect(c, 705, 470, 50, 340, 6), COL.wood, 5); c.fillStyle = COL.woodDk; c.fillRect(708, 790, 44, 16);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 36; mm++) { const yy = 612 + mm * 5 - 60; if (yy < 480) continue; c.lineWidth = mm % 12 === 0 ? 3.5 : 2; c.beginPath(); c.moveTo(705, yy); c.lineTo(705 + (mm % 12 === 0 ? 22 : mm % 6 === 0 ? 15 : 8), yy); c.stroke(); }
  ["0", "1", "2", "3"].forEach((n, i) => write(c, n, 731, 602 + i * 50, 18, INK, 3.5));
  const H = person(c, 520, 1010, 700, { reachL: [330, 612], reachR: [730, 540] });
  // the strip pinched at its end in the left hand, sticking out flat, the tip hanging down beside the ruler
  strip(c, [[H.handL[0] - 10, 612], [480, 612], [590, 630], [660, 676], [690, 712]]);
  c.setLineDash([10, 10]); line(c, [[480, 612], [700, 612]], 3, RED); c.setLineDash([]);
  arrow(c, [[780, 612], [780, 712]], RED, 8); line(c, [[760, 712], [800, 712]], 6, RED);
};
const setupE1_3 = (c: Ctx) => {
  ground(c); table(c, 760);
  [150, 290, 430].forEach((x, i) => { tumbler(c, x, 790, 120, 190, 0.6, COL.water, () => strip(c, [[x - 20, 770], [x + 12, 640]], 22)); tag(c, x, 745, "ABC"[i], 0.6); });
  timer(c, 590, 660, "20", 66);
  const H = person(c, 790, 1010, 620, { reachL: [690, 800], reachR: [880, 752] });
  // a strip just out of its cup, held flat; the cloth hangs from the other hand and pats its end
  strip(c, [[H.handL[0], 800], [905, 800]]);
  shape(c, () => rrect(c, 822, 768, 124, 92, 14), COL.cloth, 5); line(c, [[840, 800], [930, 800]], 3, COL.grey); line(c, [[836, 830], [932, 830]], 3, COL.grey);
  arrow(c, [[935, 690], [935, 752]], RED, 8);
};
// ---------------------------------------------------------------- set-up cards: e2 naked egg
const setupE2_0 = (c: Ctx) => {
  ground(c); table(c, 870);
  jar(c, 540, 860, 420, 540, 0.86, VINEGAR, () => {
    egg(c, 540, 650, 120, "shell");
    const r = rnd(5);
    for (let i = 0; i < 18; i++) { const a = -0.3 + (i / 17) * (Math.PI + 0.6), bx = 540 + Math.cos(a) * 120 * 1.02, by = 650 + Math.sin(a) * 125 + 10; bubble(c, bx, by, 6 + r() * 6); }
    for (let i = 0; i < 9; i++) bubble(c, 400 + r() * 280, 420 + r() * 120, 5 + r() * 6);
  });
};
const setupE2_1 = (c: Ctx) => {
  ground(c); table(c, 800);
  // the old cloudy vinegar already poured off into the bowl on the left
  bowl(c, 200, 775, 115, CLOUDY);
  // the jar with the egg, its shell mostly gone, and fresh vinegar going in
  jar(c, 470, 800, 200, 260, 0.35, VINEGAR, () => egg(c, 470, 735, 56, "patchy"));
  const H = person(c, 760, 1010, 700, { reachL: [590, 400] });
  // the bottle in the left hand, tipped so its neck points down over the jar's mouth
  const bx = H.handL[0] + 10, by = H.handL[1];
  c.save(); c.translate(bx, by); c.rotate(-2.23);
  shape(c, () => rrect(c, -42, -100, 84, 200, 14), "rgba(224,240,250,0.9)", 5); shape(c, () => rrect(c, -13, -170, 26, 76, 6), "rgba(224,240,250,0.9)", 5);
  shape(c, () => rrect(c, -42, -30, 84, 90, 6), COL.paper, 4); shine(c, [[-28, -80], [-28, 40]], 5);
  c.restore();
  const tipX = bx - 0.79 * 170, tipY = by + 0.61 * 170;
  shape(c, () => polyP(c, [[tipX - 7, tipY], [tipX + 7, tipY], [tipX + 5, 710], [tipX - 5, 710]]), VINEGAR, 3);
  shape(c, () => ell(c, tipX, 712, 30, 8), "rgba(255,255,255,0.6)", 0);
};
const setupE2_2 = (c: Ctx) => {
  ground(c);
  // a sink below, a wall tap above: the pipe comes from a wall plate at the left
  shape(c, () => rrect(c, 120, 760, 840, 200, 30), COL.steel, 6); shape(c, () => rrect(c, 150, 790, 780, 140, 24), COL.steelIn, 4);
  shape(c, () => ell(c, 200, 250, 30, 46), COL.steelDk, 5);
  line(c, [[210, 250], [520, 250], [545, 270], [545, 340]], 44, INK); line(c, [[210, 250], [520, 250], [545, 270], [545, 340]], 30, COL.steel); shape(c, () => rrect(c, 520, 335, 50, 24, 6), COL.steelDk, 5);
  line(c, [[380, 250], [380, 190]], 14, INK); shape(c, () => ell(c, 380, 180, 34, 18), COL.steelDk, 5);
  // the water falls straight down from the spout onto the egg
  shape(c, () => polyP(c, [[531, 358], [559, 358], [565, 480], [525, 480]]), COL.water, 3); shine(c, [[540, 370], [540, 470]], 5);
  // the naked egg held between both hands, a string round its middle
  egg(c, 545, 596, 96, "naked"); stringBand(c, 545, 616, 98, 22);
  for (const [dx, dy] of [[-70, 486], [60, 478], [-40, 520]]) shape(c, () => ell(c, 545 + dx, dy, 7, 10), COL.drop, 2);
  hand(c, 330, 606, 0, 1.6, SKIN.child, CLOTH.child, true);
  handLeft(c, 760, 606, 1.6, SKIN.child, CLOTH.child, true);
};
const setupE2_3 = (c: Ctx) => {
  ground(c); table(c, 770);
  jar(c, 300, 760, 300, 360, 0.86, COL.water, () => { egg(c, 300, 585, 112, "naked"); stringBand(c, 300, 610, 114, 26); });
  arrow(c, [[480, 480], [600, 480]], RED, 10);
  jar(c, 780, 760, 300, 360, 0.86, HONEY, () => { egg(c, 780, 605, 80, "naked"); stringBand(c, 780, 622, 82, 19); });
  // the string measure laid out under each jar: longer after water, shorter after honey
  const wavy = (x0: number, x1: number, y: number) => { const pts = Array.from({ length: 13 }, (_, i) => [x0 + ((x1 - x0) * i) / 12, y + (i % 2 ? 5 : -5)]); line(c, pts, 11, INK); line(c, pts, 5, STRING); };
  wavy(130, 470, 818); wavy(660, 900, 818);
};

// ---------------------------------------------------------------- picture cards
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 870);
  const r = rnd(21);
  // A: still stiff, leaning straight out of the cup; B: a little bent; C: floppy, draped over the rim
  tumbler(c, 220, 860, 200, 330, 0.6, COL.water, () => strip(c, [[200, 800], [347, 470]]));
  tumbler(c, 540, 860, 200, 330, 0.6, COL.water, () => strip(c, [[520, 800], [630, 560], [665, 500], [700, 470]]));
  tumbler(c, 860, 860, 200, 330, 0.6, COL.water, () => { grains(c, Array.from({ length: 12 }, () => [800 + r() * 120, 680 + r() * 150]), 3.5); strip(c, [[830, 800], [920, 620], [955, 530], [990, 548], [1010, 620], [1004, 690]]); });
  tag(c, 220, 790, "A"); tag(c, 540, 790, "B"); tag(c, 860, 790, "C");
  timer(c, 540, 260, "40", 70);
};
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 780);
  const r = rnd(8);
  jar(c, 190, 770, 240, 310, 0.86, VINEGAR, () => { egg(c, 190, 620, 68, "shell"); for (let i = 0; i < 12; i++) { const a = (i / 11) * Math.PI; bubble(c, 190 + Math.cos(a) * 72, 625 + Math.sin(a) * 76, 4 + r() * 4); } for (let i = 0; i < 5; i++) bubble(c, 110 + r() * 160, 500 + r() * 70, 4 + r() * 4); });
  arrow(c, [[325, 600], [405, 600]], RED, 9);
  jar(c, 540, 770, 240, 310, 0.86, COL.water, () => { egg(c, 540, 620, 92, "naked"); stringBand(c, 540, 640, 94, 21); });
  arrow(c, [[675, 600], [755, 600]], RED, 9);
  jar(c, 890, 770, 240, 310, 0.86, HONEY, () => { egg(c, 890, 640, 64, "naked"); stringBand(c, 890, 654, 66, 15); });
};
const flowA1 = (c: Ctx) => {
  ground(c); table(c, 840);
  tumbler(c, 300, 830, 230, 340, 0.6, COL.water, () => herb(c, 300, 810, 490, false, 31));
  tumbler(c, 780, 830, 230, 340, 0.6, COL.water, () => herb(c, 780, 810, 490, true, 32));
  iconTag(c, 300, 730, true); iconTag(c, 780, 730, false);
};
const flowA2 = (c: Ctx) => {
  ground(c); table(c, 800);
  // the whole cube, just starting to melt, in a little water; the crushed ice almost all water
  bowl(c, 300, 600, 190, COL.steelIn); shape(c, () => ell(c, 300, 604, 150, 26), COL.water, 0);
  cubeIso(c, 300, 616, 110, ICE, ICEDK, "#86b8dc", 5);
  bowl(c, 780, 600, 190, COL.steelIn); shape(c, () => ell(c, 780, 604, 165, 32), COL.water, 0);
  const r = rnd(4); for (let i = 0; i < 9; i++) { const x = 680 + r() * 200, y = 586 + r() * 34, s = 10 + r() * 12; shape(c, () => polyP(c, [[x - s, y + s * 0.3], [x - s * 0.3, y - s * 0.5], [x + s, y - s * 0.2], [x + s * 0.5, y + s * 0.5]]), ICE, 3); }
  timer(c, 540, 300, "10", 70);
};
const flowA3 = (c: Ctx) => {
  ground(c);
  // plant cell: a steel tiffin box for the wall, curd, a dough ball, peas, beans, a water bag pressed against one side
  shadow(c, 320, 850, 230, 26);
  shape(c, () => rrect(c, 80, 240, 460, 600, 18), COL.steel, 6); shape(c, () => rrect(c, 104, 264, 412, 552, 10), CURD, 4);
  shape(c, () => rrect(c, 112, 272, 150, 536, 14), "rgba(143,195,234,0.85)", 5); shine(c, [[140, 320], [140, 740]], 6);
  shape(c, () => ell(c, 400, 420, 62, 58), DOUGH, 5); shade(c, () => ell(c, 400, 420, 62, 58), "#c9a56a", 20, 10, 0.4);
  [[300, 330], [470, 560], [330, 620], [460, 700], [300, 470], [360, 760]].forEach(([x, y], i) => seed(c, x, y, 20, i * 0.9, false, COL.greenLt, COL.green));
  [[310, 540], [450, 760], [430, 300]].forEach(([x, y], i) => seed(c, x, y, 22, 0.5 + i, false, "#8c2f3a", "#5e1d26"));
  // animal cell: a zip bag for the membrane, curd, a dough ball and beans
  shadow(c, 800, 790, 220, 24);
  shape(c, () => rrect(c, 580, 300, 430, 480, 70), "rgba(224,240,250,0.85)", 6); shape(c, () => rrect(c, 600, 322, 390, 436, 60), CURD, 0); shape(c, () => rrect(c, 580, 300, 430, 480, 70), "rgba(224,240,250,0.35)", 0);
  shape(c, () => rrect(c, 600, 300, 390, 34, 6), COL.steelIn, 4); for (let x = 620; x < 980; x += 24) line(c, [[x, 306], [x, 328]], 3, COL.greyDk);
  shape(c, () => ell(c, 795, 540, 62, 58), DOUGH, 5); shade(c, () => ell(c, 795, 540, 62, 58), "#c9a56a", 20, 10, 0.4);
  [[690, 420], [900, 440], [690, 680], [910, 670]].forEach(([x, y], i) => seed(c, x, y, 22, 0.3 + i, false, "#8c2f3a", "#5e1d26"));
};
const flowA4 = (c: Ctx) => {
  ground(c); table(c, 760);
  bowl(c, 300, 560, 190, COL.water); bowl(c, 780, 560, 190, COL.water);
  const r = rnd(9);
  for (let i = 0; i < 6; i++) { raisin(c, 215 + (i % 3) * 85, 540 + Math.floor(i / 3) * 40 - 10, true, r() * 3); raisin(c, 700 + (i % 3) * 80, 545 + Math.floor(i / 3) * 36 - 10, false, r() * 3); }
  iconTag(c, 300, 700, false); iconTag(c, 780, 700, true);
};
const flowP1 = (c: Ctx) => {
  ground(c); table(c, 900);
  const H = person(c, 250, 1010, 600, { reachR: [440, 690] });
  torch(c, H.handR[0], H.handR[1], 150);
  // the beam: from the lens across to the jar, then on through the cloudy water, lighting up the specks
  c.globalAlpha = 0.4; shape(c, () => polyP(c, [[H.handR[0] + 80, H.handR[1] - 44], [680, 630], [680, 750], [H.handR[0] + 80, H.handR[1] + 44]]), COL.yellow, 0); c.globalAlpha = 1;
  const r = rnd(17);
  jar(c, 800, 900, 240, 360, 0.75, "rgba(222,214,190,0.95)", () => {
    c.globalAlpha = 0.5; shape(c, () => polyP(c, [[680, 630], [920, 630], [920, 750], [680, 750]]), COL.yellow, 0); c.globalAlpha = 1;
    for (let i = 0; i < 14; i++) shape(c, () => ell(c, 700 + r() * 200, 640 + r() * 100, 4, 4), WHITE, 1.5);
    for (let i = 0; i < 7; i++) line(c, [[700 + i * 30, 890], [720 + i * 28, 820 + r() * 30]], 5, COL.woodDk);
  });
  shape(c, () => ell(c, 800, 536, 150, 22), COL.paper, 5);
};
const explSingleCells = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 440, 440), COL.sky, 8); shine(c, [[230, 380], [280, 260], [400, 170]], 12);
  amoeba(c, 330, 380, 150);
  paramecium(c, 730, 440, 190, -0.35);
  line(c, qpts([520, 560], [600, 470], [530, 480]), 4, COL.blueDk); line(c, qpts([560, 600], [650, 520], [590, 520]), 4, COL.blueDk);
  euglena(c, 520, 790, 170, 0.15);
};
const explTurgor = (c: Ctx) => {
  ground(c);
  // a shoebox seen from above with a water balloon pressing against all four walls
  shadow(c, 290, 870, 230, 28);
  shape(c, () => rrect(c, 70, 300, 440, 560, 10), COL.brown, 6); shape(c, () => rrect(c, 100, 330, 380, 500, 6), COL.soil, 4);
  const bal = () => rrect(c, 104, 334, 372, 492, 120); shape(c, bal, COL.blue, 6); shade(c, bal, COL.blueDk, 30, 24, 0.4); shine(c, [[170, 420], [180, 560]], 9);
  shape(c, () => ell(c, 290, 800, 16, 12), COL.blueDk, 4); line(c, [[290, 812], [290, 830]], 5, INK);
  for (const [x, y, dx, dy] of [[290, 345, 0, -1], [290, 815, 0, 1], [115, 580, -1, 0], [465, 580, 1, 0]]) arrow(c, [[x + dx * 20, y + dy * 20], [x + dx * 70, y + dy * 70]], RED, 7);
  // a crisp stem and a wilted one, each with its cross-section: round full cells, or shrunken ones with gaps
  const section = (x: number, y: number, full: boolean) => {
    shape(c, () => ell(c, x, y, 150, 150), "#e8f3d8", 6);
    const pts: number[][] = []; for (let row = -2; row <= 2; row++) for (let col = -2; col <= 2; col++) { const px = x + col * 56 + (row % 2 ? 28 : 0), py = y + row * 50; if (Math.hypot(px - x, py - y) < 120) pts.push([px, py]); }
    pts.forEach(([px, py], i) => (full ? shape(c, () => ell(c, px, py, 27, 27), COL.greenLt, 4) : shape(c, () => ell(c, px + (i % 2 ? 5 : -4), py + 3, 17, 14, i * 0.7), "#b9c98a", 4)));
  };
  line(c, [[700, 330], [700, 120]], 12, INK); line(c, [[700, 330], [700, 120]], 6, COL.green); leaf(c, 700, 200, 70, -0.9); leaf(c, 700, 160, 60, -2.3);
  section(700, 500, true);
  line(c, qpts([920, 330], [1000, 200], [930, 120]), 12, INK); line(c, qpts([920, 330], [1000, 200], [930, 120]), 6, COL.green); leaf(c, 1000, 200, 70, 1.4, "#8fb05a"); leaf(c, 965, 150, 56, 1.1, "#8fb05a");
  section(920, 800, false); line(c, [[920, 650], [920, 560]], 6, COL.green);
};
const explCubes = (c: Ctx) => {
  ground(c); table(c, 820);
  const s = 150;
  cubeIso(c, 230, 870, s, COL.yellow, COL.orange, "#d9802a");
  write(c, "1", 212, 935, 56, INK, 7); write(c, "1 cm", 160, 490, 40, INK, 5);
  // the 2 cm cube is eight of the small ones; the lines on its faces show them
  const X = 700, Y = 880, R = [0.866 * s, -0.5 * s], L = [-0.866 * s, -0.5 * s];
  cubeIso(c, X, Y, 2 * s, COL.yellow, COL.orange, "#d9802a");
  for (const k of [1]) {
    line(c, [[X + L[0] * k, Y + L[1] * k], [X + L[0] * k, Y + L[1] * k - 2 * s]], 4); line(c, [[X + R[0] * k, Y + R[1] * k], [X + R[0] * k, Y + R[1] * k - 2 * s]], 4);
    line(c, [[X, Y - s * k], [X + L[0] * 2, Y + L[1] * 2 - s * k]], 4); line(c, [[X, Y - s * k], [X + R[0] * 2, Y + R[1] * 2 - s * k]], 4);
    line(c, [[X + L[0] * k, Y + L[1] * k - 2 * s], [X + L[0] * k + R[0] * 2, Y + L[1] * k + R[1] * 2 - 2 * s]], 4); line(c, [[X + R[0] * k, Y + R[1] * k - 2 * s], [X + R[0] * k + L[0] * 2, Y + R[1] * k + L[1] * 2 - 2 * s]], 4);
  }
  write(c, "8", 680, 935, 56, INK, 7); write(c, "2 cm", 630, 200, 40, INK, 5);
};

export const ic_whatIsLifeCellsL4 = cards("sci.what-is-life.cells.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE2_0, setupE2_1, setupE2_2, setupE2_3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, explSingleCells, explTurgor, explCubes,
]);
