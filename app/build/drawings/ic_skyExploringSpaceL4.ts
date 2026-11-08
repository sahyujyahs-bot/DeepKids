import type { Ctx } from "./core";
import { D, INK, COL, WHITE, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, write, cards } from "./flatKit";

// EXPLORING SPACE L4 · set-up cards for the three experiments, then the pictures for each experiment,
// activity and project, and two terms. Flat DeepKids look, light from the upper left.

const FLOOR = "#e6d6b6", PAPER = "#f6f0e1", TERRA = "#d98f66", TERRA_DK = "#b36a45", BALLOON = "#e4523b", BALLOON_DK = "#b93b28";
const dashed = (c: Ctx, pts: number[][], w = 5, col = INK, dash = [14, 12]) => { c.setLineDash(dash); line(c, pts, w, col); c.setLineDash([]); };
const floorBand = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, D, D + 300 - y); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- shared things
// a table seen from the side: the top slab at y = top, legs down to the floor
const tableSide = (c: Ctx, x0: number, x1: number, top: number, floorY: number, thick = 34) => {
  shadow(c, (x0 + x1) / 2 + 20, floorY + 14, (x1 - x0) / 2, 16);
  for (const lx of [x0 + 30, x1 - 56]) shape(c, () => rrect(c, lx, top + thick - 4, 26, floorY - top - thick + 4, 4), COL.brown, 5);
  shape(c, () => rrect(c, x0, top, x1 - x0, thick, 6), COL.wood, 6);
  shade(c, () => rrect(c, x0, top, x1 - x0, thick, 6), COL.woodDk, 0, 14, 0.6);
};
const marble = (c: Ctx, x: number, y: number, r: number, wet = false, alpha = 1) => {
  c.globalAlpha = alpha;
  shape(c, () => ell(c, x, y, r, r), wet ? COL.water : COL.blue, 5);
  shade(c, () => ell(c, x, y, r, r), wet ? COL.waterDk : COL.blueDk, r * 0.35, r * 0.35, 0.6);
  shine(c, [[x - r * 0.5, y - r * 0.25], [x - r * 0.25, y - r * 0.55]], 4);
  c.globalAlpha = 1;
};
const books = (c: Ctx, x: number, bottom: number, w: number, n: number) => {
  const cols = [COL.red, COL.teal, COL.purple, COL.orange, COL.green];
  for (let i = 0; i < n; i++) {
    const y = bottom - (i + 1) * 28;
    shape(c, () => rrect(c, x + (i % 2) * 6, y, w, 28, 4), cols[i % cols.length], 5);
    line(c, [[x + (i % 2) * 6 + w - 24, y + 8], [x + (i % 2) * 6 + w - 8, y + 8]], 3, WHITE);
  }
};
const newspaperTop = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 8, y + h + 4, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 6), PAPER, 6);
  for (let ry = y + 24; ry < y + h - 16; ry += 22) line(c, [[x + 20, ry], [x + w - 20 - ((ry * 7) % 90), ry]], 5, "#c9c1b0");
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, x + 28 + k * (w / 4.2), y + 14, w / 5.6, 30, 3), "#d8d0be", 0);
};
// a splash left by a wet marble, seen from above
const wetSpot = (c: Ctx, x: number, y: number, s = 1) => {
  shape(c, () => ell(c, x, y, 28 * s, 24 * s, 0.3), COL.water, 4);
  for (const [dx, dy, r] of [[-38, -10, 7], [36, 12, 6], [8, -36, 6], [-14, 34, 5]]) shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s), COL.water, 3);
};
const pencil = (c: Ctx, tx: number, ty: number, an: number, len = 190) => {
  c.save(); c.translate(tx, ty); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [34, -11], [34, 11]]), "#f0cf9c", 4);
  shape(c, () => polyP(c, [[0, 0], [11, -3.6], [11, 3.6]]), COL.black, 3);
  shape(c, () => rrect(c, 34, -11, len - 34, 22, 3), COL.yellow, 5);
  shape(c, () => rrect(c, len, -11, 22, 22, 4), COL.pink, 5);
  c.restore();
};
const tapeStrip = (c: Ctx, x0: number, x1: number, y: number, cmPx: number) => {
  shape(c, () => rrect(c, x0, y, x1 - x0, 56, 4), "#ffe27a", 5);
  for (let i = 0; i * cmPx <= x1 - x0 - 4; i++) {
    const x = x0 + i * cmPx, long = i % 10 === 0;
    line(c, [[x, y], [x, y + (long ? 24 : i % 5 === 0 ? 17 : 10)]], long ? 4 : 2.5);
    if (long && i > 0) write(c, String(i), x - 8, y + 28, 22, INK, 3);
  }
  write(c, "0", x0 + 8, y + 28, 22, INK, 3);
};
const tapeCase = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 50, y + 100, 66, 12);
  shape(c, () => rrect(c, x, y, 100, 92, 20), COL.teal, 6);
  shade(c, () => rrect(c, x, y, 100, 92, 20), COL.tealDk, 14, 0, 0.6);
  shape(c, () => ell(c, x + 50, y + 46, 26, 26), "#ffe27a", 5);
};
const dim = (c: Ctx, x0: number, x1: number, y: number) => { arrow(c, [[x1 - 14, y], [x0, y]], INK, 5); arrow(c, [[x0 + 14, y], [x1, y]], INK, 5); };

// ---------------------------------------------------------------- experiment 1: the ramp and the marble
const R = { hx: 200, hy: 402, lx: 585, ly: 513 };
const rampSlope = (R.ly - R.hy) / (R.lx - R.hx);
const rampA = Math.atan2(R.ly - R.hy, R.lx - R.hx), rnx = Math.sin(rampA), rny = -Math.cos(rampA);
const rampCentreY = (x: number) => R.hy + (x - R.hx) * rampSlope;
// a marble of radius r resting on the ramp at x
const marbleOnRamp = (x: number) => [x + rnx * (7 + 16), rampCentreY(x) + rny * (7 + 16)];
const TABLE = { x0: 90, x1: 780, top: 520, floor: 880 };
const rampBase = (c: Ctx) => {
  floorBand(c, TABLE.floor);
  // the newspaper on the floor, lying away from the table edge, with the zero tape
  shape(c, () => polyP(c, [[700, 905], [1050, 905], [1062, 1030], [688, 1030]]), PAPER, 5);
  for (let k = 0; k < 5; k++) line(c, [[722 + k * 4, 930 + k * 22], [1030 - k * 6, 930 + k * 22]], 4, "#c9c1b0");
  line(c, [[783, 890], [781, 1040]], 14, RED);
  tableSide(c, TABLE.x0, TABLE.x1, TABLE.top, TABLE.floor);
  books(c, 130, TABLE.top, 150, 4);
  const p = (x: number, y: number, k: number) => [x + rnx * 7 * k, y + rny * 7 * k];
  shape(c, () => polyP(c, [p(R.hx, R.hy, 1), p(R.lx, R.ly, 1), p(R.lx, R.ly, -1), p(R.hx, R.hy, -1)]), COL.yellow, 5);
  line(c, [p(R.hx + 6, R.hy, 0.2), p(R.lx - 4, R.ly, 0.2)], 3, COL.woodDk);
  for (let t = 40; t < 380; t += 13) line(c, [p(R.hx + t, rampCentreY(R.hx + t), -1), p(R.hx + t, rampCentreY(R.hx + t), -0.35)], 2.5);
};

// the ramp cards sit a little higher on the card so the floor and the paper fit
const lifted = (draw: (c: Ctx) => void) => (c: Ctx) => { ground(c); c.save(); c.translate(0, -90); draw(c); c.restore(); };
// card e1.0: the ramp, 15 cm from the edge, and the zero line
const e1s0 = lifted((c) => {
  rampBase(c);
  dim(c, R.lx, TABLE.x1, 470);
  line(c, [[R.lx, 458], [R.lx, 490]], 4); line(c, [[TABLE.x1, 458], [TABLE.x1, 490]], 4);
  write(c, "15cm", 625, 400, 38, INK, 6);
  dashed(c, [[TABLE.x1, 556], [783, 892]], 4, INK);
});
// card e1.1: the wet marble is let go 5 cm up the ramp and rolls to the edge
const e1s1 = lifted((c) => {
  rampBase(c);
  const [mx, my] = marbleOnRamp(380);
  for (const gx of [440, 520]) { const [x, y] = marbleOnRamp(gx); marble(c, x, y, 16, true, 0.3); }
  for (const gx of [660, 730]) marble(c, gx, TABLE.top - 16, 16, true, 0.3);
  marble(c, mx, my, 16, true);
  drop(c, mx - 30, my - 28);
  arrow(c, [[mx + 24, my + 12], [mx + 70, my + 12 + 70 * rampSlope]], RED, 8);
  arrow(c, [[640, 484], [740, 484]], RED, 8);
  // the 5 cm start height, measured from the table top
  const lvl = 520 - 66;
  dashed(c, [[mx + 24, lvl], [820, lvl]], 4, INK);
  arrow(c, [[820, 500], [820, lvl]], INK, 5); arrow(c, [[820, lvl + 20], [820, 520]], INK, 5);
  write(c, "5cm", 842, 466, 34, INK, 6);
});
function drop(c: Ctx, x: number, y: number) {
  shape(c, () => { c.moveTo(x, y - 16); c.quadraticCurveTo(x + 14, y + 4, x, y + 12); c.quadraticCurveTo(x - 14, y + 4, x, y - 16); c.closePath(); }, COL.water, 4);
}
// card e1.2: the first wet spot, a pencil dot beside it, a tape measure from zero
const ZERO = 290, CM = 8;
const e1s2 = (c: Ctx) => {
  ground(c, FLOOR);
  newspaperTop(c, 130, 190, 860, 700);
  line(c, [[ZERO, 175], [ZERO, 905]], 16, RED);
  const sx = ZERO + 37 * CM;
  wetSpot(c, sx, 470, 1.2);
  shape(c, () => ell(c, sx + 62, 478, 8, 8), COL.black, 3);
  pencil(c, sx + 62, 478, -0.7, 200);
  tapeStrip(c, ZERO, 680, 640, CM);
  tapeCase(c, 676, 620);
  dashed(c, [[sx, 505], [sx, 650]], 4, INK);
};
// card e1.3: three start heights, three landing spots farther and farther away
const e1s3 = (c: Ctx) => {
  ground(c, FLOOR);
  newspaperTop(c, 130, 170, 860, 740);
  line(c, [[ZERO, 155], [ZERO, 925]], 16, RED);
  const spots = [37, 52, 64], hs = [66, 132, 198], names = ["5", "10", "15"];
  spots.forEach((cm, i) => {
    const x = ZERO + cm * CM;
    shape(c, () => rrect(c, x - 26, 440 - hs[i], 52, hs[i], 5), [COL.sky, COL.blue, COL.blueDk][i], 5);
    marble(c, x, 440 - hs[i] - 18, 16, true);
    write(c, names[i], x - (i ? 22 : 10), 456, 36, INK, 6);
    dashed(c, [[x, 515], [x, 664]], 4, INK);
    wetSpot(c, x, 720, 1);
    shape(c, () => ell(c, x, 772, 7, 7), COL.black, 3);
  });
  arrow(c, [[ZERO + 20, 830], [ZERO + 64 * CM + 30, 830]], RED, 8);
};

// ---------------------------------------------------------------- experiment 2: the balloon rocket
// a chair seen from the side, its back toward the string; out = which way the seat runs
const chair = (c: Ctx, xb: number, floorY: number, out: 1 | -1) => {
  const sx0 = out > 0 ? xb - 13 : xb - 190, sx1 = out > 0 ? xb + 190 : xb + 13, fl = xb + out * 168;
  shadow(c, xb + out * 90, floorY + 12, 140, 14);
  shape(c, () => rrect(c, fl - 11, floorY - 160, 22, 160, 4), COL.steelDk, 5);
  shape(c, () => rrect(c, xb - 11, floorY - 170, 22, 170, 4), COL.steelDk, 5);
  shape(c, () => rrect(c, xb - 14, floorY - 400, 28, 250, 8), COL.teal, 5);
  shade(c, () => rrect(c, xb - 14, floorY - 400, 28, 250, 8), COL.tealDk, 12, 0, 0.6);
  shape(c, () => rrect(c, sx0, floorY - 190, sx1 - sx0, 32, 8), COL.teal, 5);
};
const CH = { floor: 880, ys: 640, xl: 250, xr: 830 };
const stringBase = (c: Ctx) => {
  ground(c);
  floorBand(c, CH.floor);
  chair(c, CH.xl, CH.floor, -1);
  chair(c, CH.xr, CH.floor, 1);
  line(c, [[CH.xl + 14, CH.ys], [CH.xr - 14, CH.ys]], 4, INK);
  shape(c, () => ell(c, CH.xl + 14, CH.ys, 9, 9), WHITE, 4); shape(c, () => ell(c, CH.xr - 14, CH.ys, 9, 9), WHITE, 4);
};
// the balloon rocket, front of the straw at (xf, ys). The balloon hangs below the straw and its neck points back.
const rocket = (c: Ctx, xf: number, ys: number, s: number, o: { rx: number; ry: number; clips?: number; spurt?: boolean }) => {
  c.save(); c.translate(xf, ys); c.scale(s, s);
  const cx = -170, cy = 3 + o.ry;
  // balloon neck, then body
  shape(c, () => polyP(c, [[cx - o.rx + 10, cy - 14], [cx - o.rx - 30, cy - 9], [cx - o.rx - 30, cy + 9], [cx - o.rx + 10, cy + 14]]), BALLOON, 5);
  shape(c, () => ell(c, cx, cy, o.rx, o.ry), BALLOON, 6);
  shade(c, () => ell(c, cx, cy, o.rx, o.ry), BALLOON_DK, o.rx * 0.3, o.ry * 0.3, 0.6);
  shine(c, [[cx - o.rx * 0.6, cy - o.ry * 0.1], [cx - o.rx * 0.35, cy - o.ry * 0.6]], 8);
  // the straw on top of the string, with tape holding the balloon
  shape(c, () => rrect(c, -280, -9, 280, 18, 9), WHITE, 5);
  for (let k = 0; k < 7; k++) line(c, [[-262 + k * 40, -8], [-244 + k * 40, 8]], 5, COL.red);
  for (const tx of [cx - 50, cx + 50]) shape(c, () => rrect(c, tx - 14, -14, 28, 36, 3), "rgba(255,244,200,0.85)", 3);
  for (let k = 0; k < (o.clips ?? 0); k++) {
    const x = -62 + k * 15, p = () => { c.beginPath(); rrect(c, x - 6, 10, 12, 38, 6); };
    p(); c.strokeStyle = INK; c.lineWidth = 8; c.stroke(); p(); c.strokeStyle = COL.steel; c.lineWidth = 3.5; c.stroke();
  }
  if (o.spurt) for (const [dy, len] of [[-12, 70], [0, 90], [12, 70]]) line(c, [[cx - o.rx - 40, cy + dy], [cx - o.rx - 40 - len, cy + dy * 2.2]], 7, "#9ac9ea");
  c.restore();
};
// card e2.0: string between two chairs, straw on the string, half-blown balloon taped along the straw
const e2s0 = (c: Ctx) => {
  stringBase(c);
  rocket(c, 650, CH.ys, 1.1, { rx: 80, ry: 56 });
};
// card e2.1: the child blows the balloon up, the grown-up holds one pinched with a peg and a loop of string round it
const e2s1 = (c: Ctx) => {
  ground(c);
  floorBand(c, 960);
  const kidX = 250, adX = 700, y = 978;
  person(c, kidX, y, 560, { reachL: [kidX - 100, 700], reachR: [kidX + 100, 700] });
  // the child's balloon: neck at the mouth, body held at its sides by both hands
  shape(c, () => polyP(c, [[kidX - 10, 552], [kidX + 10, 552], [kidX + 22, 616], [kidX - 22, 616]]), BALLOON, 5);
  shape(c, () => ell(c, kidX, 705, 78, 98), BALLOON, 6);
  shade(c, () => ell(c, kidX, 705, 78, 98), BALLOON_DK, 24, 24, 0.6);
  shine(c, [[kidX - 46, 685], [kidX - 34, 650]], 8);
  // the grown-up's balloon is full: neck pinched with a peg, a loop of string just fitting round it
  const hx = adX + 200, hy = 545, bcy = hy - 190;
  shape(c, () => polyP(c, [[hx - 14, hy - 76], [hx + 14, hy - 76], [hx + 10, hy], [hx - 10, hy]]), BALLOON, 5);
  shape(c, () => ell(c, hx, bcy, 96, 112), BALLOON, 6);
  shade(c, () => ell(c, hx, bcy, 96, 112), BALLOON_DK, 28, 28, 0.6);
  shine(c, [[hx - 58, bcy - 20], [hx - 40, bcy - 66]], 9);
  c.beginPath(); c.ellipse(hx, bcy, 97, 20, 0, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 11; c.stroke();
  c.beginPath(); c.ellipse(hx, bcy, 97, 20, 0, 0, Math.PI * 2); c.strokeStyle = COL.wood; c.lineWidth = 5; c.stroke();
  shape(c, () => rrect(c, hx - 13, hy - 62, 26, 54, 5), COL.wood, 5);
  line(c, [[hx - 13, hy - 36], [hx + 13, hy - 36]], 3, COL.woodDk);
  person(c, adX, y, 720, { adult: true, reachR: [hx, hy] });
};
// the tape measure on the floor under the string, from where the front of the straw started to where it ended
const flightTape = (c: Ctx, xs: number, xf: number) => {
  shape(c, () => rrect(c, xs, 935, xf - xs, 44, 4), "#ffe27a", 5);
  for (let x = xs + 12; x < xf - 6; x += 12) line(c, [[x, 935], [x, 935 + (((x - xs - 12) / 12) % 5 === 0 ? 22 : 12)]], 2.5);
  tapeCase(c, xf - 2, 910);
  dashed(c, [[xs, CH.ys + 9], [xs, 940]], 4, INK); dashed(c, [[xf, CH.ys + 9], [xf, 940]], 4, INK);
};
const RS = 1.15, XS = CH.xl + 14 + 280 * RS;
// card e2.2: the balloon rocket flying along the string, the tape measure shows how far
const e2s2 = (c: Ctx) => {
  stringBase(c);
  flightTape(c, XS, 790);
  rocket(c, 790, CH.ys, RS, { rx: 70, ry: 44, spurt: true });
  arrow(c, [[630, 540], [760, 540]], RED, 9);
};
// card e2.3: the same rocket with clips under the straw flies a shorter way
const e2s3 = (c: Ctx) => {
  stringBase(c);
  flightTape(c, XS, 690);
  dashed(c, [[790, CH.ys - 110], [790, 940]], 4, "#8a8aa0");
  rocket(c, 690, CH.ys, RS, { rx: 70, ry: 44, clips: 5, spurt: true });
  arrow(c, [[530, 540], [660, 540]], RED, 9);
};

// ---------------------------------------------------------------- experiment 3: the two-lens telescope
const lens = (c: Ctx, x: number, rx: number, ry: number) => {
  shape(c, () => { c.moveTo(x, -ry); c.quadraticCurveTo(x + rx * 2, 0, x, ry); c.quadraticCurveTo(x - rx * 2, 0, x, -ry); c.closePath(); }, "rgba(196,228,250,0.8)", 6);
  shine(c, [[x - rx * 0.45, -ry * 0.62], [x - rx * 0.45, -ry * 0.18]], 6);
};
const clayMound = (c: Ctx, x: number, top: number, wTop: number, wBot: number) => {
  const path = () => { c.moveTo(x - wBot, 155); c.quadraticCurveTo(x - wBot * 0.9, top + 10, x - wTop, top); c.quadraticCurveTo(x, top - 14, x + wTop, top); c.quadraticCurveTo(x + wBot * 0.9, top + 10, x + wBot, 155); c.closePath(); };
  shape(c, path, TERRA, 5); shade(c, path, TERRA_DK, wBot * 0.4, 0, 0.6);
};
const SCOPE = { eye: 212, xs: 370, xo: 780, rys: 65, ryo: 125 };
// the child's head from the side behind a table, the metre stick with both lenses on it. Axis at y = 0, scaled by s.
const scope = (c: Ctx, s: number, tx: number, ty: number, behind?: () => void, front?: () => void) => {
  c.save(); c.translate(tx, ty); c.scale(s, s);
  if (behind) behind();
  // the child: shoulders, neck, head with hair, nose, ear, eye
  shape(c, () => rrect(c, 120, 60, 60, 60, 8), "#b9794f", 5);
  shape(c, () => { c.moveTo(30, 190); c.lineTo(30, 160); c.quadraticCurveTo(30, 105, 100, 100); c.lineTo(200, 100); c.quadraticCurveTo(270, 105, 270, 160); c.lineTo(270, 190); c.closePath(); }, "#f39a3c", 5);
  shape(c, () => ell(c, 138, -12, 106, 104), "#2b2340", 5);
  shape(c, () => ell(c, 250, 20, 17, 17), "#b9794f", 5);
  shape(c, () => ell(c, 160, 8, 92, 94), "#b9794f", 6);
  shape(c, () => ell(c, 172, -62, 84, 34, -0.1), "#2b2340", 0);
  shape(c, () => ell(c, 118, 18, 15, 24), "#9c6240", 4);
  shape(c, () => ell(c, 212, -2, 18, 14), WHITE, 3); shape(c, () => ell(c, 219, -2, 8, 9), INK, 0);
  line(c, [[194, -26], [232, -30]], 6);
  line(c, [[226, 54], [244, 52]], 5);
  // table, stick, clay, lenses
  const { xs, xo, rys, ryo } = SCOPE;
  shape(c, () => rrect(c, 300, 155, 740, 30, 4), COL.wood, 5);
  for (let x = 320; x < 1030; x += 20) line(c, [[x, 155], [x, x % 100 === 20 ? 175 : 166]], 2.5);
  lens(c, xs, 32, rys); lens(c, xo, 16, ryo);
  clayMound(c, xs, 50, 24, 66); clayMound(c, xo, 108, 40, 70);
  shadow(c, 540, 428, 520, 14);
  for (const lx of [70, 970]) shape(c, () => rrect(c, lx, 210, 28, 210, 4), COL.brown, 5);
  shape(c, () => rrect(c, 30, 185, 1010, 34, 6), COL.wood, 6);
  shade(c, () => rrect(c, 30, 185, 1010, 34, 6), COL.woodDk, 0, 14, 0.6);
  if (front) front();
  c.restore();
};
const farWall = (c: Ctx) => {
  // a brick wall with a flag, far away, standing on a strip of grass behind the table
  shape(c, () => rrect(c, 845, 118, 205, 70, 6), COL.greenLt, 5);
  shape(c, () => rrect(c, 905, -40, 120, 160, 4), "#c8654b", 5);
  for (let r = 0; r < 5; r++) { line(c, [[905, -8 + r * 32], [1025, -8 + r * 32]], 3, "#8a3b28"); for (let b = 0; b < 3; b++) line(c, [[935 + b * 40 + (r % 2) * 20, -40 + r * 32], [935 + b * 40 + (r % 2) * 20, -8 + r * 32]], 3, "#8a3b28"); }
  line(c, [[1010, -40], [1010, -120]], 6);
  shape(c, () => polyP(c, [[1010, -120], [950, -105], [1010, -88]]), COL.yellow, 5);
};
// card e3.0: the two lenses on a table with a ruler, and a side view of each
const e3s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 90, 980, 880, 24), "#ecd09a", 6);
  // weak: a big thin lens
  shadow(c, 372, 540, 230, 40);
  shape(c, () => ell(c, 350, 442, 222, 154), "#9fc4e0", 5);
  shape(c, () => ell(c, 350, 430, 222, 154), "rgba(214,236,250,0.9)", 6);
  shape(c, () => ell(c, 350, 430, 190, 124), "rgba(255,255,255,0.25)", 3);
  shine(c, [[210, 370], [260, 330]], 12);
  // strong: a small fat magnifier with a frame and a handle
  shadow(c, 760, 560, 160, 34);
  c.save(); c.translate(740, 460); c.rotate(0.55);
  shape(c, () => rrect(c, 120, -22, 140, 44, 20), COL.black, 6);
  c.restore();
  shape(c, () => ell(c, 740, 450, 156, 110), COL.black, 6);
  shape(c, () => ell(c, 740, 450, 128, 86), "rgba(214,236,250,0.9)", 5);
  shine(c, [[660, 410], [695, 380]], 11);
  // their sides: the weak lens is thin and flat, the strong one is thick and round
  const side = (x: number, rx: number) => { c.save(); c.translate(x, 700); lens(c, 0, rx, 50); c.restore(); };
  side(350, 10); side(740, 36);
  dashed(c, [[350, 600], [350, 634]], 4, INK); dashed(c, [[740, 576], [740, 634]], 4, INK);
  // the ruler
  shadow(c, 540, 892, 440, 16);
  shape(c, () => rrect(c, 90, 800, 900, 86, 8), COL.yellow, 6);
  for (let k = 0; k <= 40; k++) line(c, [[120 + k * 21.5, 800], [120 + k * 21.5, 800 + (k % 10 === 0 ? 40 : k % 5 === 0 ? 30 : 20)]], k % 10 === 0 ? 4 : 2.5);
  for (let k = 0; k <= 3; k++) write(c, String(k * 10), 120 + k * 215 + 8, 846, 28, INK, 4);
};
const gaze = (c: Ctx, x2: number) => () => dashed(c, [[SCOPE.eye + 30, 0], [x2, 0]], 4, "#8a8aa0");
// card e3.1: both lenses stand in clay on the metre stick, the strong one near the eye
const e3s1 = (c: Ctx) => {
  ground(c);
  scope(c, 0.96, 30, 520, undefined, gaze(c, 1000));
};
// card e3.2: the child looks at the far wall; it looks bigger and upside down
const e3s2 = (c: Ctx) => {
  ground(c);
  scope(c, 0.96, 30, 560, () => farWall(c), gaze(c, 900));
  // what the child sees, turned round: the grass is at the top, the flag hangs down
  const bx = 700, by = 215, br = 170;
  c.save(); c.beginPath(); ell(c, bx, by, br, br); c.clip();
  c.fillStyle = "#cfe8f8"; c.fillRect(bx - br, by - br, 2 * br, 2 * br);
  c.fillStyle = COL.greenLt; c.fillRect(bx - br, by - br, 2 * br, 74);
  c.fillStyle = "#c8654b"; c.fillRect(bx - 130, by - 100, 260, 190);
  for (let r = 0; r < 6; r++) {
    line(c, [[bx - 130, by - 100 + r * 32], [bx + 130, by - 100 + r * 32]], 3, "#8a3b28");
    for (let b = 0; b < 5; b++) line(c, [[bx - 110 + b * 62 + (r % 2) * 31, by - 100 + r * 32], [bx - 110 + b * 62 + (r % 2) * 31, by - 68 + r * 32]], 3, "#8a3b28");
  }
  line(c, [[bx - 118, by + 90], [bx - 118, by + 160]], 7);
  shape(c, () => polyP(c, [[bx - 118, by + 160], [bx - 40, by + 135], [bx - 118, by + 112]]), COL.yellow, 5);
  c.restore();
  c.beginPath(); ell(c, bx, by, br, br); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
};
// card e3.3: one magnified brick lies over eight plain bricks
const e3s3 = (c: Ctx) => {
  ground(c);
  scope(c, 0.6, 219, 100);
  // the plain wall in a frame
  const x0 = 120, y0 = 420;
  c.fillStyle = "#d8d0c4"; c.fillRect(x0, y0, 840, 510);
  for (let r = 0; r < 17; r++) for (let b = 0; b < 14; b++) { const bx = x0 + b * 60 + (r % 2) * 30; if (bx + 56 > x0 + 840 + 1) continue; shape(c, () => rrect(c, bx + 2, y0 + r * 30 + 2, 56, 26, 3), (r + b) % 3 ? "#c8654b" : "#b95a42", 3); }
  c.strokeStyle = INK; c.lineWidth = 8; c.strokeRect(x0, y0, 840, 510);
  // the one big brick, eight bricks wide
  const bw = 480, bh = 240, bxx = 300, byy = 540;
  c.save(); c.globalAlpha = 0.72; shape(c, () => rrect(c, bxx, byy, bw, bh, 18), "#e8452b", 0); c.globalAlpha = 1; c.globalAlpha = 1;
  shade(c, () => rrect(c, bxx, byy, bw, bh, 18), "#a63d28", 36, 36, 0.55);
  for (const [dx, dy, r] of [[90, 60, 9], [230, 150, 7], [380, 80, 8], [150, 190, 6], [330, 190, 9]]) shape(c, () => ell(c, bxx + dx, byy + dy, r, r * 0.7), "#a63d28", 0);
  c.restore();
  c.beginPath(); rrect(c, bxx, byy, bw, bh, 18); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
  // eight plain bricks across: a bracket and the number
  line(c, [[bxx, 950], [bxx, 966], [bxx + bw, 966], [bxx + bw, 950]], 6);
  write(c, "8", 520, 980, 64, INK, 9);
};

// ---------------------------------------------------------------- pictures for the cards
// flow.e1: a marble leaves the table edge; the faster one lands farther
const flowE1 = lifted((c) => {
  rampBase(c);
  const ex = 770, ey = 504, endY = 945;
  const path = (range: number) => { const pts: number[][] = []; for (let i = 0; i <= 24; i++) { const t = i / 24; pts.push([ex + 10 + range * t, ey + (endY - ey) * t * t]); } return pts; };
  const slow = path(120), fast = path(250);
  dashed(c, slow, 6, COL.tealDk, [4, 14]); dashed(c, fast, 6, RED, [4, 14]);
  wetSpot(c, ex + 130, 950, 0.9); wetSpot(c, ex + 258, 955, 0.9);
  const mid = (pts: number[][], i: number) => pts[i];
  marble(c, mid(slow, 11)[0], mid(slow, 11)[1], 16, true, 0.55); marble(c, mid(fast, 11)[0], mid(fast, 11)[1], 16, true, 0.55);
  const [mx, my] = marbleOnRamp(330);
  marble(c, mx, my, 16, true);
  marble(c, ex, ey, 16, true);
  arrow(c, [[640, 478], [730, 478]], RED, 8);
});
// flow.e2: three flights with more and more clips, each one shorter
const flowE2 = (c: Ctx) => {
  ground(c);
  const lanes = [{ y: 210, xf: 900, clips: 0 }, { y: 520, xf: 700, clips: 2 }, { y: 830, xf: 510, clips: 5 }];
  for (const l of lanes) {
    line(c, [[100, l.y], [990, l.y]], 4, INK);
    shape(c, () => rrect(c, 88, l.y - 70, 24, 140, 6), COL.teal, 5); shape(c, () => rrect(c, 978, l.y - 70, 24, 140, 6), COL.teal, 5);
    dashed(c, [[330, l.y - 50], [330, l.y + 130]], 4, "#8a8aa0");
    rocket(c, l.xf, l.y, 0.75, { rx: 70, ry: 44, clips: l.clips, spurt: true });
    arrow(c, [[336, l.y + 100], [l.xf - 4, l.y + 100]], RED, 8);
  }
};
// flow.e3: rays from the far wall go through the front lens, cross, and leave the eyepiece to the eye
const flowE3 = (c: Ctx) => {
  ground(c);
  const { xs, xo } = SCOPE, F = 460, fy = 38.4, sl = 0.12;
  scope(c, 0.96, 30, 540, () => farWall(c), () => {
    for (const yh of [-40, 30]) {
      const ye = fy + (90 * (fy - yh)) / 320, yEnd = ye - 0.427 * (xs - 232);
      line(c, [[960, yh - sl * 180], [xo, yh], [F, fy], [xs, ye], [232, yEnd]], 5, "#f39a3c");
    }
  });
};
// flow.a1: the finished orbit map, to scale: the Earth, a thin ring for the space station, two big rings
const flowA1 = (c: Ctx) => {
  ground(c, FLOOR);
  newspaperTop(c, 50, 70, 980, 940);
  const cx = 540, cy = 540;
  for (const [r, col, a] of [[422, COL.purple, 0.4], [266, COL.teal, 1.9], [68, COL.orange, 3.3]] as [number, string, number][]) {
    c.beginPath(); ell(c, cx, cy, r, r); c.strokeStyle = INK; c.lineWidth = r === 68 ? 10 : 12; c.stroke();
    c.beginPath(); ell(c, cx, cy, r, r); c.strokeStyle = col; c.lineWidth = r === 68 ? 5 : 6; c.stroke();
    shape(c, () => ell(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 15, 15), col, 5);
  }
  shape(c, () => ell(c, cx, cy, 64, 64), COL.blue, 6);
  shade(c, () => ell(c, cx, cy, 64, 64), COL.blueDk, 14, 14, 0.6);
  shape(c, () => ell(c, cx - 14, cy - 12, 24, 16, 0.5), COL.green, 3);
  shape(c, () => ell(c, cx + 20, cy + 20, 16, 11, -0.3), COL.green, 3);
};
// the cup for the tin-can phone, seen from the side, open end toward dir
const cup = (c: Ctx, x: number, y: number, dir: 1 | -1) => {
  const path = () => { c.moveTo(x + dir * -42, y - 26); c.lineTo(x + dir * 42, y - 36); c.lineTo(x + dir * 42, y + 36); c.lineTo(x + dir * -42, y + 26); c.closePath(); };
  shape(c, path, WHITE, 6); shade(c, path, "#d9d4ca", 0, 12, 0.7);
  shape(c, () => ell(c, x - dir * 42, y, 10, 30), "#cfc8ba", 5);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  floorBand(c, 960);
  const lx = 220, rx = 860, y = 978, h = 540;
  // mouth height and ear height of a 540 px child
  const hy = y - 0.67 * h - 0.15 * h * 1.12, mouth = hy + 0.15 * h * 0.46;
  const L = [lx + 140, mouth], Rr = [rx - 140, hy + 10];
  line(c, [[L[0] + 42, L[1]], [Rr[0] - 42, Rr[1]]], 4, INK);
  cup(c, L[0], L[1], 1); cup(c, Rr[0], Rr[1], -1);
  person(c, lx, y, h, { reachR: [L[0], L[1] + 22] });
  person(c, rx, y, h, { reachL: [Rr[0], Rr[1] + 24] });
};
// flow.a3: two big bowls face each other; a whisper is gathered, crosses, and gathered again
const flowA3 = (c: Ctx) => {
  ground(c);
  floorBand(c, 900);
  const bowlSide = (cx: number, out: 1 | -1) => {
    // out = which way the open side faces (+1 right). The bowl is a half disc of radius 190 centred (cx, 520).
    shadow(c, cx, 905, 150, 14);
    shape(c, () => rrect(c, cx - 90, 720, 180, 30, 6), COL.wood, 5);
    for (const lx of [cx - 70, cx + 44]) shape(c, () => rrect(c, lx, 750, 26, 150, 4), COL.brown, 5);
    const body = () => { c.beginPath(); c.arc(cx, 520, 190, out > 0 ? Math.PI / 2 : -Math.PI / 2, out > 0 ? -Math.PI / 2 : Math.PI / 2); c.closePath(); };
    shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, out * 30, 0, 0.5);
    shape(c, () => ell(c, cx, 520, 40, 190), COL.steelIn, 6);
  };
  bowlSide(260, 1); bowlSide(820, -1);
  // rays: from the middle of the left bowl, out to the bowl, across in parallel, in to the middle of the right bowl
  for (const a of [0.55, 0.9, -0.55, -0.9]) {
    const sy = 520 + Math.sin(a) * 190, sxl = 260 - Math.cos(a) * 190, sxr = 820 + Math.cos(a) * 190;
    line(c, [[260 - 95, 520], [sxl, sy], [sxr, sy], [820 + 95, 520]], 5, COL.orange);
  }
  arrow(c, [[420, 520], [660, 520]], RED, 10);
  shape(c, () => ell(c, 165, 520, 12, 12), RED, 4); shape(c, () => ell(c, 915, 520, 12, 12), RED, 4);
};
// flow.a4: four paper strips, 1 mm for each day: 4, 40, 126 and 320 days
const flowA4 = (c: Ctx) => {
  ground(c);
  const days = [4, 40, 126, 320], cols = [COL.sky, "#f6f0e1", COL.yellow, COL.pink], k = 2.75;
  days.forEach((d, i) => {
    const y = 120 + i * 240, w = Math.max(10, d * k);
    shadow(c, 100 + w / 2 + 6, y + 82, w / 2, 8);
    shape(c, () => rrect(c, 100, y, w, 70, 4), cols[i], 6);
    const ix = 100 + w + 54;
    if (i < 2) { shape(c, () => ell(c, ix, y + 35, 36, 36), "#cfcfd6", 6); shape(c, () => ell(c, ix - 10, y + 28, 9, 7), "#aeaebb", 0); shape(c, () => ell(c, ix + 12, y + 46, 7, 6), "#aeaebb", 0); }
    else if (i === 2) { shape(c, () => ell(c, ix, y + 35, 36, 36), COL.yellow, 6); for (let r = 0; r < 8; r++) { const a = r * Math.PI / 4; line(c, [[ix + Math.cos(a) * 46, y + 35 + Math.sin(a) * 46], [ix + Math.cos(a) * 60, y + 35 + Math.sin(a) * 60]], 6, COL.orange); } }
    else shape(c, () => ell(c, ix, y + 35, 36, 36), COL.red, 6);
  });
};
// flow.p1: three paper rockets standing side by side: plain, fins, fins and a clay nose
const paperRocket = (c: Ctx, x: number, yb: number, fins: boolean, clay: boolean) => {
  shadow(c, x + 10, yb + 8, 90, 12);
  if (fins) {
    shape(c, () => polyP(c, [[x - 35, yb - 190], [x - 100, yb], [x - 35, yb]]), COL.teal, 5);
    shape(c, () => polyP(c, [[x + 35, yb - 190], [x + 100, yb], [x + 35, yb]]), COL.tealDk, 5);
  }
  const body = () => rrect(c, x - 35, yb - 340, 70, 340, 4);
  shape(c, body, WHITE, 6); shade(c, body, "#d9d4ca", 24, 0, 0.7);
  line(c, [[x - 35, yb - 120], [x + 35, yb - 190]], 5, "#c9c1b0");
  line(c, [[x - 35, yb - 250], [x + 35, yb - 320]], 5, "#c9c1b0");
  shape(c, () => polyP(c, [[x - 35, yb - 340], [x + 35, yb - 340], [x + 6, yb - 420], [x - 6, yb - 420]]), "#f4ede0", 6);
  if (fins) shape(c, () => polyP(c, [[x - 24, yb - 120], [x + 24, yb - 120], [x + 24, yb], [x - 24, yb]]), COL.orange, 5);
  if (clay) { shape(c, () => ell(c, x, yb - 408, 26, 22), TERRA, 5); shade(c, () => ell(c, x, yb - 408, 26, 22), TERRA_DK, 8, 8, 0.6); }
};
const flowP1 = (c: Ctx) => {
  ground(c);
  floorBand(c, 880);
  c.save(); c.translate(540, 880); c.scale(1.15, 1.15); c.translate(-540, -800);
  paperRocket(c, 220, 800, false, false); paperRocket(c, 540, 800, true, false); paperRocket(c, 860, 800, true, true);
  c.restore();
};

// ---------------------------------------------------------------- terms
// term.4 Thrust: a let-go balloon flies one way, the air streams out the other
const term4 = (c: Ctx) => {
  ground(c);
  const cx = 610, cy = 520;
  for (const dy of [-70, 0, 70]) arrow(c, [[385, cy + dy * 0.2], [190, cy + dy * 1.7]], "#7fb6de", 11);
  shape(c, () => polyP(c, [[cx - 170, cy - 22], [cx - 232, cy - 14], [cx - 232, cy + 14], [cx - 170, cy + 22]]), BALLOON, 6);
  shape(c, () => ell(c, cx, cy, 200, 150), BALLOON, 7);
  shade(c, () => ell(c, cx, cy, 200, 150), BALLOON_DK, 50, 40, 0.6);
  shine(c, [[cx - 110, cy - 30], [cx - 60, cy - 100]], 14);
  arrow(c, [[cx + 215, cy - 40], [cx + 410, cy - 40]], RED, 14);
};
// term.0 Orbit: a dotted ring round the Earth with a space station on it moving sideways
const term0 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 640, er = 240, or = 330;
  c.setLineDash([3, 24]); c.beginPath(); ell(c, cx, cy, or, or); c.strokeStyle = COL.orange; c.lineWidth = 16; c.stroke(); c.setLineDash([]);
  shape(c, () => ell(c, cx, cy, er, er), COL.blue, 8);
  shade(c, () => ell(c, cx, cy, er, er), COL.blueDk, 50, 50, 0.6);
  shape(c, () => { c.moveTo(cx - 160, cy - 80); c.quadraticCurveTo(cx - 100, cy - 190, cx - 20, cy - 130); c.quadraticCurveTo(cx - 30, cy - 60, cx - 90, cy - 20); c.quadraticCurveTo(cx - 150, cy - 10, cx - 160, cy - 80); c.closePath(); }, COL.green, 5);
  shape(c, () => { c.moveTo(cx + 60, cy + 20); c.quadraticCurveTo(cx + 150, cy - 30, cx + 170, cy + 60); c.quadraticCurveTo(cx + 130, cy + 160, cx + 80, cy + 110); c.closePath(); }, COL.green, 5);
  // the station, on the ring at the top
  const sy = cy - or;
  line(c, [[cx - 120, sy], [cx + 120, sy]], 8);
  for (const sx of [-1, 1]) { shape(c, () => rrect(c, cx + sx * 70 - 36, sy - 52, 72, 104, 4), COL.blue, 5); line(c, [[cx + sx * 70, sy - 52], [cx + sx * 70, sy + 52]], 3, WHITE); line(c, [[cx + sx * 70 - 36, sy], [cx + sx * 70 + 36, sy]], 3, WHITE); }
  shape(c, () => rrect(c, cx - 44, sy - 24, 88, 48, 12), COL.steel, 6);
  shape(c, () => ell(c, cx, sy, 14, 14), COL.steelDk, 4);
  arrow(c, [[cx + 170, sy], [cx + 330, sy]], RED, 13);
};

export const ic_skyExploringSpaceL4 = cards("sci.sky.exploring-space.L4", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, e3s0, e3s1, e3s2, e3s3,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowP1, term4, term0,
]);
