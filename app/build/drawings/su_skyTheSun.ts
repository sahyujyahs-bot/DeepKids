import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, glass, ground, hand, line, person, plate, polyP, rrect, shade, shadow, shape, shine } from "./flatKit";
import type { Ctx } from "./core";

// sci.sky.the-sun.L3 set-up cards: the Sun Dot (magnifying glass, black and white paper) and ice on black / white paper.
const BLACK = "#2c2836", BLACK_EDGE = "#15121f", SUN = "rgba(255,211,77,0.36)";

const floor = (c: Ctx) => {
  ground(c);
  c.globalAlpha = 0.09;
  for (let y = 150, r = 0; y < 1080; y += 190, r++) { line(c, [[0, y], [1080, y]], 5); for (let x = (r % 2) * 150; x < 1080; x += 300) line(c, [[x, y], [x, y + 190]], 5); }
  c.globalAlpha = 1;
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 40), y + Math.sin(a) * (r + 40)]], 12, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 7);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.45);
};
// a sheet of paper lying on the surface, as a four-point shape with a little thickness
const sheet = (c: Ctx, p: number[][], col: string, edge: string) => {
  shape(c, () => polyP(c, p.map(([x, y]) => [x, y + 10])), edge, 5);
  shape(c, () => polyP(c, p), col, 5);
  if (col === BLACK) line(c, [p[0], p[1]], 4, "#6d6680");
};
// a steel plate with a sheet on it, centre (x, y)
const sheetOnPlate = (c: Ctx, x: number, y: number, rx: number, ry: number, black: boolean) => {
  plate(c, x, y, rx, ry);
  sheet(c, [[x - rx * 0.5, y - ry * 0.5], [x + rx * 0.5, y - ry * 0.5], [x + rx * 0.64, y + ry * 0.5], [x - rx * 0.64, y + ry * 0.5]], black ? BLACK : COL.paper, black ? BLACK_EDGE : COL.cloth);
};
const sunglasses = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - h * 0.38 - head * 1.05, r = head * 0.3;
  line(c, [[x - head * 0.35, hy + head * 0.12], [x + head * 0.35, hy + head * 0.12]], 5);
  for (const s of [-1, 1]) { shape(c, () => rrect(c, x + s * head * 0.35 - r, hy + head * 0.12 - r * 0.8, r * 2, r * 1.7, r * 0.6), "#1c1830", 4); line(c, [[x + s * head * 0.35 - r * 0.5, hy - head * 0.05], [x + s * head * 0.35 - r * 0.1, hy - head * 0.05]], 3, "#8d86a8"); }
};
const dropWater = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.water, 5);
  c.beginPath(); ell(c, x - rx * 0.3, y - ry * 0.25, rx * 0.35, ry * 0.2); c.fillStyle = COL.drop; c.fill();
};

// the magnifying glass held by a grown-up hand: lens centre (cx, cy), handle pointing away along (dx, dy)
const LENS_RX = 170, LENS_RY = 62;
const magnifier = (c: Ctx, cx: number, cy: number, dx: number, dy: number, rx = LENS_RX, ry = LENS_RY) => {
  const ex = cx + dx * rx * 0.9, ey = cy + dy * ry * 0.9, hx = ex + dx * 340, hy = ey + dy * 340;
  line(c, [[ex, ey], [hx, hy]], 38, INK); line(c, [[ex, ey], [hx, hy]], 26, COL.brown);
  hand(c, ex + dx * 271, ey + dy * 271, Math.atan2(-dy, -dx), 1.3, SKIN.adult, CLOTH.adult);
  shape(c, () => ell(c, cx, cy, rx, ry), "#4a4458", 7);
  shape(c, () => ell(c, cx, cy, rx - 16, ry - 12), COL.glass, 4);
  shine(c, [[cx - rx * 0.6, cy - ry * 0.1], [cx - rx * 0.2, cy - ry * 0.45]], 9);
};
// sunlight spreading from the sun down to the glass
const beam = (c: Ctx, cx: number, cy: number) => {
  shape(c, () => polyP(c, [[cx - 70, 140], [cx + 70, 140], [cx + LENS_RX * 0.95, cy], [cx - LENS_RX * 0.95, cy]]), SUN, 0);
  for (const k of [-0.6, 0, 0.6]) line(c, [[cx + k * 60, 150], [cx + k * LENS_RX * 0.85, cy - 10]], 5, "rgba(255,211,77,0.8)");
};
// light going through the glass and meeting the paper at (cx, sy), spread rx wide
const cone = (c: Ctx, cx: number, cy: number, sy: number, rx: number) => {
  shape(c, () => polyP(c, [[cx - LENS_RX * 0.9, cy + 20], [cx + LENS_RX * 0.9, cy + 20], [cx + rx, sy], [cx - rx, sy]]), SUN, 0);
};
const smoke = (c: Ctx, x: number, y: number, up: number) => {
  const p = [[x, y], [x + 22, y - up * 0.25], [x - 24, y - up * 0.5], [x + 20, y - up * 0.75], [x - 8, y - up]];
  for (const [w, col] of [[26, "#cfc9d6"], [11, "#f3eff8"]] as [number, string][]) { c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length - 1; i++) c.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2); c.lineTo(p[4][0], p[4][1]); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
};
const dot = (c: Ctx, x: number, y: number) => {
  c.beginPath(); ell(c, x, y, 40, 20); c.fillStyle = "rgba(255,226,120,0.6)"; c.fill();
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * 26, y + Math.sin(a) * 13], [x + Math.cos(a) * 52, y + Math.sin(a) * 26]], 5, "#fff3b0"); }
  shape(c, () => ell(c, x, y, 17, 9), WHITE, 3);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  floor(c); sun(c, 110, 110, 62);
  person(c, 230, 770, 640, { adult: true, sit: true }); sunglasses(c, 230, 770, 640);
  person(c, 640, 790, 520, { sit: true }); sunglasses(c, 640, 790, 520);
  sheetOnPlate(c, 420, 890, 350, 140, true);
  glass(c, 910, 1000, 200, 300, 0.8);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  floor(c); sun(c, 600, 70, 52);
  sheetOnPlate(c, 600, 830, 420, 140, true);
  cone(c, 600, 520, 815, 150);
  c.beginPath(); ell(c, 600, 815, 160, 56); c.fillStyle = "rgba(255,226,120,0.6)"; c.fill();
  c.beginPath(); ell(c, 600, 815, 110, 38); c.fillStyle = "rgba(255,244,190,0.7)"; c.fill();
  beam(c, 600, 520);
  magnifier(c, 600, 520, -0.84, 0.54);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  floor(c); sun(c, 600, 70, 52);
  sheetOnPlate(c, 600, 830, 420, 140, true);
  cone(c, 600, 300, 815, 8);
  smoke(c, 600, 800, 200);
  dot(c, 600, 815);
  beam(c, 600, 300);
  magnifier(c, 600, 300, -0.84, 0.54);
};
// setup.e1.3
const e1_3 = (c: Ctx) => {
  floor(c); sun(c, 810, 70, 52);
  sheetOnPlate(c, 270, 830, 240, 130, true);
  sheetOnPlate(c, 810, 830, 240, 130, false);
  for (const [x, y] of [[190, 800], [290, 840], [340, 790]]) { shape(c, () => ell(c, x, y, 26, 14), "#6a4128", 4); shape(c, () => ell(c, x, y, 15, 8), COL.steelIn, 0); }
  cone(c, 810, 330, 815, 8);
  dot(c, 810, 815);
  beam(c, 810, 330);
  magnifier(c, 810, 330, -0.84, -0.54);
};

// ice on black paper and on white paper, side by side
const iceCube = (c: Ctx, x: number, y: number, s: number) => {
  const hg = s * 1.1, ty = y - hg, ft = s * 0.4;
  shadow(c, x + s * 0.3, y + ft, s * 1.3, s * 0.35);
  shape(c, () => polyP(c, [[x - s, ty], [x, ty + ft], [x, y + ft], [x - s, y]]), "#cfe8f7", 6);
  shape(c, () => polyP(c, [[x, ty + ft], [x + s, ty], [x + s, y], [x, y + ft]]), "#9fcbe6", 6);
  shape(c, () => polyP(c, [[x - s, ty], [x, ty - ft], [x + s, ty], [x, ty + ft]]), "#eaf6ff", 6);
  shine(c, [[x - s * 0.7, ty + s * 0.2], [x - s * 0.7, y - s * 0.25]], Math.max(5, s * 0.1));
};
const iceScene = (c: Ctx, cy: number, blackS: number, whiteS: number, puddleB: number, puddleW: number) => {
  floor(c); sun(c, 540, 70, 52);
  const L = 270, R = 810;
  sheetOnPlate(c, L, cy, 262, 150, true); sheetOnPlate(c, R, cy, 262, 150, false);
  if (puddleB) dropWater(c, L, cy + 10, puddleB, puddleB * 0.36);
  if (puddleW) dropWater(c, R, cy + 10, puddleW, puddleW * 0.36);
  iceCube(c, L, cy + 30, blackS); iceCube(c, R, cy + 30, whiteS);
};
// setup.e2.0
const e2_0 = (c: Ctx) => iceScene(c, 600, 110, 110, 0, 0);
// setup.e2.1
const e2_1 = (c: Ctx) => iceScene(c, 600, 40, 110, 150, 46);
// setup.e2.2
const e2_2 = (c: Ctx) => {
  iceScene(c, 470, 40, 110, 150, 46);
  // a child's hand touches the front edge of each paper
  for (const [tx, an] of [[255, -1.35], [825, -1.8]] as [number, number][]) {
    const ty = 470 + 70, s = 1.7;
    hand(c, tx - Math.cos(an) * 98 * s, ty - Math.sin(an) * 98 * s, an, s, SKIN.child, CLOTH.child, true);
  }
};

export const su_skyTheSun = cards("sci.sky.the-sun.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
