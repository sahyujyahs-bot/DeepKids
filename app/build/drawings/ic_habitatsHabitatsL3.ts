import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, leaf, person, hand, write, glass, bowl, cards } from "./flatKit";

// sci.habitats.habitats.L3 · flat cards for the flows, terms and explanations
const SKY = "#cfe8f7", GRASS = "#8cc152", GRASSDK = "#6aa53f", SAND = "#f1d28a", SANDDK = "#d9b45f", POND = "#7fbde6", SEA = "#3f78bd", SEADK = "#2b5a96", STONE = "#a9a39a", STONEDK = "#85807a", BRICK = "#d96b4a";

// ---- shared things
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.2, r * 0.2, 0.5);
};
const cloud = (c: Ctx, x: number, y: number, s: number, col = WHITE) => {
  const parts = [[0, 0, 70, 46], [-60, 14, 50, 36], [62, 16, 52, 34], [20, -30, 46, 40]];
  parts.forEach(([dx, dy, rx, ry]) => shape(c, () => ell(c, x + dx * s, y + dy * s, rx * s + 4, ry * s + 4), INK, 0));
  parts.forEach(([dx, dy, rx, ry]) => { c.beginPath(); ell(c, x + dx * s, y + dy * s, rx * s, ry * s); c.fillStyle = col; c.fill(); });
};
const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.5); c.bezierCurveTo(x + s * 0.2, y - s * 0.8, x + s, y - s * 0.3, x + s, y + s * 0.35); c.bezierCurveTo(x + s, y + s * 1.05, x - s, y + s * 1.05, x - s, y + s * 0.35); c.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.2, y - s * 0.8, x, y - s * 1.5); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => { shape(c, () => dropP(c, x, y, s), col, 5); shine(c, [[x - s * 0.5, y + s * 0.1], [x - s * 0.45, y + s * 0.6]], 5); };
const tree = (c: Ctx, x: number, y: number, h: number, canopy: string = COL.leaf) => {
  const w = h * 0.1;
  shadow(c, x + h * 0.2, y + 4, h * 0.34, h * 0.05);
  shape(c, () => polyP(c, [[x - w, y], [x - w * 0.6, y - h * 0.6], [x + w * 0.6, y - h * 0.6], [x + w, y]]), COL.brown, 6);
  shade(c, () => polyP(c, [[x - w, y], [x - w * 0.6, y - h * 0.6], [x + w * 0.6, y - h * 0.6], [x + w, y]]), COL.soilDk, w * 0.7, 0, 0.5);
  const parts = [[0, -0.72, 0.3, 0.2], [-0.22, -0.6, 0.22, 0.17], [0.22, -0.6, 0.22, 0.17], [0, -0.88, 0.22, 0.14]];
  parts.forEach(([dx, dy, rx, ry]) => { c.beginPath(); ell(c, x + dx * h, y + dy * h, rx * h + 5, ry * h + 5); c.fillStyle = INK; c.fill(); });
  parts.forEach(([dx, dy, rx, ry]) => { c.beginPath(); ell(c, x + dx * h, y + dy * h, rx * h, ry * h); c.fillStyle = canopy; c.fill(); });
  parts.forEach(([dx, dy, rx, ry]) => { c.save(); c.beginPath(); ell(c, x + dx * h, y + dy * h, rx * h, ry * h); c.clip(); c.beginPath(); ell(c, x + dx * h + rx * h * 0.3, y + dy * h + ry * h * 0.4, rx * h, ry * h); c.fillStyle = COL.leafDk; c.globalAlpha = 0.45; c.fill(); c.restore(); c.globalAlpha = 1; });
};
const frog = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 12 * s, y + 38 * s, 78 * s, 14 * s);
  shape(c, () => ell(c, x - 52 * s, y + 12 * s, 40 * s, 22 * s, -0.3), COL.green);
  shape(c, () => ell(c, x, y, 66 * s, 44 * s), COL.green);
  shade(c, () => ell(c, x, y, 66 * s, 44 * s), COL.greenDk, 18 * s, 18 * s, 0.5);
  shape(c, () => ell(c, x + 54 * s, y + 24 * s, 22 * s, 14 * s, 0.4), COL.green);
  shape(c, () => ell(c, x + 28 * s, y - 40 * s, 17 * s, 17 * s), COL.green); shape(c, () => ell(c, x + 64 * s, y - 36 * s, 17 * s, 17 * s), COL.green);
  shape(c, () => ell(c, x + 28 * s, y - 42 * s, 9 * s, 9 * s), WHITE, 3); shape(c, () => ell(c, x + 64 * s, y - 38 * s, 9 * s, 9 * s), WHITE, 3);
  shape(c, () => ell(c, x + 30 * s, y - 42 * s, 4 * s, 4 * s), INK, 0); shape(c, () => ell(c, x + 66 * s, y - 38 * s, 4 * s, 4 * s), INK, 0);
  line(c, [[x + 30 * s, y - 6 * s], [x + 62 * s, y - 4 * s], [x + 76 * s, y - 14 * s]], 4);
};
const fish = (c: Ctx, x: number, y: number, s: number, col: string = COL.orange, dir = 1) => {
  shape(c, () => polyP(c, [[x - dir * 40 * s, y], [x - dir * 78 * s, y - 28 * s], [x - dir * 78 * s, y + 28 * s]]), col, 5);
  shape(c, () => ell(c, x, y, 50 * s, 30 * s), col); shade(c, () => ell(c, x, y, 50 * s, 30 * s), "#a85a1a", 10 * s, 12 * s, 0.35);
  shape(c, () => ell(c, x + dir * 28 * s, y - 6 * s, 7 * s, 7 * s), WHITE, 3); shape(c, () => ell(c, x + dir * 30 * s, y - 6 * s, 3 * s, 3 * s), INK, 0);
  line(c, [[x + dir * 8 * s, y - 14 * s], [x + dir * 8 * s, y + 14 * s]], 3, INK);
};
const worm = (c: Ctx, x: number, y: number, s: number) => {
  const pts = [[x - 70 * s, y + 6 * s], [x - 36 * s, y - 14 * s], [x, y + 6 * s], [x + 36 * s, y - 14 * s], [x + 66 * s, y + 2 * s]];
  const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; p(); c.strokeStyle = INK; c.lineWidth = 22 * s; c.stroke(); p(); c.strokeStyle = COL.pink; c.lineWidth = 13 * s; c.stroke();
  shape(c, () => ell(c, x + 30 * s, y - 4 * s, 4 * s, 12 * s), "#d97a95", 2);
};
const beetle = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 0, 1]) { line(c, [[x - 20 * s, y + k * 16 * s], [x - 40 * s, y + k * 24 * s]], 5); line(c, [[x + 20 * s, y + k * 16 * s], [x + 40 * s, y + k * 24 * s]], 5); }
  shape(c, () => ell(c, x, y - 28 * s, 14 * s, 12 * s), INK, 0);
  shape(c, () => ell(c, x, y, 28 * s, 36 * s), "#b8402a"); shade(c, () => ell(c, x, y, 28 * s, 36 * s), "#7d2a1a", 9 * s, 9 * s, 0.5);
  line(c, [[x, y - 34 * s], [x, y + 34 * s]], 3);
  for (const [dx, dy] of [[-12, -8], [12, 8], [-12, 14], [12, -12]]) shape(c, () => ell(c, x + dx * s, y + dy * s, 4 * s, 4 * s), INK, 0);
};
const ant = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-1, 0, 1]) line(c, [[x + k * 14 * s, y], [x + k * 22 * s - 4 * s, y + 28 * s]], 4);
  for (const k of [-1, 0, 1]) line(c, [[x + k * 14 * s, y], [x + k * 22 * s - 4 * s, y - 28 * s]], 4);
  shape(c, () => ell(c, x - 38 * s, y, 24 * s, 16 * s), INK, 0); shape(c, () => ell(c, x, y, 12 * s, 10 * s), INK, 0); shape(c, () => ell(c, x + 30 * s, y, 14 * s, 12 * s), INK, 0);
  line(c, [[x + 38 * s, y - 8 * s], [x + 52 * s, y - 24 * s]], 3);
};
const snail = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 70 * s, y + 24 * s); c.quadraticCurveTo(x - 70 * s, y + 4 * s, x - 40 * s, y + 4 * s); c.lineTo(x + 50 * s, y + 4 * s); c.quadraticCurveTo(x + 76 * s, y - 20 * s, x + 80 * s, y - 40 * s); c.lineTo(x + 94 * s, y - 40 * s); c.quadraticCurveTo(x + 96 * s, y, x + 84 * s, y + 24 * s); c.closePath(); }, "#e0b98a", 5);
  line(c, [[x + 78 * s, y - 36 * s], [x + 74 * s, y - 58 * s]], 4); line(c, [[x + 92 * s, y - 36 * s], [x + 98 * s, y - 58 * s]], 4);
  shape(c, () => ell(c, x - 6 * s, y - 20 * s, 42 * s, 42 * s), COL.orange); shade(c, () => ell(c, x - 6 * s, y - 20 * s, 42 * s, 42 * s), "#b86a1a", 12 * s, 12 * s, 0.4);
  c.beginPath(); c.arc(x - 6 * s, y - 20 * s, 22 * s, 0, Math.PI * 1.6); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const mush = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 14 * s, y + 4 * s, 40 * s, 8 * s);
  shape(c, () => rrect(c, x - 14 * s, y - 50 * s, 28 * s, 52 * s, 10 * s), "#f6ecd2");
  shape(c, () => { c.moveTo(x - 50 * s, y - 44 * s); c.bezierCurveTo(x - 50 * s, y - 100 * s, x + 50 * s, y - 100 * s, x + 50 * s, y - 44 * s); c.closePath(); }, COL.red);
  shade(c, () => { c.moveTo(x - 50 * s, y - 44 * s); c.bezierCurveTo(x - 50 * s, y - 100 * s, x + 50 * s, y - 100 * s, x + 50 * s, y - 44 * s); c.closePath(); }, "#a8301f", 14 * s, 8 * s, 0.4);
  for (const [dx, dy] of [[-20, -62], [10, -76], [26, -58]]) shape(c, () => ell(c, x + dx * s, y + dy * s, 7 * s, 6 * s), WHITE, 2);
};
const flower = (c: Ctx, x: number, y: number, s: number, col: string = COL.pink) => {
  line(c, [[x, y], [x, y - 90 * s]], 6, COL.greenDk);
  leaf(c, x, y - 30 * s, 40 * s, -0.5, COL.leaf);
  for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3; shape(c, () => ell(c, x + Math.cos(a) * 20 * s, y - 100 * s + Math.sin(a) * 20 * s, 15 * s, 15 * s), col, 4); }
  shape(c, () => ell(c, x, y - 100 * s, 12 * s, 12 * s), COL.yellow, 4);
};
const butterfly = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x - 30 * s, y - 14 * s, 30 * s, 36 * s, 0.5), COL.purple); shape(c, () => ell(c, x + 30 * s, y - 14 * s, 30 * s, 36 * s, -0.5), COL.purple);
  shape(c, () => ell(c, x - 22 * s, y + 20 * s, 20 * s, 24 * s, -0.4), COL.pink); shape(c, () => ell(c, x + 22 * s, y + 20 * s, 20 * s, 24 * s, 0.4), COL.pink);
  shape(c, () => rrect(c, x - 6 * s, y - 36 * s, 12 * s, 76 * s, 6 * s), INK, 0);
  line(c, [[x - 2 * s, y - 36 * s], [x - 16 * s, y - 62 * s]], 3); line(c, [[x + 2 * s, y - 36 * s], [x + 16 * s, y - 62 * s]], 3);
};
const bird = (c: Ctx, x: number, y: number, s: number, col: string = COL.blue, dk: string = COL.blueDk) => {
  shape(c, () => polyP(c, [[x - 40 * s, y + 6 * s], [x - 96 * s, y + 20 * s], [x - 44 * s, y + 24 * s]]), dk, 5);
  shape(c, () => ell(c, x, y, 52 * s, 38 * s, -0.15), col); shade(c, () => ell(c, x, y, 52 * s, 38 * s, -0.15), dk, 12 * s, 14 * s, 0.5);
  shape(c, () => ell(c, x + 40 * s, y - 28 * s, 26 * s, 24 * s), col);
  shape(c, () => polyP(c, [[x + 62 * s, y - 34 * s], [x + 92 * s, y - 24 * s], [x + 62 * s, y - 18 * s]]), COL.yellow, 4);
  shape(c, () => ell(c, x + 46 * s, y - 34 * s, 5 * s, 5 * s), INK, 0);
  shape(c, () => ell(c, x - 6 * s, y + 2 * s, 28 * s, 16 * s, 0.2), dk, 4);
  line(c, [[x - 6 * s, y + 36 * s], [x - 6 * s, y + 56 * s]], 4); line(c, [[x + 12 * s, y + 36 * s], [x + 12 * s, y + 56 * s]], 4);
};
const cactus = (c: Ctx, x: number, y: number, h: number) => {
  const w = h * 0.2;
  shadow(c, x + h * 0.16, y + 4, h * 0.3, h * 0.05);
  shape(c, () => rrect(c, x - w, y - h * 0.62, w * 2, h * 0.62, w), COL.green);
  shape(c, () => rrect(c, x - w * 2.3, y - h * 0.5, w * 1.2, h * 0.3, w * 0.6), COL.green);
  shape(c, () => rrect(c, x + w * 1.1, y - h * 0.62, w * 1.2, h * 0.34, w * 0.6), COL.green);
  shade(c, () => rrect(c, x - w, y - h * 0.62, w * 2, h * 0.62, w), COL.greenDk, w * 0.6, 0, 0.5);
  for (const dy of [0.15, 0.3, 0.45]) line(c, [[x, y - h * dy], [x, y - h * (dy + 0.1)]], 3, COL.greenLt);
};
const wave = (c: Ctx, x0: number, x1: number, y: number, amp: number, col: string, w = 6) => {
  const pts: number[][] = []; for (let x = x0; x <= x1; x += 16) pts.push([x, y + Math.sin((x - x0) / 28) * amp]); line(c, pts, w, col);
};
const thermo = (c: Ctx, x: number, y: number, h: number, lvl: number, col: string) => {
  const w = h * 0.1;
  shape(c, () => rrect(c, x - w, y - h, w * 2, h, w), WHITE, 5);
  shape(c, () => ell(c, x, y, w * 2, w * 2), col, 5);
  shape(c, () => rrect(c, x - w * 0.5, y - h * lvl, w, h * lvl, w * 0.4), col, 0);
  for (let k = 1; k < 6; k++) line(c, [[x + w, y - (h * k) / 6], [x + w * 1.8, y - (h * k) / 6]], 3);
};
const snow = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 7, COL.blue); } };
const stone = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.15, y + ry * 0.85, rx * 1.05, ry * 0.2);
  shape(c, () => { c.moveTo(x - rx, y + ry * 0.7); c.quadraticCurveTo(x - rx * 1.05, y - ry * 0.6, x - rx * 0.2, y - ry); c.quadraticCurveTo(x + rx * 0.8, y - ry * 1.05, x + rx, y + ry * 0.7); c.closePath(); }, STONE);
  shade(c, () => { c.moveTo(x - rx, y + ry * 0.7); c.quadraticCurveTo(x - rx * 1.05, y - ry * 0.6, x - rx * 0.2, y - ry); c.quadraticCurveTo(x + rx * 0.8, y - ry * 1.05, x + rx, y + ry * 0.7); c.closePath(); }, STONEDK, rx * 0.3, ry * 0.2, 0.55);
};
const tuft = (c: Ctx, x: number, y: number, s: number) => { for (const [dx, a] of [[-14, -2.2], [0, -1.57], [14, -0.9]]) leaf(c, x + dx * s, y, 46 * s, a, COL.greenDk); };
const microbe = (c: Ctx, x: number, y: number, s: number, kind: number) => {
  if (kind === 0) { shape(c, () => rrect(c, x - 30 * s, y - 12 * s, 60 * s, 24 * s, 12 * s), "#e48fb0"); shape(c, () => ell(c, x - 14 * s, y, 6 * s, 4 * s), "#b85f82", 0); }
  else if (kind === 1) { shape(c, () => ell(c, x, y, 17 * s, 17 * s), COL.greenLt); shape(c, () => ell(c, x + 6 * s, y - 4 * s, 5 * s, 4 * s), COL.green, 0); }
  else { shape(c, () => rrect(c, x - 26 * s, y - 10 * s, 52 * s, 20 * s, 10 * s), COL.yellow); line(c, [[x + 26 * s, y], [x + 46 * s, y - 14 * s], [x + 60 * s, y - 4 * s]], 3); }
};
// a round lens window: clip circle at (x, y) radius r, the inside is drawn by fn
const lens = (c: Ctx, x: number, y: number, r: number, bg: string, fn: () => void) => {
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.fillStyle = bg; c.fillRect(x - r, y - r, r * 2, r * 2); fn(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 12; c.stroke();
  c.beginPath(); ell(c, x, y, r + 6, r + 6); c.strokeStyle = COL.steelDk; c.lineWidth = 8; c.stroke();
};
const hut = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 20 * s, y + 4 * s, 110 * s, 14 * s);
  shape(c, () => rrect(c, x - 80 * s, y - 80 * s, 160 * s, 80 * s, 4), "#e9c79a");
  shade(c, () => rrect(c, x - 80 * s, y - 80 * s, 160 * s, 80 * s, 4), "#b8935f", 30 * s, 0, 0.4);
  shape(c, () => polyP(c, [[x - 104 * s, y - 76 * s], [x, y - 156 * s], [x + 104 * s, y - 76 * s]]), COL.red);
  shape(c, () => rrect(c, x - 18 * s, y - 52 * s, 36 * s, 52 * s, 4), COL.soil);
};
// the four habitat tiles, used by two cards
const tilePond = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); c.fillStyle = GRASS; c.fillRect(x, y, w, h);
  shape(c, () => ell(c, x + w / 2, y + h * 0.58, w * 0.4, h * 0.3), POND); wave(c, x + w * 0.28, x + w * 0.6, y + h * 0.56, 5, WHITE, 4);
  shape(c, () => ell(c, x + w * 0.62, y + h * 0.62, 30, 14), COL.leaf, 4); shape(c, () => ell(c, x + w * 0.62, y + h * 0.58, 9, 7), COL.pink, 3);
  line(c, [[x + w * 0.12, y + h * 0.5], [x + w * 0.12, y + h * 0.18]], 6, COL.greenDk); shape(c, () => ell(c, x + w * 0.12, y + h * 0.16, 9, 18), COL.brown, 4);
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 28); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const tileForest = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); c.fillStyle = "#b7dc8c"; c.fillRect(x, y, w, h);
  tree(c, x + w * 0.25, y + h * 0.9, h * 0.8); tree(c, x + w * 0.72, y + h * 0.95, h * 0.9, COL.green);
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 28); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const tileDesert = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); c.fillStyle = "#fbe7b0"; c.fillRect(x, y, w, h);
  sun(c, x + w * 0.75, y + h * 0.25, h * 0.12);
  shape(c, () => { c.moveTo(x - 10, y + h); c.quadraticCurveTo(x + w * 0.4, y + h * 0.55, x + w + 10, y + h * 0.85); c.lineTo(x + w + 10, y + h + 10); c.lineTo(x - 10, y + h + 10); c.closePath(); }, SAND);
  cactus(c, x + w * 0.3, y + h * 0.88, h * 0.62);
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 28); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const tileSea = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); c.fillStyle = SEA; c.fillRect(x, y, w, h);
  wave(c, x, x + w, y + h * 0.18, 8, WHITE, 5); wave(c, x, x + w, y + h * 0.36, 8, "#8fb8ea", 4);
  fish(c, x + w * 0.5, y + h * 0.62, h * 0.0045, COL.orange);
  shape(c, () => { c.moveTo(x - 10, y + h); c.quadraticCurveTo(x + w * 0.5, y + h * 0.82, x + w + 10, y + h); c.closePath(); }, SAND);
  c.restore(); c.beginPath(); rrect(c, x, y, w, h, 28); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};

// ================================================================ flows
// 0 flow.e2 · five small places in one garden, each with its own warmth; a thermometer
const e2 = (c: Ctx) => {
  ground(c);
  const R = 150;
  const spots: [number, number, () => void, string][] = [
    [210, 250, () => { sun(c, 140, 170, 46); shape(c, () => ell(c, 210, 420, 190, 80), COL.soil); tuft(c, 250, 350, 0.8); }, "#cfe8f7"],
    [540, 250, () => { tree(c, 540, 400, 240, COL.leafDk); }, "#8fb26e"],
    [870, 250, () => { shape(c, () => ell(c, 870, 420, 200, 90), COL.soilDk); stone(c, 870, 270, 90, 62); worm(c, 800, 350, 0.55); }, COL.soil],
    [375, 590, () => { shape(c, () => ell(c, 375, 600, 140, 70), POND); wave(c, 300, 450, 595, 5, WHITE, 4); drop(c, 330, 520, 16); drop(c, 430, 530, 14); }, "#a07a4f"],
    [705, 590, () => { for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 570 + k * 70 + (r % 2) * 34 - 34, 450 + r * 56, 66, 52, 5), BRICK, 4); }, BRICK],
  ];
  spots.forEach(([x, y, fn, bg]) => lens(c, x, y, R, bg, fn));
  // the thermometer lying along the bottom
  shape(c, () => rrect(c, 330, 840, 500, 46, 23), WHITE, 5);
  shape(c, () => rrect(c, 352, 852, 300, 22, 11), COL.red, 0);
  shape(c, () => ell(c, 300, 863, 46, 46), COL.red, 5);
  for (let k = 1; k < 7; k++) line(c, [[330 + k * 70, 886], [330 + k * 70, 904]], 3);
};
// 1 flow.e4 · three bowls of milk in three places: wrapped warm, on the counter, in the fridge
const e4 = (c: Ctx) => {
  ground(c);
  // warm: bowl wrapped in a cloth
  const x1 = 190;
  shadow(c, x1 + 20, 790, 150, 26);
  shape(c, () => { c.moveTo(x1 - 140, 760); c.bezierCurveTo(x1 - 160, 520, x1 + 160, 520, x1 + 140, 760); c.closePath(); }, COL.red);
  shade(c, () => { c.moveTo(x1 - 140, 760); c.bezierCurveTo(x1 - 160, 520, x1 + 160, 520, x1 + 140, 760); c.closePath(); }, "#a8301f", 40, 0, 0.4);
  for (let k = 0; k < 4; k++) line(c, [[x1 - 130 + k * 20, 600 + k * 36], [x1 + 130 - k * 20, 600 + k * 36]], 5, "#f7c0b0");
  shape(c, () => ell(c, x1, 560, 74, 20), COL.red, 5);
  for (let k = 0; k < 3; k++) line(c, [[x1 - 70 + k * 70, 440], [x1 - 90 + k * 70, 400], [x1 - 60 + k * 70, 360]], 7, COL.red);
  // counter: bowl with lid on the kitchen counter
  const x2 = 540;
  shadow(c, x2 + 20, 790, 150, 26);
  shape(c, () => { c.moveTo(x2 - 130, 580); c.bezierCurveTo(x2 - 120, 780, x2 + 120, 780, x2 + 130, 580); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x2 - 130, 580); c.bezierCurveTo(x2 - 120, 780, x2 + 120, 780, x2 + 130, 580); c.closePath(); }, COL.steelDk, 50, -10, 0.6);
  shape(c, () => ell(c, x2, 580, 140, 30), COL.steelIn, 5); shape(c, () => ell(c, x2, 556, 100, 20), COL.steel, 5); shape(c, () => ell(c, x2, 540, 18, 12), COL.steelDk, 4);
  // fridge
  const x3 = 890;
  shadow(c, x3 + 20, 830, 120, 22);
  shape(c, () => rrect(c, x3 - 100, 330, 200, 500, 24), "#e6f1fa");
  shade(c, () => rrect(c, x3 - 100, 330, 200, 500, 24), COL.glassEdge, 40, 0, 0.3);
  line(c, [[x3 - 100, 520], [x3 + 100, 520]], 6); line(c, [[x3 + 70, 360], [x3 + 70, 480]], 12, COL.steelDk); line(c, [[x3 + 70, 560], [x3 + 70, 700]], 12, COL.steelDk);
  snow(c, x3 - 10, 425, 38);
  // a small bowl in the open fridge: show it on the lower shelf
  shape(c, () => ell(c, x3 - 20, 690, 40, 12), COL.steelIn, 4);
};
// 2 flow.a3 · a square metre of ground marked with sticks and string, a magnifier on an ant
const a3 = (c: Ctx) => {
  ground(c);
  const P = [[260, 470], [800, 470], [930, 740], [130, 740]];
  shadow(c, 540, 770, 440, 30);
  shape(c, () => polyP(c, P), GRASS);
  shade(c, () => polyP(c, P), GRASSDK, 40, 20, 0.35);
  for (const [x, y, s] of [[360, 560, 0.7], [640, 540, 0.6], [270, 680, 0.8], [800, 690, 0.9], [560, 700, 0.7]]) tuft(c, x, y, s);
  ant(c, 480, 620, 0.55);
  // string
  line(c, [P[0], P[1], P[2], P[3], P[0]], 7, RED);
  // sticks
  for (const [x, y] of P) { shape(c, () => rrect(c, x - 9, y - 100, 18, 120, 6), COL.wood, 5); }
  // the magnifier over the ant corner, big
  lens(c, 780, 330, 190, "#b7dc8c", () => { tuft(c, 700, 480, 2.4); ant(c, 800, 340, 1.8); });
  line(c, [[915, 465], [985, 560]], 24, INK); line(c, [[915, 465], [985, 560]], 14, COL.woodDk);
};
// 3 flow.a4 · a paper map of the walk with a path and things along it
const a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 420, 30);
  shape(c, () => polyP(c, [[120, 140], [930, 120], [950, 830], [100, 850]]), "#fffaf0");
  shade(c, () => polyP(c, [[120, 140], [930, 120], [950, 830], [100, 850]]), "#e4dccb", 30, 30, 0.5);
  // the dotted path
  c.setLineDash([22, 22]);
  line(c, [[200, 740], [380, 700], [470, 560], [360, 420], [520, 320], [740, 360], [840, 520], [780, 700]], 10, COL.brown);
  c.setLineDash([]);
  // things drawn along it
  tree(c, 210, 420, 190); hut(c, 770, 270, 0.7);
  shape(c, () => ell(c, 650, 640, 110, 60), POND); wave(c, 590, 710, 636, 4, WHITE, 4);
  flower(c, 480, 420, 0.7, COL.pink); flower(c, 330, 800, 0.6, COL.yellow);
  // a crayon
  c.save(); c.translate(900, 880); c.rotate(-0.5);
  shape(c, () => rrect(c, -110, -16, 190, 32, 6), COL.red); shape(c, () => polyP(c, [[80, -16], [130, 0], [80, 16]]), "#f7c0b0", 5); shape(c, () => rrect(c, -50, -16, 30, 32, 2), COL.paper, 3);
  c.restore();
};
// 4 flow.a5 · four paper sheets on the floor, a child jumping to one
const a5 = (c: Ctx) => {
  ground(c);
  tilePond(c, 80, 110, 400, 300); tileForest(c, 600, 110, 400, 300); tileDesert(c, 80, 560, 400, 300); tileSea(c, 600, 560, 400, 300);
  person(c, 540, 840, 430, { armL: [-0.6, -1.0], armR: [-2.5, -2.1] });
  arrow(c, [[420, 470], [320, 450], [250, 420]], RED, 12);
};
// 5 flow.c1 · two cups of water in the hot sun; one has a shelter over it
const c1 = (c: Ctx) => {
  ground(c, "#fbe7b0");
  sun(c, 540, 150, 70);
  for (const x of [200, 330]) arrow(c, [[x, 290], [x, 450]], RED, 10);
  for (const x of [690, 830]) arrow(c, [[x, 290], [x, 380]], RED, 10);
  c.fillStyle = SAND; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  glass(c, 240, 740, 190, 250, 0.7);
  // the shelter: a cardboard roof on two sticks over the right cup, with a shade patch
  shape(c, () => ell(c, 770, 780, 190, 24), "rgba(43,35,64,0.22)", 0);
  glass(c, 780, 740, 190, 250, 0.7);
  line(c, [[640, 480], [640, 760]], 14, COL.woodDk); line(c, [[920, 480], [920, 760]], 14, COL.woodDk);
  shape(c, () => polyP(c, [[600, 480], [960, 480], [1000, 400], [640, 400]]), "#c99a5e");
  shade(c, () => polyP(c, [[600, 480], [960, 480], [1000, 400], [640, 400]]), "#8a6234", 0, 20, 0.5);
  cactus(c, 460, 760, 150);
};

// ================================================================ terms
// 6 term.0 · a frog's pond: water, a insect to eat, mud to hide in
const t0 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = GRASS; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  shape(c, () => ell(c, 540, 820, 470, 190), POND); wave(c, 200, 880, 800, 8, WHITE, 5);
  shape(c, () => { c.moveTo(80, 760); c.quadraticCurveTo(300, 650, 540, 700); c.quadraticCurveTo(780, 650, 1000, 760); c.quadraticCurveTo(540, 700, 80, 760); c.closePath(); }, COL.soil, 0);
  for (const x of [120, 180, 900, 960]) { line(c, [[x, 740], [x - 8, 480]], 8, COL.greenDk); shape(c, () => ell(c, x - 8, 470, 12, 30), COL.brown, 5); }
  shape(c, () => ell(c, 760, 860, 80, 28), COL.leaf, 5); shape(c, () => ell(c, 760, 842, 20, 12), COL.pink, 4);
  frog(c, 450, 720, 2.1);
  // a dragonfly to eat
  shape(c, () => ell(c, 800, 330, 46, 9), COL.tealDk, 4); shape(c, () => ell(c, 770, 300, 54, 18, -0.4), "rgba(255,255,255,0.8)", 4); shape(c, () => ell(c, 830, 300, 54, 18, 0.4), "rgba(255,255,255,0.8)", 4);
  shape(c, () => ell(c, 760, 330, 12, 12), COL.teal, 4);
  sun(c, 180, 180, 56);
};
// 7 term.1 · a child and the things any living thing needs: food, water, air, shelter, warmth
const t1 = (c: Ctx) => {
  ground(c);
  const bub = (x: number, y: number, fn: () => void) => { shape(c, () => ell(c, x, y, 120, 120), WHITE, 6); fn(); };
  bub(210, 220, () => { shape(c, () => ell(c, 210, 250, 70, 24), COL.steel); shape(c, () => ell(c, 210, 232, 52, 28), COL.wood, 4); shape(c, () => ell(c, 210, 206, 30, 30), COL.red, 4); leaf(c, 210, 178, 30, -0.9, COL.green); });
  bub(540, 160, () => { drop(c, 540, 175, 46); });
  bub(870, 220, () => { for (const [y, w] of [[185, 80], [225, 110], [265, 70]]) { line(c, [[790, y], [790 + w, y], [790 + w + 20, y - 14]], 8, COL.blue); } });
  bub(180, 560, () => { hut(c, 180, 620, 0.7); });
  bub(900, 560, () => { sun(c, 900, 560, 40); });
  person(c, 540, 1000, 560, { armL: [2.4, 1.9], armR: [0.7, 1.2] });
  arrow(c, [[300, 300], [420, 440]], RED, 8); arrow(c, [[780, 300], [660, 440]], RED, 8); arrow(c, [[540, 290], [540, 400]], RED, 8);
  arrow(c, [[270, 600], [400, 620]], RED, 8); arrow(c, [[830, 600], [700, 620]], RED, 8);
};
// 8 term.7 · a rotting log: a tiny world of its own
const t7 = (c: Ctx) => {
  ground(c, "#cfe5b0");
  c.fillStyle = GRASSDK; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  shadow(c, 560, 920, 440, 36);
  shape(c, () => rrect(c, 140, 520, 760, 360, 100), COL.brown);
  shade(c, () => rrect(c, 140, 520, 760, 360, 100), COL.soilDk, 40, 50, 0.5);
  for (const y of [600, 690, 780]) line(c, [[230, y], [420, y + 10], [520, y]], 5, COL.soilDk);
  shape(c, () => ell(c, 880, 700, 120, 180), COL.wood); shape(c, () => ell(c, 880, 700, 80, 125), COL.woodDk, 4); shape(c, () => ell(c, 880, 700, 38, 62), COL.wood, 4);
  shape(c, () => ell(c, 400, 520, 150, 40), COL.leaf, 5);
  mush(c, 600, 540, 1.1); mush(c, 700, 540, 0.7);
  beetle(c, 330, 482, 1.0);
  snail(c, 360, 780, 0.9);
  ant(c, 780, 486, 0.6);
};
// 9 term.8 · the living parts of a forest: tree, bird, mushroom, ant, flower
const t8 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = GRASS; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  tree(c, 420, 800, 640, COL.leaf);
  bird(c, 700, 330, 1.3);
  mush(c, 760, 900, 1.3); flower(c, 900, 980, 1.5, COL.pink); flower(c, 130, 960, 1.2, COL.yellow);
  ant(c, 580, 960, 1.0);
  butterfly(c, 160, 360, 1.2);
};
// 10 term.9 · the non-living parts: sun, rain, rocks, soil, sand, wind
const t9 = (c: Ctx) => {
  ground(c, SKY);
  sun(c, 190, 170, 70);
  cloud(c, 700, 190, 1.6);
  for (const x of [610, 700, 790]) { drop(c, x, 360, 20); drop(c, x + 40, 450, 16); }
  shape(c, () => { c.moveTo(-10, 1090); c.lineTo(-10, 700); c.quadraticCurveTo(300, 560, 640, 700); c.lineTo(1090, 800); c.lineTo(1090, 1090); c.closePath(); }, COL.soil);
  shade(c, () => { c.moveTo(-10, 1090); c.lineTo(-10, 700); c.quadraticCurveTo(300, 560, 640, 700); c.lineTo(1090, 800); c.lineTo(1090, 1090); c.closePath(); }, COL.soilDk, 60, 40, 0.5);
  shape(c, () => ell(c, 780, 900, 220, 70), POND); wave(c, 640, 920, 895, 6, WHITE, 5);
  stone(c, 250, 760, 130, 100); stone(c, 440, 880, 90, 66); stone(c, 90, 900, 70, 52);
  for (const [y, w] of [[480, 90], [530, 130], [580, 80]]) line(c, [[60, y], [60 + w, y], [60 + w + 20, y - 14]], 8, COL.blue);
};
// 11 term.13 · a thermometer between cold (ice, snow) and hot (sun)
const t13 = (c: Ctx) => {
  ground(c);
  thermo(c, 540, 900, 700, 0.55, COL.red);
  sun(c, 840, 300, 90); snow(c, 230, 700, 100);
  shape(c, () => rrect(c, 130, 780, 200, 160, 20), "#d9ecfa"); shape(c, () => polyP(c, [[130, 780], [330, 780], [300, 740], [160, 740]]), "#eef7fd");
  arrow(c, [[420, 600], [420, 320]], RED, 10); arrow(c, [[660, 380], [660, 620]], COL.blue, 10);
};
// 12 term.14 · a fair test: two identical bowls, one thing different
const t14 = (c: Ctx) => {
  ground(c);
  for (const [x, hot] of [[290, true], [790, false]] as [number, boolean][]) {
    shape(c, () => ell(c, x, 380, 120, 120), "#fffaf0", 5);
    if (hot) sun(c, x, 380, 60); else snow(c, x, 380, 80);
    bowl(c, x, 700, 200, "#fffaf0");
    shape(c, () => ell(c, x, 700, 170, 20), "#fffaf0", 0);
    line(c, [[x + 90, 520], [x + 40, 705]], 14, COL.steelDk); shape(c, () => ell(c, x + 96, 505, 24, 14, 0.3), COL.steel, 4);
    write(c, "1", x + 130, 470, 70, INK, 8);
  }
  line(c, [[510, 690], [570, 690]], 12); line(c, [[510, 730], [570, 730]], 12);
};
// 13 term.15 · a pond with a frog; then the pond filled in with houses and the frog leaving
const t15 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = GRASS; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 6);
  shape(c, () => ell(c, 270, 800, 230, 120), POND); frog(c, 230, 770, 1.1); wave(c, 130, 380, 840, 6, WHITE, 4);
  for (const [x, y, col] of [[690, 800, "#f0b86a"], [840, 880, "#9ec3e8"], [920, 740, "#e48a7a"]] as [number, number, string][]) {
    shape(c, () => rrect(c, x - 70, y - 110, 140, 110, 6), col); shade(c, () => rrect(c, x - 70, y - 110, 140, 110, 6), "#6a5a4a", 36, 0, 0.3);
    shape(c, () => polyP(c, [[x - 84, y - 106], [x, y - 176], [x + 84, y - 106]]), COL.red); shape(c, () => rrect(c, x - 16, y - 56, 32, 56, 4), COL.soil);
  }
  c.beginPath(); c.moveTo(540, 0); c.lineTo(540, D); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  arrow(c, [[300, 560], [420, 480], [500, 560]], RED, 12);
  frog(c, 600, 990, 0.7);
};
// 14 term.16 · many different kinds of living things
const t16 = (c: Ctx) => {
  ground(c);
  const T = (cx: number, cy: number, col: string, fn: () => void) => { shape(c, () => rrect(c, cx - 160, cy - 160, 320, 320, 36), col, 6); fn(); };
  T(200, 200, "#cfe8f7", () => bird(c, 200, 210, 1.5));
  T(540, 200, "#d6efb0", () => frog(c, 520, 230, 1.5));
  T(880, 200, "#f7e0f0", () => butterfly(c, 880, 210, 1.9));
  T(200, 540, "#b7dcf2", () => fish(c, 220, 540, 1.7, COL.orange));
  T(540, 540, "#cfe5b0", () => tree(c, 540, 660, 280));
  T(880, 540, "#fbe7b0", () => cactus(c, 880, 650, 260));
  T(200, 880, "#e6d3b8", () => snail(c, 190, 910, 1.4));
  T(540, 880, "#cfe5b0", () => mush(c, 540, 960, 2.0));
  T(880, 880, "#fff4d0", () => flower(c, 880, 980, 2.0, COL.pink));
};
// 15 term.17 · a hydrothermal vent: a chimney on the dark sea floor, hot water coming out, tube worms
const t17 = (c: Ctx) => {
  ground(c, "#1d3f73");
  c.fillStyle = "#183560"; c.fillRect(0, 0, D, 300);
  shape(c, () => { c.moveTo(-10, 1090); c.lineTo(-10, 860); c.quadraticCurveTo(300, 800, 380, 830); c.lineTo(440, 560); c.lineTo(640, 560); c.lineTo(700, 830); c.quadraticCurveTo(840, 800, 1090, 880); c.lineTo(1090, 1090); c.closePath(); }, "#4a4350");
  shade(c, () => { c.moveTo(-10, 1090); c.lineTo(-10, 860); c.quadraticCurveTo(300, 800, 380, 830); c.lineTo(440, 560); c.lineTo(640, 560); c.lineTo(700, 830); c.quadraticCurveTo(840, 800, 1090, 880); c.lineTo(1090, 1090); c.closePath(); }, "#2f2a38", 40, 20, 0.6);
  shape(c, () => ell(c, 540, 560, 100, 26), "#ff9a3c", 5);
  // smoke plume
  for (const [x, y, r] of [[540, 480, 70], [510, 360, 90], [570, 220, 110], [530, 90, 120]]) shape(c, () => ell(c, x, y, r, r * 0.8), "rgba(70,70,86,0.8)", 0);
  // tube worms
  for (const [x, h] of [[240, 220], [300, 280], [350, 200], [730, 240], [790, 300], [850, 210], [670, 180]]) {
    const base = x < 500 ? 860 : 850;
    shape(c, () => rrect(c, x - 18, base - h, 36, h, 16), WHITE, 5); shape(c, () => rrect(c, x - 22, base - h - 36, 44, 50, 20), COL.red, 5);
  }
};
// 16 term.18 · microbes in curd, seen through a lens
const t18 = (c: Ctx) => {
  ground(c);
  bowl(c, 260, 700, 190, "#fffaf0"); shape(c, () => ell(c, 260, 700, 170, 20), "#fffaf0", 0);
  lens(c, 740, 440, 280, "#f7f0e0", () => {
    const r = rnd(5);
    for (let k = 0; k < 14; k++) microbe(c, 520 + r() * 440, 220 + r() * 440, 1.5, k % 2);
    microbe(c, 740, 440, 2.2, 0);
  });
  line(c, [[860, 680], [980, 800]], 36, INK); line(c, [[860, 680], [980, 800]], 22, COL.woodDk);
  arrow(c, [[420, 640], [470, 560]], RED, 10);
};

// ================================================================ explanations
// 17 expl.0 · a bird at home: tree to nest in, seeds to eat, water, sun
const x0 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = GRASS; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  sun(c, 900, 160, 60);
  tree(c, 380, 840, 700);
  shape(c, () => { c.moveTo(280, 400); c.quadraticCurveTo(300, 500, 400, 500); c.quadraticCurveTo(500, 500, 520, 400); c.closePath(); }, COL.wood); shape(c, () => ell(c, 400, 400, 120, 22), COL.woodDk, 5);
  bird(c, 400, 380, 1.1);
  shape(c, () => ell(c, 780, 880, 120, 36), COL.steel); shape(c, () => ell(c, 780, 862, 96, 24), POND, 4);
  for (const [x, y] of [[680, 960], [740, 990], [830, 970], [900, 1000]]) seed(c, x, y, 16, x, false, COL.wood, COL.woodDk);
};
// 18 expl.1 · rain fills the pond, lotus grows, fish breathe, dead leaves feed the mud: a loop
const x1 = (c: Ctx) => {
  ground(c, SKY);
  cloud(c, 540, 170, 1.8);
  for (const x of [470, 540, 610]) drop(c, x, 330, 18);
  shape(c, () => ell(c, 770, 560, 220, 90), POND); line(c, [[770, 560], [770, 470]], 7, COL.greenDk); shape(c, () => ell(c, 770, 460, 34, 34), COL.pink, 5);
  fish(c, 540, 820, 1.5, COL.orange);
  for (const [x, y] of [[470, 700], [520, 700]]) shape(c, () => ell(c, x, y, 14, 14), "rgba(255,255,255,0.8)", 4);
  shape(c, () => ell(c, 230, 600, 170, 80), COL.soil); leaf(c, 150, 600, 90, -0.4, COL.orange); leaf(c, 240, 590, 90, -0.9, COL.leaf);
  arrow(c, [[640, 270], [730, 340], [770, 400]], RED, 10); arrow(c, [[730, 640], [680, 740], [620, 790]], RED, 10);
  arrow(c, [[350, 580], [470, 520], [580, 560]], RED, 10);
};
// 19 expl.6 · the four habitats side by side
const x6 = (c: Ctx) => {
  ground(c);
  tilePond(c, 60, 80, 450, 450); tileForest(c, 570, 80, 450, 450); tileDesert(c, 60, 590, 450, 410); tileSea(c, 570, 590, 450, 410);
};
// 20 expl.7 · an open sunny path against the cool dark under a stone
const x7 = (c: Ctx) => {
  ground(c);
  c.save(); c.beginPath(); rrect(c, 40, 100, 480, 880, 36); c.clip(); c.fillStyle = "#fbe7b0"; c.fillRect(40, 100, 480, 880); c.fillStyle = SANDDK; c.fillRect(40, 640, 480, 340); sun(c, 280, 260, 70); c.restore();
  c.beginPath(); rrect(c, 40, 100, 480, 880, 36); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.save(); c.beginPath(); rrect(c, 560, 100, 480, 880, 36); c.clip(); c.fillStyle = "#6a86a8"; c.fillRect(560, 100, 480, 880); c.fillStyle = COL.soilDk; c.fillRect(560, 560, 480, 420); c.restore();
  c.beginPath(); rrect(c, 560, 100, 480, 880, 36); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  stone(c, 800, 400, 190, 130);
  worm(c, 720, 720, 1.3);
  thermo(c, 190, 930, 260, 0.9, COL.red); thermo(c, 930, 930, 260, 0.35, COL.blue);
};
// 21 expl.8 · a tree changes its place: shade, water to the air, leaves into soil
const x8 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = GRASS; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  sun(c, 150, 150, 60);
  shape(c, () => ell(c, 640, 830, 380, 50), "rgba(43,35,64,0.2)", 0);
  tree(c, 540, 790, 640);
  for (const x of [380, 460, 640, 720]) arrow(c, [[x, 360], [x + 20, 240]], COL.blue, 8);
  for (const [x, y, a] of [[420, 800, 0.4], [650, 880, 1.2], [760, 830, 2.4]] as [number, number, number][]) leaf(c, x, y, 50, a, COL.orange);
  shape(c, () => ell(c, 250, 960, 140, 40), COL.soil); worm(c, 250, 960, 0.8);
  arrow(c, [[740, 560], [800, 700], [810, 760]], RED, 8);
};
// 22 expl.9 · stumps where a forest was; a child planting a young tree
const x9 = (c: Ctx) => {
  ground(c, "#e6dcc8");
  c.fillStyle = "#a89070"; c.fillRect(0, 700, 540, 380); line(c, [[0, 700], [540, 700]], 6);
  c.fillStyle = GRASS; c.fillRect(540, 700, 540, 380); line(c, [[540, 700], [D, 700]], 6);
  c.fillStyle = SKY; c.fillRect(540, 0, 540, 700);
  for (const [x, y, s] of [[130, 840, 1.1], [330, 900, 1.4], [440, 780, 0.8], [200, 980, 1.0]]) {
    shape(c, () => rrect(c, x - 54 * s, y - 70 * s, 108 * s, 90 * s, 12), COL.brown); shape(c, () => ell(c, x, y - 70 * s, 54 * s, 18 * s), COL.wood); shape(c, () => ell(c, x, y - 70 * s, 28 * s, 9 * s), COL.woodDk, 3);
  }
  c.beginPath(); c.moveTo(540, 0); c.lineTo(540, D); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  tree(c, 960, 800, 330); tree(c, 640, 780, 250);
  person(c, 790, 1000, 480, { armL: [2.0, 1.4], armR: [1.2, 1.5] });
  shape(c, () => ell(c, 800, 1012, 40, 12), COL.soilDk, 0);
  line(c, [[880, 1000], [880, 920]], 8, COL.greenDk); leaf(c, 880, 940, 40, -0.8, COL.leaf); leaf(c, 880, 940, 40, -2.3, COL.leaf);
  arrow(c, [[300, 440], [430, 400], [570, 440]], RED, 12);
};
// 23 expl.10 · a child, and a zoom into the tummy full of microbes
const x10 = (c: Ctx) => {
  ground(c);
  person(c, 270, 1010, 760, { armL: [2.2, 1.9], armR: [0.9, 1.3] });
  line(c, [[330, 640], [590, 400]], 7); line(c, [[330, 640], [590, 740]], 7);
  lens(c, 770, 560, 270, "#f6c9bb", () => {
    const r = rnd(9);
    for (let k = 0; k < 14; k++) microbe(c, 510 + r() * 520, 300 + r() * 520, 1.5, k % 3);
  });
};
// 24 expl.11 · a hot spring: steam, orange bands where bacteria live, a lens on them
const x11 = (c: Ctx) => {
  ground(c, "#cfe3f0");
  c.fillStyle = "#b9a98f"; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  shape(c, () => ell(c, 540, 820, 470, 190), COL.orange); shape(c, () => ell(c, 540, 820, 400, 150), COL.yellow, 4); shape(c, () => ell(c, 540, 825, 320, 112), "#7fd0d6", 4); shape(c, () => ell(c, 540, 830, 190, 62), "#3fa7c4", 4);
  for (const x of [380, 540, 700]) { c.setLineDash([]); line(c, [[x, 700], [x - 40, 600], [x + 30, 500], [x - 20, 400]], 14, WHITE); }
  stone(c, 90, 900, 70, 54); stone(c, 990, 880, 80, 58);
  lens(c, 880, 300, 150, "#f7f0e0", () => { microbe(c, 840, 290, 1.5, 2); microbe(c, 920, 340, 1.4, 0); microbe(c, 880, 240, 1.3, 1); });
  line(c, [[760, 640], [820, 440]], 6);
};
// 26 expl.13 · where does a habitat end? forest thinning slowly into grassland
const x13 = (c: Ctx) => {
  ground(c, SKY);
  c.fillStyle = GRASS; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  const items: [number, number, number][] = [[110, 840, 500], [260, 820, 460], [400, 860, 380], [530, 830, 300], [640, 880, 230], [740, 840, 170], [830, 870, 120]];
  items.forEach(([x, y, h]) => tree(c, x, y, h));
  for (const [x, y, s] of [[880, 980, 1.0], [960, 900, 0.8], [1010, 1000, 1.1], [800, 1010, 0.9]]) tuft(c, x, y, s);
  arrow(c, [[200, 1010], [900, 1010]], RED, 10);
};
export const ic_habitatsHabitatsL3 = cards("sci.habitats.habitats.L3 cards", [e2, e4, a3, a4, a5, c1, t0, t1, t7, t8, t9, t13, t14, t15, t16, t17, t18, x0, x1, x6, x7, x8, x9, x10, x11, x13]);
