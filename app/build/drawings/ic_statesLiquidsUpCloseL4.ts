import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// LIQUIDS UP CLOSE (L4) · set-up cards and card pictures: bottles with holes and jets, a clear hose that
// finds its level, taps, a squeezed bottle, dam drawings, straws, a syringe arm, and the pressure card game.

const WALL = "#eef3f6", TILE = "#bcd6e4", FLOOR = "#d8c9a8", PINK = "#f07fa8", PINKDK = "#d4568a", TAPE = "#f3e5b5", PAPER = "#fffaf0", NEWS = "#e6e2d8", NEWSWET = "#9a948a", GLASSFILL = "#dfeaf3";
const PI = Math.PI;

// ---------------------------------------------------------------- places
const room = (c: Ctx, fy: number, tiles = false) => {
  ground(c, WALL);
  if (tiles) { for (let x = 0; x <= D; x += 120) line(c, [[x, 0], [x, fy]], 3, TILE); for (let y = fy - 120; y > -10; y -= 120) line(c, [[0, y], [D, y]], 3, TILE); }
  c.fillStyle = FLOOR; c.fillRect(0, fy, D, D - fy); line(c, [[0, fy], [D, fy]], 6);
};
const dashed = (c: Ctx, pts: number[][], w = 4, col = INK, dash = 18) => { c.save(); c.setLineDash([dash, dash]); line(c, pts, w, col); c.restore(); };
// a smooth tube through points (a hose or a thin tube), with ink outline; col is what shows inside
const tube = (c: Ctx, pts: number[][], w: number, col: string, outline = true) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  if (outline) { path(); c.strokeStyle = INK; c.lineWidth = w + 8; c.stroke(); }
  path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
// the empty part of a clear hose end, painted over the water from the tip down to the level
const tubeAir = (c: Ctx, x: number, top: number, level: number, w: number) => { line(c, [[x, top], [x, level]], w, GLASSFILL); line(c, [[x - w / 2, level], [x + w / 2, level]], 3, PINKDK); line(c, [[x, top], [x, top + 1]], w, INK); line(c, [[x, top + 3], [x, top + 4]], w - 8, GLASSFILL); };

// ---------------------------------------------------------------- things
// a clear plastic bottle with no cap, bottom centre (x, y); fill = fraction of its height
const bottleP = (c: Ctx, x: number, y: number, w: number, h: number) => { const nw = w * 0.2, r = w * 0.14; c.moveTo(x - nw, y - h); c.lineTo(x + nw, y - h); c.lineTo(x + nw, y - h * 0.9); c.quadraticCurveTo(x + w / 2, y - h * 0.86, x + w / 2, y - h * 0.74); c.lineTo(x + w / 2, y - r); c.quadraticCurveTo(x + w / 2, y, x + w / 2 - r, y); c.lineTo(x - w / 2 + r, y); c.quadraticCurveTo(x - w / 2, y, x - w / 2, y - r); c.lineTo(x - w / 2, y - h * 0.74); c.quadraticCurveTo(x - w / 2, y - h * 0.86, x - nw, y - h * 0.9); c.closePath(); };
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, fill = 0, o: { cap?: boolean; liquid?: string; noShadow?: boolean } = {}) => {
  if (!o.noShadow) shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.13);
  if (fill > 0) { c.save(); c.beginPath(); bottleP(c, x, y, w, h); c.clip(); c.fillStyle = o.liquid ?? COL.water; c.fillRect(x - w, y - h * fill, 2 * w, h * fill + 10); c.fillStyle = COL.drop; c.beginPath(); ell(c, x, y - h * fill, w, w * 0.07); c.fill(); c.restore(); }
  shape(c, () => bottleP(c, x, y, w, h), COL.glass, 6);
  shine(c, [[x - w * 0.36, y - h * 0.68], [x - w * 0.36, y - h * 0.2]], 8);
  if (o.cap) shape(c, () => rrect(c, x - w * 0.24, y - h - 16, w * 0.48, 22 + h * 0.03, 6), COL.blue, 5);
};
const hole = (c: Ctx, x: number, y: number, r = 7) => shape(c, () => ell(c, x, y, r, r * 0.75), INK, 0);
const tape = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, alpha = 1) => { c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha = alpha; shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), TAPE, 4); c.restore(); c.globalAlpha = 1; };
// a jet of water: leaves (x0, y0) sideways and falls to land at (x1, y1)
const jet = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w = 12, col = COL.waterDk, splash = true) => {
  const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t * t]); }
  line(c, pts, w + 6, INK); line(c, pts, w, col); c.globalAlpha = 0.7; line(c, pts.slice(0, 12).map(([x, y]) => [x, y - w * 0.22]), w * 0.28, COL.drop); c.globalAlpha = 1;
  if (splash) { shape(c, () => ell(c, x1, y1, w * 2.2, w * 0.6), col, 4); for (const [dx, dy] of [[-w * 1.6, -w * 1.3], [w * 1.8, -w * 1.1], [w * 0.4, -w * 1.9]]) shape(c, () => ell(c, x1 + dx, y1 + dy, w * 0.33, w * 0.48), col, 3); }
};
// a jet that rises a little first (seen from slightly above, a jet going away from us)
const jetArc = (c: Ctx, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w = 12, col = COL.waterDk) => {
  const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24, u = 1 - t; pts.push([u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]); }
  line(c, pts, w + 6, INK); line(c, pts, w, col);
  shape(c, () => ell(c, x1, y1, w * 2, w * 0.55), col, 4);
};
const stool = (c: Ctx, x: number, top: number, w: number, h: number) => {
  const fy = top + h; shadow(c, x + 24, fy + 4, w * 0.6, 14);
  for (const s of [-1, 1]) { const lx = x + s * (w / 2 - 24), fx = x + s * (w / 2 - 4); line(c, [[lx, top + 20], [fx, fy]], 28, INK); line(c, [[lx, top + 20], [fx, fy]], 16, COL.woodDk); }
  line(c, [[x - w / 2 + 36, top + h * 0.55], [x + w / 2 - 36, top + h * 0.55]], 20, INK); line(c, [[x - w / 2 + 36, top + h * 0.55], [x + w / 2 - 36, top + h * 0.55]], 10, COL.woodDk);
  shape(c, () => rrect(c, x - w / 2, top, w, 30, 8), COL.wood); shade(c, () => rrect(c, x - w / 2, top, w, 30, 8), COL.woodDk, 0, -12);
};
// a tape measure lying along the floor from x0, numbers every 10 cm
const tapeMeasure = (c: Ctx, x0: number, y: number, cm: number, px: number, h = 30) => {
  shape(c, () => rrect(c, x0 - 70, y - h * 1.1, 70, h * 2.2, 10), COL.black, 5);
  shape(c, () => rrect(c, x0, y - h / 2, cm * px, h, 3), COL.yellow, 4);
  for (let i = 0; i <= cm; i++) { const x = x0 + i * px; line(c, [[x, y - h / 2], [x, y - h / 2 + (i % 10 === 0 ? h * 0.55 : i % 5 === 0 ? h * 0.38 : h * 0.22)]], i % 10 === 0 ? 3 : 2); if (i % 10 === 0 && i > 0 && i < cm) write(c, String(i), x - px * 0.35, y + h * 0.02, h * 0.42, INK, 3); }
};
// a tape measure standing up, from the floor at (x, fy) to height top
const tapeMeasureUp = (c: Ctx, x: number, fy: number, top: number, w = 30) => {
  shape(c, () => rrect(c, x - w * 1.3, fy - w * 1.5, w * 2.6, w * 1.5, 10), COL.black, 5);
  shape(c, () => rrect(c, x - w / 2, top, w, fy - w * 1.5 - top, 3), COL.yellow, 4);
  const px = (fy - w * 1.5 - top) / 40;
  for (let i = 0; i <= 40; i++) { const y = fy - w * 1.5 - i * px; line(c, [[x - w / 2, y], [x - w / 2 + (i % 10 === 0 ? w * 0.55 : w * 0.25), y]], 2); }
};
const newspaper = (c: Ctx, x: number, y: number, len: number, h: number) => {
  shape(c, () => polyP(c, [[x + 14, y], [x + len + 14, y], [x + len, y + h], [x, y + h]]), NEWS, 4);
  c.globalAlpha = 0.5; for (let k = 0; k < 4; k++) for (let xx = x + 30 + k * 7; xx < x + len - 20; xx += 34) line(c, [[xx, y + 8 + k * (h - 14) / 4], [xx + 20, y + 8 + k * (h - 14) / 4]], 2.5, COL.greyDk); c.globalAlpha = 1;
};
const wetSpot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.42), NEWSWET, 3);
// a pouring jug held by its handle at (gx, gy), tilted by tilt (radians, more = steeper); returns the spout tip
const jug = (c: Ctx, gx: number, gy: number, tilt: number, s: number) => {
  const body = () => rrect(c, 60, -110, 150, 220, 26);
  c.save(); c.translate(gx, gy); c.rotate(tilt); c.scale(s, s);
  shape(c, () => { c.moveTo(70, -70); c.bezierCurveTo(-40, -70, -40, 70, 70, 70); c.lineTo(70, 40); c.bezierCurveTo(10, 40, 10, -40, 70, -40); c.closePath(); }, COL.teal, 6);
  shape(c, body, COL.teal, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.rotate(-tilt); c.fillStyle = COL.water; c.fillRect(-600, -24, 1200, 800); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => { c.moveTo(196, -110); c.lineTo(240, -134); c.lineTo(224, -100); c.closePath(); }, COL.teal, 6);
  c.restore();
  const sx = 236 * s, sy = -126 * s;
  return [gx + sx * Math.cos(tilt) - sy * Math.sin(tilt), gy + sx * Math.sin(tilt) + sy * Math.cos(tilt)] as [number, number];
};
// a falling stream of water from (x, y0) straight down to y1
const stream = (c: Ctx, x: number, y0: number, y1: number, w = 14) => { line(c, [[x, y0], [x, y1]], w + 6, INK); line(c, [[x, y0], [x, y1]], w, COL.waterDk); c.globalAlpha = 0.7; line(c, [[x - w * 0.2, y0 + 10], [x - w * 0.2, y1 - 10]], w * 0.25, COL.drop); c.globalAlpha = 1; };
const bucket = (c: Ctx, x: number, y: number, wTop: number, wBot: number, h: number, liquid: string | null, col = COL.blue, colDk = COL.blueDk) => {
  shadow(c, x + wBot * 0.15, y + 6, wBot * 0.7, wBot * 0.12);
  const body = () => polyP(c, [[x - wTop / 2, y - h], [x + wTop / 2, y - h], [x + wBot / 2, y], [x - wBot / 2, y]]);
  shape(c, body, col); shade(c, body, colDk, -wTop * 0.2, 0);
  shape(c, () => ell(c, x, y - h, wTop / 2, wTop * 0.11), liquid ?? colDk, 6);
  if (liquid) { c.globalAlpha = 0.8; line(c, [[x - wTop * 0.3, y - h - wTop * 0.02], [x - wTop * 0.1, y - h - wTop * 0.04]], 5, COL.drop); c.globalAlpha = 1; }
};
const funnel = (c: Ctx, x: number, y: number, w: number, h: number, levelY?: number) => {
  const cone = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.1, y - h * 0.38], [x + w * 0.1, y], [x - w * 0.1, y], [x - w * 0.1, y - h * 0.38]]);
  if (levelY !== undefined) { c.save(); c.beginPath(); cone(); c.clip(); c.fillStyle = PINK; c.fillRect(x - w, levelY, 2 * w, h); c.restore(); }
  shape(c, cone, "rgba(214,236,250,0.5)", 6);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), "rgba(255,255,255,0.4)", 5);
  if (levelY !== undefined) line(c, [[x - w * 0.5 * ((y - levelY) / h), levelY], [x + w * 0.5 * ((y - levelY) / h), levelY]], 3, PINKDK);
};
// a syringe: back end (where the rod comes out) at (x, y), pointing along an; out = how far the plunger is pulled out (0..1)
const syringe = (c: Ctx, x: number, y: number, len: number, an: number, out: number, r = 30, liquid = PINK) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const head = len * 0.1 + (1 - out) * len * 0.72, rodEnd = head - len * 0.78;
  shape(c, () => rrect(c, rodEnd, -r * 0.3, head - rodEnd, r * 0.6, 4), COL.steel, 5);
  shape(c, () => rrect(c, rodEnd - 10, -r * 0.95, 14, r * 1.9, 4), COL.steel, 5);
  shape(c, () => rrect(c, head, -r + 4, len - head, 2 * r - 8, 4), liquid, 0);
  shape(c, () => rrect(c, 0, -r, len, 2 * r, 8), COL.glass, 6);
  shape(c, () => rrect(c, head - 6, -r + 6, 22, 2 * r - 12, 4), COL.black, 4);
  shape(c, () => rrect(c, -8, -r * 1.5, 14, r * 3, 4), COL.glass, 5);
  shape(c, () => rrect(c, len, -r * 0.3, r * 0.9, r * 0.6, 4), COL.glass, 5);
  for (let i = 1; i < 5; i++) line(c, [[len * 0.2 * i, -r + 4], [len * 0.2 * i, -r * 0.5]], 2.5);
  c.restore();
};
const pencil = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w = 14) => {
  const an = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
  c.save(); c.translate(x0, y0); c.rotate(an);
  shape(c, () => rrect(c, -w * 0.9, -w / 2, L - w * 1.4 + w * 0.9, w, 3), COL.yellow, 5);
  shape(c, () => polyP(c, [[L - w * 1.5, -w / 2], [L, 0], [L - w * 1.5, w / 2]]), "#e8c9a0", 5);
  shape(c, () => polyP(c, [[L - w * 0.6, -w * 0.2], [L, 0], [L - w * 0.6, w * 0.2]]), INK, 0);
  shape(c, () => rrect(c, -w * 0.9, -w / 2, w * 0.8, w, 3), COL.pink, 4);
  c.restore();
};
// a notebook page with a table of numbers, centre (x, y)
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, nums: string[][]) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 6), PAPER, 5);
  const rows = nums.length, cols = nums[0].length, cw = (w - 24) / cols, rh = (h - 24) / rows;
  for (let i = 0; i <= rows; i++) line(c, [[-w / 2 + 12, -h / 2 + 12 + i * rh], [w / 2 - 12, -h / 2 + 12 + i * rh]], 2.5, COL.greyDk);
  for (let j = 0; j <= cols; j++) line(c, [[-w / 2 + 12 + j * cw, -h / 2 + 12], [-w / 2 + 12 + j * cw, h / 2 - 12]], 2.5, COL.greyDk);
  nums.forEach((row, i) => row.forEach((t, j) => write(c, t, -w / 2 + 12 + j * cw + cw * 0.2, -h / 2 + 12 + i * rh + rh * 0.22, rh * 0.56, INK, 3.5)));
  c.restore();
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 6) => {
  const L: Record<string, number[][][]> = {
    A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.13, 0.62], [0.47, 0.62]]],
    B: [[[0, 0], [0, 1]], [[0, 0], [0.38, 0], [0.55, 0.12], [0.55, 0.38], [0.38, 0.5], [0, 0.5]], [[0, 0.5], [0.42, 0.5], [0.6, 0.62], [0.6, 0.88], [0.42, 1], [0, 1]]],
    "=": [[[0.05, 0.38], [0.55, 0.38]], [[0.05, 0.64], [0.55, 0.64]]],
    "?": [[[0.05, 0.25], [0.3, 0.02], [0.55, 0.25], [0.3, 0.52], [0.3, 0.7]], [[0.3, 0.95], [0.3, 0.97]]],
    v: [[[0, 0.55], [0.22, 0.9], [0.65, 0.15]]],
  };
  (L[ch] ?? []).forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
};
// a playing card lying flat, centre (x, y); face: "front" (A | B boxes), "back" (answer), "down" (plain)
const gameCard = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, face: "front" | "back" | "down") => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), face === "down" ? COL.teal : PAPER, 5);
  if (face === "front") {
    line(c, [[0, -h * 0.4], [0, h * 0.4]], 3, COL.greyDk);
    letter(c, "A", -w * 0.36, -h * 0.4, h * 0.26, COL.blueDk, 5); letter(c, "B", w * 0.1, -h * 0.4, h * 0.26, COL.orange, 5);
    for (let k = 0; k < 3; k++) { line(c, [[-w * 0.42, -h * 0.02 + k * h * 0.13], [-w * 0.08, -h * 0.02 + k * h * 0.13]], 4, COL.grey); line(c, [[w * 0.08, -h * 0.02 + k * h * 0.13], [w * 0.42, -h * 0.02 + k * h * 0.13]], 4, COL.grey); }
  } else if (face === "back") {
    letter(c, "B", -w * 0.3, -h * 0.4, h * 0.36, COL.orange, 7); letter(c, "v", w * 0.05, -h * 0.4, h * 0.34, COL.green, 8);
    for (let k = 0; k < 2; k++) line(c, [[-w * 0.4, h * 0.12 + k * h * 0.15], [w * (k ? 0.1 : 0.4), h * 0.12 + k * h * 0.15]], 4, COL.grey);
  } else shape(c, () => rrect(c, -w * 0.38, -h * 0.38, w * 0.76, h * 0.76, 6), COL.tealDk, 3);
  c.restore();
};
// a vote token: face up shows A, B or =; face down is a plain teal disc
const token = (c: Ctx, x: number, y: number, r: number, face: "A" | "B" | "=" | null) => {
  shadow(c, x + r * 0.1, y + r * 0.35, r * 0.95, r * 0.3);
  shape(c, () => ell(c, x, y, r, r), face === null ? COL.teal : face === "A" ? COL.sky : face === "B" ? "#ffd9b0" : COL.steelIn, 5);
  if (face === null) shape(c, () => ell(c, x, y, r * 0.6, r * 0.6), COL.tealDk, 3);
  else letter(c, face, x - r * 0.3, y - r * 0.5, r, face === "A" ? COL.blueDk : face === "B" ? COL.orange : INK, 7);
};
// a chrome tap standing on a counter at (x, y); returns the spout tip
const tap = (c: Ctx, x: number, y: number, s: number) => {
  const pts = [[x, y], [x, y - 120 * s], [x, y - 190 * s], [x + 60 * s, y - 190 * s], [x + 110 * s, y - 170 * s], [x + 110 * s, y - 130 * s]];
  tube(c, pts, 26 * s, COL.steel);
  shape(c, () => rrect(c, x - 22 * s, y - 20 * s, 44 * s, 20 * s, 4), COL.steelDk, 5);
  shape(c, () => rrect(c, x + 94 * s, y - 136 * s, 32 * s, 26 * s, 4), COL.steelDk, 5);
  line(c, [[x - 10 * s, y - 190 * s], [x + 20 * s, y - 232 * s]], 14 * s, INK); line(c, [[x - 10 * s, y - 190 * s], [x + 20 * s, y - 232 * s]], 7 * s, COL.steelDk);
  shape(c, () => ell(c, x + 22 * s, y - 236 * s, 16 * s, 16 * s), COL.red, 4);
  return [x + 110 * s, y - 110 * s] as [number, number];
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, screen: (c: Ctx) => void) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.12), COL.black, 6);
  c.save(); c.beginPath(); rrect(c, x - w / 2 + 8, y - h / 2 + 18, w - 16, h - 36, w * 0.06); c.clip(); c.fillStyle = WHITE; c.fillRect(x - w, y - h, 2 * w, 2 * h); screen(c); c.restore();
};
const paperCup = (c: Ctx, x: number, top: number, w: number, h: number) => { const body = () => polyP(c, [[x - w / 2, top], [x + w / 2, top], [x + w * 0.36, top + h], [x - w * 0.36, top + h]]); shape(c, body, PAPER); shade(c, body, COL.grey, -w * 0.2, 0, 0.35); shape(c, () => ell(c, x, top, w / 2, w * 0.1), COL.steelIn, 5); };
const kid = (c: Ctx, x: number, y: number, h: number, p: Parameters<typeof person>[4] = {}) => person(c, x, y, h, p);
const grown = (c: Ctx, x: number, y: number, h: number, p: Parameters<typeof person>[4] = {}) => person(c, x, y, h, { ...p, adult: true });
// a hand reaching in from the right (mirror image of hand())
const handR = (c: Ctx, x: number, y: number, s: number, skin = SKIN.child, sleeve = CLOTH.child, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, 0, s, skin, sleeve, open); c.restore(); };
const zoomRing = (c: Ctx, x: number, y: number, r: number, draw: () => void) => { shape(c, () => ell(c, x, y, r, r), WHITE, 8); c.save(); c.beginPath(); ell(c, x, y, r - 4, r - 4); c.clip(); draw(); c.restore(); };

// ---------------------------------------------------------------- e1 Three Jets
// three holes at 4, 10 and 16 cm, each taped, and the water line at 22 cm
const e1s0 = (c: Ctx) => {
  ground(c); const x = 620, y = 900, h = 720, px = h / 30;
  // ruler beside it
  shape(c, () => rrect(c, 300, y - h, 64, h, 4), COL.wood, 5);
  for (let i = 0; i <= 30; i++) { const yy = y - i * px; line(c, [[300, yy], [300 + (i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11), yy]], i % 10 === 0 ? 3.5 : 2); if (i % 10 === 0) write(c, String(i), 334 - (i ? 0 : 8) - (i >= 10 ? 10 : 0), yy - 8, 22, INK, 3.5); }
  write(c, "cm", 306, y - h - 70, 26, INK, 4);
  bottle(c, x, y, 270, h, 0);
  const holes = [4, 10, 16];
  holes.forEach((cm) => { const yy = y - cm * px; hole(c, x, yy, 9); tape(c, x, yy, 96, 60, 0.08, 0.86); line(c, [[x + 140, yy], [x + 200, yy]], 3); write(c, String(cm), x + 212, yy - 16, 34, INK, 5); });
  // the water line, drawn on with a marker
  const wy = y - 22 * px; line(c, [[x - 135, wy], [x + 135, wy]], 7, RED); write(c, "22", x + 212, wy - 16, 34, RED, 5);
  shape(c, () => rrect(c, 760, 800, 190, 44, 10), COL.black, 5); shape(c, () => rrect(c, 950, 810, 46, 24, 4), RED, 5);
};
// the bottle on a stool in the bathroom, the tape measure on the floor, newspaper beside it
const e1s1 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  stool(c, 230, 560, 180, 380);
  newspaper(c, 360, 858, 600, 36);
  tapeMeasure(c, 330, 912, 64, 10, 30);
  const bx = 280, by = 560, bh = 285, px = bh / 30; bottle(c, bx, by, 105, bh, 0);
  [4, 10, 16].forEach((cm) => { const yy = by - cm * px; hole(c, bx + 50, yy, 6); tape(c, bx + 52, yy, 24, 34, 0, 0.88); });
};
// the child pulls the tape off while a grown-up pours from a jug
const e1s2 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  stool(c, 470, 740, 170, 200);
  const bx = 500, by = 740, bh = 270, px = bh / 30, bw = 120; bottle(c, bx, by, bw, bh, 22 / 30);
  [4, 10, 16].forEach((cm) => hole(c, bx + bw / 2, by - cm * px, 6));
  // the strip of tape over all three holes, its top corner lifted toward the child's hand
  const hands = kid(c, 760, F, 560, { reachL: [618, 598] });
  tape(c, bx + bw / 2 + 2, by - 10 * px + 36, 34, 150, 0, 1);
  shape(c, () => polyP(c, [[bx + bw / 2 - 14, by - 16 * px + 2], [bx + bw / 2 + 18, by - 16 * px + 2], [hands.handL[0], hands.handL[1] + 8], [hands.handL[0] - 10, hands.handL[1] - 12]]), TAPE, 4);
  // the grown-up pours: the jug's spout above the bottle mouth
  const g = grown(c, 150, F, 790, { reachR: [349, 375], armL: [PI * 0.55, PI * 0.5] });
  const tip = jug(c, g.handR[0], g.handR[1], 0.8, 0.6);
  stream(c, tip[0], tip[1] + 4, by - bh - 4, 12);
};
// the three jets land on the wet newspaper, the lowest farthest
const jetsScene = (c: Ctx, sx: number, top: number, sw: number, sh: number, bx: number, bw: number, bh: number, F: number, ranges: number[], news: [number, number]) => {
  stool(c, sx, top, sw, sh);
  newspaper(c, news[0], F - 36, news[1], 36);
  const px = bh / 30; bottle(c, bx, top, bw, bh, 22 / 30);
  const hx = bx + bw / 2; [4, 10, 16].forEach((cm, i) => { const yy = top - cm * px; hole(c, hx, yy, 6); wetSpot(c, hx + ranges[i] * px, F - 16, 34); });
  [4, 10, 16].forEach((cm, i) => jet(c, hx, top - cm * px, hx + ranges[i] * px, F - 18, 11));
};
const e1s3 = (c: Ctx) => { const F = 900; room(c, F, true); jetsScene(c, 200, 500, 180, 400, 250, 110, 300, F, [56, 49, 37], [380, 600]); };
// the child reads each landing on the tape measure and writes it in the table
const e1s4 = (c: Ctx) => {
  const F = 900; room(c, F, true);
  stool(c, 130, 580, 140, 320); const px = 250 / 30; bottle(c, 160, 580, 90, 250, 12 / 30); [4, 10, 16].forEach((cm) => hole(c, 205, 580 - cm * px, 5));
  newspaper(c, 130, 904, 640, 32); [37, 49, 56].forEach((r) => wetSpot(c, 250 + r * 7, 920, 26));
  tapeMeasure(c, 250, 962, 62, 7, 26);
  const k = kid(c, 700, F, 560, { sit: true, dir: -1, reachL: [655, 905], reachR: [790, 790] });
  notebook(c, 700, 812, 130, 90, 0.05, [["37", "49", "56"]]);
  pencil(c, k.handR[0], k.handR[1], 740, 808, 12);
};

// ---------------------------------------------------------------- e2 Same Level
// the hose under the coloured water in the bucket, both ends shut with thumbs
const e2s0 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 6);
  const k = kid(c, 540, 1010, 700, { reachL: [400, 520], reachR: [680, 520] });
  bucket(c, 540, 960, 470, 380, 330, PINK);
  // the hose coiled under the water, seen through the surface
  c.save(); c.beginPath(); ell(c, 540, 630, 230, 50); c.clip(); for (let i = 0; i < 3; i++) { c.beginPath(); ell(c, 540 + i * 10, 634 + i * 6, 170 - i * 18, 30 - i * 4); c.strokeStyle = INK; c.lineWidth = 26; c.stroke(); c.beginPath(); ell(c, 540 + i * 10, 634 + i * 6, 170 - i * 18, 30 - i * 4); c.strokeStyle = GLASSFILL; c.lineWidth = 18; c.stroke(); } c.restore();
  // the two ends rise out of the water to the hands
  for (const hx of [k.handL[0], k.handR[0]]) { tube(c, [[hx, 640], [hx, 600], [hx, 560]], 20, GLASSFILL); }
  hand(c, k.handL[0], k.handL[1], PI / 2, 0.9); hand(c, k.handR[0], k.handR[1], PI / 2, 0.9);
};
// two ends against the wall 3 metres apart, water at the same height in both
const e2s1 = (c: Ctx) => {
  const F = 940; room(c, F);
  const L = 300, R = 780, lev = 470, top = 330, w = 22;
  tube(c, [[L, top], [L, 600], [L, 760], [L + 20, 880], [L + 160, 905], [540, 905], [R - 160, 905], [R - 20, 880], [R, 760], [R, 600], [R, top]], w, PINK);
  tubeAir(c, L, top, lev, w); tubeAir(c, R, top, lev, w);
  dashed(c, [[L + 30, lev], [R - 30, lev]], 4, RED, 16);
  kid(c, 190, F, 560, { reachR: [L, 520], armL: [PI * 0.55, PI * 0.5] });
  grown(c, 890, F, 780, { reachL: [R, 600], armR: [PI * 0.45, PI * 0.5] });
};
// the child marks the water level on masking tape with a pencil
const e2s2 = (c: Ctx) => {
  const F = 940; room(c, F);
  const X = 620, lev = 500, w = 22;
  tube(c, [[X, 200], [X, 500], [X, 760], [X + 30, 880], [X + 160, 905], [X + 330, 905], [D + 40, 905]], w, PINK);
  tubeAir(c, X, 200, lev, w);
  tape(c, X, 262, 70, 30, 0, 1); tape(c, X - 60, lev, 50, 170, 0, 1);
  line(c, [[X - 82, lev], [X - 38, lev]], 5);
  const k = kid(c, 300, F, 620, { reachR: [455, 525], armL: [PI * 0.56, PI * 0.5] });
  pencil(c, k.handR[0], k.handR[1], X - 40, lev, 13);
};
// measuring the height of each mark from the floor
const e2s3 = (c: Ctx) => {
  const F = 940; room(c, F);
  const lev = 480;
  for (const x of [220, 900]) { tape(c, x, lev, 50, 170, 0, 1); line(c, [[x - 22, lev], [x + 22, lev]], 5); }
  dashed(c, [[270, lev], [850, lev]], 4, RED, 16);
  tapeMeasureUp(c, 160, F, lev - 6, 30);
  kid(c, 340, F, 580, { reachL: [178, 500], armR: [PI * 0.45, PI * 0.5] });
  notebook(c, 620, 900, 200, 80, 0, [["96", "96"]]);
};
// a funnel on one end: the water still stands at the same height
const e2s4 = (c: Ctx) => {
  const F = 940; room(c, F);
  const L = 300, R = 780, lev = 290, w = 22;
  tube(c, [[L, 420], [L, 600], [L, 760], [L + 20, 880], [L + 160, 905], [540, 905], [R - 160, 905], [R - 20, 880], [R, 760], [R, 600], [R, 230]], w, PINK);
  tubeAir(c, R, 230, lev, w);
  funnel(c, L, 428, 300, 230, lev);
  dashed(c, [[L + 60, lev], [R - 30, lev]], 4, RED, 16);
  tape(c, L, 520, 70, 30); tape(c, R, 420, 70, 30);
};

// ---------------------------------------------------------------- a1 Tap Survey
const counterSink = (c: Ctx, x0: number, x1: number, top: number, bx0: number, bx1: number, depth: number) => {
  shape(c, () => rrect(c, x0, top, x1 - x0, 30, 6), COL.steelIn, 6);
  shape(c, () => { c.moveTo(bx0, top + 30); c.bezierCurveTo(bx0 + 10, top + 30 + depth, bx1 - 10, top + 30 + depth, bx1, top + 30); c.closePath(); }, COL.steel, 6);
};
// the kitchen tap fills a one litre bottle while the child holds the timer
const a1s0 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  shape(c, () => rrect(c, 80, 700, 440, 240, 6), COL.wood, 6);
  counterSink(c, 60, 540, 690, 240, 500, 90);
  const tip = tap(c, 330, 692, 1.2);
  bottle(c, tip[0], 775, 90, 225, 0.45, { noShadow: true });
  stream(c, tip[0], tip[1] + 6, 775 - 225 + 10, 12);
  phone(c, 712, 598, 76, 136, (c) => { c.fillStyle = COL.black; c.fillRect(0, 0, D, D); write(c, "12", 684, 580, 40, "#c9f06b", 6); });
  kid(c, 580, F, 600, { reachL: [tip[0] - 40, 650], reachR: [700, 640] });
};
// writing the taps and their times in a table; basin, bucket tap and shower behind
const a1s1 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  // basin on a pedestal
  shape(c, () => rrect(c, 110, 620, 60, 320, 6), WHITE, 6); shape(c, () => { c.moveTo(40, 600); c.lineTo(240, 600); c.bezierCurveTo(230, 680, 50, 680, 40, 600); c.closePath(); }, WHITE, 6); shape(c, () => ell(c, 140, 600, 100, 18), COL.steelIn, 5);
  tap(c, 140, 592, 0.7);
  // a low bucket tap on the wall with a bucket under it
  tube(c, [[560, 560], [560, 640], [600, 640], [600, 668]], 18, COL.steel); shape(c, () => ell(c, 556, 556, 16, 10), COL.red, 4);
  bucket(c, 600, F, 190, 160, 230, null);
  // a shower head
  tube(c, [[900, 130], [900, 230], [940, 250]], 18, COL.steel); shape(c, () => ell(c, 950, 262, 48, 20, 0.25), COL.steel, 6);
  for (let i = 0; i < 4; i++) line(c, [[930 + i * 14, 290], [934 + i * 14, 330]], 4, COL.waterDk);
  const k = kid(c, 380, 1000, 520, { sit: true, dir: 1, reachR: [445, 905], reachL: [300, 915] });
  notebook(c, 365, 920, 150, 100, 0.04, [["12", "20"], ["35", "58"]]);
  pencil(c, k.handR[0], k.handR[1], 405, 918, 12);
};
// cards in order from the fastest tap to the slowest
const a1s2 = (c: Ctx) => {
  ground(c);
  arrow(c, [[150, 330], [930, 330]], RED, 10);
  const times = ["12", "20", "35", "58"];
  for (let i = 0; i < 4; i++) {
    const x = 190 + i * 233; shadow(c, x + 12, 700, 110, 20);
    shape(c, () => rrect(c, x - 100, 420, 200, 270, 12), PAPER, 6);
    write(c, String(i + 1), x - 12, 240, 50, INK, 7);
    if (i === 0) tap(c, x - 30, 560, 0.5);
    else if (i === 1) { shape(c, () => ell(c, x, 560, 60, 12), COL.steelIn, 5); tap(c, x - 20, 555, 0.4); }
    else if (i === 2) { tube(c, [[x - 20, 470], [x - 20, 520], [x + 10, 520], [x + 10, 540]], 12, COL.steel); bucket(c, x + 10, 600, 70, 56, 56, null); }
    else { tube(c, [[x - 30, 450], [x - 30, 500], [x, 510]], 12, COL.steel); shape(c, () => ell(c, x + 8, 520, 30, 12, 0.25), COL.steel, 5); for (let k = 0; k < 3; k++) line(c, [[x - 4 + k * 12, 540], [x - 2 + k * 12, 575]], 3, COL.waterDk); }
    write(c, times[i], x - 36, 620, 46, INK, 6);
  }
};

// ---------------------------------------------------------------- a2 Four Holes, One Squeeze
const ringHoles = (c: Ctx, x: number, y: number, w: number, taped: boolean) => {
  dashed(c, [[x - w / 2, y], [x + w / 2, y]], 3, INK, 10);
  c.save(); c.setLineDash([10, 10]); c.beginPath(); ell(c, x, y, w / 2, w * 0.11); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); c.restore();
  for (const hx of [x - w / 2 + 4, x, x + w / 2 - 4]) { hole(c, hx, y + (hx === x ? w * 0.1 : 0), 8); if (taped) tape(c, hx, y + (hx === x ? w * 0.1 : 0), hx === x ? 70 : 38, 60, 0, 0.86); }
};
// four holes in a ring, each taped
const a2s0 = (c: Ctx) => {
  ground(c); const x = 520, y = 880, w = 250, h = 600;
  bottle(c, x, y, w, h, 0, { cap: true });
  ringHoles(c, x, y - h * 0.25, w, true);
  // the compass point that made the holes
  line(c, [[800, 560], [880, 860]], 16, INK); line(c, [[800, 560], [880, 860]], 8, COL.steel); line(c, [[800, 560], [760, 860]], 16, INK); line(c, [[800, 560], [760, 860]], 8, COL.steel); shape(c, () => ell(c, 800, 548, 22, 22), COL.steelDk, 5); shape(c, () => polyP(c, [[874, 856], [886, 856], [882, 900]]), INK, 0);
};
// filled to the brim, cap tight, held over the sink
const a2s1 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  shape(c, () => rrect(c, 100, 820, 880, 120, 6), COL.wood, 6);
  counterSink(c, 80, 1000, 810, 260, 820, 100);
  const x = 540, y = 740, w = 180, h = 420;
  bottle(c, x, y, w, h, 1, { cap: true, noShadow: true });
  ringHoles(c, x, y - h * 0.25, w, true);
  handR(c, x + w / 2 + 40, 470, 1.7);
};
// squeezed with both hands: four jets in four directions
const squeezeScene = (c: Ctx, x: number, y: number, w: number, h: number, landY: number, far: number) => {
  const ring = y - h * 0.25;
  jetArc(c, x - w / 2 + 6, ring - 6, x - w / 2 - 80, ring - 60, x - far * 0.6, landY - 70, 11); jetArc(c, x + w / 2 - 6, ring - 6, x + w / 2 + 80, ring - 60, x + far * 0.6, landY - 70, 11);
  bottle(c, x, y, w, h, 1, { cap: true, noShadow: true });
  ringHoles(c, x, ring, w, false);
  jet(c, x - w / 2 + 4, ring + 8, x - far, landY, 11); jet(c, x + w / 2 - 4, ring + 8, x + far, landY, 11);
};
const a2s2 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  const k = kid(c, 540, 1150, 760, { reachL: [465, 760], reachR: [615, 760] });
  shape(c, () => rrect(c, 100, 880, 880, 200, 6), COL.wood, 6);
  counterSink(c, 80, 1000, 870, 160, 920, 110);
  squeezeScene(c, 540, 870, 120, 237, 985, 270);
  hand(c, k.handL[0], k.handL[1], 0, 1); handR(c, k.handR[0], k.handR[1], 1);
};

// ---------------------------------------------------------------- a3 Draw the Push
const damPhoto = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.fillStyle = COL.sky; c.fillRect(x, y, w, h);
  shape(c, () => { c.moveTo(x, y + h * 0.42); c.quadraticCurveTo(x + w * 0.3, y + h * 0.2, x + w * 0.6, y + h * 0.4); c.lineTo(x + w, y + h * 0.38); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); }, COL.green, 4);
  c.fillStyle = COL.water; c.fillRect(x, y + h * 0.5, w * 0.5, h * 0.5);
  shape(c, () => polyP(c, [[x + w * 0.5, y + h * 0.46], [x + w * 0.58, y + h * 0.46], [x + w * 0.86, y + h], [x + w * 0.5, y + h]]), COL.grey, 4);
  c.fillStyle = COL.waterDk; c.fillRect(x + w * 0.86, y + h * 0.9, w * 0.14, h * 0.1);
};
// a phone photo of a dam beside a sheet of paper
const a3s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 780, 820, 230, 30); c.save(); c.translate(760, 500); c.rotate(0.06); shape(c, () => rrect(c, -200, -290, 400, 580, 8), PAPER, 6); c.restore();
  pencil(c, 640, 860, 900, 760, 18);
  phone(c, 320, 480, 300, 560, (c) => damPhoto(c, 160, 220, 320, 520));
  hand(c, 320, 880, -PI / 2, 1.5);
};
const sheet = (c: Ctx) => { ground(c); shadow(c, 560, 970, 420, 30); shape(c, () => rrect(c, 120, 110, 840, 850, 10), PAPER, 6); };
const drawnWater = (c: Ctx) => { shape(c, () => { c.moveTo(200, 320); for (let x = 200; x < 640; x += 40) c.quadraticCurveTo(x + 20, 302, x + 40, 320); c.lineTo(640, 860); c.lineTo(200, 860); c.closePath(); }, COL.sky, 5); for (let k = 0; k < 4; k++) line(c, [[230 + k * 20, 380 + k * 120], [330 + k * 20, 380 + k * 120]], 4, COL.waterDk); };
const pushArrows = (c: Ctx) => { for (let i = 0; i < 5; i++) { const y = 360 + i * 110, len = 60 + i * 50; arrow(c, [[640 - len, y], [630, y]], RED, 9); } };
// the drawing: water on the left, a wall on the right, five arrows, longer lower down
const a3s1 = (c: Ctx) => { sheet(c); drawnWater(c); shape(c, () => rrect(c, 640, 220, 70, 640, 4), COL.grey, 6); pushArrows(c); line(c, [[200, 860], [900, 860]], 6); };
// the same drawing with a wall that is thick at the bottom
const a3s2 = (c: Ctx) => { sheet(c); drawnWater(c); shape(c, () => polyP(c, [[640, 220], [710, 220], [900, 860], [640, 860]]), COL.grey, 6); for (let i = 0; i < 5; i++) line(c, [[655 + i * 10, 300 + i * 110], [690 + i * 44, 300 + i * 110]], 3, COL.greyDk); pushArrows(c); line(c, [[200, 860], [960, 860]], 6); };

// ---------------------------------------------------------------- a4 Straw Trouble
// a child drinks from a glass with a straw; juiceUp = the juice has risen to the mouth
const strawScene = (c: Ctx, juiceUp: boolean, holed: boolean) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 6);
  const x = 500, y = 1000, h = 700, mouth: [number, number] = [x + 8, y - 0.769 * h];
  const k = kid(c, x, y, h, { reachR: [640, 640], armL: [PI * 0.56, PI * 0.5] });
  const gx = k.handR[0] + 50, gy = k.handR[1] + 80, gw = 120, gh = 175;
  shape(c, () => polyP(c, [[gx - gw / 2, gy - gh], [gx + gw / 2, gy - gh], [gx + gw * 0.4, gy], [gx - gw * 0.4, gy]]), COL.glass, 5);
  const jl = gy - gh * 0.6; shape(c, () => polyP(c, [[gx - gw * 0.46, jl], [gx + gw * 0.46, jl], [gx + gw * 0.4, gy], [gx - gw * 0.4, gy]]), COL.orange, 0);
  shape(c, () => polyP(c, [[gx - gw / 2, gy - gh], [gx + gw / 2, gy - gh], [gx + gw * 0.4, gy], [gx - gw * 0.4, gy]]), "rgba(214,236,250,0.35)", 5);
  // the straw from the bottom of the glass to the mouth, juice inside it up to where it reaches
  const bot: [number, number] = [gx + 20, gy - 14], top = mouth, t0 = (gy - gh * 0.6 - bot[1]) / (top[1] - bot[1]);
  line(c, [bot, top], 22, INK); line(c, [bot, top], 14, WHITE);
  const upTo = juiceUp ? 0.97 : t0; line(c, [bot, [bot[0] + (top[0] - bot[0]) * upTo, bot[1] + (top[1] - bot[1]) * upTo]], 14, COL.orange);
  if (holed) { const hx = bot[0] + (top[0] - bot[0]) * 0.8, hy = bot[1] + (top[1] - bot[1]) * 0.8; hole(c, hx + 2, hy, 6); for (const [dx, dy] of [[-70, -40], [-70, 30]]) arrow(c, [[hx + dx, hy + dy], [hx - 16, hy + dy * 0.2]], COL.blueDk, 6); }
  hand(c, k.handR[0], k.handR[1], 0, 1);
  shape(c, () => ell(c, mouth[0], mouth[1] + 8, 26, 14), SKIN.childDk, 4);
};
const a4s0 = (c: Ctx) => strawScene(c, true, false);
const a4s1 = (c: Ctx) => { strawScene(c, false, true); zoomRing(c, 220, 300, 130, () => { c.fillStyle = COL.sky; c.fillRect(0, 0, D, D); line(c, [[150, 420], [290, 180]], 40, INK); line(c, [[150, 420], [290, 180]], 28, WHITE); hole(c, 222, 298, 10); arrow(c, [[110, 250], [205, 290]], COL.blueDk, 8); arrow(c, [[120, 340], [205, 310]], COL.blueDk, 8); }); };
// the straw through a lump of clay that seals the bottle mouth
const a4s2 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 920, D, 160); line(c, [[0, 920], [D, 920]], 6);
  const x = 520, y = 900, w = 230, h = 560;
  bottle(c, x, y, w, h, 0.62, { liquid: COL.orange });
  line(c, [[x + 10, y - 60], [x + 60, y - h - 130]], 22, INK); line(c, [[x + 10, y - 60], [x + 60, y - h - 130]], 14, WHITE);
  line(c, [[x + 10, y - 60], [x + 10 + 50 * ((h * 0.62 - 60) / (h + 70)), y - h * 0.62]], 14, COL.orange);
  const clay = () => { c.moveTo(x - 90, y - h + 24); c.bezierCurveTo(x - 110, y - h - 60, x - 20, y - h - 70, x + 10, y - h - 50); c.bezierCurveTo(x + 50, y - h - 72, x + 110, y - h - 40, x + 90, y - h + 24); c.closePath(); };
  shape(c, clay, COL.brown, 6); shade(c, clay, COL.soilDk, -30, -14, 0.4);
  line(c, [[x + 44, y - h - 50], [x + 60, y - h - 130]], 22, INK); line(c, [[x + 44, y - h - 50], [x + 60, y - h - 130]], 14, WHITE);
};

// ---------------------------------------------------------------- p1 The Syringe Arm
// two syringes joined by a tube of coloured water: push one in and the other comes out
const p1s0 = (c: Ctx) => {
  ground(c);
  tube(c, [[430, 540], [460, 540], [490, 700], [505, 740], [520, 700], [550, 540], [580, 540]], 18, PINK);
  syringe(c, 150, 540, 280, 0, 0.1, 40); syringe(c, 860, 540, 280, PI, 0.9, 40);
  arrow(c, [[40, 540], [118, 540]], RED, 12); arrow(c, [[950, 450], [1030, 450]], RED, 12);
};
const armRig = (c: Ctx, lift: number, cup: boolean) => {
  const F = 760, hinge: [number, number] = [320, 510], armLen = 480, a = -lift;
  shape(c, () => rrect(c, 120, F, 840, 44, 6), COL.brown, 6); shade(c, () => rrect(c, 120, F, 840, 44, 6), COL.soilDk, 0, -18, 0.4);
  shape(c, () => rrect(c, 300, hinge[1], 40, F - hinge[1], 4), "#c99a5e", 6);
  shape(c, () => rrect(c, 520, 700, 80, 60, 4), "#c99a5e", 6);
  // lift syringe standing on the block, tip down; its rod meets the arm underneath
  const flangeY = 530, underY = hinge[1] - (560 - hinge[0]) * Math.tan(lift) + 18 / Math.cos(lift), out = Math.min(1, Math.max(0.02, (flangeY - underY) / (0.78 * 160)));
  syringe(c, 560, flangeY, 160, PI / 2, out, 26);
  tube(c, [[560, 714], [575, 740], [630, 752], [690, 727]], 14, PINK);
  syringe(c, 900, 727, 200, PI, lift > 0 ? 0.1 : 0.7, 26);
  tape(c, 560, 690, 90, 24); tape(c, 800, 727, 26, 70);
  // the arm, hinged at the post top
  c.save(); c.translate(hinge[0], hinge[1]); c.rotate(a);
  shape(c, () => rrect(c, -30, -18, armLen + 30, 36, 8), "#c99a5e", 6);
  if (cup) { line(c, [[armLen - 20, 18], [armLen - 20, 170]], 4); paperCup(c, armLen - 20, 170, 90, 100); }
  c.restore();
  shape(c, () => ell(c, hinge[0], hinge[1], 16, 16), COL.yellow, 5);
  return { control: [900 + 0.78 * 200 * (lift > 0 ? 0.1 : 0.7) + 200 * 0.1 - 200 * 0.1, 727] as [number, number], tip: [hinge[0] + armLen * Math.cos(a), hinge[1] + armLen * Math.sin(a)] as [number, number] };
};
// the cardboard arm with its hinge and the two syringes, before the push
const p1s1 = (c: Ctx) => { ground(c); armRig(c, 0, false); };
// the push lifts the arm and the paper cup
const p1s2 = (c: Ctx) => { ground(c); armRig(c, 0.35, true); handR(c, 1000, 727, 0.7, SKIN.child, CLOTH.child, true); arrow(c, [[1040, 650], [950, 650]], RED, 9); };

// ---------------------------------------------------------------- g1 Where Is the Push Bigger?
const tableTop = (c: Ctx) => { ground(c, COL.wood); c.globalAlpha = 0.35; for (let y = 60; y < D; y += 140) line(c, [[0, y], [D, y]], 3, COL.woodDk); c.globalAlpha = 1; };
// the pile of cards and three vote tokens for each player
const g1s0 = (c: Ctx) => {
  tableTop(c);
  for (let i = 4; i >= 0; i--) gameCard(c, 540 + i * 4, 500 + i * 5, 260, 180, 0.03 * (i % 2 ? 1 : -1), i ? "down" : "front");
  const sets: [number, number, boolean][] = [[540, 900, true], [130, 500, false], [950, 500, false]];
  sets.forEach(([x, y, horiz]) => (["A", "B", "="] as const).forEach((f, j) => token(c, horiz ? x + (j - 1) * 150 : x, horiz ? y : y + (j - 1) * 150, 52, f)));
};
// the reader reads a card aloud while the others put a token face down
const g1s1 = (c: Ctx) => {
  room(c, 980);
  const k = kid(c, 540, 1010, 660, { reachL: [470, 660], reachR: [610, 660] });
  shape(c, () => rrect(c, 60, 700, 960, 40, 6), COL.wood, 6); shape(c, () => rrect(c, 80, 740, 920, 180, 4), COL.woodDk, 6);
  gameCard(c, 540, 645, 130, 90, 0, "front");
  hand(c, k.handL[0], k.handL[1], 0, 0.7); handR(c, k.handR[0], k.handR[1], 0.7);
  // speech: A, B or ?
  shape(c, () => { c.moveTo(640, 420); c.lineTo(660, 380); rrect(c, 650, 300, 250, 110, 24); }, WHITE, 5);
  letter(c, "A", 680, 320, 70, COL.blueDk, 7); letter(c, "B", 750, 320, 70, COL.orange, 7); letter(c, "?", 830, 320, 70, INK, 7);
  token(c, 300, 712, 40, null); token(c, 780, 712, 40, null);
  hand(c, 232, 702, 0.15, 1, SKIN.adult, CLOTH.adult); handR(c, 850, 712, 1);
};
// tokens turned over, the card turned to its answer, a point given
const g1s2 = (c: Ctx) => {
  tableTop(c);
  gameCard(c, 540, 400, 300, 200, 0.02, "back");
  token(c, 300, 760, 56, "B"); token(c, 540, 790, 56, "B"); token(c, 780, 760, 56, "A");
  shape(c, () => ell(c, 300, 920, 28, 28), COL.yellow, 5); write(c, "+1", 345, 896, 46, RED, 6);
  shape(c, () => ell(c, 540, 950, 28, 28), COL.yellow, 5); write(c, "+1", 585, 926, 46, RED, 6);
  hand(c, 236, 877, 0.6, 1.1, SKIN.adult, CLOTH.adult);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the child sits on the floor and watches the three jets land
const fE1 = (c: Ctx) => {
  const F = 940; room(c, F, true);
  jetsScene(c, 170, 540, 170, 400, 210, 100, 270, F, [56, 49, 37], [330, 470]);
  kid(c, 920, F + 20, 480, { sit: true, dir: -1, reachL: [825, 900], reachR: [1015, 900] });
};
// flow.e2: the long hose taped to the wall, its two ends and the level line, a tape measure at each end
const fE2 = (c: Ctx) => {
  const F = 940; room(c, F);
  const L = 220, R = 860, lev = 420, top = 260, w = 22;
  tube(c, [[L, top], [L, 600], [L, 760], [L + 20, 880], [L + 160, 905], [540, 905], [R - 160, 905], [R - 20, 880], [R, 760], [R, 600], [R, top]], w, PINK);
  tubeAir(c, L, top, lev, w); tubeAir(c, R, top, lev, w);
  for (const x of [L, R]) { tape(c, x, 320, 70, 30); tape(c, x, 700, 70, 30); tape(c, x + 60, lev, 50, 170); line(c, [[x + 38, lev], [x + 82, lev]], 5); }
  dashed(c, [[L + 100, lev], [R - 10, lev]], 4, RED, 16);
  tapeMeasureUp(c, L - 60, F, lev - 6, 30); tapeMeasureUp(c, R + 130, F, lev - 6, 30);
};
// flow.a1: the roof tank, a thin stream upstairs and a strong one downstairs
const fA1 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  shape(c, () => rrect(c, 200, 270, 680, 630, 4), "#f6ead3", 6);
  line(c, [[200, 590], [880, 590]], 6); shape(c, () => rrect(c, 180, 250, 720, 24, 4), COL.grey, 5);
  // the black tank on the roof and its pipe down the right side
  shape(c, () => rrect(c, 420, 110, 240, 140, 16), COL.black, 6); shape(c, () => ell(c, 540, 112, 120, 18), "#55505c", 5);
  tube(c, [[660, 200], [840, 200], [840, 350], [840, 860]], 14, COL.steel);
  for (const [fy, strong] of [[590, false], [900, true]] as [number, boolean][]) {
    const ty = fy - 110; tube(c, [[840, ty - 40], [770, ty - 40], [770, ty], [720, ty], [720, ty + 30]], 14, COL.steel); shape(c, () => ell(c, 770, ty - 56, 16, 10), COL.red, 4);
    bottle(c, 720, fy - 6, 70, 170, strong ? 0.8 : 0.25);
    line(c, [[720, ty + 34], [720, fy - 170]], strong ? 22 : 10, INK); line(c, [[720, ty + 34], [720, fy - 170]], strong ? 14 : 4, COL.waterDk);
  }
  kid(c, 560, 894, 330, { reachR: [628, 730], armL: [PI * 0.56, PI * 0.5] });
  phone(c, 640, 706, 44, 78, (c) => { c.fillStyle = COL.black; c.fillRect(0, 0, D, D); write(c, "12", 625, 695, 22, "#c9f06b", 4); });
  kid(c, 560, 584, 330, { armL: [PI * 0.56, PI * 0.5], armR: [PI * 0.44, PI * 0.5] });
};
// flow.a2: a squeezed bottle on newspaper makes a ring of wet spots
const fA2 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 6);
  shape(c, () => polyP(c, [[200, 680], [880, 680], [1000, 980], [80, 980]]), NEWS, 5);
  for (const [x, y] of [[270, 900], [810, 900], [378, 830], [702, 830]]) wetSpot(c, x, y, 44);
  squeezeScene(c, 540, 830, 150, 330, 900, 270);
  handR(c, 660, 630, 1.2);
};
// flow.a3: a real dam, thick at the bottom, water held behind it
const fA3 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => { c.moveTo(0, 420); c.quadraticCurveTo(200, 250, 420, 380); c.quadraticCurveTo(700, 240, 1080, 400); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, COL.green, 6);
  shape(c, () => { c.moveTo(0, 440); c.lineTo(560, 440); c.lineTo(560, 940); c.lineTo(0, 940); c.closePath(); }, COL.water, 5);
  for (let k = 0; k < 5; k++) line(c, [[60 + k * 90, 500 + k * 70], [140 + k * 90, 500 + k * 70]], 4, COL.drop);
  shape(c, () => polyP(c, [[540, 400], [640, 400], [900, 940], [540, 940]]), COL.grey, 6); shade(c, () => polyP(c, [[540, 400], [640, 400], [900, 940], [540, 940]]), COL.greyDk, -60, 0, 0.4);
  shape(c, () => rrect(c, 530, 380, 120, 24, 4), COL.steelIn, 5);
  shape(c, () => { c.moveTo(900, 940); c.lineTo(1080, 940); c.lineTo(1080, 1000); c.lineTo(880, 1000); c.closePath(); }, COL.water, 5);
  c.fillStyle = COL.leafDk; c.fillRect(0, 940, D, 140); line(c, [[0, 940], [D, 940]], 6);
  for (const x of [200, 300, 980]) { line(c, [[x, 1000], [x, 950]], 8); shape(c, () => ell(c, x, 930, 30, 40), COL.leaf, 5); }
};
// flow.a4: the air pushes down on the juice and sends it up the straw
const fA4 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const gx = 500, gy = 880, gw = 320, gh = 440, jl = gy - gh * 0.58;
  shape(c, () => polyP(c, [[gx - gw / 2, gy - gh], [gx + gw / 2, gy - gh], [gx + gw * 0.4, gy], [gx - gw * 0.4, gy]]), COL.glass, 5);
  shape(c, () => polyP(c, [[gx - gw * 0.47, jl], [gx + gw * 0.47, jl], [gx + gw * 0.4, gy], [gx - gw * 0.4, gy]]), COL.orange, 0);
  shape(c, () => polyP(c, [[gx - gw / 2, gy - gh], [gx + gw / 2, gy - gh], [gx + gw * 0.4, gy], [gx - gw * 0.4, gy]]), "rgba(214,236,250,0.35)", 5);
  const bot: [number, number] = [gx + 60, gy - 20], top: [number, number] = [gx + 190, 200];
  line(c, [bot, top], 34, INK); line(c, [bot, top], 24, WHITE); line(c, [bot, [bot[0] + (top[0] - bot[0]) * 0.86, bot[1] + (top[1] - bot[1]) * 0.86]], 24, COL.orange);
  for (const x of [gx - 110, gx - 50, gx + 10]) arrow(c, [[x, jl - 130], [x, jl - 30]], COL.blueDk, 9);
  arrow(c, [[top[0] + 40, 520], [top[0] + 70, 250]], RED, 9);
};
// flow.p1: the finished arm lifts the cup when the plunger is pushed
const fP1 = (c: Ctx) => { ground(c); const r = armRig(c, 0.35, true); arrow(c, [[1040, 727], [960, 727]], RED, 12); arrow(c, [[r.tip[0] + 60, r.tip[1] + 180], [r.tip[0] + 60, r.tip[1] + 20]], RED, 9); };
// term Jet: one hole, one thin stream arching out
const tJet = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  bottle(c, 380, 900, 230, 600, 0.82); hole(c, 495, 620, 8); jet(c, 495, 620, 900, 896, 12);
};
// term Depth: a coin at the bottom of a bucket, a ruler from the surface down to it
const tDepth = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 920, D, 160); line(c, [[0, 920], [D, 920]], 6);
  const x = 520, y = 920, wT = 520, wB = 420, h = 440, lev = y - h + 40;
  const body = () => polyP(c, [[x - wT / 2, y - h], [x + wT / 2, y - h], [x + wB / 2, y], [x - wB / 2, y]]);
  shape(c, body, COL.glass, 6);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.75; c.fillRect(0, lev, D, h); c.globalAlpha = 1; c.restore();
  shape(c, () => ell(c, x, lev, wT / 2 - 10, 20), COL.drop, 4);
  shape(c, () => ell(c, x + 40, y - 14, 46, 14), COL.yellow, 5); shape(c, () => ell(c, x + 40, y - 14, 30, 8), COL.orange, 3);
  shape(c, () => rrect(c, x - 180, lev - 40, 44, y - 6 - (lev - 40), 4), COL.wood, 5);
  for (let i = 0; i <= 30; i++) { const yy = y - 6 - i * ((y - 6 - lev) / 30); line(c, [[x - 180, yy], [x - 180 + (i % 10 === 0 ? 24 : 12), yy]], 2); }
  arrow(c, [[x + 160, lev + 10], [x + 160, y - 30]], RED, 8); arrow(c, [[x + 160, y - 30], [x + 160, lev + 10]], RED, 8);
  write(c, "30 cm", x + 190, y - h / 2 - 20, 44, INK, 6);
};
// term Siphon: a tube over the rim of a drum carries water down to a bucket on the floor
const tSiphon = (c: Ctx) => {
  const F = 940; room(c, F);
  shape(c, () => rrect(c, 120, 560, 440, 28, 6), COL.wood, 6); for (const lx of [160, 520]) { line(c, [[lx, 588], [lx, F]], 26, INK); line(c, [[lx, 588], [lx, F]], 14, COL.woodDk); }
  const drum = () => rrect(c, 210, 220, 260, 340, 18); shape(c, drum, COL.blue); shade(c, drum, COL.blueDk, -40, 0);
  c.save(); c.beginPath(); drum(); c.clip(); c.fillStyle = COL.water; c.globalAlpha = 0.9; c.fillRect(210, 280, 260, 300); c.globalAlpha = 1; c.restore();
  shape(c, () => ell(c, 340, 220, 130, 26), COL.water, 6);
  bucket(c, 820, F, 260, 210, 260, COL.water);
  tube(c, [[300, 520], [300, 300], [320, 190], [460, 170], [560, 230], [700, 500], [790, 700]], 20, COL.waterDk);
  arrow(c, [[300, 470], [300, 330]], RED, 7); arrow(c, [[600, 320], [690, 500]], RED, 7);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 795 + i * 4, 720 + i * 16, 7, 10), COL.waterDk, 3);
};

export const ic_statesLiquidsUpCloseL4 = cards("sci.states.liquids-up-close.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4,
  e2s0, e2s1, e2s2, e2s3, e2s4,
  a1s0, a1s1, a1s2,
  a2s0, a2s1, a2s2,
  a3s0, a3s1, a3s2,
  a4s0, a4s1, a4s2,
  p1s0, p1s1, p1s2,
  g1s0, g1s1, g1s2,
  fE1, fE2, fA1, fA2, fA3, fA4, fP1, tJet, tDepth, tSiphon,
]);
