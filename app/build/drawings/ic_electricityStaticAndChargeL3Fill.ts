import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, arrow, cards, ell, ground, hand, line, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// STATIC AND CHARGE (L3) · fill cards: e1 the rubbing test, e2 bending water with a comb, p1 the static weather diary.

const BALLOON = "#e4523b", BALLOON_DK = "#b53a2a";
// a blown-up balloon, centre (x, y), half-width r, knot at the bottom
const balloon = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r * 1.2);
  shape(c, () => { c.moveTo(x - r * 0.1, y + r * 1.2 + r * 0.18); c.lineTo(x + r * 0.1, y + r * 1.2 + r * 0.18); c.lineTo(x, y + r * 1.2 - 6); c.closePath(); }, BALLOON_DK, 5);
  shape(c, body, BALLOON);
  shade(c, body, BALLOON_DK, r * 0.22, r * 0.14);
  shine(c, [[x - r * 0.55, y - r * 0.55], [x - r * 0.32, y - r * 0.92]], 12);
};
// a torn bit of paper napkin
const bit = (c: Ctx, x: number, y: number, rot: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => rrect(c, -15, -10, 30, 20, 5), WHITE, 3);
  c.restore();
};

// e1: a rubbed balloon held over a dark plate; paper bits jump up and stick to it
const e1 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 870, 400, 95), COL.black);
  shape(c, () => ell(c, 540, 862, 340, 72), "#4f4860", 4);
  const onPlate = [[260, 860], [330, 890], [420, 850], [480, 900], [600, 905], [680, 855], [760, 895], [820, 860], [540, 840], [720, 835]];
  onPlate.forEach(([x, y], i) => bit(c, x, y, i * 0.9, 0.9));
  balloon(c, 540, 330, 190);
  for (const a of [0.3, 0.42, 0.58, 0.7]) { const an = Math.PI * a; bit(c, 540 + Math.cos(an) * 192, 330 + Math.sin(an) * 230, an - Math.PI / 2, 0.9); }
  arrow(c, [[330, 820], [330, 630]]);
  arrow(c, [[750, 820], [750, 630]]);
  const inAir = [[250, 700], [410, 760], [430, 640], [660, 680], [690, 780], [850, 720]];
  inAir.forEach(([x, y], i) => bit(c, x, y, 0.5 + i * 1.1, 0.9));
  hand(c, 540, 650, -Math.PI / 2, 1.2);
};

// points along a cubic bezier
const bez = (p: number[][], n: number) => { const o: number[][] = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]]); } return o; };

// e2: a thin stream from the tap bends towards a rubbed comb held close to it
const e2 = (c: Ctx) => {
  ground(c);
  // the tap: pipe from the wall, spout down, a cross handle on top
  shape(c, () => rrect(c, 130, 150, 380, 56, 20), COL.steel);
  shade(c, () => rrect(c, 130, 150, 380, 56, 20), COL.steelDk, 0, 22);
  shape(c, () => rrect(c, 268, 90, 28, 70, 8), COL.steelDk, 5);
  shape(c, () => ell(c, 282, 86, 62, 16), COL.steel, 5);
  shape(c, () => rrect(c, 452, 150, 66, 130, 16), COL.steel);
  shade(c, () => rrect(c, 452, 150, 66, 130, 16), COL.steelDk, 26, 0);
  shape(c, () => ell(c, 485, 282, 30, 10), COL.steelDk, 5);
  // the sink basin the stream falls into
  shape(c, () => ell(c, 500, 930, 180, 45), COL.steel);
  shape(c, () => ell(c, 500, 926, 150, 32), COL.water, 4);
  // where the stream would fall if nothing pulled it: a faint straight line
  c.save(); c.setLineDash([14, 14]); c.globalAlpha = 0.35; line(c, [[485, 320], [485, 900]], 5, INK); c.restore(); c.globalAlpha = 1;
  // the stream, bending towards the comb then falling into the basin
  const pts = [...bez([[485, 286], [485, 520], [650, 540], [612, 660]], 20), ...bez([[612, 660], [590, 740], [530, 840], [520, 920]], 16)];
  line(c, pts, 24, INK);
  line(c, pts, 14, COL.water);
  arrow(c, [[400, 580], [565, 620]]);
  // the plastic comb, teeth towards the water
  for (let i = 0; i < 14; i++) shape(c, () => rrect(c, 650, 462 + i * 25, 56, 12, 5), COL.blue, 3);
  shape(c, () => rrect(c, 700, 440, 42, 400, 12), COL.blue);
  shade(c, () => rrect(c, 700, 440, 42, 400, 12), COL.blueDk, 16, 0);
  hand(c, 721, 870, -Math.PI / 2, 1.1);
};

// p1: the finished diary page: five days, dry sun or damp drop, how many bits the balloon lifted
const sun = (c: Ctx, x: number, y: number) => {
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * 40, y + Math.sin(a) * 40], [x + Math.cos(a) * 54, y + Math.sin(a) * 54]], 6, COL.orange); }
  shape(c, () => ell(c, x, y, 30, 30), COL.yellow, 5);
};
const drop = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x, y - 48); c.quadraticCurveTo(x + 36, y, x + 30, y + 16); c.arc(x, y + 16, 30, 0, Math.PI); c.quadraticCurveTo(x - 36, y, x, y - 48); c.closePath(); }, COL.water, 5);
  shine(c, [[x - 12, y + 6], [x - 10, y + 22]], 6);
};
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 985, 330, 26);
  shape(c, () => rrect(c, 170, 150, 680, 820, 20), COL.paper);
  shade(c, () => rrect(c, 170, 150, 680, 820, 20), "#e8dcc4", 18, 14, 0.5);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 230 + i * 70, 150, 12, 22), COL.steelDk, 4);
  c.globalAlpha = 0.6; line(c, [[300, 190], [300, 930]], 3, RED); c.globalAlpha = 1;
  const days: [boolean, string][] = [[true, "14"], [true, "12"], [false, "3"], [false, "2"], [true, "11"]];
  days.forEach(([dry, n], i) => {
    const y = 215 + i * 140;
    write(c, String(i + 1), 215, y + 18, 72, INK, 7);
    if (dry) sun(c, 410, y + 52); else drop(c, 410, y + 52);
    write(c, n, 560, y + 18, 72, INK, 7);
    bit(c, 740, y + 52, -0.3, 1.1);
    if (i < 4) line(c, [[200, y + 122], [820, y + 122]], 3, COL.sky);
  });
  shadow(c, 955, 962, 70, 14);
  line(c, [[940, 936], [952, 960]], 4, INK);
  balloon(c, 940, 800, 85);
};

export const ic_electricityStaticAndChargeL3Fill = cards("sci.electricity.static-and-charge.L3 fill", [e1, e2, p1]);
