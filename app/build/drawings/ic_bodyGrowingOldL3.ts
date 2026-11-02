import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, D, arrow, cards, ell, ground, line, polyP, rrect, shade, shadow, shape, shine, seed, leaf, write, rnd } from "./flatKit";

// sci.body.growing-old.L3 · picture cards for the intro, summary, activities, experiments, terms and
// explanations. Flat DeepKids look. Same child (orange shirt) and grown-up (blue) as the set-up cards.
// Order of the cards is the order of CARDS at the bottom.

const PI = Math.PI;
type K = "baby" | "child" | "teen" | "adult" | "elder";
const HAIRW = "#f1eee8", PAPER = "#fff6e0", WOODT = "#e7b363";
const SK = (k: K) => (k === "baby" || k === "child" ? [SKIN.child, SKIN.childDk] : [SKIN.adult, SKIN.adultDk]);
const CL = (k: K, f: boolean): string[] =>
  k === "baby" ? ["#ffd34d", "#e0b22d"] : k === "child" ? [CLOTH.child, CLOTH.childDk] : k === "teen" ? ["#3fb1a8", "#2a8a83"]
    : k === "adult" ? (f ? ["#8b6cc9", "#6a4fa5"] : [CLOTH.adult, CLOTH.adultDk]) : f ? ["#d9578a", "#b03c6c"] : ["#f7f3e8", "#d8cfb8"];
const HR: Record<K, number> = { baby: 0.135, child: 0.1, teen: 0.085, adult: 0.075, elder: 0.075 };
const TW: Record<K, number> = { baby: 0.3, child: 0.24, teen: 0.21, adult: 0.2, elder: 0.2 };
const LF: Record<K, number> = { baby: 0.3, child: 0.4, teen: 0.45, adult: 0.46, elder: 0.44 };

const limb = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string, lw = 4) => shape(c, () => ell(c, x, y, r, r), col, lw);

// a round friendly face, front view. (x, y) is the middle of the head, r its radius.
const head = (c: Ctx, x: number, y: number, r: number, k: K, f = false, glasses = false) => {
  const [sk, dk] = SK(k), hc = k === "elder" ? HAIRW : CLOTH.hair;
  if (f && (k === "elder" || k === "adult")) shape(c, () => ell(c, x, y - r * 1.2, r * 0.42, r * 0.34), hc, 5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.98, y + r * 0.12, r * 0.14, r * 0.22), sk, 4);
  shape(c, () => ell(c, x, y, r, r * 1.05), sk);
  if (k === "baby") shape(c, () => ell(c, x, y - r * 1.02, r * 0.26, r * 0.15), hc, 4);
  else shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, hc, 5);
  if (k === "child") shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), hc, 4);
  const er = k === "baby" ? 0.12 : 0.09;
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.12, r * er, r * (er + 0.03)), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.12, r * er, r * (er + 0.03)), INK, 0);
  if (k === "elder") {
    line(c, [[x - r * 0.45, y - r * 0.42], [x, y - r * 0.5], [x + r * 0.45, y - r * 0.42]], 3, dk);
    line(c, [[x - r * 0.62, y + r * 0.32], [x - r * 0.55, y + r * 0.5]], 3, dk); line(c, [[x + r * 0.62, y + r * 0.32], [x + r * 0.55, y + r * 0.5]], 3, dk);
    if (!f) shape(c, () => ell(c, x, y + r * 0.32, r * 0.42, r * 0.09), hc, 3);
  }
  c.beginPath(); c.arc(x, y + r * 0.36, r * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  if (f && (k === "elder" || k === "adult")) dot(c, x, y - r * 0.32, r * 0.06, RED, 0);
  if (glasses) { for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.4, y + r * 0.12, r * 0.3, r * 0.3), "rgba(255,255,255,0.35)", 4); line(c, [[x - r * 0.1, y + r * 0.1], [x + r * 0.1, y + r * 0.1]], 4); }
};
// a standing person, feet at (x, y), height h
const fig = (c: Ctx, x: number, y: number, h: number, k: K, f = false, stick = false) => {
  const [sk] = SK(k), [cl, cd] = CL(k, f), r = h * HR[k], hip = y - h * LF[k], hy = y - h + r * 1.05, top = hy + r * 1.05, w = h * TW[k], long = f && (k === "adult" || k === "elder");
  shadow(c, x + h * 0.06, y + 4, h * 0.2, h * 0.025);
  c.save(); if (k === "elder") { c.translate(x, y); c.rotate(0.07); c.translate(-x, -y); }
  if (long) for (const s of [-1, 1]) shape(c, () => ell(c, x + s * w * 0.22, y - 6, h * 0.05, h * 0.025), sk, 4);
  else for (const s of [-1, 1]) limb(c, [[x + s * w * 0.25, hip], [x + s * w * 0.28, y - 4]], h * 0.075, "#6b5a8c");
  const bot = long ? y - h * 0.05 : hip + h * 0.03, tp = () => rrect(c, x - w / 2, top - h * 0.01, w, bot - top + h * 0.01, w * 0.28);
  shape(c, tp, cl); shade(c, tp, cd, w * 0.25, 0);
  const sh = top + h * 0.04, al = h * (k === "baby" ? 0.12 : 0.15);
  limb(c, [[x - w / 2 + 2, sh], [x - w / 2 - h * 0.02, sh + al]], h * 0.055, cl); dot(c, x - w / 2 - h * 0.02, sh + al, h * 0.033, sk, 4);
  if (stick) {
    const sx = x + w / 2 + h * 0.1, sy = sh + al;
    line(c, [[sx, y], [sx, sy - 14]], 14, INK); line(c, [[sx, y], [sx, sy - 14]], 6, COL.brown);
    limb(c, [[x + w / 2 - 2, sh], [sx, sy]], h * 0.055, cl); dot(c, sx, sy, h * 0.033, sk, 4);
  } else { limb(c, [[x + w / 2 - 2, sh], [x + w / 2 + h * 0.02, sh + al]], h * 0.055, cl); dot(c, x + w / 2 + h * 0.02, sh + al, h * 0.033, sk, 4); }
  head(c, x + (k === "elder" ? r * 0.3 : 0), hy, r, k, f);
  c.restore();
};
const crawl = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x, y + 4, 100 * s, 10 * s);
  for (const dx of [-1, 1]) limb(c, [[x - 48 * s + dx * 14 * s, y - 52 * s], [x - 62 * s + dx * 22 * s, y - 6 * s]], 22 * s, "#6b5a8c");
  limb(c, [[x + 46 * s, y - 50 * s], [x + 60 * s, y - 6 * s]], 20 * s, "#ffd34d");
  shape(c, () => ell(c, x - 6 * s, y - 70 * s, 76 * s, 44 * s), "#ffd34d"); shade(c, () => ell(c, x - 6 * s, y - 70 * s, 76 * s, 44 * s), "#e0b22d", 12 * s, 14 * s);
  head(c, x + 82 * s, y - 100 * s, 40 * s, "baby");
};
// a shoulders-and-head person (front view), head middle (x, y); covered below by a table
const bust = (c: Ctx, x: number, y: number, r: number, k: K, f = false, glasses = false) => {
  const [sk] = SK(k), [cl, cd] = CL(k, f), b = () => rrect(c, x - r * 1.6, y + r * 1.1, r * 3.2, r * 3.4, r * 0.9);
  shape(c, () => rrect(c, x - r * 0.25, y + r * 0.8, r * 0.5, r * 0.6, 6), sk, 5);
  shape(c, b, cl); shade(c, b, cd, r * 0.35, 0); head(c, x, y, r, k, f, glasses);
};
// a hand, back of the hand towards us, fingers up. (x, y) the middle of the palm; s = size
const handUp = (c: Ctx, x: number, y: number, s: number, k: K, old = false, ringOn = false) => {
  const [sk, dk] = SK(k), F: number[][] = [[-33, 62], [-11, 76], [11, 70], [33, 54]];
  c.save(); c.translate(x + 44 * s, y + 6 * s); c.rotate(0.95); shape(c, () => rrect(c, -10.5 * s, -50 * s, 21 * s, 70 * s, 10 * s), sk, 5); c.restore();
  F.forEach(([fx, len], i) => {
    shape(c, () => rrect(c, x + fx * s - 10.5 * s, y - 20 * s - len * s, 21 * s, len * s + 36 * s, 10 * s), sk, 5);
    shape(c, () => ell(c, x + fx * s, y - 20 * s - len * s + 12 * s, 6.5 * s, 8 * s), "#e8b99a", 0);
    if (old) { for (const t of [0.3, 0.55]) line(c, [[x + fx * s - 7 * s, y - 20 * s - len * s * t], [x + fx * s + 7 * s, y - 20 * s - len * s * t]], 2.5 * s, dk); }
    if (ringOn && i === 2) shape(c, () => rrect(c, x + fx * s - 12.5 * s, y - 20 * s - 16 * s, 25 * s, 9 * s, 4 * s), COL.steel, 3.5);
  });
  shape(c, () => ell(c, x, y, 46 * s, 52 * s), sk, 5);
  if (old) { for (const [u, v] of [[-18, -10], [10, 14], [-4, 26]]) dot(c, x + u * s, y + v * s, 4.5 * s, dk, 0); line(c, [[x - 28 * s, y - 24 * s], [x - 8 * s, y - 20 * s]], 2.5 * s, dk); line(c, [[x + 8 * s, y - 26 * s], [x + 28 * s, y - 20 * s]], 2.5 * s, dk); }
};
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, D + 40, D - y + 40, 0), WOODT, 6); shade(c, () => rrect(c, -20, y, D + 40, 30, 0), COL.woodDk, 0, 22, 0.6);
  for (const g of [0.35, 0.62, 0.85]) line(c, [[0, y + (D - y) * g], [D, y + (D - y) * g]], 3, COL.woodDk);
};
// the profile of a person facing right: head middle (x, y); the arm reaches to hand (hx, hy)
const prof = (c: Ctx, x: number, y: number, r: number, k: K, f: boolean, hx: number, hy: number, bh = 3.4) => {
  const [sk] = SK(k), [cl, cd] = CL(k, f), hc = k === "elder" ? HAIRW : CLOTH.hair;
  const b = () => rrect(c, x - r * 1.3, y + r * 1.1, r * 2.1, r * bh, r * 0.8);
  shape(c, b, cl); shade(c, b, cd, r * 0.3, 0);
  if (f) shape(c, () => ell(c, x - r * 0.95, y - r * 0.4, r * 0.5, r * 0.45), hc, 5);
  const hp = () => ell(c, x, y, r, r * 1.05);
  shape(c, hp, sk);
  c.save(); c.beginPath(); hp(); c.clip(); shape(c, () => polyP(c, [[x - r * 2, y - r * 2], [x + r * 0.2, y - r * 2], [x + r * 0.75, y - r * 0.55], [x + r * 0.15, y - r * 0.3], [x - r * 0.1, y + r * 0.35], [x - r * 2, y + r * 0.9]]), hc, 0); c.restore();
  c.beginPath(); hp(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, x + r * 1.0, y + r * 0.2, r * 0.15, r * 0.18), sk, 4);
  shape(c, () => ell(c, x + r * 0.5, y, r * 0.08, r * 0.11), INK, 0);
  shape(c, () => ell(c, x - r * 0.05, y + r * 0.1, r * 0.13, r * 0.2), sk, 3);
  line(c, [[x + r * 0.45, y + r * 0.55], [x + r * 0.75, y + r * 0.55]], 4);
  const sx = x - r * 0.1, sy = y + r * 1.9, ex = (sx + hx) / 2, ey = Math.max(sy, hy) + r * 0.7;
  limb(c, [[sx, sy], [ex, ey], [hx, hy]], r * 0.55, cl); dot(c, hx, hy, r * 0.3, sk, 4);
};
const phone = (c: Ctx, x: number, y: number, s = 1) => { shape(c, () => rrect(c, x - 38 * s, y - 66 * s, 76 * s, 132 * s, 14 * s), INK, 0); shape(c, () => rrect(c, x - 31 * s, y - 56 * s, 62 * s, 112 * s, 8 * s), "#8fd0f0", 3); line(c, [[x - 18 * s, y - 20 * s], [x + 18 * s, y - 20 * s]], 5 * s, WHITE); line(c, [[x - 18 * s, y + 4 * s], [x + 10 * s, y + 4 * s]], 5 * s, WHITE); line(c, [[x - 18 * s, y + 28 * s], [x + 18 * s, y + 28 * s]], 5 * s, WHITE); };
const card = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 8, y + h / 2 + 6, w * 0.55, 10); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 5); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) dot(c, x - w * 0.28 + j * w * 0.28, y - h * 0.3 + i * h * 0.2, 2.6, INK, 0); };
const portrait = (c: Ctx, x: number, y: number, R: number, k: K, f = false, bg: string = COL.sky, old = false) => {
  const [cl] = CL(k, f);
  c.save(); c.beginPath(); ell(c, x, y, R, R); c.clip(); c.fillStyle = bg; c.fillRect(x - R, y - R, R * 2, R * 2);
  const r = R * (k === "baby" ? 0.5 : k === "child" ? 0.44 : 0.4), hy = y - R * 0.1;
  shape(c, () => rrect(c, x - r * 1.5, hy + r * 1.15, r * 3, R * 1.2, r * 0.8), cl); head(c, x, hy, r, k, f);
  if (old) { c.fillStyle = "rgba(140,95,45,0.38)"; c.fillRect(x - R, y - R, R * 2, R * 2); }
  c.restore();
  c.beginPath(); ell(c, x, y, R, R); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
};
const bodyDraw = (c: Ctx, cx: number, top: number, s: number, fill: string) => {
  const shapes: (() => void)[] = [() => ell(c, cx, top + 105 * s, 100 * s, 105 * s), () => rrect(c, cx - 225 * s, top + 225 * s, 100 * s, 330 * s, 40 * s), () => rrect(c, cx + 125 * s, top + 225 * s, 100 * s, 330 * s, 40 * s),
    () => rrect(c, cx - 130 * s, top + 520 * s, 120 * s, 330 * s, 40 * s), () => rrect(c, cx + 10 * s, top + 520 * s, 120 * s, 330 * s, 40 * s), () => rrect(c, cx - 140 * s, top + 215 * s, 280 * s, 330 * s, 40 * s)];
  shapes.forEach((p) => shape(c, p, fill));
};
const bodyOutline = (c: Ctx, cx: number, top: number, s: number) => {
  for (const p of [() => ell(c, cx, top + 105 * s, 100 * s, 105 * s), () => rrect(c, cx - 225 * s, top + 225 * s, 100 * s, 330 * s, 40 * s), () => rrect(c, cx + 125 * s, top + 225 * s, 100 * s, 330 * s, 40 * s), () => rrect(c, cx - 130 * s, top + 520 * s, 120 * s, 330 * s, 40 * s), () => rrect(c, cx + 10 * s, top + 520 * s, 120 * s, 330 * s, 40 * s), () => rrect(c, cx - 140 * s, top + 215 * s, 280 * s, 330 * s, 40 * s)]) { c.beginPath(); p(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); }
};
const clipBody = (c: Ctx, cx: number, top: number, s: number) => {
  c.beginPath();
  ell(c, cx, top + 105 * s, 100 * s, 105 * s); c.moveTo(0, 0);
  const R = (x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.rect(x, y, w, h); };
  c.ellipse(cx, top + 105 * s, 100 * s, 105 * s, 0, 0, PI * 2);
  R(cx - 225 * s, top + 225 * s, 100 * s, 330 * s); R(cx + 125 * s, top + 225 * s, 100 * s, 330 * s); R(cx - 140 * s, top + 215 * s, 280 * s, 330 * s);
  R(cx - 130 * s, top + 520 * s, 120 * s, 330 * s); R(cx + 10 * s, top + 520 * s, 120 * s, 330 * s);
  c.clip();
};

// ---------------------------------------------------------------- the cards
// 0 intro: a grandmother and a child on a swing compare the backs of their hands
const intro = (c: Ctx) => {
  ground(c);
  for (const x of [150, 930]) { line(c, [[x, 40], [x, 790]], 14, INK); line(c, [[x, 40], [x, 790]], 6, COL.steelDk); }
  line(c, [[100, 40], [980, 40]], 22, INK); line(c, [[100, 40], [980, 40]], 12, COL.woodDk);
  bust(c, 340, 470, 105, "elder", true); bust(c, 760, 540, 82, "child");
  limb(c, [[470, 620], [510, 500], [520, 430]], 52, CL("elder", true)[0]); limb(c, [[700, 680], [660, 560], [640, 500]], 42, CL("child", false)[0]);
  handUp(c, 520, 360, 1.15, "elder", true, true); handUp(c, 640, 440, 0.9, "child");
  shape(c, () => rrect(c, 80, 790, 920, 60, 14), WOODT, 6); shade(c, () => rrect(c, 80, 790, 920, 60, 14), COL.woodDk, 0, 26, 0.6);
  shadow(c, 540, 880, 440, 24);
};
// 1 summary: a child reads the phone close, a grandmother holds it far away
const summary = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 40, 1000, 480, 40), "#f6efe0", 5); shape(c, () => rrect(c, 40, 560, 1000, 480, 40), "#f6efe0", 5);
  prof(c, 250, 220, 85, "child", false, 400, 320, 2.2); phone(c, 440, 300, 1.05);
  prof(c, 250, 740, 85, "elder", true, 640, 780, 2.2); phone(c, 690, 770, 1.05);
  line(c, [[345, 460], [415, 460]], 6, RED); line(c, [[345, 445], [345, 475]], 6, RED); line(c, [[415, 445], [415, 475]], 6, RED);
  line(c, [[345, 980], [705, 980]], 6, RED); line(c, [[345, 965], [345, 995]], 6, RED); line(c, [[705, 965], [705, 995]], 6, RED);
};
// 2 e1 snap-back skin test
const e1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 640, 600, 220, 40), CL("child", false)[0]); shade(c, () => rrect(c, -20, 640, 600, 220, 40), CL("child", false)[1], 0, 40, 0.6);
  c.save(); c.translate(560, 750); c.rotate(PI / 2); handUp(c, 0, 0, 2.7, "child"); c.restore();
  // the pinched fold of skin
  shape(c, () => polyP(c, [[480, 640], [520, 560], [560, 640]]), SKIN.child, 5);
  shape(c, () => rrect(c, 495, 575, 20, 70, 0), SKIN.child, 0);
  shape(c, () => rrect(c, 410, 20, 230, 150, 20), CL("adult", false)[0], 6);
  shape(c, () => ell(c, 525, 230, 125, 105), SKIN.adult, 6);
  limb(c, [[470, 270], [490, 440], [503, 568]], 46, SKIN.adult); limb(c, [[590, 270], [560, 440], [538, 566]], 46, SKIN.adult);
  dot(c, 503, 572, 26, SKIN.adult, 5); dot(c, 538, 570, 24, SKIN.adult, 5);
  shape(c, () => ell(c, 850, 250, 120, 120), WHITE, 7); shape(c, () => ell(c, 850, 250, 90, 90), COL.paper, 3);
  shape(c, () => rrect(c, 835, 110, 30, 26, 6), COL.steelDk, 5); line(c, [[850, 250], [850, 195]], 8); line(c, [[850, 250], [892, 270]], 6);
  write(c, "3", 825, 285, 36, INK, 6);
  arrow(c, [[740, 520], [740, 620]]);
};
// 3 e2 near point: card at arm's length, then brought closer until the print blurs; measured with a ruler
const e2 = (c: Ctx) => {
  ground(c);
  prof(c, 230, 330, 95, "child", false, 470, 440);
  c.globalAlpha = 0.35; line(c, [[270, 470], [520, 420], [720, 440]], 40, CL("child", false)[0]); dot(c, 720, 440, 28, SKIN.child, 4); card(c, 760, 420, 100, 150); c.globalAlpha = 1;
  card(c, 510, 440, 100, 150);
  arrow(c, [[780, 270], [560, 270]]);
  table(c, 700);
  shadow(c, 560, 770, 330, 14);
  shape(c, () => rrect(c, 230, 715, 640, 70, 6), COL.wood, 5);
  for (let i = 0; i <= 32; i++) { const x = 250 + i * 19, hh = i % 5 === 0 ? 30 : 16; line(c, [[x, 715], [x, 715 + hh]], i % 5 === 0 ? 4 : 2.5); }
  line(c, [[330, 640], [330, 700]], 7, RED); line(c, [[460, 640], [460, 700]], 7, RED); line(c, [[330, 670], [460, 670]], 7, RED);
};
// 4 e3 high sound test: a beeping speaker; the child and the adult hear it and raise a hand, the grandmother does not
const e3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 380, 150, 20);
  shape(c, () => rrect(c, 440, 70, 200, 290, 30), COL.steel); shade(c, () => rrect(c, 440, 70, 200, 290, 30), COL.steelDk, 40, 0, 0.5);
  dot(c, 540, 150, 40, COL.black, 5); dot(c, 540, 270, 62, COL.black, 5); dot(c, 540, 270, 28, COL.steelDk, 4);
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const rr = 40 + i * 32; c.beginPath(); c.arc(540 + s * 120, 215, rr, s > 0 ? -0.7 : PI - 0.7 + 0.0, s > 0 ? 0.7 : PI + 0.7); c.strokeStyle = COL.orange; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  bust(c, 190, 590, 72, "child"); bust(c, 540, 580, 78, "adult", true); bust(c, 890, 590, 78, "elder", true);
  limb(c, [[290, 700], [320, 590], [320, 520]], 36, CL("child", false)[0]); handUp(c, 322, 455, 0.7, "child");
  limb(c, [[640, 710], [690, 600], [690, 520]], 38, CL("adult", true)[0]); handUp(c, 692, 452, 0.75, "adult");
  table(c, 800);
};
// 5 a1 hands across time
const a1 = (c: Ctx) => {
  ground(c);
  table(c, 740);
  const H: [number, number, K, number, boolean][] = [[130, 0.55, "baby", 0, false], [330, 0.95, "child", 0, false], [540, 1.35, "teen", 0, false], [760, 1.6, "adult", 0, false], [940, 1.5, "elder", 0, true]];
  H.forEach(([x, s, k, , old]) => {
    const cy = 760 - 100 * s;
    shape(c, () => rrect(c, x - 52 * s, cy + 30 * s, 104 * s, 130 * s, 10), CL(k, k === "elder")[0], 5);
    handUp(c, x, cy, s, k, old, old);
  });
};
// 6 a2 interview an elder
const a2 = (c: Ctx) => {
  ground(c);
  bust(c, 310, 540, 100, "elder", true); bust(c, 770, 600, 82, "child");
  shape(c, () => ell(c, 330, 190, 250, 165), WHITE, 6); shape(c, () => polyP(c, [[290, 340], [360, 340], [320, 410]]), WHITE, 6); shape(c, () => rrect(c, 285, 322, 80, 26, 0), WHITE, 0);
  fig(c, 340, 320, 250, "child");
  shape(c, () => rrect(c, 620, 770, 300, 120, 12), PAPER, 6); line(c, [[640, 800], [900, 800]], 4, COL.grey); line(c, [[640, 830], [900, 830]], 4, COL.grey); line(c, [[640, 860], [820, 860]], 4, COL.grey);
  for (let i = 0; i < 6; i++) dot(c, 622 + 0, 790 + i * 18, 4, INK, 0);
  limb(c, [[870, 720], [860, 790], [830, 800]], 36, CL("child", false)[0]); dot(c, 828, 806, 28, SKIN.child, 4);
  line(c, [[855, 780], [930, 700]], 12, INK); line(c, [[855, 780], [930, 700]], 5, COL.yellow);
  table(c, 900);
};
// 7 a3 life stage parade
const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 840, D + 40, 260, 0), "#c9dfa0", 6);
  crawl(c, 120, 850, 1.1);
  fig(c, 300, 850, 340, "child"); fig(c, 490, 850, 460, "teen"); fig(c, 690, 850, 540, "adult"); fig(c, 880, 850, 500, "elder", true, true);
  arrow(c, [[120, 120], [960, 120]], RED, 12);
};
// 8 a4 socks on the hands
const a4 = (c: Ctx) => {
  ground(c);
  bust(c, 540, 450, 110, "child", false, true);
  for (const s of [-1, 1]) { const g = () => { for (const q of [0.35, 0.65]) line(c, [[540 + s * 120, 400 + q * 0], [0, 0]], 0); }; void g; shape(c, () => ell(c, 540 + s * 85, 465, 28, 18), "rgba(255,255,255,0.8)", 0); line(c, [[540 + s * 60, 440], [540 + s * 100, 480]], 5, WHITE); }
  for (const s of [-1, 1]) {
    const sx = 540 + s * 190, shx = 540 + s * 170;
    limb(c, [[shx, 670], [sx + s * 40, 600], [sx + s * 80, 540]], 48, CL("child", false)[0]);
    const sock = () => rrect(c, sx + s * 80 - 70, 340, 140, 200, 50);
    shape(c, sock, COL.teal); c.save(); c.beginPath(); sock(); c.clip(); for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? COL.yellow : COL.red; c.fillRect(sx + s * 80 - 80, 360 + i * 36, 160, 18); } c.restore(); c.beginPath(); sock(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
    shape(c, () => rrect(c, sx + s * 80 - 60, 515, 120, 40, 12), WHITE, 5);
  }
  table(c, 830);
  dot(c, 480, 880, 34, COL.yellow, 5); dot(c, 600, 900, 18, COL.steel, 5); line(c, [[690, 860], [800, 920]], 12, INK); line(c, [[690, 860], [800, 920]], 5, COL.red);
};
// 9 a5 the sticky-note body
const a5 = (c: Ctx) => {
  ground(c);
  bodyDraw(c, 540, 60, 1.0, PAPER);
  c.save(); clipBody(c, 540, 60, 1.0);
  const r = rnd(5), cols = [COL.yellow, COL.pink, "#9ccfe8"];
  for (let gx = 280; gx < 800; gx += 62) for (let gy = 70; gy < 920; gy += 62) {
    const u = r(), col = u < 0.25 ? cols[0] : u < 0.9 ? cols[1] : cols[2];
    shape(c, () => rrect(c, gx, gy, 56, 56, 4), col, 3);
  }
  c.restore();
  bodyOutline(c, 540, 60, 1.0);
  // an old note leaves, a new one arrives
  c.save(); c.translate(150, 520); c.rotate(-0.4); shape(c, () => rrect(c, -50, -50, 100, 100, 6), COL.pink, 6); c.restore();
  arrow(c, [[250, 600], [330, 650]], RED, 10);
  c.save(); c.translate(930, 320); c.rotate(0.3); shape(c, () => rrect(c, -50, -50, 100, 100, 6), COL.yellow, 6); c.restore();
  arrow(c, [[840, 380], [760, 430]], RED, 10);
};
// 10 a6 my life line
const a6 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 800, 480, 24);
  shape(c, () => rrect(c, 30, 230, 1020, 560, 14), PAPER, 6);
  const P: [number, K, boolean, string, string][] = [[140, "baby", false, "0", COL.sky], [340, "child", false, "6", "#f5d9a8"], [540, "teen", false, "13", COL.sky], [740, "adult", true, "35", "#f5d9a8"], [930, "elder", true, "72", COL.sky]];
  line(c, [[70, 600], [1010, 600]], 10, INK); line(c, [[70, 600], [1010, 600]], 4, COL.teal);
  P.forEach(([x, k, f, n, bg]) => {
    portrait(c, x, 420, k === "baby" ? 78 : 88, k, f, bg); line(c, [[x, 520], [x, 600]], 5); dot(c, x, 600, 14, COL.red, 4);
    write(c, n, x - (n.length * 0.8 * 44) / 2, 640, 44, INK, 7);
  });
  arrow(c, [[70, 150], [1000, 150]], RED, 10);
};
// 11 p1 then and now book
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 860, 480, 30);
  shape(c, () => polyP(c, [[60, 260], [540, 300], [1020, 260], [1020, 830], [540, 870], [60, 830]]), COL.teal, 6);
  shape(c, () => polyP(c, [[90, 240], [540, 275], [540, 840], [90, 805]]), PAPER, 6); shape(c, () => polyP(c, [[1000, 240], [540, 275], [540, 840], [1000, 805]]), PAPER, 6);
  portrait(c, 310, 450, 150, "child", true, "#e7c89a", true); portrait(c, 770, 450, 150, "child", false, COL.sky);
  for (const [x, y] of [[190, 330], [430, 335], [650, 335], [890, 330]]) { c.save(); c.translate(x, y); c.rotate(x < 540 ? -0.7 : 0.7); shape(c, () => rrect(c, -34, -12, 68, 24, 3), "rgba(242,192,99,0.85)", 3); c.restore(); }
  for (const x of [150, 600]) for (let i = 0; i < 3; i++) line(c, [[x, 670 + i * 38], [x + (i === 2 ? 200 : 290), 670 + i * 38]], 6, COL.grey);
};
// 12 c1 an elder-friendly room
const c1 = (c: Ctx) => {
  ground(c, "#f3dcae");
  c.fillStyle = "#e7b363"; c.fillRect(0, 760, D, 320); c.beginPath(); c.moveTo(0, 760); c.lineTo(D, 760); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (const y of [850, 940, 1020]) line(c, [[0, y], [D, y]], 3, COL.woodDk);
  shape(c, () => rrect(c, 70, 140, 250, 300, 10), COL.sky, 8); line(c, [[195, 140], [195, 440]], 8); line(c, [[70, 290], [320, 290]], 8); dot(c, 130, 210, 34, COL.yellow, 5);
  for (const y of [490, 690]) shape(c, () => rrect(c, 340, y - 12, 60, 24, 4), COL.steelDk, 5);
  shape(c, () => rrect(c, 380, 450, 32, 290, 16), COL.steel, 6);
  shape(c, () => ell(c, 960, 745, 60, 16), COL.black, 5); line(c, [[960, 740], [960, 430]], 16, INK); line(c, [[960, 740], [960, 430]], 7, COL.steelDk);
  shape(c, () => polyP(c, [[890, 430], [1030, 430], [1000, 310], [920, 310]]), COL.yellow, 6);
  c.globalAlpha = 0.28; shape(c, () => polyP(c, [[890, 435], [1030, 435], [1080, 700], [840, 700]]), COL.yellow, 0); c.globalAlpha = 1;
  const X = 190;
  shadow(c, 580 + X, 790, 260, 24);
  shape(c, () => rrect(c, 430 + X, 380, 300, 340, 40), COL.red); shade(c, () => rrect(c, 430 + X, 380, 300, 340, 40), "#b83b2a", 40, 0, 0.45);
  bust(c, 580 + X, 480, 70, "elder", true);
  shape(c, () => rrect(c, 410 + X, 620, 340, 110, 26), COL.red); shade(c, () => rrect(c, 410 + X, 620, 340, 110, 26), "#b83b2a", 0, 40, 0.5);
  for (const x of [380 + X, 700 + X]) shape(c, () => rrect(c, x, 560, 80, 200, 30), COL.red);
  for (const x of [440 + X, 720 + X]) line(c, [[x, 730], [x, 770]], 16, INK);
};
// 13 c2 the easy-open jar
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 870, 250, 24);
  const jar = () => rrect(c, 380, 400, 320, 460, 50);
  shape(c, jar, COL.glass); c.save(); c.beginPath(); jar(); c.clip(); c.fillStyle = COL.leaf; c.fillRect(380, 520, 320, 340); c.fillStyle = COL.leafDk; c.globalAlpha = 0.5; c.fillRect(600, 520, 100, 340); c.restore(); c.globalAlpha = 1;
  for (const [x, y] of [[450, 600], [530, 700], [610, 620], [470, 780]]) shape(c, () => ell(c, x, y, 34, 22, 0.4), COL.green, 4);
  c.beginPath(); jar(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke(); shine(c, [[410, 440], [410, 700]], 9);
  shape(c, () => rrect(c, 360, 310, 360, 100, 20), COL.steel); shade(c, () => rrect(c, 360, 310, 360, 100, 20), COL.steelDk, 50, 0, 0.5);
  for (let x = 395; x < 700; x += 36) line(c, [[x, 325], [x, 395]], 4, COL.steelDk);
  c.save(); c.translate(280, 360); c.scale(1.6, 1.6);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), CL("elder", true)[0], 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, SKIN.adult, 6);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 38, -30 + k * 17, 40, 17, 8.5), SKIN.adult, 5);
  c.restore();
  { const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const a = PI * 1.15 + (i / 8) * PI * 0.7; pts.push([540 + Math.cos(a) * 250, 330 + Math.sin(a) * 140 - 40]); } arrow(c, pts, RED, 12); }
};
// ----- terms
const tree = (c: Ctx, x: number, y: number, s: number, old: boolean) => {
  shape(c, () => ell(c, x, y, 130 * s, 18 * s), COL.soil, 5);
  limb(c, [[x, y - 5 * s], [x - (old ? 14 : 0) * s, y - 110 * s], [x - (old ? 20 : 0) * s, y - 170 * s]], (old ? 44 : 34) * s, COL.brown);
  if (old) { limb(c, [[x - 18 * s, y - 120 * s], [x - 80 * s, y - 175 * s]], 18 * s, COL.brown); limb(c, [[x - 18 * s, y - 130 * s], [x + 50 * s, y - 190 * s]], 18 * s, COL.brown); }
  const blobs: number[][] = old ? [[-80, -190, 40], [50, -195, 38], [-20, -230, 34]] : [[-60, -200, 62], [50, -210, 66], [-5, -250, 72], [0, -190, 60]];
  blobs.forEach(([u, v, rr]) => shape(c, () => ell(c, x + u * s, y + v * s, rr * s, rr * s), old ? "#8fae4a" : COL.leaf, 5));
  if (!old) for (const [u, v] of [[-55, -180], [60, -200], [10, -135]]) shape(c, () => ell(c, x + u * s, y + v * s, 17 * s, 22 * s, 0.3), COL.orange, 4);
  if (old) for (const [u, v] of [[90, 4], [-80, 6], [30, 14]]) shape(c, () => ell(c, x + u * s, y + v * s, 13 * s, 8 * s, 0.4), COL.soilDk, 3);
};
const t0 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540;
  // seed in soil (top)
  shape(c, () => ell(c, cx, 250, 120, 26), COL.soil, 5); seed(c, cx, 215, 42, 0.4, false, "#b98a52", "#8a5e30");
  // sapling (right)
  shape(c, () => ell(c, 880, 600, 110, 22), COL.soil, 5); limb(c, [[880, 590], [880, 470]], 12, COL.leaf); leaf(c, 880, 490, 100, -0.5); leaf(c, 880, 520, 90, PI + 0.5);
  // tree with fruit (bottom)
  tree(c, cx, 960, 1.0, false);
  // old tree (left)
  tree(c, 200, 700, 0.95, true);
  const arc = (a0: number, a1: number) => { const pts: number[][] = []; for (let i = 0; i <= 4; i++) { const a = ((a0 + ((a1 - a0) * i) / 4) * PI) / 180; pts.push([cx + Math.cos(a) * 330, cy + Math.sin(a) * 330]); } arrow(c, pts, RED, 12); };
  arc(-62, -28); arc(28, 62); arc(118, 152); arc(208, 242);
};
const t1 = (c: Ctx) => {
  ground(c);
  const T = [840, 760, 680, 600, 520];
  T.forEach((y, i) => { shape(c, () => rrect(c, 40 + i * 195, y, 200, 1100 - y, 0), i % 2 ? "#e7b363" : "#f2c063", 6); });
  crawl(c, 140, 840, 1.25);
  fig(c, 430, 760, 270, "child"); fig(c, 625, 680, 340, "teen"); fig(c, 820, 600, 400, "adult"); fig(c, 950, 520, 340, "elder", true, true);
};
const t7 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 0);
  shape(c, () => rrect(c, 80, 820, 330, 300, 30), CL("child", false)[0], 6);
  handUp(c, 245, 700, 2.2, "child");
  c.restore();
  // zoom circle
  const zx = 700, zy = 410, R = 300;
  line(c, [[310, 640], [520, 640]], 0);
  c.save(); c.beginPath(); ell(c, zx, zy, R, R); c.clip(); c.fillStyle = "#f6d8c0"; c.fillRect(zx - R, zy - R, R * 2, R * 2);
  for (let j = 0; j < 7; j++) for (let i = 0; i < 6; i++) { const x = zx - R + 20 + i * 108 + (j % 2) * 54, y = zy - R + 30 + j * 92; shape(c, () => rrect(c, x, y, 100, 82, 28), "#f2a98d", 5); dot(c, x + 50, y + 41, 17, "#c0604a", 3); }
  c.restore();
  c.beginPath(); ell(c, zx, zy, R, R); c.lineWidth = 10; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 250, 640, 44, 44), "rgba(0,0,0,0)", 6);
  line(c, [[286, 612], [480, 220]], 6, INK); line(c, [[262, 676], [510, 640]], 6, INK);
};
const t9 = (c: Ctx) => {
  ground(c);
  const S: [number, string, number][] = [[250, COL.black, 14], [540, COL.grey, 4], [830, HAIRW, 0]];
  const r = rnd(3);
  S.forEach(([x, col, n]) => {
    const st = () => rrect(c, x - 80, 120, 160, 840, 80);
    shape(c, st, col, 8);
    if (n) { shape(c, st, col, 0); for (let i = 0; i < n * 5; i++) { const xx = x - 45 + r() * 90, yy = 190 + r() * 700; dot(c, xx, yy, 11, COL.orange, 3); } }
    if (col === HAIRW) shade(c, st, "#d9d4c8", 22, 0, 0.7);
  });
  S.forEach(([x, col]) => { c.beginPath(); rrect(c, x - 80, 120, 160, 840, 80); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); void col; });
};
const t10 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 720, 540, 170, 150), "#cde8f7", 7);
  shape(c, () => ell(c, 440, 540, 290, 290), WHITE, 8);
  c.beginPath(); c.arc(440, 540, 276, PI * 0.62, PI * 1.38); c.strokeStyle = RED; c.lineWidth = 18; c.stroke();
  shape(c, () => rrect(c, 650, 330, 50, 150, 14), COL.brown, 6); shape(c, () => rrect(c, 650, 600, 50, 150, 14), COL.brown, 6);
  shape(c, () => ell(c, 600, 540, 58, 108), "#a9d8f2", 7); shine(c, [[585, 480], [585, 520]], 8);
  for (const y of [300, 780]) arrow(c, [[1030, y], [800, y + (y < 540 ? 130 : -130)], [620, 540 + (y < 540 ? -40 : 40)], [230, 540]], RED, 8);
};
const t12 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 830, 470, 22);
  shape(c, () => polyP(c, [[40, 540], [1040, 540], [1010, 640], [1040, 740], [40, 740], [70, 640]]), COL.teal, 7); shade(c, () => polyP(c, [[40, 700], [1040, 700], [1040, 740], [40, 740]]), COL.tealDk, 0, 0, 0.7);
  for (let i = 0; i <= 5; i++) { const x = 120 + i * 165; line(c, [[x, 560], [x, 640]], 7, WHITE); write(c, String(i * 20), x - String(i * 20).length * 17, 665, 52, WHITE, 8); }
  crawl(c, 160, 530, 1.2); fig(c, 940, 540, 330, "elder", true, true);
  arrow(c, [[250, 190], [800, 190]], RED, 12);
};
const t14 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 480, 800, 560, 20), "#f2a98d", 7);
  const rows: [number, number, number, string][] = [[950, 52, 46, "#e98a6c"], [830, 58, 38, "#eea083"], [720, 62, 28, "#f3b79f"], [630, 64, 18, "#f8d6c6"]];
  rows.forEach(([y, rx, ry, col], ri) => { for (let x = 120; x < 830; x += rx * 2 + 8) { shape(c, () => ell(c, x + rx * 0.7, y, rx, ry), col, 5); if (ri < 3) dot(c, x + rx * 0.7, y, 12, "#b5503c", 3); } });
  const fl: [number, number, number][] = [[420, 300, 0.4], [220, 250, -0.3], [600, 190, 0.2]];
  fl.forEach(([x, y, a]) => { c.save(); c.translate(x, y); c.rotate(a); shape(c, () => rrect(c, -80, -12, 160, 24, 10), "#f8d6c6", 5); c.restore(); });
  arrow(c, [[560, 330], [630, 450]], RED, 10);
  arrow(c, [[960, 980], [960, 640]], RED, 14);
};
const t15 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 700, D + 40, 420, 0), COL.soil, 6); shade(c, () => rrect(c, -20, 700, D + 40, 60, 0), COL.soilDk, 0, 30, 0.7);
  shape(c, () => ell(c, 400, 700, 340, 50), COL.soil, 0);
  c.save(); c.translate(380, 670); c.rotate(-0.12);
  shape(c, () => { c.moveTo(-290, 0); c.quadraticCurveTo(-60, -170, 290, 0); c.quadraticCurveTo(-60, 120, -290, 0); c.closePath(); }, "#c0803c", 7);
  shade(c, () => { c.moveTo(-290, 0); c.quadraticCurveTo(-60, -170, 290, 0); c.quadraticCurveTo(-60, 120, -290, 0); c.closePath(); }, "#8e5a24", 0, 24, 0.5);
  line(c, [[-290, 0], [290, 0]], 6, "#8e5a24"); for (const u of [-150, -40, 80, 180]) { line(c, [[u, 0], [u + 40, -50]], 4, "#8e5a24"); line(c, [[u, 0], [u + 40, 45]], 4, "#8e5a24"); }
  c.restore();
  limb(c, [[800, 700], [800, 540]], 18, COL.leaf); leaf(c, 800, 560, 140, -0.6, COL.greenLt); leaf(c, 800, 580, 120, PI + 0.6, COL.greenLt);
};
// ----- explanations
const e_1 = (c: Ctx) => {
  ground(c); const gy = 960;
  shape(c, () => rrect(c, -20, gy, D + 40, 200, 0), "#c9dfa0", 6);
  fig(c, 340, gy, 700, "baby"); fig(c, 760, gy, 700, "adult");
  for (const [x, hh] of [[200, 700 * HR.baby * 2.1], [610, 700 * HR.adult * 2.1]] as [number, number][]) {
    const top = gy - 700; line(c, [[x, top], [x, top + hh]], 8, RED); line(c, [[x - 18, top], [x + 18, top]], 8, RED); line(c, [[x - 18, top + hh], [x + 18, top + hh]], 8, RED);
  }
};
const e_2 = (c: Ctx) => {
  ground(c);
  const fl = 1000; shape(c, () => rrect(c, -20, fl, D + 40, 100, 0), WOODT, 6);
  shape(c, () => rrect(c, 160, 40, 150, 960, 0), COL.wood, 7); shade(c, () => rrect(c, 160, 40, 150, 960, 0), COL.woodDk, 20, 0, 0.5);
  const hs = [140, 182, 224, 266, 308, 363, 448, 548, 633];
  hs.forEach((h, i) => { const y = fl - h; line(c, [[160, y], [300, y]], 7, INK); write(c, String(6 + i), 340, y - 14, 28, INK, 5); });
  arrow(c, [[640, fl - 363], [640, fl - 600]], RED, 14);
  line(c, [[570, fl - 363], [610, fl - 363]], 6, RED); line(c, [[570, fl - 600], [610, fl - 600]], 6, RED);
};
const e_4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 420, 1000, 620, 14), "#f2a98d", 7);
  shape(c, () => rrect(c, 40, 420, 1000, 70, 14), "#f3d7bf", 7);
  const root = (x: number, hair: string, pig: boolean) => {
    shape(c, () => rrect(c, x - 42, 470, 84, 280, 40), "#f6c2a6", 6);
    shape(c, () => rrect(c, x - 24, 70, 48, 700, 24), hair, 7);
    shape(c, () => ell(c, x, 770, 78, 66), "#f6c2a6", 6); shape(c, () => ell(c, x, 770, 36, 32), hair, 0);
    if (pig) for (const [u, v] of [[-52, 725], [52, 725], [-62, 775], [62, 775], [-40, 818], [40, 818], [-60, 700], [60, 700]]) dot(c, x + u, v, 15, COL.orange, 4);
    else for (const [u, v] of [[-52, 725], [52, 725], [-62, 775], [62, 775], [-40, 818], [40, 818]]) { c.setLineDash([8, 8]); c.beginPath(); ell(c, x + u, v, 14, 14); c.strokeStyle = COL.greyDk; c.lineWidth = 3; c.stroke(); c.setLineDash([]); }
  };
  root(270, COL.black, true); root(810, HAIRW, false);
};
const spring = (c: Ctx, x: number, y0: number, y1: number, amp: number, n: number, w: number) => {
  const pts: number[][] = []; for (let i = 0; i <= n * 8; i++) { const t = i / (n * 8); pts.push([x + Math.sin(t * n * 2 * PI) * amp, y0 + (y1 - y0) * t]); }
  line(c, pts, w + 6, INK); line(c, pts, w, COL.red);
};
const e_5 = (c: Ctx) => {
  ground(c);
  head(c, 290, 150, 80, "child"); head(c, 790, 150, 80, "elder", true);
  const block = (x: number, old: boolean) => {
    shape(c, () => rrect(c, x, old ? 365 : 330, 420, old ? 525 : 560, 10), "#f2a98d", 7);
    const top = () => { c.moveTo(x, 420); if (old) { for (let i = 0; i <= 6; i++) c.quadraticCurveTo(x + i * 70 - 35, 405 + (i % 2 ? -30 : 30), x + i * 70, 420 + 0); } else c.lineTo(x + 420, 420 - 0); c.lineTo(x + 420, 330); c.lineTo(x, 330); c.closePath(); };
    if (old) shape(c, () => { c.moveTo(x, 360); for (let i = 0; i < 6; i++) c.quadraticCurveTo(x + i * 70 + 35, i % 2 ? 372 : 322, x + (i + 1) * 70, 360); c.lineTo(x + 420, 420); c.lineTo(x, 420); c.closePath(); }, "#f3d7bf", 7);
    else shape(c, () => rrect(c, x, 330, 420, 130, 8), "#f3d7bf", 7);
    const n = old ? 3 : 6, amp = old ? 14 : 24, wd = old ? 8 : 12;
    for (let i = 0; i < (old ? 4 : 5); i++) spring(c, x + (old ? 70 : 60) + i * (old ? 94 : 76), old ? 440 : 480, 860, amp / (old ? 1 : 1.0), n, wd);
    void top;
  };
  block(70, false); block(590, true);
};
const e_7 = (c: Ctx) => {
  ground(c);
  bust(c, 330, 480, 105, "elder", true); bust(c, 780, 540, 84, "child");
  limb(c, [[440, 620], [490, 500], [470, 400]], 52, CL("elder", true)[0]);
  shape(c, () => rrect(c, 410, 215, 100, 200, 30), COL.glass, 6); shape(c, () => rrect(c, 410, 285, 100, 130, 24), COL.water, 0); shape(c, () => rrect(c, 410, 215, 100, 200, 30), "rgba(255,255,255,0.2)", 6); shape(c, () => rrect(c, 435, 175, 50, 45, 8), COL.teal, 6);
  shine(c, [[428, 300], [428, 390]], 8);
  shape(c, () => ell(c, 462, 380, 64, 40), SKIN.adult, 6); for (let i = 0; i < 3; i++) shape(c, () => ell(c, 410, 355 + i * 26, 22, 12), SKIN.adult, 5);
  limb(c, [[700, 700], [680, 600], [650, 500]], 42, CL("child", false)[0]); handUp(c, 650, 400, 0.78, "child");
  shape(c, () => ell(c, 800, 230, 110, 90), WHITE, 6); shape(c, () => polyP(c, [[740, 300], [790, 310], [715, 360]]), WHITE, 6); shape(c, () => ell(c, 800, 230, 104, 84), WHITE, 0);
  write(c, "3", 775, 195, 70, INK, 10);
  table(c, 800);
};
const e_9 = (c: Ctx) => {
  ground(c);
  bodyDraw(c, 540, 60, 1.0, "#cfe6f4");
  c.save(); clipBody(c, 540, 60, 1.0);
  const r = rnd(11);
  for (let i = 0; i < 160; i++) { const x = 260 + r() * 560, y = 70 + r() * 860; c.globalAlpha = 0.35; dot(c, x, y, 26, COL.yellow, 0); c.globalAlpha = 1; dot(c, x, y, 11, COL.yellow, 3); }
  c.restore();
  bodyOutline(c, 540, 60, 1.0);
  for (const s of [-1, 1]) { dot(c, 540 + s * 42, 160, 42, "rgba(143,195,234,0.9)", 7); dot(c, 540 + s * 42, 160, 18, "#5b5ab0", 4); }
  arrow(c, [[860, 460], [790, 520]], RED, 10); arrow(c, [[220, 460], [290, 520]], RED, 10);
};
const e_10 = (c: Ctx) => {
  ground(c);
  // shoelace
  const lace: number[][] = []; for (let i = 0; i <= 40; i++) lace.push([240 + Math.sin(i / 3) * 40, 200 + i * 16]);
  line(c, lace, 40, INK); line(c, lace, 28, COL.teal);
  for (const y of [180, 840]) shape(c, () => rrect(c, 212, y, 56, 110, 16), COL.yellow, 6);
  // genes: threads with caps that get shorter
  const T: [number, number][] = [[200, 120], [480, 70], [760, 22]];
  T.forEach(([y, cap]) => {
    const th: number[][] = []; for (let i = 0; i <= 30; i++) th.push([560 + i * 15, y + Math.sin(i / 2) * 22 + 60]);
    line(c, th, 36, INK); line(c, th, 24, COL.blue);
    shape(c, () => rrect(c, 540, y + 20, cap, 90, 20), COL.yellow, 6); shape(c, () => rrect(c, 1010 - cap, y + 20, cap, 90, 20), COL.yellow, 6);
  });
  arrow(c, [[760, 330], [760, 400]], RED, 10); arrow(c, [[760, 610], [760, 680]], RED, 10);
};
const e_13 = (c: Ctx) => {
  ground(c);
  const gy = 980;
  shape(c, () => rrect(c, -20, gy, D + 40, 200, 0), "#c9dfa0", 6);
  shape(c, () => rrect(c, 90, gy - 290, 230, 290, 14), COL.teal, 7); shade(c, () => rrect(c, 90, gy - 290, 230, 290, 14), COL.tealDk, 50, 0, 0.5);
  shape(c, () => rrect(c, 390, gy - 640, 230, 640, 14), COL.green, 7); shade(c, () => rrect(c, 390, gy - 640, 230, 640, 14), COL.greenDk, 50, 0, 0.5);
  write(c, "32", 155, gy - 380, 70, INK, 10); write(c, "70", 455, gy - 730, 70, INK, 10);
  // a tap with a water drop and a vaccine vial
  line(c, [[740, 360], [740, 480], [900, 480]], 46, INK); line(c, [[740, 360], [740, 480], [900, 480]], 32, COL.steel);
  shape(c, () => rrect(c, 700, 330, 80, 30, 8), COL.red, 6);
  shape(c, () => rrect(c, 878, 470, 44, 60, 8), COL.steelDk, 6);
  shape(c, () => { c.moveTo(900, 570); c.quadraticCurveTo(870, 630, 900, 650); c.quadraticCurveTo(930, 630, 900, 570); }, COL.water, 5);
  shape(c, () => rrect(c, 790, 780, 130, 190, 24), COL.glass, 6); shape(c, () => rrect(c, 790, 860, 130, 110, 20), "#ffc9d8", 0); shape(c, () => rrect(c, 790, 780, 130, 190, 24), "rgba(255,255,255,0.15)", 6);
  shape(c, () => rrect(c, 805, 735, 100, 60, 12), COL.steelDk, 6);
  write(c, "+", 828, 850, 70, RED, 12);
};
const CARDS = [intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2, t0, t1, t7, t9, t10, t12, t14, t15, e_1, e_2, e_4, e_5, e_7, e_9, e_10, e_13];
export const ic_bodyGrowingOldL3 = cards("sci.body.growing-old.L3 cards", CARDS);
