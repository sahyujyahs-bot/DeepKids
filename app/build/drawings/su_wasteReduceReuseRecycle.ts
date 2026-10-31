import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, BG, WHITE, RED, D, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, cards } from "./flatKit";

// WASTE: REDUCE, REUSE, RECYCLE (L3) · nine set-up cards: the rot jar test, melt and remake crayons,
// the bag test. Same jars, same bags, same crayons on every card of an experiment.

const TABLE = "#e4d3b2", TABLE_LINE = "#c9b48a";
const table = (c: Ctx, y: number) => { ground(c); c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5, TABLE_LINE); };

// the forearm behind a hand(): a sleeve-coloured bar from the cuff out to where the arm comes in
const arm = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string, far: number) => {
  const sx = x - Math.cos(an) * 50 * s, sy = y - Math.sin(an) * 50 * s, ex = x - Math.cos(an) * far, ey = y - Math.sin(an) * far;
  line(c, [[sx, sy], [ex, ey]], 72 * s + 12, INK); line(c, [[sx, sy], [ex, ey]], 72 * s, sleeve);
};

// ------------------------------------------------------------ things in the rot jars
// a pillow packet (milk, atta), centre (x, y), band colour
const pillow = (c: Ctx, x: number, y: number, w: number, h: number, band: string, mark: "drop" | "wheat") => {
  const l = x - w / 2, r = x + w / 2, t = y - h / 2, b = y + h / 2, k = w / 8;
  const body = () => {
    c.moveTo(l, t);
    for (let i = 0; i < 8; i++) c.lineTo(l + k * (i + 0.5), t + (i % 2 ? 0 : 9)), c.lineTo(l + k * (i + 1), t + (i % 2 ? 9 : 0));
    c.quadraticCurveTo(r + 8, y, r, b);
    for (let i = 8; i > 0; i--) c.lineTo(l + k * (i - 0.5), b - (i % 2 ? 0 : 9)), c.lineTo(l + k * (i - 1), b - (i % 2 ? 9 : 0));
    c.quadraticCurveTo(l - 8, y, l, t); c.closePath();
  };
  shape(c, body, WHITE, 5);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = band; c.fillRect(l - 10, y - h * 0.16, w + 20, h * 0.4);
  c.fillStyle = "rgba(43,35,64,0.14)"; c.fillRect(x + w * 0.2, t, w, h);
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 5);
  if (mark === "drop") shape(c, () => { c.moveTo(x, y - h * 0.12); c.quadraticCurveTo(x - w * 0.2, y + h * 0.04, x - w * 0.14, y + h * 0.1); c.arc(x, y + h * 0.1, w * 0.14, Math.PI, 0, true); c.quadraticCurveTo(x + w * 0.2, y + h * 0.04, x, y - h * 0.12); c.closePath(); }, WHITE, 4);
  else { line(c, [[x, y + h * 0.14], [x, y - h * 0.1]], 4, WHITE); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + s * 9, y - h * 0.02 - i * 14, 6, 10, s * 0.6), WHITE, 3); }
};

type Kind = "peel" | "paper" | "cloth" | "packet";
// banana peel, newspaper, cotton rag, milk packet: fresh, or aged = what is left after two weeks
const thing = (c: Ctx, kind: Kind, x: number, y: number, s: number, aged = false, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const r = rnd(5);
  if (kind === "peel") {
    if (aged) c.scale(0.7, 0.7);
    const p = () => { c.moveTo(-60, -6); c.bezierCurveTo(-40, 62, 40, 62, 62, -34); c.bezierCurveTo(40, 10, -30, 12, -60, -6); c.closePath(); };
    shape(c, p, aged ? "#3b3028" : COL.yellow, 6);
    shade(c, p, aged ? "#1f1814" : COL.orange, 0, 14, 0.5);
    shape(c, () => ell(c, 63, -36, 9, 8), aged ? "#2a211c" : COL.brown, 4);
    if (!aged) for (let i = 0; i < 5; i++) shape(c, () => ell(c, -30 + i * 20, 22 - Math.sin(i * 0.8) * 10, 3.5, 3.5), COL.brown, 0);
    else {
      shape(c, () => ell(c, -8, 22, 14, 9, 0.2), "#8a5a3c", 3);
      for (let i = 0; i < 22; i++) { const a = r() * Math.PI * 2, d = 24 + r() * 16, px = Math.cos(a) * 52 * 0.9, py = Math.sin(a) * 18 + 12; line(c, [[px, py], [px + Math.cos(a) * d * 0.7, py + Math.sin(a) * d * 0.7]], 4, WHITE); }
    }
  } else if (kind === "paper") {
    if (!aged) {
      shape(c, () => rrect(c, -42, -54, 84, 108, 6), COL.paper, 6);
      shade(c, () => rrect(c, -42, -54, 84, 108, 6), COL.grey, 22, 0, 0.35);
      line(c, [[-28, -36], [26, -36]], 12, INK);
      for (let i = 0; i < 6; i++) line(c, [[-28, -12 + i * 14], [i % 2 ? 14 : 28, -12 + i * 14]], 5, COL.greyDk);
    } else {
      const p = () => { c.moveTo(-40, -30); c.lineTo(-14, -36); c.lineTo(10, -28); c.lineTo(36, -34); c.lineTo(42, -4); c.lineTo(30, 14); c.lineTo(40, 36); c.lineTo(8, 44); c.lineTo(-18, 34); c.lineTo(-40, 40); c.lineTo(-34, 6); c.closePath(); };
      shape(c, p, "#a29d92", 6); shade(c, p, "#6f6a62", 8, 10, 0.5);
      for (let i = 0; i < 5; i++) shape(c, () => ell(c, -22 + r() * 44, -14 + r() * 44, 7 + r() * 5, 5 + r() * 4, r() * 3), "#6f6a62", 0);
    }
  } else if (kind === "cloth") {
    const p = () => { c.moveTo(-50, -42); c.quadraticCurveTo(0, -52, 50, -42); c.lineTo(46, 30); for (let i = 0; i < 6; i++) c.lineTo(46 - (i + 0.5) * 15.3, 46), c.lineTo(46 - (i + 1) * 15.3, 30); c.closePath(); };
    shape(c, p, aged ? "#d8cdb2" : COL.cloth, 6);
    c.save(); c.beginPath(); p(); c.clip();
    c.fillStyle = COL.blue; c.fillRect(-60, -22, 120, 10); c.fillRect(-60, 2, 120, 10);
    if (aged) { c.fillStyle = "rgba(122,86,40,0.7)"; c.beginPath(); ell(c, -22, -8, 26, 20, 0.4); c.fill(); c.beginPath(); ell(c, 26, 16, 22, 18, 0); c.fill(); c.fillStyle = "rgba(90,100,60,0.65)"; c.beginPath(); ell(c, 8, -30, 18, 11, 0); c.fill(); }
    c.fillStyle = "rgba(43,35,64,0.12)"; c.fillRect(20, -60, 60, 120);
    c.restore(); shape(c, p, "rgba(0,0,0,0)", 6);
  } else pillow(c, 0, 0, 82, 104, COL.blue, "drop");
  c.restore();
};

// a glass jar of soil, bottom centre (x, yb). Whatever is in `inside` is drawn on the soil, inside the glass.
const jar = (c: Ctx, x: number, yb: number, w: number, h: number, soilH: number, inside?: () => void) => {
  const l = x - w / 2, t = yb - h, body = () => rrect(c, l, t, w, h, w * 0.1);
  shadow(c, x + w * 0.1, yb + 10, w * 0.62, w * 0.09);
  shape(c, body, "rgba(214,236,250,0.5)", 0);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.soil; c.fillRect(l, yb - soilH, w, soilH);
  c.fillStyle = COL.soilDk; c.globalAlpha = 0.55; c.fillRect(l + w * 0.74, yb - soilH, w, soilH); c.globalAlpha = 1;
  const r = rnd(x);
  for (let i = 0; i < 22; i++) shape(c, () => ell(c, l + 14 + r() * (w - 28), yb - soilH + 14 + r() * (soilH - 24), 6 + r() * 5, 4 + r() * 3, r() * 3), r() > 0.5 ? COL.soilDk : "#a8744f", 0);
  line(c, [[l, yb - soilH], [l + w, yb - soilH]], 6, COL.soilDk);
  inside?.();
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, l - 8, t - 14, w + 16, 24, 9), COL.glass, 5);
  shine(c, [[l + w * 0.12, t + h * 0.12], [l + w * 0.12, t + h * 0.5]], 8);
};
const JAR_W = 210, JAR_H = 470, JAR_SOIL = 240, JAR_Y = 900;
const KINDS: Kind[] = ["peel", "paper", "cloth", "packet"];
const JAR_X = [165, 415, 665, 915];

// card: setup.e1.0
const c_e1_0 = (c: Ctx) => {
  table(c, 840);
  KINDS.forEach((k, i) => {
    jar(c, JAR_X[i], JAR_Y, JAR_W, JAR_H, JAR_SOIL);
    shape(c, () => rrect(c, JAR_X[i] - 70, JAR_Y - JAR_H + 90, 140, 150, 12), WHITE, 5);
    thing(c, k, JAR_X[i], JAR_Y - JAR_H + 165, 1.05);
  });
};

// card: setup.e1.1
const c_e1_1 = (c: Ctx) => {
  table(c, 940);
  const x = 540, yb = 960, w = 560, h = 700, soilH = 340;
  jar(c, x, yb, w, h, soilH);
  // a child's hand holds a piece of peel against the front-left glass and pushes it down into the soil
  const an = 2.05, s = 2, wx = 480, wy = 400;
  thing(c, "peel", wx + Math.cos(an) * 190, wy + Math.sin(an) * 190, 2, false, an);
  arm(c, wx, wy, an, s, CLOTH.child, 420);
  hand(c, wx, wy, an, s, SKIN.child, CLOTH.child);
  arrow(c, [[640, 520], [640, 740]], RED, 14);
};

// card: setup.e1.2
const c_e1_2 = (c: Ctx) => {
  table(c, 840);
  KINDS.forEach((k, i) => {
    jar(c, JAR_X[i], JAR_Y, JAR_W, JAR_H, JAR_SOIL, () => thing(c, k, JAR_X[i], JAR_Y - 120, k === "packet" ? 1.5 : 1.55, true));
    shape(c, () => rrect(c, JAR_X[i] - 70, JAR_Y - JAR_H + 90, 140, 150, 12), WHITE, 5);
    thing(c, k, JAR_X[i], JAR_Y - JAR_H + 165, 1.05);
  });
};

// ------------------------------------------------------------ crayons
// a crayon from its back end (x, y) along angle an: body, a cone tip, and a paper wrapper over the first `wrap` part
const crayon = (c: Ctx, x: number, y: number, an: number, len: number, wid: number, col: string, colDk: string, wrap = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const tip = wid * 0.9, body = () => { c.moveTo(0, -wid / 2); c.lineTo(len - tip, -wid / 2); c.lineTo(len, 0); c.lineTo(len - tip, wid / 2); c.lineTo(0, wid / 2); c.closePath(); };
  shape(c, body, col, 5); shade(c, body, colDk, 0, wid * 0.22, 0.6);
  if (wrap > 0) { shape(c, () => rrect(c, 0, -wid / 2 - 2, len * wrap, wid + 4, 4), COL.paper, 5); line(c, [[len * 0.08, -wid * 0.2], [len * wrap - 12, -wid * 0.2]], 5, col); line(c, [[len * 0.08, wid * 0.2], [len * wrap - 12, wid * 0.2]], 5, col); }
  c.restore();
};
// a heap of crayon bits
const heap = (c: Ctx, cx: number, yb: number, w: number, h: number, col: string, colDk: string, sd: number) => {
  const r = rnd(sd), bits: [number, number, number, number][] = [];
  for (let i = 0; i < 46; i++) { const u = Math.pow(r(), 0.8), t = (r() - 0.5) * (1 - u * 0.85); bits.push([cx + t * w, yb - u * h, r() * 3, 0.85 + r() * 0.4]); }
  shadow(c, cx + 20, yb + 14, w * 0.55, 26);
  bits.sort((a, b) => a[1] - b[1]).forEach(([x, y, rot, sc]) => {
    const p = () => { c.save(); c.translate(x, y); c.rotate(rot); rrect(c, -22 * sc, -11 * sc, 44 * sc, 22 * sc, 5); c.restore(); };
    c.save(); c.translate(x, y); c.rotate(rot);
    shape(c, () => rrect(c, -22 * sc, -11 * sc, 44 * sc, 22 * sc, 5), col, 4.5);
    c.beginPath(); c.rect(-22 * sc, 0, 44 * sc, 11 * sc); c.fillStyle = colDk; c.globalAlpha = 0.55; c.fill(); c.globalAlpha = 1;
    shape(c, () => rrect(c, -22 * sc, -11 * sc, 44 * sc, 22 * sc, 5), "rgba(0,0,0,0)", 4.5);
    c.restore(); void p;
  });
};

// card: setup.e2.0
const c_e2_0 = (c: Ctx) => {
  table(c, 0);
  plate(c, 540, 800, 440, 190);
  heap(c, 330, 820, 260, 150, COL.red, "#b73a26", 3);
  heap(c, 750, 820, 260, 150, COL.blue, COL.blueDk, 4);
  // a child's hand holds a crayon and peels its paper off in a strip
  const an = 0.9, s = 2.2, d = [Math.cos(an), Math.sin(an)], mid = [380, 250], len = 520;
  const back = [mid[0] - d[0] * len * 0.2, mid[1] - d[1] * len * 0.2], wx = mid[0] - d[0] * 70 * s, wy = mid[1] - d[1] * 70 * s;
  crayon(c, back[0], back[1], an, len, 76, COL.red, "#b73a26", 0.55);
  const P = [back[0] + d[0] * len * 0.55, back[1] + d[1] * len * 0.55];
  const curl = [[P[0], P[1]], [P[0] + 60, P[1] + 40], [P[0] + 70, P[1] + 110], [P[0] + 10, P[1] + 140], [P[0] - 20, P[1] + 100], [P[0] + 20, P[1] + 80]];
  line(c, curl, 34, INK); line(c, curl, 22, COL.paper);
  arm(c, wx, wy, an, s, CLOTH.child, 420);
  hand(c, wx, wy, an, s, SKIN.child, CLOTH.child);
};

// ------------------------------------------------------------ melting
// card: setup.e2.1
const c_e2_1 = (c: Ctx) => {
  table(c, 880);
  c.save(); c.translate(70, 0);
  // the pan of hot water
  shadow(c, 560, 880, 400, 40);
  shape(c, () => rrect(c, 200, 600, 720, 270, 40), COL.steel, 6);
  shade(c, () => rrect(c, 200, 600, 720, 270, 40), COL.steelDk, 120, 0, 0.55);
  shape(c, () => rrect(c, 60, 650, 160, 56, 22), COL.steelDk, 6);
  shape(c, () => ell(c, 560, 600, 360, 80), COL.steelIn, 6);
  shape(c, () => ell(c, 560, 608, 330, 62), COL.water, 4);
  // the bowl of melting wax sitting in the water
  shape(c, () => { c.moveTo(340, 560); c.bezierCurveTo(360, 690, 760, 690, 780, 560); c.closePath(); }, COL.steel, 6);
  shade(c, () => { c.moveTo(340, 560); c.bezierCurveTo(360, 690, 760, 690, 780, 560); c.closePath(); }, COL.steelDk, 80, -10, 0.55);
  shape(c, () => ell(c, 560, 560, 220, 54), COL.steelIn, 6);
  shape(c, () => ell(c, 560, 566, 196, 40), COL.orange, 4);
  c.save(); c.beginPath(); ell(c, 560, 566, 196, 40); c.clip();
  for (const [dx, col] of [[-90, COL.red], [10, COL.yellow], [100, COL.pink]] as [number, string][]) { c.beginPath(); ell(c, 560 + dx, 566, 70, 26, 0.2); c.fillStyle = col; c.fill(); }
  c.restore();
  shine(c, [[420, 620], [470, 650]], 9);
  // steam
  for (const sx of [330, 560, 790]) { const wav = [[sx, 500], [sx + 28, 450], [sx - 24, 400], [sx + 22, 350], [sx - 14, 300]]; line(c, wav, 20, INK); line(c, wav, 11, WHITE); }
  // a wooden spoon in the wax, held by a grown-up
  const an = 1.92, d = [Math.cos(an), Math.sin(an)], tipX = 560, tipY = 570, sl = 520;
  const sp = [[tipX - d[0] * sl, tipY - d[1] * sl], [tipX, tipY]];
  line(c, sp, 26, INK); line(c, sp, 14, COL.wood);
  shape(c, () => ell(c, tipX + 8, tipY + 8, 34, 20, 0.4), COL.wood, 5);
  const sw = [tipX - d[0] * 300 - d[0] * 70 * 1.9, tipY - d[1] * 300 - d[1] * 70 * 1.9];
  arm(c, sw[0], sw[1], an, 1.9, CLOTH.adult, 500);
  hand(c, sw[0], sw[1], an, 1.9, SKIN.adult, CLOTH.adult);
  arrow(c, [[430, 530], [470, 500], [540, 490], [640, 500], [690, 530]], RED, 10);
  c.restore();
  // a grown-up's other hand on the pan handle
  arm(c, 70, 680, 0, 1.7, CLOTH.adult, 200);
  hand(c, 70, 680, 0, 1.7, SKIN.adult, CLOTH.adult);
};

// card: setup.e2.2
const c_e2_2 = (c: Ctx) => {
  table(c, 0);
  // the paper with the test strokes
  shadow(c, 560, 1010, 440, 30);
  shape(c, () => rrect(c, 100, 440, 880, 580, 14), COL.paper, 6);
  const stroke = (pts: number[][], col: string) => { line(c, pts, 34, INK); line(c, pts, 24, col); };
  stroke([[200, 560], [330, 640], [250, 700], [420, 760]], COL.brown);
  stroke([[540, 560], [650, 650], [570, 710], [690, 790]], COL.blue);
  // the silicone tray with the two new crayons in it
  shadow(c, 560, 420, 450, 36);
  shape(c, () => rrect(c, 100, 50, 880, 350, 50), COL.purple, 6);
  shade(c, () => rrect(c, 100, 50, 880, 350, 50), "#6c4fa8", 0, 40, 0.5);
  for (const [x, col, dk] of [[160, COL.blue, COL.blueDk], [560, COL.brown, "#7c4a22"]] as [number, string, string][]) {
    shape(c, () => rrect(c, x, 120, 360, 210, 40), "#6c4fa8", 5);
    shape(c, () => rrect(c, x + 18, 140, 324, 170, 30), col, 5);
    shade(c, () => rrect(c, x + 18, 140, 324, 170, 30), dk, 0, 50, 0.6);
    if (x > 400) for (const [dx, cc] of [[80, COL.orange], [180, COL.red], [250, COL.yellow]] as [number, string][]) { c.beginPath(); ell(c, x + dx, 225, 30, 14, 0.4); c.fillStyle = cc; c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1; }
    shine(c, [[x + 50, 168], [x + 150, 168]], 9);
  }
  // a child's hand draws with the new blue crayon
  const an = 2.3, d = [Math.cos(an), Math.sin(an)], T = [690, 790], len = 340, s = 1.8;
  const back = [T[0] - d[0] * len, T[1] - d[1] * len], mid = [T[0] - d[0] * 190, T[1] - d[1] * 190];
  crayon(c, back[0], back[1], an, len, 74, COL.blue, COL.blueDk, 0);
  arm(c, mid[0] - d[0] * 70 * s, mid[1] - d[1] * 70 * s, an, s, CLOTH.child, 420);
  hand(c, mid[0] - d[0] * 70 * s, mid[1] - d[1] * 70 * s, an, s, SKIN.child, CLOTH.child);
};

// ------------------------------------------------------------ bags
const mouth = (c: Ctx, x: number, y: number, rx: number, col: string) => shape(c, () => ell(c, x, y, rx, rx * 0.2), col, 5);
// handles: loops above the bag, or straight up to a hand at `up`
const handles = (c: Ctx, lx: number, rx: number, y: number, col: string, wd: number, up?: number[]) => {
  const cl = up ? [[lx, y], [up[0], up[1]]] : [[lx, y], [lx + 14, y - 130], [lx + 70, y - 135], [lx + 90, y]];
  const cr = up ? [[rx, y], [up[0], up[1]]] : [[rx - 90, y], [rx - 70, y - 135], [rx - 14, y - 130], [rx, y]];
  for (const p of [cl, cr]) { line(c, p, wd + 8, INK); line(c, p, wd, col); }
};
// bags: bottom centre (x, yb), width w, height h
const bagNews = (c: Ctx, x: number, yb: number, w: number, h: number, up?: number[]) => {
  const l = x - w / 2, r = x + w / 2, t = yb - h;
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, 18);
  handles(c, l + w * 0.16, r - w * 0.16, t, COL.brown, 7, up);
  const body = () => { c.moveTo(l, t); c.lineTo(r, t); c.lineTo(r - 10, yb); c.lineTo(l + 10, yb); c.closePath(); };
  shape(c, body, "#e0dbcf", 6);
  c.save(); c.beginPath(); body(); c.clip();
  const rr = rnd(9);
  for (let yy = t + 50; yy < yb - 10; yy += 18) for (let xx = l + 14; xx < r - 14; xx += 30) line(c, [[xx, yy], [xx + 10 + rr() * 12, yy]], 5, COL.greyDk);
  line(c, [[x, t], [x, yb]], 3, COL.grey);
  c.fillStyle = "rgba(43,35,64,0.15)"; c.fillRect(x + w * 0.22, t, w, h);
  c.restore(); shape(c, body, "rgba(0,0,0,0)", 6);
  mouth(c, x, t, w / 2, "#a39e92");
};
const bagPlastic = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  const l = x - w / 2, r = x + w / 2, t = yb - h;
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, 18);
  handles(c, l + w * 0.12, r - w * 0.12, t, "rgba(235,242,248,0.9)", 14);
  const body = () => { c.moveTo(l, t); c.lineTo(r, t); c.quadraticCurveTo(r + 14, yb - h * 0.4, r - 12, yb); c.lineTo(l + 12, yb); c.quadraticCurveTo(l - 14, yb - h * 0.4, l, t); c.closePath(); };
  shape(c, body, "rgba(236,243,249,0.95)", 6);
  shade(c, body, COL.sky, w * 0.3, 0, 0.5);
  line(c, [[l + 30, t + 30], [l + 40, yb - 40]], 4, "rgba(127,166,200,0.7)"); line(c, [[l + 62, t + 20], [l + 74, yb - 60]], 4, "rgba(127,166,200,0.7)");
  shape(c, () => ell(c, x, yb - h * 0.45, w * 0.18, w * 0.18), COL.red, 4);
  shape(c, body, "rgba(0,0,0,0)", 6);
};
const bagShirt = (c: Ctx, x: number, yb: number, w: number, h: number, up?: number[]) => {
  const l = x - w / 2, r = x + w / 2, t = yb - h;
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, 18);
  handles(c, l + w * 0.14, r - w * 0.14, t, COL.teal, 18, up);
  const body = () => rrect(c, l, t, w, h, 14);
  shape(c, body, WHITE, 6);
  c.save(); c.beginPath(); body(); c.clip();
  for (let yy = t + 20; yy < yb; yy += 56) { c.fillStyle = COL.teal; c.fillRect(l, yy, w, 28); }
  c.fillStyle = "rgba(43,35,64,0.15)"; c.fillRect(x + w * 0.22, t, w, h);
  c.restore();
  for (let xx = l + 24; xx < r - 10; xx += 28) line(c, [[xx, yb - 24], [xx + 12, yb - 24]], 4, INK);
  shape(c, body, "rgba(0,0,0,0)", 6);
  mouth(c, x, t, w / 2 - 6, "#1f6e68");
};
const bagJhola = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  const l = x - w / 2, r = x + w / 2, t = yb - h;
  shadow(c, x + w * 0.1, yb + 6, w * 0.55, 18);
  const strap = [[l + w * 0.2, t], [l + w * 0.2, t - 150], [r - w * 0.2, t - 150], [r - w * 0.2, t]];
  line(c, strap, 26, INK); line(c, strap, 16, COL.orange);
  const body = () => rrect(c, l, t, w, h, 16);
  shape(c, body, COL.cloth, 6);
  shade(c, body, "#d9cfb8", w * 0.25, 0, 0.6);
  shape(c, () => ell(c, x, yb - h * 0.5, w * 0.24, w * 0.24), COL.orange, 5);
  shape(c, () => ell(c, x, yb - h * 0.5, w * 0.11, w * 0.11), COL.yellow, 4);
  for (let xx = l + 14; xx < r - 10; xx += 24) line(c, [[xx, t + 14], [xx + 10, t + 14]], 4, INK);
  line(c, [[l + 8, t + 40], [r - 8, t + 40]], 3, COL.greyDk);
};
// a full 1-litre bottle and an atta packet (the 1 kg weights)
const bottle = (c: Ctx, x: number, yb: number, h: number) => {
  const w = h * 0.36, nw = w * 0.36, sh = yb - h * 0.68;
  shadow(c, x + w * 0.12, yb + 5, w * 0.62, 10);
  const body = () => { c.moveTo(x - w / 2, yb); c.lineTo(x - w / 2, sh + 10); c.quadraticCurveTo(x - w / 2, sh, x - nw / 2, sh - h * 0.1); c.lineTo(x - nw / 2, yb - h * 0.95); c.lineTo(x + nw / 2, yb - h * 0.95); c.lineTo(x + nw / 2, sh - h * 0.1); c.quadraticCurveTo(x + w / 2, sh, x + w / 2, sh + 10); c.lineTo(x + w / 2, yb); c.closePath(); };
  shape(c, body, COL.water, 5); shade(c, body, COL.waterDk, w * 0.3, 0, 0.6);
  shape(c, () => rrect(c, x - w / 2, yb - h * 0.5, w, h * 0.22, 3), WHITE, 4);
  line(c, [[x - w * 0.35, yb - h * 0.39], [x - w * 0.12, yb - h * 0.43], [x + w * 0.12, yb - h * 0.35], [x + w * 0.35, yb - h * 0.39]], 4, COL.blue);
  shape(c, body, "rgba(0,0,0,0)", 5);
  shape(c, () => rrect(c, x - nw * 0.62, yb - h * 1.03, nw * 1.24, h * 0.1, 3), COL.blue, 4);
  shine(c, [[x - w * 0.32, yb - h * 0.62], [x - w * 0.32, yb - h * 0.55]], 5);
};
const atta = (c: Ctx, x: number, yb: number, w: number, h: number) => { shadow(c, x + w * 0.12, yb + 5, w * 0.6, 10); pillow(c, x, yb - h / 2, w, h, COL.orange, "wheat"); };

// card: setup.e3.0
const c_e3_0 = (c: Ctx) => {
  table(c, 660);
  bagNews(c, 140, 640, 210, 390);
  bagPlastic(c, 390, 640, 200, 390);
  bagShirt(c, 640, 640, 210, 370);
  bagJhola(c, 890, 640, 220, 360);
  for (let i = 0; i < 5; i++) bottle(c, 60 + i * 100, 1010, 300);
  for (let i = 0; i < 5; i++) atta(c, 585 + i * 98, 1010, 86, 170);
};

// card: setup.e3.1
const cushion = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 20, y + h * 0.5, w * 0.55, h * 0.18);
  const p = () => { c.moveTo(x - w / 2 + 40, y - h / 2); c.quadraticCurveTo(x, y - h / 2 - 20, x + w / 2 - 40, y - h / 2); c.quadraticCurveTo(x + w / 2 + 14, y, x + w / 2 - 40, y + h / 2); c.quadraticCurveTo(x, y + h / 2 + 20, x - w / 2 + 40, y + h / 2); c.quadraticCurveTo(x - w / 2 - 14, y, x - w / 2 + 40, y - h / 2); c.closePath(); };
  shape(c, p, COL.pink, 6); shade(c, p, "#d06a8c", 0, h * 0.28, 0.6);
  shape(c, () => ell(c, x, y, 14, 14), COL.purple, 4);
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) line(c, [[x + dx * 20, y + dy * 20], [x + dx * w * 0.3, y + dy * h * 0.3]], 4, "#d06a8c");
};
const c_e3_1 = (c: Ctx) => {
  table(c, 840);
  cushion(c, 540, 950, 740, 170);
  // a grown-up's hand holds the newspaper bag up over the cushion by its handles
  bottle(c, 580, 650, 380); // one already inside, neck showing over the rim
  bagNews(c, 470, 770, 400, 430, [250, 270]);
  arm(c, 250, 130, Math.PI / 2, 2, CLOTH.adult, 300);
  hand(c, 250, 130, Math.PI / 2, 2, SKIN.adult, CLOTH.adult);
  // the child's hand lowers one more bottle into it
  bottle(c, 600, 290, 340);
  arm(c, 600, 0, Math.PI / 2, 1.7, CLOTH.child, 300);
  hand(c, 600, 0, Math.PI / 2, 1.7, SKIN.child, CLOTH.child);
  arrow(c, [[790, 100], [790, 340]], RED, 14);
};

// card: setup.e3.2
const c_e3_2 = (c: Ctx) => {
  table(c, 900);
  cushion(c, 440, 975, 700, 150);
  // a grown-up lifts the full T-shirt bag; the child counts on raised fingers
  bottle(c, 340, 520, 230); bottle(c, 540, 520, 230); atta(c, 440, 500, 100, 150);
  bagShirt(c, 440, 770, 400, 330, [440, 260]);
  arm(c, 440, 100, Math.PI / 2, 2.2, CLOTH.adult, 300);
  hand(c, 440, 100, Math.PI / 2, 2.2, SKIN.adult, CLOTH.adult);
  arm(c, 920, 1000, -Math.PI / 2, 1.8, CLOTH.child, 300);
  hand(c, 920, 1000, -Math.PI / 2, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[110, 880], [110, 620]], RED, 14);
};

export const su_wasteReduceReuseRecycle = cards("sci.waste.reduce-reuse-recycle.L3 set-up", [c_e1_0, c_e1_1, c_e1_2, c_e2_0, c_e2_1, c_e2_2, c_e3_0, c_e3_1, c_e3_2]);
void BG; void polyP; void D;
