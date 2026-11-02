import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, rnd, write } from "./flatKit";

// sci.states.dissolving.L3 picture cards (intro, summary, activity, term and idea cards, flat style)
const CLOUD = "#efe9dc", MUD = "#9c6a38", MUDDK = "#8b6240", OIL = "#f2c94c", OILS = "#f8dd7a", SAND = "#d9b97a", PINK = "#f08aa6";
const TEA = "#a0623a", COFFEE = "#8a4a22", LEMON = "#f6e27a", OK = "#3f9b4a", WATERBG = "#cfe6f7", DARK = "#22303a";
type Grain = { f: string; d: string; s: string };
const SALT: Grain = { f: WHITE, d: "#98a3b3", s: "#c9ccd6" }, SUGAR: Grain = { f: "#fff0cf", d: "#e0b25c", s: "#e8cf94" };
const ATTA: Grain = { f: "#f3e2c0", d: "#c9a66b", s: "#dcc08e" }, JAGGERY: Grain = { f: "#b5702f", d: "#8a4f1d", s: "#8c5320" };
const GROUNDS: Grain = { f: "#5b3a24", d: "#2e1b10", s: "#3e2616" };

// a clear glass with liquid; bands = [from, to, colour] as fractions of the glass height from the bottom
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, fill = 0, liquid: string = COL.water, bands: [number, number, string][] = [], surf: string = COL.drop) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4;
  if (fill > 0) {
    const ly = y - h * fill, lw = bot + (top - bot) * fill;
    c.save(); c.beginPath(); c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); c.clip();
    c.fillStyle = liquid; c.fillRect(x - top, ly, w, h);
    for (const [a, b, col] of bands) { c.fillStyle = col; c.fillRect(x - top, y - h * b, w, h * (b - a)); }
    c.restore();
    shape(c, () => ell(c, x, ly, lw, w * 0.07), surf, 0);
  }
  shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.glass, 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
const heap = (c: Ctx, x: number, y: number, w: number, h: number, g: Grain, seedN = 3) => {
  const p = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.18, y - h * 1.5, x, y - h); c.quadraticCurveTo(x + w * 0.18, y - h * 1.5, x + w / 2, y); c.closePath(); };
  shape(c, p, g.f, 5); shade(c, p, g.s, w * 0.08, 0, 0.5);
  const r = rnd(seedN);
  for (let i = 0; i < 14; i++) { const u = r(), v = r(), px = x - w * 0.36 + u * w * 0.72, py = y - 6 - v * h * 0.55 * (1 - Math.abs(u - 0.5) * 1.3); shape(c, () => ell(c, px, py, 4.5, 3.5), g.d, 0); }
};
const grain = (c: Ctx, x: number, y: number, g: Grain, r = 10) => shape(c, () => ell(c, x, y, r, r * 0.8), g.f, 3.5);
const spoon = (c: Ctx, bx: number, by: number, hx: number, hy: number, rx = 34, ry = 48, load: Grain | null = null) => {
  const rot = Math.atan2(hy - by, hx - bx) - Math.PI / 2;
  line(c, [[bx, by], [hx, hy]], 26, INK); line(c, [[bx, by], [hx, hy]], 14, COL.steel);
  shape(c, () => ell(c, bx, by, rx, ry, rot), COL.steel, 5);
  shape(c, () => ell(c, bx, by, rx * 0.65, ry * 0.65, rot), COL.steelIn, 0);
  if (load) shape(c, () => ell(c, bx, by, rx * 0.62, ry * 0.5, rot), load.f, 3);
};
const tick = (c: Ctx, x: number, y: number, s: number) => { const p = [[x - s, y], [x - s * 0.3, y + s * 0.75], [x + s, y - s * 0.8]]; line(c, p, s * 0.55, INK); line(c, p, s * 0.32, OK); };
const cross = (c: Ctx, x: number, y: number, s: number) => {
  const a = [[x - s * 0.8, y - s * 0.8], [x + s * 0.8, y + s * 0.8]], b = [[x + s * 0.8, y - s * 0.8], [x - s * 0.8, y + s * 0.8]];
  line(c, a, s * 0.55, INK); line(c, b, s * 0.55, INK); line(c, a, s * 0.32, RED); line(c, b, s * 0.32, RED);
};
const ball = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.14));
// a salt ion: small blue ball with a plus (sodium) or big orange ball with a minus (chloride)
const ion = (c: Ctx, x: number, y: number, plus: boolean) => {
  const r = plus ? 26 : 40, hh = plus ? 30 : 40;
  ball(c, x, y, r, plus ? COL.blue : COL.orange);
  write(c, plus ? "+" : "-", x - hh * 0.28, y - hh * 0.55, hh, WHITE, 6);
};
const cube = (c: Ctx, x: number, y: number, s: number, lw = 5) => {
  const k = 0.87 * s;
  shape(c, () => polyP(c, [[x - k, y - s * 0.5], [x, y], [x, y + s], [x - k, y + s * 0.5]]), "#eceff6", lw);
  shape(c, () => polyP(c, [[x, y], [x + k, y - s * 0.5], [x + k, y + s * 0.5], [x, y + s]]), "#c4ccdd", lw);
  shape(c, () => polyP(c, [[x, y - s], [x + k, y - s * 0.5], [x, y], [x - k, y - s * 0.5]]), WHITE, lw);
};
const zoom = (c: Ctx, cx: number, cy: number, r: number, from: number[] | null, inner: () => void, bg = WATERBG) => {
  if (from) {
    const d = Math.hypot(cx - from[0], cy - from[1]), a = Math.atan2(from[1] - cy, from[0] - cx), o = Math.acos(Math.min(1, r / d));
    for (const s of [-1, 1]) line(c, [from, [cx + Math.cos(a + s * o) * r, cy + Math.sin(a + s * o) * r]], 5);
  }
  shape(c, () => c.arc(cx, cy, r, 0, Math.PI * 2), bg, 0);
  c.save(); c.beginPath(); c.arc(cx, cy, r - 3, 0, Math.PI * 2); c.clip(); inner(); c.restore();
  shape(c, () => c.arc(cx, cy, r, 0, Math.PI * 2), "rgba(0,0,0,0)", 8);
};
const waterDots = (c: Ctx, pts: number[][], r = 13) => pts.forEach(([x, y]) => { ball(c, x, y, r, "#7fb2f0"); });
const bottle = (c: Ctx, x: number, yb: number, w: number, h: number, fill: number, liquid: string, bands: [number, number, string][] = [], extra: (() => void) | null = null, capCol: string = COL.teal) => {
  const nw = w * 0.34, sh = h * 0.6, nk = h * 0.8;
  const body = () => { c.moveTo(x - w / 2, yb); c.lineTo(x - w / 2, yb - sh); c.quadraticCurveTo(x - w / 2, yb - nk, x - nw / 2, yb - nk - h * 0.04); c.lineTo(x - nw / 2, yb - h); c.lineTo(x + nw / 2, yb - h); c.lineTo(x + nw / 2, yb - nk - h * 0.04); c.quadraticCurveTo(x + w / 2, yb - nk, x + w / 2, yb - sh); c.lineTo(x + w / 2, yb); c.closePath(); };
  shadow(c, x + w * 0.1, yb + 6, w * 0.6, w * 0.1);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = liquid; c.fillRect(x - w, yb - h * fill, w * 2, h);
  for (const [a, b, col] of bands) { c.fillStyle = col; c.fillRect(x - w, yb - h * b, w * 2, h * (b - a)); }
  if (extra) extra();
  c.restore();
  shape(c, body, COL.glass, 5);
  shape(c, () => rrect(c, x - nw / 2 - 6, yb - h - 30, nw + 12, 42, 8), capCol, 5);
  shine(c, [[x - w * 0.34, yb - h * 0.5], [x - w * 0.34, yb - h * 0.12]], 8);
};
// a glass tipped to pour to the right; returns the lip where the liquid leaves
const tilted = (c: Ctx, px: number, py: number, rot: number, w: number, h: number, liquid: string) => {
  const bot = w * 0.4, T = ([x, y]: number[]) => [px + x * Math.cos(rot) - y * Math.sin(rot), py + x * Math.sin(rot) + y * Math.cos(rot)];
  const body = [T([-w / 2, -h]), T([w / 2, -h]), T([bot, 0]), T([-bot, 0])], lip = T([w / 2, -h]);
  c.save(); c.beginPath(); polyP(c, body); c.clip(); c.fillStyle = liquid; c.fillRect(-100, lip[1], 1300, 1300); c.restore();
  shape(c, () => polyP(c, body), COL.glass, 5);
  const t0 = T([0, -h]); shape(c, () => ell(c, t0[0], t0[1], w / 2, w * 0.08, rot), "rgba(255,255,255,0.35)", 5);
  shine(c, [T([-w * 0.3, -h * 0.85]), T([-bot * 0.7, -h * 0.2])], 7);
  return lip;
};
// a steel tea strainer seen from the side: rim centre (x, y), radius r, handle to one side; fill draws what is in it
const strainer = (c: Ctx, x: number, y: number, r: number, dir: number, fillIn: () => void) => {
  const d = r * 0.8, hp = [[x + dir * r * 0.9, y], [x + dir * (r + 90), y - 50]];
  line(c, hp, 26, INK); line(c, hp, 14, COL.steel);
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y + d * 1.33, x + r, y + d * 1.33, x + r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.18, 0, 0.5);
  c.save(); c.beginPath(); body(); c.clip();
  for (let k = -3; k <= 3; k++) { line(c, [[x + k * r * 0.3, y], [x + k * r * 0.22, y + d * 1.1]], 3, COL.steelDk); }
  for (let k = 1; k <= 3; k++) line(c, [[x - r, y + k * d * 0.25], [x + r, y + k * d * 0.25]], 3, COL.steelDk);
  c.restore();
  shape(c, () => ell(c, x, y, r, r * 0.22), COL.steelIn, 5);
  fillIn();
};
const drop = (c: Ctx, x: number, y: number, r: number, col: string, lw = 4) => shape(c, () => { c.moveTo(x, y - 1.7 * r); c.bezierCurveTo(x + 0.3 * r, y - r, x + r, y - 0.6 * r, x + r, y); c.arc(x, y, r, 0, Math.PI, false); c.bezierCurveTo(x - r, y - 0.6 * r, x - 0.3 * r, y - r, x, y - 1.7 * r); c.closePath(); }, col, lw);
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 1.05, r * 0.9, r * 0.15);
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.3, r * 0.36, r * 0.3, 6), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], 5); }
  line(c, [[x, y], [x + r * 0.35, y - r * 0.35]], 9, RED); line(c, [[x, y], [x, y - r * 0.5]], 7);
};
const cubeStack = (c: Ctx, x: number, y: number, n: number, g: Grain) => { for (let i = 0; i < n; i++) { shape(c, () => rrect(c, x - 75, y - 56 - i * 62, 150, 56, 12), g.f, 5); shade(c, () => rrect(c, x - 75, y - 56 - i * 62, 150, 56, 12), g.s, 14, 0, 0.6); } };
const mat = (c: Ctx, x: number, y: number, rx: number, col: string) => shape(c, () => ell(c, x, y + 4, rx, rx * 0.2), col, 5);
const steam = (c: Ctx, x: number, y: number) => { for (const dx of [-60, 0, 60]) { c.globalAlpha = 0.8; line(c, [[x + dx, y], [x + dx - 22, y - 36], [x + dx + 20, y - 72], [x + dx - 18, y - 108], [x + dx + 8, y - 140]], 11, COL.grey); c.globalAlpha = 1; } };
const iceCube = (c: Ctx, x: number, y: number, s: number) => { const p = () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.14); shape(c, p, "#e6f6ff", 5); shade(c, p, "#9fc9e8", s * 0.16, s * 0.16, 0.5); line(c, [[x - s * 0.3, y - s * 0.2], [x - s * 0.1, y - s * 0.35]], 7, WHITE); };
const packet = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 10, y + 6, w * 0.6, 14);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 12), COL.blue); shade(c, () => rrect(c, x - w / 2, y - h, w, h, 12), COL.blueDk, w * 0.14, 0, 0.6);
  shape(c, () => ell(c, x, y - h * 0.5, w * 0.32, w * 0.32), WHITE, 4);
  for (const [dx, dy] of [[-12, -6], [10, -14], [4, 12]]) shape(c, () => ell(c, x + dx, y - h * 0.5 + dy, 6, 5), "#98a3b3", 0);
};
const stirSpoon = (c: Ctx, x: number, y: number, hx: number, hy: number) => spoon(c, x, y, hx, hy, 30, 42);
const slip = (c: Ctx, x: number, y: number, g: Grain) => { shape(c, () => rrect(c, x - 110, y - 70, 220, 130, 10), COL.paper, 5); heap(c, x, y + 38, 150, 70, g, 11); };
const pourStream = (c: Ctx, lip: number[], tx: number, ty: number, col: string) => { line(c, [lip, [lip[0] + 14, lip[1] + 50], [tx, ty]], 22, INK); line(c, [lip, [lip[0] + 14, lip[1] + 50], [tx, ty]], 12, col); };
const jar = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + 14, yb + 8, w * 0.55, 18);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, 40);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w / 2, yb - h * 0.68, w, h); c.restore();
  heap(c, x, yb - 8, w * 0.7, 70, SUGAR, 5);
  shape(c, body, COL.glass, 5);
  shape(c, () => rrect(c, x - w / 2 - 10, yb - h - 56, w + 20, 70, 14), COL.steel, 6);
  shade(c, () => rrect(c, x - w / 2 - 10, yb - h - 56, w + 20, 70, 14), COL.steelDk, 16, 0, 0.5);
  shine(c, [[x - w * 0.36, yb - h * 0.88], [x - w * 0.36, yb - h * 0.3]], 8);
};

// ---- intro: salt water stays clear, atta water goes cloudy
const intro = (c: Ctx) => {
  ground(c);
  packet(c, 95, 900, 130, 190);
  tumbler(c, 330, 880, 330, 500, 0.75);
  spoon(c, 300, 640, 420, 330, 28, 40);
  tumbler(c, 720, 880, 330, 500, 0.75, CLOUD, [], "#f7f3ea");
  spoon(c, 690, 640, 810, 330, 28, 40);
  shadow(c, 965, 890, 90, 14);
  shape(c, () => { c.moveTo(865, 860); c.bezierCurveTo(880, 970, 1050, 970, 1065, 860); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, 965, 860, 100, 20), COL.steelIn, 5);
  heap(c, 965, 862, 140, 62, ATTA, 8);
};
// ---- summary: salt water with a heap left over, sugar syrup with a row of ten spoons
const summary = (c: Ctx) => {
  ground(c);
  tumbler(c, 300, 660, 300, 440, 0.8); heap(c, 300, 655, 170, 70, SALT, 4);
  tumbler(c, 780, 660, 300, 440, 0.8, "#fbe7a1", [], "#fff3c4");
  for (let i = 0; i < 10; i++) {
    const x = 90 + i * 100, y = 800;
    line(c, [[x, y + 20], [x, y + 190]], 22, INK); line(c, [[x, y + 20], [x, y + 190]], 11, COL.steel);
    shape(c, () => ell(c, x, y, 30, 42), COL.steel, 5); shape(c, () => ell(c, x, y, 19, 29), COL.steelIn, 0);
  }
};
// ---- e1 full glass test: spoons of salt and of sugar the same water takes
const e1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 290, 740, 300, 420, 0.62); heap(c, 290, 735, 150, 60, SALT, 6);
  tumbler(c, 790, 740, 300, 420, 0.62);
  spoon(c, 170, 880, 170, 990, 24, 34, SALT); write(c, "3", 250, 835, 110);
  spoon(c, 640, 880, 640, 990, 24, 34, SUGAR); write(c, "10", 710, 835, 110);
  arrow(c, [[290, 250], [290, 320]], RED, 10); arrow(c, [[790, 250], [790, 320]], RED, 10);
  spoon(c, 290, 140, 400, 60, 28, 40, SALT); spoon(c, 790, 140, 900, 60, 28, 40, SUGAR);
};
// ---- e2 cold, room, warm: how much sugar is left after the same time
const e2 = (c: Ctx) => {
  ground(c);
  stopwatch(c, 540, 190, 90);
  mat(c, 190, 780, 170, COL.blue); mat(c, 540, 780, 170, COL.grey); mat(c, 890, 780, 170, COL.orange);
  tumbler(c, 190, 780, 270, 400, 0.65); heap(c, 190, 774, 190, 90, SUGAR, 2); iceCube(c, 170, 540, 80);
  tumbler(c, 540, 780, 270, 400, 0.65); heap(c, 540, 774, 140, 55, SUGAR, 3);
  tumbler(c, 890, 780, 270, 400, 0.65);
  steam(c, 890, 360);
};
// ---- e3 cool and warm water, the same small heap of salt
const e3 = (c: Ctx) => {
  ground(c);
  mat(c, 290, 810, 190, COL.grey); mat(c, 790, 810, 190, COL.orange);
  tumbler(c, 290, 810, 320, 430, 0.65); heap(c, 290, 804, 170, 70, SALT, 6);
  tumbler(c, 790, 810, 320, 430, 0.65); heap(c, 790, 804, 170, 70, SALT, 7);
  steam(c, 790, 380);
  line(c, [[470, 560], [610, 560]], 18, INK); line(c, [[470, 620], [610, 620]], 18, INK);
};
// ---- a1 will it disappear: four cups sorted
const a1 = (c: Ctx) => {
  ground(c);
  const xs = [125, 390, 655, 920], w = 200, h = 330, y = 770;
  tumbler(c, xs[0], y, w, h, 0.75);
  tumbler(c, xs[1], y, w, h, 0.75, CLOUD, [], "#f7f3ea");
  tumbler(c, xs[2], y, w, h, 0.75); heap(c, xs[2], y - 5, 130, 55, { f: "#f0d58a", d: "#c79b3b", s: "#d9b765" }, 3);
  tumbler(c, xs[3], y, w, h, 0.75, COL.water, [[0.6, 0.75, OIL]], OILS);
  tick(c, xs[0], 340, 55); cross(c, xs[1], 340, 50); cross(c, xs[2], 340, 50); cross(c, xs[3], 340, 50);
};
// ---- a2 strain it: a cloth catches atta, not salt
const a2 = (c: Ctx) => {
  ground(c);
  for (const [x, dir, atta] of [[310, -1, true], [770, 1, false]] as [number, number, boolean][]) {
    drop(c, x, 150, 40, atta ? CLOUD : COL.water); arrow(c, [[x, 230], [x, 330]], RED, 10);
    strainer(c, x, 400, 150, dir, () => { shape(c, () => ell(c, x, 400, 130, 26), COL.paper, 3); if (atta) heap(c, x, 405, 110, 34, ATTA, 4); });
    drop(c, x, 650, 14, atta ? "#cfe3ee" : COL.water, 3); drop(c, x, 600, 12, atta ? "#cfe3ee" : COL.water, 3);
    shadow(c, x + 20, 800, 170, 24);
    shape(c, () => { c.moveTo(x - 170, 760); c.bezierCurveTo(x - 150, 910, x + 150, 910, x + 170, 760); c.closePath(); }, COL.steel);
    shape(c, () => ell(c, x, 760, 170, 34), atta ? "#cfe3ee" : COL.water, 5);
  }
};
// ---- a3 lemonade sweet to the last sip
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 820, 200, 24);
  const body = () => { c.moveTo(300, 300); c.lineTo(640, 300); c.lineTo(610, 800); c.lineTo(330, 800); c.closePath(); };
  line(c, [[630, 380], [740, 430], [735, 650], [620, 710]], 36, INK); line(c, [[630, 380], [740, 430], [735, 650], [620, 710]], 20, "#d6ecfa");
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = LEMON; c.fillRect(280, 390, 400, 450); c.restore();
  shape(c, () => ell(c, 470, 390, 168, 20), "#fbefa4", 0);
  shape(c, body, COL.glass, 5);
  shape(c, () => polyP(c, [[300, 300], [250, 270], [310, 340]]), COL.glass, 5);
  shape(c, () => ell(c, 470, 300, 170, 24), "rgba(255,255,255,0.35)", 5);
  shine(c, [[350, 400], [365, 730]], 9);
  // half lemon
  shape(c, () => ell(c, 150, 830, 105, 105), COL.yellow, 6);
  shape(c, () => ell(c, 150, 830, 82, 82), "#fff3a8", 4);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[150, 830], [150 + Math.cos(a) * 78, 830 + Math.sin(a) * 78]], 5, COL.yellow); }
  // tray with glasses
  shape(c, () => ell(c, 860, 845, 170, 38), COL.steel); shape(c, () => ell(c, 860, 842, 142, 28), COL.steelIn, 4);
  tumbler(c, 800, 840, 130, 230, 0.8, LEMON, [], "#fbefa4"); tumbler(c, 930, 840, 130, 230, 0.8, LEMON, [], "#fbefa4");
};
// ---- a4 oil stays on top, lemon juice mixes
const a4 = (c: Ctx) => {
  ground(c);
  bottle(c, 300, 930, 280, 640, 0.6, COL.water, [[0.5, 0.6, OIL]]);
  bottle(c, 780, 930, 280, 640, 0.6, "#f2e08f", [], null, COL.orange);
  cross(c, 300, 140, 55); tick(c, 780, 140, 55);
};
// ---- a5 coffee: grounds stay in the filter, the colour goes into the cup
const a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 860, 190, 22);
  shape(c, () => rrect(c, 130, 540, 320, 310, 26), COL.steel); shade(c, () => rrect(c, 130, 540, 320, 310, 26), COL.steelDk, 26, 0, 0.5);
  shape(c, () => ell(c, 290, 540, 160, 40), COL.steelIn, 5);
  shape(c, () => ell(c, 290, 545, 135, 28), "#5b3a24", 3);
  const r = rnd(4); for (let i = 0; i < 20; i++) shape(c, () => ell(c, 195 + r() * 190, 535 + r() * 22, 6, 4), "#7a5233", 0);
  arrow(c, [[480, 640], [610, 640]], RED, 10);
  tumbler(c, 800, 860, 300, 380, 0.7, COFFEE, [], "#9a5a30"); steam(c, 800, 460);
};
// ---- c1 clean the muddy water
const c1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 170, 580, 250, 320, 0.8, MUD, [], "#b48d62"); heap(c, 170, 574, 150, 30, { f: MUDDK, d: "#6b4a2e", s: "#6b4a2e" }, 5);
  arrow(c, [[250, 190], [420, 130]], RED, 10);
  const fun = () => { c.moveTo(430, 150); c.lineTo(850, 150); c.lineTo(850, 420); c.lineTo(675, 620); c.lineTo(605, 620); c.lineTo(430, 420); c.closePath(); };
  c.save(); c.beginPath(); fun(); c.clip();
  c.fillStyle = MUD; c.fillRect(420, 150, 440, 100);
  c.fillStyle = "#b9b3a8"; c.fillRect(420, 250, 440, 100);
  c.fillStyle = SAND; c.fillRect(420, 350, 440, 90);
  c.fillStyle = WHITE; c.fillRect(420, 440, 440, 200);
  const r = rnd(2); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 460 + r() * 380, 270 + r() * 60, 28, 22, r()), ["#d8d3c8", "#9c968a", "#c2bcb0"][i % 3], 4);
  for (let i = 0; i < 14; i++) shape(c, () => ell(c, 480 + r() * 340, 460 + r() * 100, 30, 18), "#f3f1ec", 3);
  c.restore();
  shape(c, fun, COL.glass, 6);
  shine(c, [[460, 200], [460, 380]], 8);
  drop(c, 640, 690, 12, COL.water, 3); drop(c, 640, 750, 12, COL.water, 3);
  tumbler(c, 640, 1000, 260, 250, 0.35);
};
// ---- c2 fastest sweet drink
const c2 = (c: Ctx) => {
  ground(c);
  jar(c, 400, 860, 300, 430);
  for (const [x, d] of [[150, -1], [650, 1]]) { const z = [[x, 520], [x + d * 40, 580], [x, 640], [x + d * 40, 700]]; line(c, z, 16, RED); }
  stopwatch(c, 870, 640, 130);
};
// ---- t0 dissolve: sugar goes into water and disappears
const t0 = (c: Ctx) => {
  ground(c);
  tumbler(c, 270, 820, 300, 420, 0.6);
  spoon(c, 290, 280, 140, 150, 34, 48, SUGAR);
  [[285, 360], [295, 410], [280, 460], [292, 505]].forEach(([x, y]) => grain(c, x, y, SUGAR));
  arrow(c, [[450, 600], [640, 600]], RED, 12);
  tumbler(c, 810, 820, 300, 420, 0.6);
};
// ---- t1 solution: salt water and sherbet syrup
const t1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 300, 850, 330, 460, 0.75);
  bottle(c, 780, 850, 270, 620, 0.78, PINK, [], null, COL.red);
};
// ---- t2 soluble: salt, sugar and jaggery bowls with ticks
const t2 = (c: Ctx) => {
  ground(c);
  const bx = [185, 540, 895];
  [SALT, SUGAR, JAGGERY].forEach((g, i) => {
    shadow(c, bx[i] + 14, 750, 130, 20);
    shape(c, () => { c.moveTo(bx[i] - 150, 690); c.bezierCurveTo(bx[i] - 130, 820, bx[i] + 130, 820, bx[i] + 150, 690); c.closePath(); }, COL.steel);
    shape(c, () => ell(c, bx[i], 690, 150, 30), COL.steelIn, 5);
    heap(c, bx[i], 694, 210, 120, g, 3 + i);
    tick(c, bx[i], 350, 62);
  });
};
// ---- t3 insoluble: sand sinks, oil floats
const t3 = (c: Ctx) => {
  ground(c);
  tumbler(c, 290, 830, 330, 470, 0.62, COL.water, [[0, 0.12, SAND]]); heap(c, 290, 824, 200, 40, { f: SAND, d: "#b48f4e", s: "#b48f4e" }, 9);
  tumbler(c, 790, 830, 330, 470, 0.62, COL.water, [[0.5, 0.62, OIL]], OILS);
  cross(c, 290, 260, 55); cross(c, 790, 260, 55);
};
// ---- t4 saturated: the last salt just lies there
const t4 = (c: Ctx) => {
  ground(c);
  tumbler(c, 480, 880, 400, 540, 0.72); heap(c, 480, 874, 280, 100, SALT, 6);
  spoon(c, 520, 560, 760, 220, 30, 42);
  arrow(c, Array.from({ length: 14 }, (_, k) => { const a = Math.PI * (0.95 + k * 0.1); return [520 + Math.cos(a) * 125, 585 + Math.sin(a) * 34]; }), RED, 10);
};
// ---- t5 settle: muddy water clears as it stands
const t5 = (c: Ctx) => {
  ground(c);
  tumbler(c, 160, 820, 250, 420, 0.85, MUD, [], "#b48d62");
  stirSpoon(c, 180, 640, 250, 330);
  tumbler(c, 530, 820, 250, 420, 0.85, "#c9ab86", [[0, 0.45, MUD]], "#d8bf9e");
  tumbler(c, 900, 820, 250, 420, 0.85, COL.water, [[0, 0.2, MUDDK]]);
  arrow(c, [[310, 560], [390, 560]], RED, 10); arrow(c, [[680, 560], [760, 560]], RED, 10);
};
// ---- t6 filter: tea through a strainer, leaves stay
const t6 = (c: Ctx) => {
  ground(c);
  const lip = tilted(c, 277, 330, 1.1, 190, 270, TEA);
  pourStream(c, lip, 640, 600, TEA);
  strainer(c, 640, 640, 150, 1, () => {
    shape(c, () => ell(c, 640, 640, 130, 24), "#4a3a22", 3);
    const r = rnd(7); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 560 + r() * 160, 632 + r() * 18, 16, 8, r() * 2), ["#3b6b2a", "#5a4524"][i % 2], 3);
  });
  drop(c, 640, 810, 12, TEA, 3);
  shadow(c, 650, 1000, 170, 22);
  shape(c, () => rrect(c, 500, 850, 280, 150, 50), COL.paper); shade(c, () => rrect(c, 500, 850, 280, 150, 50), "#d9d2c0", 24, 0, 0.5);
  line(c, [[780, 890], [850, 910], [850, 950], [770, 960]], 16, INK); line(c, [[780, 890], [850, 910], [850, 950], [770, 960]], 6, COL.paper);
  shape(c, () => ell(c, 640, 855, 140, 28), TEA, 5);
};
// ---- t7 ion: a salt grain comes apart into two kinds of balls
const t7 = (c: Ctx) => {
  ground(c);
  tumbler(c, 130, 1030, 200, 230, 0.6);
  zoom(c, 600, 460, 410, [150, 880], () => {
    cube(c, 290, 330, 105);
    ion(c, 470, 330, true); ion(c, 570, 440, false); ion(c, 670, 270, true); ion(c, 760, 400, false); ion(c, 520, 600, true); ion(c, 700, 600, false);
    arrow(c, [[400, 420], [480, 520]], RED, 8);
  });
};
// ---- t8 fair test: same water, same spoon, only the thing changes
const t8 = (c: Ctx) => {
  ground(c);
  tumbler(c, 290, 740, 300, 420, 0.62); spoon(c, 270, 560, 380, 300, 28, 40);
  tumbler(c, 790, 740, 300, 420, 0.62); spoon(c, 770, 560, 880, 300, 28, 40);
  line(c, [[470, 540], [610, 540]], 18, INK); line(c, [[470, 600], [610, 600]], 18, INK);
  slip(c, 290, 890, SALT); slip(c, 790, 890, SUGAR);
};
// ---- x0 what dissolving is: water crowds a grain and carries bits away
const x0 = (c: Ctx) => {
  ground(c);
  zoom(c, 540, 540, 460, null, () => {
    cube(c, 270, 700, 160);
    waterDots(c, [[470, 560], [520, 650], [470, 750], [380, 470], [270, 410], [520, 860], [330, 880], [150, 540]], 28);
    [[640, 560], [740, 470], [690, 380], [780, 640]].forEach(([x, y]) => ball(c, x, y, 18, COL.orange));
    arrow(c, [[570, 600], [700, 500]], RED, 10);
    waterDots(c, [[600, 780], [800, 800], [860, 540], [620, 280], [880, 380], [450, 230]], 28);
  });
};
// ---- x1 five glasses: dissolves, cloudy, sinks, floats, settles
const x1 = (c: Ctx) => {
  ground(c);
  const xs = [130, 335, 540, 745, 950], w = 170, h = 340, y = 700;
  tumbler(c, xs[0], y, w, h, 0.75);
  tumbler(c, xs[1], y, w, h, 0.75, CLOUD, [], "#f7f3ea");
  tumbler(c, xs[2], y, w, h, 0.75, COL.water, [[0, 0.1, SAND]]);
  tumbler(c, xs[3], y, w, h, 0.75, COL.water, [[0.62, 0.75, OIL]], OILS);
  tumbler(c, xs[4], y, w, h, 0.75, "#f2cf5a", [[0, 0.25, "#e3a52b"]], "#f7dd7e");
  tick(c, xs[0], 250, 45);
  [1, 2, 3, 4].forEach((i) => cross(c, xs[i], 250, 40));
};
// ---- x2 the same water takes 3 spoons of salt and 10 of sugar
const x2 = (c: Ctx) => {
  ground(c);
  tumbler(c, 300, 1010, 250, 210, 0.6); tumbler(c, 780, 1010, 250, 210, 0.6);
  cubeStack(c, 300, 790, 3, SALT); cubeStack(c, 780, 790, 10, SUGAR);
  write(c, "3", 270, 410, 90, INK, 9); write(c, "10", 720, 60, 90, INK, 9);
};
// ---- x3 salt-full water still takes sugar
const x3 = (c: Ctx) => {
  ground(c);
  tumbler(c, 520, 880, 400, 540, 0.75); heap(c, 520, 874, 170, 50, SALT, 6);
  spoon(c, 640, 190, 880, 80, 30, 42, SUGAR);
  grain(c, 625, 270, SUGAR, 12); grain(c, 632, 340, SUGAR, 12);
  c.globalAlpha = 0.7; grain(c, 620, 420, SUGAR, 12); c.globalAlpha = 0.45; grain(c, 628, 520, SUGAR, 11); c.globalAlpha = 0.25; grain(c, 622, 600, SUGAR, 10); c.globalAlpha = 1;
};
// ---- x4 warm water dissolves sugar faster
const x4 = (c: Ctx) => {
  ground(c);
  mat(c, 290, 810, 190, COL.blue); mat(c, 790, 810, 190, COL.orange);
  tumbler(c, 290, 810, 320, 440, 0.65); heap(c, 290, 804, 210, 90, SUGAR, 2); iceCube(c, 250, 530, 90); iceCube(c, 340, 545, 80);
  tumbler(c, 790, 810, 320, 440, 0.65);
  steam(c, 790, 370);
};
// ---- x5 a cloth catches the atta, the clearer water goes through
const x5 = (c: Ctx) => {
  ground(c);
  const lip = tilted(c, 250, 380, 1.1, 190, 270, CLOUD);
  pourStream(c, lip, 600, 640, CLOUD);
  tumbler(c, 640, 960, 500, 270, 0.4, "#d4e6ee", [], "#e6f1f5");
  shape(c, () => ell(c, 640, 690, 250, 44), COL.paper, 5);
  heap(c, 640, 696, 220, 50, ATTA, 4);
  drop(c, 640, 770, 12, "#d4e6ee", 3);
};
// ---- x6 salt comes apart into ions, sugar stays whole
const x6 = (c: Ctx) => {
  ground(c);
  zoom(c, 270, 440, 250, null, () => {
    c.save(); c.translate(0, 0); waterDots(c, [[190, 260], [120, 450], [300, 300], [170, 560], [400, 560], [440, 440], [120, 560]], 13);
    ion(c, 250, 330, true); ion(c, 330, 440, false); ion(c, 200, 450, true); ion(c, 300, 560, false); ion(c, 160, 340, false); ion(c, 380, 330, true);
    c.restore();
  });
  zoom(c, 810, 440, 250, null, () => {
    waterDots(c, [[700, 260], [660, 450], [900, 300], [720, 580], [940, 540], [960, 400], [780, 330]], 13);
    for (const [x, y] of [[790, 420], [880, 520], [760, 540], [900, 380]]) {
      line(c, [[x - 28, y - 14], [x, y + 14], [x + 28, y - 14]], 7, INK);
      [[x - 28, y - 14], [x, y + 14], [x + 28, y - 14]].forEach(([px, py]) => ball(c, px, py, 17, COL.orange));
    }
  });
  heap(c, 270, 960, 220, 90, SALT, 3); heap(c, 810, 960, 220, 90, SUGAR, 4);
};
// ---- x7 chemists study dissolving with flasks and computer pictures
const x7 = (c: Ctx) => {
  ground(c);
  const fl = () => { c.moveTo(220, 400); c.lineTo(220, 560); c.lineTo(110, 850); c.lineTo(390, 850); c.lineTo(280, 560); c.lineTo(280, 400); c.closePath(); };
  shadow(c, 260, 860, 150, 18);
  shape(c, fl, COL.glass, 5);
  shape(c, () => rrect(c, 205, 380, 90, 30, 8), COL.glass, 5);
  [[190, 825], [260, 830], [330, 825], [225, 790], [295, 792]].forEach(([x, y]) => cube(c, x, y - 20, 28, 4));
  shadow(c, 750, 920, 200, 20);
  shape(c, () => polyP(c, [[690, 760], [810, 760], [840, 900], [660, 900]]), COL.steel);
  shape(c, () => rrect(c, 640, 880, 220, 40, 10), COL.steelDk, 5);
  shape(c, () => rrect(c, 470, 220, 560, 560, 30), COL.steel, 6);
  shape(c, () => rrect(c, 500, 250, 500, 500, 14), DARK, 4);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) ball(c, 570 + i * 55, 600 + j * 55, 22, COL.orange);
  waterDots(c, [[760, 330], [880, 400], [800, 520], [930, 600], [700, 400], [860, 680], [720, 690]], 20);
  arrow(c, [[735, 560], [800, 500]], WHITE, 8); arrow(c, [[735, 620], [790, 700]], WHITE, 8);
  ball(c, 810, 460, 20, COL.orange);
};
// ---- x8 oil shaken into drops comes back as a layer
const x8 = (c: Ctx) => {
  ground(c);
  const r = rnd(5);
  bottle(c, 250, 930, 300, 660, 0.6, COL.water, [], () => { for (let i = 0; i < 26; i++) shape(c, () => ell(c, 130 + r() * 240, 560 + r() * 330, 8 + r() * 14, 8 + r() * 12), OIL, 3); }, COL.orange);
  for (const [x, d] of [[60, -1], [440, 1]]) line(c, [[x, 500], [x + d * 30, 560], [x, 620], [x + d * 30, 680]], 14, RED);
  arrow(c, [[480, 640], [620, 640]], RED, 12);
  bottle(c, 830, 930, 300, 660, 0.6, COL.water, [[0.5, 0.6, OIL]], null, COL.orange);
};

export const ic_statesDissolvingL3 = cards("sci.states.dissolving.L3 cards", [intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, x0, x1, x2, x3, x4, x5, x6, x7, x8]);
