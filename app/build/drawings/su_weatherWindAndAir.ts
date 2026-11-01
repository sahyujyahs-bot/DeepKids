import type { Ctx } from "./core";
import { D, INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, person, write, cards } from "./flatKit";

// WIND AND AIR · set-up cards for sci.weather.wind-and-air.L3 (open fridge, pinwheel windmill, soil and water in the sun)

// ---------------------------------------------------------------- shared pieces
const curve = (pts: number[][], n = 14) => {
  const out: number[][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t, f = (a: number, b: number, c2: number, d: number) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
// a ribbon of smoke along a path: soft wobble, getting wider as it drifts
const smoke = (c: Ctx, pts: number[][], w = 26, amp = 12) => {
  const s = curve(pts), n = s.length;
  const p = s.map(([x, y], i) => { const a = s[Math.max(0, i - 1)], b = s[Math.min(n - 1, i + 1)], an = Math.atan2(b[1] - a[1], b[0] - a[0]), o = Math.sin(i * 0.45) * amp * Math.min(1, i / 10); return [x - Math.sin(an) * o, y + Math.cos(an) * o]; });
  for (const pass of [0, 1]) for (let i = 0; i < n - 1; i++) { const ww = w * (0.45 + (i / n) * 0.9); line(c, [p[i], p[i + 1]], pass ? ww : ww + 9, pass ? "#f3f0ea" : COL.greyDk); }
};
const curveArrow = (c: Ctx, pts: number[][], col: string = RED, w = 12) => arrow(c, curve(pts), col, w);
const arm = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w: number) => { line(c, [[x0, y0], [x1, y1]], w + 12, INK); line(c, [[x0, y0], [x1, y1]], w, CLOTH.child); };
// a hand coming in from the right, pointing left (thumb stays up)
const handL = (c: Ctx, x: number, y: number, s: number, open = false, skin: string = SKIN.child, sleeve: string = CLOTH.child) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, 0, s, skin, sleeve, open); c.restore(); };
const floorBand = (c: Ctx, y: number) => { c.fillStyle = "#e3d4b8"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// the open fridge seen from the side, front open to the right: shell, shelves, bottle, box, katori, drawer
const FLOOR = 780;
const fridgeSide = (c: Ctx) => {
  shadow(c, 260, FLOOR + 14, 250, 22);
  shape(c, () => polyP(c, [[470, 90], [40, 90], [40, 780], [470, 780], [470, 740], [80, 740], [80, 130], [470, 130]]), COL.steel);
  shade(c, () => polyP(c, [[470, 90], [40, 90], [40, 780], [470, 780], [470, 740], [80, 740], [80, 130], [470, 130]]), COL.steelDk, 18, 8, 0.45);
  c.fillStyle = "#e3f2fa"; c.fillRect(82, 133, 388, 604);
  line(c, [[470, 130], [80, 130], [80, 740], [470, 740]], 6);
  for (const y of [300, 470, 610]) { shape(c, () => rrect(c, 82, y, 388, 16, 5), COL.steelIn, 5); }
  // bottle
  shape(c, () => rrect(c, 120, 170, 64, 130, 16), COL.blue); shape(c, () => rrect(c, 140, 135, 24, 40, 6), COL.blueDk);
  shine(c, [[134, 195], [134, 270]], 6);
  // box
  shape(c, () => rrect(c, 250, 350, 150, 120, 10), COL.teal); shade(c, () => rrect(c, 250, 350, 150, 120, 10), COL.tealDk, 24, 0, 0.5);
  shape(c, () => rrect(c, 250, 350, 150, 120, 10), "rgba(0,0,0,0)", 5);
  // katori on the shelf
  bowl(c, 230, 560, 70);
  shape(c, () => rrect(c, 330, 520, 100, 90, 10), COL.orange); shape(c, () => rrect(c, 330, 520, 100, 90, 10), "rgba(0,0,0,0)", 5);
  // crisper drawer
  shape(c, () => rrect(c, 110, 640, 330, 90, 10), COL.greenLt); shade(c, () => rrect(c, 110, 640, 330, 90, 10), COL.green, 20, 0, 0.5);
  shape(c, () => rrect(c, 110, 640, 330, 90, 10), "rgba(0,0,0,0)", 5);
  shape(c, () => rrect(c, 230, 670, 90, 18, 8), COL.greenDk, 4);
};
// an agarbatti: bare stick below, scented coating above, an orange glowing tip; from the held end to the tip
const agarbatti = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  const m = [x1 + (x2 - x1) * 0.5, y1 + (y2 - y1) * 0.5];
  line(c, [[x1, y1], [x2, y2]], 16, INK); line(c, [[x1, y1], [m[0], m[1]]], 8, COL.wood); line(c, [[m[0], m[1]], [x2, y2]], 10, COL.brown);
  const an = Math.atan2(y2 - y1, x2 - x1);
  shape(c, () => ell(c, x2, y2, 11, 11), COL.orange, 4); shape(c, () => ell(c, x2 + Math.cos(an) * 2, y2 + Math.sin(an) * 2, 5, 5), COL.yellow, 0);
};

// a paper pinwheel seen face-on (sx < 1 squeezes it as if turned away); half = half the paper's side
const pinwheel = (c: Ctx, cx: number, cy: number, half: number, rot = 0, sx = 1) => {
  c.save(); c.translate(cx, cy); c.scale(sx, 1); c.rotate(rot);
  const h = half;
  shape(c, () => polyP(c, [[-h, -h], [h, -h], [h, h], [-h, h]]), COL.yellow);
  for (let k = 0; k < 4; k++) { c.save(); c.rotate((k * Math.PI) / 2); shape(c, () => polyP(c, [[0, 0], [0, -h], [-h, -h]]), COL.orange); shade(c, () => polyP(c, [[0, 0], [0, -h], [-h, -h]]), COL.red, h * 0.12, 0, 0.35); c.restore(); }
  shape(c, () => ell(c, 0, 0, h * 0.1, h * 0.1), COL.steelDk, 4);
  c.restore();
};
const paperclip = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.beginPath(); ell(c, x, y, 17 * s, 44 * s); c.moveTo(x + 9 * s, y + 12 * s); ell(c, x, y + 12 * s, 9 * s, 30 * s); };
  p(); c.strokeStyle = INK; c.lineWidth = 11 * s; c.stroke();
  p(); c.strokeStyle = COL.steelDk; c.lineWidth = 5 * s; c.stroke();
};
// the windmill: upturned cup on a table at (x, y), straw taped across its base, skewer through the straw, pinwheel one end, thread and clip the other
const windmill = (c: Ctx, x: number, y: number, s: number, hang: number, spin = false) => {
  const H = 200 * s, bot = 105 * s, top = 78 * s, ys = y - H - 4 * s;
  shadow(c, x + 14 * s, y + 4 * s, bot * 1.05, 14 * s);
  const cup = () => polyP(c, [[x - bot, y], [x + bot, y], [x + top, y - H], [x - top, y - H]]);
  line(c, [[x - 255 * s, ys], [x + 250 * s, ys]], 15 * s, INK); line(c, [[x - 255 * s, ys], [x + 250 * s, ys]], 8 * s, COL.wood);
  shape(c, cup, COL.paper); shade(c, cup, COL.grey, 30 * s, 0, 0.4);
  shape(c, () => polyP(c, [[x - bot, y], [x + bot, y], [x + bot - 36 * s * 0.25, y - 62 * s], [x - bot + 9 * s, y - 62 * s]]), COL.teal, 5);
  shape(c, cup, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - H, top, 14 * s), "#efe6d2", 5);
  shape(c, () => rrect(c, x - 135 * s, ys - 11 * s, 270 * s, 22 * s, 11 * s), COL.pink, 5);
  for (const dx of [-55, 55]) shape(c, () => rrect(c, x + dx * s - 17 * s, ys - 18 * s, 34 * s, 36 * s, 4), "rgba(255,243,196,0.9)", 3);
  // thread and clip
  line(c, [[x + 228 * s, ys], [x + 228 * s, ys + hang]], 5, INK);
  paperclip(c, x + 228 * s, ys + hang + 40 * s, 1.25 * s * 1.1);
  pinwheel(c, x - 255 * s, ys, 112 * s, Math.PI / 4, 0.55);
  if (spin) curveArrow(c, [[x - 255 * s - 70 * s, ys - 170 * s], [x - 255 * s + 20 * s, ys - 205 * s], [x - 255 * s + 85 * s, ys - 150 * s]], RED, 10);
};
const tableSlab = (c: Ctx, x0: number, x1: number, y: number, legs: number[], bottom: number) => {
  for (const lx of legs) shape(c, () => rrect(c, lx, y + 40, 44, bottom - y - 40, 6), COL.woodDk);
  shadow(c, (x0 + x1) / 2 + 20, y + 54, (x1 - x0) / 2, 12);
  shape(c, () => rrect(c, x0, y, x1 - x0, 50, 10), COL.wood); shade(c, () => rrect(c, x0, y, x1 - x0, 50, 10), COL.woodDk, 0, 14, 0.5);
  shape(c, () => rrect(c, x0, y, x1 - x0, 50, 10), "rgba(0,0,0,0)", 6);
};

// two equal katori on a surface: soil in one, water in the other (rim centre y)
const BR = 210;
const soilBowl = (c: Ctx, x: number, y: number, r = BR) => {
  bowl(c, x, y, r, COL.soil);
  const rd = [[-0.5, -0.05], [-0.1, 0.06], [0.35, -0.03], [0.6, 0.05], [-0.7, 0.04], [0.1, -0.08], [0.82, -0.02], [-0.3, 0.08]];
  rd.forEach(([a, b], i) => shape(c, () => ell(c, x + a * r, y + b * r * 0.9, r * (0.07 + (i % 3) * 0.02), r * 0.03), COL.soilDk, 0));
};
const waterBowl = (c: Ctx, x: number, y: number, r = BR) => {
  bowl(c, x, y, r, COL.water);
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.04, r * 0.3, r * 0.05), COL.drop, 0);
  shape(c, () => ell(c, x + r * 0.35, y + r * 0.05, r * 0.14, r * 0.03), COL.drop, 0);
};

// ---------------------------------------------------------------- e1 the open fridge
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c); floorBand(c, FLOOR); fridgeSide(c);
  // cold air spilling out of the bottom and over the floor and the feet
  for (const [y0, y1] of [[690, 800], [725, 860], [755, 915]]) curveArrow(c, [[475, y0], [560, y0 + 25], [650, y1 - 20], [735, y1]], COL.blue, 13);
  const px = 800, py = 975;
  person(c, px, py, 640, { armL: [Math.PI * 0.52, Math.PI * 0.5], armR: [Math.PI * 0.48, Math.PI * 0.5] });
  for (const s of [-1, 1]) { shape(c, () => ell(c, px + s * 38 + s * 6, py - 4, 36, 17), SKIN.child, 5); }
  curveArrow(c, [[500, 905], [640, 940], [760, 965]], COL.blue, 13);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); floorBand(c, FLOOR); fridgeSide(c);
  smoke(c, [[478, 640], [500, 612], [560, 628], [620, 685], [665, 748], [730, 776], [850, 772], [960, 770]], 30, 9);
  agarbatti(c, 505, 925, 478, 640);
  arm(c, 700, 915, 1090, 915, 100);
  handL(c, 596, 915, 1.3);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c); floorBand(c, FLOOR); fridgeSide(c);
  smoke(c, [[478, 200], [470, 168], [420, 160], [350, 178], [280, 210], [215, 250]], 30, 8);
  agarbatti(c, 505, 480, 478, 200);
  arm(c, 700, 460, 1090, 460, 100);
  handL(c, 596, 460, 1.3);
};

// ---------------------------------------------------------------- e2 the windmill that lifts
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 305, 745, 190, 24); shadow(c, 805, 745, 190, 24);
  // the square cut along the diagonals from each corner, not quite to the middle
  c.save(); c.translate(290, 540);
  shape(c, () => polyP(c, [[-170, -170], [170, -170], [170, 170], [-170, 170]]), COL.yellow);
  shade(c, () => polyP(c, [[-170, -170], [170, -170], [170, 170], [-170, 170]]), COL.woodDk, 22, 22, 0.35);
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) line(c, [[sx * 170, sy * 170], [sx * 38, sy * 38]], 9);
  shape(c, () => polyP(c, [[-170, -170], [170, -170], [170, 170], [-170, 170]]), "rgba(0,0,0,0)", 7);
  c.restore();
  curveArrow(c, [[500, 540], [545, 520], [590, 540]], RED, 14);
  pinwheel(c, 800, 540, 170);
  shape(c, () => polyP(c, [[630, 370], [970, 370], [970, 710], [630, 710]]), "rgba(0,0,0,0)", 0);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d4b8"; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 6);
  tableSlab(c, 150, 760, 700, [190, 690], 960);
  windmill(c, 560, 700, 1.15, 230, true);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d4b8"; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  tableSlab(c, 40, 820, 640, [70, 740], 840);
  // the table fan, blowing to the right
  shape(c, () => ell(c, 150, 640, 74, 16), COL.steelDk, 5);
  shape(c, () => rrect(c, 138, 520, 24, 120, 6), COL.steel);
  c.save(); c.translate(168, 466); c.scale(0.5, 1);
  shape(c, () => ell(c, 0, 0, 130, 130), "rgba(214,236,250,0.5)", 8);
  for (let k = 0; k < 3; k++) { c.save(); c.rotate((k * 2 * Math.PI) / 3); shape(c, () => ell(c, 0, -62, 30, 62), COL.teal, 6); c.restore(); }
  shape(c, () => ell(c, 0, 0, 22, 22), COL.tealDk, 6);
  c.restore();
  for (const y of [395, 466, 537]) curveArrow(c, [[258, y], [290, y - 10], [320, y + 8], [352, y]], COL.blue, 11);
  windmill(c, 640, 640, 0.85, 60, true);
  // the clip has risen: an arrow up beside the thread
  curveArrow(c, [[900, 600], [900, 540], [900, 470]], RED, 12);
  // the tape on the floor: 0 under the fan, marks at 50 cm and 150 cm
  const X0 = 150, K = 5.34;
  shape(c, () => rrect(c, X0 - 20, 880, 850, 62, 6), COL.yellow, 6);
  for (let cm = 0; cm <= 150; cm += 10) line(c, [[X0 + cm * K, 880], [X0 + cm * K, 880 + (cm % 50 === 0 ? 36 : 20)]], 4);
  for (const cm of [50, 150]) { const x = X0 + cm * K; line(c, [[x, 880], [x, 800]], 7, RED); shape(c, () => ell(c, x, 794, 13, 13), RED, 4); write(c, cm + " cm", x - (cm === 50 ? 70 : 150), 975, 52, INK, 7); }
};

// ---------------------------------------------------------------- e3 soil or water
const sunRays = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 160, 940, 650, 12), COL.sky, 8);
  c.save(); c.beginPath(); rrect(c, 70, 160, 940, 650, 12); c.clip();
  c.fillStyle = "rgba(255,255,255,0.35)";
  for (const dx of [0, 230, 460]) { c.beginPath(); polyP(c, [[250 + dx, 160], [330 + dx, 160], [150 + dx + 330, 810], [70 + dx + 330, 810]]); c.fill(); }
  c.restore();
  line(c, [[540, 160], [540, 810]], 14, WHITE); line(c, [[70, 400], [1010, 400]], 14, WHITE);
  shape(c, () => rrect(c, 70, 160, 940, 650, 12), "rgba(0,0,0,0)", 8);
  sunRays(c, 190, 280, 60);
  shape(c, () => rrect(c, 40, 800, 1000, 80, 10), COL.wood); shade(c, () => rrect(c, 40, 800, 1000, 80, 10), COL.woodDk, 0, 30, 0.5);
  shape(c, () => rrect(c, 40, 800, 1000, 80, 10), "rgba(0,0,0,0)", 6);
  soilBowl(c, 290, 682); waterBowl(c, 790, 682);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e8d3a8"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  // rays from the sun, stopped short by the shading hand
  for (const dy of [-30, 40, 110]) line(c, [[225, 150 + dy * 0.2], [455, 190 + dy * 0.9]], 7, COL.yellow);
  sunRays(c, 120, 120, 48);
  bowl(c, 540, 722, 300, COL.soil);
  [[-0.55, 0.0], [-0.2, 0.05], [0.3, -0.03], [0.62, 0.04], [-0.8, 0.03], [0.85, 0.0]].forEach(([a, b], i) => shape(c, () => ell(c, 540 + a * 300, 722 + b * 270, 28 + (i % 3) * 8, 8), COL.soilDk, 0));
  // thermometer, going into the soil
  shape(c, () => rrect(c, 520, 220, 40, 510, 20), "#f4fbff", 6);
  shape(c, () => rrect(c, 532, 380, 16, 350, 8), COL.blueDk, 0);
  for (let y = 250; y < 380; y += 22) line(c, [[568, y], [y % 44 === 0 ? 590 : 582, y]], 4);
  shine(c, [[528, 250], [528, 350]], 5);
  shape(c, () => ell(c, 540, 730, 46, 12), COL.soil, 4);
  // the pushing hand from the left
  arm(c, -20, 450, 360, 450, 100);
  hand(c, 440, 450, 0, 1.4);
  curveArrow(c, [[660, 320], [660, 430], [660, 560]], RED, 14);
  // the shading hand above, from the right
  arm(c, 740, 120, 1100, 120, 100);
  handL(c, 640, 120, 1.4, true);
  c.globalAlpha = 1; shape(c, () => ell(c, 540, 262, 30, 36), SH, 0);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, "#d3d6d0");
  // the clock on the wall
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[540 + Math.cos(a) * 150, 290 + Math.sin(a) * 150], [540 + Math.cos(a) * 172, 290 + Math.sin(a) * 172]], 8); }
  shape(c, () => ell(c, 540, 290, 140, 140), WHITE, 8);
  shade(c, () => ell(c, 540, 290, 140, 140), COL.grey, 22, 22, 0.3);
  shape(c, () => ell(c, 540, 290, 140, 140), "rgba(0,0,0,0)", 8);
  line(c, [[540, 290], [540, 190]], 11); line(c, [[540, 290], [610, 330]], 14);
  shape(c, () => ell(c, 540, 290, 13, 13), RED, 4);
  // the table
  tableSlab(c, 70, 1010, 780, [140, 896], 1050);
  soilBowl(c, 290, 662); waterBowl(c, 790, 662);
};

export const su_weatherWindAndAir = cards("sci.weather.wind-and-air.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
