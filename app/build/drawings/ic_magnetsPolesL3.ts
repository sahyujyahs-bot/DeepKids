import type { Ctx } from "./core";
import { COL, INK, SKIN, CLOTH, WHITE, RED, SH, arrow, cards, ell, ground, hand, line, rrect, polyP, rnd, shade, shadow, shape, write } from "./flatKit";

// MAGNETS · poles · picture cards for the unit's text. Same objects as the set-up cards: a bar magnet with a red
// (north) half and a blue (south) half, a yellow lid floating in a teal tub, a bendy fridge magnet with stripes.
const POLE_N = COL.red, POLE_S = COL.blue, TABLE = "#ecd3a1";
const at = (c: Ctx, x: number, y: number, rot: number, s: number, fn: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); fn(); c.restore(); };
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

const bar = (c: Ctx, x: number, y: number, len: number, th: number, rot = 0, flip = false) => {
  c.save(); c.translate(x, y); c.rotate(rot); if (flip) c.scale(-1, 1);
  const body = () => rrect(c, -len / 2, -th / 2, len, th, th * 0.22);
  shape(c, body, POLE_S, 6);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = POLE_N; c.fillRect(0, -th, len, th * 2);
  c.fillStyle = "rgba(43,35,64,0.22)"; c.fillRect(-len, th * 0.16, len * 2, th);
  c.fillStyle = "rgba(255,255,255,0.4)"; c.fillRect(-len / 2 + th * 0.2, -th * 0.38, len - th * 0.4, th * 0.1);
  c.restore();
  line(c, [[0, -th / 2], [0, th / 2]], 4);
  c.beginPath(); body(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.restore();
};
// a bar magnet with its soft shadow (lying flat, not turned)
const mag = (c: Ctx, x: number, y: number, len: number, th: number, flip = false) => { shadow(c, x + 10, y + th * 0.55 + 8, len * 0.5, th * 0.16); bar(c, x, y, len, th, 0, flip); };
const tub = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  c.beginPath(); rrect(c, x0 + 14, y0 + 20, x1 - x0, y1 - y0, 60); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 60), COL.teal, 6);
  shade(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 60), COL.tealDk, 18, 18, 0.5);
  shape(c, () => rrect(c, x0 + 36, y0 + 36, x1 - x0 - 72, y1 - y0 - 72, 34), COL.water, 5);
};
const boat = (c: Ctx, x: number, y: number, r: number, m: { len: number; th: number; rot?: number; flip?: boolean }) => {
  c.beginPath(); ell(c, x, y, r + 22, r + 22); c.strokeStyle = WHITE; c.globalAlpha = 0.6; c.lineWidth = 6; c.stroke(); c.globalAlpha = 1;
  shadow(c, x + r * 0.1, y + r * 0.12, r * 1.04, r * 1.0);
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), COL.woodDk, r * 0.22, r * 0.22, 0.6);
  c.beginPath(); ell(c, x, y, r * 0.82, r * 0.82); c.strokeStyle = COL.orange; c.lineWidth = 6; c.stroke();
  bar(c, x, y, m.len, m.th, m.rot ?? 0, m.flip ?? false);
};
const ruler = (c: Ctx, x0: number, y0: number, x1: number, h: number, cm: number, zero: number) => {
  c.beginPath(); c.rect(x0 + 8, y0 + 14, x1 - x0, h); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x0, y0, x1 - x0, h, 8), COL.wood, 6);
  c.save(); c.beginPath(); rrect(c, x0, y0, x1 - x0, h, 8); c.clip(); c.fillStyle = COL.woodDk; c.fillRect(x0, y0 + h * 0.82, x1 - x0, h); c.restore();
  for (let k = -20; k <= 40; k++) { const x = zero + k * cm; if (x < x0 + 14 || x > x1 - 14) continue; line(c, [[x, y0 + 4], [x, y0 + (k % 5 === 0 ? h * 0.5 : h * 0.34)]], k % 5 === 0 ? 5 : 3); if (k >= 0 && k <= 9) write(c, String(k), x - 9, y0 + h * 0.5, h * 0.3, INK, 4); }
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.orange, 5);
};
// a bendy fridge magnet lying flat: striped sticking face, or the yellow back with a sun
const slab = (c: Ctx, x: number, y: number, w: number, h: number, striped: boolean, stripe = 44) => {
  const t = 22, face = () => rrect(c, x, y, w, h, 22);
  c.beginPath(); rrect(c, x + 14, y + t + 8, w, h, 22); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x, y + t, w, h, 22), striped ? COL.blueDk : COL.woodDk, 6);
  shape(c, face, striped ? COL.paper : COL.yellow, 6);
  c.save(); c.beginPath(); face(); c.clip();
  if (striped) for (let k = 0; k * stripe < w; k++) { c.fillStyle = k % 2 ? POLE_S : POLE_N; c.fillRect(x + k * stripe, y, stripe, h); }
  c.fillStyle = "rgba(43,35,64,0.18)"; c.fillRect(x, y + h * 0.86, w, h);
  c.restore();
  if (!striped) sun(c, x + w / 2, y + h / 2, 34);
  c.beginPath(); face(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const pclip = (c: Ctx, x: number, y: number, s: number, rot = 0) => at(c, x, y, rot, s, () => {
  const loops = () => { c.beginPath(); rrect(c, -42, -85, 84, 170, 38); rrect(c, -22, -49, 44, 146, 22); };
  loops(); c.strokeStyle = INK; c.lineWidth = 24; c.lineJoin = "round"; c.stroke();
  loops(); c.strokeStyle = COL.steel; c.lineWidth = 11; c.stroke();
});
const compassNeedle = (c: Ctx, x: number, y: number, ang: number, len: number, wid: number) => at(c, x, y, ang, 1, () => {
  shape(c, () => polyP(c, [[-len, 0], [0, -wid], [0, wid]]), "#f3f0ea", 5);
  shape(c, () => polyP(c, [[len, 0], [0, -wid], [0, wid]]), RED, 5);
  shape(c, () => ell(c, 0, 0, wid * 0.45, wid * 0.45), COL.steelDk, 3);
});
// the letters N and S, drawn as strokes (top-left corner at x, y; height h)
const letter = (c: Ctx, ch: "N" | "S", x: number, y: number, h: number, col: string = INK, w = 14) => {
  const P = ch === "N" ? [[0, 1], [0, 0], [0.62, 1], [0.62, 0]] : [[0.6, 0.18], [0.35, 0], [0.04, 0.12], [0.04, 0.34], [0.32, 0.5], [0.6, 0.66], [0.6, 0.88], [0.3, 1], [0.0, 0.84]];
  line(c, P.map(([u, v]) => [x + u * h, y + v * h]), w, col);
};
const qmark = (c: Ctx, x: number, y: number, s: number, col: string = INK) => {
  line(c, [[-35, -30], [-20, -65], [15, -72], [40, -45], [30, -15], [0, 5], [0, 25]].map(([u, v]) => [x + u * s, y + v * s]), 12 * s, col);
  shape(c, () => ell(c, x, y + 58 * s, 8 * s, 8 * s), col, 0);
};
// like or unlike pairs of bar magnets in a row
const attractPair = (c: Ctx, cx: number, y: number, len: number, th: number, gap: number) => { mag(c, cx - gap / 2 - len / 2, y, len, th); mag(c, cx + gap / 2 + len / 2, y, len, th); };
const repelPair = (c: Ctx, cx: number, y: number, len: number, th: number, gap: number, red = true) => { mag(c, cx - gap / 2 - len / 2, y, len, th, !red); mag(c, cx + gap / 2 + len / 2, y, len, th, red); };
const toward = (c: Ctx, cx: number, y: number, half: number, tip: number) => { arrow(c, [[cx - half, y], [cx - tip, y]]); arrow(c, [[cx + half, y], [cx + tip, y]]); };
const apart = (c: Ctx, cx: number, y: number, a: number, b: number) => { arrow(c, [[cx - a, y], [cx - b, y]]); arrow(c, [[cx + a, y], [cx + b, y]]); };

// ---- cards
const intro = (c: Ctx) => {
  ground(c);
  mag(c, 305, 540, 340, 100); hand(c, 200, 540, 0, 1.5, SKIN.child, CLOTH.child);
  mag(c, 775, 540, 340, 100, true); hand(c, 880, 540, Math.PI, 1.5, SKIN.adult, CLOTH.adult);
  apart(c, 540, 410, 0, 80);
};
const summary = (c: Ctx) => {
  ground(c);
  attractPair(c, 540, 270, 300, 100, 60); toward(c, 540, 150, 190, 40);
  repelPair(c, 540, 760, 300, 100, 140); apart(c, 540, 640, 12, 100);
};
const e1 = (c: Ctx) => {
  ground(c); tub(c, 60, 200, 1020, 880);
  boat(c, 320, 540, 150, { len: 220, th: 66 });
  boat(c, 740, 540, 150, { len: 220, th: 66, flip: true });
  arrow(c, [[560, 330], [780, 330]]);
  arrow(c, arcPts(740, 540, 215, -50, 40));
};
const e2 = (c: Ctx) => {
  ground(c);
  slab(c, 200, 500, 560, 200, true);
  slab(c, 330, 430, 560, 200, false);
  arrow(c, [[330, 340], [570, 340]]);
  ruler(c, 200, 840, 900, 90, 48, 330);
  line(c, [[330, 730], [330, 840]], 4, COL.greyDk); line(c, [[570, 730], [570, 840]], 4, COL.greyDk);
};
const a1 = (c: Ctx) => {
  ground(c); c.fillStyle = TABLE; c.fillRect(0, 640, 1080, 440); line(c, [[0, 640], [1080, 640]], 6);
  mag(c, 790, 596, 300, 90, true);
  mag(c, 300, 590, 300, 90);
  hand(c, 150, 590, 0, 1.5, SKIN.child, CLOTH.child);
  arrow(c, [[670, 450], [930, 450]]);
};
const parcel = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 200, y + 150, 210, 20);
  shape(c, () => rrect(c, x, y, 400, 140, 18), "#f1ead7");
  c.save(); c.beginPath(); rrect(c, x, y, 400, 140, 18); c.clip();
  [[0.18, 0.62], [0.35, 0.8], [0.58, 0.9]].forEach(([u], i) => { for (let k = 0; k < 4; k++) line(c, [[x + 20 + i * 120, y + 25 + k * 28], [x + 100 + i * 120, y + 25 + k * 28]], 5, COL.grey); void u; });
  c.fillStyle = "rgba(255,211,77,0.85)"; c.fillRect(x + 170, y - 4, 60, 150); c.restore();
  shape(c, () => rrect(c, x, y, 400, 140, 18), "rgba(0,0,0,0)", 6);
};
const a2 = (c: Ctx) => {
  ground(c);
  parcel(c, 80, 600); parcel(c, 600, 600);
  qmark(c, 280, 560, 0.6, RED); qmark(c, 800, 560, 0.6, RED);
  bar(c, 280, 330, 250, 76, Math.PI / 2);
  arrow(c, [[420, 270], [420, 420]]);
  write(c, "1", 255, 820, 100, INK, 12); write(c, "2", 775, 820, 100, INK, 12);
};
const ringBand = (c: Ctx, y: number, lower: string, upper: string) => {
  const x = 380, w = 320, h = 84, body = () => rrect(c, x, y, w, h, 20);
  shadow(c, 560, y + h + 6, 150, 12);
  shape(c, body, upper, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = lower; c.fillRect(x, y + h / 2, w, h); c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(x + 20, y + 10, w - 40, 8); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
};
const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(250, 900); c.bezierCurveTo(260, 800, 820, 800, 830, 900); c.quadraticCurveTo(540, 960, 250, 900); c.closePath(); }, COL.orange);
  shape(c, () => rrect(c, 523, 180, 34, 680, 4), COL.yellow, 6);
  shape(c, () => polyP(c, [[523, 180], [540, 120], [557, 180]]), COL.wood, 5);
  ringBand(c, 745, POLE_S, POLE_N); ringBand(c, 590, POLE_N, POLE_S); ringBand(c, 435, POLE_S, POLE_N);
  arrow(c, [[780, 560], [780, 420]]);
};
const arrowIn = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y], [x + 62, y]], 8, POLE_S);
  shape(c, () => polyP(c, [[x + 58, y - 14], [x + 86, y], [x + 58, y + 14]]), POLE_N, 4);
};
const a4 = (c: Ctx) => {
  ground(c);
  c.beginPath(); rrect(c, 124, 84, 860, 940, 12); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, 110, 70, 860, 940, 12), WHITE, 6);
  shape(c, () => rrect(c, 170, 120, 740, 280, 14), COL.paper, 6);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) arrowIn(c, 200 + k * 100, 190 + r * 80);
  arrow(c, [[540, 430], [540, 520]]);
  [170, 560].forEach((x) => { shape(c, () => rrect(c, x, 560, 350, 280, 14), COL.paper, 6); for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) arrowIn(c, x + 30 + k * 105, 620 + r * 80); });
  arrow(c, [[500, 900], [440, 900]]); arrow(c, [[580, 900], [640, 900]]);
};
const p1 = (c: Ctx) => {
  ground(c); c.fillStyle = TABLE; c.fillRect(0, 770, 1080, 310); line(c, [[0, 770], [1080, 770]], 6);
  c.save(); c.translate(70, 0);
  shadow(c, 590, 785, 270, 22);
  shape(c, () => rrect(c, 400, 570, 380, 120, 10), "#d9a45f"); line(c, [[400, 640], [780, 640]], 4, "#b98a40");
  shape(c, () => rrect(c, 520, 590, 140, 60, 6), WHITE, 4);
  bar(c, 590, 535, 300, 60, 0, true);
  [470, 710].forEach((x) => { shape(c, () => ell(c, x, 715, 54, 54), COL.teal, 6); shape(c, () => ell(c, x, 715, 26, 26), COL.tealDk, 4); });
  arrow(c, [[480, 440], [760, 440]]);
  c.restore();
  mag(c, 224, 540, 240, 64);
  hand(c, 120, 540, 0, 1.3, SKIN.child, CLOTH.child);
};
const c1 = (c: Ctx) => {
  ground(c); c.fillStyle = TABLE; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  mag(c, 540, 740, 560, 100);
  bar(c, 540, 460, 560, 100, 0.1);
  [340, 740].forEach((x) => { arrow(c, [[x, 610], [x, 540]]); arrow(c, [[x, 610], [x, 685]]); });
  arrow(c, arcPts(900, 460, 100, -70, 100));
  arrow(c, [[230, 330], [100, 330]]);
};

// terms
const clipsAt = (c: Ctx, x: number, y: number, seed: number) => { const r = rnd(seed); for (let i = 0; i < 4; i++) pclip(c, x + (r() - 0.5) * 110, y + r() * 50, 0.55, (r() - 0.5) * 2.4); };
const t0 = (c: Ctx) => { ground(c); mag(c, 540, 400, 640, 140); clipsAt(c, 270, 520, 5); clipsAt(c, 810, 520, 9); };
const labelled = (c: Ctx, red: boolean) => {
  ground(c);
  if (red) { tub(c, 160, 300, 920, 1000); boat(c, 540, 650, 170, { len: 250, th: 74, rot: -Math.PI / 2 }); letter(c, "N", 478, 80, 140); arrow(c, [[540, 430], [540, 260]]); }
  else { tub(c, 160, 80, 920, 780); boat(c, 540, 430, 170, { len: 250, th: 74, rot: -Math.PI / 2 }); letter(c, "S", 480, 860, 140); arrow(c, [[540, 630], [540, 830]]); }
};
const t3 = (c: Ctx) => { ground(c); attractPair(c, 540, 600, 360, 120, 90); toward(c, 540, 380, 230, 50); };
const t4 = (c: Ctx) => { ground(c); repelPair(c, 540, 600, 360, 120, 150); apart(c, 540, 380, 20, 200); };
const t5 = (c: Ctx) => { ground(c); repelPair(c, 540, 520, 340, 120, 180, false); letter(c, "S", 330, 650, 120, POLE_S); letter(c, "S", 680, 650, 120, POLE_S); apart(c, 540, 340, 20, 140); };
const t6 = (c: Ctx) => { ground(c); attractPair(c, 540, 520, 340, 120, 20); letter(c, "N", 410, 650, 120, POLE_N); letter(c, "S", 600, 650, 120, POLE_S); toward(c, 540, 340, 160, 40); };
const t7 = (c: Ctx) => {
  ground(c); tub(c, 300, 200, 1020, 800);
  boat(c, 700, 500, 120, { len: 190, th: 56, flip: true });
  mag(c, 218, 500, 260, 76); hand(c, 120, 500, 0, 1.4, SKIN.child, CLOTH.child);
  arrow(c, [[780, 370], [940, 370]]);
  ruler(c, 200, 860, 800, 90, 36, 348);
  line(c, [[348, 560], [348, 860]], 4, COL.greyDk); line(c, [[605, 560], [605, 860]], 4, COL.greyDk);
};
const fieldLoop = (c: Ctx, xr: number, xl: number, y: number, h: number, dir: 1 | -1) => {
  c.beginPath(); c.moveTo(xr, y); c.bezierCurveTo(xr + 260, y + dir * h * 1.33, xl - 260, y + dir * h * 1.33, xl, y);
  c.strokeStyle = COL.purple; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
  const mx = (xr + xl) / 2, my = y + dir * h;
  line(c, [[mx + 26, my - 24 * dir], [mx, my], [mx + 26, my + 24 * dir]], 9, COL.purple);
};
const t8 = (c: Ctx) => {
  ground(c);
  [[0, 150], [20, 270], [38, 380]].forEach(([k, h]) => { fieldLoop(c, 760, 320, 540 - k, h, -1); fieldLoop(c, 760, 320, 540 + k, h, 1); });
  mag(c, 540, 540, 440, 130);
};
const t9 = (c: Ctx) => {
  ground(c); mag(c, 520, 230, 600, 130);
  pclip(c, 730, 355, 0.8, 0.04); pclip(c, 733, 450, 0.8, -0.04); pclip(c, 730, 545, 0.8, 0.03);
};
const t10 = (c: Ctx) => { ground(c); mag(c, 540, 400, 680, 150); mag(c, 540, 680, 680, 150); };

// explanations
const x0 = (c: Ctx) => {
  ground(c);
  bar(c, 540, 540, 560, 150, -Math.PI / 2);
  letter(c, "N", 495, 80, 100, POLE_N); letter(c, "S", 495, 900, 100, POLE_S);
  [[430, 1], [650, 2]].forEach(([x], i) => { void i; clipsAt(c, x, 220, x); clipsAt(c, x, 800, x + 3); });
};
const x1 = (c: Ctx) => {
  ground(c);
  attractPair(c, 540, 200, 260, 70, 200); toward(c, 540, 200, 80, 20);
  repelPair(c, 540, 540, 260, 70, 200); apart(c, 540, 540, 10, 90);
  repelPair(c, 540, 880, 260, 70, 200, false); apart(c, 540, 880, 10, 90);
};
const x2 = (c: Ctx) => {
  ground(c); tub(c, 60, 60, 1020, 1020);
  boat(c, 330, 230, 100, { len: 170, th: 50 }); boat(c, 750, 230, 100, { len: 170, th: 50, flip: true }); apart(c, 540, 230, 10, 70);
  boat(c, 330, 540, 100, { len: 170, th: 50 }); boat(c, 750, 540, 100, { len: 170, th: 50, rot: Math.PI / 2 }); arrow(c, arcPts(750, 540, 150, -40, 40));
  boat(c, 440, 850, 100, { len: 170, th: 50 }); boat(c, 640, 850, 100, { len: 170, th: 50 });
  write(c, "1", 110, 200, 60, INK, 8); write(c, "2", 110, 510, 60, INK, 8); write(c, "3", 110, 820, 60, INK, 8);
};
const x3 = (c: Ctx) => {
  ground(c); mag(c, 540, 400, 640, 140);
  pclip(c, 330, 535, 0.9, 0.05); pclip(c, 750, 535, 0.9, -0.05);
};
const x4 = (c: Ctx) => {
  ground(c);
  mag(c, 540, 250, 640, 90);
  for (let y = 190; y < 310; y += 36) line(c, [[540, y], [540, y + 20]], 7, RED);
  arrow(c, [[540, 340], [540, 420]]);
  mag(c, 370, 540, 300, 90); mag(c, 710, 540, 300, 90);
  [370, 710].forEach((x) => { for (let y = 480; y < 600; y += 36) line(c, [[x, y], [x, y + 20]], 7, RED); });
  arrow(c, [[540, 630], [540, 710]]);
  [285, 455, 625, 795].forEach((x) => mag(c, x, 830, 140, 90));
};
const x5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 300, 30);
  shape(c, () => ell(c, 540, 560, 320, 320), COL.blue, 6);
  c.save(); c.beginPath(); ell(c, 540, 560, 320, 320); c.clip();
  shape(c, () => polyP(c, [[330, 380], [440, 330], [520, 400], [480, 520], [380, 540], [310, 470]]), COL.green, 5);
  shape(c, () => polyP(c, [[600, 560], [720, 500], [800, 580], [760, 720], [650, 760], [590, 660]]), COL.green, 5);
  shade(c, () => ell(c, 540, 560, 320, 320), COL.blueDk, 50, 50, 0.35);
  c.restore();
  shape(c, () => ell(c, 540, 560, 320, 320), "rgba(0,0,0,0)", 6);
  bar(c, 540, 560, 480, 120, Math.PI / 2);
  shape(c, () => ell(c, 880, 150, 110, 110), WHITE, 6);
  compassNeedle(c, 880, 150, Math.atan2(110, -340), 88, 24);
};
const x6 = (c: Ctx) => { ground(c); slab(c, 160, 380, 760, 300, true, 63); };
const x7 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 850, 160, 20);
  shape(c, () => ell(c, 540, 600, 150, 150), POLE_N, 6);
  shade(c, () => ell(c, 540, 600, 150, 150), "#2b2340", 40, 40, 0.18);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.39; arrow(c, [[540 + Math.cos(a) * 190, 600 + Math.sin(a) * 190], [540 + Math.cos(a) * 300, 600 + Math.sin(a) * 300]], RED, 9); }
  qmark(c, 540, 600, 1.3, WHITE);
};

export const ic_magnetsPolesL3 = cards("sci.magnets.poles.L3 cards", [
  intro, summary, e1, e2, a1, a2, a3, a4, p1, c1,
  t0, (c) => labelled(c, true), (c) => labelled(c, false), t3, t4, t5, t6, t7, t8, t9, t10,
  x0, x1, x2, x3, x4, x5, x6, x7,
]);
