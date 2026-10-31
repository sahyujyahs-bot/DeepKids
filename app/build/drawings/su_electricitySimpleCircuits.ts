import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// SIMPLE CIRCUITS · set-up cards for sci.electricity.simple-circuits.L3. Same objects on every card:
// a dark cell holder with a steel AA cell (copper nub = +), a teal bulb holder with a round bulb,
// red wires from the + end, black wires from the - end, bare copper tips.

const WOOD = "#ecd2a0", WOODLN = "#d9b97f", COPPER = "#d8894e", BLACKW = "#3a3540", HOT = "#fff3a0";

const table = (c: Ctx, top: number) => {
  ground(c);
  c.fillStyle = WOOD; c.fillRect(0, top, 1080, 1080 - top);
  line(c, [[0, top], [1080, top]], 6);
  for (let i = 1; i < 6; i++) line(c, [[0, top + i * (1080 - top) / 6], [1080, top + i * (1080 - top) / 6]], 3, WOODLN);
};
// a wire with rounded corners, bare tips drawn separately
const wire = (c: Ctx, pts: number[][], col: string, r = 36) => {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) c.arcTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r);
  c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = INK; c.lineWidth = 21; c.stroke(); c.strokeStyle = col; c.lineWidth = 12; c.stroke();
};
// a loose wire lying in smooth curves through the points
const snake = (c: Ctx, pts: number[][], col: string) => {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
  c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = INK; c.lineWidth = 21; c.stroke(); c.strokeStyle = col; c.lineWidth = 12; c.stroke();
};
// a bare copper end, from (x, y) pointing at angle an
const tip = (c: Ctx, x: number, y: number, an: number, len = 40) => {
  const e: number[][] = [[x, y], [x + Math.cos(an) * len, y + Math.sin(an) * len]];
  line(c, e, 17, INK); line(c, e, 9, COPPER);
};
const screw = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 13, 9), COL.steel, 4);

// the cell holder: dark box, steel AA cell with a blue band; plusRight false = cell turned round
const cellHolder = (c: Ctx, x: number, B: number, plusRight = true, w = 290) => {
  shadow(c, x + w / 2 + 16, B + 8, w / 2 + 14, 14);
  const box = () => rrect(c, x, B - 118, w, 118, 18);
  shape(c, box, COL.black); shade(c, box, "#1e1a26", 14, 10, 0.6);
  const nubX = plusRight ? x + w - 4 : x + 4 - 20;
  shape(c, () => rrect(c, nubX, B - 76, 20, 34, 6), COPPER, 5);
  const cell = () => rrect(c, x + 24, B - 96, w - 48, 72, 30);
  shape(c, cell, COL.steel); shade(c, cell, COL.steelDk, 6, 12, 0.7);
  c.save(); c.beginPath(); cell(); c.clip(); c.fillStyle = COL.blue; c.fillRect(x + 60, B - 100, w - 120, 80); c.restore();
  c.beginPath(); cell(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  const [px, mx] = plusRight ? [x + w - 110, x + 52] : [x + 60, x + w - 100];
  write(c, "+", px, B - 78, 36, RED, 8); write(c, "-", mx, B - 78, 36, WHITE, 8);
  screw(c, x + 36, B - 2); screw(c, x + w - 36, B - 2);
};

// a bulb glass at (x, y) radius r; state 0 off, 1 dim, 2 bright
const bulbGlass = (c: Ctx, x: number, y: number, r: number, state: number) => {
  if (state) {
    c.beginPath(); ell(c, x, y, r * 2.6, r * 2.6); c.fillStyle = `rgba(255,224,80,${state === 2 ? 0.3 : 0.12})`; c.fill();
    c.beginPath(); ell(c, x, y, r * 1.8, r * 1.8); c.fillStyle = `rgba(255,224,80,${state === 2 ? 0.45 : 0.18})`; c.fill();
    const n = state === 2 ? 12 : 8;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + 0.2, a0 = r * (state === 2 ? 1.35 : 1.25), a1 = r * (state === 2 ? 1.95 : 1.5); line(c, [[x + Math.cos(a) * a0, y + Math.sin(a) * a0], [x + Math.cos(a) * a1, y + Math.sin(a) * a1]], r * 0.14, "#f5b800"); }
  }
  const g = () => { c.moveTo(x - r * 0.45, y + r * 1.15); c.bezierCurveTo(x - r * 0.45, y + r * 0.7, x - r, y + r * 0.5, x - r, y); c.arc(x, y, r, Math.PI, 0); c.bezierCurveTo(x + r, y + r * 0.5, x + r * 0.45, y + r * 0.7, x + r * 0.45, y + r * 1.15); c.closePath(); };
  shape(c, g, state === 2 ? HOT : state === 1 ? "#fbf0c8" : "rgba(214,236,250,0.8)", 6);
  if (state === 0) shade(c, g, COL.glassEdge, r * 0.2, 0, 0.25);
  // filament: two posts and a zigzag
  const fy = y + r * 0.05;
  line(c, [[x - r * 0.4, y + r * 1.1], [x - r * 0.4, fy]], 4); line(c, [[x + r * 0.4, y + r * 1.1], [x + r * 0.4, fy]], 4);
  line(c, [[x - r * 0.4, fy], [x - r * 0.27, fy - r * 0.22], [x - r * 0.13, fy], [x, fy - r * 0.22], [x + r * 0.13, fy], [x + r * 0.27, fy - r * 0.22], [x + r * 0.4, fy]], state === 2 ? 7 : 5, state === 2 ? "#ff7a1a" : state === 1 ? "#c98a3a" : INK);
  shine(c, [[x - r * 0.62, y - r * 0.25], [x - r * 0.4, y - r * 0.62]], r * 0.12);
};
// the bulb holder: teal base with a steel screw collar and a round bulb on top
const bulbHolder = (c: Ctx, bx: number, B: number, state: number) => {
  shadow(c, bx + 14, B + 8, 100, 14);
  bulbGlass(c, bx, B - 175, 72, state);
  const col = () => rrect(c, bx - 36, B - 108, 72, 52, 8);
  shape(c, col, COL.steel); shade(c, col, COL.steelDk, 10, 0, 0.7);
  for (let i = 0; i < 3; i++) line(c, [[bx - 36, B - 98 + i * 14], [bx + 36, B - 92 + i * 14]], 3, COL.steelDk);
  const base = () => rrect(c, bx - 78, B - 62, 156, 62, 14);
  shape(c, base, COL.teal); shade(c, base, COL.tealDk, 14, 0, 0.7);
  screw(c, bx - 46, B - 2); screw(c, bx + 46, B - 2);
};
// a flag with a number on a small pole, standing at (x, y)
const flag = (c: Ctx, x: number, y: number, n: string) => {
  line(c, [[x, y], [x, y - 84]], 6);
  shape(c, () => polyP(c, [[x, y - 84], [x + 54, y - 84], [x + 54, y - 36], [x, y - 36]]), COL.yellow, 5);
  write(c, n, x + 16, y - 78, 32, INK, 7);
};
const loopCell = (c: Ctx, B: number, bx: number, state: number) => { table(c, B - 60); cellHolder(c, 80, B); bulbHolder(c, bx, B, state); };
const clip = (c: Ctx, x: number, y: number) => { const p = () => rrect(c, x - 22, y - 16, 44, 32, 8); shape(c, p, COL.steel); shade(c, p, COL.steelDk, 6, 6, 0.7); };

// ---------------------------------------------------------------- things for the two piles
const rot = (c: Ctx, x: number, y: number, a: number, f: () => void) => { c.save(); c.translate(x, y); c.rotate(a); f(); c.restore(); };
const spoon = (c: Ctx, x: number, y: number, a: number) => rot(c, x, y, a, () => {
  shadow(c, 10, 38, 120, 12);
  shape(c, () => { c.moveTo(-30, -12); c.lineTo(110, -8); c.quadraticCurveTo(122, 0, 110, 8); c.lineTo(-30, 12); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, -70, 0, 62, 42), COL.steel); shape(c, () => ell(c, -72, -2, 46, 28), COL.steelIn, 4);
});
const key = (c: Ctx, x: number, y: number, a: number) => rot(c, x, y, a, () => {
  shadow(c, 0, 40, 100, 12);
  shape(c, () => rrect(c, -10, -9, 120, 18, 7), "#e0b040");
  shape(c, () => rrect(c, 80, 6, 14, 26, 3), "#e0b040", 5); shape(c, () => rrect(c, 100, 6, 14, 20, 3), "#e0b040", 5);
  shape(c, () => ell(c, -42, 0, 40, 40), "#e0b040"); shape(c, () => ell(c, -42, 0, 17, 17), BG_, 5);
});
const BG_ = "#ecd2a0";
const coin = (c: Ctx, x: number, y: number) => { shadow(c, x + 8, y + 38, 54, 10); shape(c, () => ell(c, x, y, 50, 50), "#d9d6c8"); shape(c, () => ell(c, x, y, 36, 36), "#e9e6da", 4); write(c, "1", x - 9, y - 18, 34, COL.greyDk, 6); };
const foil = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 8, y + 50, 62, 10);
  const p = () => { for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, r = 54 + (i % 2) * 8; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); };
  shape(c, p, COL.steelIn); shade(c, p, COL.steelDk, 18, 14, 0.6); line(c, [[x - 20, y - 10], [x + 4, y + 8], [x - 6, y + 28]], 3, COL.steelDk);
};
const paperclip = (c: Ctx, x: number, y: number, a: number) => rot(c, x, y, a, () => {
  const p = [[-50, 20], [-50, -20], [20, -20], [20, 12], [-24, 12], [-24, -4], [50, -4]]; // approximate loops
  line(c, [[-50, 24], [-50, -22], [26, -22], [26, 14], [-26, 14], [-26, -6], [56, -6]], 15, INK); line(c, [[-50, 24], [-50, -22], [26, -22], [26, 14], [-26, 14], [-26, -6], [56, -6]], 7, COL.steelDk); void p;
});
const nail = (c: Ctx, x: number, y: number, a: number) => rot(c, x, y, a, () => {
  shadow(c, 0, 26, 90, 8);
  shape(c, () => polyP(c, [[-60, -7], [60, -3], [92, 0], [60, 3], [-60, 7]]), COL.steelDk, 5); shape(c, () => rrect(c, -78, -20, 20, 40, 5), COL.steel, 5);
});
const eraser = (c: Ctx, x: number, y: number) => { shadow(c, x + 8, y + 42, 90, 10); const p = () => rrect(c, x - 80, y - 36, 160, 74, 14); shape(c, p, COL.pink); shade(c, p, "#d97a98", 10, 10, 0.5); shape(c, () => rrect(c, x - 36, y - 36, 72, 74, 4), COL.blue, 5); };
const stick = (c: Ctx, x: number, y: number, a: number) => rot(c, x, y, a, () => { shadow(c, 6, 28, 100, 9); const p = () => rrect(c, -95, -22, 190, 44, 22); shape(c, p, COL.wood); shade(c, p, COL.woodDk, 8, 8, 0.5); });
const comb = (c: Ctx, x: number, y: number) => { shadow(c, x + 8, y + 60, 90, 10); shape(c, () => rrect(c, x - 85, y - 34, 170, 40, 10), COL.blue); for (let i = 0; i < 9; i++) shape(c, () => rrect(c, x - 80 + i * 19, y + 4, 10, 46, 4), COL.blue, 4); };
const marble = (c: Ctx, x: number, y: number) => { shadow(c, x + 6, y + 44, 48, 9); shape(c, () => ell(c, x, y, 42, 42), "#8dc0ee"); shade(c, () => ell(c, x, y, 42, 42), COL.blueDk, 10, 12, 0.5); shine(c, [[x - 24, y - 10], [x - 12, y - 26]], 8); };
const band = (c: Ctx, x: number, y: number) => { shadow(c, x + 6, y + 40, 70, 9); c.beginPath(); ell(c, x, y, 62, 36, 0.2); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); c.strokeStyle = COL.red; c.lineWidth = 13; c.stroke(); };
const paper = (c: Ctx, x: number, y: number) => { shadow(c, x + 8, y + 50, 80, 9); shape(c, () => polyP(c, [[x - 70, y - 50], [x + 40, y - 50], [x + 74, y - 18], [x + 74, y + 48], [x - 70, y + 48]]), COL.paper); shape(c, () => polyP(c, [[x + 40, y - 50], [x + 40, y - 18], [x + 74, y - 18]]), "#e8dfc9", 5); };
// a standing paper label with a bulb picture: lit, or dark and crossed out
const label = (c: Ctx, x: number, lit: boolean) => {
  shadow(c, x + 12, 424, 160, 12);
  shape(c, () => rrect(c, x - 150, 90, 300, 330, 18), COL.paper);
  bulbGlass(c, x, 215, 62, lit ? 2 : 0);
  shape(c, () => rrect(c, x - 40, 288, 80, 46, 8), COL.steel, 5);
  if (!lit) { line(c, [[x - 105, 130], [x + 105, 330]], 22, INK); line(c, [[x - 105, 130], [x + 105, 330]], 12, RED); line(c, [[x + 105, 130], [x - 105, 330]], 22, INK); line(c, [[x + 105, 130], [x - 105, 330]], 12, RED); }
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  const B = 600; loopCell(c, B, 760, 0);
  wire(c, [[334, B + 4], [334, B + 90], [715, B + 90], [715, B + 4]], RED);
  wire(c, [[806, B + 4], [806, B + 200], [610, B + 200]], BLACKW); tip(c, 610, B + 200, Math.PI, 44);
  wire(c, [[116, B + 4], [116, B + 200], [330, B + 200]], BLACKW); tip(c, 330, B + 200, 0, 44);
  arrow(c, [[400, B + 300], [450, B + 300]]); arrow(c, [[540, B + 300], [490, B + 300]]);
};
// setup.e1.1 : two piles. Left under the lit bulb (metal things), right under the crossed bulb; a hand sorts one in
const e1_1 = (c: Ctx) => {
  table(c, 300);
  for (const [x, lit] of [[270, true], [810, false]] as [number, boolean][]) { c.save(); c.translate(x, 20); c.scale(0.7, 0.7); c.translate(-x, -90); label(c, x, lit); c.restore(); }
  line(c, [[540, 330], [540, 1060]], 8, WOODLN);
  spoon(c, 200, 430, 0.2); key(c, 400, 420, -0.15); coin(c, 110, 590); foil(c, 270, 600); paperclip(c, 440, 610, 0.1); nail(c, 280, 750, -0.1);
  eraser(c, 690, 430); stick(c, 900, 430, 0.15); comb(c, 640, 600); marble(c, 800, 610); band(c, 930, 610); paper(c, 780, 770);
  coin(c, 615, 875); hand(c, 700, 965, -2.2, 1.2, SKIN.child, CLOTH.child, false);
  arrow(c, [[540, 860], [420, 810]]);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  const B = 470; loopCell(c, B, 800, 2);
  wire(c, [[334, B + 4], [334, B + 80], [755, B + 80], [755, B + 4]], RED);
  // the spoon, lying on the table, with the two loose wire ends pressed on it
  spoon(c, 570, 850, 0);
  wire(c, [[116, B + 4], [116, 690], [250, 790], [345, 915]], BLACKW); wire(c, [[846, B + 4], [846, 690], [780, 790], [755, 915]], BLACKW);
  hand(c, 330, 965, -0.9, 1.3, SKIN.adult, CLOTH.adult, false); hand(c, 800, 965, -2.4, 1.3, SKIN.adult, CLOTH.adult, false);
  tip(c, 395, 885, -0.5, 60); tip(c, 725, 890, -2.6, 70);
};
// a bare twisted join of two wires, with a number flag standing on it
const twist = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x, y, 30, 22), COPPER, 5);
  for (let i = -1; i <= 1; i++) line(c, [[x + i * 12 - 9, y - 18], [x + i * 12 + 9, y + 18]], 4, INK);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  const B = 570; loopCell(c, B, 780, 2);
  wire(c, [[334, B + 4], [334, B + 110], [540, B + 110]], RED); wire(c, [[540, B + 110], [735, B + 110], [735, B + 4]], RED);
  wire(c, [[826, B + 4], [826, B + 230], [116, B + 230], [116, B + 4]], BLACKW);
  twist(c, 334, B + 110); twist(c, 540, B + 110); twist(c, 735, B + 110);
  flag(c, 334, B + 90, "1"); flag(c, 540, B + 90, "2"); flag(c, 735, B + 90, "3");
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  const B = 570; loopCell(c, B, 780, 0);
  wire(c, [[334, B + 4], [334, B + 110], [540, B + 110]], RED); wire(c, [[540, B + 110], [735, B + 110], [735, B + 4]], RED); clip(c, 540, B + 110);
  wire(c, [[826, B + 4], [826, B + 230], [620, B + 230]], BLACKW); tip(c, 620, B + 230, Math.PI, 40);
  wire(c, [[116, B + 4], [116, B + 230], [310, B + 230]], BLACKW); tip(c, 310, B + 230, 0, 40);
  arrow(c, [[540, B + 330], [610, B + 330]]); arrow(c, [[400, B + 330], [330, B + 330]]);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  const B = 520; table(c, 460);
  cellHolder(c, 270, B); bulbHolder(c, 880, B, 2);
  person(c, 700, B + 6, 400, { armL: [1.7, 1.6], armR: [1.4, 1.5] });
  wire(c, [[524, B + 4], [524, B + 80], [835, B + 80], [835, B + 4]], RED);
  snake(c, [[926, B + 4], [926, 700], [860, 790], [620, 760], [760, 890], [520, 960], [300, 900], [420, 790], [250, 740], [200, 650], [230, 620]], BLACKW);
  hand(c, 70, 650, -0.2, 1.3, SKIN.adult, CLOTH.adult, false);
  tip(c, 246, 612, -0.62, 70);
  line(c, [[120, 1035], [900, 1035]], 5); line(c, [[120, 1015], [120, 1055]], 5); line(c, [[900, 1015], [900, 1055]], 5);
  write(c, "2 m", 460, 988, 36, INK, 7);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  const B = 600; loopCell(c, B, 760, 1);
  wire(c, [[334, B + 4], [334, B + 90], [715, B + 90], [715, B + 4]], RED);
  wire(c, [[806, B + 4], [806, B + 200], [116, B + 200], [116, B + 4]], BLACKW);
};
// two cells in a row; flipped = the second cell is turned round
const twoCells = (c: Ctx, flipped: boolean, state: number) => {
  const B = 540; table(c, B - 60);
  cellHolder(c, 30, B, true, 280); cellHolder(c, 390, B, !flipped, 280); bulbHolder(c, 890, B, state);
  const left = flipped ? RED : BLACKW, right = flipped ? BLACKW : RED;
  wire(c, [[274, B + 4], [274, B + 90], [350, B + 90]], RED); wire(c, [[426, B + 4], [426, B + 90], [350, B + 90]], left); clip(c, 350, B + 90);
  wire(c, [[634, B + 4], [634, B + 180], [844, B + 180], [844, B + 4]], right);
  wire(c, [[936, B + 4], [936, B + 270], [66, B + 270], [66, B + 4]], BLACKW);
  if (flipped) { arrow(c, [[90, B - 150], [230, B - 150]]); arrow(c, [[600, B - 150], [460, B - 150]]); }
};
// setup.e3.1
const e3_1 = (c: Ctx) => twoCells(c, false, 2);
// setup.e3.2
const e3_2 = (c: Ctx) => twoCells(c, true, 0);

export const su_electricitySimpleCircuits = cards("sci.electricity.simple-circuits.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
