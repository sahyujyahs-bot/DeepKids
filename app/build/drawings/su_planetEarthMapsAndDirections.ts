import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, arrow, hand, write, cards } from "./flatKit";

// SET-UP CARDS · sci.planet-earth.maps-and-directions.L3. Tiles, squared paper, chits, a coin, a cushion.

const TILE_A = "#fbf3df", TILE_B = "#efdcb8", PAPER_LINE = "#9fc7e6", ADULT_SLEEVE = COL.pink;

// a floor of tiles seen from above, top-left corner (x, y), t px square
const tiles = (c: Ctx, x: number, y: number, cols: number, rows: number, t: number) => {
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) shape(c, () => c.rect(x + k * t, y + r * t, t, t), (r + k) % 2 ? TILE_B : TILE_A, 4);
};
// squared paper
const gridPaper = (c: Ctx, x: number, y: number, w: number, h: number, step: number, col: string = COL.paper) => {
  shadow(c, x + w / 2 + 14, y + h + 8, w / 2, 20);
  shape(c, () => c.rect(x, y, w, h), col, 6);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  for (let gx = x + step; gx < x + w; gx += step) line(c, [[gx, y], [gx, y + h]], 2.5, PAPER_LINE);
  for (let gy = y + step; gy < y + h; gy += step) line(c, [[x, gy], [x + w, gy]], 2.5, PAPER_LINE);
  c.restore();
  shape(c, () => c.rect(x, y, w, h), "rgba(0,0,0,0)", 6);
};
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.35, r, r * 0.4);
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.3, 0.5);
  shape(c, () => ell(c, x, y, r * 0.66, r * 0.66), "rgba(255,255,255,0.0)", 3.5);
};
// a small paper chit
const chit = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 10, h / 2 + 4, w / 2, 14);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), WHITE, 5);
  c.restore();
};
const pencil = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const hw = 20;
  shape(c, () => rrect(c, -len / 2, -hw, len, hw * 2, 6), COL.yellow);
  shade(c, () => rrect(c, -len / 2, -hw, len, hw * 2, 6), COL.orange, 0, 14, 0.55);
  shape(c, () => rrect(c, -len / 2 - 26, -hw, 30, hw * 2, 8), COL.pink);
  shape(c, () => polyP(c, [[len / 2, -hw], [len / 2 + 62, 0], [len / 2, hw]]), COL.woodDk);
  shape(c, () => polyP(c, [[len / 2 + 46, -6], [len / 2 + 62, 0], [len / 2 + 46, 6]]), COL.black, 3);
  c.restore();
};
// compass letters N E S W as strokes (single letters, not words) on a round badge
const LETTER: Record<string, number[][][]> = {
  N: [[[0, 1], [0, 0], [0.6, 1], [0.6, 0]]],
  E: [[[0.6, 0], [0, 0], [0, 1], [0.6, 1]], [[0, 0.5], [0.45, 0.5]]],
  S: [[[0.6, 0.12], [0.3, 0], [0, 0.2], [0.3, 0.5], [0.6, 0.8], [0.3, 1], [0, 0.88]]],
  W: [[[0, 0], [0.15, 1], [0.3, 0.4], [0.45, 1], [0.6, 0]]],
};
const badge = (c: Ctx, x: number, y: number, ch: string, lit = false) => {
  shadow(c, x + 8, y + 36, 40, 10);
  shape(c, () => ell(c, x, y, 44, 44), lit ? COL.yellow : WHITE, 6);
  const h = 44;
  c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.lineJoin = "round";
  LETTER[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x - 18 + u * h, y - 22 + v * h) : c.moveTo(x - 18 + u * h, y - 22 + v * h))); c.stroke(); });
};
const dotted = (c: Ctx, pts: number[][], w = 10) => { c.setLineDash([2, 24]); line(c, pts, w + 2, RED); c.setLineDash([]); };
// the room for the cushion cards: 6 x 5 tiles of 110 px, top-left (210, 130)
const RX = 210, RY = 130, RT = 110;
const tileAt = (col: number, row: number) => [RX + RT / 2 + RT * col, RY + RT / 2 + RT * row];
const cushion = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 10, y + s * 0.5, s * 0.6, s * 0.14);
  shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.22), COL.purple);
  shade(c, () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.22), "#6a4fa6", s * 0.12, s * 0.12, 0.55);
  shape(c, () => ell(c, x, y, s * 0.09, s * 0.09), COL.yellow, 4);
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) shape(c, () => ell(c, x + dx * s * 0.5, y + dy * s * 0.5, s * 0.08, s * 0.08), COL.yellow, 4);
};
const roomWithBadges = (c: Ctx, litN = false) => {
  ground(c);
  tiles(c, RX, RY, 6, 5, RT);
  badge(c, 540, 72, "N", litN); badge(c, 540, 748, "S"); badge(c, 128, 405, "W"); badge(c, 952, 405, "E");
};

// a hand with one finger pointing: the gripping hand with its first finger stretched out
const pointHand = (c: Ctx, x: number, y: number, an: number, s: number, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  hand(c, x, y, an, s, skin, sleeve);
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, 34, -30, 116, 18, 9), skin, 5);
  c.restore();
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // the closed bedroom door
  shadow(c, 250, 690, 230, 24);
  shape(c, () => rrect(c, 60, 50, 380, 640, 10), COL.brown);
  shade(c, () => rrect(c, 60, 50, 380, 640, 10), COL.soilDk, 40, 0, 0.5);
  shape(c, () => rrect(c, 110, 100, 130, 230, 8), COL.wood, 5);
  shape(c, () => rrect(c, 270, 100, 130, 230, 8), COL.wood, 5);
  shape(c, () => rrect(c, 110, 370, 130, 260, 8), COL.wood, 5);
  shape(c, () => rrect(c, 270, 370, 130, 260, 8), COL.wood, 5);
  shape(c, () => ell(c, 395, 380, 22, 22), COL.yellow, 5);
  // the squared paper with the room drawn from memory
  gridPaper(c, 290, 520, 680, 470, 34);
  c.save(); c.lineCap = "round"; c.lineJoin = "round";
  shape(c, () => c.rect(380, 580, 500, 340), "rgba(255,255,255,0.0)", 10);
  c.restore();
  line(c, [[580, 920], [680, 920]], 14, COL.paper); // gap in the wall: the door
  shape(c, () => rect(c, 400, 600, 190, 110), COL.pink, 6);
  shape(c, () => rect(c, 760, 600, 100, 160), COL.teal, 6);
  shape(c, () => ell(c, 700, 790, 45, 30), COL.orange, 6);
  // the pencil in her hand
  pencil(c, 818, 415, 2.2, 330);
  hand(c, 880, 330, 2.2, 1.6);
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => c.rect(x, y, w, h);

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, 1080, 150); line(c, [[0, 150], [1080, 150]], 8);
  tiles(c, 15, 150, 7, 6, 150);
  for (let i = 0; i < 4; i++) write(c, String(i + 1), 15 + 150 * i + 60, 175, 70, INK, 9);
  gridPaper(c, 60, 640, 460, 340, 57);
  for (let i = 0; i < 4; i++) { shape(c, () => rect(c, 60 + 57 * (i + 1), 640 + 57, 57, 57), COL.teal, 4); write(c, String(i + 1), 60 + 57 * (i + 1) + 20, 640 + 57 + 12, 32, INK, 5); }
  pointHand(c, 686, 579, -2.0, 2.3);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  tiles(c, 30, 20, 6, 3, 170);
  coin(c, 625, 275, 56);
  arrow(c, [[405, 275], [545, 275]], RED, 12);
  // the map, with the same chit and coin two squares apart; a finger counts along it
  gridPaper(c, 330, 590, 540, 360, 60);
  shape(c, () => rect(c, 450, 710, 60, 60), WHITE, 5);
  shape(c, () => ell(c, 600, 740, 22, 22), COL.yellow, 4);
  arrow(c, [[522, 740], [566, 740]], RED, 8);
  pointHand(c, 770, 935, -2.3, 1.7, SKIN.adult, ADULT_SLEEVE);
  // the chit being put on a tile
  chit(c, 290, 280, 170, 130, 0.15);
  hand(c, 191, 156, 0.9, 1.6, SKIN.adult, ADULT_SLEEVE);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  roomWithBadges(c);
  const [cx, cy] = tileAt(1, 3), [kx, ky] = tileAt(3, 0);
  coin(c, kx, ky, 34);
  cushion(c, cx, cy, 90);
  arrow(c, [[cx, cy - 55], [cx, ky], [kx - 50, ky]]);
  // chit A: 3 steps ahead; chit B: 2 steps to the side
  chit(c, 340, 900, 260, 170, -0.04); write(c, "3", 250, 865, 70, INK, 9); arrow(c, [[400, 960], [400, 850]]);
  chit(c, 740, 900, 260, 170, 0.04); write(c, "2", 650, 865, 70, INK, 9); arrow(c, [[730, 905], [830, 905]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  roomWithBadges(c, true);
  const [cx, cy] = tileAt(1, 3), [kx, ky] = tileAt(3, 0);
  cushion(c, cx, cy + 20, 150);
  // the boy seen from above, facing the N wall
  shadow(c, cx + 14, cy + 40, 70, 40);
  for (const s of [-1, 1]) shape(c, () => ell(c, cx + s * 22, cy + 78, 14, 24), INK, 0);
  shape(c, () => ell(c, cx, cy + 20, 70, 32), CLOTH.child);
  shade(c, () => ell(c, cx, cy + 20, 70, 32), CLOTH.childDk, 16, 12, 0.6);
  for (const s of [-1, 1]) { line(c, [[cx + s * 62, cy + 14], [cx + s * 56, cy - 40]], 36, INK); line(c, [[cx + s * 62, cy + 14], [cx + s * 56, cy - 40]], 24, CLOTH.child); }
  shape(c, () => ell(c, cx, cy - 6, 36, 36), CLOTH.hair, 6);
  shape(c, () => ell(c, cx - 56, cy - 52, 15, 15), SKIN.child, 5); shape(c, () => ell(c, cx + 56, cy - 52, 15, 15), SKIN.child, 5);
  chit(c, cx, cy - 70, 100, 70);
  write(c, "3", cx - 12, cy - 92, 40, INK, 6);
  dotted(c, [[cx, cy - 150], [cx, ky], [kx - 60, ky]]);
  arrow(c, [[kx - 90, ky], [kx - 56, ky]]);
  c.setLineDash([14, 14]); shape(c, () => ell(c, kx, ky, 40, 40), "rgba(0,0,0,0)", 6); c.setLineDash([]);
};

// setup.e3.0
const foot = (c: Ctx, x: number, y: number, L: number) => {
  const body = () => {
    c.moveTo(x + L * 0.08, y + 8);
    c.bezierCurveTo(x - 2, y - 18, x + L * 0.12, y - 36, x + L * 0.35, y - 34);
    c.bezierCurveTo(x + L * 0.55, y - 30, x + L * 0.62, y - 46, x + L * 0.8, y - 46);
    c.bezierCurveTo(x + L * 0.95, y - 44, x + L * 0.97, y + 30, x + L * 0.82, y + 46);
    c.bezierCurveTo(x + L * 0.6, y + 48, x + L * 0.3, y + 40, x + L * 0.12, y + 38);
    c.bezierCurveTo(x, y + 34, x - 2, y + 20, x + L * 0.08, y + 8);
    c.closePath();
  };
  shadow(c, x + L * 0.5 + 10, y + 40, L * 0.5, 22);
  [[0.9, -38, 17], [0.97, -16, 14], [0.98, 4, 13], [0.96, 22, 12], [0.9, 38, 11]].forEach(([u, v, r]) => shape(c, () => ell(c, x + L * u, y + v, r, r), SKIN.child, 5));
  shape(c, body, SKIN.child);
  shade(c, body, SKIN.childDk, 10, 16, 0.7);
};
const e3_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, 1080, 200);
  c.fillStyle = COL.wood; c.fillRect(0, 170, 1080, 60); line(c, [[0, 230], [1080, 230]], 8); line(c, [[0, 170], [1080, 170]], 5);
  tiles(c, 0, 230, 9, 7, 120);
  for (let i = 0; i < 4; i++) foot(c, 90 + i * 225, 470 + (i % 2) * 16, 225);
  for (let i = 0; i < 4; i++) write(c, String(i + 1), 90 + i * 225 + 90, 590, 80, INK, 10);
  arrow(c, [[130, 820], [930, 820]], RED, 14);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const ox = 130, oy = 870, W = 720, H = 480, th = Math.atan2(-H, W);
  gridPaper(c, ox, oy - H, W, H, 48, COL.sky);
  gridPaper(c, ox, oy - H / 2, W / 2, H / 2, 48, COL.paper);
  // the ruler along the corner-to-corner line, below it
  c.save(); c.translate(ox, oy); c.rotate(th);
  const L = 900;
  shape(c, () => rrect(c, -20, 0, L, 80, 6), COL.wood);
  shade(c, () => rrect(c, -20, 0, L, 80, 6), COL.woodDk, 0, 14, 0.5);
  for (let mm = 0; mm <= 20; mm++) { line(c, [[mm * 40, 0], [mm * 40, mm % 5 === 0 ? 34 : 22]], 3.5); line(c, [[mm * 40 + 20, 0], [mm * 40 + 20, 14]], 2.5); }
  for (const n of [0, 5, 10, 15, 20]) write(c, String(n), n * 40 - (n > 9 ? 16 : 8), 40, 30, INK, 5);
  c.restore();
  for (const [px, py] of [[ox + W / 2, oy - H / 2], [ox + W, oy - H]]) shape(c, () => ell(c, px, py, 14, 14), RED, 4);
  hand(c, 811, 684, -2.0, 1.9, SKIN.child, CLOTH.child, true);
};

export const su_planetEarthMapsAndDirections = cards("sci.planet-earth.maps-and-directions.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e3_0, e3_1]);
