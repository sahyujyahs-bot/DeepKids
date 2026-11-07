import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, person, write, cards } from "./flatKit";

// AIR PUSHES (sci.air.air-around-us.L4) · set-up cards for the bottle with a hole and the bottle that squashes
// itself, then the flow cards and two term cards. Same child and grown-up as the rest of the kit.

const PI = Math.PI;
const PLASTIC = "rgba(222,238,250,0.5)", CAP = "#d7372b", CAPDK = "#a8281f", TEAL = COL.teal, TEALDK = COL.tealDk;

// ---------------------------------------------------------------- letters A B C and ? for labels
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.64], [0.48, 0.64]]],
  B: [[[0.02, 0], [0.02, 1]], [[0.02, 0], [0.38, 0], [0.54, 0.12], [0.54, 0.38], [0.38, 0.5], [0.02, 0.5]], [[0.38, 0.5], [0.58, 0.62], [0.58, 0.88], [0.4, 1], [0.02, 1]]],
  C: [[[0.58, 0.15], [0.42, 0], [0.16, 0.04], [0.02, 0.3], [0.02, 0.7], [0.16, 0.96], [0.42, 1], [0.58, 0.85]]],
  "?": [[[0.05, 0.2], [0.3, 0], [0.55, 0.2], [0.5, 0.45], [0.3, 0.6], [0.3, 0.75]], [[0.3, 0.95], [0.3, 1]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col = INK, w = 7) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
// a white paper label with one big letter, centred at (x, y)
const tag = (c: Ctx, ch: string, x: number, y: number, s = 1) => {
  shape(c, () => rrect(c, x - 42 * s, y - 36 * s, 84 * s, 72 * s, 8 * s), WHITE, 5);
  letter(c, ch, x - 20 * s, y - 24 * s, 48 * s, INK, 7 * s);
};

// ---------------------------------------------------------------- the bottle
type Side = "plain" | "crumpled" | "swollen" | "squashed";
type BottleOpts = { cap?: "on" | "off"; fill?: number; holes?: number[]; side?: Side; label?: string; liquid?: string; steam?: boolean; noShadow?: boolean };
// a clear plastic bottle standing with its bottom centre at (x, y), width w, height h (cap included).
// holes = heights above the bottom, on the left side. Returns the hole points.
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, o: BottleOpts = {}): number[][] => {
  const bw = w / 2, nw = w * 0.2, bodyTop = y - h * 0.72, neckY = y - h * 0.86, mouthY = y - h * 0.92, capH = h * 0.07, side = o.side ?? "plain";
  if (!o.noShadow) shadow(c, x + w * 0.15, y + 6, w * 0.6, w * 0.12);
  // one side of the body, from (sx, y0) up to (sx, bodyTop); s = -1 left, 1 right
  const wall = (s: number, up: boolean) => {
    const sx = x + s * bw, a = up ? y - w * 0.12 : bodyTop, b = up ? bodyTop : y - w * 0.12;
    if (side === "plain") { c.lineTo(sx, b); return; }
    if (side === "swollen") { c.quadraticCurveTo(sx + s * w * 0.2, (a + b) / 2, sx, b); return; }
    if (side === "squashed") { c.quadraticCurveTo(sx - s * w * 0.28, (a + b) / 2, sx, b); return; }
    // crumpled: dents of different depths, mirrored differently on each side
    const dents = s < 0 ? [0.04, 0.22, 0.08, 0.26, 0.1, 0.2, 0.03] : [0.08, 0.2, 0.05, 0.25, 0.12, 0.22, 0.06];
    const n = dents.length;
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, ty = a + (b - a) * t, d = dents[up ? i : n - 1 - i]; c.lineTo(sx - s * w * d, ty); }
    c.lineTo(sx, b);
  };
  const body = () => {
    c.moveTo(x - bw, y - w * 0.12); c.quadraticCurveTo(x - bw, y, x - bw + w * 0.12, y); c.lineTo(x + bw - w * 0.12, y); c.quadraticCurveTo(x + bw, y, x + bw, y - w * 0.12);
    wall(1, true);
    c.quadraticCurveTo(x + bw, neckY, x + nw, neckY); c.lineTo(x + nw, mouthY); c.lineTo(x - nw, mouthY); c.lineTo(x - nw, neckY); c.quadraticCurveTo(x - bw, neckY, x - bw, bodyTop);
    wall(-1, false);
    c.closePath();
  };
  if (o.fill) {
    const ly = y - (y - bodyTop) * o.fill, liquid = o.liquid ?? COL.water;
    c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = liquid; c.fillRect(x - bw - 5, ly, w + 10, y - ly + 5); c.restore();
    shape(c, () => ell(c, x, ly, bw * 0.92, w * 0.07), COL.drop, 0);
  }
  shape(c, body, PLASTIC, 5);
  shade(c, body, COL.steelDk, w * 0.22, 0, 0.22);
  shine(c, [[x - bw * 0.62, bodyTop + h * 0.08], [x - bw * 0.62, y - h * 0.12]], 7);
  // a few ridges round the base
  line(c, [[x - bw * 0.8, y - h * 0.09], [x + bw * 0.8, y - h * 0.09]], 3, COL.glassEdge);
  if (o.cap === "on") {
    shape(c, () => rrect(c, x - nw - 6, mouthY - capH, nw * 2 + 12, capH + 4, 5), CAP, 5);
    for (let i = -1; i <= 1; i++) line(c, [[x + i * nw * 0.6, mouthY - capH + 8], [x + i * nw * 0.6, mouthY - 6]], 3, CAPDK);
  } else {
    shape(c, () => ell(c, x, mouthY, nw, nw * 0.3), COL.glassEdge, 5);
    shape(c, () => ell(c, x, mouthY, nw * 0.6, nw * 0.16), INK, 0);
  }
  const holes: number[][] = [];
  for (const hh of o.holes ?? []) { const hx = x - bw, hy = y - hh; shape(c, () => ell(c, hx, hy, 6, 9), INK, 0); holes.push([hx, hy]); }
  if (o.steam) steam(c, x, mouthY - 10, 0.8);
  if (o.label) tag(c, o.label, x, y - h * 0.4, w / 180);
  return holes;
};
// a bottle cap lying on the table at (x, y)
const capLying = (c: Ctx, x: number, y: number, r = 34) => {
  shadow(c, x + 4, y + 10, r, r * 0.3);
  shape(c, () => rrect(c, x - r, y - r * 0.55, r * 2, r * 0.55, 5), CAPDK, 5);
  shape(c, () => ell(c, x, y - r * 0.55, r, r * 0.32), CAP, 5);
};
// a tightening arrow round the cap: a red arc from the left over the top to the right
const twist = (c: Ctx, x: number, y: number, r: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const a = PI * 1.15 + (i / 8) * PI * 0.75; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 0.5]); }
  arrow(c, pts, RED, 8);
};
// wisps of steam rising from (x, y)
const steam = (c: Ctx, x: number, y: number, s = 1) => {
  for (const dx of [-28, 0, 28]) {
    const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([x + dx * s + Math.sin(t * PI * 2 + dx) * 12 * s, y - t * 120 * s]); }
    line(c, pts, 15 * s, INK); line(c, pts, 8 * s, WHITE);
  }
};

// ---------------------------------------------------------------- water falling
// a jet from (x0, y0): dx sideways, dy down, bending with gravity; returns the end point
const jet = (c: Ctx, x0: number, y0: number, dx: number, dy: number, w = 12) => {
  const pts: number[][] = []; for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push([x0 + dx * t, y0 + dy * t * t]); }
  line(c, pts, w + 8, INK); line(c, pts, w, COL.water); line(c, pts, w * 0.3, COL.drop);
  return pts[pts.length - 1];
};
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.1, y - r * 0.3, x + r, y + r * 0.2); c.arc(x, y + r * 0.2, r, 0, PI); c.quadraticCurveTo(x - r * 1.1, y - r * 0.3, x, y - r * 1.6); c.closePath(); }, COL.water, 4);

// ---------------------------------------------------------------- basin, towel, clock, jug
// a wide plastic tub, rim centre (x, y), rim half-width rx, depth below the rim; back and front halves so things can stand in it
const basinBack = (c: Ctx, x: number, y: number, rx: number, depth: number, water = false) => {
  const ry = rx * 0.22;
  shadow(c, x + rx * 0.1, y + depth + 8, rx * 0.85, ry * 0.8);
  shape(c, () => ell(c, x, y, rx, ry), TEALDK, 5);
  if (water) shape(c, () => ell(c, x, y + ry * 0.08, rx * 0.9, ry * 0.76), COL.water, 0);
};
const basinFront = (c: Ctx, x: number, y: number, rx: number, depth: number) => {
  const ry = rx * 0.22, bx = rx * 0.8, by = y + depth;
  const body = () => { c.moveTo(x - rx, y); c.lineTo(x - bx, by - ry * 0.6); c.quadraticCurveTo(x - bx, by + ry * 0.6, x - bx + rx * 0.12, by + ry * 0.6); c.lineTo(x + bx - rx * 0.12, by + ry * 0.6); c.quadraticCurveTo(x + bx, by + ry * 0.6, x + bx, by - ry * 0.6); c.lineTo(x + rx, y); c.closePath(); };
  shape(c, body, TEAL); shade(c, body, TEALDK, rx * 0.35, 0);
  shape(c, () => { c.ellipse(x, y, rx, ry, 0, 0, PI); c.closePath(); }, TEAL, 5);
  line(c, [[x - rx, y], [x + rx, y]], 5);
  shine(c, [[x - rx * 0.78, y + ry * 1.2], [x - rx * 0.7, by - ry]], 7);
};
const basin = (c: Ctx, x: number, y: number, rx: number, depth: number, water = false) => { basinBack(c, x, y, rx, depth, water); basinFront(c, x, y, rx, depth); };
// a folded towel, centred at (x, y)
const towel = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 14, y + h / 2 + 8, w / 2, h * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 18), COL.cloth, 5);
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 18), COL.grey, w * 0.04, h * 0.3, 0.35);
  line(c, [[x - w / 2 + 10, y - h / 2 + h * 0.45], [x + w / 2 - 10, y - h / 2 + h * 0.45]], 4, COL.grey);
  for (const dx of [-0.32, 0.32]) line(c, [[x + dx * w, y - h / 2 + 8], [x + dx * w, y + h / 2 - 8]], 5, COL.blue);
};
// a round clock standing on the table, centre (x, y)
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 6, y + r + 4, r * 0.8, r * 0.14);
  shape(c, () => polyP(c, [[x - r * 0.5, y + r * 0.85], [x + r * 0.5, y + r * 0.85], [x + r * 0.62, y + r + 2], [x - r * 0.62, y + r + 2]]), COL.greyDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.blue, 6);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2, big = i % 3 === 0; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * (big ? 0.56 : 0.63), y + Math.sin(a) * r * (big ? 0.56 : 0.63)]], big ? 5 : 3); }
  line(c, [[x, y], [x + r * 0.3, y - r * 0.3]], 7); line(c, [[x, y], [x - r * 0.1, y - r * 0.55]], 6);
  line(c, [[x, y + r * 0.12], [x + r * 0.5, y - r * 0.4]], 4, RED);
  shape(c, () => ell(c, x, y, 7, 7), INK, 0);
};
// a steel jug: its handle grip at (x, y), tilted by ang (0 = upright); returns the spout tip
const jug = (c: Ctx, x: number, y: number, ang: number, hot = false): number[] => {
  const HX = -128, HY = -95;
  c.save(); c.translate(x, y); c.rotate(ang); c.translate(-HX, -HY);
  const body = () => polyP(c, [[-72, 0], [72, 0], [84, -172], [114, -192], [92, -165], [-84, -172]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 36, 0);
  shape(c, () => ell(c, 0, -172, 84, 16), COL.steelIn, 5);
  line(c, [[-78, -150], [-130, -120], [-130, -70], [-78, -40]], 22, INK); line(c, [[-78, -150], [-130, -120], [-130, -70], [-78, -40]], 12, COL.steel);
  if (hot && ang === 0) steam(c, 0, -190, 0.8);
  c.restore();
  const lx = 114 - HX, ly = -192 - HY;
  return [x + Math.cos(ang) * lx - Math.sin(ang) * ly, y + Math.sin(ang) * lx + Math.cos(ang) * ly];
};
// a big bowl of cold water, rim centre (x, y)
const coldBowl = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.6, r * 0.8, r * 0.14);
  const b = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); };
  shape(c, b, COL.steel); shade(c, b, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * 0.22), COL.water, 5);
  for (const [dx, dy] of [[-0.4, 0], [0.1, -0.06], [0.45, 0.04]]) shape(c, () => rrect(c, x + dx * r - 16, y + dy * r * 0.2 - 14, 32, 26, 5), "rgba(255,255,255,0.8)", 3);
};

// ---------------------------------------------------------------- hands in close-up
// the kit's gripping hand placed so that the held thing's middle is at (hx, hy); an = where the fingers point;
// mirror = the hand comes in from the right (thumb still on top)
const grip = (c: Ctx, hx: number, hy: number, an: number, s: number, adult = false, mirror = false, open = false) => {
  c.save(); c.translate(hx, hy); if (mirror) c.scale(-1, 1); c.rotate(an); c.scale(s, s);
  hand(c, -70, 0, 0, 1, adult ? SKIN.adult : SKIN.child, adult ? CLOTH.adult : CLOTH.child, open);
  c.restore();
};
// a hand with the first finger out, its fingertip exactly at (tx, ty), pointing at angle an
const pointHand = (c: Ctx, tx: number, ty: number, an: number, s: number, adult = false, mirror = false) => {
  const skin = adult ? SKIN.adult : SKIN.child, sleeve = adult ? CLOTH.adult : CLOTH.child, dk = adult ? SKIN.adultDk : SKIN.childDk;
  c.save(); c.translate(tx, ty); if (mirror) c.scale(-1, 1); c.rotate(an); c.scale(s, s); c.translate(-112, 22);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), sleeve, 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, skin, 6);
  for (let k = 3; k >= 1; k--) shape(c, () => rrect(c, 38, -30 + k * 17, 38, 17, 8.5), skin, 5);
  shape(c, () => rrect(c, 34, -30, 78, 16, 8), skin, 5);
  shape(c, () => { c.moveTo(-4, -30); c.quadraticCurveTo(22, -60, 52, -50); c.quadraticCurveTo(64, -44, 50, -34); c.quadraticCurveTo(26, -32, 12, -18); c.closePath(); }, skin, 5);
  line(c, [[20, 8], [30, 16]], 3, dk);
  c.restore();
};
// a sewing needle from the grip point out to its tip at (tx, ty), pointing at angle an
const needle = (c: Ctx, tx: number, ty: number, an: number, len: number) => {
  const bx = tx - Math.cos(an) * len, by = ty - Math.sin(an) * len;
  line(c, [[bx, by], [tx, ty]], 11, INK); line(c, [[bx, by], [tx - Math.cos(an) * 8, ty - Math.sin(an) * 8]], 5, COL.steelIn);
  shape(c, () => ell(c, bx, by, 9, 6, an), COL.steelIn, 4);
};
// ================================================================ e1 · the bottle with a hole
const E1 = { w: 180, h: 400, hole: 70, x: 560, y: 600, basinX: 500, basinY: 800, basinR: 320, basinD: 180 };
// 1. bottle lying on a folded towel, the grown-up pushing a needle through its side near the bottom
const e1s0 = (c: Ctx) => {
  ground(c);
  towel(c, 540, 690, 860, 210);
  shadow(c, 520, 712, 300, 22);
  c.save(); c.translate(230, 600); c.rotate(PI / 2); bottle(c, 0, 0, 200, 560, { cap: "on", noShadow: true }); c.restore();
  // the needle goes in 4 cm from the bottom end, on the upper side of the lying bottle
  const hx = 230 + 90, hy = 600 - 100, an = 1.9;
  shape(c, () => ell(c, hx, hy, 7, 9), INK, 0);
  needle(c, hx, hy, an, 230);
  grip(c, hx - Math.cos(an) * 150, hy - Math.sin(an) * 150, an, 1.5, true);
  // the push: along the needle, into the bottle
  const ox = hx - Math.cos(an) * 190 + Math.sin(an) * 150, oy = hy - Math.sin(an) * 190 - Math.cos(an) * 150;
  arrow(c, [[ox, oy], [ox + Math.cos(an) * 120, oy + Math.sin(an) * 120]], RED, 10);
};
// the held bottle over the basin, used by cards 2 to 5
const heldBottle = (c: Ctx, o: BottleOpts, pointFinger: "on" | "lifted" | "none", withClock: boolean, stream: boolean) => {
  ground(c);
  basin(c, E1.basinX, E1.basinY, E1.basinR, E1.basinD, true);
  if (withClock) clock(c, 930, 880, 92);
  const holes = bottle(c, E1.x, E1.y, E1.w, E1.h, { noShadow: true, ...o });
  const [hx, hy] = holes[0];
  if (stream) jet(c, hx - 2, hy, -140, 270, 12);
  if (pointFinger === "lifted") { drop(c, hx - 10, hy + 50, 11); drop(c, hx - 16, hy + 105, 9); drop(c, hx - 20, hy + 150, 7); }
  grip(c, E1.x + 10, E1.y - E1.h * 0.5, 0, 1.4, false, true);
  if (pointFinger === "on") pointHand(c, hx + 6, hy, 0, 1.3);
  if (pointFinger === "lifted") pointHand(c, hx - 95, hy + 10, 0, 1.3);
  return holes;
};
const e1s1 = (c: Ctx) => heldBottle(c, { cap: "on", fill: 0.75, holes: [E1.hole] }, "on", false, false);
const e1s2 = (c: Ctx) => heldBottle(c, { cap: "on", fill: 0.72, holes: [E1.hole] }, "lifted", true, false);
const e1s3 = (c: Ctx) => { heldBottle(c, { cap: "off", fill: 0.6, holes: [E1.hole] }, "none", true, true); capLying(c, 150, 1000); };
const e1s4 = (c: Ctx) => {
  const holes = heldBottle(c, { cap: "on", fill: 0.55, holes: [E1.hole, 330] }, "none", false, true);
  const [ax, ay] = holes[1];
  arrow(c, [[ax - 130, ay], [ax - 22, ay]], COL.blueDk, 8);
};

// ================================================================ e2 · the bottle that squashes itself
const E2 = { w: 150, h: 340 };
// 1. three bottles A, B, C in a row; a jug of hot water and a bowl of cold water in front
const e2s0 = (c: Ctx) => {
  ground(c);
  ["A", "B", "C"].forEach((L, i) => bottle(c, 330 + i * 210, 690, E2.w, E2.h, { cap: "off", label: L }));
  jug(c, 100, 930, 0, true);
  coldBowl(c, 880, 880, 170);
};
// 2. the grown-up pours hot water into bottle A, steam coming out
const e2s1 = (c: Ctx) => {
  ground(c);
  const bx = 470, by = 880;
  bottle(c, bx, by, 170, 400, { cap: "off", fill: 0.12, label: "A", steam: true });
  const [sx, sy] = jug(c, 240, 230, 0.95);
  jet(c, sx, sy, bx - sx, by - 400 * 0.92 + 40 - sy, 10);
  grip(c, 240, 230, 0.35, 1.4, true);
  grip(c, bx + 10, by - 290, 0, 1.4, true, true);
  // the swirl: round the bottom of the bottle
  const sw: number[][] = []; for (let i = 0; i <= 8; i++) { const a = PI * 0.75 + (i / 8) * PI * 1.1; sw.push([bx + Math.cos(a) * 125, by - 60 + Math.sin(a) * 34]); }
  arrow(c, sw, RED, 8);
};
// 3. bottle A capped tight at once; bottle C stays open
const e2s2 = (c: Ctx) => {
  ground(c);
  bottle(c, 340, 840, 190, 440, { cap: "on", label: "A" });
  twist(c, 340, 840 - 440 * 0.99 - 20, 90);
  bottle(c, 740, 840, 190, 440, { cap: "off", label: "C", steam: true });
  capLying(c, 930, 860);
};
// 4. all three stand in cold water; A crumples
const e2s3 = (c: Ctx) => {
  ground(c);
  basinBack(c, 540, 700, 430, 250, true);
  bottle(c, 290, 760, 150, 360, { cap: "on", label: "A", side: "crumpled", noShadow: true });
  bottle(c, 540, 760, 150, 360, { cap: "on", label: "B", noShadow: true });
  bottle(c, 790, 760, 150, 360, { cap: "off", label: "C", noShadow: true });
  basinFront(c, 540, 700, 430, 250);
};

// ================================================================ flow cards
// e1: cap on, the water stops; cap off, it runs
const flowE1 = (c: Ctx) => {
  ground(c);
  basin(c, 540, 820, 460, 190, true);
  const a = bottle(c, 330, 600, 170, 380, { cap: "on", fill: 0.7, holes: [66], noShadow: true });
  drop(c, a[0][0] - 4, a[0][1] + 18, 10);
  const b = bottle(c, 790, 600, 170, 380, { cap: "off", fill: 0.6, holes: [66], noShadow: true });
  jet(c, b[0][0] - 2, b[0][1], -120, 250, 12);
  grip(c, 330, 420, PI / 2, 1.3); grip(c, 790, 420, PI / 2, 1.3);
  capLying(c, 980, 1010);
};
// e2: the capped bottle crumples in cold water: the outside air pushes in
const flowE2 = (c: Ctx) => {
  ground(c);
  basinBack(c, 540, 800, 400, 220, true);
  bottle(c, 540, 860, 230, 560, { cap: "on", label: "A", side: "crumpled", noShadow: true });
  basinFront(c, 540, 800, 400, 220);
  for (const s of [-1, 1]) for (const y of [440, 560, 680]) arrow(c, [[540 + s * 330, y], [540 + s * 150, y]], RED, 10);
};
// a1: the upside-down glass with the card held on by the air
const flowA1 = (c: Ctx) => {
  ground(c);
  basin(c, 540, 850, 330, 170, true);
  const x = 540, rimY = 560, w = 260, h = 330, top = w * 0.4, bot = w / 2;
  const body = () => { c.moveTo(x - top, rimY - h); c.lineTo(x + top, rimY - h); c.lineTo(x + bot, rimY); c.lineTo(x - bot, rimY); c.closePath(); };
  shape(c, body, COL.water, 0);
  shape(c, body, COL.glass, 5);
  shine(c, [[x - top * 0.7, rimY - h * 0.85], [x - bot * 0.75, rimY - h * 0.15]], 7);
  // the card: a flat sheet across the rim, seen edge on
  shape(c, () => polyP(c, [[x - 160, rimY - 2], [x + 160, rimY - 2], [x + 150, rimY + 14], [x - 170, rimY + 14]]), COL.paper, 5);
  grip(c, x, rimY - h + 90, PI / 2, 1.4);
  for (const dx of [-90, 0, 90]) arrow(c, [[x + dx, rimY + 150], [x + dx, rimY + 40]], RED, 9);
};
// a2: sipping through a straw with a hole: the juice stays down
const flowA2 = (c: Ctx) => {
  ground(c);
  const px = 400, h = 720, feet = 1010, gx = px + 70, gy = 800;
  person(c, px, feet, h, { reachR: [px + 118, 715] });
  // the table hides the legs
  shape(c, () => polyP(c, [[-10, gy], [D + 10, gy], [D + 10, D + 10], [-10, D + 10]]), COL.wood, 5);
  line(c, [[-10, gy + 40], [D + 10, gy + 40]], 5, COL.woodDk);
  glass(c, gx, gy, 130, 200, 0.6, COL.orange);
  // the straw leans from the bottom of the glass to the mouth; its hole near the top lets air in
  const mouth: number[] = [px + 6, feet - h * 0.4 - h * 0.27 - h * 0.15 * 1.12 + h * 0.15 * 0.46 + 10];
  const s0: number[] = [gx + 22, gy - 12], s1 = mouth;
  const at = (y: number) => { const t = (s0[1] - y) / (s0[1] - s1[1]); return [s0[0] + (s1[0] - s0[0]) * t, y]; };
  line(c, [s0, s1], 22, INK); line(c, [s0, s1], 14, WHITE);
  const lvl = gy - 200 * 0.6; line(c, [s0, at(lvl)], 10, COL.orange);
  const hole = at(560); shape(c, () => ell(c, hole[0], hole[1], 6, 6), INK, 0);
  arrow(c, [[hole[0] - 150, hole[1]], [hole[0] - 22, hole[1]]], COL.blueDk, 8);
};
// a3: a suction hook on a tile holding a bucket of water
const flowA3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 860);
  c.strokeStyle = "rgba(43,35,64,0.25)"; c.lineWidth = 4;
  for (let x = 90; x < D; x += 180) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 860); c.stroke(); }
  for (let y = 70; y < 860; y += 180) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, 860], [D, 860]], 6);
  towel(c, 560, 960, 560, 110);
  // the cup, its stem and the hook
  const cx = 540, cy = 250;
  shape(c, () => ell(c, cx, cy, 88, 88), COL.black, 6);
  shape(c, () => ell(c, cx, cy, 52, 52), COL.greyDk, 4);
  shape(c, () => ell(c, cx, cy, 20, 20), COL.black, 4);
  line(c, [[cx, cy + 20], [cx, cy + 120], [cx + 26, cy + 150], [cx + 54, cy + 122]], 22, INK); line(c, [[cx, cy + 20], [cx, cy + 120], [cx + 26, cy + 150], [cx + 54, cy + 122]], 12, COL.steel);
  // the bucket hangs by its handle from the hook
  const hy = cy + 150, rimY = hy + 190, w = 270, bh = 250;
  line(c, [[cx - w / 2 + 20, rimY + 10], [cx - w * 0.3, hy + 30], [cx + 26, hy], [cx + w * 0.3 + 26, hy + 30], [cx + w / 2 + 20, rimY + 10]], 18, INK);
  line(c, [[cx - w / 2 + 20, rimY + 10], [cx - w * 0.3, hy + 30], [cx + 26, hy], [cx + w * 0.3 + 26, hy + 30], [cx + w / 2 + 20, rimY + 10]], 9, COL.steel);
  const body = () => polyP(c, [[cx - w / 2 + 10, rimY], [cx + w / 2 + 30, rimY], [cx + w / 2 - 10, rimY + bh], [cx - w / 2 + 50, rimY + bh]]);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, 60, 0);
  shape(c, () => ell(c, cx + 20, rimY, w / 2 + 20, 34), COL.blueDk, 5);
  shape(c, () => ell(c, cx + 20, rimY + 4, w / 2 + 2, 24), COL.water, 0);
};
// a4: the same bottle and packet at the bottom of a hill and at the top
const packet = (c: Ctx, x: number, y: number, w: number, h: number, puffed: boolean) => {
  const b = puffed ? w * 0.22 : w * 0.02;
  const p = () => { c.moveTo(x - w / 2, y - h); for (let i = 0; i < 6; i++) c.lineTo(x - w / 2 + (i + 0.5) * (w / 6), y - h + (i % 2 ? 0 : 10)); c.lineTo(x + w / 2, y - h); c.quadraticCurveTo(x + w / 2 + b, y - h / 2, x + w / 2, y); for (let i = 0; i < 6; i++) c.lineTo(x + w / 2 - (i + 0.5) * (w / 6), y - (i % 2 ? 0 : 10)); c.lineTo(x - w / 2, y); c.quadraticCurveTo(x - w / 2 - b, y - h / 2, x - w / 2, y); c.closePath(); };
  shadow(c, x + 8, y + 6, w * 0.5, 10);
  shape(c, p, COL.yellow); shade(c, p, COL.orange, w * 0.2, 0, 0.5);
  shape(c, () => ell(c, x, y - h / 2, w * 0.3 + b * 0.3, h * 0.2), COL.red, 4);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D);
  const hill = () => { c.moveTo(-10, D + 10); c.lineTo(-10, 920); c.lineTo(300, 920); c.bezierCurveTo(480, 920, 520, 420, 700, 410); c.lineTo(D + 10, 410); c.lineTo(D + 10, D + 10); c.closePath(); };
  shape(c, hill, COL.green, 6); shade(c, hill, COL.greenDk, 0, 60, 0.35);
  // a path up the slope, just under the hill's edge, and a flag at the top
  const bez = (t: number, a: number, b: number, k: number, d: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * k + t ** 3 * d;
  const path: number[][] = []; for (let i = 0; i <= 12; i++) { const t = i / 12; path.push([bez(t, 300, 480, 520, 700), bez(t, 920, 920, 420, 410) + 38]); }
  line(c, path, 16, COL.wood);
  line(c, [[720, 410], [720, 250]], 8, INK); shape(c, () => polyP(c, [[716, 250], [640, 280], [716, 310]]), COL.red, 5);
  // bottom: flat packet, plain bottle. top: puffed packet, swollen bottle
  bottle(c, 110, 920, 100, 230, { cap: "on" });
  packet(c, 240, 920, 110, 150, false);
  bottle(c, 790, 410, 100, 230, { cap: "on", side: "swollen" });
  packet(c, 930, 410, 110, 150, true);
};
// p1: the jar barometer with its straw pointer and the card scale
const flowP1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 800], [D, 800]], 6);
  const x = 420, y = 800, w = 300, h = 330;
  shadow(c, x + 40, y + 6, w * 0.55, 30);
  const body = () => rrect(c, x - w / 2, y - h, w, h, 30);
  shape(c, body, COL.glass, 5); shade(c, body, COL.steelDk, 60, 0, 0.2);
  shine(c, [[x - w * 0.36, y - h * 0.8], [x - w * 0.36, y - h * 0.2]], 8);
  // balloon rubber stretched over the mouth, a rubber band round the neck
  shape(c, () => ell(c, x, y - h, w / 2 + 6, 26), COL.pink, 5);
  line(c, [[x - w / 2 - 6, y - h + 34], [x + w / 2 + 6, y - h + 34]], 12, INK); line(c, [[x - w / 2 - 6, y - h + 34], [x + w / 2 + 6, y - h + 34]], 6, COL.red);
  // the straw, taped flat at the middle, pointing out past the rim to the card
  const sy = y - h - 14;
  line(c, [[x - 40, sy], [x + 470, sy - 10]], 20, INK); line(c, [[x - 40, sy], [x + 470, sy - 10]], 12, COL.orange);
  shape(c, () => rrect(c, x - 30, sy - 26, 60, 48, 6), "rgba(255,255,255,0.7)", 4);
  // the card: centimetre marks, the tip's mark in red
  const cx = 860, ct = 260, cb = 800;
  shadow(c, cx + 70, cb + 6, 70, 12);
  shape(c, () => rrect(c, cx, ct, 130, cb - ct, 6), COL.paper, 5);
  for (let i = 0; i <= 10; i++) { const yy = ct + 40 + i * 46; line(c, [[cx, yy], [cx + (i % 2 ? 22 : 36), yy]], i % 2 ? 3 : 4); if (i % 2 === 0) write(c, String(5 - i / 2), cx + 56, yy - 16, 32, INK, 5); }
  line(c, [[x + 480, sy - 10], [cx + 110, sy - 10]], 7, RED);
};
// g1: the pile of cards and the three tokens
const token = (c: Ctx, x: number, y: number, kind: "in" | "out" | "same") => {
  shadow(c, x + 5, y + 8, 60, 16);
  shape(c, () => ell(c, x, y, 62, 62), kind === "in" ? COL.teal : kind === "out" ? COL.orange : COL.purple, 5);
  if (kind === "in") { arrow(c, [[x - 52, y], [x - 16, y]], WHITE, 7); arrow(c, [[x + 52, y], [x + 16, y]], WHITE, 7); }
  if (kind === "out") { arrow(c, [[x - 10, y], [x - 50, y]], WHITE, 7); arrow(c, [[x + 10, y], [x + 50, y]], WHITE, 7); }
  if (kind === "same") { line(c, [[x - 30, y - 12], [x + 30, y - 12]], 9, WHITE); line(c, [[x - 30, y + 12], [x + 30, y + 12]], 9, WHITE); }
};
const flowG1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.wood; c.fillRect(0, 0, D, D);
  // the face-down pile
  for (let i = 0; i < 6; i++) { const x = 300 - i * 6, y = 420 - i * 8; shape(c, () => rrect(c, x, y, 300, 220, 16), i === 5 ? COL.teal : COL.tealDk, 5); }
  shape(c, () => rrect(c, 290, 400, 260, 180, 12), "rgba(255,255,255,0.18)", 4);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 400 + i * 46, 470, 14, 14), WHITE, 3);
  // one card turned up: a puzzle about an upside-down glass
  const card = () => rrect(c, 640, 330, 300, 220, 16);
  shadow(c, 800, 560, 150, 16); shape(c, card, WHITE, 5);
  shape(c, () => polyP(c, [[740, 400], [850, 400], [840, 500], [750, 500]]), COL.water, 0);
  shape(c, () => polyP(c, [[740, 400], [850, 400], [840, 500], [750, 500]]), COL.glass, 5);
  shape(c, () => polyP(c, [[725, 500], [865, 500], [865, 512], [725, 512]]), COL.paper, 4);
  letter(c, "?", 876, 380, 90, RED, 9);
  token(c, 300, 820, "in"); token(c, 540, 820, "out"); token(c, 780, 820, "same");
};

// ================================================================ term cards
// pressure: a thumb pressing a drawing pin into a board, the point tiny and the head wide
const term1 = (c: Ctx) => {
  ground(c);
  const by = 760;
  const top = () => polyP(c, [[120, by], [960, by], [1040, by + 90], [40, by + 90]]);
  shape(c, top, COL.wood, 6); shape(c, () => polyP(c, [[40, by + 90], [1040, by + 90], [1040, by + 170], [40, by + 170]]), COL.woodDk, 6);
  for (const dx of [0, 1]) line(c, [[200 + dx * 400, by + 20], [240 + dx * 400, by + 70]], 4, COL.woodDk);
  // the pin: a wide flat head on a short stem, the point just going into the wood
  const x = 540, hy = 620;
  line(c, [[x, hy + 30], [x, by + 64]], 4, INK);
  shape(c, () => polyP(c, [[x - 10, hy + 30], [x + 10, hy + 30], [x, by + 64]]), COL.steelIn, 4);
  shape(c, () => rrect(c, x - 150, hy, 300, 34, 10), COL.steel, 6);
  shape(c, () => ell(c, x, hy, 150, 22), COL.steelIn, 5);
  // the hand: fingers curled, the thumb pressing straight down on the head
  hand(c, x + 19, hy - 22 - 178, PI * 0.75, 2.4, SKIN.child, CLOTH.child);
  arrow(c, [[x + 230, 180], [x + 230, 480]], RED, 11);
};
// lift pump: a village hand pump with the ground cut away to show the cylinder far down in the water
const term9 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 470);
  const gy = 470;
  // the ground, cut away: soil, then water-filled sand below the water line
  shape(c, () => polyP(c, [[-10, gy], [D + 10, gy], [D + 10, D + 10], [-10, D + 10]]), COL.soil, 0);
  shape(c, () => polyP(c, [[-10, 820], [D + 10, 820], [D + 10, D + 10], [-10, D + 10]]), COL.waterDk, 0);
  c.globalAlpha = 0.5; for (const [sx, sy] of [[120, 600], [300, 720], [800, 560], [950, 700], [200, 950], [850, 980]]) shape(c, () => ell(c, sx, sy, 22, 14), COL.soilDk, 0); c.globalAlpha = 1;
  line(c, [[-10, gy], [D + 10, gy]], 6);
  line(c, [[-10, 820], [D + 10, 820]], 5, COL.blueDk);
  // the pipe from the pump down to the cylinder, which sits in the water
  const x = 540;
  line(c, [[x, gy], [x, 1000]], 44, INK); line(c, [[x, gy], [x, 1000]], 32, COL.steel);
  shape(c, () => rrect(c, x - 52, 860, 104, 150, 10), COL.steelDk, 6);
  line(c, [[x - 30, 890], [x + 30, 890]], 4); line(c, [[x - 30, 980], [x + 30, 980]], 4);
  // the rod inside the pipe
  line(c, [[x, gy], [x, 900]], 8, COL.greyDk);
  // above ground: concrete base, stand, head, spout and the long handle
  shape(c, () => polyP(c, [[380, gy], [700, gy], [680, gy - 40], [400, gy - 40]]), COL.grey, 5);
  shape(c, () => rrect(c, x - 60, gy - 300, 120, 262, 10), COL.blue, 6); shade(c, () => rrect(c, x - 60, gy - 300, 120, 262, 10), COL.blueDk, 40, 0);
  shape(c, () => rrect(c, x - 90, gy - 360, 180, 70, 12), COL.blueDk, 6);
  line(c, [[x - 70, gy - 250], [x - 170, gy - 250], [x - 170, gy - 200]], 36, INK); line(c, [[x - 70, gy - 250], [x - 170, gy - 250], [x - 170, gy - 200]], 24, COL.blue);
  line(c, [[x + 60, gy - 330], [x + 400, gy - 440]], 30, INK); line(c, [[x + 60, gy - 330], [x + 400, gy - 440]], 18, COL.black);
  shape(c, () => ell(c, x + 60, gy - 330, 16, 16), COL.steel, 4);
};

export const ic_airAirAroundUsL4 = cards("sci.air.air-around-us.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, flowG1, term1, term9,
]);
