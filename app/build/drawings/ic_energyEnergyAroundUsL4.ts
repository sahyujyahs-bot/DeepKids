import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// ENERGY BY THE NUMBERS (sci.energy.energy-around-us.L4) · set-up cards for Stair Power and Meter Blink, then the
// flow cards and three idea cards. Same child and grown-up as the rest of the kit.

const PI = Math.PI;
const FLOOR = "#e2d2b4", STONE = "#d8c4a1", STONEDK = "#c2aa84", LCD = "#c9f06b", SCREEN = "#22303a", WARM = "#f7b733", GLOW = "rgba(255,221,120,0.45)";
type Pt = [number, number];

// ---------------------------------------------------------------- letters the cards need beside flatKit's numbers
const LET: Record<string, number[][][]> = {
  W: [[[0, 0], [0.14, 1], [0.36, 0.35], [0.58, 1], [0.72, 0]]],
  J: [[[0.15, 0], [0.6, 0]], [[0.42, 0], [0.42, 0.8], [0.3, 1], [0.1, 1], [0.02, 0.84]]],
  k: [[[0.08, 0], [0.08, 1]], [[0.52, 0.35], [0.08, 0.74]], [[0.24, 0.6], [0.55, 1]]],
  h: [[[0.08, 0], [0.08, 1]], [[0.08, 0.5], [0.3, 0.34], [0.52, 0.46], [0.52, 1]]],
  i: [[[0.22, 0.38], [0.22, 1]], [[0.22, 0.1], [0.22, 0.14]]],
  p: [[[0.08, 0.36], [0.08, 1.3]], [[0.08, 0.5], [0.3, 0.34], [0.55, 0.5], [0.55, 0.72], [0.3, 0.9], [0.08, 0.76]]],
  s: [[[0.52, 0.42], [0.3, 0.32], [0.08, 0.46], [0.3, 0.64], [0.52, 0.8], [0.3, 1], [0.05, 0.9]]],
  "?": [[[0.05, 0.2], [0.3, 0], [0.55, 0.2], [0.5, 0.45], [0.3, 0.6], [0.3, 0.75]], [[0.3, 0.95], [0.3, 1]]],
  "/": [[[0.05, 1], [0.55, 0]]],
};
const adv = (ch: string, h: number) => h * (ch === " " ? 0.35 : ch === "m" || ch === "W" ? 0.95 : 0.8);
const txtW = (t: string, h: number) => [...t].reduce((w, ch) => w + adv(ch, h), 0);
// numbers and the few letters above; x is the left edge, y the top of the letters
const txt = (c: Ctx, t: string, x: number, y: number, h: number, col = INK, w = 6) => {
  let cx = x;
  for (const ch of t) {
    if (LET[ch]) {
      c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
      LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); });
    } else if (ch !== " ") write(c, ch, cx, y, h, col, w);
    cx += adv(ch, h);
  }
};
const txtC = (c: Ctx, t: string, x: number, y: number, h: number, col = INK, w = 6) => txt(c, t, x - txtW(t, h) / 2, y, h, col, w);

// ---------------------------------------------------------------- rooms
const floor = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const ceiling = (c: Ctx, y: number) => { c.fillStyle = COL.steelIn; c.fillRect(0, 0, D, y); line(c, [[0, y], [D, y]], 6); };
// a staircase in profile rising from (x0, floorY) toward dir: n steps, w wide and h high, then a landing to the frame
// edge. Returns the treads as [xLeft, xRight, yTop].
const stairs = (c: Ctx, x0: number, floorY: number, n: number, w: number, h: number, dir: 1 | -1 = 1) => {
  const pts: number[][] = [[x0, floorY]], treads: number[][] = [];
  for (let i = 0; i < n; i++) { const y = floorY - (i + 1) * h, xa = x0 + dir * i * w, xb = x0 + dir * (i + 1) * w; pts.push([xa, y], [xb, y]); treads.push([Math.min(xa, xb), Math.max(xa, xb), y]); }
  const edge = dir > 0 ? D + 20 : -20; pts.push([edge, floorY - n * h], [edge, floorY]);
  shape(c, () => polyP(c, pts), STONE);
  c.fillStyle = STONEDK;
  for (const [xa, xb, y] of treads) c.fillRect(xa + 3, y + 3, xb - xa - 6, 14);
  const top = treads[n - 1]; if (dir > 0) c.fillRect(top[1] + 3, top[2] + 3, D - top[1], 14); else c.fillRect(0, top[2] + 3, top[0] - 3, 14);
  return treads;
};
// a wooden handrail from a to b with posts at the given x down to yBottom
const rail = (c: Ctx, a: Pt, b: Pt, posts: Pt[]) => {
  const yAt = (x: number) => a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
  for (const [px, py] of posts) { line(c, [[px, yAt(px)], [px, py]], 18, INK); line(c, [[px, yAt(px)], [px, py]], 9, COL.woodDk); }
  line(c, [a, b], 28, INK); line(c, [a, b], 18, COL.wood);
};
// a table seen from the front: top slab from x1 to x2 at y, legs to yFloor
const table = (c: Ctx, x1: number, x2: number, y: number, yFloor: number) => {
  for (const lx of [x1 + 30, x2 - 30]) shape(c, () => rrect(c, lx - 14, y + 20, 28, yFloor - y - 20, 4), COL.woodDk, 5);
  shape(c, () => rrect(c, x1, y, x2 - x1, 30, 6), COL.wood);
  shade(c, () => rrect(c, x1, y, x2 - x1, 30, 6), COL.woodDk, 0, 16);
};
// a small circle of skin drawn over a held object, so the hand is seen gripping it
const grip = (c: Ctx, p: Pt, h: number, adult = false) => {
  const r = h * 0.04;
  shape(c, () => ell(c, p[0], p[1], r * 1.05, r * 0.85), adult ? SKIN.adult : SKIN.child, 5);
  line(c, [[p[0] - r * 0.5, p[1] - r * 0.1], [p[0] + r * 0.5, p[1] - r * 0.1]], 3, adult ? SKIN.adultDk : SKIN.childDk);
};

// ---------------------------------------------------------------- things
// a phone, centre (x, y), turned by rot, showing a stopwatch time
const phone = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, t: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, w * 0.16), INK, 5);
  shape(c, () => rrect(c, -w / 2 + 6, -h / 2 + 12, w - 12, h - 24, 6), SCREEN, 0);
  shape(c, () => ell(c, 0, -h * 0.2, w * 0.22, w * 0.22), SCREEN, 4); c.strokeStyle = LCD; c.lineWidth = 4; c.beginPath(); c.arc(0, -h * 0.2, w * 0.22, -PI / 2, PI * 0.3); c.stroke();
  const th = w * 0.3; txtC(c, t, 0, h * 0.08, th, LCD, 4);
  c.restore();
};
// a wooden ruler standing upright, bottom at (x, yBot), len tall; pxCm pixels per centimetre, a number every `every` cm
const rulerV = (c: Ctx, x: number, yBot: number, len: number, pxCm: number, every = 10, w = 52) => {
  shadow(c, x + 8, yBot + 4, w * 0.7, 10);
  shape(c, () => rrect(c, x - w / 2, yBot - len, w, len, 6), COL.wood);
  shade(c, () => rrect(c, x - w / 2, yBot - len, w, len, 6), COL.woodDk, w * 0.6, 0, 0.35);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let cm = 0; cm * pxCm <= len - 4; cm++) { const y = yBot - cm * pxCm, l = cm % 10 === 0 ? w * 0.5 : cm % 5 === 0 ? w * 0.36 : w * 0.2; c.lineWidth = cm % 10 === 0 ? 3.5 : 2; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2 + l, y); c.stroke(); }
  for (let cm = every; cm * pxCm <= len - 16; cm += every) write(c, String(cm), x - w / 2 + w * 0.5, yBot - cm * pxCm - 8, 15, INK, 2.5);
};
// a bathroom scale seen from the front and a little above, centre of its top at (x, y); the window shows t
const bathScale = (c: Ctx, x: number, y: number, w: number, t: string) => {
  shadow(c, x + 20, y + 120, w * 0.55, 22);
  const top = () => polyP(c, [[x - w * 0.42, y - 40], [x + w * 0.42, y - 40], [x + w / 2, y + 40], [x - w / 2, y + 40]]);
  shape(c, top, COL.steel); shade(c, top, COL.steelDk, 0, 28, 0.35);
  shape(c, () => polyP(c, [[x - w / 2, y + 40], [x + w / 2, y + 40], [x + w / 2, y + 115], [x - w / 2, y + 115]]), COL.steelDk);
  shape(c, () => rrect(c, x - 95, y + 50, 190, 56, 8), SCREEN, 5);
  txtC(c, t, x, y + 60, 38, LCD, 5);
};
// a ceiling fan hanging from yCeil, hub at (x, y), blades r long; spin adds motion arcs
const fan = (c: Ctx, x: number, y: number, r: number, yCeil: number, spin: boolean) => {
  line(c, [[x, yCeil], [x, y]], 22, INK); line(c, [[x, yCeil], [x, y]], 12, COL.steel);
  shape(c, () => polyP(c, [[x - r * 0.18, yCeil], [x + r * 0.18, yCeil], [x + r * 0.12, yCeil + r * 0.12], [x - r * 0.12, yCeil + r * 0.12]]), COL.steel, 5);
  c.save(); c.translate(x, y); c.scale(1, 0.5);
  for (let k = 0; k < 3; k++) {
    const a = -PI / 2 + 0.5 + (k * 2 * PI) / 3, bx = Math.cos(a) * r * 0.58, by = Math.sin(a) * r * 0.58;
    shape(c, () => ell(c, bx, by, r * 0.5, r * 0.14, a), COL.brown, 7);
    c.save(); c.beginPath(); ell(c, bx, by, r * 0.5, r * 0.14, a); c.clip(); c.beginPath(); ell(c, bx + Math.cos(a + PI / 2) * r * 0.08, by + Math.sin(a + PI / 2) * r * 0.08, r * 0.5, r * 0.14, a); c.fillStyle = COL.soilDk; c.globalAlpha = 0.35; c.fill(); c.restore(); c.globalAlpha = 1;
  }
  shape(c, () => ell(c, 0, 0, r * 0.2, r * 0.2), COL.steel, 7); shape(c, () => ell(c, 0, 0, r * 0.08, r * 0.08), COL.tealDk, 5);
  if (spin) { c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.globalAlpha = 0.6; for (let k = 0; k < 3; k++) { const a = -PI / 2 + 0.15 + (k * 2 * PI) / 3; c.beginPath(); c.arc(0, 0, r * 1.14, a, a + 0.8); c.stroke(); } c.globalAlpha = 1; }
  c.restore();
};
// a table fan standing with its base at (x, yBase); cage radius r
const tableFan = (c: Ctx, x: number, yBase: number, r: number) => {
  const cy = yBase - r - r * 0.55;
  shadow(c, x + 20, yBase + 4, r * 0.8, r * 0.12);
  shape(c, () => ell(c, x, yBase - r * 0.08, r * 0.75, r * 0.16), COL.tealDk);
  shape(c, () => rrect(c, x - r * 0.14, cy + r * 0.8, r * 0.28, yBase - cy - r * 0.9, 6), COL.teal, 5);
  shape(c, () => ell(c, x, cy, r, r), COL.steelIn, 7);
  for (let k = 0; k < 3; k++) { const a = -PI / 2 + 0.3 + (k * 2 * PI) / 3; shape(c, () => ell(c, x + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5, r * 0.42, r * 0.2, a), COL.teal, 5); }
  c.save(); c.beginPath(); ell(c, x, cy, r, r); c.clip(); c.strokeStyle = INK; c.lineWidth = 2; c.globalAlpha = 0.5;
  for (let k = -5; k <= 5; k++) { c.beginPath(); c.moveTo(x + k * r * 0.18, cy - r); c.lineTo(x + k * r * 0.18, cy + r); c.stroke(); c.beginPath(); c.moveTo(x - r, cy + k * r * 0.18); c.lineTo(x + r, cy + k * r * 0.18); c.stroke(); }
  c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x, cy, r * 0.17, r * 0.17), COL.tealDk, 5);
};
// a soft yellow glow and short rays round (x, y)
const glow = (c: Ctx, x: number, y: number, r: number, rays = true, col = GLOW) => {
  c.fillStyle = col; c.beginPath(); ell(c, x, y, r * 2.2, r * 2.2); c.fill(); c.beginPath(); ell(c, x, y, r * 1.6, r * 1.6); c.fill();
  if (rays) for (let k = 0; k < 8; k++) { const a = (k * PI) / 4 + 0.2; line(c, [[x + Math.cos(a) * r * 1.9, y + Math.sin(a) * r * 1.9], [x + Math.cos(a) * r * 2.6, y + Math.sin(a) * r * 2.6]], 7, WARM); }
};
// an LED bulb standing upright: glass centre (x, y), radius r, screw base below. on adds the glow.
const bulb = (c: Ctx, x: number, y: number, r: number, on: boolean) => {
  if (on) glow(c, x, y, r);
  shape(c, () => rrect(c, x - r * 0.42, y + r * 1.0, r * 0.84, r * 0.7, 6), COL.steelDk, 5);
  for (let k = 0; k < 3; k++) line(c, [[x - r * 0.4, y + r * (1.15 + k * 0.17)], [x + r * 0.4, y + r * (1.15 + k * 0.17)]], 3, INK);
  shape(c, () => polyP(c, [[x - r * 0.55, y + r * 0.72], [x + r * 0.55, y + r * 0.72], [x + r * 0.45, y + r * 1.05], [x - r * 0.45, y + r * 1.05]]), WHITE, 5);
  shape(c, () => { c.arc(x, y, r, PI * 0.78, PI * 0.22); c.lineTo(x + r * 0.55, y + r * 0.74); c.lineTo(x - r * 0.55, y + r * 0.74); c.closePath(); }, on ? "#fff3c4" : COL.cloth, 5);
  shine(c, [[x - r * 0.55, y - r * 0.35], [x - r * 0.3, y - r * 0.65]], 7);
};
// a table lamp: base on the table at (x, yTable), a stem, a holder and an upright bulb; returns the bulb centre
const lamp = (c: Ctx, x: number, yTable: number, r: number, on: boolean): Pt => {
  const by = yTable - r * 4.3;
  shadow(c, x + 30, yTable + 4, r * 1.1, r * 0.2);
  shape(c, () => ell(c, x, yTable - r * 0.1, r * 1.1, r * 0.3), COL.tealDk);
  shape(c, () => rrect(c, x - r * 0.12, by + r * 1.6, r * 0.24, yTable - by - r * 1.75, 5), COL.teal, 5);
  shape(c, () => rrect(c, x - r * 0.5, by + r * 1.55, r, r * 0.3, 6), COL.tealDk, 5);
  bulb(c, x, by, r, on);
  return [x, by];
};
// a home electricity meter box, top-left (x, y); led 0..1 is how bright the red light is
const meter = (c: Ctx, x: number, y: number, w: number, h: number, led: number, label = false) => {
  shadow(c, x + w / 2 + w * 0.06, y + h + 8, w * 0.55, 14);
  shape(c, () => rrect(c, x, y, w, h, w * 0.05), WHITE);
  shade(c, () => rrect(c, x, y, w, h, w * 0.05), COL.steelDk, w * 0.08, 0, 0.25);
  shape(c, () => rrect(c, x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.17, 8), SCREEN, 5);
  txtC(c, "04826", x + w / 2, y + h * 0.135, h * 0.1, LCD, Math.max(3, h * 0.012));
  const lx = x + w / 2, ly = y + h * (label ? 0.66 : 0.6), lr = w * 0.05;
  if (led > 0.5) glow(c, lx, ly, lr, true, "rgba(255,120,90,0.4)");
  shape(c, () => ell(c, lx, ly, lr, lr), led > 0.5 ? "#ff5a3c" : "#8a2a20", 4);
  if (led > 0.5) shape(c, () => ell(c, lx - lr * 0.3, ly - lr * 0.3, lr * 0.3, lr * 0.3), "#ffd0c4", 0);
  if (label) { shape(c, () => rrect(c, x + w * 0.1, y + h * 0.33, w * 0.8, h * 0.11, 6), COL.steelIn, 4); txtC(c, "3200 imp/kWh", x + w / 2, y + h * 0.357, h * 0.055, INK, 4); }
  shape(c, () => rrect(c, x + w * 0.05, y + h * 0.82, w * 0.9, h * 0.13, 6), COL.steel, 4);
  for (const k of [0.25, 0.5, 0.75]) shape(c, () => ell(c, x + w * k, y + h * 0.885, w * 0.02, w * 0.02), COL.steelDk, 3);
  for (const k of [0.3, 0.7]) { line(c, [[x + w * k, y + h * 0.95], [x + w * k, y + h + 60]], 14, INK); line(c, [[x + w * k, y + h * 0.95], [x + w * k, y + h + 60]], 6, COL.greyDk); }
};
// a sheet of paper, top-left (x, y), turned by rot about its centre
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot); c.translate(-w / 2, -h / 2);
  shadow(c, w / 2 + 16, h + 6, w * 0.5, 14);
  shape(c, () => rrect(c, 0, 0, w, h, 8), COL.paper, 5);
};
// grid lines inside a table whose top-left is (x, y): cols and rows as fractions of the width and height
const grid = (c: Ctx, x: number, y: number, w: number, h: number, cols: number[], rows: number[]) => {
  shape(c, () => rrect(c, x, y, w, h, 4), WHITE, 5);
  for (const f of cols) line(c, [[x + w * f, y], [x + w * f, y + h]], 4);
  for (const f of rows) line(c, [[x, y + h * f], [x + w, y + h * f]], 4);
};
// a pencil lying with its middle at (x, y) along angle an (the tip at the far end)
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len / 2, -13, len * 0.82, 26, 4), COL.yellow, 5);
  line(c, [[-len / 2 + 8, 0], [-len / 2 + len * 0.8, 0]], 3, COL.woodDk);
  shape(c, () => rrect(c, -len / 2 - 20, -13, 28, 26, 5), COL.pink, 5);
  shape(c, () => polyP(c, [[len * 0.32, -13], [len / 2, 0], [len * 0.32, 13]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len * 0.44, -5], [len / 2, 0], [len * 0.44, 5]]), INK, 0);
  c.restore();
};
// a chapati on a plate-less surface, centre (x, y)
const chapati = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), "#e9c98d", 5);
  shade(c, () => ell(c, x, y, rx, ry), "#c9a062", rx * 0.14, ry * 0.14, 0.4);
  for (const [u, v, s] of [[-0.45, -0.2, 0.12], [0.1, -0.5, 0.1], [0.5, 0.1, 0.13], [-0.1, 0.4, 0.1], [0.25, 0.5, 0.08], [-0.6, 0.35, 0.08]]) shape(c, () => ell(c, x + u * rx, y + v * ry, rx * s, ry * s), "#b7865a", 0);
};
// a clear 1 litre water bottle, bottom centre (x, y), width w, height h (cap on)
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill = 0.9) => {
  const bw = w / 2, nw = w * 0.22, top = y - h * 0.78, mouth = y - h * 0.92;
  const body = () => { c.moveTo(x - bw, y - w * 0.12); c.quadraticCurveTo(x - bw, y, x - bw + w * 0.12, y); c.lineTo(x + bw - w * 0.12, y); c.quadraticCurveTo(x + bw, y, x + bw, y - w * 0.12); c.lineTo(x + bw, top); c.quadraticCurveTo(x + bw, top - h * 0.1, x + nw, top - h * 0.1); c.lineTo(x + nw, mouth); c.lineTo(x - nw, mouth); c.lineTo(x - nw, top - h * 0.1); c.quadraticCurveTo(x - bw, top - h * 0.1, x - bw, top); c.closePath(); };
  if (fill) { const ly = y - (y - top) * fill; c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - bw - 5, ly, w + 10, y - ly + 5); c.restore(); shape(c, () => ell(c, x, ly, bw * 0.95, w * 0.07), COL.drop, 0); }
  shape(c, body, "rgba(222,238,250,0.5)", 5);
  shine(c, [[x - bw * 0.6, top + h * 0.1], [x - bw * 0.6, y - h * 0.12]], 7);
  shape(c, () => rrect(c, x - nw - 5, mouth - h * 0.07, nw * 2 + 10, h * 0.07 + 4, 5), COL.blue, 5);
};
// a hand torch with its handle middle at (x, y), pointing along an; returns the lens point
const torch = (c: Ctx, x: number, y: number, len: number, an: number): Pt => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len * 0.45, -len * 0.1, len * 0.75, len * 0.2, len * 0.06), COL.teal, 5);
  shade(c, () => rrect(c, -len * 0.45, -len * 0.1, len * 0.75, len * 0.2, len * 0.06), COL.tealDk, 0, len * 0.08, 0.45);
  shape(c, () => polyP(c, [[len * 0.28, -len * 0.12], [len * 0.5, -len * 0.19], [len * 0.5, len * 0.19], [len * 0.28, len * 0.12]]), INK, 5);
  shape(c, () => ell(c, len * 0.5, 0, len * 0.04, len * 0.17), COL.yellow, 4);
  shape(c, () => rrect(c, -len * 0.2, -len * 0.14, len * 0.1, len * 0.06, 3), RED, 3);
  c.restore();
  return [x + Math.cos(an) * len * 0.5, y + Math.sin(an) * len * 0.5];
};
// a mixer grinder seen from behind, standing on a counter with its base centre at (x, y); returns the rating plate's box
const mixer = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 30, y + 6, 150, 22);
  const body = () => rrect(c, x - 120, y - 270, 240, 270, 26);
  shape(c, body, "#f3eadb"); shade(c, body, COL.grey, 40, 0, 0.3);
  shape(c, () => rrect(c, x - 60, y - 300, 120, 40, 8), COL.steelDk, 5);
  shape(c, () => rrect(c, x - 80, y - 490, 160, 195, 14), COL.steel, 5);
  shade(c, () => rrect(c, x - 80, y - 490, 160, 195, 14), COL.steelDk, 40, 0, 0.4);
  shape(c, () => rrect(c, x - 86, y - 505, 172, 30, 8), INK, 4);
  shape(c, () => { c.moveTo(x + 80, y - 460); c.quadraticCurveTo(x + 150, y - 460, x + 150, y - 390); c.quadraticCurveTo(x + 150, y - 330, x + 80, y - 330); c.lineTo(x + 80, y - 352); c.quadraticCurveTo(x + 126, y - 352, x + 126, y - 392); c.quadraticCurveTo(x + 126, y - 438, x + 80, y - 438); c.closePath(); }, INK, 4);
  const plate: [number, number, number, number] = [x - 75, y - 150, 150, 70];
  shape(c, () => rrect(c, ...plate, 6), COL.steelIn, 4);
  txtC(c, "750 W", x, y - 138, 34, INK, 4);
  line(c, [[x - 60, y - 97], [x + 60, y - 97]], 3, COL.greyDk);
  return plate;
};
// a wall tap fed from a pipe above: the spout mouth is at (x, y). open 0 = shut lever, 1 = a little, 2 = full
const tap = (c: Ctx, x: number, y: number, s: number, open: number) => {
  const px = x - 70 * s, py = y - 120 * s;
  const path = () => { c.moveTo(px, -20); c.lineTo(px, py); c.lineTo(x - 30 * s, py); c.quadraticCurveTo(x, py, x, py + 40 * s); c.lineTo(x, y); };
  c.beginPath(); path(); c.strokeStyle = INK; c.lineWidth = 42 * s; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  c.beginPath(); path(); c.strokeStyle = COL.steel; c.lineWidth = 30 * s; c.stroke();
  c.beginPath(); path(); c.strokeStyle = COL.steelDk; c.lineWidth = 10 * s; c.globalAlpha = 0.5; c.stroke(); c.globalAlpha = 1;
  shape(c, () => rrect(c, px - 40 * s, py - 30 * s, 80 * s, 60 * s, 12 * s), COL.steel, 5);
  shape(c, () => rrect(c, x - 16 * s, y - 24 * s, 32 * s, 28 * s, 6 * s), COL.steelDk, 4);
  const a = open === 0 ? -PI * 0.62 : open === 1 ? -PI * 0.45 : -PI * 0.18;
  line(c, [[px, py - 24 * s], [px + Math.cos(a) * 70 * s, py - 24 * s + Math.sin(a) * 70 * s]], 22 * s, INK);
  line(c, [[px, py - 24 * s], [px + Math.cos(a) * 70 * s, py - 24 * s + Math.sin(a) * 70 * s]], 12 * s, COL.steelIn);
};
// water falling straight down from (x, y1) to y2, w wide
const stream = (c: Ctx, x: number, y1: number, y2: number, w: number) => {
  shape(c, () => rrect(c, x - w / 2, y1, w, y2 - y1, w / 2), COL.water, 4);
  if (w > 14) shine(c, [[x - w * 0.2, y1 + 20], [x - w * 0.2, y2 - 30]], w * 0.2);
};
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.2, x + r, y + r * 0.1); c.arc(x, y + r * 0.1, r, 0, PI); c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.6); c.closePath(); }, COL.water, 4);
// a red plastic bucket, bottom centre (x, y), its water shown through the side; fill 0..1
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  const bw = w * 0.4, tw = w / 2, top = y - h;
  shadow(c, x + 20, y + 4, bw * 1.1, 16);
  const body = () => { c.moveTo(x - tw, top); c.lineTo(x + tw, top); c.lineTo(x + bw, y); c.lineTo(x - bw, y); c.closePath(); };
  shape(c, body, "#d9574a"); shade(c, body, "#a63a2e", w * 0.14, 0, 0.45);
  if (fill > 0) { const ly = y - h * fill, lw = bw + (tw - bw) * fill; c.save(); c.beginPath(); body(); c.clip(); c.globalAlpha = 0.85; c.fillStyle = COL.water; c.fillRect(x - tw, ly, w, y - ly); c.restore(); c.globalAlpha = 1; shape(c, () => ell(c, x, ly, lw, w * 0.06), COL.drop, 3); }
  shape(c, () => ell(c, x, top, tw, w * 0.08), "#e8756a", 5);
  // the handle lies over to the right side
  const hdl = () => { c.beginPath(); c.moveTo(x - tw * 0.9, top); c.quadraticCurveTo(x + tw * 0.7, top - tw * 1.1, x + tw * 0.9, top); };
  hdl(); c.strokeStyle = INK; c.lineWidth = 16; c.lineCap = "round"; c.stroke(); hdl(); c.strokeStyle = COL.steel; c.lineWidth = 7; c.stroke();
};
// an electric kettle on its base, bottom centre (x, y)
const kettle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 30, y + 4, w * 0.6, 16);
  shape(c, () => ell(c, x, y - 10, w * 0.5, w * 0.1), INK, 4);
  const body = () => { c.moveTo(x - w * 0.45, y - 24); c.lineTo(x + w * 0.45, y - 24); c.lineTo(x + w * 0.36, y - h * 0.8); c.quadraticCurveTo(x, y - h * 0.92, x - w * 0.36, y - h * 0.8); c.closePath(); };
  shape(c, () => { c.moveTo(x - w * 0.34, y - h * 0.75); c.lineTo(x - w * 0.62, y - h * 0.95); c.lineTo(x - w * 0.5, y - h * 0.98); c.lineTo(x - w * 0.28, y - h * 0.82); c.closePath(); }, COL.steel, 5);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.14, 0, 0.5);
  shape(c, () => rrect(c, x - w * 0.1, y - h * 0.62, w * 0.14, h * 0.35, 6), COL.sky, 4);
  shape(c, () => { c.moveTo(x + w * 0.3, y - h * 0.72); c.quadraticCurveTo(x + w * 0.72, y - h * 0.72, x + w * 0.72, y - h * 0.4); c.quadraticCurveTo(x + w * 0.72, y - h * 0.2, x + w * 0.42, y - h * 0.2); c.lineTo(x + w * 0.42, y - h * 0.3); c.quadraticCurveTo(x + w * 0.6, y - h * 0.3, x + w * 0.6, y - h * 0.42); c.quadraticCurveTo(x + w * 0.6, y - h * 0.62, x + w * 0.3, y - h * 0.62); c.closePath(); }, INK, 4);
  shape(c, () => rrect(c, x - w * 0.3, y - h * 0.96, w * 0.6, h * 0.1, 8), INK, 4);
  shape(c, () => ell(c, x, y - h * 0.97, w * 0.08, w * 0.05), COL.steel, 4);
  for (const dx of [-0.58, -0.5]) { const sx = x + w * dx, sy = y - h * 1.02; c.strokeStyle = COL.steelDk; c.lineWidth = 5; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx - 14, sy - 30, sx, sy - 56); c.quadraticCurveTo(sx + 14, sy - 80, sx, sy - 105); c.stroke(); c.globalAlpha = 1; }
};
// a clock face at (x, y): the time passed is a shaded wedge from 12 o'clock, frac of the whole face
const clock = (c: Ctx, x: number, y: number, r: number, frac: number) => {
  shadow(c, x + 10, y + r + 6, r * 0.8, 10);
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  shape(c, () => { c.moveTo(x, y); c.arc(x, y, r * 0.86, -PI / 2, -PI / 2 + 2 * PI * frac); c.closePath(); }, COL.sky, 0);
  for (let k = 0; k < 12; k++) { const a = (k * PI) / 6; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], k % 3 ? 3 : 6); }
  const a = -PI / 2 + 2 * PI * frac;
  line(c, [[x, y], [x, y - r * 0.45]], 8); line(c, [[x, y], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 6, RED);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
// a wall switch: a plate with a rocker, down = off, up = on (red dot showing)
const wallSwitch = (c: Ctx, x: number, y: number, on: boolean) => {
  shape(c, () => rrect(c, x - 34, y - 48, 68, 96, 8), WHITE, 5);
  shape(c, () => rrect(c, x - 18, y - 30, 36, 60, 5), COL.steelIn, 4);
  shape(c, () => rrect(c, x - 18, on ? y - 30 : y, 36, 30, 5), on ? COL.cloth : COL.steel, 4);
  if (on) shape(c, () => ell(c, x, y - 18, 5, 5), RED, 0);
};
// a wall socket at (x, y) with a plug in it; the wire goes out of the plug's top
const socketPlug = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 60, y - 60, 120, 120, 12), WHITE, 5);
  shape(c, () => ell(c, x, y + 28, 9, 9), INK, 0);
  shape(c, () => rrect(c, x - 44, y - 36, 88, 70, 10), INK, 5);
  shade(c, () => rrect(c, x - 44, y - 36, 88, 70, 10), "#000000", 10, 0, 0.3);
  shape(c, () => rrect(c, x - 12, y - 60, 24, 30, 5), INK, 0);
};
// a small notebook with a spiral along the top, top-left (x, y)
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 6, w * 0.5, 12);
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 5);
  for (let k = 1; k < 5; k++) line(c, [[x + 16, y + (h * k) / 5], [x + w - 16, y + (h * k) / 5]], 3, COL.sky);
  const n = Math.max(4, Math.round(w / 40));
  for (let k = 0; k < n; k++) { const sx = x + w * ((k + 0.5) / n); line(c, [[sx, y - 14], [sx, y + 14]], 6, INK); line(c, [[sx, y - 14], [sx, y + 14]], 3, COL.steelDk); }
};
// a cardboard-sized calculator, top-left (x, y)
const calculator = (c: Ctx, x: number, y: number, w: number, h: number, t: string) => {
  shadow(c, x + w / 2 + 14, y + h + 6, w * 0.5, 14);
  shape(c, () => rrect(c, x, y, w, h, 14), "#5a5566", 5);
  shape(c, () => rrect(c, x + w * 0.1, y + h * 0.07, w * 0.8, h * 0.17, 6), LCD, 4);
  txt(c, t, x + w * 0.8 - txtW(t, h * 0.1), y + h * 0.1, h * 0.1, INK, 4);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) shape(c, () => rrect(c, x + w * (0.1 + k * 0.21), y + h * (0.32 + r * 0.165), w * 0.16, h * 0.12, 6), k === 3 ? COL.orange : WHITE, 4);
};
// a blink tally: n red dots in a row from (x, y)
const blinks = (c: Ctx, x: number, y: number, n: number) => { for (let k = 0; k < n; k++) shape(c, () => ell(c, x + k * 40, y, 12, 12), RED, 4); };
// little pictures for table headers and bar labels
const miniStairs = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x, y], [x, y - s], [x + s, y - s], [x + s, y - 2 * s], [x + 2 * s, y - 2 * s], [x + 2 * s, y - 3 * s], [x + 3 * s, y - 3 * s], [x + 3 * s, y]]), STONE, 4);
const miniFan = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.steelIn, 4); for (let k = 0; k < 3; k++) { const a = -PI / 2 + (k * 2 * PI) / 3; shape(c, () => ell(c, x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.42, r * 0.2, a), COL.teal, 3); } shape(c, () => ell(c, x, y, r * 0.16, r * 0.16), INK, 0); };
const miniKettle = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => polyP(c, [[x - s * 0.5, y], [x + s * 0.5, y], [x + s * 0.4, y - s], [x - s * 0.4, y - s]]), COL.steel, 4); shape(c, () => polyP(c, [[x - s * 0.4, y - s * 0.75], [x - s * 0.7, y - s * 1.05], [x - s * 0.34, y - s * 0.9]]), COL.steel, 3); c.beginPath(); c.arc(x + s * 0.55, y - s * 0.55, s * 0.25, -PI / 2, PI / 2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); };

// ================================================================ set-up cards: Stair Power
// 1. the child sits at the foot of the stairs holding a ruler's bottom against the first step; the grown-up stands
// behind and holds the top end; a red mark shows the step's height
const e1s0 = (c: Ctx) => {
  ground(c); floor(c, 900);
  stairs(c, 640, 900, 4, 150, 150, -1);
  const ad = person(c, 800, 900, 560, { adult: true, reachL: [676, 640] });
  const ch = person(c, 830, 900, 440, { sit: true, dir: -1, reachL: [678, 840] });
  rulerV(c, 668, 900, 280, 9.3, 10);
  grip(c, ad.handL, 560, true); grip(c, ch.handL, 440);
  line(c, [[600, 750], [700, 750]], 6, RED);
  txt(c, "16 cm", 470, 700, 36, RED, 6);
};
// 2. the child stands on a bathroom scale that shows the mass
const e1s1 = (c: Ctx) => {
  ground(c); floor(c, 760);
  bathScale(c, 540, 820, 600, "28 kg");
  person(c, 540, 820, 470, {});
};
// 3. the child climbs the stairs holding the rail, the grown-up waits at the top with the phone stopwatch
const e1s2 = (c: Ctx) => {
  ground(c); floor(c, 915);
  stairs(c, 150, 915, 5, 140, 80);
  rail(c, [110, 648], [890, 202], [[220, 835], [360, 755], [500, 675], [640, 595], [780, 515], [890, 515]]);
  person(c, 360, 755, 380, { reachL: [255, 565] });
  arrow(c, [[470, 650], [585, 585]], RED, 9);
  const ad = person(c, 950, 515, 460, { adult: true, reachL: [850, 250] });
  const r = -0.15, [hx, hy] = ad.handL;
  phone(c, hx + Math.sin(r) * 48, hy - Math.cos(r) * 48, 78, 150, r, "12 s");
  grip(c, ad.handL, 460, true);
};
// 4. the results table: steps, seconds, joules, watts; two climbs filled in, one row empty
const e1s3 = (c: Ctx) => {
  ground(c);
  paper(c, 140, 170, 780, 640, -0.025);
  grid(c, 40, 40, 700, 560, [0.25, 0.5, 0.75], [0.25, 0.5, 0.75]);
  miniStairs(c, 85, 150, 32); clock(c, 302, 110, 44, 0.3); txtC(c, "J", 477, 70, 80, INK, 8); txtC(c, "W", 655, 70, 80, INK, 8);
  const rows = [["14", "6", "650", "108"], ["14", "9", "650", "72"]];
  rows.forEach((row, r) => row.forEach((v, k) => txtC(c, v, 40 + 700 * (0.125 + k * 0.25), 40 + 560 * (0.3 + r * 0.25), 60, INK, 6)));
  c.restore();
  pencil(c, 760, 900, 300, -0.3);
};
// 5. bars for three climbs beside a 9 W bulb and a 60 W fan
const e1s4 = (c: Ctx) => {
  ground(c);
  paper(c, 120, 140, 840, 740, 0.015); c.restore();
  const base = 800, px = 430 / 108;
  line(c, [[170, base], [910, base]], 6);
  const bars: [number, number, string, string][] = [[250, 108, CLOTH.child, "108"], [390, 72, CLOTH.child, "72"], [530, 55, CLOTH.child, "55"], [700, 9, COL.yellow, "9 W"], [860, 60, COL.teal, "60 W"]];
  bars.forEach(([x, v, col, t]) => { const h = v * px; shape(c, () => rrect(c, x - 45, base - h, 90, h, 6), col, 5); txtC(c, t, x, base - h - 56, 36, INK, 5); });
  ["1", "2", "3"].forEach((t, k) => txtC(c, t, 250 + k * 140, base + 20, 40, INK, 5));
  bulb(c, 700, 580, 34, true);
  miniFan(c, 860, 425, 48);
};

// ================================================================ set-up cards: Meter Blink
// 1. the meter on the wall, its red light and the imp/kWh number
const e2s0 = (c: Ctx) => { ground(c); meter(c, 290, 150, 500, 740, 1, true); };
// 2. the child counts blinks with the phone stopwatch, the grown-up writes them in a notebook
const e2s1 = (c: Ctx) => {
  ground(c); floor(c, 950);
  meter(c, 400, 100, 300, 340, 1);
  const ad = person(c, 800, 950, 560, { adult: true, reachL: [680, 620], reachR: [790, 600] });
  notebook(c, 680, 560, 150, 200);
  pencil(c, ad.handR[0], ad.handR[1], 150, 2.3);
  grip(c, ad.handL, 560, true); grip(c, ad.handR, 560, true);
  const ch = person(c, 290, 950, 440, { reachR: [420, 610] });
  phone(c, ch.handR[0] + 2, ch.handR[1] - 48, 78, 150, 0.05, "120");
  grip(c, ch.handR, 440);
};
// 3. two pictures: fan off, a slow light; fan on, the light blinks faster
const e2s2 = (c: Ctx) => {
  ground(c); ceiling(c, 60);
  line(c, [[540, 60], [540, D]], 6);
  fan(c, 270, 330, 150, 60, false); wallSwitch(c, 470, 500, false);
  meter(c, 150, 640, 240, 300, 0.2); blinks(c, 150, 600, 3);
  fan(c, 810, 330, 150, 60, true); wallSwitch(c, 1010, 500, true);
  meter(c, 690, 640, 240, 300, 1); blinks(c, 690, 600, 9);
  arrow(c, [[500, 400], [580, 400]], RED, 10);
};
// 4. the notebook table: appliance, blinks, watts; the kettle's rating plate beside it
const e2s3 = (c: Ctx) => {
  ground(c);
  notebook(c, 110, 190, 560, 700);
  grid(c, 150, 240, 480, 600, [0.3, 0.62], [0.2, 0.47, 0.73]);
  shape(c, () => ell(c, 150 + 480 * 0.46, 300, 20, 20), RED, 4); txtC(c, "W", 150 + 480 * 0.81, 265, 64, INK, 7);
  miniFan(c, 222, 440, 40); txtC(c, "6", 150 + 480 * 0.46, 412, 54); txtC(c, "56", 150 + 480 * 0.81, 412, 54);
  bulb(c, 222, 590, 24, false); txtC(c, "1", 150 + 480 * 0.46, 568, 54); txtC(c, "9", 150 + 480 * 0.81, 568, 54);
  miniKettle(c, 222, 790, 70); txtC(c, "160", 150 + 480 * 0.46, 724, 54); txtC(c, "1500", 150 + 480 * 0.81, 724, 50);
  shadow(c, 870, 586, 140, 14);
  shape(c, () => rrect(c, 720, 470, 290, 110, 10), COL.steelIn, 5);
  txtC(c, "1500 W", 865, 492, 44, INK, 5); line(c, [[760, 556], [970, 556]], 3, COL.greyDk);
  line(c, [[640, 790], [700, 700], [720, 560]], 4, COL.greyDk);
};

// ================================================================ flow cards
// Stair Power: the child climbs against a stopwatch; how many watts?
const flowE1 = (c: Ctx) => {
  ground(c); floor(c, 915);
  stairs(c, 80, 915, 5, 140, 80);
  rail(c, [50, 637], [780, 220], [[150, 835], [290, 755], [430, 675], [570, 595], [710, 515], [780, 515]]);
  person(c, 430, 675, 380, { reachL: [325, 480] });
  arrow(c, [[540, 570], [650, 505]], RED, 9);
  shape(c, () => rrect(c, 896, 130, 28, 40, 6), INK, 4); shape(c, () => ell(c, 910, 285, 132, 132), WHITE, 0);
  clock(c, 910, 285, 118, 0.1);
  txtC(c, "? W", 910, 430, 44, INK, 6);
};
// Meter Blink: a fan turns and the meter's light blinks
const flowE2 = (c: Ctx) => {
  ground(c); ceiling(c, 70);
  fan(c, 540, 260, 190, 70, true);
  meter(c, 330, 470, 420, 440, 1);
};
// A Ladder of Lifts: lifting a bottle onto an 80 cm table
const flowA1 = (c: Ctx) => {
  ground(c); floor(c, 950);
  table(c, 560, 940, 640, 950);
  rulerV(c, 985, 950, 310, 3.875, 20, 44);
  txt(c, "80 cm", 880, 590, 30, RED, 5);
  const ch = person(c, 300, 950, 460, { reachR: [440, 560] });
  bottle(c, 440, 680, 90, 240);
  grip(c, ch.handR, 460);
  arrow(c, [[500, 500], [580, 440], [660, 560]], RED, 10);
};
// Rating Plate Hunt: a torch on the plate at the back of the mixer grinder
const flowA2 = (c: Ctx) => {
  ground(c); floor(c, 950);
  shape(c, () => polyP(c, [[520, 790], [1120, 790], [1120, 960], [520, 960]]), COL.woodDk, 5); shape(c, () => rrect(c, 500, 760, 620, 34, 6), COL.wood, 5);
  const plate = mixer(c, 800, 760);
  const ch = person(c, 260, 950, 460, { reachR: [420, 600] });
  const an = Math.atan2(plate[1] + plate[3] / 2 - 600, plate[0] - 420), lens: Pt = [420 + Math.cos(an) * 90, 600 + Math.sin(an) * 90];
  c.fillStyle = "rgba(255,221,120,0.5)"; c.beginPath(); polyP(c, [[lens[0], lens[1] - 14], [plate[0] + 6, plate[1] - 6], [plate[0] + 6, plate[1] + plate[3] + 6], [lens[0], lens[1] + 14]]); c.fill();
  torch(c, 420, 600, 180, an);
  grip(c, ch.handR, 460);
};
// Litres a Minute: a trickle fills a bottle while the child times it
const flowA3 = (c: Ctx) => {
  ground(c); floor(c, 950);
  shape(c, () => rrect(c, 180, 900, 440, 50, 6), COL.steel, 5);
  tap(c, 400, 330, 1.2, 1);
  stream(c, 400, 326, 640, 10);
  bottle(c, 400, 900, 100, 290, 0.4);
  const ch = person(c, 760, 950, 460, { reachL: [640, 600] });
  phone(c, ch.handL[0] - 4, ch.handL[1] - 48, 78, 150, -0.08, "45 s");
  grip(c, ch.handL, 460);
};
// Feel the Warmth: the back of a hand near a lit bulb
const flowA4 = (c: Ctx) => {
  ground(c); floor(c, 950);
  table(c, 480, 1080, 800, 950);
  const [bx, by] = lamp(c, 760, 800, 70, true);
  for (const dy of [-50, 0, 50]) { c.strokeStyle = WARM; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(bx - 95, by + dy); c.quadraticCurveTo(bx - 110, by + dy - 14, bx - 125, by + dy); c.quadraticCurveTo(bx - 140, by + dy + 14, bx - 155, by + dy); c.stroke(); }
  line(c, [[-10, 560], [320, 528]], 92, INK); line(c, [[-10, 560], [320, 528]], 78, CLOTH.child);
  hand(c, 420, 525, 0, 1.6, SKIN.child, CLOTH.child, true);
};
// The Bill Detective: the bill, with the units circled, a calculator and a pencil
const flowP1 = (c: Ctx) => {
  ground(c);
  paper(c, 140, 130, 560, 720, -0.02);
  shape(c, () => rrect(c, 0, 0, 560, 90, 8), COL.teal, 5);
  for (let k = 0; k < 6; k++) line(c, [[40, 140 + k * 46], [k % 2 ? 380 : 480, 140 + k * 46]], 6, COL.grey);
  grid(c, 40, 440, 480, 120, [0.5], []);
  txtC(c, "186", 160, 470, 60); txtC(c, "31", 400, 470, 60);
  c.strokeStyle = RED; c.lineWidth = 8; c.beginPath(); ell(c, 160, 500, 110, 70); c.stroke();
  for (let k = 0; k < 3; k++) line(c, [[40, 620 + k * 46], [k % 2 ? 300 : 440, 620 + k * 46]], 6, COL.grey);
  c.restore();
  calculator(c, 740, 400, 230, 360, "6");
  pencil(c, 850, 900, 300, -0.35);
};

// ================================================================ idea cards
// Energy: a ceiling fan turning, its wire down to a wall socket
const termEnergy = (c: Ctx) => {
  ground(c); ceiling(c, 90);
  line(c, [[560, 90], [930, 90], [930, 640]], 12, INK); line(c, [[560, 90], [930, 90], [930, 640]], 5, COL.greyDk);
  fan(c, 540, 380, 250, 90, true);
  socketPlug(c, 930, 700);
};
// Power: a kettle moves energy fast (a thick arrow), a fan slowly (a thin one)
const termPower = (c: Ctx) => {
  ground(c); floor(c, 880);
  kettle(c, 300, 870, 260, 330);
  tableFan(c, 780, 870, 130);
  arrow(c, [[300, 470], [300, 250]], RED, 26);
  arrow(c, [[780, 480], [780, 250]], RED, 7);
  txtC(c, "1500 W", 300, 140, 56, INK, 7);
  txtC(c, "60 W", 780, 140, 56, INK, 7);
};
// Amount and rate: the same bucket under a dripping tap and under a gushing one, with the time each takes
const explRate = (c: Ctx) => {
  ground(c); floor(c, 930);
  tap(c, 230, 260, 1.1, 1); tap(c, 770, 260, 1.1, 2);
  bucket(c, 230, 920, 270, 320, 0.3); bucket(c, 770, 920, 270, 320, 0.95);
  for (const y of [330, 415, 500]) drop(c, 230, y, 12);
  stream(c, 770, 256, 612, 36);
  for (const [dx, dy] of [[-70, -45], [70, -40], [-45, -80]]) drop(c, 770 + dx, 600 + dy, 7);
  clock(c, 440, 440, 80, 0.85); clock(c, 980, 440, 80, 0.1);
};

export const ic_energyEnergyAroundUsL4 = cards("sci.energy.energy-around-us.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, termEnergy, termPower, explRate,
]);
