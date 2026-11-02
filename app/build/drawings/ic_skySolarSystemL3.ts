import type { Ctx } from "./core";
import { INK, BG, COL, WHITE, RED, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, cards } from "./flatKit";

// sci.sky.solar-system.L3 cards: planets, the Sun, orbits, light spreading, and the activities.
const NIGHT = "#26224f";
const stars = (c: Ctx, seed: number, n: number, keep: (x: number, y: number) => boolean = () => true) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const x = 30 + r() * 1020, y = 30 + r() * 1020, s = 2 + r() * 3; if (!keep(x, y)) continue; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6d6"; c.fill(); }
};
const night = (c: Ctx, seed = 3, n = 60, keep?: (x: number, y: number) => boolean) => { ground(c, NIGHT); stars(c, seed, n, keep); };
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); };
const dash = (c: Ctx, pts: number[][], w = 5, col = "rgba(255,246,214,0.55)") => { c.save(); c.setLineDash([16, 14]); line(c, pts, w, col); c.restore(); };
const ring = (c: Ctx, x: number, y: number, r: number, col = "rgba(255,246,214,0.5)", w = 4) => { c.save(); c.setLineDash([14, 12]); c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.restore(); };

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, b = 0.13; shape(c, () => polyP(c, [[x + Math.cos(a - b) * r * 1.05, y + Math.sin(a - b) * r * 1.05], [x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5], [x + Math.cos(a + b) * r * 1.05, y + Math.sin(a + b) * r * 1.05]]), COL.orange, Math.max(3, r * 0.05)); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.06));
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.45);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", Math.max(4, r * 0.06));
};

// a ball with a shade side; detail drawn inside it by `inner`
const ball = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, inner?: () => void) => {
  const lw = Math.max(3, r * 0.07), body = () => ell(c, x, y, r, r);
  shape(c, body, col, lw);
  c.save(); c.beginPath(); body(); c.clip();
  if (inner) inner();
  c.restore();
  shade(c, body, dk, r * 0.3, r * 0.25, 0.55);
  shape(c, body, "rgba(0,0,0,0)", lw);
};
const crater = (c: Ctx, x: number, y: number, r: number, dk: string) => shape(c, () => ell(c, x, y, r, r * 0.75), dk, Math.max(2, r * 0.18));
type PName = "mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune";
const planet = (c: Ctx, name: PName, x: number, y: number, r: number) => {
  const lw = Math.max(3, r * 0.07);
  if (name === "mercury") ball(c, x, y, r, "#b3aea6", "#7d7870", () => { crater(c, x - r * 0.35, y - r * 0.25, r * 0.22, "#8f8a82"); crater(c, x + r * 0.3, y + r * 0.2, r * 0.3, "#8f8a82"); crater(c, x - r * 0.1, y + r * 0.55, r * 0.15, "#8f8a82"); });
  if (name === "venus") ball(c, x, y, r, "#f2cf8a", "#d9a45a", () => { for (const k of [-0.5, -0.1, 0.3, 0.65]) { c.beginPath(); c.moveTo(x - r, y + r * k); c.quadraticCurveTo(x - r * 0.3, y + r * (k - 0.25), x + r * 0.2, y + r * k); c.quadraticCurveTo(x + r * 0.6, y + r * (k + 0.2), x + r, y + r * (k - 0.05)); c.strokeStyle = "rgba(255,248,225,0.8)"; c.lineWidth = Math.max(3, r * 0.1); c.stroke(); } });
  if (name === "earth") ball(c, x, y, r, COL.blue, COL.blueDk, () => {
    shape(c, () => { c.moveTo(x - r * 0.75, y - r * 0.2); c.quadraticCurveTo(x - r * 0.3, y - r * 0.85, x + r * 0.1, y - r * 0.3); c.quadraticCurveTo(x - r * 0.1, y + r * 0.2, x - r * 0.4, y + r * 0.45); c.closePath(); }, COL.green, lw * 0.7);
    shape(c, () => { c.moveTo(x + r * 0.3, y + r * 0.1); c.quadraticCurveTo(x + r * 0.95, y - r * 0.1, x + r * 0.7, y + r * 0.65); c.quadraticCurveTo(x + r * 0.4, y + r * 0.75, x + r * 0.3, y + r * 0.1); c.closePath(); }, COL.green, lw * 0.7);
    line(c, [[x - r * 0.2, y - r * 0.7], [x + r * 0.35, y - r * 0.55]], Math.max(3, r * 0.1), WHITE);
  });
  if (name === "mars") ball(c, x, y, r, "#d9623b", "#a8411f", () => { crater(c, x - r * 0.3, y + r * 0.1, r * 0.3, "#b04526"); crater(c, x + r * 0.35, y - r * 0.2, r * 0.22, "#b04526"); shape(c, () => ell(c, x, y - r * 0.9, r * 0.4, r * 0.2), WHITE, lw * 0.6); });
  if (name === "jupiter") ball(c, x, y, r, "#e9c9a0", "#c58f5b", () => { [[-0.7, 0.18, "#c58f5b"], [-0.25, 0.14, "#b87a4a"], [0.2, 0.18, "#c58f5b"], [0.62, 0.14, "#b87a4a"]].forEach(([k, h, col]) => { c.fillStyle = col as string; c.fillRect(x - r, y + r * (k as number), r * 2, r * (h as number)); }); shape(c, () => ell(c, x + r * 0.3, y + r * 0.42, r * 0.2, r * 0.11), COL.red, lw * 0.6); });
  if (name === "uranus") ball(c, x, y, r, "#a8e6e3", "#6fbfc4", () => { line(c, [[x - r, y + r * 0.1], [x + r, y + r * 0.1]], Math.max(2, r * 0.05), "rgba(255,255,255,0.5)"); });
  if (name === "neptune") ball(c, x, y, r, "#4a6fd6", "#3350a8", () => { line(c, [[x - r * 0.7, y - r * 0.25], [x + r * 0.3, y - r * 0.4]], Math.max(3, r * 0.07), "#8fb0ff"); line(c, [[x - r * 0.2, y + r * 0.35], [x + r * 0.8, y + r * 0.15]], Math.max(3, r * 0.07), "#8fb0ff"); });
  if (name === "saturn") {
    const rx = r * 1.95, ry = r * 0.5, rot = -0.22;
    const rg = (w: number, col: string, front: boolean) => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "butt"; c.stroke(); };
    rg(r * 0.32 + lw * 2, INK, false); rg(r * 0.32, "#d9b878", false);
    ball(c, x, y, r, "#efd496", "#cfae62", () => { c.fillStyle = "#d9b878"; c.fillRect(x - r, y - r * 0.35, r * 2, r * 0.15); c.fillRect(x - r, y + r * 0.2, r * 2, r * 0.18); });
    rg(r * 0.32 + lw * 2, INK, true); rg(r * 0.32, "#e6c98c", true);
  }
};
const ORDER: PName[] = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
const panelGrid = (c: Ctx, x: number, y: number, cols: number, rows: number, cell: number) => {
  shape(c, () => rect(c, x, y, cols * cell, rows * cell), COL.blue, 6);
  for (let i = 1; i < cols; i++) line(c, [[x + i * cell, y], [x + i * cell, y + rows * cell]], 3, WHITE);
  for (let j = 1; j < rows; j++) line(c, [[x, y + j * cell], [x + cols * cell, y + j * cell]], 3, WHITE);
  shade(c, () => rect(c, x, y, cols * cell, rows * cell), COL.blueDk, cell * 0.25, cell * 0.25, 0.4);
  shape(c, () => rect(c, x, y, cols * cell, rows * cell), "rgba(0,0,0,0)", 6);
};
const spacecraftBody = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 45 * s, y - 55 * s, 90 * s, 110 * s, 10 * s), COL.steel, 6);
  shade(c, () => rrect(c, x - 45 * s, y - 55 * s, 90 * s, 110 * s, 10 * s), COL.steelDk, 12 * s, 10 * s, 0.6);
  shape(c, () => ell(c, x, y - 5 * s, 20 * s, 20 * s), COL.glass, 5);
  shape(c, () => rrect(c, x - 45 * s, y - 55 * s, 90 * s, 110 * s, 10 * s), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - 78 * s, 6 * s, 24 * s), COL.steelDk, 4);
};

// frame 0 · flow summary: the Sun and the eight planets in order, sizes roughly right
const summary = (c: Ctx) => {
  night(c, 5, 70);
  sun(c, 112, 540, 78);
  const rs = [14, 22, 24, 18, 66, 56, 36, 35], xs = [238, 292, 358, 420, 524, 700, 866, 964];
  rs.forEach((r, i) => planet(c, ORDER[i], xs[i], 540, r));
  arrow(c, [[358, 400], [358, 470]], RED, 10);
};

// frame 1 · e1: a torch beam spreads out; twice as far, four times the squares
const e1 = (c: Ctx) => {
  ground(c);
  const sx = 190, sy = 330;
  c.beginPath(); polyP(c, [[sx, sy], [790, sy - 100], [790, sy + 100]]); c.fillStyle = "rgba(255,214,60,0.38)"; c.fill();
  line(c, [[sx, sy], [790, sy - 100]], 4, "rgba(240,170,20,0.9)"); line(c, [[sx, sy], [790, sy + 100]], 4, "rgba(240,170,20,0.9)");
  // two papers seen edge-on, at distance d and 2d
  for (const [px, hh] of [[490, 50], [790, 100]]) { shape(c, () => rect(c, px - 7, sy - 150, 14, 300), WHITE, 5); line(c, [[px, sy - hh], [px, sy + hh]], 12, COL.yellow); }
  // the phone torch
  shape(c, () => rrect(c, 75, sy - 78, 80, 156, 14), COL.teal, 6); shade(c, () => rrect(c, 75, sy - 78, 80, 156, 14), COL.tealDk, -10, -10, 0.55); shape(c, () => rrect(c, 85, sy - 66, 60, 120, 8), "#22303a", 4);
  shape(c, () => ell(c, 160, sy, 26, 26), "rgba(255,226,90,0.8)", 0); shape(c, () => ell(c, 162, sy, 14, 14), WHITE, 4);
  // front views of the lit squares on each paper
  const grid = (gx: number, n: number) => {
    const cell = 34, side = cell * 6, gy = 600;
    shape(c, () => rect(c, gx - side / 2, gy, side, side), WHITE, 5);
    c.fillStyle = COL.yellow; c.fillRect(gx - (n * cell) / 2, gy + side / 2 - (n * cell) / 2, n * cell, n * cell);
    for (let k = 1; k < 6; k++) { line(c, [[gx - side / 2 + k * cell, gy], [gx - side / 2 + k * cell, gy + side]], 2.5, COL.glassEdge); line(c, [[gx - side / 2, gy + k * cell], [gx + side / 2, gy + k * cell]], 2.5, COL.glassEdge); }
    c.lineWidth = 5; c.strokeStyle = INK; c.strokeRect(gx - (n * cell) / 2, gy + side / 2 - (n * cell) / 2, n * cell, n * cell);
    shape(c, () => rect(c, gx - side / 2, gy, side, side), "rgba(0,0,0,0)", 5);
  };
  grid(360, 2); grid(700, 4);
  line(c, [[490, sy + 160], [360, 590]], 3, COL.greyDk); line(c, [[790, sy + 160], [700, 590]], 3, COL.greyDk);
  write(c, "4", 345, 860, 60, INK, 8); write(c, "16", 660, 860, 60, INK, 8);
};

// frame 2 · e2: a rolling marble leaves a ring by the gap in a straight line
const e2 = (c: Ctx) => {
  ground(c, "#ece7da");
  const cx = 400, cy = 520, R = 290;
  shape(c, () => ell(c, cx, cy, R - 10, R - 10), WHITE, 0);
  const arc = (w: number, col: string) => { c.beginPath(); c.arc(cx, cy, R, Math.PI / 4, Math.PI * 2 - Math.PI / 4); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); };
  arc(46, INK); arc(32, COL.teal);
  // the marble goes along the ring (dotted curved arrow) then straight out of the gap
  const a0 = -2.3, a1 = -0.95, rr = R - 80, pts: number[][] = [];
  for (let k = 0; k <= 16; k++) { const a = a0 + ((a1 - a0) * k) / 16; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  dash(c, pts, 7, COL.greyDk);
  const mx = cx + Math.cos(a1) * rr, my = cy + Math.sin(a1) * rr, tx = -Math.sin(a1), ty = Math.cos(a1);
  arrow(c, [[mx + tx * 60, my + ty * 60], [mx + tx * 330, my + ty * 330]], RED, 14);
  shadow(c, mx + 8, my + 14, 44, 38);
  shape(c, () => ell(c, mx, my, 44, 44), COL.blue, 5); shade(c, () => ell(c, mx, my, 44, 44), COL.blueDk, -12, -12, 0.6); shine(c, [[mx - 22, my + 6], [mx - 6, my - 14], [mx + 16, my - 8]], 6);
};

// frame 3 · a1: eight dough planets to the same scale, in order, Earth marked
const a1 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  const rs = [4.3, 10.6, 11.2, 5.9, 126, 105, 45, 43], base = 800;
  let x = 30;
  line(c, [[20, base], [1060, base]], 6);
  rs.forEach((r, i) => {
    x += r; const rr = Math.max(r, 6);
    shadow(c, x + r * 0.15, base + 4, r * 0.95, Math.max(4, r * 0.12));
    planet(c, ORDER[i], x, base - rr, rr);
    if (i === 2) arrow(c, [[x, base - 170], [x, base - 50]], RED, 11);
    x += r + (i === 5 ? 100 : i === 4 ? 14 : 10);
  });
};

// frame 4 · a2: a ball moving round a lamp changes shape, as seen from one place
const phaseDisc = (c: Ctx, x: number, y: number, r: number, alpha: number, litRight: boolean) => {
  shape(c, () => ell(c, x, y, r, r), "#4a4a78", 6);
  const s = litRight ? 1 : -1, N = 28;
  c.beginPath();
  for (let k = 0; k <= N; k++) { const th = (k / N) * Math.PI; c.lineTo(x + s * r * Math.sin(th), y - r * Math.cos(th)); }
  for (let k = N; k >= 0; k--) { const th = (k / N) * Math.PI; c.lineTo(x - s * r * Math.cos(alpha) * Math.sin(th), y - r * Math.cos(th)); }
  c.closePath(); c.fillStyle = "#fff4cf"; c.fill();
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const litBall = (c: Ctx, x: number, y: number, r: number, lx: number, ly: number) => {
  const an = Math.atan2(ly - y, lx - x);
  shadow(c, x + 10, y + r * 0.9, r * 0.9, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), "#4a4a78", 5);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.translate(x, y); c.rotate(an); c.fillStyle = "#fff4cf"; c.fillRect(0, -r, r, r * 2); c.restore();
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 5);
};
const tile = (c: Ctx, x: number, y: number, al: number, right: boolean) => { shape(c, () => rrect(c, x - 90, y - 90, 180, 180, 18), NIGHT, 6); phaseDisc(c, x, y, 62, al, right); };
const eye = (c: Ctx, x: number, y: number) => {
  shape(c, () => { c.moveTo(x - 60, y); c.quadraticCurveTo(x, y - 55, x + 60, y); c.quadraticCurveTo(x, y + 55, x - 60, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x, y, 22, 22), COL.brown, 4); shape(c, () => ell(c, x, y, 9, 9), INK, 0);
};
const a2 = (c: Ctx) => {
  ground(c);
  const lamp = [540, 440], eyeP = [540, 990];
  const balls: [number, number][] = [[240, 240], [690, 780]];
  for (const [bx, by] of balls) { line(c, [eyeP, [bx, by]], 3, "rgba(43,35,64,0.25)"); }
  // the lamp
  shadow(c, 556, 520, 50, 12);
  shape(c, () => rect(c, 528, 470, 24, 50), COL.steelDk, 5); shape(c, () => rrect(c, 505, 515, 70, 14, 5), COL.steel, 5);
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; line(c, [[lamp[0] + Math.cos(a) * 52, lamp[1] + Math.sin(a) * 52], [lamp[0] + Math.cos(a) * 82, lamp[1] + Math.sin(a) * 82]], 7, COL.yellow); }
  shape(c, () => ell(c, lamp[0], lamp[1], 38, 38), COL.yellow, 6); shape(c, () => ell(c, lamp[0] - 10, lamp[1] - 10, 12, 12), WHITE, 0);
  for (const [bx, by] of balls) litBall(c, bx, by, 62, lamp[0], lamp[1]);
  // what the eye sees, from each place
  const phase = (bx: number, by: number) => {
    const l = [lamp[0] - bx, lamp[1] - by], v = [eyeP[0] - bx, eyeP[1] - by], d = [-v[0], -v[1]];
    return { al: Math.acos((l[0] * v[0] + l[1] * v[1]) / (Math.hypot(l[0], l[1]) * Math.hypot(v[0], v[1]))), right: l[0] * -d[1] + l[1] * d[0] > 0 };
  };
  const pA = phase(balls[1][0], balls[1][1]), pB = phase(balls[0][0], balls[0][1]);
  tile(c, 880, 850, pA.al, pA.right); line(c, [[750, 790], [800, 820]], 4, COL.greyDk);
  tile(c, 470, 150, pB.al, pB.right); line(c, [[300, 215], [395, 175]], 4, COL.greyDk);
  eye(c, eyeP[0], eyeP[1]);
  arrow(c, [[200, 360], [270, 520], [340, 640]], RED, 11);
};

// frame 5 · a3: a child on a balcony at night pointing at a bright planet
const a3 = (c: Ctx) => {
  night(c, 11, 55, (x, y) => y < 700 && !(x > 640 && y < 330));
  // rooftops far away
  const r = rnd(4); let rx = 0; while (rx < 1080) { const w = 70 + r() * 80, h = 90 + r() * 120; shape(c, () => rect(c, rx, 760 - h, w, h + 40), "#1a1738", 0); if (r() > 0.5) { c.fillStyle = COL.yellow; c.fillRect(rx + 14, 760 - h + 20, 14, 18); } rx += w; }
  // the bright planet
  const px = 800, py = 230;
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + 0.4; line(c, [[px + Math.cos(a) * 36, py + Math.sin(a) * 36], [px + Math.cos(a) * 66, py + Math.sin(a) * 66]], 7, "#fff6d6"); }
  c.beginPath(); ell(c, px, py, 30, 30); c.fillStyle = "rgba(255,246,214,0.35)"; c.fill();
  shape(c, () => ell(c, px, py, 18, 18), "#fffbe8", 4);
  // balcony floor and rail
  shape(c, () => rect(c, 0, 900, 1080, 180), COL.greyDk, 6); line(c, [[0, 960], [1080, 960]], 4, "rgba(43,35,64,0.5)");
  shape(c, () => rect(c, 0, 690, 1080, 22), COL.steelDk, 5);
  for (let x = 40; x < 1080; x += 110) shape(c, () => rect(c, x, 710, 16, 190), COL.steelDk, 4);
  person(c, 330, 905, 640, { armR: [-1.0, -0.85], armL: [1.9, 1.4] });
  dash(c, [[470, 330], [780, 250]], 5, "rgba(255,246,214,0.6)");
};

// frame 6 · a4: a string with the Sun at one end and each planet at its spaced mark
const a4 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  const y = 440, xs = [136, 150, 164, 182, 262, 382, 662, 970], rs = [5, 7, 7, 6, 34, 30, 20, 20];
  for (let k = 0; k < 8; k += 1) if (k >= 4) line(c, [[xs[k], y + rs[k]], [xs[k], 640]], 3, "rgba(43,35,64,0.25)");
  line(c, [[70, y], [1010, y]], 9, COL.brown); line(c, [[70, y], [1010, y]], 4, "#d9b878");
  sun(c, 84, y, 30);
  xs.forEach((x, i) => planet(c, ORDER[i], x, y, rs[i]));
  // the tape: 0, 1, 2, 3 metres
  shape(c, () => rect(c, 70, 640, 940, 100), COL.wood, 6);
  for (let m = 0; m <= 3; m++) { const x = 80 + m * 306; line(c, [[x, 640], [x, 705]], 5); write(c, String(m), x - 12, 820, 70, INK, 8); for (let k = 1; k < 10 && m < 3; k++) line(c, [[x + k * 30.6, 640], [x + k * 30.6, 640 + (k === 5 ? 45 : 26)]], 3); }
  arrow(c, [[170, 290], [400, 290], [700, 290]], RED, 11);
};

// frame 7 · a5: a child's age on Earth and on Mars
const a5 = (c: Ctx) => {
  ground(c);
  planet(c, "earth", 250, 270, 130); planet(c, "mars", 830, 270, 95);
  write(c, "8", 210, 450, 130, INK, 14); write(c, "4", 790, 450, 130, INK, 14);
  arrow(c, [[400, 270], [640, 270]], RED, 14);
  person(c, 540, 1050, 480, { armR: [-0.5, -0.8], armL: [2.5, 2.1] });
};

// frame 8 · p1: an open booklet with a planet on each page, and pencils
const pencil = (c: Ctx, x: number, y: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(-0.5);
  shape(c, () => rect(c, 0, -16, 250, 32), col, 5); shape(c, () => polyP(c, [[250, -16], [250, 16], [320, 0]]), COL.wood, 5); shape(c, () => polyP(c, [[298, -5], [298, 5], [320, 0]]), INK, 2); shape(c, () => rect(c, -26, -16, 26, 32), COL.pink, 5);
  c.restore();
};
const p1 = (c: Ctx) => {
  ground(c, "#e8dcc3");
  shadow(c, 540, 860, 470, 40);
  shape(c, () => polyP(c, [[70, 240], [530, 270], [530, 840], [70, 800]]), WHITE, 6);
  shape(c, () => polyP(c, [[550, 270], [1010, 240], [1010, 800], [550, 840]]), WHITE, 6);
  line(c, [[540, 270], [540, 840]], 8);
  planet(c, "mercury", 300, 460, 120); planet(c, "venus", 780, 440, 120);
  for (const [x, y, w] of [[130, 660, 340], [130, 710, 280], [610, 650, 340], [610, 700, 260]]) line(c, [[x, y], [x + w, y + (x < 500 ? 5 : -5)]], 8, COL.steel);
  pencil(c, 640, 1010, COL.red); pencil(c, 520, 1040, COL.blue);
};

// frame 9 · c1: one solar panel near the Earth, a much bigger one far away at Jupiter
const c1 = (c: Ctx) => {
  night(c, 9, 40);
  line(c, [[540, 60], [540, 1020]], 5, "rgba(255,246,214,0.35)");
  sun(c, 160, 190, 70); planet(c, "jupiter", 900, 200, 90);
  planet(c, "earth", 380, 150, 36);
  panelGrid(c, 120, 585, 1, 1, 70); line(c, [[190, 620], [215, 620]], 8); spacecraftBody(c, 265, 620, 1);
  panelGrid(c, 580, 460, 5, 5, 70); line(c, [[930, 635], [940, 635]], 8); spacecraftBody(c, 985, 635, 0.8);
  write(c, "1", 140, 860, 80, WHITE, 9); write(c, "25", 700, 860, 80, WHITE, 9);
};

// frame 10 · c2: an ice cube kept in the shade of a foil shield while the sun blazes
const c2 = (c: Ctx) => {
  ground(c, "#cfe6f2");
  sun(c, 150, 150, 90);
  c.beginPath(); polyP(c, [[250, 130], [420, 330], [330, 400], [220, 240]]); c.fillStyle = "rgba(255,214,60,0.3)"; c.fill();
  for (const [x1, y1, x2, y2] of [[240, 200, 400, 390], [290, 150, 470, 330], [350, 110, 540, 270]]) line(c, [[x1, y1], [x2, y2]], 8, COL.yellow);
  // the sill
  shape(c, () => rect(c, 0, 760, 1080, 320), COL.woodDk, 6);
  // the foil shield: a bent card standing in the sun's way
  const sh = () => polyP(c, [[470, 260], [610, 300], [600, 640], [460, 600]]);
  shadow(c, 600, 770, 140, 20);
  shape(c, sh, COL.steel, 6); shade(c, sh, COL.steelDk, 18, 8, 0.5); shine(c, [[490, 300], [485, 560]], 10);
  shape(c, () => polyP(c, [[540, 610], [570, 610], [570, 760], [540, 760]]), COL.steelDk, 5);
  // ice cube on a plate in its shade
  shadow(c, 800, 770, 230, 24);
  shape(c, () => ell(c, 780, 742, 200, 30), COL.steel, 5); shape(c, () => ell(c, 780, 734, 160, 22), COL.steelIn, 4);
  const cube = () => polyP(c, [[700, 560], [860, 560], [860, 710], [700, 710]]);
  shape(c, cube, "rgba(190,230,250,0.9)", 6); shade(c, cube, "#8fc3ea", 18, 14, 0.5);
  shape(c, () => polyP(c, [[700, 560], [740, 520], [900, 520], [860, 560]]), "#e6f6ff", 6);
  shape(c, () => polyP(c, [[860, 560], [900, 520], [900, 670], [860, 710]]), "#a9d6f0", 6);
  shine(c, [[720, 590], [720, 680]], 8);
};

// frame 11 · term.0 solar system: the Sun with eight rings and a planet on each
const solarSys = (c: Ctx) => {
  night(c, 21, 70);
  const cx = 540, cy = 540, radii = [105, 148, 190, 232, 300, 365, 425, 488], pr = [9, 13, 14, 11, 30, 26, 19, 19], an = [-0.6, 2.4, 0.5, -2.2, 3.6, -1.0, 1.9, -0.2];
  radii.forEach((r) => ring(c, cx, cy, r));
  sun(c, cx, cy, 62);
  radii.forEach((r, i) => planet(c, ORDER[i], cx + Math.cos(an[i]) * r, cy + Math.sin(an[i]) * r, pr[i]));
};

// frame 12 · term.4 gravity: a spoon falling to the floor, the Sun pulling the Earth
const gravity = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 5, "rgba(43,35,64,0.25)");
  hand(c, 110, 250, 0.1, 1.4, SKIN.child, CLOTH.child, true);
  // spoon
  c.save(); c.translate(300, 420); c.rotate(0.35);
  shape(c, () => ell(c, 0, -70, 36, 52), COL.steel, 5); shape(c, () => rrect(c, -9, -20, 18, 170, 8), COL.steel, 5); shade(c, () => ell(c, 0, -70, 36, 52), COL.steelDk, 10, 10, 0.5);
  c.restore();
  arrow(c, [[300, 620], [300, 780]], RED, 14);
  shape(c, () => rect(c, 20, 840, 500, 180), "#d9b878", 6);
  for (let k = 1; k < 4; k++) line(c, [[20 + k * 125, 840], [20 + k * 125, 1020]], 4, "rgba(43,35,64,0.5)");
  line(c, [[20, 930], [520, 930]], 4, "rgba(43,35,64,0.5)");
  // Sun and Earth
  sun(c, 900, 540, 90); planet(c, "earth", 650, 540, 52);
  arrow(c, [[690, 540], [790, 540]], RED, 14);
};

// frame 13 · term.5 year: a calendar next to the Earth going once round the Sun
const year = (c: Ctx) => {
  ground(c);
  shadow(c, 260, 900, 200, 24);
  shape(c, () => rrect(c, 70, 220, 380, 640, 20), WHITE, 6);
  shape(c, () => polyP(c, [[70, 240], [450, 240], [450, 380], [70, 380]]), COL.red, 6);
  shape(c, () => rrect(c, 70, 220, 380, 640, 20), "rgba(0,0,0,0)", 6);
  for (const x of [150, 370]) shape(c, () => rrect(c, x - 10, 190, 20, 70, 8), COL.steelDk, 5);
  write(c, "365", 95, 540, 120, INK, 12);
  night_disc(c);
};
const night_disc = (c: Ctx) => {
  c.save(); c.beginPath(); ell(c, 770, 540, 290, 290); c.fillStyle = NIGHT; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
  ring(c, 770, 540, 200, "rgba(255,246,214,0.55)", 4);
  sun(c, 770, 540, 62);
  planet(c, "earth", 770, 340, 32);
  c.save(); c.beginPath(); c.arc(770, 540, 200, -Math.PI / 2 + 0.25, -Math.PI / 2 + 1.6); c.strokeStyle = RED; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); c.restore();
  const a = -Math.PI / 2 + 1.6, ex = 770 + Math.cos(a) * 200, ey = 540 + Math.sin(a) * 200, tx = -Math.sin(a), ty = Math.cos(a);
  line(c, [[ex - tx * 34 + ty * 24, ey - ty * 34 - tx * 24], [ex + tx * 4, ey + ty * 4], [ex - tx * 34 - ty * 24, ey - ty * 34 + tx * 24]], 12, RED);
};

// frame 14 · term.6 rocky planets: Mercury, Venus, Earth, Mars
const rocky = (c: Ctx) => {
  night(c, 31, 50);
  const xs = [150, 400, 650, 900];
  (["mercury", "venus", "earth", "mars"] as PName[]).forEach((n, i) => planet(c, n, xs[i], 540, [75, 108, 112, 85][i]));
};

// frame 15 · expl.0 the Earth seen from Mars: a tiny blue dot in a dusk sky
const fromMars = (c: Ctx) => {
  ground(c, "#2a2250");
  shape(c, () => rect(c, 0, 380, 1080, 260), "#8a4a5a", 0); shape(c, () => rect(c, 0, 500, 1080, 200), "#c26a4a", 0);
  stars(c, 14, 40, (x, y) => y < 350);
  const px = 760, py = 400;
  c.beginPath(); ell(c, px, py, 46, 46); c.fillStyle = "rgba(150,200,255,0.35)"; c.fill();
  shape(c, () => ell(c, px, py, 16, 16), COL.blue, 3); shape(c, () => ell(c, px + 24, py - 14, 4, 4), WHITE, 0);
  // dunes and rocks of Mars
  shape(c, () => { c.moveTo(0, 650); c.quadraticCurveTo(250, 560, 560, 640); c.quadraticCurveTo(820, 700, 1080, 600); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, "#c9593a", 6);
  shape(c, () => { c.moveTo(0, 820); c.quadraticCurveTo(300, 740, 620, 810); c.quadraticCurveTo(900, 870, 1080, 780); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, "#a9472d", 6);
  for (const [x, y, r] of [[220, 880, 70], [420, 960, 48], [880, 920, 80], [680, 1000, 36]]) { shadow(c, x + r * 0.2, y + r * 0.5, r * 1.1, r * 0.22); shape(c, () => { c.moveTo(x - r, y + r * 0.45); c.quadraticCurveTo(x - r * 0.8, y - r * 0.6, x, y - r * 0.55); c.quadraticCurveTo(x + r * 0.9, y - r * 0.5, x + r, y + r * 0.45); c.closePath(); }, "#8a3a25", 5); }
  arrow(c, [[640, 250], [715, 355]], RED, 11);
};

// frame 16 · expl.1 the eight planets in order, numbered 1 to 8, Earth the third
const inOrder = (c: Ctx) => {
  night(c, 41, 60);
  sun(c, 70, 400, 46);
  line(c, [[40, 400], [1050, 400]], 4, "rgba(255,246,214,0.25)");
  const pos = [170, 255, 345, 430, 530, 705, 850, 960], rr = [26, 34, 36, 30, 60, 52, 38, 38];
  ORDER.forEach((n, i) => { planet(c, n, pos[i], 400, rr[i]); write(c, String(i + 1), pos[i] - 14, 500, 64, WHITE, 8); });
  arrow(c, [[345, 760], [345, 640]], RED, 12);
  planet(c, "earth", 345, 840, 60);
};

// frame 17 · expl.2 rocky planets small and solid; giants huge, striped and ringed
const rockGiant = (c: Ctx) => {
  night(c, 51, 60);
  [150, 400, 650, 900].forEach((x, i) => planet(c, (["mercury", "venus", "earth", "mars"] as PName[])[i], x, 250, [40, 56, 58, 46][i]));
  dash(c, [[40, 500], [1040, 500]], 5, "rgba(255,246,214,0.5)");
  planet(c, "jupiter", 165, 760, 105); planet(c, "saturn", 475, 760, 88); planet(c, "uranus", 760, 760, 66); planet(c, "neptune", 925, 760, 64);
};

// frame 18 · expl.3 light spreads: one square, four squares, nine squares
const lightSpread = (c: Ctx) => {
  ground(c);
  const sy = 440, sx = 120;
  c.beginPath(); polyP(c, [[sx, sy], [900, sy - 95], [900, sy + 95]]); c.fillStyle = "rgba(255,214,60,0.38)"; c.fill();
  line(c, [[sx, sy], [900, sy - 95]], 4, "rgba(240,170,20,0.9)"); line(c, [[sx, sy], [900, sy + 95]], 4, "rgba(240,170,20,0.9)");
  sun(c, sx, sy, 56);
  const cell = 32;
  for (const [x, n] of [[360, 1], [630, 2], [900, 3]] as [number, number][]) {
    const side = n * cell;
    shape(c, () => rect(c, x - side / 2, sy - side / 2, side, side), COL.yellow, 5);
    for (let k = 1; k < n; k++) { line(c, [[x - side / 2 + k * cell, sy - side / 2], [x - side / 2 + k * cell, sy + side / 2]], 3); line(c, [[x - side / 2, sy - side / 2 + k * cell], [x + side / 2, sy - side / 2 + k * cell]], 3); }
    // the same patch again below, bigger, so the squares can be counted
    const big = 50, bs = n * big, bx = x - bs / 2, by = 640;
    shape(c, () => rect(c, bx, by, bs, bs), COL.yellow, 5);
    for (let k = 1; k < n; k++) { line(c, [[bx + k * big, by], [bx + k * big, by + bs]], 3); line(c, [[bx, by + k * big], [bx + bs, by + k * big]], 3); }
    write(c, String(n * n), x - 14, 900, 70, INK, 9);
  }
};

// frame 19 · expl.4 liquid water: boiling near the Sun, frozen far away, liquid in the middle with a fish
const tank = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => rect(c, x, y, w, h);
  shadow(c, x + w / 2 + 14, y + h + 8, w * 0.55, 14);
  return body;
};
const waterTanks = (c: Ctx) => {
  ground(c, "#e8dcc3");
  sun(c, 100, 540, 70);
  const ty = 400, th = 330, tw = 230, xs = [250, 520, 790];
  // hot: bubbling and steam
  { const x = xs[0]; const b = tank(c, x, ty, tw, th); shape(c, () => rect(c, x, ty + 110, tw, th - 110), COL.water, 0); shape(c, b, COL.glass, 6);
    for (const [bx, by, br] of [[60, 250, 14], [120, 210, 18], [170, 270, 12], [90, 160, 10], [150, 150, 14]]) shape(c, () => ell(c, x + bx, ty + by, br, br), COL.drop, 3);
    for (const dx of [60, 115, 170]) line(c, [[x + dx, ty + 90], [x + dx + 16, ty + 45], [x + dx - 14, ty - 10], [x + dx + 12, ty - 60]], 7, "#ffffff"); }
  // just right: liquid with a fish
  { const x = xs[1]; const b = tank(c, x, ty, tw, th); shape(c, () => rect(c, x, ty + 70, tw, th - 70), COL.water, 0);
    shape(c, () => { c.moveTo(x + 60, ty + 190); c.quadraticCurveTo(x + 110, ty + 140, x + 160, ty + 190); c.quadraticCurveTo(x + 110, ty + 240, x + 60, ty + 190); c.closePath(); }, COL.orange, 5);
    shape(c, () => polyP(c, [[x + 158, ty + 190], [x + 195, ty + 160], [x + 195, ty + 220]]), COL.orange, 5); shape(c, () => ell(c, x + 82, ty + 182, 5, 5), INK, 0);
    leaf(c, x + 40, ty + th, 120, -1.6); leaf(c, x + 190, ty + th, 90, -1.5);
    shape(c, b, COL.glass, 6); planet(c, "earth", x + tw / 2, ty - 110, 44); }
  // cold: ice
  { const x = xs[2]; const b = tank(c, x, ty, tw, th); shape(c, () => rect(c, x, ty + 70, tw, th - 70), "#dff0fb", 0);
    for (const [a, bb] of [[40, 130], [110, 100], [60, 240], [160, 190]]) line(c, [[x + a, ty + bb], [x + a + 40, ty + bb + 30], [x + a + 70, ty + bb - 10]], 4, COL.glassEdge);
    shine(c, [[x + 30, ty + 100], [x + 30, ty + 280]], 8); shape(c, b, COL.glass, 6); }
  // little tags: a hot dot, a green dot and a snowflake would be words; use arrows only
  arrow(c, [[130, 800], [980, 800]], RED, 11);
};
const leaf = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len;
  shape(c, () => { c.moveTo(x - 10, y); c.quadraticCurveTo(x - 20, (y + ty) / 2, tx, ty); c.quadraticCurveTo(x + 20, (y + ty) / 2, x + 10, y); c.closePath(); }, COL.leaf, 5);
};

// frame 20 · expl.5 a planet moves straight on, while the Sun pulls it inward
const keepGoing = (c: Ctx) => {
  night(c, 61, 50);
  sun(c, 400, 540, 95);
  ring(c, 400, 540, 300);
  planet(c, "earth", 700, 540, 40);
  arrow(c, [[700, 620], [700, 800]], RED, 14);
  arrow(c, [[640, 540], [530, 540]], RED, 14);
};

// frame 21 · expl.6 further out takes longer: Earth goes round 12 times for one trip of Jupiter
const longerOut = (c: Ctx) => {
  night(c, 71, 50);
  const cx = 540, cy = 540;
  ring(c, cx, cy, 140); ring(c, cx, cy, 330);
  sun(c, cx, cy, 52);
  planet(c, "earth", cx + 140, cy, 28);
  planet(c, "jupiter", cx, cy - 330, 56);
  arrow(c, [[cx + 190, cy + 20], [cx + 190, cy + 110]], RED, 11);
  arrow(c, [[cx + 90, cy - 330], [cx + 230, cy - 300]], RED, 11);
  write(c, "12", 640, 760, 100, WHITE, 11); write(c, "1", 270, 760, 100, WHITE, 11);
  planet(c, "earth", 700, 930, 36); planet(c, "jupiter", 320, 930, 50);
  void 0;
};

// frame 22 · expl.7 the young solar system: a spinning disc of dust round a young Sun, lumps clumping
const birth = (c: Ctx) => {
  night(c, 81, 90);
  const cx = 540, cy = 560;
  for (const [rx, ry, col] of [[470, 150, "rgba(190,120,80,0.45)"], [370, 118, "rgba(215,150,95,0.6)"], [270, 85, "rgba(235,180,110,0.7)"], [170, 54, "rgba(250,205,130,0.8)"]] as [number, number, string][]) { c.beginPath(); ell(c, cx, cy, rx, ry); c.fillStyle = col; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); }
  c.beginPath(); ell(c, cx, cy, 90, 90); c.fillStyle = "rgba(255,226,90,0.35)"; c.fill();
  shape(c, () => ell(c, cx, cy, 60, 60), COL.yellow, 6); shade(c, () => ell(c, cx, cy, 60, 60), COL.orange, 16, 16, 0.45); shape(c, () => ell(c, cx, cy, 60, 60), "rgba(0,0,0,0)", 6);
  const lumps: [number, number, number][] = [[160, 540, 14], [255, 640, 22], [340, 490, 12], [770, 635, 24], [860, 510, 16], [940, 580, 12], [690, 480, 13], [440, 660, 10]];
  lumps.forEach(([x, y, r], i) => shape(c, () => ell(c, x, y, r, r * 0.85, i), COL.grey, 4));
  arrow(c, [[200, 790], [400, 840], [700, 840]], RED, 12);
};

// frame 23 · expl.9 a hidden ninth planet: faint dotted planet, small icy worlds on stretched paths pointing its way
const hidden = (c: Ctx) => {
  night(c, 91, 60);
  const sx = 250, sy = 760, th = [-0.8, -0.65, -0.72, -0.62], aa = [220, 270, 320, 370], e = 0.62;
  ring(c, sx, sy, 90, "rgba(255,246,214,0.4)", 3);
  th.forEach((t, i) => {
    const cx = sx + Math.cos(t) * aa[i] * e, cy = sy + Math.sin(t) * aa[i] * e;
    c.save(); c.setLineDash([10, 10]); c.beginPath(); c.ellipse(cx, cy, aa[i], aa[i] * Math.sqrt(1 - e * e), t, 0, Math.PI * 2); c.strokeStyle = "rgba(160,215,245,0.8)"; c.lineWidth = 4; c.stroke(); c.restore();
    const px = sx + Math.cos(t) * aa[i] * (1 + e) * 0.97, py = sy + Math.sin(t) * aa[i] * (1 + e) * 0.97;
    shape(c, () => ell(c, px, py, 17, 17), "#dff0fb", 4);
  });
  sun(c, sx, sy, 28);
  c.save(); c.setLineDash([12, 10]); c.beginPath(); ell(c, 910, 190, 85, 85); c.fillStyle = "rgba(100,90,150,0.45)"; c.fill(); c.strokeStyle = "rgba(255,246,214,0.8)"; c.lineWidth = 6; c.stroke(); c.restore();
};

export const ic_skySolarSystemL3 = cards("sci.sky.solar-system.L3 cards", [
  summary, e1, e2, a1, a2, a3, a4, a5, p1, c1, c2, solarSys, gravity, year, rocky, fromMars, inOrder, rockGiant, lightSpread, waterTanks, keepGoing, longerOut, birth, hidden,
]);
void BG;
