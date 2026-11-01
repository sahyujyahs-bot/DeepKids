import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// SWINGS AND PENDULUMS · experiment set-up cards: a ruler weighted by books over a table edge, a thread, a clear bag of coins.
const FLOOR = 1030, SLAB = 340, BAG = "#dcecf7", BAGDK = "#9fc3df";

const bg = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d4b6"; c.fillRect(0, FLOOR, 1080, 1080 - FLOOR);
  line(c, [[0, FLOOR], [1080, FLOOR]], 5);
};
// a table seen from the side: two legs, a thick top whose upper face is at y = 340
const table = (c: Ctx, x0: number, x1: number) => {
  for (const lx of [x0 + 14, x1 - 64]) {
    shadow(c, lx + 40, FLOOR + 12, 52, 9);
    shape(c, () => rrect(c, lx, SLAB + 40, 50, FLOOR - SLAB - 40, 6), COL.brown);
    shade(c, () => rrect(c, lx, SLAB + 40, 50, FLOOR - SLAB - 40, 6), COL.soilDk, -14, 0, 0.5);
  }
  shape(c, () => rrect(c, x0, SLAB, x1 - x0, 58, 10), COL.brown);
  shade(c, () => rrect(c, x0, SLAB, x1 - x0, 58, 10), COL.soilDk, -8, -12, 0.5);
  line(c, [[x0 + 16, SLAB + 12], [x1 - 16, SLAB + 12]], 4, COL.wood);
};
// a wooden ruler lying on the table top, ticks along its face
const ruler = (c: Ctx, x0: number, x1: number) => {
  const y = SLAB - 20;
  shape(c, () => rrect(c, x0, y, x1 - x0, 20, 3), COL.wood);
  for (let x = x0 + 12, k = 0; x < x1 - 6; x += 15, k++) line(c, [[x, y], [x, y + (k % 5 === 0 ? 13 : 8)]], 3);
};
// three books on the ruler
const books = (c: Ctx, x0: number, x1: number) => {
  const tones = [COL.purple, COL.teal, COL.orange], dx = [0, 14, 4];
  tones.forEach((col, i) => {
    const y = SLAB - 20 - 50 * (i + 1), a = x0 + dx[i], w = x1 - x0 - dx[i] - (i === 1 ? 10 : 0);
    shape(c, () => rrect(c, a, y, w, 50, 6), col);
    shape(c, () => rrect(c, a + 18, y + 9, w - 24, 32, 3), COL.paper, 3);
    line(c, [[a + 34, y + 20], [a + w - 20, y + 20]], 2, COL.grey); line(c, [[a + 34, y + 30], [a + w - 20, y + 30]], 2, COL.grey);
  });
};
const thread = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => line(c, [[x0, y0], [x1, y1]], 5);
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 4);
  c.beginPath(); ell(c, x, y, r * 0.6, r * 0.6); c.strokeStyle = COL.woodDk; c.lineWidth = 3; c.stroke();
  shade(c, () => ell(c, x, y, r, r), COL.woodDk, -r * 0.3, -r * 0.3, 0.5);
};
// a clear bag of n coins, tied at the top; the thread is tied to (x, y)
const bag = (c: Ctx, x: number, y: number, r: number, n: number, alpha = 1) => {
  c.save(); c.globalAlpha = alpha;
  const body = () => { c.moveTo(x - r * 0.2, y + r * 0.3); c.bezierCurveTo(x - r * 1.25, y + r * 0.7, x - r * 1.15, y + r * 2.15, x, y + r * 2.15); c.bezierCurveTo(x + r * 1.15, y + r * 2.15, x + r * 1.25, y + r * 0.7, x + r * 0.2, y + r * 0.3); c.closePath(); };
  shape(c, body, BAG, 0);
  shade(c, body, BAGDK, -r * 0.3, -r * 0.1, 0.55);
  const spots = n === 1 ? [[0, 1.7]] : [[-0.5, 1.78], [0.05, 1.86], [0.56, 1.72], [-0.22, 1.4], [0.34, 1.34]];
  spots.forEach(([dx, dy]) => coin(c, x + dx * r, y + dy * r, r * 0.37));
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 5; c.lineJoin = "round"; c.stroke();
  shine(c, [[x - r * 0.85, y + r * 0.95], [x - r * 0.75, y + r * 1.5]], 7);
  shape(c, () => polyP(c, [[x - r * 0.2, y + r * 0.3], [x - r * 0.07, y + r * 0.04], [x + r * 0.07, y + r * 0.04], [x + r * 0.2, y + r * 0.3]]), BAG, 4);
  shape(c, () => rrect(c, x - r * 0.27, y + r * 0.2, r * 0.54, r * 0.16, 4), COL.purple, 4);
  c.restore();
};
const phone = (c: Ctx, x: number, w: number, h: number, txt: string) => {
  const b = SLAB;
  shadow(c, x + w / 2 + 14, b + 4, w * 0.7, 9);
  shape(c, () => rrect(c, x - 14, b - 16, w + 28, 16, 5), COL.steel);
  shape(c, () => rrect(c, x, b - 16 - h, w, h, 18), COL.black);
  shape(c, () => rrect(c, x + 9, b - 16 - h + 14, w - 18, h - 28, 10), "#22303a", 3);
  const cx = x + w / 2, cy = b - 16 - h / 2;
  c.beginPath(); c.arc(cx, cy, w * 0.36, 0, Math.PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 6; c.stroke();
  line(c, [[cx, cy - w * 0.36], [cx, cy - w * 0.36 - 12]], 6, "#c9f06b");
  const th = w * 0.3; write(c, txt, cx - (txt.length * 0.8 - 0.2) * th * 0.5, cy - th * 0.5, th, "#c9f06b", 6);
};
// a measuring bracket: a vertical line with end ticks, or a horizontal one
const dimV = (c: Ctx, x: number, y0: number, y1: number) => { line(c, [[x, y0], [x, y1]], 5, COL.greyDk); line(c, [[x - 12, y0], [x + 12, y0]], 5, COL.greyDk); line(c, [[x - 12, y1], [x + 12, y1]], 5, COL.greyDk); };
const dimH = (c: Ctx, y: number, x0: number, x1: number) => { line(c, [[x0, y], [x1, y]], 5, COL.greyDk); line(c, [[x0, y - 12], [x0, y + 12]], 5, COL.greyDk); line(c, [[x1, y - 12], [x1, y + 12]], 5, COL.greyDk); };
const dash = (c: Ctx, pts: number[][], col: string = COL.greyDk) => { c.setLineDash([14, 12]); line(c, pts, 4, col); c.setLineDash([]); };

// the set-up shared by the cards: table, ruler with 10 cm over the edge, three books
const BR = 90, TIP = 640, PX = 630, PY = SLAB;
const base = (c: Ctx) => { bg(c); table(c, 40, 490); ruler(c, 215, TIP); books(c, 235, 480); };
const hangLong = (c: Ctx) => { thread(c, PX, PY, PX, PY + 400); bag(c, PX, PY + 400, BR, 5); };

// setup.e1.0
const card_e1_0 = (c: Ctx) => {
  base(c); hangLong(c);
  dimH(c, 372, 490, TIP); write(c, "10 cm", 500, 386, 30, COL.greyDk, 5);
};
// setup.e1.1
const card_e1_1 = (c: Ctx) => {
  base(c);
  phone(c, 70, 120, 220, "0");
  const nx = PX + 215, ny = PY + Math.sqrt(400 * 400 - 215 * 215);
  dash(c, [[PX, PY], [PX, PY + 400]]); bag(c, PX, PY + 400, BR, 5, 0.3);
  thread(c, PX, PY, nx, ny); bag(c, nx, ny, BR, 5);
  const an = 2.85, s = 1.5, gy = ny + 36; hand(c, nx - 70 * s * Math.cos(an), gy - 70 * s * Math.sin(an), an, s);
  arrow(c, [[900, 955], [800, 995], [700, 995], [600, 960]], RED, 12);
};
// setup.e1.2
const card_e1_2 = (c: Ctx) => {
  bg(c); table(c, 40, 400); ruler(c, 215, 1000); books(c, 235, 390);
  for (const [x, n] of [[560, 5], [860, 1]] as [number, number][]) { thread(c, x, SLAB, x, SLAB + 400); bag(c, x, SLAB + 400, 85, n); write(c, String(n), x - 14, 940, 56, INK, 8); }
  dash(c, [[500, SLAB + 400], [920, SLAB + 400]]);
  dimV(c, 690, SLAB, SLAB + 400); write(c, "50 cm", 706, 520, 34, COL.greyDk, 5);
};
// setup.e1.3
const card_e1_3 = (c: Ctx) => {
  base(c);
  const px = 626, ln = 100;
  dash(c, [[px, SLAB], [px, SLAB + 400]]); bag(c, px, SLAB + 400, BR, 5, 0.3);
  for (let i = 0; i < 5; i++) { const x = 598 + i * 9; line(c, [[x, SLAB - 24], [x + 8, SLAB + 6]], 8); line(c, [[x, SLAB - 24], [x + 8, SLAB + 6]], 4, COL.pink); }
  shape(c, () => polyP(c, [[592, SLAB - 30], [650, SLAB - 30], [650, SLAB + 12], [592, SLAB + 12]]), "rgba(255,211,77,0.75)", 4);
  thread(c, px + 4, SLAB + 6, px + 4, SLAB + ln); bag(c, px + 4, SLAB + ln, BR, 5);
  dimV(c, 760, SLAB, SLAB + ln); write(c, "12 cm", 780, SLAB + 30, 34, COL.greyDk, 5);
  dimV(c, 960, SLAB, SLAB + 400); write(c, "50 cm", 800, 560, 34, COL.greyDk, 5);
  dash(c, [[px + 20, SLAB + 400], [960, SLAB + 400]]);
};
// setup.e2.0
const card_e2_0 = (c: Ctx) => { base(c); hangLong(c); dimH(c, 372, 490, TIP); write(c, "10 cm", 500, 386, 30, COL.greyDk, 5); };
// setup.e2.1
const card_e2_1 = (c: Ctx) => {
  bg(c); table(c, 40, 400); ruler(c, 205, 1010); books(c, 225, 390); phone(c, 70, 120, 220, "10");
  ([[540, 400, "50 cm", 0], [750, 200, "25 cm", 1], [960, 96, "12 cm", 2]] as [number, number, string, number][]).forEach(([x, ln, tx, k]) => {
    thread(c, x, SLAB, x, SLAB + ln); bag(c, x, SLAB + ln, 75, 5);
    const by = SLAB + ln + 75 * 2.15 + 16;
    write(c, tx, x - 66, by, 34, INK, 6);
    if (k === 1) line(c, [[x - 22, by + 64], [x - 6, by + 82], [x + 24, by + 44]], 14, COL.green);
    else { line(c, [[x - 18, by + 48], [x + 18, by + 84]], 12, RED); line(c, [[x + 18, by + 48], [x - 18, by + 84]], 12, RED); }
  });
};
// setup.e3.0
const card_e3_0 = (c: Ctx) => { base(c); hangLong(c); dimH(c, 372, 490, TIP); write(c, "10 cm", 500, 386, 30, COL.greyDk, 5); };
// setup.e3.1
const card_e3_1 = (c: Ctx) => {
  bg(c); table(c, 40, 400); ruler(c, 215, 690); books(c, 235, 390);
  const P = 680, L = 330, r = 60, S = 200;
  // shoebox with the paper strip on its lid
  shadow(c, 650, FLOOR + 6, 380, 14);
  shape(c, () => rrect(c, 340, 900, 680, 130, 8), COL.brown);
  shade(c, () => rrect(c, 340, 900, 680, 130, 8), COL.soilDk, -20, -20, 0.5);
  shape(c, () => rrect(c, 325, 900, 710, 34, 8), COL.soil);
  shape(c, () => polyP(c, [[380, 790], [980, 790], [1035, 900], [325, 900]]), COL.soil);
  shape(c, () => polyP(c, [[P - S - 46, 805], [P + S + 46, 805], [P + S + 56, 888], [P - S - 56, 888]]), COL.paper, 4);
  for (const k of [-S, -S / 2, 0, S / 2, S]) line(c, [[P + k, 805], [P + k, 842]], k === 0 ? 8 : 5);
  for (const k of [-S, -S / 2, S / 2, S]) write(c, Math.abs(k) === S ? "20" : "10", P + k - 22, 850, 30, INK, 5);
  write(c, "0", P - 12, 850, 30, INK, 5);
  const nx = P + S, ny = SLAB + Math.sqrt(L * L - S * S);
  dash(c, [[P, SLAB], [P, SLAB + L]]); bag(c, P, SLAB + L, r, 5, 0.3);
  dash(c, [[P, SLAB], [P - S, ny]]); bag(c, P - S, ny, r, 5, 0.3);
  thread(c, P, SLAB, nx, ny); bag(c, nx, ny, r, 5);
  const pts: number[][] = []; for (let a = 44; a >= 24; a -= 4) pts.push([P + 490 * Math.sin((a * Math.PI) / 180), SLAB + 490 * Math.cos((a * Math.PI) / 180)]);
  arrow(c, pts, RED, 12);
};
// setup.e3.2
const card_e3_2 = (c: Ctx) => {
  base(c);
  const th = (30 * Math.PI) / 180, tx = Math.sin(th), ty = Math.cos(th), nx = PX + 400 * tx, ny = PY + 400 * ty;
  thread(c, PX, PY, nx, ny);
  const cx = PX + 235 * tx, cy = PY + 235 * ty, dx = -160, dy = -66;
  const P = (u: number, v: number) => [cx + tx * u + dx * v, cy + ty * u + dy * v];
  const face = () => polyP(c, [P(-130, 0.5), P(130, 0.5), P(130, -0.5), P(-130, -0.5)]);
  shape(c, face, COL.paper, 5);
  shade(c, face, COL.grey, -14, -14, 0.5);
  shape(c, () => polyP(c, [P(80, 0.38), P(116, 0.38), P(116, 0.06), P(80, 0.06)]), COL.pink, 3);
  for (const v of [0.3, 0.08, -0.14, -0.34]) line(c, [P(-100, v), P(40, v)], 3, COL.greyDk);
  line(c, [P(-130, 0), P(-80, 0)], 4);
  shape(c, () => polyP(c, [P(-110, 0.12), P(-80, 0.12), P(-80, -0.12), P(-110, -0.12)]), "rgba(255,211,77,0.8)", 3);
  bag(c, nx, ny, BR, 5);
  for (const k of [-55, 0, 55]) arrow(c, [[cx - 300, cy + k], [cx - 180, cy + k]], COL.waterDk, 8);
  arrow(c, [[940, 990], [850, 1010], [740, 990], [680, 950]], RED, 12);
};

export const su_motionSwingsAndPendulums = cards("sci.motion.swings-and-pendulums.L3 set-up", [
  card_e1_0, card_e1_1, card_e1_2, card_e1_3, card_e2_0, card_e2_1, card_e3_0, card_e3_1, card_e3_2,
]);
