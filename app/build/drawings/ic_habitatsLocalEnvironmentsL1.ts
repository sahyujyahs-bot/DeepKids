import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, cards } from "./flatKit";

// HOMES NEAR OUR HOME (sci.habitats.local-environments.L1) · flat cards. Same child (orange top) and
// grown-up (blue top) as the rest of the kit. Soil: wet is dark, dry is pale. Light upper left.

const TERRA = "#c9743f", TERRA_DK = "#a2552a", SOILWET = "#4d2e1b", SOILDRY = "#c4a476", STONE = "#a9a39a", STONE_DK = "#746e66";
const PILL = "#8d8a90", PILL_DK = "#5c5964", WORM = "#e8a0a0", WORM_DK = "#c27070", SKY = "#cfe7f6", DARK = "#3a3540";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
// a clay pot, rim top at (x, y), rim width w, height h; returns the soil ellipse
const pot = (c: Ctx, x: number, y: number, w: number, h: number, soil = SOILWET) => {
  shadow(c, x + w * 0.1, y + h + 6, w * 0.5, w * 0.08);
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w * 0.36, y + h); c.lineTo(x - w * 0.36, y + h); c.closePath(); };
  shape(c, body, TERRA); shade(c, body, TERRA_DK, w * 0.22, 0);
  const rim = () => rrect(c, x - w / 2 - 10, y - 30, w + 20, 46, 10);
  shape(c, rim, TERRA); shade(c, rim, TERRA_DK, w * 0.22, 0);
  shape(c, () => ell(c, x, y - 30, w / 2 + 10, w * 0.1), TERRA_DK);
  shape(c, () => ell(c, x, y - 30, w / 2 - 6, w * 0.085), soil);
  return { sx: x, sy: y - 30, rx: w / 2 - 6, ry: w * 0.085 };
};
const halfDark = (c: Ctx, s: { sx: number; sy: number; rx: number; ry: number }, left: boolean) => {
  c.save(); c.beginPath(); ell(c, s.sx, s.sy, s.rx, s.ry); c.clip(); c.fillStyle = SOILWET; c.fillRect(left ? s.sx - s.rx : s.sx, s.sy - s.ry, s.rx, s.ry * 2); c.restore();
  line(c, [[s.sx, s.sy - s.ry], [s.sx, s.sy + s.ry]], 3, INK);
};
const worm = (c: Ctx, pts: number[][], w = 22) => {
  line(c, pts, w + 8, INK); line(c, pts, w, WORM);
  for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], an = Math.atan2(by - ay, bx - ax); for (let t = 0.2; t < 0.95; t += 0.2) { const px = ax + (bx - ax) * t, py = ay + (by - ay) * t; line(c, [[px - Math.sin(an) * w * 0.38, py + Math.cos(an) * w * 0.38], [px + Math.sin(an) * w * 0.38, py - Math.cos(an) * w * 0.38]], 3, WORM_DK); } }
  const [hx, hy] = pts[pts.length - 1]; shape(c, () => ell(c, hx, hy, w * 0.55, w * 0.5), WORM, 4);
};
const ant = (c: Ctx, x: number, y: number, s = 1, an = 0, carry = false) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const i of [-1, 0, 1]) for (const sd of [-1, 1]) line(c, [[i * 8, 0], [i * 8 + i * 12 + 2, sd * 20]], 3.5, INK);
  shape(c, () => ell(c, -24, 0, 17, 11), DARK, 3); shape(c, () => ell(c, 0, 0, 10, 8), DARK, 3); shape(c, () => ell(c, 18, 0, 11, 9), DARK, 3);
  line(c, [[24, -6], [36, -18]], 3, INK); line(c, [[26, -2], [40, -8]], 3, INK);
  if (carry) shape(c, () => ell(c, 36, 4, 11, 7, 0.4), WHITE, 3);
  c.restore();
};
const pill = (c: Ctx, x: number, y: number, s = 1, an = 0, curled = false) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  if (curled) {
    shape(c, () => ell(c, 0, 0, 26, 26), PILL, 4);
    for (let i = 1; i <= 3; i++) { c.beginPath(); c.arc(0, 0, 26 - i * 6, Math.PI * 0.9, Math.PI * 1.9); c.strokeStyle = PILL_DK; c.lineWidth = 3; c.stroke(); }
  } else {
    for (let i = -3; i <= 3; i++) line(c, [[i * 10, 0], [i * 10 + i * 2, 28]], 3, INK);
    shape(c, () => ell(c, 0, 0, 40, 22), PILL, 4);
    for (let i = -3; i <= 3; i++) { const yy = 22 * Math.sqrt(1 - (i * 10 / 40) ** 2); line(c, [[i * 10, -yy + 3], [i * 10, yy - 3]], 3, PILL_DK); }
    shape(c, () => ell(c, 42, 3, 9, 8), PILL, 3); shape(c, () => ell(c, 46, 1, 2.5, 2.5), INK, 0);
    line(c, [[48, -4], [58, -14]], 2.5, INK); line(c, [[48, -2], [60, -6]], 2.5, INK);
  }
  c.restore();
};
const fish = (c: Ctx, x: number, y: number, s = 1, col = COL.orange, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  shape(c, () => { c.moveTo(-38, 0); c.lineTo(-62, -22); c.lineTo(-62, 22); c.closePath(); }, col, 4);
  shape(c, () => ell(c, 0, 0, 44, 24), col, 4);
  shape(c, () => ell(c, 22, -5, 5, 5), WHITE, 2); shape(c, () => ell(c, 23, -5, 2.5, 2.5), INK, 0);
  c.restore();
};
const frog = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 10, 46, 28), COL.green, 4);
  shape(c, () => ell(c, -40, 26, 16, 9), COL.green, 3); shape(c, () => ell(c, 40, 26, 16, 9), COL.green, 3);
  for (const sd of [-1, 1]) { shape(c, () => ell(c, sd * 20, -14, 12, 12), COL.green, 3); shape(c, () => ell(c, sd * 20, -14, 5, 5), INK, 0); }
  c.restore();
};
const crow = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => { c.moveTo(-30, 0); c.lineTo(-62, 10); c.lineTo(-58, -8); c.closePath(); }, DARK, 3);
  shape(c, () => ell(c, 0, 0, 38, 22), DARK, 4); shape(c, () => ell(c, 30, -22, 15, 14), DARK, 4);
  shape(c, () => { c.moveTo(42, -24); c.lineTo(64, -18); c.lineTo(42, -14); c.closePath(); }, COL.greyDk, 3);
  shape(c, () => ell(c, 34, -26, 3, 3), WHITE, 0);
  c.restore();
};
const nest = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => { c.moveTo(x - r, y); c.quadraticCurveTo(x, y + r * 0.9, x + r, y); c.closePath(); }, COL.brown, 5); for (let i = 0; i < 7; i++) line(c, [[x - r + i * r * 0.3, y + 4], [x - r * 0.8 + i * r * 0.3, y + r * 0.35]], 3, COL.woodDk); shape(c, () => ell(c, x, y, r, r * 0.18), COL.wood, 4); };
const tree = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => { c.moveTo(-40, 0); c.lineTo(-30, -220); c.lineTo(30, -220); c.lineTo(40, 0); c.closePath(); }, COL.brown, 5);
  const can = () => { ell(c, -90, -250, 90, 80); ell(c, 90, -260, 95, 85); ell(c, 0, -330, 120, 95); ell(c, 0, -230, 110, 70); };
  for (const [cx, cy, rx, ry] of [[-90, -250, 90, 80], [90, -260, 95, 85], [0, -230, 110, 70], [0, -330, 120, 95]]) shape(c, () => ell(c, cx, cy, rx, ry), COL.leaf, 5);
  void can;
  c.restore();
};
const lotusLeaf = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y); c.arc(x, y, r, 0.3, Math.PI * 2 - 0.3); c.closePath(); }, COL.leafDk, 4);
const lotus = (c: Ctx, x: number, y: number, s = 1) => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.5; shape(c, () => ell(c, x + Math.cos(a) * 18 * s, y + Math.sin(a) * 18 * s, 10 * s, 24 * s, a), COL.pink, 3); } shape(c, () => ell(c, x, y + 4 * s, 10 * s, 7 * s), COL.yellow, 3); };
const egret = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  line(c, [[-8, 0], [-8, -60]], 4, COL.yellow); line(c, [[12, 0], [12, -60]], 4, COL.yellow);
  shape(c, () => ell(c, 0, -85, 42, 26), WHITE, 4);
  line(c, [[28, -100], [40, -150], [34, -180]], 22, INK); line(c, [[28, -100], [40, -150], [34, -180]], 14, WHITE);
  shape(c, () => ell(c, 36, -186, 15, 13), WHITE, 4);
  shape(c, () => { c.moveTo(48, -190); c.lineTo(80, -182); c.lineTo(48, -178); c.closePath(); }, COL.yellow, 3);
  shape(c, () => ell(c, 40, -190, 3, 3), INK, 0);
  c.restore();
};
// a flat stone, centre (x, y), seen from the side/above
const stonePath = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.moveTo(x - rx, y + ry * 0.4); c.quadraticCurveTo(x - rx * 0.9, y - ry, x - rx * 0.2, y - ry); c.quadraticCurveTo(x + rx * 0.6, y - ry * 1.1, x + rx, y - ry * 0.1); c.quadraticCurveTo(x + rx * 0.9, y + ry, x + rx * 0.3, y + ry); c.quadraticCurveTo(x - rx * 0.6, y + ry * 1.05, x - rx, y + ry * 0.4); c.closePath(); };
const stone = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => stonePath(c, x, y, rx, ry), STONE); shade(c, () => stonePath(c, x, y, rx, ry), STONE_DK, rx * 0.25, -ry * 0.2); };
const tissue = (c: Ctx, x: number, y: number, rot: number, mark: boolean) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 12, 14, 150, 110);
  shape(c, () => rrect(c, -150, -110, 300, 220, 14), WHITE, 5);
  if (mark) { shape(c, () => { c.moveTo(-70, -40); c.quadraticCurveTo(0, -80, 70, -30); c.quadraticCurveTo(100, 30, 40, 60); c.quadraticCurveTo(-40, 80, -80, 30); c.closePath(); }, COL.soil, 0); }
  else { const r = rnd(5); for (let i = 0; i < 6; i++) shape(c, () => ell(c, -60 + r() * 120, -40 + r() * 80, 5, 4), COL.soil, 0); }
  c.restore();
};
const clayPlate = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  shape(c, () => ell(c, x + 4, y + 12, rx, ry, rot), TERRA_DK, 5);
  shape(c, () => ell(c, x, y, rx, ry, rot), TERRA, 5);
  shape(c, () => ell(c, x, y, rx * 0.78, ry * 0.7, rot), TERRA_DK, 3);
};
const drops = (c: Ctx, pts: number[][], s = 1) => pts.forEach(([x, y]) => shape(c, () => { c.moveTo(x, y - 14 * s); c.quadraticCurveTo(x + 11 * s, y, x, y + 8 * s); c.quadraticCurveTo(x - 11 * s, y, x, y - 14 * s); c.closePath(); }, COL.drop, 3));
const windowBg = (c: Ctx, x: number, y: number, w: number, h: number, sx: number, sy: number) => {
  shape(c, () => rrect(c, x, y, w, h, 12), SKY, 8); sun(c, sx, sy, 60);
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 8); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 8);
};
const sill = (c: Ctx, y: number, x0 = 40, x1 = 1040) => { shape(c, () => polyP(c, [[x0 + 40, y], [x1 - 40, y], [x1, y + 70], [x0, y + 70]]), COL.cloth); c.fillStyle = COL.grey; c.fillRect(x0, y + 70, x1 - x0, 14); };

// ----------------------------------------------------------------- set-up cards (e1)
// 1. pour half a cup of water slowly over the soil
const setupE1_0 = (c: Ctx) => {
  ground(c);
  pot(c, 560, 600, 480, 300);
  drops(c, [[470, 540], [640, 548], [560, 530]], 1);
  // stream from the cup lip down onto the soil
  line(c, [[412, 290], [470, 400], [520, 540]], 24, INK); line(c, [[412, 290], [470, 400], [520, 540]], 16, COL.water);
  c.save(); c.translate(310, 290); c.rotate(0.9);
  shadow(c, 10, 90, 60, 14);
  shape(c, () => rrect(c, -60, -80, 120, 160, 12), COL.steel); shade(c, () => rrect(c, -60, -80, 120, 160, 12), COL.steelDk, 30, 0);
  shape(c, () => ell(c, 0, -80, 60, 14), COL.water, 5);
  c.restore();
  hand(c, 224, 337, -0.5, 1.4);
  arrow(c, [[640, 300], [690, 420], [640, 500]]);
};
// 2. a clay plate on half the soil, the pot on a sunny windowsill
const setupE1_1 = (c: Ctx) => {
  ground(c);
  windowBg(c, 140, 60, 800, 560, 790, 210);
  sill(c, 620);
  const s = pot(c, 540, 450, 420, 230);
  halfDark(c, s, true);
  clayPlate(c, 440, 410, 135, 38);
  for (let i = 0; i < 4; i++) line(c, [[760 + i * 30, 290 + i * 10], [640 + i * 30, 405]], 5, COL.yellow);
};
// 3. three hours later: a tissue pressed on each half, the plate lifted
const setupE1_2 = (c: Ctx) => {
  ground(c);
  sun(c, 940, 120, 55);
  const s = pot(c, 560, 330, 380, 200, SOILDRY);
  halfDark(c, s, true);
  drops(c, [[470, 300], [430, 315]], 0.8);
  c.save(); c.translate(230, 230); c.rotate(-0.5); clayPlate(c, 0, 0, 120, 34); c.restore();
  hand(c, 160, 370, -1.2, 1.2);
  arrow(c, [[300, 150], [250, 70]]);
  tissue(c, 300, 800, -0.08, true);
  tissue(c, 790, 820, 0.06, false);
};

// ----------------------------------------------------------------- card pictures
// flow.e1: the child feels the soil, half under a plate, in the sun
const flowE1 = (c: Ctx) => {
  ground(c);
  sun(c, 900, 160, 70);
  c.fillStyle = COL.cloth; c.fillRect(0, 860, D, D);
  const s = pot(c, 720, 700, 400, 240);
  halfDark(c, s, true);
  person(c, 300, 860, 520, { sit: true, armR: [-0.3, 0.3], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  clayPlate(c, 800, 662, 118, 32);
  drops(c, [[600, 660]], 0.8);
};
// flow.a1: feel the places. Left: a sunny windowsill. Right: the dark floor under the sink, by torch
const flowA1 = (c: Ctx) => {
  ground(c);
  windowBg(c, 60, 60, 420, 440, 300, 180);
  sill(c, 500, 20, 520);
  hand(c, 234, 671, -1.1, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[420, 760], [420, 620]]);
  // the dark cupboard under the sink
  c.fillStyle = DARK; c.fillRect(560, 60, 480, 980);
  shape(c, () => polyP(c, [[580, 60], [1020, 60], [1020, 180], [580, 180]]), COL.steel);
  shape(c, () => ell(c, 800, 120, 150, 36), COL.steelIn, 4);
  line(c, [[800, 180], [800, 300], [880, 340], [880, 420]], 24, INK); line(c, [[800, 180], [800, 300], [880, 340], [880, 420]], 14, COL.steel);
  // torch and its beam
  c.save(); c.globalAlpha = 0.55; shape(c, () => polyP(c, [[640, 470], [700, 430], [1000, 820], [720, 980]]), COL.yellow, 0); c.restore();
  c.save(); c.translate(640, 450); c.rotate(0.9);
  shape(c, () => rrect(c, -110, -26, 150, 52, 12), COL.teal, 5); shape(c, () => rrect(c, 30, -40, 50, 80, 8), COL.tealDk, 5);
  c.restore();
  hand(c, 560, 420, -0.1, 1.2);
  hand(c, 760, 880, 0.6, 1.3, SKIN.child, CLOTH.child, true);
  drops(c, [[900, 800], [960, 860], [940, 920]], 1);
};
// flow.a3: a peepal sapling in a crack of an old wall, the child pointing at it
const flowA3 = (c: Ctx) => {
  ground(c, "#d9c7a8");
  c.strokeStyle = "#bba684"; c.lineWidth = 4;
  for (let y = 0; y < D; y += 110) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); for (let x = (y / 110) % 2 ? 0 : 120; x < D; x += 240) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 110); c.stroke(); } }
  shape(c, () => polyP(c, [[600, 200], [640, 330], [590, 440], [620, 560], [570, 700], [540, 700], [560, 560], [530, 440], [575, 330], [560, 200]]), DARK, 5);
  // the sapling
  line(c, [[580, 520], [600, 400], [640, 320]], 10, INK); line(c, [[580, 520], [600, 400], [640, 320]], 6, COL.leafDk);
  const peepal = (x: number, y: number, s: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s); shape(c, () => { c.moveTo(0, 0); c.bezierCurveTo(-70, -10, -80, 60, -30, 90); c.quadraticCurveTo(-10, 110, 0, 170); c.quadraticCurveTo(10, 110, 30, 90); c.bezierCurveTo(80, 60, 70, -10, 0, 0); c.closePath(); }, COL.leaf, 5); line(c, [[0, 10], [0, 150]], 3, COL.leafDk); c.restore(); };
  peepal(640, 320, 1.1, -0.9); peepal(600, 400, 1.0, 0.9); peepal(620, 360, 0.9, 0.1); peepal(585, 470, 0.8, 1.3);
  person(c, 230, 1000, 560, { armR: [-0.9, -0.5] });
};
// flow.a4: pond watch at a temple tank, standing well back
const flowA4 = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 160, 130, 60);
  c.fillStyle = COL.cloth; c.fillRect(0, 440, D, 640);
  for (let i = 0; i < 3; i++) shape(c, () => polyP(c, [[0, 440 + i * 70], [D, 440 + i * 70], [D, 510 + i * 70], [0, 510 + i * 70]]), i % 2 ? COL.grey : COL.cloth, 5);
  c.fillStyle = COL.water; c.fillRect(0, 650, D, 430);
  line(c, [[0, 650], [D, 650]], 6);
  shape(c, () => polyP(c, [[0, 440], [D, 440], [D, 460], [0, 460]]), COL.greyDk, 4);
  fish(c, 420, 800, 1.2); fish(c, 700, 920, 1.0, COL.yellow, true); fish(c, 860, 780, 0.9, COL.orange);
  lotusLeaf(c, 640, 690, 70); lotusLeaf(c, 820, 700, 55); lotus(c, 720, 660, 1.4);
  // a turtle on the bottom step
  shape(c, () => ell(c, 300, 640, 60, 28), COL.greenDk, 4); shape(c, () => ell(c, 360, 636, 18, 13), COL.green, 3);
  egret(c, 960, 660, 1.1);
  person(c, 200, 440, 420, { adult: true, armR: [0.9, 1.2] });
  person(c, 330, 440, 300, { armL: [-1.4, -1.4], armR: [-0.6, -0.3] });
};
// flow.p1: the stone home. Each morning lift the tile slowly: ants on the dark soil
const flowP1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.cloth; c.fillRect(0, 900, D, 180);
  const s = pot(c, 560, 640, 480, 280);
  void s;
  ant(c, 520, 590, 1.1, 0.2); ant(c, 610, 606, 1.0, -0.4, true); ant(c, 680, 596, 1.0, 2.8); ant(c, 450, 606, 0.9, 1.0);
  drops(c, [[720, 595], [400, 598]], 0.8);
  // the tile, hinged on the far edge of the soil, lifted at the near left edge
  c.save(); c.translate(570, 455); c.rotate(0.63);
  shape(c, () => rrect(c, -200, -22, 400, 44, 6), COL.steelIn, 6); shade(c, () => rrect(c, -200, -22, 400, 44, 6), COL.steelDk, 0, 18, 0.5);
  c.restore();
  hand(c, 367, 427, -1.0, 1.4);
  arrow(c, [[360, 280], [320, 170]]);
};
// term.0: Habitat. Three homes: a pond, the soil under a stone, a tree
const term0 = (c: Ctx) => {
  ground(c);
  // pond
  c.fillStyle = SKY; c.fillRect(0, 0, 360, 1080); c.fillStyle = COL.water; c.fillRect(0, 380, 360, 700);
  line(c, [[0, 380], [360, 380]], 6);
  lotusLeaf(c, 120, 400, 70); frog(c, 120, 360, 1.1); fish(c, 200, 700, 1.4); fish(c, 150, 900, 1.0, COL.yellow, true);
  // under a stone
  c.fillStyle = SKY; c.fillRect(360, 0, 360, 1080); sun(c, 640, 110, 45);
  c.fillStyle = SOILDRY; c.fillRect(360, 440, 360, 80); c.fillStyle = SOILWET; c.fillRect(360, 520, 360, 560);
  line(c, [[360, 440], [720, 440]], 6);
  stone(c, 540, 420, 150, 70);
  worm(c, [[420, 700], [500, 760], [580, 700], [660, 740]], 26);
  // a tree
  c.fillStyle = SKY; c.fillRect(720, 0, 360, 1080); c.fillStyle = COL.green; c.fillRect(720, 900, 360, 180);
  tree(c, 900, 900, 1.25);
  nest(c, 900, 600, 70); crow(c, 900, 560, 0.9);
  line(c, [[360, 0], [360, 1080]], 10); line(c, [[720, 0], [720, 1080]], 10);
};
// term.1: Damp. A finger pressed into dark wet soil, a wet mark left on it
const term1 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 820, 520, 300), SOILWET);
  shape(c, () => ell(c, 640, 530, 70, 22), "#2d1a0e", 4);
  drops(c, [[720, 500], [560, 505], [690, 470]], 1.1);
  hand(c, 540, 300, 1.2, 2.4, SKIN.child, CLOTH.child, true);
  shape(c, () => ell(c, 625, 512, 22, 14, 1.2), COL.soil, 0);
};
// term.2: Shelter. Ants rest in the shade under a flat stone while the sun beats on the open ground
const term2 = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 170, 160, 80);
  for (let i = 0; i < 5; i++) line(c, [[280 + i * 40, 240 + i * 10], [360 + i * 150, 560]], 5, COL.yellow);
  c.fillStyle = SOILDRY; c.fillRect(0, 580, D, 120); c.fillStyle = COL.soil; c.fillRect(0, 700, D, 380);
  line(c, [[0, 580], [D, 580]], 6);
  // the hollow under the stone
  shape(c, () => { c.moveTo(300, 600); c.quadraticCurveTo(540, 540, 800, 600); c.quadraticCurveTo(820, 760, 540, 780); c.quadraticCurveTo(280, 760, 300, 600); c.closePath(); }, SOILWET, 5);
  ant(c, 420, 700, 1.3, 0.3); ant(c, 540, 730, 1.3, -0.2); ant(c, 660, 700, 1.3, 2.9); ant(c, 500, 650, 1.2, 1.2); ant(c, 620, 650, 1.2, -1.0);
  stone(c, 550, 500, 300, 110);
};
// expl.1: a stone lifted on one side: dark damp soil with an earthworm, a curled pill bug, ants with young
const expl1 = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 920, 140, 70);
  c.fillStyle = SOILDRY; c.fillRect(0, 600, D, 480);
  line(c, [[0, 600], [D, 600]], 6);
  shape(c, () => ell(c, 560, 700, 330, 90), SOILWET, 5);
  worm(c, [[380, 720], [460, 680], [540, 730], [620, 700]], 24);
  pill(c, 740, 690, 1.0, 0, true);
  ant(c, 420, 760, 1.0, 0.4, true); ant(c, 560, 775, 1.0, -0.3, true); ant(c, 690, 755, 1.0, 2.6, true);
  drops(c, [[300, 690], [800, 740]], 0.8);
  c.save(); c.translate(560, 490); c.rotate(-0.5); stone(c, 0, 0, 320, 95); c.restore();
  arrow(c, [[260, 480], [260, 330]]);
};
// expl.5: pill bugs cross a dry tiled floor fast and gather in the damp shade under a flowerpot's edge
const expl5 = (c: Ctx) => {
  ground(c, "#eadfc9");
  c.strokeStyle = "#c9bca4"; c.lineWidth = 4;
  for (let x = 0; x <= D; x += 180) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y <= D; y += 180) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  sun(c, 130, 130, 60);
  // the flowerpot, lifted a little on a stone so the shade under its edge shows
  shape(c, () => ell(c, 780, 870, 300, 90), "rgba(43,35,64,0.35)", 0);
  shape(c, () => ell(c, 790, 850, 230, 60), SOILWET, 4);
  pill(c, 640, 850, 0.9, 0.3); pill(c, 740, 870, 0.9, -0.4); pill(c, 850, 880, 0.9, 2.9); pill(c, 700, 820, 0.8, 1.2);
  pot(c, 790, 560, 360, 240, SOILWET);
  for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + (i - 1.5) * 0.5; line(c, [[790, 530], [790 + Math.cos(a) * 110, 530 + Math.sin(a) * 110]], 6, COL.leafDk); shape(c, () => ell(c, 790 + Math.cos(a) * 150, 530 + Math.sin(a) * 150, 48, 26, a), COL.leaf, 4); }
  // running pill bugs with motion lines
  const run = (x: number, y: number, an: number) => { pill(c, x, y, 1.3, an); for (let k = -1; k <= 1; k++) line(c, [[x - Math.cos(an) * 70 - Math.sin(an) * k * 18, y - Math.sin(an) * 70 + Math.cos(an) * k * 18], [x - Math.cos(an) * 130 - Math.sin(an) * k * 18, y - Math.sin(an) * 130 + Math.cos(an) * k * 18]], 4, COL.greyDk); };
  run(300, 420, 0.5); run(260, 700, 0.1); run(430, 560, 0.4);
  arrow(c, [[420, 330], [600, 560], [600, 760]]);
};

void shine; void BG; void RED;
export const ic_habitatsLocalEnvironmentsL1 = cards("sci.habitats.local-environments.L1", [
  setupE1_0, setupE1_1, setupE1_2,
  flowE1, flowA1, flowA3, flowA4, flowP1, term0, term1, term2, expl1, expl5,
]);
