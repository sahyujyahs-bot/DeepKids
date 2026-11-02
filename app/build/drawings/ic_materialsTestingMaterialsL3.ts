import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, plate, write, cards } from "./flatKit";

// sci.materials.testing-materials.L3 · picture cards (intro, cover, experiments, activities, project,
// challenges, terms, explanations). Same child and grown-up as the set-up cards. Coins are one-rupee
// steel coins; cups are little paper cups hung from a strip or a hair by thread.

const NONE = "rgba(0,0,0,0)", GLASSF = "rgba(214,236,250,0.55)", PALEBLUE = "#cfe8f5", SHADE = "#e4dccb";

const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - s * 1.4); c.quadraticCurveTo(x + s * 1.25, y + s * 0.2, x, y + s * 0.85); c.quadraticCurveTo(x - s * 1.25, y + s * 0.2, x, y - s * 1.4); c.closePath(); }, col, Math.max(3, s * 0.17));
const tape = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x, y, w, h, 3), "rgba(255,255,255,0.72)", 3);
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#dfe3ea", Math.max(3, r * 0.16));
  c.beginPath(); ell(c, x, y, r * 0.62, r * 0.62); c.strokeStyle = COL.steelDk; c.lineWidth = Math.max(2, r * 0.1); c.stroke();
};
// a pile of coins, centred on x, standing on y
const heap = (c: Ctx, x: number, y: number, n: number, r: number) => {
  let W = 1; while ((W * (W + 1)) / 2 < n) W++;
  const pts: number[][] = []; let left = n;
  for (let i = 0; i < W && left > 0; i++) { const m = Math.min(W - i, left); for (let k = 0; k < m; k++) pts.push([x + (k - (m - 1) / 2) * r * 1.9, y - r - i * r * 1.7]); left -= m; }
  for (let i = pts.length - 1; i >= 0; i--) coin(c, pts[i][0], pts[i][1], r);
};
// a little paper cup hung by thread from (x, apexY); rim at rimY; n coins heaped in it
const cup = (c: Ctx, x: number, apexY: number, rimY: number, w: number, h: number, n: number, r = 20) => {
  line(c, [[x - w * 0.46, rimY], [x, apexY], [x + w * 0.46, rimY]], 4);
  shape(c, () => ell(c, x, apexY, 8, 8), COL.steelDk, 4);
  heap(c, x, rimY + 8, n, r);
  const p = () => { c.moveTo(x - w / 2, rimY); c.lineTo(x + w / 2, rimY); c.lineTo(x + w * 0.38, rimY + h); c.lineTo(x - w * 0.38, rimY + h); c.closePath(); };
  shadow(c, x + 10, rimY + h + 8, w * 0.5, 16);
  shape(c, p, COL.paper); shade(c, p, SHADE, -w * 0.22, 0);
  const ex = (t: number) => w * 0.12 * (t / h);
  shape(c, () => polyP(c, [[x - w / 2 + ex(h * 0.3), rimY + h * 0.3], [x + w / 2 - ex(h * 0.3), rimY + h * 0.3], [x + w / 2 - ex(h * 0.55), rimY + h * 0.55], [x - w / 2 + ex(h * 0.55), rimY + h * 0.55]]), COL.teal, 4);
  shape(c, p, NONE, 6);
};
// a paper strip taped to something at top, hanging len px
const strip = (c: Ctx, x: number, top: number, w: number, len: number, col: string) => {
  shape(c, () => rrect(c, x - w / 2, top, w, len, 3), col, 5);
  tape(c, x - w / 2 - 6, top - 4, w + 12, 28); tape(c, x - w / 2 - 6, top + len - 24, w + 12, 28);
  return top + len;
};
const slab = (c: Ctx, x0: number, x1: number, y: number) => {
  shape(c, () => rrect(c, x0, y, x1 - x0, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(x0 + 6, y + 44, x1 - x0 - 12, 20);
  line(c, [[x0 + 6, y + 64], [x1 - 6, y + 64]], 6);
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  shape(c, () => rrect(c, x, y, w, h, 6), col, 6);
  shape(c, () => rrect(c, x + w * 0.84, y + 5, w * 0.16 - 5, h - 10, 3), WHITE, 3);
  line(c, [[x + w * 0.06, y + h * 0.5], [x + w * 0.7, y + h * 0.5]], 4, "rgba(255,255,255,0.7)");
};
const swatch = (c: Ctx, x: number, y: number, s: number, kind: number) => {
  const cols = [["#f7f3e8", "#d6cbb2"], ["#5b8fd6", "#3f6fb3"], ["#b79adf", "#8b6cc9"], ["#e9c4a8", "#c49670"]][kind];
  const p = () => rrect(c, x, y, s, s, 10);
  shape(c, p, cols[0], 6);
  c.save(); c.beginPath(); p(); c.clip();
  if (kind === 0) for (let k = 12; k < s; k += 14) { line(c, [[x + k, y], [x + k, y + s]], 2, cols[1]); line(c, [[x, y + k], [x + s, y + k]], 2, cols[1]); }
  if (kind === 1) for (let k = -s; k < s; k += 16) line(c, [[x + k, y + s], [x + k + s, y]], 3, cols[1]);
  if (kind === 2) { line(c, [[x + s * 0.15, y + s * 0.85], [x + s * 0.85, y + s * 0.15]], s * 0.14, "rgba(255,255,255,0.55)"); line(c, [[x + s * 0.4, y + s * 0.95], [x + s * 0.95, y + s * 0.4]], s * 0.06, "rgba(255,255,255,0.45)"); }
  if (kind === 3) for (let gx = x + 12; gx < x + s; gx += 24) for (let gy = y + 12; gy < y + s; gy += 24) { c.beginPath(); ell(c, gx + ((gy - y) % 48 ? 0 : 12), gy, 10, 10); c.strokeStyle = cols[1]; c.lineWidth = 3; c.stroke(); }
  c.restore();
  shape(c, p, NONE, 6);
};
const umbrella = (c: Ctx, x: number, y: number, r: number, col: string, colDk: string, shaft: number) => {
  line(c, [[x, y - r * 0.9], [x, y - r * 1.0]], 8);
  line(c, [[x, y], [x, y + shaft]], 9);
  c.beginPath(); c.arc(x - 24, y + shaft, 24, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
  const p = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.1, x + r, y - r * 1.1, x + r, y); c.quadraticCurveTo(x + r * 0.5, y + r * 0.2, x, y); c.quadraticCurveTo(x - r * 0.5, y + r * 0.2, x - r, y); c.closePath(); };
  shape(c, p, col, 6); shade(c, p, colDk, -r * 0.3, 0);
  line(c, [[x, y], [x, y - r * 0.8]], 4, INK); line(c, [[x, y], [x - r * 0.55, y - r * 0.62]], 4, INK); line(c, [[x, y], [x + r * 0.55, y - r * 0.62]], 4, INK);
  shine(c, [[x - r * 0.8, y - r * 0.3], [x - r * 0.5, y - r * 0.62]], 10);
};
// a jug (clear, with water) tipped by rot radians, bottom centre at (ox, oy); returns the spout tip
const jug = (c: Ctx, ox: number, oy: number, rot: number): number[] => {
  const bw = 150, bb = 120, h = 190;
  c.save(); c.translate(ox, oy); c.rotate(rot);
  const body = () => { c.moveTo(-bw / 2, -h); c.lineTo(bw / 2, -h); c.lineTo(bb / 2, 0); c.lineTo(-bb / 2, 0); c.closePath(); };
  shape(c, body, GLASSF, 0);
  c.save(); c.beginPath(); body();
  c.clip();
  const d = [Math.cos(rot), -Math.sin(rot)], n = [Math.sin(rot), Math.cos(rot)], p0 = [0, -h * 0.52];
  c.beginPath(); c.moveTo(p0[0] - d[0] * 500, p0[1] - d[1] * 500); c.lineTo(p0[0] + d[0] * 500, p0[1] + d[1] * 500); c.lineTo(p0[0] + d[0] * 500 + n[0] * 500, p0[1] + d[1] * 500 + n[1] * 500); c.lineTo(p0[0] - d[0] * 500 + n[0] * 500, p0[1] - d[1] * 500 + n[1] * 500); c.closePath();
  c.fillStyle = COL.water; c.fill(); c.restore();
  shape(c, body, NONE, 5);
  for (let k = 0; k < 3; k++) line(c, [[bw / 2 - 4 - k * 6, -h * 0.3 - k * 40], [bw / 2 - 30 - k * 6, -h * 0.3 - k * 40]], 4);
  shine(c, [[-bw * 0.34, -h * 0.85], [-bb * 0.34, -h * 0.2]], 7);
  c.restore();
  return [ox + (bw / 2) * Math.cos(rot) + h * Math.sin(rot), oy + (bw / 2) * Math.sin(rot) - h * Math.cos(rot)];
};
const stream = (c: Ctx, sx: number, sy: number, ty: number) => { line(c, [[sx, sy], [sx, ty]], 22, INK); line(c, [[sx, sy], [sx, ty]], 12, COL.water); };
// the fair-test rig: a clear glass with a cloth over its mouth, and a jug pouring on it from above
const rig = (c: Ctx, gx: number, cloth: string, clothDk: string) => {
  const gy = 820, gw = 200, gh = 250, ty = gy - gh;
  glass(c, gx, gy, gw, gh, 0.1);
  drop(c, gx - 28, ty + 140, 12); drop(c, gx + 34, ty + 200, 12);
  shape(c, () => { c.moveTo(gx - 112, ty); c.quadraticCurveTo(gx, ty + 120, gx + 112, ty); c.closePath(); }, cloth, 5);
  shape(c, () => ell(c, gx, ty, 112, 22), cloth, 5);
  c.beginPath(); ell(c, gx, ty, 44, 10); c.fillStyle = clothDk; c.fill();
  line(c, [[gx - 100, ty + 18], [gx - 40, ty + 34], [gx + 40, ty + 34], [gx + 100, ty + 18]], 8, "#e4523b");
  const tip = jug(c, gx - 195, 489.5, 0.9);
  stream(c, tip[0], tip[1], ty);
};
// a hanging strip with a cup: top of strip at topY (taped below a table), cup rim at rimY
const stripCup = (c: Ctx, x: number, topY: number, w: number, len: number, col: string, rimY: number, cw: number, ch: number, n: number, r = 20) => {
  const bot = strip(c, x, topY, w, len, col);
  cup(c, x, bot + 8, rimY, cw, ch, n, r);
  return bot;
};
const waves = (c: Ctx, x: number, y: number, radii: number[], span: number, right: boolean, w = 10) => {
  radii.forEach((r) => { c.beginPath(); if (right) c.arc(x, y, r, -span, span); else c.arc(x, y, r, Math.PI - span, Math.PI + span); c.strokeStyle = COL.orange; c.lineWidth = w; c.lineCap = "round"; c.stroke(); });
};
const fruit = (c: Ctx, x: number, y: number, r: number, col: string = COL.orange, dk = "#d27c25") => {
  shape(c, () => ell(c, x, y, r, r), col, 5);
  shade(c, () => ell(c, x, y, r, r), dk, -r * 0.3, -r * 0.1, 0.6);
  shape(c, () => ell(c, x + r * 0.05, y - r * 0.95, r * 0.14, r * 0.14), COL.leafDk, 3);
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.5, r * 0.14, r * 0.14), WHITE, 0);
};
const lens = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); };
const notchOn = (c: Ctx, x: number, y: number, w: number, depth: number) => {
  shape(c, () => polyP(c, [[x + w / 2 + 3, y - 18], [x + w / 2 - depth, y], [x + w / 2 + 3, y + 18]]), "#efe4cf", 5);
  line(c, [[x + w / 2 - depth, y], [x + w / 2 - depth - 30, y + 14], [x + w / 2 - depth - 46, y + 10]], 5);
};

// ---------------------------------------------------------------- intro
const intro = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e8d8b9"; c.fillRect(0, 870, D, 210); line(c, [[0, 870], [D, 870]], 6);
  // the doorway, rain outside
  shape(c, () => rrect(c, 580, 90, 460, 780, 8), "#b4cfe3", 7);
  const r = rnd(5);
  for (let i = 0; i < 40; i++) { const x = 600 + r() * 420, y = 110 + r() * 700; line(c, [[x, y], [x - 14, y + 40]], 5, "#e9f3ff"); }
  shadow(c, 810, 868, 190, 16);
  // the shopkeeper holds an open umbrella
  umbrella(c, 447, 250, 200, COL.red, "#b73a28", 140);
  person(c, 270, 900, 640, { adult: true, armR: [-0.2, -1.57] });
  // the child, in the doorway, thinking of a test
  person(c, 810, 900, 480, {});
  shape(c, () => ell(c, 770, 365, 14, 14), WHITE, 4); shape(c, () => ell(c, 745, 320, 22, 22), WHITE, 4);
  shape(c, () => ell(c, 800, 190, 170, 100), WHITE, 6);
  swatch(c, 680, 140, 90, 1); drop(c, 830, 150, 18); arrow(c, [[830, 190], [830, 245]], RED, 8); swatch(c, 870, 175, 70, 0);
};

// ---------------------------------------------------------------- cover
const summary = (c: Ctx) => {
  ground(c);
  rig(c, 270, "#5b8fd6", "#3f6fb3");
  slab(c, 560, 1110, 60);
  const bot = strip(c, 820, 110, 110, 300, "#fffaf0");
  notchOn(c, 820, 300, 110, 34);
  cup(c, 820, bot + 8, 540, 210, 190, 5);
  arrow(c, [[1010, 300], [915, 300]], RED, 9);
  line(c, [[520, 60], [520, 960]], 4, "#d6cbb2");
};

// ---------------------------------------------------------------- experiments
const e1 = (c: Ctx) => {
  ground(c);
  rig(c, 300, "#5b8fd6", "#3f6fb3");
  swatch(c, 610, 250, 170, 0); swatch(c, 810, 250, 170, 1); swatch(c, 610, 450, 170, 2); swatch(c, 810, 450, 170, 3);
  arrow(c, [[590, 540], [490, 540]], RED, 10);
};
const e2 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 40);
  stripCup(c, 210, 90, 80, 250, PALEBLUE, 560, 210, 200, 3);
  stripCup(c, 540, 90, 80, 250, "#f6c9d3", 560, 210, 200, 6);
  stripCup(c, 870, 90, 80, 250, "#f3ead0", 560, 210, 200, 10);
};
const e3 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 40);
  stripCup(c, 300, 90, 70, 250, "#f6c9d3", 560, 220, 200, 5);
  stripCup(c, 770, 90, 140, 250, "#f6c9d3", 560, 280, 200, 10);
  write(c, "2 cm", 100, 200, 44, INK, 6);
  write(c, "4 cm", 530, 200, 44, INK, 6);
};
const e4 = (c: Ctx) => {
  ground(c);
  // tray cut open from the side; water; four strips hang from a pencil laid across the top
  const wallL = 90, wallR = 990, topY = 500, floorY = 800, waterY = 700;
  const heights = [560, 625, 665, 700];
  const xs = [250, 440, 630, 820], cols = ["#f3ead0", "#e8e3d8", "#d9d6cf", "#ffffff"];
  xs.forEach((x, i) => {
    shape(c, () => rrect(c, x - 55, topY + 10, 110, 270, 3), cols[i], 5);
    c.fillStyle = "rgba(95,159,211,0.8)"; c.fillRect(x - 52, heights[i], 104, 280 + topY - heights[i] - 10 - 0);
    line(c, [[x - 55, heights[i]], [x + 55, heights[i]]], 4, COL.waterDk);
  });
  shape(c, () => polyP(c, [[wallL, topY], [wallL + 30, floorY], [wallR - 30, floorY], [wallR, topY], [wallR - 28, topY], [wallR - 50, floorY - 28], [wallL + 50, floorY - 28], [wallL + 28, topY]]), COL.steel, 6);
  c.fillStyle = "rgba(143,195,234,0.65)"; c.fillRect(wallL + 46, waterY, wallR - wallL - 92, floorY - 28 - waterY);
  line(c, [[wallL + 40, waterY], [wallR - 40, waterY]], 5, COL.waterDk);
  // the pencil across the tray
  shape(c, () => rrect(c, wallL - 30, topY - 36, wallR - wallL + 60, 36, 6), COL.yellow, 6);
  shape(c, () => polyP(c, [[wallR + 30, topY - 36], [wallR + 70, topY - 18], [wallR + 30, topY]]), "#f2d8a8", 5);
  xs.forEach((x) => tape(c, x - 62, topY - 6, 124, 26));
  arrow(c, [[250, 670], [250, 600]], RED, 9);
  arrow(c, [[630, 740], [630, 690]], RED, 7);
  shadow(c, 540, 830, 470, 22);
};
// ---------------------------------------------------------------- activities
const a1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 70, 110, 940, 840, 24), COL.paper, 6);
  line(c, [[383, 150], [383, 910]], 4, "#b9b4ab"); line(c, [[697, 150], [697, 910]], 4, "#b9b4ab");
  swatch(c, 160, 190, 130, 0); swatch(c, 160, 360, 130, 1); swatch(c, 160, 530, 130, 2);
  arrow(c, [[226, 740], [226, 800]], RED, 9);
  const tum = (x: number, y: number) => { const p = () => { c.moveTo(x - 50, y - 130); c.lineTo(x + 50, y - 130); c.lineTo(x + 43, y); c.lineTo(x - 43, y); c.closePath(); }; shape(c, p, COL.steel); shade(c, p, COL.steelDk, -30, 0); shape(c, () => ell(c, x, y - 130, 50, 10), COL.steelIn, 5); };
  tum(485, 420); tum(595, 420); tum(540, 640);
  glass(c, 780, 700, 130, 220, 0.5);
  shape(c, () => rrect(c, 880, 420, 60, 300, 6), COL.wood, 5);
  for (let k = 0; k < 15; k++) line(c, [[880, 440 + k * 19], [880 + (k % 5 === 0 ? 34 : 20), 440 + k * 19]], 3);
};
const hairRig = (c: Ctx, x: number, hairTop: number, n: number, knot: boolean, cw = 190) => {
  const bot = hairTop + 200;
  line(c, [[x, hairTop], [x, knot ? hairTop + 90 : bot]], 5, "#3a3540");
  if (knot) {
    c.beginPath(); ell(c, x + 6, hairTop + 104, 16, 14); c.strokeStyle = "#3a3540"; c.lineWidth = 5; c.stroke();
    line(c, [[x, hairTop + 116], [x, bot]], 5, "#3a3540");
  }
  c.beginPath(); c.arc(x, bot + 12, 12, -0.3, Math.PI * 1.3, false); c.strokeStyle = COL.steelDk; c.lineWidth = 6; c.stroke();
  cup(c, x, bot + 22, bot + 106, cw, 190, n, 19);
};
const pencilOverEdge = (c: Ctx, edgeX: number, y: number, tipX: number) => {
  slab(c, -30, edgeX, y);
  shape(c, () => rrect(c, 250, y - 28, tipX - 250, 28, 5), COL.yellow, 6);
  shape(c, () => polyP(c, [[tipX, y - 28], [tipX + 44, y - 14], [tipX, y]]), "#f2d8a8", 5);
  book(c, 110, y - 28 - 78, 340, 78, COL.purple);
};
const a2 = (c: Ctx) => {
  ground(c);
  pencilOverEdge(c, 560, 180, 880);
  hairRig(c, 720, 180, 9, false, 220);
  arrow(c, [[860, 280], [800, 330]], RED, 8);
};
const a3 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 800);
  // the phone, ringing
  shape(c, () => rrect(c, 195, 550, 130, 250, 16), COL.black, 6);
  shape(c, () => rrect(c, 208, 575, 104, 200, 8), "#22303a", 4);
  shape(c, () => ell(c, 260, 675, 26, 26), COL.yellow, 5);
  waves(c, 260, 675, [110, 155, 200], 0.6, true); waves(c, 260, 675, [110, 155, 200], 0.6, false);
  // the same phone under a heap of folded towel
  const p = () => { c.moveTo(580, 800); c.bezierCurveTo(620, 460, 900, 460, 940, 800); c.closePath(); };
  shape(c, p, COL.teal); shade(c, p, COL.tealDk, -90, 0);
  c.save(); c.beginPath(); p(); c.clip();
  for (let k = 0; k < 5; k++) line(c, [[580, 770 - k * 48], [760, 745 - k * 48 - 18], [940, 770 - k * 48]], 5, COL.tealDk);
  c.restore(); shape(c, p, NONE, 6);
  waves(c, 760, 680, [215], 0.42, true, 8); waves(c, 760, 680, [215], 0.42, false, 8);
  arrow(c, [[470, 640], [540, 640]], RED, 10);
};
const a4 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 800);
  const sponge = (x: number, y: number, w: number, h: number) => {
    shape(c, () => rrect(c, x, y, w, h, 14), COL.yellow, 6);
    shape(c, () => rrect(c, x, y, w, Math.min(h * 0.28, 56), 14), COL.green, 6);
    const r = rnd(h);
    for (let i = 0; i < 9; i++) shape(c, () => ell(c, x + 30 + r() * (w - 60), y + h * 0.4 + r() * (h * 0.5), 9, 7), COL.woodDk, 3);
  };
  sponge(110, 610, 300, 190);
  // squashed, with three books on a card
  sponge(640, 720, 300, 80);
  shape(c, () => rrect(c, 625, 704, 330, 16, 3), COL.brown, 5);
  book(c, 650, 654, 280, 50, COL.purple); book(c, 650, 604, 280, 50, COL.teal); book(c, 650, 554, 280, 50, COL.orange);
  arrow(c, [[790, 330], [790, 500]], RED, 12);
  line(c, [[600, 610], [980, 610]], 5, INK); line(c, [[980, 610], [980, 800]], 5, INK);
};
const a5 = (c: Ctx) => {
  ground(c);
  pencilOverEdge(c, 540, 160, 1010);
  hairRig(c, 650, 160, 10, false, 200);
  hairRig(c, 900, 160, 5, true, 200);
};
const a6 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 560, 790);
  // a whole cup, tapped
  const body = () => { c.moveTo(120, 470); c.lineTo(420, 470); c.lineTo(375, 770); c.lineTo(165, 770); c.closePath(); };
  c.beginPath(); c.arc(405, 590, 60, -1.2, 1.2); c.strokeStyle = INK; c.lineWidth = 30; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(405, 590, 60, -1.2, 1.2); c.strokeStyle = COL.paper; c.lineWidth = 16; c.stroke();
  shape(c, body, COL.paper); shade(c, body, SHADE, -70, 0);
  shape(c, () => polyP(c, [[133, 560], [407, 560], [393, 640], [147, 640]]), COL.teal, 5);
  shape(c, () => ell(c, 270, 470, 150, 22), "#efeee6", 5);
  line(c, [[500, 180], [330, 405]], 16, INK); line(c, [[500, 180], [330, 405]], 8, COL.steel);
  shape(c, () => ell(c, 300, 450, 44, 28, -0.9), COL.steel, 5);
  line(c, [[250, 395], [215, 365]], 7, COL.orange); line(c, [[300, 370], [296, 325]], 7, COL.orange); line(c, [[200, 440], [160, 435]], 7, COL.orange);
  // a paper clip bent back and forth
  const clip = [[620, 700], [720, 650], [790, 560], [860, 650], [960, 700]];
  line(c, clip, 20, INK); line(c, clip, 10, COL.steel);
  hand(c, 566, 717, -0.3, 0.8, SKIN.child, CLOTH.child);
  hand(c, 1013, 717, Math.PI + 0.3, 0.8, SKIN.adult, CLOTH.adult);
  arrow(c, [[715, 500], [790, 450]], RED, 9); arrow(c, [[790, 450], [865, 500]], RED, 9);
};
const a7 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 40);
  const b1 = strip(c, 290, 90, 110, 270, "#fffaf0");
  cup(c, 290, b1 + 8, 560, 210, 200, 10);
  const b2 = strip(c, 790, 90, 110, 270, "#fffaf0");
  notchOn(c, 790, 250, 110, 34);
  cup(c, 790, b2 + 8, 560, 210, 200, 4);
  arrow(c, [[960, 250], [860, 250]], RED, 9);
};
const p1 = (c: Ctx) => {
  ground(c);
  const sheet = (x: number, kind: number) => {
    const p = () => rrect(c, x, 90, 220, 220, 10);
    shape(c, p, ["#f9d6dd", "#d7ecd0", "#f3ead0"][kind], 6);
    c.save(); c.beginPath(); p(); c.clip();
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      if (kind === 0) { c.beginPath(); ell(c, x + 20 + i * 36, 110 + j * 36, 5, 5); c.fillStyle = "#e29ab0"; c.fill(); }
      if (kind === 2 && (i + j) % 2 === 0) { c.fillStyle = "#e4dccb"; c.fillRect(x + i * 37, 90 + j * 37, 37, 37); }
    }
    if (kind === 1) for (let j = 0; j < 7; j++) { c.beginPath(); c.moveTo(x, 120 + j * 32); for (let k = 0; k < 4; k++) c.quadraticCurveTo(x + 28 + k * 55, 100 + j * 32, x + 55 + k * 55, 120 + j * 32); c.strokeStyle = "#9cc58f"; c.lineWidth = 4; c.stroke(); }
    c.restore(); shape(c, p, NONE, 6);
  };
  sheet(150, 0); sheet(430, 1); sheet(710, 2);
  [260, 540, 820].forEach((x, i) => { drop(c, x + 60, 280 + 0, 14); arrow(c, [[x, 350], [x, 420]], RED, 8); void i; });
  // the report card: bars
  shape(c, () => rrect(c, 100, 450, 880, 520, 18), COL.paper, 6);
  line(c, [[160, 900], [920, 900]], 6); line(c, [[160, 900], [160, 500]], 6);
  [[260, 330, "#e29ab0"], [540, 220, "#9cc58f"], [820, 400, "#e4c06a"]].forEach(([x, h, col]) => shape(c, () => rrect(c, (x as number) - 70, 900 - (h as number), 140, h as number, 8), col as string, 6));
};
// ---------------------------------------------------------------- challenges
const c1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 810, 470, 120);
  shape(c, () => polyP(c, [[180, 740], [900, 740], [900, 780], [180, 780]]), WHITE, 6);
  for (let k = 0; k < 4; k++) line(c, [[230 + k * 160, 748], [230 + k * 160, 772]], 3, "#b9b4ab");
  shape(c, () => polyP(c, [[260, 620], [820, 620], [900, 740], [180, 740]]), COL.blue, 6);
  shape(c, () => polyP(c, [[430, 655], [650, 655], [690, 705], [390, 705]]), COL.paper, 5);
  shape(c, () => polyP(c, [[225, 598], [855, 598], [960, 770], [125, 770]]), "rgba(230,244,252,0.55)", 5);
  shine(c, [[300, 640], [380, 640]], 9); shine(c, [[200, 735], [300, 735]], 9);
  const dots = [[330, 680], [470, 640], [560, 725], [700, 640], [760, 700], [260, 735], [850, 735], [420, 735]];
  dots.forEach(([x, y]) => shape(c, () => ell(c, x, y, 16, 9), COL.drop, 3));
  drop(c, 140, 830, 14); drop(c, 940, 850, 14); drop(c, 540, 880, 14);
  const tip = jug(c, 345, 420, 0.9);
  stream(c, tip[0], tip[1], 640);
};
const c2 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 40);
  const b1 = strip(c, 250, 90, 90, 260, "#ffffff");
  cup(c, 250, b1 + 8, 640, 220, 170, 6, 18);
  // the same sheet rolled into a tube
  const x = 800, top = 90, len = 280;
  shape(c, () => rrect(c, x - 55, top, 110, len, 10), "#ffffff", 6);
  for (let k = 0; k < 5; k++) line(c, [[x - 55, top + 40 + k * 50], [x + 55, top + 20 + k * 50]], 3, "#d6cbb2");
  tape(c, x - 60, top - 4, 120, 26); tape(c, x - 60, top + len - 26, 120, 28);
  shape(c, () => ell(c, x, top + len, 55, 14), "#f3ead0", 5);
  cup(c, x, top + len + 12, 680, 280, 190, 30, 17);
  arrow(c, [[420, 500], [560, 500]], RED, 11);
};
const c3 = (c: Ctx) => {
  ground(c);
  slab(c, -20, 1100, 800);
  const body = () => { c.moveTo(130, 450); c.lineTo(470, 450); c.lineTo(420, 800); c.lineTo(180, 800); c.closePath(); };
  c.beginPath(); c.arc(455, 580, 70, -1.2, 1.2); c.strokeStyle = INK; c.lineWidth = 30; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(455, 580, 70, -1.2, 1.2); c.strokeStyle = COL.paper; c.lineWidth = 16; c.stroke();
  shape(c, body, COL.paper); shade(c, body, SHADE, -80, 0);
  shape(c, () => polyP(c, [[145, 550], [455, 550], [440, 640], [160, 640]]), COL.teal, 5);
  shape(c, () => ell(c, 300, 450, 170, 24), "#efeee6", 5);
  const crack = [[390, 466], [380, 520], [405, 560], [392, 620], [412, 665]];
  line(c, crack, 9, "#2a3f7a"); line(c, crack, 4, INK);
  c.beginPath(); ell(c, 396, 565, 52, 52); c.strokeStyle = RED; c.lineWidth = 6; c.stroke();
  // the magnifying glass
  line(c, [[760, 600], [940, 820]], 40, INK); line(c, [[760, 600], [940, 820]], 26, COL.wood);
  lens(c, 700, 420, 240); c.fillStyle = COL.paper; c.fill();
  c.save(); lens(c, 700, 420, 240); c.clip();
  const big = [[640, 200], [610, 300], [680, 380], [640, 480], [700, 560], [670, 640]];
  line(c, big, 26, "#2a3f7a"); line(c, big, 12, INK);
  line(c, [[610, 300], [540, 310]], 8, INK); line(c, [[680, 380], [750, 360]], 8, INK);
  c.restore();
  lens(c, 700, 420, 240); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  shine(c, [[540, 250], [580, 190]], 12);
  line(c, [[436, 520], [496, 480]], 4, RED);
};
// ---------------------------------------------------------------- terms
const t3 = (c: Ctx) => {
  ground(c);
  rig(c, 290, "#3fb1a8", "#2a8a83");
  rig(c, 790, "#b79adf", "#8b6cc9");
  line(c, [[290, 430], [290, 250], [790, 250], [790, 430]], 6);
};
const t17 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e8d8b9"; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 6);
  const r = rnd(9);
  for (let i = 0; i < 14; i++) { const x = 80 + r() * 920, y = 40 + r() * 260; if (x > 330 && x < 910 && y > 120) continue; drop(c, x, y, 13); }
  [[300, 200], [940, 230], [620, 40]].forEach(([x, y]) => drop(c, x, y, 13));
  umbrella(c, 621, 400, 360, COL.teal, COL.tealDk, 170);
  person(c, 480, 1000, 520, { armR: [-0.3, -1.57] });
  [[330, 340], [900, 330]].forEach(([x, y]) => drop(c, x, y, 13));
  arrow(c, [[500, 150], [450, 90], [380, 60]], RED, 9);
  arrow(c, [[780, 150], [840, 90], [910, 70]], RED, 9);
  shape(c, () => ell(c, 180, 975, 90, 14), COL.water, 4); shape(c, () => ell(c, 960, 985, 80, 12), COL.water, 4);
};
const t18 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[0, 420], [1080, 420], [1080, 1080], [0, 1080]]), "#e8d8b9", 0); line(c, [[0, 420], [D, 420]], 6);
  // the spill
  shape(c, () => ell(c, 300, 790, 230, 130), COL.water, 5);
  shape(c, () => ell(c, 230, 750, 60, 20), COL.drop, 0);
  c.save(); c.translate(120, 640); c.rotate(Math.PI / 2); glass(c, 0, 0, 170, 230, 0); c.restore();
  arrow(c, [[550, 780], [620, 780]], RED, 11);
  // the towel, soaked
  shape(c, () => polyP(c, [[660, 580], [1000, 580], [1040, 900], [640, 900]]), COL.cloth, 6);
  shape(c, () => polyP(c, [[700, 640], [960, 640], [990, 850], [680, 850]]), COL.water, 0);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { c.beginPath(); ell(c, 695 + i * 60, 665 + j * 58, 5, 5); c.fillStyle = COL.waterDk; c.fill(); }
  shape(c, () => polyP(c, [[660, 580], [1000, 580], [1040, 900], [640, 900]]), NONE, 6);
  drop(c, 840, 520, 18);
};
const t19 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e8d8b9"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  // a paper bag holding fruit
  const bag = () => { c.moveTo(110, 440); c.lineTo(480, 440); c.lineTo(510, 880); c.lineTo(80, 880); c.closePath(); };
  [[190, 410], [290, 400], [390, 410], [240, 340], [340, 335]].forEach(([x, y], i) => fruit(c, x, y, 62, i % 2 ? COL.red : COL.orange, i % 2 ? "#b73a28" : "#d27c25"));
  shadow(c, 305, 885, 240, 22);
  shape(c, bag, "#c9915a"); shade(c, bag, "#a8723f", -120, 0);
  line(c, [[110, 440], [180, 520], [250, 440]], 5); line(c, [[250, 440], [340, 510], [400, 440]], 5);
  // a flimsy tissue, torn: the fruit has fallen through
  [[730, 330], [830, 320], [920, 335]].forEach(([x, y], i) => fruit(c, x, y, 56, i === 1 ? COL.red : COL.orange, i === 1 ? "#b73a28" : "#d27c25"));
  const tis = () => { c.moveTo(640, 360); c.lineTo(1010, 360); c.lineTo(1000, 520); c.lineTo(960, 610); c.lineTo(920, 560); c.lineTo(880, 630); c.lineTo(840, 570); c.lineTo(800, 640); c.lineTo(760, 570); c.lineTo(720, 620); c.lineTo(670, 540); c.lineTo(650, 480); c.closePath(); };
  shape(c, tis, "#f9d6dd"); shade(c, tis, "#e9b7c4", -80, 0);
  fruit(c, 800, 760, 56); fruit(c, 900, 830, 56, COL.red, "#b73a28");
  arrow(c, [[670, 680], [670, 800]], RED, 11);
};
const t20 = (c: Ctx) => {
  ground(c);
  const finger = (x: number, topY: number, botY: number) => {
    shape(c, () => rrect(c, x - 40, topY, 80, botY - topY, 40), SKIN.child, 6);
    shade(c, () => rrect(c, x - 40, topY, 80, botY - topY, 40), SKIN.childDk, -26, 0);
    line(c, [[x - 12, topY + 50], [x + 12, topY + 50]], 4, SKIN.childDk);
  };
  const band = (x0: number, x1: number, y: number) => {
    const p = () => rrect(c, x0, y, x1 - x0, 64, 32);
    c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = 24; c.stroke();
    c.beginPath(); p(); c.strokeStyle = COL.yellow; c.lineWidth = 12; c.stroke();
  };
  finger(180, 190, 500); finger(900, 190, 500); band(140, 940, 250);
  arrow(c, [[300, 120], [150, 120]], RED, 11); arrow(c, [[780, 120], [930, 120]], RED, 11);
  line(c, [[60, 540], [1020, 540]], 5, "#b9b4ab");
  finger(440, 710, 1030); finger(640, 710, 1030); band(410, 670, 770);
  arrow(c, [[300, 840], [390, 840]], RED, 11); arrow(c, [[780, 840], [690, 840]], RED, 11);
};
const t22 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 830, 440, 24);
  const chalk = () => rrect(c, 110, 560, 860, 150, 30);
  shape(c, chalk, "#f7f5ee"); shade(c, chalk, "#d9d6cc", -0, -120, 0.7);
  line(c, [[130, 590], [900, 590]], 5, "rgba(43,35,64,0.12)");
  line(c, [[250, 640], [610, 640]], 7, "#8d8b84"); line(c, [[250, 650], [610, 650]], 3, WHITE);
  [[330, 680], [430, 690], [520, 685]].forEach(([x, y]) => { c.beginPath(); ell(c, x, y, 8, 5); c.fillStyle = WHITE; c.fill(); });
  c.save(); c.translate(620, 640); c.rotate(-0.8);
  shape(c, () => rrect(c, 0, -15, 360, 30, 8), COL.steel, 6);
  shape(c, () => rrect(c, 20, 14, 36, 30, 4), COL.steel, 5); shape(c, () => rrect(c, 80, 14, 50, 22, 4), COL.steel, 5);
  shape(c, () => ell(c, 430, 0, 78, 78), COL.steel, 6); shape(c, () => ell(c, 430, 0, 36, 36), "#efe4cf", 6);
  c.restore();
  arrow(c, [[500, 820], [740, 820]], RED, 12);
};
const t25 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 250, 22);
  const pk = () => { c.moveTo(330, 230); c.lineTo(790, 230); c.lineTo(770, 880); c.lineTo(350, 880); c.closePath(); };
  shape(c, pk, WHITE);
  shade(c, pk, "#d6e6f5", -100, 0);
  for (let k = 0; k < 14; k++) { line(c, [[345 + k * 32, 175], [345 + k * 32, 230]], 3, COL.steelDk); line(c, [[352 + k * 31, 880], [352 + k * 31, 925]], 3, COL.steelDk); }
  shape(c, () => rrect(c, 330, 170, 460, 60, 4), "#dfe5ec", 6); shape(c, () => rrect(c, 350, 880, 420, 48, 4), "#dfe5ec", 6);
  shape(c, () => polyP(c, [[338, 520], [782, 520], [776, 680], [344, 680]]), COL.blue, 5);
  drop(c, 560, 600, 38, WHITE);
  // a small notch, and the tear that runs from it
  shape(c, () => polyP(c, [[796, 306], [756, 346], [798, 386]]), "#efe4cf", 5);
  shape(c, () => polyP(c, [[764, 330], [764, 362], [500, 442]]), "#efe4cf", 5);
  line(c, [[764, 346], [650, 372], [600, 398], [500, 438]], 6);
  arrow(c, [[740, 296], [620, 330]], RED, 10);
};
// ---------------------------------------------------------------- explanations
const x2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 860, 460, 24);
  [[270, 12], [540, 14], [810, 15]].forEach(([x, n]) => {
    for (let i = 0; i < n; i++) shape(c, () => rrect(c, x - 76, 860 - (i + 1) * 24, 152, 24, 9), i % 2 ? "#dfe3ea" : COL.steel, 4);
    write(c, String(n), x - 56, 860 - n * 24 - 100, 70, INK, 8);
  });
  c.beginPath(); ell(c, 540, 860 - 14 * 12 - 18, 128, 14 * 12 + 120); c.strokeStyle = RED; c.lineWidth = 10; c.stroke();
};
const weave = (c: Ctx, cx: number, cy: number, step: number, tw: number, col: string, dk: string) => {
  const n = Math.ceil(520 / step), x0 = cx - (n * step) / 2, y0 = cy - (n * step) / 2;
  const vert = (i: number, j: number) => shape(c, () => rrect(c, x0 + i * step + (step - tw) / 2, y0 + j * step, tw, step + 2, tw / 2), col, 3);
  const hori = (i: number, j: number) => shape(c, () => rrect(c, x0 + i * step, y0 + j * step + (step - tw) / 2, step + 2, tw, tw / 2), dk, 3);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) vert(i, j);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) hori(i, j);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2 === 0) vert(i, j);
};
const x4 = (c: Ctx) => {
  ground(c);
  // tight weave: a drop sits on top. loose weave: drops go through the gaps.
  [[270, 540, 40, 30, false], [810, 540, 100, 28, true]].forEach(([x, y, step, tw, loose]) => {
    lens(c, x as number, y as number, 240); c.fillStyle = "#cdbfa3"; c.fill();
    c.save(); lens(c, x as number, y as number, 240); c.clip();
    weave(c, x as number, y as number, step as number, tw as number, "#7aa6e0", "#3f6fb3");
    c.restore();
    lens(c, x as number, y as number, 240); c.strokeStyle = INK; c.lineWidth = 12; c.stroke();
    void loose;
  });
  drop(c, 270, 470, 62);
  drop(c, 810, 440, 40); arrow(c, [[810, 505], [810, 575]], RED, 10); drop(c, 790, 640, 28); drop(c, 840, 700, 24);
  arrow(c, [[270, 230], [270, 330]], RED, 10);
};
const x5 = (c: Ctx) => {
  ground(c);
  // a strip of towel dipped in water, and a close-up of its fibres with water in the gaps
  shadow(c, 190, 900, 130, 16);
  shape(c, () => rrect(c, 100, 760, 180, 130, 18), COL.glass, 5);
  c.fillStyle = "rgba(143,195,234,0.8)"; c.fillRect(106, 800, 168, 84);
  shape(c, () => rrect(c, 150, 250, 80, 600, 4), "#f3ead0", 5);
  c.fillStyle = "rgba(95,159,211,0.85)"; c.fillRect(153, 520, 74, 330);
  c.fillStyle = "rgba(143,195,234,0.8)"; c.fillRect(106, 800, 168, 84);
  arrow(c, [[320, 800], [320, 620], [320, 560]], RED, 10);
  lens(c, 700, 500, 300); c.fillStyle = "#dbeaf6"; c.fill();
  c.save(); lens(c, 700, 500, 300); c.clip();
  const r = rnd(21);
  for (let i = 0; i < 26; i++) {
    const x = 420 + r() * 560, y = 220 + r() * 560, an = r() * Math.PI, l = 130 + r() * 90, bend = (r() - 0.5) * 120;
    const pts = [[x - Math.cos(an) * l, y - Math.sin(an) * l], [x + Math.sin(an) * bend, y - Math.cos(an) * bend], [x + Math.cos(an) * l, y + Math.sin(an) * l]];
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
    c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke();
    c.strokeStyle = "#fffaf0"; c.lineWidth = 14; c.stroke();
  }
  for (let i = 0; i < 9; i++) drop(c, 480 + r() * 440, 300 + r() * 400, 14);
  c.restore();
  lens(c, 700, 500, 300); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  line(c, [[240, 520], [420, 300]], 4); line(c, [[240, 520], [430, 700]], 4);
  c.beginPath(); ell(c, 200, 520, 70, 40); c.strokeStyle = RED; c.lineWidth = 6; c.stroke();
  arrow(c, [[700, 640], [700, 560]], RED, 10);
};
const x7 = (c: Ctx) => {
  ground(c);
  const sheetL = 200, sheetR = 880, top = 280, bot = 800;
  // left: whole sheet, force spread evenly
  shape(c, () => rrect(c, sheetL, top, 260, bot - top, 6), COL.paper, 6);
  for (let k = 0; k < 8; k++) line(c, [[sheetL + 22 + k * 30, top + 6], [sheetL + 22 + k * 30, bot - 6]], 5, COL.orange);
  // right: a notch, the force crowds at its tip
  shape(c, () => rrect(c, 620, top, 260, bot - top, 6), COL.paper, 6);
  for (let k = 0; k < 8; k++) {
    const x0 = 642 + k * 30, xc = 762 + k * 14;
    c.beginPath();
    for (let y = top + 6; y <= bot - 6; y += 8) { const w = Math.exp(-(((y - 540) / 90) ** 2)); const x = x0 + (xc - x0) * w; if (y === top + 6) c.moveTo(x, y); else c.lineTo(x, y); }
    c.strokeStyle = COL.orange; c.lineWidth = 5; c.stroke();
  }
  shape(c, () => polyP(c, [[616, 522], [750, 540], [616, 558]]), "#efe4cf", 5);
  c.beginPath(); ell(c, 756, 540, 22, 22); c.strokeStyle = RED; c.lineWidth = 6; c.stroke();
  arrow(c, [[330, 230], [330, 150]], RED, 11); arrow(c, [[330, 850], [330, 930]], RED, 11);
  arrow(c, [[750, 230], [750, 150]], RED, 11); arrow(c, [[750, 850], [750, 930]], RED, 11);
};

// frame order: 0 intro, 1 summary, 2 flow.e1, 3 flow.e2, 4 flow.e3, 5 flow.e4, 6 flow.a1, 7 flow.a2, 8 flow.a3,
// 9 flow.a4, 10 flow.a5, 11 flow.a6, 12 flow.a7, 13 flow.p1, 14 flow.c1, 15 flow.c2, 16 flow.c3,
// 17 term.3, 18 term.17, 19 term.18, 20 term.19, 21 term.20, 22 term.22, 23 term.25,
// 24 expl.2, 25 expl.4, 26 expl.5, 27 expl.7
export const ic_materialsTestingMaterialsL3 = cards("sci.materials.testing-materials.L3 cards", [
  intro, summary, e1, e2, e3, e4, a1, a2, a3, a4, a5, a6, a7, p1, c1, c2, c3, t3, t17, t18, t19, t20, t22, t25, x2, x4, x5, x7,
]);
