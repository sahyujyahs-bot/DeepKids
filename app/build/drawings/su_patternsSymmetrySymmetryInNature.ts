import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, glass, hand, write, cards, SKIN, CLOTH } from "./flatKit";

// SYMMETRY IN NATURE (L3) · set-up cards: soap bubbles under a lid (e1) and cutting fruits across (e2).
const SOAP = "#d3edf3", FILM = "rgba(244,251,255,0.9)", BHINDI = "#7fb04a", BHINDIDk = "#5a8a32", PITH = "#e3edbc", SEEDC = "#c3d97a";
const LEMON = "#f6dc3c", LEMONDk = "#d9b81e", CUKE = "#4f9a4a", CUKEDk = "#37753a", CUKEIN = "#e9f1c8";

// one soap bubble: a pale ball with a ring and a shine
const bub = (c: Ctx, x: number, y: number, rx: number, ry = rx * 0.8) => {
  shape(c, () => ell(c, x, y, rx, ry), FILM, 4);
  line(c, [[x - rx * 0.55, y - ry * 0.25], [x - rx * 0.25, y - ry * 0.6]], Math.max(3, rx * 0.12), WHITE);
};
// a steel plate with a thin layer of soapy water
const soapPlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  plate(c, x, y, rx, ry);
  shape(c, () => ell(c, x, y - ry * 0.02, rx * 0.8, ry * 0.66), SOAP, 3);
};
const hexP = (c: Ctx, x: number, y: number, R: number) => { const p: number[][] = []; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 3; p.push([x + Math.cos(a) * R, y + Math.sin(a) * R]); } polyP(c, p); };
// the lobed outline of a bhindi cut across: five rounded lobes
const lobes = (c: Ctx, x: number, y: number, R: number) => { for (let i = 0; i <= 60; i++) { const a = (i / 60) * Math.PI * 2, r = R * (1 + 0.1 * Math.cos(5 * (a + Math.PI / 2))); (i ? c.lineTo : c.moveTo).call(c, x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); };
// a bhindi cut across: lobes, pale middle, walls, a cluster of seeds in each lobe
const bhindiCut = (c: Ctx, x: number, y: number, R: number) => {
  shape(c, () => lobes(c, x, y, R), BHINDI, Math.max(4, R * 0.04));
  shade(c, () => lobes(c, x, y, R), BHINDIDk, R * 0.06, R * 0.06, 0.5);
  shape(c, () => lobes(c, x, y, R * 0.86), PITH, Math.max(3, R * 0.03));
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5, n = a + Math.PI / 5;
    line(c, [[x, y], [x + Math.cos(n) * R * 0.78, y + Math.sin(n) * R * 0.78]], Math.max(2.5, R * 0.025), COL.greenLt);
    for (let k = 0; k < 3; k++) { const d = R * (0.4 + k * 0.17), side = k % 2 ? 1 : -1; const sx = x + Math.cos(a) * d - Math.sin(a) * R * 0.05 * side, sy = y + Math.sin(a) * d + Math.cos(a) * R * 0.05 * side; shape(c, () => ell(c, sx, sy, R * 0.075, R * 0.075), SEEDC, Math.max(2.5, R * 0.025)); }
  }
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  glass(c, 330, 830, 330, 420, 0.7, SOAP);
  // foam on top of the soapy water
  for (const [bx, by, r] of [[270, 576, 26], [330, 566, 30], [392, 578, 26], [300, 598, 22], [364, 600, 22]]) bub(c, bx, by, r);
  // the spoon, gripped by a child's hand, stirring
  const sp: number[][] = [[388, 150], [340, 700]];
  line(c, sp, 24, INK); line(c, sp, 12, COL.steel);
  shape(c, () => ell(c, 337, 724, 34, 44, 0.08), COL.steel, 6);
  hand(c, 388, 150, 1.69, 1.8);
  arrow(c, [[190, 560], [215, 640], [270, 690]], RED, 10);
  // the plate with soapy water, and the pour arrow to it
  soapPlate(c, 810, 800, 250, 105);
  arrow(c, [[540, 560], [640, 470], [760, 520], [800, 650]], RED, 11);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  soapPlate(c, 540, 760, 450, 190);
  // a patch of same-sized bubbles in the middle, packed in rows
  for (let row = 0; row < 7; row++) {
    const y = 700 + row * 36 - 105, n = row % 2 ? 6 : 7;
    for (let k = 0; k < n; k++) { const x = 540 + (k - (n - 1) / 2) * 82; if (((x - 540) / 300) ** 2 + ((y - 760) / 110) ** 2 < 1) bub(c, x, y, 40, 31); }
  }
  // the straw under the soapy water, held by a child's hand; air goes down it
  const st: number[][] = [[880, 130], [625, 700]];
  line(c, st, 34, INK); line(c, st, 20, COL.teal);
  line(c, [[800, 270], [790, 296]], 20, WHITE); line(c, [[742, 408], [732, 434]], 20, WHITE); line(c, [[684, 546], [674, 572]], 20, WHITE);
  bub(c, 615, 718, 34, 28); bub(c, 570, 742, 22, 18);
  hand(c, 870, 150, 1.96, 1.8);
  arrow(c, [[960, 400], [895, 560]], RED, 11);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  soapPlate(c, 500, 790, 440, 200);
  // the foam, squashed into six-sided cells, seen through the clear lid
  const cx = 470, cy = 700, R = 64, sq = 0.6;
  c.save(); c.translate(cx, cy); c.scale(1, sq);
  const hexes: number[][] = [];
  for (let row = -4; row <= 4; row++) for (let k = -6; k <= 6; k++) { const x = (k + (row % 2 ? 0.5 : 0)) * Math.sqrt(3) * R, y = row * 1.5 * R; if ((x / 320) ** 2 + (y / 250) ** 2 < 0.95) hexes.push([x, y]); }
  hexes.forEach(([x, y]) => shape(c, () => hexP(c, x, y, R), FILM, 5));
  shape(c, () => hexP(c, 0, 0, R), "rgba(255,255,255,0)", 0);
  c.restore();
  // the clear lid on top: thick edge, glass top, a tab
  shape(c, () => ell(c, cx, cy + 16, 350, 168), "rgba(127,166,200,0.55)", 6);
  shape(c, () => ell(c, cx, cy, 350, 168), "rgba(220,238,250,0.25)", 6);
  shine(c, [[cx - 290, cy - 60], [cx - 210, cy - 110]], 10);
  shape(c, () => rrect(c, cx + 330, cy - 22, 100, 44, 16), "rgba(127,166,200,0.7)", 6);
  c.save(); c.translate(cx, cy); c.scale(1, sq); c.beginPath(); hexP(c, 0, 0, R); c.lineWidth = 11; c.strokeStyle = RED; c.stroke(); c.restore();
  hand(c, 944, 630, 2.84, 1.4);
  arrow(c, [[130, 330], [130, 500]], RED, 11);
  write(c, "6", 440, 330, 100, RED, 10);
  line(c, [[470, 450], [470, 530]], 5, RED);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  // the wooden board
  shadow(c, 560, 950, 460, 36);
  shape(c, () => polyP(c, [[120, 570], [980, 570], [1010, 930], [90, 930]]), COL.wood, 6);
  shade(c, () => polyP(c, [[120, 570], [980, 570], [1010, 930], [90, 930]]), COL.woodDk, 30, 24, 0.35);
  // the lemon and the cucumber waiting at the back
  shadow(c, 225, 710, 90, 16);
  shape(c, () => ell(c, 215, 650, 100, 66), LEMON, 6); shape(c, () => ell(c, 112, 652, 14, 14), LEMON, 5);
  shade(c, () => ell(c, 215, 650, 100, 66), LEMONDk, 24, 18, 0.5);
  shine(c, [[160, 625], [200, 612]], 8);
  shadow(c, 770, 700, 200, 16);
  shape(c, () => rrect(c, 560, 610, 400, 78, 38), CUKE, 6);
  shade(c, () => rrect(c, 560, 610, 400, 78, 38), CUKEDk, 0, 26, 0.55);
  shine(c, [[610, 630], [850, 630]], 8);
  // the bhindi, cut across in the middle
  const pod = (x0: number, x1: number, capped: boolean) => {
    const ty = (x: number) => 712 + (x - 260) * 0.06, by = (x: number) => 802 - (x - 260) * 0.08;
    shape(c, () => polyP(c, [[x0, ty(x0)], [x1, ty(x1)], [x1, by(x1)], [x0, by(x0)]]), BHINDI, 6);
    shade(c, () => polyP(c, [[x0, ty(x0)], [x1, ty(x1)], [x1, by(x1)], [x0, by(x0)]]), BHINDIDk, 0, 22, 0.5);
    for (const f of [0.33, 0.66]) line(c, [[x0, ty(x0) + (by(x0) - ty(x0)) * f], [x1, ty(x1) + (by(x1) - ty(x1)) * f]], 3, BHINDIDk);
    if (capped) shape(c, () => rrect(c, 226, 728, 40, 60, 12), BHINDIDk, 6);
  };
  shadow(c, 570, 818, 340, 18);
  pod(262, 495, true); pod(527, 800, false);
  shape(c, () => polyP(c, [[800, 745], [880, 770], [800, 776]]), BHINDI, 6);
  // the knife, gripped by a grown-up's hand, blade down at the cut
  shape(c, () => polyP(c, [[499, 410], [529, 410], [531, 812], [499, 800]]), COL.steel, 6);
  shade(c, () => polyP(c, [[499, 410], [529, 410], [531, 812], [499, 800]]), COL.steelDk, 18, 0, 0.55);
  shape(c, () => rrect(c, 494, 290, 40, 130, 14), COL.brown, 6);
  hand(c, 514, 190, Math.PI / 2, 1.7, SKIN.adult, CLOTH.adult);
  // the other hand steadies the bhindi
  hand(c, 980, 760, Math.PI, 1.2, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[680, 300], [680, 460]], RED, 11);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const x = 430, y = 470, R = 300;
  shadow(c, x + 30, y + R * 0.95, R * 0.9, 38);
  bhindiCut(c, x, y, R);
  // a child's finger pointing at one seed cluster
  const a = -Math.PI / 2 + (2 * 2 * Math.PI) / 5, tx = x + Math.cos(a) * R * 0.55, ty = y + Math.sin(a) * R * 0.55, an = Math.PI + 0.7;
  hand(c, tx - Math.cos(an) * 205, ty - Math.sin(an) * 205, an, 2.0, SKIN.child, CLOTH.child, true);
  write(c, "5", 830, 120, 170, RED, 14);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1010, 400, 22);
  shape(c, () => rrect(c, 120, 50, 840, 960, 24), COL.paper, 7);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 120, 120 + i * 100, 16, 16), INK, 0);
  line(c, [[190, 50], [190, 1010]], 4, COL.red);
  const rows = [250, 540, 830];
  rows.forEach((ry, i) => { if (i < 2) line(c, [[230, ry + 150], [920, ry + 150]], 3, COL.sky); });
  // lemon cut across: ten wedges
  const lx = 340, ly = rows[1];
  shape(c, () => ell(c, lx, ly, 125, 125), LEMON, 6);
  shape(c, () => ell(c, lx, ly, 103, 103), "#fbf0a6", 4);
  for (let k = 0; k < 10; k++) { const an = (k * Math.PI) / 5; line(c, [[lx + Math.cos(an) * 14, ly + Math.sin(an) * 14], [lx + Math.cos(an) * 103, ly + Math.sin(an) * 103]], 4, LEMONDk); }
  // bhindi and cucumber
  bhindiCut(c, 340, rows[0], 120);
  shape(c, () => ell(c, 340, rows[2], 125, 125), CUKE, 6);
  shape(c, () => ell(c, 340, rows[2], 104, 104), CUKEIN, 4);
  for (let k = 0; k < 3; k++) { const an = -Math.PI / 2 + (k * 2 * Math.PI) / 3; shape(c, () => ell(c, 340 + Math.cos(an) * 46, rows[2] + Math.sin(an) * 46, 26, 15, an), "#bcd97a", 4); }
  write(c, "5", 610, rows[0] - 55, 110, INK, 11);
  write(c, "10", 580, rows[1] - 55, 110, INK, 11);
  write(c, "3", 610, rows[2] - 55, 110, INK, 11);
  // a child's hand with a pencil
  const an = -2.46, px = 857, py = 991;
  line(c, [[px + Math.cos(an) * 176, py + Math.sin(an) * 176], [px - Math.cos(an) * 50, py - Math.sin(an) * 50]], 26, INK);
  line(c, [[px + Math.cos(an) * 176, py + Math.sin(an) * 176], [px - Math.cos(an) * 50, py - Math.sin(an) * 50]], 14, COL.yellow);
  hand(c, px, py, an, 1.6);
};

export const su_patternsSymmetrySymmetryInNature = cards("sci.patterns-symmetry.symmetry-in-nature.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
