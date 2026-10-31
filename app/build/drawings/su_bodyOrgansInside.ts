import type { Ctx } from "./core";
import {
  ground,
  INK, WHITE, RED, COL, SKIN, CLOTH, D, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, glass, cards, rnd,
} from "./flatKit";

// ORGANS INSIDE L3 · set-up cards: egg in a jar (shake), biscuit in a bag (squish), mishri lump vs crushed.

const CREAM = "#f6e3c8", CREAMDK = "#d9bd96", YOLK = "#ffc21f", BISC = "#d9a45c", BISCDK = "#b07d3a", MUSH = "#9b6a3f", MUSHDK = "#7c5230";
const SUG = "#f7efe0", SUGDK = "#d8c8a8";

// a plastic jar with a screw lid: bottom centre (x, y); fill 0..1 water; lid on or off
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, lid: boolean, inner?: () => void) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  const body = () => { rrect(c, x - w / 2, y - h + 50, w, h - 50, 36); rrect(c, x - w * 0.38, y - h + 14, w * 0.76, 50, 6); };
  c.save(); c.beginPath(); body(); c.clip();
  if (fill > 0) { c.fillStyle = COL.water; c.fillRect(x - w, y - (h - 50) * fill - (fill >= 1 ? 40 : 0), w * 2, h * 2); c.fillStyle = COL.waterDk; c.globalAlpha = 0.35; c.fillRect(x + w * 0.2, y - h, w, h * 2); c.globalAlpha = 1; }
  if (inner) inner();
  c.restore();
  shape(c, () => rrect(c, x - w / 2, y - h + 50, w, h - 50, 36), COL.glass, 5);
  shape(c, () => rrect(c, x - w * 0.38, y - h + 14, w * 0.76, 50, 6), "rgba(214,236,250,0.35)", 5);
  shine(c, [[x - w * 0.36, y - h * 0.78], [x - w * 0.36, y - h * 0.25]], 9);
  if (lid) {
    shape(c, () => rrect(c, x - w * 0.43, y - h - 22, w * 0.86, 50, 10), COL.teal, 6);
    shade(c, () => rrect(c, x - w * 0.43, y - h - 22, w * 0.86, 50, 10), COL.tealDk, w * 0.12, 0);
    for (let i = 1; i < 7; i++) line(c, [[x - w * 0.43 + i * w * 0.123, y - h - 16], [x - w * 0.43 + i * w * 0.123, y - h + 22]], 3, COL.tealDk);
  }
};
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  shape(c, () => ell(c, x, y, rx, ry, rot), CREAM, 6);
  shade(c, () => ell(c, x, y, rx, ry, rot), CREAMDK, rx * 0.3, ry * 0.25);
  shine(c, [[x - rx * 0.5, y - ry * 0.35], [x - rx * 0.25, y - ry * 0.6]], 6);
};
// the same egg, cracked: jagged crack, yolk and white leaking out
const crackedEgg = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x + rx * 0.5, y + ry * 0.9, rx * 1.25, ry * 0.3), "rgba(255,255,255,0.95)", 5);
  shape(c, () => ell(c, x + rx * 0.7, y + ry * 0.8, rx * 0.55, ry * 0.3), YOLK, 5);
  egg(c, x, y, rx, ry, -0.4);
  line(c, [[x - rx * 0.6, y - ry * 0.5], [x - rx * 0.2, y - ry * 0.2], [x - rx * 0.4, y + ry * 0.05], [x + rx * 0.1, y + ry * 0.25], [x - rx * 0.1, y + ry * 0.6]], 6);
  line(c, [[x - rx * 0.2, y - ry * 0.2], [x + rx * 0.3, y - ry * 0.45]], 5);
  shape(c, () => polyP(c, [[x + rx * 0.1, y + ry * 0.25], [x + rx * 0.5, y + ry * 0.1], [x + rx * 0.4, y + ry * 0.55], [x - rx * 0.1, y + ry * 0.6]]), YOLK, 5);
};
const zoom = (k: number, cx: number, cy: number, fn: (c: Ctx) => void) => (c: Ctx) => { ground(c); c.save(); c.translate(540, 540); c.scale(k, k); c.translate(-cx, -cy); fn(c); c.restore(); };
const jarEggY = (y: number, ry: number) => y - ry - 14;

// setup.e1.0
const setupE1_0 = zoom(1, 540, 590, (c) => {
  const w = 330, h = 560, y = 860;
  jar(c, 250, y, w, h, 0, true, () => egg(c, 250, jarEggY(y, 70), 92, 70, 0.15));
  jar(c, 830, y, w, h, 1, true, () => egg(c, 830, jarEggY(y, 70), 92, 70, 0.15));
});

// setup.e1.1
const setupE1_1 = zoom(1, 540, 640, (c) => {
  shadow(c, 560, 1005, 440, 40);
  shape(c, () => rrect(c, 90, 880, 900, 140, 40), COL.steel, 6);
  shade(c, () => rrect(c, 90, 880, 900, 140, 40), COL.steelDk, 40, 20);
  shape(c, () => ell(c, 540, 915, 380, 32), COL.steelDk, 5);
  shape(c, () => ell(c, 540, 915, 60, 14), COL.steelIn, 4);
  const y = 830;
  jar(c, 540, y, 330, 500, 1, true, () => egg(c, 540, jarEggY(y, 70), 92, 70, 0.2));
  hand(c, 294, 640, 0, 2);
  hand(c, 786, 640, Math.PI, 2);
  arrow(c, [[190, 420], [190, 250]]);
  arrow(c, [[890, 250], [890, 420]]);
});

const lidOff = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + 12, y + 22, w * 0.5, 16);
  shape(c, () => rrect(c, x - w * 0.43, y - 25, w * 0.86, 50, 10), COL.teal, 6);
  shade(c, () => rrect(c, x - w * 0.43, y - 25, w * 0.86, 50, 10), COL.tealDk, w * 0.12, 0);
  for (let i = 1; i < 7; i++) line(c, [[x - w * 0.43 + i * w * 0.123, y - 19], [x - w * 0.43 + i * w * 0.123, y + 19]], 3, COL.tealDk);
};

// setup.e1.2
const setupE1_2 = zoom(1, 540, 610, (c) => {
  const w = 340, h = 520, y = 800;
  jar(c, 250, y, w, h, 0, false, () => crackedEgg(c, 240, jarEggY(y, 70), 92, 70));
  jar(c, 830, y, w, h, 1, false, () => egg(c, 830, jarEggY(y, 70), 92, 70, 0.15));
  lidOff(c, 250, 930, w);
  lidOff(c, 830, 930, w);
});

// ---- bags and biscuits
const biscuit = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), BISC, 5);
  shade(c, () => ell(c, x, y, r, r * 0.9), BISCDK, r * 0.3, r * 0.25);
  for (let i = 0; i < 6; i++) { const a = i * 1.05; shape(c, () => ell(c, x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.45, r * 0.07, r * 0.07), BISCDK, 0); }
  shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), BISCDK, 0);
};
const chunk = (c: Ctx, x: number, y: number, r: number, k: number) => {
  const p: number[][] = [];
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2 + k, rr = r * (0.7 + 0.3 * Math.sin(i * 2.3 + k * 5)); p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8]); }
  shape(c, () => polyP(c, p), BISC, 5);
  shade(c, () => polyP(c, p), BISCDK, r * 0.3, r * 0.25);
};
// a zip-lock bag, top-left at (x, y); inner() draws what is inside, clipped to the bag
const bag = (c: Ctx, x: number, y: number, w: number, h: number, wet: number, inner: () => void, shad = true) => {
  if (shad) shadow(c, x + w * 0.55, y + h + 6, w * 0.6, 20);
  const body = () => rrect(c, x, y, w, h, 28);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.water; c.fillRect(x, y + h * (1 - wet), w, h);
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.35; c.fillRect(x + w * 0.7, y, w, h); c.globalAlpha = 1;
  inner(); c.restore();
  shape(c, body, "rgba(214,236,250,0.35)", 6);
  shape(c, () => rrect(c, x + 4, y + 4, w - 8, 36, 10), COL.blue, 5);
  line(c, [[x + 20, y + 22], [x + w - 20, y + 22]], 4, COL.blueDk);
  shine(c, [[x + 24, y + 80], [x + 24, y + h * 0.5]], 8);
};
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r + 6, r * 0.8, 14);
  shape(c, () => ell(c, x, y, r, r), COL.red, 6);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.65, y + Math.sin(a) * r * 0.65], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], 5); }
  line(c, [[x, y], [x + r * 0.35, y - r * 0.3]], 9); line(c, [[x, y], [x - r * 0.05, y - r * 0.6]], 6);
  shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), INK, 0);
};

// setup.e2.0
const setupE2_0 = zoom(1.05, 540, 560, (c) => {
  bag(c, 60, 320, 340, 460, 0.28, () => biscuit(c, 230, 690, 115));
  bag(c, 440, 320, 340, 460, 0.28, () => biscuit(c, 610, 690, 115));
  clock(c, 920, 650, 100);
});

// setup.e2.1
const setupE2_1 = zoom(1, 525, 560, (c) => {
  // the squished bag: soft mush, hands pressing both sides; the other bag lies still, biscuit whole
  bag(c, 230, 300, 300, 440, 0.28, () => {
    c.fillStyle = MUSH; c.beginPath(); c.moveTo(230, 560); c.quadraticCurveTo(380, 520, 530, 570); c.lineTo(530, 740); c.lineTo(230, 740); c.closePath(); c.fill();
    const r = rnd(5); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 250 + r() * 260, 590 + r() * 130, 10 + r() * 8, 7), MUSHDK, 0);
  });
  hand(c, 123, 560, 0, 1.5, SKIN.child, CLOTH.child, true);
  hand(c, 637, 560, Math.PI, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[130, 380], [215, 380]]);
  arrow(c, [[630, 380], [545, 380]]);
  bag(c, 800, 540, 250, 200, 0.3, () => biscuit(c, 925, 650, 62));
});

// setup.e2.2
const setupE2_2 = zoom(1, 540, 540, (c) => {
  bag(c, 100, 330, 340, 460, 0.5, () => { c.fillStyle = MUSH; c.fillRect(100, 470, 340, 330); const r = rnd(3); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 130 + r() * 280, 500 + r() * 260, 8, 6), MUSHDK, 0); }, false);
  bag(c, 640, 330, 340, 460, 0.5, () => { chunk(c, 730, 570, 70, 1); chunk(c, 870, 670, 76, 2.4); chunk(c, 760, 720, 60, 3.8); chunk(c, 900, 540, 50, 5.1); }, false);
  hand(c, 270, 219, Math.PI / 2, 1.9);
  hand(c, 810, 219, Math.PI / 2, 1.9);
});

// ---- mishri
const mishri = (c: Ctx, x: number, y: number, r: number, k = 0) => {
  shadow(c, x + r * 0.2, y + r * 0.7, r * 0.9, r * 0.2);
  const pts: number[][] = [];
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + k, rr = r * (0.82 + 0.18 * Math.sin(i * 2.7 + k * 3)); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.85]); }
  shape(c, () => polyP(c, pts), SUG, 6);
  shade(c, () => polyP(c, pts), SUGDK, r * 0.3, r * 0.3);
  line(c, [[x - r * 0.5, y - r * 0.1], [x, y - r * 0.3], [x + r * 0.45, y]], 3, SUGDK);
  line(c, [[x, y - r * 0.3], [x - r * 0.1, y + r * 0.4]], 3, SUGDK);
};
const sugarBits = (c: Ctx, x: number, y: number, spread: number, n: number, seedN: number, r0 = 9) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const bx = x + (r() - 0.5) * spread, by = y + (r() - 0.5) * spread * 0.22; const rr = r0 * (0.7 + r() * 0.6), a = r() * 3; shape(c, () => polyP(c, [[bx + Math.cos(a) * rr, by + Math.sin(a) * rr], [bx + Math.cos(a + 2) * rr, by + Math.sin(a + 2) * rr], [bx + Math.cos(a + 4) * rr, by + Math.sin(a + 4) * rr]]), SUG, 3); }
};
const rollingPin = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 10, 38, len * 0.5, 12);
  shape(c, () => rrect(c, -len / 2 - 50, -9, len + 100, 18, 9), COL.woodDk, 5);
  shape(c, () => rrect(c, -len / 2, -30, len, 60, 16), COL.wood, 6);
  shade(c, () => rrect(c, -len / 2, -30, len, 60, 16), COL.woodDk, 0, 22);
  c.restore();
};
const cloth = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.55, y + h + 10, w * 0.55, 18);
  const p = () => rrect(c, x, y, w, h, 14);
  shape(c, p, COL.cloth, 6);
  shade(c, p, "#e0d8c4", 0, h * 0.7, 0.8);
  c.save(); c.beginPath(); p(); c.clip();
  for (const dy of [0.14, 0.86]) line(c, [[x, y + h * dy], [x + w, y + h * dy]], 12, COL.teal);
  line(c, [[x + w * 0.5, y], [x + w * 0.5, y + h]], 3, COL.grey);
  c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6);
};
// a lump showing through the cloth
const lumpUnder = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.6), "rgba(255,250,240,0.9)", 4); shade(c, () => ell(c, x, y, r, r * 0.6), SUGDK, r * 0.25, r * 0.2); };
// setup.e3.0
const setupE3_0 = zoom(1.1, 540, 590, (c) => {
  glass(c, 650, 480, 190, 260, 0.5);
  glass(c, 890, 480, 190, 260, 0.5);
  mishri(c, 160, 380, 80, 0.3);
  mishri(c, 380, 380, 80, 0.3);
  cloth(c, 110, 640, 400, 240);
  lumpUnder(c, 310, 740, 70);
  rollingPin(c, 800, 780, 300, 0);
});

// a stirring hand holding a steel spoon down into a glass
const stir = (c: Ctx, gx: number, adult: boolean) => {
  const tip = [gx - 20, 780];
  line(c, [[gx + 60, 270], tip], 22, INK);
  line(c, [[gx + 60, 270], tip], 12, COL.steel);
  shape(c, () => ell(c, tip[0], tip[1], 26, 15, 0.5), COL.steel, 5);
  hand(c, gx + 62, 263, 1.73, 1.7, adult ? SKIN.adult : SKIN.child, adult ? CLOTH.adult : CLOTH.child);
};

// setup.e3.1
const setupE3_1 = zoom(1, 540, 540, (c) => {
  glass(c, 290, 900, 300, 400, 0.62);
  glass(c, 790, 900, 300, 400, 0.62);
  mishri(c, 290, 840, 62, 0.3);
  sugarBits(c, 790, 862, 160, 40, 4, 10);
  clock(c, 540, 810, 85);
  stir(c, 290, false);
  stir(c, 790, true);
  arrow(c, [[170, 640], [290, 610], [410, 640]]);
  arrow(c, [[670, 640], [790, 610], [910, 640]]);
});

// setup.e3.2
const setupE3_2 = zoom(1, 540, 590, (c) => {
  glass(c, 250, 900, 340, 480, 0.7);
  glass(c, 830, 900, 340, 480, 0.7);
  mishri(c, 830, 855, 62, 0.3);
  clock(c, 540, 810, 90);
});

export const su_bodyOrgansInside = cards("sci.body.organs-inside.L3 set-up", [
  setupE1_0, setupE1_1, setupE1_2, setupE2_0, setupE2_1, setupE2_2, setupE3_0, setupE3_1, setupE3_2,
]);
