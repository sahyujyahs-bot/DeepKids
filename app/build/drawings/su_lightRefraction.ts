import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, hand, write, cards, rnd, glass } from "./flatKit";

// LIGHT BENDS · sci.light.refraction.L3 · set-up cards for the three experiments:
// e1 a pencil in water, e2 a water drop as a magnifier, e3 the coin that appears.
const PI = Math.PI;
const NEWS = "#f3eddc";

// shade side on the right: a darker flat tone clipped inside the shape, offset to the right (and down)
const shd = (c: Ctx, path: () => void, col: string, dx: number, dy = 0, alpha = 0.5) => {
  c.save(); c.beginPath(); path(); c.clip(); c.beginPath(); c.rect(-5000, -5000, 10000, 10000); c.save(); c.translate(-dx, -dy); path(); c.restore();
  c.fillStyle = col; c.globalAlpha = alpha; c.fill("evenodd"); c.restore(); c.globalAlpha = 1;
};
// a forearm: a sleeve-wide band from (x1, y1) to (x2, y2), butt ends
const arm = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number, col: string = CLOTH.child) => {
  c.lineCap = "butt"; line(c, [[x1, y1], [x2, y2]], w + 6, INK); c.lineCap = "butt"; line(c, [[x1, y1], [x2, y2]], w, col); c.lineCap = "round";
};
// a hand pointing with one finger (wrist at x, y, along angle an; mir = coming from the right)
const pointHand = (c: Ctx, x: number, y: number, an: number, s: number, mir = false, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, y); if (mir) c.scale(-1, 1); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), sleeve, 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, skin, 6);
  for (let k = 1; k < 4; k++) shape(c, () => rrect(c, 38, -30 + k * 17, 40, 17, 8.5), skin, 5);
  shape(c, () => rrect(c, 38, -30, 150, 17, 8.5), skin, 5);
  shape(c, () => { c.moveTo(-4, 30); c.quadraticCurveTo(22, 58, 48, 50); c.quadraticCurveTo(60, 44, 46, 34); c.quadraticCurveTo(26, 32, 12, 18); c.closePath(); }, skin, 5);
  c.restore();
};
// a child's face: calm, puzzled or wide-eyed; lx, ly = where the eyes look
const face = (c: Ctx, x: number, y: number, r: number, mood: "calm" | "puzzled" | "wide", lx = 0, ly = 0) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  const er = mood === "wide" ? 0.3 : 0.2;
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * r * 0.36, y + r * 0.1, r * (er * 0.85), r * er * 1.2), WHITE, 4);
    shape(c, () => ell(c, x + s * r * 0.36 + lx * r * 0.07, y + r * 0.1 + ly * r * 0.08, r * 0.1, r * 0.12), INK, 0);
  }
  if (mood === "puzzled") { line(c, [[x - r * 0.62, y - r * 0.22], [x - r * 0.12, y - r * 0.3]], 5); line(c, [[x + r * 0.15, y - r * 0.12], [x + r * 0.62, y - r * 0.3]], 5); }
  if (mood === "wide") { line(c, [[x - r * 0.62, y - r * 0.38], [x - r * 0.12, y - r * 0.42]], 5); line(c, [[x + r * 0.12, y - r * 0.42], [x + r * 0.62, y - r * 0.38]], 5); }
  if (mood === "wide") shape(c, () => ell(c, x, y + r * 0.55, r * 0.15, r * 0.2), INK, 0);
  else if (mood === "puzzled") line(c, [[x - r * 0.25, y + r * 0.55], [x - r * 0.1, y + r * 0.48], [x + r * 0.08, y + r * 0.58], [x + r * 0.25, y + r * 0.5]], 4);
  else { c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};

// ---------------------------------------------------------------- things
// a pencil from its tip (tx, ty) to its eraser end (ex, ey), w thick
const pencil = (c: Ctx, tx: number, ty: number, ex: number, ey: number, w: number) => {
  const L = Math.hypot(ex - tx, ey - ty), a = Math.atan2(ey - ty, ex - tx), t = L * 0.12, b = L * 0.88, f = L * 0.93;
  c.save(); c.translate(tx, ty); c.rotate(a);
  shape(c, () => polyP(c, [[0, 0], [t, -w / 2], [t, w / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[0, 0], [t * 0.4, -w * 0.2], [t * 0.4, w * 0.2]]), COL.black, 3);
  const body = () => polyP(c, [[t, -w / 2], [b, -w / 2], [b, w / 2], [t, w / 2]]);
  shape(c, body, COL.yellow, 5); shd(c, body, COL.orange, 0, w * 0.3, 0.6);
  line(c, [[t + 14, -w * 0.28], [b - 14, -w * 0.28]], 4, WHITE);
  shape(c, () => polyP(c, [[b, -w / 2], [f, -w / 2], [f, w / 2], [b, w / 2]]), COL.steel, 5);
  shape(c, () => rrect(c, f, -w / 2, L - f, w, w * 0.3), COL.pink, 5);
  c.restore();
};
// the pencil seen through the water: above the water line as it is, below it shifted aside and fatter
const bentPencil = (c: Ctx, ly: number, tx: number, ty: number, ex: number, ey: number, w: number, dx: number) => {
  c.save(); c.beginPath(); c.rect(0, 0, D, ly); c.clip(); pencil(c, tx, ty, ex, ey, w); c.restore();
  c.save(); c.beginPath(); c.rect(0, ly, D, D); c.clip(); c.translate(dx, 0); pencil(c, tx, ty, ex, ey, w * 1.3); c.restore();
};
// a clear tumbler, bottom centre (x, y); P draws what is in it (once inside, tinted by the water, once above the rim)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, P: (c: Ctx, ly: number) => void) => {
  const top = w / 2, bot = w * 0.4, ry = w * 0.08, rim = y - h, ly = y - h * fill, lw = bot + (top - bot) * fill;
  const body = () => { c.moveTo(x - top, rim); c.lineTo(x + top, rim); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  shape(c, () => ell(c, x, rim, top, ry), "rgba(255,255,255,0.4)", 5);
  c.save(); c.beginPath(); body(); c.clip();
  if (fill > 0) {
    shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.water, 0);
    shape(c, () => ell(c, x, ly, lw, ry * lw / top), COL.drop, 0);
  }
  P(c, ly);
  if (fill > 0) { c.fillStyle = "rgba(95,159,211,0.3)"; c.fillRect(0, ly, D, D); }
  c.restore();
  shape(c, body, "rgba(214,236,250,0.1)", 5);
  c.save(); c.beginPath(); c.rect(0, 0, D, rim); c.clip(); P(c, ly); c.restore();
  c.beginPath(); c.ellipse(x, rim, top, ry, 0, 0, PI); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shine(c, [[x - top * 0.78, rim + h * 0.1], [x - bot * 0.8, y - h * 0.12]], 8);
  if (fill > 0) { c.beginPath(); c.ellipse(x, ly, lw, ry * lw / top, 0, 0, PI); c.strokeStyle = COL.waterDk; c.lineWidth = 4; c.stroke(); }
};
// a steel jug tipped to pour to the right: spout at the right, handle at the left; returns the spout tip and the handle
const jug = (c: Ctx, sx: number, sy: number, s: number, deg: number) => {
  const a = -deg * PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  const W = (x: number, y: number): [number, number] => [sx - s * (x * ca - y * sa), sy + s * (x * sa + y * ca)];
  c.save(); c.translate(sx, sy); c.scale(-s, s); c.rotate(a);
  line(c, [[256, 50], [338, 70], [338, 232], [256, 262]], 34, INK); line(c, [[256, 50], [338, 70], [338, 232], [256, 262]], 20, COL.steel);
  const body = () => { c.moveTo(-36, -20); c.lineTo(260, 0); c.lineTo(260, 290); c.quadraticCurveTo(260, 322, 228, 322); c.lineTo(32, 322); c.quadraticCurveTo(0, 322, 0, 290); c.lineTo(0, 40); c.closePath(); };
  shape(c, body, COL.steel, 6); shd(c, body, COL.steelDk, -60, 0, 0.6);
  shape(c, () => polyP(c, [[-30, -16], [254, 4], [254, 34], [4, 36]]), COL.steelDk, 4);
  line(c, [[40, 90], [40, 270]], 9, WHITE);
  c.restore();
  return { tip: W(-36, -20), handle: W(338, 150) };
};
const stream = (c: Ctx, x0: number, y0: number, y1: number) => {
  const p = [[x0, y0], [x0 + 8, y0 + 40], [x0 + 10, y1]];
  line(c, p, 34, INK); line(c, p, 22, COL.water); line(c, [[x0 + 4, y0 + 30], [x0 + 6, y1 - 20]], 5, COL.drop);
};

// a book seen from the side: cover, pages
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  shape(c, () => rrect(c, x, y, w, h, 8), col, 6);
  shape(c, () => rrect(c, x + 20, y + h * 0.2, w - 20, h * 0.6, 4), COL.paper, 4);
  line(c, [[x + 34, y + h * 0.4], [x + w - 8, y + h * 0.4]], 2.5, COL.grey); line(c, [[x + 34, y + h * 0.6], [x + w - 8, y + h * 0.6]], 2.5, COL.grey);
};

// a cup cut in half: the near half is gone so you see inside. (ox, oy) = left end of the rim inside, s = size, ws = water surface (cup units)
const cup = (c: Ctx, ox: number, oy: number, s: number, ws: number | null = null) => {
  const P = (pts: number[][]) => pts.map(([x, y]) => [ox + x * s, oy + y * s]);
  shadow(c, ox + 175 * s, oy + 146 * s, 215 * s, 17 * s);
  shape(c, () => polyP(c, P([[0, 0], [330, 0], [316, 124], [14, 124]])), COL.steelIn, 0);
  // dough and coin stuck at the bottom, near the side
  shape(c, () => ell(c, ox + 62 * s, oy + 119 * s, 56 * s, 11 * s), "#efe2c4", 4);
  shape(c, () => ell(c, ox + 62 * s, oy + 112 * s, 40 * s, 13 * s), COL.steelDk, 4);
  shape(c, () => ell(c, ox + 62 * s, oy + 106 * s, 40 * s, 13 * s), COL.steel, 4);
  c.beginPath(); ell(c, ox + 62 * s, oy + 106 * s, 28 * s, 8 * s); c.strokeStyle = COL.steelDk; c.lineWidth = 3; c.stroke();
  if (ws !== null) {
    const xl = 14 * ws / 124, xr = 330 - 14 * ws / 124;
    shape(c, () => polyP(c, P([[xl, ws], [xr, ws], [316, 124], [14, 124]])), "rgba(143,195,234,0.72)", 0);
    line(c, P([[xl, ws], [xr, ws]]), 4, COL.waterDk);
  }
  const wall = () => polyP(c, P([[-18, -2], [2, 144], [332, 144], [348, -2], [330, 0], [316, 124], [14, 124], [0, 0]]));
  shape(c, wall, COL.steel, 6); shd(c, wall, COL.steelDk, 34 * s, 0, 0.55);
  line(c, P([[-12, 14], [6, 128]]), 6, WHITE);
};
// a dashed line of sight
const sight = (c: Ctx, pts: number[][]) => { c.save(); c.setLineDash([18, 14]); line(c, pts, 5, "rgba(43,35,64,0.75)"); c.restore(); };

// ---------------------------------------------------------------- newspaper, ruler, drops
// one line of small print as little letter shapes: stems, round letters, tall letters
const printRow = (c: Ctx, x0: number, x1: number, y: number, h: number, seed: number) => {
  const r = rnd(seed); c.strokeStyle = COL.greyDk; c.lineCap = "round"; c.lineWidth = Math.max(2, h * 0.16);
  let x = x0;
  while (x < x1) {
    const n = 2 + Math.floor(r() * 6);
    for (let k = 0; k < n && x < x1; k++) {
      const t = r(); c.beginPath();
      if (t < 0.35) { c.moveTo(x, y + h * 0.3); c.lineTo(x, y + h); }
      else if (t < 0.65) c.ellipse(x, y + h * 0.68, h * 0.2, h * 0.28, 0, 0, PI * 2);
      else { c.moveTo(x, y); c.lineTo(x, y + h); c.moveTo(x + h * 0.4, y + h * 0.68); c.ellipse(x + h * 0.2, y + h * 0.68, h * 0.2, h * 0.28, 0, 0, PI * 2); }
      c.stroke(); x += h * 0.62;
    }
    x += h * 0.7;
  }
};
// a clear plastic ruler, left end (x, y), h tall, pitch = pixels per cm, n cm
const ruler = (c: Ctx, x: number, y: number, h: number, pitch: number, n: number) => {
  const wd = pitch * n + 50;
  shape(c, () => rrect(c, x - 12, y, wd, h, 10), "rgba(206,232,248,0.62)", 6);
  shine(c, [[x + 6, y + h - 16], [x + wd - 30, y + h - 16]], 6);
  c.lineCap = "butt";
  for (let mm = 0; mm <= n * 10; mm++) { const tx = x + mm * pitch / 10, ln = mm % 10 === 0 ? 38 : mm % 5 === 0 ? 26 : 14; line(c, [[tx, y], [tx, y + ln]], mm % 10 === 0 ? 4 : 2.5); }
  c.lineCap = "round";
  const nh = pitch * 0.5;
  for (let k = 0; k <= n; k++) { const t = String(k); write(c, t, x + k * pitch - (t.length * 0.8 * nh - 0.2 * nh) / 2, y + 46, nh, INK, 4); }
};
// a water drop on the paper, base centre (x, y), radius r: the print seen through it is k times bigger
const drop = (c: Ctx, x: number, y: number, r: number, k: number, print: (c: Ctx) => void, paper: string) => {
  const path = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.15, x + r, y - r * 1.15, x + r, y); c.closePath(); };
  shadow(c, x + r * 0.3, y + 4, r * 0.95, r * 0.14);
  c.save(); c.beginPath(); path(); c.clip(); c.fillStyle = paper; c.fillRect(x - r, y - r * 1.2, r * 2, r * 1.3);
  c.translate(x, y - r * 0.3); c.scale(k, k); c.translate(-x, -(y - r * 0.3)); print(c); c.restore();
  shape(c, path, "rgba(190,225,250,0.2)", 5);
  line(c, [[x - r * 0.6, y - r * 0.4], [x - r * 0.4, y - r * 0.72]], Math.max(3, r * 0.09), "rgba(255,255,255,0.85)");
};
const dropPrint = (c: Ctx) => { for (let i = 0; i < 10; i++) printRow(c, -20, D + 20, 470 + i * 60, 30, 40 + i); };

// ================================================================ e1 · the pencil in water
// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c);
  const tip = [560, 915], end = [405, 240];
  tumbler(c, 480, 930, 420, 560, 0, (c) => pencil(c, tip[0], tip[1], end[0], end[1], 36));
  arm(c, 310 - 125 * Math.cos(-0.23), 350 - 125 * Math.sin(-0.23), -40, 420, 115);
  hand(c, 310, 350, -0.23, 1.6);
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c);
  const sx = 560, sy = 330, deg = 50, s = 1.0;
  const tipX = sx + 38.4 * s;
  tumbler(c, 700, 950, 380, 480, 0.55, (c, ly) => { bentPencil(c, ly, 660, 930, 810, 330, 36, -75); stream(c, tipX, sy + 15, ly + 6); });
  const j = jug(c, sx, sy, s, deg);
  const an = deg * PI / 180, sh = 1.5, hx = j.handle[0] - 70 * sh * Math.cos(an), hy = j.handle[1] - 70 * sh * Math.sin(an);
  arm(c, hx - 78 * sh * Math.cos(an), hy - 78 * sh * Math.sin(an), hx - 500 * Math.cos(an), hy - 500 * Math.sin(an), 72 * sh);
  hand(c, hx, hy, an, sh);
  arrow(c, [[250, 600], [350, 690]], RED, 12);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  const an = 1.37, sh = 1.5, dir = [Math.cos(an), Math.sin(an)], tip = [480, 730], wx = tip[0] - dir[0] * 188 * sh, wy = tip[1] - dir[1] * 188 * sh;
  tumbler(c, 540, 960, 420, 540, 0.6, (c, ly) => {
    bentPencil(c, ly, 600, 935, 560, 330, 36, -75);
    const cx = wx - dir[0] * 78 * sh, cy = wy - dir[1] * 78 * sh;
    arm(c, cx, cy, cx - dir[0] * 450, cy - dir[1] * 450, 72 * sh);
    pointHand(c, wx, wy, an, sh);
  });
  face(c, 880, 220, 105, "puzzled", -1, 1);
  line(c, [[730, 120], [740, 92], [768, 88], [784, 112], [764, 142], [756, 166]], 9);
  c.beginPath(); ell(c, 754, 200, 7, 7); c.fillStyle = INK; c.fill();
  arrow(c, [[250, 520], [270, 720]], RED, 12);
};

// ================================================================ e2 · a drop as a magnifier
// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 420, 990, 400, 30);
  shape(c, () => rrect(c, 50, 130, 730, 850, 10), NEWS, 6);
  shape(c, () => rrect(c, 80, 170, 670, 40, 6), COL.black, 0);
  shape(c, () => rrect(c, 80, 238, 380, 16, 6), COL.greyDk, 0);
  for (let col = 0; col < 3; col++) for (let i = 0; i < 20; i++) { const y = 290 + i * 33; if (y > 470 && y < 690 && col !== 2) continue; printRow(c, 80 + col * 225, 275 + col * 225, y, 18, col * 100 + i); }
  ruler(c, 80, 500, 150, 43, 15);
  glass(c, 915, 950, 210, 360, 0.72);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = NEWS; c.fillRect(0, 430, D, 650); line(c, [[0, 430], [D, 430]], 6);
  for (let i = 0; i < 10; i++) printRow(c, 20, D - 20, 470 + i * 60, 30, 40 + i);
  ruler(c, 40, 610, 190, 66, 15);
  const tx = 830, hx = 830 - 58 * 1.7, hy = 260;
  arm(c, hx - 78 * 1.7, hy, -40, hy, 72 * 1.7);
  // the straw, red and white
  const straw = () => rrect(c, tx - 15, -20, 30, 700, 6);
  shape(c, straw, WHITE, 5);
  c.save(); c.beginPath(); straw(); c.clip();
  for (let y = -20; y < 700; y += 64) { c.beginPath(); c.moveTo(tx - 15, y + 20); c.lineTo(tx + 15, y); c.lineTo(tx + 15, y + 22); c.lineTo(tx - 15, y + 42); c.closePath(); c.fillStyle = RED; c.fill(); }
  c.restore(); shape(c, straw, "rgba(0,0,0,0)", 5);
  drop(c, 190, 800, 44, 2.5, dropPrint, NEWS);
  drop(c, 450, 800, 72, 2, dropPrint, NEWS);
  drop(c, 830, 800, 125, 1.6, dropPrint, NEWS);
  hand(c, hx, hy, 0, 1.7);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = NEWS; c.fillRect(0, 470, D, 610); line(c, [[0, 470], [D, 470]], 6);
  for (let i = 0; i < 8; i++) printRow(c, 20, D - 20, 530 + i * 60, 30, 40 + i);
  drop(c, 250, 800, 44, 2.5, dropPrint, NEWS);
  drop(c, 540, 800, 72, 2, dropPrint, NEWS);
  drop(c, 860, 800, 125, 1.6, dropPrint, NEWS);
  // a big eye above the tiny drop, looking straight down at it
  shape(c, () => ell(c, 250, 215, 225, 165), SKIN.child);
  line(c, [[110, 95], [180, 62], [320, 62], [390, 95]], 16, CLOTH.hair);
  const eye = () => { c.moveTo(100, 220); c.quadraticCurveTo(250, 90, 400, 220); c.quadraticCurveTo(250, 340, 100, 220); c.closePath(); };
  shape(c, eye, WHITE, 8);
  c.save(); c.beginPath(); eye(); c.clip();
  shape(c, () => ell(c, 250, 280, 78, 78), COL.brown, 6); shape(c, () => ell(c, 250, 285, 36, 36), INK, 0); shape(c, () => ell(c, 228, 262, 12, 12), WHITE, 0);
  c.restore(); shape(c, () => { c.moveTo(100, 220); c.quadraticCurveTo(250, 90, 400, 220); }, "rgba(0,0,0,0)", 8);
  sight(c, [[250, 360], [250, 690]]);
};

// ================================================================ e3 · the coin that appears
const TABLE = 950, K = 1.4, EYE: [number, number] = [242, 546], O: [number, number] = [EYE[0] + 190, EYE[1] + 190];
const childAtBooks = (c: Ctx, mood: "calm" | "wide") => {
  ground(c);
  shape(c, () => rrect(c, 60, 620, 300, 700, 60), CLOTH.child); shd(c, () => rrect(c, 60, 620, 300, 700, 60), CLOTH.childDk, 40, 0, 0.6);
  c.fillStyle = "#e4d6ba"; c.fillRect(0, TABLE, D, D - TABLE); line(c, [[0, TABLE], [D, TABLE]], 6);
  const cols = [COL.red, COL.blue, COL.green, COL.purple], ws = [320, 270, 300, 250], off = [0, 16, -8, 10];
  shadow(c, 215, TABLE + 14, 200, 16);
  for (let i = 0; i < 4; i++) book(c, 200 - ws[i] / 2 + off[i], TABLE - 80 * (i + 1), ws[i], 80, cols[i]);
  face(c, 200, 535, 95, mood, 1.4, 0.8);
};
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c);
  const s = 1.9, ox = 227, oy = 520;
  cup(c, ox, oy, s);
  const an = 1.35, sh = 1.2, dir = [-Math.cos(an), Math.sin(an)], tipX = 190 * sh, wx = 372 - dir[0] * tipX, wy = 712 - dir[1] * tipX;
  arm(c, wx - dir[0] * 78 * sh, wy - dir[1] * 78 * sh, wx - dir[0] * 78 * sh - 100, wy - dir[1] * 78 * sh - 440, 72 * sh);
  pointHand(c, wx, wy, an, sh, true);
  arrow(c, [[560, 570], [500, 700]], RED, 12);
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  childAtBooks(c, "calm");
  cup(c, O[0], O[1], K);
  // the part of the cup floor the eye cannot see is shaded
  shape(c, () => polyP(c, [[O[0], O[1]], [O[0] + 124 * K, O[1] + 124 * K], [O[0] + 14 * K, O[1] + 124 * K]]), "rgba(43,35,64,0.2)", 0);
  sight(c, [EYE, [O[0], O[1]], [O[0] + 124 * K, O[1] + 124 * K]]);
};
// setup.e3.2
const e3s2 = (c: Ctx) => {
  childAtBooks(c, "wide");
  const ws = 46;
  cup(c, O[0], O[1], K, ws);
  sight(c, [EYE, [O[0] + ws * K, O[1] + ws * K], [O[0] + (ws + 0.62 * 60) * K, O[1] + 106 * K]]);
  const s = 0.85, deg = 45, sx = 726, sy = 330;
  stream(c, sx + 39.6 * s, sy + 11.4 * s, O[1] + ws * K + 4);
  const j = jug(c, sx, sy, s, deg);
  const an = deg * PI / 180, sh = 1.3, hx = j.handle[0] - 70 * sh * Math.cos(an), hy = j.handle[1] - 70 * sh * Math.sin(an);
  arm(c, hx - 78 * sh * Math.cos(an), hy - 78 * sh * Math.sin(an), hx - 500 * Math.cos(an), hy - 500 * Math.sin(an), 72 * sh, CLOTH.adult);
  hand(c, hx, hy, an, sh, SKIN.adult, CLOTH.adult);
};

export const su_lightRefraction = cards("sci.light.refraction.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
