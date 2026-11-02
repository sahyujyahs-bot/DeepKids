import type { Ctx } from "./core";
import { COL, CLOTH, INK, SH, SKIN, WHITE, RED, arrow, bowl, cards, ell, glass, ground, line, person, plate, polyP, rnd, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// CHEMISTRY DETECTIVES · finding out what's inside · L3 · cards for the activities, terms and explanations.
// One order of dyes on every strip, from the start line up: purple (slowest), blue, then yellow (fastest).

const PEN_DARK = "#2b2340";
const PAPER_DK = "#e3d8c0";
const DYE = { purple: COL.purple, blue: COL.blue, yellow: "#f5c62a", pink: COL.pink, orange: COL.orange };
const BLUE = ["#3f73d9", "#6ea0f0", "#d6eaff"], YELL = [COL.orange, COL.yellow, "#fff3b0"];

const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.1, 0.65], [0.5, 0.65]]],
  B: [[[0, 0], [0, 1]], [[0, 0], [0.4, 0], [0.55, 0.2], [0.4, 0.48], [0, 0.48]], [[0.4, 0.48], [0.6, 0.72], [0.45, 1], [0, 1]]],
  C: [[[0.55, 0.1], [0.3, 0], [0.05, 0.2], [0, 0.5], [0.05, 0.8], [0.3, 1], [0.55, 0.9]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 8) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  LET[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};

// a paper strip: centre x, top y
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
const startLine = (c: Ctx, x: number, y: number, w: number, col?: string, r = 15) => {
  line(c, [[x - w / 2 + 12, y + 14], [x + w / 2 - 12, y + 14]], 5, COL.greyDk);
  if (col) dot(c, x, y + 14, r, col);
};
const band = (c: Ctx, x: number, y: number, w: number, col: string, h = 48) => shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.45), col, 0);
// a wet tint on the lower part of a strip, with its front edge
const wet = (c: Ctx, x: number, yTop: number, yBot: number, w: number) => {
  c.fillStyle = "rgba(120,170,220,0.16)"; c.fillRect(x - w / 2 + 3, yTop, w - 6, yBot - yTop);
  line(c, [[x - w / 2 + 6, yTop], [x + w / 2 - 6, yTop]], 3, "rgba(95,159,211,0.9)");
};
const dashes = (c: Ctx, x0: number, x1: number, y: number, col = COL.greyDk) => {
  for (let x = x0; x < x1; x += 28) line(c, [[x, y], [Math.min(x + 14, x1), y]], 4, col);
};

// a pen standing tip down: top y, length, width, barrel colour, ink colour
const penV = (c: Ctx, x: number, top: number, len: number, w: number, col: string, ink: string) => {
  const body = () => rrect(c, x - w / 2, top, w, len, w * 0.3);
  shape(c, body, col, 6);
  shade(c, body, INK, -w * 0.22, 0, 0.22);
  shape(c, () => rrect(c, x - w * 0.36, top + len - 8, w * 0.72, 24, 6), COL.steelIn, 5);
  shape(c, () => polyP(c, [[x - w * 0.24, top + len + 14], [x + w * 0.24, top + len + 14], [x, top + len + w * 0.75]]), ink, 5);
  shine(c, [[x - w * 0.25, top + 18], [x - w * 0.25, top + len * 0.5]], 7);
};
// a pen lying flat, nib on the left
const penH = (c: Ctx, x: number, y: number, len: number, w: number, col: string, ink: string) => {
  const body = () => rrect(c, x + w * 0.7, y - w / 2, len, w, w * 0.3);
  shape(c, body, col, 5);
  shade(c, body, INK, 0, -w * 0.25, 0.22);
  shape(c, () => rrect(c, x + w * 0.55, y - w * 0.36, 22, w * 0.72, 5), COL.steelIn, 4);
  shape(c, () => polyP(c, [[x + w * 0.58, y - w * 0.24], [x + w * 0.58, y + w * 0.24], [x, y]]), ink, 4);
};

const flameP = (c: Ctx, x: number, yb: number, h: number, w: number) => {
  c.moveTo(x - w / 2, yb); c.bezierCurveTo(x - w * 0.6, yb - h * 0.4, x - w * 0.15, yb - h * 0.62, x, yb - h);
  c.bezierCurveTo(x + w * 0.15, yb - h * 0.62, x + w * 0.6, yb - h * 0.4, x + w / 2, yb); c.closePath();
};
const flame = (c: Ctx, x: number, yb: number, h: number, w: number, k: string[]) => {
  shape(c, () => flameP(c, x, yb, h, w), k[0], 6);
  shape(c, () => flameP(c, x, yb, h * 0.78, w * 0.7), k[1], 0);
  shape(c, () => flameP(c, x, yb, h * 0.5, w * 0.4), k[2], 0);
};
const cap = (c: Ctx, x: number, y: number, rx: number) => {
  shadow(c, x + rx * 0.1, y + 14, rx * 1.05, rx * 0.2);
  shape(c, () => ell(c, x, y, rx, rx * 0.26), COL.black, 6);
  shape(c, () => ell(c, x, y - 4, rx * 0.6, rx * 0.15), COL.greyDk, 4);
};
const stove = (c: Ctx, x0: number, x1: number, y: number) => {
  const p = () => polyP(c, [[x0 + 40, y], [x1 - 40, y], [x1, y + 80], [x0, y + 80]]);
  shape(c, p, COL.steel, 6); shade(c, p, COL.steelDk, -30, -8, 0.6);
};
const star = (c: Ctx, sx: number, sy: number, R: number) =>
  shape(c, () => { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? R * 0.42 : R; k ? c.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r) : c.moveTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); }, COL.yellow, 5);
// a magnifying glass: lens centre, radius, handle end
const magnifier = (c: Ctx, cx: number, cy: number, r: number, hx: number, hy: number, inside = "rgba(214,236,250,0.35)") => {
  const an = Math.atan2(hy - cy, hx - cx);
  line(c, [[cx + Math.cos(an) * (r + 6), cy + Math.sin(an) * (r + 6)], [hx, hy]], 40, INK);
  line(c, [[cx + Math.cos(an) * (r + 6), cy + Math.sin(an) * (r + 6)], [hx, hy]], 28, COL.brown);
  shape(c, () => ell(c, cx, cy, r, r), inside, 0);
  c.beginPath(); ell(c, cx, cy, r + 4, r + 4); c.strokeStyle = INK; c.lineWidth = 42; c.stroke();
  c.beginPath(); ell(c, cx, cy, r + 4, r + 4); c.strokeStyle = COL.woodDk; c.lineWidth = 30; c.stroke();
};
const saltBits = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, seedN: number, s = 7) => {
  const r = rnd(seedN);
  for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()); shape(c, () => rrect(c, x + Math.cos(a) * rx * d - s / 2, y + Math.sin(a) * ry * d - s / 2, s, s, 1.5), WHITE, 2); }
};

// ============================================================ flows
// flow.e1 : the secret note and a pen give the same bands
const card_e1 = (c: Ctx) => {
  ground(c);
  // the secret note
  shadow(c, 215, 700, 150, 22);
  shape(c, () => rrect(c, 80, 230, 270, 460, 10), WHITE, 6);
  star(c, 215, 300, 40);
  for (let i = 0; i < 4; i++) { const y = 400 + i * 60; c.beginPath(); c.moveTo(120, y); for (let k = 0; k < 6; k++) c.quadraticCurveTo(120 + k * 35 + 10, y - 26, 120 + k * 35 + 25, y + 4); c.strokeStyle = PEN_DARK; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  // two strips with the same bands, and the equals sign
  [455, 655].forEach((x) => { strip(c, x, 200, 120, 540); wet(c, x, 330, 724, 120); band(c, x, 430, 100, DYE.blue); band(c, x, 540, 100, DYE.pink); startLine(c, x, 650, 120, PEN_DARK, 12); });
  line(c, [[532, 450], [578, 450]], 9); line(c, [[532, 492], [578, 492]], 9);
  // the pen B
  penV(c, 900, 230, 330, 100, COL.teal, PEN_DARK);
  letter(c, "B", 878, 300, 70, WHITE, 11);
  arrow(c, [[355, 470], [385, 470]], RED, 9);
  arrow(c, [[830, 470], [725, 470]], RED, 9);
};

// flow.e2 : yellow stays one band, green splits in two, black in three
const card_e2 = (c: Ctx) => {
  ground(c);
  const cfg: [number, string, string, [string, number][]][] = [
    [180, DYE.yellow, "1", [[DYE.yellow, 650]]],
    [540, COL.green, "2", [[DYE.yellow, 600], [DYE.blue, 710]]],
    [900, "#4a4560", "3", [[DYE.yellow, 570], [DYE.pink, 660], [DYE.purple, 750]]],
  ];
  cfg.forEach(([x, pc, n, bands]) => {
    penV(c, x - 40, 70, 210, 78, pc, pc === "#4a4560" ? PEN_DARK : pc);
    write(c, n, x + 40, 110, 110, INK, 13);
    strip(c, x, 370, 150, 600); wet(c, x, 470, 954, 150);
    bands.forEach(([col, y]) => band(c, x, y, 120, col));
    startLine(c, x, 880, 150, PEN_DARK, 12);
  });
};

// flow.e3 : a wet spoon in the flame glows yellow-orange; a cup with salt beside
const card_e3 = (c: Ctx) => {
  ground(c);
  stove(c, 60, 700, 860);
  cap(c, 380, 852, 120);
  [[-80, 120, 56], [80, 120, 56], [0, 200, 90]].forEach(([dx, h, w]) => flame(c, 380 + dx, 850, h, w, BLUE));
  flame(c, 510, 850, 360, 230, YELL);
  // spoon handle from a grown-up's hand at the upper left, wet bowl in the flame
  const bx = 400, by = 560, wx = 130, wy = 250, an = Math.atan2(by - wy, bx - wx), dx = Math.cos(an), dy = Math.sin(an);
  line(c, [[wx, wy], [bx, by]], 30, INK); line(c, [[wx, wy], [bx, by]], 18, COL.steel);
  const sx = bx + dx * 55, sy = by + dy * 55, sp = () => ell(c, sx, sy, 92, 58, an);
  shape(c, sp, COL.steel, 7); shade(c, sp, COL.steelDk, -16, -12, 0.6);
  shape(c, () => ell(c, sx + dx * 4, sy + dy * 4, 66, 36, an), COL.water, 4);
  const hx = 70;
  shape(c, () => rrect(c, hx - 50, wy - 46, 100, 92, 20), CLOTH.adult, 6);
  shape(c, () => ell(c, hx + 78, wy, 46, 40), SKIN.adult, 6);
  // the cup with salt and an arrow to the flame
  bowl(c, 880, 700, 130, COL.steelIn);
  shape(c, () => { c.moveTo(785, 700); c.quadraticCurveTo(880, 590, 975, 700); c.quadraticCurveTo(880, 740, 785, 700); c.closePath(); }, WHITE, 5);
  saltBits(c, 880, 685, 70, 20, 14, 5, 12);
  arrow(c, [[820, 560], [740, 500], [650, 500]], RED, 10);
};

// flow.a1 : one black dot before, colours after five minutes
const card_a1 = (c: Ctx) => {
  ground(c);
  strip(c, 220, 230, 160, 640); startLine(c, 220, 700, 160, PEN_DARK, 30);
  arrow(c, [[350, 500], [500, 500]], RED, 12);
  const x = 680;
  strip(c, x, 230, 160, 640); wet(c, x, 650, 854, 160);
  band(c, x, 560, 130, DYE.purple, 56); band(c, x, 470, 130, DYE.blue, 56); band(c, x, 380, 130, DYE.yellow, 56);
  startLine(c, x, 700, 160, PEN_DARK, 14);
  // a clock
  shadow(c, 936, 480, 110, 22);
  shape(c, () => ell(c, 930, 330, 105, 105), WHITE, 7);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[930 + Math.sin(a) * 84, 330 - Math.cos(a) * 84], [930 + Math.sin(a) * 96, 330 - Math.cos(a) * 96]], 5); }
  line(c, [[930, 330], [930, 262]], 9); line(c, [[930, 330], [985, 360]], 9);
  write(c, "5", 912, 500, 110, INK, 13);
};

// flow.a2 : chalk with an ink ring, then the colours climbing it
const chalk = (c: Ctx, x: number, top: number, bot: number, w = 120) => {
  const body = () => rrect(c, x - w / 2, top, w, bot - top, 14);
  shape(c, body, WHITE, 6); shade(c, body, COL.steelDk, -w * 0.2, 0, 0.35);
};
const card_a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 230, 840, 100, 18);
  chalk(c, 210, 260, 830);
  shape(c, () => rrect(c, 150, 690, 120, 34, 6), PEN_DARK, 5);
  arrow(c, [[320, 520], [450, 520]], RED, 12);
  bowl(c, 740, 790, 270);
  shape(c, () => ell(c, 740, 790, 240, 46), COL.water, 0);
  chalk(c, 740, 230, 812);
  [[630, DYE.yellow], [545, DYE.blue], [460, DYE.purple]].forEach(([y, col]) => band(c, 740, y as number, 120, col as string, 52));
  shape(c, () => rrect(c, 680, 712, 120, 26, 6), PEN_DARK, 5);
  shape(c, () => ell(c, 740, 806, 90, 16), "rgba(233,243,255,0.8)", 0);
  arrow(c, [[920, 740], [920, 420]], RED, 12);
};

// flow.a3 : water spreads the ink dots into rings; a finished flower
const card_a3 = (c: Ctx) => {
  ground(c);
  const cx = 380, cy = 700;
  shadow(c, cx + 20, cy + 245, 250, 26);
  shape(c, () => ell(c, cx, cy, 250, 250), WHITE, 7);
  [[225, COL.green], [190, DYE.blue], [155, DYE.purple], [120, DYE.pink], [85, DYE.orange], [50, DYE.yellow]].forEach(([r, col]) => shape(c, () => ell(c, cx, cy, r as number, r as number), col as string, 0));
  // spoon dripping on the middle
  line(c, [[140, 90], [330, 270]], 32, INK); line(c, [[140, 90], [330, 270]], 20, COL.steel);
  shape(c, () => ell(c, 365, 300, 70, 44, 0.6), COL.steel, 6);
  shape(c, () => ell(c, 365, 300, 48, 26, 0.6), COL.water, 0);
  shape(c, () => { c.moveTo(380, 400); c.quadraticCurveTo(390, 440, 380, 460); c.quadraticCurveTo(354, 440, 380, 400); c.closePath(); }, COL.water, 4);
  // a finished paper flower
  line(c, [[800, 400], [800, 950]], 22, INK); line(c, [[800, 400], [800, 950]], 11, COL.green);
  shape(c, () => { c.moveTo(800, 780); c.quadraticCurveTo(900, 700, 960, 760); c.quadraticCurveTo(900, 840, 800, 780); c.closePath(); }, COL.leaf, 5);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; shape(c, () => ell(c, 800 + Math.cos(a) * 95, 320 + Math.sin(a) * 95, 70, 42, a), [DYE.pink, DYE.purple][k % 2], 5); }
  shape(c, () => ell(c, 800, 320, 62, 62), DYE.orange, 5); shape(c, () => ell(c, 800, 320, 34, 34), DYE.yellow, 0);
};

// flow.a4 : three white powders; only one fizzes with lemon
const card_a4 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x, i) => {
    plate(c, x, 560, 160, 80);
    const heap = () => { c.moveTo(x - 90, 560); c.bezierCurveTo(x - 80, 470, x + 80, 470, x + 90, 560); c.quadraticCurveTo(x, 590, x - 90, 560); c.closePath(); };
    shape(c, heap, WHITE, 5); shade(c, heap, COL.steelDk, -30, -8, 0.35);
    saltBits(c, x, 545, 55, 18, 6, 11 + i, 6);
  });
  [[870, 370, 34], [930, 300, 24], [840, 280, 26], [900, 220, 18], [800, 400, 16], [960, 400, 20]].forEach(([x, y, r]) => {
    shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.7)", 5); shine(c, [[x - r * 0.4, y - r * 0.3], [x - r * 0.2, y - r * 0.55]], 5);
  });
  // half a lemon, lying in front
  shadow(c, 556, 880, 150, 24);
  shape(c, () => ell(c, 540, 830, 150, 110), COL.yellow, 7);
  shape(c, () => ell(c, 540, 830, 122, 86), "#fff3b0", 5);
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[540 + Math.cos(a) * 12, 830 + Math.sin(a) * 9], [540 + Math.cos(a) * 118, 830 + Math.sin(a) * 82]], 4, COL.yellow); }
  arrow(c, [[680, 780], [760, 720], [810, 660]], RED, 10);
};

// flow.p1 : the ink library chart
const card_p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 450, 36);
  shape(c, () => rrect(c, 80, 110, 920, 700, 14), COL.paper, 7);
  const pat: [string, number][][] = [
    [[DYE.yellow, 330], [DYE.blue, 430], [DYE.purple, 520]],
    [[DYE.yellow, 380], [DYE.pink, 500]],
    [[DYE.blue, 400], [DYE.purple, 510]],
    [],
    [[DYE.yellow, 360], [DYE.orange, 450], [DYE.blue, 540]],
  ];
  const pens = ["#4a4560", COL.red, COL.teal, COL.yellow, COL.green];
  [190, 365, 540, 715, 890].forEach((x, i) => {
    strip(c, x, 160, 100, 460);
    pat[i].forEach(([col, y]) => band(c, x, y, 80, col, 40));
    startLine(c, x, 540, 100, PEN_DARK, 10);
    penH(c, x - 60, 690, 100, 46, pens[i], pens[i]);
  });
};

// flow.c1 : blurry bands before, sharp bands after
const card_c1 = (c: Ctx) => {
  ground(c);
  strip(c, 230, 330, 160, 520); wet(c, 230, 430, 800, 160);
  c.globalAlpha = 0.6;
  band(c, 230, 700, 120, DYE.purple, 130); band(c, 230, 620, 120, DYE.blue, 130); band(c, 230, 540, 120, DYE.yellow, 110);
  c.globalAlpha = 1;
  startLine(c, 230, 740, 160, PEN_DARK, 22);
  arrow(c, [[350, 580], [520, 580]], RED, 12);
  strip(c, 760, 110, 160, 760); wet(c, 760, 190, 800, 160);
  band(c, 760, 690, 120, DYE.purple, 44); band(c, 760, 500, 120, DYE.blue, 44); band(c, 760, 290, 120, DYE.yellow, 44);
  startLine(c, 760, 740, 160, PEN_DARK, 10);
};

// ============================================================ terms
// a grown-up with a hand raised: the wrist position is returned
const raisedWrist = (x: number, y: number, h: number, a1: number, a2: number): [number, number] => {
  const sx = x + h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const goggles = (c: Ctx, x: number, hy: number, head: number) => {
  line(c, [[x - head * 1.02, hy - head * 0.05], [x + head * 1.02, hy - head * 0.05]], 9, INK);
  [-1, 1].forEach((s) => shape(c, () => ell(c, x + s * head * 0.42, hy - head * 0.02, head * 0.36, head * 0.3), "rgba(214,236,250,0.8)", 6));
};

// term.0 Chemist
const card_t0 = (c: Ctx) => {
  ground(c);
  const px = 330, py = 1000, ph = 780, [wx, wy] = raisedWrist(px, py, ph, -0.6, -1.2);
  strip(c, wx, wy - 230, 100, 260);
  band(c, wx, wy - 150, 80, DYE.yellow, 34); band(c, wx, wy - 100, 80, DYE.blue, 34); band(c, wx, wy - 50, 80, DYE.purple, 34);
  person(c, px, py, ph, { adult: true, armR: [-0.6, -1.2] });
  goggles(c, px, py - ph * 0.74 - ph * 0.13 * 1.05, ph * 0.13);
  // a table with a jar of red chilli powder
  shape(c, () => rrect(c, 620, 820, 440, 46, 8), COL.wood, 6);
  shape(c, () => rrect(c, 660, 866, 40, 160, 6), COL.woodDk, 5); shape(c, () => rrect(c, 980, 866, 40, 160, 6), COL.woodDk, 5);
  shadow(c, 850, 826, 120, 14);
  shape(c, () => rrect(c, 770, 610, 160, 210, 22), COL.glass, 6);
  shape(c, () => rrect(c, 776, 650, 148, 164, 18), COL.red, 0);
  shape(c, () => rrect(c, 770, 610, 160, 210, 22), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 780, 570, 140, 44, 8), COL.yellow, 6);
  shine(c, [[795, 680], [795, 780]], 8);
};

// term.1 Substance: water, salt, sugar
const card_t1 = (c: Ctx) => {
  ground(c);
  [200, 540, 880].forEach((x, i) => {
    const y = 520, r = 140;
    bowl(c, x, y, r);
    if (i === 0) { shape(c, () => ell(c, x, y + 4, r * 0.84, r * 0.16), COL.water, 0); shape(c, () => ell(c, x - 40, y, 36, 6), COL.drop, 0); return; }
    const heap = () => { c.moveTo(x - r * 0.8, y + 4); c.bezierCurveTo(x - r * 0.6, y - r * 0.55, x + r * 0.6, y - r * 0.55, x + r * 0.8, y + 4); c.quadraticCurveTo(x, y + r * 0.2, x - r * 0.8, y + 4); c.closePath(); };
    shape(c, heap, i === 1 ? WHITE : "#fff4dc", 5); shade(c, heap, COL.steelDk, -20, -6, 0.3);
    if (i === 1) saltBits(c, x, y - 28, r * 0.5, r * 0.15, 9, 3, 9);
    else for (let k = 0; k < 7; k++) { const sx = x - 60 + k * 20, sy = y - 40 + (k % 3) * 14; line(c, [[sx - 6, sy], [sx + 6, sy]], 4, COL.yellow); line(c, [[sx, sy - 6], [sx, sy + 6]], 4, COL.yellow); }
  });
};

// term.2 Mixture: salt water dries in the sun, crystals left at the edge
const card_t2 = (c: Ctx) => {
  ground(c);
  const sx = 190, sy = 190;
  for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5; line(c, [[sx + Math.cos(a) * 110, sy + Math.sin(a) * 110], [sx + Math.cos(a) * 160, sy + Math.sin(a) * 160]], 12, COL.orange); }
  shape(c, () => ell(c, sx, sy, 85, 85), COL.yellow, 7);
  plate(c, 590, 710, 380, 190);
  shape(c, () => ell(c, 590, 712, 215, 100), COL.water, 0);
  shape(c, () => ell(c, 540, 690, 70, 12), COL.drop, 0);
  const r = rnd(9);
  for (let i = 0; i < 80; i++) { const a = r() * 6.28, d = 235 + r() * 55, x = 590 + Math.cos(a) * d * 1.0, y = 712 + Math.sin(a) * d * 0.5; const s = 14 + r() * 10; shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 3), WHITE, 3); }
  arrow(c, [[520, 560], [520, 430]], RED, 10); arrow(c, [[660, 560], [660, 430]], RED, 10);
};

// term.3 Dye: pens, food colour, a saree
const card_t3 = (c: Ctx) => {
  ground(c);
  [[250, COL.red], [340, DYE.blue], [430, DYE.yellow], [520, DYE.purple]].forEach(([y, col]) => {
    penH(c, 60, y as number, 280, 56, col as string, col as string);
    shape(c, () => rrect(c, 380, (y as number) - 26, 110, 52, 12), col as string, 5);
  });
  // bottle of green food colour
  shadow(c, 640, 880, 100, 18);
  shape(c, () => rrect(c, 560, 580, 160, 290, 28), COL.glass, 6);
  shape(c, () => rrect(c, 566, 650, 148, 214, 24), COL.green, 0);
  shape(c, () => rrect(c, 560, 580, 160, 290, 28), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 595, 500, 90, 84, 10), COL.glass, 5);
  shape(c, () => rrect(c, 585, 440, 110, 66, 14), COL.black, 6);
  shape(c, () => rrect(c, 590, 700, 100, 110, 10), WHITE, 4);
  shape(c, () => { c.moveTo(640, 720); c.quadraticCurveTo(675, 765, 640, 790); c.quadraticCurveTo(605, 765, 640, 720); c.closePath(); }, COL.green, 4);
  shine(c, [[580, 670], [580, 800]], 8);
  // a folded saree: stripes of cloth with a gold border
  shadow(c, 880, 900, 170, 24);
  [[610, "#d6336c"], [690, COL.teal], [770, COL.orange], [850, DYE.purple]].forEach(([y, col]) => {
    shape(c, () => rrect(c, 710, (y as number) - 40, 330, 82, 14), col as string, 6);
    shape(c, () => rrect(c, 710, (y as number) + 16, 330, 26, 8), COL.wood, 4);
    for (let k = 0; k < 7; k++) shape(c, () => ell(c, 745 + k * 46, (y as number) + 29, 9, 7), "#fff3b0", 2);
  });
};

// term.4 Dissolve: sugar into tea
const card_t4 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 930, 400, 480, 0.8, "#a8602e");
  const ty = 930 - 480 * 0.8;
  shape(c, () => ell(c, 540, ty, 150, 20), "#bd7a40", 0);
  // spoon over the glass tipping sugar
  line(c, [[900, 100], [660, 270]], 30, INK); line(c, [[900, 100], [660, 270]], 18, COL.steel);
  shape(c, () => ell(c, 610, 300, 78, 42, -0.5), COL.steel, 6);
  shape(c, () => { c.moveTo(550, 306); c.bezierCurveTo(570, 250, 650, 250, 670, 290); c.quadraticCurveTo(610, 320, 550, 306); c.closePath(); }, WHITE, 4);
  [[570, 370, 1], [545, 430, 0.8], [585, 490, 0.55], [530, 550, 0.35], [575, 610, 0.2], [520, 670, 0.1]].forEach(([x, y, a]) => { c.globalAlpha = a; shape(c, () => rrect(c, x - 9, y - 9, 18, 18, 3), WHITE, 3); c.globalAlpha = 1; });
  arrow(c, [[400, 660], [470, 700], [560, 690]], RED, 10);
};

// term.5 Chromatography: dot at the bottom, separate bands above
const card_t5 = (c: Ctx) => {
  ground(c);
  strip(c, 460, 110, 280, 840); wet(c, 460, 240, 934, 280);
  band(c, 460, 400, 220, DYE.yellow, 70); band(c, 460, 540, 220, DYE.blue, 70); band(c, 460, 680, 220, DYE.purple, 70);
  startLine(c, 460, 810, 280, PEN_DARK, 18);
  arrow(c, [[740, 800], [740, 300]], RED, 14);
};

// term.6 Chromatogram: dried strips stuck in a notebook, A B C
const card_t6 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 440, 30);
  shape(c, () => rrect(c, 100, 90, 880, 820, 14), COL.paper, 7);
  for (let k = 0; k < 9; k++) shape(c, () => ell(c, 100, 160 + k * 90, 16, 16), COL.steelDk, 5);
  const pat: [string, number][][] = [
    [[DYE.yellow, 300], [DYE.blue, 410], [DYE.purple, 520]],
    [[DYE.yellow, 340], [DYE.pink, 470]],
    [[DYE.blue, 380], [DYE.purple, 500]],
  ];
  [290, 560, 830].forEach((x, i) => {
    strip(c, x, 160, 150, 540); pat[i].forEach(([col, y]) => band(c, x, y, 120, col, 44));
    startLine(c, x, 620, 150, PEN_DARK, 10);
    letter(c, "ABC"[i], x - 24, 745, 100, INK, 12);
  });
};

// term.7 Capillary action: a towel in a bucket, the wet patch climbing
const card_t7 = (c: Ctx) => {
  ground(c);
  const x = 540, yb = 920, top = 250, wT = 520, wB = 380, wl = 700;
  shadow(c, x + 40, yb + 8, 250, 26);
  const body = () => { c.moveTo(x - wT / 2, top); c.lineTo(x + wT / 2, top); c.lineTo(x + wB / 2, yb); c.lineTo(x - wB / 2, yb); c.closePath(); };
  shape(c, body, "rgba(214,236,250,0.5)", 0);
  // the towel hangs from the rim into the water
  shape(c, () => rrect(c, x - 110, 190, 220, 700, 8), COL.cloth, 6);
  c.save(); c.beginPath(); rrect(c, x - 110, 190, 220, 700, 8); c.clip();
  c.fillStyle = "rgba(95,125,170,0.55)"; c.beginPath(); c.moveTo(x - 110, 900); c.lineTo(x - 110, 460); for (let k = 0; k <= 8; k++) c.lineTo(x - 110 + k * 27.5, 460 + (k % 2 ? 22 : -10)); c.lineTo(x + 110, 900); c.closePath(); c.fill();
  c.restore();
  shape(c, () => rrect(c, x - 110, 190, 220, 700, 8), "rgba(0,0,0,0)", 6);
  // the water
  const lw = (yy: number) => wB / 2 + ((wT - wB) / 2) * ((yb - yy) / (yb - top));
  c.fillStyle = "rgba(143,195,234,0.55)"; c.beginPath(); c.moveTo(x - lw(wl), wl); c.lineTo(x + lw(wl), wl); c.lineTo(x + wB / 2, yb); c.lineTo(x - wB / 2, yb); c.closePath(); c.fill();
  line(c, [[x - lw(wl), wl], [x + lw(wl), wl]], 5, COL.waterDk);
  shape(c, body, "rgba(0,0,0,0)", 7);
  line(c, [[x - wT / 2 - 10, top], [x + wT / 2 + 10, top]], 10);
  shine(c, [[x - wT * 0.42, top + 40], [x - wB * 0.38, yb - 120]], 9);
  arrow(c, [[x + 190, 700], [x + 190, 450]], RED, 12);
};

// term.8 Element: sodium (salt), copper, oxygen (air bubbles), carbon (pencil)
const card_t8 = (c: Ctx) => {
  ground(c);
  const pos = [[60, 70], [570, 70], [60, 570], [570, 570]];
  pos.forEach(([x, y]) => { shadow(c, x + 255, y + 440, 210, 18); shape(c, () => rrect(c, x, y, 450, 430, 22), COL.paper, 7); });
  // sodium: a salt shaker
  const sx = 285, sy = 285;
  shape(c, () => polyP(c, [[sx - 85, sy - 80], [sx + 85, sy - 80], [sx + 110, sy + 120], [sx - 110, sy + 120]]), COL.glass, 6);
  shape(c, () => polyP(c, [[sx - 92, sy + 0], [sx + 92, sy + 0], [sx + 110, sy + 120], [sx - 110, sy + 120]]), WHITE, 0);
  shape(c, () => polyP(c, [[sx - 85, sy - 80], [sx + 85, sy - 80], [sx + 110, sy + 120], [sx - 110, sy + 120]]), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, sx - 92, sy - 135, 184, 60, 16), COL.steel, 6);
  [-40, 0, 40].forEach((dx) => shape(c, () => ell(c, sx + dx, sy - 105, 8, 8), INK, 0));
  // copper: a coil of wire
  const cx = 795, cy = 285;
  for (let k = 0; k < 6; k++) { const yy = cy - 105 + k * 42; line(c, [[cx - 110, yy + 14], [cx + 110, yy - 14]], 28, INK); line(c, [[cx - 110, yy + 14], [cx + 110, yy - 14]], 16, "#c8743a"); }
  line(c, [[cx - 110, cy - 91], [cx - 150, cy - 130]], 28, INK); line(c, [[cx - 110, cy - 91], [cx - 150, cy - 130]], 16, "#c8743a");
  // oxygen: air bubbles
  [[285, 760, 70], [190, 700, 42], [380, 700, 36], [330, 880, 38], [210, 850, 30]].forEach(([x, y, r]) => { shape(c, () => ell(c, x, y, r, r), "rgba(214,236,250,0.7)", 6); shine(c, [[x - r * 0.45, y - r * 0.2], [x - r * 0.2, y - r * 0.5]], 6); });
  // carbon: a pencil
  const px = 795, py = 770;
  c.save(); c.translate(px, py); c.rotate(-0.45);
  shape(c, () => rrect(c, -170, -34, 260, 68, 8), COL.yellow, 6);
  shape(c, () => polyP(c, [[90, -34], [160, 0], [90, 34]]), COL.wood, 6);
  shape(c, () => polyP(c, [[140, -10], [172, 0], [140, 10]]), COL.black, 3);
  shape(c, () => rrect(c, -210, -34, 44, 68, 8), COL.pink, 6);
  line(c, [[-150, -16], [60, -16]], 5, "rgba(255,255,255,0.7)");
  c.restore();
};

// term.9 Sodium: salty rasam spills over onto the flame, which turns yellow-orange
const card_t9 = (c: Ctx) => {
  ground(c);
  stove(c, 40, 1040, 870);
  cap(c, 540, 862, 240);
  [[-150, 170, 70], [-60, 120, 60], [100, 120, 60]].forEach(([dx, h, w]) => flame(c, 540 + dx, 860, h, w, BLUE));
  flame(c, 760, 860, 330, 190, YELL);
  // the pot
  shadow(c, 560, 870, 240, 18);
  const pot = () => rrect(c, 330, 300, 420, 500, 26);
  [[310, 400], [770, 400]].forEach(([x, y]) => shape(c, () => rrect(c, x - 30, y, 60, 24, 10), COL.steelDk, 5));
  shape(c, pot, COL.steel, 7); shade(c, pot, COL.steelDk, -50, 0, 0.5);
  shape(c, () => ell(c, 540, 300, 210, 40), "#b5472b", 6);
  shape(c, () => ell(c, 500, 296, 60, 8), "#e08a5a", 0);
  // rasam running down the side
  shape(c, () => { c.moveTo(700, 320); c.quadraticCurveTo(770, 340, 760, 460); c.quadraticCurveTo(762, 640, 738, 760); c.quadraticCurveTo(715, 760, 722, 660); c.quadraticCurveTo(722, 500, 700, 420); c.closePath(); }, "#b5472b", 5);
  shine(c, [[380, 360], [380, 700]], 10);
};

// term.11 Evidence: two strips with the same bands, under a magnifier
const card_t11 = (c: Ctx) => {
  ground(c);
  [300, 520].forEach((x) => { strip(c, x, 170, 150, 700); wet(c, x, 300, 854, 150); band(c, x, 420, 120, DYE.blue); band(c, x, 540, 120, DYE.pink); startLine(c, x, 740, 150, PEN_DARK, 12); });
  magnifier(c, 410, 480, 270, 900, 950);
  line(c, [[375, 480], [445, 480]], 12); line(c, [[375, 530], [445, 530]], 12);
};

// term.12 Fair test: same strips, same line, same dot height
const card_t12 = (c: Ctx) => {
  ground(c);
  [230, 540, 850].forEach((x, i) => {
    strip(c, x, 220, 180, 700); letter(c, "ABC"[i], x - 28, 80, 100, INK, 13);
    startLine(c, x, 700, 180, PEN_DARK, 18);
  });
  c.globalAlpha = 0.75; line(c, [[90, 714], [990, 714]], 8, RED); c.globalAlpha = 1;
  [230, 540, 850].forEach((x) => dot(c, x, 714, 18, PEN_DARK));
};

// term.13 Forensic scientist: a scientist with a magnifier over handwriting on a cheque
const card_t13 = (c: Ctx) => {
  ground(c);
  const px = 250, py = 840, ph = 760;
  person(c, px, py, ph, { adult: true, armR: [0.9, 1.2] });
  goggles(c, px, py - ph * 0.74 - ph * 0.13 * 1.05, ph * 0.13);
  // the desk, with a cheque on it
  const top = () => polyP(c, [[110, 700], [980, 700], [1050, 790], [40, 790]]);
  shape(c, top, COL.wood, 6);
  shape(c, () => rrect(c, 40, 790, 1010, 240, 8), COL.woodDk, 6);
  shape(c, () => polyP(c, [[470, 712], [770, 712], [790, 772], [450, 772]]), WHITE, 5);
  c.beginPath(); c.moveTo(560, 755); for (let k = 0; k < 5; k++) c.quadraticCurveTo(575 + k * 32, 724, 590 + k * 32, 752); c.strokeStyle = PEN_DARK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
  line(c, [[490, 728], [530, 728]], 5, COL.greyDk);
  // ink strips beside
  [850, 930].forEach((x, i) => { shape(c, () => rrect(c, x - 30, 716, 60, 56, 4), COL.paper, 5); band(c, x, 744, 40, [DYE.blue, DYE.pink][i], 18); });
  const [wx, wy] = raisedWrist(px, py, ph, 0.9, 1.2);
  line(c, [[wx, wy], [535, 556]], 18, INK); line(c, [[wx, wy], [535, 556]], 8, COL.brown);
  magnifier(c, 620, 610, 100, 520, 560);
  shape(c, () => ell(c, wx, wy, 22, 22), SKIN.adult, 5);
};

// ============================================================ explanations
const panelBorders = (c: Ctx) => { line(c, [[365, 80], [365, 1000]], 5, COL.steelDk); line(c, [[715, 80], [715, 1000]], 5, COL.steelDk); };

// expl.0 Three ways to separate a mixture
const card_x0 = (c: Ctx) => {
  ground(c);
  panelBorders(c);
  // 1 a sieve over a bowl
  bowl(c, 190, 800, 130);
  const r = rnd(4);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 150 + r() * 80, 700 + r() * 70, 3.5, 3.5), WHITE, 0);
  shape(c, () => polyP(c, [[60, 400], [320, 400], [270, 520], [110, 520]]), "rgba(214,236,250,0.35)", 6);
  for (let k = 1; k < 5; k++) { line(c, [[60 + k * 52 - 10, 402], [110 + k * 32, 518]], 2.5, COL.steelDk); }
  line(c, [[80, 440], [300, 440]], 2.5, COL.steelDk); line(c, [[95, 480], [285, 480]], 2.5, COL.steelDk);
  shape(c, () => ell(c, 190, 400, 130, 22), COL.steelIn, 6);
  [[140, 396], [180, 402], [225, 396], [165, 410]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 13, 11), COL.greyDk, 4));
  line(c, [[320, 400], [350, 330]], 14, INK); line(c, [[320, 400], [350, 330]], 7, COL.steel);
  [[160, 570], [200, 600], [180, 650]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 4, 4), WHITE, 0));
  arrow(c, [[190, 540], [190, 620]], RED, 8);
  // 2 a magnet over iron filings and sand
  plate(c, 540, 820, 160, 80);
  shape(c, () => { c.moveTo(380, 820); c.bezierCurveTo(430, 740, 650, 740, 700, 820); c.quadraticCurveTo(540, 880, 380, 820); c.closePath(); }, "#e0c58f", 5);
  const r2 = rnd(5);
  for (let i = 0; i < 24; i++) shape(c, () => ell(c, 450 + r2() * 180, 790 + r2() * 40, 3, 3), "#d6b47a", 0);
  // the magnet: a red horseshoe with silver ends, upside down
  const mg = (side: number) => { const mx = 540 + side * 62; shape(c, () => rrect(c, mx - 28, 420, 56, 130, 6), RED, 6); shape(c, () => rrect(c, mx - 28, 530, 56, 52, 4), COL.steelIn, 6); };
  shape(c, () => rrect(c, 482, 340, 116, 100, 30), RED, 6);
  mg(-1); mg(1);
  // filings clinging, rising in lines
  for (let k = 0; k < 2; k++) { const mx = 540 + (k ? 1 : -1) * 62; for (let j = 0; j < 7; j++) line(c, [[mx - 20 + j * 7, 598 + (j % 3) * 9], [mx - 14 + j * 7, 628 + (j % 3) * 9]], 4, COL.black); }
  [[470, 650], [610, 660], [500, 700], [580, 710]].forEach(([x, y]) => line(c, [[x, y], [x + 8, y + 12]], 4, COL.black));
  arrow(c, [[540, 720], [540, 660]], RED, 8);
  // 3 a paper strip in a tumbler
  strip(c, 890, 250, 100, 460);
  band(c, 890, 340, 80, DYE.yellow, 38); band(c, 890, 420, 80, DYE.blue, 38); band(c, 890, 500, 80, DYE.purple, 38);
  const tb = () => { c.moveTo(770, 640); c.lineTo(1010, 640); c.lineTo(980, 900); c.lineTo(800, 900); c.closePath(); };
  shadow(c, 910, 906, 150, 18);
  shape(c, tb, COL.steel, 6); shade(c, tb, COL.steelDk, -30, 0, 0.6);
  shape(c, () => ell(c, 890, 640, 120, 20), COL.steelIn, 6);
  shape(c, () => ell(c, 890, 640, 120, 20), "rgba(0,0,0,0)", 6);
  strip(c, 890, 650, 100, 10);
};

// expl.1 Why black ink splits: three dyes climbing at different speeds
const card_x1 = (c: Ctx) => {
  ground(c);
  strip(c, 300, 90, 260, 860); wet(c, 300, 200, 934, 260);
  band(c, 300, 340, 210, DYE.yellow, 70); band(c, 300, 520, 210, DYE.blue, 70); band(c, 300, 680, 210, DYE.purple, 70);
  startLine(c, 300, 790, 260, PEN_DARK, 17);
  // arrows of three lengths, one for each dye, from the start line up
  [[540, 340, DYE.yellow], [680, 520, DYE.blue], [820, 680, DYE.purple]].forEach(([x, y, col]) => {
    arrow(c, [[x as number, 800], [x as number, y as number]], RED, 14);
    shape(c, () => ell(c, x as number, (y as number) - 62, 38, 38), col as string, 6);
  });
  shape(c, () => ell(c, 680, 880, 14, 14), PEN_DARK, 0);
};

// expl.2 Why some dyes travel further: the water front, two bands, a ruler
const card_x2 = (c: Ctx) => {
  ground(c);
  // the ruler, 0 at the start line
  const y0 = 820, per = 58;
  shape(c, () => rrect(c, 40, 110, 130, 740, 8), COL.wood, 6);
  for (let mm = 0; mm <= 12; mm++) { const y = y0 - mm * per; line(c, [[170, y], [mm % 2 ? 140 : 118, y]], 4); if (mm % 2 === 0) write(c, String(mm), 52, y - 16, 30, INK, 5); }
  strip(c, 440, 90, 220, 830); wet(c, 440, 300, 906, 220);
  band(c, 440, 470, 170, DYE.blue, 56); band(c, 440, 680, 170, DYE.purple, 56);
  startLine(c, 440, y0 - 14, 220, PEN_DARK, 14);
  dashes(c, 180, 900, 300, "#5f9fd3"); dashes(c, 180, 900, 470, COL.greyDk);
  arrow(c, [[760, y0], [760, 312]], RED, 12);
  arrow(c, [[880, y0], [880, 484]], RED, 12);
};

// expl.3 Sketch pen splits; ballpoint does not
const card_x3 = (c: Ctx) => {
  ground(c);
  // a felt-tip sketch pen
  penV(c, 270, 60, 240, 84, COL.teal, PEN_DARK);
  strip(c, 270, 380, 180, 570); wet(c, 270, 460, 934, 180);
  band(c, 270, 740, 140, DYE.purple, 56); band(c, 270, 640, 140, DYE.blue, 56); band(c, 270, 540, 140, DYE.yellow, 56);
  startLine(c, 270, 830, 180, PEN_DARK, 12);
  // a slim ballpoint pen
  const bx = 810, bt = 90;
  const bb = () => rrect(c, bx - 26, bt, 52, 220, 18);
  shape(c, bb, COL.steelIn, 6); shade(c, bb, COL.steelDk, -12, 0, 0.5);
  shape(c, () => polyP(c, [[bx - 26, bt + 220], [bx + 26, bt + 220], [bx + 10, bt + 290], [bx - 10, bt + 290]]), COL.steel, 6);
  shape(c, () => ell(c, bx, bt + 296, 7, 7), INK, 3);
  shape(c, () => rrect(c, bx + 18, bt + 10, 16, 120, 8), COL.red, 5);
  strip(c, 810, 400, 180, 550); wet(c, 810, 480, 934, 180);
  startLine(c, 810, 830, 180, PEN_DARK, 22);
};

// expl.4 Labs today: a coiled tube in a machine, peaks on a screen, a child's strip
const card_x4 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 900, 280, 22);
  shape(c, () => rrect(c, 40, 280, 520, 620, 24), COL.steel, 7);
  shade(c, () => rrect(c, 40, 280, 520, 620, 24), COL.steelDk, -40, 0, 0.5);
  shape(c, () => ell(c, 300, 560, 190, 190), COL.steelIn, 7);
  for (let k = 0; k < 5; k++) shape(c, () => ell(c, 300, 560, 160 - k * 28, 150 - k * 26), "rgba(0,0,0,0)", 10);
  for (let k = 0; k < 5; k++) { c.beginPath(); ell(c, 300, 560, 160 - k * 28, 150 - k * 26); c.strokeStyle = "#c8743a"; c.lineWidth = 6; c.stroke(); }
  [[110, 340], [170, 340]].forEach(([x, y], i) => shape(c, () => ell(c, x, y, 20, 20), [COL.green, COL.red][i], 5));
  // the screen with peaks
  shape(c, () => rrect(c, 600, 130, 430, 330, 18), COL.black, 7);
  shape(c, () => rrect(c, 622, 152, 386, 286, 8), "#22303a", 0);
  line(c, [[640, 400], [700, 400], [730, 330], [760, 400], [810, 400], [850, 220], [890, 400], [960, 400], [975, 350], [990, 400]], 8, "#c9f06b");
  line(c, [[300, 380], [300, 300], [560, 300], [600, 300]], 10);
  // a child's paper strip
  strip(c, 820, 520, 160, 440); wet(c, 820, 600, 944, 160);
  band(c, 820, 800, 120, DYE.purple, 44); band(c, 820, 710, 120, DYE.blue, 44); band(c, 820, 620, 120, DYE.yellow, 44);
  startLine(c, 820, 860, 160, PEN_DARK, 10);
};

// expl.6 Why heat makes coloured light: a sodium atom, its outer electron gives out a yellow-orange ray
const card_x6 = (c: Ctx) => {
  ground(c);
  const cx = 470, cy = 560;
  [100, 185, 270].forEach((r) => { c.beginPath(); ell(c, cx, cy, r, r); c.strokeStyle = COL.steelDk; c.lineWidth = 6; c.stroke(); });
  shape(c, () => ell(c, cx, cy, 46, 46), COL.red, 6);
  [[-14, -10], [12, -14], [-6, 14], [16, 12]].forEach(([dx, dy], i) => shape(c, () => ell(c, cx + dx, cy + dy, 13, 13), i % 2 ? COL.pink : COL.greyDk, 3));
  const electrons = (r: number, n: number, off: number) => { for (let k = 0; k < n; k++) { const a = off + (k * Math.PI * 2) / n; shape(c, () => ell(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 16, 16), COL.blue, 5); } };
  electrons(100, 2, 0.5); electrons(185, 8, 0.2);
  // the one outer electron
  const ex = cx + Math.cos(-0.7) * 270, ey = cy + Math.sin(-0.7) * 270;
  shape(c, () => ell(c, ex, ey, 22, 22), COL.blue, 6);
  // a yellow-orange wavy ray going out
  const ray = (w: number, col: string) => { c.beginPath(); for (let k = 0; k <= 40; k++) { const t = k / 40, x = ex + 30 + t * 330, y = ey - 20 - t * 330 + Math.sin(t * 22) * 26; k ? c.lineTo(x - Math.sin(t * 22) * 0, y) : c.moveTo(x, y); } c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); };
  ray(24, INK); ray(14, COL.yellow);
  [[900, 110], [960, 190]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 16, 16), COL.yellow, 4));
};

// expl.8 Tap water: a magnifier shows tiny bits of other substances
const card_x8 = (c: Ctx) => {
  ground(c);
  glass(c, 400, 960, 400, 580, 0.8, COL.water);
  const r = rnd(8);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, 280 + r() * 240, 560 + r() * 280, 4, 4), COL.drop, 0);
  magnifier(c, 650, 500, 220, 940, 880, COL.water);
  const cols = [COL.orange, "#c9b79a", WHITE, COL.brown, COL.greyDk, COL.orange];
  [[570, 420], [700, 380], [620, 560], [730, 520], [680, 640], [560, 520]].forEach(([x, y], i) => shape(c, () => ell(c, x, y, 20 - (i % 3) * 4, 20 - (i % 3) * 4), cols[i], 4));
  shine(c, [[500, 400], [540, 340]], 12);
};

export const ic_chemistryDetectivesFindingOutWhatsInsideL3 = cards("sci.chemistry-detectives.finding-out-whats-inside.L3 cards", [
  card_e1, card_e2, card_e3, card_a1, card_a2, card_a3, card_a4, card_p1, card_c1,
  card_t0, card_t1, card_t2, card_t3, card_t4, card_t5, card_t6, card_t7, card_t8, card_t9, card_t11, card_t12, card_t13,
  card_x0, card_x1, card_x2, card_x3, card_x4, card_x6, card_x8,
]);
