import type { Ctx } from "./core";
import { INK, BG, COL, RED, WHITE, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, write, cards } from "./flatKit";

// FOIL BOAT + PAPER JOINTS · set-up cards for sci.making-things.design-and-build.L3

const FOIL = "#d6dde6";
const coin = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.yellow, 4);
  c.beginPath(); ell(c, x, y, rx * 0.62, ry * 0.62); c.strokeStyle = COL.woodDk; c.lineWidth = 3; c.stroke();
};
// a foil boat (open tray) with its bottom centre at (x, y); coins at fractions along its floor; water filling from the right
const foilBoat = (c: Ctx, x: number, y: number, w: number, h: number, coins: number[] = [], waterRight = 0) => {
  shadow(c, x + w * 0.08, y + 6, w * 0.55, h * 0.12);
  const front = () => polyP(c, [[x - w / 2, y - h * 0.55], [x + w / 2, y - h * 0.55], [x + w * 0.4, y], [x - w * 0.4, y]]);
  shape(c, () => polyP(c, [[x - w / 2, y - h * 0.8], [x - w / 2 - 34, y - h * 0.55], [x - w / 2, y - h * 0.5]]), COL.steelDk, 5);
  shape(c, () => polyP(c, [[x + w / 2, y - h * 0.8], [x + w / 2 + 34, y - h * 0.55], [x + w / 2, y - h * 0.5]]), COL.steelDk, 5);
  shape(c, front, FOIL);
  shade(c, front, COL.steelDk, w * 0.3, 0);
  shine(c, [[x - w * 0.38, y - h * 0.45], [x - w * 0.3, y - h * 0.12]], 8);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h * 0.5, h * 0.16), FOIL);
  const ix = x - w / 2 + 16, iy = y - h + 11, iw = w - 32, ih = h * 0.5 - 22;
  shape(c, () => rrect(c, ix, iy, iw, ih, h * 0.1), COL.steelIn, 4);
  if (waterRight > 0) {
    c.save(); c.beginPath(); rrect(c, ix, iy, iw, ih, h * 0.1); c.clip(); c.fillStyle = COL.water; c.fillRect(ix + iw * (1 - waterRight), iy, iw, ih); c.restore();
    rrectLine(c, ix, iy, iw, ih, h * 0.1);
  }
  coins.forEach((u) => coin(c, ix + 22 + u * (iw - 44), iy + ih * 0.55, 19, 13));
};
const rrectLine = (c: Ctx, x: number, y: number, w: number, h: number, r: number) => { c.beginPath(); rrect(c, x, y, w, h, r); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); };
const mirror = (c: Ctx, draw: () => void) => { c.save(); c.translate(1080, 0); c.scale(-1, 1); draw(); c.restore(); };

// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 700); c.scale(1.35, 1.35); c.translate(-540, -700);
  shadow(c, 560, 790, 330, 40);
  shape(c, () => polyP(c, [[350, 600], [730, 600], [800, 780], [280, 780]]), COL.steelIn);
  const lw = () => polyP(c, [[350, 600], [280, 780], [200, 720], [260, 520]]);
  const rw = () => polyP(c, [[730, 600], [800, 780], [880, 720], [820, 520]]);
  shape(c, lw, FOIL); shape(c, rw, FOIL); shade(c, rw, COL.steelDk, 40, 0);
  shine(c, [[270, 560], [235, 690]], 8);
  shape(c, () => polyP(c, [[350, 600], [730, 600], [720, 540], [360, 540]]), COL.steelDk, 5);
  c.restore();
  hand(c, 100, 905, -0.9, 2, undefined, undefined, true);
  mirror(c, () => hand(c, 100, 905, -0.9, 2, undefined, undefined, true));
  arrow(c, [[120, 520], [140, 400]], RED, 14);
  arrow(c, [[960, 520], [940, 400]], RED, 14);
};

// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 990, 400, 40);
  const body = () => polyP(c, [[130, 600], [950, 600], [880, 970], [200, 970]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 170, 0);
  shape(c, () => ell(c, 540, 600, 420, 120), COL.steelDk);
  shape(c, () => ell(c, 540, 605, 385, 100), COL.water, 5);
  shine(c, [[220, 700], [250, 900]], 12);
  foilBoat(c, 520, 650, 380, 180, [0.2]);
  hand(c, 880, 230, 2.4, 1.8);
  coin(c, 738, 362, 34, 34);
  arrow(c, [[690, 420], [620, 480]], RED, 12);
};

// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.water; c.fillRect(0, 760, 1080, 320);
  c.beginPath(); c.moveTo(0, 760); c.lineTo(1080, 760); c.strokeStyle = COL.waterDk; c.lineWidth = 6; c.stroke();
  c.save(); c.translate(470, 790); c.rotate(0.2);
  foilBoat(c, 0, 0, 540, 260, [0.55, 0.75, 0.95], 0.3);
  c.restore();
  shape(c, () => { c.moveTo(740, 790); c.bezierCurveTo(780, 700, 880, 680, 940, 790); c.closePath(); }, COL.water, 5);
  arrow(c, [[980, 560], [880, 680]], RED, 12);
  for (const [dx, dy] of [[900, 840], [960, 900], [820, 930]]) shape(c, () => ell(c, dx, dy, 20, 14), COL.drop, 3);
};

// setup.e1.3
const e1s3 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[40, 330], [1040, 330], [1070, 1000], [10, 1000]]), COL.cloth);
  for (let i = 0; i < 5; i++) line(c, [[30 + i * 3, 380 + i * 130], [1050 - i * 3, 380 + i * 130]], 5, COL.teal);
  const n = [2, 4, 6];
  [180, 540, 900].forEach((bx, i) => {
    foilBoat(c, bx, 640, 270, 200, Array.from({ length: n[i] }, (_, k) => (n[i] === 2 ? 0.25 + k * 0.5 : k / (n[i] - 1))));
    shape(c, () => rrect(c, bx - 95, 720, 190, 150, 14), WHITE, 5);
    write(c, String(n[i]), bx - 70, 755, 80, INK, 9);
    coin(c, bx + 45, 800, 28, 28);
  });
};

// a spoon resting in a bowl: bowl of the spoon at (x, y), handle ending at (hx, hy)
const spoon = (c: Ctx, x: number, y: number, hx: number, hy: number) => {
  line(c, [[x, y], [hx, hy]], 22, INK); line(c, [[x, y], [hx, hy]], 11, COL.steel);
  shape(c, () => ell(c, x, y, 34, 22, 0.5), COL.steel, 5);
};
// a mound of paste standing in a bowl whose rim centre is (x, y); grains = rice grains showing
const paste = (c: Ctx, x: number, y: number, col: string, dk: string, grains: boolean) => {
  const m = () => { c.moveTo(x - 135, y + 4); c.bezierCurveTo(x - 120, y - 70, x + 120, y - 70, x + 135, y + 4); c.quadraticCurveTo(x, y + 36, x - 135, y + 4); c.closePath(); };
  shape(c, m, col, 5); shade(c, m, dk, 40, 0, 0.5);
  if (grains) [[-70, -20, 0.4], [-30, -40, -0.3], [20, -35, 0.6], [65, -15, -0.5], [-90, 5, -0.2], [-5, -8, 0.2], [45, 8, 0.1], [90, 0, 0.5], [-45, 10, 0.7]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx, y + dy, 17, 8, r), WHITE, 3));
  else [[-50, -15], [10, -30], [60, -10], [-10, 5]].forEach(([dx, dy]) => line(c, [[x + dx - 22, y + dy], [x + dx, y + dy - 8], [x + dx + 22, y + dy]], 4, dk));
};

// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c);
  bowl(c, 195, 260, 160, "#f3ead8");
  paste(c, 195, 260, "#fbf6e8", "#e3d6b8", true);
  spoon(c, 215, 225, 120, 60);
  bowl(c, 540, 260, 160, "#d9b98a");
  paste(c, 540, 260, "#d9b98a", "#b8935f", false);
  spoon(c, 560, 225, 640, 60);
  bowl(c, 885, 260, 160, COL.water);
  shine(c, [[800, 262], [860, 252]], 9);
  shadow(c, 230, 960, 190, 36);
  shape(c, () => ell(c, 230, 830, 190, 110), COL.yellow);
  shade(c, () => ell(c, 230, 830, 190, 110), COL.orange, 20, 20, 0.4);
  shape(c, () => ell(c, 230, 830, 105, 56), BG, 5);
  shape(c, () => polyP(c, [[330, 770], [440, 740], [452, 790], [345, 812]]), "rgba(255,211,77,0.8)", 4);
  plate(c, 770, 800, 280, 170);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, 590 + i * 14, 680 + i * 40, 360, 52, 5), i % 2 ? WHITE : COL.sky, 5);
};

// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 700, 470, 30);
  shape(c, () => rrect(c, 120, 560, 520, 120, 6), COL.sky);
  shape(c, () => rrect(c, 430, 550, 230, 140, 8), "#d9b98a", 5);
  shape(c, () => rrect(c, 440, 560, 520, 120, 6), WHITE);
  shade(c, () => rrect(c, 440, 560, 520, 120, 6), COL.steelDk, 0, 40, 0.35);
  shape(c, () => rrect(c, 440, 700, 520, 70, 4), COL.wood);
  for (let i = 0; i <= 5; i++) { line(c, [[440 + i * 100, 700], [440 + i * 100, 735]], 4); write(c, String(i), 428 + i * 100, 738, 26, INK, 4); }
  line(c, [[440, 690], [440, 830]], 8, RED); line(c, [[640, 690], [640, 830]], 8, RED); line(c, [[440, 815], [640, 815]], 8, RED);
  write(c, "2 cm", 480, 850, 80, RED, 9);
  hand(c, 540, 378, Math.PI / 2, 1.8, undefined, undefined, true);
  arrow(c, [[780, 380], [780, 520]], RED, 14);
};

// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 640, 440, 30);
  const Y = 470, H = 120;
  shape(c, () => polyP(c, [[220, Y], [440, Y], [458, Y + 28], [428, Y + 55], [460, Y + 85], [434, Y + H], [220, Y + H]]), COL.sky);
  shape(c, () => polyP(c, [[560, Y + 30], [606, Y], [770, Y], [770, Y + H], [590, Y + H], [570, Y + 85], [600, Y + 60]]), COL.sky);
  shape(c, () => rrect(c, 626, Y - 8, 150, H + 16, 8), "#d9b98a", 5);
  shape(c, () => rrect(c, 640, Y, 260, H, 6), WHITE);
  shade(c, () => rrect(c, 640, Y, 260, H, 6), COL.steelDk, 0, 36, 0.35);
  hand(c, 154, Y + 60, 0, 1.8);
  mirror(c, () => hand(c, 154, Y + 60, 0, 1.8));
  arrow(c, [[470, 360], [330, 360]], RED, 14);
  arrow(c, [[610, 360], [750, 360]], RED, 14);
  shape(c, () => polyP(c, [[470, 690], [510, 676], [525, 705], [490, 715]]), COL.sky, 4);
  shape(c, () => polyP(c, [[560, 700], [595, 690], [600, 720], [570, 726]]), COL.sky, 4);
};

export const su_makingThingsDesignAndBuild = cards("sci.making-things.design-and-build.L3 set-up", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2]);
