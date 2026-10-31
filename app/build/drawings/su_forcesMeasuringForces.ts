import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// MEASURING FORCES · set-up cards. Same objects in every card of an experiment: the teal notebook, the paper cup,
// gold coins, the blue forcemeter, the round-dial bathroom scale.

const TWINE = "#d9a441", FLOOR = "#e3d3b3", BOXC = "#c98f55", BOXT = "#e0ad72", BOXS = "#a9733f";

const room = (c: Ctx, floorY: number) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, floorY, 1080, 1080 - floorY); line(c, [[0, floorY], [1080, floorY]], 6); };
const twine = (c: Ctx, pts: number[][], w = 6) => { line(c, pts, w + 5, INK); line(c, pts, w, TWINE); };
const num = (c: Ctx, s: string, x: number, y: number, h: number, col: string = INK, w = 5) => write(c, s, x - ((s.length - 1) * 0.8 * h + 0.6 * h) / 2, y - h / 2, h, col, w);
const box3d = (c: Ctx, x: number, y: number, w: number, h: number, d: number, top: string, front: string, side: string) => {
  const dy = d * 0.7;
  shape(c, () => polyP(c, [[x + w, y], [x + w + d, y - dy], [x + w + d, y + h - dy], [x + w, y + h]]), side);
  shape(c, () => polyP(c, [[x, y], [x + d, y - dy], [x + w + d, y - dy], [x + w, y]]), top);
  shape(c, () => polyP(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]), front);
};
// a hand drawn by the direction it points in the picture (a = 0 right, down is positive); left-pointing hands are mirrored so the thumb stays up
const handW = (c: Ctx, x: number, y: number, a: number, s: number, o: { skin?: string; sleeve?: string; open?: boolean; under?: () => void } = {}) => {
  const flip = Math.cos(a) < -1e-6, an = flip ? Math.PI - a : a;
  if (o.under) { c.save(); c.translate(x, y); if (flip) c.scale(-1, 1); c.rotate(an); c.scale(s, s); o.under(); c.restore(); }
  c.save(); c.translate(x, y); if (flip) c.scale(-1, 1); hand(c, 0, 0, an, s, o.skin ?? SKIN.child, o.sleeve ?? CLOTH.child, o.open ?? false); c.restore();
};

// ---------------------------------------------------------------- the coin, the cup, the notebook, the table
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(3, r * 0.14));
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.3, 0.5);
  c.beginPath(); ell(c, x, y, r * 0.62, r * 0.62); c.strokeStyle = COL.orange; c.lineWidth = Math.max(2, r * 0.1); c.stroke();
};
const flatCoin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y + r * 0.22, r, r * 0.46), COL.orange, 4);
  shape(c, () => ell(c, x, y, r, r * 0.46), COL.yellow, 4);
};
const COIN_AT: number[][] = [[0, 0], [30, -2], [-30, -2], [14, -22], [-14, -22], [44, -22], [-44, -22], [0, -44], [30, -44]];
// the paper cup: rim centre (cx, top); n coins lie in it; the twine joint is 90 above the rim
const cup = (c: Ctx, cx: number, top: number, n: number) => {
  const wt = 58, wb = 40, h = 125;
  twine(c, [[cx, top - 90], [cx - wt + 5, top + 2]], 5); twine(c, [[cx, top - 90], [cx + wt - 5, top + 2]], 5);
  shape(c, () => ell(c, cx, top, wt, 16), "#cdbfa6", 5);
  for (let i = 0; i < n; i++) coin(c, cx + COIN_AT[i][0], top - 6 + COIN_AT[i][1] * 0.5, 17);
  const body = () => { c.moveTo(cx - wt, top); c.quadraticCurveTo(cx, top + 34, cx + wt, top); c.lineTo(cx + wb, top + h); c.lineTo(cx - wb, top + h); c.closePath(); };
  shape(c, body, WHITE);
  c.save(); c.beginPath(); body(); c.clip();
  for (const sx of [-34, 0, 34]) { c.beginPath(); polyP(c, [[cx + sx - 12, top], [cx + sx + 12, top], [cx + sx + 9, top + h], [cx + sx - 9, top + h]]); c.fillStyle = RED; c.fill(); }
  c.restore();
  shade(c, body, COL.steelDk, 34, 0, 0.45);
  shape(c, body, "rgba(0,0,0,0)", 6);
};
// a notebook lying on the table: front-left bottom corner at (x, bottom)
const notebook = (c: Ctx, x: number, bottom: number, w = 220, t = 36) => {
  const d = 44, dy = d * 0.7, y = bottom - t;
  box3d(c, x, y, w, t, d, COL.teal, "#fffaf0", "#e8dec8");
  shade(c, () => polyP(c, [[x, y], [x + d, y - dy], [x + w + d, y - dy], [x + w, y]]), COL.tealDk, 30, 0, 0.5);
  shape(c, () => polyP(c, [[x, y], [x + w, y], [x + w, y + 6], [x, y + 6]]), COL.teal, 4);
  shape(c, () => polyP(c, [[x, bottom - 6], [x + w, bottom - 6], [x + w, bottom], [x, bottom]]), COL.teal, 4);
  line(c, [[x + 6, y + t * 0.5], [x + w - 6, y + t * 0.5]], 2.5, COL.greyDk);
  shape(c, () => polyP(c, [[x + 70, y - 4], [x + 150, y - 4], [x + 180, y - 26], [x + 100, y - 26]]), WHITE, 4);
};
const tableE4 = (c: Ctx, tx: number, tw: number) => {
  shadow(c, tx + tw / 2 + 20, 936, tw / 2, 16);
  for (const lx of [tx + 30, tx + tw - 120]) { shape(c, () => rrect(c, lx, 636, 44, 296, 4), COL.brown); shade(c, () => rrect(c, lx, 636, 44, 296, 4), "#7a4f27", 14, 0, 0.5); }
  box3d(c, tx, 600, tw, 40, 46, COL.wood, COL.woodDk, "#b97f2a");
};
const tape = (c: Ctx, x: number, y0: number, y1: number) => shape(c, () => polyP(c, [[x - 34, y0], [x - 6, y0], [x - 6, y1], [x - 34, y1]]), "rgba(255,236,150,0.92)", 3);
const cushion = (c: Ctx, cx: number) => {
  shadow(c, cx + 14, 936, 135, 14);
  shape(c, () => ell(c, cx, 908, 125, 32), COL.pink);
  shade(c, () => ell(c, cx, 908, 125, 32), COL.purple, 30, 12, 0.35);
  shape(c, () => ell(c, cx, 906, 7, 5), COL.purple, 3);
};
type E4 = { tx: number; tw?: number; nx: number; stack?: boolean; third?: boolean; cupTop: number; coins: number };
// notebook(s) on the table, twine over the right edge, a paper cup hanging
const e4scene = (c: Ctx, o: E4) => {
  const bottom = 598, t = 36, xe = o.tx + (o.tw ?? 640), cx = xe + 22, w = 220;
  tableE4(c, o.tx, o.tw ?? 640);
  if (o.third) notebook(c, o.tx + 40, bottom);
  notebook(c, o.nx, bottom);
  if (o.stack) notebook(c, o.nx, bottom - t);
  const my = o.stack ? bottom - t : bottom - t / 2;
  tape(c, o.nx + w, o.stack ? bottom - 2 * t + 4 : bottom - t + 3, bottom - 3);
  twine(c, [[o.nx + w - 20, my], [xe + 10, my], [cx, my + 14], [cx, o.cupTop - 90]]);
  cup(c, cx, o.cupTop, o.coins);
  return cx;
};

// the table scenes are drawn in a 1080-wide world with the floor at 930; zoom them so they fill the card
const zoomed = (c: Ctx, z: number, x0: number, fn: () => void) => {
  room(c, 540 + (930 - 700) * z);
  c.save(); c.translate(540, 540); c.scale(z, z); c.translate(-x0, -700); fn(); c.restore();
};

// setup.e4.0
const s_e4_0 = (c: Ctx) => zoomed(c, 1.25, 495, () => { e4scene(c, { tx: 90, nx: 340, cupTop: 700, coins: 0 }); });

// setup.e4.1
const s_e4_1 = (c: Ctx) => zoomed(c, 1.25, 495, () => {
  const cx = e4scene(c, { tx: 90, nx: 340, cupTop: 700, coins: 2 });
  for (const [x, y] of [[190, 584], [226, 578], [162, 572], [202, 566], [244, 564], [178, 558]]) flatCoin(c, x, y, 22);
  cushion(c, cx);
  handW(c, cx + 65, 589, Math.atan2(0.71, -0.7), 1.1, { under: () => coin(c, 84, 0, 26) });
  arrow(c, [[cx - 95, 612], [cx - 95, 690]]);
});

// setup.e4.2
const s_e4_2 = (c: Ctx) => zoomed(c, 1.25, 495, () => {
  const cx = e4scene(c, { tx: 90, nx: 470, cupTop: 740, coins: 6 });
  cushion(c, cx);
  arrow(c, [[540, 512], [740, 512]]);
  for (const sx of [-1, 1]) line(c, [[cx + sx * 80, 700], [cx + sx * 80, 735]], 5);
  for (const y of [560, 576, 592]) line(c, [[385, y], [440, y]], 5);
});

// setup.e4.3
const s_e4_3 = (c: Ctx) => zoomed(c, 1.05, 535, () => {
  e4scene(c, { tx: 40, tw: 560, nx: 330, stack: true, third: true, cupTop: 700, coins: 0 });
  const wx = 900, wy = 800;
  handW(c, wx, wy, Math.PI, 1.5, { skin: SKIN.adult, sleeve: CLOTH.adult, open: true });
  for (const [dx, dy] of [[10, 0], [40, 0], [70, 0], [24, -26], [54, -26], [38, -52], [84, -4]]) coin(c, wx - dx * 1.5 - 16, wy - 72 + dy * 1.5, 18);
});

// ---------------------------------------------------------------- the forcemeter
// u runs down the instrument from its ring (0) to the hook, v across it; horiz lays it on its side with the ring on the right
const forcemeter = (c: Ctx, cx: number, cy: number, k: number, horiz: boolean) => {
  const P = (u: number, v: number): [number, number] => (horiz ? [cx - k * u, cy + k * v] : [cx + k * v, cy + k * u]);
  c.save(); c.translate(cx, cy); if (horiz) c.rotate(Math.PI / 2); c.scale(k, k);
  c.beginPath(); ell(c, 0, 0, 36, 36); c.strokeStyle = INK; c.lineWidth = 16; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 8; c.stroke();
  const cas = () => rrect(c, -64, 66, 128, 440, 22);
  shape(c, () => rrect(c, -30, 34, 60, 40, 8), COL.steel);
  shape(c, cas, COL.blue); shade(c, cas, COL.blueDk, 24, 0, 0.6);
  shape(c, () => rrect(c, -42, 92, 84, 392, 14), WHITE, 5);
  for (let i = 0; i <= 5; i++) { line(c, [[-38, 120 + i * 66], [-12, 120 + i * 66]], 4); if (i < 5) line(c, [[-38, 153 + i * 66], [-26, 153 + i * 66]], 3); }
  shape(c, () => rrect(c, -30, 502, 60, 28, 6), COL.steel);
  const hook = () => { c.beginPath(); c.moveTo(0, 528); c.lineTo(0, 592); c.bezierCurveTo(0, 646, 52, 646, 52, 598); c.lineTo(52, 584); };
  hook(); c.strokeStyle = INK; c.lineWidth = 17; c.lineCap = "round"; c.stroke(); hook(); c.strokeStyle = COL.steel; c.lineWidth = 8; c.stroke();
  line(c, [[-46, 120], [46, 120]], 15, INK); line(c, [[-46, 120], [46, 120]], 8, RED);
  c.restore();
  for (let i = 0; i <= 5; i++) { const [px, py] = P(120 + i * 66, 15); num(c, String(i), px, py, 34 * k, INK, 5 * k); }
};

// setup.e1.0
const s_e1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 600, 840, 120, 18);
  forcemeter(c, 560, 150, 1.0, false);
  const [px, py] = [560, 150 + 120];
  c.beginPath(); ell(c, px + 4, py, 86, 38); c.strokeStyle = RED; c.lineWidth = 7; c.stroke();
  handW(c, 560 - 100 * 0.9, 150 - 100 * 0.43, 0.45, 1.45);
};

// setup.e1.1
const s_e1_1 = (c: Ctx) => {
  ground(c);
  const dx = 70, dw = 430, dt = 190, dh = 600, hy = 490, hx = 285;
  shadow(c, dx + dw / 2 + 14, dt + dh + 60, dw / 2, 20);
  for (const lx of [dx + 20, dx + dw - 70]) shape(c, () => rrect(c, lx, dt + dh - 10, 50, 70, 6), COL.brown);
  shape(c, () => rrect(c, dx, dt, dw, dh, 12), COL.wood);
  shade(c, () => rrect(c, dx, dt, dw, dh, 12), COL.woodDk, 20, 20, 0.5);
  for (let i = 0; i < 3; i++) {
    const ty = dt + 24 + i * 190;
    shape(c, () => rrect(c, dx + 28, ty, dw - 56, 166, 8), COL.wood, 5);
    shape(c, () => rrect(c, dx + 44, ty + 16, dw - 88, 134, 6), COL.woodDk, 3);
    if (i !== 1) shape(c, () => rrect(c, hx - 30, ty + 70, 60, 14, 7), COL.steelDk, 4);
  }
  for (const sx of [-60, 60]) shape(c, () => rrect(c, hx + sx - 9, hy - 6, 18, 40, 4), COL.steelDk, 4);
  shape(c, () => rrect(c, hx - 90, hy - 18, 180, 28, 14), COL.steel);
  shine(c, hx - 70, hy - 11);
  twine(c, [[hx + 10, hy - 22], [555, hy - 22], [572, hy], [555, hy + 22], [hx + 10, hy + 22]], 5);
  forcemeter(c, 910, hy, 0.66, true);
  handW(c, 905, hy + 78, -Math.PI / 2, 1.2);
};
const shine = (c: Ctx, x: number, y: number) => line(c, [[x, y], [x + 70, y]], 5, "rgba(255,255,255,0.8)");

// setup.e1.3
const s_e1_3 = (c: Ctx) => {
  ground(c);
  const px = 170, py = 100, pw = 740, ph = 690;
  shadow(c, px + pw / 2 + 12, py + ph + 6, pw / 2, 16);
  shape(c, () => rrect(c, px, py, pw, ph, 14), COL.paper);
  const gx = 210, gy = 150, cw = [180, 240, 240], rh = 80, rows = 6;
  shape(c, () => polyP(c, [[gx, gy], [gx + 660, gy], [gx + 660, gy + rh], [gx, gy + rh]]), COL.sky, 5);
  for (let r = 0; r < rows; r++) shape(c, () => polyP(c, [[gx, gy + rh * (r + 1)], [gx + 660, gy + rh * (r + 1)], [gx + 660, gy + rh * (r + 2)], [gx, gy + rh * (r + 2)]]), COL.paper, 5);
  line(c, [[gx + cw[0], gy], [gx + cw[0], gy + rh * 7]], 5); line(c, [[gx + cw[0] + cw[1], gy], [gx + cw[0] + cw[1], gy + rh * 7]], 5);
  num(c, "1", gx + cw[0] + cw[1] / 2, gy + rh / 2, 44); num(c, "2", gx + cw[0] + cw[1] + cw[2] / 2, gy + rh / 2, 44);
  for (let r = 0; r < rows; r++) {
    const cy = gy + rh * (r + 1.5);
    arrow(c, [[gx + 22, cy], [gx + 62 + r * 18, cy]], RED, 8);
    if (r < 4) { num(c, String(r + 1), gx + cw[0] + cw[1] / 2, cy, 46); num(c, String(r + 1), gx + cw[0] + cw[1] + cw[2] / 2, cy, 46); }
  }
  const tipX = 535, tipY = 612, dir = [-0.6, -0.8], len = 190 * 1.3;
  handW(c, tipX - len * dir[0], tipY - len * dir[1], Math.atan2(dir[1], dir[0]), 1.3, {
    under: () => {
      shape(c, () => polyP(c, [[30, -9], [160, -9], [160, 9], [30, 9]]), COL.yellow, 5);
      shape(c, () => polyP(c, [[10, -9], [30, -9], [30, 9], [10, 9]]), COL.pink, 5);
      shape(c, () => polyP(c, [[160, -9], [160, 9], [192, 0]]), COL.wood, 4);
      shape(c, () => polyP(c, [[181, -3.5], [181, 3.5], [192, 0]]), INK, 2);
    },
  });
  num(c, "5", 510, 590, 46);
};

// ---------------------------------------------------------------- the bathroom scale, the table, the child
const dialAng = (v: number) => ((150 + (v / 80) * 240) * Math.PI) / 180;
const dial = (c: Ctx, cx: number, cy: number, r: number, v: number, ghost: number | null = null) => {
  shadow(c, cx + r * 0.1, cy + r * 1.0, r * 0.95, r * 0.1);
  shape(c, () => ell(c, cx, cy, r, r), COL.steel, 7);
  shape(c, () => ell(c, cx, cy, r * 0.87, r * 0.87), WHITE, 5);
  for (let t = 0; t <= 40; t++) {
    const a = dialAng(t * 2), big = t % 5 === 0, r0 = r * 0.8, r1 = r * (big ? 0.68 : 0.73);
    line(c, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], big ? 5 : 3);
  }
  for (const n of [0, 20, 40, 60, 80]) num(c, String(n), cx + Math.cos(dialAng(n)) * r * 0.5, cy + Math.sin(dialAng(n)) * r * 0.5, r * 0.19, INK, 4);
  if (ghost !== null) {
    const ga = dialAng(ghost);
    c.globalAlpha = 0.4; line(c, [[cx, cy], [cx + Math.cos(ga) * r * 0.74, cy + Math.sin(ga) * r * 0.74]], 12, COL.greyDk); c.globalAlpha = 1;
    const a0 = ga, a1 = dialAng(v), pts: number[][] = [];
    for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12; pts.push([cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3]); }
    arrow(c, pts, RED, 6);
  }
  const na = dialAng(v);
  line(c, [[cx, cy], [cx + Math.cos(na) * r * 0.76, cy + Math.sin(na) * r * 0.76]], 15, INK);
  line(c, [[cx, cy], [cx + Math.cos(na) * r * 0.76, cy + Math.sin(na) * r * 0.76]], 8, RED);
  shape(c, () => ell(c, cx, cy, r * 0.09, r * 0.09), INK, 0);
};
const bathScale = (c: Ctx, cx: number, y: number) => {
  shadow(c, cx + 18, y + 4, 128, 12);
  shape(c, () => rrect(c, cx - 110, y - 38, 220, 38, 10), COL.teal);
  shade(c, () => rrect(c, cx - 110, y - 38, 220, 38, 10), COL.tealDk, 30, 0, 0.6);
  line(c, [[cx - 90, y - 30], [cx + 90, y - 30]], 4, "rgba(255,255,255,0.6)");
};
const lead = (c: Ctx, dcx: number, dcy: number, r: number, sx: number, sy: number) => {
  line(c, [[dcx + r * 0.8, dcy - r * 0.6], [sx - 112, sy - 36]], 4); line(c, [[dcx + r * 0.8, dcy + r * 0.6], [sx - 112, sy - 2]], 4);
};
const strongTable = (c: Ctx) => {
  for (const lx of [448, 990]) { shape(c, () => rrect(c, lx, 576, 38, 324, 4), COL.brown); shade(c, () => rrect(c, lx, 576, 38, 324, 4), "#7a4f27", 14, 0, 0.5); }
  shape(c, () => rrect(c, 486, 800, 504, 22, 4), COL.brown);
  shape(c, () => rrect(c, 440, 536, 600, 40, 8), COL.wood);
  shade(c, () => rrect(c, 440, 536, 600, 40, 8), COL.woodDk, 0, 14, 0.55);
};
const KX = 620, KH = 600, KY = 862, KSHX = KX - 66, KSHY = KY - KH * 0.74 + KH * 0.03;
const reach = (sx: number, sy: number, tx: number, ty: number, bend: 1 | -1): [number, number] => {
  const l1 = KH * 0.17, l2 = KH * 0.16;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const m = l1 + l2 - 1;
  if (d > m) { dx *= m / d; dy *= m / d; d = m; }
  const base = Math.atan2(dy, dx), A = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), a1 = base + bend * A;
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};
// both arms to targets, then hands drawn at the wrists along the forearms
const armsTo = (c: Ctx, tl: number[], tr: number[], open: boolean, handAng?: number) => {
  const sxL = KX - KH * 0.11, sxR = KX + KH * 0.11, sy = KSHY;
  const al = reach(sxL, sy, tl[0], tl[1], tl[0] < sxL ? 1 : -1), ar = reach(sxR, sy, tr[0], tr[1], tr[0] < sxR ? 1 : -1);
  person(c, KX, KY, KH, { armL: al, armR: ar });
  for (const [t, a] of [[tl, al], [tr, ar]] as [number[], [number, number]][]) {
    const ex = (t === tl ? sxL : sxR) + Math.cos(a[0]) * KH * 0.17, ey = sy + Math.sin(a[0]) * KH * 0.17;
    handW(c, ex + Math.cos(a[1]) * KH * 0.16, ey + Math.sin(a[1]) * KH * 0.16, handAng ?? a[1], handAng === undefined ? 0.62 : 0.72, { open });
  }
};

// setup.e2.0
const s_e2_0 = (c: Ctx) => {
  room(c, 900); strongTable(c);
  dial(c, 190, 780, 125, 30); lead(c, 190, 780, 125, KX, 900);
  bathScale(c, KX, 900);
  person(c, KX, KY, KH);
  for (const sx of [KX - 66, KX + 66]) {
    const ex = sx + Math.cos(Math.PI * 0.55) * KH * 0.17, ey = KSHY + Math.sin(Math.PI * 0.55) * KH * 0.17;
    handW(c, ex + Math.cos(Math.PI * 0.5) * KH * 0.16, ey + Math.sin(Math.PI * 0.5) * KH * 0.16, Math.PI / 2, 0.62);
  }
};

// setup.e2.1
const s_e2_1 = (c: Ctx) => {
  room(c, 900); strongTable(c);
  dial(c, 190, 780, 125, 12, 30); lead(c, 190, 780, 125, KX, 900);
  bathScale(c, KX, 900);
  armsTo(c, [480, 484], [760, 484], true);
  arrow(c, [[400, 380], [400, 470]]); arrow(c, [[840, 380], [840, 470]]);
};

// setup.e2.2
const s_e2_2 = (c: Ctx) => {
  room(c, 900); strongTable(c);
  dial(c, 190, 780, 125, 52, 30); lead(c, 190, 780, 125, KX, 900);
  bathScale(c, KX, 900);
  armsTo(c, [520, 632], [720, 632], true, -Math.PI / 2);
  arrow(c, [[420, 700], [420, 620]]); arrow(c, [[820, 700], [820, 620]]);
};

// setup.e2.3
const s_e2_3 = (c: Ctx) => {
  room(c, 900);
  const x = 700, y = 862, h = 600;
  dial(c, 240, 700, 170, 58, 30); lead(c, 240, 700, 170, x, 900);
  bathScale(c, x, 900);
  // the child squatting, front view: knees out, body low
  const hip = y - h * 0.27, sh = hip - h * 0.32, head = h * 0.13, uw = h * 0.06;
  for (const s of [-1, 1]) { const k: number[][] = [[x + s * h * 0.05, hip], [x + s * h * 0.2, y - h * 0.14], [x + s * h * 0.075, y]]; line(c, k, h * 0.075, INK); line(c, k, h * 0.075 - 10, "#6b5a8c"); }
  const body = () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06);
  shape(c, body, CLOTH.child); shade(c, body, CLOTH.childDk, h * 0.07, 0);
  const l1 = h * 0.17, l2 = h * 0.16;
  for (const s of [-1, 1]) {
    const sx = x + s * h * 0.11, sy = sh + h * 0.03, a = reach(sx, sy, x + s * h * 0.17, hip + h * 0.03, s < 0 ? 1 : -1);
    const ex = sx + Math.cos(a[0]) * l1, ey = sy + Math.sin(a[0]) * l1, wx = ex + Math.cos(a[1]) * l2, wy = ey + Math.sin(a[1]) * l2;
    line(c, [[sx, sy], [ex, ey], [wx, wy]], uw + 10, INK); line(c, [[sx, sy], [ex, ey], [wx, wy]], uw, CLOTH.child);
    handW(c, wx, wy, a[1], 0.62);
  }
  const hy = sh - head * 1.05;
  shape(c, () => ell(c, x, hy, head, head * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + head * 0.95, hy - head * 0.2, head * 0.32, head * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, x - head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0); shape(c, () => ell(c, x + head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0);
  c.beginPath(); c.arc(x, hy + head * 0.38, head * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  arrow(c, [[900, 400], [900, 560]]);
};

// setup.e3.2
const s_e3_2 = (c: Ctx) => {
  room(c, 960);
  const x = 540, y = 960, h = 700, sxL = x - h * 0.11, sxR = x + h * 0.11, sy = y - h * 0.74 + h * 0.03;
  const tl = [300, 500], tr = [780, 500];
  const al = reach2(sxL, sy, tl, h, 1), ar = reach2(sxR, sy, tr, h, -1);
  shadow(c, x + 20, y + 8, 130, 12);
  person(c, x, y, h, { adult: true, armL: al, armR: ar });
  const bigW = 230, bigH = 180, bigD = 60, smW = 120, smH = 96, smD = 36, boxTop = 720;
  const cardboard = (bx: number, by: number, w: number, hh: number, d: number) => {
    box3d(c, bx, by, w, hh, d, BOXT, BOXC, BOXS);
    shape(c, () => polyP(c, [[bx + w / 2 - 9, by], [bx + w / 2 + 9, by], [bx + w / 2 + 9, by + hh], [bx + w / 2 - 9, by + hh]]), "rgba(255,236,150,0.85)", 3);
  };
  twine(c, [[tl[0], tl[1] + 77], [tl[0], boxTop]]); twine(c, [[tr[0], tr[1] + 77], [tr[0], boxTop]]);
  cardboard(tl[0] - (smW + smD) / 2, boxTop, smW, smH, smD);
  cardboard(tr[0] - (bigW + bigD) / 2, boxTop, bigW, bigH, bigD);
  for (const t of [tl, tr]) handW(c, t[0], t[1], Math.PI / 2, 1.1, { skin: SKIN.adult, sleeve: CLOTH.adult });
  shadow(c, tl[0] + 20, 966, 70, 10); shadow(c, tr[0] + 25, 966, 120, 12);
  arrow(c, [[150, 700], [150, 600]]); arrow(c, [[960, 700], [960, 600]]);
};
const reach2 = (sx: number, sy: number, t: number[], h: number, bend: 1 | -1): [number, number] => {
  const l1 = h * 0.17, l2 = h * 0.16;
  let dx = t[0] - sx, dy = t[1] - sy, d = Math.hypot(dx, dy); const m = l1 + l2 - 1;
  if (d > m) { dx *= m / d; dy *= m / d; d = m; }
  const base = Math.atan2(dy, dx), A = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), a1 = base + bend * A;
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};

export const su_forcesMeasuringForces = cards("sci.forces.measuring-forces.L3 set-up", [
  s_e4_0, s_e4_1, s_e4_2, s_e4_3, s_e1_0, s_e1_1, s_e1_3, s_e2_0, s_e2_1, s_e2_2, s_e2_3, s_e3_2,
]);
