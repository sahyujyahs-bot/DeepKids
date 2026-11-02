import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, write, glass, cards } from "./flatKit";

// sci.energy.heat.L3 · picture cards (intro, cover, flows, terms, explanations).
// Same child, grown-up, steel tumbler, thermometer and katori as the set-up cards. Hot is orange and steams,
// cold is blue and sweats; heat is a red arrow.

const HOT = "#f4b183", COLD = "#8fc3ea", MILDW = "#b9d9ee", ICE = "#d9f0fb", ICE_DK = "#9fd0ea";
const table = (c: Ctx, y: number) => { c.fillStyle = "#ead5a6"; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const curve = (c: Ctx, pts: number[][], w: number, col: string, outline = 8) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  if (outline) { path(); c.strokeStyle = INK; c.lineWidth = w + outline; c.stroke(); }
  path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
const steam = (c: Ctx, x: number, y: number, h: number, n = 3) => {
  for (let i = 0; i < n; i++) {
    const xx = x + (i - (n - 1) / 2) * h * 0.28, s = i % 2 ? 1 : -1, hh = h * (i === 1 ? 1 : 0.8);
    curve(c, [[xx, y], [xx + s * h * 0.1, y - hh * 0.25], [xx - s * h * 0.1, y - hh * 0.5], [xx + s * h * 0.1, y - hh * 0.75], [xx, y - hh]], h * 0.07, WHITE, 6);
  }
};
const dropP = (c: Ctx, x: number, y: number, r: number) => { c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 1.15, y - r * 0.2, x, y + r * 0.85); c.quadraticCurveTo(x - r * 1.15, y - r * 0.2, x, y - r * 1.7); c.closePath(); };
type Tum = { water?: string; steam?: boolean; drops?: boolean; steamH?: number };
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, o: Tum = {}) => {
  const t = w / 2, b = w * 0.4, ry = w * 0.11, top = y - h;
  shadow(c, x + w * 0.14, y + 8, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - t, top); c.lineTo(x + t, top); c.lineTo(x + b, y - w * 0.03); c.quadraticCurveTo(x, y + w * 0.15, x - b, y - w * 0.03); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -t * 0.5, 0, 0.6);
  shine(c, [[x - t * 0.72, top + h * 0.12], [x - b * 0.72, y - h * 0.16]], 8);
  line(c, [[x - t * 0.93, top + h * 0.3], [x, top + h * 0.3 + ry * 1.1], [x + t * 0.93, top + h * 0.3]], 3.5, COL.steelDk);
  if (o.drops) {
    const pos = [[-0.55, 0.45], [-0.15, 0.62], [0.35, 0.5], [0.6, 0.72], [-0.4, 0.82], [0.1, 0.86], [0.55, 0.32], [-0.62, 0.65]];
    pos.forEach(([u, v], i) => { const dx = x + u * (b + (t - b) * (1 - v)) * 1.15, dy = top + h * v, r = w * (i % 3 ? 0.035 : 0.048); shape(c, () => dropP(c, dx, dy, r), COL.drop, 2.5); });
  }
  shape(c, () => ell(c, x, top, t, ry), "#e6ebf1", 5);
  shape(c, () => ell(c, x, top + 2, t * 0.84, ry * 0.76), o.water ?? "#4b4658", 3);
  if (o.steam) steam(c, x, top - ry, o.steamH ?? h * 0.55);
};
// a lab thermometer, bulb at (x, yb), red line up to frac of the length
const thermo = (c: Ctx, x: number, yb: number, len: number, frac: number, tilt = 0, tw = 26) => {
  c.save(); c.translate(x, yb); c.rotate(tilt);
  shape(c, () => rrect(c, -tw / 2, -len, tw, len - 6, tw / 2), "#f4f9ff", 5);
  for (let i = 1; i <= 10; i++) { const ty = -len * (0.1 + 0.085 * i); line(c, [[tw / 2, ty], [tw / 2 + (i % 5 ? tw * 0.4 : tw * 0.75), ty]], 3); }
  shape(c, () => ell(c, 0, -2, tw * 0.9, tw * 0.9), RED, 5);
  c.beginPath(); rrect(c, -tw * 0.17, -len * frac, tw * 0.34, len * frac - 4, tw * 0.17); c.fillStyle = RED; c.fill();
  line(c, [[-tw * 0.32, -len * 0.92], [-tw * 0.32, -len * 0.35]], 4, WHITE);
  c.restore();
};
const forearm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -1500, -34, 1450, 68, 12), sleeve, 6);
  c.restore();
};
const above = (c: Ctx, y: number, fn: () => void) => { c.save(); c.beginPath(); c.rect(0, 0, D, y); c.clip(); fn(); c.restore(); };
// a child's hand reaching down into water: it vanishes at the rim line y
const handDown = (c: Ctx, x: number, rimY: number, s: number, adult = false) => {
  const wy = rimY - 62 * s, sk = adult ? SKIN.adult : SKIN.child, sl = adult ? CLOTH.adult : CLOTH.child;
  above(c, rimY, () => { forearm(c, x, wy, Math.PI / 2, s, sl); hand(c, x, wy, Math.PI / 2, s, sk, sl, true); });
};
const ice = (c: Ctx, x: number, y: number, s: number, melt = 1) => {
  const p = () => polyP(c, [[x - s, y - s * 0.6 * melt], [x + s * 0.2, y - s * melt], [x + s, y - s * 0.55 * melt], [x + s * 0.9, y + s * 0.5 * melt], [x - s * 0.1, y + s * 0.7 * melt], [x - s * 0.95, y + s * 0.4 * melt]]);
  shape(c, p, ICE); shade(c, p, ICE_DK, s * 0.3, s * 0.2, 0.8);
  shine(c, [[x - s * 0.7, y - s * 0.3 * melt], [x - s * 0.2, y - s * 0.7 * melt]], s * 0.12);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], r * 0.16, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const flame = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - s * 0.9, y - s * 0.3, x - s * 0.5, y - s * 1.0, x, y - s * 1.5); c.bezierCurveTo(x + s * 0.5, y - s * 1.0, x + s * 0.9, y - s * 0.3, x, y); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(x, y - 4); c.bezierCurveTo(x - s * 0.4, y - s * 0.3, x - s * 0.2, y - s * 0.6, x, y - s * 0.85); c.bezierCurveTo(x + s * 0.2, y - s * 0.6, x + s * 0.4, y - s * 0.3, x, y - 4); c.closePath(); }, COL.yellow, 0);
};
const ball = (c: Ctx, x: number, y: number, r: number, col: string, shake = 0) => {
  if (shake > 0) for (const s of [-1, 1]) { line(c, [[x + s * (r + 8), y - r * 0.5], [x + s * (r + 8 + shake * 14), y - r * 0.2]], 5); line(c, [[x + s * (r + 8), y + r * 0.5], [x + s * (r + 8 + shake * 14), y + r * 0.2]], 5); }
  shape(c, () => ell(c, x, y, r, r), col, 5);
  shade(c, () => ell(c, x, y, r, r), "rgba(43,35,64,0.5)", r * 0.3, r * 0.3, 0.35);
};
const fridge = (c: Ctx, x: number, yb: number, w: number, h: number, open = false) => {
  shadow(c, x + w * 0.1, yb + 6, w * 0.6, w * 0.07);
  shape(c, () => rrect(c, x - w / 2, yb - h, w, h, w * 0.06), "#eef3f8", 6);
  if (open) {
    shape(c, () => rrect(c, x - w / 2 + 14, yb - h + 14, w - 28, h - 28, 8), "#cfe6f5", 4);
    for (const f of [0.35, 0.68]) line(c, [[x - w / 2 + 14, yb - h * f], [x + w / 2 - 14, yb - h * f]], 6, COL.steelDk);
    shape(c, () => polyP(c, [[x - w / 2, yb - h], [x - w / 2 - w * 0.34, yb - h - h * 0.04], [x - w / 2 - w * 0.34, yb - h * 0.04], [x - w / 2, yb]]), "#dde6ee", 6);
  } else {
    line(c, [[x - w / 2, yb - h * 0.62], [x + w / 2, yb - h * 0.62]], 5);
    line(c, [[x + w * 0.3, yb - h * 0.92], [x + w * 0.3, yb - h * 0.7]], w * 0.05, COL.steelDk);
    line(c, [[x + w * 0.3, yb - h * 0.55], [x + w * 0.3, yb - h * 0.3]], w * 0.05, COL.steelDk);
  }
};
const houseIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.8, y - s * 0.7, s * 1.6, s * 1.4, 6), "#f8e3b8", 5);
  shape(c, () => polyP(c, [[x - s * 1.0, y - s * 0.65], [x, y - s * 1.4], [x + s * 1.0, y - s * 0.65]]), COL.red, 5);
  shape(c, () => rrect(c, x - s * 0.2, y, s * 0.4, s * 0.7, 4), COL.brown, 4);
};
const headIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, s, s * 1.05), SKIN.child, 5);
  shape(c, () => { c.moveTo(x - s * 1.02, y); c.bezierCurveTo(x - s, y - s * 1.5, x + s, y - s * 1.5, x + s * 1.02, y); c.quadraticCurveTo(x, y - s * 0.55, x - s * 1.02, y); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, x - s * 0.35, y + s * 0.12, s * 0.09, s * 0.12), INK, 0); shape(c, () => ell(c, x + s * 0.35, y + s * 0.12, s * 0.09, s * 0.12), INK, 0);
  c.beginPath(); c.arc(x, y + s * 0.38, s * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const cupIcon = (c: Ctx, x: number, y: number, s: number) => {
  c.beginPath(); c.arc(x + s * 0.9, y - s * 0.4, s * 0.38, -Math.PI * 0.5, Math.PI * 0.5); c.strokeStyle = INK; c.lineWidth = s * 0.22; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(x + s * 0.9, y - s * 0.4, s * 0.38, -Math.PI * 0.5, Math.PI * 0.5); c.strokeStyle = COL.paper; c.lineWidth = s * 0.1; c.stroke();
  shape(c, () => { c.moveTo(x - s, y - s * 0.9); c.lineTo(x + s, y - s * 0.9); c.quadraticCurveTo(x + s * 0.9, y, x, y); c.quadraticCurveTo(x - s * 0.9, y, x - s, y - s * 0.9); c.closePath(); }, COL.paper, 5);
  shape(c, () => ell(c, x, y - s * 0.9, s, s * 0.2), "#c98a4b", 5);
  steam(c, x, y - s * 1.1, s * 1.0, 2);
};
const potIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s, y - s * 0.8, s * 2, s * 0.9, 12), COL.steel, 5);
  shape(c, () => rrect(c, x - s * 1.1, y - s * 0.95, s * 2.2, s * 0.25, 10), COL.steelDk, 5);
  shape(c, () => rrect(c, x - s * 1.5, y - s * 0.6, s * 0.5, s * 0.2, 6), INK, 0);
  shape(c, () => rrect(c, x + s * 1.0, y - s * 0.6, s * 0.5, s * 0.2, 6), INK, 0);
  steam(c, x, y - s * 1.0, s * 1.1, 3);
};
const freezerIcon = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 0.8, y - s * 0.9, s * 1.6, s * 1.8, 10), "#cfe6f5", 5);
  line(c, [[x - s * 0.8, y - s * 0.1], [x + s * 0.8, y - s * 0.1]], 5);
  line(c, [[x + s * 0.5, y - s * 0.7], [x + s * 0.5, y - s * 0.3]], 7, COL.steelDk); line(c, [[x + s * 0.5, y + s * 0.2], [x + s * 0.5, y + s * 0.6]], 7, COL.steelDk);
  ice(c, x - s * 0.2, y - s * 0.5, s * 0.22);
};
const fridgeIcon = (c: Ctx, x: number, y: number, s: number) => fridge(c, x, y + s, s * 1.6, s * 2);
// a white tag with a number
const tag = (c: Ctx, x: number, y: number, w: number, h: number, t: string, col = INK) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.25), WHITE, 6);
  write(c, t, x - (t.replace(/[^0-9]/g, "").length * 0.8 * h * 0.55 + (t.includes("-") ? 0.8 * h * 0.55 : 0)) / 2 + 2, y - h * 0.3, h * 0.55, col, Math.max(6, h * 0.1));
};
// a lab thermometer for reading: ticks every 10 from minus 10 to 110; returns the y of a value
const labY = (yb: number, len: number, v: number) => yb - len * (0.14 + 0.8 * (v + 10) / 120);
const labThermo = (c: Ctx, x: number, yb: number, len: number, frac: number, tw: number) => {
  shape(c, () => rrect(c, -tw / 2 + x, yb - len, tw, len - 6, tw / 2), "#f4f9ff", 6);
  for (let v = -10; v <= 110; v += 10) { const y = labY(yb, len, v), big = v % 50 === 0; line(c, [[x + tw / 2, y], [x + tw / 2 + tw * (big ? 0.9 : 0.45), y]], big ? 5 : 3); }
  shape(c, () => ell(c, x, yb - 2, tw * 0.95, tw * 0.95), RED, 6);
  c.beginPath(); rrect(c, x - tw * 0.17, yb - len * frac, tw * 0.34, len * frac - 4, tw * 0.17); c.fillStyle = RED; c.fill();
  line(c, [[x - tw * 0.32, yb - len * 0.92], [x - tw * 0.32, yb - len * 0.4]], 4, WHITE);
};
// digital fever thermometer lying along x (local), tip at the left, showing a reading
const digital = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shadow(c, 20, 80, 340, 18);
  shape(c, () => polyP(c, [[-150, -16], [-20, -30], [-20, 30], [-150, 16]]), COL.steel, 5);
  shape(c, () => rrect(c, -30, -52, 700, 104, 52), WHITE, 6);
  shade(c, () => rrect(c, -30, -52, 700, 104, 52), "#c9d1dc", 0, 26, 0.7);
  shape(c, () => rrect(c, 70, -34, 280, 68, 10), "#22303a", 4);
  write(c, "37", 102, -26, 52, "#c9f06b", 8);
  shape(c, () => ell(c, 200, 22, 5, 5), "#c9f06b", 0); write(c, "0", 218, -26, 52, "#c9f06b", 8);
  shape(c, () => ell(c, 470, 0, 28, 28), COL.teal, 5);
  c.restore();
};
const bottle = (c: Ctx, x: number, yb: number, level: number, mark = false) => {
  // glass bottle, coloured water, a straw through a ball of dough in the cap; level 0..1 of the straw
  const bw = 170, bh = 210;
  shape(c, () => rrect(c, x - bw / 2, yb - bh, bw, bh, 26), COL.glass, 6);
  shape(c, () => rrect(c, x - bw / 2 + 6, yb - bh * 0.78, bw - 12, bh * 0.78 - 6, 20), COL.purple, 0);
  shape(c, () => rrect(c, x - 36, yb - bh - 40, 72, 50, 8), COL.glass, 6);
  const sh = 300, st = yb - bh - 40 - sh;
  shape(c, () => rrect(c, x - 11, st, 22, sh + 150, 10), "rgba(255,255,255,0.7)", 4);
  const ly = yb - bh - 40 - sh * level;
  c.beginPath(); c.rect(x - 7, ly, 14, yb - bh * 0.78 - ly); c.fillStyle = COL.purple; c.fill();
  shape(c, () => ell(c, x, yb - bh - 40, 40, 26), COL.brown, 5);
  shine(c, [[x - bw * 0.32, yb - bh * 0.85], [x - bw * 0.32, yb - bh * 0.25]], 8);
  if (mark) line(c, [[x + 26, ly], [x + 90, ly]], 6, INK);
};

// ---------------------------------------------------------------- intro
const intro = (c: Ctx) => {
  ground(c); table(c, 660);
  bowl(c, 190, 760, 150, HOT); steam(c, 190, 735, 190);
  bowl(c, 540, 760, 150, MILDW);
  bowl(c, 890, 760, 150, "#7fb4e0"); ice(c, 850, 764, 40); ice(c, 930, 760, 36); ice(c, 890, 785, 30);
  forearm(c, 450, 330, Math.PI / 2, 2.1, CLOTH.child); hand(c, 450, 330, Math.PI / 2, 2.1, SKIN.child, CLOTH.child, true);
  forearm(c, 630, 330, Math.PI / 2, 2.1, CLOTH.child); hand(c, 630, 330, Math.PI / 2, 2.1, SKIN.child, CLOTH.child, true);
  arrow(c, [[540, 520], [540, 610]], RED, 12);
};

// ---------------------------------------------------------------- summary: before and after
const summary = (c: Ctx) => {
  ground(c);
  table(c, 440); table(c, 440);
  // before
  tumbler(c, 280, 420, 200, 230, { water: HOT, steam: true, steamH: 100 }); thermo(c, 340, 290, 240, 0.8, 0, 22);
  tumbler(c, 800, 420, 200, 230, { water: COLD, drops: true }); thermo(c, 860, 290, 240, 0.2, 0, 22);
  arrow(c, [[400, 300], [540, 250], [680, 300]], RED, 12);
  // after: both the same
  c.fillStyle = "#ead5a6"; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 5);
  arrow(c, [[540, 470], [540, 570]], INK, 12);
  tumbler(c, 280, 1000, 200, 230, { water: "#a9c9d8" }); thermo(c, 340, 870, 240, 0.5, 0, 22);
  tumbler(c, 800, 1000, 200, 230, { water: "#a9c9d8" }); thermo(c, 860, 870, 240, 0.5, 0, 22);
};

// ---------------------------------------------------------------- flows
// the meeting graph: a falling red line and a rising blue line that run flat together
const meetGraph = (c: Ctx, x0: number, y0: number, w: number, h: number) => {
  arrow(c, [[x0, y0 + h], [x0, y0 - 10]], INK, 8); arrow(c, [[x0, y0 + h], [x0 + w + 20, y0 + h]], INK, 8);
  const f = (t: number) => Math.max(0, Math.exp(-4.5 * t) - Math.exp(-3)) / (1 - Math.exp(-3));
  const P = (end: number) => Array.from({ length: 31 }, (_, i) => { const t = i / 30; return [x0 + 20 + t * (w - 20), y0 + h * 0.5 + (end - h * 0.5) * 0 + (end) * f(t) * 0 + h * 0.5 * 0 + (h * 0.5 - 0) * 0 + ((end > 0 ? 1 : -1) * Math.abs(end)) * f(t)]; });
  curve(c, P(-h * 0.4), 18, COL.blue, 8).valueOf();
  curve(c, P(h * 0.4), 10, RED, 0);
};
const e1 = (c: Ctx) => {
  ground(c); table(c, 760);
  // graph above: hot line falls, cold line rises, they meet
  const x0 = 140, y0 = 130, w = 800, h = 440;
  arrow(c, [[x0, y0 + h], [x0, y0 - 20]], INK, 8); arrow(c, [[x0, y0 + h], [x0 + w + 20, y0 + h]], INK, 8);
  const f = (t: number) => (Math.exp(-4.5 * t) - Math.exp(-3)) / (1 - Math.exp(-3));
  const Hs = Array.from({ length: 31 }, (_, i) => { const t = Math.min(1, i / 22); return [x0 + 30 + (i / 30) * (w - 30), y0 + h * 0.5 - h * 0.4 * f(t)]; });
  const Cs = Array.from({ length: 31 }, (_, i) => { const t = Math.min(1, i / 22); return [x0 + 30 + (i / 30) * (w - 30), y0 + h * 0.5 + h * 0.4 * f(t)]; });
  curve(c, Cs, 18, COL.blue, 8); curve(c, Hs, 10, RED, 0);
  // the two tumblers below
  tumbler(c, 280, 940, 240, 270, { water: HOT, steam: true, steamH: 120 });
  tumbler(c, 800, 940, 240, 270, { water: COLD, drops: true });
  thermo(c, 380, 800, 170, 0.7, 0, 22); thermo(c, 900, 800, 170, 0.25, 0, 22);
};
const e2 = (c: Ctx) => {
  ground(c); table(c, 880);
  const cx = 540, cy = 600, rx = 440;
  shadow(c, cx + 20, 905, 430, 34);
  const body = () => { c.moveTo(cx - rx, cy); c.lineTo(cx - rx + 22, 840); c.quadraticCurveTo(cx, 930, cx + rx - 22, 840); c.lineTo(cx + rx, cy); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -rx * 0.35, 0, 0.55);
  shape(c, () => ell(c, cx, cy, rx, 150), "#e6ebf1", 6);
  shape(c, () => ell(c, cx, cy + 4, rx - 28, 124), "#d8e8f4", 4);
  tumbler(c, cx, 640, 260, 300, { water: HOT, steam: true, steamH: 160 });
  // heat leaves the tumbler into the water: red arrows out to both sides
  arrow(c, [[420, 560], [290, 600]], RED, 14); arrow(c, [[660, 560], [790, 600]], RED, 14);
  thermo(c, 160, 700, 300, 0.45, 0, 26);
};
const e3 = (c: Ctx) => {
  ground(c); table(c, 880);
  tumbler(c, 220, 520, 230, 260, { water: HOT, steam: true, steamH: 110 });
  tumbler(c, 860, 520, 230, 260, { water: COLD, drops: true });
  tumbler(c, 540, 960, 320, 330, { water: "#a9c9d8" });
  thermo(c, 640, 640, 300, 0.5, 0, 28);
  arrow(c, [[250, 600], [330, 700], [430, 790]], RED, 14);
  arrow(c, [[830, 600], [750, 700], [650, 790]], COL.blueDk, 14);
};
const a1 = (c: Ctx) => {
  ground(c); table(c, 600);
  bowl(c, 260, 700, 220, HOT); steam(c, 260, 660, 220);
  bowl(c, 820, 700, 220, "#7fb4e0"); ice(c, 760, 706, 50); ice(c, 880, 700, 44);
  handDown(c, 260, 700, 2.0); handDown(c, 820, 700, 2.0);
  arrow(c, [[540, 420], [540, 520]], RED, 12);
};
const panel = (c: Ctx, x: number, y: number, fn: () => void) => {
  shape(c, () => rrect(c, x, y, 320, 760, 24), "#fffaf0", 7);
  c.save(); c.beginPath(); rrect(c, x + 3, y + 3, 314, 754, 22); c.clip(); c.translate(x, y); fn(); c.restore();
};
const a2 = (c: Ctx) => {
  ground(c);
  panel(c, 30, 160, () => { // fridge, cold
    fridge(c, 190, 480, 220, 340, true);
    tumbler(c, 190, 398, 90, 100, { water: COLD }); thermo(c, 215, 330, 150, 0.2, 0, 14);
    tag(c, 160, 600, 170, 80, "4", COL.blueDk);
  });
  panel(c, 380, 160, () => { // window sun, warm
    shape(c, () => rrect(c, 40, 80, 240, 320, 8), "#bfe0f5", 6); line(c, [[160, 80], [160, 400]], 6); line(c, [[40, 240], [280, 240]], 6);
    sun(c, 90, 130, 26);
    thermo(c, 215, 380, 220, 0.6, 0, 18);
    tag(c, 160, 600, 170, 80, "30", COL.orange);
  });
  panel(c, 730, 160, () => { // hot tea
    tumbler(c, 160, 460, 150, 170, { water: HOT, steam: true, steamH: 110 }); thermo(c, 190, 330, 190, 0.85, 0, 16);
    tag(c, 160, 600, 170, 80, "60", RED);
  });
};
const a3 = (c: Ctx) => {
  ground(c); table(c, 700);
  bowl(c, 290, 800, 230, HOT); steam(c, 290, 775, 180);
  bowl(c, 790, 800, 230, "#7fb4e0"); ice(c, 740, 806, 44); ice(c, 850, 800, 40);
  bottle(c, 290, 840, 0.85, true); bottle(c, 790, 840, 0.15, true);
  arrow(c, [[400, 520], [400, 380]], RED, 12); arrow(c, [[900, 380], [900, 520]], COL.blueDk, 12);
};
const a4 = (c: Ctx) => {
  ground(c); table(c, 700);
  // idli steamer cooling, curd warming, ice melting
  shadow(c, 220, 790, 180, 22);
  shape(c, () => rrect(c, 70, 540, 300, 240, 26), COL.steel, 6); shape(c, () => rrect(c, 54, 480, 332, 80, 26), COL.steelDk, 6); shape(c, () => rrect(c, 190, 430, 60, 56, 12), COL.black, 5);
  steam(c, 220, 420, 150);
  arrow(c, [[400, 600], [470, 560]], RED, 12);
  bowl(c, 600, 640, 130, WHITE); shape(c, () => ell(c, 600, 640, 105, 22), "#f1ede2", 0);
  arrow(c, [[520, 480], [580, 590]], RED, 12);
  tumbler(c, 880, 780, 210, 250, { water: ICE, drops: true }); ice(c, 850, 570, 40); ice(c, 910, 575, 34);
  arrow(c, [[960, 440], [920, 520]], RED, 12);
  forearm(c, 0, 0, 0, 0.0001, CLOTH.child);
};
const p1 = (c: Ctx) => {
  ground(c);
  // window with grill, thermometer taped outside
  shape(c, () => rrect(c, 40, 80, 460, 880, 14), "#bfe0f5", 7);
  for (const x of [130, 220, 310, 400]) line(c, [[x, 80], [x, 960]], 14, INK);
  line(c, [[40, 340], [500, 340]], 12, INK); line(c, [[40, 700], [500, 700]], 12, INK);
  sun(c, 120, 170, 36);
  thermo(c, 265, 640, 360, 0.5, 0, 28);
  line(c, [[240, 420], [292, 420]], 12, COL.yellow); line(c, [[240, 590], [292, 590]], 12, COL.yellow);
  // the graph: two lines over seven days
  shape(c, () => rrect(c, 540, 160, 500, 760, 24), COL.paper, 6);
  const gx = 590, gy = 840, gw = 400, gh = 600;
  arrow(c, [[gx, gy], [gx, gy - gh]], INK, 7); arrow(c, [[gx, gy], [gx + gw, gy]], INK, 7);
  const am = [0.28, 0.3, 0.25, 0.32, 0.27, 0.3, 0.26], pm = [0.62, 0.7, 0.58, 0.75, 0.66, 0.72, 0.64];
  const pts = (a: number[]) => a.map((v, i) => [gx + 40 + i * 50, gy - v * gh]);
  curve(c, pts(am).concat([]), 10, COL.blue, 6); curve(c, pts(pm), 10, RED, 6);
  pts(am).forEach(([x, y]) => shape(c, () => ell(c, x, y, 12, 12), COL.blueDk, 4)); pts(pm).forEach(([x, y]) => shape(c, () => ell(c, x, y, 12, 12), RED, 4));
  sun(c, gx + 90, gy - 540, 26);
};
const c1 = (c: Ctx) => {
  ground(c); table(c, 900);
  // left: pouring from a height
  const fx = 190, fy = 330, s = 1.5, an = 0.3;
  c.save(); c.translate(fx, fy); c.rotate(2.0); tumbler(c, 0, 150, 230, 300, { water: HOT }); c.restore();
  forearm(c, fx - 70 * s * Math.cos(an), fy - 70 * s * Math.sin(an), an, s, CLOTH.adult);
  hand(c, fx - 70 * s * Math.cos(an), fy - 70 * s * Math.sin(an), an, s, SKIN.adult, CLOTH.adult);
  curve(c, [[326, 392], [350, 520], [356, 690], [358, 770]], 22, HOT, 8);
  bowl(c, 360, 790, 150, HOT);
  steam(c, 360, 770, 100, 2);
  // right: a wide plate with the water spread out, a card fanning it
  plate(c, 800, 840, 230, 80); shape(c, () => ell(c, 800, 836, 190, 58), HOT, 4);
  steam(c, 800, 800, 110);
  c.save(); c.translate(800, 440); c.rotate(-0.4);
  shape(c, () => rrect(c, -150, -90, 300, 180, 10), COL.paper, 6);
  c.restore();
  hand(c, 960, 560, Math.PI + 0.9, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[720, 590], [700, 680], [720, 740]], COL.blueDk, 12); arrow(c, [[860, 590], [880, 680], [860, 740]], COL.blueDk, 12);
};
const c2 = (c: Ctx) => {
  ground(c); table(c, 800);
  bowl(c, 540, 840, 340, HOT); steam(c, 540, 810, 150);
  // a paper strip with three marks behind the straw, the straw bottle and the real thermometer
  bottle(c, 400, 880, 0.55);
  shape(c, () => rrect(c, 450, 220, 60, 400, 4), COL.paper, 5);
  for (const [i, y] of [[0, 560], [1, 440], [2, 320]] as [number, number][]) { line(c, [[450, y], [510, y]], 5); void i; }
  write(c, "15", 524, 530, 48, INK, 8); write(c, "30", 524, 410, 48, INK, 8); write(c, "45", 524, 290, 48, INK, 8);
  thermo(c, 780, 880, 520, 0.5, 0, 34);
};

// ---------------------------------------------------------------- terms
const t0 = (c: Ctx) => {
  ground(c); table(c, 880);
  sun(c, 230, 220, 90);
  thermo(c, 230, 840, 440, 0.88, 0, 36);
  tag(c, 230, 940, 200, 90, "38", RED);
  fridge(c, 800, 880, 320, 520);
  thermo(c, 800, 760, 360, 0.15, 0, 32);
  tag(c, 800, 960, 200, 90, "4", COL.blueDk);
};
const t1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 540, 960, 260, 400, { water: "#c98a4b", steam: true, steamH: 200 });
  arrow(c, [[460, 640], [350, 640]], RED, 14); arrow(c, [[620, 640], [730, 640]], RED, 14);
  forearm(c, 215, 780, 0, 1.6, CLOTH.child); hand(c, 215, 780, 0, 1.6, SKIN.child, CLOTH.child);
  c.save(); c.translate(1080, 0); c.scale(-1, 1); forearm(c, 215, 780, 0, 1.6, CLOTH.child); hand(c, 215, 780, 0, 1.6, SKIN.child, CLOTH.child); c.restore();
};
const t2 = (c: Ctx) => {
  ground(c);
  const x = 420, yb = 960, len = 840;
  labThermo(c, x, yb, len, 0.4, 56);
  for (const v of [0, 50, 100]) write(c, String(v), x + 130, labY(yb, len, v) - 24, 52, INK, 8);
};
const t3 = (c: Ctx) => {
  ground(c);
  const x = 540, yb = 960, len = 840;
  labThermo(c, x, yb, len, 0.52, 56);
  const y0 = labY(yb, len, 0), y37 = labY(yb, len, 37), y100 = labY(yb, len, 100);
  ice(c, 150, y0, 70); write(c, "0", 290, y0 - 28, 56, INK, 9);
  headIcon(c, 150, y37, 60); write(c, "37", 290, y37 - 28, 56, INK, 9);
  potIcon(c, 150, y100 + 40, 80); write(c, "100", 290, y100 - 28, 56, INK, 9);
  for (const y of [y0, y37, y100]) line(c, [[450, y], [x - 40, y]], 5, COL.greyDk);
};
const t4 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 940, 520, 560, 0.6, COLD);
  // the thermometer with its big bulb in the water
  shape(c, () => rrect(c, 510, 90, 60, 700, 30), "#f4f9ff", 6);
  shape(c, () => ell(c, 540, 810, 80, 80), RED, 6);
  shape(c, () => rrect(c, 528, 600, 24, 210, 12), RED, 0);
  for (let i = 0; i < 6; i++) line(c, [[580, 160 + i * 80], [i % 2 ? 610 : 630, 160 + i * 80]], 4);
  shine(c, [[518, 150], [518, 560]], 6);
  arrow(c, [[780, 900], [660, 830]], RED, 14);
};
const t5 = (c: Ctx) => {
  ground(c);
  thermo(c, 300, 900, 760, 0.2, 0, 56); ice(c, 150, 870, 60);
  thermo(c, 780, 900, 760, 0.65, 0, 56); sun(c, 930, 840, 44);
  arrow(c, [[540, 700], [540, 440]], RED, 14);
};
const t6 = (c: Ctx) => {
  ground(c);
  const circ = (cx: number, cy: number, r: number, col: string, shake: number) => {
    shape(c, () => ell(c, cx, cy, r, r), "#fffaf0", 9);
    c.save(); c.beginPath(); ell(c, cx, cy, r - 6, r - 6); c.clip();
    const P = [[-100, -90], [10, -110], [-150, 20], [0, 0], [130, -30], [-60, 120], [90, 110]];
    P.forEach(([dx, dy]) => ball(c, cx + dx, cy + dy, 36, col, shake));
    c.restore();
  };
  circ(270, 400, 230, COL.blue, 0.5); circ(810, 400, 230, RED, 2.5);
  tumbler(c, 270, 1030, 170, 200, { water: COLD, drops: true });
  tumbler(c, 810, 1030, 170, 200, { water: HOT, steam: true, steamH: 100 });
  line(c, [[270, 830], [270, 640]], 5, COL.greyDk); line(c, [[810, 830], [810, 640]], 5, COL.greyDk);
};
const t7 = (c: Ctx) => {
  ground(c, "#e9dcc4");
  thermo(c, 880, 520, 380, 0.55, 0, 32);
  tag(c, 880, 600, 160, 80, "30");
  shape(c, () => rrect(c, 40, 780, 1000, 40, 8), COL.wood, 6);
  shape(c, () => rrect(c, 120, 580, 130, 200, 26), COL.blue, 6); shape(c, () => rrect(c, 160, 530, 50, 55, 8), COL.blueDk, 5); shine(c, [[140, 620], [140, 750]], 8);
  shape(c, () => rrect(c, 320, 720, 260, 60, 8), COL.orange, 6); shape(c, () => rrect(c, 335, 660, 230, 60, 8), COL.teal, 6); line(c, [[350, 660], [350, 720]], 8, COL.tealDk);
  plate(c, 700, 765, 130, 26);
  void CLOTH;
};
const t8 = (c: Ctx) => {
  ground(c);
  digital(c, 230, 700, 1.1, -0.28);
};
const t9 = (c: Ctx) => {
  ground(c); table(c, 920);
  tumbler(c, 540, 1000, 400, 400, { water: COLD });
  const top = 600;
  above(c, top, () => labThermo(c, 600, 820, 740, 0.45, 40));
};

// ---------------------------------------------------------------- explanations
const x0 = (c: Ctx) => {
  ground(c);
  const items: ((x: number, y: number) => void)[] = [
    (x, y) => freezerIcon(c, x, y, 52), (x, y) => ice(c, x, y, 46), (x, y) => fridgeIcon(c, x, y - 4, 44), (x, y) => houseIcon(c, x, y + 10, 52),
    (x, y) => headIcon(c, x, y, 48), (x, y) => cupIcon(c, x, y + 40, 48), (x, y) => potIcon(c, x, y + 34, 56),
  ];
  const vals = ["-18", "0", "4", "30", "37", "60", "100"];
  shape(c, () => rrect(c, 60, 40, 76, 1000, 38), "#f4f9ff", 6);
  c.beginPath(); rrect(c, 90, 140, 16, 880, 8); c.fillStyle = RED; c.fill();
  shape(c, () => ell(c, 98, 1010, 54, 54), RED, 6);
  vals.forEach((v, i) => {
    const y = 960 - i * 140;
    line(c, [[140, y], [200, y]], 6);
    write(c, v, 220, y - 32, 62, INK, 10);
    items[i](640, y);
  });
};
const x1 = (c: Ctx) => {
  ground(c);
  glass(c, 250, 960, 360, 380, 0.6, HOT); steam(c, 250, 560, 150, 2);
  shape(c, () => rrect(c, 232, 100, 36, 700, 18), "#f4f9ff", 6);
  shape(c, () => ell(c, 250, 830, 56, 56), RED, 6);
  shape(c, () => rrect(c, 240, 430, 20, 400, 10), RED, 0);
  // a zoom circle on the narrow tube, the red liquid creeping up
  line(c, [[268, 130], [560, 90]], 5, COL.greyDk); line(c, [[268, 300], [560, 700]], 5, COL.greyDk);
  shape(c, () => ell(c, 770, 390, 290, 290), "#f6fbff", 10);
  c.save(); c.beginPath(); ell(c, 770, 390, 284, 284); c.clip();
  shape(c, () => rrect(c, 725, 60, 90, 700, 45), "#e6f0f8", 6);
  c.beginPath(); c.rect(735, 420, 70, 400); c.fillStyle = RED; c.fill();
  c.restore();
  c.beginPath(); ell(c, 770, 390, 290, 290); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
  arrow(c, [[690, 440], [690, 280]], RED, 14);
};
const x2 = (c: Ctx) => {
  ground(c);
  digital(c, 200, 330, 1.05, 0);
  write(c, "32", 160, 460, 70, INK, 11); write(c, "42", 790, 460, 70, INK, 11);
  c.save(); c.translate(100, 700); c.rotate(Math.PI / 2);
  labThermo(c, 0, 0, 900, 0.35, 48);
  c.restore();
  write(c, "-10", 170, 800, 70, INK, 11); write(c, "110", 880, 800, 70, INK, 11);
};
const x3 = (c: Ctx) => {
  ground(c, "#e9dcc4"); table(c, 760);
  thermo(c, 900, 440, 340, 0.5, 0, 28);
  tumbler(c, 260, 940, 240, 300, { water: HOT, steam: true, steamH: 130 });
  tumbler(c, 760, 940, 240, 300, { water: COLD, drops: true });
  arrow(c, [[400, 780], [500, 700], [620, 780]], RED, 14);
  arrow(c, [[300, 640], [380, 560], [460, 520]], RED, 12);
};
const x4 = (c: Ctx) => {
  ground(c);
  forearm(c, 780, 700, Math.PI, 3, CLOTH.child);
  hand(c, 780, 700, Math.PI, 3, SKIN.child, CLOTH.child, true);
  ice(c, 540, 492, 125);
  arrow(c, [[620, 640], [600, 530]], RED, 16); arrow(c, [[470, 640], [480, 530]], RED, 16);
  shape(c, () => dropP(c, 360, 640, 24), COL.water, 4);
};
const x5 = (c: Ctx) => {
  ground(c);
  const circ = (cx: number) => { shape(c, () => ell(c, cx, 480, 240, 240), "#fffaf0", 9); };
  circ(270); circ(810);
  // before: a hot water particle bumps a cooler steel particle
  ball(c, 190, 480, 62, RED, 3); ball(c, 340, 480, 62, COL.steelDk, 0.3);
  // after: the steel particle jiggles more
  ball(c, 730, 480, 62, "#ec6a3c", 2); ball(c, 880, 480, 62, COL.orange, 2.2);
  arrow(c, [[500, 480], [580, 480]], RED, 16);
  void WHITE; void SKIN;
};
const x6 = (c: Ctx) => {
  ground(c); table(c, 860);
  bowl(c, 260, 740, 160, HOT); ice(c, 260, 710, 80); steam(c, 260, 680, 150, 2);
  thermo(c, 100, 700, 340, 0.85, 0, 26);
  const cx = 740, cy = 460;
  shadow(c, cx + 30, 880, 280, 28);
  const body = () => { c.moveTo(cx - 240, cy); c.lineTo(cx - 190, 860); c.quadraticCurveTo(cx, 910, cx + 190, 860); c.lineTo(cx + 240, cy); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -120, 0, 0.55);
  shape(c, () => ell(c, cx, cy, 240, 56), "#e6ebf1", 6); shape(c, () => ell(c, cx, cy + 2, 212, 44), "#d8e8f4", 3);
  steam(c, cx, cy - 20, 150, 2);
  thermo(c, 1010, 840, 300, 0.45, 0, 24);
};
const x7 = (c: Ctx) => {
  ground(c); table(c, 760);
  bowl(c, 540, 800, 330, MILDW);
  handDown(c, 380, 800, 1.6); handDown(c, 700, 800, 1.6);
  above(c, 800, () => thermo(c, 540, 1000, 700, 0.45, 0, 34));
  // thought bubbles with a cold sign and a warm sign
  const bub = (x: number, y: number, tx: number, ty: number) => { shape(c, () => ell(c, x, y, 130, 100), WHITE, 6); shape(c, () => ell(c, (x + tx) / 2, (y + ty) / 2 + 40, 16, 16), WHITE, 5); shape(c, () => ell(c, tx, ty, 10, 10), WHITE, 5); };
  bub(160, 180, 280, 340); ice(c, 160, 180, 55);
  bub(920, 180, 800, 340); sun(c, 920, 180, 42);
};

export const ic_energyHeatL3 = cards("sci.energy.heat.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, x0, x1, x2, x3, x4, x5, x6, x7,
]);
void flame; void ball; void meetGraph;
