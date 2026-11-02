import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, leaf, person, write, cards } from "./flatKit";

// EVOLUTION · THE STORY OF LIFE L3 · picture cards (flat DeepKids style)
const TC = [COL.purple, COL.orange, COL.yellow, COL.teal];
const TT: Record<string, number> = { A: 0, U: 1, C: 2, G: 3 };
const poly = (c: Ctx, pts: number[][], fill: string, w = 6) => shape(c, () => polyP(c, pts), fill, w);
// a letter tile: plain, or with a bump (A, C) or a dent (U, G) so partners fit
const tilePath = (c: Ctx, x: number, y: number, s: number, t?: string) => () => {
  const d = s * 0.22, m = x + s / 2;
  c.moveTo(x, y);
  if (t === "U") { c.lineTo(m - d, y); c.lineTo(m, y + d); c.lineTo(m + d, y); }
  else if (t === "G") { c.lineTo(m - d, y); c.arc(m, y, d, Math.PI, 0, true); }
  c.lineTo(x + s, y); c.lineTo(x + s, y + s);
  if (t === "A") { c.lineTo(m + d, y + s); c.lineTo(m, y + s + d); c.lineTo(m - d, y + s); }
  else if (t === "C") { c.lineTo(m + d, y + s); c.arc(m, y + s, d, 0, Math.PI, false); }
  c.lineTo(x, y + s); c.closePath();
};
const tile = (c: Ctx, x: number, y: number, s: number, k: number) => { shape(c, () => rrect(c, x, y, s, s, s * 0.12), TC[k], Math.max(3, s * 0.05)); };
const tileT = (c: Ctx, x: number, y: number, s: number, t: string) => { shape(c, tilePath(c, x, y, s, t), TC[TT[t]], Math.max(3, s * 0.04)); shine(c, [[x + s * 0.18, y + s * 0.2], [x + s * 0.18, y + s * 0.5]], Math.max(3, s * 0.05)); };
const bead = (c: Ctx, x: number, y: number, r: number, col: string) => { shape(c, () => ell(c, x, y, r, r), col, Math.max(3, r * 0.14)); shine(c, [[x - r * 0.5, y - r * 0.25], [x - r * 0.3, y - r * 0.55]], Math.max(3, r * 0.2)); };
const ring = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); };
const along = (f: (t: number) => number[], n = 80) => Array.from({ length: n + 1 }, (_, i) => f(i / n));
const smooth = (c: Ctx, pts: number[][], w: number, col: string) => { const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); }; p(); c.strokeStyle = INK; c.lineWidth = w + 10; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); p(); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => { c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot); shadow(c, 12, h / 2 + 8, w * 0.52, 14); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), COL.paper, 6); c.restore(); };
const greyHair = (c: Ctx, x: number, y: number, h: number) => { const head = h * 0.13, hy = y - h * 0.74 - head * 1.05; shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, "#e8e4ee", 5); shape(c, () => ell(c, x, hy - head * 1.1, head * 0.45, head * 0.4), "#e8e4ee", 5); };
const cellIcon = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), "#bfe8dd", Math.max(4, r * 0.06));
  shade(c, () => ell(c, x, y, r, r * 0.92), COL.tealDk, r * 0.18, r * 0.12, 0.35);
  const rd = rnd(5); for (let i = 0; i < 6; i++) { const a = rd() * 6.28, d = rd() * r * 0.7; shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.9, r * 0.05, r * 0.05), COL.drop, 2); }
  const th = along((t) => [x + Math.sin(t * 17) * r * 0.28, y + Math.cos(t * 11) * r * 0.22 + (t - 0.5) * r * 0.2], 60);
  smooth(c, th, Math.max(3, r * 0.05), COL.purple);
};
const fish = (c: Ctx, x: number, y: number, s: number) => {
  poly(c, [[x - s * 0.7, y], [x - s * 1.25, y - s * 0.5], [x - s * 1.15, y + s * 0.5]], COL.blueDk, Math.max(3, s * 0.05));
  shape(c, () => ell(c, x, y, s * 0.85, s * 0.5), COL.blue, Math.max(3, s * 0.05));
  shade(c, () => ell(c, x, y, s * 0.85, s * 0.5), COL.blueDk, s * 0.1, s * 0.15, 0.5);
  poly(c, [[x - s * 0.1, y - s * 0.45], [x + s * 0.2, y - s * 0.8], [x + s * 0.35, y - s * 0.4]], COL.blueDk, Math.max(3, s * 0.05));
  shape(c, () => ell(c, x + s * 0.5, y - s * 0.1, s * 0.09, s * 0.09), WHITE, 3); shape(c, () => ell(c, x + s * 0.52, y - s * 0.1, s * 0.04, s * 0.04), INK, 0);
};
const monkey = (c: Ctx, x: number, y: number, s: number) => {
  const br = "#8a5a3c";
  smooth(c, along((t) => [x + s * 0.5 + Math.sin(t * 5) * s * 0.35 * t, y + s * 0.3 - t * s * 0.9 + 0], 20), s * 0.1, br);
  shape(c, () => ell(c, x, y + s * 0.35, s * 0.5, s * 0.6), br, 6);
  shape(c, () => ell(c, x, y + s * 0.5, s * 0.3, s * 0.4), "#e3b894", 4);
  shape(c, () => ell(c, x, y - s * 0.35, s * 0.42, s * 0.4), br, 6);
  shape(c, () => ell(c, x - s * 0.42, y - s * 0.35, s * 0.14, s * 0.14), br, 5); shape(c, () => ell(c, x + s * 0.42, y - s * 0.35, s * 0.14, s * 0.14), br, 5);
  shape(c, () => ell(c, x, y - s * 0.28, s * 0.28, s * 0.25), "#e3b894", 4);
  shape(c, () => ell(c, x - s * 0.12, y - s * 0.38, s * 0.04, s * 0.05), INK, 0); shape(c, () => ell(c, x + s * 0.12, y - s * 0.38, s * 0.04, s * 0.05), INK, 0);
  c.beginPath(); c.arc(x, y - s * 0.22, s * 0.09, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const bacterium = (c: Ctx, x: number, y: number, s: number, rot: number, col: string = COL.green) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s, -s * 0.4, s * 2, s * 0.8, s * 0.4), col, Math.max(3, s * 0.08));
  shade(c, () => rrect(c, -s, -s * 0.4, s * 2, s * 0.8, s * 0.4), COL.greenDk, s * 0.1, s * 0.15, 0.45);
  shine(c, [[-s * 0.6, -s * 0.15], [s * 0.3, -s * 0.15]], Math.max(3, s * 0.1));
  c.restore();
};
const tree = (c: Ctx, x: number, y: number, h: number) => { // a banyan: wide crown, trunk, hanging roots
  shape(c, () => { c.moveTo(x - h * 0.08, y); c.lineTo(x - h * 0.05, y - h * 0.45); c.lineTo(x + h * 0.05, y - h * 0.45); c.lineTo(x + h * 0.08, y); c.closePath(); }, COL.soil, 6);
  for (const dx of [-0.28, -0.17, 0.2, 0.3]) { const rx = x + h * dx; line(c, [[rx, y - h * 0.55], [rx + h * 0.01, y - h * 0.2], [rx, y]], 9, INK); line(c, [[rx, y - h * 0.55], [rx + h * 0.01, y - h * 0.2], [rx, y]], 5, COL.soil); }
  const blobs = [[0, -0.7, 0.3], [-0.25, -0.58, 0.22], [0.25, -0.58, 0.22], [-0.18, -0.85, 0.2], [0.18, -0.85, 0.2], [-0.38, -0.5, 0.14], [0.38, -0.5, 0.14]];
  blobs.forEach(([dx, dy, r]) => shape(c, () => ell(c, x + h * dx, y + h * dy, h * r, h * r * 0.85), COL.green, 6));
  blobs.forEach(([dx, dy, r]) => shape(c, () => ell(c, x + h * dx - h * r * 0.2, y + h * dy - h * r * 0.2, h * r * 0.55, h * r * 0.45), COL.greenLt, 0));
};

// three ideas for where life began, drawn into a box
const clipBox = (c: Ctx, x: number, y: number, w: number, h: number, draw: () => void) => { c.save(); c.beginPath(); rrect(c, x, y, w, h, 24); c.clip(); draw(); c.restore(); c.beginPath(); rrect(c, x, y, w, h, 24); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); };
const sceneVent = (c: Ctx, x: number, y: number, w: number, h: number) => clipBox(c, x, y, w, h, () => {
  c.fillStyle = "#1f3f6b"; c.fillRect(x, y, w, h); c.fillStyle = "#2a5388"; c.fillRect(x, y, w, h * 0.35);
  c.fillStyle = "#3a2e3c"; c.fillRect(x, y + h * 0.85, w, h * 0.15);
  const cx = x + w / 2, by = y + h * 0.87, tw = w * 0.2, th = h * 0.5;
  for (let i = 0; i < 5; i++) shape(c, () => ell(c, cx + Math.sin(i * 1.7) * w * 0.06, by - th - i * h * 0.075, w * (0.07 + i * 0.022), w * (0.07 + i * 0.022)), i % 2 ? "#4a4452" : "#3a3540", 4);
  shape(c, () => polyP(c, [[cx - tw, by], [cx - tw * 0.5, by - th], [cx + tw * 0.5, by - th], [cx + tw, by]]), "#6a5a55", 6);
  shade(c, () => polyP(c, [[cx - tw, by], [cx - tw * 0.5, by - th], [cx + tw * 0.5, by - th], [cx + tw, by]]), "#4a3d3b", tw * 0.5, 0, 0.6);
  shape(c, () => ell(c, cx, by - th, tw * 0.5, h * 0.025), COL.orange, 4);
  for (let i = 0; i < 4; i++) { const wx = x + w * (0.1 + i * 0.07), wh = h * (0.12 + (i % 2) * 0.05); line(c, [[wx, by + 4], [wx, by - wh]], 11, INK); line(c, [[wx, by + 4], [wx, by - wh]], 6, "#f3f0ea"); shape(c, () => ell(c, wx, by - wh, 8, 8), COL.red, 3); }
  for (let i = 0; i < 3; i++) { const sx = x + w * (0.78 + i * 0.07), sy = by - 8; shape(c, () => ell(c, sx, sy, 16, 9), COL.red, 3); }
});
const scenePool = (c: Ctx, x: number, y: number, w: number, h: number) => clipBox(c, x, y, w, h, () => {
  c.fillStyle = "#cfe6f3"; c.fillRect(x, y, w, h);
  shape(c, () => polyP(c, [[x + w * 0.05, y + h * 0.62], [x + w * 0.3, y + h * 0.3], [x + w * 0.38, y + h * 0.3], [x + w * 0.62, y + h * 0.62]]), "#7d6f6a", 6);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + w * (0.33 + i * 0.03), y + h * (0.24 - i * 0.07), w * (0.05 + i * 0.015), w * (0.05 + i * 0.015)), "#f3f0ea", 4);
  c.fillStyle = "#6a615f"; c.fillRect(x, y + h * 0.62, w, h * 0.38);
  shape(c, () => ell(c, x + w * 0.55, y + h * 0.8, w * 0.36, h * 0.1), COL.sky, 6);
  shape(c, () => ell(c, x + w * 0.5, y + h * 0.79, w * 0.2, h * 0.04), "#e6f3fb", 0);
  for (let i = 0; i < 3; i++) { const sx = x + w * (0.4 + i * 0.15); line(c, along((t) => [sx + Math.sin(t * 9) * 12, y + h * 0.72 - t * h * 0.22], 12), 8, WHITE); }
});
const sceneMeteor = (c: Ctx, x: number, y: number, w: number, h: number) => clipBox(c, x, y, w, h, () => {
  c.fillStyle = "#1d1b3a"; c.fillRect(x, y, w, h);
  const rd = rnd(3); for (let i = 0; i < 14; i++) shape(c, () => ell(c, x + rd() * w, y + rd() * h * 0.7, 4, 4), "#fff6c4", 0);
  c.fillStyle = "#4a3d4a"; c.fillRect(x, y + h * 0.88, w, h * 0.12);
  const mx = x + w * 0.6, my = y + h * 0.55;
  poly(c, [[mx - w * 0.5, my - h * 0.45], [mx - w * 0.1, my - h * 0.1], [mx + w * 0.02, my - h * 0.2], [mx - w * 0.3, my - h * 0.5]], COL.orange, 5);
  poly(c, [[mx - w * 0.45, my - h * 0.42], [mx - w * 0.1, my - h * 0.12], [mx - w * 0.0, my - h * 0.2], [mx - w * 0.3, my - h * 0.45]], COL.yellow, 0);
  shape(c, () => { c.moveTo(mx - w * 0.14, my - h * 0.04); c.bezierCurveTo(mx - w * 0.12, my - h * 0.2, mx + w * 0.12, my - h * 0.2, mx + w * 0.18, my - h * 0.04); c.bezierCurveTo(mx + w * 0.2, my + h * 0.1, mx - w * 0.1, my + h * 0.12, mx - w * 0.14, my - h * 0.04); c.closePath(); }, "#7a6f6c", 6);
  shade(c, () => ell(c, mx + w * 0.02, my, w * 0.17, h * 0.1), "#4f4846", w * 0.05, h * 0.04, 0.5);
});

// ================================================================= flows
// flow.e1: three jars with a nail each
const nail = (c: Ctx, x1: number, y1: number, x2: number, y2: number, rust: number) => {
  const an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an), ny = Math.cos(an);
  line(c, [[x1, y1], [x2, y2]], 26, INK); line(c, [[x1, y1], [x2, y2]], 16, COL.steelDk);
  if (rust > 0) for (let i = 0; i < 9; i++) { const t = 0.12 + i * 0.1, px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t; if (i / 9 < rust) line(c, [[px, py], [px + (x2 - x1) * 0.08, py + (y2 - y1) * 0.08]], 16, "#b8571f"); }
  if (rust > 0.6) for (let i = 0; i < 5; i++) { const t = 0.55 + i * 0.1; shape(c, () => ell(c, x1 + (x2 - x1) * t + nx * 14, y1 + (y2 - y1) * t + ny * 14, 7, 5), "#b8571f", 0); }
  line(c, [[x1 - 10 * Math.cos(an) + nx * 0, y1], [x1 + 12 * Math.cos(an), y1 + 12 * Math.sin(an)]], 34, INK); line(c, [[x1 - 8 * Math.cos(an), y1 - 8 * Math.sin(an)], [x1 + 8 * Math.cos(an), y1 + 8 * Math.sin(an)]], 24, rust > 0.3 ? "#b8571f" : COL.steel);
};
const e1 = (c: Ctx) => {
  ground(c);
  const xs = [200, 540, 880], liq = ["#d9a66a", COL.water, "#c98a52"];
  xs.forEach((x, i) => {
    glass(c, x, 760, 270, 430, 0.82, liq[i]);
    if (i === 1) { shape(c, () => ell(c, x, 760 - 430 * 0.82, 128, 20), COL.yellow, 4); shape(c, () => rrect(c, x - 128, 760 - 430 * 0.82, 256, 34, 10), COL.yellow, 0); }
    nail(c, x - 50, 760 - 350, x + 22, 760 - 40, i === 1 ? 0 : i === 0 ? 0.7 : 1);
    write(c, String(i + 1), x - 15, 830, 80, INK, 9);
  });
  const rd = rnd(2); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 880 - 80 + rd() * 160, 760 - 40 - rd() * 30, 6, 5), WHITE, 2);
  shape(c, () => ell(c, 540, 760 - 430 * 0.82 + 26, 120, 10), "rgba(255,211,77,0.0)", 0);
};
// flow.a1: a strip of paper with the chain drawn on it
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 820, 470, 30);
  shape(c, () => rrect(c, 70, 330, 940, 480, 18), COL.paper, 7);
  [[0, 1], [1, 1]].forEach(() => 0);
  person(c, 200, 720, 330, {}); person(c, 440, 720, 330, { adult: true });
  fish(c, 690, 560, 100); cellIcon(c, 880, 560, 85);
  arrow(c, [[330, 560], [370, 560]], RED, 9); arrow(c, [[540, 560], [580, 560]], RED, 9); arrow(c, [[780, 560], [790, 560]], RED, 9);
  // a pencil
  c.save(); c.translate(780, 190); c.rotate(-0.55); shape(c, () => rrect(c, -150, -22, 240, 44, 6), COL.yellow, 6); poly(c, [[90, -22], [150, 0], [90, 22]], "#f4d9b0", 5); poly(c, [[128, -8], [150, 0], [128, 8]], INK, 3); shape(c, () => rrect(c, -150, -22, 36, 44, 6), COL.pink, 6); c.restore();
};
// flow.a2: the time string, 1 m = 1 billion years
const a2 = (c: Ctx) => {
  ground(c);
  const y0 = 640, pts = along((t) => [110 + t * 760, y0 + Math.sin(t * 6) * 6], 40);
  smooth(c, pts, 10, COL.orange);
  for (let k = 0; k <= 4; k++) { const x = 110 + k * (760 / 4.5), y = y0 + Math.sin((k * (760 / 4.5) / 760) * 6) * 6; shape(c, () => ell(c, x, y, 16, 16), COL.red, 5); write(c, String(k), x - 14, y + 50, 70, INK, 8); }
  const rd = rnd(11); for (let i = 0; i < 12; i++) { const x = 190 + i * 55; bacterium(c, x, y0 - 70 - (i % 3) * 40, 22, rd() * 3, COL.green); }
  arrow(c, [[120, 400], [800, 400]], RED, 12);
  person(c, 930, 780, 300, {});
  shadow(c, 930, 786, 70, 14);
};
// flow.a3: copy the chain with letter tiles
const a3 = (c: Ctx) => {
  ground(c);
  const top = ["A", "C", "G", "U", "A"], bot = ["U", "G", "C", "A", "U"], s = 140, x0 = 130, y = 260;
  top.forEach((t, i) => tileT(c, x0 + i * 164, y, s, t));
  bot.forEach((t, i) => { if (i < 4) tileT(c, x0 + i * 164, y + s, s, t); });
  c.save(); c.setLineDash([16, 12]); shape(c, () => rrect(c, x0 + 4 * 164, y + s, s, s, 10), "rgba(255,255,255,0.4)", 5); c.restore();
  tileT(c, x0 + 4 * 164, 730, s, "U");
  arrow(c, [[x0 + 4 * 164 + 70, 710], [x0 + 4 * 164 + 70, 580]], RED, 12);
  shadow(c, 540, 905, 300, 20);
  person(c, 270, 960, 380, {});
};
// flow.a4: copying again and again, with a timer
const a4 = (c: Ctx) => {
  ground(c);
  const base = [0, 1, 2, 3, 0, 1, 2, 3], rows = [base.slice(), base.slice(), base.slice()];
  rows[1][3] = 2; rows[2][3] = 2; rows[2][6] = 0;
  rows.forEach((r, j) => { const y = 200 + j * 240; r.forEach((k, i) => tile(c, 90 + i * 82, y, 70, k)); });
  ring(c, 90 + 3 * 82 + 35, 200 + 240 + 35, 52); ring(c, 90 + 6 * 82 + 35, 200 + 480 + 35, 52);
  arrow(c, [[400, 285], [400, 420]], RED, 11); arrow(c, [[400, 525], [400, 660]], RED, 11);
  // stopwatch
  shadow(c, 905, 700, 110, 20);
  shape(c, () => rrect(c, 880, 280, 50, 40, 8), COL.steelDk, 6);
  shape(c, () => ell(c, 905, 520, 120, 120), COL.steel, 7); shape(c, () => ell(c, 905, 520, 92, 92), WHITE, 5);
  line(c, [[905, 520], [905, 450]], 8, INK); line(c, [[905, 520], [955, 545]], 8, RED);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[905 + Math.cos(a) * 80, 520 + Math.sin(a) * 80], [905 + Math.cos(a) * 90, 520 + Math.sin(a) * 90]], 4, INK); }
};
// flow.a6 + expl.10: three ideas
const a6 = (c: Ctx) => {
  ground(c);
  const w = 290, h = 420;
  [[60, sceneVent], [395, scenePool], [730, sceneMeteor]].forEach(([x, f], i) => { paper(c, x as number, 90, w, h + 40, (i - 1) * 0.04); (f as typeof sceneVent)(c, (x as number) + 25, 120 + (i - 1) * 4, w - 50, h - 20); });
  person(c, 540, 1010, 420, {});
  // a thought mark
  shape(c, () => ell(c, 700, 720, 60, 60), WHITE, 6); line(c, along((t) => [680 + Math.sin(t * 3) * 14, 695 + t * 25], 12), 9, RED); shape(c, () => ell(c, 700, 740, 6, 6), RED, 0);
};
// flow.p1: a picture book
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 840, 470, 30);
  shape(c, () => polyP(c, [[70, 270], [530, 300], [530, 810], [70, 780]]), COL.paper, 7);
  shape(c, () => polyP(c, [[550, 300], [1010, 270], [1010, 780], [550, 810]]), COL.paper, 7);
  line(c, [[540, 300], [540, 810]], 8, INK);
  // left page: the young sea with an RNA strand
  poly(c, [[100, 520], [510, 540], [510, 780], [100, 760]], COL.water, 0);
  smooth(c, along((t) => [140 + t * 330, 640 + Math.sin(t * 12) * 40 + t * 12], 30), 12, COL.purple);
  [0, 1, 2, 3, 0, 1].forEach((k, i) => tile(c, 150 + i * 62, 570 + (i % 2) * 6, 36, k));
  shape(c, () => ell(c, 300, 400, 50, 50), COL.yellow, 6);
  // right page: a girl
  poly(c, [[580, 560], [980, 540], [980, 760], [580, 780]], COL.greenLt, 0);
  person(c, 780, 760, 300, {});
  // crayons
  [[COL.red, 120], [COL.blue, 190], [COL.green, 260]].forEach(([col, x], i) => { c.save(); c.translate(x as number + 560, 930 + i * 6); c.rotate(-0.1 + i * 0.05); shape(c, () => rrect(c, -90, -17, 180, 34, 8), col as string, 5); poly(c, [[90, -17], [125, 0], [90, 17]], col as string, 5); c.restore(); });
};
// flow.c1: stop a nail from rusting
const c1 = (c: Ctx) => {
  ground(c);
  glass(c, 330, 800, 340, 520, 0.8, COL.water);
  line(c, [[280, 320], [350, 760]], 40, INK); line(c, [[280, 320], [350, 760]], 28, COL.yellow); line(c, [[350, 760], [355, 790]], 18, COL.steelDk);
  shine(c, [[272, 380], [296, 560]], 8);
  line(c, [[262, 320], [298, 320]], 40, INK); line(c, [[266, 320], [294, 320]], 28, COL.yellow);
  // candle
  shadow(c, 720, 806, 60, 14);
  shape(c, () => rrect(c, 680, 520, 80, 280, 8), "#fdf3d6", 6); shade(c, () => rrect(c, 680, 520, 80, 280, 8), "#e6d4a6", 30, 0, 0.6);
  line(c, [[720, 520], [720, 490]], 6, INK);
  shape(c, () => { c.moveTo(720, 400); c.quadraticCurveTo(765, 460, 720, 495); c.quadraticCurveTo(675, 460, 720, 400); }, COL.orange, 5);
  // oil bottle
  shadow(c, 900, 806, 70, 14);
  shape(c, () => { c.moveTo(860, 800); c.lineTo(860, 600); c.lineTo(885, 540); c.lineTo(885, 480); c.lineTo(925, 480); c.lineTo(925, 540); c.lineTo(950, 600); c.lineTo(950, 800); c.closePath(); }, COL.glass, 6);
  shape(c, () => { c.moveTo(864, 800); c.lineTo(864, 640); c.lineTo(946, 640); c.lineTo(946, 800); c.closePath(); }, COL.yellow, 0);
  shape(c, () => rrect(c, 882, 450, 46, 34, 6), COL.red, 5);
  arrow(c, [[640, 600], [520, 600]], RED, 11);
};

// ================================================================= terms
const cellBig = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 890, 380, 40);
  shape(c, () => ell(c, 540, 520, 380, 350), "#bfe8dd", 12);
  shade(c, () => ell(c, 540, 520, 380, 350), COL.tealDk, 90, 70, 0.3);
  c.beginPath(); ell(c, 540, 520, 350, 320); c.strokeStyle = "#8fcdbf"; c.lineWidth = 5; c.stroke();
  const rd = rnd(8); for (let i = 0; i < 14; i++) { const a = rd() * 6.28, d = 0.45 + rd() * 0.5; shape(c, () => ell(c, 540 + Math.cos(a) * 300 * d, 520 + Math.sin(a) * 270 * d, 16, 16), COL.drop, 3); }
  smooth(c, along((t) => [540 + Math.sin(t * 19) * 130 * (1 - t * 0.3), 520 + Math.cos(t * 13) * 100 + (t - 0.5) * 120], 120), 14, COL.purple);
  shine(c, [[230, 330], [300, 250]], 12);
};
const microbe = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 300, 30);
  line(c, [[740, 740], [930, 930]], 90, INK); line(c, [[740, 740], [930, 930]], 70, COL.wood);
  shape(c, () => ell(c, 500, 470, 340, 340), INK, 0);
  shape(c, () => ell(c, 500, 470, 320, 320), COL.glass, 22); shape(c, () => ell(c, 500, 470, 280, 280), "#dff0fb", 0);
  c.save(); c.beginPath(); ell(c, 500, 470, 280, 280); c.clip();
  shape(c, () => { c.moveTo(500, 260); c.bezierCurveTo(660, 420, 740, 560, 500, 700); c.bezierCurveTo(260, 560, 340, 420, 500, 260); c.closePath(); }, COL.water, 0);
  c.restore();
  shape(c, () => { c.moveTo(500, 250); c.bezierCurveTo(680, 420, 760, 570, 500, 710); c.bezierCurveTo(240, 570, 320, 420, 500, 250); c.closePath(); }, "rgba(143,195,234,0.6)", 6);
  bacterium(c, 450, 520, 52, 0.4, COL.green); bacterium(c, 560, 600, 46, -0.5, COL.green); bacterium(c, 520, 410, 40, 1.2, COL.pink);
  bead(c, 420, 620, 24, COL.orange); bead(c, 600, 480, 26, COL.orange); bead(c, 480, 340, 20, COL.purple);
  shine(c, [[290, 330], [350, 260]], 14);
};
const moleculeC = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 350, 40);
  const ball = (x: number, y: number, r: number, col: string, dk: string) => { shape(c, () => ell(c, x, y, r, r), col, 8); shade(c, () => ell(c, x, y, r, r), dk, r * 0.25, r * 0.25, 0.55); shine(c, [[x - r * 0.55, y - r * 0.15], [x - r * 0.3, y - r * 0.55]], r * 0.1); };
  ball(320, 700, 100, WHITE, COL.steelDk); ball(760, 700, 100, WHITE, COL.steelDk); ball(540, 500, 170, COL.red, "#a8321f");
  // a drop of water beside it
  shape(c, () => { c.moveTo(160, 60); c.bezierCurveTo(215, 130, 235, 190, 160, 215); c.bezierCurveTo(85, 190, 105, 130, 160, 60); c.closePath(); }, COL.water, 6);
  arrow(c, [[260, 180], [380, 300]], RED, 11);
};
const billion = (c: Ctx) => {
  ground(c);
  write(c, "1 000 000 000", 90, 300, 100, INK, 15);
  [205, 480, 755].forEach((x) => { line(c, [[x, 450], [x + 10, 480], [x + 230, 480], [x + 240, 450]], 9, RED); write(c, "3", x + 100, 520, 90, INK, 12); });
  write(c, "9", 470, 700, 150, RED, 20);
  for (let i = 0; i < 9; i++) bead(c, 185 + i * 90, 900, 32, TC[i % 4]);
};
const fossil = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 890, 400, 40);
  const stone = () => { c.moveTo(150, 520); c.bezierCurveTo(130, 260, 400, 120, 620, 150); c.bezierCurveTo(880, 170, 960, 380, 930, 600); c.bezierCurveTo(900, 830, 600, 880, 400, 850); c.bezierCurveTo(200, 820, 160, 700, 150, 520); c.closePath(); };
  shape(c, stone, "#b9b4ab", 9); shade(c, stone, COL.greyDk, 70, 60, 0.45);
  c.save(); c.beginPath(); stone(); c.clip();
  const sp = (t: number, a = 0) => [540 + Math.cos(t + a) * 11 * t * 0.9, 510 + Math.sin(t + a) * 11 * t * 0.9];
  const T = 6.2 * Math.PI / 2 * 1.0 + 4;
  smooth(c, along((t) => sp(t * T), 120), 60, "#8f8a82");
  for (let i = 8; i < 120; i++) { const t = (i / 120) * T, [x, y] = sp(t), [x2, y2] = sp(t + 0.05); const an = Math.atan2(y2 - y, x2 - x) + Math.PI / 2, r = 6 + t * 3.2; line(c, [[x - Math.cos(an) * r, y - Math.sin(an) * r], [x + Math.cos(an) * r, y + Math.sin(an) * r]], 4, "#6f6a62"); }
  smooth(c, along((t) => sp(t * T), 120), 6, "#6f6a62");
  c.restore();
};
const oxygenC = (c: Ctx) => {
  ground(c);
  // leaf on a stem at the left
  shadow(c, 220, 930, 130, 22);
  line(c, [[220, 930], [220, 520]], 24, INK); line(c, [[220, 930], [220, 520]], 14, COL.green);
  leaf(c, 220, 700, 260, -0.6, COL.leaf); leaf(c, 220, 620, 270, -2.5, COL.leaf); leaf(c, 220, 540, 200, -1.6, COL.greenLt);
  // girl at the right breathing in
  person(c, 800, 960, 640, {});
  const o2 = (x: number, y: number) => { bead(c, x - 24, y, 26, COL.sky); bead(c, x + 24, y, 26, COL.sky); };
  o2(430, 420); o2(530, 380); o2(630, 330);
  arrow(c, [[400, 500], [560, 470], [660, 360]], RED, 11);
};
const dnaC = (c: Ctx) => {
  ground(c);
  const N = 22, y0 = 90, y1 = 990, f = (i: number, ph: number) => [540 + Math.sin(i * 0.55 + ph) * 190, y0 + (i / N) * (y1 - y0)];
  for (let i = 0; i <= N; i++) { const [a, b] = [f(i, 0), f(i, Math.PI)]; const k = i % 4; line(c, [[a[0], a[1]], [(a[0] + b[0]) / 2, a[1]]], 24, INK); line(c, [[a[0], a[1]], [(a[0] + b[0]) / 2, a[1]]], 14, TC[k]); line(c, [[b[0], b[1]], [(a[0] + b[0]) / 2, a[1]]], 24, INK); line(c, [[b[0], b[1]], [(a[0] + b[0]) / 2, a[1]]], 14, TC[(k + 1) % 4]); }
  smooth(c, along((t) => f(t * N, 0), 90), 24, COL.blue); smooth(c, along((t) => f(t * N, Math.PI), 90), 24, COL.pink);
};
const rnaC = (c: Ctx) => {
  ground(c);
  const bb = (t: number) => [110 + t * 860, 540 + Math.sin(t * 9) * 190];
  smooth(c, along(bb, 90), 22, COL.pink);
  const ord = [0, 2, 1, 3, 3, 0, 2, 1, 0, 3], n = ord.length;
  ord.forEach((k, i) => { const t = (i + 0.5) / n, [x, y] = bb(t), [x2, y2] = bb(t + 0.01), an = Math.atan2(y2 - y, x2 - x), nx = -Math.sin(an) * (i % 2 ? 1 : -1), ny = Math.cos(an) * (i % 2 ? 1 : -1); line(c, [[x, y], [x + nx * 40, y + ny * 40]], 12, INK); tile(c, x + nx * 95 - 40, y + ny * 95 - 40, 80, k); });
};
const proteinC = (c: Ctx) => {
  ground(c);
  const cols = [COL.red, COL.blue, COL.yellow, COL.green, COL.orange, COL.purple, COL.teal, COL.pink];
  line(c, [[110, 220], [970, 220]], 10, INK);
  for (let i = 0; i < 9; i++) bead(c, 130 + i * 100, 220, 42, cols[i % 8]);
  arrow(c, [[540, 330], [540, 450]], RED, 14);
  const P = (t: number) => [540 + Math.sin(t * 7.3) * 230 + Math.sin(t * 2.1) * 40, 700 + Math.cos(t * 5.1) * 170 + Math.sin(t * 11) * 30];
  smooth(c, along(P, 90), 12, INK);
  for (let i = 0; i < 18; i++) { const [x, y] = P(i / 17); bead(c, x, y, 40, cols[i % 8]); }
};
const aminoC = (c: Ctx) => {
  ground(c);
  const cols = [COL.red, COL.blue, COL.yellow, COL.green, COL.orange];
  line(c, [[90, 640], [630, 640]], 10, INK);
  for (let i = 0; i < 5; i++) bead(c, 130 + i * 100, 640, 46, cols[i]);
  bead(c, 800, 280, 88, COL.pink);
  shape(c, () => rrect(c, 770, 350, 60, 40, 8), COL.pink, 5);
  arrow(c, [[760, 400], [640, 560], [620, 600]], RED, 12);
  bead(c, 700, 640, 40, COL.steelIn); c.beginPath(); c.moveTo(0, 0);
};
const ribozymeC = (c: Ctx) => {
  ground(c);
  const U = (t: number) => { const a = Math.PI * (0.05 + t * 0.95); return [540 - Math.cos(a) * 340, 390 + Math.sin(a) * 400 + (t > 0.9 ? -(t - 0.9) * 600 : 0)]; };
  smooth(c, [[150, 130], [190, 300], ...along((t) => [540 - Math.cos(Math.PI * t) * 340, 400 + Math.sin(Math.PI * t) * 420], 24), [900, 300], [930, 130]], 24, COL.pink);
  for (let i = 0; i < 6; i++) { const t = (i + 1) / 7, x = 540 - Math.cos(Math.PI * t) * 340, y = 400 + Math.sin(Math.PI * t) * 420, an = Math.atan2(Math.sin(Math.PI * t) * 340 * 0 + 1, 0); void an; tile(c, x - 24 + (t < 0.5 ? 40 : -40) * 0, y - 24, 48, i % 4); }
  bead(c, 460, 600, 78, COL.red); bead(c, 620, 600, 78, COL.blue);
  smooth(c, [[500, 600], [580, 600]], 22, COL.yellow);
  void U;
};
const ancestorC = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 28);
  tree(c, 540, 840, 760);
  cellIcon(c, 540, 930, 70);
  arrow(c, [[780, 960], [660, 940]], RED, 10);
};

// ================================================================= explanations
const chainC = (c: Ctx) => {
  ground(c);
  person(c, 170, 480, 330, {}); person(c, 540, 480, 330, { adult: true }); person(c, 910, 480, 330, { adult: true }); greyHair(c, 910, 480, 330);
  monkey(c, 910, 780, 150); fish(c, 540, 800, 120); cellIcon(c, 170, 800, 90);
  arrow(c, [[285, 330], [400, 330]], RED, 10); arrow(c, [[660, 330], [770, 330]], RED, 10);
  arrow(c, [[1010, 560], [1030, 640], [1010, 700]], RED, 10);
  arrow(c, [[780, 800], [700, 800]], RED, 10); arrow(c, [[380, 800], [290, 800]], RED, 10);
};
const youngEarth = (c: Ctx) => {
  ground(c, "#1d1b3a");
  const rd = rnd(21); for (let i = 0; i < 40; i++) shape(c, () => ell(c, rd() * D, rd() * D, 3 + rd() * 3, 3 + rd() * 3), "#fff6c4", 0);
  // the Moon, close and big
  shape(c, () => ell(c, 800, 270, 210, 210), "#d9d4cc", 8); shade(c, () => ell(c, 800, 270, 210, 210), COL.greyDk, 60, 60, 0.45);
  [[730, 210, 40], [870, 330, 50], [780, 350, 25], [900, 200, 30]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r * 0.85), "#b9b4ab", 5));
  // the Earth
  const E0 = () => ell(c, 430, 660, 360, 360);
  shape(c, E0, "#2c5f9e", 9); c.save(); c.beginPath(); E0(); c.clip();
  shade(c, E0, "#173a66", 90, 90, 0.5);
  [[300, 580, 90], [550, 730, 80], [380, 800, 60]].forEach(([x, y, r], i) => {
    shape(c, () => ell(c, x, y, r * 1.3, r * 0.6), "#6a4d3c", 6);
    shape(c, () => polyP(c, [[x - r * 0.4, y - r * 0.2], [x - r * 0.12, y - r * 0.85], [x + r * 0.12, y - r * 0.85], [x + r * 0.4, y - r * 0.2]]), "#5a3f33", 6);
    shape(c, () => ell(c, x, y - r * 0.85, r * 0.14, r * 0.06), COL.orange, 3);
    for (let k = 0; k < 3; k++) shape(c, () => ell(c, x + Math.sin(k + i) * 18, y - r * (1.1 + k * 0.32), r * (0.22 + k * 0.06), r * (0.22 + k * 0.06)), k % 2 ? "#6c6672" : "#4a4452", 4);
  });
  c.restore(); c.beginPath(); E0(); c.strokeStyle = INK; c.lineWidth = 9; c.stroke();
};
const rustSea = (c: Ctx) => {
  ground(c, "#cfe6f3");
  c.fillStyle = COL.water; c.fillRect(0, 160, D, 220); c.fillStyle = "#b8b69a"; c.fillRect(0, 380, D, 200); c.fillStyle = "#c78e5a"; c.fillRect(0, 580, D, 150);
  c.beginPath(); c.moveTo(0, 160); c.lineTo(D, 160); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // banded iron rock
  for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? "#d9503b" : "#6f6a72"; c.fillRect(0, 730 + i * 50, D, 50); }
  c.beginPath(); c.moveTo(0, 730); c.lineTo(D, 730); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  // microbes making bubbles
  const rd = rnd(4);
  [150, 420, 700, 920].forEach((x, j) => { smooth(c, along((t) => [x + t * 90, 260 + Math.sin(t * 8 + j) * 12], 12), 22, COL.green); for (let k = 0; k < 3; k++) { const bx = x + 30 + k * 18, by = 220 - k * 36; shape(c, () => ell(c, bx, by, 14 + k * 4, 14 + k * 4), "rgba(255,255,255,0.7)", 4); } });
  // rust flakes falling
  for (let i = 0; i < 26; i++) shape(c, () => ell(c, 40 + rd() * 1000, 400 + rd() * 300, 10, 7, rd() * 3), "#b8571f", 3);
  arrow(c, [[540, 420], [540, 690]], RED, 13);
};
const millerC = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 360, 28);
  const fl = () => { c.moveTo(480, 130); c.lineTo(600, 130); c.lineTo(600, 330); c.bezierCurveTo(780, 380, 840, 560, 840, 660); c.bezierCurveTo(840, 850, 700, 940, 540, 940); c.bezierCurveTo(380, 940, 240, 850, 240, 660); c.bezierCurveTo(240, 560, 300, 380, 480, 330); c.closePath(); };
  shape(c, fl, COL.glass, 8);
  c.save(); c.beginPath(); fl(); c.clip(); c.fillStyle = "#b07a45"; c.fillRect(0, 700, D, 300); c.restore();
  shape(c, fl, "rgba(0,0,0,0)", 8);
  const rd = rnd(7); for (let i = 0; i < 9; i++) bead(c, 340 + rd() * 400, 760 + rd() * 120, 24, TC[i % 4]);
  // electrodes and spark
  line(c, [[110, 520], [380, 520]], 26, INK); line(c, [[110, 520], [380, 520]], 14, COL.steelDk);
  line(c, [[970, 520], [700, 520]], 26, INK); line(c, [[970, 520], [700, 520]], 14, COL.steelDk);
  line(c, [[380, 520], [460, 480], [520, 560], [590, 490], [700, 520]], 16, INK); line(c, [[380, 520], [460, 480], [520, 560], [590, 490], [700, 520]], 8, COL.yellow);
  shine(c, [[300, 700], [300, 820]], 12);
};
const pairC = (c: Ctx) => {
  ground(c);
  const a = [0, 2, 3, 1, 2, 0], b = [1, 3, 2, 0, 3, 1], s = 120, xs = (i: number) => 90 + i * 150;
  shape(c, () => rrect(c, 60, 250, 960, 200, 16), COL.paper, 6); shape(c, () => rrect(c, 60, 640, 960, 200, 16), COL.paper, 6);
  a.forEach((k, i) => { tile(c, xs(i), 290, s, k); tile(c, xs(i), 680, s, b[i]); line(c, [[xs(i) + s / 2, 460], [xs(i) + s / 2, 630]], 12, INK); });
};
const ribosomeC = (c: Ctx) => {
  ground(c);
  const big = () => { c.moveTo(210, 540); c.bezierCurveTo(160, 320, 320, 220, 540, 240); c.bezierCurveTo(760, 220, 920, 330, 870, 540); c.bezierCurveTo(760, 580, 320, 580, 210, 540); c.closePath(); };
  const sml = () => { c.moveTo(240, 620); c.bezierCurveTo(420, 600, 660, 600, 840, 620); c.bezierCurveTo(900, 800, 760, 900, 540, 900); c.bezierCurveTo(320, 900, 190, 800, 240, 620); c.closePath(); };
  shape(c, sml, COL.blue); shade(c, sml, COL.blueDk, 50, 40, 0.5);
  smooth(c, along((t) => [60 + t * 960, 585 + Math.sin(t * 14) * 14], 50), 20, COL.pink);
  shape(c, big, COL.teal); shade(c, big, COL.tealDk, 60, 50, 0.5);
  const ch = along((t) => [540 + Math.sin(t * 6) * 70, 260 - t * 190], 12); for (let i = 0; i < 6; i++) bead(c, ch[i * 2][0], ch[i * 2][1], 30, TC[i % 4]);
};
const bubbleC = (c: Ctx) => {
  ground(c, "#cfe6f3");
  const R = 330, cx = 540, cy = 540;
  shape(c, () => ell(c, cx, cy, R - 40, R - 40), COL.water, 0);
  for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, ux = Math.cos(a), uy = Math.sin(a); line(c, [[cx + ux * (R - 70), cy + uy * (R - 70)], [cx + ux * (R - 8), cy + uy * (R - 8)]], 12, INK); line(c, [[cx + ux * (R - 70), cy + uy * (R - 70)], [cx + ux * (R - 8), cy + uy * (R - 8)]], 5, COL.pink); }
  for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; shape(c, () => ell(c, cx + Math.cos(a) * (R + 22), cy + Math.sin(a) * (R + 22), 26, 26), COL.pink, 5); }
  smooth(c, along((t) => [cx - 140 + t * 280, cy + Math.sin(t * 10) * 70], 40), 16, COL.purple);
  [0, 2, 1, 3, 0].forEach((k, i) => tile(c, cx - 160 + i * 66, cy + 85 + (i % 2) * 10, 40, k));
};
const mutateC = (c: Ctx) => {
  ground(c);
  const base = [0, 1, 2, 3, 0, 1], rows = [base.slice(), base.slice(), base.slice(), base.slice(), base.slice()];
  rows[2][2] = 3; rows[3][2] = 3; rows[4][2] = 3; rows[4][4] = 2;
  rows.forEach((r, j) => { const y = 90 + j * 190; r.forEach((k, i) => tile(c, 300 + i * 82, y, 70, k)); if (j) arrow(c, [[200, y - 110], [200, y - 10]], RED, 10); });
  ring(c, 300 + 2 * 82 + 35, 90 + 2 * 190 + 35, 50); ring(c, 300 + 4 * 82 + 35, 90 + 4 * 190 + 35, 50);
};
const placesC = (c: Ctx) => {
  ground(c);
  sceneVent(c, 30, 160, 320, 760); scenePool(c, 380, 160, 320, 760); sceneMeteor(c, 730, 160, 320, 760);
};
const familyC = (c: Ctx) => {
  ground(c);
  const pos: number[][] = [[130, 300], [290, 190], [455, 130], [625, 130], [790, 190], [950, 300]];
  pos.forEach(([x, y]) => { smooth(c, [[540, 700], [(540 + x) / 2, 520], [x, y + 85]], 22, COL.soil); });
  line(c, [[540, 860], [540, 690]], 44, INK); line(c, [[540, 860], [540, 690]], 32, COL.soil);
  pos.forEach(([x, y]) => shape(c, () => ell(c, x, y, 90, 90), COL.paper, 6));
  bacterium(c, 130, 300, 46, 0.5);
  { const x = 290, y = 190; shape(c, () => { c.moveTo(x - 55, y + 5); c.bezierCurveTo(x - 55, y - 65, x + 55, y - 65, x + 55, y + 5); c.closePath(); }, COL.red, 5); shape(c, () => rrect(c, x - 16, y + 5, 32, 45, 8), COL.cloth, 5); shape(c, () => ell(c, x - 20, y - 25, 8, 8), WHITE, 0); shape(c, () => ell(c, x + 18, y - 15, 8, 8), WHITE, 0); }
  { const x = 455, y = 130; line(c, [[x, y + 55], [x, y - 10]], 8, COL.greenDk); leaf(c, x, y + 10, 55, -0.5); leaf(c, x, y + 25, 55, -2.6); shape(c, () => ell(c, x, y + 62, 30, 10), COL.soil, 4); }
  fish(c, 625, 130, 55);
  { const x = 790, y = 190; shape(c, () => ell(c, x, y + 10, 45, 30, -0.3), COL.orange, 5); shape(c, () => ell(c, x + 38, y - 22, 22, 22), COL.orange, 5); poly(c, [[x + 56, y - 24], [x + 80, y - 18], [x + 56, y - 12]], COL.yellow, 4); shape(c, () => ell(c, x + 42, y - 26, 4, 4), INK, 0); poly(c, [[x - 40, y + 20], [x - 75, y + 40], [x - 30, y + 36]], COL.orange, 4); }
  { const x = 950, y = 300; shape(c, () => ell(c, x, y + 62, 42, 28), CLOTH.child, 5); shape(c, () => ell(c, x, y - 8, 30, 32), SKIN.child, 5); shape(c, () => { c.moveTo(x - 31, y - 10); c.bezierCurveTo(x - 30, y - 50, x + 30, y - 50, x + 31, y - 10); c.quadraticCurveTo(x, y - 30, x - 31, y - 10); }, CLOTH.hair, 4); }
  cellIcon(c, 540, 925, 80);
};

const LIST: [string, (c: Ctx) => void][] = [
  ["flow.e1", e1], ["flow.a1", a1], ["flow.a2", a2], ["flow.a3", a3], ["flow.a4", a4], ["flow.a6", a6], ["flow.p1", p1], ["flow.c1", c1],
  ["term.0", cellBig], ["term.1", microbe], ["term.2", moleculeC], ["term.3", billion], ["term.4", fossil], ["term.7", oxygenC], ["term.9", dnaC], ["term.10", rnaC],
  ["term.11", proteinC], ["term.12", aminoC], ["term.13", ribozymeC], ["term.17", ancestorC],
  ["expl.0", chainC], ["expl.1", youngEarth], ["expl.3", rustSea], ["expl.4", millerC], ["expl.5", pairC], ["expl.6", ribosomeC], ["expl.8", bubbleC], ["expl.9", mutateC], ["expl.10", placesC], ["expl.11", familyC],
];
export const KEYS = LIST.map(([k]) => k);
export const ic_evolutionStoryOfLifeL3 = cards("sci.evolution.story-of-life.L3 cards", LIST.map(([, f]) => f));
