import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, person, write, cards } from "./flatKit";

// WATER: WHERE IT COMES FROM AND WHAT WE USE IT FOR (L1) · set-up cards and card pictures in the flat kit look.
// The poha test (three steel katoris: water, oil, nothing), the sticky plate (dried dal, soaked or dry),
// the water hunt (a tap), acting out animals drinking, a tally sheet, a saucer for birds, jugs, urad dal.

const P = {
  dry: "#f0dfb2", dryDk: "#d2bb84", wet: "#fcf7ec", wetDk: "#e2d8c0", oilF: "#eac85e", oilFDk: "#c9a23a",
  oil: "#f4d873", oilDk: "#d9b53f", dal: "#e9b63c", dalDk: "#c48f1e", clay: "#c66b3f", clayDk: "#9e4f2b",
  urad: "#3a3540", uradWet: "#5e5868", milk: "#fbf8f1", fridge: "#e6ebef", fridgeDk: "#c7d0d8", stone: "#d8d2c6", stoneDk: "#b9b2a4",
  crow: "#3a3540", crowNeck: "#7b7680", myna: "#8a5a3c", mynaDk: "#6a4128", pigeon: "#9aa3b4", pigeonDk: "#6f7a8f", straw: "#f29ab4",
};

// ---------------------------------------------------------------- where a person's hands are (the same sums as person())
type Sh = { x: number; y: number; h: number; sit?: boolean; adult?: boolean };
const shoulderOf = (p: Sh, side: number): [number, number] => {
  const ad = !!p.adult, hip = p.sit ? p.y - p.h * 0.07 : p.y - p.h * (ad ? 0.46 : 0.4), sh = hip - p.h * (ad ? 0.3 : 0.27), torsoW = p.h * (ad ? 0.27 : 0.25);
  return [p.x + side * torsoW * 0.42, sh + p.h * 0.03];
};
// the angle the forearm points when the hand reaches for t (so a held thing can lie along it)
const foreAngle = (p: Sh, side: number, t: [number, number]) => {
  const [sx, sy] = shoulderOf(p, side), l1 = p.h * 0.17, l2 = p.h * 0.155, full = l1 + l2, dx = t[0] - sx, dy = t[1] - sy;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1), full * 0.999), a = Math.atan2(dy, dx);
  const th = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), ea = a + side * th;
  return Math.atan2(sy + Math.sin(a) * d - (sy + Math.sin(ea) * l1), sx + Math.cos(a) * d - (sx + Math.cos(ea) * l1));
};
// the gripping hand from the kit drawn over the person's mitten, so a held thing sits in the fist
const grip = (c: Ctx, p: Sh, w: [number, number], an: number, open = false) => hand(c, w[0], w[1], an, p.h / 1120, p.adult ? SKIN.adult : SKIN.child, p.adult ? CLOTH.adult : CLOTH.child, open);

// ---------------------------------------------------------------- poha, katoris, labels
const flake = (c: Ctx, x: number, y: number, r: number, rot: number, kind: "dry" | "wet" | "oil") => {
  const col = kind === "dry" ? P.dry : kind === "wet" ? P.wet : P.oilF, dk = kind === "dry" ? P.dryDk : kind === "wet" ? P.wetDk : P.oilFDk, ry = kind === "wet" ? r * 0.8 : r * 0.55;
  const path = () => ell(c, x, y, r, ry, rot);
  shape(c, path, col, Math.max(2.5, r * 0.11));
  shade(c, path, dk, r * 0.3, r * 0.2, 0.5);
  if (kind === "oil") shine(c, [[x - r * 0.45, y - ry * 0.35], [x + r * 0.05, y - ry * 0.5]], Math.max(3, r * 0.1));
};
// a steel katori with two spoons of poha in it: dry, under water (swollen, pale) or under oil (shiny)
const katori = (c: Ctx, x: number, y: number, r: number, kind: "dry" | "water" | "oil", seed: number) => {
  bowl(c, x, y, r, kind === "water" ? COL.water : kind === "oil" ? P.oil : COL.steelIn);
  c.save(); c.beginPath(); ell(c, x, y, r * 0.95, r * 0.19); c.clip();
  const rd = rnd(seed), fk = kind === "dry" ? "dry" : kind === "water" ? "wet" : "oil", n = kind === "water" ? 10 : 14;
  for (let i = 0; i < n; i++) { const u = rd() * Math.PI * 2, v = Math.sqrt(rd()) * 0.8; flake(c, x + Math.cos(u) * v * r * 0.9, y + Math.sin(u) * v * r * 0.17, r * (kind === "water" ? 0.2 : 0.16), rd() * 3, fk); }
  if (kind !== "dry") { c.globalAlpha = kind === "water" ? 0.4 : 0.35; c.fillStyle = kind === "water" ? COL.waterDk : P.oilDk; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.globalAlpha = 1; shine(c, [[x - r * 0.6, y - r * 0.06], [x - r * 0.2, y - r * 0.1]], 7); }
  c.restore();
};
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - r * 1.4); c.quadraticCurveTo(x + r * 0.95, y - r * 0.2, x + r * 0.72, y + r * 0.4); c.arc(x, y + r * 0.4, r * 0.72, 0, Math.PI); c.quadraticCurveTo(x - r * 0.95, y - r * 0.2, x, y - r * 1.4); c.closePath(); }, col, Math.max(3, r * 0.12));
  shine(c, [[x - r * 0.35, y + r * 0.1], [x - r * 0.3, y + r * 0.45]], Math.max(3, r * 0.14));
};
// a small cooking-oil bottle standing up, base centre (x, y); cap on (for the label) or open
const bottleUp = (c: Ctx, x: number, y: number, w: number, h: number, cap: boolean) => {
  const body = () => rrect(c, x - w / 2, y - h * 0.72, w, h * 0.72, w * 0.2);
  shape(c, body, P.oil); shade(c, body, P.oilDk, w * 0.35, 0);
  shape(c, () => rrect(c, x - w * 0.18, y - h, w * 0.36, h * 0.32, w * 0.06), P.oil, 5);
  if (cap) shape(c, () => rrect(c, x - w * 0.24, y - h * 1.06, w * 0.48, h * 0.1, w * 0.06), RED, 4);
  shine(c, [[x - w * 0.3, y - h * 0.6], [x - w * 0.3, y - h * 0.25]], 6);
};
// the oil bottle tipped to pour: its open neck tip at (tx, ty), the neck pointing along dir
const bottleAt = (c: Ctx, tx: number, ty: number, dir: number, w: number, h: number) => { c.save(); c.translate(tx, ty); c.rotate(dir + Math.PI / 2); bottleUp(c, 0, h, w, h, false); c.restore(); };
// a paper label on the counter: a water drop, an oil bottle, or a red cross (nothing)
const tag = (c: Ctx, x: number, y: number, kind: "water" | "oil" | "none", s = 1) => {
  shadow(c, x + 8 * s, y + 56 * s, 70 * s, 9 * s);
  shape(c, () => rrect(c, x - 70 * s, y - 50 * s, 140 * s, 100 * s, 10 * s), WHITE, 5);
  if (kind === "water") drop(c, x, y + 4 * s, 30 * s);
  if (kind === "oil") bottleUp(c, x, y + 38 * s, 34 * s, 76 * s, true);
  if (kind === "none") { line(c, [[x - 26 * s, y - 26 * s], [x + 26 * s, y + 26 * s]], 8 * s, RED); line(c, [[x + 26 * s, y - 26 * s], [x - 26 * s, y + 26 * s]], 8 * s, RED); }
};
// a steel spoon: handle end at (x, y), pointing along an; returns the middle of its bowl
const spoon = (c: Ctx, x: number, y: number, an: number, len: number): [number, number] => {
  const bx = x + Math.cos(an) * len, by = y + Math.sin(an) * len, hx = x + Math.cos(an) * len * 0.72, hy = y + Math.sin(an) * len * 0.72;
  line(c, [[x, y], [hx, hy]], len * 0.16, INK); line(c, [[x, y], [hx, hy]], len * 0.16 - 10, COL.steel);
  shape(c, () => ell(c, bx, by, len * 0.3, len * 0.19, an), COL.steel, 5);
  shape(c, () => ell(c, bx, by, len * 0.22, len * 0.12, an), COL.steelIn, 3);
  return [bx, by];
};
// liquid falling from (x1, y1) to (x2, y2), with a splash where it lands
const stream = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number, col: string) => {
  shape(c, () => polyP(c, [[x1 - w / 2, y1], [x1 + w / 2, y1], [x2 + w * 0.3, y2], [x2 - w * 0.3, y2]]), col, 4);
  shape(c, () => ell(c, x2, y2, w * 1.6, w * 0.5), col, 3);
};
// a steel tumbler standing on its base centre (x, y); rot tips it (round the base)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  if (!rot) shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => polyP(c, [[-w * 0.4, 0], [w * 0.4, 0], [w * 0.5, -h], [-w * 0.5, -h]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.35, 0);
  shape(c, () => ell(c, 0, -h, w * 0.5, w * 0.1), COL.steelIn, 5);
  line(c, [[-w * 0.47, -h * 0.82], [w * 0.47, -h * 0.82]], 3, COL.steelDk);
  shine(c, [[-w * 0.3, -h * 0.7], [-w * 0.26, -h * 0.25]], 6);
  c.restore();
};
// a patch of cooked dal dried on a plate (cracked) or soft again under water
const dalPatch = (c: Ctx, x: number, y: number, rx: number, ry: number, dried: boolean, seed: number) => {
  const rd = rnd(seed), pts: number[][] = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, k = 0.85 + rd() * 0.3; pts.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
  shape(c, () => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i <= pts.length; i++) { const a = pts[i % pts.length], b = pts[(i + 1) % pts.length]; c.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } c.closePath(); }, dried ? P.dal : "#f3cf6e", 4);
  if (dried) { line(c, [[x - rx * 0.5, y - ry * 0.2], [x - rx * 0.1, y + ry * 0.1], [x + rx * 0.2, y - ry * 0.3]], 3, P.dalDk); line(c, [[x - rx * 0.1, y + ry * 0.1], [x + rx * 0.1, y + ry * 0.55]], 3, P.dalDk); line(c, [[x + rx * 0.45, y + ry * 0.2], [x + rx * 0.2, y + ry * 0.4]], 3, P.dalDk); }
};
// a pool of water lying on a plate
const pool = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.globalAlpha = 0.45; shape(c, () => ell(c, x, y, rx, ry), COL.water, 0); c.globalAlpha = 1; shape(c, () => ell(c, x, y, rx, ry), "rgba(0,0,0,0)", 4); shine(c, [[x - rx * 0.5, y - ry * 0.3], [x - rx * 0.1, y - ry * 0.45]], 6); };
// a bunched kitchen cloth, centre (x, y)
const cloth = (c: Ctx, x: number, y: number, s: number, dirty = false) => {
  shape(c, () => ell(c, x - 30 * s, y + 10 * s, 50 * s, 34 * s, 0.4), COL.cloth, 5);
  shape(c, () => ell(c, x + 28 * s, y + 6 * s, 48 * s, 32 * s, -0.5), COL.cloth, 5);
  shape(c, () => ell(c, x, y - 12 * s, 46 * s, 30 * s, 0.2), COL.cloth, 5);
  if (dirty) shape(c, () => ell(c, x + 10 * s, y + 10 * s, 20 * s, 12 * s, 0.3), P.dal, 3);
};

// ---------------------------------------------------------------- bigger things: a tap, a fan, birds, a sun
// a kitchen tap on a wall pipe; the spout opens at (x, y) (water falls from there)
const tap = (c: Ctx, x: number, y: number) => {
  line(c, [[x + 70, 0], [x + 70, y - 70]], 46, INK); line(c, [[x + 70, 0], [x + 70, y - 70]], 34, COL.steel);
  const body = () => rrect(c, x - 40, y - 120, 150, 70, 30);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 40, 0);
  shape(c, () => { c.moveTo(x - 30, y - 100); c.quadraticCurveTo(x - 40, y - 40, x, y - 30); c.lineTo(x + 20, y - 30); c.lineTo(x + 20, y); c.lineTo(x - 20, y); c.lineTo(x - 20, y - 30); c.lineTo(x - 10, y - 30); c.quadraticCurveTo(x - 20, y - 50, x - 10, y - 90); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, x + 70, y - 140, 40, 14), RED, 5); line(c, [[x + 70, y - 136], [x + 70, y - 120]], 10, INK);
  shine(c, [[x - 20, y - 110], [x + 40, y - 110]], 6);
};
// a ceiling fan hanging from the top edge, hub at (x, y)
const fan = (c: Ctx, x: number, y: number) => {
  line(c, [[x, 0], [x, y - 40]], 22, INK); line(c, [[x, 0], [x, y - 40]], 12, COL.steelDk);
  for (const an of [Math.PI * 0.93, Math.PI * 0.07, Math.PI * 0.5]) {
    c.save(); c.translate(x, y); c.rotate(an);
    const bl = () => rrect(c, 40, -30, an === Math.PI * 0.5 ? 150 : 300, 60, 28);
    shape(c, bl, COL.wood); shade(c, bl, COL.woodDk, 0, -18);
    c.restore();
  }
  shape(c, () => ell(c, x, y, 52, 52), COL.steel); shade(c, () => ell(c, x, y, 52, 52), COL.steelDk, 24, 0);
  for (const r of [370, 410]) { c.beginPath(); c.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.35); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); c.beginPath(); c.arc(x, y, r, Math.PI * 1.65, Math.PI * 1.9); c.stroke(); }
};
// wavy air lines going down from (x, y)
const air = (c: Ctx, x: number, y: number, len: number) => line(c, [[x, y], [x + 14, y + len * 0.25], [x - 14, y + len * 0.5], [x + 14, y + len * 0.75], [x, y + len]], 5, COL.greyDk);
// a house crow standing with feet at (x, y), beak dipping down-left to (bx, by)
const crow = (c: Ctx, x: number, y: number, s: number, bx: number, by: number) => {
  for (const d of [-14, 14]) line(c, [[x + d * s, y - 50 * s], [x + d * s, y]], 7 * s, INK);
  shape(c, () => polyP(c, [[x + 50 * s, y - 70 * s], [x + 130 * s, y - 95 * s], [x + 125 * s, y - 60 * s]]), P.crow, 5);
  shape(c, () => ell(c, x, y - 75 * s, 85 * s, 45 * s, -0.15), P.crow, 5);
  shape(c, () => ell(c, x + 10 * s, y - 80 * s, 55 * s, 26 * s, -0.2), "#4d4858", 4);
  const hx = bx + 50 * s, hy = by - 40 * s;
  shape(c, () => polyP(c, [[x - 60 * s, y - 95 * s], [x - 40 * s, y - 55 * s], [hx + 22 * s, hy + 20 * s], [hx + 10 * s, hy - 28 * s]]), P.crowNeck, 5);
  shape(c, () => ell(c, hx, hy, 34 * s, 30 * s), P.crow, 5);
  shape(c, () => polyP(c, [[hx - 10 * s, hy - 10 * s], [bx, by], [hx - 2 * s, hy + 22 * s]]), INK, 4);
  shape(c, () => ell(c, hx - 2 * s, hy - 8 * s, 8 * s, 8 * s), WHITE, 2.5); shape(c, () => ell(c, hx - 4 * s, hy - 8 * s, 4 * s, 4 * s), INK, 0);
};
// a common myna standing with feet at (x, y), facing left
const myna = (c: Ctx, x: number, y: number, s: number) => {
  for (const d of [-12, 12]) line(c, [[x + d * s, y - 45 * s], [x + d * s, y]], 6 * s, COL.yellow);
  shape(c, () => polyP(c, [[x + 50 * s, y - 60 * s], [x + 115 * s, y - 70 * s], [x + 110 * s, y - 45 * s]]), P.mynaDk, 5);
  shape(c, () => ell(c, x, y - 68 * s, 72 * s, 40 * s, -0.1), P.myna, 5);
  shape(c, () => ell(c, x + 10 * s, y - 72 * s, 42 * s, 20 * s, -0.15), P.mynaDk, 4);
  shape(c, () => ell(c, x + 20 * s, y - 60 * s, 14 * s, 9 * s), WHITE, 3);
  shape(c, () => ell(c, x - 60 * s, y - 105 * s, 34 * s, 30 * s), P.crow, 5);
  shape(c, () => polyP(c, [[x - 88 * s, y - 110 * s], [x - 125 * s, y - 100 * s], [x - 88 * s, y - 92 * s]]), COL.yellow, 4);
  shape(c, () => ell(c, x - 72 * s, y - 108 * s, 9 * s, 9 * s), COL.yellow, 2.5); shape(c, () => ell(c, x - 74 * s, y - 108 * s, 4 * s, 4 * s), INK, 0);
};
// a pigeon standing with feet at (x, y), facing right
const pigeon = (c: Ctx, x: number, y: number, s: number) => {
  for (const d of [-12, 12]) line(c, [[x + d * s, y - 40 * s], [x + d * s, y]], 6 * s, RED);
  shape(c, () => polyP(c, [[x - 50 * s, y - 55 * s], [x - 115 * s, y - 50 * s], [x - 105 * s, y - 30 * s]]), P.pigeonDk, 5);
  shape(c, () => ell(c, x, y - 60 * s, 70 * s, 40 * s, 0.1), P.pigeon, 5);
  shape(c, () => ell(c, x - 10 * s, y - 62 * s, 42 * s, 20 * s, 0.15), P.pigeonDk, 4);
  shape(c, () => ell(c, x + 62 * s, y - 95 * s, 30 * s, 27 * s), P.pigeon, 5);
  shape(c, () => ell(c, x + 52 * s, y - 70 * s, 26 * s, 14 * s), "#6fb08a", 0);
  shape(c, () => polyP(c, [[x + 86 * s, y - 100 * s], [x + 112 * s, y - 92 * s], [x + 86 * s, y - 84 * s]]), COL.greyDk, 4);
  shape(c, () => ell(c, x + 70 * s, y - 100 * s, 8 * s, 8 * s), WHITE, 2.5); shape(c, () => ell(c, x + 72 * s, y - 100 * s, 4 * s, 4 * s), INK, 0);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, 0, 0.45);
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => polyP(c, [[x - w * 0.1, y + h / 2 - 6], [tx, ty], [x + w * 0.15, y + h / 2 - 6]]), WHITE, 5);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 26), WHITE, 5);
};

// ================================================================ set-up cards
// e1.0 three katoris of dry poha in a row, a label in front of each: a drop, an oil bottle, a cross
const sE1a = (c: Ctx) => {
  ground(c);
  const kinds: ("water" | "oil" | "none")[] = ["water", "oil", "none"];
  [220, 540, 860].forEach((x, i) => { katori(c, x, 560, 135, "dry", 11 + i); tag(c, x, 820, kinds[i]); });
};
// e1.1 the child pours a spoon of water on the first katori, the grown-up pours oil on the second; the third stays dry
const sE1b = (c: Ctx) => {
  ground(c);
  const kid: Sh = { x: 110, y: 1000, h: 560 }, ad: Sh = { x: 960, y: 1000, h: 740, adult: true };
  const spoonHand: [number, number] = [300, 690], anS = foreAngle(kid, 1, spoonHand), spoonLen = 100;
  const bowlAt: [number, number] = [spoonHand[0] + Math.cos(anS) * spoonLen, spoonHand[1] + Math.sin(anS) * spoonLen];
  const tipDir = 2.43, tip: [number, number] = [615, 640], bh = 170, bottleHand: [number, number] = [tip[0] - Math.cos(tipDir) * bh * 0.6, tip[1] - Math.sin(tipDir) * bh * 0.6];
  const hk = person(c, kid.x, kid.y, kid.h, { reachR: spoonHand });
  const ha = person(c, ad.x, ad.y, ad.h, { adult: true, reachL: bottleHand });
  const kx = [Math.round(bowlAt[0]), tip[0], 835], ky = 835;
  const kinds: ("water" | "oil" | "none")[] = ["water", "oil", "none"];
  kx.forEach((x, i) => { katori(c, x, ky, 95, "dry", 21 + i); tag(c, x, 950, kinds[i], 0.72); });
  stream(c, bowlAt[0] + 8, bowlAt[1] + 14, kx[0], ky, 16, COL.water);
  stream(c, tip[0], tip[1], kx[1], ky, 16, P.oil);
  spoon(c, hk.handR[0] - Math.cos(anS) * 18, hk.handR[1] - Math.sin(anS) * 18, anS, spoonLen + 18);
  grip(c, kid, hk.handR, anS);
  bottleAt(c, tip[0], tip[1], tipDir, 72, bh);
  grip(c, ad, ha.handL, foreAngle(ad, -1, bottleHand));
};
// e1.2 a finger presses a soft flake flat on a plate; beside it a hard shiny flake has snapped in two
const halfFlake = (c: Ctx, cx: number, cy: number, rx: number, ry: number, side: number) => {
  const pts: number[][] = [];
  for (let a = 95; a <= 265; a += 10) { const r = (a * Math.PI) / 180; pts.push([cx + side * Math.cos(r) * rx, cy + Math.sin(r) * ry]); }
  pts.push([cx + side * 6, cy + ry * 0.55], [cx - side * 6, cy + ry * 0.2], [cx + side * 8, cy - ry * 0.15], [cx - side * 4, cy - ry * 0.5]);
  const path = () => polyP(c, pts);
  shape(c, path, P.oilF, 5); shade(c, path, P.oilFDk, rx * 0.3, ry * 0.3, 0.5);
  shine(c, [[cx - side * rx * 0.75, cy - ry * 0.35], [cx - side * rx * 0.4, cy - ry * 0.6]], 7);
};
const sE1c = (c: Ctx) => {
  ground(c);
  plate(c, 540, 640, 450, 260);
  const soft = () => ell(c, 420, 640, 135, 70, 0.05);
  shape(c, soft, P.wet, 6); shade(c, soft, P.wetDk, 40, 20, 0.5);
  line(c, [[340, 650], [380, 665], [430, 660]], 4, P.wetDk); line(c, [[450, 625], [500, 640]], 4, P.wetDk);
  halfFlake(c, 730, 640, 90, 54, 1); halfFlake(c, 845, 652, 90, 54, -1);
  hand(c, 286, 420, 0.9, 2.2, SKIN.child, CLOTH.child, true);
};
// e2.0 two plates with a smear of dal drying under a ceiling fan
const sE2a = (c: Ctx) => {
  ground(c);
  fan(c, 540, 170);
  [330, 540, 750].forEach((x) => air(c, x, 330, 150));
  plate(c, 300, 720, 235, 118); dalPatch(c, 300, 712, 95, 48, true, 31);
  plate(c, 780, 720, 235, 118); dalPatch(c, 780, 712, 95, 48, true, 32);
};
// e2.1 one plate is wiped dry with a cloth (the dal stays stuck); the other sits with water on its dal
const sE2b = (c: Ctx) => {
  ground(c);
  plate(c, 300, 660, 235, 118); dalPatch(c, 250, 665, 85, 45, true, 33);
  plate(c, 780, 660, 235, 118); dalPatch(c, 780, 652, 95, 48, true, 34); pool(c, 780, 655, 130, 60);
  cloth(c, 380, 665, 0.9);
  hand(c, 322, 500, 1.22, 1.5, SKIN.child, CLOTH.child);
  arrow(c, [[285, 596], [165, 596]], RED, 8);
};
// e2.2 the child wipes the soaked plate clean, counting the wipes
const sE2c = (c: Ctx) => {
  ground(c);
  const kid: Sh = { x: 480, y: 780, h: 620, sit: true };
  const hr: [number, number] = [665, 740], hl: [number, number] = [445, 775];
  const hd = person(c, kid.x, kid.y, kid.h, { sit: true, reachR: hr, reachL: hl });
  plate(c, 600, 790, 215, 95); pool(c, 600, 785, 120, 50); dalPatch(c, 540, 790, 28, 16, false, 35);
  cloth(c, 700, 790, 0.75, true);
  grip(c, kid, hd.handR, foreAngle(kid, 1, hr));
  grip(c, kid, hd.handL, foreAngle(kid, -1, hl), true);
  arrow(c, [[780, 740], [850, 760]], RED, 8);
  bubble(c, 800, 330, 260, 130, 600, 470);
  write(c, "1 2 3", 700, 295, 70, INK, 8);
};

// ================================================================ card pictures
// flow.e1 the poha test after ten minutes: soft in water, shiny and hard in oil, dry
const fE1 = (c: Ctx) => {
  ground(c);
  const kinds: ("water" | "oil" | "none")[] = ["water", "oil", "none"], kk: ("water" | "oil" | "dry")[] = ["water", "oil", "dry"];
  [220, 540, 860].forEach((x, i) => { katori(c, x, 560, 135, kk[i], 41 + i); tag(c, x, 820, kinds[i]); });
};
// flow.e2 the sticky plate: wiped dry, the dal stays; soaked first, the plate comes clean
const fE2 = (c: Ctx) => {
  ground(c);
  tag(c, 300, 280, "none"); tag(c, 780, 280, "water");
  plate(c, 300, 660, 235, 118); dalPatch(c, 300, 652, 95, 48, true, 51);
  cloth(c, 300, 870, 0.8);
  plate(c, 780, 660, 235, 118); pool(c, 780, 655, 150, 66);
  cloth(c, 780, 870, 0.8, true);
};
// flow.a1 the water hunt: the child points at the kitchen tap, the grown-up listens
const fA1 = (c: Ctx) => {
  ground(c);
  const kid: Sh = { x: 330, y: 1000, h: 600 }, ad: Sh = { x: 120, y: 1000, h: 760, adult: true };
  const tapAt: [number, number] = [720, 450], [sx, sy] = shoulderOf(kid, 1), dx = tapAt[0] - sx, dy = tapAt[1] - sy, dd = Math.hypot(dx, dy), k = 0.32 * kid.h;
  tap(c, tapAt[0], tapAt[1]);
  // the sink below the tap
  shadow(c, 760, 760, 220, 40);
  shape(c, () => { c.moveTo(520, 640); c.lineTo(960, 640); c.lineTo(930, 760); c.lineTo(550, 760); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 740, 640, 220, 40), COL.steelIn, 5);
  stream(c, tapAt[0], tapAt[1], 720, 640, 18, COL.water);
  person(c, ad.x, ad.y, ad.h, { adult: true });
  person(c, kid.x, kid.y, kid.h, { reachR: [sx + (dx / dd) * k, sy + (dy / dd) * k] });
};
// flow.a2 acting out how animals drink: the child sucks water through a straw, like a pigeon
const fA2 = (c: Ctx) => {
  ground(c);
  const kid: Sh = { x: 420, y: 1000, h: 620 };
  const bowlAt: [number, number] = [630, 690], mouth: [number, number] = [432, 526], hr: [number, number] = [575, 680];
  // the stool
  shadow(c, 640, 1004, 130, 14);
  for (const lx of [550, 710]) { line(c, [[lx, 700], [lx, 1000]], 26, INK); line(c, [[lx, 700], [lx, 1000]], 16, COL.wood); }
  shape(c, () => rrect(c, 510, 690, 240, 34, 8), COL.wood); shade(c, () => rrect(c, 510, 690, 240, 34, 8), COL.woodDk, 0, -16);
  pigeon(c, 170, 1000, 1.1);
  const hd = person(c, kid.x, kid.y, kid.h, { reachR: hr });
  bowl(c, bowlAt[0], bowlAt[1], 95, COL.water);
  line(c, [[bowlAt[0] - 20, bowlAt[1] + 8], mouth], 16, INK); line(c, [[bowlAt[0] - 20, bowlAt[1] + 8], mouth], 9, P.straw);
  grip(c, kid, hd.handR, foreAngle(kid, 1, hr));
};
// flow.a3 the water tally: a sheet on the fridge, a crayon on a string, one line for each tumbler
const fA3 = (c: Ctx) => {
  ground(c);
  const door = () => rrect(c, 200, 60, 560, 1040, 24);
  shape(c, door, P.fridge); shade(c, door, P.fridgeDk, 60, 0, 0.5);
  line(c, [[720, 160], [720, 420]], 22, INK); line(c, [[720, 160], [720, 420]], 12, COL.steel);
  shadow(c, 495, 790, 160, 12);
  shape(c, () => rrect(c, 330, 300, 310, 470, 6), COL.paper, 5);
  for (const [tx, ty] of [[345, 300], [625, 300]]) shape(c, () => rrect(c, tx - 30, ty - 12, 60, 24, 4), "rgba(255,211,77,0.85)", 3);
  tumbler(c, 485, 420, 60, 80);
  for (let i = 0; i < 4; i++) line(c, [[395 + i * 52, 490], [395 + i * 52, 570]], 9, RED);
  line(c, [[603, 490], [603, 535]], 9, RED);
  // the crayon's tip is on the half-drawn line; the crayon lies along the forearm, so the wrist is worked back from the tip
  const kid: Sh = { x: 800, y: 1000, h: 560 }, tip: [number, number] = [603, 535], cl = 105, hr: [number, number] = [850, 800];
  let hl: [number, number] = [660, 600], anL = 0;
  for (let i = 0; i < 4; i++) { anL = foreAngle(kid, -1, hl); hl = [tip[0] - Math.cos(anL) * cl * 0.8, tip[1] - Math.sin(anL) * cl * 0.8]; }
  const hd = person(c, kid.x, kid.y, kid.h, { reachL: hl, reachR: hr });
  const back: [number, number] = [tip[0] - Math.cos(anL) * cl, tip[1] - Math.sin(anL) * cl];
  // the string from the sheet's corner to the crayon's end
  line(c, [[640, 320], [720, 440], back], 4, COL.greyDk);
  c.save(); c.translate(tip[0], tip[1]); c.rotate(anL);
  shape(c, () => polyP(c, [[0, 0], [-18, -12], [-cl, -12], [-cl, 12], [-18, 12]]), RED, 5);
  c.restore();
  grip(c, kid, hd.handL, anL);
  const anR = foreAngle(kid, 1, hr);
  tumbler(c, hd.handR[0] + Math.cos(anR) * 30 + 6, hd.handR[1] + Math.sin(anR) * 30 + 50, 76, 100);
  grip(c, kid, hd.handR, anR);
};
// flow.p1 a crow dips its beak in the clay saucer on the ledge; a myna waits its turn
const fP1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 760);
  const ledge = () => polyP(c, [[0, 760], [D, 760], [D, 1080], [0, 1080]]);
  shape(c, ledge, P.stone, 0); line(c, [[0, 760], [D, 760]], 6); c.fillStyle = P.stoneDk; c.fillRect(0, 850, D, 30);
  shadow(c, 470, 775, 240, 30);
  const saucer = () => { c.moveTo(210, 690); c.lineTo(250, 772); c.lineTo(630, 772); c.lineTo(670, 690); c.closePath(); };
  shape(c, saucer, P.clay); shade(c, saucer, P.clayDk, 80, 0);
  shape(c, () => ell(c, 440, 690, 230, 58), P.clayDk, 5);
  shape(c, () => ell(c, 440, 693, 205, 46), COL.water, 4); shine(c, [[300, 684], [370, 676]], 8);
  crow(c, 800, 760, 1.5, 500, 686);
  myna(c, 160, 760, 1.3);
};
// term.1 liquid: water, milk and oil poured from three jugs into three glasses
const jug = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, band: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => polyP(c, [[-w * 0.4, 0], [w * 0.4, 0], [w * 0.5, -h], [-w * 0.5, -h]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.35, 0);
  shape(c, () => polyP(c, [[-w * 0.46, -h * 0.55], [w * 0.46, -h * 0.55], [w * 0.44, -h * 0.4], [-w * 0.44, -h * 0.4]]), band, 3);
  shape(c, () => { c.moveTo(-w * 0.5, -h + 4); c.lineTo(-w * 0.74, -h - 16); c.lineTo(-w * 0.26, -h - 6); c.closePath(); }, COL.steel, 5);
  shape(c, () => ell(c, 0, -h, w * 0.5, w * 0.1), COL.steelIn, 5);
  line(c, [[w * 0.45, -h * 0.82], [w * 0.85, -h * 0.6], [w * 0.42, -h * 0.25]], 22, INK); line(c, [[w * 0.45, -h * 0.82], [w * 0.85, -h * 0.6], [w * 0.42, -h * 0.25]], 10, COL.steel);
  c.restore();
  const lx = -w * 0.74, ly = -h - 16, hx = w * 0.85, hy = -h * 0.6;
  return { tip: [x + Math.cos(rot) * lx - Math.sin(rot) * ly, y + Math.sin(rot) * lx + Math.cos(rot) * ly] as [number, number], handle: [x + Math.cos(rot) * hx - Math.sin(rot) * hy, y + Math.sin(rot) * hx + Math.cos(rot) * hy] as [number, number] };
};
const tLiquid = (c: Ctx) => {
  ground(c);
  const rot = -0.65, w = 84, h = 124, cols = [COL.water, P.milk, P.oil];
  [135, 485, 835].forEach((gx, i) => {
    const bx = gx + 126, by = 560;
    const lx = -w * 0.74, ly = -h - 16, tip: [number, number] = [bx + Math.cos(rot) * lx - Math.sin(rot) * ly, by + Math.sin(rot) * lx + Math.cos(rot) * ly];
    glass(c, tip[0], 900, 100, 230, 0.45, cols[i]);
    stream(c, tip[0], tip[1], tip[0], 900 - 230 * 0.45, 14, cols[i]);
    const j = jug(c, bx, by, w, h, rot, cols[i]);
    hand(c, j.handle[0] + 50, j.handle[1] + 4, Math.PI, 0.7, SKIN.adult, CLOTH.adult);
  });
};
// term.2 soak: a spoon of dry urad dal and a spoon of dal soaked overnight, fat with water
const tSoak = (c: Ctx) => {
  ground(c);
  for (const [x, wet, sd] of [[300, false, 61], [780, true, 62]] as [number, boolean, number][]) {
    shadow(c, x + 20, 460, 150, 190);
    line(c, [[x, 600], [x, 980]], 40, INK); line(c, [[x, 600], [x, 980]], 28, COL.steel);
    shape(c, () => ell(c, x, 430, 150, 190), COL.steel); shape(c, () => ell(c, x, 425, 122, 160), COL.steelIn, 4);
    if (wet) { c.globalAlpha = 0.45; shape(c, () => ell(c, x, 430, 118, 155), COL.water, 0); c.globalAlpha = 1; }
    const rd = rnd(sd), n = wet ? 13 : 22, r = wet ? 30 : 17;
    for (let i = 0; i < n; i++) { const u = rd() * Math.PI * 2, v = Math.sqrt(rd()) * 0.75, gx = x + Math.cos(u) * v * 118, gy = 425 + Math.sin(u) * v * 150, rt = rd() * 3; const g = () => ell(c, gx, gy, r, r * 0.72, rt); shape(c, g, wet ? P.uradWet : P.urad, 4); shine(c, [[gx - Math.cos(rt) * r * 0.4, gy - Math.sin(rt) * r * 0.4 - r * 0.2], [gx + Math.cos(rt) * r * 0.1, gy + Math.sin(rt) * r * 0.1 - r * 0.25]], Math.max(3, r * 0.18)); }
    if (wet) for (const [dx, dy] of [[-60, 640], [40, 660], [110, 600]]) drop(c, x + dx, dy, 12);
  }
};
// term.3 thirsty: a hot child, sweating, drinks from a steel tumbler
const tThirsty = (c: Ctx) => {
  ground(c);
  sun(c, 900, 170, 85);
  const kid: Sh = { x: 500, y: 1000, h: 620 }, mouth: [number, number] = [512, 526];
  const rot = 0.8, tLen = 125, hr: [number, number] = [mouth[0] + Math.sin(rot) * tLen * 0.5 + 8, mouth[1] + Math.cos(rot) * tLen * 0.5 + 8];
  const hd = person(c, kid.x, kid.y, kid.h, { reachR: hr });
  for (const [dx, dy, s] of [[-125, 400, 11], [-150, 470, 9], [130, 420, 11], [150, 490, 9]]) drop(c, kid.x + dx, dy, s);
  tumbler(c, mouth[0] + Math.sin(rot) * tLen, mouth[1] + Math.cos(rot) * tLen, 84, tLen, -rot);
  grip(c, kid, hd.handR, foreAngle(kid, 1, hr));
};
// expl.1 water goes inside a poha flake; oil only sits round the outside
const eInside = (c: Ctx) => {
  ground(c);
  const panel = (x: number, col: string) => { shape(c, () => rrect(c, x, 150, 460, 790, 30), col, 6); };
  panel(60, COL.water); panel(560, P.oil);
  drop(c, 290, 240, 34, COL.blueDk); bottleUp(c, 790, 285, 40, 90, true);
  flake(c, 290, 580, 135, 0.1, "wet");
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3, r1 = 240, r2 = 150; arrow(c, [[290 + Math.cos(a) * r1, 580 + Math.sin(a) * r1 * 0.8], [290 + Math.cos(a) * r2, 580 + Math.sin(a) * r2 * 0.8]], COL.blueDk, 9); }
  const ring = () => ell(c, 790, 580, 165, 110, 0.1);
  shape(c, ring, P.oilDk, 6); shape(c, () => ell(c, 790, 580, 140, 90, 0.1), P.oil, 4);
  flake(c, 790, 580, 125, 0.1, "dry");
};

export const ic_waterWaterSourcesAndUsesL1 = cards("sci.water.water-sources-and-uses.L1", [
  sE1a, sE1b, sE1c, sE2a, sE2b, sE2c,
  fE1, fE2, fA1, fA2, fA3, fP1, tLiquid, tSoak, tThirsty, eInside,
]);
