import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SH, BG, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, bowl, cards } from "./flatKit";

// sci.making-things.houses-and-shelter.L3 · set-up cards. Experiment 1: card strips and split pins. Experiment 2: a teal tray, a steel spoon, a steel bowl, books.
// Experiment 3: blue plastic tiles on a card board, books, a tissue pad.

const CARD = "#d9a566", CARDDK = "#b98146", BRASS = "#e8b84a", BRASSDK = "#b98a22", TILE = "#9fd0ee", TILEDK = "#6fa6cf", TRAY = COL.teal;
const FLOOR = "#e6cf9f";

// ---------------------------------------------------------------- shared pieces
// a card strip from (x1,y1) to (x2,y2), w wide, with a hole at each end
const strip = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number, holes = true, sh = true) => {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  let nx = -dy / len, ny = dx / len; if (ny < 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
  if (sh) line(c, [[x1 + 12, y1 + 16], [x2 + 12, y2 + 16]], w + 9, SH);
  line(c, [[x1, y1], [x2, y2]], w + 9, INK); line(c, [[x1, y1], [x2, y2]], w, CARD);
  line(c, [[x1 + nx * w * 0.34, y1 + ny * w * 0.34], [x2 + nx * w * 0.34, y2 + ny * w * 0.34]], w * 0.28, CARDDK);
  if (holes) for (const [x, y] of [[x1, y1], [x2, y2]]) shape(c, () => ell(c, x, y, w * 0.2, w * 0.2), "#cdbfa6", 4);
};
// a split pin seen from the top: round brass head with a slot
const pin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), BRASS, 5);
  shade(c, () => ell(c, x, y, r, r), BRASSDK, r * 0.4, r * 0.4, 0.6);
  line(c, [[x - r * 0.55, y - r * 0.1], [x + r * 0.55, y - r * 0.1]], 4);
  shine(c, [[x - r * 0.5, y - r * 0.55], [x - r * 0.1, y - r * 0.7]], 5);
};
// a split pin lying on the table: round head, two legs
const pinLying = (c: Ctx, x: number, y: number, r: number) => {
  for (const d of [-0.3, 0.3]) { line(c, [[x + r * 0.5, y + d * r], [x + r * 3.2, y + d * r * 1.6]], r * 0.34 + 8, INK); }
  for (const d of [-0.3, 0.3]) { line(c, [[x + r * 0.5, y + d * r], [x + r * 3.2, y + d * r * 1.6]], r * 0.34, BRASS); }
  pin(c, x, y, r);
};
// a wooden ruler lying along x: 0 at (x0, y), pxCm pixels per cm, n cm
const ruler = (c: Ctx, x0: number, y: number, pxCm: number, n: number, h = 70) => {
  const x1 = x0 + n * pxCm + 30;
  shadow(c, (x0 - 30 + x1) / 2 + 10, y + h + 8, (x1 - x0 + 30) / 2, 12);
  shape(c, () => rrect(c, x0 - 30, y, x1 - x0 + 30, h, 6), COL.wood);
  shade(c, () => rrect(c, x0 - 30, y, x1 - x0 + 30, h, 6), COL.woodDk, 0, h * 0.78, 0.7);
  for (let k = 0; k <= n * 2; k++) line(c, [[x0 + k * pxCm / 2, y], [x0 + k * pxCm / 2, y + (k % 2 ? 14 : 24)]], k % 2 ? 3 : 4);
  for (let k = 0; k <= n; k += 2) write(c, String(k), x0 + k * pxCm - (k > 9 ? 22 : 8), y + 28, 28, INK, 4.5);
};
const stream = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 8, INK); line(c, pts, w, COL.water); line(c, pts.slice(0, -1).map(([x, y]) => [x - w * 0.22, y]), Math.max(2, w * 0.2), COL.drop); };
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y, x, y + s * 0.7); c.quadraticCurveTo(x - s * 1.1, y, x, y - s * 1.5); c.closePath(); }, COL.water, 4);
// a steel spoon held in a hand (from the upper left, pointing down at angle an), its tip at (tx, ty), tipping water down to y1
const spoonPour = (c: Ctx, tx: number, ty: number, an: number, y1: number, s = 1.2, flow = 10) => {
  const rho = an + 0.6, E = [tx - Math.cos(rho) * 50, ty - Math.sin(rho) * 50], hl = 250;
  const H = [E[0] - Math.cos(an) * hl, E[1] - Math.sin(an) * hl];
  line(c, [[H[0] + Math.cos(an) * 60, H[1] + Math.sin(an) * 60], E], 24, INK); line(c, [[H[0] + Math.cos(an) * 60, H[1] + Math.sin(an) * 60], E], 15, COL.steel);
  stream(c, [[tx, ty + 6], [tx, y1]], flow);
  shape(c, () => ell(c, E[0], E[1], 56, 34, rho), COL.steel, 6);
  shape(c, () => ell(c, E[0] + Math.cos(rho) * 3, E[1] + Math.sin(rho) * 3, 40, 22, rho), COL.steelIn, 4);
  hand(c, H[0], H[1], an, s, undefined, undefined, false);
};
const table = (c: Ctx) => {
  c.fillStyle = FLOOR; c.fillRect(0, 1005, 1080, 75); line(c, [[0, 1005], [1080, 1005]], 5);
  for (const x of [70, 560]) shape(c, () => rrect(c, x, 744, 44, 261, 6), COL.woodDk, 6);
  shape(c, () => polyP(c, [[30, 700], [640, 700], [640, 748], [30, 748]]), COL.wood, 6);
  shade(c, () => polyP(c, [[30, 700], [640, 700], [640, 748], [30, 748]]), COL.woodDk, 0, 26, 0.7);
};
const BOOKC = ["#e4523b", COL.blue, COL.green, COL.yellow, COL.purple];
// a stack of books from the table up to topY, w wide, left edge x
const books = (c: Ctx, x: number, w: number, topY: number, T: number) => {
  const n = Math.max(1, Math.round((T - topY) / 52)), hb = (T - topY) / n;
  shadow(c, x + w / 2 + 14, T + 4, w * 0.6, 10);
  for (let i = 0; i < n; i++) {
    const y = T - (i + 1) * hb, col = BOOKC[(i + 2) % BOOKC.length];
    shape(c, () => rrect(c, x + (i % 2) * 8, y, w - (i % 2) * 8, hb, 4), col, 5);
    shade(c, () => rrect(c, x + (i % 2) * 8, y, w - (i % 2) * 8, hb, 4), "#2b2340", 0, hb * 0.7, 0.18);
    line(c, [[x + (i % 2) * 8 + 16, y + 6], [x + (i % 2) * 8 + 16, y + hb - 6]], 3);
    line(c, [[x + w - 16, y + 6], [x + w - 16, y + hb - 6]], 3);
  }
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 1.05, r * 0.9, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.35, r * 0.36, r * 0.4, 4), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], 4); }
  line(c, [[x, y], [x + r * 0.45, y - r * 0.4]], 7, RED); line(c, [[x, y], [x, y - r * 0.55]], 6);
  shape(c, () => ell(c, x, y, r * 0.09, r * 0.09), INK, 0);
};

// ---------------------------------------------------------------- experiment 1: the push test
// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c); c.save(); c.translate(0, 30);
  // three card strips, the top one measured: 2 cm wide, the hole 1 cm from the end
  const X1 = 90, X2 = 790, w = 84;
  for (const y of [330, 490, 650]) strip(c, X1 + 42, y, X2, y, w);
  // 2 cm across the strip
  line(c, [[880, 288], [880, 372]], 6); line(c, [[864, 288], [896, 288]], 6); line(c, [[864, 372], [896, 372]], 6);
  write(c, "2 cm", 915, 312, 40, INK, 6);
  // 1 cm from the end to the hole
  line(c, [[X1, 220], [X1 + 42, 220]], 6); line(c, [[X1, 204], [X1, 236]], 6); line(c, [[X1 + 42, 204], [X1 + 42, 236]], 6);
  write(c, "1 cm", X1 + 80, 200, 40, INK, 6);
  line(c, [[X1 + 42, 240], [X1 + 42, 296]], 5, RED);
  // split pins on the table
  for (const [x, y] of [[170, 850], [480, 880], [770, 850]]) { shadow(c, x + 80, y + 40, 120, 12); pinLying(c, x, y, 42); }
  c.restore();
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c);
  const sq = (x: number, y: number, s: number, diag: boolean) => {
    const P = [[x, y], [x + s, y], [x + s, y + s], [x, y + s]];
    strip(c, P[0][0], P[0][1], P[1][0], P[1][1], 56); strip(c, P[1][0], P[1][1], P[2][0], P[2][1], 56);
    strip(c, P[2][0], P[2][1], P[3][0], P[3][1], 56); strip(c, P[3][0], P[3][1], P[0][0], P[0][1], 56);
    if (diag) strip(c, P[0][0], P[0][1], P[2][0], P[2][1], 56);
    P.forEach(([px, py]) => pin(c, px, py, 22));
  };
  sq(100, 90, 340, false);
  // the triangle: three strips
  const T = [[810, 90], [640, 430], [980, 430]];
  strip(c, T[0][0], T[0][1], T[1][0], T[1][1], 56); strip(c, T[1][0], T[1][1], T[2][0], T[2][1], 56); strip(c, T[2][0], T[2][1], T[0][0], T[0][1], 56);
  T.forEach(([px, py]) => pin(c, px, py, 22));
  sq(370, 620, 340, true);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  const BL = [300, 740], BR = [700, 740], TL = [372, 380], TR = [772, 380], w = 46;
  strip(c, BL[0], BL[1], BR[0], BR[1], w);
  strip(c, BL[0], BL[1], TL[0], TL[1], w); strip(c, BR[0], BR[1], TR[0], TR[1], w);
  strip(c, TL[0], TL[1], TR[0], TR[1], w);
  [BL, BR, TL, TR].forEach(([x, y]) => pin(c, x, y, 18));
  // tape holds the bottom strip to the table
  for (const [x, y] of [BL, BR]) {
    c.save(); c.translate(x, y + 4); c.rotate(x < 500 ? -0.1 : 0.1);
    shape(c, () => rrect(c, -60, -26, 120, 52, 5), "rgba(255,211,77,0.78)", 4);
    line(c, [[-40, -10], [40, -10]], 3, "rgba(255,255,255,0.7)"); c.restore();
  }
  // the ruler measures how far the top strip moved
  ruler(c, 300, 195, 35, 12, 70);
  line(c, [[372, 265], [372, 380]], 6, RED);
  // a hand pushes the top strip sideways
  hand(c, 200, 380, 0, 1.35, undefined, undefined, true);
  arrow(c, [[120, 480], [310, 480]]);
};

// ---------------------------------------------------------------- experiment 2: rain on the roof
const TL_ = 460; // tray length
// world position of a point (lx, ly) in the tray's own frame; the low end's bottom corner is at (640, 700), the tray tilted by th
const trayAt = (th: number, lx: number, ly: number): [number, number] => [640 + lx * Math.cos(th) - ly * Math.sin(th), 700 + lx * Math.sin(th) + ly * Math.cos(th)];
// the tray drawn tilted by th; water: 0 none, 1 puddle (flat), 2 thin film, 3 wide film
const tray = (c: Ctx, th: number, water: number) => {
  const L = TL_;
  c.save(); c.translate(640, 700); c.rotate(th);
  shadow(c, -L / 2 + 14, 6, L / 2, 8);
  shape(c, () => polyP(c, [[-L, -34], [0, -34], [-26, -112], [-L + 26, -112]]), TRAY, 6);
  shape(c, () => polyP(c, [[-L + 16, -40], [-14, -40], [-34, -102], [-L + 36, -102]]), "#d9f1ee", 4);
  if (water === 1) { shape(c, () => ell(c, -L / 2, -70, 130, 22), COL.water, 4); shine(c, [[-L / 2 - 70, -76], [-L / 2 - 10, -80]], 5); }
  if (water >= 2) {
    const hw = water === 2 ? 8 : 14;
    shape(c, () => polyP(c, [[-L / 2 - 20, -70 - hw], [-8, -70 - hw - 3], [8, -70 + hw], [-L / 2 - 20, -70 + hw]]), COL.water, 4);
    line(c, [[-L / 2, -70 - hw * 0.3], [-60, -70 - hw * 0.3]], 3, COL.drop);
  }
  shape(c, () => polyP(c, [[-L, -34], [0, -34], [0, 0], [-L, 0]]), TRAY, 6);
  shade(c, () => polyP(c, [[-L, -34], [0, -34], [0, 0], [-L, 0]]), COL.tealDk, 0, 22, 0.8);
  shine(c, [[-L + 30, -26], [-L + 150, -26]], 6);
  c.restore();
};
const trayScene = (c: Ctx, n: number, bowlWater: number, flow: number, watch: boolean) => {
  ground(c); table(c);
  const th = n ? Math.asin((n * 52) / TL_) : 0;
  if (n) { const [lx, ly] = trayAt(th, -TL_, 0); books(c, lx - 110, 150, ly, 700); }
  tray(c, th, n === 0 ? 1 : n === 1 ? 2 : 3);
  // the bowl on the floor, under the low end
  bowl(c, 800, 950, 95);
  if (bowlWater) { shape(c, () => ell(c, 800, 950, 95 * (0.35 + bowlWater * 0.55), 19 * (0.5 + bowlWater * 0.5)), COL.water, 4); }
  if (n) {
    const [qx, qy] = trayAt(th, -2, -62), pts: number[][] = [];
    for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push([qx + (790 - qx) * t, qy + (948 - qy) * t * t]); }
    stream(c, pts, flow);
    for (const [dx, dy] of [[-30, -16], [26, -6]]) shape(c, () => ell(c, 790 + dx, 940 + dy, 7, 5), COL.drop, 2.5);
  }
  const [px, py] = trayAt(th, -TL_ / 2, -70);
  spoonPour(c, px, py - 105, 1.0, py - 6, 1.2, n === 3 ? 9 : 9);
  if (watch) stopwatch(c, 905, 300, 90);
};
// setup.e2.0
const e2s0 = (c: Ctx) => trayScene(c, 0, 0, 0, false);
// setup.e2.1
const e2s1 = (c: Ctx) => trayScene(c, 1, 0.3, 11, false);
// setup.e2.2
const e2s2 = (c: Ctx) => trayScene(c, 4, 0.8, 24, true);

// ---------------------------------------------------------------- experiment 3: which way the tiles overlap
// a card board with four plastic tiles, in the board's own frame: x runs down the slope from its top end, y up is negative; the board's top face is y = 0
// A: the higher tile lies on top of the one below. B: the lower tile lies on top of the one above.
const roof = (c: Ctx, mode: "A" | "B", step: number, L: number, h: number) => {
  const W = 3 * step + L, r = L / step;
  shape(c, () => polyP(c, [[-12, 0], [W + 12, 0], [W + 12, 20], [-12, 20]]), CARD, 6);
  shade(c, () => polyP(c, [[-12, 0], [W + 12, 0], [W + 12, 20], [-12, 20]]), CARDDK, 0, 13, 0.8);
  // a tile is a straight plate h thick: bottom edge from (xa, ya) to (xb, yb), y up is negative
  const tile = (i: number, xa: number, ya: number, xb: number, yb: number) => {
    const P = [[xa, ya - h], [xb, yb - h], [xb, yb], [xa, ya]];
    shape(c, () => polyP(c, P), i % 2 ? "#b5def2" : TILE, 6);
    shade(c, () => polyP(c, P), TILEDK, 0, h * 0.5, 0.7);
    line(c, [[xa + 10, ya - h + 5], [xb - 10, yb - h + 5]], 3, WHITE);
  };
  if (mode === "A") for (const i of [3, 2, 1, 0]) tile(i, i * step, 0, i * step + L, i === 3 ? 0 : -h * r);
  else { let yb = 0; for (let i = 0; i < 4; i++) { tile(i, i * step, -yb, i * step + L, 0); yb = i === 0 ? h : h + yb * (1 - step / L); } }
  return W;
};
// world position of a board-frame point
const roofAt = (ox: number, oy: number, th: number, lx: number, ly: number): [number, number] => [ox + lx * Math.cos(th) - ly * Math.sin(th), oy + lx * Math.sin(th) + ly * Math.cos(th)];
// the board on its book stacks: left end top at (ox, oy), tilted th, table at y = T
const roofOnBooks = (c: Ctx, mode: "A" | "B", ox: number, oy: number, th: number, T: number, step: number, L: number, t: number, bw: number) => {
  const W = 3 * step + L, [lx, ly] = roofAt(ox, oy, th, 0, 20), [rx, ry] = roofAt(ox, oy, th, W, 20);
  books(c, lx - 10, bw, ly, T); books(c, rx - bw + 10, bw, ry, T);
  c.save(); c.translate(ox, oy); c.rotate(th); roof(c, mode, step, L, t); c.restore();
};
const roofCard = (c: Ctx, mode: "A" | "B") => {
  ground(c);
  const T = 960, th = Math.asin(208 / 790), ox = 130, oy = T - 260 - 20;
  c.fillStyle = FLOOR; c.fillRect(0, T, 1080, 140); line(c, [[0, T], [1080, T]], 5);
  roofOnBooks(c, mode, ox, oy, th, T, 170, 240, 24, 150);
  // a hand presses the overlap of two tiles
  const [hx, hy] = roofAt(ox, oy, th, 340, -100);
  hand(c, hx - 20, hy - 115, Math.PI / 2, 1.5, undefined, undefined, true);
  arrow(c, [[hx + 150, hy - 200], [hx + 150, hy - 80]]);
};
// setup.e3.0
const e3s0 = (c: Ctx) => roofCard(c, "A");
// setup.e3.1
const e3s1 = (c: Ctx) => roofCard(c, "B");
// setup.e3.2
const e3s2 = (c: Ctx) => {
  ground(c);
  const T = 960, step = 100, L = 150, t = 16, bw = 90, th = Math.asin(156 / 450), W = 3 * step + L;
  c.fillStyle = FLOOR; c.fillRect(0, T, 1080, 140); line(c, [[0, T], [1080, T]], 5);
  const roofs: ["A" | "B", number][] = [["A", 60], ["B", 570]];
  for (const [mode, ox] of roofs) {
    const oy = T - 260 - 20;
    // the tissue under the roof
    const x1 = ox + 105, x2 = ox + W - 105, wet = mode === "B";
    shadow(c, (x1 + x2) / 2 + 20, T + 2, (x2 - x1) / 2 + 20, 8);
    shape(c, () => polyP(c, [[x1, T - 14], [x2, T - 14], [x2 + 40, T - 40], [x1 + 40, T - 40]]), wet ? COL.water : WHITE, 5);
    shape(c, () => polyP(c, [[x1, T - 14], [x2, T - 14], [x2, T], [x1, T]]), wet ? COL.waterDk : "#ece6d8", 5);
    if (wet) for (const [bx, bw2] of [[60, 34], [130, 40], [190, 30]]) shape(c, () => ell(c, x1 + bx + 20, T - 27, bw2, 7), COL.waterDk, 3);
    roofOnBooks(c, mode, ox, oy, th, T, step, L, t, bw);
    if (wet) for (const dx of [90, 190, 290]) { const [wx, wy] = roofAt(ox, oy, th, dx, 20); drop(c, wx, wy + 40, 11); drop(c, wx, wy + 110, 11); }
    // the spoon pours at the top of the roof
    const [tx, ty] = roofAt(ox, oy, th, 80, -2 * t);
    spoonPour(c, tx, ty - 90, 1.45, ty - 4, 1.1, 9);
  }
};

export const su_makingThingsHousesAndShelter = cards("sci.making-things.houses-and-shelter.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
