import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, cards } from "./flatKit";

// GALAXIES L3 set-up cards: the pinhole galaxy (e1) and the rice galaxy (e2).
const PAPER = "#fbf8ef", DOT = "#3a3540", NIGHT = "#1d2142", NIGHT_T = "#2c3260";

// a wooden ruler lying flat, left end at (x, y), length w, ticks only
const ruler = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => rrect(c, x, y, w, 80, 8), COL.wood, 6);
  shade(c, () => rrect(c, x, y, w, 80, 8), COL.woodDk, 0, 14, 0.5);
  for (let i = 0; i * 20 <= w - 40; i++) line(c, [[x + 20 + i * 20, y], [x + 20 + i * 20, y + (i % 5 === 0 ? 44 : 26)]], i % 5 === 0 ? 5 : 3);
};
// the three pairs of dots and the bunch, as drawn on the postcard (centre of card at cx)
const PAIRS: [number, number][] = [[250, 150], [540, 90], [830, 44]];
const pairDots = (c: Ctx, ox: number, oy: number, k: number, lit = false) => {
  const dot = (x: number, y: number, r: number) => {
    if (lit) { c.beginPath(); ell(c, x, y, r * 4, r * 4); c.fillStyle = "rgba(255,226,120,0.35)"; c.fill(); }
    shape(c, () => ell(c, x, y, r, r), lit ? "#fff3b0" : DOT, lit ? 2 : 0);
  };
  PAIRS.forEach(([cx, gap]) => { dot(ox + (cx - gap / 2) * k, oy, 13 * k); dot(ox + (cx + gap / 2) * k, oy, 13 * k); });
};
const bunchDots = (c: Ctx, x: number, y: number, R: number, r: number, lit = false) => {
  const rd = rnd(5);
  for (let i = 0; i < 16; i++) { const a = rd() * 6.283, d = Math.sqrt(rd()) * (R - r * 2.2); if (lit) { c.beginPath(); ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 3, r * 3); c.fillStyle = "rgba(255,226,120,0.35)"; c.fill(); } shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r, r), lit ? "#fff3b0" : DOT, lit ? 2 : 0); }
};

// setup.e1.0
const gal1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 440, 40);
  shape(c, () => rrect(c, 90, 150, 880, 800, 14), PAPER, 6);
  shade(c, () => rrect(c, 90, 150, 880, 800, 14), COL.cloth, 14, 14, 0.8);
  shape(c, () => rrect(c, 90, 150, 880, 800, 14), PAPER, 6);
  ruler(c, 110, 190, 840);
  pairDots(c, 0, 410, 1);
  // little ticks from the ruler down to each pair
  PAIRS.forEach(([cx, gap]) => { line(c, [[cx - gap / 2, 300], [cx - gap / 2, 385]], 3, COL.grey); line(c, [[cx + gap / 2, 300], [cx + gap / 2, 385]], 3, COL.grey); });
  c.beginPath(); ell(c, 540, 720, 150, 150); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  bunchDots(c, 540, 720, 150, 12);
};

// setup.e1.1
const gal2 = (c: Ctx) => {
  ground(c);
  // the eraser under the card
  shadow(c, 560, 940, 330, 30);
  shape(c, () => rrect(c, 260, 690, 560, 250, 22), WHITE, 6);
  shape(c, () => rrect(c, 260, 690, 250, 250, 22), COL.blue, 6);
  shade(c, () => rrect(c, 260, 690, 560, 250, 22), COL.steelDk, 0, 70, 0.4);
  // the card, lying on it
  const card = () => polyP(c, [[110, 450], [880, 430], [960, 800], [60, 820]]);
  shadow(c, 540, 830, 450, 30);
  shape(c, card, PAPER, 6);
  shade(c, card, COL.cloth, 14, 14, 0.8);
  [[200, 560], [330, 570], [440, 480]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 11, 10), DOT, 0));
  // the new hole
  shape(c, () => ell(c, 563, 512, 20, 16), INK, 0);
  // the needle and the hand
  line(c, [[860, 275], [563, 512]], 16, INK);
  line(c, [[860, 275], [563, 512]], 8, COL.steel);
  hand(c, 880, 250, 2.45, 1.6, SKIN.adult, CLOTH.adult);
  arrow(c, [[790, 470], [690, 520], [640, 570]]);
};

// setup.e1.2
const gal3 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D);
  c.fillStyle = NIGHT_T; c.fillRect(0, 720, D, 360);
  line(c, [[0, 720], [D, 720]], 6);
  // the books behind the card
  const book = (x: number, y: number, w: number, col: string, dk: string) => { shape(c, () => rrect(c, x, y, w, 70, 10), col, 6); shade(c, () => rrect(c, x, y, w, 70, 10), dk, 0, 22, 0.6); line(c, [[x + 20, y + 35], [x + w - 20, y + 35]], 4, WHITE); };
  book(60, 650, 400, COL.orange, COL.red); book(90, 580, 360, COL.teal, COL.tealDk); book(70, 510, 340, COL.purple, COL.blueDk);
  // light from the torch, behind the card
  const g = c.createRadialGradient(560, 430, 80, 560, 430, 520);
  g.addColorStop(0, "rgba(255,226,120,0.6)"); g.addColorStop(1, "rgba(255,226,120,0)");
  c.fillStyle = g; c.fillRect(0, 0, D, D);
  const torch = () => rrect(c, 820, 590, 230, 90, 18);
  shape(c, torch, COL.red, 6); shade(c, torch, "#b03a28", 0, 28, 0.6);
  shape(c, () => polyP(c, [[800, 585], [850, 585], [850, 685], [800, 685]]), COL.yellow, 6);
  line(c, [[910, 635], [990, 635]], 8, WHITE);
  // the card, standing, lit from behind
  shadow(c, 560, 735, 290, 24);
  shape(c, () => rrect(c, 300, 190, 520, 540, 12), "#3d4478", 6);
  c.save(); c.beginPath(); rrect(c, 300, 190, 520, 540, 12); c.strokeStyle = COL.yellow; c.lineWidth = 6; c.stroke(); c.restore();
  pairDots(c, 230, 330, 0.6, true);
  bunchDots(c, 560, 560, 120, 10, true);
};

// setup.e1.3
const gal4 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, D, D);
  c.fillStyle = NIGHT_T; c.fillRect(0, 800, D, 280);
  line(c, [[0, 800], [D, 800]], 6);
  // the table with the card and its lights
  shape(c, () => rrect(c, 680, 650, 360, 36, 8), COL.brown, 6);
  shape(c, () => rrect(c, 710, 686, 36, 114, 6), COL.brown, 6); shape(c, () => rrect(c, 970, 686, 36, 114, 6), COL.brown, 6);
  shape(c, () => rrect(c, 750, 440, 240, 210, 8), "#3d4478", 5);
  [[820, 24], [900, 24], [960, 8]].forEach(([x, gap]) => { c.beginPath(); ell(c, x, 520, 40, 40); c.fillStyle = "rgba(255,226,120,0.35)"; c.fill(); shape(c, () => ell(c, x - gap / 2, 520, 6, 6), "#fff3b0", 0); shape(c, () => ell(c, x + gap / 2, 520, 6, 6), "#fff3b0", 0); });
  bunchDots(c, 870, 590, 50, 4, true);
  // the sight line from the lights to the child's eyes
  c.setLineDash([16, 16]); line(c, [[740, 520], [330, 400]], 5, "rgba(255,226,120,0.8)"); c.setLineDash([]);
  // the child, looking at the lights, and the steps back
  [[300, 880], [200, 905]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 34, 14), "rgba(255,255,255,0.18)", 3));
  person(c, 400, 860, 620, { armR: [-0.35, -0.2], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  arrow(c, [[300, 960], [120, 960]]);
};

// the newspaper with the big pencil circle; centre (540, 500), radius 300
const CX = 540, CY = 500, CR = 300;
const newspaper = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1020, 450, 30);
  shape(c, () => rrect(c, 50, 50, 960, 960, 10), "#ecebe4", 6);
  for (let y = 90; y < 990; y += 26) { line(c, [[80, y], [980, y]], 5, "rgba(120,115,110,0.28)"); }
  shape(c, () => rrect(c, 80, 66, 900, 16, 4), "#c9c5bb", 0);
};
const circleLine = (c: Ctx) => { c.beginPath(); ell(c, CX, CY, CR, CR); c.strokeStyle = "#4a4650"; c.lineWidth = 12; c.stroke(); c.beginPath(); ell(c, CX, CY, CR, CR); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); };
const GRAINS = (() => { const r = rnd(21), g: number[][] = []; for (let y = -CR; y < CR; y += 21) for (let x = -CR; x < CR; x += 21) { const gx = x + (r() - 0.5) * 12, gy = y + (r() - 0.5) * 12; if (Math.hypot(gx, gy) < CR - 14) g.push([CX + gx, CY + gy, r() * 3.14]); } return g; })();
const grain = (c: Ctx, x: number, y: number, rot: number) => { shape(c, () => ell(c, x, y, 8, 4.8, rot), "#fffaf0", 2.5); c.beginPath(); ell(c, x + 2, y + 1.5, 5, 2.4, rot); c.fillStyle = "rgba(160,140,110,0.4)"; c.fill(); };
const rice = (c: Ctx) => GRAINS.forEach(([x, y, r]) => { if (Math.hypot(x - SUN[0], y - SUN[1]) > 48) grain(c, x, y, r); });
const SUN = [CX + CR / 2, CY];
const paperSun = (c: Ctx) => {
  const [x, y] = SUN;
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; shape(c, () => polyP(c, [[x + Math.cos(a - 0.2) * 34, y + Math.sin(a - 0.2) * 34], [x + Math.cos(a) * 54, y + Math.sin(a) * 54], [x + Math.cos(a + 0.2) * 34, y + Math.sin(a + 0.2) * 34]]), COL.orange, 4); }
  shape(c, () => ell(c, x, y, 36, 36), COL.yellow, 5);
};
const thread = (c: Ctx, pts: number[][]) => { line(c, pts, 14, INK); line(c, pts, 7, COL.pink); };
// zoom in on the paper Sun: scale k about the Sun, which is then placed at (sx, sy)
const zoom = (c: Ctx, k: number, sx: number, sy: number, draw: () => void) => { c.save(); c.translate(sx, sy); c.scale(k, k); c.translate(-SUN[0], -SUN[1]); draw(); c.restore(); };

// setup.e2.0
const rice1 = (c: Ctx) => {
  newspaper(c); circleLine(c);
  // the pencil on the circle, thread tied to it, a finger at the middle
  thread(c, [[CX, CY], [CX + CR - 10, CY - 10]]);
  const T = [CX + CR, CY], u = [0.5, -0.87], n = [0.87, 0.5], P = (t: number, w: number) => [T[0] + u[0] * t + n[0] * w, T[1] + u[1] * t + n[1] * w];
  shadow(c, T[0] + 90, T[1] + 30, 80, 14);
  shape(c, () => polyP(c, [P(0, 0), P(70, -24), P(70, 24)]), "#f0cf9a", 5);
  shape(c, () => polyP(c, [P(0, 0), P(14, -5), P(14, 5)]), INK, 3);
  shape(c, () => polyP(c, [P(70, -24), P(330, -24), P(330, 24), P(70, 24)]), COL.yellow, 5);
  shade(c, () => polyP(c, [P(70, -24), P(330, -24), P(330, 24), P(70, 24)]), COL.orange, 14, 6, 0.6);
  shape(c, () => polyP(c, [P(330, -24), P(375, -24), P(375, 24), P(330, 24)]), COL.pink, 5);
  hand(c, CX, CY + 165, -Math.PI / 2, 1.7, SKIN.child, CLOTH.child, true);
  arrow(c, [[CX + CR + 70, CY + 40], [CX + CR + 60, CY + 130], [CX + CR + 20, CY + 210]]);
};

// setup.e2.1
const rice2 = (c: Ctx) => {
  newspaper(c); circleLine(c); rice(c);
  shape(c, () => ell(c, CX, CY, 9, 9), INK, 0);
  paperSun(c);
  // a katori of rice at the corner
  shadow(c, 880, 960, 90, 14);
  shape(c, () => { c.moveTo(800, 880); c.bezierCurveTo(810, 980, 950, 980, 960, 880); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(800, 880); c.bezierCurveTo(810, 980, 950, 980, 960, 880); c.closePath(); }, COL.steelDk, 30, 0);
  shape(c, () => ell(c, 880, 880, 80, 20), "#fffaf0", 5);
};

// setup.e2.2
const rice3 = (c: Ctx) => {
  ground(c);
  zoom(c, 2.2, 240, 520, () => { newspaper(c); circleLine(c); rice(c); shape(c, () => ell(c, CX, CY, 9, 9), INK, 0); });
  // the long thread from the Sun to the edge, with the Sun at its end
  zoom(c, 2.2, 240, 520, () => { thread(c, [SUN, [CX + CR, CY]]); paperSun(c); });
  hand(c, 560, 830, -2.45, 1.7, SKIN.child, CLOTH.child, true);
};

// setup.e2.3
const rice4 = (c: Ctx) => {
  ground(c);
  zoom(c, 2.2, 470, 780, () => { newspaper(c); circleLine(c); rice(c); shape(c, () => ell(c, CX, CY, 9, 9), INK, 0); });
  zoom(c, 2.2, 470, 780, () => { thread(c, [SUN, [SUN[0], SUN[1] - 70]]); paperSun(c); });
  // a child's hand held up beside the thread: the thread is as long as a hand
  hand(c, 740, 800, -Math.PI / 2, 1.2, SKIN.child, CLOTH.child, true);
};

export const su_storyOfUniverseGalaxies = cards("sci.story-of-universe.galaxies.L3 set-up", [gal1, gal2, gal3, gal4, rice1, rice2, rice3, rice4]);
