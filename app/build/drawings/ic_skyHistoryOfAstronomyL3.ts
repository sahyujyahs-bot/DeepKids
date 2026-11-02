import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.sky.history-of-astronomy.L3 · picture cards (activities, terms, explanations).
// Night sky is deep blue, the Moon pale yellow, clay tablets tan, copper bowls orange. Child and grown-up as on the set-up cards.

const NIGHT = "#2e3a73", NIGHT2 = "#44559a", DAYSKY = "#bfe0f5", MOONC = "#fff1b8", CLAY = "#d9a46a", CLAYDK = "#b57f46";
const COPPER = "#d9803f", COPPERDK = "#ab5a26", BRASS = "#e8bb4e", BRASSDK = "#c4952f", STAR = "#ffe27a", CREAM = "#f7efe0";

const ring = (c: Ctx, x: number, y: number, r: number, w = 5, col = INK) => { c.beginPath(); ell(c, x, y, r, r); c.lineWidth = w; c.strokeStyle = col; c.stroke(); };
const star5 = (c: Ctx, x: number, y: number, r: number, col = STAR) => shape(c, () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.46 : r; i ? c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) : c.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } c.closePath(); }, col, Math.max(2, r * 0.12));
const dotStar = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = STAR; c.fill(); };
const nightSky = (c: Ctx, x: number, y: number, w: number, h: number, seed = 3, n = 30) => {
  c.fillStyle = NIGHT; c.fillRect(x, y, w, h); const r = rnd(seed);
  for (let i = 0; i < n; i++) dotStar(c, x + 20 + r() * (w - 40), y + 20 + r() * (h - 40), 3 + r() * 4);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]], Math.max(6, r * 0.12), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.5); ring(c, x, y, r, 6);
};
// the Moon: p 0 new, 0.5 half, 1 full; waxing is lit on the right, waning on the left
const moon = (c: Ctx, x: number, y: number, r: number, p: number, waning = false, dark = NIGHT2) => {
  shape(c, () => ell(c, x, y, r, r), dark, 0);
  const s = waning ? -1 : 1, t = r * Math.cos(Math.PI * p);
  shape(c, () => { for (let k = 0; k <= 24; k++) { const a = -Math.PI / 2 + (Math.PI * k) / 24; k ? c.lineTo(x + s * r * Math.cos(a), y + r * Math.sin(a)) : c.moveTo(x + s * r * Math.cos(a), y + r * Math.sin(a)); } for (let k = 0; k <= 24; k++) { const a = Math.PI / 2 - (Math.PI * k) / 24; c.lineTo(x + s * t * Math.cos(a), y + r * Math.sin(a)); } c.closePath(); }, MOONC, 0);
  ring(c, x, y, r, 5);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, COL.blue, 0);
  c.save(); c.beginPath(); p(); c.clip();
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.2, r * 0.42, r * 0.3, 0.5), COL.green, 4); shape(c, () => ell(c, x + r * 0.35, y + r * 0.35, r * 0.34, r * 0.24, -0.4), COL.green, 4);
  c.restore(); shade(c, p, COL.blueDk, r * 0.3, r * 0.3, 0.5); ring(c, x, y, r, 6);
};
const wrist = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.71, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const closedEyes = (c: Ctx, x: number, y: number, h: number, adult = false) => {
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  for (const s of [-1, 1]) { const ex = x + s * head * 0.35, ey = hy + head * 0.12; shape(c, () => ell(c, ex, ey, head * 0.17, head * 0.2), adult ? SKIN.adult : SKIN.child, 0); c.beginPath(); c.arc(ex, ey - head * 0.06, head * 0.15, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
const stopwatch = (c: Ctx, x: number, y: number, r: number, ang: number) => {
  shadow(c, x + r * 0.1, y + r * 1.05, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.15, y - r * 1.3, r * 0.3, r * 0.32, 6), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6); shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.sin(a) * r * 0.7, y - Math.cos(a) * r * 0.7], [x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8]], i % 3 ? 4 : 7); }
  line(c, [[x, y], [x + Math.sin(ang) * r * 0.62, y - Math.cos(ang) * r * 0.62]], Math.max(6, r * 0.05), RED); shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
const tree = (c: Ctx, x: number, y: number, s: number, kind: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[-14, 0], [14, 0], [8, -90], [-8, -90]]), COL.brown, 5);
  if (kind === 3) { for (const [a, b] of [[-60, -150], [0, -170], [60, -145], [-30, -120], [35, -120]]) { line(c, [[0, -80], [a, b]], 11, INK); line(c, [[0, -80], [a, b]], 6, COL.brown); } }
  else { const col = kind === 0 ? COL.leaf : kind === 1 ? COL.orange : COL.greenLt; shape(c, () => { ell(c, 0, -140, 85, 65); }, col, 5); shape(c, () => ell(c, -50, -110, 50, 40), col, 5); shape(c, () => ell(c, 50, -110, 50, 40), col, 5);
    if (kind === 0) for (const [a, b] of [[-40, -140], [30, -165], [55, -115], [-5, -105]]) shape(c, () => ell(c, a, b, 14, 18), COL.yellow, 3); }
  c.restore();
};
// water vessel in cut-away: solid walls, cream inside, water up to yw
const vessel = (c: Ctx, x0: number, y0: number, x1: number, y1: number, yw: number, inner: () => void, wall: string = COL.steel) => {
  shadow(c, (x0 + x1) / 2 + 20, y1 + 8, (x1 - x0) / 2 + 10, 20);
  shape(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 26), wall, 6);
  const q = () => rrect(c, x0 + 22, y0 - 4, x1 - x0 - 44, y1 - y0 - 22, 10);
  shape(c, q, CREAM, 0);
  c.save(); c.beginPath(); q(); c.clip(); c.fillStyle = COL.water; c.fillRect(x0, yw, x1 - x0, y1 - yw); inner(); c.fillStyle = "rgba(143,195,234,0.5)"; c.fillRect(x0, yw, x1 - x0, y1 - yw); c.restore();
  line(c, [[x0 + 22, yw], [x1 - 22, yw]], 5, WHITE); c.beginPath(); q(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
};
const cup = (c: Ctx, x: number, yb: number, w: number, h: number, fill: number) => {
  const p = () => { c.moveTo(x - w / 2, yb - h); c.lineTo(x + w / 2, yb - h); c.lineTo(x + w * 0.38, yb); c.lineTo(x - w * 0.38, yb); c.closePath(); };
  shape(c, p, "#f1f5fa", 0);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, yb - h * fill, w * 2, h * fill + 4); c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6); shape(c, () => ell(c, x, yb - h, w / 2, w * 0.07), "rgba(255,255,255,0.4)", 5);
  shape(c, () => ell(c, x, yb, w * 0.07, 6), INK, 0);
  arrow(c, [[x, yb + 85], [x, yb + 16]], RED, 9);
};
const bowlC = (c: Ctx, x: number, ry: number, r: number, fill: number) => {
  const p = () => { c.moveTo(x - r, ry); c.bezierCurveTo(x - r * 0.9, ry + r * 0.85, x + r * 0.9, ry + r * 0.85, x + r, ry); c.closePath(); };
  shape(c, p, COPPER, 0);
  c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = COL.waterDk; c.fillRect(x - r, ry + r * 0.64 * (1 - fill), r * 2, r); c.restore();
  shape(c, p, "rgba(0,0,0,0)", 6); shade(c, p, COPPERDK, r * 0.3, 0, 0.35);
  shape(c, () => ell(c, x, ry, r, r * 0.16), "#f6c79a", 5); shape(c, () => ell(c, x, ry + r * 0.8, r * 0.07, 5), INK, 0);
  arrow(c, [[x, ry + r * 0.8 + 85], [x, ry + r * 0.8 + 14]], RED, 9);
};
const waterClock = (c: Ctx, x: number, y: number, s: number) => { // a copper bowl floating in a brass pot
  c.save(); c.translate(x, y); c.scale(s, s);
  vessel(c, -300, -200, 300, 200, -80, () => bowlC(c, 0, -125, 130, 0.45), BRASS);
  c.restore();
};
const wedge = (c: Ctx, x: number, y: number, s: number, rot: number, col = CLAYDK) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[-16, -10], [20, 0], [-16, 10]]), col, 0);
  c.restore();
};
const tablet = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 14, h / 2 + 14, w / 2, h * 0.08);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 36), CLAY, 6); shade(c, () => rrect(c, -w / 2, -h / 2, w, h, 36), CLAYDK, 16, 18, 0.5);
  const r = rnd(5);
  for (let row = 0; row < 4; row++) for (let k = 0; k < 6; k++) wedge(c, -w * 0.33 + k * w * 0.12 + r() * 6, -h * 0.3 + row * h * 0.2, w / 420, r() < 0.5 ? 0 : Math.PI / 2 + (r() - 0.5) * 0.4, "#8a5a2c");
  c.restore();
};
const calGrid = (c: Ctx, x: number, y: number, cell: number, cols: number, rows: number, moons: Record<number, number>, nums = true) => {
  shape(c, () => rrect(c, x - 8, y - 8, cols * cell + 16, rows * cell + 16, 10), WHITE, 6);
  for (let i = 0; i < cols * rows; i++) {
    const cx = x + (i % cols) * cell, cy = y + Math.floor(i / cols) * cell;
    c.lineWidth = 2.5; c.strokeStyle = "#8d8aa0"; c.strokeRect(cx, cy, cell, cell);
    if (nums && i < 31) write(c, String(i + 1), cx + 8, cy + 8, cell * 0.24, INK, 3);
    if (moons[i] !== undefined) moon(c, cx + cell / 2, cy + cell * 0.62, cell * 0.3, moons[i]);
  }
};
const palmHand = (c: Ctx, x: number, y: number, s: number, up: boolean[], thumb: "touch" | "up" | "none", flip = false) => {
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  const H = [170, 195, 185, 150], sk = SKIN.child;
  if (thumb === "up") shape(c, () => { c.moveTo(-95, 150); c.quadraticCurveTo(-170, 120, -170, 40); c.arc(-146, 40, 24, Math.PI, 0); c.quadraticCurveTo(-120, 100, -70, 130); c.closePath(); }, sk, 6);
  for (let i = 0; i < 4; i++) {
    const cx = -75 + i * 50;
    if (up[i]) { shape(c, () => rrect(c, cx - 23, 10 - H[i], 46, H[i] + 40, 23), sk, 6); line(c, [[cx - 23, 10 - H[i] * 0.34 * 0], [cx - 23, 10]], 1, sk); for (const f of [1 / 3, 2 / 3]) line(c, [[cx - 18, 10 - H[i] * f], [cx + 18, 10 - H[i] * f]], 4, SKIN.childDk); }
    else shape(c, () => rrect(c, cx - 23, -30, 46, 80, 23), sk, 6);
  }
  shape(c, () => rrect(c, -100, 10, 200, 190, 40), sk, 6); shade(c, () => rrect(c, -100, 10, 200, 190, 40), SKIN.childDk, 18, 0, 0.4);
  shape(c, () => rrect(c, -90, 190, 180, 90, 8), CLOTH.child, 6);
  if (thumb === "touch") { line(c, [[-95, 150], [-125, 80], [-80, -10]], 50, INK); line(c, [[-95, 150], [-125, 80], [-80, -10]], 38, sk); shape(c, () => ell(c, -78, -52 - 0, 24, 24), sk, 0); ring(c, -75, -52, 24, 5); }
  c.restore();
};

// ------------------------------------------------------------------ activities and projects
const e1 = (c: Ctx) => { ground(c);
  vessel(c, 190, 390, 890, 900, 540, () => cup(c, 540, 680, 300, 230, 0.35));
  shape(c, () => ell(c, 410, 480, 24, 24), BRASS, 4); shape(c, () => ell(c, 410, 508, 24, 24), BRASS, 4);
  stopwatch(c, 810, 240, 110, 2.2);
  arrow(c, [[540, 240], [540, 340]]);
};
const fist = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.95), SKIN.child, 6); for (const k of [-1, 0, 1]) line(c, [[x + r * 0.1, y + k * r * 0.4], [x + r * 0.7, y + k * r * 0.4]], 4, SKIN.childDk); };
const e2 = (c: Ctx) => { ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(840, 0, 240, D); line(c, [[840, 0], [840, D]], 6);
  c.fillStyle = "#c7b184"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  for (const y of [360, 640]) { shape(c, () => ell(c, 960, y, 26, 26), RED, 5); }
  const kid: [number, number] = [-0.03, -0.03], ad: [number, number] = [-0.05, -0.05];
  person(c, 120, 900, 520, { armR: kid, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  person(c, 560, 900, 700, { adult: true, armR: ad, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const w1 = wrist(120, 900, 520, 1, kid), w2 = wrist(560, 900, 700, 1, ad);
  fist(c, w1[0] + 20, w1[1], 30); fist(c, w2[0] + 24, w2[1], 40);
};
const e3 = (c: Ctx) => { ground(c);
  shape(c, () => rrect(c, -20, 800, 1120, 70, 4), COL.wood, 6);
  shape(c, () => rrect(c, 520, 730, 480, 70, 14), COL.steel, 6); shape(c, () => rrect(c, 540, 770, 440, 30, 6), COL.water, 0);
  const bx = 260, by = 800, bw = 250, bh = 580;
  const bp = () => { c.moveTo(bx - bw / 2 + 24, by); c.lineTo(bx + bw / 2 - 24, by); c.quadraticCurveTo(bx + bw / 2, by, bx + bw / 2, by - 24); c.lineTo(bx + bw / 2, by - bh * 0.62); c.quadraticCurveTo(bx + 50, by - bh * 0.78, bx + 44, by - bh * 0.84); c.lineTo(bx + 44, by - bh); c.lineTo(bx - 44, by - bh); c.lineTo(bx - 44, by - bh * 0.84); c.quadraticCurveTo(bx - 50, by - bh * 0.78, bx - bw / 2, by - bh * 0.62); c.lineTo(bx - bw / 2, by - 24); c.quadraticCurveTo(bx - bw / 2, by, bx - bw / 2 + 24, by); c.closePath(); };
  shape(c, bp, "#eaf3fa", 0); c.save(); c.beginPath(); bp(); c.clip(); c.fillStyle = COL.water; c.fillRect(bx - bw, by - 360, bw * 2, 370); c.restore();
  line(c, [[bx - bw / 2 + 6, by - 360], [bx + bw / 2 - 6, by - 360]], 5, WHITE); shape(c, bp, "rgba(0,0,0,0)", 6); shine(c, [[bx - 80, by - 300], [bx - 80, by - 40]], 9);
  for (const m of [-330, -250, -170]) line(c, [[bx + bw / 2 - 40, by + m], [bx + bw / 2 + 14, by + m]], 8, RED);
  shape(c, () => ell(c, bx + bw / 2, by - 110, 7, 7), INK, 0);
  const pts: number[][] = []; for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push([bx + bw / 2 + t * 420, by - 110 + t * t * 55]); }
  line(c, pts, 18, INK); line(c, pts, 10, COL.water);
  arrow(c, [[bx - bw / 2 - 50, by - 380], [bx - bw / 2 - 50, by - 150]]);
};
const a1 = (c: Ctx) => { ground(c);
  person(c, 170, 1010, 560); closedEyes(c, 170, 1010, 560);
  person(c, 910, 1010, 680, { adult: true });
  stopwatch(c, 540, 470, 215, 3.4);
};
const a2 = (c: Ctx) => { ground(c);
  shadow(c, 560, 950, 400, 36);
  shape(c, () => ell(c, 540, 540, 430, 430), COL.steel, 6);
  const day = () => { c.moveTo(540 - 380, 540); c.arc(540, 540, 380, Math.PI, 0); c.closePath(); }, night = () => { c.moveTo(540 - 380, 540); c.arc(540, 540, 380, Math.PI, 0, true); c.closePath(); };
  shape(c, day, COL.yellow, 0); shape(c, night, NIGHT, 0);
  const r = rnd(8); for (let i = 0; i < 14; i++) { const a = 0.2 + r() * 2.7, d = 120 + r() * 220; dotStar(c, 540 + Math.cos(a) * -d * 1 + 0, 540 + Math.sin(a) * d, 4 + r() * 3); }
  for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30; line(c, [[540 + Math.cos(a) * 250, 540 + Math.sin(a) * 250], [540 + Math.cos(a) * 380, 540 + Math.sin(a) * 380]], i % 5 ? 3 : 5, INK); }
  ring(c, 540, 540, 380, 6); line(c, [[160, 540], [920, 540]], 6);
  sun(c, 540, 330, 60); moon(c, 540, 760, 62, 0.75);
  arrow(c, Array.from({ length: 12 }, (_, k) => { const a = -1.3 + k * 0.2; return [540 + Math.cos(a) * 462, 540 + Math.sin(a) * 462]; }));
};
const a3 = (c: Ctx) => { ground(c);
  palmHand(c, 300, 560, 1.15, [true, true, true, true], "touch");
  palmHand(c, 790, 560, 1.15, [true, true, false, false], "up", true);
  shape(c, () => ell(c, 245, 450, 18, 18), RED, 3);
  write(c, "12", 150, 100, 110, INK, 12);
  arrow(c, [[400, 180], [690, 180]]);
};
const a4 = (c: Ctx) => { ground(c);
  for (const [x0, col] of [[0, "#cfe8f7"], [540, "#bfe0f5"]] as [number, string][]) { c.fillStyle = col; c.fillRect(x0, 0, 540, 800); c.fillStyle = "#c7b184"; c.fillRect(x0, 800, 540, 280); }
  line(c, [[0, 800], [D, 800]], 6); line(c, [[540, 0], [540, D]], 8);
  sun(c, 130, 150, 55); sun(c, 670, 150, 55);
  const stick = (x: number, len: number) => { shape(c, () => rrect(c, x - 10, 800 - 330, 20, 330, 6), COL.wood, 5); shape(c, () => polyP(c, [[x - 10, 800], [x + len, 806], [x + len + 6, 826], [x - 10, 826]]), "#8c7650", 4); shape(c, () => rrect(c, x - 36, 790, 72, 26, 8), COL.grey, 5); };
  stick(240, 150); stick(780, 400);
  shape(c, () => rrect(c, 470, 330, 140, 240, 24), COL.black, 6); shape(c, () => rrect(c, 484, 352, 112, 190, 8), COL.sky, 3);
  line(c, [[520, 520], [520, 400]], 8, COL.wood); line(c, [[520, 520], [570, 520]], 8, INK);
};
const a5 = (c: Ctx) => { ground(c);
  tablet(c, 520, 600, 720, 560, -0.05);
  moon(c, 380, 560, 70, 0.22); star5(c, 650, 590, 52, "#fff1b8");
  hand(c, 830, 230, 2.3, 1.5, SKIN.child, CLOTH.child);
  line(c, [[748, 300], [610, 440]], 14, INK); line(c, [[748, 300], [610, 440]], 7, COL.green);
};
const p1 = (c: Ctx) => { ground(c);
  const x0 = 140, y0 = 130, w = 800, h = 820;
  shape(c, () => rrect(c, x0, y0, w, h, 14), COL.wood, 8);
  c.save(); c.beginPath(); rrect(c, x0 + 36, y0 + 36, w - 72, h - 72, 6); c.clip();
  c.fillStyle = "#f6a65d"; c.fillRect(0, 0, D, D); c.fillStyle = "#f4cf77"; c.fillRect(0, 560, D, 140); c.fillStyle = "#e98a6f"; c.fillRect(0, 0, D, 360);
  shape(c, () => ell(c, 400, 760, 80, 80), COL.yellow, 5);
  c.fillStyle = "#4a3f6b"; for (const [bx, by, bw] of [[176, 660, 150], [310, 700, 80], [560, 600, 140], [700, 670, 150]] as number[][]) { c.fillRect(bx, by, bw, 400); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(bx, by, bw, 400); }
  c.fillStyle = "#4a3f6b"; c.fillRect(150, 820, 800, 150); c.restore();
  shape(c, () => rrect(c, x0 + 36, y0 + 36, w - 72, h - 72, 6), "rgba(0,0,0,0)", 6);
  line(c, [[x0 + w / 2, y0 + 36], [x0 + w / 2, y0 + h - 36]], 14, COL.wood); line(c, [[x0 + 36, y0 + h * 0.5], [x0 + w - 36, y0 + h * 0.5]], 14, COL.wood);
  [330, 392, 452, 508, 560].forEach((tx, i) => { shape(c, () => rrect(c, tx - 20, 600, 40, 46, 4), "#fffaf0", 4); line(c, [[tx, 600], [tx, 646]], 4, RED); void i; });
  arrow(c, [[300, 560], [640, 560]]);
};
const c1 = (c: Ctx) => { ground(c);
  vessel(c, 90, 400, 560, 880, 530, () => cup(c, 325, 690, 230, 190, 0.3));
  stopwatch(c, 810, 420, 190, 3.3);
  write(c, "3", 730, 690, 130, INK, 14);
  line(c, [[860, 780], [910, 830], [1000, 730]], 18, INK); line(c, [[860, 780], [910, 830], [1000, 730]], 10, COL.green);
};
const c2 = (c: Ctx) => { ground(c);
  line(c, [[120, 650], [330, 530]], 40, INK); line(c, [[120, 650], [330, 530]], 28, COL.pink); 
  shape(c, () => ell(c, 230, 590, 150, 150), COL.purple, 6); shade(c, () => ell(c, 230, 590, 150, 150), "#6a4ea8", 40, 40, 0.5);
  c.save(); c.beginPath(); ell(c, 230, 590, 150, 150); c.clip(); line(c, [[80, 650], [380, 540]], 38, INK); line(c, [[80, 650], [380, 540]], 28, COL.pink); c.restore();
  shape(c, () => ell(c, 120, 250, 40, 40), COL.yellow, 5); star5(c, 330, 200, 30);
  write(c, "73", 120, 800, 110, INK, 12);
  for (let i = 0; i < 73; i++) { const col = Math.floor(i / 10), row = i % 10; shape(c, () => rrect(c, 430 + row * 58, 140 + col * 98, 52, 52, 8), col % 2 ? COL.teal : COL.yellow, 4); }
  write(c, "10", 480, 900, 70, INK, 8); arrow(c, [[640, 940], [980, 940]]);
};

// ------------------------------------------------------------------ terms
const t0 = (c: Ctx) => { nightSky(c, 0, 0, D, D, 11, 40);
  moon(c, 720, 260, 190, 0.7);
  shape(c, () => polyP(c, [[130, 1080], [160, 660], [940, 660], [980, 1080]]), WHITE, 6);
  line(c, [[160, 780], [950, 780]], 3, "#a8c0d8"); line(c, [[150, 900], [960, 900]], 3, "#a8c0d8");
  moon(c, 380, 810, 100, 0.7, false, "#d9e2ee");
  hand(c, 640, 640, 2.4, 1.6, SKIN.child, CLOTH.child);
  line(c, [[740, 700], [470, 800]], 14, INK); line(c, [[740, 700], [470, 800]], 7, COL.yellow);
};
const elder = (c: Ctx, x: number, y: number, h: number, pose: Parameters<typeof person>[4]) => {
  person(c, x, y, h, { adult: true, ...pose });
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  shape(c, () => ell(c, x, hy + head * 1.2, head * 0.62, head * 0.5), WHITE, 5);
  shape(c, () => ell(c, x, hy - head * 0.8, head * 1.15, head * 0.5), WHITE, 5);
};
const t1 = (c: Ctx) => { nightSky(c, 0, 0, D, D, 4, 36);
  star5(c, 800, 200, 70);
  shape(c, () => polyP(c, [[-20, 1100], [-20, 880], [1100, 880], [1100, 1100]]), "#8a4b3a", 6);
  for (let k = 0; k < 6; k++) line(c, [[-20, 920 + k * 40], [1100, 920 + k * 40]], 4, "#5c2f24");
  const pose = { armR: [-1.15, -0.9] as [number, number], armL: [Math.PI * 0.45, 0.1] as [number, number] };
  elder(c, 380, 900, 720, pose);
  const w = wrist(380, 900, 720, -1, pose.armL);
  c.save(); c.translate(w[0] + 60, w[1] + 10); shape(c, () => rrect(c, -120, -24, 380, 50, 6), "#c9b46a", 5); for (let i = 0; i < 7; i++) line(c, [[-90 + i * 45, -10], [-90 + i * 45 + 20, 8]], 5, "#6b5528"); c.restore();
};
const t2 = (c: Ctx) => { ground(c, "#e9dcc0");
  shape(c, () => ell(c, 540, 90, 22, 22), COL.greyDk, 5);
  shape(c, () => rrect(c, 150, 130, 780, 170, 14), RED, 6);   calGrid(c, 190, 330, 100, 7, 5, { 4: 1, 19: 0 }, true);
};
const t4 = (c: Ctx) => { ground(c);
  c.save(); c.setLineDash([22, 18]); c.beginPath(); ell(c, 540, 560, 330, 270); c.lineWidth = 6; c.strokeStyle = COL.greyDk; c.stroke(); c.restore();
  sun(c, 540, 560, 90);
  const a = 0.5; earth(c, 540 + Math.cos(a) * 330, 560 + Math.sin(a) * 270, 52);
  arrow(c, [[540 + Math.cos(0.75) * 330, 560 + Math.sin(0.75) * 270], [540 + Math.cos(1.2) * 330, 560 + Math.sin(1.2) * 270]]);
  tree(c, 170, 320, 0.95, 0); tree(c, 910, 320, 0.95, 1); tree(c, 910, 960, 0.95, 3); tree(c, 170, 960, 0.95, 2);
};
const t5 = (c: Ctx) => { nightSky(c, 0, 0, D, D, 21, 14);
  const cx = 540, cy = 880, R1 = 360, R2 = 500;
  shape(c, () => { for (let k = 0; k <= 30; k++) { const a = -2.95 + (k * 2.75) / 30; k ? c.lineTo(cx + Math.cos(a) * R2, cy + Math.sin(a) * R2) : c.moveTo(cx + Math.cos(a) * R2, cy + Math.sin(a) * R2); } for (let k = 30; k >= 0; k--) { const a = -2.95 + (k * 2.75) / 30; c.lineTo(cx + Math.cos(a) * R1, cy + Math.sin(a) * R1); } c.closePath(); }, "#1d2557", 6);
  const r = rnd(2);
  for (let i = 0; i < 27; i++) { const a = -2.95 + ((i + 0.5) * 2.75) / 27, m = 430;
    if (i > 0) { const b = -2.95 + (i * 2.75) / 27; line(c, [[cx + Math.cos(b) * R1, cy + Math.sin(b) * R1], [cx + Math.cos(b) * R2, cy + Math.sin(b) * R2]], 2, NIGHT2); }
    for (let k = 0; k < 3; k++) dotStar(c, cx + Math.cos(a) * (m + (r() - 0.5) * 80), cy + Math.sin(a) * (m + (r() - 0.5) * 80), 5); }
  const am = -2.95 + (13.5 * 2.75) / 27; moon(c, cx + Math.cos(am) * 430, cy + Math.sin(am) * 430, 50, 1);
  arrow(c, Array.from({ length: 8 }, (_, k) => { const a = -2.5 + k * 0.1; return [cx + Math.cos(a) * 580, cy + Math.sin(a) * 580]; }));
};
const t6 = (c: Ctx) => { ground(c);
  shadow(c, 560, 930, 380, 30);
  shape(c, () => ell(c, 540, 540, 400, 400), COL.steel, 6);
  shape(c, () => ell(c, 540, 540, 350, 350), WHITE, 5);
  const a0 = -Math.PI / 2, a1_ = a0 + (24 / 60) * Math.PI * 2;
  shape(c, () => { c.moveTo(540, 540); c.arc(540, 540, 350, a0, a1_); c.closePath(); }, COL.yellow, 5);
  for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30; line(c, [[540 + Math.sin(a) * 300, 540 - Math.cos(a) * 300], [540 + Math.sin(a) * 345, 540 - Math.cos(a) * 345]], i % 5 ? 3 : 6, INK); }
  write(c, "24", 590, 400, 100, INK, 11);
  arrow(c, Array.from({ length: 10 }, (_, k) => { const a = a0 + 0.1 + k * 0.2; return [540 + Math.cos(a) * 455, 540 + Math.sin(a) * 455]; }));
};
const t7 = (c: Ctx) => { ground(c); waterClock(c, 540, 560, 1.5); };
const t10 = (c: Ctx) => { ground(c);
  tablet(c, 290, 560, 420, 520, -0.06);
  c.save(); c.translate(790, 560); c.rotate(0.04); shadow(c, 14, 300, 220, 22);
  shape(c, () => rrect(c, -230, -290, 460, 580, 12), WHITE, 6); line(c, [[0, -290], [0, 290]], 5, COL.greyDk);
  for (let k = 0; k < 6; k++) line(c, [[-200, -190 + k * 90], [-30, -190 + k * 90]], 3, "#a8c0d8");
  write(c, "12", -190, -270, 42, INK, 5); write(c, "13", 40, -270, 42, INK, 5);
  moon(c, 110, -170, 56, 0.55); sun(c, -110, -120, 34); moon(c, 110, 40, 56, 0.8); moon(c, -110, 90, 40, 0.3);
  c.restore();
};
const t11 = (c: Ctx) => { ground(c);
  const P = [0.04, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25];
  P.forEach((p, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 4; moon(c, 540 + Math.cos(a) * 340, 540 + Math.sin(a) * 340, 74, p, i > 4); });
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 4 + 0.3; arrow(c, Array.from({ length: 5 }, (_, k) => { const b = a + k * 0.07; return [540 + Math.cos(b) * 340, 540 + Math.sin(b) * 340]; }), RED, 9); }
  earth(c, 540, 540, 80);
};
const t12 = (c: Ctx) => { ground(c, "#e9dcc0");
  shape(c, () => rrect(c, 130, 100, 820, 130, 14), COL.teal, 6);
  calGrid(c, 160, 270, 108, 7, 4, {}, true);
  const cx = 160 + 5 * 108 + 54, cy = 270 + 2 * 108 + 54;
  moon(c, cx, cy + 6, 44, 1); ring(c, cx, cy, 62, 8, RED);
  hand(c, 860, 900, -2.0, 1.9, SKIN.child, CLOTH.child, true);
};

// ------------------------------------------------------------------ explanations
const e0 = (c: Ctx) => { ground(c);
  earth(c, 190, 540, 120);
  arrow(c, Array.from({ length: 9 }, (_, k) => { const a = -2.4 + k * 0.28; return [190 + Math.cos(a) * 175, 540 + Math.sin(a) * 175]; }));
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 4; moon(c, 540 + Math.cos(a) * 165, 540 + Math.sin(a) * 165, 46, [0.04, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25][i], i > 4); }
  earth(c, 540, 540, 50);
  c.save(); c.setLineDash([16, 14]); c.beginPath(); ell(c, 890, 540, 150, 150); c.lineWidth = 5; c.strokeStyle = COL.greyDk; c.stroke(); c.restore();
  sun(c, 890, 540, 50); earth(c, 890 + 150 * Math.cos(-0.9), 540 + 150 * Math.sin(-0.9), 34);
  arrow(c, Array.from({ length: 5 }, (_, k) => { const a = -0.5 + k * 0.12; return [890 + Math.cos(a) * 150, 540 + Math.sin(a) * 150]; }));
};
const wheel = (c: Ctx, x: number, y: number, r: number, cols: string[], slices = 12, gap = 0) => {
  const per = (Math.PI * 2 - gap) / slices;
  for (let i = 0; i < slices; i++) shape(c, () => { c.moveTo(x, y); c.arc(x, y, r, -Math.PI / 2 + i * per, -Math.PI / 2 + (i + 1) * per); c.closePath(); }, cols[i % cols.length], 5);
};
const e1x = (c: Ctx) => { ground(c);
  wheel(c, 270, 540, 235, [COL.greenLt, COL.orange, "#f0d56c", COL.blue]); sun(c, 270, 540, 60);
  wheel(c, 810, 540, 235, ["#e8e6f5", "#c9c3ea"], 12, 0.5); moon(c, 810, 540, 62, 0.75);
  const a0 = -Math.PI / 2 + Math.PI * 2 - 0.5;
  c.save(); c.translate(Math.cos(a0 + 0.25) * 28, Math.sin(a0 + 0.25) * 28); shape(c, () => { c.moveTo(810, 540); c.arc(810, 540, 235, a0, a0 + 0.5); c.closePath(); }, RED, 5); c.restore();
  write(c, "+", 700, 170, 90, RED, 12);
};
const e2x = (c: Ctx) => {
  c.fillStyle = DAYSKY; c.fillRect(0, 0, 540, 1080); nightSky(c, 540, 0, 540, 1080, 6, 24);
  line(c, [[540, 0], [540, D]], 8);
  sun(c, 270, 230, 85); moon(c, 810, 230, 85, 0.6);
  c.fillStyle = "#c7b184"; c.fillRect(0, 650, 540, 430); c.fillStyle = "#6a5a40"; c.fillRect(540, 650, 540, 430); line(c, [[0, 650], [D, 650]], 6);
  shape(c, () => polyP(c, [[40, 900], [500, 900], [440, 790], [100, 790]]), COL.steel, 6);
  shape(c, () => polyP(c, [[250, 850], [300, 850], [262, 640]]), COL.wood, 5);
  shape(c, () => polyP(c, [[250, 850], [300, 850], [440, 880], [430, 862]]), "#8c7650", 3);
  for (const x of [330, 380, 430]) line(c, [[x, 842 + (x - 330) * 0.1], [x + 4, 892]], 4);
  waterClock(c, 810, 810, 0.78);
};
const e3x = (c: Ctx) => { ground(c, "#d9bd8d");
  shape(c, () => { c.moveTo(640, 700); c.lineTo(640, 330); c.arc(800, 330, 160, Math.PI, 0); c.lineTo(960, 700); c.closePath(); }, NIGHT, 8);
  dotStar(c, 700, 250, 5); dotStar(c, 880, 420, 5); moon(c, 760, 300, 55, 0.2); shape(c, () => ell(c, 860, 260, 22, 22), WHITE, 4);
  shape(c, () => rrect(c, 60, 730, 250, 40, 8), COL.wood, 5); shape(c, () => rrect(c, 110, 770, 150, 110, 8), COL.woodDk, 5);
  shape(c, () => { c.moveTo(80, 730); c.quadraticCurveTo(185, 670, 290, 730); c.closePath(); }, CLAYDK, 5);
  shape(c, () => { c.moveTo(185, 700); c.quadraticCurveTo(150, 640, 185, 590); c.quadraticCurveTo(225, 640, 185, 700); c.closePath(); }, COL.orange, 4); ring(c, 185, 640, 0, 0);
  tablet(c, 580, 880, 600, 330, -0.04);
  hand(c, 900, 840, Math.PI * 1.1, 1.4, SKIN.adult, CLOTH.adult);
  line(c, [[760, 880], [660, 920]], 12, INK); line(c, [[760, 880], [660, 920]], 6, COL.green);
};
const e4x = (c: Ctx) => { ground(c);
  sun(c, 540, 120, 60);
  const cx = 540, cy = 1030, R = 520, ax = cx - R * Math.sin(0.4), ay = cy - R * Math.cos(0.4);
  for (const x of [270, 540, 810]) line(c, [[x, 220], [x, 440]], 4, COL.orange);
  shape(c, () => ell(c, cx, cy, R, R), COL.blue, 6); shade(c, () => ell(c, cx, cy, R, R), COL.blueDk, 24, 24, 0.5);
    ring(c, cx, cy, R, 6);
  c.save(); c.setLineDash([14, 14]); line(c, [[cx, cy], [cx, cy - R]], 4, WHITE); line(c, [[cx, cy], [ax, ay]], 4, WHITE); c.restore();
  c.beginPath(); c.arc(cx, cy, 170, -Math.PI / 2 - 0.4, -Math.PI / 2); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  shape(c, () => rrect(c, cx - 34, cy - R, 68, 120, 6), NIGHT, 5); line(c, [[cx, 220], [cx, cy - R + 110]], 6, COL.yellow);
  shape(c, () => rrect(c, cx - 62, cy - R - 36, 124, 44, 8), COL.steel, 5);
  line(c, [[ax, ay], [ax - 190 * Math.sin(0.4), ay - 190 * Math.cos(0.4)]], 24, INK); line(c, [[ax, ay], [ax - 190 * Math.sin(0.4), ay - 190 * Math.cos(0.4)]], 14, COL.wood);
  line(c, [[ax - 190 * Math.sin(0.4), 220], [ax - 190 * Math.sin(0.4), ay - 190 * Math.cos(0.4)]], 4, COL.orange);
  const tx = ax - 190 * Math.sin(0.4); line(c, [[tx, cy - Math.sqrt(R * R - (tx - cx) ** 2)], [ax, ay]], 14, INK);
};
const e6x = (c: Ctx) => { nightSky(c, 0, 0, D, D, 14, 40);
  star5(c, 800, 220, 95, "#fff6c0"); for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; line(c, [[800 + Math.cos(a) * 125, 220 + Math.sin(a) * 125], [800 + Math.cos(a) * 165, 220 + Math.sin(a) * 165]], 7, STAR); }
  shape(c, () => polyP(c, [[-20, 1100], [-20, 820], [1100, 820], [1100, 1100]]), "#4a6a78", 6);
  for (let k = 0; k < 7; k++) for (let j = 0; j < 14; j++) shape(c, () => ell(c, j * 85 + (k % 2) * 42, 850 + k * 38, 40, 20), "#6f94a3", 3);
  const pose = { armR: [-1.0, -0.85] as [number, number], armL: [Math.PI * 0.4, 0.2] as [number, number] };
  person(c, 400, 880, 620, { adult: true, ...pose });
  const w = wrist(400, 880, 620, -1, pose.armL);
  shape(c, () => rrect(c, w[0] - 60, w[1] - 20, 200, 40, 10), "#f6e7b8", 5); line(c, [[w[0] + 20, w[1]], [w[0] + 120, w[1] - 90]], 8, INK);
};
const e8x = (c: Ctx) => { nightSky(c, 0, 0, D, D, 9, 30);
  moon(c, 700, 250, 175, 1);
  shape(c, () => { c.save(); c.beginPath(); ell(c, 700, 250, 175, 175); c.clip(); c.beginPath(); ell(c, 810, 200, 150, 150); c.fillStyle = "#6a2f35"; c.fill(); c.restore(); }, "rgba(0,0,0,0)", 0);
  ring(c, 700, 250, 175, 6);
  const pose = { armR: [-0.7, -0.6] as [number, number], armL: [Math.PI * 0.5, -0.1] as [number, number] };
  person(c, 270, 1010, 620, { adult: true, ...pose });
  const w = wrist(270, 1010, 620, -1, pose.armL);
  shape(c, () => rrect(c, w[0] - 40, w[1] - 30, 260, 60, 8), "#f6e7b8", 5); for (let i = 0; i < 6; i++) { dotStar(c, w[0] + i * 40, w[1] - 8, 0); shape(c, () => ell(c, w[0] + i * 40, w[1], 8, 8), INK, 0); }
  waterClock(c, 810, 830, 0.7);
};
const e9x = (c: Ctx) => { ground(c);
  write(c, "60", 330, 70, 240, INK, 26);
  palmHand(c, 280, 650, 1.1, [true, true, true, true], "touch");
  palmHand(c, 790, 650, 1.1, [true, true, true, true], "up", true);
  write(c, "12", 20, 880, 80, INK, 10); write(c, "5", 940, 880, 80, INK, 10);
};
const e10x = (c: Ctx) => { ground(c, "#bfe0f5");
  shape(c, () => { c.moveTo(70, 300); c.bezierCurveTo(150, 160, 400, 140, 620, 230); c.bezierCurveTo(700, 400, 640, 560, 560, 780); c.bezierCurveTo(480, 860, 390, 800, 340, 700); c.bezierCurveTo(250, 760, 130, 700, 70, 600); c.closePath(); }, "#d9e7a8", 6);
  shape(c, () => { c.moveTo(880, 480); c.bezierCurveTo(960, 450, 1040, 500, 1030, 620); c.bezierCurveTo(1010, 760, 940, 840, 900, 840); c.bezierCurveTo(880, 720, 850, 560, 880, 480); c.closePath(); }, "#d9e7a8", 6);
  tablet(c, 350, 400, 170, 120, 0); // Babylon
  line(c, [[130, 380], [130, 250]], 20, INK); line(c, [[130, 380], [130, 250]], 11, COL.wood); line(c, [[100, 380], [220, 380]], 10, INK); // Greece: a stick and its shadow
  star5(c, 540, 310, 55);// China
  c.save(); c.translate(500, 690); shape(c, () => { c.moveTo(-75, 0); c.bezierCurveTo(-70, 80, 70, 80, 75, 0); c.closePath(); }, COPPER, 5); shape(c, () => ell(c, 0, 0, 75, 14), "#f6c79a", 4); c.restore(); // India
  shape(c, () => rrect(c, 210, 540, 130, 90, 8), COL.purple, 5); line(c, [[275, 540], [275, 630]], 5, INK); // Baghdad: a book
  c.save(); c.translate(955, 650); c.scale(1.3, 1.3); shape(c, () => polyP(c, [[-60, 70], [60, 70], [40, 30], [-40, 30]]), COL.grey, 5); shape(c, () => polyP(c, [[-40, 30], [40, 30], [25, -10], [-25, -10]]), COL.greyDk, 5); shape(c, () => polyP(c, [[-25, -10], [25, -10], [15, -45], [-15, -45]]), COL.grey, 5); c.restore(); // Maya pyramid
  arrow(c, [[170, 300], [260, 360]]); arrow(c, [[330, 470], [290, 530]]); arrow(c, [[340, 620], [420, 670]]); arrow(c, [[520, 620], [540, 400]]);
};

export const ic_skyHistoryOfAstronomyL3 = cards("sci.sky.history-of-astronomy.L3 cards", [
  e1, e2, e3, a1, a2, a3, a4, a5, p1, c1, c2,
  t0, t1, t2, t4, t5, t6, t7, t10, t11, t12,
  e0, e1x, e2x, e3x, e4x, e6x, e8x, e9x, e10x,
]);
void D; void COL; void CLOTH;
