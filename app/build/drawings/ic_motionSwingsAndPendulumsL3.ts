import type { Ctx } from "./core";
import { BG, COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// sci.motion.swings-and-pendulums.L3 · picture cards: summary, experiments, activities, project, challenge, terms, explanations.
// Flat DeepKids look; same child (orange shirt) and grown-up (blue shirt); red arrows = movement; no words.

const PI = Math.PI, FLOOR = 1030, SLAB = 340, BAG = "#dcecf7", BAGDK = "#9fc3df";

// ------------------------------------------------------------------ scenery
const floorBg = (c: Ctx, y = FLOOR) => { ground(c); c.fillStyle = "#e3d4b6"; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const table = (c: Ctx, x0: number, x1: number) => {
  for (const lx of [x0 + 14, x1 - 64]) {
    shadow(c, lx + 40, FLOOR + 12, 52, 9);
    shape(c, () => rrect(c, lx, SLAB + 40, 50, FLOOR - SLAB - 40, 6), COL.brown);
    shade(c, () => rrect(c, lx, SLAB + 40, 50, FLOOR - SLAB - 40, 6), COL.soilDk, -14, 0, 0.5);
  }
  shape(c, () => rrect(c, x0, SLAB, x1 - x0, 58, 10), COL.brown);
  shade(c, () => rrect(c, x0, SLAB, x1 - x0, 58, 10), COL.soilDk, -8, -12, 0.5);
  line(c, [[x0 + 16, SLAB + 12], [x1 - 16, SLAB + 12]], 4, COL.wood);
};
const ruler = (c: Ctx, x0: number, x1: number) => {
  const y = SLAB - 20;
  shape(c, () => rrect(c, x0, y, x1 - x0, 20, 3), COL.wood);
  for (let x = x0 + 12, k = 0; x < x1 - 6; x += 15, k++) line(c, [[x, y], [x, y + (k % 5 === 0 ? 13 : 8)]], 3);
};
const books = (c: Ctx, x0: number, x1: number) => {
  const tones = [COL.purple, COL.teal, COL.orange], dx = [0, 14, 4];
  tones.forEach((col, i) => {
    const y = SLAB - 20 - 50 * (i + 1), a = x0 + dx[i], w = x1 - x0 - dx[i] - (i === 1 ? 10 : 0);
    shape(c, () => rrect(c, a, y, w, 50, 6), col);
    shape(c, () => rrect(c, a + 18, y + 9, w - 24, 32, 3), COL.paper, 3);
    line(c, [[a + 34, y + 20], [a + w - 20, y + 20]], 2, COL.grey); line(c, [[a + 34, y + 30], [a + w - 20, y + 30]], 2, COL.grey);
  });
};
// table with a ruler weighted by three books, pendulums hang from the ruler tip at y = SLAB
const tableSet = (c: Ctx, tx1: number, rx1: number) => { floorBg(c); table(c, 40, tx1); ruler(c, 215, rx1); books(c, 235, tx1 - 10); };
// a beam fixed across the top, pendulums hang from its lower edge at y
const beam = (c: Ctx, x0: number, x1: number, y: number) => {
  shape(c, () => rrect(c, x0, y - 50, x1 - x0, 50, 8), COL.brown);
  shade(c, () => rrect(c, x0, y - 50, x1 - x0, 50, 8), COL.soilDk, -8, -14, 0.5);
  line(c, [[x0 + 18, y - 36], [x1 - 18, y - 36]], 4, COL.wood);
};
// a wooden chair seen from the side: back at x, seat reaching out by dir (-1 left, +1 right)
const chair = (c: Ctx, x: number, top: number, dir: number) => {
  const seatY = FLOOR - 270, sx = x + dir * 160;
  shadow(c, x + dir * 80, FLOOR + 10, 120, 12);
  for (const lx of [x, sx - dir * 22]) shape(c, () => rrect(c, Math.min(lx, lx + dir * 0) - 11, seatY, 22, FLOOR - seatY, 5), COL.brown);
  shape(c, () => rrect(c, Math.min(x, sx) - 11, seatY - 8, Math.abs(sx - x) + 22, 34, 8), COL.wood);
  shape(c, () => rrect(c, x - 11, top, 22, seatY - top, 6), COL.brown);
  shade(c, () => rrect(c, x - 11, top, 22, seatY - top, 6), COL.soilDk, 8, 0, 0.5);
};
// two chairs and a broom lying across their backs
const chairs = (c: Ctx, xl = 190, xr = 890, top = 430, withBroom = true) => {
  floorBg(c); chair(c, xl, top, -1); chair(c, xr, top, 1);
  if (withBroom) {
    shape(c, () => rrect(c, xl - 80, top - 18, xr - xl + 160, 20, 10), COL.wood);
    shape(c, () => polyP(c, [[xl - 80, top - 22], [xl - 150, top - 34], [xl - 150, top + 14], [xl - 80, top + 4]]), COL.woodDk);
  }
};

// ------------------------------------------------------------------ small things
const thread = (c: Ctx, a: number[], b: number[]) => line(c, [a, b], 5);
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 4);
  c.beginPath(); ell(c, x, y, r * 0.6, r * 0.6); c.strokeStyle = COL.woodDk; c.lineWidth = 3; c.stroke();
  shade(c, () => ell(c, x, y, r, r), COL.woodDk, -r * 0.3, -r * 0.3, 0.5);
};
// a clear bag of n coins tied at the top; thread tied at (x, y)
const bag = (c: Ctx, x: number, y: number, r: number, n: number, alpha = 1) => {
  c.save(); c.globalAlpha = alpha;
  const body = () => { c.moveTo(x - r * 0.2, y + r * 0.3); c.bezierCurveTo(x - r * 1.25, y + r * 0.7, x - r * 1.15, y + r * 2.15, x, y + r * 2.15); c.bezierCurveTo(x + r * 1.15, y + r * 2.15, x + r * 1.25, y + r * 0.7, x + r * 0.2, y + r * 0.3); c.closePath(); };
  shape(c, body, BAG, 0);
  shade(c, body, BAGDK, -r * 0.3, -r * 0.1, 0.55);
  const spots = n === 1 ? [[0, 1.7]] : [[-0.5, 1.78], [0.05, 1.86], [0.56, 1.72], [-0.22, 1.4], [0.34, 1.34]];
  spots.forEach(([dx, dy]) => coin(c, x + dx * r, y + dy * r, r * 0.37));
  c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 5; c.lineJoin = "round"; c.stroke();
  shine(c, [[x - r * 0.85, y + r * 0.95], [x - r * 0.75, y + r * 1.5]], 7);
  shape(c, () => polyP(c, [[x - r * 0.2, y + r * 0.3], [x - r * 0.07, y + r * 0.04], [x + r * 0.07, y + r * 0.04], [x + r * 0.2, y + r * 0.3]]), BAG, 4);
  shape(c, () => rrect(c, x - r * 0.27, y + r * 0.2, r * 0.54, r * 0.16, 4), COL.purple, 4);
  c.restore();
};
const bobXY = (px: number, py: number, L: number, a: number) => [px + L * Math.sin(a), py + L * Math.cos(a)];
// a coin pendulum hanging from (px, py) at angle a (radians, + = bob to the right); card = a flat card taped above the coins
const pend = (c: Ctx, px: number, py: number, L: number, a: number, r: number, n = 5, ghost = false, card = false, thr = true) => {
  const [nx, ny] = bobXY(px, py, L, a);
  c.save();
  if (ghost) { c.globalAlpha = 0.3; c.setLineDash([14, 12]); line(c, [[px, py], [nx, ny]], 4, COL.greyDk); c.setLineDash([]); } else if (thr) thread(c, [px, py], [nx, ny]);
  c.translate(nx, ny); c.rotate(-a);
  if (card && !ghost) {
    const f = () => rrect(c, -r * 0.42, -r * 2.8, r * 0.84, r * 2.6, 6);
    shape(c, f, COL.paper, 5); shade(c, f, COL.grey, r * 0.2, 0, 0.5);
  }
  bag(c, 0, 0, r, n, ghost ? 0.3 : 1);
  c.restore();
};
const pivotNail = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 10, 10), COL.steel, 4);
// points on a circle round the pivot, bob angle t0..t1 (for arrows that follow the swing)
const arcSw = (px: number, py: number, R: number, t0: number, t1: number, n = 24) => Array.from({ length: n + 1 }, (_, i) => bobXY(px, py, R, t0 + ((t1 - t0) * i) / n));
const dbl = (c: Ctx, pts: number[][], w = 10) => { arrow(c, pts, RED, w); arrow(c, [...pts].reverse(), RED, w); };
const dash = (c: Ctx, pts: number[][], col: string = COL.greyDk) => { c.setLineDash([14, 12]); line(c, pts, 4, col); c.setLineDash([]); };
const dimV = (c: Ctx, x: number, y0: number, y1: number) => { line(c, [[x, y0], [x, y1]], 5, COL.greyDk); line(c, [[x - 12, y0], [x + 12, y0]], 5, COL.greyDk); line(c, [[x - 12, y1], [x + 12, y1]], 5, COL.greyDk); };
const equals = (c: Ctx, x: number, y: number, w = 60) => { line(c, [[x - w / 2, y - 12], [x + w / 2, y - 12]], 10); line(c, [[x - w / 2, y + 12], [x + w / 2, y + 12]], 10); };
// a phone showing a stopwatch ring and a number, standing on y = b
const phone = (c: Ctx, x: number, b: number, w: number, h: number, txt: string) => {
  shadow(c, x + w / 2 + 14, b + 4, w * 0.7, 9);
  shape(c, () => rrect(c, x - 14, b - 16, w + 28, 16, 5), COL.steel);
  shape(c, () => rrect(c, x, b - 16 - h, w, h, 18), COL.black);
  shape(c, () => rrect(c, x + 9, b - 16 - h + 14, w - 18, h - 28, 10), "#22303a", 3);
  const cx = x + w / 2, cy = b - 16 - h / 2;
  c.beginPath(); c.arc(cx, cy, w * 0.36, 0, PI * 2); c.strokeStyle = "#c9f06b"; c.lineWidth = 6; c.stroke();
  line(c, [[cx, cy - w * 0.36], [cx, cy - w * 0.36 - 12]], 6, "#c9f06b");
  if (txt) { const th = w * 0.3; write(c, txt, cx - (txt.length * 0.8 - 0.2) * th * 0.5, cy - th * 0.5, th, "#c9f06b", 6); }
};
const clockFace = (c: Ctx, x: number, y: number, r: number, deg: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.8, -PI / 2, -PI / 2 + (deg * PI) / 180); c.closePath(); c.fillStyle = "#f6c9c2"; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k * PI) / 6; line(c, [[x + Math.sin(a) * r * 0.86, y - Math.cos(a) * r * 0.86], [x + Math.sin(a) * r * 0.97, y - Math.cos(a) * r * 0.97]], 5); }
  const d = (deg * PI) / 180; line(c, [[x, y], [x + Math.sin(d) * r * 0.75, y - Math.cos(d) * r * 0.75]], 8, RED);
  line(c, [[x, y], [x, y - r * 0.55]], 8);
  shape(c, () => ell(c, x, y, 9, 9), INK, 0);
};
const chain = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 26)), an = Math.atan2(y1 - y0, x1 - x0);
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n, y = y0 + ((y1 - y0) * i) / n; c.save(); c.translate(x, y); c.rotate(an + (i % 2 ? PI / 2 : 0)); c.beginPath(); ell(c, 0, 0, 17, i % 2 ? 7 : 11); c.strokeStyle = INK; c.lineWidth = 11; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 5; c.stroke(); c.restore(); }
};

// ------------------------------------------------------------------ people
type Arm = [number, number] | { to: number[] };
type FigOpt = { adult?: boolean; legL?: number[]; legR?: number[]; armL?: Arm; armR?: Arm };
// the set-up-card child or grown-up, facing us, hips at (x, hip); legs and arms by joints or hands to a point
const fig = (c: Ctx, x: number, hip: number, h: number, o: FigOpt = {}) => {
  const ad = !!o.adult, skin = ad ? SKIN.adult : SKIN.child, cloth = ad ? CLOTH.adult : CLOTH.child, clothDk = ad ? CLOTH.adultDk : CLOTH.childDk;
  const head = h * 0.13, sh = hip - h * 0.32, uw = h * 0.06;
  const leg = (sx: number, p: number[]) => {
    const s = [x + sx * h * 0.05, hip], k = [s[0] + p[0] * h, hip + p[1] * h], f = [s[0] + p[2] * h, hip + p[3] * h];
    line(c, [s, k, f], h * 0.075, INK); line(c, [s, k, f], h * 0.075 - 10, "#6b5a8c");
    shape(c, () => ell(c, f[0] + sx * h * 0.025, f[1] + h * 0.01, h * 0.055, h * 0.032), INK, 0);
  };
  leg(-1, o.legL ?? [-0.01, 0.21, -0.01, 0.42]); leg(1, o.legR ?? [0.01, 0.21, 0.01, 0.42]);
  shape(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), cloth);
  shade(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), clothDk, h * 0.07, 0);
  const arm = (sx: number, a: Arm) => {
    const S = [x + sx * h * 0.11, sh + h * 0.03], l1 = h * 0.17, l2 = h * 0.16;
    let E: number[], W: number[];
    if (Array.isArray(a)) { E = [S[0] + Math.cos(a[0]) * l1, S[1] + Math.sin(a[0]) * l1]; W = [E[0] + Math.cos(a[1]) * l2, E[1] + Math.sin(a[1]) * l2]; }
    else {
      const dx = a.to[0] - S[0], dy = a.to[1] - S[1], D = Math.hypot(dx, dy), d = Math.min(D, l1 + l2 - 2), base = Math.atan2(dy, dx);
      const q = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
      const e1 = [S[0] + Math.cos(base + q) * l1, S[1] + Math.sin(base + q) * l1], e2 = [S[0] + Math.cos(base - q) * l1, S[1] + Math.sin(base - q) * l1];
      E = e1[1] > e2[1] ? e1 : e2; W = [S[0] + (dx / D) * d, S[1] + (dy / D) * d];
    }
    line(c, [S, E, W], uw + 10, INK); line(c, [S, E, W], uw, cloth);
    shape(c, () => ell(c, W[0], W[1], uw * 0.62, uw * 0.62), skin, 5);
  };
  arm(-1, o.armL ?? [PI * 0.55, PI * 0.5]); arm(1, o.armR ?? [PI * 0.45, PI * 0.5]);
  const hy = sh - head * 1.05;
  shape(c, () => ell(c, x, hy, head, head * 1.05), skin);
  shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  if (!ad) shape(c, () => ell(c, x + head * 0.95, hy - head * 0.2, head * 0.32, head * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, x - head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0); shape(c, () => ell(c, x + head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0);
  c.beginPath(); c.arc(x, hy + head * 0.38, head * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};

// a playground swing hanging from a hook at (px, py): two chains to a seat; the child sits on it when kid > 0 (their height)
const swing = (c: Ctx, px: number, py: number, L: number, a: number, kid = 0, ghost = false) => {
  c.save(); c.globalAlpha = ghost ? 0.3 : 1; c.translate(px, py); c.rotate(-a);
  const hw = 110;
  if (!kid) { chain(c, 0, 0, -hw, L); chain(c, 0, 0, hw, L); }
  shape(c, () => rrect(c, -hw - 26, L - 4, hw * 2 + 52, 26, 8), COL.wood);
  if (kid) {
    const k = kid, hip = L - 6, ya = hip - k * 0.32 + k * 0.03;
    chain(c, 0, 0, -hw, L); chain(c, 0, 0, hw, L);
    fig(c, 0, hip, k, { legL: [-0.07, 0.2, -0.1, 0.4], legR: [0.07, 0.2, 0.1, 0.4], armL: { to: [-hw * (ya / L) - 4, ya - 70] }, armR: { to: [hw * (ya / L) + 4, ya - 70] } });
  }
  c.restore();
};
// the swing frame seen from the front
const swingFrame = (c: Ctx, x0: number, x1: number, y: number, floor: number) => {
  for (const [a, b] of [[x0 + 30, x0 - 70], [x1 - 30, x1 + 70]]) { line(c, [[a, y], [b, floor]], 38, INK); line(c, [[a, y], [b, floor]], 26, COL.blue); }
  shape(c, () => rrect(c, x0, y - 30, x1 - x0, 44, 14), COL.blue);
  shade(c, () => rrect(c, x0, y - 30, x1 - x0, 44, 14), COL.blueDk, -6, -14, 0.5);
};

// ------------------------------------------------------------------ cards
// summary: a swing with a child and a coin pendulum, both swinging from the same bar
const card_summary = (c: Ctx) => {
  floorBg(c, 960); swingFrame(c, 130, 950, 170, 960);
  swing(c, 400, 200, 470, -0.38, 360); swing(c, 400, 200, 470, 0.0, 0, true);
  pend(c, 740, 200, 470, 0.38, 62); pend(c, 740, 200, 470, 0, 62, 5, true);
  arrow(c, arcSw(400, 200, 690, -0.5, -0.12), RED, 12); arrow(c, arcSw(740, 200, 640, 0.5, 0.12), RED, 12);
};
// flow.e1: two coin pendulums pulled out the same way, a stopwatch counting 10
const card_e1 = (c: Ctx) => {
  floorBg(c); table(c, 40, 400); ruler(c, 215, 1030); books(c, 235, 390); phone(c, 70, SLAB, 120, 220, "10");
  for (const [x, n] of [[500, 5], [840, 1]] as [number, number][]) { pend(c, x, SLAB, 400, 0.22, 80, n); pend(c, x, SLAB, 400, 0, 80, n, true); arrow(c, arcSw(x, SLAB, 650, 0.24, 0.02), RED, 11); }
};
// flow.e2: a short pendulum, 25 cm, one swing a second
const card_e2 = (c: Ctx) => {
  floorBg(c); table(c, 40, 400); ruler(c, 205, 940); books(c, 225, 390); phone(c, 70, SLAB, 120, 220, "1");
  const x = 640; pend(c, x, SLAB, 220, 0.5, 85); pend(c, x, SLAB, 220, -0.5, 85, 5, true); pend(c, x, SLAB, 220, 0, 85, 5, true);
  dbl(c, arcSw(x, SLAB, 500, -0.5, 0.5), 11);
  dimV(c, x + 245, SLAB, SLAB + 220); write(c, "25 cm", x + 270, SLAB + 80, 34, COL.greyDk, 5);
};
// flow.e3: a plain pendulum still swinging wide, one with a card already dying down
const card_e3 = (c: Ctx) => {
  floorBg(c); table(c, 40, 400); ruler(c, 215, 1030); books(c, 235, 390); phone(c, 70, SLAB, 120, 220, "10");
  pend(c, 600, SLAB, 400, 0.4, 80); pend(c, 600, SLAB, 400, 0, 80, 5, true);
  dbl(c, arcSw(600, SLAB, 660, -0.4, 0.4), 11);
  const x = 900; pend(c, x, SLAB, 400, 0.1, 80, 5, false, true);
  for (const y of [560, 610, 660]) arrow(c, [[x - 220, y], [x - 120, y]], COL.waterDk, 8);
  dbl(c, arcSw(x, SLAB, 660, -0.1, 0.1), 9);
};
// flow.a1: a hand holding a bunch of keys that swing
const key = (c: Ctx, x: number, y: number, len: number, col: string, dk: string) => {
  shape(c, () => rrect(c, x - 11, y, 22, len, 8), col, 5);
  shape(c, () => rrect(c, x + 8, y + len - 44, 20, 12, 3), col, 4); shape(c, () => rrect(c, x + 8, y + len - 22, 28, 12, 3), col, 4);
  shape(c, () => ell(c, x, y + 4, 28, 30), col, 5); shape(c, () => ell(c, x, y + 4, 11, 12), BG, 4);
  shade(c, () => ell(c, x, y + 4, 28, 30), dk, 8, 8, 0.5);
};
const keysHang = (c: Ctx, px: number, py: number, a: number, ghost = false) => {
  c.save(); c.globalAlpha = ghost ? 0.3 : 1; c.translate(px, py); c.rotate(-a);
  key(c, -34, 40, 230, COL.steel, COL.steelDk); key(c, 34, 40, 260, COL.yellow, COL.woodDk); key(c, 0, 60, 290, COL.steelDk, COL.grey);
  shape(c, () => ell(c, 0, 20, 52, 32), "rgba(0,0,0,0)", 8);
  c.restore();
};
const card_a1 = (c: Ctx) => {
  ground(c);
  const wx = 150, wy = 140, an = 0.55, s = 1.55, px = wx + 70 * s * Math.cos(an), py = wy + 70 * s * Math.sin(an);
  keysHang(c, px, py, 0.62); keysHang(c, px, py, 0, true);
  hand(c, wx, wy, an, s, SKIN.child, CLOTH.child, false);
  dbl(c, arcSw(px, py, 400, -0.15, 0.78), 12);
};
// flow.a2: a hand moving a tiny bit, the bag swinging wide
const card_a2 = (c: Ctx) => {
  ground(c);
  const wx = 130, wy = 120, an = 0.3, s = 1.5, px = wx + 70 * s * Math.cos(an), py = wy + 70 * s * Math.sin(an);
  pend(c, px, py, 560, 0.55, 80); pend(c, px, py, 560, 0, 80, 5, true);
  hand(c, wx, wy, an, s, SKIN.child, CLOTH.child, false);
  dbl(c, [[px - 60, py - 110], [px + 60, py - 110]], 9);
  dbl(c, arcSw(px, py, 770, -0.1, 0.62), 11);
};
// flow.a3: two pendulums on one sagging string between two chairs
const card_a3 = (c: Ctx) => {
  chairs(c, 190, 890, 430, false);
  const sag = (x: number) => 430 + 44 * Math.sin(((x - 190) / 700) * PI);
  line(c, Array.from({ length: 29 }, (_, i) => [190 + (i * 700) / 28, sag(190 + (i * 700) / 28)]), 5);
  for (const [x, a] of [[400, -0.28], [680, 0.28]] as [number, number][]) { pend(c, x, sag(x), 360, a, 66); pend(c, x, sag(x), 360, 0, 66, 5, true); }
  dbl(c, arcSw(400, sag(400), 520, -0.2, 0.2), 9); dbl(c, arcSw(680, sag(680), 520, -0.2, 0.2), 9);
  arrow(c, [[430, 370], [540, 345], [650, 370]], RED, 12);
};
// flow.a4: standing on one foot, the other leg swinging to and fro
const card_a4 = (c: Ctx) => {
  floorBg(c);
  // wall on the left
  c.fillStyle = "#e8b9a0"; c.fillRect(0, 0, 240, FLOOR); line(c, [[240, 0], [240, FLOOR]], 6);
  for (let y = 60; y < FLOOR; y += 90) line(c, [[0, y], [240, y]], 3, "#cf9a80");
  const x = 560, h = 640, hip = FLOOR - 0.42 * h;
  shadow(c, x, FLOOR + 10, 150, 14);
  fig(c, x, hip, h, { legL: [-0.01, 0.21, -0.01, 0.42], legR: [0.22, 0.16, 0.34, 0.33], armL: { to: [236, hip - h * 0.3] }, armR: [0.5, 1.4] });
  dbl(c, arcSw(x + 0.05 * h, hip, 0.5 * h, -0.9, 0.9).map(([px, py]) => [px, py]), 11);
};
// flow.a5: a cone of salt swinging over dark paper and drawing a pattern
const card_a5 = (c: Ctx) => {
  chairs(c, 190, 890, 430);
  shape(c, () => polyP(c, [[250, 940], [830, 940], [900, 1010], [180, 1010]]), "#2e2a45", 5);
  // the salt pattern
  c.save(); c.strokeStyle = WHITE; c.lineWidth = 6; c.lineCap = "round"; c.beginPath();
  for (let i = 0; i <= 160; i++) { const t = (i / 160) * PI * 2; const x = 540 + Math.sin(t * 2 + 0.6) * 250, y = 975 + Math.sin(t * 3) * 22; i ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.stroke(); c.restore();
  const px = 540, py = 430, a = 0.1;
  c.save(); c.translate(px, py); c.rotate(-a);
  thread(c, [0, 0], [0, 180]);
  for (const x of [-60, 0, 60]) thread(c, [0, 180], [x, 285]);
  const cone = () => polyP(c, [[-66, 285], [66, 285], [0, 480]]);
  shape(c, cone, COL.paper, 6); shade(c, cone, COL.grey, 20, 0, 0.6);
  shape(c, () => ell(c, 0, 285, 66, 14), "#fffdf5", 5);
  for (let i = 0; i < 9; i++) shape(c, () => ell(c, -34 + (i % 3) * 30 + (i >> 1), 295 + (i % 2) * 7, 8, 5), WHITE, 0);
  c.restore();
};
// flow.p1: five pendulums of shrinking length, bobs along a snake
const card_p1 = (c: Ctx) => {
  chairs(c, 190, 890, 430);
  const Ls = [350, 297, 256, 225, 198], xs = [300, 420, 540, 660, 780], pts: number[][] = [];
  Ls.forEach((L, i) => {
    const a = 0.2 * Math.sin(i * 1.15 + 0.4), x = xs[i], [nx, ny] = bobXY(x, 430, L, a);
    thread(c, [x - 24, 430], [nx, ny + 10]); thread(c, [x + 24, 430], [nx, ny + 10]);
    pend(c, x, 430, L, a, 44, 3, false, false, false); pts.push([nx, ny + 70]);
  });
  c.setLineDash([12, 12]); line(c, pts, 5, RED); c.setLineDash([]);
};
// flow.c1: a long thin pendulum, a heavy small bob, swings dying down very slowly
const card_c1 = (c: Ctx) => {
  floorBg(c); table(c, 40, 400); ruler(c, 215, 840); books(c, 235, 390); phone(c, 70, SLAB, 120, 220, "");
  pend(c, 620, SLAB, 400, 0.35, 62); pend(c, 620, SLAB, 400, 0, 62, 5, true);
  dbl(c, arcSw(620, SLAB, 560, -0.35, 0.35), 11); dbl(c, arcSw(620, SLAB, 615, -0.3, 0.3), 9); dbl(c, arcSw(620, SLAB, 665, -0.25, 0.25), 8);
};

// terms
const card_t0 = (c: Ctx) => {
  ground(c); beam(c, 120, 960, 170); pivotNail(c, 540, 170);
  pend(c, 540, 170, 520, 0.4, 70); pend(c, 540, 170, 520, -0.4, 70, 5, true);
  dbl(c, arcSw(540, 170, 790, -0.4, 0.4), 12);
};
const card_t1 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 60, 110, 960, 80, 18), COL.blue); shade(c, () => rrect(c, 60, 110, 960, 80, 18), COL.blueDk, -6, -14, 0.5);
  for (const x of [330, 750]) {
    shape(c, () => ell(c, x, 220, 26, 34), COL.steel, 6);
    chain(c, x, 230, x, 730);
    c.beginPath(); ell(c, x, 215, 78, 78); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
  }
  shape(c, () => rrect(c, 210, 740, 660, 60, 14), COL.wood); line(c, [[240, 758], [840, 758]], 4, COL.woodDk);
  shade(c, () => rrect(c, 210, 740, 660, 60, 14), COL.woodDk, -10, -14, 0.5);
};
const card_t2 = (c: Ctx) => {
  ground(c); shape(c, () => rrect(c, 240, 70, 600, 44, 8), COL.wood); line(c, [[270, 92], [810, 92]], 3);
  thread(c, [540, 114], [540, 310]); bag(c, 540, 310, 230, 5);
};
const card_t3 = (c: Ctx) => {
  ground(c);
  const px = [170, 540, 910], aa = [-0.2, 0.2, -0.2];
  px.forEach((x, i) => {
    shape(c, () => rrect(c, x - 150, 160, 300, 780, 26), "#fbf4e4", 5);
    beam(c, x - 100, x + 100, 240); pivotNail(c, x, 240);
    if (i > 0) pend(c, x, 240, 400, -aa[i], 48, 5, true);
    pend(c, x, 240, 400, aa[i], 48);
  });
  arrow(c, [[335, 600], [380, 600]], RED, 12); arrow(c, [[705, 600], [750, 600]], RED, 12);
  arrow(c, arcSw(540, 240, 540, 0.2, -0.1), RED, 10);
};
const card_t4 = (c: Ctx) => {
  floorBg(c, 960); swingFrame(c, 110, 970, 170, 960);
  swing(c, 540, 200, 520, -0.5); swing(c, 540, 200, 520, 0.5);
  dbl(c, arcSw(540, 200, 700, -0.55, 0.55), 12);
};
const card_t5 = (c: Ctx) => {
  floorBg(c, 960); beam(c, 120, 960, 170); pivotNail(c, 540, 170);
  pend(c, 540, 170, 480, 0.42, 74); pend(c, 540, 170, 480, 0, 74, 5, true);
  const [bx, by] = bobXY(540, 170, 480 + 74 * 1.1, 0.42);
  arrow(c, [[bx, by + 20], [bx, 900]], RED, 16);
};
const card_t6 = (c: Ctx) => {
  ground(c); beam(c, 100, 980, 150);
  for (const [x, card] of [[300, false], [760, true]] as [number, boolean][]) {
    pivotNail(c, x, 150); pend(c, x, 150, 440, 0.12, 75, 5, false, card);
    arrow(c, [[x + 160, 840], [x + 20, 840]], RED, 11);
  }
  // air flowing round the card
  const bx = bobXY(760, 150, 440 - 130, 0.12);
  for (const k of [-110, -55, 55, 110]) { const y = bx[1] + k * 1.1; line(c, [[bx[0] - 270, y], [bx[0] - 120, y], [bx[0] - 55, y + k * 0.35]], 7, COL.waterDk); }
  arrow(c, [[bx[0] - 270, bx[1]], [bx[0] - 70, bx[1]]], COL.waterDk, 8);
};
const card_t7 = (c: Ctx) => {
  ground(c);
  // a ring of the swing round the bar
  c.beginPath(); ell(c, 540, 420, 100, 200); c.strokeStyle = INK; c.lineWidth = 36; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 22; c.stroke();
  shape(c, () => ell(c, 540, 330, 78, 78), COL.steel, 6); shade(c, () => ell(c, 540, 330, 78, 78), COL.steelDk, 24, 16, 0.6);
  chain(c, 540, 625, 540, 800);
  shape(c, () => rrect(c, 380, 810, 320, 50, 12), COL.wood);
  const heat = (x: number, y: number) => { const p: number[][] = []; for (let i = 0; i <= 12; i++) p.push([x + Math.sin(i * 1.3) * 14, y - i * 8]); line(c, p, 8, COL.red); };
  heat(350, 440); heat(420, 470); heat(660, 470); heat(730, 440);
  dbl(c, [[455, 515], [455, 570]], 8); dbl(c, [[625, 515], [625, 570]], 8);
};
const card_t8 = (c: Ctx) => {
  floorBg(c, 980); swingFrame(c, 330, 1030, 130, 980);
  const px = 700, py = 160, L = 560, a = -0.5, k = 380;
  swing(c, px, py, L, a, k);
  const adx = 150, h = 560; fig(c, adx, 980 - 0.42 * h, h, { adult: true, armR: { to: [bobXY(px, py, L, a)[0] - 100, bobXY(px, py, L, a)[1] - 40] }, armL: [PI * 0.55, PI * 0.5] });
  arrow(c, [[250, 470], [350, 500]], RED, 14);
};
const card_t9 = (c: Ctx) => {
  floorBg(c); table(c, 40, 400); ruler(c, 215, 1000); books(c, 235, 390);
  for (const [x, n] of [[560, 5], [860, 1]] as [number, number][]) { thread(c, [x, SLAB], [x, SLAB + 400]); bag(c, x, SLAB + 400, 85, n); dimV(c, x + 90, SLAB, SLAB + 400); }
  dash(c, [[500, SLAB + 400], [920, SLAB + 400]]);
  equals(c, 710, 540);
};

// explanations
const card_x0 = (c: Ctx) => {
  ground(c); beam(c, 60, 1020, 130);
  pivotNail(c, 290, 130); pivotNail(c, 760, 130);
  thread(c, [290, 130], [290, 600]); bag(c, 290, 600, 85, 5);
  swing(c, 760, 130, 600, 0);
  // markers: red = pivot, green = string, blue = bob
  const mark = (x: number) => { c.beginPath(); ell(c, x, 130, 40, 40); c.strokeStyle = RED; c.lineWidth = 11; c.stroke(); };
  mark(290); mark(760);
  c.save(); c.globalAlpha = 0.8; line(c, [[290, 170], [290, 590]], 16, COL.green); line(c, [[760, 170], [650, 710]], 16, COL.green); line(c, [[760, 170], [870, 710]], 16, COL.green); c.restore();
  c.beginPath(); ell(c, 290, 760, 125, 130); c.strokeStyle = COL.blue; c.lineWidth = 12; c.stroke();
  c.beginPath(); ell(c, 760, 725, 170, 55); c.strokeStyle = COL.blue; c.lineWidth = 12; c.stroke();
};
const card_x1 = (c: Ctx) => {
  ground(c); beam(c, 120, 960, 150); pivotNail(c, 540, 150);
  const L = 560, A = [-0.62, -0.31, 0, 0.31, 0.62];
  A.forEach((a, i) => pend(c, 540, 150, L, a, 50, 5, i === 0 || i === 4));
  const len: Record<number, number> = { 1: 120, 2: 260, 3: 120 };
  A.forEach((a, i) => {
    if (!len[i]) return;
    const [x, y] = bobXY(540, 150, L + 190, a), tx = Math.cos(a), ty = -Math.sin(a), s = i === 2 ? 1 : 1;
    arrow(c, [[x - (tx * len[i]) / 2 * s, y - (ty * len[i]) / 2], [x + (tx * len[i]) / 2, y + (ty * len[i]) / 2]], RED, 14);
  });
};
const card_x2 = (c: Ctx) => {
  ground(c); beam(c, 60, 1020, 140);
  const defs: [number, number, number, number][] = [[260, 520, 60, 1], [540, 230, 60, 3], [820, 520, 92, 1]];
  defs.forEach(([x, L, r, n]) => {
    pivotNail(c, x, 140); pend(c, x, 140, L, 0.2, r); pend(c, x, 140, L, -0.2, r, 5, true);
    for (let k = 0; k < n; k++) dbl(c, arcSw(x, 140, L + 2.6 * r + k * 55, -0.2, 0.2, 14), 9);
  });
  equals(c, 540, 930, 70);
};
const card_x3 = (c: Ctx) => {
  ground(c); beam(c, 60, 1020, 120);
  pivotNail(c, 240, 120); pend(c, 240, 120, 440, 0.09, 55); pend(c, 240, 120, 440, -0.09, 55, 5, true);
  pivotNail(c, 800, 120); pend(c, 800, 120, 440, -1.25, 55); pend(c, 800, 120, 440, 0, 55, 5, true);
  arrow(c, arcSw(800, 120, 560, -1.05, -0.45), RED, 12);
  clockFace(c, 240, 830, 110, 90); clockFace(c, 800, 830, 110, 108);
};
const card_x4 = (c: Ctx) => {
  ground(c); beam(c, 120, 960, 150); pivotNail(c, 540, 150);
  pend(c, 540, 150, 460, 0.5, 70, 5, false, true); pend(c, 540, 150, 460, 0, 70, 5, true);
  const bx = bobXY(540, 150, 460 - 130, 0.5);
  for (const k of [-90, -40, 40, 90]) { const y = bx[1] + k; line(c, [[bx[0] - 250, y], [bx[0] - 110, y], [bx[0] - 52, y + k * 0.3]], 7, COL.waterDk); }
  dbl(c, arcSw(540, 150, 730, -0.55, 0.55, 20), 11); dbl(c, arcSw(540, 150, 800, -0.35, 0.35, 16), 10); dbl(c, arcSw(540, 150, 870, -0.16, 0.16, 10), 9);
};
const card_x5 = (c: Ctx) => {
  floorBg(c, 980); swingFrame(c, 330, 1030, 130, 980);
  const px = 700, py = 160, L = 560, a = -0.5;
  swing(c, px, py, L, a, 380);
  const h = 560, [sx, sy] = bobXY(px, py, L, a); fig(c, 150, 980 - 0.42 * h, h, { adult: true, armR: { to: [sx - 100, sy - 40] } });
  arrow(c, [[250, 470], [350, 500]], RED, 14);
  for (const [t, d] of [[0.2, 690], [0.35, 740], [0.5, 790]] as [number, number][]) { c.setLineDash([14, 14]); line(c, arcSw(px, py, d - 80, -t, t, 20), 5, COL.greyDk); c.setLineDash([]); }
};

export const ic_motionSwingsAndPendulumsL3 = cards("sci.motion.swings-and-pendulums.L3 cards", [
  card_summary, card_e1, card_e2, card_e3, card_a1, card_a2, card_a3, card_a4, card_a5, card_p1, card_c1,
  card_t0, card_t1, card_t2, card_t3, card_t4, card_t5, card_t6, card_t7, card_t8, card_t9,
  card_x0, card_x1, card_x2, card_x3, card_x4, card_x5,
]);
