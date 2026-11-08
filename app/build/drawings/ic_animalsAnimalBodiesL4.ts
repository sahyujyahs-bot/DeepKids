import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, person, hand, write, cards } from "./flatKit";

// ANIMAL BODIES L4 · set-up cards for the Ice Test and the Foot Test, then card pictures for the
// activities and three things a child can see: a woodpecker's foot, a camel's hump, an octopus jetting.

const ICE = "#d6edf9", ICE_DK = "#a3cfe8", ICE_TOP = "#eaf6fc", FROST = "#e9f5fb", FLAKE = "#7fb3d9";
const DOUGH = "#e8cf9c", DOUGH_DK = "#cdae74", CARD = "#c9a06b", CARD_DK = "#a97f4c", TAPE = "#f5e6a8", FOLD = "#cfc6b2", CLOTH_DK = "#e4dccb";
const CAMEL = "#d9a86a", CAMEL_DK = "#b8864b", FAT = "#f7e9bd", FAT_DK = "#eed594", SAND = "#ecd3a0", BARK = "#8a5a3c", BARK_DK = "#6a4128";
const OCTO = "#e8824f", OCTO_DK = "#c25f33", RAISIN = "#5a3a4a", PAPER_TUBE = "#f3e6c8", TUBE_IN = "#c9ad7c";

// ---------------------------------------------------------------- small shared things
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.64], [0.48, 0.64]]],
  B: [[[0, 0], [0, 1]], [[0, 0], [0.38, 0], [0.55, 0.12], [0.55, 0.36], [0.38, 0.48], [0, 0.48]], [[0.38, 0.48], [0.58, 0.6], [0.58, 0.88], [0.38, 1], [0, 1]]],
  C: [[[0.58, 0.14], [0.36, 0], [0.1, 0.14], [0, 0.5], [0.1, 0.86], [0.36, 1], [0.58, 0.86]]],
};
// one capital letter (A, B or C) with its top-left at (x, y), height h
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a strip of masking tape with a letter on it, centred at (x, y)
const tape = (c: Ctx, x: number, y: number, ch: string, w = 100, h = 60) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 5), TAPE, 4);
  letter(c, ch, x - h * 0.21, y - h * 0.35, h * 0.7);
};
// a plastic cup of water, bottom centre (x, y)
const cup = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, "#f4f7fa");
  if (fill > 0) { const ly = y - h * fill, lw = bot + (top - bot) * fill; shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.water, 0); shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 3); }
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.6)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.25]], 7);
};
// a block of ice tipped out of a cup: wider at the bottom; bottom centre (x, y)
const ice = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const bw = w / 2, tw = w * 0.4, body = () => { c.moveTo(x - tw, y - h); c.lineTo(x + tw, y - h); c.lineTo(x + bw, y); c.lineTo(x - bw, y); c.closePath(); };
  shape(c, body, ICE); shade(c, body, ICE_DK, w * 0.3, 0, 0.6);
  shape(c, () => ell(c, x, y - h, tw, w * 0.08), ICE_TOP, 5);
  shine(c, [[x - tw * 0.7, y - h * 0.8], [x - bw * 0.7, y - h * 0.2]], 8);
};
// the front lip of a katori, drawn over whatever sits in it
const lip = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.ellipse(x, y, r * 0.86, r * 0.14, 0, Math.PI, 0, true); c.closePath(); }, COL.steel, 4);
};
const pool = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y + 2, r * 0.86, r * 0.14), COL.water, 0);
// a katori with something in it: the bowl, then the contents, then the lip in front
const katori = (c: Ctx, x: number, y: number, r: number, inner: () => void) => { bowl(c, x, y, r); inner(); lip(c, x, y, r); };
// an ice block wrapped all round in cloth, knotted on top; bottom centre (x, y)
const bundle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w / 2 - 12, y - h * 0.55, x - w * 0.3, y - h * 0.9); c.quadraticCurveTo(x, y - h * 1.05, x + w * 0.3, y - h * 0.9); c.quadraticCurveTo(x + w / 2 + 12, y - h * 0.55, x + w / 2, y); c.closePath(); };
  shape(c, body, COL.cloth); shade(c, body, CLOTH_DK, w * 0.25, 0, 0.8);
  line(c, [[x - w * 0.28, y - h * 0.12], [x - w * 0.12, y - h * 0.62]], 4, FOLD); line(c, [[x + w * 0.22, y - h * 0.1], [x + w * 0.06, y - h * 0.55]], 4, FOLD);
  shape(c, () => { c.moveTo(x - w * 0.08, y - h * 0.96); c.quadraticCurveTo(x - w * 0.42, y - h * 1.28, x - w * 0.3, y - h * 0.92); c.closePath(); }, COL.cloth, 5);
  shape(c, () => { c.moveTo(x + w * 0.08, y - h * 0.96); c.quadraticCurveTo(x + w * 0.42, y - h * 1.32, x + w * 0.3, y - h * 0.92); c.closePath(); }, COL.cloth, 5);
  shape(c, () => ell(c, x, y - h * 0.98, w * 0.12, w * 0.09), COL.cloth, 5);
};
// a folded pad of cloth lying on something; centre of its underside at (x, y)
const pad = (c: Ctx, x: number, y: number, w: number, t: number) => {
  const body = () => rrect(c, x - w / 2, y - t, w, t, t * 0.3);
  shape(c, body, COL.cloth); shade(c, body, CLOTH_DK, w * 0.2, 0, 0.8);
  line(c, [[x - w / 2 + 12, y - t * 0.34], [x + w / 2 - 12, y - t * 0.34]], 3, FOLD);
  line(c, [[x - w / 2 + 12, y - t * 0.66], [x + w / 2 - 12, y - t * 0.66]], 3, FOLD);
};
// a steel tumbler with water in it, bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.09), COL.water, 5);
  shape(c, () => ell(c, x - top * 0.3, y - h, top * 0.25, w * 0.03), COL.drop, 0);
  shine(c, [[x - top * 0.6, y - h * 0.85], [x - bot * 0.65, y - h * 0.2]], 8);
};
// a bottle cap lying flat, its underside centre at (x, y)
const bottleCap = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 0.22, ry = w * 0.14;
  const side = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w / 2, y); c.ellipse(x, y, w / 2, ry, 0, 0, Math.PI); c.closePath(); };
  shape(c, side, COL.blue); shade(c, side, COL.blueDk, w * 0.25, 0);
  for (let k = -3; k <= 3; k++) line(c, [[x + k * w * 0.13, y - h + 4], [x + k * w * 0.13, y + ry * Math.sqrt(Math.max(0, 1 - (k * 0.26) ** 2)) - 3]], 2.5, COL.blueDk);
  shape(c, () => ell(c, x, y - h, w / 2, ry), COL.blueDk, 5);
};
// a kitchen timer dial set to some minutes; centre (x, y)
const timer = (c: Ctx, x: number, y: number, r: number, minutes: number) => {
  shadow(c, x + r * 0.1, y + r * 1.02, r * 0.85, r * 0.12);
  shape(c, () => ell(c, x, y, r, r), COL.teal); shade(c, () => ell(c, x, y, r, r), COL.tealDk, r * 0.25, r * 0.1);
  shape(c, () => ell(c, x, y, r * 0.76, r * 0.76), WHITE, 5);
  const a0 = -Math.PI / 2, a1 = a0 + (minutes / 60) * Math.PI * 2;
  shape(c, () => { c.moveTo(x, y); c.arc(x, y, r * 0.7, a0, a1); c.closePath(); }, RED, 0);
  for (let m = 0; m < 60; m += 5) { const a = a0 + (m / 60) * Math.PI * 2, l = m % 15 === 0 ? r * 0.14 : r * 0.08; line(c, [[x + Math.cos(a) * (r * 0.72 - l), y + Math.sin(a) * (r * 0.72 - l)], [x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72]], m % 15 === 0 ? 6 : 4); }
  line(c, [[x, y], [x + Math.cos(a1) * r * 0.62, y + Math.sin(a1) * r * 0.62]], 8);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
  write(c, String(minutes), x - r * 0.26, y + r * 0.22, r * 0.34, INK, 7);
  shape(c, () => rrect(c, x - r * 0.12, y - r - r * 0.18, r * 0.24, r * 0.2, 6), COL.tealDk, 5);
};
// a wooden ruler standing on its end at (x, y), len px tall, 20 px to the centimetre, numbers every 5
const rulerV = (c: Ctx, x: number, y: number, cm: number) => {
  const len = cm * 20, w = 60;
  shadow(c, x + 10, y + 5, w * 0.6, 10);
  shape(c, () => rrect(c, x - w / 2, y - len - 14, w, len + 14, 4), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + w / 2 - 12, y - len - 10, 9, len + 6);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cm * 10; mm += 2) { const yy = y - mm * 2, l = mm % 10 === 0 ? 20 : mm % 5 === 0 ? 14 : 8; c.lineWidth = mm % 10 === 0 ? 3 : 2; c.beginPath(); c.moveTo(x - w / 2, yy); c.lineTo(x - w / 2 + l, yy); c.stroke(); }
  for (let k = 0; k <= cm; k += 5) write(c, String(k), x - 4, y - k * 20 - 9, 16, INK, 3);
};
// a baking tray with a slab of dough rolled flat in it; the slab's top face is the rounded rect (x, y, w, h) and
// its front edge shows below it, t px thick
const doughTray = (c: Ctx, x: number, y: number, w: number, h: number, t: number) => {
  shadow(c, x + w / 2 + 20, y + h + t + 40, w * 0.55, 24);
  shape(c, () => rrect(c, x - 60, y - 40, w + 120, h + t + 80, 26), COL.steel);
  shade(c, () => rrect(c, x - 60, y - 40, w + 120, h + t + 80, 26), COL.steelDk, 0, h + t + 50, 0.7);
  shape(c, () => rrect(c, x - 30, y - 18, w + 60, h + t + 40, 16), COL.steelIn, 4);
  shape(c, () => { c.moveTo(x, y + h * 0.5); c.lineTo(x, y + h + t); c.lineTo(x + w, y + h + t); c.lineTo(x + w, y + h * 0.5); c.closePath(); }, DOUGH_DK);
  shape(c, () => rrect(c, x, y, w, h, 24), DOUGH);
};
// a pointing hand: the finger tip at (tx, ty), the finger pointing along angle an
const pointHand = (c: Ctx, tx: number, ty: number, an: number, s = 1, flip = false) => {
  c.save(); c.translate(tx, ty); c.rotate(an); c.scale(s, flip ? -s : s);
  shape(c, () => rrect(c, -206, -42, 62, 84, 14), CLOTH.child, 6);
  shape(c, () => { c.moveTo(-156, -38); c.quadraticCurveTo(-104, -48, -64, -36); c.lineTo(-58, 38); c.quadraticCurveTo(-104, 48, -156, 38); c.closePath(); }, SKIN.child, 6);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, -70, -6 + k * 16, 40, 16, 8), SKIN.child, 5);
  shape(c, () => rrect(c, -76, -36, 76, 22, 11), SKIN.child, 5);
  shape(c, () => { c.moveTo(-124, -36); c.quadraticCurveTo(-116, -74, -84, -70); c.quadraticCurveTo(-66, -64, -80, -46); c.quadraticCurveTo(-98, -36, -116, -32); c.closePath(); }, SKIN.child, 5);
  c.restore();
};
// a pinching hand: thumb and first finger meet at (tx, ty), the hand lying along angle an
const pinchHand = (c: Ctx, tx: number, ty: number, an: number, s = 1) => {
  c.save(); c.translate(tx, ty); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -206, -42, 62, 84, 14), CLOTH.child, 6);
  shape(c, () => { c.moveTo(-156, -38); c.quadraticCurveTo(-104, -48, -64, -36); c.lineTo(-58, 38); c.quadraticCurveTo(-104, 48, -156, 38); c.closePath(); }, SKIN.child, 6);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, -70, -2 + k * 15, 36, 15, 7), SKIN.child, 5);
  line(c, [[-80, -30], [-6, -6]], 28, INK); line(c, [[-80, -30], [-6, -6]], 18, SKIN.child);
  line(c, [[-116, -36], [-62, -58], [-6, -14]], 28, INK); line(c, [[-116, -36], [-62, -58], [-6, -14]], 18, SKIN.child);
  c.restore();
};
// a pencil: tip at (tx, ty), the body running back along angle an
const pencil = (c: Ctx, tx: number, ty: number, an: number, len = 220, w = 22) => {
  c.save(); c.translate(tx, ty); c.rotate(an);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(34, -w / 2); c.lineTo(len, -w / 2); c.lineTo(len, w / 2); c.lineTo(34, w / 2); c.closePath(); }, COL.yellow);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(34, -w / 2); c.lineTo(34, w / 2); c.closePath(); }, "#f0d9b0", 4);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(12, -w * 0.18); c.lineTo(12, w * 0.18); c.closePath(); }, INK, 2);
  shape(c, () => rrect(c, len - 36, -w / 2, 36, w, 4), COL.pink, 4);
  line(c, [[42, -w * 0.12], [len - 42, -w * 0.12]], 3, COL.orange);
  c.restore();
};
// a crow standing with her feet at (x, y), facing dir (1 = right)
const crow = (c: Ctx, x: number, y: number, s = 1, dir: 1 | -1 = 1) => {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  line(c, [[-12, -4], [-18, -42]], 7, INK); line(c, [[14, -4], [6, -42]], 7, INK);
  line(c, [[-12, -4], [-18, -42]], 3.5, COL.greyDk); line(c, [[14, -4], [6, -42]], 3.5, COL.greyDk);
  line(c, [[-12, -4], [-28, 2]], 5, INK); line(c, [[-12, -4], [0, 4]], 5, INK); line(c, [[14, -4], [-2, 2]], 5, INK); line(c, [[14, -4], [28, 2]], 5, INK);
  shape(c, () => polyP(c, [[-50, -72], [-120, -46], [-114, -24], [-44, -50]]), COL.black, 5);
  shape(c, () => ell(c, 0, -74, 70, 40, -0.25), COL.black, 5);
  shape(c, () => ell(c, -4, -72, 50, 22, -0.3), "#4d4857", 3);
  shape(c, () => ell(c, 60, -112, 32, 27), COL.black, 5);
  shape(c, () => polyP(c, [[86, -118], [130, -106], [86, -98]]), COL.greyDk, 4);
  shape(c, () => ell(c, 64, -116, 7, 7), WHITE, 2.5); shape(c, () => ell(c, 66, -116, 3.5, 3.5), INK, 0);
  c.restore();
};
// a raisin
const raisin = (c: Ctx, x: number, y: number, r = 14) => { shape(c, () => ell(c, x, y, r, r * 0.8, 0.3), RAISIN, 4); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.2, r * 0.15), "#8a6a7a", 0); };
// a thin stick with sticky tape round its end; the taped tip at (tx, ty), the stick running back along an
const stickyStick = (c: Ctx, tx: number, ty: number, an: number, len: number) => {
  c.save(); c.translate(tx, ty); c.rotate(an);
  shape(c, () => rrect(c, 0, -7, len, 14, 6), COL.wood, 4);
  shape(c, () => rrect(c, -4, -14, 60, 28, 8), "rgba(191,224,245,0.8)", 4);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 6 + k * 14, -9, 2.5, 2.5), COL.blueDk, 0);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 10 + k * 14, 9, 2.5, 2.5), COL.blueDk, 0);
  c.restore();
};
// a wobbly circle and a wobbly triangle, as a child draws them with a pencil
const wobbly = (c: Ctx, pts: number[][], w = 5) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.strokeStyle = INK; c.lineWidth = w; c.lineJoin = "round"; c.stroke(); };
const circleWobble = (c: Ctx, x: number, y: number, r: number) => wobbly(c, Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, rr = r * (1 + 0.08 * Math.sin(i * 2.3) + 0.05 * Math.cos(i * 1.1)); return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; }));
const triangleWobble = (c: Ctx, x: number, y: number, r: number) => wobbly(c, [[x, y - r], [x + r * 0.95, y + r * 0.6], [x + r * 0.1, y + r * 0.7], [x - r * 0.9, y + r * 0.55], [x - r * 0.1, y - r * 0.4]]);

// ---------------------------------------------------------------- ICE TEST set-up cards
// 1. three identical cups of water in the freezer, labelled A, B, C
const e1s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 945, 420, 30);
  shape(c, () => rrect(c, 120, 150, 840, 780, 30), COL.steelIn);
  shape(c, () => rrect(c, 170, 200, 740, 680, 18), FROST, 5);
  shade(c, () => rrect(c, 170, 200, 740, 680, 18), "#c7dfee", 0, -600, 0.7);
  // a wire shelf the cups stand on
  line(c, [[172, 762], [908, 762]], 8); for (let x = 210; x < 900; x += 60) line(c, [[x, 764], [x, 812]], 4, COL.steelDk);
  // frost along the top, and three flakes in the air
  for (let x = 190; x < 900; x += 44) shape(c, () => polyP(c, [[x, 202], [x + 44, 202], [x + 22, 230 + (x % 88 ? 10 : 0)]]), WHITE, 3);
  for (const [fx, fy] of [[280, 330], [800, 320], [540, 290]]) for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; line(c, [[fx - Math.cos(a) * 34, fy - Math.sin(a) * 34], [fx + Math.cos(a) * 34, fy + Math.sin(a) * 34]], 5, FLAKE); }
  for (const [x, ch] of [[330, "A"], [540, "B"], [750, "C"]] as [number, string][]) { cup(c, x, 760, 170, 200, 0.72); tape(c, x, 700, ch, 90, 54); }
};
// 2. three ice blocks in three katoris, A, B, C
const e1s1 = (c: Ctx) => {
  ground(c);
  for (const [x, ch] of [[190, "A"], [540, "B"], [890, "C"]] as [number, string][]) {
    katori(c, x, 640, 135, () => ice(c, x, 652, 140, 165));
    tape(c, x, 702, ch, 90, 54);
  }
};
// 3. A bare, B wrapped all over, C with the same cloth folded in a pad on top
const e1s2 = (c: Ctx) => {
  ground(c);
  katori(c, 190, 640, 135, () => ice(c, 190, 652, 140, 165)); tape(c, 190, 702, "A", 90, 54);
  katori(c, 540, 640, 135, () => bundle(c, 540, 652, 190, 205)); tape(c, 540, 702, "B", 90, 54);
  katori(c, 890, 640, 135, () => { ice(c, 890, 652, 140, 165); pad(c, 890, 487, 170, 64); }); tape(c, 890, 702, "C", 90, 54);
};
// 4. the three katoris side by side, away from the Sun, and a timer set to 25 minutes
const e1s3 = (c: Ctx) => {
  ground(c);
  // the Sun crossed out: keep them out of sunlight
  shape(c, () => ell(c, 170, 190, 46, 46), COL.yellow, 5);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[170 + Math.cos(a) * 58, 190 + Math.sin(a) * 58], [170 + Math.cos(a) * 76, 190 + Math.sin(a) * 76]], 6, COL.orange); }
  c.beginPath(); c.arc(170, 190, 96, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
  line(c, [[102, 122], [238, 258]], 12, RED);
  katori(c, 160, 720, 92, () => ice(c, 160, 728, 96, 112)); tape(c, 160, 762, "A", 64, 40);
  katori(c, 370, 720, 92, () => bundle(c, 370, 728, 130, 140)); tape(c, 370, 762, "B", 64, 40);
  katori(c, 580, 720, 92, () => { ice(c, 580, 728, 96, 112); pad(c, 580, 616, 116, 44); }); tape(c, 580, 762, "C", 64, 40);
  timer(c, 850, 540, 165, 25);
};
// 5. pouring the meltwater of one block into the tall glass, the ruler beside it
const e1s4 = (c: Ctx) => {
  ground(c);
  // the squeezed cloth, wet, on the floor at the left
  shape(c, () => { c.moveTo(70, 980); c.quadraticCurveTo(90, 920, 140, 930); c.quadraticCurveTo(160, 900, 190, 935); c.quadraticCurveTo(215, 950, 200, 985); c.closePath(); }, COL.cloth);
  shade(c, () => { c.moveTo(70, 980); c.quadraticCurveTo(90, 920, 140, 930); c.quadraticCurveTo(160, 900, 190, 935); c.quadraticCurveTo(215, 950, 200, 985); c.closePath(); }, "#bcd3e4", 0, 25, 0.7);
  shape(c, () => ell(c, 120, 998, 14, 6), COL.water, 2); shape(c, () => ell(c, 175, 1000, 10, 5), COL.water, 2);
  rulerV(c, 775, 1000, 15);
  // the stream of water from the katori's lip into the glass
  line(c, [[675, 786], [675, 955]], 14, COL.waterDk); line(c, [[675, 790], [675, 950]], 6, COL.drop);
  glass(c, 675, 1000, 110, 150, 0.3);
  // the right hand cups the bottom of the katori, which is drawn over it; the left hand rests on the floor
  person(c, 400, 1000, 700, { sit: true, dir: 1, reachR: [578, 792], reachL: [240, 950] });
  // the katori, tilted to the right so its lip is lowest, over the hand that holds it from below
  c.save(); c.translate(610, 740); c.rotate(0.61);
  const r = 80, bod = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r * 0.9, r * 0.75, r * 0.9, r * 0.75, r, 0); c.closePath(); };
  shape(c, bod, COL.steel); shade(c, bod, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, 0, 0, r, r * 0.2), COL.water, 5);
  c.restore();
};

// ---------------------------------------------------------------- FOOT TEST set-up cards
// 1. the dough rolled flat in the tray, the rolling pin beside it
const e2s0 = (c: Ctx) => {
  ground(c);
  doughTray(c, 200, 400, 680, 250, 44);
  // "2 cm" against the slab's front edge
  line(c, [[905, 650], [925, 650], [925, 694], [905, 694]], 4);
  write(c, "2 cm", 940, 656, 30, INK, 5);
  // the rolling pin lying in front
  shadow(c, 560, 955, 320, 18);
  shape(c, () => rrect(c, 230, 900, 70, 44, 20), COL.woodDk); shape(c, () => rrect(c, 780, 900, 70, 44, 20), COL.woodDk);
  shape(c, () => rrect(c, 290, 878, 500, 88, 30), COL.wood); shade(c, () => rrect(c, 290, 878, 500, 88, 30), COL.woodDk, 0, 50, 0.6);
  shine(c, [[330, 900], [740, 900]], 7);
};
// 2. the three feet in a row, with their widths
const e2s1 = (c: Ctx) => {
  ground(c);
  bottleCap(c, 160, 640, 100);
  tumbler(c, 430, 640, 190, 240);
  plate(c, 810, 622, 200, 66);
  const dim = (x0: number, x1: number, label: string) => {
    line(c, [[x0, 712], [x0, 740]], 4); line(c, [[x1, 712], [x1, 740]], 4); line(c, [[x0, 726], [x1, 726]], 4);
    const w = label.length * 0.8 * 34; write(c, label, (x0 + x1) / 2 - w / 2 + 10, 756, 34, INK, 6);
  };
  dim(110, 210, "3 cm"); dim(335, 525, "7 cm"); dim(610, 1010, "18 cm");
};
// 3. the tumbler balanced on the bottle cap on the dough, a fingertip steadying it
const e2s2 = (c: Ctx) => {
  ground(c);
  doughTray(c, 120, 590, 840, 210, 46);
  shape(c, () => ell(c, 540, 700, 78, 24), DOUGH_DK, 0);
  bottleCap(c, 540, 700, 120);
  tumbler(c, 540, 676, 200, 260);
  pointHand(c, 634, 560, Math.PI, 1.1, true);
};
// 4. the plate lying flat on the dough, the tumbler standing in its middle
const e2s3 = (c: Ctx) => {
  ground(c);
  doughTray(c, 120, 590, 840, 210, 46);
  plate(c, 540, 690, 300, 95);
  tumbler(c, 540, 690, 200, 260);
};
// 5. measuring a dent: the toothpick stands in it, the pencil lies across the top, a pinch marks the depth
const e2s4 = (c: Ctx) => {
  ground(c);
  // the dough slab cut through, with a dent in its top
  shape(c, () => rrect(c, 60, 775, 960, 60, 10), COL.steel); shade(c, () => rrect(c, 60, 775, 960, 60, 10), COL.steelDk, 0, 30, 0.7);
  const slab = () => { c.moveTo(90, 560); c.lineTo(468, 560); c.quadraticCurveTo(480, 640, 540, 640); c.quadraticCurveTo(600, 640, 612, 560); c.lineTo(990, 560); c.lineTo(990, 780); c.lineTo(90, 780); c.closePath(); };
  shape(c, slab, DOUGH); shade(c, slab, DOUGH_DK, 0, 150, 0.6);
  // the depth, marked beside the dent
  line(c, [[612, 560], [700, 560]], 3, COL.greyDk); line(c, [[560, 638], [700, 638]], 3, COL.greyDk);
  arrow(c, [[690, 599], [690, 632]], RED, 7); arrow(c, [[690, 599], [690, 566]], RED, 7);
  // the toothpick standing in the dent
  shape(c, () => { c.moveTo(540, 638); c.lineTo(533, 620); c.lineTo(533, 380); c.lineTo(540, 360); c.lineTo(547, 380); c.lineTo(547, 620); c.closePath(); }, COL.wood, 4);
  // the pencil lying across the top of the dough
  pencil(c, 290, 548, 0, 500, 24);
  pinchHand(c, 541, 528, 2.3, 1);
};

// ---------------------------------------------------------------- card pictures
// the Ice Test after 25 minutes: the bare block and the pad block have melted most, the wrapped block least
const flowE1 = (c: Ctx) => {
  ground(c);
  katori(c, 200, 400, 110, () => { pool(c, 200, 400, 110); ice(c, 200, 408, 80, 80); }); tape(c, 200, 452, "A", 76, 46);
  katori(c, 540, 400, 110, () => bundle(c, 540, 408, 150, 165)); tape(c, 540, 452, "B", 76, 46);
  katori(c, 880, 400, 110, () => { pool(c, 880, 400, 110); ice(c, 880, 408, 96, 96); pad(c, 880, 312, 120, 44); }); tape(c, 880, 452, "C", 76, 46);
  glass(c, 200, 940, 120, 250, 0.8); glass(c, 540, 940, 120, 250, 0.35); glass(c, 880, 940, 120, 250, 0.7);
};
// the Foot Test: the same tumbler sinks deep on the bottle cap and hardly at all on the plate
const flowE2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 795, 960, 60, 10), COL.steel); shade(c, () => rrect(c, 60, 795, 960, 60, 10), COL.steelDk, 0, 30, 0.7);
  const slab = () => { c.moveTo(90, 600); c.lineTo(250, 600); c.quadraticCurveTo(262, 672, 320, 672); c.quadraticCurveTo(378, 672, 390, 600); c.lineTo(570, 600); c.lineTo(590, 612); c.lineTo(930, 612); c.lineTo(950, 600); c.lineTo(990, 600); c.lineTo(990, 800); c.lineTo(90, 800); c.closePath(); };
  shape(c, slab, DOUGH); shade(c, slab, DOUGH_DK, 0, 150, 0.6);
  bottleCap(c, 320, 668, 110);
  tumbler(c, 320, 644, 170, 220);
  shape(c, () => { c.moveTo(580, 612); c.quadraticCurveTo(590, 596, 610, 596); c.lineTo(910, 596); c.quadraticCurveTo(930, 596, 940, 612); c.closePath(); }, COL.steel, 5);
  tumbler(c, 760, 598, 170, 220);
};
// the Squeeze Test: the dough body comes through a small square hole as a worm; the hard ball cannot
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 712, 400, 22);
  shape(c, () => rrect(c, 130, 230, 820, 470, 10), CARD); shade(c, () => rrect(c, 130, 230, 820, 470, 10), CARD_DK, 0, 440, 0.6);
  const holes: [number, number][] = [[250, 160], [434, 128], [588, 96], [712, 64], [806, 32]];
  for (const [x, s] of holes) { shape(c, () => rrect(c, x - s / 2, 430 - s / 2, s, s, 2), BG, 5); line(c, [[x - s / 2 + 4, 430 + s / 2 - 4], [x - s / 2 + 4, 430 - s / 2 + 4], [x + s / 2 - 4, 430 - s / 2 + 4]], 5, CARD_DK); }
  // the dough worm coming out of the 2 cm hole toward us
  line(c, [[712, 430], [736, 520], [724, 600]], 70, INK); line(c, [[712, 430], [736, 520], [724, 600]], 58, DOUGH);
  shape(c, () => rrect(c, 712 - 32, 430 - 32, 64, 64, 2), DOUGH, 5);
  // the hard ball and the dough ball with the marble, on the table in front
  shadow(c, 318, 930, 80, 16); shape(c, () => ell(c, 300, 860, 70, 70), COL.red); shade(c, () => ell(c, 300, 860, 70, 70), "#b53a28", 22, 14, 0.5); shine(c, [[268, 830], [262, 850]], 9);
  shadow(c, 578, 930, 80, 16); shape(c, () => ell(c, 560, 860, 70, 70), DOUGH); shade(c, () => ell(c, 560, 860, 70, 70), DOUGH_DK, 22, 14, 0.5);
  shape(c, () => ell(c, 584, 836, 22, 22), COL.steelDk, 4); shine(c, [[576, 826], [582, 824]], 5);
};
// Tongue Tools: the taped tube with raisins deep inside, the sticky stick reaching one, the five tools below
const flowA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 480, 450, 20);
  shape(c, () => rrect(c, 90, 300, 900, 170, 14), COL.wood); for (const y of [340, 385, 430]) line(c, [[130, y], [950, y + 6]], 3, COL.woodDk);
  // the paper tube, closed at the right end, open at the left
  const tube = () => rrect(c, 200, 349, 680, 72, 8);
  shape(c, tube, PAPER_TUBE); shade(c, tube, "#d9c48f", 0, 40, 0.7);
  shape(c, () => ell(c, 200, 385, 16, 36), TUBE_IN, 5);
  // a window cut in the drawing so we see inside the deep end: five raisins, and the stick reaching them
  shape(c, () => rrect(c, 620, 357, 250, 56, 6), TUBE_IN, 4);
  for (const x of [790, 822, 850, 806, 838]) raisin(c, x, x % 2 ? 376 : 396, 13);
  stickyStick(c, 735, 385, Math.PI, 560);
  raisin(c, 750, 385, 13);
  shape(c, () => rrect(c, 600, 357, 22, 56, 2), PAPER_TUBE, 4);
  // two strips of tape hold the tube to the board
  for (const x of [300, 560]) shape(c, () => rrect(c, x - 26, 325, 52, 120, 6), "rgba(191,224,245,0.75)", 4);
  // the five tools
  const fork = (x: number) => { shape(c, () => rrect(c, x - 13, 650, 26, 170, 10), COL.steel, 5); shape(c, () => rrect(c, x - 30, 610, 60, 50, 10), COL.steel, 5); for (const k of [-1, 0, 1]) line(c, [[x + k * 20, 612], [x + k * 20, 560]], 8, COL.steel); for (const k of [-1, 0, 1]) line(c, [[x + k * 20, 612], [x + k * 20, 560]], 4, COL.steelIn); };
  const spoon = (x: number) => { shape(c, () => rrect(c, x - 13, 650, 26, 170, 10), COL.steel, 5); shape(c, () => ell(c, x, 605, 34, 50), COL.steel, 5); shape(c, () => ell(c, x, 605, 22, 36), COL.steelIn, 0); };
  fork(150); pencil(c, 340, 820, -Math.PI / 2, 250, 24); spoon(540);
  line(c, Array.from({ length: 25 }, (_, i) => [740 + Math.sin(i * 0.9) * 14, 570 + i * 10.5]), 8, INK); line(c, Array.from({ length: 25 }, (_, i) => [740 + Math.sin(i * 0.9) * 14, 570 + i * 10.5]), 4, WHITE);
  stickyStick(c, 920, 560, Math.PI / 2, 260);
};
// Window Watch: a child with a notebook watches a crow on the balcony railing
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 560, 150, 450, 580, 14), COL.wood); shade(c, () => rrect(c, 560, 150, 450, 580, 14), COL.woodDk, 20, 20, 0.5);
  shape(c, () => rrect(c, 592, 182, 386, 516, 6), COL.sky, 5);
  c.fillStyle = "#dceef9"; c.fillRect(594, 184, 382, 150);
  shape(c, () => ell(c, 900, 260, 40, 40), COL.yellow, 4);
  line(c, [[592, 560], [978, 560]], 14, COL.steelDk); line(c, [[592, 560], [978, 560]], 6, COL.steel);
  for (let x = 620; x < 978; x += 48) line(c, [[x, 566], [x, 696]], 6, COL.steelDk);
  crow(c, 850, 554, 0.9, -1);
  person(c, 280, 1000, 640, { reachL: [190, 785], reachR: [420, 775], dir: 1 });
  shape(c, () => rrect(c, 200, 720, 180, 140, 6), COL.paper); shape(c, () => rrect(c, 200, 720, 90, 140, 6), "#f3ecd9", 4);
  for (const y of [750, 775, 800, 825]) line(c, [[300, y], [368, y]], 2.5, COL.grey);
  line(c, [[300, 750], [340, 750]], 3, INK); line(c, [[300, 775], [355, 775]], 3, INK);
  pencil(c, 345, 800, Math.atan2(775 - 800, 420 - 345), 190, 20);
};
// Two Hands, Two Jobs: a pencil in each hand, a circle and a triangle drawn at the same time
const flowA4 = (c: Ctx) => {
  ground(c);
  person(c, 540, 1000, 680, { reachL: [400, 770], reachR: [680, 770] });
  shape(c, () => polyP(c, [[20, 806], [1060, 806], [1120, 1100], [-40, 1100]]), COL.wood, 6);
  shape(c, () => polyP(c, [[300, 826], [780, 826], [800, 980], [280, 980]]), COL.paper, 5);
  circleWobble(c, 405, 900, 48); triangleWobble(c, 690, 900, 52);
  pencil(c, 392, 852, Math.atan2(770 - 852, 400 - 392), 170, 20);
  pencil(c, 686, 852, Math.atan2(770 - 852, 680 - 686), 170, 20);
};
// My Body Book: a hand-made book open at the crow page, with the problem, part and price boxes
const flowP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 420, 24);
  shape(c, () => polyP(c, [[150, 280], [540, 300], [540, 820], [150, 800]]), COL.paper);
  shape(c, () => polyP(c, [[540, 300], [930, 280], [930, 800], [540, 820]]), COL.paper);
  shade(c, () => polyP(c, [[150, 280], [540, 300], [540, 820], [150, 800]]), "#e7dcc3", 350, 0, 0.6);
  line(c, [[540, 300], [540, 820]], 4, COL.grey);
  // the thread that ties the pages: stitches down the spine, a bow at the top
  for (const y of [420, 560, 700]) { line(c, [[540, y - 30], [540, y + 30]], 7, COL.red); shape(c, () => ell(c, 540, y - 30, 7, 7), COL.red, 2); shape(c, () => ell(c, 540, y + 30, 7, 7), COL.red, 2); }
  line(c, [[540, 330], [540, 300]], 7, COL.red);
  shape(c, () => { c.moveTo(540, 300); c.quadraticCurveTo(470, 240, 490, 300); c.closePath(); }, COL.red, 4); shape(c, () => { c.moveTo(540, 300); c.quadraticCurveTo(610, 240, 590, 300); c.closePath(); }, COL.red, 4);
  // left page: the crow, with arrows to her beak and her feet
  line(c, [[200, 700], [480, 708]], 5, COL.greyDk);
  crow(c, 330, 700, 1, 1);
  shape(c, () => rrect(c, 350, 360, 120, 46, 6), "#fce9d6", 4); line(c, [[364, 383], [456, 383]], 5, COL.orange);
  arrow(c, [[420, 408], [440, 570]], INK, 4);
  shape(c, () => rrect(c, 190, 740, 120, 46, 6), "#dff0ea", 4); line(c, [[204, 763], [296, 763]], 5, COL.tealDk);
  arrow(c, [[260, 740], [300, 712]], INK, 4);
  // right page: problem, part, price
  for (const [i, col, bar] of [[0, "#fce9d6", COL.orange], [1, "#dff0ea", COL.tealDk], [2, "#ece4f5", COL.purple]] as [number, string, string][]) {
    const y = 340 + i * 150; shape(c, () => rrect(c, 590, y, 300, 120, 8), col, 4);
    line(c, [[610, y + 28], [720, y + 28]], 7, bar); line(c, [[610, y + 62], [860, y + 62]], 3, COL.grey); line(c, [[610, y + 88], [820, y + 88]], 3, COL.grey);
  }
};
// Zygodactyl feet: a woodpecker on a trunk, and her foot close up: two toes forward, two back
const termZygo = (c: Ctx) => {
  ground(c);
  // the trunk
  shape(c, () => rrect(c, 130, -40, 250, 1160, 30), BARK); shade(c, () => rrect(c, 130, -40, 250, 1160, 30), BARK_DK, 150, 0, 0.6);
  for (let y = 60; y < 1080; y += 110) line(c, [[170, y], [185, y + 60]], 4, BARK_DK), line(c, [[260, y + 40], [250, y + 100]], 4, BARK_DK);
  // the bird clinging to its right side, head up, beak on the bark, stiff tail pressed below
  const bx = 380, by = 640;
  shape(c, () => polyP(c, [[bx + 14, by - 44], [bx + 74, by - 36], [bx + 46, by + 90], [bx + 6, by + 86]]), COL.black);
  shape(c, () => ell(c, bx + 62, by - 150, 50, 118, -0.12), "#f5efe0");
  shape(c, () => ell(c, bx + 86, by - 168, 30, 86, -0.2), COL.yellow, 4); shade(c, () => ell(c, bx + 86, by - 168, 30, 86, -0.2), COL.orange, 10, 0, 0.6);
  for (let k = 0; k < 5; k++) shape(c, () => ell(c, bx + 34 + (k % 2) * 14, by - 110 + k * 22, 5, 4), INK, 0);
  shape(c, () => ell(c, bx + 44, by - 290, 44, 42), "#f5efe0");
  shape(c, () => { c.moveTo(bx + 4, by - 300); c.bezierCurveTo(bx + 10, by - 350, bx + 80, by - 350, bx + 86, by - 300); c.quadraticCurveTo(bx + 44, by - 318, bx + 4, by - 300); c.closePath(); }, COL.red, 4);
  line(c, [[bx + 30, by - 280], [bx + 78, by - 268]], 6, INK);
  shape(c, () => polyP(c, [[bx + 10, by - 300], [bx - 4, by - 286], [bx + 12, by - 274]]), COL.greyDk, 4);
  shape(c, () => ell(c, bx + 30, by - 296, 8, 8), WHITE, 3); shape(c, () => ell(c, bx + 28, by - 296, 4, 4), INK, 0);
  // the leg and the gripping foot: two toes up the trunk, two down
  line(c, [[bx + 40, by - 70], [bx + 12, by - 12]], 14, INK); line(c, [[bx + 40, by - 70], [bx + 12, by - 12]], 7, COL.greyDk);
  for (const [dx, dy] of [[-14, -34], [-6, -40], [-12, 30], [-2, 36]]) line(c, [[bx + 12, by - 12], [bx + 12 + dx, by - 12 + dy]], 7, INK);
  // the zoom circle: the same foot, big, pressed onto the bark
  line(c, [[bx + 14, by - 4], [600, 560]], 5, INK);
  const zx = 790, zy = 560, zr = 210;
  shape(c, () => ell(c, zx, zy, zr + 10, zr + 10), WHITE, 0);
  c.save(); c.beginPath(); ell(c, zx, zy, zr, zr); c.clip();
  c.fillStyle = BG; c.fillRect(zx - zr, zy - zr, zr * 2, zr * 2);
  shape(c, () => rrect(c, zx - zr - 20, zy - zr - 20, zr + 20, zr * 2 + 40, 20), BARK); line(c, [[zx - 150, zy - 180], [zx - 135, zy - 90]], 4, BARK_DK); line(c, [[zx - 170, zy + 40], [zx - 155, zy + 150]], 4, BARK_DK); line(c, [[zx - 70, zy - 60], [zx - 60, zy + 30]], 4, BARK_DK);
  line(c, [[zx + 180, zy - 220], [zx + 40, zy - 20]], 36, INK); line(c, [[zx + 180, zy - 220], [zx + 40, zy - 20]], 24, COL.greyDk);
  const toe = (pts: number[][]) => { line(c, pts, 30, INK); line(c, pts, 18, COL.greyDk); for (const [x, y] of pts.slice(1, -1)) shape(c, () => ell(c, x, y, 13, 13), COL.greyDk, 4); };
  // two toes forward (up the trunk) and two back (down it), their claws hooked into the bark
  toe([[zx + 40, zy - 20], [zx - 20, zy - 90], [zx - 70, zy - 140]]); toe([[zx + 40, zy - 20], [zx + 20, zy - 110], [zx - 10, zy - 175]]);
  toe([[zx + 40, zy - 20], [zx - 20, zy + 70], [zx - 70, zy + 120]]); toe([[zx + 40, zy - 20], [zx + 20, zy + 90], [zx - 10, zy + 160]]);
  const claw = (x: number, y: number, a: number) => shape(c, () => { c.moveTo(x - Math.sin(a) * 10, y + Math.cos(a) * 10); c.quadraticCurveTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30, x + Math.cos(a) * 40 - Math.sin(a) * 16, y + Math.sin(a) * 40 + Math.cos(a) * 16); c.lineTo(x + Math.sin(a) * 10, y - Math.cos(a) * 10); c.closePath(); }, INK, 2);
  claw(zx - 70, zy - 140, -2.6); claw(zx - 10, zy - 175, -2.3); claw(zx - 70, zy + 120, 2.6); claw(zx - 10, zy + 160, 2.3);
  shape(c, () => ell(c, zx + 40, zy - 20, 28, 28), COL.greyDk, 5);
  c.restore();
  c.beginPath(); ell(c, zx, zy, zr, zr); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
  // two short red arrows: forward (up the trunk) and back
  arrow(c, [[zx + 130, zy - 40], [zx + 130, zy - 130]], RED, 8); arrow(c, [[zx + 130, zy + 50], [zx + 130, zy + 140]], RED, 8);
};
// Fat store: a camel with her hump cut open to show it is full of pale fat
const termHump = (c: Ctx) => {
  ground(c);
  c.fillStyle = SAND; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 5, "#d9b97e");
  c.save(); c.translate(500, 820);
  const leg = (pts: number[][], col: string) => { line(c, pts, 42, INK); line(c, pts, 30, col); };
  const padFoot = (x: number, col: string) => { shape(c, () => ell(c, x, -8, 40, 16), col, 5); line(c, [[x, -22], [x, 4]], 4, INK); };
  // far legs first, darker
  leg([[185, -240], [200, -130], [205, -4]], CAMEL_DK); leg([[-100, -250], [-140, -120], [-115, -4]], CAMEL_DK);
  padFoot(205, CAMEL_DK); padFoot(-115, CAMEL_DK);
  const body = () => ell(c, 0, -300, 220, 115), hump = () => ell(c, -10, -420, 125, 95), head = () => ell(c, 360, -572, 82, 42, 0.28);
  const neckPts = [[170, -330], [290, -400], [335, -520]];
  for (const pass of [0, 1]) {
    const col = pass ? CAMEL : INK, grow = pass ? 0 : 12;
    for (const p of [body, hump, head]) { c.beginPath(); p(); c.fillStyle = col; c.fill(); if (grow) { c.lineWidth = grow; c.strokeStyle = INK; c.stroke(); } }
    c.beginPath(); c.moveTo(neckPts[0][0], neckPts[0][1]); c.quadraticCurveTo(neckPts[1][0], neckPts[1][1], neckPts[2][0], neckPts[2][1]); c.strokeStyle = col; c.lineWidth = 84 + grow; c.lineCap = "round"; c.stroke();
    for (const pts of [[[150, -240], [160, -130], [165, -4]], [[-135, -250], [-172, -120], [-150, -4]]]) line(c, pts, 30 + grow, col);
    if (!pass) { line(c, [[-212, -330], [-250, -200]], 22, INK); } else { line(c, [[-212, -330], [-250, -200]], 10, CAMEL); shape(c, () => ell(c, -254, -186, 16, 22), CAMEL_DK, 4); }
  }
  shade(c, body, CAMEL_DK, 0, 70, 0.5);
  padFoot(165, CAMEL); padFoot(-150, CAMEL);
  // head details: ear, eye, nostril, mouth
  shape(c, () => polyP(c, [[318, -606], [300, -640], [336, -624]]), CAMEL, 4);
  shape(c, () => ell(c, 345, -590, 9, 9), WHITE, 3); shape(c, () => ell(c, 347, -590, 4.5, 4.5), INK, 0);
  shape(c, () => ell(c, 428, -560, 5, 7), INK, 0); line(c, [[400, -542], [432, -546]], 4, INK);
  // the hump cut open: a round window full of pale fat
  const win = () => { c.moveTo(70, -420); for (let i = 1; i <= 16; i++) { const a = (i / 16) * Math.PI * 2, rr = 80 + (i % 2 ? 6 : -4); c.lineTo(-10 + Math.cos(a) * rr, -420 + Math.sin(a) * rr); } c.closePath(); };
  shape(c, win, FAT, 6);
  for (const [x, y, r] of [[-40, -445, 20], [10, -450, 18], [-50, -400, 16], [20, -405, 22], [-15, -425, 14], [-5, -375, 15], [40, -430, 13]]) shape(c, () => ell(c, x, y, r, r * 0.85), FAT_DK, 3);
  c.restore();
};
// Jet propulsion: water squirts backwards out of the funnel and the octopus shoots forwards
const termJet = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#cfe6f5"; c.fillRect(0, 0, D, D);
  for (const [x, y, r] of [[160, 180, 18], [230, 110, 12], [960, 900, 16], [900, 980, 10]]) shape(c, () => ell(c, x, y, r, r), "#e6f3fb", 4);
  const mantle = () => ell(c, 720, 420, 185, 135, -0.3);
  // eight arms trailing behind, suckers along their undersides
  const arms: number[][][] = [
    [[560, 470], [430, 440], [300, 470], [190, 430]], [[560, 490], [440, 500], [330, 530], [230, 500]], [[560, 510], [450, 560], [320, 590], [210, 570]], [[570, 530], [470, 600], [370, 660], [260, 660]],
    [[590, 540], [520, 630], [430, 700], [340, 720]], [[600, 545], [560, 650], [490, 730], [410, 770]], [[615, 548], [600, 650], [560, 740], [500, 800]], [[625, 548], [640, 650], [630, 750], [600, 830]],
  ];
  const armPath = (p: number[][]) => { c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]); };
  for (const p of arms) { armPath(p); c.strokeStyle = INK; c.lineWidth = 44; c.lineCap = "round"; c.stroke(); }
  for (const p of arms) { armPath(p); c.strokeStyle = OCTO; c.lineWidth = 32; c.stroke(); }
  for (const p of arms) for (let t = 0.25; t < 1; t += 0.14) { const u = 1 - t, x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]; shape(c, () => ell(c, x, y + 6, 6 * (1 - t * 0.5), 5 * (1 - t * 0.5)), "#f6c9a8", 2); }
  // the head and the mantle
  shape(c, () => ell(c, 600, 480, 90, 85), OCTO, 0);
  shape(c, mantle, OCTO); shade(c, mantle, OCTO_DK, 30, 50, 0.5);
  shape(c, () => ell(c, 600, 480, 90, 85), OCTO, 0);
  c.beginPath(); c.moveTo(520, 460); c.quadraticCurveTo(540, 400, 600, 395); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.beginPath(); c.moveTo(520, 490); c.quadraticCurveTo(530, 560, 620, 565); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (const [x, y, r] of [[760, 380, 14], [810, 440, 10], [720, 470, 11], [700, 360, 8]]) shape(c, () => ell(c, x, y, r, r), "#f0a070", 0);
  shape(c, () => ell(c, 585, 455, 28, 30), WHITE, 5); shape(c, () => ell(c, 583, 457, 14, 8, 0.1), INK, 0);
  // the funnel under the head, pointing backwards, and the jet of water
  shape(c, () => polyP(c, [[598, 536], [616, 570], [550, 602], [534, 568]]), OCTO_DK, 5);
  shape(c, () => ell(c, 542, 585, 10, 19, 0.45), COL.waterDk, 4);
  for (const [x, y, r] of [[470, 600, 9], [430, 650, 7], [500, 650, 6]]) shape(c, () => ell(c, x, y, r, r), WHITE, 3);
  arrow(c, [[536, 590], [370, 660]], COL.blueDk, 14);
  arrow(c, [[905, 350], [1030, 300]], RED, 14);
};

export const ic_animalsAnimalBodiesL4 = cards("sci.animals.animal-bodies.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, e2s4,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, termZygo, termHump, termJet,
]);
// keep the hand helper available for a later card that grips a tool
void hand;
