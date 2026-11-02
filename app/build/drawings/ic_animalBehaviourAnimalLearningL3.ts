import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, SH, WHITE, arrow, cards, ell, ground, hand, line, polyP, rrect, shade, shadow, shape, shine, person, write } from "./flatKit";

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

const PAPER_BLUE = COL.sky;
const mango = (c: Ctx, x: number, y: number, r: number) => {
  line(c, [[x, y - r * 0.9], [x + 4, y - r * 1.6]], 6, COL.leafDk);
  shape(c, () => ell(c, x, y, r * 0.8, r, 0.3), COL.yellow, 5);
  shade(c, () => ell(c, x, y, r * 0.8, r, 0.3), COL.orange, r * 0.3, r * 0.2, 0.6);
};
const stick = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w = 14) => { line(c, [[x0, y0], [x1, y1]], w + 8, INK); line(c, [[x0, y0], [x1, y1]], w, COL.brown); };
const phone = (c: Ctx, x: number, y: number, rot: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -16, -32, 32, 64, 8), col, 5);
  shape(c, () => rrect(c, -9, -22, 18, 30, 3), "#cfe6f3", 3);
  c.restore();
};

// key: expl.0  (turtle by moonlight | dog and milk van)
const expl0 = (c: Ctx) => {
  c.fillStyle = "#2f3a6b"; c.fillRect(0, 0, 540, 1080);
  c.fillStyle = COL.sky; c.fillRect(540, 0, 540, 1080);
  // left: night beach
  shape(c, () => ell(c, 400, 200, 80, 80), "#fff3c4", 6);
  shape(c, () => ell(c, 430, 180, 70, 70), "#2f3a6b", 0);
  c.fillStyle = "#e6cf9a"; c.fillRect(0, 560, 540, 520); c.fillStyle = COL.waterDk; c.fillRect(0, 380, 540, 180);
  line(c, [[0, 380], [540, 380]], 5); line(c, [[0, 560], [540, 560]], 5);
  for (const [x, y] of [[60, 430], [200, 480], [350, 440], [450, 510]]) line(c, [[x, y], [x + 50, y]], 7, COL.drop);
  // turtle (seen from above) heading up toward the sea
  const tx = 270, ty = 810;
  shadow(c, tx + 16, ty + 30, 150, 130);
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const big = sy < 0; shape(c, () => ell(c, tx + sx * 120, ty + sy * 70, big ? 80 : 45, big ? 28 : 22, sx * sy * -0.6 + (big ? 0 : 0)), COL.green, 6);
  }
  shape(c, () => ell(c, tx, ty - 130, 38, 46), COL.green, 6);
  shape(c, () => ell(c, tx, ty, 105, 125), COL.greenDk, 6);
  shade(c, () => ell(c, tx, ty, 105, 125), "#2c4f1a", 30, 30, 0.5);
  line(c, [[tx - 55, ty - 60], [tx + 55, ty - 60]], 4, COL.green); line(c, [[tx - 70, ty + 20], [tx + 70, ty + 20]], 4, COL.green); line(c, [[tx, ty - 100], [tx, ty + 100]], 4, COL.green);
  shape(c, () => ell(c, tx - 14, ty - 138, 5, 6), INK, 0); shape(c, () => ell(c, tx + 14, ty - 138, 5, 6), INK, 0);
  arrow(c, [[tx, 640], [tx, 520], [tx, 450]], RED, 14);
  // divider
  c.fillStyle = INK; c.fillRect(536, 0, 8, 1080);
  // right: gate, milk van, dog
  c.fillStyle = "#cfd6b0"; c.fillRect(540, 600, 540, 480); line(c, [[540, 600], [1080, 600]], 5);
  shape(c, () => rrect(c, 580, 250, 150, 360, 10), COL.blueDk); shape(c, () => rrect(c, 745, 250, 150, 360, 10), COL.blue);
  for (let i = 0; i < 4; i++) { line(c, [[600 + i * 36, 270], [600 + i * 36, 590]], 5, INK); line(c, [[765 + i * 36, 270], [765 + i * 36, 590]], 5, INK); }
  shadow(c, 960, 660, 150, 22);
  shape(c, () => rrect(c, 880, 520, 190, 130, 18), WHITE, 6);
  shape(c, () => rrect(c, 880, 540, 70, 60, 8), COL.sky, 5);
  shape(c, () => rrect(c, 985, 556, 54, 70, 8), COL.blue, 5); shape(c, () => ell(c, 1012, 580, 14, 20), WHITE, 3);
  for (const wx of [915, 1035]) shape(c, () => ell(c, wx, 652, 24, 24), INK, 0);
  // dog running to the gate
  const dx = 760, dy = 880;
  shadow(c, dx + 10, dy + 80, 130, 18);
  shape(c, () => ell(c, dx, dy, 100, 52), COL.brown, 6);
  shade(c, () => ell(c, dx, dy, 100, 52), COL.soilDk, 14, 22, 0.5);
  shape(c, () => ell(c, dx - 100, dy - 40, 42, 36), COL.brown, 6);
  shape(c, () => polyP(c, [[dx - 124, dy - 66], [dx - 150, dy - 20], [dx - 112, dy - 30]]), COL.soil, 5);
  shape(c, () => ell(c, dx - 132, dy - 30, 20, 14), COL.soilDk, 4); shape(c, () => ell(c, dx - 98, dy - 48, 5, 6), INK, 0);
  line(c, [[dx - 60, dy + 30], [dx - 100, dy + 80]], 16, INK); line(c, [[dx - 60, dy + 30], [dx - 100, dy + 80]], 8, COL.brown);
  line(c, [[dx + 60, dy + 30], [dx + 110, dy + 72]], 16, INK); line(c, [[dx + 60, dy + 30], [dx + 110, dy + 72]], 8, COL.brown);
  line(c, [[dx + 96, dy - 10], [dx + 140, dy - 50], [dx + 150, dy - 90]], 14, INK); line(c, [[dx + 96, dy - 10], [dx + 140, dy - 50], [dx + 150, dy - 90]], 7, COL.brown);
  arrow(c, [[dx - 40, 780], [700, 720], [650, 700]], RED, 12);
};

// key: term.5  (imitation: the girl copies her mother on the phone)
const term5 = (c: Ctx) => {
  ground(c); c.fillStyle = TABLE; c.fillRect(0, 780, 1080, 300); line(c, [[0, 780], [1080, 780]], 5);
  person(c, 360, 960, 820, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [-0.35, -2.4] });
  phone(c, 450, 262, 0.2, COL.black);
  person(c, 700, 1010, 640, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [-0.35, -2.4] });
  phone(c, 764, 376, 0.2, COL.pink);
};

// key: term.6  (emulation: same goal, two different ways)
const term6 = (c: Ctx) => {
  ground(c); c.fillStyle = "#cfe3a8"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 5);
  shape(c, () => rrect(c, 505, 300, 70, 520, 12), COL.soil); shade(c, () => rrect(c, 505, 300, 70, 520, 12), COL.soilDk, 22, 0, 0.6);
  shape(c, () => ell(c, 540, 190, 330, 170), COL.leaf); shade(c, () => ell(c, 540, 190, 330, 170), COL.leafDk, 40, 40, 0.5);
  line(c, [[300, 340], [780, 340]], 8, INK);
  mango(c, 290, 320, 42); mango(c, 800, 320, 42);
  person(c, 160, 1000, 620, { armL: [-1.9, -1.4], armR: [-1.1, -1.5] });
  stick(c, 250, 560, 292, 345);
  shape(c, () => rrect(c, 720, 860, 190, 130, 12), COL.wood); shade(c, () => rrect(c, 720, 860, 190, 130, 12), COL.woodDk, 14, 0, 0.6);
  person(c, 815, 860, 540, { armL: [-1.2, -1.6], armR: [-1.3, -1.6] });
};

// key: term.7  (overimitation: three taps that do nothing)
const term7 = (c: Ctx) => {
  scene(c, 360);
  // jar with a sweet in it
  shadow(c, 560, 880, 230, 40);
  shape(c, () => rrect(c, 380, 520, 360, 360, 40), "rgba(214,236,250,0.55)", 6);
  shine(c, [[420, 580], [420, 800]], 9);
  toffee(c, 560, 830, 46);
  shape(c, () => rrect(c, 365, 470, 390, 70, 16), COL.teal, 6);
  shade(c, () => rrect(c, 365, 470, 390, 70, 16), COL.tealDk, 12, 12, 0.6);
  spoon(c, 540, 270, 1.3, 260);
  for (let i = 0; i < 3; i++) { const x = 800 + i * 0, y = 430 + i * 0; void x; void y; }
  for (const dxm of [-90, 0, 90]) line(c, [[560 + dxm, 440], [560 + dxm * 1.15, 400]], 9, INK);
  hand(c, 470, 130, 0.6, 1.5, SKIN.child, CLOTH.child);
};

// key: flow.e1  (tap, then open: the tap does nothing)
const flowE1 = (c: Ctx) => {
  scene(c, 380);
  clearBox(c, 40, 800, 400, 250, false);
  spoon(c, 250, 380, 1.6, 210);
  for (const a of [-2.7, -0.4]) line(c, [[250 + Math.cos(a) * 110, 400 + Math.sin(a) * 60], [250 + Math.cos(a) * 160, 400 + Math.sin(a) * 90]], 8, INK);
  arrow(c, [[500, 640], [560, 600], [610, 640]], RED, 12);
  clearBox(c, 570, 800, 360, 240, true);
};

// key: flow.e2  (pass it on: one way of opening, shown down a line of three people)
const flowE2 = (c: Ctx) => {
  scene(c, 360);
  const xs = [190, 540, 890];
  person(c, xs[0], 700, 560, { adult: true, armR: [0.3, -0.6] });
  person(c, xs[1], 700, 480, { armR: [0.3, -0.6] });
  person(c, xs[2], 700, 480, {});
  for (const bx of xs) shoebox(c, bx - 95, 960, 190, 105, true, false);
  arrow(c, [[300, 560], [380, 540], [430, 560]], RED, 12);
  arrow(c, [[650, 560], [730, 540], [780, 560]], RED, 12);
};

// key: flow.a1  (a list of things you can do, and who taught you)
const flowA1 = (c: Ctx) => {
  scene(c, 300);
  shadow(c, 520, 900, 380, 60);
  shape(c, () => rrect(c, 150, 220, 700, 740, 14), COL.paper, 6);
  for (let i = 0; i < 3; i++) {
    const y = 360 + i * 210;
    line(c, [[420, y + 40], [790, y + 40]], 5, COL.sky);
    if (i === 0) { shape(c, () => ell(c, 260, y, 56, 56), COL.red); line(c, [[210, y], [310, y]], 5, WHITE); }
    if (i === 1) { shape(c, () => ell(c, 260, y - 6, 42, 30), COL.steel); line(c, [[290, y + 10], [380, y + 36]], 14, INK); line(c, [[290, y + 10], [380, y + 36]], 7, COL.steel); }
    if (i === 2) { shape(c, () => rrect(c, 200, y - 16, 120, 32, 8), COL.yellow); shape(c, () => polyP(c, [[320, y - 16], [350, y], [320, y + 16]]), COL.wood, 4); }
    line(c, [[470, y + 10], [490, y - 12], [530, y + 22], [570, y - 10]], 6, INK);
  }
  writer(c, 900, 560, 3.9, 640, 790, 1.5);
};

// key: flow.a2  (five names you know, one you do not)
const flowA2 = (c: Ctx) => {
  scene(c, 300);
  const y = 560;
  shadow(c, 220, y + 160, 150, 20); // spoon
  spoon(c, 120, y + 30, 0.9, 240);
  // comb
  shape(c, () => rrect(c, 330, y - 70, 130, 36, 8), COL.pink); for (let i = 0; i < 6; i++) line(c, [[345 + i * 21, y - 34], [345 + i * 21, y + 10]], 6, INK);
  pencil(c, 520, y + 100, 620, y - 80);
  // cup
  shadow(c, 770, y + 80, 70, 14);
  shape(c, () => polyP(c, [[710, y - 60], [830, y - 60], [815, y + 60], [725, y + 60]]), COL.blue); line(c, [[830, y - 30], [870, y - 20], [870, y + 15], [820, y + 20]], 9);
  // key
  shape(c, () => ell(c, 330, y + 250, 30, 30), COL.yellow); line(c, [[355, y + 250], [470, y + 250]], 16, INK); line(c, [[355, y + 250], [470, y + 250]], 8, COL.yellow);
  line(c, [[430, y + 250], [430, y + 285]], 10, INK);
  // the odd one: a spiky gadget
  shadow(c, 760, y + 330, 120, 24);
  shape(c, () => polyP(c, [[640, y + 260], [700, y + 190], [760, y + 220], [820, y + 180], [880, y + 250], [830, y + 330], [700, y + 340]]), COL.purple);
  shade(c, () => polyP(c, [[640, y + 260], [700, y + 190], [760, y + 220], [820, y + 180], [880, y + 250], [830, y + 330], [700, y + 340]]), "#5f46a0", 20, 20, 0.5);
  shape(c, () => ell(c, 760, y + 270, 22, 22), WHITE, 4);
  hand(c, 960, 340, 2.3, 1.3, SKIN.child, CLOTH.child, true);
};

// key: flow.c1  (a shoebox with two doors, handles, scissors, tape)
const flowC1 = (c: Ctx) => {
  scene(c, 340);
  shoebox(c, 70, 800, 620, 340, false, false);
  // bottle-cap handles
  shape(c, () => ell(c, 440, 780 - 340 + 26, 24, 24), COL.red, 5);
  shape(c, () => ell(c, 380, 800 - 340 * 0.85 + 26 + 0, 0, 0), COL.red, 0);
  shape(c, () => ell(c, 380 + 0, 650, 26, 26), COL.red, 5);
  // scissors
  shadow(c, 880, 800, 90, 20);
  line(c, [[800, 600], [940, 760]], 18, INK); line(c, [[800, 600], [940, 760]], 8, COL.steel);
  line(c, [[940, 600], [800, 760]], 18, INK); line(c, [[940, 600], [800, 760]], 8, COL.steel);
  shape(c, () => ell(c, 790, 790, 36, 28), COL.orange, 6); shape(c, () => ell(c, 950, 790, 36, 28), COL.orange, 6);
  // tape roll
  shadow(c, 860, 960, 110, 24);
  shape(c, () => ell(c, 860, 930, 110, 70), COL.yellow, 6); shape(c, () => ell(c, 860, 930, 50, 32), BG, 5);
};

export const ic_animalBehaviourAnimalLearningL3 = cards("sci.animal-behaviour.animal-learning.L3 cards", [expl0, term5, term6, term7, flowE1, flowE2, flowA1, flowA2, flowC1]);
