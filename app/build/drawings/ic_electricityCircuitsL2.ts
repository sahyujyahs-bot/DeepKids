import type { Ctx } from "./core";
import { D, INK, COL, WHITE, ground, shape, ell, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// SIMPLE CIRCUITS L2 · set-up cards and card pictures: an AA cell with a rubber band along it, two
// wires (red and black) with bare copper ends, a torch bulb in a black holder with two screws.

const COPPER = "#d98a4a", BULB_LIT = "#fff1a8", GLOW = "rgba(255,211,77,0.4)";

// a smooth wire through pts: ink outline, then the plastic colour
const curve = (c: Ctx, pts: number[][]) => {
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
  c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
};
const wire = (c: Ctx, pts: number[][], col: string, w = 14) => {
  c.lineCap = "round"; c.lineJoin = "round";
  curve(c, pts); c.strokeStyle = INK; c.lineWidth = w + 10; c.stroke();
  curve(c, pts); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};
// a bare copper end of a wire, from (x, y) at angle an
const tip = (c: Ctx, x: number, y: number, an: number, len = 40, w = 10) => {
  const ex = x + Math.cos(an) * len, ey = y + Math.sin(an) * len;
  line(c, [[x, y], [ex, ey]], w + 8, INK); line(c, [[x, y], [ex, ey]], w, COPPER);
};

// an AA cell lying flat, centre (x, y), length L, diameter dia; bump on the right unless bumpRight = false
const cell = (c: Ctx, x: number, y: number, L: number, dia: number, bumpRight = true, band = true) => {
  const l = x - L / 2, t = y - dia / 2, s = bumpRight ? 1 : -1;
  shadow(c, x + 14, y + dia / 2 + 6, L / 2, dia * 0.12);
  const body = () => rrect(c, l, t, L, dia, dia * 0.12);
  shape(c, body, COL.blue);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.yellow; c.fillRect(x - L * 0.18, t, L * 0.36, dia);
  c.fillStyle = COL.steel; c.fillRect(l, t, L * 0.07, dia); c.fillRect(l + L * 0.93, t, L * 0.07, dia);
  c.restore();
  shade(c, body, COL.blueDk, 0, -dia * 0.38, 0.35);
  shape(c, body, "rgba(0,0,0,0)");
  // the bump (+) end
  const bx = bumpRight ? l + L : l - dia * 0.17;
  shape(c, () => rrect(c, bx, y - dia * 0.18, dia * 0.17, dia * 0.36, 6), COL.steel);
  write(c, "+", x + s * L * 0.34 - 18, y - 22, 44, WHITE, 7);
  write(c, "-", x - s * L * 0.34 - 18, y - 22, 44, WHITE, 7);
  if (band) {
    shape(c, () => rrect(c, l - 14, y - 11, L + 28, 22, 8), COL.brown, 5);
    for (const ex of [l, l + L]) shape(c, () => rrect(c, ex - 14, y - dia * 0.3, 22, dia * 0.6, 8), COL.brown, 5);
  }
};

// the glow round a lit bulb, centred (x, y), dome size r
const glow = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r * 1.8, r * 1.8), GLOW, 0);
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + 0.3; line(c, [[x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.5], [x + Math.cos(a) * r * 2.05, y + Math.sin(a) * r * 2.05]], 10, COL.orange); }
};
// a torch bulb: dome centre (x, y), scale s (1 = dome 95 wide), screw base below
const bulb = (c: Ctx, x: number, y: number, s: number, lit: boolean, bigCoil = false) => {
  const rx = 95 * s, ry = 110 * s;
  if (lit) glow(c, x, y, rx);
  shape(c, () => rrect(c, x - 50 * s, y + 95 * s, 100 * s, 110 * s, 10 * s), COL.steel);
  shade(c, () => rrect(c, x - 50 * s, y + 95 * s, 100 * s, 110 * s, 10 * s), COL.steelDk, -30 * s, 0, 0.45);
  for (let k = 0; k < 4; k++) line(c, [[x - 46 * s, y + (118 + k * 22) * s], [x + 46 * s, y + (110 + k * 22) * s]], 4, INK);
  shape(c, () => ell(c, x, y + 205 * s, 24 * s, 10 * s), COL.black, 5);
  shape(c, () => ell(c, x, y, rx, ry), lit ? BULB_LIT : COL.glass, 6);
  // the two thick support wires and the thin coiled filament between them
  const fy = y - 10 * s;
  line(c, [[x - 26 * s, y + 95 * s], [x - 26 * s, fy]], 5 * s, COL.greyDk); line(c, [[x + 26 * s, y + 95 * s], [x + 26 * s, fy]], 5 * s, COL.greyDk);
  const zig: number[][] = []; const n = bigCoil ? 14 : 8;
  for (let k = 0; k <= n; k++) zig.push([x - 26 * s + (52 * s * k) / n, fy + (k % 2 ? -14 : 14) * s * (bigCoil ? 1.3 : 1)]);
  line(c, zig, lit ? 6 * s : 4 * s, lit ? COL.orange : COL.greyDk);
  if (lit) line(c, zig, 3 * s, COL.yellow);
  c.globalAlpha = 0.6; line(c, [[x - rx * 0.55, y - ry * 0.5], [x - rx * 0.3, y - ry * 0.8]], 8 * s, WHITE); c.globalAlpha = 1;
};
// a bulb holder: black base centred (x, y) with a screw on each side, the bulb above (raised by `up`)
const holder = (c: Ctx, x: number, y: number, lit: boolean, up = 0) => {
  shadow(c, x + 16, y + 52, 150, 24);
  shape(c, () => rrect(c, x - 130, y - 45, 260, 90, 14), COL.black);
  shade(c, () => rrect(c, x - 130, y - 45, 260, 90, 14), "#1a1620", -40, 0, 0.5);
  for (const sx of [x - 100, x + 100]) { shape(c, () => ell(c, sx, y - 45, 20, 20), COL.steel, 5); line(c, [[sx - 10, y - 45], [sx + 10, y - 45]], 4, INK); }
  bulb(c, x, y - 250 - up, 1, lit);
};
// a hand's-eye red arrow turning round: an arc from a1 to a2 round (x, y)
const turnArrow = (c: Ctx, x: number, y: number, r: number, a1: number, a2: number) => {
  const pts: number[][] = []; for (let k = 0; k <= 8; k++) { const a = a1 + ((a2 - a1) * k) / 8; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  arrow(c, pts);
};

// the standard circuit: cell at the left, holder at the right, wires between
type Circ = { bumpRight?: boolean; lit?: boolean; red?: "straight" | "coil" | "cross"; bothFlat?: boolean; up?: number; swap?: boolean };
const circuit = (c: Ctx, o: Circ = {}) => {
  const bumpRight = o.bumpRight ?? true, lit = o.lit ?? true, red = o.red ?? "straight";
  const CX = 300, CY = 720, L = 380, DIA = 150, HX = 790, HY = 700, LS: number[] = [HX - 100, HY - 45], RS: number[] = [HX + 100, HY - 45];
  const bumpX = bumpRight ? CX + L / 2 + DIA * 0.17 : CX - L / 2 - DIA * 0.17, flatX = bumpRight ? CX - L / 2 : CX + L / 2;
  cell(c, CX, CY, L, DIA, bumpRight, false);
  if (o.bothFlat) {
    tip(c, flatX + 10, CY - 22, Math.PI); tip(c, flatX + 10, CY + 22, Math.PI);
    wire(c, [[flatX - 30, CY - 22], [40, CY - 60], [40, 540], [560, 540], LS], COL.red);
    wire(c, [[flatX - 30, CY + 22], [40, CY + 60], [40, 880], [980, 880], [980, 700], RS], COL.black);
  } else if (red === "coil") {
    tip(c, bumpX, CY, 0);
    // a pencil with the red wire wound round it
    shape(c, () => rrect(c, 500, 584, 230, 34, 6), COL.yellow);
    shape(c, () => { c.moveTo(500, 584); c.lineTo(460, 601); c.lineTo(500, 618); c.closePath(); }, COL.wood, 5);
    shape(c, () => { c.moveTo(476, 594); c.lineTo(460, 601); c.lineTo(476, 608); c.closePath(); }, COL.black, 3);
    wire(c, [[bumpX + 36, CY], [560, 700], [545, 601]], COL.red);
    for (let k = 0; k < 6; k++) { shape(c, () => ell(c, 560 + k * 26, 601, 15, 30), "rgba(0,0,0,0)", 24); shape(c, () => ell(c, 560 + k * 26, 601, 15, 30), "rgba(0,0,0,0)", 0); c.beginPath(); ell(c, 560 + k * 26, 601, 15, 30); c.strokeStyle = COL.red; c.lineWidth = 14; c.stroke(); }
    wire(c, [[705, 601], [720, 660], LS], COL.red);
    wire(c, [[flatX - 10, CY], [60, CY], [60, 880], [980, 880], [980, 700], RS], COL.black);
    tip(c, flatX + 30, CY, Math.PI);
  } else if (red === "cross") {
    tip(c, bumpX, CY, 0); tip(c, flatX + 30, CY, Math.PI);
    wire(c, [[flatX - 10, CY], [60, CY], [60, 880], [280, 880], [340, 850], [390, 880], [340, 915], [300, 880], [560, 880], [700, 700], LS], COL.black);
    wire(c, [[bumpX + 36, CY], [700, 820], [940, 790], RS], COL.red);
  } else {
    const redEnd = o.swap ? RS : LS, blackEnd = o.swap ? LS : RS;
    if (bumpRight) {
      tip(c, bumpX, CY, 0); tip(c, flatX + 30, CY, Math.PI);
      wire(c, [[bumpX + 36, CY], [600, 660], redEnd], COL.red);
      wire(c, [[flatX - 10, CY], [60, CY], [60, 880], [980, 880], [980, 700], blackEnd], COL.black);
    } else {
      tip(c, bumpX, CY, Math.PI); tip(c, flatX - 30, CY, 0);
      wire(c, [[bumpX - 36, CY], [40, CY], [40, 540], [560, 540], redEnd], COL.red);
      wire(c, [[flatX + 10, CY], [540, CY], [560, 880], [980, 880], [980, 700], blackEnd], COL.black);
    }
  }
  // the rubber band over the wire ends
  shape(c, () => rrect(c, CX - L / 2 - 14, CY - 11, L + 28, 22, 8), COL.brown, 5);
  for (const ex of [CX - L / 2, CX + L / 2]) shape(c, () => rrect(c, ex - 11, CY - DIA * 0.3, 22, DIA * 0.6, 8), COL.brown, 5);
  holder(c, HX, HY, lit, o.up ?? 0);
};

// a wooden table top from y down, and the child standing at the left pointing at it
const tableScene = (c: Ctx, happy = false) => {
  ground(c);
  shape(c, () => { c.rect(300, 760, 800, 340); }, COL.wood, 6);
  line(c, [[300, 800], [1080, 800]], 5, COL.woodDk);
  person(c, 150, 1040, 600, { armR: happy ? [-Math.PI * 0.5, -Math.PI * 0.55] : [-0.3, 0.15], armL: happy ? [Math.PI * 0.75, Math.PI * 0.5] : undefined });
};
const smallCircuit = (c: Ctx, o: Circ, extra?: () => void) => { c.save(); c.translate(280, 230); c.scale(0.72, 0.72); circuit(c, o); extra?.(); c.restore(); };

// ------------------------------------------------------------ set-up cards: e1 (the shape test)
const e1s0 = (c: Ctx) => { ground(c); circuit(c, { lit: true }); };
const e1s1 = (c: Ctx) => { ground(c); circuit(c, { lit: true, red: "coil" }); };
const e1s2 = (c: Ctx) => { ground(c); circuit(c, { lit: true, red: "cross" }); };
const e1s3 = (c: Ctx) => { ground(c); circuit(c, { lit: false, bothFlat: true }); };
const e1s4 = (c: Ctx) => {
  ground(c); circuit(c, { lit: false, up: 30 });
  hand(c, 940, 290, Math.PI * 0.78, 1.15);
  turnArrow(c, 790, 420, 185, Math.PI * 1.05, Math.PI * 1.45);
};
// ------------------------------------------------------------ set-up cards: e2 (which way round)
const e2s0 = (c: Ctx) => { ground(c); circuit(c, { lit: true, bumpRight: false }); };
const e2s1 = (c: Ctx) => { ground(c); circuit(c, { lit: true, bumpRight: true }); turnArrow(c, 300, 720, 150, Math.PI * 1.15, Math.PI * 1.85); };
const e2s2 = (c: Ctx) => {
  ground(c); circuit(c, { lit: true, swap: true });
  arrow(c, [[700, 790], [790, 830], [880, 790]]);
  arrow(c, [[880, 760], [790, 720], [700, 760]]);
};

// ------------------------------------------------------------ card pictures
const flowE1 = (c: Ctx) => { tableScene(c); smallCircuit(c, { lit: true, red: "coil" }); };
const flowE2 = (c: Ctx) => { tableScene(c); smallCircuit(c, { lit: true }, () => turnArrow(c, 300, 720, 150, Math.PI * 1.15, Math.PI * 1.85)); };
const flowA1 = (c: Ctx) => { tableScene(c, true); smallCircuit(c, { lit: true }); };
const flowA2 = (c: Ctx) => {
  ground(c);
  person(c, 150, 1040, 600, { armR: [-0.4, -0.2] });
  const lx = 600, ly = 470, R = 280;
  shadow(c, lx + 30, ly + 40, R + 20, R + 20);
  // handle, rim, glass, the bulb seen big through it
  c.save(); c.translate(lx + R * 0.7, ly + R * 0.7); c.rotate(Math.PI / 4); shape(c, () => rrect(c, -20, -36, 320, 72, 30), COL.brown, 6); c.restore();
  shape(c, () => ell(c, lx, ly, R + 26, R + 26), COL.black, 6);
  shape(c, () => ell(c, lx, ly, R, R), COL.sky, 5);
  c.save(); c.beginPath(); ell(c, lx, ly, R, R); c.clip();
  bulb(c, lx, ly - 40, 2.2, false, true);
  c.restore();
  c.globalAlpha = 0.5; line(c, [[lx - R * 0.6, ly - R * 0.45], [lx - R * 0.3, ly - R * 0.75]], 16, WHITE); c.globalAlpha = 1;
};
const flowA3 = (c: Ctx) => {
  ground(c);
  cell(c, 420, 330, 520, 190, true, false);
  arrow(c, [[150, 130], [190, 240]]); arrow(c, [[720, 130], [700, 240]]);
  write(c, "2", 400, 90, 110, INK, 12);
  bulb(c, 700, 660, 1.5, false);
  arrow(c, [[400, 860], [610, 830]]); arrow(c, [[960, 1030], [740, 975]]);
  write(c, "2", 660, 400, 110, INK, 12);
};
const flowP1 = (c: Ctx) => {
  ground(c, "#2d2f52");
  shape(c, () => { c.rect(0, 860, D, 220); }, "#3d3458", 6);
  shadow(c, 560, 870, 220, 30);
  // the striped tube
  const stripe = () => rrect(c, 440, 530, 200, 340, 18);
  shape(c, stripe, WHITE);
  c.save(); c.beginPath(); stripe(); c.clip(); c.fillStyle = COL.red; for (let k = 0; k < 3; k++) c.fillRect(440, 530 + k * 114, 200, 57); c.restore();
  shade(c, stripe, INK, -60, 0, 0.25);
  shape(c, stripe, "rgba(0,0,0,0)");
  // the cut-down cup on top, holding the bulb holder
  shape(c, () => { c.moveTo(430, 450); c.lineTo(650, 450); c.lineTo(630, 530); c.lineTo(450, 530); c.closePath(); }, COL.paper);
  shape(c, () => ell(c, 540, 450, 110, 22), COL.cloth, 5);
  shape(c, () => rrect(c, 480, 400, 120, 50, 10), COL.black);
  glow(c, 540, 290, 120);
  bulb(c, 540, 290, 1, true);
};
const termCell = (c: Ctx) => { ground(c); cell(c, 540, 560, 660, 250, true, false); };
const termBulb = (c: Ctx) => { ground(c); shadow(c, 560, 980, 160, 26); bulb(c, 540, 380, 2.6, false); };
const termFilament = (c: Ctx) => { ground(c); shadow(c, 560, 980, 160, 26); bulb(c, 540, 400, 2.6, true, true); };
const termWire = (c: Ctx) => {
  ground(c);
  const pts = [[150, 700], [250, 320], [540, 720], [820, 330], [940, 420]];
  tip(c, 150, 700, Math.PI * 0.83, 110, 28); tip(c, 940, 420, Math.PI * 0.2, 110, 28);
  c.lineCap = "round"; c.lineJoin = "round";
  curve(c, pts); c.strokeStyle = INK; c.lineWidth = 64; c.stroke();
  curve(c, pts); c.strokeStyle = COL.red; c.lineWidth = 50; c.stroke();
  c.globalAlpha = 0.5; curve(c, pts); c.strokeStyle = WHITE; c.lineWidth = 8; c.stroke(); c.globalAlpha = 1;
};

export const ic_electricityCircuitsL2 = cards("sci.electricity.circuits.L2", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, termCell, termBulb, termFilament, termWire,
]);
