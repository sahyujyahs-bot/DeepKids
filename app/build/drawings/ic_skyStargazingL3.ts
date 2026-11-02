import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, line, arrow, person, write, cards } from "./flatKit";

// sci.sky.stargazing.L3 · picture cards (intro, summary, flows, terms, explanations).
const NIGHT = "#1d2250", NIGHT2 = "#2f3a6b", NIGHT3 = "#141840", STAR = "#ffd34d", ORANGE = "#f39a3c", MOON = "#ffe9a0", PALE = "#c9d6ff";

const starP = (c: Ctx, x: number, y: number, R: number) => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? R * 0.45 : R; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); };
const star = (c: Ctx, x: number, y: number, R: number, fill = STAR, lw = 5) => shape(c, () => starP(c, x, y, R), fill, lw);
const dot = (c: Ctx, x: number, y: number, r: number, col: string = WHITE) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = col; c.fill(); };
const bgStars = (c: Ctx, sd: number, n: number, x0 = 20, y0 = 20, x1 = 1060, y1 = 1060) => { const r = rnd(sd); for (let i = 0; i < n; i++) dot(c, x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), 2.5 + r() * 3, "#fff6c8"); };
const night = (c: Ctx, sd = 5, n = 40, col = NIGHT) => { ground(c, col); bgStars(c, sd, n); };
const dashes = (c: Ctx, pts: number[][], w = 5, col: string = PALE, d = [14, 12]) => { c.setLineDash(d); line(c, pts, w, col); c.setLineDash([]); };
const glow = (c: Ctx, x: number, y: number, r: number, col = "rgba(255,226,140,0.13)") => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = col; c.fill(); };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col = NIGHT) => { shape(c, () => rrect(c, x, y, w, h, 28), col, 6); };
const earthBall = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue, 0);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip();
  for (const [dx, dy, a, b, rot] of [[-0.3, -0.25, 0.4, 0.26, 0.5], [0.35, 0.2, 0.28, 0.42, 0.2], [-0.2, 0.6, 0.3, 0.16, 0]]) shape(c, () => ell(c, x + dx * r, y + dy * r, a * r, b * r, rot), COL.green, 0);
  c.restore(); shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
};
const crescent = (c: Ctx, x: number, y: number, R: number) => shape(c, () => { c.moveTo(x, y - R); c.bezierCurveTo(x - R * 1.5, y - R * 0.6, x - R * 1.5, y + R * 0.6, x, y + R); c.bezierCurveTo(x - R * 0.55, y + R * 0.6, x - R * 0.55, y - R * 0.6, x, y - R); c.closePath(); }, MOON, 5);
const eye = (c: Ctx, x: number, y: number, rx: number, ry: number, pupil: number) => {
  const path = () => { c.moveTo(x - rx, y); c.quadraticCurveTo(x, y - ry * 2, x + rx, y); c.quadraticCurveTo(x, y + ry * 2, x - rx, y); c.closePath(); };
  shape(c, path, WHITE, 6);
  c.save(); c.beginPath(); path(); c.clip();
  dot(c, x, y, ry * 0.95, "#8a5a3c"); dot(c, x, y, pupil, INK); dot(c, x - ry * 0.25, y - ry * 0.25, ry * 0.16, WHITE);
  c.restore(); c.beginPath(); path(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// a small head-and-shoulders person for little pictures
const bust = (c: Ctx, x: number, y: number, r: number, cloth: string, skin: string = SKIN.child) => {
  shape(c, () => { c.moveTo(x - r * 1.35, y + r * 2.4); c.quadraticCurveTo(x - r * 1.3, y + r * 0.9, x, y + r * 0.9); c.quadraticCurveTo(x + r * 1.3, y + r * 0.9, x + r * 1.35, y + r * 2.4); c.closePath(); }, cloth, 4);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin, 4);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.5, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 3);
};
// a torch with a red cellophane lens, base at (x, y), pointing at angle an; beam = length of the red beam
const torch = (c: Ctx, x: number, y: number, an: number, len = 200, w = 60, beam = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const L = len + 50;
  if (beam) { c.beginPath(); c.moveTo(L, -w * 0.7); c.lineTo(L + beam, -w * 2.4); c.lineTo(L + beam, w * 2.4); c.lineTo(L, w * 0.7); c.closePath(); c.fillStyle = "rgba(215,55,43,0.38)"; c.fill(); }
  shape(c, () => rrect(c, 0, -w / 2, len, w, 12), COL.blue, 6);
  shape(c, () => rrect(c, len * 0.3, -w / 2 - 2, 26, w + 4, 6), COL.blueDk, 4);
  shape(c, () => polyP(c, [[len - 6, -w / 2], [L, -w * 0.8], [L, w * 0.8], [len - 6, w / 2]]), COL.steel, 6);
  shape(c, () => ell(c, L, 0, w * 0.2, w * 0.8), "#e4523b", 6); shape(c, () => ell(c, L + 8, 0, w * 0.2, w * 0.8), "rgba(215,55,43,0.7)", 5);
  c.restore();
};

// ---------------------------------------------------------------- the Saptarishi
// the ladle as the Earth sees it: 0 bowl (Kratu, far), 1 2 3 bowl, 4 5 handle, 6 handle end (Marichi, far)
const LADLE = [[380, 330], [330, 470], [500, 530], [540, 390], [650, 350], [770, 300], [880, 230]];
const FAR = [0, 6];
const ladleView = (c: Ctx, map: (p: number[]) => number[], R: number, lw = 4) => {
  const P = LADLE.map(map), col = "rgba(255,243,200,0.75)";
  line(c, [P[0], P[1], P[2], P[3], P[0]], lw, col); line(c, [P[3], P[4], P[5], P[6]], lw, col);
  P.forEach(([x, y], i) => star(c, x, y, R, FAR.includes(i) ? ORANGE : STAR, lw));
};
// the same seven stars seen from the side: distance from the Earth runs left to right (dx), up and down is dy
const SIDE: number[][] = [[700, -70], [370, 126], [410, 210], [380, 14], [400, -42], [360, -106], [630, -210]];
const side = (c: Ctx, ex: number, ey: number, k: number, R: number, lw = 4) => {
  SIDE.forEach(([dx, dy]) => dashes(c, [[ex, ey], [ex + dx * k, ey + dy * k]], lw, PALE));
  SIDE.forEach(([dx, dy], i) => star(c, ex + dx * k, ey + dy * k, R, FAR.includes(i) ? ORANGE : STAR, lw));
};

// Orion: 10 dots, Betelgeuse, Bellatrix, three belt stars, Saiph, Rigel, three head stars
const ORION = { betel: [380, 330], bella: [700, 320], belt: [[460, 540], [540, 520], [620, 500]], saiph: [400, 800], rigel: [700, 780], head: [[500, 190], [565, 175], [532, 240]] };

// ---------------------------------------------------------------- cards
const CARDS: ((c: Ctx) => void)[] = [];

// 0 intro: a card with a hole, the child's eye behind it, seven paper stars on threads at different distances
CARDS.push((c) => {
  ground(c, NIGHT3); bgStars(c, 3, 26);
  c.fillStyle = "#0f1230"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 5, "#3a4390");
  const hx = 235, hy = 460;
  eye(c, 80, hy, 62, 36, 14);
  shadow(c, 262, 900, 110, 18);
  shape(c, () => rrect(c, 180, 220, 100, 660, 10), COL.paper, 6);
  dot(c, hx, hy, 16, INK);
  side(c, hx, hy, 1, 32, 5);
});

// 1 summary: the child sees a ladle; from the side two stars are far behind
CARDS.push((c) => {
  ground(c, BG);
  panel(c, 30, 160, 500, 760); panel(c, 550, 160, 500, 760);
  c.save(); c.beginPath(); rrect(c, 30, 160, 500, 760, 28); c.clip(); bgStars(c, 8, 14, 40, 170, 520, 900);
  c.fillStyle = "#0f1230"; c.fillRect(30, 810, 500, 110); line(c, [[30, 810], [530, 810]], 5, "#3a4390");
  ladleView(c, ([x, y]) => [95 + (x - 330) * 0.65, 250 + (y - 230) * 0.65], 22);
  person(c, 270, 900, 420, { armR: [-1.15, -1.0] });
  c.restore();
  c.save(); c.beginPath(); rrect(c, 550, 160, 500, 760, 28); c.clip(); bgStars(c, 9, 12, 560, 170, 1040, 900);
  earthBall(c, 640, 560, 50);
  side(c, 620, 560, 0.55, 24, 4);
  c.restore();
});

// 2 e1: from above, the threads, the paper stars and the child at two places
CARDS.push((c) => {
  ground(c, BG);
  shape(c, () => rrect(c, 120, 90, 840, 52, 8), COL.grey, 6);
  const H = [540, 870], W = LADLE.map(([x]) => [x - 330 + 270, 150]);
  W.forEach(([x, y]) => dot(c, x, y, 12, INK));
  const S = W.map(([x, y], i) => { const L = Math.hypot(x - H[0], y - H[1]), d = FAR.includes(i) ? L - 40 : 540; return [H[0] + ((x - H[0]) / L) * d, H[1] + ((y - H[1]) / L) * d]; });
  W.forEach(([x, y]) => line(c, [H, [x, y]], 4, COL.greyDk));
  S.forEach(([x, y], i) => star(c, x, y, 28, FAR.includes(i) ? ORANGE : STAR, 5));
  const head = (x: number, y: number) => { shape(c, () => ell(c, x, y + 36, 84, 34), CLOTH.child, 5); shape(c, () => ell(c, x, y, 42, 42), CLOTH.hair, 5); shape(c, () => ell(c, x - 42, y, 9, 15), SKIN.child, 4); shape(c, () => ell(c, x + 42, y, 9, 15), SKIN.child, 4); };
  shadow(c, 546, 880, 130, 12);
  shape(c, () => rrect(c, 430, 862, 220, 26, 8), COL.paper, 6); dot(c, H[0], H[1] + 1, 11, INK);
  head(540, 975);
  head(930, 600);
  [S[0], S[3], S[6]].forEach((p) => dashes(c, [[905, 590], p], 4, COL.blueDk));
  arrow(c, [[650, 975], [800, 930], [905, 760]]);
});

// 3 e2: a dark room, a sheet of faint stars, a child waiting, a phone alarm
CARDS.push((c) => {
  ground(c, NIGHT3);
  c.fillStyle = "#1b1f4d"; c.fillRect(0, 860, D, 220); line(c, [[0, 860], [D, 860]], 5, "#3a4390");
  shadow(c, 540, 480, 300, 14);
  shape(c, () => rrect(c, 250, 90, 580, 390, 8), COL.paper, 6);
  const r = rnd(4), sizes = [[2, 12, INK], [3, 10, "#444"], [3, 9, "#7a7a7a"], [4, 8, "#c4c0b8"]] as [number, number, string][];
  let k = 0; for (const [n, rad, col] of sizes) for (let i = 0; i < n; i++, k++) dot(c, 300 + (k % 4) * 140 + r() * 60, 140 + Math.floor(k / 4) * 110 + r() * 40, rad, col);
  shape(c, () => rrect(c, 20, 330, 190, 530, 8), COL.brown, 6); shape(c, () => rrect(c, 40, 360, 150, 490, 6), "#8a5a3c", 4);
  c.fillStyle = "rgba(255,226,140,0.5)"; c.fillRect(20, 846, 190, 14); line(c, [[20, 853], [210, 853]], 5, STAR);
  shape(c, () => rrect(c, 850, 520, 170, 310, 20), COL.black, 6); shape(c, () => rrect(c, 866, 548, 138, 250, 8), "#22303a", 4);
  write(c, "15", 884, 640, 70, "#c9f06b", 9);
  person(c, 540, 1020, 460, { sit: true });
  dashes(c, [[540, 560], [540, 500]], 5, PALE);
});

// 4 a1: ten dots of Orion, the hunter in blue and the deer's head in orange
CARDS.push((c) => {
  ground(c, BG);
  shadow(c, 560, 960, 400, 16);
  shape(c, () => rrect(c, 130, 70, 800, 880, 10), COL.paper, 6);
  const o = ORION, J = (...p: number[][]) => p;
  const hunter = J(o.betel, o.bella, o.belt[2], o.rigel, o.saiph, o.belt[0], o.betel);
  line(c, hunter, 7, COL.blue); line(c, [o.belt[0], o.belt[2]], 7, COL.blue);
  line(c, [o.head[0], o.head[1], o.head[2], o.head[0]], 7, ORANGE); line(c, [o.betel, o.head[2], o.bella], 7, COL.blue);
  const all = [o.betel, o.bella, ...o.belt, o.saiph, o.rigel, ...o.head];
  all.forEach(([x, y], i) => dot(c, x, y, i === 0 ? 20 : 15, i === 0 ? COL.red : INK));
  c.save(); c.translate(860, 880); c.rotate(-0.9);
  shape(c, () => rrect(c, -10, -16, 250, 32, 8), COL.wood, 5); shape(c, () => polyP(c, [[-10, -16], [-60, 0], [-10, 16]]), COL.paper, 5); shape(c, () => polyP(c, [[-40, -6], [-60, 0], [-40, 6]]), INK, 2);
  c.restore();
});

// 5 a2: on the balcony, the lights off, pointing at the ladle low over the roofs
CARDS.push((c) => {
  night(c, 11, 34);
  ladleView(c, ([x, y]) => [220 + (x - 330) * 0.85, 250 + (y - 230) * 0.8], 24);
  const roofs = [[0, 640, 150, 90], [150, 610, 120, 120], [270, 660, 160, 70], [430, 620, 110, 110], [540, 650, 170, 80], [710, 600, 120, 130], [830, 640, 250, 90]];
  roofs.forEach(([x, y, w, h]) => shape(c, () => rrect(c, x, y, w, h + 100, 6), "#0f1230", 0));
  shape(c, () => rrect(c, 315, 560, 56, 70, 6), "#0f1230", 0); shape(c, () => ell(c, 343, 560, 40, 36), "#0f1230", 0);
  for (const [x, y] of [[190, 650], [470, 650], [760, 635], [900, 670]]) c.fillStyle = "#ffcf66", c.fillRect(x, y, 14, 18);
  c.fillStyle = "#e9dcc3"; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  c.fillStyle = "#cfa970"; c.fillRect(0, 780, D, 36); line(c, [[0, 816], [D, 816]], 5);
  person(c, 330, 1040, 520, { adult: true, armL: [2.4, 2.2] });
  person(c, 780, 1040, 400, { armR: [-1.95, -1.75] });
});

// 6 a3: the same seven dots joined four ways
CARDS.push((c) => {
  ground(c, BG);
  const K = [[0, 0], [40, -34], [78, 6], [38, 44], [-38, 42], [-64, -14], [-22, -62]];
  const joins: [number[], string][] = [[[1, 2, 3, 4, 5, 6, 1], COL.red], [[5, 6, 1, 2, 3, 4, 5, 0], COL.teal], [[5, 4, 3, 2, 1, 6], COL.purple], [[6, 1, 3, 4, 6, 5, 0], ORANGE]];
  joins.forEach(([seq, col], n) => {
    const px = 30 + (n % 2) * 520, py = 70 + Math.floor(n / 2) * 500;
    panel(c, px, py, 500, 450, NIGHT);
    const cx = px + 250, cy = py + 225, m = (i: number) => [cx + K[i][0] * 2.5, cy + K[i][1] * 2.5];
    line(c, seq.map(m), 7, col);
    K.forEach((_, i) => { const [x, y] = m(i); star(c, x, y, i === 0 ? 14 : 22, i === 0 ? "#bcb6a0" : STAR, 4); });
  });
});

// 7 a4: a calendar with a nakshatra star group marked, and a lit lamp for the festival
CARDS.push((c) => {
  ground(c, BG);
  shadow(c, 340, 830, 290, 22);
  shape(c, () => rrect(c, 50, 130, 580, 690, 18), COL.paper, 6);
  shape(c, () => rrect(c, 50, 130, 580, 110, 18), COL.red, 6);
  for (const x of [170, 340, 510]) shape(c, () => rrect(c, x - 12, 100, 24, 60, 8), COL.steelDk, 5);
  const r = rnd(21);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) {
    const x = 120 + col * 108, y = 310 + row * 102;
    line(c, [[x - 46, y + 48], [x + 46, y + 48]], 2.5, COL.grey);
    if (row === 2 && col === 3) continue;
    if ((row * 5 + col) % 3 === 0) { for (let i = 0; i < 3; i++) dot(c, x - 18 + r() * 36, y - 14 + r() * 28, 6, INK); } else write(c, String(row * 5 + col + 1), x - 14, y - 14, 28, COL.greyDk, 4);
  }
  const hx = 120 + 3 * 108, hy = 310 + 2 * 102;
  c.beginPath(); ell(c, hx, hy, 52, 46); c.fillStyle = NIGHT; c.fill(); c.lineWidth = 6; c.strokeStyle = RED; c.stroke();
  for (const [dx, dy] of [[-22, -12], [0, -22], [20, -8], [-12, 12], [14, 14], [-30, 8]]) dot(c, hx + dx, hy + dy, 5.5, STAR);
  // the diya
  shadow(c, 850, 790, 160, 22);
  glow(c, 850, 480, 190, "rgba(255,200,90,0.3)");
  shape(c, () => { c.moveTo(700, 640); c.quadraticCurveTo(720, 760, 850, 770); c.quadraticCurveTo(980, 760, 1000, 640); c.quadraticCurveTo(850, 690, 700, 640); c.closePath(); }, COL.soil, 6);
  shape(c, () => ell(c, 850, 640, 150, 28), COL.soilDk, 5);
  shape(c, () => { c.moveTo(850, 400); c.quadraticCurveTo(910, 500, 880, 600); c.quadraticCurveTo(850, 635, 820, 600); c.quadraticCurveTo(790, 500, 850, 400); c.closePath(); }, STAR, 6);
  shape(c, () => { c.moveTo(850, 480); c.quadraticCurveTo(880, 540, 865, 600); c.quadraticCurveTo(850, 615, 835, 600); c.quadraticCurveTo(820, 540, 850, 480); c.closePath(); }, ORANGE, 0);
  arrow(c, [[hx + 70, hy + 20], [700, 520], [740, 560]], RED);
});

// 8 a5: a torch with red plastic over its lens, the red light on a notebook
CARDS.push((c) => {
  night(c, 13, 0, NIGHT3);
  shadow(c, 760, 960, 260, 20);
  shape(c, () => polyP(c, [[600, 880], [1030, 840], [1030, 990], [600, 990]]), COL.paper, 6);
  c.save(); c.beginPath(); c.moveTo(600, 880); c.lineTo(1030, 840); c.lineTo(1030, 990); c.lineTo(600, 990); c.closePath(); c.clip(); c.fillStyle = "rgba(215,55,43,0.3)"; c.fillRect(0, 0, D, D); c.restore();
  for (let k = 0; k < 4; k++) line(c, [[640, 905 + k * 22], [980, 880 + k * 22]], 3, COL.greyDk);
  torch(c, 60, 300, 0.42, 300, 100, 560);
  // the folded red plastic and the rubber band at the lens
  c.save(); c.translate(60, 300); c.rotate(0.42);
  shape(c, () => rrect(c, 292, -92, 22, 184, 8), COL.brown, 5);
  c.restore();
});

// 9 p1: a sky map with a skyline of roofs, a water tank and a tree, bright dots above
CARDS.push((c) => {
  ground(c, BG);
  shadow(c, 540, 960, 430, 18);
  shape(c, () => rrect(c, 90, 90, 900, 850, 10), COL.paper, 6);
  c.save(); c.beginPath(); rrect(c, 90, 90, 900, 850, 10); c.clip();
  const sk = "#8d8ba8";
  for (const [x, y, w] of [[90, 700, 130], [220, 640, 110], [330, 720, 120], [450, 660, 100], [740, 690, 130], [870, 620, 130]]) shape(c, () => rrect(c, x, y, w, 300, 4), sk, 5);
  shape(c, () => rrect(c, 540, 640, 160, 300, 4), sk, 5);
  shape(c, () => ell(c, 620, 590, 62, 52), COL.steelDk, 5); shape(c, () => rrect(c, 590, 630, 8, 20, 2), INK, 0); shape(c, () => rrect(c, 640, 630, 8, 20, 2), INK, 0);
  shape(c, () => rrect(c, 520, 560, 4, 4, 1), INK, 0);
  line(c, [[455, 700], [455, 640]], 3);
  shape(c, () => rrect(c, 412, 540, 16, 160, 6), COL.brown, 5); for (const a of [-2.6, -2.0, -1.2, -0.5]) shape(c, () => { const ex = 420 + Math.cos(a) * 110, ey = 545 + Math.sin(a) * 110; c.moveTo(420, 545); c.quadraticCurveTo((420 + ex) / 2, (545 + ey) / 2 - 30, ex, ey); c.quadraticCurveTo((420 + ex) / 2, (545 + ey) / 2 + 24, 420, 545); c.closePath(); }, COL.leaf, 4);
  c.restore();
  for (const [x, y, r] of [[200, 220, 12], [330, 360, 9], [480, 200, 14], [610, 330, 10], [760, 250, 13], [880, 400, 9], [700, 470, 8]]) star(c, x, y, r * 1.8, STAR, 4);
  c.save(); c.translate(900, 960); c.rotate(-0.5);
  shape(c, () => rrect(c, -10, -14, 230, 28, 8), COL.wood, 5); shape(c, () => polyP(c, [[-10, -14], [-52, 0], [-10, 14]]), COL.paper, 5);
  c.restore();
});

// 10 c1: a new constellation, a kite with a tail, over the building; the same shape drawn on paper
CARDS.push((c) => {
  night(c, 15, 36);
  const K = [[330, 150], [470, 280], [330, 430], [190, 280], [260, 540]];
  glow(c, 330, 290, 230);
  line(c, [K[0], K[1], K[2], K[3], K[0]], 7, "rgba(255,243,200,0.85)"); line(c, [K[2], K[4]], 7, "rgba(255,243,200,0.85)");
  K.forEach(([x, y], i) => star(c, x, y, i === 4 ? 24 : 32, STAR, 5));
  shape(c, () => rrect(c, 40, 640, 470, 460, 4), "#0f1230", 0);
  const r = rnd(5);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 4; col++) { c.fillStyle = r() > 0.4 ? "#ffcf66" : "#26306b"; c.fillRect(80 + col * 105, 680 + row * 78, 62, 46); }
  shadow(c, 810, 960, 220, 16);
  c.save(); c.translate(810, 700); c.rotate(0.06);
  shape(c, () => rrect(c, -200, -270, 400, 520, 8), COL.paper, 6);
  const m = ([x, y]: number[]) => [(x - 330) * 0.55, (y - 290) * 0.55 - 20];
  line(c, [K[0], K[1], K[2], K[3], K[0]].map(m), 6, COL.blue); line(c, [K[2], K[4]].map(m), 6, COL.blue);
  K.forEach((p) => dot(c, m(p)[0], m(p)[1], 11, INK));
  for (let k = 0; k < 3; k++) line(c, [[-140, 130 + k * 36], [140, 130 + k * 36]], 3, COL.grey);
  c.restore();
});

// 11 c2: two children far apart on the phone, both looking at the same star, a fist held out
CARDS.push((c) => {
  night(c, 17, 30);
  glow(c, 540, 170, 130); star(c, 540, 170, 62, STAR, 6);
  crescent(c, 880, 110, 50);
  c.fillStyle = "#0f1230"; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 5, "#3a4390");
  const phone = (x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -16, -36, 32, 72, 8), COL.black, 5); c.restore(); };
  person(c, 230, 1040, 480, { armL: [Math.PI, -Math.PI / 2], armR: [-1.15, -1.3] });
  phone(230 - 0.11 * 480 - 0.17 * 480 - 5, 1040 - 0.74 * 480 + 0.03 * 480 - 0.16 * 480 - 20, 0.2);
  person(c, 850, 1040, 480, { armR: [0, -Math.PI / 2], armL: [1.15, -1.3 - 0.0] });
  phone(850 + 0.11 * 480 + 0.17 * 480 + 5, 1040 - 0.74 * 480 + 0.03 * 480 - 0.16 * 480 - 20, -0.2);
  dashes(c, [[130, 540], [300, 440], [540, 420], [780, 440], [950, 540]], 6, STAR, [4, 14]);
});

// 12 term Constellation: Orion's stars with the hunter drawn faintly round them
CARDS.push((c) => {
  night(c, 19, 40);
  const o = ORION;
  c.beginPath(); polyP(c, [o.betel, o.bella, o.belt[2], o.rigel, o.saiph, o.belt[0]]); c.fillStyle = "rgba(255,243,200,0.13)"; c.fill();
  c.beginPath(); ell(c, 532, 188, 62, 62); c.fill();
  line(c, [o.bella, [770, 230], [820, 130]], 14, "rgba(255,243,200,0.2)");
  line(c, [o.betel, [280, 300], [225, 200]], 14, "rgba(255,243,200,0.2)");
  const L = "rgba(255,243,200,0.8)";
  line(c, [o.betel, o.bella, o.belt[2], o.rigel, o.saiph, o.belt[0], o.betel], 5, L);
  line(c, [o.belt[0], o.belt[1], o.belt[2]], 5, L);
  line(c, [o.betel, o.head[0], o.head[1], o.bella], 5, L);
  star(c, o.betel[0], o.betel[1], 40, COL.red); star(c, o.rigel[0], o.rigel[1], 40, "#cfe6ff");
  [o.bella, o.saiph, ...o.belt, ...o.head].forEach(([x, y], i) => star(c, x, y, i < 2 ? 32 : 26, i < 2 ? "#cfe6ff" : STAR, 5));
});

// 13 term Light-year: a beam leaving a star and a calendar year
CARDS.push((c) => {
  night(c, 23, 24);
  glow(c, 200, 540, 160, "rgba(255,226,140,0.14)"); star(c, 200, 540, 90, STAR, 6);
  c.beginPath(); c.moveTo(300, 515); c.lineTo(600, 515); c.lineTo(600, 565); c.lineTo(300, 565); c.closePath(); c.fillStyle = "rgba(255,226,140,0.5)"; c.fill();
  arrow(c, [[310, 540], [640, 540]], STAR, 14);
  shadow(c, 850, 810, 190, 18);
  shape(c, () => rrect(c, 700, 300, 310, 480, 14), COL.paper, 6);
  shape(c, () => rrect(c, 700, 300, 310, 100, 14), COL.red, 6);
  for (const x of [770, 855, 940]) shape(c, () => rrect(c, x - 10, 275, 20, 55, 8), COL.steelDk, 5);
  write(c, "1", 800, 450, 230, INK, 24);
});

// 14 term Dark adaptation: the eye after 1 minute and after 20 minutes
CARDS.push((c) => {
  ground(c, NIGHT3);
  const col = (x0: number, n: number, sd: number, pupil: number, num: string) => {
    eye(c, x0 + 245, 150, 130, 62, pupil);
    panel(c, x0, 290, 490, 440, NIGHT);
    c.save(); c.beginPath(); rrect(c, x0, 290, 490, 440, 28); c.clip(); { const r = rnd(sd); for (let i = 0; i < n; i++) { const [px, py] = n < 10 ? [[120, 150], [300, 330], [390, 220]][i] : [30 + r() * 430, 30 + r() * 380]; dot(c, x0 + (n < 10 ? px : px), 320 + (n < 10 ? py - 30 : py), n < 10 ? 10 : 6, "#fff6c8"); } } c.restore();
    shape(c, () => ell(c, x0 + 90, 850, 54, 54), COL.paper, 6); line(c, [[x0 + 90, 850], [x0 + 90, 812]], 6); line(c, [[x0 + 90, 850], [x0 + 118, 862]], 6);
    write(c, num, x0 + 190, 810, 90, STAR, 12);
  };
  col(30, 3, 31, 12, "1"); col(560, 30, 32, 42, "20");
});

// 15 expl.0: the ladle as seen from Earth, and the same seven stars seen from the side
CARDS.push((c) => {
  ground(c, BG);
  panel(c, 30, 50, 1020, 450); panel(c, 30, 560, 1020, 470);
  c.save(); c.beginPath(); rrect(c, 30, 50, 1020, 450, 28); c.clip(); bgStars(c, 41, 18, 40, 60, 1040, 490);
  earthBall(c, 120, 275, 52);
  ladleView(c, ([x, y]) => [340 + (x - 330) * 1.05, 120 + (y - 230) * 1.0], 28);
  c.restore();
  c.save(); c.beginPath(); rrect(c, 30, 560, 1020, 470, 28); c.clip(); bgStars(c, 42, 18, 40, 570, 1040, 1020);
  earthBall(c, 120, 795, 52);
  side(c, 120, 795, 1.18, 27, 5);
  c.restore();
});

// 16 expl.1: 27 star groups round the sky, the Moon in one, stepping to the next
CARDS.push((c) => {
  ground(c, NIGHT);
  const cx = 540, cy = 540, R = 350;
  c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.strokeStyle = NIGHT2; c.lineWidth = 150; c.stroke();
  const r = rnd(33);
  for (let i = 0; i < 27; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 27, b = a + Math.PI / 27;
    line(c, [[cx + Math.cos(b) * (R - 75), cy + Math.sin(b) * (R - 75)], [cx + Math.cos(b) * (R + 75), cy + Math.sin(b) * (R + 75)]], 3, "#7480c8");
    if (i === 3) continue;
    const n = 3 + Math.floor(r() * 2);
    for (let k = 0; k < n; k++) { const rr = R + (r() - 0.5) * 70, aa = a + (r() - 0.5) * 0.09; dot(c, cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr, 6 + r() * 3, STAR); }
  }
  const ma = -Math.PI / 2 + (3 * Math.PI * 2) / 27;
  glow(c, cx + Math.cos(ma) * R, cy + Math.sin(ma) * R, 58, "rgba(255,233,160,0.3)");
  crescent(c, cx + Math.cos(ma) * R + 14, cy + Math.sin(ma) * R, 46);
  const a0 = ma + 0.03, a1 = ma + (Math.PI * 2) / 27 - 0.02, RR = R + 105, pts: number[][] = [];
  for (let t = 0; t <= 6; t++) { const a = a0 + ((a1 - a0) * t) / 6; pts.push([cx + Math.cos(a) * RR, cy + Math.sin(a) * RR]); }
  arrow(c, pts, RED, 10);
  earthBall(c, cx, cy, 110);
});

// 17 expl.2: the ladle 50,000 years ago, now, and 50,000 years from now
CARDS.push((c) => {
  ground(c, BG);
  const rows: [number, string, number][] = [[-1, "-50000", 0], [0, "0", 1], [1, "+50000", 2]];
  rows.forEach(([ph, num, n]) => {
    const y0 = 30 + n * 350;
    panel(c, 30, y0, 1020, 320);
    c.save(); c.beginPath(); rrect(c, 30, y0, 1020, 320, 28); c.clip(); bgStars(c, 50 + n, 12, 40, y0 + 8, 1040, y0 + 310); c.restore();
    write(c, num, 70, y0 + 140, 44, STAR, 7);
    const dA = [-62 * ph, -38 * ph], dG = [62 * ph, 34 * ph];
    const P = LADLE.map(([x, y], i) => [400 + (x - 330) * 0.78 + (i === 0 ? dA[0] : i === 6 ? dG[0] : 0), y0 + 50 + (y - 230) * 0.78 + (i === 0 ? dA[1] : i === 6 ? dG[1] : 0)]);
    const L = "rgba(255,243,200,0.75)";
    line(c, [P[0], P[1], P[2], P[3], P[0]], 3, L); line(c, [P[3], P[4], P[5], P[6]], 3, L);
    P.forEach(([x, y], i) => star(c, x, y, 22, FAR.includes(i) ? ORANGE : STAR, 4));
    arrow(c, [[P[0][0] - 28, P[0][1] - 12], [P[0][0] - 88, P[0][1] - 52]], RED, 8);
    arrow(c, [[P[6][0] + 28, P[6][1] + 12], [P[6][0] + 88, P[6][1] + 48]], RED, 8);
  });
});

// 18 expl.3: on a balcony with a red torch, the city glowing orange below, a few bright stars
CARDS.push((c) => {
  night(c, 61, 6);
  for (const [x, y] of [[180, 160], [520, 90], [800, 210], [940, 120], [330, 330], [690, 380]]) star(c, x, y, 20, STAR, 4);
  for (const [x, y, r] of [[200, 790, 280], [540, 810, 300], [880, 790, 280]]) glow(c, x, y, r, "rgba(243,154,60,0.28)");
  glow(c, 540, 830, 400, "rgba(243,154,60,0.2)");
  for (const [x, y, w, h] of [[0, 640, 140, 200], [140, 580, 120, 260], [260, 660, 160, 180], [420, 610, 110, 230], [530, 660, 170, 180], [700, 570, 120, 270], [820, 640, 260, 200]]) shape(c, () => rrect(c, x, y, w, h, 6), "#0f1230", 0);
  c.fillStyle = "#ffcf66"; for (const [x, y] of [[170, 620], [300, 700], [450, 650], [580, 700], [730, 610], [880, 680], [60, 690]]) c.fillRect(x, y, 14, 18);
  c.fillStyle = "#e9dcc3"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  c.fillStyle = "#cfa970"; c.fillRect(0, 800, D, 36); line(c, [[0, 836], [D, 836]], 5);
  person(c, 480, 1050, 540, { armR: [0.95, 1.45] });
  torch(c, 602, 815, 1.45, 90, 36, 130);
});

// 19 expl.4: Krittika in the middle, and three of its stories round it
CARDS.push((c) => {
  ground(c, NIGHT3);
  const V: [number, number][] = [[230, 240], [850, 240], [540, 810]];
  V.forEach(([x, y]) => dashes(c, [[540, 500], [x, y]], 5, PALE, [4, 14]));
  glow(c, 540, 500, 130);
  [[0, 0], [40, -34], [78, 6], [38, 44], [-38, 42], [-64, -14], [-22, -62]].forEach(([x, y], i) => star(c, 540 + x * 1.15, 500 + y * 1.15, i === 0 ? 14 : 22, i === 0 ? "#bcb6a0" : STAR, 4));
  const disc = (x: number, y: number, col: string, f: () => void) => { c.save(); c.beginPath(); ell(c, x, y, 175, 175); c.clip(); c.fillStyle = col; c.fillRect(x - 180, y - 180, 360, 360); f(); c.restore(); c.beginPath(); ell(c, x, y, 175, 175); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); };
  // six mothers round a baby
  disc(230, 240, NIGHT2, () => {
    const cl = [COL.red, COL.teal, COL.purple, COL.orange, COL.pink, COL.green];
    cl.forEach((col, k) => { const a = (k * Math.PI) / 3 - Math.PI / 2; bust(c, 230 + Math.cos(a) * 105, 235 + Math.sin(a) * 85 - 22, 22, col, k % 2 ? SKIN.adult : SKIN.child); });
    shape(c, () => ell(c, 230, 246, 30, 22), COL.yellow, 4); shape(c, () => ell(c, 230, 226, 17, 17), SKIN.child, 4);
  });
  // seven sisters in a row
  disc(850, 240, NIGHT2, () => {
    const cl = [COL.red, COL.teal, COL.purple, COL.orange, COL.pink, COL.green, COL.blue];
    cl.forEach((col, k) => bust(c, 850 - 120 + k * 40, 230 + Math.abs(k - 3) * 6, 15, col, k % 2 ? SKIN.adult : SKIN.child));
  });
  // a dawn, the sun rising behind hills, the stars above, a person greeting it
  disc(540, 810, "#f6c77a", () => {
    c.fillStyle = "#2f3a6b"; c.fillRect(350, 630, 380, 120);
    for (const [x, y] of [[440, 665], [480, 685], [520, 660], [560, 690], [500, 710], [455, 710]]) dot(c, x, y, 6, STAR);
    shape(c, () => ell(c, 560, 830, 70, 70), COL.yellow, 0);
    shape(c, () => { c.moveTo(350, 880); c.quadraticCurveTo(450, 790, 560, 860); c.quadraticCurveTo(650, 800, 730, 880); c.lineTo(730, 990); c.lineTo(350, 990); c.closePath(); }, COL.leafDk, 5);
    line(c, [[620, 880], [620, 930]], 8, INK); line(c, [[620, 895], [590, 860]], 7, INK); line(c, [[620, 895], [650, 860]], 7, INK); dot(c, 620, 865, 15, INK);
  });
});

export const ic_skyStargazingL3 = cards("sci.sky.stargazing.L3 cards", CARDS);
