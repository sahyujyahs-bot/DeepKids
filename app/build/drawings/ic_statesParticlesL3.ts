import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, BG, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, rnd, write, glass, plate, seed } from "./flatKit";

// sci.states.particles.L3 picture cards (activities, challenge, terms and idea cards, flat style)
type Grain = { f: string; d: string; s: string };
const SUGAR: Grain = { f: "#fff0cf", d: "#e0b25c", s: "#e8cf94" }, JAG: Grain = { f: "#b5702f", d: "#8a4f1d", s: "#8c5320" };
const SUG = "#f2a33a", WAT = "#7fb2f0", DARK = "#22303a", PAPERBG = "#fffaf0";

const ball = (c: Ctx, x: number, y: number, r: number, col: string, lw = 0) => {
  shape(c, () => ell(c, x, y, r, r), col, lw || Math.max(3, r * 0.14));
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.3, r, r); c.fillStyle = "rgba(43,35,64,0.22)"; c.fill(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = Math.max(3, r * 0.14); c.strokeStyle = INK; c.stroke();
  line(c, [[x - r * 0.5, y - r * 0.15], [x - r * 0.3, y - r * 0.5]], Math.max(2.5, r * 0.14), WHITE);
};
const grain = (c: Ctx, x: number, y: number, g: Grain, r = 10) => shape(c, () => ell(c, x, y, r, r * 0.8), g.f, 3.5);
const heap = (c: Ctx, x: number, y: number, w: number, h: number, g: Grain, seedN = 3) => {
  const p = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.18, y - h * 1.5, x, y - h); c.quadraticCurveTo(x + w * 0.18, y - h * 1.5, x + w / 2, y); c.closePath(); };
  shape(c, p, g.f, 5); shade(c, p, g.s, w * 0.08, 0, 0.5);
  const r = rnd(seedN);
  for (let i = 0; i < 14; i++) { const u = r(), v = r(), px = x - w * 0.36 + u * w * 0.72, py = y - 6 - v * h * 0.55 * (1 - Math.abs(u - 0.5) * 1.3); shape(c, () => ell(c, px, py, 4.5, 3.5), g.d, 0); }
};
const spoon = (c: Ctx, bx: number, by: number, hx: number, hy: number, rx = 34, ry = 48, load: Grain | null = null) => {
  const rot = Math.atan2(hy - by, hx - bx) - Math.PI / 2;
  line(c, [[bx, by], [hx, hy]], 26, INK); line(c, [[bx, by], [hx, hy]], 14, COL.steel);
  shape(c, () => ell(c, bx, by, rx, ry, rot), COL.steel, 5);
  shape(c, () => ell(c, bx, by, rx * 0.65, ry * 0.65, rot), COL.steelIn, 0);
  if (load) shape(c, () => ell(c, bx, by, rx * 0.62, ry * 0.5, rot), load.f, 3);
};
const cubeC = (c: Ctx, x: number, y: number, s: number, top: string, left: string, right: string, lw = 5) => {
  const k = 0.87 * s;
  shape(c, () => polyP(c, [[x - k, y - s * 0.5], [x, y], [x, y + s], [x - k, y + s * 0.5]]), left, lw);
  shape(c, () => polyP(c, [[x, y], [x + k, y - s * 0.5], [x + k, y + s * 0.5], [x, y + s]]), right, lw);
  shape(c, () => polyP(c, [[x, y - s], [x + k, y - s * 0.5], [x, y], [x - k, y - s * 0.5]]), top, lw);
};
const sugarCube = (c: Ctx, x: number, y: number, s: number) => cubeC(c, x, y, s, WHITE, "#eceff6", "#c4ccdd");
const zoom = (c: Ctx, cx: number, cy: number, r: number, from: number[] | null, inner: () => void, bg = PAPERBG) => {
  if (from) {
    const d = Math.hypot(cx - from[0], cy - from[1]), a = Math.atan2(from[1] - cy, from[0] - cx), o = Math.acos(Math.min(1, r / d));
    for (const s of [-1, 1]) line(c, [from, [cx + Math.cos(a + s * o) * r, cy + Math.sin(a + s * o) * r]], 5);
  }
  shape(c, () => c.arc(cx, cy, r, 0, Math.PI * 2), bg, 0);
  c.save(); c.beginPath(); c.arc(cx, cy, r - 3, 0, Math.PI * 2); c.clip(); inner(); c.restore();
  shape(c, () => c.arc(cx, cy, r, 0, Math.PI * 2), "rgba(0,0,0,0)", 8);
};
const lattice = (c: Ctx, x0: number, y0: number, cols: number, rows: number, gap: number, r: number, col: string) => {
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) ball(c, x0 + i * gap, y0 + j * gap, r, col);
};
const steam = (c: Ctx, x: number, y: number) => { for (const dx of [-50, 0, 50]) { c.globalAlpha = 0.8; line(c, [[x + dx, y], [x + dx - 20, y - 34], [x + dx + 18, y - 68], [x + dx - 16, y - 102], [x + dx + 8, y - 130]], 11, COL.grey); c.globalAlpha = 1; } };
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 1.05, r * 0.9, r * 0.15);
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.3, r * 0.36, r * 0.3, 6), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74]], 5); }
  line(c, [[x, y], [x + r * 0.35, y - r * 0.35]], 9, RED); line(c, [[x, y], [x, y - r * 0.5]], 7);
};
// dots inside a tumbler (bottom centre x, y; size w, h; liquid fill)
const dotsIn = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, n: number, r: number, col: string, seedN: number, bias = 0) => {
  const R = rnd(seedN), x0 = x - w * 0.4 + r + 8, x1 = x + w * 0.4 - r - 8, y0 = y - h * fill + r + 24, y1 = y - r - 12;
  for (let i = 0; i < n; i++) { const u = R(), v = bias ? Math.pow(R(), bias) : R(); ball(c, x0 + u * (x1 - x0), y1 - v * (y1 - y0), r, col, 3); }
};
const ant = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const [lx, dx] of [[8, 14], [-2, -2], [-14, -20]]) for (const sd of [-1, 1]) line(c, [[lx, sd * 8], [lx + dx * 0.5, sd * 26], [lx + dx, sd * 40]], 8, INK);
  line(c, [[36, -6], [52, -22], [62, -18]], 5, INK); line(c, [[36, 6], [52, 22], [62, 18]], 5, INK);
  shape(c, () => ell(c, -36, 0, 30, 21), "#5a3a2a", 5);
  shape(c, () => ell(c, 0, 0, 16, 13), "#6a4632", 5);
  shape(c, () => ell(c, 28, 0, 17, 14), "#6a4632", 5);
  ball(c, 34, -6, 3, WHITE, 1.5);
  c.restore();
};
const flame = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => { c.moveTo(x, y - h); c.bezierCurveTo(x + w, y - h * 0.4, x + w * 0.9, y, x, y); c.bezierCurveTo(x - w * 0.9, y, x - w, y - h * 0.4, x, y - h); }, COL.orange, 5);
  shape(c, () => { c.moveTo(x, y - h * 0.55); c.bezierCurveTo(x + w * 0.5, y - h * 0.2, x + w * 0.45, y - 4, x, y - 4); c.bezierCurveTo(x - w * 0.45, y - 4, x - w * 0.5, y - h * 0.2, x, y - h * 0.55); }, COL.yellow, 0);
};
const pan = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + 10, y + 88, w * 0.55, 16);
  line(c, [[x + w * 0.45, y + 8], [x + w * 0.45 + 130, y - 18]], 30, INK); line(c, [[x + w * 0.45, y + 8], [x + w * 0.45 + 130, y - 18]], 17, COL.brown);
  shape(c, () => polyP(c, [[x - w / 2, y], [x + w / 2, y], [x + w * 0.4, y + 76], [x - w * 0.4, y + 76]]), "#5b5566");
  shade(c, () => polyP(c, [[x - w / 2, y], [x + w / 2, y], [x + w * 0.4, y + 76], [x - w * 0.4, y + 76]]), "#3c3747", w * 0.12, 0, 0.6);
  shape(c, () => ell(c, x, y, w / 2, w * 0.1), "#7d788a", 6);
  shape(c, () => ell(c, x, y + 4, w * 0.44, w * 0.075), "#4a4555", 0);
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2 + 12, -h / 2 + 12, w, h, 8), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), PAPERBG, 5); c.restore();
};
const pencil = (c: Ctx, x: number, y: number, len: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -len / 2, -16, len * 0.78, 32, 5), COL.yellow);
  shade(c, () => rrect(c, -len / 2, -16, len * 0.78, 32, 5), COL.woodDk, 0, 9, 0.6);
  shape(c, () => polyP(c, [[len * 0.28, -16], [len * 0.5, 0], [len * 0.28, 16]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len * 0.44, -5], [len * 0.5, 0], [len * 0.44, 5]]), INK, 0);
  shape(c, () => rrect(c, -len / 2 - 22, -16, 26, 32, 5), COL.pink); c.restore();
};
const katori = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, x, y, r, r * 0.2), COL.steelIn, 5);
};

// a1 look, wonder and draw: sugar in a glass of water, a spoon, paper and pencil
const a1 = (c: Ctx) => {
  ground(c);
  glass(c, 340, 900, 340, 520, 0.72);
  [[290, 800], [350, 840], [400, 780], [320, 730]].forEach(([x, y]) => grain(c, x, y, SUGAR, 12));
  spoon(c, 420, 640, 560, 300, 30, 42, SUGAR);
  paper(c, 800, 640, 330, 440, 0.06);
  shape(c, () => c.arc(800, 600, 90, 0, Math.PI * 2), "rgba(0,0,0,0)", 5);
  [[770, 560], [820, 620], [770, 640]].forEach(([x, y]) => ball(c, x, y, 12, SUG, 3));
  pencil(c, 790, 820, 280, -0.3);
};
// a3 tall glass, sugar at the bottom, two straws (top and bottom), three spoons of sugar
const a3 = (c: Ctx) => {
  ground(c);
  glass(c, 330, 980, 300, 780, 0.9);
  heap(c, 330, 972, 190, 60, SUGAR, 5);
  for (const [x0, y0, x1, y1, col] of [[470, 200, 400, 360, COL.teal], [500, 170, 380, 900, COL.pink]] as [number, number, number, number, string][]) { line(c, [[x0, y0], [x1, y1]], 26, INK); line(c, [[x0, y0], [x1, y1]], 14, col); }
  for (let i = 0; i < 3; i++) { const y = 330 + i * 230; spoon(c, 720, y, 930, y + 40, 34, 46, SUGAR); }
};
// a4 ants find the sugar water drop on a plate
const a4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 650, 460, 250);
  shape(c, () => ell(c, 340, 650, 100, 66), "#fbe7a1", 5); line(c, [[290, 630], [330, 614]], 8, WHITE);
  shape(c, () => ell(c, 760, 650, 100, 66), COL.drop, 5); line(c, [[710, 630], [750, 614]], 8, WHITE);
  ant(c, 230, 520, 1.25, 0.9); ant(c, 450, 540, 1.25, 2.4); ant(c, 380, 770, 1.25, -1.5); ant(c, 200, 740, 1.25, 0.2);
  ant(c, 640, 560, 1.25, 0.3);
};
// p1 two camphor tablets: one on a saucer, one in a jar, a paper with the traced outline
const tablet = (c: Ctx, x: number, y: number, rx: number) => {
  shape(c, () => { c.moveTo(x - rx, y); c.lineTo(x - rx, y + rx * 0.18); c.quadraticCurveTo(x, y + rx * 0.7, x + rx, y + rx * 0.18); c.lineTo(x + rx, y); c.closePath(); }, "#e4e8ee", 5);
  shape(c, () => ell(c, x, y, rx, rx * 0.38), WHITE, 5);
  line(c, [[x - rx * 0.5, y - rx * 0.1], [x - rx * 0.15, y - rx * 0.22]], 5, "#c9d1dc");
};
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 430, 200, 28);
  shape(c, () => ell(c, 290, 380, 200, 52), COL.paper, 6); shape(c, () => ell(c, 290, 378, 140, 32), "#eee6d6", 4);
  tablet(c, 290, 360, 72);
  // jar with a tablet, lid beside
  shadow(c, 770, 450, 150, 22);
  const jb = () => rrect(c, 670, 230, 200, 220, 36);
  shape(c, jb, COL.glass, 5);
  tablet(c, 770, 405, 56);
  shine(c, [[700, 270], [700, 390]], 8);
  shape(c, () => rrect(c, 660, 196, 220, 40, 12), COL.steel, 6);
  shade(c, () => rrect(c, 660, 196, 220, 40, 12), COL.steelDk, 18, 0, 0.5);
  paper(c, 540, 800, 760, 360, 0);
  c.setLineDash([22, 16]); shape(c, () => ell(c, 330, 790, 120, 60), "rgba(0,0,0,0)", 5); c.setLineDash([]);
  shape(c, () => ell(c, 330, 790, 84, 42), "rgba(214,236,250,0.4)", 5);
  c.setLineDash([22, 16]); shape(c, () => ell(c, 690, 790, 120, 60), "rgba(0,0,0,0)", 5); c.setLineDash([]);
  shape(c, () => ell(c, 690, 790, 64, 32), "rgba(214,236,250,0.4)", 5);
  arrow(c, [[460, 790], [560, 790]], RED, 10);
  pencil(c, 560, 900, 220, -0.15);
};
// c1 two glasses that look the same; on a dark plate only the sugar water leaves a white trace
const c1 = (c: Ctx) => {
  ground(c);
  glass(c, 260, 500, 270, 360, 0.72); glass(c, 820, 500, 270, 360, 0.72);
  arrow(c, [[260, 560], [300, 700]], RED, 10); arrow(c, [[820, 560], [780, 700]], RED, 10);
  shadow(c, 560, 930, 440, 60);
  shape(c, () => ell(c, 540, 860, 450, 130), DARK, 6);
  shape(c, () => ell(c, 540, 855, 390, 100), "#2f3d48", 0);
  shape(c, () => ell(c, 300, 855, 100, 52), "#2f3d48", 3);
  shape(c, () => ell(c, 780, 855, 100, 52), "#2f3d48", 3);
  const r = rnd(5);
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = Math.sqrt(r()); shape(c, () => ell(c, 300 + Math.cos(a) * d * 90, 855 + Math.sin(a) * d * 46, 5, 3.5), WHITE, 0); }
};
// c2 jaggery block -> crushed bits -> jug of dissolved jaggery
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 190, 800, 120, 20);
  cubeC(c, 190, 580, 110, "#c98a45", JAG.f, JAG.d);
  arrow(c, [[330, 600], [400, 600]], RED, 10);
  heap(c, 540, 790, 230, 120, JAG, 6);
  const r = rnd(8); for (let i = 0; i < 16; i++) shape(c, () => ell(c, 450 + r() * 180, 735 + r() * 55, 11 + r() * 5, 8 + r() * 3, r()), i % 2 ? "#a15f26" : "#c98a45", 3);
  arrow(c, [[680, 600], [750, 600]], RED, 10);
  glass(c, 890, 800, 250, 380, 0.7, "#d79a4a");
  stopwatch(c, 540, 280, 100);
};
// t0 particle: a grain of sugar is a stack of tiny balls
const t0 = (c: Ctx) => {
  ground(c);
  shadow(c, 220, 880, 120, 20);
  sugarCube(c, 220, 770, 100);
  zoom(c, 650, 450, 380, [270, 760], () => lattice(c, 650 - 164, 450 - 164, 5, 5, 82, 34, SUG));
};
// t1 dissolve: the lump at the bottom goes, the particles spread all through the water
const t1 = (c: Ctx) => {
  ground(c);
  glass(c, 270, 860, 340, 480, 0.6); heap(c, 270, 852, 190, 80, SUGAR, 4);
  arrow(c, [[460, 640], [610, 640]], RED, 12);
  glass(c, 810, 860, 340, 480, 0.6);
  c.globalAlpha = 0.85; dotsIn(c, 810, 860, 340, 480, 0.6, 22, 13, SUG, 7); c.globalAlpha = 1;
};
// t2 solution: a glass of clear sugar water; zoomed, sugar and water particles mixed
const t2 = (c: Ctx) => {
  ground(c);
  glass(c, 210, 900, 300, 500, 0.72);
  const R = rnd(11);
  zoom(c, 730, 450, 330, [290, 740], () => {
    for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) { const x = 730 - 300 + i * 92 + (j % 2) * 40 + (R() - 0.5) * 14, y = 450 - 280 + j * 92 + (R() - 0.5) * 14; const s = (i * 3 + j * 5) % 5 === 0; ball(c, x, y, s ? 28 : 36, s ? SUG : WAT); }
  });
};
// t4 melt: a block of ghee in a cold pan, then a puddle of ghee in a pan on a flame
const t4 = (c: Ctx) => {
  ground(c);
  pan(c, 220, 640, 320);
  shape(c, () => rrect(c, 150, 560, 140, 70, 14), "#f6d77a", 5); shade(c, () => rrect(c, 150, 560, 140, 70, 14), "#e0b64a", 22, 0, 0.55);
  arrow(c, [[440, 660], [540, 660]], RED, 12);
  shape(c, () => rrect(c, 660, 810, 220, 28, 10), "#4a4555", 5);
  flame(c, 730, 805, 28, 90); flame(c, 770, 805, 32, 110); flame(c, 810, 805, 28, 90);
  pan(c, 770, 640, 320);
  shape(c, () => ell(c, 770, 644, 135, 24), "#f2c03c", 3); line(c, [[700, 640], [750, 634]], 8, WHITE);
};
// t5 molecule: the smallest piece of sugar is a few atoms joined together
const t5 = (c: Ctx) => {
  ground(c);
  shadow(c, 220, 880, 120, 20);
  sugarCube(c, 220, 770, 100);
  zoom(c, 650, 440, 380, [270, 760], () => {
    const cx = 650, cy = 440, ring: number[][] = [], out: number[][] = [];
    for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 - Math.PI / 6; ring.push([cx + Math.cos(a) * 120, cy + Math.sin(a) * 120]); out.push([cx + Math.cos(a) * 235, cy + Math.sin(a) * 235]); }
    ring.forEach(([x, y], k) => { const n = ring[(k + 1) % 6]; line(c, [[x, y], n], 20, INK); line(c, [[x, y], n], 9, COL.grey); line(c, [[x, y], out[k]], 20, INK); line(c, [[x, y], out[k]], 9, COL.grey); });
    ring.forEach(([x, y]) => ball(c, x, y, 40, "#5a5566"));
    out.forEach(([x, y], k) => ball(c, x, y, k % 2 ? 26 : 32, k % 2 ? WHITE : COL.red));
  });
};
// t7 fair test: same water, same glass, same spoon, only the sugar changes
const t7 = (c: Ctx) => {
  ground(c);
  glass(c, 270, 680, 300, 400, 0.62); spoon(c, 250, 480, 360, 230, 28, 40);
  glass(c, 810, 680, 300, 400, 0.62); spoon(c, 790, 480, 900, 230, 28, 40);
  line(c, [[470, 480], [610, 480]], 18, INK); line(c, [[470, 540], [610, 540]], 18, INK);
  for (const [x, lump] of [[270, true], [810, false]] as [number, boolean][]) {
    shape(c, () => rrect(c, x - 130, 790, 260, 190, 10), COL.paper, 5);
    if (lump) { sugarCube(c, x, 870, 44); } else heap(c, x, 950, 180, 60, SUGAR, 12);
  }
};
// t8 model: beans on a plate stand for the particles in a grain
const t8 = (c: Ctx) => {
  ground(c);
  plate(c, 250, 540, 220, 150);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) seed(c, 130 + i * 80, 480 + j * 55, 26, 0.3, false);
  line(c, [[490, 510], [590, 510]], 18, INK); line(c, [[490, 570], [590, 570]], 18, INK);
  zoom(c, 840, 540, 210, null, () => lattice(c, 840 - 105, 540 - 105, 4, 4, 70, 29, SUG));
};
// x0 everything is made of particles: a solid, a liquid, a gas, each zoomed
const x0 = (c: Ctx) => {
  ground(c);
  cubeC(c, 190, 340, 100, "#dfe5ec", "#c9d1dc", "#98a3b3");
  glass(c, 540, 470, 210, 290, 0.72);
  shape(c, () => ell(c, 890, 300, 95, 115), COL.pink, 6); shade(c, () => ell(c, 890, 300, 95, 115), "#c9607f", 28, 28, 0.35);
  shape(c, () => polyP(c, [[890, 412], [872, 436], [908, 436]]), COL.pink, 5); line(c, [[890, 436], [870, 470], [905, 500]], 5);
  const R = rnd(3);
  zoom(c, 190, 780, 165, [190, 460], () => lattice(c, 190 - 66, 780 - 66, 3, 3, 66, 27, COL.steelDk));
  zoom(c, 540, 780, 165, [540, 490], () => { [[500, 730], [560, 740], [520, 800], [590, 810], [470, 810], [540, 860], [610, 750], [480, 750]].forEach(([x, y]) => ball(c, x + (R() - 0.5) * 6, y, 26, WAT)); });
  zoom(c, 890, 780, 165, [890, 520], () => { [[840, 720], [940, 760], [880, 850]].forEach(([x, y]) => ball(c, x, y, 26, COL.pink)); });
};
// x1 how sugar dissolves: water particles pull sugar particles off the grain, one by one
const x1 = (c: Ctx) => {
  ground(c);
  zoom(c, 540, 540, 470, null, () => {
    lattice(c, 170, 400, 3, 4, 66, 30, SUG);
    [[440, 440], [470, 580], [600, 480]].forEach(([x, y]) => ball(c, x, y, 30, SUG));
    arrow(c, [[370, 480], [405, 470]], RED, 9);
    [[240, 250], [400, 270], [560, 240], [700, 290], [580, 360], [700, 450], [800, 380], [820, 560], [700, 640], [560, 700], [400, 740], [250, 730], [820, 700]].forEach(([x, y]) => ball(c, x, y, 34, WAT));
  });
};
// x2 dissolved sugar still weighs the same: scale reads the same before and after
const scaleBase = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 20, y + 130, 250, 24);
  shape(c, () => polyP(c, [[x - 190, y], [x + 190, y], [x + 235, y + 54], [x - 235, y + 54]]), COL.teal);
  shape(c, () => polyP(c, [[x - 235, y + 54], [x + 235, y + 54], [x + 235, y + 130], [x - 235, y + 130]]), COL.tealDk);
  shape(c, () => rrect(c, x - 100, y + 68, 200, 50, 8), DARK, 5);
  write(c, "250 g", x - 80, y + 76, 32, "#c9f06b", 6);
};
const x2 = (c: Ctx) => {
  ground(c);
  scaleBase(c, 250, 700);
  glass(c, 170, 720, 150, 250, 0.6); katori(c, 330, 668, 70); heap(c, 330, 672, 100, 40, SUGAR, 5);
  arrow(c, [[500, 780], [580, 780]], RED, 12);
  scaleBase(c, 830, 700);
  glass(c, 830, 720, 190, 270, 0.6, "#fbe7a1");
};
// x3 dissolving is not melting: ghee melts from heat alone; sugar breaks up in water
const x3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 830, 220, 28, 10), "#4a4555", 5);
  flame(c, 140, 825, 24, 80); flame(c, 200, 825, 28, 100); flame(c, 260, 825, 24, 80);
  pan(c, 200, 640, 300);
  shape(c, () => rrect(c, 140, 570, 90, 56, 12), "#f6d77a", 5);
  shape(c, () => ell(c, 250, 640, 80, 14), "#f2c03c", 3);
  glass(c, 790, 880, 330, 480, 0.62);
  spoon(c, 820, 640, 940, 330, 30, 42, SUGAR);
  [[760, 760], [820, 810], [870, 750], [800, 700]].forEach(([x, y]) => grain(c, x, y, SUGAR, 12));
  line(c, [[520, 560], [520, 900]], 8, INK);
};
// x4 why sugar dissolves faster: crushed small, stirred, warm
const x4 = (c: Ctx) => {
  ground(c);
  sugarCube(c, 180, 300, 80); arrow(c, [[180, 440], [180, 520]], RED, 10);
  plate(c, 180, 760, 160, 70);
  const R = rnd(4); for (let i = 0; i < 60; i++) { const a = R() * 6.28, d = Math.sqrt(R()); shape(c, () => ell(c, 180 + Math.cos(a) * d * 110, 755 + Math.sin(a) * d * 36, 4, 3), SUGAR.f, 1.5); }
  glass(c, 540, 860, 240, 380, 0.65);
  spoon(c, 520, 640, 600, 380, 26, 36);
  arrow(c, [[470, 700], [510, 740], [580, 740], [610, 700]], RED, 9);
  glass(c, 890, 860, 240, 380, 0.65, "#9ad0f0"); steam(c, 890, 640);
};
// x5 particles keep moving and spread slowly by themselves
const x5 = (c: Ctx) => {
  ground(c);
  glass(c, 430, 980, 330, 800, 0.92);
  heap(c, 430, 972, 200, 56, SUGAR, 5);
  const R = rnd(9);
  for (let i = 0; i < 24; i++) { const v = Math.pow(R(), 1.6), y = 915 - v * 630; ball(c, 320 + R() * 220, y, 15, SUG, 3); }
  arrow(c, [[770, 880], [770, 280]], RED, 12);
};
// x6 what is inside a particle: grain, then molecule, then atom
const x6 = (c: Ctx) => {
  ground(c);
  zoom(c, 160, 540, 130, null, () => sugarCube(c, 160, 500, 55));
  arrow(c, [[305, 540], [375, 540]], RED, 10);
  zoom(c, 540, 540, 150, null, () => {
    const cx = 540, cy = 540, ring: number[][] = [], out: number[][] = [];
    for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 - Math.PI / 6; ring.push([cx + Math.cos(a) * 62, cy + Math.sin(a) * 62]); out.push([cx + Math.cos(a) * 112, cy + Math.sin(a) * 112]); }
    ring.forEach(([x, y], k) => { const n = ring[(k + 1) % 6]; line(c, [[x, y], n], 12, INK); line(c, [[x, y], n], 5, COL.grey); line(c, [[x, y], out[k]], 12, INK); line(c, [[x, y], out[k]], 5, COL.grey); });
    ring.forEach(([x, y]) => ball(c, x, y, 24, "#5a5566"));
    out.forEach(([x, y], k) => ball(c, x, y, k % 2 ? 14 : 18, k % 2 ? WHITE : COL.red));
  });
  arrow(c, [[705, 540], [775, 540]], RED, 10);
  zoom(c, 920, 540, 130, null, () => {
    for (const rot of [0, 1.05, 2.1]) { c.beginPath(); ell(c, 920, 540, 100, 36, rot); c.strokeStyle = COL.steelDk; c.lineWidth = 5; c.stroke(); }
    ball(c, 906, 530, 15, COL.red, 3); ball(c, 934, 530, 15, COL.blue, 3); ball(c, 920, 556, 15, COL.red, 3); ball(c, 920, 512, 15, COL.blue, 3);
    ball(c, 1010, 540, 9, WAT, 3); ball(c, 855, 520, 9, WAT, 3); ball(c, 890, 612, 9, WAT, 3);
  });
};

export const ic_statesParticlesL3 = cards("sci.states.particles.L3 cards", [a1, a3, a4, p1, c1, c2, t0, t1, t2, t4, t5, t7, t8, x0, x1, x2, x3, x4, x5, x6]);
