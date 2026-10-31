import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, write, cards } from "./flatKit";

// SET-UP CARDS · sci.plants.photosynthesis.L3 · flat kit
const TABLE = "#e8d8b6", DARK = "#2f2b63";
const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.4); c.quadraticCurveTo(x + s * 0.2, y - s * 0.5, x + s, y + s * 0.2); c.arc(x, y + s * 0.2, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.2, y - s * 0.5, x, y - s * 1.4); c.closePath(); };
const starP = (c: Ctx, x: number, y: number, R: number, r: number, rot: number) => { const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = rot + (i * Math.PI) / 5 - Math.PI / 2, k = i % 2 ? r : R; pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k]); } polyP(c, pts); };
const bigLeaf = (c: Ctx, x: number, y: number, len: number, an: number, col: string, vein: string, wf = 0.32) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wf, ny = Math.cos(an) * len * wf, mx = (x + tx) / 2, my = (y + ty) / 2;
  const p = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); };
  shape(c, p, col, 6); shade(c, p, "rgba(0,0,0,0.25)", -len * 0.04, -len * 0.05, 1);
  line(c, [[x, y], [tx - (tx - x) * 0.05, ty - (ty - y) * 0.05]], 4, vein);
};
const whitePlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.05, y + ry * 0.2, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), WHITE);
  shade(c, () => ell(c, x, y, rx, ry), "#cfc8b8", -rx * 0.04, -ry * 0.08, 0.6);
  shape(c, () => ell(c, x, y - ry * 0.02, rx * 0.82, ry * 0.8), "#f6f2ea", 4);
};
// the iodine bottle: brown glass, black rubber dropper top, a label with a drop
const iodine = (c: Ctx, x: number, y: number, held = false) => {
  if (!held) shadow(c, x + 12, y + 4, 75, 16);
  shape(c, () => rrect(c, x - 55, y - 240, 110, 240, 22), "#8a4a1c");
  shade(c, () => rrect(c, x - 55, y - 240, 110, 240, 22), "#5e2f10", -22, -4, 0.6);
  shape(c, () => rrect(c, x - 22, y - 290, 44, 56, 8), "#8a4a1c");
  shape(c, () => rrect(c, x - 30, y - 316, 60, 34, 8), COL.black);
  shape(c, () => rrect(c, x - 20, y - 380, 40, 70, 20), COL.black);
  shape(c, () => rrect(c, x - 36, y - 190, 72, 100, 8), COL.paper, 4);
  shape(c, () => dropP(c, x, y - 140, 17), DARK, 3);
  shine(c, [[x - 40, y - 215], [x - 40, y - 100]], 7);
};
const peg = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -17, -90, 34, 150, 10), COL.wood);
  shade(c, () => rrect(c, -17, -90, 34, 150, 10), COL.woodDk, -9, -2, 0.7);
  line(c, [[0, -88], [0, -10]], 4);
  shape(c, () => ell(c, 0, -8, 22, 22), COL.steel, 5);
  c.restore();
};

// setup.e1.0: a hand presses a straw into a spinach leaf; round holes in the leaf, a pile of discs
const e1_0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 690, 480, 290);
  shadow(c, 500, 700, 380, 34);
  bigLeaf(c, 130, 650, 720, 0, COL.leaf, COL.leafDk);
  for (const [x, y] of [[320, 625], [410, 688], [490, 620], [560, 690]]) { shape(c, () => ell(c, x, y, 28, 19), COL.steelIn, 5); shade(c, () => ell(c, x, y, 28, 19), COL.steelDk, -8, -6, 0.5); }
  // the straw
  const sx = 650;
  shape(c, () => rrect(c, sx - 26, 220, 52, 430, 6), "#f7f2de");
  shade(c, () => rrect(c, sx - 26, 220, 52, 430, 6), COL.tealDk, -14, 0, 0.55);
  for (let k = 0; k < 6; k++) line(c, [[sx - 26, 260 + k * 62], [sx + 26, 290 + k * 62]], 9, COL.teal);
  shape(c, () => ell(c, sx, 220, 26, 8), COL.steelIn, 5);
  shape(c, () => ell(c, sx, 650, 26, 10), "#d9ecd0", 5);
  hand(c, sx - 150, 370, 0, 2.1);
  arrow(c, [[800, 300], [800, 520]]);
  // the discs
  for (const [x, y] of [[765, 840], [830, 836], [798, 806], [865, 850], [735, 862], [805, 872]]) { shape(c, () => ell(c, x, y, 32, 21), COL.green, 5); shade(c, () => ell(c, x, y, 32, 21), COL.greenDk, -9, -7, 0.55); }
};

// setup.e1.1: syringe with leaf discs, a finger on the tip, the plunger pulled back, bubbles
const e1_1 = (c: Ctx) => {
  ground(c);
  const y0 = 470;
  shadow(c, 540, 860, 420, 30);
  shape(c, () => rrect(c, 150, y0 - 20, 130, 40, 8), COL.glass, 5);
  shape(c, () => rrect(c, 270, y0 - 125, 330, 250, 18), COL.glass, 5);
  shape(c, () => rrect(c, 278, y0 - 117, 205, 234, 10), COL.water, 0);
  for (let k = 0; k < 5; k++) line(c, [[330 + k * 40, y0 - 125], [330 + k * 40, y0 - 100 + (k % 2) * -10]], 4);
  const d = [[330, y0 + 60], [405, y0 + 85], [440, y0 + 25], [345, y0 - 20], [420, y0 - 50], [345, y0 + 105]];
  d.forEach(([x, y]) => { shape(c, () => ell(c, x, y, 34, 23), COL.green, 5); shade(c, () => ell(c, x, y, 34, 23), COL.greenDk, -9, -6, 0.55); });
  [[375, y0 + 20, 11], [440, y0 - 5, 9], [390, y0 - 95, 13], [455, y0 + 90, 10], [305, y0 - 60, 8]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.85)", 3));
  shine(c, [[290, y0 - 105], [580, y0 - 105]], 8);
  shape(c, () => rrect(c, 483, y0 - 117, 50, 234, 8), COL.black);
  shape(c, () => rrect(c, 533, y0 - 18, 280, 36, 6), COL.steel);
  shape(c, () => rrect(c, 585, y0 - 140, 24, 280, 8), COL.steelIn, 5);
  shape(c, () => rrect(c, 790, y0 - 100, 34, 200, 10), COL.steelIn, 5);
  hand(c, 930, y0, Math.PI, 1.5);
  arrow(c, [[560, 700], [790, 700]]);
  hand(c, 190, 650, -Math.PI / 2, 1.7, SKIN.child, "#f39a3c", true);
};

// setup.e1.2: cups A and C in the sun (discs float), cup B inside a cardboard box with the front cut away (dark, discs sunk)
const cup = (c: Ctx, x: number, nFloat: number, nSink: number) => {
  const y = 800, w = 210, h = 280, lvl = 0.8;
  glass(c, x, y, w, h, lvl);
  const surf = y - h * lvl;
  for (let i = 0; i < nFloat; i++) { const dx = -66 + i * 44, dy = surf + 14 + (i % 2) * 6; shape(c, () => ell(c, x + dx, dy, 26, 12), COL.green, 4); }
  for (let i = 0; i < nSink; i++) { const dx = -66 + i * 44, dy = y - 14 - (i % 2) * 6; shape(c, () => ell(c, x + dx * 0.9, dy, 26, 12), COL.green, 4); }
};
const e1_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  c.fillStyle = "rgba(255,226,90,0.32)";
  for (const p of [[[480, 175], [535, 215], [330, 520], [60, 520]], [[545, 215], [600, 175], [1020, 520], [750, 520]]]) { c.beginPath(); polyP(c, p); c.fill(); }
  for (let k = 0; k < 14; k++) { const a = (k * Math.PI * 2) / 14; line(c, [[540 + Math.cos(a) * 92, 130 + Math.sin(a) * 92], [540 + Math.cos(a) * 128, 130 + Math.sin(a) * 128]], 9, COL.orange); }
  shape(c, () => ell(c, 540, 130, 76, 76), COL.yellow, 6);
  shade(c, () => ell(c, 540, 130, 76, 76), COL.orange, -16, -16, 0.5);
  cup(c, 165, 4, 0);
  cup(c, 915, 4, 0);
  // the box over the middle cup: front cut open so the dark inside and the cup show
  shadow(c, 560, 806, 230, 26);
  shape(c, () => polyP(c, [[710, 800], [765, 772], [765, 412], [710, 440]]), "#a8773f");
  shape(c, () => polyP(c, [[390, 800], [710, 800], [710, 440], [390, 440]]), COL.black);
  cup(c, 550, 0, 4);
  shape(c, () => polyP(c, [[390, 800], [425, 800], [425, 440], [390, 440]]), "#cf9f66");
  shape(c, () => polyP(c, [[675, 800], [710, 800], [710, 440], [675, 440]]), "#cf9f66");
  shape(c, () => polyP(c, [[390, 440], [710, 440], [710, 500], [390, 500]]), "#cf9f66");
  shape(c, () => polyP(c, [[390, 440], [710, 440], [765, 412], [445, 412]]), "#e4bd88");
};

// setup.e2.0: white plate: potato and rice turn blue-black with iodine, sugar and salt only brown
const heap = (c: Ctx, x: number, y: number, r: number, fill: string, dk: string) => {
  const p = () => { c.moveTo(x - r * 0.92, y); c.bezierCurveTo(x - r * 0.8, y - r * 0.95, x + r * 0.8, y - r * 0.95, x + r * 0.92, y); c.ellipse(x, y, r * 0.92, r * 0.18, 0, 0, Math.PI); c.closePath(); };
  shape(c, p, fill); shade(c, p, dk, -r * 0.25, -r * 0.12, 0.6);
};
const katori = (c: Ctx, x: number, y: number, kind: number) => {
  const r = 120;
  bowl(c, x, y, r);
  heap(c, x, y, r, "#fffdf6", "#e3dccb");
  const g = rnd(11 + kind);
  for (let i = 0; i < 46; i++) {
    const gx = x + (g() - 0.5) * r * 1.5, gy = y - 6 - g() * r * 0.5;
    if (kind === 0) shape(c, () => ell(c, gx, gy, 14, 5.5, g() * 3), "#fffdf6", 2.5);
    else if (kind === 1) shape(c, () => ell(c, gx, gy, 5, 5), "#ffffff", 2);
    else shape(c, () => rrect(c, gx, gy, 9, 9, 1), "#ffffff", 2.5);
  }
  if (kind === 0) shape(c, () => ell(c, x + 4, y - r * 0.45, 50, 30), DARK, 4);
  else { shape(c, () => ell(c, x + 4, y - r * 0.45, 40, 26), "#9a5a22", 4); shine(c, [[x - 12, y - r * 0.5], [x + 2, y - r * 0.57]], 5); }
};
const e2_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 5);
  whitePlate(c, 440, 590, 420, 340);
  // potato slice with a blue-black blot
  shape(c, () => ell(c, 250, 420, 150, 105), "#d8b66a");
  shape(c, () => ell(c, 250, 416, 134, 90), "#f1e1b0", 4);
  shape(c, () => { c.moveTo(190, 405); c.quadraticCurveTo(210, 355, 270, 370); c.quadraticCurveTo(325, 382, 312, 440); c.quadraticCurveTo(295, 480, 245, 465); c.quadraticCurveTo(180, 455, 190, 405); c.closePath(); }, DARK, 4);
  shine(c, [[200, 400], [222, 378]], 6);
  katori(c, 630, 430, 0);
  katori(c, 250, 730, 1);
  katori(c, 630, 730, 2);
  iodine(c, 965, 890);
};

// setup.e2.1: a black paper star clipped on a leaf of a bean plant in the sun on a windowsill
const e2_1 = (c: Ctx) => {
  ground(c, "#f1e6d2");
  shape(c, () => rrect(c, 90, 50, 900, 700, 14), COL.sky, 10);
  c.fillStyle = "rgba(255,226,90,0.3)"; c.beginPath(); polyP(c, [[230, 150], [300, 250], [640, 560], [470, 330]]); c.fill();
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI * 2) / 12; line(c, [[210 + Math.cos(a) * 98, 190 + Math.sin(a) * 98], [210 + Math.cos(a) * 138, 190 + Math.sin(a) * 138]], 9, COL.orange); }
  shape(c, () => ell(c, 210, 190, 80, 80), COL.yellow, 6);
  shade(c, () => ell(c, 210, 190, 80, 80), COL.orange, -16, -16, 0.5);
  // sill
  shape(c, () => polyP(c, [[40, 750], [1040, 750], [1060, 800], [20, 800]]), COL.wood);
  shape(c, () => polyP(c, [[20, 800], [1060, 800], [1060, 870], [20, 870]]), COL.woodDk);
  // pot
  const px = 720;
  shadow(c, px + 20, 800, 170, 18);
  shape(c, () => polyP(c, [[px - 120, 620], [px + 120, 620], [px + 90, 790], [px - 90, 790]]), "#c8683a");
  shade(c, () => polyP(c, [[px - 120, 620], [px + 120, 620], [px + 90, 790], [px - 90, 790]]), "#9a4a24", -34, 0, 0.6);
  shape(c, () => rrect(c, px - 145, 580, 290, 56, 14), "#d77a48");
  shape(c, () => ell(c, px, 584, 135, 16), COL.soil, 4);
  // plant
  line(c, [[px, 590], [px - 6, 520], [px, 450]], 18, INK); line(c, [[px, 590], [px - 6, 520], [px, 450]], 9, COL.green);
  bigLeaf(c, px, 450, 260, -1.2, COL.leaf, COL.leafDk);
  bigLeaf(c, px - 3, 540, 250, -0.1, COL.leaf, COL.leafDk);
  bigLeaf(c, px - 5, 520, 470, -2.85, COL.leaf, COL.leafDk, 0.55);
  // the black star on the big leaf, held by a peg
  const sx = px - 5 - Math.cos(0.29) * 235, sy = 520 - Math.sin(0.29) * 235 + 8;
  shape(c, () => starP(c, sx, sy, 78, 33, 0.15), COL.black, 6);
  peg(c, sx + 62, sy - 50, 0.9);
};

// setup.e2.2: a hand tips the iodine bottle over the leaf on a white plate; blue-black everywhere except a pale star
const e2_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 5);
  whitePlate(c, 450, 640, 410, 290);
  shadow(c, 430, 660, 320, 28);
  bigLeaf(c, 100, 640, 680, 0, DARK, "#6a64b8", 0.5);
  const p = () => starP(c, 440, 637, 100, 42, 0.1);
  shape(c, p, "#e9cb88", 5);
  shade(c, p, "#c9a45a", -10, -10, 0.6);
  line(c, [[110, 640], [200, 640]], 4, "#6a64b8");
  c.save(); c.translate(730, 120); c.rotate(Math.PI + 0.5); c.scale(0.8, 0.8); iodine(c, 0, 0, true); c.restore();
  for (const [x, y, s] of [[585, 440, 17], [592, 510, 19]]) shape(c, () => dropP(c, x, y, s), "#9a5a22", 4);
  hand(c, 805, 215, Math.PI, 1.6);
};

// plant in a glass: the glass, a sprig of hydrilla with its cut end up, a paper clip weighting it
const plantGlass = (c: Ctx, x: number, y: number, w: number, h: number, bubbles: number) => {
  glass(c, x, y, w, h, 0.9);
  const top = y - h * 0.58, p0 = [x, y - 60], c1 = [x - 32, y - h * 0.22], c2 = [x + 34, y - h * 0.38], p1 = [x + 4, top];
  const at = (t: number) => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0], u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1]]; };
  const stem = () => { c.beginPath(); c.moveTo(p0[0], p0[1]); c.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p1[0], p1[1]); };
  const L = w * 0.24;
  for (let i = 0; i < 10; i++) {
    const [sx, sy] = at(0.1 + i * 0.09);
    for (const s of [-1, 1]) for (const k of [0, 1]) { const a = -Math.PI / 2 + s * (0.95 + k * 0.45), l = L * (1 - i * 0.03 - k * 0.15), pts = [[sx, sy], [sx + Math.cos(a - s * 0.25) * l * 0.55, sy + Math.sin(a - s * 0.25) * l * 0.55], [sx + Math.cos(a) * l, sy + Math.sin(a) * l]]; line(c, pts, 14, INK); line(c, pts, 8, COL.greenLt); }
  }
  stem(); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke();
  stem(); c.strokeStyle = COL.green; c.lineWidth = 13; c.stroke();
  shape(c, () => ell(c, p1[0], p1[1], 17, 10), "#efe6b8", 4);
  // paper clip
  const clip = (g: number, col: string, wd: number) => { c.beginPath(); rrect(c, x - 30, y - 120, 60, 106, 28); c.moveTo(x + 14, y - 84); rrect(c, x - 14, y - 100, 28, 74, 13); c.strokeStyle = col; c.lineWidth = wd + g; c.lineCap = "round"; c.stroke(); };
  clip(8, INK, 6); clip(0, COL.steel, 6);
  // bubbles
  const rr = rnd(3);
  for (let i = 0; i < bubbles; i++) { const r = 9 + i * 1.5, by = top - 26 - i * (h * 0.31 / Math.max(bubbles, 6)) * 1.15; shape(c, () => ell(c, p1[0] + (rr() - 0.5) * 20, by, r, r), "rgba(255,255,255,0.88)", 3); }
};

// setup.e3.0: hydrilla in a tall glass of water
const e3_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 920, 1080, 160); line(c, [[0, 920], [1080, 920]], 5);
  plantGlass(c, 540, 940, 340, 740, 0);
};

// ruler (0 at the glass, numbers going left), a desk lamp shining at the glass
const ruler = (c: Ctx) => {
  c.fillStyle = TABLE; c.fillRect(0, 775, 1080, 305); line(c, [[0, 775], [1080, 775]], 5);
  shadow(c, 450, 905, 400, 14);
  shape(c, () => rrect(c, 15, 815, 815, 80, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(18, 876, 809, 16);
  for (let k = 0; k <= 30; k++) { const x = 800 - k * 24.5, hh = k % 5 === 0 ? 34 : k % 1 === 0 ? 20 : 0; line(c, [[x, 815], [x, 815 + hh]], k % 5 === 0 ? 4 : 2.5); }
  for (let k = 0; k <= 30; k += 5) write(c, String(k), 800 - k * 24.5 - (k > 9 ? 17 : 8), 850, 30, INK, 5);
};
const lamp = (c: Ctx, bx: number, hy: number, light: number, gx: number) => {
  c.fillStyle = `rgba(255,226,90,${light})`; c.beginPath(); polyP(c, [[bx + 50, hy - 62], [bx + 50, hy + 62], [gx + 190, hy + 230], [gx + 190, hy - 230]]); c.fill();
  shadow(c, bx + 14, 778, 86, 16);
  shape(c, () => ell(c, bx, 765, 78, 18), COL.tealDk);
  const arm = [[bx, 755], [bx - 40, 610], [bx - 20, hy + 20]];
  line(c, arm, 24, INK); line(c, arm, 12, COL.teal);
  shape(c, () => ell(c, bx - 40, 610, 17, 17), COL.steel, 5);
  const hx = bx - 20;
  shape(c, () => polyP(c, [[hx - 40, hy - 40], [hx + 70, hy - 80], [hx + 70, hy + 80], [hx - 40, hy + 40]]), COL.teal);
  shade(c, () => polyP(c, [[hx - 40, hy - 40], [hx + 70, hy - 80], [hx + 70, hy + 80], [hx - 40, hy + 40]]), COL.tealDk, -6, -30, 0.7);
  shape(c, () => ell(c, hx + 70, hy, 20, 80), "#fff3b0", 6);
  shape(c, () => polyP(c, [[bx - 14, 786], [bx + 14, 786], [bx, 812]]), RED, 4);
};

// setup.e3.1: lamp 10 cm from the glass, a stream of bubbles
const e3_1 = (c: Ctx) => {
  ground(c);
  ruler(c);
  lamp(c, 555, 470, 0.42, 800);
  plantGlass(c, 800, 770, 270, 580, 8);
};

// setup.e3.2: lamp much further away along the ruler, only a few bubbles
const e3_2 = (c: Ctx) => {
  ground(c);
  ruler(c);
  lamp(c, 187, 470, 0.16, 800);
  plantGlass(c, 800, 770, 270, 580, 2);
  arrow(c, [[540, 330], [310, 330]]);
};

export const su_plantsPhotosynthesis = cards("sci.plants.photosynthesis.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
