import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, seed, write, person, cards } from "./flatKit";

// PICTURES FOR THE CARDS · sci.seeds-and-life-cycles.seeds-and-germination.L3 · flat kit
const CUPG = "rgba(214,236,250,0.28)";
const CHS = "#ecd08e", CHSD = "#cfa95e", CH = "#d9a45a", CHD = "#b57f36";
const INNER = "#f3d68f";
const RAJ = "#a63a30", RAJD = "#7a2420", CREAM = "#fff3c9", NAVY = "#1f2a4a";

const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - 1.3 * s); c.bezierCurveTo(x + 0.3 * s, y - 0.6 * s, x + s, y - 0.2 * s, x + s, y + 0.4 * s); c.bezierCurveTo(x + s, y + 1.3 * s, x - s, y + 1.3 * s, x - s, y + 0.4 * s); c.bezierCurveTo(x - s, y - 0.2 * s, x - 0.3 * s, y - 0.6 * s, x, y - 1.3 * s); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => dropP(c, x, y, s), COL.water, Math.max(3, s * 0.15)); shine(c, [[x - s * 0.4, y], [x - s * 0.35, y + s * 0.5]], Math.max(3, s * 0.2)); };
const chana = (c: Ctx, x: number, y: number, r: number, rot: number, soaked = false) => {
  const f = soaked ? CHS : CH, d = soaked ? CHSD : CHD;
  shape(c, () => ell(c, x, y, r, r * 0.88, rot), f, Math.max(2.5, r * 0.18));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.88, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.35, y + r * 0.3, r, r * 0.88, rot); c.fillStyle = d; c.globalAlpha = 0.55; c.fill(); c.restore(); c.globalAlpha = 1;
  line(c, [[x - r * 0.1, y - r * 0.55], [x + r * 0.15, y - r * 0.25], [x + r * 0.05, y + r * 0.05]], Math.max(2, r * 0.13), d);
};
// a big seed: the same look as seed() with a fixed outline
const seedB = (c: Ctx, x: number, y: number, r: number, rot: number, soaked = false, col: string = soaked ? COL.greenLt : COL.green, dk: string = soaked ? COL.green : COL.greenDk) => {
  shape(c, () => ell(c, x, y, r, r * 0.7, rot), col, 7);
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.7, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.2, y + r * 0.2, r, r * 0.7, rot); c.fillStyle = dk; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1;
  line(c, [[x - Math.cos(rot) * r * 0.45, y - Math.sin(rot) * r * 0.45 - r * 0.12], [x + Math.cos(rot) * r * 0.45, y + Math.sin(rot) * r * 0.45 - r * 0.12]], Math.max(6, r * 0.08), "#f4f1e4");
};
const rajma = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  seed(c, x, y, r, rot, false, RAJ, RAJD);
};
const tail = (c: Ctx, pts: number[][], w: number, col: string = WHITE) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
// a baby plant: root pointing down from (x, y), two small folded leaves above it
const embryo = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => polyP(c, [[-s * 0.16, 0], [s * 0.16, 0], [0, s * 1.1]]), CREAM, Math.max(3, s * 0.05));
  shape(c, () => ell(c, -s * 0.17, -s * 0.3, s * 0.15, s * 0.34, 0.25), COL.greenLt, Math.max(3, s * 0.05));
  shape(c, () => ell(c, s * 0.17, -s * 0.3, s * 0.15, s * 0.34, -0.25), COL.green, Math.max(3, s * 0.05));
  c.restore();
};
const star = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x, y - s], [x + s * 0.28, y - s * 0.28], [x + s, y], [x + s * 0.28, y + s * 0.28], [x, y + s], [x - s * 0.28, y + s * 0.28], [x - s, y], [x - s * 0.28, y - s * 0.28]]), COL.yellow, Math.max(3, s * 0.08));
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, p = [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]]; line(c, p, 16, INK); line(c, p, 8, COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.2, -r * 0.2, 0.6);
};
const flake = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 9, COL.blueDk); } };
const warm = (c: Ctx, x: number, y: number, h: number) => { for (const dx of [-36, 0, 36]) { const p: number[][] = []; for (let i = 0; i <= 8; i++) p.push([x + dx + Math.sin(i * 1.3) * 12, y - (h * i) / 8]); line(c, p, 9, RED); } };
const cloud = (c: Ctx, x: number, y: number) => { shape(c, () => { ell(c, x, y, 60, 30); ell(c, x + 55, y + 6, 50, 26); ell(c, x - 55, y + 8, 44, 24); }, WHITE, 0); };

// a heap of seeds in a mouth (ellipse rx, ry at x, y) rising hm above it
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, hm: number, one: (sx: number, sy: number, rot: number) => void, base: string, cnt: number, sd: number) => {
  const dome = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.9, y - hm * 1.35, x + rx * 0.9, y - hm * 1.35, x + rx, y); c.ellipse(x, y, rx, ry, 0, 0, Math.PI, false); c.closePath(); };
  shape(c, dome, base, 0);
  const r = rnd(sd), pts: number[][] = [];
  for (let i = 0; i < cnt; i++) { const u = r() * 1.84 - 0.92, top = y - hm * (1 - u * u), bot = y + ry * Math.sqrt(1 - u * u); pts.push([x + u * rx, top + r() * (bot - top), r() * 3]); }
  pts.sort((a, b) => a[1] - b[1]);
  c.save(); c.beginPath(); dome(); c.clip(); pts.forEach(([sx, sy, rt]) => one(sx, sy, rt)); c.restore();
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
};
// seeds scattered inside a box
const scatter = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, sd: number, one: (x: number, y: number, rot: number) => void) => {
  const r = rnd(sd), pts: number[][] = [];
  for (let i = 0; i < n; i++) pts.push([x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), r() * 3]);
  pts.sort((a, b) => a[1] - b[1]); pts.forEach(([x, y, t]) => one(x, y, t));
};
// a clear cup, bottom centre (x, y); inner() draws the contents (clipped to the cup)
const cupP = (x: number, y: number, w: number, h: number) => (c: Ctx) => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
const cup = (c: Ctx, x: number, y: number, w: number, h: number, inner?: () => void) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  if (inner) { c.save(); c.beginPath(); cupP(x, y, w, h)(c); c.clip(); inner(); c.restore(); }
  shape(c, () => cupP(x, y, w, h)(c), CUPG, 5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), "rgba(255,255,255,0.25)", 5);
  shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.28, y - h * 0.2]], 7);
};
type CupKind = "dry" | "damp" | "water";
// cotton in a cup with 10 moong on top; tails = how many have a white root
const cupInner = (c: Ctx, x: number, y: number, w: number, h: number, kind: CupKind, tails = 0) => () => {
  const f = 0.42, yt = y - h * f, half = w * 0.4 + w * 0.1 * f, ry = w * 0.1, wet = kind !== "dry";
  c.fillStyle = wet ? "#bcd6ee" : COL.cloth; c.fillRect(x - w / 2, yt, w, y - yt);
  c.fillStyle = wet ? "#8fb3dc" : "#e4dccb"; c.fillRect(x + w * 0.12, yt, w, y - yt);
  shape(c, () => ell(c, x, yt, half, ry), wet ? "#d6e8f8" : "#fffdf6", 3);
  const sr = w * 0.1, rows = [[yt - ry * 0.55, 0.78], [yt + ry * 0.6, 0.7]];
  let k = 0;
  rows.forEach(([ry2, spread], row) => { for (let i = 0; i < 5; i++) {
    const sx = x - half * spread + (i + (row ? 0.5 : 0)) * (half * spread * 2) / 5 + sr * 0.5;
    if (k < tails) { const sgn = k % 2 ? 1 : -1; tail(c, [[sx, ry2 + 2], [sx + sgn * sr * 0.9, ry2 + sr * 2.2], [sx + sgn * sr * 0.5, ry2 + sr * 4]], 8); }
    seed(c, sx, ry2, sr, 0.2 * (i - 2) + row, false); k++;
  } });
  if (kind === "water") {
    const wy = y - h * 0.92;
    c.fillStyle = "rgba(143,195,234,0.75)"; c.fillRect(x - w / 2, wy, w, y - wy);
    c.fillStyle = "rgba(255,200,40,0.92)"; c.fillRect(x - w / 2, wy, w, h * 0.09);
  }
};
const thermo = (c: Ctx, x: number, y0: number, y1: number, redTop: number) => {
  shape(c, () => rrect(c, x - 12, y1, 24, y0 - y1, 12), "rgba(255,255,255,0.85)", 5);
  shape(c, () => ell(c, x, y0, 20, 20), RED, 5);
  line(c, [[x, y0], [x, redTop]], 10, RED);
};
// a flask, bottom centre (x, y)
const flask = (c: Ctx, x: number, y: number, w: number, h: number, live: boolean, redTop: number) => {
  const neck = w * 0.16, ny = y - h;
  const body = () => { c.moveTo(x - neck, ny); c.lineTo(x + neck, ny); c.lineTo(x + neck, ny + h * 0.28); c.lineTo(x + w / 2, y - 18); c.quadraticCurveTo(x + w / 2, y, x + w / 2 - 20, y); c.lineTo(x - w / 2 + 20, y); c.quadraticCurveTo(x - w / 2, y, x - w / 2, y - 18); c.lineTo(x - neck, ny + h * 0.28); c.closePath(); };
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.08);
  shape(c, body, CUPG, 5);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = live ? "#bcd6ee" : "#e7e0c0"; c.fillRect(x - w, y - h * 0.5, w * 2, h);
  scatter(c, x - w * 0.4, y - h * 0.46, x + w * 0.4, y - 30, 22, live ? 4 : 5, (sx, sy, rt) => {
    if (live) tail(c, [[sx, sy], [sx + 6, sy + 22], [sx - 4, sy + 40]], 6);
    seed(c, sx, sy, 20, rt, true, live ? COL.greenLt : "#cfc983", live ? COL.green : "#a39a52");
  });
  c.restore();
  shape(c, body, "rgba(255,255,255,0.1)", 6);
  shine(c, [[x - w * 0.38, y - h * 0.3], [x - w * 0.3, y - h * 0.1]], 8);
  thermo(c, x + neck * 0.2, y - 60, ny - 90, redTop);
};

// ---- the cards -------------------------------------------------------------------------------

// intro: jars of seeds on a shelf, and a wet cloth with moong that have grown white tails
const jar = (c: Ctx, x: number, y: number, w: number, h: number, one: (x: number, y: number, r: number) => void, sd: number, bg: string) => {
  shadow(c, x + w * 0.1, y + 4, w * 0.55, w * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 24), bg, 6);
  c.save(); c.beginPath(); rrect(c, x - w / 2, y - h, w, h, 24); c.clip();
  scatter(c, x - w / 2, y - h * 0.88, x + w / 2, y, 60, sd, one); c.restore();
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 24), "rgba(255,255,255,0.18)", 6);
  shine(c, [[x - w * 0.36, y - h * 0.8], [x - w * 0.36, y - h * 0.2]], 8);
  shape(c, () => rrect(c, x - w * 0.46, y - h - 34, w * 0.92, 40, 10), COL.steel, 6);
};
const intro = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[40, 470], [1040, 470], [1040, 520], [40, 520]]), COL.wood, 6);
  const sh = (c2: Ctx, y: number) => { c2.fillStyle = "rgba(0,0,0,0)"; void y; };
  void sh;
  jar(c, 200, 470, 250, 300, (x, y, r) => seed(c, x, y, 15, r, false), 3, "#e9f0d0");
  jar(c, 540, 470, 250, 300, (x, y, r) => chana(c, x, y, 20, r), 4, "#f6e7c4");
  jar(c, 880, 470, 250, 300, (x, y, r) => rajma(c, x, y, 20, r), 5, "#ecd0c6");
  shadow(c, 560, 930, 440, 40);
  shape(c, () => { c.moveTo(130, 700); c.quadraticCurveTo(540, 650, 960, 690); c.quadraticCurveTo(1000, 800, 950, 910); c.quadraticCurveTo(540, 960, 140, 920); c.quadraticCurveTo(90, 800, 130, 700); c.closePath(); }, "#bcd6ee", 6);
  const r = rnd(8);
  for (let i = 0; i < 12; i++) { const x = 220 + (i % 6) * 125 + r() * 20, y = 770 + Math.floor(i / 6) * 100 + r() * 10, sg = i % 2 ? 1 : -1; tail(c, [[x, y], [x + sg * 30, y + 28], [x + sg * 14, y + 60]], 11); seed(c, x, y, 28, r() * 2 - 1, true); }
  drop(c, 560, 640, 16);
};

// e1: five cups, only the damp warm ones have sprouted
const CUPX = [125, 330, 535, 740, 945];
const tagIcon = (c: Ctx, x: number, y: number, kind: string) => {
  shape(c, () => rrect(c, x - 72, y - 52, 144, 104, 12), WHITE, 5);
  if (kind === "dry") { drop(c, x, y, 20); line(c, [[x - 34, y + 30], [x + 34, y - 34]], 9, RED); }
  else if (kind === "damp") { drop(c, x - 16, y + 4, 19); drop(c, x + 20, y - 8, 14); }
  else if (kind === "fridge") flake(c, x, y, 32);
  else if (kind === "water") { for (const dy of [-18, 4, 26]) { c.beginPath(); c.moveTo(x - 34, y + dy); for (let k = 0; k < 3; k++) c.quadraticCurveTo(x - 34 + k * 24 + 6, y + dy - 12, x - 34 + k * 24 + 12, y + dy); c.strokeStyle = COL.waterDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); } }
  else { shape(c, () => ell(c, x, y, 16, 16), COL.yellow, 4); for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * 24, y + Math.sin(a) * 24], [x + Math.cos(a) * 36, y + Math.sin(a) * 36]], 6, COL.orange); } }
};
const e1 = (c: Ctx) => {
  ground(c);
  const kinds: CupKind[] = ["dry", "damp", "damp", "water", "damp"], tails = [0, 10, 0, 0, 10];
  CUPX.forEach((x, i) => cup(c, x, 740, 170, 320, cupInner(c, x, 740, 170, 320, kinds[i], tails[i])));
  ["dry", "damp", "fridge", "water", "light"].forEach((k, i) => tagIcon(c, CUPX[i], 890, k));
};

// e2: two flasks, the live sprouts are warmer
const e2 = (c: Ctx) => {
  ground(c);
  flask(c, 290, 900, 380, 560, true, 330);
  flask(c, 790, 900, 380, 560, false, 520);
  warm(c, 290, 250, 150);
};

// e3: dry chana in one bowl, soaked fatter chana filling another
const bowlOfChana = (c: Ctx, x: number, y: number, r: number, soaked: boolean, hm: number, n: number, sd: number) => {
  bowl(c, x, y, r);
  heap(c, x, y, r * 0.96, r * 0.2, hm, (sx, sy, rt) => chana(c, sx, sy, soaked ? 30 : 18, rt, soaked), soaked ? CHSD : CHD, n, sd);
};
const e3 = (c: Ctx) => {
  ground(c);
  bowlOfChana(c, 280, 640, 230, false, 70, 90, 2);
  bowlOfChana(c, 800, 640, 230, true, 190, 60, 3);
  arrow(c, [[460, 400], [610, 400]]);
  drop(c, 800, 250, 28); drop(c, 720, 200, 18); drop(c, 880, 190, 18);
};

// a1: split chana and split peanut with the baby plant between the halves
const peanutHalf = (c: Ctx, x: number, y: number, rx: number, ry: number, rot: number) => {
  shape(c, () => ell(c, x, y, rx, ry, rot), "#e8bf93", 6);
  shape(c, () => ell(c, x, y, rx * 0.86, ry * 0.8, rot), INNER, 4);
};
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 560, 420, 30); shadow(c, 540, 960, 330, 30);
  [[320, 1], [760, 1]].forEach(([x]) => { shape(c, () => ell(c, x, 330, 175, 215), CHS, 6); shape(c, () => ell(c, x, 330, 148, 188), INNER, 4); });
  embryo(c, 320, 260, 90, 0);
  [[360, 1], [720, 1]].forEach(([x]) => peanutHalf(c, x, 770, 130, 160, 0));
  embryo(c, 360, 715, 60, 0);
};

// a2: four plates, whole moong and raw peanut sprout; split dal and roasted peanut do not
const tick = (c: Ctx, x: number, y: number) => line(c, [[x - 28, y], [x - 8, y + 24], [x + 32, y - 28]], 14, COL.greenDk);
const cross = (c: Ctx, x: number, y: number) => { line(c, [[x - 26, y - 26], [x + 26, y + 26]], 14, RED); line(c, [[x + 26, y - 26], [x - 26, y + 26]], 14, RED); };
const kernel = (c: Ctx, x: number, y: number, r: number, rot: number, roast: boolean) => {
  shape(c, () => ell(c, x, y, r, r * 0.72, rot), roast ? "#9a5a2c" : "#e4b79a", Math.max(3, r * 0.14));
  line(c, [[x - Math.cos(rot) * r * 0.5, y - Math.sin(rot) * r * 0.5], [x + Math.cos(rot) * r * 0.5, y + Math.sin(rot) * r * 0.5]], 3, roast ? "#6e3a18" : "#c98b6a");
};
const a2 = (c: Ctx) => {
  ground(c);
  const P = [[280, 330], [800, 330], [280, 780], [800, 780]];
  P.forEach(([x, y]) => { plate(c, x, y, 230, 130); shape(c, () => ell(c, x, y - 4, 170, 90), "#f7f3e8", 3); });
  [-70, 0, 70].forEach((dx, i) => { tail(c, [[280 + dx, 330 + (i % 2) * 20], [280 + dx + 20, 360 + (i % 2) * 20], [280 + dx + 10, 390 + (i % 2) * 20]], 9); seed(c, 280 + dx, 330 + (i % 2) * 20, 34, 0.3 * i, true); });
  [[-70, 0], [0, 20], [70, 0], [-30, 40]].forEach(([dx, dy], i) => { const x = 800 + dx, y = 330 + dy; shape(c, () => ell(c, x, y, 34, 24, i), "#f0d25a", 4); line(c, [[x - 20, y], [x + 20, y]], 3, "#c9a43a"); });
  [-70, 0, 70].forEach((dx, i) => { const x = 280 + dx, y = 780 + (i % 2) * 20; tail(c, [[x, y], [x + 18, y + 28], [x + 4, y + 56]], 9); kernel(c, x, y, 40, 0.4 * i, false); });
  [-70, 0, 70, -30].forEach((dx, i) => kernel(c, 800 + dx, 780 + (i === 3 ? 40 : (i % 2) * 20), 40, 0.4 * i, true));
  tick(c, 120, 140); tick(c, 120, 590); cross(c, 960, 140); cross(c, 960, 590);
};

// a4: a clear jar, wet paper, chana lying every way; roots curve down, shoots curve up
const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 950, 330, 40);
  shape(c, () => rrect(c, 250, 130, 560, 800, 36), "#e6f1fa", 6);
  shape(c, () => rrect(c, 290, 180, 480, 700, 22), "#bcd6ee", 4);
  const S: [number, number, number][] = [[400, 430, 0.6], [600, 360, -0.9], [540, 640, 2.4]];
  S.forEach(([x, y, rot]) => {
    const bx = x + Math.cos(rot) * 38, by = y + Math.sin(rot) * 38;
    tail(c, [[bx, by], [bx + (Math.cos(rot) > 0 ? 36 : -36), by + 40], [bx + (Math.cos(rot) > 0 ? 24 : -24), by + 120]], 13);
    line(c, [[x - Math.cos(rot) * 20, y - Math.sin(rot) * 20 - 20], [x - 30, y - 90], [x - 24, y - 150]], 20, INK); line(c, [[x - Math.cos(rot) * 20, y - Math.sin(rot) * 20 - 20], [x - 30, y - 90], [x - 24, y - 150]], 11, COL.greenLt);
    chana(c, x, y, 46, rot, true);
  });
  shape(c, () => rrect(c, 250, 130, 560, 800, 36), "rgba(255,255,255,0.12)", 6);
  shine(c, [[290, 200], [290, 500]], 10);
  shape(c, () => rrect(c, 235, 100, 590, 44, 12), COL.steel, 6);
  arrow(c, [[900, 330], [900, 600]]);
};

// a3: a soaked moong and a sprout in two katori, a child who has tasted
const a3 = (c: Ctx) => {
  ground(c);
  bowl(c, 240, 700, 170, "#e7e6c2");
  seed(c, 200, 690, 40, 0.3, true); seed(c, 280, 700, 40, 2.7, true);
  bowl(c, 640, 700, 170, "#e7e6c2");
  [[600, 690, 1], [680, 705, -1]].forEach(([x, y, sg], i) => { tail(c, [[x, y], [x + sg * 26, y + 26], [x + sg * 10, y + 52]], 10); seed(c, x, y, 40, 0.3 + i, true); });
  star(c, 640, 480, 50); star(c, 540, 420, 28); star(c, 740, 410, 30);
  person(c, 930, 960, 560, { armR: [-1.3, 2.84] });
};

// a5: a child curled like a seed, then big and swollen, then standing up like a shoot
const a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 190, 900, 130, 24);
  shape(c, () => ell(c, 190, 800, 120, 95), CLOTH.child, 6); shade(c, () => ell(c, 190, 800, 120, 95), CLOTH.childDk, 30, 20);
  shape(c, () => ell(c, 130, 745, 52, 52), SKIN.child, 5); shape(c, () => { c.moveTo(80, 735); c.quadraticCurveTo(130, 670, 180, 735); c.closePath(); }, CLOTH.hair, 5);
  person(c, 540, 930, 600, { armL: [Math.PI, Math.PI], armR: [0, 0] });
  person(c, 900, 930, 600, { armL: [-1.9, -1.7], armR: [-1.25, -1.45] });
  arrow(c, [[300, 460], [400, 460]]); arrow(c, [[640, 460], [740, 460]]);
  drop(c, 440, 230, 16); drop(c, 640, 260, 16);
};

// a6: seeds lined up from tiny to big
const a6 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 720, 480, 40);
  shape(c, () => rrect(c, 40, 420, 1000, 270, 28), COL.steel, 6);
  shape(c, () => rrect(c, 70, 450, 940, 210, 18), COL.steelIn, 4);
  const xs = [120, 260, 400, 560, 750, 920];
  xs.forEach((x) => line(c, [[x, 480], [x, 480]], 1, INK));
  seed(c, xs[0], 560, 11, 0.3, false, "#2d2a2a", "#111"); seed(c, xs[0] + 22, 570, 11, 1, false, "#2d2a2a", "#111"); seed(c, xs[0] - 18, 575, 11, 2, false, "#2d2a2a", "#111");
  seed(c, xs[1], 560, 14, 0.3, false, "#c9a43a", "#9c7c1c"); seed(c, xs[1] + 28, 575, 14, 1.2, false, "#c9a43a", "#9c7c1c");
  seed(c, xs[2], 560, 30, 0.3, false);
  chana(c, xs[3], 560, 46, 0.3);
  rajma(c, xs[4], 560, 66, 0.2);
  kernel(c, xs[5], 565, 78, -0.2, false);
  arrow(c, [[120, 800], [920, 800]]);
};

// p1: a rajma seedling against the side of a clear cup, and a diary page with drawings
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 580, 170, 420, 700, 16), WHITE, 6);
  for (let k = 0; k < 7; k++) line(c, [[610, 260 + k * 85], [970, 260 + k * 85]], 3, COL.grey);
  [[660, 3], [790, 2], [920, 1]].forEach(([x, k], i) => {
    const h = 40 + i * 50; line(c, [[x, 330 + i * 0], [x, 330 - h]], 8, COL.greenDk);
    if (i) { shape(c, () => ell(c, x - 22, 330 - h, 24, 14, -0.4), COL.leaf, 3); shape(c, () => ell(c, x + 22, 330 - h, 24, 14, 0.4), COL.leaf, 3); }
    void k;
  });
  write(c, "1", 645, 360, 50, INK, 7); write(c, "5", 775, 360, 50, INK, 7); write(c, "9", 905, 360, 50, INK, 7);
  cup(c, 270, 900, 340, 560, () => {
    c.fillStyle = COL.soil; c.fillRect(0, 560, 600, 400);
    c.fillStyle = COL.soilDk; c.globalAlpha = 0.55; c.fillRect(300, 560, 400, 400); c.globalAlpha = 1;
    tail(c, [[160, 640], [150, 720], [190, 780], [175, 830]], 12);
    tail(c, [[160, 640], [215, 700], [260, 760]], 8);
    line(c, [[160, 640], [160, 520], [150, 380]], 22, INK); line(c, [[160, 640], [160, 520], [150, 380]], 12, COL.greenLt);
    shape(c, () => ell(c, 105, 370, 48, 28, -0.5), COL.leaf, 5); shape(c, () => ell(c, 195, 360, 48, 28, 0.5), COL.leaf, 5);
    rajma(c, 160, 640, 46, 1.1);
  });
};

// c1: a stopwatch and a sprouted moong beside a ruler, 1 cm of root
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 760, 190, 30);
  shape(c, () => rrect(c, 280, 220, 40, 50, 8), COL.steelDk, 5);
  shape(c, () => ell(c, 300, 480, 210, 210), COL.steel, 6);
  shape(c, () => ell(c, 300, 480, 170, 170), WHITE, 5);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[300 + Math.cos(a) * 140, 480 + Math.sin(a) * 140], [300 + Math.cos(a) * 160, 480 + Math.sin(a) * 160]], 6); }
  line(c, [[300, 480], [300, 360]], 10); line(c, [[300, 480], [380, 520]], 10, RED);
  shape(c, () => ell(c, 300, 480, 14, 14), INK, 0);
  shadow(c, 760, 860, 280, 20);
  shape(c, () => polyP(c, [[560, 720], [1020, 720], [1020, 820], [560, 820]]), COL.wood, 6);
  for (let mm = 0; mm <= 40; mm++) { const x = 620 + mm * 10, h = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; line(c, [[x, 720], [x, 720 + h]], mm % 10 === 0 ? 4 : 2.5); }
  write(c, "0", 610, 760, 30, INK, 5); write(c, "1", 710, 760, 30, INK, 5);
  tail(c, [[620, 680], [660, 690], [720, 695]], 16);
  seed(c, 600, 676, 36, 0.2, true);
  line(c, [[720, 700], [720, 722]], 6, RED);
};

// c2: a seed kit for the Moon base: packets, water, a lamp, and the Moon behind
const c2 = (c: Ctx) => {
  ground(c, "#e6e9f2");
  shape(c, () => ell(c, 800, 250, 190, 190), "#cfcfd4", 6); shade(c, () => ell(c, 800, 250, 190, 190), "#9a9aa4", 50, 40);
  [[740, 200, 34], [880, 300, 26], [770, 320, 22], [860, 190, 16]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.8), "#b2b2ba", 4));
  c.save(); c.translate(-20, -380); c.scale(1.3, 1.3);
  shadow(c, 400, 940, 360, 40);
  shape(c, () => polyP(c, [[120, 650], [700, 650], [740, 930], [80, 930]]), COL.teal);
  shape(c, () => polyP(c, [[120, 650], [700, 650], [690, 700], [130, 700]]), COL.tealDk);
  [[200, 560], [290, 540]].forEach(([x, y], i) => { shape(c, () => rrect(c, x, y, 80, 130, 8), i ? CREAM : "#f2c063", 5); seed(c, x + 40, y + 70, 16, 0.3, false); });
  shape(c, () => rrect(c, 400, 480, 90, 200, 24), COL.glass, 5); shape(c, () => rrect(c, 405, 560, 80, 115, 16), COL.water, 0); shape(c, () => rrect(c, 420, 450, 60, 40, 8), COL.blueDk, 5);
  shape(c, () => rrect(c, 555, 560, 20, 120, 8), COL.steelDk, 5);
  shape(c, () => { c.moveTo(500, 560); c.lineTo(630, 560); c.lineTo(600, 490); c.lineTo(530, 490); c.closePath(); }, COL.yellow, 5);
  shape(c, () => ell(c, 565, 565, 66, 14), COL.orange, 5);
  c.restore();
};

// expl0: a big rajma seed: coat peeling away, two fat halves, the baby plant between them
const expl0 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 36);
  const half = (x: number) => { shape(c, () => ell(c, x, 560, 205, 345, 0), RAJ, 6); shape(c, () => ell(c, x, 560, 188, 328, 0), INNER, 4); shade(c, () => ell(c, x, 560, 188, 328, 0), "#d9b66a", 30, 20, 0.5); };
  half(350); half(740);
  embryo(c, 545, 400, 220, 0);
  shape(c, () => { c.moveTo(930, 120); c.bezierCurveTo(1030, 160, 1040, 260, 990, 330); c.bezierCurveTo(960, 250, 900, 190, 930, 120); c.closePath(); }, RAJ, 5);
  arrow(c, [[900, 360], [960, 330]]);
};

// expl1: chana (two seed leaves) beside a maize kernel (one seed leaf, big food store)
const expl1 = (c: Ctx) => {
  ground(c);
  shadow(c, 280, 860, 220, 30); shadow(c, 810, 860, 200, 30);
  shape(c, () => ell(c, 200, 520, 120, 250, 0), CHS, 6); shape(c, () => ell(c, 365, 520, 120, 250, 0), CHS, 6);
  shape(c, () => ell(c, 200, 520, 96, 220, 0), INNER, 4); shape(c, () => ell(c, 365, 520, 96, 220, 0), INNER, 4);
  embryo(c, 283, 400, 110, 0);
  const k = () => { c.moveTo(640, 240); c.quadraticCurveTo(810, 200, 980, 240); c.quadraticCurveTo(970, 500, 880, 800); c.quadraticCurveTo(810, 850, 740, 800); c.quadraticCurveTo(650, 500, 640, 240); c.closePath(); };
  shape(c, k, COL.yellow, 6);
  c.save(); c.beginPath(); k(); c.clip();
  shape(c, () => { c.moveTo(670, 270); c.quadraticCurveTo(810, 235, 950, 270); c.quadraticCurveTo(940, 520, 870, 760); c.quadraticCurveTo(810, 800, 750, 760); c.quadraticCurveTo(680, 520, 670, 270); c.closePath(); }, WHITE, 4);
  c.restore();
  shape(c, k, "rgba(0,0,0,0)", 6);
  embryo(c, 770, 620, 130, 0);
};

// expl2: four cups: dry, damp and warm, damp and frozen, and drowned under oil
const expl2 = (c: Ctx) => {
  ground(c);
  const xs = [150, 400, 650, 900];
  cup(c, xs[0], 780, 200, 360, cupInner(c, xs[0], 780, 200, 360, "dry"));
  cup(c, xs[1], 780, 200, 360, cupInner(c, xs[1], 780, 200, 360, "damp", 10));
  cup(c, xs[2], 780, 200, 360, cupInner(c, xs[2], 780, 200, 360, "damp"));
  cup(c, xs[3], 780, 200, 360, cupInner(c, xs[3], 780, 200, 360, "water"));
  drop(c, xs[0], 190, 36); line(c, [[xs[0] - 55, 260], [xs[0] + 55, 130]], 14, RED);
  warm(c, xs[1], 280, 110); drop(c, xs[1] + 70, 170, 22);
  flake(c, xs[2], 190, 55);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(xs[3] - 50, 150 + i * 36); for (let k = 0; k < 3; k++) c.quadraticCurveTo(xs[3] - 50 + k * 34 + 8, 138 + i * 36, xs[3] - 50 + k * 34 + 17, 150 + i * 36); c.strokeStyle = COL.waterDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  [xs[0], xs[2]].forEach((x) => cross(c, x, 910)); cross(c, xs[3], 910); tick(c, xs[1], 905);
};

// expl3: sprouts in a dark closed box, and later a plant in soil under the Sun
const sproutPlant = (c: Ctx, x: number, y: number, h: number, bend = 0) => {
  const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([x + bend * t * t, y - h * t]); }
  line(c, pts, 28, INK); line(c, pts, 17, COL.greenLt);
  const tx = pts[10][0], ty = pts[10][1];
  shape(c, () => ell(c, tx - h * 0.28, ty + 6, h * 0.3, h * 0.19, -0.35), COL.leaf, 5); shape(c, () => ell(c, tx + h * 0.28, ty + 6, h * 0.3, h * 0.19, 0.35), COL.leaf, 5);
};
const expl3 = (c: Ctx) => {
  ground(c);
  shadow(c, 290, 880, 260, 36);
  shape(c, () => rrect(c, 60, 480, 460, 380, 30), COL.steel, 6); shade(c, () => rrect(c, 60, 480, 460, 380, 30), COL.steelDk, 40, 30, 0.45);
  shape(c, () => rrect(c, 40, 430, 500, 70, 20), COL.steelDk, 6);
  shape(c, () => rrect(c, 180, 380, 220, 60, 22), COL.steelDk, 6);
  shape(c, () => rrect(c, 130, 550, 320, 240, 24), NAVY, 6);
  const r = rnd(6);
  for (let i = 0; i < 5; i++) { const x = 190 + i * 62; tail(c, [[x, 760], [x + (i % 2 ? 14 : -14), 780], [x, 800]], 7, "#f8f0d0"); seed(c, x, 755, 22, r() * 2, true, "#cfd6a0", "#a9b178"); void r; }
  arrow(c, [[570, 640], [650, 640]]);
  sun(c, 880, 230, 70);
  shadow(c, 860, 900, 160, 26);
  shape(c, () => polyP(c, [[740, 760], [980, 760], [940, 900], [780, 900]]), "#d9774a", 6);
  shape(c, () => ell(c, 860, 762, 124, 22), COL.soil, 5);
  sproutPlant(c, 860, 750, 320, 10);
};

// expl4: a bean with its little scar; water flows in; dry and small, then wet and big
const expl4 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 580, 280, 30);
  seedB(c, 540, 400, 260, -0.15, false, RAJ, RAJD);
  shape(c, () => ell(c, 450, 340, 70, 28, -0.4), "#f4e4cc", 5);
  [[170, 130, 300, 280], [160, 360, 280, 340], [200, 560, 320, 470]].forEach(([x1, y1, x2, y2]) => arrow(c, [[x1, y1], [x2, y2]], COL.waterDk, 10));
  rajma(c, 200, 840, 60, 0.2); rajma(c, 800, 830, 130, 0.2);
  arrow(c, [[330, 840], [610, 840]]);
  drop(c, 440, 770, 20);
};

// expl5: a waking seed takes in air, gives out air and a little warmth
const expl5 = (c: Ctx) => {
  ground(c);
  warm(c, 540, 280, 140);
  shadow(c, 540, 800, 200, 28);
  tail(c, [[540, 640], [570, 700], [540, 770]], 26);
  seedB(c, 540, 560, 150, 0.2, true);
  [[90, 480], [90, 620]].forEach(([x, y]) => { arrow(c, [[x, y], [x + 230, y]], COL.blueDk, 12); shape(c, () => ell(c, x + 70, y - 30, 18, 18), "#dff0ff", 4); });
  [[780, 480], [780, 620]].forEach(([x, y]) => { arrow(c, [[x, y], [x + 220, y]], COL.greyDk, 12); shape(c, () => ell(c, x + 50, y - 30, 18, 18), "#dcd8d0", 4); });
};

// expl7: a seed in soil: the root comes out first and goes down, then the shoot goes up
const stage = (c: Ctx, x: number, root: number, shoot: number) => {
  c.fillStyle = "#bfe0f5"; c.fillRect(x - 160, 120, 320, 480);
  c.fillStyle = COL.soil; c.fillRect(x - 160, 600, 320, 340);
  c.fillStyle = COL.soilDk; c.globalAlpha = 0.5; c.fillRect(x + 20, 600, 140, 340); c.globalAlpha = 1;
  line(c, [[x - 160, 600], [x + 160, 600]], 6);
  if (root) tail(c, [[x, 700], [x + 10, 700 + root * 0.5], [x - 6, 700 + root]], 18);
  if (shoot) { line(c, [[x, 700], [x, 700 - shoot]], 28, INK); line(c, [[x, 700], [x, 700 - shoot]], 17, COL.greenLt); if (shoot > 150) { shape(c, () => ell(c, x - 40, 700 - shoot, 40, 20, -0.5), COL.leaf, 5); shape(c, () => ell(c, x + 40, 700 - shoot, 40, 20, 0.5), COL.leaf, 5); } }
  chana(c, x, 700, 44, 0.3, true);
  shape(c, () => rrect(c, x - 160, 120, 320, 820, 6), "rgba(0,0,0,0)", 6);
};
const expl7 = (c: Ctx) => {
  ground(c);
  stage(c, 190, 60, 0); stage(c, 540, 170, 0); stage(c, 890, 170, 250);
  arrow(c, [[300, 300], [430, 300]]); arrow(c, [[650, 300], [780, 300]]);
};

// expl11: sunlight into a plant, into the seed, and back out when the seed sprouts
const expl11 = (c: Ctx) => {
  ground(c);
  sun(c, 190, 220, 70);
  sproutPlant(c, 190, 800, 300, 0);
  [[100, 620], [280, 640]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 34, 52, 0.5), COL.leafDk, 5); chana(c, x - 6, y - 8, 15, 0); chana(c, x + 8, y + 16, 15, 1); });
  arrow(c, [[330, 520], [420, 520]]);
  shadow(c, 540, 820, 110, 22);
  chana(c, 540, 620, 110, 0.3); star(c, 540, 620, 40);
  arrow(c, [[670, 520], [760, 520]]);
  shadow(c, 900, 820, 120, 22);
  tail(c, [[900, 730], [920, 790], [900, 830]], 18); seedB(c, 900, 660, 100, 0.2, true); star(c, 900, 660, 36);
  [[820, 520], [1000, 540], [960, 440]].forEach(([x, y]) => star(c, x, y, 26));
};

// expl13: a sealed canister on the Moon with a sprout inside, Earth in the black sky
const expl13 = (c: Ctx) => {
  c.fillStyle = "#14182e"; c.fillRect(0, 0, 1080, 1080);
  const r = rnd(2); for (let i = 0; i < 40; i++) { c.fillStyle = "#fff"; c.beginPath(); c.arc(r() * 1080, r() * 560, 2 + r() * 3, 0, 7); c.fill(); }
  shape(c, () => ell(c, 850, 190, 110, 110), COL.blue, 5);
  shape(c, () => { ell(c, 820, 170, 45, 30, 0.3); }, COL.leaf, 0);
  shape(c, () => ell(c, 850, 190, 110, 110), "rgba(0,0,0,0)", 5);
  c.fillStyle = "#b9b9bf"; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 6);
  c.fillStyle = "#9a9aa4"; c.beginPath(); c.ellipse(220, 900, 130, 34, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(860, 960, 160, 40, 0, 0, 7); c.fill();
  shadow(c, 590, 850, 200, 26);
  shape(c, () => rrect(c, 380, 420, 320, 420, 28), "rgba(214,236,250,0.5)", 6);
  c.save(); c.beginPath(); rrect(c, 380, 420, 320, 420, 28); c.clip(); c.fillStyle = COL.soil; c.fillRect(380, 700, 320, 140); c.restore();
  sproutPlant(c, 540, 710, 160, 0);
  shape(c, () => rrect(c, 360, 380, 360, 60, 16), COL.steel, 6);
  shine(c, [[410, 480], [410, 650]], 9);
};

// term1: a moong seed with its green coat peeling off to show the yellow inside
const term1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 880, 360, 40);
  shape(c, () => ell(c, 540, 540, 340, 240, -0.25), "#f4d85a", 6);
  shade(c, () => ell(c, 540, 540, 340, 240, -0.25), "#d2b238", 60, 40, 0.5);
  c.save(); c.beginPath(); ell(c, 540, 540, 340, 240, -0.25); c.clip();
  c.beginPath(); c.moveTo(0, 0); c.lineTo(520, 0); c.bezierCurveTo(600, 220, 400, 360, 520, 700); c.lineTo(0, 1080); c.closePath(); c.fillStyle = COL.green; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.beginPath(); c.moveTo(0, 0); c.lineTo(480, 0); c.bezierCurveTo(560, 220, 360, 360, 480, 700); c.lineTo(0, 1080); c.closePath(); c.fillStyle = COL.greenDk; c.globalAlpha = 0.4; c.fill(); c.globalAlpha = 1; c.restore();
  shape(c, () => ell(c, 540, 540, 340, 240, -0.25), "rgba(0,0,0,0)", 6);
  shape(c, () => { c.moveTo(640, 360); c.bezierCurveTo(760, 300, 850, 330, 830, 430); c.bezierCurveTo(780, 400, 720, 440, 650, 480); c.closePath(); }, COL.green, 6);
  arrow(c, [[760, 250], [820, 320]]);
};

// term4: a bean seedling: two fat seed leaves and two thin true leaves above them
const term4 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 940, 340, 30);
  shape(c, () => rrect(c, 160, 780, 760, 150, 24), COL.soil, 6);
  line(c, [[540, 790], [540, 440], [540, 330]], 26, INK); line(c, [[540, 790], [540, 440], [540, 330]], 15, COL.greenLt);
  shape(c, () => ell(c, 400, 650, 130, 80, -0.25), "#cfd96a", 6); shape(c, () => ell(c, 680, 650, 130, 80, 0.25), "#cfd96a", 6);
  shade(c, () => ell(c, 680, 650, 130, 80, 0.25), "#9aa83a", 30, 20, 0.5);
  [-1, 1].forEach((s) => { shape(c, () => { c.moveTo(540, 440); c.quadraticCurveTo(540 + s * 190, 360, 540 + s * 230, 220); c.quadraticCurveTo(540 + s * 80, 250, 540, 440); c.closePath(); }, COL.leaf, 6); });
  line(c, [[540, 440], [540 - 130, 300]], 3, COL.leafDk); line(c, [[540, 440], [540 + 130, 300]], 3, COL.leafDk);
};

// term5: a dry seed, water and warmth, then a seed with a white root
const term5 = (c: Ctx) => {
  ground(c);
  shadow(c, 220, 700, 150, 28); seedB(c, 220, 600, 120, 0.3, false);
  arrow(c, [[400, 600], [660, 600]]); drop(c, 480, 420, 40); sun(c, 600, 360, 40);
  shadow(c, 860, 760, 150, 28);
  tail(c, [[900, 680], [940, 760], [910, 840]], 24); seedB(c, 860, 620, 130, 0.3, true);
  line(c, [[820, 540], [790, 420], [780, 360]], 24, INK); line(c, [[820, 540], [790, 420], [780, 360]], 14, COL.greenLt);
};

// term7: a seed with a sleeping face and a night cap, resting on other seeds
const term7 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 400, 36);
  scatter(c, 220, 800, 860, 900, 20, 3, (x, y, r) => seed(c, x, y, 50, r, false));
  seedB(c, 540, 600, 270, 0.0, false);
  line(c, [[450, 590], [490, 610], [530, 590]], 9); line(c, [[570, 590], [610, 610], [650, 590]], 9);
  c.beginPath(); c.arc(540, 660, 36, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  shape(c, () => { c.moveTo(380, 450); c.quadraticCurveTo(540, 160, 700, 440); c.quadraticCurveTo(540, 400, 380, 450); c.closePath(); }, RED, 6);
  shape(c, () => ell(c, 690, 330, 40, 40), WHITE, 5);
};

// term10: a half-full cup of dry chana, and a full cup of fat soaked chana
const term10 = (c: Ctx) => {
  ground(c);
  cup(c, 270, 880, 330, 560, () => { c.fillStyle = "rgba(0,0,0,0)"; scatter(c, 120, 640, 420, 860, 70, 3, (x, y, r) => chana(c, x, y, 26, r)); });
  cup(c, 810, 880, 330, 560, () => { scatter(c, 600, 380, 1000, 870, 40, 4, (x, y, r) => chana(c, x, y, 50, r, true)); });
  arrow(c, [[420, 520], [660, 520]]); drop(c, 540, 380, 34);
};

// term16: a ball falling down, and a root growing down
const term16 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 700, 1080, 380); c.fillStyle = COL.soilDk; c.globalAlpha = 0.4; c.fillRect(540, 700, 540, 380); c.globalAlpha = 1;
  line(c, [[0, 700], [1080, 700]], 6);
  shape(c, () => ell(c, 250, 330, 100, 100), COL.red, 6); shade(c, () => ell(c, 250, 330, 100, 100), "#b03a28", 28, 28, 0.6);
  arrow(c, [[250, 470], [250, 640]]);
  seedB(c, 780, 800, 70, 0.3, true);
  tail(c, [[800, 840], [860, 900], [830, 1000]], 20);
  line(c, [[770, 770], [750, 640], [760, 540]], 24, INK); line(c, [[770, 770], [750, 640], [760, 540]], 14, COL.greenLt);
  shape(c, () => ell(c, 710, 530, 50, 24, -0.5), COL.leaf, 5); shape(c, () => ell(c, 810, 520, 50, 24, 0.5), COL.leaf, 5);
  arrow(c, [[940, 790], [940, 970]]);
};

// term17: cool shelves with labelled seed packets and jars
const term17 = (c: Ctx) => {
  c.fillStyle = "#dcecf8"; c.fillRect(0, 0, 1080, 1080);
  flake(c, 920, 120, 60);
  const cols = [COL.yellow, COL.pink, COL.greenLt, "#f2c063", COL.sky, COL.orange];
  [300, 560, 820].forEach((y, k) => {
    shape(c, () => rrect(c, 60, y, 960, 36, 8), COL.wood, 6);
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 150;
      if ((i + k) % 3 === 0) { shape(c, () => rrect(c, x, y - 150, 100, 150, 16), CUPG, 5); seed(c, x + 50, y - 30, 20, 0.2, false); seed(c, x + 30, y - 60, 16, 1, false); seed(c, x + 70, y - 70, 16, 2, false); seed(c, x + 50, y - 100, 18, 0.5, false); shape(c, () => rrect(c, x - 4, y - 168, 108, 26, 8), COL.steel, 5); }
      else { shape(c, () => rrect(c, x, y - 140, 110, 140, 8), cols[(i + k * 2) % 6], 5); shape(c, () => ell(c, x + 55, y - 70, 24, 17, 0.3), COL.greenDk, 4); }
    }
  });
};

// term2: the baby plant inside a split peanut, magnified
const term2 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 820, 230, 30);
  peanutHalf(c, 300, 600, 170, 240, 0.0);
  embryo(c, 300, 450, 60, 0);
  const lx = 700, ly = 520;
  c.save(); c.translate(lx, ly); c.rotate(0); c.restore();
  line(c, [[800, 720], [980, 940]], 40, INK); line(c, [[800, 720], [980, 940]], 26, COL.wood);
  shape(c, () => ell(c, 690, 480, 270, 270), "#fff7e0", 8);
  embryo(c, 690, 400, 250, 0);
  line(c, [[345, 440], [470, 360]], 6, RED);
};

export const ic_seedsAndLifeCyclesSeedsAndGerminationL3 = cards("sci.seeds-and-life-cycles.seeds-and-germination.L3 cards", [
  intro, e1, e2, e3, a1, a2, a4, a3, a5, a6, p1, c1, c2,
  expl0, expl1, expl2, expl3, expl4, expl5, expl7, expl11, expl13,
  term1, term4, term5, term7, term10, term16, term17, term2,
]);
void SKIN; void shine; void COL;
