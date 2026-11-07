import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, write, cards } from "./flatKit";

// FLOATING AND SINKING (L4) · set-up cards for the foil boats and the potato-and-salt tests, then one picture each for
// the experiments, activities and project, and a few terms. Flat kit look: bold outline, flat colour, shade on the
// lower right, the main thing big and in the middle.

type Fn = () => void;

// ---------------------------------------------------------------- things
// a clear vessel seen from the side (a tub, a tumbler, or with round = true a bowl), bottom centre (x, y), w wide, h tall,
// liquid to `fill` of its height. inner(ly) draws what is in it, clipped to the inside; the part under the surface (at
// height ly) is then tinted so it reads as under water.
const vessel = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, inner?: (ly: number) => void, o: { round?: boolean; liquid?: string } = {}) => {
  const tw = w / 2, bw = w * 0.42, liquid = o.liquid ?? COL.water;
  const body: Fn = () => {
    c.moveTo(x - tw, y - h); c.lineTo(x + tw, y - h);
    if (o.round) { c.quadraticCurveTo(x + tw, y, x + tw * 0.45, y); c.lineTo(x - tw * 0.45, y); c.quadraticCurveTo(x - tw, y, x - tw, y - h); }
    else { c.lineTo(x + bw, y); c.lineTo(x - bw, y); }
    c.closePath();
  };
  const ly = y - h * fill;
  const under = (col: string, alpha: number) => { c.save(); c.beginPath(); body(); c.clip(); c.globalAlpha = alpha; c.fillStyle = col; c.fillRect(x - tw - 10, ly, w + 20, h + 20); c.restore(); c.globalAlpha = 1; };
  shadow(c, x + w * 0.08, y + 10, w * 0.5, w * 0.06);
  shape(c, body, COL.glass, 0);
  if (fill > 0) under(liquid, 1);
  if (inner) { c.save(); c.beginPath(); body(); c.clip(); inner(ly); c.restore(); }
  if (fill > 0) { under(COL.waterDk, 0.28); c.save(); c.beginPath(); body(); c.clip(); line(c, [[x - tw, ly], [x + tw, ly]], 6, COL.drop); c.restore(); }
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[x - tw * 0.82, y - h * 0.88], [x - tw * 0.82 + (tw - bw) * 0.45, y - h * 0.3]], 8);
};
// an open foil tray seen from the front and a little above: (x, y) is the middle of its front bottom edge, w wide,
// d = how tall the sides are, k = how far back it goes. inside() draws things on its floor, in the tray's own coordinates
// (the middle of the floor is at (k * 0.225, -d - k / 2)); rot tips the whole tray.
const tray = (c: Ctx, x: number, y: number, w: number, d: number, k: number, rot = 0, inside?: Fn) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const bx = k * 0.45, by = -k, l = -w / 2, r = w / 2;
  shape(c, () => polyP(c, [[l, -d], [r, -d], [r + bx, -d + by], [l + bx, -d + by]]), COL.steelIn, 5);
  shape(c, () => polyP(c, [[l + bx, -d + by], [r + bx, -d + by], [r + bx - d * 0.2, -d + by + d * 0.45], [l + bx + d * 0.2, -d + by + d * 0.45]]), COL.steel, 3);
  inside?.();
  shape(c, () => polyP(c, [[r, 0], [r, -d], [r + bx, -d + by], [r + bx, by]]), COL.steelDk, 5);
  shape(c, () => polyP(c, [[l, 0], [r, 0], [r, -d], [l, -d]]), COL.steel, 5);
  shine(c, [[l + 18, -d * 0.5], [l + w * 0.35, -d * 0.5]], Math.min(8, d * 0.28));
  c.restore();
};
// a crumpled ball of foil
const foilBall = (c: Ctx, x: number, y: number, r: number) => {
  const p: Fn = () => ell(c, x, y, r, r * 0.92);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, -r * 0.3, -r * 0.22, 0.5);
  const rd = rnd(11);
  for (let i = 0; i < 9; i++) {
    const a = rd() * Math.PI * 2, rr = rd() * r * 0.55, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr, b = rd() * Math.PI * 2, len = r * (0.2 + rd() * 0.25);
    line(c, [[px, py], [px + Math.cos(b) * len, py + Math.sin(b) * len], [px + Math.cos(b + 1.3) * len * 0.6, py + Math.sin(b + 1.3) * len * 0.6]], 4, i % 3 ? COL.steelDk : WHITE);
  }
};
// a one-rupee coin (steel): face on when ry = r, lying flat when ry is small
const coin = (c: Ctx, x: number, y: number, r: number, ry = r) => {
  shape(c, () => ell(c, x, y, r, ry), COL.steel, 4); shape(c, () => ell(c, x, y, r * 0.74, ry * 0.74), COL.steelIn, 3);
  if (ry > r * 0.7) write(c, "1", x - r * 0.18, y - r * 0.4, r * 0.8, INK, Math.max(3, r * 0.1));
};
// a stack of n coins standing on (x, y), seen from the front
const coinStack = (c: Ctx, x: number, y: number, r: number, n: number) => {
  const t = r * 0.28, ry = r * 0.36;
  for (let i = 0; i < n; i++) {
    const cy = y - i * t;
    shape(c, () => polyP(c, [[x - r, cy - t], [x + r, cy - t], [x + r, cy], [x - r, cy]]), COL.steelDk, 4);
    shape(c, () => ell(c, x, cy - t, r, ry), COL.steel, 4);
  }
  shape(c, () => ell(c, x, y - n * t, r * 0.74, ry * 0.74), COL.steelIn, 3);
};
const potato = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => {
  const p: Fn = () => ell(c, x, y, rx, ry, rot);
  shape(c, p, COL.brown); shade(c, p, COL.soilDk, -rx * 0.22, -ry * 0.28, 0.4);
  for (const [u, v] of [[-0.45, -0.2], [0.1, -0.5], [0.45, 0.2], [-0.15, 0.45]]) shape(c, () => ell(c, x + u * rx, y + v * ry, rx * 0.07, ry * 0.09), COL.soilDk, 0);
};
// a spoon: handle end at (x, y), len long, pointing at angle an (the bowl is at the far end)
const spoon = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.wood, dk: string = COL.woodDk) => {
  const bw = len * 0.13, ca = Math.cos(an), sa = Math.sin(an), cx = x + ca * (len - bw), cy = y + sa * (len - bw), hx = x + ca * (len - bw * 1.7), hy = y + sa * (len - bw * 1.7);
  line(c, [[x, y], [hx, hy]], bw * 0.42 + 10, INK); line(c, [[x, y], [hx, hy]], bw * 0.42, col);
  shape(c, () => ell(c, cx, cy, bw, bw * 0.66, an), col, 5);
  shape(c, () => ell(c, cx + ca * bw * 0.06, cy + sa * bw * 0.06, bw * 0.68, bw * 0.4, an), dk, 0);
};
const lemon = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const p: Fn = () => { c.moveTo(x - rx - ry * 0.3, y); c.quadraticCurveTo(x - rx, y - ry, x, y - ry); c.quadraticCurveTo(x + rx, y - ry, x + rx + ry * 0.3, y); c.quadraticCurveTo(x + rx, y + ry, x, y + ry); c.quadraticCurveTo(x - rx, y + ry, x - rx - ry * 0.3, y); c.closePath(); };
  shape(c, p, COL.yellow); shade(c, p, COL.orange, -rx * 0.2, -ry * 0.3, 0.45);
};
// a drinking straw standing upright with clay in its bottom end at (x, bottom); marks = [height above the bottom, colour]
const straw = (c: Ctx, x: number, bottom: number, h: number, w: number, marks: [number, string][]) => {
  const p: Fn = () => rrect(c, x - w / 2, bottom - h, w, h, w * 0.3);
  shape(c, p, WHITE, 5);
  c.save(); c.beginPath(); p(); c.clip();
  for (let yy = bottom - h; yy < bottom; yy += 44) shape(c, () => polyP(c, [[x - w / 2, yy], [x + w / 2, yy - 18], [x + w / 2, yy], [x - w / 2, yy + 18]]), COL.red, 0);
  c.restore();
  shape(c, () => ell(c, x, bottom - w * 0.15, w * 0.78, w * 0.55), COL.purple, 5);
  marks.forEach(([m, col]) => line(c, [[x - w / 2 - 3, bottom - m], [x + w / 2 + 3, bottom - m]], 8, col));
};
// a clear bottle with a cap, bottom centre (x, bottom), w wide, h tall to the cap, full of `liquid`; dent = how far each side is pressed in
const bottle = (c: Ctx, x: number, bottom: number, w: number, h: number, dent: number, liquid: string, inner?: Fn) => {
  const top = bottom - h * 0.72, nw = w * 0.36, neck = bottom - h * 0.9, my = (top + bottom) / 2;
  const p: Fn = () => {
    c.moveTo(x - nw / 2, neck); c.lineTo(x + nw / 2, neck); c.lineTo(x + nw / 2, top - w * 0.3); c.lineTo(x + w / 2, top);
    c.quadraticCurveTo(x + w / 2 - dent * 2, my, x + w / 2, bottom - 20); c.quadraticCurveTo(x + w / 2, bottom, x + w / 2 - 20, bottom);
    c.lineTo(x - w / 2 + 20, bottom); c.quadraticCurveTo(x - w / 2, bottom, x - w / 2, bottom - 20);
    c.quadraticCurveTo(x - w / 2 + dent * 2, my, x - w / 2, top); c.lineTo(x - nw / 2, top - w * 0.3); c.closePath();
  };
  shadow(c, x + w * 0.1, bottom + 8, w * 0.55, w * 0.08);
  shape(c, p, liquid, 0);
  if (inner) { c.save(); c.beginPath(); p(); c.clip(); inner(); c.restore(); }
  shape(c, p, "rgba(0,0,0,0)", 6);
  shine(c, [[x - w * 0.36, top + 40], [x - w * 0.36 + dent * 1.5, my], [x - w * 0.36, bottom - 60]], 8);
  shape(c, () => rrect(c, x - nw / 2 - 8, bottom - h, nw + 16, h * 0.1 + 4, 8), COL.blue, 5);
  shade(c, () => rrect(c, x - nw / 2 - 8, bottom - h, nw + 16, h * 0.1 + 4, 8), COL.blueDk, -nw * 0.3, 0, 0.5);
};
// a cube with its front face's bottom edge centred on (x, y), s to a side
const cube = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, top: string) => {
  const k = s * 0.42;
  shape(c, () => polyP(c, [[x - s / 2, y - s], [x + s / 2, y - s], [x + s / 2 + k, y - s - k * 0.7], [x - s / 2 + k, y - s - k * 0.7]]), top, 5);
  shape(c, () => polyP(c, [[x + s / 2, y], [x + s / 2, y - s], [x + s / 2 + k, y - s - k * 0.7], [x + s / 2 + k, y - k * 0.7]]), dk, 5);
  shape(c, () => polyP(c, [[x - s / 2, y], [x + s / 2, y], [x + s / 2, y - s], [x - s / 2, y - s]]), col, 5);
};
// a child's hand coming in from the right (the kit's hand, mirrored), wrist at (x, y), fingers pointing at angle A
const handR = (c: Ctx, x: number, y: number, A: number, s: number, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - A, s, SKIN.child, CLOTH.child, open); c.restore(); };
// where a hand's wrist must be for its grip to close on point g, fingers pointing at angle A
const wristFor = (g: [number, number], A: number, s: number): [number, number] => [g[0] - Math.cos(A) * 70 * s, g[1] - Math.sin(A) * 70 * s];
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 8, y + h + 6, w * 0.5, 10); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 5); };
// a wooden ruler lying flat, from x0 to x0 + 400, marked 0 to 15 cm
const ruler = (c: Ctx, x0: number, y0: number) => {
  shadow(c, x0 + 210, y0 + 78, 200, 10);
  shape(c, () => rrect(c, x0, y0, 400, 70, 6), COL.wood, 5);
  c.fillStyle = COL.woodDk; c.fillRect(x0 + 3, y0 + 54, 394, 13);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 150; mm += 2) { const x = x0 + 20 + mm * 2.4, h = mm % 10 === 0 ? 26 : mm % 5 === 0 ? 18 : 10; c.lineWidth = mm % 10 === 0 ? 3 : 2; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y0 + h); c.stroke(); }
  for (const cm of [0, 5, 10, 15]) write(c, String(cm), x0 + 20 + cm * 24 - (cm > 9 ? 16 : 7), y0 + 30, 18, INK, 3);
};
// the three foil boats from the same square: wide and shallow, medium, narrow and deep (base + 2 x side = 15 cm)
const threeBoats = (c: Ctx, y: number, sc: number) => {
  tray(c, 220, y, 312 * sc, 24 * sc, 140 * sc);
  tray(c, 570, y, 216 * sc, 72 * sc, 97 * sc);
  tray(c, 880, y, 120 * sc, 120 * sc, 54 * sc);
};

// ---------------------------------------------------------------- set-up cards: foil boats (e1)
// 1. a square of foil with fold lines 1, 3 and 5 cm in, a ruler, and the three boats they make
const e1s0 = (c: Ctx) => {
  ground(c);
  const sq: Fn = () => polyP(c, [[150, 340], [530, 340], [490, 120], [190, 120]]);
  shadow(c, 350, 346, 195, 14); shape(c, sq, COL.steel);
  shine(c, [[200, 160], [300, 150]], 7);
  const xl = (yy: number) => 150 + 40 * ((340 - yy) / 220), xr = (yy: number) => 530 - 40 * ((340 - yy) / 220);
  c.setLineDash([14, 12]);
  for (const cm of [1, 3, 5]) { const i = cm * 24; line(c, [[xl(340 - i) + i, 340 - i], [xr(340 - i) - i, 340 - i], [xr(120 + i) - i, 120 + i], [xl(120 + i) + i, 120 + i], [xl(340 - i) + i, 340 - i]], 4, INK); }
  c.setLineDash([]);
  ruler(c, 600, 170);
  threeBoats(c, 800, 1);
  for (const [x, t] of [[250, "1 cm"], [590, "3 cm"], [890, "5 cm"]] as [number, string][]) write(c, t, x - 55, 850, 36, INK, 5);
};
// 2. two hands squeezing the fourth square into a ball, the three boats beside
const e1s1 = (c: Ctx) => {
  ground(c);
  foilBall(c, 540, 400, 140);
  hand(c, 334, 400, 0, 1.3);
  handR(c, 746, 400, Math.PI, 1.3);
  threeBoats(c, 900, 0.8);
};
// 3. the basin of water with the first boat floating in the middle, coins beside
const e1s2 = (c: Ctx) => {
  ground(c);
  vessel(c, 480, 820, 760, 480, 0.55, () => tray(c, 480, 590, 260, 80, 110));
  coinStack(c, 955, 900, 42, 7);
  coin(c, 1010, 940, 40, 14);
};
// 4. a hand placing one coin in the middle of the floating boat; the count so far on a paper
const e1s3 = (c: Ctx) => {
  ground(c);
  vessel(c, 480, 880, 820, 520, 0.55, () => tray(c, 480, 630, 300, 90, 130, 0, () => coinStack(c, 29, -148, 30, 6)));
  const g: [number, number] = [520, 335], A = Math.PI * 0.75, w = wristFor(g, A, 1.4);
  coin(c, g[0], g[1], 48);
  handR(c, w[0], w[1], A, 1.4);
  paper(c, 90, 110, 200, 200);
  write(c, "6", 150, 150, 120, INK, 9);
};
// 5. the boat tips: water comes over the low rim, the coins slide out and sink
const e1s4 = (c: Ctx) => {
  ground(c);
  vessel(c, 480, 880, 820, 520, 0.55, () => {
    tray(c, 450, 620, 300, 90, 130, 0.6, () => {
      // the water that has come in pools at the low end
      shape(c, () => polyP(c, [[30, -90], [150, -90], [208, -220], [88, -220]]), COL.water, 0);
      line(c, [[30, -90], [88, -220]], 5, COL.drop);
      coin(c, 0, -150, 30, 14); coin(c, 55, -145, 30, 14); coin(c, 110, -135, 30, 14);
      arrow(c, [[-90, -200], [60, -180]], RED, 8);
    });
    coin(c, 700, 690, 30, 22); coin(c, 745, 780, 30, 16); coin(c, 660, 862, 30, 10); coin(c, 760, 868, 30, 10);
  });
};

// ---------------------------------------------------------------- set-up cards: the potato and the salt (e2)
// 1. a tall glass with 250 ml of tap water; the potato sits at the bottom
const e2s0 = (c: Ctx) => {
  ground(c);
  vessel(c, 540, 880, 320, 620, 0.6, () => potato(c, 540, 830, 95, 68, 0.15));
  line(c, [[690, 508], [740, 508]], 5, INK);
  write(c, "250 ml", 750, 482, 50, INK, 6);
};
// 2. the potato lifted out on a spoon; a tablespoon of salt stirred into the glass
const e2s1 = (c: Ctx) => {
  ground(c);
  spoon(c, 70, 930, 300, -0.35, COL.steel, COL.steelDk);
  potato(c, 352, 800, 72, 52, 0.2);
  const W: [number, number] = [860, 300], B: [number, number] = [600, 720], dx = B[0] - W[0], dy = B[1] - W[1], len = Math.hypot(dx, dy), A = Math.atan2(dy, dx);
  const sp = () => spoon(c, W[0] + Math.cos(A) * 15, W[1] + Math.sin(A) * 15, len - 15, A, COL.steel, COL.steelDk);
  vessel(c, 580, 900, 280, 600, 0.62, (ly) => {
    const rd = rnd(5);
    for (let i = 0; i < 40; i++) shape(c, () => ell(c, 470 + rd() * 220, ly + 30 + rd() * 300, 5, 5), WHITE, 0);
    sp();
    c.globalAlpha = 0.8; line(c, [[500, 650], [540, 690], [620, 700], [680, 670]], 6, COL.drop); line(c, [[520, 760], [580, 790], [650, 780]], 6, COL.drop); c.globalAlpha = 1;
  });
  // the handle outside the glass (clip to everything but the glass)
  c.save(); c.beginPath(); c.rect(0, 0, D, D); polyP(c, [[440, 300], [720, 300], [698, 900], [462, 900]]); c.clip("evenodd"); sp(); c.restore();
  handR(c, W[0], W[1], A, 1.3);
  bowl(c, 960, 800, 80, WHITE);
  shape(c, () => { c.moveTo(900, 800); c.quadraticCurveTo(960, 740, 1020, 800); c.closePath(); }, WHITE, 5);
};
// 3. the potato lowered back into the salty water; will it sink, hover or float?
const e2s2 = (c: Ctx) => {
  ground(c);
  vessel(c, 470, 900, 300, 600, 0.62);
  arrow(c, [[470, 330], [470, 600]], RED, 10);
  const g: [number, number] = [470, 235], A = Math.PI * 0.75, w = wristFor(g, A, 1.4);
  potato(c, g[0], g[1], 72, 52, 0.1);
  handR(c, w[0], w[1], A, 1.4);
  const mini = (x: number, py: number) => vessel(c, x, 880, 100, 220, 0.65, () => potato(c, x, py, 28, 21, 0.2));
  mini(770, 850); mini(890, 800); mini(1010, 745);
};
// 4. more and more salt: the potato at the bottom, in the middle, then at the top
const e2s3 = (c: Ctx) => {
  ground(c);
  const gl = (x: number, py: number, n: number) => {
    vessel(c, x, 760, 250, 520, 0.65, () => potato(c, x, py, 75, 56, 0.15));
    write(c, String(n), x - 135, 850, 70, INK, 7);
    spoon(c, x - 60, 900, 180, 0, COL.steel, COL.steelDk);
    shape(c, () => { c.moveTo(x + 76, 900); c.quadraticCurveTo(x + 97, 862, x + 118, 900); c.closePath(); }, WHITE, 4);
  };
  gl(200, 705, 1); gl(540, 580, 2); gl(880, 432, 3);
};

// ---------------------------------------------------------------- the experiments, activities and project
// Foil boats: the same foil as a ball sinks and as a boat floats, carrying coins
const fE1 = (c: Ctx) => {
  ground(c);
  vessel(c, 540, 880, 860, 540, 0.55, () => {
    tray(c, 540, 615, 320, 90, 140, 0, () => { coinStack(c, -40, -150, 30, 5); coinStack(c, 60, -145, 30, 4); });
    foilBall(c, 300, 812, 68);
  });
};
// The potato and the salt: it sinks in plain water and floats in very salty water
const fE2 = (c: Ctx) => {
  ground(c);
  vessel(c, 300, 800, 280, 560, 0.65, () => potato(c, 300, 740, 80, 58, 0.15));
  vessel(c, 780, 800, 280, 560, 0.65, () => potato(c, 780, 448, 80, 58, 0.15));
  bowl(c, 540, 900, 85, WHITE);
  shape(c, () => { c.moveTo(478, 900); c.quadraticCurveTo(540, 835, 602, 900); c.closePath(); }, WHITE, 5);
  arrow(c, [[600, 820], [660, 700], [700, 610]], RED, 9);
};
// Guess and sort: kitchen things floating and sunk in one bowl
const fA1 = (c: Ctx) => {
  ground(c);
  vessel(c, 540, 880, 880, 560, 0.6, (ly) => {
    spoon(c, 300, 850, 400, 0.05, COL.steel, COL.steelDk);
    coin(c, 760, 862, 34, 12);
    potato(c, 850, 820, 70, 52, 0.2);
    spoon(c, 170, ly + 12, 340, -0.1);
    lemon(c, 640, ly + 4, 60, 44);
    shape(c, () => rrect(c, 760, ly - 28, 130, 56, 10), COL.cloth, 5); line(c, [[890, ly], [912, ly - 4]], 4, INK);
  });
};
// Density tower: syrup, water and oil in layers
const fA2 = (c: Ctx) => {
  ground(c);
  vessel(c, 480, 920, 340, 680, 0, () => {
    c.fillStyle = COL.purple; c.fillRect(300, 720, 360, 200);
    c.fillStyle = COL.water; c.fillRect(300, 520, 360, 200);
    c.fillStyle = COL.yellow; c.fillRect(300, 340, 360, 180);
    for (const yy of [340, 520, 720]) line(c, [[300, yy], [660, yy]], 6, COL.drop);
  });
  bottle(c, 900, 920, 120, 320, 0, COL.yellow);
};
// Make a hydroscope: the straw floats lower in plain water and higher in salty water
const fA3 = (c: Ctx) => {
  ground(c);
  vessel(c, 300, 820, 300, 600, 0.7, (ly) => straw(c, 300, ly + 260, 430, 36, [[260, INK]]));
  vessel(c, 780, 820, 300, 600, 0.7, (ly) => {
    const rd = rnd(3);
    for (let i = 0; i < 14; i++) shape(c, () => ell(c, 670 + rd() * 220, 790 + rd() * 25, 6, 5), WHITE, 0);
    straw(c, 780, ly + 200, 430, 36, [[260, INK], [200, RED]]);
  });
};
// Bottle diver: squeeze the bottle and the diver sinks
const fP1 = (c: Ctx) => {
  ground(c);
  bottle(c, 540, 920, 300, 820, 26, COL.water, () => {
    const p: Fn = () => rrect(c, 516, 640, 48, 140, 20);
    shape(c, p, COL.teal, 5);
    shape(c, () => rrect(c, 524, 650, 32, 60, 12), COL.drop, 0);
    shape(c, () => ell(c, 570, 745, 20, 16), COL.purple, 5);
    for (const [bx, by] of [[600, 400], [470, 300]]) shape(c, () => ell(c, bx, by, 9, 9), COL.drop, 3);
  });
  arrow(c, [[620, 800], [620, 890]], RED, 9);
  hand(c, 300, 615, 0, 1.4, SKIN.child, CLOTH.child, true);
  handR(c, 780, 615, Math.PI, 1.4, true);
};

// ---------------------------------------------------------------- terms and explanations
// Float: a wooden spoon resting on the water in a bowl
const tFloat = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 600, 360, COL.water);
  c.save(); c.beginPath(); ell(c, 540, 600, 360, 72); c.clip();
  c.globalAlpha = 0.8; for (const [x, r] of [[420, 70], [660, 90]]) { c.beginPath(); ell(c, x, 600, r, r * 0.22); c.strokeStyle = COL.drop; c.lineWidth = 5; c.stroke(); } c.globalAlpha = 1;
  spoon(c, 310, 610, 480, -0.06);
  c.restore();
};
// Sink: a steel spoon lying at the bottom of a bowl of water
const tSink = (c: Ctx) => {
  ground(c);
  vessel(c, 540, 820, 900, 380, 0.75, () => spoon(c, 300, 788, 460, 0.04, COL.steel, COL.steelDk), { round: true });
};
// Density: a steel cube and a wooden cube of the same size on a balance; the steel side goes down
const tDensity = (c: Ctx) => {
  ground(c);
  const px = 540, py = 420, th = 0.2, L = 330;
  shadow(c, 560, 905, 270, 22);
  shape(c, () => polyP(c, [[320, 900], [760, 900], [700, 840], [380, 840]]), COL.teal, 5);
  shape(c, () => rrect(c, px - 22, py - 10, 44, 850 - py, 8), COL.tealDk, 5);
  const ex = Math.cos(th) * L, ey = Math.sin(th) * L, lx = px - ex, ly = py - ey, rx = px + ex, ry = py + ey;
  line(c, [[lx, ly], [rx, ry]], 22, INK); line(c, [[lx, ly], [rx, ry]], 12, COL.woodDk);
  shape(c, () => ell(c, px, py, 20, 20), COL.yellow, 5);
  const pan = (x: number, y: number) => { line(c, [[x, y], [x, y + 180]], 5, INK); shadow(c, x + 10, y + 206, 125, 14); shape(c, () => { c.moveTo(x - 125, y + 180); c.quadraticCurveTo(x, y + 240, x + 125, y + 180); c.closePath(); }, COL.steelDk, 5); shape(c, () => ell(c, x, y + 180, 125, 22), COL.steelIn, 5); };
  pan(lx, ly); pan(rx, ry);
  cube(c, lx - 10, ly + 184, 110, COL.wood, COL.woodDk, "#f8d58a");
  cube(c, rx - 10, ry + 184, 110, COL.steel, COL.steelDk, COL.steelIn);
};
// Why ice floats: an iceberg with one tenth above the water and nine tenths below
const xIceberg = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 400);
  c.fillStyle = COL.water; c.fillRect(0, 400, D, D - 400);
  const berg: Fn = () => polyP(c, [[330, 400], [335, 350], [400, 330], [470, 318], [540, 335], [620, 322], [690, 340], [745, 332], [750, 400], [768, 560], [752, 760], [700, 1030], [420, 1030], [340, 820], [318, 600]]);
  shape(c, berg, WHITE); shade(c, berg, COL.sky, -90, -30, 0.8);
  c.save(); c.beginPath(); berg(); c.clip();
  for (let i = 1; i < 10; i++) line(c, [[300, 330 + i * 70], [780, 330 + i * 70]], 3, COL.glassEdge);
  c.globalAlpha = 0.4; c.fillStyle = COL.waterDk; c.fillRect(0, 400, D, D); c.globalAlpha = 1;
  c.restore();
  shape(c, berg, "rgba(0,0,0,0)", 6);
  line(c, [[40, 400], [1040, 400]], 6, COL.drop);
  write(c, "1", 820, 338, 60, INK, 7);
  write(c, "9", 820, 660, 60, INK, 7);
};

export const ic_statesFloatingAndSinkingL4 = cards("sci.states.floating-and-sinking.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  fE1, fE2, fA1, fA2, fA3, fP1, tFloat, tSink, tDensity, xIceberg,
]);
