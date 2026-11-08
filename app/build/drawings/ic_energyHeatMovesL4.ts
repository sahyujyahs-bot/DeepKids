import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, person, write, cards } from "./flatKit";

// HEAT ON THE MOVE (sci.energy.heat-moves.L4) · set-up cards and lead pictures in the flat kit.
// Set-up cards first (g1, e1, e2, a1, a2, a3, a4, p1), then the lead pictures.
const TABLE = "#e8c98c", TABLE_DK = "#c9a263", FLOOR = "#ddd2bd", CLAY = "#c8713f", CLAY_DK = "#9a5230", OIL = "#e0a83c";
const FOIL = "#cfd6de", FOIL_DK = "#9aa6b4", CARD = "#d9a86b", CARD_TOP = "#e6bd84", CARD_SIDE = "#a5733f", DAL = "#f0b440", NIGHT = "#2b3560", SKY = "#cfe7f7";
const PI = Math.PI;

// ---------------------------------------------------------------- shared things
// a table across the card: its top face from y down `depth`, then the front face to the bottom
const table = (c: Ctx, y: number, depth = 120) => { c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); c.fillStyle = TABLE_DK; c.fillRect(0, y + depth, D, D - y - depth); line(c, [[0, y], [D, y]], 6); line(c, [[0, y + depth], [D, y + depth]], 5); };
// a shorter table piece (so a person can stand on the floor beside it)
const tablePiece = (c: Ctx, x0: number, x1: number, y: number, depth: number) => { shape(c, () => polyP(c, [[x0, y], [x1, y], [x1, y + depth], [x0, y + depth]]), TABLE); shape(c, () => polyP(c, [[x0, y + depth], [x1, y + depth], [x1, D], [x0, D]]), TABLE_DK); };
const floor = (c: Ctx, y: number, col = FLOOR) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
// a teardrop flame standing on (x, y), tip at y - h
const flame = (c: Ctx, x: number, y: number, h: number) => {
  const w = h * 0.36, tear = (hh: number, ww: number) => () => { c.moveTo(x, y - hh); c.bezierCurveTo(x + ww * 1.4, y - hh * 0.45, x + ww, y + hh * 0.05, x, y + hh * 0.08); c.bezierCurveTo(x - ww, y + hh * 0.05, x - ww * 1.4, y - hh * 0.45, x, y - hh); c.closePath(); };
  shape(c, tear(h, w), COL.orange, 5); shape(c, tear(h * 0.55, w * 0.55), COL.yellow, 0); shape(c, () => ell(c, x, y, w * 0.35, h * 0.06), COL.blue, 0);
};
// a round clay diya with oil and a wick, base centre (x, y); returns the flame's base point
const diya = (c: Ctx, x: number, y: number, s: number): [number, number] => {
  const w = 90 * s, h = 55 * s;
  shadow(c, x + 12 * s, y + 4, w * 1.05, 10 * s);
  const body = () => { c.moveTo(x - w, y - h); c.bezierCurveTo(x - w * 0.95, y + h * 0.3, x - w * 0.55, y, x - w * 0.5, y); c.lineTo(x + w * 0.5, y); c.bezierCurveTo(x + w * 0.55, y, x + w * 0.95, y + h * 0.3, x + w, y - h); c.closePath(); };
  shape(c, body, CLAY); shade(c, body, CLAY_DK, w * 0.35, 0);
  shape(c, () => ell(c, x, y - h, w, h * 0.3), OIL, 5);
  shape(c, () => rrect(c, x - 5 * s, y - h - 22 * s, 10 * s, 26 * s, 4), "#f4ecd8", 4);
  flame(c, x, y - h - 20 * s, 110 * s);
  return [x, y - h - 20 * s];
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6; shape(c, () => polyP(c, [[x + Math.cos(a - 0.13) * r * 1.12, y + Math.sin(a - 0.13) * r * 1.12], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6], [x + Math.cos(a + 0.13) * r * 1.12, y + Math.sin(a + 0.13) * r * 1.12]]), COL.yellow, 4); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.2, 0.45);
};
const moon = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "#f4e9b8"); c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); shape(c, () => ell(c, x - r * 0.45, y - r * 0.2, r * 0.9, r * 0.9), NIGHT, 0); c.restore(); };
// a wavy line from (x1, y1) to (x2, y2); head = true ends it with an arrow head
const wavy = (c: Ctx, x1: number, y1: number, x2: number, y2: number, amp: number, col: string, w: number, head = false) => {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, n = 48, pts: number[][] = [];
  for (let i = 0; i <= n; i++) { const t = i / n, s = Math.sin(t * PI * 2 * (L / 100)) * amp * (head ? Math.min(1, (1 - t) * 4) : 1); pts.push([x1 + dx * t + nx * s, y1 + dy * t + ny * s]); }
  if (head) { pts.push([x2 + (dx / L) * 18, y2 + (dy / L) * 18]); arrow(c, pts, col, w); } else line(c, pts, w, col);
};
const steam = (c: Ctx, x: number, y: number, n: number, h: number) => { for (let i = 0; i < n; i++) wavy(c, x + (i - (n - 1) / 2) * 34, y, x + (i - (n - 1) / 2) * 34, y - h, 9, "#9aa3ad", 6); };
const ice = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => rrect(c, x - s, y - s, s * 2, s * 2, s * 0.3), "#dff1fb", 4); shine(c, [[x - s * 0.6, y - s * 0.5], [x - s * 0.6, y + s * 0.4]], 5); };
// a thermometer standing upright at x, top at yTop, bulb at yTop + len; frac = how high the red is
const thermo = (c: Ctx, x: number, yTop: number, len: number, frac: number, s = 1) => {
  const yb = yTop + len, tube = 28 * s;
  shape(c, () => rrect(c, x - tube / 2, yTop, tube, len - 10 * s, tube / 2), COL.paper, 5 * s);
  for (let i = 0; i < 8; i++) { const ty = yTop + 25 * s + (i * (len - 70 * s)) / 7; line(c, [[x + tube * 0.1, ty], [x + tube * 0.42, ty]], 2.5 * s, INK); }
  const colTop = yb - 20 * s - (len - 60 * s) * frac;
  shape(c, () => rrect(c, x - 5 * s, colTop, 10 * s, yb - colTop, 5 * s), RED, 0);
  shape(c, () => ell(c, x, yb, 22 * s, 22 * s), RED, 5 * s);
};
// a steel tumbler, base centre (x, y), wrapped in black paper, white paper or foil, with a rubber band
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, wrap: "black" | "white" | "foil") => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  const col = wrap === "black" ? COL.black : wrap === "white" ? WHITE : FOIL, dk = wrap === "black" ? "#1f1c24" : wrap === "white" ? "#dcd6cc" : FOIL_DK;
  shape(c, body, col); shade(c, body, dk, w * 0.3, 0);
  if (wrap === "foil") { shine(c, [[x - top * 0.55, y - h * 0.9], [x - bot * 0.55, y - h * 0.1]], 10); shine(c, [[x + top * 0.15, y - h * 0.9], [x + bot * 0.2, y - h * 0.1]], 6); }
  const by = y - h * 0.55, bw = bot + (top - bot) * 0.55;
  line(c, [[x - bw, by], [x + bw, by]], 11, "#6b5a8c"); line(c, [[x - bw, by], [x + bw, by]], 4, "#52446e");
  shape(c, () => ell(c, x, y - h, top, w * 0.08), COL.steelIn, 5);
};
// a foil lid on a tumbler whose top centre is (x, y); a slit for the thermometer in the middle
const foilLid = (c: Ctx, x: number, y: number, w: number) => { shape(c, () => ell(c, x, y, w / 2 + 10, w * 0.11), FOIL, 5); shine(c, [[x - w * 0.35, y - 4], [x - w * 0.1, y - 6]], 6); line(c, [[x - 16, y], [x + 16, y]], 7, INK); };
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 26) => {
  const an = Math.atan2(y2 - y1, x2 - x1), ux = Math.cos(an), uy = Math.sin(an);
  line(c, [[x1, y1], [x2 - ux * w, y2 - uy * w]], w + 8, INK); line(c, [[x1, y1], [x2 - ux * w, y2 - uy * w]], w, COL.yellow);
  line(c, [[x1, y1], [x1 + ux * w * 0.9, y1 + uy * w * 0.9]], w, COL.pink);
  shape(c, () => polyP(c, [[x2 - ux * w * 1.2 - uy * w * 0.5, y2 - uy * w * 1.2 + ux * w * 0.5], [x2 - ux * w * 1.2 + uy * w * 0.5, y2 - uy * w * 1.2 - ux * w * 0.5], [x2, y2]]), "#f4ecd8", 4);
  shape(c, () => ell(c, x2 - ux * 6, y2 - uy * 6, 5, 5), INK, 0);
};
// a straw from (x1, y1) at the bottom to (x2, y2) at the top; red = how much of it holds red water, from the bottom
const straw = (c: Ctx, x1: number, y1: number, x2: number, y2: number, red = 0) => {
  line(c, [[x1, y1], [x2, y2]], 30, INK); line(c, [[x1, y1], [x2, y2]], 20, "#f6f6f2");
  if (red > 0) line(c, [[x1, y1], [x1 + (x2 - x1) * red, y1 + (y2 - y1) * red]], 11, "#e4523b");
};
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.18, y - r * 1.25, r * 0.36, r * 0.3, 5), COL.steelDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.steel); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let i = 0; i < 12; i++) { const a = (i * PI) / 6; line(c, [[x + Math.cos(a) * r * 0.68, y + Math.sin(a) * r * 0.68], [x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76]], 3, INK); }
  line(c, [[x, y], [x + r * 0.2, y - r * 0.62]], 5, RED); shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
// a game token: a coloured disc with the kind's mark, or face down (grey)
const TOK = [COL.teal, COL.blue, COL.orange, COL.purple];
const mark = (c: Ctx, x: number, y: number, s: number, kind: number) => {
  if (kind === 0) arrow(c, [[x - s, y + s * 0.1], [x + s, y + s * 0.1]], INK, Math.max(4, s * 0.2));
  if (kind === 1) { const pts: number[][] = []; for (let a = PI * 0.6; a <= PI * 2.25; a += 0.2) pts.push([x + Math.cos(a) * s * 0.75, y + Math.sin(a) * s * 0.75]); arrow(c, pts, INK, Math.max(4, s * 0.2)); }
  if (kind === 2) for (let i = -1; i <= 1; i++) wavy(c, x - s * 0.9, y + i * s * 0.55, x + s * 0.9, y + i * s * 0.55, s * 0.16, INK, Math.max(3, s * 0.16));
  if (kind === 3) write(c, "+", x - s * 0.55, y - s * 1.05, s * 1.9, INK, Math.max(5, s * 0.22));
};
const token = (c: Ctx, x: number, y: number, r: number, kind: number, up: boolean) => {
  shadow(c, x + 4, y + 6, r, r * 0.55);
  if (!up) { shape(c, () => ell(c, x, y, r, r * 0.78), COL.grey); shape(c, () => ell(c, x, y, r * 0.7, r * 0.52), COL.greyDk, 3); return; }
  shape(c, () => ell(c, x, y, r, r * 0.78), TOK[kind]); mark(c, x, y, r * 0.55, kind);
};
// a game card: the front has a little picture (a spoon in a katori of sambar) and lines of text, the back a band and the answer lines
const gameCard = (c: Ctx, x: number, y: number, w: number, h: number, back: boolean, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 10, h / 2 + 6, w * 0.55, 12);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, w * 0.1), back ? "#fff1cf" : WHITE);
  const tl = (y0: number, n: number) => { for (let i = 0; i < n; i++) line(c, [[-w * 0.36, y0 + i * h * 0.12], [w * (i === n - 1 ? 0.02 : 0.36), y0 + i * h * 0.12]], h * 0.04, "#cfc8bb"); };
  if (back) { shape(c, () => rrect(c, -w * 0.38, -h * 0.4, w * 0.76, h * 0.16, 8), COL.teal, 0); tl(-h * 0.1, 4); }
  else { bowl(c, 0, -h * 0.12, w * 0.28, "#e9a23b"); line(c, [[w * 0.08, -h * 0.1], [w * 0.3, -h * 0.4]], 10, INK); line(c, [[w * 0.08, -h * 0.1], [w * 0.3, -h * 0.4]], 5, COL.steel); tl(h * 0.17, 3); }
  c.restore();
};
const cardPile = (c: Ctx, x: number, y: number, w: number, h: number) => { for (let i = 0; i < 6; i++) shape(c, () => rrect(c, x - w / 2 + i * 2, y - h / 2 - i * 3, w, h, w * 0.1), WHITE, 4); gameCard(c, x + 12, y - 18, w, h, false); };
// a child's open palm facing the viewer, fingers up, wrist at (x, y); the arm runs down to armTo
const palm = (c: Ctx, x: number, y: number, s: number, thumbSide: 1 | -1, armTo: [number, number]) => {
  line(c, [[x, y + 20 * s], armTo], 76 * s, INK); line(c, [[x, y + 20 * s], armTo], 62 * s, CLOTH.child);
  shape(c, () => rrect(c, x - 44 * s, y - 6 * s, 88 * s, 60 * s, 16 * s), CLOTH.childDk, 5);
  const fin = [[-42, 74], [-14, 96], [14, 100], [42, 86]];
  fin.forEach(([fx, fh]) => shape(c, () => rrect(c, x + (fx - 13) * s, y - 110 * s - fh * s, 26 * s, fh * s + 30 * s, 12 * s), "#b9794f", 5));
  shape(c, () => rrect(c, x - 56 * s, y - 118 * s, 112 * s, 124 * s, 24 * s), "#b9794f", 5);
  shape(c, () => ell(c, x + thumbSide * 64 * s, y - 78 * s, 20 * s, 44 * s, thumbSide * 0.45), "#b9794f", 5);
  line(c, [[x - 20 * s, y - 60 * s], [x + 8 * s, y - 40 * s]], 3, "#9c6240"); line(c, [[x - 12 * s, y - 86 * s], [x + 20 * s, y - 70 * s]], 3, "#9c6240");
};
// a thin card standing upright on the table, bottom centre (x, y), held in a small clip
const standCard = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 14, y + 4, w * 0.8, 10); shape(c, () => rrect(c, x - 14, y - 26, 28, 30, 6), COL.black, 4); shape(c, () => rrect(c, x - w / 2, y - h, w, h - 10, 4), WHITE, 5); shade(c, () => rrect(c, x - w / 2, y - h, w, h - 10, 4), "#e0dacf", w * 0.5, 0, 0.6); };
// a hanging paper snake (the cut spiral), thread top at (x, yTop), coils widening down to yBot
const snake = (c: Ctx, x: number, yTop: number, yBot: number, r0: number, r1: number) => {
  line(c, [[x, yTop - 60], [x, yTop]], 3, INK);
  const pts: number[][] = [], turns = 4.5, n = 200;
  for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * PI * 2 - PI / 2, r = r0 + (r1 - r0) * t; pts.push([x + Math.cos(a) * r, yTop + (yBot - yTop) * t + Math.sin(a) * r * 0.3]); }
  line(c, pts, 26, INK); line(c, pts, 16, COL.paper);
};
// the kitchen drawing for a3: a pot of dal on a burner, a ladle in it, a child close on the right. Stage 1 adds the red and blue arrows, 2 the orange waves
const kitchen = (c: Ctx, bx: number, by: number, s: number, stage: number) => {
  const fl = by + 170 * s;
  shape(c, () => rrect(c, bx - 230 * s, by + 10 * s, 460 * s, fl - by - 10 * s, 8), COL.steel); shade(c, () => rrect(c, bx - 230 * s, by + 10 * s, 460 * s, fl - by - 10 * s, 8), COL.steelDk, 60 * s, 0, 0.4);
  shape(c, () => ell(c, bx, by + 6 * s, 170 * s, 26 * s), "#4a4650", 5);
  for (let k = -3; k <= 3; k++) { const fx = bx + k * 42 * s; shape(c, () => { c.moveTo(fx, by - 40 * s); c.quadraticCurveTo(fx + 14 * s, by - 10 * s, fx, by + 2 * s); c.quadraticCurveTo(fx - 14 * s, by - 10 * s, fx, by - 40 * s); c.closePath(); }, COL.blue, 3); }
  const pb = by - 36 * s, ph = 280 * s, wb = 150 * s, wt = 170 * s;
  const pot = () => { c.moveTo(bx - wt, pb - ph); c.lineTo(bx + wt, pb - ph); c.lineTo(bx + wb, pb); c.lineTo(bx - wb, pb); c.closePath(); };
  shape(c, pot, COL.steel); shade(c, pot, COL.steelDk, 50 * s, 0, 0.4);
  const dl = pb - ph * 0.82, dw = wb + (wt - wb) * 0.82;
  shape(c, () => { c.moveTo(bx - dw, dl); c.lineTo(bx + dw, dl); c.lineTo(bx + wb * 0.93, pb - 12 * s); c.lineTo(bx - wb * 0.93, pb - 12 * s); c.closePath(); }, DAL, 0);
  shape(c, () => ell(c, bx, dl, dw, 16 * s), "#f6c960", 4);
  for (const sd of [-1, 1]) shape(c, () => rrect(c, bx + sd * wt - (sd > 0 ? 0 : 50 * s), pb - ph + 20 * s, 50 * s, 22 * s, 8), COL.steelDk, 5);
  shape(c, () => ell(c, bx, pb - ph, wt, 14 * s), COL.steelIn, 5);
  // the ladle: its cup in the dal, the handle up and to the right
  const lx = bx + 40 * s, ly = dl + 40 * s, tx = bx + 190 * s, ty = pb - ph - 230 * s;
  shape(c, () => ell(c, lx, ly, 40 * s, 30 * s), COL.steelDk, 5);
  line(c, [[lx + 10 * s, ly - 20 * s], [tx, ty]], 22 * s, INK); line(c, [[lx + 10 * s, ly - 20 * s], [tx, ty]], 12 * s, COL.steel);
  // the child standing close on the right
  const cx = bx + 420 * s, ch = 340 * s;
  person(c, cx, fl, ch);
  const face: [number, number] = [cx - 50 * s, fl - 0.838 * ch];
  if (stage >= 1) {
    arrow(c, [[lx + 60 * s, ly - 10 * s], [tx + 40 * s, ty + 20 * s]], RED, 10 * s);
    for (const sd of [-1, 1]) { const pts: number[][] = [[bx, pb - 40 * s], [bx, dl + 40 * s], [bx + sd * 50 * s, dl + 30 * s], [bx + sd * 110 * s, dl + 50 * s], [bx + sd * 120 * s, pb - 100 * s], [bx + sd * 110 * s, pb - 40 * s], [bx + sd * 30 * s, pb - 36 * s]]; arrow(c, pts, COL.blueDk, 8 * s); }
  }
  if (stage >= 2) { wavy(c, bx + wt - 10 * s, pb - ph * 0.7, face[0], face[1] - 20 * s, 9 * s, COL.orange, 7 * s, true); wavy(c, bx + wt - 20 * s, pb - ph * 0.4, face[0], face[1] + 30 * s, 9 * s, COL.orange, 7 * s, true); wavy(c, bx + 90 * s, by - 30 * s, face[0] - 6 * s, face[1] + 42 * s, 9 * s, COL.orange, 7 * s, true); }
};
// the sun-oven box in a 3/4 view: front face at (x0, y0, w, h), top face slanting back by (dx, dy). The flap is cut on
// three sides and hinged along the LEFT edge of the lid, raised by ang; foil = how much of its inside is lined;
// hole = what is seen through the cut: "dark", "lined" or "film" (cling film over a lined inside)
const P = (x0: number, y0: number, w: number, dx: number, dy: number) => (u: number, v: number): [number, number] => [x0 + w * u + dx * v, y0 - dy * v];
const sunBox = (c: Ctx, x0: number, y0: number, w: number, h: number, dx: number, dy: number, ang: number, foil: number, hole: "dark" | "lined" | "film") => {
  const p = P(x0, y0, w, dx, dy);
  shape(c, () => polyP(c, [p(1, 0), p(1, 1), [x0 + w + dx, y0 + h - dy], [x0 + w, y0 + h]]), CARD_SIDE);
  shape(c, () => polyP(c, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]), CARD);
  shape(c, () => polyP(c, [p(0, 0), p(1, 0), p(1, 1), p(0, 1)]), CARD_TOP);
  const A = p(0.12, 0.15), B = p(0.12, 0.95), C2 = p(0.88, 0.95), Dd = p(0.88, 0.15);
  if (hole === "dark") shape(c, () => polyP(c, [A, Dd, C2, B]), "#3a2a1c", 4);
  else {
    // the lined inside seen through the hole: foil walls, black base
    shape(c, () => polyP(c, [A, Dd, C2, B]), FOIL_DK, 4);
    const q = (u: number, v: number): [number, number] => { const [x, y] = p(0.12 + 0.76 * u, 0.15 + 0.8 * v); return [x + (0.5 - u) * w * 0.14, y + (0.5 - v) * dy * 0.3 + h * 0.18]; };
    shape(c, () => polyP(c, [q(0, 0), q(1, 0), q(1, 1), q(0, 1)]), COL.black, 3);
    if (hole === "film") { shape(c, () => polyP(c, [A, Dd, C2, B]), "rgba(225,242,255,0.5)", 3); shine(c, [[A[0] + 30, A[1] - 12], [Dd[0] - 60, Dd[1] - 12]], 5); for (const [tx, ty] of [A, Dd, C2, B]) shape(c, () => rrect(c, tx - 22, ty - 9, 44, 18, 3), "#f2e3a0", 3); }
  }
  const len = w * 0.76, off: [number, number] = [Math.cos(ang) * len, -Math.sin(ang) * len];
  const A2: [number, number] = [A[0] + off[0], A[1] + off[1]], B2: [number, number] = [B[0] + off[0], B[1] + off[1]];
  shape(c, () => polyP(c, [A, B, B2, A2]), CARD);
  if (foil > 0) { const Af: [number, number] = [A[0] + off[0] * foil, A[1] + off[1] * foil], Bf: [number, number] = [B[0] + off[0] * foil, B[1] + off[1] * foil]; shape(c, () => polyP(c, [A, B, Bf, Af]), FOIL, 4); shine(c, [[A[0] + off[0] * 0.2 + 10, A[1] + off[1] * 0.2 + 10], [A[0] + off[0] * foil * 0.8 + 10, A[1] + off[1] * foil * 0.8 + 10]], 8); }
  return { A, B, A2, B2, hole: p(0.5, 0.55) as [number, number], foilMid: [(A[0] + B[0]) / 2 + off[0] * 0.6, (A[1] + B[1]) / 2 + off[1] * 0.6] as [number, number], p };
};
const chocolate = (c: Ctx, x: number, y: number, w: number, h: number, melted = false) => {
  if (melted) shape(c, () => ell(c, x, y + h * 0.5, w * 0.9, h * 0.45), "#6b3a1e", 4);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 6), "#7a4324"); shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 6), "#4f2912", w * 0.2, h * 0.2, 0.5);
  line(c, [[x, y - h / 2], [x, y + h / 2]], 3, "#4f2912"); line(c, [[x - w / 2, y], [x + w / 2, y]], 3, "#4f2912");
};
// a ruler lying flat (horizontal) or standing (vertical) from (x, y); px per cm, labels every `every` cm
const ruler = (c: Ctx, x: number, y: number, cm: number, pxPerCm: number, vertical: boolean, every: number) => {
  const L = cm * pxPerCm, t = 70;
  if (vertical) { shape(c, () => rrect(c, x - t / 2, y - L - 20, t, L + 40, 6), COL.wood); } else shape(c, () => rrect(c, x - 20, y - t / 2, L + 40, t, 6), COL.wood);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let m = 0; m <= cm * 2; m++) { const d = (m * pxPerCm) / 2, big = m % 2 === 0, l = big ? 24 : 14; c.lineWidth = big ? 4 : 2.5; c.beginPath(); if (vertical) { c.moveTo(x + t / 2, y - d); c.lineTo(x + t / 2 - l, y - d); } else { c.moveTo(x + d, y - t / 2); c.lineTo(x + d, y - t / 2 + l); } c.stroke(); }
  for (let k = 0; k <= cm; k += every) { if (vertical) write(c, String(k), x - t / 2 + 6, y - k * pxPerCm - 10, 22, INK, 4); else write(c, String(k), x + k * pxPerCm - (k >= 10 ? 18 : 8), y - 4, 24, INK, 4); }
};
// the arms-up pose for a standing child of height h at (x, y)
const armsUp = (x: number, y: number, h: number) => { const sy = y - 0.64 * h; return { reachL: [x - 0.2 * h, sy - 0.26 * h] as [number, number], reachR: [x + 0.2 * h, sy - 0.26 * h] as [number, number] }; };
const walking = (dir: 1 | -1) => ({ armL: [PI * 0.6, PI * 0.7] as [number, number], armR: [PI * 0.4, PI * 0.3] as [number, number], dir });

// ---------------------------------------------------------------- g1 · Heat Detectives
const g1_0 = (c: Ctx) => {
  ground(c, FLOOR);
  shape(c, () => rrect(c, 60, 60, 960, 960, 60), TABLE, 7);
  cardPile(c, 540, 540, 190, 260);
  const row = (xs: number[], ys: number[]) => xs.forEach((x, i) => token(c, x, ys[i], 40, i, true));
  row([400, 495, 590, 685], [910, 910, 910, 910]); row([400, 495, 590, 685], [170, 170, 170, 170]);
  row([150, 150, 150, 150], [400, 495, 590, 685]); row([930, 930, 930, 930], [400, 495, 590, 685]);
};
const players = (c: Ctx, showBack: boolean) => {
  ground(c, FLOOR);
  shape(c, () => rrect(c, 40, 540, 1000, 500, 40), "#e9dcc2", 5);
  // the reader at the back, holding the card in both hands
  person(c, 540, 680, 500, { sit: true, dir: 1, reachL: [478, 672], reachR: [602, 672] });
  gameCard(c, 540, 570, 150, 170, showBack);
  if (showBack) { const pts: number[][] = []; for (let a = -PI * 0.5; a <= PI * 0.45; a += 0.1) pts.push([625 + Math.cos(a) * 55, 570 + Math.sin(a) * 75]); arrow(c, pts, RED, 8); }
  cardPile(c, 540, 860, 110, 90);
  // the two players in front, each with a token under one hand (or face up in front of them)
  const L = { x: 230, y: 960 }, R = { x: 850, y: 960 };
  if (!showBack) { token(c, 323, 964, 36, 0, false); token(c, 757, 964, 36, 1, false); }
  else { token(c, 330, 975, 40, 0, true); token(c, 750, 975, 40, 1, true); }
  for (let k = 0; k < 3; k++) { token(c, 70 + k * 56, 1020, 24, k + 1, true); token(c, 1010 - k * 56, 1020, 24, k === 0 ? 0 : k + 1, true); }
  person(c, L.x, L.y, 500, showBack ? { sit: true, dir: 1 } : { sit: true, dir: 1, reachR: [315, 950] });
  person(c, R.x, R.y, 500, showBack ? { sit: true, dir: -1 } : { sit: true, dir: -1, reachL: [765, 950], adult: true });
};
const g1_1 = (c: Ctx) => players(c, false);
const g1_2 = (c: Ctx) => players(c, true);

// ---------------------------------------------------------------- e1 · Colour Currents
const e1_0 = (c: Ctx) => {
  ground(c); table(c, 560, 380);
  const xs = [165, 415, 665, 915];
  xs.forEach((x, i) => { bowl(c, x, 660, 95, "#e4523b"); if (i === 0) steam(c, x - 30, 640, 3, 130); if (i === 1) steam(c, x - 20, 640, 1, 90); if (i === 3) ice(c, x - 40, 652, 24); straw(c, x + 20, 664, x + 55, 420, 0); });
  xs.forEach((x, i) => { shape(c, () => rrect(c, x - 62, 790, 124, 140, 14), WHITE, 5); thermo(c, x, 806, 108, [0.9, 0.6, 0.35, 0.08][i], 0.75); });
};
const e1_1 = (c: Ctx) => {
  ground(c); table(c, 760, 200);
  shape(c, () => rrect(c, 230, 170, 560, 650, 10), WHITE, 6);
  glass(c, 500, 900, 330, 540, 0.72);
  ruler(c, 850, 900, 10, 48.6, true, 2);
  line(c, [[640, 511], [810, 511]], 4, RED);
  shape(c, () => rrect(c, 300, 60, 260, 90, 14), COL.paper, 5); write(c, "8 cm", 330, 78, 54, INK, 7);
};
const e1_2 = (c: Ctx) => {
  ground(c); table(c, 780, 200);
  glass(c, 560, 920, 340, 520, 0.75);
  const sx = 575;
  straw(c, sx, 725, sx, 262, 1);
  hand(c, sx - 75, 330, 0, 1.5);
  arrow(c, [[330, 420], [330, 640]], RED, 10);
  bowl(c, 150, 880, 90, "#e4523b"); steam(c, 120, 860, 3, 120);
};
const e1_3 = (c: Ctx) => {
  ground(c); table(c, 780, 200);
  glass(c, 560, 920, 340, 520, 0.75);
  const sx = 575;
  straw(c, sx, 725, sx, 290, 0.6);
  hand(c, sx - 75, 440, 0, 1.5);
  // the lifted finger, a little above the open top
  line(c, [[sx + 25, 235], [sx + 330, 40]], 56, INK); line(c, [[sx + 25, 235], [sx + 330, 40]], 44, "#b9794f"); line(c, [[sx + 120, 195], [sx + 150, 150]], 3, "#9c6240");
  line(c, [[sx - 30, 190], [sx - 40, 150]], 4, INK); line(c, [[sx + 25, 165], [sx + 35, 125]], 4, INK);
  // the red cloud at the tip
  c.globalAlpha = 0.85; shape(c, () => ell(c, sx + 5, 740, 70, 45), "#e4523b", 0); shape(c, () => ell(c, sx - 35, 760, 40, 28), "#e4523b", 0); shape(c, () => ell(c, sx + 50, 715, 36, 26), "#e4523b", 0); c.globalAlpha = 1;
  stopwatch(c, 900, 420, 95);
};
const e1_4 = (c: Ctx) => {
  ground(c); table(c, 800, 200);
  glass(c, 290, 900, 300, 500, 0.75); glass(c, 790, 900, 300, 500, 0.75);
  // the hot drop: a red thread curling up to the top and spreading there
  c.globalAlpha = 0.85;
  line(c, [[290, 680], [275, 630], [305, 580], [280, 540], [292, 528]], 20, "#e4523b");
  shape(c, () => ell(c, 290, 526, 118, 16), "#e4523b", 0);
  // the cold drop: a red thread sinking and pooling at the bottom
  line(c, [[790, 680], [805, 740], [778, 800], [795, 870]], 20, "#e4523b");
  shape(c, () => { c.moveTo(680, 850); c.lineTo(900, 850); c.lineTo(910, 900); c.lineTo(670, 900); c.closePath(); }, "#e4523b", 0);
  c.globalAlpha = 1;
  arrow(c, [[420, 690], [420, 560]], RED, 9); arrow(c, [[660, 690], [660, 820]], RED, 9);
  for (const [x, t] of [[290, "6"], [790, "9"]] as [number, string][]) { shape(c, () => rrect(c, x - 110, 930, 220, 110, 14), WHITE, 5); stopwatch(c, x - 50, 988, 34); write(c, t, x + 15, 955, 60, INK, 8); }
};

// ---------------------------------------------------------------- e2 · Dark, White and Shiny
const e2_0 = (c: Ctx) => {
  ground(c); table(c, 560, 300);
  const xs = [160, 410, 660];
  (["black", "white", "foil"] as const).forEach((w, i) => tumbler(c, xs[i], 760, 190, 330, w));
  glass(c, 910, 760, 190, 330, 0);
};
const e2_1 = (c: Ctx) => {
  ground(c); table(c, 600, 300);
  const xs = [150, 400, 650];
  (["black", "white", "foil"] as const).forEach((w, i) => { tumbler(c, xs[i], 800, 170, 300, w); foilLid(c, xs[i], 500, 170); });
  glass(c, 900, 800, 170, 300, 0.6);
  // the jug tilted over the last tumbler, water falling straight down into it
  const jx = 750, jy = 380, s = 0.9, rot = 0.6;
  c.save(); c.translate(jx, jy); c.rotate(rot);
  c.beginPath(); c.moveTo(-90 * s, -70 * s); c.bezierCurveTo(-180 * s, -60 * s, -180 * s, 70 * s, -90 * s, 80 * s); c.strokeStyle = INK; c.lineWidth = 36 * s; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 22 * s; c.stroke();
  const body = () => { c.moveTo(-95 * s, -110 * s); c.lineTo(80 * s, -110 * s); c.lineTo(112 * s, -132 * s); c.lineTo(96 * s, -92 * s); c.lineTo(96 * s, 110 * s); c.quadraticCurveTo(0, 126 * s, -96 * s, 110 * s); c.closePath(); };
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, 40 * s, 0);
  c.restore();
  const spx = jx + 110 * s * Math.cos(rot) + 132 * s * Math.sin(rot), spy = jy + 110 * s * Math.sin(rot) - 132 * s * Math.cos(rot);
  line(c, [[spx, spy], [spx + 2, 508]], 28, INK); line(c, [[spx, spy], [spx + 2, 508]], 18, COL.water);
};
const e2_2 = (c: Ctx) => {
  ground(c); table(c, 640, 300);
  thermo(c, 470, 120, 600, 0.68);
  tumbler(c, 470, 940, 300, 480, "black"); foilLid(c, 470, 460, 300);
  hand(c, 400, 190, 0, 1.4);
  // the results table and a pencil
  shape(c, () => rrect(c, 730, 560, 290, 360, 8), COL.paper, 5);
  for (let i = 0; i <= 5; i++) line(c, [[745, 580 + i * 64], [1005, 580 + i * 64]], 3, "#b9b4ab");
  for (let i = 0; i <= 3; i++) line(c, [[745 + i * 86.7, 580], [745 + i * 86.7, 900]], 3, "#b9b4ab");
  pencil(c, 790, 1010, 1010, 940);
};
const e2_3 = (c: Ctx) => {
  ground(c, SKY); sun(c, 150, 150, 80);
  shape(c, () => polyP(c, [[0, 230], [120, 230], [120, 700], [0, 700]]), "#e8d9c0", 5);
  c.fillStyle = "#e3cfa0"; c.fillRect(0, 660, D, 100); c.fillStyle = "#c9b283"; c.fillRect(0, 760, D, D - 760); line(c, [[0, 660], [D, 660]], 6); line(c, [[0, 760], [D, 760]], 5);
  shape(c, () => polyP(c, [[120, 660], [340, 660], [360, 760], [120, 760]]), "rgba(43,35,64,0.25)", 0);
  for (const [x1, y1, x2, y2] of [[240, 180, 520, 480], [280, 230, 700, 500], [330, 270, 880, 520]]) line(c, [[x1, y1], [x2, y2]], 5, "#f6d35a");
  glass(c, 230, 740, 170, 300, 0.6);
  (["black", "white", "foil"] as const).forEach((w, i) => { tumbler(c, 480 + i * 210, 740, 180, 310, w); foilLid(c, 480 + i * 210, 430, 180); });
};
const e2_4 = (c: Ctx) => {
  ground(c);
  tumbler(c, 800, 790, 200, 260, "white"); foilLid(c, 800, 530, 200);
  tumbler(c, 960, 790, 200, 260, "foil"); foilLid(c, 960, 530, 200);
  thermo(c, 620, 380, 600, 0.85);
  person(c, 380, 1080, 760, { reachR: [612, 470] });
  table(c, 760, 120);
  tumbler(c, 620, 860, 240, 300, "black"); foilLid(c, 620, 560, 240);
};

// ---------------------------------------------------------------- a1 · Hands Around a Diya
const a1_0 = (c: Ctx) => {
  ground(c); table(c, 640, 300);
  plate(c, 420, 790, 230, 70);
  const [fx, fy] = diya(c, 420, 790, 1.2);
  ruler(c, fx, 880, 10, 20, false, 5);
  ruler(c, 170, fy, 30, 20, true, 10);
  line(c, [[fx + 200, fy - 20], [fx + 200, 860]], 4, RED); line(c, [[215, fy - 600], [fx - 40, fy - 600]], 4, RED);
};
const a1_1 = (c: Ctx) => {
  ground(c); table(c, 700, 300);
  plate(c, 400, 860, 220, 66);
  const [fx, fy] = diya(c, 400, 860, 1.3);
  palm(c, 700, fy + 60, 1.5, -1, [900, 1080]);
  for (let i = -1; i <= 1; i++) wavy(c, fx + 70, fy - 60 + i * 50, fx + 190, fy - 60 + i * 50, 7, COL.orange, 5);
};
const a1_2 = (c: Ctx) => {
  ground(c); table(c, 760, 300);
  plate(c, 440, 920, 220, 66);
  const [fx, fy] = diya(c, 440, 920, 1.3);
  ruler(c, 150, 900, 30, 20, true, 10);
  hand(c, fx + 95, fy - 560, PI, 1.5, undefined, undefined, true);
  arrow(c, [[fx + 240, fy - 470], [fx + 240, fy - 310]], RED, 10);
  for (let i = -1; i <= 1; i++) wavy(c, fx + i * 40, fy - 170, fx + i * 40, fy - 300, 7, COL.orange, 5);
};
const a1_3 = (c: Ctx) => {
  ground(c); table(c, 760, 300);
  plate(c, 400, 920, 220, 66);
  const [fx, fy] = diya(c, 400, 920, 1.3);
  standCard(c, fx + 150, 905, 36, 420);
  palm(c, 760, fy + 60, 1.4, -1, [960, 1080]);
  hand(c, fx + 90, fy - 440, PI, 1.4, undefined, undefined, true);
  for (let i = -1; i <= 1; i++) wavy(c, fx + i * 40, fy - 170, fx + i * 40, fy - 300, 7, COL.orange, 5);
  for (let i = -1; i <= 1; i++) wavy(c, fx + 60, fy - 60 + i * 50, fx + 125, fy - 60 + i * 50, 6, COL.orange, 5);
};

// ---------------------------------------------------------------- a2 · Paper Spiral
const spiralPts = (cx: number, cy: number, R: number, turns: number, t0: number, t1: number) => { const pts: number[][] = []; for (let i = 0; i <= 300; i++) { const t = t0 + (t1 - t0) * (i / 300), a = t * turns * PI * 2, r = R * (1 - t * 0.93); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return pts; };
const a2_0 = (c: Ctx) => {
  ground(c, FLOOR);
  c.save(); c.translate(540, 540); c.rotate(-0.04); shadow(c, 20, 20, 440, 460); shape(c, () => rrect(c, -430, -450, 860, 900, 14), WHITE, 6); c.restore();
  c.beginPath(); ell(c, 540, 540, 330, 330); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  line(c, spiralPts(540, 540, 330, 4, 0, 1), 7, INK);
  pencil(c, 1010, 1030, 780, 900);
};
const a2_1 = (c: Ctx) => {
  ground(c, FLOOR);
  shape(c, () => rrect(c, 40, 120, 600, 640, 14), WHITE, 6);
  const cx = 340, cy = 440, R = 240;
  c.beginPath(); ell(c, cx, cy, R, R); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  line(c, spiralPts(cx, cy, R, 4, 0.3, 1), 5, INK);
  // the cut so far: a slit from the outer edge along the spiral
  const cut = spiralPts(cx, cy, R, 4, 0, 0.3);
  line(c, cut, 14, INK); line(c, cut, 7, FLOOR);
  const tip = cut[cut.length - 1], prev = cut[cut.length - 8], an = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  c.save(); c.translate(tip[0], tip[1]); c.rotate(an + PI / 2);
  shape(c, () => polyP(c, [[-7, 0], [7, 0], [3, -150], [-3, -150]]), COL.steel, 4);
  c.save(); c.rotate(-0.35); shape(c, () => polyP(c, [[-7, 0], [7, 0], [3, -150], [-3, -150]]), COL.steelIn, 4); c.restore();
  for (const s of [-1, 1]) { c.beginPath(); ell(c, s * 24 + (s < 0 ? -6 : 0), 92, 22, 46, s * 0.15); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.red; c.lineWidth = 12; c.stroke(); }
  shape(c, () => ell(c, 0, 0, 9, 9), INK, 0);
  hand(c, 0, 92 + 58 * 1.2, -PI / 2, 1.2);
  c.restore();
  snake(c, 860, 180, 760, 30, 120);
};
const a2_2 = (c: Ctx) => {
  ground(c, FLOOR);
  tablePiece(c, 560, D, 900, 100);
  plate(c, 760, 960, 170, 50);
  const [fx, fy] = diya(c, 760, 960, 1.05);
  // the stick held level, the spiral hanging from its far end
  line(c, [[430, 430], [760, 430]], 18, INK); line(c, [[430, 430], [760, 430]], 10, COL.wood);
  snake(c, 755, 490, 680, 18, 80);
  person(c, 260, 1040, 760, { adult: true, reachR: [440, 430] });
  for (let i = -1; i <= 1; i++) wavy(c, fx + i * 40, fy - 140, fx + i * 40, fy - 240, 7, COL.orange, 5);
  const pts: number[][] = []; for (let a = PI * 0.15; a <= PI * 1.2; a += 0.1) pts.push([755 + Math.cos(a) * 120, 560 + Math.sin(a) * 50]); arrow(c, pts, RED, 8);
  line(c, [[900, fy - 130], [900, 690]], 4, INK); line(c, [[885, fy - 130], [915, fy - 130]], 4, INK); line(c, [[885, 690], [915, 690]], 4, INK);
  write(c, "25", 920, 700, 40, INK, 6); write(c, "cm", 920, 752, 30, INK, 5);
};

// ---------------------------------------------------------------- a3 · Draw the Heat's Journey
const onPaper = (c: Ctx, stage: number) => { ground(c, FLOOR); shadow(c, 560, 560, 470, 490); shape(c, () => rrect(c, 60, 50, 960, 980, 14), WHITE, 6); kitchen(c, 420, 700, 1.15, stage); };
const a3_0 = (c: Ctx) => onPaper(c, 0);
const a3_1 = (c: Ctx) => onPaper(c, 1);
const a3_2 = (c: Ctx) => onPaper(c, 2);

// ---------------------------------------------------------------- a4 · Act Out the Sea Breeze
const sheets = (c: Ctx, night: boolean) => {
  ground(c, night ? NIGHT : BG); floor(c, 540, night ? "#9b9282" : FLOOR);
  shape(c, () => polyP(c, [[60, 1040], [480, 1040], [410, 600], [150, 600]]), night ? "#c9a84a" : COL.yellow, 6);
  shape(c, () => polyP(c, [[600, 1040], [1020, 1040], [930, 600], [670, 600]]), night ? "#3f6fb3" : COL.blue, 6);
  if (night) { moon(c, 900, 150, 70); for (const [x, y] of [[120, 120], [300, 200], [520, 90], [700, 220], [1000, 330]]) shape(c, () => ell(c, x, y, 7, 7), "#f4e9b8", 0); }
};
const a4_0 = (c: Ctx) => { sheets(c, false); person(c, 540, 980, 560, armsUp(540, 980, 560)); };
const a4_1 = (c: Ctx) => {
  sheets(c, false); sun(c, 540, 130, 60);
  person(c, 200, 960, 420, armsUp(200, 960, 420)); person(c, 360, 880, 420, armsUp(360, 880, 420));
  person(c, 760, 960, 420, walking(-1)); person(c, 900, 880, 420, walking(-1));
  arrow(c, [[200, 440], [200, 320]], RED, 9); arrow(c, [[360, 360], [360, 240]], RED, 9);
  arrow(c, [[690, 1010], [520, 1010]], COL.blueDk, 9); arrow(c, [[830, 930], [660, 930]], COL.blueDk, 9);
};
const a4_2 = (c: Ctx) => {
  sheets(c, true);
  person(c, 760, 960, 420, armsUp(760, 960, 420)); person(c, 900, 880, 420, armsUp(900, 880, 420));
  person(c, 200, 960, 420, walking(1)); person(c, 360, 880, 420, walking(1));
  arrow(c, [[760, 440], [760, 320]], RED, 9); arrow(c, [[900, 360], [900, 240]], RED, 9);
  arrow(c, [[270, 1010], [440, 1010]], COL.blueDk, 9); arrow(c, [[420, 930], [590, 930]], COL.blueDk, 9);
};

// ---------------------------------------------------------------- p1 · Foil Sun Oven
const p1_0 = (c: Ctx) => {
  ground(c);
  person(c, 700, 1000, 700, { reachL: [480, 400], reachR: [860, 580] });
  table(c, 720, 120);
  shadow(c, 480, 812, 260, 24);
  sunBox(c, 250, 580, 380, 220, 110, 80, 1.15, 0.55, "dark");
  // the roll of foil standing on the table
  shape(c, () => rrect(c, 830, 580, 60, 170, 10), FOIL, 5); shine(c, [[845, 600], [845, 720]], 6); shape(c, () => ell(c, 860, 580, 30, 10), FOIL_DK, 4);
};
const p1_1 = (c: Ctx) => {
  ground(c); table(c, 120, 900);
  shape(c, () => rrect(c, 110, 170, 860, 620, 8), CARD_TOP, 6);
  const o: [number, number][] = [[200, 240], [880, 240], [880, 720], [200, 720]], b: [number, number][] = [[330, 345], [750, 345], [750, 615], [330, 615]];
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; shape(c, () => polyP(c, [o[i], o[j], b[j], b[i]]), i % 2 ? FOIL_DK : FOIL, 4); }
  shine(c, [[230, 280], [320, 350]], 7); shine(c, [[840, 300], [770, 360]], 7); shine(c, [[260, 690], [320, 630]], 7);
  shape(c, () => polyP(c, b), COL.black, 5);
  chocolate(c, 540, 480, 150, 110);
};
const p1_2 = (c: Ctx) => {
  ground(c); table(c, 720, 120);
  shadow(c, 480, 812, 260, 24);
  const bx = sunBox(c, 250, 580, 380, 220, 110, 80, 1.15, 1, "film");
  pencil(c, bx.A2[0] + 40, bx.A2[1] + 30, bx.p(0.92, 0.3)[0], bx.p(0.92, 0.3)[1], 22);
};
const p1_3 = (c: Ctx) => {
  ground(c, SKY); sun(c, 900, 150, 80);
  c.fillStyle = "#e3cfa0"; c.fillRect(0, 640, D, 260); c.fillStyle = "#c9b283"; c.fillRect(0, 900, D, D - 900); line(c, [[0, 640], [D, 640]], 6); line(c, [[0, 900], [D, 900]], 5);
  shape(c, () => polyP(c, [[330, 780], [140, 850], [560, 850], [710, 780]]), "rgba(43,35,64,0.25)", 0);
  const bx = sunBox(c, 330, 520, 380, 260, 110, 80, 1.15, 1, "film");
  const F = bx.foilMid, H = bx.hole;
  for (const d of [0, 40]) { arrow(c, [[840 + d, 230 + d * 0.3], [F[0] + d * 0.4, F[1] - 30 + d * 0.6]], COL.orange, 8); arrow(c, [[F[0] + d * 0.4, F[1] - 30 + d * 0.6], [H[0] + 20 + d * 0.6, H[1] - 10 + d * 0.3]], COL.orange, 8); }
  arrow(c, [[900, 280], [H[0] + 110, H[1] - 10]], COL.orange, 8);
};

// ---------------------------------------------------------------- lead pictures
const flow_g1 = (c: Ctx) => {
  ground(c, FLOOR); shape(c, () => rrect(c, 60, 60, 960, 960, 60), TABLE, 7);
  gameCard(c, 540, 430, 420, 520, false, -0.03);
  [0, 1, 2, 3].forEach((k) => token(c, 330 + k * 140, 880, 55, k, true));
};
const flow_e1 = (c: Ctx) => {
  ground(c); table(c, 780, 300);
  bowl(c, 150, 860, 85, "#e4523b"); steam(c, 120, 840, 3, 110); straw(c, 165, 864, 200, 640, 0);
  bowl(c, 930, 860, 85, "#e4523b"); ice(c, 900, 852, 22); straw(c, 945, 864, 980, 640, 0);
  glass(c, 540, 920, 340, 540, 0.75);
  straw(c, 555, 700, 555, 250, 1);
  hand(c, 480, 320, 0, 1.4);
  c.globalAlpha = 0.85; line(c, [[555, 700], [530, 640], [575, 580], [545, 530], [560, 518]], 22, "#e4523b"); shape(c, () => ell(c, 540, 516, 132, 16), "#e4523b", 0); c.globalAlpha = 1;
  arrow(c, [[400, 680], [400, 560]], RED, 9);
};
const flow_e2 = (c: Ctx) => {
  ground(c, SKY); sun(c, 150, 150, 85);
  c.fillStyle = "#e3cfa0"; c.fillRect(0, 760, D, 100); c.fillStyle = "#c9b283"; c.fillRect(0, 860, D, D - 860); line(c, [[0, 760], [D, 760]], 6); line(c, [[0, 860], [D, 860]], 5);
  const xs = [270, 540, 810], fr = [0.9, 0.55, 0.25];
  (["black", "white", "foil"] as const).forEach((w, i) => { thermo(c, xs[i], 300, 470, fr[i]); tumbler(c, xs[i], 840, 220, 320, w); foilLid(c, xs[i], 520, 220); });
  for (const [x1, y1, x2, y2] of [[250, 200, 420, 430], [290, 240, 650, 450], [330, 270, 900, 470]]) line(c, [[x1, y1], [x2, y2]], 5, "#f6d35a");
};
const flow_a1 = (c: Ctx) => {
  ground(c); table(c, 760, 300);
  plate(c, 400, 920, 220, 66);
  const [fx, fy] = diya(c, 400, 920, 1.3);
  palm(c, 740, fy + 60, 1.4, -1, [960, 1080]);
  hand(c, fx + 90, fy - 440, PI, 1.4, undefined, undefined, true);
  for (let i = -1; i <= 1; i++) wavy(c, fx + i * 40, fy - 170, fx + i * 40, fy - 300, 7, COL.orange, 5);
  for (let i = -1; i <= 1; i++) wavy(c, fx + 70, fy - 60 + i * 50, fx + 220, fy - 60 + i * 50, 7, COL.orange, 5);
};
const flow_a2 = (c: Ctx) => {
  ground(c); table(c, 840, 240);
  plate(c, 540, 960, 200, 60);
  const [fx, fy] = diya(c, 540, 960, 1.2);
  line(c, [[540, 60], [1080, 0]], 18, INK); line(c, [[540, 60], [1080, 0]], 10, COL.wood);
  snake(c, 540, 130, 480, 30, 140);
  for (let i = -1; i <= 1; i++) wavy(c, fx + i * 50, fy - 150, fx + i * 50, fy - 330, 8, COL.orange, 6);
  const pts: number[][] = []; for (let a = PI * 0.15; a <= PI * 1.2; a += 0.1) pts.push([540 + Math.cos(a) * 190, 240 + Math.sin(a) * 70]); arrow(c, pts, RED, 9);
};
const flow_a3 = (c: Ctx) => { ground(c); kitchen(c, 380, 720, 1.2, 2); };
const flow_a4 = (c: Ctx) => {
  sheets(c, false);
  person(c, 540, 760, 420, armsUp(540, 760, 420));
  sun(c, 540, 130, 55);
  person(c, 230, 980, 440, armsUp(230, 980, 440));
  person(c, 850, 980, 440, walking(-1));
  arrow(c, [[230, 440], [230, 300]], RED, 9); arrow(c, [[760, 1030], [540, 1030]], COL.blueDk, 9);
};
const flow_p1 = (c: Ctx) => {
  ground(c, SKY); sun(c, 900, 150, 80);
  c.fillStyle = "#e3cfa0"; c.fillRect(0, 820, D, 100); c.fillStyle = "#c9b283"; c.fillRect(0, 920, D, D - 920); line(c, [[0, 820], [D, 820]], 6); line(c, [[0, 920], [D, 920]], 5);
  // the box cut open from the side: cardboard walls, foil inside, black paper on the base
  shape(c, () => polyP(c, [[240, 460], [860, 460], [860, 830], [240, 830]]), CARD);
  shape(c, () => polyP(c, [[270, 490], [830, 490], [830, 800], [270, 800]]), FOIL, 4);
  shine(c, [[290, 520], [290, 760]], 7); shine(c, [[810, 520], [810, 760]], 7);
  shape(c, () => rrect(c, 280, 770, 540, 32, 4), COL.black, 3);
  chocolate(c, 550, 740, 110, 60, true);
  shape(c, () => polyP(c, [[240, 460], [860, 460], [860, 492], [240, 492]]), "rgba(225,242,255,0.55)", 3);
  // the flap hinged at the top left, foil side facing the sun
  line(c, [[250, 465], [410, 185]], 30, INK); line(c, [[250, 465], [410, 185]], 20, CARD); line(c, [[262, 468], [422, 188]], 8, FOIL);
  for (const d of [0, 50]) { arrow(c, [[800 + d * 0.4, 170 + d], [360 + d * 0.3, 270 + d * 0.9]], COL.orange, 8); arrow(c, [[360 + d * 0.3, 270 + d * 0.9], [520 + d * 0.7, 700]], COL.orange, 8); }
  arrow(c, [[870, 260], [600, 700]], COL.orange, 8);
  for (let i = -1; i <= 1; i++) wavy(c, 550 + i * 40, 660, 550 + i * 40, 590, 6, COL.orange, 5);
};
const expl_3 = (c: Ctx) => {
  ground(c, SKY); sun(c, 150, 140, 80);
  c.fillStyle = COL.water; c.fillRect(0, 600, D, D - 600);
  for (let i = 0; i < 5; i++) line(c, [[620 + i * 30, 700 + i * 70], [900 + i * 30, 700 + i * 70]], 5, COL.waterDk);
  shape(c, () => { c.moveTo(0, 560); c.lineTo(520, 560); c.quadraticCurveTo(620, 600, 600, 700); c.quadraticCurveTo(580, 820, 640, 1080); c.lineTo(0, 1080); c.closePath(); }, "#efd79a");
  // a palm tree on the land
  line(c, [[120, 560], [150, 380]], 22, INK); line(c, [[120, 560], [150, 380]], 14, COL.brown);
  for (const a of [-2.6, -2.1, -1.5, -0.9, -0.4]) { const L = 95, tx = 150 + Math.cos(a) * L, ty = 380 + Math.sin(a) * L; shape(c, () => { c.moveTo(150, 380); c.quadraticCurveTo((150 + tx) / 2 - Math.sin(a) * 30, (380 + ty) / 2 + Math.cos(a) * 30, tx, ty); c.quadraticCurveTo((150 + tx) / 2 + Math.sin(a) * 30, (380 + ty) / 2 - Math.cos(a) * 30, 150, 380); c.closePath(); }, COL.leaf, 5); }
  for (let i = -1; i <= 1; i++) wavy(c, 380 + i * 60, 540, 380 + i * 60, 470, 6, COL.orange, 5);
  // the loop: up over the warm land, across the top, down over the cool sea, in along the surface as the sea breeze
  arrow(c, [[380, 450], [380, 230]], RED, 11); arrow(c, [[420, 200], [800, 200]], RED, 11);
  arrow(c, [[850, 240], [850, 480]], COL.blueDk, 11); arrow(c, [[820, 540], [460, 540]], COL.blueDk, 11);
};
const expl_8 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#4a5570"; c.fillRect(540, 0, 540, D);
  shape(c, () => ell(c, 810, 200, 110, 110), "#2b3560", 8); for (const [x, y] of [[770, 160], [850, 230], [820, 130], [860, 180]]) shape(c, () => ell(c, x, y, 5, 5), WHITE, 0);
  for (const y of [500, 700, 900]) for (const x of [600, 1020]) shape(c, () => ell(c, x, y, 7, 7), "#2b3560", 0);
  line(c, [[540, 0], [540, D]], 6);
  table(c, 820, 260);
  // on Earth: a tall teardrop flame
  const candle = (x: number, base: number) => { shadow(c, x + 20, base + 4, 70, 14); shape(c, () => rrect(c, x - 45, base - 300, 90, 300, 8), COL.paper); shade(c, () => rrect(c, x - 45, base - 300, 90, 300, 8), "#dcd6cc", 30, 0, 0.6); shape(c, () => ell(c, x, base - 300, 45, 12), WHITE, 5); line(c, [[x, base - 300], [x, base - 330]], 6, INK); };
  candle(270, 820); flame(c, 270, 820 - 330, 190);
  // in a spacecraft: a small round blue ball of flame
  candle(810, 820);
  shape(c, () => ell(c, 810, 820 - 360, 42, 42), COL.blue, 5); shape(c, () => ell(c, 810, 820 - 360, 22, 22), "#9fc3f0", 0);
};

export const ic_energyHeatMovesL4 = cards("sci.energy.heat-moves.L4", [
  g1_0, g1_1, g1_2,
  e1_0, e1_1, e1_2, e1_3, e1_4,
  e2_0, e2_1, e2_2, e2_3, e2_4,
  a1_0, a1_1, a1_2, a1_3,
  a2_0, a2_1, a2_2,
  a3_0, a3_1, a3_2,
  a4_0, a4_1, a4_2,
  p1_0, p1_1, p1_2, p1_3,
  flow_g1, flow_e1, flow_e2, flow_a1, flow_a2, flow_a3, flow_a4, flow_p1, expl_3, expl_8,
]);
