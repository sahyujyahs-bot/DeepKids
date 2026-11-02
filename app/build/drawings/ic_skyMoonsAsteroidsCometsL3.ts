import type { Ctx } from "./core";
import { INK, BG, COL, WHITE, RED, D, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, write, cards } from "./flatKit";

const NIGHT = "#1d1a3c", GRAIN = "#c9a56a", GRAINDK = "#a07f45";
const stars = (c: Ctx, seed: number, n: number, keep: (x: number, y: number) => boolean = () => true) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const x = 30 + r() * 1020, y = 30 + r() * 1020, s = 2 + r() * 3.5; if (!keep(x, y)) continue; c.beginPath(); ell(c, x, y, s, s); c.fillStyle = "#fff6d6"; c.fill(); }
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, b = 0.13; shape(c, () => polyP(c, [[x + Math.cos(a - b) * r * 1.05, y + Math.sin(a - b) * r * 1.05], [x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5], [x + Math.cos(a + b) * r * 1.05, y + Math.sin(a + b) * r * 1.05]]), COL.orange, 5); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.45);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r);
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, r * 0.3, r * 0.2, 0.6);
  c.save(); c.beginPath(); body(); c.clip();
  shape(c, () => { c.moveTo(x - r * 0.7, y - r * 0.2); c.quadraticCurveTo(x - r * 0.3, y - r * 0.8, x + r * 0.1, y - r * 0.3); c.quadraticCurveTo(x - r * 0.1, y + r * 0.2, x - r * 0.4, y + r * 0.4); c.closePath(); }, COL.green, 4);
  shape(c, () => { c.moveTo(x + r * 0.3, y + r * 0.1); c.quadraticCurveTo(x + r * 0.9, y - r * 0.1, x + r * 0.7, y + r * 0.6); c.quadraticCurveTo(x + r * 0.4, y + r * 0.7, x + r * 0.3, y + r * 0.1); c.closePath(); }, COL.green, 4);
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
};
// a lump of space rock: jagged outline, shade side, craters
const rock = (c: Ctx, x: number, y: number, r: number, seed: number, col = COL.grey, dk = COL.greyDk) => {
  const rr = rnd(seed), pts: number[][] = [], n = 11;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 0.78 + rr() * 0.3; pts.push([x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.85]); }
  const path = () => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 0; i < n; i++) { const p = pts[(i + 1) % n], q = pts[i]; c.quadraticCurveTo(q[0], q[1], (q[0] + p[0]) / 2, (q[1] + p[1]) / 2); } c.closePath(); };
  shape(c, path, col, Math.max(3, r * 0.07)); shade(c, path, dk, r * 0.3, r * 0.22, 0.6);
  shape(c, () => ell(c, x - r * 0.25, y - r * 0.15, r * 0.2, r * 0.14), dk, Math.max(2, r * 0.04));
  shape(c, () => ell(c, x + r * 0.25, y + r * 0.25, r * 0.14, r * 0.1), dk, Math.max(2, r * 0.04));
};
// a comet tail from (x, y) pointing at angle an
const tail = (c: Ctx, x: number, y: number, an: number, len: number, w: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  for (const [k, a] of [[1, 0.28], [0.62, 0.45], [0.3, 0.8]] as [number, number][]) { c.beginPath(); c.moveTo(0, -w * k); c.quadraticCurveTo(len * 0.5, -w * k * 0.9, len * k * 0.4 + len * 0.6, 0); c.quadraticCurveTo(len * 0.5, w * k * 0.9, 0, w * k); c.closePath(); c.fillStyle = k === 1 ? "#9fd2f0" : WHITE; c.globalAlpha = a; c.fill(); }
  c.restore(); c.globalAlpha = 1;
};
const cometHead = (c: Ctx, x: number, y: number, r: number, seed: number) => { c.beginPath(); ell(c, x, y, r * 1.5, r * 1.5); c.fillStyle = "rgba(255,255,255,0.45)"; c.fill(); rock(c, x, y, r, seed, "#dcdcdc", "#a9a9b4"); };
const bez = (t: number, p: number[][]) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
const grain = (c: Ctx, x: number, y: number, r: number, rot = 0) => { shape(c, () => ell(c, x, y, r, r * 0.8, rot), GRAIN, Math.max(2, r * 0.16)); shade(c, () => ell(c, x, y, r, r * 0.8, rot), GRAINDK, r * 0.3, r * 0.25, 0.6); };
const dust = (c: Ctx, x: number, y: number, r: number, col = GRAINDK) => { c.beginPath(); ell(c, x, y, r, r * 0.85); c.fillStyle = col; c.fill(); };
const bowl = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.7, r * 0.9, r * 0.14);
  const p = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.85, x + r * 0.9, y + r * 0.85, x + r, y); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, r * 0.35, -r * 0.05); shape(c, () => ell(c, x, y, r, r * 0.2), COL.steelIn, 5);
};
const icecomet = (c: Ctx, x: number, y: number, r: number, specks: number, crust: boolean, seed: number) => {
  const body = () => ell(c, x, y, r, r * 0.9);
  shape(c, body, "#e3f4fc", 6); shade(c, body, "#a9d3ea", r * 0.3, r * 0.25, 0.55);
  const rr = rnd(seed);
  c.save(); c.beginPath(); body(); c.clip();
  if (crust) { c.beginPath(); c.moveTo(x - r, y - r * 0.2); c.quadraticCurveTo(x, y - r * 1.3, x + r, y - r * 0.2); c.quadraticCurveTo(x, y - r * 0.7, x - r, y - r * 0.2); c.fillStyle = "#4a3a30"; c.fill(); }
  for (let i = 0; i < specks; i++) dust(c, x + (rr() - 0.5) * r * 1.5, y + (rr() - 0.4) * r * 1.3, 4 + rr() * 5, "#4a3a30");
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[x - r * 0.6, y - r * 0.1], [x - r * 0.4, y + r * 0.35]], 8);
};
const cloud = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x - 90 * s, y + 30 * s); c.arc(x - 60 * s, y, 40 * s, Math.PI * 0.6, Math.PI * 1.5); c.arc(x, y - 30 * s, 55 * s, Math.PI, Math.PI * 1.9); c.arc(x + 70 * s, y, 40 * s, Math.PI * 1.4, Math.PI * 0.4); c.closePath(); }, "#dfe3ee", 6);

// e1: two ice comets, one in the sun, one in the shade
const e1 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e2d3b2"; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  c.fillStyle = "rgba(43,35,64,0.12)"; c.fillRect(560, 120, 520, 640);
  sun(c, 190, 190, 70);
  cloud(c, 800, 230, 1.2);
  for (const [x, ic] of [[290, 0], [810, 1]]) {
    bowl(c, x, 600, 190);
    if (!ic) { shape(c, () => ell(c, x, 598, 175, 28), COL.water, 0); icecomet(c, x, 520, 105, 0, true, 5); }
    else { shape(c, () => ell(c, x, 600, 170, 24), COL.steelIn, 0); icecomet(c, x, 490, 150, 6, false, 9); }
  }
  arrow(c, [[290, 330], [290, 395]]);
};

// e2: a fan blows; the paper comet is carried away from it and its tail streams on ahead
const e2 = (c: Ctx) => {
  ground(c); c.fillStyle = "#e2d3b2"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  const fx = 150, fy = 560;
  shadow(c, fx + 20, 806, 100, 18);
  shape(c, () => rrect(c, fx - 20, 640, 40, 160, 10), COL.steel); shape(c, () => rrect(c, fx - 80, 780, 160, 26, 10), COL.steelDk);
  shape(c, () => ell(c, fx, fy, 80, 110), COL.teal); shape(c, () => ell(c, fx, fy, 52, 80), COL.steelIn, 4);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; line(c, [[fx - Math.sin(a) * 52, fy - Math.cos(a) * 80], [fx + Math.sin(a) * 52, fy + Math.cos(a) * 80]], 4); }
  for (const y of [440, 520, 600, 680]) line(c, [[270, y], [420, y]], 7, COL.sky);
  const px = 560, ph = 520, py = 800, sh = py - ph * 0.74, wx = px + ph * 0.11 + Math.cos(-0.5) * ph * 0.17 + Math.cos(-1.1) * ph * 0.16, wy = sh + ph * 0.03 + Math.sin(-0.5) * ph * 0.17 + Math.sin(-1.1) * ph * 0.16;
  person(c, px, py, ph, { armR: [-0.5, -1.1] });
  line(c, [[wx - 6, wy + 30], [wx + 2, wy - 150]], 12, INK); line(c, [[wx - 6, wy + 30], [wx + 2, wy - 150]], 6, COL.wood);
  const hx = wx + 2, hy = wy - 190;
  for (const [dy, l] of [[-22, 250], [0, 300], [22, 240]]) {
    const pts = [[hx + 30, hy + dy], [hx + 30 + l * 0.4, hy + dy + 6], [hx + 30 + l * 0.7, hy + dy - 6], [hx + 30 + l, hy + dy + 4]];
    line(c, pts, 18, INK); line(c, pts, 10, dy < 0 ? COL.pink : dy ? COL.yellow : "#ffffff");
  }
  shape(c, () => ell(c, hx, hy, 50, 40), COL.yellow, 6); shine(c, [[hx - 25, hy - 15], [hx - 10, hy - 25]], 7);
  arrow(c, [[640, 880], [820, 880]]);
};

// a1: rava grains on dark paper, one grain under a magnifier, a shooting star it makes
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 470, 930, 400, 30);
  shape(c, () => polyP(c, [[110, 560], [830, 560], [900, 900], [40, 900]]), "#2e2a4a", 6);
  const r = rnd(4);
  for (let i = 0; i < 40; i++) dust(c, 200 + r() * 560, 620 + r() * 240, 5 + r() * 3, "#f1d9a0");
  shape(c, () => ell(c, 430, 740, 28, 20), "#f1d9a0", 4); // the pinch pile
  c.save(); c.beginPath(); c.arc(380, 480, 190, 0, Math.PI * 2); c.fillStyle = "rgba(214,236,250,0.9)"; c.fill(); c.restore();
  grain(c, 345, 450, 52, 0.3); grain(c, 450, 520, 38, -0.4); grain(c, 420, 400, 30, 1);
  shape(c, () => ell(c, 380, 480, 190, 190), "rgba(0,0,0,0)", 16);
  line(c, [[515, 615], [680, 780]], 40, INK); line(c, [[515, 615], [680, 780]], 24, COL.wood);
  shine(c, [[290, 360], [340, 330]], 12);
  shape(c, () => ell(c, 850, 250, 170, 170), NIGHT, 8);
  c.save(); c.beginPath(); ell(c, 850, 250, 170, 170); c.clip(); stars(c, 2, 90, (x, y) => (x - 850) ** 2 + (y - 250) ** 2 < 150 * 150 && x > 700); c.restore();
  line(c, [[730, 150], [900, 290]], 22, "rgba(243,154,60,0.55)"); line(c, [[730, 150], [900, 290]], 10, COL.yellow);
  shape(c, () => ell(c, 905, 295, 20, 20), WHITE, 4);
  shape(c, () => ell(c, 850, 250, 170, 170), "rgba(0,0,0,0)", 8);
  arrow(c, [[570, 330], [670, 280]]);
};

// a5: a magnet in a bag pulls dark grains out of dust
const a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 26);
  shape(c, () => polyP(c, [[110, 760], [970, 760], [1010, 900], [70, 900]]), WHITE, 6);
  const r = rnd(8);
  for (let i = 0; i < 80; i++) dust(c, 190 + r() * 700, 790 + r() * 90, 4 + r() * 5, r() < 0.5 ? "#8c7a60" : "#b8a78a");
  const bag = () => rrect(c, 330, 150, 400, 480, 40);
  const mx = 530, top = 260;
  const U = (w: number, col: string) => { c.beginPath(); c.moveTo(mx - 110, top + 280); c.lineTo(mx - 110, top + 120); c.arc(mx, top + 120, 110, Math.PI, 0); c.lineTo(mx + 110, top + 280); c.lineWidth = w; c.strokeStyle = col; c.lineCap = "butt"; c.stroke(); };
  U(96, INK); U(80, RED);
  for (const s of [-1, 1]) shape(c, () => rrect(c, mx + s * 110 - 40, top + 280, 80, 60, 4), COL.steelIn, 5);
  shape(c, bag, "rgba(214,236,250,0.35)", 5);
  shine(c, [[360, 200], [360, 520]], 8);
  for (let i = 0; i < 14; i++) dust(c, mx - 110 + (i % 7 - 3) * 12 + (i < 7 ? 0 : 220), top + 360 + Math.floor(i / 7) * 14 + r() * 8, 6 + r() * 3, "#2b2340");
  for (let i = 0; i < 6; i++) dust(c, 280 + i * 32, 705 + (i % 2) * 20, 7, "#2b2340");
  arrow(c, [[860, 650], [860, 400]]);
};

// c1: a paper-cup lander with soft feet, dropped from 50 cm onto a tray
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 40);
  shape(c, () => ell(c, 560, 900, 400, 80), COL.steel); shape(c, () => ell(c, 560, 892, 340, 60), COL.steelIn, 4);
  shadow(c, 560, 880, 190, 22);
  const cup = () => polyP(c, [[470, 480], [650, 480], [700, 790], [420, 790]]);
  shape(c, cup, "#fffaf0"); shade(c, cup, COL.steelDk, 40, 0, 0.4);
  shape(c, () => polyP(c, [[455, 600], [665, 600], [678, 650], [442, 650]]), COL.teal, 5);
  shape(c, () => ell(c, 560, 480, 90, 24), COL.paper, 5);
  for (const x of [430, 520, 600, 690]) shape(c, () => { c.arc(x, 800, 38, 0, Math.PI * 2); }, WHITE, 6);
  c.save(); c.translate(0, 0); c.restore();
  // ruler 50 cm
  shape(c, () => rrect(c, 160, 100, 70, 800, 6), COL.wood, 6);
  for (let i = 0; i <= 10; i++) line(c, [[230, 100 + i * 80], [230 - (i % 5 ? 26 : 44), 100 + i * 80]], 4);
  write(c, "50 cm", 40, 60, 40, INK, 6);
  line(c, [[230, 100], [440, 100]], 5, INK);
  c.setLineDash([14, 12]); line(c, [[300, 130], [300, 400]], 4, COL.greyDk); c.setLineDash([]);
  shape(c, () => rrect(c, 470, 130, 180, 40, 6), "rgba(0,0,0,0)", 0);
  arrow(c, [[560, 200], [560, 400]]);
};

// term.7: sublimation: ice turns straight to gas, no puddle
const sublimation = (c: Ctx) => {
  ground(c); c.fillStyle = "#e2d3b2"; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  shadow(c, 560, 790, 300, 34);
  const blk = () => rrect(c, 280, 470, 520, 320, 40);
  shape(c, blk, "#d8f0fb"); shade(c, blk, "#9fcbe4", 80, 40, 0.5);
  shine(c, [[330, 520], [330, 700]], 12); shine(c, [[360, 505], [450, 505]], 9);
  for (const [x, a, h] of [[390, 14, 400], [540, -16, 350], [690, 14, 400]]) {
    const pts: number[][] = []; for (let i = 0; i <= 10; i++) pts.push([x + Math.sin(i * 0.9) * a * (1 + i / 6), 450 - (i / 10) * h]);
    line(c, pts, 30, INK); line(c, pts, 17, "#f3fbff");
  }
  arrow(c, [[930, 700], [930, 300]]);
};

// term.8: a meteoroid: a small rock with specks of dust
const meteoroid = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 6, 60, (x, y) => (x - 540) ** 2 + (y - 540) ** 2 > 330 ** 2);
  rock(c, 540, 540, 200, 21);
  const r = rnd(33);
  for (let i = 0; i < 10; i++) { const a = r() * Math.PI * 2, d = 330 + r() * 120; grain(c, 540 + Math.cos(a) * d, 540 + Math.sin(a) * d * 0.9, 16 + r() * 18, r() * 3); }
  for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, d = 280 + r() * 200; dust(c, 540 + Math.cos(a) * d, 540 + Math.sin(a) * d, 4 + r() * 4, "#e8d3a0"); }
};

// expl.4: a comet's tail always points away from the Sun
const tailsAway = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 12, 70);
  const P = [[930, 120], [760, 980], [320, 980], [150, 120]], sx = 540, sy = 400;
  c.setLineDash([16, 16]); c.beginPath(); c.moveTo(P[0][0], P[0][1]); c.bezierCurveTo(P[1][0], P[1][1], P[2][0], P[2][1], P[3][0], P[3][1]); c.strokeStyle = "rgba(255,246,214,0.6)"; c.lineWidth = 5; c.stroke(); c.setLineDash([]);
  sun(c, sx, sy, 95);
  for (const t of [0.3, 0.7]) {
    const [x, y] = bez(t, P), an = Math.atan2(y - sy, x - sx);
    tail(c, x, y, an, 230, 34); cometHead(c, x, y, 28, t * 99);
  }
  arrow(c, [[850, 560], [800, 690]]);
  arrow(c, [[240, 690], [190, 560]]);
};

// expl.5: meteoroid in space, meteor in the sky, meteorite on the ground
const three = (c: Ctx) => {
  ground(c);
  const W = 280, H = 580, Y = 190, X = [40, 400, 760];
  const panel = (x: number, fill: string) => shape(c, () => rrect(c, x, Y, W, H, 28), fill, 7);
  const clipTo = (x: number, f: () => void) => { c.save(); c.beginPath(); rrect(c, x, Y, W, H, 28); c.clip(); f(); c.restore(); };
  panel(X[0], NIGHT); clipTo(X[0], () => { stars(c, 3, 60, (px, py) => px > X[0] && px < X[0] + W && py > Y && py < Y + H); });
  rock(c, X[0] + 140, Y + 290, 60, 14); grain(c, X[0] + 70, Y + 130, 16); grain(c, X[0] + 220, Y + 470, 14, 1);
  panel(X[1], "#241f4a"); clipTo(X[1], () => {
    stars(c, 9, 60, (px, py) => px > X[1] && px < X[1] + W && py > Y && py < Y + H);
    line(c, [[X[1] + 30, Y + 70], [X[1] + 215, Y + 340]], 36, "rgba(243,154,60,0.5)"); line(c, [[X[1] + 30, Y + 70], [X[1] + 215, Y + 340]], 18, COL.yellow);
    shape(c, () => ell(c, X[1] + 225, Y + 352, 26, 26), WHITE, 4);
    c.fillStyle = "#14112b"; c.beginPath(); c.moveTo(X[1], Y + H); c.lineTo(X[1], Y + 480); for (let i = 0; i < 6; i++) { c.lineTo(X[1] + 30 + i * 48, Y + 420 + (i % 2) * 40); c.lineTo(X[1] + 54 + i * 48, Y + 500); } c.lineTo(X[1] + W, Y + H); c.fill();
  });
  panel(X[2], COL.sky); clipTo(X[2], () => {
    c.fillStyle = COL.greenLt; c.fillRect(X[2], Y + 380, W, 220); line(c, [[X[2], Y + 380], [X[2] + W, Y + 380]], 6);
    shape(c, () => ell(c, X[2] + 140, Y + 480, 110, 34), COL.soil, 5);
  });
  rock(c, X[2] + 140, Y + 460, 55, 15, "#8d8a96", "#5f5c69");
  arrow(c, [[X[0] + W + 12, 480], [X[1] - 12, 480]]); arrow(c, [[X[1] + W + 12, 480], [X[2] - 12, 480]]);
  for (let i = 0; i < 3; i++) write(c, String(i + 1), X[i] + 120, 850, 80, INK, 9);
};

// expl.6: the grain squashes the air in front of it and glows
const glow = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 5, 60, (x, y) => y < 700);
  const bands = ["#233d73", "#2f5a9b", "#4a80c4"];
  bands.forEach((b, i) => { c.fillStyle = b; c.beginPath(); c.moveTo(0, 1080); c.lineTo(0, 880 - i * 70); c.quadraticCurveTo(540, 800 - i * 90 - 60, 1080, 880 - i * 70); c.lineTo(1080, 1080); c.fill(); });
  const a = Math.PI * 0.27, hx = 640, hy = 560, tx = hx - Math.cos(a) * 560, ty = hy - Math.sin(a) * 560;
  line(c, [[tx, ty], [hx, hy]], 90, "rgba(243,154,60,0.35)"); line(c, [[tx, ty], [hx, hy]], 56, "rgba(255,211,77,0.6)"); line(c, [[tx, ty], [hx, hy]], 22, WHITE);
  for (let i = 0; i < 3; i++) { const r = 70 + i * 36; c.beginPath(); c.arc(hx, hy, r, a - 0.9, a + 0.9); c.strokeStyle = i ? RED : COL.orange; c.lineWidth = 12; c.lineCap = "round"; c.globalAlpha = 1 - i * 0.2; c.stroke(); c.globalAlpha = 1; }
  shape(c, () => ell(c, hx, hy, 52, 52), WHITE, 6); shape(c, () => ell(c, hx, hy, 18, 18), COL.orange, 0);
};

// expl.7: the Earth crosses the dust a comet left along its path
const showerPath = (c: Ctx) => {
  ground(c, NIGHT); stars(c, 22, 60);
  const sx = 400, sy = 560, cx = 560, cy = 560, rx = 360, ry = 190, R = 200;
  c.setLineDash([14, 14]); c.beginPath(); ell(c, sx, sy, R, R); c.strokeStyle = "rgba(143,195,234,0.7)"; c.lineWidth = 5; c.stroke(); c.setLineDash([]);
  const r = rnd(3);
  for (let i = 0; i < 90; i++) { const t = r() * Math.PI * 2; dust(c, cx + Math.cos(t) * (rx + (r() - 0.5) * 36), cy + Math.sin(t) * (ry + (r() - 0.5) * 36), 3 + r() * 4, "#e8d3a0"); }
  let ex = 0, ey = 0, best = 1e9;
  for (let t = 3.6; t < 5.7; t += 0.002) { const x = cx + Math.cos(t) * rx, y = cy + Math.sin(t) * ry, e = Math.abs(Math.hypot(x - sx, y - sy) - R); if (e < best) { best = e; ex = x; ey = y; } }
  sun(c, sx, sy, 60);
  tail(c, cx + rx, cy, 0, 100, 18); cometHead(c, cx + rx - 5, cy, 22, 7);
  for (let i = 0; i < 4; i++) line(c, [[ex - 120 - i * 14, ey - 150 + i * 30], [ex - 40 - i * 14, ey - 70 + i * 30]], 7, "rgba(255,246,214,0.9)");
  earth(c, ex, ey, 62);
};

export const ic_skyMoonsAsteroidsCometsL3 = cards("sci.sky.moons-asteroids-comets.L3 cards", [e1, e2, a1, a5, c1, sublimation, meteoroid, tailsAway, three, glow, showerPath]);
