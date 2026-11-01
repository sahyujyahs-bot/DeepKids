import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, bowl, cards, ell, glass, ground, hand, line, plate, polyP, rnd, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// POLYMERS · set-up cards. Slime is pink, the balloon is blue, milk packet plastic is pale blue with
// purple marker lines, rulers are wooden, glue is white. Same look on every card of an experiment.

const SLIME = COL.pink, SLIME_DK = "#c9688a", GLUE = "#fbfaf2", PLASTIC = "#e6f1fb", PLASTIC_DK = "#b9d4ec";

// the sleeve running from the wrist back to the edge of the card, so a hand comes from an arm
const forearm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string, len = 700) => {
  const bx = x - Math.cos(an) * 50 * s, by = y - Math.sin(an) * 50 * s, ex = x - Math.cos(an) * len, ey = y - Math.sin(an) * len;
  line(c, [[bx, by], [ex, ey]], 72 * s + 12, INK); line(c, [[bx, by], [ex, ey]], 72 * s, sleeve);
};
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number) => { forearm(c, x, y, an, s, CLOTH.adult); hand(c, x, y, an, s, SKIN.adult, CLOTH.adult); };
const childHand = (c: Ctx, x: number, y: number, an: number, s: number) => { forearm(c, x, y, an, s, CLOTH.child); hand(c, x, y, an, s, SKIN.child, CLOTH.child); };

// a slime blob resting at (x, y): rx half-width, h height
const blobP = (c: Ctx, x: number, y: number, rx: number, h: number) => () => {
  c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - h * 1.25, x + rx, y - h * 1.25, x + rx, y); c.bezierCurveTo(x + rx, y + rx * 0.28, x - rx, y + rx * 0.28, x - rx, y); c.closePath();
};
const blob = (c: Ctx, x: number, y: number, rx: number, h: number) => {
  shadow(c, x + rx * 0.12, y + rx * 0.16, rx * 1.05, rx * 0.2);
  const p = blobP(c, x, y, rx, h);
  shape(c, p, SLIME); shade(c, p, SLIME_DK, -rx * 0.3, -h * 0.25, 0.6);
  shine(c, [[x - rx * 0.55, y - h * 0.45], [x - rx * 0.25, y - h * 0.75]], 9);
};

// a wooden ruler: left edge x, top y; n cm of step px each
const ruler = (c: Ctx, x: number, y: number, step: number, n: number) => {
  const w = step * n + 80;
  shadow(c, x + w / 2 + 14, y + 124, w / 2, 16);
  shape(c, () => rrect(c, x, y, w, 110, 8), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + 90, w - 6, 17);
  for (let i = 0; i <= n; i++) {
    const tx = x + 40 + i * step; line(c, [[tx, y], [tx, y + 38]], 4);
    const t = String(i); write(c, t, tx - (t.length === 2 ? 22 : 11), y + 48, 30, INK, 5);
  }
};

// a strip of milk packet plastic lying along y; prof = [x, half height] corners; ticks = x of marker lines
const necked = (x0: number, x1: number, x2: number, x3: number, x4: number, x5: number, wide: number, narrow: number): number[][] => {
  const pts: number[][] = [[x0, wide], [x1, wide]];
  for (let i = 1; i <= 6; i++) { const t = i / 6, e = t * t * (3 - 2 * t); pts.push([x1 + (x2 - x1) * t, wide + (narrow - wide) * e]); }
  pts.push([x3, narrow]);
  for (let i = 1; i <= 6; i++) { const t = i / 6, e = t * t * (3 - 2 * t); pts.push([x3 + (x4 - x3) * t, narrow + (wide - narrow) * e]); }
  pts.push([x5, wide]); return pts;
};
const halfAt = (prof: number[][], x: number) => { for (let i = 1; i < prof.length; i++) if (x <= prof[i][0]) { const [a, b] = [prof[i - 1], prof[i]], t = (x - a[0]) / (b[0] - a[0] || 1); return a[1] + (b[1] - a[1]) * t; } return prof[prof.length - 1][1]; };
const strip = (c: Ctx, y: number, prof: number[][], ticks: number[]) => {
  const p = () => { c.moveTo(prof[0][0], y - prof[0][1]); prof.slice(1).forEach(([x, h]) => c.lineTo(x, y - h)); for (let i = prof.length - 1; i >= 0; i--) c.lineTo(prof[i][0], y + prof[i][1]); c.closePath(); };
  shape(c, p, PLASTIC, 6); shade(c, p, PLASTIC_DK, 0, -22, 0.7);
  c.save(); c.beginPath(); p(); c.clip();
  ticks.forEach((x) => { const h = halfAt(prof, x); line(c, [[x, y - h], [x, y + h]], 5, COL.purple); });
  c.restore();
  c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = 6; c.lineJoin = "round"; c.stroke();
};

// the balloon, three-quarters full, knot at the bottom (dx slides it sideways); spots = the thick dark rubber
const balloonP = (c: Ctx, dx: number) => () => {
  c.moveTo(540 + dx, 835); c.bezierCurveTo(330 + dx, 780, 230 + dx, 560, 270 + dx, 380); c.bezierCurveTo(300 + dx, 90, 780 + dx, 90, 810 + dx, 380); c.bezierCurveTo(850 + dx, 560, 750 + dx, 780, 540 + dx, 835); c.closePath();
};
const balloon = (c: Ctx, dx: number, alpha = 1) => {
  shadow(c, 600 + dx, 930, 150, 0.01);
  c.globalAlpha = alpha;
  const p = balloonP(c, dx);
  shape(c, p, COL.blue); shade(c, p, COL.blueDk, -70, -30, 0.7);
  shape(c, () => ell(c, 540 + dx, 222, 58, 21), COL.blueDk, 4);
  shape(c, () => ell(c, 540 + dx, 796, 40, 21), COL.blueDk, 4);
  shine(c, [[390 + dx, 380], [372 + dx, 510]], 12);
  c.globalAlpha = 1;
};
// the knot and the tail below it
const knot = (c: Ctx, dx: number) => {
  line(c, [[540 + dx, 850], [540 + dx, 960]], 30, INK); line(c, [[540 + dx, 850], [540 + dx, 960]], 20, COL.blue);
  shape(c, () => ell(c, 540 + dx, 850, 28, 22), COL.blueDk, 5);
};
const ring = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); };

// ---------------------------------------------------------------- experiment 1: slime
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  glass(c, 480, 930, 340, 470, 0.72);
  for (const x of [380, 450]) line(c, [[x, 430], [x - 18, 395], [x + 6, 362], [x - 12, 325]], 9, COL.grey);
  // white powder settling at the bottom and a few grains in the water
  shape(c, () => { c.moveTo(385, 918); c.quadraticCurveTo(480, 830, 575, 918); c.closePath(); }, WHITE, 4);
  const r = rnd(5);
  for (let i = 0; i < 22; i++) shape(c, () => ell(c, 400 + r() * 170, 700 + r() * 190, 7, 5), WHITE, 0);
  // the steel spoon, its head in the water, and a grown-up's hand holding the handle
  line(c, [[530, 800], [680, 230]], 22, INK); line(c, [[530, 800], [680, 230]], 12, COL.steel);
  shape(c, () => ell(c, 528, 812, 44, 25, -1.31), COL.steel, 5);
  arrow(c, [[395, 604], [440, 630], [510, 638], [575, 626], [612, 602]]);
  // label on the tumbler: a drop with a red cross
  shape(c, () => rrect(c, 340, 665, 120, 105, 10), WHITE, 5);
  shape(c, () => { c.moveTo(400, 678); c.quadraticCurveTo(366, 722, 376, 738); c.arc(400, 736, 24, Math.PI, 0, true); c.quadraticCurveTo(434, 722, 400, 678); c.closePath(); }, COL.water, 4);
  line(c, [[362, 682], [438, 758]], 10, RED); line(c, [[438, 682], [362, 758]], 10, RED);
  adultHand(c, 801, 250, Math.PI, 1.8);
};

// a steel katori seen from a little above, full of runny white glue; rim centre (x, y), rim radius r
const katori = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.78, r * 0.85, r * 0.14);
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.95, x + r * 0.9, y + r * 0.95, x + r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * 0.42), COL.steelIn, 5);
  shape(c, () => ell(c, x, y + 3, r * 0.86, r * 0.33), GLUE, 4);
  line(c, [[x - r * 0.5, y + 2], [x - r * 0.2, y - 10], [x + r * 0.15, y + 2], [x + r * 0.45, y - 6]], 4, COL.grey);
  shine(c, [[x - r * 0.62, y - 12], [x - r * 0.36, y - 20]], 8);
};
// a small teaspoon icon, bowl on top, handle down
const spoonIcon = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y + 14], [x, y + 50]], 14, INK); line(c, [[x, y + 14], [x, y + 50]], 6, COL.steel);
  shape(c, () => ell(c, x, y, 15, 21), COL.steel, 5);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], nums = ["1", "3", "6"], n = [1, 3, 6];
  xs.forEach((x, i) => {
    katori(c, x, 640, 150);
    write(c, nums[i], x - 14, 790, 80, INK, 11);
    for (let k = 0; k < n[i]; k++) spoonIcon(c, x + ((k % 3) - (Math.min(n[i], 3) - 1) / 2) * 56, 915 + Math.floor(k / 3) * 80);
  });
  // the teaspoon in a grown-up's hand, tipped over the middle katori, a thin clear stream falling into the glue
  const dir = [Math.cos(2.5), Math.sin(2.5)];
  line(c, [[870 - dir[0] * 300, 150 - dir[1] * 300], [610, 350]], 22, INK); line(c, [[870 - dir[0] * 300, 150 - dir[1] * 300], [610, 350]], 12, COL.steel);
  shape(c, () => ell(c, 590, 368, 48, 27, 2.5), COL.steel, 5);
  line(c, [[552, 398], [546, 636]], 22, INK); line(c, [[552, 398], [546, 636]], 12, COL.water);
  for (const [x, y] of [[520, 560], [574, 520], [524, 460]]) shape(c, () => ell(c, x, y, 9, 13), COL.water, 3);
  c.beginPath(); ell(c, 546, 640, 46, 13); c.strokeStyle = COL.waterDk; c.lineWidth = 6; c.stroke();
  adultHand(c, 870, 150, 2.5, 1.8);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 470, 460, 200);
  blob(c, 230, 480, 135, 38);
  blob(c, 540, 480, 105, 85);
  blob(c, 830, 480, 80, 160);
  ruler(c, 115, 790, 80, 10);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const y = 560, big = 78, thin = 8, sag = (x: number) => 34 * Math.sin((Math.PI * (x - 150)) / 780);
  // one piece of slime: a round lump in each fist, between them a long thin thread that sags in the middle
  const half = (x: number) => thin + (big - thin) * (Math.exp(-(((x - 255) / 62) ** 2)) + Math.exp(-(((x - 825) / 62) ** 2)));
  const xsA: number[] = []; for (let x = 140; x <= 940; x += 6) xsA.push(x);
  const pts = [...xsA.map((x) => [x, y + sag(x) - half(x)]), ...xsA.slice().reverse().map((x) => [x, y + sag(x) + half(x)])];
  const p = () => polyP(c, pts);
  shadow(c, 540, y + 130, 380, 14);
  shape(c, p, SLIME, 6); shade(c, p, SLIME_DK, 0, 30, 0.6);
  shine(c, [[225, y - 45], [265, y - 56]], 9);
  arrow(c, [[300, 400], [110, 400]]); arrow(c, [[780, 400], [970, 400]]);
  childHand(c, 20, y, 0, 1.8);
  childHand(c, 1060, y, Math.PI, 1.8);
};

// ---------------------------------------------------------------- experiment 2: balloon
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 590, 880, 190, 22);
  balloon(c, 0);
  knot(c, 0);
  ring(c, 540, 224, 86, 34); ring(c, 540, 796, 62, 36);
  childHand(c, 540, 1070, -Math.PI / 2, 1.7);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  balloon(c, -120);
  knot(c, -120);
  // the oiled skewer from the grown-up's hand, its tip pressed into the thick rubber near the knot, a dent round it
  const T = [425, 793], W = [900, 590], E = [W[0] + 80, W[1] - 35], an = Math.atan2(E[1] - T[1], E[0] - T[0]), ux = Math.cos(an), uy = Math.sin(an);
  const P = (t: number) => [T[0] + ux * t, T[1] + uy * t];
  for (let k = 0; k < 6; k++) { const a = -2.6 + k * 0.5; line(c, [[T[0] + Math.cos(a) * 36, T[1] + Math.sin(a) * 24], [T[0] + Math.cos(a) * 80, T[1] + Math.sin(a) * 52]], 5, INK); }
  line(c, [T, E], 28, INK); line(c, [T, E], 18, COL.wood);
  shape(c, () => ell(c, T[0], T[1], 14, 10), COL.woodDk, 4);
  line(c, [P(30), P(330)], 5, WHITE);
  for (const t of [60, 130, 200]) { const q = P(t); shape(c, () => ell(c, q[0], q[1] - 20, 9, 13, 1.2), COL.yellow, 3); }
  // a twist arrow wound round the shaft
  const m = P(280), ring: number[][] = [];
  for (let k = 0; k <= 18; k++) { const t = 0.4 + (k / 18) * 4.4, perp = 70 * Math.cos(t), along = 24 * Math.sin(t); ring.push([m[0] - uy * perp + ux * along, m[1] + ux * perp + uy * along]); }
  arrow(c, ring, RED, 11);
  childHand(c, 420, 1070, -Math.PI / 2, 1.7);
  adultHand(c, W[0], W[1], 2.73, 1.8);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 590, 930, 190, 22);
  // the skewer all the way through, seen through the balloon, a bit sticking out of the top
  line(c, [[540, 60], [540, 990]], 28, INK); line(c, [[540, 60], [540, 990]], 18, COL.wood);
  balloon(c, 0, 0.8);
  line(c, [[540, 60], [540, 200]], 28, INK); line(c, [[540, 60], [540, 200]], 18, COL.wood);
  line(c, [[505, 206], [540, 196], [575, 206]], 6);
  line(c, [[540, 845], [540, 990]], 28, INK); line(c, [[540, 845], [540, 990]], 18, COL.wood);
  shape(c, () => ell(c, 540, 850, 28, 22), COL.blueDk, 5);
  adultHand(c, 540, 1070, -Math.PI / 2, 1.7);
};

// ---------------------------------------------------------------- experiment 3: milk packet strip
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const y = 620, prof = [[75, 92], [995, 92]], ticks = Array.from({ length: 11 }, (_, i) => 75 + 92 * i);
  shadow(c, 560, y + 112, 460, 20);
  strip(c, y, prof, ticks);
  for (let i = 0; i < 10; i++) { const t = String(i + 1); write(c, t, 121 + 92 * i - (t.length === 2 ? 35 : 14), y + 125, 44, INK, 7); }
  // a marker pen drawing the next line
  const d = [0.555, -0.832], T = [719, y - 94];
  const P = (t: number) => [T[0] + d[0] * t, T[1] + d[1] * t];
  line(c, [T, P(60)], 12, INK);
  line(c, [P(40), P(420)], 46, INK); line(c, [P(40), P(420)], 34, COL.purple);
  line(c, [T, P(60)], 5, COL.purple);
  childHand(c, 928, 213, 2.16, 1.8);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const y = 570, prof = necked(160, 400, 460, 620, 680, 920, 72, 22);
  const ticks = [160, 208, 256, 304, 352, 400, 445, 535, 620, 680, 728, 776, 824, 872, 920];
  shadow(c, 540, y + 100, 400, 14);
  strip(c, y, prof, ticks);
  arrow(c, [[300, 400], [110, 400]]); arrow(c, [[780, 400], [970, 400]]);
  childHand(c, 90, y, 0, 1.8);
  childHand(c, 990, y, Math.PI, 1.8);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const y = 300, prof = necked(110, 350, 410, 570, 630, 870, 72, 22);
  const ticks = [110, 158, 206, 254, 302, 350, 395, 485, 570, 630, 678, 726, 774, 822, 870];
  shadow(c, 490, y + 96, 400, 14);
  strip(c, y, prof, ticks);
  // red lines drop from each long square to the ruler
  for (const x of [395, 485, 570]) line(c, [[x, y + 24], [x, 590]], 6, RED);
  ruler(c, 70, 590, 85, 10);
};

export const su_chemistryPolymers = cards("sci.chemistry.polymers.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
