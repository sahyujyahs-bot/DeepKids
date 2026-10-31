import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, seed, hand, write, cards } from "./flatKit";

// SEEDS AND GERMINATION L3 · set-up cards. Moong in clear cups on cotton; boiled vs live moong in flasks; chana soaked and weighed.

const CUPG = "rgba(214,236,250,0.28)";
const CHS = "#ecd08e", CHSD = "#cfa95e", CH = "#d9a45a", CHD = "#b57f36";
const BOIL = "#cfc983", BOILD = "#a39a52";

const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - 1.3 * s); c.bezierCurveTo(x + 0.3 * s, y - 0.6 * s, x + s, y - 0.2 * s, x + s, y + 0.4 * s); c.bezierCurveTo(x + s, y + 1.3 * s, x - s, y + 1.3 * s, x - s, y + 0.4 * s); c.bezierCurveTo(x - s, y - 0.2 * s, x - 0.3 * s, y - 0.6 * s, x, y - 1.3 * s); c.closePath(); };
const dropAt = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => dropP(c, x, y, s), col, Math.max(3, s * 0.15));

// a chana (chickpea): round, tan, a small beak
const chana = (c: Ctx, x: number, y: number, r: number, rot: number, soaked = false) => {
  const f = soaked ? CHS : CH, d = soaked ? CHSD : CHD;
  shape(c, () => ell(c, x, y, r, r * 0.88, rot), f, Math.max(2.5, r * 0.18));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.88, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.35, y + r * 0.3, r, r * 0.88, rot); c.fillStyle = d; c.globalAlpha = 0.55; c.fill(); c.restore(); c.globalAlpha = 1;
  line(c, [[x - r * 0.1, y - r * 0.55], [x + r * 0.15, y - r * 0.25], [x + r * 0.05, y + r * 0.05]], Math.max(2, r * 0.13), d);
};
const boiledMoong = (c: Ctx, x: number, y: number, r: number, rot: number) => { seed(c, x, y, r, rot, true, BOIL, BOILD); line(c, [[x - Math.cos(rot) * r * 0.5, y - Math.sin(rot) * r * 0.5 + r * 0.2], [x + Math.cos(rot) * r * 0.5, y + Math.sin(rot) * r * 0.5 + r * 0.2]], Math.max(2, r * 0.2), "#f3e7a0"); };

// a heap of seeds in a mouth (ellipse rx, ry at x, y) rising hm above it; one(x, y, rot) draws a seed
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, hm: number, one: (sx: number, sy: number, rot: number) => void, base: string, cnt: number, sd: number) => {
  const dome = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.9, y - hm * 1.35, x + rx * 0.9, y - hm * 1.35, x + rx, y); c.ellipse(x, y, rx, ry, 0, 0, Math.PI, false); c.closePath(); };
  shape(c, dome, base, 0);
  const r = rnd(sd), pts: number[][] = [];
  for (let i = 0; i < cnt; i++) { const u = r() * 1.84 - 0.92, top = y - hm * (1 - u * u), bot = y + ry * Math.sqrt(1 - u * u); pts.push([x + u * rx, top + r() * (bot - top), r() * 3]); }
  pts.sort((a, b) => a[1] - b[1]);
  c.save(); c.beginPath(); dome(); c.clip(); pts.forEach(([sx, sy, rt]) => one(sx, sy, rt)); c.restore();
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
};

// a clear plastic cup, bottom centre (x, y); inner() draws the contents (clipped to the cup)
const cupP = (c: Ctx, x: number, y: number, w: number, h: number) => () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
const cup = (c: Ctx, x: number, y: number, w: number, h: number, inner?: () => void) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  if (inner) { c.save(); c.beginPath(); cupP(c, x, y, w, h)(); c.clip(); inner(); c.restore(); }
  shape(c, cupP(c, x, y, w, h), CUPG, 5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), "rgba(255,255,255,0.25)", 5);
  shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.28, y - h * 0.2]], 7);
};
// cotton in a cup with 10 moong on top. wet: damp cotton; tails: how many seeds have a white root
type CupKind = "dry" | "damp" | "water";
const cupInner = (c: Ctx, x: number, y: number, w: number, h: number, kind: CupKind, tails = 0) => () => {
  const f = 0.42, yt = y - h * f, half = w * 0.4 + w * 0.1 * f, ry = w * 0.1, wet = kind !== "dry";
  c.fillStyle = wet ? "#bcd6ee" : COL.cloth; c.fillRect(x - w / 2, yt, w, y - yt);
  c.fillStyle = wet ? "#8fb3dc" : "#e4dccb"; c.fillRect(x + w * 0.12, yt, w, y - yt);
  shape(c, () => ell(c, x, yt, half, ry), wet ? "#d6e8f8" : "#fffdf6", 3);
  if (wet) { const r = rnd(5); for (let i = 0; i < 4; i++) shape(c, () => ell(c, x - half * 0.7 + r() * half * 1.4, yt + h * 0.06 + r() * h * 0.2, 6, 4), COL.drop, 2); }
  const sr = w * 0.1, rows = [[yt - ry * 0.55, 0.78], [yt + ry * 0.6, 0.7]];
  let k = 0;
  rows.forEach(([ry2, spread], row) => { for (let i = 0; i < 5; i++) {
    const sx = x - half * spread + (i + (row ? 0.5 : 0)) * (half * spread * 2) / 5 + sr * 0.5;
    if (k < tails) { const sgn = k % 2 ? 1 : -1; const tl: number[][] = [[sx, ry2 + 2], [sx + sgn * sr * 0.9, ry2 + sr * 2.2], [sx + sgn * sr * 0.5, ry2 + sr * 4]]; line(c, tl, 15, INK); line(c, tl, 8, WHITE); }
    seed(c, sx, ry2, sr, 0.2 * (i - 2) + row, false); k++;
  } });
  if (kind === "water") {
    const wy = y - h * 0.92;
    c.fillStyle = "rgba(143,195,234,0.75)"; c.fillRect(x - w / 2, wy, w, y - wy);
    c.fillStyle = "rgba(95,159,211,0.45)"; c.fillRect(x + w * 0.12, wy, w, y - wy);
    c.fillStyle = "rgba(255,200,40,0.92)"; c.fillRect(x - w / 2, wy, w, h * 0.08);
    c.fillStyle = "rgba(255,236,150,0.9)"; c.fillRect(x - w / 2, wy, w, h * 0.025);
  }
};

// paper tag with a picture: dry / damp / fridge / water / light, and the cup number
const tag = (c: Ctx, x: number, y: number, kind: string, n: number) => {
  shape(c, () => rrect(c, x - 72, y - 52, 144, 104, 12), "#ffffff", 5);
  write(c, String(n), x - 58, y - 28, 44, INK, 7);
  const ix = x + 24, iy = y;
  if (kind === "dry") { dropAt(c, ix, iy, 20); line(c, [[ix - 30, iy + 28], [ix + 30, iy - 30]], 8, RED); }
  else if (kind === "damp") { dropAt(c, ix - 14, iy + 4, 17); dropAt(c, ix + 16, iy - 8, 13); }
  else if (kind === "water") { for (const dy of [-18, 4, 26]) { c.beginPath(); c.moveTo(ix - 30, iy + dy); for (let k = 0; k < 3; k++) c.quadraticCurveTo(ix - 30 + k * 20 + 5, iy + dy - 12, ix - 30 + k * 20 + 10, iy + dy); c.strokeStyle = COL.waterDk; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); } }
  else if (kind === "fridge") { for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[ix - Math.cos(a) * 30, iy - Math.sin(a) * 30], [ix + Math.cos(a) * 30, iy + Math.sin(a) * 30]], 6, COL.blueDk); } }
  else { shape(c, () => ell(c, ix, iy, 15, 15), COL.yellow, 4); for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[ix + Math.cos(a) * 22, iy + Math.sin(a) * 22], [ix + Math.cos(a) * 33, iy + Math.sin(a) * 33]], 5, COL.orange); } }
};

const CUPX = [125, 330, 535, 740, 945], KINDS = ["dry", "damp", "fridge", "water", "light"];
const fiveCups = (c: Ctx, kinds: CupKind[], tagsToo = true) => {
  CUPX.forEach((x, i) => cup(c, x, 760, 170, 320, cupInner(c, x, 760, 170, 320, kinds[i])));
  if (tagsToo) CUPX.forEach((x, i) => tag(c, x, 900, KINDS[i], i + 1));
};

// setup.e1.0 five identical cups, cotton and 10 moong each, labelled with a picture
const e1_0 = (c: Ctx) => { ground(c); fiveCups(c, ["dry", "dry", "dry", "dry", "dry"]); };

// setup.e1.1 a hand wets cups 2, 3, 5; cup 4 full of water with oil on top; cup 1 dry
const e1_1 = (c: Ctx) => {
  ground(c);
  fiveCups(c, ["dry", "damp", "damp", "water", "damp"]);
  hand(c, 180, 170, 0.3, 2.0);
  c.save(); c.translate(320, 220); c.rotate(1.1); bowl(c, 0, 0, 100); c.restore();
  [[368, 340], [362, 395], [374, 450]].forEach(([x, y]) => dropAt(c, x, y, 13, COL.water));
  arrow(c, [[480, 270], [480, 400]]);
};

// setup.e1.2 cups 1, 2, 4 under plates, cup 5 under clear plastic on a bright shelf; cup 3 covered in the fridge
const e1_2 = (c: Ctx) => {
  ground(c);
  // window
  shape(c, () => rrect(c, 40, 70, 600, 330, 14), COL.sky, 6);
  line(c, [[340, 70], [340, 400]], 8); line(c, [[40, 235], [640, 235]], 8);
  c.globalAlpha = 0.5; line(c, [[90, 120], [180, 120]], 12, WHITE); line(c, [[400, 300], [500, 300]], 12, WHITE); c.globalAlpha = 1;
  // shelf
  shape(c, () => polyP(c, [[30, 770], [650, 770], [650, 830], [30, 830]]), COL.wood, 6);
  shade(c, () => polyP(c, [[30, 770], [650, 770], [650, 830], [30, 830]]), COL.woodDk, 0, 22, 0.6);
  const xs = [110, 250, 390, 530], cs: (CupKind)[] = ["dry", "damp", "water", "damp"], nums = [1, 2, 4, 5];
  xs.forEach((x, i) => {
    cup(c, x, 768, 120, 200, cupInner(c, x, 768, 120, 200, cs[i]));
    if (i < 3) plate(c, x, 568, 84, 22);
    else {
      shape(c, () => { c.moveTo(x - 68, 570); c.bezierCurveTo(x - 66, 480, x + 66, 480, x + 68, 570); c.closePath(); }, "rgba(255,255,255,0.45)", 5);
      shape(c, () => rrect(c, x - 64, 562, 128, 14, 6), RED, 4);
      shine(c, [[x - 40, 520], [x - 34, 548]], 6);
    }
    write(c, String(nums[i]), x - 12, 785, 34, INK, 6);
  });
  // fridge
  const fx = 700;
  shadow(c, fx + 190, 925, 220, 28);
  shape(c, () => polyP(c, [[fx - 30, 125], [fx + 20, 100], [fx + 20, 900], [fx - 30, 925]]), COL.steelDk, 6);
  shape(c, () => rrect(c, fx + 10, 90, 340, 820, 24), COL.steel, 6);
  shape(c, () => rrect(c, fx + 40, 125, 280, 750, 12), "#eaf6fb", 5);
  [330, 560].forEach((yy) => shape(c, () => rrect(c, fx + 40, yy, 280, 16, 5), COL.glass, 4));
  cup(c, fx + 180, 560, 120, 200, cupInner(c, fx + 180, 560, 120, 200, "damp"));
  plate(c, fx + 180, 360, 84, 22);
  write(c, "3", fx + 168, 590, 34, INK, 6);
  for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[fx + 180 - Math.cos(a) * 44, 215 - Math.sin(a) * 44], [fx + 180 + Math.cos(a) * 44, 215 + Math.sin(a) * 44]], 8, COL.blueDk); }
  line(c, [[fx - 5, 400], [fx - 5, 520]], 10);
};

// setup.e1.3 counting the seeds with a root, writing the numbers in a table
const e1_3 = (c: Ctx) => {
  ground(c);
  const xs = [192, 357, 522, 687, 852], tl = [0, 7, 0, 0, 8];
  xs.forEach((x, i) => cup(c, x, 500, 150, 260, cupInner(c, x, 500, 150, 260, i === 3 ? "water" : i === 0 ? "dry" : "damp", tl[i])));
  // table
  shape(c, () => rrect(c, 20, 580, 925, 330, 12), WHITE, 6);
  line(c, [[110, 580], [110, 910]], 5);
  for (let i = 1; i < 5; i++) line(c, [[110 + i * 165, 580], [110 + i * 165, 910]], 5);
  line(c, [[20, 745], [945, 745]], 5);
  shape(c, () => ell(c, 65, 662, 30, 30), COL.teal, 4); write(c, "2", 52, 645, 34, WHITE, 6);
  shape(c, () => ell(c, 65, 828, 30, 30), COL.orange, 4); write(c, "3", 52, 811, 34, WHITE, 6);
  const d2 = [0, 4, 0, 0, 5], d3 = [0, 7, 0, 0];
  xs.forEach((x, i) => { write(c, String(d2[i]), x - 14, 638, 60, INK, 8); if (i < 4) write(c, String(d3[i]), x - 14, 800, 60, INK, 8); });
  // the hand writing the last number
  const tx = 860, ty = 835, an = 2.2, dx = Math.cos(an), dy = Math.sin(an);
  const hx = tx - 150 * dx, hy = ty - 150 * dy;
  line(c, [[tx, ty], [hx, hy]], 22, INK); line(c, [[tx, ty], [hx, hy]], 12, COL.yellow);
  hand(c, hx - 80 * dx, hy - 80 * dy, an, 1.05);
};

// setup.e2.0 a grown-up pours soaked moong into a steaming pan; the other bowl is left as it is
const e2_0 = (c: Ctx) => {
  ground(c);
  // hob and pan
  shape(c, () => rrect(c, 450, 730, 520, 90, 14), COL.black, 6);
  for (let k = 0; k < 6; k++) { const fx = 520 + k * 76; shape(c, () => { c.moveTo(fx, 735); c.quadraticCurveTo(fx - 18, 705, fx, 678); c.quadraticCurveTo(fx + 18, 705, fx, 735); c.closePath(); }, COL.blue, 3); }
  shadow(c, 710, 840, 290, 26);
  const body = () => rrect(c, 490, 470, 420, 220, 30);
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, 70, 0);
  shape(c, () => rrect(c, 900, 500, 130, 38, 16), COL.steelDk, 6);
  shape(c, () => ell(c, 700, 475, 212, 52), COL.steelIn, 6);
  shape(c, () => ell(c, 700, 479, 188, 38), COL.water, 0);
  [[630, 480], [740, 490], [810, 470], [680, 468]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 11, 8), COL.drop, 2.5));
  // steam
  [700, 790, 860].forEach((sx, i) => { const p = (): number[][] => [[sx, 430], [sx - 22, 380 - i * 8], [sx + 22, 330 - i * 8], [sx - 18, 280 - i * 8], [sx + 10, 235 - i * 8]]; c.beginPath(); p().forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = INK; c.lineWidth = 20; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); line(c, p(), 11, WHITE); });
  // the grown-up's hand tips a katori of soaked moong
  c.save(); c.translate(508, 263); c.rotate(1.15); bowl(c, 0, 0, 100); c.restore();
  hand(c, 390, 220, 0.3, 1.8, SKIN.adult, CLOTH.adult);
  [[548, 360], [556, 392], [546, 424], [558, 452]].forEach(([x, y], i) => seed(c, x, y, 15, i * 1.3, true));
  arrow(c, [[620, 330], [620, 430]]);
  // the other bowl, left as it is
  bowl(c, 220, 810, 190);
  heap(c, 220, 810, 172, 36, 90, (sx, sy, rt) => seed(c, sx, sy, 17, rt, true), COL.greenDk, 60, 4);
};

// a thermometer standing with its bulb at y0, top at y1, red line up to redTop
const thermo = (c: Ctx, x: number, y0: number, y1: number, redTop: number) => {
  shape(c, () => rrect(c, x - 12, y1, 24, y0 - y1, 12), WHITE, 5);
  shape(c, () => rrect(c, x - 5, redTop, 10, y0 - redTop, 5), RED, 0);
  for (let yy = y1 + 36, k = 0; yy < y0 - 12; yy += 24, k++) line(c, [[x + 12, yy], [x + (k % 5 === 0 ? 34 : 24), yy]], 4);
};
// a steel flask, bottom centre (x, y), full of moong, a thermometer standing in it, a loose cotton plug
const flask = (c: Ctx, x: number, y: number, w: number, h: number, live: boolean, tubeTop: number, redTop: number, lift = 0) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  const top = y - h, body = () => rrect(c, x - w / 2, top, w, h, 40);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.2, 0);
  shape(c, () => rrect(c, x - w / 2, y - h * 0.2, w, h * 0.2, 30), COL.teal, 6);
  shape(c, () => ell(c, x, top, w / 2, 40), COL.steelIn, 6);
  shape(c, () => ell(c, x, top, w * 0.43, 30), "#4a4358", 0);
  heap(c, x, top, w * 0.42, 30, 50, (sx, sy, rt) => (live ? seed(c, sx, sy, 17, rt, true) : boiledMoong(c, sx, sy, 17, rt)), live ? COL.greenDk : BOILD, 34, 3);
  thermo(c, x + 30, top + 6 - lift, tubeTop - lift, redTop - lift);
  // a fluffy cotton plug resting loosely in the mouth (left out while the thermometer is still being pushed in)
  if (!lift) [[-40, 6, 26], [-14, -6, 30], [16, -4, 30], [42, 8, 26], [0, 14, 28]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + 30 + dx * 0.9, top + dy + 6, r, r * 0.8), COL.cloth, 4));
  // paper tag: live = a sprout, boiled = hot steam
  const ty = y - h * 0.55;
  shape(c, () => rrect(c, x - 70, ty - 56, 140, 112, 12), WHITE, 5);
  if (live) {
    line(c, [[x, ty + 40], [x, ty - 6]], 8, COL.greenDk); leafAt(c, x, ty - 6, -2.5); leafAt(c, x, ty - 6, -0.65);
  } else {
    [-30, 0, 30].forEach((dx) => { c.beginPath(); c.moveTo(x + dx, ty + 38); c.bezierCurveTo(x + dx - 18, ty + 14, x + dx + 18, ty - 6, x + dx, ty - 38); c.strokeStyle = RED; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); });
  }
};
const leafAt = (c: Ctx, x: number, y: number, an: number) => { const l = 46; shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(an - 0.5) * l, y + Math.sin(an - 0.5) * l, x + Math.cos(an) * l, y + Math.sin(an) * l); c.quadraticCurveTo(x + Math.cos(an + 0.5) * l, y + Math.sin(an + 0.5) * l, x, y); c.closePath(); }, COL.leaf, 4); };

// setup.e2.1 a LIVE flask and a BOILED flask, each full of moong with a thermometer and a loose cotton plug
const e2_1 = (c: Ctx) => {
  ground(c);
  flask(c, 300, 960, 300, 420, true, 270, 420, 100);
  flask(c, 780, 960, 300, 420, false, 270, 420);
  // a hand pushes the thermometer down into the live flask
  hand(c, 330, 130, Math.PI / 2, 1.2);
  arrow(c, [[470, 190], [470, 360]]);
};

const degC = (c: Ctx, t: string, x: number, y: number, h: number) => {
  write(c, t + "°", x, y, h, INK, 8);
  const cx = x + (t.length + 0.1) * h * 0.8 + h * 0.5, cy = y + h * 0.5;
  c.beginPath(); c.arc(cx + h * 0.35, cy, h * 0.42, 0.6, Math.PI * 2 - 0.6); c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
};
// setup.e2.2 reading both thermometers: the LIVE flask a little higher
const e2_2 = (c: Ctx) => {
  ground(c);
  flask(c, 380, 960, 300, 420, true, 200, 300);
  flask(c, 800, 960, 300, 420, false, 200, 420);
  degC(c, "29", 450, 270, 56);
  degC(c, "27", 870, 390, 56);
  hand(c, 150, 300, 0.0, 2.0, SKIN.child, CLOTH.child, true);
};

// kitchen scale with a steel bowl of chana on it, in a 1080-wide design; text on the screen
const scaleOf = (c: Ctx, txt: string, soaked: boolean, bigHeap: number, th = 44) => {
  shadow(c, 575, 925, 400, 50);
  shape(c, () => polyP(c, [[230, 610], [850, 610], [940, 790], [140, 790]]), COL.teal);
  shape(c, () => polyP(c, [[140, 790], [940, 790], [940, 900], [140, 900]]), COL.tealDk);
  shape(c, () => rrect(c, 380, 815, 320, 70, 8), "#22303a", 5);
  write(c, txt, 540 - txt.length * th * 0.3, 850 - th * 0.5, th, "#c9f06b", th > 50 ? 11 : 8);
  shadow(c, 560, 700, 230, 30);
  bowl(c, 540, 580, 250);
  heap(c, 540, 580, 232, 46, bigHeap, (sx, sy, rt) => chana(c, sx, sy, soaked ? 31 : 25, rt, soaked), soaked ? CHSD : CHD, soaked ? 52 : 80, 8);
};

// setup.e3.0 50 g of dry chana in a steel bowl on the scale
const e3_0 = (c: Ctx) => { ground(c); c.save(); c.translate(0, -60); scaleOf(c, "50 g", false, 110); c.restore(); };

// setup.e3.1 a small clear cup filled to the brim with chana and water; a hand presses the lid on
const e3_1 = (c: Ctx) => {
  ground(c);
  cup(c, 540, 960, 420, 520, () => {
    c.fillStyle = "rgba(143,195,234,0.8)"; c.fillRect(100, 470, 900, 520);
    c.fillStyle = "rgba(95,159,211,0.4)"; c.fillRect(580, 470, 500, 520);
    const r = rnd(2);
    for (let row = 0; row < 8; row++) for (let i = 0; i < 6; i++) chana(c, 380 + i * 54 + (row % 2) * 27 + r() * 6, 510 + row * 55 + r() * 6, 29, r() * 3);
  });
  // lid on the rim, with a raised edge
  shape(c, () => ell(c, 540, 440, 236, 40), COL.teal, 6);
  shape(c, () => ell(c, 540, 426, 204, 28), COL.tealDk, 4);
  // a hand pressing down flat on the lid
  hand(c, 540, 228, Math.PI / 2, 1.9, SKIN.child, CLOTH.child, true);
  arrow(c, [[860, 220], [860, 380]]);
};

// setup.e3.2 next day: drained chana weigh about 100 g; the lid on the cup is pushed up by swollen chana
const e3_2 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(-30, 150); c.scale(0.62, 0.62); scaleOf(c, "100 g", true, 130, 58); c.restore();
  const x = 810, y = 900, w = 340, h = 420;
  cup(c, x, y, w, h, () => {
    c.fillStyle = CHSD; c.fillRect(x - w, y - h, 2 * w, h);
    const r = rnd(4);
    for (let row = 0; row < 7; row++) for (let i = 0; i < 5; i++) chana(c, x - 135 + i * 68 + (row % 2) * 34 + r() * 6, y - h + 40 + row * 60 + r() * 6, 36, r() * 3, true);
  });
  // swollen chana pushing up past the rim, and the lid tilted above them
  [[-110, -h - 10], [-30, -h - 22], [60, -h - 14], [130, -h - 4], [10, -h + 4]].forEach(([dx, dy], i) => chana(c, x + dx, y + dy, 36, i * 1.2, true));
  c.save(); c.translate(x, y - h - 62); c.rotate(-0.16);
  shape(c, () => ell(c, 0, 0, 200, 30), COL.teal, 6);
  shape(c, () => ell(c, 0, -10, 170, 20), COL.tealDk, 4);
  c.restore();
  arrow(c, [[x + 235, y - h + 70], [x + 235, y - h - 60]]);
};

export const su_seedsAndLifeCyclesSeedsAndGermination = cards("sci.seeds-and-life-cycles.seeds-and-germination.L3 set-up", [
  e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2,
]);
