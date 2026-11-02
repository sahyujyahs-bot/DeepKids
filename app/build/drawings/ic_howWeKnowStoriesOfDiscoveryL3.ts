import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, write, cards } from "./flatKit";

// sci.how-we-know.stories-of-discovery.L3 · picture cards (intro, cover, flows, terms, explanations).
// Same child and grown-up as the set-up cards. No words: pictures, arrows and numbers only.

const TAPE = "#f3e7a8", PAPER = "#f1ece0", NOTE = "#ffd34d", NOTEDK = "#e0b030", PURPLE = "#8b3fb8", PURPLEDK = "#6a2a92";
const AGAR = "#f6e2a0", GREYP = "#a9a396";

const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20);
  line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
const handLeft = (c: Ctx, x: number, y: number, an: number, s: number, skin: string = SKIN.adult, sleeve: string = CLOTH.adult) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, an, s, skin, sleeve); c.restore();
};
const bez = (a: number[], b: number[], d: number[], n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * d[0], u * u * a[1] + 2 * u * t * b[1] + t * t * d[1]]; });
const bentStrip = (c: Ctx, pts: number[][], w: number, fill = TAPE) => { line(c, pts, w + 10, INK); line(c, pts, w, fill); };
const strip = (c: Ctx, x: number, y0: number, y1: number, w: number, fill = TAPE) => {
  shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 6), fill, 5);
  shine(c, [[x - w * 0.25, y0 + 14], [x - w * 0.25, y1 - 14]], 6);
};
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number, sd = 5) => {
  shadow(c, x + w / 2 + 12, y + h + 4, w / 2, 22);
  shape(c, () => rrect(c, x, y, w, h, 10), PAPER, 6);
  shape(c, () => rect(c, x + w * 0.08, y + h * 0.07, w * 0.84, h * 0.08), "#4a4452", 4);
  shape(c, () => rect(c, x + w * 0.08, y + h * 0.2, w * 0.36, h * 0.25), "#cfc8b8", 4);
  const r = rnd(sd);
  for (let yy = y + h * 0.5; yy < y + h - 30; yy += 26) line(c, [[x + w * 0.08, yy], [x + w * 0.92 - (r() < 0.3 ? 60 : 0), yy]], 8, "#9b958a");
  for (let yy = y + h * 0.21; yy < y + h * 0.45; yy += 26) line(c, [[x + w * 0.5, yy], [x + w * 0.92, yy]], 8, "#9b958a");
};
const torn = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, fill: string) => {
  const r = rnd(n), pts = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, k = 0.72 + r() * 0.4; return [x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]; });
  shape(c, () => polyP(c, pts), fill, 5);
};
const sticky = (c: Ctx, x: number, y: number, w: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.08, w * 0.55, w * 0.5, w * 0.1);
  shape(c, () => rrect(c, -w / 2, -w / 2, w, w, 6), NOTE, 5);
  shade(c, () => rrect(c, -w / 2, -w / 2, w, w, 6), NOTEDK, w * 0.1, w * 0.1, 0.4);
  line(c, [[-w * 0.3, -w * 0.15], [w * 0.2, -w * 0.15]], 5, NOTEDK); line(c, [[-w * 0.3, w * 0.1], [w * 0.3, w * 0.1]], 5, NOTEDK);
  c.restore();
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.blue, dk: string = COL.blueDk) => {
  shadow(c, x + w * 0.55, y + h + 6, w * 0.6, 20);
  shape(c, () => rrect(c, x, y, w, h, 10), col, 6);
  shade(c, () => rrect(c, x, y, w, h, 10), dk, w * 0.12, 0, 0.5);
  shape(c, () => rect(c, x + w - 18, y + 8, 18, h - 16), WHITE, 4);
  shape(c, () => rect(c, x + w * 0.2, y + h * 0.18, w * 0.5, h * 0.22), COL.yellow, 4);
  line(c, [[x + 22, y + 8], [x + 22, y + h - 8]], 5);
};
const dish = (c: Ctx, x: number, y: number, r: number, mould = true, ring = true) => {
  shadow(c, x + r * 0.1, y + r * 0.2, r, r * 0.95);
  shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.8)", 6);
  shape(c, () => ell(c, x, y, r * 0.88, r * 0.88), AGAR, 4);
  const rd = rnd(11);
  for (let i = 0; i < 90; i++) {
    const a = rd() * 6.283, d = Math.sqrt(rd()) * r * 0.78, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
    if (ring && Math.hypot(px - (x + r * 0.28), py - (y - r * 0.12)) < r * 0.42) continue;
    c.beginPath(); ell(c, px, py, r * 0.035, r * 0.035); c.fillStyle = "#c98a3a"; c.fill();
  }
  if (mould) {
    const mx = x + r * 0.28, my = y - r * 0.12, pts = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * 6.283, k = 0.8 + (i % 2) * 0.35; return [mx + Math.cos(a) * r * 0.2 * k, my + Math.sin(a) * r * 0.2 * k]; });
    shape(c, () => polyP(c, pts), COL.greenLt, 5);
    shape(c, () => ell(c, mx, my, r * 0.09, r * 0.09), COL.green, 3);
  }
  shine(c, [[x - r * 0.75, y - r * 0.35], [x - r * 0.5, y - r * 0.7]], 8);
};
const magn = (c: Ctx, x: number, y: number, r: number, an = 0.8) => {
  const hx = x + Math.cos(an) * r, hy = y + Math.sin(an) * r;
  line(c, [[hx, hy], [hx + Math.cos(an) * r * 0.9, hy + Math.sin(an) * r * 0.9]], r * 0.28 + 10, INK);
  line(c, [[hx, hy], [hx + Math.cos(an) * r * 0.9, hy + Math.sin(an) * r * 0.9]], r * 0.28, COL.brown);
  shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.5)", 10);
  shine(c, [[x - r * 0.6, y - r * 0.15], [x - r * 0.3, y - r * 0.6]], 8);
};
const flask = (c: Ctx, x: number, y: number, s: number, liq: string = PURPLE, liqDk: string = PURPLEDK) => {
  const body = () => { c.moveTo(x - s * 0.14, y - s); c.lineTo(x - s * 0.14, y - s * 0.55); c.lineTo(x - s * 0.5, y - s * 0.04); c.quadraticCurveTo(x - s * 0.52, y, x - s * 0.45, y); c.lineTo(x + s * 0.45, y); c.quadraticCurveTo(x + s * 0.52, y, x + s * 0.5, y - s * 0.04); c.lineTo(x + s * 0.14, y - s * 0.55); c.lineTo(x + s * 0.14, y - s); c.closePath(); };
  const liquid = () => { c.moveTo(x - s * 0.3, y - s * 0.3); c.lineTo(x - s * 0.5, y - s * 0.04); c.quadraticCurveTo(x - s * 0.52, y, x - s * 0.45, y); c.lineTo(x + s * 0.45, y); c.quadraticCurveTo(x + s * 0.52, y, x + s * 0.5, y - s * 0.04); c.lineTo(x + s * 0.3, y - s * 0.3); c.closePath(); };
  shape(c, liquid, liq, 0); shade(c, liquid, liqDk, s * 0.15, 0, 0.5);
  shape(c, body, "rgba(214,236,250,0.35)", 6);
  shine(c, [[x - s * 0.08, y - s * 0.9], [x - s * 0.08, y - s * 0.62]], 7);
};
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 6, w / 2, 24);
  shape(c, () => rrect(c, x - 12, y - 12, w + 24, h + 24, 14), COL.teal, 6);
  shape(c, () => rect(c, x, y, w, h), PAPER, 5);
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 5);
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rect(c, 0, -14, len, 28), COL.yellow, 5);
  shape(c, () => polyP(c, [[0, -14], [-44, 0], [0, 14]]), "#f1d9b0", 5);
  shape(c, () => polyP(c, [[-44, 0], [-26, -8], [-26, 8]]), INK, 2);
  shape(c, () => rect(c, len - 36, -14, 36, 28), COL.pink, 5);
  c.restore();
};
const bust = (c: Ctx, x: number, y: number, r: number, skin: string, cloth: string, hair: string = CLOTH.hair) => {
  shape(c, () => rrect(c, x - r * 1.2, y + r * 0.95, r * 2.4, r * 1.6, r * 0.5), cloth);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, hair, 5);
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.4, r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const zig = (c: Ctx, x: number, y: number, s: number, col = INK, w = 6) => line(c, [[x - s, y], [x - s * 0.6, y - s * 1.1], [x - s * 0.2, y + s * 1.1], [x + s * 0.2, y - s * 1.1], [x + s * 0.6, y + s * 1.1], [x + s, y]], w, col);
const wiggle = (c: Ctx, x0: number, x1: number, y: number, sd: number, amp = 36, w = 6) => {
  const r = rnd(sd), pts: number[][] = []; for (let x = x0; x <= x1; x += 22) pts.push([x, y + (r() - 0.5) * amp * 2]); line(c, pts, w, INK);
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, top: string = COL.water) => {
  const hw = w / 2, bw = w * 0.4, ry = w * 0.2;
  shadow(c, x + w * 0.18, y + 8, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - hw, y - h); c.lineTo(x + hw, y - h); c.lineTo(x + bw, y); c.quadraticCurveTo(x, y + w * 0.1, x - bw, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.3, 0, 0.7);
  shine(c, [[x - hw * 0.72, y - h * 0.85], [x - bw * 0.72, y - h * 0.15]], 10);
  shape(c, () => ell(c, x, y - h, hw, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + 3, hw * 0.84, ry * 0.76), top, 3);
};
const steam = (c: Ctx, x: number, y: number, k = 1) => {
  for (const [dx, h0] of [[-45, 230], [10, 290], [65, 220]]) {
    const h = h0 * k, pts = Array.from({ length: 21 }, (_, i) => [x + dx + Math.sin(i * 0.7 + dx) * 20, y - (i / 20) * h]);
    line(c, pts, 20, "rgba(43,35,64,0.45)"); line(c, pts, 11, WHITE);
  }
};
const snow = (c: Ctx, x: number, y: number, s: number) => { for (let k = 0; k < 3; k++) { const a = k * 1.047; line(c, [[x - Math.cos(a) * s, y - Math.sin(a) * s], [x + Math.cos(a) * s, y + Math.sin(a) * s]], 8, COL.blueDk); } };
const boat = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + s * 0.5, s * 0.9, s * 0.1);
  shape(c, () => polyP(c, [[x - s, y - s * 0.1], [x + s, y - s * 0.1], [x + s * 0.65, y + s * 0.45], [x - s * 0.65, y + s * 0.45]]), WHITE);
  shape(c, () => polyP(c, [[x - s * 0.1, y - s * 0.1], [x - s * 0.1, y - s * 0.95], [x + s * 0.6, y - s * 0.1]]), COL.pink);
  shade(c, () => polyP(c, [[x - s, y - s * 0.1], [x + s, y - s * 0.1], [x + s * 0.65, y + s * 0.45], [x - s * 0.65, y + s * 0.45]]), COL.grey, s * 0.25, 0, 0.5);
};
const shell = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s * 0.1, y + s * 0.7, s * 0.9, s * 0.15);
  shape(c, () => { c.moveTo(x - s, y + s * 0.5); c.quadraticCurveTo(x - s * 0.9, y - s * 0.8, x + s * 0.3, y - s * 0.7); c.quadraticCurveTo(x + s * 1.1, y - s * 0.4, x + s, y + s * 0.5); c.closePath(); }, COL.pink, 6);
  for (let k = 1; k < 5; k++) line(c, [[x - s * 0.8 + k * s * 0.38, y + s * 0.5], [x - s * 0.5 + k * s * 0.3, y - s * 0.6]], 4, "#c9647f");
  shape(c, () => rrect(c, x - s * 0.5, y + s * 0.45, s * 1.1, s * 0.16, 6), "#e07f9c", 4);
};
const leafBig = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y + s); c.bezierCurveTo(x - s * 0.95, y + s * 0.2, x - s * 0.6, y - s * 0.8, x, y - s); c.bezierCurveTo(x + s * 0.6, y - s * 0.8, x + s * 0.95, y + s * 0.2, x, y + s); c.closePath(); }, COL.leaf, 6);
  line(c, [[x, y + s], [x, y - s * 0.8]], 5, COL.leafDk);
  for (const k of [-0.4, 0, 0.4]) { line(c, [[x, y + s * k], [x - s * 0.4, y + s * (k - 0.3)]], 4, COL.leafDk); line(c, [[x, y + s * k], [x + s * 0.4, y + s * (k - 0.3)]], 4, COL.leafDk); }
};
const armEnd = (x: number, y: number, h: number, side: number, a1: number, a2: number) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const bacteria = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -s, -s * 0.4, s * 2, s * 0.8, s * 0.4), "#7fb04a", 5);
  shade(c, () => rrect(c, -s, -s * 0.4, s * 2, s * 0.8, s * 0.4), COL.greenDk, s * 0.2, s * 0.1, 0.4);
  c.restore();
};
const spotlight = (c: Ctx, x: number, y: number, x0: number, x1: number, yb: number) => {
  c.beginPath(); c.moveTo(x - 20, y); c.lineTo(x + 20, y); c.lineTo(x1, yb); c.lineTo(x0, yb); c.closePath(); c.fillStyle = "rgba(255,230,120,0.5)"; c.fill();
};

// ---------------------------------------------------------------- intro, cover
const intro = (c: Ctx) => {
  ground(c); table(c, 800);
  // a glass plate with a paper strip peeling off it, a grown-up's hand pulling the end
  shadow(c, 450, 790, 330, 26);
  shape(c, () => polyP(c, [[130, 700], [730, 700], [790, 790], [190, 790]]), "rgba(190,225,245,0.9)", 6);
  shape(c, () => polyP(c, [[130, 700], [730, 700], [730, 724], [130, 724]]), COL.glassEdge, 5);
  const pts = bez([220, 745], [620, 740], [840, 400]);
  line(c, pts, 74, INK); line(c, pts, 60, PAPER);
  handLeft(c, 960, 330, 0.5, 1.4);
  arrow(c, [[600, 600], [690, 520]], RED, 11);
  // inset: the song book with a yellow bookmark
  c.save(); c.beginPath(); ell(c, 250, 270, 200, 200); c.fillStyle = COL.sky; c.fill(); c.clip();
  book(c, 150, 190, 200, 250);
  shape(c, () => rect(c, 220, 135, 46, 90), NOTE, 5);
  c.restore();
  c.beginPath(); ell(c, 250, 270, 200, 200); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
};
const summary = (c: Ctx) => {
  ground(c); table(c, 830);
  newspaper(c, 60, 360, 440, 480);
  torn(c, 240, 560, 70, 55, 3, "#d6cfbf");
  bentStrip(c, bez([330, 560], [440, 520], [470, 330]), 70);
  torn(c, 452, 410, 48, 40, 7, GREYP);
  arrow(c, [[400, 250], [470, 200]], RED, 10);
  // the yellow note, stuck on a notebook and peeling off clean
  notebook(c, 640, 480, 330, 330);
  sticky(c, 760, 600, 130, -0.1);
  c.save(); c.translate(860, 560); c.rotate(0.5); shape(c, () => polyP(c, [[0, 0], [90, -10], [100, 70]]), NOTE, 5); c.restore();
  arrow(c, [[880, 470], [940, 400]], RED, 10);
};

// ---------------------------------------------------------------- flows
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 850);
  newspaper(c, 190, 150, 700, 640, 8);
  [[300, "#f3e7a8", 190], [450, "#f0dc88", 260], [600, "#e8cf6c", 330], [750, "#dfc255", 400]].forEach(([x, col, h], i) => {
    strip(c, x as number, 560 - (h as number) / 2, 560 + (h as number) / 2 - 50, 70, col as string);
    shape(c, () => rect(c, (x as number) - 32, 250 + i * 8, 64, 64), WHITE, 4);
  });
  // a cloth for dabbing
  shape(c, () => rrect(c, 20, 860, 270, 140, 14), "#f7f3e8", 6);
  for (let k = 0; k < 3; k++) strip(c, 80 + k * 80, 870, 950, 50, TAPE);
};
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 780);
  tumbler(c, 330, 760, 270, 340); tumbler(c, 750, 760, 270, 340);
  steam(c, 330, 380, 0.9);
  snow(c, 750, 520, 50); snow(c, 640, 330, 34); snow(c, 870, 340, 34);
  arrow(c, [[480, 880], [600, 880]], RED, 11);
};
const flowA1 = (c: Ctx) => {
  ground(c); table(c, 800);
  // a jug of panakam
  const jug = () => { c.moveTo(380, 330); c.lineTo(700, 330); c.lineTo(680, 780); c.lineTo(400, 780); c.closePath(); };
  line(c, [[690, 420], [800, 430], [790, 640], [685, 660]], 36, INK); line(c, [[690, 420], [800, 430], [790, 640], [685, 660]], 20, COL.steel);
  shape(c, jug, COL.steel); shade(c, jug, COL.steelDk, 80, 0, 0.6);
  shape(c, () => ell(c, 540, 330, 160, 34), "#c9843c", 6);
  shine(c, [[420, 420], [430, 700]], 12);
  // tumblers with panakam
  glass(c, 200, 780, 150, 220, 0.7, "#c9843c"); glass(c, 900, 780, 150, 220, 0.7, "#c9843c");
  // a lemon and a heap of jaggery
  shape(c, () => ell(c, 175, 925, 85, 58, -0.2), COL.yellow, 6);
  for (const [x, y] of [[560, 900], [630, 880], [700, 910], [600, 860], [800, 890]]) { shape(c, () => rrect(c, x - 36, y - 30, 72, 60, 10), "#b8742f", 5); shade(c, () => rrect(c, x - 36, y - 30, 72, 60, 10), "#8a5220", 14, 12, 0.5); }
};
const flowA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 700, 520, 40);
  shape(c, () => rect(c, 40, 340, 1000, 360), PAPER, 6);
  wiggle(c, 70, 1010, 520, 3, 90, 6);
  for (const x of [250, 560, 870]) { shape(c, () => ell(c, x, 520, 70, 70), "rgba(0,0,0,0)", 0); zig(c, x, 520, 40, INK, 7); c.beginPath(); ell(c, x, 520, 78, 78); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); }
  pencil(c, 780, 850, 300, -0.2);
  arrow(c, [[250, 250], [250, 330]], RED, 11); arrow(c, [[560, 250], [560, 330]], RED, 11); arrow(c, [[870, 250], [870, 330]], RED, 11);
};
const flowA3 = (c: Ctx) => {
  ground(c); table(c, 880);
  person(c, 270, 880, 560, { adult: false, armR: [0.8, 0.2] });
  person(c, 800, 880, 560, { adult: true });
  // speech bubble with a tipped pot and a spill
  shape(c, () => { c.moveTo(500, 30); c.lineTo(1040, 30); c.lineTo(1040, 230); c.lineTo(860, 230); c.lineTo(810, 290); c.lineTo(790, 230); c.lineTo(500, 230); c.closePath(); }, WHITE, 6);
  shape(c, () => polyP(c, [[620, 130], [740, 90], [780, 170], [660, 200]]), COL.steel, 5);
  for (const [x, y] of [[830, 130], [870, 170], [800, 190]]) shape(c, () => ell(c, x, y, 14, 18), COL.water, 3);
  const w = armEnd(270, 880, 560, 1, 0.8, 0.2);
  shape(c, () => rrect(c, w[0] - 10, w[1] - 55, 100, 120, 6), COL.teal, 5);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 300, 20);
  shape(c, () => rect(c, 340, 170, 400, 780), PAPER, 6);
  dish(c, 540, 270, 80, true, true);
  for (let i = 0; i < 6; i++) { const y = 430 + i * 85; shape(c, () => ell(c, 400, y, 22, 22), i === 3 ? COL.yellow : COL.pink, 4); line(c, [[450, y], [690, y]], 12, GREYP); }
  // two pencils, one at each end
  pencil(c, 300, 150, 560, 0); pencil(c, 300, 970, 560, 0);
  arrow(c, [[860, 800], [860, 460]], RED, 12);
};
const flowP1 = (c: Ctx) => {
  ground(c); table(c, 860);
  notebook(c, 130, 200, 820, 540);
  for (const x of [335, 540, 745]) line(c, [[x, 200], [x, 740]], 5, GREYP);
  line(c, [[130, 300], [950, 300]], 5, GREYP);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { const y = 380 + r * 100; if (r === 0 || k < 2) line(c, [[150 + k * 205, y], [320 + k * 205 - 40, y]], 9, r === 0 ? INK : GREYP); }
  line(c, [[560, 380], [650, 380]], 9, INK);
  pencil(c, 560, 900, 330, -0.15);
  // a star burst for a surprise
  shape(c, () => polyP(c, Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * 6.283, r = i % 2 ? 40 : 80; return [900 + Math.cos(a) * r, 130 + Math.sin(a) * r]; })), COL.yellow, 6);
};
const flowC1 = (c: Ctx) => {
  ground(c);
  // a book held upside down, a plain paper bookmark falling out
  shadow(c, 540, 960, 340, 22);
  shape(c, () => rrect(c, 250, 180, 560, 360, 14), COL.blue, 6);
  shade(c, () => rrect(c, 250, 180, 560, 360, 14), COL.blueDk, 40, 0, 0.5);
  shape(c, () => rect(c, 280, 500, 500, 90), WHITE, 5);
  for (let k = 1; k < 5; k++) line(c, [[280, 500 + k * 18], [780, 500 + k * 18]], 3, GREYP);
  c.save(); c.translate(540, 760); c.rotate(0.3); shape(c, () => rect(c, -40, -190, 80, 380), COL.pink, 5); c.restore();
  arrow(c, [[760, 640], [760, 900]], RED, 12);
  arrow(c, [[300, 80], [300, 150]], RED, 10);
};
const flowC2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 450, 20);
  shape(c, () => rrect(c, 80, 100, 920, 860, 24), COL.woodDk, 7);
  shape(c, () => rrect(c, 120, 140, 840, 780, 14), "#f6e8c6", 5);
  const skins = [SKIN.child, SKIN.adult, "#c68a5f", "#a06c46"], clothes = [COL.teal, COL.pink, COL.orange, COL.blue, COL.purple, COL.green];
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    const x = 215 + k * 215, y = 240 + r * 190;
    shape(c, () => rrect(c, x - 82, y - 62, 164, 150, 10), WHITE, 5);
    bust(c, x, y + 4, 28, skins[(r + k) % 4], clothes[(r * 2 + k) % 6]);
  }
};

// ---------------------------------------------------------------- terms
const term0 = (c: Ctx) => {
  ground(c, "#2f2850");
  shape(c, () => rect(c, 0, 760, 1080, 320), COL.wood, 6);
  shape(c, () => rect(c, 0, 640, 1080, 120), COL.woodDk, 6);
  person(c, 200, 1040, 640, { armR: [-0.05, -0.05] });
  const t = armEnd(200, 1040, 640, 1, -0.05, -0.05);
  spotlight(c, t[0] + 40, t[1], 560, 1020, 780);
  shape(c, () => rrect(c, t[0] - 6, t[1] - 24, 90, 44, 10), COL.steel, 5);
  shell(c, 780, 770, 130);
};
const term1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 200, 460, 640, 24), "#f6e8c6", 7);
  shape(c, () => rrect(c, 570, 200, 460, 640, 24), "#f6e8c6", 7);
  leafBig(c, 250, 470, 120); magn(c, 300, 560, 100, 0.8);
  boat(c, 800, 560, 160);
  line(c, [[640, 300], [680, 240]], 9, COL.pink); line(c, [[940, 300], [900, 240]], 9, COL.pink);
};
const term2 = (c: Ctx) => { ground(c); dish(c, 540, 540, 390, true, true); };
const term3 = (c: Ctx) => {
  ground(c); table(c, 860);
  flask(c, 470, 800, 520);
  hand(c, 330, 340, 0, 1.4, SKIN.child, CLOTH.child);
  for (const [x, y, r] of [[380, 400, 24], [480, 300, 18], [560, 450, 30]]) shape(c, () => ell(c, x, y, r, r), "#c68ae0", 4);
  shape(c, () => polyP(c, Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 6.283, r = i % 2 ? 30 : 60; return [830 + Math.cos(a) * r, 250 + Math.sin(a) * r]; })), COL.yellow, 6);
};
const term5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 780, 500, 30);
  shape(c, () => rect(c, 40, 340, 1000, 420), PAPER, 6);
  wiggle(c, 70, 440, 550, 21, 40); wiggle(c, 640, 1010, 550, 22, 40);
  line(c, [[440, 550], [480, 480], [510, 620], [550, 500], [580, 590], [640, 550]], 7);
  magn(c, 540, 530, 150, 0.8);
  c.beginPath(); ell(c, 540, 540, 200, 200); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  pencil(c, 780, 900, 300, -0.15);
};
const term6 = (c: Ctx) => {
  ground(c); table(c, 880);
  newspaper(c, 120, 300, 560, 580);
  torn(c, 330, 560, 80, 62, 3, "#d6cfbf");
  bentStrip(c, bez([400, 560], [640, 540], [800, 260]), 90);
  torn(c, 700, 400, 64, 54, 7, GREYP);
  arrow(c, [[860, 420], [940, 340]], RED, 11);
};
const term7 = (c: Ctx) => {
  ground(c);
  notebook(c, 130, 150, 820, 700);
  line(c, [[540, 150], [540, 850]], 5);
  const tick = (x: number, y: number) => line(c, [[x - 30, y], [x - 8, y + 26], [x + 34, y - 30]], 12, COL.greenDk);
  const cross = (x: number, y: number) => { line(c, [[x - 24, y - 24], [x + 24, y + 24]], 12, RED); line(c, [[x - 24, y + 24], [x + 24, y - 24]], 12, RED); };
  for (let k = 0; k < 4; k++) { tick(330, 270 + k * 140); }
  cross(750, 270);
  magn(c, 800, 780, 100, 0.8);
};
const term8 = (c: Ctx) => {
  ground(c); table(c, 800);
  // glue tube
  shape(c, () => polyP(c, [[130, 800], [130, 420], [200, 340], [270, 420], [270, 800]]), COL.orange);
  shade(c, () => polyP(c, [[130, 800], [130, 420], [200, 340], [270, 420], [270, 800]]), "#d27c25", 40, 0, 0.5);
  shape(c, () => rect(c, 180, 260, 40, 80), COL.steel, 5);
  shape(c, () => polyP(c, [[120, 800], [280, 800], [280, 830], [120, 830]]), COL.orange, 5);
  // tape roll
  shape(c, () => ell(c, 470, 640, 130, 130), TAPE); shape(c, () => ell(c, 470, 640, 60, 60), COL.paper, 5);
  shine(c, [[380, 580], [420, 540]], 9);
  // bindi card
  shape(c, () => rrect(c, 640, 560, 160, 230, 12), WHITE, 6);
  for (const [x, y] of [[720, 620], [720, 700]]) shape(c, () => ell(c, x, y, 24, 24), RED, 5);
  // bowl of rice paste
  shape(c, () => { c.moveTo(830, 660); c.bezierCurveTo(840, 800, 1040, 800, 1050, 660); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 940, 660, 110, 26), WHITE, 5);
};
const term9 = (c: Ctx) => {
  ground(c);
  const edge = Array.from({ length: 28 }, (_, k) => [k * 40, 520 + ((k * 7) % 5) * 12]);
  shape(c, () => { c.moveTo(0, 1080); edge.forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(1080, 520); c.lineTo(1080, 1080); c.closePath(); }, PAPER, 7);
  const r = rnd(9);
  edge.forEach(([x, y], k) => { if (k % 2) return; const a = -1.9 + r() * 1.2, l = 110 + r() * 80, p = bez([x, y], [x + Math.cos(a) * l * 0.5 + (r() - 0.5) * 70, y + Math.sin(a) * l * 0.6], [x + Math.cos(a) * l, y + Math.sin(a) * l]); line(c, p, 20, INK); line(c, p, 10, PAPER); });
  magn(c, 760, 330, 140, 0.8);
  for (let y = 680; y < 1040; y += 90) line(c, [[40, y], [1040, y]], 10, "#e0dacc");
};
const term10 = (c: Ctx) => {
  ground(c, "#1d1936");
  shape(c, () => rrect(c, 120, 100, 840, 880, 24), "#2b2347", 7);
  for (let i = 0; i < 6; i++) { const y = 210 + i * 130; shape(c, () => ell(c, 250, y, 36, 36), [COL.yellow, COL.pink, COL.teal, COL.orange, COL.blue, COL.greenLt][i], 5); line(c, [[330, y], [330 + 280 - (i % 3) * 40, y]], 16, "#f1ece0"); }
  arrow(c, [[860, 860], [860, 360]], RED, 14);
};
const term12 = (c: Ctx) => {
  ground(c, "#6a4a9c");
  shape(c, () => polyP(c, [[420, 120], [660, 120], [620, 520], [460, 520]]), RED, 6);
  shadow(c, 560, 880, 330, 40);
  shape(c, () => ell(c, 540, 600, 300, 300), "#f2c240", 7);
  shade(c, () => ell(c, 540, 600, 300, 300), "#c6942a", 70, 70, 0.5);
  shape(c, () => ell(c, 540, 600, 235, 235), "#f7d667", 5);
  shape(c, () => ell(c, 540, 520, 80, 90), "#f2c240", 5);
  shape(c, () => { c.moveTo(380, 780); c.quadraticCurveTo(400, 640, 540, 620); c.quadraticCurveTo(680, 640, 700, 780); c.closePath(); }, "#f2c240", 5);
};
const term14 = (c: Ctx) => {
  ground(c);
  // a blister strip of tablets
  shape(c, () => rrect(c, 60, 360, 420, 360, 20), COL.steel, 7);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { shape(c, () => ell(c, 190 + k * 170, 450 + r * 100, 55, 36), WHITE, 5); line(c, [[190 + k * 170 - 40, 450 + r * 100], [190 + k * 170 + 40, 450 + r * 100]], 4, GREYP); }
  // bacteria crossed out
  bacteria(c, 740, 400, 90, 0.4); bacteria(c, 880, 560, 80, -0.5); bacteria(c, 720, 650, 85, 0.1);
  line(c, [[580, 300], [1020, 760]], 20, RED); line(c, [[1020, 300], [580, 760]], 20, RED);
};

// ---------------------------------------------------------------- explanations
const expl0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rect(c, 0, 0, 530, 1080), "#f6e8c6", 0);
  shape(c, () => rect(c, 0, 760, 530, 320), "#efd49a", 0);
  shell(c, 250, 640, 160);
  line(c, [[540, 0], [540, 1080]], 10);
  boat(c, 800, 640, 190);
  arrow(c, [[690, 330], [750, 400]], RED, 10);
};
const expl1 = (c: Ctx) => {
  ground(c);
  for (const x of [20, 380, 740]) shape(c, () => rrect(c, x, 220, 320, 640, 20), "#f6e8c6", 6);
  dish(c, 180, 540, 125, true, true);
  flask(c, 540, 760, 340);
  shape(c, () => rect(c, 790, 300, 220, 470), "#3a3550", 6);
  c.beginPath(); ell(c, 900, 560, 70, 100); c.fillStyle = "rgba(255,255,255,0.45)"; c.fill();
  c.beginPath(); ell(c, 900, 580, 40, 60); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill();
};
const expl3 = (c: Ctx) => {
  ground(c);
  notebook(c, 100, 140, 600, 700);
  line(c, [[100, 300], [700, 300]], 5);
  ["1006", "1002", "958"].forEach((t, i) => write(c, t, 160, 380 + i * 140, 70, INK, 8));
  arrow(c, [[640, 380], [640, 800]], RED, 11);
  // stars
  for (const [x, y, r] of [[860, 300, 50], [920, 560, 40], [820, 780, 56]]) shape(c, () => polyP(c, Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.283 - 1.57, k = i % 2 ? r * 0.45 : r; return [x + Math.cos(a) * k, y + Math.sin(a) * k]; })), COL.yellow, 6);
};
const expl4 = (c: Ctx) => {
  ground(c);
  const panel = (y0: number, smooth: boolean) => {
    shape(c, () => rect(c, 20, y0, 1040, 440), "#f6e8c6", 5);
    const base = y0 + 440, top = base - 280;
    shape(c, () => rect(c, 20, base - 70, 1040, 70), PAPER, 5);
    for (let k = 0; k < 7; k++) { const x = 100 + k * 145, p = bez([x, base - 60], [x + (k % 2 ? 40 : -40), base - 170], [x + (k % 2 ? 10 : -10), top]); line(c, p, 28, INK); line(c, p, 16, PAPER); }
    if (smooth) shape(c, () => rrect(c, 40, top - 50, 1000, 90, 30), TAPE, 6);
    else { shape(c, () => rrect(c, 40, top - 90, 1000, 36, 12), TAPE, 6); for (const k of [1, 3, 5]) shape(c, () => ell(c, 100 + k * 145 + (k % 2 ? 10 : -10), top - 40, 36, 40), TAPE, 5); }
  };
  panel(40, true); panel(580, false);
  arrow(c, [[1010, 130], [1010, 70]], RED, 9); arrow(c, [[1010, 640], [1010, 590]], RED, 9);
};
const expl5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 330, 20);
  shape(c, () => rrect(c, 200, 80, 680, 900, 14), WHITE, 6);
  line(c, [[280, 190], [800, 190]], 28, INK);
  for (let i = 0; i < 5; i++) { const y = 330 + i * 70; shape(c, () => ell(c, 280, y, 20, 20), [COL.yellow, COL.pink, COL.teal, COL.orange, COL.blue][i], 4); line(c, [[330, y], [330 + 220 - i * 10, y]], 14, GREYP); }
  for (let y = 720; y < 940; y += 36) line(c, [[280, y], [800, y]], 9, "#cfc8b8");
  magn(c, 620, 400, 100, 0.8);
};
const expl6 = (c: Ctx) => {
  ground(c, "#3a3550");
  spotlight(c, 270, 40, 40, 520, 880);
  const skins = [SKIN.child, SKIN.adult, "#c68a5f", "#6b5a6b", "#6b5a6b", "#6b5a6b"];
  for (let k = 0; k < 6; k++) { const lit = k < 3; bust(c, 100 + k * 172, 620, 62, skins[k], lit ? WHITE : "#666173", lit ? CLOTH.hair : "#1d1a2e"); }
  shape(c, () => rect(c, 0, 860, 1080, 220), COL.woodDk, 6);
};
const expl9 = (c: Ctx) => {
  ground(c); table(c, 900);
  // an open freezer
  shape(c, () => rrect(c, 640, 180, 380, 720, 24), "#e9eef3", 7);
  shape(c, () => rrect(c, 676, 216, 308, 648, 14), "#d4ebf6", 6);
  shape(c, () => rect(c, 676, 520, 308, 34), COL.steel, 5);
  snow(c, 760, 300, 24); snow(c, 900, 400, 20);
  person(c, 140, 900, 560, { adult: true });
  person(c, 400, 900, 520, { armR: [0.2, -0.1] });
  const t = armEnd(400, 900, 520, 1, 0.2, -0.1);
  tumbler(c, t[0] + 20, t[1] + 40, 110, 140, "#e8d5b0");
  steam(c, t[0] + 20, t[1] - 110, 0.4);
};

export const ic_howWeKnowStoriesOfDiscoveryL3 = cards("sci.how-we-know.stories-of-discovery.L3 cards", [
  intro, summary, flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, flowC1, flowC2,
  term0, term1, term2, term3, term5, term6, term7, term8, term9, term10, term12, term14,
  expl0, expl1, expl3, expl4, expl5, expl6, expl9,
]);
