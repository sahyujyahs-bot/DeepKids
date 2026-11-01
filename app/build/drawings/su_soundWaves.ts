import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// SOUND WAVES L3 set-up cards: a steel tray of water on a towel, a bucket of water from above.

const TOWEL = "#f7f3e8";
const CM = 44; // pixels per cm on the ruler

// the long steel tray on a towel, drawn in its own units (about 1000 wide) then placed and scaled.
// wall = how much of the far inner wall shows (low water shows more); ruler = water level in cm (0 = no ruler)
const tray = (c: Ctx, ox: number, oy: number, sc: number, wall: number, ruler = 0, bump = -1) => {
  c.save(); c.translate(ox, oy); c.scale(sc, sc);
  shape(c, () => polyP(c, [[-60, -12], [1060, -12], [1100, 392], [-100, 392]]), TOWEL, 6);
  shade(c, () => polyP(c, [[-60, -12], [1060, -12], [1100, 392], [-100, 392]]), "#d9cfb6", 40, 30, 0.5);
  line(c, [[-96, 360], [1096, 360]], 12, COL.blue); line(c, [[-98, 376], [1098, 376]], 6, COL.blue);
  shadow(c, 540, 356, 520, 34);
  shape(c, () => polyP(c, [[110, 0], [890, 0], [1000, 300], [0, 300]]), COL.steel);
  shape(c, () => polyP(c, [[0, 300], [1000, 300], [1000, 350], [0, 350]]), COL.steelDk);
  shape(c, () => polyP(c, [[150, 26], [850, 26], [950, 262], [50, 262]]), COL.steelDk, 5);
  const y0 = 26 + wall, lx = (y: number) => 150 - (100 * (y - 26)) / 236, rx = (y: number) => 850 + (100 * (y - 26)) / 236;
  const wp = () => polyP(c, [[lx(y0), y0], [rx(y0), y0], [950, 262], [50, 262]]);
  shape(c, wp, COL.water, 5);
  shade(c, wp, COL.waterDk, 120, 40, 0.5);
  shine(c, [[lx(y0) + 60, y0 + 26], [lx(y0) + 200, y0 + 26]], 9);
  if (bump >= 0) {
    const by = (y0 + 262) / 2 + 10;
    for (const k of [1, 2]) { c.beginPath(); c.ellipse(bump, by, 70 + k * 55, 18 + k * 12, 0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 8; c.globalAlpha = 0.8 - k * 0.2; c.stroke(); c.globalAlpha = 1; }
    shape(c, () => { c.moveTo(bump - 80, by + 8); c.bezierCurveTo(bump - 60, by - 70, bump + 60, by - 70, bump + 80, by + 8); c.quadraticCurveTo(bump, by + 28, bump - 80, by + 8); c.closePath(); }, COL.water, 6);
    shine(c, [[bump - 45, by - 18], [bump - 8, by - 34]], 9);
  }
  if (ruler) {
    const rx0 = 880, yb = 262, top = yb - 8 * CM;
    shape(c, () => rrect(c, rx0, top, 56, yb - top, 6), COL.wood);
    shade(c, () => rrect(c, rx0, top, 56, yb - top, 6), COL.woodDk, 14, 0, 0.5);
    for (let n = 0; n <= 8; n++) { const y = yb - n * CM; line(c, [[rx0 + 56, y], [rx0 + 34, y]], 4); if (n) write(c, String(n), rx0 + 6, y - 32, 22, INK, 4); }
    c.globalAlpha = 0.55; shape(c, () => c.rect(rx0, yb - ruler * CM, 56, ruler * CM), COL.water, 0); c.globalAlpha = 1;
    line(c, [[rx0 - 14, yb - ruler * CM], [rx0 + 70, yb - ruler * CM]], 8, RED);
  }
  c.restore();
};

// a dosa turner standing upright: long wooden handle, flat steel blade with slots
const turner = (c: Ctx, x: number, top: number, bladeY: number) => {
  line(c, [[x, top], [x, bladeY + 10]], 26, INK); line(c, [[x, top], [x, bladeY + 10]], 14, COL.wood);
  shape(c, () => rrect(c, x - 62, bladeY, 124, 110, 16), COL.steel);
  shade(c, () => rrect(c, x - 62, bladeY, 124, 110, 16), COL.steelDk, 30, 0, 0.55);
  for (const dx of [-30, 0, 30]) line(c, [[x + dx, bladeY + 28], [x + dx, bladeY + 82]], 7, INK);
};

const face = (c: Ctx, x: number, y: number, r: number, lx: number, ly: number, blow = false) => {
  const h = r;
  shape(c, () => ell(c, x - h * 0.98, y + h * 0.1, h * 0.18, h * 0.26), SKIN.child, 5); shape(c, () => ell(c, x + h * 0.98, y + h * 0.1, h * 0.18, h * 0.26), SKIN.child, 5);
  shape(c, () => ell(c, x, y, h, h * 1.05), SKIN.child);
  shade(c, () => ell(c, x, y, h, h * 1.05), SKIN.childDk, h * 0.2, h * 0.1, 0.45);
  shape(c, () => { c.moveTo(x - h * 1.02, y - h * 0.1); c.bezierCurveTo(x - h * 1.1, y - h * 1.7, x + h * 1.1, y - h * 1.7, x + h * 1.02, y - h * 0.1); c.quadraticCurveTo(x, y - h * 0.65, x - h * 1.02, y - h * 0.1); c.closePath(); }, CLOTH.hair, 5);
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * h * 0.38, y + h * 0.1, h * 0.2, h * 0.23), WHITE, 4);
    shape(c, () => ell(c, x + s * h * 0.38 + lx * h * 0.08, y + h * 0.1 + ly * h * 0.1, h * 0.1, h * 0.12), INK, 0);
    line(c, [[x + s * h * 0.6, y - h * 0.22], [x + s * h * 0.2, y - h * 0.26]], 5);
  }
  if (blow) {
    for (const s of [-1, 1]) { c.beginPath(); ell(c, x + s * h * 0.62, y + h * 0.5, h * 0.22, h * 0.2); c.fillStyle = COL.pink; c.globalAlpha = 0.6; c.fill(); c.globalAlpha = 1; }
    shape(c, () => ell(c, x + lx * h * 0.05, y + h * 0.58, h * 0.11, h * 0.1), "#7a2a2a", 4);
  } else { c.beginPath(); c.arc(x, y + h * 0.42, h * 0.3, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
};

// the bucket seen from above: steel rim, water inside, a red bindi stuck on the rim at the top
const BX = 560, BY = 610, BR = 370;
const bucket = (c: Ctx) => {
  shadow(c, BX + 30, BY + 40, BR + 20, BR - 30);
  for (const s of [-1, 1]) shape(c, () => rrect(c, BX + s * (BR + 6) - 28, BY - 40, 56, 80, 22), COL.steelDk, 6);
  shape(c, () => ell(c, BX, BY, BR, BR), COL.steel);
  shade(c, () => ell(c, BX, BY, BR, BR), COL.steelDk, BR * 0.12, BR * 0.12, 0.5);
  shape(c, () => ell(c, BX, BY, BR - 26, BR - 26), COL.steelIn, 5);
  shape(c, () => ell(c, BX, BY, BR - 50, BR - 50), COL.water, 6);
  shade(c, () => ell(c, BX, BY, BR - 50, BR - 50), COL.waterDk, 50, 50, 0.45);
  c.beginPath(); c.arc(BX, BY, BR - 85, Math.PI * 1.1, Math.PI * 1.4); c.strokeStyle = WHITE; c.lineWidth = 11; c.lineCap = "round"; c.globalAlpha = 0.7; c.stroke(); c.globalAlpha = 1;
  shape(c, () => ell(c, BX, BY - BR + 13, 15, 15), RED, 5);
};
const grain = (c: Ctx, x: number, y: number, rot: number) => {
  shadow(c, x + 8, y + 12, 40, 14);
  const p = () => { ell(c, x, y, 38, 26, rot); c.moveTo(x + 14, y - 22); ell(c, x + 14, y - 22, 14, 11, rot); c.moveTo(x - 16, y + 22); ell(c, x - 16, y + 22, 12, 10, rot); };
  shape(c, p, "#fff3d6", 5);
  shade(c, () => ell(c, x, y, 38, 26, rot), "#e9d3a6", 12, 10, 0.6);
  line(c, [[x - 18, y - 4], [x + 6, y - 8]], 4, "#e9d3a6");
};
const GRAINS: [number, number, number][] = [[BX - 60, BY - 40, 0.3], [BX + 50, BY - 70, 1.2], [BX + 70, BY + 30, 0.6], [BX - 20, BY + 50, 2.2], [BX - 90, BY + 40, 1.7]];
const pencilV = (c: Ctx, x: number, top: number, tip: number) => {
  shape(c, () => rrect(c, x - 17, top, 34, 46, 10), COL.pink, 5);
  shape(c, () => c.rect(x - 17, top + 46, 34, 26), COL.steel, 5);
  shape(c, () => c.rect(x - 17, top + 72, 34, tip - top - 72 - 64), COL.yellow, 5);
  shade(c, () => c.rect(x - 17, top + 72, 34, tip - top - 72 - 64), COL.orange, 12, 0, 0.5);
  shape(c, () => polyP(c, [[x - 17, tip - 64], [x + 17, tip - 64], [x, tip]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x - 6, tip - 20], [x + 6, tip - 20], [x, tip]]), INK, 3);
};

// setup.e1.0
const e1c0 = (c: Ctx) => {
  ground(c);
  tray(c, 70, 520, 0.88, 64, 1);
  // a steel tumbler tipped over the tray, pouring
  c.save(); c.translate(430, 215); c.rotate(-1.95);
  shape(c, () => polyP(c, [[-62, -100], [62, -100], [50, 100], [-50, 100]]), COL.steel);
  shade(c, () => polyP(c, [[-62, -100], [62, -100], [50, 100], [-50, 100]]), COL.steelDk, 24, 0, 0.55);
  shape(c, () => ell(c, 0, -100, 62, 16), COL.water, 5);
  c.restore();
  const sx = 430 - 0.93 * 100, sy = 215 + 0.37 * 100;
  line(c, [[sx, sy], [sx - 8, 650]], 22, INK); line(c, [[sx, sy], [sx - 8, 650]], 12, COL.water);
  for (const k of [-1, 1]) { c.beginPath(); c.ellipse(sx - 8, 665, 40 + k * 24, 12 + k * 6, 0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke(); }
  hand(c, 640, 215, Math.PI + 0.25, 1.5);
  arrow(c, [[sx - 60, 250], [sx - 100, 400]], RED, 12);
  write(c, "1 cm", 40, 60, 70, INK, 10);
};

// setup.e1.1
const e1c1 = (c: Ctx) => {
  ground(c);
  tray(c, 50, 450, 0.9, 64, 1, 560);
  turner(c, 230, 220, 600);
  hand(c, 135, 300, 0, 1.3);
  arrow(c, [[320, 400], [640, 400]], RED, 14);
  // a torch shining across the tray at a slant
  c.save(); c.translate(900, 150); c.rotate(2.45);
  c.fillStyle = "rgba(255,230,120,0.38)"; c.beginPath(); c.moveTo(92, -26); c.lineTo(640, -200); c.lineTo(640, 200); c.lineTo(92, 26); c.closePath(); c.fill();
  shape(c, () => rrect(c, -130, -30, 190, 60, 14), COL.blue);
  shade(c, () => rrect(c, -130, -30, 190, 60, 14), COL.blueDk, 0, 18, 0.55);
  shape(c, () => polyP(c, [[60, -30], [96, -44], [96, 44], [60, 30]]), COL.steel);
  shape(c, () => ell(c, 96, 0, 10, 40), COL.yellow, 4);
  shape(c, () => c.rect(-70, -38, 30, 12), RED, 4);
  c.restore();
};

// setup.e1.2
const e1c2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 280, 440, 600, 190, 60), CLOTH.child, 6);
  tray(c, 300, 590, 0.72, 64, 0, 250);
  arrow(c, [[960, 700], [700, 700], [380, 700]], RED, 12);
  // the child's face close to the tray, watching
  face(c, 540, 280, 175, 0.8, 0.9);
  // phone stopwatch on the floor beside the tray
  c.save(); c.translate(130, 760); c.rotate(-0.12);
  shadow(c, 14, 150, 100, 20);
  shape(c, () => rrect(c, -85, -150, 170, 300, 24), COL.black);
  shape(c, () => rrect(c, -70, -132, 140, 264, 12), "#22303a", 4);
  c.beginPath(); c.arc(0, -10, 50, 0, Math.PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 7; c.stroke();
  line(c, [[0, -10], [0, -44]], 7, "#c9f06b"); line(c, [[0, -10], [26, -4]], 7, "#c9f06b"); line(c, [[-10, -66], [10, -66]], 7, "#c9f06b");
  write(c, "12", -36, 68, 46, "#c9f06b", 7);
  c.restore();
};

// setup.e1.3
const e1c3 = (c: Ctx) => {
  ground(c);
  tray(c, 50, 450, 0.9, 16, 4);
  turner(c, 230, 220, 590);
  hand(c, 135, 300, 0, 1.3);
  write(c, "4 cm", 380, 250, 100, INK, 13);
};

// setup.e2.0
const e2c0 = (c: Ctx) => {
  ground(c);
  bucket(c);
  GRAINS.forEach(([x, y, r]) => grain(c, x, y, r));
};

// setup.e2.1
const e2c1 = (c: Ctx) => {
  ground(c);
  bucket(c);
  c.save(); c.beginPath(); c.arc(BX, BY, BR - 50, 0, Math.PI * 2); c.clip();
  for (const r of [90, 170, 250, 330, 410]) { c.beginPath(); c.arc(320, 600, r, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 9; c.globalAlpha = 0.85; c.stroke(); c.globalAlpha = 1; }
  c.restore();
  // each grain rides its own little ring: it bobs on the spot, it does not travel
  GRAINS.forEach(([x, y, r]) => {
    c.beginPath(); ell(c, x, y + 4, 66, 44); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke();
    grain(c, x, y, r);
  });
  // the tap: pencil tip just touching the water at the edge, a splash ring round it, red arrow down
  pencilV(c, 320, 250, 596);
  shape(c, () => ell(c, 320, 600, 34, 14), WHITE, 5);
  hand(c, 239, 420, 0, 1.4);
  arrow(c, [[420, 300], [420, 470]], RED, 14);
};

// setup.e2.2
const e2c2 = (c: Ctx) => {
  ground(c);
  bucket(c);
  [[780, 590, 0.4], [830, 650, 1.3], [760, 650, 2.3], [815, 560, 0.9], [850, 610, 1.9]].forEach(([x, y, r]) => grain(c, x, y, r));
  arrow(c, [[420, 450], [560, 505], [700, 560]], RED, 14);
  face(c, 190, 190, 120, 0.9, 0.8, true);
  line(c, [[225, 265], [405, 435]], 24, INK); line(c, [[225, 265], [405, 435]], 13, WHITE);
  line(c, [[300, 340], [330, 370]], 13, RED); line(c, [[355, 395], [385, 425]], 13, RED);
};

export const su_soundWaves = cards("sci.sound.waves.L3 set-up", [e1c0, e1c1, e1c2, e1c3, e2c0, e2c1, e2c2]);
