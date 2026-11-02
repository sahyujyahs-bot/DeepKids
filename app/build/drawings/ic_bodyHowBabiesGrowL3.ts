import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, person, write, cards } from "./flatKit";

// BODY: how babies grow (L3) · picture cards for the experiments, activities, project, challenges and terms.

const BABY = "#d99a6c", BABYDK = "#b87b50", WOMB = "#e8806f", WOMBIN = "#f7c1b3", PLAC = "#c0392b", CORD = "#f3d9b8", CELL = "#fbe3a6", CELLDK = "#f4c95d", DOUGH = "#f0d9a6", DOUGHDK = "#d9b87a";

const table = (c: Ctx, y = 820) => { c.fillStyle = "#e3cfa6"; c.fillRect(0, y, D, D - y); c.fillStyle = "#edddb9"; c.fillRect(0, y, D, 14); line(c, [[0, y], [D, y]], 6); };
const smooth = (c: Ctx, pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
const thick = (c: Ctx, pts: number[][], w: number, col: string, ink = true) => {
  c.lineCap = "round"; c.lineJoin = "round";
  if (ink) { smooth(c, pts); c.strokeStyle = INK; c.lineWidth = w + 12; c.stroke(); }
  smooth(c, pts); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};

// a cell: round, soft yellow, a red-orange nucleus, a few small bits
const cell = (c: Ctx, x: number, y: number, r: number, body = CELL, dk = CELLDK, nuc = "#e4523b", lw = 6) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, body, lw); shade(c, p, dk, r * 0.16, r * 0.12, 0.7);
  shape(c, () => ell(c, x + r * 0.05, y + r * 0.02, r * 0.34, r * 0.34), nuc, Math.max(3, lw * 0.8));
  shape(c, () => ell(c, x + r * 0.1, y - r * 0.02, r * 0.12, r * 0.12), "#b83a28", 0);
  for (const [dx, dy, k] of [[-0.55, -0.4, 0.09], [0.5, -0.5, 0.07], [-0.5, 0.5, 0.08], [0.55, 0.45, 0.1]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * k, r * k * 0.8), dk, Math.max(2, lw * 0.5));
};
// a curled baby (foetus), centre (x, y), s = 1 is about 400 px across
const babyCurled = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const body = () => ell(c, 40, 50, 140, 100, 0.25);
  shape(c, body, BABY, 7); shade(c, body, BABYDK, 14, 14, 0.6);
  const thigh = () => ell(c, 60, 118, 90, 42, -0.35);
  shape(c, thigh, BABY, 7); shade(c, thigh, BABYDK, 8, 10, 0.6);
  shape(c, () => ell(c, -12, 140, 38, 24, 0.2), BABY, 6);
  const head = () => ell(c, -85, -35, 90, 84);
  shape(c, head, BABY, 7); shade(c, head, BABYDK, 14, 12, 0.6);
  shape(c, () => ell(c, -92, -106, 50, 22, 0.1), CLOTH.hair, 5);
  shape(c, () => ell(c, -10, -40, 14, 22), BABY, 5);
  c.beginPath(); c.arc(-112, -40, 12, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.beginPath(); c.arc(-60, -40, 12, 0.2, Math.PI - 0.2); c.stroke();
  line(c, [[-100, 0], [-88, 3]], 5);
  line(c, [[-20, 40], [-60, 20], [-90, 8]], 40, INK); line(c, [[-20, 40], [-60, 20], [-90, 8]], 28, BABY);
  shape(c, () => ell(c, -92, 6, 26, 22), BABY, 6);
  c.restore();
};
// a wrapped newborn bundle with a head, centre of the bundle (x, y)
const newborn = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const cloth = () => { c.moveTo(-90, -40); c.bezierCurveTo(-110, 60, -60, 150, 20, 160); c.bezierCurveTo(120, 165, 170, 70, 120, -40); c.closePath(); };
  shape(c, cloth, "#fff4cf", 7); shade(c, cloth, "#f0dc9c", 14, 8, 0.7);
  line(c, [[-80, 20], [110, 60]], 6, "#e5c970"); line(c, [[-70, 80], [90, 120]], 6, "#e5c970");
  const head = () => ell(c, 0, -80, 82, 76);
  shape(c, head, BABY, 7); shade(c, head, BABYDK, 12, 12, 0.6);
  shape(c, () => ell(c, -4, -140, 30, 14), CLOTH.hair, 4);
  for (const k of [-1, 1]) { c.beginPath(); c.arc(k * 28, -82, 10, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  c.beginPath(); c.arc(0, -62, 11, 0.2, Math.PI - 0.2); c.stroke();
  c.save(); c.globalAlpha = 0.5; for (const k of [-1, 1]) shape(c, () => ell(c, k * 48, -60, 12, 8), COL.pink, 0); c.restore();
  c.restore();
};
// womb cut-away, centre of the cavity (x, y), s = 1 about 560 px tall; water = tint the inside blue
const womb = (c: Ctx, x: number, y: number, s: number, water = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const outer = () => { c.moveTo(0, -250); c.bezierCurveTo(220, -250, 290, -20, 190, 110); c.bezierCurveTo(140, 180, 60, 230, 30, 285); c.lineTo(-30, 285); c.bezierCurveTo(-60, 230, -140, 180, -190, 110); c.bezierCurveTo(-290, -20, -220, -250, 0, -250); c.closePath(); };
  const inner = () => { c.save(); c.translate(0, -16); c.scale(0.8, 0.8); outer(); c.restore(); };
  shape(c, outer, WOMB, 8); shade(c, outer, "#c9604f", 16, 10, 0.55);
  shape(c, inner, water ? "#cfe8f7" : WOMBIN, 5);
  c.restore();
};
const placenta = (c: Ctx, x: number, y: number, rx: number, ry: number, rot: number) => {
  const p = () => ell(c, x, y, rx, ry, rot);
  shape(c, p, PLAC, 7); shade(c, p, "#8f2a20", rx * 0.1, ry * 0.15, 0.6);
  for (const k of [-0.5, 0, 0.5]) { c.save(); c.translate(x, y); c.rotate(rot); line(c, [[-rx * 0.7, k * ry * 0.6], [-rx * 0.1, k * ry * 0.3], [rx * 0.6, k * ry * 0.7]], 5, "#e8806f"); c.restore(); }
};
// a cord: a thick pale tube with a few twist marks along it
const cord = (c: Ctx, pts: number[][], w = 26) => {
  thick(c, pts, w, CORD);
  const n = 7; for (let i = 1; i < n; i++) { const t = i / n, k = t * (pts.length - 1), a = Math.floor(k), f = k - a, p = pts[a], q = pts[Math.min(pts.length - 1, a + 1)]; const mx = p[0] + (q[0] - p[0]) * f, my = p[1] + (q[1] - p[1]) * f; line(c, [[mx - 7, my - 11], [mx + 7, my + 11]], 5, "#c9a77e"); }
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { c.globalAlpha = 0.9; shape(c, () => ell(c, x, y, r, r), COL.drop, 3.5); c.globalAlpha = 1; };
const heartP = (c: Ctx, x: number, y: number, s: number) => () => { c.moveTo(x, y + 0.95 * s); c.bezierCurveTo(x - 1.1 * s, y + 0.2 * s, x - 1.15 * s, y - 0.75 * s, x - 0.5 * s, y - 0.8 * s); c.bezierCurveTo(x - 0.2 * s, y - 0.82 * s, x - 0.05 * s, y - 0.65 * s, x, y - 0.45 * s); c.bezierCurveTo(x + 0.05 * s, y - 0.65 * s, x + 0.2 * s, y - 0.82 * s, x + 0.5 * s, y - 0.8 * s); c.bezierCurveTo(x + 1.15 * s, y - 0.75 * s, x + 1.1 * s, y + 0.2 * s, x, y + 0.95 * s); c.closePath(); };
const heart = (c: Ctx, x: number, y: number, s: number) => { shape(c, heartP(c, x, y, s), COL.red, 6); shine(c, [[x - 0.7 * s, y - 0.35 * s], [x - 0.55 * s, y - 0.6 * s]], Math.max(5, s * 0.07)); };
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => { const p = () => ell(c, x, y, rx, ry, rot); shape(c, p, "#f6ead2", 6); shade(c, p, "#e0cfa9", rx * 0.2, ry * 0.15, 0.6); shine(c, [[x - rx * 0.5, y - ry * 0.3], [x - rx * 0.3, y - ry * 0.6]], 6); };
const note = (c: Ctx, x: number, y: number, s: number, col: string) => { line(c, [[x + 24 * s, y], [x + 24 * s, y - 90 * s]], 8 * s, INK); line(c, [[x + 24 * s, y - 90 * s], [x + 62 * s, y - 62 * s], [x + 50 * s, y - 36 * s]], 8 * s, INK); shape(c, () => ell(c, x, y, 28 * s, 20 * s, -0.4), col, 5); };
// a plain front face, head centre (x, y) radius r
const face = (c: Ctx, x: number, y: number, r: number, adult = false, blur = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, dk = adult ? SKIN.adultDk : SKIN.childDk;
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.97, y + r * 0.08, r * 0.13, r * 0.2), skin, 5);
  const head = () => ell(c, x, y, r, r * 1.05);
  shape(c, head, skin); shade(c, head, dk, r * 0.16, r * 0.1, 0.6);
  shape(c, () => { c.moveTo(x - r * 1.02, y - r * 0.05); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.02, y - r * 0.05); c.quadraticCurveTo(x, y - r * 0.62, x - r * 1.02, y - r * 0.05); c.closePath(); }, CLOTH.hair, 5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.12, r * 0.09, r * 0.13), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.38, r * 0.25, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  if (blur) { c.save(); c.globalAlpha = 0.55; c.fillStyle = "#efe4cf"; c.beginPath(); ell(c, x, y, r * 1.2, r * 1.3); c.fill(); c.restore(); }
};

// ---------------------------------------------------------------- e1 : The Floating Safe
const e1 = (c: Ctx) => {
  ground(c); table(c, 830);
  const jar = (x: number, water: boolean) => {
    shadow(c, x + 20, 840, 200, 26);
    const body = () => rrect(c, x - 150, 250, 300, 580, 40);
    shape(c, body, COL.glass, 0);
    if (water) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - 160, 330, 320, 520); c.restore(); shape(c, () => ell(c, x, 330, 150, 18), COL.drop, 4); }
    shape(c, body, "rgba(0,0,0,0)", 7);
    shape(c, () => rrect(c, x - 160, 215, 320, 50, 14), COL.teal, 6);
    shine(c, [[x - 112, 380], [x - 112, 740]], 9);
  };
  jar(290, true); jar(790, false);
  egg(c, 290, 560, 70, 92, 0.2);
  // the cracked egg at the bottom of the empty jar
  const half = (hx: number, rot: number) => shape(c, () => { c.save(); c.translate(hx, 780); c.rotate(rot); c.moveTo(-50, 0); c.lineTo(-34, -22); c.lineTo(-18, 0); c.lineTo(0, -26); c.lineTo(18, 0); c.lineTo(34, -22); c.lineTo(50, 0); c.bezierCurveTo(50, 50, -50, 50, -50, 0); c.restore(); }, "#f6ead2", 6);
  shape(c, () => ell(c, 790, 790, 110, 28), "#ffc83d", 6); half(740, -0.25); half(850, 0.25);
  arrow(c, [[190, 150], [290, 120], [390, 150]]); arrow(c, [[690, 150], [790, 120], [890, 150]]);
};
// ---------------------------------------------------------------- e2 : Hearing Through Water
const e2 = (c: Ctx) => {
  ground(c);
  // water bag
  const bx = 520, T = 200, B = 880, w = 330;
  const bag = () => { c.moveTo(bx - w * 0.45, T + 40); c.bezierCurveTo(bx - w * 0.7, T + 300, bx - w * 0.6, B - 20, bx - w * 0.3, B); c.lineTo(bx + w * 0.3, B); c.bezierCurveTo(bx + w * 0.6, B - 20, bx + w * 0.7, T + 300, bx + w * 0.45, T + 40); c.closePath(); };
  shadow(c, bx + 40, B + 10, 190, 26);
  shape(c, bag, "rgba(214,236,250,0.6)", 0);
  c.save(); c.beginPath(); bag(); c.clip(); c.fillStyle = COL.water; c.fillRect(bx - 300, T + 90, 600, 800); c.fillStyle = COL.drop; c.fillRect(bx - 300, T + 90, 600, 12); c.restore();
  shape(c, bag, "rgba(255,255,255,0.1)", 7);
  shape(c, () => rrect(c, bx - w * 0.45, T, w * 0.9, 54, 12), "rgba(214,236,250,0.8)", 6);
  shine(c, [[bx - 120, T + 150], [bx - 130, B - 120]], 9);
  // child, ear on the bag
  shape(c, () => rrect(c, 50, 700, 340, 400, 70), CLOTH.child);
  face(c, 230, 520, 140);
  // sound waves and a note on the far side
  note(c, 880, 560, 1.4, COL.purple);
  for (const r of [90, 150, 210]) { c.beginPath(); c.arc(870, 470, r, -0.7, 0.7); c.strokeStyle = COL.purple; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
};
// ---------------------------------------------------------------- e3 : Keep the Baby Warm
const e3 = (c: Ctx) => {
  ground(c); table(c, 800);
  const steam = (x: number, y: number) => { for (const dx of [-26, 20]) { const pts: number[][] = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push([x + dx + Math.sin(t * 7) * 12, y - t * 110]); line(c, pts, 7, COL.grey); } };
  const bottle = (x: number) => {
    shadow(c, x + 14, 810, 100, 16);
    const b = () => rrect(c, x - 80, 400, 160, 400, 36), n = () => rrect(c, x - 32, 340, 64, 80, 10);
    shape(c, n, COL.glass, 6); shape(c, b, COL.glass, 0);
    c.save(); c.beginPath(); b(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - 90, 470, 180, 340); c.restore();
    shape(c, b, "rgba(0,0,0,0)", 6); shape(c, () => rrect(c, x - 36, 316, 72, 34, 8), COL.teal, 5);
    shine(c, [[x - 55, 480], [x - 55, 740]], 8);
  };
  bottle(170); bottle(500); bottle(830);
  // the towel around the middle one
  const tw = () => rrect(c, 400, 520, 200, 290, 24);
  shape(c, tw, CLOTH.adult); shade(c, tw, CLOTH.adultDk, 20, 0, 0.7);
  line(c, [[400, 600], [600, 600]], 5, CLOTH.adultDk); line(c, [[400, 690], [600, 690]], 5, CLOTH.adultDk);
  // the right-hand bottle held against a person: two hands round it
  hand(c, 660, 600, 0, 1.2, SKIN.adult, CLOTH.adult, false);
  hand(c, 960, 640, Math.PI, 1.2, SKIN.adult, CLOTH.adult, false);
  steam(170, 330); steam(500, 330); steam(830, 330);
};
// ---------------------------------------------------------------- a1 : One Cell to Many (dough)
const a1 = (c: Ctx) => {
  ground(c); table(c, 800);
  const ball = (x: number, y: number, r: number) => { const p = () => ell(c, x, y, r, r * 0.88); shape(c, p, DOUGH, 7); shade(c, p, DOUGHDK, r * 0.14, r * 0.12, 0.6); shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.4, y - r * 0.6]], 8); };
  shadow(c, 160, 790, 100, 16); ball(160, 700, 90);
  shadow(c, 520, 790, 190, 16); ball(430, 710, 80); ball(610, 710, 80);
  for (const [x, y] of [[760, 720], [880, 720], [820, 620], [940, 620]]) { shadow(c, x, y + 62, 56, 10); ball(x, y, 52); }
  arrow(c, [[260, 520], [330, 480], [400, 520]]);
  arrow(c, [[620, 520], [690, 480], [760, 520]]);
  write(c, "1", 130, 300, 100); write(c, "2", 490, 300, 100); write(c, "4", 840, 300, 100);
};
// ---------------------------------------------------------------- a2 : How Big Was I? (fruit line)
const a2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 420, 1000, 420, 30), COL.paper, 7);
  line(c, [[80, 790], [1000, 790]], 10, COL.wood);
  for (let i = 0; i <= 8; i++) line(c, [[100 + i * 110, 790], [100 + i * 110, i % 2 ? 765 : 745]], 5);
  // grape, lemon, banana, papaya, in growing size
  for (const [x, y] of [[120, 735], [160, 735], [140, 700]]) { const p = () => ell(c, x, y, 26, 26); shape(c, p, COL.purple, 5); shade(c, p, "#6a4aa5", 6, 6, 0.6); }
  const lem = () => ell(c, 330, 710, 62, 44, -0.2); shape(c, lem, COL.yellow, 6); shade(c, lem, "#e5b52f", 10, 8, 0.6); shape(c, () => ell(c, 388, 690, 10, 8), COL.yellow, 5);
  const ban = () => { c.moveTo(500, 620); c.bezierCurveTo(500, 760, 620, 790, 720, 740); c.bezierCurveTo(640, 760, 560, 730, 548, 620); c.closePath(); };
  shape(c, ban, COL.yellow, 6); shade(c, ban, "#e5b52f", 10, 10, 0.6); shape(c, () => rrect(c, 495, 596, 60, 34, 8), COL.brown, 5);
  const pap = () => ell(c, 860, 690, 120, 80, -0.25); shape(c, pap, "#f0a23a", 7); shade(c, pap, "#cf7f1f", 16, 14, 0.6); shape(c, () => ell(c, 850, 690, 50, 28, -0.25), "#e4523b", 4);
  for (const [x, y] of [[835, 690], [855, 678], [870, 700], [845, 706]]) shape(c, () => ell(c, x, y, 5, 5), INK, 0);
  arrow(c, [[120, 360], [520, 300], [920, 360]]);
};
// ---------------------------------------------------------------- a3 : Prints
const a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 900, 400, 36);
  shape(c, () => polyP(c, [[130, 250], [900, 250], [960, 900], [60, 900]]), COL.paper, 7);
  // a thumbprint: nested ovals
  for (let i = 0; i < 7; i++) { c.beginPath(); ell(c, 480, 570, 60 + i * 28, 80 + i * 36); c.strokeStyle = i % 2 ? "#3f6fb3" : COL.blue; c.lineWidth = 12; c.stroke(); }
  c.beginPath(); c.arc(480, 570, 40, 0, 6.3); c.fillStyle = COL.blue; c.fill();
  // the ink pad
  shape(c, () => rrect(c, 700, 120, 300, 150, 28), COL.teal, 6);
  shape(c, () => rrect(c, 730, 142, 240, 90, 16), "#3f6fb3", 5);
  // magnifier over the print
  shape(c, () => ell(c, 330, 420, 150, 150), "rgba(214,236,250,0.35)", 12);
  line(c, [[222, 528], [90, 660]], 38, INK); line(c, [[222, 528], [90, 660]], 22, CLOTH.child);
  shine(c, [[260, 340], [320, 290]], 10);
};
// ---------------------------------------------------------------- a4 : Arrival story
const a4 = (c: Ctx) => {
  ground(c); table(c, 880);
  person(c, 330, 880, 640, { adult: true, sit: true, armL: [1.7, 1.9], armR: [-0.6, -1.3] });
  person(c, 790, 880, 480, { sit: true, armL: [1.6, 1.2], armR: [1.4, 1.2] });
  // a speech bubble holding a newborn bundle
  const sp = () => { c.moveTo(350, 100); c.bezierCurveTo(350, 40, 800, 40, 800, 130); c.bezierCurveTo(800, 330, 350, 330, 350, 130); c.closePath(); };
  shape(c, sp, WHITE, 7); shape(c, () => polyP(c, [[420, 290], [380, 380], [500, 305]]), WHITE, 7);
  line(c, [[430, 292], [500, 304]], 12, WHITE);
  newborn(c, 575, 170, 0.55);
};
// ---------------------------------------------------------------- a5 : Womb in a bottle
const a5 = (c: Ctx) => {
  ground(c); table(c, 880);
  shadow(c, 560, 890, 330, 30);
  const jar = () => rrect(c, 250, 180, 620, 700, 60);
  shape(c, jar, COL.glass, 0);
  c.save(); c.beginPath(); jar(); c.clip(); c.fillStyle = COL.water; c.fillRect(240, 270, 640, 640); c.fillStyle = COL.drop; c.fillRect(240, 270, 640, 12); c.restore();
  // the bag (womb) inside
  shape(c, () => ell(c, 560, 560, 220, 260), "rgba(255,255,255,0.35)", 6);
  babyCurled(c, 540, 560, 0.62);
  // the round red cloth on the wall and the wool cord
  shape(c, () => ell(c, 300, 480, 36, 100), PLAC, 6);
  thick(c, [[320, 500], [400, 600], [470, 620]], 12, "#e8d8b0");
  shape(c, jar, "rgba(0,0,0,0)", 7);
  shine(c, [[290, 330], [290, 780]], 9);
};
// ---------------------------------------------------------------- a6 : Newborn eyes
const a6 = (c: Ctx) => {
  ground(c);
  // a ruler under both faces
  shape(c, () => rrect(c, 60, 880, 960, 80, 10), COL.wood, 6);
  for (let i = 0; i <= 10; i++) line(c, [[100 + i * 88, 880], [100 + i * 88, i % 5 === 0 ? 925 : 905]], 4);
  face(c, 250, 520, 150);
  // the frosted sheet in front of the child's eyes
  shape(c, () => rrect(c, 330, 380, 80, 280, 14), "rgba(255,255,255,0.8)", 6);
  face(c, 820, 520, 150, true);
  c.save(); c.globalAlpha = 0.5; c.fillStyle = "#efe4cf"; c.fillRect(640, 340, 360, 360); c.restore();
  arrow(c, [[440, 780], [620, 780]]);
};
// ---------------------------------------------------------------- p1 : The Forty-Week Scroll
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 880, 480, 30);
  shape(c, () => rrect(c, 110, 280, 860, 560, 16), COL.paper, 7);
  for (const x of [110, 970]) { shape(c, () => rrect(c, x - 36, 250, 72, 620, 36), "#f3e3b8", 7); }
  line(c, [[170, 780], [910, 780]], 8);
  for (let i = 0; i <= 8; i++) line(c, [[190 + i * 90, 780], [190 + i * 90, 810]], 5);
  cell(c, 200, 620, 30, CELL, CELLDK, "#e4523b", 5);
  const g = () => ell(c, 330, 640, 26, 26); shape(c, g, COL.purple, 5);
  const l = () => ell(c, 460, 630, 44, 32, -0.2); shape(c, l, COL.yellow, 5);
  const m = () => ell(c, 610, 600, 62, 44, -0.2); shape(c, m, "#f0a23a", 5);
  babyCurled(c, 800, 570, 0.38);
  arrow(c, [[200, 400], [550, 360], [900, 400]]);
};
// ---------------------------------------------------------------- c1 : Egg-Baby Carrier
const c1 = (c: Ctx) => {
  ground(c);
  // stairs
  const st = () => polyP(c, [[0, 1080], [0, 760], [320, 760], [320, 660], [640, 660], [640, 560], [960, 560], [960, 1080]]);
  shape(c, st, "#d9c9a8", 7); shade(c, st, "#bfae8a", 0, 20, 0.5);
  // the carrier: a basket with padding, an egg inside, a loop handle
  c.save(); c.translate(120, 0);
  shadow(c, 700, 560, 220, 20);
  thick(c, [[540, 330], [700, 140], [860, 330]], 18, COL.brown);
  const basket = () => { c.moveTo(500, 330); c.lineTo(900, 330); c.lineTo(840, 550); c.lineTo(560, 550); c.closePath(); };
  shape(c, basket, COL.wood, 7); shade(c, basket, COL.woodDk, 20, 10, 0.6);
  for (const y of [390, 450, 510]) line(c, [[510 + (y - 330) * 0.1, y], [890 - (y - 330) * 0.1, y]], 5, COL.woodDk);
  shape(c, () => ell(c, 700, 330, 190, 34), "#f2f0e8", 6);
  egg(c, 700, 320, 60, 78);
  c.restore();
  arrow(c, [[540, 480], [450, 540], [350, 600]]);
  arrow(c, [[250, 600], [170, 650], [90, 710]]);
};
// ---------------------------------------------------------------- c2 : A safe baby sling
const c2 = (c: Ctx) => {
  ground(c);
  const x = 470;
  shape(c, () => rrect(c, x - 280, 600, 560, 600, 120), CLOTH.adult, 7);
  shape(c, () => rrect(c, x - 55, 440, 110, 100, 16), SKIN.adult, 5);
  face(c, x, 320, 150, true);
  // two cloth straps from the pouch up behind the neck, the baby in the pouch, the head held up
  line(c, [[x - 110, 820], [x - 60, 560]], 46, INK); line(c, [[x - 110, 820], [x - 60, 560]], 32, CLOTH.child);
  line(c, [[x + 110, 820], [x + 60, 560]], 46, INK); line(c, [[x + 110, 820], [x + 60, 560]], 32, CLOTH.child);
  newborn(c, x, 780, 0.9);
  const pouch = () => { c.moveTo(x - 150, 800); c.quadraticCurveTo(x, 840, x + 150, 800); c.bezierCurveTo(x + 170, 960, x + 120, 1040, x, 1040); c.bezierCurveTo(x - 120, 1040, x - 170, 960, x - 150, 800); c.closePath(); };
  shape(c, pouch, CLOTH.child, 7); shade(c, pouch, CLOTH.childDk, 14, 10, 0.6);
  hand(c, x + 270, 720, Math.PI, 1.0, SKIN.adult, CLOTH.adult, true);
};
// ---------------------------------------------------------------- terms
const tCell = (c: Ctx) => { ground(c); shadow(c, 560, 900, 330, 34); cell(c, 540, 520, 330); };
const tEgg = (c: Ctx) => {
  ground(c);
  for (const r of [430, 380]) { c.beginPath(); ell(c, 540, 540, r, r); c.fillStyle = r === 430 ? "rgba(255,255,255,0.45)" : "rgba(255,226,230,0.8)"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); }
  cell(c, 540, 540, 300, "#ffd9e0", "#f2a9bc", "#c0392b");
  for (let i = 0; i < 18; i++) { const a = (i * Math.PI * 2) / 18; line(c, [[540 + Math.cos(a) * 395, 540 + Math.sin(a) * 395], [540 + Math.cos(a) * 425, 540 + Math.sin(a) * 425]], 4); }
};
const sperm = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const t: number[][] = []; for (let i = 0; i <= 12; i++) t.push([-30 - i * 16, Math.sin(i * 0.9) * 14]);
  thick(c, t, 8, "#5b8fd6", true); shape(c, () => ell(c, 0, 0, 40, 28), "#dfe9fa", 6); c.restore();
};
const tFert = (c: Ctx) => {
  ground(c);
  cell(c, 270, 520, 190, "#ffd9e0", "#f2a9bc", "#c0392b", 6);
  sperm(c, 440, 380, 1.2, 2.6); sperm(c, 440, 700, 1.2, -2.6);
  arrow(c, [[520, 540], [560, 540], [590, 540]]);
  c.save(); c.shadowColor = COL.yellow; c.shadowBlur = 60;
  cell(c, 810, 540, 190, "#fff0b8", "#f4c95d", "#e4523b", 6); c.restore();
  for (const [dx, dy] of [[-230, -170], [-250, 110], [190, -230], [230, 180]]) { const x = 810 + dx, y = 540 + dy; line(c, [[x - 24, y], [x + 24, y]], 8, COL.orange); line(c, [[x, y - 24], [x, y + 24]], 8, COL.orange); }
};
const tEmbryo = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(-90, -70);
  const sac = () => ell(c, 540, 480, 330, 320);
  shape(c, sac, "#cfe8f7", 7);
  // tiny embryo: a bean with a big head, tail, buds, a red heart dot
  const body = () => { c.moveTo(430, 330); c.bezierCurveTo(300, 330, 300, 540, 430, 600); c.bezierCurveTo(540, 650, 700, 630, 720, 560); c.bezierCurveTo(690, 590, 580, 580, 530, 520); c.bezierCurveTo(500, 470, 560, 420, 530, 360); c.bezierCurveTo(510, 330, 470, 330, 430, 330); c.closePath(); };
  shape(c, body, BABY, 7); shade(c, body, BABYDK, 10, 10, 0.55);
  shape(c, () => ell(c, 470, 440, 14, 14), PLAC, 4);
  shape(c, () => ell(c, 380, 390, 12, 12), INK, 0);
  shape(c, () => ell(c, 560, 510, 22, 14, 0.8), BABY, 5);
  c.restore();
  // a grain of rice for scale
  shadow(c, 790, 930, 160, 16);
  shape(c, () => ell(c, 780, 900, 120, 34, -0.1), "#fffaf0", 6); line(c, [[690, 905], [860, 888]], 4, COL.grey);
};
const tFoetus = (c: Ctx) => { ground(c); shadow(c, 540, 860, 300, 30); babyCurled(c, 500, 480, 1.7); };
const tWomb = (c: Ctx) => {
  ground(c);
  womb(c, 640, 480, 1.0);
  babyCurled(c, 640, 470, 0.55);
  // a small pear
  shadow(c, 160, 760, 110, 18);
  const pear = () => { c.moveTo(160, 520); c.bezierCurveTo(215, 520, 215, 590, 250, 660); c.bezierCurveTo(290, 760, 230, 800, 160, 800); c.bezierCurveTo(90, 800, 30, 760, 70, 660); c.bezierCurveTo(105, 590, 105, 520, 160, 520); c.closePath(); };
  shape(c, pear, COL.greenLt, 7); shade(c, pear, COL.green, 14, 12, 0.55);
  line(c, [[160, 520], [165, 470]], 9, COL.brown);
  arrow(c, [[250, 600], [350, 560]]);
};
const tPlacenta = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 90);
  placenta(c, 310, 560, 230, 150, -0.5);
  cord(c, [[400, 520], [520, 400], [640, 440], [700, 360]], 28);
  babyCurled(c, 780, 340, 0.55);
  arrow(c, [[400, 400], [500, 300], [640, 320]]);
  for (const [x, y] of [[470, 330], [560, 290]]) shape(c, () => ell(c, x, y, 14, 14), COL.yellow, 5);
  c.restore();
};
const tCord = (c: Ctx) => {
  ground(c);
  babyCurled(c, 700, 300, 0.6);
  cord(c, [[640, 380], [520, 470], [640, 590], [470, 690], [360, 790]], 40);
  placenta(c, 260, 870, 200, 100, 0.2);
};
const tFluid = (c: Ctx) => {
  ground(c);
  const sac = () => ell(c, 540, 520, 420, 380);
  shape(c, sac, "#cfe8f7", 8);
  babyCurled(c, 520, 520, 1.0);
  for (const [x, y, r] of [[250, 390, 24], [300, 300, 14], [820, 420, 20], [850, 640, 28], [260, 700, 16]]) bubble(c, x, y, r);
  for (const y of [260, 800]) { const pts: number[][] = []; for (let t = 0; t <= 400; t += 8) pts.push([340 + t, y + Math.sin(t / 30) * 14]); line(c, pts, 7, COL.waterDk); }
  shine(c, [[200, 430], [220, 600]], 10);
};
const tOxygen = (c: Ctx) => {
  ground(c);
  const lobe = (m: number) => () => { c.moveTo(540 + m * 30, 370); c.bezierCurveTo(540 + m * 170, 330, 540 + m * 240, 560, 540 + m * 190, 740); c.bezierCurveTo(540 + m * 140, 840, 540 + m * 50, 800, 540 + m * 30, 720); c.closePath(); };
  for (const m of [-1, 1]) { shape(c, lobe(m), "#f29ab4", 7); shade(c, lobe(m), "#d9738f", m * -20, 0, 0.6); }
  line(c, [[540, 230], [540, 450]], 50, INK); line(c, [[540, 230], [540, 450]], 34, COL.steelIn);
  for (const m of [-1, 1]) { const b = [[540, 440], [540 + m * 60, 500], [540 + m * 110, 620]]; line(c, b, 34, INK); line(c, b, 20, COL.steelIn); }
  const o2 = (x: number, y: number) => { shape(c, () => ell(c, x - 22, y, 34, 34), COL.blue, 5); shape(c, () => ell(c, x + 22, y, 34, 34), COL.blue, 5); shine(c, [[x - 38, y - 16], [x - 28, y - 24]], 6); };
  o2(240, 130); o2(540, 90); o2(840, 130);
  arrow(c, [[300, 190], [440, 250]]); arrow(c, [[540, 130], [540, 190]]); arrow(c, [[780, 190], [640, 250]]);
};
const tPregnant = (c: Ctx) => {
  ground(c);
  // a woman seen from the side, facing right, one hand on her round tummy
  shadow(c, 500, 1010, 260, 22);
  for (const dx of [-30, 50]) { line(c, [[470 + dx, 800], [470 + dx, 1000]], 74, INK); line(c, [[470 + dx, 800], [470 + dx, 1000]], 60, "#6b5a8c"); shape(c, () => rrect(c, 440 + dx, 985, 130, 40, 18), SKIN.adultDk, 5); }
  const dress = () => { c.moveTo(410, 400); c.bezierCurveTo(400, 600, 380, 760, 400, 860); c.lineTo(600, 860); c.bezierCurveTo(780, 840, 790, 560, 640, 470); c.bezierCurveTo(610, 430, 600, 400, 580, 380); c.closePath(); };
  shape(c, dress, CLOTH.adult, 7); shade(c, dress, CLOTH.adultDk, 20, 10, 0.55);
  shape(c, () => rrect(c, 470, 300, 70, 110, 22), SKIN.adult, 6);
  const head = () => ell(c, 515, 240, 120, 126);
  shape(c, head, SKIN.adult); shade(c, head, SKIN.adultDk, 14, 10, 0.55);
  shape(c, () => { c.moveTo(395, 250); c.bezierCurveTo(380, 90, 650, 90, 636, 250); c.quadraticCurveTo(540, 160, 395, 250); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 405, 190, 62, 56), CLOTH.hair, 6);
  shape(c, () => ell(c, 580, 245, 12, 16), INK, 0);
  c.beginPath(); c.arc(590, 290, 26, 0.3, Math.PI - 0.6); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  // arm over the tummy
  line(c, [[470, 420], [450, 560], [610, 600]], 70, INK); line(c, [[470, 420], [450, 560], [610, 600]], 56, CLOTH.adult);
  shape(c, () => ell(c, 650, 600, 58, 44, 0.4), SKIN.adult, 6);
};
const tBirth = (c: Ctx) => {
  ground(c);
  face(c, 380, 300, 140, true);
  shape(c, () => rrect(c, 130, 470, 500, 700, 100), CLOTH.adult, 7);
  face(c, 380, 300, 140, true);
  newborn(c, 600, 720, 1.1);
  hand(c, 220, 800, -0.2, 1.1, SKIN.adult, CLOTH.adult, true);
};
const tPremature = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 900, 420, 36);
  shape(c, () => rrect(c, 120, 780, 800, 100, 24), COL.steel, 7);
  const box = () => rrect(c, 160, 360, 720, 430, 90);
  shape(c, box, COL.glass, 0);
  shape(c, () => rrect(c, 200, 680, 640, 70, 20), "#f7e3a8", 6);
  shape(c, box, "rgba(0,0,0,0)", 8);
  shine(c, [[230, 440], [330, 400]], 10);
  // tiny baby in a hat
  newborn(c, 520, 640, 0.62);
  shape(c, () => { c.moveTo(468, 586); c.bezierCurveTo(468, 506, 572, 506, 572, 586); c.closePath(); }, COL.pink, 5);
  // a nurse's hand on the side
  hand(c, 960, 560, Math.PI, 1.2, SKIN.adult, CLOTH.adult, true);
};
const tAdopt = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 860, 480, 130), "#e5a552", 7);
  for (let i = 0; i < 9; i++) line(c, [[100 + i * 110, 780], [60 + i * 120, 960]], 5, "#c47f2c");
  person(c, 230, 880, 640, { adult: true, sit: true });
  person(c, 540, 880, 440, { sit: true });
  person(c, 840, 890, 580, { adult: true, sit: true });
  heart(c, 540, 270, 90);
};
const tDNA = (c: Ctx) => {
  ground(c);
  { const p = () => ell(c, 410, 540, 380, 380); shape(c, p, CELL, 7); shade(c, p, CELLDK, 60, 45, 0.7); shape(c, () => ell(c, 410, 540, 230, 300), "#fff3d6", 6); }
  // double helix
  const A: number[][] = [], B: number[][] = [];
  for (let t = 0; t <= 100; t++) { const y = 230 + t * 6.2, k = t / 100 * Math.PI * 4; A.push([410 + Math.sin(k) * 120, y]); B.push([410 - Math.sin(k) * 120, y]); }
  for (let t = 4; t <= 96; t += 8) { line(c, [A[t], B[t]], 10, INK); line(c, [A[t], B[t]], 5, t % 16 ? COL.yellow : COL.pink); }
  line(c, A, 22, INK); line(c, A, 12, COL.blue); line(c, B, 22, INK); line(c, B, 12, COL.red);
  // a little open book
  const bk = 800, by = 720;
  shape(c, () => polyP(c, [[bk, by - 60], [bk + 130, by - 100], [bk + 130, by + 120], [bk, by + 150]]), COL.paper, 6);
  shape(c, () => polyP(c, [[bk, by - 60], [bk - 130, by - 100], [bk - 130, by + 120], [bk, by + 150]]), COL.paper, 6);
  for (const k of [10, 40, 70]) { line(c, [[bk + 20, by + k - 40], [bk + 110, by + k - 62]], 5, COL.grey); line(c, [[bk - 20, by + k - 40], [bk - 110, by + k - 62]], 5, COL.grey); }
  arrow(c, [[680, 520], [770, 600]]);
};

export const ic_bodyHowBabiesGrowL3 = cards("sci.body.how-babies-grow.L3 cards", [
  e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2,
  tCell, tEgg, tFert, tEmbryo, tFoetus, tWomb, tPlacenta, tCord, tFluid, tOxygen, tPregnant, tBirth, tPremature, tAdopt, tDNA,
]);
