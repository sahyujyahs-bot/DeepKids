import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, cards, rnd } from "./flatKit";

// sci.how-we-know.stories-of-discovery.L3 set-up cards: tape strips on a newspaper (e1), hot and cold water in the freezer (e2)

const TAPE = "#f3e7a8", TAPE_LINE = "rgba(255,238,150,0.6)", PAPER = "#f1ece0", WOOD = "#e6a95a", WOOD_DK = "#c9873a", ICE = "#d4ebf6", ICE_DK = "#a9cfe3";

// the letters A to D, as strokes, for the flags on the tape strips
const LETTERS: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.64], [0.48, 0.64]]],
  B: [[[0, 1], [0, 0], [0.4, 0.02], [0.52, 0.25], [0.38, 0.48], [0, 0.5]], [[0.38, 0.48], [0.57, 0.72], [0.42, 0.98], [0, 1]]],
  C: [[[0.58, 0.12], [0.3, 0], [0.05, 0.2], [0.02, 0.5], [0.05, 0.8], [0.3, 1], [0.58, 0.88]]],
  D: [[[0, 0], [0, 1], [0.3, 1], [0.57, 0.7], [0.57, 0.3], [0.3, 0], [0, 0]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, w = 7) => {
  c.strokeStyle = INK; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  LETTERS[ch].forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a point on a quadratic curve, for bending strips
const bez = (a: number[], b: number[], d: number[], n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * d[0], u * u * a[1] + 2 * u * t * b[1] + t * t * d[1]]; });
// a hand from the right: the same hand, mirrored, pointing left at angle an (measured as if mirrored back)
const handRight = (c: Ctx, x: number, y: number, an: number, s: number, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, an, s, skin, sleeve); c.restore();
};
// a strip of clear tape from point a to point b (a straight one), with a shine
const strip = (c: Ctx, x: number, y0: number, y1: number, w: number, fill = TAPE) => {
  shadow(c, x + 10, (y0 + y1) / 2 + 8, w * 0.5, (y1 - y0) / 2);
  shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 6), fill, 5);
  shine(c, [[x - w * 0.25, y0 + 14], [x - w * 0.25, y1 - 14]], 6);
};
// a bent strip along a curve of points, drawn as a thick stroke with an ink edge
const bentStrip = (c: Ctx, pts: number[][], w: number, fill = TAPE) => { line(c, pts, w + 10, INK); line(c, pts, w, fill); };
// a small paper flag or note with its letter
const note = (c: Ctx, x: number, y: number, w: number, h: number, ch: string) => {
  shadow(c, x + w * 0.1, y + h / 2 + 6, w * 0.55, h * 0.5);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 5);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.grey, -w * 0.1, 0, 0.35);
  letter(c, ch, x - h * 0.2, y - h * 0.3, h * 0.6, 7);
};
// a newspaper page: headline bar, a picture block, grey lines of print
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 4, w / 2, 24);
  shape(c, () => rrect(c, x, y, w, h, 10), PAPER, 6);
  shape(c, () => rect(c, x + 40, y + 36, w - 80, 44), "#4a4452", 4);
  shape(c, () => rect(c, x + 40, y + 100, 250, 150), "#cfc8b8", 4);
  const r = rnd(5);
  for (let yy = y + 270; yy < y + h - 40; yy += 28) for (const [x0, x1] of [[x + 40, x + w / 2 - 14], [x + w / 2 + 14, x + w - 40]]) { const e = x1 - (r() < 0.25 ? 70 + r() * 80 : 0); line(c, [[x0, yy], [e, yy]], 9, "#9b958a"); }
  for (let yy = y + 106; yy < y + 250; yy += 28) line(c, [[x + 320, yy], [x + w - 40 - (yy % 56 ? 60 : 0), yy]], 9, "#9b958a");
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };

// -------------------------------------------------------------- e1: tape strips

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // the table: top face and front face
  shape(c, () => polyP(c, [[150, 250], [930, 250], [1040, 560], [40, 560]]), WOOD);
  shape(c, () => polyP(c, [[40, 560], [1040, 560], [1040, 1030], [40, 1030]]), WOOD_DK);
  shade(c, () => polyP(c, [[40, 560], [1040, 560], [1040, 1030], [40, 1030]]), "#a8692a", -0, 0, 0);
  line(c, [[40, 560], [1040, 560]], 8);
  // the folded cotton cloth, beside the strips on the table top
  shadow(c, 835, 500, 160, 22);
  shape(c, () => rrect(c, 690, 330, 300, 150, 18), "#ebe4d2", 6);
  shape(c, () => rrect(c, 700, 300, 300, 150, 18), COL.cloth, 6);
  line(c, [[722, 336], [978, 336]], 6, COL.teal);
  for (let k = 0; k < 4; k++) line(c, [[726, 370 + k * 18], [974, 370 + k * 18]], 3, COL.grey);
  // four strips stuck by their top end to the table edge, hanging down, each with a letter flag
  const xs = [150, 300, 450, 600];
  xs.forEach((x, i) => {
    strip(c, x, 520, 880, 76);
    shape(c, () => rect(c, x - 38, 520, 76, 40), "#e0d27e", 0);
    note(c, x, 930, 124, 100, "ABCD"[i]);
  });
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // the folded cloth (two layers)
  shadow(c, 560, 940, 440, 36);
  shape(c, () => rrect(c, 80, 700, 880, 240, 26), "#e8e0cc", 6);
  shape(c, () => rrect(c, 120, 630, 880, 250, 26), COL.cloth, 6);
  shade(c, () => rrect(c, 120, 630, 880, 250, 26), COL.grey, -60, 0, 0.3);
  line(c, [[150, 668], [970, 668]], 6, COL.teal);
  for (let k = 0; k < 5; k++) line(c, [[160, 720 + k * 28], [960, 720 + k * 28]], 3, COL.grey);
  // the strip lifting off the cloth, the sticky side bristling with fibres
  const pts = bez([260, 770], [520, 800], [690, 520]);
  bentStrip(c, pts, 84);
  const r = rnd(9);
  for (let i = 1; i < 15; i++) { const [px, py] = pts[i]; for (const o of [-14, 14]) { c.save(); c.translate(px + o * r(), py + o * 0.8 + (r() - 0.5) * 14); c.rotate(r() * 3); shape(c, () => ell(c, 0, 0, 13, 4.5), WHITE, 2.5); c.restore(); } }
  handRight(c, 790, 450, Math.PI / 4, 1.7);
  arrow(c, [[190, 640], [190, 520]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  newspaper(c, 70, 90, 940, 910);
  [215, 425, 635, 845].forEach((x, i) => {
    strip(c, x, 330, 900, 84, TAPE_LINE);
    note(c, x, 270, 170, 130, "ABCD"[i]);
  });
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  newspaper(c, 70, 160, 940, 840);
  // where the strip was: a pale torn patch, the print gone
  shape(c, () => { c.moveTo(262, 520); c.lineTo(300, 495); c.lineTo(345, 530); c.lineTo(340, 580); c.lineTo(352, 640); c.lineTo(300, 665); c.lineTo(265, 630); c.lineTo(275, 580); c.closePath(); }, WHITE, 4);
  // the strip still stuck down at the top, then peeled back; the grey torn patch of paper on its sticky side
  strip(c, 300, 230, 440, 84);
  const pts = bez([300, 440], [560, 300], [700, 560]);
  bentStrip(c, pts, 84);
  const [px, py] = pts[10];
  shape(c, () => { c.moveTo(px - 45, py - 25); c.lineTo(px - 5, py - 40); c.lineTo(px + 35, py - 20); c.lineTo(px + 45, py + 15); c.lineTo(px + 10, py + 35); c.lineTo(px - 30, py + 22); c.closePath(); }, COL.grey, 4);
  line(c, [[px - 25, py - 5], [px + 25, py + 2]], 5, COL.greyDk);
  note(c, 300, 205, 170, 130, "C");
  handRight(c, 783, 643, -Math.PI / 4, 1.9);
  arrow(c, [[420, 560], [560, 600]]);
};

// -------------------------------------------------------------- e2: hot and cold water

// a steel tumbler standing on its base at (x, y); water or a white skin of ice at the top
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, top: string = COL.water) => {
  const hw = w / 2, bw = w * 0.4, ry = w * 0.2;
  shadow(c, x + w * 0.18, y + 8, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - hw, y - h); c.lineTo(x + hw, y - h); c.lineTo(x + bw, y); c.quadraticCurveTo(x, y + w * 0.1, x - bw, y); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -w * 0.3, 0, 0.7);
  shine(c, [[x - hw * 0.72, y - h * 0.85], [x - bw * 0.72, y - h * 0.15]], 10);
  line(c, [[x - hw * 0.93, y - h * 0.72], [x, y - h * 0.72 + w * 0.06], [x + hw * 0.93, y - h * 0.72]], 4, COL.steelDk);
  shape(c, () => ell(c, x, y - h, hw, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + 3, hw * 0.84, ry * 0.76), top, 3);
};
const steam = (c: Ctx, x: number, y: number) => {
  for (const [dx, h] of [[-45, 230], [10, 290], [65, 220]]) {
    const pts = Array.from({ length: 21 }, (_, i) => [x + dx + Math.sin(i * 0.7 + dx) * 20, y - (i / 20) * h]);
    line(c, pts, 20, "rgba(43,35,64,0.45)"); line(c, pts, 11, WHITE);
  }
};
// the inside of a freezer: a frame, frosty blue walls, a steel shelf at y
const freezer = (c: Ctx, x: number, y: number, w: number, h: number, shelfY: number) => {
  shape(c, () => rrect(c, x, y, w, h, 40), "#e9eef3", 7);
  shape(c, () => rrect(c, x + 36, y + 36, w - 72, h - 72, 24), ICE, 6);
  shade(c, () => rrect(c, x + 36, y + 36, w - 72, h - 72, 24), ICE_DK, -w * 0.22, 0, 0.5);
  shape(c, () => polyP(c, [[x + 36, shelfY - 24], [x + w - 36, shelfY - 24], [x + w - 36, shelfY + 6], [x + 36, shelfY + 6]]), WHITE, 5);
  shape(c, () => rect(c, x + 36, shelfY + 6, w - 72, 34), COL.steel, 5);
  const r = rnd(3);
  for (let i = 0; i < 7; i++) { const sx = x + 90 + r() * (w - 180), sy = y + 80 + r() * (shelfY - y - 400); for (let k = 0; k < 3; k++) { const a = k * 1.047; line(c, [[sx - Math.cos(a) * 16, sy - Math.sin(a) * 16], [sx + Math.cos(a) * 16, sy + Math.sin(a) * 16]], 4, WHITE); } }
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rect(c, 0, 800, 1080, 280), "#e3d3b3", 0);
  line(c, [[0, 800], [1080, 800]], 6);
  tumbler(c, 250, 880, 240, 380);
  tumbler(c, 560, 880, 240, 380);
  steam(c, 560, 470);
  // the measuring cup: a clear jug with a handle and lines up its side
  const x = 890, y = 880;
  line(c, [[x + 80, y - 250], [x + 175, y - 240], [x + 175, y - 110], [x + 62, y - 100]], 30, INK); line(c, [[x + 80, y - 250], [x + 175, y - 240], [x + 175, y - 110], [x + 62, y - 100]], 16, COL.glassEdge);
  glass(c, x, y, 190, 330, 0.6);
  for (let k = 0; k < 5; k++) line(c, [[x - 80 + k * 2, y - 60 - k * 55], [x - 45 + k * 2, y - 60 - k * 55]], 5, INK);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  freezer(c, 50, 70, 980, 880, 790);
  tumbler(c, 370, 780, 240, 340);
  tumbler(c, 710, 780, 240, 340);
  hand(c, 265, 620, 0, 1.5, SKIN.adult, CLOTH.adult);
  handRight(c, 815, 620, 0, 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[150, 480], [235, 480]]);
  arrow(c, [[930, 480], [845, 480]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  freezer(c, 290, 70, 740, 880, 790);
  // the tumbler with the skin of ice, and the one still water
  tumbler(c, 520, 780, 230, 320, WHITE);
  line(c, [[455, 482], [500, 500], [570, 488]], 5, COL.glassEdge); line(c, [[500, 500], [512, 520]], 5, COL.glassEdge); line(c, [[535, 494], [560, 506]], 5, COL.glassEdge);
  tumbler(c, 820, 780, 230, 320);
  shine(c, [[760, 480], [800, 472]], 8);
  // the child, looking in from the left
  const hx = 150, hy = 520, hr = 125;
  shape(c, () => rrect(c, 10, 700, 270, 330, 80), CLOTH.child);
  shade(c, () => rrect(c, 10, 700, 270, 330, 80), CLOTH.childDk, -60, 0, 0.5);
  shape(c, () => rect(c, hx - 40, hr + hy - 40, 80, 120), SKIN.child);
  shape(c, () => ell(c, hx, hy, hr, hr * 1.08), SKIN.child);
  shape(c, () => ell(c, hx + hr * 0.98, hy + 20, 22, 26), SKIN.child);
  shape(c, () => ell(c, hx - 30, hy + 15, 22, 34), SKIN.childDk, 4);
  shape(c, () => { c.moveTo(hx - hr * 1.02, hy + 20); c.bezierCurveTo(hx - hr * 1.2, hy - hr * 1.5, hx + hr * 0.9, hy - hr * 1.6, hx + hr * 0.95, hy - hr * 0.35); c.quadraticCurveTo(hx + 20, hy - hr * 0.7, hx - 40, hy - hr * 0.25); c.quadraticCurveTo(hx - 30, hy + 60, hx - hr * 1.02, hy + 20); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx + 70, hy - 4, 12, 17), INK, 0);
  line(c, [[hx + 50, hy - 36], [hx + 92, hy - 40]], 6);
  c.beginPath(); c.arc(hx + 70, hy + 52, 26, 0.3, 1.9); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
};

export const su_howWeKnowStoriesOfDiscovery = cards("sci.how-we-know.stories-of-discovery.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
