import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, WHITE, SKIN, SH, arrow, shine, cards, D, ell, ground, hand, line, person, polyP, rnd, rrect, shade, shadow, shape, write, glass, bowl, plate } from "./flatKit";

// TRANSPARENT / OPAQUE L3 · picture cards for the lesson's activities, words and ideas.
// Bold ink outlines, flat colours, shade side, soft shadow. Same child and grown-up as the set-up cards.

const NIGHT = "#1d1b3a", DARK = "#14111f", TABLE = "#e3cfa6", WALL = "#f3e6c9", FLOOR = "#d9b98a";
const BUTTER = "rgba(255,246,214,0.7)", PAPER = "#fffdf6", RAYC = "#f2a516", GLOW = "rgba(255,226,120,0.40)", VIOLET = "#8b4fd0";

// ---------------------------------------------------------------- shared pieces
const ray = (c: Ctx, pts: number[][], col = RAYC) => arrow(c, pts, col, 8);
const beam = (c: Ctx, pts: number[][], a = 0.4) => { c.beginPath(); polyP(c, pts); c.fillStyle = `rgba(255,226,120,${a})`; c.fill(); };
const sunDisc = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 10, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.2, 0.5);
};
const torch = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -20, -30, 170, 60, 14), COL.teal);
  shape(c, () => polyP(c, [[150, -30], [205, -50], [205, 50], [150, 30]]), COL.steel);
  shape(c, () => ell(c, 207, 0, 10, 46), COL.yellow);
  c.restore();
};
const mango = (c: Ctx, x: number, y: number, s = 1, rot = -0.3) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const p = () => { c.moveTo(-95, 10); c.bezierCurveTo(-95, -70, 30, -90, 90, -30); c.bezierCurveTo(120, 20, 60, 80, -20, 80); c.bezierCurveTo(-70, 80, -95, 50, -95, 10); c.closePath(); };
  shape(c, p, COL.orange); shade(c, p, COL.red, 24, 16, 0.55);
  shape(c, () => ell(c, 10, -78, 14, 8), COL.greenDk, 4);
  shape(c, () => { c.moveTo(14, -80); c.quadraticCurveTo(60, -130, 110, -100); c.quadraticCurveTo(70, -76, 14, -80); c.closePath(); }, COL.leaf, 5);
  shine(c, [[-70, -20], [-50, -50]], 9);
  c.restore();
};
// a soft, out-of-focus blob of colour (no outline)
const blur = (c: Ctx, x: number, y: number, r: number, col: string) => {
  for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, x, y, r * (1.5 - i * 0.18), r * (1.5 - i * 0.18)); c.fillStyle = col; c.globalAlpha = 0.16; c.fill(); }
  c.globalAlpha = 1;
};
const tree = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 22 * s, y - 150 * s, 44 * s, 160 * s, 8), COL.brown);
  [[0, -230, 95], [-70, -170, 75], [70, -170, 75]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s), COL.leaf));
};
const treeBlur = (c: Ctx, x: number, y: number, s: number) => { blur(c, x, y - 190 * s, 110 * s, COL.leaf); blur(c, x, y - 40 * s, 40 * s, COL.brown); };
// a squiggly line of heat
const heat = (c: Ctx, x: number, y: number, len: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) pts.push([x + Math.sin(i * 1.1) * 14, y - (i / 12) * len]);
  line(c, pts, 8, RED);
};
// an upright slab seen from the side: x centre, y0 top, y1 bottom
const SLAB: Record<string, [string, number]> = { clear: ["rgba(190,225,248,0.7)", 5], frost: ["#eef4f6", 5], butter: ["#fff2c8", 5], steel: [COL.steel, 5] };
const slabSide = (c: Ctx, x: number, y0: number, y1: number, t: number, kind: string) => {
  shape(c, () => rrect(c, x - t / 2, y0, t, y1 - y0, 8), SLAB[kind][0], 6);
  if (kind === "steel") shade(c, () => rrect(c, x - t / 2, y0, t, y1 - y0, 8), COL.steelDk, t * 0.4, 0, 0.55);
  if (kind === "clear") shine(c, [[x - t * 0.15, y0 + 20], [x - t * 0.15, y0 + 70]], 7);
  if (kind === "frost") { const r = rnd(4); for (let i = 0; i < 14; i++) line(c, [[x - t / 2 + 6, y0 + 20 + r() * (y1 - y0 - 40)], [x + t / 2 - 6, y0 + 20 + r() * (y1 - y0 - 40)]], 3, COL.steelDk); }
};
const eye = (c: Ctx, x: number, y: number, w: number) => {
  const lid = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x, y - w * 0.62, x + w / 2, y); c.quadraticCurveTo(x, y + w * 0.62, x - w / 2, y); c.closePath(); };
  shape(c, lid, WHITE, 7);
  shape(c, () => ell(c, x, y, w * 0.25, w * 0.25), COL.brown, 0); shape(c, () => ell(c, x, y, w * 0.12, w * 0.12), DARK, 0);
};
const shades = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05 + head * 0.12;
  [-1, 1].forEach((s) => shape(c, () => rrect(c, x + s * head * 0.4 - head * 0.3, hy - head * 0.2, head * 0.6, head * 0.42, head * 0.14), INK, 4));
  line(c, [[x - head * 0.1, hy], [x + head * 0.1, hy]], 5);
};
const bulb = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.45, y + r * 0.8, r * 0.9, r * 0.8, 8), COL.steel);
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.3, y - r * 0.55]], 8);
};
const rays = (c: Ctx, x: number, y: number, r0: number, r1: number, n: number, a0 = 0, w = 8) => {
  for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI * 2; line(c, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], w, COL.orange); }
};
// a four-face view of a cube lantern face: bilinear point on a face
type Face = number[][];
const fp = (f: Face, u: number, v: number): number[] => { const top = [f[0][0] + (f[1][0] - f[0][0]) * u, f[0][1] + (f[1][1] - f[0][1]) * u], bot = [f[3][0] + (f[2][0] - f[3][0]) * u, f[3][1] + (f[2][1] - f[3][1]) * u]; return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v]; };
const win = (f: Face, u0: number, u1: number, v0: number, v1: number): number[][] => [fp(f, u0, v0), fp(f, u1, v0), fp(f, u1, v1), fp(f, u0, v1)];

// ================================================================ INTRO and SUMMARY
// intro: a child in a bathroom, a frosted window, light glowing in, no tree to be seen
const intro = (c: Ctx) => {
  ground(c, "#cfe6ea");
  c.fillStyle = FLOOR; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  for (let x = 0; x < D; x += 120) line(c, [[x, 0], [x, 800]], 2, "#b6d2d8");
  for (let y = 0; y < 800; y += 120) line(c, [[0, y], [D, y]], 2, "#b6d2d8");
  c.beginPath(); polyP(c, [[150, 580], [530, 580], [680, 1040], [20, 1040]]); c.fillStyle = "rgba(255,240,170,0.5)"; c.fill();
  shape(c, () => rrect(c, 130, 120, 420, 480, 12), COL.wood, 8);
  shape(c, () => rrect(c, 160, 150, 360, 420, 6), "#f4f8fa", 6);
  blur(c, 340, 330, 90, COL.leaf); blur(c, 340, 470, 30, COL.brown);
  line(c, [[340, 150], [340, 570]], 6); line(c, [[160, 360], [520, 360]], 6);
  shadow(c, 780, 1010, 200, 22);
  person(c, 770, 1000, 640, { armR: [2.5, 3.6], armL: [1.9, 1.7] });
  sunDisc(c, 880, 130, 55);
};

const treeScene = (c: Ctx, x0: number, w: number, kind: string, y: number) => {
  c.save(); c.beginPath(); c.rect(x0, y, w, 380); c.clip();
  c.fillStyle = COL.sky; c.fillRect(x0, y, w, 380);
  if (kind === "clear") tree(c, x0 + w / 2, y + 360, 0.85);
  else if (kind === "frost") treeBlur(c, x0 + w / 2, y + 360, 0.85);
  else { c.fillStyle = "#4a4660"; c.fillRect(x0, y, w, 380); }
  c.restore();
};
// summary: the same garden seen through glass, butter paper and a steel plate, and the patch of light each leaves
const summary = (c: Ctx) => {
  ground(c, BG);
  const xs = [60, 400, 740], w = 280, y = 210;
  sunDisc(c, 540, 85, 40);
  xs.forEach((x, i) => {
    const kind = ["clear", "frost", "steel"][i];
    treeScene(c, x, w, kind, y);
    if (kind === "frost") { c.fillStyle = "rgba(245,248,250,0.55)"; c.fillRect(x, y, w, 380); }
    if (kind === "clear") shine(c, [[x + 30, y + 30], [x + 100, y + 30]], 9);
    shape(c, () => rrect(c, x, y, w, 380, 6), "rgba(0,0,0,0)", 8);
    // the light left on the floor behind
    shadow(c, x + w / 2 + 10, 820, 130, 34);
    const a = [0.95, 0.5, 0][i];
    c.beginPath(); ell(c, x + w / 2, 790, 120, 34); c.fillStyle = `rgba(255,226,120,${a})`; c.fill();
    if (i === 2) { c.beginPath(); ell(c, x + w / 2, 790, 120, 34); c.fillStyle = "rgba(43,35,64,0.45)"; c.fill(); }
    c.beginPath(); ell(c, x + w / 2, 790, 120, 34); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
    line(c, [[x + w / 2, y + 380], [x + w / 2, 756]], 0.1, INK);
  });
  [0, 1, 2].forEach((i) => { const x = xs[i] + w / 2; ray(c, [[x, 660], [x, 735]], i === 2 ? "#6a6580" : RAYC); });
};

// ================================================================ FLOWS
// e1 the gap test: lift the butter paper off the card and watch the word blur
const GL: Record<string, number[][][]> = {
  L: [[[0.05, 0], [0.05, 1], [0.85, 1]]], I: [[[0.15, 0], [0.75, 0]], [[0.45, 0], [0.45, 1]], [[0.15, 1], [0.75, 1]]],
  G: [[[0.9, 0.15], [0.5, 0], [0.1, 0.2], [0, 0.5], [0.1, 0.8], [0.5, 1], [0.9, 0.85], [0.9, 0.55], [0.5, 0.55]]],
  H: [[[0.05, 0], [0.05, 1]], [[0.8, 0], [0.8, 1]], [[0.05, 0.5], [0.8, 0.5]]], T: [[[0, 0], [0.9, 0]], [[0.45, 0], [0.45, 1]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, w = h * 0.2, col = INK) => GL[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * h * 0.8, y + v * h]), w, col));
const e1 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 520, 1000, 420, 22);
  shape(c, () => rrect(c, 90, 740, 860, 250, 14), WHITE, 6);
  c.globalAlpha = 0.17;
  [..."LIGHT"].forEach((ch, i) => { for (const [dx, dy] of [[-9, -6], [9, -6], [-9, 7], [9, 7], [0, 0]]) letter(c, ch, 150 + i * 150 + dx, 790 + dy, 150, 30, COL.greyDk); });
  c.globalAlpha = 1;
  shape(c, () => polyP(c, [[130, 480], [800, 480], [860, 560], [70, 560]]), BUTTER, 6);
  hand(c, 40, 520, 0, 1.3, SKIN.child, CLOTH.child, false);
  arrow(c, [[450, 700], [450, 590]]);
  // a wooden ruler standing beside the card
  shape(c, () => rrect(c, 960, 300, 70, 690, 6), COL.wood, 6);
  for (let i = 0; i < 12; i++) line(c, [[960, 960 - i * 55], [960 + (i % 2 ? 24 : 40), 960 - i * 55]], 4);
  line(c, [[880, 560], [960, 560]], 6, RED);
};
// e2 the oil spot: a drop of oil makes a clear window in the paper
const e2 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 540, 960, 440, 20);
  shape(c, () => rrect(c, 80, 230, 920, 700, 8), "#ece6d6", 6);
  for (let r = 0; r < 24; r++) line(c, [[110, 260 + r * 27], [r % 3 === 1 ? 900 : 970, 260 + r * 27]], 11, INK);
  shape(c, () => rrect(c, 80, 230, 920, 140, 0), "#ece6d6", 0);
  c.save(); c.beginPath(); rrect(c, 80, 230, 920, 700, 8); c.clip(); c.fillStyle = "#ece6d6"; c.fillRect(80, 230, 920, 140); c.restore();
  const px = 200, py = 330, pw = 680, ph = 500;
  shape(c, () => rrect(c, px, py, pw, ph, 8), PAPER, 6);
  c.save(); c.beginPath(); ell(c, 540, 590, 190, 150); c.clip();
  c.fillStyle = PAPER; c.fillRect(px, py, pw, ph);
  c.globalAlpha = 0.9; for (let r = 0; r < 24; r++) line(c, [[110, 260 + r * 27], [r % 3 === 1 ? 900 : 970, 260 + r * 27]], 11, INK);
  c.restore(); c.globalAlpha = 1;
  c.beginPath(); ell(c, 540, 590, 190, 150); c.strokeStyle = "#e0a710"; c.lineWidth = 10; c.stroke();
  // the drop of oil falling
  shape(c, () => { c.moveTo(540, 100); c.bezierCurveTo(600, 190, 590, 250, 540, 250); c.bezierCurveTo(490, 250, 480, 190, 540, 100); c.closePath(); }, "#f0b829", 5);
  shine(c, [[515, 175], [520, 215]], 6);
  arrow(c, [[540, 270], [540, 360]]);
};
// a1 glowing hands: a torch pressed under the fingertips in a dark room
const a1 = (c: Ctx) => {
  ground(c, NIGHT);
  hand(c, 190, 400, 0, 3.6, SKIN.child, CLOTH.child, true);
  torch(c, 600, 720, -Math.PI / 2, 1.2);
  c.fillStyle = "rgba(20,17,31,0.55)"; c.fillRect(0, 0, D, D);
  const g = c.createRadialGradient(640, 430, 10, 640, 430, 300); g.addColorStop(0, "rgba(255,90,70,0.95)"); g.addColorStop(1, "rgba(255,90,70,0)");
  c.fillStyle = g; c.fillRect(200, 150, 700, 600);
  // the glowing tips
  [[0, 330], [1, 365], [2, 400], [3, 435]].forEach(([k, y]) => { shape(c, () => rrect(c, 440, y - 13, 190 - k * 8, 26, 13), "rgba(255,120,95,0.75)", 0); });
  c.fillStyle = "rgba(255,226,120,0.35)"; c.beginPath(); polyP(c, [[570, 460], [630, 460], [680, 400], [520, 400]]); c.fill();
};
// a2 where did the sugar go
const a2 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 300, 840, 260, 40);
  shape(c, () => ell(c, 280, 780, 250, 90), "#3a3540", 6);
  shape(c, () => ell(c, 280, 775, 205, 68), "#4a4452", 4);
  shape(c, () => { c.moveTo(150, 770); c.quadraticCurveTo(280, 560, 410, 770); c.quadraticCurveTo(280, 800, 150, 770); c.closePath(); }, WHITE, 5);
  const r = rnd(3); for (let i = 0; i < 40; i++) { const x = 190 + r() * 180, y = 690 + r() * 80; if (y > 790 - Math.abs(x - 280) * 0.1) continue; shape(c, () => rrect(c, x, y, 9, 9, 2), "#e8eef2", 2); }
  glass(c, 770, 900, 290, 460, 0.82);
  for (let i = 0; i < 6; i++) shape(c, () => rrect(c, 710 + i * 22, 650 + (i % 3) * 60, 9, 9, 2), WHITE, 2);
  line(c, [[860, 430], [740, 760]], 18, INK); line(c, [[860, 430], [740, 760]], 8, COL.steel);
  arrow(c, [[400, 520], [520, 400], [650, 400]]);
};
const cube = (c: Ctx, x: number, y: number, s: number, cloudy: boolean) => {
  const a = s * 0.42, front = () => rrect(c, x, y, s, s, 22);
  shape(c, () => polyP(c, [[x, y], [x + a, y - a * 0.7], [x + s + a, y - a * 0.7], [x + s, y]]), cloudy ? "#f7fafc" : "#dff1fa", 6);
  shape(c, () => polyP(c, [[x + s, y], [x + s + a, y - a * 0.7], [x + s + a, y + s - a * 0.7], [x + s, y + s]]), cloudy ? "#dbe3ea" : "#b5dcf0", 6);
  shape(c, front, cloudy ? "#f1f5f8" : "rgba(206,234,248,0.85)", 6);
};
// a3 cloudy ice, clear ice
const a3 = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = TABLE; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 6);
  mango(c, 270, 560, 1.2, 0); mango(c, 790, 560, 1.2, 0);
  cube(c, 80, 440, 330, true);
  cube(c, 580, 440, 330, false);
  shine(c, [[620, 480], [620, 560]], 12);
  // cloudy flecks
  const r = rnd(8); for (let i = 0; i < 16; i++) line(c, [[130 + r() * 270, 470 + r() * 270], [150 + r() * 270, 480 + r() * 270]], 6, "#cfd8df");
  // the mango seen through the clear cube
  c.save(); c.beginPath(); rrect(c, 580, 440, 330, 330, 22); c.clip(); c.globalAlpha = 0.9; mango(c, 750, 600, 1.0, 0); c.restore(); c.globalAlpha = 1;
  shape(c, () => rrect(c, 580, 440, 330, 330, 22), "rgba(206,234,248,0.35)", 6);
  shadow(c, 270, 860, 240, 22); shadow(c, 770, 860, 240, 22);
};
// a4 day curtain: from the dim room you see through a thin curtain into the bright room
const a4 = (c: Ctx) => {
  ground(c, "#ffe9a0");
  person(c, 700, 960, 640, { adult: true, armL: [-1.2, -1.7], armR: [1.9, 1.7] });
  c.fillStyle = "rgba(255,253,246,0.78)"; c.fillRect(380, 80, 400, 880);
  for (let i = 0; i < 6; i++) line(c, [[430 + i * 65, 100], [430 + i * 65, 940]], 4, "#d8cfb4");
  shape(c, () => rrect(c, 365, 70, 430, 900, 8), "rgba(0,0,0,0)", 9);
  line(c, [[340, 80], [830, 80]], 12, COL.brown);
  // the dim room on the left
  c.fillStyle = "#3b3a63"; c.fillRect(0, 0, 365, D);
  c.fillStyle = "#2a2850"; c.fillRect(0, 960, 365, 120);
  person(c, 190, 1010, 600);
  c.fillStyle = "rgba(20,16,50,0.35)"; c.fillRect(0, 0, 365, D);
  eye(c, 250, 130, 90);
  arrow(c, [[300, 190], [420, 190]], RAYC);
};
// a5 the light party: glass atoms stand still, the light walks straight through
const a5 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  [150, 560, 930].forEach((x) => person(c, x, 800, 330, { armL: [1.2, 2.7], armR: [1.9, 0.4] }));
  // the light: a glowing child between the atoms
  c.beginPath(); ell(c, 360, 790, 150, 220); c.fillStyle = GLOW; c.fill();
  c.beginPath(); ell(c, 360, 790, 100, 160); c.fillStyle = "rgba(255,226,120,0.4)"; c.fill();
  person(c, 360, 1010, 430);
  sunDisc(c, 360, 380, 38);
  arrow(c, [[180, 1050], [620, 1050]]);
};
// p1 the three-light lantern
const p1 = (c: Ctx) => {
  ground(c, NIGHT);
  c.beginPath(); ell(c, 540, 600, 480, 400); c.fillStyle = "rgba(255,226,120,0.12)"; c.fill();
  const L: Face = [[200, 340], [540, 490], [540, 890], [200, 740]], R: Face = [[540, 490], [880, 340], [880, 740], [540, 890]], T: Face = [[200, 340], [540, 190], [880, 340], [540, 490]];
  shape(c, () => polyP(c, T), "#e8bd84", 6);
  shape(c, () => polyP(c, L), "#d9a066", 6);
  shape(c, () => polyP(c, R), "#a8723f", 6);
  // left window: clear plastic, the light inside is sharp
  const wl = win(L, 0.2, 0.8, 0.22, 0.78), wr = win(R, 0.2, 0.8, 0.22, 0.78);
  shape(c, () => polyP(c, wl), "#fff4c2", 6);
  const cl = fp(L, 0.5, 0.5);
  shape(c, () => ell(c, cl[0], cl[1], 38, 46), WHITE, 0); shape(c, () => ell(c, cl[0], cl[1], 20, 28), COL.yellow, 0);
  // right window: butter paper, the light is a soft glow
  shape(c, () => polyP(c, wr), "#fbe9ae", 6);
  const cr = fp(R, 0.5, 0.5); blur(c, cr[0], cr[1], 46, "#ffd34d");
  shape(c, () => polyP(c, wr), "rgba(0,0,0,0)", 6);
  line(c, [[540, 490], [540, 890]], 6);
};
// c1 a dark bottle with one clear strip to read the level
const c1 = (c: Ctx) => {
  ground(c, BG);
  shadow(c, 600, 940, 270, 26);
  const body = () => { c.moveTo(380, 360); c.lineTo(380, 880); c.quadraticCurveTo(380, 920, 420, 920); c.lineTo(760, 920); c.quadraticCurveTo(800, 920, 800, 880); c.lineTo(800, 360); c.quadraticCurveTo(800, 320, 700, 290); c.lineTo(690, 190); c.lineTo(490, 190); c.lineTo(480, 290); c.quadraticCurveTo(380, 320, 380, 360); c.closePath(); };
  shape(c, body, "#6a4128", 7);
  shade(c, body, "#4d2d18", 70, 0, 0.55);
  shape(c, () => rrect(c, 475, 120, 220, 90, 14), COL.red, 6);
  // the clear strip with milk to the half way
  shape(c, () => rrect(c, 560, 380, 70, 480, 12), "#e8f5fc", 6);
  shape(c, () => rrect(c, 560, 620, 70, 240, 12), WHITE, 6);
  line(c, [[560, 620], [630, 620]], 5);
  shine(c, [[575, 405], [575, 560]], 7);
  // sunlight stopped by the dark bottle
  sunDisc(c, 150, 140, 55);
  ray(c, [[200, 330], [330, 440]], RAYC); ray(c, [[170, 420], [330, 560]], RAYC); ray(c, [[140, 520], [330, 680]], RAYC);
  // an eye reads the level
  eye(c, 930, 640, 100); arrow(c, [[880, 640], [650, 640]], RED);
};
// c2 a soft night-light: a butter-paper shade, a gentle glow, a child asleep
const c2 = (c: Ctx) => {
  ground(c, "#2d2a57");
  c.beginPath(); ell(c, 540, 480, 520, 400); c.fillStyle = "rgba(255,226,140,0.10)"; c.fill();
  c.beginPath(); ell(c, 540, 480, 380, 300); c.fillStyle = "rgba(255,226,140,0.14)"; c.fill();
  c.beginPath(); ell(c, 540, 480, 250, 200); c.fillStyle = "rgba(255,226,140,0.2)"; c.fill();
  c.fillStyle = "#3b376b"; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 6);
  // table, base and shade
  shape(c, () => rrect(c, 330, 700, 420, 40, 8), COL.brown); shape(c, () => rrect(c, 360, 740, 40, 130, 6), COL.brown); shape(c, () => rrect(c, 680, 740, 40, 130, 6), COL.brown);
  shape(c, () => rrect(c, 500, 640, 80, 70, 10), COL.teal);
  shape(c, () => { c.moveTo(380, 640); c.bezierCurveTo(390, 380, 690, 380, 700, 640); c.closePath(); }, "#fff0c0", 7);
  blur(c, 540, 540, 70, "#ffd34d");
  shape(c, () => { c.moveTo(380, 640); c.bezierCurveTo(390, 380, 690, 380, 700, 640); c.closePath(); }, "rgba(0,0,0,0)", 7);
  // bed with a child asleep
  shape(c, () => rrect(c, 90, 900, 900, 120, 20), COL.purple); shape(c, () => rrect(c, 90, 860, 260, 70, 20), WHITE);
  shape(c, () => ell(c, 220, 880, 70, 56), SKIN.child, 6);
  shape(c, () => { c.moveTo(150, 880); c.bezierCurveTo(150, 810, 290, 810, 290, 880); c.quadraticCurveTo(220, 850, 150, 880); c.closePath(); }, CLOTH.hair, 5);
  line(c, [[195, 886], [215, 886]], 5); line(c, [[240, 886], [260, 886]], 5);
  shape(c, () => rrect(c, 290, 880, 700, 130, 24), "#6c5aa8", 6);
};

// ================================================================ TERMS
const t0 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  sunDisc(c, 270, 280, 105);
  bulb(c, 790, 280, 90); rays(c, 790, 280, 120, 165, 10, 0.2);
  // a candle
  shape(c, () => rrect(c, 490, 740, 100, 250, 10), WHITE, 6);
  shade(c, () => rrect(c, 490, 740, 100, 250, 10), COL.grey, 40, 0, 0.5);
  line(c, [[540, 740], [540, 715]], 6);
  shape(c, () => { c.moveTo(540, 580); c.bezierCurveTo(600, 650, 590, 720, 540, 722); c.bezierCurveTo(490, 720, 480, 650, 540, 580); c.closePath(); }, COL.orange, 6);
  shape(c, () => { c.moveTo(540, 650); c.bezierCurveTo(570, 680, 565, 715, 540, 716); c.bezierCurveTo(515, 715, 510, 680, 540, 650); c.closePath(); }, COL.yellow, 0);
  rays(c, 540, 665, 90, 130, 8, 0.4);
};
const t1 = (c: Ctx) => {
  ground(c, BG);
  const tiles: [number, number, string][] = [[50, 50, "#dbeaf5"], [560, 50, "#f6dccb"], [50, 560, "#f0e2b6"], [560, 560, "#e2e6ec"]];
  tiles.forEach(([x, y, col]) => shape(c, () => rrect(c, x, y, 470, 470, 26), col, 6));
  glass(c, 285, 400, 190, 270, 0);
  // cloth
  shape(c, () => rrect(c, 640, 330, 300, 80, 14), COL.pink); shape(c, () => rrect(c, 630, 250, 320, 80, 14), COL.red); shape(c, () => rrect(c, 650, 170, 280, 80, 14), COL.pink);
  for (let i = 0; i < 6; i++) line(c, [[670 + i * 45, 180], [670 + i * 45, 240]], 4, COL.red);
  // wood
  shadow(c, 320, 940, 150, 20);
  shape(c, () => polyP(c, [[160, 760], [460, 760], [510, 700], [210, 700]]), COL.wood, 6);
  shape(c, () => rrect(c, 160, 760, 300, 170, 6), COL.woodDk, 6);
  for (let i = 0; i < 4; i++) line(c, [[180, 790 + i * 36], [440, 790 + i * 36]], 4, COL.brown);
  // steel
  bowl(c, 795, 760, 150);
};
const t2 = (c: Ctx) => {
  ground(c, BG);
  mango(c, 540, 600, 1.4, 0);
  shape(c, () => rrect(c, 230, 160, 620, 700, 14), "rgba(206,234,248,0.38)", 9);
  shine(c, [[290, 220], [290, 330]], 14); shine(c, [[340, 220], [340, 250]], 14);
  shadow(c, 540, 930, 330, 28);
  [330, 540, 750].forEach((y, i) => i === 1 && 0 && y);
  ray(c, [[40, 400], [980, 400]]); ray(c, [[40, 760], [980, 760]]);
};
const t3 = (c: Ctx) => {
  ground(c, BG);
  torch(c, 20, 540, 0, 1.0);
  beam(c, [[227, 500], [430, 440], [430, 640], [227, 580]], 0.35);
  slabSide(c, 460, 360, 720, 60, "frost");
  ray(c, [[227, 540], [425, 540]]);
  [[-0.7, 0.8], [-0.4, 0.6], [-0.15, 0.3], [0.15, 0.3], [0.4, 0.6], [0.7, 0.8]].forEach(([s, l]) => ray(c, [[500, 540], [500 + Math.cos(s) * 480 * l + 20, 540 + Math.sin(s) * 480 * l]]));
};
const t4 = (c: Ctx) => {
  ground(c, "#2d2a57");
  bulb(c, 190, 500, 70); rays(c, 190, 500, 100, 140, 8, 0.2);
  c.beginPath(); ell(c, 620, 520, 380, 400); c.fillStyle = "rgba(255,226,120,0.14)"; c.fill();
  blur(c, 640, 560, 150, COL.orange); blur(c, 640, 390, 60, COL.orange);
  shape(c, () => polyP(c, [[470, 150], [800, 190], [800, 880], [470, 920]]), "rgba(255,246,214,0.55)", 8);
  shape(c, () => ell(c, 720, 520, 80, 40), "rgba(255,246,214,0.5)", 0);
  ray(c, [[290, 500], [440, 500]]);
};
const t5 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  sunDisc(c, 170, 150, 70);
  ray(c, [[280, 270], [440, 370]]); ray(c, [[220, 290], [340, 440]]); ray(c, [[330, 210], [520, 310]]);
  line(c, [[640, 500], [640, 900]], 20, INK); line(c, [[640, 500], [640, 900]], 10, COL.greyDk);
  const dome = () => { c.moveTo(340, 520); c.bezierCurveTo(350, 330, 930, 330, 940, 520); c.quadraticCurveTo(880, 480, 790, 520); c.quadraticCurveTo(715, 470, 640, 520); c.quadraticCurveTo(565, 470, 490, 520); c.quadraticCurveTo(410, 480, 340, 520); c.closePath(); };
  shape(c, dome, "#3a3540", 7);
  [-200, -100, 0, 100, 200].forEach((d) => line(c, [[640, 380], [640 + d * 1.3, 500]], 4, "#5a5468"));
  [560, 700, 840].forEach((x, i) => heat(c, x, 330 - (i % 2) * 20, 140));
};
const t6 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = TABLE; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  torch(c, 20, 500, 0, 1.0);
  beam(c, [[227, 455], [560, 330], [560, 760], [227, 545]], 0.35);
  // the shadow behind the plate
  c.beginPath(); polyP(c, [[600, 330], [1080, 330], [1080, 760], [600, 760]]); c.fillStyle = "rgba(43,35,64,0.4)"; c.fill();
  shape(c, () => polyP(c, [[600, 760], [1080, 760], [1080, 820], [560, 820]]), "rgba(43,35,64,0.35)", 0);
  slabSide(c, 580, 330, 760, 70, "steel");
  ray(c, [[227, 500], [545, 500]]);
};
const t7 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  c.fillStyle = "#cdb47f"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  sunDisc(c, 160, 150, 70);
  c.beginPath(); polyP(c, [[330, 880], [440, 880], [1000, 900], [900, 940]]); c.fillStyle = "rgba(43,35,64,0.42)"; c.fill();
  c.beginPath(); ell(c, 340, 900, 140, 30); c.fillStyle = "rgba(43,35,64,0.42)"; c.fill();
  person(c, 370, 880, 520);
  ray(c, [[260, 250], [300, 340]], RAYC);
};
const t10 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  sunDisc(c, 150, 160, 70);
  person(c, 700, 1020, 800);
  shades(c, 700, 1020, 800);
  const hx = 700, hy = 1020 - 800 * 0.74 - 800 * 0.13 * 1.05 + 800 * 0.13 * 0.12;
  [0, 1, 2].forEach((i) => ray(c, [[300, hy - 100 + i * 100], [hx - 130, hy - 20 + i * 60]], VIOLET));
  [0, 1, 2].forEach((i) => line(c, [[hx - 130, hy - 20 + i * 60 - 28], [hx - 106, hy - 20 + i * 60 + 28]], 7, RED));
};
const t11 = (c: Ctx) => {
  ground(c, "#fffbe6");
  sunDisc(c, 850, 170, 80);
  rays(c, 850, 170, 150, 220, 14, 0.1, 12);
  // a child squinting, a hand over the brow
  shape(c, () => rrect(c, 460, 760, 160, 240, 30), SKIN.childDk, 6);
  shape(c, () => ell(c, 540, 560, 230, 245), SKIN.child, 7);
  shape(c, () => { c.moveTo(310, 560); c.bezierCurveTo(300, 270, 780, 270, 770, 560); c.quadraticCurveTo(700, 400, 540, 410); c.quadraticCurveTo(380, 400, 310, 560); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 320, 600, 36, 52), SKIN.childDk, 5); shape(c, () => ell(c, 760, 600, 36, 52), SKIN.childDk, 5);
  line(c, [[390, 570], [470, 580]], 12); line(c, [[610, 580], [690, 570]], 12);
  line(c, [[400, 545], [455, 555]], 5); line(c, [[625, 555], [680, 545]], 5);
  line(c, [[470, 730], [610, 730]], 8);
  hand(c, 880, 440, Math.PI, 2.4, SKIN.child, CLOTH.child, true);
};
const t13 = (c: Ctx) => {
  ground(c, BG);
  c.fillStyle = TABLE; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  const kinds = ["clear", "frost", "steel"];
  [0, 1, 2].forEach((i) => {
    const gx = 40 + i * 350;
    torch(c, gx, 540, 0, 0.5);
    beam(c, [[gx + 103, 515], [gx + 220, 470], [gx + 220, 610], [gx + 103, 565]], 0.35);
    slabSide(c, gx + 245, 400, 700, 50, kinds[i]);
    shadow(c, gx + 160, 790, 150, 16);
    line(c, [[gx + 103, 760], [gx + 220, 760]], 7, RED);
    line(c, [[gx + 103, 745], [gx + 103, 775]], 7, RED); line(c, [[gx + 220, 745], [gx + 220, 775]], 7, RED);
    // the same ruler mark and the same height
    shape(c, () => rrect(c, gx + 40, 880, 220, 60, 8), COL.wood, 5);
    for (let k = 0; k < 8; k++) line(c, [[gx + 62 + k * 26, 880], [gx + 62 + k * 26, 900 + (k % 2) * 10]], 3);
  });
};
const t14 = (c: Ctx) => {
  ground(c, "#cfe6f5");
  // a drop, zooming into a ring that shows its molecules
  shape(c, () => { c.moveTo(160, 330); c.bezierCurveTo(260, 470, 280, 590, 160, 600); c.bezierCurveTo(40, 590, 60, 470, 160, 330); c.closePath(); }, COL.water, 6);
  shine(c, [[110, 480], [120, 540]], 9);
  arrow(c, [[260, 480], [400, 480]]);
  shape(c, () => ell(c, 720, 520, 310, 310), "#f3faff", 8);
  const mol = (x: number, y: number, s: number, rot: number) => {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    const h1 = [-62, 46], h2 = [62, 46];
    line(c, [[0, 0], h1], 14); line(c, [[0, 0], h2], 14);
    shape(c, () => ell(c, h1[0], h1[1], 30, 30), WHITE, 6); shape(c, () => ell(c, h2[0], h2[1], 30, 30), WHITE, 6);
    shape(c, () => ell(c, 0, 0, 52, 52), COL.red, 6);
    c.restore();
  };
  mol(640, 420, 1.0, 0.3); mol(800, 600, 1.0, -0.5); mol(600, 640, 0.9, 2.6); mol(810, 400, 0.8, 3.6);
};

// ================================================================ EXPLANATIONS
const e0 = (c: Ctx) => {
  ground(c, BG);
  const rowsY = [210, 540, 870], kinds = ["clear", "frost", "steel"];
  rowsY.forEach((y, i) => {
    shape(c, () => rrect(c, 30, y - 135, 1020, 270, 24), "#f4ebd8", 4);
    ray(c, [[70, y], [400, y]]);
    slabSide(c, 450, y - 105, y + 105, 44, kinds[i]);
  });
  ray(c, [[500, rowsY[0]], [1000, rowsY[0]]]);
  [-0.5, -0.25, 0, 0.25, 0.5].forEach((s) => ray(c, [[490, rowsY[1]], [490 + Math.cos(s) * 380, rowsY[1] + Math.sin(s) * 380]]));
  ray(c, [[420, rowsY[2] - 10], [250, rowsY[2] - 90]], "#6a6580"); ray(c, [[420, rowsY[2] + 10], [250, rowsY[2] + 90]], "#6a6580");
  [700, 800, 900].forEach((x) => { c.beginPath(); ell(c, x, rowsY[2], 20, 20); c.fillStyle = "rgba(43,35,64,0.35)"; c.fill(); });
};
const e1x = (c: Ctx) => {
  ground(c, BG);
  mango(c, 150, 540, 1.1, 0);
  slabSide(c, 480, 290, 790, 60, "clear");
  [430, 540, 650].forEach((y) => ray(c, [[230, y + (y - 540) * 0.15], [850, y + (y - 540) * 0.15]]));
  eye(c, 930, 540, 150);
};
const e2x = (c: Ctx) => {
  ground(c, BG);
  mango(c, 150, 540, 1.1, 0);
  slabSide(c, 480, 290, 790, 60, "frost");
  [450, 540, 630].forEach((y) => ray(c, [[230, y], [450, y]]));
  [[-0.6, 330], [-0.25, 400], [0.1, 420], [0.45, 370]].forEach(([s, l]) => ray(c, [[515, 540], [515 + Math.cos(s) * l * 0.85, 540 + Math.sin(s) * l]]));
  eye(c, 950, 540, 130);
  blur(c, 950, 300, 60, COL.orange);
};
const e3x = (c: Ctx) => {
  ground(c, BG);
  torch(c, 20, 540, 0, 1.0);
  slabSide(c, 560, 250, 830, 120, "steel");
  [440, 540, 640].forEach((y) => ray(c, [[227, y], [480, y]]));
  ray(c, [[480, 480], [330, 360]], "#6a6580"); ray(c, [[480, 600], [330, 720]], "#6a6580");
  [620, 770].forEach((y) => heat(c, 590 + (y - 620) * 0.05, y, 120));
  c.beginPath(); polyP(c, [[640, 250], [1080, 250], [1080, 830], [640, 830]]); c.fillStyle = "rgba(43,35,64,0.25)"; c.fill();
};
const piece = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => polyP(c, [[-s, -s * 0.6], [s * 0.7, -s], [s, s * 0.5], [-s * 0.4, s]]), "#f4f8fb", 5);
  c.restore();
};
const e4x = (c: Ctx) => {
  ground(c, BG);
  // left: one clear block, the ray goes straight
  shape(c, () => rrect(c, 40, 330, 360, 360, 20), "rgba(206,234,248,0.8)", 7);
  shine(c, [[80, 370], [80, 450]], 12);
  ray(c, [[0, 510], [440, 510]]);
  // right: crushed ice, the ray bounces about
  const r = rnd(12);
  for (let i = 0; i < 28; i++) piece(c, 560 + (i % 7) * 70 + r() * 20, 340 + Math.floor(i / 7) * 90 + r() * 20, 36 + r() * 8, r() * 6);
  line(c, [[500, 510], [600, 440], [700, 560], [770, 410], [860, 590]], 8, RAYC);
  ray(c, [[860, 590], [960, 470]]);
};
const e5x = (c: Ctx) => {
  ground(c, BG);
  const atoms = (y: number, col: string, n: number) => { for (let i = 0; i < n; i++) shape(c, () => ell(c, 130 + i * 170, y, 55, 55), col, 6); };
  shape(c, () => rrect(c, 30, 60, 1020, 440, 24), "#eaf3f9", 4);
  shape(c, () => rrect(c, 30, 580, 1020, 440, 24), "#eceef2", 4);
  atoms(180, COL.blue, 6); atoms(380, COL.blue, 6);
  ray(c, [[20, 280], [1040, 280]]);
  atoms(660, COL.steelDk, 6); atoms(900, COL.steelDk, 6);
  const r = rnd(5);
  for (let i = 0; i < 24; i++) shape(c, () => ell(c, 80 + r() * 920, 780 + (r() - 0.5) * 60, 14, 14), COL.yellow, 4);
  ray(c, [[20, 780], [380, 780]]); ray(c, [[380, 780], [240, 600]], "#6a6580");
};

export const ic_lightTransparentOpaqueL3 = cards("sci.light.transparent-opaque.L3 cards", [
  intro, summary, e1, e2, a1, a2, a3, a4, a5, p1, c1, c2,
  t0, t1, t2, t3, t4, t5, t6, t7, t10, t11, t13, t14,
  e0, e1x, e2x, e3x, e4x, e5x,
]);
