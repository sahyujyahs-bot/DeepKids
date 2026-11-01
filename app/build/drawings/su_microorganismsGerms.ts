import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// sci.microorganisms.germs.L3 set-up cards: glitter germs on hands, the touch list, rice on a shelf and in a fridge.

const PAPER = "#f8f1e0", GLITTER = [COL.yellow, COL.pink, COL.teal, WHITE, COL.orange, COL.purple];

// ---------------------------------------------------------------- shared pieces
const sparkle = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => { for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 4, rr = i % 2 ? r * 0.36 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, col, Math.max(2, r * 0.14));
};
// a scatter of glitter specks inside an ellipse
const spray = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, seed: number, r: number) => {
  const q = rnd(seed);
  for (let i = 0; i < n; i++) { const a = q() * 6.283, d = Math.sqrt(q()); sparkle(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, r * (0.75 + q() * 0.5), GLITTER[i % GLITTER.length]); }
};
// a hand seen from above, palm up: wrist at (x, y), fingers up, local coordinates in `inner` (palm centre about (0, -100))
const palmUp = (c: Ctx, x: number, y: number, s: number, skin: string, sleeve: string, inner?: () => void, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const dk = skin === SKIN.child ? SKIN.childDk : SKIN.adultDk, palm = () => rrect(c, -72, -175, 144, 178, 32);
  [95, 112, 104, 84].forEach((h, i) => shape(c, () => rrect(c, -72 + i * 37, -175 - h, 34, h + 40, 17), skin, 5));
  shape(c, () => ell(c, -84, -92, 27, 62, -0.5), skin, 5);
  shape(c, palm, skin, 6); shade(c, palm, dk, 14, -4, 0.45);
  line(c, [[-50, -92], [-8, -64], [40, -76]], 3.5, dk);
  shape(c, () => rrect(c, -88, -6, 176, 120, 16), sleeve, 6);
  if (inner) inner();
  c.restore();
};
// the arm behind a hand(): a sleeve tube from the wrist back to the edge of the card
const armTo = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string) => {
  const bx = x - Math.cos(an) * 60 * s, by = y - Math.sin(an) * 60 * s, ex = x - Math.cos(an) * 1400, ey = y - Math.sin(an) * 1400;
  c.lineCap = "butt"; line(c, [[bx, by], [ex, ey]], 72 * s, INK); line(c, [[bx, by], [ex, ey]], 72 * s - 10, sleeve); c.lineCap = "round";
};
const panel = (c: Ctx, x: number, y: number, w: number, h: number, draw: () => void) => {
  c.save(); shape(c, () => rrect(c, x, y, w, h, 28), PAPER, 0); c.clip(); draw(); c.restore(); shape(c, () => rrect(c, x, y, w, h, 28), "rgba(0,0,0,0)", 6);
};
const fridge = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.6, y + h + 4, w * 0.62, 18);
  const body = () => rrect(c, x, y, w, h, 24);
  shape(c, body, "#eef3f8"); shade(c, body, COL.steelDk, 16, 0, 0.35);
  line(c, [[x, y + h * 0.3], [x + w, y + h * 0.3]], 6);
  shape(c, () => rrect(c, x + w - 44, y + h * 0.36, 22, h * 0.3, 10), COL.steel, 5);
  shape(c, () => rrect(c, x + w - 44, y + h * 0.1, 22, h * 0.13, 10), COL.steel, 5);
};
const remote = (c: Ctx, x: number, y: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => rrect(c, -55, -150, 110, 300, 24);
  shape(c, body, COL.black); shade(c, body, "#1d1a22", 14, 0, 0.5);
  shape(c, () => ell(c, 0, -108, 15, 15), RED, 4);
  const q = [COL.blue, COL.yellow, COL.green, COL.steelIn, COL.teal, COL.pink];
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, -26 + (i % 3) * 26, -50 + Math.floor(i / 3) * 42, 11, 11), q[i % 6], 3);
  c.restore();
};
const pencil = (c: Ctx, x: number, y: number) => {
  const L = 150, t = 28;
  shadow(c, x + 10, y + t + 8, L, 10);
  shape(c, () => rrect(c, x + L - 26, y - t, 26, t * 2, 8), COL.pink, 5);
  shape(c, () => rrect(c, x + L - 50, y - t, 24, t * 2, 4), COL.steel, 5);
  const body = () => rrect(c, x - L + 54, y - t, 2 * L - 104, t * 2, 4);
  shape(c, body, COL.yellow, 5); shade(c, body, COL.woodDk, 0, -12, 0.5);
  line(c, [[x - L + 60, y], [x + L - 54, y]], 3, COL.orange);
  shape(c, () => polyP(c, [[x - L + 56, y - t], [x - L, y], [x - L + 56, y + t]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x - L + 18, y - 10], [x - L, y], [x - L + 18, y + 10]]), COL.black, 3);
};
const torch = (c: Ctx, x: number, y: number, an: number, beam: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => polyP(c, [[56, -30], [56 + beam, -beam * 0.4], [56 + beam, beam * 0.4], [56, 30]]), "rgba(255,236,140,0.38)", 0);
  const h = () => rrect(c, -170, -28, 175, 56, 14);
  shape(c, h, COL.red); shade(c, h, "#b53a28", 0, -14, 0.5);
  shape(c, () => polyP(c, [[0, -30], [58, -52], [58, 52], [0, 30]]), COL.steel, 6);
  shape(c, () => ell(c, 58, 0, 10, 46), COL.yellow, 5);
  c.restore();
};
const grains = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, seed: number, col: string, dk: string) => {
  const q = rnd(seed);
  for (let i = 0; i < n; i++) { const a = q() * 6.283, d = Math.sqrt(q()), gx = x + Math.cos(a) * rx * d, gy = y + Math.sin(a) * ry * d; shape(c, () => ell(c, gx, gy, 13, 5.5, q() * 3), q() < 0.3 ? dk : col, 1.8); }
};
// a steel bowl of rice with a heap above the rim; dull = day-old look
const riceBowl = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, seed: number) => {
  bowl(c, x, y, r, col);
  const heap = () => { c.moveTo(x - r * 0.93, y); c.bezierCurveTo(x - r * 0.7, y - r * 0.62, x + r * 0.7, y - r * 0.62, x + r * 0.93, y); c.ellipse(x, y, r * 0.93, r * 0.2, 0, 0, Math.PI, false); c.closePath(); };
  shape(c, heap, col, 5);
  c.save(); c.beginPath(); heap(); c.clip(); grains(c, x, y - r * 0.18, r * 0.85, r * 0.3, 70, seed, col, dk); c.restore();
  shape(c, heap, "rgba(0,0,0,0)", 5);
};
const wavy = (c: Ctx, x: number, y: number, h: number, col: string) => {
  const p: number[][] = []; for (let i = 0; i <= 12; i++) p.push([x + Math.sin(i * 1.1) * 18, y - (i * h) / 12]); line(c, p, 9, col);
};

// ---------------------------------------------------------------- the cards
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const cl = () => { c.moveTo(60, 560); c.quadraticCurveTo(540, 500, 1020, 560); c.lineTo(1000, 1020); c.quadraticCurveTo(540, 1050, 80, 1020); c.closePath(); };
  shape(c, cl, COL.cloth); shade(c, cl, "#cfc6b0", 0, -22, 0.5);
  for (let i = 0; i < 6; i++) line(c, [[100 + i * 160, 640], [112 + i * 160, 1000]], 8, COL.sky);
  line(c, [[120, 830], [960, 850]], 4, "#b9ae94");
  shadow(c, 600, 820, 190, 250);
  palmUp(c, 520, 880, 1.9, SKIN.child, CLOTH.child, () => {
    shape(c, () => ell(c, -14, -108, 40, 28, -0.2), COL.yellow, 5); shine(c, [[-36, -118], [-16, -126]], 8);
    spray(c, -4, -100, 58, 62, 11, 5, 15);
  });
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 140, 320, 800, () => {
    fridge(c, 50, 200, 230, 700);
    armTo(c, 335, 560, Math.PI, 1.15, CLOTH.child); hand(c, 335, 560, Math.PI, 1.15);
    spray(c, 272, 560, 24, 22, 4, 21, 13); spray(c, 272, 430, 14, 50, 4, 22, 12);
    arrow(c, [[200, 760], [320, 760]]);
  });
  panel(c, 380, 140, 320, 800, () => {
    shadow(c, 550, 870, 130, 16);
    remote(c, 540, 680); armTo(c, 540, 390, Math.PI / 2, 1.3, CLOTH.child); hand(c, 540, 390, Math.PI / 2, 1.3, SKIN.child, CLOTH.child, true);
    spray(c, 540, 600, 40, 60, 7, 31, 14); spray(c, 540, 500, 30, 14, 3, 32, 11);
  });
  panel(c, 730, 140, 320, 800, () => {
    shape(c, () => rrect(c, 700, 740, 400, 220, 0), COL.wood, 5); line(c, [[730, 780], [1050, 780]], 4, COL.woodDk);
    armTo(c, 890, 270, Math.PI / 2, 1.3, CLOTH.child); pencil(c, 890, 360); hand(c, 890, 270, Math.PI / 2, 1.3);
    spray(c, 890, 360, 110, 22, 6, 41, 12);
    arrow(c, [[1010, 440], [1010, 640]]);
    spray(c, 890, 800, 90, 18, 5, 42, 11);
  });
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 140, 320, 800, () => {
    fridge(c, 50, 200, 230, 700);
    armTo(c, 335, 560, Math.PI, 1.15, CLOTH.adult); hand(c, 335, 560, Math.PI, 1.15, SKIN.adult, CLOTH.adult);
    spray(c, 272, 560, 24, 22, 4, 21, 13); spray(c, 272, 430, 14, 50, 4, 22, 12);
    arrow(c, [[200, 760], [320, 760]]);
  });
  panel(c, 380, 140, 320, 800, () => {
    shape(c, () => rrect(c, 350, 740, 400, 220, 0), COL.wood, 5); line(c, [[380, 780], [700, 780]], 4, COL.woodDk);
    armTo(c, 540, 270, Math.PI / 2, 1.3, CLOTH.adult);
    c.save(); c.translate(540, 360); c.rotate(Math.PI / 2); remote(c, 0, 0); c.restore(); hand(c, 540, 270, Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult); spray(c, 540, 360, 130, 30, 7, 51, 13);
    arrow(c, [[640, 640], [640, 480]]);
  });
  panel(c, 730, 140, 320, 800, () => {
    shape(c, () => rrect(c, 700, 740, 400, 220, 0), COL.wood, 5); line(c, [[730, 780], [1050, 780]], 4, COL.woodDk);
    person(c, 890, 780, 560);
  });
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  c.fillStyle = "#1d2447"; c.fillRect(0, 0, D, D);
  torch(c, 120, 820, -0.42, 720);
  palmUp(c, 700, 960, 1.8, SKIN.child, CLOTH.child, () => {
    const q = rnd(9); for (let i = 0; i < 4; i++) { const px = -42 + q() * 84, py = -150 + q() * 100; c.beginPath(); c.arc(px, py, 20, 0, 7); c.fillStyle = "rgba(255,240,150,0.55)"; c.fill(); sparkle(c, px, py, 13, i % 2 ? WHITE : COL.yellow); }
  });
};
// setup.e1.4
const e1_4 = (c: Ctx) => {
  ground(c);
  const x = 300, y = 1010, h = 860, head = h * 0.13, sh = y - h * 0.74, hy = sh - head * 1.05, sx = x + h * 0.11, sy = sh + h * 0.03;
  const ex = x + 20, ey = hy + head * 0.5, a1 = Math.atan2(ey - sy, ex - sx), a2 = -Math.PI * 0.2, l2 = h * 0.16, wx = ex + Math.cos(a2) * l2, wy = ey + Math.sin(a2) * l2;
  shadow(c, x + 90, y + 6, 190, 20);
  person(c, x, y, h, { armR: [a1, a2], armL: [Math.PI * 0.5, Math.PI * 0.5] });
  const pts = [[sx, sy], [ex, ey], [wx, wy]], uw = h * 0.06;
  line(c, pts, uw + 10, INK); line(c, pts, uw, CLOTH.child); shape(c, () => ell(c, wx, wy, uw * 0.62, uw * 0.62), SKIN.child, 5);
  spray(c, ex + 4, ey, 28, 26, 5, 61, 12);
  [[-30, -6, 20], [-62, 22, 14], [-60, -30, 12]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx - 90, ey + dy, r, r), WHITE, 4));
  shape(c, () => rrect(c, 640, 760, 400, 200, 0), COL.wood, 5);
  c.save(); c.translate(780, 740); c.rotate(Math.PI / 2 - 0.3); remote(c, 0, 0); c.restore(); spray(c, 780, 740, 130, 30, 6, 62, 13);
  arrow(c, [[560, 640], [660, 640]]);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  palmUp(c, 560, 940, 1.9, SKIN.child, CLOTH.child);
  const paper = () => { c.save(); c.translate(560, 700); c.rotate(-0.06); c.moveTo(-250, -170); c.lineTo(250, -170); c.lineTo(250, 170); c.lineTo(-250, 170); c.closePath(); c.moveTo(-70, -50); c.lineTo(-70, 70); c.lineTo(80, 70); c.lineTo(80, -50); c.closePath(); c.restore(); };
  c.save(); c.translate(14, 16); c.beginPath(); paper(); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill(); c.restore();
  shape(c, paper, WHITE, 6);
  c.save(); c.translate(560, 700); c.rotate(-0.06); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(-70, -50, 150, 120); c.restore();
  c.save(); c.translate(560, 700); c.rotate(-0.06); spray(c, 5, 10, 55, 40, 5, 71, 14); c.restore();
  torch(c, 120, 140, 0.55, 600);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const sk = [SKIN.child, SKIN.adult, "#d79a6c", "#a86a45"], sl = [CLOTH.child, COL.teal, COL.purple, COL.pink], n = [11, 6, 3, 1];
  sk.forEach((k, i) => {
    const x = 170 + i * 247;
    palmUp(c, x, 850, 1.1, k, sl[i], () => spray(c, 0, -100, 46, 62, n[i], 80 + i, 17));
    if (i < 3) arrow(c, [[x + 45, 470], [x + 125, 410], [x + 202, 470]]);
  });
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const lid = (x: number, y: number) => plate(c, x, y, 215, 55);
  riceBowl(c, 250, 540, 175, WHITE, "#ece3cc", 3); lid(340, 505);
  riceBowl(c, 740, 540, 175, WHITE, "#ece3cc", 4); lid(830, 505);
  // tags: a shelf, a fridge
  const tag = (x: number, f: () => void) => { shape(c, () => rrect(c, x - 120, 780, 240, 190, 20), WHITE, 5); f(); };
  tag(270, () => { shape(c, () => rrect(c, 170, 880, 200, 24, 4), COL.wood, 5); line(c, [[200, 904], [200, 940]], 7); line(c, [[340, 904], [340, 940]], 7); shape(c, () => ell(c, 270, 856, 38, 14), COL.steel, 4); });
  tag(770, () => { shape(c, () => rrect(c, 725, 800, 90, 150, 12), "#eef3f8", 5); line(c, [[725, 850], [815, 850]], 5); line(c, [[798, 820], [798, 840]], 6, COL.steelDk); line(c, [[798, 865], [798, 895]], 6, COL.steelDk); });
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  // the shelf, warm side
  shape(c, () => rrect(c, 40, 640, 450, 34, 6), COL.wood, 6);
  shape(c, () => polyP(c, [[100, 674], [170, 674], [100, 760]]), COL.woodDk, 5); shape(c, () => polyP(c, [[430, 674], [360, 674], [430, 760]]), COL.woodDk, 5);
  riceBowl(c, 265, 550, 160, WHITE, "#ece3cc", 5);
  plate(c, 330, 520, 200, 48);
  shape(c, () => ell(c, 130, 240, 60, 60), COL.yellow, 6);
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; line(c, [[130 + Math.cos(a) * 84, 240 + Math.sin(a) * 84], [130 + Math.cos(a) * 116, 240 + Math.sin(a) * 116]], 8, COL.orange); }
  // the fridge, cold side
  const body = () => rrect(c, 570, 120, 440, 800, 26);
  shadow(c, 800, 928, 250, 16);
  shape(c, body, "#eef3f8"); shape(c, () => rrect(c, 604, 154, 372, 732, 14), COL.sky, 5);
  shape(c, () => rrect(c, 604, 640, 372, 22, 4), COL.glass, 5); shape(c, () => rrect(c, 604, 400, 372, 22, 4), COL.glass, 5);
  riceBowl(c, 780, 578, 110, WHITE, "#ece3cc", 6); plate(c, 830, 556, 130, 32);
  const flake = (x: number, y: number, r: number) => { for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 7, COL.blueDk); } };
  flake(900, 250, 44); flake(690, 480, 30);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  riceBowl(c, 290, 640, 220, "#d8cda8", "#c1b48a", 7);
  shape(c, () => ell(c, 330, 575, 50, 24), "#8a908a", 4); [[-24, -6], [10, 8], [22, -12]].forEach(([dx, dy]) => shape(c, () => ell(c, 330 + dx, 575 + dy, 10, 6), "#6f756f", 2));
  riceBowl(c, 790, 640, 220, WHITE, "#ece3cc", 8);
  wavy(c, 220, 470, 150, COL.leaf); wavy(c, 300, 460, 170, COL.leaf); wavy(c, 380, 470, 150, COL.leaf);
  shape(c, () => rrect(c, 430, 90, 220, 220, 24), WHITE, 6); shape(c, () => rrect(c, 430, 90, 220, 56, 24), RED, 6);
  write(c, "2", 506, 168, 100, INK, 11);
};

export const su_microorganismsGerms = cards("sci.microorganisms.germs.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e1_4, e2_0, e2_1, e3_0, e3_1, e3_2]);
