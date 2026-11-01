import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, bowl, leaf, write, rnd, cards } from "./flatKit";

// sci.food.food-safety.L3 · set-up cards. Same three steel dabbas (A, B, C), same dark steel plate with yellow turmeric,
// same cucumber slice and biscuit on every card of an experiment.

// ---------------------------------------------------------------- shared things
const TURM = "#f2b705", TURMDK = "#d89b00", DPLATE = "#59606f", DPLATEIN = "#434a58";
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  const S: Record<string, number[][][]> = {
    A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.66], [0.5, 0.66]]],
    B: [[[0, 0], [0, 1]], [[0, 0], [0.4, 0], [0.56, 0.2], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.62, 0.72], [0.45, 1], [0, 1]]],
    C: [[[0.58, 0.15], [0.3, 0], [0.02, 0.25], [0, 0.75], [0.3, 1], [0.58, 0.85]]],
  };
  S[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), 7, INK));
};
// a steel dabba (round lidded tin) standing on the counter, bottom centre (x, y). water: colour of what is inside (null = empty)
const dabba = (c: Ctx, x: number, y: number, w: number, h: number, ch: string, water: string | null = null, lid: "on" | "off" = "off") => {
  const a = w / 2, ry = w * 0.13;
  shadow(c, x + a * 0.15, y + ry * 0.9, a * 1.05, ry * 0.8);
  const body = () => { c.moveTo(x - a, y - h); c.lineTo(x - a, y - ry); c.bezierCurveTo(x - a, y + ry * 1.5, x + a, y + ry * 1.5, x + a, y - ry); c.lineTo(x + a, y - h); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, a * 0.5, 0, 0.55);
  shape(c, () => rrect(c, x - a * 0.38, y - h * 0.62, a * 0.76, a * 0.76, 10), WHITE, 4);
  letter(c, ch, x - a * 0.1, y - h * 0.62 + a * 0.12, a * 0.5);
  shine(c, [[x - a * 0.82, y - h * 0.85], [x - a * 0.82, y - h * 0.2]], 8);
  shape(c, () => ell(c, x, y - h, a, ry), COL.steel, 6);
  if (lid === "on") {
    shape(c, () => ell(c, x, y - h - 6, a * 1.04, ry * 1.04), COL.steelIn, 6);
    shape(c, () => rrect(c, x - 22, y - h - 6 - ry * 0.9, 44, 22, 8), COL.steelDk, 5);
  } else shape(c, () => ell(c, x, y - h, a * 0.9, ry * 0.76), water ?? COL.steelIn, 4);
  if (lid === "off" && water) shine(c, [[x - a * 0.55, y - h - ry * 0.2], [x - a * 0.25, y - h - ry * 0.4]], 6);
};
// a loose lid, centre (x, y), seen a little from above
const lid = (c: Ctx, x: number, y: number, w: number) => {
  const a = w / 2, ry = w * 0.13;
  shadow(c, x + a * 0.15, y + ry * 1.1, a * 1.0, ry * 0.8);
  shape(c, () => { c.moveTo(x - a, y); c.lineTo(x - a, y + 16); c.bezierCurveTo(x - a, y + 16 + ry * 1.2, x + a, y + 16 + ry * 1.2, x + a, y + 16); c.lineTo(x + a, y); c.closePath(); }, COL.steelDk, 5);
  shape(c, () => ell(c, x, y, a, ry), COL.steelIn, 6);
  shape(c, () => rrect(c, x - 22, y - ry * 0.9, 44, 22, 8), COL.steelDk, 5);
};
const wisp = (c: Ctx, x: number, y: number, h: number, ph = 0) => {
  const p = Array.from({ length: 9 }, (_, i) => [x + Math.sin(i * 0.9 + ph) * 18, y - (i / 8) * h]);
  line(c, p, 22, "#b8c4d4"); line(c, p, 12, "#ffffff");
};
const corLeaf = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  for (const [dx, dy, r] of [[0, -s * 0.5, s * 0.5], [-s * 0.45, -s * 0.1, s * 0.4], [s * 0.45, -s * 0.1, s * 0.4]]) shape(c, () => ell(c, dx, dy, r, r * 0.9), COL.leaf, 5);
  line(c, [[0, 0], [0, -s * 0.8]], 3, COL.leafDk);
  c.restore();
};
// a cucumber slice seen from above: green skin, pale flesh, seed ring; yellow = how much turmeric stuck (0..1)
const cuke = (c: Ctx, x: number, y: number, r: number, yellow = 0) => {
  shadow(c, x + r * 0.12, y + r * 0.2, r, r * 0.95);
  shape(c, () => ell(c, x, y, r, r), "#4f9a3f");
  shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), "#dcefb8", 4);
  shape(c, () => ell(c, x, y, r * 0.5, r * 0.5), "#c3e08a", 3);
  const rd = rnd(5);
  for (let i = 0; i < 9; i++) { const an = (i / 9) * 6.283; shape(c, () => ell(c, x + Math.cos(an) * r * 0.33, y + Math.sin(an) * r * 0.33, r * 0.07, r * 0.045, an), "#f4f1e4", 0); }
  shade(c, () => ell(c, x, y, r, r), "#2f6a2a", r * 0.3, r * 0.2, 0.35);
  if (yellow > 0) {
    c.save(); c.beginPath(); ell(c, x, y, r * 0.98, r * 0.98); c.clip(); c.globalAlpha = yellow; c.beginPath(); ell(c, x, y, r * 0.98, r * 0.98); c.fillStyle = TURM; c.fill(); c.globalAlpha = 1;
    for (let i = 0; i < 26; i++) { c.beginPath(); ell(c, x + (rd() - 0.5) * r * 1.8, y + (rd() - 0.5) * r * 1.8, 5 + rd() * 5, 4 + rd() * 4); c.fillStyle = TURMDK; c.fill(); }
    c.restore(); c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  }
};
// a round biscuit seen from above: tan, rim, a ring of holes; yellow = a few specks only
const biscuit = (c: Ctx, x: number, y: number, r: number, yellow = 0) => {
  shadow(c, x + r * 0.12, y + r * 0.2, r, r * 0.95);
  shape(c, () => ell(c, x, y, r, r), "#d9a55b");
  shade(c, () => ell(c, x, y, r, r), "#a8742f", r * 0.3, r * 0.2, 0.45);
  shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), "#e6b872", 3);
  for (let i = 0; i < 8; i++) { const an = (i / 8) * 6.283 + 0.3; shape(c, () => ell(c, x + Math.cos(an) * r * 0.5, y + Math.sin(an) * r * 0.5, r * 0.06, r * 0.06), "#9a6a2a", 0); }
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), "#9a6a2a", 0);
  if (yellow > 0) { const rd = rnd(9); for (let i = 0; i < 7; i++) { c.beginPath(); ell(c, x + (rd() - 0.5) * r * 1.3, y + (rd() - 0.5) * r * 1.3, 5 + rd() * 3, 4 + rd() * 3); c.fillStyle = TURM; c.fill(); } }
};
const darkPlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.06, y + ry * 0.3, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), DPLATE);
  shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.84, ry * 0.8), DPLATEIN, 4);
  shine(c, [[x - rx * 0.9, y - ry * 0.1], [x - rx * 0.8, y - ry * 0.45]], 8);
};
// a layer of turmeric powder lying on the plate
const patch = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = TURM; c.fill();
  c.save(); c.beginPath(); ell(c, x, y, rx, ry); c.clip(); c.beginPath(); ell(c, x + rx * 0.3, y + ry * 0.3, rx, ry); c.fillStyle = TURMDK; c.globalAlpha = 0.4; c.fill(); c.restore(); c.globalAlpha = 1;
  const rd = rnd(21);
  for (let i = 0; i < 40; i++) { const an = rd() * 6.283, d = 1 + rd() * 0.18; c.beginPath(); ell(c, x + Math.cos(an) * rx * d, y + Math.sin(an) * ry * d, 3 + rd() * 3, 3 + rd() * 2); c.fillStyle = TURM; c.fill(); }
};
const DX = [170, 440, 710];

// ---------------------------------------------------------------- experiment 1: three dabbas, A closed, B open, C with leaves
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // stove with a lit burner under the pan
  shape(c, () => rrect(c, 60, 830, 800, 140, 18), "#4a4a55");
  shade(c, () => rrect(c, 60, 830, 800, 140, 18), "#2e2e38", 40, 20, 0.5);
  shape(c, () => rrect(c, 340, 810, 260, 30, 10), "#2e2e38", 5);
  for (const fx of [390, 470, 550]) shape(c, () => { c.moveTo(fx - 22, 812); c.quadraticCurveTo(fx - 26, 770, fx, 735); c.quadraticCurveTo(fx + 26, 770, fx + 22, 812); c.closePath(); }, COL.orange, 4);
  for (const fx of [390, 470, 550]) shape(c, () => { c.moveTo(fx - 10, 812); c.quadraticCurveTo(fx - 12, 785, fx, 768); c.quadraticCurveTo(fx + 12, 785, fx + 10, 812); c.closePath(); }, COL.yellow, 0);
  // the pan with its handle
  shape(c, () => rrect(c, 90, 538, 190, 40, 14), "#6b4a2c", 6);
  shape(c, () => { c.moveTo(240, 400); c.lineTo(240, 700); c.quadraticCurveTo(240, 745, 290, 745); c.lineTo(650, 745); c.quadraticCurveTo(700, 745, 700, 700); c.lineTo(700, 400); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(240, 400); c.lineTo(240, 700); c.quadraticCurveTo(240, 745, 290, 745); c.lineTo(650, 745); c.quadraticCurveTo(700, 745, 700, 700); c.lineTo(700, 400); c.closePath(); }, COL.steelDk, 90, 0, 0.5);
  shine(c, [[265, 450], [265, 680]], 9);
  shape(c, () => ell(c, 470, 400, 230, 50), COL.steelIn, 6);
  shape(c, () => ell(c, 470, 404, 206, 38), "#ecdca0", 4);
  const rd = rnd(3);
  for (let i = 0; i < 14; i++) shape(c, () => ell(c, 300 + rd() * 340, 396 + rd() * 20, 5, 4), "#c9a85a", 0);
  for (const [bx, by] of [[560, 400], [620, 410], [380, 412]]) shape(c, () => ell(c, bx, by, 13, 10), "#fff7d6", 3);
  // steam
  wisp(c, 400, 340, 170, 0); wisp(c, 520, 335, 190, 2); wisp(c, 630, 340, 150, 4);
  // the spoon, held by the grown-up's hand
  line(c, [[430, 410], [840, 130]], 20, INK); line(c, [[430, 410], [840, 130]], 10, COL.wood);
  shape(c, () => ell(c, 440, 405, 40, 20, 0.6), COL.steelDk, 5);
  arrow(c, [[300, 380], [360, 440], [470, 452], [580, 440]], RED, 10);
  hand(c, 930, 130, 2.55, 1.6, SKIN.adult, CLOTH.adult);
  // the child stands well back
  person(c, 960, 1040, 380);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  DX.forEach((x, i) => dabba(c, x, 960, 240, 260, "ABC"[i]));
  // the kettle, tipped to pour into dabba B
  const kx = 725, ky = 320;
  c.save(); c.translate(kx, ky); c.rotate(-0.55);
  const body = () => rrect(c, -150, -110, 300, 230, 70);
  line(c, [[-90, -104], [-60, -190], [60, -190], [100, -104]], 30, INK); line(c, [[-90, -104], [-60, -190], [60, -190], [100, -104]], 16, COL.black);
  shape(c, () => polyP(c, [[-135, -20], [-262, -118], [-236, -146], [-120, -70]]), COL.steel);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 50, 10, 0.55);
  shape(c, () => rrect(c, -60, -128, 120, 30, 12), COL.steelIn, 5);
  shape(c, () => ell(c, 0, -142, 14, 12), COL.black, 4);
  shine(c, [[-110, -60], [-110, 50]], 10);
  c.restore();
  // the stream into dabba B and steam
  line(c, [[392, 352], [395, 440], [418, 580], [440, 700]], 16, COL.waterDk); line(c, [[392, 322], [395, 420], [418, 560], [440, 700]], 8, COL.water);
  wisp(c, 330, 360, 120, 0); wisp(c, 520, 640, 130, 2); wisp(c, 600, 700, 110, 4);
  hand(c, 840, 100, 2.45, 1.5, SKIN.adult, CLOTH.adult);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const wc = "#b9dcf4";
  DX.forEach((x, i) => dabba(c, x, 960, 240, 260, "ABC"[i], wc));
  // A: the lid coming down; C: two coriander leaves floating, its lid waiting beside
  lid(c, DX[0], 470, 250);
  arrow(c, [[DX[0], 560], [DX[0], 660]], RED, 12);
  leaf(c, DX[2] - 60, 706, 85, -0.35, COL.leaf); leaf(c, DX[2] + 5, 710, 85, 0.25, COL.leaf);
  lid(c, 960, 880, 200);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  // the kitchen shelf
  shape(c, () => rrect(c, -20, 900, 740, 220, 8), COL.wood);
  shape(c, () => rrect(c, -20, 900, 740, 40, 8), COL.woodDk, 6);
  const wc = "#b9dcf4";
  [110, 340, 570].forEach((x, i) => dabba(c, x, 900, 210, 240, "ABC"[i], wc));
  leaf(c, 570 - 50, 678, 70, -0.35, COL.leaf); leaf(c, 570 + 5, 681, 70, 0.25, COL.leaf);
  // the smell drifts up from dabba C to her nose
  for (const k of [0, 1]) { const p = Array.from({ length: 24 }, (_, i) => { const t = i / 23; return [575 + t * 215 + Math.sin(t * 9 + k * 2) * 16, 640 - Math.sin(t * Math.PI * 0.5) * 215 - t * 20 + k * 22]; }); line(c, p, 10, "#7fc3b0"); }
  // the child waves it towards herself
  const H = 760, PX = 910, PY = 1040;
  person(c, PX, PY, H, { armL: [2.4, 3.9] });
  const sx = PX - H * 0.11, sy = PY - H * 0.74 + H * 0.03;
  const ex = sx + Math.cos(2.4) * H * 0.17, ey = sy + Math.sin(2.4) * H * 0.17, wx = ex + Math.cos(3.9) * H * 0.16, wy = ey + Math.sin(3.9) * H * 0.16;
  hand(c, wx + 10, wy + 10, 3.3, 1.35, SKIN.child, CLOTH.child, true);
  arrow(c, [[470, 560], [500, 480], [560, 420]], RED, 10);
};

// ---------------------------------------------------------------- experiment 2: washing coriander
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  bowl(c, 470, 690, 380, "#a98a5f");
  // the bunch: leaves at the top, stems gathered in the hand, muddy roots in the water
  const bx = 640;
  for (let k = -3; k <= 3; k++) {
    const tx = bx + k * 60, ty = 190 + Math.abs(k) * 26;
    line(c, [[bx + k * 5, 600], [bx + k * 4, 420], [tx, ty + 30]], 18, INK); line(c, [[bx + k * 5, 600], [bx + k * 4, 420], [tx, ty + 30]], 9, COL.green);
    corLeaf(c, tx, ty + 30, 100, k * 0.2);
  }
  for (let k = -3; k <= 3; k++) { const p = [[bx + k * 3, 600], [bx + k * 14, 670], [bx + k * 20, 740]]; line(c, p, 11, INK); line(c, p, 5, "#8a5a3c"); }
  for (const [mx, my] of [[300, 715], [380, 745], [780, 735], [850, 700]]) shape(c, () => ell(c, mx, my, 30, 10), "#7d6040", 0);
  hand(c, 750, 450, Math.PI, 1.6, SKIN.adult, CLOTH.adult);
  arrow(c, [[450, 705], [520, 735], [610, 738]], RED, 10);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const cols = ["#9a6a3b", "#c79a62", "#e6d4b2", "#d6ecfa"];
  cols.forEach((col, i) => {
    const x = 290 + (i % 2) * 500, y = 250 + Math.floor(i / 2) * 400, r = 185;
    shadow(c, x + r * 0.1, y + r * 0.9, r * 0.85, r * 0.14);
    const b = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 1.0, x + r * 0.95, y + r * 1.0, x + r, y); c.closePath(); };
    shape(c, b, WHITE); shade(c, b, "#d9d2c3", r * 0.4, 0, 0.7);
    shape(c, () => ell(c, x, y, r, r * 0.22), WHITE, 6);
    shape(c, () => ell(c, x, y + 4, r * 0.88, r * 0.17), col, 4);
    write(c, String(i + 1), x - 14, y + r * 0.95, 70, INK, 9);
  });
};

// ---------------------------------------------------------------- experiment 3: turmeric on foods
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  darkPlate(c, 430, 810, 380, 150);
  patch(c, 380, 810, 150, 50);
  // the tea strainer over the plate, held by a hand
  line(c, [[500, 400], [800, 250]], 24, INK); line(c, [[500, 400], [800, 250]], 12, COL.steelDk);
  const bw = () => { c.moveTo(250, 380); c.bezierCurveTo(250, 530, 510, 530, 510, 380); c.closePath(); };
  shape(c, bw, COL.steelIn);
  shade(c, bw, COL.steelDk, 40, 0, 0.35);
  c.save(); c.beginPath(); bw(); c.clip();
  for (let k = -6; k <= 14; k++) { line(c, [[250 + k * 22, 360], [250 + k * 22 - 80, 540]], 2.5, COL.steelDk); line(c, [[250 + k * 22 - 90, 360], [250 + k * 22 + 10, 540]], 2.5, COL.steelDk); }
  c.restore();
  c.beginPath(); bw(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 380, 380, 130, 30), COL.steelIn, 6);
  const rd = rnd(11);
  for (let i = 0; i < 45; i++) { const t = rd(); c.beginPath(); ell(c, 345 + t * 70 + (rd() - 0.5) * 70 * t, 520 + t * 0 + rd() * 230, 5, 5.5); c.fillStyle = TURM; c.fill(); }
  hand(c, 960, 130, 2.6, 1.6, SKIN.adult, CLOTH.adult);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  darkPlate(c, 430, 810, 380, 150);
  patch(c, 430, 810, 250, 85);
  cuke(c, 330, 330, 120, 0);
  arrow(c, [[330, 480], [330, 600]], RED, 12);
  biscuit(c, 590, 330, 110, 0);
  arrow(c, [[590, 470], [590, 600]], RED, 12);
  // the timer beside the plate
  const tx = 930, ty = 760, tr = 100;
  shadow(c, tx + 12, ty + tr + 4, tr, 22);
  shape(c, () => rrect(c, tx - 18, ty - tr - 34, 36, 40, 8), COL.steelDk, 5);
  shape(c, () => ell(c, tx, ty, tr, tr), COL.red);
  shade(c, () => ell(c, tx, ty, tr, tr), "#b83a26", 18, 18, 0.5);
  shape(c, () => ell(c, tx, ty, tr * 0.82, tr * 0.82), WHITE, 4);
  for (let k = 0; k < 12; k++) { const an = (k / 12) * 6.283; line(c, [[tx + Math.cos(an) * tr * 0.64, ty + Math.sin(an) * tr * 0.64], [tx + Math.cos(an) * tr * 0.76, ty + Math.sin(an) * tr * 0.76]], 4, INK); }
  line(c, [[tx, ty], [tx + Math.cos(-1.1) * tr * 0.62, ty + Math.sin(-1.1) * tr * 0.62]], 7, INK);
  shape(c, () => ell(c, tx, ty, 9, 9), INK, 0);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  // a white paper plate seen from above
  shadow(c, 560, 575, 440, 440);
  shape(c, () => ell(c, 540, 540, 440, 440), WHITE);
  shape(c, () => ell(c, 540, 540, 350, 350), "#f1ede4", 3);
  shade(c, () => ell(c, 540, 540, 440, 440), "#d9d2c3", 50, 40, 0.5);
  cuke(c, 380, 380, 140, 0.9);
  cuke(c, 380, 700, 140, 0.9);
  biscuit(c, 710, 380, 125, 1);
  biscuit(c, 710, 700, 125, 1);
};

export const su_foodFoodSafety = cards("sci.food.food-safety.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e3_0, e3_1, e3_2]);
