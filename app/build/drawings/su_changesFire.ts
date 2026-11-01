import type { Ctx } from "./core";
import { COL, INK, BG, WHITE, RED, SKIN, CLOTH, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, write } from "./flatKit";

// sci.changes.fire.L3 set-up cards (wax and smoke, flame and mesh, wick and oil)
const WAX = "#fff3dc", WAXDK = "#e6d6b4", CLAY = "#c8663a", CLAYDK = "#9c4a28", OIL = "#f6cf55", SMOKE = "#e4e0d8";

// a grown-up's hand pointing left (mirrored), wrist at (x, y)
const handL = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s, SKIN.adult, CLOTH.adult); c.restore();
};
// a flame with its base at (x, y), height h, leaning by lean, width factor wf
const flame = (c: Ctx, x: number, y: number, h: number, lean = 0, wf = 0.32) => {
  const body = (k: number) => () => { c.moveTo(x, y); c.bezierCurveTo(x - h * wf * k, y - h * 0.1 * k, x - h * wf * 0.95 * k, y - h * 0.55 * k, x + lean * k, y - h * k); c.bezierCurveTo(x + h * wf * 0.95 * k, y - h * 0.55 * k, x + h * wf * k, y - h * 0.1 * k, x, y); c.closePath(); };
  shape(c, body(1), COL.orange, 5);
  shape(c, body(0.62), COL.yellow, 0);
  shape(c, body(0.26), COL.blue, 0);
};
// a ribbon of smoke along points, pale with an ink edge
const smoke = (c: Ctx, pts: number[][], w = 30) => {
  const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  p(); c.strokeStyle = INK; c.lineWidth = w + 9; c.stroke();
  p(); c.strokeStyle = SMOKE; c.lineWidth = w; c.stroke();
};
// a candle standing with its base at (x, yb); returns the wick top y
const candle = (c: Ctx, x: number, yb: number, w: number, h: number, lit: boolean, fh = 140) => {
  const top = yb - h, body = () => rrect(c, x - w / 2, top, w, h, 10);
  shadow(c, x + w * 0.2, yb + 4, w * 0.8, w * 0.14);
  shape(c, body, WAX, 6); shade(c, body, WAXDK, w * 0.3, 0, 0.9);
  shape(c, () => ell(c, x, top, w / 2, w * 0.1), "#fffaf0", 5);
  shine(c, [[x - w * 0.3, top + 30], [x - w * 0.3, yb - 40]], 8);
  line(c, [[x, top], [x, top - 36]], 8, INK);
  if (lit) flame(c, x, top - 34, fh);
  return top - 36;
};
const drip = (c: Ctx, x: number, y1: number, y2: number) => {
  line(c, [[x + 5, y1], [x + 5, y2]], 26, "#d9c9a4"); shape(c, () => ell(c, x + 5, y2, 17, 17), "#d9c9a4", 0);
  line(c, [[x, y1], [x, y2]], 24, WHITE); shape(c, () => ell(c, x, y2, 17, 17), WHITE, 0);
};

// ------------------------------------------------ experiment 1: wax, smoke, flame
// the steel plate, the tumbler with a marked card on the left, the candle in the middle
const CX = 580, CYB = 870, WICK0 = 534, CM = 38;
const candleScene = (c: Ctx, lit: boolean) => {
  ground(c);
  plate(c, CX, CYB + 8, 250, 62);
  // card taped to the tumbler, marked 2, 5, 8 cm above the wick
  shape(c, () => rrect(c, 105, 100, 160, 770, 6), WHITE, 6);
  write(c, "cm", 135, 125, 36, INK, 6);
  for (const cm of [2, 5, 8]) {
    const y = WICK0 - cm * CM;
    line(c, [[265, y], [160, y]], 7, INK);
    write(c, String(cm), 120, y - 56, 44, INK, 6);
    c.save(); c.setLineDash([4, 16]); line(c, [[272, y], [CX - 50, y]], 4, "rgba(43,35,64,0.55)"); c.restore();
  }
  glass(c, 185, 870, 220, 260, 0);
  shape(c, () => rrect(c, 95, 620, 180, 44, 5), "rgba(255,211,77,0.8)", 5);
  return candle(c, CX, CYB, 120, 300, lit);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  plate(c, 470, 840, 340, 88);
  shape(c, () => ell(c, 460, 814, 230, 24), "#fbefd0", 5);
  const lump = () => { c.moveTo(290, 805); c.bezierCurveTo(250, 720, 300, 600, 420, 575); c.bezierCurveTo(500, 560, 590, 610, 610, 720); c.bezierCurveTo(620, 780, 600, 812, 570, 814); c.lineTo(320, 814); c.bezierCurveTo(305, 814, 295, 812, 290, 805); c.closePath(); };
  shape(c, lump, WAX, 6); shade(c, lump, WAXDK, 70, 10, 0.9);
  drip(c, 372, 640, 722); drip(c, 540, 665, 712);
  shape(c, () => ell(c, 440, 600, 70, 22, -0.1), "#fffaf0", 4);
  shine(c, [[330, 680], [345, 625], [385, 598]], 14); shine(c, [[345, 730], [335, 715]], 10);
  // the match, its head pressed on top of the wax
  const tip = [462, 574], an = 2.52, dir = [Math.cos(an), Math.sin(an)], gr = [790, 330];
  line(c, [[gr[0] - dir[0] * 40, gr[1] - dir[1] * 40], tip], 24, INK); line(c, [[gr[0] - dir[0] * 40, gr[1] - dir[1] * 40], [tip[0] - dir[0] * -18, tip[1] - dir[1] * -18]], 14, COL.wood);
  shape(c, () => ell(c, tip[0] + 2, tip[1] - 2, 20, 24), COL.red, 5);
  flame(c, tip[0] - 8, tip[1] - 14, 130, -6);
  handL(c, 875, 268, an, 1.6);
};

// setup.e1.1
const e1_1 = (c: Ctx) => { candleScene(c, true); };

// setup.e1.2
const e1_2 = (c: Ctx) => {
  const wick = candleScene(c, false);
  smoke(c, [[CX, wick - 6], [CX + 26, wick - 70], [CX - 20, wick - 150], [CX + 18, wick - 230], [CX - 10, wick - 330]], 34);
  // the match in the smoke at the 5 cm line, a small flame running down the smoke
  const y5 = WICK0 - 5 * CM, an = 3.05, dir = [Math.cos(an), Math.sin(an)], tip = [CX + 10, y5 + 10], gr = [tip[0] - dir[0] * 190, tip[1] - dir[1] * 190];
  line(c, [gr, tip], 24, INK); line(c, [gr, tip], 14, COL.wood);
  shape(c, () => ell(c, tip[0] + 2, tip[1], 18, 18), COL.red, 5);
  flame(c, tip[0], tip[1] - 12, 110);
  flame(c, CX + 4, wick - 76, 90, 0);
  arrow(c, [[CX + 120, y5 + 20], [CX + 120, wick - 20]], RED, 12);
  handL(c, gr[0] + 105, gr[1] - 9, an, 1.5);
};

// ------------------------------------------------ experiment 2: flame and mesh
// a grown-up's hand holding a steel bar (handle) coming from the left at height y
const holdBar = (c: Ctx, x0: number, y0: number, y1: number) => {
  line(c, [[x0, y0], [895, y1]], 34, INK); line(c, [[x0, y0], [895, y1]], 22, COL.steel);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  plate(c, 400, 890, 240, 55);
  const wick = candle(c, 400, 880, 120, 230, false);
  // flame squashed flat under the mesh
  const fl = () => { c.moveTo(400, wick); c.bezierCurveTo(330, wick, 290, wick - 30, 322, wick - 66); c.lineTo(478, wick - 66); c.bezierCurveTo(510, wick - 30, 470, wick, 400, wick); c.closePath(); };
  shape(c, fl, COL.orange, 5); shape(c, () => { c.moveTo(400, wick - 4); c.bezierCurveTo(350, wick - 4, 335, wick - 30, 352, wick - 60); c.lineTo(448, wick - 60); c.bezierCurveTo(465, wick - 30, 450, wick - 4, 400, wick - 4); c.closePath(); }, COL.yellow, 0);
  // smoke rising above the mesh
  smoke(c, [[390, 470], [420, 400], [380, 330], [415, 260], [390, 190]], 32);
  smoke(c, [[450, 480], [470, 420], [445, 370]], 18);
  // the mesh: rim, wire grid, handle
  const my = wick - 80;
  holdBar(c, 580, my + 4, my + 14);
  shape(c, () => ell(c, 400, my, 195, 22), COL.steel, 6);
  c.save(); c.beginPath(); ell(c, 400, my, 176, 14); c.clip(); c.fillStyle = "#f3f6fa"; c.fillRect(200, my - 30, 400, 60);
  for (let x = 215; x < 590; x += 10) line(c, [[x, my - 20], [x, my + 20]], 2, COL.steelDk);
  for (let y = my - 12; y < my + 14; y += 7) line(c, [[200, y], [600, y]], 2, COL.steelDk);
  c.restore(); shape(c, () => ell(c, 400, my, 176, 14), "rgba(0,0,0,0)", 3);
  // folded cloth round the handle, then the hand
  shape(c, () => rrect(c, 690, my - 6, 130, 62, 14), COL.cloth, 6); line(c, [[705, my + 24], [805, my + 24]], 4, COL.grey);
  handL(c, 905, my + 25, Math.PI, 1.4);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  plate(c, 440, 905, 250, 55);
  const wick = candle(c, 440, 895, 120, 200, false);
  flame(c, 440, wick, 110);
  const sy = 470;
  holdBar(c, 640, sy + 10, sy + 20);
  // the spoon bowl: underside, rim, steel inside, holes
  const under = () => { c.moveTo(228, sy); c.bezierCurveTo(250, sy + 120, 630, sy + 120, 652, sy); c.closePath(); };
  shape(c, under, COL.steel, 6); shade(c, under, COL.steelDk, 80, -20, 0.6);
  shape(c, () => ell(c, 440, sy, 212, 72), COL.steel, 6);
  shape(c, () => ell(c, 440, sy + 2, 186, 54), COL.steelIn, 4);
  const holes: number[][] = [[340, sy + 10], [440, sy + 20], [540, sy + 10], [390, sy - 14], [490, sy - 14]];
  holes.forEach(([x, y]) => shape(c, () => ell(c, x, y, 22, 12), COL.orange, 4));
  [[340, 100, -6], [440, 120, 0], [540, 100, 6], [390, 90, -4], [490, 90, 4]].forEach(([x, h, l], i) => flame(c, x, holes[i][1] - 2, h, l, 0.24));
  handL(c, 905, sy + 22, Math.PI, 1.4);
};

// ------------------------------------------------ experiment 3: wicks, oil, time
// a clay diya cut open side-on: lip at y, half width r; oil fills the lower half when oil = true
const diya = (c: Ctx, x: number, y: number, r: number, oil: boolean, burnt = false) => {
  const k = 1.3 * r, rin = r * 0.87, kin = k - r * 0.2;
  const outer = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y + k, x + r, y + k, x + r, y); c.lineTo(x + r * 1.3, y - r * 0.2); c.lineTo(x + r * 0.9, y + r * 0.22); c.lineTo(x - r, y); c.closePath(); };
  const cav = () => { c.moveTo(x - rin, y); c.bezierCurveTo(x - rin, y + kin, x + rin, y + kin, x + rin, y); c.closePath(); };
  const bez = (t: number) => { const u = 1 - t; return [u * u * u * (x - rin) + 3 * u * u * t * (x - rin) + 3 * u * t * t * (x + rin) + t * t * t * (x + rin), u * u * u * y + 3 * u * u * t * (y + kin) + 3 * u * t * t * (y + kin) + t * t * t * y]; };
  shape(c, outer, CLAY, 6); shade(c, outer, CLAYDK, r * 0.2, 0, 0.5);
  shape(c, cav, CLAYDK, 5);
  const w = r * 0.075, a = bez(0.22), b = bez(0.5), d = bez(0.8);
  const wickPts = [[a[0], a[1] - w], [b[0], b[1] - w], [d[0], d[1] - w], [x + r * 1.05, y - r * 0.02], [x + r * 1.3, y - r * 0.2]];
  if (burnt) line(c, [[a[0] + 10, a[1] - 6], [b[0], b[1] - 6], [d[0], d[1] - 6], [x + r * 1.05, y - r * 0.02], [x + r * 1.3, y - r * 0.2]], 12, COL.black);
  else { line(c, wickPts, w * 2 + 8, INK); line(c, wickPts, w * 2, oil ? "#f1e2b0" : COL.paper); }
  if (oil) {
    c.save(); c.beginPath(); cav(); c.clip(); c.globalAlpha = 0.72; c.fillStyle = OIL; c.fillRect(x - r, y + r * 0.34, r * 2, r); c.restore(); c.globalAlpha = 1;
    line(c, [[x - rin + 12, y + r * 0.34], [x + rin * 0.6, y + r * 0.34]], 6, "#fff3b8");
  }
  line(c, [[x - rin, y], [x + rin, y]], 5, INK);
  return [x + r * 1.3, y - r * 0.2];
};
const pair = (c: Ctx, xl: number, xr: number, y: number, r: number, burnt: boolean) => {
  plate(c, xl, y + r, r * 1.5, r * 0.3); plate(c, xr, y + r, r * 1.5, r * 0.3);
  const tl = diya(c, xl, y, r, false, burnt), tr = diya(c, xr, y, r, true);
  return [tl, tr];
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  pair(c, 280, 790, 400, 165, false);
  // ruler lying below
  shadow(c, 540, 962, 440, 18);
  shape(c, () => rrect(c, 110, 830, 860, 110, 8), COL.wood, 6);
  for (let mm = 0; mm <= 90; mm++) { const x = 150 + mm * 8.9, h = mm % 10 === 0 ? 46 : mm % 5 === 0 ? 32 : 20; line(c, [[x, 830], [x, 830 + h]], mm % 10 === 0 ? 5 : 3); }
  for (let cm = 0; cm <= 9; cm++) write(c, String(cm), 150 + cm * 89 - 10, 880, 40, INK, 6);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const y = 560, r = 125, xl = 200, xr = 560;
  const [tl, tr] = pair(c, xl, xr, y, r, true);
  // smoke from the burnt-out wick
  smoke(c, [[tl[0] - 20, tl[1]], [tl[0] + 20, tl[1] - 70], [tl[0] - 15, tl[1] - 150], [tl[0] + 20, tl[1] - 230], [tl[0] - 5, tl[1] - 320]], 32);
  flame(c, tr[0], tr[1] - 6, 190);
  // the phone with a stopwatch
  shadow(c, 912, 800, 120, 18);
  shape(c, () => rrect(c, 800, 400, 200, 390, 28), COL.black, 6);
  shape(c, () => rrect(c, 814, 432, 172, 326, 14), COL.paper, 4);
  shape(c, () => rrect(c, 884, 450, 32, 24, 5), COL.greyDk, 4);
  shape(c, () => ell(c, 900, 600, 74, 74), WHITE, 6);
  for (let i = 0; i < 12; i++) { const an = (i / 12) * Math.PI * 2; line(c, [[900 + Math.cos(an) * 60, 600 + Math.sin(an) * 60], [900 + Math.cos(an) * 68, 600 + Math.sin(an) * 68]], 4); }
  c.beginPath(); c.moveTo(900, 600); c.arc(900, 600, 58, -Math.PI / 2, 1.9); c.closePath(); c.fillStyle = "rgba(215,55,43,0.35)"; c.fill();
  line(c, [[900, 600], [900 + Math.cos(1.9) * 58, 600 + Math.sin(1.9) * 58]], 8, RED);
  shape(c, () => ell(c, 900, 600, 9, 9), INK, 0);
};

export const su_changesFire = cards("sci.changes.fire.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e3_0, e3_1]);
void BG; void polyP;
