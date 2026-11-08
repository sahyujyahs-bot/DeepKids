import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// CIRCUITS (sci.electricity.simple-circuits.L4) · set-up cards for Bulb Teams (bulbs in a row and side by side, in a
// dim room) and Which Way Round (a bulb and an LED on a coin cell), then the flow cards and two term cards.
// Same child and grown-up as the rest of the kit. Cell holder: dark box, two AA cells, a red (+) and a black (-) terminal.
// Bulb holder: dark base, two brass screws, a steel socket, a torch bulb with its filament between two supports.
const PI = Math.PI;
const WIRE = { red: "#d7372b", black: "#3a3540", blue: "#5b8fd6" };
const BRASS = "#d9b24a", BRASS_DK = "#a8842a", HOLDER = "#5c4634", HOLDER_DK = "#43322a", GLASS = "rgba(214,236,250,0.55)";
const DIM_WALL = "#3f3a5c", DIM_TABLE = "#a9865a", TABLE = "#d9a35e";
type Glow = "bright" | "dim" | "faint" | "off";
type Pt = [number, number];

// a dim room: dark wall above, the table top below
const dimRoom = (c: Ctx) => { c.fillStyle = DIM_WALL; c.fillRect(0, 0, D, D); c.fillStyle = DIM_TABLE; c.fillRect(0, 330, D, D - 330); line(c, [[0, 330], [D, 330]], 6); };

// an insulated wire lying on the table through the points (smoothed; the ends are exact)
const wire = (c: Ctx, pts: number[][], col: string = WIRE.red, w = 9) => {
  const path = () => {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    if (pts.length === 2) c.lineTo(pts[1][0], pts[1][1]);
    else { for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); }
  };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = w + 7; c.stroke();
  path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
// a brass terminal screw
const screw = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.8), BRASS, 4); line(c, [[x - r * 0.5, y], [x + r * 0.5, y]], Math.max(3, r * 0.25), BRASS_DK); };
// a crocodile clip with its jaws' tip at (x, y), pointing at angle an; returns where its wire starts
const crocClip = (c: Ctx, x: number, y: number, an: number, col: string, s = 1): Pt => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -112, -16, 58, 32, 10), col, 5);
  shape(c, () => polyP(c, [[0, -4], [-28, -16], [-62, -12], [-62, 12], [-28, 16], [0, 4]]), COL.steel, 4);
  line(c, [[-8, -4], [-24, -11]], 3, COL.steelDk);
  c.restore();
  return [x - Math.cos(an) * 108 * s, y - Math.sin(an) * 108 * s];
};

// ---------------------------------------------------------------- cells and holders
// an AA cell lying on its side, centre (x, y); the plus nub on the right unless flip
const aaCell = (c: Ctx, x: number, y: number, len: number, dia: number, flip: boolean) => {
  const x0 = x - len / 2, x1 = x + len / 2, body = () => rrect(c, x0, y - dia / 2, len, dia, dia * 0.2);
  shape(c, body, COL.teal, 4); shade(c, body, COL.tealDk, 0, -dia * 0.4, 0.45);
  const bw = len * 0.18, bx = flip ? x0 : x1 - bw;
  shape(c, () => rrect(c, bx, y - dia / 2, bw, dia, dia * 0.2), COL.steel, 4);
  shape(c, () => rrect(c, flip ? x0 - dia * 0.22 : x1, y - dia * 0.22, dia * 0.22, dia * 0.44, 3), COL.steel, 4);
  write(c, "+", bx + bw * 0.5 - dia * 0.16, y - dia * 0.28, dia * 0.5, INK, 4);
};
// a holder with two AA cells, centre (x, y); returns its plus and minus terminals (red and black rings)
const cellHolder = (c: Ctx, x: number, y: number, s = 1, flip = false) => {
  const w = 280 * s, h = 130 * s, box = () => rrect(c, x - w / 2, y - h / 2, w, h, 10 * s);
  shadow(c, x + 12 * s, y + h / 2 + 6, w * 0.52, 14 * s);
  shape(c, box, HOLDER, 6); shade(c, box, HOLDER_DK, 0, -h * 0.12, 0.5);
  aaCell(c, x, y - 28 * s, 230 * s, 46 * s, flip); aaCell(c, x, y + 28 * s, 230 * s, 46 * s, flip);
  const d = flip ? -1 : 1, ty = y - h / 2 + 2, plus: Pt = [x + d * 118 * s, ty], minus: Pt = [x - d * 118 * s, ty];
  shape(c, () => ell(c, plus[0], plus[1], 19 * s, 15 * s), WIRE.red, 4); shape(c, () => ell(c, minus[0], minus[1], 19 * s, 15 * s), WIRE.black, 4);
  screw(c, plus[0], plus[1], 11 * s); screw(c, minus[0], minus[1], 11 * s);
  return { plus, minus };
};
// a flat 3 V coin cell seen face on, its plus face toward us, centre (x, y), radius r
const coinCell = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 1.02, r * 0.9, r * 0.14);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6); shade(c, () => ell(c, x, y, r, r), COL.steelDk, 0, -r * 0.16, 0.5);
  shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), COL.steelIn, 4);
  write(c, "+", x - r * 0.62, y - r * 0.5, r * 0.5, INK, Math.max(5, r * 0.06));
};
// a 9 V battery standing on its end, bottom centre (x, y); returns its two snap terminals
const battery9v = (c: Ctx, x: number, y: number, s = 1): Pt[] => {
  const w = 120 * s, h = 200 * s, body = () => rrect(c, x - w / 2, y - h, w, h, 8 * s);
  shadow(c, x + 10 * s, y + 4, w * 0.6, 12 * s);
  shape(c, body, "#2f3b55", 6); shade(c, body, "#1f2a40", 0, -h * 0.1, 0.45);
  shape(c, () => rrect(c, x - w * 0.36, y - h * 0.62, w * 0.72, h * 0.3, 6), COL.yellow, 4);
  write(c, "9", x - w * 0.13, y - h * 0.57, h * 0.2, INK, 5);
  const t: Pt[] = [[x - 30 * s, y - h], [x + 30 * s, y - h]];
  shape(c, () => ell(c, t[0][0], t[0][1], 13 * s, 9 * s), COL.steel, 4); shape(c, () => ell(c, t[0][0], t[0][1], 6 * s, 4 * s), COL.steelDk, 0);
  shape(c, () => polyP(c, [[t[1][0] - 13 * s, t[1][1]], [t[1][0] - 7 * s, t[1][1] - 10 * s], [t[1][0] + 7 * s, t[1][1] - 10 * s], [t[1][0] + 13 * s, t[1][1]], [t[1][0] + 7 * s, t[1][1] + 8 * s], [t[1][0] - 7 * s, t[1][1] + 8 * s]]), COL.steel, 4);
  return t;
};

// ---------------------------------------------------------------- bulbs
// a torch bulb whose screw base ends at (x, yb): a steel screw base and a glass ball with the filament inside
const bulb = (c: Ctx, x: number, yb: number, s: number, glow: Glow) => {
  const r = 46 * s, gy = yb - 36 * s - r + 6 * s;
  if (glow === "bright") {
    for (const [k, a] of [[2.3, 0.16], [1.8, 0.26], [1.35, 0.4]]) { c.globalAlpha = a; shape(c, () => ell(c, x, gy, r * k, r * k), COL.yellow, 0); }
    c.globalAlpha = 1;
    for (let i = 0; i < 8; i++) { const an = -PI / 2 + (i * PI) / 4 + PI / 8; line(c, [[x + Math.cos(an) * r * 2.5, gy + Math.sin(an) * r * 2.5], [x + Math.cos(an) * r * 3, gy + Math.sin(an) * r * 3]], 5 * s, COL.yellow); }
  }
  if (glow === "dim") { c.globalAlpha = 0.3; shape(c, () => ell(c, x, gy, r * 1.45, r * 1.45), COL.orange, 0); c.globalAlpha = 1; }
  const fill = glow === "bright" ? COL.yellow : glow === "dim" ? "#f3b765" : glow === "faint" ? "#efe3d4" : "#eef2f5";
  shape(c, () => ell(c, x, gy, r, r), fill, 5);
  const fy = gy + r * 0.05;
  if (glow !== "off") { c.globalAlpha = glow === "faint" ? 0.45 : 0.85; shape(c, () => ell(c, x, fy, 16 * s, 11 * s), glow === "faint" ? RED : glow === "dim" ? COL.orange : WHITE, 0); c.globalAlpha = 1; }
  line(c, [[x - 10 * s, yb - 34 * s], [x - 10 * s, fy]], 3.5 * s, INK); line(c, [[x + 10 * s, yb - 34 * s], [x + 10 * s, fy]], 3.5 * s, INK);
  const zig: number[][] = []; for (let i = 0; i <= 8; i++) zig.push([x - 10 * s + (20 * s * i) / 8, fy + (i % 2 ? -5 * s : 5 * s)]);
  line(c, zig, 3 * s, glow === "off" ? INK : glow === "faint" ? RED : glow === "dim" ? "#c25a10" : "#f5c84a");
  shine(c, [[x - r * 0.6, gy - r * 0.45], [x - r * 0.35, gy - r * 0.72]], 6 * s);
  shape(c, () => rrect(c, x - 22 * s, yb - 36 * s, 44 * s, 36 * s, 3 * s), COL.steel, 5);
  for (let k = 1; k <= 2; k++) line(c, [[x - 20 * s, yb - 36 * s + k * 11 * s], [x + 20 * s, yb - 36 * s + k * 11 * s]], 3, COL.steelDk);
  shape(c, () => rrect(c, x - 9 * s, yb - 4 * s, 18 * s, 8 * s, 3 * s), COL.steelDk, 3);
};
// a bulb holder, base bottom centre (x, y): dark base, brass screw on each side, steel socket and (unless empty) the bulb.
// Returns the two terminals and where the bulb's base sits when screwed in.
const bulbHolder = (c: Ctx, x: number, y: number, s: number, glow: Glow, empty = false) => {
  const base = () => rrect(c, x - 75 * s, y - 50 * s, 150 * s, 50 * s, 8 * s);
  shadow(c, x + 8 * s, y + 5, 82 * s, 10 * s);
  shape(c, base, HOLDER, 6); shade(c, base, HOLDER_DK, 0, -12 * s, 0.5);
  shape(c, () => rrect(c, x - 28 * s, y - 90 * s, 56 * s, 42 * s, 4 * s), COL.steel, 5);
  line(c, [[x - 26 * s, y - 70 * s], [x + 26 * s, y - 70 * s]], 3, COL.steelDk);
  const seat = y - 88 * s;
  if (!empty) bulb(c, x, seat, s, glow);
  else shape(c, () => ell(c, x, y - 90 * s, 22 * s, 6 * s), "#2b2340", 3);
  const l: Pt = [x - 55 * s, y - 38 * s], r: Pt = [x + 55 * s, y - 38 * s];
  screw(c, l[0], l[1], 11 * s); screw(c, r[0], r[1], 11 * s);
  return { l, r, seat };
};
// a bulb lifted out of its holder and held from above by the child's hand; a red arrow shows the unscrewing turn
const unscrew = (c: Ctx, x: number, seat: number, s: number, lift: number) => {
  const yb = seat - lift, gy = yb - 76 * s, hs = Math.max(0.8, s * 1.15);
  bulb(c, x, yb, s, "off");
  hand(c, x, gy - 70 * hs, PI / 2, hs);
  const pts: number[][] = []; for (let a = 0.1; a <= 0.9; a += 0.08) pts.push([x + Math.cos(a * PI) * 105 * s, yb - 14 * s + Math.sin(a * PI) * 34 * s]);
  arrow(c, pts.reverse(), RED, 8);
};
// a 5 mm red LED standing up, the bottom of its rim at (x, y), size s (1 = about 70 px tall). The long leg is on the
// side 'longSide' (-1 left, 1 right) and the flat edge of the rim on the other side. lit = glowing.
const led = (c: Ctx, x: number, y: number, s: number, lit: boolean, longSide: 1 | -1, legLong: number, legShort: number) => {
  const w = 50 * s, h = 70 * s, lx = x + longSide * 12 * s, sx = x - longSide * 12 * s;
  if (lit) { for (const [k, a] of [[2.4, 0.18], [1.8, 0.3]]) { c.globalAlpha = a; shape(c, () => ell(c, x, y - h * 0.55, w * k * 0.7, w * k * 0.7), COL.red, 0); } c.globalAlpha = 1; }
  line(c, [[lx, y], [lx, y + legLong]], 5 * s, COL.steelDk); line(c, [[lx, y], [lx, y + legLong]], 2.5 * s, COL.steelIn);
  line(c, [[sx, y], [sx, y + legShort]], 5 * s, COL.steelDk); line(c, [[sx, y], [sx, y + legShort]], 2.5 * s, COL.steelIn);
  const body = () => { c.moveTo(x - w / 2, y - 10 * s); c.lineTo(x - w / 2, y - h + w / 2); c.arc(x, y - h + w / 2, w / 2, PI, 0); c.lineTo(x + w / 2, y - 10 * s); c.closePath(); };
  shape(c, body, lit ? "#ff5a4a" : "#b8362b", 5);
  if (!lit) shade(c, body, "#7d241c", 0, -w * 0.3, 0.5);
  // the rim: a little wider, with a flat edge on the short-leg side
  const fl = -longSide;
  const rl = fl > 0 ? x - w * 0.66 : x - w * 0.48, rr = fl > 0 ? x + w * 0.48 : x + w * 0.66;
  shape(c, () => { c.moveTo(rl, y); c.lineTo(rl, y - 12 * s); c.lineTo(rr, y - 12 * s); c.lineTo(rr, y); c.closePath(); }, lit ? "#ff5a4a" : "#b8362b", 5);
  if (lit) { c.globalAlpha = 0.85; shape(c, () => ell(c, x, y - h * 0.58, w * 0.22, w * 0.3), "#fff0c8", 0); c.globalAlpha = 1; }
  shine(c, [[x - w * 0.28, y - h * 0.5], [x - w * 0.18, y - h * 0.75]], 5 * s);
};

// ---------------------------------------------------------------- circuit symbols
const cellSym = (c: Ctx, x: number, y: number, s: number, w = 5) => { line(c, [[x - 7 * s, y - 24 * s], [x - 7 * s, y + 24 * s]], w * 0.9); line(c, [[x + 7 * s, y - 12 * s], [x + 7 * s, y + 12 * s]], w * 2.2); };
const bulbSym = (c: Ctx, x: number, y: number, r: number, w = 5) => { shape(c, () => ell(c, x, y, r, r), COL.paper, w); line(c, [[x - r * 0.7, y - r * 0.7], [x + r * 0.7, y + r * 0.7]], w); line(c, [[x - r * 0.7, y + r * 0.7], [x + r * 0.7, y - r * 0.7]], w); };
const switchSym = (c: Ctx, x: number, y: number, len: number, open: boolean, w = 5) => {
  line(c, [[x - len / 2, y], [open ? x + len * 0.38 : x + len / 2, open ? y - len * 0.42 : y]], w);
  shape(c, () => ell(c, x - len / 2, y, w * 1.3, w * 1.3), INK, 0); shape(c, () => ell(c, x + len / 2, y, w * 1.3, w * 1.3), INK, 0);
};
// a paper tag with a symbol on a person's chest
const chestTag = (c: Ctx, x: number, y: number, s: number, kind: "cell" | "bulb") => {
  shape(c, () => rrect(c, x - 34 * s, y - 24 * s, 68 * s, 48 * s, 5 * s), WHITE, 4);
  if (kind === "cell") cellSym(c, x, y, s * 0.75, 4); else bulbSym(c, x, y, 16 * s, 4);
};
// a cloth bag of beans hanging from (x, y)
const bag = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 10 * s, y); c.quadraticCurveTo(x - 46 * s, y + 30 * s, x - 40 * s, y + 70 * s); c.quadraticCurveTo(x - 30 * s, y + 100 * s, x, y + 100 * s); c.quadraticCurveTo(x + 30 * s, y + 100 * s, x + 40 * s, y + 70 * s); c.quadraticCurveTo(x + 46 * s, y + 30 * s, x + 10 * s, y); c.closePath(); }, COL.brown, 5);
  line(c, [[x - 16 * s, y + 14 * s], [x + 16 * s, y + 14 * s]], 6 * s, COL.yellow);
};

// ================================================================ Bulb Teams set-up cards (e1)
// 1. one bulb on two cells: the control
const e1_0 = (c: Ctx) => {
  dimRoom(c);
  const h = cellHolder(c, 540, 900, 1.3), b = bulbHolder(c, 540, 600, 1.6, "bright");
  wire(c, [h.minus, [300, 740], b.l], WIRE.black); wire(c, [h.plus, [780, 740], b.r], WIRE.red);
  screw(c, b.l[0], b.l[1], 17); screw(c, b.r[0], b.r[1], 17);
};
// a row of bulbs in one loop with the holder below
const series = (c: Ctx, xs: number[], by: number, s: number, hx: number, hy: number, hs: number, glow: Glow) => {
  const h = cellHolder(c, hx, hy, hs), bs = xs.map((x) => bulbHolder(c, x, by, s, glow));
  wire(c, [h.minus, [xs[0] - 90 * s, hy - 150 * hs], bs[0].l], WIRE.black);
  wire(c, [h.plus, [xs[xs.length - 1] + 90 * s, hy - 150 * hs], bs[bs.length - 1].r], WIRE.red);
  for (let i = 0; i + 1 < bs.length; i++) wire(c, [bs[i].r, [(bs[i].r[0] + bs[i + 1].l[0]) / 2, by + 30 * s], bs[i + 1].l], WIRE.blue);
  bs.forEach((b) => { screw(c, b.l[0], b.l[1], 11 * s); screw(c, b.r[0], b.r[1], 11 * s); });
  return bs;
};
const e1_1 = (c: Ctx) => { dimRoom(c); series(c, [330, 750], 600, 1.3, 540, 900, 1.2, "dim"); };
const e1_2 = (c: Ctx) => { dimRoom(c); series(c, [200, 540, 880], 600, 1.1, 540, 900, 1.2, "faint"); };
// two bulbs side by side: one behind the other on the table, short wires joining left to left and right to right,
// the holder joined to the front bulb. Returns the two bulb holders (back, front).
const parallel = (c: Ctx, x: number, yBack: number, sBack: number, yFront: number, sFront: number, hy: number, hs: number, gBack: Glow, gFront: Glow, emptyBack = false) => {
  const a = bulbHolder(c, x, yBack, sBack, gBack, emptyBack), out = 90 * sFront;
  const b = bulbHolder(c, x, yFront, sFront, gFront), h = cellHolder(c, x, hy, hs);
  wire(c, [a.l, [x - out, (a.l[1] + b.l[1]) / 2 - 20], b.l], WIRE.blue); wire(c, [a.r, [x + out, (a.r[1] + b.r[1]) / 2 - 20], b.r], WIRE.blue);
  wire(c, [h.minus, [b.l[0] - 30 * sFront, (h.minus[1] + b.l[1]) / 2], b.l], WIRE.black); wire(c, [h.plus, [b.r[0] + 30 * sFront, (h.plus[1] + b.r[1]) / 2], b.r], WIRE.red);
  [a, b].forEach((q, i) => { const s = i ? sFront : sBack; screw(c, q.l[0], q.l[1], 11 * s); screw(c, q.r[0], q.r[1], 11 * s); });
  return { a, b };
};
const e1_3 = (c: Ctx) => { dimRoom(c); parallel(c, 540, 440, 1.0, 760, 1.2, 950, 1.1, "bright", "bright"); };
// 5. unscrew one bulb: in the row both go dark; side by side the other stays lit
const e1_4 = (c: Ctx) => {
  dimRoom(c);
  const bs = series(c, [200, 440], 600, 0.85, 320, 860, 0.85, "off");
  // the second bulb of the row is lifted out: draw its holder empty over the seated one
  bulbHolder(c, 440, 600, 0.85, "off", true); screw(c, bs[1].l[0], bs[1].l[1], 9); screw(c, bs[1].r[0], bs[1].r[1], 9);
  unscrew(c, 440, bs[1].seat, 0.85, 45);
  const p = parallel(c, 820, 450, 0.72, 700, 0.8, 920, 0.8, "off", "bright", true);
  unscrew(c, 820, p.a.seat, 0.72, 45);
};

// ================================================================ Which Way Round set-up cards (e2)
// 1. the bulb lights with the cells either way round
const e2_0 = (c: Ctx) => {
  ground(c);
  for (const [x, flip] of [[270, false], [810, true]] as [number, boolean][]) {
    const h = cellHolder(c, x, 860, 1.0, flip), b = bulbHolder(c, x, 560, 1.2, "bright");
    wire(c, [h.minus, [flip ? x + 190 : x - 190, 720], flip ? b.r : b.l], WIRE.black); wire(c, [h.plus, [flip ? x - 190 : x + 190, 720], flip ? b.l : b.r], WIRE.red);
    screw(c, b.l[0], b.l[1], 13); screw(c, b.r[0], b.r[1], 13);
  }
  // the turn: a red arrow curving over from the left holder to the right one
  const pts: number[][] = []; for (let a = PI * 0.75; a >= -PI * 0.75; a -= PI / 14) pts.push([810 + Math.cos(a) * 60, 1000 - Math.sin(a) * 50]);
  arrow(c, pts, RED, 8);
};
// 2. the LED close up: long leg plus, short leg minus, a flat edge on the short-leg side
const e2_1 = (c: Ctx) => {
  ground(c);
  led(c, 540, 560, 3.2, false, -1, 420, 280);
  write(c, "+", 360, 820, 90, INK, 9); write(c, "-", 630, 820, 90, INK, 9);
};
// the LED on a coin cell: the leg on side 'faceSide' lies on the plus face toward us, the other goes behind
const ledOnCell = (c: Ctx, x: number, y: number, r: number, lit: boolean, longOnFace: boolean, taped: boolean, held?: () => void) => {
  const s = r / 130, legTop = y - r - 2;
  // the leg that goes behind the cell is drawn first, from the LED down to the rim
  const long: 1 | -1 = longOnFace ? 1 : -1;
  coinCell(c, x, y, r); if (held) held();
  // the leg on the face: from the LED's rim down the face, ending in a bent foot
  const fx = x + (longOnFace ? 1 : -1) * 12 * 1.6 * s, fy = y + r * 0.3;
  line(c, [[fx, legTop], [fx, fy], [fx + 26 * s, fy]], 8 * s, COL.steelDk); line(c, [[fx, legTop], [fx, fy], [fx + 26 * s, fy]], 4 * s, COL.steelIn);
  led(c, x, legTop, 1.6 * s, lit, long, longOnFace ? 0 : 0, longOnFace ? 0 : 0);
  // the short stub of the other leg disappearing behind the rim
  const bx = x - (longOnFace ? 1 : -1) * 12 * 1.6 * s;
  line(c, [[bx, legTop - 2], [bx, legTop + 6]], 8 * s, COL.steelDk);
  if (taped) { c.globalAlpha = 0.5; shape(c, () => rrect(c, x - r * 0.5, y - r * 0.1, r, r * 0.55, 6), "#fff6d6", 4); c.globalAlpha = 1; }
};
// 3. a grown-up holds the coin cell; long leg to plus, short leg behind: the LED glows
const e2_2 = (c: Ctx) => {
  ground(c);
  ledOnCell(c, 540, 620, 140, true, true, false, () => hand(c, 540, 780, -PI / 2, 1.7, SKIN.adult, CLOTH.adult));
};
// 4. turned round it stays dark; two LEDs facing opposite ways on one cell, only one glows
const e2_3 = (c: Ctx) => {
  ground(c);
  ledOnCell(c, 270, 640, 125, false, false, true);
  const pts: number[][] = []; for (let a = PI * 0.95; a >= PI * 0.05; a -= PI / 14) pts.push([270 + Math.cos(a) * 120, 345 - Math.sin(a) * 55]);
  arrow(c, pts, RED, 8);
  // two LEDs on one cell
  const x = 790, y = 640, r = 125, s = r / 130, top = y - r - 2;
  coinCell(c, x, y, r);
  for (const [dx, longOnFace] of [[-50, true], [50, false]] as [number, boolean][]) {
    const lx = x + dx, fx = lx + (longOnFace ? 1 : -1) * 19 * s, fy = y + r * 0.32;
    line(c, [[fx, top], [fx, fy], [fx + 24 * s, fy]], 8 * s, COL.steelDk); line(c, [[fx, top], [fx, fy], [fx + 24 * s, fy]], 4 * s, COL.steelIn);
    led(c, lx, top, 1.5 * s, longOnFace, longOnFace ? 1 : -1, 0, 0);
    const bx = lx - (longOnFace ? 1 : -1) * 18 * s; line(c, [[bx, top - 2], [bx, top + 6]], 8 * s, COL.steelDk);
  }
  c.globalAlpha = 0.5; shape(c, () => rrect(c, x - r * 0.7, y - r * 0.1, r * 1.4, r * 0.55, 6), "#fff6d6", 4); c.globalAlpha = 1;
};

// ================================================================ flow cards
// Bulb Teams: the child beside the table points at the two layouts, two dim bulbs in a row and two bright side by side
const flow_e1 = (c: Ctx) => {
  dimRoom(c);
  shape(c, () => rrect(c, 300, 560, 740, 560, 16), TABLE, 6);
  series(c, [430, 640], 800, 0.66, 535, 1010, 0.62, "dim");
  parallel(c, 880, 740, 0.52, 890, 0.6, 1010, 0.58, "bright", "bright");
  person(c, 150, 1030, 560, { reachL: [335, 660], armR: [PI * 0.55, PI * 0.5] });
};
// Which Way Round: a torch bulb bright on its cells, and an LED glowing on a coin cell
const flow_e2 = (c: Ctx) => {
  ground(c);
  const h = cellHolder(c, 280, 880, 1.0), b = bulbHolder(c, 280, 560, 1.25, "bright");
  wire(c, [h.minus, [100, 730], b.l], WIRE.black); wire(c, [h.plus, [460, 730], b.r], WIRE.red);
  screw(c, b.l[0], b.l[1], 13); screw(c, b.r[0], b.r[1], 13);
  ledOnCell(c, 800, 730, 120, true, true, false, () => hand(c, 800, 870, -PI / 2, 1.5, SKIN.adult, CLOTH.adult));
};
// Circuit Detectives: two children on the floor, one reads a card held up beside her, the other thinks; the pile between
const flow_g1 = (c: Ctx) => {
  ground(c);
  // the pile of cards
  for (let i = 0; i < 6; i++) shape(c, () => rrect(c, 430 + i * 3, 850 - i * 7, 220, 140, 10), i === 5 ? WHITE : COL.paper, 5);
  const tx = 540, ty = 885;
  line(c, [[tx - 70, ty - 35], [tx + 70, ty - 35], [tx + 70, ty + 35], [tx - 70, ty + 35], [tx - 70, ty - 35]], 4);
  cellSym(c, tx - 70, ty, 0.5, 4); bulbSym(c, tx - 20, ty - 35, 12, 4); bulbSym(c, tx + 30, ty - 35, 12, 4);
  c.beginPath(); c.arc(tx + 112, ty - 14, 14, PI * 1.1, PI * 0.45); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); line(c, [[tx + 118, ty - 2], [tx + 118, ty + 6]], 5); shape(c, () => ell(c, tx + 118, ty + 18, 3.5, 3.5), INK, 0);
  // the reader: her card held up beside her head in her left hand (viewer's right), the other hand on a knee
  const r = person(c, 280, 820, 420, { sit: true, dir: 1, reachL: [405, 640], reachR: [195, 790] });
  shape(c, () => rrect(c, r.handL[0] - 10, r.handL[1] - 130, 175, 125, 8), WHITE, 5);
  line(c, [[r.handL[0] + 20, r.handL[1] - 100], [r.handL[0] + 135, r.handL[1] - 100]], 5, COL.grey); line(c, [[r.handL[0] + 20, r.handL[1] - 72], [r.handL[0] + 135, r.handL[1] - 72]], 5, COL.grey); line(c, [[r.handL[0] + 20, r.handL[1] - 44], [r.handL[0] + 95, r.handL[1] - 44]], 5, COL.grey);
  // the thinker: a hand at the chin, the other on a knee
  person(c, 800, 820, 420, { sit: true, dir: -1, reachR: [768, 690], reachL: [895, 790] });
};
// Draw It Like an Engineer: a ruled diagram of a cell, a switch and two bulbs side by side, with pencil and ruler
const flow_a1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 360, 24);
  shape(c, () => rrect(c, 180, 130, 720, 800, 6), COL.paper, 6);
  for (let y = 200; y < 900; y += 50) line(c, [[200, y], [880, y]], 2, "#d8dfe8");
  const L = 290, R = 760, T = 300, B = 780, m = 580;
  line(c, [[L, T], [470, T]], 7); switchSym(c, 520, T, 100, true, 7); line(c, [[570, T], [R, T]], 7);
  line(c, [[L, B], [R, B]], 7);
  line(c, [[L, T], [L, 505]], 7); line(c, [[L, 575], [L, B]], 7);
  line(c, [[L - 46, 520], [L + 46, 520]], 6); line(c, [[L - 24, 560], [L + 24, 560]], 15);
  for (const x of [m, R]) { line(c, [[x, T], [x, 500]], 7); line(c, [[x, 580], [x, B]], 7); bulbSym(c, x, 540, 40, 7); }
  shape(c, () => ell(c, m, T, 8, 8), INK, 0); shape(c, () => ell(c, m, B, 8, 8), INK, 0);
  // ruler and pencil
  shape(c, () => polyP(c, [[930, 150], [1010, 150], [1010, 900], [930, 900]]), COL.wood, 5);
  for (let k = 0; k <= 28; k++) line(c, [[930, 180 + k * 25], [k % 2 ? 950 : 962, 180 + k * 25]], 3);
  const pen = () => { c.save(); c.translate(540, 1000); c.rotate(-0.08); shape(c, () => rrect(c, -300, -20, 540, 40, 8), COL.orange, 5); shape(c, () => polyP(c, [[240, -20], [300, 0], [240, 20]]), COL.wood, 5); shape(c, () => polyP(c, [[282, -6], [300, 0], [282, 6]]), INK, 0); shape(c, () => rrect(c, -340, -20, 50, 40, 6), COL.pink, 5); c.restore(); };
  pen();
};
// Pencil Dimmer: a shaved pencil, one clip at the end of the lead and one sliding along it, the bulb dim
const flow_a2 = (c: Ctx) => {
  ground(c);
  const y = 520;
  shadow(c, 560, y + 46, 390, 16);
  shape(c, () => rrect(c, 150, y - 30, 740, 60, 10), COL.green, 6);
  shape(c, () => polyP(c, [[890, y - 30], [970, y], [890, y + 30]]), COL.wood, 5); shape(c, () => polyP(c, [[948, y - 8], [970, y], [948, y + 8]]), INK, 0);
  shape(c, () => rrect(c, 110, y - 30, 60, 60, 8), COL.steel, 5); shape(c, () => rrect(c, 70, y - 26, 50, 52, 8), COL.pink, 5);
  // the shaved side: pale wood with the dark lead strip along the middle
  shape(c, () => polyP(c, [[300, y - 30], [860, y - 30], [850, y - 6], [310, y - 6]]), COL.wood, 4);
  shape(c, () => rrect(c, 320, y - 22, 520, 12, 4), "#4a4a52", 3);
  const h = cellHolder(c, 290, 900, 1.0), b = bulbHolder(c, 820, 880, 1.1, "dim");
  const w1 = crocClip(c, 335, y - 16, PI * 0.3, WIRE.black, 0.9), w2 = crocClip(c, 600, y - 16, PI * 0.72, WIRE.red, 0.9);
  wire(c, [w1, [150, 650], h.minus], WIRE.black);
  wire(c, [w2, [700, 700], b.l], WIRE.red);
  wire(c, [b.r, [660, 1010], h.plus], WIRE.blue);
  screw(c, b.l[0], b.l[1], 12); screw(c, b.r[0], b.r[1], 12);
  arrow(c, [[640, 605], [800, 605]], RED, 8);
};
// Fuse Test: a grown-up holds a strand of steel wool across the snaps of a 9 V battery, on a tray, water beside
const flow_a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 470, 28);
  shape(c, () => polyP(c, [[120, 620], [960, 620], [1040, 910], [40, 910]]), COL.steel, 6);
  shape(c, () => polyP(c, [[155, 645], [930, 645], [995, 885], [85, 885]]), COL.steelIn, 4);
  // spare strands on the tray
  for (let i = 0; i < 3; i++) line(c, [[160 + i * 40, 790 + i * 20], [220 + i * 40, 780 + i * 20], [280 + i * 40, 798 + i * 20], [330 + i * 40, 786 + i * 20]], 4, COL.greyDk);
  // a bowl of water
  shadow(c, 850, 810, 120, 20);
  shape(c, () => { c.moveTo(720, 720); c.bezierCurveTo(732, 840, 948, 840, 960, 720); c.closePath(); }, COL.steel, 6);
  shape(c, () => ell(c, 840, 720, 120, 30), COL.water, 5); shape(c, () => ell(c, 805, 713, 30, 7), COL.drop, 0);
  const t = battery9v(c, 430, 770, 1.6);
  // the strand: from the fingers down to the snaps, lying across both; glowing between them
  const wx = 800, wy = 330, an = PI * 0.86, hs = 1.7;
  hand(c, wx, wy, an, hs, SKIN.adult, CLOTH.adult);
  const gx = wx + Math.cos(an) * 70 * hs, gy = wy + Math.sin(an) * 70 * hs;
  line(c, [[gx, gy], [600, 420], [t[1][0] + 40, t[1][1] - 8], [t[1][0], t[1][1] - 5], [t[0][0], t[0][1] - 5], [t[0][0] - 50, t[0][1] + 4]], 5, COL.greyDk);
  line(c, [[t[1][0] + 4, t[1][1] - 5], [t[0][0] - 4, t[0][1] - 5]], 12, COL.orange); line(c, [[t[1][0] + 2, t[1][1] - 5], [t[0][0] - 2, t[0][1] - 5]], 5, COL.yellow);
  for (const [dx, dy] of [[-30, -44], [14, -56], [50, -38], [-54, -20], [68, -12]]) line(c, [[t[0][0] + 48 + dx * 0.4, t[0][1] - 12 + dy * 0.4], [t[0][0] + 48 + dx, t[0][1] - 12 + dy]], 4, COL.orange);
};
// Be the Festival Lights: five children in a ring, the cell child at the back passes the bag of beans round
const flow_a4 = (c: Ctx) => {
  ground(c);
  const P: [number, number, number][] = [[160, 690, 330], [350, 575, 305], [540, 530, 290], [730, 575, 305], [920, 690, 330]];
  const sh = (i: number): Pt => [P[i][0], P[i][1] - P[i][2] * 0.64];
  const meet = (i: number): Pt => { const a = sh(i), b = sh(i + 1), ow = P[i][2] * 0.105, ow2 = P[i + 1][2] * 0.105; return [(a[0] + ow + b[0] - ow2) / 2, (a[1] + b[1]) / 2 + 28]; };
  const M = [meet(0), meet(1), meet(2), meet(3)];
  const order = [2, 1, 3, 0, 4];
  for (const i of order) {
    const [x, y, h] = P[i];
    person(c, x, y, h, { reachL: i < 4 ? M[i] : undefined, reachR: i > 0 ? M[i - 1] : undefined, armR: [PI * 0.56, PI * 0.5], armL: [PI * 0.44, PI * 0.5] });
    chestTag(c, x, y - h * 0.5, h / 330, i === 2 ? "cell" : "bulb");
  }
  bag(c, M[2][0], M[2][1] + 4, 0.75);
};
// Build a Three-Bulb Festival String: foil rails on cardboard, three bulbs across them, a paper-clip switch, cells
const flow_p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 640, 905, 400, 26);
  shape(c, () => polyP(c, [[300, 420], [980, 420], [1030, 890], [250, 890]]), "#c89a62", 6);
  shade(c, () => polyP(c, [[300, 420], [980, 420], [1030, 890], [250, 890]]), "#a87c48", 0, -30, 0.35);
  const rT = 530, rB = 790;
  const rail = (y: number) => { shape(c, () => rrect(c, 300, y - 16, 660, 32, 4), COL.steelIn, 4); shine(c, [[320, y - 6], [700, y - 6]], 5); };
  rail(rB);
  shape(c, () => rrect(c, 300, rT - 16, 120, 32, 4), COL.steelIn, 4); shape(c, () => rrect(c, 500, rT - 16, 460, 32, 4), COL.steelIn, 4); shine(c, [[520, rT - 6], [700, rT - 6]], 5);
  // the paper-clip switch: a clip on the left pin, swung onto the right pin, closed
  shape(c, () => rrect(c, 418, rT - 7, 84, 14, 7), COL.steelIn, 4); line(c, [[430, rT - 3], [486, rT - 3]], 3, COL.steelDk);
  for (const x of [412, 500]) shape(c, () => ell(c, x, rT, 13, 13), COL.yellow, 4);
  const h = cellHolder(c, 125, 700, 0.78);
  wire(c, [h.plus, [260, 740], [300, rB]], WIRE.red); wire(c, [h.minus, [20, 600], [200, 520], [300, rT]], WIRE.black);
  for (const x of [580, 760, 940]) {
    shape(c, () => rrect(c, x - 36, rT - 24, 72, rB - rT + 48, 8), HOLDER, 6);
    screw(c, x, rT, 11); screw(c, x, rB, 11);
    shape(c, () => rrect(c, x - 26, 690, 52, 40, 4), COL.steel, 5);
    bulb(c, x, 692, 0.95, "bright");
  }
};

// ================================================================ term cards
// Filament: a big torch bulb, the glass clear, the tiny coil glowing between two thick support wires
const term_5 = (c: Ctx) => {
  ground(c);
  const x = 540, gy = 440, r = 290;
  for (const [k, a] of [[1.25, 0.12], [1.1, 0.18]]) { c.globalAlpha = a; shape(c, () => ell(c, x, gy, r * k, r * k), COL.yellow, 0); }
  c.globalAlpha = 1;
  shape(c, () => ell(c, x, gy, r, r), GLASS, 6);
  // the glass stem and the two thick supports
  shape(c, () => rrect(c, x - 60, 600, 120, 150, 20), "rgba(214,236,250,0.9)", 5);
  line(c, [[x - 70, 640], [x - 70, 400]], 14, INK); line(c, [[x + 70, 640], [x + 70, 400]], 14, INK);
  line(c, [[x - 70, 640], [x - 70, 400]], 7, COL.steel); line(c, [[x + 70, 640], [x + 70, 400]], 7, COL.steel);
  // the coil: a glow, then a tight zigzag
  c.globalAlpha = 0.7; shape(c, () => ell(c, x, 400, 110, 50), "#fff3b0", 0); c.globalAlpha = 1;
  const zig: number[][] = []; for (let i = 0; i <= 22; i++) zig.push([x - 70 + (140 * i) / 22, 400 + (i % 2 ? -18 : 18)]);
  line(c, zig, 9, INK); line(c, zig, 5, "#f5c84a");
  shine(c, [[x - r * 0.62, gy - r * 0.4], [x - r * 0.38, gy - r * 0.7]], 12);
  shadow(c, x + 20, 1000, 180, 24);
  shape(c, () => rrect(c, x - 135, 720, 270, 230, 16), COL.steel, 6);
  for (let k = 1; k <= 4; k++) line(c, [[x - 125, 720 + k * 44], [x + 125, 720 + k * 44]], 6, COL.steelDk);
  shape(c, () => rrect(c, x - 50, 946, 100, 40, 12), COL.steelDk, 5);
};
// Fuse: a glass fuse whole on the left, and one whose thin wire has melted through on the right
const term_10 = (c: Ctx) => {
  ground(c);
  const fuse = (x: number, y: number, blown: boolean) => {
    shadow(c, x + 10, y + 72, 230, 20);
    shape(c, () => rrect(c, x - 190, y - 55, 380, 110, 30), GLASS, 6);
    if (blown) { c.globalAlpha = 0.35; shape(c, () => ell(c, x, y, 70, 40), INK, 0); c.globalAlpha = 1; }
    if (!blown) line(c, [[x - 150, y], [x + 150, y]], 5, COL.greyDk);
    else { line(c, [[x - 150, y], [x - 40, y], [x - 28, y - 12]], 5, COL.greyDk); line(c, [[x + 150, y], [x + 40, y], [x + 28, y + 12]], 5, COL.greyDk); shape(c, () => ell(c, x - 26, y - 14, 9, 9), COL.greyDk, 3); shape(c, () => ell(c, x + 26, y + 14, 9, 9), COL.greyDk, 3); }
    for (const sx of [-1, 1]) { shape(c, () => rrect(c, x + sx * 190 - 35, y - 62, 70, 124, 8), COL.steel, 6); line(c, [[x + sx * 190 - 20, y - 50], [x + sx * 190 - 20, y + 50]], 3, COL.steelDk); }
    shine(c, [[x - 120, y - 38], [x + 60, y - 38]], 7);
  };
  fuse(285, 540, false);
  fuse(795, 540, true);
};

export const ic_electricitySimpleCircuitsL4 = cards("sci.electricity.simple-circuits.L4", [
  e1_0, e1_1, e1_2, e1_3, e1_4, e2_0, e2_1, e2_2, e2_3, // 0-8 set-up
  flow_e1, flow_e2, flow_g1, flow_a1, flow_a2, flow_a3, flow_a4, flow_p1, // 9-16
  term_5, term_10, // 17-18
]);
