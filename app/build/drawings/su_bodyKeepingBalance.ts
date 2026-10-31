import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, person, write, cards } from "./flatKit";

// SET-UP CARDS · sci.body.keeping-balance.L3 (cooling by evaporation, body heat, the matka)
const CLAY = "#cf7a45", CLAYDK = "#a24f28", CLAYWET = "#9a5230", WET = "#8fb3dc", WETDK = "#6a92c2", LCD = "#c9f06b", SCREEN = "#22303a";

// ---------------------------------------------------------------- shared pieces
const dropP = (c: Ctx, x: number, y: number, r: number) => { c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 0.2, y - r * 0.7, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.2, y - r * 0.7, x, y - r * 1.7); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => shape(c, () => dropP(c, x, y, r), col, Math.max(3, r * 0.25));
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, D + 40, D - y + 40, 0), COL.wood, 6);
  c.fillStyle = "#f8d98f"; c.fillRect(-10, y + 3, D + 20, 26); line(c, [[-10, y + 30], [D + 10, y + 30]], 4, COL.woodDk);
};
// a steel tumbler standing at (x, y), bottom centre; water visible at the rim
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, fill = true) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.quadraticCurveTo(x, y + w * 0.08, x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, w * 0.28, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 6);
  if (fill) shape(c, () => ell(c, x, y - h + 4, w / 2 - 14, w * 0.075), COL.water, 3);
  shine(c, [[x - w * 0.36, y - h * 0.88], [x - w * 0.31, y - h * 0.2]], 8);
};
const steam = (c: Ctx, x: number, y: number, s = 1) => { for (const dx of [-60, 0, 60]) { const X = x + dx * s; line(c, [[X, y], [X + 22 * s, y - 40 * s], [X - 18 * s, y - 80 * s], [X + 10 * s, y - 125 * s]], 11 * s, WHITE); } };
// a hanky round the lower part of a tumbler, tied with a rubber band
const hanky = (c: Ctx, x: number, y: number, w: number, h: number, wet: boolean) => {
  const hh = h * 0.74, col = wet ? WET : COL.cloth, dk = wet ? WETDK : "#e4dccb";
  const body = () => { c.moveTo(x - w * 0.45, y - hh); c.bezierCurveTo(x - w * 0.7, y - hh * 0.7, x - w * 0.66, y - hh * 0.2, x - w * 0.52, y); c.quadraticCurveTo(x - w * 0.3, y + 22, x - w * 0.1, y - 2); c.quadraticCurveTo(x + w * 0.15, y + 22, x + w * 0.3, y); c.quadraticCurveTo(x + w * 0.45, y + 14, x + w * 0.52, y); c.bezierCurveTo(x + w * 0.66, y - hh * 0.2, x + w * 0.7, y - hh * 0.7, x + w * 0.45, y - hh); c.closePath(); };
  shape(c, () => polyP(c, [[x - w * 0.4, y - hh + 8], [x - w * 0.3, y - hh - 40], [x - w * 0.08, y - hh + 8]]), col, 5);
  shape(c, () => polyP(c, [[x + w * 0.4, y - hh + 8], [x + w * 0.28, y - hh - 30], [x + w * 0.06, y - hh + 8]]), col, 5);
  shape(c, body, col, 6); shade(c, body, dk, w * 0.3, 0, 0.7);
  for (const f of [-0.28, 0, 0.26]) line(c, [[x + w * f, y - hh + 30], [x + w * (f * 1.25), y - hh * 0.45], [x + w * (f * 1.1), y - 14]], 4, dk);
  if (!wet) for (const [u, v] of [[-0.3, 0.55], [0.1, 0.7], [0.3, 0.4], [-0.1, 0.3], [-0.35, 0.2]]) { c.beginPath(); ell(c, x + w * u, y - hh * v, 7, 7); c.fillStyle = COL.pink; c.fill(); }
  else for (const [u, v] of [[-0.3, 0.6], [0.05, 0.35], [0.3, 0.55]]) drop(c, x + w * u, y - hh * v, 11, COL.drop);
  line(c, [[x - w * 0.46, y - hh + 14], [x, y - hh + 26], [x + w * 0.46, y - hh + 14]], 22, INK); line(c, [[x - w * 0.46, y - hh + 14], [x, y - hh + 26], [x + w * 0.46, y - hh + 14]], 13, RED);
};
// a probe thermometer, tip at (x, y) going down into the water, the screen above
const thermoV = (c: Ctx, x: number, y: number, tilt: number, reading: string, plen = 150) => {
  c.save(); c.translate(x, y); c.rotate(tilt);
  line(c, [[0, 0], [0, -plen]], 20, INK); line(c, [[0, 0], [0, -plen]], 11, COL.steelIn);
  shape(c, () => rrect(c, -58, -plen - 170, 116, 175, 20), COL.teal, 6); shade(c, () => rrect(c, -58, -plen - 170, 116, 175, 20), COL.tealDk, 22, 0, 0.6);
  shape(c, () => rrect(c, -46, -plen - 150, 92, 70, 8), SCREEN, 5);
  write(c, reading, -38, -plen - 140, 44, LCD, 7);
  c.beginPath(); ell(c, 0, -plen - 40, 12, 12); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.restore();
};
// an under-arm digital thermometer: tip at (x, y), body out to the left
const thermoH = (c: Ctx, x: number, y: number, tilt: number, reading: string, plen = 60) => {
  c.save(); c.translate(x, y); c.rotate(tilt);
  line(c, [[0, 0], [-plen, 0]], 18, INK); line(c, [[0, 0], [-plen, 0]], 10, COL.steelIn);
  shape(c, () => rrect(c, -plen - 230, -40, 230, 80, 22), COL.teal, 6); shade(c, () => rrect(c, -plen - 230, -40, 230, 80, 22), COL.tealDk, 0, 22, 0.6);
  shape(c, () => rrect(c, -plen - 215, -26, 130, 52, 8), SCREEN, 5);
  write(c, reading, -plen - 205, -17, 32, LCD, 6);
  c.beginPath(); ell(c, -plen - 50, 0, 14, 14); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  c.restore();
};
// a wall clock; hour and minute hands by angle (0 = 12 o'clock, clockwise)
const clock = (c: Ctx, x: number, y: number, r: number, hr: number, mn: number) => {
  shadow(c, x + r * 0.08, y + r * 0.1, r * 1.02, r * 0.98);
  shape(c, () => ell(c, x, y, r, r), COL.teal, 7); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.68, y - Math.cos(a) * r * 0.68], [x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78]], i % 3 ? 5 : 9); }
  line(c, [[x, y], [x + Math.sin(hr) * r * 0.42, y - Math.cos(hr) * r * 0.42]], 13); line(c, [[x, y], [x + Math.sin(mn) * r * 0.65, y - Math.cos(mn) * r * 0.65]], 9);
  c.beginPath(); ell(c, x, y, 10, 10); c.fillStyle = RED; c.fill();
};
// a table fan seen from the side, facing right; centre of the guard at (x, y)
const fan = (c: Ctx, x: number, y: number, r: number, base: number) => {
  shadow(c, x + 20, base + 8, r * 0.7, 20);
  shape(c, () => rrect(c, x - 14, y + r * 0.7, 28, base - y - r * 0.7, 6), COL.steelDk, 5);
  shape(c, () => rrect(c, x - r * 0.55, base - 26, r * 1.1, 28, 12), COL.tealDk, 6);
  shape(c, () => rrect(c, x - r * 0.95, y - r * 0.28, r * 0.6, r * 0.56, 24), COL.teal, 6);
  c.save(); c.translate(x, y); c.scale(0.5, 1);
  shape(c, () => ell(c, 0, 0, r, r), "rgba(255,255,255,0.6)", 7);
  for (let k = 0; k < 4; k++) { c.save(); c.rotate(k * Math.PI / 2 + 0.5); shape(c, () => { c.moveTo(0, 0); c.bezierCurveTo(r * 0.3, -r * 0.1, r * 0.75, -r * 0.35, r * 0.78, -r * 0.05); c.bezierCurveTo(r * 0.6, r * 0.2, r * 0.3, r * 0.15, 0, 0); c.closePath(); }, COL.blue, 5); c.restore(); }
  for (const f of [0.35, 0.65]) { c.beginPath(); ell(c, 0, 0, r * f, r * f); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  shape(c, () => ell(c, 0, 0, r * 0.14, r * 0.14), COL.yellow, 5);
  c.restore();
};
const wind = (c: Ctx, x: number, y: number, len: number) => { for (const [dy, dl] of [[-60, 0], [0, 40], [60, 0]]) line(c, [[x, y + dy], [x + len * 0.35, y + dy - 14], [x + len * 0.7, y + dy + 14], [x + len + dl, y + dy]], 9, "#7fb4e0"); };
// a clay matka: bottom centre (x, y), body radius r; damp = darker, patchy, beaded with water
const matka = (c: Ctx, x: number, y: number, r: number, damp = false, water = false) => {
  shadow(c, x + r * 0.12, y + 8, r * 0.95, r * 0.14);
  const col = damp ? CLAYWET : CLAY, dk = damp ? "#6e3519" : CLAYDK;
  const body = () => { c.moveTo(x - r * 0.5, y - r * 1.55); c.bezierCurveTo(x - r * 1.3, y - r * 1.4, x - r * 1.25, y - r * 0.05, x - r * 0.3, y); c.lineTo(x + r * 0.3, y); c.bezierCurveTo(x + r * 1.25, y - r * 0.05, x + r * 1.3, y - r * 1.4, x + r * 0.5, y - r * 1.55); c.closePath(); };
  shape(c, body, col, 6); shade(c, body, dk, r * 0.3, 0, 0.6);
  line(c, [[x - r * 0.9, y - r * 0.95], [x - r * 0.55, y - r * 0.6]], 7, damp ? "#b97a52" : "#e8a070");
  if (damp) {
    c.save(); c.beginPath(); body(); c.clip();
    for (const [u, v, rr] of [[-0.6, 0.5, 0.3], [0.3, 0.8, 0.35], [-0.2, 0.25, 0.25], [0.7, 0.4, 0.22]]) { c.beginPath(); ell(c, x + u * r, y - v * r, rr * r, rr * r * 0.7); c.fillStyle = "#6e3519"; c.globalAlpha = 0.35; c.fill(); }
    c.restore(); c.globalAlpha = 1;
    for (const [u, v] of [[-0.7, 0.7], [-0.3, 0.45], [0.1, 0.9], [0.45, 0.5], [0.75, 0.75], [-0.1, 0.2], [0.5, 0.15], [-0.75, 0.3]]) drop(c, x + u * r, y - v * r, r * 0.06, COL.drop);
  }
  shape(c, () => ell(c, x, y - r * 1.56, r * 0.62, r * 0.13), col, 6);
  shape(c, () => ell(c, x, y - r * 1.56, r * 0.5, r * 0.09), water ? COL.water : "#5a2f17", 4);
};
// a steel pot with two ears: bottom centre (x, y)
const pot = (c: Ctx, x: number, y: number, w: number, h: number, water = true) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.62, w * 0.09);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * w * 0.55, y - h * 0.8, w * 0.07, w * 0.05), COL.steelDk, 5);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.46, y); c.quadraticCurveTo(x, y + w * 0.06, x - w * 0.46, y); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, w * 0.22, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 6);
  if (water) shape(c, () => ell(c, x, y - h + 4, w / 2 - 14, w * 0.075), COL.water, 3);
  shine(c, [[x - w * 0.4, y - h * 0.85], [x - w * 0.36, y - h * 0.2]], 9);
};
// a jug tipped to pour, spout at the left: centre (cx, cy), tilted tilt radians anticlockwise
const jug = (c: Ctx, cx: number, cy: number, tilt: number) => {
  c.save(); c.translate(cx, cy); c.rotate(-tilt);
  const body = () => rrect(c, -90, -110, 180, 220, 28);
  shape(c, () => polyP(c, [[-90, -100], [-128, -138], [-60, -110]]), COL.teal, 6);
  shape(c, body, COL.teal, 6); shade(c, body, COL.tealDk, 30, 0, 0.6);
  shape(c, () => ell(c, 0, -110, 90, 20), SCREEN, 5);
  shine(c, [[-65, -70], [-65, 40]], 9);
  c.restore();
};
// a hand seen from the right, fingers pointing left, thumb up
const handLeft = (c: Ctx, x: number, y: number, an: number, s: number, open = false, skin: string = SKIN.adult, sleeve: string = CLOTH.adult) => {
  c.save(); c.translate(x, y); c.scale(1, -1); hand(c, 0, 0, -an, s, skin, sleeve, open); c.restore();
};

// ---------------------------------------------------------------- the child
// a child sitting on a chair, feet at (x, y), a digital thermometer under the arm; flushed = red cheeks
const sitting = (c: Ctx, x: number, y: number, h: number, reading: string, flushed = false) => {
  shape(c, () => rrect(c, x - h * 0.22, y - h * 0.5, h * 0.44, h * 0.46, 12), COL.woodDk, 6);
  person(c, x, y, h, { sit: true, armL: [Math.PI * 0.5, 0.25], armR: [Math.PI * 0.48, Math.PI * 0.5] });
  shape(c, () => rrect(c, x - h * 0.25, y - h * 0.05, h * 0.5, h * 0.045, 8), COL.wood, 6);
  for (const s of [-1, 1]) line(c, [[x + s * h * 0.21, y - h * 0.005], [x + s * h * 0.21, y + h * 0.06]], 12, INK);
  const sx = x - h * 0.11, sy = y - h * 0.38 + h * 0.03, ex = sx, ey = sy + h * 0.17, wx = ex + Math.cos(0.25) * h * 0.16, wy = ey + Math.sin(0.25) * h * 0.16, uw = h * 0.06;
  thermoH(c, sx + h * 0.02, sy + h * 0.07, 0.15, reading, 40);
  line(c, [[sx, sy], [ex, ey], [wx, wy]], uw + 10, INK); line(c, [[sx, sy], [ex, ey], [wx, wy]], uw, CLOTH.child);
  shape(c, () => ell(c, wx, wy, uw * 0.62, uw * 0.62), SKIN.child, 5);
  if (flushed) { const head = h * 0.13, hy = y - h * 0.38 - head * 1.05; for (const s of [-1, 1]) { c.beginPath(); ell(c, x + s * head * 0.62, hy + head * 0.5, head * 0.27, head * 0.2); c.fillStyle = RED; c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1; } }
};
// a child running on the spot: upper body from person(), legs drawn here, one knee up
const runner = (c: Ctx, x: number, y: number, h: number) => {
  const hip = y - h * 0.42, leg = (pts: number[][]) => { line(c, pts, h * 0.085, INK); line(c, pts, h * 0.085 - 12, "#6b5a8c"); };
  const shoe = (fx: number, fy: number) => shape(c, () => ell(c, fx, fy, h * 0.07, h * 0.035), WHITE, 5);
  leg([[x - h * 0.05, hip], [x - h * 0.06, y - h * 0.04]]); shoe(x - h * 0.03, y - h * 0.02);
  leg([[x + h * 0.05, hip], [x + h * 0.2, hip + h * 0.1], [x + h * 0.1, hip + h * 0.26]]); shoe(x + h * 0.13, hip + h * 0.28);
  c.save(); c.beginPath(); c.rect(0, 0, D, hip + h * 0.04); c.clip();
  person(c, x, y, h, { armL: [2.2, -0.9], armR: [0.9, -1.3] });
  c.restore();
};

// ================================================================ experiment 1: wet cloth and dry cloth
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c); table(c, 800);
  // a see-through window in each tumbler shows the water inside: both end at the same height (red line)
  const win = (x: number, level: number) => {
    shape(c, () => rrect(c, x - 70, 640, 140, 220, 16), "#eef3f8", 5);
    c.save(); c.beginPath(); rrect(c, x - 70, 640, 140, 220, 16); c.clip();
    c.fillStyle = COL.water; c.fillRect(x - 70, level, 140, 860 - level); line(c, [[x - 70, level], [x + 70, level]], 6, COL.waterDk); c.restore();
    c.beginPath(); rrect(c, x - 70, 640, 140, 220, 16); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  };
  tumbler(c, 200, 900, 240, 330); win(200, 700); steam(c, 200, 560, 0.9);
  tumbler(c, 520, 900, 240, 330); win(520, 700);
  for (const dx of [-80, 85]) line(c, [[520 + dx, 560], [520 + dx + 20, 520], [520 + dx - 16, 480], [520 + dx + 10, 440]], 10, WHITE);
  line(c, [[110, 700], [610, 700]], 7, RED);
  const flow = [[535, 330], [533, 450], [527, 600]];
  line(c, flow, 34, INK); line(c, flow, 22, COL.water);
  jug(c, 720, 330, 0.65);
  handLeft(c, 890, 290, Math.PI - 0.5, 1.7);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c); table(c, 800);
  c.beginPath(); ell(c, 280, 905, 260, 36); c.fillStyle = WET; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  tumbler(c, 280, 900, 300, 420); hanky(c, 280, 900, 300, 420, true);
  for (const dx of [-70, 30]) drop(c, 280 + dx, 960, 13, COL.waterDk);
  tumbler(c, 780, 900, 300, 420); hanky(c, 780, 900, 300, 420, false);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c); table(c, 880);
  clock(c, 880, 190, 120, 1.0, 0);
  fan(c, 240, 560, 190, 880);
  wind(c, 350, 640, 100);
  tumbler(c, 640, 900, 220, 310); hanky(c, 640, 900, 220, 310, true);
  thermoV(c, 640, 900 - 310 + 8, 0.08, "40°", 130);
  tumbler(c, 900, 900, 220, 310); hanky(c, 900, 900, 220, 310, false);
};

// ================================================================ experiment 2: your body when you run
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, -20, 930, D + 40, 200, 0), COL.wood, 6);
  sitting(c, 560, 900, 900, "37°");
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[160, 930], [900, 930], [960, 1000], [100, 1000]]), COL.teal, 6);
  runner(c, 520, 920, 780);
  // stopwatch
  shadow(c, 905, 345, 130, 22);
  shape(c, () => rrect(c, 877, 30, 56, 44, 8), COL.steelDk, 5);
  shape(c, () => ell(c, 905, 200, 140, 140), RED, 7);
  shape(c, () => ell(c, 905, 200, 116, 116), WHITE, 5);
  write(c, "2", 820, 168, 64, INK, 10);
  c.beginPath(); ell(c, 878, 187, 6, 6); c.fillStyle = INK; c.fill(); c.beginPath(); ell(c, 878, 214, 6, 6); c.fill();
  write(c, "00", 895, 168, 64, INK, 10);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, -20, 930, D + 40, 200, 0), COL.wood, 6);
  sitting(c, 440, 900, 880, "38°", true);
  shape(c, () => rrect(c, 790, 650, 250, 36, 10), COL.wood, 6);
  shape(c, () => rrect(c, 885, 686, 60, 220, 8), COL.woodDk, 6);
  glass(c, 915, 650, 150, 230, 0.8);
};

// ================================================================ experiment 3: the matka
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, -20, 880, D + 40, 200, 0), "#e3d6bd", 6);
  matka(c, 250, 960, 165); pot(c, 870, 960, 300, 240);
  thermoV(c, 870, 960 - 240 + 6, 0.1, "30°", 130);
  const flow = [[248, 352], [246, 520], [250, 700]];
  line(c, flow, 32, INK); line(c, flow, 20, COL.water);
  jug(c, 420, 380, 0.65);
  handLeft(c, 620, 340, Math.PI - 0.5, 1.7);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, -20, 880, D + 40, 200, 0), "#e3d6bd", 6);
  clock(c, 540, 270, 170, 0, 0);
  const pts: number[][] = []; for (let a = Math.PI; a <= Math.PI * 1.5 + 0.01; a += 0.08) pts.push([540 + Math.cos(a) * 235, 270 + Math.sin(a) * 235]);
  arrow(c, pts);
  write(c, "3", 800, 230, 90, INK, 12);
  matka(c, 250, 960, 165, true); pot(c, 870, 960, 300, 240);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, -20, 960, D + 40, 200, 0), "#e3d6bd", 6);
  matka(c, 640, 1000, 300, true);
  thermoV(c, 640, 1000 - 300 * 1.56 + 6, 0.1, "27°", 150);
  hand(c, 240, 700, 0, 2.2, SKIN.child, CLOTH.child, true);
};

export const su_bodyKeepingBalance = cards("sci.body.keeping-balance.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
