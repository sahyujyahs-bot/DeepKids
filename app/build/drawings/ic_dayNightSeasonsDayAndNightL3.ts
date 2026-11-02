import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.day-night-seasons.day-and-night.L3 · picture cards (experiments, activities, challenges, terms, explanations).
// Child and grown-up are the same as on the set-up cards. The Sun is yellow with orange rays; night is deep blue.

const NAVY = "#1d2142", NIGHT = "rgba(18,20,52,0.62)", OR = "#f58a1f", ORDK = "#c9650f", PAPER2 = "#e6d9bf", HILL = "#7fb55a";

// ------------------------------------------------------------------ shared pieces
const sunDisc = (c: Ctx, x: number, y: number, r: number, rays = true) => {
  if (rays) for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + r * 0.7 + 14), y + Math.sin(a) * (r + r * 0.7 + 14)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const star4 = (c: Ctx, x: number, y: number, r: number, col: string = WHITE) => {
  c.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, d = i % 2 ? r * 0.38 : r; c[i ? "lineTo" : "moveTo"](x + Math.cos(a) * d, y + Math.sin(a) * d); }
  c.closePath(); c.fillStyle = col; c.fill();
};
const starField = (c: Ctx, seed: number, n: number, x0: number, y0: number, x1: number, y1: number) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) star4(c, x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), 5 + r() * 9, r() > 0.7 ? "#ffe9a8" : WHITE);
};
const tree = (c: Ctx, x: number, y: number, h: number) => {
  shape(c, () => rrect(c, x - h * 0.06, y - h * 0.45, h * 0.12, h * 0.45, 4), COL.brown, 5);
  const crown = () => ell(c, x, y - h * 0.62, h * 0.3, h * 0.38);
  shape(c, crown, COL.leaf, 6); shade(c, crown, COL.leafDk, h * 0.1, h * 0.08, 0.55);
};
const house = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 6), "#f1d3a0", 6);
  shape(c, () => polyP(c, [[x - w / 2 - 14, y - h], [x, y - h - h * 0.45], [x + w / 2 + 14, y - h]]), "#c8663a", 6);
  shape(c, () => rrect(c, x - w * 0.12, y - h * 0.55, w * 0.24, h * 0.55, 4), COL.brown, 5);
  shape(c, () => rrect(c, x + w * 0.22, y - h * 0.8, w * 0.2, h * 0.25, 3), COL.sky, 4);
};
const clockFace = (c: Ctx, x: number, y: number, r: number, hr: number, mn: number, bg: string = WHITE) => {
  shape(c, () => ell(c, x, y, r, r), bg, 7);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82], [x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92]], i % 3 ? 3 : 6); }
  const ha = ((hr % 12) + mn / 60) * (Math.PI / 6) - Math.PI / 2, ma = mn * (Math.PI / 30) - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5]], r * 0.1); line(c, [[x, y], [x + Math.cos(ma) * r * 0.74, y + Math.sin(ma) * r * 0.74]], r * 0.065);
  shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), INK, 0);
};
// the Earth: blue seas, green land; dark = 1 puts the right half in night, -1 the left half
const globe = (c: Ctx, cx: number, cy: number, R: number, dark = 0) => {
  const body = () => ell(c, cx, cy, R, R);
  shape(c, body, COL.blue, 0);
  c.save(); c.beginPath(); body(); c.clip();
  ([[-0.35, -0.35, 0.34, 0.22, 0.4], [-0.1, 0.18, 0.2, 0.36, -0.3], [0.45, -0.25, 0.3, 0.2, 0.2], [0.4, 0.5, 0.22, 0.14, 0], [-0.62, 0.35, 0.14, 0.2, 0]] as number[][]).forEach(([a, b, rx, ry, rot]) => shape(c, () => ell(c, cx + a * R, cy + b * R, rx * R, ry * R, rot), COL.green, 4));
  c.restore();
  if (!dark) shade(c, body, COL.blueDk, R * 0.22, R * 0.18, 0.4);
  else { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = NIGHT; if (dark > 0) c.fillRect(cx, cy - R, R, R * 2); else c.fillRect(cx - R, cy - R, R, R * 2); c.restore(); }
  c.beginPath(); body(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
};
// an orange with a pencil through it; tilt 0; the pencil runs from y1 to y2
const pencilV = (c: Ctx, x: number, y1: number, y2: number) => {
  shape(c, () => rrect(c, x - 16, y1 + 70, 32, y2 - y1 - 120, 3), COL.yellow, 5);
  shade(c, () => rrect(c, x - 16, y1 + 70, 32, y2 - y1 - 120, 3), "#e0a820", 10, 0, 0.7);
  shape(c, () => polyP(c, [[x - 16, y1 + 70], [x, y1], [x + 16, y1 + 70]]), "#f1d3a0", 5);
  shape(c, () => polyP(c, [[x - 6, y1 + 24], [x, y1], [x + 6, y1 + 24]]), INK, 3);
  shape(c, () => rrect(c, x - 16, y2 - 50, 32, 16, 3), COL.steel, 5);
  shape(c, () => rrect(c, x - 16, y2 - 36, 32, 36, 12), COL.pink, 5);
};
const fruit = (c: Ctx, cx: number, cy: number, R: number) => {
  const body = () => ell(c, cx, cy, R, R);
  shape(c, body, OR, 0); shade(c, body, ORDK, R * 0.2, R * 0.16, 0.5);
  const r = rnd(5); c.fillStyle = "rgba(150,70,10,0.35)";
  for (let i = 0; i < 46; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R * 0.9; c.beginPath(); ell(c, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3.5, 2.5); c.fill(); }
  shine(c, [[cx - R * 0.66, cy - R * 0.3], [cx - R * 0.5, cy - R * 0.58]], 12);
  c.beginPath(); body(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, cx, cy - R + 3, 26, 9), "#5a3a1c", 4); shape(c, () => ell(c, cx, cy + R - 3, 26, 9), "#5a3a1c", 4);
};
// an arm from the card edge ending in a hand; wrist at (x, y), pointing at angle an
const armHand = (c: Ctx, x: number, y: number, an: number, s: number, mirror = false, open = false, adult = false) => {
  c.save(); c.translate(x, y); if (mirror) c.scale(-1, 1); c.rotate(an);
  c.save(); c.scale(s, s); shape(c, () => rrect(c, -1000, -32, 970, 64, 12), adult ? CLOTH.adult : CLOTH.child, 6); c.restore();
  hand(c, 0, 0, 0, s, adult ? SKIN.adult : undefined, adult ? CLOTH.adult : undefined, open);
  c.restore();
};
const floor = (c: Ctx, y: number, col = "#e3d5b8") => { c.fillStyle = col; c.fillRect(-10, y, D + 20, D); line(c, [[-10, y], [D + 10, y]], 5, "#b9a687"); };
// a ring arrow round something standing: the front of the ring, left to right
const ringArrow = (c: Ctx, cx: number, cy: number, rx: number, ry: number, w = 14) => {
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; pts.push([cx - rx * Math.cos(t), cy + ry * Math.sin(t)]); }
  arrow(c, pts, RED, w);
};
const arcPts = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 14) => { const p: number[][] = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; p.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } return p; };
// the seven stars of the Great Bear (Saptarishi), Merak at (0,0); Dubhe is the next pointer; unit = 1
const DIPPER: number[][] = [[0, 0], [0, -1], [-1.6, -1], [-1.3, -0.4], [-2.5, -1.5], [-3.4, -2.2], [-4.4, -2.5]];
const dipper = (c: Ctx, px: number, py: number, k: number, rot: number, col: string, dim = 1) => {
  c.globalAlpha = dim;
  const P = DIPPER.map(([u, v]) => { const x = u * k, y = v * k + 6.2 * k; return [px + x * Math.cos(rot) - y * Math.sin(rot), py + x * Math.sin(rot) + y * Math.cos(rot)] as number[]; });
  // Merak(0) Dubhe(1) Megrez(2) Phecda(3) back to Merak; handle Megrez - Alioth - Mizar - Alkaid
  const order = [0, 1, 2, 3, 0];
  line(c, order.map((i) => P[i]), 5, col); line(c, [P[2], P[4], P[5], P[6]], 5, col);
  P.forEach(([x, y]) => star4(c, x, y, k * 0.34, col));
  c.globalAlpha = 1;
  return P;
};
const barefoot = (c: Ctx, x: number, y: number, h: number) => person(c, x, y, h);

// ------------------------------------------------------------------ flows
// e1: torch on books, the orange on its pencil, half bright; arrow turns the pencil
const flowE1 = (c: Ctx) => {
  ground(c, NAVY);
  c.fillStyle = "#3b2e55"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  c.beginPath(); polyP(c, [[262, 505], [262, 575], [780, 740], [780, 330]]); c.fillStyle = "rgba(255,236,140,0.28)"; c.fill();
  [[20, 250, 836, "#d7372b"], [30, 240, 772, "#3f6fb3"], [10, 270, 708, "#46752a"], [24, 244, 644, "#8b6cc9"]].forEach(([x, w, y, col]) => {
    shape(c, () => rrect(c, x as number, y as number, w as number, 64, 6), col as string, 6);
    shape(c, () => rrect(c, (x as number) + 14, (y as number) + 10, (w as number) - 28, 44, 3), WHITE, 3);
  });
  shape(c, () => rrect(c, 40, 500, 170, 76, 16), COL.red, 6);
  shape(c, () => polyP(c, [[208, 490], [262, 466], [262, 610], [208, 586]]), COL.steelDk, 6);
  shape(c, () => ell(c, 260, 540, 12, 58), "#fff6c4", 5);
  pencilV(c, 700, 120, 900);
  fruit(c, 700, 500, 190);
  c.save(); c.beginPath(); ell(c, 700, 500, 190, 190); c.clip(); c.fillStyle = NIGHT; c.fillRect(700, 300, 200, 400); c.restore();
  c.beginPath(); ell(c, 700, 500, 190, 190); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  [[560, 540], [640, 540], [760, 540]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 17, 17), RED, 5));
  armHand(c, 700, 1050, -Math.PI / 2, 1.8);
  ringArrow(c, 700, 770, 130, 34, 16);
};
// e2: shadow stick in the morning (long shadow) and at noon (short shadow)
const stickPanel = (c: Ctx, x0: number, sunX: number, sunY: number, sx: number, len: number, sky: string) => {
  c.save(); c.beginPath(); c.rect(x0, 0, 540, D); c.clip();
  c.fillStyle = sky; c.fillRect(x0, 0, 540, 620); c.fillStyle = PAPER2; c.fillRect(x0, 620, 540, 460); line(c, [[x0, 620], [x0 + 540, 620]], 5, "#b9a687");
  sunDisc(c, sunX, sunY, 56);
  c.beginPath(); polyP(c, [[sx - 14, 846], [sx + len, 838], [sx + len + 6, 864], [sx + 14, 872]]); c.fillStyle = "rgba(43,35,64,0.5)"; c.fill();
  shape(c, () => rrect(c, sx - 12, 470, 24, 330, 5), COL.wood, 5); shade(c, () => rrect(c, sx - 12, 470, 24, 330, 5), COL.woodDk, 9, 0, 0.7);
  shape(c, () => polyP(c, [[sx - 72, 790], [sx + 72, 790], [sx + 52, 860], [sx - 52, 860]]), "#c8663a", 6);
  shape(c, () => rrect(c, sx - 82, 770, 164, 34, 8), "#c8663a", 6);
  shade(c, () => rrect(c, sx - 82, 770, 164, 34, 8), "#a24c26", 30, 0, 0.5);
  c.restore();
};
const flowE2 = (c: Ctx) => {
  ground(c, PAPER2);
  stickPanel(c, 0, 90, 150, 130, 340, "#f8dfa8");
  stickPanel(c, 540, 810, 120, 760, 36, COL.sky);
  line(c, [[540, 0], [540, D]], 10);
  arrow(c, [[230, 985], [850, 985]], RED, 16);
};
// e3: nut on a string over a stool; it swings along the chalk line while the stool turns
const hexNut = (c: Ctx, x: number, y: number, alpha = 1) => {
  c.globalAlpha = alpha;
  const hex = () => polyP(c, [0, 1, 2, 3, 4, 5].map((k) => [x + Math.cos((k * Math.PI) / 3) * 44, y + Math.sin((k * Math.PI) / 3) * 44]));
  shape(c, hex, COL.steel, 6); shade(c, hex, COL.steelDk, 8, 8, 0.7); shape(c, () => ell(c, x, y, 17, 17), COL.black, 4);
  c.globalAlpha = 1;
};
const flowE3 = (c: Ctx) => {
  ground(c); floor(c, 930);
  for (const x of [90, 940]) { shadow(c, x + 25, 934, 100, 14); shape(c, () => rrect(c, x, 150, 50, 780, 8), COL.teal, 6); shade(c, () => rrect(c, x, 150, 50, 780, 8), COL.tealDk, 10, 0, 0.5); }
  shape(c, () => rrect(c, 110, 140, 860, 28, 8), COL.wood, 6); shade(c, () => rrect(c, 110, 140, 860, 28, 8), COL.woodDk, 0, 9, 0.7);
  shadow(c, 560, 925, 230, 20);
  for (const [x1, x2] of [[400, 365], [680, 715]]) { line(c, [[x1, 800], [x2, 920]], 38, INK); line(c, [[x1, 800], [x2, 920]], 26, COL.brown); }
  shape(c, () => { c.moveTo(340, 780); c.lineTo(340, 820); c.ellipse(540, 820, 200, 70, 0, Math.PI, 0, true); c.lineTo(740, 780); c.closePath(); }, COL.woodDk, 6);
  shape(c, () => ell(c, 540, 780, 200, 70), COL.wood, 6);
  line(c, [[370, 780], [710, 780]], 14, INK); line(c, [[370, 780], [710, 780]], 7, WHITE);
  const nx = 540 + 450 * Math.sin(0.4), ny = 168 + 450 * Math.cos(0.4);
  line(c, [[540, 168], [540 - (nx - 540), ny]], 5, INK, ); hexNut(c, 540 - (nx - 540), ny, 0.3);
  for (let a = -0.38; a <= 0.38; a += 0.1) shape(c, () => ell(c, 540 + 450 * Math.sin(a), 168 + 450 * Math.cos(a), 5, 5), INK, 0);
  line(c, [[540, 168], [nx, ny]], 9, INK); line(c, [[540, 168], [nx, ny]], 4, "#f4f1e4"); hexNut(c, nx, ny);
  ringArrow(c, 540, 860, 270, 85, 16);
};
// a1: the grown-up is the Sun, the child turns
const flowA1 = (c: Ctx) => {
  ground(c, "#f7ecd3"); floor(c, 930);
  c.beginPath(); polyP(c, [[330, 560], [330, 760], [720, 780], [720, 480]]); c.fillStyle = "rgba(255,226,120,0.35)"; c.fill();
  sunDisc(c, 250, 330, 150);
  shadow(c, 270, 934, 150, 18); shadow(c, 780, 934, 120, 16);
  person(c, 250, 930, 620, { adult: true, armL: [Math.PI * 1.25, Math.PI * 1.1], armR: [-0.9, -0.4] });
  person(c, 780, 930, 470);
  ringArrow(c, 780, 740, 170, 45, 16);
};
// a2: spin on a chair and the room seems to go the other way
const flowA2 = (c: Ctx) => {
  ground(c, "#f1dcb0"); floor(c, 880, "#c9a572");
  shape(c, () => rrect(c, 100, 200, 300, 330, 8), COL.sky, 8);
  line(c, [[250, 200], [250, 530]], 6); line(c, [[100, 365], [400, 365]], 6);
  shape(c, () => rrect(c, 690, 180, 270, 400, 8), COL.wood, 7);
  [250, 360, 470].forEach((y, i) => { line(c, [[700, y + 40], [950, y + 40]], 6); [COL.red, COL.blue, COL.green, COL.purple, COL.orange].forEach((col, j) => shape(c, () => rrect(c, 712 + j * 46, y - 40 + (i % 2) * 8, 34, 80 - (i % 2) * 8, 4), col, 4)); });
  arrow(c, [[900, 100], [180, 100]], RED, 14);
  line(c, [[540, 840], [540, 930]], 40, INK); line(c, [[540, 840], [540, 930]], 26, COL.steel);
  [[400, 990], [540, 1010], [680, 990]].forEach(([x, y]) => { line(c, [[540, 930], [x, y]], 30, INK); line(c, [[540, 930], [x, y]], 18, COL.steel); });
  shape(c, () => rrect(c, 410, 800, 260, 56, 20), COL.tealDk, 6);
  person(c, 540, 820, 520, { sit: true });
  ringArrow(c, 540, 990, 300, 60, 16);
};
// a3: the diary: sunrise and sunset times in a notebook
const sunIcon = (c: Ctx, x: number, y: number, rise: boolean) => {
  for (let i = 0; i < 5; i++) { const a = Math.PI + (i / 4) * Math.PI; line(c, [[x + Math.cos(a) * 50, y + Math.sin(a) * 50], [x + Math.cos(a) * 74, y + Math.sin(a) * 74]], 7, COL.orange); }
  c.save(); c.beginPath(); c.rect(x - 90, y - 90, 180, 90); c.clip(); shape(c, () => ell(c, x, y, 40, 40), rise ? COL.yellow : "#ee7a45", 6); c.restore();
  line(c, [[x - 80, y], [x + 80, y]], 7);
  arrow(c, rise ? [[x, y + 70], [x, y + 28 + 30]] : [[x, y + 28 + 30], [x, y + 70]], RED, 7);
};
const flowA3 = (c: Ctx) => {
  ground(c, "#e8c98a");
  shape(c, () => rrect(c, 70, 150, 470, 760, 14), COL.paper, 7); shape(c, () => rrect(c, 540, 150, 470, 760, 14), COL.paper, 7);
  shade(c, () => rrect(c, 540, 150, 470, 760, 14), "#e6dcc3", 0, 0, 0.0);
  line(c, [[540, 150], [540, 910]], 8);
  for (let i = 0; i < 9; i++) { const y = 200 + i * 80; if (i < 8) { shape(c, () => rrect(c, 520, y, 40, 26, 13), COL.steelDk, 4); } }
  const rows = [["6 05", "6 38"], ["6 06", "6 37"], ["6 07", "6 37"]];
  rows.forEach((r, i) => {
    const y = 330 + i * 190;
    sunIcon(c, 175, y, true); write(c, r[0], 290, y - 40, 70, INK, 8); line(c, [[100, y + 70], [510, y + 70]], 4, COL.grey);
    sunIcon(c, 645, y, false); write(c, r[1], 760, y - 40, 70, INK, 8); line(c, [[570, y + 70], [980, y + 70]], 4, COL.grey);
  });
  line(c, [[1010, 1000], [800, 800]], 44, INK); line(c, [[1010, 1000], [800, 800]], 32, COL.yellow);
  shape(c, () => polyP(c, [[800, 800], [830, 770], [770, 740]]), "#f1d3a0", 5);
  shape(c, () => polyP(c, [[1010, 1000], [1040, 1030], [1060, 1000]]), COL.pink, 5);
};
// a4: the Earth ball, four places with their clocks, two in the light, two in the dark
const flag = (c: Ctx, x: number, y: number) => { line(c, [[x, y], [x, y - 80]], 7); shape(c, () => polyP(c, [[x, y - 80], [x + 52, y - 62], [x, y - 44]]), RED, 5); shape(c, () => ell(c, x, y, 9, 9), INK, 0); };
const flowA4 = (c: Ctx) => {
  ground(c, "#e9dfc8");
  sunDisc(c, 90, 540, 62);
  c.beginPath(); polyP(c, [[160, 500], [160, 580], [540, 790], [540, 330]]); c.fillStyle = "rgba(255,226,120,0.3)"; c.fill();
  globe(c, 560, 560, 240, 1);
  const spots: number[][] = [[450, 470, 230, 170, 10, 0], [440, 700, 230, 930, 3, 30], [680, 470, 870, 170, 11, 45], [690, 690, 870, 930, 4, 15]];
  spots.forEach(([fx, fy, kx, ky, hr, mn], i) => {
    line(c, [[fx, fy - 30], [kx + (kx < 540 ? 80 : -80), ky + (ky < 540 ? 80 : -80)]], 5);
    clockFace(c, kx, ky, 105, hr, mn, i < 2 ? "#fff3c0" : "#8a92c8");
    flag(c, fx, fy);
  });
};
// a5: the Great Bear turned round the Pole Star in two hours
const flowA5 = (c: Ctx) => {
  ground(c, NAVY); starField(c, 31, 40, 20, 20, 1060, 840);
  const px = 600, py = 250, k = 78;
  dipper(c, px, py, k, 0, "#7f8cc4", 0.9);
  star4(c, px, py, 38, COL.yellow); shape(c, () => ell(c, px, py, 14, 14), COL.yellow, 0);
  const P = dipper(c, px, py, k, -0.52, COL.yellow);
  arrow(c, arcPts(px, py, 330, 330, Math.PI / 2 - 0.02, Math.PI / 2 - 0.5, 10), RED, 14);
  c.fillStyle = "#14102a"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  for (let x = 20; x < 1080; x += 70) shape(c, () => rrect(c, x, 870, 40, 40, 4), "#14102a", 5);
  void P;
  clockFace(c, 230, 990, 85, 8, 0, "#9aa6d8"); clockFace(c, 850, 990, 85, 10, 0, COL.yellow);
};
// c1: midnight sun outside the window, a thick curtain, a child asleep
const flowC1 = (c: Ctx) => {
  ground(c, "#4a4478");
  shape(c, () => rrect(c, 110, 130, 520, 540, 10), "#f8dfa8", 9);
  c.save(); c.beginPath(); c.rect(124, 144, 492, 512); c.clip();
  c.fillStyle = "#f6c27a"; c.fillRect(124, 400, 492, 260); c.fillStyle = "#dff0fa"; c.fillRect(124, 560, 492, 100);
  polyP; shape(c, () => polyP(c, [[124, 560], [230, 470], [330, 540], [420, 450], [616, 560]]), "#eef6fb", 5);
  sunDisc(c, 240, 470, 66); c.restore();
  shape(c, () => rrect(c, 110, 130, 520, 540, 10), "rgba(0,0,0,0)", 9);
  line(c, [[370, 144], [370, 656]], 6);
  shape(c, () => rrect(c, 330, 90, 380, 60, 8), COL.steelDk, 6);
  shape(c, () => polyP(c, [[330, 150], [630, 150], [630, 700], [330, 700]]), "#2c2a63", 6);
  for (let x = 380; x < 630; x += 60) line(c, [[x, 160], [x - 6, 690]], 6, "#44418a");
  arrow(c, [[590, 420], [420, 420]], RED, 16);
  floor(c, 930, "#2f2a55");
  shape(c, () => rrect(c, 500, 760, 520, 200, 20), COL.steelDk, 6);
  shape(c, () => rrect(c, 520, 710, 160, 80, 30), WHITE, 6);
  shape(c, () => rrect(c, 700, 790, 300, 140, 22), COL.teal, 6); shade(c, () => rrect(c, 700, 790, 300, 140, 22), COL.tealDk, 0, 30, 0.6);
  shape(c, () => ell(c, 610, 730, 62, 66), SKIN.child, 6);
  shape(c, () => { c.moveTo(548, 722); c.bezierCurveTo(550, 650, 670, 650, 672, 722); c.quadraticCurveTo(610, 690, 548, 722); c.closePath(); }, CLOTH.hair, 5);
  c.beginPath(); c.arc(588, 738, 14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.beginPath(); c.arc(634, 738, 14, 0.2, Math.PI - 0.2); c.stroke();
  shape(c, () => ell(c, 610, 774, 10, 5), INK, 0);
};
// c2: a ball that is warm on the side facing a lamp, felt by a hand; the ball is turned on its stick
const flowC2 = (c: Ctx) => {
  ground(c, "#e9dfc8"); floor(c, 900, "#d9c9a8");
  shadow(c, 230, 905, 170, 16);
  shape(c, () => rrect(c, 80, 880, 300, 24, 6), COL.steelDk, 5);
  line(c, [[230, 880], [230, 540]], 30, INK); line(c, [[230, 880], [230, 540]], 18, COL.steel);
  shape(c, () => polyP(c, [[110, 540], [350, 540], [330, 440], [130, 440]]), COL.red, 6);
  shape(c, () => ell(c, 230, 440, 100, 20), "#fff6c4", 5);
  c.beginPath(); polyP(c, [[160, 450], [300, 450], [600, 800], [330, 770]]); c.fillStyle = "rgba(255,196,80,0.22)"; c.fill();
  for (let i = 0; i < 3; i++) { const y = 540 + i * 70; line(c, [[330, y], [350, y - 20], [370, y], [390, y - 20], [410, y]], 8, COL.orange); }
  pencilV(c, 640, 120, 960);
  fruit(c, 640, 540, 200);
  c.save(); c.beginPath(); ell(c, 640, 540, 200, 200); c.clip(); c.fillStyle = "rgba(60,90,160,0.4)"; c.fillRect(640, 340, 210, 410); c.restore();
  c.beginPath(); ell(c, 640, 540, 200, 200); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  armHand(c, 440, 880, -0.9, 1.3, false, true);
  armHand(c, 640, 1100, -Math.PI / 2, 1.5);
  ringArrow(c, 640, 810, 120, 30, 14);
};

// ------------------------------------------------------------------ terms
const termDay = (c: Ctx) => {
  ground(c, COL.sky); floor(c, 800, "#d8c7a8");
  sunDisc(c, 230, 190, 100);
  house(c, 830, 800, 260, 220); tree(c, 650, 800, 330);
  shadow(c, 880, 812, 170, 14); shadow(c, 700, 808, 80, 10);
  person(c, 420, 960, 440); shadow(c, 450, 965, 70, 12);
  person(c, 200, 960, 600, { adult: true }); shadow(c, 235, 965, 80, 14);
};
const termStar = (c: Ctx) => {
  ground(c, NAVY); starField(c, 9, 40, 20, 20, 1060, 1060);
  star4(c, 900, 170, 14, COL.yellow);
  line(c, [[890, 190], [730, 420]], 5, "#9aa6d8"); line(c, [[910, 190], [905, 450]], 5, "#9aa6d8");
  shape(c, () => ell(c, 560, 640, 330, 330), "#0e1130", 9);
  for (let r = 250; r > 130; r -= 40) { c.beginPath(); ell(c, 560, 640, r, r); c.fillStyle = `rgba(255,214,90,${0.1})`; c.fill(); }
  for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.283, l = i % 2 ? 190 : 230; line(c, [[560 + Math.cos(a) * 130, 640 + Math.sin(a) * 130], [560 + Math.cos(a) * l, 640 + Math.sin(a) * l]], 14, COL.orange); }
  shape(c, () => ell(c, 560, 640, 130, 130), COL.yellow, 7); shine(c, [[500, 590], [530, 560]], 14);
};
const termSpin = (c: Ctx) => {
  ground(c, "#e3d5b8"); shadow(c, 560, 890, 240, 38);
  shape(c, () => rrect(c, 520, 340, 40, 100, 8), COL.wood, 6);
  const body = () => { c.moveTo(320, 520); c.bezierCurveTo(320, 700, 480, 800, 540, 880); c.bezierCurveTo(600, 800, 760, 700, 760, 520); c.closePath(); };
  shape(c, body, COL.teal, 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.red; c.fillRect(300, 560, 480, 60); c.fillStyle = COL.yellow; c.fillRect(300, 660, 480, 50); c.restore();
  shade(c, body, COL.tealDk, 40, 0, 0.45);
  c.beginPath(); body(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 540, 520, 220, 56), COL.orange, 7);
  shape(c, () => ell(c, 540, 440, 36, 26), COL.wood, 6);
  ringArrow(c, 540, 650, 300, 90, 16);
};
const termAxis = (c: Ctx) => {
  ground(c, "#efe4cf");
  pencilV(c, 540, 60, 1020);
  fruit(c, 540, 500, 230);
  armHand(c, 540, 1100, -Math.PI / 2, 1.5);
  ringArrow(c, 540, 810, 150, 40, 16);
};
const termPoles = (c: Ctx) => {
  ground(c, "#efe4cf"); shadow(c, 560, 960, 220, 20);
  line(c, [[540, 150], [540, 930]], 12, INK); line(c, [[540, 150], [540, 930]], 5, WHITE);
  globe(c, 540, 540, 270);
  line(c, [[540, 270], [540, 810]], 12, INK); line(c, [[540, 270], [540, 810]], 5, WHITE);
  line(c, [[540, 150], [540, 40]], 8); shape(c, () => polyP(c, [[540, 40], [660, 80], [540, 120]]), RED, 6);
  line(c, [[540, 930], [540, 1040]], 8); shape(c, () => polyP(c, [[540, 1040], [660, 1000], [540, 960]]), COL.blue, 6);
};
const termNoon = (c: Ctx) => {
  ground(c, COL.sky); floor(c, 860, "#d8c7a8");
  sunDisc(c, 540, 170, 100);
  for (const x of [400, 540, 680]) { c.globalAlpha = 0.45; line(c, [[x, 330], [x, 560]], 12, COL.yellow); c.globalAlpha = 1; }
  shadow(c, 550, 962, 70, 12);
  person(c, 540, 960, 520);
  clockFace(c, 900, 190, 100, 12, 0);
};
const termHorizon = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = "#e4f3fb"; c.fillRect(0, 400, D, 170);
  c.fillStyle = COL.blue; c.fillRect(0, 570, D, 520);
  line(c, [[0, 570], [D, 570]], 9);
  [[240, 700, 160], [700, 800, 200], [880, 660, 120], [400, 940, 220]].forEach(([x, y, w]) => line(c, [[x - w / 2, y], [x - w / 4, y - 14], [x, y], [x + w / 4, y - 14], [x + w / 2, y]], 7, "#cfe6fa"));
  shape(c, () => ell(c, 250, 220, 90, 40), WHITE, 6); shape(c, () => ell(c, 330, 200, 70, 34), WHITE, 6); shape(c, () => ell(c, 800, 270, 100, 40), WHITE, 6);
  arrow(c, [[540, 260], [540, 540]], RED, 18);
};
const termEastWest = (c: Ctx) => {
  ground(c, "#f6d6a0"); c.fillStyle = "#bfe0f5"; c.fillRect(540, 0, 540, 700); c.fillStyle = "#f4a787"; c.fillRect(0, 0, 540, 700);
  c.fillStyle = "#f6dc8d"; c.fillRect(540, 480, 540, 220);
  c.save(); c.beginPath(); c.rect(0, 0, D, 700); c.clip();
  sunDisc(c, 170, 690, 100); sunDisc(c, 910, 690, 100); c.restore();
  c.fillStyle = HILL; c.fillRect(0, 700, D, 400); line(c, [[0, 700], [D, 700]], 7);
  arrow(c, [[170, 330], [170, 540]], RED, 16); arrow(c, [[910, 540], [910, 330]], RED, 16);
  // a child seen from behind, arms out
  const x = 540;
  line(c, [[x - 28, 860], [x - 28, 1040]], 44, INK); line(c, [[x - 28, 860], [x - 28, 1040]], 32, "#6b5a8c");
  line(c, [[x + 28, 860], [x + 28, 1040]], 44, INK); line(c, [[x + 28, 860], [x + 28, 1040]], 32, "#6b5a8c");
  line(c, [[x - 70, 760], [x - 250, 740]], 52, INK); line(c, [[x - 70, 760], [x - 250, 740]], 40, CLOTH.child);
  line(c, [[x + 70, 760], [x + 250, 740]], 52, INK); line(c, [[x + 70, 760], [x + 250, 740]], 40, CLOTH.child);
  shape(c, () => ell(c, x - 270, 738, 28, 28), SKIN.child, 6); shape(c, () => ell(c, x + 270, 738, 28, 28), SKIN.child, 6);
  shape(c, () => rrect(c, x - 90, 720, 180, 180, 40), CLOTH.child, 6);
  shape(c, () => ell(c, x, 660, 78, 82), CLOTH.hair, 6);
};
const termDayNightLine = (c: Ctx) => {
  ground(c, NAVY); sunDisc(c, 100, 540, 66);
  for (const y of [420, 540, 660]) { c.globalAlpha = 0.35; line(c, [[190, y], [300, y]], 10, COL.yellow); c.globalAlpha = 1; }
  globe(c, 600, 540, 300, 1);
  arrow(c, [[930, 190], [640, 330]], RED, 16); arrow(c, [[930, 900], [640, 760]], RED, 16);
  line(c, [[600, 250], [600, 830]], 6, WHITE);
};
const termApparent = (c: Ctx) => {
  ground(c, "#c9b99a");
  c.save(); c.beginPath(); c.rect(80, 150, 920, 640); c.clip();
  c.fillStyle = COL.sky; c.fillRect(80, 150, 920, 420); c.fillStyle = HILL; c.fillRect(80, 520, 920, 270);
  [160, 520, 900].forEach((x) => { tree(c, x, 700, 300); arrow(c, [[x + 70, 300], [x - 70, 300]], RED, 12); });
  c.restore();
  shape(c, () => rrect(c, 80, 150, 920, 640, 12), "rgba(0,0,0,0)", 14);
  person(c, 700, 1080, 640);
  c.fillStyle = "#6a5a8c"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 8);
  shape(c, () => rrect(c, 40, 780, 1000, 40, 8), COL.woodDk, 7);
  arrow(c, [[640, 940], [960, 940]], RED, 18);
};
const termShadow = (c: Ctx) => {
  ground(c, "#f8dfa8"); floor(c, 800, "#d8c7a8");
  sunDisc(c, 150, 170, 90);
  c.beginPath(); polyP(c, [[400, 878], [500, 878], [950, 960], [950, 900]]); c.fillStyle = "rgba(43,35,64,0.5)"; c.fill();
  c.beginPath(); ell(c, 990, 925, 52, 34); c.fill();
  person(c, 460, 890, 540);
};
const termPoleStar = (c: Ctx) => {
  ground(c, NAVY); starField(c, 17, 45, 20, 20, 1060, 1060);
  const px = 700, py = 170, k = 90;
  dipper(c, px, py, k, 0, COL.yellow);
  const merak = [px, py + 6.2 * k], dubhe = [px, py + 5.2 * k];
  star4(c, px, py, 52, COL.yellow); shape(c, () => ell(c, px, py, 16, 16), COL.yellow, 0);
  for (const [x, y] of [merak, dubhe]) { c.beginPath(); ell(c, x, y, 30, 30); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); }
  arrow(c, [[px, merak[1] - 60], [px, py + 90]], RED, 12);
  c.fillStyle = "#14102a"; c.fillRect(0, 940, D, 140); line(c, [[0, 940], [D, 940]], 6);
};
const termOrbit = (c: Ctx) => {
  ground(c, NAVY); starField(c, 5, 25, 20, 20, 1060, 1060);
  for (let i = 0; i < 40; i++) { const a = (i / 40) * 6.283; shape(c, () => ell(c, 540 + 400 * Math.cos(a), 540 + 280 * Math.sin(a), 6, 6), "#9aa6d8", 0); }
  sunDisc(c, 540, 540, 120);
  const ex = 540 + 400 * Math.cos(0.5), ey = 540 + 280 * Math.sin(0.5);
  globe(c, ex, ey, 80);
  arrow(c, arcPts(540, 540, 400, 280, -0.15, -0.95, 8), RED, 14);
  arrow(c, arcPts(ex, ey - 12, 100, 100, Math.PI * 1.2, Math.PI * 1.8, 8), RED, 10);
};
const termBodyClock = (c: Ctx) => {
  ground(c, NAVY); starField(c, 12, 14, 20, 20, 1060, 300);
  shape(c, () => polyP(c, [[860, 100], [980, 100], [980, 220], [940, 140]]), NAVY, 0); c.beginPath(); ell(c, 900, 160, 60, 60); c.fillStyle = "#ffe9a8"; c.fill(); c.beginPath(); ell(c, 925, 140, 52, 52); c.fillStyle = NAVY; c.fill();
  shape(c, () => rrect(c, 90, 840, 900, 240, 40), WHITE, 7);
  shape(c, () => rrect(c, 150, 940, 780, 160, 30), COL.teal, 7);
  shape(c, () => ell(c, 540, 560, 270, 300), SKIN.child, 7);
  shape(c, () => { c.moveTo(270, 540); c.bezierCurveTo(270, 200, 810, 200, 810, 540); c.quadraticCurveTo(540, 350, 270, 540); c.closePath(); }, CLOTH.hair, 7);
  for (const x of [440, 640]) { c.beginPath(); c.arc(x, 620, 38, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 8; c.stroke(); }
  c.beginPath(); c.arc(540, 720, 38, 0.2, Math.PI - 0.2); c.stroke();
  c.beginPath(); ell(c, 540, 500, 110, 110); c.fillStyle = "rgba(255,226,120,0.45)"; c.fill();
  clockFace(c, 540, 500, 76, 10, 10, "#fff3c0");
};

// ------------------------------------------------------------------ explanations
const explSpin = (c: Ctx) => {
  ground(c, "#e9dfc8");
  line(c, [[330, 120], [330, 950]], 12, INK); line(c, [[330, 120], [330, 950]], 5, WHITE);
  globe(c, 330, 540, 250);
  line(c, [[330, 240], [330, 840]], 12, INK); line(c, [[330, 240], [330, 840]], 5, WHITE);
  ringArrow(c, 330, 800, 260, 60, 16);
  clockFace(c, 780, 460, 170, 12, 0);
  arrow(c, arcPts(780, 460, 215, 215, -Math.PI / 2 + 0.2, Math.PI * 1.5 - 0.35, 24), RED, 16);
  write(c, "24", 700, 760, 120, INK, 12);
};
const explSeems = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = HILL; c.fillRect(0, 740, D, 340); line(c, [[0, 740], [D, 740]], 7);
  for (let i = 0; i <= 30; i++) { const t = Math.PI - (i / 30) * Math.PI; shape(c, () => ell(c, 540 + 400 * Math.cos(t), 720 - 540 * Math.sin(t), 7, 7), COL.orange, 0); }
  sunDisc(c, 140, 700, 60); sunDisc(c, 540, 180, 70); sunDisc(c, 940, 700, 60);
  arrow(c, arcPts(540, 720, 330, 430, Math.PI * 1.2, Math.PI * 1.5, 8), RED, 14);
  house(c, 540, 960, 260, 180);
  tree(c, 330, 900, 280); tree(c, 760, 900, 280);
};
const explBoat = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = HILL; c.fillRect(0, 480, D, 180); line(c, [[0, 480], [D, 480]], 6);
  [150, 390, 650, 900].forEach((x) => { tree(c, x, 640, 330); arrow(c, [[x + 60, 250], [x - 60, 250]], RED, 12); });
  c.fillStyle = COL.water; c.fillRect(0, 660, D, 420); line(c, [[0, 660], [D, 660]], 7);
  [[200, 780], [880, 760], [150, 960], [900, 990]].forEach(([x, y]) => line(c, [[x - 70, y], [x - 35, y - 14], [x, y], [x + 35, y - 14], [x + 70, y]], 7, "#d6ecfb"));
  person(c, 540, 800, 420, { sit: true, adult: true });
  shape(c, () => { c.moveTo(220, 770); c.quadraticCurveTo(330, 800, 400, 930); c.lineTo(700, 930); c.quadraticCurveTo(770, 800, 860, 770); c.closePath(); }, COL.brown, 7);
  shade(c, () => { c.moveTo(220, 770); c.quadraticCurveTo(330, 800, 400, 930); c.lineTo(700, 930); c.quadraticCurveTo(770, 800, 860, 770); c.closePath(); }, "#7a4f2a", 0, 40, 0.5);
  arrow(c, [[300, 1030], [760, 1030]], RED, 16);
};
const explTogether = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => ell(c, 540, 1600, 900, 900), COL.blue, 8);
  c.save(); c.beginPath(); ell(c, 540, 1600, 900, 900); c.clip(); shape(c, () => ell(c, 540, 1620, 860, 880), HILL, 0); c.restore();
  c.beginPath(); ell(c, 540, 1600, 900, 900); c.lineWidth = 9; c.strokeStyle = INK; c.stroke();
  tree(c, 210, 790, 330); house(c, 850, 780, 260, 200); person(c, 540, 770, 380);
  [210, 540, 850].forEach((x) => arrow(c, [[x - 90, 280], [x + 90, 280]], RED, 14));
  [210, 540, 850].forEach((x) => line(c, [[x, 330], [x, 420]], 5, COL.grey));
};
const explPendulum = (c: Ctx) => {
  ground(c, "#efe4cf");
  shape(c, () => rrect(c, 0, 0, D, 70, 0), COL.steelDk, 6);
  shape(c, () => ell(c, 540, 930, 450, 130), "#d8c7a8", 7);
  const n = 20;
  for (let i = 0; i < n; i++) { const t = (i / n) * 6.283, x = 540 + 380 * Math.cos(t), y = 930 + 100 * Math.sin(t), fallen = i >= 3 && i <= 5; if (fallen) shape(c, () => polyP(c, [[x - 12, y + 6], [x + 22, y - 6], [x + 28, y + 12], [x - 6, y + 22]]), COL.red, 4); else shape(c, () => rrect(c, x - 11, y - 46, 22, 50, 4), COL.red, 4); }
  const bx = 640, by = 700;
  line(c, [[540, 70], [bx, by]], 6, INK);
  shape(c, () => ell(c, bx, by + 60, 66, 66), COL.orange, 7); shine(c, [[bx - 30, by + 30], [bx - 14, by + 14]], 12);
  arrow(c, arcPts(540, 930, 280, 78, Math.PI * 1.1, Math.PI * 1.85, 10), RED, 14);
};
const explSunrise = (c: Ctx) => {
  ground(c, NAVY);
  const panel = (x0: number, sky: string, sun: number, ground2: string) => {
    c.save(); c.beginPath(); c.rect(x0, 0, 360, D); c.clip();
    c.fillStyle = sky; c.fillRect(x0, 0, 360, 760);
    if (sun === 2) sunDisc(c, x0 + 180, 480, 80);
    if (sun === 1) sunDisc(c, x0 + 180, 750, 80);
    if (sun === 0) { starField(c, x0, 8, x0 + 20, 20, x0 + 340, 400); c.beginPath(); ell(c, x0 + 230, 380, 60, 60); c.fillStyle = "#ffe9a8"; c.fill(); c.beginPath(); ell(c, x0 + 255, 362, 54, 54); c.fillStyle = sky; c.fill(); }
    c.fillStyle = ground2; c.fillRect(x0, 760, 360, 320); line(c, [[x0, 760], [x0 + 360, 760]], 7);
    house(c, x0 + 180, 960, 190, 130);
    c.restore();
  };
  panel(0, NAVY, 0, "#2f5a3a"); panel(360, "#f4a787", 1, "#6a9a4a"); panel(720, COL.sky, 2, HILL);
  line(c, [[360, 0], [360, D]], 10); line(c, [[720, 0], [720, D]], 10);
  arrow(c, [[960, 150], [120, 150]], RED, 18);
};

export const ic_dayNightSeasonsDayAndNightL3 = cards("sci.day-night-seasons.day-and-night.L3 cards", [
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowA5, flowC1, flowC2,
  termDay, termStar, termSpin, termAxis, termPoles, termNoon, termHorizon, termEastWest, termDayNightLine, termApparent, termShadow, termPoleStar, termOrbit, termBodyClock,
  explSpin, explSeems, explBoat, explTogether, explPendulum, explSunrise,
]);
void barefoot; void SKIN;
