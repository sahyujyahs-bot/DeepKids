import type { Ctx } from "./core";
import { D, INK, BG, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, plate, glass, seed, write, cards } from "./flatKit";

// sci.microorganisms.parasites.L4 · picture cards. Set-up cards first (the Sari Filter Test and the four pots),
// then the card pictures. Child and grown-up are the same as on every other card.

const WOOD = "#ecd3a2", WOODDK = "#d4b06c", FLOOR = "#e8dcc2", FLOORLN = "#d6c8a6", PAPER = "#fffaf0";
const MUST = "#4b3a2f", MUSTDK = "#2f241d", KHUS = "#f3ebd4", KHUSDK = "#d5c59c";
const POT = "#e0894a", POTDK = "#b8682f", POTIN = "#f3b27c", WRIG = "#5b4636", ORANGE = "#f39a3c";
const CLOTHC = "#f7f3e8", CLOTHDK = "#e4dccb";
const PI = Math.PI;

// ------------------------------------------------------------------ backgrounds
const tableBg = (c: Ctx) => {
  ground(c, WOOD); c.globalAlpha = 0.5;
  [140, 330, 520, 720, 900, 1040].forEach((y, i) => line(c, [[0, y], [D, y + (i % 2 ? 14 : -14)]], 3, WOODDK));
  c.globalAlpha = 1;
};
const floorBg = (c: Ctx) => {
  ground(c, FLOOR); c.globalAlpha = 0.7;
  for (let x = 135; x < D; x += 270) line(c, [[x, 0], [x, D]], 3, FLOORLN);
  for (let y = 135; y < D; y += 270) line(c, [[0, y], [D, y]], 3, FLOORLN);
  c.globalAlpha = 1;
};
// a shaded balcony: sky above a railing, tiled floor from y = 600
const balconyBg = (c: Ctx, rail = true) => {
  ground(c, COL.sky);
  c.fillStyle = FLOOR; c.fillRect(0, 600, D, D - 600);
  c.globalAlpha = 0.7;
  for (let x = 135; x < D; x += 270) line(c, [[x, 600], [x, D]], 3, FLOORLN);
  line(c, [[0, 840], [D, 840]], 3, FLOORLN);
  c.globalAlpha = 1;
  if (rail) {
    for (let x = 36; x < D; x += 72) { line(c, [[x, 260], [x, 560]], 16, INK); line(c, [[x, 260], [x, 560]], 8, COL.steel); }
    shape(c, () => rrect(c, -10, 226, D + 20, 38, 12), COL.steel);
    shape(c, () => rrect(c, -10, 548, D + 20, 30, 12), COL.steel);
  }
  line(c, [[0, 600], [D, 600]], 6);
};

// ------------------------------------------------------------------ small things
const bead = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), col, Math.max(2, r * 0.25));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.92); c.clip(); c.beginPath(); ell(c, x - r * 0.3, y - r * 0.3, r, r * 0.92); c.rect(-5000, -5000, 10000, 10000); c.fillStyle = dk; c.globalAlpha = 0.55; c.fill("evenodd"); c.restore(); c.globalAlpha = 1;
};
const mustard = (c: Ctx, x: number, y: number, r = 11) => bead(c, x, y, r, MUST, MUSTDK);
const khus = (c: Ctx, x: number, y: number, r = 6) => bead(c, x, y, r, KHUS, KHUSDK);
const bean = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, "#b04a35", "#7c2c1f");
const drop = (c: Ctx, x: number, y: number, s = 1) => shape(c, () => { c.moveTo(x, y - 28 * s); c.quadraticCurveTo(x + 20 * s, y + 2 * s, x, y + 14 * s); c.quadraticCurveTo(x - 20 * s, y + 2 * s, x, y - 28 * s); c.closePath(); }, COL.water, 4);

const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.66], [0.5, 0.66]]],
  B: [[[0, 1], [0, 0], [0.4, 0], [0.55, 0.15], [0.55, 0.35], [0.4, 0.5], [0, 0.5]], [[0.4, 0.5], [0.58, 0.65], [0.58, 0.85], [0.4, 1], [0, 1]]],
  C: [[[0.58, 0.12], [0.4, 0], [0.18, 0], [0.02, 0.2], [0.02, 0.8], [0.18, 1], [0.4, 1], [0.58, 0.88]]],
  D: [[[0, 0], [0, 1], [0.3, 1], [0.56, 0.8], [0.56, 0.2], [0.3, 0], [0, 0]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};

// a cloth stretched over the mouth of a glass, held by a rubber band, sagging a little in the middle
const clothCap = (c: Ctx, x: number, rimY: number, rx: number, ry: number, sag = 24) => {
  const R = rx + 12, hem = rimY + 84, skirt = () => { c.moveTo(x - R, rimY); c.lineTo(x - R - 6, hem); c.quadraticCurveTo(x, hem + ry * 2 + 10, x + R + 6, hem); c.lineTo(x + R, rimY); c.closePath(); };
  shape(c, skirt, CLOTHC); shade(c, skirt, CLOTHDK, -30, 0, 0.8);
  c.save(); c.beginPath(); skirt(); c.clip(); c.globalAlpha = 0.5;
  for (let xx = x - R; xx < x + R + 10; xx += 22) line(c, [[xx, rimY], [xx - 6, hem + 40]], 2, "#bfb59c");
  c.restore(); c.globalAlpha = 1;
  c.beginPath(); c.ellipse(x, rimY + 40, R + 3, ry + 4, 0, 0, PI); c.lineCap = "round"; c.strokeStyle = INK; c.lineWidth = 20; c.stroke(); c.strokeStyle = ORANGE; c.lineWidth = 11; c.stroke();
  shape(c, () => ell(c, x, rimY, R, ry + 6), CLOTHC);
  shape(c, () => ell(c, x, rimY + sag * 0.35, R * 0.74, (ry + 6) * 0.72), CLOTHDK, 0);
  c.save(); c.beginPath(); ell(c, x, rimY, R, ry + 6); c.clip(); c.globalAlpha = 0.55;
  for (let xx = x - R; xx < x + R; xx += 20) line(c, [[xx, rimY - 40], [xx, rimY + 50]], 2, "#bfb59c");
  for (let yy = rimY - 40; yy < rimY + 50; yy += 14) line(c, [[x - R, yy], [x + R, yy]], 2, "#bfb59c");
  c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x, rimY, R, ry + 6), "rgba(0,0,0,0)", 6);
};

// a pretend-copepod pair of seeds scattered inside an ellipse
const scatter = (c: Ctx, cx: number, cy: number, rx: number, ry: number, nm: number, nk: number, seedN = 3) => {
  const r = (() => { let s = seedN * 977; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
  const spots: number[][] = [];
  for (let tries = 0; spots.length < nm + nk && tries < 4000; tries++) { const a = r() * PI * 2, d = Math.sqrt(r()) * 0.9, x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d; if (spots.every(([sx, sy]) => Math.hypot(sx - x, sy - y) > 22)) spots.push([x, y]); }
  spots.slice(0, nk).forEach(([x, y]) => khus(c, x, y));
  spots.slice(nk).forEach(([x, y]) => mustard(c, x, y));
};

// ------------------------------------------------------------------ pots (terracotta) and what covers them
const pot = (c: Ctx, x: number, baseY: number, w = 210, h = 230) => {
  const top = w / 2, bot = w * 0.38, ty = baseY - h;
  shadow(c, x + w * 0.1, baseY + 8, w * 0.6, 20);
  const body = () => { c.moveTo(x - top, ty); c.lineTo(x + top, ty); c.lineTo(x + bot, baseY); c.quadraticCurveTo(x, baseY + 14, x - bot, baseY); c.closePath(); };
  shape(c, body, POT); shade(c, body, POTDK, -w * 0.22, 0, 0.5);
  return ty;
};
const potMouth = (c: Ctx, x: number, ty: number, w: number, inside: string = COL.water) => {
  shape(c, () => ell(c, x, ty, w / 2, w * 0.2), POTDK);
  shape(c, () => ell(c, x, ty + 2, w / 2 - 11, w * 0.2 - 9), inside, 4);
};
const potLid = (c: Ctx, x: number, ty: number, w: number) => {
  shape(c, () => ell(c, x, ty + 10, w / 2 + 26, w * 0.2 + 10), COL.steelDk);
  shape(c, () => ell(c, x, ty, w / 2 + 26, w * 0.2 + 10), COL.steel);
  shape(c, () => ell(c, x, ty - 2, w / 2 + 2, w * 0.2 - 4), COL.steelIn, 4);
};
const potNet = (c: Ctx, x: number, ty: number, w: number) => {
  const top = w / 2 + 6, ry = w * 0.2 + 4, hem = ty + 58, region = () => { c.moveTo(x - top, ty); c.lineTo(x - top - 3, hem); c.quadraticCurveTo(x, hem + ry * 2, x + top + 3, hem); c.lineTo(x + top, ty); c.ellipse(x, ty, top, ry, 0, 0, PI * 2); c.closePath(); };
  shape(c, region, "rgba(255,255,255,0.5)", 5);
  c.save(); c.beginPath(); region(); c.clip(); c.globalAlpha = 0.5;
  for (let k = -40; k < 60; k++) { line(c, [[x - top + k * 14, ty - ry], [x - top + k * 14 + 90, ty + 140]], 2); line(c, [[x - top + k * 14 + 90, ty - ry], [x - top + k * 14, ty + 140]], 2); }
  c.restore(); c.globalAlpha = 1;
  c.beginPath(); c.ellipse(x, ty + 30, top + 4, ry + 2, 0, 0, PI); c.strokeStyle = INK; c.lineWidth = 15; c.lineCap = "round"; c.stroke(); c.strokeStyle = ORANGE; c.lineWidth = 8; c.stroke();
  const fy = ty + 30 + ry + 2; shape(c, () => ell(c, x, fy, 14, 11), ORANGE, 4); line(c, [[x, fy], [x - 24, fy + 30]], 6, INK); line(c, [[x, fy], [x + 22, fy + 32]], 6, INK);
};
const potOil = (c: Ctx, x: number, ty: number, w: number) => {
  const rx = w / 2 - 11, ry = w * 0.2 - 9;
  c.save(); c.beginPath(); ell(c, x, ty + 2, rx, ry); c.clip(); c.globalAlpha = 0.7;
  ["#f29ab4", "#ffd34d", "#9ccf62", "#8fc3ea", "#b79be0"].forEach((col, i) => { c.beginPath(); c.ellipse(x - rx * 0.2, ty + 2 + ry * 0.1, rx * (1.05 - i * 0.17), ry * (1.0 - i * 0.17), 0, 0, PI * 2); c.fillStyle = col; c.fill(); });
  c.restore(); c.globalAlpha = 1;
  line(c, [[x - rx * 0.55, ty - ry * 0.3], [x - rx * 0.1, ty - ry * 0.55]], 8, WHITE);
};
const tape = (c: Ctx, x: number, y: number, ch: string) => {
  shape(c, () => rrect(c, x - 38, y, 76, 70, 6), WHITE, 4);
  letter(c, ch, x - 16, y + 12, 46, INK, 8);
};

// ------------------------------------------------------------------ a mosquito larva (wriggler) and a pupa
// the tail tip is at (x, y); the body runs along ang (radians, PI/2 = straight down) and curls by bend at each step
const larva = (c: Ctx, x: number, y: number, s: number, ang: number, bend: number) => {
  let px = x, py = y, a = ang;
  const adv = (len: number) => { px += Math.cos(a) * len * s; py += Math.sin(a) * len * s; a += bend; };
  const p0 = [px, py]; adv(13); const p1 = [px, py];
  line(c, [p0, p1], 6.5 * s + 5, INK); line(c, [p0, p1], 6.5 * s, WRIG);
  for (let i = 0; i < 8; i++) { adv(6.5); const r = (4 + i * 0.35) * s; shape(c, () => ell(c, px, py, r, r), WRIG, 3); }
  adv(13); const tx = px, ty = py, ta = a; shape(c, () => ell(c, tx, ty, 13 * s, 11 * s, ta), "#6a5342", 3.5);
  adv(13); const hx = px, hy = py, ha = a; shape(c, () => ell(c, hx, hy, 8.5 * s, 8 * s, ha), "#7a6150", 3.5);
};
const pupa = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  [[-4, 16, 9], [4, 28, 8], [16, 34, 7], [27, 30, 5.5], [32, 20, 4]].forEach(([a, b, r]) => shape(c, () => ell(c, a, b, r, r), WRIG, 3));
  line(c, [[-8, -14], [-12, -27]], 5, INK); line(c, [[8, -14], [12, -27]], 5, INK);
  shape(c, () => ell(c, 0, 0, 20, 18), "#6a5342", 3.5);
  c.restore();
};

// ------------------------------------------------------------------ a mosquito, facing left (flip = -1 faces right)
const mosquito = (c: Ctx, x: number, y: number, s: number, flip = 1) => {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  const BODYM = "#6e5a52";
  [[-6, 24, [-16, 48], [-26, 104]], [22, 26, [12, 46], [6, 106]], [48, 26, [40, 44], [44, 104]]].forEach(([x0, y0, k1, k2]: any) => {
    const pts = [[x0, y0], [x0 + k1[0], y0 + k1[1]], [x0 + k2[0], y0 + k2[1]]]; line(c, pts, 9, INK); line(c, pts, 4, BODYM);
  });
  shape(c, () => ell(c, 36, -52, 82, 17, -0.4), "rgba(232,242,250,0.85)", 4);
  const ab = () => ell(c, 112, 18, 82, 22, 0.16);
  shape(c, ab, BODYM, 5);
  c.save(); c.beginPath(); ab(); c.clip(); for (let k = 0; k < 4; k++) line(c, [[88 + k * 28, -20], [92 + k * 28, 70]], 9, "#e9dfd2"); c.restore();
  shape(c, () => ell(c, 22, 0, 46, 34), "#5d4a43", 5);
  shape(c, () => ell(c, -40, 4, 21, 19), BODYM, 5);
  line(c, [[-58, 10], [-150, 36]], 9, INK); line(c, [[-58, 10], [-150, 36]], 4, "#2b2340");
  line(c, [[-46, -12], [-66, -40], [-92, -52]], 6, INK); line(c, [[-46, -12], [-66, -40], [-92, -52]], 3, BODYM);
  shape(c, () => ell(c, -46, -2, 6, 6), INK, 0);
  c.restore();
};

// ------------------------------------------------------------------ a hand with a sleeve running to the edge of the card
const armIn = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78 - 900, -36, 900, 72, 10), CLOTH.child, 6);
  c.restore();
  hand(c, x, y, an, s);
};
// a fist over the thing it holds
const fist = (c: Ctx, p: number[], an: number, s = 1) => {
  c.save(); c.translate(p[0], p[1]); c.rotate(an);
  shape(c, () => ell(c, 0, 0, 30 * s, 24 * s), SKIN.child, 5);
  for (let k = 0; k < 3; k++) line(c, [[8 * s, (-10 + k * 10) * s], [24 * s, (-10 + k * 10) * s]], 3.5, SKIN.childDk);
  shape(c, () => ell(c, -6 * s, -22 * s, 13 * s, 9 * s, -0.3), SKIN.child, 4);
  c.restore();
};

// ================================================================== SET-UP CARDS
// e1.0 · a cloth over a glass, held by a rubber band
const setup_e1_0 = (c: Ctx) => {
  tableBg(c);
  glass(c, 540, 920, 400, 440);
  clothCap(c, 540, 480, 200, 32);
  // a spare rubber band on the table
  c.beginPath(); c.ellipse(880, 860, 70, 34, 0.2, 0, PI * 2); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = ORANGE; c.lineWidth = 12; c.stroke();
};

// e1.1 · a katori of water with seeds, poured slowly on to the cloth
const setup_e1_1 = (c: Ctx) => {
  tableBg(c);
  const gx = 650, rim = 520;
  glass(c, gx, 940, 380, 420);
  clothCap(c, gx, rim, 190, 30);
  // the katori, tilted: base to the lower left, lip to the lower right
  const th = 0.9, r = 115, C = [540, 330], an = -0.67, s = 1.5;
  const G = [C[0] - 49, C[1] + 39];
  const W = [G[0] - Math.cos(an) * 70 * s, G[1] - Math.sin(an) * 70 * s];
  c.save(); c.translate(C[0], C[1]); c.rotate(th);
  shape(c, () => { c.moveTo(-r, 0); c.bezierCurveTo(-r * 0.9, r * 0.75, r * 0.9, r * 0.75, r, 0); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(-r, 0); c.bezierCurveTo(-r * 0.9, r * 0.75, r * 0.9, r * 0.75, r, 0); c.closePath(); }, COL.steelDk, -r * 0.35, 0, 0.6);
  shape(c, () => ell(c, 0, 0, r, r * 0.2), COL.water, 5);
  mustard(c, 50, 2, 10); khus(c, 15, -3, 6); mustard(c, -35, 0, 10); khus(c, 78, 3, 6);
  c.restore();
  // the stream, from the lip down to the dent in the cloth
  const lip = [C[0] + Math.cos(th) * r, C[1] + Math.sin(th) * r];
  const st = [[lip[0], lip[1] + 2], [lip[0] + 16, lip[1] + 50], [lip[0] + 24, lip[1] + 100], [lip[0] + 28, rim + 8]];
  line(c, st, 26, INK); line(c, st, 16, COL.water);
  mustard(c, st[1][0], st[1][1], 9); khus(c, st[2][0], st[2][1] - 6, 5); mustard(c, st[2][0] + 2, st[2][1] + 28, 9);
  scatter(c, gx - 40, rim + 10, 90, 16, 2, 3, 5);
  armIn(c, W[0], W[1], an, s);
};

// e1.2 · the child counts the seeds that got through, on a steel plate
const setup_e1_2 = (c: Ctx) => {
  floorBg(c);
  plate(c, 620, 960, 270, 92);
  shape(c, () => ell(c, 620, 962, 205, 62), COL.water, 4);
  [[560, 930], [660, 934], [700, 975]].forEach(([x, y]) => mustard(c, x, y));
  [[590, 958], [620, 922], [640, 968], [690, 946], [545, 962], [740, 960]].forEach(([x, y]) => khus(c, x, y));
  glass(c, 950, 930, 150, 200, 0.05);
  person(c, 380, 880, 760, { sit: true, dir: 1, reachR: [550, 880], reachL: [190, 846] });
};

// e1.3 · a stopwatch beside the glass; the last drip falls through the cloth
const setup_e1_3 = (c: Ctx) => {
  tableBg(c);
  glass(c, 330, 920, 400, 440, 0.16);
  drop(c, 330, 624, 1); drop(c, 330, 726, 0.9);
  shape(c, () => ell(c, 330, 822, 40, 10), COL.drop, 3);
  clothCap(c, 330, 480, 200, 32);
  // stopwatch standing on its rim
  const cx = 800, cy = 650, R = 190;
  shadow(c, cx + 20, cy + R + 8, R * 0.9, 22);
  shape(c, () => rrect(c, cx - 28, cy - R - 46, 56, 50, 8), COL.steelDk);
  shape(c, () => rrect(c, cx - 44, cy - R - 62, 88, 26, 10), COL.steel);
  shape(c, () => ell(c, cx, cy, R, R), COL.steel);
  shape(c, () => ell(c, cx, cy, R - 24, R - 24), WHITE, 5);
  c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R - 30, -PI / 2, -PI / 2 + 2.1); c.closePath(); c.fillStyle = "rgba(228,82,59,0.35)"; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k * PI) / 6, r1 = R - 34, r2 = R - (k % 3 === 0 ? 62 : 50); line(c, [[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], k % 3 === 0 ? 7 : 4); }
  write(c, "12", cx - 24, cy - R + 70, 34, INK, 6); write(c, "6", cx - 12, cy + R - 108, 34, INK, 6); write(c, "3", cx + R - 100, cy - 17, 34, INK, 6); write(c, "9", cx - R + 76, cy - 17, 34, INK, 6);
  const ha = -PI / 2 + 2.1; line(c, [[cx, cy], [cx + Math.cos(ha) * (R - 50), cy + Math.sin(ha) * (R - 50)]], 9, RED);
  line(c, [[cx, cy], [cx, cy - 78]], 9, INK);
  shape(c, () => ell(c, cx, cy, 14, 14), INK, 0);
};

// e2.0 · four pots A to D, each covered in a different way
const setup_e2_0 = (c: Ctx) => {
  balconyBg(c);
  const xs = [140, 390, 640, 890], base = 950, w = 220, h = 250, tys: number[] = [];
  xs.forEach((x) => tys.push(pot(c, x, base, w, h)));
  potMouth(c, xs[0], tys[0], w);
  potMouth(c, xs[1], tys[1], w); potLid(c, xs[1], tys[1], w);
  potMouth(c, xs[2], tys[2], w); potNet(c, xs[2], tys[2], w);
  potMouth(c, xs[3], tys[3], w); potOil(c, xs[3], tys[3], w);
  ["A", "B", "C", "D"].forEach((ch, i) => tape(c, xs[i], tys[i] + 104, ch));
};

// e2.1 · a torch shining into an open pot of water, wrigglers hanging from the surface
const wrigglersAt = (c: Ctx, y: number, xs: number[], s: number) => xs.forEach((x, i) => larva(c, x, y, s, PI / 2 + [0.12, 0.08, 0.1, 0.14, 0.09][i % 5], 0.04 * (i % 2 ? 1 : -1)));
const setup_e2_1 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = FLOOR; c.fillRect(0, 975, D, D - 975); line(c, [[0, 975], [D, 975]], 6);
  const x = 540, ty = 620, base = 975, top = 200, bot = 150, hh = base - ty, sy = 770;
  shadow(c, x + 30, base + 10, 250, 24);
  shape(c, () => { c.moveTo(x - top, ty); c.lineTo(x + top, ty); c.lineTo(x + bot, base); c.quadraticCurveTo(x, base + 14, x - bot, base); c.closePath(); }, POT);
  const cavity = () => { c.moveTo(x - top + 26, ty); c.lineTo(x + top - 26, ty); c.lineTo(x + bot - 22, base - 24); c.lineTo(x - bot + 22, base - 24); c.closePath(); };
  shape(c, cavity, POTIN, 5);
  const hw = (y: number) => top - 26 - ((y - ty) / (hh - 24)) * (top - 26 - (bot - 22));
  shape(c, () => { c.moveTo(x - hw(sy), sy); c.lineTo(x + hw(sy), sy); c.lineTo(x + bot - 22, base - 24); c.lineTo(x - bot + 22, base - 24); c.closePath(); }, COL.water, 5);
  line(c, [[x - hw(sy) + 6, sy + 2], [x + hw(sy) - 6, sy + 2]], 5, COL.drop);
  shape(c, () => rrect(c, x - top - 8, ty - 12, 44, 24, 10), POTDK); shape(c, () => rrect(c, x + top - 36, ty - 12, 44, 24, 10), POTDK);
  // the hand holds the torch; its axis runs perpendicular to the forearm, pointing down
  const an = 0.15, s = 1.5, W = [450, 300], G = [W[0] + Math.cos(an) * 70 * s, W[1] + Math.sin(an) * 70 * s], t = [-Math.sin(an), Math.cos(an)];
  const lens = [G[0] + t[0] * 135, G[1] + t[1] * 135], L = (sy - lens[1]) / t[1], tgt = [lens[0] + t[0] * L, sy];
  const px = [Math.cos(an), Math.sin(an)];
  c.beginPath(); c.moveTo(lens[0] - px[0] * 40, lens[1] - px[1] * 40); c.lineTo(lens[0] + px[0] * 40, lens[1] + px[1] * 40); c.lineTo(tgt[0] + 95, sy); c.lineTo(tgt[0] - 95, sy); c.closePath(); c.fillStyle = "rgba(255,236,120,0.5)"; c.fill();
  shape(c, () => ell(c, tgt[0], sy, 100, 14), "rgba(255,246,170,0.85)", 0);
  wrigglersAt(c, sy + 3, [430, 510, 590, 670], 1.2);
  c.save(); c.translate(G[0], G[1]); c.rotate(an);
  shape(c, () => rrect(c, -30, -100, 60, 180, 12), COL.red);
  shade(c, () => rrect(c, -30, -100, 60, 180, 12), "#b03a28", -22, 0, 0.5);
  shape(c, () => polyP(c, [[-32, 80], [32, 80], [54, 135], [-54, 135]]), COL.steel);
  shape(c, () => ell(c, 0, 135, 54, 12), "#fff3a8", 4);
  c.restore();
  // sleeve first, then the fingers over the torch
  c.save(); c.translate(W[0], W[1]); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, -78 - 900, -36, 900, 72, 10), CLOTH.child, 6); c.restore();
  hand(c, W[0], W[1], an, s);
};

// e2.2 · a white plate, wrigglers and a pupa in a little water; the child counts with a spoon
const setup_e2_2 = (c: Ctx) => {
  balconyBg(c);
  const px = 620, py = 960;
  shadow(c, px + 20, py + 40, 280, 70);
  shape(c, () => ell(c, px, py, 270, 94), "#f4f1ea");
  shape(c, () => ell(c, px, py - 4, 225, 74), "#ffffff", 4);
  shape(c, () => ell(c, px, py - 2, 210, 64), COL.water, 4);
  larva(c, 455, 975, 1, -0.25, 0.12); larva(c, 805, 988, 1, PI + 0.2, 0.12); larva(c, 560, 1000, 1, -0.05, 0.1);
  pupa(c, 722, 935, 1.2, 0.5);
  const h = person(c, 380, 880, 760, { sit: true, dir: 1, reachR: [550, 880], reachL: [190, 846] });
  const a = 0.7, d = [Math.cos(a), Math.sin(a)], hr = h.handR, bw = [hr[0] + d[0] * 108, hr[1] + d[1] * 108];
  line(c, [[hr[0] - d[0] * 50, hr[1] - d[1] * 50], [bw[0] - d[0] * 24, bw[1] - d[1] * 24]], 15, INK); line(c, [[hr[0] - d[0] * 50, hr[1] - d[1] * 50], [bw[0] - d[0] * 24, bw[1] - d[1] * 24]], 8, COL.steel);
  shape(c, () => ell(c, bw[0], bw[1], 40, 26, a), COL.steel, 5); shape(c, () => ell(c, bw[0], bw[1], 29, 17, a), COL.steelIn, 3);
  fist(c, hr, a, 0.8);
};

// e2.3 · pour the pot into the toilet, scrub the pots, turn them upside down
const setup_e2_3 = (c: Ctx) => {
  ground(c, "#dcebe6");
  c.globalAlpha = 0.6; for (let x = 0; x < D; x += 120) line(c, [[x, 0], [x, 930]], 3, "#b7d3cb"); for (let y = 0; y < 930; y += 120) line(c, [[0, y], [D, y]], 3, "#b7d3cb"); c.globalAlpha = 1;
  c.fillStyle = FLOOR; c.fillRect(0, 930, D, D - 930); line(c, [[0, 930], [D, 930]], 6);
  // toilet
  const sx = 560;
  shadow(c, sx + 20, 992, 150, 18);
  shape(c, () => rrect(c, sx - 85, 540, 170, 190, 16), WHITE); shade(c, () => rrect(c, sx - 85, 540, 170, 190, 16), "#cdd6de", -24, 0, 0.7);
  shape(c, () => rrect(c, sx - 30, 522, 60, 26, 8), COL.steel);
  shape(c, () => { c.moveTo(sx - 95, 780); c.lineTo(sx + 95, 780); c.quadraticCurveTo(sx + 100, 900, sx + 70, 985); c.lineTo(sx - 70, 985); c.quadraticCurveTo(sx - 100, 900, sx - 95, 780); c.closePath(); }, WHITE);
  shade(c, () => { c.moveTo(sx - 95, 780); c.lineTo(sx + 95, 780); c.quadraticCurveTo(sx + 100, 900, sx + 70, 985); c.lineTo(sx - 70, 985); c.quadraticCurveTo(sx - 100, 900, sx - 95, 780); c.closePath(); }, "#cdd6de", -24, 0, 0.7);
  shape(c, () => ell(c, sx, 770, 120, 44), WHITE); shape(c, () => ell(c, sx, 772, 80, 28), COL.waterDk, 5);
  // child, holding the pot in both hands
  const cx = 270, h = 700, Cp = [375, 600], th = 1.92, a = [Math.sin(th), -Math.cos(th)], pd = [Math.cos(th), Math.sin(th)];
  const hl: [number, number] = [Cp[0] - a[0] * 41 + pd[0] * 60, Cp[1] - a[1] * 41 + pd[1] * 60], hr: [number, number] = [Cp[0] + a[0] * 15 - pd[0] * 60, Cp[1] + a[1] * 15 - pd[1] * 60];
  person(c, cx, 1010, h, { reachL: hl, reachR: hr });
  // the pot, tilted, and the stream from its lip
  const lip = [Cp[0] + a[0] * 71 + pd[0] * 71, Cp[1] + a[1] * 71 + pd[1] * 71];
  const stream: number[][] = []; for (let i = 0; i <= 12; i++) { const u = i / 12; stream.push([(1 - u) * (1 - u) * (lip[0] + 6) + 2 * u * (1 - u) * (lip[0] + 60) + u * u * 505, (1 - u) * (1 - u) * (lip[1] + 8) + 2 * u * (1 - u) * (lip[1] + 12) + u * u * 764]); }
  line(c, stream, 26, INK); line(c, stream, 16, COL.water);
  shape(c, () => ell(c, 505, 768, 24, 8), COL.drop, 0);
  c.save(); c.translate(Cp[0], Cp[1]); c.rotate(th);
  const body = () => { c.moveTo(-71, -71); c.lineTo(71, -71); c.lineTo(55, 71); c.quadraticCurveTo(0, 82, -55, 71); c.closePath(); };
  shape(c, body, POT); shade(c, body, POTDK, -16, 0, 0.5);
  shape(c, () => ell(c, 0, -71, 71, 18), POTDK); shape(c, () => ell(c, 0, -70, 62, 12), COL.waterDk, 4);
  c.restore();
  fist(c, hl, 0.3, 0.75); fist(c, hr, -0.5, 0.75);
  // the empty pot upside down, and the scrubbing brush
  const ux = 110, ub = 1010;
  shadow(c, ux + 10, ub + 6, 100, 16);
  const inv = () => { c.moveTo(ux - 52, ub - 150); c.lineTo(ux + 52, ub - 150); c.lineTo(ux + 80, ub); c.lineTo(ux - 80, ub); c.closePath(); };
  shape(c, inv, POT); shade(c, inv, POTDK, -16, 0, 0.5);
  shape(c, () => ell(c, ux, ub - 150, 52, 13), POTDK);
  shape(c, () => ell(c, 850, 1040, 100, 30), "#d9c9a3", 5);
  shape(c, () => rrect(c, 950, 1030, 110, 20, 10), COL.wood, 5);
  shape(c, () => ell(c, 850, 1036, 78, 22), COL.wood, 5);
  for (let k = 0; k < 4; k++) line(c, [[815 + k * 24, 1028], [815 + k * 24, 1046]], 4, COL.woodDk);
};


// ================================================================== CARD PICTURES
const thread = (c: Ctx, pts: number[][], w: number, col = "#d7372b") => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = w + 8; c.stroke(); path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const COPE = "#a9d9cf", COPEDK = "#6fb3a8";
// a copepod seen from above, head up: two long feelers, one red eye, a pair of egg sacs; about 640 px tall at s = 1
const copepod = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  [-1, 1].forEach((k) => { const pts = [[k * 22, -198], [k * 100, -285], [k * 210, -310], [k * 300, -250]]; line(c, pts, 16, INK); line(c, pts, 8, COPE); });
  [-1, 1].forEach((k) => {
    shape(c, () => ell(c, k * 92, 175, 36, 84, k * 0.16), "#8c6d5b", 5);
    [[0, -40], [-12, -10], [12, -10], [0, 20], [-12, 50], [12, 50], [0, 80]].forEach(([dx, dy]) => shape(c, () => ell(c, k * 92 + dx + k * dy * 0.16, 175 + dy, 8, 8), "#4b3a2f", 0));
  });
  [-1, 1].forEach((k) => [-70, -15, 40].forEach((yy) => { line(c, [[k * 100, yy], [k * 160, yy + 34]], 14, INK); line(c, [[k * 100, yy], [k * 160, yy + 34]], 7, COPE); }));
  [[66, 70], [54, 60], [44, 52], [36, 44]].forEach(([w], i) => { const yy = 70 + i * 48; shape(c, () => rrect(c, -w, yy, w * 2, 52, 14), COPE, 5); });
  [-1, 1].forEach((k) => { const pts = [[k * 16, 262], [k * 34, 312]]; line(c, pts, 16, INK); line(c, pts, 8, COPE); [-0.35, 0, 0.35].forEach((a) => line(c, [[k * 34, 312], [k * 34 + Math.sin(a) * 60 + k * 10, 312 + Math.cos(a) * 60]], 4, INK)); });
  const body = () => { c.moveTo(0, -205); c.bezierCurveTo(95, -205, 125, -120, 115, -40); c.bezierCurveTo(108, 20, 80, 70, 40, 75); c.lineTo(-40, 75); c.bezierCurveTo(-80, 70, -108, 20, -115, -40); c.bezierCurveTo(-125, -120, -95, -205, 0, -205); c.closePath(); };
  shape(c, body, COPE, 6); shade(c, body, COPEDK, -30, 0, 0.6);
  line(c, [[0, -100], [0, 55]], 10, "#e7f6f1");
  shape(c, () => ell(c, 0, -150, 17, 17), RED, 5); shape(c, () => ell(c, -5, -155, 5, 5), WHITE, 0);
  c.restore();
};

// the five-by-wedge die and the beans for the odds game
const die = (c: Ctx, x: number, y: number, a: number) => {
  const A = [x - 1.15 * a, y - 0.65 * a], B = [x, y], Cc = [x, y + 1.3 * a], Dd = [x - 1.15 * a, y + 0.65 * a], T = [x, y - 1.3 * a], R1 = [x + 1.15 * a, y - 0.65 * a], R2 = [x + 1.15 * a, y + 0.65 * a];
  shadow(c, x + a * 0.3, y + 1.3 * a + 6, a * 1.4, a * 0.3);
  shape(c, () => polyP(c, [T, R1, B, A]), WHITE, 6); shape(c, () => polyP(c, [A, B, Cc, Dd]), "#e4e1da", 6); shape(c, () => polyP(c, [B, R1, R2, Cc]), "#c9c5bd", 6);
  const pip = (p: number[]) => shape(c, () => ell(c, p[0], p[1], a * 0.12, a * 0.12), INK, 0);
  const lf = (u: number, v: number) => [A[0] + u * (B[0] - A[0]) + v * (Dd[0] - A[0]), A[1] + u * (B[1] - A[1]) + v * (Dd[1] - A[1])];
  const rt = (u: number, v: number) => [B[0] + u * (R1[0] - B[0]) + v * (Cc[0] - B[0]), B[1] + u * (R1[1] - B[1]) + v * (Cc[1] - B[1])];
  pip([x, y - 0.65 * a]);
  pip(lf(0.28, 0.28)); pip(lf(0.72, 0.72));
  pip(rt(0.25, 0.25)); pip(rt(0.5, 0.5)); pip(rt(0.75, 0.75));
};
const pileOn = (c: Ctx, x: number, y: number, n: number, r = 14) => {
  const grid: number[][] = []; for (let dy = -22; dy <= 22; dy += 22) for (let dx = -60; dx <= 60; dx += 30) if ((dx / 70) ** 2 + (dy / 30) ** 2 <= 1) grid.push([dx, dy]);
  grid.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1])).slice(0, n).forEach(([dx, dy], i) => bean(c, x + dx, y + dy, r, (i * 1.7) % 3));
};

// flow.e1 · the Sari Filter Test: a glass under a cloth, the seeds caught on it, four folded layers, a steel strainer
const flow_e1 = (c: Ctx) => {
  tableBg(c);
  glass(c, 400, 900, 360, 400, 0.12);
  clothCap(c, 400, 500, 180, 29);
  scatter(c, 400, 508, 140, 20, 4, 6, 11);
  // four folded layers of cloth, stacked
  shadow(c, 800, 905, 190, 24);
  for (let i = 0; i < 4; i++) { shape(c, () => rrect(c, 660 + (i % 2) * 4, 860 - i * 38, 280, 40, 12), i % 2 ? CLOTHDK : CLOTHC, 5); line(c, [[700, 880 - i * 38], [700, 896 - i * 38]], 3, "#bfb59c"); }
  // the steel strainer, handle to the right
  const sx = 740, sy = 400;
  shadow(c, sx + 12, sy + 50, 130, 24);
  shape(c, () => rrect(c, sx + 100, sy - 12, 220, 26, 12), COL.steelDk);
  shape(c, () => ell(c, sx, sy, 115, 62), COL.steel);
  shape(c, () => ell(c, sx, sy, 92, 46), COL.steelIn, 4);
  c.save(); c.beginPath(); ell(c, sx, sy, 92, 46); c.clip(); c.globalAlpha = 0.45;
  for (let k = -8; k <= 8; k++) { line(c, [[sx + k * 14, sy - 50], [sx + k * 14, sy + 50]], 2); line(c, [[sx - 100, sy + k * 8], [sx + 100, sy + k * 8]], 2); }
  c.restore(); c.globalAlpha = 1;
};

// flow.e2 · a mosquito lands on the open pot and lays her eggs; the netted pot keeps her out
const flow_e2 = (c: Ctx) => {
  balconyBg(c, false);
  const w = 300, h = 330, base = 985, xa = 290, xc = 770;
  const ta = pot(c, xa, base, w, h), tc = pot(c, xc, base, w, h);
  potMouth(c, xa, ta, w);
  for (let r = 0; r < 3; r++) for (let q = 0; q < 6; q++) shape(c, () => ell(c, xa - 45 + q * 18 + (r % 2) * 8, ta + 2 - 18 + r * 18, 5, 11), MUSTDK, 2);
  potMouth(c, xc, tc, w); potNet(c, xc, tc, w);
  tape(c, xa, ta + 130, "A"); tape(c, xc, tc + 130, "C");
  mosquito(c, xa + 10, 340, 1);
  arrow(c, [[420, 395], [400, 545]], RED, 10);
  mosquito(c, xc + 20, tc - 10 - 132, 1);
};

// flow.a1 · wind 2 cm of string on to a pencil; the rest hangs loose
const flow_a1 = (c: Ctx) => {
  tableBg(c);
  shadow(c, 560, 255, 440, 18);
  shape(c, () => rrect(c, 110, 130, 890, 120, 10), COL.wood, 6);
  for (let mm = 0; mm <= 80; mm++) { const x = 150 + mm * 10, hh = mm % 10 === 0 ? 62 : mm % 5 === 0 ? 44 : 26; line(c, [[x, 130], [x, 130 + hh]], mm % 10 === 0 ? 5 : 3); }
  for (let cm = 0; cm <= 8; cm++) write(c, String(cm), 150 + cm * 100 - 11, 196, 36, INK, 6);
  // guides from the 2 and the 4 down to the coil
  line(c, [[350, 250], [350, 355]], 4, "rgba(43,35,64,0.45)"); line(c, [[550, 250], [550, 355]], 4, "rgba(43,35,64,0.45)");
  // the pencil
  const py = 390;
  shadow(c, 560, py + 40, 450, 16);
  shape(c, () => rrect(c, 130, py - 30, 56, 60, 14), COL.pink);
  shape(c, () => rrect(c, 186, py - 30, 50, 60, 4), COL.steel);
  shape(c, () => rrect(c, 236, py - 30, 650, 60, 4), COL.yellow);
  shade(c, () => rrect(c, 236, py - 30, 650, 60, 4), COL.orange, 0, -34, 0.6);
  shape(c, () => polyP(c, [[886, py - 30], [886, py + 30], [972, py]]), "#f2c9a0");
  shape(c, () => polyP(c, [[948, py - 10], [948, py + 10], [974, py]]), INK, 0);
  // the coil: about 13 turns side by side
  for (let k = 0; k < 13; k++) { const x = 352 + k * 15.4; line(c, [[x, py - 33], [x + 7, py + 33]], 17, INK); }
  for (let k = 0; k < 13; k++) { const x = 352 + k * 15.4; line(c, [[x, py - 33], [x + 7, py + 33]], 10, "#d7372b"); }
  // the loose string
  thread(c, [[556, py + 30], [566, 520], [490, 610], [370, 650], [330, 750], [440, 810], [640, 800], [760, 730], [890, 770], [950, 880]], 16);
};

// flow.a2 · a fever chart, with a thermometer
const flow_a2 = (c: Ctx) => {
  tableBg(c);
  shadow(c, 640, 975, 400, 20);
  shape(c, () => rrect(c, 230, 100, 790, 860, 14), PAPER);
  c.save(); c.beginPath(); c.rect(250, 120, 750, 820); c.clip(); c.globalAlpha = 0.6;
  for (let x = 250; x <= 1000; x += 50) line(c, [[x, 120], [x, 940]], 2, "#bcd3e8");
  for (let y = 120; y <= 940; y += 50) line(c, [[250, y], [1000, y]], 2, "#bcd3e8");
  c.restore(); c.globalAlpha = 1;
  const X = (i: number) => 360 + i * 120, Y = (t: number) => 860 - ((t - 36) / 5) * 640;
  line(c, [[300, 100 + 40], [300, 860], [980, 860]], 7);
  [36, 38, 40].forEach((t) => { line(c, [[290, Y(t)], [310, Y(t)]], 5); write(c, String(t), 236, Y(t) - 16, 32, INK, 5); });
  for (let k = 0; k < 6; k++) { line(c, [[X(k), 850], [X(k), 870]], 5); write(c, String(k + 1), X(k) - 10, 888, 32, INK, 5); }
  for (let x = 310; x < 960; x += 36) line(c, [[x, Y(37)], [x + 18, Y(37)]], 5, COL.blue);
  const data = [39.8, 37.0, 39.9, 37.1, 40.0, 37.2], pts = data.map((t, i) => [X(i), Y(t)]);
  line(c, pts, 16, INK); line(c, pts, 9, RED);
  pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, 15, 15), WHITE, 6));
  // thermometer: a tube, a bulb and a red column up to 40
  const tx = 110;
  shadow(c, tx + 14, 960, 70, 14);
  shape(c, () => rrect(c, tx - 26, 160, 52, 700, 26), "rgba(255,255,255,0.85)", 6);
  shape(c, () => ell(c, tx, 880, 52, 52), RED, 6);
  shape(c, () => rrect(c, tx - 10, 293, 20, 590, 8), RED, 0);
  [36, 37, 38, 39, 40, 41].forEach((t) => { const y = 880 - (t - 34.2) * 94; if (y > 190) line(c, [[tx + 26, y], [tx + 52, y]], 4); });
};

// flow.a3 · the odds game: 36 beans, four gates, a die, a lost heap
const flow_a3 = (c: Ctx) => {
  tableBg(c);
  [170, 420, 670, 920].forEach((x, i) => {
    plate(c, x, 290, 100, 50); pileOn(c, x, 288, [11, 6, 3, 1][i]);
    shape(c, () => rrect(c, x - 34, 372, 68, 78, 6), WHITE, 4); write(c, String(i + 1), x - 11, 388, 44, INK, 7);
    if (i < 3) arrow(c, [[x + 112, 290], [x + 138, 290]], RED, 8);
  });
  // 36 beans in a heap: rows of 8, 7, 6 ... 1
  for (let k = 0; k < 8; k++) for (let q = 0; q < 8 - k; q++) bean(c, 195 - (7 - k) * 17 + q * 34, 930 - k * 29, 17, (q * 1.3 + k * 2.1) % 3);
  die(c, 600, 700, 90);
  // the lost heap, with a red cross
  shape(c, () => ell(c, 905, 880, 110, 50), "rgba(43,35,64,0.12)", 4);
  [[870, 880], [905, 870], [940, 885], [890, 900], [925, 905]].forEach(([x, y], i) => bean(c, x, y, 15, i * 1.4));
  line(c, [[860, 780], [930, 830]], 12, RED); line(c, [[930, 780], [860, 830]], 12, RED);
};

// flow.a4 · the life-cycle wheel: a plate with five segments, and a plate with a window pinned on top
const flow_a4 = (c: Ctx) => {
  tableBg(c);
  const cx = 540, cy = 560, seg = (2 * PI) / 5, th0 = -PI / 2;
  shadow(c, cx + 20, cy + 40, 430, 420);
  shape(c, () => ell(c, cx, cy, 430, 430), "#f6e7c8");
  shape(c, () => ell(c, cx, cy, 365, 365), PAPER, 4);
  for (let k = 0; k < 5; k++) { const a = th0 + (k + 0.5) * seg; line(c, [[cx, cy], [cx + Math.cos(a) * 365, cy + Math.sin(a) * 365]], 5); const m = th0 + k * seg; write(c, String(k + 1), cx + Math.cos(m) * 398 - 13, cy + Math.sin(m) * 398 - 22, 44, INK, 7); }
  copepod(c, cx, cy - 225, 0.36);
  // the top plate: all but a wedge over segment 1
  const a0 = th0 + seg / 2, a1 = th0 - seg / 2 + 2 * PI, pie = () => { c.moveTo(cx, cy); c.arc(cx, cy, 350, a0, a1); c.closePath(); };
  c.save(); c.translate(12, 16); c.beginPath(); pie(); c.fillStyle = "rgba(43,35,64,0.2)"; c.fill(); c.restore();
  shape(c, pie, "#9fd6cf", 6);
  c.save(); c.beginPath(); pie(); c.clip(); c.globalAlpha = 0.35;
  for (let k = 0; k < 5; k++) { const a = th0 + k * seg + seg / 2 + seg / 2; line(c, [[cx, cy], [cx + Math.cos(a) * 350, cy + Math.sin(a) * 350]], 5, "#6fb3a8"); }
  c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, cx, cy, 24, 24), COL.steel, 6); shape(c, () => ell(c, cx - 5, cy - 6, 7, 7), WHITE, 0);
};

// flow.a5 · find the family's water filter and read how it works
const flow_a5 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = FLOOR; c.fillRect(0, 960, D, D - 960); line(c, [[0, 960], [D, 960]], 6);
  // the purifier on the wall: a box, a label with four stages, a tap
  shape(c, () => rrect(c, 280, 130, 40, 130, 8), COL.steel);
  shadow(c, 300, 670, 190, 16);
  shape(c, () => rrect(c, 130, 250, 320, 400, 28), WHITE); shade(c, () => rrect(c, 130, 250, 320, 400, 28), "#cdd6de", -36, 0, 0.7);
  shape(c, () => rrect(c, 130, 250, 320, 62, 28), COL.blue);
  shape(c, () => rrect(c, 165, 330, 250, 230, 10), PAPER, 4);
  for (let i = 0; i < 4; i++) { const y = 352 + i * 52; shape(c, () => ell(c, 196, y + 16, 16, 16), COL.teal, 4); write(c, String(i + 1), 189, y + 5, 22, WHITE, 4); line(c, [[228, y + 16], [392, y + 16]], 7, "rgba(43,35,64,0.5)"); }
  shape(c, () => rrect(c, 268, 650, 44, 36, 8), COL.steel); shape(c, () => rrect(c, 280, 676, 20, 30, 6), COL.steelDk);
  drop(c, 290, 736, 0.8);
  person(c, 690, 1010, 900, { adult: true, reachL: [415, 445] });
  person(c, 950, 1010, 640, {});
};

// flow.p1 · a comic of twelve panels: a worm, a mosquito, a person, and a pair of scissors where the journey is cut
const flow_p1 = (c: Ctx) => {
  tableBg(c);
  shadow(c, 560, 975, 450, 20);
  shape(c, () => rrect(c, 90, 100, 900, 870, 12), PAPER);
  const pw = 200, ph = 250, gap = 20, x0 = 110, y0 = 135;
  for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) {
    const px = x0 + q * (pw + gap) + 10, py = y0 + r * (ph + gap) + 10, n = r * 4 + q + 1, mx = px + pw / 2, my = py + ph / 2 + 18;
    shape(c, () => rrect(c, px, py, pw, ph, 6), "#fffdf7", 4);
    write(c, String(n), px + 10, py + 8, 26, INK, 4);
    if (n === 1) thread(c, [[mx - 70, my + 30], [mx - 30, my - 30], [mx + 20, my + 40], [mx + 70, my - 20]], 14, "#f3ead6");
    if (n === 2) mosquito(c, mx + 20, my - 20, 0.34, 1);
    if (n === 3) person(c, mx, py + ph - 14, 175, {});
    if (n === 4) copepod(c, mx, my, 0.2);
    if (n === 5) glass(c, mx, py + ph - 40, 80, 100, 0.6);
    if (n === 6) {
      [[-52, 34], [-52, -34]].forEach(([dx, dy]) => { c.beginPath(); c.arc(mx + dx, my + dy, 14, 0, PI * 2); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); });
      line(c, [[mx - 40, my + 30], [mx + 50, my - 18]], 8, RED); line(c, [[mx - 40, my - 30], [mx + 50, my + 18]], 8, RED);
      for (let yy = my - 100; yy < my + 100; yy += 30) line(c, [[mx + 78, yy], [mx + 78, yy + 16]], 5, RED);
    }
  }
};

// term.7 · a copepod, drawn large, seen from above
const term_7 = (c: Ctx) => {
  ground(c, BG);
  shape(c, () => ell(c, 540, 540, 480, 480), "#dcebf5", 8);
  [[250, 300, 22], [820, 270, 16], [800, 800, 26], [270, 790, 14], [880, 540, 12]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.6)", 3));
  copepod(c, 540, 560, 1.0);
};

// term.2 · larvae hang head down from the surface of the water in a bowl
const term_2 = (c: Ctx) => {
  ground(c, BG);
  shadow(c, 560, 925, 400, 30);
  const outer = () => { c.moveTo(110, 380); c.bezierCurveTo(120, 980, 960, 980, 970, 380); c.closePath(); };
  const inner = () => { c.moveTo(150, 380); c.bezierCurveTo(158, 930, 922, 930, 930, 380); c.closePath(); };
  shape(c, outer, COL.steel); shade(c, outer, COL.steelDk, -40, 0, 0.6);
  shape(c, inner, COL.steelIn, 5);
  c.save(); c.beginPath(); inner(); c.clip(); c.fillStyle = COL.water; c.fillRect(0, 520, D, 600); c.restore();
  shape(c, inner, "rgba(0,0,0,0)", 5);
  line(c, [[156, 522], [924, 522]], 6, COL.drop);
  shape(c, () => rrect(c, 96, 360, 888, 34, 14), COL.steel);
  wrigglersAt(c, 524, [280, 410, 540, 670, 800], 2.2);
};

export const ic_microorganismsParasitesL4 = cards("sci.microorganisms.parasites.L4", [
  setup_e1_0, setup_e1_1, setup_e1_2, setup_e1_3, setup_e2_0, setup_e2_1, setup_e2_2, setup_e2_3,
  flow_e1, flow_e2, flow_a1, flow_a3, flow_a2, flow_a4, flow_a5, flow_p1, term_7, term_2,
]);
