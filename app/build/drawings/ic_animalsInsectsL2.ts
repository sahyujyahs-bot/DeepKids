import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, arrow, cards, ell, ground, line, person, polyP, rnd, rrect, shade, shadow, shape, shine } from "./flatKit";

// INSECTS L2 · picture cards. Flat DeepKids look. Animals seen from above, nose to the left:
// ant 6 legs and 3 body parts, spider 8 legs and 2 body parts. Red = arrows and rings; no words.
const ANT = "#8a3f2c", ANT_DK = "#5c2618", SPI = "#7a6252", SPI_DK = "#4f3d31", DOUGH = "#f1d9a8", DOUGH_DK = "#d6b77c", STICK = "#b98a4a";
const ring = (c: Ctx, x: number, y: number, rx: number, ry: number, w: number, rot = 0) => { c.beginPath(); ell(c, x, y, rx, ry, rot); c.strokeStyle = RED; c.lineWidth = w; c.stroke(); };
const lg = (c: Ctx, pts: number[][], col: string, w = 11) => { line(c, pts, w, INK); line(c, pts, w - 6, col); };
const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 3); shape(c, () => ell(c, x - r * 0.15, y, r * 0.45, r * 0.45), INK, 0); };
type Bug = { col?: string; dk?: string; leg?: string; hl?: "feel" | "head" | "thorax" | "abdomen" };

const ant = (c: Ctx, x: number, y: number, s: number, o: Bug = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const col = o.col ?? ANT, dk = o.dk ?? ANT_DK, lc = o.leg ?? col;
  const L = [[-14, -50, -92, -68], [2, 0, 95, 4], [18, 42, 85, 76]];
  for (const sg of [-1, 1]) L.forEach(([ax, kx, fy, fx]) => lg(c, [[ax, sg * 10], [ax + kx, sg * 52], [ax + fx - 4, sg * Math.abs(fy)]], lc));
  lg(c, [[-70, -8], [-102, -40], [-136, -34]], lc, 10); lg(c, [[-70, 8], [-102, 40], [-136, 34]], lc, 10);
  shape(c, () => ell(c, 86, 0, 46, 31), col); shade(c, () => ell(c, 86, 0, 46, 31), dk, 12, 10);
  shape(c, () => ell(c, 4, 0, 28, 20), col); shade(c, () => ell(c, 4, 0, 28, 20), dk, 8, 7);
  shape(c, () => ell(c, -52, 0, 26, 23), col); shade(c, () => ell(c, -52, 0, 26, 23), dk, 8, 7);
  eye(c, -60, -11, 6); eye(c, -60, 11, 6);
  const w = 9 / s;
  if (o.hl === "feel") { ring(c, -112, -36, 36, 22, w, -0.4); ring(c, -112, 36, 36, 22, w, 0.4); }
  if (o.hl === "head") ring(c, -52, 0, 40, 36, w);
  if (o.hl === "thorax") ring(c, 4, 0, 42, 34, w);
  if (o.hl === "abdomen") ring(c, 86, 0, 60, 44, w);
  c.restore();
};
const spider = (c: Ctx, x: number, y: number, s: number, o: Bug = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const col = o.col ?? SPI, dk = o.dk ?? SPI_DK, lc = o.leg ?? col;
  const A = [[-42, -88, -70, -128, -48], [-32, -62, -82, -80, -122], [-22, -10, -84, 20, -124], [-12, 30, -70, 82, -94]];
  for (const sg of [-1, 1]) A.forEach(([ax, kx, ky, fx, fy]) => lg(c, [[ax, sg * 10], [kx, sg * -ky], [fx, sg * -fy]], lc));
  shape(c, () => ell(c, 52, 0, 54, 44), col); shade(c, () => ell(c, 52, 0, 54, 44), dk, 12, 10);
  shape(c, () => ell(c, -22, 0, 36, 29), col); shade(c, () => ell(c, -22, 0, 36, 29), dk, 9, 8);
  eye(c, -48, -9, 6); eye(c, -48, 9, 6);
  c.restore();
};
const worm = (c: Ctx, x: number, y: number, L: number, th: number) => {
  const top: number[][] = [], bot: number[][] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, yy = Math.sin(t * Math.PI * 2) * 10, h = th * Math.sqrt(Math.min(1, Math.min(t, 1 - t) * 14)); top.push([x + L * t, y + yy - h]); bot.push([x + L * t, y + yy + h]); }
  const path = () => polyP(c, [...top, ...bot.reverse()]);
  shape(c, path, "#e8a09a", 6); shade(c, path, "#c9726c", 0, 10, 0.5);
  for (let k = 1; k < 12; k++) { const t = k / 12, yy = Math.sin(t * Math.PI * 2) * 10, h = th * 0.9; line(c, [[x + L * t, y + yy - h], [x + L * t + 5, y + yy], [x + L * t, y + yy + h]], 3, "#c9726c"); }
};
// a biscuit crumb: uneven brown lump with dots
const crumb = (c: Ctx, x: number, y: number, r: number, seed = 3) => {
  const rr = rnd(seed), pts: number[][] = [];
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, d = r * (0.8 + rr() * 0.25); pts.push([x + Math.cos(a) * d, y + Math.sin(a) * d * 0.85]); }
  shadow(c, x + r * 0.15, y + r * 0.7, r * 0.95, r * 0.22);
  const path = () => polyP(c, pts); shape(c, path, "#e3b46a", Math.max(4, r * 0.07)); shade(c, path, "#c58f45", r * 0.2, r * 0.2, 0.55);
  for (let i = 0; i < 5; i++) shape(c, () => ell(c, x + (rr() - 0.5) * r, y + (rr() - 0.5) * r * 0.8, r * 0.06, r * 0.06), "#9a6a2e", 0);
};

// term.1 antennae: the two feelers ringed
const t1 = (c: Ctx) => { ground(c); shadow(c, 560, 780, 400, 50); ant(c, 590, 520, 3, { hl: "feel" }); };
// term.2 thorax: the middle part ringed, the legs grow from it
const t2 = (c: Ctx) => { ground(c); shadow(c, 560, 780, 400, 50); ant(c, 540, 520, 3, { hl: "thorax" }); };
// term.3 abdomen: the back part ringed
const t3 = (c: Ctx) => { ground(c); shadow(c, 560, 780, 400, 50); ant(c, 540, 520, 3, { hl: "abdomen" }); };

// e1: an ant carries a crumb; four crumbs of growing size below
const e1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 540, 400, 40); crumb(c, 360, 330, 80, 5); ant(c, 640, 330, 2);
  arrow(c, [[420, 80], [250, 80]]);
  [[150, 830, 32], [330, 830, 50], [580, 830, 75], [860, 830, 115]].forEach(([x, y, r], i) => crumb(c, x, y, r, 11 + i));
};

// a1: a child with a magnifier looks at an ant; a spider and a worm nearby
const a1 = (c: Ctx) => {
  ground(c);
  person(c, 190, 960, 780, { armR: [0.05, -0.35], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  // wrist is near (190+86+..); magnifier handle drawn from there
  const wx = 190 + 86 + Math.cos(0.05) * 133 + Math.cos(-0.35) * 125, wy = 960 - 577 + 23 + Math.sin(0.05) * 133 + Math.sin(-0.35) * 125;
  line(c, [[wx, wy], [wx + 90, wy - 60]], 22, INK); line(c, [[wx, wy], [wx + 90, wy - 60]], 12, COL.woodDk);
  shape(c, () => ell(c, wx, wy, 26, 26), SKIN.child, 5);
  const lx = wx + 190, ly = wy - 130;
  ant(c, lx, ly, 0.6);
  shape(c, () => ell(c, lx, ly, 120, 120), "rgba(214,236,250,0.35)", 12); shine(c, [[lx - 80, ly - 40], [lx - 40, ly - 85]], 9);
  spider(c, 800, 700, 0.9); worm(c, 480, 860, 320, 24);
};

// a2: a dough ant (3 parts, 6 sticks) above a dough spider (2 parts, 8 sticks)
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 490, 330, 50); ant(c, 540, 300, 1.65, { col: DOUGH, dk: DOUGH_DK, leg: STICK });
  shadow(c, 560, 940, 300, 40); spider(c, 540, 770, 1.35, { col: DOUGH, dk: DOUGH_DK, leg: STICK });
};

// a3: a child's outline on newspaper, a crumb bigger than its head, and an ant
const a3 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[70, 60], [1010, 60], [1010, 1020], [70, 1020]]), "#f3efe4", 6);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) line(c, [[640, 130 + r * 28 + k * 150 + (r > 1 ? 10 : 0)], [960, 130 + r * 28 + k * 150]], 7, "#cfc8b6");
  const body = (w: number, col: string) => {
    c.beginPath(); c.arc(250, 260, 82 + (w - 22) / 2 * 0, 0, Math.PI * 2);
  };
  void body;
  const part = (pts: number[][], w: number) => { line(c, pts, w + 12, INK); line(c, pts, w, "#f3efe4"); };
  c.beginPath(); c.arc(320, 270, 94, 0, Math.PI * 2); c.fillStyle = INK; c.fill(); c.beginPath(); c.arc(320, 270, 82, 0, Math.PI * 2); c.fillStyle = "#f3efe4"; c.fill();
  part([[320, 350], [320, 640]], 150); part([[260, 400], [210, 640]], 56); part([[380, 400], [430, 640]], 56);
  part([[285, 660], [270, 930]], 66); part([[355, 660], [370, 930]], 66);
  // redo the inside of the figure to hide inner seams
  c.beginPath(); c.arc(320, 270, 82, 0, Math.PI * 2); c.fillStyle = "#f3efe4"; c.fill();
  line(c, [[320, 350], [320, 640]], 150, "#f3efe4");
  crumb(c, 690, 330, 100, 9); ant(c, 760, 620, 1.1);
  arrow(c, [[560, 330], [450, 330]], RED, 9);
};

// p1: a window, an ant on the sill, a spider and its web in the corner, a butterfly outside, five day boxes
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 170, 70, 740, 560, 14), "#bfe0f5", 8);
  line(c, [[540, 70], [540, 630]], 12); line(c, [[170, 350], [910, 350]], 12);
  shape(c, () => rrect(c, 130, 630, 820, 56, 12), COL.wood, 7);
  // web in the top-left pane corner and a spider
  for (const [x, y] of [[230, 200], [300, 150], [380, 110], [470, 85], [500, 135], [500, 200], [500, 280]]) line(c, [[180, 80], [x, y]], 3, "#ffffff");
  for (const k of [0.4, 0.65, 0.9]) { const pts: number[][] = [[180 + 320 * k, 80], [180 + 320 * k * 0.9, 80 + 70 * k], [180 + 320 * k * 0.55, 80 + 190 * k], [180, 80 + 280 * k]].slice(0, 4); line(c, pts, 3, "#ffffff"); }
  spider(c, 330, 190, 0.45);
  // butterfly outside: two big wing pairs
  const bx = 730, by = 220;
  shape(c, () => ell(c, bx - 60, by - 30, 60, 38, -0.5), COL.orange, 5); shape(c, () => ell(c, bx + 60, by - 30, 60, 38, 0.5), COL.orange, 5);
  shape(c, () => ell(c, bx - 45, by + 35, 42, 28, 0.5), COL.yellow, 5); shape(c, () => ell(c, bx + 45, by + 35, 42, 28, -0.5), COL.yellow, 5);
  shape(c, () => ell(c, bx, by, 9, 48), INK, 0);
  line(c, [[bx, by - 44], [bx - 22, by - 90]], 4); line(c, [[bx, by - 44], [bx + 22, by - 90]], 4);
  ant(c, 700, 600, 0.5);
  // five day boxes with a tick each
  for (let i = 0; i < 5; i++) { const x = 130 + i * 168; shape(c, () => rrect(c, x, 770, 140, 140, 18), COL.paper, 6); line(c, [[x + 38, 845], [x + 64, 875], [x + 108, 805]], 11, COL.leafDk); }
};

// expl.3: an ant carrying a crumb as big as her own head, a red arrow ahead
const x3 = (c: Ctx) => {
  ground(c);
  shadow(c, 580, 780, 400, 40);
  crumb(c, 330, 540, 100, 21); ant(c, 640, 540, 2.2);
  arrow(c, [[420, 250], [250, 250]], RED, 11);
};

// expl.4: a bee between a blue and a yellow flower, feelers out, choosing the yellow one
const flower = (c: Ctx, x: number, y: number, col: string, dk: string) => {
  line(c, [[x, y], [x, 1000]], 16, INK); line(c, [[x, y], [x, 1000]], 8, COL.leaf);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 80, y + Math.sin(a) * 80, 52, 36, a), col, 6); }
  shape(c, () => ell(c, x, y, 40, 40), dk, 6);
};
const bee = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(-s, s);
  for (const sg of [-1, 1]) { const L = [[-20, -40, -30], [0, 0, 10], [20, 40, 36]]; L.forEach(([ax, kx, fx]) => lg(c, [[ax, sg * 14], [kx, sg * 54], [fx, sg * 76]], INK, 9)); }
  for (const sg of [-1, 1]) shape(c, () => ell(c, 20, sg * 70, 78, 36, sg * -0.5), "rgba(214,236,250,0.75)", 5);
  shape(c, () => ell(c, 80, 0, 62, 40), COL.yellow); for (const dx of [60, 95]) line(c, [[dx, -36], [dx, 36]], 14, INK);
  shape(c, () => ell(c, 0, 0, 38, 32), COL.orange); shade(c, () => ell(c, 0, 0, 38, 32), "#d27c25", 8, 8);
  shape(c, () => ell(c, -50, 0, 26, 24), INK, 0); eye(c, -58, -10, 6); eye(c, -58, 10, 6);
  lg(c, [[-66, -8], [-100, -34], [-130, -30]], INK, 9); lg(c, [[-66, 8], [-100, 34], [-130, 30]], INK, 9);
  c.restore();
};
const x4 = (c: Ctx) => {
  ground(c);
  flower(c, 170, 640, COL.blue, COL.yellow); flower(c, 910, 640, COL.yellow, COL.orange);
  shadow(c, 560, 540, 160, 30); bee(c, 540, 440, 1.2);
  arrow(c, [[700, 300], [800, 380]], RED, 11);
};

export const ic_animalsInsectsL2 = cards("sci.animals.insects.L2 cards", [t1, t2, t3, e1, a1, a2, a3, p1, x3, x4]);
