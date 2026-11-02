import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, RED, cards, write, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person } from "./flatKit";

const DOUGH = "#ecca8e", DOUGH_DK = "#c9a265";

// the wooden board seen from the front-top
const board = (c: Ctx, top: number) => {
  shadow(c, 540, 930, 480, 40);
  shape(c, () => polyP(c, [[130, top], [950, top], [1050, 900], [30, 900]]), COL.wood);
  shade(c, () => polyP(c, [[130, top], [950, top], [1050, 900], [30, 900]]), COL.woodDk, 30, 20, 0.35);
};
const toothpick = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 12) => {
  line(c, [[x1, y1], [x2, y2]], w + 8, INK);
  line(c, [[x1, y1], [x2, y2]], w, "#f6dc9a");
};

// e1 step 0: hands press atta dough into an egg on the board; six toothpicks beside it
const e1s0 = (c: Ctx) => {
  ground(c);
  board(c, 400);
  shadow(c, 450, 790, 250, 40);
  const egg = () => ell(c, 450, 620, 235, 170);
  shape(c, egg, DOUGH, 7);
  shade(c, egg, DOUGH_DK, 50, 40, 0.5);
  shine(c, [[300, 520], [360, 480]], 12);
  for (let i = 0; i < 6; i++) toothpick(c, 750 + i * 32, 520 + i * 4, 830 + i * 32, 740 + i * 4, 10);
  hand(c, 250, 290, 0.78, 2.0, SKIN.child, CLOTH.child, true);
  arrow(c, [[640, 250], [600, 400]]);
};

// one dough animal in local coordinates: leg tips on y = 0, centred on x = 0
const animal = (c: Ctx, legs: [number, number][]) => {
  legs.forEach(([x, dx]) => toothpick(c, x + dx * 0.4, -170, x, -4, 14));
  const body = () => ell(c, 0, -270, 150, 105);
  shape(c, body, DOUGH, 7);
  shade(c, body, DOUGH_DK, 45, 35, 0.5);
  shape(c, () => ell(c, 120, -330, 62, 56), DOUGH, 7);
  shape(c, () => ell(c, 150, -345, 11, 14), INK, 0);
  shape(c, () => ell(c, 108, -345, 11, 14), INK, 0);
};
// e1 step 1: 2 legs tips over, 3 legs stands
const e1s1 = (c: Ctx) => {
  ground(c);
  board(c, 640);
  shadow(c, 760, 830, 200, 30);
  shadow(c, 330, 835, 190, 26);
  c.save(); c.translate(740, 830); animal(c, [[-100, 30], [0, 0], [100, -30]]); c.restore();
  c.save(); c.translate(300, 830); c.rotate(-0.42); c.translate(48, 0); animal(c, [[-48, 20], [48, -20]]); c.restore();
  arrow(c, [[300, 330], [180, 360], [110, 480]]);
  write(c, "2", 215, 120, 150, INK, 14);
  write(c, "3", 700, 120, 150, INK, 14);
};

// e1 step 2: a girl, eyes shut, arms down, near a wall; wobble lines at her ankles
const e1s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e5d2b0"; c.fillRect(0, 0, 1080, 880);
  c.fillStyle = "#cdb48a"; c.fillRect(0, 880, 1080, 200);
  line(c, [[0, 880], [1080, 880]], 6);
  const x = 540, y = 1000, h = 800, head = h * 0.13;
  shadow(c, x + 40, y + 6, 190, 28);
  person(c, x, y, h, { armL: [Math.PI * 0.52, Math.PI * 0.5], armR: [Math.PI * 0.48, Math.PI * 0.5] });
  const hy = y - h * 0.74 - head * 1.05;
  for (const s of [-1, 1]) {
    const ex = x + s * head * 0.35, ey = hy + head * 0.12;
    shape(c, () => ell(c, ex, ey, head * 0.22, head * 0.22), SKIN.child, 0);
    c.beginPath(); c.arc(ex, ey - head * 0.06, head * 0.17, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
  }
  for (const s of [-1, 1]) for (const k of [0, 1]) {
    const ax = x + s * (h * 0.06 + 70 + k * 28);
    line(c, [[ax, y - 95], [ax + s * 18, y - 55], [ax, y - 15]], 7, COL.orange);
  }
};

// the clear tub with the floating bottle; fin = tape and strip under the bottle
const tub = (c: Ctx, fin: boolean) => {
  const wl = 560;
  shadow(c, 560, 930, 420, 36);
  shape(c, () => rrect(c, 90, 380, 900, 540, 40), COL.glass, 6);
  shape(c, () => rrect(c, 96, wl, 888, 354, 36), COL.water, 0);
  line(c, [[96, wl], [984, wl]], 6, COL.waterDk);
  // the bottle: body, shoulder and cap on the left, red bindi on the side
  const body = () => rrect(c, 290, 450, 560, 170, 56);
  shape(c, () => rrect(c, 215, 508, 90, 74, 14), COL.blue, 6);
  shape(c, body, "#eaf5fc", 6);
  shade(c, body, COL.sky, 25, 20, 0.7);
  shine(c, [[360, 482], [780, 482]], 9);
  shape(c, () => ell(c, 560, 515, 34, 34), RED, 5);
  if (fin) {
    shape(c, () => rrect(c, 520, 600, 80, 220, 12), COL.purple, 6);
    shape(c, () => rrect(c, 495, 590, 130, 34, 8), "#fff6d6", 5);
  }
  // water over the lower part of the bottle and fin
  c.save(); c.beginPath(); c.rect(96, wl, 888, 354); c.clip();
  c.fillStyle = "rgba(143,195,234,0.45)"; c.fillRect(96, wl, 888, 354); c.restore();
  line(c, [[96, wl], [984, wl]], 6, COL.waterDk);
  shape(c, () => rrect(c, 90, 380, 900, 540, 40), "rgba(255,255,255,0)", 6);
};

// e2 step 0: float the bottle and flick it
const e2s0 = (c: Ctx) => {
  ground(c);
  tub(c, false);
  hand(c, 800, 330, 2.2, 1.9, SKIN.child, CLOTH.child, false);
  arrow(c, [[250, 440], [310, 380], [400, 350], [500, 360]]);
};

// e2 step 1: tape a strip under the bottle as a fin
const e2s1 = (c: Ctx) => {
  ground(c);
  tub(c, true);
  arrow(c, [[860, 830], [790, 760], [680, 720]]);
};

export const su_animalsAnimalsAroundUsL2 = cards("sci.animals.animals-around-us.L2 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1]);
