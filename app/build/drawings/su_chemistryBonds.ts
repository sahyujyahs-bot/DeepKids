import type { Ctx } from "./core";
import { D, INK, WHITE, RED, SH, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, glass, plate, hand, write, cards } from "./flatKit";

// SET-UP CARDS · sci.chemistry.bonds.L3 (water pulled apart by a battery; sugar and wax heated; plain, sugar and soda water)

const bez = (p0: number[], p1: number[], p2: number[], p3: number[], n = 30) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; });
const wire = (c: Ctx, pts: number[][], col: string) => { line(c, pts, 17, INK); line(c, pts, 9, col); };
const BLACKWIRE = "#4a4553";
const bubble = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", 3.5);

// a pencil sharpened at both ends, top tip at y1, bottom tip at y2
const pencil = (c: Ctx, x: number, y1: number, y2: number, w = 40) => {
  const t = 62, h = w / 2, body = () => polyP(c, [[x - h, y1 + t], [x + h, y1 + t], [x + h, y2 - t], [x - h, y2 - t]]);
  shape(c, body, COL.yellow, 5); shade(c, body, COL.orange, -w * 0.35, 0, 0.7);
  line(c, [[x - h * 0.3, y1 + t + 10], [x - h * 0.3, y2 - t - 10]], 4, "#fff3b8");
  shape(c, () => polyP(c, [[x - h, y1 + t], [x + h, y1 + t], [x, y1]]), "#f6d9a8", 5);
  shape(c, () => polyP(c, [[x - h * 0.3, y1 + t * 0.5], [x + h * 0.3, y1 + t * 0.5], [x, y1]]), COL.black, 3);
  shape(c, () => polyP(c, [[x - h, y2 - t], [x + h, y2 - t], [x, y2]]), "#f6d9a8", 5);
  shape(c, () => polyP(c, [[x - h * 0.3, y2 - t * 0.5], [x + h * 0.3, y2 - t * 0.5], [x, y2]]), COL.black, 3);
};

// a 9-volt battery standing on the counter; knobs at x -/+ 0.27w, top of the knobs at yb-h-20
const battery = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  const t = yb - h, k = w * 0.27, body = () => rrect(c, x - w / 2, t, w, h, 14);
  shadow(c, x + w * 0.1, yb + 4, w * 0.62, 12);
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, -w * 0.22, 0, 0.6);
  shape(c, () => rrect(c, x - w / 2, t, w, h * 0.15, 10), COL.steel, 6);
  shape(c, () => rrect(c, x - k - 17, t - 22, 34, 26, 6), COL.steelDk, 5);
  shape(c, () => rrect(c, x + k - 17, t - 22, 34, 26, 6), COL.steelDk, 5);
  write(c, "-", x - k - 14, t + h * 0.32, h * 0.16, WHITE, 8); write(c, "+", x + k - 14, t + h * 0.32, h * 0.16, WHITE, 8);
};

type Rig = { cx: number; yb: number; w: number; h: number; dx: number; fill: number; batX?: number; batW?: number; batH?: number; black?: number; red?: number; dim?: boolean; over?: number };
// a glass of water with two pencils through a cardboard strip; with batX: a battery beside it, red wire to the near pencil, black to the far one
const rig = (c: Ctx, o: Rig) => {
  const { cx, yb, w, h, dx, fill } = o, rimY = yb - h, y1 = rimY - 250, y2 = yb - 80, px = [cx - dx, cx + dx], sy = rimY - 14;
  const top = w / 2, bot = w * 0.4, ly = yb - h * fill, lw = bot + (top - bot) * fill;
  glass(c, cx, yb, w, h, fill);
  px.forEach((x) => pencil(c, x, y1, y2));
  c.save(); c.beginPath(); c.moveTo(cx - lw, ly); c.lineTo(cx + lw, ly); c.lineTo(cx + bot, yb); c.lineTo(cx - bot, yb); c.closePath(); c.clip(); c.fillStyle = "rgba(143,195,234,0.5)"; c.fillRect(0, 0, D, D); c.restore();
  const ov = o.over ?? 60, strip = () => rrect(c, cx - w / 2 - ov, sy, w + ov * 2, 28, 4);
  shape(c, strip, "#c99a62", 5); shade(c, strip, "#9c6f3d", 0, -10, 0.6);
  c.save(); c.beginPath(); c.rect(0, 0, D, sy); c.clip(); px.forEach((x) => pencil(c, x, y1, y2)); c.restore();
  const r = rnd(5);
  const stream = (x: number, n: number, big: number) => { for (let i = 0; i < n; i++) { const f = n > 1 ? i / (n - 1) : 0.3, yy = y2 - 24 - f * (y2 - ly - 60); bubble(c, x + (r() - 0.5) * 46, yy, (5 + f * 7 + r() * 4) * big); } };
  if (o.batX !== undefined) {
    const sgn = o.batX < cx ? -1 : 1, bw = o.batW ?? 130, bh = o.batH ?? 250, k = bw * 0.27, tT = yb - bh - 20, cy = y1 + 94;
    const xFar = cx - sgn * dx, xNear = cx + sgn * dx;
    battery(c, o.batX, yb, bw, bh);
    wire(c, bez([o.batX + sgn * k, tT], [o.batX + sgn * k, y1 - 210], [xFar - sgn * 110, y1 - 120], [xFar - sgn * 18, cy]), BLACKWIRE);
    wire(c, bez([o.batX - sgn * k, tT], [o.batX - sgn * k, cy + 140], [xNear + sgn * 110, cy - 10], [xNear + sgn * 18, cy]), RED);
    for (let i = 0; i < 3; i++) { wire(c, [[xFar - 26, cy - 14 + i * 14], [xFar + 26, cy - 6 + i * 14]], BLACKWIRE); wire(c, [[xNear - 26, cy - 14 + i * 14], [xNear + 26, cy - 6 + i * 14]], RED); }
    const big = w > 380 ? 1.25 : 1;
    stream(xFar, o.black ?? 0, big); stream(xNear, o.red ?? 0, big);
  }
  if (o.dim) {
    const yd = rimY - 70, a = cx - dx + 24, b = cx + dx - 24;
    line(c, [[a, yd], [b, yd]], 5); line(c, [[a, yd - 16], [a, yd + 16]], 5); line(c, [[b, yd - 16], [b, yd + 16]], 5);
    write(c, "2 cm", cx + dx + 50, yd - 40, 52, INK, 7);
  }
};

const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.bezierCurveTo(x + s * 0.2, y - s * 0.6, x + s, y - s * 0.4, x + s, y + s * 0.3); c.bezierCurveTo(x + s, y + s * 1.1, x - s, y + s * 1.1, x - s, y + s * 0.3); c.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.2, y - s * 0.6, x, y - s * 1.5); c.closePath(); }, COL.drop, 4);

// ---- spoons seen from above (bowl centre x, y; handle runs down)
const spoonTop = (c: Ctx, x: number, y: number) => {
  const handle = () => { c.moveTo(x - 26, y + 110); c.lineTo(x - 38, y + 520); c.quadraticCurveTo(x, y + 570, x + 38, y + 520); c.lineTo(x + 26, y + 110); c.closePath(); };
  shadow(c, x + 16, y + 20, 122, 152);
  shape(c, handle, COL.steel); shade(c, handle, COL.steelDk, -14, 0, 0.55);
  shape(c, () => ell(c, x, y, 120, 150), COL.steel); shade(c, () => ell(c, x, y, 120, 150), COL.steelDk, -16, -12, 0.5);
  shape(c, () => ell(c, x - 2, y - 4, 98, 128), COL.steelIn, 4);
};
const sugarHeap = (c: Ctx, x: number, y: number) => {
  const blob = () => ell(c, x, y + 6, 88, 112);
  shape(c, blob, WHITE, 5); shade(c, blob, "#d9d0bd", -16, -12, 0.8);
  const r = rnd(21);
  for (let i = 0; i < 46; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 0.82, gx = x + Math.cos(a) * 88 * d, gy = y + 6 + Math.sin(a) * 112 * d, s = 7 + r() * 3, an = r() * 3; c.beginPath(); polyP(c, [[gx + Math.cos(an) * s, gy + Math.sin(an) * s], [gx - Math.sin(an) * s, gy + Math.cos(an) * s], [gx - Math.cos(an) * s, gy - Math.sin(an) * s], [gx + Math.sin(an) * s, gy - Math.cos(an) * s]]); c.fillStyle = WHITE; c.fill(); c.strokeStyle = "#a9a398"; c.lineWidth = 2; c.stroke(); }
};
const waxShavings = (c: Ctx, x: number, y: number) => {
  const r = rnd(33);
  for (let i = 0; i < 8; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()) * 0.7, px = x + Math.cos(a) * 80 * d, py = y + 6 + Math.sin(a) * 105 * d, rr = 30 + r() * 12, a0 = r() * 6;
    c.beginPath(); c.arc(px, py, rr, a0, a0 + 4.3); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke();
    c.beginPath(); c.arc(px, py, rr, a0, a0 + 4.3); c.strokeStyle = i % 2 ? "#fbf2cf" : "#f1e3b0"; c.lineWidth = 14; c.stroke();
  }
};
const brownLump = (c: Ctx, x: number, y: number) => {
  const blob = () => { c.moveTo(x - 84, y + 20); c.bezierCurveTo(x - 90, y - 90, x - 20, y - 118, x + 40, y - 100); c.bezierCurveTo(x + 96, y - 80, x + 96, y + 60, x + 50, y + 108); c.bezierCurveTo(x, y + 128, x - 80, y + 100, x - 84, y + 20); c.closePath(); };
  shape(c, blob, "#c9741c", 6); shade(c, blob, "#7a3f12", -22, -18, 0.75);
  shape(c, () => ell(c, x - 18, y - 20, 40, 52, 0.4), "#e8a23c", 0);
  shine(c, [[x - 50, y - 50], [x - 30, y - 80], [x + 5, y - 88]], 10); shine(c, [[x - 60, y - 10], [x - 58, y + 16]], 7);
  line(c, [[x + 20, y - 10], [x + 52, y + 24], [x + 40, y + 60]], 3.5, "#6a3410");
};
const waxLump = (c: Ctx, x: number, y: number) => {
  const blob = () => { c.moveTo(x - 80, y + 10); c.bezierCurveTo(x - 86, y - 90, x - 20, y - 108, x + 36, y - 98); c.bezierCurveTo(x + 90, y - 84, x + 92, y + 50, x + 50, y + 100); c.bezierCurveTo(x, y + 118, x - 76, y + 96, x - 80, y + 10); c.closePath(); };
  shape(c, blob, WHITE, 6); shade(c, blob, "#d9d0bd", -22, -18, 0.85);
  shine(c, [[x - 48, y - 40], [x - 28, y - 72], [x + 6, y - 80]], 9);
};
// two spoons (left, right) on a steel thali; each gets its contents drawn in the spoon's own frame
const twoSpoons = (c: Ctx, left: (c: Ctx, x: number, y: number) => void, right: (c: Ctx, x: number, y: number) => void, extras?: () => void) => {
  ground(c); plate(c, 540, 500, 430, 430);
  [[380, left], [700, right]].forEach(([x, fn]) => { c.save(); c.translate(x as number, 307); c.scale(0.92, 0.92); spoonTop(c, 0, 0); (fn as typeof left)(c, 0, 0); c.restore(); });
  extras?.();
};

// setup.e1.0.0
const e1_0 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(510, 470); c.scale(1.1, 1.1); c.translate(-540, -540);
  // steel tumbler of hot water
  const cx = 430, yb = 910, tw = 190, bw = 150, h = 340, rim = yb - h;
  shadow(c, cx + 40, yb + 8, 220, 28);
  const body = () => { c.moveTo(cx - tw, rim); c.lineTo(cx + tw, rim); c.lineTo(cx + bw, yb); c.lineTo(cx - bw, yb); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -50, 0, 0.55); shine(c, [[cx - 150, rim + 40], [cx - 120, yb - 40]], 10);
  shape(c, () => ell(c, cx, rim, tw, 38), COL.steelIn, 6); shape(c, () => ell(c, cx, rim + 4, tw - 20, 28), COL.water, 0);
  // steam rising to the plate
  for (const [sx, d] of [[cx - 110, 1], [cx, -1], [cx + 110, 1]] as [number, number][]) {
    const p = bez([sx, rim - 20], [sx + 50 * d, rim - 70], [sx - 50 * d, rim - 130], [sx, rim - 190], 24);
    line(c, p, 28, INK); line(c, p, 17, WHITE);
  }
  // the plate, held a little above the steam; drops hang under it
  const px = cx, py = 340;
  const dish = () => { c.moveTo(px - 310, py - 50); c.lineTo(px + 310, py - 50); c.quadraticCurveTo(px + 290, py + 45, px + 200, py + 45); c.lineTo(px - 200, py + 45); c.quadraticCurveTo(px - 290, py + 45, px - 310, py - 50); c.closePath(); };
  shape(c, dish, COL.steel); shade(c, dish, COL.steelDk, 0, -18, 0.5);
  shape(c, () => ell(c, px, py - 50, 310, 16), COL.steelIn, 5);
  for (const [dx, s] of [[-170, 15], [-90, 19], [-10, 16], [80, 20], [170, 15]] as [number, number][]) drop(c, px + dx, py + 45 + s * 1.4, s);
  drop(c, px + 20, py + 160, 17); drop(c, px - 120, py + 135, 13);
  // the grown-up's hand holds the plate's edge
  c.save(); c.translate(px + 310 + 110, 0); c.scale(-1, 1); hand(c, 0, py - 8, 0, 1.5, SKIN.adult, CLOTH.adult); c.restore();
  c.restore();
};

// setup.e1.1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  rig(c, { cx: 540, yb: 930, w: 420, h: 420, dx: 90, fill: 0.75, dim: true });
};

// setup.e1.2.2
const e1_2 = (c: Ctx) => {
  ground(c);
  rig(c, { cx: 650, yb: 940, w: 420, h: 420, dx: 85, fill: 0.75, batX: 170, black: 14, red: 5 });
};

// setup.e2.0.0
const e2_0 = (c: Ctx) => {
  twoSpoons(c, sugarHeap, waxShavings, () => { sugarCube(c, 482, 700, 1); candle(c, 598, 770); });
};

// setup.e2.1.1
const e2_1 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(600, 420); c.scale(1.12, 1.12); c.translate(-540, -540);
  // the stove and its burner
  shape(c, () => rrect(c, 330, 890, 900, 400, 18), COL.black, 6);
  shape(c, () => ell(c, 735, 890, 160, 34), COL.steel); shape(c, () => ell(c, 735, 886, 110, 22), COL.black, 4);
  const tongue = (x: number, h: number, w: number, col: string) => shape(c, () => { c.moveTo(x - w, 884); c.bezierCurveTo(x - w, 884 - h * 0.4, x - w * 0.3, 884 - h * 0.62, x, 884 - h); c.bezierCurveTo(x + w * 0.3, 884 - h * 0.62, x + w, 884 - h * 0.4, x + w, 884); c.closePath(); }, col, 5);
  for (const [dx, h] of [[-80, 110], [-40, 150], [40, 150], [80, 110]] as [number, number][]) tongue(735 + dx, h, 26, COL.orange);
  tongue(735, 235, 46, COL.orange); tongue(735, 175, 28, COL.yellow); tongue(735, 85, 22, COL.blue);
  // the spoon: handle wrapped in a cloth, bowl with browning sugar over the flame
  line(c, bez([150, 480], [300, 500], [480, 530], [660, 562], 20), 34, INK); line(c, bez([150, 480], [300, 500], [480, 530], [660, 562], 20), 22, COL.steel);
  shape(c, () => { c.moveTo(618, 556); c.bezierCurveTo(640, 676, 830, 676, 852, 556); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(618, 556); c.bezierCurveTo(640, 676, 830, 676, 852, 556); c.closePath(); }, COL.steelDk, -40, -10, 0.55);
  shape(c, () => ell(c, 735, 556, 117, 30), "#d98a2b", 6); shape(c, () => ell(c, 745, 558, 80, 18), "#8b4a1c", 0);
  for (const [bx, by, br] of [[700, 556, 8], [770, 562, 6], [735, 552, 5], [800, 554, 5]] as number[][]) bubble(c, bx, by, br);
  c.save(); c.translate(340, 511); c.rotate(0.164);
  shape(c, () => rrect(c, -100, -44, 200, 88, 16), COL.cloth, 6);
  c.save(); c.beginPath(); rrect(c, -100, -44, 200, 88, 16); c.clip(); c.strokeStyle = COL.red; c.lineWidth = 6; c.globalAlpha = 0.6;
  for (let i = -90; i < 100; i += 36) { c.beginPath(); c.moveTo(i, -50); c.lineTo(i, 50); c.stroke(); }
  for (let j = -30; j < 50; j += 30) { c.beginPath(); c.moveTo(-110, j); c.lineTo(110, j); c.stroke(); }
  c.restore(); c.restore();
  hand(c, 150, 478, 0.164, 1.5, SKIN.adult, CLOTH.adult);
  c.restore();
};

// setup.e2.2.2
const e2_2 = (c: Ctx) => {
  twoSpoons(c, brownLump, waxLump);
};

// a sugar cube, centre (x, y), s = scale
const sugarCube = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[0, -46], [52, -22], [0, 2], [-52, -22]]), WHITE, 5);
  shape(c, () => polyP(c, [[-52, -22], [0, 2], [0, 58], [-52, 34]]), "#e4dccb", 5);
  shape(c, () => polyP(c, [[52, -22], [0, 2], [0, 58], [52, 34]]), "#cfc6b2", 5);
  for (const [gx, gy] of [[-24, -24], [10, -30], [26, -14], [-6, -12], [-34, -10]]) shape(c, () => ell(c, gx, gy, 3.5, 3.5), "#d9d0bd", 0);
  c.restore();
};
// a candle stub standing on its base (x, y), the wax is scraped off it; no flame
const candle = (c: Ctx, x: number, y: number) => {
  const body = () => rrect(c, x - 42, y - 190, 84, 190, 12);
  shadow(c, x + 14, y + 4, 70, 14);
  shape(c, body, "#fbf2cf"); shade(c, body, "#e0cf94", -26, 0, 0.7);
  shape(c, () => ell(c, x, y - 190, 42, 12), "#f1e3b0", 5);
  line(c, [[x, y - 192], [x + 5, y - 226]], 7, INK);
};
// a paper tag with a picture on it: a drop (plain), a sugar cube, a heap of white powder (soda); s scales the whole tag
const tag = (c: Ctx, x: number, y: number, kind: "drop" | "sugar" | "soda", s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 8, 82, 112, 12); shape(c, () => rrect(c, -105, -70, 210, 140, 16), COL.paper, 5);
  if (kind === "drop") drop(c, 0, 8, 44);
  if (kind === "sugar") sugarCube(c, 0, 0, 1);
  if (kind === "soda") {
    const heap = () => { c.moveTo(-76, 44); c.bezierCurveTo(-64, -12, -24, -48, 0, -48); c.bezierCurveTo(24, -48, 64, -12, 76, 44); c.closePath(); };
    shape(c, heap, WHITE, 5); shade(c, heap, "#d9d0bd", -22, 0, 0.8);
    const r = rnd(8);
    for (let i = 0; i < 26; i++) { const gx = -55 + r() * 110, gy = 36 - r() * 60; if (Math.abs(gx) < 68 - (44 - gy) * 0.55) shape(c, () => ell(c, gx, gy, 2.6, 2.6), "#b9b4ab", 0); }
  }
  c.restore();
};

// setup.e3.0.0
const e3_0 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890], kinds = ["drop", "sugar", "soda"] as const;
  xs.forEach((x) => glass(c, x, 680, 290, 390, 0.7));
  xs.forEach((x, i) => tag(c, x, 845, kinds[i], 1.1));
};

// setup.e3.1.1
const e3_1 = (c: Ctx) => {
  ground(c);
  const g = { yb: 860, w: 300, h: 380, dx: 60, fill: 0.75, batW: 110, batH: 230, over: 30 };
  rig(c, { ...g, cx: 345, batX: 100, black: 12, red: 5 });
  rig(c, { ...g, cx: 745, batX: 980, black: 1, red: 0 });
  tag(c, 345, 985, "soda", 0.72); tag(c, 745, 985, "sugar", 0.72);
};

export const su_chemistryBonds = cards("sci.chemistry.bonds.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1]);
