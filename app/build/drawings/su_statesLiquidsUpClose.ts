import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SH, ground, shape, ell, polyP, shadow, shade, line, shine, arrow, plate, hand, write, cards, SKIN, CLOTH, rnd } from "./flatKit";

// LIQUIDS UP CLOSE (L3) · set-up cards: the slope race (e1) and the water dome on a coin (e2).
const HONEY = "#e0901f", HONEYDk = "#b86d10", OIL = "#f2c230", SHAMP = "#e66fa8", SHAMPDk = "#c24c86", TAPE = "#ffd34d";
type Pt = [number, number];
type Quad = { tl: Pt; tr: Pt; bl: Pt; br: Pt };

// a point on a quad: u across (0 left .. 1 right), v down (0 top .. 1 bottom)
const tp = (q: Quad, u: number, v: number): Pt => {
  const lx = q.tl[0] + (q.bl[0] - q.tl[0]) * v, ly = q.tl[1] + (q.bl[1] - q.tl[1]) * v;
  const rx = q.tr[0] + (q.br[0] - q.tr[0]) * v, ry = q.tr[1] + (q.br[1] - q.tr[1]) * v;
  return [lx + (rx - lx) * u, ly + (ry - ly) * u];
};
const quadP = (c: Ctx, q: Quad, u0: number, u1: number, v0: number, v1: number) => () => polyP(c, [tp(q, u0, v0), tp(q, u1, v0), tp(q, u1, v1), tp(q, u0, v1)]);

// newspaper under things: pale sheet with grey blocks and lines, no words
const newspaper = (c: Ctx, q: Quad) => {
  shape(c, quadP(c, q, 0, 1, 0, 1), "#f4efe2", 5);
  const r = rnd(5);
  c.globalAlpha = 0.55;
  for (let k = 0; k < 2; k++) {
    const u0 = 0.05 + k * 0.5;
    shape(c, quadP(c, q, u0, u0 + 0.4, 0.04, 0.12), COL.grey, 0);
    for (let i = 0; i < 18; i++) { const v = 0.16 + i * 0.045, e = 0.4 - r() * 0.12; line(c, [tp(q, u0, v), tp(q, u0 + e, v)], 5, COL.grey); }
  }
  c.globalAlpha = 1;
};

// the steel tray: shadow, front rim, outer rim, inner floor
const tray = (c: Ctx, q: Quad) => {
  const sh: Pt[] = [[q.tl[0] + 24, q.tl[1] + 34], [q.tr[0] + 28, q.tr[1] + 34], [q.br[0] + 30, q.br[1] + 56], [q.bl[0] + 24, q.bl[1] + 56]];
  c.beginPath(); polyP(c, sh); c.fillStyle = SH; c.fill();
  shape(c, () => polyP(c, [q.bl, q.br, [q.br[0], q.br[1] + 34], [q.bl[0], q.bl[1] + 34]]), COL.steelDk, 6);
  shape(c, quadP(c, q, 0, 1, 0, 1), COL.steel, 6);
  shape(c, quadP(c, q, 0.9, 1, 0, 1), COL.steelDk, 0);
  shape(c, quadP(c, q, 0.05, 0.95, 0.03, 0.97), COL.steelIn, 5);
  c.beginPath(); polyP(c, [tp(q, 0, 0), tp(q, 1, 0), tp(q, 1, 1), tp(q, 0, 1)]); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
// a tape strip across the tray at v
const tape = (c: Ctx, q: Quad, v: number) => shape(c, quadP(c, q, -0.01, 1.01, v - 0.022, v + 0.022), TAPE, 4);

// a stack of three books lying flat, front face at x..x+w, bottom at y
const books = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + w * 0.55, y + 8, w * 0.62, 20);
  const cols: [string, string][] = [[COL.teal, COL.tealDk], [COL.red, "#b83a26"], [COL.blue, COL.blueDk]];
  cols.forEach(([col, dk], i) => {
    const by = y - (i + 1) * 62, off = (i % 2) * 14 - 7, bx = x + off;
    shape(c, () => polyP(c, [[bx, by], [bx + 34, by - 22], [bx + w + 34, by - 22], [bx + w, by]]), WHITE, 5);
    shape(c, () => polyP(c, [[bx + w, by], [bx + w + 34, by - 22], [bx + w + 34, by + 40], [bx + w, by + 62]]), COL.paper, 5);
    shape(c, () => polyP(c, [[bx, by], [bx + w, by], [bx + w, by + 62], [bx, by + 62]]), col, 5);
    shape(c, () => polyP(c, [[bx + 12, by + 14], [bx + w - 6, by + 14], [bx + w - 6, by + 48], [bx + 12, by + 48]]), COL.paper, 4);
    shade(c, () => polyP(c, [[bx, by], [bx + w, by], [bx + w, by + 62], [bx, by + 62]]), dk, 0, 0, 0);
    shape(c, () => polyP(c, [[bx, by], [bx + 12, by], [bx + 12, by + 62], [bx, by + 62]]), dk, 4);
    for (let k = 1; k < 4; k++) line(c, [[bx + w + 6 * k, by + 6 - 6 * k * 0.5], [bx + w + 6 * k, by + 56 - 6 * k * 0.5]], 2, COL.grey);
  });
};

// a liquid on a tray lane: a trail from the start line down to a round head at v
const run = (c: Ctx, q: Quad, u: number, v0: number, v1: number, hw: number, col: string, dk: string, tail = 0.5) => {
  const [hx, hy] = tp(q, u, v1), w = tp(q, u + hw, v1)[0] - hx, [sx, sy] = tp(q, u, v0), sw = (tp(q, u + hw, v0)[0] - sx) * tail;
  shape(c, () => { c.moveTo(sx - sw, sy); c.lineTo(hx - w * 0.9, hy); c.lineTo(hx + w * 0.9, hy); c.lineTo(sx + sw, sy); c.closePath(); }, col, 4);
  shade(c, () => { c.moveTo(sx - sw, sy); c.lineTo(hx - w * 0.9, hy); c.lineTo(hx + w * 0.9, hy); c.lineTo(sx + sw, sy); c.closePath(); }, dk, w * 0.3, 0, 0.45);
  shape(c, () => ell(c, hx, hy, w, w * 0.62), col, 5);
  shade(c, () => ell(c, hx, hy, w, w * 0.62), dk, w * 0.3, w * 0.2, 0.5);
  shine(c, [[hx - w * 0.55, hy - w * 0.15], [hx - w * 0.15, hy - w * 0.35]], 7);
};
const wisp = (c: Ctx, x: number, y: number, h: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 10; i++) pts.push([x + Math.sin(i * 0.9) * h * 0.12, y - (i / 10) * h]);
  line(c, pts, 18, INK); line(c, pts, 9, WHITE);
};

// the tray with its top end up on books, lanes of liquid; bigger lanes in e1.3
const liftedScene = (c: Ctx) => {
  ground(c);
  const q: Quad = { tl: [335, 185], tr: [715, 185], bl: [250, 880], br: [790, 880] };
  newspaper(c, { tl: [200, 540], tr: [840, 540], bl: [130, 960], br: [900, 960] });
  books(c, 215, 380, 570);
  tray(c, q);
  tape(c, q, 0.16); tape(c, q, 0.82);
  return q;
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const q: Quad = { tl: [330, 190], tr: [700, 190], bl: [250, 880], br: [770, 880] };
  newspaper(c, { tl: [290, 140], tr: [740, 140], bl: [190, 940], br: [810, 940] });
  tray(c, q);
  tape(c, q, 0.16); tape(c, q, 0.82);
  books(c, 830, 880, 150);
  // the 15 cm between the two tape marks
  const a = tp(q, 0, 0.16), b = tp(q, 0, 0.82), x = 205;
  line(c, [[x, a[1]], [x, b[1]]], 6); line(c, [[x - 18, a[1]], [x + 18, a[1]]], 6); line(c, [[x - 18, b[1]], [x + 18, b[1]]], 6);
  write(c, "15 cm", 20, (a[1] + b[1]) / 2 - 20, 40);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  const q = liftedScene(c);
  run(c, q, 0.14, 0.18, 0.8, 0.095, COL.water, COL.waterDk, 0.5);
  run(c, q, 0.38, 0.18, 0.67, 0.095, OIL, "#c99a10", 0.5);
  run(c, q, 0.62, 0.18, 0.5, 0.095, SHAMP, SHAMPDk, 0.5);
  run(c, q, 0.86, 0.18, 0.32, 0.095, HONEY, HONEYDk, 0.5);
  arrow(c, [[920, 330], [920, 640]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // the big bowl with warm water, steam above it
  const bx = 360, by = 560, br = 280;
  shadow(c, bx + 30, by + 230, br * 0.9, 34);
  const body = () => { c.moveTo(bx - br, by); c.bezierCurveTo(bx - br * 0.95, by + 300, bx + br * 0.95, by + 300, bx + br, by); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, br * 0.3, -10);
  shape(c, () => ell(c, bx, by, br, 70), COL.steelIn, 5);
  shape(c, () => ell(c, bx, by + 6, br * 0.9, 58), COL.water, 0);
  shine(c, [[bx - br * 0.7, by + 4], [bx - br * 0.5, by - 10]], 7);
  // the small bowl standing in the water, with honey
  const kx = bx, ky = by - 60, kr = 150;
  const kb = () => { c.moveTo(kx - kr, ky); c.bezierCurveTo(kx - kr * 0.9, ky + kr * 0.9, kx + kr * 0.9, ky + kr * 0.9, kx + kr, ky); c.closePath(); };
  shape(c, kb, COL.steel); shade(c, kb, COL.steelDk, kr * 0.35, -kr * 0.05);
  shape(c, () => ell(c, kx, ky, kr, kr * 0.24), HONEY, 5);
  shape(c, () => ell(c, kx - kr * 0.2, ky - 2, kr * 0.4, kr * 0.09), "#f6b94a", 0);
  // the big bowl's front wall hides the small bowl's foot, so redraw the rim on the near side
  c.beginPath(); c.ellipse(bx, by, br, 70, 0, 0.12 * Math.PI, 0.88 * Math.PI); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  wisp(c, bx - 160, by - 80, 200); wisp(c, bx + 170, by - 80, 220);
  // the second honey bowl on the table
  const rx = 840, ry = 700, rr = 150;
  shadow(c, rx + 20, ry + 120, rr * 0.8, 24);
  const rb = () => { c.moveTo(rx - rr, ry); c.bezierCurveTo(rx - rr * 0.9, ry + rr * 0.9, rx + rr * 0.9, ry + rr * 0.9, rx + rr, ry); c.closePath(); };
  shape(c, rb, COL.steel); shade(c, rb, COL.steelDk, rr * 0.35, -rr * 0.05);
  shape(c, () => ell(c, rx, ry, rr, rr * 0.24), HONEY, 5);
  shape(c, () => ell(c, rx - rr * 0.2, ry - 2, rr * 0.4, rr * 0.09), "#f6b94a", 0);
  // a timer: five minutes marked as a red wedge
  const tx = 840, ty = 230, tr = 110;
  shadow(c, tx + 10, ty + tr + 8, tr * 0.9, 16);
  shape(c, () => ell(c, tx, ty, tr, tr), WHITE, 7);
  c.beginPath(); c.moveTo(tx, ty); c.arc(tx, ty, tr * 0.82, -Math.PI / 2, -Math.PI / 2 + (5 / 60) * 2 * Math.PI); c.closePath(); c.fillStyle = RED; c.fill();
  for (let i = 0; i < 12; i++) { const an = (i / 12) * Math.PI * 2; line(c, [[tx + Math.cos(an) * tr * 0.86, ty + Math.sin(an) * tr * 0.86], [tx + Math.cos(an) * tr * 0.97, ty + Math.sin(an) * tr * 0.97]], 4); }
  const ha = -Math.PI / 2 + (5 / 60) * 2 * Math.PI;
  line(c, [[tx, ty], [tx + Math.cos(ha) * tr * 0.8, ty + Math.sin(ha) * tr * 0.8]], 7); line(c, [[tx, ty], [tx, ty - tr * 0.6]], 7);
  shape(c, () => ell(c, tx, ty, 9, 9), INK, 0);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  const q = liftedScene(c);
  // warm honey on the left: a long streak nearly at the finish line; room honey on the right: a short blob past the start
  run(c, q, 0.3, 0.18, 0.75, 0.11, HONEY, HONEYDk, 0.5);
  run(c, q, 0.7, 0.18, 0.27, 0.11, HONEY, HONEYDk, 0.9);
  arrow(c, [[905, 330], [905, 640]]);
};

// the one-rupee coin, top view: a silver disc with a thick edge
const coinTop = (c: Ctx, x: number, y: number, rx: number) => {
  const ry = rx * 0.3, t = rx * 0.14;
  shape(c, () => { c.ellipse(x, y + t, rx, ry, 0, 0, Math.PI); c.lineTo(x - rx, y); c.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); c.closePath(); }, COL.steelDk);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shade(c, () => ell(c, x, y, rx, ry), COL.steelDk, rx * 0.2, ry * 0.2, 0.45);
  shape(c, () => ell(c, x, y, rx * 0.78, ry * 0.78), COL.steelIn, 3);
  write(c, "1", x - rx * 0.1, y - ry * 0.5, ry * 0.9, INK, 4);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  plate(c, 560, 900, 470, 110);
  coinTop(c, 746, 880, 190);
  // the straw, held with a finger over its top end
  const sx = 746;
  line(c, [[sx, 280], [sx, 700]], 36, INK); line(c, [[sx, 280], [sx, 700]], 24, COL.teal);
  line(c, [[sx - 6, 300], [sx - 6, 690]], 5, WHITE);
  // water hanging at the straw's tip and one drop falling
  const drop = (x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.2, x + s * 0.8, y + s * 0.3); c.arc(x, y + s * 0.3, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.2, x, y - s * 1.5); c.closePath(); }, COL.water, 5);
  drop(sx, 725, 24);
  drop(sx, 800, 26);
  arrow(c, [[560, 720], [560, 810]]);
  // the hand: fingers round the straw, thumb over the top
  c.save(); c.translate(0, 2 * 380); c.scale(1, -1);
  hand(c, 900, 380, Math.PI, 2.2, SKIN.child, CLOTH.child);
  c.restore();
};

// the coin seen from the side on the plate: back of the coin, then the water, then the coin's front edge
const coinSide = (c: Ctx, water: () => void) => {
  const cx = 540, by = 790, rx = 330, t = 70, ry = 40, ty = by - t;
  plate(c, 540, 800, 460, 110);
  shape(c, () => { c.moveTo(cx - rx, ty); c.lineTo(cx - rx, by); c.ellipse(cx, by, rx, ry, 0, Math.PI, 0, true); c.lineTo(cx + rx, ty); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(cx - rx, ty); c.lineTo(cx - rx, by); c.ellipse(cx, by, rx, ry, 0, Math.PI, 0, true); c.lineTo(cx + rx, ty); c.closePath(); }, COL.steelDk, 150, 0, 0.5);
  shape(c, () => ell(c, cx, ty, rx, ry), COL.steelIn);
  water();
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const cx = 540, ty = 720, rx = 300;
  coinSide(c, () => {
    const dome = () => { c.moveTo(cx - rx, ty); c.bezierCurveTo(cx - rx - 40, ty - 420, cx + rx + 40, ty - 420, cx + rx, ty); c.ellipse(cx, ty, rx, 34, 0, 0, Math.PI); c.closePath(); };
    shape(c, dome, COL.water, 6);
    shade(c, dome, COL.waterDk, 90, 0, 0.5);
    shine(c, [[cx - 190, ty - 120], [cx - 140, ty - 220], [cx - 60, ty - 270]], 12);
  });
  // one drop about to join the dome
  shape(c, () => { const x = cx, y = 180; c.moveTo(x, y - 40); c.quadraticCurveTo(x + 30, y - 5, x + 22, y + 8); c.arc(x, y + 8, 22, 0, Math.PI); c.quadraticCurveTo(x - 30, y - 5, x, y - 40); c.closePath(); }, COL.water, 5);
  arrow(c, [[cx + 90, 160], [cx + 90, 250]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  const cx = 540, ty = 720, rx = 300;
  // spilled water on the plate first, at the coin's right foot
  coinSide(c, () => {
    const flat = () => { c.moveTo(cx - rx - 40, ty + 8); c.bezierCurveTo(cx - rx, ty - 70, cx + rx, ty - 70, cx + rx + 40, ty + 8); c.ellipse(cx, ty, rx + 20, 38, 0, 0, Math.PI); c.closePath(); };
    shape(c, flat, COL.water, 6);
    shade(c, flat, COL.waterDk, 90, 0, 0.5);
    shine(c, [[cx - 170, ty - 30], [cx - 80, ty - 44]], 9);
    // a runnel down the coin's edge and a puddle where it lands
    shape(c, () => { c.moveTo(cx + rx - 40, ty + 20); c.lineTo(cx + rx + 40, ty + 20); c.lineTo(cx + rx + 50, 806); c.lineTo(cx + rx - 20, 806); c.closePath(); }, COL.water, 4);
    shape(c, () => ell(c, cx + rx + 50, 836, 170, 38), COL.water, 5);
    shine(c, [[cx + rx + 20, 826], [cx + rx + 70, 820]], 7);
    // soap bubbles
    ([[cx - 120, ty - 52, 24], [cx + 20, ty - 62, 32], [cx + 130, ty - 48, 20], [cx - 20, ty - 90, 16]] as number[][]).forEach(([x, y, r]) => {
      shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.7)", 4);
      shine(c, [[x - r * 0.5, y - r * 0.2], [x - r * 0.2, y - r * 0.55]], 4);
    });
  });
};

export const su_statesLiquidsUpClose = cards("sci.states.liquids-up-close.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
