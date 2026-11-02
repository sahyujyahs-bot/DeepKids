import type { Ctx } from "./core";
import {
  D, INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow,
  hand, person, write, cards, leaf,
} from "./flatKit";

// sci.forces.stretching-springs.L3 · picture cards (experiments, activities, challenges, terms).
// Same things as the set-up cards: blue rubber band, wooden ruler, paper cup, yellow coins, pen spring, dough, tennis ball.
const FLOOR = "#e2d2b0";
const BAND = COL.blue;
const DOUGH = "#ecd3a2", DOUGHDK = "#cfae78";
const STRAW = "#f3d98b";
const TWIG = "#9a6a3e", TWIGDK = "#6f4a28";
const SPONGE = "#f4d24a", SPONGEDK = "#d8b02a";
const BALL = "#d4e24a", BALLDK = "#a9b82a";
const TAPE = "rgba(255,240,170,0.9)";
const GLOW = "rgba(255,211,77,0.45)";
const CH = SKIN.child, SL = CLOTH.child;

const dash = (c: Ctx, on: number[], f: () => void) => { c.save(); c.setLineDash(on); f(); c.restore(); };
const room = (c: Ctx, top = 840) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, top, D, D - top); line(c, [[0, top], [D, top]], 6); };
const glow = (c: Ctx, x: number, y: number, r: number) => { for (const k of [1, 0.72, 0.46]) { c.beginPath(); ell(c, x, y, r * k, r * k); c.fillStyle = GLOW; c.fill(); } };

const bandFlat = (c: Ctx, x: number, y: number, w: number, h: number, t = 14) => {
  for (const [col, lw] of [[INK, t + 9], [BAND, t]] as [string, number][]) { c.beginPath(); rrect(c, x, y, w, h, h / 2); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = "round"; c.stroke(); }
};
// a band held tight from (x1, y) to (x2, y): a long thin loop, hooked over a hand at each end
const bandLine = (c: Ctx, x1: number, x2: number, y: number, gap = 14, t = 12) => {
  for (const [col, lw] of [[INK, t + 9], [BAND, t]] as [string, number][]) { c.beginPath(); c.moveTo(x1, y - gap); c.lineTo(x2, y - gap); c.quadraticCurveTo(x2 + gap * 3, y, x2, y + gap); c.lineTo(x1, y + gap); c.quadraticCurveTo(x1 - gap * 3, y, x1, y - gap); c.closePath(); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = "round"; c.stroke(); }
};
const coin = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  shape(c, () => ell(c, x, y, r, r * 0.8, rot), COL.yellow, 5);
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.5, rot), COL.orange, 3);
};
const rulerH = (c: Ctx, x: number, y: number, w: number, h: number, zeroX: number, step: number, n: number, lab: number, dir = 1, size = 28) => {
  shadow(c, x + w / 2 + 10, y + h + 12, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood);
  shade(c, () => rrect(c, x, y, w, h, 8), COL.woodDk, 0, h * 0.82, 0.7);
  for (let i = 0; i <= n; i++) {
    const tx = zeroX + dir * i * step;
    line(c, [[tx, y + 2], [tx, y + (i % lab === 0 ? h * 0.38 : h * 0.24)]], i % lab === 0 ? 5 : 3);
    if (i % lab === 0) write(c, String(i), tx - String(i).length * 0.4 * size + size * 0.1, y + h * 0.42, size, INK, 5);
  }
};
const rulerV = (c: Ctx, x: number, y: number, w: number, h: number, zeroY: number, step: number, n: number, lab: number, size = 24) => {
  shape(c, () => rrect(c, x, y, w, h, 7), COL.wood);
  shade(c, () => rrect(c, x, y, w, h, 7), COL.woodDk, w * 0.8, 0, 0.7);
  for (let i = 0; i <= n; i++) {
    const ty = zeroY + i * step;
    line(c, [[x + 2, ty], [x + (i % lab === 0 ? w * 0.45 : w * 0.28), ty]], i % lab === 0 ? 4.5 : 3);
    if (i % lab === 0) write(c, String(i), x + w * 0.5, ty - size * 0.5, size, INK, 4.5);
  }
};
// a pen spring from x0 to x1 along the card; wire width w, ring at each end (rings optional)
const spring = (c: Ctx, x0: number, x1: number, y: number, amp: number, turns: number, w = 21, rings = true) => {
  const pitch = (x1 - x0) / turns, r = pitch * 0.42, per = 18, o = w * 1.2;
  const at = (th: number): number[] => [x0 + (pitch * th) / (Math.PI * 2) - r * Math.cos(th) + r, y + amp * Math.sin(th)];
  for (let k = 0; k < turns * 2; k++) {
    const pts: number[][] = [];
    for (let i = 0; i <= per; i++) pts.push(at(Math.PI * (k + i / per)));
    line(c, pts, w, INK); line(c, pts, w - 9, k % 2 ? COL.steelDk : COL.steel);
  }
  if (rings) for (const [rx, dir] of [[x0, -1], [x1, 1]] as [number, number][]) {
    c.beginPath(); ell(c, rx + dir * o, y, o * 0.85, o * 0.8); c.strokeStyle = INK; c.lineWidth = w; c.stroke();
    c.beginPath(); ell(c, rx + dir * o, y, o * 0.85, o * 0.8); c.strokeStyle = COL.steel; c.lineWidth = w - 9; c.stroke();
  }
};
// a vertical spring, top end at y0, bottom end at y1 (inner wire), centred on x
const springV = (c: Ctx, x: number, y0: number, y1: number, amp: number, turns: number, w = 21, rings = true) => {
  c.save(); c.translate(x, y0); c.rotate(Math.PI / 2); spring(c, 0, y1 - y0, 0, amp, turns, w, rings); c.restore();
};
// a spring between two points (no end rings)
const springBetween = (c: Ctx, x1: number, y1: number, x2: number, y2: number, amp: number, turns: number, w: number) => {
  c.save(); c.translate(x1, y1); c.rotate(Math.atan2(y2 - y1, x2 - x1)); spring(c, 0, Math.hypot(x2 - x1, y2 - y1), 0, amp, turns, w, false); c.restore();
};
const paperCup = (c: Ctx, x: number, top: number, s = 1) => {
  const h = 150 * s, tw = 72 * s, bw = 48 * s;
  shadow(c, x + 14, top + h + 6, 70 * s, 12);
  const p = () => polyP(c, [[x - tw, top], [x + tw, top], [x + bw, top + h], [x - bw, top + h]]);
  shape(c, p, WHITE, 5); shade(c, p, "#d8d2c4", 38 * s, 0, 0.7);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.teal; c.fillRect(x - 100 * s, top + 50 * s, 200 * s, 40 * s); c.restore();
  line(c, [[x - 63 * s, top + 50 * s], [x + 63 * s, top + 50 * s]], 4); line(c, [[x - 57 * s, top + 90 * s], [x + 57 * s, top + 90 * s]], 4);
  shape(c, () => ell(c, x, top, tw, 14 * s), "#f3eee0", 5);
};
const tennis = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), BALL, 6);
  shade(c, () => ell(c, x, y, r, r), BALLDK, r * 0.38, r * 0.3, 0.7);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  c.beginPath(); c.arc(x - r * 1.2, y, r * 0.95, -0.85, 0.85); c.strokeStyle = WHITE; c.lineWidth = r * 0.13; c.stroke();
  c.beginPath(); c.arc(x + r * 1.2, y, r * 0.95, Math.PI - 0.85, Math.PI + 0.85); c.stroke();
  c.restore(); c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// a tennis ball squashed flat on the floor (its bottom at y)
const tennisFlat = (c: Ctx, x: number, y: number, r: number) => {
  const rx = r * 1.3, ry = r * 0.6, cy = y - ry;
  shape(c, () => ell(c, x, cy, rx, ry), BALL, 6);
  shade(c, () => ell(c, x, cy, rx, ry), BALLDK, rx * 0.3, ry * 0.4, 0.7);
  c.save(); c.beginPath(); ell(c, x, cy, rx, ry); c.clip();
  c.beginPath(); c.arc(x - rx * 1.1, cy, rx * 0.95, -0.7, 0.7); c.strokeStyle = WHITE; c.lineWidth = r * 0.12; c.stroke(); c.restore();
  c.beginPath(); ell(c, x, cy, rx, ry); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const doughBall = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.95), DOUGH, 6);
  shade(c, () => ell(c, x, y, r, r * 0.95), DOUGHDK, r * 0.36, r * 0.3, 0.8);
  line(c, [[x - r * 0.5, y - r * 0.45], [x - r * 0.2, y - r * 0.62]], 5, WHITE);
};
// dough as a wavy sausage from (x0, y) to (x1, y), thickness t
const doughRope = (c: Ctx, x0: number, x1: number, y: number, t: number) => {
  const p = () => { c.beginPath(); c.moveTo(x0, y); for (let i = 1; i <= 40; i++) c.lineTo(x0 + ((x1 - x0) * i) / 40, y + Math.sin(i * 0.5) * t * 0.18); };
  p(); c.strokeStyle = INK; c.lineWidth = t + 12; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  p(); c.strokeStyle = DOUGH; c.lineWidth = t; c.stroke();
  line(c, [[x0 + t * 0.4, y - t * 0.22], [x1 - t * 0.6, y - t * 0.22]], Math.max(3, t * 0.12), WHITE);
};
const sponge = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.08, yb + 8, w * 0.55, 12);
  const p = () => rrect(c, x - w / 2, yb - h, w, h, Math.min(18, h * 0.3));
  shape(c, p, SPONGE, 6); shade(c, p, SPONGEDK, 0, h * 0.8, 0.7);
  for (const [u, v, r] of [[-0.28, 0.35, 9], [0.1, 0.5, 11], [0.3, 0.3, 8], [-0.05, 0.22, 7], [0.36, 0.66, 8]]) if (h > 70 || v < 0.4) shape(c, () => ell(c, x + u * w, yb - h + v * h, r, r * 0.8), SPONGEDK, 3);
};
const note = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x + s * 0.5, y], [x + s * 0.5, y - s * 1.8]], s * 0.16);
  line(c, [[x + s * 0.5, y - s * 1.8], [x + s * 1.1, y - s * 1.4], [x + s * 1.1, y - s * 1.0]], s * 0.16);
  shape(c, () => ell(c, x, y, s * 0.55, s * 0.4, -0.4), INK, 0);
};
const twig = (c: Ctx, pts: number[][], col = TWIG, w = 22) => { line(c, pts, w + 10, INK); line(c, pts, w, col); line(c, pts.map(([x, y]) => [x - 2, y - w * 0.22]), w * 0.2, "rgba(255,255,255,0.35)"); };
const table = (c: Ctx, y: number) => { c.fillStyle = "#d9c49a"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const sheen = (c: Ctx, x: number, y: number, r: number) => { for (const k of [0, 1]) { c.beginPath(); c.arc(x, y, r + k * 18, -0.4, 0.4); c.strokeStyle = RED; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); } };

// ================================================================ flows

// e2 · Band Launch: pull back on a ruler, let go, the band flies far
const f_e2 = (c: Ctx) => {
  room(c, 760);
  shape(c, () => polyP(c, [[110, 764], [180, 764], [150, 1080], [60, 1080]]), COL.teal, 5);
  rulerH(c, 150, 470, 540, 100, 670, 44, 11, 2, -1, 26);
  const band = () => { c.beginPath(); c.moveTo(690, 506); c.lineTo(450, 520); c.lineTo(690, 534); c.quadraticCurveTo(730, 520, 690, 506); c.closePath(); };
  for (const [col, lw] of [[INK, 21], [BAND, 12]] as [string, number][]) { band(); c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = "round"; c.stroke(); }
  hand(c, 40, 530, 0, 1.4, CH, SL, false);
  arrow(c, [[740, 340], [940, 340]]);
  bandFlat(c, 760, 560, 150, 80, 14);
  for (const y of [575, 600, 625]) line(c, [[700, y], [740, y]], 5, "rgba(43,35,64,0.4)");
  shadow(c, 835, 700, 90, 10);
  dash(c, [14, 12], () => line(c, [[905, 780], [905, 1040]], 5, RED));
};

// e3 · Find the Limit: four things stretched or bent, only some spring back
const f_e3 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 40], [540, 1040]], 5, "rgba(43,35,64,0.25)"); line(c, [[40, 540], [1040, 540]], 5, "rgba(43,35,64,0.25)");
  // top left: a band, stretched, back to its first size (springs back)
  dash(c, [10, 9], () => { c.save(); c.beginPath(); rrect(c, 110, 190, 330, 50, 25); c.strokeStyle = "rgba(43,35,64,0.45)"; c.lineWidth = 5; c.stroke(); c.restore(); });
  bandFlat(c, 190, 330, 170, 90, 16);
  arrow(c, [[400, 250], [330, 300]], RED, 8);
  // top right: a plastic strip, stays long
  dash(c, [10, 9], () => { c.beginPath(); rrect(c, 640, 250, 150, 54, 8); c.strokeStyle = "rgba(43,35,64,0.5)"; c.lineWidth = 5; c.stroke(); });
  shadow(c, 800, 400, 240, 12);
  shape(c, () => rrect(c, 640, 330, 340, 28, 6), COL.pink, 5); shade(c, () => rrect(c, 640, 330, 340, 28, 6), "#d9768f", 0, 16, 0.6);
  // bottom left: dough pulled thin
  doughBall(c, 200, 700, 56);
  doughRope(c, 120, 440, 850, 40);
  arrow(c, [[200, 770], [200, 810]], RED, 8);
  // bottom right: spaghetti snapped
  const piece = (pts: number[][]) => { line(c, pts, 20, INK); line(c, pts, 11, STRAW); };
  piece([[620, 860], [700, 780], [800, 740]]); piece([[1000, 860], [920, 780], [840, 745]]);
  line(c, [[800, 700], [790, 670]], 5); line(c, [[820, 700], [835, 668]], 5); line(c, [[810, 715], [810, 655]], 5);
};

// e4 · Bounce Test: drop from 1 m, it comes back up, but not as high
const f_e4 = (c: Ctx) => {
  room(c);
  const sx = 70, w = 110;
  c.fillStyle = SH; c.fillRect(sx + 12, 276, w, 572);
  shape(c, () => rrect(c, sx, 264, w, 582, 4), COL.paper, 5);
  for (let i = 0; i <= 10; i++) { const ty = 840 - i * 54; line(c, [[sx + 3, ty], [sx + (i % 5 === 0 ? 34 : 22), ty]], i % 5 === 0 ? 5 : 3.5); }
  dash(c, [14, 12], () => line(c, [[200, 300], [360, 300]], 5, RED));
  tennis(c, 440, 300, 62);
  arrow(c, [[440, 390], [440, 740]]);
  shadow(c, 520, 905, 100, 14);
  tennisFlat(c, 520, 900, 62);
  dash(c, [14, 12], () => line(c, [[200, 560], [780, 560]], 5, RED));
  tennis(c, 760, 560, 62);
  arrow(c, [[640, 830], [740, 680]]);
  for (const [x, y] of [[880, 520], [900, 570], [880, 620]]) line(c, [[x, y], [x + 40, y]], 5, "rgba(43,35,64,0.4)");
};

// a1 · Spring Hunt: a magnifying glass over springy things at home
const clothesPeg = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const leg = (sx: number) => { const p = () => polyP(c, [[sx * 8, -130], [sx * 52, -130], [sx * 34, 120], [sx * 4, 120]]); shape(c, p, COL.wood, 6); shade(c, p, COL.woodDk, 10, 0, 0.6); };
  leg(-1); leg(1);
  springBetween(c, -26, -10, 26, -10, 18, 3, 10);
  shape(c, () => ell(c, 0, -10, 34, 34), COL.steel, 5); shape(c, () => ell(c, 0, -10, 12, 12), COL.steelDk, 4);
  c.restore();
};
const f_a1 = (c: Ctx) => {
  ground(c);
  springV(c, 250, 130, 560, 50, 6, 24);
  clothesPeg(c, 760, 300, 1.5);
  sponge(c, 780, 960, 280, 130);
  bandFlat(c, 90, 850, 250, 110, 16);
  // the magnifying glass over the pen spring
  const mx = 250, my = 350;
  line(c, [[mx + 120, my + 120], [mx + 270, my + 270]], 44, INK); line(c, [[mx + 120, my + 120], [mx + 270, my + 270]], 30, COL.brown);
  shape(c, () => ell(c, mx, my, 170, 170), "rgba(214,236,250,0.35)", 20);
  c.beginPath(); ell(c, mx, my, 170, 170); c.strokeStyle = COL.teal; c.lineWidth = 14; c.stroke();
  shine(c, [[mx - 110, my - 60], [mx - 60, my - 110]], 12);
};

// a2 · Two in a row, two side by side: the same coins on a chain of bands and on a pair of bands
const hang = (c: Ctx, x: number, y0: number, y1: number, t = 11) => {
  for (const [col, lw] of [[INK, t + 9], [BAND, t]] as [string, number][]) { c.beginPath(); rrect(c, x - 24, y0, 48, y1 - y0, 24); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); }
};
const f_a2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 90, 960, 56, 12), COL.wood); shade(c, () => rrect(c, 60, 90, 960, 56, 12), COL.woodDk, 0, 30, 0.7);
  line(c, [[540, 160], [540, 1040]], 5, "rgba(43,35,64,0.25)");
  // left: a chain of two bands
  hang(c, 280, 140, 390); hang(c, 280, 380, 630);
  line(c, [[218, 800], [280, 636], [342, 800]], 7, INK); line(c, [[218, 800], [280, 636], [342, 800]], 3, "#f5efe0");
  paperCup(c, 280, 800); for (let i = 0; i < 5; i++) coin(c, 235 + (i % 3) * 45 + (i > 2 ? 22 : 0), 806 + Math.floor(i / 3) * -14, 24, i);
  // right: two bands side by side
  hang(c, 700, 140, 390); hang(c, 840, 140, 390);
  line(c, [[640, 560], [700, 396]], 7, INK); line(c, [[640, 560], [700, 396]], 3, "#f5efe0");
  line(c, [[900, 560], [840, 396]], 7, INK); line(c, [[900, 560], [840, 396]], 3, "#f5efe0");
  line(c, [[700, 396], [840, 396]], 7, INK); line(c, [[700, 396], [840, 396]], 3, "#f5efe0");
  paperCup(c, 770, 560); for (let i = 0; i < 5; i++) coin(c, 725 + (i % 3) * 45 + (i > 2 ? 22 : 0), 566 + Math.floor(i / 3) * -14, 24, i);
  // the stretch of each, side by side
  dash(c, [12, 10], () => line(c, [[330, 636], [520, 636]], 5, RED)); dash(c, [12, 10], () => line(c, [[330, 396], [520, 396]], 5, RED));
  arrow(c, [[500, 410], [500, 620]], RED, 8);
};

// a3 · The Springs in My Body: feel the beat at the wrist
const f_a3 = (c: Ctx) => {
  ground(c);
  // forearm, palm up, resting on the table
  shape(c, () => rrect(c, 70, 520, 330, 170, 30), SL, 6);
  shape(c, () => { c.moveTo(380, 530); c.quadraticCurveTo(540, 520, 700, 545); c.lineTo(720, 660); c.quadraticCurveTo(540, 700, 380, 680); c.closePath(); }, CH, 6);
  shade(c, () => { c.moveTo(380, 530); c.quadraticCurveTo(540, 520, 700, 545); c.lineTo(720, 660); c.quadraticCurveTo(540, 700, 380, 680); c.closePath(); }, SKIN.childDk, 0, 36, 0.5);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 690, 546 + k * 28, 190 - Math.abs(k - 1.3) * 18, 26, 13), CH, 5);
  shape(c, () => { c.moveTo(560, 550); c.quadraticCurveTo(640, 480, 720, 520); c.quadraticCurveTo(650, 560, 590, 575); c.closePath(); }, CH, 5);
  // two fingertips on the wrist
  hand(c, 440, 330, Math.PI / 2 + 0.15, 1.8, SKIN.adult, CLOTH.adult, true);
  // the beat: rings round the touch point
  for (const [r, a] of [[60, 0.5], [105, 0.35], [150, 0.22]]) { c.beginPath(); c.arc(430, 548, r, 0, Math.PI * 2); c.strokeStyle = `rgba(215,55,43,${a + 0.3})`; c.lineWidth = 8; c.stroke(); }
};

// a4 · Rubber Band Galaxies: dots on a rubber strip drift apart as it stretches
const f_a4 = (c: Ctx) => {
  ground(c);
  const strip = (x0: number, x1: number, y: number, n: number, th: number) => {
    shadow(c, (x0 + x1) / 2 + 10, y + th / 2 + 18, (x1 - x0) / 2, 10);
    shape(c, () => rrect(c, x0, y - th / 2, x1 - x0, th, 10), COL.pink, 5);
    shade(c, () => rrect(c, x0, y - th / 2, x1 - x0, th, 10), "#d9768f", 0, th * 0.4, 0.6);
    for (let i = 0; i < n; i++) { const px = x0 + 30 + ((x1 - x0 - 60) * i) / (n - 1); shape(c, () => ell(c, px, y, 17, 17), INK, 0); shape(c, () => ell(c, px - 4, y - 5, 5, 5), WHITE, 0); }
  };
  strip(360, 720, 260, 5, 100);
  arrow(c, [[540, 380], [540, 520]]);
  strip(120, 960, 700, 5, 70);
  hand(c, 30, 700, 0, 1.2, CH, SL, false); hand(c, 1050, 700, Math.PI, 1.2, CH, SL, false);
  arrow(c, [[160, 860], [60, 860]]); arrow(c, [[920, 860], [1020, 860]]);
};

// a5 · Rubber Band Orchestra: bands on a box, thick ones low, thin ones high
const f_a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 28);
  shape(c, () => rrect(c, 140, 360, 740, 560, 22), COL.teal); shade(c, () => rrect(c, 140, 360, 740, 560, 22), COL.tealDk, 40, 20, 0.6);
  shape(c, () => ell(c, 510, 640, 210, 190), "#1f2b33", 6);
  const bands: [number, number, string][] = [[440, 8, COL.red], [540, 12, COL.orange], [640, 18, COL.blue], [740, 26, COL.purple], [830, 32, COL.green]];
  bands.forEach(([y, t, col], i) => { if (i === 2) return; line(c, [[135, y], [885, y]], t + 8, INK); line(c, [[135, y], [885, y]], t, col); });
  // the plucked band, drawn as a blur
  for (const k of [-1, 1]) { c.beginPath(); c.moveTo(135, 640); c.quadraticCurveTo(510, 640 + k * 52, 885, 640); c.strokeStyle = "rgba(91,143,214,0.45)"; c.lineWidth = 22; c.stroke(); }
  line(c, [[135, 640], [885, 640]], 26, INK); line(c, [[135, 640], [885, 640]], 18, COL.blue);
  hand(c, 1010, 700, Math.PI, 1.3, CH, SL, false);
  note(c, 300, 230, 60); note(c, 520, 170, 60); note(c, 740, 240, 60);
};

// a6 · Bend or Snap: a green twig springs back, a dry twig snaps
const f_a6 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 540], [1040, 540]], 5, "rgba(43,35,64,0.25)");
  // top: green twig bent, with leaves
  twig(c, [[260, 400], [380, 345], [540, 330], [700, 345], [820, 400]], COL.leaf, 20);
  leaf(c, 450, 336, 60, -1.2); leaf(c, 640, 336, 60, -1.9); leaf(c, 540, 328, 52, -1.55);
  hand(c, 150, 440, 0.3, 1.2, CH, SL, false); hand(c, 930, 440, Math.PI - 0.3, 1.2, CH, SL, false);
  arrow(c, [[540, 450], [540, 500]], RED, 8);
  // bottom: a dry twig snapped in two
  twig(c, [[230, 880], [330, 780], [450, 740], [510, 760]], TWIG, 20); twig(c, [[850, 880], [750, 780], [630, 740], [570, 760]], TWIG, 20);
  line(c, [[520, 720], [500, 668]], 5); line(c, [[570, 722], [590, 668]], 5); line(c, [[545, 700], [545, 640]], 5);
  hand(c, 150, 960, -0.6, 1.2, CH, SL, false); hand(c, 930, 960, Math.PI + 0.6, 1.2, CH, SL, false);
};

// c1 · Catapult Challenge: ice-cream sticks and bands send a paper ball into a bowl
const stickRect = (c: Ctx, x: number, y: number, w: number, h = 34) => { shape(c, () => rrect(c, x, y, w, h, 16), COL.wood, 5); shade(c, () => rrect(c, x, y, w, h, 16), COL.woodDk, 0, h * 0.5, 0.7); };
const f_c1 = (c: Ctx) => {
  room(c, 860);
  shadow(c, 340, 870, 200, 18);
  for (let i = 0; i < 6; i++) stickRect(c, 200, 826 - i * 36, 280);
  // the throwing stick, tilted up from the stack, a bottle cap for the ball
  c.save(); c.translate(330, 600); c.rotate(-0.42);
  shape(c, () => rrect(c, -40, -17, 560, 34, 16), COL.wood, 5); shade(c, () => rrect(c, -40, -17, 560, 34, 16), COL.woodDk, 0, 17, 0.7);
  shape(c, () => polyP(c, [[470, -17], [560, -48], [575, -4], [520, 17]]), COL.steel, 5);
  c.restore();
  // bands tied round the stack
  for (const x of [240, 440]) { line(c, [[x, 600], [x + 10, 850]], 20, INK); line(c, [[x, 600], [x + 10, 850]], 11, BAND); }
  const bx = 330 + Math.cos(-0.42) * 500, by = 600 + Math.sin(-0.42) * 500;
  // the ball in flight into the bowl
  shape(c, () => ell(c, 720, 250, 36, 36), WHITE, 5); line(c, [[705, 240], [725, 262]], 4, "#d8d2c4");
  dash(c, [14, 14], () => { c.beginPath(); c.moveTo(bx + 20, by - 40); c.quadraticCurveTo(620, 130, 790, 600); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); });
  arrow(c, [[780, 520], [800, 610]]);
  // the bowl on the floor 1 m away
  shadow(c, 880, 880, 130, 16);
  const bw = () => { c.moveTo(740, 740); c.bezierCurveTo(750, 880, 1010, 880, 1020, 740); c.closePath(); };
  shape(c, bw, COL.steel); shade(c, bw, COL.steelDk, 30, -4, 0.55);
  shape(c, () => ell(c, 880, 740, 140, 28), COL.steelIn, 5);
  void bx; void by;
};

// c2 · Bungee Doll: a chain of bands lets the doll drop and stop just above the floor
const f_c2 = (c: Ctx) => {
  room(c, 900);
  // table
  shape(c, () => rrect(c, -40, 190, 640, 50, 10), COL.wood); shade(c, () => rrect(c, -40, 190, 640, 50, 10), COL.woodDk, 0, 26, 0.7);
  shape(c, () => rrect(c, 40, 240, 46, 660, 6), COL.brown);
  // chain of 3 bands
  hang(c, 540, 236, 396); hang(c, 540, 380, 540); hang(c, 540, 524, 684);
  // the doll upside down: feet tied to the last band, head near the floor
  const bx = 540;
  shape(c, () => rrect(c, bx - 50, 700, 24, 70, 10), "#5b8fd6", 5); shape(c, () => rrect(c, bx + 26, 700, 24, 70, 10), "#5b8fd6", 5);
  shape(c, () => rrect(c, bx - 56, 690, 112, 22, 8), COL.wood, 5);
  shape(c, () => rrect(c, bx - 54, 770, 108, 70, 16), COL.red, 5); shade(c, () => rrect(c, bx - 54, 770, 108, 70, 16), "#b83a28", 20, 0, 0.6);
  line(c, [[bx - 54, 790], [bx - 100, 740]], 24, INK); line(c, [[bx - 54, 790], [bx - 100, 740]], 14, SKIN.child);
  line(c, [[bx + 54, 790], [bx + 100, 740]], 24, INK); line(c, [[bx + 54, 790], [bx + 100, 740]], 14, SKIN.child);
  shape(c, () => ell(c, bx, 862, 34, 34), SKIN.child, 5);
  shape(c, () => { c.moveTo(bx - 34, 868); c.bezierCurveTo(bx - 40, 900, bx + 40, 900, bx + 34, 868); c.quadraticCurveTo(bx, 880, bx - 34, 868); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, bx - 12, 856, 4, 5), INK, 0); shape(c, () => ell(c, bx + 12, 856, 4, 5), INK, 0);
  // the drop, and the small gap left at the bottom
  arrow(c, [[760, 300], [760, 700]]);
};

// ================================================================ terms

// two hands pulling a band, and a hand squashing a sponge
const t_force = (c: Ctx) => {
  ground(c);
  line(c, [[40, 530], [1040, 530]], 5, "rgba(43,35,64,0.25)");
  bandLine(c, 235, 845, 270);
  hand(c, 80, 270, 0, 1.4, CH, SL, false); hand(c, 1000, 270, Math.PI, 1.4, CH, SL, false);
  arrow(c, [[200, 110], [90, 110]]); arrow(c, [[880, 110], [990, 110]]);
  sponge(c, 540, 930, 360, 80);
  hand(c, 540, 680, Math.PI / 2, 1.5, CH, SL, true);
  arrow(c, [[780, 640], [780, 780]]);
};
// a band short, then long, beside a ruler
const t_stretch = (c: Ctx) => {
  ground(c);
  rulerH(c, 70, 800, 940, 120, 140, 76, 12, 2, 1, 34);
  bandFlat(c, 140, 200, 230, 110, 16);
  dash(c, [10, 9], () => line(c, [[140, 320], [140, 800]], 4, "rgba(43,35,64,0.5)"));
  bandFlat(c, 140, 480, 760, 60, 14);
  dash(c, [10, 9], () => line(c, [[900, 550], [900, 800]], 4, "rgba(43,35,64,0.5)"));
  arrow(c, [[760, 430], [900, 430]]);
  arrow(c, [[540, 330], [540, 400]], RED, 8);
};
// a hand pressing a pen spring flat
const t_squash = (c: Ctx) => {
  room(c, 840);
  springV(c, 540, 560, 770, 70, 6, 26);
  hand(c, 540, 380, Math.PI / 2, 1.6, CH, SL, true);
  arrow(c, [[800, 300], [800, 500]]);
};
// four things changed, then back to normal
const t_elastic = (c: Ctx) => {
  ground(c);
  const xs = [135, 405, 675, 945];
  line(c, [[40, 540], [1040, 540]], 5, "rgba(43,35,64,0.2)");
  // band
  bandFlat(c, xs[0] - 100, 250, 200, 36, 12); bandFlat(c, xs[0] - 55, 710, 110, 110, 14);
  // sponge
  sponge(c, xs[1], 310, 190, 36); sponge(c, xs[1], 800, 170, 150);
  // spring
  springV(c, xs[2], 80, 340, 36, 5, 18); springV(c, xs[2], 640, 790, 36, 5, 18);
  // ball
  tennisFlat(c, xs[3], 320, 60); tennis(c, xs[3], 750, 62);
  for (const x of xs) arrow(c, [[x, 430], [x, 590]], RED, 9);
};
// a sponge pressed, then puffed back up
const t_springback = (c: Ctx) => {
  room(c, 860);
  sponge(c, 260, 855, 360, 60);
  hand(c, 260, 600, Math.PI / 2, 1.5, CH, SL, true);
  arrow(c, [[420, 560], [420, 690]]);
  sponge(c, 790, 855, 330, 190);
  arrow(c, [[960, 700], [960, 520]]);
};
// dough pulled long, staying long
const t_stretchstay = (c: Ctx) => {
  ground(c);
  line(c, [[40, 540], [1040, 540]], 5, "rgba(43,35,64,0.25)");
  doughRope(c, 240, 840, 280, 60);
  hand(c, 80, 280, 0, 1.4, CH, SL, false); hand(c, 1000, 280, Math.PI, 1.4, CH, SL, false);
  arrow(c, [[200, 130], [90, 130]]); arrow(c, [[880, 130], [990, 130]]);
  dash(c, [10, 9], () => { c.beginPath(); ell(c, 200, 760, 70, 66); c.strokeStyle = "rgba(43,35,64,0.5)"; c.lineWidth = 5; c.stroke(); });
  shadow(c, 650, 830, 340, 14);
  doughRope(c, 340, 960, 760, 60);
};
// a dry twig snapping
const t_snap = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 400, 20);
  twig(c, [[170, 760], [240, 560], [420, 450], [490, 480]], TWIG, 24); twig(c, [[910, 760], [840, 560], [660, 450], [590, 480]], TWIG, 24);
  for (const [x1, y1, x2, y2] of [[500, 440, 470, 370], [580, 440, 610, 370], [540, 420, 540, 340], [450, 420, 410, 380], [630, 420, 670, 380]]) line(c, [[x1, y1], [x2, y2]], 7);
  hand(c, 140, 850, -1.25, 1.5, CH, SL, false); hand(c, 940, 850, Math.PI + 1.25, 1.5, CH, SL, false);
  arrow(c, [[290, 960], [380, 960]], RED, 10); arrow(c, [[790, 960], [700, 960]], RED, 10);
};
// a neat pen spring and one pulled far too long
const t_limit = (c: Ctx) => {
  ground(c);
  spring(c, 190, 500, 270, 52, 8);
  arrow(c, [[540, 400], [540, 500]]);
  spring(c, 150, 840, 710, 36, 5);
  for (const [x, y] of [[420, 640], [560, 648]]) line(c, [[x - 20, y], [x + 20, y - 10]], 1, INK);
};
// a spring with 1, 2 and 3 equal weights: stretches in equal steps
const t_hooke = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 200, 70, 840, 40, 10), COL.wood);
  const cols = [[330, 1, 330], [570, 2, 420], [810, 3, 510]];
  rulerV(c, 80, 130, 56, 720, 150, 30, 23, 5);
  for (const [x, n, yEnd] of cols) {
    springV(c, x, 120, yEnd - 70, 38, 7, 20);
    dash(c, [10, 9], () => line(c, [[140, yEnd - 20], [x - 60, yEnd - 20]], 4, RED));
    for (let k = 0; k < n; k++) { shape(c, () => rrect(c, x - 55, yEnd - 20 + k * 80, 110, 70, 10), COL.teal, 5); shade(c, () => rrect(c, x - 55, yEnd - 20 + k * 80, 110, 70, 10), COL.tealDk, 18, 0, 0.6); }
  }
};
// two fingers hold a stretched band; it pulls back on them
const t_pullback = (c: Ctx) => {
  ground(c);
  bandLine(c, 235, 845, 540);
  hand(c, 80, 540, 0, 1.4, CH, SL, false); hand(c, 1000, 540, Math.PI, 1.4, CH, SL, false);
  arrow(c, [[250, 360], [400, 360]], RED, 12); arrow(c, [[830, 360], [680, 360]], RED, 12);
  arrow(c, [[250, 730], [400, 730]], RED, 12); arrow(c, [[830, 730], [680, 730]], RED, 12);
};
// a thick strong spring beside a thin one
const t_stiff = (c: Ctx) => {
  ground(c);
  spring(c, 180, 760, 290, 110, 5, 48);
  spring(c, 230, 700, 760, 32, 8, 14);
};
// a stick bent back by a hand, glowing with stored energy
const t_stored = (c: Ctx) => {
  room(c, 860);
  glow(c, 560, 690, 250);
  // a block holding one end
  shape(c, () => rrect(c, 120, 640, 240, 220, 14), COL.brown); shade(c, () => rrect(c, 120, 640, 240, 220, 14), COL.soilDk, 16, 0, 0.5);
  const pts = [[200, 625], [360, 612], [520, 630], [650, 690], [730, 790]];
  line(c, pts, 40, INK); line(c, pts, 28, COL.wood); line(c, pts.map(([x, y]) => [x, y + 8]), 10, COL.woodDk);
  hand(c, 740, 610, Math.PI / 2, 1.5, CH, SL, false);
  arrow(c, [[900, 560], [900, 720]]);
};
// a ball squashed on the floor, then up again
const t_bounce = (c: Ctx) => {
  room(c, 840);
  shadow(c, 340, 850, 130, 14);
  tennisFlat(c, 340, 840, 70);
  arrow(c, [[460, 780], [640, 540]]);
  dash(c, [12, 10], () => line(c, [[790, 300], [790, 780]], 4, "rgba(43,35,64,0.45)"));
  tennis(c, 790, 420, 70);
  for (const [x, y] of [[700, 700], [730, 750], [840, 720]]) line(c, [[x, y], [x, y + 32]], 5, "rgba(43,35,64,0.35)");
};
// a straight-line graph
const t_graph = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 140, 840, 780, 12), WHITE, 5);
  for (let i = 1; i < 6; i++) { line(c, [[120 + i * 140, 160], [120 + i * 140, 900]], 3, "rgba(43,35,64,0.15)"); line(c, [[140, 140 + i * 130], [940, 140 + i * 130]], 3, "rgba(43,35,64,0.15)"); }
  line(c, [[220, 140], [220, 840], [940, 840]], 10);
  const pts = [0, 1, 2, 3, 4, 5].map((i) => [260 + i * 130, 790 - i * 120]);
  line(c, pts, 10, BAND);
  pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, 22, 22), COL.red, 6));
};
// vibrate: a plucked band, blurred, with a note
const t_vibrate = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 140, 330, 70, 430, 12), COL.brown); shape(c, () => rrect(c, 870, 330, 70, 430, 12), COL.brown);
  for (const k of [-1, 1]) for (const m of [1, 0.5]) { c.beginPath(); c.moveTo(210, 545); c.quadraticCurveTo(540, 545 + k * 110 * m, 870, 545); c.strokeStyle = "rgba(91,143,214,0.35)"; c.lineWidth = 20; c.stroke(); }
  line(c, [[205, 545], [875, 545]], 30, INK); line(c, [[205, 545], [875, 545]], 20, BAND);
  hand(c, 540, 390, Math.PI / 2, 1.5, CH, SL, false);
  note(c, 260, 220, 70); note(c, 820, 190, 70);
};
// bond: balls joined by small springs
const t_bond = (c: Ctx) => {
  ground(c);
  const P: number[][] = [[240, 300], [660, 240], [820, 640], [380, 760]];
  const J: number[][] = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  J.forEach(([a, b]) => springBetween(c, P[a][0], P[a][1], P[b][0], P[b][1], 20, 7, 14));
  P.forEach(([x, y]) => { shape(c, () => ell(c, x, y, 70, 70), COL.blue, 7); shade(c, () => ell(c, x, y, 70, 70), COL.blueDk, 20, 20, 0.7); shine(c, [[x - 35, y - 25], [x - 18, y - 42]], 9); });
};
// polymer: tangled noodles, and tangled chains
const t_polymer = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 5, "rgba(43,35,64,0.2)");
  // noodles in a bowl
  shadow(c, 290, 880, 220, 20);
  const bw = () => { c.moveTo(80, 600); c.bezierCurveTo(100, 900, 480, 900, 500, 600); c.closePath(); };
  shape(c, bw, COL.steel); shade(c, bw, COL.steelDk, 40, -6, 0.55);
  for (let k = 0; k < 4; k++) { const y = 540 + k * 25; const p = () => { c.beginPath(); c.moveTo(100, y + 30); for (let i = 1; i <= 60; i++) c.lineTo(100 + i * 6.6, y + 30 + Math.sin(i * 0.5 + k * 1.3) * 40 + Math.cos(i * 0.23 + k) * 20); }; p(); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke(); p(); c.strokeStyle = STRAW; c.lineWidth = 14; c.stroke(); }
  shape(c, () => ell(c, 290, 610, 215, 40), "rgba(255,255,255,0)", 0);
  // rubber chains: tangled strings of beads
  for (let k = 0; k < 3; k++) {
    const col = [COL.red, COL.blue, COL.green][k];
    for (let i = 0; i <= 26; i++) { const t = i / 26, x = 600 + t * 380 + Math.sin(t * 9 + k * 2) * 40, y = 280 + k * 220 + Math.cos(t * 7 + k) * 80 * Math.sin(t * 4 + k); shape(c, () => ell(c, x, y, 17, 17), col, 4); }
  }
};
// earthquake: two blocks of rock slip past each other
const t_quake = (c: Ctx) => {
  ground(c);
  const rock = (x0: number, x1: number, y0: number, col: string, dk: string) => { const p = () => polyP(c, [[x0, y0], [x1, y0 + 16], [x1, 980], [x0, 980]]); shape(c, p, col, 7); shade(c, p, dk, 30, 0, 0.5); };
  rock(60, 540, 480, COL.soil, COL.soilDk);
  rock(540, 1020, 580, COL.brown, COL.soilDk);
  line(c, [[300, 560], [420, 640]], 6, TWIGDK); line(c, [[700, 660], [800, 720]], 6, TWIGDK); line(c, [[160, 820], [260, 880]], 6, TWIGDK); line(c, [[820, 880], [920, 930]], 6, TWIGDK);
  arrow(c, [[420, 740], [420, 640]], RED, 12); arrow(c, [[660, 800], [660, 900]], RED, 12);
  // the shaking above
  for (const [x, y] of [[380, 360], [540, 330], [700, 360]]) { line(c, [[x - 50, y], [x - 25, y - 20], [x, y], [x + 25, y - 20], [x + 50, y]], 8, RED); }
  line(c, [[500, 400], [540, 420], [520, 450]], 7);
};

export const ic_forcesStretchingSpringsL3 = cards("sci.forces.stretching-springs.L3 cards", [
  f_e2, f_e3, f_e4, f_a1, f_a2, f_a3, f_a4, f_a5, f_a6, f_c1, f_c2,
  t_force, t_stretch, t_squash, t_elastic, t_springback, t_stretchstay, t_snap, t_limit, t_hooke, t_pullback, t_stiff, t_stored, t_bounce, t_graph, t_vibrate, t_bond, t_polymer, t_quake,
]);
