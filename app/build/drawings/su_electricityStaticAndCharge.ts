import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, rnd, cards } from "./flatKit";

// STATIC AND CHARGE · set-up cards for the balloon and paper bits (e1) and the bending water (e2).
// Same pink balloon, same dark plate and white paper bits on every e1 card; same tap, sink and stream on every e2 card.

const BAL = COL.pink, BAL_DK = "#d0678a", KNIT = "#a98ddb", SWEATER = COL.purple, SWEATER_DK = "#6c4fb0";

// a balloon: the knot at (kx, ky), the body going away from it along angle an; len = half length, wid = half width
const balloon = (c: Ctx, kx: number, ky: number, an: number, len: number, wid: number, lying = false) => {
  const cx = len + 18, cs = Math.cos(an), sn = Math.sin(an), loc = (vx: number, vy: number) => [vx * cs + vy * sn, -vx * sn + vy * cs];
  if (lying) { c.beginPath(); ell(c, kx + cs * cx + 14, ky + sn * cx + 22, len, wid, an); c.fillStyle = "rgba(43,35,64,0.16)"; c.fill(); }
  c.save(); c.translate(kx, ky); c.rotate(an);
  shape(c, () => polyP(c, [[0, -8], [30, -22], [30, 22], [0, 8]]), BAL, 5);
  const body = () => ell(c, cx, 0, len, wid);
  shape(c, body, BAL, 6);
  const [sx, sy] = loc(-wid * 0.22, -wid * 0.22);
  shade(c, body, BAL_DK, sx, sy, 0.6);
  shape(c, () => ell(c, 0, 0, 9, 11), BAL_DK, 4);
  const [hx, hy] = loc(-wid * 0.5, -wid * 0.55), [ex, ey] = loc(-wid * 0.15, -wid * 0.75);
  line(c, [[cx + hx * 0.9, hy * 0.9], [cx + (hx + ex) * 0.5 * 0.9 + 6, (hy + ey) * 0.5 * 0.9]], 8, "rgba(255,255,255,0.8)");
  c.restore();
};
// a dark plate seen from above at an angle
const darkPlate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.06, y + ry * 0.32, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), "#5a5368");
  shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.84, ry * 0.8), "#3a3540", 4);
};
// a tiny scrap of white paper napkin
const bit = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  const cs = Math.cos(rot), sn = Math.sin(rot);
  shape(c, () => polyP(c, [[1, 0], [0.35, 0.95], [-0.85, 0.6], [-1, -0.35], [0.1, -0.9]].map(([u, v]) => [x + (u * cs - v * sn) * r, y + (u * sn + v * cs) * r])), WHITE, 3.5);
};
const heap = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, seed: number) => {
  const r = rnd(seed);
  for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()); bit(c, x + Math.cos(a) * d * rx, y + Math.sin(a) * d * ry, 15 + r() * 4, r() * 6.28); }
};
// the balloon held by its knot from above, over the plate (cards e1.0 and e1.2)
const BX = 470, BKY = 319;
const hangingBalloon = (c: Ctx) => {
  balloon(c, BX, BKY, Math.PI / 2, 175, 140);
  hand(c, BX, 200, Math.PI / 2, 1.7);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  darkPlate(c, BX, 850, 330, 105);
  heap(c, BX, 840, 130, 36, 26, 5);
  hangingBalloon(c);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  // the other things, lined up along the top: a cotton towel, a newspaper, a second balloon
  shadow(c, 250, 258, 150, 22);
  shape(c, () => rrect(c, 100, 90, 300, 160, 14), COL.cloth);
  for (const x of [140, 190]) { c.fillStyle = COL.blue; c.fillRect(x, 92, 20, 156); }
  for (let i = 0; i < 9; i++) line(c, [[110 + i * 33, 250], [110 + i * 33, 272]], 5, COL.greyDk);
  shape(c, () => rrect(c, 100, 90, 300, 160, 14), "rgba(255,255,255,0)");
  shadow(c, 560, 262, 130, 22);
  shape(c, () => rrect(c, 440, 70, 240, 190, 6), "#f1ead6");
  shape(c, () => rrect(c, 458, 88, 204, 42, 3), COL.black, 0);
  shape(c, () => rrect(c, 458, 146, 90, 70, 3), COL.grey, 3);
  for (let i = 0; i < 5; i++) line(c, [[566, 150 + i * 16], [662, 150 + i * 16]], 5, COL.greyDk);
  for (let i = 0; i < 2; i++) line(c, [[458, 228 + i * 14], [662, 228 + i * 14]], 5, COL.greyDk);
  balloon(c, 730, 170, 0, 95, 66, true);
  // the sweater lying flat
  shadow(c, 560, 1015, 480, 24);
  const sweater = () => {
    shape(c, () => polyP(c, [[305, 530], [305, 730], [150, 900], [70, 830], [210, 535]]), SWEATER, 6);
    shape(c, () => polyP(c, [[775, 530], [775, 730], [930, 900], [1010, 830], [870, 535]]), SWEATER, 6);
    shape(c, () => rrect(c, 290, 490, 500, 530, 40), SWEATER, 6);
    shade(c, () => rrect(c, 290, 490, 500, 530, 40), SWEATER_DK, -26, -20, 0.55);
    shape(c, () => rrect(c, 290, 960, 500, 60, 22), SWEATER_DK, 6);
    shape(c, () => ell(c, 540, 500, 92, 34), SWEATER_DK, 6);
    shape(c, () => ell(c, 540, 506, 66, 20), "#4b3585", 0);
  };
  sweater();
  for (let y = 560; y < 940; y += 30) for (let x = 330 + ((y / 30) % 2) * 13; x < 760; x += 26) line(c, [[x - 7, y], [x, y + 11], [x + 7, y]], 3.5, KNIT);
  for (let y = 975; y < 1010; y += 12) for (let x = 305; x < 780; x += 20) line(c, [[x, y], [x, y + 8]], 3, "#4b3585");
  // the balloon pressed on the sweater, held by the knot
  const an = 2.4;
  balloon(c, 900 + Math.cos(an) * 119, 420 + Math.sin(an) * 119, an, 165, 125, true);
  hand(c, 900, 420, an, 1.7);
  arrow(c, [[560, 890], [400, 890]], RED, 12);
  arrow(c, [[560, 890], [720, 890]], RED, 12);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  darkPlate(c, BX, 850, 330, 105);
  heap(c, BX, 850, 110, 30, 10, 9);
  hangingBalloon(c);
  const cy = BKY + 193;
  for (const p of [-0.78, -0.4, 0, 0.4, 0.78]) bit(c, BX + 140 * Math.sin(p) * 1.04, cy + 175 * Math.cos(p) + 6, 17, p * 2 + 0.5);
  bit(c, 380, 735, 17, 1.2); bit(c, 560, 710, 17, 3);
  // counting: a raised hand and the number
  hand(c, 920, 930, -Math.PI / 2, 1.7, undefined, undefined, true);
  write(c, "5", 868, 560, 130, INK, 12);
};

// ---- the tap, the sink and the thin stream (cards e2.0, e2.1, e2.2)
const SX = 380;
const sinkAndTap = (c: Ctx, landX: number) => {
  // the sink: steel rim, a deeper basin, the drain
  shadow(c, 560, 1030, 490, 24);
  shape(c, () => rrect(c, 50, 800, 980, 230, 46), COL.steel, 6);
  shade(c, () => rrect(c, 50, 800, 980, 230, 46), COL.steelDk, -22, -16, 0.5);
  shape(c, () => rrect(c, 95, 836, 890, 160, 32), "#a9b4c4", 5);
  shape(c, () => ell(c, 760, 918, 50, 14), COL.black, 4);
  // the tap: base, arched neck, lever
  shape(c, () => rrect(c, 140, 660, 120, 140, 16), COL.steel, 6);
  shade(c, () => rrect(c, 140, 660, 120, 140, 16), COL.steelDk, -22, 0, 0.55);
  const neck: number[][] = [[200, 700], [200, 300]];
  for (let k = 1; k <= 12; k++) { const a = Math.PI + (k / 12) * Math.PI; neck.push([290 + Math.cos(a) * 90, 300 + Math.sin(a) * 90]); }
  neck.push([SX, 340]);
  line(c, neck, 66, INK); line(c, neck, 54, COL.steel);
  line(c, [[213, 340], [213, 680]], 10, COL.steelDk);
  shine(c, [[186, 340], [186, 640]], 8);
  shine(c, [[222, 230], [268, 205]], 8);
  shape(c, () => rrect(c, 350, 330, 60, 20, 8), COL.steelDk, 5);
  shape(c, () => rrect(c, 220, 622, 110, 38, 14), COL.teal, 5);
  // the water landing in the basin
  shape(c, () => ell(c, landX, 925, 58, 14), COL.water, 4);
  shape(c, () => ell(c, landX, 923, 26, 6), COL.drop, 0);
};
// the stream: a thin smooth rope of water along the points
const stream = (c: Ctx, pts: number[][]) => {
  const p = pts.slice(); const path = () => { c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length - 1; i++) c.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2); c.lineTo(p[p.length - 1][0], p[p.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = 19; c.stroke(); path(); c.strokeStyle = COL.water; c.lineWidth = 11; c.stroke();
};
const STRAIGHT = [[SX, 345], [SX, 640], [SX, 925]];

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  sinkAndTap(c, SX);
  stream(c, STRAIGHT);
  arrow(c, [[250, 580], [305, 560], [345, 590], [350, 625]], RED, 10);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  sinkAndTap(c, 492);
  // where the water would fall if nothing bent it
  c.setLineDash([16, 18]); line(c, [[SX, 420], [SX, 900]], 4, "rgba(43,35,64,0.28)"); c.setLineDash([]);
  stream(c, [[SX, 345], [SX, 400], [405, 480], [450, 540], [480, 640], [490, 780], [492, 925]]);
  const comb = () => rrect(c, 525, 470, 380, 52, 14);
  for (let i = 0; i < 18; i++) shape(c, () => rrect(c, 535 + i * 20.5, 512, 11, 64, 5), COL.orange, 3.5);
  shape(c, comb, COL.orange, 6);
  shade(c, comb, COL.orange === "" ? "" : "#d27c25", -10, -12, 0.6);
  shine(c, [[545, 484], [820, 484]], 7);
  hand(c, 940, 497, Math.PI, 1.5, undefined, COL.teal);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  sinkAndTap(c, SX);
  stream(c, STRAIGHT);
  shape(c, () => polyP(c, [[570, 480], [905, 488], [905, 506], [570, 514]]), COL.steel, 6);
  shape(c, () => ell(c, 500, 497, 80, 56), COL.steel, 6);
  shade(c, () => ell(c, 500, 497, 80, 56), COL.steelDk, -14, -12, 0.55);
  shape(c, () => ell(c, 504, 501, 60, 38), COL.steelIn, 4);
  shine(c, [[455, 480], [490, 464]], 8);
  hand(c, 940, 497, Math.PI, 1.5, undefined, COL.teal);
};

export const su_electricityStaticAndCharge = cards("sci.electricity.static-and-charge.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2]);
