import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards, leaf, glass } from "./flatKit";

// sci.materials.magnetic-materials.L3 · set-up cards. Same magnet (red bar, steel ends), steel nail and paper clip on every card.

const TABLE = "#e8c98f";
const tableTop = (c: Ctx, y: number) => { c.fillStyle = TABLE; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };
// the red bar magnet with steel ends, centred (x, y), w across, h long, rot like a canvas rotation
const magnet = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const body = () => rrect(c, -w / 2, -h / 2, w, h, 12);
  shape(c, body, COL.red, 6);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.steel; c.fillRect(-w, -h / 2, w * 2, h * 0.16); c.fillRect(-w, h / 2 - h * 0.16, w * 2, h * 0.16);
  c.fillStyle = "rgba(43,35,64,0.18)"; c.fillRect(w * 0.12, -h, w, h * 2); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  line(c, [[-w * 0.3, -h * 0.28], [-w * 0.3, h * 0.28]], Math.max(4, w * 0.08), "rgba(255,255,255,0.7)");
  c.restore();
};
// a paper clip, long axis along y, centre (x, y), length L, rot as a canvas rotation
const clip = (c: Ctx, x: number, y: number, L: number, rot = 0) => {
  const hw = L * 0.2, hl = L / 2;
  c.save(); c.translate(x, y); c.rotate(rot);
  const path = () => {
    c.beginPath(); c.moveTo(-hw, hl * 0.35); c.lineTo(-hw, -hl + hw); c.arc(0, -hl + hw, hw, Math.PI, Math.PI * 2); c.lineTo(hw, hl - hw * 0.8);
    c.arc(hw * 0.2, hl - hw * 0.8, hw * 0.8, 0, Math.PI); c.lineTo(-hw * 0.6, -hl + hw * 2.2); c.arc(-hw * 0.2, -hl + hw * 2.2, hw * 0.4, Math.PI, Math.PI * 2); c.lineTo(hw * 0.2, hl * 0.2);
  };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = Math.max(10, L * 0.075); c.stroke();
  path(); c.strokeStyle = COL.steelIn; c.lineWidth = Math.max(4, L * 0.03); c.stroke();
  c.restore();
};
// a steel nail lying along x: head at (x, y), tip at x + len
const nail = (c: Ctx, x: number, y: number, len: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => { c.moveTo(14, -16); c.lineTo(len - 60, -16); c.lineTo(len, 0); c.lineTo(len - 60, 16); c.lineTo(14, 16); c.closePath(); }, COL.steel, 6);
  shade(c, () => { c.moveTo(14, -16); c.lineTo(len - 60, -16); c.lineTo(len, 0); c.lineTo(len - 60, 16); c.lineTo(14, 16); c.closePath(); }, COL.steelDk, 0, 7, 0.6);
  shape(c, () => rrect(c, -8, -34, 26, 68, 8), COL.steel, 6);
  line(c, [[30, -5], [len - 70, -5]], 4, WHITE);
  c.restore();
};
const pencil = (c: Ctx, x: number, y: number, len: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, 0, -14, len - 56, 28, 6), COL.yellow, 5);
  shape(c, () => polyP(c, [[len - 56, -14], [len, 0], [len - 56, 14]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len - 14, -3.5], [len, 0], [len - 14, 3.5]]), INK, 0);
  shape(c, () => rrect(c, -22, -14, 24, 28, 6), COL.pink, 5);
  c.restore();
};
const coin = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 6, y + r * 0.7, r, r * 0.25); shape(c, () => ell(c, x, y, r, r), COL.steel, 6); shape(c, () => ell(c, x, y, r * 0.66, r * 0.66), COL.steelIn, 4); };
const eraser = (c: Ctx, x: number, y: number) => { shadow(c, x + 6, y + 40, 70, 14); shape(c, () => rrect(c, x - 70, y - 32, 140, 64, 12), COL.pink, 6); shape(c, () => rrect(c, x - 70, y - 32, 56, 64, 12), COL.blue, 6); };
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - 60 * s, y], [x - 15 * s, y + 50 * s], [x + 65 * s, y - 55 * s]], 22 * s, COL.green);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - 50 * s, y - 50 * s], [x + 50 * s, y + 50 * s]], 22 * s, RED); line(c, [[x + 50 * s, y - 50 * s], [x - 50 * s, y + 50 * s]], 22 * s, RED); };
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 14, y + h / 2 + 8, w * 0.52, 22); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.paper, 6); shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), "#e4dccb", 10, 10, 0.5); };

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, TABLE);
  sheet(c, 270, 780, 400, 380); sheet(c, 810, 780, 400, 380);
  tick(c, 270, 780, 1.6); cross(c, 810, 780, 1.7);
  coin(c, 690, 120, 56); eraser(c, 860, 100); pencil(c, 640, 240, 330, 0.05); clip(c, 960, 380, 130, 0.5);
  nail(c, 100, 254, 340, 0);
  hand(c, 270, 100, Math.PI / 2, 2.2);
  arrow(c, [[270, 380], [270, 540]]);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c, TABLE);
  tableTop(c, 640);
  shadow(c, 680, 650, 340, 22);
  nail(c, 400, 604, 560);
  magnet(c, 340, 500, 100, 260, 0);
  hand(c, 190, 500, 0, 2.2);
  // stopwatch with 3
  const x = 780, y = 270, r = 150;
  shape(c, () => rrect(c, x - 24, y - r - 40, 48, 44, 6), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 4);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.8, -Math.PI / 2, 0); c.closePath(); c.fillStyle = RED; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8]], 4); }
  line(c, [[x, y], [x + r * 0.7, y]], 7);
  shape(c, () => ell(c, x, y, 11, 11), INK, 0);
  write(c, "3", x + 28, y + 28, 46, INK, 8);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, TABLE);
  // two piles, left
  shadow(c, 190, 300, 170, 110); shadow(c, 190, 790, 170, 110);
  nail(c, 80, 250, 200, 0.3); nail(c, 100, 330, 190, -0.25); clip(c, 270, 210, 110, 0.7); clip(c, 290, 330, 110, -0.6);
  tick(c, 200, 140, 0.55);
  coin(c, 130, 740, 52); eraser(c, 270, 800); pencil(c, 70, 880, 260, -0.15); leaf(c, 250, 700, 130, -0.6);
  cross(c, 200, 600, 0.55);
  // the table of results
  const px = 440, py = 110, pw = 580, ph = 700;
  sheet(c, px + pw / 2, py + ph / 2, pw, ph);
  line(c, [[px, py + 130], [px + pw, py + 130]], 6); line(c, [[px + pw / 2, py], [px + pw / 2, py + ph]], 6);
  for (let k = 1; k < 4; k++) line(c, [[px, py + 130 + k * 142], [px + pw, py + 130 + k * 142]], 5);
  tick(c, px + pw * 0.25, py + 65, 0.8); cross(c, px + pw * 0.75, py + 65, 0.8);
  tick(c, px + pw * 0.25, py + 200, 0.6); cross(c, px + pw * 0.75, py + 342, 0.6); tick(c, px + pw * 0.25, py + 484, 0.6);
  pencil(c, 980 + Math.cos(-2.03) * 30, 1000 + Math.sin(-2.03) * 30, 262, -2.03);
  hand(c, 980, 1000, -2.03, 1.9);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, TABLE);
  tableTop(c, 800);
  // side view: the clip lies on the table, ONE sheet of paper is laid over it (a bump), the magnet comes down from above
  clip(c, 540, 752, 220, Math.PI / 2);
  const pts: number[][] = [];
  for (let x = 40; x <= 1040; x += 20) pts.push([x, 792 - 108 * Math.exp(-(((x - 540) / 120) ** 2))]);
  line(c, pts, 24, INK); line(c, pts, 12, COL.paper);
  shadow(c, 540, 830, 420, 20);
  magnet(c, 540, 480, 130, 340, Math.PI / 2);
  hand(c, 540, 326, Math.PI / 2, 2.2);
  arrow(c, [[860, 400], [860, 600]]);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, TABLE);
  tableTop(c, 800);
  // two blocks hold the stack of paper up; the clip clings under it
  shape(c, () => rrect(c, 200, 500, 130, 300, 6), COL.brown, 6);
  shape(c, () => rrect(c, 750, 500, 130, 300, 6), COL.brown, 6);
  shadow(c, 540, 810, 380, 20);
  shape(c, () => rrect(c, 220, 380, 640, 130, 6), COL.paper, 6);
  for (let k = 1; k < 12; k++) line(c, [[224, 380 + k * 130 / 12], [856, 380 + k * 130 / 12]], 2.5, "#c9c0ad");
  shape(c, () => rrect(c, 220, 380, 640, 130, 6), "rgba(0,0,0,0)", 6);
  clip(c, 540, 620, 230, 0);
  magnet(c, 540, 300, 100, 260, Math.PI / 2);
  // brace and the count
  line(c, [[170, 385], [150, 385], [150, 505], [170, 505]], 6);
  write(c, "12", 20, 410, 80, INK, 9);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, TABLE);
  tableTop(c, 900);
  c.fillStyle = TABLE;
  glass(c, 480, 920, 400, 600, 0.8);
  clip(c, 628, 640, 170, 0.12);
  magnet(c, 720, 640, 90, 240, 0);
  hand(c, 874, 640, Math.PI, 2.2);
  arrow(c, [[560, 820], [560, 560]]);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, COL.sky);
  // a fridge door
  shape(c, () => rrect(c, 40, -20, 1000, 1120, 20), COL.steelIn, 6);
  shape(c, () => rrect(c, 80, 140, 30, 500, 15), COL.steelDk, 6);
  magnet(c, 540, 190, 110, 380, Math.PI / 2);
  for (let k = 0; k < 4; k++) clip(c, 540, 340 + k * 160, 220, 0);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  nail(c, 400, 330, 520);
  for (let k = 0; k < 3; k++) clip(c, 880, 450 + k * 170, 230, 0);
  magnet(c, 345, 330, 110, 300, 0);
  hand(c, 190, 330, 0, 2.2);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  tableTop(c, 860);
  // the magnet is pulled away to the left; the nail hangs free and its clips fall in a heap
  magnet(c, 245, 270, 110, 300, 0);
  hand(c, 90, 270, 0, 2.2);
  arrow(c, [[610, 150], [440, 150]]);
  nail(c, 746, 90, 340, Math.PI / 2);
  hand(c, 900, 270, Math.PI, 2.2);
  shadow(c, 760, 960, 200, 24);
  line(c, [[700, 470], [700, 510]], 5, COL.steelDk); line(c, [[800, 560], [800, 600]], 5, COL.steelDk);
  clip(c, 746, 520, 170, 0.3); clip(c, 790, 700, 170, -0.8);
  clip(c, 700, 950, 170, 1.4); clip(c, 840, 970, 170, 0.3); clip(c, 770, 920, 170, -0.6);
};

export const su_materialsMagneticMaterials = cards("sci.materials.magnetic-materials.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
