import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// sci.sky.sun-moon-stars.L3 · set-up cards. The same torch, child and grown-up on every card of an experiment.

// ---------------------------------------------------------------- shared things
const NIGHT = "#1d1a33", TABLE = "#3a2f58", TABLEDK = "#2a2142";
// a soft glow of light: stacked see-through discs
const glow = (c: Ctx, x: number, y: number, r: number, col = "255,236,150") => {
  for (const [k, a] of [[1, 0.1], [0.72, 0.14], [0.48, 0.2], [0.26, 0.38]]) { c.beginPath(); c.arc(x, y, r * k, 0, Math.PI * 2); c.fillStyle = `rgba(${col},${a})`; c.fill(); }
};
// a torch: back end at (x, y), pointing at angle an, length L; the lens is at the front
const torch = (c: Ctx, x: number, y: number, an: number, L: number) => {
  c.save(); c.translate(x, y); c.rotate(an); if (Math.cos(an) < 0) c.scale(1, -1);
  const t = L * 0.11, body = () => rrect(c, 0, -t, L * 0.72, t * 2, t * 0.5);
  shape(c, body, COL.teal, 6); shade(c, body, COL.tealDk, 0, -t * 0.7, 0.6);
  shape(c, () => rrect(c, L * 0.22, -t * 1.3, L * 0.12, t * 0.55, t * 0.2), COL.black, 4);
  shape(c, () => polyP(c, [[L * 0.68, -t * 1.15], [L, -t * 1.8], [L, t * 1.8], [L * 0.68, t * 1.15]]), COL.steel, 6);
  shape(c, () => ell(c, L, 0, t * 0.5, t * 1.5), "#fffbe0", 5);
  c.restore();
};
// a see-through cone of light from (x, y) along an
const beam = (c: Ctx, x: number, y: number, an: number, len: number, w0: number, w1: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.beginPath(); c.moveTo(0, -w0); c.lineTo(len, -w1); c.lineTo(len, w1); c.lineTo(0, w0); c.closePath(); c.fillStyle = "rgba(255,240,150,0.34)"; c.fill(); c.restore();
};
// where a person's wrist is (sx = -1 left arm, 1 right arm), the same sums as person()
const wrist = (x: number, y: number, h: number, sx: number, [a1, a2]: [number, number]): [number, number] => {
  const ex = x + sx * h * 0.11 + Math.cos(a1) * h * 0.17, ey = y - h * 0.74 + h * 0.03 + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
// a fist round a torch at the wrist, the torch pointing left
const grip = (c: Ctx, wx: number, wy: number, L: number, skin: string) => {
  torch(c, wx + L * 0.36, wy, Math.PI, L);
  shape(c, () => ell(c, wx, wy, 26, 30), skin, 5); shape(c, () => ell(c, wx - 14, wy - 22, 13, 9), skin, 4);
  for (const k of [-14, 0, 14]) shape(c, () => ell(c, wx - 20, wy + k + 4, 14, 8), skin, 4);
};
// the corridor, dim, running back to a far door
const corridor = (c: Ctx) => {
  c.fillStyle = "#2b2748"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => polyP(c, [[0, 0], [1080, 0], [640, 360], [440, 360]]), "#2f2a52", 0);
  shape(c, () => polyP(c, [[0, 0], [440, 360], [440, 520], [0, 1080]]), "#413a68", 0);
  shape(c, () => polyP(c, [[1080, 0], [640, 360], [640, 520], [1080, 1080]]), "#383158", 0);
  shape(c, () => polyP(c, [[0, 1080], [440, 520], [640, 520], [1080, 1080]]), "#5a5283", 0);
  shape(c, () => c.rect(440, 360, 200, 160), "#1e1a38", 0);
  shape(c, () => rrect(c, 500, 410, 80, 110, 6), "#2b2748", 0);
  for (const [x1, y1, x2, y2] of [[0, 0, 440, 360], [1080, 0, 640, 360], [0, 1080, 440, 520], [1080, 1080, 640, 520]]) line(c, [[x1, y1], [x2, y2]], 5, INK);
  c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(440, 360, 200, 160);
  for (const x of [-300, 100, 330, 540, 750, 980, 1380]) { c.globalAlpha = 0.35; line(c, [[540, 520], [x, 1080]], 3, INK); c.globalAlpha = 1; }
};
// a surprised face painted over the child's: wide eyes, high brows, round mouth
const surprised = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  c.beginPath(); ell(c, x, hy + head * 0.3, head * 0.86, head * 0.58); c.fillStyle = SKIN.child; c.fill();
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.1, head * 0.22, head * 0.26), WHITE, 3);
    shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.12, head * 0.09, head * 0.1), INK, 0);
    line(c, [[x + s * head * 0.62, hy - head * 0.22], [x + s * head * 0.38, hy - head * 0.34], [x + s * head * 0.14, hy - head * 0.24]], 4);
  }
  shape(c, () => ell(c, x, hy + head * 0.58, head * 0.17, head * 0.22), INK, 0);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.5);
};
// a flat piece of card with a foil square taped over a hole, a poked dot optional
const sparkle = (c: Ctx, x: number, y: number, r: number) => { line(c, [[x - r, y], [x + r, y]], 6, WHITE); line(c, [[x, y - r], [x, y + r]], 6, WHITE); line(c, [[x - r * 0.6, y - r * 0.6], [x + r * 0.6, y + r * 0.6]], 4, WHITE); line(c, [[x - r * 0.6, y + r * 0.6], [x + r * 0.6, y - r * 0.6]], 4, WHITE); };
const CARDBOARD = "#c9955c", CARDBOARDDK = "#a8723f";

// ---------------------------------------------------------------- experiment 1: the far torch
// setup.e1.0
const e1_0 = (c: Ctx) => {
  corridor(c);
  shadow(c, 250, 990, 120, 22); shadow(c, 860, 995, 140, 24);
  for (const [fx, fy] of [[470, 1010], [560, 1000], [650, 1010], [740, 1000]]) shape(c, () => ell(c, fx, fy, 18, 30, 1.5), "#7a72a6", 4);
  person(c, 230, 985, 620);
  const ad = { adult: true, armL: [Math.PI * 0.88, Math.PI] as [number, number] };
  person(c, 840, 985, 700, ad);
  const [wx, wy] = wrist(840, 985, 700, -1, ad.armL), L = 190, hx = wx + L * 0.36 - L;
  beam(c, hx, wy, Math.PI, 130, 30, 170);
  glow(c, hx - 6, wy, 140);
  grip(c, wx, wy, L, SKIN.adult);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  corridor(c);
  shadow(c, 540, 524, 40, 7); shadow(c, 300, 990, 130, 22);
  person(c, 540, 520, 150, { adult: true });
  glow(c, 520, 458, 46); shape(c, () => ell(c, 520, 458, 9, 9), "#fffbe0", 3);
  person(c, 300, 985, 640);
  // the clipboard in front of the child
  shape(c, () => rrect(c, 235, 540, 150, 210, 12), CARDBOARD, 6);
  shape(c, () => rrect(c, 250, 566, 120, 170, 6), WHITE, 4);
  shape(c, () => rrect(c, 280, 530, 60, 30, 8), COL.steel, 5);
  for (const y of [600, 640, 680, 715]) line(c, [[266, y], [352, y]], 4, COL.grey);
  shape(c, () => ell(c, 226, 700, 28, 24), SKIN.child, 5); shape(c, () => ell(c, 394, 690, 28, 24), SKIN.child, 5);
  line(c, [[394, 685], [352, 628]], 14, INK); line(c, [[394, 685], [352, 628]], 7, COL.yellow);
  shape(c, () => ell(c, 396, 692, 22, 20), SKIN.child, 4);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  corridor(c);
  shadow(c, 270, 990, 110, 20); shadow(c, 800, 995, 140, 24);
  person(c, 270, 985, 600, { armR: [-0.2, -0.05] });
  const ad = { adult: true, armL: [Math.PI * 0.88, Math.PI] as [number, number] };
  person(c, 800, 985, 700, ad);
  const [wx, wy] = wrist(800, 985, 700, -1, ad.armL), L = 190, hx = wx + L * 0.36 - L;
  beam(c, hx, wy, Math.PI, 90, 30, 150);
  glow(c, hx - 6, wy, 150);
  grip(c, wx, wy, L, SKIN.adult);
  surprised(c, 270, 985, 600);
};

// ---------------------------------------------------------------- experiment 2: seeing by light
// a dark table with everything standing on it; unlit things are only a dim ghost
// setup.e2.0
const e2_0 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => polyP(c, [[0, 720], [1080, 720], [1080, 1080], [0, 1080]]), TABLE, 0);
  line(c, [[0, 720], [1080, 720]], 5, "#4a4377");
  const DIMF = "#272243", DIML = "#4a4377";
  const ghost = (path: () => void) => shape(c, path, DIMF, 0);
  const edge = (path: () => void) => { c.beginPath(); path(); c.strokeStyle = DIML; c.lineWidth = 5; c.stroke(); };
  // steel plate lying flat, with its rim and thickness
  const rim = (cx: number, cy: number, rx: number, ry: number) => { ghost(() => { c.moveTo(cx - rx, cy); c.lineTo(cx - rx, cy + 16); c.ellipse(cx, cy + 16, rx, ry, 0, Math.PI, 0, true); c.lineTo(cx + rx, cy); c.closePath(); }); edge(() => { c.moveTo(cx - rx, cy); c.lineTo(cx - rx, cy + 16); c.ellipse(cx, cy + 16, rx, ry, 0, Math.PI, 0, true); c.lineTo(cx + rx, cy); }); };
  rim(140, 800, 128, 40); ghost(() => ell(c, 140, 800, 128, 40)); edge(() => ell(c, 140, 800, 128, 40)); edge(() => ell(c, 140, 802, 96, 27));
  // hand mirror standing on its handle: round glass in a frame
  ghost(() => rrect(c, 322, 700, 36, 100, 14)); edge(() => rrect(c, 322, 700, 36, 100, 14));
  ghost(() => ell(c, 340, 610, 88, 100)); edge(() => ell(c, 340, 610, 88, 100)); edge(() => ell(c, 340, 610, 68, 80));
  // white ball with its seams
  ghost(() => ell(c, 575, 720, 88, 88)); edge(() => ell(c, 575, 720, 88, 88));
  c.save(); c.beginPath(); ell(c, 575, 720, 88, 88); c.clip(); edge(() => { c.moveTo(500, 650); c.quadraticCurveTo(575, 700, 500, 790); }); edge(() => { c.moveTo(650, 650); c.quadraticCurveTo(575, 700, 650, 790); }); c.restore();
  // phone, screen glowing
  glow(c, 770, 650, 200, "180,215,255");
  shadow(c, 790, 808, 80, 14);
  shape(c, () => polyP(c, [[760, 800], [830, 800], [800, 660], [760, 660]]), "#2a2640", 5);
  shape(c, () => rrect(c, 710, 540, 130, 260, 16), "#2b2b3a", 6);
  shape(c, () => rrect(c, 722, 560, 106, 222, 8), "#e6f4ff", 4);
  shape(c, () => rrect(c, 735, 580, 80, 56, 6), "#9ccaf5", 0);
  // candle with flame
  glow(c, 950, 570, 230);
  shadow(c, 960, 806, 90, 16);
  shape(c, () => ell(c, 950, 800, 74, 20), COL.steel, 5);
  shape(c, () => rrect(c, 920, 630, 60, 170, 8), "#fff2d2", 6); shade(c, () => rrect(c, 920, 630, 60, 170, 8), "#e3c78f", 12, 0, 0.6);
  line(c, [[950, 630], [950, 610]], 5);
  shape(c, () => { c.moveTo(950, 520); c.bezierCurveTo(985, 565, 985, 610, 950, 612); c.bezierCurveTo(915, 610, 915, 565, 950, 520); c.closePath(); }, COL.orange, 5);
  shape(c, () => { c.moveTo(950, 560); c.bezierCurveTo(968, 585, 966, 604, 950, 606); c.bezierCurveTo(934, 604, 932, 585, 950, 560); c.closePath(); }, COL.yellow, 0);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => polyP(c, [[0, 640], [1080, 640], [1080, 1080], [0, 1080]]), TABLE, 0);
  // the torch in a hand, beam down on a steel plate
  const an = 1.14, s = 1.6, L = 330, ox = 343, oy = 170, hx = ox + Math.cos(an) * L, hy = oy + Math.sin(an) * L;
  const wx = ox + Math.cos(an) * (110 - 70 * s), wy = oy + Math.sin(an) * (110 - 70 * s);
  shadow(c, 640, 880, 360, 70);
  shape(c, () => ell(c, 640, 830, 340, 135), COL.steel); shape(c, () => ell(c, 640, 822, 285, 105), COL.steelIn, 4);
  c.save(); c.beginPath(); ell(c, 640, 822, 285, 105); c.clip(); c.fillStyle = "rgba(255,248,200,0.85)"; c.beginPath(); ell(c, 560, 800, 190, 70); c.fill(); c.restore();
  shape(c, () => ell(c, 640, 830, 340, 135), "rgba(0,0,0,0)", 6);
  beam(c, hx, hy, an, 390, 14, 215);
  sparkle(c, 480, 770, 38); sparkle(c, 760, 870, 28); sparkle(c, 640, 740, 22);
  glow(c, hx + 6, hy + 4, 120);
  torch(c, ox, oy, an, L);
  hand(c, wx, wy, an, s, SKIN.adult, CLOTH.adult);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  c.fillStyle = NIGHT; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => polyP(c, [[0, 900], [1080, 900], [1080, 1080], [0, 1080]]), TABLE, 0);
  const arm: [number, number] = [0.15, 0.1];
  shadow(c, 250, 1005, 130, 22);
  // the side table with the torch
  shape(c, () => rrect(c, 850, 545, 215, 36, 8), COL.wood, 6);
  line(c, [[885, 581], [885, 1000]], 16, INK); line(c, [[885, 581], [885, 1000]], 8, COL.woodDk);
  line(c, [[1030, 581], [1030, 1000]], 16, INK); line(c, [[1030, 581], [1030, 1000]], 8, COL.woodDk);
  person(c, 250, 1000, 700, { armR: arm });
  const [wx, wy] = wrist(250, 1000, 700, 1, arm), bx = wx + 82, by = wy - 12, r = 100;
  // the ball: the side facing the torch is lit, the other side dark
  const bp = () => ell(c, bx, by, r, r);
  shape(c, bp, WHITE, 6);
  c.save(); c.beginPath(); bp(); c.clip(); c.beginPath(); c.rect(bx - r - 5, by - r - 5, r + 5, r * 2 + 10); ell(c, bx, by, r * 0.42, r); c.fillStyle = "#3a3866"; c.fill("nonzero"); c.restore();
  shape(c, bp, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, wx + 8, wy, 26, 30), SKIN.child, 5); shape(c, () => ell(c, wx + 30, wy - 14, 14, 10), SKIN.child, 4);
  glow(c, 860, 523, 170);
  beam(c, 860, 523, Math.PI, 125, 20, 110);
  torch(c, 1040, 523, Math.PI, 190);
  // turn slowly: an arrow round the child's feet
  const pts: number[][] = []; for (let a = 0.08; a <= 0.92; a += 0.06) pts.push([250 + Math.cos(Math.PI * a) * 235 * -1, 975 + Math.sin(Math.PI * a) * 70]);
  arrow(c, pts);
};

// ---------------------------------------------------------------- experiment 3: the pinhole
const foilSquare = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 10), COL.steel, 5);
  shade(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 10), COL.steelDk, -s * 0.06, -s * 0.06, 0.5);
  line(c, [[x - s * 0.3, y - s * 0.2], [x - s * 0.05, y - s * 0.32], [x + s * 0.25, y - s * 0.18]], 3, COL.steelDk);
  line(c, [[x - s * 0.28, y + s * 0.25], [x, y + s * 0.15], [x + s * 0.3, y + s * 0.3]], 3, COL.steelDk);
  for (const [dx, dy] of [[-1, -1], [1, 1]]) { c.save(); c.translate(x + dx * s * 0.5, y + dy * s * 0.5); c.rotate(dx * 0.8); shape(c, () => rrect(c, -50, -17, 100, 34, 4), "rgba(255,226,120,0.8)", 4); c.restore(); }
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 830, 400, 60);
  shape(c, () => rrect(c, 150, 230, 740, 570, 14), CARDBOARD, 7); shade(c, () => rrect(c, 150, 230, 740, 570, 14), CARDBOARDDK, 24, 24, 0.5);
  c.beginPath(); ell(c, 520, 515, 98, 98); c.setLineDash([14, 12]); c.strokeStyle = CARDBOARDDK; c.lineWidth = 5; c.stroke(); c.setLineDash([]);
  foilSquare(c, 520, 515, 270);
  shape(c, () => ell(c, 520, 515, 5, 5), INK, 0);
  // the pin, held by the grown-up's hand, tip on the foil
  const dx = Math.cos(2.35), dy = Math.sin(2.35), s = 1.3, wx = 520 + 150 * -dx + 0, wy = 515 - 150 * dy;
  const px = 520 - dx * 220, py = 515 - dy * 220;
  line(c, [[520, 515], [px, py]], 15, INK); line(c, [[520, 515], [px, py]], 8, COL.steel);
  hand(c, wx + 70 * s * -dx * 0 + (wx - 520) * 0, wy, 2.35, s, SKIN.adult, CLOTH.adult);
  hand(c, 100, 760, -0.3, 1.2, SKIN.child, CLOTH.child, true);
  arrow(c, [[560, 330], [500, 420]]);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => c.rect(-10, 660, 1100, 460), "#e3c88f", 0); line(c, [[0, 660], [1080, 660]], 5);
  const Sx = 130, Sy = 40, Hx = 565, Hy = 445, Px = 885, Py = 745;
  sun(c, Sx, Sy, 52);
  shadow(c, 300, 990, 110, 20);
  // the child seen from behind: back to the Sun, looking down at the paper
  const cx = 240, ch = 640, head = ch * 0.13, hy = 980 - ch * 0.74 - head * 1.05;
  person(c, cx, 980, ch, { armR: [-0.35, 0.25] });
  shape(c, () => ell(c, cx, hy, head * 1.04, head * 1.08), CLOTH.hair, 5);
  // the paper on the ground, the card's shadow on it, a bright round spot in the shadow
  shadow(c, 890, 830, 200, 24);
  shape(c, () => polyP(c, [[740, 690], [1040, 690], [1070, 820], [710, 820]]), WHITE, 6);
  shape(c, () => polyP(c, [[790, 708], [980, 708], [995, 800], [780, 800]]), "#8f8aa8", 0);
  shape(c, () => ell(c, Px, Py, 30, 24), "#fffbe0", 4);
  line(c, [[Sx + 40, Sy + 40], [Hx - 8, Hy - 10]], 7, COL.yellow); line(c, [[Hx + 8, Hy + 10], [Px - 8, Py - 12]], 7, COL.yellow);
  // the card, held up in a hand, with a foil dot
  shape(c, () => rrect(c, 500, 350, 130, 190, 8), CARDBOARD, 6); shade(c, () => rrect(c, 500, 350, 130, 190, 8), CARDBOARDDK, 12, 12, 0.5);
  shape(c, () => ell(c, Hx, Hy, 34, 34), COL.steel, 4); shape(c, () => ell(c, Hx, Hy, 4, 4), "#fffbe0", 0);
  hand(c, 516, 560, -1.45, 0.9, SKIN.child, CLOTH.child);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, "#e3c88f");
  const Sx = 360, Sy = 70, Hx = 405, Hy = 235, Px = 520, Py = 700, R = 70;
  // paper on the ground with the big shadow and the big spot
  shadow(c, 540, 990, 440, 26);
  shape(c, () => rrect(c, 150, 580, 780, 390, 8), WHITE, 6);
  shape(c, () => polyP(c, [[340, 600], [720, 600], [740, 855], [320, 855]]), "#8f8aa8", 0);
  c.save(); c.beginPath(); c.moveTo(Hx - 6, Hy + 6); c.lineTo(Px - R, Py); c.lineTo(Px + R, Py); c.lineTo(Hx + 6, Hy + 6); c.closePath(); c.fillStyle = "rgba(255,226,120,0.4)"; c.fill(); c.restore();
  shape(c, () => ell(c, Px, Py, R, R * 0.95), "#fffbe0", 4);
  // the ruler under the spot: 0 at its left edge, the spot reaches 2
  shape(c, () => rrect(c, Px - R - 14, 790, 400, 70, 4), COL.wood, 6);
  for (let i = 0; i <= 5; i++) { const x = Px - R + i * R; line(c, [[x, 790], [x, 824]], 4); if (i < 5) write(c, String(i), x + 6, 830, 24, INK, 4); }
  line(c, [[Px - R, Py + 40], [Px - R, 790]], 4, INK); line(c, [[Px + R, Py + 40], [Px + R, 790]], 4, INK);
  write(c, "2 cm", Px + R + 40, Py - 30, 52, INK, 7);
  // the card held up high by the grown-up, light through its foil dot, and an arrow for moving it up
  sun(c, Sx, Sy, 48);
  shape(c, () => rrect(c, 290, 150, 230, 160, 8), CARDBOARD, 6); shade(c, () => rrect(c, 290, 150, 230, 160, 8), CARDBOARDDK, 12, 12, 0.5);
  shape(c, () => ell(c, Hx, Hy, 26, 26), COL.steel, 4); shape(c, () => ell(c, Hx, Hy, 4, 4), "#fffbe0", 0);
  line(c, [[Sx + 4, Sy + 52], [Hx - 4, Hy - 28]], 7, COL.yellow);
  hand(c, 598, 230, Math.PI, 1.3, SKIN.adult, CLOTH.adult);
  arrow(c, [[860, 330], [860, 160]]);
  hand(c, 330, 825, 0, 1.2, SKIN.child, CLOTH.child, true);
};

export const su_skySunMoonStars = cards("sci.sky.sun-moon-stars.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
