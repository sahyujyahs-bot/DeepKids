import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, write, cards, bowl, hand } from "./flatKit";

// SOURCES OF SOUND (sci.sound.sources-of-sound.L4) · 24 set-up cards then card pictures.
// People stand behind a table (clipped at the table's back edge) and every hand is placed with reachL / reachR.

const PI = Math.PI;
type Pt = [number, number];
type Hands = ReturnType<typeof person>;
const WALL = "#f6efe0", FLOOR = "#e3d3b4", TABLE = "#ecc98f", TABLEDK = "#cf9f58", TILE = "#d6ece8", TILELINE = "#a9d3cc", PAPER = "#fffdf6";

// ---------------------------------------------------------------- rooms and tables
const room = (c: Ctx, floorY: number) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, floorY, D, D - floorY); line(c, [[0, floorY], [D, floorY]], 5); };
const stage = (c: Ctx, yt: number, depth = 110, bare = false) => {
  if (!bare) ground(c, WALL);
  shape(c, () => polyP(c, [[-10, yt], [D + 10, yt], [D + 10, yt + depth], [-10, yt + depth]]), TABLE, 5);
  shape(c, () => polyP(c, [[-10, yt + depth], [D + 10, yt + depth], [D + 10, D + 10], [-10, D + 10]]), TABLEDK, 5);
};
const behind = (c: Ctx, yt: number, draw: () => void) => { c.save(); c.beginPath(); c.rect(0, 0, D, yt); c.clip(); draw(); c.restore(); };
const pe = (c: Ctx, yt: number, x: number, y: number, h: number, pose: Parameters<typeof person>[4]): Hands => { let r!: Hands; behind(c, yt, () => { r = person(c, x, y, h, pose); }); return r; };

// ---------------------------------------------------------------- letters for labels (Sa Re Ga Pa Dha)
const LET: Record<string, number[][][]> = {
  S: [[[0.55, 0.15], [0.4, 0], [0.15, 0], [0.02, 0.15], [0.1, 0.3], [0.5, 0.62], [0.58, 0.8], [0.45, 1], [0.15, 1], [0, 0.85]]],
  R: [[[0.05, 1], [0.05, 0], [0.4, 0], [0.55, 0.15], [0.4, 0.5], [0.05, 0.5]], [[0.3, 0.5], [0.58, 1]]],
  G: [[[0.55, 0.15], [0.4, 0], [0.15, 0], [0.02, 0.2], [0.02, 0.8], [0.15, 1], [0.4, 1], [0.55, 0.85], [0.55, 0.55], [0.32, 0.55]]],
  P: [[[0.05, 1], [0.05, 0], [0.4, 0], [0.55, 0.15], [0.55, 0.35], [0.4, 0.5], [0.05, 0.5]]],
  D: [[[0.05, 0], [0.05, 1], [0.3, 1], [0.55, 0.8], [0.55, 0.2], [0.3, 0], [0.05, 0]]],
  a: [[[0.5, 0.5], [0.3, 0.32], [0.08, 0.55], [0.12, 0.9], [0.32, 1], [0.5, 0.85]], [[0.5, 0.32], [0.5, 1]]],
  e: [[[0.05, 0.65], [0.55, 0.65], [0.5, 0.45], [0.3, 0.32], [0.08, 0.48], [0.05, 0.8], [0.25, 1], [0.5, 0.92]]],
  h: [[[0.05, 0], [0.05, 1]], [[0.05, 0.55], [0.2, 0.35], [0.4, 0.35], [0.5, 0.5], [0.5, 1]]],
};
const txt = (c: Ctx, s: string, x: number, y: number, h: number, col: string = INK, w = 7) => {
  let cx = x;
  for (const ch of s) {
    const st = LET[ch];
    if (!st) { write(c, ch, cx, y, h, col, w); cx += h * (ch === " " ? 0.35 : 0.8); continue; }
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
    st.forEach((pts) => { c.beginPath(); pts.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); });
    cx += h * 0.78;
  }
};
const numC = (c: Ctx, s: string, cx: number, y: number, h: number, col: string = INK, w = 6) => write(c, s, cx - s.length * 0.4 * h + h * 0.1, y, h, col, w);

// ---------------------------------------------------------------- people: where things are, face changes
const who = (x: number, y: number, h: number, ad = false) => {
  const head = h * (ad ? 0.115 : 0.15), hip = y - h * (ad ? 0.46 : 0.4), sh = hip - h * (ad ? 0.3 : 0.27), hy = sh - head * 1.12;
  return { x, head, sh, hy, shY: sh + h * 0.03, off: h * (ad ? 0.27 : 0.25) * 0.42 };
};
const skinOf = (ad: boolean) => (ad ? SKIN.adult : SKIN.child);
const closeEyes = (c: Ctx, x: number, y: number, h: number, ad = false) => {
  const w = who(x, y, h, ad);
  for (const sd of [-1, 1]) {
    const ex = x + sd * w.head * 0.38, ey = w.hy + w.head * 0.16;
    c.beginPath(); ell(c, ex, ey, w.head * 0.23, w.head * 0.27); c.fillStyle = skinOf(ad); c.fill();
    c.beginPath(); c.arc(ex, ey - w.head * 0.06, w.head * 0.17, 0.3, PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4.5; c.lineCap = "round"; c.stroke();
  }
};
const coverMouth = (c: Ctx, x: number, y: number, h: number, ad = false) => {
  const w = who(x, y, h, ad);
  c.beginPath(); ell(c, x, w.hy + w.head * 0.66, w.head * 0.37, w.head * 0.24); c.fillStyle = skinOf(ad); c.fill();
  return { mx: x, my: w.hy + w.head * 0.68, head: w.head, hy: w.hy };
};
const mouthOpen = (c: Ctx, x: number, y: number, h: number, ad = false) => {
  const m = coverMouth(c, x, y, h, ad);
  shape(c, () => ell(c, m.mx, m.my, m.head * 0.21, m.head * 0.18), "#6e2530", 4);
  shape(c, () => ell(c, m.mx, m.my + m.head * 0.08, m.head * 0.12, m.head * 0.07), "#e4707a", 0);
  return m;
};
const mouthSmall = (c: Ctx, x: number, y: number, h: number, ad = false) => {
  const m = coverMouth(c, x, y, h, ad);
  shape(c, () => ell(c, m.mx, m.my, m.head * 0.085, m.head * 0.085), "#6e2530", 3);
  return m;
};
const puzzled = (c: Ctx, x: number, y: number, h: number, ad = false) => {
  const m = coverMouth(c, x, y, h, ad), u = m.head;
  line(c, [[x - u * 0.24, m.my], [x - u * 0.1, m.my - u * 0.07], [x + u * 0.04, m.my + u * 0.05], [x + u * 0.24, m.my - u * 0.04]], 4);
  line(c, [[x - u * 0.62, m.hy - u * 0.12], [x - u * 0.2, m.hy - u * 0.12]], 4.5);
  line(c, [[x + u * 0.2, m.hy - u * 0.12], [x + u * 0.62, m.hy - u * 0.3]], 4.5);
};
// a fist over the end of something held (drawn after the held thing so the hand is in front)
const grip = (c: Ctx, p: Pt, ad = false, r = 30) => {
  const [x, y] = p, s = skinOf(ad);
  shape(c, () => ell(c, x, y, r * 1.12, r * 0.92), s, 5);
  for (let k = -1; k <= 1; k++) shape(c, () => ell(c, x + r * 0.55, y + k * r * 0.5, r * 0.42, r * 0.27), s, 4);
  shape(c, () => ell(c, x - r * 0.1, y - r * 0.8, r * 0.52, r * 0.3, -0.35), s, 4);
};
const armIn = (c: Ctx, from: Pt, to: Pt, col: string = CLOTH.child, w = 70) => { line(c, [from, to], w + 12, INK); line(c, [from, to], w, col); };

// ---------------------------------------------------------------- small drawing helpers
const waves = (c: Ctx, x: number, y: number, r0: number, n: number, gap: number, a0: number, a1: number, col: string = COL.blueDk, w = 7) => {
  for (let i = 0; i < n; i++) { c.beginPath(); c.arc(x, y, r0 + i * gap, a0, a1); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
};
const note = (c: Ctx, x: number, y: number, s = 1, col: string = INK) => {
  line(c, [[x + 17 * s, y], [x + 17 * s, y - 78 * s]], 6 * s, INK);
  line(c, [[x + 17 * s, y - 78 * s], [x + 48 * s, y - 58 * s], [x + 40 * s, y - 32 * s]], 6 * s, INK);
  shape(c, () => ell(c, x, y, 20 * s, 14 * s, -0.4), col, 4 * s);
};
const sineWave = (c: Ctx, x0: number, x1: number, y: number, amp: number, period: number, col: string = COL.purple, w = 8) => {
  c.beginPath();
  for (let x = x0; x <= x1; x += 4) { const yy = y + Math.sin(((x - x0) / period) * PI * 2) * amp; x === x0 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
};
const tick = (c: Ctx, x: number, y: number, s = 1) => line(c, [[x - 24 * s, y], [x - 6 * s, y + 20 * s], [x + 28 * s, y - 26 * s]], 12 * s, COL.green);

// a glass bottle standing with its bottom centre at (x, yb); frac = how full (0..1); returns the water level y
const bottleP = (c: Ctx, x: number, yb: number, w: number, h: number) => () => {
  const bh = h * 0.56, nw = w * 0.34, hw = w / 2;
  c.moveTo(x - hw, yb - 14); c.quadraticCurveTo(x - hw, yb, x - hw + 14, yb); c.lineTo(x + hw - 14, yb); c.quadraticCurveTo(x + hw, yb, x + hw, yb - 14);
  c.lineTo(x + hw, yb - bh); c.bezierCurveTo(x + hw, yb - bh - h * 0.14, x + nw / 2, yb - bh - h * 0.08, x + nw / 2, yb - bh - h * 0.24);
  c.lineTo(x + nw / 2, yb - h + 12); c.lineTo(x + nw / 2 + 7, yb - h + 12); c.lineTo(x + nw / 2 + 7, yb - h); c.lineTo(x - nw / 2 - 7, yb - h); c.lineTo(x - nw / 2 - 7, yb - h + 12); c.lineTo(x - nw / 2, yb - h + 12);
  c.lineTo(x - nw / 2, yb - bh - h * 0.24); c.bezierCurveTo(x - nw / 2, yb - bh - h * 0.08, x - hw, yb - bh - h * 0.14, x - hw, yb - bh); c.closePath();
};
const bottle = (c: Ctx, x: number, yb: number, w: number, h: number, frac: number, air = false, solid = false) => {
  shadow(c, x + w * 0.12, yb + 4, w * 0.62, w * 0.1);
  const p = bottleP(c, x, yb, w, h), ly = yb - 14 - frac * h * 0.7;
  c.save(); c.beginPath(); p(); c.clip();
  if (solid) { c.fillStyle = "#e9f1f3"; c.fillRect(x - w, yb - h - 5, w * 2, h + 10); }
  if (air) { c.fillStyle = "rgba(255,222,110,0.5)"; c.fillRect(x - w, yb - h - 5, w * 2, ly - (yb - h - 5)); }
  if (frac > 0) { c.fillStyle = COL.water; c.fillRect(x - w, ly, w * 2, h); c.globalAlpha = 0.45; c.fillStyle = COL.waterDk; c.fillRect(x + w * 0.12, ly, w, h); c.globalAlpha = 1; line(c, [[x - w / 2, ly], [x + w / 2, ly]], 4, COL.waterDk); }
  c.restore();
  shape(c, p, solid ? "rgba(255,255,255,0.1)" : COL.glass, 5);
  shine(c, [[x - w * 0.34, yb - h * 0.5], [x - w * 0.34, yb - 30]], Math.max(4, w * 0.05));
  return ly;
};
const jug = (c: Ctx, H: Pt, rot: number) => {
  const cs = Math.cos(rot), sn = Math.sin(rot), sp: Pt = [H[0] + -165 * cs + 100 * sn, H[1] + -165 * sn - 100 * cs];
  c.save(); c.translate(H[0], H[1]); c.rotate(rot);
  const body = () => polyP(c, [[-165, -100], [-138, -84], [-25, -84], [-25, 70], [-138, 70], [-138, -60]]);
  line(c, [[-25, -62], [10, -62], [16, -8], [10, 42], [-25, 46]], 24, INK); line(c, [[-25, -62], [10, -62], [16, -8], [10, 42], [-25, 46]], 12, COL.steelIn);
  c.save(); c.beginPath(); body(); c.clip(); c.rotate(-rot); c.fillStyle = COL.water; c.fillRect(-500, sp[1] - H[1] + 6, 1000, 700); c.restore();
  shape(c, body, COL.glass, 5);
  for (const yy of [-30, 10, 50]) line(c, [[-138, yy], [-108, yy]], 4);
  c.restore();
  return sp;
};
const spoon = (c: Ctx, hand: Pt, tip: Pt) => {
  const L = Math.hypot(tip[0] - hand[0], tip[1] - hand[1]), ux = (tip[0] - hand[0]) / L, uy = (tip[1] - hand[1]) / L, hc: Pt = [tip[0] - ux * 30, tip[1] - uy * 30];
  line(c, [[hand[0] - ux * 50, hand[1] - uy * 50], hc], 24, INK); line(c, [[hand[0] - ux * 50, hand[1] - uy * 50], hc], 14, COL.wood);
  c.save(); c.translate(hc[0], hc[1]); c.rotate(Math.atan2(uy, ux)); shape(c, () => ell(c, 0, 0, 38, 25), COL.wood, 5); shape(c, () => ell(c, 4, 0, 24, 14), COL.woodDk, 0); c.restore();
};
const pencil = (c: Ctx, tail: Pt, tip: Pt) => {
  const L = Math.hypot(tip[0] - tail[0], tip[1] - tail[1]), ux = (tip[0] - tail[0]) / L, uy = (tip[1] - tail[1]) / L, nx = -uy, ny = ux, w = 11, bx = tip[0] - ux * 40, by = tip[1] - uy * 40;
  shape(c, () => polyP(c, [[tail[0] + nx * w, tail[1] + ny * w], [bx + nx * w, by + ny * w], [bx - nx * w, by - ny * w], [tail[0] - nx * w, tail[1] - ny * w]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[bx + nx * w, by + ny * w], [tip[0], tip[1]], [bx - nx * w, by - ny * w]]), "#f2d9b0", 5);
  line(c, [[tip[0] - ux * 12, tip[1] - uy * 12], tip], 7, INK);
  shape(c, () => ell(c, tail[0], tail[1], w, w), COL.pink, 4);
};
const bucket = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, yb + 6, w * 0.5, w * 0.08);
  line(c, [[x - w * 0.5, yb - h + 6], [x - w * 0.5, yb - h - w * 0.28], [x + w * 0.5, yb - h - w * 0.28], [x + w * 0.5, yb - h + 6]], 8);
  const bd = () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.38, yb], [x - w * 0.38, yb]]);
  shape(c, bd, COL.blue, 6); shade(c, bd, COL.blueDk, w * 0.3, 0);
  shape(c, () => ell(c, x, yb - h, w / 2, w * 0.1), COL.blueDk, 6);
};
const steelPot = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, w * 0.08);
  shape(c, () => rrect(c, x - w / 2 - 28, yb - h * 0.8, 36, 24, 8), COL.steelDk, 5); shape(c, () => rrect(c, x + w / 2 - 8, yb - h * 0.8, 36, 24, 8), COL.steelDk, 5);
  const bd = () => rrect(c, x - w / 2, yb - h, w, h, 14);
  shape(c, bd, COL.steel, 6); shade(c, bd, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, yb - h, w / 2, w * 0.1), COL.steelIn, 6);
};
const tumbler = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, w * 0.08);
  const bd = () => polyP(c, [[x - w / 2, yb - h], [x + w / 2, yb - h], [x + w * 0.4, yb], [x - w * 0.4, yb]]);
  shape(c, bd, COL.steel, 6); shade(c, bd, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, yb - h, w / 2, w * 0.1), COL.steelIn, 6);
};

// ---------------------------------------------------------------- the four ways: shake, blow, pop, rub (icons about 200 wide, centred)
const iconShake = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => { c.moveTo(-70, -20); c.lineTo(70, -20); c.lineTo(62, 60); c.quadraticCurveTo(0, 80, -62, 60); c.closePath(); }, COL.red, 6);
  line(c, [[-64, -4], [-40, 58], [-16, -4], [8, 60], [30, -4], [52, 56], [64, -2]], 5, COL.paper);
  shape(c, () => ell(c, 0, -20, 70, 24), COL.paper, 6);
  waves(c, 0, 10, 95, 2, 24, PI * 0.82, PI * 1.18, COL.blueDk, 7); waves(c, 0, 10, 95, 2, 24, -PI * 0.18, PI * 0.18, COL.blueDk, 7);
  c.restore();
};
const iconBlow = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  bottle(c, -30, 90, 80, 170, 0.3);
  for (const [dy, l] of [[-92, 120], [-70, 100], [-48, 80]] as [number, number][]) line(c, [[10, dy], [10 + l * 0.35, dy - 10], [10 + l * 0.7, dy + 8], [10 + l, dy - 4]], 6, COL.blueDk);
  c.restore();
};
const iconPop = (c: Ctx, x: number, y: number, s = 1, c1: string = COL.yellow, c2: string = COL.orange) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const star = (r1: number, r2: number) => { const p: number[][] = []; for (let i = 0; i < 16; i++) { const r = i % 2 ? r1 : r2, a = (i * PI) / 8; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; };
  shape(c, () => polyP(c, star(50, 95)), c1, 6); shape(c, () => polyP(c, star(26, 52)), c2, 5);
  c.restore();
};
const iconRub = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -90, 24, 180, 46, 10), COL.brown, 6); shape(c, () => rrect(c, -58, -34, 116, 58, 12), COL.steel, 6);
  arrow(c, [[-14, -62], [-84, -62]], RED, 7); arrow(c, [[14, -62], [84, -62]], RED, 7);
  line(c, [[-42, 30], [-26, 10], [-10, 30], [6, 10], [22, 30], [38, 10]], 5, COL.red);
  c.restore();
};
const iconRattle = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -12, 30, 24, 70, 9), COL.wood, 5); shape(c, () => ell(c, 0, -10, 52, 52), COL.teal, 6);
  for (const [u, v] of [[-20, -20], [14, -28], [22, 4], [-14, 12], [0, -2]]) shape(c, () => ell(c, u, v, 6, 6), COL.paper, 0);
  c.restore();
};
const iconFlute = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.35);
  shape(c, () => rrect(c, -100, -15, 200, 30, 15), COL.wood, 6);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, -30 + k * 26, 0, 7, 7), INK, 0);
  c.restore();
};
const iconGlass = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -70, -70, 140, 140, 12), COL.sky, 6); shine(c, [[-40, -50], [-10, -20]], 9);
  shape(c, () => rrect(c, -20, 4, 100, 28, 14), SKIN.child, 5);
  line(c, [[-60, 50], [-45, 35], [-30, 50], [-15, 35]], 5, COL.red);
  c.restore();
};
const ICONS = [iconShake, iconBlow, iconPop, iconRub];
const RING = [COL.red, COL.blue, COL.orange, COL.green];
const token = (c: Ctx, x: number, y: number, r: number, k: number) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  c.beginPath(); ell(c, x, y, r - 9, r - 9); c.strokeStyle = RING[k]; c.lineWidth = 10; c.stroke();
  ICONS[k](c, x, y + r * 0.04, r / 150);
};
const tokenBack = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.purple, 6);
  c.beginPath(); ell(c, x, y, r - 10, r - 10); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke();
};

// ================================================================ SET-UP CARDS
// e1 ---------------------------------------------------------------
const e1s0 = (c: Ctx) => {
  stage(c, 740);
  shape(c, () => rrect(c, 30, 788, 780, 66, 12), COL.cloth, 5); line(c, [[48, 806], [792, 806]], 5, COL.teal); line(c, [[48, 836], [792, 836]], 5, COL.teal);
  const mls = [0, 50, 100, 150, 200], base = 815, bh = 260;
  mls.forEach((ml, i) => { const x = 120 + i * 150; bottle(c, x, base, 110, bh, ml / 320); numC(c, String(ml), x, 892, 40); });
  const X = 960, H0 = 600, rot = -0.5, cs = Math.cos(rot), sn = Math.sin(rot);
  const spout: Pt = [720, base - bh - 55];
  const Hp: Pt = [spout[0] - (-165 * cs + 100 * sn), spout[1] - (-165 * sn - 100 * cs)];
  const hd = pe(c, 740, X, 1050, H0, { reachL: Hp, reachR: [X + 85, 728] });
  const sp = jug(c, hd.handL, rot);
  line(c, [sp, [sp[0], base - bh + 6]], 12, INK); line(c, [sp, [sp[0], base - bh + 6]], 7, COL.water);
  grip(c, hd.handL);
};
const e1s1 = (c: Ctx) => {
  stage(c, 700, 100);
  const bx = 420, base = 785, w = 230, h = 560;
  const ly = bottle(c, bx, base, w, h, 0.55, true), mouth = base - h;
  line(c, [[205, mouth], [300, mouth]], 5); line(c, [[205, ly], [300, ly]], 5);
  const mid = (mouth + ly) / 2;
  arrow(c, [[250, mid], [250, mouth + 4]], RED, 9); arrow(c, [[250, mid], [250, ly - 4]], RED, 9);
  // arm and hand holding the ruler: its zero sits at the water
  shape(c, () => rrect(c, 715, 385, 400, 70, 10), CLOTH.child, 6);
  const rx = 540, rtop = ly - 380;
  shape(c, () => rrect(c, rx, rtop, 70, 380, 6), COL.wood, 5);
  for (let k = 0; k <= 15; k++) { const y = ly - k * 24.5; line(c, [[rx, y], [rx + (k % 5 === 0 ? 34 : 22), y]], k % 5 === 0 ? 4 : 3); if (k % 5 === 0 && k > 0 && k < 15) write(c, String(k), rx + 38, y - 14, 26, INK, 4); }
  write(c, "0", rx + 38, ly - 30, 26, INK, 4);
  hand(c, 645, 420, PI);
};
const e1s2 = (c: Ctx) => {
  stage(c, 740);
  const bx = 540, base = 815, w = 140, h = 380;
  bottle(c, bx, base, w, h, 0.4);
  const tip: Pt = [bx - w / 2 - 4, 715], Hc: Pt = [350, 665];
  const ch = pe(c, 740, 230, 980, 540, { reachR: Hc });
  const ad = pe(c, 740, 850, 1040, 600, { reachL: [764, 523] });
  closeEyes(c, 850, 1040, 600, true);
  spoon(c, ch.handR, tip); grip(c, ch.handR);
  waves(c, bx, 640, 112, 3, 30, -0.4, 0.4, COL.purple, 8);
};
const e1s3 = (c: Ctx) => {
  room(c, 930);
  const X = 540, Y = 980, h = 640, ly0 = 520;
  const hd = person(c, X, Y, h, { reachL: [X - 62, 745], reachR: [X + 62, 745] });
  bottle(c, X, ly0 + 300, 110, 300, 0.35, false, true);
  grip(c, hd.handL); grip(c, hd.handR);
  arrow(c, [[500, 506], [545, 494], [592, 508]], COL.blueDk, 6);
  waves(c, X + 6, ly0, 105, 3, 30, -0.45, 0.45, COL.purple, 8);
};
const e1s4 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 24), WHITE, 5);
  arrow(c, [[150, 720], [150, 110]], INK, 8); arrow(c, [[150, 720], [1010, 720]], INK, 8);
  note(c, 72, 190, 0.8, COL.purple);
  const xs = [270, 440, 610, 780, 950], blow = [610, 520, 430, 340, 250], tap = [250, 340, 430, 520, 610];
  xs.forEach((x, i) => bottle(c, x, 1005, 90, 230, i * 0.12 + 0.06));
  const pl = (ys: number[], col: string) => { line(c, xs.map((x, i) => [x, ys[i]]), 18, INK); line(c, xs.map((x, i) => [x, ys[i]]), 10, col); xs.forEach((x, i) => shape(c, () => ell(c, x, ys[i], 15, 15), col, 4)); };
  pl(tap, COL.blue); pl(blow, RED);
  // key: a spoon with the blue line, lips and air with the red line
  line(c, [[330, 150], [450, 150]], 10, COL.blue);
  line(c, [[200, 150], [275, 150]], 14, INK); line(c, [[200, 150], [275, 150]], 8, COL.wood); shape(c, () => ell(c, 300, 150, 26, 18), COL.wood, 4);
  shape(c, () => ell(c, 230, 225, 34, 19), "#e0707a", 4); line(c, [[200, 225], [260, 225]], 3);
  line(c, [[330, 225], [450, 225]], 10, RED);
  line(c, [[272, 218], [292, 210], [312, 222]], 5, COL.blueDk);
};

// e2 ---------------------------------------------------------------
const windowPane = (c: Ctx, x: number, y: number, w: number, h: number, mullion = true) => {
  shape(c, () => rrect(c, x - 28, y - 28, w + 56, h + 56, 14), COL.wood, 6);
  shape(c, () => rrect(c, x, y, w, h, 4), COL.sky, 5);
  shine(c, [[x + 50, y + h * 0.3], [x + 140, y + 40]], 14); shine(c, [[x + 100, y + h * 0.5], [x + 230, y + 50]], 9);
  if (mullion) line(c, [[x + w / 2, y], [x + w / 2, y + h]], 16, COL.woodDk);
};
const e2s0 = (c: Ctx) => {
  room(c, 930);
  windowPane(c, 70, 90, 940, 700, false);
  const ch = person(c, 330, 1030, 580, { reachR: [520, 640] });
  const ad = person(c, 790, 1040, 720, { adult: true, reachL: [640, 520] });
  // a cloth hanging from the helper's hand
  const [hx, hy] = ad.handL;
  shape(c, () => { c.moveTo(hx - 34, hy - 6); c.lineTo(hx + 34, hy - 6); c.lineTo(hx + 56, hy + 70); c.quadraticCurveTo(hx + 40, hy + 120, hx + 52, hy + 150); c.lineTo(hx - 52, hy + 150); c.quadraticCurveTo(hx - 40, hy + 100, hx - 56, hy + 70); c.closePath(); }, COL.cloth, 5);
  line(c, [[hx - 40, hy + 40], [hx + 40, hy + 40]], 3, COL.grey); line(c, [[hx - 46, hy + 90], [hx + 46, hy + 90]], 3, COL.grey);
  grip(c, ad.handL, true);
};
const e2s1 = (c: Ctx) => {
  stage(c, 800);
  bowl(c, 430, 770, 130, COL.water);
  shape(c, () => ell(c, 430, 772, 60, 12), COL.waterDk, 0);
  const hd = pe(c, 800, 640, 1130, 800, { reachL: [432, 775] });
  c.beginPath(); ell(c, 432, 786, 48, 11); c.strokeStyle = COL.drop; c.lineWidth = 5; c.stroke();
  c.beginPath(); ell(c, 432, 786, 78, 17); c.strokeStyle = COL.drop; c.lineWidth = 4; c.stroke();
  for (const [dx, dy] of [[-58, -48], [-84, -10], [-30, -88], [20, -66]] as [number, number][]) shape(c, () => { c.moveTo(430 + dx, 770 + dy - 14); c.quadraticCurveTo(430 + dx - 10, 770 + dy + 4, 430 + dx, 770 + dy + 8); c.quadraticCurveTo(430 + dx + 10, 770 + dy + 4, 430 + dx, 770 + dy - 14); }, COL.drop, 3);
  grip(c, hd.handL);
};
const pointHand = (c: Ctx, x: number, y: number) => {
  c.save(); c.translate(x, y);
  shape(c, () => rrect(c, -600, -48, 380, 96, 16), CLOTH.child, 6); shape(c, () => rrect(c, -250, -44, 46, 88, 10), CLOTH.childDk, 5);
  shape(c, () => ell(c, -170, 4, 72, 54), SKIN.child, 6);
  shape(c, () => rrect(c, -168, -26, 168, 34, 17), SKIN.child, 5);
  for (let k = 0; k < 3; k++) shape(c, () => ell(c, -150 + k * 22, 40, 24, 20), SKIN.child, 4);
  shape(c, () => ell(c, -150, -38, 42, 18, -0.4), SKIN.child, 4);
  c.restore();
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 12, y + r + 8, r * 0.9, r * 0.12);
  shape(c, () => rrect(c, x - 22, y - r - 36, 44, 36, 8), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), WHITE, 7); c.beginPath(); ell(c, x, y, r - 12, r - 12); c.strokeStyle = COL.teal; c.lineWidth = 9; c.stroke();
  for (let k = 0; k < 12; k++) { const a = (k * PI) / 6; line(c, [[x + Math.sin(a) * (r - 30), y - Math.cos(a) * (r - 30)], [x + Math.sin(a) * (r - 20), y - Math.cos(a) * (r - 20)]], 5); }
  const a1 = (6 * PI) / 180;
  shape(c, () => { c.moveTo(x, y); c.lineTo(x, y - (r - 22)); c.arc(x, y, r - 22, -PI / 2, -PI / 2 + a1 * 5); c.closePath(); }, "rgba(215,55,43,0.35)", 0);
  line(c, [[x, y], [x + Math.sin(a1) * (r - 24), y - Math.cos(a1) * (r - 24)]], 7, RED);
  shape(c, () => ell(c, x, y, 9, 9), INK, 0);
  write(c, "1", x - 12, y + 26, r * 0.5, INK, 7);
};
const e2s2 = (c: Ctx) => {
  ground(c, WALL);
  c.save(); c.translate(0, 130);
  windowPane(c, 70, 110, 640, 480, false);
  line(c, [[120, 330], [520, 330]], 44, "rgba(255,255,255,0.7)");
  pointHand(c, 520, 339);
  arrow(c, [[565, 330], [690, 330]], RED, 10);
  line(c, [[120, 480], [520, 480]], 6); line(c, [[120, 460], [120, 500]], 6); line(c, [[520, 460], [520, 500]], 6);
  for (let k = 1; k < 4; k++) line(c, [[120 + k * 100, 470], [120 + k * 100, 490]], 4);
  write(c, "20 cm", 215, 505, 44);
  stopwatch(c, 880, 420, 120);
  c.restore();
};
const e2s3 = (c: Ctx) => {
  room(c, 980);
  const X = 540, Y = 1050, h = 720;
  const ad = person(c, X, Y, h, { adult: true, reachL: [370, 400] });
  closeEyes(c, X, Y, h, true);
  // the raised hand shows three fingers
  const [hx, hy] = ad.handL;
  for (const [k, len] of [[0, 130], [1, 150], [2, 135]] as [number, number][]) shape(c, () => rrect(c, hx - 44 + k * 32, hy - 40 - len, 26, len + 20, 13), SKIN.adult, 5);
  for (const [dx, len] of [[52, 36], [-70, 42]] as [number, number][]) shape(c, () => rrect(c, hx + dx - 12, hy - 40 - len + 24, 24, len, 12), SKIN.adult, 5);
  shape(c, () => rrect(c, hx - 56, hy - 44, 112, 90, 34), SKIN.adult, 5);
  shape(c, () => ell(c, hx - 62, hy + 2, 20, 34, 0.3), SKIN.adult, 4);
  for (let k = 0; k < 6; k++) { const x = 740 + (k % 3) * 100, y = 170 + Math.floor(k / 3) * 110; shape(c, () => ell(c, x, y, 40, 40), k === 3 ? COL.yellow : WHITE, 5); write(c, String(k), x - 12, y - 18, 36, INK, 5); }
};

// a1 ---------------------------------------------------------------
const a1s0 = (c: Ctx) => {
  ground(c, TILE);
  for (let x = 0; x <= D; x += 90) line(c, [[x, 0], [x, 760]], 3, TILELINE);
  for (let y = 0; y <= 760; y += 90) line(c, [[0, y], [D, y]], 3, TILELINE);
  // a shelf with pots on the wall
  shape(c, () => rrect(c, 700, 250, 340, 26, 6), COL.woodDk, 5);
  steelPot(c, 800, 250, 100, 80); steelPot(c, 940, 250, 90, 120);
  stage(c, 760, 90, true); // table over the tiles
  const X = 400;
  // notebook the child holds up on the left
  shape(c, () => rrect(c, 150, 560, 170, 210, 10), COL.teal, 6); line(c, [[168, 560], [168, 770]], 6, COL.tealDk);
  for (let k = 0; k < 4; k++) line(c, [[200, 600 + k * 34], [292, 600 + k * 34]], 4, WHITE);
  const hd = pe(c, 760, X, 1050, 600, { reachL: [300, 730], reachR: [572, 722] });
  grip(c, hd.handL);
  tumbler(c, 720, 840, 120, 170);
  pencil(c, [535, 690], [662, 770]); grip(c, hd.handR);
  waves(c, 720, 760, 90, 2, 30, -0.5, 0.5, COL.purple, 8);
  void X;
};
const a1s1 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 90, 90, 900, 900, 18), WHITE, 6);
  for (const x of [315, 540, 765]) line(c, [[x, 90], [x, 990]], 5);
  line(c, [[90, 330], [990, 330]], 5);
  const cols = [[iconRattle, iconShake], [iconFlute, iconBlow], [iconPop, iconPop], [iconRub, iconGlass]];
  for (let i = 0; i < 4; i++) {
    const cx = 202 + i * 225;
    shape(c, () => ell(c, cx, 215, 80, 80), WHITE, 5); c.beginPath(); ell(c, cx, 215, 70, 70); c.strokeStyle = RING[i]; c.lineWidth = 10; c.stroke();
    ICONS[i](c, cx, 218, 0.42);
    if (i === 2) { iconPop(c, cx, 480, 0.5); iconPop(c, cx, 700, 0.42, COL.pink, COL.red); iconPop(c, cx, 880, 0.36, COL.greenLt, COL.green); continue; }
    (cols[i][0] as (c: Ctx, x: number, y: number, s: number) => void)(c, cx, 480, 0.6);
    (cols[i][1] as (c: Ctx, x: number, y: number, s: number) => void)(c, cx, 700, 0.55);
  }
};
const a1s2 = (c: Ctx) => {
  room(c, 990);
  shape(c, () => rrect(c, 290, 100, 620, 720, 16), WHITE, 7); line(c, [[600, 100], [600, 820]], 5);
  for (const [x, k] of [[450, 1], [750, 2]] as [number, number][]) { shape(c, () => ell(c, x, 240, 76, 76), WHITE, 5); c.beginPath(); ell(c, x, 240, 66, 66); c.strokeStyle = RING[k]; c.lineWidth = 10; c.stroke(); ICONS[k](c, x, 242, 0.42); }
  shape(c, () => rrect(c, 480, 430, 240, 150, 16), PAPER, 5);
  [[500, 470, 690], [500, 505, 640], [500, 540, 670]].forEach(([x0, y0, x1]) => line(c, [[x0, y0], [(x0 + x1) / 2, y0 - 10], [x1, y0]], 5, COL.black));
  c.beginPath(); ell(c, 600, 505, 170, 108); c.strokeStyle = RED; c.lineWidth = 8; c.stroke();
  const X = 140, Y = 1050, h = 680;
  const hd = person(c, X, Y, h, { reachR: [404, 547] });
  puzzled(c, X, Y, h);
  const [hx, hy] = hd.handR, L = Math.hypot(470 - hx, 515 - hy), ux = (470 - hx) / L, uy = (515 - hy) / L;
  line(c, [[hx, hy], [hx + ux * 62, hy + uy * 62]], 36, INK); line(c, [[hx, hy], [hx + ux * 62, hy + uy * 62]], 26, SKIN.child);
  grip(c, hd.handR);
};

// a2 ---------------------------------------------------------------
const mouthIcon = (c: Ctx, x: number, y: number, s: number, open: boolean) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 0, open ? 78 : 52, open ? 50 : 26), "#d94f5c", 6);
  shape(c, () => ell(c, 0, 0, open ? 52 : 26, open ? 28 : 7), "#6e2530", 4);
  if (open) { shape(c, () => ell(c, 0, 14, 28, 12), "#e4707a", 0); waves(c, 0, 0, 100, 3, 24, -0.5, 0.5, COL.purple, 8); waves(c, 0, 0, 100, 3, 24, PI - 0.5, PI + 0.5, COL.purple, 8); } else { line(c, [[70, -8], [90, -8]], 5, COL.greyDk); line(c, [[100, -8], [110, -8]], 5, COL.greyDk); }
  c.restore();
};
const a2s0 = (c: Ctx) => {
  room(c, 960);
  const Y = 1030, h = 640;
  for (const [x, loud] of [[290, true], [790, false]] as [number, boolean][]) {
    const w = who(x, Y, h), throat: Pt = [x + 8, w.sh + w.head * 0.12];
    person(c, x, Y, h, { reachR: throat });
    const m = loud ? mouthOpen(c, x, Y, h) : mouthSmall(c, x, Y, h);
    if (loud) {
      waves(c, x, m.my, 130, 3, 32, -0.45, 0.45, COL.purple, 8); waves(c, x, m.my, 130, 3, 32, PI - 0.45, PI + 0.45, COL.purple, 8);
      waves(c, x, w.sh + w.head * 0.1, 40, 2, 16, PI * 0.8, PI * 1.2, RED, 5);
    } else { waves(c, x, m.my, 100, 1, 0, -0.35, 0.35, COL.greyDk, 5); waves(c, x, m.my, 100, 1, 0, PI - 0.35, PI + 0.35, COL.greyDk, 5); }
  }
  line(c, [[540, 120], [540, 950]], 4, COL.grey);
};
const a2s1 = (c: Ctx) => {
  stage(c, 740);
  const sp = pe(c, 740, 210, 980, 540, { reachR: [350, 690] });
  const ls = pe(c, 740, 850, 1040, 600, { adult: true, reachL: [733, 727] });
  // paper slip on its way out of the bowl
  shape(c, () => rrect(c, 338, 690, 26, 100, 4), WHITE, 4);
  bowl(c, 360, 800, 100, COL.steelIn);
  for (const [dx, dy] of [[-40, -4], [10, 6], [-10, -10], [40, 0]] as [number, number][]) shape(c, () => rrect(c, 360 + dx - 16, 800 + dy - 7, 32, 14, 5), WHITE, 3);
  grip(c, sp.handR);
  // the cardboard screen
  const pan: [number, number, number, number, string][] = [[470, 520, 395, 380, "#d9b07a"], [520, 570, 380, 395, "#c99a62"]];
  pan.forEach(([x0, x1, y0, y1, col]) => shape(c, () => polyP(c, [[x0, y0], [x1, y1], [x1, y1 + 410], [x0, y0 + 410]]), col, 5));
  shape(c, () => polyP(c, [[570, 380], [620, 395], [620, 805], [570, 790]]), "#d9b07a", 5);
  // listener writes
  shape(c, () => polyP(c, [[650, 772], [800, 772], [812, 836], [640, 836]]), WHITE, 5);
  line(c, [[672, 800], [772, 800]], 3, COL.grey);
  pencil(c, [760, 640], [716, 782]); grip(c, ls.handL, true);
};
const a2s2 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 110, 60, 860, 850, 16), PAPER, 6); line(c, [[540, 60], [540, 910]], 5); line(c, [[110, 300], [970, 300]], 5);
  mouthIcon(c, 325, 190, 0.75, true); mouthIcon(c, 755, 190, 0.75, false);
  for (let i = 0; i < 10; i++) for (const base of [250, 680]) {
    const col = i % 2, row = Math.floor(i / 2), x = base + col * 150, y = 380 + row * 100;
    shape(c, () => rrect(c, x - 40, y - 36, 80, 72, 12), WHITE, 4); tick(c, x, y, 0.9);
  }
  pencil(c, [190, 975], [520, 985]);
};

// a3 ---------------------------------------------------------------
const a3s0 = (c: Ctx) => {
  room(c, 930);
  const X = 540, Y = 980, h = 640, w = who(X, Y, h), cy = w.hy + 185;
  const hd = person(c, X, Y, h, { reachL: [372, cy + 6], reachR: [708, cy + 6] });
  shadow(c, X + 20, cy + 148, 120, 16);
  shape(c, () => ell(c, X, cy - 16, 140, 140), COL.steelDk, 6);
  shape(c, () => rrect(c, X - 176, cy - 14, 54, 28, 10), COL.steelDk, 5); shape(c, () => rrect(c, X + 122, cy - 14, 54, 28, 10), COL.steelDk, 5);
  shape(c, () => ell(c, X, cy, 140, 140), COL.steel, 6); shade(c, () => ell(c, X, cy, 140, 140), COL.steelDk, 40, 20);
  c.beginPath(); ell(c, X, cy, 100, 100); c.strokeStyle = COL.steelDk; c.lineWidth = 5; c.stroke();
  shine(c, [[X - 90, cy - 70], [X - 40, cy - 108]], 10);
  grip(c, hd.handL); grip(c, hd.handR);
  waves(c, X, cy, 232, 2, 40, -0.4, 0.4, COL.purple, 9); waves(c, X, cy, 232, 2, 40, PI - 0.4, PI + 0.4, COL.purple, 9);
  note(c, 230, 330, 0.9, COL.purple); note(c, 820, 300, 0.9, COL.purple);
};
const a3s1 = (c: Ctx) => {
  stage(c, 640, 150);
  bucket(c, 230, 790, 300, 400); steelPot(c, 580, 790, 230, 250); tumbler(c, 880, 790, 120, 160);
  waves(c, 230, 420, 70, 3, 36, -PI * 0.85, -PI * 0.15, COL.purple, 8);
  waves(c, 580, 570, 50, 3, 28, -PI * 0.85, -PI * 0.15, COL.purple, 8);
  waves(c, 880, 600, 30, 3, 20, -PI * 0.85, -PI * 0.15, COL.purple, 7);
  sineWave(c, 90, 400, 960, 34, 220); sineWave(c, 440, 720, 960, 28, 110); sineWave(c, 790, 980, 960, 22, 50);
};
const a3s2 = (c: Ctx) => {
  ground(c, TILE);
  for (let x = 0; x <= D; x += 90) line(c, [[x, 0], [x, 860]], 3, TILELINE);
  for (let y = 0; y <= 860; y += 90) line(c, [[0, y], [D, y]], 3, TILELINE);
  c.fillStyle = "#b9c9c3"; c.fillRect(0, 860, D, D - 860); line(c, [[0, 860], [D, 860]], 6);
  for (let x = 0; x <= D; x += 120) line(c, [[x, 860], [x - 80, D]], 3, TILELINE);
  // a closed door
  shape(c, () => rrect(c, 800, 120, 230, 740, 6), COL.wood, 6); shape(c, () => rrect(c, 830, 160, 170, 300, 6), COL.woodDk, 4); shape(c, () => rrect(c, 830, 500, 170, 300, 6), COL.woodDk, 4);
  shape(c, () => ell(c, 830, 480, 16, 16), COL.steelDk, 5);
  // a tap on the wall and a bucket under it
  shape(c, () => rrect(c, 70, 330, 110, 26, 8), COL.steelDk, 5); shape(c, () => rrect(c, 150, 330, 26, 80, 8), COL.steelDk, 5);
  bucket(c, 140, 870, 200, 220);
  const X = 470;
  person(c, X, 1020, 640, {});
  closeEyes(c, X, 1020, 640);
  const w = who(X, 1020, 640);
  waves(c, X, w.hy, 130, 3, 36, -0.5, 0.5, COL.purple, 8); waves(c, X, w.hy, 130, 3, 36, PI - 0.5, PI + 0.5, COL.purple, 8);
  note(c, X + 240, w.hy - 60, 0.9, COL.purple);
};

// p1 ---------------------------------------------------------------
const p1s0 = (c: Ctx) => {
  stage(c, 700, 130);
  const names = ["Sa", "Re", "Ga", "Pa", "Dha"];
  names.forEach((nm, i) => {
    const x = 150 + i * 195;
    bottle(c, x, 800, 130, 350, 0.1 + i * 0.12);
    shape(c, () => rrect(c, x - 62, 880, 124, 80, 10), WHITE, 5);
    txt(c, nm, x - (nm.length * 0.78 * 42) / 2 + 2, 898, 42, INK, 6);
  });
};
const p1s1 = (c: Ctx) => {
  stage(c, 740);
  const ch = pe(c, 740, 250, 980, 540, { reachL: [188, 746], reachR: [312, 746] });
  const w = who(250, 980, 540), lip = w.hy + w.head * 0.8;
  bottle(c, 250, lip + 250, 100, 250, 0.35, false, true);
  grip(c, ch.handL); grip(c, ch.handR);
  // harmonium
  const ad = pe(c, 740, 830, 1040, 600, { adult: true, reachL: [720, 716], reachR: [985, 735] });
  shape(c, () => rrect(c, 610, 700, 330, 150, 12), COL.brown, 6);
  shape(c, () => rrect(c, 625, 715, 300, 60, 6), WHITE, 5);
  for (let k = 1; k < 10; k++) line(c, [[625 + k * 30, 715], [625 + k * 30, 775]], 3);
  for (const k of [1, 2, 4, 5, 6, 8]) shape(c, () => rrect(c, 625 + k * 30 - 8, 715, 16, 36, 3), INK, 0);
  shape(c, () => rrect(c, 940, 690, 82, 160, 8), COL.black, 6);
  for (let k = 1; k < 5; k++) line(c, [[940, 690 + k * 32], [1022, 690 + k * 32]], 3, COL.greyDk);
  grip(c, ad.handL, true); grip(c, ad.handR, true);
  note(c, 400, 400, 1, COL.purple); note(c, 640, 400, 1, COL.purple);
  line(c, [[470, 360], [630, 360]], 5, COL.greyDk);
  waves(c, 256, lip, 80, 2, 28, -0.5, 0.5, COL.purple, 7);
};
const p1s2 = (c: Ctx) => {
  stage(c, 740);
  const ad = pe(c, 740, 170, 1040, 600, { adult: true, reachL: [162, 650], reachR: [178, 650] });
  const ch = pe(c, 740, 540, 980, 540, { reachL: [378, 722], reachR: [702, 722] });
  const kid = pe(c, 740, 910, 980, 540, { reachL: [902, 665], reachR: [918, 665] });
  const w = who(540, 980, 540);
  void w;
  mouthSmall(c, 540, 980, 540);
  for (let i = 0; i < 5; i++) bottle(c, 400 + i * 70, 840, 52, 190, 0.1 + i * 0.13, false, true);
  grip(c, ch.handL); grip(c, ch.handR);
  arrow(c, [[380, 668], [450, 656], [520, 668], [640, 658]], COL.blueDk, 7);
  for (const [x, y] of [[170, 650], [910, 665]]) for (const a of [-2.4, -1.57, -0.74]) line(c, [[x + Math.cos(a) * 52, y + Math.sin(a) * 52], [x + Math.cos(a) * 84, y + Math.sin(a) * 84]], 7, RED);
  void ad; void kid;
  note(c, 400, 330, 0.9, COL.purple); note(c, 640, 290, 0.9, COL.purple);
};

// g1 ---------------------------------------------------------------
const g1s0 = (c: Ctx) => {
  ground(c, TABLE);
  for (let y = 120; y < D; y += 200) line(c, [[0, y], [D, y]], 3, TABLEDK);
  // a pile of 24 cards
  const rot = [-0.12, 0.07, -0.04, 0.1, -0.09, 0.05, -0.02, 0.06];
  rot.forEach((r, i) => { c.save(); c.translate(330 + (i % 3) * 6, 540 - i * 6); c.rotate(r); shape(c, () => rrect(c, -130, -180, 260, 360, 16), i % 2 ? PAPER : WHITE, 5); c.restore(); });
  c.save(); c.translate(330, 490); c.rotate(0.03); shape(c, () => rrect(c, -130, -180, 260, 360, 16), COL.purple, 6);
  c.beginPath(); c.rect(-100, -150, 200, 300); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke();
  iconPop(c, 0, -20, 0.9, COL.yellow, COL.orange); write(c, "24", -45, 100, 56, WHITE, 8); c.restore();
  for (let s = 0; s < 2; s++) {
    const y0 = 300 + s * 340;
    for (let k = 0; k < 4; k++) token(c, 700 + (k % 2) * 150, y0 + Math.floor(k / 2) * 150 - 70, 60, k);
    write(c, "4", 935, y0 - 40, 70, INK, 9);
  }
};
const g1s1 = (c: Ctx) => {
  stage(c, 760);
  const rd = pe(c, 760, 180, 1040, 600, { adult: true, reachR: [265, 440] });
  const kids = [470, 715, 950].map((x) => pe(c, 760, x, 960, 500, { reachR: [x + 60, 748] }));
  // the card the reader holds up
  c.save(); c.translate(rd.handR[0] + 90, rd.handR[1]);
  shape(c, () => rrect(c, -90, -250, 180, 260, 12), PAPER, 6);
  [[-62, -205, 70], [-62, -165, 60], [-62, -125, 72]].forEach(([x0, y0, w]) => line(c, [[x0, y0], [x0 + w / 2, y0 - 8], [x0 + w, y0]], 5, COL.black));
  iconGlass(c, 0, -62, 0.3);
  c.restore();
  grip(c, rd.handR, true);
  kids.forEach((k) => { tokenBack(c, k.handR[0], 800, 36); grip(c, k.handR); });
};
const g1s2 = (c: Ctx) => {
  stage(c, 760);
  const rd = pe(c, 760, 300, 1060, 640, { adult: true, reachR: [490, 540] });
  // the card is turned over: the back shows the answer
  c.save(); c.translate(rd.handR[0] + 40, rd.handR[1]);
  shape(c, () => rrect(c, -130, -250, 260, 260, 14), COL.teal, 6);
  c.beginPath(); c.rect(-112, -232, 224, 224); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke();
  iconRub(c, 0, -130, 0.8);
  c.restore();
  grip(c, rd.handR, true);
  arrow(c, [[440, 270], [500, 215], [600, 198], [700, 225]], RED, 9);
  [3, 3, 1].forEach((k, i) => token(c, 700 + i * 130, 815, 46, k));
};

// ================================================================ CARD PICTURES
const flowE1 = (c: Ctx) => {
  stage(c, 850, 90);
  const base = 905;
  bottle(c, 350, base, 230, 560, 0.35, true); bottle(c, 790, base, 230, 560, 0.35, true);
  // tapping: a spoon held against the left bottle
  armIn(c, [-30, 520], [110, 600], CLOTH.child, 70);
  const tip: Pt = [239, 650], Hh: Pt = [120, 606];
  spoon(c, Hh, tip); grip(c, Hh);
  waves(c, 350, 650, 150, 2, 28, -0.35, 0.35, COL.purple, 9);
  // blowing: lips and air across the right bottle's mouth
  shape(c, () => ell(c, 1010, 345, 44, 24), "#e0707a", 5); line(c, [[970, 345], [1050, 345]], 4);
  for (const dy of [-12, 0, 12]) line(c, [[950, 345 + dy], [920, 340 + dy], [890, 350 + dy]], 6, COL.blueDk);
  arrow(c, [[888, 335], [840, 345], [792, 335]], COL.blueDk, 7);
  note(c, 560, 250, 1, COL.purple);
};
const flowE2 = (c: Ctx) => {
  ground(c, WALL);
  windowPane(c, 90, 100, 900, 700, false);
  line(c, [[200, 450], [600, 450]], 40, "rgba(255,255,255,0.7)");
  pointHand(c, 600, 459);
  // stick, slip: a jagged line under the fingertip
  line(c, [[600, 520], [630, 505], [640, 550], [670, 535], [680, 580], [710, 565], [720, 610]], 8, RED);
  waves(c, 650, 440, 70, 3, 36, -0.7, 0.2, COL.purple, 9);
};
const flowA1 = (c: Ctx) => {
  ground(c, WALL);
  const pos: Pt[] = [[300, 300], [780, 300], [300, 780], [780, 780]];
  pos.forEach(([x, y], k) => { shape(c, () => ell(c, x, y, 190, 190), WHITE, 7); c.beginPath(); ell(c, x, y, 172, 172); c.strokeStyle = RING[k]; c.lineWidth = 16; c.stroke(); ICONS[k](c, x, y + 8, 1.15); });
};
const flowP1 = (c: Ctx) => {
  stage(c, 760, 130);
  for (let k = 0; k < 5; k++) line(c, [[60, 130 + k * 40], [1020, 130 + k * 40]], 4, COL.black);
  for (let i = 0; i < 5; i++) {
    const x = 160 + i * 190;
    bottle(c, x, 880, 130, 360, 0.1 + i * 0.12);
    note(c, x, 290 - i * 20, 1, COL.purple);
    line(c, [[x, 330 - i * 20], [x, 470]], 4, COL.grey);
  }
};
const term6 = (c: Ctx) => {
  ground(c, WALL);
  bottle(c, 290, 900, 230, 560, 0.15, true); bottle(c, 790, 900, 230, 560, 0.62, true);
  for (const [x, ly] of [[290, 900 - 14 - 0.15 * 392], [790, 900 - 14 - 0.62 * 392]] as [number, number][]) {
    const mouth = 340, mid = (mouth + ly) / 2;
    line(c, [[x - 160, mouth], [x - 120, mouth]], 5); line(c, [[x - 160, ly], [x - 120, ly]], 5);
    arrow(c, [[x - 150, mid], [x - 150, mouth + 4]], RED, 9); arrow(c, [[x - 150, mid], [x - 150, ly - 4]], RED, 9);
  }
  sineWave(c, 110, 460, 170, 30, 175); sineWave(c, 610, 960, 170, 30, 70);
};
const term14 = (c: Ctx) => {
  ground(c, WALL);
  const px = 540, py = 540, s = 300;
  shadow(c, px + 20, py + s + 26, s, 24);
  shape(c, () => rrect(c, px - s, py - s, s * 2, s * 2, 20), COL.steel, 7);
  shape(c, () => rrect(c, px - s + 24, py - s + 24, s * 2 - 48, s * 2 - 48, 14), COL.steelIn, 4);
  c.fillStyle = "rgba(91,143,214,0.28)"; c.fillRect(px - s + 24, py - s + 24, s - 24, s - 24); c.fillRect(px + 2, py + 2, s - 26, s - 26);
  c.fillStyle = "rgba(243,154,60,0.3)"; c.fillRect(px + 2, py - s + 24, s - 26, s - 26); c.fillRect(px - s + 24, py + 2, s - 24, s - 26);
  const R = (a: number) => { const q = a * 9301 + 49297; return (q % 233280) / 233280; };
  for (let i = 0; i < 160; i++) {
    const t = (R(i + 1) * 2 - 1) * (s - 40), j = (R(i + 500) * 2 - 1) * 9;
    shape(c, () => ell(c, px + t, py + j, 5, 4), "#8a5a3c", 0); shape(c, () => ell(c, px + j, py + t, 5, 4), "#8a5a3c", 0);
  }
  for (const [qx, qy, up] of [[-1, -1, true], [1, 1, true], [1, -1, false], [-1, 1, false]] as [number, number, boolean][]) {
    const x = px + qx * 150, y = py + qy * 150;
    if (up) arrow(c, [[x, y + 50], [x, y - 50]], COL.blueDk, 10); else arrow(c, [[x, y - 50], [x, y + 50]], RED, 10);
  }
  shape(c, () => ell(c, px, py, 20, 20), COL.steelDk, 5);
};

export const ic_soundSourcesOfSoundL4 = cards("sci.sound.sources-of-sound.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, a1s0, a1s1, a1s2, a2s0, a2s1, a2s2, a3s0, a3s1, a3s2, p1s0, p1s1, p1s2, g1s0, g1s1, g1s2,
  flowE1, flowE2, flowA1, flowP1, term6, term14,
]);
