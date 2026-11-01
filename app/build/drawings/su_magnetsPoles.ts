import type { Ctx } from "./core";
import { COL, INK, SKIN, CLOTH, WHITE, RED, BG, SH, arrow, cards, ell, ground, hand, line, rrect, polyP, shade, shadow, shape, write } from "./flatKit";

// MAGNETS · poles · set-up cards. Same objects on every card: a bar magnet with a red half and a blue half,
// a yellow plastic tiffin lid floating in a teal tub of water (seen from above), a fridge magnet that has
// stripes on its sticking face and a yellow back with a sun.

const POLE_N = COL.red, POLE_S = COL.blue;
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

// a bar magnet lying flat: blue half left, red half right (flip swaps them), centre (x, y)
const bar = (c: Ctx, x: number, y: number, len: number, th: number, rot = 0, flip = false) => {
  c.save(); c.translate(x, y); c.rotate(rot); if (flip) c.scale(-1, 1);
  const body = () => rrect(c, -len / 2, -th / 2, len, th, th * 0.22);
  shape(c, body, POLE_S, 6);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = POLE_N; c.fillRect(0, -th, len, th * 2);
  c.fillStyle = "rgba(43,35,64,0.22)"; c.fillRect(-len, th * 0.16, len * 2, th);
  c.fillStyle = "rgba(255,255,255,0.4)"; c.fillRect(-len / 2 + th * 0.2, -th * 0.38, len - th * 0.4, th * 0.1);
  c.restore();
  line(c, [[0, -th / 2], [0, th / 2]], 4);
  c.beginPath(); body(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.restore();
};
// the tub of water seen from above: teal rim, water inside
const tub = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  c.beginPath(); rrect(c, x0 + 14, y0 + 20, x1 - x0, y1 - y0, 60); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 60), COL.teal, 6);
  shade(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 60), COL.tealDk, 18, 18, 0.5);
  shape(c, () => rrect(c, x0 + 36, y0 + 36, x1 - x0 - 72, y1 - y0 - 72, 34), COL.water, 5);
  c.save(); c.beginPath(); rrect(c, x0 + 36, y0 + 36, x1 - x0 - 72, y1 - y0 - 72, 34); c.clip();
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.4; c.beginPath(); c.rect(x0 + 36, y1 - 36 - 40, x1 - x0, 60); c.fill(); c.globalAlpha = 1; c.restore();
};
// a floating lid with a bar magnet on it; ripples round it
const boat = (c: Ctx, x: number, y: number, r: number, mag: { len: number; th: number; rot?: number; flip?: boolean }) => {
  c.beginPath(); ell(c, x, y, r + 22, r + 22); c.strokeStyle = WHITE; c.globalAlpha = 0.6; c.lineWidth = 6; c.stroke(); c.globalAlpha = 1;
  shadow(c, x + r * 0.1, y + r * 0.12, r * 1.04, r * 1.0);
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), COL.woodDk, r * 0.22, r * 0.22, 0.6);
  c.beginPath(); ell(c, x, y, r * 0.82, r * 0.82); c.strokeStyle = COL.orange; c.lineWidth = 6; c.stroke();
  shadow(c, x + 8, y + mag.th * 0.5, mag.len * 0.5, mag.th * 0.28);
  bar(c, x, y, mag.len, mag.th, mag.rot ?? 0, mag.flip ?? false);
};
// a wooden ruler lying across, ticks along its lower edge; cm = pixels per centimetre
const ruler = (c: Ctx, x0: number, y0: number, x1: number, h: number, cm: number, zero: number, nums = false) => {
  c.beginPath(); c.rect(x0 + 8, y0 + 14, x1 - x0, h); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x0, y0, x1 - x0, h, 8), COL.wood, 6);
  c.save(); c.beginPath(); rrect(c, x0, y0, x1 - x0, h, 8); c.clip(); c.fillStyle = COL.woodDk; c.fillRect(x0, y0 + h * 0.82, x1 - x0, h); c.restore();
  for (let k = -20; k <= 40; k++) { const x = zero + k * cm; if (x < x0 + 14 || x > x1 - 14) continue; line(c, [[x, y0 + 4], [x, y0 + (k % 5 === 0 ? h * 0.5 : h * 0.34)]], k % 5 === 0 ? 5 : 3); if (nums && k >= 0 && k % 1 === 0) write(c, String(k), x - 9, y0 + h * 0.5, h * 0.3, INK, 4); }
};
// the sun on the back of a fridge magnet
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.orange, 5);
};
// a fridge magnet lying flat seen from above: stripes (the sticking face) or the yellow back with a sun
const slab = (c: Ctx, x: number, y: number, w: number, h: number, striped: boolean, sunAt?: number[]) => {
  const t = 22, face = () => rrect(c, x, y, w, h, 22);
  c.beginPath(); rrect(c, x + 14, y + t + 8, w, h, 22); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x, y + t, w, h, 22), striped ? COL.blueDk : COL.woodDk, 6);
  shape(c, face, striped ? COL.paper : COL.yellow, 6);
  c.save(); c.beginPath(); face(); c.clip();
  if (striped) for (let k = 0; k * 44 < w; k++) { c.fillStyle = k % 2 ? POLE_S : POLE_N; c.fillRect(x + k * 44, y, 44, h); }
  c.fillStyle = "rgba(43,35,64,0.18)"; c.fillRect(x, y + h * 0.86, w, h);
  c.restore();
  if (sunAt) sun(c, sunAt[0], sunAt[1], 34);
  c.beginPath(); face(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c); tub(c, 70, 110, 1010, 970);
  boat(c, 540, 540, 235, { len: 360, th: 130, rot: -0.38 });
  arrow(c, arcPts(540, 540, 330, 195, 255), RED, 14);
  arrow(c, arcPts(540, 540, 330, 15, 75), RED, 14);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); tub(c, 50, 110, 1030, 970);
  boat(c, 330, 680, 150, { len: 270, th: 96, rot: 0.04 });
  shadow(c, 790, 790, 150, 26);
  bar(c, 775, 680, 300, 100, 0, true);
  hand(c, 887, 680, Math.PI, 1.6);
  ruler(c, 20, 330, 1060, 74, 45, 100);
  c.fillStyle = RED; c.fillRect(468, 392, 160, 16); c.strokeStyle = INK; c.lineWidth = 4; c.strokeRect(468, 392, 160, 16);
  for (const x of [468, 628]) { c.setLineDash([14, 12]); line(c, [[x, 410], [x, 620]], 6, RED); c.setLineDash([]); }
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  tub(c, 40, 24, 1040, 520);
  boat(c, 280, 272, 125, { len: 210, th: 80 });
  boat(c, 800, 272, 125, { len: 210, th: 80, flip: true });
  const x0 = 407, x1 = 673;
  line(c, [[x0, 272], [x1, 272]], 6); line(c, [[x0, 246], [x0, 298]], 6); line(c, [[x1, 246], [x1, 298]], 6);
  write(c, "10 cm", 452, 180, 46, INK, 7);
  arrow(c, arcPts(800, 272, 165, 215, 325), RED, 12);
  tub(c, 40, 560, 1040, 1056);
  boat(c, 415, 808, 125, { len: 210, th: 80 });
  boat(c, 665, 808, 125, { len: 210, th: 80 });
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  slab(c, 70, 440, 520, 300, true);
  slab(c, 290, 410, 520, 300, false, [440, 560]);
  hand(c, 925, 560, Math.PI, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[800, 300], [420, 300]], RED, 16);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  ruler(c, 100, 70, 760, 100, 80, 150, true);
  line(c, [[150, 235], [150, 205]], 6, RED); line(c, [[550, 235], [550, 205]], 6, RED);
  line(c, [[150, 220], [550, 220]], 8, RED);
  write(c, "5 cm", 580, 196, 50, INK, 8);
  slab(c, 150, 480, 520, 300, true);
  slab(c, 260, 370, 300, 520, false, [410, 480]);
  arrow(c, arcPts(410, 630, 440, -35, 40), RED, 16);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 130);
  // the fridge door with the cut strip stuck on it
  shadow(c, 930, 640, 140, 22);
  shape(c, () => rrect(c, 790, 60, 250, 570, 34), COL.steel, 6);
  shade(c, () => rrect(c, 790, 60, 250, 570, 34), COL.steelDk, 24, 0, 0.5);
  shape(c, () => rrect(c, 812, 120, 24, 240, 12), COL.steelDk, 5);
  c.beginPath(); rrect(c, 846, 450, 180, 50, 10); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, 836, 436, 180, 50, 10), COL.yellow, 6);
  // the magnet sheet, yellow back up, a narrow strip being cut off along its lower edge
  slab(c, 300, 400, 440, 260, false, [500, 500]);
  shape(c, () => polyP(c, [[300, 614], [300, 646], [520, 628]]), BG, 5);
  // scissors, open, the lower blade in the cut
  c.save(); c.translate(500, 628); c.rotate(-0.02);
  shape(c, () => ell(c, -100, 56, 66, 44, -0.35), COL.red, 6);
  shape(c, () => ell(c, -100, 56, 34, 22, -0.35), BG, 5);
  shape(c, () => polyP(c, [[-30, 2], [200, 8], [214, 16], [-30, 26]]), COL.steel, 5);
  c.save(); c.rotate(-0.17);
  shape(c, () => ell(c, -100, -56, 66, 44, 0.35), COL.red, 6);
  shape(c, () => ell(c, -100, -56, 34, 22, 0.35), BG, 5);
  shape(c, () => polyP(c, [[-30, -22], [214, -10], [226, 0], [-30, 6]]), COL.steelIn, 5);
  c.restore();
  shape(c, () => ell(c, 0, 12, 14, 14), COL.steelDk, 5);
  c.restore();
  hand(c, 275, 650, -0.04, 1.5, SKIN.adult, CLOTH.adult);
  hand(c, 580, 270, Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult, true);
  c.restore();
};

export const su_magnetsPoles = cards("sci.magnets.poles.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
