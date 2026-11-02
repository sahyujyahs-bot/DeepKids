import type { Ctx } from "./core";
import { INK, RED, COL, WHITE, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, person, write, plate, bowl, leaf, rnd, cards } from "./flatKit";

// SYMMETRY IN NATURE (level 3) · flat cards for the experiments, activities, project, challenges, terms and explanations.
const TWO = Math.PI * 2, NONE = "rgba(255,255,255,0)", FLOOR = "#2f2a4a", SOAP = "#d3edf3";
const pol = (cx: number, cy: number, r: number, a: number): number[] => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 24) => Array.from({ length: n + 1 }, (_, i) => pol(cx, cy, r, a0 + ((a1 - a0) * i) / n));
const hexV = (x: number, y: number, R: number, a0 = -Math.PI / 2) => Array.from({ length: 6 }, (_, k) => pol(x, y, R, a0 + (k * Math.PI) / 3));
const dash = (c: Ctx, pts: number[][], col: string = COL.purple, w = 8) => { c.save(); c.setLineDash([18, 14]); line(c, pts, w, col); c.restore(); };
const fat = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const rose = (cx: number, cy: number, R: number, n: number, a0 = 0, a1 = TWO, k = 0.6, m = 0.4, N = 180) =>
  Array.from({ length: N + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / N, r = R * (k + m * Math.cos(n * t)); return pol(cx, cy, r, t); });
const dot = (c: Ctx, x: number, y: number, r: number, col: string, ln = 0) => shape(c, () => ell(c, x, y, r, r), col, ln);
const kolamDots = (c: Ctx, x: number, y: number, g: number, col: string = WHITE, r = 7) => { for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (Math.abs(i) + Math.abs(j) <= 2) dot(c, x + i * g, y + j * g, r, col); };

// ---- things
// n identical blades round a hub (a fan, a pinwheel head from the front); mark = a yellow dot on blade 0
const blades = (c: Ctx, x: number, y: number, n: number, R: number, rot: number, col: string = COL.wood, mark = false) => {
  for (let k = 0; k < n; k++) { const a = rot + (k * TWO) / n, [bx, by] = pol(x, y, R * 0.55, a); shape(c, () => ell(c, bx, by, R * 0.5, R * 0.2, a), col, 6); }
  dot(c, x, y, R * 0.16, COL.steel, 5);
  if (mark) { const [mx, my] = pol(x, y, R * 0.78, rot); dot(c, mx, my, R * 0.1, COL.yellow, 4); }
};
// an n-petalled flower seen from the front; mark = a dark dot on the petal that points along rot
const flower = (c: Ctx, x: number, y: number, n: number, R: number, col: string, rot = -Math.PI / 2, mark = false) => {
  const pw = Math.min(R * 0.34, R * Math.sin(Math.PI / n) * 0.62);
  for (let k = 0; k < n; k++) { const a = rot + (k * TWO) / n, [px, py] = pol(x, y, R * 0.58, a); shape(c, () => ell(c, px, py, R * 0.42, pw, a), col, 6); }
  dot(c, x, y, R * 0.2, COL.yellow, 5);
  if (mark) { const [mx, my] = pol(x, y, R * 0.78, rot); dot(c, mx, my, R * 0.09, COL.purple, 4); }
};
const butterfly = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sx of [-1, 1]) {
    c.save(); c.scale(sx, 1);
    shape(c, () => { c.moveTo(10, -10); c.bezierCurveTo(130, -190, 270, -130, 245, -30); c.bezierCurveTo(230, 30, 90, 20, 10, 10); c.closePath(); }, COL.orange, 6);
    shape(c, () => { c.moveTo(10, 10); c.bezierCurveTo(120, 20, 200, 60, 175, 125); c.bezierCurveTo(150, 175, 40, 150, 10, 45); c.closePath(); }, COL.yellow, 6);
    dot(c, 150, -75, 28, COL.paper, 4); dot(c, 118, 95, 20, COL.red, 4);
    c.restore();
  }
  line(c, [[-8, -92], [-40, -150]], 5); line(c, [[8, -92], [40, -150]], 5);
  shape(c, () => ell(c, 0, 10, 15, 85), COL.black, 5); dot(c, 0, -85, 18, COL.black, 5);
  c.restore();
};
const heartP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y + 150 * s); c.bezierCurveTo(x - 260 * s, y - 10 * s, x - 150 * s, y - 190 * s, x, y - 60 * s); c.bezierCurveTo(x + 150 * s, y - 190 * s, x + 260 * s, y - 10 * s, x, y + 150 * s); c.closePath(); };
const lobedP = (c: Ctx, x: number, y: number, R: number, n: number, amp: number) => polyP(c, Array.from({ length: 120 }, (_, i) => { const a = (i / 120) * TWO - Math.PI / 2; return pol(x, y, R * (1 + amp * Math.cos(n * (a + Math.PI / 2))), a); }));
const bubble = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), SOAP, 4);
  c.beginPath(); c.ellipse(x, y, rx * 0.68, ry * 0.68, 0, Math.PI * 1.1, Math.PI * 1.55); c.strokeStyle = WHITE; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
};
const snow = (c: Ctx, x: number, y: number, R: number, col: string) => {
  const parts: number[][][] = [];
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + (k * TWO) / 6; parts.push([[x, y], pol(x, y, R, a)]);
    for (const t of [0.4, 0.65, 0.85]) for (const s of [-1, 1]) { const b = pol(x, y, R * t, a); parts.push([b, pol(b[0], b[1], R * 0.3 * (1.05 - t) * 1.4, a + s * 1.05)]); }
  }
  parts.forEach((p) => line(c, p, 22, INK)); parts.forEach((p) => line(c, p, 12, col));
};
const hexTiles = (c: Ctx, x0: number, y0: number, x1: number, y1: number, R: number, cols: string[]) => {
  const w = Math.sqrt(3) * R;
  for (let row = -1; row < (y1 - y0) / (1.5 * R) + 1; row++) for (let col = -1; col < (x1 - x0) / w + 1; col++) shape(c, () => polyP(c, hexV(x0 + (col + 0.5 * (row & 1)) * w + w / 2, y0 + row * 1.5 * R + R, R * 0.98)), cols[(((row + col) % 3) + 3) % 3], 5);
};
const tick = (c: Ctx, x: number, y: number) => { dot(c, x, y, 52, WHITE, 5); line(c, [[x - 24, y + 2], [x - 6, y + 22], [x + 28, y - 20]], 12, COL.green); };
const cross = (c: Ctx, x: number, y: number) => { dot(c, x, y, 52, WHITE, 5); line(c, [[x - 22, y - 22], [x + 22, y + 22]], 12, RED); line(c, [[x + 22, y - 22], [x - 22, y + 22]], 12, RED); };

// ---- experiments
const e1 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 520;
  shadow(c, cx + 30, cy + 40, 390, 380);
  shape(c, () => ell(c, cx, cy, 380, 380), COL.steel); shape(c, () => ell(c, cx, cy, 335, 335), COL.steelIn, 4); shape(c, () => ell(c, cx, cy, 305, 305), "#cfe6f1", 4);
  const R = 46, w = Math.sqrt(3) * R, r = rnd(5), cells: number[][] = [];
  for (let row = -5; row <= 5; row++) for (let col = -5; col <= 5; col++) { const px = cx + (col + 0.5 * (row & 1)) * w, py = cy + row * 1.5 * R, d = Math.hypot(px - cx, py - cy); if (d <= 255) cells.push([px, py, d]); }
  cells.filter((q) => q[2] > 175).forEach(([px, py]) => bubble(c, px, py, R * (0.82 + r() * 0.1), R * (0.74 + r() * 0.1)));
  cells.filter((q) => q[2] <= 175).forEach(([px, py], i) => { shape(c, () => polyP(c, hexV(px, py, R * 0.98)), i % 2 ? SOAP : "#c4e4ee", 4); });
  line(c, [[905, 960], [735, 720]], 36, INK); line(c, [[905, 960], [735, 720]], 24, COL.pink); line(c, [[880, 925], [850, 883]], 24, WHITE);
};
const e2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 470, 40);
  shape(c, () => rrect(c, 60, 240, 960, 570, 40), COL.wood, 6);
  const okra = (x: number, y: number, R: number) => {
    shape(c, () => lobedP(c, x, y, R, 5, 0.1), "#8fbf55", 6);
    shape(c, () => lobedP(c, x, y, R * 0.76, 5, 0.1), "#e3edbc", 0);
    for (let k = 0; k < 5; k++) { const [sx, sy] = pol(x, y, R * 0.46, -Math.PI / 2 + (k * TWO) / 5); dot(c, sx, sy, R * 0.15, "#b9d36a", 3); }
    dot(c, x, y, R * 0.07, "#b9d36a", 3);
  };
  const lemon = (x: number, y: number, R: number) => {
    dot(c, x, y, R, COL.yellow, 6); dot(c, x, y, R * 0.9, "#fbf3c4", 0);
    for (let k = 0; k < 10; k++) { const a0 = (k * TWO) / 10 + 0.05, a1 = ((k + 1) * TWO) / 10 - 0.05; shape(c, () => { c.moveTo(...(pol(x, y, R * 0.12, (a0 + a1) / 2) as [number, number])); c.arc(x, y, R * 0.82, a0, a1); c.closePath(); }, "#f7e36a", 3); }
  };
  const star = (x: number, y: number, R: number) => {
    const sp = (rr: number) => polyP(c, Array.from({ length: 120 }, (_, i) => { const a = (i / 120) * TWO - Math.PI / 2; return pol(x, y, rr * (0.72 + 0.28 * Math.cos(5 * (a + Math.PI / 2))), a); }));
    shape(c, () => sp(R), "#d9d94a", 6); shape(c, () => sp(R * 0.62), "#f1ecaa", 0); dot(c, x, y, R * 0.08, "#d9d94a", 3);
  };
  okra(230, 480, 130); lemon(540, 480, 130); star(850, 480, 140);
  write(c, "5", 217, 650, 80, INK, 10); write(c, "10", 510, 650, 80, INK, 10); write(c, "5", 837, 650, 80, INK, 10);
};

// ---- activities
const a1 = (c: Ctx) => {
  ground(c);
  const hp = () => heartP(c, 290, 560, 0.78);
  shadow(c, 320, 730, 190, 24);
  shape(c, hp, COL.pink, 6);
  c.save(); c.beginPath(); hp(); c.clip(); c.fillStyle = "#d9708f"; c.fillRect(290, 0, 400, 1080); c.restore();
  shape(c, hp, NONE, 6);
  dash(c, [[290, 330], [290, 760]]);
  arrow(c, [[200, 360], [235, 300], [290, 275], [345, 300], [380, 360]]);
  shadow(c, 800, 770, 200, 24);
  flower(c, 790, 560, 4, 175, COL.pink, -Math.PI / 2, true);
  arrow(c, arcPts(790, 560, 235, -2.5, -0.9));
};
const a2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 100, 900, 880, 24), COL.paper, 5);
  const cx = 540, cy = 540, R = 300;
  for (const [a0, a1b] of [[0, Math.PI / 2], [Math.PI / 2, Math.PI], [Math.PI, Math.PI * 1.5]]) { c.save(); c.setLineDash([4, 14]); line(c, rose(cx, cy, R, 4, a0, a1b), 7, COL.grey); c.restore(); }
  dash(c, [[540, 140], [540, 940]]); dash(c, [[140, 540], [940, 540]]);
  kolamDots(c, cx, cy, 108, INK, 9);
  fat(c, rose(cx, cy, R, 4, -Math.PI / 2, 0), 12, COL.blue);
  c.save(); c.translate(842, 548); c.rotate(1.0);
  shape(c, () => polyP(c, [[0, 0], [55, -19], [55, 19]]), "#f3d9a8", 5); shape(c, () => polyP(c, [[0, 0], [16, -6], [16, 6]]), INK, 0);
  shape(c, () => rrect(c, 55, -19, 180, 38, 4), COL.yellow, 5); shape(c, () => rrect(c, 235, -19, 44, 38, 8), COL.pink, 5);
  c.restore();
};
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 280, 880, 120, 20);
  shape(c, () => polyP(c, [[150, 320], [390, 320], [270, 860]]), COL.paper, 6);
  line(c, [[270, 860], [270, 320]], 4, COL.grey);
  for (const [y, w] of [[480, 0.12], [620, 0.2]] as number[][]) { const hw = 120 * (1 - (y - 320) / 540); dash(c, [[270 - hw, y], [270 - hw + 70, y + 30]], RED, 8); dash(c, [[270 + hw, y], [270 + hw - 70, y + 30]], RED, 8); void w; }
  arrow(c, [[420, 580], [545, 580]]);
  shape(c, () => rrect(c, 570, 330, 420, 420, 30), COL.blue, 6);
  snow(c, 780, 540, 185, WHITE);
};
const a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 995, 180, 24);
  person(c, 540, 990, 760, { armL: [Math.PI * 0.62, Math.PI * 0.55], armR: [Math.PI * 0.38, Math.PI * 0.45] });
  dash(c, [[540, 120], [540, 1030]], COL.purple, 8);
  arrow(c, [[200, 520], [400, 520]]); arrow(c, [[880, 520], [680, 520]]);
};
const a6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 110, 480, 710, 16), COL.woodDk, 6);
  shape(c, () => rrect(c, 90, 140, 420, 650, 6), COL.sky, 5);
  for (let k = 0; k < 8; k++) { const [x1, y1] = pol(215, 270, 100, (k * TWO) / 8), [x2, y2] = pol(215, 270, 135, (k * TWO) / 8); line(c, [[x1, y1], [x2, y2]], 9, COL.orange); }
  dot(c, 215, 270, 72, COL.yellow, 6);
  line(c, [[300, 140], [300, 790]], 8); line(c, [[90, 465], [510, 465]], 8);
  c.globalAlpha = 0.55; for (const [y1, y2] of [[300, 380], [380, 450], [450, 520]]) line(c, [[480, y1], [640, y2]], 26, COL.yellow); c.globalAlpha = 1;
  shape(c, () => rrect(c, 30, 800, 1020, 60, 12), COL.wood, 6);
  shadow(c, 830, 868, 130, 16);
  shape(c, () => polyP(c, [[720, 800], [880, 800], [855, 665], [745, 665]]), "#c9703a", 6);
  shape(c, () => rrect(c, 705, 640, 190, 42, 12), "#d98445", 6);
  const stem = [[800, 650], [790, 540], [725, 440], [625, 385]];
  fat(c, stem, 14, COL.leafDk);
  leaf(c, 795, 560, 120, -2.7); leaf(c, 790, 545, 100, -0.35); leaf(c, 735, 460, 110, -2.1); leaf(c, 730, 465, 90, -0.2); leaf(c, 625, 385, 125, -2.8);
};
const p1 = (c: Ctx) => {
  ground(c);
  const T = [[120, 120], [560, 120], [120, 560], [560, 560]];
  T.forEach(([x, y], i) => {
    shape(c, () => rrect(c, x, y, 400, 400, 28), FLOOR, 6);
    const cx = x + 200, cy = y + 205, R = 140;
    kolamDots(c, cx, cy, 50, "rgba(255,255,255,0.7)", 6);
    let pts: number[][][];
    if (i === 0) { const Rp = 100; pts = [Array.from({ length: 120 }, (_, k) => { const t = (k / 119) * TWO, r = Rp * (1 - Math.sin(t)); return [cx + r * Math.cos(t), cy + 0.95 * Rp + r * Math.sin(t)]; })]; }
    else if (i === 1) { const arm = (o: number) => Array.from({ length: 60 }, (_, k) => { const t = k / 59; return pol(cx, cy, R * (0.12 + 0.88 * t), -0.5 + o + t * 3.6); }); pts = [arm(0), arm(Math.PI)]; }
    else pts = [rose(cx, cy, R, i === 2 ? 4 : 6)];
    pts.forEach((p) => line(c, p, 10, WHITE));
    write(c, String(i + 1), x + 24, y + 22, 46, COL.yellow, 8);
  });
};

// ---- challenges
const c1 = (c: Ctx) => {
  ground(c);
  const cx = 520, cy = 400;
  shadow(c, 560, 990, 70, 14);
  fat(c, [[cx, cy], [cx, 960]], 30, COL.wood);
  const col = [COL.red, COL.yellow, COL.teal, COL.blue];
  for (let k = 0; k < 4; k++) { c.save(); c.translate(cx, cy); c.rotate((k * Math.PI) / 2); shape(c, () => polyP(c, [[0, 0], [0, -190], [190, -190]]), col[k], 6); shape(c, () => polyP(c, [[0, 0], [190, -190], [95, -60]]), "rgba(255,255,255,0.35)", 0); c.restore(); }
  dot(c, cx, cy, 20, COL.red, 5); dot(c, cx - 6, cy - 6, 6, WHITE);
  arrow(c, [[60, 320], [130, 290], [215, 315]]); arrow(c, [[50, 420], [225, 420]]); arrow(c, [[60, 530], [130, 555], [215, 525]]);
  arrow(c, arcPts(cx, cy, 310, -1.25, -0.1));
};
const c2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 150, 70, 780, 420, 24), "#6a4128", 6);
  for (let r = 0; r < 3; r++) for (let q = 0; q < 7; q++) dot(c, 210 + q * 110, 170 + r * 110, 48, COL.teal, 5);
  cross(c, 880, 120);
  c.save(); c.beginPath(); rrect(c, 150, 580, 780, 420, 24); c.clip(); hexTiles(c, 150, 580, 930, 1000, 54, [COL.teal, COL.yellow, COL.pink]); c.restore();
  shape(c, () => rrect(c, 150, 580, 780, 420, 24), NONE, 6);
  tick(c, 880, 630);
};

// ---- terms
const t0 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 540, 330, 330);
  dot(c, 540, 540, 235, COL.steel, 5); dot(c, 540, 540, 160, COL.steelIn, 4);
  for (let k = 0; k < 12; k++) { const [x, y] = pol(540, 540, 197, (k * TWO) / 12); dot(c, x, y, 10, COL.steelDk, 3); }
  bowl(c, 540, 520, 80);
  arrow(c, arcPts(540, 540, 395, -2.4, -0.7));
};
const t1 = (c: Ctx) => {
  ground(c);
  const hp = () => heartP(c, 540, 520, 1.5);
  shadow(c, 570, 880, 380, 26);
  shape(c, hp, COL.pink, 6);
  c.save(); c.beginPath(); hp(); c.clip(); c.fillStyle = "#d9708f"; c.fillRect(540, 0, 600, 1080); c.restore();
  shape(c, hp, NONE, 6);
  dash(c, [[540, 180], [540, 900]], COL.purple, 10);
};
const t2 = (c: Ctx) => {
  ground(c);
  fat(c, [[130, 800], [290, 280]], 62, COL.blue); fat(c, [[450, 800], [290, 280]], 62, COL.blue); fat(c, [[190, 620], [390, 620]], 46, COL.blue);
  dash(c, [[290, 200], [290, 880]], COL.purple, 8);
  shape(c, () => rrect(c, 580, 340, 360, 360, 14), COL.yellow, 6);
  dash(c, [[580, 520], [940, 520]], COL.purple, 7); dash(c, [[760, 330], [760, 710]], COL.purple, 7); dash(c, [[570, 330], [950, 710]], COL.purple, 7); dash(c, [[950, 330], [570, 710]], COL.purple, 7);
};
const t3 = (c: Ctx) => {
  ground(c);
  const x = 540, y = 540, R = 270;
  shadow(c, x + 30, y + 40, R + 10, R);
  dot(c, x, y, R, COL.black, 6); dot(c, x, y, R * 0.84, COL.steel, 5); dot(c, x, y, R * 0.74, COL.paper, 4);
  for (let k = 0; k < 6; k++) fat(c, [[x, y], pol(x, y, R * 0.76, (k * TWO) / 6 - Math.PI / 2)], 10, COL.steelDk);
  dot(c, x, y, 34, COL.steel, 5);
  const [mx, my] = pol(x, y, R * 0.55, -Math.PI / 2); dot(c, mx, my, 20, COL.yellow, 4);
  arrow(c, arcPts(x, y, R + 70, -2.4, -0.7));
};
const t4 = (c: Ctx) => {
  ground(c);
  [190, 420, 650, 880].forEach((x, k) => { shadow(c, x + 12, 600, 90, 14); flower(c, x, 480, 4, 105, COL.pink, -Math.PI / 2 + (k * Math.PI) / 2, true); });
  [305, 535, 765].forEach((x) => arrow(c, [[x - 28, 480], [x + 28, 480]], RED, 9));
  write(c, "4", 490, 700, 230, INK, 22);
};
const t5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 300, 24);
  flower(c, 540, 520, 6, 330, COL.pink, -Math.PI / 2);
  dot(c, 540, 520, 34, RED, 5);
  dash(c, [[540, 520], [540, 215]], COL.purple, 9);
  const [x1, y1] = pol(540, 520, 305, -Math.PI / 2 + TWO / 6 * 2); dash(c, [[540, 520], [x1, y1]], COL.purple, 9);
};
const t6 = (c: Ctx) => {
  ground(c);
  const R = 100, w = Math.sqrt(3) * R, cx = 540, cy = 520, cells: number[][] = [];
  for (let row = -3; row <= 3; row++) for (let col = -3; col <= 3; col++) { const px = cx + (col + 0.5 * (row & 1)) * w, py = cy + row * 1.5 * R; if (Math.hypot(px - cx, py - cy) <= 285) cells.push([px, py]); }
  cells.forEach(([px, py]) => shape(c, () => polyP(c, hexV(px, py, R * 0.98)), COL.yellow, 7));
  shape(c, () => polyP(c, hexV(cx, cy, R * 0.98)), COL.paper, 10);
  hexV(cx, cy, R * 0.98).forEach(([x, y]) => dot(c, x, y, 14, RED, 4));
};
const t7 = (c: Ctx) => {
  ground(c);
  fat(c, [[460, 640], [690, 960]], 34, COL.steelDk);
  const rx = 250, ry = 250, cx = 440, cy = 400;
  shape(c, () => ell(c, cx, cy, rx, ry), "rgba(214,236,250,0.75)", 0);
  c.save(); c.beginPath(); ell(c, cx, cy, rx, ry); c.clip();
  c.globalAlpha = 0.6; for (const [dy, col] of [[-110, COL.pink], [-20, COL.yellow], [70, COL.teal]] as [number, string][]) line(c, [[cx - 230, cy + dy], [cx - 100, cy + dy - 40], [cx + 60, cy + dy + 30], [cx + 230, cy + dy - 20]], 40, col);
  c.restore(); c.globalAlpha = 1;
  c.beginPath(); ell(c, cx, cy, rx, ry); c.strokeStyle = INK; c.lineWidth = 32; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 20; c.stroke();
  shine(c, [[cx - 140, cy - 130], [cx - 60, cy - 190]], 12);
  bubble(c, 830, 260, 120, 120); bubble(c, 880, 560, 55, 55);
};
const t8 = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(165, 520); c.bezierCurveTo(165, 580, 80, 640, 80, 720); c.bezierCurveTo(80, 800, 250, 800, 250, 720); c.bezierCurveTo(250, 640, 165, 580, 165, 520); c.closePath(); }, COL.water, 6);
  shine(c, [[125, 700], [130, 750]], 9);
  arrow(c, [[272, 660], [362, 660]]);
  dot(c, 680, 520, 300, COL.paper, 6);
  line(c, [[680, 450], [551, 550]], 24, INK); line(c, [[680, 450], [809, 550]], 24, INK); line(c, [[680, 450], [551, 550]], 14, COL.steel); line(c, [[680, 450], [809, 550]], 14, COL.steel);
  dot(c, 680, 450, 100, COL.red, 6); dot(c, 551, 550, 58, WHITE, 6); dot(c, 809, 550, 58, WHITE, 6);
  shine(c, [[640, 410], [660, 390]], 10);
};
const t12 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4d9b0"; c.fillRect(0, 0, 1080, 640); line(c, [[0, 640], [1080, 640]], 5);
  shape(c, () => rrect(c, 330, 90, 420, 540, 14), COL.woodDk, 6);
  shape(c, () => rrect(c, 365, 125, 350, 505, 8), COL.brown, 6);
  shape(c, () => rrect(c, 395, 160, 130, 190, 6), "#bf8650", 5); shape(c, () => rrect(c, 555, 160, 130, 190, 6), "#bf8650", 5);
  shape(c, () => rrect(c, 395, 390, 130, 190, 6), "#bf8650", 5); shape(c, () => rrect(c, 555, 390, 130, 190, 6), "#bf8650", 5);
  dot(c, 540, 380, 16, COL.yellow, 4);
  shape(c, () => polyP(c, [[260, 640], [820, 640], [870, 710], [210, 710]]), COL.grey, 6);
  c.fillStyle = FLOOR; c.fillRect(0, 710, 1080, 370); line(c, [[0, 710], [1080, 710]], 6);
  c.save(); c.translate(480, 895); c.scale(1, 0.58);
  kolamDots(c, 0, 0, 80, "rgba(255,255,255,0.75)", 8);
  line(c, rose(0, 0, 290, 4), 11, WHITE);
  c.restore();
  bowl(c, 930, 900, 75, WHITE);
};

// ---- explanations
const x0 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 790, 210, 22);
  butterfly(c, 290, 520, 0.95);
  dash(c, [[290, 230], [290, 800]]);
  arrow(c, [[215, 215], [250, 160], [290, 140], [330, 160], [365, 215]]);
  shadow(c, 800, 790, 200, 22);
  blades(c, 790, 520, 3, 215, -Math.PI / 2, COL.wood, true);
  arrow(c, arcPts(790, 520, 280, -2.5, -0.9));
};
const x1 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x, k) => { shadow(c, x + 14, 620, 110, 14); blades(c, x, 470, 3, 135, -Math.PI / 2 + (k * TWO) / 3, COL.wood, true); write(c, String(k + 1), x - 20, 700, 110, INK, 14); });
  arrow(c, [[335, 470], [395, 470]], RED, 10); arrow(c, [[685, 470], [745, 470]], RED, 10);
};
const x2 = (c: Ctx) => {
  ground(c);
  const R = 120, w = Math.sqrt(3) * R, cx = 540, cy = 540, cells: number[][] = [[cx, cy]];
  for (let k = 0; k < 6; k++) cells.push(pol(cx, cy, w, (k * Math.PI) / 3));
  cells.forEach(([px, py], i) => shape(c, () => polyP(c, hexV(px, py, R * 0.98)), i ? SOAP : "#c4e4ee", 7));
  const vs = hexV(cx, cy, R * 0.98), [jx, jy] = vs[1];
  for (const a of [-Math.PI / 6, Math.PI / 2, (Math.PI * 7) / 6]) line(c, [[jx, jy], pol(jx, jy, R * 0.98, a)], 14, RED);
  dot(c, jx, jy, 20, RED, 5);
};
const x6 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 200, 22);
  shape(c, () => { c.moveTo(540, 170); c.bezierCurveTo(400, 230, 320, 380, 350, 600); c.bezierCurveTo(370, 760, 460, 850, 540, 890); c.bezierCurveTo(640, 850, 760, 760, 780, 580); c.bezierCurveTo(800, 380, 700, 220, 540, 170); c.closePath(); }, COL.leaf, 6);
  c.save(); c.beginPath(); c.moveTo(540, 170); c.bezierCurveTo(400, 230, 320, 380, 350, 600); c.bezierCurveTo(370, 760, 460, 850, 540, 890); c.closePath(); c.clip(); c.fillStyle = COL.leafDk; c.globalAlpha = 0.3; c.fillRect(0, 0, 540, 1080); c.restore(); c.globalAlpha = 1;
  fat(c, [[540, 170], [540, 890], [540, 990]], 10, COL.leafDk);
  for (const [y, l] of [[330, 130], [450, 160], [570, 170], [690, 140]] as number[][]) { line(c, [[540, y + 40], [540 - l, y - 30]], 6, COL.leafDk); line(c, [[540, y + 40], [540 + l + 15, y - 30]], 6, COL.leafDk); }
  dot(c, 430, 700, 20, BG_HOLE, 5); dot(c, 665, 365, 26, BG_HOLE, 5);
  dash(c, [[540, 130], [540, 880]], COL.purple, 7);
  c.beginPath(); ell(c, 665, 365, 50, 50); c.save(); c.setLineDash([10, 10]); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); c.restore();
  c.beginPath(); ell(c, 430, 700, 44, 44); c.save(); c.setLineDash([10, 10]); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); c.restore();
};
const BG_HOLE = "#efe4cf";
const x7 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 190, 900, 850, 36), FLOOR, 6);
  const cx = 540, cy = 660, R = 290;
  kolamDots(c, cx, cy, 104, "rgba(255,255,255,0.7)", 8);
  line(c, rose(cx, cy, R, 4), 11, WHITE);
  line(c, rose(cx, cy, R, 4, -Math.PI / 2, 0), 15, COL.yellow);
  arrow(c, [[660, 340], [620, 290], [540, 268], [460, 290], [420, 340]], RED, 12);
  arrow(c, [[925, 480], [958, 570], [925, 660]], RED, 12);
};

export const ic_patternsSymmetrySymmetryInNatureL3 = cards("sci.patterns-symmetry.symmetry-in-nature.L3 cards", [e1, e2, a1, a2, a3, a5, a6, p1, c1, c2, t0, t1, t2, t3, t4, t5, t6, t7, t8, t12, x0, x1, x2, x6, x7]);
