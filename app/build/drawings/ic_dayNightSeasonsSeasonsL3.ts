import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, glass, bowl, leaf, write, cards } from "./flatKit";

// sci.day-night-seasons.seasons.L3 · picture cards. Same child and grown-up as the set-up cards.
const SUNC = "#ffd34d", ORG = "#f58a1f", GRY = "#9aa3b2", DUSK = "#1d2142";
const SUMMER = "#ffcf7a", RAIN = "#8fb8e8", COOL = "#bfe3c8";

const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[x + Math.cos(a) * (r + 12), y + Math.sin(a) * (r + 12)], [x + Math.cos(a) * (r * 1.6 + 12), y + Math.sin(a) * (r * 1.6 + 12)]], Math.max(5, r * 0.14), ORG); }
  shape(c, () => ell(c, x, y, r, r), SUNC, 6);
};
const cloud = (c: Ctx, x: number, y: number, s: number, col = WHITE) => {
  shape(c, () => { c.moveTo(x - 120 * s, y + 40 * s); c.arc(x - 90 * s, y, 45 * s, Math.PI * 0.5, Math.PI * 1.5); c.arc(x - 20 * s, y - 40 * s, 65 * s, Math.PI, Math.PI * 1.9); c.arc(x + 70 * s, y - 5 * s, 50 * s, Math.PI * 1.4, Math.PI * 0.5); c.closePath(); }, col, 6);
};
const rain = (c: Ctx, x0: number, x1: number, y0: number, y1: number, n: number, seed = 3) => {
  const r = rnd(seed); for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); line(c, [[x, y], [x - 10, y + 28]], 6, COL.blueDk); }
};
const mango = (c: Ctx, x: number, y: number, r: number) => {
  const b = () => ell(c, x, y, r, r * 0.82, -0.5);
  shape(c, b, COL.yellow, 6); shade(c, b, ORG, r * 0.25, r * 0.2, 0.7);
  shape(c, () => ell(c, x - r * 0.1, y - r * 0.85, r * 0.3, r * 0.12, -0.5), COL.leafDk, 4);
  shine(c, [[x - r * 0.6, y - r * 0.1], [x - r * 0.35, y - r * 0.5]], 8);
};
const umbrella = (c: Ctx, x: number, y: number, r: number, col: string) => {
  line(c, [[x, y], [x, y + r * 1.1], [x - r * 0.18, y + r * 1.25]], 8);
  const dome = () => { c.moveTo(x - r, y); c.arc(x, y, r, Math.PI, 0); c.closePath(); };
  shape(c, dome, col, 6); shade(c, dome, "rgba(0,0,0,0.25)", r * 0.35, 0, 0.5);
  line(c, [[x, y - r], [x - r * 0.45, y]], 4); line(c, [[x, y - r], [x + r * 0.45, y]], 4); line(c, [[x, y - r], [x, y]], 4);
};
const tree = (c: Ctx, x: number, y: number, h: number, state: "green" | "bare" | "yellow" | "new") => {
  const w = h * 0.07;
  shape(c, () => polyP(c, [[x - w, y], [x - w * 0.6, y - h * 0.5], [x + w * 0.6, y - h * 0.5], [x + w, y]]), COL.brown, 6);
  const tops: number[][] = [[-0.34, -0.9], [-0.1, -1.0], [0.18, -0.95], [0.38, -0.8], [-0.46, -0.72], [0.48, -0.65]];
  tops.forEach(([a, b]) => line(c, [[x, y - h * 0.5], [x + a * h * 0.5, y + b * h * 0.85 * 0.6 + h * 0.2 - h * 0.1]], 10, COL.brown));
  if (state === "bare") return;
  const col = state === "green" ? COL.leaf : state === "yellow" ? "#e8c230" : COL.greenLt;
  tops.forEach(([a, b]) => { const ex = x + a * h * 0.5, ey = y + b * h * 0.85 * 0.6 + h * 0.1; const cr = () => ell(c, ex, ey, h * 0.17, h * 0.15); shape(c, cr, col, 5); shade(c, cr, state === "green" ? COL.leafDk : "#c9a020", h * 0.04, h * 0.04, 0.5); });
};
const wedge = (c: Ctx, cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, fill: string) =>
  shape(c, () => { c.moveTo(cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1); c.arc(cx, cy, r1, a0, a1); c.lineTo(cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); }, fill, 5);
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 16) => { const p: number[][] = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; p.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } return p; };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, fill: string, draw: () => void) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); c.fillStyle = fill; c.fillRect(x, y, w, h); draw(); c.restore();
  c.beginPath(); rrect(c, x, y, w, h, 28); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
};
const bg = (c: Ctx, col: string) => { c.fillStyle = col; c.fillRect(0, 0, D, D); };
const ground = (c: Ctx, y: number, col: string) => { c.fillStyle = col; c.fillRect(-10, y, D + 20, D); line(c, [[-10, y], [D + 10, y]], 6); };
const snowflake = (c: Ctx, x: number, y: number, r: number, col = WHITE) => {
  for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 9, INK); }
  for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 5, col); }
};
const shawl = (c: Ctx, x: number, y: number, h: number, col: string) => {
  const sh = y - h * 0.74;
  shape(c, () => { c.moveTo(x - h * 0.17, sh); c.quadraticCurveTo(x, sh - h * 0.06, x + h * 0.17, sh); c.lineTo(x + h * 0.15, sh + h * 0.3); c.lineTo(x - h * 0.15, sh + h * 0.3); c.closePath(); }, col, 5);
};
const flower = (c: Ctx, x: number, y: number, r: number, col: string) => {
  for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; shape(c, () => ell(c, x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.7, r * 0.7), col, 4); }
  shape(c, () => ell(c, x, y, r * 0.55, r * 0.55), COL.yellow, 4);
};

// ------------------------------------------------------------------ intro and summary
const intro = (c: Ctx) => {
  bg(c, COL.sky); ground(c, 900, "#9ccf62");
  // block of flats
  shape(c, () => rrect(c, 700, 120, 400, 960, 6), "#f1d3a0", 6);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) shape(c, () => rrect(c, 745 + k * 160, 170 + r * 190, 90, 120, 4), COL.sky, 5);
  // neem tree: left half bare and yellow, right half fresh and green with white flowers
  shape(c, () => polyP(c, [[372, 900], [392, 560], [432, 560], [452, 900]]), COL.brown, 6);
  const L: number[][][] = [[[395, 580], [300, 480], [235, 400]], [[395, 620], [290, 600], [190, 560]], [[405, 560], [350, 430], [330, 330]]];
  const R: number[][][] = [[[430, 580], [525, 480], [590, 400]], [[430, 620], [535, 600], [635, 560]], [[420, 560], [475, 430], [495, 330]]];
  [...L, ...R].forEach((p) => line(c, p, 12, COL.brown));
  R.forEach((p) => { const [x, y] = p[2]; const cr = () => ell(c, x, y, 85, 72); shape(c, cr, COL.greenLt, 5); shade(c, cr, COL.leaf, 14, 12, 0.5); for (let i = 0; i < 4; i++) shape(c, () => ell(c, x - 40 + i * 28, y - 18 + (i % 2) * 40, 9, 9), WHITE, 3); });
  const r = rnd(5);
  L.forEach((p) => { const [x, y] = p[2]; for (let i = 0; i < 3; i++) leaf(c, x - 20 + i * 24, y - 10 + r() * 30, 34, 1.2 + r(), "#e8c230"); });
  [[250, 640, 0.9], [160, 760, 1.5], [330, 780, 2.2], [120, 860, 0.4], [260, 860, 1.9]].forEach(([x, y, a]) => leaf(c, x, y, 36, a, "#e8c230"));
  shadow(c, 410, 905, 130, 18);
  // girl on the balcony
  shape(c, () => rrect(c, 690, 790, 410, 40, 6), COL.steel, 6);
  person(c, 880, 800, 330);
  shape(c, () => rrect(c, 690, 790, 410, 40, 6), COL.steel, 6);
  for (let i = 0; i < 6; i++) line(c, [[720 + i * 70, 830], [720 + i * 70, 960]], 7);
  line(c, [[690, 960], [1100, 960]], 8);
};
const summary = (c: Ctx) => {
  bg(c, "#efe4cf"); const cx = 540, cy = 540, R = 460, t = (Math.PI * 2) / 3;
  const sect = (a0: number, col: string) => shape(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, R, a0, a0 + t); c.closePath(); }, col, 0);
  sect(-Math.PI / 2, SUMMER); sect(-Math.PI / 2 + t, RAIN); sect(-Math.PI / 2 + 2 * t, COOL);
  // summer (top right)
  c.save(); c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + t); c.lineTo(cx, cy); c.clip();
  sun(c, 760, 290, 62); mango(c, 740, 500, 78); c.restore();
  // rains (bottom)
  c.save(); c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2 + t, -Math.PI / 2 + 2 * t); c.lineTo(cx, cy); c.clip();
  cloud(c, 540, 700, 1.1, GRY); rain(c, 400, 700, 740, 900, 10); umbrella(c, 540, 860, 110, COL.red); c.restore();
  // cool (top left)
  c.save(); c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2 + 2 * t, -Math.PI / 2 + 3 * t); c.lineTo(cx, cy); c.clip();
  person(c, 330, 640, 330); shawl(c, 330, 640, 330, COL.purple); snowflake(c, 215, 250, 40); snowflake(c, 440, 215, 28); c.restore();
  [-Math.PI / 2, -Math.PI / 2 + t, -Math.PI / 2 + 2 * t].forEach((a) => line(c, [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 9, WHITE));
  c.beginPath(); c.arc(cx, cy, R, 0, 7); c.lineWidth = 9; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, cx, cy, 26, 26), WHITE, 6);
};

// ------------------------------------------------------------------ experiments, activities, project, challenge
const flowE1 = (c: Ctx) => {
  bg(c, "#efe4cf"); shadow(c, 700, 905, 200, 24);
  // paper strip hanging into the glass, with bands of colour
  shape(c, () => rrect(c, 665, 470, 70, 360, 3), COL.paper, 5);
  c.fillStyle = "#cfe3f5"; c.fillRect(668, 776, 64, 52);
  [[700, 30, "#3b7a33"], [660, 36, "#7ab648"], [618, 36, "#f2c230"], [580, 26, "#f6dd7a"]].forEach(([y, h, col]) => { c.fillStyle = col as string; c.fillRect(668, y as number, 64, h as number); });
  c.beginPath(); rrect(c, 665, 470, 70, 360, 3); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  glass(c, 700, 900, 320, 420, 0.22);
  shape(c, () => rrect(c, 440, 458, 520, 26, 8), COL.yellow, 5); shape(c, () => polyP(c, [[440, 458], [405, 471], [440, 484]]), "#f1d3a0", 5);
  // the two leaves
  leaf(c, 80, 820, 300, -0.5, COL.leaf); leaf(c, 70, 560, 260, -0.2, "#e8c230");
  arrow(c, [[250, 600], [380, 600], [540, 640]]);
};
const flowE2 = (c: Ctx) => {
  bg(c, "#efe4cf");
  // squared paper
  shape(c, () => polyP(c, [[40, 800], [1040, 800], [1000, 960], [80, 960]]), COL.paper, 6);
  for (let i = 1; i < 14; i++) { const t = i / 14; line(c, [[40 + 1000 * t - 0 * t, 800], [80 + 920 * t, 960]], 2, COL.grey); }
  for (let j = 1; j < 4; j++) { const y = 800 + j * 40, o = j * 10; line(c, [[40 + o, y], [1040 - o, y]], 2, COL.grey); }
  // straight: a small patch
  c.beginPath(); ell(c, 220, 870, 62, 28); c.fillStyle = "rgba(255,211,77,0.9)"; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  polyP; c.beginPath(); c.moveTo(190, 470); c.lineTo(250, 470); c.lineTo(282, 860); c.lineTo(158, 860); c.closePath(); c.fillStyle = "rgba(255,230,120,0.55)"; c.fill();
  c.beginPath(); ell(c, 220, 870, 62, 28); c.fillStyle = "rgba(255,211,77,0.9)"; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  const torch = (x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -180, -34, 170, 68, 14), COL.teal, 6); shape(c, () => polyP(c, [[-10, -34], [40, -52], [40, 52], [-10, 34]]), COL.steel, 6); shape(c, () => ell(c, 40, 0, 10, 52), COL.yellow, 5); c.restore(); };
  torch(220, 330, Math.PI / 2 - 0 + 0); 
  // slanting: a long patch from the same torch
  c.beginPath(); c.moveTo(595, 570); c.lineTo(640, 548); c.lineTo(950, 868); c.lineTo(650, 880); c.closePath(); c.fillStyle = "rgba(255,230,120,0.5)"; c.fill();
  c.beginPath(); ell(c, 800, 868, 160, 30); c.fillStyle = "rgba(255,211,77,0.9)"; c.fill(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  torch(600, 560, 0.6);
  arrow(c, [[420, 420], [380, 560]], RED, 9);
};
const flowA1 = (c: Ctx) => {
  bg(c, "#f1d3a0");
  shape(c, () => rrect(c, 120, 90, 840, 640, 14), COL.sky, 8);
  c.save(); c.beginPath(); rrect(c, 128, 98, 824, 624, 10); c.clip();
  ground(c, 560, "#9ccf62"); sun(c, 770, 220, 62); cloud(c, 290, 220, 1, WHITE);
  tree(c, 450, 600, 330, "green");
  c.restore();
  line(c, [[540, 90], [540, 730]], 14, COL.woodDk); line(c, [[120, 400], [960, 400]], 14, COL.woodDk);
  shape(c, () => rrect(c, 90, 720, 900, 50, 10), COL.wood, 7);
  person(c, 640, 1040, 520, { armR: [Math.PI * 1.3, Math.PI * 1.4] });
};
const flowA2 = (c: Ctx) => {
  bg(c, "#efe4cf");
  // the fridge
  shape(c, () => rrect(c, 620, 70, 360, 520, 24), WHITE, 7); line(c, [[620, 270], [980, 270]], 6);
  shape(c, () => rrect(c, 650, 150, 18, 80, 8), COL.steelDk, 4); shape(c, () => rrect(c, 650, 310, 18, 120, 8), COL.steelDk, 4);
  snowflake(c, 840, 170, 52, COL.sky); snowflake(c, 840, 430, 52, COL.sky);
  // warm sun over the liquid bowl
  sun(c, 220, 190, 62);
  bowl(c, 250, 700, 190, "#fbe9a8"); shine(c, [[160, 690], [250, 705]], 10);
  bowl(c, 810, 850, 190, WHITE);
  for (const [x, y] of [[740, 850], [830, 868], [900, 842]]) shape(c, () => ell(c, x, y, 26, 13), "#eee7d6", 3);
  arrow(c, [[480, 560], [560, 650], [570, 760]]);
};
const flowA3 = (c: Ctx) => {
  bg(c, "#f1d3a0"); c.fillStyle = "#e0b87a"; c.fillRect(0, 580, D, D); line(c, [[0, 580], [D, 580]], 7);
  shape(c, () => rrect(c, 120, 70, 340, 420, 10), COL.sky, 8); sun(c, 290, 180, 50);
  line(c, [[290, 70], [290, 490]], 10, COL.woodDk); line(c, [[120, 280], [460, 280]], 10, COL.woodDk);
  // light falling to the floor
  c.beginPath(); c.moveTo(120, 490); c.lineTo(460, 490); c.lineTo(560, 880); c.lineTo(250, 880); c.closePath(); c.fillStyle = "rgba(255,230,120,0.55)"; c.fill();
  // old positions dashed, with tape marks
  c.setLineDash([22, 16]);
  [[430, 880, 0.75], [560, 880, 0.55]].forEach(([x, w]) => { c.beginPath(); c.moveTo(x - 300 * 0.7, 790); c.lineTo(x + 20, 790); c.lineTo(x + 20 + 40, 940); c.lineTo(x - 300 * 0.7 + 40, 940); c.closePath(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); void w; });
  c.setLineDash([]);
  c.beginPath(); c.moveTo(250, 790); c.lineTo(560, 790); c.lineTo(600, 940); c.lineTo(290, 940); c.closePath(); c.fillStyle = "rgba(255,211,77,0.85)"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  [[560, 790], [720, 790], [880, 790]].forEach(([x, y]) => { shape(c, () => rrect(c, x - 6, y - 24, 28, 60, 4), COL.paper, 4); });
  arrow(c, [[300, 1010], [650, 1010], [940, 1010]]);
};
const flowA4 = (c: Ctx) => {
  bg(c, "#efe4cf"); const cx = 420, cy = 520, R = 360;
  shadow(c, cx + 14, cy + 30, R, R * 0.97);
  shape(c, () => ell(c, cx, cy, R + 20, R + 20), WHITE, 7);
  const cols = [SUMMER, RAIN, "#e6b66a", COOL];
  cols.forEach((col, i) => wedge(c, cx, cy, 0, R, -Math.PI / 2 + i * (Math.PI / 2), -Math.PI / 2 + (i + 1) * (Math.PI / 2), col));
  sun(c, cx + 170, cy - 170, 40); cloud(c, cx + 150, cy + 140, 0.65, GRY); rain(c, cx + 90, cx + 230, cy + 180, cy + 300, 5);
  leaf(c, cx - 270, cy + 180, 150, -0.6, "#e8c230"); leaf(c, cx - 170, cy + 250, 120, -1.2, "#d99a2b"); snowflake(c, cx - 170, cy - 170, 48);
  // crayons
  [[COL.red, 850], [COL.blue, 910], [COL.green, 970]].forEach(([col, x]) => { shape(c, () => rrect(c, (x as number), 560, 46, 360, 8), col as string, 6); shape(c, () => polyP(c, [[(x as number), 560], [(x as number) + 23, 500], [(x as number) + 46, 560]]), col as string, 6); });
};
const flowA5 = (c: Ctx) => {
  bg(c, "#f1d3a0"); ground(c, 860, "#e3d5b8");
  person(c, 330, 960, 520, { adult: true, armL: [Math.PI * 0.45, Math.PI * 0.2] });
  person(c, 720, 960, 400, { armR: [Math.PI * 0.4, Math.PI * 0.1] });
  // a speech bubble with a sun and a koel-like drop of rain
  shape(c, () => { c.moveTo(230, 130); c.arc(300, 220, 150, 0, 0); c.closePath(); }, WHITE, 0);
  shape(c, () => { rrect(c, 120, 90, 440, 250, 50); }, WHITE, 6); shape(c, () => polyP(c, [[300, 340], [340, 450], [380, 340]]), WHITE, 6);
  shape(c, () => rrect(c, 301, 336, 78, 10, 0), WHITE, 0);
  sun(c, 250, 215, 46); cloud(c, 440, 220, 0.6, GRY);
  // notebook the child holds
  shape(c, () => rrect(c, 800, 740, 120, 150, 8), COL.paper, 6); line(c, [[825, 780], [895, 780]], 4); line(c, [[825, 815], [895, 815]], 4); line(c, [[825, 850], [875, 850]], 4);
};
const flowP1 = (c: Ctx) => {
  bg(c, "#efe4cf"); ground(c, 900, "#9ccf62");
  tree(c, 270, 900, 500, "green"); shadow(c, 290, 905, 140, 18);
  shape(c, () => rrect(c, 520, 120, 500, 780, 14), COL.paper, 7); line(c, [[770, 120], [770, 900]], 5, COL.grey);
  const st: ("green" | "yellow" | "bare" | "new")[] = ["green", "yellow", "bare", "new"];
  st.forEach((s, i) => { const x = 645 + (i % 2) * 250, y = 330 + Math.floor(i / 2) * 330; c.save(); c.beginPath(); rrect(c, x - 105, y - 150, 210, 300, 10); c.clip(); c.fillStyle = COL.sky; c.fillRect(x - 105, y - 150, 210, 300); c.fillStyle = "#9ccf62"; c.fillRect(x - 105, y + 100, 210, 60); tree(c, x, y + 105, 210, s); c.restore(); c.beginPath(); rrect(c, x - 105, y - 150, 210, 300, 10); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); });
};
const flowC2 = (c: Ctx) => {
  bg(c, "#efe4cf"); sun(c, 540, 130, 62);
  const box = (x: number) => { shadow(c, x + 20, 940, 230, 24); shape(c, () => polyP(c, [[x - 200, 600], [x + 200, 600], [x + 170, 920], [x - 170, 920]]), COL.brown, 6); shade(c, () => polyP(c, [[x - 200, 600], [x + 200, 600], [x + 170, 920], [x - 170, 920]]), "#7a4e2a", 40, 0, 0.5); shape(c, () => ell(c, x, 600, 200, 24), "#6a4a30", 6); shape(c, () => ell(c, x, 640, 62, 20), COL.steel, 5); shape(c, () => rrect(c, x - 40, 580, 80, 60, 12), COL.drop, 5); shine(c, [[x - 25, 596], [x - 10, 592]], 7); };
  box(270); box(790);
  // shade card over the right box
  shape(c, () => polyP(c, [[600, 430], [990, 430], [1000, 480], [590, 480]]), COL.teal, 6);
  line(c, [[610, 480], [610, 590]], 8); line(c, [[980, 480], [980, 590]], 8);
  [[270, 240, 330, 540], [330, 200, 400, 520]].forEach(([a, b, d, e]) => { void a; void b; void d; void e; });
  arrow(c, [[270, 250], [270, 480]], RED, 9); arrow(c, [[560, 330], [640, 400]], RED, 9);
};

// ------------------------------------------------------------------ terms
const calCols = [COOL, COOL, SUMMER, SUMMER, SUMMER, RAIN, RAIN, RAIN, RAIN, COOL, COOL, COOL];
const term0 = (c: Ctx) => {
  bg(c, "#efe4cf"); shadow(c, 560, 960, 420, 30);
  shape(c, () => rrect(c, 90, 90, 900, 850, 24), WHITE, 7);
  shape(c, () => rrect(c, 90, 90, 900, 120, 24), COL.red, 7);
  [250, 540, 830].forEach((x) => shape(c, () => rrect(c, x - 14, 50, 28, 90, 14), COL.steelDk, 5));
  calCols.forEach((col, i) => { const x = 130 + (i % 4) * 215, y = 250 + Math.floor(i / 4) * 225; shape(c, () => rrect(c, x, y, 195, 205, 18), col, 5); write(c, String(i + 1), x + (i + 1 > 9 ? 50 : 72), y + 60, 80, INK, 9); });
};
const term1 = (c: Ctx) => {
  bg(c, "#fff3c8"); sun(c, 540, 150, 80); ground(c, 800, "#e3d5b8");
  shape(c, () => rrect(c, 40, 380, 230, 420, 6), "#f1d3a0", 6); shape(c, () => rrect(c, 820, 330, 230, 470, 6), "#d9b88a", 6);
  [[80, 440], [160, 440], [80, 560], [160, 560]].forEach(([x, y]) => shape(c, () => rrect(c, x, y, 60, 80, 4), COL.sky, 4));
  [[860, 400], [940, 400], [860, 540], [940, 540]].forEach(([x, y]) => shape(c, () => rrect(c, x, y, 60, 80, 4), COL.sky, 4));
  shadow(c, 540, 975, 56, 14);
  person(c, 540, 960, 420, { armR: [-1.2, -1.5] });
  line(c, [[613, 480], [613, 572]], 8); const d = () => { c.moveTo(393, 480); c.arc(613, 480, 220, Math.PI, 0); c.closePath(); }; shape(c, d, COL.red, 6); shade(c, d, "rgba(0,0,0,0.25)", 60, 0, 0.5);
  line(c, [[613, 260], [613, 480]], 4); line(c, [[613, 260], [500, 480]], 4); line(c, [[613, 260], [730, 480]], 4);
};
const term3 = (c: Ctx) => {
  bg(c, "#b8c4d4"); ground(c, 800, "#8d97a8");
  cloud(c, 300, 130, 1.2, GRY); cloud(c, 760, 110, 1.3, "#7f8a9c"); rain(c, 40, 1040, 230, 780, 40, 9);
  shape(c, () => rrect(c, 40, 360, 220, 440, 6), "#d8c6a6", 6);
  shape(c, () => ell(c, 760, 900, 250, 60), COL.waterDk, 6); shape(c, () => ell(c, 760, 900, 130, 28), COL.water, 4); shape(c, () => ell(c, 760, 900, 60, 12), COL.drop, 4);
  shadow(c, 390, 975, 100, 16);
  person(c, 390, 960, 440);
  shape(c, () => rrect(c, 390 - 57, 960 - 0.74 * 440 - 9, 114, 0.4 * 440, 26), COL.yellow, 6);
  const h = 440 * 0.13, hy = 960 - 0.74 * 440 - h * 1.05;
  shape(c, () => { c.moveTo(390 - h * 1.1, hy + h * 0.1); c.bezierCurveTo(390 - h * 1.3, hy - h * 1.9, 390 + h * 1.3, hy - h * 1.9, 390 + h * 1.1, hy + h * 0.1); c.lineTo(390 + h * 0.9, hy - h * 0.2); c.quadraticCurveTo(390, hy - h * 0.7, 390 - h * 0.9, hy - h * 0.2); c.closePath(); }, COL.yellow, 6);
};
const term4 = (c: Ctx) => {
  bg(c, "#efe4cf");
  panel(c, 30, 170, 490, 760, "#cfd4da", () => {
    c.fillStyle = "rgba(255,255,255,0.55)"; c.fillRect(0, 300, D, 150); c.fillRect(0, 540, D, 90);
    ground(c, 780, "#aeb4bc"); shape(c, () => rrect(c, 40, 360, 160, 420, 6), "#c4b8a4", 6);
    c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(0, 380, 330, 120);
    person(c, 300, 900, 460); shape(c, () => rrect(c, 300 - 60, 900 - 0.74 * 460 - 9, 120, 0.4 * 460, 26), COL.red, 6);
    const hh = 460 * 0.13, hy = 900 - 0.74 * 460 - hh * 1.05; shape(c, () => ell(c, 300, hy - hh * 0.75, hh * 1.1, hh * 0.55), COL.red, 5);
  });
  panel(c, 560, 170, 490, 760, COL.sky, () => {
    sun(c, 900, 290, 56); ground(c, 780, "#9ccf62"); tree(c, 640, 790, 360, "green");
    person(c, 800, 900, 460); shawl(c, 800, 900, 460, COL.pink);
  });
};
const term5 = (c: Ctx) => {
  bg(c, "#efe4cf"); const cx = 540, cy = 540, R = 460, a = (Math.PI * 2) / 6;
  const cols = ["#f6b8cf", "#ffcf7a", RAIN, "#cfeaf8", "#d8e2dc", "#e6eef7"];
  cols.forEach((col, i) => wedge(c, cx, cy, 90, R, -Math.PI / 2 + i * a, -Math.PI / 2 + (i + 1) * a, col));
  const at = (i: number, r = 290): [number, number] => [cx + Math.cos(-Math.PI / 2 + (i + 0.5) * a) * r, cy + Math.sin(-Math.PI / 2 + (i + 0.5) * a) * r];
  flower(c, ...at(0), 34, COL.pink);
  sun(c, ...at(1), 48);
  { const [x, y] = at(2); cloud(c, x, y - 20, 0.6, GRY); rain(c, x - 50, x + 50, y + 20, y + 80, 4); }
  { const [x, y] = at(3); cloud(c, x, y + 10, 0.55, WHITE); sun(c, x + 20, y - 70, 28); }
  { const [x, y] = at(4); for (let i = 0; i < 3; i++) line(c, [[x - 70, y - 40 + i * 40], [x + 70, y - 40 + i * 40]], 14, WHITE); }
  { const [x, y] = at(5); snowflake(c, x, y, 54); }
  shape(c, () => ell(c, cx, cy, 80, 80), WHITE, 6);
};
const term9 = (c: Ctx) => {
  bg(c, "#efe4cf"); ground(c, 700, "#e3d5b8");
  const at = (x: number, y: number, k: number, f: () => void) => { c.save(); c.translate(x, y); c.scale(k, k); f(); c.restore(); };
  const sw = (x: number, col: string) => shape(c, () => ell(c, x, 880, 90, 90), col, 6);
  // turmeric
  at(135, 470, 1.6, () => { shape(c, () => ell(c, 0, 20, 70, 30, 0.35), "#c8861c", 4); shape(c, () => ell(c, 10, -20, 60, 28, -0.4), "#c8861c", 4); shape(c, () => ell(c, 58, -30, 14, 22, -0.4), "#ffb81c", 3); });
  // leaf
  leaf(c, 330, 640, 330, -1.0, COL.leaf);
  // chilli
  at(640, 470, 1.7, () => { shape(c, () => { c.moveTo(-40, -110); c.bezierCurveTo(60, -100, 90, 40, 10, 120); c.bezierCurveTo(30, 20, 0, -50, -60, -80); c.closePath(); }, COL.red, 4); shape(c, () => ell(c, -50, -95, 28, 15, 0.5), COL.leafDk, 4); });
  // carrot
  at(900, 470, 1.6, () => { shape(c, () => polyP(c, [[-45, -100], [45, -100], [0, 130]]), ORG, 4); leaf(c, 0, -100, 70, -2.1, COL.leaf); leaf(c, 0, -100, 70, -1.0, COL.leaf); });
  sw(150, "#ffb81c"); sw(390, COL.leaf); sw(640, COL.red); sw(900, ORG);
};
const term10 = (c: Ctx) => {
  bg(c, COL.sky); ground(c, 540, "#9ccf62");
  shape(c, () => rrect(c, -10, 540, D + 20, 560, 0), COL.soil, 6); c.fillStyle = COL.soil; c.fillRect(0, 543, D, 540);
  line(c, [[0, 540], [D, 540]], 6);
  line(c, [[540, 540], [540, 250]], 22, INK); line(c, [[540, 540], [540, 250]], 12, COL.leaf);
  leaf(c, 540, 400, 220, -0.5); leaf(c, 540, 330, 200, Math.PI + 0.5); leaf(c, 540, 260, 130, -1.3);
  const roots: number[][][] = [[[540, 540], [480, 680], [400, 780], [350, 880]], [[540, 540], [540, 700], [560, 820], [530, 960]], [[540, 540], [600, 680], [690, 760], [760, 880]], [[480, 680], [420, 700], [350, 690]], [[690, 760], [790, 740], [860, 770]]];
  roots.forEach((p) => line(c, p, 18, INK)); roots.forEach((p) => line(c, p, 8, COL.paper));
  const r = rnd(8); for (let i = 0; i < 18; i++) shape(c, () => ell(c, 80 + r() * 920, 600 + r() * 440, 12, 12), COL.blue, 3);
  arrow(c, [[250, 900], [250, 640]], RED, 12); arrow(c, [[830, 900], [830, 640]], RED, 12);
  arrow(c, [[640, 800], [610, 640], [605, 580]], RED, 10);
};
const term12 = (c: Ctx) => {
  bg(c, "#dfe8f2"); const r = rnd(2); for (let i = 0; i < 14; i++) snowflake(c, 40 + r() * 1000, 40 + r() * 300, 14 + r() * 14);
  shape(c, () => { c.moveTo(0, 1080); c.lineTo(0, 560); c.quadraticCurveTo(150, 280, 540, 270); c.quadraticCurveTo(930, 280, 1080, 560); c.lineTo(1080, 1080); c.closePath(); }, "#9a9aa6", 7);
  shape(c, () => { c.moveTo(0, 560); c.quadraticCurveTo(150, 280, 540, 270); c.quadraticCurveTo(930, 280, 1080, 560); c.quadraticCurveTo(900, 400, 540, 380); c.quadraticCurveTo(180, 400, 0, 560); c.closePath(); }, WHITE, 6);
  shape(c, () => { c.moveTo(130, 1080); c.lineTo(160, 620); c.quadraticCurveTo(540, 440, 920, 620); c.lineTo(950, 1080); c.closePath(); }, "#3a3342", 7);
  // the sleeping bear
  const body = () => ell(c, 570, 830, 300, 175);
  shape(c, body, "#4a3a32", 7); shade(c, body, "#2c2321", 40, 60, 0.6);
  shape(c, () => ell(c, 300, 850, 105, 95), "#4a3a32", 7); shape(c, () => ell(c, 255, 880, 52, 42), "#c9a27a", 5);
  shape(c, () => ell(c, 226, 872, 14, 10), INK, 0);
  shape(c, () => ell(c, 255, 770, 28, 28), "#4a3a32", 6); shape(c, () => ell(c, 350, 765, 28, 28), "#4a3a32", 6);
  line(c, [[285, 828], [315, 833]], 6, WHITE); line(c, [[335, 836], [360, 842]], 6, WHITE);
  shape(c, () => ell(c, 440, 965, 80, 40, 0.1), "#4a3a32", 6);
  shape(c, () => { c.moveTo(560, 700); c.quadraticCurveTo(640, 650, 720, 700); c.quadraticCurveTo(640, 690, 560, 700); c.closePath(); }, "#c9a27a", 0);
};
const term13 = (c: Ctx) => {
  bg(c, "#efe4cf");
  const dial = (x: number, hrs: number, num: string) => {
    const R = 235, cy = 500, half = (hrs / 24) * Math.PI;
    shape(c, () => ell(c, x, cy, R + 12, R + 12), DUSK, 7);
    wedge(c, x, cy, 0, R, -Math.PI / 2 - half, -Math.PI / 2 + half, COL.yellow);
    sun(c, x, cy - R * 0.5, 34);
    shape(c, () => { c.moveTo(x + 14, cy + R * 0.55 - 30); c.arc(x, cy + R * 0.55, 30, -1.2, 1.2 + Math.PI * 1.15); c.closePath(); }, WHITE, 0);
    shape(c, () => ell(c, x - 18, cy + R * 0.55 - 8, 30, 30), DUSK, 0);
    write(c, num, x - (num.length * 0.8 * 90) / 2 + 10, 820, 90, INK, 12);
  };
  dial(290, 14, "14"); dial(790, 10, "10");
};
const term14 = (c: Ctx) => {
  bg(c, "#fff3c8"); ground(c, 860, "#d9b86a");
  shadow(c, 520, 905, 260, 30);
  const r = rnd(4);
  for (let i = 0; i < 15; i++) {
    const t = i / 14, bx = 400 + t * 240, tx = 250 + t * 540, ty = 240 + Math.abs(t - 0.5) * 160;
    line(c, [[bx, 900], [bx + (tx - bx) * 0.2, 640], [tx, ty]], 12, INK); line(c, [[bx, 900], [bx + (tx - bx) * 0.2, 640], [tx, ty]], 5, "#e8b53a");
    for (let k = 0; k < 4; k++) { const gx = tx + (r() - 0.5) * 40 + (t - 0.5) * 40 * k * 0.4, gy = ty + k * 34; shape(c, () => ell(c, gx, gy, 12, 20, (t - 0.5) * 0.8), "#f2c23a", 3.5); }
  }
  shape(c, () => rrect(c, 380, 610, 280, 56, 20), COL.brown, 6);
  // sickle
  c.save(); c.translate(820, 770); c.rotate(-0.4);
  shape(c, () => rrect(c, 0, -22, 150, 44, 16), COL.wood, 6);
  shape(c, () => { c.moveTo(0, 0); c.bezierCurveTo(-80, -40, -120, -180, -40, -220); c.bezierCurveTo(-90, -150, -70, -50, 6, -14); c.closePath(); }, COL.steel, 6);
  c.restore();
};

// ------------------------------------------------------------------ explanations
const expl0 = (c: Ctx) => {
  bg(c, "#efe4cf"); const cx = 540, cy = 540, a = (Math.PI * 2) / 12;
  calCols.forEach((col, i) => wedge(c, cx, cy, 130, 400, -Math.PI / 2 + i * a, -Math.PI / 2 + (i + 1) * a, col));
  const at = (i: number, r = 265): [number, number] => [cx + Math.cos(-Math.PI / 2 + (i + 0.5) * a) * r, cy + Math.sin(-Math.PI / 2 + (i + 0.5) * a) * r];
  mango(c, ...at(3), 62); { const [x, y] = at(7); umbrella(c, x, y - 30, 66, COL.red); } { const [x, y] = at(11); shape(c, () => polyP(c, [[x - 55, y - 50], [x + 55, y - 50], [x + 40, y + 50], [x, y + 70], [x - 40, y + 50]]), COL.purple, 6); line(c, [[x - 20, y - 50], [x, y - 10], [x + 20, y - 50]], 5); }
  shape(c, () => ell(c, cx, cy, 125, 125), WHITE, 6); sun(c, cx, cy, 42);
  arrow(c, arcPts(cx, cy, 455, -Math.PI / 2 - 0.1, Math.PI * 0.62, 18), RED, 14);
};
const expl4 = (c: Ctx) => {
  bg(c, "#efe4cf");
  panel(c, 60, 60, 960, 360, DUSK, () => {
    shape(c, () => { c.moveTo(210, 100); c.arc(210, 240, 100, -1.4, 1.4); c.arc(255, 240, 80, 1.2, -1.2, true); c.closePath(); }, "#ffe9a8", 0);
    const r = rnd(6); for (let i = 0; i < 14; i++) { const x = 380 + r() * 600, y = 110 + r() * 280; c.beginPath(); for (let k = 0; k < 8; k++) { const an = (k * Math.PI) / 4, d = k % 2 ? 6 : 16; c[k ? "lineTo" : "moveTo"](x + Math.cos(an) * d, y + Math.sin(an) * d); } c.closePath(); c.fillStyle = WHITE; c.fill(); }
  });
  // plant in a pot with yellow flowers
  shadow(c, 300, 1010, 190, 22);
  shape(c, () => polyP(c, [[190, 800], [410, 800], [380, 1000], [220, 1000]]), "#c8663a", 6);
  line(c, [[300, 800], [300, 560]], 16, INK); line(c, [[300, 800], [300, 560]], 8, COL.leaf);
  leaf(c, 300, 740, 140, -0.3); leaf(c, 300, 680, 140, Math.PI + 0.3);
  [[300, 540], [230, 600], [370, 610]].forEach(([x, y]) => flower(c, x, y, 28, "#ffd34d"));
  // basket of flowers
  shape(c, () => polyP(c, [[640, 800], [960, 800], [920, 1000], [680, 1000]]), "#d39a3a", 6);
  for (let i = 0; i < 4; i++) line(c, [[650 + i * 20, 850 + i * 35], [950 - i * 20, 850 + i * 35]], 4, "#a8723f");
  [[700, 770], [790, 740], [880, 770], [745, 720], [840, 710]].forEach(([x, y]) => flower(c, x, y, 28, "#ffd34d"));
  arrow(c, [[440, 650], [540, 600], [640, 650]], RED, 10);
};
const koel = (c: Ctx, x: number, y: number) => {
  line(c, [[x - 150, y + 90], [x + 160, y + 90]], 16, COL.brown);
  shape(c, () => polyP(c, [[x - 60, y + 40], [x - 190, y + 130], [x - 170, y + 150], [x - 20, y + 70]]), "#2a2530", 5);
  shape(c, () => ell(c, x, y, 85, 52, -0.2), "#2a2530", 6); shape(c, () => ell(c, x + 75, y - 45, 38, 36), "#2a2530", 6);
  shape(c, () => polyP(c, [[x + 108, y - 52], [x + 150, y - 42], [x + 108, y - 34]]), COL.yellow, 4);
  shape(c, () => ell(c, x + 85, y - 52, 9, 9), RED, 3); line(c, [[x - 20, y + 50], [x - 20, y + 90]], 7); line(c, [[x + 30, y + 50], [x + 30, y + 90]], 7);
};
const frog = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x, y + 20, 170, 40), COL.waterDk, 5);
  shape(c, () => ell(c, x, y - 30, 90, 62), COL.green, 6); shade(c, () => ell(c, x, y - 30, 90, 62), COL.greenDk, 20, 20, 0.5);
  shape(c, () => ell(c, x - 50, y - 100, 24, 24), COL.greenLt, 5); shape(c, () => ell(c, x + 50, y - 100, 24, 24), COL.greenLt, 5);
  shape(c, () => ell(c, x - 50, y - 100, 9, 9), INK, 0); shape(c, () => ell(c, x + 50, y - 100, 9, 9), INK, 0);
  c.beginPath(); c.arc(x, y - 55, 42, 0.2, Math.PI - 0.2); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
};
const duck = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x, y + 55, 190, 36), COL.waterDk, 5);
  shape(c, () => polyP(c, [[x - 100, y], [x - 210, y - 40], [x - 90, y + 20]]), "#3a3540", 5);
  shape(c, () => ell(c, x, y, 120, 58), "#b9a58a", 6);
  shape(c, () => rrect(c, x + 60, y - 120, 44, 100, 20), "#7a5a3a", 6); shape(c, () => ell(c, x + 82, y - 125, 36, 30), "#7a5a3a", 6);
  shape(c, () => rrect(c, x + 100, y - 132, 54, 20, 8), COL.steelDk, 4); shape(c, () => ell(c, x + 82, y - 132, 7, 7), INK, 0);
  shape(c, () => rrect(c, x + 50, y - 50, 30, 80, 14), WHITE, 4);
};
const buffalo = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x, y + 70, 220, 38), "#7a5a3a", 5);
  shape(c, () => ell(c, x, y, 140, 70), "#3b3a40", 6); shape(c, () => ell(c, x + 135, y - 20, 62, 50), "#3b3a40", 6);
  line(c, [[x + 100, y - 60], [x + 80, y - 120], [x + 140, y - 130]], 18, INK); line(c, [[x + 100, y - 60], [x + 80, y - 120], [x + 140, y - 130]], 8, "#e0d5c0");
  shape(c, () => ell(c, x + 175, y - 15, 20, 14), "#77767d", 4); shape(c, () => ell(c, x + 130, y - 30, 8, 8), WHITE, 0);
  shape(c, () => ell(c, x + 126, y - 30, 4, 4), INK, 0);
};
const expl5 = (c: Ctx) => {
  bg(c, "#efe4cf");
  panel(c, 30, 30, 505, 505, SUMMER, () => { sun(c, 430, 130, 40); koel(c, 270, 330); mango(c, 150, 200, 38); });
  panel(c, 545, 30, 505, 505, RAIN, () => { cloud(c, 800, 120, 0.8, GRY); rain(c, 640, 960, 190, 300, 9, 5); frog(c, 800, 410); });
  panel(c, 30, 545, 505, 505, "#cfeaf8", () => { duck(c, 260, 800); snowflake(c, 100, 640, 28); });
  panel(c, 545, 545, 505, 505, SUMMER, () => { c.fillStyle = "#d9b86a"; c.fillRect(545, 800, 505, 250); sun(c, 960, 640, 36); buffalo(c, 760, 880); });
};
const expl6 = (c: Ctx) => {
  bg(c, "#efe4cf");
  const cw = 320, gap = 20;
  panel(c, 30, 120, cw, 840, SUMMER, () => {
    sun(c, 120, 220, 42);
    // fan
    line(c, [[190, 350], [190, 330]], 8); [0, 2.09, 4.19].forEach((a) => shape(c, () => ell(c, 190 + Math.cos(a + 0.3) * 60, 330 + Math.sin(a + 0.3) * 60 * 0.4, 56, 14, a * 0.2), COL.steel, 5));
    shape(c, () => ell(c, 190, 330, 14, 14), INK, 0);
    person(c, 190, 920, 400, { armR: [-0.4, -1.4] }); glass(c, 245, 614, 56, 90, 0.8, "#f6f0dd");
  });
  panel(c, 30 + cw + gap, 120, cw, 840, RAIN, () => {
    cloud(c, 530, 240, 0.8, GRY); rain(c, 400, 700, 310, 880, 14, 7);
    person(c, 530, 920, 400); umbrella(c, 570, 520, 130, COL.red);
    ground(c, 900, "#7a9a5a"); for (let i = 0; i < 4; i++) line(c, [[430 + i * 50, 900], [430 + i * 50, 840]], 6, COL.leaf);
  });
  panel(c, 30 + 2 * (cw + gap), 120, cw, 840, "#cfeaf8", () => {
    sun(c, 880, 230, 40); ground(c, 900, "#e3d5b8");
    person(c, 790, 940, 400, { adult: true });
    shadow(c, 930, 930, 100, 20);
    line(c, [[870, 920], [915, 870]], 14, COL.brown); line(c, [[990, 920], [945, 870]], 14, COL.brown);
    shape(c, () => polyP(c, [[860, 770], [1000, 770], [985, 860], [875, 860]]), "#c8663a", 6);
    shape(c, () => ell(c, 930, 770, 70, 18), WHITE, 5);
    for (let i = 0; i < 3; i++) line(c, [[900 + i * 30, 720], [890 + i * 30, 640 - i * 10]], 9, WHITE);
  });
};
const expl7 = (c: Ctx) => {
  bg(c, COL.sky);
  ground(c, 880, "#9ccf62");
  tree(c, 820, 900, 420, "green");
  const r = rnd(9); for (let i = 0; i < 16; i++) shape(c, () => ell(c, 710 + r() * 220, 660 + r() * 150, 10, 10), "#ffe9a8", 3);
  person(c, 330, 880, 560, { adult: true, armL: [Math.PI * 0.45, Math.PI * 0.3] });
  person(c, 560, 880, 420);
  shape(c, () => rrect(c, 80, 760, 640, 40, 8), COL.steel, 6); for (let i = 0; i < 9; i++) line(c, [[110 + i * 70, 800], [110 + i * 70, 1000]], 7);
  line(c, [[80, 1000], [720, 1000]], 8);
  shape(c, () => polyP(c, [[320, 740], [440, 725], [440, 765], [320, 780]]), COL.paper, 5); shape(c, () => polyP(c, [[440, 725], [560, 740], [560, 780], [440, 765]]), COL.paper, 5);
  line(c, [[345, 755], [425, 745]], 3); line(c, [[345, 768], [425, 758]], 3);
};

export const ic_dayNightSeasonsSeasonsL3 = cards("sci.day-night-seasons.seasons.L3 cards", [
  intro, summary, flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, flowC2,
  term0, term1, term3, term4, term5, term9, term10, term12, term13, term14,
  expl0, expl4, expl5, expl6, expl7,
]);
void SKIN; void CLOTH; void polyP; void shade;
