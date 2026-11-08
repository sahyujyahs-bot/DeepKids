import type { Ctx } from "./core";
import { D, INK, SH, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, person, hand, write, cards, seed } from "./flatKit";

// ANIMAL SOCIETIES L4 · set-up cards for Switch or Stay and The Jar of Dal, then card pictures:
// the two experiments, the activities, the project, a swarm on a branch and two ants sharing food.

const CHANA = "#e9c98c", CHANA_DK = "#c6a060", LCD = "#c9f06b", SCREEN = "#22303a", WALL = "#f6efe0", FLOOR = "#e3cfae";
type Pt = [number, number];
type Kind = "pencil" | "crayon" | "pen";

const chana = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, CHANA, CHANA_DK);
// arm angles that look natural at a table: upper arm down and out, forearm in across the table; the hand lands
// at the point armEnd gives (same geometry as person), so what the hand holds can be drawn there
const WRITE_L: Pt = [Math.PI / 2 + 0.55, 0.35], WRITE_R: Pt = [Math.PI / 2 - 0.55, Math.PI - 0.35];
const REST_L: Pt = [Math.PI / 2 + 0.7, 0.6], REST_R: Pt = [Math.PI / 2 - 0.7, Math.PI - 0.6];
const armEnd = (x: number, y: number, h: number, side: number, a: Pt, ad = false, sit = false): Pt => {
  const hip = sit ? y - h * 0.07 : y - h * (ad ? 0.46 : 0.4), sh = hip - h * (ad ? 0.3 : 0.27), tw = h * (ad ? 0.27 : 0.25), l1 = h * 0.17, l2 = h * 0.155;
  return [x + side * tw * 0.42 + Math.cos(a[0]) * l1 + Math.cos(a[1]) * l2, sh + h * 0.03 + Math.sin(a[0]) * l1 + Math.sin(a[1]) * l2];
};
const rectSh = (c: Ctx, x: number, y: number, w: number, h: number) => { c.fillStyle = SH; c.fillRect(x, y, w, h); };
const noFill = "rgba(0,0,0,0)";

// a wooden table across the card: the top is a band from its back edge yTop to its front edge yFront, the front board to yBot.
// Draw the top before the people standing behind it and the front board after them, so their legs are hidden.
const tableTop = (c: Ctx, yTop: number, yFront: number) => shape(c, () => polyP(c, [[24, yTop], [D - 24, yTop], [D + 10, yFront], [-10, yFront]]), COL.wood);
const tableFront = (c: Ctx, yFront: number, yBot: number) => shape(c, () => polyP(c, [[-10, yFront], [D + 10, yFront], [D + 10, yBot], [-10, yBot]]), COL.woodDk);
const room = (c: Ctx, floorY: number) => { c.fillStyle = WALL; c.fillRect(0, 0, D, floorY); c.fillStyle = FLOOR; c.fillRect(0, floorY, D, D - floorY); line(c, [[0, floorY], [D, floorY]], 5); };

// ---------------------------------------------------------------- paper, pencils, timer
const starPath = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); };
const star = (c: Ctx, x: number, y: number, r: number, fill: string, w = 3) => shape(c, () => starPath(c, x, y, r), fill, w);
const letterA = (c: Ctx, x: number, y: number, h: number, w = 4) => { line(c, [[x - h * 0.45, y + h * 0.5], [x, y - h * 0.5], [x + h * 0.45, y + h * 0.5]], w); line(c, [[x - h * 0.25, y + h * 0.15], [x + h * 0.25, y + h * 0.15]], w); };
// a paper square done up to a step: 1 star drawn in pencil, 1.5 star half coloured, 2 star red, 3 letter written under it
const square = (c: Ctx, x: number, y: number, s: number, rot: number, step = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  rectSh(c, -s / 2 + s * 0.06, -s / 2 + s * 0.08, s, s);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.06), COL.paper, Math.max(3, s * 0.05));
  const lw = Math.max(2.5, s * 0.04), sy = -s * 0.1, r = s * 0.27;
  if (step >= 2) star(c, 0, sy, r, COL.red, lw);
  else if (step >= 1) { star(c, 0, sy, r, COL.paper, lw); if (step > 1) { c.save(); c.beginPath(); c.rect(-s, -s, s, 2 * s); c.clip(); star(c, 0, sy, r, COL.red, lw); c.restore(); } }
  if (step >= 3) letterA(c, 0, s * 0.3, s * 0.2, Math.max(3, s * 0.045));
  c.restore();
};
// a writing tool with its TIP at (x, y), its body running back along angle an for len px, width w
const tool = (c: Ctx, x: number, y: number, an: number, len: number, kind: Kind, w = 24) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const h = w / 2, lw = Math.max(3, w * 0.17);
  if (kind === "pencil") {
    shape(c, () => polyP(c, [[0, 0], [w * 1.9, -h], [w * 1.9, h]]), COL.wood, lw);
    shape(c, () => polyP(c, [[0, 0], [w * 0.75, -h * 0.4], [w * 0.75, h * 0.4]]), COL.greyDk, lw * 0.8);
    shape(c, () => rrect(c, w * 1.8, -h, len - w * 1.8, w, 3), COL.yellow, lw);
    line(c, [[w * 2.1, -h * 0.3], [len - w * 1.6, -h * 0.3]], lw * 0.6, COL.orange);
    shape(c, () => rrect(c, len - w * 1.45, -h, w * 0.5, w, 2), COL.steel, lw);
    shape(c, () => rrect(c, len - w, -h, w, w, w * 0.25), COL.pink, lw);
  } else if (kind === "crayon") {
    shape(c, () => polyP(c, [[0, 0], [w * 1.2, -h], [w * 1.2, h]]), COL.red, lw);
    shape(c, () => rrect(c, w * 1.1, -h, len - w * 1.1, w, 4), COL.red, lw);
    shape(c, () => rrect(c, w * 1.9, -h - 2, len - w * 2.7, w + 4, 4), "#f4dcc4", lw);
    line(c, [[w * 2.4, 0], [len - w * 1.3, 0]], lw * 0.6, COL.red);
  } else {
    shape(c, () => polyP(c, [[0, 0], [w * 0.9, -h * 0.6], [w * 0.9, h * 0.6]]), COL.black, lw * 0.8);
    shape(c, () => rrect(c, w * 0.8, -h * 0.75, len - w * 0.8, w * 1.5, 4), COL.blue, lw);
    shape(c, () => rrect(c, len - w * 1.7, -h * 0.85, w * 1.7, w * 1.7, 5), COL.blueDk, lw);
    line(c, [[len - w * 1.4, -h * 0.4], [len - w * 0.2, -h * 0.4]], lw * 0.7, COL.steelIn);
  }
  c.restore();
};
// a tool held by a person: tip on the paper, body running back through the hand point
const heldTool = (c: Ctx, hnd: Pt, tip: Pt, kind: Kind, w = 14) => { const an = Math.atan2(hnd[1] - tip[1], hnd[0] - tip[0]); tool(c, tip[0], tip[1], an, Math.hypot(hnd[0] - tip[0], hnd[1] - tip[1]) + w * 2.6, kind, w); };
// a kitchen timer standing with its base centre at (x, y), size s, showing text (digits) on its screen
const timer = (c: Ctx, x: number, y: number, s: number, text: string) => {
  shadow(c, x + s * 0.1, y + 4, s * 0.55, s * 0.1);
  const body = () => rrect(c, x - s / 2, y - s * 0.95, s, s * 0.95, s * 0.12);
  shape(c, () => rrect(c, x - s * 0.18, y - s * 1.06, s * 0.36, s * 0.16, s * 0.05), COL.tealDk, 4);
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, -s * 0.08, -s * 0.06);
  shape(c, () => rrect(c, x - s * 0.38, y - s * 0.8, s * 0.76, s * 0.36, s * 0.04), SCREEN, 4);
  const gh = s * 0.24, tw = text.length * 0.8 * gh - 0.2 * gh;
  write(c, text, x - tw / 2, y - s * 0.74, gh, LCD, Math.max(3, s * 0.035));
  for (const k of [-1, 0, 1]) shape(c, () => ell(c, x + k * s * 0.24, y - s * 0.22, s * 0.08, s * 0.08), k ? COL.steelIn : COL.red, 3);
};
// a notebook page lying flat, centre (x, y)
const page = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); rectSh(c, -w / 2 + 8, -h / 2 + 10, w, h); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), COL.paper, 5); c.restore(); };
const grid = (c: Ctx, x: number, y: number, w: number, h: number, rows: number, cols: number, lw = 3) => { for (let i = 0; i <= rows; i++) line(c, [[x, y + (i * h) / rows], [x + w, y + (i * h) / rows]], lw); for (let j = 0; j <= cols; j++) line(c, [[x + (j * w) / cols, y], [x + (j * w) / cols, y + h]], lw); };
// a speech bubble centred (x, y) with its tail to (tx, ty); text is digits
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number, text?: string) => {
  const tail = (inset: number) => { c.moveTo(x - w * 0.15 + inset, y + h / 2 - 6); c.lineTo(tx, ty); c.lineTo(x + w * 0.15 - inset, y + h / 2 - 6); c.closePath(); };
  shape(c, () => tail(0), WHITE, 5);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.4), WHITE, 5);
  shape(c, () => tail(4), WHITE, 0);
  if (text) { const gh = h * 0.5, tw = text.length * 0.8 * gh - 0.2 * gh; write(c, text, x - tw / 2, y - gh / 2, gh, INK, 5); }
};
const slip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); rectSh(c, -w / 2 + 5, -h / 2 + 6, w, h); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), COL.paper, 4); c.restore(); };
const tray = (c: Ctx, x: number, y: number, w: number, h: number) => { rectSh(c, x - w / 2 + 10, y - h / 2 + 12, w, h); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 12), COL.steel); shape(c, () => rrect(c, x - w / 2 + 16, y - h / 2 + 14, w - 32, h - 28, 8), COL.steelIn, 4); };
// a clear glass holding chana up to fill (0..1)
const chanaGlass = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, seedN: number) => {
  glass(c, x, y, w, h, fill, CHANA);
  const r = rnd(seedN), top = w / 2, bot = w * 0.4, ly = y - h * fill, n = Math.floor((w * h * fill) / 700);
  c.globalAlpha = 0.92;
  for (let i = 0; i < n; i++) { const t = r(), yy = ly + 8 + t * (y - ly - 16), lw = bot + (top - bot) * ((y - yy) / h) - 10; chana(c, x - lw + r() * 2 * lw, yy, w * 0.055, r() * 3); }
  c.globalAlpha = 1;
};
// a pile of ten chana on a tray
const pile = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 10; i++) { const a = (i / 7) * Math.PI * 2, rr = i < 7 ? r * 1.9 : r * 0.7; chana(c, x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6, r, a); } };

// ---------------------------------------------------------------- insects
// an ant walking on the ground line y, facing dir (1 = to the right), body length about s
const ant = (c: Ctx, x: number, y: number, s: number, dir = 1, crumb = false) => {
  c.save(); c.translate(x, y); c.scale(dir, 1);
  const by = -s * 0.34, lw = Math.max(2.5, s * 0.03), body = "#8a5a3c", dk = "#5e3a24";
  const legs = (ox: number, oy: number, col: string, w: number) => {
    line(c, [[s * 0.1 + ox, by + oy], [s * 0.3 + ox, by - s * 0.16 + oy], [s * 0.44 + ox, oy]], w, col);
    line(c, [[s * 0.03 + ox, by + s * 0.02 + oy], [s * 0.0 + ox, by + s * 0.16 + oy], [s * 0.1 + ox, oy]], w, col);
    line(c, [[-s * 0.06 + ox, by + oy], [-s * 0.26 + ox, by - s * 0.12 + oy], [-s * 0.4 + ox, oy]], w, col);
  };
  legs(s * 0.06, -s * 0.05, dk, lw * 1.4);
  shape(c, () => ell(c, -s * 0.1, by, s * 0.05, s * 0.04), body, lw);
  const parts: [number, number, number, number][] = [[-s * 0.3, by, s * 0.22, s * 0.16], [s * 0.06, by, s * 0.16, s * 0.11], [s * 0.36, by - s * 0.01, s * 0.13, s * 0.12]];
  for (const [px, py, rx, ry] of parts) { shape(c, () => ell(c, px, py, rx, ry), body, lw * 1.4); shade(c, () => ell(c, px, py, rx, ry), dk, -rx * 0.3, -ry * 0.35, 0.5); }
  shape(c, () => ell(c, s * 0.42, by - s * 0.04, s * 0.03, s * 0.03), INK, 0);
  line(c, [[s * 0.46, by - s * 0.08], [s * 0.56, by - s * 0.26], [s * 0.7, by - s * 0.3]], lw);
  line(c, [[s * 0.47, by + s * 0.04], [s * 0.57, by + s * 0.08]], lw); line(c, [[s * 0.48, by - s * 0.01], [s * 0.57, by - s * 0.04]], lw);
  legs(0, 0, INK, lw * 1.6);
  if (crumb) shape(c, () => ell(c, s * 0.62, by + s * 0.02, s * 0.1, s * 0.08), COL.wood, lw);
  c.restore();
};
// a honeybee seen from the side, body centre (x, y), length about s, facing dir
const bee = (c: Ctx, x: number, y: number, s: number, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(dir, 1);
  const lw = Math.max(2.5, s * 0.035);
  shape(c, () => ell(c, -s * 0.02, -s * 0.3, s * 0.3, s * 0.11, -0.55), "rgba(225,238,250,0.85)", lw);
  shape(c, () => ell(c, s * 0.08, -s * 0.26, s * 0.3, s * 0.12, -0.3), "rgba(238,246,255,0.9)", lw);
  const ab = () => ell(c, -s * 0.2, 0, s * 0.3, s * 0.19);
  shape(c, ab, COL.yellow, lw * 1.3);
  c.save(); c.beginPath(); ab(); c.clip(); c.fillStyle = INK; for (const k of [0, 1, 2]) c.fillRect(-s * 0.44 + k * s * 0.14, -s * 0.3, s * 0.065, s * 0.6); c.restore();
  shape(c, () => ell(c, s * 0.14, -s * 0.02, s * 0.16, s * 0.15), COL.brown, lw * 1.3);
  shape(c, () => ell(c, s * 0.36, 0, s * 0.11, s * 0.11), INK, 0);
  shape(c, () => ell(c, s * 0.38, -s * 0.03, s * 0.045, s * 0.05), COL.greyDk, 0);
  line(c, [[s * 0.42, -s * 0.08], [s * 0.5, -s * 0.22], [s * 0.6, -s * 0.24]], lw);
  for (const [lx, k] of [[s * 0.22, 0], [s * 0.1, 1], [-s * 0.02, 2]]) line(c, [[lx, s * 0.1], [lx - s * 0.05 + k * s * 0.03, s * 0.22], [lx - s * 0.1 + k * s * 0.05, s * 0.3]], lw);
  c.restore();
};

// ---------------------------------------------------------------- other things
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, water = 0.84) => {
  shadow(c, x + w * 0.12, y + 5, w * 0.55, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.72); c.quadraticCurveTo(x - w / 2, y - h * 0.84, x - w * 0.22, y - h * 0.87); c.lineTo(x - w * 0.22, y - h * 0.93); c.lineTo(x + w * 0.22, y - h * 0.93); c.lineTo(x + w * 0.22, y - h * 0.87); c.quadraticCurveTo(x + w / 2, y - h * 0.84, x + w / 2, y - h * 0.72); c.lineTo(x + w / 2, y); c.closePath(); };
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - w, y - h * water, 2 * w, h * water); c.restore();
  shape(c, body, COL.glass, 5);
  shape(c, () => rrect(c, x - w * 0.27, y - h, w * 0.54, h * 0.09, 4), COL.blueDk, 4);
  shine(c, [[x - w * 0.3, y - h * 0.66], [x - w * 0.3, y - h * 0.2]], 6);
};
const steam = (c: Ctx, x: number, y: number) => { c.globalAlpha = 0.55; for (const k of [-1, 0, 1]) line(c, [[x + k * 26, y], [x + k * 26 - 10, y - 22], [x + k * 26 + 10, y - 44], [x + k * 26, y - 66]], 5, COL.greyDk); c.globalAlpha = 1; };
const phone = (c: Ctx, x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -34, -68, 68, 136, 12), COL.black, 5); shape(c, () => rrect(c, -26, -52, 52, 100, 4), COL.sky, 3); shape(c, () => ell(c, 0, 58, 5, 5), COL.greyDk, 0); c.restore(); };
const soundArcs = (c: Ctx, x: number, y: number, an: number, r0: number) => { for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x, y, r0 + k * 24, an - 0.55, an + 0.55); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); } };
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 6, COL.orange); } shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); };
const hexPath = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); };
const flower = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 5; shape(c, () => ell(c, x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75, r * 0.45, r * 0.32, a), COL.pink, 3); } shape(c, () => ell(c, x, y, r * 0.35, r * 0.35), COL.yellow, 3); };
const shield = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x - r, y - r * 0.8); c.lineTo(x + r, y - r * 0.8); c.lineTo(x + r, y + r * 0.1); c.quadraticCurveTo(x + r, y + r * 0.8, x, y + r * 1.1); c.quadraticCurveTo(x - r, y + r * 0.8, x - r, y + r * 0.1); c.closePath(); }, COL.blue, 4);
const broom = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x + s * 0.5, y - s], [x - s * 0.1, y + s * 0.3]], s * 0.12, COL.brown); shape(c, () => polyP(c, [[x - s * 0.1, y + s * 0.2], [x + s * 0.15, y + s * 0.3], [x + s * 0.3, y + s], [x - s * 0.55, y + s], [x - s * 0.35, y + s * 0.3]]), COL.wood, 4); for (const k of [-0.35, -0.15, 0.05]) line(c, [[x + k * s, y + s * 0.5], [x + k * s - s * 0.05, y + s], ], 3); };

// ================================================================ SET-UP CARDS · e1 Switch or Stay
// 1. twelve squares in a row, a pencil, a red crayon, a pen and a timer on the table
const s_e1_0 = (c: Ctx) => {
  ground(c); tableTop(c, 330, 880); tableFront(c, 880, 1090);
  const r = rnd(3);
  for (let i = 0; i < 12; i++) square(c, 95 + i * 80, 470, 62, (r() - 0.5) * 0.16, 0);
  tool(c, 90, 620, 0, 300, "pencil", 24);
  tool(c, 430, 680, 0, 230, "crayon", 28);
  tool(c, 100, 760, 0, 260, "pen", 22);
  timer(c, 880, 790, 170, "0");
};
// 2. method one: a hand finishing one square (star, red, letter) with the next square waiting beside it
const s_e1_1 = (c: Ctx) => {
  ground(c);
  square(c, 360, 540, 320, -0.04, 3);
  square(c, 820, 430, 260, 0.1, 0);
  // the pen: tip at the last stroke of the letter, running up and right through the fist; the hand over it
  const tip: Pt = [392, 668], fist: Pt = [477, 583], s = 1.6;
  tool(c, tip[0], tip[1], Math.atan2(fist[1] - tip[1], fist[0] - tip[0]), 240, "pen", 22);
  const an = -Math.PI * 0.75;
  hand(c, fist[0] - 70 * s * Math.cos(an), fist[1] - 70 * s * Math.sin(an), an, s);
};
// 3. method two: stars on all twelve squares, the hand starting to colour the first
const s_e1_2 = (c: Ctx) => {
  ground(c); tableTop(c, 120, 900); tableFront(c, 900, 1090);
  const r = rnd(5);
  for (let i = 0; i < 12; i++) square(c, 190 + i * 70, 230, 58, (r() - 0.5) * 0.14, i ? 1 : 1.5);
  const tip: Pt = [196, 226], fist: Pt = [267, 297], s = 1.3;
  tool(c, tip[0], tip[1], Math.atan2(fist[1] - tip[1], fist[0] - tip[0]), 210, "crayon", 26);
  const an = -Math.PI / 4;
  hand(c, fist[0] - 70 * s * Math.cos(an), fist[1] - 70 * s * Math.sin(an), an, s);
  // the finished squares of method two will all be red; show the box of what each step uses below
  tool(c, 330, 700, 0, 300, "pencil", 24);
  tool(c, 700, 720, 0, 250, "pen", 22);
};
// 4. the notebook table: four rounds, the method, the seconds and the neat squares
const s_e1_3 = (c: Ctx) => {
  ground(c);
  page(c, 540, 545, 900, 850);
  c.globalAlpha = 0.35; for (let y = 180; y < 940; y += 34) line(c, [[110, y], [970, y]], 2, COL.blue); c.globalAlpha = 1;
  const x0 = 150, y0 = 200, w = 780, h = 650, rows = 5, cols = 4, cw = w / cols, rh = h / rows;
  c.fillStyle = "#f3e7cf"; c.fillRect(x0, y0, w, rh);
  grid(c, x0, y0, w, h, rows, cols, 4);
  // headers: round, method, timer (seconds), star (neat)
  write(c, "1-4", x0 + cw / 2 - 48, y0 + 36, 60, INK, 6);
  square(c, x0 + cw * 1.5 - 30, y0 + rh / 2, 44, 0, 3); square(c, x0 + cw * 1.5 + 30, y0 + rh / 2, 44, 0, 3);
  timer(c, x0 + cw * 2.5, y0 + rh - 20, 84, "");
  star(c, x0 + cw * 3.5, y0 + rh / 2, 34, COL.red, 4);
  const rowsData: [string, number, string, string][] = [["1", 1, "148", "11"], ["2", 2, "131", "11"], ["3", 2, "126", "12"], ["4", 1, "139", "12"]];
  rowsData.forEach(([n, m, t, k], i) => {
    const cy = y0 + rh * (i + 1.5);
    write(c, n, x0 + cw / 2 - 22, cy - 30, 60, INK, 6);
    if (m === 1) square(c, x0 + cw * 1.5, cy, 56, 0, 3);
    else for (const d of [-1, 0, 1]) square(c, x0 + cw * 1.5 + d * 44, cy, 36, 0, 1);
    write(c, t, x0 + cw * 2.5 - 70, cy - 30, 60, INK, 6);
    write(c, k, x0 + cw * 3.5 - 46, cy - 30, 60, INK, 6);
  });
};

// ================================================================ SET-UP CARDS · e2 The Jar of Dal
// 1. a grown-up counting chana into piles of ten on a tray, a clear glass beside
const s_e2_0 = (c: Ctx) => {
  ground(c); tableTop(c, 700, 790);
  tray(c, 580, 742, 340, 92);
  for (const px of [470, 545, 620, 695]) pile(c, px, 744, 9);
  const r = rnd(9); for (let i = 0; i < 26; i++) chana(c, 170 + r() * 150, 720 + r() * 50, 9, r() * 3);
  const H = person(c, 330, 1070, 620, { adult: true, reachR: [470, 716], reachL: [240, 748] });
  chana(c, H.handR[0] + 14, H.handR[1] + 6, 9, 0.4); chana(c, H.handR[0] + 2, H.handR[1] + 14, 9, 1.6);
  tableFront(c, 790, 1090);
  chanaGlass(c, 880, 778, 170, 250, 0.62, 21);
};
// 2. six people round the table, each writing a secret guess, a hand covering the slip
const s_e2_1 = (c: Ctx) => {
  ground(c); tableTop(c, 790, 862);
  const xs = [115, 285, 455, 625, 795, 965], at = (i: number) => (i % 2 ? [1080, 470, true] : [1040, 440, false]) as [number, number, boolean];
  xs.forEach((x, i) => { const [y, h, ad] = at(i), L = armEnd(x, y, h, -1, REST_L, ad); slip(c, L[0] + 36, L[1] - 2, 74, 50, 0.05); });
  xs.forEach((x, i) => {
    const [y, h, ad] = at(i);
    const H = person(c, x, y, h, { adult: ad, armL: REST_L, armR: WRITE_R });
    heldTool(c, H.handR, [H.handR[0] - 14, H.handR[1] + 12], "pencil", 11);
  });
  tableFront(c, 862, 1090);
};
// 3. six people in a circle, one speaking a guess out loud, glass B in the middle
const s_e2_2 = (c: Ctx) => {
  room(c, 560);
  // a small stool with the glass
  const stool = () => { c.moveTo(430, 760); c.lineTo(650, 760); c.lineTo(640, 900); c.lineTo(440, 900); c.closePath(); };
  person(c, 350, 600, 300, {});
  person(c, 730, 600, 310, { adult: true });
  shape(c, stool, COL.woodDk); shape(c, () => ell(c, 540, 760, 120, 30), COL.wood);
  chanaGlass(c, 540, 752, 130, 190, 0.7, 31);
  person(c, 150, 760, 350, { adult: true });
  person(c, 930, 760, 340, { reachL: [860, 590] });
  person(c, 330, 1000, 400, {});
  person(c, 750, 1000, 400, { adult: true });
  bubble(c, 860, 330, 200, 120, 912, 445, "300");
};
// 4. the guesses in order with the middle one circled and the true number beside it
const s_e2_3 = (c: Ctx) => {
  ground(c);
  page(c, 540, 520, 1000, 700);
  const nums = ["150", "180", "200", "210", "240", "260", "330"], gh = 46;
  nums.forEach((n, i) => write(c, n, 70 + i * 136, 394, gh, INK, 6));
  c.beginPath(); ell(c, 70 + 3 * 136 + 52, 418, 74, 52); c.strokeStyle = RED; c.lineWidth = 9; c.stroke();
  // the true number: the glass, then its count
  chanaGlass(c, 330, 760, 120, 170, 0.66, 41);
  line(c, [[430, 650], [490, 650]], 8); line(c, [[430, 680], [490, 680]], 8);
  write(c, "220", 530, 618, 96, INK, 9);
};

// ================================================================ CARD PICTURES
// flow.e1 · the child doing round 1, one square at a time, the timer running
const f_e1 = (c: Ctx) => {
  room(c, 1000); tableTop(c, 760, 850);
  const PEN: Pt = [Math.PI / 2 + 0.4, 2.67], hnd = armEnd(500, 1050, 520, -1, PEN);
  for (let i = 0; i < 12; i++) square(c, 110 + i * 52, 812, 44, 0, i < 4 ? 3 : i === 4 ? 2 : 0);
  tool(c, 715, 836, 0, 150, "pencil", 16); tool(c, 725, 800, 0, 110, "crayon", 18);
  timer(c, 945, 846, 110, "48");
  const H = person(c, 500, 1050, 520, { armL: PEN, armR: [Math.PI / 2 + 0.05, Math.PI / 2 + 0.05] });
  heldTool(c, H.handL, [hnd[0] - 20, hnd[1] - 10], "pen", 12);
  tableFront(c, 850, 1090);
};
// flow.e2 · a glass of chana and three people each with their own guess
const f_e2 = (c: Ctx) => {
  room(c, 1000); tableTop(c, 790, 860);
  const kid = (x: number) => person(c, x, 1010, 380, { armL: REST_L, armR: REST_R });
  kid(170); person(c, 420, 1040, 400, { adult: true, armL: REST_L, armR: REST_R }); kid(660);
  tableFront(c, 860, 1090);
  chanaGlass(c, 900, 842, 180, 270, 0.64, 51);
  bubble(c, 170, 470, 170, 100, 190, 600, "180");
  bubble(c, 420, 450, 170, 100, 430, 590, "250");
  bubble(c, 660, 470, 170, 100, 650, 600, "300");
};
// flow.a1 · a child on the kitchen floor beside a line of ants along the skirting, notebook and pencil
const f_a1 = (c: Ctx) => {
  room(c, 650);
  shape(c, () => polyP(c, [[0, 600], [D, 600], [D, 650], [0, 650]]), COL.woodDk, 4);
  for (let i = 0; i < 12; i++) ant(c, 110 + i * 84, 650, 72, -1, i % 4 === 1);
  const H = person(c, 400, 990, 400, { sit: true, dir: 1, armL: [-2.6, -2.4], reachR: [562, 892] });
  page(c, 605, 905, 160, 110, 0.08);
  line(c, [[540, 880], [660, 886]], 2, COL.blue); line(c, [[538, 905], [662, 911]], 2, COL.blue); line(c, [[536, 930], [660, 936]], 2, COL.blue);
  heldTool(c, H.handR, [582, 908], "pencil", 12);
};
// flow.a2 · a honeybee worker's forty days: the strip with five coloured jobs
const f_a2 = (c: Ctx) => {
  ground(c);
  rectSh(c, 60, 432, 980, 240); shape(c, () => rrect(c, 50, 420, 980, 240, 10), COL.paper, 6);
  const px = (d: number) => 110 + ((d - 1) * 880) / 39;
  const secs: [number, number, string][] = [[1, 3, COL.teal], [3, 11, COL.pink], [11, 18, COL.yellow], [18, 22, COL.blue], [22, 40, COL.green]];
  secs.forEach(([a, b, col]) => shape(c, () => { c.rect(px(a), 450, px(b) - px(a), 80); }, col, 4));
  line(c, [[90, 540], [1000, 540]], 7);
  for (const d of [1, 10, 20, 30, 40]) { line(c, [[px(d), 525], [px(d), 560]], 6); const t = String(d); write(c, t, px(d) - (t.length * 0.8 * 40 - 8) / 2, 578, 40, INK, 6); }
  // one small picture for each job above its section
  const mid = (a: number, b: number) => (px(a) + px(b)) / 2;
  const icons: [number, (x: number, y: number) => void][] = [
    [mid(1, 3) + 10, (x, y) => { shape(c, () => hexPath(c, x, y, 34), COL.wood, 4); for (const a of [-0.6, 0.4, 1.6]) line(c, [[x + Math.cos(a) * 44, y + Math.sin(a) * 44], [x + Math.cos(a) * 58, y + Math.sin(a) * 58]], 4, COL.teal); }],
    [mid(3, 11), (x, y) => { shape(c, () => hexPath(c, x, y, 36), COL.wood, 4); shape(c, () => ell(c, x, y + 4, 22, 14), WHITE, 4); }],
    [mid(11, 18), (x, y) => { for (const [dx, dy] of [[0, -22], [-30, 14], [30, 14]]) shape(c, () => hexPath(c, x + dx, y + dy, 20), COL.yellow, 4); }],
    [mid(18, 22) + 8, (x, y) => shield(c, x, y, 30)],
    [mid(22, 40), (x, y) => flower(c, x, y, 36)],
  ];
  icons.forEach(([x, f]) => { line(c, [[x, 395], [x, 448]], 4, COL.greyDk); f(x, 330); });
  bee(c, 540, 820, 190, 1);
};
// flow.a3 · the paper on the wall: an arrow for the Sun, the leaning line, and the child tapping it
const f_a3 = (c: Ctx) => {
  room(c, 1040);
  rectSh(c, 130, 242, 560, 610); shape(c, () => rrect(c, 120, 230, 560, 610, 6), COL.paper, 6);
  for (const [x, y] of [[150, 240], [650, 240], [150, 830], [650, 830]]) { c.save(); c.translate(x, y); c.rotate(0.7); c.fillStyle = "rgba(255,230,150,0.85)"; c.fillRect(-30, -9, 60, 18); c.restore(); }
  arrow(c, [[400, 790], [400, 340]], INK, 12);
  sun(c, 400, 272, 32);
  line(c, [[400, 790], [624, 470]], 11, RED);
  for (let t = 0.15; t < 0.95; t += 0.2) { const x = 400 + 224 * t, y = 790 - 320 * t; line(c, [[x - 12, y - 8], [x + 12, y + 8]], 7, RED); }
  const H = person(c, 760, 1040, 620, { reachL: [579, 534] });
  shape(c, () => ell(c, H.handL[0] - 6, H.handL[1] - 4, 8, 8), RED, 0);
};
// flow.a5 · six identical bottles of warm water, three tied in a bundle and three apart
const f_a5 = (c: Ctx) => {
  room(c, 1000); tableTop(c, 600, 860); tableFront(c, 860, 1090);
  for (const x of [200, 290, 380]) bottle(c, x, 800, 92, 300);
  line(c, [[150, 650], [432, 650]], 7, COL.brown); line(c, [[150, 662], [432, 662]], 7, COL.brown);
  shape(c, () => ell(c, 436, 656, 14, 14), COL.brown, 4); line(c, [[446, 660], [478, 640]], 6, COL.brown); line(c, [[446, 662], [474, 690]], 6, COL.brown);
  for (const x of [620, 790, 960]) bottle(c, x, 800, 92, 300);
  for (const x of [290, 620, 790, 960]) steam(c, x, 470);
};
// flow.p1 · the child asking a family member about their jobs and writing them down
const f_p1 = (c: Ctx) => {
  room(c, 1000); tableTop(c, 770, 846);
  const wl = armEnd(330, 1040, 500, -1, WRITE_L);
  page(c, wl[0] + 30, wl[1] + 2, 170, 100, 0.03); grid(c, wl[0] + 30 - 68, wl[1] + 2 - 38, 136, 76, 3, 4, 2.5);
  timer(c, 560, 836, 90, "");
  const K = person(c, 330, 1040, 500, { armL: WRITE_L, armR: REST_R });
  heldTool(c, K.handL, [K.handL[0] - 16, K.handL[1] + 14], "pencil", 12);
  person(c, 760, 1086, 540, { adult: true, armL: REST_L, armR: [Math.PI / 2 - 0.9, -Math.PI / 2 + 0.5] });
  tableFront(c, 846, 1090);
  bubble(c, 900, 400, 200, 140, 820, 505); broom(c, 900, 395, 44);
};
// flow.a4 · the child holding the phone on speaker and writing what the older person says
const f_a4 = (c: Ctx) => {
  room(c, 1000); tableTop(c, 770, 846);
  page(c, 650, 805, 180, 110, 0.04);
  for (const k of [-1, 0, 1]) line(c, [[580, 805 + k * 24], [720, 808 + k * 24]], 2, COL.blue);
  const H = person(c, 480, 1050, 520, { reachL: [330, 650], reachR: [610, 795] });
  phone(c, H.handL[0] - 8, H.handL[1] - 30, -0.25);
  soundArcs(c, H.handL[0] - 50, H.handL[1] - 70, Math.PI, 50);
  heldTool(c, H.handR, [628, 815], "pencil", 12);
  tableFront(c, 846, 1090);
};
// term.10 · a swarm: a brown ball of bees hanging from a tree branch
const t_swarm = (c: Ctx) => {
  ground(c, COL.sky);
  const cluster = () => { c.moveTo(430, 250); c.bezierCurveTo(300, 520, 380, 830, 560, 830); c.bezierCurveTo(740, 830, 820, 520, 690, 250); c.closePath(); };
  shadow(c, 600, 860, 180, 26);
  shape(c, cluster, "#8c5a2b", 0);
  const r = rnd(5);
  c.save(); c.beginPath(); cluster(); c.clip();
  for (let i = 0; i < 900; i++) { const x = 290 + r() * 540, y = 240 + r() * 600, col = ["#d2a53f", "#b5842f", "#7a4a22", "#4a3018"][Math.floor(r() * 4)]; shape(c, () => ell(c, x, y, 14, 8.5, r() * Math.PI), col, 2.5); }
  c.restore();
  shape(c, cluster, noFill, 7);
  // the branch, with leaves
  shape(c, () => { c.moveTo(-10, 150); c.bezierCurveTo(300, 190, 700, 160, 1090, 230); c.lineTo(1090, 290); c.bezierCurveTo(700, 220, 300, 250, -10, 215); c.closePath(); }, COL.brown);
  for (const [x, y, a] of [[150, 170, -1.2], [330, 180, -0.9], [820, 170, -1.4], [980, 205, -0.8], [600, 150, -1.1]]) { const l = 90; shape(c, () => { const tx = x + Math.cos(a) * l, ty = y + Math.sin(a) * l, nx = -Math.sin(a) * 30, ny = Math.cos(a) * 30; c.moveTo(x, y); c.quadraticCurveTo((x + tx) / 2 + nx, (y + ty) / 2 + ny, tx, ty); c.quadraticCurveTo((x + tx) / 2 - nx, (y + ty) / 2 - ny, x, y); c.closePath(); }, COL.leaf, 5); }
  bee(c, 200, 560, 80, 1); bee(c, 900, 640, 80, -1); bee(c, 300, 900, 80, 1); bee(c, 850, 400, 70, -1);
};
// term.14 · two ants face to face, one passing a drop of food to the other
const t_share = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 760, D, D - 760); line(c, [[0, 760], [D, 760]], 6);
  ant(c, 320, 760, 420, 1); ant(c, 760, 760, 420, -1);
  const d = () => { c.moveTo(540, 580); c.quadraticCurveTo(576, 622, 568, 648); c.arc(540, 648, 28, 0, Math.PI); c.quadraticCurveTo(504, 622, 540, 580); c.closePath(); };
  shape(c, d, COL.orange, 5); shine(c, [[528, 628], [530, 648]], 6);
};

export const ic_animalBehaviourAnimalSocietiesL4 = cards("sci.animal-behaviour.animal-societies.L4", [
  s_e1_0, s_e1_1, s_e1_2, s_e1_3, s_e2_0, s_e2_1, s_e2_2, s_e2_3,
  f_e1, f_e2, f_a1, f_a2, f_a3, f_a5, f_p1, f_a4, t_swarm, t_share,
]);
