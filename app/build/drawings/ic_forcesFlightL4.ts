import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// STEERING THROUGH AIR (sci.forces.flight.L4) · flat set-up cards and flow cards: parachutes, paper planes,
// a card in a fan's wind, whirls behind a spoon, smoke, a balance point, a shuttlecock, a wind shadow,
// a straw hoop glider and a cup wind meter. Light from the upper left, flat colours, bold ink outline.

const PI = Math.PI;
const POLY = "rgba(226,240,250,0.88)", POLY_DK = "#a9c8e0", PAPER = COL.paper, PAPER_DK = "#e9dfc6", FLOOR = "#e2d3b4";
const dash = (c: Ctx, pts: number[][], w: number, col: string, d: number[] = [16, 14]) => { c.save(); c.setLineDash(d); line(c, pts, w, col); c.restore(); };
const floor = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
// points along a quadratic curve from p0 over p1 to p2
const bez = (p0: number[], p1: number[], p2: number[], n = 40) => { const o: number[][] = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]); } return o; };
// points along a circle arc, centre (x, y), from angle a0 to a1
const arc = (x: number, y: number, r: number, a0: number, a1: number, n = 30) => { const o: number[][] = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return o; };
// a whirl: a spiral winding outward from (x, y), dir 1 clockwise, -1 anticlockwise
const spiral = (c: Ctx, x: number, y: number, r: number, turns: number, dir: number, col: string, w: number) => { const pts: number[][] = [], N = Math.round(40 * turns); for (let i = 0; i <= N; i++) { const t = i / N, a = t * turns * 2 * PI * dir, rr = r * (0.12 + 0.88 * t); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } line(c, pts, w, col); };
// wind: wavy blue lines moving right from (x, y) with a small head at the end
const wind = (c: Ctx, x: number, y: number, len: number, col: string = COL.blueDk) => {
  const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([x + t * len, y + Math.sin(t * PI * 3) * 7]); }
  c.globalAlpha = 0.85; line(c, pts, 5, col); const e = pts[24]; line(c, [[e[0] - 16, e[1] - 12], e, [e[0] - 16, e[1] + 12]], 5, col); c.globalAlpha = 1;
};

// ---------------------------------------------------------------- things
// a square of polythene lying flat, top-left corner (x, y)
const polySheet = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), POLY, 6);
  c.globalAlpha = 0.7; line(c, [[x + w * 0.22, y + h * 0.06], [x + w * 0.34, y + h * 0.94]], 3, POLY_DK); line(c, [[x + w * 0.06, y + h * 0.62], [x + w * 0.94, y + h * 0.4]], 3, POLY_DK); c.globalAlpha = 1;
};
// a wooden ruler lying flat, left end at (x, y), cm long at px pixels per centimetre
const rulerH = (c: Ctx, x: number, y: number, cm: number, px: number, h = 60) => {
  const len = cm * px + 44;
  shadow(c, x + len / 2 + 10, y + h + 6, len / 2, 9);
  shape(c, () => rrect(c, x, y, len, h, 6), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(x + 4, y + h - 13, len - 8, 9);
  c.strokeStyle = INK; c.lineCap = "butt";
  const sub = px >= 40 ? 10 : px >= 20 ? 2 : 1;
  for (let m = 0; m <= cm * sub; m++) { const mx = x + 22 + (m * px) / sub, big = m % sub === 0, mid = sub === 10 && m % 5 === 0; c.lineWidth = big ? 3 : 2; c.beginPath(); c.moveTo(mx, y); c.lineTo(mx, y + (big ? h * 0.42 : mid ? h * 0.3 : h * 0.18)); c.stroke(); }
  const step = px < 30 ? 5 : 1;
  for (let k = 0; k <= cm; k += step) write(c, String(k), x + 22 + k * px - (k >= 10 ? 14 : 7), y + h * 0.5, h * 0.36, INK, 3);
};
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); shade(c, () => ell(c, x, y, r, r), COL.woodDk, -r * 0.3, -r * 0.3, 0.5);
  shape(c, () => ell(c, x, y, r * 0.62, r * 0.62), COL.yellow, 3);
};
const tape = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 3), "rgba(255,222,110,0.85)", 3); c.restore(); };
// an open parachute: canopy bottom edge at (x, y), w wide, coin hanging drop below
const chute = (c: Ctx, x: number, y: number, w: number, drop: number) => {
  const top = y - w * 0.46, kx = x, ky = y + drop - w * 0.16;
  const dome = () => { c.moveTo(x - w / 2, y); c.bezierCurveTo(x - w / 2, top, x + w / 2, top, x + w / 2, y); c.quadraticCurveTo(x, y + w * 0.1, x - w / 2, y); c.closePath(); };
  [-0.5, -0.17, 0.17, 0.5].forEach((f) => line(c, [[x + f * w, y + (Math.abs(f) < 0.3 ? w * 0.07 : 0)], [kx, ky]], 4, INK));
  shape(c, dome, POLY, 6); shade(c, dome, POLY_DK, -w * 0.09, -w * 0.05, 0.45);
  line(c, [[x - w * 0.17, y + w * 0.07], [x - w * 0.2, top + w * 0.08]], 3, POLY_DK); line(c, [[x + w * 0.17, y + w * 0.07], [x + w * 0.2, top + w * 0.08]], 3, POLY_DK);
  shape(c, () => ell(c, kx, ky, w * 0.035, w * 0.035), INK, 0);
  line(c, [[kx, ky], [x, y + drop - w * 0.1]], 4, INK);
  coin(c, x, y + drop, Math.max(24, w * 0.1));
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.2, y - r * 1.32, r * 0.4, r * 0.4, 5), COL.steelDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 5); shape(c, () => ell(c, x, y, r * 0.74, r * 0.74), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * PI; line(c, [[x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 3, INK); }
  line(c, [[x, y], [x, y - r * 0.55]], 4, RED); line(c, [[x, y], [x + r * 0.3, y + r * 0.25]], 4, INK);
};
// a paper plane from the side, nose at (x, y) pointing right (then turned by rot); flap > 0 bends the back of the wing up
const planeSide = (c: Ctx, x: number, y: number, s: number, rot: number, flap = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[0, 0], [-200, -8], [-172, 46]]), PAPER_DK, 6);
  shape(c, () => polyP(c, [[0, 0], [-206, -54], [-200, -8]]), PAPER, 6);
  if (flap) shape(c, () => polyP(c, [[-206, -54], [-200, -8], [-214, -8 - flap], [-220, -54 - flap]]), PAPER, 5);
  line(c, [[0, 0], [-200, -8]], 3, PAPER_DK);
  c.restore();
};
// a paper plane seen from behind, bottom of the fuselage at (x, y); flap > 0 bends the back edges of both wings up by flap
const planeRear = (c: Ctx, x: number, y: number, s: number, flap = 0) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const m of [-1, 1]) shape(c, () => polyP(c, [[m * 18, -120], [m * 330, -176], [m * 330, -152], [m * 18, -96]]), PAPER, 6);
  shape(c, () => rrect(c, -18, -122, 36, 122, 4), PAPER_DK, 6);
  if (flap) for (const m of [-1, 1]) shape(c, () => polyP(c, [[m * 310, -172], [m * 140, -142], [m * 140, -142 - flap], [m * 310, -172 - flap]]), PAPER, 5);
  c.restore();
};
// a shuttlecock: cork tip at (x, y) pointing at angle an, the feather skirt behind it
const shuttle = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => polyP(c, [[-30, -26], [-150, -72], [-150, 72], [-30, 26]]), WHITE, 6);
  for (let k = -2; k <= 2; k++) line(c, [[-42, k * 11], [-146, k * 32]], 3, COL.grey);
  shape(c, () => ell(c, -150, 0, 13, 72), "#eeeeee", 5);
  shape(c, () => { c.moveTo(-36, -30); c.lineTo(-8, -30); c.quadraticCurveTo(28, -30, 28, 0); c.quadraticCurveTo(28, 30, -8, 30); c.lineTo(-36, 30); c.closePath(); }, "#e9d8bf", 6);
  shape(c, () => rrect(c, -40, -32, 14, 64, 4), COL.blue, 4);
  c.restore();
};
// a table fan facing right, centre of the round grille at (x, y), grille radius r
const fan = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x - r * 0.1, y + r * 1.62, r * 0.85, r * 0.13);
  shape(c, () => ell(c, x - r * 0.2, y + r * 1.55, r * 0.72, r * 0.15), COL.steelDk, 5);
  shape(c, () => rrect(c, x - r * 0.27, y + r * 0.55, r * 0.14, r, 6), COL.steel, 5);
  const box = () => rrect(c, x - r * 0.8, y - r * 0.32, r * 0.62, r * 0.64, 14);
  shape(c, box, COL.teal, 6); shade(c, box, COL.tealDk, -r * 0.1, -r * 0.1, 0.5);
  shape(c, () => ell(c, x, y, r * 0.42, r), COL.steelIn, 6);
  c.save(); c.beginPath(); ell(c, x, y, r * 0.42, r); c.clip();
  for (let k = 0; k < 3; k++) { const a = -PI / 2 + (k * 2 * PI) / 3; shape(c, () => ell(c, x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.5, r * 0.15, r * 0.42, a + PI / 2), COL.teal, 4); }
  c.restore();
  for (let k = 0; k < 8; k++) { const a = (k / 8) * 2 * PI; line(c, [[x, y], [x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r]], 2.5, COL.steelDk); }
  shape(c, () => ell(c, x, y, r * 0.1, r * 0.23), COL.steelDk, 4);
};
// a thick book standing on its long edge, seen from the side (its front board faces left): left-bottom corner at (x, y)
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + 6, w * 0.9, 12);
  shape(c, () => rrect(c, x, y - h, w, h, 6), COL.red, 6); shade(c, () => rrect(c, x, y - h, w, h, 6), "#b23a28", -w * 0.3, 0, 0.5);
  shape(c, () => rrect(c, x + w * 0.1, y - h + 6, w * 0.8, 16, 3), WHITE, 3);
};
// a thin stick with a cloth ribbon tied to its top: stick bottom at (x, y); calm = hangs down, else streams right
const ribbon = (c: Ctx, x: number, y: number, h: number, calm: boolean) => {
  shape(c, () => rrect(c, x - 7, y - h, 14, h, 5), COL.brown, 5);
  const pts: number[][] = [];
  if (calm) for (let i = 0; i <= 20; i++) pts.push([x + 4 + Math.sin(i * 0.9) * 10, y - h + 8 + i * 13]);
  else for (let i = 0; i <= 20; i++) pts.push([x + 6 + i * 14, y - h + 8 + Math.sin(i * 0.9) * 22]);
  line(c, pts, 30, INK); line(c, pts, 20, COL.pink);
};
// a hexagonal steel nut hanging at (x, y)
const nut = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => polyP(c, arc(x, y, r, PI / 6, PI / 6 + 2 * PI, 6).slice(0, 6)), COL.steelDk, 5); shape(c, () => ell(c, x, y, r * 0.4, r * 0.4), COL.steelIn, 4); };
// the lopsided card shape used to find a balance point: drawn in the shape's own frame with the pin hole at (0, 0)
const lopsided = (c: Ctx, hole: number) => {
  const P = hole === 0
    ? [[0, 0], [150, 60], [230, 240], [170, 440], [-60, 500], [-200, 400], [-230, 220], [-130, 60]]
    : [[0, 0], [60, 80], [280, 220], [300, 400], [90, 560], [-120, 520], [-180, 360], [-100, 140]];
  shape(c, () => polyP(c, P), COL.yellow, 6);
};

// ================================================================ set-up cards: e1 Parachute Races
// 1. two polythene squares, 20 cm and 40 cm, and a ruler
const e1s0 = (c: Ctx) => {
  ground(c);
  write(c, "40 cm", 656, 96, 56); polySheet(c, 520, 180, 480, 480);
  write(c, "20 cm", 100, 338, 56); polySheet(c, 80, 420, 240, 240);
  rulerH(c, 80, 760, 30, 12, 64);
};
// 2. a string taped to each corner, the four strings knotted, a coin taped to the knot
const e1s1 = (c: Ctx) => {
  ground(c);
  const corners = [[300, 150], [780, 150], [930, 450], [150, 450]], kx = 540, ky = 790;
  const canopy = () => polyP(c, corners);
  shape(c, canopy, POLY, 6); shade(c, canopy, POLY_DK, -40, -20, 0.4);
  c.globalAlpha = 0.7; line(c, [[380, 180], [330, 430]], 3, POLY_DK); line(c, [[720, 170], [790, 420]], 3, POLY_DK); c.globalAlpha = 1;
  corners.forEach(([x, y]) => line(c, [[x, y], [kx, ky]], 4, INK));
  corners.forEach(([x, y]) => tape(c, x + (kx - x) * 0.06, y + (ky - y) * 0.06, 54, 30, Math.atan2(ky - y, kx - x) + PI / 2));
  shape(c, () => ell(c, kx, ky, 15, 15), INK, 0);
  line(c, [[kx, ky], [kx, 850]], 4, INK);
  coin(c, kx, 900, 56);
  tape(c, kx, 870, 70, 28, 0);
};
// 3. an adult holds a parachute at the 2 m tape mark; the child has the stopwatch ready
const e1s2 = (c: Ctx) => {
  ground(c); floor(c, 960);
  tape(c, 500, 262, 100, 26, 0); write(c, "2 m", 620, 240, 48);
  const A = person(c, 280, 960, 640, { adult: true, reachR: [430, 306] });
  const [hx, hy] = A.handR;
  // the bunched canopy hangs from the pinched hand, strings down to the coin
  const bunch = () => { c.moveTo(hx + 4, hy + 6); c.quadraticCurveTo(hx + 70, hy + 60, hx + 72, hy + 150); c.quadraticCurveTo(hx + 68, hy + 182, hx + 46, hy + 186); c.quadraticCurveTo(hx + 22, hy + 150, hx + 4, hy + 6); c.closePath(); };
  shape(c, bunch, POLY, 6); shade(c, bunch, POLY_DK, -14, -8, 0.45);
  [[hx + 30, hy + 182], [hx + 46, hy + 186], [hx + 62, hy + 182]].forEach((p) => line(c, [p, [hx + 46, hy + 250]], 3, INK));
  coin(c, hx + 46, hy + 274, 26);
  const K = person(c, 790, 960, 440, { dir: -1, reachR: [884, 724] });
  stopwatch(c, K.handR[0], K.handR[1] - 34, 36);
};
// 4. the parachute floats down and the child times it
const e1s3 = (c: Ctx) => {
  ground(c); floor(c, 960);
  chute(c, 400, 330, 340, 300);
  arrow(c, [[560, 640], [560, 850]]);
  const K = person(c, 800, 960, 440, { dir: -1, reachR: [894, 724] });
  stopwatch(c, K.handR[0], K.handR[1] - 34, 36);
};

// ================================================================ set-up cards: e2 Steer a Paper Plane
// 1. a sheet folded in half lengthways and opened; the top corners folded to the centre line
const e2s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 110, 230, 300, 424, 4), PAPER, 6); dash(c, [[260, 236], [260, 648]], 4, COL.greyDk);
  arrow(c, [[460, 440], [580, 440]]);
  const x = 640, y = 230, w = 300, cx = x + w / 2;
  shape(c, () => polyP(c, [[cx, y], [x + w, y + 150], [x + w, y + 424], [x, y + 424], [x, y + 150]]), PAPER, 6);
  shape(c, () => polyP(c, [[cx, y], [x, y + 150], [cx, y + 150]]), PAPER_DK, 5);
  shape(c, () => polyP(c, [[cx, y], [x + w, y + 150], [cx, y + 150]]), PAPER_DK, 5);
  dash(c, [[cx, y + 160], [cx, y + 418]], 4, COL.greyDk);
};
// 2. the slanted edges folded to the centre, the plane folded in half, the wings folded down
const e2s1 = (c: Ctx) => {
  ground(c);
  const x = 60, y = 300, w = 240, cx = x + w / 2;
  shape(c, () => polyP(c, [[cx, y], [x + w, y + 300], [x + w, y + 420], [x, y + 420], [x, y + 300]]), PAPER, 6);
  shape(c, () => polyP(c, [[cx, y], [x, y + 300], [cx, y + 330]]), PAPER_DK, 5);
  shape(c, () => polyP(c, [[cx, y], [x + w, y + 300], [cx, y + 330]]), PAPER_DK, 5);
  dash(c, [[cx, y + 340], [cx, y + 414]], 4, COL.greyDk);
  arrow(c, [[330, 520], [410, 520]]);
  shape(c, () => polyP(c, [[700, 640], [440, 640], [440, 470]]), PAPER_DK, 6);
  shape(c, () => polyP(c, [[700, 640], [440, 470], [440, 440]]), PAPER, 6);
  arrow(c, [[740, 520], [820, 520]]);
  planeRear(c, 895, 650, 0.52);
};
// 3. the back 1 cm of each wing bent up, a ruler beside it
const e2s2 = (c: Ctx) => {
  ground(c);
  planeRear(c, 500, 720, 1, 60);
  c.save(); c.translate(960, 740); c.rotate(-PI / 2); rulerH(c, 0, 0, 5, 60, 56); c.restore();
  write(c, "1 cm", 300, 360, 48, RED);
  arrow(c, [[380, 420], [360, 500]], RED, 7);
};
// 4. the child throws a plane level from the start line; chalk marks where it lands
const e2s3 = (c: Ctx) => {
  ground(c); floor(c, 880);
  line(c, [[250, 1010], [300, 884]], 10, WHITE);
  const K = person(c, 230, 880, 460, { reachR: [420, 596] });
  const [hx, hy] = K.handR, s = 0.9;
  planeSide(c, hx + 110 * s, hy - 44 * s, s, 0);
  dash(c, bez([hx + 120 * s, hy - 50 * s], [600, 560], [820, 905]), 5, COL.greyDk, [10, 16]);
  for (const [mx, my] of [[820, 918], [930, 940]]) { line(c, [[mx - 40, my - 12], [mx + 40, my + 12]], 9, WHITE); line(c, [[mx - 40, my + 12], [mx + 40, my - 12]], 9, WHITE); }
};

// ================================================================ flow cards
// e1: a small and a big parachute with the same coin; the small one is already lower, falling faster
const fE1 = (c: Ctx) => {
  ground(c); floor(c, 960);
  chute(c, 290, 500, 220, 230); arrow(c, [[400, 720], [400, 900]]);
  chute(c, 740, 300, 440, 300); arrow(c, [[960, 580], [960, 660]]);
};
// e2: both back edges bent up, the nose rises
const fE2 = (c: Ctx) => {
  ground(c);
  planeSide(c, 760, 560, 2.2, -0.12, 36);
  arrow(c, bez([800, 520], [930, 440], [960, 300]), RED, 10);
  dash(c, bez([160, 820], [420, 760], [330, 590]), 5, COL.greyDk, [10, 16]);
};
// a1: the card hangs on a thread in front of the fan and is blown sideways; a ruler lies under it
const fA1 = (c: Ctx) => {
  ground(c); floor(c, 900);
  shape(c, () => rrect(c, 420, 90, 420, 34, 6), COL.wood, 6);
  fan(c, 180, 560, 190); for (let k = 0; k < 4; k++) wind(c, 290, 440 + k * 80, 180);
  const tx = 600, ty = 124, an = 0.6, L = 420, cx = tx + Math.sin(an) * L, cy = ty + Math.cos(an) * L;
  dash(c, [[tx, ty], [tx, 840]], 4, COL.greyDk);
  line(c, [[tx, ty], [cx, cy]], 4, INK); tape(c, tx, ty + 6, 44, 22, 0);
  // the card is a thin slab whose flat face looks at the fan: its edge runs along the thread, its face seen at an angle to the left
  c.save(); c.translate(cx, cy); c.rotate(-an);
  shape(c, () => polyP(c, [[-8, 0], [-78, 34], [-78, 224], [-8, 190]]), "#f6b8cc", 6);
  shape(c, () => rrect(c, -8, 0, 16, 190, 4), COL.pink, 6);
  c.restore();
  rulerH(c, 520, 846, 30, 12, 34);
  arrow(c, [[tx, 820], [cx + Math.sin(an) * 60, 820]]);
};
// a2: the back of a spoon pulled across a tray of peppered water leaves two spinning whirls behind it
const fA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 450, 30);
  shape(c, () => rrect(c, 60, 180, 960, 700, 40), COL.steel, 6);
  shape(c, () => rrect(c, 100, 220, 880, 620, 28), COL.water, 5);
  const r = rnd(5);
  for (let i = 0; i < 520; i++) { const x = 120 + r() * 840, y = 240 + r() * 580; if (Math.hypot(x - 700, y - 530) < 120) continue; if (x > 520 && x < 700 && Math.abs(y - 530) < 60) continue; shape(c, () => ell(c, x, y, 4 + r() * 3, 4 + r() * 3), INK, 0); }
  spiral(c, 880, 420, 90, 2.2, -1, INK, 6); spiral(c, 880, 640, 90, 2.2, 1, INK, 6);
  shape(c, () => rrect(c, 380, 518, 300, 24, 12), COL.steel, 5);
  const head = () => ell(c, 700, 530, 72, 96); shape(c, head, COL.steel, 6); shade(c, head, COL.steelDk, -26, -20, 0.5);
  hand(c, 300, 530, 0, 1.1, SKIN.child, CLOTH.child);
  arrow(c, [[690, 400], [520, 400]]);
};
// a3: an incense ribbon in a dark room, a card has just swished past and the smoke curls where it went
const fA3 = (c: Ctx) => {
  ground(c, "#3a3458"); c.fillStyle = "#5a4a3a"; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  shape(c, () => rrect(c, 300, 840, 180, 60, 10), COL.brown, 6);
  line(c, [[390, 840], [410, 620]], 7, INK); line(c, [[390, 840], [410, 620]], 4, "#8a6a4a");
  shape(c, () => ell(c, 410, 616, 9, 9), COL.orange, 0);
  const smoke = "#d9d4ea";
  c.globalAlpha = 0.9; line(c, [[410, 608], [413, 520], [408, 430]], 7, smoke);
  // the card went by from left to right at this height: the smoke curls where it passed
  line(c, [[408, 430], [404, 380], [430, 345], [470, 340]], 7, smoke);
  spiral(c, 480, 300, 80, 2, 1, smoke, 7); spiral(c, 590, 230, 64, 1.8, -1, smoke, 7); spiral(c, 640, 380, 58, 1.6, -1, smoke, 6);
  c.globalAlpha = 1;
  shape(c, () => rrect(c, 730, 210, 190, 280, 8), COL.pink, 6);
  hand(c, 825, 568, -PI / 2, 1.1, SKIN.child, CLOTH.child);
  arrow(c, [[930, 350], [1030, 350]], RED, 8);
};
// a4: the lopsided card hangs from a pin with a plumb line; two drawn lines cross at the balance point
const fA4 = (c: Ctx) => {
  ground(c);
  const px = 540, py = 150;
  c.save(); c.translate(px, py); c.rotate(0.12); lopsided(c, 0); c.restore();
  // the earlier line (from the first hole) and the line along the thread now
  c.save(); c.translate(px, py); c.rotate(0.12); line(c, [[150, 60], [-210, 330]], 5, COL.greyDk); shape(c, () => ell(c, 138, 69, 9, 9), INK, 0); c.restore();
  line(c, [[px, py], [px, 740]], 4, INK);
  line(c, [[px, py + 10], [px + 3, 470]], 5, COL.greyDk);
  nut(c, px, 770, 32);
  shape(c, () => ell(c, px + 1, 362, 16, 16), RED, 4);
  shape(c, () => ell(c, px, py, 16, 16), COL.red, 5);
};
// a5: tossed feathers first, the shuttlecock turns round and flies cork first
const fA5 = (c: Ctx) => {
  ground(c); floor(c, 940);
  shuttle(c, 240, 300, PI, 1.1);
  arrow(c, [[300, 180], [430, 180]], COL.blueDk, 7);
  dash(c, bez([400, 300], [700, 240], [820, 620]), 5, COL.greyDk, [10, 16]);
  arrow(c, arc(640, 330, 100, -PI * 0.55, PI * 0.5), RED, 9);
  shuttle(c, 860, 700, PI * 0.42, 1.1);
};
// a6: a book stands in the fan's wind, the ribbon hangs calm in the shadow right behind it
const fA6 = (c: Ctx) => {
  ground(c); floor(c, 1000);
  fan(c, 170, 640, 190); for (let k = 0; k < 2; k++) wind(c, 280, 560 + k * 70, 230);
  wind(c, 280, 440, 400); for (let k = 0; k < 2; k++) wind(c, 280, 860 + k * 50, 230);
  book(c, 560, 1000, 90, 500);
  // the stick is drawn first so the child's hand closes over it; the ribbon hangs wholly below the book's top
  ribbon(c, 745, 852, 350, true);
  person(c, 890, 1000, 440, { dir: -1, reachL: [745, 792] });
};
// p1: the straw hoop glider flies small ring first
const fP1 = (c: Ctx) => {
  ground(c);
  const y = 540;
  shape(c, () => rrect(c, 260, y - 9, 560, 18, 9), COL.orange, 6);
  c.beginPath(); ell(c, 340, y, 42, 132); c.lineWidth = 34; c.strokeStyle = INK; c.stroke(); c.lineWidth = 22; c.strokeStyle = PAPER; c.stroke();
  c.beginPath(); ell(c, 740, y, 26, 80); c.lineWidth = 34; c.strokeStyle = INK; c.stroke(); c.lineWidth = 22; c.strokeStyle = PAPER; c.stroke();
  tape(c, 340, y, 40, 26, 0); tape(c, 740, y, 40, 26, 0);
  arrow(c, [[560, 760], [900, 760]]);
};
// p2: the cup wind meter spins in the fan's wind
const fP2 = (c: Ctx) => {
  ground(c); floor(c, 920);
  fan(c, 160, 560, 180); for (let k = 0; k < 4; k++) wind(c, 270, 420 + k * 80, 150);
  const cx = 700, cy = 500;
  shape(c, () => polyP(c, [[cx - 14, cy + 30], [cx + 14, cy + 30], [cx + 14, 890], [cx, 920], [cx - 14, 890]]), COL.yellow, 6);
  shape(c, () => rrect(c, cx - 16, cy + 10, 32, 36, 5), COL.pink, 5);
  // the cross of straws lies flat, seen from a little above: the near-far straw is foreshortened
  const cup = (x: number, y: number, side: number, k: number) => {
    const w = 80 * k, h = 90 * k;
    if (side === 0) { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.cloth, 5); shape(c, () => ell(c, x, y, w * 0.42, h * 0.42), COL.grey, 4); }
    else if (side === 2) { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.cloth, 5); shape(c, () => ell(c, x, y, w * 0.3, h * 0.3), "#e9e4d6", 4); }
    else { const col = side === -1 ? COL.red : COL.cloth; shape(c, () => polyP(c, [[x - side * w * 0.5, y - h * 0.36], [x + side * w * 0.5, y - h * 0.5], [x + side * w * 0.5, y + h * 0.5], [x - side * w * 0.5, y + h * 0.36]]), col, 5); shape(c, () => ell(c, x + side * w * 0.5, y, 11, h * 0.5), side === -1 ? "#b23a28" : COL.grey, 4); }
  };
  shape(c, () => rrect(c, cx - 7, cy - 60, 14, 120, 7), COL.orange, 5);
  cup(cx, cy - 72, -1, 0.85);
  shape(c, () => rrect(c, cx - 170, cy - 7, 340, 14, 7), COL.orange, 5);
  cup(cx - 210, cy, 0, 1); cup(cx + 210, cy, 2, 1);
  shape(c, () => ell(c, cx, cy, 8, 8), COL.steelDk, 3);
  cup(cx, cy + 80, 1, 1.15);
  // seen from above the meter goes round anticlockwise: the far side moves right
  arrow(c, arc(cx, cy, 1, -PI * 0.88, -PI * 0.12, 30).map(([x, y]) => [cx + (x - cx) * 270, cy - 40 + (y - cy) * 90]), RED, 8);
};

export const ic_forcesFlightL4 = cards("sci.forces.flight.L4", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, fE1, fE2, fA1, fA2, fA3, fA4, fA5, fA6, fP1, fP2]);
