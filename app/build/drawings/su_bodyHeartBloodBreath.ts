import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards } from "./flatKit";

// BODY: heart, blood, breath (L3) · nine set-up cards. Pulse and star jumps (e1), limewater (e2),
// the upside-down bottle (e3). Same child, same clock, same glasses, same bottle across a sequence.

const COUNTER = "#e3cfa6", MILK = "#fffdf7", CLEAR = "rgba(120,185,232,0.4)", PANTS = "#6b5a8c";

// the table top the things stand on (seen from a little above); a child behind it is hidden below the edge
const counter = (c: Ctx, yTop: number) => {
  c.fillStyle = COUNTER; c.fillRect(0, yTop, D, D - yTop);
  c.fillStyle = "#edddb9"; c.fillRect(0, yTop, D, 16);
  line(c, [[0, yTop], [D, yTop]], 6);
};
// a round table clock with a red second hand; sec = angle of the second hand (radians, -PI/2 = straight up)
const clock = (c: Ctx, x: number, y: number, r: number, sec: number) => {
  shadow(c, x + r * 0.12, y + r * 1.02, r * 0.9, r * 0.14);
  line(c, [[x - r * 0.55, y + r * 0.85], [x - r * 0.72, y + r * 1.02]], 14); line(c, [[x + r * 0.55, y + r * 0.85], [x + r * 0.72, y + r * 1.02]], 14);
  shape(c, () => ell(c, x, y, r, r), COL.teal, 7);
  shade(c, () => ell(c, x, y, r, r), COL.tealDk, -r * 0.12, -r * 0.12, 0.7);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), COL.paper, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, k = i % 3 === 0 ? 0.6 : 0.68; line(c, [[x + Math.cos(a) * r * k, y + Math.sin(a) * r * k], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], i % 3 === 0 ? 8 : 5); }
  line(c, [[x, y], [x + Math.cos(-2.2) * r * 0.42, y + Math.sin(-2.2) * r * 0.42]], 11); line(c, [[x, y], [x + Math.cos(0.1) * r * 0.62, y + Math.sin(0.1) * r * 0.62]], 8);
  line(c, [[x - Math.cos(sec) * r * 0.16, y - Math.sin(sec) * r * 0.16], [x + Math.cos(sec) * r * 0.72, y + Math.sin(sec) * r * 0.72]], 6, RED);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), RED, 4);
};
// a spread hand with five fingers, for a whole person (wrist at x, y, pointing an)
const spread = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (let k = -2; k <= 2; k++) { c.save(); c.rotate(k * 0.36); shape(c, () => rrect(c, 12, -8, 38, 16, 8), SKIN.child, 4); c.restore(); }
  shape(c, () => ell(c, 4, 0, 24, 26), SKIN.child, 5);
  c.restore();
};
// a child seen from the side, head and shoulders behind the counter, facing right (face = 1) or left (-1);
// the mouth (round, blowing) is at (x + face * r * 0.85, y + r * 0.47)
const blower = (c: Ctx, x: number, y: number, r: number, floorY: number, face: 1 | -1) => {
  c.save(); c.translate(x, y); c.scale(face, 1);
  const torso = () => rrect(c, -r * 1.3, r * 1.2, r * 2.6, floorY - y - r * 1.1 + 40, r * 0.6);
  shape(c, torso, CLOTH.child); shade(c, torso, CLOTH.childDk, -r * 0.35, 0, 0.6);
  shape(c, () => rrect(c, -r * 0.3, r * 0.7, r * 0.6, r * 0.7, 10), SKIN.childDk, 5);
  shape(c, () => ell(c, -r * 0.15, -r * 0.12, r * 1.08, r * 1.12), CLOTH.hair, 5);
  shape(c, () => ell(c, r * 0.1, r * 0.08, r * 0.92, r * 0.98), SKIN.child);
  shape(c, () => ell(c, -r * 0.1, r * 0.12, r * 0.17, r * 0.24), SKIN.childDk, 4);
  c.globalAlpha = 0.55; shape(c, () => ell(c, r * 0.55, r * 0.4, r * 0.3, r * 0.26), COL.pink, 0); c.globalAlpha = 1;
  shape(c, () => ell(c, r * 0.52, -r * 0.1, r * 0.09, r * 0.13), INK, 0);
  line(c, [[r * 0.36, -r * 0.34], [r * 0.7, -r * 0.3]], 4);
  shape(c, () => ell(c, r * 0.85, r * 0.47, r * 0.12, r * 0.15), INK, 0);
  c.restore();
};
// a drinking straw or a bendy tube along a path of points
const smooth = (c: Ctx, pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
const straw = (c: Ctx, pts: number[][]) => { line(c, pts, 20, INK); line(c, pts, 11, COL.pink); };
const tube = (c: Ctx, pts: number[][]) => {
  c.lineCap = "round"; c.lineJoin = "round";
  smooth(c, pts); c.strokeStyle = INK; c.lineWidth = 30; c.stroke();
  smooth(c, pts); c.strokeStyle = COL.paper; c.lineWidth = 20; c.stroke();
  c.setLineDash([4, 9]); smooth(c, pts); c.strokeStyle = COL.grey; c.lineWidth = 18; c.stroke(); c.setLineDash([]);
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { c.globalAlpha = 0.9; shape(c, () => ell(c, x, y, r, r), COL.drop, 3.5); c.globalAlpha = 1; };

// ---------------------------------------------------------------- e1 : the jumping heart
// the resting arm lies palm up; the other hand presses two fingers on the thumb side of the wrist
const pulse = (c: Ctx, fast: boolean) => {
  ground(c);
  clock(c, 835, 235, 150, fast ? 0.6 : -Math.PI / 2);
  c.save(); c.translate(0, 150);
  shadow(c, 480, 745, 430, 26);
  shape(c, () => rrect(c, 230, 575, 400, 130, 50), SKIN.child);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 760, 580 + k * 33, 105 - Math.abs(k - 1.2) * 12, 30, 15), SKIN.child, 5);
  shape(c, () => rrect(c, 590, 572, 195, 138, 46), SKIN.child);
  shape(c, () => ell(c, 665, 556, 84, 30, -0.3), SKIN.child, 5);
  line(c, [[660, 640], [730, 660]], 4, SKIN.childDk);
  shape(c, () => rrect(c, 50, 555, 200, 170, 26), CLOTH.child);
  shade(c, () => rrect(c, 50, 555, 200, 170, 26), CLOTH.childDk, -26, 0, 0.6);
  hand(c, 565, 435, Math.PI / 2, 1.5, SKIN.child, CLOTH.child, true);
  const n = fast ? 5 : 3;
  for (let i = 0; i < n; i++) { const a = 0.3 + i * (fast ? 0.28 : 0.45), r0 = fast ? 85 : 80, r1 = r0 + (fast ? 42 : 30);
    for (const s of [-1, 1]) line(c, [[565 + s * Math.cos(a) * r0, 592 - Math.sin(a) * r0], [565 + s * Math.cos(a) * r1, 592 - Math.sin(a) * r1]], fast ? 9 : 7, RED); }
  c.restore();
};
// e1.0 -> setup.e1.0
const e1_0 = (c: Ctx) => pulse(c, false);

// e1.1 -> setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  const rug = [[150, 860], [930, 860], [1010, 1010], [70, 1010]];
  shape(c, () => polyP(c, rug), COL.teal); shade(c, () => polyP(c, rug), COL.tealDk, -30, 0, 0.5);
  for (const y of [905, 950, 995]) { const e = ((y - 860) / 150) * 80; line(c, [[150 - e + 14, y], [930 + e - 14, y]], 9, COL.yellow); }
  shadow(c, 560, 925, 190, 26);
  const x = 540, feet = 790, h = 600, hip = feet - 0.4 * h, sh = hip - 0.3 * h, hr = 0.13 * h;
  for (const s of [-1, 1]) { const k = [[x + s * h * 0.04, hip], [x + s * h * 0.2, feet - 14]]; line(c, k, h * 0.09, INK); line(c, k, h * 0.09 - 10, PANTS); shape(c, () => ell(c, x + s * h * 0.215, feet, h * 0.06, h * 0.03), COL.brown, 5); }
  const torso = () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06);
  shape(c, torso, CLOTH.child); shade(c, torso, CLOTH.childDk, -h * 0.07, 0, 0.6);
  for (const s of [-1, 1]) { const a = [[x + s * h * 0.11, sh + h * 0.04], [x + s * h * 0.25, sh - h * 0.02], [x + s * h * 0.34, sh - h * 0.24]]; line(c, a, h * 0.065 + 10, INK); line(c, a, h * 0.065, CLOTH.child); spread(c, a[2][0], a[2][1], s > 0 ? -1.2 : -Math.PI + 1.2, 1.15); }
  const hy = sh - hr * 1.05;
  shape(c, () => ell(c, x, hy, hr, hr * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - hr * 1.02, hy); c.bezierCurveTo(x - hr, hy - hr * 1.5, x + hr, hy - hr * 1.5, x + hr * 1.02, hy); c.quadraticCurveTo(x, hy - hr * 0.55, x - hr * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + hr * 0.95, hy - hr * 0.2, hr * 0.32, hr * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, x - hr * 0.35, hy + hr * 0.12, hr * 0.09, hr * 0.12), INK, 0); shape(c, () => ell(c, x + hr * 0.35, hy + hr * 0.12, hr * 0.09, hr * 0.12), INK, 0);
  c.beginPath(); c.arc(x, hy + hr * 0.38, hr * 0.38, 0.1, Math.PI - 0.1); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  arrow(c, [[135, 780], [135, 560]]); arrow(c, [[945, 780], [945, 560]]);
};

// e1.2 -> setup.e1.2
const e1_2 = (c: Ctx) => pulse(c, true);

// ---------------------------------------------------------------- e2 : the milky breath
const jug = (c: Ctx, x: number, y: number, w: number, h: number, layers: [number, number, string][]) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.12);
  const body = () => { c.moveTo(x - w * 0.5, y - h); c.lineTo(x + w * 0.5, y - h); c.lineTo(x + w * 0.46, y); c.lineTo(x - w * 0.46, y); c.closePath(); };
  const hd = [[x + w * 0.5, y - h * 0.82], [x + w * 0.78, y - h * 0.8], [x + w * 0.8, y - h * 0.25], [x + w * 0.45, y - h * 0.15]];
  line(c, hd, 24, INK); line(c, hd, 12, "#dbe9f3");
  shape(c, body, COL.glass, 0);
  c.save(); c.beginPath(); body(); c.clip();
  for (const [a, b, col] of layers) { c.fillStyle = col; c.fillRect(x - w, y - h * b, w * 2, h * (b - a)); }
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 5);
  shape(c, () => ell(c, x, y - h, w * 0.5, w * 0.07), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - w * 0.36, y - h * 0.9], [x - w * 0.33, y - h * 0.15]], 8);
};
// e2.0 -> setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); counter(c, 740);
  const top = 0.82;
  jug(c, 290, 900, 300, 430, [[0, top, MILK]]);
  jug(c, 790, 900, 300, 430, [[0, 0.25, MILK], [0.25, top, CLEAR]]);
  // the spoon stirring the left jug, held in a grown-up's hand
  line(c, [[415, 240], [262, 860]], 24, INK); line(c, [[415, 240], [262, 860]], 12, COL.steel);
  shape(c, () => ell(c, 262, 860, 32, 22, 1.3), COL.steel, 5);
  const ring: number[][] = []; for (let i = 0; i <= 8; i++) { const t = 0.15 + (i / 8) * 2.9; ring.push([290 + Math.cos(t) * 118, 570 + Math.sin(t) * 30]); }
  arrow(c, ring, RED, 10);
  hand(c, 440, 170, 1.9, 1.6, SKIN.adult, CLOTH.adult);
  // overnight: a moon over the jug left standing
  c.save(); c.translate(900, 215);
  shape(c, () => { c.moveTo(0, -60); c.bezierCurveTo(-78, -42, -78, 42, 0, 60); c.bezierCurveTo(-36, 32, -36, -32, 0, -60); c.closePath(); }, COL.yellow, 5);
  c.restore();
  for (const [sx, sy, sr] of [[975, 150, 20], [840, 120, 14]]) shape(c, () => polyP(c, [[sx, sy - sr * 1.5], [sx + sr * 0.35, sy - sr * 0.35], [sx + sr * 1.5, sy], [sx + sr * 0.35, sy + sr * 0.35], [sx, sy + sr * 1.5], [sx - sr * 0.35, sy + sr * 0.35], [sx - sr * 1.5, sy], [sx - sr * 0.35, sy - sr * 0.35]]), COL.yellow, 4);
};

// the squeezy bottle of room air, nozzle up, bottom at (x, y), pinched in the middle by a hand on its left
const squeezy = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 12, y + 8, 100, 18);
  const body = () => { c.moveTo(x - 66, y); c.lineTo(x + 70, y); c.quadraticCurveTo(x + 84, y - 150, x + 72, y - 255); c.quadraticCurveTo(x + 60, y - 280, x + 26, y - 292); c.lineTo(x + 11, y - 342); c.lineTo(x - 11, y - 342); c.lineTo(x - 26, y - 292); c.quadraticCurveTo(x - 60, y - 280, x - 70, y - 255); c.quadraticCurveTo(x - 36, y - 150, x - 66, y); c.closePath(); };
  shape(c, body, "#eef3f8"); shade(c, body, COL.steelDk, -30, 0, 0.45);
  shape(c, () => rrect(c, x - 20, y - 352, 40, 24, 8), COL.teal, 5);
  shine(c, [[x - 40, y - 240], [x - 22, y - 170]], 8);
};
// e2.1 -> setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  blower(c, 962, 300, 80, 800, -1);
  counter(c, 800);
  glass(c, 495, 930, 200, 420, 0.7, CLEAR); glass(c, 740, 930, 200, 420, 0.7, CLEAR);
  c.save(); c.translate(215, 930); c.scale(1.25, 1.25); squeezy(c, 0, 0); c.restore();
  straw(c, [[215, 498], [215, 338], [495, 338], [495, 880]]);
  straw(c, [[892, 338], [740, 338], [740, 880]]);
  for (const [bx, by, br] of [[472, 860, 12], [500, 820, 15], [478, 780, 11], [505, 740, 9], [717, 860, 12], [745, 820, 15], [723, 780, 11], [750, 740, 9]]) bubble(c, bx, by, br);
  hand(c, 100, 790, 0, 1.1, SKIN.child, CLOTH.child);
  arrow(c, [[270, 270], [420, 270]]); arrow(c, [[860, 270], [770, 270]]);
};
// a glass of milky limewater: the glass kit's tumbler, with the milk painted over its blue tint
const milkGlass = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  glass(c, x, y, w, h, fill, MILK);
  const top = w / 2, bot = w * 0.4, ly = y - h * fill, lw = bot + (top - bot) * fill;
  c.beginPath(); c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); c.fillStyle = "rgba(255,253,247,0.8)"; c.fill();
  shape(c, () => ell(c, x, ly, lw, w * 0.07), WHITE, 0);
  shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, "rgba(0,0,0,0)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
// e2.2 -> setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c); counter(c, 700);
  glass(c, 340, 900, 290, 480, 0.75, CLEAR); milkGlass(c, 740, 900, 290, 480, 0.75);
  straw(c, [[290, 340], [335, 830]]); straw(c, [[690, 340], [735, 830]]);
};

// ---------------------------------------------------------------- e3 : the upside-down bottle
// a 2 litre bottle: base edge at yEdge, body 500 long (25 px = 100 ml), then shoulder and neck. flip = upside down.
const BODY = 500, SHOULDER = 45, NECK = 60, HALF = 100, NECKW = 28;
// water fills between distances a and b from the base; ticks are labelled lines on a paper tape
const bottle = (c: Ctx, bx: number, yEdge: number, flip: boolean, water: [number, number] | null, ticks: [number, string?][]) => {
  const sg = flip ? 1 : -1, Y = (t: number) => yEdge + sg * t, end = BODY + SHOULDER + NECK;
  const body = () => {
    c.moveTo(bx - HALF, Y(BODY)); c.lineTo(bx - HALF, Y(24)); c.quadraticCurveTo(bx - HALF, Y(0), bx - HALF + 24, Y(0)); c.lineTo(bx + HALF - 24, Y(0)); c.quadraticCurveTo(bx + HALF, Y(0), bx + HALF, Y(24)); c.lineTo(bx + HALF, Y(BODY));
    c.bezierCurveTo(bx + HALF, Y(BODY + SHOULDER * 0.8), bx + NECKW, Y(BODY + SHOULDER * 0.5), bx + NECKW, Y(BODY + SHOULDER)); c.lineTo(bx + NECKW, Y(end)); c.lineTo(bx - NECKW, Y(end)); c.lineTo(bx - NECKW, Y(BODY + SHOULDER));
    c.bezierCurveTo(bx - NECKW, Y(BODY + SHOULDER * 0.5), bx - HALF, Y(BODY + SHOULDER * 0.8), bx - HALF, Y(BODY)); c.closePath();
  };
  if (water) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(bx - 150, Math.min(Y(water[0]), Y(water[1])), 300, Math.abs(Y(water[1]) - Y(water[0]))); c.restore(); }
  shape(c, body, "rgba(235,245,252,0.28)", 6);
  shade(c, body, COL.glassEdge, -26, 0, 0.3);
  shape(c, () => rrect(c, bx - NECKW - 7, Math.min(Y(end), Y(end - 12)), (NECKW + 7) * 2, 12, 5), COL.paper, 5);
  shine(c, [[bx - HALF + 18, Y(BODY - 20)], [bx - HALF + 18, Y(60)]], 7);
  const tx = bx - HALF + 8, tw = 96;
  shape(c, () => rrect(c, tx, Math.min(Y(2), Y(BODY - 6)), tw, BODY - 8, 4), COL.paper, 4);
  for (const [t, lab] of ticks) { const y = Y(6 + t * 0.25); line(c, [[tx + 8, y], [tx + 8 + (lab ? 24 : 16), y]], 3.5); if (lab) write(c, lab, tx + 38, y - 8, 16, INK, 3.5); }
};
const bucket = (c: Ctx, waterY: number, front: boolean) => {
  const xl = 380, xr = 900, rimY = 440, botY = 900, inset = 50, edge = (y: number, s: number) => (s < 0 ? xl : xr) - s * inset * ((y - rimY) / (botY - rimY)) * -1;
  const body = () => { c.moveTo(xl, rimY); c.lineTo(xr, rimY); c.lineTo(xr - inset, botY); c.lineTo(xl + inset, botY); c.closePath(); };
  if (!front) {
    shadow(c, 660, botY + 10, 330, 34);
    shape(c, body, "rgba(255,255,255,0.4)", 0);
    c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(0, waterY, D, D); c.restore();
    line(c, [[edge(waterY, -1) + 8, waterY], [edge(waterY, 1) - 8, waterY]], 5, COL.drop);
  } else {
    shape(c, body, "rgba(214,236,250,0.22)", 6);
    shade(c, body, COL.glassEdge, -40, 0, 0.25);
    shape(c, () => rrect(c, xl - 14, rimY - 14, xr - xl + 28, 28, 12), COL.steelIn, 6);
    shine(c, [[xl + 40, rimY + 60], [xl + 80, botY - 90]], 9);
  }
};
const TUBE = [[240, 335], [330, 355], [368, 430], [404, 520], [430, 760], [470, 860], [560, 905], [640, 890], [640, 700]];
const fullTicks: [number, string?][] = [];
for (let k = 1; k <= 20; k++) fullTicks.push([k * 100, k % 5 === 0 ? String(k * 100) : undefined]);

// e3.0 -> setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); counter(c, 740);
  const bx = 720, base = 920;
  shadow(c, bx + 16, base + 8, 130, 22);
  bottle(c, bx, base, false, [0, 440], [[100, "100"], [200, "200"], [300, "300"]]);
  // the measuring jug tipped over the mouth: spout tip at P
  const P = [655, 260], th = 0.95, S = 1.15, jb = [[-200, 0], [18, -16], [0, 6], [-12, 260], [-188, 260]], hd = [[-196, 40], [-252, 50], [-262, 140], [-192, 190]];
  c.save(); c.translate(P[0], P[1]); c.rotate(th); c.scale(S, S);
  line(c, hd, 24, INK); line(c, hd, 12, "#dbe9f3");
  c.beginPath(); polyP(c, jb); c.clip();
  c.scale(1 / S, 1 / S); c.rotate(-th); c.translate(-P[0], -P[1]); c.fillStyle = COL.water; c.fillRect(0, P[1] + 10, D, D);
  c.restore();
  c.save(); c.translate(P[0], P[1]); c.rotate(th); c.scale(S, S);
  shape(c, () => polyP(c, jb), "rgba(214,236,250,0.35)", 6);
  shine(c, [[-182, 12], [-170, 220]], 8);
  c.restore();
  // the stream from the lip into the mouth
  const lx = P[0] + 24, ly = P[1] + 4;
  c.beginPath(); c.moveTo(lx, ly - 6); c.quadraticCurveTo(lx + 40, ly - 4, bx - 8, 322); c.lineTo(bx + 10, 322); c.quadraticCurveTo(lx + 46, ly + 30, lx + 2, ly + 16); c.closePath(); c.fillStyle = COL.water; c.fill(); c.lineWidth = 4; c.strokeStyle = COL.waterDk; c.stroke();
  hand(c, 289, 84, 0.25, 1.4, SKIN.child, CLOTH.child);
};

const holdBottle = (c: Ctx) => hand(c, 815, 270, Math.PI, 1.5, SKIN.child, CLOTH.child);
// e3.1 -> setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); counter(c, 720);
  bucket(c, 505, false);
  bottle(c, 640, 130, true, [0, 605], fullTicks);
  tube(c, TUBE);
  bucket(c, 505, true);
  holdBottle(c);
  const turn: number[][] = []; for (let i = 0; i <= 9; i++) { const t = 2.7 + (i / 9) * 3.7; turn.push([450 + Math.cos(t) * 70, 250 + Math.sin(t) * 70]); }
  arrow(c, turn);
};

// e3.2 -> setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  blower(c, 140, 300, 72, 720, 1);
  counter(c, 720);
  bucket(c, 505, false);
  bottle(c, 640, 130, true, [375 + 6, 605], fullTicks);
  line(c, [[650, 511], [738, 511]], 6, COL.drop);
  tube(c, TUBE);
  for (const [bx, by, br] of [[632, 690, 9], [650, 650, 12], [636, 610, 8], [648, 575, 10]]) bubble(c, bx, by, br);
  bucket(c, 505, true);
  line(c, [[556, 511], [584, 511]], 8, RED);
  holdBottle(c);
  arrow(c, [[250, 270], [340, 285]]);
};

export const su_bodyHeartBloodBreath = cards("sci.body.heart-blood-breath.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
