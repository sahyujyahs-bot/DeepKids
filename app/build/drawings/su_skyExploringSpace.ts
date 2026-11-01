import type { Ctx } from "./core";
import { D, INK, COL, SKIN, CLOTH, WHITE, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, cards } from "./flatKit";

// sci.sky.exploring-space.L3 set-up cards: the candle under a glass, the half lens, the ice in the shade.

// the sleeve running on from a hand's cuff to the edge of the card
const armExt = (c: Ctx, x: number, y: number, an: number, s: number, len: number, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  c.fillStyle = sleeve; c.fillRect(-78 - len, -36, len + 10, 72);
  line(c, [[-78 - len, -36], [-70, -36]], 6); line(c, [[-78 - len, 36], [-70, 36]], 6);
  c.restore();
};

// a steel tumbler, centre (x, y), tilted by rot; a little water at the mouth
const tumbler = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => { c.moveTo(-58, -85); c.lineTo(58, -85); c.lineTo(46, 85); c.lineTo(-46, 85); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, 30, 0);
  shape(c, () => ell(c, 0, -85, 58, 14), COL.steelIn, 5);
  shape(c, () => ell(c, 0, -84, 46, 9), COL.water, 0);
  c.restore();
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  glass(c, 140, 820, 150, 190);
  glass(c, 330, 820, 190, 270);
  glass(c, 610, 820, 270, 380, 0.3);
  const st = [[712, 384], [708, 540], [706, 706]];
  line(c, st, 30, INK); line(c, st, 20, COL.water);
  shape(c, () => ell(c, 706, 706, 40, 10), COL.drop, 4);
  tumbler(c, 760, 300, -2);
  hand(c, 925, 285, Math.PI, 1.65, SKIN.child, CLOTH.child);
  armExt(c, 925, 285, Math.PI, 1.65, 400);
  arrow(c, [[815, 450], [815, 580]]);
};

// ---- the candle cards share the steel plate, the tealight and the glass
const flame = (c: Ctx, x: number, by: number, h: number, w: number, dim = false) => {
  const p = () => { c.moveTo(x, by); c.bezierCurveTo(x - w, by - h * 0.2, x - w * 0.6, by - h * 0.7, x, by - h); c.bezierCurveTo(x + w * 0.6, by - h * 0.7, x + w, by - h * 0.2, x, by); c.closePath(); };
  shape(c, p, dim ? "#f6e3a0" : COL.yellow, 5);
  shape(c, () => ell(c, x, by - h * 0.28, w * 0.42, h * 0.22), dim ? COL.orange : COL.orange, 0);
};
const tealight = (c: Ctx, x: number, y: number) => {
  shape(c, () => polyP(c, [[x - 85, y], [x + 85, y], [x + 76, y - 66], [x - 76, y - 66]]), COL.steel);
  shade(c, () => polyP(c, [[x - 85, y], [x + 85, y], [x + 76, y - 66], [x - 76, y - 66]]), COL.steelDk, 30, 0);
  shape(c, () => ell(c, x, y - 66, 76, 18), "#fff3d6", 5);
  line(c, [[x, y - 66], [x, y - 86]], 6);
};
const bell = (c: Ctx, x: number, rimY: number) => {
  const rw = 190, tw = 158, top = rimY - 420;
  shape(c, () => { c.moveTo(x - tw, top); c.lineTo(x + tw, top); c.lineTo(x + rw, rimY); c.ellipse(x, rimY, rw, 36, 0, 0, Math.PI); c.closePath(); }, "rgba(214,236,250,0.42)", 5);
  shape(c, () => ell(c, x, rimY, rw, 36), "rgba(255,255,255,0.14)", 5);
  shape(c, () => ell(c, x, top, tw, 26), "rgba(255,255,255,0.4)", 5);
  shine(c, [[x - tw * 0.8, top + 50], [x - rw * 0.8, rimY - 40]], 9);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 850, 400, 105);
  shadow(c, 600, 900, 200, 36);
  tealight(c, 540, 850);
  shape(c, () => ell(c, 540, 700, 110, 130), "rgba(255,211,77,0.3)", 0);
  flame(c, 540, 764, 150, 50);
  bell(c, 540, 600);
  hand(c, 830, 400, Math.PI, 1.8, SKIN.adult, CLOTH.adult);
  armExt(c, 830, 400, Math.PI, 1.8, 400, CLOTH.adult);
  arrow(c, [[540, 30], [540, 150]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 850, 400, 105);
  tealight(c, 540, 850);
  shape(c, () => ell(c, 540, 745, 45, 45), "rgba(255,211,77,0.2)", 0);
  flame(c, 540, 764, 52, 20, true);
  const sm: number[][] = [];
  for (let i = 0; i <= 22; i++) sm.push([540 + Math.sin(i * 0.7) * 14 * (0.4 + i / 22), 700 - i * 10]);
  line(c, sm, 15, INK); line(c, sm, 8, "#aaa5b2");
  bell(c, 540, 850);
  // the stopwatch and the finger that stops it
  const sx = 860, sy = 330;
  shape(c, () => rrect(c, sx - 22, sy - 135, 44, 36, 8), COL.steelDk);
  shape(c, () => ell(c, sx, sy, 100, 100), COL.steel);
  shape(c, () => ell(c, sx, sy, 80, 80), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[sx + Math.cos(a) * 62, sy + Math.sin(a) * 62], [sx + Math.cos(a) * 74, sy + Math.sin(a) * 74]], 4); }
  line(c, [[sx, sy], [sx + 38, sy - 36]], 7, RED);
  shape(c, () => ell(c, sx, sy, 8, 8), INK, 0);
  hand(c, 985, 85, 2.2, 1.15, SKIN.child, CLOTH.child, true);
  armExt(c, 985, 85, 2.2, 1.15, 300);
};

// ---- the lens cards: a dim room, a bright window, a sheet of paper on the far wall
const ROOM = "#4b4570", GLOW = "rgba(255,225,120,0.16)";
const windowPic = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 6); c.clip();
  c.fillStyle = COL.sky; c.fillRect(x, y, w, h);
  c.restore();
  shape(c, () => ell(c, x + w * 0.7, y + h * 0.26, w * 0.15, w * 0.15), COL.yellow, Math.max(2, w * 0.025));
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 6); c.clip();
  shape(c, () => { c.moveTo(x, y + h * 0.78); c.quadraticCurveTo(x + w * 0.4, y + h * 0.58, x + w, y + h * 0.8); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); }, COL.green, Math.max(2, w * 0.025));
  c.restore();
};
const WX = 50, WY = 310, WW = 200, WH = 320;
const lensScene = (c: Ctx, dim: number) => {
  c.fillStyle = ROOM; c.fillRect(0, 0, D, D);
  shape(c, () => ell(c, 150, 470, 240, 290), GLOW, 0);
  // the window
  windowPic(c, WX, WY, WW, WH);
  c.beginPath(); rrect(c, WX, WY, WW, WH, 6); c.strokeStyle = INK; c.lineWidth = 26; c.stroke(); c.strokeStyle = WHITE; c.lineWidth = 14; c.stroke();
  line(c, [[WX + WW / 2, WY], [WX + WW / 2, WY + WH]], 16, INK); line(c, [[WX + WW / 2, WY], [WX + WW / 2, WY + WH]], 8, WHITE);
  // the sheet on the far wall, with the upside-down picture
  shape(c, () => rrect(c, 850, 270, 200, 420, 6), COL.paper);
  const px = 875, py = 360, pw = 150, ph = 240;
  c.save(); c.translate(px + pw / 2, py + ph / 2); c.rotate(Math.PI); c.translate(-(px + pw / 2), -(py + ph / 2)); windowPic(c, px, py, pw, ph); c.restore();
  c.beginPath(); rrect(c, px, py, pw, ph, 3); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.fillStyle = `rgba(75,69,112,${dim})`; c.fillRect(px - 3, py - 3, pw + 6, ph + 6);
  // the lens on its handle
  shape(c, () => rrect(c, 562, 560, 36, 270, 12), COL.brown);
  shape(c, () => ell(c, 580, 470, 112, 112), COL.black);
  shape(c, () => ell(c, 580, 470, 92, 92), "#cfe6f5", 4);
  shine(c, [[520, 430], [545, 400]], 10);
};
const rays = (c: Ctx, hole = false) => {
  const col = "#ffe27a", m = hole ? 580 : 580;
  line(c, [[250, 318], [m, 405], [875, 600]], 5, col);
  line(c, [[250, 622], [m, 535], [875, 360]], 5, col);
};
const lensHand = (c: Ctx) => { hand(c, 580, 930, -Math.PI / 2, 1.6, SKIN.child, CLOTH.child); armExt(c, 580, 930, -Math.PI / 2, 1.6, 300); };
const card = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), COL.brown);
  shade(c, () => rrect(c, x, y, w, h, 6), COL.soilDk, 14, 0, 0.35);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  lensScene(c, 0);
  rays(c);
  lensHand(c);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  lensScene(c, 0.4);
  rays(c);
  card(c, 455, 130, 127, 480);
  lensHand(c);
  hand(c, 518, 80, Math.PI / 2, 1.5, SKIN.child, CLOTH.child);
  armExt(c, 518, 80, Math.PI / 2, 1.5, 300);
  arrow(c, [[300, 650], [430, 650]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  lensScene(c, 0.7);
  rays(c, true);
  card(c, 440, 330, 280, 280);
  shape(c, () => ell(c, 580, 470, 24, 24), "#cfe6f5", 5);
  line(c, [[250, 318], [572, 462]], 5, "#ffe27a"); line(c, [[250, 622], [570, 480]], 5, "#ffe27a");
  lensHand(c);
  hand(c, 580, 230, Math.PI / 2, 1.5, SKIN.child, CLOTH.child);
  armExt(c, 580, 230, Math.PI / 2, 1.5, 300);
};

// ---- the ice cards: a window sill, the book, two saucers
const cube = (c: Ctx, x: number, y: number, s: number) => {
  const top = [[x - s * 0.5, y - s * 0.7], [x, y - s * 0.95], [x + s * 0.5, y - s * 0.7], [x, y - s * 0.45]];
  shape(c, () => polyP(c, [[x - s * 0.5, y - s * 0.7], [x, y - s * 0.45], [x, y + s * 0.05], [x - s * 0.5, y - s * 0.2]]), "#d6ecfa", 5);
  shape(c, () => polyP(c, [[x, y - s * 0.45], [x + s * 0.5, y - s * 0.7], [x + s * 0.5, y - s * 0.2], [x, y + s * 0.05]]), "#a9cbe6", 5);
  shape(c, () => polyP(c, top), "#f2f9ff", 5);
  shine(c, [[x - s * 0.36, y - s * 0.55], [x - s * 0.36, y - s * 0.3]], 5);
};
const sillScene = (c: Ctx) => {
  ground(c);
  // window behind, sun in it
  c.fillStyle = COL.sky; c.fillRect(50, 40, 980, 480);
  c.strokeStyle = INK; c.lineWidth = 24; c.strokeRect(50, 40, 980, 480); c.strokeStyle = WHITE; c.lineWidth = 12; c.strokeRect(50, 40, 980, 480);
  line(c, [[540, 40], [540, 520]], 22, INK); line(c, [[540, 40], [540, 520]], 12, WHITE);
  shape(c, () => ell(c, 170, 150, 55, 55), COL.yellow, 5);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.4; line(c, [[170 + Math.cos(a) * 75, 150 + Math.sin(a) * 75], [170 + Math.cos(a) * 105, 150 + Math.sin(a) * 105]], 7, COL.orange); }
  // the sill
  shape(c, () => polyP(c, [[40, 520], [1040, 520], [1070, 800], [10, 800]]), "#ead7ae");
  shape(c, () => polyP(c, [[10, 800], [1070, 800], [1070, 900], [10, 900]]), COL.wood);
  c.fillStyle = "#fff0b0"; c.beginPath(); polyP(c, [[70, 540], [400, 540], [440, 790], [20, 790]]); c.fill();
  c.fillStyle = "rgba(43,35,64,0.3)"; c.beginPath(); polyP(c, [[600, 545], [1032, 545], [1068, 795], [620, 795]]); c.fill();
  // the book, standing
  shape(c, () => polyP(c, [[590, 330], [630, 312], [630, 722], [590, 742]]), COL.paper);
  shape(c, () => rrect(c, 450, 330, 140, 412, 6), COL.blue);
  shade(c, () => rrect(c, 450, 330, 140, 412, 6), COL.blueDk, 30, 0);
  shape(c, () => rrect(c, 475, 410, 90, 90, 6), COL.yellow, 5);
  shape(c, () => ell(c, 520, 455, 22, 22), COL.orange, 4);
};
const saucers = (c: Ctx) => { plate(c, 230, 690, 195, 62); plate(c, 830, 690, 195, 62); };

// setup.e3.0
const e3_0 = (c: Ctx) => {
  sillScene(c);
  saucers(c);
  cube(c, 230, 700, 120);
  cube(c, 830, 700, 120);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  sillScene(c);
  saucers(c);
  // sunny side: a puddle and a sliver
  shape(c, () => ell(c, 230, 694, 150, 42), COL.water, 4);
  shape(c, () => ell(c, 180, 684, 36, 8), COL.drop, 0);
  c.save(); c.translate(262, 696); c.scale(1, 0.6); c.translate(-262, -696); cube(c, 262, 700, 54); c.restore();
  // shaded side: the cube hardly smaller, a little water
  shape(c, () => ell(c, 830, 702, 80, 18), COL.water, 4);
  cube(c, 830, 700, 106);
};

export const su_skyExploringSpace = cards("sci.sky.exploring-space.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1]);
