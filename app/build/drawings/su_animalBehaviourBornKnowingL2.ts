import type { Ctx } from "./core";
import { ground, shape, ell, rrect, shadow, shade, line, arrow, write, hand, cards, INK, RED, WHITE, COL, SKIN, CLOTH } from "./flatKit";

// born-knowing L2 · knee-jerk test: the same girl sits on the edge of a bed, side on, lower leg hanging.
const TROUSER = "#6b5a8c";
type Girl = { face: "calm" | "strain"; shinAn?: number; arms: "lap" | "fists" | "hook" };

const bed = (c: Ctx) => {
  shadow(c, 340, 905, 340, 28);
  shape(c, () => rrect(c, 40, 640, 590, 250, 24), COL.purple);
  shade(c, () => rrect(c, 40, 640, 590, 250, 24), "#5f45a3", 40, 40, 0.5);
  shape(c, () => rrect(c, 40, 610, 590, 70, 28), COL.pink);
};

const girl = (c: Ctx, g: Girl) => {
  const kx = 640, ky = 600, an = g.shinAn ?? Math.PI / 2;
  const fx = kx + Math.cos(an) * 270, fy = ky + Math.sin(an) * 270;
  // back of the body: torso
  shape(c, () => rrect(c, 230, 330, 200, 300, 60), CLOTH.child);
  shade(c, () => rrect(c, 230, 330, 200, 300, 60), CLOTH.childDk, 50, 0, 0.7);
  // thigh
  line(c, [[340, 590], [kx, ky]], 100, INK); line(c, [[340, 590], [kx, ky]], 88, TROUSER);
  // shin and foot (bare skin)
  line(c, [[kx, ky], [fx, fy]], 82, INK); line(c, [[kx, ky], [fx, fy]], 70, SKIN.child);
  c.save(); c.translate(fx, fy); c.rotate(an - Math.PI / 2);
  shape(c, () => rrect(c, -34, -10, 130, 56, 26), SKIN.child, 6);
  c.restore();
  shape(c, () => ell(c, kx + 14, ky + 8, 52, 50), TROUSER, 6); // trouser knee (hem just above the kneecap)
  shape(c, () => ell(c, kx + 40, ky + 62, 26, 22), SKIN.childDk, 4); // kneecap, bare skin
  // head, side on but face toward the viewer
  const hx = 340, hy = 215, r = 92;
  shape(c, () => ell(c, hx, hy, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hx - r * 1.02, hy); c.bezierCurveTo(hx - r, hy - r * 1.55, hx + r, hy - r * 1.55, hx + r * 1.02, hy); c.quadraticCurveTo(hx, hy - r * 0.55, hx - r * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx - r * 0.95, hy + r * 0.1, r * 0.32, r * 0.6), CLOTH.hair, 4);
  if (g.face === "calm") {
    // looking away (pupils to the left), relaxed smile
    for (const s of [-1, 1]) { shape(c, () => ell(c, hx + s * 34, hy + 8, 17, 20), WHITE, 4); shape(c, () => ell(c, hx + s * 34 - 8, hy + 8, 8, 10), INK, 0); }
    c.beginPath(); c.arc(hx, hy + 36, 22, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  } else {
    // screwed-up face: tight eyes, frowning brows, gritted mouth
    for (const s of [-1, 1]) { line(c, [[hx + s * 34 - 16, hy + 12], [hx + s * 34 + 16, hy + 12]], 6); line(c, [[hx + s * 34 - s * 18, hy - 22], [hx + s * 34 + s * 14, hy - 8]], 6); }
    shape(c, () => rrect(c, hx - 24, hy + 36, 48, 22, 8), WHITE, 4);
    line(c, [[hx - 24, hy + 47], [hx + 24, hy + 47]], 3);
  }
  // arms
  if (g.arms === "lap") {
    line(c, [[330, 390], [300, 520], [400, 575]], 60, INK); line(c, [[330, 390], [300, 520], [400, 575]], 48, CLOTH.child);
    shape(c, () => ell(c, 425, 580, 30, 26), SKIN.child, 5);
  } else if (g.arms === "fists") {
    line(c, [[330, 390], [290, 520], [390, 570]], 60, INK); line(c, [[330, 390], [290, 520], [390, 570]], 48, CLOTH.child);
    shape(c, () => ell(c, 415, 575, 38, 34), SKIN.child, 6);
    for (const k of [0, 1, 2]) line(c, [[400 + k * 14, 560], [400 + k * 14, 590]], 3, SKIN.childDk);
  } else {
    // forearms meet in front of the chest, fingers hooked
    for (const [ex, ey, hx2, hy2] of [[300, 500, 470, 455], [360, 540, 470, 470]]) { line(c, [[330, 390], [ex, ey], [hx2, hy2]], 56, INK); line(c, [[330, 390], [ex, ey], [hx2, hy2]], 44, CLOTH.child); }
    shape(c, () => ell(c, 478, 448, 36, 30), SKIN.child, 5);
    shape(c, () => ell(c, 478, 482, 36, 30), SKIN.childDk, 5);
    shape(c, () => rrect(c, 495, 428, 52, 22, 11), SKIN.child, 5); shape(c, () => rrect(c, 495, 482, 52, 22, 11), SKIN.child, 5);
    shape(c, () => rrect(c, 449, 438, 52, 22, 11), SKIN.child, 5); shape(c, () => rrect(c, 449, 472, 52, 22, 11), SKIN.child, 5);
  }
};

// the grown-up's hand taps just below the kneecap with its edge
const tap = (c: Ctx, shin = Math.PI / 2) => {
  c.save(); c.translate(0, 1460); c.scale(1, -1);
  hand(c, 815, 730, Math.PI, 1.2, SKIN.adult, CLOTH.adult, true);
  c.restore();
  arrow(c, [[960, 590], [880, 620], [790, 660]], RED, 12);
  void shin;
};

const card0 = (c: Ctx) => { ground(c); bed(c); girl(c, { face: "calm", arms: "lap" }); tap(c); };
const card1 = (c: Ctx) => { ground(c); bed(c); girl(c, { face: "strain", arms: "fists" }); tap(c); };
const card2 = (c: Ctx) => {
  ground(c); bed(c); girl(c, { face: "strain", arms: "hook", shinAn: 0.45 });
  arrow(c, [[520, 395], [570, 395]], RED, 12); arrow(c, [[480, 395], [430, 395]], RED, 12);
  arrow(c, [[760, 860], [870, 840], [950, 780]], RED, 12);
};

// card 3: the results sheet
const face = (c: Ctx, x: number, y: number, kind: number) => {
  if (kind < 2) shape(c, () => ell(c, x, y, 52, 52), SKIN.child, 5);
  if (kind === 0) { for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 18 - 4, y - 6, 6, 8), INK, 0); c.beginPath(); c.arc(x, y + 10, 16, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  else if (kind === 1) { for (const s of [-1, 1]) { line(c, [[x + s * 18 - 9, y - 4], [x + s * 18 + 9, y - 4]], 5); line(c, [[x + s * 18 - s * 10, y - 18], [x + s * 18 + s * 8, y - 12]], 5); } line(c, [[x - 16, y + 20], [x + 16, y + 20]], 5); }
  else {
    for (const [dx, col, a0, a1] of [[-22, SKIN.child, 0.9, Math.PI * 2 - 0.9], [22, SKIN.childDk, Math.PI + 0.9, Math.PI - 0.9 + Math.PI * 2]] as [number, string, number, number][]) { c.beginPath(); c.arc(x + dx, y, 34, a0, a1); c.strokeStyle = INK; c.lineWidth = 28; c.lineCap = "round"; c.stroke(); c.strokeStyle = col; c.lineWidth = 15; c.stroke(); }
  }
};
const card3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 975, 400, 30);
  shape(c, () => rrect(c, 120, 60, 800, 900, 24), COL.paper);
  const rows = [310, 555, 800], top = 118;
  // heading: five kicks, and the swing size
  write(c, "5", 410, top + 5, 56, INK, 8);
  for (const k of [0, 1, 2]) shape(c, () => ell(c, 770 - 36 + k * 36, top + 30, 8 + k * 7, 8 + k * 7), COL.cloth, 4);
  line(c, [[170, 225], [880, 225]], 5);
  for (let i = 0; i < 3; i++) {
    const y = rows[i];
    face(c, 215, y, i);
    for (let k = 0; k < 5; k++) shape(c, () => ell(c, 330 + k * 66, y, 24, 24), WHITE, 5);
    shape(c, () => rrect(c, 690, y - 55, 190, 110, 14), WHITE, 5);
    if (i < 2) line(c, [[170, y + 120], [880, y + 120]], 4, COL.grey);
  }
  line(c, [[640, 100], [640, 900]], 4, COL.grey);
  // pencil
  c.save(); c.translate(900, 900); c.rotate(-0.6);
  shape(c, () => rrect(c, -190, -20, 190, 40, 8), COL.yellow);
  shape(c, () => { c.moveTo(0, -20); c.lineTo(55, 0); c.lineTo(0, 20); c.closePath(); }, COL.wood);
  shape(c, () => { c.moveTo(36, -8); c.lineTo(55, 0); c.lineTo(36, 8); c.closePath(); }, INK, 2);
  shape(c, () => rrect(c, -230, -20, 40, 40, 8), COL.pink);
  c.restore();
};

export const su_animalBehaviourBornKnowingL2 = cards("sci.animal-behaviour.born-knowing.L2 set-up", [card0, card1, card2, card3]);
