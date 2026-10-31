import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, write, cards } from "./flatKit";

// sci.materials.what-is-it-made-of.L3 set-up cards (experiments e1 paper, e2 salt, e3 dyes, e4 milk plastic)
const PULP = "#a7a29a", PULPDK = "#8c877f", NEWS = "#ece7da";

// ---- shared pieces
const steam = (c: Ctx, x: number, y: number, n = 3, h = 120) => {
  for (let i = 0; i < n; i++) {
    const sx = x + (i - (n - 1) / 2) * 46, pts: number[][] = [];
    for (let k = 0; k <= 10; k++) pts.push([sx + Math.sin(k * 0.9 + i) * 14, y - (k / 10) * h]);
    line(c, pts, 16, INK); line(c, pts, 9, "#f4f1ea");
  }
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x, y + s * 0.6); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, col, 4);
const news = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, lines = true) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), NEWS, 5);
  if (lines) {
    c.fillStyle = "#8d887f"; c.fillRect(-w / 2 + w * 0.1, -h / 2 + h * 0.1, w * 0.8, h * 0.14);
    for (let i = 0; i < 5; i++) line(c, [[-w / 2 + w * 0.1, -h / 2 + h * (0.4 + i * 0.12)], [w / 2 - w * 0.1, -h / 2 + h * (0.4 + i * 0.12)]], Math.max(3, h * 0.03), "#9b968c");
  }
  c.restore();
};
const scrap = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[-34, -18], [-8, -28], [20, -20], [36, -2], [24, 22], [-6, 26], [-30, 14]]), "#cfc9bb", 4);
  line(c, [[-22, -8], [18, -10]], 4, "#8d887f"); line(c, [[-20, 6], [14, 8]], 4, "#8d887f");
  c.restore();
};
const star = (c: Ctx, x: number, y: number, R: number, r: number, rot = 0) => {
  const p: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r : R; p.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); }
  polyP(c, p);
};
const spoonWood = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 18) => { line(c, [[x1, y1], [x2, y2]], w + 10, INK); line(c, [[x1, y1], [x2, y2]], w, COL.wood); };
const wavyPath = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.quadraticCurveTo(x + w * 0.75, y + h + 26, x + w / 2, y + h); c.quadraticCurveTo(x + w * 0.25, y + h - 26, x, y + h); c.closePath();
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 650, 340, COL.water);
  steam(c, 540, 560, 3, 90);
  [[430, 650, 0.4], [560, 675, -0.3], [650, 635, 0.9], [500, 618, 1.4], [700, 672, 0.1]].forEach(([x, y, r]) => scrap(c, x, y, 1.1, r));
  // the sheet and the torn strip, one hand on each
  news(c, 400, 280, 320, 270, -0.05);
  news(c, 800, 270, 190, 130, 0.12, false);
  c.fillStyle = "#8d887f"; c.save(); c.translate(800, 270); c.rotate(0.12); c.fillRect(-85, -50, 170, 18); for (let i = 0; i < 2; i++) line(c, [[-85, -5 + i * 30], [85, -5 + i * 30]], 5, "#9b968c"); c.restore();
  hand(c, 120, 280, 0.05, 1.3);
  hand(c, 990, 270, Math.PI - 0.1, 1.3);
  // torn bits fall into the water
  [[600, 420, 0.5], [670, 470, -0.6], [560, 480, 1]].forEach(([x, y, r]) => scrap(c, x, y, 1, r));
  arrow(c, [[780, 400], [780, 540]], RED, 12);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 985, 300, 36);
  const jar = () => { c.moveTo(350, 270); c.lineTo(730, 270); c.lineTo(670, 800); c.lineTo(410, 800); c.closePath(); };
  line(c, [[728, 320], [800, 330], [815, 560], [700, 690]], 30, INK);
  line(c, [[728, 320], [800, 330], [815, 560], [700, 690]], 16, COL.tealDk);
  shape(c, () => rrect(c, 330, 790, 420, 200, 36), COL.teal);
  shade(c, () => rrect(c, 330, 790, 420, 200, 36), COL.tealDk, 40, 0);
  shape(c, () => ell(c, 540, 905, 52, 52), WHITE);
  line(c, [[540, 905], [540, 870]], 10);
  shape(c, jar, COL.glass, 5);
  const pulp = () => { c.moveTo(374, 430); c.lineTo(706, 430); c.lineTo(670, 800); c.lineTo(410, 800); c.closePath(); };
  shape(c, pulp, PULP, 0);
  shade(c, pulp, PULPDK, 50, 0, 0.5);
  shape(c, () => ell(c, 540, 430, 166, 28), "#bdb8ae", 5);
  const r = rnd(5);
  for (let i = 0; i < 26; i++) line(c, [[450 + r() * 180, 480 + r() * 280], [470 + r() * 160, 490 + r() * 280]], 4, PULPDK);
  shape(c, jar, "rgba(255,255,255,0.12)", 5);
  shine(c, [[385, 330], [425, 760]], 12);
  shape(c, () => rrect(c, 340, 228, 400, 50, 14), "#3a3540");
  shape(c, () => rrect(c, 495, 190, 90, 44, 12), "#3a3540");
  hand(c, 540, 135, Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[640, 560], [590, 520], [530, 510], [470, 540]], RED, 11);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 480, 36);
  shape(c, () => polyP(c, [[170, 700], [910, 700], [1000, 880], [80, 880]]), COL.teal);
  shape(c, () => polyP(c, [[80, 880], [1000, 880], [1000, 950], [80, 950]]), COL.tealDk);
  shape(c, () => polyP(c, [[225, 722], [855, 722], [925, 850], [155, 850]]), PULP, 5);
  const r = rnd(4);
  for (let i = 0; i < 14; i++) line(c, [[280 + r() * 500, 745 + r() * 80], [300 + r() * 480, 755 + r() * 80]], 4, PULPDK);
  // pulp dripping from the frame back into the tray
  [[320, 3], [450, 2], [590, 3], [720, 2]].forEach(([x, n]) => { line(c, [[x, 540], [x - 4, 640]], 10, INK); line(c, [[x, 540], [x - 4, 640]], 4, "#c8c3ba"); drop(c, x - 5, 665, 14, "#c8c3ba"); if (n === 3) drop(c, x + 30, 610, 10, "#c8c3ba"); });
  // the wooden frame with its net: bare net round the edge, a thick grey layer of pulp on top
  const fr = [[250, 300], [830, 300], [900, 520], [180, 520]], net = [[286, 326], [794, 326], [846, 494], [234, 494]];
  shape(c, () => polyP(c, fr), COL.wood);
  shade(c, () => polyP(c, fr), COL.woodDk, 14, 14);
  shape(c, () => polyP(c, net), "#e9e5da", 5);
  c.save(); c.beginPath(); polyP(c, net); c.clip();
  for (let i = 0; i < 22; i++) { const t = i / 21; line(c, [[286 + t * 508 - 20 * (1 - t), 326], [234 + t * 612, 494]], 2.5, "#9b968c"); }
  for (let j = 1; j < 7; j++) { const t = j / 7; line(c, [[286 - 52 * t, 326 + 168 * t], [794 + 52 * t, 326 + 168 * t]], 2.5, "#9b968c"); }
  c.restore();
  const layer = () => { c.moveTo(335, 350); c.quadraticCurveTo(540, 336, 745, 350); c.quadraticCurveTo(790, 410, 800, 470); c.quadraticCurveTo(540, 490, 280, 470); c.quadraticCurveTo(290, 410, 335, 350); c.closePath(); };
  shape(c, layer, PULP, 5);
  shade(c, layer, PULPDK, 26, 20, 0.55);
  for (let i = 0; i < 18; i++) { const x = 330 + r() * 440, y = 365 + r() * 90; line(c, [[x, y], [x + 30 + r() * 20, y + r() * 12 - 6]], 4, "#d3cec4"); }
  hand(c, 100, 430, 0.1, 1.35);
  hand(c, 980, 430, Math.PI - 0.1, 1.35);
  arrow(c, [[540, 270], [540, 90]], RED, 14);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const sheets: [number, string][] = [[190, "#c6dcef"], [540, "#c6dcef"], [890, "#c6dcef"]];
  const r = rnd(9);
  sheets.forEach(([x, cl], k) => {
    shadow(c, x + 14, 735, 150, 26);
    shape(c, () => rrect(c, x - 155, 290, 310, 430, 12), cl);
    shade(c, () => rrect(c, x - 155, 290, 310, 430, 12), "#9fbad4", 14, 14);
    shape(c, () => rrect(c, x - 130, 320, 260, 370, 6), "#ebe7dd", 5);
    c.save(); c.beginPath(); rrect(c, x - 130, 320, 260, 370, 6); c.clip();
    for (let i = 0; i < 16; i++) line(c, [[x - 120 + r() * 240, 335 + r() * 340], [x - 100 + r() * 240, 340 + r() * 340]], 3, "#cfc9bc");
    if (k === 1) for (let i = 0; i < 14; i++) { const bx = x - 105 + r() * 210, by = 345 + r() * 320, a = r() * 3; line(c, [[bx, by], [bx + Math.cos(a) * 34, by + Math.sin(a) * 34]], 12, INK); line(c, [[bx, by], [bx + Math.cos(a) * 34, by + Math.sin(a) * 34]], 6, COL.green); }
    if (k === 2) for (let i = 0; i < 12; i++) { const bx = x - 100 + r() * 200, by = 350 + r() * 310; shape(c, () => ell(c, bx, by, 24, 11, r() * 3), COL.orange, 4); }
    c.restore();
  });
  // a tuft of grass and a marigold beside the sheets they came from
  for (let i = 0; i < 5; i++) leafAt(c, 520 + i * 18, 880, 90, -Math.PI / 2 + (i - 2) * 0.28);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; shape(c, () => ell(c, 890 + Math.cos(a) * 34, 850 + Math.sin(a) * 34, 28, 16, a), COL.orange, 4); }
  shape(c, () => ell(c, 890, 850, 20, 20), COL.yellow, 4);
};
const leafAt = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  line(c, [[x, y], [tx, ty]], 18, INK); line(c, [[x, y], [tx, ty]], 9, COL.green);
};

// the steel tumbler used in the salt experiment
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, water = true) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.16, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.12), COL.steelDk, 5);
  shape(c, () => ell(c, x, y - h, w * 0.46, w * 0.098), water ? COL.water : COL.steelIn, 4);
  shine(c, [[x - w * 0.36, y - h * 0.85], [x - w * 0.3, y - h * 0.2]], 10);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  tumbler(c, 440, 920, 440, 500);
  // a katori with a heap of salt, the spoon's source
  bowl(c, 860, 840, 120);
  const heap = () => { c.moveTo(755, 836); c.quadraticCurveTo(800, 740, 860, 735); c.quadraticCurveTo(920, 740, 965, 836); c.quadraticCurveTo(860, 868, 755, 836); c.closePath(); };
  shape(c, heap, WHITE, 5); shade(c, heap, "#cfd5df", 24, 14, 0.7);
  // water in the tumbler with salt grains still floating
  [[360, 428, 11], [410, 440, 9], [500, 430, 10], [545, 440, 8]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.8), WHITE, 3));
  // the spoon, heaped with salt, tipping it into the water
  spoonWood(c, 884, 175, 560, 285, 22);
  shape(c, () => ell(c, 510, 300, 70, 34, 0.25), COL.steel, 6);
  shape(c, () => { c.moveTo(450, 298); c.quadraticCurveTo(500, 240, 568, 292); c.quadraticCurveTo(510, 322, 450, 298); c.closePath(); }, WHITE, 4);
  [[470, 345, 11], [500, 372, 12], [455, 385, 10], [520, 405, 9], [485, 330, 9]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.85), WHITE, 3.5));
  hand(c, 990, 110, 2.67, 1.7);
  arrow(c, [[690, 250], [640, 360]], RED, 12);
};

// setup.e2.1
const darkPlate = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 14, y + 22, 190, 62);
  shape(c, () => ell(c, x, y, 190, 62), "#4a4552");
  shape(c, () => ell(c, x, y - 3, 158, 48), "#5d5766", 4);
  shape(c, () => ell(c, x, y - 2, 96, 28), COL.water, 4);
  shine(c, [[x - 50, y - 8], [x - 10, y - 14]], 7);
};
const e2_1 = (c: Ctx) => {
  ground(c, "#f3e9d4");
  // left: a sunny window sill
  c.fillStyle = COL.sky; c.fillRect(0, 0, 540, 760);
  shape(c, () => ell(c, 170, 170, 100, 100), COL.yellow, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[170 + Math.cos(a) * 125, 170 + Math.sin(a) * 125], [170 + Math.cos(a) * 165, 170 + Math.sin(a) * 165]], 9, COL.orange); }
  [[260, 260, 250, 690], [290, 250, 350, 690], [230, 270, 150, 690]].forEach(([a, b, d, e]) => line(c, [[a, b], [d, e]], 5, COL.yellow));
  c.beginPath(); c.moveTo(540, 0); c.lineTo(540, 760); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => polyP(c, [[0, 750], [540, 750], [540, 880], [0, 880]]), COL.wood);
  shape(c, () => polyP(c, [[0, 880], [540, 880], [540, 940], [0, 940]]), COL.woodDk);
  // right: a shady table
  c.fillStyle = "#cbc2dc"; c.fillRect(540, 0, 540, 760);
  [[620, 120, 140], [780, 90, 150], [940, 120, 140], [1040, 230, 120], [700, 250, 130], [870, 270, 130]].forEach(([x, y, r], i) => shape(c, () => ell(c, x, y, r, r * 0.75), i % 2 ? COL.leafDk : COL.leaf, 5));
  [[640, 160], [800, 180], [950, 190]].forEach(([x, y]) => leafAt(c, x, y, 50, 1.2));
  shape(c, () => polyP(c, [[540, 750], [1080, 750], [1080, 880], [540, 880]]), "#b98a5a");
  shape(c, () => polyP(c, [[540, 880], [1080, 880], [1080, 940], [540, 940]]), "#8f6640");
  darkPlate(c, 270, 810);
  darkPlate(c, 810, 810);
};

// setup.e2.2
const cube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x, y], [x + s, y], [x + s, y + s], [x, y + s]]), WHITE, 5);
  shape(c, () => polyP(c, [[x, y], [x + s, y], [x + s * 1.4, y - s * 0.4], [x + s * 0.4, y - s * 0.4]]), "#f0eee8", 5);
  shape(c, () => polyP(c, [[x + s, y], [x + s * 1.4, y - s * 0.4], [x + s * 1.4, y + s * 0.6], [x + s, y + s]]), "#cfd5df", 5);
};
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 440, 130);
  shape(c, () => ell(c, 540, 730, 430, 190), "#4a4552");
  shape(c, () => ell(c, 540, 722, 370, 150), "#5d5766", 4);
  const crust = () => { c.moveTo(250, 720); c.quadraticCurveTo(300, 600, 440, 640); c.quadraticCurveTo(560, 590, 690, 650); c.quadraticCurveTo(820, 640, 830, 740); c.quadraticCurveTo(790, 840, 640, 820); c.quadraticCurveTo(480, 870, 340, 820); c.quadraticCurveTo(230, 800, 250, 720); c.closePath(); };
  shape(c, crust, "#f4f1e8", 5);
  shade(c, crust, "#cfcabd", 20, 24);
  [[330, 740], [450, 780], [560, 700], [690, 760], [760, 700], [400, 690]].forEach(([x, y]) => { c.beginPath(); ell(c, x, y, 16, 10); c.fillStyle = WHITE; c.fill(); });
  // magnifier
  line(c, [[790, 255], [980, 70]], 52, INK); line(c, [[790, 255], [980, 70]], 38, COL.teal);
  shape(c, () => ell(c, 640, 400, 225, 225), "#fffaf0", 0);
  c.save(); c.beginPath(); ell(c, 640, 400, 225, 225); c.clip();
  cube(c, 470, 330, 90); cube(c, 640, 250, 70); cube(c, 700, 400, 100); cube(c, 520, 480, 80); cube(c, 640, 540, 60); cube(c, 440, 400, 50);
  c.restore();
  shape(c, () => ell(c, 640, 400, 225, 225), "rgba(214,236,250,0.18)", 0);
  c.beginPath(); ell(c, 640, 400, 225, 225); c.strokeStyle = INK; c.lineWidth = 40; c.stroke();
  c.beginPath(); ell(c, 640, 400, 225, 225); c.strokeStyle = COL.teal; c.lineWidth = 26; c.stroke();
  shine(c, [[500, 270], [560, 220]], 12);
};

// four pans (turmeric, beetroot, onion skin, tea): the colours are the same in every dye card
const DYE = ["#f2c21b", "#d6457f", "#e58a2b", "#8a5330"];
const DYEDK = ["#c99a0c", "#a82e60", "#bd6a16", "#6a3b20"];
const bits = (c: Ctx, k: number, x: number, y: number) => {
  if (k === 0) shape(c, () => ell(c, x, y, 28, 11, 0.4), "#c47a10", 4);
  if (k === 1) shape(c, () => ell(c, x, y, 20, 12), "#7a1740", 4);
  if (k === 2) shape(c, () => ell(c, x, y, 26, 9, -0.5), "#a85a10", 4);
  if (k === 3) shape(c, () => ell(c, x, y, 12, 7, 0.8), "#3b2412", 3);
};
const POS: number[][] = [[290, 330], [790, 330], [290, 690], [790, 690]];
const flame = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x, y - 46); c.quadraticCurveTo(x + 30, y - 10, x + 18, y + 12); c.quadraticCurveTo(x, y + 20, x - 18, y + 12); c.quadraticCurveTo(x - 30, y - 10, x, y - 46); c.closePath(); }, COL.orange, 4);
  shape(c, () => { c.moveTo(x, y - 18); c.quadraticCurveTo(x + 12, y, x + 6, y + 10); c.quadraticCurveTo(x - 8, y + 12, x - 8, y); c.closePath(); }, COL.yellow, 0);
};
const pan = (c: Ctx, k: number, x: number, y: number) => {
  const left = x < 540, rx = 150, ry = 95;
  shadow(c, x + 16, y + 34, rx + 10, ry);
  [-1, 0, 1].forEach((i) => flame(c, x + i * 60, y + ry + 28));
  shape(c, () => rrect(c, left ? x - rx - 100 : x + rx - 6, y - 14, 106, 28, 12), "#3a3540");
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shape(c, () => ell(c, x, y, rx * 0.88, ry * 0.86), DYE[k], 5);
  shade(c, () => ell(c, x, y, rx * 0.88, ry * 0.86), DYEDK[k], 28, 20, 0.5);
  bits(c, k, x - 50, y - 8); bits(c, k, x + 20, y + 24); bits(c, k, x + 55, y - 24); bits(c, k, x - 20, y + 30);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, "#f3e9d4");
  shape(c, () => rrect(c, 20, 100, 1040, 930, 30), "#4a4552", 6);
  POS.forEach(([x, y], k) => pan(c, k, x, y + 30 * 0));
  steam(c, 790, 230, 3, 70); steam(c, 290, 230, 3, 70);
  spoonWood(c, 810, 905, 790, 700, 20);
  hand(c, 810, 975, -Math.PI / 2, 1.2, SKIN.adult, CLOTH.adult);
  const pts: number[][] = [];
  for (let t = 3.6; t <= 6.0; t += 0.2) pts.push([790 + Math.cos(t) * 90, 685 + Math.sin(t) * 40]);
  arrow(c, pts, RED, 10);
};

// setup.e3.1
const dyeBowl = (c: Ctx, k: number, x: number, y: number) => {
  const r = 190, ry = 66;
  shadow(c, x + 20, y + 190, r, 36);
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + 230, x + r * 0.9, y + 230, x + r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.35, -6);
  shape(c, () => ell(c, x, y, r, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, y + 4, r * 0.9, ry * 0.85), DYE[k], 4);
  // a white cotton cloth heaped in the dye: the soaked part takes the colour, the top stays white
  const cl = () => { c.moveTo(x - 130, y + 14); c.quadraticCurveTo(x - 120, y - 70, x - 50, y - 62); c.quadraticCurveTo(x, y - 100, x + 60, y - 60); c.quadraticCurveTo(x + 135, y - 50, x + 130, y + 16); c.quadraticCurveTo(x, y + 62, x - 130, y + 14); c.closePath(); };
  shape(c, cl, WHITE, 5);
  c.save(); c.beginPath(); cl(); c.clip(); c.globalAlpha = 0.6; c.fillStyle = DYE[k]; c.fillRect(x - 200, y - 10, 400, 120);
  c.globalAlpha = 1; for (let i = -6; i <= 6; i++) { line(c, [[x + i * 22, y - 110], [x + i * 22, y + 70]], 1.5, "#cfc9bc"); line(c, [[x - 140, y - 60 + (i + 6) * 12], [x + 140, y - 60 + (i + 6) * 12]], 1.5, "#cfc9bc"); }
  c.restore();
  line(c, [[x - 70, y - 40], [x - 20, y - 8]], 4); line(c, [[x + 10, y - 66], [x + 40, y - 20]], 4); line(c, [[x + 85, y - 40], [x + 60, y]], 4);
};
const e3_1 = (c: Ctx) => {
  ground(c, "#f3e9d4");
  POS.forEach(([x, y], k) => dyeBowl(c, k, x, y - 10));
  [0, 1, 2].forEach((k) => { const [x, y] = POS[k]; spoonWood(c, x + 190, y - 140, x + 30, y - 10, 14); shape(c, () => ell(c, x + 28, y - 8, 28, 16, 0.5), COL.wood, 5); });
  const [x, y] = POS[3];
  spoonWood(c, x + 150, y - 130, x + 30, y - 10, 16);
  shape(c, () => ell(c, x + 28, y - 8, 30, 17, 0.5), COL.wood, 5);
  hand(c, x + 200, y - 180, 2.36, 1.1);
  arrow(c, [[x - 80, y - 170], [x - 80, y - 90]], RED, 12);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, "#f3e9d4");
  const WASH = ["#f6dd7a", "#e8a9c0", "#eab06a", "#c9a98a"];
  [[60, 150, 0], [630, 150, 1], [60, 590, 2], [630, 590, 3]].forEach(([x, y, k]) => {
    line(c, [[x - 40, y], [x + 430, y]], 12, INK); line(c, [[x - 40, y], [x + 430, y]], 5, COL.brown);
    [[x, DYE[k]], [x + 210, WASH[k]]].forEach(([cx, col], j) => {
      const px = cx as number;
      shadow(c, px + 100, y + 300, 90, 16);
      shape(c, () => wavyPath(c, px, y + 4, 180, 270), col as string);
      shade(c, () => wavyPath(c, px, y + 4, 180, 270), "#00000040", 34, 0, 0.5);
      shape(c, () => rrect(c, px + 60, y - 22, 40, 48, 8), COL.yellow, 5);
      if (j === 1) [[px + 40, y + 340], [px + 100, y + 360], [px + 150, y + 335]].forEach(([dx, dy]) => drop(c, dx, dy, 12));
    });
  });
};

// setup.e4.0
const e4_0 = (c: Ctx) => {
  ground(c);
  bowl(c, 560, 740, 300, "#f6f2e8");
  // the milk pan tipped over the bowl, held by its handle
  const lx = 650, ly = 330, an = 0.4, k = 1.25, ca = Math.cos(an), sa = Math.sin(an);
  c.save(); c.translate(lx, ly); c.rotate(an); c.scale(k, k);
  shape(c, () => rrect(c, -230, 0, 230, 150, 18), COL.steel);
  shade(c, () => rrect(c, -230, 0, 230, 150, 18), COL.steelDk, 40, 0);
  shape(c, () => rrect(c, -380, 14, 160, 26, 8), "#3a3540", 5);
  c.restore();
  const wl = -380 * k - 40, wy = 27 * k;
  hand(c, lx + wl * ca - wy * sa, ly + wl * sa + wy * ca, an, 1.2, SKIN.adult, CLOTH.adult);
  // the stream of milk
  shape(c, () => { c.moveTo(lx + 2, ly + 6); c.bezierCurveTo(lx + 40, ly + 100, lx + 40, ly + 300, lx + 28, 725); c.lineTo(lx - 22, 725); c.bezierCurveTo(lx - 20, ly + 300, lx - 30, ly + 100, lx - 14, ly + 12); c.closePath(); }, "#faf8f2", 5);
  steam(c, 400, 660, 2, 100);
  arrow(c, [[540, 470], [540, 650]], RED, 12);
  // the child's spoon with vinegar
  spoonWood(c, 940, 470, 760, 520, 18);
  shape(c, () => ell(c, 740, 524, 64, 32, 0.1), COL.steel, 5);
  shape(c, () => ell(c, 740, 522, 50, 20, 0.1), "#f6e9a8", 3);
  hand(c, 1000, 450, Math.PI - 0.1, 1.15);
};

// setup.e4.1
const e4_1 = (c: Ctx) => {
  ground(c);
  bowl(c, 500, 720, 330, "#e6dc9a");
  // lumps (curds) in a tea strainer
  const dome = () => { c.moveTo(220, 360); c.bezierCurveTo(240, 600, 760, 600, 780, 360); c.closePath(); };
  shape(c, dome, "#d9dee6", 5);
  c.save(); c.beginPath(); dome(); c.clip();
  for (let i = 0; i < 14; i++) line(c, [[200 + i * 44, 360], [260 + i * 34, 580]], 2.5, COL.steelDk);
  for (let j = 0; j < 6; j++) line(c, [[200, 400 + j * 32], [800, 400 + j * 32]], 2.5, COL.steelDk);
  c.restore();
  [[340, 400, 40], [450, 420, 46], [560, 395, 42], [650, 420, 38], [400, 470, 30], [520, 480, 34], [610, 475, 30]].forEach(([x, y, s]) => {
    const parts: number[][] = [[0, 0, 1], [-0.7, 0.2, 0.7], [0.7, -0.1, 0.75], [0.1, -0.7, 0.65], [0.2, 0.6, 0.6]];
    parts.forEach(([u, v, q]) => shape(c, () => ell(c, x + u * s, y + v * s, s * q, s * q), "#fffdf5", 5));
    parts.forEach(([u, v, q]) => shape(c, () => ell(c, x + u * s, y + v * s, s * q - 1, s * q - 1), "#fffdf5", 0));
    shade(c, () => ell(c, x, y, s * 0.9, s * 0.9), "#ddd5b8", s * 0.3, s * 0.3, 0.4);
  });
  shape(c, () => ell(c, 500, 360, 280, 52), "rgba(255,255,255,0.0)", 6);
  shape(c, () => rrect(c, 760, 330, 230, 38, 16), "#3a3540", 5);
  hand(c, 960, 350, Math.PI, 1.2);
  [[430, 600], [520, 620], [620, 600]].forEach(([x, y]) => drop(c, x, y, 13, "#e6dc9a"));
};

// setup.e4.2
const e4_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 950, 480, 40);
  shape(c, () => polyP(c, [[110, 520], [970, 520], [1030, 920], [50, 920]]), "#f4f1ea");
  for (let i = 0; i < 8; i++) line(c, [[130 + i * 110, 570], [100 + i * 120, 900]], 3, "#d9d4c8");
  // the dried star: pale, hard, with cracks
  shadow(c, 790, 790, 140, 40);
  shape(c, () => star(c, 770, 700, 170, 82, 0.1), "#e9e0c8", 6);
  shade(c, () => star(c, 770, 700, 170, 82, 0.1), "#c4b98f", 14, 14, 0.5);
  line(c, [[740, 650], [770, 700], [750, 750]], 4, "#9b906c");
  // the star cutter with the lump pressed into it
  shadow(c, 340, 790, 170, 40);
  shape(c, () => star(c, 320, 700, 190, 92, 0.1), COL.steel, 6);
  shape(c, () => star(c, 320, 700, 160, 78, 0.1), "#fffdf5", 5);
  shade(c, () => star(c, 320, 700, 160, 78, 0.1), "#d9d2bd", 16, 16, 0.5);
  hand(c, 300, 400, Math.PI / 2 + 0.15, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[560, 330], [560, 500]], RED, 12);
};

export const su_materialsWhatIsItMadeOf = cards("sci.materials.what-is-it-made-of.L3 set-up", [
  e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2,
]);
