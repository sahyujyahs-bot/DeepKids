import type { Ctx } from "./core";
import { BG, COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, line, polyP, rrect, shade, shadow, shape, shine, person, hand, write } from "./flatKit";

// sci.motion.physics-of-sport.L3 · picture cards: intro, summary, activities, experiments, terms, explanations.
// Flat DeepKids look; the same child (orange shirt); red arrows = movement; no words.

const PI = Math.PI, TILE = "#d3dbe3", TILEDK = "#b4c0cc", FLOORC = "#e6d6b8", MAT = "#c97b4a", MATDK = "#a9603a";
const PIL = "#fbf7ef", PILDK = "#e3dccb", SAND = "#f0cf8a", SANDDK = "#d9b26a", GRASS = "#8fc968", SKYC = "#cfe8f7";
const dots = (c: Ctx, pts: number[][], w = 9, col = INK) => { c.setLineDash([1, w * 2.4]); line(c, pts, w, col); c.setLineDash([]); };
const curve = (from: number[], ctrl: number[], to: number[], n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * from[0] + 2 * u * t * ctrl[0] + t * t * to[0], u * u * from[1] + 2 * u * t * ctrl[1] + t * t * to[1]]; });
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 30) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });

// a tennis ball; sx, sy squash it (a squashed ball is wider and flatter)
const ball = (c: Ctx, x: number, y: number, r: number, sx = 1, sy = 1) => {
  c.save(); c.translate(x, y); c.scale(sx, sy);
  const p = () => ell(c, 0, 0, r, r);
  shape(c, p, "#d9e24f", 6 / Math.max(sx, sy));
  shade(c, p, "#a9b52c", r * 0.35, r * 0.3, 0.6);
  c.save(); c.beginPath(); p(); c.clip();
  line(c, [[-r * 0.95, -r * 0.35], [-r * 0.3, -r * 0.05], [-r * 0.1, r * 0.5], [-r * 0.4, r * 1.1]], r * 0.11, WHITE);
  line(c, [[r * 0.95, r * 0.35], [r * 0.3, r * 0.05], [r * 0.1, -r * 0.5], [r * 0.4, -r * 1.1]], r * 0.11, WHITE);
  c.restore();
  c.beginPath(); p(); c.lineWidth = 6 / Math.max(sx, sy); c.strokeStyle = INK; c.stroke();
  c.restore();
};
// a football (white, black patches)
const football = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, WHITE, 6); shade(c, p, "#d5d0c6", r * 0.3, r * 0.3, 0.7);
  c.save(); c.beginPath(); p(); c.clip();
  const pent = (px: number, py: number, pr: number, a0: number) => shape(c, () => polyP(c, Array.from({ length: 5 }, (_, i) => [px + Math.cos(a0 + (i * 2 * PI) / 5) * pr, py + Math.sin(a0 + (i * 2 * PI) / 5) * pr])), COL.black, 4);
  pent(x, y, r * 0.3, rot - PI / 2);
  for (let i = 0; i < 5; i++) { const a = rot - PI / 2 + (i * 2 * PI) / 5 + PI / 5; pent(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, r * 0.28, a + PI); line(c, [[x + Math.cos(a - PI / 5) * r * 0.3, y + Math.sin(a - PI / 5) * r * 0.3], [x + Math.cos(a) * r * 0.67, y + Math.sin(a) * r * 0.67]], 4); }
  c.restore(); c.beginPath(); p(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const tileFloor = (c: Ctx, y: number) => {
  c.fillStyle = TILE; c.fillRect(0, y, 1080, 1080 - y);
  for (let k = -6; k <= 16; k++) line(c, [[k * 120 + 60, y], [k * 120 + 60 + (k * 120 + 60 - 540) * 0.35, 1080]], 3, TILEDK);
  for (const d of [70, 190]) if (y + d < 1080) line(c, [[0, y + d], [1080, y + d]], 3, TILEDK);
  line(c, [[0, y], [1080, y]], 6);
};
const woodFloor = (c: Ctx, y: number) => { c.fillStyle = FLOORC; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };
// a stone slab (tile) with its top at y
const slab = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + 20, y + 74, w / 2, 16);
  shape(c, () => rrect(c, x - w / 2, y, w, 64, 8), TILE); shade(c, () => rrect(c, x - w / 2, y, w, 64, 8), TILEDK, 0, 30, 0.7);
  line(c, [[x - w / 6, y], [x - w / 6, y + 64]], 3, TILEDK); line(c, [[x + w / 6, y], [x + w / 6, y + 64]], 3, TILEDK);
};
const doormat = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + 20, y + 54, w / 2, 14);
  shape(c, () => rrect(c, x - w / 2, y, w, 46, 8), MAT);
  for (let k = 0; k < 14; k++) line(c, [[x - w / 2 + 14 + k * ((w - 28) / 13), y + 8], [x - w / 2 + 14 + k * ((w - 28) / 13), y + 38]], 5, MATDK);
};
// a pillow with its top at y, a dent of half-width dr and depth dd in the middle (dd = 0: no dent)
const pillow = (c: Ctx, x: number, y: number, w: number, h: number, dr = 0, dd = 0) => {
  shadow(c, x + 20, y + h + 12, w / 2, 16);
  const p = () => {
    c.moveTo(x - w / 2, y + h * 0.9); c.lineTo(x - w / 2, y + 26);
    if (dd > 0) { c.bezierCurveTo(x - w / 2, y - 6, x - dr * 1.7, y - 6, x - dr, y); c.quadraticCurveTo(x, y + dd * 2, x + dr, y); c.bezierCurveTo(x + dr * 1.7, y - 6, x + w / 2, y - 6, x + w / 2, y + 26); }
    else { c.quadraticCurveTo(x, y - 40, x + w / 2, y + 26); }
    c.lineTo(x + w / 2, y + h * 0.9); c.quadraticCurveTo(x, y + h + 24, x - w / 2, y + h * 0.9); c.closePath();
  };
  shape(c, p, PIL); shade(c, p, PILDK, w * 0.05, h * 0.2, 0.9);
};
const surfaceTop = (c: Ctx, x: number, y: number, w: number, which: number) => { if (which === 0) slab(c, x, y, w); else if (which === 1) doormat(c, x, y, w); else pillow(c, x, y + 10, w, 90); };
const tapePiece = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 3), "rgba(255,211,77,0.9)", 4);
const marble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.blue, 5); shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.4, r * 0.4); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.22, r * 0.22), WHITE, 0); };
const wavy = (x: number, y: number, h: number, a = 14) => Array.from({ length: 21 }, (_, i) => [x + Math.sin((i / 20) * PI * 3) * a, y - (i / 20) * h]);
// a forearm coming down from above the card to a hand at (x, y)
const handDown = (c: Ctx, x: number, y: number, s: number, open = true) => { shape(c, () => rrect(c, x - 36 * s, -30, 72 * s, y - 78 * s + 30, 6), CLOTH.child); hand(c, x, y, PI / 2, s, SKIN.child, CLOTH.child, open); };
const sheetBG = (c: Ctx, col: string) => { ground(c); c.fillStyle = col; c.fillRect(0, 0, 1080, 1080); };

// ---------------------------------------------------------------- 0 intro
const intro = (c: Ctx) => {
  ground(c); tileFloor(c, 800);
  handDown(c, 270, 170, 1.1);
  ball(c, 270, 400, 55); arrow(c, [[270, 490], [270, 720]]);
  pillow(c, 790, 700, 400, 110, 85, 90);
  ball(c, 790, 735, 55);
};
// ---------------------------------------------------------------- 1 summary
const summary = (c: Ctx) => {
  ground(c); c.fillStyle = "#dfeef8"; c.fillRect(540, 0, 540, 1080); line(c, [[540, 0], [540, 1080]], 6);
  tileFloor(c, 780); c.save(); c.beginPath(); c.rect(540, 0, 540, 1080); c.clip(); c.fillStyle = "#dfeef8"; c.fillRect(540, 0, 540, 780); c.restore(); line(c, [[540, 0], [540, 1080]], 6);
  ball(c, 270, 750, 60, 1.35, 0.62); arrow(c, [[270, 660], [270, 440]]); ball(c, 270, 300, 60);
  pillow(c, 810, 700, 420, 110, 85, 90); ball(c, 810, 740, 60);
};
// ---------------------------------------------------------------- 2 e1 bounce test
const e1 = (c: Ctx) => {
  ground(c); woodFloor(c, 880);
  [[210, 0, 330], [540, 1, 520], [870, 2, 760]].forEach(([x, k, by]) => {
    surfaceTop(c, x, 810, 280, k);
    if (k < 2) { arrow(c, [[x, 790], [x, by + 110]]); ball(c, x, by, 52); } else ball(c, x, 735, 52);
  });
};
// ---------------------------------------------------------------- 3 e2 Galileo's table
const e2 = (c: Ctx) => {
  ground(c); woodFloor(c, 840);
  shadow(c, 300, 850, 280, 16);
  for (const x of [110, 410]) shape(c, () => rrect(c, x - 18, 500, 36, 340, 6), COL.woodDk);
  shape(c, () => rrect(c, 50, 450, 430, 52, 8), COL.wood); shade(c, () => rrect(c, 50, 450, 430, 52, 8), COL.woodDk, 0, 22, 0.7);
  marble(c, 380, 424, 26); arrow(c, [[100, 410], [300, 410]]);
  dots(c, curve([500, 424], [620, 424], [700, 810]), 8); dots(c, curve([500, 424], [820, 424], [950, 810]), 8);
  tapePiece(c, 700, 850, 14, 50); tapePiece(c, 950, 850, 14, 50);
  marble(c, 700, 812, 26); marble(c, 950, 812, 26);
  arrow(c, [[720, 940], [930, 940]], COL.blue, 9);
};
// ---------------------------------------------------------------- 4 e3 standing jump
const e3 = (c: Ctx) => {
  ground(c);
  const row = (fy: number, land: number, swing: boolean) => {
    woodFloor(c, fy);
    tapePiece(c, 150, fy + 60, 14, 40); tapePiece(c, land, fy + 60, 14, 40);
    person(c, 260, fy + 30, 330, swing ? { armL: [-0.7, -0.35], armR: [-0.7, -0.35] } : { armL: [PI * 0.5, PI * 0.5], armR: [PI * 0.5, PI * 0.5] });
    arrow(c, [[170, fy + 110], [land - 30, fy + 110]]);
  };
  c.save(); c.beginPath(); c.rect(0, 0, 1080, 540); c.clip(); row(400, 950, true); c.restore();
  c.save(); c.beginPath(); c.rect(0, 540, 1080, 540); c.clip(); row(940, 640, false); c.restore();
  line(c, [[0, 540], [1080, 540]], 8);
};
// ---------------------------------------------------------------- 5 a1 jog on the spot
const a1 = (c: Ctx) => {
  ground(c); woodFloor(c, 820);
  c.fillStyle = TILE; c.fillRect(0, 820, 540, 260); for (let k = 1; k < 4; k++) line(c, [[k * 135, 820], [k * 135, 1080]], 3, TILEDK); line(c, [[0, 820], [1080, 820]], 6);
  shape(c, () => rrect(c, 580, 820, 440, 90, 30), "#8fb3dc"); line(c, [[600, 866], [1000, 866]], 3, "#6a92c2");
  person(c, 270, 818, 400, { armL: [-0.4, 0.3], armR: [PI * 0.6, PI * 0.2] });
  person(c, 800, 838, 400, { armL: [-0.4, 0.3], armR: [PI * 0.6, PI * 0.2] });
  line(c, [[540, 0], [540, 1080]], 6);
  arrow(c, [[170, 780], [170, 560]]); arrow(c, [[690, 780], [690, 700]]);
};
// ---------------------------------------------------------------- 6 a2 toss and water jet
const a2 = (c: Ctx) => {
  ground(c); woodFloor(c, 880);
  hand(c, 120, 800, -PI / 2, 1.1, SKIN.child, CLOTH.child, true); hand(c, 470, 800, -PI / 2, 1.1, SKIN.child, CLOTH.child, true);
  dots(c, curve([140, 640], [300, 80], [450, 640]), 9); ball(c, 295, 340, 48);
  line(c, [[540, 0], [540, 1080]], 6);
  // a bottle with a hole low on one side and a jet of water
  const body = () => rrect(c, 640, 330, 210, 500, 40);
  shadow(c, 760, 835, 140, 16);
  shape(c, () => rrect(c, 700, 250, 90, 90, 14), COL.glass, 5);
  shape(c, body, COL.glass, 6);
  shape(c, () => rrect(c, 648, 420, 194, 402, 34), COL.water, 0); shape(c, () => ell(c, 745, 420, 97, 14), COL.drop, 0);
  shape(c, body, "rgba(0,0,0,0)", 6); shine(c, [[672, 400], [672, 760]], 9);
  shape(c, () => ell(c, 850, 760, 9, 9), INK, 0);
  line(c, curve([852, 760], [920, 750], [1010, 870]), 22, INK); line(c, curve([852, 760], [920, 750], [1010, 870]), 12, COL.water);
};
// ---------------------------------------------------------------- 7 a3 kick off the middle
const a3 = (c: Ctx) => {
  ground(c); c.fillStyle = GRASS; c.fillRect(0, 0, 1080, 1080);
  football(c, 620, 520, 220, 0.3);
  // a shoe from above, its toe touching the ball low on the left side
  c.save(); c.translate(250, 780); c.rotate(-0.55);
  shape(c, () => { c.moveTo(-170, -50); c.lineTo(80, -62); c.quadraticCurveTo(190, -60, 190, 0); c.quadraticCurveTo(190, 60, 80, 62); c.lineTo(-170, 50); c.closePath(); }, CLOTH.adult);
  shade(c, () => { c.moveTo(-170, -50); c.lineTo(80, -62); c.quadraticCurveTo(190, -60, 190, 0); c.quadraticCurveTo(190, 60, 80, 62); c.lineTo(-170, 50); c.closePath(); }, CLOTH.adultDk, 0, 30, 0.7);
  line(c, [[-40, -40], [-40, 40]], 5, WHITE); line(c, [[10, -42], [10, 42]], 5, WHITE);
  shape(c, () => rrect(c, -230, -44, 80, 88, 14), SKIN.child);
  c.restore();
  arrow(c, [[400, 960], [520, 800]]);
  arrow(c, arc(620, 520, 300, 300, -2.6, -0.6));
  arrow(c, arc(620, 520, 300, 300, 0.5, 2.5));
};
// ---------------------------------------------------------------- 8 a4 soft hands
const a4 = (c: Ctx) => {
  ground(c);
  arrow(c, [[540, 90], [540, 280]]);
  const p = () => { c.moveTo(540, 380); c.bezierCurveTo(400, 480, 380, 700, 540, 720); c.bezierCurveTo(700, 700, 680, 480, 540, 380); c.closePath(); };
  shape(c, p, COL.blue); shade(c, p, COL.blueDk, 40, 40, 0.5);
  shape(c, () => polyP(c, [[520, 380], [560, 380], [570, 345], [510, 345]]), COL.blue, 5);
  shine(c, [[470, 520], [455, 600]], 12);
  hand(c, 330, 880, -PI / 2 - 0.35, 1.3, SKIN.child, CLOTH.child, true); hand(c, 750, 880, -PI / 2 + 0.35, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[200, 610], [200, 800]]); arrow(c, [[880, 610], [880, 800]]);
};
// ---------------------------------------------------------------- 9 a5 sport spotting
const a5 = (c: Ctx) => {
  ground(c); c.fillStyle = SKYC; c.fillRect(0, 0, 1080, 760); c.fillStyle = GRASS; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 6);
  for (const x of [830, 1000]) shape(c, () => rrect(c, x - 8, 380, 16, 380, 4), WHITE, 5);
  shape(c, () => rrect(c, 830, 372, 186, 16, 4), WHITE, 5);
  dots(c, curve([520, 740], [680, 80], [860, 560]), 9); football(c, 685, 365, 56, 0.4);
  person(c, 230, 960, 520, { armL: [PI * 0.45, -0.9], armR: [PI * 0.45, PI * 0.5] });
  // notebook in the left hand
  c.save(); c.translate(150, 720); c.rotate(-0.15); shape(c, () => rrect(c, -50, -70, 100, 130, 8), COL.paper); for (let k = 0; k < 4; k++) line(c, [[-30, -40 + k * 28], [30, -40 + k * 28]], 4, COL.grey); c.restore();
};
// ---------------------------------------------------------------- 10 p1 rubber band ball
const p1 = (c: Ctx) => {
  ground(c); shadow(c, 590, 900, 300, 36);
  const R = 320, cx = 540, cy = 520;
  shape(c, () => ell(c, cx, cy, R, R), "#e9c46a", 6);
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip();
  const cols = [COL.red, COL.teal, COL.yellow, COL.blue, COL.pink, COL.orange, COL.purple, COL.green];
  for (let i = 0; i < 16; i++) { const rot = (i * PI) / 8 + 0.2, ry = 90 + (i % 4) * 70; c.beginPath(); ell(c, cx, cy, R * 0.97, ry, rot); c.strokeStyle = INK; c.lineWidth = 36; c.stroke(); c.strokeStyle = cols[i % 8]; c.lineWidth = 24; c.stroke(); }
  shade(c, () => ell(c, cx, cy, R, R), "#2b2340", 80, 80, 0.18);
  c.restore();
  c.beginPath(); ell(c, cx, cy, R, R); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shine(c, arc(cx, cy, R * 0.82, R * 0.82, 3.6, 4.4), 14);
};
// ---------------------------------------------------------------- 11 c1 mini trampoline
const c1 = (c: Ctx) => {
  ground(c); woodFloor(c, 860);
  shadow(c, 560, 870, 300, 24);
  for (const [x, y] of [[300, 640], [780, 640], [380, 700], [700, 700]]) line(c, [[x, y], [x + (x < 540 ? -20 : 20), 860]], 18, INK), line(c, [[x, y], [x + (x < 540 ? -20 : 20), 860]], 8, COL.steel);
  shape(c, () => ell(c, 540, 600, 330, 90), COL.steel);
  shape(c, () => ell(c, 540, 606, 290, 70), COL.blue, 5);
  shape(c, () => ell(c, 540, 612, 130, 28), COL.blueDk, 0);
  ball(c, 540, 600, 50, 1.2, 0.8);
  arrow(c, [[540, 520], [540, 260]]); ball(c, 540, 170, 50);
};
// ---------------------------------------------------------------- 12 c2 feet for sand
const c2 = (c: Ctx) => {
  ground(c); c.fillStyle = SKYC; c.fillRect(0, 0, 1080, 620);
  const leg = (x: number, w: number, bottom: number) => { shape(c, () => rrect(c, x - w / 2, -20, w, bottom + 20, 10), "#c8935a"); shade(c, () => rrect(c, x - w / 2, -20, w, bottom + 20, 10), "#a8723f", w * 0.3, 0, 0.7); };
  // left: thin leg sunk deep
  leg(270, 56, 800);
  shape(c, () => { c.moveTo(0, 640); c.lineTo(150, 640); c.quadraticCurveTo(250, 640, 255, 780); c.lineTo(285, 780); c.quadraticCurveTo(290, 640, 390, 640); c.lineTo(540, 640); c.lineTo(540, 1080); c.lineTo(0, 1080); c.closePath(); }, SAND);
  // right: wide pad resting on sand
  c.fillStyle = SAND; c.fillRect(540, 640, 540, 440);
  leg(810, 56, 590);
  shape(c, () => ell(c, 810, 618, 190, 36), "#c8935a");
  shape(c, () => { c.moveTo(540, 640); c.lineTo(1080, 640); c.lineTo(1080, 1080); c.lineTo(540, 1080); c.closePath(); }, "rgba(0,0,0,0)", 0);
  line(c, [[540, 640], [680, 640]], 6); line(c, [[940, 640], [1080, 640]], 6); line(c, [[0, 640], [150, 640]], 6); line(c, [[390, 640], [540, 640]], 6);
  for (let k = 0; k < 12; k++) line(c, [[40 + k * 90, 800 + (k % 3) * 60], [70 + k * 90, 800 + (k % 3) * 60]], 5, SANDDK);
  line(c, [[540, 0], [540, 1080]], 6);
  arrow(c, [[100, 160], [100, 400]]); arrow(c, [[980, 160], [980, 400]]);
};
// ---------------------------------------------------------------- 13 t0 force
const t0 = (c: Ctx) => {
  ground(c); woodFloor(c, 820);
  football(c, 700, 700, 120, 0.2); shadow(c, 720, 826, 110, 16);
  // leg and boot swinging at the ball
  line(c, [[120, 120], [330, 560]], 120, INK); line(c, [[120, 120], [330, 560]], 104, SKIN.child);
  shape(c, () => { c.moveTo(260, 600); c.lineTo(340, 520); c.lineTo(420, 580); c.quadraticCurveTo(500, 600, 520, 690); c.lineTo(520, 760); c.lineTo(260, 760); c.closePath(); }, CLOTH.adult);
  shade(c, () => { c.moveTo(260, 600); c.lineTo(340, 520); c.lineTo(420, 580); c.quadraticCurveTo(500, 600, 520, 690); c.lineTo(520, 760); c.lineTo(260, 760); c.closePath(); }, CLOTH.adultDk, 0, 40, 0.7);
  arrow(c, [[820, 540], [1010, 540]]);
};
// ---------------------------------------------------------------- 14 t1 bounce
const t1 = (c: Ctx) => {
  ground(c); tileFloor(c, 820);
  ball(c, 110, 260, 52);
  dots(c, curve([110, 330], [140, 600], [250, 790]), 9);
  dots(c, curve([250, 790], [400, 80], [550, 790]), 9); dots(c, curve([550, 790], [630, 380], [720, 790]), 9); dots(c, curve([720, 790], [770, 600], [820, 790]), 9);
  ball(c, 900, 770, 50);
};
// ---------------------------------------------------------------- 15 t2 surface
const t2 = (c: Ctx) => {
  ground(c);
  const y = 380, s = 290;
  shape(c, () => rrect(c, 40, y, s, s, 14), TILE); for (let k = 1; k < 3; k++) { line(c, [[40 + k * s / 3, y], [40 + k * s / 3, y + s]], 4, TILEDK); line(c, [[40, y + k * s / 3], [40 + s, y + k * s / 3]], 4, TILEDK); }
  shape(c, () => rrect(c, 40, y, s, s, 14), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 395, y, s, s, 14), MAT); for (let k = 0; k < 11; k++) line(c, [[415 + k * 25, y + 20], [415 + k * 25, y + s - 20]], 7, MATDK);
  shape(c, () => rrect(c, 750, y, s, s, 60), PIL); shade(c, () => rrect(c, 750, y, s, s, 60), PILDK, 20, 20, 0.9);
  line(c, [[780, y + 40], [1020, y + s - 40]], 5, PILDK); line(c, [[1020, y + 40], [780, y + s - 40]], 5, PILDK);
  shape(c, () => ell(c, 895, y + 145, 24, 24), COL.pink, 4);
};
// ---------------------------------------------------------------- 16 t3 elastic
const t3 = (c: Ctx) => {
  ground(c);
  hand(c, 90, 540, 0, 1.15, SKIN.child, CLOTH.child, true); hand(c, 450, 540, PI, 1.15, SKIN.child, CLOTH.child, true);
  ball(c, 270, 540, 120, 0.62, 1.1);
  arrow(c, [[540, 300], [640, 300]], RED, 10);
  ball(c, 860, 540, 120);
};
// ---------------------------------------------------------------- 17 t4 energy
const t4 = (c: Ctx) => {
  ground(c); woodFloor(c, 860);
  pillow(c, 540, 640, 520, 140, 110, 100);
  ball(c, 540, 695, 70); arrow(c, [[540, 90], [540, 360]]);
  for (const x of [380, 460, 620, 700]) line(c, wavy(x, 600, 260, 14), 8, COL.orange);
};
// ---------------------------------------------------------------- 18 t5 gravity
const t5 = (c: Ctx) => {
  ground(c); c.fillStyle = SKYC; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => ell(c, 540, 1350, 700, 700), COL.blue);
  c.save(); c.beginPath(); ell(c, 540, 1350, 700, 700); c.clip();
  shape(c, () => { c.moveTo(250, 700); c.quadraticCurveTo(350, 640, 470, 700); c.quadraticCurveTo(500, 780, 420, 830); c.quadraticCurveTo(280, 820, 250, 700); c.closePath(); }, COL.green, 5);
  shape(c, () => { c.moveTo(660, 720); c.quadraticCurveTo(780, 680, 860, 760); c.quadraticCurveTo(850, 860, 740, 850); c.quadraticCurveTo(650, 810, 660, 720); c.closePath(); }, COL.green, 5);
  c.restore(); c.beginPath(); ell(c, 540, 1350, 700, 700); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  ball(c, 540, 220, 80); arrow(c, [[540, 360], [540, 620]]);
};
// ---------------------------------------------------------------- 19 t6 friction
const t6 = (c: Ctx) => {
  ground(c); woodFloor(c, 760);
  shape(c, () => rrect(c, 420, 60, 150, 560, 40), SKIN.child);
  const foot = () => { c.moveTo(400, 560); c.lineTo(580, 560); c.lineTo(640, 640); c.quadraticCurveTo(820, 650, 850, 700); c.quadraticCurveTo(870, 756, 820, 758); c.lineTo(400, 758); c.quadraticCurveTo(340, 740, 360, 640); c.closePath(); };
  shape(c, foot, SKIN.child); shade(c, foot, SKIN.childDk, 0, 40, 0.7);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, 850 - k * 12, 700 + k * 14, 22 - k * 2, 20), SKIN.child, 4);
  arrow(c, [[640, 870], [330, 870]]); arrow(c, [[480, 960], [680, 960]], COL.blue, 9);
};
// ---------------------------------------------------------------- 20 t7 rebound height
const t7 = (c: Ctx) => {
  ground(c); tileFloor(c, 900);
  const x = 700, w = 150, step = 70, fy = 900;
  c.beginPath(); c.rect(x + 12, 170, w, fy - 160); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill();
  shape(c, () => c.rect(x, 160, w, fy - 160), COL.paper, 6);
  for (let k = 0; k <= 10; k++) { const y = fy - step * k; line(c, [[x, y], [x + w * 0.3, y]], 6); if (k > 0 && k % 2 === 0) write(c, String(k * 10), x + w * 0.4, y - 17, 34, INK, 5); }
  line(c, [[x, fy - step * 5.5], [x + w * 0.55, fy - step * 5.5]], 9, RED);
  write(c, "55", 500, fy - step * 5.5 - 60, 44, RED, 7);
  dots(c, [[290, fy - step * 5.5], [x - 10, fy - step * 5.5]], 8, RED);
  ball(c, 240, fy - step * 5.5, 52);
};
// ---------------------------------------------------------------- 21 t8 fair test
const t8 = (c: Ctx) => {
  ground(c); woodFloor(c, 900);
  line(c, [[40, 200], [1040, 200]], 6, COL.greyDk);
  [[210, 0], [540, 1], [870, 2]].forEach(([x, k]) => { surfaceTop(c, x, 780, 280, k); ball(c, x, 200, 52); arrow(c, [[x, 290], [x, k === 2 ? 640 : 700]]); });
};
// ---------------------------------------------------------------- 22 t9 curved path
const t9 = (c: Ctx) => {
  ground(c); c.fillStyle = SKYC; c.fillRect(0, 0, 1080, 800); c.fillStyle = GRASS; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  person(c, 170, 960, 520, { armL: [PI * 0.5, PI * 0.5], armR: [-0.7, -0.5] });
  person(c, 910, 960, 520, { adult: true, armL: [-2.3, -2.4], armR: [-2.2, -2.0] });
  dots(c, curve([300, 520], [540, -120], [800, 520]), 10); ball(c, 550, 180, 50);
};
// ---------------------------------------------------------------- 23 t10 angle
const t10 = (c: Ctx) => {
  ground(c);
  hand(c, 20, 880, 0, 1.1, SKIN.child, CLOTH.child, true);
  const P = [230, 880];
  arrow(c, [P, [760, 880]]); arrow(c, [P, [230 + 380, 880 - 380]]); arrow(c, [P, [230, 360]]);
  line(c, arc(P[0], P[1], 170, 170, -PI / 2, 0), 5, COL.greyDk); line(c, arc(P[0], P[1], 120, 120, -PI / 2, -PI / 4), 5, COL.greyDk);
  write(c, "0", 800, 840, 70, INK, 8); write(c, "°", 850, 840, 70, INK, 8);
  write(c, "45", 660, 440, 70, INK, 8); write(c, "°", 770, 440, 70, INK, 8);
  write(c, "90", 290, 330, 70, INK, 8); write(c, "°", 400, 330, 70, INK, 8);
};
// ---------------------------------------------------------------- 24 t11 spin
const t11 = (c: Ctx) => {
  ground(c); football(c, 540, 540, 230, 0.5);
  arrow(c, arc(540, 540, 340, 340, 3.3, 5.0)); arrow(c, arc(540, 540, 340, 340, 0.15, 1.85));
};
// ---------------------------------------------------------------- 25 t12 tendon
const t12 = (c: Ctx) => {
  ground(c); woodFloor(c, 860);
  const leg = () => { c.moveTo(420, 40); c.lineTo(660, 40); c.lineTo(640, 520); c.lineTo(620, 640); c.quadraticCurveTo(760, 650, 840, 720); c.quadraticCurveTo(900, 790, 840, 850); c.lineTo(360, 850); c.quadraticCurveTo(330, 760, 400, 690); c.lineTo(420, 560); c.quadraticCurveTo(300, 330, 420, 40); c.closePath(); };
  shape(c, leg, SKIN.child); shade(c, leg, SKIN.childDk, 40, 20, 0.6);
  const tend = () => { c.moveTo(380, 280); c.quadraticCurveTo(450, 250, 480, 300); c.lineTo(450, 560); c.lineTo(425, 760); c.lineTo(385, 760); c.lineTo(392, 560); c.closePath(); };
  shape(c, tend, COL.pink, 6);
  line(c, [[415, 330], [420, 740]], 4, "#d77a97"); line(c, [[440, 330], [410, 740]], 4, "#d77a97");
};
// ---------------------------------------------------------------- 26 t13 air resistance
const t13 = (c: Ctx) => {
  ground(c); c.fillStyle = SKYC; c.fillRect(0, 0, 1080, 1080); line(c, [[540, 0], [540, 1080]], 6);
  const pb = () => { c.moveTo(270, 400); c.lineTo(340, 430); c.lineTo(360, 510); c.lineTo(330, 590); c.lineTo(250, 610); c.lineTo(190, 560); c.lineTo(180, 480); c.lineTo(210, 420); c.closePath(); };
  shape(c, pb, COL.paper); shade(c, pb, COL.cloth, 30, 30, 1); line(c, [[210, 440], [280, 500], [240, 560]], 4, COL.grey); line(c, [[330, 470], [290, 520], [340, 570]], 4, COL.grey);
  for (const x of [230, 310]) arrow(c, [[x, 800], [x, 700]], RED, 8);
  arrow(c, [[270, 130], [270, 300]], COL.greyDk, 10);
  const sh = () => polyP(c, [[640, 440], [960, 400], [1000, 560], [680, 600]]);
  shape(c, sh, COL.paper); shade(c, sh, COL.cloth, 0, 30, 1);
  for (const x of [680, 780, 880, 960]) arrow(c, [[x, 900], [x, 700]], RED, 8);
  arrow(c, [[810, 130], [810, 300]], COL.greyDk, 10);
};
// ---------------------------------------------------------------- 27 ex0 how a ball bounces
const ex0 = (c: Ctx) => {
  ground(c); tileFloor(c, 820);
  line(c, [[360, 0], [360, 1080]], 6); line(c, [[720, 0], [720, 1080]], 6);
  ball(c, 180, 300, 60); arrow(c, [[180, 400], [180, 640]]);
  ball(c, 540, 755, 62, 1.4, 0.6);
  ball(c, 900, 540, 60); arrow(c, [[900, 700], [900, 640]], RED, 10);
};
// ---------------------------------------------------------------- 28 ex1 why the surface matters
const ex1 = (c: Ctx) => {
  ground(c); woodFloor(c, 900);
  slab(c, 270, 700, 440); ball(c, 270, 650, 58, 1.4, 0.62);
  pillow(c, 810, 640, 440, 130, 90, 90); ball(c, 810, 680, 58);
  line(c, [[540, 0], [540, 1080]], 6);
};
// ---------------------------------------------------------------- 29 ex2 where a bounce goes
const ex2 = (c: Ctx) => {
  ground(c); tileFloor(c, 820);
  ball(c, 90, 220, 48);
  const xs = [150, 340, 500, 630, 730, 800];
  dots(c, curve([90, 280], [120, 500], [xs[0], 790]), 8);
  for (let i = 0; i < 5; i++) dots(c, curve([xs[i], 790], [(xs[i] + xs[i + 1]) / 2, 790 - 2 * [380, 260, 160, 90, 45][i]], [xs[i + 1], 790]), 8);
  xs.slice(0, 4).forEach((x, i) => { for (const rr of i < 2 ? [45, 75] : [45]) { line(c, arc(x, 800, rr, rr, -0.55, 0.55), 6, COL.orange); line(c, arc(x, 800, rr, rr, PI - 0.55, PI + 0.55), 6, COL.orange); } });
  ball(c, 920, 770, 48);
};

export const ic_motionPhysicsOfSportL3 = cards("sci.motion.physics-of-sport.L3 cards", [intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, ex0, ex1, ex2]);
