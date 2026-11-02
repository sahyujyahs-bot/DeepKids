import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, BG, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, leaf, glass, bowl, plate, cards } from "./flatKit";

// sci.ecology.food-chains.L3 cards. Same child (orange shirt) and grown-up (blue shirt). Every animal faces
// right unless said; red arrows point from the food to the eater or show movement; numbers only with write().

type A = { flip?: boolean; spine?: boolean; glow?: boolean };
const FISH = "#f08a4b", FISH_DK = "#d96a2f", FROG = "#6aa53f", FROG_DK = "#46752a";
const BIRD = "#a9805a", BIRD_DK = "#7d5c3c", BELLY = "#ead9bb", BEAK = "#f3b13c";
const BLACKB = "#4a4558", BLACKD = "#2f2b3c", GRASS = "#cfe3a8", SKYD = "#cfe8f6", WALL = "#e8d8b8";

const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 3); shape(c, () => ell(c, x + r * 0.2, y, r * 0.5, r * 0.5), INK, 0); };
const lg = (c: Ctx, pts: number[][], col: string, w = 14) => { line(c, pts, w + 6, INK); line(c, pts, w, col); };
const fish = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  shape(c, () => polyP(c, [[-90, 0], [-175, -58], [-150, 0], [-175, 58]]), FISH_DK);
  shape(c, () => polyP(c, [[-30, -55], [10, -105], [70, -50]]), FISH_DK);
  shape(c, () => polyP(c, [[-10, 55], [20, 95], [60, 52]]), FISH_DK);
  const body = () => { c.moveTo(-110, 0); c.bezierCurveTo(-60, -85, 90, -70, 140, 0); c.bezierCurveTo(90, 70, -60, 85, -110, 0); c.closePath(); };
  shape(c, body, FISH); shade(c, body, FISH_DK, 14, 16);
  for (let i = 0; i < 3; i++) for (let j = -1; j <= 1; j++) { c.beginPath(); c.arc(-40 + i * 28, j * 28 + (i % 2) * 8, 14, -0.9, 0.9); c.strokeStyle = FISH_DK; c.lineWidth = 3; c.stroke(); }
  eye(c, 100, -12, 13);
  line(c, [[138, 4], [118, 10]], 5);
  shape(c, () => { c.moveTo(62, -48); c.quadraticCurveTo(30, 0, 62, 48); c.quadraticCurveTo(84, 0, 62, -48); c.closePath(); }, o.glow ? "#e4523b" : FISH, 5);
  c.restore();
};
const bird = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  for (const dx of [-12, 24]) { line(c, [[dx, 55], [dx, 108]], 9); line(c, [[dx, 108], [dx + 22, 112]], 8); line(c, [[dx, 108], [dx - 12, 116]], 8); }
  shape(c, () => polyP(c, [[-80, -5], [-170, 22], [-165, 50], [-75, 36]]), BIRD_DK);
  const body = () => ell(c, 0, 0, 98, 72, -0.12);
  shape(c, body, BIRD); shade(c, body, BIRD_DK, 14, 14);
  shape(c, () => ell(c, 28, 28, 56, 36, -0.1), BELLY, 0);
  if (o.glow) { shape(c, () => ell(c, 10, 10, 52, 40), RED, 0); c.globalAlpha = 0.9; shape(c, () => ell(c, 10, 10, 30, 22), COL.yellow, 0); c.globalAlpha = 1; }
  shape(c, () => ell(c, -22, -4, 62, 38, 0.35), BIRD_DK, 5);
  shape(c, () => ell(c, 88, -62, 40, 38), BIRD); shade(c, () => ell(c, 88, -62, 40, 38), BIRD_DK, 9, 9);
  shape(c, () => polyP(c, [[120, -66], [158, -54], [120, -44]]), BEAK, 5);
  eye(c, 98, -70, 9);
  c.restore();
};
const frog = (c: Ctx, x: number, y: number, s: number, o: A = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  lg(c, [[40, 20], [95, 62], [120, 78]], FROG, 18); line(c, [[120, 80], [150, 84]], 8);
  const body = () => ell(c, 0, 0, 105, 72, -0.1);
  shape(c, body, FROG); shade(c, body, FROG_DK, 14, 14);
  shape(c, () => ell(c, -42, 28, 62, 36, -0.5), FROG, 6); line(c, [[-70, 56], [-30, 74], [40, 78]], 12); line(c, [[-70, 56], [-30, 74], [40, 78]], 6, FROG); line(c, [[40, 78], [75, 82]], 8);
  shape(c, () => ell(c, 80, -22, 56, 42, -0.15), FROG); shade(c, () => ell(c, 80, -22, 56, 42, -0.15), FROG_DK, 8, 8);
  shape(c, () => ell(c, 92, -58, 22, 22), FROG); eye(c, 96, -60, 13);
  line(c, [[130, -12], [96, -4]], 4);
  shape(c, () => ell(c, 40, 20, 40, 40), "rgba(0,0,0,0)", 0);
  c.restore();
};
const sun = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), col, 6);
};
const tree = (c: Ctx, x: number, y: number, s: number, col = COL.leaf, dk = COL.leafDk) => {
  shape(c, () => polyP(c, [[x - 28 * s, y], [x - 16 * s, y - 220 * s], [x + 16 * s, y - 220 * s], [x + 28 * s, y]]), COL.brown, 6);
  const blobs = [[0, -300, 120], [-100, -240, 90], [100, -240, 90], [-50, -370, 90], [60, -360, 85]];
  for (const [dx, dy, r] of blobs) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s * 0.9), col, 6);
  for (const [dx, dy, r] of blobs) { c.beginPath(); ell(c, x + dx * s, y + dy * s, r * s - 3, r * s * 0.9 - 3); c.fillStyle = col; c.fill(); }
  shade(c, () => ell(c, x, y - 290 * s, 170 * s, 130 * s), dk, 30 * s, 40 * s, 0.35);
};
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
const spider = (c: Ctx, x: number, y: number, s: number) => {
  for (const m of [-1, 1]) for (const k of [-1, 0, 1, 2]) line(c, [[x, y], [x + m * 26 * s, y + (k - 1) * 14 * s - 12 * s], [x + m * 44 * s, y + (k - 0.5) * 22 * s]], 4 * s);
  shape(c, () => ell(c, x, y + 12 * s, 14 * s, 18 * s), "#4a3a30", 4); shape(c, () => ell(c, x, y - 10 * s, 9 * s, 9 * s), "#4a3a30", 4);
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
const grasshopper = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const G = "#7cb342", GD = "#558b2f", w = 6;
  // far legs
  line(c, [[-60, 40], [-120, 120], [-100, 200]], 10, GD); line(c, [[80, 40], [150, 120], [150, 200]], 10, GD);
  line(c, [[-150, 50], [-230, -50], [-300, 150]], 24, INK); line(c, [[-150, 50], [-230, -50], [-300, 150]], 14, GD);
  // big hind leg
  line(c, [[-170, 60], [-250, -40], [-330, 150]], 28, INK); line(c, [[-170, 60], [-250, -40], [-330, 150]], 18, G);
  line(c, [[-330, 150], [-360, 200]], 12, INK);
  // body
  shape(c, () => { c.moveTo(-330, 20); c.bezierCurveTo(-300, -40, -80, -50, 120, -30); c.lineTo(120, 70); c.bezierCurveTo(-80, 90, -300, 90, -330, 20); c.closePath(); }, G, w);
  for (let i = 0; i < 5; i++) line(c, [[-290 + i * 55, -35 + i * 4], [-290 + i * 55, 80 - i * 3]], 4, GD);
  // wing
  shape(c, () => { c.moveTo(-250, -30); c.quadraticCurveTo(-100, -90, 150, -35); c.quadraticCurveTo(-60, -20, -250, -30); c.closePath(); }, "#d4e8a8", w);
  // head
  shape(c, () => ell(c, 180, -10, 85, 70), G, w);
  shape(c, () => ell(c, 205, -30, 24, 24), WHITE, 5); shape(c, () => ell(c, 210, -30, 10, 10), INK, 0);
  line(c, [[240, -70], [310, -180], [380, -230]], 5); line(c, [[200, -75], [230, -190], [280, -250]], 5);
  line(c, [[40, 80], [100, 150], [130, 220]], 10, INK); line(c, [[40, 80], [100, 150], [130, 220]], 5, G);
  line(c, [[-20, 80], [-40, 150], [-60, 220]], 10, INK); line(c, [[-20, 80], [-40, 150], [-60, 220]], 5, G);
  // spiracles
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, -280 + i * 62, 30 + (i > 2 ? 0 : 0), 11, 9), "#fff3c4", 4);
  c.restore();
};
// ------------------------------------------------------------------ helpers
const tile = (c: Ctx, x: number, y: number, w: number, h: number, col: string = WHITE, r = 34) => shape(c, () => rrect(c, x, y, w, h, r), col, 6);
const heat = (c: Ctx, x: number, y: number, h: number, col = RED, w = 8) => { const p: number[][] = []; for (let i = 0; i <= 16; i++) { const t = i / 16; p.push([x + Math.sin(t * Math.PI * 3) * h * 0.1, y - t * h]); } line(c, p, w, col); };
const bolt = (c: Ctx, x: number, y: number, r: number) => shape(c, () => polyP(c, [[x - r * 0.2, y - r], [x + r * 0.6, y - r * 0.1], [x + r * 0.1, y - r * 0.1], [x + r * 0.5, y + r], [x - r * 0.6, y + r * 0.1], [x - r * 0.1, y + r * 0.1]]), COL.yellow, 4);
const atom = (c: Ctx, x: number, y: number, r: number, col = "#3a3540") => { shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.14)); line(c, [[x - r * 0.45, y - r * 0.15], [x - r * 0.25, y - r * 0.5]], Math.max(2, r * 0.16), WHITE); };
const rows = (c: Ctx, x: number, y: number, w: number, h: number, step: number) => { for (let yy = y + step; yy < y + h - 20; yy += step) line(c, [[x + 130, yy], [x + w - 40, yy]], 3, "#cfe0ee"); line(c, [[x + 110, y + 10], [x + 110, y + h - 10]], 3, "#e9a0a0"); };
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => { tile(c, x, y, w, h, "#fffaf0", 24); rows(c, x, y, w, h, 60); for (let yy = y + 60; yy < y + h - 30; yy += 110) shape(c, () => ell(c, x + 50, yy, 16, 16), INK, 0); };
const pane = (c: Ctx, x: number, y: number, w: number, h: number, bg: string, fn: () => void) => { c.save(); c.beginPath(); rrect(c, x, y, w, h, 18); c.clip(); c.fillStyle = bg; c.fillRect(x, y, w, h); fn(); c.restore(); shape(c, () => rrect(c, x, y, w, h, 18), "rgba(0,0,0,0)", 6); };

// ------------------------------------------------------------------ living things (icons: centre at x, y; k = size, 1 is about 180 px)
const iGrass = (c: Ctx, x: number, y: number, k = 1) => {
  const base = y + 55 * k;
  for (const pass of [0, 1]) for (let i = -3; i <= 3; i++) { const h = (100 - Math.abs(i) * 12) * k, bx = x + i * 14 * k, tx = x + i * 28 * k; const p = [[bx, base], [(bx + tx) / 2 + i * 3 * k, base - h * 0.6], [tx, base - h]]; if (pass === 0) line(c, p, 17 * k, INK); else line(c, p, 9 * k, i % 2 ? COL.green : COL.greenLt); }
  shape(c, () => ell(c, x, base + 4 * k, 62 * k, 11 * k), COL.soil, 4);
};
const iHopper = (c: Ctx, x: number, y: number, k = 1) => grasshopper(c, x, y, 0.22 * k);
const iFrog = (c: Ctx, x: number, y: number, k = 1) => frog(c, x - 15 * k, y, 0.75 * k);
const iBird = (c: Ctx, x: number, y: number, k = 1) => bird(c, x, y, 0.55 * k);
const iFish = (c: Ctx, x: number, y: number, k = 1) => fish(c, x, y, 0.55 * k);
const iTiger = (c: Ctx, x: number, y: number, k = 1) => tiger(c, x - 6 * k, y + 28 * k, 0.4 * k);
const iCrow = (c: Ctx, x: number, y: number, k = 1) => crow(c, x, y + 55 * k, 0.6 * k);
const iGecko = (c: Ctx, x: number, y: number, k = 1) => gecko(c, x - 25 * k, y, 0.35 * k);
const iTree = (c: Ctx, x: number, y: number, k = 1) => tree(c, x, y + 68 * k, 0.3 * k);
const iAnt = (c: Ctx, x: number, y: number, k = 1) => ant(c, x - 8 * k, y + 30 * k, 0.8 * k);
const iMosq = (c: Ctx, x: number, y: number, k = 1) => mosquito(c, x, y, 1.3 * k);
const iSun = (c: Ctx, x: number, y: number, k = 1) => sun(c, x, y, 50 * k);
const snake = (c: Ctx, x: number, y: number, k = 1, col = "#c7a14a", dk = "#8a6a28") => {
  const P = (t: number) => [x + (t - 0.5) * 300 * k, y + Math.sin(t * Math.PI * 2.5) * 38 * k];
  const pts: number[][] = []; for (let i = 0; i <= 30; i++) pts.push(P(i / 30));
  line(c, pts, 46 * k, INK); line(c, pts, 34 * k, col);
  for (let i = 2; i < 28; i += 3) { const p = P(i / 30); shape(c, () => ell(c, p[0], p[1], 7 * k, 7 * k), dk, 0); }
  const h = P(1), g = P(0.97), an = Math.atan2(h[1] - g[1], h[0] - g[0]);
  shape(c, () => ell(c, h[0] + 12 * k, h[1], 34 * k, 24 * k, an), col, 5);
  shape(c, () => ell(c, h[0] + 14 * k, h[1] - 8 * k, 7 * k, 7 * k), WHITE, 3); shape(c, () => ell(c, h[0] + 16 * k, h[1] - 8 * k, 3.5 * k, 3.5 * k), INK, 0);
  line(c, [[h[0] + 42 * k, h[1] + 2 * k], [h[0] + 68 * k, h[1] + 4 * k], [h[0] + 80 * k, h[1] - 6 * k]], 4 * k, RED); line(c, [[h[0] + 68 * k, h[1] + 4 * k], [h[0] + 80 * k, h[1] + 14 * k]], 4 * k, RED);
};
const eagle = (c: Ctx, x: number, y: number, k = 1) => { // perched, facing right; centre of the body
  c.save(); c.translate(x, y); c.scale(k, k);
  shape(c, () => polyP(c, [[-40, 50], [-70, 130], [-20, 120], [10, 60]]), "#5a3a22", 5);
  for (const lx of [-8, 24]) { line(c, [[lx, 62], [lx, 96]], 11, INK); line(c, [[lx, 62], [lx, 96]], 6, COL.yellow); line(c, [[lx - 14, 100], [lx + 16, 100]], 11, INK); line(c, [[lx - 12, 100], [lx + 14, 100]], 6, COL.yellow); }
  const body = () => ell(c, 0, 0, 56, 78, -0.1);
  shape(c, body, "#8a5a3c", 6); shade(c, body, "#5a3a22", 14, 12, 0.6);
  shape(c, () => ell(c, 14, 14, 30, 48, -0.1), "#ead9bb", 0);
  shape(c, () => ell(c, -22, 0, 32, 58, 0.15), "#6a4128", 5);
  shape(c, () => ell(c, 26, -88, 32, 30), "#f7f1e3", 6);
  shape(c, () => polyP(c, [[52, -96], [84, -82], [76, -70], [56, -72]]), COL.yellow, 5);
  shape(c, () => ell(c, 38, -96, 7, 7), WHITE, 3); shape(c, () => ell(c, 40, -96, 3.5, 3.5), INK, 0);
  c.restore();
};
const goat = (c: Ctx, x: number, y: number, k = 1) => { // centre of the body, facing right
  c.save(); c.translate(x, y); c.scale(k, k);
  const T = "#b8895c", TD = "#8d6640";
  shadow(c, 10, 108, 120, 12);
  for (const lx of [-62, -34, 52, 80]) { line(c, [[lx, 20], [lx + 2, 100]], 14, INK); line(c, [[lx, 20], [lx + 2, 100]], 7, lx === -34 || lx === 80 ? TD : T); line(c, [[lx - 4, 102], [lx + 8, 102]], 12, INK); }
  line(c, [[-84, -18], [-102, -48]], 14, INK); line(c, [[-84, -18], [-102, -48]], 8, T);
  line(c, [[60, -14], [106, -68]], 52, INK); line(c, [[60, -14], [106, -68]], 40, T);
  const body = () => ell(c, 0, 0, 94, 46);
  shape(c, body, T, 6); shade(c, body, TD, 12, 14, 0.6);
  shape(c, () => ell(c, 124, -86, 34, 24, 0.5), T, 6);
  shape(c, () => ell(c, 152, -72, 15, 13, 0.5), "#e8c4a8", 5);
  shape(c, () => ell(c, 100, -76, 22, 9, 1.0), TD, 5);
  line(c, [[118, -106], [100, -150], [76, -156]], 12, INK); line(c, [[118, -106], [100, -150], [76, -156]], 6, "#e8e0cc");
  shape(c, () => polyP(c, [[144, -58], [150, -30], [160, -56]]), TD, 4);
  shape(c, () => ell(c, 134, -92, 6, 7), INK, 0);
  c.restore();
};
const deer = (c: Ctx, x: number, y: number, k = 1, antlers = true) => { // chital, centre of the body, facing right
  c.save(); c.translate(x, y); c.scale(k, k);
  const T = "#c98a4b", TD = "#a86a30";
  for (const lx of [-62, -34, 52, 80]) { line(c, [[lx, 10], [lx + 4, 105]], 14, INK); line(c, [[lx, 10], [lx + 4, 105]], 7, lx === -34 || lx === 80 ? TD : T); }
  line(c, [[-84, -14], [-104, -2]], 14, INK); line(c, [[-84, -14], [-104, -2]], 8, "#f7ecd5");
  line(c, [[62, -16], [104, -78]], 44, INK); line(c, [[62, -16], [104, -78]], 32, T);
  const body = () => ell(c, 0, 0, 94, 44);
  shape(c, body, T, 6); shade(c, body, TD, 12, 14, 0.6);
  for (const [sx, sy] of [[-50, -12], [-14, -22], [24, -12], [-30, 10], [10, 6], [48, 8]]) shape(c, () => ell(c, sx, sy, 6, 5), "#f7ecd5", 0);
  shape(c, () => ell(c, 122, -90, 30, 20, 0.45), T, 6);
  shape(c, () => ell(c, 148, -82, 6, 6), INK, 0);
  shape(c, () => ell(c, 106, -108, 8, 16, -0.6), TD, 4);
  shape(c, () => ell(c, 126, -96, 5, 5), INK, 0);
  if (antlers) { const col = "#f2e6c8"; for (const p of [[[112, -108], [104, -156], [116, -198]], [[104, -156], [136, -172]], [[110, -182], [84, -198]]]) { line(c, p, 13, INK); line(c, p, 7, col); } }
  c.restore();
};
const caterpillar = (c: Ctx, x: number, y: number, k = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  for (let i = 0; i < 6; i++) { const px = -85 + i * 32, py = -Math.sin(i / 5 * Math.PI) * 18; line(c, [[px, py + 14], [px, py + 34]], 8, INK); shape(c, () => ell(c, px, py, 22, 22), i % 2 ? "#6fbf4a" : "#8fcf5a", 5); }
  shape(c, () => ell(c, 106, -12, 24, 24), "#e8903a", 5); shape(c, () => ell(c, 114, -18, 6, 6), WHITE, 2); shape(c, () => ell(c, 116, -18, 3, 3), INK, 0);
  line(c, [[116, -34], [128, -52]], 4); 
  c.restore();
};
const moth = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, -26, -10, 30, 16, -0.5), "#d9c3a0", 5); shape(c, () => ell(c, 26, -10, 30, 16, 0.5), "#d9c3a0", 5);
  shape(c, () => ell(c, 0, 4, 11, 26), "#a98a62", 5);
  line(c, [[-4, -22], [-18, -44]], 4); line(c, [[4, -22], [18, -44]], 4);
  c.restore();
};
const beetle = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const dx of [-16, 0, 16]) { line(c, [[dx, 0], [dx - 24, 26]], 5); line(c, [[dx, 0], [dx + 24, 26]], 5); }
  shape(c, () => ell(c, 0, 0, 30, 36), "#3b2f4f", 5); line(c, [[0, -34], [0, 34]], 3, WHITE);
  shape(c, () => ell(c, 0, -40, 14, 12), "#3b2f4f", 4);
  c.restore();
};
const mushroom = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -14, -50, 28, 52, 10), "#f7f1e3", 5);
  shape(c, () => { c.moveTo(-50, -48); c.bezierCurveTo(-50, -110, 50, -110, 50, -48); c.closePath(); }, "#e4523b", 5);
  for (const [dx, dy] of [[-22, -70], [10, -86], [26, -62]]) shape(c, () => ell(c, dx, dy, 7, 6), WHITE, 0);
  c.restore();
};
const worm = (c: Ctx, x: number, y: number, s: number) => {
  const p: number[][] = []; for (let i = 0; i <= 14; i++) p.push([x + (i - 7) * 11 * s, y + Math.sin(i * 0.9) * 9 * s]);
  line(c, p, 18 * s, INK); line(c, p, 11 * s, COL.pink);
};
const droplet = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.5); c.quadraticCurveTo(x - r * 1.1, y, x - r, y + r * 0.3); c.arc(x, y + r * 0.3, r, Math.PI, 0, true); c.quadraticCurveTo(x + r * 1.1, y, x, y - r * 1.5); c.closePath(); }, COL.water, 5);
const plankton = (c: Ctx, x: number, y: number, k = 1) => { for (const [dx, dy, r] of [[-36, 10, 20], [8, -22, 24], [34, 18, 18], [-6, 30, 14], [-44, -26, 12]]) { shape(c, () => ell(c, x + dx * k, y + dy * k, r * k, r * k), "#7fc05a", 4); shape(c, () => ell(c, x + dx * k, y + dy * k, r * 0.4 * k, r * 0.4 * k), COL.greenDk, 0); } };
const larva = (c: Ctx, x: number, y: number, k = 1) => { const p: number[][] = []; for (let i = 0; i <= 10; i++) p.push([x + (i - 5) * 11 * k, y + Math.sin(i * 0.7) * 14 * k]); line(c, p, 18 * k, INK); line(c, p, 11 * k, "#9a8a6a"); shape(c, () => ell(c, x - 66 * k, y - 8 * k, 14 * k, 13 * k), "#7a6a52", 4); line(c, [[x + 50 * k, y - 10 * k], [x + 66 * k, y - 34 * k]], 5 * k); };
const tadpole = (c: Ctx, x: number, y: number, k = 1) => { shape(c, () => polyP(c, [[x - 20 * k, y], [x - 90 * k, y - 22 * k], [x - 90 * k, y + 22 * k]]), "#5a4d44", 4); shape(c, () => ell(c, x + 4 * k, y, 46 * k, 34 * k), "#4a3f3a", 5); shape(c, () => ell(c, x + 24 * k, y - 10 * k, 7 * k, 7 * k), WHITE, 3); shape(c, () => ell(c, x + 26 * k, y - 10 * k, 3 * k, 3 * k), INK, 0); };
const starfish = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = rot + (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.42 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), "#8b5fb0", Math.max(4, r * 0.06)); shade(c, () => polyP(c, pts), "#6a3f8e", r * 0.12, r * 0.12, 0.6);
  for (let i = 0; i < 5; i++) { const a = rot + (i * 2 * Math.PI) / 5 - Math.PI / 2; for (const t of [0.35, 0.6, 0.8]) shape(c, () => ell(c, x + Math.cos(a) * r * t, y + Math.sin(a) * r * t, r * 0.06, r * 0.06), "#f3a53c", 0); }
};
const mussel = (c: Ctx, x: number, y: number, s: number, rot: number) => { shape(c, () => { c.save(); c.translate(x, y); c.rotate(rot); c.moveTo(-26 * s, 0); c.quadraticCurveTo(-18 * s, -22 * s, 24 * s, -12 * s); c.quadraticCurveTo(34 * s, 0, 24 * s, 12 * s); c.quadraticCurveTo(-18 * s, 22 * s, -26 * s, 0); c.closePath(); c.restore(); }, "#33406e", Math.max(2.5, s * 3)); c.save(); c.translate(x, y); c.rotate(rot); line(c, [[-16 * s, 0], [18 * s, 0]], Math.max(2, s * 2.5), "#7d8cc4"); c.restore(); };
const limpet = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => { c.moveTo(x - 26 * s, y); c.quadraticCurveTo(x, y - 46 * s, x + 26 * s, y); c.closePath(); }, "#e8dcc0", 5); line(c, [[x, y - 30 * s], [x - 12 * s, y - 4 * s]], 3, "#b9a77f"); line(c, [[x, y - 30 * s], [x + 12 * s, y - 4 * s]], 3, "#b9a77f"); };
const seaweed = (c: Ctx, x: number, y: number, s: number, col = "#b54a52") => { for (const dx of [-14, 0, 14]) { const p = [[x + dx * s, y], [x + (dx - 14) * s, y - 40 * s], [x + (dx + 10) * s, y - 80 * s], [x + (dx - 6) * s, y - 110 * s]]; line(c, p, 14 * s, INK); line(c, p, 8 * s, col); } };
const lilyPad = (c: Ctx, x: number, y: number, rx: number) => { shape(c, () => ell(c, x, y, rx, rx * 0.28), COL.leaf, 5); };

type Node = { x: number; y: number; r?: number; draw: (c: Ctx, x: number, y: number) => void };
// icons joined by arrows that point from the food to the eater
const foodWeb = (c: Ctx, nodes: Node[], edges: [number, number, string?][], w = 9) => {
  nodes.forEach((n) => n.draw(c, n.x, n.y));
  edges.forEach(([a, b, col]) => { const A = nodes[a], B = nodes[b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; const ra = (A.r ?? 85) + 6, rb = (B.r ?? 85) + 16; arrow(c, [[A.x + ux * ra, A.y + uy * ra], [B.x - ux * rb, B.y - uy * rb]], col ?? RED, w); });
};
// a row of icons on white tiles joined by arrows
const chain = (c: Ctx, y: number, tw: number, th: number, gap: number, draws: ((c: Ctx, x: number, y: number) => void)[], x0?: number) => {
  const total = draws.length * tw + (draws.length - 1) * gap, sx = x0 ?? (D - total) / 2;
  draws.forEach((d, i) => { const x = sx + i * (tw + gap); tile(c, x, y, tw, th, WHITE, 28); d(c, x + tw / 2, y + th / 2); });
  for (let i = 0; i < draws.length - 1; i++) { const x = sx + i * (tw + gap) + tw; arrow(c, [[x + 8, y + th / 2], [x + gap - 8, y + th / 2]], RED, 9); }
};

const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 10) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
// a curved double-headed arrow over a point: swinging back and forth
const swing = (c: Ctx, cx: number, cy: number, r: number, half = 0.9) => { arrow(c, arcPts(cx, cy, r, -Math.PI / 2, -Math.PI / 2 - half), RED, 10); arrow(c, arcPts(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + half), RED, 10); };

// ================================================================== the cards
// 0 intro: a window with three small scenes outside
const intro = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 80, 100, 920, 760, 34), COL.woodDk, 7);
  const px = [125, 412, 700];
  pane(c, px[0], 145, 255, 630, "#35406e", () => {
    for (let r = 230; r > 60; r -= 50) { c.globalAlpha = 0.14; shape(c, () => ell(c, px[0] + 128, 250, r, r * 0.55), COL.yellow, 0); c.globalAlpha = 1; }
    shape(c, () => rrect(c, px[0] + 28, 232, 200, 34, 17), "#fffbe0", 6);
    gecko(c, px[0] + 110, 500, 0.42, 0);
    moth(c, px[0] + 195, 335, 1.0);
    for (const [sx, sy] of [[40, 60], [200, 80], [110, 120], [230, 150]]) shape(c, () => ell(c, px[0] + sx, 145 + sy, 4, 4), WHITE, 0);
  });
  pane(c, px[1], 145, 255, 630, "#bfe0f5", () => {
    sun(c, px[1] + 190, 260, 36);
    c.fillStyle = WALL; c.fillRect(px[1], 640, 255, 135); line(c, [[px[1], 640], [px[1] + 255, 640]], 6);
    for (let k = 0; k < 3; k++) line(c, [[px[1], 690 + k * 40], [px[1] + 255, 690 + k * 40]], 3, "#cdb98e");
    crow(c, px[1] + 150, 642, 0.7, false, false);
  });
  pane(c, px[2], 145, 255, 630, "#d8ecb0", () => {
    line(c, [[px[2], 760], [px[2] + 255, 690]], 20, INK); line(c, [[px[2], 760], [px[2] + 255, 690]], 12, COL.brown);
    leaf(c, px[2] + 30, 720, 220, -0.5, COL.leaf); leaf(c, px[2] + 60, 730, 170, -1.2, COL.green); leaf(c, px[2] + 120, 715, 140, 0.35, COL.leaf);
    caterpillar(c, px[2] + 140, 590, 0.82, -0.28);
  });
  shape(c, () => rrect(c, 55, 830, 970, 62, 18), COL.wood, 7);
};

// 1 summary: a food web on a notebook page, the Sun in the corner
const summary = (c: Ctx) => {
  ground(c);
  notebook(c, 60, 50, 960, 980);
  sun(c, 900, 150, 52);
  const N: Node[] = [
    { x: 330, y: 880, draw: (c, x, y) => iGrass(c, x, y, 1.1) },
    { x: 700, y: 870, draw: (c, x, y) => iTree(c, x, y, 1.2) },
    { x: 330, y: 650, draw: (c, x, y) => iHopper(c, x, y, 1.1) },
    { x: 700, y: 650, draw: (c, x, y) => caterpillar(c, x, y, 1) },
    { x: 330, y: 440, draw: (c, x, y) => iFrog(c, x, y, 1) },
    { x: 700, y: 440, draw: (c, x, y) => iBird(c, x, y, 1) },
    { x: 330, y: 250, draw: (c, x, y) => snake(c, x, y, 0.9) },
    { x: 700, y: 245, draw: (c, x, y) => eagle(c, x, y, 0.62) },
  ];
  foodWeb(c, N, [[0, 2], [1, 3], [2, 4], [2, 5], [3, 5], [3, 4], [4, 6], [5, 7], [6, 7]], 8);
  arrow(c, [[935, 245], [935, 700]], COL.orange, 10);
};

// 2 flow.e2 leaf bite survey: a leaf full of bites, a caterpillar, a tally
const leafSurvey = (c: Ctx) => {
  ground(c);
  leaf(c, 90, 860, 700, -0.62, COL.leaf);
  const mid = (t: number, off: number) => { const an = -0.62; return [90 + Math.cos(an) * 700 * t - Math.sin(an) * off, 860 + Math.sin(an) * 700 * t + Math.cos(an) * off]; };
  for (const [t, off, rx, ry] of [[0.28, 36, 26, 20], [0.4, -50, 30, 24], [0.52, 30, 22, 18], [0.62, -30, 28, 20], [0.72, 24, 20, 16], [0.34, 0, 16, 14]]) { const p = mid(t, off); shape(c, () => ell(c, p[0], p[1], rx, ry, 0.5), BG, 5); }
  const cp = mid(0.8, 8); caterpillar(c, cp[0] - 10, cp[1] - 10, 0.95, -0.62);
  tile(c, 650, 640, 340, 340, "#fffaf0", 28);
  for (let i = 0; i < 4; i++) line(c, [[720 + i * 50, 700], [720 + i * 50, 800]], 10);
  line(c, [[700, 790], [890, 710]], 10, RED);
  for (let i = 0; i < 2; i++) line(c, [[720 + i * 50, 850], [720 + i * 50, 940]], 10);
};

// 3 flow.a1 spot an eater: a child with a notebook watches a crow eat a chapati
const spotEater = (c: Ctx) => {
  ground(c, "#d8ecb0");
  c.fillStyle = "#c2dc92"; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  person(c, 230, 960, 640, { armR: [-0.5, -1.0], armL: [Math.PI * 0.55, Math.PI * 0.3] });
  tile(c, 285, 590, 130, 160, "#fffaf0", 14); line(c, [[308, 630], [392, 630]], 5, "#7aa0c8"); line(c, [[308, 666], [392, 666]], 5, "#7aa0c8");
  shape(c, () => ell(c, 770, 860, 70, 22), "#e8c07a", 5); shape(c, () => ell(c, 745, 856, 10, 6), "#b5833a", 0);
  crow(c, 780, 840, 1.45, false, false);
};

// 4 flow.p1 street food web: a chart on the wall, a child and a grown-up
const streetWeb = (c: Ctx) => {
  ground(c);
  tile(c, 235, 90, 640, 700, "#fffaf0", 22);
  const N: Node[] = [
    { x: 355, y: 650, draw: (c, x, y) => iTree(c, x, y, 0.95), r: 70 },
    { x: 560, y: 660, draw: (c, x, y) => caterpillar(c, x, y, 0.7), r: 70 },
    { x: 770, y: 650, draw: (c, x, y) => iAnt(c, x, y, 0.9), r: 55 },
    { x: 450, y: 420, draw: (c, x, y) => iGecko(c, x, y, 0.9), r: 70 },
    { x: 680, y: 250, draw: (c, x, y) => iCrow(c, x, y, 0.95), r: 70 },
  ];
  foodWeb(c, N, [[0, 1], [1, 3], [2, 3], [3, 4], [2, 4], [1, 4]], 7);
  person(c, 105, 1010, 560, { armR: [-0.7, -0.5] });
  person(c, 950, 1010, 660, { adult: true, armL: [Math.PI * 0.62, Math.PI * 0.98] });
};

// 5 term.0 food chain
const termChain = (c: Ctx) => {
  ground(c);
  chain(c, 400, 168, 250, 50, [(c, x, y) => iGrass(c, x, y, 0.95), (c, x, y) => iHopper(c, x, y, 0.92), (c, x, y) => iFrog(c, x, y, 0.7), (c, x, y) => snake(c, x, y, 0.45), (c, x, y) => eagle(c, x, y, 0.66)]);
};

// 6 term.1 arrow in a food chain: grass, a big arrow, a goat
const termArrow = (c: Ctx) => {
  ground(c);
  iGrass(c, 230, 580, 1.7);
  goat(c, 790, 560, 1.45);
  arrow(c, [[400, 560], [585, 560]], RED, 22);
};

// 7 term.11 food web in a pond
const termWeb = (c: Ctx) => {
  ground(c, "#d8ecb0");
  shape(c, () => rrect(c, 20, 470, 1040, 590, 60), "#a9d4f0", 6);
  const N: Node[] = [
    { x: 540, y: 930, draw: (c, x, y) => plankton(c, x, y, 1.2), r: 70 },
    { x: 200, y: 740, draw: (c, x, y) => tadpole(c, x, y, 1.2), r: 80 },
    { x: 880, y: 800, draw: (c, x, y) => larva(c, x, y, 1.15), r: 75 },
    { x: 540, y: 660, draw: (c, x, y) => iFish(c, x, y, 0.95), r: 80 },
    { x: 880, y: 520, draw: (c, x, y) => iFrog(c, x, y, 0.8), r: 75 },
    { x: 280, y: 280, draw: (c, x, y) => iBird(c, x, y, 0.95), r: 85 },
    { x: 800, y: 240, draw: (c, x, y) => snake(c, x, y, 0.9), r: 80 },
  ];
  foodWeb(c, N, [[0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6]], 8);
};

// 8 term.12 energy: food goes in, the child runs
const termEnergy = (c: Ctx) => {
  ground(c);
  plate(c, 270, 790, 210, 72);
  shape(c, () => { c.moveTo(150, 780); c.bezierCurveTo(160, 640, 380, 640, 390, 780); c.closePath(); }, "#fffaf0", 5);
  for (const [dx, dy] of [[-40, -30], [0, -60], [40, -26], [-10, -10], [26, 0]]) shape(c, () => ell(c, 270 + dx, 760 + dy, 11, 6, 0.4), "#e8dcc0", 2.5);
  shape(c, () => ell(c, 420, 800, 52, 18), "#e8a83c", 5);
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([360 + t * 280, 560 - Math.sin(t * Math.PI) * 120 - t * 20]); }
  line(c, pts, 10, RED);
  const e = pts[12], b = pts[11], an = Math.atan2(e[1] - b[1], e[0] - b[0]);
  line(c, [[e[0] - Math.cos(an - 0.5) * 32, e[1] - Math.sin(an - 0.5) * 32], e, [e[0] - Math.cos(an + 0.5) * 32, e[1] - Math.sin(an + 0.5) * 32]], 10, RED);
  bolt(c, 450, 480, 40); bolt(c, 540, 450, 34);
  person(c, 760, 960, 640, { armL: [Math.PI * 0.7, Math.PI * 0.45], armR: [-0.5, 0.3] });
  for (const [bx, by, r] of [[610, 560, 36], [930, 450, 32], [900, 640, 28], [620, 720, 30]]) bolt(c, bx, by, r);
  for (let i = 0; i < 3; i++) line(c, [[560, 760 + i * 50], [620, 760 + i * 50]], 8, COL.steelDk);
};

// 9 term.13 energy pyramid
const termPyramid = (c: Ctx) => {
  ground(c);
  const apex = [540, 120], by = 940, L = 90, R = 990, xAt = (y: number, s: number) => (s < 0 ? apex[0] - ((y - apex[1]) / (by - apex[1])) * (apex[0] - L) : apex[0] + ((y - apex[1]) / (by - apex[1])) * (R - apex[0]));
  const layer = (y0: number, y1: number, col: string) => shape(c, () => polyP(c, [[xAt(y0, -1), y0], [xAt(y0, 1), y0], [xAt(y1, 1), y1], [xAt(y1, -1), y1]]), col, 6);
  layer(120, 320, "#f39a3c"); layer(320, 520, "#7fc4a8"); layer(520, 730, "#e8d27a"); layer(730, 940, "#6aa53f");
  snake(c, 540, 262, 0.34);
  iFrog(c, 540, 420, 0.7);
  iHopper(c, 450, 620, 0.9); iHopper(c, 640, 626, 0.9);
  for (const x of [270, 400, 540, 680, 810]) iGrass(c, x, 850, 0.9);
};

// 10 term.16 biomagnification: bottles getting darker, more poison dots, who is in each
const termBio = (c: Ctx) => {
  ground(c);
  const liquid = ["#8fc3ea", "#8aa9dc", "#8a8fc9", "#8a74b5", "#7a5a9c"], counts = [1, 3, 7, 14, 26], r = rnd(5);
  const ic: ((c: Ctx, x: number, y: number) => void)[] = [(c, x, y) => droplet(c, x, y, 28), (c, x, y) => plankton(c, x, y, 1), (c, x, y) => iFish(c, x, y, 0.55), (c, x, y) => iFish(c, x, y, 0.85), (c, x, y) => eagle(c, x, y, 0.5)];
  for (let i = 0; i < 5; i++) {
    const x = 150 + i * 195, y = 560;
    glass(c, x, y, 140, 250, 0.8, liquid[i]);
    for (let k = 0; k < counts[i]; k++) shape(c, () => ell(c, x - 38 + r() * 76, y - 190 + r() * 168, 8, 8), RED, 2.5);
    ic[i](c, x, 760);
    if (i < 4) arrow(c, [[x + 85, 450], [x + 110, 450]], RED, 8);
  }
};

// 11 term.17 ecosystem: a pond cut open
const termEco = (c: Ctx) => {
  ground(c, SKYD);
  sun(c, 900, 130, 44);
  c.fillStyle = COL.soil; c.fillRect(0, 380, D, 700);
  c.fillStyle = COL.greenLt; c.fillRect(0, 340, D, 50); line(c, [[0, 340], [D, 340]], 6);
  grassBlades(c, 0, 180, 345, 30, 3); grassBlades(c, 900, 1080, 345, 30, 5);
  tree(c, 90, 345, 0.5);
  for (const [sx, sy, rx] of [[80, 760, 40], [980, 700, 46], [60, 960, 34], [1000, 940, 40]]) shape(c, () => ell(c, sx, sy, rx, rx * 0.65), "#6a4128", 4);
  const pond = () => { c.moveTo(190, 365); c.bezierCurveTo(160, 700, 330, 960, 540, 960); c.bezierCurveTo(750, 960, 920, 700, 890, 365); c.closePath(); };
  shape(c, pond, COL.water, 7);
  c.save(); c.beginPath(); pond(); c.clip(); c.fillStyle = COL.soilDk; c.beginPath(); ell(c, 540, 990, 420, 110); c.fill(); c.restore();
  shape(c, () => rrect(c, 190, 355, 700, 24, 12), "#cfe9fa", 0);
  for (const x of [380, 470, 640, 730]) { const p = [[x, 920], [x - 10, 820], [x + 8, 740]]; line(c, p, 14, INK); line(c, p, 8, COL.leafDk); leaf(c, x + 6, 780, 70, -0.9, COL.leaf); }
  fish(c, 560, 580, 0.42); fish(c, 440, 700, 0.34, { flip: true });
  lilyPad(c, 380, 392, 80); frog(c, 365, 350, 0.45);
  plankton(c, 700, 520, 0.7);
  for (const [bx, by, br] of [[640, 640, 10], [665, 600, 7], [690, 560, 12]]) shape(c, () => ell(c, bx, by, br, br), "rgba(255,255,255,0.7)", 3);
  bird(c, 640, 200, 0.4, { flip: false });
};

// 12 term.18 atom: zoom from a blade of grass to tiny balls
const termAtom = (c: Ctx) => {
  ground(c);
  iGrass(c, 150, 640, 1.5);
  line(c, [[520, 335], [800, 270]], 6); line(c, [[520, 655], [800, 790]], 6);
  shape(c, () => ell(c, 520, 495, 160, 160), "#d8ecb0", 7);
  c.save(); c.beginPath(); ell(c, 520, 495, 152, 152); c.clip();
  for (let i = -2; i <= 2; i++) { const p = [[520 + i * 70, 700], [520 + i * 80, 560], [520 + i * 120, 330]]; line(c, p, 56, INK); line(c, p, 44, i % 2 ? COL.green : COL.greenLt); }
  c.restore();
  shape(c, () => ell(c, 520, 495, 160, 160), "rgba(0,0,0,0)", 7);
  line(c, [[640, 590], [720, 650]], 14, INK);
  shape(c, () => ell(c, 800, 530, 250, 250), WHITE, 7);
  const ring: number[][] = []; for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3 - Math.PI / 2; ring.push([800 + Math.cos(a) * 95, 530 + Math.sin(a) * 95]); }
  line(c, [...ring, ring[0]], 10, INK);
  for (const [x, y] of ring) line(c, [[x, y], [800 + (x - 800) * 1.7, 530 + (y - 530) * 1.7]], 8, INK);
  ring.forEach(([x, y]) => atom(c, x, y, 34));
  ring.forEach(([x, y], i) => atom(c, 800 + (x - 800) * 1.7, 530 + (y - 530) * 1.7, i % 2 ? 26 : 30, i % 2 ? "#e4523b" : "#ffffff"));
};

// 13 term.19 carbon: a black ball from a child's breath to a tree
const termCarbon = (c: Ctx) => {
  ground(c, SKYD);
  c.fillStyle = "#c2dc92"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  person(c, 200, 960, 640);
  tree(c, 840, 930, 1.05);
  const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([290 + t * 330, 400 - Math.sin(t * Math.PI) * 130 + t * 60]); }
  for (const i of [1, 3, 5, 7]) atom(c, pts[i][0], pts[i][1], 26 - i * 1.2);
  arrow(c, [[pts[8][0], pts[8][1]], [660, 470]], RED, 10);
  atom(c, 760, 560, 34); atom(c, 880, 520, 30);
};

// 14 term.20 fair test: four squares, one food each, ants coming
const termFair = (c: Ctx) => {
  ground(c, "#e6dcc6");
  for (let x = 0; x < D; x += 180) line(c, [[x, 0], [x, D]], 3, "#d2c7ad");
  for (let y = 0; y < D; y += 180) line(c, [[0, y], [D, y]], 3, "#d2c7ad");
  const xs = [75, 335, 595, 855];
  xs.forEach((x) => shape(c, () => rrect(c, x, 520, 170, 170, 8), WHITE, 6));
  const rr = rnd(3);
  for (let i = 0; i < 70; i++) { const a = rr() * 6.28, d = Math.sqrt(rr()) * 56; shape(c, () => rrect(c, xs[0] + 85 + Math.cos(a) * d - 4, 605 + Math.sin(a) * d * 0.7 - 4, 8, 8, 2), "#fdfdff", 1.5); }
  for (let i = 0; i < 45; i++) { const a = rr() * 6.28, d = Math.sqrt(rr()) * 58; shape(c, () => rrect(c, xs[1] + 85 + Math.cos(a) * d - 6, 605 + Math.sin(a) * d * 0.7 - 6, 11, 11, 2), "#e2e0ea", 1.5); }
  shape(c, () => ell(c, xs[2] + 85, 605, 62, 52), "#e8c07a", 5); for (const [dx, dy] of [[-20, -10], [22, 14], [8, -22], [-24, 20]]) shape(c, () => ell(c, xs[2] + 85 + dx, 605 + dy, 7, 6), "#b5833a", 0);
  const trail = [[900, 120], [850, 190], [780, 270], [720, 350], [690, 430], [700, 500]];
  shape(c, () => ell(c, 960, 100, 70, 36), "#8a5a3c", 5); shape(c, () => ell(c, 960, 98, 26, 12), INK, 0);
  trail.forEach(([x, y], i) => ant(c, x, y + 40, 0.3, true));
  ant(c, xs[0] + 50, 640, 0.3); ant(c, xs[0] + 110, 590, 0.3, true); ant(c, xs[0] + 90, 655, 0.3); ant(c, xs[2] + 50, 600, 0.3);
  for (const [x1, x2] of [[245, 335], [505, 595], [765, 855]]) { arrow(c, [[x1 + 8, 780], [x2 - 8, 780]], RED, 8); arrow(c, [[x2 - 8, 780], [x1 + 8, 780]], RED, 8); }
};

// 15 expl.0 what a food chain is: the arrow points to the eater (a wrong arrow crossed out)
const explChain = (c: Ctx) => {
  ground(c);
  notebook(c, 50, 140, 980, 800);
  chain(c, 230, 160, 210, 60, [(c, x, y) => iGrass(c, x, y, 0.8), (c, x, y) => iHopper(c, x, y, 0.8), (c, x, y) => iFrog(c, x, y, 0.6), (c, x, y) => snake(c, x, y, 0.4)], 170);
  shape(c, () => ell(c, 400, 335, 48, 46), "rgba(0,0,0,0)", 0); c.beginPath(); c.arc(360, 335, 40, 0, 6.3); c.strokeStyle = RED; c.lineWidth = 7; c.stroke();
  iGrass(c, 320, 700, 1.0); iHopper(c, 700, 700, 1.0);
  arrow(c, [[630, 700], [440, 700]], COL.steelDk, 12);
  line(c, [[495, 640], [575, 760]], 14, RED); line(c, [[575, 640], [495, 760]], 14, RED);
};

// 16 expl.1 producers, consumers and the Sun
const explSun = (c: Ctx) => {
  ground(c);
  sun(c, 190, 190, 70);
  arrow(c, [[190, 330], [190, 460]], COL.orange, 14);
  iGrass(c, 190, 590, 1.4);
  deer(c, 560, 620, 1.2);
  iTiger(c, 905, 640, 1.2);
  arrow(c, [[320, 600], [400, 600]], RED, 11);
  arrow(c, [[740, 600], [800, 600]], RED, 11);
  line(c, [[90, 800], [290, 800]], 18, COL.green); line(c, [[420, 800], [1000, 800]], 18, COL.orange);
};

// 17 expl.2 food web in a garden
const explWeb = (c: Ctx) => {
  ground(c, "#e4f0c8");
  c.fillStyle = "#b9d98a"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const N: Node[] = [
    { x: 190, y: 880, draw: (c, x, y) => iGrass(c, x, y, 1.0) },
    { x: 870, y: 850, draw: (c, x, y) => iTree(c, x, y, 1.2) },
    { x: 330, y: 650, draw: (c, x, y) => iHopper(c, x, y, 1.0) },
    { x: 740, y: 650, draw: (c, x, y) => caterpillar(c, x, y, 0.95) },
    { x: 200, y: 440, draw: (c, x, y) => iFrog(c, x, y, 0.95) },
    { x: 590, y: 430, draw: (c, x, y) => iBird(c, x, y, 0.95) },
    { x: 260, y: 200, draw: (c, x, y) => snake(c, x, y, 0.85) },
    { x: 780, y: 200, draw: (c, x, y) => eagle(c, x, y, 0.6) },
  ];
  foodWeb(c, N, [[0, 2, RED], [1, 3, COL.blue], [2, 4, RED], [2, 5, COL.orange], [3, 5, COL.blue], [3, 4, COL.orange], [4, 6, RED], [6, 7, RED], [5, 7, COL.blue]], 9);
};

// 18 expl.3 the clean-up crew: a circle from tiger to remains to soil to grass to deer
const explCycle = (c: Ctx) => {
  ground(c);
  const rem = (c: Ctx, x: number, y: number) => {
    shape(c, () => ell(c, x, y + 50, 120, 30), COL.soil, 5);
    for (let i = 0; i < 4; i++) { const p = [[x - 70 + i * 26, y + 40], [x - 78 + i * 26, y - 10], [x - 40 + i * 26, y - 40]]; line(c, p, 12, INK); line(c, p, 6, "#f6efdc"); }
    line(c, [[x - 90, y + 40], [x + 20, y + 44]], 12, INK); line(c, [[x - 90, y + 40], [x + 20, y + 44]], 6, "#f6efdc");
    shape(c, () => ell(c, x + 66, y + 20, 28, 22), "#f6efdc", 5); shape(c, () => ell(c, x + 72, y + 14, 7, 7), INK, 0);
    mushroom(c, x + 100, y + 56, 0.5); mushroom(c, x - 100, y + 56, 0.38); beetle(c, x + 30, y + 62, 0.35);
  };
  const soil = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y + 30, 120, 54), "#6a4128", 6); shade(c, () => ell(c, x, y + 30, 120, 54), "#4a2c18", 14, 16, 0.5); for (const [dx, dy] of [[-60, 28], [30, 14], [70, 44], [-20, 50]]) shape(c, () => ell(c, x + dx, y + dy, 8, 6), "#8a5a3c", 0); worm(c, x, y + 6, 1.1); };
  const N: Node[] = [
    { x: 540, y: 190, draw: (c, x, y) => iTiger(c, x, y, 1.15), r: 100 },
    { x: 870, y: 440, draw: rem, r: 105 },
    { x: 740, y: 840, draw: soil, r: 95 },
    { x: 340, y: 840, draw: (c, x, y) => iGrass(c, x, y, 1.1), r: 85 },
    { x: 205, y: 440, draw: (c, x, y) => deer(c, x, y + 20, 0.75), r: 100 },
  ];
  foodWeb(c, N, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]], 11);
};

// 19 expl.4 only a tenth passes on: four bowls, each smaller, heat rising
const explTenth = (c: Ctx) => {
  ground(c);
  const B = [[190, 150], [480, 110], [730, 72], [930, 44]];
  B.forEach(([x, r], i) => {
    bowl(c, x, 700, r);
    if (i === 0) grassBlades(c, x - r * 0.8, x + r * 0.8, 702, 150, 2, "#6aa53f");
    if (i === 1) { iHopper(c, x - 40, 640, 0.75); iHopper(c, x + 40, 650, 0.75); }
    if (i === 2) iFrog(c, x, 650, 0.5);
    if (i === 3) snake(c, x, 676, 0.2);
    for (const dx of [-0.5, 0, 0.5]) heat(c, x + dx * r * 0.9, 470, 130, RED, 8);
  });
  arrow(c, [[120, 880], [990, 880]], RED, 14);
};

// 20 expl.5 many plants, few tigers: a pyramid drawn as a forest
const explForest = (c: Ctx) => {
  ground(c, SKYD);
  const apex = [540, 120], by = 960, L = 60, R = 1020, xAt = (y: number, s: number) => apex[0] + s * ((y - apex[1]) / (by - apex[1])) * (R - apex[0]);
  void L;
  const layer = (y0: number, y1: number, col: string) => shape(c, () => polyP(c, [[xAt(y0, -1), y0], [xAt(y0, 1), y0], [xAt(y1, 1), y1], [xAt(y1, -1), y1]]), col, 6);
  layer(120, 400, "#e8c88a"); layer(400, 660, "#c9d98a"); layer(660, 960, "#7fb85a");
  for (const [x, y] of [[300, 930], [450, 940], [630, 940], [780, 930]]) tree(c, x, y, 0.36);
  for (const x of [380, 540, 700]) iGrass(c, x, 900, 0.55);
  for (const x of [400, 540, 690]) deer(c, x, 570, 0.5, true);
  tiger(c, 540, 360, 0.33);
};

// 21 expl.6 why chains are short: a tall wobbling ladder next to a short steady chain
const explShort = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#c2dc92"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const iconAt: (((c: Ctx, x: number, y: number) => void) | null)[] = [(c, x, y) => iGrass(c, x, y, 0.38), (c, x, y) => iHopper(c, x, y, 0.4), (c, x, y) => iFrog(c, x, y, 0.28), (c, x, y) => snake(c, x, y, 0.2), (c, x, y) => eagle(c, x, y, 0.22), null, null, null];
  for (let i = 0; i < 8; i++) {
    const w = 200 - i * 12, h = 84, y = 900 - (i + 1) * h, lean = i * i * 3.4, x = 270 - w / 2 + lean;
    c.globalAlpha = i > 4 ? 0.45 : 1;
    shape(c, () => rrect(c, x, y, w, h - 4, 14), ["#a9d58a", "#e8d27a", "#7fc4a8", "#f39a3c", "#c98a4b", "#d9c7e8", "#d9c7e8", "#d9c7e8"][i], 6);
    iconAt[i]?.(c, x + w / 2, y + (h - 4) / 2);
    c.globalAlpha = 1;
  }
  swing(c, 437, 250, 120);
  const W = 260;
  [(c: Ctx, x: number, y: number) => iGrass(c, x, y, 0.8), (c: Ctx, x: number, y: number) => iHopper(c, x, y, 0.8), (c: Ctx, x: number, y: number) => iFrog(c, x, y, 0.62)].forEach((d, i) => {
    const y = 900 - (i + 1) * 150;
    shape(c, () => rrect(c, 640, y, W, 144, 18), ["#a9d58a", "#e8d27a", "#7fc4a8"][i], 6); d(c, 640 + W / 2, y + 72);
  });
};

// 22 expl.7 predators and prey: two waves, one after the other
const explWaves = (c: Ctx) => {
  ground(c);
  deer(c, 270, 250, 0.8); iTiger(c, 790, 240, 1.25);
  line(c, [[180, 360], [360, 360]], 14, COL.teal); line(c, [[700, 360], [880, 360]], 14, COL.orange);
  tile(c, 70, 410, 940, 560, WHITE, 28);
  line(c, [[140, 470], [140, 900], [960, 900]], 8);
  const wave = (amp: number, mid: number, ph: number, col: string) => { const p: number[][] = []; for (let i = 0; i <= 60; i++) { const t = i / 60; p.push([160 + t * 780, mid - amp * Math.sin(t * Math.PI * 4 + ph)]); } line(c, p, 14, INK); line(c, p, 8, col); };
  wave(150, 640, 0, COL.teal);
  wave(80, 720, -1.3, COL.orange);
};

// 23 expl.8 keystone species: a shore with starfish, a shore without
const explShore = (c: Ctx) => {
  ground(c);
  const panel = (x: number) => { pane(c, x, 130, 470, 780, "#cfe9f3", () => { c.fillStyle = "#9a97a8"; c.beginPath(); c.moveTo(x, 520); c.quadraticCurveTo(x + 230, 460, x + 470, 540); c.lineTo(x + 470, 910); c.lineTo(x, 910); c.closePath(); c.fill(); line(c, [[x, 520], [x + 235, 480], [x + 470, 540]], 6); }); };
  panel(40); panel(570);
  starfish(c, 200, 660, 100, 0.3); starfish(c, 380, 790, 70, 0.8);
  seaweed(c, 110, 880, 1); seaweed(c, 300, 560, 0.7, "#58a14a"); seaweed(c, 430, 880, 0.9, "#b54a52");
  for (const [x, y] of [[80, 580], [220, 540], [340, 600], [440, 700], [90, 780], [250, 860]]) limpet(c, x, y, 0.9);
  for (const [x, y] of [[150, 820], [330, 700]]) mussel(c, x, y, 0.8, 0.4);
  shape(c, () => ell(c, 440, 590, 22, 22), "#e8a83c", 5); shape(c, () => ell(c, 440, 590, 9, 9), "#f2d08a", 3);
  const r = rnd(9);
  c.save(); c.beginPath(); c.moveTo(570, 520); c.quadraticCurveTo(800, 460, 1040, 540); c.lineTo(1040, 910); c.lineTo(570, 910); c.closePath(); c.clip();
  for (let row = 0; row < 8; row++) for (let col = 0; col < 11; col++) mussel(c, 590 + col * 44 + (row % 2) * 22 + r() * 6, 520 + row * 50 + r() * 6, 0.85, r() * 3.14);
  c.restore();
  line(c, [[570, 520], [805, 480], [1040, 540]], 6);
};

// 24 expl.10 poison builds up: red dots crowd the top of the chain
const explPoison = (c: Ctx) => {
  ground(c);
  const T = [[60, 100, 210, 280], [330, 100, 210, 280], [600, 100, 210, 280], [870, 100, 150, 280]];
  void T;
  const items: ((c: Ctx, x: number, y: number) => void)[] = [(c, x, y) => droplet(c, x, y, 28), (c, x, y) => plankton(c, x, y, 1), (c, x, y) => iFish(c, x, y, 0.5), (c, x, y) => iFish(c, x, y, 0.8)];
  const counts = [2, 6, 14, 26], r = rnd(11);
  const tw = 200, gap = 60, sx = 60;
  items.forEach((d, i) => {
    const x = sx + i * (tw + gap); tile(c, x, 120, tw, 260, WHITE, 28); d(c, x + tw / 2, 250);
    for (let k = 0; k < counts[i]; k++) shape(c, () => ell(c, x + 24 + r() * (tw - 48), 144 + r() * 212, 8, 8), RED, 2.5);
    if (i < 3) arrow(c, [[x + tw + 6, 250], [x + tw + gap - 6, 250]], RED, 9);
  });
  arrow(c, [[sx + 3 * (tw + gap) + 100, 394], [sx + 3 * (tw + gap) + 100, 520]], RED, 9);
  tile(c, 560, 530, 300, 400, WHITE, 28); eagle(c, 710, 730, 1.05);
  for (let k = 0; k < 55; k++) shape(c, () => ell(c, 585 + r() * 250, 555 + r() * 350, 8, 8), RED, 2.5);
  tile(c, 140, 560, 300, 340, WHITE, 28);
  const egg = () => { c.moveTo(290, 600); c.bezierCurveTo(390, 600, 410, 780, 340, 850); c.bezierCurveTo(300, 880, 280, 880, 240, 850); c.bezierCurveTo(170, 780, 190, 600, 290, 600); c.closePath(); };
  shape(c, egg, "#fbf1dc", 6); line(c, [[216, 740], [250, 700], [276, 760], [312, 700], [340, 750], [366, 720]], 7);
  for (let k = 0; k < 24; k++) shape(c, () => ell(c, 205 + r() * 170, 640 + r() * 200, 7, 7), RED, 2.5);
  arrow(c, [[558, 730], [452, 730]], RED, 9);
};

// 25 expl.12 atoms go round, energy flows through
const explAtoms = (c: Ctx) => {
  ground(c);
  const cloud = (c: Ctx, x: number, y: number) => { for (const [dx, dy, rx, ry] of [[0, 0, 110, 44], [-60, -26, 60, 44], [20, -44, 66, 50], [70, -16, 54, 38]]) shape(c, () => ell(c, x + dx, y + dy, rx, ry), "#ffffff", 5); atom(c, x + 10, y - 6, 26); };
  const N: Node[] = [
    { x: 460, y: 200, draw: cloud, r: 100 },
    { x: 850, y: 520, draw: (c, x, y) => { iGrass(c, x, y, 1.1); atom(c, x + 4, y - 6, 24); }, r: 100 },
    { x: 540, y: 840, draw: (c, x, y) => { goat(c, x, y, 0.85); atom(c, x - 36, y - 4, 19); }, r: 105 },
    { x: 210, y: 520, draw: (c, x, y) => { shape(c, () => ell(c, x, y + 40, 120, 56), "#6a4128", 6); worm(c, x - 10, y + 24, 1); atom(c, x + 50, y + 34, 24); }, r: 100 },
  ];
  foodWeb(c, N, [[0, 1], [1, 2], [2, 3], [3, 0]], 11);
  sun(c, 940, 120, 46);
  arrow(c, [[935, 220], [880, 380]], "#f5b800", 14);
  heat(c, 740, 980, 120, RED, 9); heat(c, 810, 960, 140, RED, 9); heat(c, 880, 980, 120, RED, 9);
};

// 26 expl.13 where are humans: a ladder numbered 1 to 5, a child near step 2
const explLadder = (c: Ctx) => {
  ground(c);
  const ys = [860, 695, 530, 365, 200];
  line(c, [[240, 120], [240, 940]], 24, INK); line(c, [[240, 120], [240, 940]], 14, COL.wood);
  line(c, [[600, 120], [600, 940]], 24, INK); line(c, [[600, 120], [600, 940]], 14, COL.wood);
  ys.forEach((y, i) => {
    line(c, [[240, y + 60], [600, y + 60]], 22, INK); line(c, [[240, y + 60], [600, y + 60]], 12, COL.woodDk);
    write(c, String(i + 1), 100, y - 20, 70, INK, 12);
  });
  iGrass(c, 420, ys[0] - 20, 0.8);
  goat(c, 420, ys[1] - 25, 0.62);
  iFrog(c, 420, ys[2] - 5, 0.65);
  iTiger(c, 420, ys[3] - 10, 1.0);
  eagle(c, 420, ys[4] - 5, 0.5);
  person(c, 830, 790, 420, { armR: [1.0, 0.1] });
  const h = 420, sx = 830 + 0.11 * h, sh = 790 - 0.74 * h, ex = sx + Math.cos(1.0) * 0.17 * h, ey = sh + 0.03 * h + Math.sin(1.0) * 0.17 * h, wx = ex + Math.cos(0.1) * 0.16 * h, wy = ey + Math.sin(0.1) * 0.16 * h;
  plate(c, wx + 6, wy + 14, 82, 26);
  shape(c, () => { c.moveTo(wx - 40, wy + 8); c.bezierCurveTo(wx - 30, wy - 30, wx + 40, wy - 30, wx + 52, wy + 8); c.closePath(); }, "#fffaf0", 4);
  shape(c, () => ell(c, wx + 50, wy + 12, 22, 9), "#e8a83c", 4);
  arrow(c, [[690, 640], [620, 700]], RED, 10);
};

// 27 expl.14 is there a balance of nature: scales that keep wobbling
const explBalance = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[470, 940], [610, 940], [570, 400], [510, 400]]), COL.steel, 6);
  shape(c, () => rrect(c, 380, 900, 320, 56, 18), COL.steelDk, 6);
  c.save(); c.translate(540, 400); c.rotate(-0.06);
  line(c, [[-380, 0], [380, 0]], 22, INK); line(c, [[-380, 0], [380, 0]], 12, COL.wood);
  for (const s of [-1, 1]) { const px = s * 340, py = 260 + s * 10; line(c, [[px, 0], [px - 90, py - 30]], 5); line(c, [[px, 0], [px + 90, py - 30]], 5); shape(c, () => { c.moveTo(px - 140, py - 30); c.bezierCurveTo(px - 130, py + 40, px + 130, py + 40, px + 140, py - 30); c.closePath(); }, COL.steel, 6); }
  c.restore();
  shape(c, () => ell(c, 540, 400, 30, 30), COL.steelDk, 6);
  iTiger(c, 215, 590, 0.95);
  deer(c, 790, 620, 0.42, false); deer(c, 880, 620, 0.42, false); deer(c, 700, 620, 0.42, false);
  swing(c, 540, 400, 340, 0.75);
};

export const ic_ecologyFoodChainsL3 = cards("sci.ecology.food-chains.L3 cards", [
  intro, summary, leafSurvey, spotEater, streetWeb, termChain, termArrow, termWeb, termEnergy, termPyramid,
  termBio, termEco, termAtom, termCarbon, termFair, explChain, explSun, explWeb, explCycle, explTenth,
  explForest, explShort, explWaves, explShore, explPoison, explAtoms, explLadder, explBalance,
]);
