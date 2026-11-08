import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, write, hand, person, cards } from "./flatKit";

// DAY AND NIGHT L4 · why the Sun reaches Guwahati before Mumbai. Set-up cards for the Five Noons
// experiment (e2), the Orange Earth (e1) and the Extra Turn (a1), then the card pictures.
// Five cities (longitude east, Sun's noon on the IST clock): Guwahati 91.7 11:23, Kolkata 88.4 11:36,
// Chennai 80.3 12:09, Kochi 76.3 12:25, Mumbai 72.9 12:38. 4 minutes for every degree.

const NIGHT = "#1f2a52", NIGHT2 = "#2d3b74", FLOOR = "#d9c8a8", WALL = "#f7f1e3", ORANGE = "#f5962e", ORANGE_DK = "#d4731c", MARKER = "#3f6fb3";

// ---------------------------------------------------------------- small shared things
const sun = (c: Ctx, x: number, y: number, r: number, rays = true) => {
  if (rays) for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], Math.max(5, r * 0.09), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.2, 0.45);
};
// a five-pointed star
const star5 = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow, ln = 4) => shape(c, () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; if (i) c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, col, ln);
// small stars scattered in a night sky, kept out of a box if given
const skyStars = (c: Ctx, n: number, seed: number, yMax: number, avoid?: [number, number, number, number]) => {
  let s = seed >>> 0; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < n; i++) { const x = 30 + r() * (D - 60), y = 30 + r() * (yMax - 60); if (avoid && x > avoid[0] && x < avoid[2] && y > avoid[1] && y < avoid[3]) continue; shape(c, () => ell(c, x, y, 4 + r() * 4, 4 + r() * 4), WHITE, 0); }
};
// letters N and S for the poles (write() has only numbers)
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 5) => {
  const P: Record<string, number[][][]> = { N: [[[0, 1], [0, 0], [0.7, 1], [0.7, 0]]], S: [[[0.65, 0.1], [0.35, 0], [0.05, 0.2], [0.35, 0.5], [0.65, 0.8], [0.35, 1], [0.02, 0.9]]] };
  (P[ch] ?? []).forEach((st) => line(c, st.map(([u, v]) => [x + u * h, y + v * h]), w, col));
};
// a clock time like "11:23": digits with two dots between
const timeText = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  const [hh, mm] = t.split(":"); write(c, hh, x, y, h, col, w); const cx = x + hh.length * h * 0.8;
  shape(c, () => ell(c, cx + h * 0.12, y + h * 0.3, w * 0.55, w * 0.55), col, 0); shape(c, () => ell(c, cx + h * 0.12, y + h * 0.72, w * 0.55, w * 0.55), col, 0);
  write(c, mm, cx + h * 0.38, y, h, col, w);
};
// a round clock face showing hh:mm
const clock = (c: Ctx, x: number, y: number, r: number, hh: number, mm: number, glow = false) => {
  if (glow) { c.beginPath(); ell(c, x, y, r * 1.4, r * 1.4); c.fillStyle = "rgba(255,211,77,0.5)"; c.fill(); }
  shadow(c, x + r * 0.1, y + r * 0.12, r, r);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, big = i % 3 === 0; line(c, [[x + Math.cos(a) * r * (big ? 0.72 : 0.8), y + Math.sin(a) * r * (big ? 0.72 : 0.8)], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], big ? 5 : 3); }
  const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = mm / 60 * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5]], 8); line(c, [[x, y], [x + Math.cos(ma) * r * 0.74, y + Math.sin(ma) * r * 0.74]], 6, RED);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
// an orange, centre (x, y), radius r; the stem dimple at the top is the North Pole
const orange = (c: Ctx, x: number, y: number, r: number, withShadow = true) => {
  if (withShadow) shadow(c, x + r * 0.12, y + r * 0.98, r * 0.9, r * 0.16);
  shape(c, () => ell(c, x, y, r, r), ORANGE); shade(c, () => ell(c, x, y, r, r), ORANGE_DK, r * 0.28, r * 0.22, 0.5);
  let s = 5; const rd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 40; i++) { const a = rd() * Math.PI * 2, d = Math.sqrt(rd()) * r * 0.9; shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.025, r * 0.025), ORANGE_DK, 0); }
  shape(c, () => ell(c, x, y - r * 0.9, r * 0.13, r * 0.06), ORANGE_DK, 4);
};
// a latitude ring drawn on the orange with a marker: the front arc, and for high rings the back too
const ring = (c: Ctx, x: number, y: number, r: number, latDeg: number, col: string = MARKER, w = 8) => {
  const lat = latDeg * Math.PI / 180, cy = y - r * Math.sin(lat) * 0.96, rx = r * Math.cos(lat), ry = rx * 0.27;
  if (latDeg > 45) { c.beginPath(); c.ellipse(x, cy, rx, ry, 0, Math.PI, Math.PI * 2); c.strokeStyle = col; c.lineWidth = w * 0.7; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); c.ellipse(x, cy, rx, ry, 0, 0, Math.PI); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
  return { cy, rx, ry };
};
const poleDot = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y - r * 0.9, r * 0.07, r * 0.05), RED, 3); letter(c, "N", x + r * 0.16, y - r * 1.02, r * 0.16, INK, 6); };
// a red thread: dark edge, red middle
const thread = (c: Ctx, pts: number[][], w = 6) => { line(c, pts, w + 4, INK); line(c, pts, w, COL.red); };
// a wooden ruler lying flat, its 0 at (x, y), cm marks every cmPx along +x; numbers every `every` cm
const rulerH = (c: Ctx, x: number, y: number, cm: number, cmPx: number, every = 1, h = 90) => {
  const x0 = x - cmPx * 0.6, w = cmPx * (cm + 1.2);
  shadow(c, x0 + w / 2 + 12, y + h + 6, w / 2, 14);
  shape(c, () => polyP(c, [[x0, y], [x0 + w, y], [x0 + w, y + h], [x0, y + h]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x0 + 3, y + h - 16, w - 6, 13);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cm * 10; mm++) { const px = x + mm * cmPx / 10, th = mm % 10 === 0 ? h * 0.36 : mm % 5 === 0 ? h * 0.25 : h * 0.14; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(px, y); c.lineTo(px, y + th); c.stroke(); }
  for (let k = 0; k <= cm; k += every) write(c, String(k), x + k * cmPx - (String(k).length * 13), y + h * 0.42, h * 0.32, INK, 5);
};
// the same ruler standing up: 0 at (x, y), marks going down
const rulerV = (c: Ctx, x: number, y: number, cm: number, cmPx: number, w = 90) => {
  const y0 = y - cmPx * 0.6, h = cmPx * (cm + 1.2);
  shadow(c, x + w / 2 + 14, y0 + h + 4, w / 2, 12);
  shape(c, () => polyP(c, [[x, y0], [x + w, y0], [x + w, y0 + h], [x, y0 + h]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + w - 16, y0 + 3, 13, h - 6);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cm * 10; mm++) { const py = y + mm * cmPx / 10, th = mm % 10 === 0 ? w * 0.36 : mm % 5 === 0 ? w * 0.25 : w * 0.14; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, py); c.lineTo(x + th, py); c.stroke(); }
  for (let k = 0; k <= cm; k++) write(c, String(k), x + w * 0.42, y + k * cmPx - 12, w * 0.3, INK, 5);
};
// a phone held upright, top-left corner (x, y); returns the screen box
const phone = (c: Ctx, x: number, y: number, w: number, h: number, screen: string = COL.sky) => {
  shadow(c, x + w / 2 + 14, y + h + 6, w * 0.5, 14);
  shape(c, () => rrect(c, x, y, w, h, w * 0.12), COL.black);
  shape(c, () => rrect(c, x + w * 0.06, y + w * 0.12, w * 0.88, h - w * 0.24, w * 0.05), screen, 4);
  return { sx: x + w * 0.06, sy: y + w * 0.12, sw: w * 0.88, sh: h - w * 0.24 };
};
// a spiral notebook, top-left (x, y)
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, ruled = true) => {
  shadow(c, x + w / 2 + 14, y + h + 8, w * 0.5, 14);
  shape(c, () => rrect(c, x, y, w, h, 18), COL.paper);
  if (ruled) { c.strokeStyle = COL.sky; c.lineWidth = 3; for (let ly = y + 90; ly < y + h - 30; ly += 56) { c.beginPath(); c.moveTo(x + 50, ly); c.lineTo(x + w - 30, ly); c.stroke(); } }
  for (let i = 0; i < Math.floor((h - 40) / 80); i++) { const ry = y + 60 + i * 80; shape(c, () => rrect(c, x - 14, ry - 8, 44, 16, 8), COL.steel, 4); }
};
// a half sun on a horizon line with an arrow: up = sunrise, down = sunset
const sunIcon = (c: Ctx, x: number, y: number, r: number, up: boolean) => {
  c.save(); c.beginPath(); c.rect(x - r * 2, y - r * 2, r * 4, r * 2); c.clip(); sun(c, x, y, r); c.restore();
  line(c, [[x - r * 1.9, y], [x + r * 1.9, y]], 6);
  arrow(c, up ? [[x + r * 2.5, y + r * 0.6], [x + r * 2.5, y - r * 1.2]] : [[x + r * 2.5, y - r * 1.2], [x + r * 2.5, y + r * 0.6]], RED, 7);
};
// India's outline (longitude, latitude), simplified; india() draws it and returns the map projection
const INDIA = [[74, 36], [78, 35.5], [80, 33], [79, 31], [81, 30], [84, 28.5], [88, 27.5], [89, 26.8], [92, 27.5], [95, 29], [97, 28.5], [97, 27], [95.5, 26], [94.5, 24.5], [93, 23], [92.3, 22.5], [92.5, 24.5], [91.5, 25], [89.8, 26], [88.3, 26.4], [88.5, 25], [88, 24], [89, 22], [88, 21.5], [87, 21], [86.5, 20], [85, 19.5], [84, 18.5], [82.5, 17.5], [81, 16], [80.3, 15.5], [80.2, 13], [79.8, 11], [79.8, 10], [78.2, 8.9], [77.5, 8.1], [76.5, 9], [76, 10.5], [75.5, 11.5], [74.5, 13], [73.8, 15.5], [73.3, 17], [72.8, 19], [72.9, 20.5], [72.6, 21.6], [72, 21], [70.5, 20.8], [69, 22.4], [68.5, 23.5], [70, 23.8], [70.5, 25.5], [71, 27.5], [73.8, 29.5], [74.5, 31], [74.5, 32.5], [74, 34]];
const india = (c: Ctx, ox: number, oy: number, k: number, fill: string = COL.greenLt, ysq = 1) => {
  const P = ([lo, la]: number[]): [number, number] => [ox + (lo - 68) * k, oy + (37 - la) * k * ysq];
  c.save(); c.translate(14, 14); c.beginPath(); polyP(c, INDIA.map(P)); c.fillStyle = SH; c.fill(); c.restore();
  shape(c, () => polyP(c, INDIA.map(P)), fill, 6);
  return P;
};
const CITIES: [string, number, number, string][] = [["Guwahati", 91.7, 26.1, "11:23"], ["Kolkata", 88.4, 22.6, "11:36"], ["Chennai", 80.3, 13.1, "12:09"], ["Kochi", 76.3, 10.0, "12:25"], ["Mumbai", 72.9, 19.1, "12:38"]];
// a torch held at (hx, hy) pointing along an: the hand holds the body a third of the way from the back
const torch = (c: Ctx, hx: number, hy: number, an: number, L = 180) => {
  c.save(); c.translate(hx, hy); c.rotate(an);
  shape(c, () => rrect(c, -L * 0.35, -24, L * 0.78, 48, 14), COL.teal); shade(c, () => rrect(c, -L * 0.35, -24, L * 0.78, 48, 14), COL.tealDk, 0, 14, 0.5);
  shape(c, () => polyP(c, [[L * 0.4, -26], [L * 0.65, -42], [L * 0.65, 42], [L * 0.4, 26]]), COL.steel);
  shape(c, () => ell(c, L * 0.65, 0, 9, 42), COL.yellow, 4);
  c.restore();
};
// fingers wrapped over a held handle at the hand point
const grip = (c: Ctx, x: number, y: number, an: number, skin: string = SKIN.child) => { shape(c, () => ell(c, x, y, 20, 30, an), skin, 5); line(c, [[x - Math.sin(an) * 14, y + Math.cos(an) * 14], [x - Math.sin(an) * 14 + Math.cos(an) * 12, y + Math.cos(an) * 14 + Math.sin(an) * 12]], 3, SKIN.childDk); };
// a child seen from above (for the plan views of the Extra Turn): shoulders, hair, face at the front, facing angle an
const childTop = (c: Ctx, x: number, y: number, r: number, an: number) => {
  const fx = Math.cos(an), fy = Math.sin(an);
  shadow(c, x + 8, y + 10, r * 1.9, r * 1.3);
  shape(c, () => ell(c, x, y, r * 1.9, r * 1.05, an + Math.PI / 2), CLOTH.child); shade(c, () => ell(c, x, y, r * 1.9, r * 1.05, an + Math.PI / 2), CLOTH.childDk, r * 0.2, r * 0.2, 0.5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x - fy * s * r * 1.75 + fx * r * 0.45, y + fx * s * r * 1.75 + fy * r * 0.45, r * 0.36, r * 0.36), SKIN.child, 4);
  shape(c, () => ell(c, x + fx * r * 0.8, y + fy * r * 0.8, r * 0.62, r * 0.42, an), SKIN.child, 4);
  shape(c, () => ell(c, x + fx * r * 0.1, y + fy * r * 0.1, r, r), CLOTH.hair, 5);
  shape(c, () => ell(c, x + fx * r * 0.85, y + fy * r * 0.85, r * 0.28, r * 0.28), SKIN.child, 4);
};
// a coin lying on the floor
const coin = (c: Ctx, x: number, y: number, r = 26) => { shape(c, () => ell(c, x, y, r, r * 0.45), COL.yellow, 4); shape(c, () => ell(c, x, y, r * 0.6, r * 0.25), COL.woodDk, 3); };
const stickyStar = (c: Ctx, x: number, y: number, s: number) => { shadow(c, x + s * 0.08, y + s * 0.1, s * 0.5, s * 0.5); shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 6), COL.yellow, 5); star5(c, x, y, s * 0.3, COL.orange, 4); };
// the room of the Extra Turn, seen from above: wall band with the star at the top, floor, lamp on its table in the middle, eight marks
const planRoom = (c: Ctx) => {
  ground(c, FLOOR); c.fillStyle = WALL; c.fillRect(0, 0, D, 150); line(c, [[0, 150], [D, 150]], 6);
  stickyStar(c, 540, 78, 100);
};
const planMarks = (cx: number, cy: number, r: number) => Array.from({ length: 8 }, (_, i) => { const a = Math.PI / 2 + i * Math.PI / 4; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
const planLamp = (c: Ctx, x: number, y: number) => {
  c.beginPath(); ell(c, x, y, 130, 130); c.fillStyle = "rgba(255,211,77,0.35)"; c.fill();
  shape(c, () => rrect(c, x - 70, y - 70, 140, 140, 18), COL.brown); shade(c, () => rrect(c, x - 70, y - 70, 140, 140, 18), COL.soilDk, 12, 12, 0.4);
  shape(c, () => ell(c, x, y, 46, 46), COL.steel); shape(c, () => ell(c, x, y, 32, 32), COL.yellow, 4);
};
// the night sky with a balcony rail in front
const balconyNight = (c: Ctx, railY: number) => {
  ground(c, NIGHT); c.fillStyle = NIGHT2; c.fillRect(0, railY - 40, D, D);
};
const rail = (c: Ctx, y: number) => {
  for (let x = 60; x < D; x += 110) { line(c, [[x, y], [x, y + 220]], 22, INK); line(c, [[x, y], [x, y + 220]], 12, COL.steelDk); }
  shape(c, () => rrect(c, 0, y - 18, D, 36, 8), COL.steel, 6); line(c, [[0, y + 225], [D, y + 225]], 8, INK);
};
// a bat with scalloped wings, body centre (x, y), wingspan w
const bat = (c: Ctx, x: number, y: number, w: number) => {
  const body = () => { c.moveTo(x, y - w * 0.07); for (const s of [-1, 1]) { c.moveTo(x, y - w * 0.07); c.quadraticCurveTo(x + s * w * 0.2, y - w * 0.3, x + s * w * 0.5, y - w * 0.22); c.quadraticCurveTo(x + s * w * 0.42, y - w * 0.02, x + s * w * 0.36, y + w * 0.08); c.quadraticCurveTo(x + s * w * 0.28, y - w * 0.02, x + s * w * 0.2, y + w * 0.1); c.quadraticCurveTo(x + s * w * 0.12, y + w * 0.02, x, y + w * 0.14); c.closePath(); } };
  shape(c, body, "#4a3f63", 6);
  shape(c, () => ell(c, x, y, w * 0.07, w * 0.13), "#5c5078", 5);
  shape(c, () => ell(c, x, y - w * 0.13, w * 0.06, w * 0.06), "#5c5078", 5);
  for (const s of [-1, 1]) { shape(c, () => polyP(c, [[x + s * w * 0.02, y - w * 0.16], [x + s * w * 0.05, y - w * 0.27], [x + s * w * 0.08, y - w * 0.16]]), "#5c5078", 4); shape(c, () => ell(c, x + s * w * 0.025, y - w * 0.135, w * 0.012, w * 0.012), COL.yellow, 0); }
};
const gecko = (c: Ctx, x: number, y: number, s: number) => {
  const col = "#d9d2a8";
  for (const [lx, ly, a] of [[-0.55, -0.3, -2.3], [0.55, -0.3, -0.8], [-0.5, 0.35, 2.4], [0.5, 0.35, 0.7]]) line(c, [[x + lx * s * 0.5, y + ly * s], [x + lx * s, y + ly * s + Math.sin(a) * s * 0.25]], s * 0.13, INK), line(c, [[x + lx * s * 0.5, y + ly * s], [x + lx * s, y + ly * s + Math.sin(a) * s * 0.25]], s * 0.07, col);
  shape(c, () => { c.moveTo(x, y + s * 0.5); c.quadraticCurveTo(x + s * 0.3, y + s * 1.1, x - s * 0.2, y + s * 1.5); }, col, 0); line(c, [[x, y + s * 0.5], [x + s * 0.18, y + s * 0.95], [x - s * 0.05, y + s * 1.3], [x - s * 0.25, y + s * 1.5]], s * 0.16, INK); line(c, [[x, y + s * 0.5], [x + s * 0.18, y + s * 0.95], [x - s * 0.05, y + s * 1.3], [x - s * 0.25, y + s * 1.5]], s * 0.09, col);
  shape(c, () => ell(c, x, y, s * 0.26, s * 0.55), col, 5);
  shape(c, () => ell(c, x, y - s * 0.6, s * 0.24, s * 0.2), col, 5);
  for (const sg of [-1, 1]) shape(c, () => ell(c, x + sg * s * 0.12, y - s * 0.64, s * 0.05, s * 0.05), INK, 0);
};
const moth = (c: Ctx, x: number, y: number, s: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  for (const sg of [-1, 1]) shape(c, () => ell(c, sg * s * 0.55, 0, s * 0.55, s * 0.35, sg * 0.4), "#e6d7b0", 4);
  shape(c, () => ell(c, 0, 0, s * 0.14, s * 0.4), "#8a7c5a", 4);
  c.restore();
};

// ================================================================ set-up cards
// setup.e2.0 · a phone with Chennai's sunrise and sunset beside a notebook with the table
const se2_0 = (c: Ctx) => {
  ground(c);
  notebook(c, 520, 230, 460, 660, false);
  // the results table: six columns' worth of lines, first row filled
  c.strokeStyle = INK; c.lineWidth = 3;
  for (let i = 0; i <= 6; i++) { const ly = 300 + i * 85; c.beginPath(); c.moveTo(570, ly); c.lineTo(940, ly); c.stroke(); }
  for (const lx of [570, 700, 820, 940]) { c.beginPath(); c.moveTo(lx, 300); c.lineTo(lx, 810); c.stroke(); }
  shape(c, () => ell(c, 635, 342, 12, 12), RED, 3);
  timeText(c, "6:10", 712, 325, 28, INK, 5); timeText(c, "17:50", 826, 325, 24, INK, 5);
  const s = phone(c, 90, 150, 390, 700, COL.sky);
  sun(c, s.sx + 60, s.sy + 70, 28, true);
  shape(c, () => ell(c, s.sx + s.sw / 2, s.sy + 160, 10, 10), RED, 3);
  sunIcon(c, s.sx + 60, s.sy + 300, 30, true); timeText(c, "6:10", s.sx + 170, s.sy + 272, 40, INK, 7);
  sunIcon(c, s.sx + 60, s.sy + 470, 30, false); timeText(c, "17:50", s.sx + 160, s.sy + 442, 36, INK, 7);
};
// setup.e2.1 · one row worked out: sunrise 6:10, sunset 17:50, the middle marked as noon
const se2_1 = (c: Ctx) => {
  ground(c);
  notebook(c, 110, 110, 860, 860, false);
  sunIcon(c, 250, 700, 40, true); timeText(c, "6:10", 180, 740, 48, INK, 7);
  sunIcon(c, 790, 700, 40, false); timeText(c, "17:50", 700, 740, 48, INK, 7);
  line(c, [[250, 600], [830, 600]], 8);
  for (const x of [250, 540, 830]) line(c, [[x, 575], [x, 625]], 8);
  arrow(c, [[260, 540], [525, 540]], RED, 9); arrow(c, [[820, 540], [555, 540]], RED, 9);
  sun(c, 540, 330, 70, true);
  line(c, [[540, 420], [540, 570]], 6, COL.orange);
  timeText(c, "12:00", 445, 640, 52, RED, 8);
};
// setup.e2.2 · the map with five dots, each with its longitude and its noon
const se2_2 = (c: Ctx) => {
  ground(c);
  const P = india(c, 160, 120, 25);
  const lab: Record<string, [number, number]> = { Guwahati: [790, 300], Kolkata: [740, 505], Chennai: [560, 690], Kochi: [430, 880], Mumbai: [40, 600] };
  for (const [name, lo, la, t] of CITIES) {
    const [x, y] = P([lo, la]), [lx, ly] = lab[name];
    line(c, [[x, y], [lx + 60, ly + 60]], 4, INK);
    shape(c, () => rrect(c, lx - 10, ly - 10, 230, 118, 12), COL.paper, 4);
    write(c, `${Math.round(lo)}°`, lx + 50, ly + 2, 40, INK, 6);
    timeText(c, t, lx + 8, ly + 56, 40, RED, 6);
    shape(c, () => ell(c, x, y, 14, 14), RED, 4);
  }
};
// setup.e1.0 · a hand holds the orange: a dot on the stem dimple is the North Pole, a rubber band round the middle
const se1_0 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 450, r = 210;
  // the orange rests on an open palm; the hand comes in from the left, fingers pointing right
  hand(c, 400, 705, 0, 2.2, SKIN.child, CLOTH.child, true);
  orange(c, x, y, r, false);
  ring(c, x, y, r, 0, "#6b5a8c", 22); ring(c, x, y, r, 0, COL.purple, 12);
  poleDot(c, x, y, r);
  arrow(c, [[x + 250, y - r * 1.35], [x + 60, y - r * 0.98]], RED, 8);
};
// setup.e1.1 · a thread from the equator up to the pole, a ruler beside it
const se1_1 = (c: Ctx) => {
  ground(c);
  const x = 400, y = 580, r = 240;
  orange(c, x, y, r);
  ring(c, x, y, r, 0);
  poleDot(c, x, y, r);
  // the thread lies along the skin from the equator to the pole dot, a little to the right of the middle
  const pts: number[][] = []; for (let i = 0; i <= 20; i++) { const t = i / 20, lat = t * Math.PI / 2; pts.push([x + Math.sin(0.45) * r * Math.cos(lat) * 1.02, y - r * Math.sin(lat) * 0.95 + (1 - Math.sin(lat)) * r * 0.27 * Math.cos(0.45)]); }
  thread(c, pts, 7);
  for (const t of [1 / 3, 2 / 3]) { const p = pts[Math.round(t * 20)]; line(c, [[p[0] - 16, p[1] - 10], [p[0] + 16, p[1] + 10]], 8, MARKER); }
  // the ruler stands beside it: 0 level with the pole dot, about 9 cm down to the equator
  rulerV(c, 700, y - r * 0.9, 10, 32, 100);
  line(c, [[pts[20][0] + 20, pts[20][1]], [700, pts[20][1]]], 4, RED); line(c, [[pts[0][0] + 20, pts[0][1]], [700, pts[0][1]]], 4, RED);
};
// setup.e1.2 · three circles drawn on the orange: the equator, a middle one, a small one near the top
const se1_2 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 560, r = 290;
  orange(c, x, y, r);
  ring(c, x, y, r, 0, MARKER, 10); ring(c, x, y, r, 30, MARKER, 10); ring(c, x, y, r, 60, MARKER, 10);
  poleDot(c, x, y, r);
};
// setup.e1.3 · the thread round the equator, then pulled straight along a ruler
const se1_3 = (c: Ctx) => {
  ground(c);
  const x = 330, y = 330, r = 190;
  orange(c, x, y, r);
  ring(c, x, y, r, 0, INK, 12); ring(c, x, y, r, 0, COL.red, 7);
  line(c, [[x - r * 0.3, y + r * 0.05], [x - r * 0.1, y + r * 0.2]], 6, COL.red); line(c, [[x - r * 0.3, y + r * 0.05], [x - r * 0.1, y + r * 0.2]], 3, COL.red);
  arrow(c, [[x + r * 1.25, y + r * 0.1], [x + r * 1.25, y + r * 1.0], [240, 690]], RED, 9);
  // the thread stretched straight: it reaches 25 cm on the ruler
  rulerH(c, 150, 760, 30, 26, 5, 100);
  thread(c, [[150, 720], [150 + 25 * 26, 720]], 8);
  for (const ex of [150, 150 + 25 * 26]) line(c, [[ex, 720], [ex, 755]], 4, RED);
};
// setup.a1.0 · the room: a torch on a low table, eight coins round it, a sticky-note star on the far wall
const sa1_0 = (c: Ctx) => {
  ground(c, FLOOR); c.fillStyle = WALL; c.fillRect(0, 0, D, 600); line(c, [[0, 600], [D, 600]], 6);
  stickyStar(c, 540, 300, 130);
  const cx = 540, cy = 790;
  for (let i = 1; i < 8; i++) { const a = Math.PI / 2 + i * Math.PI / 4; coin(c, cx + Math.cos(a) * 430, cy + Math.sin(a) * 150, 30); }
  // the low table
  shadow(c, cx + 30, 790, 180, 20);
  shape(c, () => polyP(c, [[cx - 130, 650], [cx + 130, 650], [cx + 160, 700], [cx - 160, 700]]), COL.brown); shade(c, () => polyP(c, [[cx - 130, 650], [cx + 130, 650], [cx + 160, 700], [cx - 160, 700]]), COL.soilDk, 0, 30, 0.35);
  for (const lx of [cx - 140, cx + 140]) line(c, [[lx, 700], [lx, 780]], 16, INK), line(c, [[lx, 700], [lx, 780]], 8, COL.brown);
  coin(c, cx, cy + 150, 30);
  // the torch standing on its end, light up
  c.beginPath(); ell(c, cx, 440, 110, 110); c.fillStyle = "rgba(255,211,77,0.35)"; c.fill();
  shape(c, () => rrect(c, cx - 30, 520, 60, 140, 12), COL.teal); shade(c, () => rrect(c, cx - 30, 520, 60, 140, 12), COL.tealDk, 16, 0, 0.5);
  shape(c, () => polyP(c, [[cx - 32, 520], [cx - 52, 470], [cx + 52, 470], [cx + 32, 520]]), COL.steel);
  shape(c, () => ell(c, cx, 470, 52, 12), COL.yellow, 4);
};
// setup.a1.1 · plan view: the child on the first mark faces the lamp, and the star is straight behind it
const sa1_1 = (c: Ctx) => {
  planRoom(c);
  const cx = 540, cy = 560, marks = planMarks(cx, cy, 330);
  marks.forEach(([x, y]) => coin(c, x, y, 28));
  planLamp(c, cx, cy);
  const [mx, my] = marks[0];
  c.setLineDash([14, 14]); line(c, [[mx, my - 70], [cx, 150]], 6, RED); c.setLineDash([]);
  childTop(c, mx, my, 48, -Math.PI / 2);
  write(c, "1", mx + 90, my - 30, 54, INK, 8);
};
// setup.a1.2 · plan view: one spin while stepping to the next mark; the child faces the star but not the lamp
const sa1_2 = (c: Ctx) => {
  planRoom(c);
  const cx = 540, cy = 560, marks = planMarks(cx, cy, 330);
  marks.forEach(([x, y]) => coin(c, x, y, 28));
  planLamp(c, cx, cy);
  const [m1x, m1y] = marks[0], [mx, my] = marks[7];
  // the step along the circle from mark 1 to mark 2, going anticlockwise (to the right at the bottom)
  const stepPts: number[][] = []; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 - (i / 10) * Math.PI / 4 * 0.6; stepPts.push([cx + Math.cos(a) * 410, cy + Math.sin(a) * 410]); }
  arrow(c, stepPts, RED, 9);
  coin(c, m1x, m1y, 28); write(c, "1", m1x - 120, m1y - 30, 54, INK, 8);
  // facing straight up, toward the star; the lamp is now a little to the left of that line
  c.setLineDash([14, 14]); line(c, [[mx, my - 70], [mx, 150]], 6, RED); c.setLineDash([]);
  line(c, [[mx, my - 70], [cx + 40, cy + 40]], 4, INK);
  c.beginPath(); c.arc(mx, my - 70, 150, -Math.PI / 2 - 0.5, -Math.PI / 2); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  // the spin on the spot
  c.beginPath(); c.arc(mx, my, 105, -Math.PI * 0.85, Math.PI * 0.6); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  arrow(c, [[mx + Math.cos(Math.PI * 0.6) * 105, my + Math.sin(Math.PI * 0.6) * 105], [mx + Math.cos(Math.PI * 0.72) * 105, my + Math.sin(Math.PI * 0.72) * 105]], RED, 9);
  childTop(c, mx, my, 48, -Math.PI / 2);
  write(c, "2", mx + 130, my - 30, 54, INK, 8);
};

// ================================================================ card pictures
// flow.e2 · five glowing clocks on the map of India, Guwahati in the east first, Mumbai in the west last
const fe2 = (c: Ctx) => {
  ground(c);
  const P = india(c, 160, 120, 25);
  const at: Record<string, [number, number]> = { Guwahati: [900, 330], Kolkata: [860, 560], Chennai: [700, 760], Kochi: [520, 930], Mumbai: [150, 660] };
  for (const [name, lo, la, t] of CITIES) {
    const [x, y] = P([lo, la]), [kx, ky] = at[name], [hh, mm] = t.split(":").map(Number);
    line(c, [[x, y], [kx, ky]], 5, INK); shape(c, () => ell(c, x, y, 14, 14), RED, 4);
    clock(c, kx, ky, 78, hh, mm, true);
  }
};
// flow.e1 · the orange on a skewer, three circles drawn, turning west to east
const fe1 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 580, r = 250;
  shadow(c, x + 40, y + r + 40, 300, 30);
  line(c, [[x, y - r - 150], [x, y + r + 30]], 22, INK); line(c, [[x, y - r - 150], [x, y + r + 30]], 12, COL.wood);
  orange(c, x, y, r, false);
  ring(c, x, y, r, 0, MARKER, 10); ring(c, x, y, r, 30, MARKER, 10); ring(c, x, y, r, 60, MARKER, 10);
  poleDot(c, x, y, r);
  line(c, [[x, y - r - 150], [x, y - r - 20]], 22, INK); line(c, [[x, y - r - 150], [x, y - r - 20]], 12, COL.wood);
  // the spin: along the equator from the viewer's left to right (anticlockwise seen from above the pole)
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * 0.85 - (i / 12) * Math.PI * 0.7; pts.push([x + Math.cos(a) * r * 1.18, y + r * 0.08 + Math.sin(a) * r * 0.36]); }
  arrow(c, pts, RED, 12);
};
// flow.a1 · why a day is longer than one spin: the Earth in two places on its path round the Sun
const fa1 = (c: Ctx) => {
  ground(c, NIGHT);
  skyStars(c, 40, 3, D, [120, 300, 1000, 800]);
  const sx = 300, sy = 620, R = 470;
  c.setLineDash([16, 18]); c.beginPath(); ell(c, sx, sy, R, R); c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 5; c.stroke(); c.setLineDash([]);
  star5(c, 70, sy, 46, WHITE, 4);
  sun(c, sx, sy, 90);
  const earth = (ex: number, ey: number, stickAn: number) => {
    shape(c, () => ell(c, ex, ey, 52, 52), COL.blue); shape(c, () => { c.moveTo(ex - 24, ey - 32); c.quadraticCurveTo(ex + 8, ey - 40, ex + 16, ey - 8); c.quadraticCurveTo(ex - 8, ey + 16, ex - 32, ey + 8); c.closePath(); }, COL.green, 3);
    shape(c, () => ell(c, ex + 16, ey + 24, 11, 8), COL.green, 3);
    const tx = ex + Math.cos(stickAn) * 110, ty = ey + Math.sin(stickAn) * 110;
    line(c, [[ex, ey], [tx, ty]], 10, INK); line(c, [[ex, ey], [tx, ty]], 5, COL.yellow);
    shape(c, () => ell(c, ex, ey, 8, 8), INK, 0);
  };
  const a2 = -0.62, e1: [number, number] = [sx + R, sy], e2: [number, number] = [sx + Math.cos(a2) * R, sy + Math.sin(a2) * R];
  // the path from the first place to the second, anticlockwise
  const orb: number[][] = []; for (let i = 0; i <= 8; i++) { const a = -0.14 - (i / 8) * 0.34; orb.push([sx + Math.cos(a) * (R + 100), sy + Math.sin(a) * (R + 100)]); }
  arrow(c, orb, RED, 9);
  // at the second place, the stick again points at the star, but the Sun is now a little lower: the extra turn
  const toSun = Math.atan2(sy - e2[1], sx - e2[0]);
  c.setLineDash([10, 12]); line(c, [[e2[0], e2[1]], [e2[0] + Math.cos(toSun) * 190, e2[1] + Math.sin(toSun) * 190]], 4, COL.yellow); c.setLineDash([]);
  c.beginPath(); c.arc(e2[0], e2[1], 150, Math.PI, toSun, false); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  earth(e1[0], e1[1], Math.PI);
  earth(e2[0], e2[1], Math.PI);
  // the spin of the Earth, anticlockwise from above
  for (const [ex, ey] of [e1, e2]) { c.beginPath(); c.arc(ex, ey, 70, -Math.PI * 0.4, Math.PI * 0.6); c.strokeStyle = WHITE; c.lineWidth = 6; c.stroke(); arrow(c, [[ex + Math.cos(Math.PI * 0.6) * 70, ey + Math.sin(Math.PI * 0.6) * 70], [ex + Math.cos(Math.PI * 0.72) * 70, ey + Math.sin(Math.PI * 0.72) * 70]], WHITE, 6); }
  write(c, "1", e1[0] - 20, e1[1] + 90, 44, WHITE, 7); write(c, "2", e2[0] + 40, e2[1] - 130, 44, WHITE, 7);
};
// flow.a2 · night watch: the red torch on a wall near a tube light, a gecko and moths
const fa2 = (c: Ctx) => {
  ground(c, "#3b3562");
  c.fillStyle = "#2e2a4e"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  // the tube light and its glow
  c.beginPath(); ell(c, 700, 180, 330, 150); c.fillStyle = "rgba(255,250,210,0.25)"; c.fill();
  shape(c, () => rrect(c, 470, 160, 460, 36, 18), WHITE, 6);
  moth(c, 560, 290, 40, 0.4); moth(c, 860, 250, 36, -0.6); moth(c, 760, 330, 32, 1.1);
  gecko(c, 720, 470, 70);
  // the child with the red torch, aimed at the gecko
  const px = 290, py = 1000, h = 560, hr: [number, number] = [430, 600];
  const H = person(c, px, py, h, { reachR: hr, armL: [Math.PI * 0.58, Math.PI * 0.5] });
  const an = Math.atan2(470 - H.handR[1], 700 - H.handR[0]);
  const headX = H.handR[0] + Math.cos(an) * 117, headY = H.handR[1] + Math.sin(an) * 117;
  c.beginPath(); c.moveTo(headX, headY); c.lineTo(640, 390); c.lineTo(800, 560); c.closePath(); c.fillStyle = "rgba(228,82,59,0.35)"; c.fill();
  torch(c, H.handR[0], H.handR[1], an, 180);
  shape(c, () => ell(c, headX, headY, 9, 42, an), COL.red, 4);
  grip(c, H.handR[0], H.handR[1], an);
};
// flow.a3 · counting stars in one patch of sky through a cardboard tube, with the lights on
const fa3 = (c: Ctx) => {
  balconyNight(c, 820);
  skyStars(c, 6, 11, 700, [600, 60, 1000, 320]);
  // the lit window behind
  shape(c, () => rrect(c, 60, 260, 240, 300, 10), COL.yellow, 6); line(c, [[180, 260], [180, 560]], 6); line(c, [[60, 410], [300, 410]], 6);
  // the patch of sky the tube looks at: only two stars show with the lights on
  c.setLineDash([12, 12]); c.beginPath(); ell(c, 840, 190, 110, 110); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); c.setLineDash([]);
  shape(c, () => ell(c, 800, 160, 7, 7), WHITE, 0); shape(c, () => ell(c, 880, 230, 6, 6), WHITE, 0);
  const px = 480, py = 1000, h = 560, eye: [number, number] = [px + 30, 545];
  const dir = Math.atan2(190 - eye[1], 840 - eye[0]);
  const hp: [number, number] = [eye[0] + Math.cos(dir) * 110, eye[1] + Math.sin(dir) * 110];
  const H = person(c, px, py, h, { reachR: hp, armL: [Math.PI * 0.56, Math.PI * 0.5] });
  // the cardboard tube from the eye toward the patch; the hand holds its middle
  c.save(); c.translate(eye[0], eye[1]); c.rotate(dir);
  shape(c, () => rrect(c, 10, -26, 250, 52, 8), COL.brown); shade(c, () => rrect(c, 10, -26, 250, 52, 8), COL.soilDk, 0, 16, 0.4); shape(c, () => ell(c, 260, 0, 10, 26), COL.soilDk, 4);
  c.restore();
  grip(c, H.handR[0], H.handR[1], dir);
  c.setLineDash([10, 14]); line(c, [[eye[0] + Math.cos(dir) * 280, eye[1] + Math.sin(dir) * 280], [840 - Math.cos(dir) * 120, 190 - Math.sin(dir) * 120]], 4, WHITE); c.setLineDash([]);
  rail(c, 820);
};
// flow.a4 · a day on each planet: the child turns with arms out while the grown-up times 24 seconds
const fa4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const cx = 380, cy = 940;
  // the turn, to the child's left: seen from the front, the arrow runs left to right round the feet
  person(c, cx, cy, 560, { armL: [Math.PI * 1.02, Math.PI * 0.98], armR: [-Math.PI * 0.02, Math.PI * 0.02] });
  const pt = (a: number): number[] => [cx + Math.cos(a) * 230, cy + 20 + Math.sin(a) * 60];
  c.beginPath(); c.ellipse(cx, cy + 20, 230, 60, 0, Math.PI * 0.95, Math.PI * 0.12, true); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  arrow(c, [pt(Math.PI * 0.2), pt(Math.PI * 0.12)], RED, 10);
  const A = person(c, 820, 940, 640, { adult: true, reachL: [772, 600], reachR: [868, 600] });
  const mx = (A.handL[0] + A.handR[0]) / 2, my = (A.handL[1] + A.handR[1]) / 2;
  const s = phone(c, mx - 50, my - 140, 100, 170, WHITE);
  write(c, "24", s.sx + 16, s.sy + 30, 34, INK, 6);
  shape(c, () => ell(c, s.sx + s.sw / 2, s.sy + s.sh - 24, 10, 10), RED, 0);
  for (const [hx, hy] of [A.handL, A.handR]) shape(c, () => ell(c, hx, hy + 6, 22, 24), SKIN.adult, 5);
};
// flow.a5 · the clock debate: round the map on the floor with four role cards
const fa5 = (c: Ctx) => {
  ground(c, FLOOR);
  c.fillStyle = WALL; c.fillRect(0, 0, D, 420); line(c, [[0, 420], [D, 420]], 6);
  // the map lies flat on the floor between them
  shape(c, () => rrect(c, 360, 690, 360, 250, 8), COL.paper, 5);
  india(c, 395, 705, 10, COL.greenLt, 0.72);
  const card = (x: number, y: number, col: string) => { shape(c, () => rrect(c, x, y, 120, 70, 8), WHITE, 4); shape(c, () => ell(c, x + 30, y + 35, 16, 16), col, 3); line(c, [[x + 60, y + 24], [x + 100, y + 24]], 4, COL.grey); line(c, [[x + 60, y + 46], [x + 100, y + 46]], 4, COL.grey); };
  card(380, 960, COL.teal); card(600, 960, COL.purple); card(230, 650, COL.red); card(760, 650, COL.green);
  const C = person(c, 230, 880, 500, { sit: true, dir: 1, reachR: [360, 760], armL: [Math.PI * 0.6, Math.PI * 0.45] });
  const Ad = person(c, 860, 880, 580, { sit: true, dir: -1, adult: true, reachL: [740, 760], armR: [Math.PI * 0.4, Math.PI * 0.55] });
  void C; void Ad;
};
// flow.p1 · star gate: on a taped spot each night, watching a bright star above a rooftop corner
const fp1 = (c: Ctx) => {
  balconyNight(c, 830);
  skyStars(c, 30, 21, 700, [560, 280, 900, 520]);
  // the neighbour's roof: a dark block to the right, with a water tank; the star sits just above its corner
  shape(c, () => polyP(c, [[700, 470], [1080, 470], [1080, 830], [700, 830]]), "#141a36", 6);
  shape(c, () => rrect(c, 880, 400, 120, 70, 8), "#141a36", 6);
  star5(c, 650, 400, 34, COL.yellow, 4);
  const px = 330, py = 1000, h = 560;
  const sR: [number, number] = [px + 59, py - 375 + 17];
  const d = Math.atan2(400 - sR[1], 650 - sR[0]);
  const H = person(c, px, py, h, { reachR: [sR[0] + Math.cos(d) * 170, sR[1] + Math.sin(d) * 170], armL: [Math.PI * 0.56, Math.PI * 0.5] });
  c.setLineDash([10, 14]); line(c, [[H.handR[0] + Math.cos(d) * 40, H.handR[1] + Math.sin(d) * 40], [650 - Math.cos(d) * 50, 400 - Math.sin(d) * 50]], 4, WHITE); c.setLineDash([]);
  // the tape mark under the feet
  for (const s of [-1, 1]) shape(c, () => polyP(c, [[px + s * 30, py + 8], [px + s * 110, py + 8], [px + s * 110, py + 26], [px + s * 30, py + 26]]), COL.yellow, 4);
  rail(c, 830);
};
// term.11 · nocturnal: a bat flying across a starry sky above a tree
const t11 = (c: Ctx) => {
  ground(c, NIGHT);
  skyStars(c, 45, 8, 760, [300, 200, 820, 460]);
  shape(c, () => ell(c, 860, 200, 80, 80), "#fff4c2", 5); shape(c, () => ell(c, 890, 180, 66, 66), NIGHT, 0);
  // the tree
  c.fillStyle = "#1a3d2a"; c.fillRect(0, 920, D, 160); line(c, [[0, 920], [D, 920]], 6);
  shape(c, () => polyP(c, [[500, 930], [580, 930], [560, 740], [520, 740]]), "#4a3326", 6);
  shape(c, () => { c.moveTo(330, 780); c.quadraticCurveTo(300, 620, 440, 600); c.quadraticCurveTo(480, 500, 580, 540); c.quadraticCurveTo(700, 500, 720, 620); c.quadraticCurveTo(820, 680, 740, 790); c.quadraticCurveTo(700, 860, 560, 840); c.quadraticCurveTo(420, 870, 330, 780); c.closePath(); }, "#2f6b45", 6);
  bat(c, 460, 330, 520);
};
// term.7 · solar noon: a stick on flat ground at midday with a very short shadow
const t7 = (c: Ctx) => {
  ground(c, COL.sky);
  sun(c, 540, 170, 90);
  c.fillStyle = "#cfe3a0"; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  shape(c, () => ell(c, 540, 870, 360, 36), "#b9d183", 4);
  // the shadow: at noon the Sun is straight overhead, so it is only a short dark pool at the foot of the stick
  shape(c, () => ell(c, 556, 882, 54, 16), "#5a6b40", 0);
  shape(c, () => polyP(c, [[526, 880], [554, 880], [548, 420], [532, 420]]), COL.wood, 6);
  shade(c, () => polyP(c, [[526, 880], [554, 880], [548, 420], [532, 420]]), COL.woodDk, 10, 0, 0.5);
  c.setLineDash([12, 14]); line(c, [[540, 280], [540, 410]], 4, COL.orange); c.setLineDash([]);
};

export const ic_dayNightSeasonsDayAndNightL4 = cards("sci.day-night-seasons.day-and-night.L4", [
  se2_0, se2_1, se2_2, se1_0, se1_1, se1_2, se1_3, sa1_0, sa1_1, sa1_2,
  fe2, fe1, fa1, fa2, fa3, fa4, fa5, fp1, t11, t7,
]);
