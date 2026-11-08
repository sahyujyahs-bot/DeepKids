import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, leaf, person, cards } from "./flatKit";

// WHERE DOES THE LOG GO? · set-up cards for the Breathing Soil (e1) and Cut It Up (e2) tests, then the
// card pictures: one per experiment, activity and project, and three things a child can see
// (a branch with fungus threads, an earthworm pulling a leaf, a vulture and a crow).

const CAR = "#f0802e", CARDK = "#c9601a", CARCUT = "#ffb36b", TERRA = "#d9865a", TERRADK = "#b3663f";
const COUNTER = "#e3d3b6", WOODSH = "#d9a85c", WOODSHDK = "#b8853d", MILK = "#f6f5ee", CLOUDY = "#e3ebee", CLEAR = "#cfe6f5";
const MARI = "#ff9f1c", MARIDK = "#d97a0c", DRYM = "#c48a3a", DRYMDK = "#9a6526";

// ---------------------------------------------------------------- letters A, B, C and labels
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.13, 0.64], [0.47, 0.64]]],
  B: [[[0.02, 1], [0.02, 0], [0.38, 0], [0.55, 0.12], [0.55, 0.36], [0.38, 0.48], [0.02, 0.48]], [[0.38, 0.48], [0.58, 0.62], [0.58, 0.86], [0.4, 1], [0.02, 1]]],
  C: [[[0.58, 0.16], [0.4, 0], [0.16, 0.04], [0.02, 0.3], [0.02, 0.7], [0.16, 0.96], [0.4, 1], [0.58, 0.84]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a white paper label with one big letter, centred at (x, y)
const tag = (c: Ctx, x: number, y: number, ch: string, s = 1) => {
  shadow(c, x + 6 * s, y + 8 * s, 44 * s, 40 * s);
  shape(c, () => rrect(c, x - 42 * s, y - 42 * s, 84 * s, 84 * s, 10 * s), WHITE, 5);
  letter(c, ch, x - 18 * s, y - 30 * s, 60 * s, INK, 7 * s);
};

// ---------------------------------------------------------------- places
const counter = (c: Ctx, y = 760) => { ground(c); c.fillStyle = COUNTER; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
// a wooden plank on a wall, top edge at y, from x0 to x1, with two brackets
const shelf = (c: Ctx, y: number, x0: number, x1: number) => {
  for (const bx of [x0 + (x1 - x0) * 0.18, x1 - (x1 - x0) * 0.18]) shape(c, () => polyP(c, [[bx - 22, y + 34], [bx + 22, y + 34], [bx + 22, y + 120], [bx - 22, y + 120]]), WOODSHDK, 5);
  shape(c, () => rrect(c, x0, y, x1 - x0, 34, 6), WOODSH, 6);
  c.fillStyle = WOODSHDK; c.fillRect(x0 + 4, y + 22, x1 - x0 - 8, 9);
};
const sunWindow = (c: Ctx) => {
  // a window behind: frame, sky panes, the sun top left
  shape(c, () => rrect(c, 90, 60, 900, 720, 14), WOODSH, 6);
  for (const [px, py] of [[130, 100], [560, 100], [130, 440], [560, 440]]) shape(c, () => c.rect(px, py, 390, 300), COL.sky, 5);
  shape(c, () => ell(c, 290, 230, 85, 85), COL.yellow, 5);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[290 + Math.cos(a) * 110, 230 + Math.sin(a) * 110], [290 + Math.cos(a) * 140, 230 + Math.sin(a) * 140]], 6, COL.yellow); }
};

// ---------------------------------------------------------------- jars, lids, katoris
type JarOpt = { soil?: boolean; katori?: string; lid?: boolean; bubbles?: boolean };
// a glass jar, bottom centre (x, y), width w, body height h; soil with chopped peel inside, a katori standing on the soil
const jar = (c: Ctx, x: number, y: number, w: number, h: number, o: JarOpt = {}) => {
  const bx = x - w / 2, by = y - h, body = () => rrect(c, bx, by, w, h, w * 0.1), sy = y - h * 0.36;
  shadow(c, x + w * 0.1, y + 8, w * 0.58, w * 0.1);
  c.save(); c.beginPath(); body(); c.clip();
  if (o.soil) {
    shape(c, () => c.rect(bx, sy, w, h), COL.soil, 0);
    shape(c, () => { c.moveTo(bx, sy + 8); c.quadraticCurveTo(x - w * 0.25, sy - 12, x, sy + 4); c.quadraticCurveTo(x + w * 0.3, sy + 14, bx + w, sy); c.lineTo(bx + w, y); c.lineTo(bx, y); c.closePath(); }, COL.soilDk, 0);
    shape(c, () => { c.moveTo(bx, sy + 8); c.quadraticCurveTo(x - w * 0.25, sy - 12, x, sy + 4); c.quadraticCurveTo(x + w * 0.3, sy + 14, bx + w, sy); c.lineTo(bx + w, sy + 42); c.quadraticCurveTo(x, sy + 60, bx, sy + 46); c.closePath(); }, COL.soil, 0);
    const r = rnd(3);
    for (let i = 0; i < 16; i++) shape(c, () => ell(c, bx + r() * w, sy + 50 + r() * (h * 0.3), w * 0.03, w * 0.018), COL.soilDk, 0);
    for (let i = 0; i < 6; i++) shape(c, () => rrect(c, bx + w * 0.1 + i * w * 0.14, sy - 10 + (i % 2) * 10, w * 0.09, w * 0.045, 4), i % 2 ? CAR : COL.yellow, 3);
    line(c, [[bx, sy + 8], [x, sy + 4], [bx + w, sy]], 4);
  }
  if (o.bubbles) { const r = rnd(11); for (let i = 0; i < 9; i++) { const px = bx + w * 0.1 + r() * w * 0.8, py = sy - 20 - r() * (h * 0.45), rr = 7 + r() * 9; shape(c, () => ell(c, px, py, rr, rr), "rgba(255,255,255,0.8)", 3); } }
  c.restore();
  if (o.katori) { const r = w * 0.27; bowl(c, x, sy - r * 0.56, r, o.katori); }
  shape(c, body, COL.glass, 6);
  shine(c, [[bx + w * 0.13, by + h * 0.12], [bx + w * 0.13, by + h * 0.5]], 8);
  if (o.lid) { const lid = () => rrect(c, bx - 6, by - w * 0.12, w + 12, w * 0.15, 8); shape(c, lid, COL.steel); shade(c, lid, COL.steelDk, 0, w * 0.07, 0.5); shine(c, [[bx + w * 0.1, by - w * 0.07], [bx + w * 0.4, by - w * 0.07]], 6); }
};
// a lid lying flat on the counter, centre (x, y)
const lidFlat = (c: Ctx, x: number, y: number, w: number) => { shadow(c, x + 8, y + 8, w * 0.55, w * 0.14); shape(c, () => ell(c, x, y, w * 0.55, w * 0.14), COL.steel); shape(c, () => ell(c, x, y - 3, w * 0.42, w * 0.1), COL.steelDk, 4); };

// ---------------------------------------------------------------- carrots
// one length of carrot lying along x from xa to xb (xa is the thick end), radius ra at xa and rb at xb
const carrotSeg = (c: Ctx, xa: number, xb: number, y: number, ra: number, rb: number, o: { leafy?: boolean; tip?: boolean } = {}) => {
  shadow(c, (xa + xb) / 2 + 14, y + ra + 8, (xb - xa) / 2, ra * 0.28);
  const body = () => { c.moveTo(xa, y - ra); c.lineTo(xb, y - rb); if (o.tip) c.quadraticCurveTo(xb + 46, y, xb, y + rb); else c.ellipse(xb, y, rb * 0.35, rb, 0, -Math.PI / 2, Math.PI / 2); c.lineTo(xa, y + ra); c.ellipse(xa, y, ra * 0.35, ra, 0, Math.PI / 2, Math.PI * 1.5); c.closePath(); };
  shape(c, body, CAR); shade(c, body, CARDK, 0, ra * 0.5);
  for (let k = 1; k <= 3; k++) { const t = k / 4, px = xa + (xb - xa) * t, pr = ra + (rb - ra) * t; line(c, [[px, y - pr * 0.55], [px - 4, y + pr * 0.55]], 3.5, CARDK); }
  if (!o.tip) shape(c, () => ell(c, xb, y, rb * 0.35, rb), CARCUT, 5);
  if (o.leafy) { leaf(c, xa - 10, y - 8, 110, Math.PI * 1.12); leaf(c, xa - 10, y, 125, Math.PI); leaf(c, xa - 10, y + 8, 110, Math.PI * 0.88); }
  else shape(c, () => ell(c, xa, y, ra * 0.35, ra), CARCUT, 5);
};
// a small cube of carrot, front face from (x, y - s) to (x + s, y)
const cube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x, y - s], [x + s * 0.5, y - s * 1.4], [x + s * 1.5, y - s * 1.4], [x + s, y - s]]), CARCUT, 4);
  shape(c, () => polyP(c, [[x + s, y - s], [x + s * 1.5, y - s * 1.4], [x + s * 1.5, y - s * 0.4], [x + s, y]]), CARDK, 4);
  shape(c, () => c.rect(x, y - s, s, s), CAR, 4);
};
const cubeHeap = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 20, y + 10, s * 3.4, s * 0.5);
  const rows: number[][] = [[-1.5, -0.5, 0.5], [-2, -1, 0, 1], [-1.5, -0.5, 0.5], [-2, -1, 0, 1]];
  rows.forEach((row, ri) => row.forEach((k) => cube(c, x + k * s * 1.2 - s * 0.5 + (ri % 2) * 0, y - (3 - ri) * s * 0.55, s)));
  cube(c, x - s * 0.7, y - s * 2.6, s); cube(c, x + s * 0.6, y - s * 2.3, s);
};
const grated = (c: Ctx, x: number, y: number, rx: number, ry: number, seedN: number, n = 90, dark = false) => {
  const r = rnd(seedN);
  shadow(c, x + 14, y + ry * 0.7, rx, ry * 0.45);
  shape(c, () => ell(c, x, y, rx, ry), dark ? "#9a5a2a" : CARDK, 5);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()), px = x + Math.cos(a) * rx * 0.9 * d, py = y + Math.sin(a) * ry * 0.9 * d, an = r() * Math.PI, L = 30 + r() * 34;
    const pts = [[px - Math.cos(an) * L / 2, py - Math.sin(an) * L / 2], [px + Math.cos(an) * L / 2, py + Math.sin(an) * L / 2]];
    line(c, pts, 15, INK); line(c, pts, 9, dark ? (i % 3 ? "#c47a3a" : "#a86a30") : i % 3 ? CAR : CARCUT);
  }
};
// a wooden chopping board seen from above
const board = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 20, y + h / 2 + 10, w / 2, 26); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 26), COL.wood, 6); c.strokeStyle = COL.woodDk; c.lineWidth = 3; for (let k = 1; k < 5; k++) { c.beginPath(); c.moveTo(x - w / 2 + 30, y - h / 2 + (h * k) / 5); c.lineTo(x + w / 2 - 30, y - h / 2 + (h * k) / 5 + 6); c.stroke(); } shape(c, () => ell(c, x + w / 2 - 40, y - h / 2 + 40, 14, 14), BG, 5); };
// a knife lying flat, handle at (x, y) pointing right
const knife = (c: Ctx, x: number, y: number) => { shadow(c, x + 150, y + 14, 150, 12); shape(c, () => rrect(c, x, y - 18, 130, 36, 12), COL.black, 5); shape(c, () => { c.moveTo(x + 128, y - 22); c.lineTo(x + 330, y - 22); c.quadraticCurveTo(x + 380, y - 10, x + 300, y + 18); c.lineTo(x + 128, y + 18); c.closePath(); }, COL.steelIn, 5); line(c, [[x + 140, y + 10], [x + 300, y + 10]], 3, COL.steelDk); };
// a clear plastic box with a lid, bottom centre (x, y); inside(fy) draws what sits on the damp tissue, whose top is fy
const box = (c: Ctx, x: number, y: number, w: number, h: number, inside: (fy: number) => void) => {
  const bx = x - w / 2, by = y - h, fy = y - h * 0.2, bodyP = () => rrect(c, bx, by, w, h, 14);
  shadow(c, x + w * 0.08, y + 8, w * 0.56, w * 0.07);
  c.save(); c.beginPath(); bodyP(); c.clip();
  shape(c, () => rrect(c, bx + 10, fy, w - 20, h * 0.2 + 20, 10), "#edf3f7", 4);
  const r = rnd(5); for (let i = 0; i < 6; i++) shape(c, () => ell(c, bx + 30 + r() * (w - 60), fy + 14 + r() * (h * 0.12), 7, 5), COL.drop, 2.5);
  inside(fy);
  c.restore();
  shape(c, bodyP, COL.glass, 6);
  shine(c, [[bx + w * 0.1, by + h * 0.18], [bx + w * 0.1, by + h * 0.6]], 7);
  const lid = () => rrect(c, bx - 8, by - 26, w + 16, 34, 8); shape(c, lid, COL.steelIn); shade(c, lid, COL.steelDk, 0, 14, 0.4);
};
// white fluffy mould on a piece of food
const fuzz = (c: Ctx, x: number, y: number, r: number, seedN: number) => {
  const rd = rnd(seedN);
  shape(c, () => ell(c, x, y, r, r * 0.65), WHITE, 4);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + rd() * 0.5; shape(c, () => ell(c, x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.5, r * 0.4, r * 0.32), WHITE, 3); }
  for (let k = 0; k < 7; k++) shape(c, () => ell(c, x - r * 0.6 + rd() * r * 1.2, y - r * 0.35 + rd() * r * 0.7, 4, 4), "#a5a89c", 0);
};

// ---------------------------------------------------------------- other things
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 10, y + 10, w / 2, h / 2);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.paper, 5);
  line(c, [[x, y - h / 2], [x, y + h / 2]], 4, COL.grey);
  for (let k = 1; k < 6; k++) for (const s of [-1, 1]) line(c, [[x + s * 16, y - h / 2 + (h * k) / 6], [x + s * (w / 2 - 16), y - h / 2 + (h * k) / 6]], 3, COL.grey);
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -13, len - 40, 26, 4), COL.yellow, 5);
  shape(c, () => polyP(c, [[len - 40, -13], [len, 0], [len - 40, 13]]), "#f3dcb1", 5);
  shape(c, () => polyP(c, [[len - 14, -5], [len, 0], [len - 14, 5]]), INK, 0);
  shape(c, () => rrect(c, -16, -13, 22, 26, 4), COL.pink, 5);
  c.restore();
};
const marigold = (c: Ctx, x: number, y: number, r: number, dry = false) => {
  const col = dry ? DRYM : MARI, dk = dry ? DRYMDK : MARIDK;
  shape(c, () => ell(c, x, y, r, r), dk, 5);
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78, r * 0.36, r * 0.36), col, 3); }
  shape(c, () => ell(c, x, y, r * 0.5, r * 0.5), col, 4); shape(c, () => ell(c, x, y, r * 0.18, r * 0.18), dk, 0);
};
// a terracotta pot, bottom centre (x, y), rim width w, height h, with its soil showing in the opening
const pot = (c: Ctx, x: number, y: number, w: number, h: number, soilCol: string) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.5, w * 0.08);
  const body = () => polyP(c, [[x - w * 0.48, y - h], [x + w * 0.48, y - h], [x + w * 0.4, y], [x - w * 0.4, y]]);
  shape(c, body, TERRA); shade(c, body, TERRADK, w * 0.2, 0);
  const rim = () => rrect(c, x - w * 0.54, y - h - 24, w * 1.08, 44, 8); shape(c, rim, TERRA); shade(c, rim, TERRADK, w * 0.2, 0);
  shape(c, () => ell(c, x, y - h - 4, w * 0.46, w * 0.09), soilCol, 4);
};
// a methi seedling: thin stem from (x, y) up by h, small round leaves in threes
const seedling = (c: Ctx, x: number, y: number, h: number, col: string, dk: string, n: number) => {
  line(c, [[x, y], [x + 4, y - h]], 9, INK); line(c, [[x, y], [x + 4, y - h]], 4, dk);
  for (let k = 0; k < n; k++) { const t = 0.45 + (k / Math.max(1, n - 1)) * 0.55, py = y - h * t, px = x + 4 * t, s = k % 2 ? 1 : -1; leaf(c, px, py, h * 0.22, s > 0 ? -0.4 : Math.PI + 0.4, col); }
  leaf(c, x + 4, y - h, h * 0.2, -Math.PI / 2 - 0.45, col); leaf(c, x + 4, y - h, h * 0.2, -Math.PI / 2 + 0.45, col);
};
const bubble = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.85)", 3); shape(c, () => ell(c, x - r * 0.35, y - r * 0.35, r * 0.22, r * 0.22), WHITE, 0); };
// a crow, feet at (x, y), facing dir; peck = head down to the ground
const crow = (c: Ctx, x: number, y: number, s: number, dir: 1 | -1, peck = false) => {
  shadow(c, x + dir * s * 0.2, y + 4, s * 1.1, s * 0.16);
  line(c, [[x - dir * s * 0.1, y - s * 0.45], [x - dir * s * 0.2, y]], 5); line(c, [[x + dir * s * 0.2, y - s * 0.45], [x + dir * s * 0.15, y]], 5);
  shape(c, () => polyP(c, [[x - dir * s * 0.6, y - s * 0.8], [x - dir * s * 1.35, y - s * 0.95], [x - dir * s * 1.25, y - s * 0.6]]), COL.black, 5);
  shape(c, () => ell(c, x, y - s * 0.75, s * 0.82, s * 0.44, -dir * 0.12), COL.black, 5);
  const hx = x + dir * s * (peck ? 0.95 : 0.78), hy = peck ? y - s * 0.5 : y - s * 1.15;
  shape(c, () => ell(c, hx, hy, s * 0.32, s * 0.3), COL.black, 5);
  if (peck) shape(c, () => polyP(c, [[hx + dir * s * 0.1, hy + s * 0.05], [hx + dir * s * 0.3, hy + s * 0.5], [hx + dir * s * 0.3, hy - s * 0.02]]), COL.greyDk, 4);
  else shape(c, () => polyP(c, [[hx + dir * s * 0.25, hy - s * 0.12], [hx + dir * s * 0.72, hy + 0], [hx + dir * s * 0.25, hy + s * 0.1]]), COL.greyDk, 4);
  shape(c, () => ell(c, hx + dir * s * 0.08, hy - s * 0.08, s * 0.065, s * 0.065), WHITE, 0);
};
const riceHeap = (c: Ctx, x: number, y: number, rx: number, ry: number, seedN: number) => {
  shadow(c, x + 10, y + ry * 0.6, rx, ry * 0.6);
  shape(c, () => { c.moveTo(x - rx, y); c.quadraticCurveTo(x - rx * 0.6, y - ry * 1.9, x, y - ry * 2); c.quadraticCurveTo(x + rx * 0.6, y - ry * 1.9, x + rx, y); c.quadraticCurveTo(x, y + ry * 0.8, x - rx, y); c.closePath(); }, "#efe9d6", 5);
  const r = rnd(seedN); for (let i = 0; i < 50; i++) { const t = r(), u = r(); const px = x - rx * 0.85 + t * rx * 1.7, top = y - Math.sin(t * Math.PI) * ry * 1.7; const py = top + u * (y - top) + 4; shape(c, () => ell(c, px, py, 8, 4, r() * 3), WHITE, 2); }
};

// ================================================================ SET-UP · e1 The Breathing Soil
// 1. a jug of water with chuna stirred in, white powder settling at the bottom
const e1s0 = (c: Ctx) => {
  counter(c, 850);
  const x = 520, y = 840, w = 400, h = 560, bx = x - w / 2, by = y - h;
  shadow(c, x + 40, y + 10, w * 0.6, 30);
  const body = () => { c.moveTo(bx, by + 40); c.lineTo(bx + 30, by); c.lineTo(bx + w - 30, by); c.lineTo(bx + w, by + 40); c.lineTo(bx + w, y - 30); c.quadraticCurveTo(bx + w, y, bx + w - 30, y); c.lineTo(bx + 30, y); c.quadraticCurveTo(bx, y, bx, y - 30); c.closePath(); };
  // the handle on the right
  shape(c, () => { c.moveTo(bx + w - 10, by + 100); c.bezierCurveTo(bx + w + 150, by + 90, bx + w + 150, by + 400, bx + w - 10, by + 400); c.lineTo(bx + w - 10, by + 350); c.bezierCurveTo(bx + w + 85, by + 350, bx + w + 85, by + 150, bx + w - 10, by + 150); c.closePath(); }, COL.glassEdge, 6);
  c.save(); c.beginPath(); body(); c.clip();
  // water, clear on top; white chuna settling in a layer at the bottom; a few grains still sinking
  shape(c, () => c.rect(bx, by + 110, w, h), CLEAR, 0);
  shape(c, () => { c.moveTo(bx, y - 160); c.quadraticCurveTo(x - 60, y - 190, x, y - 165); c.quadraticCurveTo(x + 120, y - 140, bx + w, y - 170); c.lineTo(bx + w, y); c.lineTo(bx, y); c.closePath(); }, MILK, 0);
  line(c, [[bx, y - 160], [x, y - 165], [bx + w, y - 170]], 4, "#c9c8bc");
  const r = rnd(21); for (let i = 0; i < 22; i++) shape(c, () => ell(c, bx + 20 + r() * (w - 40), y - 170 - r() * 250, 5, 5), WHITE, 1.5);
  shape(c, () => ell(c, x, by + 110, w / 2, 14), COL.drop, 0);
  c.restore();
  // the spoon standing in the jug, its bowl down in the chuna, handle leaning out over the spout side
  line(c, [[bx + 70, by - 90], [x - 20, y - 70]], 26, INK); line(c, [[bx + 70, by - 90], [x - 20, y - 70]], 14, COL.steelIn);
  shape(c, () => ell(c, x + 10, y - 50, 48, 30, 0.4), COL.steel, 6);
  shape(c, body, COL.glass, 6);
  // the pouring lip at the top left corner
  shape(c, () => { c.moveTo(bx + 34, by - 2); c.lineTo(bx - 30, by + 34); c.quadraticCurveTo(bx - 14, by + 60, bx + 4, by + 44); c.closePath(); }, COL.glass, 6);
  shine(c, [[bx + 50, by + 120], [bx + 50, by + 360]], 9);
  // the small spoon of chuna powder that went in, beside the jug
  shadow(c, 905, 860, 80, 10); line(c, [[850, 846], [960, 846]], 18, INK); line(c, [[850, 846], [960, 846]], 9, COL.steelIn);
  shape(c, () => ell(c, 975, 846, 36, 18), COL.steel, 5); shape(c, () => ell(c, 975, 838, 24, 12), WHITE, 3);
};
// 2. three jars on a counter: A and B with soil and peel, C with only air
const e1s1 = (c: Ctx) => {
  counter(c, 780);
  const xs = [200, 540, 880];
  xs.forEach((x, i) => { jar(c, x, 770, 290, 400, { soil: i < 2 }); tag(c, x, 900, "ABC"[i], 0.85); });
};
// 3. a katori of clear limewater standing on the soil inside one jar, the lid beside it
const e1s2 = (c: Ctx) => {
  counter(c, 800);
  jar(c, 470, 790, 440, 560, { soil: true, katori: CLEAR });
  lidFlat(c, 880, 790, 260);
};
// 4. jars A and C on a kitchen shelf, jar B on a fridge shelf
const e1s3 = (c: Ctx) => {
  ground(c);
  shelf(c, 600, 50, 560);
  jar(c, 180, 596, 190, 250, { soil: true, katori: CLEAR, lid: true }); tag(c, 180, 700, "A", 0.75);
  jar(c, 430, 596, 190, 250, { lid: true }); tag(c, 430, 700, "C", 0.75);
  // the fridge: a tall white box with its door open to the right, two cold blue shelves inside
  shadow(c, 850, 1000, 240, 22);
  shape(c, () => rrect(c, 640, 90, 360, 900, 20), "#f3f3ef", 6);
  shape(c, () => c.rect(668, 120, 304, 840), "#dbeaf3", 5);
  for (const sy of [430, 700]) { shape(c, () => rrect(c, 668, sy, 304, 16, 4), COL.steelIn, 4); }
  shape(c, () => rrect(c, 1000, 90, 50, 900, 10), "#f3f3ef", 6); shape(c, () => rrect(c, 1012, 380, 16, 180, 8), COL.steelDk, 4);
  // cold: three snow stars
  for (const [sx, sy] of [[720, 220], [900, 300], [760, 870]]) for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI; line(c, [[sx - Math.cos(a) * 26, sy - Math.sin(a) * 26], [sx + Math.cos(a) * 26, sy + Math.sin(a) * 26]], 4, COL.blue); }
  jar(c, 820, 428, 190, 250, { soil: true, katori: CLEAR, lid: true }); tag(c, 820, 560, "B", 0.75);
};
// 5. three katoris of limewater after a day: A milky, B a little cloudy, C clear
const e1s4 = (c: Ctx) => {
  counter(c, 700);
  const xs = [200, 540, 880], fills = [MILK, CLOUDY, CLEAR];
  xs.forEach((x, i) => { bowl(c, x, 560, 150, fills[i]); if (i === 2) shine(c, [[x - 80, 552], [x - 20, 548]], 8); tag(c, x, 850, "ABC"[i], 0.9); });
};

// ================================================================ SET-UP · e2 Cut It Up
// 1. a carrot cut into three equal lengths on a board, a knife beside it
const e2s0 = (c: Ctx) => {
  ground(c); board(c, 540, 470, 900, 540);
  const y = 400, r1 = 62, r2 = 44, r3 = 27;
  carrotSeg(c, 200, 420, y, r1, r2, { leafy: true });
  carrotSeg(c, 450, 670, y, r2, r3);
  carrotSeg(c, 700, 920, y, r3, 10, { tip: true });
  knife(c, 300, 610);
};
// 2. three portions: one whole, one chopped into small cubes, one grated
const e2s1 = (c: Ctx) => {
  ground(c); board(c, 540, 560, 980, 720);
  carrotSeg(c, 130, 430, 360, 58, 42, { leafy: true });
  cubeHeap(c, 300, 800, 44);
  grated(c, 780, 620, 190, 110, 31, 110);
};
// 3. three clear boxes, each with damp tissue and its portion
const whole = (c: Ctx, x: number, fy: number, len: number, r: number) => carrotSeg(c, x - len / 2, x + len / 2, fy - r, r, r * 0.75);
const cubes = (c: Ctx, x: number, fy: number, s: number) => { const pos = [[-2.4, 0], [-1.2, 0], [0, 0], [1.2, 0], [-1.8, -0.8], [-0.6, -0.8], [0.6, -0.8], [-1.2, -1.6], [0, -1.6]]; pos.forEach(([u, v]) => cube(c, x + u * s, fy + v * s * 0.8, s)); };
const e2s2 = (c: Ctx) => {
  counter(c, 760);
  const w = 300, h = 250;
  box(c, 190, 750, w, h, (fy) => whole(c, 190, fy + 8, 230, 40));
  box(c, 540, 750, w, h, (fy) => cubes(c, 540, fy + 10, 34));
  box(c, 890, 750, w, h, (fy) => grated(c, 890, fy - 20, 120, 50, 41, 60));
};
// 4. the three boxes on a shelf, a notebook and pencil beside them
const e2s3 = (c: Ctx) => {
  ground(c); shelf(c, 640, 30, 1050);
  const w = 215, h = 180;
  box(c, 150, 636, w, h, (fy) => whole(c, 150, fy + 6, 165, 30));
  box(c, 400, 636, w, h, (fy) => cubes(c, 400, fy + 8, 25));
  box(c, 650, 636, w, h, (fy) => grated(c, 650, fy - 14, 86, 36, 41, 40));
  notebook(c, 890, 572, 260, 130); pencil(c, 800, 620, 180, -0.08);
};

// ================================================================ CARDS · experiments, activities, project
// flow.e1 the jar is breathing: soil and peel, bubbles rising, the limewater in the katori gone milky
const fE1 = (c: Ctx) => {
  counter(c, 820);
  jar(c, 540, 810, 460, 600, { soil: true, katori: MILK, lid: true, bubbles: true });
};
// flow.e2 after six days: the whole piece firm, the cubes a little fuzzy, the grated carrot dark and mouldy
const fE2 = (c: Ctx) => {
  counter(c, 760);
  const w = 300, h = 250;
  box(c, 190, 750, w, h, (fy) => whole(c, 190, fy + 8, 230, 40));
  box(c, 540, 750, w, h, (fy) => { cubes(c, 540, fy + 10, 34); fuzz(c, 505, fy - 40, 34, 7); fuzz(c, 590, fy - 10, 28, 8); });
  box(c, 890, 750, w, h, (fy) => { grated(c, 890, fy - 20, 120, 50, 41, 60, true); fuzz(c, 850, fy - 50, 44, 9); fuzz(c, 940, fy - 30, 38, 10); fuzz(c, 890, fy, 34, 12); });
};
// flow.a1 Soil Detective: the child at a table, a lens over the plate of soil, a toothpick in the other hand
const fA1 = (c: Ctx) => {
  ground(c);
  const kid = person(c, 540, 1010, 760, { reachL: [330, 640], reachR: [760, 640] });
  // the table in front, hiding the legs
  shadow(c, 560, 1020, 420, 20);
  for (const lx of [200, 880]) shape(c, () => c.rect(lx - 18, 740, 36, 270), WOODSHDK, 5);
  shape(c, () => rrect(c, 130, 700, 820, 44, 8), WOODSH, 6);
  // the white plate with a thin spread of soil
  plate(c, 540, 660, 210, 56);
  shape(c, () => ell(c, 540, 660, 160, 40), COL.paper, 0);
  const r = rnd(17);
  for (let i = 0; i < 80; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); const px = 540 + Math.cos(a) * 145 * d, py = 660 + Math.sin(a) * 33 * d; shape(c, () => ell(c, px, py, 6 + r() * 7, 4 + r() * 4, r() * 3), i % 4 ? COL.soilDk : COL.soil, 1.5); }
  for (let i = 0; i < 4; i++) line(c, [[440 + i * 60, 650 + (i % 2) * 14], [465 + i * 60, 668 - (i % 2) * 10]], 2.5, WHITE);
  leaf(c, 590, 652, 28, 0.3, COL.brown);
  // the toothpick in the left hand (viewer's left), its point on the soil
  line(c, [[kid.handL[0], kid.handL[1]], [440, 668]], 7, INK); line(c, [[kid.handL[0], kid.handL[1]], [440, 668]], 3.5, COL.paper);
  // the magnifying glass: handle in the right hand, the lens held over the far side of the plate
  const hx = kid.handR[0], hy = kid.handR[1], lx = 640, ly = 585;
  line(c, [[hx, hy], [lx + 36, ly + 42]], 22, INK); line(c, [[hx, hy], [lx + 36, ly + 42]], 12, COL.brown);
  shape(c, () => ell(c, lx, ly, 72, 72), COL.black, 6);
  shape(c, () => ell(c, lx, ly, 58, 58), "rgba(214,236,250,0.85)", 0);
  // what the lens shows: bigger crumbs and a white thread
  shape(c, () => ell(c, lx - 18, ly + 10, 16, 11, 0.3), COL.soilDk, 2); shape(c, () => ell(c, lx + 20, ly - 6, 13, 9, -0.4), COL.soil, 2); shape(c, () => ell(c, lx + 8, ly + 26, 10, 7, 0.8), COL.soilDk, 2);
  line(c, [[lx - 30, ly - 22], [lx - 5, ly - 10], [lx + 25, ly - 28]], 3, WHITE);
  shine(c, [[lx - 34, ly - 26], [lx - 14, ly - 42]], 6);
};
// flow.a2 Marigold Diary: half the flowers pressed into the soil of a pot, the other half dry on a saucer
const fA2 = (c: Ctx) => {
  ground(c); shelf(c, 700, 40, 1040);
  pot(c, 330, 696, 330, 280, COL.soilDk);
  // flowers pressed half into the soil at the top of the pot
  c.save(); c.beginPath(); c.rect(0, 0, D, 414); c.clip();
  marigold(c, 250, 412, 44); marigold(c, 335, 406, 50); marigold(c, 420, 414, 42);
  c.restore();
  // the saucer of dry flowers
  plate(c, 790, 650, 220, 58);
  marigold(c, 720, 632, 38, true); marigold(c, 800, 616, 42, true); marigold(c, 870, 640, 36, true); marigold(c, 780, 668, 32, true);
};
// flow.a3 Who Eats It? the leftovers from one meal laid out on a steel tray
const fA3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 580, 470, 300);
  shape(c, () => rrect(c, 80, 250, 920, 640, 36), COL.steel, 6);
  shape(c, () => rrect(c, 120, 290, 840, 560, 26), COL.steelIn, 4);
  // banana peel: a yellow star of four strips from a stub
  const bp = (x: number, y: number) => { shadow(c, x + 10, y + 30, 120, 26); for (const a of [-2.6, -1.9, -0.9, -0.4]) { const ex = x + Math.cos(a) * 170, ey = y + Math.sin(a) * 110; line(c, [[x, y], [ex, ey]], 36, INK); line(c, [[x, y], [ex, ey]], 24, COL.yellow); line(c, [[x, y], [ex, ey]], 8, "#f5e9b8"); } shape(c, () => ell(c, x, y + 10, 38, 26), "#e9d27a", 5); shape(c, () => ell(c, x, y + 30, 22, 14), "#5b4a2a", 4); };
  bp(300, 500);
  riceHeap(c, 580, 470, 110, 40, 33);
  // a bone
  const bone = (x: number, y: number) => { shadow(c, x + 8, y + 22, 120, 16); line(c, [[x - 90, y], [x + 90, y]], 40, INK); line(c, [[x - 90, y], [x + 90, y]], 26, "#f4efe0"); for (const s of [-1, 1]) for (const t of [-1, 1]) shape(c, () => ell(c, x + s * 98, y + t * 16, 22, 22), "#f4efe0", 5); };
  bone(820, 420);
  // an eggshell: two jagged halves
  const shell = (x: number, y: number, flip: number) => { shadow(c, x + 6, y + 30, 50, 12); shape(c, () => { c.moveTo(x - 46, y); c.bezierCurveTo(x - 46, y + 50, x + 46, y + 50, x + 46, y); for (let k = 0; k < 6; k++) c.lineTo(x + 46 - (k + 0.5) * 15.3, y - (k % 2 ? 18 : 6) * flip); c.closePath(); }, "#f7f1e3", 5); };
  shell(260, 740, 1); shell(360, 760, 1);
  // half a coconut shell, white inside
  shadow(c, 600, 760, 110, 30); shape(c, () => { c.moveTo(500, 720); c.bezierCurveTo(505, 830, 695, 830, 700, 720); c.closePath(); }, "#6b4a2e", 6); shape(c, () => ell(c, 600, 720, 100, 32), WHITE, 5); shape(c, () => ell(c, 600, 722, 70, 20), "#f1eee6", 3);
  // a crumpled plastic wrapper, shiny purple
  shadow(c, 850, 760, 100, 24); shape(c, () => polyP(c, [[760, 690], [860, 660], [940, 700], [950, 780], [870, 810], [780, 790], [750, 740]]), COL.purple, 6); line(c, [[800, 700], [850, 780]], 3, "#b9a6e6"); line(c, [[880, 690], [910, 760]], 3, "#b9a6e6"); shine(c, [[790, 720], [820, 690]], 7);
};
// flow.a4 Street Cleaners: the view from a window of a rubbish corner, two crows and a dog at the waste
const fA4 = (c: Ctx) => {
  ground(c);
  // through the window: a wall, the road, a bin, scattered peels
  shape(c, () => c.rect(90, 90, 900, 900), COL.sky, 0);
  shape(c, () => c.rect(90, 330, 900, 300), "#e8c9a0", 0); line(c, [[90, 330], [990, 330]], 5);
  for (let k = 0; k < 4; k++) for (let j = 0; j < 7; j++) line(c, [[90 + j * 130 + (k % 2) * 65, 370 + k * 65], [150 + j * 130 + (k % 2) * 65, 370 + k * 65]], 3, "#cfa97a");
  shape(c, () => c.rect(90, 630, 900, 360), "#a9a39b", 0); line(c, [[90, 630], [990, 630]], 5);
  // the bin
  shadow(c, 790, 905, 120, 18); shape(c, () => polyP(c, [[700, 640], [860, 640], [850, 900], [710, 900]]), COL.green, 6); shade(c, () => polyP(c, [[700, 640], [860, 640], [850, 900], [710, 900]]), COL.greenDk, 40, 0); shape(c, () => rrect(c, 686, 622, 188, 36, 8), COL.greenDk, 5);
  // peels and leaves on the road
  const r = rnd(44);
  for (let i = 0; i < 9; i++) { const px = 260 + r() * 380, py = 820 + r() * 120; shape(c, () => rrect(c, px, py, 44 + r() * 30, 16, 7), i % 2 ? COL.yellow : CAR, 4); }
  leaf(c, 560, 870, 50, 0.4, COL.brown); leaf(c, 420, 920, 46, 2.8, COL.leafDk);
  // two crows pecking, a dog sniffing the heap
  crow(c, 300, 900, 48, 1, true); crow(c, 560, 940, 48, -1, true);
  const dog = (x: number, y: number) => {
    shadow(c, x, y + 6, 150, 22);
    for (const lx of [x - 90, x - 60, x + 60, x + 90]) { line(c, [[lx, y - 80], [lx, y]], 22, INK); line(c, [[lx, y - 80], [lx, y]], 12, "#c9955a"); }
    shape(c, () => ell(c, x, y - 110, 120, 52), "#d8a86a", 6); shade(c, () => ell(c, x, y - 110, 120, 52), "#b98448", 0, 22);
    line(c, [[x + 110, y - 130], [x + 165, y - 200]], 20, INK); line(c, [[x + 110, y - 130], [x + 165, y - 200]], 10, "#d8a86a");
    // head down toward the peels
    shape(c, () => ell(c, x - 150, y - 60, 52, 42), "#d8a86a", 6); shape(c, () => ell(c, x - 195, y - 40, 28, 20), "#d8a86a", 5); shape(c, () => ell(c, x - 218, y - 44, 10, 8), INK, 0);
    shape(c, () => ell(c, x - 130, y - 100, 16, 30, 0.4), "#b98448", 5); shape(c, () => ell(c, x - 160, y - 72, 6, 6), INK, 0);
  };
  dog(870, 980);
  // the window frame over everything
  for (const bar of [[40, 40, 1000, 50], [40, 990, 1000, 50], [40, 40, 50, 1000], [990, 40, 50, 1000]]) shape(c, () => c.rect(bar[0], bar[1], bar[2], bar[3]), WOODSH, 6);
  shape(c, () => rrect(c, 20, 1000, 1040, 60, 8), WOODSH, 6);
};
// flow.p1 methi in three pots on a sunny ledge: A cocopeat (pale, small), B compost mixed in (tall, dark green), C garden soil (middle)
const fP1 = (c: Ctx) => {
  ground(c); sunWindow(c);
  shape(c, () => rrect(c, 0, 780, D, 60, 6), WOODSH, 6); c.fillStyle = WOODSHDK; c.fillRect(4, 820, D - 8, 16);
  const xs = [200, 540, 880], soils = ["#b08457", "#4b3220", COL.soil], hs = [95, 230, 160], cols = [["#a9c98a", "#7fa65e"], [COL.leafDk, "#2e6128"], [COL.leaf, COL.leafDk]], ns = [1, 4, 3];
  xs.forEach((x, i) => {
    pot(c, x, 776, 230, 200, soils[i]);
    for (const dx of [-60, -20, 25, 62]) seedling(c, x + dx, 568, hs[i] * (0.8 + Math.abs(dx) / 300), cols[i][0], cols[i][1], ns[i]);
    tag(c, x, 940, "ABC"[i], 0.8);
  });
};

// ================================================================ CARDS · terms
// term.0 Decomposer: a fallen branch with white fungus threads spreading through the wood
const tDecomposer = (c: Ctx) => {
  ground(c);
  shape(c, () => c.rect(0, 760, D, 320), "#c9b08a", 0); line(c, [[0, 760], [D, 760]], 5);
  const r = rnd(9); for (let i = 0; i < 14; i++) leaf(c, 60 + r() * 960, 790 + r() * 200, 40 + r() * 30, r() * Math.PI * 2, i % 2 ? COL.brown : "#c9924a");
  // the branch, lying across the ground, a broken end on the right
  shadow(c, 560, 770, 470, 30);
  const br = () => { c.moveTo(80, 560); c.quadraticCurveTo(300, 500, 560, 520); c.quadraticCurveTo(820, 540, 1000, 500); c.lineTo(1010, 700); c.quadraticCurveTo(800, 730, 560, 740); c.quadraticCurveTo(300, 750, 90, 720); c.closePath(); };
  shape(c, br, COL.brown); shade(c, br, "#7a4e26", 0, 70);
  for (let k = 0; k < 7; k++) line(c, [[150 + k * 120, 560 + (k % 2) * 20], [230 + k * 120, 575 + (k % 2) * 20]], 4, "#7a4e26");
  shape(c, () => ell(c, 1005, 600, 26, 100), "#e9cf9c", 6); shape(c, () => ell(c, 1005, 600, 12, 60), "#d9b87c", 3);
  // a side twig
  line(c, [[330, 525], [260, 430]], 30, INK); line(c, [[330, 525], [260, 430]], 18, COL.brown);
  // the fungus: white threads running through the wood from the broken end, branching as they go, a few reaching down into the ground
  const thread = (x: number, y: number, an: number, len: number, w: number, depth: number) => {
    if (depth === 0 || len < 16) return;
    const mx = x + Math.cos(an) * len * 0.5 + (r() - 0.5) * 24, my = y + Math.sin(an) * len * 0.5 + (r() - 0.5) * 24, ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len;
    line(c, [[x, y], [mx, my], [ex, ey]], w + 3, INK); line(c, [[x, y], [mx, my], [ex, ey]], w, WHITE);
    thread(ex, ey, an - 0.35 + r() * 0.2, len * 0.8, w * 0.85, depth - 1);
    if (r() < 0.75) thread(ex, ey, an + 0.35 - r() * 0.2, len * 0.8, w * 0.85, depth - 1);
  };
  c.save(); c.beginPath(); br(); c.clip();
  for (let k = 0; k < 6; k++) thread(985, 540 + k * 28, Math.PI + (k - 2.5) * 0.09, 110, 7, 6);
  c.restore();
  c.save(); c.beginPath(); c.rect(0, 700, D, 400); c.clip();
  for (let k = 0; k < 3; k++) thread(520 + k * 110, 728, Math.PI * 0.5 + (k - 1) * 0.25, 60, 5, 4);
  c.restore();
  // small white mushroom shelves at the top edge where the threads reached
  for (const [mx, my] of [[520, 520], [660, 526]]) { shape(c, () => { c.moveTo(mx - 40, my); c.quadraticCurveTo(mx, my - 50, mx + 40, my); c.closePath(); }, "#f4efe3", 5); }
};
// term.1 Detritivore: an earthworm pulling a dead leaf down into her burrow
const tEarthworm = (c: Ctx) => {
  ground(c);
  // the soil in cutaway, grass on top
  shape(c, () => c.rect(0, 380, D, 700), COL.soil, 0); shade(c, () => c.rect(0, 380, D, 700), COL.soilDk, 0, 400, 0.35);
  shape(c, () => { c.moveTo(0, 380); c.quadraticCurveTo(300, 360, 540, 385); c.quadraticCurveTo(800, 405, D, 380); c.lineTo(D, 420); c.lineTo(0, 420); c.closePath(); }, COL.green, 0); line(c, [[0, 380], [540, 385], [D, 380]], 6);
  for (let k = 0; k < 24; k++) { const gx = 20 + k * 46; line(c, [[gx, 382], [gx + 6, 350 - (k % 3) * 10]], 5, COL.greenDk); line(c, [[gx + 14, 382], [gx + 24, 345 - (k % 2) * 12]], 5, COL.green); }
  const r = rnd(5); for (let i = 0; i < 30; i++) shape(c, () => ell(c, r() * D, 460 + r() * 600, 10 + r() * 14, 7 + r() * 8), COL.soilDk, 0);
  // the burrow: a dark tunnel from a hole in the grass curving down to the right
  const tun = [[520, 385], [520, 470], [560, 580], [660, 680], [760, 740]];
  c.beginPath(); c.moveTo(tun[0][0], tun[0][1]); for (let i = 1; i < tun.length - 1; i++) c.quadraticCurveTo(tun[i][0], tun[i][1], (tun[i][0] + tun[i + 1][0]) / 2, (tun[i][1] + tun[i + 1][1]) / 2); c.lineTo(760, 740);
  c.strokeStyle = INK; c.lineWidth = 92; c.lineCap = "round"; c.stroke(); c.strokeStyle = "#4f2f1b"; c.lineWidth = 80; c.stroke();
  shape(c, () => ell(c, 520, 385, 48, 18), "#4f2f1b", 5);
  // the worm: head at the mouth of the hole gripping the leaf stalk, body down the tunnel
  const worm = [[522, 400], [526, 470], [565, 575], [655, 668], [735, 725]];
  const wp = () => { c.beginPath(); c.moveTo(worm[0][0], worm[0][1]); for (let i = 1; i < worm.length - 1; i++) c.quadraticCurveTo(worm[i][0], worm[i][1], (worm[i][0] + worm[i + 1][0]) / 2, (worm[i][1] + worm[i + 1][1]) / 2); c.lineTo(735, 725); };
  wp(); c.strokeStyle = INK; c.lineWidth = 50; c.stroke(); wp(); c.strokeStyle = "#e39a98"; c.lineWidth = 38; c.stroke();
  for (let k = 0; k < 14; k++) { const t = 0.08 + k * 0.065, i = Math.min(3, Math.floor(t * 4)), u = t * 4 - i, px = worm[i][0] + (worm[i + 1][0] - worm[i][0]) * u, py = worm[i][1] + (worm[i + 1][1] - worm[i][1]) * u, dx = worm[i + 1][0] - worm[i][0], dy = worm[i + 1][1] - worm[i][1], L = Math.hypot(dx, dy); line(c, [[px - (dy / L) * 17, py + (dx / L) * 17], [px + (dy / L) * 17, py - (dx / L) * 17]], 3, "#c97b7b"); }
  c.beginPath(); c.moveTo(560, 548); c.lineTo(590, 600); c.strokeStyle = "#c97b7b"; c.lineWidth = 36; c.lineCap = "butt"; c.stroke(); c.lineCap = "round";
  // the dead brown leaf: half above ground, its stalk end already in the worm's mouth
  const lf = () => { c.moveTo(528, 392); c.quadraticCurveTo(560, 300, 640, 230); c.quadraticCurveTo(740, 150, 850, 170); c.quadraticCurveTo(840, 290, 740, 350); c.quadraticCurveTo(650, 405, 528, 392); c.closePath(); };
  shape(c, lf, "#b8793a"); shade(c, lf, "#8d5826", 0, 40);
  line(c, [[528, 392], [700, 290], [840, 180]], 4, "#7a4a1e");
  for (let k = 1; k < 5; k++) { const t = k / 5, mx = 528 + (840 - 528) * t, my = 392 + (180 - 392) * t - 20 * Math.sin(t * Math.PI); line(c, [[mx, my], [mx + 20, my + 50 * (1 - t) + 10]], 3, "#7a4a1e"); }
  // the way the leaf moves: down into the hole
  arrow(c, [[430, 250], [492, 368]], RED, 11);
};
// term.2 Scavenger: a vulture on a fence post, a crow beside a dropped heap of rice
const tScavenger = (c: Ctx) => {
  ground(c);
  shape(c, () => c.rect(0, 760, D, 320), "#c9b08a", 0); line(c, [[0, 760], [D, 760]], 5);
  // the post with a wire
  shadow(c, 350, 775, 110, 22);
  line(c, [[0, 560], [280, 556]], 5, COL.greyDk); line(c, [[400, 556], [D, 560]], 5, COL.greyDk);
  shape(c, () => polyP(c, [[290, 540], [390, 540], [396, 770], [284, 770]]), WOODSHDK, 6); shape(c, () => polyP(c, [[286, 520], [394, 520], [394, 548], [286, 548]]), WOODSH, 5);
  // the vulture: a big hunched brown bird, bald pale head on a long neck, white ruff, hooked beak, yellow feet gripping the post
  const vx = 340, vy = 525;
  shadow(c, vx + 10, vy - 4, 120, 14);
  shape(c, () => polyP(c, [[vx + 40, vy - 110], [vx + 100, vy + 70], [vx + 140, vy + 56], [vx + 100, vy - 140]]), "#4f3620", 5);
  const bd = () => ell(c, vx, vy - 200, 135, 190, 0.1); shape(c, bd, "#6b4a2e"); shade(c, bd, "#4f3620", 30, 20);
  const wg = () => { c.moveTo(vx - 80, vy - 330); c.quadraticCurveTo(vx - 170, vy - 220, vx - 90, vy - 50); c.quadraticCurveTo(vx - 10, vy - 110, vx + 5, vy - 300); c.closePath(); }; shape(c, wg, "#4f3620", 5);
  for (let k = 0; k < 4; k++) line(c, [[vx - 130 + k * 14, vy - 170 + k * 22], [vx - 95 + k * 14, vy - 95 + k * 20]], 4, "#362413");
  shape(c, () => ell(c, vx - 10, vy - 375, 95, 42), "#f1e8d6", 5);
  line(c, [[vx - 20, vy - 380], [vx - 30, vy - 450]], 44, INK); line(c, [[vx - 20, vy - 380], [vx - 30, vy - 450]], 32, "#e6a98f");
  shape(c, () => ell(c, vx - 34, vy - 470, 46, 42), "#e6a98f", 5);
  shape(c, () => { c.moveTo(vx - 70, vy - 486); c.quadraticCurveTo(vx - 130, vy - 480, vx - 118, vy - 440); c.quadraticCurveTo(vx - 112, vy - 428, vx - 104, vy - 448); c.quadraticCurveTo(vx - 90, vy - 460, vx - 72, vy - 456); c.closePath(); }, "#e8d38a", 5);
  shape(c, () => ell(c, vx - 48, vy - 478, 9, 9), INK, 0);
  for (const fx of [vx - 10, vx + 40]) for (const d of [-14, 0, 14]) line(c, [[fx, vy - 10], [fx + d, vy + 18]], 8, "#e8c45a");
  for (const fx of [vx - 10, vx + 40]) line(c, [[fx, vy - 40], [fx, vy - 8]], 12, "#e8c45a");
  // the crow on the ground by the heap of rice
  riceHeap(c, 820, 910, 120, 40, 23);
  crow(c, 600, 915, 80, 1, true);
};

export const ic_ecologyCyclesAndDecomposersL4 = cards("sci.ecology.cycles-and-decomposers.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4,
  e2s0, e2s1, e2s2, e2s3,
  fE1, fE2, fA1, fA2, fA3, fA4, fP1,
  tDecomposer, tEarthworm, tScavenger,
]);
