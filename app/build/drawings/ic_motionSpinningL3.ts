import type { Ctx } from "./core";
import { INK, BG, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, cards } from "./flatKit";

// SPINNING (level 3) · flat cards for the activities, project, challenges, terms and explanations.
const TABLE = "#e6d3ae", CARD = "#cf9f62", CARDDK = "#a97b45", PINK = "#f29ab4";
const NONE = "rgba(255,255,255,0)";

const floor = (c: Ctx, y: number) => { ground(c); c.fillStyle = TABLE; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const ellPts = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 18) =>
  Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]; });
const dots = (c: Ctx, pts: number[][], col: string = COL.purple, w = 9) => { c.save(); c.setLineDash([1, w * 2.1]); line(c, pts, w, col); c.restore(); };
const dotEll = (c: Ctx, cx: number, cy: number, rx: number, ry: number, col: string = COL.purple, w = 9) => dots(c, ellPts(cx, cy, rx, ry, 0, Math.PI * 2, 90), col, w);

// ---- things
// a spinning top (bambaram): tip at (x, y), height about 420 * s, leaning by `lean` radians (clockwise)
const topShape = (c: Ctx, x: number, y: number, s: number, lean: number) => {
  const body = () => { c.moveTo(0, 0); c.bezierCurveTo(-40, -30, -150, -90, -150, -190); c.bezierCurveTo(-150, -290, -80, -320, 0, -320); c.bezierCurveTo(80, -320, 150, -290, 150, -190); c.bezierCurveTo(150, -90, 40, -30, 0, 0); c.closePath(); };
  c.save(); c.translate(x, y); c.rotate(lean); c.scale(s, s);
  shape(c, () => rrect(c, -15, -430, 30, 130, 10), COL.wood, 6);
  shade(c, () => rrect(c, -15, -430, 30, 130, 10), COL.woodDk, -9, 0, 0.7);
  shape(c, body, COL.red, 6);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = COL.yellow; c.fillRect(-160, -215, 320, 36); c.fillStyle = COL.teal; c.fillRect(-160, -275, 320, 30); c.fillStyle = COL.teal; c.fillRect(-160, -135, 320, 26);
  c.restore();
  shade(c, body, "#a8301f", -34, -10, 0.55);
  shape(c, body, NONE, 6);
  shine(c, [[-95, -210], [-80, -270]], 10);
  shape(c, () => polyP(c, [[-16, -34], [16, -34], [0, 4]]), COL.steel, 5);
  c.restore();
};
const topAt = (c: Ctx, x: number, y: number, s: number, lean: number) => { shadow(c, x + 36 * s, y + 8, 140 * s, 22 * s); topShape(c, x, y, s, lean); };
// where the handle's end is for a top standing at (x, y) leaning `lean`
const headOf = (x: number, y: number, s: number, lean: number): [number, number] => [x + Math.sin(lean) * 430 * s, y - Math.cos(lean) * 430 * s];

// a ceiling fan seen from the side
const fan = (c: Ctx, cx: number, top: number) => {
  shape(c, () => rrect(c, cx - 100, top, 200, 36, 10), COL.grey, 6);
  shape(c, () => rrect(c, cx - 11, top + 30, 22, 130, 6), COL.steel, 5);
  const bl = (x: number, y: number, rx: number, rot: number, col: string) => { shape(c, () => ell(c, x, y, rx, rx * 0.15, rot), col, 6); };
  bl(cx - 230, top + 232, 200, -0.04, COL.wood); bl(cx + 230, top + 232, 200, 0.04, COL.wood);
  shape(c, () => rrect(c, cx - 70, top + 150, 140, 100, 34), COL.steel, 6);
  shade(c, () => rrect(c, cx - 70, top + 150, 140, 100, 34), COL.steelDk, -20, -8, 0.6);
  bl(cx, top + 272, 85, 0, COL.woodDk);
};
// a wheel seen from the front: tyre, rim ring, spokes, hub. `hi` = which part is lit up in orange
const wheel = (c: Ctx, cx: number, cy: number, R: number, hi: "rim" | "hub" | "none") => {
  const rimC = hi === "rim" ? COL.orange : COL.steel, hubC = hi === "hub" ? COL.orange : COL.steelDk;
  shadow(c, cx + R * 0.1, cy + R + 8, R * 0.9, R * 0.1);
  shape(c, () => ell(c, cx, cy, R, R), COL.black, 6);
  shape(c, () => ell(c, cx, cy, R * 0.9, R * 0.9), rimC, 5);
  shape(c, () => ell(c, cx, cy, R * 0.8, R * 0.8), BG, 5);
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; line(c, [[cx + Math.cos(a) * R * 0.14, cy + Math.sin(a) * R * 0.14], [cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8]], 4, COL.greyDk); }
  shape(c, () => ell(c, cx, cy, R * 0.18, R * 0.18), hubC, 6);
  shape(c, () => ell(c, cx, cy, R * 0.06, R * 0.06), INK, 0);
};
// a coin on its edge: front face is an ellipse
const coinEdge = (c: Ctx, x: number, bottom: number, ry: number) => {
  const rx = ry * 0.5, cy = bottom - ry;
  shadow(c, x + 24, bottom + 4, rx * 1.6, 16);
  shape(c, () => ell(c, x + 14, cy, rx, ry), COL.steelDk, 6);
  shape(c, () => ell(c, x, cy, rx, ry), COL.steel, 6);
  shape(c, () => ell(c, x, cy, rx * 0.72, ry * 0.76), NONE, 3.5);
  shine(c, [[x - rx * 0.4, cy - ry * 0.4], [x - rx * 0.45, cy + ry * 0.1]], 8);
};
const pencil = (c: Ctx, x: number, y0: number, y1: number) => {
  shape(c, () => rrect(c, x - 18, y0, 36, 36, 10), COL.pink, 5);
  shape(c, () => c.rect(x - 18, y0 + 32, 36, 22), COL.steel, 5);
  shape(c, () => c.rect(x - 18, y0 + 54, 36, y1 - y0 - 54), COL.yellow, 5);
  shade(c, () => c.rect(x - 18, y0 + 54, 36, y1 - y0 - 54), COL.orange, -12, 0, 0.65);
  shape(c, () => polyP(c, [[x - 18, y1], [x + 18, y1], [x, y1 + 55]]), "#f4dcae", 5);
  shape(c, () => polyP(c, [[x - 6, y1 + 33], [x + 6, y1 + 33], [x, y1 + 55]]), COL.black, 3);
};
// a person seen from straight above: shoulders and the top of the head
const above = (c: Ctx, x: number, y: number, adult: boolean, rot: number, size = 1) => {
  const sk = adult ? SKIN.adult : SKIN.child, cl = adult ? CLOTH.adult : CLOTH.child, k = (adult ? 1.15 : 0.9) * size;
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
  shadow(c, 12, 14, 70, 44);
  shape(c, () => ell(c, 0, 0, 34, 70), cl, 6);
  shape(c, () => ell(c, 4, 0, 33, 33), sk, 5);
  c.save(); c.beginPath(); ell(c, 4, 0, 33, 33); c.clip(); shape(c, () => ell(c, -14, 0, 36, 40), CLOTH.hair, 0); c.restore();
  shape(c, () => ell(c, 4, 0, 33, 33), NONE, 5);
  shape(c, () => ell(c, 34, 0, 7, 8), sk, 3);
  c.restore();
};

// ---- flows
const flowE1 = (c: Ctx) => {
  ground(c);
  const disc = (cx: number, cy: number, R: number, dist: number) => {
    shadow(c, cx + 20, cy + 30, R, R);
    shape(c, () => ell(c, cx, cy, R, R), CARD, 7);
    shade(c, () => ell(c, cx, cy, R, R), CARDDK, -R * 0.1, -R * 0.1, 0.5);
    shape(c, () => ell(c, cx, cy, R, R), NONE, 7);
    [-Math.PI / 2, 0, Math.PI / 2, Math.PI].forEach((a) => {
      const x = cx + Math.cos(a) * dist, y = cy + Math.sin(a) * dist;
      shape(c, () => ell(c, x, y, 40, 40), COL.steel, 6); shade(c, () => ell(c, x, y, 40, 40), COL.steelDk, -9, -9, 0.6);
      shape(c, () => ell(c, x, y, 40, 40), NONE, 6); shape(c, () => ell(c, x, y, 29, 29), NONE, 3);
    });
    shape(c, () => ell(c, cx, cy, 15, 15), COL.pink, 4);
  };
  disc(285, 560, 235, 160); disc(795, 560, 235, 66);
  [285, 795].forEach((x) => arrow(c, ellPts(x, 560, 275, 275, -2.5, -0.65)));
};
const flowE2 = (c: Ctx) => {
  ground(c);
  const Q = (u: number, v: number, x0: number, x1: number) => [x0 + (x1 - x0) * u - 40 * v * (1 - 2 * u), 640 + 200 * v];
  // left: tiles
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) shape(c, () => polyP(c, [Q(i / 4, j / 2, 40, 500), Q((i + 1) / 4, j / 2, 40, 500), Q((i + 1) / 4, (j + 1) / 2, 40, 500), Q(i / 4, (j + 1) / 2, 40, 500)]), (i + j) % 2 ? "#cfe0e0" : "#f1e8d2", 4);
  // right: a folded towel
  shadow(c, 810, 870, 230, 26);
  shape(c, () => rrect(c, 580, 740, 460, 90, 26), COL.tealDk, 6);
  shape(c, () => rrect(c, 580, 640, 460, 130, 30), COL.teal, 6);
  line(c, [[620, 670], [1000, 670]], 8, "#ffffff"); line(c, [[620, 745], [1000, 745]], 8, "#ffffff");
  coinEdge(c, 270, 680, 250); coinEdge(c, 810, 660, 250);
  arrow(c, ellPts(270, 440, 190, 50, Math.PI * 0.92, Math.PI * 0.12));
  arrow(c, ellPts(810, 420, 190, 50, Math.PI * 0.92, Math.PI * 0.12));
};
const flowE3 = (c: Ctx) => {
  floor(c, 800);
  [["#5b8fd6", 470], ["#e4523b", 550], ["#6aa53f", 630]].forEach(([col, y]) => shape(c, () => rrect(c, 70, y as number, 240, 80, 8), col as string, 6));
  c.save(); c.translate(80, 470); c.rotate(0.3);
  shape(c, () => polyP(c, [[0, 0], [1000, 0], [1000, 40], [0, 40]]), COL.steel, 6);
  const R = 90;
  // ring (tape roll) behind, solid disc ahead
  shape(c, () => ell(c, 280, -R, R, R), COL.yellow, 6); shade(c, () => ell(c, 280, -R, R, R), COL.orange, -20, -20, 0.55);
  shape(c, () => ell(c, 280, -R, R, R), NONE, 6); shape(c, () => ell(c, 280, -R, 58, 58), BG, 6);
  shape(c, () => ell(c, 660, -R, R, R), COL.red, 6); shade(c, () => ell(c, 660, -R, R, R), "#a8301f", -20, -20, 0.55);
  shape(c, () => ell(c, 660, -R, R, R), NONE, 6); shape(c, () => ell(c, 660, -R, 22, 22), COL.steel, 5);
  [[40, -130], [60, -80]].forEach(([x, y]) => line(c, [[x, y], [x + 90, y]], 6, COL.grey));
  [[380, -150], [400, -100], [420, -50]].forEach(([x, y]) => line(c, [[x, y], [x + 150, y]], 6, COL.grey));
  arrow(c, [[200, -300], [640, -300]]);
  c.restore();
};
const flowA1 = (c: Ctx) => {
  ground(c);
  fan(c, 730, 80);
  dots(c, [[730, 110], [730, 470]]);
  arrow(c, ellPts(730, 380, 270, 55, Math.PI * 0.9, Math.PI * 0.1));
  topAt(c, 270, 800, 1.05, 0);
  dots(c, [[270, 820], [270, 340]]);
  arrow(c, ellPts(270, 640, 190, 38, Math.PI * 0.85, Math.PI * 0.15));
};
const flowA2 = (c: Ctx) => {
  floor(c, 880);
  const x = 470, y = 880, L = 0.34, len = 400;
  shadow(c, x + 60, y + 14, 260, 28);
  c.save(); c.translate(x, y); c.rotate(L);
  pencil(c, 0, -len - 40, -90);
  shape(c, () => { c.moveTo(-260, -140); c.lineTo(-260, -112); c.ellipse(0, -112, 260, 70, 0, Math.PI, 0, true); c.lineTo(260, -140); c.closePath(); }, CARDDK, 6);
  shape(c, () => ell(c, 0, -140, 260, 70), CARD, 6);
  shade(c, () => ell(c, 0, -140, 260, 70), CARDDK, -40, -12, 0.45);
  shape(c, () => ell(c, 0, -140, 260, 70), NONE, 6);
  c.restore();
  const hx = x + Math.sin(L) * (len + 40), hy = y - Math.cos(L) * (len + 40), cx = x, cy = hy + (hx - x) * 0.0;
  dotEll(c, cx, cy, hx - x, (hx - x) * 0.3);
  arrow(c, ellPts(cx, cy, hx - x + 40, (hx - x + 40) * 0.3, Math.PI * 0.05, Math.PI * 0.6));
  arrow(c, ellPts(x, 630, 300, 46, Math.PI * 0.9, Math.PI * 0.12));
};
const flowA3 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, R = 300, a = -0.6;
  dotEll(c, cx, cy, R, R);
  const px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R;
  line(c, [[cx, cy], [px, py]], 34, INK); line(c, [[cx, cy], [px, py]], 22, PINK);
  line(c, [[cx, cy], [px, py]], 5, "#ffffff");
  above(c, cx, cy, true, a + Math.PI / 2, 1.7); above(c, px, py, false, a + Math.PI / 2 + Math.PI, 1.7);
  arrow(c, ellPts(cx, cy, R, R, a + 0.4, a + 1.2));
  arrow(c, ellPts(cx, cy, 120, 120, 0.9, 2.3), RED, 8);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  const lid = (x: number, y: number, r: number, ghost: boolean) => {
    c.save(); c.globalAlpha = ghost ? 0.5 : 1;
    shape(c, () => ell(c, x, y, r, r), COL.steel, 6); shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.2, -r * 0.2, 0.55);
    shape(c, () => ell(c, x, y, r, r), NONE, 6); shape(c, () => ell(c, x, y, r * 0.75, r * 0.75), NONE, 3.5);
    shape(c, () => rrect(c, x - 11, y + r - 30, 22, 30, 3), COL.yellow, 4);
    c.restore();
  };
  const row = (r: number, gy: number, dx: number) => {
    shape(c, () => c.rect(60, gy, 960, 30), "#fffaf0", 5);
    lid(140, gy - r, r, true); lid(140 + dx, gy - r, r, false);
    line(c, [[140, gy + 60], [140, gy + 90]], 6); line(c, [[140 + dx, gy + 60], [140 + dx, gy + 90]], 6);
    arrow(c, [[140, gy + 75], [140 + dx - 8, gy + 75]]);
  };
  row(65, 330, 408); row(115, 760, 723);
};
const flowA5 = (c: Ctx) => {
  floor(c, 800);
  const R = 130, cy = 800 - R, axle = (x: number, y: number) => { shape(c, () => ell(c, x, y, 20, 20), COL.black, 4); };
  shadow(c, 300, 806, R * 0.9, 12);
  shape(c, () => ell(c, 280, cy, R, R), CARD, 6); shade(c, () => ell(c, 280, cy, R, R), CARDDK, -25, -25, 0.5); shape(c, () => ell(c, 280, cy, R, R), NONE, 6);
  dots(c, [[90, cy], [500, cy]]); axle(c, 280, cy);
  // square: flat (ghost) and tipped on a corner
  const sq = (x: number, y: number, rot: number, ghost: boolean) => {
    c.save(); c.globalAlpha = ghost ? 0.45 : 1; c.translate(x, y); c.rotate(rot);
    shape(c, () => rrect(c, -R, -R, R * 2, R * 2, 4), COL.blue, 6); shade(c, () => rrect(c, -R, -R, R * 2, R * 2, 4), COL.blueDk, -25, -25, 0.5);
    shape(c, () => rrect(c, -R, -R, R * 2, R * 2, 4), NONE, 6);
    c.restore();
  };
  shadow(c, 830, 806, R * 0.9, 12);
  sq(780, 800 - R, 0, true); sq(850, 800 - R * Math.SQRT2, Math.PI / 4, false);
  dots(c, [[620, cy], [1030, cy]]);
  axle(c, 850, 800 - R * Math.SQRT2);
  arrow(c, [[960, cy - 4], [960, 800 - R * Math.SQRT2 + 40]], RED, 8);
};
const flowP1 = (c: Ctx) => {
  floor(c, 900);
  const cx = 540, top = 340;
  // bottle base
  shadow(c, cx + 30, 905, 150, 20);
  shape(c, () => { c.moveTo(cx - 120, 900); c.lineTo(cx - 120, 700); c.quadraticCurveTo(cx - 120, 640, cx - 40, 620); c.lineTo(cx - 40, 570); c.lineTo(cx + 40, 570); c.lineTo(cx + 40, 620); c.quadraticCurveTo(cx + 120, 640, cx + 120, 700); c.lineTo(cx + 120, 900); c.closePath(); }, COL.glass, 6);
  shape(c, () => { c.moveTo(cx - 118, 900); c.lineTo(cx - 118, 780); c.quadraticCurveTo(cx, 800, cx + 118, 780); c.lineTo(cx + 118, 900); c.closePath(); }, "#e2c98a", 0);
  shape(c, () => { c.moveTo(cx - 120, 900); c.lineTo(cx - 120, 700); c.quadraticCurveTo(cx - 120, 640, cx - 40, 620); c.lineTo(cx - 40, 570); c.lineTo(cx + 40, 570); c.lineTo(cx + 40, 620); c.quadraticCurveTo(cx + 120, 640, cx + 120, 700); c.lineTo(cx + 120, 900); c.closePath(); }, NONE, 6);
  shape(c, () => rrect(c, cx - 14, top - 60, 28, 640, 8), COL.yellow, 6);
  // the plate
  const seats: [number, number][] = [];
  for (let k = 0; k < 4; k++) { const t = (k / 4) * Math.PI * 2 + 0.6; seats.push([cx + Math.cos(t) * 300, top + Math.sin(t) * 70, ] as [number, number]); }
  const swing = (px: number, py: number) => {
    const dx = (px - cx) * 0.3, sx = px + dx, sy = py + 260;
    line(c, [[px, py], [sx, sy]], 5);
    shape(c, () => polyP(c, [[sx - 42, sy], [sx + 42, sy], [sx + 30, sy + 56], [sx - 30, sy + 56]]), COL.pink, 5);
  };
  const order = seats.map((p, i) => ({ p, i, d: p[1] })).sort((a, b) => a.d - b.d);
  order.filter((o) => o.d < top).forEach((o) => swing(o.p[0], o.p[1]));
  shadow(c, cx + 30, top + 20, 300, 70);
  shape(c, () => { c.moveTo(cx - 300, top); c.lineTo(cx - 300, top + 14); c.ellipse(cx, top + 14, 300, 70, 0, Math.PI, 0, true); c.lineTo(cx + 300, top); c.closePath(); }, CARDDK, 6);
  shape(c, () => ell(c, cx, top, 300, 70), CARD, 6); shade(c, () => ell(c, cx, top, 300, 70), CARDDK, -40, -10, 0.45); shape(c, () => ell(c, cx, top, 300, 70), NONE, 6);
  shape(c, () => ell(c, cx, top, 16, 6), COL.black, 0);
  order.filter((o) => o.d >= top).forEach((o) => swing(o.p[0], o.p[1]));
  arrow(c, ellPts(cx, top - 20, 360, 95, Math.PI * 0.85, Math.PI * 0.25));
};
const cd = (c: Ctx, cx: number, cy: number, rx: number, ry: number) => {
  shape(c, () => ell(c, cx, cy, rx, ry), "#dfe5ec", 6);
  c.save(); c.beginPath(); ell(c, cx, cy, rx, ry); c.clip();
  ["#f29ab4", "#ffd34d", "#9ccf62", "#8fc3ea"].forEach((col, i) => { c.globalAlpha = 0.5; c.fillStyle = col; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, rx * 1.2, i * 1.57 + 0.3, i * 1.57 + 1.2); c.lineTo(cx, cy); c.fill(); });
  c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, cx, cy, rx, ry), NONE, 6);
  shape(c, () => ell(c, cx, cy, rx * 0.2, ry * 0.2), BG, 5);
};
const flowC1 = (c: Ctx) => {
  floor(c, 820);
  // a CD spinning on a marble, on a steel plate
  shadow(c, 420, 840, 300, 40);
  shape(c, () => ell(c, 400, 820, 280, 50), COL.steel, 6); shape(c, () => ell(c, 400, 816, 230, 38), COL.steelIn, 4);
  shape(c, () => ell(c, 400, 770, 45, 45), COL.blue, 6); shade(c, () => ell(c, 400, 770, 45, 45), COL.blueDk, -10, -10, 0.55); shape(c, () => ell(c, 400, 770, 45, 45), NONE, 6); shine(c, [[382, 756], [392, 744]], 8);
  cd(c, 400, 690, 280, 66);
  arrow(c, ellPts(400, 600, 330, 80, Math.PI * 0.95, Math.PI * 0.1));
  // stopwatch
  const sx = 850, sy = 520, r = 140;
  shadow(c, sx + 20, sy + r + 20, r, 20);
  shape(c, () => rrect(c, sx - 24, sy - r - 40, 48, 36, 8), COL.steelDk, 5);
  shape(c, () => ell(c, sx, sy, r, r), "#ffffff", 7);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[sx + Math.cos(a) * r * 0.78, sy + Math.sin(a) * r * 0.78], [sx + Math.cos(a) * r * 0.92, sy + Math.sin(a) * r * 0.92]], 5); }
  line(c, [[sx, sy], [sx + r * 0.5, sy - r * 0.5]], 9, RED); shape(c, () => ell(c, sx, sy, 11, 11), INK, 0);
};
const flowC2 = (c: Ctx) => {
  ground(c);
  const cx = 600, cy = 400, R = 250, cols = [COL.red, COL.yellow, COL.blue, COL.green], dk = ["#a8301f", COL.orange, COL.blueDk, COL.greenDk];
  shape(c, () => rrect(c, cx - 14, cy, 28, 560, 8), COL.wood, 6);
  shadow(c, cx + 20, 960, 130, 20);
  const P = (k: number, r: number): [number, number] => { const a = (k * 90 + 45) * Math.PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  for (let k = 0; k < 4; k++) {
    const p = P(k, R), q = P(k + 1, R), m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], n = P(k + 1, R * 0.45);
    shape(c, () => polyP(c, [[cx, cy], p, m]), cols[k], 6);
    shape(c, () => polyP(c, [[cx, cy], m, n]), dk[k], 6);
  }
  shape(c, () => ell(c, cx, cy, 20, 20), COL.steel, 5); shape(c, () => ell(c, cx, cy, 6, 6), INK, 0);
  for (let i = 0; i < 3; i++) arrow(c, [[60, 330 + i * 80], [250, 330 + i * 80]], COL.blueDk, 8);
  arrow(c, ellPts(cx, cy, R + 50, R + 50, -0.9, 0.4));
};

// ---- terms
const termSpin = (c: Ctx) => {
  ground(c);
  fan(c, 540, 220);
  arrow(c, ellPts(540, 640, 400, 80, Math.PI * 0.9, Math.PI * 0.1));
};
const termAxis = (c: Ctx) => {
  floor(c, 900);
  topAt(c, 540, 900, 1.5, 0);
  dots(c, [[540, 925], [540, 160]], COL.purple, 11);
  arrow(c, ellPts(540, 640, 270, 55, Math.PI * 0.85, Math.PI * 0.15));
};
const termAxle = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 850, 450, 30);
  shape(c, () => rrect(c, 240, 505, 600, 56, 10), COL.orange, 6);
  shade(c, () => rrect(c, 240, 505, 600, 56, 10), "#c9762a", 0, -16, 0.5);
  const w = (x: number) => {
    shape(c, () => ell(c, x + 26, 540, 105, 280), COL.black, 6);
    shape(c, () => ell(c, x, 540, 105, 280), COL.black, 6);
    shape(c, () => ell(c, x, 540, 84, 228), COL.steel, 5);
    shape(c, () => ell(c, x, 540, 62, 170), BG, 4);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * 12, 540 + Math.sin(a) * 30], [x + Math.cos(a) * 62, 540 + Math.sin(a) * 170]], 4, COL.greyDk); }
    shape(c, () => ell(c, x, 540, 26, 52), COL.steelDk, 5);
  };
  w(180); w(900);
  shape(c, () => rrect(c, 180, 520, 720, 44, 8), COL.orange, 6);
  shade(c, () => rrect(c, 180, 520, 720, 44, 8), "#c9762a", 0, -14, 0.5);
  [180, 900].forEach((x) => shape(c, () => ell(c, x, 542, 26, 52), COL.steelDk, 5));
  [180, 900].forEach((x) => shape(c, () => ell(c, x, 542, 12, 22), COL.orange, 4));
  arrow(c, ellPts(900, 540, 150, 320, -1.1, 1.1, 10));
};
const termRim = (c: Ctx) => { ground(c); wheel(c, 540, 520, 380, "rim"); arrow(c, [[905, 905], [830, 780]]); };
const termHub = (c: Ctx) => { ground(c); wheel(c, 540, 520, 380, "hub"); arrow(c, [[860, 860], [600, 590]]); };
const termFriction = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#c9b79a"; c.fillRect(0, 700, 1080, 380);
  const r = ((s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296))(5);
  c.beginPath(); c.moveTo(0, 700); for (let x = 0; x <= 1080; x += 30) c.lineTo(x, 700 + (x % 60 ? 14 : -10)); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); c.fillStyle = "#c9b79a"; c.fill(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  for (let i = 0; i < 40; i++) { shape(c, () => ell(c, 20 + r() * 1040, 760 + r() * 290, 7, 5), "#a89678", 3); }
  shape(c, () => polyP(c, [[330, -10], [750, -10], [600, 480], [545, 700], [490, 480]]), COL.red, 6);
  shade(c, () => polyP(c, [[330, -10], [750, -10], [600, 480], [545, 700], [490, 480]]), "#a8301f", -40, 0, 0.55);
  shape(c, () => polyP(c, [[500, 560], [590, 560], [545, 705]]), COL.steel, 5);
  arrow(c, [[690, 650], [850, 650]]); arrow(c, [[400, 780], [240, 780]]);
  [[440, 700], [520, 725], [610, 725], [680, 700]].forEach(([x, y]) => line(c, [[x, y], [x - 16, y - 34]], 6, COL.orange));
};
const termPrecession = (c: Ctx) => {
  floor(c, 900);
  const x = 520, L = 0.3, s = 1.2;
  topAt(c, x, 900, s, L);
  const [hx, hy] = headOf(x, 900, s, L), rx = hx - x;
  dotEll(c, x, hy, rx, rx * 0.3, COL.purple, 10);
  arrow(c, ellPts(x, hy, rx + 40, (rx + 40) * 0.3, Math.PI * 0.05, Math.PI * 0.7));
};
const termWobble = (c: Ctx) => {
  floor(c, 900);
  const x = 380, L = 0.75, s = 1.1;
  topAt(c, x, 900, s, L);
  const [hx, hy] = headOf(x, 900, s, L);
  const pts: number[][] = [];
  for (let i = 0; i <= 60; i++) { const t = (i / 60) * Math.PI * 2, k = 1 + 0.18 * Math.sin(t * 4); pts.push([x + 40 + Math.cos(t) * (hx - x) * 1.1 * k, hy + Math.sin(t) * 80 * k]); }
  dots(c, pts, COL.purple, 10);
  arrow(c, ellPts(x + 40, hy, (hx - x) * 1.1 + 45, 125, Math.PI * 0.1, Math.PI * 0.55));
};
const termGyro = (c: Ctx) => {
  floor(c, 900);
  const cx = 540, cy = 470, R = 290;
  shadow(c, cx + 20, 905, 190, 24);
  shape(c, () => polyP(c, [[cx - 150, 900], [cx + 150, 900], [cx + 28, 745], [cx - 28, 745]]), COL.steel, 6);
  shade(c, () => polyP(c, [[cx - 150, 900], [cx + 150, 900], [cx + 28, 745], [cx - 28, 745]]), COL.steelDk, -30, 0, 0.6);
  shape(c, () => ell(c, cx, cy, R, R), COL.steel, 8);
  shape(c, () => ell(c, cx, cy, R - 34, R - 34), BG, 6);
  line(c, [[cx - R + 20, cy], [cx + R - 20, cy]], 22, INK); line(c, [[cx - R + 20, cy], [cx + R - 20, cy]], 12, COL.steelDk);
  shape(c, () => ell(c, cx, cy, 78, 215), COL.red, 6); shade(c, () => ell(c, cx, cy, 78, 215), "#a8301f", -22, -10, 0.55);
  shape(c, () => ell(c, cx, cy, 78, 215), NONE, 6); shape(c, () => ell(c, cx, cy, 36, 150), NONE, 4);
  shape(c, () => ell(c, cx, cy, 22, 36), COL.yellow, 5);
  arrow(c, ellPts(cx, cy, 190, 250, -0.9, 0.9, 10));
};
const termFlywheel = (c: Ctx) => {
  floor(c, 900);
  const cx = 540, cy = 470, R = 300;
  shadow(c, cx + 30, 905, 400, 24);
  shape(c, () => polyP(c, [[cx - 250, 900], [cx - 190, 900], [cx + 10, cy], [cx - 40, cy]]), COL.brown, 6);
  shape(c, () => polyP(c, [[cx + 250, 900], [cx + 190, 900], [cx - 10, cy], [cx + 40, cy]]), COL.brown, 6);
  shape(c, () => rrect(c, cx - 290, 860, 580, 42, 10), COL.woodDk, 6);
  shape(c, () => ell(c, cx, cy, R, R), COL.greyDk, 7);
  shade(c, () => ell(c, cx, cy, R, R), "#555", -30, -30, 0.5);
  shape(c, () => ell(c, cx, cy, R, R), NONE, 7);
  shape(c, () => ell(c, cx, cy, R - 75, R - 75), BG, 7);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + 0.2; line(c, [[cx, cy], [cx + Math.cos(a) * (R - 75), cy + Math.sin(a) * (R - 75)]], 22, INK); line(c, [[cx, cy], [cx + Math.cos(a) * (R - 75), cy + Math.sin(a) * (R - 75)]], 11, COL.greyDk); }
  shape(c, () => ell(c, cx, cy, 52, 52), COL.steelDk, 6);
  line(c, [[cx, cy], [cx + 130, cy + 150]], 26, INK); line(c, [[cx, cy], [cx + 130, cy + 150]], 14, COL.orange);
  shape(c, () => rrect(c, cx + 100, cy + 140, 30, 80, 12), COL.wood, 5);
  arrow(c, ellPts(cx, cy, R + 50, R + 50, -2.4, -0.7));
};
// a carousel horse, body centred on the pole at x; y is the top of its head level
const horse = (c: Ctx, x: number, y: number) => {
  const leg = (dx: number, dy: number, bend: number) => { const p = [[x + dx, y + 170], [x + dx + bend, y + 230], [x + dx + bend, y + 270 + dy]]; line(c, p, 34, INK); line(c, p, 20, COL.cloth); };
  leg(-70, 0, -14); leg(-30, 10, 8); leg(40, 0, -6); leg(80, 10, 14);
  line(c, [[x - 105, y + 120], [x - 150, y + 160], [x - 140, y + 240]], 26, INK); line(c, [[x - 105, y + 120], [x - 150, y + 160], [x - 140, y + 240]], 14, COL.orange);
  shape(c, () => polyP(c, [[x + 50, y + 140], [x + 90, y + 40], [x + 150, y + 30], [x + 120, y + 150]]), COL.cloth, 6);
  shape(c, () => ell(c, x, y + 140, 125, 62), COL.cloth, 6);
  shade(c, () => ell(c, x, y + 140, 125, 62), "#d9d2bd", -24, -14, 0.6);
  shape(c, () => ell(c, x + 160, y + 40, 62, 32, 0.5), COL.cloth, 6);
  shape(c, () => polyP(c, [[x + 100, y + 38], [x + 108, y - 5], [x + 128, y + 30]]), COL.cloth, 5);
  line(c, [[x + 60, y + 130], [x + 100, y + 40], [x + 115, y + 28]], 14, COL.orange);
  shape(c, () => ell(c, x + 172, y + 36, 6, 6), INK, 0);
  shape(c, () => rrect(c, x + 30, y + 90, 14, 70, 4), COL.red, 4);
  line(c, [[x, y - 90], [x, y + 330]], 22, INK); line(c, [[x, y - 90], [x, y + 330]], 10, COL.yellow);
};
const termMerry = (c: Ctx) => {
  ground(c);
  const cx = 540;
  shape(c, () => { c.moveTo(cx - 440, 830); c.lineTo(cx - 440, 860); c.ellipse(cx, 860, 440, 100, 0, Math.PI, 0, true); c.lineTo(cx + 440, 830); c.closePath(); }, COL.brown, 6);
  shape(c, () => ell(c, cx, 830, 440, 100), COL.wood, 6);
  shape(c, () => rrect(c, cx - 15, 240, 30, 600, 6), COL.yellow, 6);
  shape(c, () => polyP(c, [[cx - 470, 330], [cx, 130], [cx + 470, 330]]), COL.red, 6);
  shape(c, () => polyP(c, [[cx, 130], [cx + 470, 330], [cx + 200, 330]]), COL.yellow, 6);
  horse(c, cx - 250, 420); horse(c, cx + 250, 480);
  arrow(c, ellPts(cx, 900, 460, 105, Math.PI * 0.95, Math.PI * 0.2));
};

// ---- explanations
const explStillFalls = (c: Ctx) => {
  floor(c, 880);
  topAt(c, 270, 880, 1.0, 0.16);
  shadow(c, 800, 884, 250, 22);
  topShape(c, 640, 770, 0.8, Math.PI / 2 - 0.08);
  arrow(c, ellPts(300, 780, 300, 300, -1.2, -0.3, 12));
};
const explSpinStays = (c: Ctx) => {
  floor(c, 900);
  topAt(c, 540, 900, 1.5, 0);
  arrow(c, ellPts(540, 650, 280, 56, Math.PI * 0.86, Math.PI * 0.14));
  arrow(c, ellPts(540, 400, 220, 44, Math.PI * 0.86, Math.PI * 0.14));
};
const explWeightEdge = (c: Ctx) => {
  ground(c);
  const mk = (cx: number, heavyRim: boolean) => {
    const cy = 520, R = 220;
    shadow(c, cx + 20, cy + R + 20, R * 0.8, 20);
    shape(c, () => ell(c, cx, cy, R, R), heavyRim ? COL.greyDk : COL.steel, 7);
    shape(c, () => ell(c, cx, cy, heavyRim ? R - 62 : R - 18, heavyRim ? R - 62 : R - 18), BG, 6);
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + 0.3, rr = heavyRim ? R - 62 : R - 18; line(c, [[cx, cy], [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]], 8, COL.greyDk); }
    shape(c, () => ell(c, cx, cy, heavyRim ? 28 : 78, heavyRim ? 28 : 78), heavyRim ? COL.steel : COL.greyDk, 6);
    arrow(c, ellPts(cx, cy, R + 45, R + 45, -2.3, -0.8));
  };
  mk(285, true); mk(795, false);
};
const explWheelsRound = (c: Ctx) => {
  floor(c, 800);
  const R = 120;
  dots(c, [[40, 800 - R], [1040, 800 - R]], COL.purple, 9);
  [190, 540, 890].forEach((x, i) => {
    c.save(); c.globalAlpha = i === 2 ? 1 : 0.5;
    shadow(c, x + 20, 806, R * 0.9, 12);
    shape(c, () => ell(c, x, 800 - R, R, R), CARD, 6); shade(c, () => ell(c, x, 800 - R, R, R), CARDDK, -22, -22, 0.5); shape(c, () => ell(c, x, 800 - R, R, R), NONE, 6);
    for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2 + i * 1.2; line(c, [[x, 800 - R], [x + Math.cos(a) * R * 0.75, 800 - R + Math.sin(a) * R * 0.75]], 5, CARDDK); }
    shape(c, () => ell(c, x, 800 - R, 14, 14), COL.black, 4);
    c.restore();
  });
  arrow(c, [[250, 330], [830, 330]]);
};
const explOutsideFast = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 560, R = 440;
  shadow(c, cx + 20, cy + 30, R, R);
  shape(c, () => ell(c, cx, cy, R, R), COL.wood, 7);
  shape(c, () => ell(c, cx, cy, R * 0.75, R * 0.75), NONE, 3);
  shape(c, () => ell(c, cx, cy, R * 0.4, R * 0.4), NONE, 3);
  dots(c, [[cx, cy], [cx, cy - R + 70]], COL.purple, 8);
  shape(c, () => ell(c, cx, cy, 30, 30), COL.yellow, 6);
  above(c, cx, cy - 150, false, 0, 1.5); above(c, cx, cy - 345, false, 0, 1.5);
  arrow(c, ellPts(cx, cy, 150, 150, -Math.PI / 2 + 0.25, -Math.PI / 2 + 0.95, 8), RED, 10);
  arrow(c, ellPts(cx, cy, 345, 345, -Math.PI / 2 + 0.2, -Math.PI / 2 + 0.95, 14), RED, 10);
};

export const ic_motionSpinningL3 = cards("sci.motion.spinning.L3 cards", [
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, flowC1, flowC2,
  termSpin, termAxis, termAxle, termRim, termHub, termFriction, termPrecession, termWobble, termGyro, termFlywheel, termMerry,
  explStillFalls, explSpinStays, explWeightEdge, explWheelsRound, explOutsideFast,
]);
