import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, seed, hand, person, write, cards } from "./flatKit";

// MIGRATION L4 · set-up cards for the Midnight Sun Spin (an orange Earth and a torch Sun) and the
// Stepping-Stone Flyway (six wetland circles, paper birds, beans and a die), then the title pictures of
// each activity and four things a child can see: a goose over the Himalaya, a house crow, a marsh heron,
// a bird being ringed. Same flat kit, same child and grown-up on every card.

const DARK = "#4b4f80", ORANGE_DK = "#c86c1e", BAND = "#7a4a2a", GOOSE = "#d9dde3", GOOSE_DK = "#a9b0bb", MUD = "#a07a55", BROWN_DK = "#6f4a2a";
type Pt = [number, number];

// ---------------------------------------------------------------- pieces
// a bamboo skewer from a to b
const skewer = (c: Ctx, a: Pt, b: Pt) => { line(c, [a, b], 16, INK); line(c, [a, b], 8, COL.wood); };
// the orange Earth on its skewer: centre (x, y), radius r, the skewer leaning `tilt` radians from upright (negative = top to the left).
// band = the rubber-band equator; dots = the three marker dots (near the band, halfway up, near the top); lit = light coming
// from the left, so the right side is in shade; clay = a lump of clay over the sharp end, which rests on the table.
type Orange = { band?: boolean; dots?: boolean; lit?: boolean; up?: number; down?: number; clay?: boolean };
const orangeEarth = (c: Ctx, x: number, y: number, r: number, tilt: number, o: Orange = {}) => {
  const ux = Math.sin(tilt), uy = -Math.cos(tilt), up = o.up ?? r * 1.5, dn = o.down ?? r * 1.5;
  const at = (k: number): Pt => [x + ux * k, y + uy * k];
  skewer(c, at(-dn), at(up));
  if (o.clay) { const [bx, by] = at(-dn); shadow(c, bx + 8, by + 4, r * 0.4, r * 0.08); shape(c, () => ell(c, bx, by - r * 0.1, r * 0.3, r * 0.2), COL.grey, 5); }
  const body = () => ell(c, x, y, r, r);
  shape(c, body, COL.orange);
  if (o.lit) shade(c, body, ORANGE_DK, -r * 0.6, 0, 0.65); else shade(c, body, ORANGE_DK, -r * 0.3, -r * 0.3, 0.45);
  shine(c, [[x - r * 0.55, y - r * 0.45], [x - r * 0.3, y - r * 0.62]], 8);
  if (o.band) { c.beginPath(); c.ellipse(x, y, r, r * 0.26, tilt, 0, Math.PI); c.strokeStyle = BAND; c.lineWidth = 11; c.lineCap = "round"; c.stroke(); }
  if (o.dots) for (const lat of [0.16, 0.78, 1.32]) {
    const px = r * Math.cos(lat) * 0.45, py = -r * Math.sin(lat) * 0.97;
    const rx = px * Math.cos(tilt) - py * Math.sin(tilt), ry = px * Math.sin(tilt) + py * Math.cos(tilt);
    shape(c, () => ell(c, x + rx, y + ry, 10, 10), INK, 0);
  }
};
// a torch lying with its back end at (x, y), pointing along angle an; the lens is 128 px along for s = 1
const torch = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, 0, -24, 95, 48, 10), COL.steel);
  for (const k of [14, 24]) line(c, [[k, -20], [k, 20]], 3, COL.steelDk);
  shape(c, () => polyP(c, [[90, -30], [120, -42], [120, 42], [90, 30]]), COL.steelDk);
  shape(c, () => polyP(c, [[118, -40], [128, -40], [128, 40], [118, 40]]), COL.yellow, 4);
  shape(c, () => rrect(c, 40, -9, 30, 18, 6), COL.red, 4);
  c.restore();
};
// the cone of light from the lens (x0, y0), half-height w0 there, to (x1, y1), half-height w1; draw it before the thing it lights
const beam = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number) => {
  const an = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(an), ny = Math.cos(an);
  c.globalAlpha = 0.7;
  shape(c, () => polyP(c, [[x0 + nx * w0, y0 + ny * w0], [x1 + nx * w1, y1 + ny * w1], [x1 - nx * w1, y1 - ny * w1], [x0 - nx * w0, y0 - ny * w0]]), "#ffe98a", 0);
  c.globalAlpha = 1;
};
// a pile of n books, centre x, bottom y
const books = (c: Ctx, x: number, y: number, w: number, n: number) => {
  const cols = [COL.blue, COL.red, COL.green], h = 34;
  shadow(c, x + 14, y + 4, w * 0.55, 10);
  for (let i = 0; i < n; i++) {
    const yy = y - (i + 1) * h, x0 = x - w / 2 + (i % 2) * 12;
    shape(c, () => rrect(c, x0, yy, w, h, 5), cols[i % 3]);
    shape(c, () => polyP(c, [[x0 + w - 28, yy + 6], [x0 + w - 7, yy + 6], [x0 + w - 7, yy + h - 6], [x0 + w - 28, yy + h - 6]]), COL.paper, 3);
  }
};
// a curved arrow round (x, y) at radius r from angle a0 to a1
const curveArrow = (c: Ctx, x: number, y: number, r: number, a0: number, a1: number, col = RED, w = 9) => {
  const pts: number[][] = []; for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  arrow(c, pts, col, w);
};
// a sheet of paper lying flat, top-left (x, y)
const paper = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.paper) => { shadow(c, x + w / 2 + 12, y + h + 6, w * 0.5, 12); shape(c, () => rrect(c, x, y, w, h, 10), col, 5); };
// a table top from y down
const table = (c: Ctx, y: number, col = COL.wood) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
// a sun with rays
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], Math.max(4, r * 0.09), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.3, -r * 0.3, 0.4);
};
// reeds standing in a patch of water: base centre (x, y), height h
const reeds = (c: Ctx, x: number, y: number, h: number, n = 3, pool = true) => {
  if (pool) shape(c, () => ell(c, x, y, h * 0.55, h * 0.14), COL.water, 4);
  for (let i = 0; i < n; i++) {
    const rx = x + (i - (n - 1) / 2) * h * 0.32, top = y - h * (0.75 + (i % 2) * 0.25);
    line(c, [[rx, y], [rx, top]], Math.max(4, h * 0.07), COL.leafDk);
    shape(c, () => rrect(c, rx - h * 0.055, top - h * 0.22, h * 0.11, h * 0.26, h * 0.05), COL.brown, 3);
  }
};
// a coconut palm, base (x, y), height h
const palm = (c: Ctx, x: number, y: number, h: number) => {
  c.beginPath(); c.moveTo(x - h * 0.05, y); c.quadraticCurveTo(x + h * 0.15, y - h * 0.5, x + h * 0.1, y - h); c.strokeStyle = INK; c.lineWidth = h * 0.16 + 8; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.brown; c.lineWidth = h * 0.16; c.stroke();
  for (const a of [-2.9, -2.3, -1.6, -0.9, -0.3]) { const tx = x + h * 0.1, ty = y - h; const ex = tx + Math.cos(a) * h * 0.55, ey = ty + Math.sin(a) * h * 0.55 + h * 0.15; c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo((tx + ex) / 2, ey - h * 0.25, ex, ey); c.strokeStyle = INK; c.lineWidth = h * 0.14 + 7; c.stroke(); c.strokeStyle = COL.green; c.lineWidth = h * 0.14; c.stroke(); }
};
// the Stepping-Stone Flyway drawn on paper: six circles in a row from x0, a step apart: the Start marsh (reeds), wetlands 1 to 4,
// Kerala (a coconut palm); crossed = a wetland drained (red cross); jump = a long arc from one circle over to another
const flyway = (c: Ctx, x0: number, y: number, r: number, step: number, o: { crossed?: number; jump?: [number, number] } = {}) => {
  for (let i = 0; i < 6; i++) {
    const x = x0 + i * step;
    shape(c, () => ell(c, x, y, r, r), i === 5 ? COL.greenLt : COL.sky, 5);
    if (i === 0) reeds(c, x, y + r * 0.4, r * 0.95);
    else if (i === 5) palm(c, x - r * 0.15, y + r * 0.6, r * 1.2);
    else write(c, String(i), x - r * 0.25, y - r * 0.42, r * 0.84, INK, 6);
    if (i < 5) arrow(c, [[x + r + 6, y], [x + step - r - 8, y]], INK, 6);
  }
  if (o.crossed !== undefined) { const x = x0 + o.crossed * step; line(c, [[x - r * 0.75, y - r * 0.75], [x + r * 0.75, y + r * 0.75]], 13, RED); line(c, [[x + r * 0.75, y - r * 0.75], [x - r * 0.75, y + r * 0.75]], 13, RED); }
  if (o.jump) {
    const xa = x0 + o.jump[0] * step, xb = x0 + o.jump[1] * step, pts: number[][] = [];
    for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([xa + (xb - xa) * t, y - r - 14 - (r * 1.9) * 4 * t * (1 - t)]); }
    arrow(c, pts, RED, 10);
  }
};
// a die showing `face`, centre (x, y), side s
const die = (c: Ctx, x: number, y: number, s: number, face: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18), WHITE);
  const p = s * 0.27, pips: Record<number, number[][]> = { 1: [[0, 0]], 2: [[-p, -p], [p, p]], 3: [[-p, -p], [0, 0], [p, p]], 4: [[-p, -p], [p, -p], [-p, p], [p, p]], 5: [[-p, -p], [p, -p], [0, 0], [-p, p], [p, p]], 6: [[-p, -p], [p, -p], [-p, 0], [p, 0], [-p, p], [p, p]] };
  pips[face].forEach(([a, b]) => shape(c, () => ell(c, a, b, s * 0.085, s * 0.085), INK, 0));
  c.restore();
};
const bean = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, "#c98a4a", "#8f5c33");
const lentil = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.8), COL.orange, 3);
// a small paper bird marker (a folded paper bird seen from the side), centre (x, y), length s
const marker = (c: Ctx, x: number, y: number, s: number, col = WHITE) => {
  shape(c, () => polyP(c, [[x - s * 0.5, y + s * 0.2], [x - s * 0.15, y - s * 0.05], [x + s * 0.5, y - s * 0.02], [x + s * 0.25, y + s * 0.25]]), col, 4);
  shape(c, () => polyP(c, [[x - s * 0.2, y], [x + s * 0.05, y - s * 0.45], [x + s * 0.2, y - s * 0.02]]), col, 4);
};
// a bird seen from the side, body centre (x, y), body length s, facing dir. fly = wings spread; neck > 0 lengthens the neck
// (a goose, a heron); legs = how far the legs reach down; beak = beak length as a share of s; curve = a down-curved beak
type BirdO = { dir?: 1 | -1; fly?: boolean; neck?: number; neckCol?: string; legs?: number; beak?: number; beakCol?: string; head?: string; legCol?: string; curve?: number; plump?: number };
const bird = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, o: BirdO = {}) => {
  const d = o.dir ?? 1, neck = o.neck ?? 0, pl = o.plump ?? 1, hx = x + d * s * (0.44 + neck * 0.28), hy = y - s * (0.26 + neck * 0.42), hr = s * 0.17, bk = o.beak ?? 0.22, bc = o.beakCol ?? COL.orange, head = o.head ?? col, lc = o.legCol ?? bc;
  if (o.legs) for (const k of [-1, 1]) { const lx = x + k * s * 0.07, fy = y + o.legs; line(c, [[lx, y + s * 0.2], [lx + d * s * 0.03, fy]], 9, INK); line(c, [[lx, y + s * 0.2], [lx + d * s * 0.03, fy]], 4, lc); line(c, [[lx + d * s * 0.03 - s * 0.1, fy], [lx + d * s * 0.03 + s * 0.12, fy]], 4, lc); }
  if (o.fly) shape(c, () => { c.moveTo(x - d * s * 0.05, y + s * 0.05); c.quadraticCurveTo(x - d * s * 0.45, y + s * 0.35, x - d * s * 0.42, y + s * 0.72); c.quadraticCurveTo(x - d * s * 0.05, y + s * 0.5, x + d * s * 0.18, y + s * 0.15); c.closePath(); }, dk, 5);
  shape(c, () => polyP(c, [[x - d * s * 0.3, y - s * 0.12], [x - d * s * 0.66, y - s * 0.26], [x - d * s * 0.62, y + s * 0.06]]), dk, 5);
  shape(c, () => ell(c, x, y, s * 0.5, s * 0.3 * pl, -d * 0.12), col);
  if (o.fly) shape(c, () => { c.moveTo(x - d * s * 0.02, y - s * 0.12); c.quadraticCurveTo(x - d * s * 0.5, y - s * 0.5, x - d * s * 0.5, y - s * 0.98); c.quadraticCurveTo(x - d * s * 0.05, y - s * 0.7, x + d * s * 0.22, y - s * 0.22); c.closePath(); }, dk, 5);
  else shape(c, () => ell(c, x - d * s * 0.1, y - s * 0.03, s * 0.32, s * 0.17 * pl, -d * 0.25), dk, 4);
  if (neck > 0) { line(c, [[x + d * s * 0.32, y - s * 0.1], [hx, hy]], s * 0.2 + 10, INK); line(c, [[x + d * s * 0.32, y - s * 0.1], [hx, hy]], s * 0.2, o.neckCol ?? head); }
  shape(c, () => ell(c, hx, hy, hr, hr), head);
  if (o.curve) { const p = () => { c.moveTo(hx + d * hr * 0.6, hy - hr * 0.1); c.quadraticCurveTo(hx + d * (hr + s * bk * 0.7), hy - hr * 0.1, hx + d * (hr + s * bk), hy + o.curve! * s); }; c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = hr * 0.5 + 8; c.lineCap = "round"; c.stroke(); c.beginPath(); p(); c.strokeStyle = bc; c.lineWidth = hr * 0.5; c.stroke(); }
  else shape(c, () => polyP(c, [[hx + d * hr * 0.6, hy - hr * 0.34], [hx + d * (hr + s * bk), hy - hr * 0.05], [hx + d * hr * 0.6, hy + hr * 0.34]]), bc, 4);
  shape(c, () => ell(c, hx + d * hr * 0.28, hy - hr * 0.18, hr * 0.3, hr * 0.3), WHITE, 2.5); shape(c, () => ell(c, hx + d * hr * 0.35, hy - hr * 0.18, hr * 0.14, hr * 0.14), INK, 0);
};
// a pen lying on the table, centre (x, y), angle an
const pen = (c: Ctx, x: number, y: number, an: number, len = 220) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len / 2, -14, len * 0.8, 28, 8), COL.blue);
  shape(c, () => polyP(c, [[len * 0.3, -14], [len * 0.5, 0], [len * 0.3, 14]]), COL.steel, 4);
  c.restore();
};
const dottedArrow = (c: Ctx, pts: number[][], col: string, w: number) => { c.save(); c.setLineDash([1, w * 2.4]); line(c, pts, w, col); c.restore(); const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]]; arrow(c, [a, b], col, w); };

// ---------------------------------------------------------------- set-up cards: the Midnight Sun Spin
// 1. a grown-up pushes the skewer down through the orange; the rubber band is round its middle
const sE1_0 = (c: Ctx) => {
  ground(c);
  const P = person(c, 540, 1000, 620, { adult: true, reachL: [484, 735], reachR: [562, 565] });
  const r = 78, ox = P.handL[0] + r - 6, oy = P.handL[1];
  const body = () => ell(c, ox, oy, r, r);
  shape(c, body, COL.orange); shade(c, body, ORANGE_DK, -r * 0.3, -r * 0.3, 0.45); shine(c, [[ox - r * 0.55, oy - r * 0.45], [ox - r * 0.3, oy - r * 0.62]], 8);
  c.beginPath(); c.ellipse(ox, oy, r, r * 0.26, 0, 0, Math.PI); c.strokeStyle = BAND; c.lineWidth = 11; c.lineCap = "round"; c.stroke();
  const hx = P.handR[0], hy = P.handR[1];
  skewer(c, [hx, hy - 22], [hx, oy - r + 4]); skewer(c, [hx, oy + r - 4], [hx, oy + r + 70]);
  arrow(c, [[hx + 110, hy - 130], [hx + 110, hy - 20]]);
};
// 2. the orange with three dots: near the band, halfway up, near the top
const sE1_1 = (c: Ctx) => {
  ground(c); table(c, 820);
  orangeEarth(c, 540, 540, 170, 0, { band: true, dots: true, up: 230, down: 280, clay: true });
  pen(c, 860, 760, -0.25);
};
// 3. a square of paper standing on the table, one corner folded in half and in half again; the skewer leans along the fold
const sE1_2 = (c: Ctx) => {
  ground(c); table(c, 830);
  const cx = 650, cy = 830, t = Math.PI / 8, L = 440;
  shadow(c, 420, 838, 270, 12);
  shape(c, () => polyP(c, [[150, 330], [650, 330], [650, 830], [150, 830]]), COL.paper);
  // the flap: the corner folded in twice, so a narrow wedge lies along the right edge; the first crease at 45 degrees
  const flap = () => polyP(c, [[cx, cy], [cx, cy - L], [cx - Math.sin(t) * L, cy - Math.cos(t) * L]]);
  shape(c, flap, "#efe6d2", 5);
  line(c, [[cx, cy], [cx - Math.sin(Math.PI / 4) * 160, cy - Math.cos(Math.PI / 4) * 160]], 3, COL.grey);
  // the angle it makes with the edge
  c.beginPath(); c.arc(cx, cy, 150, -Math.PI / 2 - t, -Math.PI / 2); c.strokeStyle = RED; c.lineWidth = 8; c.stroke();
  orangeEarth(c, cx - Math.sin(t) * 330, cy - Math.cos(t) * 330, 80, -t, { band: true, up: 210, down: 330 });
};
// 4. a dark room: the torch on a pile of books shines on the orange; the top of the skewer leans towards the torch
const sE1_3 = (c: Ctx) => {
  ground(c, DARK); table(c, 860, COL.woodDk);
  beam(c, 358, 734, 690, 734, 44, 125);
  books(c, 300, 860, 200, 3); torch(c, 230, 734, 0);
  orangeEarth(c, 690, 734, 100, -0.4, { band: true, lit: true, up: 150, down: 137, clay: true });
  curveArrow(c, 690, 734, 215, -Math.PI * 0.42, -Math.PI * 0.68);
};
// 5. the child turns the skewer slowly; the grown-up counts, one hand up, watching a dot go in and out of the light
const sE1_4 = (c: Ctx) => {
  ground(c, DARK);
  person(c, 160, 1000, 640, { adult: true, armR: [-Math.PI * 0.32, -Math.PI * 0.5] });
  person(c, 770, 1000, 560, { reachL: [553, 630] });
  table(c, 860, COL.woodDk);
  beam(c, 383, 734, 600, 740, 44, 95);
  books(c, 330, 860, 190, 3); torch(c, 255, 734, 0);
  orangeEarth(c, 600, 740, 72, -0.4, { band: true, dots: true, lit: true, up: 120, down: 130, clay: true });
  curveArrow(c, 553, 585, 40, Math.PI * 1.15, Math.PI * 1.9);
};

// ---------------------------------------------------------------- set-up cards: the Stepping-Stone Flyway
// 1. six circles in a row joined by arrows: the Start marsh, wetlands 1 to 4, Kerala
const sE2_0 = (c: Ctx) => {
  ground(c); paper(c, 40, 260, 1000, 540);
  flyway(c, 130, 500, 58, 164);
  pen(c, 560, 720, -0.1);
};
// 2. the child puts a paper bird on the Start circle, two beans beside it
const sE2_1 = (c: Ctx) => {
  ground(c);
  paper(c, 450, 700, 600, 200);
  flyway(c, 505, 790, 32, 98);
  const P = person(c, 300, 900, 560, { sit: true, dir: 1, reachR: [528, 770] });
  marker(c, P.handR[0] - 20, P.handR[1] + 24, 52);
  bean(c, 560, 845, 13, 0.4); bean(c, 592, 852, 13, 2.2);
};
// 3. a hand rolls the die: 1 or 2 means a headwind, 3 to 6 a calm sky
const sE2_2 = (c: Ctx) => {
  ground(c);
  hand(c, 250, 640, -0.5, 1.5, SKIN.child, CLOTH.child, true);
  die(c, 520, 420, 96, 5, 0.4);
  for (const k of [0, 1]) { c.beginPath(); c.arc(520, 420, 95 + k * 22, Math.PI * 0.7, Math.PI * 1.05); c.strokeStyle = COL.greyDk; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
  // the key
  paper(c, 640, 240, 400, 620);
  line(c, [[660, 550], [1020, 550]], 4, COL.grey);
  die(c, 720, 395, 70, 1); die(c, 810, 395, 70, 2);
  bird(c, 940, 395, 70, COL.grey, COL.greyDk, { fly: true });
  arrow(c, [[1020, 340], [930, 340]], RED, 7); arrow(c, [[1020, 450], [930, 450]], RED, 7);
  die(c, 700, 660, 54, 3); die(c, 770, 660, 54, 4); die(c, 700, 740, 54, 5); die(c, 770, 740, 54, 6);
  sun(c, 950, 640, 38);
  bird(c, 920, 770, 70, COL.grey, COL.greyDk, { fly: true });
};
// 4. round 2: wetland 3 is crossed out and the bird must fly from 2 to 4 in one go
const sE2_3 = (c: Ctx) => {
  ground(c); paper(c, 40, 260, 1000, 540);
  flyway(c, 130, 520, 58, 164, { crossed: 3, jump: [2, 4] });
  marker(c, 458, 520, 60, COL.cloth);
};

// ---------------------------------------------------------------- title pictures
// the Midnight Sun model: the torch Sun lights one side of the tilted orange Earth; it spins on its skewer
const fE1 = (c: Ctx) => {
  ground(c, DARK); table(c, 880, COL.woodDk);
  beam(c, 318, 714, 700, 700, 48, 180);
  books(c, 260, 880, 200, 4); torch(c, 190, 714, 0);
  orangeEarth(c, 700, 700, 150, -0.4, { band: true, dots: true, lit: true, up: 200, down: 195, clay: true });
  curveArrow(c, 700, 700, 290, -Math.PI * 0.4, -Math.PI * 0.72);
};
// the Stepping-Stone Flyway in play: paper birds on the wetlands, beans of fuel, a die
const fE2 = (c: Ctx) => {
  ground(c); paper(c, 40, 230, 1000, 620);
  flyway(c, 130, 440, 56, 164);
  marker(c, 130, 420, 60, COL.cloth); marker(c, 300, 420, 60, COL.cloth); marker(c, 630, 420, 60, COL.cloth);
  const r = rnd(3);
  for (const x of [130, 294, 622]) for (let k = 0; k < 2; k++) bean(c, x - 16 + k * 32, 560 + r() * 8, 13, r() * 3);
  die(c, 300, 740, 90, 3, -0.2);
  for (let i = 0; i < 9; i++) bean(c, 720 + (i % 5) * 44 + r() * 8, 720 + Math.floor(i / 5) * 40 + r() * 10, 14, r() * 3);
};
// sorting eight birds into four boxes: stays all year (a house), the northern winter (a snowflake), the warm months (a sun), passing through (an arrow)
const fA1 = (c: Ctx) => {
  ground(c);
  const card = (x: number, y: number, draw: () => void) => { shape(c, () => rrect(c, x, y, 150, 120, 8), WHITE, 4); draw(); };
  const boxes: [string, (x: number, y: number) => void][] = [
    [COL.yellow, (x, y) => { shape(c, () => polyP(c, [[x - 38, y + 4], [x, y - 30], [x + 38, y + 4]]), COL.red, 4); shape(c, () => rrect(c, x - 28, y + 4, 56, 36, 3), COL.cloth, 4); }],
    [COL.sky, (x, y) => { for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; line(c, [[x - Math.cos(a) * 34, y - Math.sin(a) * 34], [x + Math.cos(a) * 34, y + Math.sin(a) * 34]], 6, COL.blueDk); } }],
    [COL.orange, (x, y) => sun(c, x, y, 20)],
    [COL.greenLt, (x, y) => arrow(c, [[x - 40, y], [x + 40, y]], INK, 7)],
  ];
  boxes.forEach(([col, ic], i) => {
    const x = 60 + i * 250;
    shape(c, () => rrect(c, x, 300, 220, 330, 10), col, 5);
    shape(c, () => rrect(c, x + 10, 150, 200, 130, 10), COL.paper, 5); ic(x + 110, 215);
  });
  const birds: [number, string, string, Partial<BirdO>][] = [
    [0, COL.black, INK, { head: COL.black }], [1, COL.pink, COL.black, {}], [2, COL.grey, COL.greyDk, { head: COL.greyDk }], [3, COL.steelDk, COL.black, { beak: 0.15 }],
  ];
  birds.forEach(([i, col, dk, o]) => card(60 + i * 250 + 35, 480, () => bird(c, 60 + i * 250 + 105, 540, 70, col, dk, { legs: 34, ...o })));
  const left: [string, string, Partial<BirdO>][] = [[COL.brown, BROWN_DK, { beak: 0.4 }], [COL.blue, COL.blueDk, {}], [COL.green, COL.greenDk, {}], [COL.red, BROWN_DK, { head: COL.black }]];
  left.forEach(([col, dk, o], i) => card(130 + i * 230, 720, () => bird(c, 200 + i * 230, 780, 70, col, dk, { legs: 34, ...o })));
};
// a tagged goose's weekly latitude: flat steps are stopovers, steep slopes are flights
const fA2 = (c: Ctx) => {
  ground(c); paper(c, 40, 40, 1000, 1000);
  const X = (w: number) => 190 + w * 72, Y = (lat: number) => 880 - (lat - 20) * 22;
  for (let w = 0; w <= 11; w++) line(c, [[X(w), Y(50)], [X(w), Y(20)]], 2, COL.grey);
  for (let lat = 20; lat <= 50; lat += 5) line(c, [[X(0), Y(lat)], [X(11), Y(lat)]], 2, COL.grey);
  line(c, [[X(0), Y(52)], [X(0), Y(20)], [X(11.4), Y(20)]], 6);
  for (let w = 0; w <= 11; w++) write(c, String(w), X(w) - (w > 9 ? 24 : 12), 900, 36, INK, 5);
  for (const lat of [20, 30, 40, 50]) write(c, String(lat), 100, Y(lat) - 16, 34, INK, 5);
  const lat = [20, 20, 20, 28, 35, 35, 35, 35, 42, 48, 48, 48], pts = lat.map((l, w) => [X(w), Y(l)]);
  line(c, pts, 8, COL.blueDk);
  pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, 11, 11), COL.blue, 4));
  // stopovers over the flat parts, a flying goose over each slope
  for (const w of [1, 6, 10.5]) reeds(c, X(w), Y(lat[Math.floor(w)]) - 46, 44);
  for (const w of [3.5, 8.5]) bird(c, X(w) - 70, Y(lat[Math.floor(w)]) - 40, 70, GOOSE, GOOSE_DK, { fly: true, neck: 0.6, head: WHITE });
};
// the chain of energy: the Arctic Sun, plants, worms, a godwit feeding, a fat godwit, a godwit over the sea
const fA3 = (c: Ctx) => {
  ground(c);
  const box = (x: number, y: number, draw: () => void) => { shape(c, () => rrect(c, x, y, 280, 270, 12), COL.paper, 5); c.save(); c.beginPath(); rrect(c, x, y, 280, 270, 12); c.clip(); draw(); c.restore(); };
  const godwit = (x: number, y: number, s: number, o: Partial<BirdO> = {}) => bird(c, x, y, s, COL.brown, BROWN_DK, { beak: 0.75, beakCol: COL.pink, legCol: COL.black, ...o });
  box(60, 120, () => { sun(c, 200, 230, 60); shape(c, () => ell(c, 200, 400, 180, 30), WHITE, 0); });
  box(400, 120, () => { c.fillStyle = COL.water; c.fillRect(400, 300, 280, 90); for (let i = 0; i < 6; i++) { const x = 430 + i * 44; line(c, [[x, 320], [x + 10, 220 - (i % 2) * 30]], 9, COL.leafDk); } });
  box(740, 120, () => { for (let i = 0; i < 4; i++) { const x = 780 + i * 60, y = 240 + (i % 2) * 50; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 20, y - 40, x + 40, y); c.quadraticCurveTo(x + 60, y + 40, x + 80, y); c.strokeStyle = INK; c.lineWidth = 20; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.pink; c.lineWidth = 12; c.stroke(); } shape(c, () => { c.moveTo(790, 350); c.quadraticCurveTo(840, 280, 890, 350); c.closePath(); }, COL.steel, 4); });
  box(60, 560, () => { c.fillStyle = MUD; c.fillRect(60, 730, 280, 100); godwit(200, 660, 120, { legs: 70 }); const worm = () => { c.moveTo(362, 630); c.quadraticCurveTo(392, 650, 376, 690); }; c.beginPath(); worm(); c.strokeStyle = INK; c.lineWidth = 14; c.lineCap = "round"; c.stroke(); c.beginPath(); worm(); c.strokeStyle = COL.pink; c.lineWidth = 8; c.stroke(); });
  box(400, 560, () => { c.fillStyle = MUD; c.fillRect(400, 730, 280, 100); godwit(540, 650, 130, { legs: 80, plump: 1.6 }); });
  box(740, 560, () => { c.fillStyle = COL.water; c.fillRect(740, 740, 280, 90); for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(770 + i * 60, 760, 26, Math.PI, 0); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); } godwit(880, 660, 130, { fly: true }); });
  arrow(c, [[345, 255], [395, 255]], INK, 8); arrow(c, [[685, 255], [735, 255]], INK, 8);
  arrow(c, [[880, 395], [880, 470], [200, 470], [200, 552]], INK, 8);
  arrow(c, [[345, 695], [395, 695]], INK, 8); arrow(c, [[685, 695], [735, 695]], INK, 8);
};
// the Mudflat Buffet: lentil worms hidden near the top and the bottom of the rice; a teaspoon is a plover's short bill, chopsticks a curlew's long one
const fP1 = (c: Ctx) => {
  ground(c);
  // the two birds on their cards
  shape(c, () => rrect(c, 160, 130, 300, 230, 10), WHITE, 5); bird(c, 300, 250, 110, COL.brown, BROWN_DK, { legs: 60, beak: 0.2, beakCol: COL.black, head: WHITE });
  shape(c, () => rrect(c, 620, 130, 300, 230, 10), WHITE, 5); bird(c, 740, 240, 120, COL.brown, BROWN_DK, { legs: 70, beak: 0.9, curve: 0.3, beakCol: COL.black });
  // the tray, cut open from the side: rice 4 cm deep
  shadow(c, 560, 880, 420, 20);
  shape(c, () => polyP(c, [[120, 500], [960, 500], [960, 870], [120, 870]]), COL.brown);
  shape(c, () => polyP(c, [[150, 520], [930, 520], [930, 850], [150, 850]]), "#f3ead6", 4);
  const r = rnd(5); c.fillStyle = "#e4d8bd"; for (let i = 0; i < 260; i++) { c.beginPath(); ell(c, 155 + r() * 770, 525 + r() * 320, 7, 3, r() * 3); c.fill(); }
  for (let i = 0; i < 5; i++) lentil(c, 230 + i * 150 + (i % 2) * 30, 560, 13);
  for (let i = 0; i < 5; i++) lentil(c, 270 + i * 140, 810, 13);
  // the teaspoon dipping into the top; the chopsticks probing to the bottom
  line(c, [[240, 380], [330, 545]], 20, INK); line(c, [[240, 380], [330, 545]], 12, COL.steel);
  shape(c, () => ell(c, 340, 560, 40, 26, 0.6), COL.steel, 5);
  for (const dx of [0, 26]) { line(c, [[760 + dx, 380], [700 + dx * 0.6, 800]], 14, INK); line(c, [[760 + dx, 380], [700 + dx * 0.6, 800]], 7, COL.wood); }
  arrow(c, [[360, 420], [360, 500]], RED, 8); arrow(c, [[860, 560], [860, 760]], RED, 8);
};
// a bar-headed goose over the snowy Himalaya: a dotted arrow going out, another coming back
const tGoose = (c: Ctx) => {
  ground(c, COL.sky);
  const peaks: number[][] = [[0, 900], [120, 640], [240, 760], [380, 540], [520, 720], [660, 480], [800, 680], [940, 560], [1080, 760], [1080, 1080], [0, 1080]];
  shape(c, () => polyP(c, peaks), COL.steelDk);
  for (const [px, py] of [[120, 640], [380, 540], [660, 480], [940, 560]]) shape(c, () => polyP(c, [[px, py], [px + 55, py + 95], [px + 30, py + 85], [px, py + 110], [px - 30, py + 85], [px - 55, py + 95]]), WHITE, 4);
  dottedArrow(c, [[80, 260], [300, 150], [600, 150], [900, 300]], RED, 10);
  dottedArrow(c, [[960, 440], [700, 380], [400, 380], [150, 470]], COL.blueDk, 10);
  bird(c, 500, 300, 200, GOOSE, GOOSE_DK, { fly: true, neck: 0.7, head: WHITE, beak: 0.3 });
  line(c, [[562, 208], [588, 222]], 6, INK); line(c, [[566, 236], [592, 244]], 6, INK);
};
// a house crow on a window grille in the sun
const tCrow = (c: Ctx) => {
  ground(c, "#f6e9c9");
  shape(c, () => rrect(c, 180, 120, 720, 840, 14), COL.wood);
  shape(c, () => rrect(c, 230, 170, 620, 740, 6), COL.sky, 5);
  sun(c, 330, 280, 70);
  for (const x of [380, 540, 700]) { line(c, [[x, 170], [x, 910]], 16, INK); line(c, [[x, 170], [x, 910]], 8, COL.steelDk); }
  for (const y of [420, 660]) { line(c, [[230, y], [850, y]], 16, INK); line(c, [[230, y], [850, y]], 8, COL.steelDk); }
  bird(c, 560, 580, 250, COL.black, INK, { dir: -1, legs: 70, neck: 0.3, neckCol: COL.grey, head: COL.black, beakCol: COL.black, legCol: COL.black });
};
// a marsh: reeds, shallow water, a heron standing in it
const tMarsh = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = COL.water; c.fillRect(0, 620, D, D); line(c, [[0, 620], [D, 620]], 6);
  for (let i = 0; i < 14; i++) { const x = 40 + i * 80 + (i % 3) * 10; if (x > 380 && x < 760) continue; reeds(c, x, 640 + (i % 2) * 40, 230 + (i % 3) * 30, 2, false); }
  bird(c, 560, 560, 230, COL.grey, COL.greyDk, { neck: 1.3, legs: 250, beak: 0.6, beakCol: COL.yellow, head: WHITE, legCol: COL.yellow });
  shape(c, () => polyP(c, [[724, 342], [688, 316], [738, 336]]), INK, 4);
  for (const [x, y, w] of [[520, 830, 70], [600, 840, 60], [560, 890, 90]]) { c.beginPath(); ell(c, x, y, w, 10); c.strokeStyle = COL.drop; c.lineWidth = 4; c.stroke(); }
};
// ringing: a grown-up holds a small bird gently while a numbered ring is closed round her leg
const tRing = (c: Ctx) => {
  ground(c);
  const P = person(c, 540, 1000, 620, { adult: true, reachL: [480, 720], reachR: [565, 730] });
  const [bx, by] = [P.handL[0] + 6, P.handL[1] - 52];
  bird(c, bx, by, 104, COL.brown, BROWN_DK, { legs: 42, head: COL.brown, beakCol: COL.black, legCol: COL.pink });
  // the ring on her leg, the small pliers from the other hand closing it
  shape(c, () => rrect(c, bx + 3, by + 46, 12, 12, 2), COL.steel, 2);
  line(c, [[P.handR[0], P.handR[1]], [bx + 18, by + 50]], 10, INK); line(c, [[P.handR[0], P.handR[1]], [bx + 18, by + 50]], 5, COL.steel);
  line(c, [[P.handR[0] - 4, P.handR[1] + 8], [bx + 20, by + 58]], 10, INK); line(c, [[P.handR[0] - 4, P.handR[1] + 8], [bx + 20, by + 58]], 5, COL.steel);
  // close up: the leg with the numbered ring
  shape(c, () => ell(c, 860, 290, 160, 160), WHITE, 6);
  line(c, [[860, 160], [860, 390]], 34, INK); line(c, [[860, 160], [860, 390]], 24, COL.pink);
  for (const dx of [-40, 0, 40]) { line(c, [[860, 390], [860 + dx, 430]], 20, INK); line(c, [[860, 390], [860 + dx, 430]], 12, COL.pink); }
  shape(c, () => rrect(c, 826, 240, 68, 80, 8), COL.steel, 5);
  write(c, "12", 836, 258, 44, INK, 5);
  line(c, [[740, 400], [bx + 8, by + 44]], 4, COL.greyDk);
};

export const ic_animalBehaviourMigrationL4 = cards("sci.animal-behaviour.migration.L4", [
  sE1_0, sE1_1, sE1_2, sE1_3, sE1_4, sE2_0, sE2_1, sE2_2, sE2_3,
  fE1, fE2, fA1, fA2, fA3, fP1, tGoose, tCrow, tMarsh, tRing,
]);
