import type { Ctx } from "./core";
import { ground, shape, ell, polyP, rrect, shadow, shade, shine, line, arrow, person, seed, leaf, rnd, cards, INK, BG, WHITE, RED, COL } from "./flatKit";

// ---- shared pieces
const sepals = (c: Ctx, x: number, y: number, r: number, n = 5, col: string = COL.green) => {
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / n; shape(c, () => ell(c, x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55 * 0.7, r * 0.55, r * 0.2, a), col, 4); }
  shape(c, () => ell(c, x, y, r * 0.22, r * 0.18), COL.greenDk, 3);
};
const tomato = (c: Ctx, x: number, y: number, r: number, cap = true) => {
  shadow(c, x + r * 0.15, y + r * 0.85, r * 0.95, r * 0.18);
  const p = () => ell(c, x, y, r, r * 0.88);
  shape(c, p, COL.red, 6); shade(c, p, "#b83a28", r * 0.3, r * 0.2); shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.4, y - r * 0.5]], 8);
  if (cap) { sepals(c, x, y - r * 0.62, r * 0.62); line(c, [[x, y - r * 0.62], [x + r * 0.05, y - r * 1.0]], 8, COL.greenDk); }
};
const chPath = (c: Ctx, L: number, k: number) => { c.moveTo(0, -32 * k); c.bezierCurveTo(L * 0.35, -44 * k, L * 0.8, -20 * k, L, 12); c.bezierCurveTo(L * 0.8, 8 * k, L * 0.4, 40 * k, 0, 32 * k); c.closePath(); };
const chilli = (c: Ctx, x: number, y: number, L: number, rot = 0, cap = true) => {
  shadow(c, x + L * 0.5, y + 50, L * 0.5, 14);
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => chPath(c, L, 1);
  shape(c, p, COL.green, 6); shade(c, p, COL.greenDk, 0, 14); shine(c, [[L * 0.2, -14], [L * 0.6, -14]], 8);
  if (cap) { line(c, [[0, 0], [-34, -22]], 16, INK); line(c, [[0, 0], [-34, -22]], 8, COL.greenDk); sepals(c, 6, 0, 36); }
  c.restore();
};
const cuke = (c: Ctx, x: number, y: number, L: number, W: number, rot = 0) => {
  shadow(c, x + 10, y + W * 0.7, L * 0.5, 14);
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -L / 2, -W / 2, L, W, W / 2);
  shape(c, p, COL.leafDk, 6); shade(c, p, "#2a5a25", 0, W * 0.3);
  for (let i = 0; i < 9; i++) { shape(c, () => ell(c, -L * 0.4 + i * L * 0.1, i % 2 ? -W * 0.15 : W * 0.15, 6, 4), COL.greenLt, 0); }
  line(c, [[-L * 0.35, -W * 0.32], [L * 0.3, -W * 0.32]], 7, "rgba(255,255,255,0.6)");
  c.restore();
};
const pseed = (c: Ctx, x: number, y: number, r: number, rot = 0, flat = 0.8) => shape(c, () => ell(c, x, y, r, r * flat, rot), "#f6e7a8", 3);
const cutTomato = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.85, r * 0.95, r * 0.18);
  shape(c, () => ell(c, x, y, r, r), COL.red, 6); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), "#f3836a", 0);
  for (let k = 0; k < 3; k++) {
    const a = k * 2.094 + 0.5, cx = x + Math.cos(a) * r * 0.4, cy = y + Math.sin(a) * r * 0.4;
    shape(c, () => ell(c, cx, cy, r * 0.3, r * 0.3), "#f9c29a", 3);
    for (let j = 0; j < 4; j++) pseed(c, cx + Math.cos(j * 1.6) * r * 0.14, cy + Math.sin(j * 1.6) * r * 0.14, r * 0.09, j);
  }
  shape(c, () => ell(c, x, y, r * 0.1, r * 0.1), "#fff2e0", 0);
};
const cutChilli = (c: Ctx, x: number, y: number, L: number) => {
  shadow(c, x + L * 0.5, y + 50, L * 0.5, 14);
  c.save(); c.translate(x, y);
  shape(c, () => chPath(c, L, 1), COL.green, 6);
  c.save(); c.translate(L * 0.02, 0); shape(c, () => chPath(c, L * 0.95, 0.68), "#eaf3c9", 0); c.restore();
  const r = rnd(5);
  for (let i = 0; i < 16; i++) pseed(c, 30 + r() * 80, -12 + r() * 24, 9, r() * 3, 0.9);
  line(c, [[0, 0], [-34, -22]], 16, INK); line(c, [[0, 0], [-34, -22]], 8, COL.greenDk); sepals(c, 6, 0, 36);
  c.restore();
};
const cutCuke = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.85, r * 0.95, r * 0.18);
  shape(c, () => ell(c, x, y, r, r), COL.leafDk, 6); shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), "#e6f0b8", 0);
  shape(c, () => ell(c, x, y, r * 0.5, r * 0.5), "#cfe3a0", 0);
  for (let k = 0; k < 8; k++) { const a = k * 0.785, sx = x + Math.cos(a) * r * 0.36, sy = y + Math.sin(a) * r * 0.36; pseed(c, sx, sy, r * 0.1, a, 0.35); }
};
const lime = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.85, r * 0.9, r * 0.16);
  const p = () => ell(c, x, y, r, r * 0.92);
  shape(c, p, COL.greenLt, 6); shade(c, p, COL.green, r * 0.3, r * 0.2); shine(c, [[x - r * 0.55, y - r * 0.1], [x - r * 0.35, y - r * 0.5]], 7);
};
const wrap = (c: Ctx, x: number, y: number, w: number, h: number) => { // a woven basket, rim centre (x,y)
  shape(c, () => polyP(c, [[x - w / 2, y], [x + w / 2, y], [x + w / 2 - 40, y + h], [x - w / 2 + 40, y + h]]), COL.brown, 6);
  for (let i = 1; i < 4; i++) line(c, [[x - w / 2 + 12 + i * 4, y + (h * i) / 4], [x + w / 2 - 12 - i * 4, y + (h * i) / 4]], 4, COL.soilDk);
  shape(c, () => rrect(c, x - w / 2 - 8, y - 14, w + 16, 28, 14), COL.woodDk, 6);
};
const paper = (c: Ctx, pts: number[][]) => shape(c, () => polyP(c, pts), WHITE, 6);

// ---- 0: flow.e1 whole and cut vegetables
const e1 = (c: Ctx) => {
  ground(c);
  tomato(c, 230, 300, 120); chilli(c, 420, 300, 250); cuke(c, 840, 310, 290, 110, -0.2);
  cutTomato(c, 230, 770, 120); cutChilli(c, 420, 770, 250); cutCuke(c, 840, 770, 105);
  for (const x of [230, 540, 840]) arrow(c, [[x, 470], [x, 590]]);
  // the shared clue: a red ring round the caps and round the seed groups of tomato and chilli
  c.strokeStyle = RED; c.lineWidth = 7; c.setLineDash([14, 12]); c.beginPath(); ell(c, 230, 180, 70, 44); c.stroke(); c.beginPath(); ell(c, 440, 300, 60, 48); c.stroke(); c.setLineDash([]);
};

// ---- 1: flow.e3 mushroom print
const e3 = (c: Ctx) => {
  ground(c);
  paper(c, [[60, 760], [430, 760], [500, 920], [10, 920]]);
  shadow(c, 250, 780, 190, 30);
  const cap = () => { c.moveTo(110, 780); c.bezierCurveTo(100, 560, 400, 560, 390, 780); c.closePath(); };
  shape(c, cap, "#b98558", 6); shade(c, cap, "#8d6038", 40, 20); shine(c, [[170, 700], [200, 640]], 10);
  shape(c, () => ell(c, 250, 780, 140, 22), "#e8d5b0", 5);
  // moon: overnight
  shape(c, () => { c.arc(540, 330, 70, -1.2, 1.2, false); c.arc(570, 330, 60, 1.0, -1.0, true); c.closePath(); }, COL.yellow, 5);
  arrow(c, [[460, 560], [680, 560]]);
  paper(c, [[640, 740], [1010, 740], [1070, 920], [580, 920]]);
  c.save(); c.translate(825, 830); c.scale(1, 0.4);
  for (let i = 0; i < 28; i++) { const a = (i / 28) * 6.283; line(c, [[Math.cos(a) * 60, Math.sin(a) * 60], [Math.cos(a) * 225, Math.sin(a) * 225]], 12, "#8a6a52"); }
  shape(c, () => ell(c, 0, 0, 55, 55), WHITE, 0);
  c.restore();
};

// ---- 2: flow.a1 nested groups with a child
const a1 = (c: Ctx) => {
  ground(c);
  const fills = ["#cfe8e4", "#bfe0f5", "#d7ecc0", "#fbe3a0", "#f9c9a0"];
  [470, 390, 310, 230, 150].forEach((r, i) => { shape(c, () => ell(c, 540, 1000 - r, r, r), fills[i], 6); });
  person(c, 540, 930, 215, { armL: [Math.PI * 0.6, Math.PI * 0.55], armR: [Math.PI * 0.4, Math.PI * 0.45] });
};

// ---- 3: flow.a2 heights of the people at home
const a2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 90, 90, 880, 12), COL.wood, 6);
  for (let i = 0; i <= 10; i++) line(c, [[90, 970 - i * 80], [i % 5 === 0 ? 150 : 125, 970 - i * 80]], 4);
  shadow(c, 600, 975, 380, 24);
  line(c, [[150, 445], [400, 445]], 6, RED); line(c, [[150, 606], [740, 606]], 6, RED);
  person(c, 400, 970, 520, { adult: true }); person(c, 740, 970, 360);
};

// ---- leaf shapes for the key
const leafK = (c: Ctx, x: number, y: number, kind: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const g = [COL.leaf, COL.leafDk, COL.greenLt, COL.green, COL.leaf][kind];
  line(c, [[0, 50], [0, 80]], 8, INK);
  if (kind === 0) { shape(c, () => { c.moveTo(0, 50); c.bezierCurveTo(-60, 20, -40, -50, 0, -70); c.bezierCurveTo(40, -50, 60, 20, 0, 50); }, g, 5); line(c, [[0, 45], [0, -50]], 3, COL.leafDk); }
  if (kind === 1) { line(c, [[0, 60], [0, -70]], 6, INK); for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) shape(c, () => ell(c, sd * 22, 30 - i * 30, 22, 10, -sd * 0.5), g, 4); }
  if (kind === 2) { shape(c, () => { c.moveTo(0, 50); c.bezierCurveTo(-70, 30, -60, -60, 0, -65); c.bezierCurveTo(60, -60, 70, 30, 0, 50); }, g, 5); line(c, [[0, 45], [0, -45]], 3, COL.leafDk); line(c, [[0, 10], [-30, -15]], 3, COL.leafDk); line(c, [[0, 10], [30, -15]], 3, COL.leafDk); }
  if (kind === 3) { for (const a of [-0.9, 0, 0.9]) shape(c, () => { c.save(); c.translate(0, 40); c.rotate(a); c.moveTo(0, 0); c.bezierCurveTo(-30, -30, -20, -85, 0, -95); c.bezierCurveTo(20, -85, 30, -30, 0, 0); c.restore(); }, g, 5); }
  if (kind === 4) { shape(c, () => { c.moveTo(0, 55); c.bezierCurveTo(-90, -10, -50, -80, 0, -35); c.bezierCurveTo(50, -80, 90, -10, 0, 55); }, g, 5); line(c, [[0, 45], [0, -25]], 3, COL.leafDk); }
  c.restore();
};
const wavy = (c: Ctx, x: number, y: number) => { for (const dx of [-24, 0, 24]) line(c, [[x + dx, y], [x + dx + 10, y - 20], [x + dx - 10, y - 40], [x + dx, y - 60]], 6, COL.purple); };
// ---- 4: flow.a4 the leaf key: one question splits the leaves
const a4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 40, 800, 250, 30), COL.cloth, 6);
  [0, 1, 2, 3, 4].forEach((k, i) => leafK(c, 230 + i * 155, 160, k, 0.8));
  arrow(c, [[400, 300], [270, 450]]); arrow(c, [[680, 300], [810, 450]]);
  shape(c, () => rrect(c, 70, 480, 400, 500, 30), "#e5f2d5", 6);
  shape(c, () => rrect(c, 610, 480, 400, 500, 30), "#f3e4e0", 6);
  leafK(c, 160, 790, 0, 0.9); leafK(c, 270, 790, 1, 0.9); leafK(c, 380, 790, 4, 0.9);
  wavy(c, 270, 650);
  leafK(c, 710, 790, 2, 0.9); leafK(c, 830, 790, 3, 0.9);
  line(c, [[250, 540], [275, 570], [330, 510]], 14, COL.greenDk);
  line(c, [[780, 515], [840, 575]], 14, RED); line(c, [[840, 515], [780, 575]], 14, RED);
};

// ---- 5: flow.a5 family tree of kitchen plants
const a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 1000, 300, 28);
  const trunk = () => { c.moveTo(480, 1000); c.quadraticCurveTo(510, 800, 495, 600); c.lineTo(585, 600); c.quadraticCurveTo(570, 800, 600, 1000); c.closePath(); };
  const spots: [number, number][] = [[170, 320], [400, 280], [680, 280], [910, 320]];
  spots.forEach(([x, y]) => { line(c, [[540, 640], [(540 + x) / 2, 540], [x, y + 90]], 36, INK); line(c, [[540, 640], [(540 + x) / 2, 540], [x, y + 90]], 24, COL.brown); });
  shape(c, trunk, COL.brown, 6); shade(c, trunk, COL.soilDk, 25, 0);
  spots.forEach(([x, y]) => shape(c, () => ell(c, x, y, 120, 105), COL.leaf, 6));
  // rice ear, moong seeds, tomato, cucumber
  line(c, [[170, 380], [170, 250]], 6, COL.woodDk);
  for (let i = 0; i < 5; i++) for (const sd of [-1, 1]) shape(c, () => ell(c, 170 + sd * 18, 270 + i * 22, 8, 16, sd * 0.5), COL.wood, 3);
  [[375, 290], [420, 270], [400, 320], [445, 305]].forEach(([x, y], i) => seed(c, x, y, 26, i * 0.7));
  tomato(c, 680, 290, 62); cuke(c, 910, 320, 170, 62, -0.5);
};

// ---- 6: flow.a6 window count
const a6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 90, 700, 640, 18), COL.wood, 6);
  shape(c, () => rrect(c, 85, 125, 630, 570, 6), COL.sky, 5);
  shape(c, () => polyP(c, [[85, 600], [715, 600], [715, 695], [85, 695]]), COL.greenLt, 0);
  const tr = () => { c.moveTo(230, 695); c.lineTo(250, 400); c.lineTo(300, 400); c.lineTo(320, 695); c.closePath(); };
  shape(c, tr, COL.brown, 5); line(c, [[275, 440], [420, 360]], 22, INK); line(c, [[275, 440], [420, 360]], 12, COL.brown);
  shape(c, () => ell(c, 270, 330, 140, 100), COL.leaf, 5); shape(c, () => ell(c, 400, 370, 80, 60), COL.leafDk, 5);
  // crow on the branch
  shape(c, () => ell(c, 420, 322, 40, 26, -0.2), COL.black, 5); shape(c, () => ell(c, 458, 298, 18, 16), COL.black, 5);
  shape(c, () => polyP(c, [[472, 296], [498, 304], [472, 310]]), COL.yellow, 3); line(c, [[415, 348], [415, 362]], 4); line(c, [[430, 348], [430, 362]], 4);
  // butterfly
  for (const sd of [-1, 1]) { shape(c, () => ell(c, 580 + sd * 24, 260, 26, 20, sd * 0.5), COL.orange, 4); shape(c, () => ell(c, 580 + sd * 18, 295, 18, 14, -sd * 0.5), COL.yellow, 4); }
  line(c, [[580, 250], [580, 310]], 8);
  line(c, [[400, 125], [400, 695]], 12, COL.woodDk); line(c, [[85, 410], [715, 410]], 12, COL.woodDk);
  shape(c, () => rrect(c, 30, 725, 740, 40, 12), COL.woodDk, 6);
  shadow(c, 905, 1010, 150, 22);
  person(c, 905, 1000, 560, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.85, Math.PI * 1.05] });
};

// ---- 7: flow.p1 our book of living things
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 860, 440, 40);
  shape(c, () => polyP(c, [[50, 250], [1030, 250], [1030, 850], [50, 850]]), COL.brown, 6);
  const L = () => { c.moveTo(100, 300); c.quadraticCurveTo(320, 270, 535, 320); c.lineTo(535, 820); c.quadraticCurveTo(320, 780, 100, 815); c.closePath(); };
  const R = () => { c.moveTo(980, 300); c.quadraticCurveTo(760, 270, 545, 320); c.lineTo(545, 820); c.quadraticCurveTo(760, 780, 980, 815); c.closePath(); };
  shape(c, L, WHITE, 6); shape(c, R, WHITE, 6);
  for (const d of [8, 16]) { line(c, [[100 - d / 2, 818 + d], [535, 822 + d / 2]], 3, COL.grey); line(c, [[980 + d / 2, 818 + d], [545, 822 + d / 2]], 3, COL.grey); }
  // left page: a potted plant
  shape(c, () => polyP(c, [[250, 700], [390, 700], [370, 780], [270, 780]]), COL.orange, 5);
  line(c, [[320, 700], [320, 480]], 9, INK); line(c, [[320, 700], [320, 480]], 4, COL.leafDk);
  leaf(c, 320, 600, 110, -0.5); leaf(c, 320, 560, 110, -2.6); leaf(c, 320, 510, 100, -1.1); leaf(c, 320, 650, 100, -2.2);
  // right page: a butterfly
  for (const sd of [-1, 1]) { shape(c, () => ell(c, 760 + sd * 70, 500, 75, 55, sd * 0.5), COL.orange, 5); shape(c, () => ell(c, 760 + sd * 55, 620, 52, 38, -sd * 0.5), COL.yellow, 5); }
  shape(c, () => ell(c, 760, 560, 14, 85), INK, 0); line(c, [[755, 480], [735, 430]], 5); line(c, [[765, 480], [785, 430]], 5);
  // pencil
  c.save(); c.translate(820, 930); c.rotate(-0.2);
  shape(c, () => rrect(c, -200, -18, 330, 36, 6), COL.yellow, 5); shape(c, () => polyP(c, [[130, -18], [190, 0], [130, 18]]), COL.wood, 5);
  shape(c, () => polyP(c, [[176, -4], [190, 0], [176, 4]]), INK, 2); shape(c, () => rrect(c, -230, -18, 40, 36, 6), COL.pink, 5);
  c.restore();
};

// ---- 8: term.0 sort: a heap divided into two bowls by colour
const t0 = (c: Ctx) => {
  ground(c);
  tomato(c, 450, 180, 70); lime(c, 560, 200, 52); tomato(c, 650, 170, 62); lime(c, 360, 205, 48);
  arrow(c, [[460, 310], [270, 430]]); arrow(c, [[640, 310], [810, 430]]);
  const b = (x: number) => { shadow(c, x + 10, 960, 250, 28); shape(c, () => { c.moveTo(x - 240, 640); c.bezierCurveTo(x - 220, 960, x + 220, 960, x + 240, 640); c.closePath(); }, COL.steel, 6); shade(c, () => { c.moveTo(x - 240, 640); c.bezierCurveTo(x - 220, 960, x + 220, 960, x + 240, 640); c.closePath(); }, COL.steelDk, 60, -10); };
  b(270); b(810);
  tomato(c, 200, 640, 78); tomato(c, 330, 650, 70); tomato(c, 270, 560, 70);
  lime(c, 750, 640, 62); lime(c, 870, 650, 60); lime(c, 810, 570, 58);
};

// ---- 9: term.9 calyx: flower becomes a fruit with a green cap
const t9 = (c: Ctx) => {
  ground(c);
  // flower
  line(c, [[270, 560], [270, 900]], 14, INK); line(c, [[270, 560], [270, 900]], 7, COL.leafDk);
  leaf(c, 270, 800, 130, -0.4); leaf(c, 270, 760, 130, -2.7);
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 1.2566; shape(c, () => ell(c, 270 + Math.cos(a) * 85, 400 + Math.sin(a) * 85, 70, 30, a), COL.yellow, 5); }
  shape(c, () => ell(c, 270, 400, 36, 36), COL.orange, 5);
  shape(c, () => polyP(c, [[215, 565], [270, 515], [325, 565], [270, 590]]), COL.green, 5);
  arrow(c, [[430, 480], [600, 480]]);
  tomato(c, 790, 600, 190);
  c.strokeStyle = RED; c.lineWidth = 8; c.setLineDash([16, 12]); c.beginPath(); ell(c, 790, 480, 140, 80); c.stroke(); c.setLineDash([]);
};

// ---- 10: term.14 Venn diagram
const t14 = (c: Ctx) => {
  ground(c);
  c.globalAlpha = 0.8; shape(c, () => ell(c, 400, 540, 290, 290), "#fbd0a8", 7); c.globalAlpha = 0.7; shape(c, () => ell(c, 680, 540, 290, 290), "#bcdcf5", 7); c.globalAlpha = 1;
  c.save(); c.beginPath(); ell(c, 400, 540, 290, 290); c.clip(); c.beginPath(); ell(c, 680, 540, 290, 290); c.fillStyle = "#c9b8e8"; c.globalAlpha = 0.9; c.fill(); c.restore(); c.globalAlpha = 1;
  c.beginPath(); ell(c, 400, 540, 290, 290); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); c.beginPath(); ell(c, 680, 540, 290, 290); c.stroke();
  chilli(c, 215, 550, 190, 0.1); lime(c, 840, 540, 70); tomato(c, 540, 540, 80);
};

// ---- 11: expl.5 four baskets of kitchen families
const e5 = (c: Ctx) => {
  ground(c);
  const pos: [number, number][] = [[290, 360], [790, 360], [290, 830], [790, 830]];
  pos.forEach(([x, y]) => shadow(c, x + 10, y + 190, 220, 24));
  // tomato family
  tomato(c, 230, 295, 62); chilli(c, 300, 320, 150, 0.3);
  // gourd family: a cucumber and a bottle gourd
  cuke(c, 740, 320, 150, 62, -0.5);
  shape(c, () => { c.moveTo(830, 350); c.bezierCurveTo(780, 350, 800, 240, 840, 250); c.bezierCurveTo(880, 240, 900, 350, 850, 350); c.closePath(); }, "#cfe5a0", 5);
  // bean family: pods with beans
  for (const [x, y, r] of [[230, 770, -0.4], [320, 780, 0.2]] as number[][]) { c.save(); c.translate(x, y); c.rotate(r); shape(c, () => rrect(c, -20, -110, 40, 200, 20), COL.green, 5); for (let i = 0; i < 4; i++) shape(c, () => ell(c, 0, -70 + i * 45, 9, 14), COL.greenDk, 3); c.restore(); }
  // grass family: ears of grain
  for (const x of [740, 790, 840]) { line(c, [[x, 900], [x, 740]], 6, COL.woodDk); for (let i = 0; i < 5; i++) for (const sd of [-1, 1]) shape(c, () => ell(c, x + sd * 12, 735 + i * 24, 7, 15, sd * 0.5), COL.wood, 3); }
  pos.forEach(([x, y]) => wrap(c, x, y + 20, 440, 170));
};

// ---- 12: expl.7 mushroom and the threads under the soil
const e7 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => polyP(c, [[0, 640], [1080, 640], [1080, 1080], [0, 1080]]), COL.soil, 0);
  shape(c, () => polyP(c, [[-10, 610], [1090, 610], [1090, 650], [-10, 650]]), COL.leaf, 6);
  const r = rnd(3);
  const grow = (x: number, y: number, a: number, len: number, d: number) => {
    if (d > 4) return; const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len;
    line(c, [[x, y], [nx, ny]], 12 - d * 2, INK);
    ths.push(() => line(c, [[x, y], [nx, ny]], 7 - d * 1.2, "#fffaf0"));
    grow(nx, ny, a + 0.5 + r() * 0.4, len * 0.78, d + 1); grow(nx, ny, a - 0.5 - r() * 0.4, len * 0.78, d + 1);
  };
  const ths: (() => void)[] = [];
  for (const a of [Math.PI * 0.2, Math.PI * 0.5, Math.PI * 0.8]) grow(540, 660, a, 150, 0);
  ths.forEach((f) => f());
  // the mushroom: stalk then cap
  shadow(c, 560, 625, 120, 14);
  shape(c, () => rrect(c, 490, 420, 100, 210, 30), "#f4ebd8", 6);
  const cap = () => { c.moveTo(340, 450); c.bezierCurveTo(330, 190, 750, 190, 740, 450); c.quadraticCurveTo(540, 500, 340, 450); c.closePath(); };
  shape(c, cap, "#c99a68", 6); shade(c, cap, "#9c6f42", 50, 30); shine(c, [[420, 340], [470, 270]], 10);
};

export const ic_classificationSortingLivingThingsL3 = cards("sci.classification.sorting-living-things.L3 cards", [e1, e3, a1, a2, a4, a5, a6, p1, t0, t9, t14, e5, e7]);
