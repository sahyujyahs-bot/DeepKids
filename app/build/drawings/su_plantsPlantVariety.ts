import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, write, cards, rnd, plate, leaf } from "./flatKit";

// PLANT VARIETY L3 · set-up cards: stem tests, shade thermometer, smell test.

const PAPER = "#f1ecdf", TWIG = "#8a5a3c", TWIGDK = "#6a4128", WOODIN = "#f3d9a0";
const smooth = (p: number[][], n = 14) => {
  const o: number[][] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], e = p[i + 1], d = p[Math.min(p.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; o.push([0, 1].map((j) => 0.5 * (2 * b[j] + (-a[j] + e[j]) * t + (2 * a[j] - 5 * b[j] + 4 * e[j] - d[j]) * t2 + (-a[j] + 3 * b[j] - 3 * e[j] + d[j]) * t3))); }
  }
  o.push(p[p.length - 1]);
  return o;
};
// shade on the lower right of a shape
const sd = (c: Ctx, path: () => void, col: string, dx: number, dy: number, alpha = 0.55) => shade(c, path, col, -dx, -dy, alpha);
// a stem: ink outline, flat colour, a darker strip on the lower side
const stalk = (c: Ctx, pts: number[][], w: number, col: string, dk: string, sm = false) => {
  const p = sm ? smooth(pts) : pts;
  line(c, p, w + 10, INK); line(c, p, w, col); line(c, p.map(([x, y]) => [x + w * 0.1, y + w * 0.22]), w * 0.3, dk);
};
const cutEnd = (c: Ctx, x: number, y: number, rx: number, ry: number) => shape(c, () => ell(c, x, y, rx, ry), WOODIN, 4);
const heart = (c: Ctx, x: number, y: number, s: number, an: number, col: string = COL.leaf) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => { c.moveTo(0, 0); c.bezierCurveTo(-0.1 * s, -0.75 * s, 0.85 * s, -0.8 * s, s, 0); c.bezierCurveTo(0.85 * s, 0.8 * s, -0.1 * s, 0.75 * s, 0, 0); c.closePath(); }, col, 5);
  line(c, [[0.05 * s, 0], [0.8 * s, 0]], 3, COL.leafDk);
  c.restore();
};
// a toothed (serrated) leaf, base at (x, y), pointing along an
const toothed = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.green, wd = 0.34) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const w = len * wd, N = 44;
  const path = () => {
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2, f = i % 2 ? 1.09 : 1, px = len * (0.5 - 0.5 * Math.cos(t)), py = w * Math.sin(t) * (1 - 0.45 * (px / len));
      const X = len * 0.5 + (px - len * 0.5) * f, Y = py * f;
      if (i) c.lineTo(X, Y); else c.moveTo(X, Y);
    }
    c.closePath();
  };
  shape(c, path, col, 5);
  sd(c, path, COL.greenDk, 0, w * 0.35, 0.45);
  line(c, [[len * 0.04, 0], [len * 0.92, 0]], 4, COL.greenDk);
  for (const k of [0.25, 0.45, 0.65]) { line(c, [[len * k, 0], [len * (k + 0.14), -w * 0.62]], 3, COL.greenDk); line(c, [[len * k, 0], [len * (k + 0.14), w * 0.62]], 3, COL.greenDk); }
  c.restore();
};
const scallop = (c: Ctx, x: number, y: number, r: number, n: number, col: string) => {
  const path = () => { for (let i = 0; i <= 60; i++) { const t = (i / 60) * Math.PI * 2, k = r * (1 + 0.16 * Math.cos(t * n)); if (i) c.lineTo(x + Math.cos(t) * k, y + Math.sin(t) * k); else c.moveTo(x + k, y); } c.closePath(); };
  shape(c, path, col, 5); sd(c, path, COL.leafDk, r * 0.3, r * 0.3, 0.3);
};
const mirrorHand = (c: Ctx, x: number, y: number, an: number, s: number) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, an, s); c.restore(); };
const smell = (c: Ctx, x: number, y: number, h: number, w = 10) => {
  const p: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; p.push([x + Math.sin(t * Math.PI * 3) * h * 0.1 * (0.4 + t), y - t * h]); }
  line(c, p, w, COL.tealDk);
};

// ---------------------------------------------------------------- experiment 1: the stem test
// the newspaper sheet and four stems
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[70, 150], [1010, 165], [995, 935], [85, 920]]), PAPER, 6);
  c.fillStyle = "rgba(43,35,64,0.18)";
  for (let r = 0; r < 14; r++) { const y = 190 + r * 52; if (y > 880) break; c.fillRect(110, y + (r % 2) * 6, 380 + ((r * 97) % 200), 12); c.fillRect(560, y, 360 - ((r * 61) % 120), 12); }
  // 1 twig
  const ty = 280;
  stalk(c, [[150, ty], [900, ty - 14]], 38, TWIG, TWIGDK);
  stalk(c, [[390, ty - 4], [440, ty - 70]], 16, TWIG, TWIGDK); stalk(c, [[640, ty - 9], [600, ty - 66]], 14, TWIG, TWIGDK);
  cutEnd(c, 150, ty, 10, 20); cutEnd(c, 900, ty - 14, 10, 20);
  for (const x of [250, 330, 520, 720, 800]) line(c, [[x, ty - 8], [x + 12, ty + 4]], 4, TWIGDK);
  // 2 mint
  const my = 450;
  stalk(c, [[150, my], [830, my]], 26, COL.green, COL.greenDk);
  for (const x of [250, 400, 550, 700]) { toothed(c, x, my, 100, -0.95); toothed(c, x, my, 100, 0.95); }
  toothed(c, 830, my, 80, 0, COL.green);
  // 3 methi
  const hy = 620;
  stalk(c, [[140, hy], [780, hy - 6]], 14, COL.greenLt, COL.green);
  [260, 360, 460, 560, 660].forEach((x, k) => {
    const dir = k % 2 ? 1 : -1;
    line(c, [[x, hy], [x + 8, hy + dir * 30]], 5, INK); line(c, [[x, hy], [x + 8, hy + dir * 30]], 3, COL.greenLt);
    for (const [dx, dy, rot] of [[0, 62, 0], [-24, 42, -0.7], [30, 44, 0.7]]) shape(c, () => ell(c, x + 8 + dx, hy + dir * dy, 17, 25, rot * dir), COL.greenLt, 4);
  });
  shape(c, () => ell(c, 800, hy - 6, 17, 25, 1.5), COL.greenLt, 4);
  // 4 money plant: longest, wavy
  const wp: number[][] = []; for (let i = 0; i <= 12; i++) wp.push([110 + i * 73, 790 + Math.sin(i * 0.9) * 14]);
  stalk(c, wp, 22, COL.leafDk, "#2a5a25", true);
  [200, 330, 460, 590, 720, 850].forEach((x, k) => { const y = 790 + Math.sin(((x - 110) / 73) * 0.9) * 14; heart(c, x, y, 92, k % 2 ? 1.25 : -1.25, COL.leaf); });
  heart(c, 985, 790 + Math.sin(12 * 0.9) * 14, 80, 0, COL.leaf);
};

// a thumb pressing a dent into a green stalk
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 460, 36);
  const body = () => { c.moveTo(110, 640); c.lineTo(420, 640); c.quadraticCurveTo(505, 650, 540, 704); c.quadraticCurveTo(575, 650, 660, 640); c.lineTo(950, 640); c.arcTo(1010, 640, 1010, 720, 80); c.arcTo(1010, 800, 950, 800, 80); c.lineTo(110, 800); c.arcTo(50, 800, 50, 720, 80); c.arcTo(50, 640, 110, 640, 80); c.closePath(); };
  shape(c, body, COL.green, 6); sd(c, body, COL.greenDk, 0, 36, 0.5);
  for (const y of [690, 740]) { line(c, [[110, y], [400, y]], 4, COL.greenLt); line(c, [[690, y], [950, y]], 4, COL.greenLt); }
  leaf(c, 150, 650, 190, -2.35); leaf(c, 130, 700, 170, 2.6);
  // hand: thumb first, palm over its root
  const thumb = [[470, 300], [520, 590]];
  line(c, thumb, 126, INK); line(c, thumb, 112, SKIN.child);
  line(c, [[536, 330], [566, 575]], 26, SKIN.childDk);
  shape(c, () => ell(c, 553, 548, 22, 40, 0.17), "#ecc1a4", 4);
  shape(c, () => rrect(c, 380, -30, 300, 170, 14), CLOTH.child, 6);
  shape(c, () => rrect(c, 360, 120, 320, 230, 70), SKIN.child, 6);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 600, 140 + k * 52, 190 - Math.abs(k - 1.3) * 14, 50, 25), SKIN.child, 5);
  arrow(c, [[250, 330], [250, 540]]);
};

// two hands snapping a twig, and a soft stalk flopping over
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 612], [1040, 612]], 6, INK);
  // top: the twig breaks at the top of its arch, hands grip below it
  const L = [[160, 400], [498, 298]], R = [[582, 298], [920, 400]];
  stalk(c, L, 40, TWIG, TWIGDK); stalk(c, R, 40, TWIG, TWIGDK);
  for (const [bx, by, sg] of [[498, 298, 1], [582, 298, -1]]) {
    shape(c, () => polyP(c, [[bx, by - 30], [bx + sg * 12, by - 14], [bx + sg * 36, by - 22], [bx + sg * 18, by - 2], [bx + sg * 40, by + 14], [bx + sg * 8, by + 20], [bx + sg * 4, by + 30], [bx - sg * 14, by + 14], [bx - sg * 20, by - 14]]), WOODIN, 4);
  }
  line(c, [[540, 215], [540, 170]], 7, INK); line(c, [[478, 232], [450, 196]], 7, INK); line(c, [[602, 232], [630, 196]], 7, INK);
  hand(c, 260, 480, -Math.PI / 2, 1.5); mirrorHand(c, 820, 480, -Math.PI / 2, 1.5);
  arrow(c, [[90, 350], [90, 500]]); arrow(c, [[990, 350], [990, 500]]);
  // bottom: soft stalk held at its base droops over
  const st = [[300, 880], [300, 800], [340, 720], [450, 685], [560, 730], [600, 820]];
  stalk(c, st, 34, COL.green, COL.greenDk, true);
  leaf(c, 306, 790, 120, -2.6); leaf(c, 318, 750, 120, -0.5);
  leaf(c, 598, 810, 130, 1.75); leaf(c, 560, 732, 110, 0.5);
  hand(c, 300, 960, -Math.PI / 2, 1.5);
  arrow(c, [[760, 720], [760, 880]]);
};

// holding a stem by its bottom end: the twig stands, the soft stalk droops
// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  stalk(c, [[270, 880], [270, 220]], 38, TWIG, TWIGDK);
  stalk(c, [[270, 470], [330, 390]], 16, TWIG, TWIGDK); stalk(c, [[270, 600], [210, 530]], 16, TWIG, TWIGDK);
  cutEnd(c, 270, 220, 11, 19);
  const st = [[810, 880], [810, 620], [828, 480], [890, 410], [960, 450], [975, 570]];
  stalk(c, st, 32, COL.green, COL.greenDk, true);
  leaf(c, 812, 700, 130, -0.5); leaf(c, 815, 600, 130, -2.55);
  leaf(c, 975, 565, 120, 1.7);
  hand(c, 270, 955, -Math.PI / 2, 1.5); hand(c, 810, 955, -Math.PI / 2, 1.5);
};

// ---------------------------------------------------------------- experiment 2: shade detective
// a digital thermometer lying on its side: probe at the left, screen with the reading
const thermo = (c: Ctx, x: number, y: number, s: number, reading: string) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = () => rrect(c, -240, -70, 520, 140, 44), probe = () => rrect(c, -470, -14, 230, 28, 14);
  shape(c, probe, COL.steel, 6); sd(c, probe, COL.steelDk, 0, 10);
  shape(c, () => rrect(c, -272, -36, 44, 72, 10), COL.steelDk, 6);
  shape(c, body, COL.teal, 6); sd(c, body, COL.tealDk, 0, 22, 0.6);
  shape(c, () => rrect(c, -195, -48, 285, 96, 14), "#22303a", 5);
  const h = 62; write(c, reading, -170, -30, h, "#c9f06b", 9);
  const cx = -170 + reading.length * 0.8 * h;
  c.beginPath(); c.arc(cx + 0.05 * h, -26, 0.11 * h, 0, Math.PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 7; c.stroke();
  c.beginPath(); c.arc(cx + 0.65 * h, 0, 0.46 * h, 0.7, Math.PI * 2 - 0.7); c.stroke();
  shape(c, () => ell(c, 175, 0, 28, 28), WHITE, 5);
  c.restore();
};
// paving slabs seen from the front, receding up to the horizon at y = top
const pave = (c: Ctx, top: number, col: string, joint: string) => {
  c.fillStyle = col; c.fillRect(0, top, D, D - top);
  c.strokeStyle = joint; c.lineWidth = 6; c.lineCap = "round";
  for (let i = -3; i <= 7; i++) { const xt = 540 + i * 190; c.beginPath(); c.moveTo(xt, top); c.lineTo(540 + (xt - 540) * 2.6, D); c.stroke(); }
  for (const f of [0.2, 0.48, 0.8]) { const y = top + (D - top) * f; c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, top], [D, top]], 7, INK);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; shape(c, () => polyP(c, [[x + Math.cos(a - 0.12) * r * 1.2, y + Math.sin(a - 0.12) * r * 1.2], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8], [x + Math.cos(a + 0.12) * r * 1.2, y + Math.sin(a + 0.12) * r * 1.2]]), COL.orange, 5); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, COL.sky);
  pave(c, 560, "#dccaa6", "#a8946c");
  c.fillStyle = "rgba(255,214,70,0.30)"; c.fillRect(0, 560, D, D - 560);
  sun(c, 250, 240, 105);
  shadow(c, 700, 905, 380, 26);
  thermo(c, 640, 800, 0.95, "44");
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, COL.sky);
  pave(c, 560, "#b4ac98", "#8a8070");
  c.fillStyle = "rgba(40,50,120,0.28)"; c.fillRect(0, 560, D, D - 560);
  const r = rnd(5);
  for (let i = 0; i < 9; i++) { c.beginPath(); ell(c, 120 + r() * 880, 640 + r() * 400, 30 + r() * 25, 12 + r() * 8, 0); c.fillStyle = "rgba(255,240,170,0.5)"; c.fill(); }
  // the neem tree: trunk on the left, a wide canopy over everything
  shape(c, () => polyP(c, [[110, 590], [240, 590], [215, 330], [140, 330]]), TWIG, 6);
  line(c, [[225, 560], [205, 340]], 20, TWIGDK);
  const lobes: number[][] = [[170, 150, 150], [360, 110, 150], [560, 120, 150], [760, 130, 150], [930, 170, 140], [270, 260, 140], [470, 270, 150], [670, 270, 150], [850, 300, 130], [130, 310, 100]];
  for (const [x, y, rr] of lobes) { c.beginPath(); ell(c, x, y, rr + 6, rr * 0.7 + 6); c.fillStyle = INK; c.fill(); }
  for (const [x, y, rr] of lobes) { c.beginPath(); ell(c, x, y, rr, rr * 0.7); c.fillStyle = COL.leafDk; c.fill(); }
  for (const [x, y, rr] of lobes) { c.beginPath(); ell(c, x - rr * 0.12, y - rr * 0.14, rr * 0.8, rr * 0.5); c.fillStyle = COL.leaf; c.fill(); }
  for (const [x, y, an] of [[300, 330, 1.7], [520, 345, 1.5], [700, 340, 1.75], [880, 350, 1.6], [420, 130, 0.5], [760, 110, 2.3]]) leaf(c, x, y, 90, an, COL.greenLt);
  shadow(c, 700, 905, 380, 26);
  thermo(c, 640, 800, 0.95, "32");
};

// two small panels: under an umbrella, under a shrub
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, COL.sky);
  pave(c, 720, "#b4ac98", "#8a8070");
  // umbrella
  c.beginPath(); ell(c, 270, 880, 250, 55); c.fillStyle = "rgba(40,50,120,0.3)"; c.fill();
  line(c, [[270, 60], [270, 780]], 22, INK); line(c, [[270, 60], [270, 780]], 10, COL.steelDk);
  shape(c, () => ell(c, 270, 790, 46, 14), COL.steel, 5);
  const dome = () => { c.moveTo(40, 280); c.bezierCurveTo(40, 100, 150, 50, 270, 50); c.bezierCurveTo(390, 50, 500, 100, 500, 280); c.quadraticCurveTo(463, 320, 425, 280); c.quadraticCurveTo(385, 320, 345, 280); c.quadraticCurveTo(308, 320, 270, 280); c.quadraticCurveTo(232, 320, 195, 280); c.quadraticCurveTo(155, 320, 115, 280); c.quadraticCurveTo(78, 320, 40, 280); c.closePath(); };
  shape(c, dome, COL.yellow, 6);
  c.save(); c.beginPath(); dome(); c.clip();
  for (const [a, b] of [[40, 155], [270, 385]]) { c.beginPath(); c.moveTo(270, 30); c.lineTo(a - 20, 340); c.lineTo(b + 20, 340); c.closePath(); c.fillStyle = COL.red; c.fill(); }
  c.restore();
  for (const x of [40, 155, 270, 385, 500]) line(c, [[270, 52], [x, 280]], 4);
  shape(c, dome, "rgba(0,0,0,0)", 6); sd(c, dome, COL.orange, 40, 30, 0.2);
  thermo(c, 330, 890, 0.64, "36");
  // hibiscus shrub
  c.beginPath(); ell(c, 810, 880, 250, 55); c.fillStyle = "rgba(40,50,120,0.3)"; c.fill();
  shape(c, () => polyP(c, [[790, 760], [830, 760], [826, 660], [794, 660]]), TWIG, 5);
  for (const [x, y, rr] of [[700, 520, 100], [900, 520, 100], [800, 420, 130], [720, 360, 90], [890, 340, 100], [800, 580, 110]]) { c.beginPath(); ell(c, x, y, rr + 6, rr * 0.9 + 6); c.fillStyle = INK; c.fill(); }
  for (const [x, y, rr] of [[700, 520, 100], [900, 520, 100], [800, 420, 130], [720, 360, 90], [890, 340, 100], [800, 580, 110]]) { c.beginPath(); ell(c, x, y, rr, rr * 0.9); c.fillStyle = COL.leafDk; c.fill(); c.beginPath(); ell(c, x - rr * 0.1, y - rr * 0.15, rr * 0.75, rr * 0.6); c.fillStyle = COL.leaf; c.fill(); }
  for (const [x, y] of [[740, 380], [880, 330], [820, 480], [940, 500], [690, 540], [800, 600]]) {
    for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2 - 1.2; shape(c, () => ell(c, x + Math.cos(a) * 30, y + Math.sin(a) * 30, 30, 20, a), "#e8324a", 4); }
    shape(c, () => ell(c, x, y, 13, 13), COL.yellow, 3);
  }
  thermo(c, 870, 890, 0.64, "34");
  line(c, [[540, 0], [540, D]], 8, INK);
};

// ---------------------------------------------------------------- experiment 3: the smell test
const tag = (c: Ctx, x: number, y: number, n: string) => {
  shape(c, () => rrect(c, x - 55, y - 40, 110, 80, 14), WHITE, 5);
  write(c, n, x - 17, y - 26, 52, INK, 8);
};
const plateAt = (c: Ctx, x: number, y: number) => plate(c, x, y, 165, 125);
const mintOn = (c: Ctx, x: number, y: number) => { line(c, [[x - 105, y + 12], [x - 85, y + 6]], 8, INK); line(c, [[x - 105, y + 12], [x - 85, y + 6]], 4, COL.greenLt); toothed(c, x - 90, y + 6, 200, -0.08, COL.green, 0.38); };
const corianderOn = (c: Ctx, x: number, y: number) => {
  stalk(c, [[x, y + 90], [x, y + 20]], 8, COL.greenLt, COL.green);
  line(c, [[x, y + 30], [x - 55, y - 20]], 10, INK); line(c, [[x, y + 30], [x + 55, y - 20]], 10, INK);
  line(c, [[x, y + 30], [x - 55, y - 20]], 5, COL.greenLt); line(c, [[x, y + 30], [x + 55, y - 20]], 5, COL.greenLt);
  scallop(c, x - 62, y - 28, 46, 6, COL.greenLt); scallop(c, x + 62, y - 28, 46, 6, COL.greenLt); scallop(c, x, y - 48, 52, 7, COL.greenLt);
};
const curryOn = (c: Ctx, x: number, y: number) => {
  const dark = "#2f6b34";
  line(c, [[x - 115, y + 40], [x + 70, y - 22]], 11, INK); line(c, [[x - 115, y + 40], [x + 70, y - 22]], 5, COL.greenLt);
  const an = Math.atan2(-62, 185);
  [0.1, 0.36, 0.62].forEach((t) => { const bx = x - 115 + 185 * t, by = y + 40 - 62 * t; leaf(c, bx, by, 76, an - 1.0, dark); leaf(c, bx, by, 76, an + 1.0, dark); });
  leaf(c, x + 70, y - 22, 70, an, dark);
};
const methiOn = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y + 95], [x, y + 20]], 11, INK); line(c, [[x, y + 95], [x, y + 20]], 5, COL.greenLt);
  for (const [dx, dy, rot] of [[0, -55, 0], [-48, -12, -1.0], [48, -12, 1.0]]) shape(c, () => ell(c, x + dx, y + dy, 36, 52, rot), COL.greenLt, 5);
  for (const [dx, dy, rot] of [[0, -55, 0], [-48, -12, -1.0], [48, -12, 1.0]]) { c.save(); c.translate(x + dx, y + dy); c.rotate(rot); line(c, [[0, -34], [0, 34]], 3, COL.green); c.restore(); }
};
const spinachOn = (c: Ctx, x: number, y: number) => {
  line(c, [[x - 20, y + 98], [x - 2, y + 60]], 12, INK); line(c, [[x - 20, y + 98], [x - 2, y + 60]], 6, COL.greenLt);
  c.save(); c.translate(x - 2, y + 62); c.rotate(-1.45);
  const p = () => { c.moveTo(0, 0); c.bezierCurveTo(30, -105, 150, -100, 190, 0); c.bezierCurveTo(150, 100, 30, 105, 0, 0); c.closePath(); };
  shape(c, p, COL.leafDk, 5); sd(c, p, "#2a5a25", 0, 28, 0.4);
  line(c, [[0, 0], [170, 0]], 5, COL.greenLt);
  for (const k of [0.3, 0.55, 0.75]) { line(c, [[190 * k, 0], [190 * (k + 0.1), -50]], 3, COL.greenLt); line(c, [[190 * k, 0], [190 * (k + 0.1), 50]], 3, COL.greenLt); }
  c.restore();
};

// five numbered plates, a leaf on each
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const P: [number, number][] = [[190, 260], [540, 260], [890, 260], [365, 690], [715, 690]];
  const on = [mintOn, corianderOn, curryOn, methiOn, spinachOn];
  P.forEach(([x, y], i) => { plateAt(c, x, y); on[i](c, x, y); tag(c, x, y + 175, String(i + 1)); });
};

// a pinch, rubbing a mint leaf, smell rising
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  toothed(c, 340, 590, 480, 0, COL.green, 0.36);
  for (const [x, y, h] of [[640, 410, 280], [730, 400, 330], [820, 410, 260]]) smell(c, x, y, h);
  line(c, [[190, 340], [480, 515]], 112, INK); line(c, [[190, 340], [480, 515]], 98, SKIN.child);
  line(c, [[200, 820], [480, 650]], 112, INK); line(c, [[200, 820], [480, 650]], 98, SKIN.child);
  shape(c, () => ell(c, 430, 482, 32, 20, 0.55), "#ecc1a4", 4); shape(c, () => ell(c, 440, 672, 32, 20, -0.5), "#ecc1a4", 4);
  shape(c, () => ell(c, 100, 580, 170, 300), SKIN.child, 6);
  shape(c, () => rrect(c, -70, 320, 200, 520, 30), CLOTH.child, 6);
  arrow(c, [[960, 590], [960, 510]]); arrow(c, [[960, 590], [960, 670]]);
};

// sniffing the leaf, then four fingers up for the score
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  line(c, [[660, 0], [660, D]], 8, INK);
  // child in profile
  shape(c, () => ell(c, 215, 430, 150, 170), CLOTH.hair, 6);
  shape(c, () => rrect(c, 190, 610, 110, 150, 20), SKIN.childDk, 5);
  shape(c, () => ell(c, 395, 510, 26, 30), SKIN.child, 5);
  shape(c, () => ell(c, 255, 480, 135, 155), SKIN.child, 6);
  shape(c, () => ell(c, 300, 355, 80, 40, 0.5), CLOTH.hair, 5);
  shape(c, () => ell(c, 165, 505, 20, 34), SKIN.child, 5);
  c.beginPath(); c.arc(328, 455, 24, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(318, 565, 28, 0.2, 2.6); c.stroke();
  shape(c, () => ell(c, 300, 525, 24, 15), "#e59a82", 0);
  shape(c, () => rrect(c, 20, 740, 430, 400, 130), CLOTH.child, 6);
  // the leaf, held under the nose
  line(c, [[468, 815], [480, 690]], 14, INK); line(c, [[468, 815], [480, 690]], 7, COL.greenLt);
  toothed(c, 480, 692, 190, -1.75, COL.green, 0.38);
  mirrorHand(c, 520, 930, -1.15, 1.8);
  smell(c, 470, 470, 200); smell(c, 520, 480, 160);
  // right: four fingers up
  const cx = 870;
  [[-96, 250], [-32, 300], [32, 265], [96, 195]].forEach(([dx, len]) => shape(c, () => rrect(c, cx + dx - 29, 620 - len, 58, len + 80, 29), SKIN.child, 6));
  shape(c, () => rrect(c, cx - 135, 590, 270, 290, 70), SKIN.child, 6);
  sd(c, () => rrect(c, cx - 135, 590, 270, 290, 70), SKIN.childDk, 40, 0, 0.5);
  line(c, [[cx - 110, 830], [cx - 20, 710]], 90, INK); line(c, [[cx - 110, 830], [cx - 20, 710]], 78, SKIN.child);
  shape(c, () => ell(c, cx - 8, 692, 24, 18, -0.9), "#ecc1a4", 4);
  shape(c, () => rrect(c, cx - 115, 850, 230, 230, 20), CLOTH.child, 6);
  write(c, "4", cx - 40, 70, 160, INK, 18);
};

export const su_plantsPlantVariety = cards("sci.plants.plant-variety.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
