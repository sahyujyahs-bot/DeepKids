import type { Ctx } from "./core";
import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, write } from "./flatKit";

// VERTEBRATE GROUPS L2 · picture cards. Flat DeepKids look. Animals seen from the side, nose to the right.
// Red = arrows, rings and the chain of backbone dots; numbers only with write(); no words.

const FISH = "#f08a4b", FISH_DK = "#d96a2f", FROG = "#6aa53f", FROG_DK = "#46752a", LIZ = "#c9a36b", LIZ_DK = "#9c7a45";
const BIRD = "#a9805a", BIRD_DK = "#7d5c3c", BELLY = "#ead9bb", COW = "#f4efe4", COW_DK = "#d8cfba", BEAK = "#f3b13c";
const BONE = "#f6efdc", BONE_DK = "#d9cdb0", PINK = "#f29ab4", WALL = "#f6efe0", DOUGH = "#f0d9a6", DOUGH_DK = "#d9bd82";

const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 3); shape(c, () => ell(c, x + r * 0.2, y, r * 0.5, r * 0.5), INK, 0); };
const lg = (c: Ctx, pts: number[][], col: string, w = 14) => { line(c, pts, w + 6, INK); line(c, pts, w, col); };
const ring = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); };
const table = (c: Ctx, y: number) => { c.fillStyle = COL.wood; c.fillRect(0, y, 1080, 1080 - y); c.fillStyle = COL.woodDk; c.fillRect(0, y, 1080, 14); line(c, [[0, y], [1080, y]], 6); };
// a chain of n white dots along a polyline, joined by a red line: the small bones of a backbone
const chain = (c: Ctx, v: number[][], n: number, r = 13) => {
  line(c, v, r * 0.6, RED); const seg: number[] = []; let tot = 0;
  for (let i = 1; i < v.length; i++) { const d = Math.hypot(v[i][0] - v[i - 1][0], v[i][1] - v[i - 1][1]); seg.push(d); tot += d; }
  for (let k = 0; k < n; k++) { let t = (tot * k) / (n - 1), i = 0; while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; } const f = Math.min(1, t / seg[i]); shape(c, () => ell(c, v[i][0] + (v[i + 1][0] - v[i][0]) * f, v[i][1] + (v[i + 1][1] - v[i][1]) * f, r, r), WHITE, Math.max(2, r * 0.3)); }
};
const spineAt = (c: Ctx, pts: number[][], s: number, n: number) => chain(c, pts, n, 13 / Math.max(1, s * 1.3));

type A = { flip?: boolean; spine?: boolean; col?: string; dk?: string; gill?: boolean };
const fish = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col ?? FISH, dk = o.dk ?? FISH_DK;
  shape(c, () => polyP(c, [[-90, 0], [-175, -58], [-150, 0], [-175, 58]]), dk);
  shape(c, () => polyP(c, [[-30, -55], [10, -105], [70, -50]]), dk);
  shape(c, () => polyP(c, [[-10, 55], [20, 95], [60, 52]]), dk);
  const body = () => { c.moveTo(-110, 0); c.bezierCurveTo(-60, -85, 90, -70, 140, 0); c.bezierCurveTo(90, 70, -60, 85, -110, 0); c.closePath(); };
  shape(c, body, col); shade(c, body, dk, 14, 16);
  for (let i = 0; i < 3; i++) for (let j = -1; j <= 1; j++) { c.beginPath(); c.arc(-40 + i * 28, j * 28 + (i % 2) * 8, 14, -0.9, 0.9); c.strokeStyle = dk; c.lineWidth = 3; c.stroke(); }
  eye(c, 100, -12, 13);
  line(c, [[138, 4], [118, 10]], 5);
  if (o.gill) {
    // the gill flap lifted: red comb-like gills underneath
    shape(c, () => ell(c, 40, 0, 36, 54), "#c93a3a", 5);
    for (let k = 0; k < 6; k++) line(c, [[62 - k * 6, -40], [52 - k * 6, 0], [62 - k * 6, 40]], 4, "#ffd0cb");
    shape(c, () => { c.moveTo(8, -52); c.quadraticCurveTo(-22, 0, 8, 52); c.quadraticCurveTo(22, 0, 8, -52); c.closePath(); }, col, 5);
  } else shape(c, () => { c.moveTo(62, -48); c.quadraticCurveTo(30, 0, 62, 48); c.quadraticCurveTo(84, 0, 62, -48); c.closePath(); }, col, 5);
  if (o.spine) spineAt(c, [[-105, -2], [-40, -8], [40, -10], [110, -6]], s, 9);
  c.restore();
};
const bird = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  for (const dx of [-12, 24]) { line(c, [[dx, 55], [dx, 108]], 9); line(c, [[dx, 108], [dx + 22, 112]], 8); line(c, [[dx, 108], [dx - 12, 116]], 8); }
  const col = o.col ?? BIRD, dk = o.dk ?? BIRD_DK;
  shape(c, () => polyP(c, [[-80, -5], [-170, 22], [-165, 50], [-75, 36]]), dk);
  const body = () => ell(c, 0, 0, 98, 72, -0.12);
  shape(c, body, col); shade(c, body, dk, 14, 14);
  shape(c, () => ell(c, 28, 28, 56, 36, -0.1), o.col ? col : BELLY, 0);
  shape(c, () => ell(c, -22, -4, 62, 38, 0.35), dk, 5);
  shape(c, () => ell(c, 88, -62, 40, 38), col); shade(c, () => ell(c, 88, -62, 40, 38), dk, 9, 9);
  shape(c, () => polyP(c, [[120, -66], [158, -54], [120, -44]]), BEAK, 5);
  eye(c, 98, -70, 9);
  if (o.spine) spineAt(c, [[84, -52], [40, -50], [0, -36], [-50, -18]], s, 6);
  c.restore();
};
const frog = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col ?? FROG, dk = o.dk ?? FROG_DK;
  lg(c, [[40, 20], [95, 62], [120, 78]], col, 18); line(c, [[120, 80], [150, 84]], 8);
  const body = () => ell(c, 0, 0, 105, 72, -0.1);
  shape(c, body, col); shade(c, body, dk, 14, 14);
  shape(c, () => ell(c, -42, 28, 62, 36, -0.5), col, 6); line(c, [[-70, 56], [-30, 74], [40, 78]], 12); line(c, [[-70, 56], [-30, 74], [40, 78]], 6, col); line(c, [[40, 78], [75, 82]], 8);
  shape(c, () => ell(c, 80, -22, 56, 42, -0.15), col); shade(c, () => ell(c, 80, -22, 56, 42, -0.15), dk, 8, 8);
  shape(c, () => ell(c, 92, -58, 22, 22), col); eye(c, 96, -60, 13);
  line(c, [[130, -12], [96, -4]], 4);
  if (o.spine) spineAt(c, [[70, -36], [30, -52], [-20, -48], [-62, -26]], s, 6);
  c.restore();
};
const lizard = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col ?? LIZ, dk = o.dk ?? LIZ_DK;
  const leg = (bx: number, by: number, kx: number, ky: number, fx: number, fy: number) => { lg(c, [[bx, by], [kx, ky], [fx, fy]], dk, 13); for (const d of [-12, 0, 12]) line(c, [[fx, fy], [fx + d * 1.2, fy + 12]], 6); };
  leg(-70, 12, -100, 50, -78, 62); leg(70, 12, 105, 48, 128, 62);
  const tail: number[][] = []; for (let i = 0; i <= 14; i++) { const t = i / 14; tail.push([-110 - t * 190, -4 + Math.sin(t * 3.2) * 24 + t * 20, 24 * (1 - t) + 4]); }
  for (const [tx, ty, r] of tail) shape(c, () => ell(c, tx, ty, r + 6, r + 6), INK, 0);
  for (const [tx, ty, r] of tail) shape(c, () => ell(c, tx, ty, r, r), col, 0);
  shape(c, () => ell(c, 0, 0, 125, 36), col); shade(c, () => ell(c, 0, 0, 125, 36), dk, 8, 12);
  leg(-40, 14, -62, 52, -30, 64); leg(100, 14, 80, 54, 104, 64);
  shape(c, () => ell(c, 140, -4, 56, 30, 0.08), col); shade(c, () => ell(c, 140, -4, 56, 30, 0.08), dk, 8, 8);
  eye(c, 152, -16, 9); line(c, [[188, 6], [160, 12]], 4);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, -60 + i * 28, -12, 6, 5), dk, 0);
  if (o.spine) spineAt(c, [[150, -12], [60, -8], [-40, -4], [-120, 0], [-200, 10], [-250, 22]], s, 10);
  c.restore();
};
const cow = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col ?? COW, dk = o.dk ?? COW_DK, L = 140;
  for (const lx of [-95, 85]) { shape(c, () => rrect(c, lx, 20, 34, L, 12), dk); shape(c, () => rrect(c, lx, 20 + L - 18, 34, 18, 6), INK, 0); }
  line(c, [[-130, -20], [-165, 10], [-160, 70]], 10); shape(c, () => ell(c, -160, 76, 11, 18), INK, 0);
  const body = () => rrect(c, -135, -70, 270, 115, 52);
  shape(c, body, col); shade(c, body, dk, 16, 16, 0.8);
  for (const lx of [-60, 120]) { shape(c, () => rrect(c, lx, 20, 36, L, 12), col); shape(c, () => rrect(c, lx, 20 + L - 18, 36, 18, 6), INK, 0); }
  shape(c, () => polyP(c, [[100, -60], [190, -40], [175, 40], [105, 5]]), col, 0);
  shape(c, () => ell(c, 175, -22, 54, 44, 0.35), col); shape(c, () => ell(c, 220, -2, 28, 24, 0.35), PINK, 5);
  shape(c, () => ell(c, 150, -70, 20, 12, -0.5), dk, 5);
  line(c, [[158, -58], [140, -75], [112, -82]], 12); line(c, [[158, -58], [140, -75], [112, -82]], 6, BONE);
  eye(c, 185, -36, 8);
  if (o.spine) spineAt(c, [[120, -58], [40, -58], [-40, -56], [-110, -48], [-150, -20]], s, 8);
  c.restore();
};
const kid = (c: Ctx, x: number, y: number, h: number, spine = false) => {
  person(c, x, y, h);
  if (spine) chain(c, [[x, y - h * 0.84], [x, y - h * 0.46]], 7, 11);
};

// a child seen from the side, facing right, feet at (x, y); torso leans forward by `bend` radians
const sideKid = (c: Ctx, x: number, y: number, h: number, bend: number, dots = true, tilt = 0) => {
  const hipY = y - h * 0.45, L = h * 0.3, d = [Math.sin(bend), -Math.cos(bend)], back = [-Math.cos(bend), -Math.sin(bend)];
  const sh = [x + d[0] * L, hipY + d[1] * L], hb = bend + tilt, hd = [Math.sin(hb), -Math.cos(hb)], hf = [Math.cos(hb), Math.sin(hb)], r = h * 0.095;
  const hc = [sh[0] + hd[0] * h * 0.15, sh[1] + hd[1] * h * 0.15];
  for (const lx of [-0.02, 0.05]) { lg(c, [[x + lx * h, hipY], [x + lx * h, y - 12]], "#6b5a8c", h * 0.075); shape(c, () => rrect(c, x + lx * h - h * 0.03, y - 20, h * 0.1, 20, 8), INK, 0); }
  lg(c, [[x, hipY], sh], CLOTH.child, h * 0.17);
  lg(c, [sh, [sh[0] + h * 0.03, sh[1] + h * 0.2]], CLOTH.childDk, h * 0.06);
  shape(c, () => ell(c, sh[0] + h * 0.03, sh[1] + h * 0.22, h * 0.032, h * 0.032), SKIN.child, 4);
  shape(c, () => ell(c, hc[0], hc[1], r, r * 1.05), SKIN.child);
  shape(c, () => ell(c, hc[0] + back[0] * r * 0.62, hc[1] + back[1] * r * 0.62, r * 0.55, r * 0.92), CLOTH.hair, 4);
  shape(c, () => ell(c, hc[0] + hf[0] * r * 0.5 + hd[0] * r * 0.05, hc[1] + hf[1] * r * 0.5 + hd[1] * r * 0.05, r * 0.11, r * 0.14), INK, 0);
  if (dots) chain(c, [[hc[0] + back[0] * r * 0.5 + hd[0] * -r * 0.2, hc[1] + back[1] * r * 0.5 + hd[1] * -r * 0.2], [sh[0] + back[0] * h * 0.06, sh[1] + back[1] * h * 0.06], [x + back[0] * h * 0.07, hipY + back[1] * h * 0.07]], 11, 10);
};

// a paper straw piece centred at (x, y), length len, thickness th, rotated rot
const straw = (c: Ctx, x: number, y: number, len: number, th: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -len / 2, -th / 2, len, th, th / 2.4);
  shape(c, p, WHITE, 6);
  c.save(); c.beginPath(); p(); c.clip();
  for (let sx = -len / 2 - th; sx < len / 2 + th; sx += th * 0.95) line(c, [[sx, th / 2 + 4], [sx + th * 0.6, -th / 2 - 4]], th * 0.3, COL.teal);
  c.restore(); shape(c, p, "rgba(0,0,0,0)", 6);
  c.restore();
};
const tumblerTop = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 20, y + 24, r, r); shape(c, () => ell(c, x, y, r, r), COL.steel); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), COL.steelIn, 4); };
// a vertebra seen at an angle: round bone with a ring-shaped hole, top face at (x, y)
const vertebra = (c: Ctx, x: number, y: number, rx: number, ry: number, hgt: number) => {
  shadow(c, x + rx * 0.1, y + hgt + ry * 0.9, rx, ry * 0.7);
  const body = () => { c.moveTo(x - rx, y); c.lineTo(x - rx, y + hgt); c.ellipse(x, y + hgt, rx, ry, 0, Math.PI, 0, true); c.lineTo(x + rx, y); c.closePath(); };
  shape(c, body, BONE); shade(c, body, BONE_DK, rx * 0.35, 0, 0.8);
  shape(c, () => rrect(c, x - rx * 0.16, y - ry - 52, rx * 0.32, 78, 16), BONE);
  shape(c, () => ell(c, x - rx * 1.12, y - 4, rx * 0.3, ry * 0.3), BONE); shape(c, () => ell(c, x + rx * 1.12, y - 4, rx * 0.3, ry * 0.3), BONE);
  shape(c, () => ell(c, x, y, rx, ry), BONE);
  shape(c, () => ell(c, x, y, rx * 0.42, ry * 0.46), "#5a4a52", 5);
  shape(c, () => ell(c, x, y + ry * 0.1, rx * 0.2, ry * 0.2), "#f4d2d8", 0);
};

// ---------------------------------------------------------------- flows
const f_e1 = (c: Ctx) => {
  ground(c, WALL);
  tumblerTop(c, 290, 520, 150); tumblerTop(c, 790, 520, 150);
  straw(c, 290, 520 - 150 - 18, 540, 36, 0);
  const R = 168;
  for (let i = 0; i < 8; i++) { const a = Math.PI + (Math.PI / 8) * (i + 0.5); straw(c, 790 + R * Math.cos(a), 520 + R * Math.sin(a), 62, 34, a + Math.PI / 2); }
  ring(c, 290, 352, 30);
  write(c, "1", 262, 780, 150, INK, 14); write(c, "8", 762, 780, 150, INK, 14);
};
const f_e2 = (c: Ctx) => {
  ground(c, WALL);
  const dots = [COL.blue, COL.soil, COL.red, COL.yellow];
  const mats: [number, number[]][] = [[0, [0, 1, 2, 3, 1, 0]], [1, [1, 3, 0, 0, 2, 3]], [2, [2, 2, 2, 2, 2, 2]]];
  mats.forEach(([m, ds]) => {
    const mx = 70 + m * 320;
    shape(c, () => rrect(c, mx, 110, 290, 860, 30), "#c7dcc2", 6);
    if (m === 0) for (let i = 0; i < 3; i++) { const pts = Array.from({ length: 13 }, (_, k) => [mx + 80 + k * 10, 180 + i * 22 + 8 * Math.sin(k * 1.1)]); line(c, pts, 12, INK); line(c, pts, 6, COL.blue); }
    if (m === 1) { arrow(c, [[mx + 70, 215], [mx + 140, 165], [mx + 220, 200]], RED, 9); }
    if (m === 2) for (let r = 0; r < 2; r++) for (let k = 0; k < 4 - (r % 2); k++) { const sx = mx + 60 + k * 56 + (r % 2) * 28, sy = 200 + r * 36; shape(c, () => { c.moveTo(sx - 28, sy - 16); c.arc(sx, sy - 16, 28, Math.PI, 0, true); c.closePath(); }, COL.greenLt, 4); }
    ds.forEach((d, i) => {
      const cx = mx + 38 + (i % 2) * 120, cy = 300 + Math.floor(i / 2) * 215;
      shadow(c, cx + 60, cy + 175, 70, 10);
      shape(c, () => rrect(c, cx, cy, 110, 180, 10), COL.cloth, 5);
      shape(c, () => ell(c, cx + 55, cy + 90, 28, 28), dots[d], 5);
    });
  });
};
const f_a1 = (c: Ctx) => {
  ground(c, WALL);
  sideKid(c, 640, 940, 820, 0, true, 0.0);
  ring(c, 625, 268, 62);
  hand(c, 400, 300, 0.05, 1.7, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[830, 160], [900, 215], [900, 290]], RED, 10);
};
const f_a3 = (c: Ctx) => {
  ground(c, WALL); table(c, 880);
  shadow(c, 570, 890, 440, 30);
  shape(c, () => ell(c, 540, 560, 450, 280), COL.steel); shape(c, () => ell(c, 540, 556, 390, 238), COL.steelIn, 4);
  const sy = 560;
  for (let i = 0; i < 17; i++) { const x = 270 + i * 34, hh = 54 - i * 1.4, len = 150 * (1 - i / 22);
    if (i < 14) for (const sgn of [-1, 1]) { line(c, [[x, sy + sgn * 20], [x + 26, sy + sgn * (20 + len * 0.7)], [x + 62, sy + sgn * (20 + len)]], 8, INK); line(c, [[x, sy + sgn * 20], [x + 26, sy + sgn * (20 + len * 0.7)], [x + 62, sy + sgn * (20 + len)]], 3.5, BONE); } }
  for (let k = -3; k <= 3; k++) line(c, [[850, sy], [930, sy + k * 28]], 7, INK);
  for (let k = -3; k <= 3; k++) line(c, [[850, sy], [930, sy + k * 28]], 3, BONE);
  for (let i = 0; i < 17; i++) { const x = 270 + i * 34, hh = 54 - i * 1.5; shape(c, () => rrect(c, x - 13, sy - hh / 2, 26, hh, 9), BONE, 5); }
  shape(c, () => { c.moveTo(150, sy - 6); c.bezierCurveTo(160, sy - 90, 250, sy - 80, 262, sy - 20); c.lineTo(262, sy + 20); c.bezierCurveTo(250, sy + 80, 160, sy + 90, 150, sy + 40); c.closePath(); }, BONE, 6);
  shape(c, () => ell(c, 205, sy - 18, 17, 17), "#5a4a52", 4);
  ring(c, 270 + 7 * 34, sy, 40);
};
const f_a4 = (c: Ctx) => {
  ground(c, WALL);
  const fing: [number, number, number, number, (x: number, y: number) => void][] = [
    [425, 700, -0.62, 250, (x, y) => cow(c, x, y, 0.46)], [495, 680, -0.3, 300, (x, y) => bird(c, x, y, 0.5)],
    [565, 670, 0, 330, (x, y) => lizard(c, x, y, 0.5)], [635, 680, 0.3, 290, (x, y) => frog(c, x, y, 0.62)], [705, 810, 0.95, 190, (x, y) => fish(c, x, y, 0.5)],
  ];
  shadow(c, 560, 1020, 300, 22);
  fing.forEach(([bx, by, an, len]) => { const tip = [bx + Math.sin(an) * len, by - Math.cos(an) * len]; line(c, [[bx, by], tip], 66, INK); line(c, [[bx, by], tip], 54, SKIN.child); });
  shape(c, () => { c.moveTo(385, 700); c.lineTo(690, 680); c.quadraticCurveTo(750, 800, 700, 930); c.quadraticCurveTo(550, 1030, 410, 960); c.quadraticCurveTo(360, 820, 385, 700); c.closePath(); }, SKIN.child, 6);
  fing.forEach(([bx, by, an, len, draw]) => { draw(bx + Math.sin(an) * (len + 130), by - Math.cos(an) * (len + 130) + (an > 0.9 ? 30 : 0)); });
};
const f_p1 = (c: Ctx) => {
  ground(c, WALL);
  const D = { col: DOUGH, dk: DOUGH_DK, spine: true };
  shadow(c, 200, 600, 140, 16); shadow(c, 560, 600, 190, 16); shadow(c, 880, 640, 120, 16);
  fish(c, 200, 400, 0.75, D); bird(c, 560, 380, 0.85, D);
  frog(c, 270, 800, 0.95, D); lizard(c, 760, 820, 0.8, D);
  const px = 900, py = 400;
  for (const sx of [-1, 1]) { lg(c, [[px + sx * 28, py + 100], [px + sx * 32, py + 220]], DOUGH, 44); lg(c, [[px + sx * 60, py - 40], [px + sx * 96, py + 100]], DOUGH, 34); }
  shape(c, () => rrect(c, px - 66, py - 120, 132, 240, 40), DOUGH); shape(c, () => ell(c, px, py - 190, 56, 58), DOUGH);
  shape(c, () => ell(c, px - 20, py - 196, 6, 8), INK, 0); shape(c, () => ell(c, px + 20, py - 196, 6, 8), INK, 0);
  chain(c, [[px, py - 130], [px, py + 90]], 7, 12);
};
const f_c1 = (c: Ctx) => {
  ground(c, WALL); table(c, 860);
  // left: flopped over on loose wool
  const angs = [0, 0.08, 0.5, 0.95, 1.35, 1.75, 2.1, 2.4];
  let p = [250, 830];
  line(c, [[130, 845], [420, 845]], 8, COL.purple);
  angs.forEach((a) => { const d = [Math.sin(a), -Math.cos(a)], len = 82; straw(c, p[0] + d[0] * len / 2, p[1] + d[1] * len / 2, len, 34, Math.atan2(d[1], d[0])); p = [p[0] + d[0] * (len + 4), p[1] + d[1] * (len + 4)]; });
  shape(c, () => ell(c, 440, 836, 38, 14), COL.yellow, 5);
  // right: standing with a coin on top
  for (let i = 0; i < 8; i++) straw(c, 790, 820 - i * 82, 76, 34, Math.PI / 2);
  line(c, [[790, 840], [790, 220]], 5, COL.purple);
  shape(c, () => ell(c, 790, 175, 52, 18), COL.yellow, 6); shape(c, () => ell(c, 790, 172, 30, 9), COL.orange, 3);
  arrow(c, [[930, 700], [930, 440]], RED, 10);
};

// ---------------------------------------------------------------- terms
const t_backbone = (c: Ctx) => { ground(c, WALL); sideKid(c, 400, 930, 800, 1.2, true, 0.1); };
const t_vertebra = (c: Ctx) => {
  ground(c, WALL);
  vertebra(c, 540, 770, 190, 62, 70); vertebra(c, 540, 530, 190, 62, 70); vertebra(c, 540, 290, 190, 62, 70);
  for (const y of [425, 665]) shape(c, () => rrect(c, 410, y, 260, 34, 14), PINK, 5);
};
const t_vertebrate = (c: Ctx) => {
  ground(c, WALL); table(c, 800);
  shape(c, () => rrect(c, 30, 420, 320, 260, 40), "#bfe0f5", 5);
  fish(c, 195, 550, 0.7, { spine: true, col: "#f5b41f", dk: "#d98f12" });
  frog(c, 450, 728, 0.8, { spine: true });
  bird(c, 700, 708, 0.75, { spine: true });
  kid(c, 930, 790, 600, true);
};
const t_gills = (c: Ctx) => {
  ground(c, "#bfe0f5");
  fish(c, 500, 560, 2.5, { gill: true });
  arrow(c, [[900, 450], [850, 540]], COL.blue, 12); arrow(c, [[640, 700], [600, 800]], COL.blue, 12);
};
const t_tadpole = (c: Ctx) => {
  ground(c, "#bfe0f5");
  const tad = (x: number, y: number, s: number, rot: number) => {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    const tail = Array.from({ length: 13 }, (_, i) => [-40 - i * 15, Math.sin(i * 0.7) * (6 + i * 1.8)]);
    line(c, tail, 30, INK); line(c, tail, 20, "#3d3a3f");
    shape(c, () => ell(c, 0, 0, 62, 48), "#4a4650"); shade(c, () => ell(c, 0, 0, 62, 48), "#2a272d", 12, 12);
    shape(c, () => ell(c, 30, -18, 9, 9), WHITE, 3); shape(c, () => ell(c, 32, -18, 4, 4), INK, 0);
    c.restore();
  };
  tad(640, 470, 2.0, 0.1); tad(460, 740, 1.2, -0.25); tad(790, 800, 1.1, 0.15); tad(300, 330, 0.9, 0.3);
  shape(c, () => { c.moveTo(0, 940); c.quadraticCurveTo(540, 880, 1080, 940); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, "#d9bd82", 0);
  line(c, [[0, 940], [540, 910], [1080, 940]], 6);
  for (const [x, y, r] of [[160, 990, 40], [470, 1010, 30], [800, 990, 46]]) shape(c, () => ell(c, x, y, r, r * 0.7), COL.steelDk, 5);
};
const t_scales = (c: Ctx) => {
  ground(c, WALL);
  // fish scales (round, overlapping) on the left, snake scales (diamonds in rows) on the right
  const clipPanel = (x: number, fill: string, draw: () => void) => { shape(c, () => rrect(c, x, 330, 440, 560, 40), fill, 6); c.save(); c.beginPath(); rrect(c, x, 330, 440, 560, 40); c.clip(); draw(); c.restore(); shape(c, () => rrect(c, x, 330, 440, 560, 40), "rgba(0,0,0,0)", 6); };
  clipPanel(60, "#f2b27a", () => { for (let r = 0; r < 9; r++) for (let k = 0; k < 6; k++) { const sx = 60 + 10 + k * 80 + (r % 2) * 40, sy = 350 + r * 62; shape(c, () => { c.moveTo(sx - 46, sy - 10); c.arc(sx, sy - 10, 46, Math.PI, 0, true); c.closePath(); }, (r + k) % 2 ? "#f08a4b" : "#f4a066", 4); } });
  clipPanel(580, "#8fbf6a", () => { for (let r = 0; r < 12; r++) for (let k = 0; k < 6; k++) { const sx = 590 + k * 80 + (r % 2) * 40, sy = 350 + r * 50; shape(c, () => polyP(c, [[sx, sy - 30], [sx + 36, sy], [sx, sy + 30], [sx - 36, sy]]), (r + k) % 2 ? COL.green : COL.greenDk, 4); } });
  fish(c, 280, 215, 0.55);
  const sn = Array.from({ length: 30 }, (_, i) => [630 + i * 12, 215 + 22 * Math.sin(i * 0.55)]);
  line(c, sn, 40, INK); line(c, sn, 28, COL.green); shape(c, () => ell(c, 984, sn[29][1], 24, 18), COL.green, 5); shape(c, () => ell(c, 990, sn[29][1] - 5, 4, 4), INK, 0);
};

// ---------------------------------------------------------------- explanations
const e_backbone = (c: Ctx) => {
  ground(c, WALL);
  // skull, then a chain of small bones curving down to the hips
  const path = (t: number) => [470 + 60 * Math.sin(t * Math.PI * 2) * 0.9 - 20 * t, 230 + t * 560];
  const n = 18;
  shape(c, () => ell(c, 500, 130, 78, 70), BONE, 6); shape(c, () => rrect(c, 520, 160, 80, 50, 18), BONE, 6);
  shape(c, () => ell(c, 530, 120, 17, 17), "#5a4a52", 4);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), [x, y] = path(t), [x2, y2] = path(Math.min(1, t + 0.02)), a = Math.atan2(y2 - y, x2 - x) - Math.PI / 2, w = 44 + t * 54, h = 28 + t * 8;
    c.save(); c.translate(x, y); c.rotate(a);
    if (i) shape(c, () => rrect(c, -w * 0.4, -h * 0.9, w * 0.8, h * 0.5, 8), PINK, 4);
    shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 12), BONE, 5);
    c.restore();
  }
  const [hx, hy] = path(1);
  shape(c, () => { c.moveTo(hx - 190, hy - 20); c.quadraticCurveTo(hx - 190, hy + 80, hx - 60, hy + 100); c.lineTo(hx + 60, hy + 100); c.quadraticCurveTo(hx + 190, hy + 80, hx + 190, hy - 20); c.quadraticCurveTo(hx + 120, hy - 60, hx, hy - 30); c.quadraticCurveTo(hx - 120, hy - 60, hx - 190, hy - 20); c.closePath(); }, BONE, 6);
  shape(c, () => ell(c, hx - 100, hy + 20, 30, 34), "#5a4a52", 4); shape(c, () => ell(c, hx + 100, hy + 20, 30, 34), "#5a4a52", 4);
};
const ant = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const dx of [-30, 0, 30]) { line(c, [[dx, 0], [dx - 15, 38], [dx - 22, 62]], 8); line(c, [[dx, 0], [dx - 15, -38], [dx - 22, -62]], 8); }
  shape(c, () => ell(c, -78, 0, 50, 36), "#6b3d2a"); shape(c, () => ell(c, -4, 0, 28, 24), "#6b3d2a"); shape(c, () => ell(c, 66, -4, 34, 30), "#6b3d2a");
  line(c, [[90, -26], [118, -62], [146, -58]], 6); line(c, [[96, -16], [130, -40], [158, -30]], 6);
  shape(c, () => ell(c, 76, -10, 6, 6), WHITE, 0);
  c.restore();
};
const prawn = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = Array.from({ length: 7 }, (_, i) => { const t = 0.25 + i * 0.4; return [150 * Math.cos(t), -170 * Math.sin(t) + 30, 54 - i * 3.5]; });
  for (const [bx, by] of body.slice(0, 6)) line(c, [[bx + 4, by + 30], [bx - 4, by + 80]], 8);
  const [lx, ly] = body[6];
  shape(c, () => polyP(c, [[lx - 10, ly - 10], [lx - 100, ly + 10], [lx - 80, ly + 90], [lx + 10, ly + 50]]), "#e07a3c", 5);
  body.slice().reverse().forEach(([bx, by, r], k) => shape(c, () => ell(c, bx, by, r, r * 0.9), k % 2 ? "#f0904f" : "#f4a76a", 5));
  line(c, [[165, -20], [260, -120], [340, -130]], 6, INK); line(c, [[170, -10], [290, -50], [350, 0]], 6, INK);
  shape(c, () => ell(c, 150, -4, 9, 9), INK, 0);
  c.restore();
};
const e_inverts = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 40, 120, 480, 840, 36), "#e5ecdd", 5); shape(c, () => rrect(c, 560, 120, 480, 840, 36), "#f3e3d0", 5);
  bird(c, 250, 420, 0.8, { spine: true }); cow(c, 280, 720, 0.6, { spine: true });
  ant(c, 800, 420, 1.0); prawn(c, 740, 860, 0.68);
};
const e_pangolin = (c: Ctx) => {
  ground(c, WALL); table(c, 860);
  const SC = "#a47b52", SC_DK = "#7d5c3c", SKINC = "#cfae88";
  shadow(c, 520, 880, 430, 26);
  c.save(); c.translate(520, 560);
  for (const lx of [-170, 60, 150]) { shape(c, () => rrect(c, lx, 60, 52, 190, 18), SKINC); shape(c, () => rrect(c, lx - 4, 230, 66, 26, 10), INK, 0); for (const d of [8, 28, 48]) line(c, [[lx + d, 252], [lx + d + 10, 272]], 6); }
  const tail = [[-250, 0], [-360, 20], [-430, 90], [-440, 190]];
  line(c, tail, 96, INK); line(c, tail, 84, SC);
  const body = () => { c.moveTo(-270, -20); c.bezierCurveTo(-230, -190, 150, -210, 250, -90); c.bezierCurveTo(300, -40, 290, 60, 210, 90); c.bezierCurveTo(60, 130, -230, 120, -270, -20); c.closePath(); };
  shape(c, body, SC); shade(c, body, SC_DK, 22, 26, 0.7);
  c.save(); c.beginPath(); body(); c.clip();
  for (let r = 0; r < 6; r++) for (let k = 0; k < 11; k++) { const sx = -250 + k * 52 + (r % 2) * 26, sy = -170 + r * 46; shape(c, () => { c.moveTo(sx - 28, sy); c.quadraticCurveTo(sx, sy + 64, sx + 28, sy); c.quadraticCurveTo(sx, sy + 10, sx - 28, sy); c.closePath(); }, (r + k) % 2 ? "#b88e63" : "#9a7048", 3.5); }
  c.restore();
  shape(c, () => ell(c, 285, 20, 52, 44), SKINC); shape(c, () => polyP(c, [[310, 0], [420, 36], [310, 56]]), SKINC);
  shape(c, () => ell(c, 330, 4, 8, 8), INK, 0);
  c.restore();
  // the baby holds on near the end of her tail
  c.save(); c.translate(130, 470); c.scale(0.5, 0.5);
  const bb = () => ell(c, 0, 0, 200, 110, -0.1); shape(c, bb, "#dcc09a", 10);
  for (let k = 0; k < 6; k++) shape(c, () => { c.moveTo(-150 + k * 52, -70); c.quadraticCurveTo(-125 + k * 52, 20, -100 + k * 52, -70); c.closePath(); }, "#b58b5e", 6);
  shape(c, () => ell(c, 200, 10, 70, 60), "#efd9b8", 10); shape(c, () => polyP(c, [[230, 0], [340, 36], [230, 66]]), "#efd9b8", 10);
  shape(c, () => ell(c, 240, -4, 12, 12), INK, 0);
  c.restore();
};
const shark = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[-100, 0], [-190, -90], [-160, 0], [-190, 40]]), "#7d8a99");
  shape(c, () => polyP(c, [[-30, -48], [20, -130], [60, -44]]), "#7d8a99");
  const bd = () => { c.moveTo(-120, 0); c.bezierCurveTo(-40, -75, 100, -60, 190, 20); c.bezierCurveTo(90, 60, -50, 60, -120, 0); c.closePath(); };
  shape(c, bd, "#98a7b6"); shade(c, bd, "#7d8a99", 14, 16);
  for (const k of [0, 1, 2]) line(c, [[60 - k * 14, -28], [50 - k * 14, 4]], 4);
  eye(c, 120, -6, 11);
  c.restore();
};
const croc = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const tail = Array.from({ length: 12 }, (_, i) => [-100 - i * 24, 8 + Math.sin(i * 0.6) * 14, 36 - i * 2.6]);
  for (const [tx, ty, r] of tail) shape(c, () => ell(c, tx, ty, r + 6, r + 6), INK, 0);
  for (const [tx, ty, r] of tail) shape(c, () => ell(c, tx, ty, r, r), "#6b8a4a", 0);
  for (const lx of [-70, 70]) { lg(c, [[lx, 20], [lx + 10, 62], [lx, 74]], "#587a3a", 22); }
  shape(c, () => ell(c, 0, 0, 130, 46), "#6b8a4a"); shade(c, () => ell(c, 0, 0, 130, 46), "#587a3a", 8, 12);
  shape(c, () => rrect(c, 100, -26, 190, 46, 18), "#6b8a4a"); shape(c, () => ell(c, 130, -34, 12, 12), WHITE, 3);
  for (let i = 0; i < 6; i++) shape(c, () => polyP(c, [[-90 + i * 36, -40], [-76 + i * 36, -62], [-62 + i * 36, -40]]), "#587a3a", 4);
  line(c, [[130, 8], [290, 8]], 4);
  c.restore();
};
const e_tree = (c: Ctx) => {
  ground(c, WALL);
  const br = (a: number[], b: number[], w: number) => { const p = () => { c.beginPath(); c.moveTo(a[0], a[1]); c.bezierCurveTo((a[0] + b[0]) / 2, a[1], (a[0] + b[0]) / 2, b[1], b[0], b[1]); }; p(); c.strokeStyle = INK; c.lineWidth = w + 8; c.lineCap = "round"; c.stroke(); p(); c.strokeStyle = COL.woodDk; c.lineWidth = w; c.stroke(); };
  const ys = [110, 250, 390, 530, 670, 810, 950], tips = ys.map((y) => [740, y]);
  const root = [60, 540], fishN = [260, 180], landN = [260, 740], amN = [400, 800], sauN = [480, 600], cbN = [560, 740];
  br(root, fishN, 24); br(root, landN, 24); br(fishN, tips[0], 14); br(fishN, tips[1], 14);
  br(landN, tips[2], 14); br(landN, amN, 20); br(amN, tips[6], 14); br(amN, sauN, 18); br(sauN, tips[3], 14); br(sauN, cbN, 16); br(cbN, tips[4], 12); br(cbN, tips[5], 12);
  for (const n of [fishN, landN, amN, sauN, cbN]) shape(c, () => ell(c, n[0], n[1], 14, 14), COL.woodDk, 5);
  shark(c, 900, ys[0], 0.42); fish(c, 880, ys[1], 0.5); frog(c, 880, ys[2], 0.62); lizard(c, 935, ys[3], 0.42); croc(c, 840, ys[4], 0.4); bird(c, 880, ys[5] - 16, 0.45); cow(c, 850, ys[6] - 50, 0.4);
};

export const ic_animalsVertebrateGroupsL2 = cards("sci.animals.vertebrate-groups.L2 cards", [
  f_e1, f_e2, f_a1, f_a3, f_a4, f_p1, f_c1, t_backbone, t_vertebra, t_vertebrate, t_gills, t_tadpole, t_scales, e_backbone, e_inverts, e_pangolin, e_tree,
]);
