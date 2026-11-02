import type { Ctx } from "./core";
import { COL, INK, WHITE, SKIN, CLOTH, ground, shape, shade, shadow, ell, rrect, line, shine, arrow, hand, plate, bowl, cards } from "./flatKit";

// e1 step 0: a round hand mirror shows a wide smile: thin front teeth, wide back teeth
const e1s0 = (c: Ctx) => {
  ground(c);
  const mx = 540, my = 400, R = 310;
  shadow(c, mx + 40, 1000, 260, 30);
  // handle (child's hand holds it)
  shape(c, () => rrect(c, mx - 28, my + R - 20, 56, 280, 24), COL.teal);
  shade(c, () => rrect(c, mx - 28, my + R - 20, 56, 280, 24), COL.tealDk, 18, 0);
  shape(c, () => ell(c, mx, my, R, R), COL.teal);
  shape(c, () => ell(c, mx, my, R - 36, R - 36), "#eaf5fb", 6);
  shine(c, [[mx - 200, my - 120], [mx - 130, my - 210]], 12);
  // the mouth in the mirror
  const mouth = () => { c.moveTo(mx - 220, my - 20); c.quadraticCurveTo(mx, my + 20, mx + 220, my - 20); c.quadraticCurveTo(mx + 180, my + 190, mx, my + 190); c.quadraticCurveTo(mx - 180, my + 190, mx - 220, my - 20); c.closePath(); };
  shape(c, mouth, "#9c3a3a", 6);
  c.save(); c.beginPath(); mouth(); c.clip();
  // upper row: 4 thin front teeth in the middle, wide back teeth on both sides
  const row = (y0: number, up: boolean) => {
    const dir = up ? 1 : -1;
    const xs = [-190, -120, -52, -17, 17, 52, 120, 190];
    const ws = [74, 62, 34, 34, 34, 34, 62, 74], hs = [46, 52, 66, 66, 66, 66, 52, 46];
    xs.forEach((dx, i) => {
      const cx = mx + dx, w = ws[i], h = hs[i];
      const p = () => rrect(c, cx - w / 2, up ? y0 : y0 - h, w, h, 10);
      shape(c, p, WHITE, 5);
      shade(c, p, COL.steelDk, 6, 4 * dir, 0.3);
    });
  };
  row(my - 30, true);
  row(my + 190 - 40, false);
  c.restore();
  shape(c, () => { c.moveTo(mx - 220, my - 20); c.quadraticCurveTo(mx, my + 20, mx + 220, my - 20); c.quadraticCurveTo(mx + 180, my + 190, mx, my + 190); c.quadraticCurveTo(mx - 180, my + 190, mx - 220, my - 20); c.closePath(); }, "rgba(0,0,0,0)", 7);
  // red arrow to the thin front teeth
  arrow(c, [[mx + 330, my - 190], [mx + 100, my - 70], [mx + 30, my - 20]]);
  hand(c, mx - 190, my + R + 150, 0, 1.9);
};

// e1 step 1: five small foods on a steel plate
const e1s1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 560, 440, 330);
  // banana slices
  const bana = (x: number, y: number) => { shape(c, () => ell(c, x, y, 62, 50), "#ffe9a0", 6); shape(c, () => ell(c, x, y, 38, 28), "#fff4c8", 4); [[-10, -4], [10, 4], [0, 10]].forEach(([a, b]) => shape(c, () => ell(c, x + a, y + b, 4, 3), COL.brown, 0)); };
  bana(380, 440); bana(460, 500);
  // carrot stick
  const carrot = () => rrect(c, 580, 400, 230, 62, 20);
  c.save(); c.translate(0, 0); c.translate(700, 430); c.rotate(-0.25); c.translate(-700, -430);
  shape(c, carrot, COL.orange, 6); shade(c, carrot, COL.red, 0, 14, 0.35); line(c, [[610, 420], [700, 418]], 4, "#ffc27a"); c.restore();
  // chapati
  shape(c, () => ell(c, 420, 680, 130, 96, 0.1), "#ecc58a", 6);
  [[-50, -20], [30, -30], [60, 20], [-20, 30], [0, -2]].forEach(([a, b]) => shape(c, () => ell(c, 420 + a, 680 + b, 16, 11), COL.brown, 0));
  // curd on a spoon
  shape(c, () => ell(c, 690, 690, 62, 44, -0.4), COL.steel, 6);
  shape(c, () => ell(c, 690, 686, 46, 30, -0.4), WHITE, 3);
  shape(c, () => rrect(c, 700, 700, 150, 26, 12), COL.steel, 5);
  // puffed rice
  [[760, 560], [800, 590], [740, 600], [780, 530], [830, 560], [720, 540], [810, 640]].forEach(([x, y], i) => shape(c, () => ell(c, x, y, 20, 17, i), "#fffaf0", 4));
  arrow(c, [[960, 220], [830, 330], [790, 380]]);
};

// e1 step 2: a child bites a carrot stick; a grown-up makes tally marks
const e1s2 = (c: Ctx) => {
  ground(c);
  const hx = 330, hy = 340, hr = 215;
  shadow(c, hx + 40, hy + 250, 190, 30);
  shape(c, () => ell(c, hx, hy + 20, hr, hr * 1.05), SKIN.child);
  shade(c, () => ell(c, hx, hy + 20, hr, hr * 1.05), SKIN.childDk, 26, 8, 0.5);
  shape(c, () => { c.moveTo(hx - hr, hy); c.bezierCurveTo(hx - hr, hy - hr * 1.5, hx + hr, hy - hr * 1.5, hx + hr, hy); c.quadraticCurveTo(hx, hy - hr * 0.55, hx - hr, hy); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, hx - 70, hy - 20, 18, 26), INK, 0); shape(c, () => ell(c, hx + 70, hy - 20, 18, 26), INK, 0);
  shape(c, () => ell(c, hx + 10, hy + 140, 76, 36), "#8a2f35", 6);
  const carrot = () => rrect(c, hx + 10, hy + 118, 520, 56, 22);
  shape(c, carrot, COL.orange, 6); shade(c, carrot, COL.red, 0, 14, 0.35);
  shape(c, () => rrect(c, hx - 30, hy + 104, 30, 30, 8), WHITE, 5); shape(c, () => rrect(c, hx, hy + 104, 30, 30, 8), WHITE, 5);
  hand(c, hx + 560, hy + 146, Math.PI, 1.0);
  arrow(c, [[hx + 330, hy + 20], [hx + 200, hy + 60], [hx + 130, hy + 100]]);
  // paper with tally marks, and a grown-up hand holding a pencil on it
  shape(c, () => rrect(c, 260, 690, 600, 300, 14), COL.paper, 6);
  for (let i = 0; i < 4; i++) line(c, [[340 + i * 60, 750], [340 + i * 60, 900]], 12, INK);
  const pen = [[990, 730], [780, 890]];
  line(c, pen, 30, INK); line(c, pen, 18, COL.yellow);
  hand(c, 965, 810, Math.PI, 1.1, SKIN.adult, CLOTH.adult);
};

export const su_animalsAnimalsAroundUsL1 = cards("sci.animals.animals-around-us.L1 set-up", [e1s0, e1s1, e1s2]);
