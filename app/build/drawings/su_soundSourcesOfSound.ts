import type { Ctx } from "./core";
import { D, INK, BG, COL, SKIN, CLOTH, RED, WHITE, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards, bowl } from "./flatKit";

// SOUND SOURCES OF SOUND (L3) · set-up cards: ruler twang, foil ball on a plate, balloon drum.
const PINK = "#f29ab4", PINKDK = "#d4708f", PINKLT = "#f9c3d3", DOUGH = "#ead2a8", DOUGHDK = "#c9a574";

// a child's forearm coming in from off the card, then the hand (wrist at x, y, pointing an)
const hnd = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => {
  const dx = Math.cos(an), dy = Math.sin(an), a = [x - dx * 50 * s, y - dy * 50 * s], b = [x - dx * 1100, y - dy * 1100];
  line(c, [a, b], 72 * s + 12, INK); line(c, [a, b], 72 * s, CLOTH.child);
  hand(c, x, y, an, s, SKIN.child, CLOTH.child, open);
};
const mir = (c: Ctx, f: () => void) => { c.save(); c.translate(D, 0); c.scale(-1, 1); f(); c.restore(); };

// ---- experiment 1: the ruler on the table edge
const tableSide = (c: Ctx, edgeX: number) => {
  shadow(c, edgeX - 80, 985, 120, 18);
  shape(c, () => rrect(c, edgeX - 150, 700, 70, 285, 6), COL.brown);
  shape(c, () => polyP(c, [[-20, 620], [edgeX, 620], [edgeX, 700], [-20, 700]]), COL.brown);
  shade(c, () => polyP(c, [[-20, 620], [edgeX, 620], [edgeX, 700], [-20, 700]]), COL.soilDk, -6, -26, 0.45);
};
// a wooden ruler lying on the table (top at y 580..620) with its end sticking out past edgeX; bend = how far the tip is pushed down
const ruler = (c: Ctx, edgeX: number, L0: number, len: number, bend: number, alpha = 1) => {
  const P: { x: number; y: number; nx: number; ny: number; xl: number }[] = [];
  for (let x = -L0; x <= len; x += 15) { const t = Math.max(0, x) / len, an = Math.atan(x > 0 ? (2 * bend * t) / len : 0); P.push({ x: edgeX + x, y: 592 + bend * t * t, nx: -Math.sin(an), ny: Math.cos(an), xl: x }); }
  c.globalAlpha = alpha;
  const top = P.map((p) => [p.x - p.nx * 28, p.y - p.ny * 28]), bot = P.map((p) => [p.x + p.nx * 28, p.y + p.ny * 28]);
  shape(c, () => polyP(c, [...top, ...[...bot].reverse()]), COL.yellow, 6);
  line(c, bot.map((q) => [q[0] - 0, q[1] - 7]), 8, COL.woodDk);
  P.forEach((p, i) => { if (p.xl % 30 === 0) { const l = p.xl % 60 === 0 ? 30 : 17; line(c, [top[i], [top[i][0] + p.nx * l, top[i][1] + p.ny * l]], 3.5, INK); } });
  c.globalAlpha = 1;
};
const bracket = (c: Ctx, x0: number, x1: number, y: number, label: string) => {
  line(c, [[x0, y - 18], [x0, y + 18]], 6); line(c, [[x1, y - 18], [x1, y + 18]], 6); line(c, [[x0, y], [x1, y]], 6);
  write(c, label, (x0 + x1) / 2 - label.length * 24, y + 36, 64, INK, 8);
};
const rulerScene = (c: Ctx, edgeX: number, L0: number, len: number) => { ground(c); tableSide(c, edgeX); void L0; void len; };

// setup.e1.0
const e1_0 = (c: Ctx) => {
  rulerScene(c, 520, 390, 300);
  ruler(c, 520, 390, 300, 0);
  hnd(c, 250, 368, Math.PI / 2, 2, true);
  bracket(c, 520, 820, 790, "5 cm");
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  rulerScene(c, 520, 390, 300);
  ruler(c, 520, 390, 300, -50, 0.3); ruler(c, 520, 390, 300, 30, 0.3); ruler(c, 520, 390, 300, 90, 0.9);
  hnd(c, 250, 368, Math.PI / 2, 2, true);
  hnd(c, 862, 440, 2.0, 1.5, true);
  arrow(c, [[935, 560], [935, 700]]);
  bracket(c, 520, 820, 880, "5 cm");
};
// setup.e1.2: the longer overhang, with the old 5 cm length marked above it so the two can be compared
const e1_2 = (c: Ctx) => {
  rulerScene(c, 300, 240, 600);
  ruler(c, 300, 240, 600, -85, 0.3); ruler(c, 300, 240, 600, 85, 0.3); ruler(c, 300, 240, 600, 0, 1);
  hnd(c, 160, 368, Math.PI / 2, 2, true);
  arrow(c, [[985, 600], [985, 480]]); arrow(c, [[985, 640], [985, 760]]);
  for (let y = 410; y < 540; y += 36) line(c, [[600, y], [600, y + 18]], 6, COL.greyDk);
  bracket(c, 300, 600, 380, "5 cm");
  bracket(c, 300, 900, 860, "10 cm");
};

// ---- experiment 2: foil ball and plate, bowl of water
const foil = (c: Ctx, x: number, y: number, r = 34) => {
  shape(c, () => polyP(c, Array.from({ length: 9 }, (_, i) => [x + Math.cos(i * 0.7854 * 8 / 9 * 1.125) * r * (i % 2 ? 0.88 : 1), y + Math.sin(i * 0.7854 * 8 / 9 * 1.125) * r * (i % 2 ? 0.88 : 1)])), "#e6ebf2", 5);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.5, -r * 0.5, 0.6);
  line(c, [[x - r * 0.5, y - r * 0.1], [x, y + r * 0.3], [x + r * 0.45, y - r * 0.4]], 3, COL.steelDk);
  shine(c, [[x - r * 0.55, y - r * 0.35], [x - r * 0.2, y - r * 0.65]], 6);
};
const beam = (c: Ctx) => { // table edge at the top and the thread's tie point
  shape(c, () => polyP(c, [[-20, 90], [470, 90], [470, 170], [-20, 170]]), COL.brown);
  shade(c, () => polyP(c, [[-20, 90], [470, 90], [470, 170], [-20, 170]]), COL.soilDk, -6, -24, 0.45);
};
const upPlate = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 30, y + r + 20, r * 0.8, 24);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.18, -r * 0.18, 0.55);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), COL.steelIn, 4);
  shine(c, [[x - r * 0.55, y - r * 0.35], [x - r * 0.35, y - r * 0.6]], 12);
};
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const dx = Math.cos(an), dy = Math.sin(an);
  line(c, [[x, y], [x + dx * len, y + dy * len]], 32, INK); line(c, [[x, y], [x + dx * len, y + dy * len]], 20, COL.steel);
  shape(c, () => ell(c, x, y, 54, 36, an), COL.steel, 6);
  shape(c, () => ell(c, x, y, 38, 24, an), COL.steelIn, 3);
};
const buzz = (c: Ctx, x: number, y: number, r: number) => {
  for (const [a0, a1] of [[-0.55, 0.55], [Math.PI - 0.55, Math.PI + 0.55]]) for (const d of [34, 66]) { c.beginPath(); c.arc(x, y, r + d, a0, a1); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); beam(c);
  line(c, [[291, 170], [291, 530]], 4);
  upPlate(c, 560, 570, 235);
  foil(c, 291, 570, 40);
  hnd(c, 560, 903, -Math.PI / 2, 1.7);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); beam(c);
  line(c, [[291, 170], [102, 490]], 4);
  upPlate(c, 560, 570, 235);
  foil(c, 102, 522, 40);
  arrow(c, [[200, 640], [120, 590]], RED, 10);
  buzz(c, 560, 570, 235);
  spoon(c, 835, 535, -1.1, 300);
  hnd(c, 560, 903, -Math.PI / 2, 1.7);
  hnd(c, 991, 359, 2.7, 1.4);
};
// setup.e2.2
const torch = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -150, -38, 170, 76, 16), COL.blue, 6);
  shape(c, () => polyP(c, [[20, -38], [86, -66], [86, 66], [20, 38]]), COL.steel, 6);
  shape(c, () => ell(c, 86, 0, 14, 62), COL.yellow, 5);
  shape(c, () => rrect(c, -90, -14, 40, 28, 10), COL.red, 4);
  c.restore();
};
const e2_2 = (c: Ctx) => {
  ground(c);
  bowl(c, 480, 620, 340);
  shape(c, () => ell(c, 480, 635, 286, 48), COL.water, 4);
  shade(c, () => ell(c, 480, 635, 286, 48), COL.waterDk, -40, -14, 0.5);
  // the torch beam lands on the water and lights it up
  c.globalAlpha = 0.35; shape(c, () => polyP(c, [[250, 224], [150, 296], [230, 660], [420, 625]]), COL.yellow, 0); c.globalAlpha = 1;
  c.globalAlpha = 0.55; shape(c, () => ell(c, 330, 640, 120, 26), COL.yellow, 0); c.globalAlpha = 1;
  c.strokeStyle = WHITE; c.lineWidth = 6; c.lineCap = "round"; c.globalAlpha = 0.9;
  for (const d of [12, 34, 56]) for (const [a0, a1] of [[-0.5, 0.5], [Math.PI - 0.5, Math.PI + 0.5]]) { c.beginPath(); c.ellipse(480, 635, 286 - d, 48 - d * 0.17, 0, a0, a1); c.stroke(); }
  c.globalAlpha = 1;
  for (const [x, y] of [[270, 628], [330, 650], [400, 632]]) { line(c, [[x - 14, y], [x + 14, y]], 5, WHITE); line(c, [[x, y - 14], [x, y + 14]], 5, WHITE); }
  torch(c, 150, 190, 0.95);
  hnd(c, 51, 52, 0.95, 1.5);
  spoon(c, 845, 575, -1.1, 300);
  hnd(c, 1000, 392, 2.7, 1.4);
};

// ---- experiment 3: balloon drum on a steel tumbler
const drum = (c: Ctx, cx = 540) => {
  shadow(c, cx + 40, 905, 200, 30);
  const body = () => { c.moveTo(cx - 170, 540); c.lineTo(cx + 170, 540); c.lineTo(cx + 140, 880); c.bezierCurveTo(cx + 140, 920, cx - 140, 920, cx - 140, 880); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -50, 0, 0.55);
  shine(c, [[cx - 115, 660], [cx - 100, 840]], 12);
  const skirt = () => { c.moveTo(cx - 182, 540); c.bezierCurveTo(cx - 192, 580, cx - 176, 610, cx - 172, 650); c.lineTo(cx + 172, 650); c.bezierCurveTo(cx + 176, 610, cx + 192, 580, cx + 182, 540); c.closePath(); };
  shape(c, skirt, PINK); shade(c, skirt, PINKDK, -60, 0, 0.5);
  shape(c, () => ell(c, cx, 540, 182, 54), PINKLT, 6);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.1 + i * 0.1) + 0.0; line(c, [[cx + Math.cos(a + Math.PI) * 168, 540 + Math.sin(a + Math.PI) * 46], [cx + Math.cos(a + Math.PI) * 130, 540 + Math.sin(a + Math.PI) * 34]], 3, PINKDK); }
  c.beginPath(); c.ellipse(cx, 604, 178, 40, 0, 0.05, Math.PI - 0.05); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke();
  c.strokeStyle = COL.yellow; c.lineWidth = 14; c.stroke();
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const flap = (s: number) => { shape(c, () => polyP(c, [[540 + s * 172, 610], [540 + s * 172, 660], [540 + s * 300, 740], [540 + s * 320, 670]]), PINK); };
  flap(-1); flap(1);
  drum(c);
  hnd(c, 176, 656, 0.35, 1.4);
  mir(c, () => hnd(c, 176, 656, 0.35, 1.4));
  arrow(c, [[330, 800], [190, 840]]); arrow(c, [[750, 800], [890, 840]]);
};
const grain = (c: Ctx, x: number, y: number, rot: number) => { shape(c, () => ell(c, x, y, 26, 11, rot), "#fffdf5", 4); line(c, [[x - Math.cos(rot) * 12, y - Math.sin(rot) * 12 - 2], [x + Math.cos(rot) * 12, y + Math.sin(rot) * 12 - 2]], 2, "#e4dccb"); };
const tapHand = (c: Ctx) => hnd(c, 777, 429, 2.2, 1.5, true);
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c); drum(c);
  [[470, 540, 0.3], [540, 556, -0.2], [610, 535, 0.5], [500, 520, 1.2], [575, 520, 0.1]].forEach(([x, y, r]) => grain(c, x, y, r));
  [[420, 400, 0.6], [500, 330, 1.4], [580, 410, -0.5], [650, 330, 0.9], [540, 250, 0.2], [450, 270, -0.9]].forEach(([x, y, r]) => { grain(c, x, y, r); line(c, [[x - 8, y + 24], [x - 8, y + 48]], 4); line(c, [[x + 8, y + 30], [x + 8, y + 54]], 4); });
  tapHand(c);
};
// a hand with one finger out, tapping the skin (fingertip lands at tipX, tipY)
const pointHand = (c: Ctx, tipX: number, tipY: number) => {
  const an = 2.2, s = 1.5, dx = Math.cos(an), dy = Math.sin(an), reach = 150 * s;
  const wx = tipX - dx * reach + dy * 4.5 * s, wy = tipY - dy * reach - dx * 4.5 * s;
  hnd(c, wx, wy, an, s);
  c.save(); c.translate(wx, wy); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, 30, -20, 120, 26, 13), SKIN.child, 5);
  c.restore();
  for (const [x0, y0, x1, y1] of [[636, 556, 614, 566], [660, 574, 656, 596], [690, 566, 704, 586]]) line(c, [[x0, y0], [x1, y1]], 7);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c); drum(c);
  const blob = () => { c.moveTo(455, 560); c.bezierCurveTo(430, 500, 470, 455, 530, 455); c.bezierCurveTo(600, 452, 645, 500, 625, 560); c.bezierCurveTo(590, 585, 490, 585, 455, 560); c.closePath(); };
  shadow(c, 548, 572, 100, 14);
  shape(c, blob, DOUGH, 6); shade(c, blob, DOUGHDK, -40, -10, 0.6);
  line(c, [[480, 490], [505, 472]], 8, WHITE);
  pointHand(c, 668, 540);
};

// setup.e3.1 etc. are in frame order
export const su_soundSourcesOfSound = cards("sci.sound.sources-of-sound.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
