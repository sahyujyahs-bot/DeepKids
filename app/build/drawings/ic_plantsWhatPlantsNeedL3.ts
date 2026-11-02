import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, write, person, hand, cards } from "./flatKit";

// PICTURES FOR THE CARDS · sci.plants.what-plants-need.L3 · flat kit
const PALE = "#f3e7a0", DRY = "#c9a37a", YEL = "#cfc65a", TERRA = "#d9774a", DARK = "#2a2438";

const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 0.3, y - s * 0.6, x + s, y + s * 0.2); c.arc(x, y + s * 0.2, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.3, y - s * 0.6, x, y - s * 1.5); c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => dropP(c, x, y, s), COL.water, Math.max(3, s * 0.12)); shine(c, [[x - s * 0.45, y - s * 0.1], [x - s * 0.4, y + s * 0.4]], Math.max(3, s * 0.18)); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, p = [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]]; line(c, p, 18, INK); line(c, p, 9, COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.2, -r * 0.2, 0.6);
};
const beam = (c: Ctx, pts: number[][], a = 0.3) => { c.beginPath(); polyP(c, pts); c.fillStyle = `rgba(255,211,77,${a})`; c.fill(); };
const star = (c: Ctx, x: number, y: number, s: number) => shape(c, () => polyP(c, [[x, y - s], [x + s * 0.28, y - s * 0.28], [x + s, y], [x + s * 0.28, y + s * 0.28], [x, y + s], [x - s * 0.28, y + s * 0.28], [x - s, y], [x - s * 0.28, y - s * 0.28]]), COL.yellow, 4);
// a leaf from base (x, y) pointing at an, with side veins
const lf = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.leaf, wf = 0.3, dk: string = COL.leafDk) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wf, ny = Math.cos(an) * len * wf, mx = (x + tx) / 2, my = (y + ty) / 2;
  const p = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx * 1.3, my + ny * 1.3, tx, ty); c.quadraticCurveTo(mx - nx * 1.3, my - ny * 1.3, x, y); c.closePath(); };
  shape(c, p, col, 5); shade(c, p, "rgba(0,0,0,0.2)", -len * 0.03, -len * 0.04, 1);
  line(c, [[x, y], [tx - (tx - x) * 0.05, ty - (ty - y) * 0.05]], 4, dk);
};
// a cup (bottom centre x, y; top width w) with soil showing at the rim
const cup = (c: Ctx, x: number, y: number, w: number, h: number, soil: string = COL.soil, band: string = COL.teal) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.55, w * 0.1);
  const top = w / 2, bot = w * 0.36, body = () => polyP(c, [[x - top, y - h], [x + top, y - h], [x + bot, y], [x - bot, y]]);
  shape(c, body, COL.paper); shade(c, body, "#d9cfb8", w * 0.14, 0, 0.6);
  const bw = (t: number) => bot + (top - bot) * t;
  shape(c, () => polyP(c, [[x - bw(0.62), y - h * 0.62], [x + bw(0.62), y - h * 0.62], [x + bw(0.3), y - h * 0.3], [x - bw(0.3), y - h * 0.3]]), band, 4);
  shape(c, () => ell(c, x, y - h, top, w * 0.09), soil, 5);
};
type Sp = { pale?: boolean; bend?: number; hook?: boolean; leaf?: number; lcol?: string; w?: number };
// a moong seedling: a thick stem and two round leaves (pale and hooked over when grown in the dark)
const sprout = (c: Ctx, x: number, y: number, h: number, o: Sp = {}) => {
  const bend = o.bend ?? 0, w = o.w ?? Math.max(11, h * 0.045), stem = o.pale ? PALE : COL.greenLt, pts: number[][] = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([x + bend * t * t, y - h * t]); }
  let tx = pts[14][0], ty = pts[14][1], hang = 0;
  if (o.hook) { const r = h * 0.1, cx = tx + r; for (let a = Math.PI; a > 0.25; a -= 0.25) pts.push([cx + Math.cos(a) * r, ty - Math.sin(a) * r + r * 0.0]); tx = pts[pts.length - 1][0]; ty = pts[pts.length - 1][1]; hang = 1; }
  line(c, pts, w + 9, INK); line(c, pts, w, stem);
  const s = o.leaf ?? (o.pale ? h * 0.07 : h * 0.2), col = o.lcol ?? (o.pale ? PALE : COL.leaf);
  for (const d of [-1, 1]) { const px = tx + d * s * 0.8, py = ty + (hang ? s * 0.9 : -s * 0.1), rot = hang ? d * 0.5 : d * 0.35; shape(c, () => ell(c, px, py, s, s * 0.65, rot), col, 5); line(c, [[tx, ty], [px, py]], 3, o.pale ? "#d6c871" : COL.leafDk); }
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number, soil: string = COL.soil) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.62, w * 0.1);
  const rimH = h * 0.24, bw = w * 0.36, body = () => polyP(c, [[x - w * 0.46, y - h + rimH], [x + w * 0.46, y - h + rimH], [x + bw, y], [x - bw, y]]);
  shape(c, body, TERRA); shade(c, body, "#a9542f", w * 0.12, 0, 0.5);
  shape(c, () => rrect(c, x - w / 2, y - h, w, rimH, 10), "#e48a58");
  shape(c, () => ell(c, x, y - h + 3, w * 0.44, w * 0.06), soil, 4);
};
type Pl = { k?: number; hang?: boolean; col?: string; dk?: string; n?: number; len?: number; stem?: string };
// a plant with a stem that bends by k radians in total (negative = left) and pairs of leaves
const plant = (c: Ctx, x: number, y: number, h: number, o: Pl = {}) => {
  const k = o.k ?? 0, n = o.n ?? 3, steps = 24, col = o.col ?? COL.leaf, dk = o.dk ?? COL.leafDk, pts: number[][] = [[x, y]];
  const ang = (t: number) => -Math.PI / 2 + k * t * t;
  for (let i = 1; i <= steps; i++) { const a = ang((i - 0.5) / steps), p = pts[i - 1]; pts.push([p[0] + (Math.cos(a) * h) / steps, p[1] + (Math.sin(a) * h) / steps]); }
  line(c, pts, 17, INK); line(c, pts, 9, o.stem ?? COL.greenLt);
  const L = o.len ?? h * 0.3;
  for (let j = 0; j < n; j++) {
    const t = n === 1 ? 0.9 : 0.3 + (0.6 * j) / (n - 1), p = pts[Math.round(t * steps)];
    for (const s of [-1, 1]) lf(c, p[0], p[1], L * (1 - 0.12 * j), o.hang ? Math.PI / 2 + s * 0.55 : ang(t) + s * (1 - 0.1 * j), col, 0.3, dk);
  }
  const e = pts[steps]; lf(c, e[0], e[1], L * 0.7, o.hang ? Math.PI / 2 : ang(1), col, 0.3, dk);
};
const thermo = (c: Ctx, x: number, top: number, h: number, level: number, col: string, s = 1) => {
  c.save(); c.translate(x, top); c.scale(s, s); const H = h / s, tw = 34, br = 44, cy = H - br, tube = () => rrect(c, -tw / 2, 0, tw, cy, tw / 2), bulb = () => ell(c, 0, cy, br, br);
  for (const p of [tube, bulb]) { c.beginPath(); p(); c.lineWidth = 12; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke(); }
  for (const p of [tube, bulb]) { c.beginPath(); p(); c.fillStyle = WHITE; c.fill(); }
  for (let i = 1; i < 8; i++) line(c, [[tw / 2 + 4, (cy * i) / 8 + 6], [tw / 2 + (i % 2 ? 14 : 24), (cy * i) / 8 + 6]], 4);
  const ly = cy - level * (cy - 20); shape(c, () => rrect(c, -tw / 2 + 8, ly, tw - 16, cy - ly + 6, 4), col, 0); shape(c, () => ell(c, 0, cy, br - 10, br - 10), col, 0);
  shine(c, [[-tw / 2 + 4, 22], [-tw / 2 + 4, cy - 20]], 4); c.restore();
};
const bub = (c: Ctx, x: number, y: number, r: number, f: (c: Ctx, x: number, y: number, r: number) => void) => { shape(c, () => ell(c, x, y, r, r), WHITE, 6); f(c, x, y, r); };
const iSun = (c: Ctx, x: number, y: number, r: number) => sun(c, x, y, r * 0.38);
const iDrop = (c: Ctx, x: number, y: number, r: number) => drop(c, x, y + r * 0.12, r * 0.4);
const iAir = (c: Ctx, x: number, y: number, r: number) => { for (let i = -1; i <= 1; i++) { const p: number[][] = []; for (let k = 0; k <= 10; k++) p.push([x - r * 0.55 + (k / 10) * r * 1.1, y + i * r * 0.32 + Math.sin(k * 0.9 + i) * r * 0.1]); line(c, p, 7, COL.blueDk); } };
const iTherm = (c: Ctx, x: number, y: number, r: number) => thermo(c, x, y - r * 0.66, r * 1.35, 0.6, RED, 0.5);
const iSoil = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => { c.moveTo(x - r * 0.6, y + r * 0.4); c.quadraticCurveTo(x, y - r * 0.8, x + r * 0.6, y + r * 0.4); c.closePath(); }, COL.soil, 5); for (const [u, v] of [[-0.2, 0.1], [0.15, 0.2], [0.05, -0.15]]) shape(c, () => ell(c, x + u * r, y + v * r, 5, 4), COL.soilDk, 0); };
const ice = (c: Ctx, x: number, y: number, s: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -s, -s, s * 2, s * 2, s * 0.25), "rgba(226,243,255,0.9)", 5); shine(c, [[-s * 0.6, -s * 0.5], [-s * 0.6, s * 0.3]], 5); c.restore(); };
const lying = (c: Ctx, x: number, y: number, len: number, ang: number, pale: boolean) => {
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const t = i / 8, a = ang + Math.sin(t * 4) * 0.35; pts.push([x + Math.cos(ang) * len * t + -Math.sin(ang) * Math.sin(t * 4) * 8, y + Math.sin(ang) * len * t + Math.cos(ang) * Math.sin(t * 4) * 8 + 0 * a]); }
  line(c, pts, 18, INK); line(c, pts, 10, pale ? PALE : "#e8f0b8");
  const e = pts[8]; if (!pale) shape(c, () => ell(c, e[0], e[1], 13, 9, ang), COL.leaf, 4);
  c.save(); c.translate(x, y); c.restore();
  shape(c, () => ell(c, x, y, 17, 12, ang), COL.green, 4);
};
const lyingSet = (c: Ctx, cx: number, cy: number, rx: number, ry: number, pale: boolean, seedN: number) => {
  const r = rnd(seedN); for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2 + r(), px = cx + Math.cos(t) * rx * 0.55 * (0.5 + r() * 0.5), py = cy + Math.sin(t) * ry * 0.5; lying(c, px, py, 60 + r() * 30, r() * 6, pale); }
};
const ruler = (c: Ctx, x: number, y: number, len: number) => { // vertical, 0 at the bottom
  shape(c, () => rrect(c, x - 28, y - len, 56, len, 6), COL.wood); const n = Math.floor(len / 20);
  for (let i = 0; i <= n; i++) line(c, [[x - 28, y - 8 - i * 20], [x - 28 + (i % 5 === 0 ? 30 : 16), y - 8 - i * 20]], i % 5 === 0 ? 4 : 2.5);
};

// ---------------------------------------------------------------- flows
const e1 = (c: Ctx) => {
  ground(c); sun(c, 160, 150, 58); beam(c, [[190, 200], [260, 180], [430, 740], [150, 740]]);
  cup(c, 300, 870, 250, 210); for (const [dx, h] of [[-60, 120], [0, 150], [60, 110]]) sprout(c, 300 + dx, 668, h);
  shadow(c, 800, 915, 230, 22);
  shape(c, () => rrect(c, 580, 230, 440, 680, 18), "#c68f55"); shape(c, () => rrect(c, 610, 262, 380, 620, 10), DARK, 0);
  cup(c, 800, 870, 250, 210); for (const [dx, h, b] of [[-60, 340, 40], [0, 380, 50], [60, 320, 36]]) sprout(c, 800 + dx, 668, h, { pale: true, hook: true, bend: b });
};
const e2 = (c: Ctx) => {
  ground(c);
  cup(c, 200, 860, 230, 200, DRY); line(c, [[150, 668], [185, 676], [170, 690]], 3, "#8a6a45"); for (const dx of [-45, 10, 55]) sprout(c, 200 + dx, 664, 130, { pale: true, hook: true, bend: -20, lcol: YEL, leaf: 28 });
  drop(c, 200, 400, 24);
  cup(c, 540, 860, 230, 200, COL.soilDk); for (const [dx, h] of [[-50, 250], [5, 280], [55, 240]]) sprout(c, 540 + dx, 664, h);
  for (const dx of [-60, 0, 60]) drop(c, 540 + dx, 250 + Math.abs(dx) * 0.6, 28);
  cup(c, 880, 860, 230, 200, "#4a3426"); for (const dx of [-50, 5, 55]) sprout(c, 880 + dx, 664, 190, { hook: true, bend: -12, lcol: YEL, leaf: 34 });
  shape(c, () => rrect(c, 735, 770, 290, 140, 18), "rgba(143,195,234,0.7)", 6); shine(c, [[765, 800], [765, 870]], 8);
  for (const [x, y] of [[800, 250], [880, 190], [960, 260], [830, 340], [930, 330]]) drop(c, x, y, 26);
};
const e3 = (c: Ctx) => {
  ground(c);
  const L = [20, 55, 100], lv = [0.15, 0.5, 0.9], tc = [COL.blue, COL.green, RED];
  [190, 540, 890].forEach((x, i) => {
    thermo(c, x, 110, 400, lv[i], tc[i]);
    shadow(c, x + 16, 880, 160, 40); shape(c, () => ell(c, x, 780, 150, 112), COL.steel); shape(c, () => ell(c, x, 780, 128, 90), COL.steelIn, 5); shape(c, () => ell(c, x, 782, 112, 76), COL.cloth, 4);
    for (let k = 0; k < 5; k++) lying(c, x - 82 + (k === 0 || k === 4 ? 14 : 0), 745 + k * 17, L[i], 0.12 * (k - 2), true);
  });
  ice(c, 95, 700, 28, -0.2); ice(c, 135, 690, 22, 0.3); sun(c, 960, 120, 40);
};
const e4 = (c: Ctx) => {
  ground(c);
  const tint = ["rgba(214,236,250,0.5)", "rgba(228,82,59,0.5)", "rgba(91,143,214,0.5)", "rgba(106,165,63,0.5)"];
  [140, 400, 660, 920].forEach((x, i) => {
    cup(c, x, 890, 180, 150); for (const [dx, h] of [[-36, 190], [4, 230], [40, 180]]) sprout(c, x + dx, 750, h, { w: 11 });
    for (const dx of [-84, 84]) line(c, [[x + dx, 755], [x + dx, 200]], 5, COL.woodDk);
    shape(c, () => rrect(c, x - 88, 200, 176, 545, 14), tint[i], 5); shine(c, [[x - 66, 240], [x - 66, 600]], 8);
  });
};
const a1 = (c: Ctx) => {
  ground(c); sun(c, 900, 140, 55); beam(c, [[870, 190], [930, 200], [980, 640], [610, 640]], 0.3);
  shadow(c, 310, 840, 240, 36); shape(c, () => rrect(c, 90, 580, 440, 240, 40), COL.steel); shade(c, () => rrect(c, 90, 580, 440, 240, 40), COL.steelDk, 40, 0, 0.5);
  shape(c, () => ell(c, 310, 580, 220, 96), COL.steel); shape(c, () => ell(c, 310, 582, 190, 74), COL.steelIn, 4); shape(c, () => ell(c, 310, 584, 172, 62), "#cfe3f3", 3);
  lyingSet(c, 310, 584, 260, 100, true, 5);
  plate(c, 780, 740, 230, 100); shape(c, () => ell(c, 780, 740, 170, 66), "#cfe3f3", 3); lyingSet(c, 780, 742, 250, 100, false, 9);
};
const a2 = (c: Ctx) => {
  ground(c); pot(c, 250, 880, 230, 190); plant(c, 250, 694, 400, { n: 3 }); ruler(c, 395, 880, 480);
  for (const y of [560, 400]) line(c, [[250 + 25, y], [395 - 28, y]], 3, RED);
  shape(c, () => rrect(c, 560, 250, 460, 630, 14), WHITE); line(c, [[590, 800], [990, 800]], 5);
  [[620, 150], [710, 260], [800, 380], [890, 500]].forEach(([x, h]) => shape(c, () => rrect(c, x, 800 - h, 56, h, 4), COL.greenLt, 5));
  arrow(c, [[470, 330], [510, 250], [560, 200]], RED, 9);
};
const a3 = (c: Ctx) => {
  ground(c); pot(c, 790, 900, 250, 200); plant(c, 790, 704, 330, { k: 1.6, hang: true, col: YEL, dk: "#8a8a30", stem: "#bcc260", len: 110 });
  person(c, 230, 900, 640, { armR: [-0.3, -0.2] });
  line(c, [[520, 420], [570, 390]], 16, INK); line(c, [[520, 420], [570, 390]], 8, COL.wood);
  shape(c, () => ell(c, 640, 360, 95, 95), "rgba(214,236,250,0.55)", 12); shine(c, [[580, 330], [600, 295]], 9);
};
const a4 = (c: Ctx) => {
  ground(c); const X = 140, Y = 170, W = 800, H = 700;
  shape(c, () => rect4(c, X, Y, W, H), "#f6edd8", 0);
  c.fillStyle = "rgba(255,211,77,0.6)"; c.fillRect(X, Y, W, 150); c.fillRect(X, Y, 150, 330);
  c.fillStyle = "rgba(255,211,77,0.28)"; c.fillRect(X, Y + 150, W, 150); c.fillRect(X + 150, Y, 150, 330);
  c.fillStyle = "rgba(43,35,64,0.28)"; c.fillRect(X + 520, Y + 450, 280, 250);
  shape(c, () => rect4(c, X, Y, W, H), "rgba(0,0,0,0)", 14);
  line(c, [[X + 480, Y + 350], [X + 480, Y + H]], 12); line(c, [[X, Y + 350], [X + 300, Y + 350]], 12); line(c, [[X + 480, Y + 350], [X + 800, Y + 350]], 12);
  line(c, [[X + 250, Y], [X + 570, Y]], 22, COL.sky); line(c, [[X + 250, Y], [X + 570, Y]], 5); line(c, [[X, Y + 90], [X, Y + 260]], 22, COL.sky);
  sun(c, 60, 90, 36);
  for (const [x, y] of [[X + 400, Y + 100], [X + 100, Y + 250], [X + 600, Y + 250], [X + 650, Y + 600]]) { shape(c, () => ell(c, x, y, 44, 44), TERRA, 5); shape(c, () => ell(c, x, y, 30, 30), COL.leaf, 4); for (let k = 0; k < 5; k++) line(c, [[x, y], [x + Math.cos(k * 1.26) * 26, y + Math.sin(k * 1.26) * 26]], 4, COL.leafDk); }
};
const rect4 = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };
const a5 = (c: Ctx) => {
  ground(c); shadow(c, 540, 925, 480, 20); line(c, [[40, 920], [1040, 920]], 8);
  pot(c, 200, 920, 210, 170); plant(c, 200, 756, 330, { n: 2, len: 90 });
  line(c, [[510, 920], [510, 530]], 24, INK); line(c, [[510, 920], [510, 530]], 14, COL.brown);
  shape(c, () => rrect(c, 480, 500, 60, 46, 8), COL.wood);
  line(c, [[440, 470], [820, 585]], 16, INK); line(c, [[440, 470], [820, 585]], 8, "#fff3c4");
  shape(c, () => ell(c, 510, 495, 11, 11), COL.steelDk, 4);
  line(c, [[440, 470], [250, 600]], 4); shape(c, () => ell(c, 250, 600, 8, 8), INK, 0);
  line(c, [[820, 585], [820, 640]], 4); shape(c, () => rrect(c, 806, 640, 28, 52, 12), COL.steel, 4);
  shape(c, () => rrect(c, 900, 440, 80, 440, 6), WHITE); for (let i = 0; i < 12; i++) line(c, [[900, 470 + i * 34], [900 + (i % 2 ? 30 : 50), 470 + i * 34]], 3);
  arrow(c, [[860, 520], [860, 640]], RED, 9);
};
const a6 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 30, 70, 490, 940, 30), "#2d3558", 6); shape(c, () => rrect(c, 560, 70, 490, 940, 30), "#fdf0c4", 6);
  shape(c, () => ell(c, 400, 200, 52, 52), "#f4efd2", 4); shape(c, () => ell(c, 425, 185, 46, 46), "#2d3558", 0); for (const [x, y] of [[110, 180], [210, 290], [330, 130]]) star(c, x, y, 18);
  person(c, 270, 920, 420, { sit: true, armL: [1.9, 1.3], armR: [1.2, 1.9] });
  sun(c, 900, 200, 55); beam(c, [[860, 250], [940, 250], [1030, 960], [580, 960]], 0.25);
  person(c, 760, 960, 720, { armL: [-2.3, -1.95], armR: [-0.85, -1.2] });
};
const p1 = (c: Ctx) => {
  ground(c); pot(c, 290, 920, 270, 220); line(c, [[290, 700], [320, 330], [330, 130]], 18, INK); line(c, [[290, 700], [320, 330], [330, 130]], 10, COL.brown);
  const vine = [[290, 700], [340, 610], [300, 540], [345, 460], [315, 390], [345, 310], [330, 240]]; line(c, vine, 16, INK); line(c, vine, 8, COL.greenLt);
  for (const [x, y, a] of [[340, 610, 0.1], [300, 540, 3.1], [345, 460, -0.1], [315, 390, 3.3], [345, 310, 0.3], [330, 240, 3.0]]) lf(c, x, y, 105, a, COL.leaf, 0.42);
  shape(c, () => polyP(c, [[580, 330], [800, 300], [800, 880], [580, 910]]), WHITE); shape(c, () => polyP(c, [[800, 300], [1030, 330], [1030, 910], [800, 880]]), "#fffaf0");
  line(c, [[800, 300], [800, 880]], 6);
  const g: number[][] = [[840, 800], [880, 770], [920, 700], [960, 620], [1000, 520]]; for (let i = 0; i < 4; i++) line(c, [[620 + 0, 400 + i * 100], [770, 390 + i * 100]], 3, COL.steelDk);
  line(c, [[850, 820], [1000, 820]], 4); line(c, [[850, 820], [850, 400]], 4); line(c, g, 8, COL.green); g.forEach(([x, y]) => shape(c, () => ell(c, x, y, 11, 11), COL.green, 3));
  for (const [x, y, r] of [[650, 760, 24], [700, 790, 22], [650, 840, 22]]) seed(c, x, y, r, 0.5);
};
const seed = (c: Ctx, x: number, y: number, r: number, rot: number) => { shape(c, () => ell(c, x, y, r, r * 0.7, rot), "#d9a066", 4); };
const c1 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e6d8bd"; c.fillRect(0, 0, D8, 760); c.fillStyle = "#cdbb98"; c.fillRect(0, 760, D8, 320);
  shape(c, () => rrect(c, 40, 110, 290, 480, 8), COL.sky); sun(c, 150, 230, 52); line(c, [[185, 110], [185, 590]], 12, COL.woodDk); line(c, [[40, 350], [330, 350]], 12, COL.woodDk); shape(c, () => rrect(c, 40, 110, 290, 480, 8), "rgba(0,0,0,0)", 12);
  beam(c, [[330, 130], [330, 560], [860, 760], [860, 380]], 0.28);
  shape(c, () => polyP(c, [[900, 330], [1020, 300], [1020, 780], [900, 800]]), WHITE); shine(c, [[930, 360], [930, 700]], 8);
  pot(c, 720, 880, 220, 180); plant(c, 720, 705, 330, { n: 3, len: 105 });
  shape(c, () => ell(c, 520, 800, 38, 100, 0), COL.steel); shape(c, () => ell(c, 520, 800, 26, 80, 0), COL.steelIn, 3);
  arrow(c, [[880, 600], [850, 540], [800, 500]], RED, 10);
  arrow(c, [[400, 230], [650, 250], [880, 300]], RED, 9);
};
const D8 = 1080;
const c2 = (c: Ctx) => {
  ground(c); pot(c, 760, 900, 260, 210); plant(c, 760, 694, 360, { n: 3, len: 110 });
  shape(c, () => rrect(c, 130, 760, 300, 140, 12), COL.wood); shape(c, () => rrect(c, 130, 900, 300, 20, 6), COL.woodDk);
  const body = () => rrect(c, 170, 300, 220, 450, 40);
  shape(c, body, "rgba(214,236,250,0.6)", 6); shape(c, () => rrect(c, 178, 380, 204, 362, 34), COL.water, 0); shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 250, 740, 60, 40, 8), COL.teal, 5); shine(c, [[200, 340], [200, 560]], 9);
  const s: number[][] = [[280, 780], [300, 840], [440, 880], [600, 860], [740, 780], [760, 700]]; line(c, s, 12, INK); line(c, s, 6, COL.cloth);
  drop(c, 450, 930, 18); drop(c, 640, 880, 18);
  shape(c, () => rrect(c, 800, 90, 230, 220, 18), WHITE); shape(c, () => rrect(c, 800, 90, 230, 56, 16), COL.red, 5); write(c, "7", 880, 170, 110, INK, 12);
};
// ---------------------------------------------------------------- terms
const term1 = (c: Ctx) => {
  ground(c); cup(c, 540, 900, 400, 340); sprout(c, 540, 565, 400, { w: 24, leaf: 105 });
  shape(c, () => ell(c, 440, 548, 40, 20, -0.4), COL.green, 5); shape(c, () => ell(c, 650, 548, 40, 20, 0.4), COL.green, 5);
};
const term2 = (c: Ctx) => {
  ground(c);
  [[190, 90], [540, 230], [890, 380]].forEach(([x, h], i) => { cup(c, x, 880, 230, 190); sprout(c, x, 700, h, { w: 14 }); write(c, String(i + 1), x - 22, 915, 85, INK, 10); });
  arrow(c, [[150, 160], [540, 100], [900, 100]], RED, 11);
};
const term3 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 40, 120, 390, 520, 10), COL.sky); c.save(); c.beginPath(); c.rect(40, 120, 390, 520); c.clip(); sun(c, 140, 230, 62); c.restore();
  line(c, [[235, 120], [235, 640]], 14, COL.woodDk); line(c, [[40, 380], [430, 380]], 14, COL.woodDk); shape(c, () => rrect(c, 40, 120, 390, 520, 10), "rgba(0,0,0,0)", 12);
  shape(c, () => rrect(c, 10, 640, 1060, 44, 8), COL.wood); beam(c, [[430, 160], [430, 600], [900, 640], [900, 300]], 0.22);
  pot(c, 720, 640, 230, 190); plant(c, 720, 458, 340, { k: -1.2, n: 3, len: 105 });
  arrow(c, [[900, 330], [840, 180], [640, 120]], RED, 11);
};
const term4 = (c: Ctx) => {
  ground(c); glass(c, 170, 880, 250, 320, 0.75); ice(c, 130, 600, 38, -0.2); ice(c, 205, 640, 34, 0.3); ice(c, 170, 570, 30, 0.1);
  thermo(c, 400, 250, 620, 0.1, COL.blue);
  line(c, [[520, 150], [520, 930]], 5, COL.steelDk);
  thermo(c, 620, 250, 620, 0.9, RED);
  shape(c, () => rrect(c, 740, 120, 300, 440, 10), COL.sky); c.save(); c.beginPath(); c.rect(740, 120, 300, 440); c.clip(); sun(c, 860, 240, 62); c.restore();
  line(c, [[890, 120], [890, 560]], 12, COL.woodDk); line(c, [[740, 340], [1040, 340]], 12, COL.woodDk); shape(c, () => rrect(c, 740, 120, 300, 440, 10), "rgba(0,0,0,0)", 12);
};
const term6 = (c: Ctx) => {
  ground(c); shadow(c, 570, 900, 380, 40);
  const m = () => { c.moveTo(130, 890); c.bezierCurveTo(180, 620, 400, 520, 540, 520); c.bezierCurveTo(700, 520, 900, 620, 950, 890); c.closePath(); };
  shape(c, m, "#5a3a26"); shade(c, m, "#3a2416", 60, 20, 0.5);
  const r = rnd(4); for (let i = 0; i < 40; i++) { const x = 220 + r() * 640, y = 640 + r() * 220; shape(c, () => ell(c, x, y, 8 + r() * 6, 5 + r() * 4, r() * 3), i % 3 ? "#7a5236" : "#3f5a2a", 0); }
  sprout(c, 540, 530, 260, { w: 16, leaf: 62 });
  for (const [x, y, s] of [[260, 460, 30], [830, 430, 36], [680, 640, 26], [390, 700, 24], [150, 640, 22], [900, 700, 26]]) star(c, x, y, s);
};
const term15 = (c: Ctx) => {
  ground(c); pot(c, 250, 900, 280, 230, DRY); plant(c, 250, 678, 330, { k: 2.1, hang: true, col: "#8aa65a", len: 105 });
  arrow(c, [[420, 600], [540, 560], [640, 600]], RED, 12);
  pot(c, 830, 900, 280, 230, COL.soilDk); plant(c, 830, 678, 360, { n: 3, len: 110 }); for (const x of [780, 840, 900]) drop(c, x, 140 + (x === 840 ? 40 : 0), 24);
};
const term16 = (c: Ctx) => {
  ground(c); pot(c, 540, 840, 360, 290, "#4a3426"); plant(c, 540, 580, 340, { col: YEL, dk: "#8a8a30", stem: "#bcc260", n: 3, len: 105, k: 0.5 });
  shape(c, () => rrect(c, 250, 760, 580, 150, 22), "rgba(143,195,234,0.75)", 7); shine(c, [[290, 800], [290, 870]], 9);
  for (let i = 0; i < 3; i++) line(c, [[330 + i * 160, 820], [360 + i * 160, 810], [390 + i * 160, 820]], 5, COL.waterDk);
};
const term17 = (c: Ctx) => {
  ground(c); cup(c, 290, 900, 300, 250); sprout(c, 290, 650, 430, { pale: true, hook: true, bend: -60, w: 22 });
  cup(c, 790, 900, 300, 250); sprout(c, 790, 650, 120, { w: 18, leaf: 70 });
};
const term19 = (c: Ctx) => {
  ground(c); thermo(c, 400, 90, 840, 0.6, RED);
  const bands: [number, number, string][] = [[640, 800, COL.blue], [330, 640, COL.green], [120, 330, RED]];
  for (const [a, b, col] of bands) shape(c, () => rrect(c, 480, a, 34, b - a, 8), col, 4);
  line(c, [[540, 330], [575, 330], [575, 640], [540, 640]], 7); sprout(c, 760, 640, 260, { w: 20 }); shadow(c, 770, 650, 100, 18); cup(c, 760, 760, 200, 130);
};
const term23 = (c: Ctx) => {
  ground(c); shadow(c, 560, 780, 480, 28);
  shape(c, () => rrect(c, 70, 470, 940, 300, 36), WHITE); shape(c, () => rrect(c, 90, 600, 900, 150, 24), "rgba(143,195,234,0.85)", 5);
  [220, 540, 860].forEach((x, i) => {
    for (let k = 0; k < 4; k++) { const p = [[x + (k - 1.5) * 18, 480], [x + (k - 1.5) * 30, 600], [x + (k - 1.5) * 34 + (k % 2 ? 8 : -8), 700]]; line(c, p, 12, INK); line(c, p, 6, WHITE); }
    shape(c, () => ell(c, x, 480, 50, 14), DARK, 4);
    for (let k = 0; k < 7; k++) lf(c, x, 478, 130, -Math.PI / 2 + (k - 3) * 0.42, i % 2 ? COL.leaf : COL.greenLt, 0.45);
  });
};
// ---------------------------------------------------------------- explanations
const expl0 = (c: Ctx) => {
  ground(c); pot(c, 540, 930, 270, 220); plant(c, 540, 748, 440, { n: 4, len: 130 });
  bub(c, 540, 150, 105, iSun); bub(c, 170, 330, 100, iDrop); bub(c, 910, 330, 100, iTherm); bub(c, 130, 700, 95, iAir); bub(c, 950, 700, 95, iSoil);
};
const expl2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 30, 70, 480, 940, 30), "#fdf0c4", 6); shape(c, () => rrect(c, 570, 70, 480, 940, 30), "#8d93ad", 6);
  sun(c, 140, 200, 50); beam(c, [[130, 260], [200, 250], [420, 900], [90, 900]], 0.28);
  cup(c, 270, 920, 240, 200); for (const dx of [-40, 40]) sprout(c, 270 + dx, 735, 200);
  cup(c, 810, 920, 240, 200); for (const [dx, b] of [[-40, -30], [40, -20]]) sprout(c, 810 + dx, 735, 420, { pale: true, hook: true, bend: b });
  ruler(c, 530, 920, 400);
};
const expl3 = (c: Ctx) => {
  ground(c); pot(c, 260, 900, 330, 280, COL.soilDk); plant(c, 260, 640, 380, { n: 3, len: 105 });
  const cx = 740, cy = 450, R = 280, r = rnd(11);
  shape(c, () => ell(c, cx, cy, R, R), COL.cloth, 12);
  c.save(); c.beginPath(); ell(c, cx, cy, R - 6, R - 6); c.clip();
  c.fillStyle = "#e9f6ff"; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  for (let i = 0; i < 26; i++) { const a = r() * 6.3, d = Math.sqrt(r()) * (R - 60), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, g = 38 + r() * 24; shape(c, () => ell(c, x, y, g + 10, g + 10), COL.water, 0); shape(c, () => ell(c, x, y, g, g * 0.9, r() * 3), i % 2 ? COL.soil : "#7a4e32", 5); }
  c.restore(); shape(c, () => ell(c, cx, cy, R, R), "rgba(0,0,0,0)", 12);
  line(c, [[380, 640], [520, 640]], 5, COL.steelDk); line(c, [[380, 640], [500, 600]], 5, COL.steelDk);
};
const expl4 = (c: Ctx) => {
  ground(c); thermo(c, 190, 90, 840, 0.55, RED);
  shape(c, () => rrect(c, 280, 130, 30, 220, 8), RED, 4); shape(c, () => rrect(c, 280, 350, 30, 280, 8), COL.green, 4); shape(c, () => rrect(c, 280, 630, 30, 220, 8), COL.blue, 4);
  cup(c, 700, 330, 180, 110); sprout(c, 700, 224, 130, { hook: true, bend: -10, lcol: "#a08a40", w: 11, leaf: 30 }); sun(c, 910, 150, 36);
  cup(c, 700, 620, 180, 110); for (const dx of [-30, 30]) sprout(c, 700 + dx, 514, 140, { w: 11 });
  cup(c, 700, 910, 180, 110); sprout(c, 700, 804, 60, { w: 9, leaf: 22 }); ice(c, 880, 850, 30, -0.2); ice(c, 930, 890, 24, 0.3);
};
const expl5 = (c: Ctx) => {
  ground(c);
  const panel = (x: number, y: number, f: () => void) => { c.save(); c.beginPath(); rrect(c, x, y, 490, 490, 26); c.clip(); c.translate(x, y); f(); c.restore(); shape(c, () => rrect(c, x, y, 490, 490, 26), "rgba(0,0,0,0)", 8); };
  panel(35, 35, () => { c.fillStyle = COL.sky; c.fillRect(0, 0, 490, 490); sun(c, 390, 110, 48); shape(c, () => { c.moveTo(0, 330); c.quadraticCurveTo(250, 280, 490, 340); c.lineTo(490, 490); c.lineTo(0, 490); c.closePath(); }, "#f0d28a", 5);
    for (const [pts, w] of [[[[245, 420], [245, 130]], 70], [[[245, 330], [150, 330], [150, 220]], 36], [[[245, 300], [340, 300], [340, 190]], 36]] as [number[][], number][]) { line(c, pts, w + 10, INK); }
    for (const [pts, w] of [[[[245, 420], [245, 130]], 70], [[[245, 330], [150, 330], [150, 220]], 36], [[[245, 300], [340, 300], [340, 190]], 36]] as [number[][], number][]) line(c, pts, w, COL.green);
    for (const x of [225, 265]) line(c, [[x, 150], [x, 400]], 4, COL.greenDk); });
  panel(555, 35, () => { c.fillStyle = "#bfe0c0"; c.fillRect(0, 0, 490, 490); shape(c, () => polyP(c, [[260, 0], [490, 0], [490, 490], [220, 490]]), COL.steelDk, 5);
    shape(c, () => polyP(c, [[300, 0], [370, 0], [350, 400], [290, 400]]), "#e9f6ff", 4); shape(c, () => ell(c, 325, 430, 150, 40), COL.water, 5);
    for (let f = 0; f < 7; f++) { const a = -2.9 + f * 0.5, pts: number[][] = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push([110 + Math.cos(a) * 170 * t, 450 + Math.sin(a) * 250 * t + t * t * 170 * (a > -1.6 ? 1 : 0.4)]); } line(c, pts, 8, COL.leafDk);
      for (let i = 2; i <= 8; i++) { const p = pts[i], q = pts[i - 1], an = Math.atan2(p[1] - q[1], p[0] - q[0]); for (const s of [-1, 1]) line(c, [[p[0], p[1]], [p[0] + Math.cos(an + s * 1.2) * 34, p[1] + Math.sin(an + s * 1.2) * 34]], 9, COL.leaf); } } });
  panel(35, 555, () => { c.fillStyle = "#dfe6ea"; c.fillRect(0, 0, 490, 490); sun(c, 400, 90, 36); shape(c, () => rrect(c, 0, 330, 490, 160, 0), "#b8a77a", 0);
    for (let i = 0; i < 7; i++) { const x = 60 + i * 62, h = 230 + (i % 3) * 30; line(c, [[x, 470], [x + 4, 470 - h]], 7, "#c0a24a"); shape(c, () => ell(c, x + 4, 470 - h - 40, 14, 44), COL.yellow, 4); }
    for (const [x, y, rx] of [[120, 330, 160], [350, 280, 190], [260, 400, 220], [430, 430, 140]]) { c.beginPath(); ell(c, x, y, rx, 38); c.fillStyle = "rgba(255,255,255,0.7)"; c.fill(); } });
  panel(555, 555, () => { c.fillStyle = "#9fb4c6"; c.fillRect(0, 0, 490, 490); shape(c, () => ell(c, 120, 80, 100, 44), "#d4dce3", 4); shape(c, () => ell(c, 330, 70, 120, 50), "#d4dce3", 4);
    c.fillStyle = COL.water; c.fillRect(0, 280, 490, 210); for (let i = 0; i < 5; i++) line(c, [[40 + i * 90, 440 + (i % 2) * 20], [90 + i * 90, 440 + (i % 2) * 20]], 5, COL.waterDk);
    for (const [x, y] of [[60, 160], [180, 200], [300, 150], [420, 210], [240, 120], [110, 250]]) line(c, [[x, y], [x - 14, y + 42]], 6, COL.blueDk);
    for (let k = 0; k < 4; k++) { const x = 80 + k * 110; for (let l = 0; l < 4; l++) { const a = -Math.PI / 2 + (l - 1.5) * 0.45; line(c, [[x, 420], [x + Math.cos(a) * 70, 420 + Math.sin(a) * 150], [x + Math.cos(a) * 130, 420 + Math.sin(a) * 140 + 40]], 10, COL.greenDk); line(c, [[x, 420], [x + Math.cos(a) * 70, 420 + Math.sin(a) * 150], [x + Math.cos(a) * 130, 420 + Math.sin(a) * 140 + 40]], 5, COL.greenLt); } } });
};
const expl6 = (c: Ctx) => {
  ground(c); shadow(c, 540, 905, 440, 30); const tops = [230, 270, 520, 250, 290], ic = [iDrop, iTherm, iSun, iAir, iSoil];
  shape(c, () => ell(c, 450, 915, 150, 26), "rgba(143,195,234,0.9)", 5);
  tops.forEach((t, i) => { shape(c, () => rrect(c, 170 + i * 148, t, 148, 890 - t, 14), i % 2 ? "#e9b45a" : COL.wood, 6); });
  for (const y of [660, 800]) shape(c, () => rrect(c, 150, y, 780, 34, 8), COL.steelDk, 5);
  shape(c, () => polyP(c, [[470, 520], [610, 520], [600, 480], [470, 495]]), COL.water, 4);
  shape(c, () => rrect(c, 495, 500, 90, 400, 18), "rgba(143,195,234,0.85)", 0);
  tops.forEach((t, i) => bub(c, 244 + i * 148, t + 78, 56, ic[i]));
  drop(c, 640, 640, 20); drop(c, 440, 720, 18); arrow(c, [[640, 460], [700, 540], [700, 640]], RED, 10);
};
const expl10 = (c: Ctx) => {
  ground(c); glass(c, 270, 900, 330, 500, 0.7);
  for (const [dx, a] of [[-70, 0.0], [0, 0.0], [70, 0.0]]) { const p: number[][] = [[270 + dx * 0.4, 560], [270 + dx * 0.7, 700], [270 + dx, 810 + (dx === 0 ? 30 : 0)]]; line(c, p, 12, INK); line(c, p, 6, WHITE); void a; }
  line(c, [[270, 560], [280, 400], [260, 260]], 14, INK); line(c, [[270, 560], [280, 400], [260, 260]], 8, COL.greenLt);
  for (const [x, y, a] of [[280, 400, 0.2], [270, 480, 2.9], [260, 300, -0.4], [262, 270, 3.5]]) lf(c, x, y, 120, a, COL.leaf, 0.45);
  pot(c, 790, 900, 300, 260, COL.soilDk); plant(c, 790, 660, 380, { n: 3, len: 110 });
  bub(c, 400, 150, 70, iDrop); bub(c, 540, 150, 70, iAir); bub(c, 680, 150, 70, iSoil);
};

export const ic_plantsWhatPlantsNeedL3 = cards("sci.plants.what-plants-need.L3 cards", [e1, e2, e3, e4, a1, a2, a3, a4, a5, a6, p1, c1, c2, term1, term2, term3, term4, term6, term15, term16, term17, term19, term23, expl0, expl2, expl3, expl4, expl5, expl6, expl10]);
void SKIN; void CLOTH; void hand; void line; void arrow;
