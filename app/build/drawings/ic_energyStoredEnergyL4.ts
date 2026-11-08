import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, leaf, hand, person, write, cards } from "./flatKit";

// STORED ENERGY (sci.energy.stored-energy.L4) · set-up cards for the soap slider (e1) and the bounce
// ratio (e2), then the flow cards for every experiment, activity, project and game, and two term cards.
// Same child and grown-up as the rest of the kit. The soap rig is drawn the way children's books draw a
// floor: tiles seen from above, pencils standing up, 40 px to a centimetre. The wall scenes are a plain
// front view with the floor at y = 900 and 7.5 px to a centimetre on the tape.

const PI = Math.PI;
const BAND = "#d08e4e", TILE = "#e9dec8", GROUT = "#d3c3a4", WALL = "#e2edf3", DOOR = "#b9875a", DOORDK = "#9a6a42";
const SOAP = "#f6bccb", SOAPDK = "#dd8ea6", SOAPLT = "#fbd9e2", BALLDK = "#b53a2a", DOUGH = "#d9c3a0", DOUGHDK = "#b89d78";

// ---------------------------------------------------------------- grounds
const tileFloor = (c: Ctx, y0 = 0) => {
  c.fillStyle = TILE; c.fillRect(0, y0, D, D - y0);
  c.strokeStyle = GROUT; c.lineWidth = 4;
  for (let x = 90; x < D; x += 180) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, D); c.stroke(); }
  for (let y = y0 + 180; y < D; y += 180) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
};
const room = (c: Ctx, floorY = 900) => { ground(c, WALL); tileFloor(c, floorY); line(c, [[0, floorY], [D, floorY]], 6); };
const dash = (c: Ctx, pts: number[][], w = 5, col = INK, seg = 18) => { c.save(); c.setLineDash([seg, seg]); line(c, pts, w, col); c.restore(); };
const stickyTape = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 5), "rgba(255,255,255,0.62)", 3); c.restore(); };

// ---------------------------------------------------------------- measuring
type Marks = { tick: number; mid: number; big: number; label: number; labelMax?: number };
const isMult = (k: number, m: number) => Math.abs(k / m - Math.round(k / m)) < 1e-6;
// a ruler or tape: zero at (x, y0), running dirY (-1 up, 1 down) for cm centimetres at pxCm each; ticks on side (1 right, -1 left)
const scaleStrip = (c: Ctx, x: number, y0: number, dirY: 1 | -1, cm: number, pxCm: number, col: string, w: number, side: 1 | -1, m: Marks) => {
  const len = cm * pxCm, top = dirY < 0 ? y0 - len : y0;
  shadow(c, x + 10, top + len / 2 + 8, w * 0.55, len / 2);
  shape(c, () => rrect(c, x - w / 2, top, w, len, 5), col);
  const edge = x + (side * w) / 2;
  for (let i = 0; i * m.tick <= cm + 1e-6; i++) {
    const k = i * m.tick, y = y0 + dirY * k * pxCm, big = isMult(k, m.big), mid = isMult(k, m.mid);
    line(c, [[edge, y], [edge - side * w * (big ? 0.5 : mid ? 0.32 : 0.18), y]], big ? 4 : 2.5);
  }
  for (let k = 0; k <= Math.min(cm, m.labelMax ?? cm) + 1e-6; k += m.label) {
    const t = String(k), tw = t.length * 0.8 * 20, lx = side > 0 ? x - w / 2 + 5 : x + w / 2 - tw - 5;
    write(c, t, lx, y0 + dirY * k * pxCm + dirY * 13 - 10, 20, INK, 4);
  }
};
const FINE: Marks = { tick: 0.5, mid: 1, big: 5, label: 5 };
const wallTape = (c: Ctx, x: number, floorY: number) => {
  scaleStrip(c, x, floorY, -1, 100, 7.5, COL.yellow, 54, -1, { tick: 5, mid: 10, big: 10, label: 10, labelMax: 90 });
  stickyTape(c, x, floorY - 745, 80, 20); stickyTape(c, x, floorY - 380, 80, 20);
};
// a small red tape flag stuck to the right of the wall tape, with the height on it
const flag = (c: Ctx, x: number, y: number, n: string) => { shape(c, () => rrect(c, x, y - 17, 92, 34, 6), RED, 5); write(c, n, x + 46 - n.length * 8.8, y - 11, 22, WHITE, 4); };

// ---------------------------------------------------------------- the soap rig
const pencil = (c: Ctx, x: number, base: number, len = 380) => {
  const top = base - len, w = 14;
  shape(c, () => polyP(c, [[x - w, base - 56], [x + w, base - 56], [x, base]]), "#e8c48a", 5);
  shape(c, () => polyP(c, [[x - 4, base - 16], [x + 4, base - 16], [x, base]]), INK, 0);
  shape(c, () => rrect(c, x - w, top, w * 2, len - 56, 3), COL.yellow, 5);
  c.fillStyle = COL.woodDk; c.fillRect(x + 3, top + 3, w - 6, len - 62);
  shape(c, () => rrect(c, x - w, top - 26, w * 2, 28, 3), COL.steel, 5);
  shape(c, () => rrect(c, x - w, top - 56, w * 2, 32, 8), COL.pink, 5);
};
// a lump of clay on the floor at (x, y), with two strips of tape leaning out from it when taped
const clay = (c: Ctx, x: number, y: number, taped = true) => {
  shadow(c, x + 14, y + 10, 70, 16);
  const p = () => { c.moveTo(x - 62, y + 4); c.bezierCurveTo(x - 60, y - 40, x - 20, y - 46, x, y - 40); c.bezierCurveTo(x + 30, y - 46, x + 64, y - 30, x + 62, y + 4); c.quadraticCurveTo(x, y + 20, x - 62, y + 4); c.closePath(); };
  shape(c, p, COL.grey); shade(c, p, COL.greyDk, -16, -8);
  if (taped) for (const s of [-1, 1]) stickyTape(c, x + s * 26, y - 14, 30, 120, -s * 0.5);
};
const bandStroke = (c: Ctx, path: () => void, w = 12) => {
  c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); path(); c.strokeStyle = INK; c.lineWidth = w + 6; c.stroke();
  c.beginPath(); path(); c.strokeStyle = BAND; c.lineWidth = w; c.stroke();
};
const soap = (c: Ctx, cx: number, cy: number, w = 260, h = 150) => {
  shadow(c, cx + 14, cy + 12, w * 0.5, h * 0.5);
  const p = () => rrect(c, cx - w / 2, cy - h / 2, w, h, 34);
  shape(c, p, SOAP); shade(c, p, SOAPDK, -22, -14, 0.5);
  shape(c, () => ell(c, cx - 6, cy - 6, w * 0.3, h * 0.26), SOAPLT, 4);
  shine(c, [[cx - w * 0.38, cy - h * 0.2], [cx - w * 0.22, cy - h * 0.36]], 8);
};
// two pencils in clay at x1 and x2 (band at by, pencils standing on base = by + 60), the band's back strand
// pulled to apex when given; the ruler behind (zero at the back strand) and the tape in front (zero at the front strand)
const soapRig = (c: Ctx, x1: number, x2: number, by: number, apex?: [number, number], rulerX?: number, tapeX?: number) => {
  const base = by + 60;
  if (rulerX !== undefined) scaleStrip(c, rulerX, by - 12, -1, 10, 40, COL.wood, 56, rulerX < x1 ? 1 : -1, FINE);
  if (tapeX !== undefined) scaleStrip(c, tapeX, by + 12, 1, 10, 40, COL.yellow, 60, 1, FINE);
  bandStroke(c, () => { c.moveTo(x1, by - 12); if (apex) c.lineTo(apex[0], apex[1]); c.lineTo(x2, by - 12); });
  pencil(c, x1, base); pencil(c, x2, base);
  clay(c, x1, base); clay(c, x2, base);
  bandStroke(c, () => { c.moveTo(x1, by - 12); c.ellipse(x1, by, 22, 12, 0, -PI / 2, PI / 2, true); c.lineTo(x2, by + 12); c.ellipse(x2, by, 22, 12, 0, PI / 2, -PI / 2, true); });
};
// a hand with the index finger out, its fingertip at (tx, ty), pointing along angle an
const pointHand = (c: Ctx, tx: number, ty: number, an: number, s = 1, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(tx, ty); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -236, -50, 72, 100, 16), sleeve, 6);
  shape(c, () => rrect(c, -178, -46, 100, 94, 26), skin, 6);
  shape(c, () => rrect(c, -112, 14, 46, 20, 10), skin, 5);
  shape(c, () => rrect(c, -112, 32, 46, 18, 9), skin, 5);
  shape(c, () => rrect(c, -100, -16, 100, 32, 16), skin, 5);
  shape(c, () => ell(c, -132, -52, 34, 20, -0.25), skin, 5);
  c.restore();
};

// ---------------------------------------------------------------- balls and small things
const ball = (c: Ctx, x: number, y: number, r: number, col = COL.red, dk = BALLDK) => {
  const p = () => ell(c, x, y, r, r);
  shape(c, p, col); shade(c, p, dk, -r * 0.3, -r * 0.3, 0.5);
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.42, r * 0.22, r * 0.13, -0.6), WHITE, 0);
};
const marble = (c: Ctx, x: number, y: number, r: number) => { const p = () => ell(c, x, y, r, r); shape(c, p, COL.sky, 5); shade(c, p, COL.blue, -r * 0.3, -r * 0.3, 0.45); shape(c, () => ell(c, x - r * 0.35, y - r * 0.4, r * 0.2, r * 0.12, -0.6), WHITE, 0); };
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const banana = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const p = () => { c.moveTo(-100, -10); c.quadraticCurveTo(0, -120, 100, -10); c.quadraticCurveTo(0, -40, -100, -10); c.closePath(); };
  shape(c, p, COL.yellow, 6 / s); shade(c, p, COL.orange, -8, -10, 0.45);
  shape(c, () => ell(c, -100, -10, 9, 7), COL.brown, 0); shape(c, () => ell(c, 100, -10, 9, 7), COL.brown, 0);
  c.restore();
};
const battery = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2 + h * 0.08, w, h * 0.92, w * 0.15), COL.black);
  shape(c, () => rrect(c, x - w * 0.2, y - h / 2, w * 0.4, h * 0.12, 3), COL.steel, 4);
  c.fillStyle = COL.orange; c.fillRect(x - w / 2 + 4, y - h * 0.1, w - 8, h * 0.3);
};
// a coconut palm: base of the trunk at (x, y), drawn at scale s (height about 660 s)
const palm = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const trunk = () => { c.moveTo(-40, 0); c.bezierCurveTo(0, -300, 90, -480, 100, -650); c.lineTo(150, -650); c.bezierCurveTo(150, -480, 90, -300, 50, 0); c.closePath(); };
  shape(c, trunk, COL.brown, 6 / s); shade(c, trunk, "#7e5530", -14, -4);
  for (let i = 1; i < 9; i++) { const t = i / 9, px = -40 + 90 * t * t * 0.55 + 100 * t * 0.6, py = -650 * t; line(c, [[px - 2 + 95 * t * 0.3, py], [px + 40 + 25 * (1 - t), py]], 4 / s, "#7e5530"); }
  [-165, -140, -112, -85, -58, -30, -5, 18].forEach((deg) => leaf(c, 125, -650, 270, (deg * PI) / 180, COL.leaf));
  [[95, -600], [142, -592], [118, -556], [162, -552]].forEach(([cx, cy]) => { const p = () => ell(c, cx, cy, 30, 34); shape(c, p, "#8f6a3c", 5 / s); shade(c, p, "#6a4a28", -8, -8); });
  c.restore();
};
// a pile of game cards, the top one at (x, y) of size w x h, with a drawing on it
const cardPile = (c: Ctx, x: number, y: number, w: number, h: number, top: () => void) => {
  shadow(c, x + 18, y + h / 2 + 10, w * 0.55, 16);
  for (let i = 3; i >= 1; i--) shape(c, () => rrect(c, x - w / 2 + i * 6, y - h / 2 + i * 6, w, h, 16), i % 2 ? COL.paper : WHITE, 5);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 16), WHITE, 5);
  top();
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { shape(c, () => rrect(c, x, y, w, h, 6), col); shape(c, () => rrect(c, x + w - 26, y + 7, 18, h - 14, 3), WHITE, 3); };

// ================================================================ e1 · the soap slider
const X1 = 340, X2 = 740, BY = 600;
const e1Card0 = (c: Ctx) => {
  tileFloor(c);
  soapRig(c, X1, X2, BY);
  line(c, [[X1, 760], [X2, 760]], 5); line(c, [[X1, 744], [X1, 776]], 5); line(c, [[X2, 744], [X2, 776]], 5);
  write(c, "10 cm", 474, 782, 36);
};
const e1Card1 = (c: Ctx) => {
  tileFloor(c);
  soapRig(c, X1, X2, BY, undefined, 280, 540);
  soap(c, 540, BY - 12 - 75);
};
const e1Card2 = (c: Ctx) => {
  tileFloor(c);
  const apex: [number, number] = [540, BY - 12 - 80];
  soapRig(c, X1, X2, BY, apex, 280, 540);
  soap(c, 540, apex[1] - 75);
  dash(c, [[410, apex[1]], [308, apex[1]]], 5, RED, 12);
  arrow(c, [[380, 590], [380, 450]]);
  hand(c, 624, apex[1] - 75, PI, 1.2);
};
const e1Card3 = (c: Ctx) => {
  tileFloor(c);
  soapRig(c, X1, X2, BY, undefined, 280, 540);
  const front = BY + 12 + 280;
  dash(c, [[540, BY + 30], [540, front - 165]], 5, INK, 14);
  soap(c, 540, front - 75);
  line(c, [[672, front], [730, front]], 5, RED);
  pointHand(c, 690, front + 6, PI + 0.35, 1.1);
};

// ================================================================ e2 · the bounce ratio
const TX = 560, FLOOR = 900;
const cmY = (cm: number) => FLOOR - cm * 7.5;
const e2Wall = (c: Ctx) => { room(c, FLOOR); wallTape(c, TX, FLOOR); [30, 60, 90].forEach((n) => flag(c, TX + 27, cmY(n), String(n))); };
const e2Card0 = (c: Ctx) => e2Wall(c);
const e2Card1 = (c: Ctx) => {
  e2Wall(c);
  // the ball, its top at the 30 flag, then the child whose hand closes on it; the helper sits at eye level
  const bx = 470, byy = cmY(30) + 40, shx = 315 + 0.42 * 135, shy = FLOOR - 216 - 146 + 16;
  ball(c, bx, byy, 40);
  const ux = bx - shx, uy = byy - shy, d = Math.hypot(ux, uy);
  person(c, 315, FLOOR, 540, { reachR: [bx - (36 * ux) / d, byy - (36 * uy) / d] });
  person(c, 790, FLOOR, 600, { adult: true, sit: true, dir: -1, reachL: [652, 870], reachR: [928, 870] });
};
const e2Card2 = (c: Ctx) => {
  e2Wall(c);
  const top = cmY(20), bx = 470;
  dash(c, [[bx, cmY(30)], [bx, FLOOR - 6]], 5, INK, 14);
  ball(c, bx, top + 40, 40);
  arrow(c, [[415, 885], [415, 765]]);
  dash(c, [[bx + 42, top], [TX - 27, top]], 5, RED, 10); line(c, [[TX - 27, top], [TX + 27, top]], 6, RED);
  person(c, 315, FLOOR, 540, {});
  person(c, 790, FLOOR, 600, { adult: true, sit: true, dir: -1, reachL: [600, top], reachR: [928, 870] });
};
const e2Card3 = (c: Ctx) => {
  e2Wall(c);
  // the dough ball, flat where it landed
  dash(c, [[330, cmY(30)], [330, 855]], 5, INK, 14);
  const p = () => { c.moveTo(238, FLOOR); c.bezierCurveTo(246, 848, 414, 848, 422, FLOOR); c.closePath(); };
  shadow(c, 345, FLOOR + 4, 100, 10); shape(c, p, DOUGH); shade(c, p, DOUGHDK, -14, -10);
  for (const s of [-1, 1]) { line(c, [[330 + s * 112, 880], [330 + s * 150, 862]], 5); line(c, [[330 + s * 118, 896], [330 + s * 160, 896]], 5); }
  // the bouncing ball beside it
  dash(c, [[760, cmY(30)], [760, FLOOR - 6]], 5, INK, 14);
  ball(c, 760, cmY(20) + 40, 40);
  arrow(c, [[830, 885], [830, 765]]);
};
const e2Flow = (c: Ctx) => {
  room(c, FLOOR); wallTape(c, 540, FLOOR); [30, 60, 90].forEach((n) => flag(c, 567, cmY(n), String(n)));
  const col = (x: number, fromCm: number, toCm: number, side: 1 | -1) => {
    const bx = x + side * 90, top = cmY(toCm);
    dash(c, [[x, cmY(fromCm) + 80], [x, FLOOR - 6]], 5, INK, 14);
    ball(c, x, cmY(fromCm) + 40, 40);
    arrow(c, [[x + side * 12, FLOOR - 8], [bx - side * 26, top + 72]]);
    ball(c, bx, top + 40, 40);
    dash(c, [[bx + (bx < 540 ? 44 : -44), top], [bx < 540 ? 513 : 567, top]], 5, RED, 10); line(c, [[513, top], [567, top]], 6, RED);
  };
  col(330, 30, 20, 1);
  col(700, 60, 40, 1);
};

// ================================================================ flow cards
const e1Flow = (c: Ctx) => {
  tileFloor(c);
  const by = 740, apex: [number, number] = [540, by - 12 - 80];
  soapRig(c, X1, X2, by, apex, 880);
  soap(c, 540, apex[1] - 75);
  person(c, 540, 488, 520, { sit: true, dir: 1, reachR: [600, 500], reachL: [415, 462] });
  arrow(c, [[380, 700], [380, 560]]);
};
const a1Flow = (c: Ctx) => {
  ground(c, DOOR);
  shape(c, () => rrect(c, 70, 70, 940, 940, 8), DOORDK, 6); shape(c, () => rrect(c, 120, 120, 840, 840, 6), DOOR, 5);
  // lever handle on its rose
  shadow(c, 540, 318, 150, 14);
  shape(c, () => ell(c, 640, 290, 36, 36), COL.steel); shape(c, () => rrect(c, 400, 272, 260, 36, 18), COL.steel);
  shade(c, () => rrect(c, 400, 272, 260, 36, 18), COL.steelDk, 0, -10, 0.5);
  // the band over the lever, hanging in a loop
  bandStroke(c, () => { c.moveTo(458, 556); c.lineTo(458, 290); c.bezierCurveTo(458, 248, 482, 248, 482, 290); c.lineTo(482, 556); c.quadraticCurveTo(470, 584, 458, 556); c.closePath(); }, 11);
  // string loop from the band to the bottle neck
  line(c, [[470, 580], [470, 612]], 4); shape(c, () => ell(c, 470, 612, 7, 7), INK, 0);
  const body = () => rrect(c, 390, 670, 160, 260, 26);
  shadow(c, 480, 940, 90, 14);
  shape(c, () => rrect(c, 446, 590, 48, 30, 6), COL.blue);
  shape(c, () => polyP(c, [[448, 618], [492, 618], [522, 672], [418, 672]]), COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(390, 842, 160, 90); c.fillStyle = COL.drop; c.fillRect(390, 842, 160, 8); c.restore();
  shape(c, body, COL.glass, 5); shine(c, [[412, 700], [412, 880]], 7);
  shape(c, () => ell(c, 470, 622, 27, 8), INK, 0); shape(c, () => ell(c, 470, 622, 23, 5), BAND, 0);
  // the paper ruler taped beside it, zero level with the bottom of the band
  scaleStrip(c, 660, 580, 1, 10, 36, COL.paper, 56, -1, FINE);
  stickyTape(c, 660, 582, 90, 22); stickyTape(c, 660, 938, 90, 22);
  dash(c, [[490, 580], [630, 580]], 5, RED, 10);
};
const a2Flow = (c: Ctx) => {
  room(c, FLOOR); wallTape(c, 540, FLOOR);
  const stoolTop = 640, flagY = stoolTop - 225;
  flag(c, 567, flagY, "30");
  // the stool
  for (const [a, b] of [[226, 216], [394, 404]]) { line(c, [[a, stoolTop + 20], [b, FLOOR - 4]], 16, INK); line(c, [[a, stoolTop + 20], [b, FLOOR - 4]], 9, COL.woodDk); }
  line(c, [[232, 790], [388, 790]], 12, INK); line(c, [[232, 790], [388, 790]], 6, COL.woodDk);
  shape(c, () => rrect(c, 200, stoolTop, 220, 26, 8), COL.wood);
  // left: dropped onto the stool, a small bounce; right: the stool gone, dropped onto the floor, a bigger bounce
  dash(c, [[310, flagY + 80], [310, stoolTop - 4]], 5, INK, 14); ball(c, 310, flagY + 40, 40);
  arrow(c, [[322, stoolTop - 6], [366, 598]]); ball(c, 380, 560, 40);
  dash(c, [[770, flagY + 80], [770, FLOOR - 6]], 5, INK, 14); ball(c, 770, flagY + 40, 40);
  arrow(c, [[782, FLOOR - 8], [838, 722]]); ball(c, 860, 678, 40);
  dash(c, [[424, 520], [513, 520]], 5, RED, 10); dash(c, [[816, 638], [567, 638]], 5, RED, 10);
  line(c, [[513, 520], [567, 520]], 6, RED); line(c, [[513, 638], [567, 638]], 6, RED);
};
const a3Flow = (c: Ctx) => {
  ground(c);
  c.save(); c.translate(540, 540); c.scale(1.12, 1.12); c.translate(-540, -540);
  shadow(c, 600, 612, 400, 18);
  const bx0 = 360, bx1 = 820, cy = 540;
  // plunger rod and thumb disc, then the barrel over the rod
  shape(c, () => rrect(c, 300, cy - 18, 300, 36, 8), WHITE, 5);
  shape(c, () => rrect(c, 286, cy - 72, 18, 144, 6), WHITE, 5);
  shape(c, () => rrect(c, bx0 - 16, cy - 76, 18, 152, 6), WHITE, 5);
  shape(c, () => rrect(c, bx0, cy - 55, bx1 - bx0, 110, 10), COL.glass, 6);
  shape(c, () => polyP(c, [[bx1, cy - 20], [885, cy - 12], [885, cy + 12], [bx1, cy + 20]]), COL.glass, 5);
  // the rubber seal at the 5 ml mark, and the marks: 0 at the nozzle, 10 at the open end
  shape(c, () => rrect(c, 588, cy - 50, 24, 100, 6), COL.black, 5);
  for (let ml = 0; ml <= 10; ml++) { const x = 800 - ml * 40; line(c, [[x, cy - 52], [x, cy - 52 + (ml % 5 === 0 ? 26 : 14)]], ml % 5 === 0 ? 4 : 2.5); }
  write(c, "10", 384, cy - 112, 30); write(c, "5", 590, cy - 112, 30); write(c, "0", 790, cy - 112, 30);
  // air pushing back on the seal
  for (const [y, x] of [[cy - 28, 720], [cy, 760], [cy + 28, 720]]) arrow(c, [[x, y], [634, y]], COL.blueDk, 6);
  clay(c, 936, 566, false);
  hand(c, 181, cy, 0, 1.5);
  arrow(c, [[170, 420], [320, 420]]);
  c.restore();
};
const p1Flow = (c: Ctx) => {
  room(c, FLOOR);
  scaleStrip(c, 32, FLOOR, -1, 25, 10, COL.wood, 44, 1, { tick: 1, mid: 5, big: 10, label: 10 });
  const cols = [COL.blue, COL.green, COL.red, COL.purple];
  for (let i = 0; i < 4; i++) book(c, 80, FLOOR - 50 * (i + 1), 220, 50, cols[i]);
  for (let i = 0; i < 2; i++) book(c, 780, FLOOR - 50 * (i + 1), 240, 50, cols[i + 2]);
  const strip = () => { c.moveTo(230, 698); c.lineTo(300, 698); c.bezierCurveTo(400, 698, 420, 893, 520, 893); c.lineTo(580, 893); c.bezierCurveTo(660, 893, 700, 798, 790, 798); c.lineTo(860, 798); };
  c.lineCap = "round"; c.lineJoin = "round";
  c.beginPath(); strip(); c.strokeStyle = INK; c.lineWidth = 24; c.stroke();
  c.beginPath(); strip(); c.strokeStyle = "#f4ead2"; c.lineWidth = 16; c.stroke();
  stickyTape(c, 262, 698, 60, 22); stickyTape(c, 550, 893, 60, 22); stickyTape(c, 826, 798, 60, 22);
  marble(c, 322, 672, 22);
  arrow(c, [[352, 690], [470, 830]]);
};
const g1Flow = (c: Ctx) => {
  ground(c);
  const lw = 210, lh = 150, ly = 230;
  [170, 417, 663, 910].forEach((cx, i) => {
    const lx = cx - lw / 2;
    shadow(c, cx + 10, ly + lh + 8, lw * 0.5, 12);
    shape(c, () => rrect(c, lx, ly, lw, lh, 14), WHITE, 5);
    if (i === 0) { ball(c, cx, ly + 42, 22); dash(c, [[cx, ly + 70], [cx, ly + 120]], 3, INK, 8); line(c, [[cx - 50, ly + 126], [cx + 50, ly + 126]], 5); }
    if (i === 1) { bandStroke(c, () => { c.moveTo(cx - 60, ly + 95); c.lineTo(cx, ly + 40); c.lineTo(cx + 60, ly + 95); c.closePath(); }, 8); shape(c, () => ell(c, cx - 60, ly + 95, 12, 12), COL.yellow, 4); shape(c, () => ell(c, cx + 60, ly + 95, 12, 12), COL.yellow, 4); }
    if (i === 2) { banana(c, cx - 40, ly + 90, 0.55); battery(c, cx + 60, ly + 76, 40, 84); }
    if (i === 3) { shape(c, () => ell(c, cx, ly + 75, 42, 42), COL.grey, 6); line(c, [[cx - 30, ly + 105], [cx + 30, ly + 45]], 9, RED); }
  });
  cardPile(c, 540, 720, 420, 280, () => palm(c, 480, 842, 0.29));
};
// a lit diya: a small clay lamp with a flame
const diya = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const bowl = () => { c.moveTo(-70, 0); c.quadraticCurveTo(-74, 36, -30, 44); c.lineTo(30, 44); c.quadraticCurveTo(74, 36, 70, 0); c.closePath(); };
  shape(c, bowl, COL.soil, 5 / s); shade(c, bowl, COL.soilDk, -10, -8);
  shape(c, () => ell(c, 0, 0, 70, 14), COL.brown, 4 / s);
  shape(c, () => { c.moveTo(0, -84); c.quadraticCurveTo(28, -44, 18, -14); c.quadraticCurveTo(0, -2, -18, -14); c.quadraticCurveTo(-28, -44, 0, -84); c.closePath(); }, COL.orange, 4 / s);
  shape(c, () => { c.moveTo(0, -54); c.quadraticCurveTo(13, -32, 8, -16); c.quadraticCurveTo(0, -8, -8, -16); c.quadraticCurveTo(-13, -32, 0, -54); c.closePath(); }, COL.yellow, 0);
  c.restore();
};
const g2Flow = (c: Ctx) => {
  ground(c);
  shadow(c, 450, 988, 340, 16);
  shape(c, () => rrect(c, 100, 110, 680, 870, 8), WHITE, 5);
  sun(c, 440, 260, 70);
  for (let i = 0; i < 5; i++) { const bx = 150 + i * 118; shape(c, () => rrect(c, bx, 600, 90, 90, 8), COL.paper, 5); if (i < 4) arrow(c, [[bx + 96, 645], [bx + 114, 645]], INK, 6); }
  arrow(c, [[400, 335], [215, 585]], INK, 8);
  cardPile(c, 880, 790, 240, 160, () => diya(c, 880, 806, 0.7));
};

// ================================================================ term cards
const term1Coconut = (c: Ctx) => {
  ground(c, COL.sky);
  sun(c, 910, 170, 70);
  shape(c, () => { c.moveTo(0, 920); c.quadraticCurveTo(540, 850, 1080, 920); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, COL.green);
  palm(c, 440, 1000, 1);
};
const term3Tank = (c: Ctx) => {
  ground(c, COL.sky);
  sun(c, 150, 150, 60);
  c.fillStyle = COL.green; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 6);
  const wall = () => rrect(c, 240, 420, 600, 580, 0);
  shape(c, wall, "#f0c98a"); shade(c, wall, "#d4a564", -40, 0, 0.45);
  shape(c, () => rrect(c, 226, 396, 628, 40, 6), "#d9a86a");
  for (const wy of [500, 700]) for (const wx of [300, 495, 690]) { shape(c, () => rrect(c, wx, wy, 90, 110, 6), COL.sky, 5); line(c, [[wx + 45, wy], [wx + 45, wy + 110]], 4); line(c, [[wx, wy + 55], [wx + 90, wy + 55]], 4); }
  shape(c, () => rrect(c, 495, 870, 90, 130, 8), COL.brown, 5);
  // the black tank on the roof, and the pipe from it down the side of the building
  line(c, [[648, 380], [872, 380], [872, 1000]], 26, INK); line(c, [[648, 380], [872, 380], [872, 1000]], 16, COL.steelDk);
  const tank = () => rrect(c, 430, 240, 220, 170, 26);
  shape(c, tank, COL.black); shade(c, tank, "#242028", -30, -10, 0.6);
  line(c, [[436, 300], [644, 300]], 4, COL.greyDk); line(c, [[436, 350], [644, 350]], 4, COL.greyDk);
  shape(c, () => ell(c, 540, 240, 110, 26), "#4a4550"); shape(c, () => rrect(c, 515, 204, 50, 22, 6), COL.greyDk, 5);
};

export const ic_energyStoredEnergyL4 = cards("sci.energy.stored-energy.L4", [
  e1Card0, e1Card1, e1Card2, e1Card3, // setup.e1.0-3
  e2Card0, e2Card1, e2Card2, e2Card3, // setup.e2.0-3
  e1Flow, e2Flow, a1Flow, a2Flow, a3Flow, p1Flow, g1Flow, g2Flow, // flow.e1 e2 a1 a2 a3 p1 g1 g2
  term1Coconut, term3Tank, // term.1 term.3
]);
