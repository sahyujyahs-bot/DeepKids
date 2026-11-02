import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd, cards } from "./flatKit";

// sci.gravity.weight-and-mass.L3 · player-card pictures. Same child, forcemeter, rice bag, stone, bottle as the set-up cards.
const thick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const RICE = "#f6f0df";
// a forcemeter hanging by its ring at (x, top - 22 s); the rod pulls out as the pointer goes down the scale. Returns where the hook ends.
type FM = { s?: number; max?: number; step?: number; lab?: number; ghost?: number };
const fm = (c: Ctx, x: number, top: number, val: number, o: FM = {}) => {
  const s = o.s ?? 1, max = o.max ?? 5, step = o.step ?? 40, lab = o.lab ?? 1;
  const H = 50 + max * step + 28, ext = val * step * 0.3, py = 50 + val * step;
  c.save(); c.translate(x, top); c.scale(s, s);
  c.beginPath(); ell(c, 0, -22, 16, 20); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  c.beginPath(); ell(c, 0, -22, 16, 20); c.strokeStyle = COL.steel; c.lineWidth = 6; c.stroke();
  const rodEnd = H + 24 + ext;
  thick(c, [[0, H - 6], [0, rodEnd]], 8, COL.steelDk);
  c.beginPath(); ell(c, 0, rodEnd + 16, 13, 16); c.strokeStyle = INK; c.lineWidth = 12; c.stroke();
  c.beginPath(); ell(c, 0, rodEnd + 16, 13, 16); c.strokeStyle = COL.steel; c.lineWidth = 5; c.stroke();
  const body = () => rrect(c, -48, 0, 96, H, 16);
  shadow(c, 44, H + 6, 46, 10);
  shape(c, body, COL.paper);
  shade(c, body, "#cfc3a6", -22, 0, 0.6);
  shape(c, () => rrect(c, -48, 0, 96, 30, 14), COL.teal);
  shape(c, () => rrect(c, 8, 40, 28, max * step + 20, 9), "#3a3540", 4);
  for (let i = 0; i <= max; i++) {
    const y = 50 + i * step; line(c, [[-8, y], [2, y]], 4);
    if (i % lab === 0) write(c, String(i), -46, y - 12, 24, INK, 4);
  }
  if (o.ghost !== undefined) {
    const gy = 50 + o.ghost * step; c.setLineDash([10, 8]); line(c, [[0, gy], [90, gy]], 4, RED); c.setLineDash([]);
  }
  shape(c, () => rrect(c, 2, py - 8, 40, 16, 4), RED, 4);
  if (o.ghost !== undefined) line(c, [[40, py], [90, py]], 4, RED);
  c.restore();
  return { hx: x, hy: top + (rodEnd + 32) * s };
};
// a clear plastic bag; y = top of the body, the handles go up to the hook at (x, y - 60)
const bag = (c: Ctx, x: number, y: number, w: number, h: number, rice: boolean) => {
  const tw = 34;
  const bp = () => { c.moveTo(x - tw, y); c.lineTo(x + tw, y); c.bezierCurveTo(x + tw * 1.2, y + h * 0.3, x + w / 2, y + h * 0.4, x + w / 2, y + h * 0.7); c.bezierCurveTo(x + w / 2, y + h, x - w / 2, y + h, x - w / 2, y + h * 0.7); c.bezierCurveTo(x - w / 2, y + h * 0.4, x - tw * 1.2, y + h * 0.3, x - tw, y); c.closePath(); };
  line(c, [[x - tw * 0.8, y + 4], [x, y - 58]], 6); line(c, [[x + tw * 0.8, y + 4], [x, y - 58]], 6);
  shape(c, bp, rice ? RICE : "#e6f1f8", 0);
  if (rice) {
    c.save(); c.beginPath(); bp(); c.clip(); c.fillStyle = "#ffffff"; c.fillRect(x - w, y + h * 0.28, w * 2, h); c.restore();
    const r = rnd(5);
    for (let i = 0; i < 28; i++) { const gx = x + (r() - 0.5) * w * 0.8, gy = y + h * 0.4 + r() * h * 0.5; line(c, [[gx, gy], [gx + 12, gy + 4 * (r() - 0.5)]], 3, "#cdbf9a"); }
  }
  shade(c, bp, rice ? "#d9d0b8" : "#b9cfdc", -w * 0.2, 0, 0.5);
  shape(c, bp, "rgba(214,236,250,0.35)", 6);
  shine(c, [[x - w * 0.34, y + h * 0.5], [x - w * 0.36, y + h * 0.78]], 8);
  if (!rice) line(c, [[x - 20, y + h * 0.35], [x + 8, y + h * 0.6]], 3, "#8aa3b3");
};
const stone = (c: Ctx, x: number, y: number, r: number) => {
  const pts = [[-1, -0.2], [-0.7, -0.75], [-0.1, -0.95], [0.6, -0.8], [1, -0.1], [0.8, 0.6], [0.1, 0.9], [-0.7, 0.75]];
  const p = () => { const q = pts.map(([a, b]) => [x + a * r, y + b * r]); const m = (i: number) => [(q[i][0] + q[(i + 1) % q.length][0]) / 2, (q[i][1] + q[(i + 1) % q.length][1]) / 2]; c.moveTo(m(7)[0], m(7)[1]); for (let i = 0; i < q.length; i++) c.quadraticCurveTo(q[i][0], q[i][1], m(i)[0], m(i)[1]); c.closePath(); };
  shape(c, p, COL.grey, 6); shade(c, p, COL.greyDk, -r * 0.4, -r * 0.1, 0.55);
  line(c, [[x - r * 0.2, y - r * 0.5], [x + r * 0.1, y - r * 0.1], [x - r * 0.1, y + r * 0.2]], 3, COL.greyDk);
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.35, y - r * 0.6]], 7);
};
const pbottle = (c: Ctx, x: number, yb: number, w: number, h: number, fill: number, holes: number[] = []) => {
  const capH = h * 0.07, nw = w * 0.2, top = yb - h, shy = yb - h * 0.7;
  const bp = () => { c.moveTo(x - nw, top + capH); c.lineTo(x - nw, top + capH + h * 0.08); c.bezierCurveTo(x - nw, shy - h * 0.08, x - w / 2, shy - h * 0.06, x - w / 2, shy + h * 0.04); c.lineTo(x - w / 2, yb - w * 0.16); c.quadraticCurveTo(x - w / 2, yb, x - w / 2 + w * 0.16, yb); c.lineTo(x + w / 2 - w * 0.16, yb); c.quadraticCurveTo(x + w / 2, yb, x + w / 2, yb - w * 0.16); c.lineTo(x + w / 2, shy + h * 0.04); c.bezierCurveTo(x + w / 2, shy - h * 0.06, x + nw, shy - h * 0.08, x + nw, top + capH + h * 0.08); c.lineTo(x + nw, top + capH); c.closePath(); };
  shadow(c, x + w * 0.15, yb + 6, w * 0.6, w * 0.1);
  shape(c, bp, "rgba(225,240,250,0.55)", 0);
  if (fill > 0) { const wy = yb - (h * 0.8) * fill; c.save(); c.beginPath(); bp(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, wy, w * 2, h); c.fillStyle = COL.drop; c.fillRect(x - w, wy, w * 2, 8); c.restore(); shade(c, bp, COL.waterDk, -w * 0.16, 0, 0.0); }
  shade(c, bp, "#9fc0da", -w * 0.16, 0, 0.35);
  shape(c, bp, "rgba(0,0,0,0)", 6);
  for (const g of [0.55, 0.6]) line(c, [[x - w / 2 + 4, yb - h * g], [x + w / 2 - 4, yb - h * g]], 3, COL.glassEdge);
  shape(c, () => rrect(c, x - nw - 4, top, nw * 2 + 8, capH, 5), COL.blue, 5);
  shine(c, [[x - w * 0.32, yb - h * 0.5], [x - w * 0.32, yb - h * 0.12]], Math.max(5, w * 0.07));
  holes.forEach((hy) => shape(c, () => ell(c, x - w / 2 + 2, hy, 8, 11), INK, 0));
};

// ---------------------------------------------------------------- shared bits
const N = (c: Ctx, x: number, y: number, h: number) => line(c, [[x, y + h], [x, y], [x + h * 0.55, y + h], [x + h * 0.55, y]], Math.max(6, h * 0.12));
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r);
  shape(c, body, COL.blue, 6);
  c.save(); c.beginPath(); body(); c.clip();
  for (const [a, b, rx, ry, rot] of [[-0.35, -0.3, 0.32, 0.22, 0.5], [0.3, 0.2, 0.25, 0.32, -0.3], [-0.2, 0.55, 0.2, 0.12, 0.2], [0.45, -0.5, 0.15, 0.1, 0]]) { c.beginPath(); ell(c, x + a * r, y + b * r, rx * r, ry * r, rot); c.fillStyle = COL.leaf; c.fill(); }
  c.restore();
  shade(c, body, COL.blueDk, r * 0.25, r * 0.2, 0.4);
  shape(c, body, "rgba(0,0,0,0)", 6);
};
const moon = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r);
  shape(c, body, "#d9d6cf", 6); shade(c, body, "#a9a69f", r * 0.3, r * 0.2, 0.5);
  for (const [a, b, k] of [[-0.3, -0.25, 0.2], [0.3, 0.1, 0.15], [-0.1, 0.4, 0.13]]) shape(c, () => ell(c, x + a * r, y + b * r, k * r, k * r), "#bdb9b0", 3);
  shape(c, body, "rgba(0,0,0,0)", 6);
};
const stars = (c: Ctx, seed: number, n = 30) => { const r = rnd(seed); for (let i = 0; i < n; i++) { const x = r() * 1080, y = r() * 1080, k = 3 + r() * 5; c.beginPath(); ell(c, x, y, k, k); c.fillStyle = "#fff6c9"; c.fill(); } };
const SPACE = "#1d1a3a";
const mango = (c: Ctx, x: number, y: number, r: number, rot = -0.4) => {
  const p = () => ell(c, x, y, r, r * 0.78, rot);
  shape(c, p, "#f5b83d", 6); shade(c, p, "#e08a2b", r * 0.3, r * 0.25, 0.6);
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.2, r * 0.3, r * 0.2, rot), "#f2935a", 0);
  shape(c, p, "rgba(0,0,0,0)", 6);
  leaf(c, x + Math.cos(rot - 1.3) * r * 0.7, y + Math.sin(rot - 1.3) * r * 0.7, r * 0.9, -0.6);
};
const leaf = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.32, ny = Math.cos(an) * len * 0.32, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, COL.leaf, 5);
};
const apple = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => ell(c, x, y, r, r * 0.92);
  shape(c, p, COL.red, 6); shade(c, p, "#b93a2a", r * 0.3, r * 0.2, 0.6);
  shine(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.4, y - r * 0.55]], 7);
  line(c, [[x, y - r * 0.85], [x + r * 0.1, y - r * 1.25]], 6, COL.soilDk);
  leaf(c, x + r * 0.1, y - r * 1.1, r * 0.7, -0.3);
};
const floor = (c: Ctx, y: number, col = "#d9c9a8") => { c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 6); };
// a glass tank seen from the side; inner() draws what is in it (under the water tint)
const tank = (c: Ctx, x: number, y: number, w: number, h: number, lvl: number, inner: () => void = () => {}) => {
  const wy = y + h * (1 - lvl);
  shadow(c, x + w / 2 + 20, y + h + 14, w * 0.55, 18);
  shape(c, () => rrect(c, x, y, w, h, 18), "rgba(225,240,250,0.5)", 0);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 18); c.clip(); c.fillStyle = COL.water; c.fillRect(x, wy, w, h); c.restore();
  inner();
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 18); c.clip(); c.globalAlpha = 0.35; c.fillStyle = COL.water; c.fillRect(x, wy, w, h); c.globalAlpha = 1; c.restore();
  line(c, [[x + 4, wy], [x + w - 4, wy]], 6, COL.waterDk);
  shape(c, () => rrect(c, x, y, w, h, 18), "rgba(214,236,250,0.15)", 6);
  shine(c, [[x + 24, y + 30], [x + 24, y + h - 40]], 9);
  return wy;
};
const bucket = (c: Ctx, x: number, top: number, w: number, h: number, water = true) => {
  const b = w * 0.78;
  shadow(c, x + 30, top + h + 10, w * 0.55, 16);
  const body = () => { c.moveTo(x - w / 2, top); c.lineTo(x + w / 2, top); c.lineTo(x + b / 2, top + h); c.lineTo(x - b / 2, top + h); c.closePath(); };
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, -w * 0.28, 0, 0.55);
  shape(c, () => ell(c, x, top, w / 2, w * 0.1), water ? COL.water : "#3a3540", 6);
  if (water) shape(c, () => ell(c, x - w * 0.12, top, w * 0.2, w * 0.04), COL.drop, 0);
};

// ================================================================ FLOWS
// flow.e1 : a forcemeter, a bag of rice, a big pull arrow
const f_e1 = (c: Ctx) => {
  ground(c);
  const k = fm(c, 460, 90, 3, { s: 1.3 });
  bag(c, k.hx, k.hy + 58, 230, 250, true);
  arrow(c, [[780, 560], [780, 900]], RED, 16);
  write(c, "3", 840, 700, 90, INK, 12);
};
// flow.e2 : the stone in air (3) and in water (2)
const f_e2 = (c: Ctx) => {
  ground(c);
  const left = fm(c, 270, 70, 3, { s: 0.75 }), right = fm(c, 810, 70, 2, { s: 0.75 });
  tank(c, 70, 640, 400, 300, 0.55, () => {});
  line(c, [[left.hx, left.hy], [left.hx, 520]], 5, "#8a6f4a"); stone(c, 270, 570, 50);
  tank(c, 610, 640, 400, 300, 0.55, () => { line(c, [[right.hx, right.hy], [right.hx, 790]], 5, "#8a6f4a"); stone(c, 810, 840, 50); });
  arrow(c, [[810, 940], [810, 884]], RED, 12);
};
// flow.e3 : a lift going up, a child with a forcemeter and a bottle
const f_e3 = (c: Ctx) => {
  ground(c, "#cfd6de");
  shape(c, () => rrect(c, 150, 80, 700, 880, 8), COL.steelIn, 6);
  shape(c, () => rrect(c, 190, 120, 620, 800, 4), "#f1ead6", 4);
  line(c, [[190, 880], [810, 880]], 5, COL.steelDk);
  person(c, 400, 880, 560, { armR: [0.5, -1.2] });
  const hx = 400 + 0.11 * 560 + Math.cos(0.5) * 95.2 + Math.cos(-1.2) * 89.6, hy = 880 - 0.74 * 560 + 16.8 + Math.sin(0.5) * 95.2 + Math.sin(-1.2) * 89.6;
  const k = fm(c, hx, hy + 12, 10, { s: 0.5, max: 12, step: 22, lab: 4 });
  line(c, [[k.hx, k.hy], [k.hx - 14, k.hy + 34]], 3); line(c, [[k.hx, k.hy], [k.hx + 14, k.hy + 34]], 3);
  pbottle(c, k.hx, k.hy + 34 + 150, 84, 150, 0.97);
  arrow(c, [[930, 820], [930, 200]], RED, 18);
};
// flow.e4 : a leaking bottle held high over a bucket
const f_e4 = (c: Ctx) => {
  ground(c);
  pbottle(c, 480, 600, 200, 400, 0.85, [500, 545]);
  hand(c, 640, 215, Math.PI, 1.4, SKIN.adult, CLOTH.adult);
  for (const hy of [500, 545]) { c.beginPath(); c.moveTo(382, hy); c.quadraticCurveTo(300, hy - 10, 270, hy + 150); c.strokeStyle = COL.water; c.lineWidth = 8; c.stroke(); }
  bucket(c, 230, 760, 360, 230);
  arrow(c, [[800, 300], [800, 640]], RED, 16);
};
// flow.a1 : a hand pressing a wall, a cushion and water; the push-back arrows get smaller
const f_a1 = (c: Ctx) => {
  ground(c);
  // wall
  shape(c, () => rrect(c, 160, 250, 220, 560, 8), "#d8c3a0", 6);
  for (let y = 330; y < 800; y += 80) line(c, [[160, y], [380, y]], 3, "#b79f78");
  hand(c, 60, 530, 0, 1, SKIN.child, CLOTH.child, true);
  arrow(c, [[150, 700], [30, 700]], RED, 14);
  // cushion, the hand sinking in
  const cu = () => { c.moveTo(520, 250); c.lineTo(740, 250); c.lineTo(740, 810); c.lineTo(520, 810); c.quadraticCurveTo(480, 700, 535, 600); c.quadraticCurveTo(420, 530, 535, 470); c.quadraticCurveTo(480, 350, 520, 250); c.closePath(); };
  shape(c, cu, COL.pink, 6); shade(c, cu, "#d8758f", 40, 0, 0.5);
  hand(c, 440, 530, 0, 1, SKIN.child, CLOTH.child, true);
  arrow(c, [[540, 700], [470, 700]], RED, 12);
  // water, the hand going in from above
  tank(c, 760, 450, 300, 420, 0.65);
  hand(c, 910, 480, Math.PI / 2, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[910, 840], [910, 790]], RED, 9);
};
// flow.a2 : one foot on each of two bathroom scales
const scaleBox = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + 14, y + 22, w * 0.55, 14);
  shape(c, () => rrect(c, x - w / 2, y - 18, w, 40, 10), COL.steel, 6);
  shape(c, () => rrect(c, x - w * 0.2, y - 10, w * 0.4, 18, 5), "#22303a", 3);
  write(c, "30", x - w * 0.16, y - 8, 16, "#c9f06b", 4);
};
const f_a2 = (c: Ctx) => {
  ground(c);
  floor(c, 900);
  person(c, 540, 880, 640);
  scaleBox(c, 430, 880, 190); scaleBox(c, 650, 880, 190);
  arrow(c, [[250, 880], [250, 780]], RED, 12); arrow(c, [[830, 880], [830, 780]], RED, 12);
};
// flow.a3 : floating like an astronaut
const f_a3 = (c: Ctx) => {
  ground(c, SPACE); stars(c, 4, 26);
  c.save(); c.translate(500, 560); c.rotate(-0.5);
  person(c, 0, 300, 600, { armL: [-2.6, -2.3], armR: [-0.5, -0.8] });
  c.restore();
  // a floating ball of water near her mouth
  const bx = 700, by = 330;
  shape(c, () => ell(c, bx, by, 48, 48), COL.water, 5); shine(c, [[bx - 24, by - 14], [bx - 8, by - 30]], 7);
  arrow(c, [[860, 620], [930, 540]], RED, 10);
  arrow(c, [[160, 560], [100, 480]], RED, 10);
};
// flow.a5 : a notebook, a heavy elephant column and a light feather column
const elephant = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const G = "#9aa0b4", GD = "#767c92";
  for (const lx of [-70, -30, 40, 80]) shape(c, () => rrect(c, lx - 18, 20, 36, 90, 10), lx > 0 ? GD : G, 5);
  shape(c, () => ell(c, 0, 0, 120, 80), G, 5); shade(c, () => ell(c, 0, 0, 120, 80), GD, 30, 20, 0.5);
  shape(c, () => ell(c, -105, -20, 55, 50), G, 5);
  shape(c, () => { c.moveTo(-145, -5); c.quadraticCurveTo(-190, 40, -170, 100); c.quadraticCurveTo(-155, 112, -150, 98); c.quadraticCurveTo(-150, 50, -118, 20); c.closePath(); }, G, 5);
  shape(c, () => ell(c, -85, -10, 28, 40, 0.2), GD, 4);
  shape(c, () => { c.moveTo(-140, 20); c.quadraticCurveTo(-170, 40, -160, 60); c.lineTo(-145, 40); c.closePath(); }, WHITE, 4);
  shape(c, () => ell(c, -118, -30, 6, 7), INK, 0);
  line(c, [[118, -10], [140, 40], [134, 70]], 6, INK);
  c.restore();
};
const feather = (c: Ctx, x: number, y: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(0.5);
  const vane = () => { c.moveTo(0, -len / 2); c.bezierCurveTo(len * 0.22, -len * 0.35, len * 0.2, len * 0.15, 0, len * 0.38); c.bezierCurveTo(-len * 0.2, len * 0.15, -len * 0.22, -len * 0.35, 0, -len / 2); c.closePath(); };
  shape(c, vane, "#7fc1e8", 5); shade(c, vane, COL.blueDk, 30, 0, 0.35);
  for (let i = -5; i <= 5; i++) { const yy = i * len * 0.07, w = len * 0.2 * (1 - Math.abs(i) / 7); line(c, [[0, yy], [-w, yy + len * 0.09]], 3, COL.blueDk); line(c, [[0, yy], [w, yy + len * 0.09]], 3, COL.blueDk); }
  line(c, [[0, -len / 2], [0, len / 2 + 20]], 7);
  c.restore();
};
const f_a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 400, 24);
  shape(c, () => rrect(c, 140, 120, 800, 820, 24), COL.teal, 6);
  shape(c, () => rrect(c, 180, 140, 720, 780, 14), COL.paper, 5);
  line(c, [[540, 150], [540, 910]], 5);
  for (let y = 300; y < 900; y += 90) { line(c, [[200, y + 240], [520, y + 240]], 2, "#d9d0b8"); line(c, [[560, y + 240], [880, y + 240]], 2, "#d9d0b8"); }
  elephant(c, 410, 420, 1.15);
  feather(c, 730, 410, 300);
  arrow(c, [[360, 650], [360, 740]], RED, 12);
  arrow(c, [[720, 700], [720, 600]], RED, 12);
};
// flow.p1 : a jar with moong seeds, roots growing down
const f_p1 = (c: Ctx) => {
  ground(c);
  const jx = 540, top = 180, bot = 900, w = 420;
  shadow(c, jx + 30, bot + 20, w * 0.6, 20);
  const jar = () => { c.moveTo(jx - w / 2, top); c.lineTo(jx + w / 2, top); c.lineTo(jx + w / 2, bot - 30); c.quadraticCurveTo(jx + w / 2, bot, jx + w / 2 - 30, bot); c.lineTo(jx - w / 2 + 30, bot); c.quadraticCurveTo(jx - w / 2, bot, jx - w / 2, bot - 30); c.closePath(); };
  shape(c, jar, "rgba(225,240,250,0.55)", 0);
  shape(c, () => rrect(c, jx - w / 2 + 28, top + 20, w - 56, bot - top - 50, 12), "#f5f1e6", 3);
  c.save(); c.beginPath(); jar(); c.clip(); c.fillStyle = COL.water; c.fillRect(jx - w, bot - 110, w * 2, 200); c.restore();
  const root = (x: number, y: number, len: number, bend: number) => { const pts = [[x, y], [x + bend, y + len * 0.5], [x + bend * 0.5, y + len]]; line(c, pts, 20, INK); line(c, pts, 10, "#fffaf0"); };
  const seeds: [number, number, number][] = [[-130, 380, 150], [-45, 330, 200], [50, 420, 160], [130, 360, 220]];
  seeds.forEach(([dx, y, len], i) => { root(jx + dx, y, len, i % 2 ? 14 : -14); line(c, [[jx + dx, y - 6], [jx + dx + 10, y - 70]], 8, COL.greenLt); });
  seeds.forEach(([dx, y], i) => { shape(c, () => ell(c, jx + dx, y, 30, 21, 0.4 + i * 0.5), COL.greenLt, 5); });
  shape(c, jar, "rgba(214,236,250,0.12)", 6);
  shine(c, [[jx - w / 2 + 22, top + 40], [jx - w / 2 + 22, bot - 60]], 9);
  arrow(c, [[860, 380], [860, 640]], RED, 16);
};
// flow.c1 : keys taped to the end of a ruler on a table edge, twanging
const f_c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 0, 600, 480, 60, 8), COL.wood, 6);
  shape(c, () => rrect(c, 40, 660, 60, 400, 4), COL.woodDk, 5);
  shape(c, () => polyP(c, [[0, 590], [320, 590], [320, 610], [0, 610]]), "#e5ae4e", 3);
  // ruler
  const ruler = (rot: number, a: number) => { c.save(); c.translate(280, 585); c.rotate(rot); c.globalAlpha = a;
    shape(c, () => rrect(c, 0, -18, 640, 36, 4), "#f8d77a", 5);
    for (let i = 1; i < 30; i++) line(c, [[i * 21, -18], [i * 21, i % 5 ? -7 : 2]], 2.5);
    // keys taped to the end
    line(c, [[600, 18], [600, 90]], 6); shape(c, () => ell(c, 600, 112, 26, 26), COL.steel, 5);
    shape(c, () => rrect(c, 586, 130, 28, 70, 8), COL.steel, 5);
    shape(c, () => rrect(c, 560, -24, 70, 48, 6), "rgba(255,255,255,0.6)", 4);
    c.restore(); c.globalAlpha = 1; };
  ruler(0.3, 0.3); ruler(-0.3, 0.3); ruler(0, 1);
  arrow(c, [[1010, 560], [1010, 400]], RED, 12); arrow(c, [[1010, 610], [1010, 770]], RED, 12);
};
// flow.c2 : foil ball sinks, flat foil floats
const f_c2 = (c: Ctx) => {
  ground(c);
  const wy = tank(c, 90, 330, 900, 560, 0.7, () => {
    // ball on the bottom
    const bx = 330, by = 820;
    const p = () => ell(c, bx, by, 80, 74);
    shape(c, p, "#dfe5ec", 6); shade(c, p, COL.steelDk, 30, 20, 0.6);
    const r = rnd(3); for (let i = 0; i < 6; i++) line(c, [[bx - 50 + r() * 100, by - 40 + r() * 80], [bx - 30 + r() * 100, by - 40 + r() * 80]], 3, COL.steelDk);
  });
  arrow(c, [[330, 560], [330, 720]], RED, 12);
  // flat foil floating
  shape(c, () => polyP(c, [[560, wy - 10], [900, wy - 10], [910, wy + 8], [550, wy + 8]]), "#dfe5ec", 6);
  void wy;
};

// ================================================================ TERMS
// term.0 gravity: a mango falls from a branch; the Moon far above; arrows to the Earth
const t_gravity = (c: Ctx) => {
  ground(c, "#bfe0f5");
  shape(c, () => ell(c, 540, 1500, 1000, 680), COL.green, 6);
  shape(c, () => ell(c, 540, 1500, 1000, 680), "rgba(0,0,0,0)", 6);
  shade(c, () => ell(c, 540, 1500, 1000, 680), COL.greenDk, 40, 30, 0.35);
  line(c, [[0, 300], [330, 300]], 26, INK); line(c, [[0, 300], [330, 300]], 14, COL.soil);
  leaf(c, 250, 296, 110, -0.7); leaf(c, 150, 300, 100, -2.3);
  line(c, [[330, 300], [330, 360]], 6);
  mango(c, 330, 520, 80);
  arrow(c, [[330, 640], [330, 830]], RED, 14);
  moon(c, 800, 170, 80);
  arrow(c, [[800, 290], [800, 520]], RED, 10);
};
// term.1 weight: rice packet on a forcemeter, a long pull arrow and 10
const t_weight = (c: Ctx) => {
  ground(c);
  const k = fm(c, 430, 80, 10, { s: 0.95, max: 10, step: 28, lab: 5 });
  bag(c, k.hx, k.hy + 58, 220, 230, true);
  arrow(c, [[740, 520], [740, 900]], RED, 18);
  write(c, "10", 790, 640, 100, INK, 13); N(c, 960, 640, 100);
};
// term.2 mass: the same bag of rice on Earth and on the Moon, 1000 g each
const t_mass = (c: Ctx) => {
  const half = (x0: number, moonSide: boolean) => {
    c.save(); c.beginPath(); c.rect(x0, 0, 540, 1080); c.clip();
    c.fillStyle = moonSide ? SPACE : "#bfe0f5"; c.fillRect(x0, 0, 540, 1080);
    if (moonSide) { stars(c, 12, 14); } else { shape(c, () => ell(c, x0 + 400, 150, 70, 70), COL.yellow, 5); }
    c.fillStyle = moonSide ? "#c9c5bc" : COL.green; c.fillRect(x0, 800, 540, 280);
    line(c, [[x0, 800], [x0 + 540, 800]], 6);
    c.restore();
    const x = x0 + 270, w = 240, h = 250, base = 840;
    shadow(c, x + 40, base + 4, 140, 24);
    const bp = () => { c.moveTo(x - w * 0.46, base - h); c.lineTo(x + w * 0.46, base - h); c.lineTo(x + w / 2, base - 20); c.quadraticCurveTo(x + w / 2, base, x + w / 2 - 22, base); c.lineTo(x - w / 2 + 22, base); c.quadraticCurveTo(x - w / 2, base, x - w / 2, base - 20); c.closePath(); };
    shape(c, bp, RICE, 6); shade(c, bp, "#cfc6aa", -50, 0, 0.55);
    shape(c, () => ell(c, x, base - h, w * 0.46, 30), WHITE, 6);
    shape(c, () => rrect(c, x - 100, base - 150, 200, 70, 10), WHITE, 4);
    write(c, "1000 g", x - 90, base - 140, 42, INK, 6);
  };
  half(0, false); half(540, true);
  line(c, [[540, 0], [540, 1080]], 8);
  moon(c, 840, 190, 70); earth(c, 150, 190, 70);
};
// term.3 kilogram: a full one-litre bottle on a kitchen scale, 1000 g
const t_kg = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 970, 450, 40);
  shape(c, () => polyP(c, [[200, 700], [880, 700], [960, 860], [120, 860]]), COL.teal);
  shape(c, () => polyP(c, [[120, 860], [960, 860], [960, 950], [120, 950]]), COL.tealDk);
  shape(c, () => rrect(c, 340, 872, 400, 66, 8), "#22303a", 5);
  write(c, "1000 g", 380, 884, 40, "#c9f06b", 7);
  pbottle(c, 540, 760, 230, 560, 0.97);
};
// term.4 newton: a hand holding a small apple, 1 N beside it
const t_newton = (c: Ctx) => {
  ground(c);
  hand(c, 150, 730, 0, 1.6, SKIN.child, CLOTH.child, true);
  apple(c, 250, 585, 90);
  arrow(c, [[500, 480], [500, 700]], RED, 16);
  write(c, "1", 620, 520, 150, INK, 16); N(c, 740, 520, 150);
};
// term.5 forcemeter: bag of dal at 5
const t_forcemeter = (c: Ctx) => {
  ground(c);
  const k = fm(c, 540, 80, 5, { s: 1.35 });
  const x = k.hx, y = k.hy + 58;
  bag(c, x, y, 190, 200, false);
  const r = rnd(8); for (let i = 0; i < 40; i++) { const gx = x + (r() - 0.5) * 140, gy = y + 60 + r() * 130; shape(c, () => ell(c, gx, gy, 9, 6, r() * 3), COL.yellow, 2); }
};
// term.6 support force: a child on the floor, little arrows up into each foot
const t_support = (c: Ctx) => {
  ground(c);
  floor(c, 800);
  person(c, 540, 800, 600);
  arrow(c, [[504, 980], [504, 826]], RED, 14); arrow(c, [[576, 980], [576, 826]], RED, 14);
};
// term.7 upthrust: a stone in water, a hand holding it, an arrow up from the water
const t_upthrust = (c: Ctx) => {
  ground(c);
  const wy = tank(c, 90, 330, 820, 600, 0.72, () => {
    stone(c, 640, 640, 100);
    hand(c, 840, 610, Math.PI, 1.1, SKIN.child, CLOTH.child);
  });
  void wy;
  arrow(c, [[640, 890], [640, 780]], RED, 16);
};
// term.9 lift: doors open, a family, buttons
const t_lift = (c: Ctx) => {
  ground(c, "#cfd6de");
  shape(c, () => rrect(c, 120, 60, 840, 920, 10), COL.steelDk, 6);
  shape(c, () => rrect(c, 180, 120, 560, 840, 4), "#f1ead6", 4);
  line(c, [[180, 900], [740, 900]], 5, COL.steelDk);
  shape(c, () => rrect(c, 120, 120, 62, 840, 4), COL.steel, 5); shape(c, () => rrect(c, 738, 120, 62, 840, 4), COL.steel, 5);
  person(c, 330, 900, 640, { adult: true }); person(c, 560, 900, 440);
  shape(c, () => rrect(c, 820, 330, 110, 330, 14), "#3a3540", 5);
  ["1", "2", "3"].forEach((d, i) => { shape(c, () => ell(c, 875, 395 + i * 95, 30, 30), i === 1 ? COL.yellow : COL.steel, 5); write(c, d, 861, 380 + i * 95, 30, INK, 5); });
};
// term.10 free fall: top of a jump on a trampoline
const t_freefall = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 380, 30);
  for (const x of [280, 800]) line(c, [[x, 850], [x - 20, 1000]], 14, INK);
  shape(c, () => ell(c, 540, 850, 330, 70), "#3a3540", 6); shape(c, () => ell(c, 540, 846, 290, 54), COL.blue, 4);
  person(c, 540, 700, 440, { armL: [-2.2, -2.0], armR: [-0.9, -1.1] });
  for (const dx of [-45, 0, 45]) line(c, [[540 + dx, 262], [540 + dx * 1.2, 220]], 6);
  arrow(c, [[900, 400], [900, 540]], RED, 14);
};
const SH0 = "rgba(43,35,64,0.18)";
// term.13 orbit: the Moon going round the Earth along a dotted path
const t_orbit = (c: Ctx) => {
  ground(c, SPACE); stars(c, 21, 22);
  c.setLineDash([22, 18]); c.beginPath(); ell(c, 540, 540, 340, 340); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke(); c.setLineDash([]);
  earth(c, 540, 540, 140);
  moon(c, 540 + 340 * Math.cos(-0.8), 540 + 340 * Math.sin(-0.8), 56);
  const pts: number[][] = []; for (let a = -0.6; a <= 0.1; a += 0.1) pts.push([540 + 340 * Math.cos(a), 540 + 340 * Math.sin(a)]);
  arrow(c, pts, RED, 14);
};
// term.17 black hole
const t_blackhole = (c: Ctx) => {
  ground(c, SPACE); stars(c, 33, 30);
  c.save(); c.translate(540, 540); c.rotate(-0.25);
  for (const [rx, ry, col] of [[400, 90, "#f39a3c"], [330, 70, "#ffd34d"], [260, 52, "#fff1b0"]] as [number, number, string][]) { c.beginPath(); ell(c, 0, 0, rx, ry); c.fillStyle = col; c.fill(); }
  c.restore();
  c.beginPath(); ell(c, 540, 540, 150, 150); c.fillStyle = "#000"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.save(); c.translate(540, 540); c.rotate(-0.25);
  for (const [rx, ry, col] of [[400, 90, "#f39a3c"], [330, 70, "#ffd34d"], [260, 52, "#fff1b0"]] as [number, number, string][]) { c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, Math.PI); c.fillStyle = col; c.fill(); }
  c.beginPath(); c.ellipse(0, 0, 150, 40, 0, 0, Math.PI); c.fillStyle = "#000"; c.fill();
  c.restore();
};
// term.20 dark matter: a galaxy with a faint unseen halo
const t_dark = (c: Ctx) => {
  ground(c, SPACE); stars(c, 44, 24);
  c.beginPath(); ell(c, 540, 540, 460, 460); c.fillStyle = "rgba(139,108,201,0.28)"; c.fill();
  c.setLineDash([18, 16]); c.lineWidth = 6; c.strokeStyle = "rgba(200,180,240,0.8)"; c.stroke(); c.setLineDash([]);
  const r = rnd(2);
  for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 160; i++) { const t = i / 160, a = t * 5.2 + arm * Math.PI, rr = 25 + t * 250; const x = 540 + Math.cos(a) * rr + (r() - 0.5) * 36 * t, y = 540 + Math.sin(a) * rr * 0.8 + (r() - 0.5) * 30 * t; c.beginPath(); ell(c, x, y, 4 + r() * 5, 4 + r() * 5); c.fillStyle = r() < 0.3 ? "#fff1b0" : "#ffd34d"; c.fill(); }
  c.beginPath(); ell(c, 540, 540, 55, 44); c.fillStyle = "#fff1b0"; c.fill();
};

// ================================================================ EXPLANATIONS
// expl.0 weight is the pull of gravity: children all round the Earth, arrows to the centre
const e_pull = (c: Ctx) => {
  ground(c, "#bfe0f5");
  earth(c, 540, 540, 170);
  for (const an of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const fx = 540 + Math.sin(an) * 170, fy = 540 - Math.cos(an) * 170;
    c.save(); c.translate(fx, fy); c.rotate(an); person(c, 0, 0, 280); c.restore();
    const ix = 540 + Math.sin(an) * 60, iy = 540 - Math.cos(an) * 60, jx = 540 + Math.sin(an) * 130, jy = 540 - Math.cos(an) * 130;
    arrow(c, [[jx, jy], [ix, iy]], RED, 12);
  }
};
// expl.1 weighing: soap 1, dal 5, water bottle 10 on three forcemeters
const e_weigh = (c: Ctx) => {
  ground(c);
  const o = { s: 0.8, max: 10, step: 20, lab: 5 };
  const a = fm(c, 190, 60, 1, o), b = fm(c, 540, 60, 5, o), d = fm(c, 890, 60, 10, o);
  // soap bar
  line(c, [[a.hx, a.hy], [a.hx, a.hy + 50]], 5, "#8a6f4a");
  shape(c, () => rrect(c, a.hx - 70, a.hy + 50, 140, 80, 22), COL.pink, 6);
  bag(c, b.hx, b.hy + 58, 160, 170, false);
  const r = rnd(4); for (let i = 0; i < 30; i++) { const gx = b.hx + (r() - 0.5) * 110, gy = b.hy + 58 + 50 + r() * 110; shape(c, () => ell(c, gx, gy, 8, 5, r() * 3), COL.yellow, 2); }
  line(c, [[d.hx, d.hy], [d.hx - 24, d.hy + 60]], 4); line(c, [[d.hx, d.hy], [d.hx + 24, d.hy + 60]], 4);
  pbottle(c, d.hx, d.hy + 60 + 330, 130, 330, 0.97);
};
// expl.2 mass: a balance, a fluffy heap of cotton and a small iron block, both 1000 g
const e_mass = (c: Ctx) => {
  ground(c);
  floor(c, 900);
  shape(c, () => polyP(c, [[500, 900], [580, 900], [560, 360], [520, 360]]), COL.steelDk, 6);
  shape(c, () => ell(c, 540, 360, 28, 28), COL.steel, 6);
  line(c, [[130, 330], [950, 330]], 18, INK); line(c, [[130, 330], [950, 330]], 8, COL.steel);
  for (const px of [190, 890]) { line(c, [[px, 330], [px - 90, 520]], 4); line(c, [[px, 330], [px + 90, 520]], 4); }
  for (const px of [190, 890]) shape(c, () => rrect(c, px - 120, 520, 240, 24, 10), COL.steel, 6);
  // cotton
  const r = rnd(9); for (const [dx, dy, k] of [[-60, -50, 70], [30, -60, 80], [-10, -110, 65], [70, -20, 60], [-80, -10, 55], [0, -10, 65]]) shape(c, () => ell(c, 190 + dx, 505 + dy, k, k * 0.85), "#fffdf5", 5); void r;
  // iron
  shape(c, () => rrect(c, 840, 450, 100, 70, 8), COL.steelDk, 6); shape(c, () => polyP(c, [[840, 450], [860, 430], [960, 430], [940, 450]]), COL.steel, 5);
  write(c, "1000 g", 70, 600, 34, INK, 5); write(c, "1000 g", 770, 600, 34, INK, 5);
};
// expl.7 falling: a bottle still with jets, and falling with none
const e_fall = (c: Ctx) => {
  ground(c);
  pbottle(c, 290, 880, 220, 460, 0.85, [650, 700, 750]);
  for (const hy of [650, 700, 750]) { c.beginPath(); c.moveTo(180, hy); c.quadraticCurveTo(110, hy - 10, 70, hy + 120); c.strokeStyle = COL.water; c.lineWidth = 8; c.stroke(); }
  pbottle(c, 780, 740, 220, 460, 0.85, [510, 560, 610]);
  for (const dx of [-50, 0, 50]) line(c, [[780 + dx, 210], [780 + dx, 150]], 6, SH0);
  arrow(c, [[960, 400], [960, 620]], RED, 16);
};

const LIST: [string, (c: Ctx) => void][] = [
  ["flow.e1", f_e1], ["flow.e2", f_e2], ["flow.e3", f_e3], ["flow.e4", f_e4], ["flow.a1", f_a1], ["flow.a2", f_a2], ["flow.a3", f_a3], ["flow.a5", f_a5], ["flow.p1", f_p1], ["flow.c1", f_c1], ["flow.c2", f_c2],
  ["term.0", t_gravity], ["term.1", t_weight], ["term.2", t_mass], ["term.3", t_kg], ["term.4", t_newton], ["term.5", t_forcemeter], ["term.6", t_support], ["term.7", t_upthrust], ["term.9", t_lift], ["term.10", t_freefall], ["term.13", t_orbit], ["term.17", t_blackhole], ["term.20", t_dark],
  ["expl.0", e_pull], ["expl.1", e_weigh], ["expl.2", e_mass], ["expl.7", e_fall],
];
export const ic_gravityWeightAndMassL3 = cards("sci.gravity.weight-and-mass.L3 cards", LIST.map(([, f]) => f));
