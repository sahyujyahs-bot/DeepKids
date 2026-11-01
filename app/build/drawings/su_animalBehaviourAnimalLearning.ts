import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, SH, WHITE, arrow, cards, ell, ground, hand, line, polyP, rrect, shade, shadow, shape, shine } from "./flatKit";

// ANIMAL LEARNING L3 · six set-up cards. E1: a clear box with a toffee, a spoon, tap the lid, open it, write.
// E2: a shoebox with a flap on top and a flap on the side, show it one way, pass it on, write.
// Same objects on every card of an experiment; hands (child orange sleeve, adult blue sleeve) do the action.

const TABLE = "#ecd3a1", TABLE_DK = "#d9b87c";
const CB = { front: "#cf9f68", top: "#e6bf8a", side: "#ad7f4c", inner: "#4a3326", innerLt: "#6b4a35" };

const scene = (c: Ctx, horizon = 330) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, horizon, 1080, 1080 - horizon);
  c.fillStyle = TABLE_DK; c.fillRect(0, horizon, 1080, 10);
  line(c, [[0, horizon], [1080, horizon]], 5);
};

// a wrapped toffee: red wrapper, pale stripe, twisted pink ends
const toffee = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + r * 0.55, r * 1.3, r * 0.22);
  for (const s of [-1, 1]) shape(c, () => polyP(c, [[x + s * r * 0.85, y], [x + s * r * 1.7, y - r * 0.55], [x + s * r * 1.7, y + r * 0.55]]), COL.pink, Math.max(3, r * 0.1));
  shape(c, () => ell(c, x, y, r, r * 0.62), COL.red, Math.max(3.5, r * 0.12));
  shade(c, () => ell(c, x, y, r, r * 0.62), "#b93a27", r * 0.3, r * 0.2, 0.6);
  line(c, [[x - r * 0.45, y - r * 0.28], [x + r * 0.2, y - r * 0.38]], Math.max(3, r * 0.12), "#fff3d6");
};

// a steel spoon: bowl centre at (bx, by); the handle runs from the bowl at angle ang for len px
const spoon = (c: Ctx, bx: number, by: number, ang: number, len: number, sh = true) => {
  if (sh) { c.save(); c.translate(bx + 14, by + 16); c.rotate(ang); c.beginPath(); c.moveTo(0, 0); c.lineTo(len, 0); c.strokeStyle = SH; c.lineWidth = 30; c.lineCap = "round"; c.stroke(); c.restore(); }
  c.save(); c.translate(bx, by); c.rotate(ang);
  const handle = () => polyP(c, [[40, -11], [len, -17], [len, 17], [40, 11]]);
  shape(c, handle, COL.steel, 6);
  shade(c, handle, COL.steelDk, 0, 8, 0.6);
  shape(c, () => ell(c, 0, 0, 66, 46), COL.steel, 6);
  shape(c, () => ell(c, -3, -2, 52, 33), COL.steelIn, 4);
  shade(c, () => ell(c, -3, -2, 52, 33), COL.steelDk, 12, 12, 0.35);
  c.restore();
};

// a clear plastic takeaway box with a toffee on its floor; (x, y) = front bottom left corner
const clearBox = (c: Ctx, x: number, y: number, w: number, h: number, open: boolean, prize = true) => {
  const dx = w * 0.28, dy = -w * 0.2, glassF = "rgba(214,236,250,0.3)";
  shadow(c, x + w / 2 + dx / 2 + 20, y + dy / 2 + 30, w * 0.66, w * 0.13);
  if (open) { // the lid, hinged at the back and swung up
    shape(c, () => polyP(c, [[x + dx, y - h + dy], [x + w + dx, y - h + dy], [x + w + dx + 36, y - h + dy - h * 0.95], [x + dx + 36, y - h + dy - h * 0.95]]), "rgba(214,236,250,0.7)", 6);
    shine(c, [[x + dx + 70, y - h + dy - h * 0.8], [x + dx + 56, y - h + dy - h * 0.2]], 8);
  }
  shape(c, () => polyP(c, [[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]]), "#dfe9f0", 4);
  shape(c, () => polyP(c, [[x + dx, y + dy - h], [x + w + dx, y + dy - h], [x + w + dx, y + dy], [x + dx, y + dy]]), "rgba(255,255,255,0.35)", 4);
  if (prize) toffee(c, x + w * 0.46 + dx * 0.5, y + dy * 0.5 - w * 0.06, w * 0.09);
  shape(c, () => polyP(c, [[x + w, y - h], [x + w + dx, y - h + dy], [x + w + dx, y + dy], [x + w, y]]), glassF, 6);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y], [x, y]]), glassF, 6);
  shine(c, [[x + w * 0.1, y - h * 0.85], [x + w * 0.1, y - h * 0.25]], 9);
  if (!open) {
    shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + dx, y - h + dy], [x + dx, y - h + dy]]), "rgba(235,246,252,0.8)", 6);
    shape(c, () => polyP(c, [[x + w * 0.07 + dx * 0.15, y - h + dy * 0.15], [x + w * 0.93 + dx * 0.15, y - h + dy * 0.15], [x + w * 0.93 + dx * 0.85, y - h + dy * 0.85], [x + w * 0.07 + dx * 0.85, y - h + dy * 0.85]]), "rgba(255,255,255,0.25)", 3);
    shape(c, () => rrect(c, x + w / 2 - 30, y - h - 6, 60, 30, 8), COL.teal, 5);
  } else {
    line(c, [[x, y - h], [x + w, y - h], [x + w + dx, y - h + dy], [x + dx, y - h + dy], [x, y - h]], 6);
  }
};

// a shoebox, cardboard: a flap in the top face (hinged at the back) and a flap in the front face (hinged at the bottom)
// (x, y) = front bottom left corner; tf / sf = top / side flap open or shut
const shoebox = (c: Ctx, x: number, y: number, w: number, h: number, tf: boolean, sf: boolean, prize = true) => {
  const dx = w * 0.3, dy = -w * 0.2;
  const P = (u: number, v: number): number[] => [x + u * w + v * dx, y - h + v * dy];
  shadow(c, x + w / 2 + dx / 2 + 24, y + dy / 2 + 34, w * 0.62, w * 0.12);
  // top flap swung up sits behind everything else
  if (tf) { const a = P(0.2, 0.85), b = P(0.8, 0.85), up = w * 0.2; shape(c, () => polyP(c, [a, b, [b[0] + 18, b[1] - up], [a[0] + 18, a[1] - up]]), CB.top, 6); shade(c, () => polyP(c, [a, b, [b[0] + 18, b[1] - up], [a[0] + 18, a[1] - up]]), CB.side, 14, 0, 0.5); }
  shape(c, () => polyP(c, [[x + w, y - h], [x + w + dx, y - h + dy], [x + w + dx, y + dy], [x + w, y]]), CB.side, 6);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y], [x, y]]), CB.front, 6);
  shade(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y], [x, y]]), CB.side, 16, 12, 0.35);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + dx, y - h + dy], [x + dx, y - h + dy]]), CB.top, 6);
  // top flap: its cut-out
  const tq = [P(0.2, 0.2), P(0.8, 0.2), P(0.8, 0.85), P(0.2, 0.85)];
  if (tf) shape(c, () => polyP(c, tq), CB.inner, 5);
  else { shape(c, () => polyP(c, tq), "#dcb27c", 5); shape(c, () => ell(c, P(0.5, 0.35)[0], P(0.5, 0.35)[1], 22, 8), CB.side, 4); }
  // side flap in the front face
  const fx0 = x + w * 0.3, fx1 = x + w * 0.7, ft = y - h * 0.85, fb = y - h * 0.15;
  if (sf) {
    shape(c, () => polyP(c, [[fx0, ft], [fx1, ft], [fx1, fb], [fx0, fb]]), CB.inner, 5);
    shade(c, () => polyP(c, [[fx0, ft], [fx1, ft], [fx1, fb], [fx0, fb]]), "#000000", 0, 40, 0.0);
    if (prize) toffee(c, (fx0 + fx1) / 2, fb - h * 0.2, w * 0.05);
    const fl = h * 0.5;
    shape(c, () => polyP(c, [[fx0, fb], [fx1, fb], [fx1 - 10, fb + fl], [fx0 + 10, fb + fl]]), CB.top, 6);
    shade(c, () => polyP(c, [[fx0, fb], [fx1, fb], [fx1 - 10, fb + fl], [fx0 + 10, fb + fl]]), CB.side, 14, 0, 0.4);
  } else {
    shape(c, () => polyP(c, [[fx0, ft], [fx1, ft], [fx1, fb], [fx0, fb]]), "#d9ad74", 5);
    shape(c, () => ell(c, (fx0 + fx1) / 2, ft + 26, 24, 9), CB.side, 4);
  }
};

// a pencil from the tail (x0, y0) to the tip (x1, y1)
const pencil = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  const len = Math.hypot(x1 - x0, y1 - y0), an = Math.atan2(y1 - y0, x1 - x0);
  c.save(); c.translate(x0, y0); c.rotate(an);
  shape(c, () => rrect(c, 0, -14, len - 44, 28, 6), COL.yellow, 5);
  shade(c, () => rrect(c, 0, -14, len - 44, 28, 6), COL.orange, 0, 9, 0.55);
  shape(c, () => polyP(c, [[len - 46, -14], [len, 0], [len - 46, 14]]), COL.wood, 5);
  shape(c, () => polyP(c, [[len - 14, -4], [len, 0], [len - 14, 4]]), INK, 3);
  c.restore();
};

// a notebook on the table, centre (cx, cy), rotated; rows of pen strokes on the page
const notebook = (c: Ctx, cx: number, cy: number, w: number, h: number, rot: number, marks = 2) => {
  c.save(); c.translate(cx, cy); c.rotate(rot);
  shadow(c, 18, 24, w * 0.52, h * 0.5);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), COL.paper, 6);
  shape(c, () => rrect(c, -w / 2, -h / 2, w * 0.1, h, 8), COL.teal, 6);
  for (let i = 0; i < 6; i++) line(c, [[-w * 0.36, -h * 0.34 + i * h * 0.13], [w * 0.44, -h * 0.34 + i * h * 0.13]], 3, COL.sky);
  for (let i = 0; i < marks; i++) { const yy = -h * 0.34 + i * h * 0.26; line(c, [[-w * 0.3, yy], [-w * 0.2, yy - 14], [-w * 0.1, yy + 8], [w * 0.02, yy - 12], [w * 0.14, yy + 6]], 6, INK); }
  c.restore();
};

// a child's hand writing in the notebook: pencil tip at (tx, ty), hand coming from the angle an
const writer = (c: Ctx, wx: number, wy: number, an: number, tx: number, ty: number, s: number) => {
  const gx = wx + Math.cos(an) * 70 * s, gy = wy + Math.sin(an) * 70 * s;
  pencil(c, gx - Math.cos(an) * 30, gy - Math.sin(an) * 30, tx, ty);
  hand(c, wx, wy, an, s, SKIN.child, CLOTH.child);
};

// key: setup.e1.0
const e1s0 = (c: Ctx) => {
  scene(c);
  clearBox(c, 90, 780, 540, 340, false);
  spoon(c, 860, 900, -1.1, 230);
};

// key: setup.e1.1  (tap the closed lid with the spoon, twice)
const e1s1 = (c: Ctx) => {
  scene(c);
  clearBox(c, 150, 990, 520, 290, false);
  spoon(c, 483, 648, -1.25, 360);
  hand(c, 610, 265, 1.89, 2.2, SKIN.child, CLOTH.child);
  for (const a of [-2.6, -1.57 - 1.2, -0.5, 0.2]) { const cx = 483 + Math.cos(a) * 100, cy = 648 + Math.sin(a) * 70, ex = 483 + Math.cos(a) * 150, ey = 648 + Math.sin(a) * 105; line(c, [[cx, cy], [ex, ey]], 8, INK); }
  arrow(c, [[300, 330], [330, 440], [345, 540]], RED, 12);
};

// key: setup.e1.2  (lift the lid, take the prize out: box now empty, the toffee in the hand)
const e1s2 = (c: Ctx) => {
  scene(c);
  clearBox(c, 50, 900, 480, 280, true, false);
  hand(c, 930, 500, Math.PI, 1.7, SKIN.child, CLOTH.child);
  toffee(c, 930 - 100 * 1.7, 500, 48);
  arrow(c, [[400, 740], [520, 600], [640, 505]], RED, 12);
};

// key: setup.e2.0
const e2s0 = (c: Ctx) => {
  scene(c, 360);
  shoebox(c, 130, 780, 600, 330, true, true);
};

// key: setup.e2.1
const e2s1 = (c: Ctx) => {
  scene(c, 360);
  shoebox(c, 130, 700, 600, 330, false, true);
  hand(c, 589, 777, 2.95, 2.2, SKIN.child, CLOTH.child);
  arrow(c, [[250, 700], [250, 790], [250, 840]], RED, 11);
};

// key: setup.e2.2  (the side door is open and empty; a hand holds the prize it took out; the child writes the door)
const e2s2 = (c: Ctx) => {
  scene(c, 300);
  shoebox(c, 430, 560, 420, 230, false, true, false);
  notebook(c, 280, 890, 320, 290, -0.08, 2);
  writer(c, 85, 556, 0.95, 260, 800, 1.7);
  hand(c, 925, 600, Math.PI, 1.8, SKIN.adult, CLOTH.adult);
  toffee(c, 925 - 84 * 1.8, 600, 46);
  arrow(c, [[690, 440], [740, 505], [768, 545]], RED, 12);
};

export const su_animalBehaviourAnimalLearning = cards("sci.animal-behaviour.animal-learning.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2]);
