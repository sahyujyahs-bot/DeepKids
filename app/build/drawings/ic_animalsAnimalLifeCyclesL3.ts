import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, leaf, cards } from "./flatKit";

// sci.animals.animal-life-cycles.L3 cards. Same child and grown-up as the set-up cards. Every animal
// faces right and has the same colours on every card: hen brown, chick yellow, frog green, tadpole dark,
// caterpillar green with dark rings, lime butterfly pale yellow with dark edges.

const EGG = "#fbf1dc", EGG_DK = "#e0c99c", HEN = "#b8672f", HEN_DK = "#8a4a20", CHICK = "#ffd34d", CHICK_DK = "#e8b52b";
const FROG = "#6aa53f", FROG_DK = "#46752a", BELLY = "#d6e8a2", TAD = "#4a3f3a", CAT = "#8fcf5a", CAT_DK = "#4f9a34";
const WING = "#f6e27a", WING_DK = "#d9bd45", POND = "#8fc3ea", GRASS = "#cfe3a8", CREAM = "#fff6e0";

// ------------------------------------------------------------------ small things
const eggP = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => () => {
  const co = Math.cos(rot), si = Math.sin(rot);
  const P = (u: number, v: number) => [x + u * co - v * si, y + u * si + v * co];
  const q = (a: number, b: number, d: number, e: number, f: number, g: number) => { const p1 = P(a, b), p2 = P(d, e), p3 = P(f, g); c.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); };
  const s = P(0, -ry); c.moveTo(s[0], s[1]);
  q(rx * 0.42, -ry, rx, -ry * 0.3, rx, ry * 0.2); q(rx, ry * 0.68, rx * 0.55, ry, 0, ry);
  q(-rx * 0.55, ry, -rx, ry * 0.68, -rx, ry * 0.2); q(-rx, -ry * 0.3, -rx * 0.42, -ry, 0, -ry); c.closePath();
};
const egg = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0, col = EGG, dk = EGG_DK) => {
  const p = eggP(c, x, y, rx, ry, rot);
  shape(c, p, col, 6); shade(c, p, dk, -rx * 0.3, -ry * 0.16, 0.8);
  const co = Math.cos(rot), si = Math.sin(rot), P = (u: number, v: number) => [x + u * co - v * si, y + u * si + v * co];
  shine(c, [P(-rx * 0.6, -ry * 0.05), P(-rx * 0.5, -ry * 0.4)], 9);
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
const bubble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", Math.max(2.5, r * 0.18)); line(c, [[x - r * 0.4, y - r * 0.1], [x - r * 0.2, y - r * 0.45]], Math.max(2, r * 0.2), WHITE); };
const glassIn = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, liquid: string, inside: () => void) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, ly = y - h * fill, lw = bot + (top - bot) * fill;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, liquid, 0);
  shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 0);
  inside();
  shape(c, () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, "rgba(214,236,250,0.22)", 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.3)", 5);
  shine(c, [[x - top * 0.8, y - h * 0.85], [x - bot * 0.85, y - h * 0.2]], 8);
};
const bit = (c: Ctx, x: number, y: number, s: number, fn: () => void) => { c.save(); c.translate(x, y); c.scale(s, s); fn(); c.restore(); };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 28), col, 6);
const curry = (c: Ctx, x: number, y: number, s = 1, an = -Math.PI / 2) => {
  // a curry leaf sprig growing from (x, y): a stem with small pointed leaves in pairs
  const L = 230 * s, tx = x + Math.cos(an) * L, ty = y + Math.sin(an) * L;
  line(c, [[x, y], [tx, ty]], 9 * s, INK); line(c, [[x, y], [tx, ty]], 5 * s, COL.leafDk);
  for (let i = 1; i <= 4; i++) { const px = x + Math.cos(an) * L * (i / 5), py = y + Math.sin(an) * L * (i / 5); leaf(c, px, py, 80 * s, an - 0.9, COL.leaf); leaf(c, px, py, 80 * s, an + 0.9, COL.green); }
  leaf(c, tx, ty, 84 * s, an, COL.leaf);
};

// ------------------------------------------------------------------ animals (feet / ground at 0,0, facing right)
const chick = (c: Ctx) => {
  for (const lx of [-8, 18]) { line(c, [[lx, -22], [lx, -2]], 8, INK); line(c, [[lx, -22], [lx, -2]], 4, COL.orange); line(c, [[lx - 10, 0], [lx + 12, 0]], 8, INK); line(c, [[lx - 8, 0], [lx + 10, 0]], 4, COL.orange); }
  const body = () => ell(c, 0, -58, 46, 40); shape(c, body, CHICK); shade(c, body, CHICK_DK, 14, 10, 0.75);
  shape(c, () => ell(c, 26, -102, 30, 28), CHICK);
  shape(c, () => ell(c, -14, -58, 24, 15, 0.5), CHICK_DK, 4);
  shape(c, () => polyP(c, [[52, -106], [78, -98], [52, -90]]), COL.orange, 4);
  shape(c, () => ell(c, 34, -110, 5, 6), INK, 0);
};
const hen = (c: Ctx) => {
  for (const lx of [-8, 26]) { line(c, [[lx, -45], [lx, -3]], 11, INK); line(c, [[lx, -45], [lx, -3]], 6, COL.orange); line(c, [[lx - 16, 0], [lx + 16, 0]], 11, INK); line(c, [[lx - 14, 0], [lx + 14, 0]], 6, COL.orange); }
  shape(c, () => polyP(c, [[-70, -100], [-135, -190], [-100, -80]]), HEN_DK, 5);
  shape(c, () => polyP(c, [[-60, -110], [-100, -200], [-50, -130]]), HEN, 5);
  const body = () => ell(c, 0, -100, 88, 66, -0.08); shape(c, body, HEN); shade(c, body, HEN_DK, 24, 20, 0.7);
  shape(c, () => ell(c, 60, -135, 28, 48, -0.35), HEN, 5);
  shape(c, () => ell(c, -12, -98, 48, 30, 0.35), HEN_DK, 5);
  shape(c, () => ell(c, 82, -178, 32, 30), HEN, 5);
  for (const [cx, cy] of [[66, -213], [84, -216], [100, -206]]) shape(c, () => ell(c, cx, cy, 11, 14), RED, 4);
  shape(c, () => polyP(c, [[108, -184], [140, -174], [108, -166]]), COL.orange, 4);
  shape(c, () => ell(c, 108, -154, 8, 14), RED, 3);
  shape(c, () => ell(c, 90, -184, 5, 6), INK, 0);
};
const frog = (c: Ctx, belly = false) => {
  const body = () => ell(c, 0, -48, 74, 44, -0.12);
  line(c, [[38, -30], [50, 0]], 20, INK); line(c, [[38, -30], [50, 0]], 11, FROG);
  line(c, [[40, 0], [78, 0]], 14, INK); line(c, [[40, 0], [78, 0]], 7, FROG);
  shape(c, body, FROG); shade(c, body, FROG_DK, 20, 18, 0.7);
  shape(c, () => ell(c, 12, -22, 52, 18, -0.1), BELLY, 0);
  shape(c, () => ell(c, 58, -66, 36, 28, -0.1), FROG, 6);
  shape(c, () => ell(c, 52, -94, 16, 16), FROG, 5); shape(c, () => ell(c, 52, -96, 8, 8), INK, 0); shape(c, () => ell(c, 50, -99, 2.5, 2.5), WHITE, 0);
  line(c, [[68, -56], [92, -60]], 4);
  shape(c, () => ell(c, -30, -34, 42, 28, -0.7), FROG, 6);
  line(c, [[-50, -14], [-20, 2], [34, 2]], 18, INK); line(c, [[-50, -14], [-20, 2], [34, 2]], 9, FROG);
  void belly;
};
// a tadpole, head right. legs: 0 none, 1 hind leg buds, 2 hind legs, 3 four legs. tail: 1 full ... 0 none
const tad = (c: Ctx, legs = 0, tail = 1, col = TAD) => {
  const tl = 90 * tail;
  if (tail > 0.05) shape(c, () => { c.moveTo(-14, -12); c.quadraticCurveTo(-14 - tl * 0.6, -34 * (0.4 + 0.6 * tail), -14 - tl, 0); c.quadraticCurveTo(-14 - tl * 0.6, 26 * (0.4 + 0.6 * tail), -14, 12); c.closePath(); }, col, 5);
  if (legs >= 1) { const k = legs === 1 ? 0.45 : 1; line(c, [[-16, 12], [-16 - 22 * k, 30 + 6 * k], [-16 - 6 * k, 42 + 12 * k]], 13, INK); line(c, [[-16, 12], [-16 - 22 * k, 30 + 6 * k], [-16 - 6 * k, 42 + 12 * k]], 6, col === TAD ? "#6a5c52" : col); }
  if (legs >= 3) { line(c, [[14, 14], [24, 34], [14, 46]], 12, INK); line(c, [[14, 14], [24, 34], [14, 46]], 5, "#6a5c52"); }
  shape(c, () => ell(c, 0, 0, 30, 23), col, 5);
  shape(c, () => ell(c, 12, -8, 4.5, 4.5), WHITE, 0);
};
const caterpillar = (c: Ctx, n = 6, col = CAT, dk = CAT_DK) => {
  // head at right, tail at left, a slight hump
  const pts = Array.from({ length: n }, (_, i) => [-i * 38, -Math.sin((i / (n - 1)) * Math.PI) * 22]);
  for (let i = n - 1; i >= 1; i--) line(c, [[pts[i][0] - 6, 22], [pts[i][0] - 6, 34]], 8, INK);
  for (let i = n - 1; i >= 1; i--) { const [x, y] = pts[i]; shape(c, () => ell(c, x, y, 30, 30), col, 6); c.save(); c.beginPath(); ell(c, x, y, 30, 30); c.clip(); c.fillStyle = dk; c.globalAlpha = 0.6; c.fillRect(x - 30, y + 8, 60, 30); c.restore(); c.globalAlpha = 1; line(c, [[x + 4, y - 24], [x + 4, y + 22]], 4, dk); shape(c, () => ell(c, x - 6, y - 12, 5, 5), WHITE, 0); }
  shape(c, () => ell(c, 8, -2, 33, 33), col, 6);
  shape(c, () => ell(c, 22, -6, 6, 7), INK, 0);
  line(c, [[24, 12], [36, 16]], 4);
  for (const [x, y] of [[-10, 0 + 22], [30, 22]]) line(c, [[x, y], [x, y + 12]], 8, INK);
};
const chrysalis = (c: Ctx, col = COL.greenLt, dk = COL.green) => {
  // hangs from (0,0), pointed end down
  const p = () => { c.moveTo(0, 6); c.bezierCurveTo(32, 20, 46, 70, 30, 120); c.bezierCurveTo(22, 150, 6, 168, 0, 176); c.bezierCurveTo(-6, 168, -22, 150, -30, 120); c.bezierCurveTo(-46, 70, -32, 20, 0, 6); c.closePath(); };
  shape(c, p, col, 6); shade(c, p, dk, 18, 6, 0.7);
  line(c, [[-34, 78], [36, 78]], 7, "#7a5a3a");
  for (const [x, y] of [[-6, 120], [10, 146], [-14, 40]]) shape(c, () => ell(c, x, y, 5, 5), "#7a5a3a", 0);
  line(c, [[-6, 30], [6, 130]], 4, dk);
};
const butterfly = (c: Ctx, spread = 1, wcol = WING) => {
  // seen from above, wings open; centre of the body at 0,0
  const side = (m: number) => {
    c.save(); c.scale(m * spread, 1);
    shape(c, () => { c.moveTo(6, -10); c.bezierCurveTo(60, -150, 170, -190, 200, -120); c.bezierCurveTo(215, -60, 120, -10, 6, 8); c.closePath(); }, wcol, 6);
    shape(c, () => { c.moveTo(6, 4); c.bezierCurveTo(130, 10, 190, 70, 150, 130); c.bezierCurveTo(100, 170, 40, 110, 6, 30); c.closePath(); }, wcol, 6);
    for (const [x, y, r] of [[150, -110, 18], [110, -60, 14], [115, 90, 20]]) shape(c, () => ell(c, x, y, r, r), "#3a3540", 0);
    shape(c, () => ell(c, 128, 96, 9, 9), COL.orange, 0);
    line(c, [[40, -20], [150, -100]], 4, "#a8943a"); line(c, [[34, 10], [120, 70]], 4, "#a8943a");
    c.restore();
  };
  side(-1); side(1);
  shape(c, () => ell(c, 0, 4, 14, 62), "#3a3540", 5);
  shape(c, () => ell(c, 0, -62, 16, 16), "#3a3540", 5);
  line(c, [[-6, -74], [-34, -122]], 4); line(c, [[6, -74], [34, -122]], 4);
  shape(c, () => ell(c, -34, -124, 6, 6), INK, 0); shape(c, () => ell(c, 34, -124, 6, 6), INK, 0);
};
const hopper = (c: Ctx, wings = false, bud = false, col = "#8cc152", dk = "#5f9a30") => {
  // side view, head right, feet at y 0
  line(c, [[-30, -66], [-96, -112], [-72, 0]], 22, INK); line(c, [[-30, -66], [-96, -112], [-72, 0]], 14, col);
  line(c, [[-72, 0], [-44, 0]], 12, INK); line(c, [[-72, 0], [-46, 0]], 6, dk);
  for (const lx of [24, 56]) { line(c, [[lx - 10, -56], [lx + 10, -26], [lx + 4, 0]], 12, INK); line(c, [[lx - 10, -56], [lx + 10, -26], [lx + 4, 0]], 6, col); }
  const body = () => ell(c, 0, -76, 92, 30, -0.04); shape(c, body, col); shade(c, body, dk, 12, 14, 0.7);
  if (wings) { shape(c, () => { c.moveTo(-70, -92); c.quadraticCurveTo(10, -126, 118, -84); c.quadraticCurveTo(30, -82, -70, -92); c.closePath(); }, "#b9d98a", 5); line(c, [[-40, -94], [90, -90]], 3, dk); }
  if (bud) { shape(c, () => ell(c, -14, -100, 20, 10, -0.2), dk, 5); shape(c, () => ell(c, 20, -104, 16, 8, -0.1), dk, 5); }
  shape(c, () => ell(c, 98, -84, 30, 28), col);
  shape(c, () => ell(c, 108, -92, 9, 10), WHITE, 4); shape(c, () => ell(c, 111, -92, 4, 5), INK, 0);
  line(c, [[110, -108], [150, -150]], 4); line(c, [[100, -110], [124, -162]], 4);
  line(c, [[106, -68], [124, -70]], 4);
};
const frogspawn = (c: Ctx, x: number, y: number, s: number) => {
  const r = rnd(5);
  for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = r() * 40 * s; const px = x + Math.cos(a) * d * 1.3, py = y + Math.sin(a) * d * 0.8; shape(c, () => ell(c, px, py, 20 * s, 20 * s), "rgba(214,236,250,0.8)", 3); shape(c, () => ell(c, px, py, 7 * s, 7 * s), "#2b2340", 0); }
};
// the hen's egg, frog's jelly and butterfly's tiny egg on a leaf: big thing in the middle
const spot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), "#e9f0b8", Math.max(2.5, r * 0.2));
const cracked = (c: Ctx, x: number, y: number, s: number) => {
  // bottom half of an egg shell with a zig-zag rim, centre of the rim at x,y
  bit(c, x, y, s, () => {
    const zig = () => { c.moveTo(-80, 0); [[-60, -28], [-36, 2], [-12, -30], [12, 2], [36, -28], [60, 2], [80, -14]].forEach(([a, b]) => c.lineTo(a, b)); c.bezierCurveTo(84, 90, 40, 130, 0, 130); c.bezierCurveTo(-40, 130, -84, 90, -80, 0); c.closePath(); };
    shape(c, zig, EGG); shade(c, zig, EGG_DK, -14, -8, 0.8);
  });
};
const ring = (c: Ctx, cx: number, cy: number, r: number, from: number, k = 4) => {
  // k red arrows going clockwise round a circle, in the gaps between the pictures
  for (let i = 0; i < k; i++) { const a0 = from + (i * Math.PI * 2) / k, a1 = a0 + (Math.PI * 2) / k * 0.42; arrow(c, arc(cx, cy, r, a0, a1, 10), RED, 12); }
};

// ------------------------------------------------------------------ the pictures
// flow.e1 · Can an egg breathe? bubbles from a shell
const e1 = (c: Ctx) => {
  ground(c);
  glassIn(c, 540, 960, 520, 760, 0.86, COL.water, () => {
    egg(c, 540, 838, 98, 122);
    const r = rnd(4);
    for (let t = 0; t < 4; t++) { let x = 470 + t * 40, y = 700 - (t % 2) * 30; for (let i = 0; i < 4; i++) { const rr = 12 + i * 3 + r() * 3; bubble(c, x + (r() - 0.5) * 14, y, rr); y -= 52 + rr; } }
    for (const [x, y] of [[490, 800], [570, 780], [600, 820], [530, 770]]) bubble(c, x, y, 8);
  });
  arrow(c, [[860, 780], [860, 360]], RED, 14);
};
// flow.e2 · The Naked Egg
const e2 = (c: Ctx) => {
  ground(c);
  glassIn(c, 290, 920, 400, 640, 0.9, "#efe3b8", () => {
    egg(c, 290, 782, 92, 118, 0);
    for (const [x, y, r] of [[230, 700, 10], [250, 640, 14], [330, 690, 9], [315, 610, 12], [270, 560, 9], [350, 540, 8]]) bubble(c, x, y, r);
  });
  arrow(c, [[500, 700], [610, 700]], RED, 14);
  shadow(c, 780, 920, 220, 34);
  shape(c, () => ell(c, 780, 870, 230, 62), COL.steel); shape(c, () => ell(c, 780, 862, 195, 46), COL.steelIn, 4);
  const naked = eggP(c, 780, 690, 150, 190, 0);
  shape(c, naked, "rgba(255,244,214,0.96)", 6);
  c.save(); c.beginPath(); naked(); c.clip(); c.beginPath(); ell(c, 800, 730, 84, 84); c.fillStyle = "#f5b83a"; c.globalAlpha = 0.85; c.fill(); c.restore(); c.globalAlpha = 1;
  c.beginPath(); naked(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  shine(c, [[700, 650], [715, 590]], 10);
};
// flow.e3 · tadpole watch: legs come, the tail shrinks
const e3 = (c: Ctx) => {
  ground(c, "#cfe3a8");
  shape(c, () => rrect(c, 40, 280, 1000, 520, 40), POND, 6);
  c.save(); c.beginPath(); rrect(c, 40, 280, 1000, 520, 40); c.clip(); c.fillStyle = "rgba(95,159,211,0.35)"; c.fillRect(40, 560, 1000, 300); c.restore();
  const row: [number, number, number, number][] = [[0, 1, 255, 450], [1, 0.8, 470, 650], [3, 0.4, 690, 450], [4, 0, 900, 640]];
  row.forEach(([legs, tail, x, y], i) => {
    if (legs === 4) bit(c, x, y + 100, 1.15, () => frog(c));
    else bit(c, x, y, 1.6, () => tad(c, legs, tail, i < 2 ? TAD : "#5b4b3a"));
  });
  arrow(c, [[330, 560], [390, 600]], RED, 12); arrow(c, [[540, 640], [660, 560]], RED, 12); arrow(c, [[760, 560], [820, 600]], RED, 12);
};
// flow.a1 · Open an egg like a scientist
const a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 470, 860, 380, 50);
  shape(c, () => ell(c, 470, 780, 400, 120), COL.steel); shape(c, () => ell(c, 470, 772, 340, 90), COL.steelIn, 4);
  shape(c, () => { c.moveTo(260, 760); c.bezierCurveTo(250, 700, 380, 670, 470, 700); c.bezierCurveTo(600, 690, 700, 740, 660, 790); c.bezierCurveTo(620, 840, 330, 850, 260, 760); c.closePath(); }, "rgba(255,255,255,0.8)", 4);
  shape(c, () => ell(c, 470, 750, 78, 66), "#f5b83a"); shape(c, () => ell(c, 450, 735, 24, 14, -0.4), "#ffe08a", 0);
  cracked(c, 760, 750, 0.75); cracked(c, 190, 820, 0.5);
  // magnifying glass over the yolk
  line(c, [[600, 520], [800, 330]], 40, INK); line(c, [[600, 520], [800, 330]], 26, COL.wood);
  shape(c, () => ell(c, 470, 640, 175, 175), "rgba(214,236,250,0.45)", 16); shine(c, [[370, 540], [420, 510]], 14);
  c.save(); c.beginPath(); ell(c, 470, 640, 165, 165); c.clip(); c.fillStyle = "#fff6e0"; c.fillRect(280, 460, 400, 400);
  shape(c, () => ell(c, 470, 650, 120, 105), "#f5b83a"); shape(c, () => ell(c, 430, 620, 32, 18, -0.4), "#ffe08a", 0);
  c.restore();
  c.beginPath(); ell(c, 470, 640, 175, 175); c.strokeStyle = COL.woodDk; c.lineWidth = 8; c.stroke();
};
// flow.a2 · three life cycle wheels
const wheel = (c: Ctx, cx: number, cy: number, r: number, n: number, icon: (i: number, x: number, y: number, k: number) => void) => {
  shadow(c, cx + 12, cy + r * 0.9, r * 0.95, r * 0.14);
  shape(c, () => ell(c, cx, cy, r, r), WHITE, 6);
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; line(c, [[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 5); }
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / n; icon(i, cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.58, r / 183); }
  shape(c, () => polyP(c, [[cx - 12, cy - 12], [cx + 4, cy - r * 0.5], [cx + 16, cy - 4]]), RED, 5);
  shape(c, () => ell(c, cx, cy, 14, 14), COL.steelDk, 4);
};
const a2 = (c: Ctx) => {
  ground(c);
  wheel(c, 275, 290, 235, 3, (i, x, y, k) => { if (i === 0) egg(c, x, y, 26 * k, 34 * k); if (i === 1) bit(c, x, y + 36 * k, 0.6 * k, () => chick(c)); if (i === 2) bit(c, x, y + 52 * k, 0.4 * k, () => hen(c)); });
  wheel(c, 805, 290, 235, 4, (i, x, y, k) => { if (i === 0) frogspawn(c, x, y, 0.8 * k); if (i === 1) bit(c, x, y, 1.0 * k, () => tad(c, 0, 1)); if (i === 2) bit(c, x, y, 1.0 * k, () => tad(c, 3, 0.4, "#5b4b3a")); if (i === 3) bit(c, x, y + 28 * k, 0.5 * k, () => frog(c)); });
  wheel(c, 540, 760, 255, 4, (i, x, y, k) => {
    if (i === 0) { leaf(c, x - 50 * k, y + 20 * k, 85 * k, -0.3); spot(c, x - 10 * k, y + 4 * k, 8 * k); }
    if (i === 1) bit(c, x + 40 * k, y + 8 * k, 0.55 * k, () => caterpillar(c, 5));
    if (i === 2) bit(c, x, y - 40 * k, 0.55 * k, () => chrysalis(c));
    if (i === 3) bit(c, x, y, 0.3 * k, () => butterfly(c));
  });
};
// flow.a3 · be a caterpillar, be a butterfly
const a3 = (c: Ctx) => {
  ground(c, "#f1e6d2");
  c.fillStyle = "#e0c99c"; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 6);
  bit(c, 300, 770, 0.95, () => caterpillar(c, 6));
  // a child wrapped in a bedsheet, head peeking out
  shadow(c, 540, 890, 120, 22);
  shape(c, () => { c.moveTo(430, 880); c.bezierCurveTo(410, 700, 440, 480, 540, 460); c.bezierCurveTo(640, 480, 670, 700, 650, 880); c.closePath(); }, WHITE, 6);
  shade(c, () => { c.moveTo(430, 880); c.bezierCurveTo(410, 700, 440, 480, 540, 460); c.bezierCurveTo(640, 480, 670, 700, 650, 880); c.closePath(); }, "#e4dccb", 40, 0, 0.8);
  line(c, [[500, 540], [490, 760]], 5, "#c9bfa8"); line(c, [[570, 560], [585, 800]], 5, "#c9bfa8");
  shape(c, () => ell(c, 540, 440, 58, 62), SKIN.child, 6); shape(c, () => ell(c, 540, 405, 62, 40), CLOTH.hair, 5);
  shape(c, () => ell(c, 520, 450, 6, 8), INK, 0); shape(c, () => ell(c, 562, 450, 6, 8), INK, 0);
  // the butterfly: the same child standing, a bright sari held out wide as wings
  const wing = (m: number) => shape(c, () => { c.moveTo(830 + m * 20, 560); c.bezierCurveTo(830 + m * 120, 380, 830 + m * 190, 380, 830 + m * 165, 520); c.bezierCurveTo(830 + m * 170, 660, 830 + m * 90, 700, 830 + m * 20, 640); c.closePath(); }, m < 0 ? "#f08fb0" : "#f39a3c", 6);
  wing(-1); wing(1);
  person(c, 830, 880, 480, { armL: [Math.PI * 1.05, Math.PI * 1.05], armR: [-Math.PI * 0.05, -Math.PI * 0.05] });
  arrow(c, [[350, 680], [420, 660]], RED, 12); arrow(c, [[590, 660], [640, 640]], RED, 12);
};
// flow.a4 · rebuild the body (dough)
const a4 = (c: Ctx) => {
  ground(c);
  const DOUGH = "#f2d9a6", DOUGH_DK = "#d9b878";
  // dough caterpillar with four tiny folded papers inside (seen through the dough)
  bit(c, 470, 380, 1.3, () => { caterpillar(c, 6, DOUGH, DOUGH_DK); });
  for (const [i, dy] of [[1, -12], [2, 8], [3, -12], [4, 8]] as number[][]) { const x = 470 - i * 38 * 1.3 - 4, y = 380 - Math.sin((i / 5) * Math.PI) * 22 * 1.3 + dy; shape(c, () => polyP(c, [[x - 11, y - 11], [x + 11, y - 11], [x + 11, y + 11], [x - 11, y + 11]]), WHITE, 3); }
  arrow(c, [[400, 520], [400, 640]], RED, 14);
  shadow(c, 300, 905, 200, 36);
  const ball = () => ell(c, 300, 820, 190, 88); shape(c, ball, DOUGH); shade(c, ball, DOUGH_DK, 40, 30, 0.7);
  arrow(c, [[540, 820], [630, 800]], RED, 14);
  bit(c, 840, 780, 0.95, () => butterfly(c, 1, DOUGH));
};
// flow.p1 · raise a lime butterfly: mesh cage, a curry sprig in a jar, a caterpillar, a chrysalis
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 400, 36);
  shape(c, () => rrect(c, 160, 130, 760, 800, 24), "rgba(214,236,250,0.35)", 8);
  c.save(); c.beginPath(); rrect(c, 160, 130, 760, 800, 24); c.clip(); c.strokeStyle = "rgba(127,166,200,0.55)"; c.lineWidth = 2;
  for (let k = -800; k < 1100; k += 36) { line(c, [[160 + k, 130], [160 + k + 800, 930]], 1.8, "rgba(127,166,200,0.55)"); line(c, [[160 + k + 800, 130], [160 + k, 930]], 1.8, "rgba(127,166,200,0.55)"); }
  c.restore();
  // jar with a sprig
  curry(c, 400, 780, 1.55, -Math.PI / 2 - 0.12);
  bit(c, 430, 700, 0.62, () => caterpillar(c, 5));
  shape(c, () => rrect(c, 330, 740, 160, 190, 20), "rgba(214,236,250,0.7)", 6);
  shape(c, () => rrect(c, 338, 800, 144, 122, 16), COL.water, 0);
  line(c, [[350, 760], [356, 900]], 6, WHITE);
  // a chrysalis on a twig, a butterfly in the air
  line(c, [[640, 190], [900, 190]], 24, INK); line(c, [[640, 190], [900, 190]], 14, COL.brown);
  bit(c, 760, 194, 0.95, () => chrysalis(c));
  bit(c, 640, 560, 0.7, () => butterfly(c));
  shape(c, () => rrect(c, 140, 118, 800, 30, 14), COL.steelDk, 6);
};
// flow.c1 · the egg lift: a carrier of soft stuff, a raw egg inside, dropped from 1 m
const c1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 420, 36);
  // shoe box carrier with cotton and straws round the egg
  const box = () => polyP(c, [[130, 700], [950, 700], [920, 940], [160, 940]]);
  shape(c, box, COL.soilDk);
  shape(c, () => ell(c, 540, 700, 410, 44), "#fff6e6", 6);
  const fluff = (x: number, y: number, r: number) => { for (const [dx, dy, k] of [[-0.7, 0.1, 0.7], [0.7, 0.1, 0.7], [0, -0.3, 0.9], [-0.3, 0.3, 0.6], [0.35, 0.3, 0.6]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * k, r * k * 0.8), WHITE, 5); };
  fluff(270, 700, 60); fluff(800, 700, 60); fluff(410, 716, 50); fluff(680, 716, 50);
  for (const dx of [-150, -105, 105, 150]) { line(c, [[540 + dx, 640], [540 + dx * 1.05, 725]], 14, INK); line(c, [[540 + dx, 640], [540 + dx * 1.05, 725]], 8, COL.yellow); }
  egg(c, 540, 650, 92, 118);
  const front = () => { c.moveTo(130, 700); c.bezierCurveTo(300, 760, 780, 760, 950, 700); c.lineTo(920, 940); c.lineTo(160, 940); c.closePath(); };
  shape(c, front, COL.brown); shade(c, front, COL.soilDk, 30, -10, 0.5);
  // down arrow from one metre up, with the tape on the side
  arrow(c, [[540, 180], [540, 380]], RED, 16);
  shape(c, () => rrect(c, 960, 160, 70, 780, 8), COL.yellow, 6);
  for (let i = 0; i <= 10; i++) line(c, [[960, 160 + i * 78], [960 + (i % 5 === 0 ? 38 : 22), 160 + i * 78]], 4);
  write(c, "1", 960, 126, 28, INK, 5); write(c, "m", 992, 134, 22, INK, 5);
};
// flow.c2 · butterfly balcony: a rail, five pots, a curry leaf plant, flowers, a butterfly
const c2 = (c: Ctx) => {
  ground(c, "#cfe8f5");
  c.save(); c.translate(0, 120);
  c.fillStyle = "#e8dcc4"; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  shape(c, () => rrect(c, 20, 600, 1040, 40, 8), COL.steelDk, 6);
  for (let x = 70; x < 1040; x += 100) line(c, [[x, 640], [x, 700]], 10);
  curry(c, 250, 700, 1.6, -Math.PI / 2 + 0.05);
  const pot = (x: number, w: number, h: number) => { shape(c, () => polyP(c, [[x - w / 2, 700], [x + w / 2, 700], [x + w * 0.38, 700 + h], [x - w * 0.38, 700 + h]]), COL.orange); shape(c, () => rrect(c, x - w / 2 - 10, 684, w + 20, 30, 8), COL.orange, 6); };
  const flowers = (x: number, col: string, n: number) => { for (let i = 0; i < n; i++) { const fx = x - 60 + i * (120 / (n - 1)), fy = 520 - (i % 2) * 50; line(c, [[fx, 690], [fx, fy]], 8, COL.leafDk); shape(c, () => ell(c, fx, fy, 30, 30), col, 5); shape(c, () => ell(c, fx, fy, 11, 11), COL.yellow, 3); } };
  flowers(520, "#f29ab4", 3); flowers(770, "#f08a3c", 3);
  for (const [x, w] of [[250, 200], [520, 200], [770, 200], [950, 130]]) pot(x, w, 150);
  flowers(950, "#e4523b", 2);
  bit(c, 640, 380, 0.55, () => butterfly(c));
  bit(c, 300, 430, 0.4, () => caterpillar(c, 4));
  c.restore();
};

// terms
// term.0 · life cycle: a circle of arrows, egg, chick, hen
const t0 = (c: Ctx) => {
  ground(c);
  ring(c, 540, 560, 360, -Math.PI / 2 + 0.35, 3);
  egg(c, 540, 220, 85, 108);
  bit(c, 840, 810, 1.7, () => chick(c));
  bit(c, 260, 810, 1.15, () => hen(c));
};
// term.1 · stage: four boxes, four shapes of one frog
const t1 = (c: Ctx) => {
  ground(c);
  const xs = [35, 295, 555, 815];
  xs.forEach((x) => panel(c, x, 270, 230, 520, POND));
  frogspawn(c, 150, 530, 1.2);
  bit(c, 465, 530, 1.5, () => tad(c, 0, 1));
  bit(c, 670, 530, 1.9, () => tad(c, 3, 0.35, "#5b4b3a"));
  bit(c, 930, 640, 1.3, () => frog(c));
  [[272, 530], [532, 530], [792, 530]].forEach(([x, y]) => arrow(c, [[x - 18, y], [x + 18, y]], RED, 11));
};
// term.3 · hatch
const t3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 905, 340, 40);
  bit(c, 540, 700, 2.6, () => { chick(c); });
  cracked(c, 540, 640, 2.6);
  // loose cap tilted off to the side
  const capp = () => { c.moveTo(-80, 0); [[-60, -28], [-36, 2], [-12, -30], [12, 2], [36, -28], [60, 2], [80, -14]].forEach(([a, b]) => c.lineTo(a, b)); c.bezierCurveTo(70, -110, 30, -150, 0, -150); c.bezierCurveTo(-30, -150, -76, -110, -80, 0); c.closePath(); };
  c.save(); c.translate(870, 280); c.rotate(0.5); c.scale(1.3, 1.3); shape(c, capp, EGG); shade(c, capp, EGG_DK, -14, -8, 0.8); c.restore();
  arrow(c, [[640, 330], [760, 380]], RED, 12);
};
// term.4 · young: chick next to hen, tadpole next to frog
const t4 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 40, 1000, 480, GRASS); panel(c, 40, 560, 1000, 480, POND);
  bit(c, 440, 440, 1.5, () => hen(c)); bit(c, 780, 440, 1.7, () => chick(c));
  bit(c, 360, 960, 1.9, () => frog(c)); bit(c, 780, 800, 2.1, () => tad(c, 0, 1));
};
// term.5 · adult: hen, frog, butterfly
const t5 = (c: Ctx) => {
  ground(c, "#cfe3a8");
  shadow(c, 540, 905, 480, 30);
  bit(c, 230, 880, 1.15, () => hen(c));
  bit(c, 560, 880, 1.6, () => frog(c));
  bit(c, 870, 400, 0.85, () => butterfly(c));
};
// term.6 · metamorphosis
const t6 = (c: Ctx) => {
  ground(c);
  leaf(c, 60, 760, 340, -0.3, COL.leaf);
  bit(c, 380, 640, 1.2, () => caterpillar(c, 6));
  c.save(); c.shadowColor = "#ffd34d"; c.shadowBlur = 50; arrow(c, [[450, 640], [620, 640]], RED, 24); c.restore();
  arrow(c, [[450, 640], [620, 640]], RED, 24);
  bit(c, 850, 620, 0.9, () => butterfly(c));
};
// term.9 · gills
const t9 = (c: Ctx) => {
  ground(c, POND);
  for (const [x, y, r] of [[200, 210, 22], [270, 320, 14], [850, 230, 20], [900, 380, 12], [160, 830, 16], [880, 860, 22]]) bubble(c, x, y, r);
  bit(c, 620, 600, 5, () => tad(c, 0, 1));
  for (const [bx, by, an] of [[505, 548, -2.55], [535, 512, -2.1], [580, 492, -1.7]]) {
    const L = 200, ex = bx + Math.cos(an) * L, ey = by + Math.sin(an) * L;
    line(c, [[bx, by], [ex, ey]], 24, INK); line(c, [[bx, by], [ex, ey]], 13, "#e4523b");
    for (let j = 1; j <= 4; j++) { const t = 0.2 + j * 0.2, px = bx + (ex - bx) * t, py = by + (ey - by) * t; for (const d of [-0.9, 0.9]) { const qx = px + Math.cos(an + d) * 55, qy = py + Math.sin(an + d) * 55; line(c, [[px, py], [qx, qy]], 18, INK); line(c, [[px, py], [qx, qy]], 9, "#e4523b"); } }
  }
  bit(c, 620, 600, 5, () => { shape(c, () => ell(c, 0, 0, 30, 23), TAD, 5); shape(c, () => ell(c, 12, -8, 4.5, 4.5), WHITE, 0); });
};
// term.10 · lungs
const t10 = (c: Ctx) => {
  ground(c, CREAM);
  shadow(c, 540, 900, 380, 32);
  bit(c, 480, 860, 4.2, () => {
    frog(c);
    const lung = (x: number, rot: number) => shape(c, () => ell(c, x, -52, 18, 26, rot), "#f08aa0", 4);
    lung(-4, 0.5); lung(26, -0.2);
  });
  arrow(c, [[930, 330], [930, 450], [880, 590]], RED, 14);
  for (const [x, y] of [[960, 260], [900, 200], [980, 360]]) shape(c, () => ell(c, x, y, 20, 20), "rgba(255,255,255,0.8)", 3);
};
// term.12 · larva: a caterpillar on a leaf and a wriggler in water
const t12 = (c: Ctx) => {
  ground(c);
  leaf(c, 20, 700, 460, -0.15, COL.leaf);
  bit(c, 360, 560, 1.3, () => caterpillar(c, 6));
  glassIn(c, 780, 930, 380, 560, 0.8, COL.water, () => {
    for (const [x, y, rot] of [[730, 560, 0], [840, 600, 0.15]] as number[][]) {
      c.save(); c.translate(x, y); c.rotate(rot); c.scale(1.5, 1.5);
      line(c, [[0, 0], [0, -62]], 10, INK); line(c, [[0, 0], [0, -62]], 5, "#7a6a58");
      line(c, [[0, 0], [20, 40], [-4, 80], [-26, 110]], 18, INK); line(c, [[0, 0], [20, 40], [-4, 80], [-26, 110]], 10, "#a89880");
      shape(c, () => ell(c, 0, 4, 22, 20), "#8a7a68", 5); c.restore();
    }
  });
};
// term.14 · moult
const t14 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 760], [1040, 740]], 34, INK); line(c, [[40, 760], [1040, 740]], 24, COL.brown);
  // the old, empty skin: pale, crumpled, see-through
  c.save(); c.globalAlpha = 0.9;
  bit(c, 320, 700, 1.1, () => { for (let i = 5; i >= 0; i--) { const x = -i * 36, y = -Math.sin(i * 0.5) * 8; shape(c, () => ell(c, x, y - 6 * (i % 2), 26, 22), "#e9eccb", 5); } shape(c, () => ell(c, 12, 0, 22, 22), "#dfe3b8", 5); line(c, [[20, 0], [40, 6]], 4); });
  c.restore();
  bit(c, 840, 700, 1.5, () => caterpillar(c, 6));
  arrow(c, [[480, 560], [610, 560]], RED, 14);
};
// term.19 · embryo
const t19 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 910, 330, 36);
  const outer = eggP(c, 540, 520, 300, 390, 0);
  shape(c, outer, EGG, 8);
  c.save(); c.beginPath(); outer(); c.clip(); c.beginPath(); ell(c, 540, 540, 240, 320); c.fillStyle = "#fffdf2"; c.fill(); c.lineWidth = 5; c.strokeStyle = EGG_DK; c.stroke(); c.restore();
  shape(c, () => ell(c, 540, 580, 150, 150), "#f5b83a", 6);
  // the curled chick embryo lying on the yolk
  bit(c, 540, 580, 1.35, () => {
    shape(c, () => { c.moveTo(-90, -20); c.bezierCurveTo(-100, -110, 20, -130, 50, -60); c.bezierCurveTo(80, 20, 0, 60, -50, 20); c.bezierCurveTo(-70, 5, -65, -20, -40, -20); c.closePath(); }, "#f4a8a0", 5);
    shape(c, () => ell(c, -15, -65, 22, 22), "#f4a8a0", 5); shape(c, () => ell(c, -20, -68, 8, 8), INK, 0);
    line(c, [[-56, 16], [-88, 60]], 6, "#c97a73");
  });
};
// term.21 · complete metamorphosis: four stages in a ring
const t21 = (c: Ctx) => {
  ground(c);
  ring(c, 540, 540, 330, -Math.PI / 2 + 0.3, 4);
  leaf(c, 440, 250, 190, -0.2, COL.leaf); spot(c, 540, 218, 14);
  bit(c, 960, 560, 1.15, () => caterpillar(c, 5));
  bit(c, 540, 690, 1.0, () => chrysalis(c));
  bit(c, 160, 540, 0.7, () => butterfly(c));
};
// term.22 · incomplete metamorphosis: small wingless next to big winged
const t22 = (c: Ctx) => {
  ground(c, "#cfe3a8");
  shadow(c, 540, 870, 480, 30);
  bit(c, 250, 800, 1.3, () => hopper(c, false, true));
  arrow(c, [[460, 730], [570, 730]], RED, 14);
  bit(c, 770, 800, 1.8, () => hopper(c, true));
};
// term.23 · nymph: a young grasshopper with tiny wing buds
const t23 = (c: Ctx) => {
  ground(c, "#cfe3a8");
  shadow(c, 540, 905, 380, 30);
  bit(c, 460, 820, 3.0, () => hopper(c, false, true));
  const ptr = (x: number, y: number, tx: number, ty: number) => arrow(c, [[x, y], [tx, ty]], RED, 13);
  ptr(700, 280, 540, 470);
};

// term.2 · egg: a hen's egg, frogspawn, a butterfly egg on a leaf
const t2 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 300, 310, 520, CREAM); panel(c, 385, 300, 310, 520, POND); panel(c, 730, 300, 310, 520, GRASS);
  egg(c, 195, 560, 100, 128);
  frogspawn(c, 540, 560, 2.4);
  leaf(c, 770, 700, 250, -0.5, COL.leaf); spot(c, 905, 560, 22);
};
// term.7 · frogspawn: a floating clump of jelly balls with a black dot in each
const t7 = (c: Ctx) => {
  ground(c, POND);
  c.fillStyle = "rgba(95,159,211,0.45)"; c.fillRect(0, 620, D, 460);
  const r = rnd(9);
  for (let i = 0; i < 60; i++) { const a = r() * 6.28, d = Math.sqrt(r()), x = 540 + Math.cos(a) * d * 330, y = 560 + Math.sin(a) * d * 180; shape(c, () => ell(c, x, y, 52, 52), "rgba(226,242,252,0.78)", 4); shape(c, () => ell(c, x, y, 17, 17), INK, 0); shine(c, [[x - 30, y - 14], [x - 20, y - 32]], 6); }
};
// term.8 · tadpole
const t8 = (c: Ctx) => {
  ground(c, POND);
  for (const [x, y, r] of [[200, 210, 22], [860, 250, 16], [880, 800, 22], [180, 820, 14]]) bubble(c, x, y, r);
  bit(c, 640, 560, 5.2, () => tad(c, 0, 1));
};
// term.11 · froglet: a tiny frog on a stone with a short tail stub
const t11 = (c: Ctx) => {
  ground(c, POND);
  shadow(c, 560, 900, 400, 36);
  const stone = () => ell(c, 540, 820, 380, 140); shape(c, stone, "#a39e94", 6); shade(c, stone, "#7d7870", -60, -30, 0.8);
  bit(c, 560, 740, 3.8, () => { shape(c, () => { c.moveTo(-62, -32); c.quadraticCurveTo(-90, -24, -84, -6); c.quadraticCurveTo(-70, -14, -56, -14); c.closePath(); }, FROG, 5); frog(c); });
  arrow(c, [[130, 520], [220, 620]], RED, 14);
};
// term.13 · caterpillar: eating the edge of a curry leaf
const t13 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(190, 20);
  leaf(c, 60, 860, 700, -0.5, COL.leaf);
  c.save(); c.translate(560, 590); c.rotate(-0.5); bit(c, 0, 0, 2.0, () => caterpillar(c, 6)); c.restore(); c.restore();
};
// term.16 · chrysalis: hung from a twig by a silk belt
const t16 = (c: Ctx) => {
  ground(c);
  line(c, [[40, 200], [1040, 220]], 54, INK); line(c, [[40, 200], [1040, 220]], 40, COL.brown);
  line(c, [[500, 190], [540, 236]], 6, "#fffaf0"); line(c, [[580, 240], [540, 236]], 6, "#fffaf0");
  bit(c, 540, 240, 4.4, () => chrysalis(c));
};

export const ic_animalsAnimalLifeCyclesL3 = cards("sci.animals.animal-life-cycles.L3 cards", [
  e1, e2, e3, a1, a2, a3, a4, p1, c1, c2, t0, t1, t3, t4, t5, t6, t9, t10, t12, t14, t19, t21, t22, t23, t2, t7, t8, t11, t13, t16,
]);
