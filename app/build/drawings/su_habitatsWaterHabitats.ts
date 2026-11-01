import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards } from "./flatKit";

// WATER HABITATS L3 · ten set-up cards in the flat kit: bold ink, flat colour, a shade side, soft shadow.

const COUNTER = "#e8d5ad", DOUGH = "#ecc98b", DOUGH_DK = "#c99f5e", WARM = "#f7c995";
const CUKE = "#4f8a3a", CUKE_DK = "#3b6b2c", CUKE_IN = "#e3f0c0", CUKE_SEED = "#b9d68a", MUG = "#5b8fd6";
const STICKER = [COL.yellow, COL.pink, COL.greenLt];

const counter = (c: Ctx, y: number) => { c.fillStyle = COUNTER; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const steam = (c: Ctx, x: number, y: number, h: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) pts.push([x + Math.sin(i * 0.9) * 14, y - (h * i) / 12]);
  c.globalAlpha = 0.85; line(c, pts, 10, COL.grey); c.globalAlpha = 1;
};
// a numbered round sticker
const sticker = (c: Ctx, x: number, y: number, r: number, n: number) => {
  shape(c, () => ell(c, x, y, r, r), STICKER[n - 1], 5);
  write(c, String(n), x - r * 0.28, y - r * 0.5, r, INK, 6);
};
// a plastic bottle standing at (x, y); fill 1 = water right up the neck
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  const half = w / 2, nw = w * 0.17, neckH = h * 0.16, sh = h * 0.14, top = y - h;
  const body = () => {
    c.moveTo(x - nw, top); c.lineTo(x - nw, top + neckH); c.bezierCurveTo(x - nw, top + neckH + sh * 0.6, x - half, top + neckH + sh * 0.4, x - half, top + neckH + sh);
    c.lineTo(x - half, y - 16); c.quadraticCurveTo(x - half, y, x - half + 16, y); c.lineTo(x + half - 16, y); c.quadraticCurveTo(x + half, y, x + half, y - 16);
    c.lineTo(x + half, top + neckH + sh); c.bezierCurveTo(x + half, top + neckH + sh * 0.4, x + nw, top + neckH + sh * 0.6, x + nw, top + neckH); c.lineTo(x + nw, top); c.closePath();
  };
  shadow(c, x + half * 0.15, y + 6, half * 1.05, half * 0.2);
  shape(c, body, COL.glass, 0);
  const ly = top + 14 + (1 - fill) * (h - 14);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.water; c.fillRect(x - half - 4, ly, w + 8, y - ly + 4);
  c.globalAlpha = 0.55; c.fillStyle = COL.waterDk; c.fillRect(x + half * 0.4, ly, half, y - ly + 4); c.globalAlpha = 1;
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, top, nw, nw * 0.32), "rgba(255,255,255,0.45)", 5);
  shine(c, [[x - half * 0.72, top + neckH + sh + 30], [x - half * 0.72, y - 50]], 8);
};
// a steel katori seen from above at an angle: rim centre (x, y), rim radius r
const katori = (c: Ctx, x: number, y: number, r: number, water: string, specks = 0, seedN = 1) => {
  const ry = r * 0.38, body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 0.85, x + r * 0.95, y + r * 0.85, x + r, y); c.closePath(); };
  shadow(c, x + r * 0.12, y + r * 0.7, r * 0.9, r * 0.14);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -r * 0.4, -r * 0.05);
  shape(c, () => ell(c, x, y, r, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, y + 2, r * 0.88, ry * 0.8), water, 3);
  const rd = rnd(seedN);
  for (let i = 0; i < specks; i++) { const a = rd() * 6.28, d = Math.sqrt(rd()) * 0.8; shape(c, () => ell(c, x + Math.cos(a) * r * 0.8 * d, y + 2 + Math.sin(a) * ry * 0.7 * d, 5, 3.5), WHITE, 2); }
};
// a cucumber slice seen from above at an angle, with its thickness
const cuke = (c: Ctx, x: number, y: number, rx: number, ry: number, th: number) => {
  shape(c, () => ell(c, x, y + th, rx, ry), CUKE_DK, 5);
  shape(c, () => c.rect(x - rx + 2.5, y, 2 * rx - 5, th), CUKE_DK, 0);
  line(c, [[x - rx, y], [x - rx, y + th]], 5); line(c, [[x + rx, y], [x + rx, y + th]], 5);
  shape(c, () => ell(c, x, y, rx, ry), CUKE, 5);
  shape(c, () => ell(c, x, y, rx * 0.82, ry * 0.82), CUKE_IN, 0);
  for (let k = 0; k < 7; k++) { const a = (k / 7) * 6.28; shape(c, () => ell(c, x + Math.cos(a) * rx * 0.42, y + Math.sin(a) * ry * 0.42, rx * 0.09, ry * 0.12), CUKE_SEED, 0); }
};
// dough shapes. m = slope of the surface they stand on (0 = flat table); yb = baseline at the shape's middle
const tower = (c: Ctx, x: number, yb: number, w: number, h: number, m = 0) => {
  const l = x - w / 2, r = x + w / 2, yl = yb - (m * w) / 2, yr = yb + (m * w) / 2, top = yb - h, k = w * 0.42;
  const p = () => { c.moveTo(l, yl); c.lineTo(l, top + k); c.bezierCurveTo(l, top - k * 0.3, r, top - k * 0.3, r, top + k); c.lineTo(r, yr); c.closePath(); };
  shadow(c, x + w * 0.35, yb + 6, w * 0.7, w * 0.1);
  shape(c, p, DOUGH); shade(c, p, DOUGH_DK, -w * 0.28, 0, 0.8);
};
const ball = (c: Ctx, x: number, yb: number, r: number) => {
  const p = () => ell(c, x, yb - r, r, r);
  shadow(c, x + r * 0.3, yb + 4, r * 0.95, r * 0.14);
  shape(c, p, DOUGH); shade(c, p, DOUGH_DK, -r * 0.3, -r * 0.3, 0.8);
};
const dome = (c: Ctx, x: number, yb: number, rx: number, ry: number, m = 0) => {
  const yl = yb - m * rx, yr = yb + m * rx, cy = yb - ry / 0.75;
  const p = () => { c.moveTo(x - rx, yl); c.bezierCurveTo(x - rx * 0.8, cy, x + rx * 0.8, cy, x + rx, yr); c.closePath(); };
  shadow(c, x + rx * 0.2, yb + 6, rx * 0.95, rx * 0.08);
  shape(c, p, DOUGH); shade(c, p, DOUGH_DK, -rx * 0.28, 0, 0.8);
  return p;
};

// ---- the sloping-plate scene shared by the last two cards
const PX = 150, PY = 548, SL = 0.323, TH = Math.atan(SL), PL = 767, PT = 23;
const surf = (x: number) => PY + SL * (x - PX) - PT;
const inPlate = (c: Ctx, f: () => void) => { c.save(); c.translate(PX, PY); c.rotate(TH); f(); c.restore(); };
const plateScene = (c: Ctx) => {
  ground(c);
  // sink: back wall and floor, counter on the left
  shape(c, () => c.rect(590, 690, 520, 262), "#c0c9d6", 6);
  shape(c, () => c.rect(590, 940, 520, 160), "#9eabbd", 6);
  shape(c, () => ell(c, 860, 1000, 70, 14), COL.steelDk, 4);
  shape(c, () => c.rect(-10, 690, 600, 400), COUNTER, 6);
  // the book
  shape(c, () => rrect(c, 90, 606, 240, 84, 8), "#c8553d", 6);
  shape(c, () => rrect(c, 150, 618, 172, 60, 4), COL.paper, 3);
  line(c, [[160, 636], [314, 636]], 3, COL.grey); line(c, [[160, 648], [314, 648]], 3, COL.grey); line(c, [[160, 660], [314, 660]], 3, COL.grey);
  // the plate
  inPlate(c, () => {
    shape(c, () => rrect(c, 0, -22, PL, 22, 6), COL.steel);
    shade(c, () => rrect(c, 0, -22, PL, 22, 6), COL.steelDk, 0, -9, 0.7);
    shape(c, () => rrect(c, 10, -22, PL - 20, 6, 3), COL.steelIn, 3);
  });
};
// a film of water running along the plate from world x0 to the end
const film = (c: Ctx, x0: number) => inPlate(c, () => {
  const l0 = (x0 - PX) / Math.cos(TH);
  shape(c, () => rrect(c, l0, -31, PL - l0, 11, 5), COL.water, 3);
});
const dropsOff = (c: Ctx) => {
  const ex = PX + PL * Math.cos(TH), ey = PY + PL * Math.sin(TH);
  [[8, 40, 10, 16], [10, 100, 9, 14], [8, 160, 8, 12]].forEach(([dx, dy, rx, ry]) => shape(c, () => ell(c, ex + dx, ey + dy, rx, ry), COL.water, 3));
  shape(c, () => ell(c, ex + 14, 1000, 60, 12), COL.water, 3);
};

// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c); counter(c, 800);
  // the fridge
  shadow(c, 925, 900, 150, 18);
  const fr = () => rrect(c, 790, 300, 250, 600, 26);
  shape(c, fr, "#e8eef4"); shade(c, fr, COL.steelDk, -60, 0, 0.45);
  line(c, [[790, 520], [1040, 520]], 6);
  shape(c, () => rrect(c, 812, 360, 16, 110, 8), COL.steelDk, 4); shape(c, () => rrect(c, 812, 560, 16, 150, 8), COL.steelDk, 4);
  for (let a = 0; a < 3; a++) { const t = (a * Math.PI) / 3; line(c, [[935 - Math.cos(t) * 50, 410 - Math.sin(t) * 50], [935 + Math.cos(t) * 50, 410 + Math.sin(t) * 50]], 9, COL.blue); }
  // the bottles
  bottle(c, 300, 890, 190, 430, 1);
  bottle(c, 500, 890, 190, 430, 0.93);
  // the pan, tilted, pouring into the right-hand bottle
  const px = 640, py = 300, a = -0.45, toW = (lx: number, ly: number) => [px + lx * Math.cos(a) - ly * Math.sin(a), py + lx * Math.sin(a) + ly * Math.cos(a)];
  const lip = toW(-130, -50);
  line(c, [[lip[0] + 4, lip[1] + 4], [504, 400], [501, 470]], 26, INK); line(c, [[lip[0] + 4, lip[1] + 4], [504, 400], [501, 470]], 15, COL.water);
  c.save(); c.translate(px, py); c.rotate(a);
  shape(c, () => rrect(c, 125, -22, 210, 28, 13), COL.steelDk, 6);
  shape(c, () => rrect(c, -130, -50, 260, 108, 18), COL.steel);
  shade(c, () => rrect(c, -130, -50, 260, 108, 18), COL.steelDk, 0, -30, 0.7);
  shape(c, () => ell(c, 0, -50, 130, 22), COL.steelIn, 5);
  shape(c, () => ell(c, 0, -49, 114, 15), COL.water, 3);
  c.restore();
  const hc = toW(250, -8), s = 1.35, an = Math.PI + a;
  hand(c, hc[0] - Math.cos(an) * 70 * s, hc[1] - Math.sin(an) * 70 * s, an, s, SKIN.adult, CLOTH.adult);
  steam(c, 600, 190, 110); steam(c, 660, 160, 90);
  arrow(c, [[630, 800], [765, 800]]);
};

// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c); counter(c, 700);
  [230, 540, 850].forEach((x, i) => {
    glass(c, x, 800, 230, 360, 0.75);
    if (i < 2) for (const [dx, dy] of [[-92, 120], [96, 170], [-78, 230], [88, 100]]) shape(c, () => ell(c, x + dx, 800 - dy, 7, 10), COL.drop, 2.5);
    sticker(c, x, 800 - 140, 40, i + 1);
  });
};

// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c); counter(c, 770);
  // the wide basin of warm water
  shadow(c, 450, 835, 400, 22);
  const tub = () => { c.moveTo(50, 640); c.bezierCurveTo(60, 800, 100, 830, 180, 830); c.lineTo(680, 830); c.bezierCurveTo(760, 830, 800, 800, 810, 640); c.closePath(); };
  shape(c, tub, COL.steel); shade(c, tub, COL.steelDk, -90, 0, 0.6);
  shape(c, () => ell(c, 430, 640, 380, 82), COL.steelIn, 6);
  shape(c, () => ell(c, 430, 648, 352, 62), WARM, 4);
  [[270, 706], [430, 712], [590, 706]].forEach(([x, y], i) => {
    glass(c, x, y, 130, 270, 0.6);
    c.globalAlpha = 0.9; c.beginPath(); ell(c, x, y + 2, 88, 15); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); c.globalAlpha = 1;
    sticker(c, x, y - 120, 28, i + 1);
  });
  steam(c, 110, 560, 110); steam(c, 760, 560, 110);
  // the timer
  shadow(c, 935, 782, 100, 16);
  shape(c, () => rrect(c, 917, 560, 36, 28, 8), COL.steelDk, 5);
  shape(c, () => ell(c, 935, 675, 108, 108), COL.orange, 6);
  shade(c, () => ell(c, 935, 675, 108, 108), COL.orange === "" ? INK : "#d27c25", -30, -10, 0.7);
  shape(c, () => ell(c, 935, 675, 84, 84), COL.paper, 5);
  for (let k = 0; k < 12; k++) { const t = (k / 12) * 6.283; line(c, [[935 + Math.sin(t) * 66, 675 - Math.cos(t) * 66], [935 + Math.sin(t) * 78, 675 - Math.cos(t) * 78]], 5); }
  line(c, [[935, 675], [935 + Math.sin(2.2) * 60, 675 - Math.cos(2.2) * 60]], 9, RED);
  shape(c, () => ell(c, 935, 675, 11, 11), INK, 0);
};

// setup.e1.3
const e1s3 = (c: Ctx) => {
  ground(c, "#3b3560"); counter(c, 780);
  const gw = 200, gh = 380, gy = 800, g1 = 700, g2 = 950, ty = 600;
  // the torch beam, into glass 1 only
  c.fillStyle = "rgba(255,244,160,0.6)"; c.beginPath(); polyP(c, [[500, ty - 40], [500, ty + 40], [606, gy - 70], [606, gy - gh + 40]]); c.fill();
  // the torch in a hand
  shape(c, () => rrect(c, 180, ty - 28, 260, 56, 14), COL.red);
  shade(c, () => rrect(c, 180, ty - 28, 260, 56, 14), "#b8402c", 0, -22, 0.7);
  shape(c, () => polyP(c, [[436, ty - 34], [496, ty - 66], [496, ty + 66], [436, ty + 34]]), COL.steelDk);
  shape(c, () => ell(c, 496, ty, 12, 62), COL.yellow, 5);
  glass(c, g1, gy, gw, gh, 0.8); glass(c, g2, gy, gw, gh, 0.8);
  c.fillStyle = "rgba(255,248,190,0.5)"; c.beginPath(); polyP(c, [[606, gy - gh + 40], [794, gy - gh + 70], [794, gy - 60], [606, gy - 70]]); c.fill();
  // many tiny bubbles clinging inside glass 1
  const rd = rnd(21), top = gw / 2, bot = gw * 0.4;
  for (let i = 0; i < 70; i++) {
    const y = gy - 18 - rd() * (gh * 0.8 - 30), hw = top - ((top - bot) * (y - (gy - gh))) / gh, side = rd() < 0.5 ? -1 : 1, r = 4 + rd() * 6;
    const x = i % 6 === 0 ? g1 + (rd() - 0.5) * (2 * bot - 24) : g1 + side * (hw - r - 5 - rd() * 12);
    shape(c, () => ell(c, x, i % 6 === 0 ? gy - 10 - rd() * 10 : y, r, r), "rgba(255,255,255,0.92)", 2.5);
  }
  shape(c, () => rrect(c, 180, ty - 28, 0, 0, 0), "rgba(0,0,0,0)", 0);
  hand(c, 150, ty, 0, 1.5);
  sticker(c, g1, 890, 36, 1); sticker(c, g2, 890, 36, 2);
};

// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  katori(c, 190, 400, 150, COL.water, 0);
  katori(c, 540, 400, 150, "#a9d2ec", 8, 3);
  katori(c, 890, 400, 150, "#cfe6f4", 32, 4);
  // a teaspoon of salt and a tablespoon of salt
  const spoon = (x: number, y: number, rx: number, ry: number, len: number) => {
    shadow(c, x + 12, y + ry * 0.7, rx + len * 0.4, ry * 0.5);
    shape(c, () => rrect(c, x, y - ry * 0.18, len, ry * 0.36, ry * 0.18), COL.steelDk, 5);
    shape(c, () => ell(c, x, y, rx, ry), COL.steel, 5);
    shape(c, () => ell(c, x, y - ry * 0.15, rx * 0.85, ry * 0.75), WHITE, 3);
    const rd = rnd(rx);
    for (let i = 0; i < 9; i++) shape(c, () => ell(c, x - rx * 0.55 + rd() * rx * 1.1, y - ry * 0.55 + rd() * ry * 0.8, 3.5, 2.5), COL.cloth, 1.5);
  };
  spoon(470, 790, 64, 44, 170); spoon(790, 800, 98, 66, 190);
};

// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c);
  [[190, COL.water, 0], [540, "#a9d2ec", 8], [890, "#cfe6f4", 32]].forEach(([x, w, n], i) => {
    katori(c, x as number, 260, 150, w as string, n as number, 3 + i);
    cuke(c, (x as number) - 52, 262, 44, 26, 9); cuke(c, (x as number) + 50, 266, 44, 26, 9);
  });
  // the board with six slices, two for each bowl
  shadow(c, 560, 960, 440, 20);
  const bd = () => rrect(c, 110, 560, 860, 380, 40);
  shape(c, bd, COL.wood); shade(c, bd, COL.woodDk, 0, -26, 0.7);
  shape(c, () => rrect(c, 900, 640, 40, 90, 20), COUNTER, 5);
  [190, 540, 890].forEach((x) => { cuke(c, x - 20 - (x === 890 ? 40 : 0), 690, 62, 40, 14); cuke(c, x - 20 - (x === 890 ? 40 : 0), 830, 62, 40, 14); });
  [190, 540, 890].forEach((x) => arrow(c, [[x, 548], [x, 455]], RED, 9));
};

// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c);
  const strip = (path: () => void) => {
    c.lineCap = "round"; c.lineJoin = "round";
    c.beginPath(); path(); c.strokeStyle = INK; c.lineWidth = 78; c.stroke();
    c.beginPath(); path(); c.strokeStyle = CUKE; c.lineWidth = 68; c.stroke();
    c.beginPath(); path(); c.strokeStyle = CUKE_IN; c.lineWidth = 42; c.stroke();
  };
  const stiff = () => { c.moveTo(250, 320); c.lineTo(640, 320); };
  const droop = () => { c.moveTo(250, 700); c.lineTo(340, 702); c.quadraticCurveTo(520, 712, 650, 880); };
  strip(stiff); strip(droop);
  for (let i = 0; i < 4; i++) { shape(c, () => ell(c, 400 + i * 70, 320, 10, 6), CUKE_SEED, 0); }
  shadow(c, 470, 400, 230, 14);
  hand(c, 170, 320, 0, 1.9); hand(c, 170, 700, 0, 1.9);
};

// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c); counter(c, 780);
  tower(c, 170, 880, 180, 360);
  ball(c, 470, 880, 129);
  dome(c, 820, 880, 195, 83);
};

// setup.e3.1
const e3s1 = (c: Ctx) => {
  plateScene(c);
  film(c, 440);
  tower(c, 640, surf(640), 120, 240, SL);
  // the mug, tilted, held by its handle
  const mx = 330, my = 360, mt = 0.9;
  c.save(); c.translate(mx, my); c.rotate(mt);
  c.beginPath(); ell(c, -60, 0, 30, 40); c.strokeStyle = INK; c.lineWidth = 15; c.stroke(); c.strokeStyle = MUG; c.lineWidth = 8; c.stroke();
  shape(c, () => rrect(c, -55, -65, 110, 130, 16), MUG); shade(c, () => rrect(c, -55, -65, 110, 130, 16), COL.blueDk, 0, -34, 0.7);
  shape(c, () => ell(c, 0, -65, 55, 14), COL.water, 5);
  c.restore();
  line(c, [[418, 366], [430, 480], [440, 616]], 24, INK); line(c, [[418, 366], [430, 480], [440, 616]], 13, COL.water);
  const ring = [mx - 60 * Math.cos(mt), my - 60 * Math.sin(mt)], s = 1.4, an = 0.6;
  hand(c, ring[0] - Math.cos(an) * 70 * s, ring[1] - Math.sin(an) * 70 * s, an, s);
  arrow(c, [[500, 400], [500, 500]], RED, 9);
  dropsOff(c);
};

// setup.e3.2
const e3s2 = (c: Ctx) => {
  plateScene(c);
  film(c, 160);
  // the dome still in place with water running over it
  const dx = 400, dp = dome(c, dx, surf(dx), 130, 60, SL);
  void dp;
  for (const k of [4, 14]) {
    c.beginPath(); c.moveTo(dx - 130 - k * 0.6, surf(dx) - SL * 130 - 2); c.bezierCurveTo(dx - 100, surf(dx) - 80 - k * 0.9, dx + 100, surf(dx) - 80 - k * 0.9, dx + 130 + k * 0.6, surf(dx) + SL * 130 - 2);
    c.strokeStyle = COL.water; c.lineWidth = 9; c.stroke();
  }
  // the tower knocked over, lying on the plate lower down
  inPlate(c, () => {
    shadow(c, 590, -4, 150, 10);
    shape(c, () => rrect(c, 470, -22 - 120, 240, 120, 55), DOUGH);
    shade(c, () => rrect(c, 470, -22 - 120, 240, 120, 55), DOUGH_DK, 0, -40, 0.8);
  });
  // the ball in the sink
  ball(c, 700, 1010, 86);
  arrow(c, [[180, surf(180) - 150], [330, surf(330) - 150]], RED, 9);
  dropsOff(c);
};

export const su_habitatsWaterHabitats = cards("sci.habitats.water-habitats.L3 set-up", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
