import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, person, write, cards } from "./flatKit";

const CH = "#e3b66b", CHDK = "#b98a42";
// a chana (chickpea): round, tan, a small point at the top
const chana = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), CH, Math.max(3, r * 0.14));
  shade(c, () => ell(c, x, y, r, r * 0.9), CHDK, r * 0.35, r * 0.3, 0.5);
  line(c, [[x - r * 0.1, y - r * 0.9], [x + r * 0.25, y - r * 0.55]], Math.max(3, r * 0.14));
};
// the steel bowl seen from above and a little in front, centre (x, y)
const topBowl = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.08, y + ry * 0.2, rx * 1.02, ry * 1.02);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel, 7);
  shade(c, () => ell(c, x, y, rx, ry), COL.steelDk, rx * 0.12, ry * 0.12, 0.55);
  shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.86, ry * 0.82), "#aeb9c8", 5);
  shape(c, () => ell(c, x - rx * 0.03, y + ry * 0.03, rx * 0.8, ry * 0.74), COL.steelIn, 0);
};
// n chana spread inside the bowl
const fish = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, r: number) => {
  const pts: number[][] = [];
  if (n === 5) [[0, 0], [-0.5, -0.4], [0.5, -0.35], [-0.45, 0.45], [0.5, 0.45]].forEach(([a, b]) => pts.push([a, b]));
  else {
    pts.push([0, 0]);
    for (let i = 0; i < 6; i++) pts.push([Math.cos(i * 1.047 + 0.3) * 0.38, Math.sin(i * 1.047 + 0.3) * 0.38]);
    for (let i = 0; i < n - 7; i++) pts.push([Math.cos(i * (6.283 / (n - 7)) + 0.1) * 0.74, Math.sin(i * (6.283 / (n - 7)) + 0.1) * 0.74]);
  }
  pts.forEach(([a, b]) => chana(c, x + a * (rx * 0.72), y + b * (ry * 0.68), r));
};
// a paper slip with a number (or blank pencil lines), centre (x, y)
const slip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, num = "") => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.06, h * 0.5, w * 0.5, h * 0.06);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), WHITE, 6);
  shade(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), "#e4dccb", w * 0.1, h * 0.04, 0.6);
  if (num) write(c, num, -h * 0.17, -h * 0.24, h * 0.5, INK, 12);
  else { line(c, [[-w * 0.3, -h * 0.2], [w * 0.3, -h * 0.2]], 5, COL.greyDk); line(c, [[-w * 0.3, 0], [w * 0.3, 0]], 5, COL.greyDk); line(c, [[-w * 0.3, h * 0.2], [0, h * 0.2]], 5, COL.greyDk); }
  c.restore();
};
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), tx = x2 + Math.cos(an) * 40, ty = y2 + Math.sin(an) * 40;
  line(c, [[x1, y1], [x2, y2]], 34, INK); line(c, [[x1, y1], [x2, y2]], 22, COL.yellow);
  shape(c, () => polyP(c, [[x2 + Math.sin(an) * 17, y2 - Math.cos(an) * 17], [tx, ty], [x2 - Math.sin(an) * 17, y2 + Math.cos(an) * 17]]), "#f2d3a3", 5);
  line(c, [[tx - Math.cos(an) * 10, ty - Math.sin(an) * 10], [tx, ty]], 8, INK);
};
const AD = { skin: SKIN.adult, sleeve: CLOTH.adult };

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  topBowl(c, 540, 540, 270, 200);
  fish(c, 540, 540, 270, 200, 20, 32);
  slip(c, 262, 540, 100, 130, -0.1); slip(c, 818, 540, 100, 130, 0.1); slip(c, 540, 200, 130, 100, 0.05); slip(c, 540, 880, 130, 100, -0.05);
  hand(c, 110, 540, 0, 1.4, SKIN.child, CLOTH.child);
  hand(c, 970, 540, Math.PI, 1.4, SKIN.adult, CLOTH.adult);
  hand(c, 540, 110, Math.PI / 2, 1.4, SKIN.adult, CLOTH.adult);
  hand(c, 540, 970, -Math.PI / 2, 1.4, SKIN.child, CLOTH.child);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  topBowl(c, 540, 235, 200, 135);
  fish(c, 540, 235, 200, 135, 20, 21);
  ["5", "5", "4", "5"].forEach((n, i) => {
    const x = 150 + i * 260;
    slip(c, x, 820, 210, 260, (i - 1.5) * 0.04, n);
    hand(c, x, 1050, -Math.PI / 2, 1.6, i % 2 ? SKIN.adult : SKIN.child, i % 2 ? CLOTH.adult : CLOTH.child);
  });
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  write(c, "5 + 5", 330, 70, 120, INK, 14);
  topBowl(c, 300, 640, 250, 180);
  fish(c, 300, 640, 250, 180, 5, 36);
  plate(c, 830, 760, 200, 110);
  [[790, 740], [850, 730], [890, 770], [820, 790], [770, 770], [860, 800], [810, 760]].forEach(([x, y]) => chana(c, x, y, 28));
  [[770, 470], [830, 450], [800, 510], [860, 500], [740, 520]].forEach(([x, y]) => chana(c, x, y, 28));
  hand(c, 930, 480, Math.PI, 1.6, SKIN.child, CLOTH.child);
  arrow(c, [[690, 480], [610, 480], [520, 540]], RED, 14);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  topBowl(c, 270, 400, 225, 160);
  [[0, 0], [-0.55, -0.1], [0.55, -0.1], [-0.28, -0.5], [0.28, -0.5], [-0.28, 0.5], [0.28, 0.5], [-0.8, 0.35], [0.8, 0.35], [0, 0.3]].forEach(([a, b]) => chana(c, 270 + a * 160, 400 + b * 110, 34));
  shadow(c, 770, 725, 260, 30);
  shape(c, () => rrect(c, 520, 120, 480, 590, 14), WHITE, 7);
  shade(c, () => rrect(c, 520, 120, 480, 590, 14), "#e4dccb", 20, 20, 0.45);
  [560, 620, 680].forEach((y) => line(c, [[550, y], [970, y]], 4, COL.grey));
  write(c, "10", 620, 230, 220, INK, 20);
  pencil(c, 1030, 668, 924, 522);
  hand(c, 1062, 726, -2.2, 1.5, SKIN.child, CLOTH.child);
  shadow(c, 330, 840, 170, 20);
  shape(c, () => polyP(c, [[230, 840], [310, 840], [190, 940]]), WHITE, 6);
  shape(c, () => ell(c, 330, 790, 170, 85), WHITE, 7);
  line(c, [[238, 846], [304, 846]], 9, WHITE);
  write(c, "10", 280, 745, 100, INK, 14);
  hand(c, 100, 1060, -1.1, 1.5, SKIN.adult, CLOTH.adult, true);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(500, 460); c.rotate(-0.04);
  shadow(c, 20, 280, 440, 30);
  shape(c, () => rrect(c, -420, -270, 840, 540, 14), "#e0b36a", 7);
  shade(c, () => rrect(c, -420, -270, 840, 540, 14), "#c4934a", 30, 30, 0.45);
  line(c, [[0, -220], [0, 220]], 5, INK);
  [-180, -110, -40, 30, 100].forEach((y) => line(c, [[-370, y], [-60, y]], 6, "#7a5a2c"));
  shape(c, () => rrect(c, 285, -240, 110, 130, 6), WHITE, 5); shape(c, () => ell(c, 340, -175, 28, 28), COL.orange, 4);
  [-60, 0, 60].forEach((y) => line(c, [[40, y], [260, y]], 6, "#7a5a2c"));
  "411001".split("").forEach((d, i) => { shape(c, () => rrect(c, 40 + i * 62, 130, 54, 76, 5), WHITE, 5); write(c, d, 52 + i * 62, 148, 44, INK, 7); });
  c.restore();
  pencil(c, 965, 900, 850, 700);
  hand(c, 985, 975, -2.1, 1.5, SKIN.child, CLOTH.child);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#b9b4ab"; c.fillRect(0, 860, D, 220); line(c, [[0, 860], [D, 860]], 6);
  person(c, 160, 900, 760, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.3] });
  shadow(c, 690, 905, 220, 30);
  shape(c, () => rrect(c, 540, 280, 300, 590, 30), RED, 7);
  shade(c, () => rrect(c, 540, 280, 300, 590, 30), "#a32a20", 80, 0, 0.6);
  shape(c, () => rrect(c, 520, 250, 340, 60, 20), "#b82e24", 7);
  shape(c, () => rrect(c, 590, 420, 200, 36, 14), INK, 0);
  shape(c, () => ell(c, 690, 600, 85, 85), WHITE, 6);
  line(c, [[690, 600], [690, 545]], 7); line(c, [[690, 600], [730, 620]], 7);
  person(c, 420, 900, 520, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [-0.9, -0.2] });
  shape(c, () => rrect(c, 585, 405, 130, 80, 5), "#e0b36a", 5); line(c, [[605, 430], [660, 430]], 4, "#7a5a2c");
  shape(c, () => rrect(c, 590, 420, 200, 36, 14), INK, 0); shape(c, () => rrect(c, 590, 405, 200, 15, 0), RED, 0);
  shape(c, () => rrect(c, 585, 405, 130, 80, 5), "#e0b36a", 5); line(c, [[605, 430], [660, 430]], 4, "#7a5a2c");
  arrow(c, [[500, 330], [570, 410]], RED, 12);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 770, 470, 40);
  shape(c, () => rrect(c, 50, 300, 980, 440, 18), WHITE, 7);
  shape(c, () => rrect(c, 50, 300, 980, 90, 18), COL.teal, 7);
  [150, 540, 930].forEach((x) => line(c, [[x, 270], [x, 330]], 14));
  [0, 1, 2, 3, 4].forEach((i) => shape(c, () => rrect(c, 70 + i * 190, 410, 180, 310, 8), i === 0 || i === 4 ? COL.sky : "#f3ecda", 6));
  const card = (x: number, y: number) => { shape(c, () => rrect(c, x - 70, y - 45, 140, 90, 6), "#e0b36a", 5); line(c, [[x - 45, y - 10], [x + 5, y - 10]], 4, "#7a5a2c"); line(c, [[x - 45, y + 15], [x + 5, y + 15]], 4, "#7a5a2c"); shape(c, () => rrect(c, x + 22, y - 32, 32, 38, 3), WHITE, 3); };
  card(160, 520); arrow(c, [[160, 590], [160, 680]], RED, 12);
  [1, 2, 3].forEach((n, i) => { write(c, String(n), 290 + i * 190 + 28, 500, 150, INK, 16); });
  card(920, 520);
  shape(c, () => ell(c, 920, 640, 38, 38), COL.green, 5); line(c, [[900, 640], [915, 656], [945, 620]], 9, WHITE);
  arrow(c, [[160, 240], [400, 150], [700, 150], [900, 230]], RED, 12);
  hand(c, 550, 960, -Math.PI / 2, 1.5, SKIN.child, CLOTH.child, true);
};

export const su_communityCommunityAndHelpers = cards("sci.community.community-and-helpers.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
