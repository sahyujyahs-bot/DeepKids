import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, WHITE, SKIN, SH, arrow, shine, cards, D, ell, ground, hand, leaf, line, person, polyP, rnd, rrect, shade, shadow, shape, write, glass } from "./flatKit";

// WHAT IS LIGHT L3 · picture cards for the unit's activities, words and ideas.
// Bold ink outlines, flat colours, shade side, soft shadow. Same child and grown-up as the set-up cards.

const NIGHT = "#2a2650", DARK = "#1b1736", FLOOR = "#d9b98a", GRASS = "#9ccf62", SKYC = "#bfe0f5", LAMP = "#ffd34d";
const BRASS = "#d9a441", BRASSDK = "#a8761f", EARTHB = "#4f8fd8";

// ---------------------------------------------------------------- shared pieces
const torch = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -20, -30, 170, 60, 14), COL.teal);
  shape(c, () => polyP(c, [[150, -30], [205, -50], [205, 50], [150, 30]]), COL.steel);
  shape(c, () => ell(c, 207, 0, 10, 46), COL.yellow);
  c.restore();
};
const lens = (x: number, y: number, an: number, s: number): [number, number] => [x + Math.cos(an) * 207 * s, y + Math.sin(an) * 207 * s];
const wrist = (x: number, y: number, h: number, a: [number, number], right = true): [number, number] => {
  const sx = right ? x + h * 0.11 : x - h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a[0]) * h * 0.17, ey = sy + Math.sin(a[0]) * h * 0.17;
  return [ex + Math.cos(a[1]) * h * 0.16, ey + Math.sin(a[1]) * h * 0.16];
};
const beam = (c: Ctx, pts: number[][], a = 0.4) => { c.beginPath(); polyP(c, pts); c.fillStyle = `rgba(255,226,120,${a})`; c.fill(); };
const star5 = (c: Ctx, x: number, y: number, r: number, col: string, ln = 5) => {
  const pts: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), col, ln);
};
const sparkle = (c: Ctx, x: number, y: number, r: number, col = "#fff6c8") => {
  c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); c.fillStyle = col; c.fill();
};
const sunDisc = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 10, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.2, 0.5);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), EARTHB);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  shape(c, () => { c.moveTo(x - r * 0.6, y - r * 0.5); c.quadraticCurveTo(x - r * 0.2, y - r * 0.9, x + r * 0.1, y - r * 0.4); c.quadraticCurveTo(x - r * 0.1, y + r * 0.1, x - r * 0.4, y + r * 0.2); c.quadraticCurveTo(x - r * 0.8, y, x - r * 0.6, y - r * 0.5); c.closePath(); }, COL.green, 4);
  shape(c, () => { c.moveTo(x + r * 0.3, y + r * 0.1); c.quadraticCurveTo(x + r * 0.8, y - r * 0.1, x + r * 0.85, y + r * 0.4); c.quadraticCurveTo(x + r * 0.5, y + r * 0.9, x + r * 0.25, y + r * 0.5); c.closePath(); }, COL.green, 4);
  c.restore();
  shade(c, () => ell(c, x, y, r, r), "#2f5ea8", r * 0.3, r * 0.2, 0.45);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const jupiter = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#f0b977");
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  [[-0.55, 0.16, "#d98a4f"], [-0.1, 0.2, "#e9a35f"], [0.38, 0.18, "#c9743f"]].forEach(([o, hh, col]) => { c.fillStyle = col as string; c.fillRect(x - r, y + r * (o as number), r * 2, r * (hh as number)); });
  c.restore();
  shade(c, () => ell(c, x, y, r, r), "#b0612f", r * 0.3, r * 0.2, 0.4);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const clock = (c: Ctx, x: number, y: number, r: number, mins: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  if (mins > 0) { c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.88, -Math.PI / 2, -Math.PI / 2 + (mins / 60) * Math.PI * 2); c.closePath(); c.fillStyle = "rgba(215,55,43,0.55)"; c.fill(); }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.sin(a) * r * 0.82, y - Math.cos(a) * r * 0.82], [x + Math.sin(a) * r * 0.94, y - Math.cos(a) * r * 0.94]], 4); }
  const a = (mins / 60) * Math.PI * 2; line(c, [[x, y], [x + Math.sin(a) * r * 0.7, y - Math.cos(a) * r * 0.7]], 7);
  line(c, [[x, y], [x, y - r * 0.42]], 7);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};
const waveLine = (c: Ctx, x1: number, y1: number, x2: number, y2: number, amp: number, wl: number, w: number, col: string = COL.yellow) => {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, pts: number[][] = [];
  for (let t = 0; t <= L; t += 4) { const o = Math.sin((t / wl) * Math.PI * 2) * amp; pts.push([x1 + ux * t - uy * o, y1 + uy * t + ux * o]); }
  line(c, pts, w + 8, INK); line(c, pts, w, col);
};
const dots = (c: Ctx, x1: number, y1: number, x2: number, y2: number, n: number, r: number, col: string = COL.yellow) => {
  for (let i = 0; i <= n; i++) { const t = i / n; shape(c, () => ell(c, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, r), col, 3.5); }
};
const cloud = (c: Ctx, x: number, y: number, s: number, col = "#8f93b8") => {
  shape(c, () => { c.moveTo(x - 110 * s, y); c.arc(x - 70 * s, y - 10 * s, 50 * s, Math.PI, Math.PI * 1.75); c.arc(x + 5 * s, y - 40 * s, 62 * s, Math.PI * 1.15, Math.PI * 1.9); c.arc(x + 80 * s, y - 5 * s, 48 * s, Math.PI * 1.35, Math.PI * 0.45); c.lineTo(x - 110 * s, y + 38 * s); c.closePath(); }, col, 5);
};
const bolt = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x, y], [x - 60 * s, y + 120 * s], [x - 10 * s, y + 120 * s], [x - 70 * s, y + 260 * s], [x + 50 * s, y + 90 * s], [x, y + 90 * s], [x + 50 * s, y]]), COL.yellow, 6);
};
const stars = (c: Ctx, seed: number, n: number, x0: number, y0: number, x1: number, y1: number) => {
  const r = rnd(seed); for (let i = 0; i < n; i++) sparkle(c, x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), 6 + r() * 9);
};

// ---------------------------------------------------------------- 0 intro: torch, far wall, a question
const intro = (c: Ctx) => {
  ground(c, NIGHT);
  c.fillStyle = "#3b3668"; c.fillRect(0, 850, D, 230); line(c, [[0, 850], [D, 850]], 6);
  shape(c, () => ell(c, 880, 470, 170, 220), "rgba(255,226,120,0.35)", 0);
  shape(c, () => ell(c, 880, 470, 135, 180), COL.yellow, 6);
  const h = 540, px = 190, py = 960, a: [number, number] = [-0.12, -0.05];
  person(c, px, py, h, { armR: a });
  const [wx, wy] = wrist(px, py, h, a), an = Math.atan2(470 - wy, 760 - wx), s = 0.55;
  const [lx, ly] = lens(wx, wy, an, s);
  beam(c, [[lx, ly - 20], [880, 300], [880, 640], [lx, ly + 20]], 0.42);
  torch(c, wx, wy, an, s);
  line(c, [[520, 270], [540, 232], [585, 222], [615, 250], [600, 290], [565, 316], [565, 350]], 14, WHITE);
  shape(c, () => ell(c, 565, 395, 11, 11), WHITE, 0);
};

// ---------------------------------------------------------------- 1 summary: sunlight to a child, 8 minutes
const summary = (c: Ctx) => {
  ground(c, SKYC);
  c.fillStyle = "#e9d3a4"; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 6);
  sunDisc(c, 170, 170, 88);
  const px = 800, py = 1010, h = 430;
  person(c, px, py, h, {});
  const fx = px - 55, fy = py - h * 0.74 - h * 0.13 * 1.05;
  const ex = fx, ey = fy, sx = 250, sy = 235, mx = (sx + ex) / 2, my = (sy + ey) / 2;
  waveLine(c, sx, sy, mx, my, 16, 60, 18);
  dots(c, mx + 18, my + 12, ex - 14, ey - 8, 8, 11);
  arrow(c, [[ex - 100, ey - 70], [ex - 36, ey - 14]], RED, 10);
  clock(c, 380, 700, 95, 8); write(c, "8", 510, 650, 80, INK, 10);
};

// ---------------------------------------------------------------- 2 e1 flash and bang
const e1 = (c: Ctx) => {
  ground(c, SKYC);
  c.fillStyle = GRASS; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  // helper far away, plates meeting overhead
  const hx = 190, hy = 880, hh = 330;
  shadow(c, hx, hy + 6, 80, 12);
  person(c, hx, hy, hh, { adult: true, armL: [-2.0, -1.3], armR: [-1.14, -1.84] });
  const py = hy - hh * 0.74 + hh * 0.03 - hh * 0.28 - 85;
  shape(c, () => ell(c, hx - 15, py, 16, 56), COL.steel, 5); shape(c, () => ell(c, hx + 15, py, 16, 56), COL.steelIn, 5);
  star5(c, hx, py - 70, 38, COL.yellow, 5);
  // child near, looking and listening
  const cx = 800, cy = 1020, ch = 520;
  shadow(c, cx, cy + 6, 100, 16);
  person(c, cx, cy, ch, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [0.5, -1.6] });
  const ey = cy - ch * 0.74 - ch * 0.13 * 1.05;
  // light: a fast straight arrow; sound: slow waves
  arrow(c, [[hx + 70, py - 60], [cx - 90, ey - 10]], COL.yellow, 12);
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(hx + 120 + k * 60, py - 10, 70 + k * 12, -0.9, 0.9); c.strokeStyle = COL.blueDk; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  line(c, [[hx - 130, 960], [hx + 130, 960]], 5); write(c, "20", hx - 40, 985, 50, INK, 7);
  line(c, [[hx + 130, 1010], [cx - 20, 1010]], 5); write(c, "200", 430, 1030, 38, INK, 6);
};

// ---------------------------------------------------------------- 3 e2 glow star test
const e2 = (c: Ctx) => {
  ground(c, DARK);
  line(c, [[540, 60], [540, 1020]], 6, "#5a5590");
  const side = (x: number, col: string, colDk: string, lit: boolean) => {
    // phone, screen facing the star below
    c.save(); c.translate(x, 190); c.rotate(0);
    shape(c, () => rrect(c, -110, -110, 220, 340, 28), "#3a3540", 6);
    shape(c, () => rrect(c, -90, -88, 180, 300, 14), col, 0);
    shade(c, () => rrect(c, -90, -88, 180, 300, 14), colDk, 30, 20, 0.5);
    c.restore();
    beam(c, [[x - 90, 420], [x + 90, 420], [x + 190, 640], [x - 190, 640]], 0.28);
    c.beginPath(); polyP(c, [[x - 90, 420], [x + 90, 420], [x + 190, 640], [x - 190, 640]]); c.fillStyle = col; c.globalAlpha = 0.3; c.fill(); c.globalAlpha = 1;
    if (lit) { for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * 120, 780 + Math.sin(a) * 120], [x + Math.cos(a) * 175, 780 + Math.sin(a) * 175]], 9, "#c9f06b"); } shape(c, () => ell(c, x, 780, 112, 112), "rgba(201,240,107,0.35)", 0); }
    star5(c, x, 780, 90, lit ? "#c9f06b" : "#5d6b4a", 6);
    if (lit) line(c, [[x - 50, 930], [x - 15, 970], [x + 55, 900]], 14, "#6aa53f"); else { line(c, [[x - 40, 905], [x + 40, 985]], 14, RED); line(c, [[x + 40, 905], [x - 40, 985]], 14, RED); }
  };
  side(300, "#d7372b", "#9a1f17", false);
  side(780, "#3f7be0", "#2a56a8", true);
};

// ---------------------------------------------------------------- 4 e3 chocolate in the microwave
const e3 = (c: Ctx) => {
  ground(c, "#f6efe0");
  shadow(c, 560, 830, 430, 60);
  shape(c, () => ell(c, 540, 500, 440, 360), COL.steel); shape(c, () => ell(c, 540, 500, 395, 320), COL.steelIn, 5);
  const bx = 190, by = 250, bw = 700, bh = 340;
  shape(c, () => rrect(c, bx, by, bw, bh, 22), "#7a4a2e", 6);
  shade(c, () => rrect(c, bx, by, bw, bh, 22), "#5a3320", 30, 22, 0.5);
  c.strokeStyle = "#5a3320"; c.lineWidth = 5;
  for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(bx + (bw / 6) * i, by + 10); c.lineTo(bx + (bw / 6) * i, by + bh - 10); c.stroke(); }
  for (let j = 1; j < 3; j++) { c.beginPath(); c.moveTo(bx + 10, by + (bh / 3) * j); c.lineTo(bx + bw - 10, by + (bh / 3) * j); c.stroke(); }
  [[330, 360], [750, 360]].forEach(([x, y]) => { shape(c, () => { c.moveTo(x - 70, y); c.bezierCurveTo(x - 60, y - 70, x + 50, y - 80, x + 70, y - 10); c.bezierCurveTo(x + 80, y + 60, x - 30, y + 80, x - 70, y); c.closePath(); }, "#c9945f", 5); shine(c, [[x - 35, y - 25], [x - 5, y - 40]], 8); });
  // ruler between the two melted spots
  shape(c, () => rrect(c, 330, 490, 420, 80, 8), COL.wood, 6);
  c.strokeStyle = INK; c.lineWidth = 3;
  for (let i = 0; i <= 14; i++) { c.beginPath(); c.moveTo(340 + i * 29.2, 490); c.lineTo(340 + i * 29.2, 490 + (i % 5 === 0 ? 36 : 22)); c.stroke(); }
  arrow(c, [[330, 625], [750, 625]], RED, 11); arrow(c, [[750, 625], [330, 625]], RED, 11);
  write(c, "6", 490, 665, 80, INK, 10); write(c, "cm", 550, 695, 52, INK, 8);
};

// ---------------------------------------------------------------- 5 a1 switch on the dark: torch beam with dust
const a1 = (c: Ctx) => {
  ground(c, DARK);
  beam(c, [[470, 520], [1080, 220], [1080, 840], [470, 560]], 0.38);
  const r = rnd(5);
  for (let i = 0; i < 70; i++) { const t = 0.12 + r() * 0.85, x = 470 + t * 600, half = 20 + t * 290, y = 540 + (r() * 2 - 1) * half * 0.9; shape(c, () => ell(c, x, y, 6 + r() * 5, 6 + r() * 5), "#fff6c8", 0); }
  torch(c, 150, 540, 0, 1.3);
  hand(c, 215, 540, 0, 1.4, SKIN.child, CLOTH.child);
  sparkle(c, 905, 220, 24); sparkle(c, 960, 850, 20);
};

// ---------------------------------------------------------------- 6 a3 ripples in an uruli
const a3 = (c: Ctx) => {
  ground(c, "#f6efe0");
  shadow(c, 560, 850, 420, 60);
  shape(c, () => { c.moveTo(110, 480); c.bezierCurveTo(130, 840, 950, 840, 970, 480); c.closePath(); }, BRASS);
  shade(c, () => { c.moveTo(110, 480); c.bezierCurveTo(130, 840, 950, 840, 970, 480); c.closePath(); }, BRASSDK, 80, -20, 0.55);
  shape(c, () => ell(c, 540, 480, 430, 150), BRASS, 7);
  shape(c, () => ell(c, 540, 485, 390, 125), COL.water, 5);
  c.strokeStyle = WHITE; c.lineWidth = 8;
  [[70, 22], [140, 45], [210, 68], [280, 90]].forEach(([rx, ry]) => { c.beginPath(); ell(c, 540, 485, rx, ry); c.globalAlpha = 0.9 - rx / 420; c.stroke(); });
  c.globalAlpha = 1;
  shape(c, () => { c.moveTo(740, 505); c.quadraticCurveTo(790, 460, 850, 490); c.quadraticCurveTo(800, 535, 740, 505); c.closePath(); }, COL.leaf, 5);
  // a drop falling from a finger
  shape(c, () => { c.moveTo(540, 250); c.quadraticCurveTo(512, 300, 540, 322); c.quadraticCurveTo(568, 300, 540, 250); c.closePath(); }, COL.water, 5);
  arrow(c, [[640, 160], [640, 245]], RED, 10);
  hand(c, 540, 70, Math.PI / 2, 0.9, SKIN.child, CLOTH.child, true);
};

// ---------------------------------------------------------------- 7 a4 the late moon
const a4 = (c: Ctx) => {
  ground(c, DARK); stars(c, 3, 22, 20, 20, 1060, 1060);
  const row = (y: number, ex: number, extra: boolean) => {
    jupiter(c, 170, y, 105);
    shape(c, () => ell(c, 335, y - 35, 24, 24), COL.yellow, 5);
    line(c, [[360, y - 35], [ex - 85, y - 35]], 10, "#fff6c8");
    if (extra) arrow(c, [[540, y - 35], [ex - 100, y - 35]], RED, 12);
    earth(c, ex, y - 35, 70);
  };
  row(270, 560, false);
  row(720, 920, true);
  line(c, [[40, 500], [1040, 500]], 3, "#5a5590");
  arrow(c, [[570, 395], [880, 395]], "#fff6c8", 8);
};

// ---------------------------------------------------------------- 8 a6 street-light star through cloth
const a6 = (c: Ctx) => {
  ground(c, NIGHT);
  c.fillStyle = "#3b3668"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  // far street light
  shape(c, () => rrect(c, 135, 380, 18, 500, 5), COL.steelDk, 5);
  shape(c, () => ell(c, 144, 360, 60, 60), "rgba(255,226,120,0.35)", 0);
  shape(c, () => ell(c, 144, 360, 26, 26), COL.yellow, 5);
  // the cloth, held up, with the pattern the light makes in it
  shape(c, () => rrect(c, 360, 150, 640, 640, 24), "#6c6aa0", 7);
  c.save(); c.beginPath(); rrect(c, 380, 170, 600, 600, 14); c.clip();
  c.fillStyle = "#312d5e"; c.fillRect(380, 170, 600, 600);
  c.strokeStyle = "rgba(140,138,200,0.5)"; c.lineWidth = 3;
  for (let i = 0; i < 31; i++) { c.beginPath(); c.moveTo(380 + i * 20, 170); c.lineTo(380 + i * 20, 770); c.stroke(); c.beginPath(); c.moveTo(380, 170 + i * 20); c.lineTo(980, 170 + i * 20); c.stroke(); }
  c.restore();
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { const d = Math.hypot(i, j); if (d > 3.6) continue; const rr = i === 0 && j === 0 ? 46 : (i === 0 || j === 0 ? 20 : 11); shape(c, () => ell(c, 680 + i * 85, 470 + j * 85, rr, rr), i === 0 && j === 0 ? COL.yellow : "#fff1a8", 0); }
  arrow(c, [[220, 360], [345, 360]], RED, 10);
  [[395, 775], [965, 775]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 48, 48), SKIN.child, 6));
};

// ---------------------------------------------------------------- 9 a7 draw what light is: before and after
const a7 = (c: Ctx) => {
  ground(c, "#f6efe0");
  const sheet = (x: number) => { shadow(c, x + 20, 830, 210, 30); shape(c, () => rrect(c, x - 230, 160, 460, 650, 12), COL.paper, 6); };
  sheet(270); sheet(810);
  // before: a sun with straight rays
  shape(c, () => ell(c, 270, 480, 70, 70), COL.yellow, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[270 + Math.cos(a) * 105, 480 + Math.sin(a) * 105], [270 + Math.cos(a) * 165, 480 + Math.sin(a) * 165]], 8, COL.orange); }
  // after: a wave that is also a row of dots
  waveLine(c, 620, 480, 1000, 480, 40, 120, 9, COL.blue);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 650 + i * 55, 480 - Math.sin(((650 + i * 55 - 620) / 120) * Math.PI * 2) * 40, 12, 12), COL.yellow, 3.5);
  arrow(c, [[455, 880], [625, 880]], RED, 12);
  shape(c, () => polyP(c, [[500, 1000], [760, 940], [770, 970], [510, 1030]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[760, 940], [810, 930], [815, 975], [770, 970]]), COL.pink, 5);
};

// ---------------------------------------------------------------- 10 p1 the light-minute string
const p1 = (c: Ctx) => {
  ground(c, "#f6efe0");
  const sy = (x: number) => 300 + Math.sin(x / 190) * 14;
  line(c, Array.from({ length: 60 }, (_, i) => [i * 18.2, sy(i * 18.2)]), 9, INK); line(c, Array.from({ length: 60 }, (_, i) => [i * 18.2, sy(i * 18.2)]), 4, "#e9d9a8");
  sunDisc(c, 85, 330, 55);
  [[185, 3, "#9a948c", 14, 480], [245, 6, "#f3d38a", 20, 640], [305, 8, EARTHB, 21, 800], [390, 13, "#d9603b", 18, 560], [860, 43, "#f0b977", 44, 640]].forEach(([x, m, col, r, y]) => {
    const xx = x as number, yy = y as number;
    line(c, [[xx, sy(xx)], [xx, yy - (r as number) - 25]], 5); shape(c, () => rrect(c, xx - 11, sy(xx) - 6, 22, 34, 5), COL.wood, 4);
    shape(c, () => rrect(c, xx - (r as number) - 18, yy - (r as number) - 25, (r as number) * 2 + 36, (r as number) * 2 + 120, 12), COL.paper, 5);
    if (col === EARTHB) earth(c, xx, yy, r as number); else shape(c, () => ell(c, xx, yy, r as number, r as number), col as string, 5);
    write(c, String(m), xx - String(m).length * 12 + 2, yy + (r as number) + 18, 40, INK, 7);
  });
  arrow(c, [[920, 280], [1040, 270]], RED, 10);
};

// ---------------------------------------------------------------- 11 c1 Galileo's lantern test
const c1 = (c: Ctx) => {
  ground(c, "#46438a");
  c.fillStyle = "#f39a3c"; c.fillRect(0, 560, D, 40); c.fillStyle = "#4f8a3a"; c.fillRect(0, 600, D, 480); line(c, [[0, 600], [D, 600]], 6);
  shape(c, () => ell(c, 880, 160, 60, 60), "#fff6c8", 5);
  const L = { x: 170, y: 1000, h: 520 }, R = { x: 910, y: 900, h: 400 };
  shadow(c, L.x, L.y + 6, 90, 14); shadow(c, R.x, R.y + 6, 70, 12);
  const aL: [number, number] = [-0.1, -0.05];
  person(c, L.x, L.y, L.h, { armR: aL });
  const wL = wrist(L.x, L.y, L.h, aL);
  torch(c, wL[0], wL[1], -0.05, 0.55);
  person(c, R.x, R.y, R.h, { adult: true, armL: [Math.PI - 0.1, Math.PI + 0.05] });
  const wR = wrist(R.x, R.y, R.h, [Math.PI - 0.1, Math.PI + 0.05], false);
  c.save(); c.translate(wR[0], wR[1]); c.scale(-1, 1); torch(c, 0, 0, 0.05, 0.45); c.restore();
  const ly = wL[1];
  beam(c, [[wL[0] + 110, ly - 12], [wR[0] - 90, wR[1] - 8], [wR[0] - 90, wR[1] + 8], [wL[0] + 110, ly + 12]], 0.5);
  arrow(c, [[wL[0] + 150, ly - 70], [wR[0] - 120, wR[1] - 70]], COL.yellow, 9);
  arrow(c, [[wR[0] - 120, wR[1] + 70], [wL[0] + 150, ly + 70]], COL.yellow, 9);
  line(c, [[230, 1050], [850, 1050]], 5); write(c, "50", 500, 1000, 40, WHITE, 7);
};

// ---------------------------------------------------------------- 12 c2 send a message by light
const c2 = (c: Ctx) => {
  ground(c, DARK); stars(c, 9, 14, 20, 20, 1060, 380);
  c.fillStyle = "#3b3668"; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 6);
  const L = { x: 170, y: 1000, h: 520 }, R = { x: 900, y: 1000, h: 520 };
  const aL: [number, number] = [-0.35, -0.15];
  person(c, L.x, L.y, L.h, { armR: aL });
  const wL = wrist(L.x, L.y, L.h, aL), sL = 0.45;
  torch(c, wL[0], wL[1], -0.15, sL);
  person(c, R.x, R.y, R.h, { adult: true, armL: [2.2, 1.9] });
  // light pulses travelling: short, short, long, short
  const py = 470; let x = 360;
  [30, 30, 90, 30].forEach((w) => { shape(c, () => rrect(c, x, py - 22, w, 44, 22), COL.yellow, 5); x += w + 50; });
  arrow(c, [[350, py + 70], [720, py + 70]], RED, 10);
  // the code paper in the other hand
  shape(c, () => rrect(c, 690, 620, 170, 220, 10), COL.paper, 5);
  const pr = [[0, 30], [1, 30], [2, 90], [3, 30]];
  pr.forEach(([i, w]) => shape(c, () => rrect(c, 712, 645 + i * 45, w * 0.8, 20, 10), COL.yellow, 3.5));
};

// ---------------------------------------------------------------- 13 term.0 light: sunbeams on a cat
const t0 = (c: Ctx) => {
  ground(c, "#f1e3c5");
  c.fillStyle = FLOOR; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  shape(c, () => rrect(c, 120, 90, 380, 460, 14), COL.sky, 8);
  line(c, [[310, 90], [310, 550]], 8); line(c, [[120, 320], [500, 320]], 8);
  sunDisc(c, 400, 200, 40);
  beam(c, [[130, 330], [500, 330], [880, 900], [330, 960]], 0.45);
  shape(c, () => ell(c, 620, 880, 250, 55), "rgba(255,226,120,0.8)", 0);
  // the cat
  shadow(c, 640, 915, 150, 20);
  shape(c, () => ell(c, 640, 820, 120, 95), COL.orange, 6);
  shade(c, () => ell(c, 640, 820, 120, 95), "#c9742a", 40, 30, 0.5);
  shape(c, () => { c.moveTo(740, 860); c.quadraticCurveTo(880, 860, 840, 740); c.quadraticCurveTo(820, 700, 790, 730); c.quadraticCurveTo(830, 800, 740, 830); c.closePath(); }, COL.orange, 6);
  shape(c, () => ell(c, 570, 700, 72, 66), COL.orange, 6);
  shape(c, () => polyP(c, [[515, 665], [520, 595], [565, 640]]), COL.orange, 6); shape(c, () => polyP(c, [[580, 640], [625, 595], [630, 665]]), COL.orange, 6);
  line(c, [[535, 715], [562, 722], [590, 715]], 0); // no mouth
  shape(c, () => ell(c, 548, 695, 9, 12), INK, 0); shape(c, () => ell(c, 594, 695, 9, 12), INK, 0);
  shape(c, () => ell(c, 571, 722, 9, 7), COL.pink, 3);
  line(c, [[600, 905], [600, 870]], 14, "#c9742a");
};

// ---------------------------------------------------------------- 14 term.1 energy: a diya gives light and heat
const t1 = (c: Ctx) => {
  ground(c, DARK);
  shadow(c, 540, 800, 260, 30);
  shape(c, () => { c.moveTo(280, 640); c.quadraticCurveTo(300, 800, 540, 800); c.quadraticCurveTo(780, 800, 800, 640); c.quadraticCurveTo(540, 700, 280, 640); c.closePath(); }, "#c9743f");
  shade(c, () => { c.moveTo(280, 640); c.quadraticCurveTo(300, 800, 540, 800); c.quadraticCurveTo(780, 800, 800, 640); c.quadraticCurveTo(540, 700, 280, 640); c.closePath(); }, "#8e4a24", 50, -10, 0.55);
  shape(c, () => ell(c, 540, 640, 262, 44), "#e6a15f", 6); shape(c, () => ell(c, 540, 645, 200, 28), "#f2c063", 4);
  shape(c, () => { c.moveTo(540, 430); c.quadraticCurveTo(440, 560, 480, 620); c.quadraticCurveTo(540, 660, 600, 620); c.quadraticCurveTo(640, 560, 540, 430); c.closePath(); }, COL.orange, 6);
  shape(c, () => { c.moveTo(540, 520); c.quadraticCurveTo(500, 580, 520, 615); c.quadraticCurveTo(540, 635, 565, 615); c.quadraticCurveTo(585, 580, 540, 520); c.closePath(); }, COL.yellow, 0);
  for (let i = 0; i < 8; i++) { const a = Math.PI + 0.2 + (i / 7) * (Math.PI * 0.0 + 0) ; }
  [[-1, 0.5], [1, 0.5]].forEach(([s, y]) => { arrow(c, [[540 + s * 150, 560], [540 + s * 330, 520 + (y as number) * 0]], COL.yellow, 12); });
  arrow(c, [[400, 420], [250, 300]], COL.yellow, 12); arrow(c, [[680, 420], [830, 300]], COL.yellow, 12);
  [[420, 400], [540, 380], [660, 400]].forEach(([x, y]) => { const pts: number[][] = []; for (let t = 0; t <= 1; t += 0.05) pts.push([x + Math.sin(t * 9) * 16, y - t * 150]); arrow(c, pts, RED, 9); });
};

// ---------------------------------------------------------------- 15 term.4 speed of light: 7 and a half times round the Earth in 1 second
const t4 = (c: Ctx) => {
  ground(c, DARK); stars(c, 4, 18, 20, 20, 1060, 1060);
  for (let i = 0; i < 7; i++) { c.save(); c.translate(540, 520); c.rotate(-0.35 + i * 0.12); c.beginPath(); ell(c, 0, 0, 360 + 4 * i, 125 + 4 * i); c.restore(); }
  c.save(); c.translate(540, 520); c.rotate(-0.35);
  for (let i = 0; i < 6; i++) { c.beginPath(); ell(c, 0, 0, 370 + i * 2, 130 + i * 2); c.strokeStyle = i % 2 ? "#fff1a8" : COL.yellow; c.lineWidth = 7; c.stroke(); c.rotate(0.14); }
  c.restore();
  earth(c, 540, 520, 190);
  c.save(); c.translate(540, 520); c.rotate(-0.35 + 0.84); c.beginPath(); c.ellipse(0, 0, 382, 142, 0, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = COL.yellow; c.lineWidth = 9; c.stroke(); c.restore();
  write(c, "7", 110, 840, 150, WHITE, 16);
  clock(c, 770, 900, 110, 0); line(c, [[770, 900], [770, 800]], 9, RED);
  write(c, "1", 890, 850, 100, WHITE, 12);
};

// ---------------------------------------------------------------- 16 term.5 vacuum: light crosses a jar with no air
const t5 = (c: Ctx) => {
  ground(c, "#f6efe0");
  const r = rnd(2);
  for (let i = 0; i < 60; i++) { const x = r() * D, y = 120 + r() * 800; if (x > 250 && x < 830 && y > 270 && y < 830) continue; shape(c, () => ell(c, x, y, 8, 8), COL.sky, 3.5); }
  shadow(c, 540, 850, 300, 28);
  shape(c, () => rrect(c, 250, 290, 580, 540, 60), "rgba(214,236,250,0.65)", 8);
  shape(c, () => rrect(c, 280, 220, 520, 90, 18), COL.steel, 7);
  shade(c, () => rrect(c, 280, 220, 520, 90, 18), COL.steelDk, 30, 10, 0.5);
  shine(c, [[300, 380], [300, 740]], 12);
  c.fillStyle = "rgba(255,226,120,0.5)"; c.fillRect(30, 520, 1020, 70);
  line(c, [[30, 520], [1050, 520]], 3, LAMP); line(c, [[30, 590], [1050, 590]], 3, LAMP);
  arrow(c, [[60, 555], [980, 555]], COL.yellow, 14);
  shape(c, () => rrect(c, 495, 100, 90, 130, 8), COL.steelDk, 6);
};

// ---------------------------------------------------------------- 17 term.7 wave: a leaf bobs in place while the ripple passes
const t7 = (c: Ctx) => {
  ground(c, "#f6efe0");
  shape(c, () => rrect(c, 80, 260, 920, 640, 28), "rgba(214,236,250,0.5)", 8);
  const wave = (x: number) => 520 + Math.sin(x / 80) * 48;
  const pts: number[][] = []; for (let x = 90; x <= 990; x += 6) pts.push([x, wave(x)]);
  shape(c, () => { c.moveTo(90, 890); pts.forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(990, 890); c.closePath(); }, COL.water, 0);
  line(c, pts, 10);
  shape(c, () => rrect(c, 80, 260, 920, 640, 28), "rgba(0,0,0,0)", 8);
  const lx = 80 * Math.PI * 2.5 + 0; const x0 = 80 * (Math.PI / 2 + 2 * Math.PI) + 0; // a crest
  const cx = 80 * (Math.PI / 2 + 2 * Math.PI) % 920 + 0;
  const lxx = 300; shape(c, () => { c.moveTo(lxx - 70, wave(lxx) - 30); c.quadraticCurveTo(lxx, wave(lxx) - 85, lxx + 70, wave(lxx) - 30); c.quadraticCurveTo(lxx, wave(lxx) + 5, lxx - 70, wave(lxx) - 30); c.closePath(); }, COL.leaf, 6);
  arrow(c, [[lxx, 330], [lxx, 440]], RED, 12); arrow(c, [[lxx, 440], [lxx, 330]], RED, 12);
  arrow(c, [[480, 190], [880, 190]], RED, 14);
};

// ---------------------------------------------------------------- 18 term.9 photon: a beam is a stream of tiny packets
const t9 = (c: Ctx) => {
  ground(c, DARK);
  torch(c, 90, 540, 0, 1.2);
  const r = rnd(8);
  beam(c, [[340, 520], [1080, 250], [1080, 830], [340, 560]], 0.22);
  for (let i = 0; i < 110; i++) { const t = r(), x = 360 + t * 680, half = 18 + t * 260, y = 540 + (r() * 2 - 1) * half * 0.9, rr = 8 + t * 6; shape(c, () => ell(c, x, y, rr, rr), COL.yellow, 3); }
};

// ---------------------------------------------------------------- 19 term.12 light-year: the distance light goes in one year
const t12 = (c: Ctx) => {
  ground(c, DARK); stars(c, 6, 20, 20, 20, 1060, 560);
  shape(c, () => rrect(c, 90, 90, 330, 340, 22), WHITE, 7);
  shape(c, () => rrect(c, 90, 90, 330, 90, 22), RED, 7);
  [150, 360].forEach((x) => shape(c, () => rrect(c, x - 10, 60, 20, 60, 8), COL.steel, 5));
  write(c, "365", 150, 235, 110, INK, 14);
  // the long ruler with the beam running along it
  shape(c, () => rrect(c, 60, 720, 960, 120, 10), COL.wood, 7);
  c.strokeStyle = INK; c.lineWidth = 4;
  for (let i = 0; i <= 48; i++) { c.beginPath(); c.moveTo(80 + i * 19.6, 720); c.lineTo(80 + i * 19.6, 720 + (i % 4 === 0 ? 55 : 32)); c.stroke(); }
  arrow(c, [[80, 650], [940, 650]], COL.yellow, 18);
  star5(c, 975, 540, 40, COL.yellow, 5);
  arrow(c, [[260, 450], [260, 600]], RED, 10);
};

// ---------------------------------------------------------------- 20 expl.0 what light is: rays from the Sun, in straight lines, in every direction
const x0 = (c: Ctx) => {
  ground(c, DARK); stars(c, 12, 14, 20, 20, 1060, 1060);
  const sx = 540, sy = 300;
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + 0.2; line(c, [[sx + Math.cos(a) * 170, sy + Math.sin(a) * 170], [sx + Math.cos(a) * 250, sy + Math.sin(a) * 250]], 9, COL.yellow); }
  shape(c, () => ell(c, sx, sy, 130, 130), COL.yellow, 6); shade(c, () => ell(c, sx, sy, 130, 130), COL.orange, 30, 25, 0.5);
  // targets
  const plant = (x: number, y: number) => { shape(c, () => polyP(c, [[x - 60, y], [x + 60, y], [x + 45, y + 80], [x - 45, y + 80]]), "#c9743f", 6); line(c, [[x, y], [x, y - 80]], 9, COL.leafDk); leaf(c, x, y - 40, 80, -2.5); leaf(c, x, y - 60, 80, -0.6); };
  plant(190, 780); glass(c, 560, 880, 150, 190, 0.6); earth(c, 900, 790, 85);
  [[190, 640], [560, 690], [880, 700]].forEach(([x, y]) => { const a = Math.atan2(y - sy, x - sx); line(c, [[sx + Math.cos(a) * 270, sy + Math.sin(a) * 270], [x - Math.cos(a) * 0, y]], 9, COL.yellow); });
};

// ---------------------------------------------------------------- 21 expl.1 how fast light goes: a race
const x1 = (c: Ctx) => {
  ground(c, "#f6efe0");
  [180, 400, 620, 840].forEach((y) => { c.fillStyle = "#e8dcc2"; c.fillRect(0, y - 70, D, 140); line(c, [[0, y + 70], [D, y + 70]], 3, "#b7a98b"); });
  line(c, [[110, 100], [110, 980]], 7, RED);
  // snail
  shape(c, () => ell(c, 220, 190, 70, 20), "#e6c9a0", 5); shape(c, () => ell(c, 245, 150, 50, 50), "#c9743f", 6); line(c, [[180, 170], [165, 130]], 6); line(c, [[200, 172], [195, 128]], 6);
  // car
  shape(c, () => rrect(c, 330, 380, 250, 70, 18), COL.red, 6); shape(c, () => rrect(c, 380, 330, 130, 60, 18), COL.sky, 6);
  shape(c, () => ell(c, 395, 460, 30, 30), COL.black, 5); shape(c, () => ell(c, 520, 460, 30, 30), COL.black, 5);
  // jet
  shape(c, () => ell(c, 600, 620, 150, 28), WHITE, 6); shape(c, () => polyP(c, [[610, 620], [540, 520], [585, 520], [680, 620]]), COL.steel, 6); shape(c, () => polyP(c, [[470, 620], [440, 560], [470, 560], [510, 620]]), COL.blue, 6);
  // light
  c.fillStyle = "rgba(255,226,120,0.6)"; c.fillRect(150, 810, 800, 60);
  star5(c, 985, 840, 55, COL.yellow, 6);
  arrow(c, [[200, 840], [880, 840]], RED, 11);
};

// ---------------------------------------------------------------- 22 expl.2 sunlight is about 8 minutes old
const x2 = (c: Ctx) => {
  ground(c, DARK); stars(c, 17, 16, 20, 20, 1060, 1060);
  sunDisc(c, 150, 430, 95); earth(c, 920, 430, 80);
  c.fillStyle = "rgba(255,226,120,0.45)"; c.fillRect(300, 400, 520, 60);
  arrow(c, [[300, 430], [800, 430]], COL.yellow, 15);
  clock(c, 150, 760, 110, 0); clock(c, 920, 760, 110, 8);
  arrow(c, [[300, 760], [770, 760]], RED, 11);
  write(c, "8", 520, 600, 90, WHITE, 11);
};

// ---------------------------------------------------------------- 23 expl.3 sound needs air, light does not
const x3 = (c: Ctx) => {
  ground(c, "#f6efe0");
  c.fillStyle = DARK; c.fillRect(0, 560, D, 520); line(c, [[0, 560], [D, 560]], 6); stars(c, 5, 16, 20, 580, 1060, 1060);
  // a bell, air dots between it and the child
  shape(c, () => { c.moveTo(120, 300); c.quadraticCurveTo(120, 140, 200, 140); c.quadraticCurveTo(280, 140, 280, 300); c.closePath(); }, BRASS, 6);
  shape(c, () => ell(c, 200, 310, 90, 18), BRASS, 6); shape(c, () => ell(c, 200, 340, 20, 20), BRASSDK, 5);
  for (let k = 0; k < 2; k++) { c.beginPath(); c.arc(130 - k * 40, 230, 70 + k * 35, Math.PI * 0.7, Math.PI * 1.3); c.strokeStyle = COL.blueDk; c.lineWidth = 8; c.stroke(); }
  const r = rnd(4); for (let i = 0; i < 42; i++) shape(c, () => ell(c, 340 + r() * 380, 90 + r() * 400, 11, 11), COL.sky, 3.5);
  person(c, 880, 540, 380, {});
  for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(330 + k * 80, 300, 40, -0.9, 0.9); c.strokeStyle = COL.blueDk; c.lineWidth = 8; c.stroke(); }
  // the Sun and its beam crossing empty space
  sunDisc(c, 130, 810, 70); earth(c, 900, 810, 75);
  c.fillStyle = "rgba(255,226,120,0.45)"; c.fillRect(260, 785, 560, 50); arrow(c, [[260, 810], [800, 810]], COL.yellow, 14);
};

// ---------------------------------------------------------------- 24 expl.4 counting thunder
const x4 = (c: Ctx) => {
  ground(c, "#f1e3c5");
  shape(c, () => rrect(c, 100, 90, 880, 600, 16), "#2c2a4e", 10);
  cloud(c, 330, 250, 1.2); cloud(c, 720, 220, 0.9, "#7a7ea8");
  bolt(c, 520, 290, 1.2);
  line(c, [[540, 90], [540, 690]], 10); line(c, [[100, 390], [980, 390]], 10);
  shape(c, () => rrect(c, 80, 690, 920, 40, 8), COL.wood, 6);
  person(c, 300, 1040, 520, { armR: [-1.0, -1.7] });
  write(c, "1", 470, 800, 90, INK, 12); write(c, "2", 590, 800, 90, INK, 12); write(c, "3", 710, 800, 90, INK, 12);
  for (let k = 0; k < 2; k++) { c.beginPath(); c.arc(800 + k * 30, 540, 40 + k * 30, -0.7, 0.7); c.strokeStyle = WHITE; c.lineWidth = 8; c.stroke(); }
};

// ---------------------------------------------------------------- 25 expl.6 nothing goes faster than light
const x6 = (c: Ctx) => {
  ground(c, DARK); stars(c, 21, 22, 20, 20, 1060, 1060);
  // rocket straining behind
  c.save(); c.translate(250, 600); c.rotate(0);
  shape(c, () => polyP(c, [[-170, -35], [-80, -22], [-110, 0], [-80, 22], [-170, 35]]), COL.orange, 5);
  shape(c, () => polyP(c, [[-135, -20], [-80, -22], [-110, 0], [-80, 22], [-135, 20]]), COL.yellow, 0);
  shape(c, () => { c.moveTo(-80, -50); c.lineTo(100, -50); c.quadraticCurveTo(190, 0, 100, 50); c.lineTo(-80, 50); c.closePath(); }, COL.steelIn, 6);
  shape(c, () => ell(c, 40, 0, 26, 26), COL.sky, 5);
  shape(c, () => polyP(c, [[-70, -50], [-30, -100], [10, -50]]), COL.red, 5); shape(c, () => polyP(c, [[-70, 50], [-30, 100], [10, 50]]), COL.red, 5);
  c.restore();
  line(c, [[330, 740], [420, 740]], 7, "#9a95c8"); line(c, [[350, 780], [440, 780]], 7, "#9a95c8");
  // the beam far ahead
  c.fillStyle = "rgba(255,226,120,0.55)"; c.fillRect(600, 585, 420, 30);
  star5(c, 1000, 600, 48, COL.yellow, 6); arrow(c, [[600, 600], [920, 600]], COL.yellow, 12);
  // a sign: no further
  shape(c, () => ell(c, 780, 270, 110, 110), WHITE, 6); c.beginPath(); ell(c, 780, 270, 88, 88); c.strokeStyle = RED; c.lineWidth = 22; c.stroke();
  write(c, "3", 755, 235, 70, INK, 11);
  line(c, [[780, 380], [780, 480]], 12);
};

// ---------------------------------------------------------------- 26 expl.8 wave or particle
const x8 = (c: Ctx) => {
  ground(c, "#f6efe0");
  line(c, [[540, 80], [540, 560]], 5, "#b7a98b"); line(c, [[40, 560], [1040, 560]], 5, "#b7a98b");
  // wave side: ripples
  shape(c, () => ell(c, 290, 330, 210, 210), COL.water, 6);
  [60, 115, 170].forEach((r, i) => { c.beginPath(); ell(c, 290, 330, r, r); c.strokeStyle = WHITE; c.lineWidth = 9; c.globalAlpha = 1 - i * 0.25; c.stroke(); }); c.globalAlpha = 1;
  // particle side: thrown grains
  const rr = rnd(3); for (let i = 0; i < 26; i++) { const t = rr(), x = 640 + t * 340, y = 330 + (rr() - 0.5) * (40 + t * 280); shape(c, () => ell(c, x, y, 12, 12), COL.orange, 4); }
  shape(c, () => rrect(c, 580, 290, 60, 80, 10), COL.steelDk, 5);
  // the beam of light is both
  torch(c, 60, 810, 0, 1.0);
  waveLine(c, 290, 810, 1010, 810, 55, 140, 10, COL.blue);
  for (let i = 0; i < 6; i++) { const x = 340 + i * 120; shape(c, () => ell(c, x, 810 - Math.sin(((x - 290) / 140) * Math.PI * 2) * 55, 17, 17), COL.yellow, 4); }
};

// ---------------------------------------------------------------- 27 expl.9 photons: light comes in packets
const x9 = (c: Ctx) => {
  ground(c, "#f6efe0");
  line(c, [[540, 80], [540, 1000]], 5, "#b7a98b");
  // sugar heap and a close-up of its grains
  shadow(c, 270, 520, 200, 24);
  shape(c, () => { c.moveTo(70, 500); c.quadraticCurveTo(270, 190, 470, 500); c.closePath(); }, WHITE, 6);
  shade(c, () => { c.moveTo(70, 500); c.quadraticCurveTo(270, 190, 470, 500); c.closePath(); }, "#dcd6c8", 60, 30, 0.6);
  shape(c, () => ell(c, 270, 800, 190, 190), "#fffdf6", 8);
  const r = rnd(11); c.save(); c.beginPath(); ell(c, 270, 800, 190, 190); c.clip();
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 170; shape(c, () => rrect(c, 270 + Math.cos(a) * d - 17, 800 + Math.sin(a) * d - 17, 34, 34, 6), WHITE, 3.5); }
  c.restore(); shape(c, () => ell(c, 270, 800, 190, 190), "rgba(0,0,0,0)", 8);
  arrow(c, [[270, 530], [270, 600]], RED, 9);
  // torch beam and a close-up of its photons
  torch(c, 600, 290, 0, 0.9);
  beam(c, [[790, 270], [1030, 180], [1030, 400], [790, 310]], 0.4);
  shape(c, () => ell(c, 810, 800, 190, 190), "#2a2650", 8);
  const q = rnd(12); c.save(); c.beginPath(); ell(c, 810, 800, 190, 190); c.clip();
  for (let i = 0; i < 28; i++) { const a = q() * 6.28, d = Math.sqrt(q()) * 170; shape(c, () => ell(c, 810 + Math.cos(a) * d, 800 + Math.sin(a) * d, 17, 17), COL.yellow, 3.5); }
  c.restore(); shape(c, () => ell(c, 810, 800, 190, 190), "rgba(0,0,0,0)", 8);
  arrow(c, [[860, 440], [830, 590]], RED, 9);
};

// ---------------------------------------------------------------- 28 expl.10 where light comes from: an electron drops and a photon leaves
const x10 = (c: Ctx) => {
  ground(c, DARK);
  [330, 210].forEach((r, i) => { c.beginPath(); c.arc(430, 500, r, 0, Math.PI * 2); c.strokeStyle = "#8f8bd0"; c.lineWidth = 5; c.stroke(); });
  shape(c, () => ell(c, 430, 500, 60, 60), COL.red, 6); shape(c, () => ell(c, 400, 480, 22, 22), COL.pink, 0);
  shape(c, () => ell(c, 663, 267, 34, 34), "rgba(91,143,214,0.35)", 0);
  c.setLineDash([12, 12]); c.beginPath(); c.arc(663, 267, 34, 0, Math.PI * 2); c.strokeStyle = "#8f8bd0"; c.lineWidth = 6; c.stroke(); c.setLineDash([]);
  shape(c, () => ell(c, 579, 351, 34, 34), COL.blue, 6);
  arrow(c, [[650, 300], [610, 335]], RED, 11);
  waveLine(c, 620, 390, 900, 700, 22, 60, 10, COL.yellow); sparkle(c, 950, 760, 46);
  // a hot glowing rod
  shape(c, () => rrect(c, 40, 880, 460, 60, 26), "#b1b6c4", 6);
  shape(c, () => rrect(c, 40, 880, 300, 60, 26), COL.red, 6); shape(c, () => rrect(c, 40, 892, 260, 20, 10), COL.orange, 0);
};

// ---------------------------------------------------------------- 29 expl.11 the long journey out of the Sun
const x11 = (c: Ctx) => {
  ground(c, DARK); stars(c, 31, 14, 520, 20, 1060, 1060);
  shape(c, () => ell(c, 330, 540, 300, 300), COL.orange, 8); shape(c, () => ell(c, 330, 540, 230, 230), COL.yellow, 5);
  shape(c, () => ell(c, 330, 540, 105, 105), "#fff6c8", 5);
  const pts: number[][] = [[330, 540], [400, 470], [360, 400], [450, 390], [410, 340], [330, 350], [270, 430], [200, 390], [175, 490], [255, 545], [210, 620], [310, 665], [400, 600], [470, 640], [525, 560], [470, 500]];
  pts.push([330 + 230 * Math.cos(-0.45), 540 + 230 * Math.sin(-0.45)]);
  line(c, pts, 9, RED);
  arrow(c, [[330 + 300 * Math.cos(-0.45) + 20, 540 + 300 * Math.sin(-0.45)], [850, 310]], COL.yellow, 14);
  earth(c, 940, 300, 70);
  clock(c, 800, 720, 90, 8);
};

export const ic_lightWhatIsLightL3 = cards("sci.light.what-is-light.L3 cards", [
  intro, summary, e1, e2, e3, a1, a3, a4, a6, a7, p1, c1, c2, t0, t1, t4, t5, t7, t9, t12, x0, x1, x2, x3, x4, x6, x8, x9, x10, x11,
]);
