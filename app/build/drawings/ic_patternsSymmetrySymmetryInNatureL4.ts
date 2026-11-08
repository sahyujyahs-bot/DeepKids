import type { Ctx } from "./core";
import { INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, write, hand, bowl, cards } from "./flatKit";

// SYMMETRY IN NATURE (L4) · flat cards. Objects only, no people. Same flat look as the other set-up cards.

const CARD = "#f6e3b4", BOARD = "#d9b382", SHEET = "#fffdf7", GRAPH = "#4a4658";

// ---------------------------------------------------------------- small helpers
const dash = (c: Ctx, a: number[], b: number[], w = 5, col: string = INK, on = 14, off = 12) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  for (let t = 0; t < L; t += on + off) { const e = Math.min(t + on, L); line(c, [[a[0] + ux * t, a[1] + uy * t], [a[0] + ux * e, a[1] + uy * e]], w, col); }
};
const dashPoly = (c: Ctx, pts: number[][], w = 5, col: string = INK) => { for (let i = 0; i + 1 < pts.length; i += 2) line(c, [pts[i], pts[i + 1]], w, col); };
const slab = (c: Ctx, x: number, y: number, w: number, h: number, fill: string, r = 8, lw = 6) => {
  shape(c, () => rrect(c, x + 12, y + 14, w, h, r), SH, 0);
  shape(c, () => rrect(c, x, y, w, h, r), fill, lw);
};
const polySlab = (c: Ctx, pts: number[][], fill: string, lw = 6) => {
  c.save(); c.translate(12, 14); shape(c, () => polyP(c, pts), SH, 0); c.restore();
  shape(c, () => polyP(c, pts), fill, lw);
};
const star = (c: Ctx, x: number, y: number, r: number, fill: string = COL.yellow) =>
  shape(c, () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; if (i) c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, fill, 5);
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
// a symmetric path from bezier pieces, coordinates in units of s: 2 numbers = a point, 6 numbers = a curve
const cp = (c: Ctx, s: number, segs: number[][]) => {
  segs.forEach((g, i) => { if (g.length === 2) { if (i) c.lineTo(g[0] * s, g[1] * s); else c.moveTo(g[0] * s, g[1] * s); } else c.bezierCurveTo(g[0] * s, g[1] * s, g[2] * s, g[3] * s, g[4] * s, g[5] * s); });
  c.closePath();
};

// capital letters as strokes: (0..0.6) wide, (0..1) tall; top-left at (x, y); flip = mirrored left-right
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.66], [0.48, 0.66]]],
  B: [[[0, 0], [0, 1], [0.38, 1], [0.56, 0.78], [0.38, 0.52], [0, 0.52]], [[0.38, 0.52], [0.52, 0.28], [0.38, 0], [0, 0]]],
  C: [[[0.6, 0.15], [0.3, 0], [0.05, 0.3], [0.05, 0.7], [0.3, 1], [0.6, 0.85]]],
  D: [[[0, 0], [0, 1], [0.3, 1], [0.58, 0.75], [0.58, 0.25], [0.3, 0], [0, 0]]],
  F: [[[0.55, 0], [0, 0], [0, 1]], [[0, 0.5], [0.42, 0.5]]],
  H: [[[0, 0], [0, 1]], [[0.58, 0], [0.58, 1]], [[0, 0.5], [0.58, 0.5]]],
  S: [[[0.55, 0.12], [0.35, 0], [0.12, 0.08], [0.05, 0.28], [0.2, 0.45], [0.4, 0.55], [0.55, 0.72], [0.5, 0.92], [0.28, 1], [0.05, 0.9]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 7, flip = false) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  for (const st of LET[ch]) { c.beginPath(); st.forEach(([u, v], i) => { const px = x + (flip ? 0.6 - u : u) * h, py = y + v * h; if (i) c.lineTo(px, py); else c.moveTo(px, py); }); c.stroke(); }
};
const word = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 7) => { [...t].forEach((ch, i) => letter(c, ch, x + i * h * 0.85, y, h, col, w)); };

// a solid F (the stencil shape), centre (cx, cy), height h; fx / fy = -1 flips it, rot turns it
const Fsolid = (c: Ctx, cx: number, cy: number, h: number, fx: number, fy: number, rot: number, fill: string) => {
  c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(fx, fy);
  const P = [[0, 0], [0.6, 0], [0.6, 0.18], [0.2, 0.18], [0.2, 0.42], [0.45, 0.42], [0.45, 0.58], [0.2, 0.58], [0.2, 1], [0, 1]].map(([u, v]) => [(u - 0.3) * h, (v - 0.5) * h]);
  shape(c, () => polyP(c, P), fill, 4);
  c.restore();
};

const ruler = (c: Ctx, x: number, y: number, w: number, h: number, px: number, cmMax: number) => {
  slab(c, x, y, w, h, COL.wood);
  const x0 = x + 20;
  for (let i = 0; i <= cmMax * 2; i++) { const tx = x0 + (i * px) / 2, l = i % 10 === 0 ? 36 : i % 2 === 0 ? 26 : 14; line(c, [[tx, y + 3], [tx, y + l]], i % 2 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= cmMax; cm += 5) write(c, String(cm), x0 + cm * px - (cm >= 10 ? 20 : 8), y + 46, 30, INK, 4.5);
};

// scissors lying flat, pivot at (x, y), blades pointing along rot
const scissors = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => ell(c, 30, 14, 200, 26), SH, 0);
  for (const s of [1, -1]) {
    c.save(); c.rotate(s * 0.13);
    shape(c, () => polyP(c, [[-10, -11], [178, -1], [178, 2], [-10, 11]]), COL.steel, 5);
    shape(c, () => polyP(c, [[-8, -8], [-78, -8], [-78, 8], [-8, 8]]), RED, 5);
    c.beginPath(); ell(c, -108, -s * 20, 34, 24); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); c.strokeStyle = RED; c.lineWidth = 13; c.stroke();
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 10, 10), COL.steelDk, 4);
  c.restore();
};

// a pencil lying flat: eraser end at (x, y), the point toward angle ang
const pencil = (c: Ctx, x: number, y: number, len: number, ang: number) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.save(); c.translate(10, 12); shape(c, () => polyP(c, [[0, -18], [len - 60, -18], [len, 0], [len - 60, 18], [0, 18]]), SH, 0); c.restore();
  shape(c, () => rrect(c, 0, -18, 38, 36, 8), COL.pink, 5);
  shape(c, () => polyP(c, [[38, -18], [70, -18], [70, 18], [38, 18]]), COL.steel, 5);
  const body = () => polyP(c, [[70, -18], [len - 62, -18], [len - 62, 18], [70, 18]]);
  shape(c, body, COL.yellow, 5); shade(c, body, COL.orange, 0, 12, 0.5);
  shape(c, () => polyP(c, [[len - 62, -18], [len, 0], [len - 62, 18]]), "#f1d3a1", 5);
  shape(c, () => polyP(c, [[len - 22, -6], [len, 0], [len - 22, 6]]), "#4a4658", 3);
  c.restore();
};

// a head seen from above (hair at the back, a nose toward ang)
const head = (c: Ctx, x: number, y: number, r: number, ang: number) => {
  for (const s of [-1, 1]) shape(c, () => ell(c, x + Math.cos(ang + (s * Math.PI) / 2) * r, y + Math.sin(ang + (s * Math.PI) / 2) * r, r * 0.2, r * 0.2), SKIN.child, 4);
  shape(c, () => ell(c, x, y, r, r), SKIN.child);
  shape(c, () => { c.moveTo(x, y); c.arc(x, y, r, ang + Math.PI / 2, ang + (3 * Math.PI) / 2); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => polyP(c, [[x + Math.cos(ang - 0.25) * r * 0.9, y + Math.sin(ang - 0.25) * r * 0.9], [x + Math.cos(ang) * r * 1.3, y + Math.sin(ang) * r * 1.3], [x + Math.cos(ang + 0.25) * r * 0.9, y + Math.sin(ang + 0.25) * r * 0.9]]), SKIN.childDk, 4);
};

// a square card with a letter near each corner (tl, tr, br, bl); letters always upright
const lettered = (c: Ctx, cx: number, cy: number, s: number, fill: string, L: string[]) => {
  slab(c, cx - s / 2, cy - s / 2, s, s, fill, 6);
  const o = s * 0.3, h = s * 0.2;
  ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as number[][]).forEach(([dx, dy], i) => letter(c, L[i], cx + dx * o - 0.3 * h, cy + dy * o - 0.5 * h, h, INK, Math.max(4, s * 0.024)));
};
const outlineSq = (c: Ctx, cx: number, cy: number, s: number) => {
  c.beginPath(); c.rect(cx - s / 2, cy - s / 2, s, s); c.strokeStyle = GRAPH; c.lineWidth = 6; c.lineJoin = "round"; c.stroke();
};

// ================================================================ SET-UP CARDS · experiment 1
// e1.0 cutting the 6 cm square from a cereal box
const e1_0 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(0, 110);
  slab(c, 90, 130, 780, 600, BOARD);
  shape(c, () => polyP(c, [[96, 136], [864, 136], [864, 176], [96, 176]]), COL.orange, 0);
  const x0 = 290, y0 = 350, S = 240;
  ruler(c, 270, 214, 740, 88, 40, 18);
  c.beginPath(); c.rect(x0, y0, S, S); c.fillStyle = "#e6c696"; c.fill(); c.strokeStyle = GRAPH; c.lineWidth = 5; c.stroke();
  // the cut so far along the bottom edge, from the right
  line(c, [[x0 + S, y0 + S], [x0 + 70, y0 + S]], 9, INK);
  scissors(c, x0 + 70 + 178, y0 + S, Math.PI);
  line(c, [[x0, y0 - 22], [x0 + S, y0 - 22]], 4, RED);
  line(c, [[x0, y0 - 34], [x0, y0 - 10]], 4, RED); line(c, [[x0 + S, y0 - 34], [x0 + S, y0 - 10]], 4, RED);
  c.restore();
};

// e1.1 corner letters on the front, then on the back (flipped like a page)
const e1_1 = (c: Ctx) => {
  ground(c);
  lettered(c, 290, 560, 340, SHEET, ["A", "B", "C", "D"]);
  lettered(c, 790, 560, 340, CARD, ["B", "A", "D", "C"]);
  const pts = arcPts(540, 520, 250, Math.PI * 1.22, Math.PI * 1.78, 20).map(([x, y]) => [x, y - 20]);
  arrow(c, pts, RED, 11);
};

// e1.2 the square on paper, its outline traced, a star at one corner of the outline
const e1_2 = (c: Ctx) => {
  ground(c);
  slab(c, 150, 90, 780, 880, SHEET);
  const cx = 540, cy = 480, S = 360;
  outlineSq(c, cx, cy, S + 36);
  slab(c, cx - S / 2, cy - S / 2, S, S, CARD, 6);
  star(c, cx - S / 2 - 18, cy - S / 2 - 18, 34);
  pencil(c, 880, 872, 250, Math.atan2(693 - 872, 700 - 880));
};

// e1.3 four fits, a quarter turn more each time, letters read clockwise from the star
const e1_3 = (c: Ctx) => {
  ground(c);
  const SQ = 290, cells: number[][] = [[320, 280], [790, 280], [320, 750], [790, 750]];
  const seqs = [["A", "B", "C", "D"], ["D", "A", "B", "C"], ["C", "D", "A", "B"], ["B", "C", "D", "A"]];
  cells.forEach(([cx, cy], i) => {
    outlineSq(c, cx, cy, SQ + 28);
    lettered(c, cx, cy, SQ, SHEET, seqs[i]);
    star(c, cx - SQ / 2 - 14, cy - SQ / 2 - 14, 26);
    write(c, String(i + 1), cx - 245, cy - 120, 52, COL.tealDk, 7);
    word(c, seqs[i].join(""), cx - 96, cy + SQ / 2 + 38, 54, INK, 7);
  });
};

// e1.4 flip the square over, fit it back, write each new pattern
const e1_4 = (c: Ctx) => {
  ground(c);
  const cx = 300, cy = 560, S = 360;
  outlineSq(c, cx, cy, S + 36);
  lettered(c, cx, cy, S, CARD, ["B", "A", "D", "C"]);
  star(c, cx - S / 2 - 18, cy - S / 2 - 18, 34);
  arrow(c, arcPts(cx, cy + 40, 330, Math.PI * 1.3, Math.PI * 1.7, 20).map(([x, y]) => [x, y - 30]), RED, 11);
  const olds = ["ABCD", "DABC", "CDAB", "BCDA"], news = ["BADC", "CBAD", "DCBA", "ADCB"];
  olds.concat(news).forEach((t, i) => word(c, t, 650, 130 + i * 92 + (i >= 4 ? 34 : 0), 56, i >= 4 ? RED : INK, 8));
};

// ================================================================ SET-UP CARDS · experiment 2
// e2.0 three strips (20 cm by 2 cm), a dot on each, scissors and a ruler
const e2_0 = (c: Ctx) => {
  ground(c);
  [230, 350, 470].forEach((y) => { slab(c, 90, y, 600, 60, CARD, 6); shape(c, () => ell(c, 390, y + 30, 12, 12), RED, 4); });
  ruler(c, 70, 680, 940, 110, 30, 30);
  scissors(c, 880, 430, -1.2);
};

// e2.1 a strip curled over a pencil: dot inside (B), dot outside (C)
const e2_1 = (c: Ctx) => {
  ground(c);
  const panel = (cy: number, inside: boolean, ch: string) => {
    const cx = 580, ty = cy + 70, R = 122;
    slab(c, 140, ty, 800, 38, BOARD, 6);
    shadow(c, cx + 8, ty - 2, 84, 12);
    shape(c, () => ell(c, cx, cy, 70, 70), COL.yellow, 6);
    shape(c, () => ell(c, cx, cy, 44, 44), COL.wood, 5);
    shape(c, () => ell(c, cx, cy, 17, 17), "#4a4658", 4);
    const path = () => { c.beginPath(); c.moveTo(cx - R, ty); c.lineTo(cx - R, cy); c.arc(cx, cy, R, Math.PI, 2 * Math.PI); c.lineTo(cx + R, ty); };
    c.lineCap = "butt"; c.lineJoin = "round";
    path(); c.strokeStyle = INK; c.lineWidth = 36; c.stroke();
    path(); c.strokeStyle = CARD; c.lineWidth = 24; c.stroke();
    shape(c, () => ell(c, cx, cy - (inside ? R - 20 : R + 12), 13, 13), RED, 4);
    letter(c, ch, 190, cy - 70, 140, INK, 14);
  };
  panel(290, true, "B");
  panel(750, false, "C");
};

// e2.2 hold the strip upright by its ends and push the ends together: it bows toward the child (left)
const e2_2 = (c: Ctx) => {
  ground(c);
  const X = (t: number) => 620 - 130 * Math.sin(Math.PI * t), Y = (t: number) => 220 + 620 * t;
  const real = Array.from({ length: 49 }, (_, i) => { const t = -0.07 + (1.14 * i) / 48; return [X(t), Y(t)]; });
  dashPoly(c, Array.from({ length: 41 }, (_, i) => [1240 - X(i / 40), Y(i / 40)]), 6, "#b9b4ab");
  line(c, real, 38, INK); line(c, real, 26, CARD);
  shape(c, () => ell(c, X(0.5) - 15, Y(0.5), 13, 13), RED, 4);
  const hold = (gx: number, gy: number, an: number) => {
    const dx = Math.cos(an), dy = Math.sin(an), wx = gx - 77 * dx, wy = gy - 77 * dy;
    line(c, [[wx - 60 * dx, wy - 60 * dy], [wx - 760 * dx, wy - 760 * dy]], 66, INK);
    line(c, [[wx - 60 * dx, wy - 60 * dy], [wx - 760 * dx, wy - 760 * dy]], 54, CLOTH.child);
    hand(c, wx, wy, an, 1.1, SKIN.child, CLOTH.child);
  };
  hold(X(0), Y(0), 0.58);
  hold(X(1), Y(1), -0.58);
  arrow(c, [[720, 215], [720, 305]], RED, 10);
  arrow(c, [[720, 845], [720, 755]], RED, 10);
  arrow(c, [[445, 530], [330, 530]], RED, 10);
};

// e2.3 the tally table
const tally = (c: Ctx, x: number, yc: number, n: number) => {
  let gx = x;
  for (let left = n; left > 0; left -= 5) {
    const k = Math.min(5, left), strokes = Math.min(4, k);
    for (let i = 0; i < strokes; i++) line(c, [[gx + i * 26, yc - 42], [gx + i * 26, yc + 42]], 7);
    if (k === 5) line(c, [[gx - 12, yc + 28], [gx + 3 * 26 + 12, yc - 28]], 7);
    gx += 3 * 26 + 50;
  }
};
const e2_3 = (c: Ctx) => {
  ground(c);
  slab(c, 100, 130, 880, 800, SHEET, 10);
  [380, 563, 746].forEach((y) => line(c, [[100, y], [980, y]], 5));
  [260, 620].forEach((x) => line(c, [[x, 130], [x, 930]], 5));
  [0, 1].forEach((k) => {
    const x0 = 260 + k * 360, sgn = k === 0 ? -1 : 1;
    head(c, x0 + 80, 255, 40, 0);
    const pts = Array.from({ length: 21 }, (_, i) => [x0 + 250 + sgn * 46 * Math.sin((Math.PI * i) / 20), 170 + (170 * i) / 20]);
    line(c, pts, 24, INK); line(c, pts, 13, CARD);
  });
  const rows = [["A", 6, 4], ["B", 1, 9], ["C", 9, 1]] as [string, number, number][];
  rows.forEach(([ch, a, b], i) => {
    const yc = 471 + i * 183;
    letter(c, ch, 180 - 27, yc - 45, 90, INK, 11);
    tally(c, 300, yc, a); tally(c, 660, yc, b);
  });
};

// ================================================================ CARD PICTURES
// flow.e1 how many ways does each shape fit its outline: square 8, rectangle 4, equal-sided triangle 6
const flow_e1 = (c: Ctx) => {
  ground(c);
  const rows = [215, 540, 865];
  // square
  outlineSq(c, 250, rows[0], 232);
  slab(c, 150, rows[0] - 100, 200, 200, COL.teal, 6);
  // rectangle
  c.beginPath(); c.rect(250 - 154, rows[1] - 84, 308, 168); c.strokeStyle = GRAPH; c.lineWidth = 6; c.stroke();
  slab(c, 110, rows[1] - 75, 280, 150, COL.orange, 6);
  // equal-sided triangle, outline a little bigger
  const tri = (k: number) => [[250, rows[2] - 145 * k], [250 - 125 * k, rows[2] + 72 * k], [250 + 125 * k, rows[2] + 72 * k]];
  c.beginPath(); tri(1.14).forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.strokeStyle = GRAPH; c.lineWidth = 6; c.lineJoin = "round"; c.stroke();
  polySlab(c, tri(1), COL.pink, 6);
  [["8", 0], ["4", 1], ["6", 2]].forEach(([n, i]) => {
    shape(c, () => ell(c, 720, rows[+i], 112, 112), COL.yellow, 7);
    write(c, String(n), 720 - 39, rows[+i] - 65, 130, INK, 14);
  });
};

// flow.e2 record: a strip bent toward me and a strip bent away, seen from above, the dot on the side facing me
const flow_e2 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 90], [540, 990]], 4, "#d2c7b0");
  const panel = (cx: number, toward: boolean) => {
    const baseY = toward ? 330 : 400, bulge = toward ? 100 : -100;
    const pts = Array.from({ length: 31 }, (_, i) => [cx - 170 + (340 * i) / 30, baseY + bulge * Math.sin((Math.PI * i) / 30)]);
    line(c, pts, 38, INK); line(c, pts, 26, CARD);
    const my = baseY + bulge;
    dash(c, [cx, 740], [cx, my + 24], 5, GRAPH);
    shape(c, () => ell(c, cx, my + 15, 14, 14), RED, 4);
    head(c, cx, 840, 78, -Math.PI / 2);
    arrow(c, [[cx - 245, baseY], [cx - 190, baseY]], RED, 10);
    arrow(c, [[cx + 245, baseY], [cx + 190, baseY]], RED, 10);
  };
  panel(290, true);
  panel(790, false);
};

// flow.a1 five borders from one F, each with a different move
const flow_a1 = (c: Ctx) => {
  ground(c);
  const H = 64, tops = [40, 235, 430, 625, 820], cols = [COL.teal, COL.orange, COL.purple, COL.pink, COL.blue];
  tops.forEach((t, i) => slab(c, 100, t, 880, 150, CARD, 8));
  const cy = (i: number) => tops[i] + 75;
  for (let x = 170; x <= 940; x += 150) Fsolid(c, x, cy(0), H, 1, 1, 0, cols[0]);
  for (let k = 0, x = 160; x <= 940; x += 120, k++) { Fsolid(c, x, cy(1), H, k % 2 ? -1 : 1, 1, 0, cols[1]); if (x + 60 < 940) dash(c, [x + 60, tops[1] + 10], [x + 60, tops[1] + 140], 4, RED, 10, 8); }
  for (let x = 170; x <= 940; x += 150) { Fsolid(c, x, cy(2) - 36, H, 1, 1, 0, cols[2]); Fsolid(c, x, cy(2) + 36, H, 1, -1, 0, cols[2]); }
  dash(c, [110, cy(2)], [970, cy(2)], 4, RED, 10, 8);
  for (let k = 0, x = 160; x <= 940; x += 120, k++) { Fsolid(c, x, cy(3), H, 1, 1, k % 2 ? Math.PI : 0, cols[3]); if (k % 2 === 0 && x + 60 < 940) shape(c, () => ell(c, x + 60, cy(3), 8, 8), RED, 3); }
  for (let k = 0, x = 160; x <= 940; x += 120, k++) Fsolid(c, x, cy(4) + (k % 2 ? 30 : -30), H, 1, k % 2 ? -1 : 1, 0, cols[4]);
  dash(c, [110, cy(4)], [970, cy(4)], 4, RED, 10, 8);
};

// flow.a2 two mirrors at 90 degrees, one object, four to count
const eraser = (c: Ctx, x: number, y: number, rot: number, fx: number, fy: number, alpha = 1) => {
  c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(rot); c.scale(fx, fy);
  const W = 150, H = 66;
  shape(c, () => rrect(c, -W / 2, -H / 2, W, H, 12), COL.pink, 6);
  c.save(); c.beginPath(); rrect(c, -W / 2, -H / 2, W, H, 12); c.clip(); c.fillStyle = COL.blue; c.fillRect(W / 2 - 46, -H / 2 - 2, 50, H + 4); c.restore();
  c.beginPath(); rrect(c, -W / 2, -H / 2, W, H, 12); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[W / 2 - 46, -H / 2], [W / 2 - 46, H / 2]], 5);
  c.restore();
};
const flow_a2 = (c: Ctx) => {
  ground(c);
  const ox = 480, oy = 660, px = 700, py = 470, th = 0.35;
  dash(c, [px, py], [px, 2 * oy - py], 4, GRAPH);
  dash(c, [px, py], [2 * ox - px, py], 4, GRAPH);
  shape(c, () => polyP(c, [[450, oy + 14], [930, oy + 14], [930, oy + 30], [450, oy + 30]]), COL.brown, 4);
  shape(c, () => polyP(c, [[450, oy], [930, oy], [930, oy + 14], [450, oy + 14]]), "#cfe6f5", 4);
  shape(c, () => polyP(c, [[ox - 30, 200], [ox - 14, 200], [ox - 14, oy + 30], [ox - 30, oy + 30]]), COL.brown, 4);
  shape(c, () => polyP(c, [[ox - 14, 200], [ox, 200], [ox, oy + 14], [ox - 14, oy + 14]]), "#cfe6f5", 4);
  shape(c, () => ell(c, ox, oy, 13, 13), COL.steelDk, 4);
  eraser(c, px, 2 * oy - py, -th, 1, -1, 0.5);
  eraser(c, 2 * ox - px, py, -th, -1, 1, 0.5);
  eraser(c, 2 * ox - px, 2 * oy - py, th + Math.PI, 1, 1, 0.5);
  shadow(c, px + 8, py + 40, 80, 14);
  eraser(c, px, py, th, 1, 1);
  shape(c, () => ell(c, 850, 280, 90, 90), COL.yellow, 7);
  write(c, "4", 850 - 33, 280 - 55, 110, INK, 13);
};

// flow.a3 letters seen from the front and from the back of the paper
const flow_a3 = (c: Ctx) => {
  ground(c);
  slab(c, 60, 150, 410, 820, SHEET);
  slab(c, 610, 150, 410, 820, "#e6f3fb");
  ["F", "A", "S", "H"].forEach((ch, i) => {
    const y = 190 + i * 190;
    letter(c, ch, 265 - 42, y, 140, INK, 14);
    letter(c, ch, 815 - 42, y, 140, "#5b5570", 14, true);
    if (ch === "A" || ch === "H") { const ty = y + 70; line(c, [[905, ty], [927, ty + 26], [973, ty - 32]], 18, INK); line(c, [[905, ty], [927, ty + 26], [973, ty - 32]], 10, COL.green); }
  });
  arrow(c, arcPts(540, 400, 330, Math.PI * 1.27, Math.PI * 1.73, 20).map(([x, y]) => [x, y - 40]), RED, 11);
};

// flow.a4 a curvy tile that tiles
const flow_a4 = (c: Ctx) => {
  ground(c);
  const s = 190, A = 46, B = 52, gx = 135, gy = 200, cols = [COL.teal, COL.orange, COL.pink, COL.blue];
  const tilePath = (x0: number, y0: number) => {
    const N = 24;
    c.moveTo(x0, y0);
    for (let k = 1; k <= N; k++) c.lineTo(x0 + (s * k) / N, y0 - A * Math.sin((Math.PI * k) / N));
    for (let k = 1; k <= N; k++) c.lineTo(x0 + s + B * Math.sin((Math.PI * k) / N), y0 + (s * k) / N);
    for (let k = N - 1; k >= 0; k--) c.lineTo(x0 + (s * k) / N, y0 + s - A * Math.sin((Math.PI * k) / N));
    for (let k = N - 1; k >= 0; k--) c.lineTo(x0 + B * Math.sin((Math.PI * k) / N), y0 + (s * k) / N);
    c.closePath();
  };
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    const x0 = gx + i * s, y0 = gy + j * s;
    shape(c, () => tilePath(x0, y0), cols[(i + j * 2) % 4], 5);
    for (const u of [0.36, 0.64]) { shape(c, () => ell(c, x0 + u * s, y0 - 18, 10, 10), WHITE, 3); shape(c, () => ell(c, x0 + u * s + 1, y0 - 17, 4.5, 4.5), INK, 0); }
  }
};

// flow.p1 the symmetry notebook, day 1: three things with a mirror line
const bfly = (c: Ctx, cx: number, cy: number, s: number, lw = 6) => {
  for (const sx of [1, -1]) {
    c.save(); c.translate(cx, cy); c.scale(sx, 1);
    shape(c, () => cp(c, s, [[0.04, 0.0], [0.7, -0.02, 1.0, 0.3, 0.8, 0.62], [0.6, 0.95, 0.2, 0.75, 0.04, 0.3]]), COL.yellow, lw);
    shape(c, () => ell(c, 0.5 * s, 0.38 * s, 0.2 * s, 0.15 * s, 0.5), COL.pink, lw * 0.6);
    shape(c, () => ell(c, 0.52 * s, 0.38 * s, 0.07 * s, 0.07 * s), RED, 0);
    shape(c, () => cp(c, s, [[0.04, -0.12], [0.25, -0.95, 1.0, -1.0, 1.05, -0.55], [1.1, -0.2, 0.6, 0.0, 0.04, 0.06]]), COL.orange, lw);
    shape(c, () => ell(c, 0.62 * s, -0.46 * s, 0.3 * s, 0.2 * s, -0.4), COL.yellow, lw * 0.6);
    shape(c, () => ell(c, 0.74 * s, -0.56 * s, 0.09 * s, 0.09 * s), WHITE, lw * 0.5);
    shape(c, () => ell(c, 0.44 * s, -0.34 * s, 0.06 * s, 0.06 * s), WHITE, lw * 0.5);
    c.restore();
    line(c, [[cx + sx * 0.02 * s, cy - 0.55 * s], [cx + sx * 0.24 * s, cy - 0.88 * s]], lw * 0.8);
    shape(c, () => ell(c, cx + sx * 0.25 * s, cy - 0.9 * s, 0.045 * s, 0.045 * s), INK, 0);
  }
  shape(c, () => ell(c, cx, cy + 0.04 * s, 0.075 * s, 0.56 * s), INK, 0);
  shape(c, () => ell(c, cx, cy - 0.56 * s, 0.09 * s, 0.09 * s), INK, 0);
};
const leafSym = (c: Ctx, cx: number, cy: number, s: number) => {
  c.save(); c.translate(cx, cy);
  line(c, [[0, s * 0.95], [0, s * 1.3]], 12);
  shape(c, () => cp(c, s, [[0, -1], [0.62, -0.7, 0.72, 0.2, 0, 1], [-0.72, 0.2, -0.62, -0.7, 0, -1]]), COL.leaf, 6);
  line(c, [[0, -0.9 * s], [0, 0.95 * s]], 5, COL.leafDk);
  for (let k = 0; k < 4; k++) for (const sx of [-1, 1]) line(c, [[0, (-0.5 + k * 0.38) * s], [sx * 0.42 * s * (1 - Math.abs(k - 1.5) * 0.18), (-0.72 + k * 0.38) * s]], 4, COL.leafDk);
  c.restore();
};
const katoriFront = (c: Ctx, cx: number, cy: number, s: number) => {
  c.save(); c.translate(cx, cy);
  shape(c, () => cp(c, s, [[-0.8, -0.3], [0.8, -0.3], [0.8, 0.1, 0.5, 0.4, 0, 0.42], [-0.5, 0.4, -0.8, 0.1, -0.8, -0.3]]), COL.steel, 6);
  shape(c, () => ell(c, 0, -0.3 * s, 0.8 * s, 0.1 * s), COL.steelIn, 5);
  c.restore();
};
const flow_p1 = (c: Ctx) => {
  ground(c);
  slab(c, 70, 130, 455, 790, SHEET, 6); slab(c, 555, 130, 455, 790, SHEET, 6);
  for (let y = 215; y < 900; y += 56) { line(c, [[95, y], [500, y]], 3, "#cfd8e6"); line(c, [[580, y], [985, y]], 3, "#cfd8e6"); }
  shape(c, () => rrect(c, 518, 130, 44, 790, 6), COL.tealDk, 6);
  for (let y = 180; y < 900; y += 70) shape(c, () => ell(c, 540, y, 34, 12), COL.steel, 4);
  shape(c, () => ell(c, 145, 205, 40, 40), COL.yellow, 5); write(c, "1", 145 - 12, 205 - 22, 44, INK, 6);
  bfly(c, 300, 430, 120, 5);
  dash(c, [300, 275], [300, 585], 5, RED, 12, 10);
  katoriFront(c, 300, 745, 150);
  dash(c, [300, 650], [300, 840], 5, RED, 12, 10);
  leafSym(c, 783, 480, 250);
  dash(c, [783, 200], [783, 850], 5, RED, 12, 10);
  pencil(c, 985, 880, 250, Math.PI + 0.06);
};

// term.1 reflection: a butterfly with a mirror line down the middle
const term_1 = (c: Ctx) => {
  ground(c);
  bfly(c, 540, 520, 380, 8);
  dash(c, [540, 70], [540, 990], 7, RED, 18, 14);
};

// term.2 rotation: a three-bladed fan looks the same after one third of a turn
const term_2 = (c: Ctx) => {
  ground(c, "#e9e0cf");
  const cx = 540, cy = 540;
  for (let k = 0; k < 3; k++) {
    c.save(); c.translate(cx, cy); c.rotate(-Math.PI / 2 + (k * 2 * Math.PI) / 3);
    const blade = () => rrect(c, 55, -52, 350, 104, 46);
    shape(c, blade, COL.wood); shade(c, blade, COL.woodDk, 0, 26, 0.55);
    shape(c, () => rrect(c, 40, -28, 70, 56, 10), COL.steel, 5);
    c.restore();
  }
  shape(c, () => ell(c, cx, cy, 80, 80), COL.steel); shape(c, () => ell(c, cx, cy, 40, 40), COL.steelIn, 5);
  shape(c, () => ell(c, cx, cy - 330, 26, 26), RED, 5);
  const gx = cx + 330 * Math.cos(Math.PI / 6), gy = cy + 330 * Math.sin(Math.PI / 6);
  for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(gx, gy, 28, (i * Math.PI) / 6, (i * Math.PI) / 6 + 0.3); c.strokeStyle = RED; c.lineWidth = 6; c.stroke(); }
  arrow(c, arcPts(cx, cy, 440, (-76 * Math.PI) / 180, (16 * Math.PI) / 180, 26), RED, 11);
};

// term.7 handed: a pair of gloves, and a katori that matches its mirror image
const glove = (c: Ctx, cx: number, cy: number, s: number, sx: number) => {
  c.save(); c.translate(cx, cy); c.scale(sx, 1);
  c.save(); c.translate(0.3 * s, 0.4 * s); c.rotate(-0.85);
  shape(c, () => rrect(c, -0.05 * s, -0.1 * s, 0.55 * s, 0.2 * s, 0.1 * s), COL.blue, 6);
  c.restore();
  ([[-0.31, 0.55], [-0.105, 0.78], [0.105, 0.88], [0.31, 0.74]] as number[][]).forEach(([u, h]) => shape(c, () => rrect(c, (u - 0.1) * s, (0.2 - h) * s, 0.2 * s, h * s, 0.1 * s), COL.blue, 6));
  const palm = () => rrect(c, -0.42 * s, 0.05 * s, 0.84 * s, 0.6 * s, 0.12 * s);
  shape(c, palm, COL.blue, 6); shade(c, palm, COL.blueDk, 0.1 * s, 0.06 * s, 0.45);
  shape(c, () => rrect(c, -0.38 * s, 0.6 * s, 0.76 * s, 0.22 * s, 0.05 * s), COL.paper, 6);
  for (let k = 1; k < 5; k++) line(c, [[(-0.38 + k * 0.152) * s, 0.63 * s], [(-0.38 + k * 0.152) * s, 0.79 * s]], 4);
  c.restore();
};
const term_7 = (c: Ctx) => {
  ground(c);
  glove(c, 320, 340, 280, 1);
  glove(c, 760, 340, 280, -1);
  dash(c, [540, 110], [540, 620], 6, RED, 16, 12);
  bowl(c, 540, 830, 200);
};

export const ic_patternsSymmetrySymmetryInNatureL4 = cards("sci.patterns-symmetry.symmetry-in-nature.L4", [
  e1_0, e1_1, e1_2, e1_3, e1_4, e2_0, e2_1, e2_2, e2_3,
  flow_e1, flow_e2, flow_a1, flow_a2, flow_a3, flow_a4, flow_p1, term_1, term_2, term_7,
]);
