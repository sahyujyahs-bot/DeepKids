import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, glass, plate, hand, write, cards } from "./flatKit";

// SET-UP CARDS · sci.habitats.adaptations.L3 · wet towels in air (e1), huddled ice (e2), jelly on a leaf (e3)

const TOWEL = "#bcd9f0", TOWEL_DK = "#8fb8de", ICE = "#d9f0fb", ICE_TOP = "#f1fbff", ICE_RT = "#a5d3ec";
const sheen = (c: Ctx, pts: number[][], w = 8) => shine(c, pts, w);

// ---------- shared pieces
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x, y + s * 0.7); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, COL.drop, 3);
const drops = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n: number, seed: number, s = 9) => { const r = rnd(seed); for (let i = 0; i < n; i++) drop(c, cx + (r() - 0.5) * 2 * rx, cy + (r() - 0.5) * 2 * ry, s); };
// a long sleeve running back from the cuff of hand() to the edge of the card
const sleeve = (c: Ctx, x: number, y: number, an: number, s: number) => { c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => rrect(c, -900, -36, 840, 72, 14), CLOTH.child, 6); shade(c, () => rrect(c, -900, -36, 840, 72, 14), CLOTH.childDk, 0, 14, 0.5); c.restore(); };
const armHand = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { sleeve(c, x, y, an, s); hand(c, x, y, an, s, SKIN.child, CLOTH.child, open); };

const fan = (c: Ctx, x: number, y: number, bw = 150) => {
  shape(c, () => rrect(c, x - 9, 0, 18, y - 10, 0), COL.steelDk, 5);
  for (const sx of [-1, 1]) { const b = () => ell(c, x + sx * (bw + 60), y + 24, bw, 28, sx * 0.07); shape(c, b, COL.wood); shade(c, b, COL.woodDk, 0, -12, 0.6); }
  const f = () => ell(c, x, y + 100, 34, 72); shape(c, f, COL.wood); shade(c, f, COL.woodDk, -10, 0, 0.6);
  shape(c, () => ell(c, x, y + 10, 62, 36), COL.steel); shape(c, () => ell(c, x, y + 4, 34, 18), COL.steelIn, 4);
};
const wind = (c: Ctx, xs: number[], y0: number, y1: number) => xs.forEach((x, k) => { const pts: number[][] = []; for (let y = y0; y <= y1; y += 14) pts.push([x + Math.sin((y + k * 40) / 28) * 14, y]); line(c, pts, 9, COL.water); });
const clock = (c: Ctx, x: number, y: number, r: number, min: number, hr: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78], [x + Math.sin(a) * r * 0.92, y - Math.cos(a) * r * 0.92]], 5); }
  const hand2 = (a: number, l: number, w: number) => line(c, [[x, y], [x + Math.sin(a) * r * l, y - Math.cos(a) * r * l]], w);
  hand2(hr, 0.5, 9); hand2(min, 0.75, 6); shape(c, () => ell(c, x, y, 7, 7), INK, 0);
};

// ---------- wet paper towel on a steel plate (the same three looks on every e1 card)
const towelPts = (cx: number, cy: number, rx: number, ry: number, k = 1) => [[cx - 0.62 * rx * k, cy - 0.34 * ry * k], [cx + 0.5 * rx * k, cy - 0.4 * ry * k], [cx + 0.64 * rx * k, cy + 0.3 * ry * k], [cx - 0.5 * rx * k, cy + 0.4 * ry * k]];
const towelFlat = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  const p = () => polyP(c, towelPts(cx, cy, rx, ry));
  shape(c, p, TOWEL, 5); shade(c, p, TOWEL_DK, -rx * 0.06, -ry * 0.12, 0.55);
  drops(c, cx, cy, rx * 0.4, ry * 0.2, 5, 5, rx * 0.04);
};
const towelRoll = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  const R = ry * 0.46, x1 = cx - rx * 0.5, x2 = cx + rx * 0.5, body = () => rrect(c, x1, cy - R, x2 - x1, 2 * R, R * 0.2);
  shape(c, () => ell(c, x1, cy, R * 0.5, R), TOWEL);
  shape(c, body, TOWEL); shade(c, body, TOWEL_DK, 0, -R * 0.7, 0.6);
  shape(c, () => ell(c, x2, cy, R * 0.5, R), "#d3e6f6");
  const sp: number[][] = []; for (let t = 0; t < 3.2 * Math.PI; t += 0.25) sp.push([x2 + Math.cos(t) * R * 0.5 * (t / 10), cy + Math.sin(t) * R * (t / 10)]);
  line(c, sp, 4, TOWEL_DK);
  drops(c, cx, cy + R * 0.9, rx * 0.2, 3, 2, 8, rx * 0.04);
};
const towelCovered = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  towelFlat(c, cx, cy, rx, ry);
  const q = towelPts(cx, cy - ry * 0.03, rx, ry, 1.2), p = () => polyP(c, q);
  shape(c, p, "rgba(222,242,253,0.55)", 5); c.save(); c.beginPath(); p(); c.strokeStyle = COL.glassEdge; c.lineWidth = 4; c.stroke(); c.restore();
  sheen(c, [[cx - rx * 0.5, cy - ry * 0.3], [cx - rx * 0.1, cy - ry * 0.42]], Math.max(6, rx * 0.04)); sheen(c, [[cx - rx * 0.6, cy - ry * 0.1], [cx - rx * 0.5, cy + ry * 0.1]], Math.max(5, rx * 0.03));
};
const threePlates = (c: Ctx, at: number[][], rx: number, ry: number) => {
  const kinds = [towelFlat, towelRoll, towelCovered];
  at.forEach(([x, y], i) => { plate(c, x, y, rx, ry); kinds[i](c, x, y - ry * 0.02, rx * 1.05, ry * 1.05); });
};

// ---------- ice
const cube = (c: Ctx, x: number, y: number, s: number) => {
  const dx = s * 0.3, dy = s * 0.3, r = s * 0.14;
  shape(c, () => polyP(c, [[x + s, y - s], [x + s + dx, y - s - dy], [x + s + dx, y - dy], [x + s, y]]), ICE_RT, Math.max(3, s * 0.07));
  shape(c, () => polyP(c, [[x, y - s], [x + dx, y - s - dy], [x + s + dx, y - s - dy], [x + s, y - s]]), ICE_TOP, Math.max(3, s * 0.07));
  shape(c, () => rrect(c, x, y - s, s, s, r), ICE, Math.max(3, s * 0.07));
  if (s > 30) shine(c, [[x + s * 0.18, y - s * 0.78], [x + s * 0.18, y - s * 0.3]], Math.max(4, s * 0.1));
};
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - ry * 1.4, x - rx * 0.2, y - ry * 1.1, x + rx * 0.2, y - ry); c.bezierCurveTo(x + rx * 0.8, y - ry * 1.2, x + rx * 1.1, y - ry * 0.3, x + rx, y + ry * 0.2); c.bezierCurveTo(x + rx * 0.9, y + ry * 1.2, x + rx * 0.1, y + ry * 1.1, x - rx * 0.4, y + ry * 1.0); c.bezierCurveTo(x - rx * 1.1, y + ry * 0.9, x - rx * 1.05, y + ry * 0.3, x - rx, y); c.closePath(); }, COL.water, 4);
  shine(c, [[x - rx * 0.55, y - ry * 0.3], [x - rx * 0.2, y - ry * 0.55]], 8);
};
const block = (c: Ctx, cx: number, cy: number, s: number) => {
  const x0 = cx - 1.5 * s - s * 0.15;
  for (const row of [0, 1]) for (let i = 0; i < 3; i++) cube(c, x0 + i * s + (1 - row) * s * 0.3, cy + s * 0.15 + row * s * 0.3 + (1 - row) * -s * 0.3 + s * 0.3, s);
};
const spread = (c: Ctx, cx: number, cy: number, s: number) => {
  [[-125, -70], [20, -105], [140, -45], [-95, 50], [45, 65], [150, 90]].forEach(([dx, dy]) => cube(c, cx + dx - s / 2, cy + dy + s / 2, s));
};

// ---------- spinach leaf (a bent blade) on a stalk
const leafBlade = (c: Ctx, st: number[], b: number[], k: number[], tip: number[], W: number, coated: boolean) => {
  const P = (t: number) => { const u = 1 - t; return [u * u * b[0] + 2 * u * t * k[0] + t * t * tip[0], u * u * b[1] + 2 * u * t * k[1] + t * t * tip[1]]; };
  const Nrm = (t: number) => { const a = P(Math.max(0, t - 0.02)), z = P(Math.min(1, t + 0.02)), dx = z[0] - a[0], dy = z[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  const wd = (t: number) => W * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.85) * (1 - 0.15 * t);
  const side = (sg: number, t0 = 0, t1 = 1) => { const o: number[][] = []; for (let i = 0; i <= 26; i++) { const t = t0 + (t1 - t0) * (i / 26), p = P(t), n = Nrm(t), w = sg * wd(t); o.push([p[0] + n[0] * w, p[1] + n[1] * w]); } return o; };
  const L = side(1), R = side(-1).reverse(), whole = () => polyP(c, [...L, ...R]);
  const mid = Nrm(0.5), sg = mid[0] + mid[1] > 0 ? 1 : -1;
  line(c, [st, b], 20, INK); line(c, [st, b], 10, COL.greenLt);
  shape(c, whole, COL.leaf, 6);
  const half = () => polyP(c, [...side(sg), ...Array.from({ length: 27 }, (_, i) => P(1 - i / 26))]);
  c.save(); c.beginPath(); whole(); c.clip(); c.beginPath(); half(); c.fillStyle = COL.leafDk; c.globalAlpha = 0.4; c.fill(); c.restore(); c.globalAlpha = 1;
  shape(c, whole, "rgba(0,0,0,0)", 6);
  line(c, Array.from({ length: 14 }, (_, i) => P(i / 13)), 5, COL.leafDk);
  for (const t of [0.2, 0.38, 0.56, 0.72]) for (const s2 of [1, -1]) { const p = P(t), n = Nrm(t), q = P(t + 0.12); line(c, [p, [(q[0] + p[0]) / 2 + n[0] * wd(t + 0.06) * 0.75 * s2, (q[1] + p[1]) / 2 + n[1] * wd(t + 0.06) * 0.75 * s2]], 3, COL.leafDk); }
  if (coated) {
    shape(c, whole, "rgba(255,252,215,0.30)", 0);
    const g = side(-sg * 1).filter((_, i) => i > 4 && i < 18).map((p, i) => { const t = (i + 5) / 26, q = P(t), n = Nrm(t); return [q[0] + n[0] * -sg * wd(t) * 0.5, q[1] + n[1] * -sg * wd(t) * 0.5]; });
    sheen(c, g, 12);
    const m = P(0.3), n = Nrm(0.3); sheen(c, [[m[0] + n[0] * sg * 20, m[1] + n[1] * sg * 20], [m[0] + n[0] * sg * 40, m[1] + n[1] * sg * 40]], 10);
  }
};

// ======================================================= e1
// setup.e1.0
const e1_0 = (c: Ctx) => { ground(c); threePlates(c, [[285, 320], [795, 320], [540, 770]], 235, 145); };
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e6d7b8"; c.fillRect(0, 820, D, 260);
  fan(c, 640, 190, 150); clock(c, 140, 160, 85, 0, Math.PI * 0.5);
  wind(c, [330, 540, 760, 940], 330, 560);
  threePlates(c, [[190, 730], [540, 730], [890, 730]], 168, 118);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const tissue = (x: number, y: number, s: number, rot: number, wet: boolean) => {
    c.save(); c.translate(x, y); c.rotate(rot);
    shadow(c, s * 0.06, s * 0.52, s * 0.55, s * 0.08);
    const p = () => rrect(c, -s / 2, -s / 2, s, s, s * 0.05);
    shape(c, p, WHITE, 6);
    if (wet) { c.save(); c.beginPath(); p(); c.clip(); shape(c, () => { c.moveTo(-s * 0.3, -s * 0.1); c.bezierCurveTo(-s * 0.3, -s * 0.5, s * 0.3, -s * 0.5, s * 0.35, -s * 0.05); c.bezierCurveTo(s * 0.5, s * 0.3, -s * 0.1, s * 0.6, -s * 0.3, s * 0.3); c.closePath(); }, "#a3cdee", 0); c.restore(); drop(c, -s * 0.05, 0, s * 0.07); drop(c, s * 0.15, s * 0.15, s * 0.05); c.beginPath(); p(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); }
    else line(c, [[-s * 0.4, -s * 0.15], [s * 0.4, -s * 0.15]], 3, COL.grey);
    c.restore();
  };
  tissue(190, 270, 230, -0.1, false); tissue(190, 640, 230, 0.08, true);
  plate(c, 690, 770, 330, 190); towelFlat(c, 690, 765, 340, 190);
  tissue(700, 710, 210, 0.12, false);
  armHand(c, 603, 530, 1.05, 2.0, true);
};

// ======================================================= e2
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  plate(c, 270, 520, 258, 195); plate(c, 810, 520, 258, 195);
  block(c, 270, 510, 84); spread(c, 810, 520, 72);
  write(c, "6", 240, 830, 130, INK, 14); write(c, "6", 780, 830, 130, INK, 14);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); clock(c, 540, 140, 95, Math.PI, Math.PI * 0.15);
  plate(c, 270, 650, 258, 195); plate(c, 810, 650, 258, 195);
  puddle(c, 270, 655, 150, 62); puddle(c, 810, 655, 225, 115);
  block(c, 270, 650, 54);
  cube(c, 730, 650, 24); cube(c, 880, 690, 20);
};
// setup.e2.2
const e2_2 = (c: Ctx) => { ground(c); glass(c, 290, 900, 340, 560, 0.3); glass(c, 790, 900, 340, 560, 0.72); };

// ======================================================= e3
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 880, 160, 26); shadow(c, 800, 880, 160, 26);
  leafBlade(c, [280, 960], [290, 830], [240, 560], [330, 300], 150, false);
  leafBlade(c, [780, 960], [790, 830], [840, 560], [750, 300], 150, true);
  // the open tub of jelly
  shadow(c, 560, 1010, 100, 18);
  shape(c, () => rrect(c, 455, 900, 210, 110, 16), "#e8f1f7", 6); shape(c, () => rrect(c, 455, 950, 210, 38, 6), COL.blue, 5);
  shape(c, () => ell(c, 560, 900, 105, 28), "#fff1b0", 6); sheen(c, [[500, 898], [560, 890]], 9);
  armHand(c, 890, 324, 2.0, 2.2, true);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); fan(c, 540, 150, 160); wind(c, [200, 400, 680, 880], 300, 540);
  plate(c, 540, 770, 450, 190);
  leafBlade(c, [140, 800], [200, 790], [330, 690], [470, 730], 120, false);
  leafBlade(c, [580, 800], [640, 790], [770, 690], [910, 730], 120, true);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  leafBlade(c, [240, 540], [400, 535], [680, 495], [1030, 540], 125, true);
  leafBlade(c, [240, 600], [330, 665], [470, 860], [360, 1050], 115, false);
  armHand(c, 95, 575, 0, 2.2);
};

export const su_habitatsAdaptations = cards("sci.habitats.adaptations.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
