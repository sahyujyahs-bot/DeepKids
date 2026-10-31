import type { Ctx } from "./core";
import { INK, WHITE, RED, BG, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, leaf, hand, write, cards } from "./flatKit";

// WATER: WATER CYCLE L3 · experiment set-up cards (flat kit). Light from the upper left, shadows right and down.

const DARK = "#4b4380", DARKDK = "#3b3470", PEBBLE = "#9a948a", PEBBLEDK = "#6f6a62", TERRA = "#c8693f", TERRADK = "#9f4d2b", SALTW = "#a9cdea";
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => hand(c, x, y, an, s, SKIN.adult, CLOTH.adult, open);
// the same hand coming in from the right (mirrored, so the thumb stays on top)
const handR = (c: Ctx, x: number, y: number, an: number, s: number, adult = false, open = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); if (adult) adultHand(c, 0, 0, an, s, open); else hand(c, 0, 0, an, s, SKIN.child, CLOTH.child, open); c.restore();
};
// an outline only on the outside: strokes then fills, so overlapping parts merge into one blob
const blob = (c: Ctx, path: () => void, fill: string, w = 6) => { c.beginPath(); path(); c.lineJoin = "round"; c.lineWidth = w * 2; c.strokeStyle = INK; c.stroke(); c.fillStyle = fill; c.fill(); };
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.drop) => {
  shape(c, () => { c.moveTo(x, y - r * 1.9); c.quadraticCurveTo(x + r * 0.95, y - r * 0.6, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.95, y - r * 0.6, x, y - r * 1.9); c.closePath(); }, col, Math.max(3, r * 0.2));
  line(c, [[x - r * 0.5, y - r * 0.1], [x - r * 0.45, y + r * 0.4]], Math.max(3, r * 0.2), WHITE);
};
// a round bead of water (a drop hanging or sitting on something)
const bead = (c: Ctx, x: number, y: number, r: number, col: string = COL.drop) => {
  shape(c, () => ell(c, x, y, r, r * 1.1), col, Math.max(3, r * 0.2));
  line(c, [[x - r * 0.45, y - r * 0.2], [x - r * 0.3, y + r * 0.3]], Math.max(3, r * 0.22), WHITE);
};
const cb = (p: number[][], t: number): number[] => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
const wisp = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
// a smooth curl of smoke or steam along a cubic curve
const curl = (c: Ctx, p: number[][], w: number, col: string) => { const pts = Array.from({ length: 21 }, (_, i) => cb(p, i / 20)); wisp(c, pts, w, col); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, p = [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]]; line(c, p, r * 0.2 + 6, INK); line(c, p, r * 0.2, COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, -r * 0.3, -r * 0.2, 0.6);
};
const cube = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.14), "#d9f0fa", 5);
  shade(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.14), "#a9d3ea", -s * 0.22, -s * 0.22, 0.7);
  line(c, [[-s * 0.3, -s * 0.2], [-s * 0.3, s * 0.15]], 6, WHITE);
  c.restore();
};
// a steel tumbler: bottom centre (x, yb); kind says what shows at the rim
const tumbler = (c: Ctx, x: number, yb: number, w: number, h: number, kind: "ice" | "water" | "empty" = "empty", liq: string = COL.yellow) => {
  const tw = w / 2, bw = w * 0.4, top = yb - h, ry = w * 0.1;
  shadow(c, x + w * 0.16, yb + 6, w * 0.64, w * 0.11);
  const body = () => { c.moveTo(x - tw, top); c.lineTo(x + tw, top); c.lineTo(x + bw, yb - 14); c.quadraticCurveTo(x + bw, yb, x + bw - 14, yb); c.lineTo(x - bw + 14, yb); c.quadraticCurveTo(x - bw, yb, x - bw, yb - 14); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.28, 0);
  shine(c, [[x - tw * 0.62, top + 36], [x - bw * 0.62, yb - 50]], 10);
  shape(c, () => ell(c, x, top, tw, ry), COL.steelIn, 6);
  if (kind !== "empty") shape(c, () => ell(c, x, top + ry * 0.08, tw * 0.86, ry * 0.7), liq, 3);
  if (kind === "ice") { cube(c, x - tw * 0.38, top - 6, w * 0.3, -0.25); cube(c, x + tw * 0.34, top - 12, w * 0.3, 0.3); cube(c, x - tw * 0.02, top - w * 0.2, w * 0.3, 0.1); }
};
// a wide glass jar: bottom centre (x, yb), half-width hw; inside() draws what is in it (clipped)
const jarPath = (c: Ctx, x: number, yb: number, hw: number, h: number) => {
  const mw = hw * 0.86, ty = yb - h;
  c.moveTo(x - mw, ty); c.lineTo(x - mw, ty + h * 0.12); c.quadraticCurveTo(x - hw, ty + h * 0.2, x - hw, ty + h * 0.32); c.lineTo(x - hw, yb - 40); c.quadraticCurveTo(x - hw, yb, x - hw + 40, yb);
  c.lineTo(x + hw - 40, yb); c.quadraticCurveTo(x + hw, yb, x + hw, yb - 40); c.lineTo(x + hw, ty + h * 0.32); c.quadraticCurveTo(x + hw, ty + h * 0.2, x + mw, ty + h * 0.12); c.lineTo(x + mw, ty); c.closePath();
};
const jar = (c: Ctx, x: number, yb: number, hw: number, h: number, water: number, inside?: () => void) => {
  const mw = hw * 0.86, ty = yb - h;
  shadow(c, x + hw * 0.14, yb + 8, hw * 1.05, 24);
  shape(c, () => jarPath(c, x, yb, hw, h), "rgba(236,247,255,0.45)", 0);
  c.save(); c.beginPath(); jarPath(c, x, yb, hw, h); c.clip();
  if (water > 0) { const ly = yb - h * water; c.fillStyle = "rgba(143,195,234,0.85)"; c.fillRect(x - hw, ly, hw * 2, yb - ly + 4); c.fillStyle = "rgba(233,243,255,0.9)"; c.fillRect(x - hw, ly, hw * 2, 9); }
  if (inside) inside();
  c.restore();
  shape(c, () => jarPath(c, x, yb, hw, h), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, x - mw - 10, ty - 8, mw * 2 + 20, 26, 10), "rgba(255,255,255,0.8)", 6);
  shine(c, [[x - hw * 0.8, ty + h * 0.4], [x - hw * 0.8, yb - 60]], 11);
};
const foldedCloth = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + 20, y + 70, w * 0.55, 22);
  shape(c, () => rrect(c, x - w / 2, y + 36, w, 40, 12), COL.cloth); shape(c, () => rrect(c, x - w / 2 + 14, y, w - 28, 44, 12), "#fff8e6");
  line(c, [[x - w / 2 + 40, y + 22], [x + w / 2 - 60, y + 22]], 3, "#d9cfb8");
};
// hung dark cloth behind, table in front
const darkRoom = (c: Ctx) => {
  ground(c, "#e9dcc2"); c.fillStyle = DARK; c.fillRect(0, 0, 1080, 760);
  for (let i = 0; i < 9; i++) { const x = 60 + i * 120; c.fillStyle = DARKDK; c.beginPath(); c.moveTo(x, 0); c.quadraticCurveTo(x + 22, 380, x - 6, 760); c.lineTo(x + 44, 760); c.quadraticCurveTo(x + 66, 380, x + 40, 0); c.closePath(); c.globalAlpha = 0.55; c.fill(); c.globalAlpha = 1; }
  line(c, [[0, 760], [1080, 760]], 6);
};
const kettle = (c: Ctx, x: number, y: number, k: number, tilt: number) => {
  c.save(); c.translate(x, y); c.rotate(tilt); c.scale(k, k);
  line(c, [[150, -60], [235, -50], [220, 40], [140, 70]], 44, INK); line(c, [[150, -60], [235, -50], [220, 40], [140, 70]], 30, "#3a3540");
  const sp = () => { c.moveTo(-100, 20); c.lineTo(-250, -105); c.lineTo(-220, -125); c.lineTo(-110, -40); c.closePath(); };
  shape(c, sp, COL.steel);
  const body = () => { c.moveTo(-140, 90); c.bezierCurveTo(-170, -40, -110, -110, 0, -110); c.bezierCurveTo(110, -110, 170, -40, 140, 90); c.quadraticCurveTo(0, 125, -140, 90); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -50, 0); shine(c, [[-100, -50], [-115, 40]], 10);
  shape(c, () => ell(c, 0, -112, 66, 22), COL.steelIn, 6); shape(c, () => ell(c, 0, -132, 18, 14), "#3a3540", 5);
  c.restore();
};
const stream = (c: Ctx, x: number, y1: number, y2: number, w: number) => { line(c, [[x, y1], [x - 4, (y1 + y2) / 2], [x - 6, y2]], w + 10, INK); line(c, [[x, y1], [x - 4, (y1 + y2) / 2], [x - 6, y2]], w, COL.water); };

// ---- pebble, bowl and cling film (experiment 1) ----
const pebble = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry, -0.1), PEBBLE); shade(c, () => ell(c, x, y, rx, ry, -0.1), PEBBLEDK, -rx * 0.3, -ry * 0.2, 0.7);
  line(c, [[x - rx * 0.5, y - ry * 0.35], [x - rx * 0.1, y - ry * 0.6]], 7, WHITE);
};
const filmLine = (c: Ctx, pts: number[][], w = 9) => { line(c, pts, w + 8, INK); line(c, pts, w, "#eef8ff"); };
// the bowl cut open: wall, water, small cup standing in the middle; rim at y = ry, spans x 110..970
const bowlSection = (c: Ctx, ry: number, water: number) => {
  const yb = ry + 400;
  shadow(c, 580, yb + 6, 440, 34);
  const outer = () => { c.moveTo(110, ry); c.bezierCurveTo(120, ry + 310, 360, yb, 540, yb); c.bezierCurveTo(720, yb, 960, ry + 310, 970, ry); c.closePath(); };
  const inner = () => { c.moveTo(138, ry + 8); c.bezierCurveTo(146, ry + 290, 370, yb - 28, 540, yb - 28); c.bezierCurveTo(710, yb - 28, 934, ry + 290, 942, ry + 8); c.closePath(); };
  shape(c, outer, COL.steel); shade(c, outer, COL.steelDk, -40, 0, 0.5);
  shape(c, inner, COL.steelIn, 5);
  c.save(); c.beginPath(); inner(); c.clip();
  c.fillStyle = SALTW; c.fillRect(100, water, 900, 600); c.fillStyle = "#e3f1fb"; c.fillRect(100, water, 900, 9);
  // the small cup
  const cup = () => { c.moveTo(455, ry + 120); c.lineTo(625, ry + 120); c.lineTo(600, yb - 40); c.lineTo(480, yb - 40); c.closePath(); };
  shape(c, cup, COL.steel); shade(c, cup, COL.steelDk, -34, 0); shine(c, [[480, ry + 150], [492, yb - 90]], 8);
  c.globalAlpha = 0.45; c.fillStyle = SALTW; c.fillRect(440, water, 200, 300); c.globalAlpha = 1;
  shape(c, () => ell(c, 540, ry + 120, 85, 16), COL.steelIn, 5);
  c.restore();
  shape(c, () => rrect(c, 96, ry - 12, 74, 26, 12), COL.steel); shape(c, () => rrect(c, 910, ry - 12, 74, 26, 12), COL.steel);
};

// ---- plant, bag (experiment 3) ----
const bagPath = (c: Ctx, w: number, h: number) => {
  c.moveTo(0, -12); c.bezierCurveTo(w * 0.2, -h * 0.25, w * 0.25, -h * 0.5, w * 0.55, -h * 0.5); c.bezierCurveTo(w * 0.9, -h * 0.5, w, -h * 0.2, w, 0);
  c.bezierCurveTo(w, h * 0.25, w * 0.9, h * 0.5, w * 0.55, h * 0.5); c.bezierCurveTo(w * 0.25, h * 0.5, w * 0.2, h * 0.25, 0, 12); c.closePath();
};
// a tied bag with its neck at (x, y), body pointing up; inside() is drawn clipped to the bag, before the film
const bag = (c: Ctx, x: number, y: number, w: number, h: number, inside: (() => void) | null, mist = false) => {
  c.save(); c.translate(x, y);
  c.save(); c.beginPath(); bagPath(c, w, h); c.clip(); c.translate(-x, -y); if (inside) inside(); c.restore();
  c.save(); c.beginPath(); bagPath(c, w, h); c.clip();
  if (mist) { c.fillStyle = "rgba(255,255,255,0.62)"; c.fillRect(-10, -h, w + 20, h * 2); }
  c.restore();
  shape(c, () => bagPath(c, w, h), mist ? "rgba(255,255,255,0.0)" : "rgba(214,236,250,0.4)", 6);
  line(c, [[w * 0.35, -h * 0.36], [w * 0.7, -h * 0.4]], 9, WHITE);
  shape(c, () => rrect(c, 4, -17, 24, 34, 8), COL.purple, 5);
  c.restore();
};
const pot = (c: Ctx, x: number, yb: number, w: number) => {
  shadow(c, x + w * 0.1, yb + 4, w * 0.62, 20);
  const p = () => { c.moveTo(x - w / 2, yb - 130); c.lineTo(x + w / 2, yb - 130); c.lineTo(x + w * 0.36, yb); c.lineTo(x - w * 0.36, yb); c.closePath(); };
  shape(c, p, TERRA); shade(c, p, TERRADK, -w * 0.25, 0);
  shape(c, () => rrect(c, x - w * 0.56, yb - 160, w * 1.12, 44, 12), TERRA); shade(c, () => rrect(c, x - w * 0.56, yb - 160, w * 1.12, 44, 12), TERRADK, -w * 0.3, 0);
  shape(c, () => ell(c, x, yb - 160, w * 0.5, 12), COL.soil, 4);
};
const stem = (c: Ctx, pts: number[][], w: number) => { line(c, pts, w + 9, INK); line(c, pts, w, COL.brown); };
// a hibiscus flower
const hibiscus = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.6, r * 0.45, a), COL.red, 5); }
  shape(c, () => ell(c, x, y, r * 0.22, r * 0.22), "#a8283a", 3); line(c, [[x, y], [x + r * 0.5, y - r * 0.55]], 5, COL.yellow);
};
// the leafy branch used in the bag: from (x, y) going up
const leafyTop = (c: Ctx, x: number, y: number, len: number) => {
  stem(c, [[x, y], [x + 8, y - len * 0.5], [x - 4, y - len]], 10);
  for (const t of [0.2, 0.45, 0.7]) for (const s of [-1, 1]) leaf(c, x + 4 * t, y - len * t, 100 - t * 20, -Math.PI / 2 + s * 0.95);
  leaf(c, x - 4, y - len, 100, -Math.PI / 2);
};

// ---- table things (experiments 4, 5) ----
const tableTop = (c: Ctx, y: number) => { ground(c); c.fillStyle = "#e6d7b9"; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  line(c, [[0, 0], [len, 0]], 20, INK); line(c, [[0, 0], [len, 0]], 10, COL.steel);
  shape(c, () => ell(c, -34, 0, 52, 34), COL.steel); shape(c, () => ell(c, -34, 2, 38, 22), COL.water, 3);
  c.restore();
};
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string = COL.water) => { shape(c, () => ell(c, x, y, rx, ry), col, 4); line(c, [[x - rx * 0.5, y - ry * 0.3], [x - rx * 0.2, y - ry * 0.5]], 6, WHITE); };

// ================================================================ cards

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  // bowl from above at an angle: salty water, small cup in the middle
  shadow(c, 520, 900, 400, 50);
  const body = () => { c.moveTo(110, 600); c.bezierCurveTo(130, 860, 400, 920, 520, 920); c.bezierCurveTo(640, 920, 910, 860, 930, 600); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -60, 0, 0.5); shine(c, [[160, 700], [230, 830]], 12);
  shape(c, () => ell(c, 520, 600, 410, 120), COL.steelIn, 6);
  shape(c, () => ell(c, 520, 615, 370, 98), SALTW, 4);
  shape(c, () => ell(c, 400, 630, 80, 24), "#8fb4d2", 0);
  const cup = () => { c.moveTo(330, 560); c.lineTo(470, 560); c.lineTo(452, 650); c.quadraticCurveTo(400, 665, 348, 650); c.closePath(); };
  shape(c, cup, COL.steel); shade(c, cup, COL.steelDk, -30, 0); shape(c, () => ell(c, 400, 560, 70, 20), COL.steelIn, 5);
  for (const [x, y] of [[250, 600], [560, 640], [720, 630], [760, 580], [640, 680], [300, 660]]) shape(c, () => rrect(c, x - 7, y - 7, 14, 14, 3), WHITE, 3);
  // the jug pouring salty water into the bowl
  c.save(); c.translate(800, 250); c.rotate(-0.55); c.scale(0.9, 0.9);
  const jug = () => { c.moveTo(-90, -110); c.lineTo(90, -110); c.lineTo(100, 100); c.quadraticCurveTo(0, 125, -100, 100); c.closePath(); };
  line(c, [[92, -80], [170, -70], [160, 40], [96, 60]], 36, INK); line(c, [[92, -80], [170, -70], [160, 40], [96, 60]], 22, COL.teal);
  shape(c, jug, COL.glass);
  c.save(); c.beginPath(); jug(); c.clip(); c.fillStyle = SALTW; c.fillRect(-120, -40, 240, 200); c.fillStyle = WHITE; c.fillRect(-120, -40, 240, 8); c.restore();
  shape(c, jug, "rgba(0,0,0,0)", 6); shine(c, [[-65, -85], [-70, 70]], 9);
  shape(c, () => polyP(c, [[-92, -112], [-130, -140], [-112, -150], [-70, -112]]), COL.glass, 5);
  c.restore();
  stream(c, 646, 200, 620, 16);
  arrow(c, [[740, 400], [700, 480], [690, 540]], RED, 11);
  handR(c, 975, 200, 0.3, 1.3);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  sun(c, 170, 170, 70);
  bowlSection(c, 470, 650);
  // the cling film dips down over the cup, a pebble in the dip
  const film = [[110, 470], [300, 474], [470, 566], [540, 574], [610, 566], [780, 474], [970, 470]];
  filmLine(c, [film[0], film[1], film[2], film[3], film[4], film[5], film[6]], 9);
  pebble(c, 540, 534, 62, 42);
  arrow(c, [[540, 360], [540, 440]], RED, 11);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const L = [[40, 250], [200, 262], [400, 470], [520, 500]], R = [[560, 500], [680, 470], [880, 262], [1040, 250]];
  pebble(c, 540, 430, 105, 70);
  filmLine(c, [...[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => cb(L, t)), ...[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => cb(R, t))], 22);
  for (const t of [0.35, 0.55, 0.75]) { const p = cb(L, t); bead(c, p[0] - 4, p[1] + 26, 17); const q = cb(R, 1 - t); bead(c, q[0] + 4, q[1] + 26, 17); }
  arrow(c, [[170, 380], [300, 470]], RED, 11); arrow(c, [[910, 380], [790, 470]], RED, 11);
  bead(c, 520, 560, 24); drop(c, 548, 690, 20); drop(c, 520, 780, 14);
  // the cup, drops collecting inside
  shadow(c, 560, 1000, 270, 30);
  const cup = () => { c.moveTo(310, 840); c.lineTo(770, 840); c.lineTo(710, 990); c.lineTo(370, 990); c.closePath(); };
  shape(c, cup, COL.steel); shade(c, cup, COL.steelDk, -70, 0); shine(c, [[350, 880], [385, 955]], 11);
  shape(c, () => ell(c, 540, 840, 230, 40), COL.steelIn, 6); shape(c, () => ell(c, 540, 846, 190, 28), COL.water, 3);
  shape(c, () => ell(c, 520, 846, 40, 8), COL.drop, 0);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const fx = 700, fy = 400;
  shape(c, () => rrect(c, fx - 300, 740, 600, 400, 120), CLOTH.child); shade(c, () => rrect(c, fx - 300, 740, 600, 400, 120), CLOTH.childDk, -80, 0);
  shape(c, () => rrect(c, fx - 60, 640, 120, 150, 30), SKIN.child);
  shape(c, () => ell(c, fx - 245, fy + 30, 34, 54), SKIN.child); shape(c, () => ell(c, fx + 245, fy + 30, 34, 54), SKIN.childDk);
  shape(c, () => ell(c, fx, fy, 240, 265), SKIN.child); shade(c, () => ell(c, fx, fy, 240, 265), SKIN.childDk, -70, 0, 0.5);
  shape(c, () => { c.moveTo(fx - 245, fy - 50); c.bezierCurveTo(fx - 260, fy - 370, fx + 260, fy - 370, fx + 245, fy - 50); c.quadraticCurveTo(fx, fy - 185, fx - 245, fy - 50); c.closePath(); }, CLOTH.hair, 6);
  for (const s of [-1, 1]) { shape(c, () => ell(c, fx + s * 85, fy - 20, 40, 48), WHITE, 5); shape(c, () => ell(c, fx + s * 85 - 6, fy - 4, 19, 23), INK, 0); line(c, [[fx + s * 125, fy - 98], [fx + s * 85, fy - 116], [fx + s * 45, fy - 98]], 8); }
  shape(c, () => { c.moveTo(fx - 85, fy + 110); c.quadraticCurveTo(fx, fy + 90, fx + 85, fy + 110); c.quadraticCurveTo(fx + 65, fy + 210, fx, fy + 210); c.quadraticCurveTo(fx - 65, fy + 210, fx - 85, fy + 110); c.closePath(); }, "#7a2a3a", 6);
  shape(c, () => ell(c, fx - 6, fy + 185, 44, 24), COL.pink, 4);
  shape(c, () => ell(c, fx - 125, fy + 100, 28, 18), "#d98a6a", 0); shape(c, () => ell(c, fx + 125, fy + 100, 28, 18), "#d98a6a", 0);
  // the arm, and the fingertip with a drop reaching the mouth
  line(c, [[-40, 1040], [440, 800]], 160, INK); line(c, [[-40, 1040], [440, 800]], 146, CLOTH.child);
  hand(c, 500, 725, -0.5, 1.8, SKIN.child, CLOTH.child, true);
  drop(c, 676, 625, 24, COL.drop);
  shadow(c, 900, 1010, 120, 24);
  const cup = () => { c.moveTo(800, 880); c.lineTo(1020, 880); c.lineTo(990, 990); c.lineTo(830, 990); c.closePath(); };
  shape(c, cup, COL.steel); shade(c, cup, COL.steelDk, -40, 0); shape(c, () => ell(c, 910, 880, 110, 24), COL.steelIn, 5); shape(c, () => ell(c, 910, 884, 90, 15), COL.water, 3);
};

const steamOver = (c: Ctx, x: number, y: number) => {
  curl(c, [[x - 40, y], [x - 80, y - 50], [x + 10, y - 90], [x - 30, y - 150]], 12, WHITE); curl(c, [[x + 50, y + 10], [x + 10, y - 40], [x + 90, y - 80], [x + 60, y - 130]], 12, WHITE);
};
const bench = (c: Ctx, x: number) => { darkRoom(c); foldedCloth(c, x, 850, 520); };
// setup.e2.0
const e2_0 = (c: Ctx) => {
  bench(c, 400);
  jar(c, 400, 900, 230, 480, 0.3);
  steamOver(c, 400, 420);
  kettle(c, 690, 230, 1.0, -0.5);
  stream(c, 429, 252, 720, 18);
  shape(c, () => ell(c, 423, 722, 34, 8), COL.drop, 3);
  arrow(c, [[540, 460], [510, 560]], RED, 11);
  handR(c, 975, 180, 0.35, 1.2, true);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  bench(c, 440);
  jar(c, 440, 900, 240, 520, 0.2, () => {
    const g = c.createLinearGradient(0, 360, 0, 700); g.addColorStop(0, "rgba(205,200,192,0.8)"); g.addColorStop(1, "rgba(205,200,192,0.05)"); c.fillStyle = g; c.fillRect(150, 360, 600, 340);
  });
  // the agarbatti, its tip glowing inside the mouth
  const T = [470, 560], d = [0.77, -0.64];
  line(c, [[T[0] + d[0] * 520, T[1] + d[1] * 520], T], 16, INK); line(c, [[T[0] + d[0] * 520, T[1] + d[1] * 520], T], 9, COL.brown);
  line(c, [[T[0] + d[0] * 180, T[1] + d[1] * 180], T], 24, INK); line(c, [[T[0] + d[0] * 180, T[1] + d[1] * 180], T], 15, COL.soilDk);
  shape(c, () => ell(c, T[0], T[1], 12, 12), COL.orange, 4);
  curl(c, [[T[0], T[1] - 14], [T[0] - 60, T[1] - 80], [T[0] + 50, T[1] - 130], [T[0] - 10, T[1] - 220]], 11, "#d4cfc7");
  curl(c, [[T[0] + 6, T[1] - 20], [T[0] + 60, T[1] - 90], [T[0] - 40, T[1] - 150], [T[0] + 40, T[1] - 230]], 9, "#d4cfc7");
  handR(c, 880, 270, 0.7, 1.6, true);
};

const cloudInJar = (c: Ctx, x: number, y: number, k: number) => {
  blob(c, () => { for (const [dx, dy, r] of [[-110, 30, 70], [-40, -10, 90], [50, -20, 85], [120, 30, 68], [10, 50, 80], [-60, 70, 60], [70, 75, 60]]) { c.moveTo(x + (dx + r) * k, y + dy * k); c.arc(x + dx * k, y + dy * k, r * k, 0, Math.PI * 2); } }, WHITE, 6);
  curl(c, [[x - 80 * k, y + 20 * k], [x - 20 * k, y - 40 * k], [x + 60 * k, y - 30 * k], [x + 70 * k, y + 30 * k]], 6, "#b9d3e6");
  curl(c, [[x - 50 * k, y + 70 * k], [x + 10 * k, y + 20 * k], [x + 90 * k, y + 50 * k], [x + 40 * k, y + 90 * k]], 6, "#b9d3e6");
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  bench(c, 540);
  jar(c, 540, 900, 240, 520, 0.2, () => cloudInJar(c, 540, 560, 1.15));
  // the plate of ice on the mouth
  shape(c, () => ell(c, 540, 394, 300, 56), COL.steel); shape(c, () => ell(c, 540, 388, 252, 40), COL.steelIn, 4);
  cube(c, 430, 345, 100, -0.2); cube(c, 560, 335, 105, 0.25); cube(c, 660, 365, 90, 0.5); cube(c, 500, 270, 95, 0.1);
};

// setup.e2.3
const e2_3 = (c: Ctx) => {
  bench(c, 400);
  jar(c, 400, 900, 230, 480, 0.2, () => cloudInJar(c, 400, 640, 0.65));
  // the cloud wisp drifting up out of the mouth
  blob(c, () => { for (const [x, y, r] of [[380, 400, 38], [330, 345, 48], [270, 280, 60], [215, 205, 66]]) { c.moveTo(x + r, y); c.arc(x, y, r, 0, Math.PI * 2); } }, WHITE, 6);
  // the plate lifted off, held by its edge
  shape(c, () => ell(c, 620, 200, 280, 52), COL.steel); shape(c, () => ell(c, 620, 194, 236, 38), COL.steelIn, 4);
  cube(c, 540, 150, 90, -0.2); cube(c, 660, 145, 96, 0.25);
  curl(c, [[190, 230], [225, 190], [250, 205], [235, 245]], 6, "#b9d3e6");
  handR(c, 1000, 215, 0.15, 1.5, true);
  arrow(c, [[640, 590], [640, 450], [640, 330]], RED, 12);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  sun(c, 140, 140, 66);
  pot(c, 200, 1000, 260);
  // the branch grows out to the right, its tip going into the open bag
  stem(c, [[200, 840], [205, 740], [260, 650], [400, 600], [560, 575], [740, 560]], 14);
  leaf(c, 218, 770, 90, -2.4); leaf(c, 330, 625, 100, 1.3); leaf(c, 395, 602, 100, -1.1);
  hibiscus(c, 290, 570, 54);
  for (const [x, y, a] of [[540, 578, -0.9], [600, 572, 1.0], [680, 565, -0.8], [700, 563, 0.9], [740, 560, -0.1]] as number[][]) leaf(c, x, y, 105, a);
  // the open bag: mouth at the left (an open ring), closed end pinched in the child's hand on the right
  const mx = 440, cy = 520;
  shape(c, () => { c.moveTo(mx, cy - 150); c.bezierCurveTo(mx + 240, cy - 175, mx + 420, cy - 110, mx + 470, cy - 14); c.lineTo(mx + 470, cy + 14); c.bezierCurveTo(mx + 420, cy + 110, mx + 240, cy + 175, mx, cy + 150); c.closePath(); }, "rgba(214,236,250,0.42)", 6);
  shape(c, () => ell(c, mx, cy, 42, 150), "rgba(120,150,185,0.35)", 7);
  line(c, [[mx + 90, cy - 122], [mx + 330, cy - 112]], 9, WHITE);
  handR(c, 1015, cy, 0, 1.6);
  arrow(c, [[880, 290], [560, 290]], RED, 13);
};

// the leafy plant (top) and the bare stick (bottom), each with a tied bag on the tip of its branch; the same on cards 2 and 3
const bagRow = (c: Ctx, y: number, leafy: boolean, mist: boolean) => {
  const yb = y + 270, rim = yb - 160;
  pot(c, 160, yb, 220);
  stem(c, [[160, rim], [168, y + 60], [260, y + 10], [400, y]], 14);
  if (leafy) { leaf(c, 172, rim - 40, 80, -2.4); leaf(c, 280, y + 12, 85, 1.3); leaf(c, 300, y + 8, 85, -1.1); }
  bag(c, 400, y, 620, 300, () => {
    stem(c, [[400, y], [600, y - 8], [800, y - 14]], 12);
    if (leafy) for (const [x, ly, a] of [[470, y - 4, -0.9], [540, y - 6, 1.0], [620, y - 9, -0.8], [660, y - 9, 0.9], [740, y - 12, -0.2]] as number[][]) leaf(c, x, ly, 100, a);
    else { line(c, [[800, y - 14], [830, y - 40]], 9, INK); line(c, [[800, y - 14], [830, y - 40]], 5, COL.brown); }
  }, mist);
  if (mist) {
    for (const [bx, by] of [[540, y - 55], [610, y - 95], [700, y - 112], [790, y - 108], [880, y - 80], [930, y - 25], [890, y + 60], [600, y + 70]]) bead(c, bx, by, 14);
    shape(c, () => ell(c, 690, y + 108, 125, 14), COL.water, 4);
  }
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  bagRow(c, 240, true, false);
  bagRow(c, 760, false, false);
  handR(c, 1105, 760, 0, 1.6);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  bagRow(c, 240, true, true);
  bagRow(c, 760, false, false);
};

// setup.e4.0
const e4_0 = (c: Ctx) => {
  tableTop(c, 780);
  tumbler(c, 430, 930, 320, 420, "ice");
  tumbler(c, 850, 930, 320, 420, "water");
  // a cloth in the child's fist wiping the icy tumbler's side, up and down
  shape(c, () => rrect(c, 170, 640, 230, 170, 44), COL.teal, 6); shade(c, () => rrect(c, 170, 640, 230, 170, 44), COL.tealDk, -40, 0, 0.6);
  line(c, [[215, 690], [350, 700]], 5, WHITE); line(c, [[210, 745], [345, 755]], 5, WHITE);
  hand(c, 40, 715, 0, 2.1, SKIN.child, CLOTH.child);
  arrow(c, [[480, 670], [480, 560]], RED, 12); arrow(c, [[480, 770], [480, 880]], RED, 12);
};

// setup.e4.1
const e4_1 = (c: Ctx) => {
  tableTop(c, 780);
  puddle(c, 360, 912, 220, 36, "#cfe6f8");
  tumbler(c, 330, 900, 300, 420, "ice");
  // beads of water all over the outside
  c.save(); c.beginPath(); c.moveTo(180, 480); c.lineTo(480, 480); c.lineTo(450, 900); c.lineTo(210, 900); c.closePath(); c.clip();
  const pts = [[230, 540], [330, 520], [420, 560], [270, 620], [380, 640], [215, 700], [320, 710], [430, 720], [260, 790], [360, 800], [225, 860], [315, 870], [410, 850], [290, 560], [250, 660], [400, 590], [345, 745]];
  pts.forEach(([x, y], i) => bead(c, x, y, 17 + (i % 3) * 3));
  c.restore();
  tumbler(c, 790, 900, 300, 420, "water");
};

// setup.e4.2
const e4_2 = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 700); c.rotate(-0.03);
  shadow(c, 20, 330, 450, 40);
  shape(c, () => rrect(c, -460, -290, 920, 580, 14), WHITE, 6);
  c.restore();
  // left: the icy tumbler and its clear drop; right: a spoon of yellow water and its yellow drop
  tumbler(c, 270, 420, 250, 320, "ice");
  for (const [x, y] of [[190, 200], [230, 270], [310, 230], [350, 300], [200, 340]]) bead(c, x, y, 14);
  shape(c, () => ell(c, 270, 720, 130, 78, -0.08), "#d6ebfa", 6); line(c, [[190, 700], [230, 676]], 10, WHITE); line(c, [[300, 765], [350, 750]], 7, WHITE);
  tumbler(c, 790, 420, 250, 320, "water");
  shape(c, () => ell(c, 770, 720, 130, 78, 0.08), COL.yellow, 6); line(c, [[690, 700], [730, 676]], 10, WHITE);
  hand(c, 0, 725, 0.08, 2.1, SKIN.child, CLOTH.child, true);
};

// setup.e5.0
const e5_0 = (c: Ctx) => {
  tableTop(c, 600);
  for (const x of [150, 390, 630]) { plate(c, x, 850, 112, 50); puddle(c, x, 852, 52, 18); }
  glass(c, 900, 920, 110, 330, 0.1);
  // a spoon of water tipping into the narrow glass, the child's hand holding it
  c.save(); c.translate(880, 440); c.scale(-1, 1); spoon(c, 0, 0, -0.5, 340); c.restore();
  drop(c, 860, 535, 15); drop(c, 862, 600, 12);
  hand(c, 505, 275, 0.5, 1.6);
  write(c, "2", 130, 230, 140, INK, 16);
};

const tile = (c: Ctx, x: number, y: number, col: string) => { shape(c, () => rrect(c, x, y, 450, 450, 30), col, 6); };
const canopy = (c: Ctx, x: number, y: number) => { for (const [dx, dy, a] of [[40, 30, 0.9], [120, 10, 1.4], [200, 24, 1.6], [290, 8, 1.8], [370, 30, 2.2]]) leaf(c, x + dx, y + dy, 95, a, COL.leafDk); };
const fan = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 70, y + 120, 140, 28, 12), COL.teal);
  line(c, [[x, y + 120], [x, y + 60]], 22, INK); line(c, [[x, y + 120], [x, y + 60]], 12, COL.steelDk);
  shape(c, () => ell(c, x, y, 112, 112), "rgba(255,255,255,0.3)", 7);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + Math.cos(i * 2.094 + 0.5) * 48, y + Math.sin(i * 2.094 + 0.5) * 48, 52, 24, i * 2.094 + 0.5), COL.blue, 5);
  shape(c, () => ell(c, x, y, 20, 20), COL.steelDk, 5);
};
// setup.e5.1
const e5_1 = (c: Ctx) => {
  ground(c);
  tile(c, 50, 50, "#ffe9a8"); tile(c, 580, 50, "#b3bcd6"); tile(c, 50, 580, "#b3bcd6"); tile(c, 580, 580, "#b3bcd6");
  sun(c, 160, 160, 48); plate(c, 290, 340, 140, 56); puddle(c, 270, 332, 68, 24);
  canopy(c, 600, 60); plate(c, 805, 330, 140, 56); puddle(c, 805, 332, 68, 24);
  fan(c, 160, 780); plate(c, 400, 880, 130, 52); puddle(c, 400, 882, 62, 22);
  for (const y of [790, 840, 890]) { arrow(c, [[250, y], [320, y]], WHITE, 9); }
  canopy(c, 600, 590); glass(c, 805, 1000, 100, 300, 0.1);
};

// setup.e5.2
const e5_2 = (c: Ctx) => {
  ground(c);
  // the clock, a quarter of an hour on
  shadow(c, 240, 450, 170, 24);
  shape(c, () => ell(c, 230, 260, 170, 170), WHITE, 8);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[230 + Math.cos(a) * 132, 260 + Math.sin(a) * 132], [230 + Math.cos(a) * 154, 260 + Math.sin(a) * 154]], i % 3 === 0 ? 10 : 5); }
  line(c, [[230, 260], [230, 145]], 12); line(c, [[230, 260], [310, 260]], 16, RED);
  shape(c, () => ell(c, 230, 260, 14, 14), INK, 0);
  // the dry plate in the sun
  sun(c, 130, 790, 46);
  plate(c, 290, 930, 180, 70);
  // the table on paper, a time just written
  shape(c, () => rrect(c, 440, 100, 440, 640, 14), WHITE, 6);
  c.lineWidth = 5; c.strokeStyle = INK;
  for (const y of [250, 400, 550]) { c.beginPath(); c.moveTo(440, y); c.lineTo(880, y); c.stroke(); }
  c.beginPath(); c.moveTo(570, 100); c.lineTo(570, 740); c.stroke();
  shape(c, () => ell(c, 505, 175, 36, 36), COL.yellow, 5); shape(c, () => ell(c, 505, 325, 36, 36), "#8c93b8", 5); shape(c, () => ell(c, 505, 475, 36, 36), COL.blue, 5);
  write(c, "45", 610, 140, 80, INK, 10);
  // the pencil and the hand writing
  const T = [770, 215], d = [0.49, 0.87];
  line(c, [T, [T[0] + d[0] * 330, T[1] + d[1] * 330]], 26, INK); line(c, [T, [T[0] + d[0] * 330, T[1] + d[1] * 330]], 16, COL.yellow);
  line(c, [T, [T[0] + d[0] * 40, T[1] + d[1] * 40]], 26, INK); line(c, [T, [T[0] + d[0] * 40, T[1] + d[1] * 40]], 16, COL.wood);
  line(c, [T, [T[0] + d[0] * 14, T[1] + d[1] * 14]], 8, INK);
  handR(c, 960, 520, -1.06, 1.5);
};

export const su_waterWaterCycle = cards("sci.water.water-cycle.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e2_3, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2, e5_0, e5_1, e5_2]);
