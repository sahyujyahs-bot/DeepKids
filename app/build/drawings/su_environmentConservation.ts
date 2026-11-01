import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, seed, hand, write, cards, rnd } from "./flatKit";

// ENVIRONMENT CONSERVATION · set-up cards for sci.environment.conservation.L3.
// Same things look the same across a card sequence: a teal plastic tub of soil, wheat = thin tall blades,
// moong = a stem with round leaves, a wooden ruler in cm, stick labels W and M.

type P = [number, number];
const GRAIN = "#d9a85a", GRAIN_DK = "#b4823a", MUD = "#b48a5a", MUD_DK = "#6a4128", TEAL_LT = "#6fd0c6";
const qp = (a: P, b: P, d: P, t: number): P => { const m = 1 - t; return [m * m * a[0] + 2 * m * t * b[0] + t * t * d[0], m * m * a[1] + 2 * m * t * b[1] + t * t * d[1]]; };

// a curved blade from a to d (bend b), width w at the base; flat = a square cut end instead of a point
const blade = (c: Ctx, a: P, b: P, d: P, w: number, flat = false, col: string = COL.leaf) => {
  const L: P[] = [], R: P[] = [], N = 14;
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = qp(a, b, d, t), q = qp(a, b, d, Math.min(1, t + 0.03)), o = qp(a, b, d, Math.max(0, t - 0.03));
    const dx = q[0] - o[0], dy = q[1] - o[1], n = Math.hypot(dx, dy) || 1, hw = (w / 2) * (1 - t * (flat ? 0.15 : 0.97));
    L.push([p[0] - (dy / n) * hw, p[1] + (dx / n) * hw]); R.push([p[0] + (dy / n) * hw, p[1] - (dx / n) * hw]);
  }
  const pts = [...L, ...R.reverse()];
  shape(c, () => polyP(c, pts), col, w < 30 ? 4 : 6);
  line(c, [a, qp(a, b, d, 0.45), qp(a, b, d, flat ? 0.95 : 0.8)], 3, COL.leafDk);
  if (flat) line(c, [pts[N], pts[N + 1]], 5, "#d6ecaa");
};
// a wheat blade standing at (x, y), height h, leaning by lean
const wheat = (c: Ctx, x: number, y: number, h: number, lean: number, flat = false, w = 24) => blade(c, [x, y], [x + lean * 0.2, y - h * 0.6], [x + lean, y - h], w, flat, flat ? COL.green : COL.leaf);
// a moong seedling: stem with pairs of round leaves
const sprout = (c: Ctx, x: number, y: number, h: number, lean: number) => {
  const s: P[] = [[x, y], [x + lean * 0.4, y - h * 0.5], [x + lean, y - h]];
  line(c, s, 20, INK); line(c, s, 11, COL.greenLt);
  for (const [t, k] of [[0.55, 0.8], [1, 1]] as [number, number][]) {
    const [px, py] = qp(s[0], s[1], s[2], t);
    for (const sd of [-1, 1]) {
      shape(c, () => ell(c, px + sd * 34 * k, py - 4, 34 * k, 22 * k, -sd * 0.35), COL.leaf, 5);
      line(c, [[px + sd * 6, py], [px + sd * 58 * k, py - 14 * k]], 3, COL.leafDk);
    }
  }
  const [tx, ty] = s[2]; shape(c, () => ell(c, tx, ty - 24, 13, 22), COL.greenLt, 4);
};
// a moong stump cut flat
const stump = (c: Ctx, x: number, y: number, h: number) => {
  line(c, [[x, y], [x, y - h]], 22, INK); line(c, [[x, y], [x, y - h]], 12, COL.greenLt);
  shape(c, () => ell(c, x, y - h, 8, 4.5), "#eef3c8", 3);
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  const g: Record<string, P[]> = { W: [[0, 0], [0.22, 1], [0.5, 0.4], [0.78, 1], [1, 0]], M: [[0, 1], [0, 0], [0.5, 0.65], [1, 0], [1, 1]] };
  line(c, g[ch].map(([u, v]) => [x + u * h * 0.9, y + v * h]), 7);
};
// a stick label standing in the soil: a wooden stick, a paper flag with a letter
const stick = (c: Ctx, x: number, y: number, ch: string) => {
  shape(c, () => rrect(c, x - 6, y - 130, 12, 140, 4), COL.wood, 4);
  shape(c, () => rrect(c, x - 34, y - 190, 68, 66, 6), WHITE, 5);
  letter(c, ch, x - 15, y - 178, 42);
};
const specks = (c: Ctx, x: number, y: number, w: number, h: number, n: number, sd: number) => {
  const r = rnd(sd); for (let i = 0; i < n; i++) shape(c, () => ell(c, x + r() * w, y + r() * h, 5 + r() * 6, 3 + r() * 3, r() * 3), COL.soilDk, 0);
};
// the teal plastic tub of soil, seen from the front and a little above. topY = middle of the rim
const tubBox = (c: Ctx, cx: number, topY: number, w: number, depth: number, wall: number) => {
  const x = cx - w / 2, body = () => rrect(c, x, topY, w, depth / 2 + wall, 30);
  shadow(c, cx + 30, topY + depth / 2 + wall, w * 0.54, 30);
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, -w * 0.06, -10, 0.6);
  shape(c, () => rrect(c, x, topY - depth / 2, w, depth, 30), TEAL_LT);
  shape(c, () => rrect(c, x + 20, topY - depth / 2 + 16, w - 40, depth - 32, 18), COL.soil, 5);
  specks(c, x + 40, topY - depth / 2 + 24, w - 80, depth - 48, Math.round(w / 22), 5);
};
// a wooden ruler standing on its end, zero at base, cm px per cm, n cm long; mark = cm to mark in red
const ruler = (c: Ctx, x: number, base: number, cm: number, n: number, mark = 0, w = 84) => {
  const top = base - cm * (n + 0.6), body = () => rrect(c, x - w / 2, top, w, base - top, 6);
  shadow(c, x + 14, base + 2, w * 0.62, 10);
  shape(c, body, COL.wood); shade(c, body, COL.woodDk, -w * 0.2, 0, 0.5);
  for (let i = 0; i <= n; i++) {
    const y = base - i * cm; line(c, [[x + w / 2, y], [x + w / 2 - 30, y]], 4);
    if (i < n) line(c, [[x + w / 2, y - cm / 2], [x + w / 2 - 17, y - cm / 2]], 3);
    if (i && i % 2 === 0) write(c, String(i), x - w / 2 + 9, y - 16, 32, INK, 5);
  }
  if (mark) line(c, [[x - w / 2, base - mark * cm], [x + w / 2, base - mark * cm]], 9, RED);
};
const tiles = (c: Ctx) => {
  ground(c, "#e9eef0"); c.strokeStyle = "#c5d0d6"; c.lineWidth = 4;
  for (let i = 0; i <= D8; i += 135) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, D8); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(D8, i); c.stroke(); }
};
const D8 = 1080;

// ---------------------------------------------------------------- experiment 1: the cutting test
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const katori = (x: number, y: number, r: number, wheatSeeds: boolean) => {
    const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y + r * 1.05, x + r * 0.95, y + r * 1.05, x + r, y); c.closePath(); };
    shadow(c, x + 30, y + r * 0.8, r * 0.95, r * 0.14);
    shape(c, body, COL.steel); shade(c, body, COL.steelDk, -r * 0.3, -r * 0.05, 0.6);
    shape(c, () => ell(c, x, y, r, r * 0.34), COL.steelIn);
    shape(c, () => ell(c, x, y + 4, r * 0.9, r * 0.28), COL.water, 4);
    const rd = rnd(wheatSeeds ? 3 : 4);
    for (let i = 0; i < 44; i++) {
      const t = rd() * Math.PI * 2, u = Math.sqrt(rd()) * 0.8, sx = x + Math.cos(t) * u * r * 0.82, sy = y + 4 + Math.sin(t) * u * r * 0.24;
      if (wheatSeeds) seed(c, sx, sy, 17, rd() * 3, false, GRAIN, GRAIN_DK); else seed(c, sx, sy, 15, rd() * 3, true);
    }
    c.beginPath(); ell(c, x, y + 4, r * 0.9, r * 0.28); c.fillStyle = "rgba(143,195,234,0.35)"; c.fill();
    shine(c, [[x - r * 0.55, y + 12], [x - r * 0.2, y + 24]], 8);
    shine(c, [[x - r * 0.8, y + r * 0.45], [x - r * 0.5, y + r * 0.78]], 9);
  };
  katori(285, 560, 235, true); katori(795, 560, 235, false);
  // a few dry grains in front, so each bowl is named by what it holds
  for (let i = 0; i < 4; i++) { seed(c, 215 + i * 44, 905 + (i % 2) * 22, 20, 0.4 * i, false, GRAIN, GRAIN_DK); seed(c, 725 + i * 44, 905 + (i % 2) * 22, 18, 0.5 * i, false); }
  // the night: a moon
  shape(c, () => { c.arc(540, 160, 95, 2.1, 4.18); c.arc(540 + 48, 160, 125, 3.85, 2.43, true); c.closePath(); }, COL.yellow, 6);
  shape(c, () => ell(c, 690, 110, 12, 12), COL.yellow, 4); shape(c, () => ell(c, 410, 90, 9, 9), COL.yellow, 4);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 700, 500, 250);
  tubBox(c, 540, 540, 720, 380, 80);
  const rd = rnd(21);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) {
    seed(c, 232 + k * 44 + rd() * 8, 405 + r * 48 + rd() * 8, 19, rd() * 3, false, GRAIN, GRAIN_DK);
    seed(c, 574 + k * 44 + rd() * 8, 405 + r * 48 + rd() * 8, 17, rd() * 3, false);
  }
  stick(c, 370, 705, "W"); stick(c, 710, 705, "M");
};

const E1_TOP = 700, E1_SC = 44;
const sticksAndRuler = (c: Ctx, mark: number) => { stick(c, 205, E1_TOP + 40, "W"); stick(c, 875, E1_TOP + 40, "M"); ruler(c, 540, E1_TOP + 36, E1_SC, 10, mark); };
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  tubBox(c, 540, E1_TOP, 800, 100, 150);
  const rd = rnd(5);
  for (let i = 0; i < 12; i++) wheat(c, 262 + i * 18 + rd() * 6, E1_TOP - 6 + (i % 3) * 8, 290 + rd() * 40, (rd() - 0.5) * 50, false, 22);
  for (let i = 0; i < 5; i++) sprout(c, 606 + i * 60, E1_TOP - 2 + (i % 2) * 10, 235 + rd() * 30, (rd() - 0.5) * 24);
  sticksAndRuler(c, 0);
};

// scissors pointing left, pivot at (px, py)
const scissors = (c: Ctx, px: number, py: number) => {
  c.save(); c.translate(px, py); c.scale(-1, 1);
  const tap = (x0: number, y0: number, x1: number, y1: number, w0: number, col: string) => {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
    shape(c, () => polyP(c, [[x0 + nx * w0, y0 + ny * w0], [x1 + nx * 2, y1 + ny * 2], [x1 - nx * 2, y1 - ny * 2], [x0 - nx * w0, y0 - ny * w0]]), col, 5);
  };
  for (const s of [-1, 1]) {
    line(c, [[0, 0], [-60, s * 40], [-100, s * 46]], 20, INK); line(c, [[0, 0], [-60, s * 40], [-100, s * 46]], 10, COL.blue);
    shape(c, () => ell(c, -112, s * 48, 36, 30), "rgba(0,0,0,0)", 0); c.beginPath(); ell(c, -112, s * 48, 36, 30); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.blue; c.lineWidth = 11; c.stroke();
  }
  tap(0, 0, 250, -34, 18, COL.steel); tap(0, 0, 250, 34, 18, COL.steelDk);
  shape(c, () => ell(c, 0, 0, 14, 14), COL.steelIn, 5);
  c.restore();
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const base = 830, cm = 85, cutY = base - 2 * cm;
  ruler(c, 285, base, cm, 8, 2, 66);
  line(c, [[330, cutY], [640, cutY]], 4, RED);
  const rd = rnd(8);
  [100, 160, 220].forEach((x, i) => stump(c, x, base - 8 + (i % 2) * 8, 2 * cm - 8));
  [430, 468, 506, 544, 582].forEach((x, i) => wheat(c, x, base - 4 + (i % 2) * 8, 5.0 * cm - i * 8, (rd() - 0.5) * 20, false, 30));
  shape(c, () => rrect(c, -20, base, 1120, 400, 0), COL.soil, 6);
  specks(c, 0, base + 20, 1080, 200, 40, 9);
  // cut-off tops lie on the soil
  c.save(); c.translate(170, 800); c.rotate(-1.3); sprout(c, 0, 0, 110, 0); c.restore();
  c.save(); c.translate(280, 865); c.rotate(1.45); sprout(c, 0, 0, 90, 0); c.restore();
  scissors(c, 640, cutY);
  hand(c, 640 + 191, cutY, Math.PI, 1.3);
  // a wheat top falls
  blade(c, [596, 590], [598, 570], [604, 530], 22, false);
  arrow(c, [[620, 450], [620, 520]], RED, 9);
};
// setup.e1.4
const e1_4 = (c: Ctx) => {
  ground(c);
  tubBox(c, 540, E1_TOP, 800, 100, 150);
  const rd = rnd(6);
  for (let i = 0; i < 12; i++) wheat(c, 262 + i * 18 + rd() * 6, E1_TOP - 6 + (i % 3) * 8, 190 + rd() * 20, (rd() - 0.5) * 16, true, 26);
  for (let i = 0; i < 5; i++) stump(c, 606 + i * 60, E1_TOP + (i % 2) * 10, 2 * E1_SC);
  sticksAndRuler(c, 2);
};

// ---------------------------------------------------------------- experiment 2: the dot test
const R2 = { x: 430, base: 880, cm: 62 };
const dotAt = (c: Ctx, p: P, ghost = false) => {
  if (ghost) { c.beginPath(); ell(c, p[0], p[1], 15, 15); c.setLineDash([7, 7]); c.strokeStyle = COL.greyDk; c.lineWidth = 4; c.stroke(); c.setLineDash([]); }
  else shape(c, () => ell(c, p[0], p[1], 15, 15), COL.purple, 5);
};
const leafScene = (c: Ctx, tipCm: number, dots: number[], ghost: number[]) => {
  ground(c);
  const { x, base, cm } = R2, tip = tipCm * cm;
  shape(c, () => rrect(c, -20, base, 1120, 300, 0), COL.soil, 6); specks(c, 0, base + 20, 1080, 140, 30, 4);
  blade(c, [585, base], [575, base - tip * 0.4], [540, base - tip * 0.62], 40, false, COL.leafDk);
  blade(c, [735, base], [740, base - tip * 0.5], [790, base - tip * 0.72], 40, false, COL.leafDk);
  const a: P = [650, base], b: P = [640, base - tip * 0.55], d: P = [715, base - tip];
  blade(c, a, b, d, 64, false, COL.leaf);
  const at = (y: number): P => { let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (qp(a, b, d, m)[1] > y) lo = m; else hi = m; } return qp(a, b, d, lo); };
  ruler(c, x, base + 6, cm, 10, 0, 84);
  for (const cmv of dots) line(c, [[x + 42, base - cmv * cm], [at(base - cmv * cm)[0] - 30, base - cmv * cm]], 3, COL.greyDk);
  ghost.forEach((g) => dotAt(c, at(base - g * cm), true));
  dots.forEach((g) => dotAt(c, at(base - g * cm)));
  // the 2 cm between the dots
  const y1 = base - dots[0] * cm, y2 = base - dots[1] * cm, bx = 810;
  line(c, [[bx - 12, y1], [bx, y1], [bx, y2], [bx - 12, y2]], 6, RED);
  write(c, "2cm", bx + 22, (y1 + y2) / 2 - 22, 44, INK, 7);
  hand(c, R2.x - 91, 300, 0, 1.3);
  return at;
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  const at = leafScene(c, 6, [2, 4], []);
  const tip = at(880 - 4 * 62), ux = 0.48, uy = -0.88;
  const body = () => { c.save(); c.translate(tip[0] + 16, tip[1]); c.rotate(Math.atan2(uy, ux)); };
  body(); // pen
  shape(c, () => polyP(c, [[0, 0], [52, -17], [52, 17]]), INK, 4);
  shape(c, () => rrect(c, 46, -20, 300, 40, 12), COL.purple, 5); shade(c, () => rrect(c, 46, -20, 300, 40, 12), "#5a3f99", 0, -14, 0.6);
  c.restore();
  const m: P = [tip[0] + 16 + 200 * ux, tip[1] + 200 * uy], an = Math.PI + 0.5;
  hand(c, m[0] - 70 * 1.2 * Math.cos(an), m[1] - 70 * 1.2 * Math.sin(an), an, 1.2);
};
// setup.e2.1
const e2_1 = (c: Ctx) => { leafScene(c, 8.7, [3.5, 5.5], [2, 4]); arrow(c, [[540, 700], [540, 560]], RED, 10); };

// ---------------------------------------------------------------- experiment 3: the bare tub test
const TH = 0.273;
const tp = (u: number, v: number): P => [30 + u * Math.cos(TH) - v * Math.sin(TH), 703 + u * Math.sin(TH) + v * Math.cos(TH)];
const book = (c: Ctx, x: number, y: number, w: number, col: string) => { shape(c, () => rrect(c, x, y, w, 46, 5), col, 5); line(c, [[x + w - 18, y + 8], [x + w - 18, y + 38]], 3, WHITE); };
// a tilted tub on a stack of books, a steel bowl under its low end (local frame: floor y 880)
const slopeSet = (c: Ctx, plants: boolean, wet: boolean) => {
  shadow(c, 260, 884, 270, 16);
  const cols = [COL.red, COL.blue, COL.yellow, COL.purple, COL.orange];
  [[20, 150, 3], [250, 80, 2]].forEach(([x, w, n], si) => {
    for (let k = 0; k < n; k++) book(c, x, 880 - 46 * (k + 1), w, cols[(k + si * 2) % 5]);
    shape(c, () => rrect(c, x - 8, 880 - 46 * n - 8, w + 16, 46 * n + 8, 12), "rgba(214,236,250,0.5)", 4);
    shine(c, [[x + 14, 880 - 46 * n + 6], [x + w * 0.5, 880 - 46 * n + 6]], 7);
  });
  bowl(c, 440, 838, 62, wet ? MUD : COL.steelIn);
  c.save(); c.translate(30, 703); c.rotate(TH);
  const body = () => rrect(c, 0, -100, 400, 100, 14);
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, -30, -10, 0.6);
  shape(c, () => polyP(c, [[-6, -100], [406, -100], [388, -168], [12, -168]]), TEAL_LT);
  shape(c, () => polyP(c, [[18, -108], [382, -108], [368, -158], [32, -158]]), wet ? COL.soilDk : COL.soil, 5);
  if (wet) for (const [a, b] of [[110, 300], [170, 350], [230, 380]]) line(c, [[a, -145], [a + 40, -135], [(a + b) / 2, -126], [b, -118]], 5, MUD);
  c.restore();
  if (wet) { drop(c, 458, 772, 0.9, MUD); drop(c, 466, 806, 0.8, MUD); }
  if (!wet) { const rd = rnd(2); for (let i = 0; i < 16; i++) { const [x, y] = tp(40 + rd() * 320, -150 + rd() * 36); shape(c, () => ell(c, x, y, 6, 4, TH), COL.soilDk, 0); } }
  if (plants) {
    const rd = rnd(14), pts: [number, number, number][] = [];
    for (let i = 0; i < 30; i++) pts.push([48 + (i / 29) * 312 + rd() * 8, -154 + rd() * 40, rd()]);
    pts.sort((a, b) => a[1] - b[1]).forEach(([u, v, r]) => { const [x, y] = tp(u, v); wheat(c, x, y + 4, 105 + r * 60, (r - 0.5) * 40, false, 20); });
    // front of the tub drawn again over the plant bases
    c.save(); c.translate(30, 703); c.rotate(TH); shape(c, () => rrect(c, 0, -100, 400, 100, 14), COL.teal); shade(c, () => rrect(c, 0, -100, 400, 100, 14), COL.tealDk, -30, -10, 0.6); c.restore();
  }
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  tiles(c);
  c.save(); c.translate(0, 0); slopeSet(c, false, false); c.restore();
  c.save(); c.translate(520, 0); slopeSet(c, true, false); c.restore();
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - 16 * s); c.quadraticCurveTo(x + 12 * s, y, x + 9 * s, y + 6 * s); c.arc(x, y + 6 * s, 9 * s, 0, Math.PI); c.quadraticCurveTo(x - 12 * s, y, x, y - 16 * s); c.closePath(); }, col, 3);
// setup.e3.1
const e3_1 = (c: Ctx) => {
  tiles(c);
  c.save(); c.translate(190, -188); c.scale(1.35, 1.35); slopeSet(c, false, true); c.restore();
  // the bottle, upside down, cap with holes at the bottom
  const bx = 500, by = 400;
  shape(c, () => rrect(c, bx - 30, by - 70, 60, 52, 6), COL.blue, 5);
  shape(c, () => polyP(c, [[bx - 78, by - 120], [bx + 78, by - 120], [bx + 34, by - 70], [bx - 34, by - 70]]), COL.glass, 5);
  shape(c, () => rrect(c, bx - 78, by - 320, 156, 210, 28), COL.glass, 5);
  shape(c, () => polyP(c, [[bx - 72, by - 240], [bx + 72, by - 240], [bx + 72, by - 128], [bx + 30, by - 74], [bx - 30, by - 74], [bx - 72, by - 128]]), COL.water, 0);
  shape(c, () => ell(c, bx, by - 240, 72, 10), COL.drop, 0);
  shine(c, [[bx - 54, by - 295], [bx - 54, by - 250]], 8);
  shape(c, () => rrect(c, bx - 40, by - 24, 80, 26, 6), COL.red, 5);
  for (const k of [-24, 0, 24]) shape(c, () => ell(c, bx + k, by - 8, 4, 4), INK, 0);
  // rain
  const rd = rnd(3);
  for (let i = 0; i < 9; i++) { const x = bx - 110 + i * 27 + rd() * 8, y = by + 40 + rd() * 50 + (i % 3) * 30; line(c, [[x, y], [x + (x - bx) * 0.05, y + 38]], 8, COL.water); }
  for (let i = 0; i < 6; i++) drop(c, bx - 95 + i * 38, by + 50 + (i % 2) * 60, 0.9);
  hand(c, bx - 78 - 70 * 1.3 + 40, by - 215, 0, 1.3);
  arrow(c, [[bx + 140, by - 215], [bx + 86, by - 215]], RED, 10);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const jar = (x: number, y: number, mud: boolean) => {
    const w = 290, h = 470, wl = 90, soilH = mud ? 130 : 14;
    shadow(c, x + 24, y + 6, w * 0.6, 16);
    shape(c, () => rrect(c, x - w / 2, y - h, w, h, 22), COL.glass, 0);
    shape(c, () => rrect(c, x - w / 2 + 6, y - h + wl, w - 12, h - wl - 6, 16), mud ? MUD : "#cfe9f7", 0);
    if (mud) { const rd = rnd(7); for (let i = 0; i < 40; i++) shape(c, () => ell(c, x - w / 2 + 22 + rd() * (w - 44), y - h + wl + 30 + rd() * (h - wl - soilH - 50), 4 + rd() * 3, 3, 0), "#8a6040", 0); }
    shape(c, () => rrect(c, x - w / 2 + 6, y - soilH - 6, w - 12, soilH, 12), MUD_DK, 0);
    shape(c, () => ell(c, x, y - h + wl, w / 2 - 6, 12), mud ? "#c79b68" : "#e6f4fb", 0);
    shape(c, () => rrect(c, x - w / 2, y - h, w, h, 22), "rgba(214,236,250,0.18)", 6);
    shine(c, [[x - w / 2 + 28, y - h + 40], [x - w / 2 + 28, y - h + 200]], 9);
  };
  jar(290, 780, true); jar(790, 780, false);
  // which tub each came from
  tubBox(c, 290, 890, 200, 44, 40); tubBox(c, 790, 890, 200, 44, 40);
  const rd = rnd(11);
  for (let i = 0; i < 8; i++) wheat(c, 718 + i * 20 + rd() * 5, 892, 60 + rd() * 20, (rd() - 0.5) * 20, false, 16);
};

export const su_environmentConservation = cards("sci.environment.conservation.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e1_4, e2_0, e2_1, e3_0, e3_1, e3_2]);
void BG;
