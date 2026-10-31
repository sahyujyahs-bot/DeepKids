import type { Ctx } from "./core";
import {
  INK, BG, WHITE, RED, COL, SKIN, CLOTH, D, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow,
  glass, bowl, plate, write, cards, hand,
} from "./flatKit";

// MATERIALS AND THEIR PROPERTIES · set-up cards for experiments e1 (bend), e2 (flex), e3 (strength),
// e4 (absorb), e5 (light through). Same flat look as moongFlat: bold ink, flat colours, shade side, soft shadow.

// ---------------------------------------------------------------- shared pieces
const WOODTAB = "#c98f52", WOODTABDK = "#a87038";
// a stick-like thing drawn as a thick line: ink outline, then colour
const stick = (c: Ctx, pts: number[][], w: number, col: string) => { line(c, pts, w + 10, INK); line(c, pts, w, col); };
const at = (c: Ctx, x: number, y: number, rot: number, fn: () => void) => { c.save(); c.translate(x, y); c.rotate(rot); fn(); c.restore(); };
const curve = (p0: number[], p1: number[], p2: number[], n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; });

// a hand with a long sleeve running off the card (so it is never a floating hand). an = direction the
// fingers point on the card; mirror = a right hand coming from the right side
const arm = (c: Ctx, x: number, y: number, an: number, s: number, mirror = false, open = false, sleeve: string = CLOTH.child, skin: string = SKIN.child) => {
  const ang = mirror ? Math.PI - an : an;
  c.save();
  if (mirror) { c.translate(x, 0); c.scale(-1, 1); c.translate(-x, 0); }
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s); shape(c, () => rrect(c, -1500, -31, 1450, 62, 8), sleeve, 6); c.restore();
  hand(c, x, y, ang, s, skin, sleeve, open);
  c.restore();
};

// paper strip, hanging from y0 to y1 at x, width w; tight = narrower and straight
const paperStrip = (c: Ctx, x: number, y0: number, y1: number, w: number) => {
  shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 3), "#fffdf6", 6);
  shade(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 3), "#d9d2bf", w * 0.62, 0, 0.7);
  for (let y = y0 + 40; y < y1 - 20; y += 52) line(c, [[x - w / 2 + 8, y], [x + w / 2 - 8, y]], 2.5, "#c9c1ac");
  shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 3), "rgba(0,0,0,0)", 6);
};
const pencil = (c: Ctx, x: number, y: number, len: number) => {
  const h = 34;
  shape(c, () => rrect(c, x - len / 2, y - h / 2, len - 40, h, 4), COL.yellow, 6);
  shade(c, () => rrect(c, x - len / 2, y - h / 2, len - 40, h, 4), COL.orange, 0, 10, 0.6);
  shape(c, () => polyP(c, [[x + len / 2 - 40, y - h / 2], [x + len / 2, y], [x + len / 2 - 40, y + h / 2]]), "#f1d6a8", 6);
  shape(c, () => polyP(c, [[x + len / 2 - 14, y - 5], [x + len / 2, y], [x + len / 2 - 14, y + 5]]), INK, 0);
  shape(c, () => rrect(c, x - len / 2 - 22, y - h / 2, 28, h, 6), COL.pink, 6);
};
// a plastic carry bag hanging from handles over a pencil at (x, y): body below, handles up, water 0..1
const bag = (c: Ctx, x: number, y: number, w: number, h: number, water = 0) => {
  const body = () => { c.moveTo(x - w * 0.4, y + 10); c.lineTo(x + w * 0.4, y + 10); c.quadraticCurveTo(x + w * 0.56, y + h * 0.5, x + w * 0.5, y + h); c.lineTo(x - w * 0.5, y + h); c.quadraticCurveTo(x - w * 0.56, y + h * 0.5, x - w * 0.4, y + 10); c.closePath(); };
  [-1, 1].forEach((s) => { line(c, [[x + s * w * 0.3, y + 14], [x + s * w * 0.22, y - 2], [x + s * w * 0.1, y - 10]], 16, INK); line(c, [[x + s * w * 0.3, y + 14], [x + s * w * 0.22, y - 2], [x + s * w * 0.1, y - 10]], 7, "#dceaf2"); });
  shape(c, body, "rgba(205,228,240,0.9)", 6);
  if (water > 0) { c.save(); c.beginPath(); body(); c.clip(); const wy = y + h - (h - 30) * water; c.fillStyle = COL.water; c.fillRect(x - w, wy, w * 2, h); c.fillStyle = COL.drop; c.beginPath(); ell(c, x, wy, w * 0.52, 12); c.fill(); c.restore(); shape(c, body, "rgba(0,0,0,0)", 6); }
  shine(c, [[x - w * 0.3, y + 50], [x - w * 0.34, y + h * 0.7]], 9);
  line(c, [[x - w * 0.15, y + 20], [x - w * 0.1, y + h * 0.45]], 3, "rgba(43,35,64,0.25)");
};
const bucket = (c: Ctx, x: number, yBase: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, yBase + 4, w * 0.62, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, yBase - h); c.lineTo(x + w / 2, yBase - h); c.lineTo(x + w * 0.38, yBase); c.lineTo(x - w * 0.38, yBase); c.closePath(); };
  shape(c, body, COL.red); shade(c, body, "#b83a28", w * 0.34, 0, 0.7);
  shape(c, () => ell(c, x, yBase - h, w / 2, w * 0.1), "#7a2a20", 6);
  shape(c, () => ell(c, x, yBase - h + 3, w * 0.45, w * 0.07), "#3a3540", 0);
  shine(c, [[x - w * 0.36, yBase - h + 40], [x - w * 0.3, yBase - 30]], 9);
};
const chair = (c: Ctx, backX: number, dir: number) => {
  const seatY = 600, top = 300, floor = 920, L = 210;
  shadow(c, backX + dir * L * 0.4, floor + 8, L * 0.6, 20);
  const leg = (x: number) => { shape(c, () => rrect(c, x - 11, seatY, 22, floor - seatY, 5), COL.woodDk, 6); };
  leg(backX + dir * 8); leg(backX + dir * (L - 20));
  shape(c, () => rrect(c, backX - 12, top, 24, seatY - top + 8, 6), COL.wood, 6);
  shade(c, () => rrect(c, backX - 12, top, 24, seatY - top + 8, 6), COL.woodDk, 9, 0, 0.7);
  shape(c, () => rrect(c, Math.min(backX, backX + dir * L) - 10, seatY - 8, L + 20, 36, 8), COL.wood, 6);
  shade(c, () => rrect(c, Math.min(backX, backX + dir * L) - 10, seatY - 8, L + 20, 36, 8), COL.woodDk, 0, 14, 0.6);
};
const torchBody = (c: Ctx, x: number, y: number) => {
  // torch lying on the table, lens facing right, centre line at y; head ends at x + 240
  shadow(c, x + 130, y + 60, 190, 14);
  shape(c, () => rrect(c, x, y - 48, 190, 96, 22), COL.red);
  shade(c, () => rrect(c, x, y - 48, 190, 96, 22), "#b83a28", 0, 22, 0.7);
  shape(c, () => rrect(c, x + 60, y - 70, 24, 14, 5), COL.yellow, 5);
  shape(c, () => polyP(c, [[x + 190, y - 48], [x + 245, y - 60], [x + 245, y + 60], [x + 190, y + 48]]), COL.steel);
  shade(c, () => polyP(c, [[x + 190, y - 48], [x + 245, y - 60], [x + 245, y + 60], [x + 190, y + 48]]), COL.steelDk, 0, 26, 0.7);
  shape(c, () => ell(c, x + 245, y, 14, 60), "#fff7c8", 6);
};

// ---------------------------------------------------------------- the three test icons of e1
const SNAP = 0, BENT = 1, SPRING = 2;
const testIcon = (c: Ctx, kind: number, cx: number, cy: number, s: number) => {
  const wood = COL.wood;
  if (kind === SNAP) {
    stick(c, [[cx - 95 * s, cy + 30 * s], [cx - 20 * s, cy + 5 * s], [cx - 8 * s, cy - 8 * s]], 22 * s, wood);
    stick(c, [[cx + 18 * s, cy + 10 * s], [cx + 30 * s, cy - 6 * s], [cx + 100 * s, cy - 36 * s]], 22 * s, wood);
    [[-1, -1], [0, -1.5], [1, -1]].forEach(([a, b]) => line(c, [[cx + 4 * s + a * 14 * s, cy - 40 * s + b * 4 * s], [cx + 4 * s + a * 30 * s, cy - 58 * s + b * 6 * s]], 6, RED));
  } else if (kind === BENT) {
    stick(c, [[cx - 100 * s, cy + 40 * s], [cx - 10 * s, cy + 40 * s], [cx + 52 * s, cy - 40 * s]], 22 * s, wood);
  } else {
    line(c, [[cx - 100 * s, cy + 30 * s], [cx + 100 * s, cy + 30 * s]], 5, "rgba(43,35,64,0.35)");
    stick(c, curve([cx - 100 * s, cy + 30 * s], [cx, cy - 60 * s], [cx + 100 * s, cy + 30 * s]), 22 * s, wood);
    arrow(c, curve([cx + 10 * s, cy - 56 * s], [cx + 90 * s, cy - 60 * s], [cx + 86 * s, cy + 6 * s], 12), RED, 8);
  }
};
const paperTag = (c: Ctx, cx: number, cy: number, w: number, h: number, kind: number) => {
  shadow(c, cx + 12, cy + h / 2 + 6, w * 0.5, 14);
  shape(c, () => rrect(c, cx - w / 2, cy - h / 2, w, h, 14), "#fffdf6", 6);
  shade(c, () => rrect(c, cx - w / 2, cy - h / 2, w, h, 14), "#e4dccb", w * 0.7, 0, 0.8);
  shape(c, () => ell(c, cx - w / 2 + 24, cy - h / 2 + 24, 8, 8), BG, 4);
  testIcon(c, kind, cx, cy + 6, w / 290);
};

// ---------------------------------------------------------------- the eight things of e1
const spaghetti = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, () => { [-12, 0, 12].forEach((o, i) => stick(c, [[-len / 2, o + i * 2], [len / 2, o - i * 3]], 9, "#f2d58e")); });
const chalk = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, () => { shape(c, () => rrect(c, -len / 2, -22, len, 44, 14), "#fbfbf4"); shade(c, () => rrect(c, -len / 2, -22, len, 44, 14), "#cfcfc4", 0, 14, 0.7); });
const iceStick = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, () => { shape(c, () => rrect(c, -len / 2, -22, len, 44, 22), COL.wood); shade(c, () => rrect(c, -len / 2, -22, len, 44, 22), COL.woodDk, 0, 14, 0.6); line(c, [[-len * 0.3, -4], [len * 0.2, -4]], 3, COL.woodDk); });
const ruler = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, () => {
  shape(c, () => rrect(c, -len / 2, -28, len, 56, 6), "rgba(147,200,236,0.95)");
  for (let i = 0; i <= 10; i++) line(c, [[-len / 2 + 14 + i * ((len - 28) / 10), -28], [-len / 2 + 14 + i * ((len - 28) / 10), i % 5 === 0 ? -8 : -17]], 3);
  shine(c, [[-len / 2 + 20, 16], [len / 2 - 20, 16]], 6);
});
const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number) => Array.from({ length: 9 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 8; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
const CLIPW = [[-25, -6], [25, -6], ...arcPts(25, 7, 13, -Math.PI / 2, Math.PI / 2), [-45, 20], ...arcPts(-45, -1, 21, Math.PI / 2, (Math.PI * 3) / 2), [40, -22], ...arcPts(40, -7, 15, -Math.PI / 2, Math.PI / 2), [-15, 8]];
const clip = (c: Ctx, x: number, y: number, s: number, rot: number, bent = false) => at(c, x, y, rot, () => {
  const P = CLIPW.map(([a, b]) => (bent && a > 0 ? [Math.cos(-1.5) * a - Math.sin(-1.5) * b, Math.sin(-1.5) * a + Math.cos(-1.5) * b] : [a, b])).map(([a, b]) => [a * s, b * s]);
  line(c, P, 14 * s, INK); line(c, P, 6 * s, COL.steelDk);
});
const foil = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, () => {
  const top: number[][] = [], bot: number[][] = [];
  for (let i = 0; i <= 12; i++) { top.push([-len / 2 + (i * len) / 12, -20 + Math.sin(i * 1.7) * 5]); bot.push([-len / 2 + (i * len) / 12, 22 + Math.sin(i * 1.7 + 1) * 5]); }
  const p = () => polyP(c, [...top, ...bot.reverse()]);
  shape(c, p, "#e6eaf0"); shade(c, p, COL.steelDk, 0, 16, 0.7); shine(c, [[-len * 0.4, -8], [-len * 0.1, -6]], 6);
});
const plasticine = (c: Ctx, x: number, y: number, r: number) => {
  const p = () => { c.moveTo(x - r, y + r * 0.2); c.bezierCurveTo(x - r, y - r * 0.8, x + r * 0.5, y - r * 0.9, x + r, y - r * 0.1); c.bezierCurveTo(x + r * 1.1, y + r * 0.5, x + r * 0.3, y + r * 0.6, x - r, y + r * 0.2); c.closePath(); };
  shadow(c, x + 10, y + r * 0.5, r * 1.05, r * 0.22);
  shape(c, p, COL.purple); shade(c, p, "#6a4ea8", r * 0.4, r * 0.35, 0.7);
};
const band = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); c.beginPath(); ell(c, x, y, rx, ry); c.strokeStyle = COL.orange; c.lineWidth = 12; c.stroke(); };

// ---------------------------------------------------------------- the side-on desk of e2
const EDGE = 500, TOPY = 640;
const desk = (c: Ctx) => {
  c.fillStyle = "#e6d8bd"; c.fillRect(-300, 960, 2400, 900); line(c, [[-300, 960], [2000, 960]], 5);
  shadow(c, 300, 968, 340, 16);
  shape(c, () => rrect(c, 40, TOPY, EDGE + 60 - 40, 50, 8), WOODTAB, 6);
  shade(c, () => rrect(c, 40, TOPY, EDGE + 60 - 40, 50, 8), WOODTABDK, 0, 24, 0.6);
  shape(c, () => rrect(c, 80, TOPY + 50, 36, 270, 6), WOODTAB, 6);
  shape(c, () => rrect(c, EDGE - 40, TOPY + 50, 36, 270, 6), WOODTAB, 6);
  shade(c, () => rrect(c, EDGE - 40, TOPY + 50, 36, 270, 6), WOODTABDK, 14, 0, 0.7);
};
const bigBook = (c: Ctx, x: number, y: number, w: number) => {
  // y = bottom, resting on the strip
  shape(c, () => rrect(c, x, y - 130, w, 130, 6), COL.cloth, 6);
  for (let k = 1; k < 5; k++) line(c, [[x + 28, y - 130 + k * 22], [x + w - 8, y - 130 + k * 22]], 2, "#c9c1ac");
  shape(c, () => rrect(c, x - 4, y - 136, w + 8, 22, 6), COL.blue, 6);
  shape(c, () => rrect(c, x - 4, y - 22, w + 8, 22, 6), COL.blue, 6);
  shape(c, () => rrect(c, x - 4, y - 136, 28, 136, 8), COL.blueDk, 6);
  shade(c, () => rrect(c, x - 4, y - 136, w + 8, 136, 8), COL.blueDk, 0, 0, 0);
};
const coin = (c: Ctx, x: number, y: number, rot: number) => at(c, x, y, rot, () => {
  shape(c, () => rrect(c, -44, -18, 88, 18, 6), COL.orange, 5);
  shape(c, () => ell(c, 0, -18, 44, 11), COL.yellow, 5);
  shape(c, () => rrect(c, -18, -34, 36, 40, 2), "rgba(255,244,190,0.75)", 4);
});

// ---------------------------------------------------------------- cards
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  const xs = [140, 410, 680, 950];
  spaghetti(c, xs[0], 150, 240, -0.08); chalk(c, xs[1], 150, 230, 0.12); iceStick(c, xs[2], 150, 240, -0.1); ruler(c, xs[3] - 10, 150, 240, 0.06);
  clip(c, xs[0], 400, 1.9, 0.1); foil(c, xs[1], 400, 250, -0.05); plasticine(c, xs[2], 410, 105); band(c, xs[3] - 10, 400, 100, 60);
  [SNAP, BENT, SPRING].forEach((k, i) => paperTag(c, 200 + i * 340, 790, 290, 270, k));
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 770, 330, 24);
  const body = () => rrect(c, 250, 320, 590, 440, 36);
  shape(c, body, "rgba(214,236,250,0.6)", 6);
  shape(c, () => rrect(c, 250, 320, 590, 36, 12), "rgba(255,255,255,0.7)", 5);
  line(c, [[300, 338], [790, 338]], 4, COL.glassEdge);
  stick(c, curve([310, 580], [545, 290], [780, 580], 30), 16, "#f2d58e");
  shape(c, body, "rgba(214,236,250,0.22)", 6);
  shine(c, [[290, 420], [290, 680]], 9);
  arm(c, 100, 580, 0, 1.8); arm(c, 990, 580, Math.PI, 1.8, true);
  arrow(c, [[130, 400], [240, 440]], RED, 14); arrow(c, [[960, 400], [850, 440]], RED, 14);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  [190, 540, 890].forEach((x, i) => {
    shape(c, () => rrect(c, x - 160, 70, 320, 880, 22), "#fffaf0", 6);
    shade(c, () => rrect(c, x - 160, 70, 320, 880, 22), "#e4dccb", 250, 0, 0.7);
    testIcon(c, [SNAP, BENT, SPRING][i], x, 250, 1.0);
    line(c, [[x - 110, 400], [x + 110, 400]], 4, "rgba(43,35,64,0.3)");
  });
  // snapped spaghetti: three pieces
  spaghetti(c, 190, 560, 150, 0.5); spaghetti(c, 175, 700, 130, -0.35); spaghetti(c, 210, 830, 110, 0.15);
  // bent paper clip
  clip(c, 548, 720, 2.9, 0.2, true);
  // flat straight ruler
  shadow(c, 905, 720, 130, 18);
  ruler(c, 890, 700, 270, 0);
};
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c); c.save(); c.translate(-108, -330); c.scale(1.3, 1.3);
  desk(c);
  const tip = EDGE + 340;
  shape(c, () => rrect(c, 130, TOPY - 14, tip - 130, 14, 3), "#e5c995", 5);
  bigBook(c, 150, TOPY - 14, 280);
  coin(c, tip - 52, TOPY - 14, 0);
  // 10 cm overhang
  line(c, [[EDGE + 56, 740], [tip, 740]], 5, RED); line(c, [[EDGE + 56, 722], [EDGE + 56, 758]], 5, RED); line(c, [[tip, 722], [tip, 758]], 5, RED);
  write(c, "10 cm", EDGE + 120, 775, 56, INK, 8);
  c.restore();
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c); c.save(); c.translate(-125, -220); c.scale(1.1, 1.1);
  desk(c);
  shape(c, () => rrect(c, 130, TOPY - 14, EDGE + 56 - 130, 14, 3), "#e5c995", 5);
  bigBook(c, 150, TOPY - 14, 280);
  const droop = curve([EDGE + 40, TOPY - 7], [EDGE + 210, TOPY - 7], [EDGE + 300, TOPY + 158], 24);
  stick(c, droop, 12, "#e5c995");
  coin(c, EDGE + 300, TOPY + 150, 1.0);
  // upright ruler, 0 level with the table top
  const rx = 915;
  shape(c, () => rrect(c, rx - 48, TOPY - 60, 96, 420, 6), "rgba(147,200,236,0.97)");
  for (let k = 0; k <= 6; k++) {
    const y = TOPY - 7 + k * 50; line(c, [[rx - 48, y], [rx - 8, y]], 4); line(c, [[rx - 48, y + 25], [rx - 26, y + 25]], 3);
    if (k <= 4) write(c, String(k), rx - 2, y - 14, 30, INK, 5);
  }
  line(c, [[EDGE + 315, TOPY - 7], [rx - 52, TOPY - 7]], 3, "rgba(43,35,64,0.4)");
  arrow(c, [[EDGE + 370, TOPY + 20], [EDGE + 370, TOPY + 140]], RED, 9);
  line(c, [[EDGE + 335, TOPY + 158], [rx - 48, TOPY + 158]], 5, RED);
  arm(c, rx + 105, 930, Math.PI, 1.5, true);
  c.restore();
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  const base = 800, heights = [480, 390, 310, 230, 150, 70];
  const fills = ["#f7f3e8", "#fffdf6", "rgba(214,236,250,0.9)", "#e5c995", "#d4a860", "#c28a45"];
  const bars = [COL.teal, COL.teal, COL.teal, COL.teal, COL.teal, COL.teal];
  heights.forEach((h, i) => {
    const x = 90 + i * 150;
    shape(c, () => rrect(c, x, base - h, 100, h, 8), bars[i]);
    shade(c, () => rrect(c, x, base - h, 100, h, 8), COL.tealDk, 38, 0, 0.8);
    // small strip icon under each bar, drooping by the same amount
    shape(c, () => rrect(c, x - 10, 880, 120, 16, 3), fills[i], 5);
    stick(c, curve([x + 100, 888], [x + 120, 888], [x + 126, 888 + h * 0.12], 8), 10, fills[i]);
    if (i === 0) { for (let k = 0; k < 6; k++) line(c, [[x - 4 + k * 20, 881], [x + 4 + k * 20, 895]], 2.5, "#c9b27c"); }
    if (i === 4 || i === 5) { for (let k = 0; k < 5; k++) line(c, [[x + k * 24, 881], [x + 12 + k * 24, 895]], 2.5, COL.brown); }
  });
  line(c, [[60, base + 4], [1030, base + 4]], 6);
  arrow(c, [[60, 330], [60, 560]], RED, 10);
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d8bd"; c.fillRect(0, 920, D, 160); line(c, [[0, 920], [D, 920]], 5);
  chair(c, 250, -1); chair(c, 830, 1);
  shape(c, () => rrect(c, 100, 272, 880, 28, 14), COL.brown, 6);
  shade(c, () => rrect(c, 100, 272, 880, 28, 14), "#80522a", 0, 14, 0.7);
  paperStrip(c, 540, 300, 540, 100);
  pencil(c, 540, 540, 240);
  bag(c, 540, 544, 270, 200, 0);
  bucket(c, 540, 920, 240, 130);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 40, D + 40, 30, 15), COL.brown, 6);
  shade(c, () => rrect(c, -20, 40, D + 40, 30, 15), "#80522a", 0, 14, 0.7);
  paperStrip(c, 460, 70, 330, 84);
  pencil(c, 460, 330, 230);
  bag(c, 460, 334, 290, 360, 0.42);
  bucket(c, 460, 1000, 250, 180);
  // the cup pouring: tilted steel tumbler held by a hand
  const cx = 790, cy = 250, ph = -0.9, K = 1.4;
  at(c, cx, cy, ph, () => {
    c.scale(K, K);
    const b = () => { c.moveTo(-60, -70); c.lineTo(60, -70); c.lineTo(46, 70); c.lineTo(-46, 70); c.closePath(); };
    shape(c, b, COL.steel); shade(c, b, COL.steelDk, 26, 0, 0.7);
    shape(c, () => ell(c, 0, -70, 60, 14), COL.steelIn, 5);
    shape(c, () => ell(c, 0, -68, 44, 8), COL.water, 0);
  });
  const cs = Math.cos(ph), sn = Math.sin(ph), lipX = cx + K * (-60 * cs - -70 * sn), lipY = cy + K * (-60 * sn + -70 * cs);
  const stream = curve([lipX, lipY + 6], [lipX - 70, lipY + 8], [440, 400], 20);
  line(c, stream, 26, INK); line(c, stream, 14, COL.water);
  arm(c, cx + 70 * 1.9 * -Math.cos(Math.PI + ph), cy - 70 * 1.9 * Math.sin(Math.PI + ph), Math.PI + ph, 1.9, true);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 40, D + 40, 30, 15), COL.brown, 6);
  shade(c, () => rrect(c, -20, 40, D + 40, 30, 15), "#80522a", 0, 14, 0.7);
  paperStrip(c, 480, 70, 960, 250);
  // the damp patch
  c.save(); c.beginPath(); rrect(c, 480 - 125, 70, 250, 890, 3); c.clip();
  c.beginPath(); c.moveTo(380, 470); c.bezierCurveTo(380, 380, 580, 370, 590, 470); c.bezierCurveTo(600, 560, 400, 580, 380, 470); c.fillStyle = "rgba(95,150,200,0.55)"; c.fill();
  c.beginPath(); c.moveTo(395, 470); c.bezierCurveTo(400, 400, 570, 395, 575, 470); c.bezierCurveTo(580, 540, 410, 550, 395, 470); c.fillStyle = "rgba(60,100,160,0.4)"; c.fill();
  c.restore();
  shape(c, () => rrect(c, 480 - 125, 70, 250, 890, 3), "rgba(0,0,0,0)", 6);
  // a wet fingertip touching the strip
  arm(c, 720, 640, Math.PI + 0.6, 1.8, true, true);
  dropShape(c, 572, 580, 15);
};

// ---------------------------------------------------------------- e4: six surfaces
type Kind = "towel" | "cloth" | "news" | "paper" | "butter" | "plastic";
const surface = (c: Ctx, x: number, y: number, w: number, h: number, rot: number, kind: Kind) => at(c, x, y, rot, () => {
  const R = () => rrect(c, -w / 2, -h / 2, w, h, 10);
  const fill = { towel: "#fbf7ee", cloth: "#f0e4c8", news: "#e3e0d8", paper: "#ffffff", butter: "#f3e6bd", plastic: "rgba(190,222,240,0.92)" }[kind];
  shadow(c, 14, h / 2 + 4, w * 0.5, 16);
  shape(c, R, fill, 6);
  c.save(); c.beginPath(); R(); c.clip();
  if (kind === "towel") { c.fillStyle = "#d8d2c2"; for (let i = -w / 2 + 20; i < w / 2; i += 26) for (let j = -h / 2 + 18; j < h / 2; j += 26) { c.beginPath(); c.arc(i + ((j / 26) & 1) * 13, j, 4, 0, 7); c.fill(); } }
  if (kind === "cloth") { for (let i = -w / 2; i < w / 2; i += 14) line(c, [[i, -h / 2], [i, h / 2]], 3, "rgba(160,130,80,0.45)"); for (let j = -h / 2; j < h / 2; j += 14) line(c, [[-w / 2, j], [w / 2, j]], 3, "rgba(160,130,80,0.45)"); line(c, [[-w / 2 + 16, -h / 2 + 14], [w / 2 - 16, -h / 2 + 14]], 4, COL.blue); }
  if (kind === "news") { shape(c, () => rrect(c, -w / 2 + 16, -h / 2 + 16, w - 32, 36, 2), "#4a4650", 0); shape(c, () => rrect(c, -w / 2 + 16, -h / 2 + 62, 100, 80, 2), "#a49f95", 0); for (let k = 0; k < 6; k++) { line(c, [[-w / 2 + 130, -h / 2 + 66 + k * 16], [w / 2 - 16, -h / 2 + 66 + k * 16]], 5, "#77737c"); line(c, [[-w / 2 + 16, -h / 2 + 156 + k * 0], [w / 2 - 16, -h / 2 + 156]], 0, "#77737c"); } for (let k = 0; k < 2; k++) line(c, [[-w / 2 + 16, -h / 2 + 156 + k * 16], [w / 2 - 16, -h / 2 + 156 + k * 16]], 5, "#77737c"); }
  if (kind === "paper") { shade(c, R, "#d9d9d9", w * 0.55, 0, 0.6); line(c, [[w / 2 - 50, -h / 2], [w / 2, -h / 2 + 50]], 3, "#bdbdbd"); }
  if (kind === "butter") { [[-90, -30, 40, 10], [60, 20, 50, -20], [-20, 60, 50, 6]].forEach(([a, b, l, d]) => line(c, [[a, b], [a + l, b + d], [a + l * 1.6, b - d]], 4, "rgba(255,255,255,0.8)")); }
  if (kind === "plastic") { shine(c, [[-w / 2 + 30, -h / 2 + 30], [w / 2 - 80, -h / 2 + 30]], 8); shine(c, [[-w / 2 + 30, h / 2 - 40], [-w / 2 + 120, h / 2 - 40]], 6); }
  c.restore();
  shape(c, R, "rgba(0,0,0,0)", 6);
  if (kind === "plastic") { [-1, 1].forEach((s) => shape(c, () => ell(c, s * 70, -h / 2 + 4, 36, 14), BG, 5)); }
});
const dropper = (c: Ctx, x: number, y: number, len: number, rot: number) => at(c, x, y, rot, () => {
  shape(c, () => ell(c, 0, 0, 52, 42), RED); shade(c, () => ell(c, 0, 0, 52, 42), "#a8281d", 0, 22, 0.7); shine(c, [[-30, -18], [-8, -28]], 8);
  shape(c, () => rrect(c, 40, -24, 30, 48, 6), COL.steel, 5);
  shape(c, () => polyP(c, [[70, -17], [len, -17], [len + 46, -3], [len + 46, 3], [len, 17], [70, 17]]), COL.glass, 5);
  shine(c, [[80, -8], [len - 20, -8]], 6);
  shape(c, () => rrect(c, 70, 2, len - 90, 14, 3), COL.water, 0);
});
const dropShape = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.9); c.quadraticCurveTo(x + r * 0.2, y - r * 0.8, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.2, y - r * 0.8, x, y - r * 1.9); c.closePath(); }, COL.water, 5);
const phone = (c: Ctx, x: number, y: number, w: number, h: number, digits: string) => {
  shadow(c, x + w * 0.1, y + h + 6, w * 0.6, 16);
  shape(c, () => rrect(c, x, y, w, h, 26), "#3a3540", 6);
  shape(c, () => rrect(c, x + 14, y + 26, w - 28, h - 52, 10), "#22303a", 0);
  write(c, digits, x + w / 2 - digits.length * 0.4 * 78, y + h / 2 - 40, 78, "#c9f06b", 10);
};
// setup.e4.0
const e4_0 = (c: Ctx) => {
  ground(c);
  const kinds: Kind[] = ["towel", "cloth", "news", "paper", "butter", "plastic"];
  kinds.forEach((k, i) => surface(c, 200 + (i % 3) * 340, 195 + Math.floor(i / 3) * 270, 290, 210, [-0.04, 0.03, -0.02, 0.04, -0.03, 0.02][i], k));
  dropper(c, 150, 860, 320, -0.1);
  bowl(c, 790, 830, 150, COL.water);
  c.beginPath(); ell(c, 740, 822, 44, 7); c.fillStyle = COL.drop; c.fill();
};
// setup.e4.1
const e4_1 = (c: Ctx) => {
  ground(c);
  plate(c, 400, 800, 320, 140);
  shape(c, () => polyP(c, [[240, 750], [560, 750], [585, 835], [215, 835]]), "#fbf7ee", 6);
  c.fillStyle = "#d8d2c2"; for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(260 + i * 40 + j * 8, 768 + j * 28, 4, 0, 7); c.fill(); }
  // dropper held over it
  dropper(c, 420, 170, 300, Math.PI / 2);
  dropShape(c, 420, 590, 28);
  arm(c, 420 + 70 * 1.5, 170, Math.PI, 1.5, true);
  phone(c, 780, 560, 220, 380, "00");
};
// setup.e4.2
const e4_2 = (c: Ctx) => {
  ground(c);
  // left: plastic, the drop stays round
  shape(c, () => polyP(c, [[70, 190], [490, 190], [520, 640], [40, 640]]), "rgba(190,222,240,0.95)", 6);
  shine(c, [[90, 240], [300, 240]], 9); shine(c, [[70, 560], [170, 560]], 7);
  shadow(c, 290, 440, 120, 36);
  shape(c, () => ell(c, 280, 410, 112, 92), COL.water); shade(c, () => ell(c, 280, 410, 112, 92), COL.waterDk, 40, 40, 0.6);
  shine(c, [[225, 365], [260, 345]], 12);
  // right: paper towel, a flat damp patch, no drop
  shape(c, () => polyP(c, [[590, 190], [1010, 190], [1040, 640], [560, 640]]), "#fbf7ee", 6);
  c.save(); c.beginPath(); polyP(c, [[590, 190], [1010, 190], [1040, 640], [560, 640]]); c.clip();
  c.fillStyle = "#d8d2c2"; for (let i = 0; i < 17; i++) for (let j = 0; j < 12; j++) { c.beginPath(); c.arc(560 + i * 32 + (j & 1) * 16, 210 + j * 36, 4, 0, 7); c.fill(); }
  c.beginPath(); c.moveTo(690, 420); c.bezierCurveTo(690, 320, 880, 310, 900, 410); c.bezierCurveTo(920, 520, 720, 540, 690, 420); c.fillStyle = "rgba(95,150,200,0.65)"; c.fill();
  c.beginPath(); c.moveTo(715, 420); c.bezierCurveTo(720, 350, 860, 340, 875, 415); c.bezierCurveTo(885, 495, 735, 505, 715, 420); c.fillStyle = "rgba(60,100,160,0.45)"; c.fill();
  c.restore();
  phone(c, 440, 700, 200, 300, "120");
};
// ---------------------------------------------------------------- e5: light through things
const TABLEY = 792, TY = 640, WALLX = 870, SHEETX = 560;
const darkRoom = (c: Ctx, glow: number) => {
  c.fillStyle = "#2b2f5c"; c.fillRect(0, 0, D, D);
  c.fillStyle = "#3a3f78"; c.fillRect(WALLX, 0, D - WALLX, TABLEY);
  line(c, [[WALLX, 0], [WALLX, TABLEY]], 6);
  c.fillStyle = "#4a3a55"; c.fillRect(0, TABLEY, D, D - TABLEY); line(c, [[0, TABLEY], [D, TABLEY]], 6);
  if (glow > 0) {
    c.save(); c.beginPath(); c.rect(WALLX + 3, 0, D - WALLX, TABLEY - 3); c.clip();
    const g = c.createRadialGradient(975, TY, 10, 975, TY, 220); g.addColorStop(0, `rgba(255,243,170,${glow})`); g.addColorStop(0.6, `rgba(255,243,170,${glow * 0.7})`); g.addColorStop(1, "rgba(255,243,170,0)");
    c.fillStyle = g; c.fillRect(WALLX, 0, D, TABLEY); c.restore();
  }
};
// the torch lying on two books, lens at (305, TY)
const torch = (c: Ctx) => {
  shadow(c, 190, TABLEY + 14, 200, 14);
  shape(c, () => rrect(c, 50, 744, 270, 48, 6), COL.teal, 6); shape(c, () => rrect(c, 80, 696, 220, 48, 6), COL.orange, 6);
  line(c, [[300, 706], [300, 734]], 3, "#fffaf0"); line(c, [[320, 754], [320, 782]], 3, "#fffaf0");
  torchBody(c, 60, TY);
};
// the beam from the torch lens to x1, half-height h1 there
const beam = (c: Ctx, x1: number, h1: number, alpha: number) => { c.beginPath(); polyP(c, [[305, TY - 55], [x1, TY - h1], [x1, TY + h1], [305, TY + 55]]); c.fillStyle = `rgba(255,243,170,${alpha})`; c.fill(); };
// n sheets of butter paper held by a hand from above, standing in the beam
const hold = (c: Ctx, n: number) => {
  for (let k = n - 1; k >= 0; k--) {
    const dx = k * 16;
    shape(c, () => polyP(c, [[SHEETX + dx, 450], [SHEETX + dx + 90, 430], [SHEETX + dx + 90, 765], [SHEETX + dx, 785]]), n === 1 ? "rgba(247,233,190,0.82)" : "#f3e6bd", 6);
  }
  arm(c, SHEETX + 40 + (n - 1) * 8, 370, Math.PI / 2, 1.3);
};
// setup.e5.0
const e5_0 = (c: Ctx) => {
  darkRoom(c, 0.95);
  torch(c);
  beam(c, WALLX, 150, 0.5);
  glass(c, SHEETX + 40, TABLEY, 210, 260, 0);
  c.save(); c.beginPath(); c.rect(SHEETX - 65, TY - 80, 210, 160); c.clip(); beam(c, WALLX, 150, 0.3); c.restore();
  c.beginPath(); ell(c, 975, TY, 80, 135); c.fillStyle = "rgba(255,248,200,0.95)"; c.fill();
};
// setup.e5.1
const e5_1 = (c: Ctx) => {
  darkRoom(c, 0.5);
  torch(c);
  beam(c, SHEETX, 105, 0.55);
  c.beginPath(); polyP(c, [[SHEETX + 90, TY - 105], [WALLX, TY - 150], [WALLX, TY + 150], [SHEETX + 90, TY + 105]]); c.fillStyle = "rgba(255,243,170,0.18)"; c.fill();
  hold(c, 1);
};
// setup.e5.2
const e5_2 = (c: Ctx) => {
  darkRoom(c, 0);
  torch(c);
  beam(c, SHEETX, 105, 0.55);
  hold(c, 5);
};

export const su_materialsProperties = cards("sci.materials.properties.L3 set-up", [
  e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2, e5_0, e5_1, e5_2,
]);
