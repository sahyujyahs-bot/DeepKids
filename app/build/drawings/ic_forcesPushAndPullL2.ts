import type { Ctx } from "./core";
import { D, INK, BG, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, cards } from "./flatKit";

// PUSHES AND PULLS (L2) · set-up cards and card pictures in the flat kit look.
// The same child (orange top, hair bun) and grown-up (blue top) on every card.

const CLOTH_DK = "#e4dccb", TILE = "#e6e9ec", TILE_LN = "rgba(43,35,64,0.25)", LCD = "#c9f06b", SCREEN = "#22303a", BRASS = "#d9a441", BRASS_DK = "#a8761f";

// ---------------------------------------------------------------- small helpers
// where person() puts a shoulder (viewer's side: -1 left, +1 right) and how far the hand can go from it
const shoulderOf = (x: number, y: number, h: number, side: number, sit = false, adult = false): [number, number] => {
  const hip = sit ? y - h * 0.07 : y - h * (adult ? 0.46 : 0.4), sh = hip - h * (adult ? 0.3 : 0.27);
  return [x + side * h * (adult ? 0.27 : 0.25) * 0.42, sh + h * 0.03];
};
// the forearm angle person() will use for a hand reaching (tx, ty), copied from its two-bone solve
const forearmAngle = (x: number, y: number, h: number, side: number, tx: number, ty: number, sit = false, adult = false) => {
  const [sx, sy] = shoulderOf(x, y, h, side, sit, adult), l1 = h * 0.17, l2 = h * 0.155;
  const dx = tx - sx, dy = ty - sy, d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1), (l1 + l2) * 0.999), a = Math.atan2(dy, dx);
  const th = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), ea = a + side * th;
  const ex = sx + Math.cos(ea) * l1, ey = sy + Math.sin(ea) * l1, wx = sx + Math.cos(a) * d, wy = sy + Math.sin(a) * d;
  return Math.atan2(wy - ey, wx - ex);
};
// closed eyes painted over the open ones person() drew
const eyesShut = (c: Ctx, x: number, y: number, h: number, sit = false, adult = false) => {
  const head = h * (adult ? 0.115 : 0.15), hip = sit ? y - h * 0.07 : y - h * (adult ? 0.46 : 0.4), sh = hip - h * (adult ? 0.3 : 0.27), hy = sh - head * 1.12, skin = adult ? SKIN.adult : SKIN.child;
  for (const s of [-1, 1]) {
    const ex = x + s * head * 0.38, ey = hy + head * 0.16;
    shape(c, () => ell(c, ex, ey, head * 0.2, head * 0.25), skin, 0);
    c.beginPath(); c.moveTo(ex - head * 0.16, ey - head * 0.02); c.quadraticCurveTo(ex, ey + head * 0.16, ex + head * 0.16, ey - head * 0.02); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
  }
};
// the mitten hand person() draws, drawn again on top of something that covered it; open = fingers spread flat
const mitt = (c: Ctx, [x, y]: [number, number], an: number, h: number, side: number, adult = false, open = false) => {
  const r = h * 0.062 * 0.7, skin = adult ? SKIN.adult : SKIN.child;
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => ell(c, r * 0.5, 0, r * 1.05, r * 0.8), skin, 5);
  if (open) for (let k = -1; k <= 1; k++) shape(c, () => rrect(c, r * 1.1, k * r * 0.5 - r * 0.22, r * 1.1 - Math.abs(k) * r * 0.2, r * 0.44, r * 0.2), skin, 4);
  shape(c, () => ell(c, r * 0.3, -side * r * 0.8, r * 0.5, r * 0.32, -side * 0.5), skin, 4);
  c.restore();
};
// one finger stuck out from a mitten hand along an, from the hand's front edge
const finger = (c: Ctx, [x, y]: [number, number], an: number, h: number, len: number, adult = false) => {
  const r = h * 0.062 * 0.7, skin = adult ? SKIN.adult : SKIN.child, x0 = x + Math.cos(an) * r * 1.4, y0 = y + Math.sin(an) * r * 1.4, x1 = x0 + Math.cos(an) * len, y1 = y0 + Math.sin(an) * len;
  line(c, [[x0, y0], [x1, y1]], r * 0.6 + 8, INK); line(c, [[x0, y0], [x1, y1]], r * 0.6, skin);
};
// a fist closing round handles at a hand point
const grip = (c: Ctx, [x, y]: [number, number], h: number, adult = false) => {
  const r = h * 0.062 * 0.72, skin = adult ? SKIN.adult : SKIN.child;
  shape(c, () => ell(c, x, y, r * 0.95, r * 0.85), skin, 5);
  line(c, [[x - r * 0.4, y - r * 0.1], [x + r * 0.2, y - r * 0.15]], 3, adult ? SKIN.adultDk : SKIN.childDk);
};
// a full 1-litre water bottle standing on (x, yb), w wide, ht tall
const bottle = (c: Ctx, x: number, yb: number, w: number, ht: number) => {
  const body = () => rrect(c, x - w / 2, yb - ht * 0.8, w, ht * 0.8, w * 0.2);
  shape(c, body, COL.water); shade(c, body, COL.waterDk, w * 0.3, 0);
  shape(c, () => { c.moveTo(x - w / 2 + 4, yb - ht * 0.8); c.lineTo(x - w * 0.24, yb - ht * 0.9); c.lineTo(x + w * 0.24, yb - ht * 0.9); c.lineTo(x + w / 2 - 4, yb - ht * 0.8); c.closePath(); }, COL.water, 5);
  shape(c, () => rrect(c, x - w * 0.24, yb - ht * 0.93, w * 0.48, ht * 0.05, 3), COL.drop, 4);
  shape(c, () => rrect(c, x - w * 0.3, yb - ht, w * 0.6, ht * 0.08, 5), COL.blueDk, 5);
  shine(c, [[x - w * 0.3, yb - ht * 0.7], [x - w * 0.3, yb - ht * 0.25]], 7);
};
// a cloth shopping bag hanging straight down from the hand at hp: mouth at my, w wide, bh tall;
// bottles = two water bottles inside with their caps showing above the mouth
const clothBag = (c: Ctx, hp: [number, number], my: number, w: number, bh: number, opts: { bottles?: boolean; h?: number; adult?: boolean; before?: () => void } = {}) => {
  const [hx, hy] = hp, x = hx, bulge = opts.bottles ? w * 0.12 : w * 0.03;
  if (opts.bottles) { bottle(c, x - w * 0.19, my + bh * 0.5, w * 0.26, bh * 0.95); bottle(c, x + w * 0.19, my + bh * 0.5, w * 0.26, bh * 0.95); }
  opts.before?.();
  const body = () => { c.moveTo(x - w / 2, my); c.lineTo(x + w / 2, my); c.quadraticCurveTo(x + w / 2 + bulge, my + bh * 0.65, x + w / 2 - w * 0.06, my + bh); c.lineTo(x - w / 2 + w * 0.06, my + bh); c.quadraticCurveTo(x - w / 2 - bulge, my + bh * 0.65, x - w / 2, my); c.closePath(); };
  shape(c, body, COL.cloth); shade(c, body, CLOTH_DK, w * 0.14, 0, 0.5);
  shape(c, () => ell(c, x, my, w / 2, w * 0.06), CLOTH_DK, 5);
  for (const s of [-1, 1]) { const pts = [[hx + s * 7, hy], [x + s * w * 0.36, my]]; line(c, pts, 15, INK); line(c, pts, 7, COL.cloth); }
  grip(c, hp, opts.h ?? 560, opts.adult);
};
// the secret packet: rice tied in a hanky; body centre (x, y), r its size; the knot sits above
const bundle = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r * 0.92);
  shape(c, body, COL.cloth); shade(c, body, CLOTH_DK, r * 0.3, 0, 0.5);
  line(c, [[x - r * 0.1, y - r * 0.8], [x - r * 0.35, y + r * 0.3]], 3, COL.greyDk); line(c, [[x + r * 0.15, y - r * 0.85], [x + r * 0.45, y + r * 0.2]], 3, COL.greyDk);
  for (const s of [-1, 1]) shape(c, () => { c.moveTo(x, y - r * 0.85); c.quadraticCurveTo(x + s * r * 0.9, y - r * 1.55, x + s * r * 0.5, y - r * 1.8); c.quadraticCurveTo(x + s * r * 0.15, y - r * 1.5, x, y - r * 0.85); c.closePath(); }, COL.cloth, 5);
  shape(c, () => ell(c, x, y - r * 0.98, r * 0.3, r * 0.24), COL.cloth, 5);
};
// a bathroom scale on the floor: bottom front edge centre (x, y), w wide, showing num on its display
const bathScale = (c: Ctx, x: number, y: number, w: number, num: string) => {
  const dep = w * 0.36, f = w * 0.06, top = () => rrect(c, x - w / 2, y - f - dep, w, dep, w * 0.07);
  shadow(c, x + w * 0.04, y + 8, w * 0.56, w * 0.05);
  shape(c, () => rrect(c, x - w / 2, y - f - dep * 0.3, w, dep * 0.3 + f, w * 0.05), COL.steelDk);
  shape(c, top, "#eef1f4"); shade(c, top, COL.steel, w * 0.1, 0, 0.5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * w * 0.25, y - f - dep * 0.42, w * 0.1, dep * 0.28), COL.steelIn, 4);
  shape(c, () => rrect(c, x - w * 0.15, y - f - dep * 0.9, w * 0.3, dep * 0.34, 6), SCREEN, 5);
  write(c, num, x - num.length * dep * 0.11, y - f - dep * 0.84, dep * 0.22, LCD, 6);
};
// a tiled floor from y0 down
const tiles = (c: Ctx, y0: number) => {
  c.fillStyle = TILE; c.fillRect(0, y0, D, D + 200 - y0);
  c.strokeStyle = TILE_LN; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 135) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, D + 200); c.stroke(); }
  for (let y = y0; y <= D + 200; y += 135) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, y0], [D, y0]], 6);
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s * 0.5, y], [x - s * 0.15, y + s * 0.4], [x + s * 0.55, y - s * 0.45]], 6, COL.greenDk);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s * 0.4, y - s * 0.4], [x + s * 0.4, y + s * 0.4]], 6, RED); line(c, [[x + s * 0.4, y - s * 0.4], [x - s * 0.4, y + s * 0.4]], 6, RED); };
// a sheet of paper, centre (x, y), w by ph, turned by rot; draw() adds what is on it (in the paper's own frame)
const paper = (c: Ctx, x: number, y: number, w: number, ph: number, rot: number, draw: () => void) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 10, 14, w * 0.5, ph * 0.5);
  shape(c, () => rrect(c, -w / 2, -ph / 2, w, ph, 6), COL.paper, 5);
  draw(); c.restore();
};
// the tally sheet: two columns, ticks and crosses
const tallySheet = (c: Ctx, x: number, y: number, w: number, ph: number, rot: number, cols: string[]) => paper(c, x, y, w, ph, rot, () => {
  line(c, [[0, -ph * 0.42], [0, ph * 0.44]], 3, COL.greyDk); line(c, [[-w * 0.44, -ph * 0.28], [w * 0.44, -ph * 0.28]], 3, COL.greyDk);
  cols.forEach((col, k) => { const cx = (k - 0.5) * w * 0.5; [...col].forEach((m, i) => { const cy = -ph * 0.2 + i * ph * 0.105; if (m === "v") tick(c, cx, cy, w * 0.13); else cross(c, cx, cy, w * 0.13); }); });
  // a small bag drawn as the column heading: empty, or with two bottle tops
  cols.forEach((_, k) => { const cx = (k - 0.5) * w * 0.5, cy = -ph * 0.35; shape(c, () => rrect(c, cx - w * 0.09, cy - ph * 0.03, w * 0.18, ph * 0.06, 4), COL.cloth, 3); line(c, [[cx - w * 0.05, cy - ph * 0.03], [cx, cy - ph * 0.07], [cx + w * 0.05, cy - ph * 0.03]], 3); if (k === 1) for (const s of [-1, 1]) shape(c, () => rrect(c, cx + s * w * 0.04 - 6, cy - ph * 0.02, 12, ph * 0.04, 2), COL.blueDk, 2); });
});
const coin = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); shape(c, () => ell(c, x, y, r * 0.7, r * 0.7), COL.orange, 3); shape(c, () => ell(c, x - r * 0.15, y, r * 0.22, r * 0.22), COL.yellow, 0); };
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -9, len, 18, 3), COL.yellow, 4); shape(c, () => { c.moveTo(len, -9); c.lineTo(len + 26, 0); c.lineTo(len, 9); c.closePath(); }, COL.wood, 4);
  shape(c, () => ell(c, len + 24, 0, 5, 5), INK, 0); shape(c, () => rrect(c, -14, -9, 16, 18, 3), COL.pink, 4);
  c.restore();
};
// a rice grain
const grain = (c: Ctx, x: number, y: number, rot: number) => shape(c, () => ell(c, x, y, 9, 4.5, rot), "#fdf8ea", 2.5);
// a red tomato with its green star, centre (x, y)
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), COL.red); shade(c, () => ell(c, x, y, r, r * 0.9), "#b83a28", r * 0.3, 0, 0.5);
  for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.8; line(c, [[x, y - r * 0.75], [x + Math.cos(a) * r * 0.45, y - r * 0.75 + Math.sin(a) * r * 0.3 + r * 0.1]], 5, COL.leafDk); }
  shine(c, [[x - r * 0.45, y - r * 0.45], [x - r * 0.25, y - r * 0.6]], 6);
};

// ================================================================ set-up cards
// setup.e1.0 · a hanky with a heap of rice in the middle, then its corners tied into a soft bundle
const sE1a = (c: Ctx) => {
  ground(c);
  // the hanky, laid flat with a blue border, a little turned
  c.save(); c.translate(330, 560); c.rotate(-0.12);
  shadow(c, 14, 18, 230, 230);
  shape(c, () => rrect(c, -215, -215, 430, 430, 10), COL.cloth, 6);
  c.beginPath(); rrect(c, -185, -185, 370, 370, 6); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.stroke();
  // the heap of rice
  shape(c, () => ell(c, 0, 8, 105, 72), "#f1e7cf", 5);
  const r = rnd(5);
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); grain(c, Math.cos(a) * d * 92, 8 + Math.sin(a) * d * 60, r() * 3); }
  c.restore();
  arrow(c, [[585, 560], [690, 560]]);
  // the tied bundle
  shadow(c, 850, 672, 120, 24);
  bundle(c, 840, 565, 110);
  grain(c, 745, 672, 0.4); grain(c, 960, 680, 2.6);
};

// setup.e1.1 · the girl sits with her eyes shut, holding the empty bag still, arm bent
const sE1b = (c: Ctx) => {
  ground(c);
  line(c, [[0, 902], [D, 902]], 5, "rgba(43,35,64,0.25)");
  const x = 500, y = 900, h = 700;
  const hp = person(c, x, y, h, { sit: true, dir: 1, reachR: [700, 560], reachL: [340, 830] });
  eyesShut(c, x, y, h, true);
  clothBag(c, hp.handR, 640, 220, 220, { h });
};

// setup.e1.2 · the grown-up tosses a coin and lowers the packet into the bag the girl holds
const sE1c = (c: Ctx) => {
  ground(c);
  line(c, [[0, 902], [D, 902]], 5, "rgba(43,35,64,0.25)");
  const gx = 330, gy = 900, gh = 640, ax = 790, ah = 800;
  const ad = person(c, ax, gy, ah, { sit: true, dir: -1, adult: true, reachL: [552, 550], reachR: [930, 470] });
  const g = person(c, gx, gy, gh, { sit: true, dir: 1, reachR: [480, 560], reachL: [190, 830] });
  eyesShut(c, gx, gy, gh, true);
  // the coin in the air above the open palm
  coin(c, ad.handR[0] + 18, ad.handR[1] - 76, 32);
  for (const s of [-1, 1]) line(c, [[ad.handR[0] + 18 + s * 48, ad.handR[1] - 120], [ad.handR[0] + 18 + s * 38, ad.handR[1] - 90]], 4, COL.greyDk);
  // the packet hangs from the grown-up's hand, going into the mouth of the bag
  clothBag(c, g.handR, 650, 230, 190, { h: gh, before: () => bundle(c, ad.handL[0] + 4, ad.handL[1] + 72, 44) });
  grip(c, ad.handL, ah, true);
};

// setup.e1.3 · the heavy bag with two bottles, and the tally sheet with ticks and crosses
const sE1d = (c: Ctx) => {
  ground(c);
  line(c, [[0, 902], [D, 902]], 5, "rgba(43,35,64,0.25)");
  const x = 380, y = 900, h = 640;
  const hp = person(c, x, y, h, { sit: true, dir: 1, reachR: [540, 555], reachL: [240, 830] });
  eyesShut(c, x, y, h, true);
  clothBag(c, hp.handR, 640, 240, 220, { h, bottles: true });
  tallySheet(c, 880, 650, 250, 330, 0.08, ["vvvvvv", "vxvxxv"]);
  pencil(c, 800, 870, 110, -0.35);
};

// setup.e2.0 · the bathroom scale on the tiles, the child pressing it with one finger
const sE2a = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -110); tiles(c, 560);
  // the arm goes straight down to the scale, the other hand rests on the floor beside it
  const x = 580, y = 960, h = 680, t: [number, number] = [690, 958], tl: [number, number] = [366, 914];
  const hp = person(c, x, y, h, { sit: true, dir: 1, reachR: t, reachL: tl });
  bathScale(c, 600, 1060, 380, "2");
  const an = forearmAngle(x, y, h, 1, t[0], t[1], true);
  mitt(c, hp.handR, an, h, 1); finger(c, hp.handR, an, h, 24);  c.restore();
};

// setup.e2.1 · both palms flat on the scale, arms straight; the grown-up writes the number down
const sE2b = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -110); tiles(c, 560);
  const x = 560, y = 960, h = 680, ax = 890, ah = 680, tl: [number, number] = [430, 955], tr: [number, number] = [690, 955];
  const ad = person(c, ax, y, ah, { sit: true, dir: -1, adult: true, reachL: [800, 850], reachR: [930, 830] });
  const hp = person(c, x, y, h, { sit: true, dir: 1, reachL: tl, reachR: tr });
  bathScale(c, 560, 1060, 380, "11");
  mitt(c, hp.handL, forearmAngle(x, y, h, -1, tl[0], tl[1], true), h, -1, false, true);
  mitt(c, hp.handR, forearmAngle(x, y, h, 1, tr[0], tr[1], true), h, 1, false, true);
  paper(c, 865, 890, 180, 130, 0.04, () => { write(c, "7", -40, -40, 34, INK, 5); write(c, "11", -10, 2, 34, INK, 5); });
  grip(c, ad.handL, ah, true);
  pencil(c, ad.handR[0] - 10, ad.handR[1] + 6, 90, 2.4); grip(c, ad.handR, ah, true);  c.restore();
};

// ================================================================ card pictures
// flow.e1 · the Secret Packet: eyes shut, the heavy bag, the packet going in
const fE1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 902], [D, 902]], 5, "rgba(43,35,64,0.25)");
  const gx = 330, gy = 900, gh = 640, ax = 800, ah = 800;
  const ad = person(c, ax, gy, ah, { sit: true, dir: -1, adult: true, reachL: [568, 548], reachR: [900, 820] });
  const g = person(c, gx, gy, gh, { sit: true, dir: 1, reachR: [480, 560], reachL: [190, 830] });
  eyesShut(c, gx, gy, gh, true);
  clothBag(c, g.handR, 640, 250, 200, { h: gh, bottles: true, before: () => bundle(c, ad.handL[0] + 4, ad.handL[1] + 70, 42) });
  grip(c, ad.handL, ah, true);
};

// flow.e2 · Push the Scale: one whole hand pushing down, the number showing the push
const fE2 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, -110); tiles(c, 560);
  const x = 580, y = 960, h = 680, t: [number, number] = [690, 958];
  const hp = person(c, x, y, h, { sit: true, dir: 1, reachR: t, reachL: [366, 914] });
  bathScale(c, 600, 1060, 380, "7");
  mitt(c, hp.handR, forearmAngle(x, y, h, 1, t[0], t[1], true), h, 1, false, true);
  arrow(c, [[770, 740], [770, 870]], RED, 12);  c.restore();
};

// flow.a1 · the force hunt: tap water pushing a steel cup in the sink
const fA1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 1002], [D, 1002]], 5, "rgba(43,35,64,0.25)");
  // the counter with its sink
  shape(c, () => polyP(c, [[440, 720], [D + 20, 720], [D + 20, 1000], [440, 1000]]), COL.woodDk);
  shape(c, () => polyP(c, [[440, 600], [D + 20, 600], [D + 20, 720], [440, 720]]), COL.steel);
  shape(c, () => rrect(c, 520, 622, 380, 86, 14), COL.steelDk, 5);
  shape(c, () => rrect(c, 540, 640, 340, 56, 10), COL.waterDk, 0);
  // the tap: a pipe up from the back edge, a spout curving over the sink, a lever on top
  line(c, [[575, 600], [575, 500], [600, 480], [640, 480], [660, 500], [660, 525]], 30, INK); line(c, [[575, 600], [575, 500], [600, 480], [640, 480], [660, 500], [660, 525]], 18, COL.steel);
  shape(c, () => rrect(c, 640, 515, 40, 22, 6), COL.steelDk, 5);
  shape(c, () => rrect(c, 540, 456, 70, 20, 8), COL.steelDk, 5);
  // water falling on the cup, the cup tipping away
  line(c, [[660, 540], [664, 660]], 22, COL.waterDk); line(c, [[660, 540], [664, 660]], 10, COL.drop);
  c.save(); c.translate(690, 690); c.rotate(0.35);
  shape(c, () => { c.moveTo(-34, -70); c.lineTo(34, -70); c.lineTo(28, 0); c.lineTo(-28, 0); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 0, -70, 34, 9), COL.steelIn, 4);
  c.restore();
  for (let k = 0; k < 3; k++) shape(c, () => ell(c, 600 + k * 50, 668 + (k % 2) * 8, 7, 5), COL.drop, 2.5);
  arrow(c, [[740, 600], [830, 600]], RED, 9);
  // the girl: one hand on the tap lever, the other holding her two-column sheet
  const x = 330, y = 1000, h = 640;
  const hp = person(c, x, y, h, { reachR: [552, 470], reachL: [215, 690] });
  paper(c, hp.handL[0] - 10, hp.handL[1] + 100, 150, 190, 0.05, () => { line(c, [[0, -70], [0, 80]], 3, COL.greyDk); line(c, [[-62, -60], [62, -60]], 3, COL.greyDk); tick(c, -32, -20, 24); tick(c, 32, 10, 24); });
  grip(c, hp.handL, h);
};

// flow.a2 · Eyes Shut: the grown-up presses the girl's open palm with two fingers
const fA2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 942], [D, 942]], 5, "rgba(43,35,64,0.25)");
  const gx = 330, y = 940, gh = 620, ax = 760, ah = 780, gt: [number, number] = [548, 645], at: [number, number] = [593, 602];
  const g = person(c, gx, y, gh, { reachR: gt, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  eyesShut(c, gx, y, gh);
  mitt(c, g.handR, forearmAngle(gx, y, gh, 1, gt[0], gt[1]), gh, 1, false, true);
  // the grown-up's arm comes down from the upper right, two fingers on the palm
  const ad = person(c, ax, y, ah, { adult: true, reachL: at, armR: [Math.PI * 0.45, Math.PI * 0.5] });
  const aan = forearmAngle(ax, y, ah, -1, at[0], at[1], false, true);
  finger(c, ad.handL, aan, ah, 26, true); finger(c, [ad.handL[0] + Math.sin(aan) * 16, ad.handL[1] - Math.cos(aan) * 16], aan, ah, 22, true);
  arrow(c, [[545, 500], [505, 580]], RED, 9);
};

// flow.a3 · Kitchen Forces: squeezing a lemon over the jug of jaggery water
const fA3 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 1002], [D, 1002]], 5, "rgba(43,35,64,0.25)");
  const ax = 840, ah = 740, y = 1000, cx = 300, ch = 620;
  const ad = person(c, ax, y, ah, { adult: true, reachL: [640, 655], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  // the counter, the grown-up behind it
  shape(c, () => polyP(c, [[430, 770], [D + 20, 770], [D + 20, 1000], [430, 1000]]), COL.woodDk);
  shape(c, () => polyP(c, [[430, 740], [D + 20, 740], [D + 20, 770], [430, 770]]), COL.wood);
  // jaggery lumps and a spoon on the counter
  for (const [jx, jy, r] of [[760, 738, 16], [790, 744, 13], [735, 748, 12]] as number[][]) shape(c, () => ell(c, jx, jy, r, r * 0.8), COL.brown, 4);
  shape(c, () => ell(c, 900, 752, 34, 16), COL.steel, 4); line(c, [[930, 748], [1010, 736]], 12, INK); line(c, [[930, 748], [1010, 736]], 6, COL.steel);
  // the steel jug of brown jaggery water, its handle in the grown-up's hand
  shadow(c, 575, 748, 70, 14);
  const jug = () => rrect(c, 505, 585, 110, 160, 12);
  shape(c, jug, COL.steel); shade(c, jug, COL.steelDk, 34, 0, 0.5);
  line(c, [[615, 615], [650, 615], [650, 690], [615, 690]], 20, INK); line(c, [[615, 615], [650, 615], [650, 690], [615, 690]], 10, COL.steel);
  shape(c, () => ell(c, 560, 585, 55, 14), COL.brown, 5);
  mitt(c, ad.handL, forearmAngle(ax, y, ah, -1, 640, 655, false, true), ah, -1, true);
  // the child squeezes half a lemon over the jug
  const ct: [number, number] = [520, 518];
  const hp = person(c, cx, y, ch, { reachR: ct, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const an = forearmAngle(cx, y, ch, 1, ct[0], ct[1]), lx = hp.handR[0] + Math.cos(an) * 34, ly = hp.handR[1] + Math.sin(an) * 34;
  // half a lemon, cut face down, held by its rind
  shape(c, () => { c.moveTo(lx - 38, ly + 8); c.bezierCurveTo(lx - 38, ly - 46, lx + 38, ly - 46, lx + 38, ly + 8); c.closePath(); }, COL.yellow, 5);
  shape(c, () => ell(c, lx, ly + 8, 38, 9), "#fff2b0", 4);
  grip(c, hp.handR, ch);
  for (let k = 0; k < 3; k++) shape(c, () => ell(c, lx + 14 + k * 6, ly + 40 + k * 26, 6, 9), "#fff2b0", 3);
  arrow(c, [[lx + 70, ly - 30], [lx + 46, ly - 8]], RED, 8); arrow(c, [[lx - 70, ly - 30], [lx - 46, ly - 8]], RED, 8);
};

// flow.p1 · the force diary: an open notebook page with three forces drawn in boxes
const fP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 790, 440, 40);
  shape(c, () => rrect(c, 110, 250, 860, 560, 16), COL.paper);
  for (let k = 0; k < 11; k++) shape(c, () => ell(c, 160 + k * 76, 250, 14, 14), COL.steelDk, 4);
  c.strokeStyle = "rgba(91,143,214,0.35)"; c.lineWidth = 2; for (let yy = 330; yy < 800; yy += 44) { c.beginPath(); c.moveTo(130, yy); c.lineTo(950, yy); c.stroke(); }
  const box = (bx: number) => { c.beginPath(); rrect(c, bx, 330, 240, 420, 8); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); };
  box(150); box(420); box(690);
  // 1: a bucket pulled up by a rope
  line(c, [[270, 350], [270, 500]], 6, COL.brown);
  shape(c, () => { c.moveTo(220, 520); c.lineTo(320, 520); c.lineTo(306, 640); c.lineTo(234, 640); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 270, 520, 50, 12), COL.steelIn, 4);
  c.beginPath(); c.arc(270, 520, 48, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  arrow(c, [[340, 620], [340, 520]], RED, 8);
  // 2: a kite in the wind
  shape(c, () => polyP(c, [[540, 360], [610, 450], [540, 580], [470, 450]]), COL.pink);
  line(c, [[540, 360], [540, 580]], 4); line(c, [[470, 450], [610, 450]], 4);
  line(c, [[540, 580], [530, 620], [550, 650], [535, 690]], 4);
  line(c, [[540, 470], [460, 720]], 4, COL.greyDk);
  for (let k = 0; k < 3; k++) line(c, [[440 + k * 10, 380 + k * 40], [470 + k * 10, 372 + k * 40], [490 + k * 10, 388 + k * 40]], 4, COL.blueDk);
  // 3: a dropped ball falling
  shape(c, () => ell(c, 810, 440, 52, 52), COL.red); shade(c, () => ell(c, 810, 440, 52, 52), "#b83a28", 16, 0, 0.5);
  shine(c, [[785, 418], [796, 408]], 7);
  arrow(c, [[810, 520], [810, 660]], RED, 8);
  line(c, [[720, 720], [900, 720]], 5);
};

// term.1 · a table fan blowing a sheet of paper off the edge of a table
const tFan = (c: Ctx) => {
  ground(c);
  // the table top and its legs
  shape(c, () => polyP(c, [[60, 700], [860, 700], [860, 740], [60, 740]]), COL.wood);
  shape(c, () => polyP(c, [[60, 700], [860, 700], [860, 740], [60, 740]]), COL.wood);
  line(c, [[110, 740], [110, 1000]], 24, INK); line(c, [[110, 740], [110, 1000]], 12, COL.woodDk);
  line(c, [[810, 740], [810, 1000]], 24, INK); line(c, [[810, 740], [810, 1000]], 12, COL.woodDk);
  // the fan: a round base, a stem, the motor, the round cage with blades inside
  shadow(c, 310, 702, 110, 18);
  shape(c, () => ell(c, 300, 690, 95, 20), COL.tealDk, 5);
  line(c, [[300, 690], [300, 560]], 26, INK); line(c, [[300, 690], [300, 560]], 14, COL.teal);
  shape(c, () => rrect(c, 230, 530, 80, 60, 12), COL.tealDk, 5);
  shape(c, () => ell(c, 300, 450, 175, 175), COL.sky, 6);
  for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k * Math.PI * 2) / 3; shape(c, () => { c.moveTo(300, 450); c.quadraticCurveTo(300 + Math.cos(a - 0.5) * 140, 450 + Math.sin(a - 0.5) * 140, 300 + Math.cos(a) * 150, 450 + Math.sin(a) * 150); c.quadraticCurveTo(300 + Math.cos(a + 0.45) * 120, 450 + Math.sin(a + 0.45) * 120, 300, 450); c.closePath(); }, COL.teal, 5); }
  shape(c, () => ell(c, 300, 450, 30, 30), COL.tealDk, 5);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[300 + Math.cos(a) * 32, 450 + Math.sin(a) * 32], [300 + Math.cos(a) * 173, 450 + Math.sin(a) * 173]], 3); }
  c.beginPath(); ell(c, 300, 450, 175, 175); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // the wind, and the paper lifting off the table's far edge
  for (let k = 0; k < 3; k++) { const yy = 400 + k * 50; c.beginPath(); c.moveTo(500, yy); c.quadraticCurveTo(560, yy - 25, 620, yy); c.quadraticCurveTo(680, yy + 25, 740, yy); c.strokeStyle = COL.blueDk; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  c.save(); c.translate(880, 640); c.rotate(0.55);
  shadow(c, 20, 30, 80, 100);
  shape(c, () => { c.moveTo(-75, -95); c.lineTo(75, -95); c.quadraticCurveTo(70, 0, 80, 95); c.lineTo(-70, 95); c.quadraticCurveTo(-60, 0, -75, -95); c.closePath(); }, COL.paper, 5);
  for (let k = 0; k < 4; k++) line(c, [[-45, -55 + k * 40], [45, -55 + k * 40]], 4, COL.grey);
  c.restore();
  arrow(c, [[940, 520], [1030, 560]], RED, 9);
};

// term.2 · a fridge magnet with a steel safety pin jumping towards it
const tMagnet = (c: Ctx) => {
  ground(c);
  // the fridge door with its handle
  shape(c, () => rrect(c, -40, -40, 640, D + 80, 30), COL.steelIn);
  shade(c, () => rrect(c, -40, -40, 640, D + 80, 30), COL.steel, 60, 0, 0.5);
  line(c, [[-40, 300], [600, 300]], 5, COL.steelDk);
  // the round magnet
  shadow(c, 410, 500, 88, 88);
  shape(c, () => ell(c, 400, 490, 85, 85), COL.red); shade(c, () => ell(c, 400, 490, 85, 85), "#b83a28", 26, 0, 0.5);
  shape(c, () => ell(c, 400, 490, 48, 48), COL.yellow, 5);
  // the safety pin in the air, pointing at the magnet, with motion lines behind it:
  // a coil at one end, a cap at the other, a straight pin and a bowed bar between them
  c.save(); c.translate(790, 545); c.rotate(-0.14);
  const bar = (w: number, col: string) => { line(c, [[-128, 12], [128, 12]], w, col); c.beginPath(); c.moveTo(-128, -8); c.quadraticCurveTo(0, -78, 128, -8); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
  bar(17, INK); bar(8, COL.steel);
  shape(c, () => ell(c, -150, 2, 26, 26), COL.steel, 6); c.beginPath(); c.arc(-150, 2, 12, 0.5, 5.5); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, () => rrect(c, 122, -36, 46, 64, 12), COL.steelDk, 6);
  c.restore();
  for (let k = 0; k < 3; k++) line(c, [[975 + k * 8, 470 + k * 50], [1035 + k * 8, 470 + k * 50]], 5, COL.greyDk);
  arrow(c, [[620, 530], [510, 505]], RED, 10);
};

// term.6 · a two-pan market balance, brass weights on one pan and tomatoes on the other, hanging level
const tBalance = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 230, 28);
  shape(c, () => rrect(c, 360, 900, 360, 60, 16), BRASS); shade(c, () => rrect(c, 360, 900, 360, 60, 16), BRASS_DK, 40, 0, 0.5);
  line(c, [[540, 900], [540, 300]], 34, INK); line(c, [[540, 900], [540, 300]], 22, BRASS);
  // the pointer and the level beam
  shape(c, () => { c.moveTo(540, 250); c.lineTo(520, 330); c.lineTo(560, 330); c.closePath(); }, BRASS_DK, 5);
  line(c, [[150, 300], [930, 300]], 30, INK); line(c, [[150, 300], [930, 300]], 18, BRASS);
  shape(c, () => ell(c, 540, 300, 22, 22), BRASS_DK, 5);
  for (const px of [160, 920]) {
    shape(c, () => ell(c, px, 300, 14, 14), BRASS_DK, 4);
    for (const s of [-1, 1]) line(c, [[px, 300], [px + s * 120, 640]], 5, COL.greyDk);
    shadow(c, px + 10, 690, 160, 24);
    shape(c, () => { c.moveTo(px - 150, 640); c.quadraticCurveTo(px - 140, 700, px, 700); c.quadraticCurveTo(px + 140, 700, px + 150, 640); c.closePath(); }, BRASS);
    shape(c, () => ell(c, px, 640, 150, 28), BRASS_DK, 5);
  }
  // brass weights on the left pan
  const weight = (wx: number, wy: number, w: number, ht: number) => { shape(c, () => rrect(c, wx - w / 2, wy - ht, w, ht, 8), BRASS); shade(c, () => rrect(c, wx - w / 2, wy - ht, w, ht, 8), BRASS_DK, w * 0.3, 0, 0.5); shape(c, () => ell(c, wx, wy - ht, w / 2, w * 0.12), BRASS, 4); shape(c, () => rrect(c, wx - w * 0.14, wy - ht - 22, w * 0.28, 26, 6), BRASS_DK, 4); };
  weight(110, 630, 90, 110); weight(205, 630, 70, 80); weight(270, 632, 48, 50);
  // tomatoes on the right pan
  tomato(c, 870, 600, 42); tomato(c, 955, 606, 44); tomato(c, 912, 560, 40); tomato(c, 990, 640, 30); tomato(c, 835, 640, 30);
};

// expl.2 · two hands: one holding a light cloth bag easily, one pulled down by a bag with two water bottles
const xTwoBags = (c: Ctx) => {
  ground(c);
  // the light bag
  hand(c, 150, 340, 0.05, 1.5, SKIN.child, CLOTH.child);
  const h1: [number, number] = [240, 346];
  clothBag(c, h1, 430, 170, 180, { h: 500 });
  arrow(c, [[380, 470], [380, 530]], RED, 8);
  // the heavy bag, the hand bent down by its pull
  hand(c, 620, 330, 0.6, 1.5, SKIN.child, CLOTH.child);
  const h2: [number, number] = [620 + Math.cos(0.6) * 92, 330 + Math.sin(0.6) * 92];
  clothBag(c, h2, 520, 250, 220, { h: 500, bottles: true });
  arrow(c, [[880, 560], [880, 760]], RED, 12);
};

export const ic_forcesPushAndPullL2 = cards("sci.forces.push-and-pull.L2", [sE1a, sE1b, sE1c, sE1d, sE2a, sE2b, fE1, fE2, fA1, fA2, fA3, fP1, tFan, tMagnet, tBalance, xTwoBags]);
