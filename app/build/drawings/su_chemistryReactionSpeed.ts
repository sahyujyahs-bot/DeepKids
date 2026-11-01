import type { Ctx } from "./core";
import { COL, INK, BG, RED, WHITE, SH, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, polyP, line, arrow, glass, plate, hand, leaf, write, rnd, cards } from "./flatKit";

// sci.chemistry.reaction-speed.L3 · set-up cards. Same clear tumblers, steel plate, icon tags, potato and ruler on every card of an experiment.

const CLEAR = "#dcecf7", VINEGAR = "#f1dc9a";
const POTATO = "#c99a5e", POTATO_DK = "#a87a42", MASH = "#f3e4b0", MASH_DK = "#dcc886", MASH_LT = "#fbf1cf";
const CARROT = "#f08a2c", CARROT_DK = "#c9681a", CUC = "#8cc269", CUC_DK = "#5f9a45", GINGER = "#e6b94e", GINGER_DK = "#c4963a";
const SHELL = "#f2dcb8", SHELL_DK = "#d5b685";

// a flat shape: colour, a darker tone on the lower right, then the ink outline over both
const solid = (c: Ctx, path: () => void, col: string, dk: string, dx: number, dy: number, w = 6) => {
  shape(c, path, col, 0); shade(c, path, dk, -dx, -dy, 0.7);
  c.beginPath(); path(); c.lineWidth = w; c.strokeStyle = INK; c.lineJoin = "round"; c.lineCap = "round"; c.stroke();
};
// a hand coming in from the right: the kit hand, mirrored
const handM = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s, SKIN.child, CLOTH.child, open); c.restore();
};
// a grated shred with an ink outline
const shred = (c: Ctx, x: number, y: number, an: number, col: string, len = 30) => {
  const p = [[x - Math.cos(an) * len / 2, y - Math.sin(an) * len / 2], [x + Math.cos(an) * len / 2, y + Math.sin(an) * len / 2]];
  line(c, p, 15, INK); line(c, p, 8, col);
};
// a heap of grated vegetable on whatever is below it
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, lt: string, dk: string, seed: number, ground_ = true) => {
  if (ground_) shadow(c, x + rx * 0.12, y + ry * 0.1, rx * 1.05, ry * 0.3);
  const dome = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 0.9, y - ry * 1.5, x + rx * 0.9, y - ry * 1.5, x + rx, y); c.quadraticCurveTo(x, y + ry * 0.7, x - rx, y); c.closePath(); };
  solid(c, dome, col, dk, rx * 0.3, ry * 0.2);
  const r = rnd(seed);
  for (let i = 0; i < Math.round(rx * ry / 55); i++) {
    const u = r() * 1.5 - 0.75, v = 0.1 + r() * 0.75, px = x + u * rx, py = y - v * ry * 1.05 * (1 - u * u), a = r() * Math.PI, L = 14 + r() * 8;
    line(c, [[px - Math.cos(a) * L / 2, py - Math.sin(a) * L / 2], [px + Math.cos(a) * L / 2, py + Math.sin(a) * L / 2]], 6, r() < 0.5 ? lt : dk);
  }
};
// the small pictures on the paper tags
const veg = (c: Ctx, kind: string, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (kind === "none") {
    c.beginPath(); c.arc(0, 0, 32, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 8; c.stroke(); line(c, [[-23, 23], [23, -23]], 9, RED);
  } else if (kind === "potato" || kind === "boiled") {
    const raw = kind === "potato", p = () => ell(c, 0, 8, 44, 30, -0.25);
    solid(c, p, raw ? POTATO : MASH_LT, raw ? POTATO_DK : MASH_DK, 10, 8);
    if (raw) [[-18, 6], [10, 16], [18, 0]].forEach(([ex, ey]) => shape(c, () => ell(c, ex, ey, 4, 3), POTATO_DK, 2));
    else for (const dx of [-16, 0, 16]) line(c, [[dx, -26], [dx + 7, -36], [dx, -46], [dx + 7, -56]], 5, COL.greyDk);
  } else if (kind === "carrot") {
    c.rotate(0.5);
    solid(c, () => { c.moveTo(-34, -19); c.quadraticCurveTo(-42, 0, -34, 19); c.lineTo(52, 0); c.closePath(); }, CARROT, CARROT_DK, 8, 8);
    line(c, [[-10, -10], [-10, -2]], 4, CARROT_DK); line(c, [[12, -6], [12, 2]], 4, CARROT_DK);
    c.rotate(-0.5);
    [-2.5, -2.05, -2.95].forEach((a) => leaf(c, -30, -16, 30, a));
  } else if (kind === "cucumber") {
    c.rotate(-0.35);
    solid(c, () => rrect(c, -50, -17, 100, 34, 17), CUC, CUC_DK, 6, 8);
    line(c, [[-34, -4], [30, -4]], 4, COL.greenLt); line(c, [[-30, 8], [36, 8]], 4, CUC_DK);
    [[-20, -10], [8, 12], [30, -10]].forEach(([dx, dy]) => shape(c, () => ell(c, dx, dy, 3, 2), COL.greenLt, 0));
  } else if (kind === "ginger") {
    const parts: number[][] = [[-30, 8, 26, 17, 0.2], [0, 2, 28, 19, -0.2], [28, -8, 22, 15, -0.5], [-8, -20, 13, 20, 0.3], [-34, -6, 12, 14, 0]];
    c.lineJoin = "round"; c.strokeStyle = INK; c.lineWidth = 12;
    parts.forEach(([ex, ey, rx, ry, rot]) => { c.beginPath(); ell(c, ex, ey, rx, ry, rot); c.stroke(); });
    parts.forEach(([ex, ey, rx, ry, rot]) => { c.beginPath(); ell(c, ex, ey, rx, ry, rot); c.fillStyle = GINGER; c.fill(); });
    parts.forEach(([ex, ey, rx, ry, rot]) => { c.save(); c.beginPath(); ell(c, ex, ey, rx, ry, rot); c.clip(); c.beginPath(); ell(c, ex - 9, ey - 8, rx, ry, rot); c.rect(-100, -100, 200, 200); c.fillStyle = GINGER_DK; c.globalAlpha = 0.6; c.fill("evenodd"); c.restore(); c.globalAlpha = 1; });
    line(c, [[-14, 6], [-8, 16]], 3, GINGER_DK); line(c, [[14, -2], [20, 8]], 3, GINGER_DK);
  }
  c.restore();
};
const tag = (c: Ctx, x: number, y: number, kind: string) => {
  shape(c, () => rrect(c, x - 64, y - 46, 140, 104, 14), SH, 0);
  shape(c, () => rrect(c, x - 70, y - 52, 140, 104, 14), WHITE, 5);
  veg(c, kind, x, y + 2, 1);
};
// foam: white bubbles piled up to a rounded top, kept inside the walls of the tumbler (width w, height h, bottom y yb)
const foam = (c: Ctx, x: number, yl: number, height: number, g: { yb: number; w: number; h: number; r: number }, seed: number) => {
  if (height <= 0) return;
  const top = g.w / 2, bot = g.w * 0.4, rimY = g.yb - g.h, R = g.r, r = rnd(seed);
  const hw = (yy: number) => (yy <= rimY ? top * 1.05 : bot + (top - bot) * ((g.yb - yy) / g.h) + 4);
  const all: number[][] = [];
  for (let yy = yl - R * 0.7, row = 0; yy > yl - height + R * 0.9; yy -= R * 1.2, row++) {
    const f = Math.min(1, (yy - (yl - height)) / (R * 3.2)), half = hw(yy) * (0.5 + 0.5 * f) - R * 0.55, n = Math.max(1, Math.round(half / (R * 0.9)));
    for (let k = 0; k < n * 2 + (row % 2); k++) all.push([x - half + ((k + 0.3 + r() * 0.4) / (n * 2 + (row % 2))) * half * 2, yy + r() * 6, R * (0.85 + r() * 0.35)]);
  }
  all.sort((a, b) => a[1] - b[1]);
  all.forEach(([bx, by, br]) => {
    shape(c, () => ell(c, bx, by, br, br), WHITE, 0); shade(c, () => ell(c, bx, by, br, br), COL.sky, -br * 0.35, -br * 0.35, 0.9);
    c.beginPath(); ell(c, bx, by, br, br); c.lineWidth = 4.5; c.strokeStyle = INK; c.stroke();
  });
};
// a bubble in the liquid
const bub = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", Math.max(3, r * 0.2)); line(c, [[x - r * 0.45, y - r * 0.1], [x - r * 0.2, y - r * 0.5]], Math.max(2, r * 0.18), WHITE);
};
// a wooden ruler standing on the plate, zero at the bottom, a mark every cm and a number every 2 cm
const ruler = (c: Ctx, x: number, yb: number, cm: number, step = 50) => {
  const len = cm * step + 20;
  shadow(c, x + 8, yb + 6, 46, 11);
  shape(c, () => rrect(c, x - 35, yb - len, 70, len, 6), COL.wood, 6);
  shade(c, () => rrect(c, x - 35, yb - len, 70, len, 6), COL.woodDk, -12, 0, 0.6);
  c.beginPath(); rrect(c, x - 35, yb - len, 70, len, 6); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (let k = 0; k <= cm; k++) {
    const yy = yb - k * step, big = k % 2 === 0;
    line(c, [[x + 35, yy], [x + 35 - (big ? 24 : 14), yy]], big ? 4 : 3);
    if (big) write(c, String(k), x - 30, yy - 11, 22, INK, 3.5);
  }
};
// a steel spoon from the hand end (gx, gy) to the middle of the bowl (bx, by); the bowl lies along the handle
const spoon = (c: Ctx, gx: number, gy: number, bx: number, by: number) => {
  line(c, [[gx, gy], [bx, by]], 22, INK); line(c, [[gx, gy], [bx, by]], 13, COL.steel);
  c.save(); c.translate(bx, by); c.rotate(Math.atan2(by - gy, bx - gx));
  shape(c, () => ell(c, 0, 0, 70, 44), COL.steel, 6); shade(c, () => ell(c, 0, 0, 70, 44), COL.steelDk, -14, -12, 0.7);
  c.beginPath(); ell(c, 0, 0, 70, 44); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 2, -2, 54, 30), COL.steelIn, 4);
  c.restore();
};

// ---------------------------------------------------------------- experiment 1: the potato fizz
const TX = [170, 540, 910], GY = 780, GW = 250, GH = 400;
const trioBase = (c: Ctx) => { ground(c); plate(c, 540, 785, 515, 95); };
const cup = (c: Ctx, x: number, fill = 0.3, liquid: string = CLEAR) => glass(c, x, GY, GW, GH, fill, liquid);
const tags3 = (c: Ctx) => { tag(c, TX[0], 950, "none"); tag(c, TX[1], 950, "potato"); tag(c, TX[2], 950, "boiled"); };
const cupG = { yb: GY, w: GW, h: GH, r: 30 };
const LV = GY - GH * 0.3;

// setup.e1.0
const e1s0 = (c: Ctx) => { trioBase(c); TX.forEach((x) => cup(c, x)); tags3(c); };

// setup.e1.1
const e1s1 = (c: Ctx) => {
  trioBase(c); TX.forEach((x) => cup(c, x));
  heap(c, TX[2], LV + 6, 82, 46, MASH, MASH_LT, MASH_DK, 3, false);
  spoon(c, 860, 190, 600, 300);
  [[548, 360, 1.3], [572, 400, 1.7], [540, 440, 1.2], [585, 455, 1.5]].forEach(([x, y, a]) => shred(c, x, y, a, POTATO, 36));
  [[560, 292, 0.4], [595, 280, 2.1], [630, 302, 1.1], [575, 315, 0.2]].forEach(([x, y, a]) => shred(c, x, y, a, POTATO, 28));
  handM(c, 880, 175, 2.7, 2.1);
  arrow(c, [[430, 230], [405, 290], [400, 350], [418, 410]]);
  tags3(c);
};

// setup.e1.2
const e1s2 = (c: Ctx) => {
  trioBase(c); TX.forEach((x) => cup(c, x));
  foam(c, TX[1], LV, 450, cupG, 21);
  foam(c, TX[2], LV, 36, { ...cupG, r: 13 }, 5);
  ruler(c, 355, GY, 12);
  tags3(c);
};

// setup.e1.3
const e1s3 = (c: Ctx) => {
  ground(c);
  plate(c, 560, 940, 500, 80);
  // the fresh cup of peroxide on the right, foam just beginning
  const x = 740, yb = 950, h = 540, w = 380;
  glass(c, x, yb, w, h, 0.35, CLEAR);
  foam(c, x, yb - h * 0.35, 120, { yb, w, h, r: 28 }, 33);
  // the tea strainer tipped over the cup: handle in the hand, mesh bowl, grated potato sliding out
  const bx = 420, by = 330;
  line(c, [[260, 240], [bx - 120, by - 20]], 34, INK); line(c, [[260, 240], [bx - 120, by - 20]], 22, COL.steel);
  c.save(); c.translate(bx, by); c.rotate(0.55);
  const bowlP = () => ell(c, 0, 0, 170, 100);
  shape(c, bowlP, COL.steel, 0); shade(c, bowlP, COL.steelDk, -26, -20, 0.55);
  c.save(); c.beginPath(); bowlP(); c.clip();
  for (let k = -5; k <= 5; k++) line(c, [[k * 32, -110], [k * 32, 110]], 2.5, COL.steelDk);
  for (let k = -3; k <= 3; k++) line(c, [[-180, k * 32], [180, k * 32]], 2.5, COL.steelDk);
  c.restore();
  c.beginPath(); bowlP(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 0, 0, 150, 82), COL.steelIn, 4);
  c.restore();
  heap(c, bx + 8, by + 24, 112, 62, POTATO, "#dcb67e", POTATO_DK, 8, false);
  // shreds falling into the cup
  [[600, 430, 1.1], [640, 500, 1.6], [690, 470, 0.5], [740, 540, 1.3], [655, 580, 0.9]].forEach(([sx, sy, a]) => shred(c, sx, sy, a, POTATO, 40));
  hand(c, 190, 215, 0.15, 1.6);
  arrow(c, [[520, 170], [610, 190], [660, 250], [665, 330]], RED, 12);
};

// ---------------------------------------------------------------- experiment 2: eggshell in vinegar
// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 650, 510, 340);
  // the paper the shell is folded in, lying on the plate
  shape(c, () => polyP(c, [[190, 428], [930, 428], [985, 808], [135, 808]]), SH, 0);
  shape(c, () => polyP(c, [[170, 410], [910, 410], [965, 790], [115, 790]]), "#fffaf0", 6);
  line(c, [[170, 410], [910, 410]], 10, COL.grey);
  // big pieces of shell still waiting behind the pin
  [[260, 470, 1.0], [400, 455, 0.8], [690, 462, 0.9], [830, 478, 1.1]].forEach(([x, y, k]) => {
    const p = () => { c.moveTo(x - 46 * k, y); c.bezierCurveTo(x - 40 * k, y + 52 * k, x + 40 * k, y + 52 * k, x + 46 * k, y); c.closePath(); };
    solid(c, p, SHELL, SHELL_DK, 10, 6);
  });
  // fine white powder in front of the pin, where it has already passed
  const r = rnd(9);
  for (let k = 0; k < 60; k++) shape(c, () => ell(c, 220 + r() * 700, 660 + r() * 110, 6 + r() * 4, 5 + r() * 3), WHITE, 3);
  // the rolling pin lying across the paper, a flat hand pressing it down
  shadow(c, 560, 650, 330, 26);
  shape(c, () => rrect(c, 180, 548, 100, 54, 12), COL.woodDk, 6);
  shape(c, () => rrect(c, 800, 548, 100, 54, 12), COL.woodDk, 6);
  solid(c, () => rrect(c, 250, 505, 580, 140, 40), COL.wood, COL.woodDk, 0, 30);
  hand(c, 540, 270, Math.PI / 2, 2.0, SKIN.child, CLOTH.child, true);
  arrow(c, [[960, 520], [985, 600], [975, 690]], RED, 12);
};

// setup.e2.1
const GX2 = [300, 780], GY2 = 885, GW2 = 360, GH2 = 470;
const e2Base = (c: Ctx) => { ground(c); plate(c, 540, 890, 515, 90); };
const vinegar = (c: Ctx, x: number) => glass(c, x, GY2, GW2, GH2, 0.72, VINEGAR);
const shellPiece = (c: Ctx, x: number, y: number, rad: number, a0: number, a1: number, th: number, col: string) => {
  c.beginPath(); c.arc(x, y, rad, a0, a1); c.lineCap = "round"; c.strokeStyle = INK; c.lineWidth = th + 9; c.stroke();
  c.beginPath(); c.arc(x, y, rad, a0, a1); c.strokeStyle = col; c.lineWidth = th; c.stroke();
  c.beginPath(); c.arc(x, y, rad - th * 0.25, a0 + 0.1, a1 - 0.1); c.strokeStyle = SHELL_DK; c.lineWidth = th * 0.35; c.stroke();
};
const e2s1 = (c: Ctx) => {
  e2Base(c);
  vinegar(c, GX2[0]); vinegar(c, GX2[1]);
  // left: one thick curved piece on the bottom, a few bubbles
  shellPiece(c, GX2[0] + 6, GY2 - 85, 88, Math.PI * 1.1, Math.PI * 1.9, 38, SHELL);
  [[250, 790, 13], [330, 760, 11], [285, 715, 10], [345, 670, 9]].forEach(([x, y, r]) => bub(c, x, y, r));
  // right: powder clouding the liquid, bubbles everywhere, foam on top
  const x = GX2[1];
  [[x, 810, 140, 70], [x - 40, 740, 100, 55], [x + 45, 725, 90, 50], [x, 660, 70, 40]].forEach(([ex, ey, rx, ry]) => { c.beginPath(); ell(c, ex, ey, rx, ry); c.fillStyle = "rgba(255,255,255,0.85)"; c.fill(); });
  const r = rnd(4);
  for (let k = 0; k < 30; k++) bub(c, x - 130 + r() * 260, 590 + r() * 270, 9 + r() * 13);
  foam(c, x, GY2 - GH2 * 0.72 + 10, 105, { yb: GY2, w: GW2, h: GH2, r: 26 }, 12);
};

// setup.e2.2
const e2s2 = (c: Ctx) => {
  e2Base(c);
  vinegar(c, GX2[0]); vinegar(c, GX2[1]);
  // night, then the morning sun
  const mx = 330, my = 170, sx = 750, sy = 170;
  shape(c, () => ell(c, mx, my, 62, 62), COL.cloth, 0);
  c.save(); c.beginPath(); ell(c, mx, my, 62, 62); c.clip(); shape(c, () => ell(c, mx + 30, my - 12, 56, 56), BG, 0); c.restore();
  c.beginPath(); c.arc(mx, my, 62, Math.PI * 0.62, Math.PI * 1.55); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  [[430, 120], [455, 205], [225, 130]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 9, 9), COL.yellow, 3));
  arrow(c, [[480, 170], [620, 170]], RED, 12);
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; line(c, [[sx + Math.cos(a) * 84, sy + Math.sin(a) * 84], [sx + Math.cos(a) * 118, sy + Math.sin(a) * 118]], 11, COL.orange); }
  solid(c, () => ell(c, sx, sy, 64, 64), COL.yellow, COL.orange, 18, 18);
  // left: the shell piece is thin and soft, bubbles still rising from it
  shellPiece(c, GX2[0] + 4, GY2 - 90, 110, Math.PI * 1.08, Math.PI * 1.85, 16, "#f2e8d2");
  [[250, 775, 14], [330, 740, 16], [275, 685, 12], [345, 625, 15], [285, 565, 11], [330, 505, 13], [270, 455, 10]].forEach(([x, y, rr]) => bub(c, x, y, rr));
  // right: perfectly still and clear, the powder has all gone to a white heap on the bottom
  heap(c, GX2[1], GY2 - 4, 125, 70, WHITE, WHITE, "#d5dde8", 6, false);
};

// ---------------------------------------------------------------- experiment 3: which vegetable
const VK = ["potato", "carrot", "cucumber", "ginger"];
const VHEAP: Record<string, string[]> = { potato: [POTATO, "#dcb67e", POTATO_DK], carrot: [CARROT, "#f7ad5e", CARROT_DK], cucumber: [CUC, "#bfe09a", CUC_DK], ginger: [GINGER, "#f2d57e", GINGER_DK] };
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 770, 515, 195);
  VK.forEach((k, i) => {
    const x = 200 + i * 235;
    glass(c, x, 500, 190, 320, 0, CLEAR);
    tag(c, x, 365, k);
    const [a, b, d] = VHEAP[k];
    heap(c, x, 850, 105, 100, a, b, d, 20 + i);
  });
};

const FX = [235, 415, 595, 775, 955], FW = 145, FH = 300, FG = { yb: GY, w: FW, h: FH, r: 22 };
const FLV = GY - FH * 0.3;
const fiveBase = (c: Ctx) => {
  ground(c); plate(c, 540, 785, 520, 90);
  FX.forEach((x) => glass(c, x, GY, FW, FH, 0.3, CLEAR));
  ["potato", "carrot", "cucumber", "ginger", "none"].forEach((k, i) => tag(c, FX[i], 950, k));
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  fiveBase(c);
  heap(c, FX[0], FLV + 6, 55, 28, POTATO, "#dcb67e", POTATO_DK, 41, false);
  spoon(c, 850, 200, 500, 330);
  [[425, 375, 1.3], [445, 420, 1.7], [415, 460, 1.2], [455, 490, 1.5]].forEach(([x, y, a]) => shred(c, x, y, a, CARROT, 36));
  [[480, 330, 0.4], [515, 315, 2.1], [545, 337, 1.1], [500, 350, 0.2]].forEach(([x, y, a]) => shred(c, x, y, a, CARROT, 28));
  handM(c, 875, 175, 2.72, 2.1);
  arrow(c, [[340, 270], [315, 330], [310, 390], [325, 450]]);
};
// setup.e3.2
const e3s2 = (c: Ctx) => {
  fiveBase(c);
  [480, 250, 70, 140, 0].forEach((hgt, i) => foam(c, FX[i], FLV, hgt, FG, 50 + i));
  ruler(c, 100, GY, 14);
};

export const su_chemistryReactionSpeed = cards("sci.chemistry.reaction-speed.L3 set-up", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
