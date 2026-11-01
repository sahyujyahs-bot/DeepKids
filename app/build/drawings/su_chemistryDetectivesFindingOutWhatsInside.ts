import type { Ctx } from "./core";
import { COL, CLOTH, INK, SH, SKIN, WHITE, bowl, cards, ell, ground, hand, line, person, plate, polyP, rrect, shade, shadow, shape, write } from "./flatKit";

// CHEMISTRY DETECTIVES · finding out what's inside · L3 · experiment set-up cards.
// Experiments 1 and 2: paper-strip colour splitting (chromatography); experiment 3: the flame test.

const PEN_DARK = "#2b2340";
const PAPER_DK = "#e3d8c0";

// a few big capital letters as strokes (the labels A, B, C and P on the strips)
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.65], [0.5, 0.65]]],
  B: [[[0, 0], [0, 1]], [[0, 0], [0.4, 0], [0.55, 0.2], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.6, 0.72], [0.45, 1], [0, 1]]],
  C: [[[0.55, 0.1], [0.3, 0], [0.05, 0.2], [0, 0.5], [0.05, 0.8], [0.3, 1], [0.55, 0.9]]],
  P: [[[0, 1], [0, 0], [0.4, 0], [0.58, 0.2], [0.4, 0.5], [0, 0.5]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 8) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};

// a paper strip lying flat: centre x, top y
const strip = (c: Ctx, x: number, y: number, w: number, h: number, tint = COL.paper) => {
  c.beginPath(); rrect(c, x - w / 2 + 12, y + 14, w, h, 6); c.fillStyle = SH; c.fill();
  const body = () => rrect(c, x - w / 2, y, w, h, 6);
  shape(c, body, tint, 5);
  shade(c, body, PAPER_DK, -w * 0.1, -4, 0.7);
  shape(c, body, "rgba(0,0,0,0)", 5);
};
const dot = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), col, 3);
  c.beginPath(); ell(c, x - r * 0.3, y - r * 0.3, r * 0.25, r * 0.2); c.fillStyle = "rgba(255,255,255,0.55)"; c.fill();
};
// the pencil line across a strip, with its dot
const startLine = (c: Ctx, x: number, y: number, w: number, col?: string, r = 15) => {
  line(c, [[x - w / 2 + 12, y + 14], [x + w / 2 - 12, y + 14]], 5, COL.greyDk);
  if (col) dot(c, x, y + 14, r, col);
};

// a hand holding a pen, its tip at (tx, ty), the wrist at (wx, wy)
const handPen = (c: Ctx, tx: number, ty: number, wx: number, wy: number, s: number, penCol: string, adult: boolean) => {
  const an = Math.atan2(ty - wy, tx - wx), dx = Math.cos(an), dy = Math.sin(an), cx = wx + dx * 70 * s, cy = wy + dy * 70 * s;
  line(c, [[cx - dx * 20, cy - dy * 20], [tx, ty]], 38, INK);
  line(c, [[cx - dx * 20, cy - dy * 20], [tx - dx * 40, ty - dy * 40]], 26, penCol);
  line(c, [[tx - dx * 46, ty - dy * 46], [tx, ty]], 26, PEN_DARK);
  hand(c, wx, wy, an, s, adult ? SKIN.adult : SKIN.child, adult ? CLOTH.adult : CLOTH.child);
};

// a steel tumbler cut open at the front so you can see inside; half-width at height y
const tumbler = (c: Ctx, x: number, yb: number, w: number, h: number, dots: string[], showCm = false) => {
  const top = yb - h, bot = w * 0.4, half = (y: number) => bot + (w / 2 - bot) * ((yb - y) / h), ry = w * 0.09;
  shadow(c, x + w * 0.12, yb + 8, w * 0.58, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, top); c.lineTo(x + w / 2, top); c.lineTo(x + bot, yb); c.lineTo(x - bot, yb); c.closePath(); };
  shape(c, body, COL.steel, 6);
  shade(c, body, COL.steelDk, -w * 0.08, 0, 0.6);
  // the cut-away window and the open top
  const yw = yb - 34, inset = 26, IN = "#bfcad9";
  const win = () => { c.moveTo(x - half(top) + inset, top); c.lineTo(x + half(top) - inset, top); c.lineTo(x + half(yw) - inset, yw); c.lineTo(x - half(yw) + inset, yw); c.closePath(); };
  shape(c, win, IN, 5);
  shape(c, () => ell(c, x, top, w / 2, ry), IN, 0);
  c.beginPath(); c.ellipse(x, top, w / 2, ry, 0, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x - w / 2, top], [x - half(top) + inset, top]], 6);
  // the water, 1 cm deep, and the strips hanging in it
  const wy = yw - 54, sw = w * 0.25, xs = [x - w * 0.2, x + w * 0.2];
  c.save(); c.beginPath(); win(); c.clip();
  xs.forEach((sx, i) => {
    c.beginPath(); rrect(c, sx - sw / 2 + 8, top + 8, sw, wy + 22 - top, 4); c.fillStyle = SH; c.fill();
    shape(c, () => rrect(c, sx - sw / 2, top, sw, wy + 22 - top, 4), COL.paper, 4);
    line(c, [[sx - sw / 2 + 4, wy - 38], [sx + sw / 2 - 4, wy - 38]], 4, COL.greyDk);
    dot(c, sx, wy - 38, sw * 0.17, dots[i] ?? PEN_DARK);
  });
  c.fillStyle = "rgba(143,195,234,0.82)"; c.fillRect(x - w, wy, w * 2, yw - wy);
  c.fillStyle = COL.drop; c.fillRect(x - w, wy - 2, w * 2, 6);
  c.restore();
  shape(c, win, "rgba(0,0,0,0)", 5);
  // clips and the pencil across the top
  xs.forEach((sx) => shape(c, () => rrect(c, sx - sw / 2 - 5, top - 22, sw + 10, 40, 8), COL.teal, 4));
  const px0 = x - w / 2 - 34, px1 = x + w / 2 + 34;
  shape(c, () => polyP(c, [[px1 - 4, top - 11], [px1 + 34, top], [px1 - 4, top + 11]]), COL.wood, 4);
  shape(c, () => polyP(c, [[px1 + 18, top - 4], [px1 + 34, top], [px1 + 18, top + 4]]), INK, 2);
  shape(c, () => rrect(c, px0 + 22, top - 11, px1 - px0 - 26, 22, 3), COL.yellow, 5);
  shape(c, () => rrect(c, px0 - 6, top - 11, 28, 22, 8), COL.pink, 5);
  line(c, [[px0 + 40, top - 4], [px1 - 20, top - 4]], 4, "rgba(255,255,255,0.7)");
  if (showCm) {
    const bx = x + half(wy) + 20;
    line(c, [[bx, wy], [bx, yw]], 6, INK); line(c, [[bx - 12, wy], [bx + 12, wy]], 6, INK); line(c, [[bx - 12, yw], [bx + 12, yw]], 6, INK);
    write(c, "1 cm", bx + 24, (wy + yw) / 2 - 18, 36, INK, 6);
  }
};

// a flame on a gas burner; yb = where it starts
const flameP = (c: Ctx, x: number, yb: number, h: number, w: number) => {
  c.moveTo(x - w / 2, yb); c.bezierCurveTo(x - w * 0.6, yb - h * 0.4, x - w * 0.15, yb - h * 0.62, x, yb - h);
  c.bezierCurveTo(x + w * 0.15, yb - h * 0.62, x + w * 0.6, yb - h * 0.4, x + w / 2, yb); c.closePath();
};
const flame = (c: Ctx, x: number, yb: number, h: number, w: number, outer: string, mid: string, inner: string) => {
  shape(c, () => flameP(c, x, yb, h, w), outer, 6);
  shape(c, () => flameP(c, x, yb, h * 0.78, w * 0.7), mid, 0);
  shape(c, () => flameP(c, x, yb, h * 0.5, w * 0.4), inner, 0);
};
const BLUE = ["#3f73d9", "#6ea0f0", "#d6eaff"], YELL = [COL.orange, COL.yellow, "#fff3b0"];
const cap = (c: Ctx, x: number, y: number, rx: number) => {
  shadow(c, x + rx * 0.1, y + 14, rx * 1.05, rx * 0.2);
  shape(c, () => ell(c, x, y, rx, rx * 0.26), COL.black, 6);
  shape(c, () => ell(c, x, y - 4, rx * 0.6, rx * 0.15), COL.greyDk, 4);
};
// a small white paper with a big number
const numPaper = (c: Ctx, x: number, y: number, n: string, w = 170, h = 130) => {
  c.beginPath(); rrect(c, x - w / 2 + 10, y + 12, w, h, 8); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x - w / 2, y, w, h, 8), WHITE, 5);
  write(c, n, x - 22, y + h / 2 - 42, 84, INK, 11);
};

// setup.e1.0 : four strips, three with a pen dot, one with the secret star and P; a grown-up writes the P
const card_e1_0 = (c: Ctx) => {
  ground(c);
  const xs = [150, 370, 590, 810], y0 = 110, h = 560, ly = 560;
  xs.forEach((x) => strip(c, x, y0, 170, h));
  ["A", "B", "C"].forEach((ch, i) => { letter(c, ch, xs[i] - 24, 190, 80, INK, 10); startLine(c, xs[i], ly, 170, PEN_DARK, 17); });
  // the secret strip: a star and the thick P on the line
  const sx = xs[3], sy = 250;
  shape(c, () => { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 22 : 52; k ? c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r) : c.moveTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); }, COL.yellow, 5);
  startLine(c, sx, ly + 5, 170);
  letter(c, "P", sx - 22, ly - 38, 84, PEN_DARK, 17);
  handPen(c, sx - 22, ly + 46, 960, 1000, 2.1, COL.teal, true);
};

// setup.e1.1 : two steel tumblers, a pencil across each holding two strips, ends in 1 cm of water
const card_e1_1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 290, 980, 380, 640, [PEN_DARK, "#33395a"], true);
  tumbler(c, 790, 980, 380, 640, ["#3a3a3a", "#4a2a3a"]);
};

// setup.e1.2 : four dried strips on a plate: blue and purple, two matching blue and pink, one unmoved dot
const card_e1_2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 545, 500, 440);
  const xs = [285, 455, 625, 795], y0 = 270, h = 540, ly = 730;
  const band = (x: number, y: number, col: string) => shape(c, () => rrect(c, x - 52, y - 24, 104, 48, 22), col, 0);
  xs.forEach((x, i) => {
    strip(c, x, y0, 140, h);
    c.fillStyle = "rgba(120,170,220,0.14)"; c.fillRect(x - 65, y0 + 70, 130, h - 78);
    line(c, [[x - 58, y0 + 70], [x + 58, y0 + 70]], 3, "rgba(95,159,211,0.8)");
    startLine(c, x, ly - 14, 140);
    if (i === 0) { band(x, 450, COL.blue); band(x, 575, COL.purple); }
    if (i === 1 || i === 2) { band(x, 450, COL.blue); band(x, 565, COL.pink); }
    if (i === 3) dot(c, x, ly, 22, PEN_DARK);
  });
};

// setup.e2.0 : six strips, each with a pencil line and a coloured dot (black, brown, green, purple, orange, yellow)
const INKS = [PEN_DARK, "#8b4f2a", COL.green, COL.purple, COL.orange, COL.yellow];
const card_e2_0 = (c: Ctx) => {
  ground(c);
  const xs = [130, 270, 410, 550, 690, 830], y0 = 200, h = 640, ly = 730;
  xs.forEach((x, i) => { strip(c, x, y0, 120, h); startLine(c, x, ly - 14, 120, i === 5 ? undefined : INKS[i], 17); });
  dot(c, xs[5], ly, 17, COL.yellow);
  handPen(c, xs[5], ly, 990, 1090, 2, COL.yellow, false);
};

// setup.e2.1 : three steel tumblers, two strips hanging in each
const card_e2_1 = (c: Ctx) => {
  ground(c);
  [165, 540, 915].forEach((x, i) => tumbler(c, x, 930, 240, 560, [INKS[i * 2], INKS[i * 2 + 1]]));
};

// setup.e2.2 : the six dried strips in a row; the number of bands above each
const card_e2_2 = (c: Ctx) => {
  ground(c);
  const xs = [127, 292, 457, 622, 787, 952], y0 = 230, h = 600, ly = 750, Y = "#f5c62a";
  const bands: [string, number][][] = [
    [[Y, 370], [COL.blue, 480], [COL.purple, 600]],
    [[Y, 350], [COL.pink, 440], [COL.orange, 530], [COL.blue, 620]],
    [[Y, 400], [COL.blue, 560]],
    [[COL.pink, 420], [COL.blue, 570]],
    [[Y, 410], [COL.red, 540]],
    [[Y, 440]],
  ];
  xs.forEach((x, i) => {
    strip(c, x, y0, 130, h);
    c.fillStyle = "rgba(120,170,220,0.14)"; c.fillRect(x - 60, y0 + 70, 120, h - 78);
    line(c, [[x - 53, y0 + 70], [x + 53, y0 + 70]], 3, "rgba(95,159,211,0.8)");
    startLine(c, x, ly - 14, 130);
    bands[i].forEach(([col, y]) => shape(c, () => rrect(c, x - 50, y - 26, 100, 52, 22), col, 0));
    write(c, String(bands[i].length), x - 24, 80, 84, INK, 11);
  });
};

// setup.e3.0 : three steel katoris of clear water in a row, numbered 1, 2, 3 on papers underneath
const card_e3_0 = (c: Ctx) => {
  ground(c);
  [180, 540, 900].forEach((x, i) => {
    bowl(c, x, 380, 150, COL.water);
    c.beginPath(); ell(c, x - 40, 372, 52, 7, -0.1); c.fillStyle = COL.drop; c.fill();
    numPaper(c, x, 640, String(i + 1), 200, 220);
  });
};

// setup.e3.1 : a grown-up holds a wet steel spoon, wrapped in a cloth, in the edge of a blue flame; the child stands back
const card_e3_1 = (c: Ctx) => {
  ground(c);
  // the stove and its flame
  shape(c, () => polyP(c, [[200, 870], [760, 870], [800, 950], [160, 950]]), COL.steel, 6);
  shade(c, () => polyP(c, [[200, 870], [760, 870], [800, 950], [160, 950]]), COL.steelDk, -30, -8, 0.6);
  cap(c, 480, 862, 120);
  [[-85, 110, 60], [85, 110, 60], [-45, 190, 80], [45, 190, 80], [0, 250, 100]].forEach(([dx, h, w]) => flame(c, 480 + dx, 860, h, w, BLUE[0], BLUE[1], BLUE[2]));
  // the spoon: handle from the hand, bowl in the edge of the flame
  const bx = 575, by = 745, an = 0.7, dx = Math.cos(an), dy = Math.sin(an), wx = 190, wy = 345;
  line(c, [[wx + dx * 40, wy + dy * 40], [bx, by]], 26, INK); line(c, [[wx + dx * 40, wy + dy * 40], [bx, by]], 16, COL.steel);
  shape(c, () => ell(c, bx + dx * 38, by + dy * 38, 62, 38, an), COL.steel, 6);
  shade(c, () => ell(c, bx + dx * 38, by + dy * 38, 62, 38, an), COL.steelDk, -14, -10, 0.6);
  [[0, -8], [22, 6], [-18, 8]].forEach(([u, v]) => { c.beginPath(); ell(c, bx + dx * (38 + u) - dy * v, by + dy * (38 + u) + dx * v, 9, 6, an); c.fillStyle = COL.drop; c.fill(); });
  // the hand with a teal cloth wrapped on the handle
  hand(c, wx, wy, an, 1.6, SKIN.adult, CLOTH.adult);
  c.save(); c.translate(wx + dx * 190, wy + dy * 190); c.rotate(an);
  shape(c, () => rrect(c, -50, -34, 100, 68, 16), COL.teal, 6);
  shade(c, () => rrect(c, -50, -34, 100, 68, 16), COL.tealDk, -14, -14, 0.6);
  shape(c, () => polyP(c, [[-30, 30], [10, 32], [14, 82], [-22, 70]]), COL.teal, 6);
  line(c, [[-20, -18], [-20, 18]], 4, COL.tealDk); line(c, [[10, -18], [10, 18]], 4, COL.tealDk);
  c.restore();
  // the child stands well back
  person(c, 930, 990, 440);
};

// setup.e3.2 : three flames side by side: blue, blue with tiny orange sparks, bright yellow-orange
const card_e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[60, 770], [1020, 770], [1040, 840], [40, 840]]), COL.steel, 6);
  shade(c, () => polyP(c, [[60, 770], [1020, 770], [1040, 840], [40, 840]]), COL.steelDk, -30, -8, 0.6);
  [180, 540, 900].forEach((x) => cap(c, x, 764, 100));
  flame(c, 180, 760, 280, 170, BLUE[0], BLUE[1], BLUE[2]);
  flame(c, 540, 760, 280, 170, BLUE[0], BLUE[1], BLUE[2]);
  flame(c, 900, 760, 470, 250, YELL[0], YELL[1], YELL[2]);
  // tiny orange sparks around the middle flame
  [[-30, 60], [40, 20], [-60, 130], [70, 100], [10, 0], [-10, 90]].forEach(([dx, dy], i) => {
    const sx = 540 + dx, sy = 470 + dy, r = 9 + (i % 2) * 3;
    shape(c, () => { c.moveTo(sx, sy - r * 1.6); c.quadraticCurveTo(sx + r, sy, sx, sy + r); c.quadraticCurveTo(sx - r, sy, sx, sy - r * 1.6); c.closePath(); }, COL.orange, 3);
  });
  [180, 540, 900].forEach((x, i) => numPaper(c, x, 880, String(i + 1), 150, 130));
};

export const su_chemistryDetectivesFindingOutWhatsInside = cards("sci.chemistry-detectives.finding-out-whats-inside.L3 set-up", [
  card_e1_0, card_e1_1, card_e1_2, card_e2_0, card_e2_1, card_e2_2, card_e3_0, card_e3_1, card_e3_2,
]);
