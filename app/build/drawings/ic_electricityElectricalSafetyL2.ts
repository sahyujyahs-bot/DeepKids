import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, SH, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, person, write, cards } from "./flatKit";

// ELECTRICAL SAFETY L2 · set-up cards for the dry-hands test and the spill test, then the flow cards
// and the things a child can see: a plug, a socket, a cut wire, cells.

const TILE = "#e6ecf0", TILE_LINE = "#b7c3cc", BRASS = "#c9a24a", CREAM = "#f3efe6", PINK_DK = "#d77a96";

// ---------------------------------------------------------------- scenery
// a wooden table top from y down (draw the ground first)
const table = (c: Ctx, y: number) => { shape(c, () => c.rect(-10, y, D + 20, D - y + 20), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(0, y + 4, D, 26); };
// a tiled floor filling the card
const tiles = (c: Ctx) => { ground(c, TILE); for (let x = 0; x <= D; x += 180) line(c, [[x, 0], [x, D]], 4, TILE_LINE); for (let y = 0; y <= D; y += 180) line(c, [[0, y], [D, y]], 4, TILE_LINE); };
// a wobbly flat shape (a puddle, a damp patch), centre (x, y)
const blobPath = (c: Ctx, x: number, y: number, rx: number, ry: number, seed: number) => {
  const r = rnd(seed), n = 16, p: number[][] = [];
  for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2, k = 0.82 + r() * 0.3; p.push([x + Math.cos(an) * rx * k, y + Math.sin(an) * ry * k]); }
  c.moveTo((p[0][0] + p[n - 1][0]) / 2, (p[0][1] + p[n - 1][1]) / 2);
  for (let i = 0; i < n; i++) { const q = p[(i + 1) % n]; c.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + q[0]) / 2, (p[i][1] + q[1]) / 2); }
  c.closePath();
};
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number, seed = 3) => { shape(c, () => blobPath(c, x, y, rx, ry, seed), COL.water, 5); shine(c, [[x - rx * 0.5, y - ry * 0.3], [x - rx * 0.1, y - ry * 0.45]], 8); };
// a sheet of paper (newspaper = grey text lines), centre (x, y)
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, news = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => c.rect(-w / 2 + 14, -h / 2 + 14, w, h), SH, 0);
  shape(c, () => c.rect(-w / 2, -h / 2, w, h), news ? COL.cloth : COL.paper, 6);
  if (news) { shape(c, () => c.rect(-w / 2 + 30, -h / 2 + 26, w * 0.5, 34), COL.greyDk, 0); for (let i = 0; i < 2; i++) for (let k = 0; k < Math.floor((h - 110) / 30); k++) line(c, [[-w / 2 + 30 + i * (w / 2 - 20), -h / 2 + 100 + k * 30], [-w / 2 + w / 2 - 30 + i * (w / 2 - 20), -h / 2 + 100 + k * 30]], 6, COL.grey); }
  c.restore();
};
// a folded towel
const towel = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x + 12, y + 14, w, h, 24), SH, 0);
  shape(c, () => rrect(c, x, y, w, h, 24), COL.pink);
  shade(c, () => rrect(c, x, y, w, h, 24), PINK_DK, w * 0.25, 0, 0.4);
  for (let k = 0; k < 3; k++) line(c, [[x + 30, y + h * 0.3 + k * 26], [x + w - 30, y + h * 0.3 + k * 26]], 8, WHITE);
  line(c, [[x + 20, y + h * 0.52], [x + w - 20, y + h * 0.52]], 4, INK);
};
// a steel tumbler, bottom centre (x, y), with water in it
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), COL.water, 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.25]], 8);
};
// the paper drawing of an extension board (the stand-in for the real thing), centre (x, y)
const boardPaper = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  paper(c, 0, 0, 360, 250, -0.06);
  shape(c, () => rrect(c, -140, -70, 280, 120, 16), WHITE, 5);
  for (let i = 0; i < 3; i++) { const sx = -90 + i * 90; shape(c, () => ell(c, sx, -30, 11, 13), INK, 0); shape(c, () => ell(c, sx - 20, 8, 8, 10), INK, 0); shape(c, () => ell(c, sx + 20, 8, 8, 10), INK, 0); }
  line(c, [[140, -10], [180, -10], [200, 50], [160, 95]], 6, INK);
  c.restore();
};
// a three-pin plug with its pins up, centre of the body (x, y)
const plug = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  line(c, [[0, 110], [0, 220], [-30, 330], [10, 470]], 34, INK); line(c, [[0, 110], [0, 220], [-30, 330], [10, 470]], 24, COL.cloth);
  for (const [px, pw, ph] of [[-24, 48, 100], [-100, 40, 80], [60, 40, 80]]) { shape(c, () => rrect(c, px, -90 - ph, pw, ph + 20, 12), BRASS, 6); shade(c, () => rrect(c, px, -90 - ph, pw, ph + 20, 12), COL.woodDk, pw * 0.4, 0, 0.5); }
  shape(c, () => rrect(c, -130, -95, 260, 215, 40), CREAM);
  shade(c, () => rrect(c, -130, -95, 260, 215, 40), COL.grey, 60, 0, 0.45);
  line(c, [[-70, 60], [70, 60]], 5, INK);
  c.restore();
};
// a white switch board with two switches and a three-hole socket, centre (x, y)
const switchBoard = (c: Ctx, x: number, y: number, w: number, h: number, cross = false) => {
  shape(c, () => rrect(c, x - w / 2 + 14, y - h / 2 + 16, w, h, 28), SH, 0);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 28), WHITE);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 28), "#dcd8d0", w * 0.12, 0, 0.5);
  for (let i = 0; i < 2; i++) { const sx = x - w * 0.36 + i * w * 0.2, sw = w * 0.14, sh = h * 0.5; shape(c, () => rrect(c, sx - sw / 2, y - sh / 2, sw, sh, 12), CREAM, 5); shape(c, () => rrect(c, sx - sw / 2 + 6, y - sh / 2 + 6, sw - 12, sh / 2 - 8, 8), COL.cloth, 3); shape(c, () => ell(c, sx, y + sh * 0.3, sw * 0.12, sw * 0.12), RED, 0); }
  const cx = x + w * 0.22, r = w * 0.065;
  shape(c, () => ell(c, cx, y, w * 0.24, h * 0.38), CREAM, 5);
  shape(c, () => ell(c, cx, y - h * 0.16, r * 1.1, r * 1.3), INK, 0);
  shape(c, () => ell(c, cx - w * 0.1, y + h * 0.1, r, r * 1.15), INK, 0); shape(c, () => ell(c, cx + w * 0.1, y + h * 0.1, r, r * 1.15), INK, 0);
  if (cross) { line(c, [[x - w / 2 + 20, y - h / 2 + 20], [x + w / 2 - 20, y + h / 2 - 20]], 14, RED); line(c, [[x + w / 2 - 20, y - h / 2 + 20], [x - w / 2 + 20, y + h / 2 - 20]], 14, RED); }
};
// a round cell standing up, bottom centre (x, y)
const cell = (c: Ctx, x: number, y: number, r: number, h: number) => {
  const body = () => { c.moveTo(x - r, y - h); c.lineTo(x + r, y - h); c.lineTo(x + r, y); c.bezierCurveTo(x + r, y + r * 0.45, x - r, y + r * 0.45, x - r, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.7, 0);
  shape(c, () => c.rect(x - r, y - h * 0.72, r * 2, h * 0.5), COL.orange, 0);
  shade(c, () => c.rect(x - r, y - h * 0.72, r * 2, h * 0.5), COL.red, r * 0.7, 0);
  line(c, [[x - r, y - h * 0.72], [x + r, y - h * 0.72]], 4, INK); line(c, [[x - r, y - h * 0.22], [x + r, y - h * 0.22]], 4, INK);
  shape(c, () => ell(c, x, y - h, r, r * 0.3), COL.steelIn, 5);
  shape(c, () => rrect(c, x - r * 0.3, y - h - r * 0.32, r * 0.6, r * 0.3, 6), COL.steelIn, 4);
  write(c, "+", x - r * 0.4, y - h * 0.62, r * 0.9, INK, 6);
};
// a damp handprint on paper, palm centre (x, y), with a pencil line drawn round it
const printOf = (c: Ctx, x: number, y: number, s: number, outline: boolean) => {
  const parts: number[][] = [[0, 0, 70, 80, 0], [-62, -95, 20, 48, 0.3], [-22, -118, 20, 56, 0.08], [22, -118, 20, 56, -0.08], [62, -92, 20, 46, -0.3], [-98, -10, 22, 46, -0.9]];
  c.globalAlpha = 0.55; parts.forEach(([px, py, rx, ry, rot]) => shape(c, () => ell(c, x + px * s, y + py * s, rx * s, ry * s, rot), COL.waterDk, 0)); c.globalAlpha = 1;
  if (outline) { c.setLineDash([10, 8]); parts.forEach(([px, py, rx, ry, rot]) => { c.beginPath(); ell(c, x + px * s, y + py * s, rx * s + 8, ry * s + 8, rot); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }); c.setLineDash([]); }
};
// where a person()'s wrist lands, for putting something in the hand
const wristAt = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number]) => { const sh = y - h * 0.74, sx = x + side * h * 0.11, ex = sx + Math.cos(a1) * h * 0.17, ey = sh + h * 0.03 + Math.sin(a1) * h * 0.17; return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16]; };

// ---------------------------------------------------------------- set-up cards: the dry hands test
// 1. bowl of water, towel and newspaper on the table
const s_e1_0 = (c: Ctx) => {
  ground(c); table(c, 420);
  paper(c, 560, 830, 620, 330, -0.04, true);
  towel(c, 640, 440, 360, 180);
  bowl(c, 300, 500, 190, COL.water); shine(c, [[200, 505], [280, 512]], 8);
};
// 2. a hand dipping into the bowl for a count of 3
const s_e1_1 = (c: Ctx) => {
  ground(c); table(c, 560);
  bowl(c, 540, 600, 270, COL.water);
  hand(c, 540, 430, Math.PI / 2, 2.2);
  const body = () => { c.moveTo(270, 600); c.bezierCurveTo(297, 802, 783, 802, 810, 600); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 94, -13);
  shape(c, () => ell(c, 540, 600, 270, 54), COL.water, 5);
  c.beginPath(); ell(c, 540, 600, 170, 32); c.strokeStyle = COL.drop; c.lineWidth = 5; c.stroke();
  c.beginPath(); ell(c, 540, 600, 105, 18); c.stroke();
  arrow(c, [[860, 230], [860, 470]]);
  write(c, "3", 160, 220, 150, INK, 12);
};
// 3. three ways to dry: shake, wipe on the frock, rub with a towel
const s_e1_2 = (c: Ctx) => {
  ground(c);
  line(c, [[360, 60], [360, 1020]], 6, INK); line(c, [[720, 60], [720, 1020]], 6, INK);
  // shake
  hand(c, 180, 360, Math.PI / 2, 1.3);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(180, 480, 150, s > 0 ? -0.4 : Math.PI - 0.4, s > 0 ? 0.4 : Math.PI + 0.4); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.beginPath(); c.arc(180, 480, 190, s > 0 ? -0.3 : Math.PI - 0.3, s > 0 ? 0.3 : Math.PI + 0.3); c.stroke(); }
  for (const [dx, dy] of [[60, 640], [120, 700], [250, 660], [300, 720], [170, 760]]) shape(c, () => ell(c, dx, dy, 10, 14), COL.water, 3);
  // wipe on the frock
  shape(c, () => { c.moveTo(380, 1080); c.lineTo(400, 560); c.quadraticCurveTo(540, 520, 680, 560); c.lineTo(700, 1080); c.closePath(); }, CLOTH.child, 6);
  shade(c, () => { c.moveTo(380, 1080); c.lineTo(400, 560); c.quadraticCurveTo(540, 520, 680, 560); c.lineTo(700, 1080); c.closePath(); }, CLOTH.childDk, 70, 0);
  hand(c, 420, 420, Math.PI * 0.42, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[640, 640], [640, 820]]);
  // towel
  towel(c, 760, 520, 300, 200);
  hand(c, 820, 350, Math.PI * 0.35, 1.3);
};
// 4. the hand lifts off the newspaper; damp prints, a pencil line round them
const s_e1_3 = (c: Ctx) => {
  ground(c); table(c, 300);
  paper(c, 540, 720, 740, 440, 0, true);
  printOf(c, 540, 780, 1.4, true);
  hand(c, 300, 330, 0.15, 2, SKIN.child, CLOTH.child, true);
  arrow(c, [[920, 560], [920, 320]]);
};

// ---------------------------------------------------------------- set-up cards: the spill test
// 1. the paper board on the floor, two hand spans from the tumbler
const s_e2_0 = (c: Ctx) => {
  tiles(c);
  boardPaper(c, 250, 560, 1.1);
  hand(c, 520, 720, 0, 1.15, SKIN.child, CLOTH.child, true); hand(c, 720, 720, 0, 1.15, SKIN.child, CLOTH.child, true);
  shadow(c, 930, 826, 110, 24); tumbler(c, 910, 820, 170, 260);
};
// 2. the elbow knocks the tumbler over, water runs toward the paper board
const s_e2_1 = (c: Ctx) => {
  tiles(c);
  puddle(c, 520, 700, 250, 90, 5);
  boardPaper(c, 230, 620, 1);
  c.save(); c.translate(700, 640); c.rotate(-1.25); tumbler(c, 0, 0, 170, 260); c.restore();
  line(c, [[1040, 120], [840, 400], [660, 520]], 72, INK); line(c, [[1040, 120], [840, 400], [660, 520]], 60, CLOTH.child);
  shape(c, () => ell(c, 650, 528, 40, 40), SKIN.child, 6);
  arrow(c, [[900, 300], [760, 470]]);
};
// 3. measure the puddle in hand spans
const s_e2_2 = (c: Ctx) => {
  tiles(c);
  puddle(c, 500, 600, 420, 140, 8);
  for (let i = 0; i < 3; i++) { hand(c, 190 + i * 265, 600, 0, 1.5, SKIN.child, CLOTH.child, true); write(c, String(i + 1), 160 + i * 265, 310, 110, INK, 10); }
  arrow(c, [[90, 850], [900, 850]]);
};

// ---------------------------------------------------------------- flow cards
const f_e1 = (c: Ctx) => {
  ground(c);
  person(c, 330, 1040, 760, { armR: [0.2, 0.55], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  table(c, 600);
  paper(c, 700, 740, 520, 300, -0.03, true);
  printOf(c, 620, 790, 1, false); printOf(c, 820, 760, 1, true);
  bowl(c, 900, 540, 130, COL.water); towel(c, 560, 470, 230, 120);
};
const f_e2 = (c: Ctx) => {
  tiles(c);
  puddle(c, 520, 660, 390, 110, 11);
  boardPaper(c, 220, 620, 1);
  c.save(); c.translate(900, 620); c.rotate(-1.3); tumbler(c, 0, 0, 170, 260); c.restore();
  arrow(c, [[760, 560], [420, 600]]);
};
const f_a2 = (c: Ctx) => {
  ground(c);
  const [wx, wy] = wristAt(360, 1040, 900, 1, [0.1, -0.6]);
  line(c, [[wx + 20, wy + 70], [wx + 60, wy + 300], [wx + 20, wy + 600], [wx + 80, wy + 820]], 34, INK); line(c, [[wx + 20, wy + 70], [wx + 60, wy + 300], [wx + 20, wy + 600], [wx + 80, wy + 820]], 24, COL.cloth);
  person(c, 360, 1040, 900, { adult: true, armR: [0.1, -0.6], armL: [-0.8, -0.5] });
  person(c, 840, 1040, 640, { armL: [-1.1, -1.5], armR: [Math.PI * 0.45, Math.PI * 0.5] });
  plug(c, wx + 20, wy - 40, 0.75);
  arrow(c, [[wx + 240, wy - 130], [wx + 80, wy - 70]], RED, 8);
};
const f_a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => c.rect(-10, 960, D + 20, 140), COL.cloth, 6);
  shape(c, () => rrect(c, 880, 180, 190, 800, 10), COL.brown); shade(c, () => rrect(c, 880, 180, 190, 800, 10), COL.soilDk, 40, 0, 0.4);
  shape(c, () => rrect(c, 905, 215, 140, 320, 8), COL.wood, 4); shape(c, () => ell(c, 910, 600, 14, 14), BRASS, 4);
  line(c, [[60, 1000], [200, 900], [360, 960], [520, 870], [600, 920]], 70, INK); line(c, [[60, 1000], [200, 900], [360, 960], [520, 870], [600, 920]], 58, COL.pink);
  person(c, 740, 1000, 680, { armL: [-Math.PI * 0.7, -Math.PI * 0.55], armR: [-Math.PI * 0.3, -Math.PI * 0.45] });
  arrow(c, [[480, 560], [700, 560]]);
};
const f_p1 = (c: Ctx) => {
  ground(c);
  person(c, 220, 1040, 640, { armR: [0.4, 0.6] });
  person(c, 880, 1040, 450, { armL: [Math.PI * 0.7, Math.PI * 0.5], armR: [Math.PI * 0.35, Math.PI * 0.5] });
  table(c, 660);
  shape(c, () => c.rect(214, 724, 600, 300), SH, 0);
  for (const s of [-1, 1]) { shape(c, () => { c.moveTo(540, 720); c.lineTo(540 + s * 290, 700); c.lineTo(540 + s * 290, 1000); c.lineTo(540, 1020); c.closePath(); }, COL.paper, 6); }
  for (const yy of [790, 860, 930]) shape(c, () => c.rect(534, yy, 12, 30), COL.steelDk, 3);
  switchBoard(c, 390, 860, 200, 130, true);
  plug(c, 700, 850, 0.38); shape(c, () => ell(c, 700, 760, 16, 22), COL.water, 4); line(c, [[600, 780], [800, 940]], 12, RED); line(c, [[800, 780], [600, 940]], 12, RED);
};

// ---------------------------------------------------------------- terms
const t_plug = (c: Ctx) => { ground(c); shadow(c, 600, 980, 360, 40); plug(c, 540, 560, 2.2); };
const t_socket = (c: Ctx) => { ground(c); switchBoard(c, 540, 540, 780, 440); };
const t_conductor = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 700, 440, 40);
  const r = rnd(4);
  for (let k = 0; k < 7; k++) { const ey = 540 + (k - 3) * 48 + (r() - 0.5) * 16, ex = 940 + r() * 60; line(c, [[560, 540], [800, 540 + (k - 3) * 20], [ex, ey]], 22, INK); line(c, [[560, 540], [800, 540 + (k - 3) * 20], [ex, ey]], 13, COL.orange); }
  shape(c, () => rrect(c, 60, 450, 540, 180, 90), COL.red); shade(c, () => rrect(c, 60, 450, 540, 180, 90), "#b03a28", 0, 50, 0.45);
  shape(c, () => ell(c, 600, 540, 34, 90), "#b03a28", 6); shape(c, () => ell(c, 600, 540, 22, 62), COL.orange, 5);
  shine(c, [[160, 480], [460, 480]], 10);
};
const t_cell = (c: Ctx) => {
  ground(c); table(c, 620);
  shape(c, () => rrect(c, 650, 160, 300, 760, 40), COL.black); shade(c, () => rrect(c, 650, 160, 300, 760, 40), "#1d1a22", 60, 0, 0.5);
  shape(c, () => rrect(c, 690, 480, 220, 400, 20), "#5c5764", 5);
  for (const yy of [560, 740]) { c.save(); c.translate(800, yy); c.rotate(Math.PI / 2); cell(c, 0, 90, 46, 180); c.restore(); }
  shadow(c, 300, 770, 120, 30); cell(c, 280, 760, 95, 400);
  c.save(); c.translate(380, 900); c.rotate(Math.PI / 2); shadow(c, 0, 40, 130, 20); cell(c, 0, 160, 80, 330); c.restore();
};

export const ic_electricityElectricalSafetyL2 = cards("sci.electricity.electrical-safety.L2", [
  s_e1_0, s_e1_1, s_e1_2, s_e1_3, s_e2_0, s_e2_1, s_e2_2,
  f_e1, f_e2, f_a2, f_a3, f_p1, t_plug, t_socket, t_conductor, t_cell,
]);
