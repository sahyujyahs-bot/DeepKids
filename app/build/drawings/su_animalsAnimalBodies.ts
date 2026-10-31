import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SH, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd, cards } from "./flatKit";

// sci.animals.animal-bodies.L3 · set-up cards. Same child, grown-up, rug, glasses and ants on every card of an experiment.

const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const FY = 880; // floor line where feet and chair legs stand

// ---------------------------------------------------------------- experiment 1: breathing
const room = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, 800, 1080, 280);
  line(c, [[0, 800], [1080, 800]], 5);
  shape(c, () => polyP(c, [[110, 850], [970, 850], [1040, 1050], [40, 1050]]), COL.orange, 6);
  shape(c, () => polyP(c, [[160, 880], [920, 880], [975, 1020], [105, 1020]]), COL.blue, 4);
  shade(c, () => polyP(c, [[110, 850], [970, 850], [1040, 1050], [40, 1050]]), COL.blueDk, 0, 0, 0);
  line(c, [[190, 930], [890, 930]], 5, COL.yellow);
};
// a stopwatch face: the red part is the time going round
const stopwatch = (c: Ctx, x: number, y: number, r: number, frac: number) => {
  shape(c, () => rrect(c, x - r * 0.16, y - r * 1.3, r * 0.32, r * 0.34, 4), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.78, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.closePath(); c.fillStyle = RED; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], 4); }
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), "rgba(0,0,0,0)", 4);
  line(c, [[x, y], [x, y - r * 0.7]], 6);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, frac: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), "#3a3540", 6);
  shape(c, () => rrect(c, x - w * 0.42, y - h * 0.44, w * 0.84, h * 0.88, w * 0.08), "#fffaf0", 3);
  stopwatch(c, x, y + h * 0.04, w * 0.3, frac);
};
const wristOf = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number], sit = false): [number, number] => {
  const sh = sit ? y - h * 0.38 : y - h * 0.74, sx = x + side * h * 0.11, sy = sh + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
// the grown-up standing, holding the phone timer out towards the child
const adultTimer = (c: Ctx, x: number, h: number, frac: number) => {
  shadow(c, x + 20, FY + 6, h * 0.22, 16);
  const arm: [number, number] = [2.2, 3.6];
  person(c, x, FY, h, { adult: true, armL: arm });
  const [wx, wy] = wristOf(x, FY, h, -1, arm);
  phone(c, wx - 12, wy - 100, 150, 250, frac);
  shape(c, () => ell(c, wx + 2, wy - 4, 26, 24), SKIN.adult, 5);
  line(c, [[wx - 14, wy - 22], [wx + 10, wy - 12]], 4, SKIN.adultDk);
};
// the child sitting on a small chair, one hand on the chest
const KX = 280, KH = 700, SEAT = FY - 210;
const sitKid = (c: Ctx, handOnChest = true) => {
  shadow(c, KX + 60, FY + 6, 200, 18);
  const h = KH;
  thick(c, [[KX - h * 0.18, SEAT + 8], [KX - h * 0.19, FY]], 18, COL.brown);
  thick(c, [[KX + h * 0.17, SEAT + 8], [KX + h * 0.18, FY]], 18, COL.brown);
  shape(c, () => rrect(c, KX - h * 0.24, SEAT - h * 0.5, h * 0.045, h * 0.52, 8), COL.wood, 5);
  shape(c, () => rrect(c, KX - h * 0.24, SEAT, h * 0.46, h * 0.045, 8), COL.wood, 5);
  person(c, KX, SEAT, h, { sit: true, armR: handOnChest ? [Math.PI * 0.4, 3.55] : undefined });
  if (handOnChest) hand(c, 335, 498, Math.PI + 0.25, 0.8, SKIN.child, CLOTH.child, true);
  for (const s of [-1, 1]) {
    const sx = KX + h * 0.3 + s * h * 0.03;
    thick(c, [[sx, SEAT], [sx, FY - 14]], h * 0.065, "#6b5a8c");
    shape(c, () => ell(c, sx + 14, FY - 8, 36, 16), COL.brown, 5);
  }
};
// e1.0
const e1s0 = (c: Ctx) => {
  room(c);
  adultTimer(c, 820, 720, 0.75);
  sitKid(c);
};
// e1.1
const e1s1 = (c: Ctx) => {
  room(c);
  adultTimer(c, 850, 720, 0.75);
  const x = 360, h = 640, up = 120;
  shadow(c, x + 14, FY + 10, 150, 18);
  person(c, x, FY - up, h, { armL: [-2.2, -1.9], armR: [-0.95, -1.25] });
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * h * 0.06 + 12, FY - up + 6, 34, 15), COL.brown, 5);
  arrow(c, [[120, 640], [120, 450]]);
};
// e1.2
const e1s2 = (c: Ctx) => {
  room(c);
  sitKid(c);
  // hard breaths: puffs in front of the face, sweat drops
  for (const [px, py, pr] of [[KX + 135, 330, 24], [KX + 190, 295, 30], [KX + 160, 380, 22]]) shape(c, () => ell(c, px, py, pr, pr * 0.8), WHITE, 5);
  for (const [px, py] of [[KX - 112, 225], [KX + 112, 215]]) shape(c, () => { c.moveTo(px, py - 26); c.quadraticCurveTo(px + 20, py + 4, px, py + 14); c.quadraticCurveTo(px - 20, py + 4, px, py - 26); c.closePath(); }, COL.water, 4);
  // the grown-up writes the count in a table on a clipboard
  c.save(); c.translate(710, 430); c.rotate(-0.04);
  shadow(c, 18, 300, 190, 20);
  shape(c, () => rrect(c, -190, -270, 380, 560, 22), COL.brown, 6);
  shape(c, () => rrect(c, -162, -228, 324, 490, 8), WHITE, 5);
  shape(c, () => rrect(c, -60, -262, 120, 40, 12), COL.steel, 5);
  line(c, [[-162, -60], [162, -60]], 5); line(c, [[-162, 100], [162, 100]], 5); line(c, [[-60, -228], [-60, 262]], 5);
  write(c, "1", -125, -170, 70, INK, 7);
  write(c, "18", -30, -170, 70, INK, 7);
  write(c, "2", -125, 6, 70, INK, 7);
  write(c, "30", -30, 6, 70, INK, 7);
  c.restore();
  line(c, [[790, 512], [905, 397]], 16, INK); line(c, [[790, 512], [905, 397]], 8, COL.blue);
  hand(c, 914, 525, -2.356, 1.4, SKIN.adult, CLOTH.adult);
};

// ---------------------------------------------------------------- experiment 2: limewater
const table = (c: Ctx, top = 905) => { c.fillStyle = "#e0bd82"; c.fillRect(0, top, 1080, 1080 - top); line(c, [[0, top], [1080, top]], 6); };
const bubbles = (c: Ctx, pts: number[][]) => pts.forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.8)", 3.5));
const jug = (c: Ctx, x: number, y: number, w: number, h: number, inside: (L: number, T: number) => void) => {
  const L = x - w / 2, T = y - h, body = () => rrect(c, L, T, w, h, 34);
  shadow(c, x + w * 0.1, y + 8, w * 0.65, w * 0.09);
  thick(c, [[L + w - 8, T + h * 0.16], [L + w + 70, T + h * 0.26], [L + w + 70, T + h * 0.68], [L + w - 8, T + h * 0.78]], 18, "#cfe6f5");
  shape(c, body, COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip(); inside(L, T); c.restore();
  shape(c, body, "rgba(255,255,255,0.12)", 6);
  shine(c, [[L + 28, T + h * 0.2], [L + 28, T + h * 0.8]], 9);
};
// e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  table(c, 880);
  const w = 300, h = 420, y = 900;
  // left: stirring chuna into the water
  jug(c, 270, y, w, h, (L, T) => {
    c.fillStyle = "#f4f0e6"; c.fillRect(L, T + h * 0.2, w, h);
    shape(c, () => ell(c, L + w / 2, T + h * 0.2, w / 2, 20), "#ffffff", 0);
    line(c, [[L + 70, T + h * 0.5], [L + 140, T + h * 0.58], [L + 210, T + h * 0.5]], 7, "#dcd6c8");
  });
  const sx = 305;
  line(c, [[sx, 90], [sx, 800]], 24, INK); line(c, [[sx, 90], [sx, 800]], 12, COL.steel);
  shape(c, () => ell(c, sx, 810, 40, 28), COL.steel, 5);
  shape(c, () => ell(c, sx, 810, 26, 16), "#f4f0e6", 3);
  hand(c, sx - 126, 250, 0, 1.8, SKIN.adult, CLOTH.adult);
  arrow(c, [[170, 470], [220, 440], [305, 430], [390, 440], [440, 470]]);
  // then: left alone overnight, the white chuna has settled
  const rx = 810;
  jug(c, rx, y, w, h, (L, T) => {
    c.fillStyle = COL.water; c.globalAlpha = 0.35; c.fillRect(L, T + h * 0.2, w, h); c.globalAlpha = 1;
    shape(c, () => { c.moveTo(L - 10, y - 95); c.quadraticCurveTo(L + w * 0.3, y - 112, L + w * 0.5, y - 98); c.quadraticCurveTo(L + w * 0.75, y - 84, L + w + 10, y - 100); c.lineTo(L + w + 10, y + 10); c.lineTo(L - 10, y + 10); c.closePath(); }, "#fffdf6", 4);
    shade(c, () => { c.moveTo(L - 10, y - 95); c.lineTo(L + w + 10, y - 95); c.lineTo(L + w + 10, y + 10); c.lineTo(L - 10, y + 10); c.closePath(); }, "#dcd6c8", 20, 14, 0.4);
  });
  // the moon and stars: overnight
  shape(c, () => ell(c, 820, 190, 70, 70), COL.yellow, 5);
  c.save(); c.beginPath(); ell(c, 820, 190, 70, 70); c.clip(); shape(c, () => ell(c, 855, 170, 62, 62), "#efe4cf", 5); c.restore();
  for (const [sx2, sy, r] of [[960, 150, 26], [690, 120, 20], [940, 290, 18]]) shape(c, () => polyP(c, [[sx2, sy - r], [sx2 + r * 0.3, sy - r * 0.3], [sx2 + r, sy], [sx2 + r * 0.3, sy + r * 0.3], [sx2, sy + r], [sx2 - r * 0.3, sy + r * 0.3], [sx2 - r, sy], [sx2 - r * 0.3, sy - r * 0.3]]), COL.yellow, 4);
  arrow(c, [[500, 640], [600, 640]]);
};

const GX1 = 300, GX2 = 790, GBASE = 930, GW = 250, GH = 380;
const glassOf = (c: Ctx, x: number, y: number, w: number, h: number, milky: boolean) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  const fill = 0.74, ly = y - h * fill, lw = bot + (top - bot) * fill;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, milky ? "#f6f2ea" : COL.water, 0);
  if (milky) shade(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, "#d8d2c4", w * 0.2, 0, 0.7);
  shape(c, () => ell(c, x, ly, lw, w * 0.07), milky ? "#ffffff" : COL.drop, 0);
  shape(c, body, COL.glass, 5);
  if (milky) {
    const m = () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
    shape(c, m, "#ffffff", 0); shade(c, m, "#d3cdbf", w * 0.22, 0, 0.8); shape(c, () => ell(c, x, ly, lw, w * 0.07), "#ffffff", 4);
    shape(c, body, "rgba(0,0,0,0)", 5);
  }
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
// e2.1
const e2s1 = (c: Ctx) => {
  ground(c);
  // the child blows into a straw
  shape(c, () => rrect(c, -90, 440, 390, 700, 70), CLOTH.child, 6);
  shade(c, () => rrect(c, -90, 440, 390, 700, 70), CLOTH.childDk, 40, 0, 0.55);
  shape(c, () => rrect(c, 160, 360, 80, 120, 20), SKIN.childDk, 5);
  shape(c, () => ell(c, 120, 220, 38, 70, 0.3), CLOTH.hair, 5);
  shape(c, () => ell(c, 230, 270, 118, 122), SKIN.child, 6);
  shape(c, () => { c.moveTo(114, 290); c.arc(230, 270, 124, Math.PI * 0.88, Math.PI * 1.88); c.quadraticCurveTo(300, 200, 250, 190); c.quadraticCurveTo(170, 205, 114, 290); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 118, 290, 20, 30), SKIN.childDk, 4);
  shape(c, () => ell(c, 342, 270, 18, 22), SKIN.child, 5);
  shape(c, () => ell(c, 300, 322, 40, 32), COL.pink, 0); c.globalAlpha = 1;
  shape(c, () => ell(c, 292, 238, 11, 15), INK, 0);
  line(c, [[268, 212], [318, 212]], 6, CLOTH.hair);
  table(c);
  glassOf(c, GX1, GBASE, GW, GH, false);
  glassOf(c, GX2, GBASE, GW, GH, false);
  thick(c, [[356, 322], [326, 840]], 14, COL.pink);
  shape(c, () => ell(c, 350, 322, 14, 11), "#b9794f", 4);
  bubbles(c, [[318, 800, 14], [345, 760, 10], [296, 735, 9], [338, 690, 12], [316, 640, 8]]);
  // the grown-up squeezes an empty plastic bottle held upside down: pinched waist, ribs, narrow neck
  const bt = () => { c.moveTo(722, 70); c.lineTo(858, 70); c.quadraticCurveTo(892, 70, 892, 104); c.lineTo(892, 330); c.quadraticCurveTo(892, 372, 846, 394); c.lineTo(826, 412); c.lineTo(826, 450); c.lineTo(756, 450); c.lineTo(756, 412); c.lineTo(736, 394); c.quadraticCurveTo(688, 372, 688, 330); c.lineTo(688, 300); c.quadraticCurveTo(750, 250, 688, 200); c.lineTo(688, 104); c.quadraticCurveTo(688, 70, 722, 70); c.closePath(); };
  shape(c, bt, "#d6ecfa", 6);
  shade(c, bt, COL.glassEdge, 30, 0, 0.35);
  line(c, [[700, 110], [880, 110]], 5, COL.glassEdge); line(c, [[700, 132], [880, 132]], 5, COL.glassEdge);
  line(c, [[704, 345], [876, 345]], 5, COL.glassEdge);
  shape(c, () => rrect(c, 746, 440, 88, 16, 5), COL.blue, 5);
  shine(c, [[712, 150], [712, 190]], 9); shine(c, [[712, 310], [720, 350]], 9);
  thick(c, [[790, 446], [800, 850]], 14, COL.pink);
  bubbles(c, [[820, 800, 14], [776, 770, 10], [830, 720, 9], [782, 680, 12], [816, 630, 8]]);
  hand(c, 925, 250, Math.PI, 1.75, SKIN.adult, CLOTH.adult);
  arrow(c, [[560, 250], [650, 250]]);
};
// e2.2
const e2s2 = (c: Ctx) => {
  ground(c);
  table(c, 830);
  glassOf(c, 290, 880, 300, 470, true);
  glassOf(c, 790, 880, 300, 470, false);
  for (const [x, y] of [[860, 300], [960, 210]]) { line(c, [[x - 18, y], [x + 18, y]], 5, COL.yellow); line(c, [[x, y - 18], [x, y + 18]], 5, COL.yellow); }
};

// ---------------------------------------------------------------- experiment 3: ants
const tiles = (c: Ctx) => {
  ground(c, "#efe4cf");
  c.strokeStyle = "#d9c9a8"; c.lineWidth = 4;
  for (let k = -400; k < 1500; k += 130) { line(c, [[k, -400], [k, 1500]], 4, "#d9c9a8"); line(c, [[-400, k], [1500, k]], 4, "#d9c9a8"); }
};
// an ant walking towards angle an; carry = a grain of sugar in its jaws
const ant = (c: Ctx, x: number, y: number, an: number, s: number, carry = false) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-10, 2, 14]) for (const m of [-1, 1]) line(c, [[k, 0], [k + 6, m * 17], [k - 6, m * 28]], 4.5);
  for (const m of [-1, 1]) line(c, [[28, m * 4], [42, m * 14], [52, m * 8]], 3.5);
  shape(c, () => ell(c, -26, 0, 20, 14), COL.black, 4);
  shape(c, () => ell(c, 0, 0, 12, 10), COL.black, 4);
  shape(c, () => ell(c, 22, 0, 11, 10), COL.black, 4);
  c.globalAlpha = 0.6; shape(c, () => ell(c, -30, -5, 9, 4), "#8f8a99", 0); c.globalAlpha = 1;
  if (carry) shape(c, () => rrect(c, 30, -7, 15, 14, 3), WHITE, 3.5);
  c.restore();
};
const sheetOf = (c: Ctx, x: number, y: number, s: number, rot: number, fn: () => void) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.save(); c.translate(14, 18); c.beginPath(); rrect(c, -s / 2, -s / 2, s, s, 8); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, 8), WHITE, 6);
  fn(); c.restore();
};
const mound = (c: Ctx, r: number, base: string, dark: string, y0 = 0) => {
  const p = () => { c.moveTo(-r, y0 + r * 0.25); c.quadraticCurveTo(-r * 0.8, y0 - r * 0.9, 0, y0 - r * 0.85); c.quadraticCurveTo(r * 0.8, y0 - r * 0.9, r, y0 + r * 0.25); c.quadraticCurveTo(0, y0 + r * 0.55, -r, y0 + r * 0.25); c.closePath(); };
  shape(c, p, base, 5); shade(c, p, dark, r * 0.35, r * 0.1, 0.6);
};
const grains = (c: Ctx, r: number, n: number, seedN: number, col: string, size: number) => {
  const g = rnd(seedN);
  for (let i = 0; i < n; i++) { const a = g() * Math.PI * 2, d = Math.sqrt(g()) * r * 0.78; const gx = Math.cos(a) * d, gy = -r * 0.25 + Math.sin(a) * d * 0.55; c.save(); c.translate(gx, gy); c.rotate(g() * 3); c.fillStyle = col; c.fillRect(-size / 2, -size / 2, size, size); c.restore(); }
};
const sugarHeap = (c: Ctx, r: number) => {
  mound(c, r, "#fffdf5", "#e3dccb");
  grains(c, r, 26, 3, "#ffffff", r * 0.11);
  grains(c, r, 18, 4, "#cfe8f4", r * 0.08);
  shape(c, () => rrect(c, r * 0.55, r * 0.2, r * 0.36, r * 0.34, 4), "#fffdf5", 4);
  line(c, [[r * 0.61, r * 0.28], [r * 0.82, r * 0.28]], 3, "#c9c2b0");
};
const saltHeap = (c: Ctx, r: number) => {
  mound(c, r, "#eef0f2", "#c3c8cf");
  grains(c, r, 70, 5, "#ffffff", r * 0.045);
  grains(c, r, 50, 6, "#b4bcc6", r * 0.045);
};
// a round biscuit with a bite out of it and a few crumbs
const crumbHeap = (c: Ctx, r: number) => {
  shape(c, () => ell(c, 0, -r * 0.1, r * 0.62, r * 0.62), "#e0a85a", 6);
  shade(c, () => ell(c, 0, -r * 0.1, r * 0.62, r * 0.62), "#b9772f", r * 0.18, r * 0.12, 0.5);
  c.save(); c.beginPath(); ell(c, 0, -r * 0.1, r * 0.62, r * 0.62); c.clip(); shape(c, () => ell(c, r * 0.55, r * 0.35, r * 0.3, r * 0.26), "#ffffff", 0); c.restore();
  c.beginPath(); c.arc(r * 0.55, r * 0.35, r * 0.3, Math.PI * 0.9, Math.PI * 1.6); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (const [dx, dy] of [[-0.25, -0.35], [0.1, -0.5], [-0.35, -0.05], [0, -0.15], [-0.1, 0.2], [0.3, -0.3]]) shape(c, () => ell(c, dx * r, dy * r, r * 0.05, r * 0.05), "#7a4a2a", 0);
  const g = rnd(11);
  for (let i = 0; i < 6; i++) { const cx = (g() - 0.2) * r * 1.1, cy = r * 0.4 + g() * r * 0.15; c.save(); c.translate(cx, cy); c.rotate(g() * 3); shape(c, () => rrect(c, -9, -7, 18, 14, 4), "#e0a85a", 3.5); c.restore(); }
};
const dotted = (c: Ctx, x: number, y0: number, y1: number) => { for (let y = y0; y <= y1; y += 26) shape(c, () => ell(c, x, y, 5, 5), "rgba(43,35,64,0.45)", 0); };
// e3.0
const e3s0 = (c: Ctx) => {
  tiles(c);
  c.fillStyle = "#f3e3c3"; c.fillRect(0, 0, 1080, 190); c.fillStyle = "#d9b98a"; c.fillRect(0, 190, 1080, 40); line(c, [[0, 190], [1080, 190]], 6); line(c, [[0, 230], [1080, 230]], 6);
  shape(c, () => polyP(c, [[150, 190], [210, 190], [195, 230], [165, 230]]), INK, 0);
  for (let i = 0; i < 9; i++) ant(c, 230 + i * 100, 360 + Math.sin(i * 1.7) * 8, 0.04 * Math.sin(i), 1.15);
  const xs = [190, 540, 890];
  sheetOf(c, xs[0], 730, 300, -0.05, () => { c.translate(0, 36); sugarHeap(c, 118); });
  sheetOf(c, xs[1], 730, 300, 0.04, () => { c.translate(0, 36); saltHeap(c, 118); });
  sheetOf(c, xs[2], 730, 300, -0.03, () => { c.translate(0, 24); crumbHeap(c, 118); });
  xs.forEach((x) => dotted(c, x, 440, 560));
};
// e3.1
const sugarScene = (c: Ctx) => {
  tiles(c);
  sheetOf(c, 400, 720, 480, -0.04, () => { c.translate(0, 40); sugarHeap(c, 150); });
  const A: number[][] = [[210, 560, 0.5], [190, 700, 0.2], [250, 850, -0.4], [330, 905, -1.2], [560, 880, -2.4], [590, 560, 3.6], [330, 530, 1.0], [470, 530, 1.6], [520, 700, 3.0], [305, 760, 0.1], [440, 790, 4.6]];
  A.forEach(([x, y, a], i) => ant(c, x, y, a, 0.85, i % 4 === 3));
};
const e3s1 = (c: Ctx) => {
  sugarScene(c);
  const lx = 450, ly = 640, lr = 190;
  // the lens shows the same sugar and ants bigger
  c.save(); c.beginPath(); ell(c, lx, ly, lr, lr); c.clip();
  c.translate(lx, ly); c.scale(2.1, 2.1); c.translate(-400, -700); sugarScene(c);
  c.restore();
  c.save(); c.beginPath(); ell(c, lx, ly, lr, lr); c.clip(); c.globalAlpha = 0.18; c.fillStyle = WHITE; c.beginPath(); c.moveTo(lx - lr, ly - lr); c.lineTo(lx - lr * 0.2, ly - lr); c.lineTo(lx - lr, ly - lr * 0.1); c.closePath(); c.fill(); c.restore(); c.globalAlpha = 1;
  thick(c, [[lx, ly - lr - 8], [lx, 130]], 26, COL.wood);
  shape(c, () => ell(c, lx, ly, lr + 14, lr + 14), "rgba(0,0,0,0)", 6);
  c.beginPath(); ell(c, lx, ly, lr + 6, lr + 6); c.strokeStyle = "#3a3540"; c.lineWidth = 28; c.stroke();
  c.beginPath(); ell(c, lx, ly, lr + 21, lr + 21); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.beginPath(); ell(c, lx, ly, lr - 9, lr - 9); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shine(c, [[lx - lr * 0.62, ly - lr * 0.3], [lx - lr * 0.4, ly - lr * 0.62]], 12);
  hand(c, lx - 120, 250, 0, 1.7, SKIN.child, CLOTH.child);
  shadow(c, 905, 925, 120, 22);
  stopwatch(c, 905, 760, 130, 0.17);
};
// e3.2
const e3s2 = (c: Ctx) => {
  tiles(c);
  c.fillStyle = "#f3e3c3"; c.fillRect(0, 0, 1080, 170); c.fillStyle = "#d9b98a"; c.fillRect(0, 170, 1080, 40); line(c, [[0, 170], [1080, 170]], 6); line(c, [[0, 210], [1080, 210]], 6);
  shape(c, () => polyP(c, [[160, 170], [240, 170], [222, 210], [180, 210]]), INK, 0);
  sheetOf(c, 850, 830, 320, 0.05, () => { c.translate(0, 30); sugarHeap(c, 125); });
  // the path home, as dotted smell
  const P = [[730, 800], [330, 900], [820, 420], [230, 250]];
  const at = (t: number): number[] => { const u = 1 - t; return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); };
  const pts: number[][] = []; for (let i = 0; i <= 400; i++) pts.push(at(i / 400));
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const posAt = (d: number): number[] => { let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const a = pts[i - 1], b = pts[i]; return [a[0], a[1], Math.atan2(b[1] - a[1], b[0] - a[0])]; };
  for (let d = 0; d < cum[cum.length - 1]; d += 26) { const [x, y] = posAt(d); shape(c, () => ell(c, x, y, 8, 8), "rgba(168,84,176,0.7)", 0); }
  for (let d = 30; d < cum[cum.length - 1] - 40; d += 135) { const [x, y, a] = posAt(d); ant(c, x, y, a, 1.05, true); }
};

// the cards, in key order: setup.e1.0 ... setup.e3.2
export const su_animalsAnimalBodies = cards("sci.animals.animal-bodies.L3 set-up", [
  e1s0, // setup.e1.0
  e1s1, // setup.e1.1
  e1s2, // setup.e1.2
  e2s0, // setup.e2.0
  e2s1, // setup.e2.1
  e2s2, // setup.e2.2
  e3s0, // setup.e3.0
  e3s1, // setup.e3.1
  e3s2, // setup.e3.2
]);
