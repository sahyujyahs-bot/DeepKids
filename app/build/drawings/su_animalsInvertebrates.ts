import type { Ctx } from "./core";
import { INK, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, person, write, cards } from "./flatKit";

// sci.animals.invertebrates.L3 set-up cards. Light from the upper left, shade on the lower right.
// Same bottle, board, books and bag on every card of an experiment.

// the shade side of a shape: the crescent on the lower right (shade() in the kit shifts the other way)
const dark = (c: Ctx, path: () => void, col: string, dx: number, dy: number, a = 0.5) => shade(c, path, col, -dx, -dy, a);
const hull = (p: number[][]) => {
  const s = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: number[][] = [], up: number[][] = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...s].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};
// a box: front face with its bottom-left corner at (x, y), depth going up and to the right by (dx, dy)
const box = (c: Ctx, x: number, y: number, w: number, h: number, dx: number, dy: number, front: string, top: string, side: string, lw = 5) => {
  shape(c, () => polyP(c, [[x + w, y - h], [x + w + dx, y - h + dy], [x + w + dx, y + dy], [x + w, y]]), side, lw);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w + dx, y - h + dy], [x + dx, y - h + dy]]), top, lw);
  shape(c, () => polyP(c, [[x, y - h], [x + w, y - h], [x + w, y], [x, y]]), front, lw);
};
const BK = { dx: 28, dy: -18 };
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string, top: string, side: string) => {
  box(c, x, y, w, h, BK.dx, BK.dy, col, top, side);
  shape(c, () => polyP(c, [[x + 16, y - h + 8], [x + w - 3, y - h + 8], [x + w - 3, y - 8], [x + 16, y - 8]]), COL.paper, 3);
};
const BOOKS: [string, string, string][] = [[COL.purple, "#a58be0", "#6d52a8"], [COL.orange, "#f7b46a", "#c97a20"], [COL.green, COL.greenLt, COL.greenDk], [COL.pink, "#f8bccd", "#c9708b"], [COL.blue, "#8db4ea", COL.blueDk], [COL.yellow, "#ffe58a", "#d9ad1f"]];
const DX = 80, DY = -50; // the way a bottle lying on its side goes back
const board = (c: Ctx, x: number, y: number, w: number) => box(c, x, y, w, 24, DX, DY, COL.wood, "#f8d98a", COL.woodDk);

type Kind = "open" | "cap" | "water";
// a bottle lying on its side, its neck end towards us at (x, y), the body going back to the upper right
const lying = (c: Ctx, x: number, y: number, rx: number, ry: number, kind: Kind) => {
  const pts: number[][] = [];
  for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; for (const [ox, oy] of [[0, 0], [DX, DY]]) pts.push([x + ox + Math.cos(a) * rx, y + oy + Math.sin(a) * ry]); }
  const H = hull(pts), body = () => polyP(c, H), wet = kind === "water";
  shadow(c, x + DX / 2 + 24, y + ry - 4, rx + DX / 2 + 30, 22);
  shape(c, body, wet ? COL.water : "#d6ecfa");
  dark(c, body, wet ? COL.waterDk : COL.glassEdge, 26, -14, 0.55);
  shine(c, [[x - rx * 0.5, y - ry * 0.75], [x + DX * 0.85 - rx * 0.4, y + DY * 0.85 - ry * 0.8]], 8);
  shape(c, () => ell(c, x, y, rx, ry), wet ? COL.water : "#e6f3fc");
  if (ry >= 30) shape(c, () => ell(c, x, y, rx * 0.55, ry * 0.55), wet ? COL.waterDk : "#cfe3f2", 4);
  if (ry < 30) for (const t of [0.35, 0.65]) line(c, [[x + DX * t - rx * 0.85, y + DY * t], [x + DX * t - rx * 0.3, y + DY * t - 5], [x + DX * t + rx * 0.3, y + DY * t + 4], [x + DX * t + rx * 0.85, y + DY * t]], 3);
  if (ry < 30) shape(c, () => ell(c, x - rx * 0.62, y, rx * 0.2, ry * 0.7), COL.steelDk, 4);
  else if (kind === "open") shape(c, () => ell(c, x, y, rx * 0.3, ry * 0.3), "#4f6f8a", 4);
  else shape(c, () => ell(c, x, y, rx * 0.34, ry * 0.34), COL.blue, 5);
};
// a bottle standing at (x, y); kind open = no cap, cap = capped and empty, water = full and capped
const standing = (c: Ctx, x: number, y: number, w: number, h: number, kind: Kind, o: { waist?: number; level?: number } = {}) => {
  const hw = w / 2, nk = w * 0.17, wa = (o.waist ?? 0) * hw * 0.55, sy = y - h * 0.62, ny = y - h * 0.78, ty = y - h * 0.95;
  const L = kind === "water" ? 0.95 : o.level ?? 0;
  const body = () => {
    c.moveTo(x - hw + 14, y); c.quadraticCurveTo(x - hw, y, x - hw, y - 14);
    c.bezierCurveTo(x - hw + wa, y - h * 0.25, x - hw + wa, y - h * 0.45, x - hw, sy);
    c.bezierCurveTo(x - hw, y - h * 0.7, x - nk, y - h * 0.68, x - nk, ny);
    c.lineTo(x - nk, ty); c.lineTo(x + nk, ty); c.lineTo(x + nk, ny);
    c.bezierCurveTo(x + nk, y - h * 0.68, x + hw, y - h * 0.7, x + hw, sy);
    c.bezierCurveTo(x + hw - wa, y - h * 0.45, x + hw - wa, y - h * 0.25, x + hw, y - 14);
    c.quadraticCurveTo(x + hw, y, x + hw - 14, y); c.closePath();
  };
  shadow(c, x + w * 0.18, y + 6, w * 0.62, 16);
  shape(c, body, "#d6ecfa", 0);
  if (L > 0) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - hw - 5, y - h * L, w + 10, h * L + 5); c.restore(); shape(c, () => ell(c, x, y - h * L, nk, 6), COL.drop, 0); }
  dark(c, body, L > 0.5 ? COL.waterDk : COL.glassEdge, 18, 0, 0.5);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[x - hw * 0.62, y - h * 0.5], [x - hw * 0.62 + wa * 0.3, y - h * 0.18]], 8);
  if (kind === "open") shape(c, () => ell(c, x, ty, nk + 5, 8), "#eaf4fb", 5);
  else { shape(c, () => rrect(c, x - nk - 8, y - h, nk * 2 + 16, h * 0.085, 6), COL.blue, 5); dark(c, () => rrect(c, x - nk - 8, y - h, nk * 2 + 16, h * 0.085, 6), COL.blueDk, 12, 0, 0.7); }
};
// the towel the experiment is set up on; a card is lifted so the towel runs off the bottom
const lift = (f: (c: Ctx) => void) => (c: Ctx) => { ground(c); c.save(); c.translate(0, -110); f(c); c.restore(); };
const towel = (c: Ctx) => {
  shape(c, () => polyP(c, [[40, 810], [1040, 810], [1110, 1260], [-30, 1260]]), COL.teal, 6);
  for (const y of [880, 980]) { const k = ((y - 810) / 450) * 70; line(c, [[40 - k, y], [1040 + k, y]], 14, "#ffffff"); }
  dark(c, () => polyP(c, [[40, 810], [1040, 810], [1110, 1260], [-30, 1260]]), COL.tealDk, 0, -18, 0.5);
};
const GY = 880;
const ruler = (c: Ctx, x: number, gy: number) => {
  const u = 44, w = 64;
  shadow(c, x + w * 0.6, gy + 12, w * 0.8, 10);
  shape(c, () => rrect(c, x, gy - 10 * u - 20, w, 10 * u + 30, 6), COL.wood);
  dark(c, () => rrect(c, x, gy - 10 * u - 20, w, 10 * u + 30, 6), COL.woodDk, 14, 0, 0.5);
  for (let cm = 0; cm <= 10; cm++) line(c, [[x + w, gy - cm * u], [x + w - (cm % 5 === 0 ? 34 : 20), gy - cm * u]], 4);
  write(c, "0", x + 8, gy - 16, 28, INK, 5); write(c, "5", x + 8, gy - 5 * u - 14, 28, INK, 5); write(c, "10", x + 6, gy - 10 * u - 14, 28, INK, 5);
};
const level = (c: Ctx, x0: number, x1: number, y: number) => { c.save(); c.setLineDash([16, 12]); line(c, [[x0, y], [x1, y]], 5, RED); c.restore(); };

// ---- the stack of two lying bottles with the board across them (L, R = the bottles' fronts; top = height of the board's front top edge)
const L = 430, R = 720, RB = 100;
const stack = (c: Ctx, kind: Kind, flat: boolean) => {
  const ry = flat ? 16 : RB;
  lying(c, L, GY - ry, RB, ry, kind); lying(c, R, GY - ry, RB, ry, kind);
  const top = GY - 2 * ry - 24;
  board(c, 270, top + 24, 610);
  return top;
};

// setup.e1.0
const e1_0 = lift((c: Ctx) => {
  towel(c);
  const pair = (x: number, kind: Kind) => { standing(c, x - 72, 860, 138, 470, kind); standing(c, x + 72, 860, 138, 470, kind); };
  pair(180, "open"); pair(540, "cap"); pair(900, "water");
});
// setup.e1.1
const e1_1 = lift((c: Ctx) => {
  towel(c); ruler(c, 40, GY);
  const top = stack(c, "open", false);
  book(c, L - RB - 120, GY, 120, 80, BOOKS[3][0], BOOKS[3][1], BOOKS[3][2]); book(c, R + RB, GY, 120, 80, BOOKS[3][0], BOOKS[3][1], BOOKS[3][2]);
  level(c, 104, 268, top);
});
// setup.e1.2
const e1_2 = lift((c: Ctx) => {
  towel(c); ruler(c, 40, GY);
  const top = stack(c, "open", true);
  for (let i = 0; i < 5; i++) { const b = BOOKS[i]; book(c, 350 + (i % 2) * 14, top - 6 - i * 50, 380, 46, b[0], b[1], b[2]); }
  level(c, 104, 268, top);
  person(c, 215, GY, 470, { armL: [1.9, 2.0] });
});
// setup.e1.3
const e1_3 = lift((c: Ctx) => {
  towel(c); ruler(c, 40, GY);
  const top = stack(c, "cap", false);
  level(c, 104, 268, top);
  person(c, 575, top - 26, 380, { sit: true, armR: [0.6, -0.5] });
  person(c, 960, GY, 700, { adult: true, armL: [2.5, 2.58] });
});
// setup.e1.4
const e1_4 = (c: Ctx) => {
  ground(c);
  const one = (bx: number, waist: number, kind: Kind) => {
    standing(c, bx, 940, 170, 640, kind, { waist });
    hand(c, bx - 138, 700, 0, 1.2, SKIN.child, CLOTH.child); hand(c, bx + 138, 700, Math.PI, 1.2, SKIN.child, CLOTH.child);
    arrow(c, [[bx - 215, 540], [bx - 125, 540]]); arrow(c, [[bx + 215, 540], [bx + 125, 540]]);
  };
  one(280, 0.8, "cap"); one(800, 0, "water");
};
// setup.e1.5
const e1_5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 450, 40);
  shape(c, () => rrect(c, 70, 760, 940, 270, 36), COL.steel, 6);
  shape(c, () => rrect(c, 120, 800, 840, 190, 28), COL.steelIn, 5);
  dark(c, () => rrect(c, 120, 800, 840, 190, 28), COL.steelDk, 0, 30, 0.55);
  shape(c, () => ell(c, 540, 900, 46, 20), COL.steelDk, 5);
  line(c, [[930, 770], [930, 640], [800, 640], [800, 690]], 40, INK); line(c, [[930, 770], [930, 640], [800, 640], [800, 690]], 28, COL.steel);
  standing(c, 520, 740, 210, 640, "open", { waist: 0.6, level: 0.9 });
  line(c, [[520 - 40, 740 - 640 * 0.84], [520 + 40, 740 - 640 * 0.84]], 7, INK);
  hand(c, 345, 560, 0, 1.4, SKIN.child, CLOTH.child); hand(c, 695, 560, Math.PI, 1.4, SKIN.child, CLOTH.child);
  arrow(c, [[640, 330], [640, 190]]);
};

// ---- paper columns
const tube = (c: Ctx, x: number, y: number, h: number, crumple = 0) => {
  const r = 95, ry = 28, n = 8, off = (i: number) => (i === 0 || i === n ? 0 : crumple * (i % 2 ? 16 : -10));
  const body = () => {
    c.moveTo(x - r, y - h);
    for (let i = 1; i <= n; i++) c.lineTo(x - r - off(i), y - h + (h * i) / n);
    c.ellipse(x, y, r, ry, 0, Math.PI, 0, true);
    for (let i = n - 1; i >= 0; i--) c.lineTo(x + r + off(i), y - h + (h * i) / n);
    c.ellipse(x, y - h, r, ry, 0, 0, Math.PI, true); c.closePath();
  };
  shadow(c, x + 26, y + 8, r + 30, ry);
  shape(c, body, COL.paper); dark(c, body, "#d9cfb8", 40, 0, 0.8);
  if (crumple) for (let i = 1; i < n; i++) line(c, [[x - r - off(i), y - h + (h * i) / n], [x + r + off(i), y - h + (h * i) / n + 8]], 3, "#9a8f7a");
  shape(c, () => ell(c, x, y - h, r, ry), "#cfc4ad");
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const H = 520, Y = 900;
  tube(c, 250, Y, H);
  shadow(c, 610, Y + 8, 150, 30);
  box(c, 440, Y, 150, H, 70, -40, COL.paper, "#cfc4ad", "#d9cfb8");
  shape(c, () => polyP(c, [[455, Y - H - 6], [575, Y - H - 6], [625, Y - H - 36], [505, Y - H - 36]]), "#b3a88f", 3);
  shadow(c, 850, Y + 8, 150, 30);
  const xs = [740, 785, 830, 875, 920, 965];
  for (let i = 0; i < 5; i++) {
    const a = i % 2 ? 26 : -8, b = i % 2 ? -8 : 26;
    shape(c, () => polyP(c, [[xs[i], Y - H + a], [xs[i + 1], Y - H + b], [xs[i + 1], Y + b], [xs[i], Y + a]]), i % 2 ? "#d9cfb8" : COL.paper);
  }
  line(c, [[60, Y - H], [60, Y]], 5); line(c, [[44, Y - H], [76, Y - H]], 5); line(c, [[44, Y], [76, Y]], 5);
  write(c, "21 cm", 30, 280, 50);
};
const triangle = (c: Ctx, H: number, crumple: number, dx = 0) => {
  const fb = 830, bb = 620, ry = 28;
  tube(c, 540 + dx, bb, H, crumple); tube(c, 350 + dx, fb, H, crumple); tube(c, 730 + dx, fb, H, crumple);
  const fy = fb - H + ry + 12, by = bb - H - ry - 14;
  shape(c, () => polyP(c, [[210 + dx, fy - 28], [880 + dx, fy - 28], [800 + dx, by], [290 + dx, by]]), "#f8d98a");
  box(c, 210 + dx, fy, 670, 28, 0, 0, COL.wood, COL.wood, COL.woodDk);
  return fy;
};
// setup.e2.1
const e2_1 = (c: Ctx) => { ground(c); triangle(c, 420, 0); };
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  const fy = triangle(c, 330, 1, -180);
  for (let i = 0; i < 5; i++) { const b = BOOKS[i]; book(c, 215 + (i % 2) * 12, fy - 50 - i * 46, 350, 42, b[0], b[1], b[2]); }
  c.save(); c.translate(0, -130);
  shadow(c, 850, 960, 150, 22);
  shape(c, () => rrect(c, 700, 540, 260, 360, 8), "#ffffff");
  for (const y of [630, 720, 810]) line(c, [[700, y], [960, y]], 4, "#8a8fa6");
  line(c, [[800, 540], [800, 900]], 4, "#8a8fa6");
  write(c, "1", 740, 565, 44); write(c, "2", 740, 655, 44); write(c, "3", 740, 745, 44); write(c, "2", 855, 565, 44); write(c, "4", 855, 655, 44);
  line(c, [[880, 790], [1000, 955]], 22, INK); line(c, [[880, 790], [1000, 955]], 12, COL.orange);
  write(c, "6", 850, 745, 44, COL.blueDk);
  hand(c, 993, 943, -2.2, 1.4, SKIN.child, CLOTH.child);
  c.restore();
};

// ---- the tile wall, suckers and the bag
const wall = (c: Ctx) => {
  c.fillStyle = "#e6f1f3"; c.fillRect(0, 0, 1080, 1080);
  c.strokeStyle = "#a9c3cc"; c.lineWidth = 4;
  for (let v = 0; v <= 1080; v += 135) { c.beginPath(); c.moveTo(v, 0); c.lineTo(v, 1080); c.stroke(); c.beginPath(); c.moveTo(0, v); c.lineTo(1080, v); c.stroke(); }
};
// a rubber sucker with a hook, pressed flat on the tile; gives the point to tie a string to
const sucker = (c: Ctx, x: number, y: number, r: number): number[] => {
  const s = r / 150;
  c.beginPath(); ell(c, x + r * 0.1, y + r * 0.12, r, r); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill();
  shape(c, () => ell(c, x, y, r, r), COL.red); dark(c, () => ell(c, x, y, r, r), "#b83a28", r * 0.2, r * 0.2, 0.7);
  shape(c, () => ell(c, x, y, r * 0.72, r * 0.72), "#f07a5f", 5);
  shape(c, () => ell(c, x, y, r * 0.2, r * 0.2), COL.steel, 5);
  const hk = () => { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 78 * s); c.quadraticCurveTo(x, y + 114 * s, x + 32 * s, y + 114 * s); c.quadraticCurveTo(x + 64 * s, y + 114 * s, x + 64 * s, y + 78 * s); c.lineCap = "round"; };
  hk(); c.strokeStyle = INK; c.lineWidth = 20 * s + 8; c.stroke(); hk(); c.strokeStyle = COL.steel; c.lineWidth = 20 * s; c.stroke();
  return [x + 32 * s, y + 98 * s];
};
// a cloth bag with a mouth, its handles tied to one knot; rice fills the mouth from 0 (nothing) to 1 (heaped)
const bag = (c: Ctx, x: number, top: number, w: number, h: number, rice: number): number[] => {
  const hw = w / 2, body = () => { c.moveTo(x - hw, top); c.bezierCurveTo(x - hw * 1.3, top + h * 0.3, x - hw * 1.35, top + h * 0.8, x - hw * 1.05, top + h - 14); c.quadraticCurveTo(x - hw, top + h, x - hw * 0.8, top + h); c.lineTo(x + hw * 0.8, top + h); c.quadraticCurveTo(x + hw, top + h, x + hw * 1.05, top + h - 14); c.bezierCurveTo(x + hw * 1.35, top + h * 0.8, x + hw * 1.3, top + h * 0.3, x + hw, top); c.closePath(); };
  const knot = [x, top - h * 0.3];
  shadow(c, x + w * 0.1, top + h + 8, w * 0.7, 14);
  shape(c, () => ell(c, x, top, hw, w * 0.12), "#cbbf9f", 6);
  const rg = (() => { let s = 5; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
  const n = Math.round(rice * 46);
  for (let i = 0; i < n; i++) { const a = rg() * Math.PI * 2, rr = Math.sqrt(rg()); const px = x + Math.cos(a) * rr * hw * 0.85, py = top + Math.sin(a) * rr * w * 0.09 - rice * w * 0.1 * (1 - rr) * 0.9; ell2(c, px, py); }
  shape(c, body, COL.cloth); dark(c, body, "#d9cfb3", 30, 0, 0.8);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.teal; c.fillRect(x - w, top + h * 0.3, w * 2, h * 0.14); c.fillStyle = COL.yellow; c.fillRect(x - w, top + h * 0.5, w * 2, h * 0.05); c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  c.beginPath(); c.ellipse(x, top, hw, w * 0.12, 0, Math.PI, 0, false); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x - hw, top], knot, [x + hw, top]], 5);
  shape(c, () => ell(c, knot[0], knot[1], 14, 14), COL.brown, 4);
  return knot;
};
const ell2 = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 10, 6.5, 0.4), "#fffdf5", 3); };
// setup.e3.0
const e3_0 = (c: Ctx) => {
  wall(c);
  c.fillStyle = "#d9c9a8"; c.fillRect(0, 930, 1080, 150); line(c, [[0, 930], [1080, 930]], 6);
  shape(c, () => polyP(c, [[230, 965], [760, 965], [800, 1060], [190, 1060]]), COL.teal, 6);
  line(c, [[240, 1000], [770, 1000]], 12, "#ffffff");
  sucker(c, 400, 500, 160);
  hand(c, 625, 660, Math.PI + 0.6, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[860, 380], [700, 450]]);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  wall(c);
  const hk = sucker(c, 500, 170, 90);
  const knot = bag(c, 500, 560, 280, 330, 0.25);
  line(c, [hk, knot], 5);
  c.save(); c.translate(700, 300); c.rotate(-0.8); bowl(c, 0, 0, 125); c.restore();
  for (let i = 0; i < 9; i++) ell2(c, 614 - i * 0.6 + (i % 3) * 7 - 7, 402 + i * 17);
  hand(c, 816, 428, Math.PI + 0.8, 1.4, SKIN.child, CLOTH.child);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  wall(c);
  const hs = [200, 420, 660, 880].map((x) => sucker(c, x, 150, 72));
  const knot = bag(c, 540, 610, 400, 380, 1);
  hs.forEach((p) => line(c, [p, knot], 5));
};

export const su_animalsInvertebrates = cards("sci.animals.invertebrates.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e1_4, e1_5, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
