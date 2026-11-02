import type { Ctx } from "./core";
import { D, INK, COL, SKIN, CLOTH, WHITE, RED, ground, shape, shade, ell, polyP, rrect, shadow, line, shine, arrow, hand, cards } from "./flatKit";

// sci.forces.push-and-pull.L3 · missing experiment pictures: the balloon rocket (e2) and blowing a ball
// from two sides (e3).

// a simple chair seen from the side, seat centre at (x, y), facing right if dir = 1
const chair = (c: Ctx, x: number, y: number, dir: number) => {
  shadow(c, x + 20, y + 230, 90, 18);
  for (const s of [-60, 60]) line(c, [[x + s, y], [x + s, y + 225]], 16, COL.woodDk);
  shape(c, () => rrect(c, x - 85, y - 14, 170, 28, 8), COL.wood);
  const bx = x - dir * 70;
  shape(c, () => rrect(c, bx - 14, y - 250, 28, 240, 8), COL.wood);
  shape(c, () => rrect(c, bx - 14, y - 250, 28, 60, 8), COL.woodDk);
};

// flow.e2: the balloon rocket racing along a string between two chairs, air rushing out behind it
const balloonRocket = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d5bb"; c.fillRect(0, 760, D, D - 760);
  line(c, [[0, 760], [D, 760]], 5);
  chair(c, 130, 540, 1);
  chair(c, 950, 540, -1);
  // the string, tied to the chair backs
  line(c, [[60, 330], [1020, 330]], 7, COL.greyDk);
  // measuring tape on the floor
  shape(c, () => rrect(c, 170, 860, 740, 46, 10), COL.yellow);
  for (let i = 0; i <= 37; i++) { const x = 180 + i * 19.5; line(c, [[x, 862], [x, i % 5 === 0 ? 892 : 876]], i % 5 === 0 ? 4 : 2.5); }
  // air rushing out of the neck, behind the balloon
  for (const [dy, l] of [[-30, 150], [0, 190], [30, 150]]) { c.globalAlpha = 0.9; line(c, [[300, 430 + dy], [300 - l, 430 + dy]], 12, COL.sky); c.globalAlpha = 1; }
  // the balloon under the straw: long body, knotless open neck pointing left
  const body = () => { c.moveTo(330, 430); c.bezierCurveTo(330, 350, 400, 345, 500, 345); c.lineTo(620, 345); c.bezierCurveTo(740, 345, 790, 380, 790, 430); c.bezierCurveTo(790, 480, 740, 515, 620, 515); c.lineTo(500, 515); c.bezierCurveTo(400, 515, 330, 510, 330, 430); c.closePath(); };
  shadow(c, 580, 560, 230, 24);
  shape(c, body, COL.red);
  shade(c, body, "#b03a28", -40, -28);
  shine(c, [[420, 380], [560, 368]], 10);
  // the neck, open, air leaving
  shape(c, () => { c.moveTo(336, 405); c.lineTo(290, 395); c.lineTo(290, 465); c.lineTo(336, 455); c.closePath(); }, "#c7462f");
  shape(c, () => ell(c, 290, 430, 10, 35), "#8d2d1f", 5);
  // the straw on the string, tape holding the balloon to it
  shape(c, () => rrect(c, 430, 312, 260, 36, 18), COL.sky);
  line(c, [[455, 322], [665, 322]], 5, WHITE);
  shape(c, () => rrect(c, 490, 300, 36, 70, 4), "rgba(255,255,255,0.75)", 4);
  shape(c, () => rrect(c, 610, 300, 36, 70, 4), "rgba(255,255,255,0.75)", 4);
  // arrows: a small one for the air pushed back, a big one for the balloon's push forward
  arrow(c, [[250, 600], [120, 600]], RED, 9);
  arrow(c, [[640, 600], [900, 600]], RED, 12);
};

// flow.e3: a ping-pong ball on a tray, two children blowing from the bottom and the left, the ball
// rolling towards the top right
const blowTheBall = (c: Ctx) => {
  ground(c);
  // the tray, seen from above: a flat steel rectangle with a raised rim
  shadow(c, 560, 540, 400, 320);
  shape(c, () => rrect(c, 160, 200, 760, 640, 40), COL.steel);
  shape(c, () => rrect(c, 200, 240, 680, 560, 28), COL.steelIn, 5);
  shine(c, [[230, 280], [230, 700]], 8);
  // where the ball started (a faint ring) and the path to the top right
  c.setLineDash([14, 14]); line(c, [[520, 520], [520, 520]], 0); c.beginPath(); ell(c, 500, 560, 46, 46); c.strokeStyle = COL.greyDk; c.lineWidth = 4; c.stroke(); c.setLineDash([]);
  // the ball, rolled up and to the right
  shadow(c, 640, 470, 52, 20);
  shape(c, () => ell(c, 630, 440, 48, 48), WHITE);
  shade(c, () => ell(c, 630, 440, 48, 48), COL.grey, -16, -16, 0.5);
  arrow(c, [[680, 395], [820, 275]], RED, 12);
  // child one blows from the bottom edge: hand holding a straw, puff of air up at the ball
  const straw = (x1: number, y1: number, x2: number, y2: number) => { line(c, [[x1, y1], [x2, y2]], 26, INK); line(c, [[x1, y1], [x2, y2]], 16, COL.sky); line(c, [[x1, y1], [x2, y2]], 4, WHITE); };
  straw(500, 960, 500, 720);
  hand(c, 560, 920, -Math.PI / 2, 1.05, SKIN.child, CLOTH.child);
  for (const dx of [-26, 0, 26]) { c.globalAlpha = 0.9; line(c, [[500 + dx, 700], [500 + dx * 1.4, 630 - (dx === 0 ? 30 : 0)]], 9, COL.sky); c.globalAlpha = 1; }
  // child two blows from the left edge
  straw(60, 560, 320, 560);
  hand(c, 100, 500, 0, 1.05, SKIN.child, "#8b6cc9");
  for (const dy of [-26, 0, 26]) { c.globalAlpha = 0.9; line(c, [[340, 560 + dy], [410 + (dy === 0 ? 30 : 0), 560 + dy * 1.4]], 9, COL.sky); c.globalAlpha = 1; }
  // small red arrows for each blow
  arrow(c, [[560, 700], [560, 620]], RED, 8);
  arrow(c, [[340, 500], [420, 500]], RED, 8);
};

export const ic_forcesPushAndPullL3Fill = cards("sci.forces.push-and-pull.L3 fill", [balloonRocket, blowTheBall]);
