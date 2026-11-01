import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, cards, rnd, write } from "./flatKit";

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

// a ragged torn patch of paper: jagged outline round (x, y), with fine fibres standing out of the edge when fuzzy
const torn = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, fill: string, fuzzy = false) => {
  const r = rnd(n), pts = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, k = 0.72 + r() * 0.4; return [x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]; });
  shape(c, () => polyP(c, pts), fill, 5);
  if (fuzzy) {
    pts.forEach(([px, py], i) => { if (i % 2) return; const dx = px - x, dy = py - y, d = Math.hypot(dx, dy); line(c, [[px, py], [px + (dx / d) * 22, py + (dy / d) * 22]], 4, COL.greyDk); });
    for (let k = -1; k <= 1; k++) line(c, [[x - rx * 0.5, y + k * ry * 0.3], [x + rx * 0.5, y + k * ry * 0.3 + 4]], 6, COL.greyDk);
  }
};
// a thread of cloth, curled, standing out of the sticky side
const thread = (c: Ctx, x: number, y: number, an: number, len: number) => {
  const pts = Array.from({ length: 9 }, (_, i) => { const t = i / 8; return [x + Math.cos(an) * len * t + Math.sin(an) * Math.sin(t * 7) * 9, y + Math.sin(an) * len * t - Math.cos(an) * Math.sin(t * 7) * 9]; });
  line(c, pts, 8, INK); line(c, pts, 3.5, COL.teal);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // the table: its top at the very top of the card, its front edge below; the strips hang from that edge
  shape(c, () => rect(c, 0, 0, 1080, 170), WOOD, 0);
  shape(c, () => rect(c, 0, 170, 1080, 110), WOOD_DK, 0);
  line(c, [[60, 60], [420, 60]], 5, WOOD_DK); line(c, [[520, 110], [980, 110]], 5, WOOD_DK);
  line(c, [[0, 170], [1080, 170]], 8); line(c, [[0, 280], [1080, 280]], 8);
  [165, 415, 665, 915].forEach((x, i) => {
    strip(c, x, 215, 820, 130);
    shape(c, () => rect(c, x - 65, 215, 130, 85), "#e0d27e", 0);
    line(c, [[x - 65, 300], [x + 65, 300]], 4, COL.woodDk);
    note(c, x, 870, 200, 150, "ABCD"[i]);
  });
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // the folded cotton cloth, woven in squares
  shadow(c, 560, 960, 440, 36);
  const top = () => rrect(c, 100, 640, 880, 300, 26);
  shape(c, () => rrect(c, 70, 700, 880, 250, 26), "#e8e0cc", 6);
  shape(c, top, COL.cloth, 6);
  c.save(); c.beginPath(); top(); c.clip();
  for (let x = 130; x < 980; x += 50) line(c, [[x, 640], [x, 940]], 3, "rgba(63,177,168,0.5)");
  for (let y = 670; y < 940; y += 50) line(c, [[100, y], [980, y]], 3, "rgba(63,177,168,0.5)");
  c.restore();
  shade(c, top, COL.grey, -60, 0, 0.3);
  // the strip lifting off the cloth, the sticky side bristling with threads
  const pts = bez([250, 790], [520, 810], [715, 505]);
  bentStrip(c, pts, 90);
  const r = rnd(9);
  for (let i = 2; i < 15; i++) { const [px, py] = pts[i]; thread(c, px + (r() - 0.5) * 40, py + (r() - 0.5) * 30, r() * 6.28, 38 + r() * 24); }
  handRight(c, 790, 450, Math.PI / 4, 1.7);
  arrow(c, [[190, 650], [190, 500]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  newspaper(c, 70, 90, 940, 910);
  // four small paper notes, each held to the newspaper by a strip of tape across its top edge
  [190, 410, 630, 850].forEach((x, i) => {
    shadow(c, x + 14, 640, 85, 20);
    shape(c, () => rrect(c, x - 85, 440, 170, 190, 6), WHITE, 5);
    shade(c, () => rrect(c, x - 85, 440, 170, 190, 6), COL.grey, -20, 0, 0.3);
    letter(c, "ABCD"[i], x - 32, 520, 95, 9);
    shape(c, () => rrect(c, x - 105, 410, 210, 70, 6), TAPE, 5);
    shine(c, [[x - 85, 432], [x + 85, 432]], 6);
  });
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  newspaper(c, 40, 380, 1000, 640);
  // where the strip was: a ragged pale patch, the print torn away
  torn(c, 540, 770, 130, 55, 11, WHITE);
  // the strip still stuck down at one end, peeled up in a curve towards the hand; a grey furry patch of paper on its sticky side
  shape(c, () => rrect(c, 90, 700, 340, 90, 6), TAPE, 5);
  const pts = bez([400, 745], [560, 745], [760, 420]);
  bentStrip(c, pts, 100);
  const [px, py] = pts[12];
  torn(c, px, py, 95, 65, 4, COL.grey, true);
  handRight(c, 900, 260, Math.PI / 4, 1.9);
  arrow(c, [[800, 650], [880, 540]]);
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
const steam = (c: Ctx, x: number, y: number, k = 1) => {
  for (const [dx, h0] of [[-45, 230], [10, 290], [65, 220]]) {
    const h = h0 * k;
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
  // the two tumblers with the same water in them: the right one hot, steaming; the left one being filled from the measuring jug
  tumbler(c, 620, 880, 240, 380);
  tumbler(c, 910, 880, 240, 380);
  steam(c, 910, 470);
  // the measuring jug, tipped, held by its handle; a thin stream of water into the left tumbler
  c.save(); c.translate(350, 520); c.rotate(0.9);
  line(c, [[-70, -200], [-135, -190], [-135, -70], [-72, -60]], 30, INK); line(c, [[-70, -200], [-135, -190], [-135, -70], [-72, -60]], 16, COL.glassEdge);
  const jug = () => { c.moveTo(-75, -230); c.lineTo(75, -230); c.lineTo(65, 0); c.lineTo(-65, 0); c.closePath(); };
  shape(c, jug, COL.glass, 5);
  shape(c, () => { c.moveTo(-72, -150); c.lineTo(72, -150); c.lineTo(65, 0); c.lineTo(-65, 0); c.closePath(); }, COL.water, 0);
  shape(c, jug, "rgba(214,236,250,0.35)", 5);
  for (let k = 0; k < 4; k++) line(c, [[-40, -40 - k * 45], [10, -40 - k * 45]], 5, INK);
  c.restore();
  line(c, [[580, 440], [588, 500], [596, 540]], 14, COL.water);
  hand(c, 282, 288, 0.61, 1.7);
  arrow(c, [[690, 290], [690, 380]]);
  write(c, "100 ml", 120, 905, 90);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  freezer(c, 50, 70, 980, 880, 790);
  // both tumblers carried in and lowered onto the same shelf: the left one cold, the right one hot and steaming
  shadow(c, 385, 782, 150, 20); shadow(c, 725, 782, 150, 20);
  tumbler(c, 370, 735, 240, 340);
  tumbler(c, 710, 735, 240, 340);
  steam(c, 710, 330, 0.45);
  hand(c, 215, 560, 0, 1.6, SKIN.adult, CLOTH.adult);
  handRight(c, 865, 560, 0, 1.6, SKIN.adult, CLOTH.adult);
  arrow(c, [[190, 250], [190, 360]]);
  arrow(c, [[890, 250], [890, 360]]);
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
