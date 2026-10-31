import type { Ctx } from "./core";
import { COL, INK, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, leaf, hand, write, rnd, cards } from "./flatKit";

// sci.plants.what-plants-need.L3 · set-up cards. Same cups, tray and cones on every card of an experiment.

const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };

// a cup standing on its bottom centre (x, y); paper = cream paper cup with a teal band, else clear plastic with soil showing.
// returns the y of the soil surface
const cup = (c: Ctx, x: number, y: number, w: number, h: number, paper = true) => {
  const tw = w / 2, bw = w * 0.36, ry = w * 0.09, hw = (t: number) => bw + (tw - bw) * t;
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.09);
  const body = () => { c.moveTo(x - tw, y - h); c.lineTo(x + tw, y - h); c.lineTo(x + bw, y); c.lineTo(x - bw, y); c.closePath(); };
  if (!paper) shape(c, () => polyP(c, [[x - hw(0.72), y - h * 0.72], [x + hw(0.72), y - h * 0.72], [x + bw, y], [x - bw, y]]), COL.soil, 0);
  shape(c, body, paper ? COL.paper : COL.glass, 5);
  if (paper) {
    shade(c, body, "#cfc3a8", -w * 0.2, 0, 0.6);
    shape(c, () => polyP(c, [[x - hw(0.62), y - h * 0.62], [x + hw(0.62), y - h * 0.62], [x + hw(0.3), y - h * 0.3], [x - hw(0.3), y - h * 0.3]]), COL.teal, 4);
  } else shine(c, [[x - tw * 0.72, y - h * 0.92], [x - bw * 0.8, y - h * 0.15]], 7);
  shape(c, () => ell(c, x, y - h, tw, ry), paper ? "#efe6d2" : "rgba(255,255,255,0.35)", 5);
  shape(c, () => ell(c, x, y - h + 3, tw - 10, ry - 5), COL.soil, 3);
  return y - h + 3;
};
// soaked moong seeds lying on the soil of a cup
const SEEDPOS = [[-56, -3, 0.3], [-26, 6, 2.4], [4, -4, 1.2], [34, 6, 0.1], [62, -2, 2.0]];
const seedsOn = (c: Ctx, x: number, sy: number, n: number, r = 15) => SEEDPOS.slice(0, n).forEach(([dx, dy, rot]) => seed(c, x + dx, sy + dy, r, rot, true));
// a young moong seedling: stem and two leaves
const plant = (c: Ctx, x: number, y: number, h: number, w: number, stem: string = COL.greenLt, lf: string = COL.leaf, len = Math.min(64, h * 0.42)) => {
  thick(c, [[x, y], [x, y - h]], w, stem);
  leaf(c, x, y - h + 4, len, -Math.PI * 0.8, lf); leaf(c, x, y - h + 4, len, -Math.PI * 0.2, lf);
};
// a seedling grown in the dark: tall, pale, bent over at the top
const hookPlant = (c: Ctx, x: number, y: number, h: number) => {
  const T = y - h + 45, pts: number[][] = [[x, y], [x, T]];
  for (let a = Math.PI; a <= Math.PI * 2 + 0.5; a += 0.3) pts.push([x + 32 + 32 * Math.cos(a), T + 32 * Math.sin(a)]);
  thick(c, pts, 12, "#f3e7a6");
};
const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.3); c.bezierCurveTo(x + s * 0.2, y - s * 0.7, x + s * 0.9, y - s * 0.2, x + s * 0.9, y + s * 0.2); c.arc(x, y + s * 0.2, s * 0.9, 0, Math.PI); c.bezierCurveTo(x - s * 0.9, y - s * 0.2, x - s * 0.2, y - s * 0.7, x, y - s * 1.3); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => dropP(c, x, y, s), COL.water, 5); shine(c, [[x - s * 0.4, y + s * 0.1], [x - s * 0.35, y + s * 0.45]], 6); };
// a steel spoon: head at (x, y), handle running out at angle ang; s = size (1 = tablespoon)
const spoon = (c: Ctx, x: number, y: number, len: number, ang: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, () => polyP(c, [[20 * s, -6 * s], [len, -9 * s], [len, 9 * s], [20 * s, 6 * s]]), COL.steel, 5);
  shape(c, () => ell(c, 0, 0, 36 * s, 23 * s), COL.steel, 5);
  shape(c, () => ell(c, 0, 0, 26 * s, 14 * s), COL.steelIn, 3);
  c.restore();
};
// a wooden ruler body from (x0, y0) to (x1, y1) given as a rectangle
const wood = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 6), COL.wood); shade(c, () => rrect(c, x, y, w, h, 6), COL.woodDk, 0, -h * 0.12, 0.7); };

// ---------------------------------------------------------------- experiment 1: the light test
const E1 = [[190, 620], [395, 620], [600, 620], [190, 860], [395, 860], [600, 860]];
const E1W = 175, E1H = 150;
const tray = (c: Ctx) => {
  shadow(c, 400, 945, 370, 26);
  shape(c, () => rrect(c, 30, 400, 730, 540, 40), COL.steel);
  shade(c, () => rrect(c, 30, 400, 730, 540, 40), COL.steelDk, -30, 0, 0.5);
  shape(c, () => rrect(c, 54, 424, 682, 484, 28), COL.steelIn, 4);
};
const sixCups = (c: Ctx, seeds: number[]) => {
  tray(c);
  E1.forEach(([x, y], i) => { const sy = cup(c, x, y, E1W, E1H); seedsOn(c, x, sy, seeds[i]); });
};
const e1s0 = (c: Ctx) => {
  ground(c);
  sixCups(c, [5, 5, 5, 5, 3, 0]);
  hand(c, 720, 665, Math.PI * 0.8, 1.5);
  seed(c, 622, 728, 15, 0.4, true);
  arrow(c, [[960, 560], [890, 640]]);
};
const e1s1 = (c: Ctx) => {
  ground(c);
  sixCups(c, [5, 5, 5, 5, 5, 5]);
  spoon(c, 880, 740, 170, Math.PI * 0.45);
  // the cardboard box coming down over the back row
  shadow(c, 420, 665, 330, 24);
  shape(c, () => polyP(c, [[85, 330], [695, 330], [745, 280], [135, 280]]), "#e2bd88");
  shape(c, () => polyP(c, [[695, 330], [745, 280], [745, 600], [695, 650]]), "#a97c48");
  shape(c, () => rrect(c, 85, 330, 610, 320, 6), "#c99b64");
  shape(c, () => polyP(c, [[365, 330], [445, 330], [495, 280], [415, 280]]), "#f2d9a8", 4);
  arrow(c, [[400, 70], [400, 220]]);
};
const e1s2 = (c: Ctx) => {
  ground(c);
  // dark cup: a tall pale seedling with a hooked top; light cup: a short green seedling
  const sy1 = cup(c, 270, 930, 260, 190);
  seedsOn(c, 270, sy1, 0);
  plant(c, 270, sy1, 150, 16, COL.green, COL.leaf, 64);
  const sy2 = cup(c, 760, 930, 260, 190);
  hookPlant(c, 790, sy2, 440);
  // the ruler stands in the soil, 0 at the soil, 40 px for each cm
  const x0 = 615, top = sy2 - 600;
  wood(c, x0, top, 60, 612);
  for (let cm = 1; cm <= 15; cm++) { const y = sy2 - cm * 40, l = cm % 5 === 0 ? 34 : 20; line(c, [[x0, y], [x0 + l, y]], cm % 5 === 0 ? 4 : 3); }
  [5, 10, 15].forEach((cm) => write(c, String(cm), x0 + 6, sy2 - cm * 40 + 8, 22, INK, 4));
  line(c, [[x0 + 60, sy2 - 440 + 13], [x0 + 190, sy2 - 440 + 13]], 5, RED);
  hand(c, 565, 440, 0, 1.4);
};

// ---------------------------------------------------------------- experiment 2: the water test
const e2s0 = (c: Ctx) => {
  ground(c);
  for (const y of [330, 600, 870]) for (const x of [250, 540, 830]) { const sy = cup(c, x, y, 150, 115, false); plant(c, x, sy, 85, 11, COL.greenLt, COL.leaf, 38); }
};
const e2s1 = (c: Ctx) => {
  ground(c);
  const rows = [300, 630, 960];
  rows.forEach((base, r) => {
    const xs = [470, 660, 850];
    if (r === 2) shape(c, () => rrect(c, 385, base - 100, 970 - 385, 114, 14), "rgba(214,236,250,0.4)", 5);
    xs.forEach((x) => { const sy = cup(c, x, base, 140, 110, false); plant(c, x, sy, 70, 10, COL.greenLt, COL.leaf, 34); });
    if (r === 2) { shape(c, () => rrect(c, 385, base - 62, 970 - 385, 76, 12), "rgba(95,159,211,0.55)", 5); shine(c, [[420, base - 40], [500, base - 40]], 7); }
  });
  // none: a crossed-out drop; just right: one spoon, one drop; soaked: a drop on waves
  const b0 = rows[0], b1 = rows[1], b2 = rows[2];
  drop(c, 190, b0 - 110, 52); line(c, [[120, b0 - 190], [260, b0 - 40]], 14, RED); line(c, [[260, b0 - 190], [120, b0 - 40]], 14, RED);
  spoon(c, 150, b1 - 150, 150, -0.5);
  drop(c, 160, b1 - 55, 30); write(c, "1", 240, b1 - 100, 56, INK, 7);
  drop(c, 190, b2 - 130, 48);
  for (const dy of [-50, -20]) line(c, Array.from({ length: 13 }, (_, i) => [110 + i * 13, b2 + dy + Math.sin(i * 1.4) * 8]), 9, COL.waterDk);
};
const specimen = (c: Ctx, x: number, kind: number) => {
  const yS = 470;
  if (kind === 0) {
    thick(c, [[x, yS], [x - 4, 400], [x + 6, 330]], 9, "#c9cf86");
    leaf(c, x + 6, 334, 70, -Math.PI * 0.95, "#b5bd6a"); leaf(c, x + 6, 334, 70, -Math.PI * 0.08, "#b5bd6a");
    for (const [dx, ex] of [[-8, -50], [0, 4], [8, 52]]) thick(c, [[x + dx, yS], [x + dx + ex * 0.4, yS + 30], [x + dx + ex * 0.2, yS + 55], [x + ex * 0.8, yS + 85]], 7, "#b8956a");
  } else if (kind === 1) {
    thick(c, [[x, yS], [x, 330]], 14, COL.greenLt);
    leaf(c, x, 334, 100, -Math.PI * 0.8, COL.leaf); leaf(c, x, 334, 100, -Math.PI * 0.2, COL.leaf);
    const R: number[][][] = [[[x, yS], [x + 6, 560], [x - 6, 650], [x, 770]], [[x + 3, 540], [x - 50, 590], [x - 85, 650]], [[x + 3, 540], [x + 55, 590], [x + 90, 650]], [[x - 3, 620], [x - 45, 680], [x - 60, 730]], [[x - 3, 620], [x + 48, 680], [x + 66, 735]]];
    R.forEach((p, i) => thick(c, p, i ? 9 : 16, "#fffaf0"));
  } else {
    thick(c, [[x, yS], [x + 4, 330]], 12, "#d8d27a");
    leaf(c, x + 4, 334, 80, -Math.PI * 0.9, "#c4c05a"); leaf(c, x + 4, 334, 80, -Math.PI * 0.1, "#c4c05a");
    for (const [dx, ex] of [[-8, -34], [0, 6], [8, 40]]) { const p = [[x + dx, yS], [x + dx + ex * 0.3, yS + 50], [x + dx + ex, yS + 110], [x + dx + ex * 0.8, yS + 160]]; thick(c, p, 20, "#7a5230"); shape(c, () => ell(c, p[3][0], p[3][1], 13, 12), "#5e3d22", 4); }
  }
};
const e2s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 545, 960, 470, 24);
  shape(c, () => rrect(c, 60, 110, 960, 840, 14), "#ece7dc");
  const r = rnd(5);
  for (const x0 of [100, 420, 740]) for (let y = 150; y < 920; y += 34) line(c, [[x0, y], [x0 + 150 + r() * 70, y]], 8, "#d7d1c3");
  [220, 540, 860].forEach((x, i) => specimen(c, x, i));
};

// ---------------------------------------------------------------- experiment 3: the warmth test
const sprout = (c: Ctx, x: number, y: number, r: number, tail: number, ang: number) => {
  const pts = [[x, y], [x + Math.cos(ang) * tail * 0.5 + 3, y + Math.sin(ang) * tail * 0.5 - 3], [x + Math.cos(ang) * tail, y + Math.sin(ang) * tail]];
  thick(c, pts, r * 0.5, "#fffaf0");
  seed(c, x, y, r, ang, true);
};
const katori = (c: Ctx, x: number, y: number, r: number, ry: number) => {
  shadow(c, x + r * 0.12, y + r * 0.78, r * 0.85, r * 0.13);
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 0.95, x + r * 0.95, y + r * 0.95, x + r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -r * 0.4, 0, 0.55);
  shape(c, () => ell(c, x, y, r, ry), COL.steelIn, 5);
};
const K3 = [190, 540, 890];
const e3s0 = (c: Ctx) => {
  ground(c);
  const rr = rnd(3);
  K3.forEach((x) => {
    katori(c, x, 520, 145, 62);
    shape(c, () => ell(c, x, 524, 128, 50), COL.sky, 4);
    line(c, [[x - 100, 538], [x - 30, 560], [x + 60, 556]], 3, COL.waterDk);
    line(c, [[x - 90, 508], [x, 490], [x + 90, 508]], 3, COL.waterDk);
    for (let i = 0; i < 10; i++) { const col = i % 5, row = Math.floor(i / 5); sprout(c, x - 72 + col * 36 + rr() * 6, 506 + row * 36 + rr() * 5, 11, 24, rr() * 6.28); }
  });
  shadow(c, 560, 905, 190, 14);
  spoon(c, 400, 880, 220, 0, 0.65);
};
const covered = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + 6, r * 0.85, r * 0.12);
  const body = () => { c.moveTo(x - r * 0.95, y - r * 0.7); c.bezierCurveTo(x - r * 0.9, y + r * 0.1, x + r * 0.9, y + r * 0.1, x + r * 0.95, y - r * 0.7); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -r * 0.35, 0, 0.55);
  shape(c, () => ell(c, x, y - r * 0.74, r * 1.2, r * 0.22), COL.steel, 5);
  shape(c, () => ell(c, x, y - r * 0.78, r * 0.95, r * 0.14), COL.steelIn, 3);
  shape(c, () => ell(c, x, y - r * 0.9, r * 0.12, r * 0.07), COL.steelDk, 3);
};
const thermo = (c: Ctx, cx: number, len: number, col: string) => {
  shape(c, () => rrect(c, cx - 110, 785, 240, 34, 17), "#ffffff", 5);
  shape(c, () => rrect(c, cx - 104, 792, len, 20, 10), col, 0);
  shape(c, () => ell(c, cx - 128, 802, 28, 28), col, 5);
  for (let i = 1; i < 8; i++) line(c, [[cx - 110 + i * 30, 828], [cx - 110 + i * 30, 842]], 3);
};
const e3s1 = (c: Ctx) => {
  ground(c);
  c.translate(0, 70);
  // cold: fridge with the door open
  const a = 190, b = 540, d = 890;
  shadow(c, a + 10, 706, 140, 16);
  shape(c, () => rrect(c, a - 105, 240, 210, 460, 18), "#e8eef5");
  shape(c, () => rrect(c, a - 85, 262, 170, 416, 10), COL.sky, 4);
  shape(c, () => polyP(c, [[a - 105, 240], [a - 172, 268], [a - 172, 672], [a - 105, 700]]), "#d3dbe5");
  shape(c, () => rrect(c, a - 160, 400, 10, 90, 4), COL.steelDk, 3);
  shape(c, () => rrect(c, a - 85, 540, 170, 14, 3), COL.steel, 4);
  shape(c, () => rrect(c, a - 85, 640, 170, 14, 3), COL.steel, 4);
  for (const [sx, sy] of [[a + 52, 320], [a - 50, 420]]) for (let k = 0; k < 3; k++) { const an = (k * Math.PI) / 3; line(c, [[sx - Math.cos(an) * 20, sy - Math.sin(an) * 20], [sx + Math.cos(an) * 20, sy + Math.sin(an) * 20]], 5, COL.blueDk); }
  covered(c, a, 537, 70); arrow(c, [[a, 285], [a, 420]]);
  // cool: cupboard with doors open
  shadow(c, b + 10, 706, 150, 16);
  shape(c, () => rrect(c, b - 125, 300, 250, 400, 14), COL.wood);
  shape(c, () => rrect(c, b - 105, 320, 210, 360, 8), COL.brown, 4);
  shape(c, () => polyP(c, [[b - 125, 300], [b - 190, 330], [b - 190, 672], [b - 125, 700]]), COL.woodDk);
  shape(c, () => polyP(c, [[b + 125, 300], [b + 190, 330], [b + 190, 672], [b + 125, 700]]), COL.woodDk);
  shape(c, () => rrect(c, b - 105, 540, 210, 16, 3), COL.wood, 4);
  covered(c, b, 537, 70); arrow(c, [[b, 345], [b, 440]]);
  // warm: top of a closed fridge
  shadow(c, d + 10, 706, 140, 16);
  shape(c, () => rrect(c, d - 105, 240, 210, 460, 18), "#e8eef5");
  shade(c, () => rrect(c, d - 105, 240, 210, 460, 18), "#bcc7d4", -40, 0, 0.5);
  line(c, [[d - 105, 400], [d + 105, 400]], 5);
  shape(c, () => rrect(c, d + 64, 290, 14, 70, 5), COL.steelDk, 3); shape(c, () => rrect(c, d + 64, 430, 14, 110, 5), COL.steelDk, 3);
  covered(c, d, 241, 70); arrow(c, [[d, 55], [d, 150]]);
  for (const sx of [105, 135]) line(c, Array.from({ length: 9 }, (_, i) => [d + sx + Math.sin(i * 1.3) * 9, 235 - i * 18]), 7, COL.orange);
  thermo(c, a, 55, COL.blue); thermo(c, b, 120, COL.orange); thermo(c, d, 205, RED);
};
const e3s2 = (c: Ctx) => {
  ground(c);
  const x0 = 190, u = 80;
  line(c, [[x0, 220], [x0, 740]], 3, COL.grey);
  [[300, 4], [460, 6], [620, 8.2]].forEach(([y, L]) => sprout(c, x0 + 34, y, 34, L * u - 34, 0.0));
  // ruler, 0 at the line the sprouts start from
  shadow(c, 590, 865, 440, 18);
  wood(c, 150, 740, 880, 110);
  for (let mm = 0; mm <= 100; mm++) { const x = x0 + mm * 8, l = mm % 10 === 0 ? 40 : mm % 5 === 0 ? 28 : 16; line(c, [[x, 740], [x, 740 + l]], mm % 10 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= 10; cm++) write(c, String(cm), x0 + cm * u - (cm === 10 ? 20 : 10), 792, 34, INK, 5);
  line(c, [[x0 + 8.2 * u, 620], [x0 + 8.2 * u, 740]], 5, RED);
  hand(c, 960, 620, Math.PI, 1.3);
};

// ---------------------------------------------------------------- experiment 4: coloured light
const E4 = [[320, 450], [760, 450], [320, 910], [760, 910]];
const E4W = 240, E4H = 190;
const STRAW = [[-95, 2, false], [0, -12, false], [95, 2, true], [0, 14, true]] as const;
const straw = (c: Ctx, x: number, sy: number, px: number, py: number) => thick(c, [[x + px, sy + py], [x + px * 0.3, sy - 205]], 7, COL.pink);
const plants4 = (c: Ctx, x: number, sy: number, hs: number[], w: number, stem: string, lf: string) =>
  [-45, -15, 15, 45].forEach((dx, i) => plant(c, x + dx, sy + (i % 2 ? 5 : -2), hs[i], w, stem, lf, Math.min(44, hs[i] * 0.4)));
// one cup with its straws and seedlings; covers = a translucent cone
const cup4 = (c: Ctx, i: number, hs: number[], w: number, stem: string, lf: string, cone?: string, pushArrow = false) => {
  const [x, y] = E4[i], sy = cup(c, x, y, E4W, E4H);
  STRAW.filter((s) => !s[2]).forEach((s) => straw(c, x, sy, s[0], s[1]));
  plants4(c, x, sy, hs, w, stem, lf);
  STRAW.filter((s) => s[2]).forEach((s) => straw(c, x, sy, s[0], s[1]));
  if (pushArrow) arrow(c, [[x + 140, sy - 175], [x + 140, sy - 75]]);
  if (cone) {
    const by = sy - 22, ap = sy - 215;
    shape(c, () => { c.moveTo(x, ap); c.lineTo(x - 140, by); c.quadraticCurveTo(x, by + 50, x + 140, by); c.closePath(); }, cone, 5);
    shine(c, [[x - 18, ap + 55], [x - 95, by - 25]], 8);
    for (const s of [-1, 1]) shape(c, () => polyP(c, [[x + s * 118 - 10, by - 42], [x + s * 118 + 14, by - 38], [x + s * 118 + 10, by - 14], [x + s * 118 - 14, by - 18]]), COL.yellow, 3);
  }
};
const CONES = ["rgba(235,245,255,0.55)", "rgba(228,82,59,0.5)", "rgba(91,143,214,0.5)", "rgba(106,180,70,0.5)"];
const e4s0 = (c: Ctx) => { ground(c); [0, 1, 2, 3].forEach((i) => cup4(c, i, [70, 85, 75, 80], 10, COL.greenLt, COL.leaf, undefined, true)); };
const e4s1 = (c: Ctx) => { ground(c); [0, 1, 2, 3].forEach((i) => cup4(c, i, [70, 85, 75, 80], 10, COL.greenLt, COL.leaf, CONES[i])); };
const e4s2 = (c: Ctx) => {
  ground(c);
  cup4(c, 0, [100, 108, 102, 106], 13, COL.greenLt, COL.leaf);
  cup4(c, 1, [150, 160, 154, 158], 7, COL.greenLt, COL.leaf);
  cup4(c, 2, [52, 58, 54, 56], 14, COL.green, COL.leafDk);
  cup4(c, 3, [185, 192, 186, 190], 6, "#d2e2a6", "#bcd78a");
};

export const su_plantsWhatPlantsNeed = cards("sci.plants.what-plants-need.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2, e4s0, e4s1, e4s2]);
