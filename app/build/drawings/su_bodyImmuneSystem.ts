import type { Ctx } from "./core";
import { COL, INK, SH, RED, WHITE, SKIN, CLOTH, D, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, rnd, cards } from "./flatKit";

// sci.body.immune-system.L3 · set-up cards. Same four apples (1 to 4 dots on the paper tag = A to D) on every card of the apple experiment.

// ---------------------------------------------------------------- shared things
const FLESH = "#f6e7b0";
// the wooden table top: the edge line at y, the wood below
const tableTop = (c: Ctx, y: number) => {
  c.fillStyle = COL.wood; c.fillRect(0, y, D, D - y);
  c.fillStyle = COL.woodDk; c.globalAlpha = 0.35;
  for (let i = 0; i < 5; i++) c.fillRect(0, y + 120 + i * 130, D, 6);
  c.globalAlpha = 1; line(c, [[0, y], [D, y]], 6);
};
// a small paper tag with n dots (apple A has 1, B 2, C 3, D 4)
const tag = (c: Ctx, x: number, y: number, n: number, s = 1) => {
  const w = 62 + n * 24;
  shape(c, () => rrect(c, x - (w * s) / 2, y - 30 * s, w * s, 60 * s, 8 * s), WHITE, 5);
  for (let i = 0; i < n; i++) shape(c, () => ell(c, x - ((n - 1) * 24 * s) / 2 + i * 24 * s, y, 8 * s, 8 * s), INK, 0);
};
// a small cut in an apple's skin: a dark lens with pale flesh (fill can be soil or flesh)
const cutMark = (c: Ctx, x: number, y: number, len: number, rot: number, fill: string = FLESH) => {
  shape(c, () => ell(c, x, y, len, len * 0.3, rot), fill, 5);
  if (fill === FLESH) { c.save(); c.beginPath(); ell(c, x, y, len, len * 0.3, rot); c.clip(); c.beginPath(); ell(c, x + len * 0.1, y + len * 0.18, len, len * 0.28, rot); c.fillStyle = "#d9c07a"; c.fill(); c.restore(); }
};
type AppleOpt = { cut?: boolean; cutFill?: string; soil?: boolean; wet?: boolean; shadowOn?: boolean };
// a shiny red apple, centre (x, y), radius r; the cut sits on the upper right shoulder
const apple = (c: Ctx, x: number, y: number, r: number, o: AppleOpt = {}) => {
  if (o.shadowOn !== false) shadow(c, x + r * 0.12, y + r * 0.92, r * 0.95, r * 0.17);
  const body = () => {
    c.moveTo(x, y - r * 0.78); c.bezierCurveTo(x + r * 0.5, y - r * 1.1, x + r * 1.12, y - r * 0.6, x + r * 1.02, y + r * 0.1);
    c.bezierCurveTo(x + r * 0.95, y + r * 0.75, x + r * 0.4, y + r * 1.0, x, y + r * 0.9); c.bezierCurveTo(x - r * 0.4, y + r * 1.0, x - r * 0.95, y + r * 0.75, x - r * 1.02, y + r * 0.1);
    c.bezierCurveTo(x - r * 1.12, y - r * 0.6, x - r * 0.5, y - r * 1.1, x, y - r * 0.78); c.closePath();
  };
  shape(c, body, COL.red, 6); shade(c, body, "#a8301f", r * 0.2, r * 0.05, 0.5);
  line(c, [[x, y - r * 0.78], [x + r * 0.08, y - r * 1.15]], 10, COL.brown);
  leafS(c, x + r * 0.08, y - r * 1.05, r * 0.55, -0.45);
  shine(c, [[x - r * 0.62, y - r * 0.35], [x - r * 0.55, y - r * 0.05]], 9);
  if (o.soil) { const rd = rnd(5); for (let i = 0; i < 7; i++) shape(c, () => ell(c, x + (rd() - 0.5) * r * 1.0, y + (rd() - 0.35) * r * 1.1, r * (0.1 + rd() * 0.1), r * 0.08, rd() * 3), COL.soil, 3); }
  if (o.cut) cutMark(c, x + r * 0.28, y - r * 0.28, r * 0.3, -0.5, o.cutFill ?? FLESH);
};
const leafS = (c: Ctx, x: number, y: number, len: number, an: number) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.32, ny = Math.cos(an) * len * 0.32, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, COL.leaf, 5);
};
// a clear plastic bag with a yellow twist tie, bottom centre (x, y), holding a thing drawn by inner()
const bag = (c: Ctx, x: number, y: number, w: number, h: number, inner: () => void) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.55, 20);
  inner();
  const body = () => {
    c.moveTo(x - w / 2 + 18, y); c.quadraticCurveTo(x - w / 2 - 4, y, x - w / 2, y - 22); c.bezierCurveTo(x - w / 2 - 8, y - h * 0.5, x - w / 2 + 10, y - h * 0.68, x - 20, y - h * 0.9);
    c.lineTo(x - 44, y - h); c.lineTo(x + 44, y - h); c.lineTo(x + 20, y - h * 0.9);
    c.bezierCurveTo(x + w / 2 - 10, y - h * 0.68, x + w / 2 + 8, y - h * 0.5, x + w / 2, y - 22); c.quadraticCurveTo(x + w / 2 + 4, y, x + w / 2 - 18, y); c.closePath();
  };
  shape(c, body, "rgba(220,238,250,0.3)", 5);
  shade(c, body, "#7fa6c8", w * 0.2, 0, 0.18);
  shape(c, () => rrect(c, x - 28, y - h * 0.9 - 8, 56, 18, 8), COL.yellow, 5);
  shine(c, [[x - w * 0.36, y - h * 0.45], [x - w * 0.3, y - h * 0.15]], 8);
};
// a clock face with hour and minute hands (hour 0..11, minute 0..59)
const clockFace = (c: Ctx, x: number, y: number, r: number, hh: number, mm: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 5);
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92]], 4); }
  const ah = ((hh + mm / 60) / 12) * Math.PI * 2 - Math.PI / 2, am = (mm / 60) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(am) * r * 0.8, y + Math.sin(am) * r * 0.8]], 4); line(c, [[x, y], [x + Math.cos(ah) * r * 0.48, y + Math.sin(ah) * r * 0.48]], 9, RED);
};
// a body temperature like 36.6 with the degree mark and C; (x, y) top left, h the digit height
const temp = (c: Ctx, a: string, b: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  write(c, a, x, y, h, col, w); shape(c, () => ell(c, x + h * 1.5, y + h * 0.95, h * 0.07, h * 0.07), col, 0); write(c, b, x + h * 1.72, y, h, col, w);
  write(c, "°", x + h * 2.5, y - h * 0.02, h * 0.4, col, w * 0.8); write(c, "c", x + h * 2.8, y + h * 0.3, h * 0.6, col, w * 0.8);
};
// a card with a strip of clear tape across it and two pencil lines 4 cm apart. sticky = tape sticky side up (held by bits of tape at the ends)
const tapeCard = (c: Ctx, x: number, y: number, w: number, h: number, sticky: boolean) => {
  shadow(c, x + 20, y + h / 2 + 8, w * 0.52, 22);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 12), WHITE, 6);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 12), "#bdb6a8", w * 0.05, 0, 0.3);
  const tw = w * 0.82, th = 84;
  for (const s of [-1, 1]) line(c, [[x + s * 75, y - h * 0.32], [x + s * 75, y + h * 0.4]], 6, "#5a5560");
  shape(c, () => rrect(c, x - tw / 2, y - th / 2, tw, th, 4), sticky ? "rgba(255,226,140,0.75)" : "rgba(214,236,250,0.65)", 5);
  if (sticky) {
    shine(c, [[x - tw * 0.3, y - 22], [x + tw * 0.2, y - 22]], 10);
    for (const s of [-1, 1]) shape(c, () => polyP(c, [[x + s * tw / 2 - 34, y - 50], [x + s * tw / 2 + 34, y - 50], [x + s * tw / 2 + 34, y + 50], [x + s * tw / 2 - 34, y + 50]]), "rgba(255,238,170,0.9)", 5);
  } else shine(c, [[x - tw * 0.4, y - 20], [x + tw * 0.15, y - 20]], 10);
  line(c, [[x - 75, y - h * 0.32], [x + 75, y - h * 0.32]], 5); write(c, "4 cm", x - 62, y - h * 0.32 - 62, 44, INK, 7);
};

// ---------------------------------------------------------------- experiment 1: apples and soil
// setup.e1.0
const apples4 = (c: Ctx) => {
  ground(c); tableTop(c, 400);
  [190, 425, 660, 895].forEach((x, i) => { apple(c, x, 570, 108); tag(c, x, 810, i + 1, 1.4); });
};

// setup.e1.1
const cutApple = (c: Ctx) => {
  ground(c); tableTop(c, 640);
  apple(c, 520, 660, 250, { cut: false });
  cutMark(c, 480, 540, 55, -0.35);
  // the knife: handle under the fingers, blade pointing at the skin
  const an = 2.5, tx = 478, ty = 536, L = 420, wx = tx - Math.cos(an) * L, wy = ty - Math.sin(an) * L;
  c.save(); c.translate(wx, wy); c.rotate(an);
  shape(c, () => polyP(c, [[170, -20], [360, -20], [L, 4], [170, 18]]), COL.steel, 5);
  shape(c, () => rrect(c, 40, -19, 140, 38, 10), COL.black, 5);
  c.restore();
  hand(c, wx, wy, an, 1.5, SKIN.adult, CLOTH.adult);
  line(c, [[420, 640], [540, 640]], 6, WHITE); line(c, [[420, 628], [420, 652]], 6, WHITE); line(c, [[540, 628], [540, 652]], 6, WHITE);
  write(c, "2 cm", 405, 668, 44, WHITE, 8);
};

// setup.e1.2
const soilRinse = (c: Ctx) => {
  ground(c); tableTop(c, 470);
  const y = 690, r = 150;
  apple(c, 175, y, r, { soil: true });
  apple(c, 540, y, r, { cut: true, cutFill: COL.soil });
  apple(c, 905, y, r, { cut: true });
  // soil dust on the table beside C
  for (const [dx, dy] of [[-90, 150], [-40, 160], [-120, 165]]) shape(c, () => ell(c, 540 + dx, y + dy, 12, 7), COL.soil, 3);
  // a child's finger rubbing soil on A
  const an = 1.4, tx = 175, ty = 590, wx = tx - Math.cos(an) * 190, wy = ty - Math.sin(an) * 190;
  hand(c, wx, wy, an, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[300, 470], [350, 520], [340, 580]], RED, 10);
  // the tap over D and its stream
  shape(c, () => rrect(c, 1000, 90, 120, 62, 14), COL.steel, 6);
  shape(c, () => rrect(c, 872, 90, 160, 62, 14), COL.steel, 6);
  shape(c, () => polyP(c, [[868, 140], [932, 140], [922, 232], [878, 232]]), COL.steel, 6);
  shape(c, () => rrect(c, 948, 56, 56, 40, 10), COL.red, 5);
  shape(c, () => rrect(c, 889, 232, 22, 340, 10), COL.water, 5);
  shine(c, [[897, 250], [897, 540]], 5);
  for (const [dx, dy] of [[-34, 20], [38, 14], [-48, -14], [52, -10]]) shape(c, () => ell(c, 905 + dx, 585 + dy, 9, 12), COL.drop, 3);
  [1, 3, 4].forEach((n, i) => tag(c, [175, 540, 905][i], 960, n, 1.3));
};

// setup.e1.3
const applesInBags = (c: Ctx) => {
  ground(c);
  const sy = 800;
  shape(c, () => polyP(c, [[-10, sy], [D + 10, sy], [D + 40, sy + 100], [-40, sy + 100]]), COL.wood, 6);
  shape(c, () => rrect(c, -20, sy + 100, D + 40, 120, 4), COL.woodDk, 6);
  [160, 395, 630, 865].forEach((x, i) => {
    bag(c, x, 830, 225, 560, () => apple(c, x, 830 - 170, 98, { cut: i > 0, shadowOn: false }));
    tag(c, x, 900, i + 1, 1.1);
  });
};

// ---------------------------------------------------------------- experiment 2: temperature
// setup.e2.0
const thermUnderArm = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 990, 500, 70), COL.teal, 6);
  const x = 480, h = 1000, y = 985;
  // the thermometer goes in before the person so the arm and side hide its tip
  c.save(); c.translate(60, 615); c.rotate(0.4);
  shape(c, () => rrect(c, 0, -30, 320, 60, 18), COL.paper, 5);
  shape(c, () => rrect(c, 24, -18, 100, 36, 8), "#c9f06b", 4);
  c.restore();
  person(c, x, y, h, { sit: true, armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  arrow(c, [[120, 840], [300, 840]], RED, 14);
};

// setup.e2.1
const thermScreen = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 90);
  shadow(c, 560, 640, 440, 40);
  // metal tip, body, screen and button
  shape(c, () => polyP(c, [[70, 440], [250, 420], [250, 480], [70, 460]]), COL.steel, 6);
  shape(c, () => rrect(c, 230, 360, 760, 180, 60), COL.teal, 6);
  shade(c, () => rrect(c, 230, 360, 760, 180, 60), COL.tealDk, 0, 30, 0.7);
  shape(c, () => rrect(c, 300, 388, 520, 124, 18), "#22303a", 5);
  temp(c, "36", "6", 335, 413, 78, "#c9f06b", 9);
  // the beep: a little speaker and sound waves
  shape(c, () => polyP(c, [[745, 440], [765, 440], [785, 420], [785, 480], [765, 460], [745, 460]]), "#c9f06b", 0);
  for (const k of [1, 2]) { c.beginPath(); c.arc(790, 450, 14 + k * 12, -0.9, 0.9); c.strokeStyle = "#c9f06b"; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  shape(c, () => ell(c, 880, 450, 30, 30), COL.red, 5);
  hand(c, 885, 640, -Math.PI / 2, 1.9, SKIN.adult, CLOTH.adult);
  c.restore();
};

// setup.e2.2
const tempTable = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 770, 450, 30);
  shape(c, () => rrect(c, 60, 70, 960, 690, 18), WHITE, 6);
  const times: [number, number][] = [[7, 0], [11, 0], [3, 0], [8, 0]], vals = [["36", "4"], ["36", "8"], ["36", "5"], ["36", "7"]];
  const keys = [COL.orange, COL.blue, COL.green, COL.purple], ys = [470, 220, 408, 283], xs = [750, 830, 910, 975];
  // one boxed row per reading: colour dot, clock, temperature; the same colour marks its dot on the chart
  for (let i = 0; i < 4; i++) {
    const cy = 165 + i * 135;
    shape(c, () => rrect(c, 90, cy - 58, 540, 116, 16), "#fffaf0", 5);
    shape(c, () => ell(c, 125, cy, 20, 20), keys[i], 5);
    clockFace(c, 215, cy, 48, times[i][0], times[i][1]);
    temp(c, vals[i][0], vals[i][1], 310, cy - 36, 72);
  }
  // line chart
  line(c, [[690, 130], [690, 540], [1000, 540]], 7);
  const pts: number[][] = xs.map((x, i) => [x, ys[i]]);
  line(c, pts, 9, INK);
  pts.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 18, 18), keys[i], 5); shape(c, () => ell(c, x, 575, 14, 14), keys[i], 4); });
  // a hand with a pencil writing the last reading
  const tx = 575, ty = 600, an = Math.PI + 0.9, ux = Math.cos(an), uy = Math.sin(an), wx = tx - ux * 250, wy = ty - uy * 250;
  c.save(); c.translate(wx, wy); c.rotate(an);
  shape(c, () => polyP(c, [[185, -17], [185, 17], [250, 0]]), COL.wood, 5);
  shape(c, () => polyP(c, [[233, -5], [233, 5], [250, 0]]), INK, 2);
  shape(c, () => rrect(c, -30, -17, 220, 34, 5), COL.yellow, 5);
  shape(c, () => rrect(c, -48, -17, 22, 34, 5), COL.pink, 5);
  c.restore();
  hand(c, wx, wy, an, 1.7, SKIN.child, CLOTH.child);
};

// ---------------------------------------------------------------- experiment 3: dust on tape
// setup.e3.0
const twoTapeCards = (c: Ctx) => {
  ground(c);
  tapeCard(c, 275, 560, 460, 700, true);
  tapeCard(c, 805, 560, 460, 700, false);
  // a hand presses a bit of tape over the end of the sticky strip; another smooths the plain strip flat
  hand(c, 463, 705, -Math.PI / 2, 1.4, SKIN.child, CLOTH.child, true);
  hand(c, 770, 705, -Math.PI / 2, 1.4, SKIN.child, CLOTH.child, true);
};

// setup.e3.1
const cardsOnSill = (c: Ctx) => {
  ground(c);
  // the window: open sashes either side, sky and a tree between
  shape(c, () => rrect(c, 90, 50, 900, 450, 10), COL.sky, 8);
  shape(c, () => ell(c, 700, 160, 50, 50), COL.yellow, 5);
  shape(c, () => ell(c, 440, 470, 220, 120), COL.leaf, 5); shape(c, () => ell(c, 640, 490, 200, 110), COL.leafDk, 5);
  shape(c, () => rrect(c, 410, 430, 30, 100, 4), COL.brown, 5);
  shape(c, () => polyP(c, [[90, 60], [270, 110], [270, 450], [90, 510]]), "#fff6e0", 7);
  shape(c, () => polyP(c, [[120, 110], [240, 148], [240, 415], [120, 458]]), COL.glass, 5);
  shape(c, () => polyP(c, [[990, 60], [810, 110], [810, 450], [990, 510]]), "#fff6e0", 7);
  shape(c, () => polyP(c, [[960, 110], [840, 148], [840, 415], [960, 458]]), COL.glass, 5);
  // the sill
  shape(c, () => polyP(c, [[20, 500], [1060, 500], [1100, 960], [-20, 960]]), COL.wood, 6);
  shape(c, () => rrect(c, -20, 960, D + 40, 120, 4), COL.woodDk, 6);
  const quad = (q: number[][], u: number, v: number): number[] => {
    const tx = q[0][0] + (q[1][0] - q[0][0]) * u, ty = q[0][1] + (q[1][1] - q[0][1]) * u, bx = q[3][0] + (q[2][0] - q[3][0]) * u, by = q[3][1] + (q[2][1] - q[3][1]) * u;
    return [tx + (bx - tx) * v, ty + (by - ty) * v];
  };
  const card = (q: number[][], sticky: boolean) => {
    shape(c, () => polyP(c, q.map(([x, y]) => [x + 22, y + 18])), SH, 0);
    shape(c, () => polyP(c, q), WHITE, 6);
    for (const u of [0.3, 0.7]) line(c, [quad(q, u, 0.12), quad(q, u, 0.88)], 6, "#5a5560");
    shape(c, () => polyP(c, [quad(q, 0.08, 0.38), quad(q, 0.92, 0.38), quad(q, 0.92, 0.62), quad(q, 0.08, 0.62)]), sticky ? "rgba(255,226,140,0.8)" : "rgba(214,236,250,0.7)", 5);
    for (const [u, v] of [[0.04, 0.06], [0.96, 0.06], [0.04, 0.94], [0.96, 0.94]]) {
      const p = quad(q, u, v); shape(c, () => polyP(c, [[p[0] - 30, p[1] - 14], [p[0] + 30, p[1] - 14], [p[0] + 30, p[1] + 14], [p[0] - 30, p[1] + 14]]), "rgba(255,238,170,0.9)", 4);
    }
  };
  card([[120, 570], [480, 570], [535, 880], [55, 880]], true);
  card([[610, 570], [970, 570], [1030, 880], [555, 880]], false);
  // a few specks drifting in
  const r = rnd(4);
  for (let i = 0; i < 6; i++) shape(c, () => ell(c, 300 + r() * 450, 515 + r() * 40 + (i % 3) * 5, 5 + r() * 3, 5), COL.greyDk, 2);
};

// setup.e3.2
const lookAtDust = (c: Ctx) => {
  ground(c);
  // the card under the lens, its tape and pencil lines
  shadow(c, 470, 990, 400, 24);
  shape(c, () => rrect(c, 70, 330, 760, 650, 14), WHITE, 6);
  const view = (cx: number, cy: number, k: number) => {
    for (const s of [-1, 1]) line(c, [[cx + s * 70 * k, cy - 120 * k], [cx + s * 70 * k, cy + 120 * k]], 4 * k + 2, "#5a5560");
    shape(c, () => rrect(c, cx - 280 * k, cy - 42 * k, 560 * k, 84 * k, 4 * k), "rgba(255,226,140,0.8)", 3 + k);
    const r = rnd(9);
    for (let i = 0; i < 12; i++) { const inside = i < 8, ux = inside ? (r() - 0.5) * 120 : (r() < 0.5 ? -1 : 1) * (95 + r() * 110); shape(c, () => ell(c, cx + ux * k, cy + (r() - 0.5) * 60 * k, (3 + r() * 3) * k, (3 + r() * 2.5) * k, r() * 3), COL.greyDk, 1.5 * k); }
  };
  view(440, 690, 1);
  // lens
  const lx = 440, ly = 690, lr = 235;
  c.save(); c.beginPath(); ell(c, lx, ly, lr, lr); c.clip(); c.fillStyle = WHITE; c.fillRect(0, 0, D, D); view(lx, ly, 1.9); c.restore();
  shape(c, () => ell(c, lx, ly, lr, lr), "rgba(214,236,250,0.25)", 0);
  c.beginPath(); ell(c, lx, ly, lr, lr); c.strokeStyle = INK; c.lineWidth = 34; c.stroke(); c.strokeStyle = COL.wood; c.lineWidth = 22; c.stroke();
  shine(c, [[lx - 150, ly - 110], [lx - 110, ly - 150]], 12);
  const ha = -0.75, ux = Math.cos(ha), uy = Math.sin(ha), x0 = lx + ux * (lr + 14), y0 = ly + uy * (lr + 14), x1 = x0 + ux * 340, y1 = y0 + uy * 340;
  line(c, [[x0, y0], [x1, y1]], 44, INK); line(c, [[x0, y0], [x1, y1]], 30, COL.black);
  const an = ha + Math.PI / 2, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  hand(c, mx - Math.cos(an) * 91, my - Math.sin(an) * 91, an, 1.3, SKIN.child, CLOTH.child);
};

export const su_bodyImmuneSystem = cards("sci.body.immune-system.L3 set-up", [apples4, cutApple, soilRinse, applesInBags, thermUnderArm, thermScreen, tempTable, twoTapeCards, cardsOnSill, lookAtDust]);
