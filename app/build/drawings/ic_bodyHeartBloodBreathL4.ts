import type { Ctx } from "./core";
import type { Pose } from "./flatKit";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, person, write, cards } from "./flatKit";

// BODY: heart, blood, breath (L4) · set-up cards for the experiments, activities and the project, then picture cards.

const FLOOR = "#e3cfa6", MAT = "#8b6cc9", MATDK = "#6e52a8", HEARTC = "#e4523b", HEARTDK = "#b83a28", NAIL = "#f6c6c6", NAILPALE = "#fbf3ee", PLASMA = "#f6e3a1";
const CAT = "#e8a04a", CATDK = "#c47e2e", SOUP = "#d8b27c", SOUPDK = "#b98f58";

// ---------------------------------------------------------------- scene pieces
const room = (c: Ctx, fy = 820) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, fy, D, D - fy); line(c, [[0, fy], [D, fy]], 6); };
const mat = (c: Ctx, x: number, y: number, w: number) => { shape(c, () => rrect(c, x - w / 2, y - 45, w, 90, 26), MAT, 6); shade(c, () => rrect(c, x - w / 2, y - 45, w, 90, 26), MATDK, 0, -30, 0.5); };
const smooth = (c: Ctx, pts: number[][]) => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
// where the shoulders and head of a person() figure land, so hands and faces can be aimed at
const shoulderY = (y: number, h: number, p: Pose) => { const ad = !!p.adult, hip = p.sit ? y - h * 0.07 : y - h * (ad ? 0.46 : 0.4); return hip - h * (ad ? 0.3 : 0.27) + h * 0.03; };
const headOf = (y: number, h: number, p: Pose) => { const head = h * (p.adult ? 0.115 : 0.15); return { hy: shoulderY(y, h, p) - h * 0.03 - head * 1.12, head }; };
// two fingers on the inside of the other wrist, held in front of the chest
const pulsePose = (x: number, y: number, h: number, p: Pose = {}): Pose => { const sy = shoulderY(y, h, p); return { ...p, reachL: [x - h * 0.04, sy + h * 0.2], reachR: [x + h * 0.005, sy + h * 0.165] }; };
const pulseWaves = (c: Ctx, x: number, y: number, r = 20, a0 = -2.4, a1 = -0.75) => { for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(x, y, r + i * 14, a0, a1); c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); } };
const wideEyes = (c: Ctx, x: number, hy: number, head: number) => { for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.14, head * 0.22, head * 0.26), WHITE, 4); shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.17, head * 0.1, head * 0.13), INK, 0); } };
const paleTired = (c: Ctx, x: number, hy: number, head: number) => {
  c.globalAlpha = 0.5; shape(c, () => ell(c, x, hy + head * 0.22, head * 0.95, head * 0.8), "#f3e3d2", 0); c.globalAlpha = 1;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.16, head * 0.17, head * 0.21), "#e9d3bf", 0); c.beginPath(); c.arc(x + s * head * 0.38, hy + head * 0.08, head * 0.14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  c.beginPath(); c.arc(x, hy + head * 0.62, head * 0.22, Math.PI + 0.4, -0.4); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  const p = () => { rrect(c, x - w / 2, y - h / 2, w, h, 26); };
  shape(c, () => { c.moveTo(x - 30, y + h / 2 - 4); c.lineTo(tx, ty); c.lineTo(x + 30, y + h / 2 - 4); c.closePath(); }, WHITE, 6);
  shape(c, p, WHITE, 6); c.fillStyle = WHITE; c.fillRect(x - 28, y + h / 2 - 8, 56, 10);
};
const clock = (c: Ctx, x: number, y: number, r: number, sec: number) => {
  shadow(c, x + r * 0.12, y + r * 1.02, r * 0.9, r * 0.14);
  line(c, [[x - r * 0.55, y + r * 0.85], [x - r * 0.72, y + r * 1.02]], 14); line(c, [[x + r * 0.55, y + r * 0.85], [x + r * 0.72, y + r * 1.02]], 14);
  shape(c, () => ell(c, x, y, r, r), COL.teal, 7); shade(c, () => ell(c, x, y, r, r), COL.tealDk, -r * 0.12, -r * 0.12, 0.7);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), COL.paper, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, k = i % 3 === 0 ? 0.6 : 0.68; line(c, [[x + Math.cos(a) * r * k, y + Math.sin(a) * r * k], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], i % 3 === 0 ? 8 : 5); }
  line(c, [[x, y], [x + Math.cos(-2.2) * r * 0.42, y + Math.sin(-2.2) * r * 0.42]], 11); line(c, [[x, y], [x + Math.cos(0.1) * r * 0.62, y + Math.sin(0.1) * r * 0.62]], 8);
  line(c, [[x - Math.cos(sec) * r * 0.16, y - Math.sin(sec) * r * 0.16], [x + Math.cos(sec) * r * 0.72, y + Math.sin(sec) * r * 0.72]], 6, RED);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), RED, 4);
};
// a phone showing a stopwatch, upright, centred at (x, y); the digits read 15 (seconds)
const phone = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -50, -95, 100, 190, 16), COL.black, 6);
  shape(c, () => rrect(c, -40, -78, 80, 150, 8), "#22303a", 3);
  c.beginPath(); c.arc(0, -22, 30, 0, Math.PI * 2); c.strokeStyle = COL.teal; c.lineWidth = 6; c.stroke();
  write(c, "15", -19, -37, 28, "#c9f06b", 5);
  shape(c, () => rrect(c, -22, 38, 44, 18, 8), COL.teal, 3);
  c.restore();
};
// a phone held in a person() hand: the phone sits in the palm, the fingers wrap round its lower edge
const holdPhone = (c: Ctx, hp: [number, number], adult = false) => { phone(c, hp[0], hp[1] - 52, 0.9); const skin = adult ? SKIN.adult : SKIN.child; shape(c, () => ell(c, hp[0], hp[1] + 8, 30, 22), skin, 5); shape(c, () => ell(c, hp[0] - 26, hp[1] - 14, 11, 18, 0.4), skin, 4); };
// an open picture book, centre (x, y)
const book = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.red, spooky = false) => {
  shadow(c, x + 10, y + h / 2 + 8, w / 2, 10);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), col, 6);
  shape(c, () => rrect(c, x - w / 2 + 10, y - h / 2 + 10, w / 2 - 14, h - 20, 4), COL.paper, 4);
  shape(c, () => rrect(c, x + 4, y - h / 2 + 10, w / 2 - 14, h - 20, 4), COL.paper, 4);
  if (spooky) { shape(c, () => ell(c, x - w * 0.25, y - h * 0.05, w * 0.1, h * 0.2), INK, 0); shape(c, () => ell(c, x - w * 0.25, y - h * 0.1, w * 0.07, h * 0.07), WHITE, 0); }
  else { shape(c, () => ell(c, x - w * 0.25, y - h * 0.02, w * 0.12, h * 0.18), COL.green, 3); shape(c, () => ell(c, x - w * 0.25, y - h * 0.22, w * 0.05, w * 0.05), COL.yellow, 3); }
  for (let k = 0; k < 4; k++) line(c, [[x + 16, y - h * 0.3 + k * h * 0.17], [x + w / 2 - 20, y - h * 0.3 + k * h * 0.17]], 3, COL.grey);
};
// a notebook page with a table of rows x cols; cell(r, k, cx, cy, cw, ch) draws each cell's content
const table = (c: Ctx, x: number, y: number, w: number, h: number, rows: number, cols: number, cell: (r: number, k: number, cx: number, cy: number, cw: number, ch: number) => void) => {
  shadow(c, x + w / 2 + 12, y + h + 10, w / 2, 12);
  shape(c, () => rrect(c, x, y, w, h, 14), COL.paper, 6);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, x + 24, y + 40 + i * ((h - 80) / 5), 8, 8), COL.grey, 3);
  const gx = x + 50, gw = w - 70, ch = (h - 40) / rows, cw = gw / cols;
  c.fillStyle = "#dff1ee"; c.fillRect(gx, y + 20, gw, ch);
  for (let r = 0; r <= rows; r++) line(c, [[gx, y + 20 + r * ch], [gx + gw, y + 20 + r * ch]], 3, COL.greyDk);
  for (let k = 0; k <= cols; k++) line(c, [[gx + k * cw, y + 20], [gx + k * cw, y + 20 + rows * ch]], 3, COL.greyDk);
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) cell(r, k, gx + k * cw + cw / 2, y + 20 + r * ch + ch / 2, cw, ch);
};
const num = (c: Ctx, t: string, cx: number, cy: number, h: number, col = INK) => write(c, t, cx - (t.length * h * 0.8 - h * 0.2) / 2, cy - h / 2, h, col, Math.max(4, h * 0.14));
const times = (c: Ctx, x: number, y: number, h: number) => { line(c, [[x - h * 0.3, y - h * 0.3], [x + h * 0.3, y + h * 0.3]], 5); line(c, [[x + h * 0.3, y - h * 0.3], [x - h * 0.3, y + h * 0.3]], 5); };
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
  if (ch === "A") { c.moveTo(x, y + h); c.lineTo(x + h * 0.35, y); c.lineTo(x + h * 0.7, y + h); c.moveTo(x + h * 0.13, y + h * 0.65); c.lineTo(x + h * 0.57, y + h * 0.65); }
  if (ch === "B") { c.moveTo(x, y + h); c.lineTo(x, y); c.lineTo(x + h * 0.28, y); c.arc(x + h * 0.28, y + h * 0.25, h * 0.25, -Math.PI / 2, Math.PI / 2); c.lineTo(x, y + h * 0.5); c.lineTo(x + h * 0.32, y + h * 0.5); c.arc(x + h * 0.32, y + h * 0.75, h * 0.25, -Math.PI / 2, Math.PI / 2); c.lineTo(x, y + h); }
  if (ch === "C") c.arc(x + h * 0.4, y + h / 2, h * 0.42, 0.7, Math.PI * 2 - 0.7);
  c.stroke();
};
// a tiny face for a table row: a child, a grown-up, a baby or a cat
const faceIcon = (c: Ctx, x: number, y: number, r: number, kind: "child" | "adult" | "baby" | "cat" | "old") => {
  if (kind === "cat") { shape(c, () => ell(c, x, y, r, r * 0.9), CAT, 4); for (const s of [-1, 1]) shape(c, () => polyP(c, [[x + s * r * 0.9, y - r * 0.3], [x + s * r * 0.85, y - r * 1.25], [x + s * r * 0.25, y - r * 0.75]]), CAT, 4); for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.4, y - r * 0.05, r * 0.1, r * 0.14), INK, 0); shape(c, () => polyP(c, [[x - r * 0.12, y + r * 0.3], [x + r * 0.12, y + r * 0.3], [x, y + r * 0.45]]), COL.pink, 2); return; }
  const skin = kind === "adult" || kind === "old" ? SKIN.adult : SKIN.child;
  shape(c, () => ell(c, x, y, r, r * 1.05), skin, 4);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * (kind === "baby" ? 0.9 : 0.5), x - r * 1.02, y); c.closePath(); }, kind === "old" ? COL.grey : CLOTH.hair, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.15, r * 0.1, r * 0.13), INK, 0);
  if (kind === "old") for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * r * 0.38, y + r * 0.15, r * 0.3, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); }
  c.beginPath(); c.arc(x, y + r * 0.45, r * 0.3, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};
// a bar chart on paper: bars of value v (out of max) in colour col; label(i, cx, cy) draws what each bar is for
const barChart = (c: Ctx, x: number, y: number, w: number, h: number, bars: { v: number; col: string }[], max: number, label: (i: number, cx: number, cy: number) => void) => {
  shadow(c, x + w / 2 + 14, y + h + 12, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 16), COL.paper, 6);
  const ax = x + 70, base = y + h - 90, top = y + 60, slot = (w - 110) / bars.length, bw = slot * 0.6;
  for (let g = 1; g <= 4; g++) line(c, [[ax, base - ((base - top) * g) / 4], [x + w - 30, base - ((base - top) * g) / 4]], 2, COL.grey);
  bars.forEach((b, i) => {
    const bx = ax + 20 + i * slot + (slot - bw) / 2, bh = ((base - top) * b.v) / max;
    shape(c, () => rrect(c, bx, base - bh, bw, bh, 8), b.col, 5); shade(c, () => rrect(c, bx, base - bh, bw, bh, 8), INK, -bw * 0.3, 0, 0.18);
    num(c, String(b.v), bx + bw / 2, base - bh - 24, 30); label(i, bx + bw / 2, base + 42);
  });
  line(c, [[ax, top - 20], [ax, base], [x + w - 30, base]], 6);
};
// a bowl seen from above (a wide ellipse), so a hand can rest in the water; centre (x, y)
const topBowl = (c: Ctx, x: number, y: number, rx: number, ry: number, water: string) => {
  shadow(c, x + 16, y + 24, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel, 6); shade(c, () => ell(c, x, y, rx, ry), COL.steelDk, rx * 0.1, ry * 0.1, 0.5);
  shape(c, () => ell(c, x, y, rx * 0.86, ry * 0.84), water, 4);
};
const waterOver = (c: Ctx, x: number, y: number, rx: number, ry: number, water: string, a = 0.45) => { c.save(); c.beginPath(); ell(c, x, y, rx * 0.86, ry * 0.84); c.clip(); c.globalAlpha = a; c.fillStyle = water; c.fillRect(0, 0, D, D); c.restore(); c.globalAlpha = 1; shine(c, [[x + rx * 0.3, y - ry * 0.62], [x + rx * 0.58, y - ry * 0.4]], 8); };
const steam = (c: Ctx, x: number, y: number, s: number) => { c.globalAlpha = 0.5; for (const dx of [-s, 0, s]) { c.beginPath(); smooth(c, [[x + dx, y], [x + dx - s * 0.3, y - s * 0.5], [x + dx + s * 0.3, y - s * 1.1], [x + dx, y - s * 1.6]]); c.strokeStyle = COL.greyDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); } c.globalAlpha = 1; };
const ice = (c: Ctx, x: number, y: number, s: number, rot = 0) => { c.globalAlpha = 0.92; shape(c, () => { c.save(); c.translate(x, y); c.rotate(rot); rrect(c, -s, -s * 0.8, s * 2, s * 1.6, s * 0.3); c.restore(); }, "#eaf6ff", 4); c.globalAlpha = 1; shine(c, [[x - s * 0.5, y - s * 0.3], [x - s * 0.1, y - s * 0.5]], 5); };
// a hand seen from above (its back), wrist at (x, y), fingers pointing along an; s = size; fl = finger lengths (index first)
const handTop = (c: Ctx, x: number, y: number, an: number, s = 1, adult = false, nails: string[] = [NAIL, NAIL, NAIL, NAIL], skin = adult ? SKIN.adult : SKIN.child, fl = [92, 110, 102, 80]) => {
  const sleeve = adult ? CLOTH.adult : CLOTH.child;
  c.save(); c.translate(x, y); c.rotate(an + Math.PI / 2); c.scale(s, s);
  shape(c, () => rrect(c, -80, -6, 160, 66, 18), sleeve, 6);
  shape(c, () => { c.moveTo(-60, -40); c.quadraticCurveTo(-125, -75, -122, -130); c.quadraticCurveTo(-112, -152, -92, -142); c.quadraticCurveTo(-72, -110, -40, -92); c.closePath(); }, skin, 5);
  shape(c, () => ell(c, -108, -132, 9, 11, -0.5), nails[4] ?? nails[1], 3);
  shape(c, () => { c.moveTo(-66, 0); c.quadraticCurveTo(-78, -60, -62, -112); c.lineTo(62, -112); c.quadraticCurveTo(78, -60, 66, 0); c.quadraticCurveTo(0, 16, -66, 0); c.closePath(); }, skin, 6);
  const fx = [-48, -16, 16, 48];
  for (let k = 0; k < 4; k++) { shape(c, () => rrect(c, fx[k] - 15, -108 - fl[k], 30, fl[k] + 14, 14), skin, 5); shape(c, () => ell(c, fx[k], -108 - fl[k] + 16, 9, 11), nails[k], 3); }
  c.restore();
};
// a grown-up's finger pressing down with its tip at (tx, ty), its length running back along angle an + PI
const pressFinger = (c: Ctx, tx: number, ty: number, an: number, s = 1) => {
  c.save(); c.translate(tx, ty); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -250, -24, 258, 48, 24), SKIN.adult, 6);
  shade(c, () => rrect(c, -250, -24, 258, 48, 24), SKIN.adultDk, 0, -16, 0.45);
  shape(c, () => ell(c, -30, 0, 15, 10), NAIL, 3);
  c.restore();
};
// a heart: centre (x, y), half-width about s
const heartPath = (c: Ctx, x: number, y: number, s: number) => () => {
  c.moveTo(x, y + 0.95 * s); c.bezierCurveTo(x - 1.1 * s, y + 0.2 * s, x - 1.15 * s, y - 0.75 * s, x - 0.5 * s, y - 0.8 * s);
  c.bezierCurveTo(x - 0.2 * s, y - 0.82 * s, x - 0.05 * s, y - 0.65 * s, x, y - 0.45 * s);
  c.bezierCurveTo(x + 0.05 * s, y - 0.65 * s, x + 0.2 * s, y - 0.82 * s, x + 0.5 * s, y - 0.8 * s);
  c.bezierCurveTo(x + 1.15 * s, y - 0.75 * s, x + 1.1 * s, y + 0.2 * s, x, y + 0.95 * s); c.closePath();
};
const heart = (c: Ctx, x: number, y: number, s: number) => { shape(c, heartPath(c, x, y, s), HEARTC, Math.max(3, s * 0.08)); shade(c, heartPath(c, x, y, s), HEARTDK, s * 0.2, s * 0.05, 0.55); if (s > 30) shine(c, [[x - 0.7 * s, y - 0.35 * s], [x - 0.55 * s, y - 0.6 * s]], Math.max(5, s * 0.07)); };
// stairs rising to the right from (x, y) on the floor, n steps of w by h
const stairs = (c: Ctx, x: number, y: number, w: number, h: number, n: number) => {
  const prof: number[][] = [[x, y]]; for (let i = 0; i < n; i++) prof.push([x + i * w, y - (i + 1) * h], [x + (i + 1) * w, y - (i + 1) * h]); prof.push([x + n * w, y]);
  shape(c, () => polyP(c, prof), COL.wood, 6);
  for (let i = 0; i < n; i++) { shape(c, () => rrect(c, x + i * w, y - (i + 1) * h, w + (i < n - 1 ? 0 : 0), 22, 4), COL.woodDk, 4); }
};
const sugarLump = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - s, y], [x + s, y], [x + s, y - s * 1.3], [x - s, y - s * 1.3]]), WHITE, 5);
  shape(c, () => polyP(c, [[x + s, y], [x + s * 1.55, y - s * 0.45], [x + s * 1.55, y - s * 1.75], [x + s, y - s * 1.3]]), "#d9d3c8", 5);
  shape(c, () => polyP(c, [[x - s, y - s * 1.3], [x + s, y - s * 1.3], [x + s * 1.55, y - s * 1.75], [x - s * 0.45, y - s * 1.75]]), "#f4f1ea", 5);
};
const sugarBits = (c: Ctx, x: number, y: number, spread: number, n: number, seed: number, size = 1) => { let s = seed >>> 0; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); for (let i = 0; i < n; i++) { const bx = x + (r() - 0.5) * spread * 2, by = y + (r() - 0.5) * spread * 0.6, k = (8 + r() * 10) * size; shape(c, () => polyP(c, [[bx - k, by], [bx - k * 0.4, by - k], [bx + k * 0.8, by - k * 0.8], [bx + k, by + k * 0.2], [bx, by + k * 0.6]]), WHITE, 3); } };
const sugarHeap = (c: Ctx, x: number, y: number, w: number, h: number) => { const p = () => { c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 0.5, y - h * 0.8, x, y - h); c.quadraticCurveTo(x + w * 0.5, y - h * 0.8, x + w, y); c.closePath(); }; shape(c, p, WHITE, 5); shade(c, p, "#d9d3c8", w * 0.25, 0, 0.5); };
const tag = (c: Ctx, x: number, y: number, ch: string, ml = false) => { const w = ml ? 200 : 80; shape(c, () => rrect(c, x - w / 2, y - 36, w, 72, 10), WHITE, 5); letter(c, ch, x - (ml ? 86 : 20), y - 26, 52); if (ml) write(c, "100 ml", x - 36, y - 14, 26, INK, 4); };
// a cat asleep on its side, curled, on a cushion; its back at the top, centre bottom (x, y)
const cat = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s * 1.35, y - s * 0.3, s * 2.7, s * 0.55, s * 0.2), COL.teal, 6); shade(c, () => rrect(c, x - s * 1.35, y - s * 0.3, s * 2.7, s * 0.55, s * 0.2), COL.tealDk, 0, -s * 0.2, 0.5);
  const tail = [[x + s * 0.85, y - s * 0.3], [x + s * 1.3, y - s * 0.35], [x + s * 1.45, y - s * 0.75], [x + s * 1.2, y - s * 0.95]];
  line(c, tail, s * 0.2 + 10, INK); line(c, tail, s * 0.2, CAT);
  const body = () => ell(c, x + s * 0.1, y - s * 0.5, s, s * 0.45); shape(c, body, CAT); shade(c, body, CATDK, s * 0.12, s * 0.14, 0.5);
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x + s * 0.1 + k * s * 0.3, y - s * 0.55, s * 0.22, Math.PI * 1.15, Math.PI * 1.85); c.strokeStyle = CATDK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  const hx = x - s * 0.8, hy = y - s * 0.55;
  for (const m of [-1, 1]) shape(c, () => polyP(c, [[hx + m * s * 0.3, hy - s * 0.1], [hx + m * s * 0.32, hy - s * 0.5], [hx + m * s * 0.05, hy - s * 0.28]]), CAT, 5);
  shape(c, () => ell(c, hx, hy, s * 0.36, s * 0.32), CAT, 6);
  for (const m of [-1, 1]) { c.beginPath(); c.arc(hx + m * s * 0.14, hy - s * 0.02, s * 0.07, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  shape(c, () => polyP(c, [[hx - s * 0.05, hy + s * 0.1], [hx + s * 0.05, hy + s * 0.1], [hx, hy + s * 0.16]]), COL.pink, 2);
  for (const m of [-1, 1]) for (const k of [-1, 1]) line(c, [[hx + m * s * 0.12, hy + s * 0.12 + k * s * 0.03], [hx + m * s * 0.4, hy + s * 0.1 + k * s * 0.1]], 3);
  for (const m of [-1, 1]) shape(c, () => ell(c, x + s * 0.3 + m * s * 0.2, y - s * 0.1, s * 0.16, s * 0.1), CAT, 4);
};
const sofa = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h, w, h + 40, 30), MAT, 6); shade(c, () => rrect(c, x - w / 2, y - h, w, h + 40, 30), MATDK, 0, h * 0.5, 0.35);
  for (const m of [-1, 1]) shape(c, () => rrect(c, x + m * (w / 2 + 10) - 40, y - h * 0.5, 80, h * 0.5 + 60, 24), MATDK, 6);
};
const sofaSeat = (c: Ctx, x: number, y: number, w: number) => { shape(c, () => rrect(c, x - w / 2 - 12, y - 6, w + 24, 70, 18), MAT, 6); shade(c, () => rrect(c, x - w / 2 - 12, y - 6, w + 24, 70, 18), MATDK, 0, -26, 0.4); };
const bagMagnet = (c: Ctx, x: number, y: number, w: number, h: number, flecks = 0) => {
  // a zip bag hanging from (x, y) with a bar magnet lying across its bottom
  c.globalAlpha = 0.75; shape(c, () => rrect(c, x - w / 2, y, w, h, 12), "#e9f3ff", 5); c.globalAlpha = 1;
  shape(c, () => rrect(c, x - w / 2, y + 10, w, 20, 4), COL.blue, 4);
  const mx = x - w * 0.36, my = y + h - 70;
  shape(c, () => rrect(c, mx, my, w * 0.36, 46, 6), RED, 5); shape(c, () => rrect(c, mx + w * 0.36, my, w * 0.36, 46, 6), COL.blue, 5);
  c.globalAlpha = 0.35; shape(c, () => rrect(c, x - w / 2, y, w, h, 12), "#e9f3ff", 0); c.globalAlpha = 1; shine(c, [[x - w * 0.35, y + 50], [x - w * 0.35, y + h * 0.55]], 6);
  let s = 5; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < flecks; i++) { const fx = x + (r() - 0.5) * w * 0.8, fy = my + 10 + (r() - 0.3) * 60; shape(c, () => ell(c, fx, fy, 3 + r() * 3, 2 + r() * 3, r() * 3), "#3a3540", 0); }
};
const redCell = (c: Ctx, x: number, y: number, r: number, rot = 0) => { shape(c, () => ell(c, x, y, r, r * 0.62, rot), COL.red, Math.max(3, r * 0.1)); shade(c, () => ell(c, x, y, r, r * 0.62, rot), HEARTDK, r * 0.1, r * 0.1, 0.45); shape(c, () => ell(c, x, y, r * 0.5, r * 0.26, rot), HEARTDK, 0); shine(c, [[x - r * 0.5, y - r * 0.25], [x - r * 0.2, y - r * 0.35]], Math.max(3, r * 0.1)); };

// ---------------------------------------------------------------- e1 : the pulse detective
const e1s0 = (c: Ctx) => {
  room(c, 760);
  shape(c, () => rrect(c, 120, 560, 640, 240, 30), MAT, 6); shade(c, () => rrect(c, 120, 560, 640, 240, 30), MATDK, 0, 60, 0.35);
  // the child lies on her back on the mat (seen from above): the figure turned on its side, head to the left, the book held over her chest
  c.save(); c.translate(690, 680); c.rotate(-Math.PI / 2);
  const h = 440; person(c, 0, 0, h, { reachL: [-h * 0.06, -h * 0.5], reachR: [h * 0.06, -h * 0.5] });
  book(c, 0, -h * 0.5 - 20, 170, 120);
  c.restore();
  const hp = person(c, 900, 790, 500, { sit: true, dir: -1, adult: true, reachL: [800, 720] });
  holdPhone(c, hp.handL, true);
};
const e1s1 = (c: Ctx) => {
  room(c);
  mat(c, 230, 820, 330);
  person(c, 230, 820, 440, pulsePose(230, 820, 440, { sit: true, dir: 1 }));
  person(c, 560, 820, 470, pulsePose(560, 820, 470));
  const hp = person(c, 880, 820, 590, { adult: true, reachL: [730, 480] });
  holdPhone(c, hp.handL, true);
};
const e1s2 = (c: Ctx) => {
  room(c);
  stairs(c, 600, 820, 160, 110, 3);
  person(c, 680, 710, 440, {});
  arrow(c, [[540, 800], [540, 725]]); arrow(c, [[585, 725], [585, 800]]);
  person(c, 250, 820, 590, { adult: true });
  bubble(c, 470, 250, 240, 130, 330, 370); write(c, "1 2 3", 392, 220, 56, INK, 8);
};
const e1s3 = (c: Ctx) => {
  room(c);
  mat(c, 330, 820, 360);
  const hp = person(c, 330, 820, 460, pulsePose(330, 820, 460, { sit: true, dir: 1 }));
  pulseWaves(c, hp.handR[0] - 10, hp.handR[1] - 10);
  const { hy, head } = headOf(820, 460, { sit: true });
  for (const [dx, dy] of [[-head * 1.3, -head * 0.3], [head * 1.3, -head * 0.5], [head * 1.1, head * 0.3]]) shape(c, () => { c.moveTo(330 + dx, hy + dy - 14); c.quadraticCurveTo(330 + dx + 10, hy + dy, 330 + dx, hy + dy + 8); c.quadraticCurveTo(330 + dx - 10, hy + dy, 330 + dx, hy + dy - 14); }, COL.sky, 3);
  const pulse = ["140", "122", "106", "96", "88"], breath = ["40", "32", "26", "22", "20"];
  table(c, 600, 430, 420, 400, 6, 3, (r, k, cx, cy) => {
    if (r === 0) { if (k === 0) clock(c, cx, cy - 2, 20, -1.2); if (k === 1) heart(c, cx, cy, 20); if (k === 2) { for (const m of [-1, 1]) shape(c, () => ell(c, cx + m * 12, cy + 2, 11, 16), COL.pink, 3); } return; }
    num(c, k === 0 ? String(r - 1) : k === 1 ? pulse[r - 1] : breath[r - 1], cx, cy, 30);
  });
};

// ---------------------------------------------------------------- e2 : cold fingers
const e2s0 = (c: Ctx) => {
  ground(c);
  topBowl(c, 520, 600, 330, 210, COL.water);
  handTop(c, 260, 650, -0.15, 1.5, false, [NAIL, NAIL, NAIL, NAIL]);
  waterOver(c, 520, 600, 330, 210, COL.water, 0.4);
  steam(c, 520, 400, 60);
  clock(c, 920, 300, 100, -1.0);
};
const e2s1 = (c: Ctx) => {
  ground(c);
  handTop(c, 560, 940, -Math.PI / 2, 2.3, false, [NAILPALE, NAIL, NAIL, NAIL]);
  // the grown-up's thumb presses the index nail (the first finger); its tip is on that nail
  pressFinger(c, 560 - 48 * 2.3 - 18, 940 - (108 + 92 - 16) * 2.3 - 16, 0.75, 1.7);
};
const e2s2 = (c: Ctx) => {
  ground(c);
  handTop(c, 420, 980, -Math.PI / 2, 2.1, false, [NAILPALE, NAIL, NAIL, NAIL]);
  // the pressed nail half way back to pink
  const nx = 420 - 48 * 2.1, ny = 980 - (108 + 92 - 16) * 2.1;
  c.save(); c.beginPath(); ell(c, nx, ny, 9 * 2.1, 11 * 2.1); c.clip(); c.fillStyle = NAIL; c.fillRect(nx - 30, ny, 60, 30); c.restore();
  pulseWaves(c, nx, ny, 34, -2.0, -1.1);
  phone(c, 820, 420, 1.2);
  hand(c, 820, 520, -Math.PI / 2, 1.3, SKIN.adult, CLOTH.adult);
  num(c, "1 2 3", 820, 240, 44);
};
const e2s3 = (c: Ctx) => {
  ground(c);
  topBowl(c, 520, 620, 330, 210, COL.sky);
  handTop(c, 790, 670, Math.PI - 0.2, 1.5, false, [NAILPALE, NAILPALE, NAILPALE, NAILPALE], "#c48a66");
  waterOver(c, 520, 620, 330, 210, COL.sky, 0.4);
  ice(c, 400, 560, 34, 0.3); ice(c, 640, 540, 30, -0.4); ice(c, 330, 680, 28, 0.9); ice(c, 560, 760, 30, 0.2);
  clock(c, 170, 300, 100, 0.4);
};

// ---------------------------------------------------------------- e3 : big surface, fast swap
const counter = (c: Ctx, yTop: number) => { c.fillStyle = FLOOR; c.fillRect(0, yTop, D, D - yTop); c.fillStyle = "#edddb9"; c.fillRect(0, yTop, D, 16); line(c, [[0, yTop], [D, yTop]], 6); };
const threeGlasses = (c: Ctx, y: number, fill = 0.5) => { for (const x of [250, 540, 830]) glass(c, x, y, 190, 320, fill); };
const e3s0 = (c: Ctx) => {
  ground(c); counter(c, 560);
  threeGlasses(c, 720);
  tag(c, 250, 840, "A", true); tag(c, 540, 840, "B", true); tag(c, 830, 840, "C", true);
};
const e3s1 = (c: Ctx) => {
  ground(c); counter(c, 520);
  shadow(c, 560, 800, 440, 40);
  shape(c, () => rrect(c, 90, 560, 900, 260, 24), COL.wood, 6); shape(c, () => rrect(c, 120, 580, 840, 200, 16), COL.woodDk, 4);
  sugarLump(c, 250, 740, 60); sugarBits(c, 540, 715, 110, 16, 3, 1.4); sugarHeap(c, 830, 745, 110, 60);
  tag(c, 250, 460, "A"); tag(c, 540, 460, "B"); tag(c, 830, 460, "C");
};
const e3s2 = (c: Ctx) => {
  ground(c);
  const hp = person(c, 400, 900, 560, { reachL: [250, 450], reachR: [540, 450] });
  counter(c, 640);
  threeGlasses(c, 820);
  sugarLump(c, hp.handL[0], hp.handL[1] + 70, 22); arrow(c, [[hp.handL[0] + 60, hp.handL[1] + 40], [hp.handL[0] + 60, hp.handL[1] + 110]], RED, 7);
  sugarBits(c, hp.handR[0], hp.handR[1] + 60, 30, 6, 9, 0.8); arrow(c, [[hp.handR[0] + 60, hp.handR[1] + 40], [hp.handR[0] + 60, hp.handR[1] + 110]], RED, 7);
  hand(c, 910, 400, 2.5, 1.1, SKIN.adult, CLOTH.adult, true);
  c.globalAlpha = 0.9; for (let i = 0; i < 12; i++) shape(c, () => ell(c, 830 + ((i * 37) % 50) - 25, 470 + i * 7, 5, 4), WHITE, 2); c.globalAlpha = 1; arrow(c, [[890, 470], [890, 540]], RED, 7);
  phone(c, 1000, 905, 0.9);
};
const e3s3 = (c: Ctx) => {
  ground(c); counter(c, 560);
  threeGlasses(c, 800);
  c.globalAlpha = 0.9; sugarLump(c, 250, 790, 26); sugarBits(c, 250, 790, 50, 5, 4, 0.6); c.globalAlpha = 1;
  c.globalAlpha = 0.85; sugarBits(c, 540, 792, 55, 4, 8, 0.45); c.globalAlpha = 1;
  tag(c, 250, 900, "A"); tag(c, 540, 900, "B"); tag(c, 830, 900, "C");
  clock(c, 920, 340, 100, 1.2);
};

// ---------------------------------------------------------------- a1 : pulse points
const a1s0 = (c: Ctx) => {
  room(c, 900);
  const hp = person(c, 520, 900, 620, pulsePose(520, 900, 620));
  pulseWaves(c, hp.handR[0] - 12, hp.handR[1] - 12, 26);
  bubble(c, 790, 420, 250, 180, hp.handR[0] + 50, hp.handR[1] - 40); heart(c, 790, 420, 52); pulseWaves(c, 862, 392, 16, -1.2, 1.2);
};
const a1s1 = (c: Ctx) => {
  room(c, 900);
  const { hy, head } = headOf(900, 620, {});
  const hp = person(c, 520, 900, 620, { reachR: [520 + head * 1.02, hy - head * 0.1] });
  pulseWaves(c, hp.handR[0] + 10, hp.handR[1] - 6, 22, -1.3, 1.0);
};
const a1s2 = (c: Ctx) => {
  room(c, 900);
  const sy = shoulderY(900, 620, {});
  const hp = person(c, 520, 900, 620, { reachR: [520 + 36, sy - 42] });
  pulseWaves(c, hp.handR[0] + 8, hp.handR[1] - 4, 22, -1.6, 0.9);
  shape(c, () => rrect(c, 790, 280, 120, 120, 20), WHITE, 6); num(c, "1", 850, 340, 60);
};

// ---------------------------------------------------------------- a2 : who breathes fastest?
const a2s0 = (c: Ctx) => {
  room(c);
  cat(c, 380, 810, 200);
  arrow(c, [[400, 640], [400, 560]], RED, 8); arrow(c, [[460, 560], [460, 640]], RED, 8);
  const hp = person(c, 830, 820, 440, { sit: true, dir: -1, reachL: [706, 660] });
  holdPhone(c, hp.handL);
};
const a2s1 = (c: Ctx) => {
  ground(c);
  const kinds: ("child" | "adult" | "cat" | "baby")[] = ["child", "adult", "cat", "baby"], count = ["5", "4", "7", "9"], per = ["20", "16", "28", "36"];
  table(c, 120, 230, 820, 460, 5, 3, (r, k, cx, cy) => {
    if (r === 0) { if (k === 1) clock(c, cx, cy - 4, 24, -1.2); if (k === 2) { times(c, cx - 28, cy, 30); num(c, "4", cx + 20, cy, 36); } return; }
    if (k === 0) faceIcon(c, cx, cy, 26, kinds[r - 1]); else num(c, k === 1 ? count[r - 1] : per[r - 1], cx, cy, 34);
  });
  hand(c, 930, 820, -2.0, 1.3, SKIN.child, CLOTH.child, true);
};
const a2s2 = (c: Ctx) => {
  ground(c);
  const kinds: ("child" | "adult" | "cat" | "baby")[] = ["child", "adult", "cat", "baby"];
  barChart(c, 100, 120, 880, 840, [{ v: 20, col: COL.orange }, { v: 16, col: COL.blue }, { v: 28, col: COL.teal }, { v: 36, col: COL.pink }], 40, (i, cx, cy) => faceIcon(c, cx, cy, 24, kinds[i]));
};

// ---------------------------------------------------------------- a3 : iron for the blood
const soupBowl = (c: Ctx, x: number, y: number, r: number) => { bowl(c, x, y, r, SOUP); let s = 3; const rd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); for (let i = 0; i < 14; i++) shape(c, () => ell(c, x + (rd() - 0.5) * r * 1.6, y + (rd() - 0.5) * r * 0.3, 10 + rd() * 8, 6 + rd() * 4, rd() * 3), SOUPDK, 2.5); };
const a3s0 = (c: Ctx) => {
  ground(c); counter(c, 620);
  soupBowl(c, 520, 620, 320);
  line(c, [[600, 600], [900, 400]], 30, INK); line(c, [[600, 600], [900, 400]], 18, COL.steel);
  shape(c, () => ell(c, 580, 612, 50, 26, -0.6), COL.steel, 6); shape(c, () => ell(c, 580, 612, 34, 14, -0.6), COL.steelDk, 0);
  steam(c, 440, 520, 50);
};
const a3s1 = (c: Ctx) => {
  ground(c); counter(c, 660);
  soupBowl(c, 520, 660, 320);
  bagMagnet(c, 560, 360, 170, 330);
  c.save(); c.beginPath(); ell(c, 520, 660, 320, 64); c.clip(); c.globalAlpha = 0.7; c.fillStyle = SOUP; c.fillRect(0, 0, D, D); c.restore(); c.globalAlpha = 1;
  hand(c, 560, 270, Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
  c.beginPath(); c.arc(520, 660, 250, Math.PI * 1.15, Math.PI * 1.85); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  const ax = 520 + Math.cos(Math.PI * 1.85) * 250, ay = 660 + Math.sin(Math.PI * 1.85) * 250; arrow(c, [[ax - 20, ay - 22], [ax, ay]], RED, 10);
};
const a3s2 = (c: Ctx) => {
  ground(c); counter(c, 700);
  plate(c, 540, 860, 340, 110);
  shape(c, () => ell(c, 540, 855, 290, 90), WHITE, 0);
  bagMagnet(c, 560, 290, 190, 340, 60);
  hand(c, 560, 200, Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
};

// ---------------------------------------------------------------- a4 : hand up, hand down
const a4s0 = (c: Ctx) => {
  room(c, 900);
  const h = 620, hp = person(c, 480, 900, h, { reachL: [480 - h * 0.08, 900 - h * 0.95] });
  arrow(c, [[hp.handL[0] - 90, hp.handL[1] + 120], [hp.handL[0] - 90, hp.handL[1] + 10]], RED, 9);
  arrow(c, [[hp.handR[0] + 90, hp.handR[1] - 120], [hp.handR[0] + 90, hp.handR[1] - 10]], RED, 9);
  clock(c, 900, 700, 95, 1.6);
};
const veins = (c: Ctx, x: number, y: number, s: number, col: string, w: number) => { c.globalAlpha = 0.55; for (const p of [[[-50, -16], [-34, -60], [-44, -102]], [[-12, -12], [-16, -60], [-14, -104]], [[26, -18], [30, -62], [20, -104]], [[-52, -40], [0, -60], [50, -94]]]) { c.beginPath(); smooth(c, p.map(([u, v]) => [x + u * s, y + v * s])); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); } c.globalAlpha = 1; };
const a4s1 = (c: Ctx) => {
  room(c, 980);
  const h = 540, hp = person(c, 720, 980, h, { reachL: [720 - h * 0.06, 980 - h * 0.73], reachR: [720 + h * 0.06, 980 - h * 0.73] });
  shape(c, () => ell(c, 300, 330, 250, 250), WHITE, 7);
  line(c, [[505, 440], [hp.handL[0] - 30, hp.handL[1] - 20]], 5, COL.greyDk);
  handTop(c, 190, 500, -Math.PI / 2, 1.05, false, [NAILPALE, NAILPALE, NAILPALE, NAILPALE], "#c99a78");
  handTop(c, 410, 500, -Math.PI / 2, 1.05, false, [NAIL, NAIL, NAIL, NAIL], "#b5714a");
  veins(c, 410, 500, 1.05, COL.blueDk, 9);
};

// ---------------------------------------------------------------- a5 : breathe through a straw
const straw = (c: Ctx, a: number[], b: number[]) => { line(c, [a, b], 20, INK); line(c, [a, b], 11, COL.pink); };
const a5s0 = (c: Ctx) => {
  room(c);
  mat(c, 400, 820, 420);
  const h = 500, { hy, head } = headOf(820, h, { sit: true }), mouth = [400 + 4, hy + head * 0.5], nose = [400, hy + head * 0.34];
  const hp = person(c, 400, 820, h, { sit: true, dir: 1, reachL: [310, 730], reachR: [nose[0] + 12, nose[1] + 2] });
  straw(c, mouth, [hp.handL[0] + 6, hp.handL[1] - 4]);
  person(c, 850, 820, 590, { adult: true });
};
const a5s1 = (c: Ctx) => {
  room(c);
  const h = 500, { hy, head } = headOf(820, h, {}), mouth = [400 + 4, hy + head * 0.5], nose = [400, hy + head * 0.34];
  const hp = person(c, 400, 820, h, { reachL: [300, 580], reachR: [nose[0] + 12, nose[1] + 2] });
  straw(c, mouth, [hp.handL[0] + 6, hp.handL[1] - 4]);
  for (const m of [-1, 1]) arrow(c, [[400 + m * 110, 760], [400 + m * 110, 690]], RED, 7);
  person(c, 850, 820, 590, { adult: true });
};

// ---------------------------------------------------------------- a6 : a calm story and a scary story
const story = (c: Ctx, scary: boolean) => {
  room(c);
  mat(c, 330, 820, 380);
  const cx = scary ? 400 : 330, hp = person(c, cx, 820, 460, pulsePose(cx, 820, 460, { sit: true, dir: 1 }));
  pulseWaves(c, hp.handR[0] - 10, hp.handR[1] - 10);
  const { hy, head } = headOf(820, 460, { sit: true });
  if (scary) { wideEyes(c, cx, hy, head); for (const a of [-2.6, -2.1, -1.6]) line(c, [[cx + Math.cos(a) * head * 1.3, hy + Math.sin(a) * head * 1.3], [cx + Math.cos(a) * head * 1.7, hy + Math.sin(a) * head * 1.7]], 6); }
  const ad = person(c, 790, 820, 560, { sit: true, dir: -1, adult: true, reachL: [690, 790], reachR: [890, 790] });
  book(c, (ad.handL[0] + ad.handR[0]) / 2, ad.handL[1] - 75, 200, 150, scary ? MATDK : COL.red, scary);
};
const a6s0 = (c: Ctx) => story(c, false);
const a6s1 = (c: Ctx) => story(c, true);

// ---------------------------------------------------------------- p1 : the family pulse study
const p1s0 = (c: Ctx) => {
  room(c, 900);
  sofa(c, 560, 700, 760, 300);
  const g = person(c, 700, 700, 560, { sit: true, dir: -1, adult: true, reachL: [578, 650] });
  const { hy, head } = headOf(700, 560, { sit: true, adult: true });
  shape(c, () => { c.moveTo(700 - head * 1.04, hy + head * 0.05); c.bezierCurveTo(700 - head * 1.1, hy - head * 1.6, 700 + head * 1.1, hy - head * 1.6, 700 + head * 1.04, hy + head * 0.05); c.quadraticCurveTo(700 + head * 0.5, hy - head * 0.5, 700 - head * 0.2, hy - head * 0.52); c.quadraticCurveTo(700 - head * 0.8, hy - head * 0.4, 700 - head * 1.04, hy + head * 0.05); c.closePath(); }, COL.grey, 5);
  shape(c, () => ell(c, 700 + head * 0.9, hy - head * 0.9, head * 0.4, head * 0.4), COL.grey, 4);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(700 + s * head * 0.38, hy + head * 0.16, head * 0.3, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); } line(c, [[700 - head * 0.08, hy + head * 0.16], [700 + head * 0.08, hy + head * 0.16]], 4);
  const k = person(c, 420, 700, 420, { sit: true, dir: 1, reachR: [g.handL[0] - 6, g.handL[1] - 8] });
  pulseWaves(c, k.handR[0], k.handR[1] - 14, 18);
  sofaSeat(c, 560, 700, 760);
  shape(c, () => rrect(c, 950, 760, 110, 24, 6), COL.wood, 5); line(c, [[1005, 784], [1005, 900]], 16, INK); line(c, [[1005, 784], [1005, 900]], 8, COL.wood);
  phone(c, 1005, 666, 0.9);
};
const p1s1 = (c: Ctx) => {
  ground(c);
  const kinds: ("child" | "adult" | "old" | "baby")[] = ["child", "adult", "adult", "old", "old"], age = ["8", "35", "38", "62", "70"], count = ["22", "18", "17", "19", "18"], per = ["88", "72", "68", "76", "72"];
  table(c, 100, 190, 880, 620, 6, 4, (r, k, cx, cy) => {
    if (r === 0) { if (k === 1) { shape(c, () => rrect(c, cx - 30, cy - 10, 60, 36, 6), COL.pink, 4); line(c, [[cx, cy - 10], [cx, cy - 30]], 5); shape(c, () => ell(c, cx, cy - 36, 7, 10), COL.yellow, 3); } if (k === 2) clock(c, cx, cy - 4, 24, -1.2); if (k === 3) { times(c, cx - 28, cy, 30); num(c, "4", cx + 20, cy, 36); } return; }
    if (k === 0) faceIcon(c, cx, cy, 26, kinds[r - 1]); else num(c, k === 1 ? age[r - 1] : k === 2 ? count[r - 1] : per[r - 1], cx, cy, 34);
  });
};
const p1s2 = (c: Ctx) => {
  ground(c);
  const age = ["8", "35", "38", "62", "70"];
  barChart(c, 100, 120, 880, 840, [{ v: 88, col: COL.orange }, { v: 72, col: COL.blue }, { v: 68, col: COL.teal }, { v: 76, col: COL.purple }, { v: 72, col: COL.green }], 100, (i, cx, cy) => num(c, age[i], cx, cy + 6, 34));
};

// ---------------------------------------------------------------- picture cards
const flowE1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 440, 30);
  shape(c, () => rrect(c, 90, 90, 900, 860, 20), COL.paper, 6);
  const ax = 190, base = 800, top = 200, xs = [0, 1, 2, 3, 4].map((i) => ax + 60 + i * 170);
  for (let g = 1; g <= 5; g++) line(c, [[ax, base - ((base - top) * g) / 5], [960, base - ((base - top) * g) / 5]], 2, COL.grey);
  line(c, [[ax, top - 40], [ax, base], [960, base]], 6);
  const pulse = [78, 84, 94, 140, 90], breath = [18, 20, 22, 40, 24];
  const py = (v: number) => base - ((v - 40) / 110) * (base - top), by = (v: number) => base - ((v - 10) / 32) * (base - top) * 0.55;
  line(c, xs.map((x, i) => [x, py(pulse[i])]), 9, RED); line(c, xs.map((x, i) => [x, by(breath[i])]), 9, COL.blue);
  xs.forEach((x, i) => { shape(c, () => ell(c, x, py(pulse[i]), 13, 13), RED, 4); num(c, String(pulse[i]), x - 36, py(pulse[i]) - 30, 28, HEARTDK); shape(c, () => ell(c, x, by(breath[i]), 13, 13), COL.blue, 4); num(c, String(breath[i]), x + 36, by(breath[i]) + 30, 28, COL.blueDk); });
  // what each point was: lying, sitting, standing, stepping, resting
  xs.forEach((x, i) => { const y = base + 70; if (i === 0) shape(c, () => rrect(c, x - 40, y - 12, 80, 24, 10), COL.orange, 4); if (i === 1) { shape(c, () => rrect(c, x - 18, y - 36, 36, 36, 8), COL.orange, 4); shape(c, () => rrect(c, x - 40, y - 2, 80, 20, 8), "#6b5a8c", 4); } if (i === 2) { shape(c, () => rrect(c, x - 18, y - 60, 36, 44, 8), COL.orange, 4); shape(c, () => rrect(c, x - 16, y - 18, 32, 44, 8), "#6b5a8c", 4); } if (i === 3) { shape(c, () => polyP(c, [[x - 44, y + 26], [x - 44, y - 4], [x - 14, y - 4], [x - 14, y - 34], [x + 16, y - 34], [x + 16, y - 64], [x + 46, y - 64], [x + 46, y + 26]]), COL.wood, 4); } if (i === 4) { shape(c, () => rrect(c, x - 18, y - 36, 36, 36, 8), COL.orange, 4); shape(c, () => rrect(c, x - 40, y - 2, 80, 20, 8), "#6b5a8c", 4); clock(c, x + 44, y - 26, 18, 1); } });
  heart(c, 300, 150, 28); line(c, [[340, 150], [420, 150]], 9, RED);
  for (const m of [-1, 1]) shape(c, () => ell(c, 520 + m * 14, 152, 12, 18), COL.pink, 3); line(c, [[560, 150], [640, 150]], 9, COL.blue);
};
const flowE2 = (c: Ctx) => {
  ground(c);
  topBowl(c, 290, 330, 230, 150, COL.water); steam(c, 290, 180, 50);
  topBowl(c, 790, 330, 230, 150, COL.sky); ice(c, 720, 300, 26, 0.3); ice(c, 860, 350, 24, -0.5); ice(c, 790, 270, 20, 0.9);
  handTop(c, 290, 880, -Math.PI / 2, 1.3, false, [NAIL, NAIL, NAIL, NAIL], "#b5714a");
  handTop(c, 790, 880, -Math.PI / 2, 1.3, false, [NAILPALE, NAILPALE, NAILPALE, NAILPALE], "#c99a78");
  phone(c, 540, 620, 1.0);
  num(c, "2", 160, 620, 70, HEARTDK); num(c, "6", 920, 620, 70, COL.blueDk);
};
const flowE3 = (c: Ctx) => {
  ground(c); counter(c, 560);
  threeGlasses(c, 800);
  sugarLump(c, 250, 790, 30);
  c.globalAlpha = 0.9; sugarBits(c, 540, 700, 55, 10, 8, 0.7); c.globalAlpha = 1;
  c.globalAlpha = 0.6; for (let i = 0; i < 7; i++) shape(c, () => ell(c, 830 + Math.sin(i * 1.7) * 45, 560 + i * 34, 50 - i * 3, 22), WHITE, 0); c.globalAlpha = 1;
  tag(c, 250, 900, "A"); tag(c, 540, 900, "B"); tag(c, 830, 900, "C");
  clock(c, 920, 340, 100, 0.3);
};
const flowA3 = (c: Ctx) => {
  ground(c); counter(c, 640);
  soupBowl(c, 300, 700, 230);
  plate(c, 780, 860, 250, 80); shape(c, () => ell(c, 780, 856, 210, 64), WHITE, 0);
  bagMagnet(c, 780, 300, 180, 330, 60);
  hand(c, 780, 210, Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
  arrow(c, [[470, 430], [640, 430]], RED, 9);
};
const termPulse = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -40, 520, 300, 330, 40), CLOTH.child); shade(c, () => rrect(c, -40, 520, 300, 330, 40), CLOTH.childDk, -40, 0, 0.6);
  const arm = () => { c.moveTo(230, 540); c.lineTo(600, 575); c.bezierCurveTo(720, 560, 950, 540, 1010, 620); c.bezierCurveTo(1040, 690, 980, 760, 900, 770); c.bezierCurveTo(800, 800, 670, 810, 600, 790); c.lineTo(230, 830); c.closePath(); };
  shape(c, arm, SKIN.child, 6); shade(c, arm, SKIN.childDk, 10, 30, 0.5);
  line(c, [[720, 620], [950, 620]], 4, SKIN.childDk); line(c, [[720, 710], [930, 690]], 4, SKIN.childDk);
  shape(c, () => ell(c, 790, 575, 110, 36, -0.2), SKIN.child, 6);
  // the artery under the skin at the wrist, with the pushes drawn as small waves
  c.globalAlpha = 0.55; line(c, [[300, 690], [600, 700]], 14, HEARTC); c.globalAlpha = 1;
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(430 + k * 60, 700, 30, Math.PI, 0); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); }
  // two fingers of the other hand pressing the inside of the wrist
  handTop(c, 640, 390, Math.PI * 0.62, 1.5, false, [NAIL, NAIL, NAIL, NAIL], SKIN.child, [112, 118, 40, 30]);
};
const termRedCell = (c: Ctx) => {
  ground(c, PLASMA);
  let s = 11; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cells: number[][] = [[300, 260, 95, 0.3], [640, 220, 80, -0.5], [880, 420, 90, 0.9], [220, 560, 85, -0.9], [540, 520, 110, 0.1], [820, 760, 95, -0.3], [330, 860, 90, 0.6], [600, 870, 70, 1.2], [930, 150, 55, 0.4], [120, 120, 50, -0.2], [1000, 620, 45, 1.0], [130, 760, 55, 0.2]];
  for (const [x, y, rad, rot] of cells) redCell(c, x, y, rad, rot);
  for (let i = 0; i < 10; i++) shape(c, () => ell(c, 60 + r() * 960, 60 + r() * 960, 6, 6), "#f2d07a", 2);
};
const termPlasma = (c: Ctx) => {
  ground(c);
  // a test tube in a wooden stand: a yellow top layer, a thin pale band, a red bottom layer
  shadow(c, 560, 940, 300, 30);
  shape(c, () => rrect(c, 300, 860, 480, 70, 14), COL.wood, 6); line(c, [[420, 860], [420, 420]], 16, INK); line(c, [[700, 860], [700, 420]], 16, INK); shape(c, () => rrect(c, 380, 400, 360, 44, 12), COL.wood, 6);
  const tube = () => { c.moveTo(450, 160); c.lineTo(670, 160); c.lineTo(670, 760); c.arc(560, 760, 110, 0, Math.PI); c.closePath(); };
  shape(c, () => { c.moveTo(450, 460); c.lineTo(670, 460); c.lineTo(670, 760); c.arc(560, 760, 110, 0, Math.PI); c.closePath(); }, COL.red, 0);
  c.fillStyle = "#f3efe6"; c.fillRect(450, 440, 220, 24);
  c.fillStyle = PLASMA; c.fillRect(450, 200, 220, 240);
  shape(c, () => { c.moveTo(450, 160); c.lineTo(670, 160); c.lineTo(670, 200); c.lineTo(450, 200); c.closePath(); }, COL.glass, 0); shape(c, tube, "rgba(255,255,255,0)", 6); shape(c, () => ell(c, 560, 160, 110, 22), "rgba(255,255,255,0.35)", 6);
  shine(c, [[475, 220], [475, 720]], 9);
  line(c, [[690, 320], [780, 320]], 6); shape(c, () => ell(c, 820, 320, 30, 30), PLASMA, 5);
  line(c, [[690, 620], [780, 620]], 6); redCell(c, 830, 620, 36, 0.3);
};
const termAlveolus = (c: Ctx) => {
  ground(c);
  // the tube (bronchiole) coming down, then a bunch of air sacs like grapes, each wrapped in a net of capillaries
  const stalk = [[540, 40], [530, 200], [560, 330]]; line(c, stalk, 70, INK); line(c, stalk, 52, COL.steelIn);
  const sacs: number[][] = [[560, 440, 120], [400, 520, 105], [720, 520, 105], [470, 680, 110], [660, 690, 115], [560, 840, 100], [330, 700, 80], [800, 700, 80]];
  for (const [x, y] of sacs) line(c, [[560, 330], [x, y]], 26, INK);
  for (const [x, y] of sacs) line(c, [[560, 330], [x, y]], 14, COL.steelIn);
  for (const [x, y, r] of sacs) {
    shape(c, () => ell(c, x, y, r, r), COL.pink, 6); shade(c, () => ell(c, x, y, r, r), "#d9738f", r * 0.2, r * 0.15, 0.5);
    c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
    for (let k = -2; k <= 2; k++) { c.beginPath(); smooth(c, [[x - r, y + k * r * 0.38 - r * 0.1], [x - r * 0.3, y + k * r * 0.38 + r * 0.12], [x + r * 0.4, y + k * r * 0.38 - r * 0.1], [x + r, y + k * r * 0.38 + r * 0.1]]); c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
    for (let k = -1; k <= 1; k++) { c.beginPath(); smooth(c, [[x + k * r * 0.5 - r * 0.1, y - r], [x + k * r * 0.5 + r * 0.12, y - r * 0.3], [x + k * r * 0.5 - r * 0.1, y + r * 0.4], [x + k * r * 0.5 + r * 0.1, y + r]]); c.strokeStyle = COL.blueDk; c.lineWidth = 5; c.stroke(); }
    c.restore();
    shine(c, [[x - r * 0.55, y - r * 0.3], [x - r * 0.3, y - r * 0.55]], 7);
  }
};
const termAnaemia = (c: Ctx) => {
  room(c, 840);
  shape(c, () => rrect(c, 120, 660, 560, 200, 10), COL.grey, 6); shape(c, () => rrect(c, 120, 660, 560, 26, 6), "#d3cec5", 4);
  const h = 440, cx = 390, hp = person(c, cx, 668, h, { sit: true, dir: 1, reachL: [cx - 70, 668 - 150], reachR: [cx + 80, 668 - 60] });
  void hp;
  const { hy, head } = headOf(668, h, { sit: true }); paleTired(c, cx, hy, head);
  plate(c, 860, 820, 190, 70);
  shape(c, () => ell(c, 810, 806, 90, 44), "#b98f58", 5); shade(c, () => ell(c, 810, 806, 90, 44), "#8a6a3c", 10, 8, 0.4); for (const [dx, dy] of [[-30, -8], [10, 6], [40, -10], [-5, -18]]) shape(c, () => ell(c, 810 + dx, 806 + dy, 7, 5), "#8a6a3c", 0);
  bowl(c, 930, 790, 58, COL.yellow);
  for (const [lx, ly, an] of [[880, 850, 2.6], [920, 862, 2.9], [960, 850, 3.4]]) { const len = 56, tx = lx + Math.cos(an) * len, ty = ly + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.35, ny = Math.cos(an) * len * 0.35, mx = (lx + tx) / 2, my = (ly + ty) / 2; shape(c, () => { c.moveTo(lx, ly); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, lx, ly); c.closePath(); }, COL.leaf, 4); }
};
const explHands = (c: Ctx) => {
  ground(c);
  heart(c, 540, 170, 90);
  handTop(c, 280, 960, -Math.PI / 2, 1.9, false, [NAIL, NAIL, NAIL, NAIL], "#bd7246");
  handTop(c, 800, 960, -Math.PI / 2, 1.9, false, [NAILPALE, NAILPALE, NAILPALE, NAILPALE], "#cfa78a");
  veins(c, 280, 960, 1.9, HEARTC, 16); veins(c, 800, 960, 1.9, COL.blueDk, 5);
  arrow(c, [[470, 230], [330, 330], [290, 540]], RED, 16); arrow(c, [[610, 230], [750, 330], [790, 540]], RED, 6);
  for (const [x, y] of [[760, 330], [860, 300], [900, 400]]) shape(c, () => { c.moveTo(x, y - 18); c.lineTo(x + 6, y - 6); c.lineTo(x + 18, y); c.lineTo(x + 6, y + 6); c.lineTo(x, y + 18); c.lineTo(x - 6, y + 6); c.lineTo(x - 18, y); c.lineTo(x - 6, y - 6); c.closePath(); }, COL.sky, 3);
  steam(c, 200, 420, 40);
};

export const ic_bodyHeartBloodBreathL4 = cards("sci.body.heart-blood-breath.L4 cards", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, e3s0, e3s1, e3s2, e3s3,
  a1s0, a1s1, a1s2, a2s0, a2s1, a2s2, a3s0, a3s1, a3s2, a4s0, a4s1, a5s0, a5s1, a6s0, a6s1, p1s0, p1s1, p1s2,
  flowE1, flowE2, flowE3, flowA3, termPulse, termRedCell, termPlasma, termAlveolus, termAnaemia, explHands,
]);
