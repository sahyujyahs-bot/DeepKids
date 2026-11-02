import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, bowl, cards, ell, ground, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// ANIMALS AROUND US L3 · picture cards for the unit: habits, behaviour, homes, day and night animals.
// Flat DeepKids look; same child (orange shirt) and grown-up (blue shirt); red arrows = movement or change.

const GRASS = "#cfe3a8", GRASS_DK = "#a9cb7c", SKYD = "#cfe8f6", SAND = "#ecd3a1", NIGHT = "#2c2d5a", NIGHT_DK = "#1f2046";
const BLACKB = "#4a4558", BLACKD = "#2f2b3c";

// ------------------------------------------------------------ small helpers
const strip = (c: Ctx, y: number, col = GRASS) => { c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const tile = (c: Ctx, x: number, y: number, w: number, h: number, col: string = WHITE, r = 28) => shape(c, () => rrect(c, x, y, w, h, r), col, 6);
const clip = (c: Ctx, x: number, y: number, w: number, h: number, r: number, fn: () => void) => { c.save(); c.beginPath(); rrect(c, x, y, w, h, r); c.clip(); fn(); c.restore(); };
const dash = (c: Ctx, pts: number[][], w = 6, col = INK, on = 16, off = 14) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    for (let d = 0; d < L; d += on + off) line(c, [[x0 + ux * d, y0 + uy * d], [x0 + ux * Math.min(L, d + on), y0 + uy * Math.min(L, d + on)]], w, col);
  }
};
const dashEll = (c: Ctx, x: number, y: number, rx: number, ry: number, w = 7, col = RED) => {
  const n = 40, pts: number[][] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, b = ((i + 0.55) / n) * Math.PI * 2; line(c, [[x + Math.cos(a) * rx, y + Math.sin(a) * ry], [x + Math.cos(b) * rx, y + Math.sin(b) * ry]], w, col); }
  return pts;
};
const sun = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), col, 6);
};
const moon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.arc(x, y, r, 0, Math.PI * 2); }, "#f6efc8", 5);
  c.save(); c.beginPath(); c.arc(x, y, r - 2, 0, Math.PI * 2); c.clip(); c.beginPath(); c.arc(x + r * 0.5, y - r * 0.2, r * 0.9, 0, Math.PI * 2); c.fillStyle = NIGHT; c.fill(); c.restore();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const star = (c: Ctx, x: number, y: number, r: number) => { const p: number[][] = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.4 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } shape(c, () => polyP(c, p), COL.yellow, 3); };
const cloud = (c: Ctx, x: number, y: number, w: number) => { for (const [dx, dy, rx, ry] of [[0, 0, w, w * 0.4], [-w * 0.6, w * 0.1, w * 0.5, w * 0.3], [w * 0.6, w * 0.1, w * 0.5, w * 0.3]]) shape(c, () => ell(c, x + dx, y + dy, rx, ry), WHITE, 4); for (const [dx, dy, rx, ry] of [[0, 0, w, w * 0.4], [-w * 0.6, w * 0.1, w * 0.5, w * 0.3], [w * 0.6, w * 0.1, w * 0.5, w * 0.3]]) { c.beginPath(); ell(c, x + dx, y + dy, rx - 2, ry - 2); c.fillStyle = WHITE; c.fill(); } };
const tree = (c: Ctx, x: number, y: number, s: number, col = COL.leaf, dk = COL.leafDk) => {
  shape(c, () => polyP(c, [[x - 28 * s, y], [x - 16 * s, y - 220 * s], [x + 16 * s, y - 220 * s], [x + 28 * s, y]]), COL.brown, 6);
  const blobs = [[0, -300, 120], [-100, -240, 90], [100, -240, 90], [-50, -370, 90], [60, -360, 85]];
  for (const [dx, dy, r] of blobs) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s * 0.9), col, 6);
  for (const [dx, dy, r] of blobs) { c.beginPath(); ell(c, x + dx * s, y + dy * s, r * s - 3, r * s * 0.9 - 3); c.fillStyle = col; c.fill(); }
  shade(c, () => ell(c, x, y - 290 * s, 170 * s, 130 * s), dk, 30 * s, 40 * s, 0.35);
};
const note = (c: Ctx, x: number, y: number, s = 1, col = INK) => { shape(c, () => ell(c, x, y, 16 * s, 12 * s, -0.4), col, 3); line(c, [[x + 14 * s, y - 4 * s], [x + 14 * s, y - 52 * s], [x + 38 * s, y - 40 * s]], 6 * s, col); };
const waves = (c: Ctx, x: number, y: number, dirx: number, n = 3, r = 40, col = INK) => { for (let i = 0; i < n; i++) { const rr = r + i * 28; c.beginPath(); c.arc(x, y, rr, dirx > 0 ? -0.7 : Math.PI - 0.7, dirx > 0 ? 0.7 : Math.PI + 0.7); c.strokeStyle = col; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); } };
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, rows = 4) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 14, h / 2 + 8, w * 0.55, 14);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), WHITE, 6);
  line(c, [[0, -h / 2], [0, h / 2]], 4);
  for (let i = 0; i < rows; i++) { const yy = -h / 2 + (h * (i + 1)) / (rows + 1); line(c, [[-w / 2 + 14, yy], [-12, yy]], 3, COL.steelDk); line(c, [[12, yy], [w / 2 - 14, yy]], 3, COL.steelDk); }
  c.restore();
};
const pencil = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * 11, ny = Math.cos(a) * 11;
  shape(c, () => polyP(c, [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[x0 + nx, y0 + ny], [x0 - nx, y0 - ny], [x0 - Math.cos(a) * 30, y0 - Math.sin(a) * 30]]), SAND, 4);
};
const clock = (c: Ctx, x: number, y: number, r: number, hour: number, minute = 0) => {
  shadow(c, x + r * 0.12, y + r * 1.02, r * 0.9, r * 0.12);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.62, y - Math.cos(a) * r * 0.62], [x + Math.sin(a) * r * 0.76, y - Math.cos(a) * r * 0.76]], Math.max(3, r * 0.03)); }
  const ha = ((hour % 12) / 12 + minute / 720) * Math.PI * 2, ma = (minute / 60) * Math.PI * 2;
  line(c, [[x, y], [x + Math.sin(ma) * r * 0.66, y - Math.cos(ma) * r * 0.66]], Math.max(4, r * 0.04));
  line(c, [[x, y], [x + Math.sin(ha) * r * 0.46, y - Math.cos(ha) * r * 0.46]], Math.max(6, r * 0.065), RED);
  shape(c, () => ell(c, x, y, r * 0.06, r * 0.06), INK, 0);
};

// ------------------------------------------------------------ animals (side view, facing left, feet on y)
const crow = (c: Ctx, x: number, y: number, s: number, flip = false, open = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const B = BLACKB, W = "#5f5972";
  shadow(c, 10, 4, 90, 12);
  line(c, [[-10, -50], [-14, -4]], 8); line(c, [[16, -50], [14, -4]], 8);
  line(c, [[-30, -4], [-8, -4]], 7); line(c, [[0, -4], [24, -4]], 7);
  shape(c, () => polyP(c, [[50, -95], [140, -55], [128, -105], [60, -115]]), B, 6);
  shape(c, () => ell(c, 0, -95, 72, 44, -0.15), B, 6);
  shade(c, () => ell(c, 0, -95, 72, 44, -0.15), BLACKD, 14, 18, 0.6);
  shape(c, () => ell(c, 14, -92, 46, 24, -0.2), W, 5);
  shape(c, () => ell(c, -66, -138, 30, 28), B, 6);
  if (open) { shape(c, () => polyP(c, [[-92, -150], [-142, -158], [-94, -136]]), "#6a6578", 6); shape(c, () => polyP(c, [[-94, -134], [-138, -116], [-92, -126]]), "#6a6578", 6); shape(c, () => ell(c, -100, -134, 10, 5), COL.red, 3); }
  else shape(c, () => polyP(c, [[-92, -146], [-140, -128], [-92, -122]]), "#6a6578", 6);
  shape(c, () => ell(c, -72, -146, 8, 8), WHITE, 3); shape(c, () => ell(c, -74, -146, 4, 4), INK, 0);
  c.restore();
};
const squirrel = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const F = "#a09282", FD = "#766a5c", CR = "#efe5cd";
  shadow(c, 20, 4, 110, 12);
  const tail = () => { c.moveTo(50, -60); c.bezierCurveTo(190, -30, 200, -190, 110, -250); c.bezierCurveTo(70, -280, 30, -240, 70, -200); c.bezierCurveTo(110, -170, 100, -110, 40, -100); c.closePath(); };
  shape(c, tail, F, 6); shade(c, tail, FD, 14, 12, 0.5);
  line(c, [[78, -215], [120, -190], [128, -150]], 3, FD);
  for (const lx of [-34, 40]) shape(c, () => ell(c, lx, -22, 26, 14), FD, 5);
  const body = () => ell(c, 0, -80, 78, 48, -0.25);
  shape(c, body, F, 6); shade(c, body, FD, 14, 18, 0.5);
  c.save(); c.beginPath(); body(); c.clip();
  for (const [a, b, w] of [[-60, -55, 7], [-70, -80, 18], [-70, -105, 7]]) { line(c, [[a, b - 20], [90, b + 40]], w, CR); }
  c.restore(); shape(c, () => {}, F, 0); c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, -70, -126, 34, 30), F, 6);
  shape(c, () => ell(c, -102, -118, 14, 11), "#d7c4a8", 4);
  shape(c, () => ell(c, -112, -121, 5, 4), INK, 0);
  shape(c, () => ell(c, -52, -156, 14, 17), FD, 5);
  shape(c, () => ell(c, -78, -134, 6, 7), INK, 0);
  shape(c, () => ell(c, -56, -68, 15, 12), "#d7c4a8", 4);
  c.restore();
};
const pigeon = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const G = "#9aa3ad", GD = "#6f7886";
  shadow(c, 10, 4, 85, 11);
  line(c, [[-8, -44], [-10, -5]], 7, COL.pink); line(c, [[18, -44], [16, -5]], 7, COL.pink);
  line(c, [[-26, -5], [-4, -5]], 6, COL.pink); line(c, [[2, -5], [26, -5]], 6, COL.pink);
  shape(c, () => polyP(c, [[50, -78], [128, -50], [118, -92], [58, -100]]), GD, 6);
  shape(c, () => ell(c, 0, -80, 68, 42, -0.2), G, 6);
  shade(c, () => ell(c, 0, -80, 68, 42, -0.2), GD, 12, 16, 0.55);
  shape(c, () => ell(c, 12, -82, 42, 22, -0.2), GD, 5);
  line(c, [[-20, -92], [40, -70]], 5, "#c9d1dc");
  shape(c, () => ell(c, -58, -112, 24, 24), G, 6);
  shape(c, () => ell(c, -44, -92, 26, 16, -0.4), "#4f9a86", 4);
  shape(c, () => polyP(c, [[-78, -118], [-100, -112], [-78, -106]]), COL.orange, 4);
  shape(c, () => ell(c, -62, -118, 6, 6), COL.orange, 3); shape(c, () => ell(c, -63, -118, 3, 3), INK, 0);
  c.restore();
};
const ant = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const A = "#6b2f22";
  shadow(c, 10, 2, 90, 8);
  for (const [lx, dx] of [[-6, -26], [10, 2], [26, 30]]) { line(c, [[lx, -26], [lx + dx * 0.5, -48], [lx + dx, -4]], 7, INK); line(c, [[lx, -26], [lx + dx * 0.5, -48], [lx + dx, -4]], 3.5, A); }
  line(c, [[-52, -36], [-70, -64], [-88, -56]], 6); line(c, [[-46, -40], [-56, -70], [-76, -72]], 6);
  shape(c, () => ell(c, 70, -30, 40, 28), A, 6);
  shape(c, () => ell(c, 8, -30, 24, 17), A, 6);
  shape(c, () => ell(c, -42, -34, 24, 20), A, 6);
  shape(c, () => ell(c, -50, -38, 5, 5), WHITE, 2);
  c.restore();
};
const cow = (c: Ctx, x: number, y: number, s: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  shadow(c, 20, 6, 170, 16);
  for (const lx of [-90, -60, 80, 110]) { shape(c, () => rrect(c, lx - 14, -110, 28, 104, 8), lx === -60 || lx === 110 ? "#cfc7b8" : WHITE, 5); shape(c, () => rrect(c, lx - 15, -18, 30, 14, 5), INK, 0); }
  line(c, [[150, -170], [175, -120], [168, -70]], 8); shape(c, () => ell(c, 168, -62, 12, 18), INK, 0);
  const body = () => rrect(c, -150, -230, 300, 140, 60);
  shape(c, body, WHITE, 6); shade(c, body, "#d9d2c3", 18, 24, 0.55);
  c.save(); c.beginPath(); body(); c.clip(); shape(c, () => ell(c, -40, -200, 50, 34, 0.3), "#8a5a3c", 0); shape(c, () => ell(c, 80, -140, 44, 30, -0.2), "#8a5a3c", 0); c.restore();
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, -170, -210, 52, 46, 0.2), WHITE, 6);
  shape(c, () => ell(c, -205, -190, 30, 24), COL.pink, 5);
  shape(c, () => ell(c, -214, -192, 4, 5), INK, 0);
  shape(c, () => ell(c, -154, -150 - 74, 7, 8), INK, 0);
  shape(c, () => ell(c, -134, -246, 24, 12, -0.5), "#d9d2c3", 5);
  shape(c, () => polyP(c, [[-170, -250], [-182, -290], [-150, -258]]), COL.yellow, 4);
  c.restore();
};
const fishy = (c: Ctx, x: number, y: number, L: number, flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -1 : 1, 1);
  const w = 5;
  shape(c, () => polyP(c, [[L * 0.3, 0], [L * 0.52, -L * 0.2], [L * 0.46, 0], [L * 0.52, L * 0.2]]), "#8aa3b8", w);
  shape(c, () => polyP(c, [[-L * 0.1, -L * 0.2], [L * 0.1, -L * 0.34], [L * 0.2, -L * 0.17]]), "#8aa3b8", w);
  const b = () => { c.moveTo(-L * 0.5, 0); c.bezierCurveTo(-L * 0.3, -L * 0.28, L * 0.2, -L * 0.26, L * 0.36, -L * 0.04); c.lineTo(L * 0.36, L * 0.04); c.bezierCurveTo(L * 0.2, L * 0.26, -L * 0.3, L * 0.28, -L * 0.5, 0); c.closePath(); };
  shape(c, b, "#b7c9d8", w); shade(c, b, "#8aa3b8", L * 0.04, L * 0.07, 0.55);
  shape(c, () => ell(c, -L * 0.34, -L * 0.04, L * 0.04, L * 0.04), WHITE, 3); shape(c, () => ell(c, -L * 0.345, -L * 0.04, L * 0.018, L * 0.018), INK, 0);
  line(c, [[-L * 0.2, -L * 0.14], [-L * 0.14, 0], [-L * 0.2, L * 0.14]], 4, "#8aa3b8");
  c.restore();
};
const gecko = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const G = "#dcc3a2", GD = "#b79a76";
  const leg = (bx: number, by: number, ex: number, ey: number) => { line(c, [[bx, by], [(bx + ex) / 2 + (ex - bx) * 0.1, ey * 0.6 + by * 0.4], [ex, ey]], 18, INK); line(c, [[bx, by], [(bx + ex) / 2 + (ex - bx) * 0.1, ey * 0.6 + by * 0.4], [ex, ey]], 8, G); for (const d of [-14, 0, 14]) shape(c, () => ell(c, ex + d * 0.6, ey + (ey > 0 ? 14 : -14), 6, 6), GD, 3); };
  leg(-50, 24, -80, 80); leg(-50, -24, -80, -80); leg(60, 24, 90, 80); leg(60, -24, 90, -80);
  shape(c, () => { c.moveTo(100, -14); c.bezierCurveTo(200, -20, 250, 30, 330, 20); c.bezierCurveTo(250, 54, 190, 20, 100, 16); c.closePath(); }, G, 6);
  const body = () => ell(c, 0, 0, 100, 40);
  shape(c, body, G, 6); shade(c, body, GD, 10, 14, 0.5);
  for (const [dx, dy] of [[-30, -10], [10, 8], [40, -8], [70, 6]]) shape(c, () => ell(c, dx, dy, 8, 7), GD, 0);
  shape(c, () => ell(c, -112, 0, 42, 32), G, 6);
  shape(c, () => ell(c, -128, -14, 11, 11), COL.yellow, 4); shape(c, () => ell(c, -128, 14, 11, 11), COL.yellow, 4);
  shape(c, () => ell(c, -128, -14, 4, 7), INK, 0); shape(c, () => ell(c, -128, 14, 4, 7), INK, 0);
  c.restore();
};
const bat = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const B = "#5b4636", BD = "#3f2f24";
  for (const m of [-1, 1]) {
    const wing = () => { c.moveTo(m * 18, -20); c.quadraticCurveTo(m * 110, -110, m * 220, -50); c.lineTo(m * 190, 10); c.quadraticCurveTo(m * 170, -10, m * 160, 40); c.quadraticCurveTo(m * 120, 5, m * 100, 55); c.quadraticCurveTo(m * 60, 15, m * 22, 50); c.closePath(); };
    shape(c, wing, B, 6); shade(c, wing, BD, m * 8, 10, 0.4);
    line(c, [[m * 22, -14], [m * 190, -20]], 4, BD); line(c, [[m * 22, -4], [m * 160, 36]], 4, BD);
  }
  shape(c, () => ell(c, 0, 8, 30, 46), B, 6);
  shape(c, () => ell(c, 0, -48, 24, 21), B, 6);
  shape(c, () => polyP(c, [[-20, -58], [-30, -88], [-8, -66]]), B, 5); shape(c, () => polyP(c, [[20, -58], [30, -88], [8, -66]]), B, 5);
  shape(c, () => ell(c, -9, -50, 4, 4), WHITE, 2); shape(c, () => ell(c, 9, -50, 4, 4), WHITE, 2);
  shape(c, () => ell(c, 0, -38, 6, 4), COL.pink, 3);
  c.restore();
};
const owl = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const O = "#a58a68", OD = "#7d6548";
  shadow(c, 8, 4, 90, 12);
  line(c, [[-24, -30], [-24, -4]], 8, COL.yellow); line(c, [[24, -30], [24, -4]], 8, COL.yellow);
  const body = () => ell(c, 0, -110, 74, 96);
  shape(c, body, O, 6); shade(c, body, OD, 14, 18, 0.5);
  shape(c, () => ell(c, 0, -90, 46, 70), "#eadfc4", 4);
  for (const [dx, dy] of [[-18, -120], [14, -100], [-10, -78], [20, -60], [-26, -52]]) shape(c, () => ell(c, dx, dy, 5, 6), OD, 0);
  shape(c, () => ell(c, 0, -190, 66, 54), O, 6);
  for (const m of [-1, 1]) { shape(c, () => ell(c, m * 28, -192, 24, 24), WHITE, 4); shape(c, () => ell(c, m * 28, -192, 14, 14), COL.yellow, 3); shape(c, () => ell(c, m * 28, -192, 7, 7), INK, 0); line(c, [[m * 6, -222], [m * 54, -214]], 7, WHITE); }
  shape(c, () => polyP(c, [[-8, -176], [8, -176], [0, -158]]), COL.orange, 4);
  c.restore();
};
const tiger = (c: Ctx, x: number, y: number, s: number, leopard = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const T = leopard ? "#e8c25a" : "#ee9a3c", TD = leopard ? "#c29a2e" : "#c97a22";
  shadow(c, 10, 6, 190, 18);
  line(c, [[130, -50], [210, -40], [240, -90]], 24, INK); line(c, [[130, -50], [210, -40], [240, -90]], 12, T);
  const body = () => ell(c, 0, -70, 150, 66);
  shape(c, body, T, 6); shade(c, body, TD, 14, 18, 0.5);
  c.save(); c.beginPath(); body(); c.clip(); if (leopard) { for (let i = -4; i < 5; i++) for (const j of [-100, -70]) shape(c, () => ell(c, i * 30 + (j % 20 ? 0 : 12), j, 9, 8), "#8a5a1c", 3); } else for (let i = -4; i < 5; i++) line(c, [[i * 30 - 4, -140], [i * 30 + 8, -70]], 11, INK); c.restore();
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => ell(c, -70, -10, 44, 20), T, 5);
  shape(c, () => ell(c, -150, -80, 56, 50), T, 6);
  shape(c, () => ell(c, -180, -56, 30, 22), "#f7ecd5", 4); shape(c, () => ell(c, -192, -64, 7, 5), INK, 0);
  shape(c, () => ell(c, -140, -126, 15, 17), T, 5);
  shape(c, () => ell(c, -164, -96, 7, 8), INK, 0);
  line(c, [[-130, -100], [-122, -86]], 7); line(c, [[-122, -64], [-118, -50]], 7);
  c.restore();
};
const grassBlades = (c: Ctx, x0: number, x1: number, y: number, h: number, seed = 1, col = "#7fae52") => {
  let s = seed;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let x = x0; x < x1; x += 14) { const hh = h * (0.6 + r() * 0.6); line(c, [[x, y], [x + (r() - 0.5) * 20, y - hh]], 9, INK); line(c, [[x, y], [x + (r() - 0.5) * 20, y - hh]], 5, col); }
};
const magpie = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const K = "#2f2b3c";
  line(c, [[-6, -36], [-8, -4]], 6); line(c, [[14, -36], [12, -4]], 6);
  shape(c, () => polyP(c, [[40, -66], [120, -150], [136, -130], [64, -50]]), K, 6);
  shape(c, () => polyP(c, [[60, -80], [150, -132], [140, -116], [68, -54]]), WHITE, 0);
  shape(c, () => ell(c, 0, -68, 54, 34, -0.35), K, 6);
  shape(c, () => ell(c, -14, -52, 38, 20, -0.35), WHITE, 4);
  line(c, [[-4, -84], [40, -74]], 6, WHITE);
  shape(c, () => ell(c, -46, -108, 24, 22), K, 6);
  shape(c, () => polyP(c, [[-66, -118], [-96, -128], [-66, -104]]), K, 5);
  shape(c, () => ell(c, -50, -114, 5, 5), WHITE, 2);
  c.restore();
};
// a dog in side view facing left, feet on y, centre x. mood: happy (tail up, ears up), scared (tail tucked, ears flat), calm
const dog = (c: Ctx, x: number, y: number, s: number, mood: "happy" | "scared" | "calm" = "calm", flip = false, rot = 0, col: string = COL.brown, dk: string = COL.soil) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); c.translate(0, -135); c.rotate(rot); c.translate(0, 135);
  shadow(c, 20, 6, 150, 16);
  const leg = (lx: number, ly: number) => { line(c, [[lx, -90], [lx, ly]], 34, INK); line(c, [[lx, -90], [lx, ly]], 22, col); shape(c, () => ell(c, lx - 6, ly - 2, 22, 12), dk, 4); };
  leg(75, -8); leg(-70, -8);
  // tail
  const tail = mood === "happy" ? [[100, -160], [150, -215], [150, -280]] : mood === "scared" ? [[100, -110], [130, -60], [95, -30]] : [[100, -150], [150, -150], [175, -110]];
  line(c, [[100, -140], ...tail], 24, INK); line(c, [[100, -140], ...tail], 12, col);
  shape(c, () => ell(c, 0, -135, 118, 56), col, 6);
  shade(c, () => ell(c, 0, -135, 118, 56), dk, 18, 26, 0.5);
  leg(100, -8); leg(-45, -8);
  const hy = mood === "scared" ? -170 : -195;
  shape(c, () => ell(c, -130, hy, 50, 46), col, 6);
  shape(c, () => ell(c, -178, hy + 14, 34, 24), "#e0ab72", 5);
  shape(c, () => ell(c, -206, hy + 6, 11, 8), INK, 0);
  if (mood === "happy") { shape(c, () => ell(c, -178, hy + 42, 14, 18), COL.red, 4); line(c, [[-205, hy + 26], [-165, hy + 30]], 4); }
  else if (mood === "scared") line(c, [[-205, hy + 26], [-165, hy + 30]], 4);
  else line(c, [[-205, hy + 26], [-165, hy + 30]], 4);
  if (mood === "happy") shape(c, () => polyP(c, [[-125, hy - 36], [-140, hy - 105], [-90, hy - 40]]), dk, 5);
  else if (mood === "scared") shape(c, () => ell(c, -95, hy - 2, 36, 12, 0.35), dk, 5);
  else shape(c, () => ell(c, -102, hy + 12, 18, 34, 0.2), dk, 5);
  shape(c, () => ell(c, -138, hy - 10, mood === "scared" ? 11 : 7, mood === "scared" ? 12 : 8), mood === "scared" ? WHITE : INK, mood === "scared" ? 4 : 0);
  if (mood === "scared") shape(c, () => ell(c, -138, hy - 10, 4, 5), INK, 0);
  c.restore();
};
// a dog's face from the front. mood happy, scared, angry

const dogStand = (c: Ctx, x: number, y: number, s: number, kind: "stand" | "sniff" | "bark" | "scratch" | "sleep") => {
  const col = COL.brown, dk = COL.soil;
  if (kind === "sleep") {
    c.save(); c.translate(x, y); c.scale(s, s);
    shadow(c, 0, 6, 170, 16);
    const body = () => ell(c, 20, -50, 140, 50);
    shape(c, body, col, 6); shade(c, body, dk, 14, 16, 0.5);
    line(c, [[150, -40], [190, -20], [150, -10]], 18, INK); line(c, [[150, -40], [190, -20], [150, -10]], 9, col);
    shape(c, () => ell(c, -130, -34, 52, 40), col, 6);
    shape(c, () => ell(c, -170, -20, 34, 22), "#e0ab72", 5); shape(c, () => ell(c, -194, -26, 10, 8), INK, 0);
    shape(c, () => ell(c, -100, -62, 18, 32, 0.4), dk, 5);
    line(c, [[-150, -50], [-132, -44]], 5);
    shape(c, () => ell(c, -60, -2, 54, 14), dk, 5);
    c.restore();
    return;
  }
  if (kind === "scratch") {
    dog(c, x, y, s, "calm");
    c.save(); c.translate(x, y); c.scale(s, s);
    line(c, [[95, -120], [70, -215], [-10, -250], [-75, -222]], 26, INK); line(c, [[95, -120], [70, -215], [-10, -250], [-75, -222]], 14, col);
    shape(c, () => ell(c, -80, -220, 14, 10), dk, 4);
    c.restore();
    return;
  }
  dog(c, x, y, s, kind === "bark" ? "happy" : "calm", false, kind === "sniff" ? -0.28 : 0);
};

// ------------------------------------------------------------ homes and signs
const hex = (c: Ctx, x: number, y: number, r: number, fill: string) => shape(c, () => polyP(c, [0, 1, 2, 3, 4, 5].map((i) => [x + Math.cos(Math.PI / 6 + (i * Math.PI) / 3) * r, y + Math.sin(Math.PI / 6 + (i * Math.PI) / 3) * r])), fill, 4);
const honeycomb = (c: Ctx, x: number, y: number, r: number, rows = 3, cols = 3) => {
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) hex(c, x + (i - (cols - 1) / 2) * r * 1.74 + (j % 2 ? r * 0.87 : 0) - r * 0.43, y + (j - (rows - 1) / 2) * r * 1.5, r, j === 1 && i === 1 ? COL.orange : COL.yellow);
};
const web = (c: Ctx, x: number, y: number, r: number) => {
  const n = 8, pts = (k: number) => [...Array(n)].map((_, i) => [x + Math.cos((i / n) * Math.PI * 2) * r * k, y + Math.sin((i / n) * Math.PI * 2) * r * k]);
  for (const k of [0.3, 0.55, 0.8, 1]) { const p = pts(k); line(c, [...p, p[0]], 4, INK); }
  for (const p of pts(1)) line(c, [[x, y], p], 4, INK);
};
const spider = (c: Ctx, x: number, y: number, s: number) => {
  for (const m of [-1, 1]) for (const k of [-1, 0, 1, 2]) line(c, [[x, y], [x + m * 26 * s, y + (k - 1) * 14 * s - 12 * s], [x + m * 44 * s, y + (k - 0.5) * 22 * s]], 4 * s);
  shape(c, () => ell(c, x, y + 12 * s, 14 * s, 18 * s), "#4a3a30", 4); shape(c, () => ell(c, x, y - 10 * s, 9 * s, 9 * s), "#4a3a30", 4);
};
const moundHole = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 10 * s, y + 4, 130 * s, 14 * s);
  shape(c, () => { c.moveTo(x - 130 * s, y); c.quadraticCurveTo(x - 90 * s, y - 100 * s, x, y - 100 * s); c.quadraticCurveTo(x + 90 * s, y - 100 * s, x + 130 * s, y); c.closePath(); }, "#a8723f", 6);
  shape(c, () => ell(c, x - 6 * s, y - 36 * s, 46 * s, 36 * s), "#3a2a20", 5);
};
const stickNest = (c: Ctx, x: number, y: number, s: number, eggs = 0, chicks = false) => {
  const bowl = () => { c.moveTo(x - 110 * s, y - 40 * s); c.quadraticCurveTo(x - 90 * s, y + 50 * s, x, y + 56 * s); c.quadraticCurveTo(x + 90 * s, y + 50 * s, x + 110 * s, y - 40 * s); c.closePath(); };
  if (chicks) for (const dx of [-45, 5, 55]) { shape(c, () => ell(c, x + dx * s, y - 52 * s, 28 * s, 30 * s), "#f2d9a0", 4); shape(c, () => polyP(c, [[x + dx * s - 14 * s, y - 62 * s], [x + dx * s + 14 * s, y - 62 * s], [x + dx * s, y - 88 * s]]), COL.orange, 3); shape(c, () => ell(c, x + dx * s - 8 * s, y - 52 * s, 3 * s, 3 * s), INK, 0); shape(c, () => ell(c, x + dx * s + 8 * s, y - 52 * s, 3 * s, 3 * s), INK, 0); }
  for (let i = 0; i < eggs; i++) shape(c, () => ell(c, x + (i - (eggs - 1) / 2) * 56 * s, y - 40 * s, 24 * s, 30 * s), "#bfe0d4", 4);
  shape(c, bowl, COL.brown, 6);
  c.save(); c.beginPath(); bowl(); c.clip(); for (let i = -4; i <= 4; i++) { line(c, [[x + i * 28 * s - 40 * s, y - 40 * s], [x + i * 28 * s + 40 * s, y + 60 * s]], 5 * s, COL.soil); line(c, [[x + i * 28 * s + 40 * s, y - 40 * s], [x + i * 28 * s - 40 * s, y + 60 * s]], 5 * s, "#d9a96a"); } c.restore();
  c.beginPath(); bowl(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const weaverNest = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x - 150 * s, y - 20 * s], [x + 150 * s, y - 20 * s]], 12, COL.soil);
  line(c, [[x, y - 20 * s], [x, y + 30 * s]], 8, INK);
  const b = () => { c.moveTo(x - 36 * s, y + 30 * s); c.bezierCurveTo(x - 90 * s, y + 90 * s, x - 70 * s, y + 220 * s, x - 20 * s, y + 250 * s); c.lineTo(x + 20 * s, y + 250 * s); c.bezierCurveTo(x + 70 * s, y + 220 * s, x + 90 * s, y + 90 * s, x + 36 * s, y + 30 * s); c.closePath(); };
  shape(c, b, "#c9b45a", 6); shade(c, b, "#a08f3c", 18 * s, 10 * s, 0.5);
  c.save(); c.beginPath(); b(); c.clip(); for (let i = 0; i < 9; i++) line(c, [[x - 80 * s, y + 50 * s + i * 24 * s], [x + 80 * s, y + 70 * s + i * 24 * s]], 3, "#8a7a2c"); c.restore();
  shape(c, () => ell(c, x, y + 232 * s, 17 * s, 11 * s), "#3a2a20", 4);
};
const leafNest = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y - 160 * s], [x, y - 90 * s]], 10, COL.soil);
  const l = (m: number) => { c.moveTo(x, y - 140 * s); c.quadraticCurveTo(x + m * 150 * s, y - 100 * s, x + m * 40 * s, y + 130 * s); c.quadraticCurveTo(x + m * 6 * s, y, x, y - 140 * s); c.closePath(); };
  shape(c, () => l(-1), COL.leaf, 6); shape(c, () => l(1), COL.greenLt, 6);
  for (let i = 0; i < 7; i++) { const yy = y - 90 * s + i * 30 * s; line(c, [[x - 14 * s, yy], [x + 14 * s, yy + 6 * s]], 5, "#f4f1e4"); }
  shape(c, () => ell(c, x, y + 120 * s, 22 * s, 30 * s), "#e8c46a", 4);
};
const mound = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 14 * s, y + 4, 130 * s, 14 * s);
  const m = () => { c.moveTo(x - 120 * s, y); c.quadraticCurveTo(x - 80 * s, y - 100 * s, x - 36 * s, y - 220 * s); c.quadraticCurveTo(x, y - 270 * s, x + 36 * s, y - 220 * s); c.quadraticCurveTo(x + 80 * s, y - 100 * s, x + 120 * s, y); c.closePath(); };
  shape(c, m, "#c58a58", 6); shade(c, m, "#8f5f3a", 36 * s, 14 * s, 0.5);
  for (const [dx, dy] of [[-30, -60], [30, -120], [-10, -170], [50, -50], [-60, -20]]) shape(c, () => ell(c, x + dx * s, y + dy * s, 14 * s, 8 * s), "#3a2a20", 0);
};
const hollowTree = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - 90 * s, y], [x - 70 * s, y - 330 * s], [x + 70 * s, y - 330 * s], [x + 90 * s, y]]), COL.brown, 6);
  shape(c, () => ell(c, x, y - 200 * s, 50 * s, 70 * s), "#3a2a20", 5);
  shape(c, () => ell(c, x, y - 215 * s, 36 * s, 34 * s), "#a58a68", 4);
  for (const m of [-1, 1]) { shape(c, () => ell(c, x + m * 14 * s, y - 220 * s, 12 * s, 12 * s), WHITE, 3); shape(c, () => ell(c, x + m * 14 * s, y - 220 * s, 6 * s, 6 * s), COL.yellow, 2); }
  shape(c, () => ell(c, x, y - 120 * s, 0.1, 0.1), COL.brown, 0);
};
const hangingHive = (c: Ctx, x: number, y: number, s: number) => {
  const h = () => { c.moveTo(x - 90 * s, y); c.quadraticCurveTo(x - 110 * s, y + 140 * s, x - 20 * s, y + 250 * s); c.quadraticCurveTo(x, y + 260 * s, x + 20 * s, y + 250 * s); c.quadraticCurveTo(x + 110 * s, y + 140 * s, x + 90 * s, y); c.closePath(); };
  shape(c, h, "#e7b64f", 6); shade(c, h, "#c28f2b", 20 * s, 10 * s, 0.5);
  c.save(); c.beginPath(); h(); c.clip(); for (let j = 0; j < 8; j++) for (let i = 0; i < 5; i++) { const hx = x - 80 * s + i * 40 * s + (j % 2 ? 20 * s : 0), hy = y + 20 * s + j * 32 * s; c.beginPath(); c.arc(hx, hy, 12 * s, 0, Math.PI * 2); c.strokeStyle = "#a8721c"; c.lineWidth = 3; c.stroke(); } c.restore();
  c.beginPath(); h(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (const [dx, dy] of [[-40, 60], [30, 100], [-10, 170], [50, 190], [-50, 140], [5, 30]]) beeSmall(c, x + dx * s, y + dy * s, 0.55 * s);
};
const beeSmall = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x - 16 * s, y - 24 * s, 20 * s, 12 * s, -0.5), "rgba(214,236,250,0.9)", 3);
  shape(c, () => ell(c, x, y, 30 * s, 20 * s), COL.yellow, 4);
  line(c, [[x - 6 * s, y - 18 * s], [x - 6 * s, y + 18 * s]], 7 * s); line(c, [[x + 12 * s, y - 16 * s], [x + 12 * s, y + 16 * s]], 7 * s);
  shape(c, () => ell(c, x - 30 * s, y, 11 * s, 11 * s), INK, 0);
};
const feather = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(-0.8); c.scale(s, s);
  shape(c, () => { c.moveTo(0, -150); c.quadraticCurveTo(70, -80, 40, 60); c.lineTo(0, 100); c.lineTo(-40, 60); c.quadraticCurveTo(-70, -80, 0, -150); c.closePath(); }, "#5b8fd6", 6);
  line(c, [[0, -140], [0, 150]], 7);
  for (const k of [-90, -40, 10, 50]) { line(c, [[0, k], [40 + k * 0.1, k - 30]], 3, "#3f6fb3"); line(c, [[0, k], [-40 - k * 0.1, k - 30]], 3, "#3f6fb3"); }
  c.restore();
};
const paw = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y + 30 * s, 60 * s, 46 * s), COL.soilDk, 5);
  for (const [dx, dy] of [[-62, -22], [-22, -62], [22, -62], [62, -22]]) shape(c, () => ell(c, x + dx * s, y + dy * s, 20 * s, 26 * s, dx * 0.012), COL.soilDk, 5);
};
const chewedLeaf = (c: Ctx, x: number, y: number, s: number) => {
  const l = () => { c.moveTo(x - 130 * s, y + 50 * s); c.quadraticCurveTo(x - 20 * s, y - 150 * s, x + 130 * s, y - 80 * s); c.quadraticCurveTo(x + 60 * s, y + 110 * s, x - 130 * s, y + 50 * s); c.closePath(); };
  shape(c, l, COL.leaf, 6);
  const bites = [[x + 70 * s, y - 100 * s, 36 * s], [x + 110 * s, y - 40 * s, 28 * s], [x + 20 * s, y + 70 * s, 30 * s]];
  for (const [bx, by, br] of bites) { c.beginPath(); c.arc(bx, by, br, 0, Math.PI * 2); c.fillStyle = WHITE; c.fill(); }
  c.save(); c.beginPath(); l(); c.clip(); for (const [bx, by, br] of bites) { c.beginPath(); c.arc(bx, by, br, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); } c.restore();
  line(c, [[x - 120 * s, y + 46 * s], [x + 20 * s, y - 20 * s]], 4, COL.leafDk);
};
const eggshell = (c: Ctx, x: number, y: number, s: number) => {
  const sh = () => { c.moveTo(x - 80 * s, y + 20 * s); c.bezierCurveTo(x - 80 * s, y - 110 * s, x + 80 * s, y - 110 * s, x + 80 * s, y + 20 * s); for (let i = 0; i < 5; i++) { c.lineTo(x + (60 - i * 30) * s, y + (i % 2 ? 20 : -14) * s); } c.closePath(); };
  shape(c, sh, "#f7ecd5", 6); shade(c, sh, "#e3d2ab", 14 * s, 8 * s, 0.6);
  shape(c, () => ell(c, x + 90 * s, y + 70 * s, 34 * s, 22 * s, 0.4), "#f7ecd5", 5);
};
const snailShell = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 100 * s, 90 * s), "#d9a96a", 6);
  c.beginPath(); for (let a = 0; a < 14; a += 0.15) { const r = 8 * s + a * 5.6 * s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.9); } c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
};
const pin = (c: Ctx, x: number, y: number) => { shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - 44, y - 50, x - 40, y - 100, x, y - 100); c.bezierCurveTo(x + 40, y - 100, x + 44, y - 50, x, y); c.closePath(); }, RED, 5); shape(c, () => ell(c, x, y - 66, 12, 12), WHITE, 3); };
const stopwatch = (c: Ctx, x: number, y: number, r: number, handAng = -1.0) => {
  shadow(c, x + r * 0.15, y + r * 1.05, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.3, r * 0.36, r * 0.3, 5), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.64, y + Math.sin(a) * r * 0.64], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], 4); }
  line(c, [[x, y], [x + Math.cos(handAng) * r * 0.6, y + Math.sin(handAng) * r * 0.6]], 7, RED);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
const childHead = (c: Ctx, x: number, y: number, r: number, closed = false) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child, 6);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  for (const m of [-1, 1]) { if (closed) { c.beginPath(); c.arc(x + m * r * 0.38, y + r * 0.02, r * 0.14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); } else shape(c, () => ell(c, x + m * r * 0.38, y + r * 0.05, r * 0.1, r * 0.13), INK, 0); }
  c.beginPath(); c.arc(x, y + r * 0.3, r * 0.4, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
};
const thermo = (c: Ctx, x: number, y: number, len: number, fill: number) => {
  shadow(c, x + len / 2, y + 28, len / 2 + 10, 8);
  shape(c, () => rrect(c, x, y - 18, len, 36, 18), WHITE, 5);
  shape(c, () => rrect(c, x + 6, y - 9, 28 + (len - 70) * fill, 18, 9), RED, 0);
  shape(c, () => ell(c, x + 22, y, 26, 26), RED, 5);
  for (let i = 0; i < 8; i++) line(c, [[x + 60 + i * ((len - 90) / 7), y - 18], [x + 60 + i * ((len - 90) / 7), y - (i % 2 ? 26 : 32)]], 4);
};

// ------------------------------------------------------------ the cards
// flow.e1  Busy Times: a water bowl at 7, 12 and 5 o'clock
const busyPanel = (c: Ctx, x: number, hour: number, sky: string, sx: number, sy: number) => {
  clip(c, x, 50, 340, 980, 30, () => {
    c.fillStyle = sky; c.fillRect(x, 50, 340, 980);
    c.fillStyle = GRASS; c.fillRect(x, 720, 340, 320);
    line(c, [[x, 720], [x + 340, 720]], 5);
    sun(c, x + sx, sy, 50);
  });
  tile(c, x, 50, 340, 980, "rgba(255,255,255,0)", 30);
  clock(c, x + 170, 330, 78, hour);
  bowl(c, x + 120, 860, 85);
  pigeon(c, x + 262, 950, 0.62);
};
const flowE1 = (c: Ctx) => {
  ground(c);
  busyPanel(c, 20, 7, "#fde3b5", 70, 600);
  busyPanel(c, 370, 12, "#bfe6f7", 170, 140);
  busyPanel(c, 720, 5, "#f6b98a", 270, 600);
};
// flow.e2  Cool Home Test: a thermometer in the open sun and one in a burrow
const flowE2 = (c: Ctx) => {
  ground(c, SKYD);
  sun(c, 230, 190, 85);
  for (const dx of [-60, 0, 60]) line(c, [[150 + dx + 100, 330], [160 + dx + 100, 370], [140 + dx + 100, 410]], 6, COL.orange);
  c.fillStyle = "#b07845"; c.fillRect(0, 580, 1080, 500);
  c.fillStyle = "#8a5a3c"; c.fillRect(0, 580, 1080, 20);
  line(c, [[0, 580], [1080, 580]], 6);
  for (const [px, py] of [[90, 700], [250, 790], [420, 920], [140, 960], [330, 660]]) shape(c, () => ell(c, px, py, 22, 14), "#8a5a3c", 4);
  thermo(c, 70, 548, 360, 0.85);
  const tun = () => { c.moveTo(830, 580); c.lineTo(940, 580); c.lineTo(840, 780); c.quadraticCurveTo(800, 880, 720, 900); c.lineTo(520, 900); c.quadraticCurveTo(440, 820, 520, 740); c.quadraticCurveTo(600, 700, 700, 720); c.quadraticCurveTo(760, 740, 830, 580); c.closePath(); };
  shape(c, tun, "#3a2a20", 6);
  thermo(c, 530, 820, 360, 0.4);
  for (const [px, py] of [[700, 1000], [900, 960], [600, 1040]]) shape(c, () => ell(c, px, py, 22, 14), "#8a5a3c", 4);
};
// flow.a1  Ten-Minute Window Watch
const flowA1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 60, 840, 640, 14), COL.sky, 8);
  clip(c, 128, 68, 824, 624, 8, () => {
    c.fillStyle = COL.sky; c.fillRect(128, 68, 824, 624);
    c.fillStyle = "#cfe3a8"; c.fillRect(128, 560, 824, 140);
    tree(c, 300, 600, 0.9);
    line(c, [[128, 270], [952, 250]], 6);
    crow(c, 720, 262, 0.62, false);
    c.fillStyle = "#e0d4bd"; c.fillRect(128, 628, 824, 64); line(c, [[128, 628], [952, 628]], 5);
    pigeon(c, 560, 628, 0.62);
  });
  line(c, [[540, 68], [540, 692]], 12); line(c, [[128, 380], [952, 380]], 12);
  shape(c, () => rrect(c, 100, 690, 880, 36, 8), "#e0d4bd", 6);
  stopwatch(c, 250, 880, 78, -1.6);
  notebook(c, 700, 880, 380, 190, 0, 4);
  pencil(c, 640, 930, 800, 840);
};
// flow.a2  Animal Homes Walk and Map
const flowA2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 60, 960, 960, 24), "#f7efd8", 8);
  clip(c, 66, 66, 948, 948, 20, () => { c.fillStyle = "#e6f0c8"; c.fillRect(66, 66, 948, 948); });
  shape(c, () => rrect(c, 60, 60, 960, 960, 24), "rgba(0,0,0,0)", 8);
  // the house in the middle
  shape(c, () => polyP(c, [[470, 520], [540, 450], [610, 520]]), RED, 6);
  shape(c, () => rrect(c, 480, 520, 120, 90, 4), "#f7ecd5", 6);
  shape(c, () => rrect(c, 524, 550, 32, 60, 4), COL.brown, 4);
  dash(c, [[540, 625], [420, 700], [300, 760]], 8, RED, 18, 14);
  dash(c, [[560, 450], [640, 340], [740, 290]], 8, RED, 18, 14);
  dash(c, [[490, 480], [380, 400], [290, 340]], 8, RED, 18, 14);
  dash(c, [[600, 590], [690, 680], [770, 760]], 8, RED, 18, 14);
  // nest in a tree, hive, burrow, web
  tree(c, 240, 420, 0.5); stickNest(c, 240, 300, 0.32, 0);
  hangingHive(c, 760, 150, 0.5);
  moundHole(c, 280, 820, 0.9);
  web(c, 790, 820, 110); spider(c, 790, 830, 0.7);
  pin(c, 240, 190); pin(c, 760, 130); pin(c, 290, 700); pin(c, 790, 700);
};
// flow.a3  Animal Signs Bingo
const flowA3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 50, 980, 980, 26), "#f7efd8", 8);
  const icons: ((x: number, y: number) => void)[] = [
    (x, y) => feather(c, x, y, 0.8), (x, y) => paw(c, x, y - 10, 1.0), (x, y) => stickNest(c, x, y - 10, 0.8, 3),
    (x, y) => { web(c, x, y, 105); spider(c, x, y + 4, 0.7); }, (x, y) => moundHole(c, x, y + 70, 0.9), (x, y) => honeycomb(c, x, y, 44),
    (x, y) => chewedLeaf(c, x, y, 0.95), (x, y) => eggshell(c, x - 10, y, 1.0), (x, y) => snailShell(c, x, y, 0.95),
  ];
  icons.forEach((f, i) => { const cx = 205 + (i % 3) * 335, cy = 205 + Math.floor(i / 3) * 335; shape(c, () => rrect(c, cx - 150, cy - 150, 300, 300, 22), WHITE, 6); clip(c, cx - 150, cy - 150, 300, 300, 22, () => f(cx, cy)); });
  for (const i of [0, 1, 3, 7]) { const cx = 205 + (i % 3) * 335, cy = 205 + Math.floor(i / 3) * 335; c.beginPath(); c.arc(cx + 100, cy - 100, 42, 0, Math.PI * 2); c.fillStyle = WHITE; c.fill(); line(c, [[cx + 78, cy - 100], [cx + 96, cy - 80], [cx + 126, cy - 124]], 12, RED); }
};
// flow.a5  Town, Village, Forest: the crow lives in all three
const flowA5 = (c: Ctx) => {
  ground(c);
  const cols = [20, 370, 720];
  cols.forEach((x, i) => {
    clip(c, x, 70, 340, 940, 30, () => {
      c.fillStyle = i === 2 ? "#a8d18a" : SKYD; c.fillRect(x, 70, 340, 940);
      c.fillStyle = i === 0 ? "#cfc9bd" : i === 1 ? "#d8c58e" : "#7fae52"; c.fillRect(x, 760, 340, 250); line(c, [[x, 760], [x + 340, 760]], 5);
      if (i === 0) { shape(c, () => rrect(c, x + 30, 220, 150, 540, 6), "#e9d6b8", 6); for (let r = 0; r < 5; r++) for (let q = 0; q < 2; q++) shape(c, () => rrect(c, x + 56 + q * 70, 260 + r * 100, 40, 56, 4), COL.sky, 4); shape(c, () => rrect(c, x + 190, 380, 120, 380, 6), "#d9b8a0", 6); for (let r = 0; r < 3; r++) shape(c, () => rrect(c, x + 220, 420 + r * 110, 50, 60, 4), COL.sky, 4); }
      if (i === 1) { shape(c, () => polyP(c, [[x + 40, 520], [x + 130, 400], [x + 220, 520]]), "#c9a64a", 6); shape(c, () => rrect(c, x + 56, 520, 148, 240, 4), "#e8d2a8", 6); shape(c, () => rrect(c, x + 100, 640, 56, 120, 4), COL.brown, 4); tree(c, x + 290, 770, 0.55); }
      if (i === 2) { tree(c, x + 70, 780, 0.9, COL.leafDk, "#2a5a24"); tree(c, x + 280, 780, 0.8, COL.leafDk, "#2a5a24"); }
    });
    tile(c, x, 70, 340, 940, "rgba(0,0,0,0)", 30);
  });
  dogStand(c, 250, 930, 0.5, "stand"); crow(c, 110, 940, 0.42);
  cow(c, 570, 940, 0.52); crow(c, 500, 410, 0.36);
  tiger(c, 940, 910, 0.45); crow(c, 790, 940, 0.38);
};
// flow.a6  Sound Map: me in the middle, sounds around
const flowA6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 50, 980, 980, 26), "#f7efd8", 8);
  dashEll(c, 540, 540, 140, 140, 5, COL.steelDk); dashEll(c, 540, 540, 270, 270, 5, COL.steelDk);
  childHead(c, 540, 540, 80, true);
  crow(c, 540, 270, 0.55); pigeon(c, 220, 560, 0.6); dogStand(c, 880, 600, 0.5, "bark"); squirrel(c, 540, 930, 0.6, true);
  for (const [x0, y0, x1, y1] of [[540, 290, 540, 420], [300, 520, 420, 535], [770, 560, 660, 548], [540, 800, 540, 670]]) arrow(c, [[x0, y0], [x1, y1]], RED, 9);
  waves(c, 372, 215, -1, 2, 30, INK); waves(c, 790, 215, 1, 2, 30, INK);
};
// flow.p1  My Animal Week: seven days of watching
const flowP1 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 7; i++) { const x = 100 + i * 142; shape(c, () => rrect(c, x - 52, 70, 104, 104, 20), i < 6 ? WHITE : "#fff4cf", 5); if (i < 6) line(c, [[x - 24, 124], [x - 6, 146], [x + 28, 98]], 11, COL.green); else star(c, x, 122, 34); }
  shape(c, () => rrect(c, 50, 240, 980, 760, 24), WHITE, 7);
  line(c, [[540, 240], [540, 1000]], 6);
  crow(c, 330, 800, 1.05);
  line(c, [[110, 830], [550, 830]], 4, COL.steelDk);
  line(c, [[600, 760], [980, 760]], 7);
  arrow(c, [[600, 760], [985, 760]], RED, 9);
  sun(c, 650, 640, 34); sun(c, 790, 480, 44); moon(c, 930, 640, 36);
  for (const x of [650, 790, 930]) line(c, [[x, 730], [x, 790]], 6);
  pencil(c, 700, 960, 900, 880);
};
// flow.c2  Share the Space: pigeons and an air conditioner
const flowC2 = (c: Ctx) => {
  ground(c, "#ead9bd");
  c.fillStyle = "#dcc8a6"; for (let y = 120; y < 1080; y += 120) c.fillRect(0, y, 1080, 6);
  shape(c, () => rrect(c, 80, 330, 440, 340, 24), "#f4f1e8", 7);
  shade(c, () => rrect(c, 80, 330, 440, 340, 24), "#cfc9bd", 20, 24, 0.5);
  shape(c, () => ell(c, 300, 500, 125, 125), COL.steel, 6);
  shape(c, () => ell(c, 300, 500, 100, 100), "#8a93a3", 4);
  for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + 0.4; shape(c, () => { c.moveTo(300, 500); c.quadraticCurveTo(300 + Math.cos(a - 0.5) * 100, 500 + Math.sin(a - 0.5) * 100, 300 + Math.cos(a) * 92, 500 + Math.sin(a) * 92); c.quadraticCurveTo(300 + Math.cos(a + 0.2) * 40, 500 + Math.sin(a + 0.2) * 40, 300, 500); c.closePath(); }, COL.steel, 4); }
  shape(c, () => ell(c, 300, 500, 18, 18), INK, 0);
  line(c, [[130, 670], [130, 760]], 14); line(c, [[470, 670], [470, 760]], 14);
  line(c, [[110, 760], [150, 760]], 14); line(c, [[450, 760], [490, 760]], 14);
  pigeon(c, 230, 330, 0.62);
  // a shelf for them, fixed to the wall beside
  shape(c, () => rrect(c, 640, 600, 340, 30, 6), COL.wood, 6);
  line(c, [[680, 630], [680, 700], [740, 630]], 10); line(c, [[940, 630], [940, 700], [880, 630]], 10);
  shape(c, () => polyP(c, [[620, 380], [1000, 380], [960, 340], [660, 340]]), COL.brown, 6);
  line(c, [[680, 380], [680, 440]], 8); line(c, [[940, 380], [940, 440]], 8);
  stickNest(c, 810, 620, 0.5, 2);
  pigeon(c, 710, 600, 0.56); pigeon(c, 920, 600, 0.56, true);
  arrow(c, [[400, 270], [530, 230], [650, 290]], RED, 11);
};

// term.0  Animal: an ant, a crow, a cow, a fish and you
const termAnimal = (c: Ctx) => {
  ground(c);
  const cell = (x: number, y: number, w: number, h: number, f: () => void) => { tile(c, x, y, w, h, WHITE, 26); clip(c, x, y, w, h, 26, f); };
  cell(40, 90, 320, 420, () => ant(c, 200, 330, 1.05));
  cell(380, 90, 320, 420, () => crow(c, 570, 400, 0.88));
  cell(720, 90, 320, 420, () => cow(c, 880, 430, 0.75));
  cell(130, 560, 380, 420, () => fishy(c, 320, 770, 300));
  cell(570, 560, 380, 420, () => person(c, 760, 940, 360));
};
// term.1  Habit: a crow calls at six in the morning
const termHabit = (c: Ctx) => {
  ground(c, "#fbdcb2");
  c.fillStyle = "#f6b98a"; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 5);
  sun(c, 160, 700, 70, COL.yellow);
  clock(c, 350, 360, 240, 6, 0);
  line(c, [[600, 800], [1060, 800]], 14, COL.soil);
  crow(c, 860, 790, 1.05, true, true);
  waves(c, 700, 640, -1, 3, 36, INK);
};
// term.2  Behaviour: scratching, sleeping, barking, sniffing
const zed = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - 18 * s, y - 18 * s], [x + 18 * s, y - 18 * s], [x - 18 * s, y + 18 * s], [x + 18 * s, y + 18 * s]], 7 * s);
const termBehaviour = (c: Ctx) => {
  ground(c);
  const q: [number, number, "scratch" | "sleep" | "bark" | "sniff"][] = [[50, 60, "scratch"], [550, 60, "sleep"], [50, 560, "bark"], [550, 560, "sniff"]];
  for (const [x, y, k] of q) {
    tile(c, x, y, 480, 460, "#e9f3d2", 26);
    clip(c, x, y, 480, 460, 26, () => {
      c.fillStyle = GRASS; c.fillRect(x, y + 330, 480, 140); line(c, [[x, y + 330], [x + 480, y + 330]], 5);
      dogStand(c, x + 270, y + 400, 0.78, k);
      if (k === "sleep") { zed(c, x + 130, y + 190, 1.1); zed(c, x + 90, y + 130, 0.8); zed(c, x + 60, y + 80, 0.6); }
      if (k === "bark") waves(c, x + 100, y + 190, -1, 3, 44, INK);
      if (k === "sniff") { for (const dx of [0, 36, 72]) shape(c, () => ell(c, x + 50 + dx, y + 400 + (dx % 2) * 8, 8, 6), COL.soilDk, 0); }
      if (k === "scratch") { line(c, [[x + 150, y + 150], [x + 130, y + 175]], 6); line(c, [[x + 175, y + 140], [x + 160, y + 170]], 6); }
    });
  }
};
// term.9  Diurnal: day animals under the sun
const termDiurnal = (c: Ctx) => {
  ground(c, "#bfe6f7");
  sun(c, 800, 200, 110);
  cloud(c, 230, 190, 100);
  c.fillStyle = GRASS; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 5);
  squirrel(c, 330, 900, 1.6); crow(c, 770, 880, 1.2, true);
};
// term.14  Territory: a magpie robin and his garden patch
const termTerritory = (c: Ctx) => {
  ground(c, SKYD);
  c.fillStyle = GRASS; c.fillRect(0, 440, 1080, 640); line(c, [[0, 440], [1080, 440]], 5);
  shape(c, () => ell(c, 540, 760, 460, 220), "#b9d98a", 0);
  dashEll(c, 540, 760, 460, 220, 11, RED);
  line(c, [[540, 780], [540, 520]], 18, COL.soil);
  line(c, [[540, 560], [680, 500]], 12, COL.soil); line(c, [[540, 610], [410, 560]], 12, COL.soil);
  shape(c, () => ell(c, 540, 500, 12, 12), COL.leaf, 0);
  magpie(c, 560, 500, 1.25);
  note(c, 330, 250, 1.4); note(c, 440, 170, 1.2); note(c, 250, 160, 1); 
  for (const [x, y] of [[170, 650], [900, 650], [200, 880], [880, 890]]) { shape(c, () => ell(c, x, y, 40, 24), COL.green, 5); shape(c, () => ell(c, x + 6, y - 20, 26, 20), COL.greenLt, 4); }
};
// term.15  Observe: sit still and watch a pigeon
const termObserve = (c: Ctx) => {
  ground(c, SKYD);
  c.fillStyle = "#e9d6b8"; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 5);
  shape(c, () => rrect(c, 130, 700, 270, 40, 8), COL.wood, 6); line(c, [[160, 740], [160, 860]], 10); line(c, [[370, 740], [370, 860]], 10);
  person(c, 265, 700, 520, { sit: true });
  notebook(c, 345, 570, 140, 100, -0.3, 3);
  shape(c, () => rrect(c, 650, 700, 340, 30, 6), "#d9c9a8", 6);
  pigeon(c, 820, 700, 1.0, false);
  dash(c, [[300, 330], [450, 420], [700, 570]], 6, INK, 14, 14);
};
// term.16  Naturalist: hat, binoculars, notebook under a tree
const termNaturalist = (c: Ctx) => {
  ground(c, SKYD);
  c.fillStyle = GRASS; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  tree(c, 800, 830, 1.1);
  const x = 360, y = 960, h = 700;
  person(c, x, y, h, { adult: true, armL: [3.0, -1.2], armR: [0.14, -1.94] });
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  shape(c, () => ell(c, x, hy - head * 0.75, head * 1.7, head * 0.28), "#e8c46a", 6);
  shape(c, () => rrect(c, x - head * 0.95, hy - head * 1.6, head * 1.9, head * 1.0, head * 0.4), "#e8c46a", 6);
  line(c, [[x - head * 0.95, hy - head * 0.85], [x + head * 0.95, hy - head * 0.85]], 6, RED);
  for (const m of [-1, 1]) shape(c, () => rrect(c, x + m * h * 0.1 - h * 0.065, hy - head * 0.1, h * 0.13, h * 0.17, h * 0.04), COL.black, 5);
  shape(c, () => rrect(c, x - h * 0.03, hy + head * 0.15, h * 0.06, h * 0.06, 6), COL.black, 4);
  shape(c, () => rrect(c, 540, 900, 150, 70, 10), COL.wood, 6);
  notebook(c, 615, 880, 120, 78, 0.1, 3);
};
// term.17  Tally: tick marks in fives next to a pigeon
const tallyGroup = (c: Ctx, x: number, y: number, n: number) => {
  for (let i = 0; i < Math.min(4, n); i++) line(c, [[x + i * 36, y], [x + i * 36, y + 150]], 10);
  if (n >= 5) line(c, [[x - 24, y + 120], [x + 4 * 36 - 12, y + 24]], 10, RED);
};
const termTally = (c: Ctx) => {
  ground(c);
  tile(c, 60, 130, 960, 820, WHITE, 28);
  pigeon(c, 250, 650, 1.15);
  tallyGroup(c, 470, 250, 5); tallyGroup(c, 470, 520, 5); tallyGroup(c, 770, 250, 5);
  tallyGroup(c, 770, 520, 3);
};

const crowFly = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const B = BLACKB;
  shape(c, () => polyP(c, [[50, -4], [140, 14], [130, -14], [56, -22]]), B, 6);
  shape(c, () => { c.moveTo(0, -16); c.quadraticCurveTo(10, -120, 70, -190); c.quadraticCurveTo(100, -150, 96, -90); c.quadraticCurveTo(80, -40, 50, -10); c.closePath(); }, "#7a7490", 6);
  shape(c, () => ell(c, 0, 0, 72, 34, -0.1), B, 6);
  shape(c, () => { c.moveTo(-6, -22); c.quadraticCurveTo(-30, -110, 20, -180); c.quadraticCurveTo(70, -120, 74, -60); c.quadraticCurveTo(60, -30, 30, -14); c.closePath(); }, "#5f5972", 6);
  shape(c, () => ell(c, -70, -10, 26, 24), B, 6);
  shape(c, () => polyP(c, [[-92, -18], [-136, -4], [-92, 0]]), "#6a6578", 6);
  shape(c, () => ell(c, -74, -16, 6, 6), WHITE, 3); shape(c, () => ell(c, -75, -16, 3, 3), INK, 0);
  c.restore();
};
const goose = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[-10, -20], [50, -170], [110, -190], [90, -40]]), "#e9e6ee", 6);
  shape(c, () => ell(c, 20, 0, 90, 34, -0.05), "#f4f1f8", 6);
  shape(c, () => polyP(c, [[-10, 10], [50, 130], [110, 140], [90, 30]]), "#cfcad8", 6);
  shape(c, () => polyP(c, [[100, -8], [150, 10], [100, 14]]), "#cfcad8", 5);
  line(c, [[-70, -6], [-130, -34], [-150, -30]], 16, INK); line(c, [[-70, -6], [-130, -34], [-150, -30]], 8, "#f4f1f8");
  shape(c, () => ell(c, -150, -32, 16, 13), "#f4f1f8", 5);
  shape(c, () => polyP(c, [[-164, -36], [-190, -26], [-164, -24]]), COL.orange, 4);
  c.restore();
};
const mosquito = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const m of [-1, 1]) line(c, [[0, 0], [m * 30, 36], [m * 44, 60]], 4);
  for (const k of [-1, 1]) line(c, [[8, 2], [8 + k * 20, 40], [8 + k * 26, 66]], 4);
  shape(c, () => ell(c, -26, -34, 40, 12, -0.5), "rgba(214,236,250,0.9)", 3);
  shape(c, () => ell(c, 10, 0, 44, 15), "#6a5a4a", 4); shape(c, () => ell(c, -34, 0, 16, 13), "#6a5a4a", 4);
  line(c, [[-48, 4], [-86, 22]], 4);
  c.restore();
};
const rat = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const R = "#9b8d84";
  shadow(c, 10, 4, 90, 10);
  line(c, [[70, -30], [130, -10], [170, -50]], 7, COL.pink);
  shape(c, () => ell(c, 20, -34, 66, 32, -0.05), R, 6);
  shape(c, () => polyP(c, [[-34, -50], [-100, -26], [-34, -10]]), R, 6);
  shape(c, () => ell(c, -100, -26, 6, 6), COL.pink, 3);
  shape(c, () => ell(c, -22, -66, 13, 13), COL.pink, 5);
  shape(c, () => ell(c, -50, -34, 4, 4), INK, 0);
  c.restore();
};
const kite = (c: Ctx, x: number, y: number, s: number, col: string) => {
  shape(c, () => polyP(c, [[x, y - 70 * s], [x + 50 * s, y], [x, y + 90 * s], [x - 50 * s, y]]), col, 5);
  line(c, [[x, y - 70 * s], [x, y + 90 * s]], 3); line(c, [[x - 50 * s, y], [x + 50 * s, y]], 3);
  line(c, [[x, y + 90 * s], [x + 30 * s, y + 150 * s], [x - 10 * s, y + 210 * s], [x + 20 * s, y + 260 * s]], 4);
};
const car = (c: Ctx, x: number, y: number, s: number, col: string) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 4, 150, 12);
  shape(c, () => rrect(c, -130, -90, 260, 70, 22), col, 6);
  shape(c, () => polyP(c, [[-80, -90], [-50, -150], [60, -150], [100, -90]]), col, 6);
  shape(c, () => polyP(c, [[-60, -96], [-40, -138], [-2, -138], [-2, -96]]), COL.sky, 4); shape(c, () => polyP(c, [[10, -96], [10, -138], [52, -138], [80, -96]]), COL.sky, 4);
  for (const wx of [-72, 72]) { shape(c, () => ell(c, wx, -20, 28, 28), INK, 0); shape(c, () => ell(c, wx, -20, 12, 12), COL.steel, 3); }
  c.restore();
};

// expl.0  A habit: the crow at dawn, noon and sunset
const explHabit = (c: Ctx) => {
  ground(c);
  const P: [number, number, string, string, number, number, number][] = [[20, 6, "#fde3b5", "#e6c98a", 70, 730, 0], [370, 12, "#bfe6f7", GRASS, 280, 380, 1], [720, 6, "#f6b98a", "#c9a56a", 280, 730, 2]];
  for (const [x, hr, sky, gr, sx, sy, k] of P) {
    clip(c, x, 60, 340, 960, 30, () => {
      c.fillStyle = sky; c.fillRect(x, 60, 340, 960);
      c.fillStyle = gr; c.fillRect(x, 780, 340, 240); line(c, [[x, 780], [x + 340, 780]], 5);
      sun(c, x + sx, sy, 46, k === 1 ? COL.yellow : COL.orange);
    });
    tile(c, x, 60, 340, 960, "rgba(0,0,0,0)", 30);
    clock(c, x + 170, 190, 80, hr);
    if (k === 0) { crow(c, x + 220, 930, 0.7, false, true); waves(c, x + 100, 810, -1, 3, 26, INK); }
    if (k === 1) { tree(c, x + 90, 800, 0.5); c.save(); c.beginPath(); rrect(c, x, 780, 340, 240, 0); c.clip(); shape(c, () => ell(c, x + 150, 940, 130, 36), "rgba(43,35,64,0.18)", 0); c.restore(); crow(c, x + 230, 930, 0.7, false, true); shape(c, () => ell(c, x + 150, 840, 8, 12), COL.drop, 3); }
    if (k === 2) { tree(c, x + 90, 800, 0.6, COL.leafDk, "#2a5a24"); crowFly(c, x + 270, 560, 0.55); arrow(c, [[x + 250, 630], [x + 190, 660], [x + 150, 640]], RED, 8); }
  }
};
// expl.1  Day, night and dawn-and-dusk animals
const explDayNight = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, R = 460;
  c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
  c.fillStyle = "#bfe6f7"; c.fillRect(0, 0, 540, 1080);
  c.fillStyle = NIGHT; c.fillRect(540, 0, 540, 1080);
  c.fillStyle = GRASS; c.fillRect(0, 800, 540, 280); c.fillStyle = "#3d5a46"; c.fillRect(540, 800, 540, 280);
  line(c, [[0, 800], [1080, 800]], 5);
  sun(c, 280, 300, 66);
  moon(c, 860, 260, 50); star(c, 680, 200, 18); star(c, 960, 400, 16); star(c, 740, 330, 12);
  squirrel(c, 340, 870, 0.7); crow(c, 480, 870, 0.42);
  bat(c, 790, 470, 0.7);
  shape(c, () => rrect(c, 640, 640, 380, 150, 14), "#3b3d70", 0); shape(c, () => rrect(c, 680, 610, 230, 22, 10), "#f6efc8", 4); gecko(c, 800, 720, 0.5);
  c.restore();
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  line(c, [[540, 80], [540, 1000]], 5, INK);
  mosquito(c, 540, 600, 0.6); mosquito(c, 540, 700, 0.45);
};
// expl.3  What homes are for: raising young, sleeping, hiding
const explHomes = (c: Ctx) => {
  ground(c);
  for (const [x, k] of [[20, 0], [370, 1], [720, 2]] as [number, number][]) {
    clip(c, x, 70, 340, 940, 30, () => {
      c.fillStyle = k === 2 ? "#e6dba0" : SKYD; c.fillRect(x, 70, 340, 940);
      if (k < 2) { c.fillStyle = GRASS; c.fillRect(x, 880, 340, 130); line(c, [[x, 700], [x + 340, 700]], 16, COL.soil); line(c, [[x, 700], [x + 340, 700]], 8, COL.brown); for (const dx of [40, 290]) shape(c, () => ell(c, x + dx, 680, 36, 20, 0.4), COL.leaf, 4); }
      else { c.fillStyle = "#cfc07a"; c.fillRect(x, 780, 340, 230); }
    });
    tile(c, x, 70, 340, 940, "rgba(0,0,0,0)", 30);
    if (k === 0) stickNest(c, x + 170, 640, 0.9, 0, true);
    if (k === 1) { stickNest(c, x + 110, 640, 0.6, 0); crow(c, x + 255, 700, 0.5); zed2(c, x + 270, 500); zed2(c, x + 300, 440); }
    if (k === 2) { tiger(c, x + 175, 860, 0.6); grassBlades(c, x + 10, x + 330, 940, 110, 5); grassBlades(c, x + 14, x + 330, 960, 80, 9, "#8dbb5e"); }
  }
};
const zed2 = (c: Ctx, x: number, y: number) => line(c, [[x - 14, y - 14], [x + 14, y - 14], [x - 14, y + 14], [x + 14, y + 14]], 6);
// expl.4  Kinds of homes: six of them
const explKinds = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 6; i++) {
    const x = 25 + (i % 3) * 350, y = 60 + Math.floor(i / 3) * 490;
    tile(c, x, y, 330, 460, i === 3 ? "#e9f3d2" : "#f7efd8", 26);
    clip(c, x, y, 330, 460, 26, () => {
      const mx = x + 165;
      if (i === 0) weaverNest(c, mx, y + 60, 0.95);
      if (i === 1) leafNest(c, mx, y + 230, 1.1);
      if (i === 2) honeycomb(c, mx, y + 230, 46, 4, 3);
      if (i === 3) { c.fillStyle = "#c9a56a"; c.fillRect(x, y + 400, 330, 60); mound(c, mx, y + 410, 0.95); }
      if (i === 4) { line(c, [[x + 30, y + 40], [x + 120, y + 130]], 12, COL.soil); line(c, [[x + 300, y + 40], [x + 210, y + 130]], 12, COL.soil); line(c, [[x + 120, y + 130], [x + 210, y + 130]], 8, COL.soil); web(c, mx, y + 250, 120); spider(c, mx + 20, y + 270, 0.7); }
      if (i === 5) { c.fillStyle = GRASS; c.fillRect(x, y + 400, 330, 60); hollowTree(c, mx, y + 430, 1.15); }
    });
  }
};
// expl.6  Why so many animals live near people: a market street
const explMarket = (c: Ctx) => {
  ground(c, "#bfe6f7");
  cloud(c, 800, 130, 90);
  kite(c, 150, 190, 0.8, RED); kite(c, 540, 120, 0.7, COL.purple); kite(c, 930, 260, 0.7, COL.yellow);
  c.fillStyle = "#e9d6b8"; c.fillRect(0, 440, 1080, 640);
  shape(c, () => rrect(c, 640, 330, 420, 420, 6), "#d9b8a0", 6);
  for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) shape(c, () => rrect(c, 690 + q * 180, 380 + r * 150, 90, 100, 5), COL.sky, 4);
  line(c, [[0, 330], [1080, 360]], 6); line(c, [[0, 390], [1080, 410]], 6);
  crow(c, 160, 354, 0.38); crow(c, 330, 358, 0.38, true); crow(c, 720, 366, 0.38);
  c.fillStyle = "#cfc9bd"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  // the stall
  for (let i = 0; i < 6; i++) shape(c, () => polyP(c, [[60 + i * 70, 460], [130 + i * 70, 460], [140 + i * 70, 540], [50 + i * 70, 540]]), i % 2 ? WHITE : RED, 5);
  line(c, [[70, 540], [70, 800]], 10); line(c, [[470, 540], [470, 800]], 10);
  shape(c, () => rrect(c, 60, 700, 420, 90, 8), COL.wood, 6);
  for (const [x, col] of [[110, RED], [190, COL.green], [270, COL.orange], [350, COL.purple], [430, COL.yellow]] as [number, string][]) shape(c, () => ell(c, x, 690, 36, 30), col, 5);
  cow(c, 800, 920, 0.62);
  rat(c, 230, 1010, 0.6);
  shape(c, () => rrect(c, 370, 975, 160, 40, 6), "#3a3540", 5);
};
// expl.7  Towns, villages and forests: some animals live in all three
const explPlaces = (c: Ctx) => {
  ground(c);
  const B: [number, string, string][] = [[40, "#cfe8f6", "#cfc9bd"], [370, "#e8f1c8", "#d8c58e"], [700, "#b9d98a", "#7fae52"]];
  B.forEach(([y, sky, gr], i) => {
    clip(c, 40, y, 1000, 320, 26, () => {
      c.fillStyle = sky; c.fillRect(40, y, 1000, 320); c.fillStyle = gr; c.fillRect(40, y + 230, 1000, 100); line(c, [[40, y + 230], [1040, y + 230]], 5);
      if (i === 0) for (const [bx, bw, bh] of [[70, 150, 180], [250, 110, 130], [760, 120, 190], [900, 130, 140]]) { shape(c, () => rrect(c, bx, y + 230 - bh, bw, bh, 5), "#e9d6b8", 5); for (let r = 0; r < 2; r++) shape(c, () => rrect(c, bx + 20, y + 230 - bh + 20 + r * 60, 34, 40, 3), COL.sky, 3); }
      if (i === 1) { shape(c, () => polyP(c, [[90, y + 130], [190, y + 50], [290, y + 130]]), "#c9a64a", 5); shape(c, () => rrect(c, 110, y + 130, 160, 100, 4), "#e8d2a8", 5); tree(c, 930, y + 240, 0.5); }
      if (i === 2) { tree(c, 120, y + 240, 0.55, COL.leafDk, "#2a5a24"); tree(c, 960, y + 240, 0.55, COL.leafDk, "#2a5a24"); tree(c, 700, y + 240, 0.4, COL.leafDk, "#2a5a24"); }
    });
  });
  tile(c, 40, 40, 1000, 320, "rgba(0,0,0,0)", 26); tile(c, 40, 370, 1000, 320, "rgba(0,0,0,0)", 26); tile(c, 40, 700, 1000, 320, "rgba(0,0,0,0)", 26);
  crow(c, 420, 270, 0.42); dogStand(c, 580, 270, 0.42, "stand");
  cow(c, 640, 600, 0.48); crow(c, 420, 600, 0.42); dogStand(c, 820, 600, 0.4, "stand");
  tiger(c, 500, 930, 0.48); crow(c, 280, 930, 0.42);
  tiger(c, 900, 920, 0.4, true);
  arrow(c, [[830, 730], [830, 640], [830, 570]], RED, 8);
};
// expl.8  Watching like a scientist: a notebook and the real pigeon
const explWatch = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 50, 960, 560, 14), COL.sky, 8);
  clip(c, 68, 58, 944, 544, 8, () => { c.fillStyle = COL.sky; c.fillRect(68, 58, 944, 544); c.fillStyle = GRASS; c.fillRect(68, 480, 944, 130); tree(c, 250, 520, 0.8); c.fillStyle = "#e0d4bd"; c.fillRect(68, 540, 944, 70); line(c, [[68, 540], [1012, 540]], 5); pigeon(c, 720, 540, 1.0); });
  line(c, [[540, 58], [540, 602]], 12);
  shape(c, () => rrect(c, 40, 596, 1000, 40, 8), "#e0d4bd", 6);
  notebook(c, 540, 840, 860, 330, 0, 0);
  pigeon(c, 290, 920, 0.62);
  for (let r = 0; r < 4; r++) line(c, [[640, 710 + r * 70], [940, 710 + r * 70]], 5); for (let q = 0; q < 4; q++) line(c, [[640 + q * 100, 710], [640 + q * 100, 920]], 5);
  clock(c, 690, 745, 30, 7); clock(c, 790, 745, 30, 12); clock(c, 890, 745, 30, 5);
  for (const [x, y] of [[690, 815], [790, 885]]) { line(c, [[x - 16, y - 10], [x - 16, y + 18]], 6); line(c, [[x, y - 10], [x, y + 18]], 6); }
  pencil(c, 450, 980, 600, 920);
};
// expl.9  Why some animals travel far: geese over the mountains at night
const explMigrate = (c: Ctx) => {
  ground(c, NIGHT);
  const r = (a: number) => a;
  for (const [x, y, s] of [[90, 90, 20], [300, 160, 14], [520, 70, 18], [760, 130, 14], [980, 80, 20], [880, 300, 12], [160, 380, 12], [650, 280, 14]]) star(c, x, y, s);
  moon(c, 930, 180, 44);
  // faint magnetic lines
  for (const [rx, ry, col] of [[300, 400, "#7a86c8"], [420, 500, "#6a76b8"], [540, 620, "#5a66a8"]] as [number, number, string][]) { c.beginPath(); c.ellipse(540, 760, rx, ry, 0, Math.PI, Math.PI * 2); c.strokeStyle = col; c.lineWidth = 6; c.setLineDash([18, 16]); c.stroke(); c.setLineDash([]); }
  const peak = (pts: number[][], col: string) => { shape(c, () => polyP(c, pts), col, 6); };
  peak([[-40, 1080], [150, 640], [380, 1080]], "#4a5a8a");
  peak([[200, 1080], [520, 560], [880, 1080]], "#5b6a9c");
  peak([[600, 1080], [860, 700], [1130, 1080]], "#4a5a8a");
  shape(c, () => polyP(c, [[440, 700], [520, 560], [600, 690], [560, 660], [520, 710], [480, 665]]), WHITE, 5);
  shape(c, () => polyP(c, [[110, 720], [150, 640], [200, 730], [165, 700], [140, 735]]), WHITE, 5);
  shape(c, () => polyP(c, [[800, 780], [860, 700], [920, 790], [880, 760], [850, 800]]), WHITE, 5);
  const V: [number, number][] = [[360, 360], [480, 290], [480, 430], [600, 220], [600, 500], [720, 150], [720, 570]];
  V.forEach(([x, y]) => goose(c, x, y, 0.5));
  arrow(c, [[250, 360], [140, 360]], RED, 12);
};
// expl.10  Watching kindly: from far away
const explKind = (c: Ctx) => {
  ground(c, SKYD);
  c.fillStyle = GRASS; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  tree(c, 850, 840, 1.0);
  stickNest(c, 870, 560, 0.42, 0, true); crow(c, 760, 600, 0.3);
  const x = 210, y = 990, h = 640;
  person(c, x, y, h, { armL: [3.0, -1.2], armR: [0.14, -1.94] });
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  for (const m of [-1, 1]) shape(c, () => rrect(c, x + m * h * 0.1 - h * 0.065, hy - head * 0.1, h * 0.13, h * 0.17, h * 0.04), COL.black, 5);
  shape(c, () => rrect(c, x - h * 0.03, hy + head * 0.15, h * 0.06, h * 0.06, 6), COL.black, 4);
  dash(c, [[290, hy + 20], [520, 700], [750, 600]], 6, INK, 14, 14);
  arrow(c, [[520, 1030], [330, 1030]], RED, 9); arrow(c, [[520, 1030], [770, 1030]], RED, 9);
};
// expl.11  City life: a bird sings higher over the traffic
const explCity = (c: Ctx) => {
  ground(c, "#cfe8f6");
  for (const [bx, bw, bh] of [[40, 180, 360], [260, 150, 260], [720, 170, 330], [900, 160, 250]]) { shape(c, () => rrect(c, bx, 780 - bh, bw, bh, 5), "#d9c7b0", 5); for (let r = 0; r < 4; r++) shape(c, () => rrect(c, bx + 24, 780 - bh + 30 + r * 70, 34, 40, 3), COL.sky, 3); }
  c.fillStyle = "#8d8a94"; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 5);
  for (let x = 40; x < 1080; x += 160) line(c, [[x, 930], [x + 90, 930]], 8, WHITE);
  shape(c, () => rrect(c, 520, 280, 24, 500, 6), COL.steelDk, 6);
  line(c, [[532, 290], [532, 260], [620, 250]], 16, INK); line(c, [[532, 290], [532, 260], [620, 250]], 8, COL.steelDk);
  shape(c, () => rrect(c, 590, 248, 80, 34, 12), COL.steel, 5);
  shape(c, () => ell(c, 630, 296, 26, 10), COL.yellow, 3);
  magpie(c, 520, 280, 0.62);
  note(c, 400, 130, 1.4); note(c, 520, 60, 1.2, INK); note(c, 640, 120, 1.4); note(c, 270, 100, 1.0); note(c, 770, 70, 1.0);
  car(c, 230, 880, 0.9, RED); car(c, 830, 1010, 0.9, COL.blue);
  for (const [x, y, d] of [[370, 800, 1], [760, 845, 1]] as [number, number, number][]) { line(c, [[x, y], [x + 30 * d, y - 18], [x + 55 * d, y + 6], [x + 85 * d, y - 18]], 8, INK); line(c, [[x, y + 40], [x + 30 * d, y + 22], [x + 55 * d, y + 46], [x + 85 * d, y + 22]], 8, INK); }
};

export const ic_animalsAnimalsAroundUsL3 = cards("sci.animals.animals-around-us.L3 cards", [
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA5, flowA6, flowP1, flowC2,
  termAnimal, termHabit, termBehaviour, termDiurnal, termTerritory, termObserve, termNaturalist, termTally,
  explHabit, explDayNight, explHomes, explKinds, explMarket, explPlaces, explWatch, explMigrate, explKind, explCity,
]);
