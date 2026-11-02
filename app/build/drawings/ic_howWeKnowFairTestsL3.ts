import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, glass, hand, person, write, cards } from "./flatKit";

// FAIR TESTS · sci.how-we-know.fair-tests.L3 player-card pictures, flat DeepKids kit.



const FLESH = "#fbf1cf", BROWN = "#a8743a", LEMON = "#f6d53d", LEMON_PALE = "#f7e27a";
const PURPLE = "#6a3d8f", PURPLE_DK = "#4a2a68", BFLESH = "#eef0c4", BBROWN = "#8a5a2e";
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const p = hx(a), q = hx(b); return "#" + p.map((v, i) => Math.round(v + (q[i] - v) * t).toString(16).padStart(2, "0")).join(""); };

// ---------------------------------------------------------------- shared pieces
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - 1.3 * s); c.bezierCurveTo(x + 0.15 * s, y - 0.7 * s, x + s, y - 0.2 * s, x + s, y + 0.4 * s); c.bezierCurveTo(x + s, y + 1.0 * s, x - s, y + 1.0 * s, x - s, y + 0.4 * s); c.bezierCurveTo(x - s, y - 0.2 * s, x - 0.15 * s, y - 0.7 * s, x, y - 1.3 * s); c.closePath(); }, col, Math.max(3, s * 0.12));
  line(c, [[x - s * 0.5, y + 0.2 * s], [x - s * 0.4, y + 0.6 * s]], Math.max(3, s * 0.12), WHITE);
};
const lemonSlice = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), LEMON, Math.max(3, r * 0.08));
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), LEMON_PALE, 0);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 0.12, y + Math.sin(a) * r * 0.12], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], Math.max(2, r * 0.06), "#fff6bd"); }
};
const saltBits = (c: Ctx, x: number, y: number, s: number, n = 3) => {
  const P = [[0, 0.2], [1.1, -0.5], [0.5, -1.2], [-0.6, -0.9]];
  for (let i = 0; i < n; i++) { const px = x + P[i][0] * s, py = y + P[i][1] * s; shape(c, () => polyP(c, [[px - s * 0.4, py - s * 0.4], [px + s * 0.4, py - s * 0.4], [px + s * 0.4, py + s * 0.4], [px - s * 0.4, py + s * 0.4]]), WHITE, Math.max(2.5, s * 0.1)); }
};
// a little paper tag with a picture of what is in the bowl: 0 nothing (no water), 1 water, 2 salt water, 3 lemon juice
const tagIcon = (c: Ctx, x: number, y: number, kind: number) => {
  shape(c, () => rrect(c, x - 85, y - 60, 170, 120, 16), WHITE, 5);
  if (kind === 0) { drop(c, x, y + 8, 26, COL.waterDk); line(c, [[x - 44, y + 44], [x + 44, y - 38]], 9, RED); }
  if (kind === 1) drop(c, x, y + 6, 34);
  if (kind === 2) { drop(c, x - 24, y + 6, 30); saltBits(c, x + 34, y + 24, 16); }
  if (kind === 3) lemonSlice(c, x, y, 42);
};
// an apple slice (half moon), flat edge on the baseline at (x, y); browning 0..1
const appleSlice = (c: Ctx, x: number, y: number, r: number, rot = 0, b = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => { c.moveTo(-r, 0); c.arc(0, 0, r, Math.PI, Math.PI * 2); c.closePath(); };
  const fl = mix(FLESH, BROWN, b);
  shape(c, body, fl, 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.beginPath(); c.arc(0, 0, r - r * 0.04, Math.PI, Math.PI * 2); c.strokeStyle = COL.red; c.lineWidth = r * 0.2; c.stroke();
  c.beginPath(); c.arc(0, 0, r * 0.88, Math.PI, Math.PI * 2); c.strokeStyle = mix(FLESH, BROWN, Math.min(1, b + 0.25) * 0.9); c.lineWidth = b > 0 ? r * 0.12 : 0; c.stroke();
  c.restore();
  shade(c, body, mix(fl, "#7a5a30", 0.6), -r * 0.16, -r * 0.1, 0.3);
  shape(c, () => ell(c, 0, -r * 0.3, r * 0.07, r * 0.13), "#5a3a22", 0);
  shape(c, body, "rgba(0,0,0,0)", Math.max(4, r * 0.06));
  c.restore();
};
const appleWhole = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.95, r * 0.9, r * 0.17);
  const body = () => { c.moveTo(x, y - r * 0.72); c.bezierCurveTo(x + r * 0.5, y - r * 1.02, x + r * 1.1, y - r * 0.5, x + r * 0.95, y + r * 0.15); c.bezierCurveTo(x + r * 0.85, y + r * 0.75, x + r * 0.4, y + r * 1.0, x, y + r * 0.88); c.bezierCurveTo(x - r * 0.4, y + r * 1.0, x - r * 0.85, y + r * 0.75, x - r * 0.95, y + r * 0.15); c.bezierCurveTo(x - r * 1.1, y - r * 0.5, x - r * 0.5, y - r * 1.02, x, y - r * 0.72); c.closePath(); };
  shape(c, body, COL.red, 6);
  shade(c, body, "#a82f22", -r * 0.22, -r * 0.12, 0.55);
  shape(c, body, "rgba(0,0,0,0)", 6);
  line(c, [[x, y - r * 0.7], [x + r * 0.08, y - r * 1.05]], 9, INK); line(c, [[x, y - r * 0.7], [x + r * 0.08, y - r * 1.05]], 4, COL.brown);
  shape(c, () => { c.moveTo(x + r * 0.1, y - r * 0.92); c.quadraticCurveTo(x + r * 0.4, y - r * 1.2, x + r * 0.7, y - r * 1.0); c.quadraticCurveTo(x + r * 0.45, y - r * 0.8, x + r * 0.1, y - r * 0.92); c.closePath(); }, COL.leaf, 5);
  shine(c, [[x - r * 0.62, y - r * 0.25], [x - r * 0.5, y - r * 0.5]], 10);
};
// a knife, origin at the middle of the grip, blade pointing down
const knife = (c: Ctx, x: number, y: number, rot = 0, blade = 230) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => polyP(c, [[-15, 40], [17, 40], [17, blade - 50], [-6, blade], [-15, blade - 30]]), COL.steel, 6);
  shade(c, () => polyP(c, [[-15, 40], [17, 40], [17, blade - 50], [-6, blade], [-15, blade - 30]]), COL.steelDk, -9, 0, 0.7);
  shape(c, () => rrect(c, -17, -100, 34, 150, 12), "#7a4a2a", 6);
  line(c, [[0, -62], [0, -60]], 10, "#e8c88a"); line(c, [[0, 0], [0, 2]], 10, "#e8c88a");
  c.restore();
};
// a sleeve running from the edge of the card to a hand at (x, y) pointing an
const armTo = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -1700, -36, 1700 - 40, 72, 6), CLOTH.adult, 6);
  c.restore();
};
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { armTo(c, x, y, an, s); hand(c, x, y, an, s, SKIN.adult, CLOTH.adult, open); };
// the same hand coming in from the right (pointing left, thumb up)
const adultHandR = (c: Ctx, x: number, y: number, s: number, open = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); armTo(c, 0, 0, 0, s); hand(c, 0, 0, 0, s, SKIN.adult, CLOTH.adult, open); c.restore();
};
const board = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.52, y + h + 16, w * 0.52, 26);
  shape(c, () => rrect(c, x, y + 22, w, h, 40), COL.woodDk, 6);
  shape(c, () => rrect(c, x, y, w, h, 40), COL.wood, 6);
  shade(c, () => rrect(c, x, y, w, h, 40), COL.woodDk, -18, -14, 0.5);
  shape(c, () => rrect(c, x, y, w, h, 40), "rgba(0,0,0,0)", 6);
};
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.62, w * 0.1);
  c.beginPath(); c.ellipse(x, y - h * 0.98, w * 0.5, h * 0.5, 0, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 16; c.stroke();
  c.beginPath(); c.ellipse(x, y - h * 0.98, w * 0.5, h * 0.5, 0, Math.PI, Math.PI * 2); c.strokeStyle = COL.grey; c.lineWidth = 7; c.stroke();
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.36, y - 10); c.quadraticCurveTo(x, y + 14, x - w * 0.36, y - 10); c.closePath(); };
  shape(c, body, COL.blue, 6);
  shade(c, body, COL.blueDk, -w * 0.16, 0, 0.8);
  shape(c, () => polyP(c, [[x - w * 0.46, y - h * 0.6], [x + w * 0.46, y - h * 0.6], [x + w * 0.43, y - h * 0.44], [x - w * 0.43, y - h * 0.44]]), COL.yellow, 5);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), "#2b3f66", 6);
  shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.27, y - h * 0.68]], 8);
};
const brinjalSlice = (c: Ctx, x: number, y: number, rx: number, ry: number, flesh: string = BFLESH) => {
  const t = ry * 0.4;
  shape(c, () => ell(c, x, y + t, rx, ry), PURPLE_DK, 6);
  shape(c, () => polyP(c, [[x - rx, y], [x + rx, y], [x + rx, y + t], [x - rx, y + t]]), PURPLE_DK, 0);
  line(c, [[x - rx, y], [x - rx, y + t]], 6); line(c, [[x + rx, y], [x + rx, y + t]], 6);
  shape(c, () => ell(c, x, y + t, rx, ry), PURPLE_DK, 0);
  c.beginPath(); c.ellipse(x, y + t, rx, ry, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, x, y, rx, ry), PURPLE, 6);
  shape(c, () => ell(c, x, y, rx - 13, ry - 10), flesh, 0);
  for (let k = 0; k < 9; k++) { const a = k * 0.7, d = 0.45 + (k % 3) * 0.12; shape(c, () => ell(c, x + Math.cos(a) * (rx - 13) * d * 0.9, y + Math.sin(a) * (ry - 10) * d, rx * 0.05, ry * 0.07), mix(flesh, "#6a4a20", 0.5), 0); }
};
const surface = (c: Ctx, y: number, col: string) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- shared pieces for these cards
const GREEN_OK = "#3a9a4a";
const room = (c: Ctx, base: number) => {
  ground(c, "#f6efe0");
  shape(c, () => polyP(c, [[0, base - 40], [D, base - 40], [D, base], [0, base]]), COL.cloth, 0);
  c.fillStyle = "#e2c598"; c.fillRect(0, base, D, D - base);
  line(c, [[0, base - 40], [D, base - 40]], 5); line(c, [[0, base], [D, base]], 6);
  for (let i = 0; i <= 12; i++) line(c, [[540 + (i - 6) * 70, base], [540 + (i - 6) * 190, D]], 3, "#cfae7c");
  for (const f of [0.25, 0.55]) { const y = base + (D - base) * f; line(c, [[0, y], [D, y]], 3, "#cfae7c"); }
};
const ball = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  shape(c, () => ell(c, x, y, r, r), col, 6);
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.3, r * 0.2, 0.7);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
  shine(c, [[x - r * 0.55, y - r * 0.15], [x - r * 0.3, y - r * 0.55]], Math.max(5, r * 0.18));
};
const RB = (c: Ctx, x: number, y: number, r: number) => ball(c, x, y, r, COL.red, "#a82f22");
const BB = (c: Ctx, x: number, y: number, r: number) => ball(c, x, y, r, COL.blue, COL.blueDk);
const paperBall = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), "#ece6d6", 5);
  line(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.1, y - r * 0.4], [x + r * 0.3, y - r * 0.1]], 3.5, COL.greyDk);
  line(c, [[x - r * 0.3, y + r * 0.3], [x + r * 0.1, y + r * 0.1], [x + r * 0.5, y + r * 0.4]], 3.5, COL.greyDk);
};
const tick = (c: Ctx, x: number, y: number, s: number) => {
  const p = [[x - s, y], [x - s * 0.3, y + s * 0.75], [x + s, y - s * 0.85]];
  line(c, p, s * 0.5, INK); line(c, p, s * 0.3, GREEN_OK);
};
const cross = (c: Ctx, x: number, y: number, s: number) => {
  for (const p of [[[x - s, y - s], [x + s, y + s]], [[x + s, y - s], [x - s, y + s]]]) line(c, p, s * 0.5, INK);
  for (const p of [[[x - s, y - s], [x + s, y + s]], [[x + s, y - s], [x - s, y + s]]]) line(c, p, s * 0.3, RED);
};
const qmark = (c: Ctx, x: number, y: number, r: number) => {
  c.beginPath(); c.arc(x, y, r, Math.PI * 1.05, Math.PI * 2.4); c.quadraticCurveTo(x + r * 0.3, y + r * 1.3, x, y + r * 1.6);
  c.strokeStyle = RED; c.lineWidth = r * 0.34; c.lineCap = "round"; c.stroke();
  shape(c, () => ell(c, x, y + r * 2.3, r * 0.2, r * 0.2), RED, 0);
};
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.paper) => shape(c, () => rrect(c, x, y, w, h, 36), col, 6);
const clock = (c: Ctx, x: number, y: number, r: number, hand1 = -1.2, hand2 = 0.4) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  line(c, [[x, y], [x + Math.cos(hand1) * r * 0.55, y + Math.sin(hand1) * r * 0.55]], r * 0.1);
  line(c, [[x, y], [x + Math.cos(hand2) * r * 0.75, y + Math.sin(hand2) * r * 0.75]], r * 0.07);
  shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), INK, 0);
};
const hold = (c: Ctx, x: number, y: number, h: number, side: 1 | -1, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const stoolTable = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, 40, y, 1000, 44, 14), COL.woodDk, 6);
  shape(c, () => rrect(c, 40, y - 12, 1000, 36, 14), COL.wood, 6);
};
// a results grid: rows x cols cells, drawn with ink lines, in a paper panel
const grid = (c: Ctx, x: number, y: number, cw: number[], rh: number[], fills: (string | null)[][] = []) => {
  const W = cw.reduce((a, b) => a + b, 0), H = rh.reduce((a, b) => a + b, 0);
  shape(c, () => rrect(c, x, y, W, H, 8), "#fffdf6", 7);
  let yy = y;
  rh.forEach((h, r) => { let xx = x; cw.forEach((w, k) => { const f = fills[r]?.[k]; if (f) shape(c, () => rrect(c, xx + 5, yy + 5, w - 10, h - 10, 6), f, 0); xx += w; }); yy += h; });
  let a = y; rh.slice(0, -1).forEach((h) => { a += h; line(c, [[x, a], [x + W, a]], 6); });
  a = x; cw.slice(0, -1).forEach((w) => { a += w; line(c, [[a, y], [a, y + H]], 6); });
};
const small = (c: Ctx, x: number, y: number, s: number, f: () => void) => { c.save(); c.translate(x, y); c.scale(s, s); f(); c.restore(); };
const slices = (c: Ctx, xs: number[], y: number, r: number, bs: number[]) => xs.forEach((x, i) => appleSlice(c, x, y, r, 0, bs[i]));
const BR = (b: number) => mix(FLESH, BROWN, b);
const tape = (c: Ctx, x: number, y0: number, y1: number, w: number) => {
  shape(c, () => rrect(c, x, y0, w, y1 - y0, 6), LEMON, 6);
  for (let k = 0; k <= 4; k++) { const y = y1 - 30 - k * ((y1 - y0 - 60) / 4); line(c, [[x, y], [x + w * 0.55, y]], 5); write(c, String(k * 10), x + w * 0.58, y - 14, 26, INK, 5); }
};
const stripes = (c: Ctx, x: number, y: number, w: number, h: number) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) shape(c, () => polyP(c, [[x + i * w / 4, y + j * h / 2], [x + (i + 1) * w / 4, y + j * h / 2], [x + (i + 1) * w / 4, y + (j + 1) * h / 2], [x + i * w / 4, y + (j + 1) * h / 2]]), (i + j) % 2 ? INK : WHITE, 3); };

// ---------------------------------------------------------------- intro
const intro = (c: Ctx) => {
  room(c, 840);
  person(c, 340, 930, 660, { armR: [-1.2, -1.55], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const [gx, gy] = hold(c, 340, 930, 660, 1, [-1.2, -1.55]);
  RB(c, gx, gy - 55, 62);
  arrow(c, [[gx, gy - 8 + 0], [gx, gy + 70]].map(([a, b]) => [a + 105, b - 60]));
  person(c, 770, 930, 430, { armR: [1.15, 1.3], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const [bx, by] = hold(c, 770, 930, 430, 1, [1.15, 1.3]);
  BB(c, bx + 8, by + 34, 42);
  arrow(c, [[bx + 90, by + 20], [bx + 90, by + 100]]);
};

// ---------------------------------------------------------------- summary
const summary = (c: Ctx) => {
  ground(c);
  plate(c, 540, 290, 500, 215);
  slices(c, [195, 405, 615, 825], 330, 92, [1, 0.7, 0.4, 0]);
  panel(c, 150, 560, 780, 440);
  const fills = [[0.6, 1], [0.4, 0.8], [0.15, 0.45], [0, 0]].map(([a, b]) => ["#fffdf6", BR(a), BR(b)]);
  grid(c, 205, 605, [170, 260, 260], [96, 96, 96, 96], fills);
  [0, 1, 2, 3].forEach((i) => small(c, 290, 653 + i * 96, 0.5, () => tagIcon(c, 0, 0, i)));
};

// ---------------------------------------------------------------- flows
// flow.e2: ten throws, underarm low arc and overarm high arc to the same bucket
const flowE2 = (c: Ctx) => {
  room(c, 700);
  bucket(c, 850, 790, 250, 270);
  shape(c, () => polyP(c, [[60, 880], [330, 880], [370, 940], [30, 940]]), RED, 6);
  person(c, 200, 905, 520, { armR: [1.3, 0.3] });
  person(c, 500, 905, 520, { armR: [-1.1, -1.5] });
  arrow(c, Array.from({ length: 9 }, (_, k) => { const t = k / 8; return [300 + t * 420, 700 - Math.sin(t * Math.PI) * 90 + t * 40]; }));
  arrow(c, Array.from({ length: 9 }, (_, k) => { const t = k / 8; return [560 + t * 190, 360 - Math.sin(t * Math.PI) * 210 + t * 240]; }));
  paperBall(c, 305, 690, 24); paperBall(c, 580, 345, 24);
};
// flow.a2: family balance: a child on one foot, a phone timer, a results table
const onFoot = (c: Ctx, x: number, y: number, h: number, adult: boolean) => {
  const hip = y - h * 0.42, lw = h * 0.075;
  person(c, x, y, h, { adult, armL: [2.3, 2.5], armR: [0.65, 0.4] });
  line(c, [[x - h * 0.05, hip], [x - h * 0.06, y]], lw + 14, BG);
  line(c, [[x - h * 0.05, hip], [x - h * 0.2, hip + h * 0.12], [x - h * 0.2, hip + h * 0.3]], lw, INK);
  line(c, [[x - h * 0.05, hip], [x - h * 0.2, hip + h * 0.12], [x - h * 0.2, hip + h * 0.3]], lw - 10, "#6b5a8c");
  line(c, [[x + h * 0.05, hip], [x + h * 0.06, y]], lw, INK); line(c, [[x + h * 0.05, hip], [x + h * 0.06, y]], lw - 10, "#6b5a8c");
};
const phone = (c: Ctx, x: number, y: number, s: number, frac = 0.7) => {
  small(c, x, y, s, () => {
    shape(c, () => rrect(c, -150, -250, 300, 500, 44), COL.black, 7);
    shape(c, () => rrect(c, -128, -210, 256, 420, 22), "#e9f3ff", 4);
    c.beginPath(); c.arc(0, -20, 100, 0, Math.PI * 2); c.strokeStyle = "#cfe0f2"; c.lineWidth = 22; c.stroke();
    c.beginPath(); c.arc(0, -20, 100, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.strokeStyle = COL.teal; c.lineWidth = 22; c.lineCap = "round"; c.stroke();
    write(c, "30", -45, -45, 56, INK, 9);
  });
};
const flowA2 = (c: Ctx) => {
  ground(c);
  onFoot(c, 200, 960, 520, false); shadow(c, 205, 965, 90, 14);
  onFoot(c, 470, 960, 660, true); shadow(c, 475, 965, 100, 14);
  phone(c, 850, 330, 0.7);
  panel(c, 640, 640, 390, 340);
  grid(c, 680, 685, [150, 170], [80, 80, 80], []);
  ["12", "9", "15"].forEach((t, i) => { small(c, 765, 725 + i * 80, 0.5, () => { shape(c, () => ell(c, 0, 0, 40, 42), i === 1 ? SKIN.adult : SKIN.child, 6); shape(c, () => ell(c, 0, -22, 40, 24), CLOTH.hair, 4); }); write(c, t, 880 + (t.length === 1 ? 16 : 0), 698 + i * 80, 50, INK, 8); });
};
// flow.a3: three tumblers, one thing differs in each
const steam = (c: Ctx, x: number, y: number) => { for (const dx of [-30, 0, 30]) { c.beginPath(); c.moveTo(x + dx, y); c.bezierCurveTo(x + dx - 24, y - 30, x + dx + 24, y - 50, x + dx, y - 80); c.strokeStyle = "#b8b2c4"; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); } };
const spoon = (c: Ctx, x: number, y: number) => { line(c, [[x, y], [x + 55, y - 250]], 20, INK); line(c, [[x, y], [x + 55, y - 250]], 9, COL.steel); shape(c, () => ell(c, x - 6, y + 14, 22, 28, 0.2), COL.steel, 5); };
const sugarLumps = (c: Ctx, x: number, y: number, s: number, n = 3) => { for (let i = 0; i < n; i++) { const px = x + (i - 1) * s * 0.9, py = y - (i === 1 ? s * 0.8 : 0); shape(c, () => polyP(c, [[px - s * 0.42, py - s * 0.42], [px + s * 0.42, py - s * 0.42], [px + s * 0.42, py + s * 0.42], [px - s * 0.42, py + s * 0.42]]), WHITE, 4); } };
const flowA3 = (c: Ctx) => {
  room(c, 760);
  const X = [200, 540, 880];
  X.forEach((x, i) => { glass(c, x, 790, 200, 320, 0.78, i === 0 ? "#f6c98a" : COL.water); });
  steam(c, X[0], 400);
  spoon(c, X[1] - 30, 740);
  sugarLumps(c, X[0], 770, 34); sugarLumps(c, X[1] + 20, 770, 34); sugarLumps(c, X[2], 770, 34);
};
// flow.a4: Lind's six cures, six paper slips
const flowA4 = (c: Ctx) => {
  ground(c);
  const items: ((x: number, y: number) => void)[] = [
    (x, y) => { // cider
      shadow(c, x + 8, y + 90, 80, 14); shape(c, () => rrect(c, x - 62, y - 80, 124, 170, 20), "#c98a3c", 6); shape(c, () => rrect(c, x - 62, y - 80, 124, 36, 18), "#fff4cf", 6);
      c.beginPath(); c.arc(x + 70, y + 10, 36, -Math.PI / 2, Math.PI / 2); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = "#c98a3c"; c.lineWidth = 10; c.stroke(); },
    (x, y) => { // vinegar bottle
      shadow(c, x + 8, y + 90, 70, 12); shape(c, () => rrect(c, x - 28, y - 100, 56, 70, 10), COL.glass, 6);
      shape(c, () => rrect(c, x - 60, y - 40, 120, 130, 30), "#f0d78a", 6); shape(c, () => rrect(c, x - 18, y - 124, 36, 30, 6), "#c98a3c", 5); shine(c, [[x - 42, y - 10], [x - 42, y + 50]], 7); },
    (x, y) => { // sea water
      bowl(c, x, y - 20, 85, COL.water); for (const dx of [-45, 0, 45]) line(c, [[x + dx - 20, y - 20], [x + dx - 8, y - 32], [x + dx + 6, y - 20], [x + dx + 18, y - 30]], 5, COL.blueDk); },
    (x, y) => { // oranges and lemons
      shape(c, () => ell(c, x - 38, y + 10, 62, 62), COL.orange, 6); line(c, [[x - 66, y - 20], [x - 55, y - 34]], 7, WHITE);
      shape(c, () => ell(c, x + 42, y - 4, 56, 40, -0.4), LEMON, 6); shape(c, () => ell(c, x + 92, y - 32, 6, 6), "#c8a626", 0); },
    (x, y) => { // spicy paste
      bowl(c, x, y - 20, 85, "#d95b2b"); for (const [dx, dy] of [[-30, -4], [10, 4], [40, -6]]) shape(c, () => ell(c, x + dx, y - 22 + dy, 10, 5), "#8f2f12", 0); },
    (x, y) => { // dilute acid in a flask
      shadow(c, x + 8, y + 90, 80, 12); shape(c, () => polyP(c, [[x - 24, y - 100], [x + 24, y - 100], [x + 24, y - 30], [x + 80, y + 80], [x - 80, y + 80], [x - 24, y - 30]]), COL.glass, 6);
      shape(c, () => polyP(c, [[x - 46, y + 20], [x + 46, y + 20], [x + 76, y + 76], [x - 76, y + 76]]), COL.greenLt, 0); shape(c, () => polyP(c, [[x - 24, y - 100], [x + 24, y - 100], [x + 24, y - 30], [x + 80, y + 80], [x - 80, y + 80], [x - 24, y - 30]]), "rgba(0,0,0,0)", 6); },
  ];
  items.forEach((f, i) => { const x = 60 + (i % 2) * 480, y = 80 + Math.floor(i / 2) * 310; shape(c, () => rrect(c, x, y, 450, 280, 28), WHITE, 6); f(x + 225, y + 140);
    shape(c, () => ell(c, x + 50, y + 50, 26, 26), SKIN.child, 5); shape(c, () => ell(c, x + 50, y + 38, 26, 18), "#4b6aa8", 4); });
};
// flow.p1: a planning sheet with three boxes
const flowP1 = (c: Ctx) => {
  ground(c);
  panel(c, 90, 70, 900, 940);
  const boxes = [90, 380, 670].map((y) => shape(c, () => rrect(c, 150, y + 40, 780, 240, 24), "#fffdf6", 6));
  void boxes;
  // box 1: change one thing: two cups, a red change arrow
  [[330, 0], [560, 1]].forEach(([x, k]) => { glass(c, x, 260, 120, 140, 0.7, k ? "#f6e27a" : COL.water); });
  arrow(c, [[670, 160], [790, 160]]);
  // box 2: keep the rest the same: two equal rulers/cups with equal sign
  bowl(c, 330, 440, 70, COL.water); bowl(c, 560, 440, 70, COL.water); line(c, [[430, 440], [480, 440]], 12, RED);
  line(c, [[430, 490], [480, 490]], 12, RED);
  clock(c, 790, 470, 56); 
  // box 3: measure or watch
  small(c, 330, 760, 0.9, () => { shape(c, () => rrect(c, -140, -26, 280, 52, 8), COL.wood, 6); for (let i = 0; i <= 8; i++) line(c, [[-120 + i * 30, -26], [-120 + i * 30, i % 2 ? -4 : 8]], 4); });
  small(c, 650, 770, 1, () => { shape(c, () => ell(c, 0, 0, 62, 62), COL.glass, 8); line(c, [[44, 44], [110, 110]], 22, INK); line(c, [[44, 44], [110, 110]], 10, COL.brown); shine(c, [[-36, -12], [-12, -38]], 8); });
  appleSlice(c, 800, 800, 56, 0, 0.5);
};
// flow.c1: the same ramp for both cars
const car = (c: Ctx, x: number, y: number, col: string, dk: string) => {
  shape(c, () => rrect(c, x - 70, y - 54, 140, 42, 12), col, 6);
  shape(c, () => polyP(c, [[x - 34, y - 54], [x - 18, y - 92], [x + 30, y - 92], [x + 48, y - 54]]), col, 6);
  shape(c, () => polyP(c, [[x - 22, y - 58], [x - 10, y - 84], [x + 24, y - 84], [x + 36, y - 58]]), COL.sky, 4);
  for (const dx of [-38, 38]) { shape(c, () => ell(c, x + dx, y - 8, 22, 22), COL.black, 6); shape(c, () => ell(c, x + dx, y - 8, 8, 8), COL.steel, 0); }
  void dk;
};
const ramp = (c: Ctx, top: number, col: string, dk: string) => {
  const fl = top + 330;
  shape(c, () => polyP(c, [[60, fl], [980, fl], [980, fl + 24], [60, fl + 24]]), "#e2c598", 6);
  const bk = ["#e4523b", "#5b8fd6", "#6aa53f"];
  bk.forEach((b, i) => shape(c, () => rrect(c, 60, fl - 60 - i * 54, 120, 54, 6), b, 6));
  shape(c, () => polyP(c, [[60, fl - 170], [900, fl - 8], [900, fl - 26], [60, fl - 190]]), COL.wood, 6);
  const an = Math.atan2(162, 840);
  c.save(); c.translate(250, fl - 170 + (250 - 60) * (162 / 840) - 12); c.rotate(an); car(c, 0, 0, col, dk); c.restore();
  arrow(c, [[480, fl - 270], [680, fl - 230]]);
  c.save(); c.translate(940, fl - 70); stripes(c, -26, -20, 52, 32); line(c, [[0, 12], [0, 70]], 6); c.restore();
};
const flowC1 = (c: Ctx) => {
  room(c, 1040);
  ground(c);
  ramp(c, 20, COL.red, "#a82f22");
  ramp(c, 540, COL.blue, COL.blueDk);
};
// flow.c2: a blindfolded taster and two identical glasses
const flowC2 = (c: Ctx) => {
  room(c, 780);
  stoolTable(c, 800);
  person(c, 270, 960, 700, { adult: true, armR: [0.5, -0.2], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const h = 700, head = h * 0.13, hx0 = 270, hy = 960 - h * 0.74 - head * 1.05;
  shape(c, () => rrect(c, hx0 - head * 1.08, hy - head * 0.12, head * 2.16, head * 0.5, 8), "#e4523b", 5);
  glass(c, 620, 800, 190, 270, 0.7, COL.water); glass(c, 900, 800, 190, 270, 0.7, COL.water);
};

// ---------------------------------------------------------------- terms
const floorLine = (c: Ctx, y: number) => { c.fillStyle = "#e2c598"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); for (let i = 1; i < 7; i++) line(c, [[i * 180, y], [i * 180 + (i - 3) * 60, D]], 3, "#cfae7c"); };
const dashed = (c: Ctx, x0: number, x1: number, y: number, col = RED) => { for (let x = x0; x < x1; x += 40) line(c, [[x, y], [x + 22, y]], 7, col); };
const dropPair = (c: Ctx, yA: number, yB: number, x1: number, x2: number, floor: number, r = 50) => {
  RB(c, x1, yA, r); BB(c, x2, yB, r);
  arrow(c, [[x1, yA + r + 12], [x1, Math.min(floor - 40, yA + r + 120)]]); arrow(c, [[x2, yB + r + 12], [x2, Math.min(floor - 40, yB + r + 120)]]);
};
const term0 = (c: Ctx) => {
  ground(c); floorLine(c, 830);
  shape(c, () => rrect(c, 120, 395, 150, 30, 6), COL.wood, 5);
  dashed(c, 180, 900, 410);
  dropPair(c, 410, 410, 380, 700, 830, 62);
  tick(c, 540, 700, 62);
};
const term1 = (c: Ctx) => {
  ground(c);
  // three things that can change
  panel(c, 40, 120, 310, 820); panel(c, 385, 120, 310, 820); panel(c, 730, 120, 310, 820);
  // height
  RB(c, 195, 270, 46); BB(c, 195, 560, 46);
  line(c, [[300, 230], [300, 620]], 8, INK); arrow(c, [[300, 380], [300, 230]]); arrow(c, [[300, 470], [300, 620]]);
  // the ball
  RB(c, 540, 260, 56); BB(c, 540, 460, 36); ball(c, 540, 640, 76, COL.yellow, COL.orange);
  // the floor
  shape(c, () => rrect(c, 750, 190, 270, 250, 16), "#e2c598", 6); for (let i = 1; i < 3; i++) { line(c, [[750 + i * 90, 190], [750 + i * 90, 440]], 4, "#cfae7c"); line(c, [[750, 190 + i * 83], [1020, 190 + i * 83]], 4, "#cfae7c"); }
  shape(c, () => rrect(c, 750, 500, 270, 250, 16), COL.green, 6); for (let i = 0; i < 12; i++) line(c, [[770 + (i % 6) * 44, 520 + Math.floor(i / 6) * 100 + 80], [776 + (i % 6) * 44, 520 + Math.floor(i / 6) * 100 + 30]], 6, COL.greenDk);
  shape(c, () => rrect(c, 750, 790, 270, 120, 16), COL.soil, 6);
};
const term2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 400, 510, 250);
  slices(c, [195, 405, 615, 825], 440, 92, [0.6, 0.6, 0.6, 0.6]);
  [0, 1, 2, 3].forEach((i) => tagIcon(c, [195, 405, 615, 825][i], 820, i));
  shape(c, () => rrect(c, 70, 725, 940, 190, 34), "rgba(0,0,0,0)", 0);
  c.beginPath(); rrect(c, 70, 725, 940, 190, 34); c.strokeStyle = RED; c.lineWidth = 12; c.setLineDash([30, 20]); c.stroke(); c.setLineDash([]);
};
const term3 = (c: Ctx) => {
  ground(c);
  panel(c, 120, 90, 840, 900);
  [0, 1, 2].forEach((i) => {
    const y = 130 + i * 290;
    shape(c, () => rrect(c, 160, y, 760, 240, 26), "#fffdf6", 6);
    tick(c, 255, y + 120, 56);
    if (i === 0) { appleWhole(c, 520, y + 120, 82); appleWhole(c, 710, y + 120, 82); }
    if (i === 1) { plate(c, 520, y + 125, 120, 54); plate(c, 720, y + 125, 120, 54); }
    if (i === 2) { clock(c, 520, y + 120, 80, -1.4, 0.3); clock(c, 720, y + 120, 80, -1.4, 0.3); }
  });
};
const term4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 520, 500, 280);
  appleSlice(c, 400, 560, 150, 0, 0.9); appleSlice(c, 710, 560, 150, 0, 0.05);
  small(c, 0, 0, 1, () => { });
  lemonSlice(c, 880, 700, 62);
  // flag planted by the plain slice
  line(c, [[400, 410], [400, 150]], 12, INK); line(c, [[400, 410], [400, 150]], 5, COL.brown);
  shape(c, () => polyP(c, [[404, 150], [610, 215], [404, 280]]), COL.teal, 6);
  shape(c, () => ell(c, 470, 215, 14, 14), WHITE, 0);
  tagIcon(c, 400, 860, 0); tagIcon(c, 710, 860, 3);
};
const term5 = (c: Ctx) => {
  room(c, 840);
  person(c, 330, 960, 700, { armR: [0.9, 0.2], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  // thought bubble
  shape(c, () => ell(c, 620, 230, 270, 190), WHITE, 7);
  shape(c, () => ell(c, 490, 370, 24, 24), WHITE, 6); shape(c, () => ell(c, 450, 425, 13, 13), WHITE, 5);
  appleSlice(c, 540, 290, 105, 0, 0); lemonSlice(c, 760, 230, 70);
  c.beginPath(); c.moveTo(640, 200); c.lineTo(690, 230); c.strokeStyle = "rgba(0,0,0,0)"; c.stroke();
  // the notebook and pencil
  shape(c, () => polyP(c, [[520, 760], [880, 760], [920, 940], [490, 940]]), COL.paper, 6);
  for (let k = 0; k < 4; k++) line(c, [[540 + k * 8, 800 + k * 34], [860 + k * 12, 800 + k * 34]], 4, COL.steelDk);
  c.save(); c.translate(700, 820); c.rotate(0.9);
  shape(c, () => rrect(c, -130, -14, 220, 28, 5), COL.yellow, 5); shape(c, () => polyP(c, [[90, -14], [140, 0], [90, 14]]), "#f2d2a0", 5);
  c.restore();
};
const term6 = (c: Ctx) => {
  ground(c);
  plate(c, 470, 780, 440, 170);
  appleSlice(c, 400, 800, 150, 0, 0.5);
  // magnifier
  shape(c, () => ell(c, 470, 400, 260, 260), BG, 0);
  line(c, [[640, 590], [880, 840]], 56, INK); line(c, [[640, 590], [880, 840]], 34, COL.brown);
  c.save(); c.beginPath(); ell(c, 470, 400, 250, 250); c.clip();
  c.fillStyle = "#fbf1cf"; c.fillRect(0, 0, D, D);
  c.restore();
  c.save(); c.beginPath(); ell(c, 470, 400, 250, 250); c.clip();
  appleSlice(c, 470, 640, 330, 0, 0.5);
  c.restore();
  shape(c, () => ell(c, 470, 400, 250, 250), "rgba(214,236,250,0.35)", 24);
  shine(c, [[320, 270], [380, 210]], 16);
};
const term7 = (c: Ctx) => {
  ground(c); floorLine(c, 880);
  shape(c, () => rrect(c, 700, 60, 200, 820, 8), COL.cloth, 6);
  tape(c, 710, 100, 860, 120);
  RB(c, 440, 200, 70);
  c.beginPath(); c.setLineDash([24, 20]); c.moveTo(512, 200); c.lineTo(720, 200); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); c.setLineDash([]);
  shadow(c, 450, 880, 70, 12);
  arrow(c, [[440, 290], [440, 640]]);
  RB(c, 440, 810, 70);
};
const term8 = (c: Ctx) => {
  ground(c);
  panel(c, 180, 80, 720, 920);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 180, 150 + i * 100, 22, 16), COL.steelDk, 5);
  [[0, 1], [3, 0]].forEach(([k, b], i) => {
    const y = 270 + i * 350;
    small(c, 360, y, 0.62, () => tagIcon(c, 0, 0, k));
    appleSlice(c, 650, y + 70, 130, 0, b ? 0 : 1);
    line(c, [[470, y], [530, y]], 8);
  });
  tick(c, 780, 770, 50);
};
const term9 = (c: Ctx) => {
  ground(c);
  panel(c, 60, 120, 960, 860);
  const rows = [[RB, "45"], [BB, "30"], [(c: Ctx, x: number, y: number, r: number) => ball(c, x, y, r, COL.yellow, COL.orange), "20"]];
  grid(c, 250, 220, [250, 330], [140, 140, 140, 140], []);
  rows.forEach(([f, t], i) => { (f as typeof RB)(c, 375, 220 + 140 * (i + 1) + 70, 46); write(c, String(t), 560, 220 + 140 * (i + 1) + 40, 64, INK, 10); });
  // header: ball and ruler
  shape(c, () => rrect(c, 320, 245, 110, 90, 10), COL.wood, 5); for (let i = 0; i < 5; i++) line(c, [[340 + i * 22, 245], [340 + i * 22, i % 2 ? 275 : 290]], 4);
  write(c, "cm", 520, 258, 56, INK, 9);
  // ruler alongside
};
const term10 = (c: Ctx) => {
  ground(c);
  panel(c, 60, 110, 960, 860);
  const f: (string | null)[][] = [];
  for (let r = 0; r < 4; r++) { f.push([]); for (let k = 0; k < 4; k++) f[r].push(k === 2 && r === 1 ? "#a9d487" : k === 2 ? "#a9c8f0" : r === 1 ? "#ffe58a" : null); }
  grid(c, 130, 190, [200, 200, 200, 200], [170, 170, 170, 170], f);
  arrow(c, [[640, 860], [640, 760]]);
  arrow(c, [[100, 360], [160, 360]]);
};
const term11 = (c: Ctx) => {
  room(c, 700);
  bucket(c, 820, 700, 250, 270);
  const r = rnd(5);
  for (let i = 0; i < 10; i++) paperBall(c, 90 + (i % 5) * 62 + r() * 16, 840 + Math.floor(i / 5) * 60 + r() * 10, 34);
  panel(c, 440, 780, 560, 230, COL.paper);
  for (let g = 0; g < 2; g++) { for (let i = 0; i < 4; i++) line(c, [[500 + g * 250 + i * 40, 820], [500 + g * 250 + i * 40, 970]], 14, COL.blueDk); line(c, [[480 + g * 250, 950], [650 + g * 250, 840]], 14, COL.blueDk); }
  arrow(c, [[200, 820], [380, 700], [680, 600]]);
};
const term12 = (c: Ctx) => {
  room(c, 840);
  bucket(c, 830, 880, 250, 270);
  person(c, 260, 960, 640, { armR: [-1.1, -1.5], armL: [-0.9, -1.4] });
  const h = 640, head = h * 0.13, hy = 960 - h * 0.74 - head * 1.05;
  shape(c, () => ell(c, 260, hy + head * 0.45, head * 0.22, head * 0.28), INK, 0);
  for (const s of [-1, 1]) line(c, [[260 + s * head * 1.3, hy - head * 0.5], [260 + s * head * 1.7, hy - head * 0.8]], 7, RED);
  paperBall(c, 780, 400, 30);
  arrow(c, Array.from({ length: 8 }, (_, k) => { const t = k / 7; return [380 + t * 380, 440 - Math.sin(t * Math.PI) * 160 + t * 20]; }).slice(0, 6));
  for (const d of [[-1, -1], [0, -1.3], [1, -1]]) line(c, [[780 + d[0] * 60, 400 + d[1] * 60 + 0], [780 + d[0] * 85, 400 + d[1] * 85]], 6, RED);
};
const term13 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 470, 500, 250);
  appleSlice(c, 340, 520, 170, 0, 1); appleSlice(c, 740, 520, 170, 0, 0);
  lemonSlice(c, 860, 700, 60);
  arrow(c, [[340, 940], [340, 640]]); arrow(c, [[740, 940], [740, 640]]);
};
const term14 = (c: Ctx) => {
  room(c, 900);
  ground(c, "#f6efe0");
  shape(c, () => rrect(c, 200, 80, 680, 350, 18), COL.paper, 7);
  for (let k = 0; k < 4; k++) line(c, [[260, 150 + k * 60], [820 - (k % 2) * 90, 150 + k * 60]], 8, COL.steelDk);
  tick(c, 780, 360, 38);
  shape(c, () => ell(c, 540, 92, 20, 20), RED, 5);
  const f = [["#fffdf6", BR(0), BR(0)], ["#fffdf6", BR(0.6), BR(1)]];
  grid(c, 250, 700, [180, 200, 200], [110, 110], f);
  person(c, 130, 1030, 600, { armR: [-0.6, -0.9], armL: [Math.PI * 0.55, Math.PI * 0.5] });
};

// ---------------------------------------------------------------- explanations
const expl0 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 80, 490, 920); panel(c, 560, 80, 490, 920);
  // left: same height, tick
  dashed(c, 70, 480, 300); RB(c, 170, 300, 50); BB(c, 380, 300, 50); arrow(c, [[170, 380], [170, 560]]); arrow(c, [[380, 380], [380, 560]]);
  line(c, [[60, 640], [490, 640]], 6); tick(c, 275, 800, 70);
  // right: different heights, cross
  RB(c, 700, 230, 50); BB(c, 910, 400, 50); arrow(c, [[700, 310], [700, 560]]); arrow(c, [[910, 480], [910, 560]]);
  line(c, [[590, 640], [1020, 640]], 6); cross(c, 805, 800, 60);
};
const expl1 = (c: Ctx) => {
  room(c, 840);
  glass(c, 230, 820, 260, 400, 0.8, "#f6c98a"); steam(c, 230, 470); spoon(c, 190, 790);
  glass(c, 790, 820, 260, 400, 0.8, COL.water); sugarLumps(c, 790, 800, 42);
  qmark(c, 515, 330, 78);
};
const expl2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 470, 510, 250);
  slices(c, [195, 405, 615, 825], 510, 92, [0.9, 0.2, 0.2, 0.2]);
  c.beginPath(); ell(c, 195, 470, 120, 100); c.strokeStyle = RED; c.lineWidth = 14; c.stroke();
  [0, 1, 2, 3].forEach((i) => tagIcon(c, [195, 405, 615, 825][i], 820, i));
  arrow(c, [[195, 700], [195, 600]]);
};
const expl3 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 100, 1000, 880);
  const rowsB = [[0.55, 1], [0.35, 0.8], [0.15, 0.45], [0, 0]];
  const f: (string | null)[][] = [[null, "#cfe0f2", "#cfe0f2"], ...rowsB.map(([a, b]) => ["#fffdf6", BR(a), BR(b)])];
  grid(c, 110, 170, [260, 300, 300], [120, 160, 160, 160, 160], f);
  clock(c, 440, 230, 44, -1.57, -1.0); write(c, "10", 495, 210, 40, INK, 7);
  clock(c, 740, 230, 44, -1.57, 0.5); write(c, "30", 795, 210, 40, INK, 7);
  [0, 1, 2, 3].forEach((i) => small(c, 240, 370 + i * 160, 0.65, () => tagIcon(c, 0, 0, i)));
};
const expl4 = (c: Ctx) => {
  room(c, 640);
  bucket(c, 880, 640, 230, 250);
  panel(c, 60, 700, 650, 290);
  const marks = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0];
  marks.forEach((m, i) => { const x = 130 + (i % 5) * 115, y = 790 + Math.floor(i / 5) * 110; paperBall(c, x - 28, y, 24); if (m) tick(c, x + 20, y, 22); else cross(c, x + 20, y, 20); });
  paperBall(c, 180, 560, 28); arrow(c, [[250, 520], [450, 340], [700, 330]]); paperBall(c, 960, 800, 30);
};
const expl6 = (c: Ctx) => {
  ground(c, "#f6efe0");
  shape(c, () => rrect(c, 20, 60, 520, 960, 36), "#27304f", 6);
  shape(c, () => rrect(c, 560, 60, 500, 960, 36), COL.paper, 6);
  const r = rnd(9); for (let i = 0; i < 22; i++) shape(c, () => ell(c, 60 + r() * 440, 100 + r() * 500, 4, 4), WHITE, 0);
  shape(c, () => ell(c, 420, 230, 85, 85), "#ffd34d", 6);
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; line(c, [[420 + Math.cos(a) * 105, 230 + Math.sin(a) * 105], [420 + Math.cos(a) * 138, 230 + Math.sin(a) * 138]], 8, "#ffd34d"); }
  for (const x of [200, 300, 400]) line(c, [[x, 985], [300, 790]], 12);
  c.save(); c.translate(300, 790); c.rotate(-0.9);
  shape(c, () => rrect(c, -30, -45, 330, 90, 20), COL.teal, 6); shape(c, () => rrect(c, 290, -58, 70, 116, 12), COL.tealDk, 6); shape(c, () => rrect(c, -80, -22, 60, 44, 8), COL.black, 6);
  c.restore();
  person(c, 105, 990, 560, { adult: true, armR: [-0.1, -0.3] });
  c.save(); c.beginPath(); rrect(c, 560, 60, 500, 960, 36); c.clip();
  stoolTable(c, 800);
  plate(c, 890, 770, 150, 56);
  slices(c, [840, 940], 775, 50, [0.9, 0]);
  person(c, 650, 1010, 560, { armR: [0.9, 0.5] });
  c.restore();
  shape(c, () => rrect(c, 560, 60, 500, 960, 36), "rgba(0,0,0,0)", 6);
};

export const ic_howWeKnowFairTestsL3 = cards("sci.how-we-know.fair-tests.L3 cards", [
  intro, summary, flowE2, flowA2, flowA3, flowA4, flowP1, flowC1, flowC2,
  term0, term1, term2, term3, term4, term5, term6, term7, term8, term9, term10, term11, term12, term13, term14,
  expl0, expl1, expl2, expl3, expl4, expl6,
]);
