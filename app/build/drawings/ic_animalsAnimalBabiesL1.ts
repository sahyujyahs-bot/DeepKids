import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, leaf, bowl, cards } from "./flatKit";

// sci.animals.animal-babies.L1 cards. Same child and grown-up as the set-up cards. Every animal faces
// right. Colours as in the animal life cycle cards (hen brown, chick yellow, frog green, tadpole dark,
// caterpillar green, butterfly pale yellow).

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
const bit = (c: Ctx, x: number, y: number, s: number, fn: (c: Ctx) => void) => { c.save(); c.translate(x, y); c.scale(s, s); fn(c); c.restore(); };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 28), col, 6);
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
const cracked = (c: Ctx, x: number, y: number, s: number) => {
  // bottom half of an egg shell with a zig-zag rim, centre of the rim at x,y
  bit(c, x, y, s, () => {
    const zig = () => { c.moveTo(-80, 0); [[-60, -28], [-36, 2], [-12, -30], [12, 2], [36, -28], [60, 2], [80, -14]].forEach(([a, b]) => c.lineTo(a, b)); c.bezierCurveTo(84, 90, 40, 130, 0, 130); c.bezierCurveTo(-40, 130, -84, 90, -80, 0); c.closePath(); };
    shape(c, zig, EGG); shade(c, zig, EGG_DK, -14, -8, 0.8);
  });
};

// ------------------------------------------------------------------ more animals (feet at 0,0, facing right)
const ROPE = "#d8c28c", ROPE_DK = "#b09a62";
const GREY = "#a9b1be", GREY_DK = "#7e8798", CATC = "#f0a24a", CATC_DK = "#c97a22", DOGC = "#d9a05b", DOGC_DK = "#b07a38";
const COWC = "#f4ead8", COWC_DK = "#d8c7a8", PATCH = "#8a5a3c", PINK = "#f4b8b0", NEWS = "#e8e2d0", NEWS_DK = "#c9c0a6";
type Q = { L: number; H: number; bh: number; hr: number; col: string; dk: string; kind: "cat" | "dog" | "cow" };
const quad = (c: Ctx, o: Q) => {
  const { L, H, bh, hr, col, dk, kind } = o, by = -(H + bh * 0.7);
  const leg = (x: number, lc: string) => { line(c, [[x, by], [x, -6]], 22, INK); line(c, [[x, by], [x, -6]], 12, lc); shape(c, () => ell(c, x + 6, -5, 15, 8), lc, 4); };
  leg(L * 0.4, dk); leg(-L * 0.3, dk);
  const tail: number[][] = kind === "cat" ? [[-L * 0.9, by], [-L - 14, by + 4], [-L - 40, by - 30], [-L - 34, by - 70], [-L - 14, by - 92]] : kind === "dog" ? [[-L * 0.9, by - 8], [-L - 14, by - 22], [-L - 24, by - 56], [-L - 8, by - 84]] : [[-L * 0.95, by - bh * 0.3], [-L - 14, by + 20], [-L - 10, by + H * 0.9]];
  for (const [w, cc] of [[20, INK], [10, col]] as [number, string][]) { c.beginPath(); c.moveTo(tail[0][0], tail[0][1]); for (let i = 1; i < tail.length - 1; i++) c.quadraticCurveTo(tail[i][0], tail[i][1], (tail[i][0] + tail[i + 1][0]) / 2, (tail[i][1] + tail[i + 1][1]) / 2); c.lineTo(tail[tail.length - 1][0], tail[tail.length - 1][1]); c.strokeStyle = cc; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); }
  if (kind === "cow") shape(c, () => ell(c, tail[2][0], tail[2][1] + 8, 13, 22), PATCH, 4);
  const hx = L * 0.88 + hr * 0.4, hy = by - bh * 0.55 - hr * 0.55;
  if (kind === "cat") for (const m of [-1, 1]) shape(c, () => polyP(c, [[hx + m * hr * 0.15, hy - hr * 0.7], [hx + m * hr * 0.62, hy - hr * 1.4], [hx + m * hr * 0.9, hy - hr * 0.3]]), col, 5);
  const body = () => ell(c, 0, by, L, bh);
  shape(c, body, col); shade(c, body, dk, L * 0.22, bh * 0.35, 0.7);
  if (kind === "cat") for (const sx of [-0.45, -0.1, 0.25]) line(c, [[L * sx, by - bh * 0.95], [L * sx + 4, by - bh * 0.45]], 7, dk);
  if (kind === "cow") { c.save(); c.beginPath(); body(); c.clip(); for (const [px, py, pw, ph] of [[-0.5, -0.2, 0.34, 0.6], [0.2, 0.25, 0.3, 0.5]]) { c.beginPath(); ell(c, L * px, by + bh * py, L * pw, bh * ph, 0.3); c.fillStyle = PATCH; c.fill(); } c.restore(); c.beginPath(); body(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); }
  leg(L * 0.65, col); leg(-L * 0.55, col);
  shape(c, () => ell(c, L * 0.74, by - bh * 0.35, hr * 0.85, bh * 0.85), col, 0);
  if (kind === "cow") for (const m of [1]) shape(c, () => polyP(c, [[hx - hr * 0.2, hy - hr * 0.8], [hx - hr * 0.1 + m * 6, hy - hr * 1.5], [hx + hr * 0.2, hy - hr * 0.85]]), "#f6f0dc", 4);
  if (kind === "cow") shape(c, () => ell(c, hx - hr * 0.85, hy - hr * 0.3, hr * 0.5, hr * 0.2, -0.3), col, 5);
  shape(c, () => ell(c, hx, hy, hr * (kind === "cow" ? 0.95 : 1.05), hr), col);
  if (kind === "cow") { shape(c, () => ell(c, hx + hr * 0.62, hy + hr * 0.45, hr * 0.58, hr * 0.5), PINK, 5); for (const nx of [0.5, 0.85]) shape(c, () => ell(c, hx + hr * nx, hy + hr * 0.5, 4, 6), INK, 0); shape(c, () => ell(c, hx - hr * 0.2, hy - hr * 0.5, hr * 0.3, hr * 0.38, 0.3), PATCH, 0); }
  if (kind === "dog") { shape(c, () => ell(c, hx + hr * 0.65, hy + hr * 0.3, hr * 0.5, hr * 0.38), "#f1d7a8", 5); shape(c, () => ell(c, hx + hr * 1.05, hy + hr * 0.15, hr * 0.14, hr * 0.12), INK, 0); shape(c, () => ell(c, hx - hr * 0.4, hy + hr * 0.15, hr * 0.34, hr * 0.78, 0.15), dk, 5); }
  if (kind === "cat") { shape(c, () => polyP(c, [[hx + hr * 0.85, hy + hr * 0.1], [hx + hr * 1.05, hy + hr * 0.1], [hx + hr * 0.95, hy + hr * 0.25]]), "#e9879a", 3); line(c, [[hx + hr * 0.7, hy + hr * 0.3], [hx + hr * 1.35, hy + hr * 0.2]], 3); line(c, [[hx + hr * 0.7, hy + hr * 0.4], [hx + hr * 1.3, hy + hr * 0.5]], 3); }
  shape(c, () => ell(c, hx + hr * 0.35, hy - hr * 0.12, hr * 0.12, hr * 0.15), INK, 0); shape(c, () => ell(c, hx + hr * 0.38, hy - hr * 0.18, hr * 0.04, hr * 0.05), WHITE, 0);
};
const cat = (c: Ctx) => quad(c, { L: 75, H: 45, bh: 40, hr: 34, col: CATC, dk: CATC_DK, kind: "cat" });
const kitten = (c: Ctx) => quad(c, { L: 44, H: 26, bh: 30, hr: 31, col: CATC, dk: CATC_DK, kind: "cat" });
const dog = (c: Ctx) => quad(c, { L: 95, H: 75, bh: 48, hr: 40, col: DOGC, dk: DOGC_DK, kind: "dog" });
const youngDog = (c: Ctx) => quad(c, { L: 76, H: 56, bh: 40, hr: 37, col: DOGC, dk: DOGC_DK, kind: "dog" });
const puppy = (c: Ctx) => quad(c, { L: 50, H: 30, bh: 33, hr: 34, col: DOGC, dk: DOGC_DK, kind: "dog" });
const cow = (c: Ctx) => quad(c, { L: 130, H: 100, bh: 62, hr: 46, col: COWC, dk: COWC_DK, kind: "cow" });
const calf = (c: Ctx) => quad(c, { L: 80, H: 76, bh: 40, hr: 33, col: COWC, dk: COWC_DK, kind: "cow" });

const duck = (c: Ctx, young = false) => {
  const col = young ? CHICK : WHITE, dk = young ? CHICK_DK : "#e4dccb", k = young ? 0.62 : 1;
  c.save(); c.scale(k, k);
  for (const lx of [-6, 24]) { line(c, [[lx, -30], [lx, -4]], 12, INK); line(c, [[lx, -30], [lx, -4]], 6, COL.orange); shape(c, () => polyP(c, [[lx - 6, -8], [lx + 34, -2], [lx - 8, 4]]), COL.orange, 4); }
  if (!young) shape(c, () => polyP(c, [[-70, -78], [-128, -104], [-92, -52]]), dk, 5);
  const body = () => ell(c, 0, -72, young ? 56 : 80, young ? 46 : 46, young ? 0 : -0.1);
  shape(c, body, col); shade(c, body, dk, 18, 14, 0.8);
  shape(c, () => ell(c, -8, -70, young ? 30 : 44, young ? 20 : 26, -0.2), dk, 4);
  if (!young) shape(c, () => ell(c, 56, -112, 24, 36, -0.3), col, 0);
  const hx = young ? 44 : 70, hy = young ? -126 : -148;
  shape(c, () => ell(c, hx, hy, young ? 32 : 28, young ? 30 : 26), col);
  shape(c, () => ell(c, hx + 36, hy + 8, 28, 11), COL.orange, 4);
  shape(c, () => ell(c, hx + 10, hy - 6, 5, 6), INK, 0);
  c.restore();
};
const fly = (c: Ctx) => {
  for (const [x, d] of [[-14, -1], [6, 0], [24, 1]]) { line(c, [[x, -26], [x + d * 16, -4]], 8, INK); line(c, [[x, -26], [x + d * 16, -4]], 3, "#6a605a"); }
  shape(c, () => ell(c, -24, -78, 38, 13, -0.35), "rgba(214,236,250,0.85)", 5);
  line(c, [[-6, -74], [-48, -86]], 3, COL.glassEdge);
  const body = () => ell(c, -6, -44, 46, 26); shape(c, body, "#4a403a"); shade(c, body, "#2e2824", 12, 8, 0.7);
  line(c, [[-30, -60], [-28, -28]], 4, "#8a7a6a"); line(c, [[-10, -64], [-8, -24]], 4, "#8a7a6a");
  shape(c, () => ell(c, 44, -50, 22, 22), "#c0392b", 5);
  shape(c, () => ell(c, 50, -56, 6, 7), "#f4a09a", 0);
};
const maggot = (c: Ctx) => {
  const p = () => { c.moveTo(-70, -2); c.bezierCurveTo(-70, -34, -20, -36, 30, -26); c.bezierCurveTo(66, -18, 72, -6, 72, -2); c.bezierCurveTo(60, 8, -20, 10, -70, -2); c.closePath(); };
  shape(c, p, "#f7efd2", 5); shade(c, p, "#d8cba0", 6, 10, 0.8);
  for (const x of [-44, -18, 8, 34]) line(c, [[x, -26], [x - 4, 4]], 3, "#b9ab7e");
};
const pupa = (c: Ctx) => {
  const p = () => { c.moveTo(-60, 0); c.bezierCurveTo(-60, -40, -20, -48, 20, -44); c.bezierCurveTo(56, -40, 66, -20, 60, 0); c.closePath(); };
  shape(c, p, "#9c6b3c", 5); shade(c, p, "#6e4a28", 8, 10, 0.7);
  for (const x of [-30, -6, 18, 40]) line(c, [[x, -42], [x - 2, -2]], 3, "#5e3f22");
};
const pigeon = (c: Ctx) => {
  for (const lx of [-4, 26]) { line(c, [[lx, -34], [lx, -4]], 12, INK); line(c, [[lx, -34], [lx, -4]], 6, "#e07a8a"); line(c, [[lx - 14, 0], [lx + 14, 0]], 10, INK); line(c, [[lx - 12, 0], [lx + 12, 0]], 5, "#e07a8a"); }
  shape(c, () => polyP(c, [[-60, -74], [-134, -56], [-128, -100], [-56, -100]]), GREY_DK, 5);
  const body = () => ell(c, 0, -76, 78, 48, -0.12); shape(c, body, GREY); shade(c, body, GREY_DK, 20, 16, 0.6);
  shape(c, () => ell(c, 54, -108, 30, 36, -0.1), GREY, 0);
  shape(c, () => ell(c, 50, -104, 24, 22), "#7aa8a0", 0);
  shape(c, () => ell(c, -12, -82, 52, 28, -0.2), GREY_DK, 5);
  line(c, [[-40, -90], [18, -98]], 6, "#4a4458"); line(c, [[-44, -76], [14, -84]], 6, "#4a4458");
  shape(c, () => ell(c, 66, -134, 27, 25), GREY, 5);
  shape(c, () => polyP(c, [[88, -138], [118, -132], [88, -124]]), "#d9c9a8", 4);
  shape(c, () => ell(c, 90, -138, 6, 5), WHITE, 3);
  shape(c, () => ell(c, 74, -140, 7, 7), COL.orange, 3); shape(c, () => ell(c, 75, -140, 3, 3), INK, 0);
};
const pigeonChick = (c: Ctx) => {
  for (const lx of [-8, 20]) { line(c, [[lx, -22], [lx, -4]], 11, INK); line(c, [[lx, -22], [lx, -4]], 6, PINK); line(c, [[lx - 12, 0], [lx + 12, 0]], 10, INK); line(c, [[lx - 10, 0], [lx + 10, 0]], 5, PINK); }
  const body = () => ell(c, 0, -52, 50, 42); shape(c, body, CHICK); shade(c, body, CHICK_DK, 14, 12, 0.75);
  shape(c, () => ell(c, -12, -54, 26, 16, 0.5), CHICK_DK, 4);
  shape(c, () => ell(c, 36, -100, 30, 28), "#f7c98a");
  for (const [x, y] of [[26, -126], [38, -130], [48, -122]]) line(c, [[x - 4, y + 10], [x, y]], 6, CHICK);
  shape(c, () => polyP(c, [[56, -108], [92, -98], [56, -88]]), "#f2d6b0", 4);
  shape(c, () => ell(c, 44, -106, 6, 7), INK, 0);
};
const baby = (c: Ctx, x: number, y: number, s: number) => {
  // a baby wrapped in a yellow cloth, head up, centre of the bundle at x, y
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 0, 64, 40, -0.35), CHICK, 6); shade(c, () => ell(c, 0, 0, 64, 40, -0.35), CHICK_DK, 10, 10, 0.7);
  shape(c, () => ell(c, 40, -34, 30, 30), SKIN.child, 6);
  shape(c, () => ell(c, 40, -52, 24, 12), CLOTH.hair, 4);
  shape(c, () => ell(c, 50, -34, 4, 5), INK, 0); shape(c, () => ell(c, 34, -34, 4, 5), INK, 0);
  c.restore();
};
const flip = (c: Ctx, x: number, y: number, s: number, fn: (c: Ctx) => void) => { c.save(); c.translate(x, y); c.scale(-s, s); fn(c); c.restore(); };
const grass = (c: Ctx, y: number, col = "#cfe3a8") => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// a human figure, feet at (x, y), total height = heads * hh (one head is hh high)
const LEGS = { baby: 1.25, child: 2.7, adult: 3.5 };
const fig = (c: Ctx, x: number, y: number, hh: number, heads: number, kind: "baby" | "child" | "adult") => {
  const skin = kind === "adult" ? SKIN.adult : SKIN.child, cloth = kind === "adult" ? CLOTH.adult : kind === "child" ? CLOTH.child : CHICK, cdk = kind === "adult" ? CLOTH.adultDk : kind === "child" ? CLOTH.childDk : CHICK_DK;
  const top = y - heads * hh, leg = LEGS[kind] * hh, hip = y - leg, tw = hh * (kind === "baby" ? 0.78 : kind === "child" ? 0.82 : 0.95), sy = top + hh * 1.05;
  shadow(c, x + hh * 0.2, y + 6, hh * 0.8, hh * 0.12);
  for (const s of [-1, 1]) { line(c, [[x + s * tw * 0.22, hip], [x + s * tw * 0.22, y - 6]], tw * 0.36 + 10, INK); line(c, [[x + s * tw * 0.22, hip], [x + s * tw * 0.22, y - 6]], tw * 0.36, "#6b5a8c"); shape(c, () => ell(c, x + s * tw * 0.22 + 4, y - 4, tw * 0.28, 9), skin, 4); }
  for (const s of [-1, 1]) { const ex = x + s * (tw * 0.5 + 8), ey = hip - 6; line(c, [[x + s * tw * 0.45, sy + 8], [ex, ey]], tw * 0.2 + 9, INK); line(c, [[x + s * tw * 0.45, sy + 8], [ex, ey]], tw * 0.2, cloth); shape(c, () => ell(c, ex, ey + 4, tw * 0.13, tw * 0.13), skin, 4); }
  const b = () => rrect(c, x - tw / 2, sy - hh * 0.15, tw, hip - sy + hh * 0.28, 22);
  shape(c, b, cloth); shade(c, b, cdk, tw * 0.2, 0, 0.7);
  shape(c, () => ell(c, x, top + hh * 0.5, hh * 0.44, hh * 0.5), skin);
  shape(c, () => { c.moveTo(x - hh * 0.45, top + hh * 0.46); c.bezierCurveTo(x - hh * 0.45, top - hh * 0.2, x + hh * 0.45, top - hh * 0.2, x + hh * 0.45, top + hh * 0.46); c.quadraticCurveTo(x, top + hh * 0.2, x - hh * 0.45, top + hh * 0.46); c.closePath(); }, CLOTH.hair, 5);
  if (kind === "child") shape(c, () => ell(c, x + hh * 0.42, top + hh * 0.3, hh * 0.14, hh * 0.26), CLOTH.hair, 4);
  if (kind === "adult") shape(c, () => ell(c, x, top + hh * 0.02, hh * 0.2, hh * 0.18), CLOTH.hair, 4);
  shape(c, () => ell(c, x - hh * 0.16, top + hh * 0.56, hh * 0.04, hh * 0.055), INK, 0); shape(c, () => ell(c, x + hh * 0.16, top + hh * 0.56, hh * 0.04, hh * 0.055), INK, 0);
  c.beginPath(); c.arc(x, top + hh * 0.68, hh * 0.12, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const strips = (c: Ctx, x: number, y: number, n: number, hh: number) => { for (let i = 0; i < n; i++) shape(c, () => rrect(c, x, y - (i + 1) * hh, 50, hh, 4), i % 2 ? WHITE : COL.paper, 4); };

// ------------------------------------------------------------------ the pictures
// summary · a pigeon chick hatches pink and yellow and in four weeks looks like the parents
const summary = (c: Ctx) => {
  ground(c); grass(c, 800);
  shadow(c, 250, 800, 150, 24); shadow(c, 800, 800, 190, 26);
  bit(c, 230, 790, 2.2, pigeonChick);
  bit(c, 790, 790, 1.6, pigeon);
  arrow(c, [[450, 600], [560, 600]], RED, 14);
};
// flow.e1 · Heads Tall: baby 4, child 6, grown-up 7 head strips
const flowE1 = (c: Ctx) => {
  ground(c); const hh = 80, y = 900;
  line(c, [[40, y], [1040, y]], 6);
  strips(c, 120, y, 4, hh); fig(c, 250, y, hh, 4, "baby");
  strips(c, 420, y, 6, hh); fig(c, 560, y, hh, 6, "child");
  strips(c, 730, y, 7, hh); fig(c, 880, y, hh, 7, "adult");
  write(c, "4", 135, 940, 50); write(c, "6", 435, 940, 50); write(c, "7", 745, 940, 50);
};
// flow.a1 · Guess the grown-up: baby -> grown-up pairs
const pairCard = (c: Ctx, pairs: [string, () => void, number, number, () => void, number, number, number][]) => {
  ground(c);
  pairs.forEach(([col, a, as, ax, b, bs, bx, by], i) => {
    const px = 30 + (i % 2) * 520, py = 40 + Math.floor(i / 2) * 520; panel(c, px, py, 500, 480, col);
    const gy = py + 400; line(c, [[px + 30, gy + 8], [px + 470, gy + 8]], 4, "rgba(43,35,64,0.35)");
    bit(c, px + ax, gy + 0, as, a); bit(c, px + bx, gy + by, bs, b);
    arrow(c, [[px + 210, py + 300], [px + 280, py + 300]], RED, 12);
  });
};
const bflyS = (c: Ctx) => bit(c, 0, -170, 1, () => butterfly(c));
const flowA1 = (c: Ctx) => pairCard(c, [
  ["#e3f1fa", () => tad(c, 0, 1), 1.0, 150, () => frog(c), 1.1, 390, 0],
  ["#eaf4d6", () => caterpillar(c, 5), 0.55, 160, bflyS, 0.5, 380, 0],
  ["#fbf1c9", () => duck(c, true), 1.2, 100, () => duck(c, false), 1.0, 380, 0],
  ["#f6e8d2", maggot, 1.0, 110, fly, 1.5, 390, 0],
]);
// flow.a2 · Busy Beaks
const flowA2 = (c: Ctx) => {
  ground(c);
  shadow(c, 420, 880, 380, 40);
  shape(c, () => ell(c, 420, 760, 390, 140), "#e4a0a8", 6);
  shape(c, () => ell(c, 420, 750, 300, 90), "#b86b78", 5);
  [[270, "#f39a3c"], [420, "#5b8fd6"], [570, "#6aa53f"]].forEach(([x, col]) => {
    const X = x as number;
    shape(c, () => polyP(c, [[X - 56, 590], [X + 56, 590], [X + 42, 730], [X - 42, 730]]), WHITE, 6);
    shape(c, () => polyP(c, [[X - 50, 640], [X + 50, 640], [X + 46, 668], [X - 46, 668]]), col as string, 0);
    shape(c, () => ell(c, X, 590, 56, 14), "#efe9dc", 5);
    shape(c, () => polyP(c, [[X + 50, 582], [X + 102, 598], [X + 50, 604]]), COL.yellow, 5); shape(c, () => polyP(c, [[X + 48, 608], [X + 92, 624], [X + 46, 628]]), COL.yellow, 5);
    shape(c, () => ell(c, X - 18, 628, 8, 10), INK, 0);
  });
  bowl(c, 860, 830, 130);
  const r = rnd(3); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 800 + (i % 5) * 28 + r() * 8, 812 - Math.floor(i / 5) * 18 - r() * 6, 17, 13, r() * 3), "#fff6e0", 3);
  line(c, [[930, 300], [750, 500]], 36, INK); line(c, [[930, 300], [750, 500]], 24, COL.wood); line(c, [[880, 360], [760, 490]], 4, COL.woodDk);
  shape(c, () => ell(c, 780, 472, 20, 14, -0.8), COL.woodDk, 4);
  hand(c, 960, 250, 2.4, 1.3);
  shape(c, () => ell(c, 738, 520, 18, 13, 0.6), "#fff6e0", 3);
  arrow(c, [[800, 700], [690, 740]], RED, 12);
};
// flow.a3 · as long as a newborn: a string baby
const flowA3 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 650, 480, 36);
  shape(c, () => rrect(c, 60, 560, 960, 90, 26), "#f7f3e8", 6);
  const x0 = 170;
  shape(c, () => rrect(c, x0 + 80, 450, 340, 130, 50), CHICK, 6); shade(c, () => rrect(c, x0 + 80, 450, 340, 130, 50), CHICK_DK, 0, 24, 0.7);
  for (const dy of [0, 36]) { line(c, [[x0 + 400, 480 + dy], [x0 + 520, 490 + dy]], 46, INK); line(c, [[x0 + 400, 480 + dy], [x0 + 520, 490 + dy]], 34, CHICK); shape(c, () => ell(c, x0 + 524, 492 + dy, 18, 17), SKIN.child, 5); }
  shape(c, () => ell(c, x0 + 66, 510, 86, 80), SKIN.child); shape(c, () => ell(c, x0 + 40, 450, 50, 30, -0.3), CLOTH.hair, 5);
  shape(c, () => ell(c, x0 + 80, 500, 7, 9), INK, 0); shape(c, () => ell(c, x0 + 128, 504, 7, 9), INK, 0);
  c.beginPath(); c.arc(x0 + 104, 532, 14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  const xe = x0 + 560;
  line(c, [[x0 - 20, 700], [xe, 700]], 18, INK); line(c, [[x0 - 20, 700], [xe, 700]], 9, "#e6b85a");
  for (const x of [x0 - 20, xe]) line(c, [[x, 670], [x, 730]], 10, RED);
  line(c, [[x0 - 20, 440], [x0 - 20, 670]], 3, "rgba(43,35,64,0.4)"); line(c, [[xe, 530], [xe, 670]], 3, "rgba(43,35,64,0.4)");
  arrow(c, [[420, 790], [x0 - 10, 790]], RED, 12); arrow(c, [[500, 790], [xe + 10, 790]], RED, 12);
  write(c, "50", 395, 840, 80, INK, 9);
  write(c, "cm", 540, 870, 54, INK, 8);
};
// flow.p1 · banana jar: fly, maggot, brown case, fly
const flowP1 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 40, 470, 470, "#f6e8d2"); panel(c, 570, 40, 470, 470, "#fbf1c9"); panel(c, 570, 570, 470, 470, "#e3f1fa"); panel(c, 40, 570, 470, 470, "#f6e8d2");
  shadow(c, 270, 440, 120, 16); bit(c, 270, 440, 2.4, fly);
  const banana = (x: number, y: number) => shape(c, () => { c.moveTo(x - 160, y); c.bezierCurveTo(x - 120, y + 120, x + 120, y + 120, x + 160, y); c.bezierCurveTo(x + 100, y + 60, x - 100, y + 60, x - 160, y); c.closePath(); }, "#f5d04a", 6);
  banana(805, 280);
  bit(c, 740, 300, 1.2, maggot); bit(c, 860, 340, 1.1, maggot); bit(c, 800, 385, 1.0, maggot);
  shape(c, () => rrect(c, 600, 700, 410, 70, 14), "rgba(214,236,250,0.65)", 5);
  bit(c, 730, 760, 2.0, pupa); bit(c, 900, 760, 1.6, pupa);
  shadow(c, 270, 970, 120, 16); bit(c, 270, 970, 2.4, fly);
  arrow(c, [[420, 275], [560, 275]], RED, 14); arrow(c, [[805, 520], [805, 560]], RED, 14);
  arrow(c, [[570, 810], [500, 810]], RED, 14); arrow(c, [[275, 560], [275, 520]], RED, 14);
};
// flow.c1 · a nest for two eggs: a coiled newspaper nest with two lemons
const lemon = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => ell(c, -92, 0, 16, 13), "#e2b92e", 5); shape(c, () => ell(c, 92, 0, 16, 13), "#e2b92e", 5);
  const p = () => ell(c, 0, 0, 90, 64); shape(c, p, "#ffd84a"); shade(c, p, "#e2b92e", 20, 20, 0.7); shine(c, [[-52, -30], [-22, -46]], 9);
  c.restore();
};
const flowC1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 840, 320, 30);
  shape(c, () => { c.moveTo(210, 560); c.bezierCurveTo(250, 900, 830, 900, 870, 560); c.closePath(); }, ROPE);
  for (const [x, y, a] of [[250, 520, -0.5], [330, 500, -0.3], [800, 505, 0.4], [880, 535, 0.7]]) line(c, [[x - 70 * Math.cos(a), y - 70 * Math.sin(a) - 30], [x + 70 * Math.cos(a), y + 70 * Math.sin(a) - 30]], 9, "#6a4128");
  shape(c, () => ell(c, 540, 560, 330, 90), ROPE_DK, 6);
  lemon(c, 430, 540, -0.2); lemon(c, 650, 548, 0.18);
  const front = () => { c.moveTo(210, 560); c.ellipse(540, 560, 330, 90, 0, Math.PI, 0, true); c.bezierCurveTo(830, 900, 250, 900, 210, 560); c.closePath(); };
  shape(c, front, ROPE); shade(c, front, ROPE_DK, 40, 10, 0.7);
  c.save(); c.beginPath(); front(); c.clip();
  for (let k = 1; k <= 4; k++) { c.beginPath(); c.ellipse(540, 560 + k * 55, 335 - k * 22, 94, 0, 0.05, Math.PI - 0.05); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); for (let x = 200 + k * 20; x < 900 - k * 20; x += 46) { const yy = 560 + k * 55 + 94 * Math.sqrt(Math.max(0, 1 - ((x - 540) / (335 - k * 22)) ** 2)); line(c, [[x, yy - 26], [x + 14, yy - 4]], 4, "#8a7448"); } }
  c.restore();
  c.beginPath(); front(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
// term.0 young: a mother cat with three kittens
const termYoung = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 720, 500, 200), "#e4a0a8", 6); shape(c, () => ell(c, 540, 720, 430, 160), "#c9777f", 4);
  shadow(c, 780, 710, 280, 28);
  bit(c, 780, 700, 2.1, cat);
  shadow(c, 170, 855, 110, 16); shadow(c, 410, 870, 110, 16); shadow(c, 650, 855, 110, 16);
  bit(c, 170, 850, 1.6, kitten); bit(c, 410, 865, 1.6, kitten); bit(c, 650, 850, 1.6, kitten);
};
// term.1 parent: two pigeon parents either side of a nest with a chick
const termParent = (c: Ctx) => {
  ground(c); grass(c, 820);
  bit(c, 200, 840, 1.3, pigeon); flip(c, 880, 840, 1.3, pigeon);
  shadow(c, 545, 860, 150, 20);
  shape(c, () => ell(c, 545, 790, 150, 60), "#8a5a3c", 6);
  for (const [x, y, a] of [[430, 770, -0.3], [470, 745, 0.3], [620, 755, -0.2], [660, 780, 0.35], [545, 840, 0.05]]) line(c, [[x - 40, y], [x + 40, y + a * 40]], 9, "#6a4128");
  bit(c, 545, 800, 1.7, pigeonChick);
  shape(c, () => ell(c, 545, 820, 150, 40), "#a8723f", 0);
  for (const [x, y] of [[430, 800], [490, 825], [560, 830], [620, 815], [660, 798]]) line(c, [[x - 28, y], [x + 28, y - 6]], 9, "#6a4128");
};
// term.2 hatch: a chick pushing out of a cracked egg
const termHatch = (c: Ctx) => {
  ground(c); shadow(c, 540, 900, 300, 34);
  bit(c, 540, 700, 3.4, () => {
    shape(c, () => ell(c, 0, -52, 46, 40), CHICK); shape(c, () => ell(c, 4, -90, 34, 32), CHICK);
    shape(c, () => polyP(c, [[32, -92], [62, -84], [32, -76]]), COL.orange, 4);
    shape(c, () => ell(c, 14, -98, 5, 6), INK, 0);
    shape(c, () => ell(c, -22, -56, 16, 10, 0.5), CHICK_DK, 3);
  });
  cracked(c, 540, 720, 2.2);
  c.save(); c.translate(870, 330); c.rotate(0.6); c.scale(1.25, 1.25);
  const top = () => { c.moveTo(-80, 0); [[-60, 28], [-36, -2], [-12, 30], [12, -2], [36, 28], [60, -2], [80, 14]].forEach(([a, b]) => c.lineTo(a, b)); c.bezierCurveTo(70, -90, 20, -130, 0, -130); c.bezierCurveTo(-20, -130, -70, -90, -80, 0); c.closePath(); };
  shape(c, top, EGG); shade(c, top, EGG_DK, -14, -8, 0.8); c.restore();
  for (const [x, y, a] of [[220, 800, 0.4], [860, 820, -0.5], [720, 560, 0.8]]) shape(c, () => polyP(c, [[x - 30, y], [x, y - 24], [x + 30, y + 4]]), EGG, 5);
};
// term.3 grow up: puppy, young dog, dog
const termGrow = (c: Ctx) => {
  ground(c); grass(c, 780);
  shadow(c, 170, 800, 90, 16); shadow(c, 520, 805, 140, 18); shadow(c, 900, 810, 180, 22);
  bit(c, 160, 800, 1.5, puppy); bit(c, 520, 805, 1.35, youngDog); bit(c, 880, 810, 1.3, dog);
  arrow(c, [[290, 600], [370, 600]], RED, 14); arrow(c, [[660, 600], [740, 600]], RED, 14);
};
// expl.0 every animal has young
const explAll = (c: Ctx) => {
  ground(c);
  const P = (x: number, y: number, col: string) => { panel(c, x, y, 500, 480, col); line(c, [[x + 30, y + 420], [x + 470, y + 420]], 4, "rgba(43,35,64,0.3)"); };
  P(30, 40, "#f6efd9"); P(550, 40, "#fbf1c9"); P(30, 560, "#e3f1fa"); P(550, 560, "#f6e8d2");
  bit(c, 185, 460, 0.95, cow); bit(c, 430, 460, 0.8, calf);
  bit(c, 690, 460, 1.0, hen); bit(c, 985, 460, 0.8, chick); bit(c, 890, 460, 1.2, chick);
  shape(c, () => ell(c, 400, 960, 120, 50), "#8fc3ea", 5);
  bit(c, 160, 970, 1.3, frog); bit(c, 360, 955, 0.9, tad); bit(c, 440, 975, 0.9, tad); bit(c, 400, 935, 0.9, tad);
  person(c, 800, 1010, 400, { adult: true, armL: [Math.PI * 0.62, Math.PI * 0.1], armR: [Math.PI * 0.38, Math.PI * 0.9] });
  baby(c, 815, 810, 1.2);
};
// expl.1 some young look like their parents, some do not
const explSome = (c: Ctx) => {
  ground(c);
  const cells: [string, () => void, number, number, () => void, number, number][] = [
    ["#f6efd9", kitten, 1.2, 100, cat, 1.0, 385], ["#eaf4d6", calf, 0.8, 110, cow, 0.55, 380],
    ["#e3f1fa", () => tad(c, 0, 1), 1.0, 150, () => frog(c), 1.1, 390], ["#eaf4d6", () => caterpillar(c, 5), 0.55, 160, bflyS, 0.5, 380],
  ];
  cells.forEach(([col, a, as, ax, b, bs, bx], i) => {
    const px = 30 + (i % 2) * 520, py = 40 + Math.floor(i / 2) * 520; panel(c, px, py, 500, 480, col);
    line(c, [[px + 30, py + 408], [px + 470, py + 408]], 4, "rgba(43,35,64,0.3)");
    bit(c, px + ax, py + 400, as, a); bit(c, px + bx, py + 400, bs, b);
    arrow(c, [[px + 210, py + 300], [px + 280, py + 300]], RED, 12);
  });
};
// expl.2 a baby is shaped differently: legs grow most
const explShape = (c: Ctx) => {
  ground(c); const hh = 80, y = 900;
  line(c, [[40, y], [1040, y]], 6);
  fig(c, 230, y, hh, 4, "baby"); fig(c, 540, y, hh, 6, "child"); fig(c, 850, y, hh, 7, "adult");
  for (const [x, heads, kind] of [[120, 4, "baby"], [410, 6, "child"], [740, 7, "adult"]] as [number, number, "baby" | "child" | "adult"][]) {
    const hip = y - LEGS[kind] * hh; line(c, [[x, hip], [x, y - 6]], 9, RED); line(c, [[x - 14, hip], [x + 14, hip]], 9, RED); line(c, [[x - 14, y - 6], [x + 14, y - 6]], 9, RED); void heads;
  }
  arrow(c, [[250, 240], [800, 240]], RED, 14);
};

export const ic_animalsAnimalBabiesL1 = cards("sci.animals.animal-babies.L1 cards", [
  summary, flowE1, flowA1, flowA2, flowA3, flowP1, flowC1, termYoung, termParent, termHatch, termGrow, explAll, explSome, explShape,
]);
