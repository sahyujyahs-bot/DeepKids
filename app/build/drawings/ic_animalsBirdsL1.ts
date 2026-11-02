import type { Ctx } from "./core";
import { D, INK, WHITE, COL, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, cards } from "./flatKit";

// sci.animals.birds.L1 cards. Birds face left as drawn, scaled by bird().
const CLAY = "#c9733f", CLAY_DK = "#9c5126";
const SPA = "#a9693a", SPA_DK = "#7d4a26", SPA_CREAM = "#eadbbd", MYNA = "#7a5236", MYNA_DK = "#563723";

// a small bird in profile facing LEFT, feet at (0,0): a sparrow (short thick beak) or a myna (yellow beak)
const bird = (c: Ctx, x: number, y: number, s: number, kind: "sparrow" | "myna", down = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = kind === "sparrow" ? SPA : MYNA, dk = kind === "sparrow" ? SPA_DK : MYNA_DK;
  for (const lx of [-6, 22]) { line(c, [[lx, -40], [lx, -4]], 9, INK); line(c, [[lx, -40], [lx, -4]], 4, COL.orange); line(c, [[lx - 18, -2], [lx + 4, -2]], 9, INK); line(c, [[lx - 16, -2], [lx + 2, -2]], 4, COL.orange); }
  shape(c, () => polyP(c, [[60, -90], [150, -60], [140, -40], [50, -70]]), dk, 5);
  const b = () => ell(c, 0, -90, 76, 54, 0.12);
  shape(c, b, body, 6); shade(c, b, dk, 18, 16, 0.6);
  if (kind === "sparrow") shape(c, () => ell(c, -26, -72, 42, 30, 0.1), SPA_CREAM, 0);
  shape(c, () => ell(c, 18, -96, 46, 26, 0.35), dk, 5);
  const hx = down ? -62 : -56, hy = down ? -96 : -140;
  shape(c, () => ell(c, hx, hy, 38, 36), kind === "sparrow" ? SPA : MYNA_DK, 6);
  if (kind === "sparrow") { shape(c, () => ell(c, hx - 4, hy - 18, 30, 14), "#8a8a90", 0); shape(c, () => ell(c, hx - 24, hy + 12, 14, 12), INK, 0); shape(c, () => ell(c, hx + 4, hy + 6, 18, 14), SPA_CREAM, 0); }
  else shape(c, () => ell(c, hx + 8, hy + 2, 14, 10), COL.yellow, 0);
  const bk = kind === "sparrow" ? "#e8c36a" : COL.yellow;
  if (down) shape(c, () => polyP(c, [[hx - 22, hy + 20], [hx - 52, hy + 52], [hx - 8, hy + 34]]), bk, 5);
  else shape(c, () => polyP(c, [[hx - 32, hy - 10], [hx - 66, hy + 4], [hx - 30, hy + 14]]), bk, 5);
  shape(c, () => ell(c, hx - 16, hy - 6, 6, 7), INK, 0); shape(c, () => ell(c, hx - 18, hy - 8, 2, 2), WHITE, 0);
  c.restore();
};
const grain = (c: Ctx, x: number, y: number, r: number, rot: number) => shape(c, () => ell(c, x, y, r, r * 0.5, rot), "#f1dfae", 3);

// flow.a3: Bird Cafe. A clay saucer of water and a pinch of grains on a balcony floor, a sparrow eating.
const birdCafe = (c: Ctx) => {
  ground(c);
  // balcony floor and the railing bars behind
  c.fillStyle = "#e3cfa4"; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 6);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 640);
  for (let k = 0; k < 8; k++) { const bx = 70 + k * 135; shape(c, () => rrect(c, bx - 14, 180, 28, 460, 10), COL.steel, 5); }
  shape(c, () => rrect(c, 20, 150, D - 40, 44, 16), COL.steelDk, 6);
  // saucer
  shadow(c, 340, 905, 290, 46);
  const sauc = () => { c.moveTo(80, 790); c.bezierCurveTo(100, 930, 590, 930, 610, 790); c.closePath(); };
  shape(c, sauc, CLAY); shade(c, sauc, CLAY_DK, 60, -20, 0.7);
  shape(c, () => ell(c, 345, 790, 265, 70), "#e0905a", 6);
  shape(c, () => ell(c, 345, 794, 222, 52), COL.water, 4);
  shine(c, [[220, 790], [290, 772]], 10);
  // grains and the sparrow
  for (const [gx, gy, gr] of [[640, 880, 17], [690, 905, 16], [600, 910, 17], [660, 850, 15], [720, 872, 16], [760, 915, 15]]) grain(c, gx, gy, gr, (gx % 7) / 3);
  bird(c, 800, 870, 1.5, "sparrow", true);
};

// flow.p1: My Window Bird Book. A myna on a wire outside the window; an open book with its picture drawn.
const windowBook = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 200, 70, 680, 520, 24), COL.woodDk, 7);
  shape(c, () => rrect(c, 236, 106, 608, 448, 10), COL.sky, 6);
  line(c, [[236, 330], [844, 330]], 5, COL.greyDk);
  line(c, [[236, 330], [844, 330]], 3, INK);
  bird(c, 560, 326, 1.15, "myna");
  shape(c, () => ell(c, 330, 190, 56, 26), WHITE, 0); shape(c, () => ell(c, 390, 180, 46, 24), WHITE, 0);
  // the open book
  shadow(c, 540, 975, 440, 40);
  shape(c, () => rrect(c, 110, 640, 860, 330, 22), COL.teal, 7);
  shape(c, () => rrect(c, 140, 662, 390, 290, 10), COL.paper, 6);
  shape(c, () => rrect(c, 550, 662, 390, 290, 10), COL.paper, 6);
  // a page drawn in crayon: a small myna on the right page
  c.save(); c.translate(745, 925); c.scale(0.95, 0.95);
  bird(c, 0, 0, 1, "myna"); c.restore();
  // dots on the left page stand for earlier days' pages: simple small bird shapes
  c.save(); c.translate(335, 900); bird(c, 0, 0, 0.8, "sparrow"); c.restore();
  arrow(c, [[900, 330], [1000, 450], [900, 650]], RED, 12);
  // crayon
  c.save(); c.translate(900, 870); c.rotate(-0.6);
  shape(c, () => rrect(c, -10, -80, 40, 120, 6), COL.orange, 5);
  shape(c, () => polyP(c, [[-10, -80], [30, -80], [10, -110]]), COL.orange, 5);
  c.restore();
};

export const ic_animalsBirdsL1 = cards("sci.animals.birds.L1 cards", [birdCafe, windowBook]);
