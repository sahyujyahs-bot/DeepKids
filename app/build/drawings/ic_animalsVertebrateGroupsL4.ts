import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, person, hand, write, cards } from "./flatKit";

// FIVE GROUPS, FIVE WORLDS (sci.animals.vertebrate-groups.L4) · set-up cards for the three sense tests,
// then card pictures: the measured view, ripples on skin and on a fish, the owl's dish face, warmth on a palm,
// a frog's eardrum, a fox's ear flaps, a python's heat pits and a bat's echoes.

const WALL = "#f6eedb", FLOOR = "#e6d6b8", NIGHT = "#3a4068", NIGHTFLOOR = "#4a4030", PAPER = COL.paper, TOWEL = "#cfe3ee", TOWELDK = "#a9c7d8";
const rad = (d: number) => (d * Math.PI) / 180;

// ---------------------------------------------------------------- shared pieces
const room = (c: Ctx, horizon: number) => { ground(c, FLOOR); c.fillStyle = WALL; c.fillRect(0, 0, D, horizon); line(c, [[0, horizon], [D, horizon]], 5); };
const dashed = (c: Ctx, pts: number[][], w = 5, col = INK) => { c.setLineDash([16, 14]); line(c, pts, w, col); c.setLineDash([]); };
// sound: a few arcs centred on (x, y), spreading in the direction ang (radians)
const sound = (c: Ctx, x: number, y: number, ang: number, r0: number, n = 3, col = COL.blueDk, gap = 45) => { for (let i = 0; i < n; i++) { c.beginPath(); c.arc(x, y, r0 + i * gap, ang - 0.5, ang + 0.5); c.strokeStyle = col; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); } };
// a wavy line from (x0, y0) to (x1, y1), for heat or steam
const wavy = (c: Ctx, x0: number, y0: number, x1: number, y1: number, amp: number, waves: number, col: string, w = 6) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; c.beginPath();
  for (let i = 0; i <= 40; i++) { const t = i / 40, o = Math.sin(t * Math.PI * 2 * waves) * amp; const px = x0 + dx * t + nx * o, py = y0 + dy * t + ny * o; i ? c.lineTo(px, py) : c.moveTo(px, py); }
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke();
};
// a small paper slip with a number on it, centred at (x, y)
const slip = (c: Ctx, x: number, y: number, n: string) => { const tw = n.length * 26, w = tw + 30; shape(c, () => rrect(c, x - w / 2, y - 24, w, 48, 6), PAPER, 4); write(c, n, x - tw / 2 + 2, y - 16, 32, INK, 5); };
// a paper cup seen from above (a floor marker), with its number slip below
const cupTop = (c: Ctx, x: number, y: number, n: string) => { shadow(c, x + 6, y + 6, 32, 32); shape(c, () => ell(c, x, y, 32, 32), WHITE); shape(c, () => ell(c, x, y, 22, 22), COL.steelIn, 4); slip(c, x, y + 66, n); };
// a paper cup standing on the floor, bottom centre at (x, y), number slip in front
const cupFront = (c: Ctx, x: number, y: number, n: string) => {
  shadow(c, x + 10, y + 4, 34, 10);
  shape(c, () => polyP(c, [[x - 30, y - 70], [x + 30, y - 70], [x + 24, y], [x - 24, y]]), WHITE);
  shade(c, () => polyP(c, [[x - 30, y - 70], [x + 30, y - 70], [x + 24, y], [x - 24, y]]), COL.grey, -14, 0, 0.35);
  shape(c, () => ell(c, x, y - 70, 30, 9), COL.steelIn, 4);
  slip(c, x, y + 30, n);
};
// a yellow sticky note, centre (x, y)
const note = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 4), COL.yellow, 5); c.fillStyle = "#e8bb2a"; c.fillRect(x - s / 2 + 3, y - s / 2 + 3, s - 6, s * 0.18); };
// a low wooden stool, seat top centre at (x, y), with a back rest unless back = false
const stool = (c: Ctx, x: number, y: number, w: number, back = true) => {
  shadow(c, x + 20, y + 156, w * 0.6, 14);
  for (const s of [-1, 1]) { const l = [[x + s * (w / 2 - 22), y + 8], [x + s * (w / 2 - 8), y + 150]]; line(c, l, 24, INK); line(c, l, 14, COL.brown); }
  if (back) { for (const s of [-1, 1]) { const l = [[x + s * (w / 2 - 26), y - 10], [x + s * (w / 2 - 26), y - 200]]; line(c, l, 24, INK); line(c, l, 14, COL.brown); } shape(c, () => rrect(c, x - w / 2 + 12, y - 212, w - 24, 36, 8), COL.wood); }
  shape(c, () => rrect(c, x - w / 2, y - 16, w, 30, 8), COL.wood); shade(c, () => rrect(c, x - w / 2, y - 16, w, 30, 8), COL.woodDk, 0, -12);
};
// a table seen from the front: top face from yTop to yFront, front edge below it, two legs
const table = (c: Ctx, yTop: number, yFront: number) => {
  const top = () => polyP(c, [[120, yTop], [960, yTop], [1020, yFront], [60, yFront]]);
  for (const x of [110, 970]) line(c, [[x, yFront + 40], [x, D]], 26, INK), line(c, [[x, yFront + 40], [x, D]], 16, COL.woodDk);
  shape(c, top, COL.wood); shape(c, () => polyP(c, [[60, yFront], [1020, yFront], [1020, yFront + 48], [60, yFront + 48]]), COL.woodDk);
};
// a red card taped to a ruler, held at (hx, hy), the card dir-wards (1 right, -1 left), waved up and down
const redCard = (c: Ctx, hx: number, hy: number, dir: number) => {
  const ex = hx + dir * 80; line(c, [[hx, hy], [ex, hy]], 20, INK); line(c, [[hx, hy], [ex, hy]], 12, COL.wood);
  shape(c, () => rrect(c, ex - 45, hy - 55, 90, 110, 6), COL.red); shade(c, () => rrect(c, ex - 45, hy - 55, 90, 110, 6), "#b23a2a", 14, 0);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(ex, hy, 80, s > 0 ? rad(55) : rad(-125), s > 0 ? rad(125) : rad(-55)); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); c.beginPath(); c.arc(ex, hy, 100, s > 0 ? rad(62) : rad(-118), s > 0 ? rad(118) : rad(-62)); c.stroke(); }
};
// a small ticking alarm clock, centre (x, y)
const clock = (c: Ctx, x: number, y: number, r: number) => {
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * r * 0.55, y - r * 0.9, r * 0.3, r * 0.26), COL.steel, 4); line(c, [[x + s * r * 0.4, y + r * 0.85], [x + s * r * 0.6, y + r * 1.15]], 8, INK); }
  shape(c, () => ell(c, x, y, r, r), COL.steel); shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 3); }
  line(c, [[x, y], [x, y - r * 0.5]], 5); line(c, [[x, y], [x + r * 0.4, y + r * 0.2]], 5); line(c, [[x, y], [x - r * 0.3, y - r * 0.45]], 2.5, RED);
};
// a wide steel basin seen from the front, rim centre (x, y), with water in it
const basinFront = (c: Ctx, x: number, y: number, rx: number, ry: number, h: number) => {
  const body = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y + h * 0.9, x - rx * 0.75, y + h, x - rx * 0.7, y + h); c.lineTo(x + rx * 0.7, y + h); c.bezierCurveTo(x + rx * 0.75, y + h, x + rx, y + h * 0.9, x + rx, y); c.closePath(); };
  shadow(c, x + rx * 0.1, y + h + 6, rx * 0.8, h * 0.12);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, rx * 0.2, -h * 0.15);
  shape(c, () => ell(c, x, y, rx, ry), COL.steelIn, 5); shape(c, () => ell(c, x, y + 6, rx * 0.93, ry * 0.86), COL.water, 0);
};
// a towel lying flat, centre (x, y)
const towel = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 14), TOWEL, 5); for (const dy of [-h * 0.3, h * 0.3]) line(c, [[x - w / 2 + 20, y + dy], [x + w / 2 - 20, y + dy]], 6, TOWELDK); };
// a capped pen standing in a lump of clay, the clay's centre at (x, y)
const penInClay = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 11, y - 125, 22, 120, 6), "#3f5f9e"); shape(c, () => rrect(c, x - 13, y - 125, 26, 44, 7), COL.blue); line(c, [[x + 6, y - 118], [x + 6, y - 92]], 4);
  shape(c, () => ell(c, x, y, 42, 22), COL.soil); shade(c, () => ell(c, x, y, 42, 22), COL.soilDk, 10, -6);
};
// a flat hand seen from above (palm or back), wrist at the bottom when dir = -1 (fingers point up), the reverse when dir = 1
const palmTop = (c: Ctx, x: number, y: number, w: number, dir: number, skin: string) => {
  c.save(); c.translate(x, y); c.scale(1, dir);
  shape(c, () => rrect(c, -w / 2, -w * 0.55, w, w * 1.1, w * 0.25), skin, 5);
  const fl = [w * 0.62, w * 0.72, w * 0.66, w * 0.5];
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, -w / 2 + k * (w / 4) + 2, -w * 0.55 - fl[k], w / 4 - 4, fl[k] + 10, w * 0.1), skin, 4);
  shape(c, () => ell(c, -w * 0.58, -w * 0.1, w * 0.16, w * 0.3, 0.4), skin, 4);
  c.restore();
};
// a pointing hand from the side: wrist at (x, y), index finger along an, the other fingers folded
const pointHand = (c: Ctx, x: number, y: number, an: number, s: number, skin: string, sleeve: string) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), sleeve, 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, skin, 6);
  shape(c, () => rrect(c, 34, -30, 70, 17, 8.5), skin, 5);
  for (let k = 1; k < 4; k++) shape(c, () => rrect(c, 38, -30 + k * 17, 34, 17, 8.5), skin, 5);
  shape(c, () => { c.moveTo(-4, -30); c.quadraticCurveTo(22, -60, 52, -50); c.quadraticCurveTo(64, -44, 50, -34); c.quadraticCurveTo(26, -32, 12, -18); c.closePath(); }, skin, 5);
  c.restore();
};
// a cupped hand without a sleeve, wrist at (x, y), fingers along an (for the ear-cupping profile card)
const cupHand = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -30, -36, 70, 72, 18), SKIN.child, 6);
  const fl = [58, 66, 60, 46];
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 30, -34 + k * 17, fl[k], 16, 8), SKIN.child, 5);
  shape(c, () => ell(c, 10, -44, 26, 12, -0.4), SKIN.child, 5);
  c.restore();
};
// a mitten drawn again over a held thing, so the fingers wrap round it
const mitt = (c: Ctx, x: number, y: number, r: number, skin: string) => shape(c, () => ell(c, x, y, r * 1.05, r * 0.8), skin, 5);
// one straight finger out of a mitten, from (x, y) along an
const finger = (c: Ctx, x: number, y: number, an: number, len: number, skin: string) => { const e = [x + Math.cos(an) * len, y + Math.sin(an) * len]; line(c, [[x, y], e], 22, INK); line(c, [[x, y], e], 13, skin); };
// a palm laid flat over one eye, at (x, y)
const palmOver = (c: Ctx, x: number, y: number, skin: string) => { shape(c, () => rrect(c, x - 30, y - 36, 60, 74, 22), skin, 5); for (const dy of [-14, 4, 22]) line(c, [[x - 10, y + dy], [x + 14, y + dy]], 3, skin === SKIN.child ? SKIN.childDk : SKIN.adultDk); };
// eyes closed: lids drawn over the eyes of a person whose head centre is (x, hy) with head radius r
const closedEyes = (c: Ctx, x: number, hy: number, r: number) => { for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * r * 0.38, hy + r * 0.16, r * 0.17, r * 0.21), SKIN.child, 0); c.beginPath(); c.arc(x + s * r * 0.38, hy + r * 0.08, r * 0.14, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); } };
// a rat, nose pointing dir-wards, body centre (x, y)
const rat = (c: Ctx, x: number, y: number, s: number, dir: number, col: string, dk: string) => {
  line(c, [[x - dir * s * 0.9, y], [x - dir * s * 1.5, y - s * 0.3], [x - dir * s * 2.1, y + s * 0.1]], 7, dk);
  shape(c, () => ell(c, x, y, s, s * 0.55), col); shape(c, () => ell(c, x + dir * s * 0.95, y + s * 0.05, s * 0.45, s * 0.35), col, 5);
  shape(c, () => ell(c, x + dir * s * 0.7, y - s * 0.35, s * 0.17, s * 0.17), col, 4); shape(c, () => ell(c, x + dir * s * 1.35, y + s * 0.05, s * 0.07, s * 0.07), INK, 0);
  shape(c, () => ell(c, x + dir * s * 1.05, y - s * 0.08, s * 0.06, s * 0.06), INK, 0);
};

// ---------------------------------------------------------------- e1 · Wide View, Deep View
const E1_CHAIR: [number, number] = [430, 620];
const clockPos = (n: number, R = 330): [number, number] => [E1_CHAIR[0] + Math.sin(rad(n * 30)) * R, E1_CHAIR[1] - Math.cos(rad(n * 30)) * R];
// the room from above: the wall with the note at the top, the chair facing it, markers 12 to 6 round the right side
const e1Plan = (c: Ctx, withChild: boolean) => {
  ground(c, FLOOR);
  c.fillStyle = "#9a9080"; c.fillRect(0, 60, D, 44); line(c, [[0, 104], [D, 104]], 5); note(c, 430, 82, 60);
  dashed(c, [[430, 540], [430, 118]], 5, COL.greyDk);
  const [cx, cy] = E1_CHAIR;
  shadow(c, cx + 12, cy + 12, 90, 90);
  shape(c, () => rrect(c, cx - 78, cy - 78, 156, 156, 16), COL.wood); shape(c, () => rrect(c, cx - 82, cy + 58, 164, 30, 8), COL.brown);
  if (withChild) {
    c.beginPath(); c.moveTo(cx, cy - 20); c.arc(cx, cy - 20, 400, rad(-195), rad(15)); c.closePath(); c.fillStyle = COL.teal; c.globalAlpha = 0.28; c.fill(); c.globalAlpha = 1; c.strokeStyle = COL.tealDk; c.lineWidth = 5; c.stroke();
    shape(c, () => ell(c, cx, cy + 10, 96, 44), CLOTH.child); shade(c, () => ell(c, cx, cy + 10, 96, 44), CLOTH.childDk, 20, 0);
    shape(c, () => ell(c, cx, cy - 30, 24, 16), SKIN.child, 4);
    shape(c, () => ell(c, cx, cy - 20, 50, 50), CLOTH.hair); shape(c, () => ell(c, cx, cy + 36, 22, 22), CLOTH.hair, 4);
  }
  for (const n of [12, 1, 2, 3, 4, 5, 6]) { const [x, y] = clockPos(n === 12 ? 0 : n); cupTop(c, x, y, String(n)); }
};
const e1s0 = (c: Ctx) => e1Plan(c, false);
// the test from the front: the child on the stool facing the wall note (drawn on the near wall), markers on her right
// (the viewer's left), the helper at marker n waving the red card at eye height
const e1Scene = (c: Ctx, helperAt: 4 | 2, coverEye: boolean) => {
  room(c, 340);
  const pos = (n: number): [number, number] => { const th = rad(n * 30); return [640 - Math.sin(th) * 400, 740 + Math.cos(th) * 200]; };
  // the helper at marker 2 stands in front of markers 4 and 5, so they are out of sight on that card
  cupFront(c, ...pos(6), "6"); if (helperAt === 4) cupFront(c, ...pos(5), "5");
  if (helperAt === 4) {
    const hd = person(c, 150, 680, 520, { adult: true, reachR: [265, 445] });
    redCard(c, hd.handR[0], hd.handR[1], 1);
  }
  cupFront(c, ...pos(4), "4");
  stool(c, 680, 680, 180);
  person(c, 680, 680, 440, { sit: true, dir: -1, ...(coverEye ? { reachR: [720, 480] as [number, number] } : {}) });
  if (coverEye) palmOver(c, 706, 470, SKIN.child);
  cupFront(c, ...pos(3), "3");
  if (helperAt === 2) {
    cupFront(c, 270, 860, "2");
    const hd = person(c, 365, 875, 560, { adult: true, reachR: [470, 470] });
    redCard(c, hd.handR[0], hd.handR[1], 1);
    cupFront(c, 470, 925, "1");
  } else { cupFront(c, ...pos(2), "2"); cupFront(c, ...pos(1), "1"); }
  cupFront(c, ...pos(0), "12");
  c.fillStyle = "#d9c8a6"; c.fillRect(0, 985, D, D - 985); line(c, [[0, 985], [D, 985]], 5); note(c, 680, 1032, 64);
};
const e1s1 = (c: Ctx) => e1Scene(c, 4, false);
const e1s2 = (c: Ctx) => e1Scene(c, 2, true);
// the pen test at the table: finger by the ear, then a touch at arm's length
const e1Table = (c: Ctx, oneEye: boolean) => {
  room(c, 300);
  const x = 460, h = 460, pen: [number, number] = oneEye ? [728, 800] : [720, 790];
  const p = oneEye ? { reachL: [430, 625] as [number, number], reachR: [665, 705] as [number, number] } : { reachR: [560, 612] as [number, number] };
  const hd = person(c, x, 990, h, p);
  if (oneEye) { palmOver(c, 434, 606, SKIN.child); finger(c, hd.handR[0], hd.handR[1], 0.15, 34, SKIN.child); } else finger(c, hd.handR[0], hd.handR[1], -1.5, 36, SKIN.child);
  table(c, 700, 830);
  penInClay(c, pen[0], pen[1]);
  if (!oneEye) arrow(c, [[hd.handR[0] + 20, hd.handR[1] - 50], [660, 520], [715, 590], [pen[0] + 2, pen[1] - 150]], RED, 9);
};
const e1s3 = (c: Ctx) => e1Table(c, false);
const e1s4 = (c: Ctx) => e1Table(c, true);

// ---------------------------------------------------------------- e2 · Ripple Skin
const e2s0 = (c: Ctx) => {
  room(c, 300);
  const x = 540;
  person(c, x, 1000, 480, { reachL: [478, 840], reachR: [602, 840] });
  // scarf over the eyes, ear muffs over the ears
  shape(c, () => rrect(c, x - 84, 590, 168, 36, 8), COL.purple, 5); shape(c, () => polyP(c, [[x + 80, 600], [x + 130, 585], [x + 118, 625]]), COL.purple, 5);
  c.beginPath(); c.ellipse(x, 606, 72, 112, 0, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 16; c.stroke(); c.beginPath(); c.ellipse(x, 606, 72, 112, 0, Math.PI, Math.PI * 2); c.strokeStyle = COL.pink; c.lineWidth = 8; c.stroke();
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 70, 608, 27, 31), COL.pink, 5);
  table(c, 760, 920);
  towel(c, 540, 905, 760, 70);
  basinFront(c, 540, 780, 330, 95, 130);
  palmTop(c, 478, 822, 70, 1, SKIN.child); palmTop(c, 602, 822, 70, 1, SKIN.child);
};
// the basin from above: the child's hands in the middle, the card strip from her left hand, the helper's fingertip at 20 cm
const e2Top = (c: Ctx, withStrip: boolean) => {
  ground(c, FLOOR);
  towel(c, 540, 560, 1000, 980);
  shadow(c, 560, 580, 446, 446);
  shape(c, () => ell(c, 540, 560, 440, 440), COL.steel); shade(c, () => ell(c, 540, 560, 440, 440), COL.steelDk, 30, -30);
  shape(c, () => ell(c, 540, 560, 395, 395), COL.water, 5);
  // the child's forearms come in from the bottom, her hands lie flat in the middle
  for (const hx of [480, 610]) { shape(c, () => rrect(c, hx - 34, 640, 68, 420, 20), SKIN.child, 5); shape(c, () => rrect(c, hx - 44, 930, 88, 200, 20), CLOTH.child, 5); palmTop(c, hx, 600, 92, -1, SKIN.child); }
  if (withStrip) {
    shape(c, () => rrect(c, 150, 540, 288, 40, 6), PAPER, 5);
    for (const [cm, lab] of [[0, ""], [5, "5"], [10, "10"], [20, "20"]] as [number, string][]) { const mx = 438 - cm * 14; line(c, [[mx, 542], [mx, cm % 10 === 0 ? 578 : 566]], cm ? 4 : 6); if (lab) write(c, lab, mx - lab.length * 11, 588, 28, INK, 5); }
    // one hand holds the strip's end above the child's hand, the other's fingertip is at the 20 cm end, about to dip
    shape(c, () => rrect(c, 380, -20, 50, 470, 20), CLOTH.adult, 5); palmTop(c, 405, 486, 60, -1, SKIN.adult);
    pointHand(c, 50, 700, -0.5, 1, SKIN.adult, CLOTH.adult);
    c.setLineDash([8, 8]); c.beginPath(); ell(c, 152, 660, 30, 30); c.strokeStyle = COL.blueDk; c.lineWidth = 4; c.stroke(); c.setLineDash([]);
  } else {
    pointHand(c, 50, 660, -0.5, 1, SKIN.adult, CLOTH.adult);
    for (let i = 1; i <= 5; i++) { c.beginPath(); c.arc(158, 600, 36 + i * 58, rad(-80), rad(80)); c.strokeStyle = COL.waterDk; c.lineWidth = 6; c.stroke(); }
  }
};
const e2s1 = (c: Ctx) => e2Top(c, true);
const coin = (c: Ctx, x: number, y: number, r: number, heads: boolean) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), "#f0c23a", 3);
  if (heads) { shape(c, () => ell(c, x, y - r * 0.08, r * 0.3, r * 0.34), "#c99a1f", 3); shape(c, () => rrect(c, x - r * 0.3, y + r * 0.22, r * 0.6, r * 0.3, 4), "#c99a1f", 3); } else write(c, "1", x - r * 0.3, y - r * 0.42, r * 0.85, "#8a6410", 7);
};
const e2s2 = (c: Ctx) => {
  room(c, 340);
  towel(c, 300, 905, 520, 70);
  basinFront(c, 300, 820, 230, 70, 100);
  const hd = person(c, 720, 940, 600, { adult: true, reachL: [585, 560] });
  // the coin in the air above the open palm
  dashed(c, [[hd.handL[0] - 10, hd.handL[1] - 30], [hd.handL[0] - 30, 500], [hd.handL[0] - 40, 440]], 4, COL.greyDk);
  coin(c, hd.handL[0] - 45, 420, 40, true);
  for (const s of [-1, 1]) line(c, [[hd.handL[0] - 45 + s * 60, 380], [hd.handL[0] - 45 + s * 78, 350]], 5, COL.greyDk);
  // the rule card: heads means left, tails means right
  shape(c, () => rrect(c, 790, 740, 250, 190, 10), PAPER, 5);
  coin(c, 840, 790, 30, true); arrow(c, [[1000, 790], [900, 790]], RED, 8);
  coin(c, 840, 880, 30, false); arrow(c, [[900, 880], [1000, 880]], RED, 8);
};
const tick = (c: Ctx, x: number, y: number) => line(c, [[x - 14, y], [x - 3, y + 13], [x + 18, y - 16]], 7, COL.greenDk);
const cross = (c: Ctx, x: number, y: number) => { line(c, [[x - 12, y - 12], [x + 12, y + 12]], 6, RED); line(c, [[x + 12, y - 12], [x - 12, y + 12]], 6, RED); };
const e2s3 = (c: Ctx) => {
  ground(c, BG);
  shadow(c, 560, 560, 380, 380);
  shape(c, () => rrect(c, 170, 150, 740, 780, 10), PAPER, 5);
  line(c, [[170, 270], [910, 270]], 5); line(c, [[470, 150], [470, 930]], 5); for (const y of [490, 710]) line(c, [[170, y], [910, y]], 3, COL.grey);
  // header: a ruler for the distance, a tick for right answers
  shape(c, () => rrect(c, 230, 190, 190, 40, 4), COL.wood, 4); for (let i = 0; i <= 8; i++) line(c, [[240 + i * 21, 190], [240 + i * 21, i % 4 === 0 ? 218 : 206]], 3);
  tick(c, 600, 210); write(c, "10", 660, 182, 50, INK, 7);
  const rows: [string, number][] = [["5 cm", 9], ["10 cm", 7], ["20 cm", 5]];
  rows.forEach(([lab, right], i) => { const y = 380 + i * 220; write(c, lab, 215, y - 40, 72, INK, 8); for (let k = 0; k < 10; k++) { const tx = 520 + (k % 5) * 76, ty = y - 40 + Math.floor(k / 5) * 80; k < right ? tick(c, tx, ty) : cross(c, tx, ty); } });
  c.save(); c.translate(840, 1000); c.rotate(-0.6); shape(c, () => rrect(c, -160, -14, 300, 28, 6), COL.yellow, 5); shape(c, () => polyP(c, [[-160, -14], [-200, 0], [-160, 14]]), COL.wood, 4); shape(c, () => polyP(c, [[-200, 0], [-186, -5], [-186, 5]]), INK, 0); c.restore();
};

// ---------------------------------------------------------------- e3 · Cup Your Ears
const corridor = (c: Ctx) => { room(c, 420); line(c, [[0, 1080], [300, 420]], 4, "#d6c4a2"); line(c, [[1080, 1080], [780, 420]], 4, "#d6c4a2"); };
const e3Child = (c: Ctx) => { stool(c, 760, 700, 180); person(c, 760, 700, 440, { sit: true, dir: -1 }); closedEyes(c, 760, 476, 66); };
const e3s0 = (c: Ctx) => {
  corridor(c);
  const hd = person(c, 200, 700, 360, { adult: true, reachR: [300, 490] });
  clock(c, 338, 490, 32); mitt(c, hd.handR[0] + 6, hd.handR[1] + 6, 15, SKIN.adult);
  sound(c, 372, 490, 0, 34, 3, COL.blueDk, 34);
  e3Child(c);
};
const e3s1 = (c: Ctx) => {
  corridor(c);
  // the tape measure along the floor from the stool to the helper
  shape(c, () => polyP(c, [[430, 790], [700, 830], [700, 856], [430, 816]]), COL.yellow, 4); for (let i = 0; i <= 9; i++) { const t = i / 9; line(c, [[430 + 270 * t, 790 + 40 * t], [430 + 270 * t, 790 + 40 * t + (i % 3 === 0 ? 22 : 12)]], 3); }
  const hd = person(c, 400, 770, 420, { adult: true, reachR: [520, 500] });
  clock(c, 560, 500, 36); mitt(c, hd.handR[0] + 6, hd.handR[1] + 6, 17, SKIN.adult);
  sound(c, 598, 500, 0, 38, 3, COL.blueDk, 34);
  arrow(c, [[400, 300], [560, 300]], RED, 10);
  e3Child(c);
};
// the child's head from the side, facing right, head centre (cx, cy), radius r
const profile = (c: Ctx, cx: number, cy: number, r: number) => {
  shape(c, () => { c.moveTo(cx - r * 1.5, cy + r * 2.4); c.quadraticCurveTo(cx - r * 1.4, cy + r * 1.15, cx - r * 0.3, cy + r * 1.05); c.lineTo(cx + r * 0.3, cy + r * 1.05); c.quadraticCurveTo(cx + r * 1.3, cy + r * 1.15, cx + r * 1.4, cy + r * 2.4); c.closePath(); }, CLOTH.child);
  shape(c, () => rrect(c, cx - r * 0.32, cy + r * 0.6, r * 0.64, r * 0.55, 8), SKIN.child, 5);
  shape(c, () => ell(c, cx, cy, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(cx + r * 0.88, cy - r * 0.02); c.quadraticCurveTo(cx + r * 1.26, cy + r * 0.14, cx + r * 0.9, cy + r * 0.34); c.closePath(); }, SKIN.child, 0);
  c.beginPath(); c.moveTo(cx + r * 0.9, cy - r * 0.06); c.quadraticCurveTo(cx + r * 1.26, cy + r * 0.14, cx + r * 0.9, cy + r * 0.36); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => { c.moveTo(cx + r * 0.72, cy - r * 0.6); c.quadraticCurveTo(cx + r * 0.4, cy - r * 1.3, cx - r * 0.3, cy - r * 1.14); c.quadraticCurveTo(cx - r * 1.2, cy - r * 0.85, cx - r * 1.03, cy + r * 0.35); c.quadraticCurveTo(cx - r * 0.85, cy - r * 0.25, cx - r * 0.4, cy - r * 0.5); c.quadraticCurveTo(cx + r * 0.2, cy - r * 0.68, cx + r * 0.72, cy - r * 0.6); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, cx - r * 0.98, cy - r * 0.72, r * 0.34, r * 0.34), CLOTH.hair, 4);
  c.beginPath(); c.arc(cx + r * 0.5, cy - r * 0.04, r * 0.14, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  c.beginPath(); c.arc(cx + r * 0.62, cy + r * 0.46, r * 0.12, 0.4, Math.PI - 0.7); c.stroke();
  shape(c, () => ell(c, cx - r * 0.32, cy + r * 0.08, r * 0.18, r * 0.26), SKIN.child, 4);
  c.beginPath(); c.arc(cx - r * 0.32, cy + r * 0.1, r * 0.09, -0.8, 2.2); c.strokeStyle = SKIN.childDk; c.lineWidth = 3; c.stroke();
};
const e3s2 = (c: Ctx) => {
  ground(c, BG);
  line(c, [[540, 80], [540, 1000]], 4, COL.grey);
  const r = 120;
  // left: cupped behind the ear, fingers forward. right: cupped the other way, fingers backward
  [[270, 1], [810, -1]].forEach(([cx, fwd]) => {
    const cy = 520;
    const wrist: [number, number] = fwd > 0 ? [cx - 120, cy + 84] : [cx - 82, cy + 64];
    const arm = fwd > 0 ? [[cx - 60, cy + 250], [cx - 130, cy + 130], wrist] : [[cx - 30, cy + 260], [cx - 90, cy + 140], wrist];
    line(c, arm, 40, INK); line(c, arm, 28, CLOTH.child);
    profile(c, cx, cy, r);
    if (fwd > 0) cupHand(c, wrist[0], wrist[1], -0.55, 0.72); else cupHand(c, wrist[0], wrist[1], Math.PI + 0.5, 0.72);
    clock(c, cx + 215, cy, 30); sound(c, cx + 180, cy, Math.PI, 26, 2, COL.blueDk, 30);
  });
};
const e3s3 = (c: Ctx) => {
  room(c, 340);
  stool(c, 150, 660, 120, false); clock(c, 150, 606, 42);
  const x = 620, hd = person(c, x, 980, 460, { reachL: [450, 650] });
  // the card cone: narrow end at the ear, wide end towards the clock
  shape(c, () => polyP(c, [[546, 591], [546, 615], [330, 673], [330, 533]]), PAPER); shape(c, () => ell(c, 330, 603, 18, 70), "#d8cfb8", 5);
  line(c, [[520, 600], [350, 612]], 3, COL.grey);
  mitt(c, hd.handL[0] + 4, hd.handL[1] - 6, 20, SKIN.child);
  sound(c, 200, 606, 0, 44, 3, COL.blueDk, 32);
};

// ---------------------------------------------------------------- card pictures
const fE1 = (c: Ctx) => e1Plan(c, true);
// a silver fish, nose pointing left, with the lateral line dotted along her side
const fish = (c: Ctx, x: number, y: number, L: number) => {
  const body = () => { c.moveTo(x - L / 2, y); c.bezierCurveTo(x - L * 0.3, y - L * 0.26, x + L * 0.1, y - L * 0.26, x + L * 0.32, y); c.bezierCurveTo(x + L * 0.1, y + L * 0.26, x - L * 0.3, y + L * 0.26, x - L / 2, y); c.closePath(); };
  shape(c, () => polyP(c, [[x + L * 0.28, y], [x + L * 0.5, y - L * 0.2], [x + L * 0.46, y], [x + L * 0.5, y + L * 0.2]]), COL.steelDk);
  shape(c, () => polyP(c, [[x - L * 0.1, y - L * 0.17], [x + L * 0.02, y - L * 0.3], [x + L * 0.14, y - L * 0.14]]), COL.steelDk);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 0, -L * 0.1, 0.45);
  shape(c, () => polyP(c, [[x - L * 0.12, y + L * 0.1], [x - L * 0.02, y + L * 0.24], [x + L * 0.08, y + L * 0.12]]), COL.steelDk, 5);
  c.beginPath(); c.arc(x - L * 0.3, y, L * 0.14, -1.1, 1.1); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, () => ell(c, x - L * 0.38, y - L * 0.05, L * 0.035, L * 0.035), WHITE, 4); shape(c, () => ell(c, x - L * 0.385, y - L * 0.05, L * 0.018, L * 0.018), INK, 0);
  for (let i = 0; i < 12; i++) { const t = i / 11, px = x - L * 0.22 + t * L * 0.5, py = y + L * 0.03 - Math.sin(t * Math.PI) * L * 0.04; shape(c, () => ell(c, px, py, 6, 6), INK, 0); }
};
const fE2 = (c: Ctx) => {
  ground(c, BG);
  // top: a fish feels ripples from an insect that fell on the water
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 150); c.fillStyle = COL.water; c.fillRect(0, 150, D, 390); line(c, [[0, 150], [D, 150]], 5);
  fish(c, 640, 340, 420);
  for (let i = 1; i <= 4; i++) { c.beginPath(); ell(c, 300, 150, 40 + i * 60, 10 + i * 15); c.strokeStyle = COL.waterDk; c.lineWidth = 5; c.stroke(); }
  shape(c, () => ell(c, 300, 140, 16, 10), INK, 0); for (const s of [-1, 1]) shape(c, () => ell(c, 300 + s * 18, 128, 16, 7, s * 0.5), "rgba(255,255,255,0.8)", 3);
  line(c, [[0, 540], [D, 540]], 5);
  // bottom: the child's hands feel ripples from a fingertip in the basin
  c.fillStyle = FLOOR; c.fillRect(0, 543, D, D - 543);
  for (const hx of [620, 740]) { shape(c, () => rrect(c, hx - 30, 730, 60, 84, 18), SKIN.child, 5); shape(c, () => rrect(c, hx - 40, 640, 80, 100, 18), CLOTH.child, 5); }
  basinFront(c, 560, 820, 440, 120, 150); palmTop(c, 620, 850, 76, 1, SKIN.child); palmTop(c, 740, 850, 76, 1, SKIN.child);
  for (let i = 1; i <= 5; i++) { c.beginPath(); c.ellipse(260, 822, 30 + i * 60, 8 + i * 16, 0, 0, Math.PI * 2); c.strokeStyle = COL.waterDk; c.lineWidth = 5; c.stroke(); }
  pointHand(c, 120, 720, 0.9, 0.9, SKIN.adult, CLOTH.adult);
};
const fE3 = (c: Ctx) => {
  ground(c, NIGHT);
  c.fillStyle = NIGHTFLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 5);
  // the beam and the owl standing on it
  shape(c, () => rrect(c, 90, 760, 900, 58, 6), COL.brown); c.fillStyle = COL.soilDk; c.fillRect(93, 800, 894, 15);
  for (const s of [-1, 1]) { shape(c, () => ell(c, 540 + s * 95, 625, 55, 130, s * 0.15), "#c9a36a"); for (let i = 0; i < 5; i++) shape(c, () => ell(c, 540 + s * (85 + (i % 2) * 20), 540 + i * 40, 6, 6), INK, 0); }
  shape(c, () => ell(c, 540, 610, 110, 150), "#f3e7cf");
  const heart = () => { c.moveTo(540, 565); c.bezierCurveTo(470, 525, 440, 475, 450, 425); c.bezierCurveTo(460, 385, 520, 385, 540, 415); c.bezierCurveTo(560, 385, 620, 385, 630, 425); c.bezierCurveTo(640, 475, 610, 525, 540, 565); c.closePath(); };
  shape(c, heart, WHITE);
  for (const s of [-1, 1]) shape(c, () => ell(c, 540 + s * 40, 458, 19, 19), INK, 0);
  shape(c, () => polyP(c, [[540, 490], [530, 510], [550, 510]]), "#e9d6a8", 3);
  for (const s of [-1, 1]) for (let k = -1; k <= 1; k++) line(c, [[540 + s * 28 + k * 10, 752], [540 + s * 28 + k * 14, 772]], 5, INK);
  // the rat on the floor, and her tiny sound climbing to the owl's face
  rat(c, 800, 965, 48, -1, COL.grey, COL.greyDk);
  sound(c, 780, 940, rad(-118), 90, 3, COL.sky, 50);
};
const fA2 = (c: Ctx) => {
  room(c, 300);
  table(c, 640, 800);
  // the ruler lying between hand and mug
  shape(c, () => rrect(c, 380, 700, 360, 40, 4), COL.wood, 5); for (let i = 0; i <= 20; i++) line(c, [[395 + i * 16.5, 700], [395 + i * 16.5, i % 10 === 0 ? 730 : i % 5 === 0 ? 722 : 714]], i % 10 === 0 ? 4 : 2.5);
  // the child's palm held out, the helper bringing the warm mug closer
  hand(c, 220, 560, -0.25, 1.25, SKIN.child, CLOTH.child, true);
  shape(c, () => rrect(c, 700, 470, 120, 150, 14), "#f4efe6"); shade(c, () => rrect(c, 700, 470, 120, 150, 14), "#d9d2c4", 18, 0);
  shape(c, () => ell(c, 760, 470, 60, 14), "#e9e2d2", 5); shape(c, () => ell(c, 760, 471, 48, 9), "#b98a4a", 0);
  c.beginPath(); c.ellipse(835, 545, 34, 44, 0, -Math.PI / 2, Math.PI / 2); c.strokeStyle = INK; c.lineWidth = 26; c.stroke(); c.beginPath(); c.ellipse(835, 545, 34, 44, 0, -Math.PI / 2, Math.PI / 2); c.strokeStyle = "#f4efe6"; c.lineWidth = 14; c.stroke();
  c.save(); c.translate(960, 548); c.scale(-1, 1); hand(c, 0, 0, 0, 1, SKIN.adult, CLOTH.adult); c.restore();
  for (const dy of [-40, 0, 40]) wavy(c, 690, 545 + dy, 530, 530 + dy, 9, 3, COL.orange, 6);
  wavy(c, 740, 455, 745, 390, 7, 1.5, COL.grey, 5); wavy(c, 780, 455, 785, 380, 7, 1.5, COL.grey, 5);
  arrow(c, [[780, 400], [620, 400]], RED, 9);
};
const tFrog = (c: Ctx) => {
  ground(c, BG);
  const lf = () => { c.moveTo(60, 760); c.quadraticCurveTo(540, 440, 1020, 640); c.quadraticCurveTo(540, 920, 60, 760); c.closePath(); };
  shadow(c, 560, 800, 440, 60); shape(c, lf, COL.leaf); line(c, [[80, 760], [980, 650]], 5, COL.leafDk);
  const x = 540, y = 600;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * 190, y + 70, 70, 50, s * 0.3), COL.green); shape(c, () => polyP(c, [[x + s * 230, y + 110], [x + s * 300, y + 130], [x + s * 290, y + 150], [x + s * 215, y + 135]]), COL.green, 5); }
  const body = () => ell(c, x, y + 40, 200, 125);
  shape(c, body, COL.green); shade(c, body, COL.greenDk, 20, -20, 0.45);
  shape(c, () => ell(c, x, y + 85, 130, 60), COL.greenLt, 0);
  for (const s of [-1, 1]) { shape(c, () => rrect(c, x + s * 100 - 22, y + 100, 44, 70, 16), COL.green, 5); for (let k = -1; k <= 1; k++) shape(c, () => ell(c, x + s * 100 + k * 18, y + 176, 9, 7), COL.green, 3); }
  shape(c, () => ell(c, x, y - 30, 170, 95), COL.green); shade(c, () => ell(c, x, y - 30, 170, 95), COL.greenDk, 16, -14, 0.4);
  c.beginPath(); c.arc(x, y - 10, 70, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * 135, y - 40, 34, 34), "#7b8f3a"); shape(c, () => ell(c, x + s * 135, y - 40, 22, 22), "#95a84c", 3);
    c.beginPath(); ell(c, x + s * 135, y - 40, 54, 54); c.strokeStyle = RED; c.lineWidth = 7; c.stroke();
    shape(c, () => ell(c, x + s * 70, y - 95, 42, 42), COL.green); shape(c, () => ell(c, x + s * 70, y - 95, 28, 28), COL.yellow, 4); shape(c, () => ell(c, x + s * 70, y - 95, 20, 8), INK, 0);
  }
};
const tFox = (c: Ctx) => {
  ground(c, BG);
  const x = 560, y = 580, FOX = "#e07b39", FOXDK = "#b85d24";
  shape(c, () => { c.moveTo(x - 260, 1080); c.quadraticCurveTo(x - 250, 760, x - 60, 700); c.lineTo(x + 60, 700); c.quadraticCurveTo(x + 250, 760, x + 260, 1080); c.closePath(); }, FOX);
  shape(c, () => { c.moveTo(x - 110, 1080); c.quadraticCurveTo(x - 110, 780, x, 740); c.quadraticCurveTo(x + 110, 780, x + 110, 1080); c.closePath(); }, WHITE, 0);
  // both ear flaps turned to the left, towards the sound
  for (const s of [-1, 1]) {
    const ear = () => polyP(c, [[x + s * 60 - 80, y - 60], [x + s * 75 - 150, y - 330], [x + s * 150 - 60, y - 90]]);
    shape(c, ear, FOX); shape(c, () => polyP(c, [[x + s * 60 - 72, y - 92], [x + s * 75 - 135, y - 280], [x + s * 132 - 66, y - 108]]), COL.pink, 4);
  }
  const head = () => { c.moveTo(x - 180, y - 80); c.quadraticCurveTo(x - 170, y + 60, x - 50, y + 150); c.quadraticCurveTo(x, y + 180, x + 50, y + 150); c.quadraticCurveTo(x + 170, y + 60, x + 180, y - 80); c.quadraticCurveTo(x + 100, y - 160, x, y - 150); c.quadraticCurveTo(x - 100, y - 160, x - 180, y - 80); c.closePath(); };
  shape(c, head, FOX); shade(c, head, FOXDK, 22, -16, 0.4);
  shape(c, () => { c.moveTo(x - 120, y + 20); c.quadraticCurveTo(x - 90, y + 140, x, y + 170); c.quadraticCurveTo(x + 90, y + 140, x + 120, y + 20); c.quadraticCurveTo(x, y + 60, x - 120, y + 20); c.closePath(); }, WHITE, 0);
  shape(c, () => ell(c, x, y + 120, 24, 17), INK, 0);
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * 70, y - 10, 24, 28), WHITE, 4); shape(c, () => ell(c, x + s * 70 - 6, y - 8, 13, 16), INK, 0); }
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) line(c, [[x + s * 60, y + 100 + k * 18], [x + s * 170, y + 80 + k * 30]], 3, FOXDK);
  sound(c, 150, 330, rad(10), 40, 4, COL.blueDk, 48);
};
const tPython = (c: Ctx) => {
  ground(c, NIGHT);
  // the rat as the python feels her: a warm glow
  for (let i = 4; i >= 1; i--) { c.beginPath(); ell(c, 900, 600, 70 + i * 40, 60 + i * 34); c.fillStyle = COL.orange; c.globalAlpha = 0.12; c.fill(); } c.globalAlpha = 1;
  rat(c, 900, 600, 66, -1, COL.yellow, COL.orange);
  for (const dy of [-50, 0, 50]) wavy(c, 790, 600 + dy, 690, 540 + dy * 0.6, 8, 3, COL.orange, 6);
  // the python's head from the side, pits along the lips, tongue out
  const head = () => { c.moveTo(60, 400); c.bezierCurveTo(300, 330, 520, 340, 620, 420); c.bezierCurveTo(680, 470, 680, 520, 640, 540); c.bezierCurveTo(520, 610, 300, 620, 60, 600); c.closePath(); };
  shape(c, head, "#c9a35f"); shade(c, head, "#a07f3e", 0, -40, 0.5);
  for (const [bx, by, br] of [[180, 440, 60], [340, 410, 55], [470, 470, 40], [240, 550, 45]]) shape(c, () => ell(c, bx, by, br, br * 0.6), "#6b4a2a", 3);
  line(c, [[660, 505], [560, 530], [420, 545], [300, 552]], 5);
  for (let i = 0; i < 6; i++) { const t = i / 5, px = 340 + t * 290, py = 538 - t * 24 - Math.sin(t * 2) * 6; shape(c, () => ell(c, px, py - 20, 12, 15), "#3a2a16", 3); }
  for (let i = 0; i < 4; i++) { const px = 400 + i * 65; shape(c, () => ell(c, px, 572, 10, 12), "#3a2a16", 3); }
  shape(c, () => ell(c, 530, 430, 26, 26), COL.yellow); shape(c, () => rrect(c, 526, 408, 8, 44, 4), INK, 0);
  shape(c, () => ell(c, 300, 455, 14, 10), "#3a2a16", 3);
  line(c, [[662, 512], [730, 512], [770, 496]], 9, "#7a2a3a"); line(c, [[730, 512], [772, 532]], 9, "#7a2a3a");
};
const tBat = (c: Ctx) => {
  ground(c, NIGHT);
  const x = 330, y = 430, BAT = "#4a3c58";
  for (const s of [-1, 1]) {
    const wing = () => { c.moveTo(x + s * 30, y - 10); c.quadraticCurveTo(x + s * 140, y - 150, x + s * 300, y - 90); c.quadraticCurveTo(x + s * 250, y - 20, x + s * 240, y + 50); c.quadraticCurveTo(x + s * 190, y + 20, x + s * 150, y + 70); c.quadraticCurveTo(x + s * 110, y + 40, x + s * 60, y + 80); c.closePath(); };
    shape(c, wing, BAT); for (const [fx, fy] of [[240, 50], [150, 70]]) line(c, [[x + s * 30, y - 10], [x + s * fx, y + fy]], 3, "#6a5a78");
  }
  shape(c, () => ell(c, x, y + 20, 36, 60), BAT); shape(c, () => ell(c, x, y - 40, 34, 32), BAT);
  for (const s of [-1, 1]) shape(c, () => polyP(c, [[x + s * 10, y - 60], [x + s * 30, y - 110], [x + s * 36, y - 50]]), BAT, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 13, y - 42, 6, 6), COL.yellow, 0);
  shape(c, () => polyP(c, [[x - 12, y - 22], [x + 12, y - 22], [x, y - 10]]), "#2b1e2e", 2);
  // the moth, with her two pairs of wings
  const mx = 830, my = 560;
  for (const s of [-1, 1]) { shape(c, () => ell(c, mx + s * 48, my - 20, 50, 30, s * 0.4), "#e8d49a"); shape(c, () => ell(c, mx + s * 36, my + 22, 36, 24, -s * 0.3), "#d8bf80"); }
  shape(c, () => ell(c, mx, my, 12, 42), "#8a6a3a"); for (const s of [-1, 1]) line(c, [[mx + s * 4, my - 40], [mx + s * 30, my - 80]], 3);
  // calls go out to the moth, echoes come back to the ears
  const a = Math.atan2(my - 20 - y, mx - x);
  sound(c, x + 60, y - 10, a, 100, 3, COL.sky, 60);
  sound(c, mx - 60, my - 10, a + Math.PI, 80, 2, COL.orange, 50);
  arrow(c, [[x + 110, y - 90], [x + 230, y - 60]], COL.sky, 8); arrow(c, [[mx - 110, my + 70], [mx - 240, my + 40]], COL.orange, 8);
};

export const ic_animalsVertebrateGroupsL4 = cards("sci.animals.vertebrate-groups.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3, e3s0, e3s1, e3s2, e3s3,
  fE1, fE2, fE3, fA2, tFrog, tFox, tPython, tBat,
]);
