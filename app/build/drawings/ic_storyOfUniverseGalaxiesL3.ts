import type { Ctx } from "./core";
import { D, INK, COL, WHITE, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, person, bowl, plate, cards } from "./flatKit";

// sci.story-of-universe.galaxies.L3 · picture cards (flows, terms, explanations).
const NIGHT = "#1d2140", PAPERDK = "#35313f", TABLE = "#e8cf9c", GLOW = "#fff6c8", BLUEW = "#cfe3ff";

const dots = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, seed: number, rmin = 2.5, rmax = 5.5) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const s = rmin + r() * (rmax - rmin); c.beginPath(); ell(c, x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), s, s); c.fillStyle = GLOW; c.fill(); }
};
const night = (c: Ctx, n = 50, seed = 5) => { c.fillStyle = NIGHT; c.fillRect(0, 0, D, D); dots(c, 30, 30, D - 30, D - 30, n, seed); };
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = col; c.fill(); };
// a galaxy seen from above: glowing middle, an optional bar, two arms of tiny stars
const spiral = (c: Ctx, x: number, y: number, R: number, seed: number, n = 520, bar = false) => {
  const r = rnd(seed);
  c.globalAlpha = 0.25; dot(c, x, y, R * 0.55, "#8fb0ff"); c.globalAlpha = 0.35; dot(c, x, y, R * 0.34, COL.yellow); c.globalAlpha = 1;
  if (bar) { c.save(); c.translate(x, y); c.rotate(-0.5); c.beginPath(); ell(c, 0, 0, R * 0.32, R * 0.09); c.fillStyle = "#ffe9a0"; c.fill(); c.restore(); }
  for (let k = 0; k < 2; k++) for (let i = 0; i < n; i++) {
    const t = Math.pow(r(), 0.8), a = k * Math.PI + (bar ? -0.5 : 0) + t * 4.2, rr = R * (0.22 + 0.78 * t), sc = R * (0.025 + 0.05 * t);
    const px = x + Math.cos(a) * rr + (r() - 0.5) * 2 * sc, py = y + Math.sin(a) * rr + (r() - 0.5) * 2 * sc, s = 2 + r() * 3.4;
    dot(c, px, py, s, r() < 0.12 ? COL.pink : r() < 0.6 ? BLUEW : GLOW);
  }
  for (let i = 0; i < 90; i++) { const a = r() * 6.283, rr = R * 0.3 * Math.sqrt(r()); dot(c, x + Math.cos(a) * rr, y + Math.sin(a) * rr, 2.5 + r() * 2.5, "#ffe08a"); }
};
const sunDot = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(3, r * 0.14)); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.3, 0.5); };
const arc = (c: Ctx, cx: number, cy: number, r: number, a0: number, a1: number, col = RED, w = 10) => {
  const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const a = a0 + ((a1 - a0) * i) / 14; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  arrow(c, pts, col, w);
};
const dashRing = (c: Ctx, x: number, y: number, rx: number, ry: number, col = "rgba(255,246,214,0.6)", w = 5) => { c.save(); c.setLineDash([16, 14]); c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.restore(); };
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => polyP(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
// the pale band across a night sky, from (ax, ay) to (bx, by)
const band = (c: Ctx, ax: number, ay: number, bx: number, by: number, w: number, seed: number) => {
  c.globalAlpha = 0.18; line(c, [[ax, ay], [bx, by]], w * 1.5, "#cdd3ff"); c.globalAlpha = 0.28; line(c, [[ax, ay], [bx, by]], w, "#e6e2ff"); c.globalAlpha = 0.4; line(c, [[ax, ay], [bx, by]], w * 0.45, "#fff6dd"); c.globalAlpha = 1;
  const r = rnd(seed);
  for (let i = 0; i < 260; i++) { const t = r(), px = ax + (bx - ax) * t + (r() - 0.5) * w * 0.9, py = ay + (by - ay) * t + (r() - 0.5) * w * 0.9; dot(c, px, py, 1.6 + r() * 2.2, GLOW); }
};
const hills = (c: Ctx, base: number) => {
  shape(c, () => { c.moveTo(0, base); c.bezierCurveTo(150, base - 150, 300, base - 160, 460, base - 60); c.bezierCurveTo(600, base - 150, 800, base - 190, D, base - 40); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, "#2f2a4a", 6);
};

// ---------------------------------------------------------------- flows
// flow.e1: a card with pairs of pinholes lit from behind; the child walks away
const e1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, 690, D, D - 690); line(c, [[0, 690], [D, 690]], 6);
  person(c, 880, 900, 430);
  shadow(c, 540, 700, 330, 20);
  const bk: [number, string][] = [[0, COL.red], [1, COL.teal], [2, COL.yellow]];
  bk.forEach(([i, col]) => shape(c, () => rrect(c, 360 + (i === 1 ? 14 : 0), 603 + i * 29 - 29 * 0 - 0, 340, 29, 4), col, 5));
  // torch behind the card
  shape(c, () => rrect(c, 190, 380, 220, 76, 18), COL.steel); shade(c, () => rrect(c, 190, 380, 220, 76, 18), COL.steelDk, 0, 22, 0.5);
  shape(c, () => rrect(c, 120, 366, 90, 104, 12), COL.steelDk);
  shape(c, () => rrect(c, 380, 250, 340, 350, 10), PAPERDK, 6);
  const gaps = [[330, 12], [420, 30], [510, 56]];
  gaps.forEach(([y, g]) => [-1, 1].forEach((s) => { c.globalAlpha = 0.35; dot(c, 550 + s * g / 2, y, 16, COL.yellow); c.globalAlpha = 1; dot(c, 550 + s * g / 2, y, 6.5, WHITE); }));
  arrow(c, [[740, 990], [1000, 990]]);
};

// flow.e2: rice grains on newspaper in the shape of a galaxy, a paper Sun and a thread
const e2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 920, 440, 30);
  shape(c, () => polyP(c, [[120, 150], [960, 150], [960, 900], [120, 900]]), "#f3eddc", 6);
  for (let y = 215; y < 880; y += 22) line(c, [[150, y], [930, y]], 2, "rgba(43,35,64,0.12)");
  const r = rnd(9);
  for (let i = 0; i < 380; i++) {
    const a = r() * 6.283, rr = 340 * Math.pow(r(), 1.7), x = 520 + Math.cos(a) * rr, y = 520 + Math.sin(a) * rr * 0.92;
    shape(c, () => ell(c, x, y, 13, 5.5, r() * 3.14), "#fffdf5", 2);
  }
  line(c, [[740, 520], [190, 520]], 8, RED);
  line(c, [[740, 520], [830, 330]], 8, RED);
  sunDot(c, 740, 520, 34);
};

// flow.a1: a photo of the Milky Way on a tablet; the child points at the pale band
const a1 = (c: Ctx) => {
  ground(c);
  person(c, 880, 1040, 560, { armL: [-2.5, -2.5] });
  c.fillStyle = TABLE; c.fillRect(0, 790, D, D - 790); line(c, [[0, 790], [D, 790]], 6);
  shape(c, () => polyP(c, [[380, 790], [520, 790], [450, 700]]), COL.steelDk, 5);
  shadow(c, 420, 800, 330, 18);
  shape(c, () => rrect(c, 110, 130, 640, 580, 26), "#3a3540", 6);
  c.save(); c.beginPath(); rrect(c, 140, 160, 580, 520, 10); c.clip();
  c.fillStyle = NIGHT; c.fillRect(140, 160, 580, 520); dots(c, 140, 160, 720, 680, 28, 4);
  band(c, 200, 640, 680, 200, 130, 12);
  hills(c, 640);
  c.restore();
  shape(c, () => rrect(c, 140, 160, 580, 520, 10), "rgba(0,0,0,0)", 5);
};

// flow.a2: the coin is the whole solar system; the next star is very far away
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 330, 785, 230, 24);
  shape(c, () => ell(c, 300, 540, 230, 230), COL.steel, 8);
  shape(c, () => ell(c, 300, 540, 196, 196), COL.steelIn, 4);
  [58, 88, 118, 148, 178].forEach((rr, i) => { c.beginPath(); ell(c, 300, 540, rr, rr); c.strokeStyle = COL.steelDk; c.lineWidth = 3; c.stroke(); const a = i * 1.7 + 0.5; dot(c, 300 + Math.cos(a) * rr, 540 + Math.sin(a) * rr, 7, [COL.grey, COL.orange, COL.blue, COL.red, COL.brown][i]); });
  sunDot(c, 300, 540, 26);
  c.save(); c.setLineDash([22, 18]); line(c, [[560, 540], [900, 540]], 6, COL.greyDk); c.restore();
  arrow(c, [[570, 540], [850, 540]]);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; line(c, [[960 + Math.cos(a) * 34, 540 + Math.sin(a) * 34], [960 + Math.cos(a) * 54, 540 + Math.sin(a) * 54]], 7, COL.orange); }
  shape(c, () => ell(c, 960, 540, 24, 24), COL.yellow, 5);
};

// flow.a3: child and grown-up on a terrace point at the red star and the tail of stars
const a3 = (c: Ctx) => {
  night(c, 40, 8);
  band(c, 930, 760, 560, 40, 190, 14);
  const S: number[][] = [[600, 400], [640, 440], [600, 480], [690, 520], [730, 590], [760, 660], [820, 700], [880, 680], [890, 630], [855, 600]];
  line(c, [S[0], S[1], S[2]], 3, "rgba(255,246,214,0.5)"); line(c, [S[1], ...S.slice(3)], 3, "rgba(255,246,214,0.5)");
  S.forEach(([x, y], i) => dot(c, x, y, i === 1 ? 20 : 8, i === 1 ? "#ff6a4d" : WHITE));
  c.globalAlpha = 0.3; dot(c, 640, 440, 38, "#ff6a4d"); c.globalAlpha = 1;
  arrow(c, [[980, 470], [900, 560]], COL.yellow, 11);
  c.fillStyle = "#b9a98c"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  person(c, 200, 940, 470, { adult: true, armR: [-0.85, -0.85] });
  person(c, 400, 940, 350, { armR: [-0.85, -0.85] });
};

// flow.p1: a kolam of dots: the galaxy from above and from the side
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 60, 960, 960, 22), "#2a2540", 6);
  const r = rnd(21);
  for (let k = 0; k < 2; k++) for (let i = 0; i < 70; i++) {
    const t = i / 70, a = k * Math.PI - 0.5 + t * 4, rr = 230 * (0.25 + 0.75 * t);
    dot(c, 540 + Math.cos(a) * rr, 350 + Math.sin(a) * rr, 7, WHITE);
  }
  for (let i = 0; i < 9; i++) dot(c, 540 + (i - 4) * 22 * 0.88, 350 + (i - 4) * 22 * -0.48, 9, "#ffe08a");
  for (let i = 0; i < 40; i++) { const a = r() * 6.283, rr = 70 * Math.sqrt(r()); dot(c, 540 + Math.cos(a) * rr, 350 + Math.sin(a) * rr, 5, "#ffe08a"); }
  sunDot(c, 640, 530, 20);
  arrow(c, [[540, 600], [540, 700]]);
  for (let i = 0; i < 28; i++) { const x = 240 + i * 22.2; dot(c, x, 840, 6, WHITE); if (i % 2) dot(c, x + 8, 860, 5, WHITE); else dot(c, x + 8, 820, 5, WHITE); }
  for (let i = 0; i < 40; i++) { const a = r() * 6.283, rr = Math.sqrt(r()); dot(c, 540 + Math.cos(a) * rr * 90, 840 + Math.sin(a) * rr * 80, 6, "#ffe08a"); }
  sunDot(c, 760, 840, 20);
};

// flow.c1: a katori of rice, a teaspoon of grains, and rice spread on a plate in squares
const grain = (c: Ctx, x: number, y: number, rot: number) => shape(c, () => ell(c, x, y, 11, 4.8, rot), "#fffdf5", 2);
const c1 = (c: Ctx) => {
  ground(c);
  bowl(c, 270, 640, 200, "#fffdf5");
  const r = rnd(5);
  for (let i = 0; i < 90; i++) { const a = r() * 6.283, rr = Math.sqrt(r()); grain(c, 270 + Math.cos(a) * rr * 170, 640 + Math.sin(a) * rr * 28, r() * 3); }
  plate(c, 760, 740, 290, 150);
  for (let i = 0; i < 130; i++) { const a = r() * 6.283, rr = Math.sqrt(r()); grain(c, 760 + Math.cos(a) * rr * 215, 740 + Math.sin(a) * rr * 95, r() * 3); }
  c.globalAlpha = 0.95; for (let k = -2; k <= 2; k++) { line(c, [[760 + k * 90, 650], [760 + k * 90, 830]], 3, INK); } line(c, [[570, 740], [950, 740]], 3, INK); c.globalAlpha = 1;
  shape(c, () => rect(c, 670, 650, 90, 90), "rgba(215,55,43,0.12)", 7); c.strokeStyle = RED; c.lineWidth = 7; c.strokeRect(670, 650, 90, 90);
  // the teaspoon of grains
  shadow(c, 520, 290, 220, 18);
  line(c, [[520, 190], [820, 130]], 20, INK); line(c, [[520, 190], [820, 130]], 10, COL.steel);
  shape(c, () => ell(c, 440, 205, 110, 62, -0.2), COL.steel, 6);
  shape(c, () => ell(c, 440, 205, 90, 46, -0.2), COL.steelIn, 4);
  for (let i = 0; i < 14; i++) grain(c, 385 + (i % 5) * 28 + r() * 6, 192 + Math.floor(i / 5) * 18 + r() * 5 - (i % 5) * 4, r() * 3);
};

// ---------------------------------------------------------------- terms
// term.1: the pale band of the Milky Way across the sky above hills
const term1 = (c: Ctx) => {
  night(c, 45, 31);
  band(c, 90, 700, 1020, 140, 190, 33);
  hills(c, 880);
};

// term.2: light runs along a long road to a calendar showing one year
const term2 = (c: Ctx) => {
  ground(c, COL.sky); c.fillStyle = COL.greenLt; c.fillRect(0, 520, D, D - 520); line(c, [[0, 520], [D, 520]], 6);
  shape(c, () => polyP(c, [[160, 1080], [800, 1080], [590, 520], [520, 520]]), "#5a5560", 6);
  for (let i = 0; i < 5; i++) { const t0 = i / 5 + 0.04, t1 = t0 + 0.11, f = (t: number) => [690 - 160 * (1 - t) * 0 - (690 - 555) * t, 1080 - 560 * t]; const [x0, y0] = f(t0), [x1, y1] = f(t1); line(c, [[x0 + (480 - 690) * 0 + 0, y0], [x1, y1]], 10 * (1 - t0) + 3, WHITE); }
  arrow(c, [[480, 1010], [560, 600]], INK, 24); arrow(c, [[480, 1010], [560, 600]], COL.yellow, 14);
  line(c, [[780, 540], [780, 380]], 12, INK); line(c, [[780, 540], [780, 380]], 6, COL.brown);
  shape(c, () => rrect(c, 640, 150, 300, 240, 16), WHITE, 6);
  shape(c, () => rrect(c, 640, 150, 300, 56, 16), RED, 6);
  for (let i = 0; i < 12; i++) shape(c, () => rrect(c, 664 + (i % 4) * 68, 226 + Math.floor(i / 4) * 52, 54, 40, 6), i === 11 ? COL.yellow : "#eee6d2", 3);

};

// term.3: a mango falls to the ground; stars curve round the middle of a galaxy
const term3 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 190, 480, 700, 24), COL.sky, 6);
  c.save(); c.beginPath(); rrect(c, 40, 190, 480, 700, 24); c.clip(); c.fillStyle = COL.greenLt; c.fillRect(40, 760, 480, 140); c.restore();
  line(c, [[40, 760], [520, 760]], 6);
  shape(c, () => rrect(c, 150, 420, 56, 340, 8), COL.brown, 6);
  shape(c, () => ell(c, 178, 340, 130, 120), COL.leaf, 6); shade(c, () => ell(c, 178, 340, 130, 120), COL.leafDk, 30, 30, 0.5); shape(c, () => ell(c, 178, 340, 130, 120), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, 395, 520, 46, 62, 0.4), COL.yellow, 5); shade(c, () => ell(c, 395, 520, 46, 62, 0.4), COL.orange, 14, 14, 0.5);
  shape(c, () => ell(c, 395, 700, 46, 62, 0.4), COL.yellow, 5);
  arrow(c, [[395, 590], [395, 630]]); 
  shape(c, () => rrect(c, 560, 190, 480, 700, 24), NIGHT, 6);
  c.save(); c.beginPath(); rrect(c, 560, 190, 480, 700, 24); c.clip(); spiral(c, 800, 540, 200, 17, 360); c.restore();
  arc(c, 800, 540, 232, -2.3, -0.9);
  arc(c, 800, 540, 232, 0.8, 2.2);
};

// ---------------------------------------------------------------- explanations
const eye = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 80 * s, 50 * s), WHITE, 6); shape(c, () => ell(c, x, y, 32 * s, 32 * s), COL.brown, 5); dot(c, x, y, 14 * s, INK); dot(c, x - 9 * s, y - 9 * s, 5 * s, WHITE);
};
const binoc = (c: Ctx, x: number, y: number) => {
  [-1, 1].forEach((s) => { shape(c, () => rrect(c, x + s * 56 - 40, y - 70, 80, 150, 16), COL.blueDk); shape(c, () => ell(c, x + s * 56, y - 70, 40, 14), "#3a3540", 5); });
  shape(c, () => rrect(c, x - 26, y - 20, 52, 40, 8), COL.steelDk);
};
const scope = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y + 40], [x - 70, y + 130]], 14, INK); line(c, [[x, y + 40], [x + 70, y + 130]], 14, INK); line(c, [[x, y + 40], [x, y + 130]], 14, INK);
  c.save(); c.translate(x, y); c.rotate(-0.6);
  shape(c, () => rrect(c, -150, -42, 300, 84, 12), COL.teal); shape(c, () => rrect(c, -170, -52, 40, 104, 8), COL.tealDk); shape(c, () => rrect(c, 120, -30, 70, 60, 8), COL.steelDk);
  c.restore();
};
const view = (c: Ctx, x: number, kind: 0 | 1 | 2) => {
  const y = 330, R = 150;
  shape(c, () => ell(c, x, y, R, R), NIGHT, 7);
  c.save(); c.beginPath(); ell(c, x, y, R - 3, R - 3); c.clip();
  if (kind === 0) { c.globalAlpha = 0.5; dot(c, x, y, 100, "#d9d6f0"); c.globalAlpha = 0.5; dot(c, x, y, 55, "#fff6dd"); c.globalAlpha = 1; }
  else { c.globalAlpha = kind === 1 ? 0.2 : 0.1; dot(c, x, y, 110, "#cdd3ff"); c.globalAlpha = 1; dots(c, x - R, y - R, x + R, y + R, kind === 1 ? 22 : 80, 40 + kind, kind === 1 ? 4 : 2.2, kind === 1 ? 7 : 4.5); }
  c.restore();
};
const expl2 = (c: Ctx) => {
  ground(c);
  view(c, 190, 0); view(c, 540, 1); view(c, 890, 2);
  arrow(c, [[350, 330], [380, 330]], RED, 9); arrow(c, [[700, 330], [730, 330]], RED, 9);
  eye(c, 190, 760, 1.3); binoc(c, 540, 780); scope(c, 890, 740);
};

// expl.4: a galaxy inside a large invisible cloud that holds it
const expl4 = (c: Ctx) => {
  night(c, 40, 12);
  c.globalAlpha = 0.2; c.beginPath(); ell(c, 540, 540, 470, 430); c.fillStyle = COL.purple; c.fill(); c.globalAlpha = 1;
  dashRing(c, 540, 540, 470, 430, "rgba(214,190,255,0.85)", 6);
  const r = rnd(3); for (let i = 0; i < 70; i++) { const a = r() * 6.283, rr = Math.sqrt(0.25 + 0.75 * r()); dot(c, 540 + Math.cos(a) * rr * 450, 540 + Math.sin(a) * rr * 410, 5, "rgba(214,190,255,0.5)"); }
  spiral(c, 540, 540, 250, 11, 560);
  arc(c, 540, 540, 292, -0.5, 0.5); arc(c, 540, 540, 292, 2.64, 3.64);
};

// expl.5: the galaxy from above, the Sun about halfway out, a black hole at the centre
const expl5 = (c: Ctx) => {
  night(c, 40, 15);
  spiral(c, 540, 540, 410, 7, 700, true);
  dot(c, 540, 540, 40, COL.orange); dot(c, 540, 540, 26, COL.yellow); dot(c, 540, 540, 17, "#050308");
  const sx = 540 + Math.cos(0.9) * 220, sy = 540 + Math.sin(0.9) * 220;
  dashRing(c, 540, 540, 220, 220, "rgba(255,246,214,0.55)", 4);
  sunDot(c, sx, sy, 24);
  arrow(c, [[sx + 170, sy + 150], [sx + 40, sy + 40]]);
};

export const ic_storyOfUniverseGalaxiesL3 = cards("sci.story-of-universe.galaxies.L3 cards", [e1, e2, a1, a2, a3, p1, c1, term1, term2, term3, expl2, expl4, expl5]);
