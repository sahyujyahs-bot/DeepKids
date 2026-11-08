import type { Ctx } from "./core";
import type { Pose } from "./flatKit";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// HEART AND LUNGS ON THE CLOCK (sci.body.organs-inside.L4) · set-up cards for the pulse timeline on the
// bottom stair and the chest tape, then the flow cards and three term cards. Same child and grown-up as
// the rest of the kit; every person is drawn with person() and holds things at the hand it returns.

const FLOOR = 880;
const FLOORCOL = "#e4d6bb";

// ---------------------------------------------------------------- geometry of a person (same sums as person())
const geo = (x: number, y: number, h: number, p: Pose = {}) => {
  const ad = !!p.adult, legLen = h * (ad ? 0.46 : 0.4), hip = p.sit ? y - h * 0.07 : y - legLen, sh = hip - h * (ad ? 0.3 : 0.27);
  const torsoW = h * (ad ? 0.27 : 0.25), head = h * (ad ? 0.115 : 0.15), hy = sh - head * 1.12;
  return { hip, sh, torsoW, head, hy, top: hy - head * 1.25, shL: [x - torsoW * 0.42, sh + h * 0.03] as [number, number], shR: [x + torsoW * 0.42, sh + h * 0.03] as [number, number], mouth: [x, hy + head * 0.46] as [number, number] };
};
// the elbow and the forearm angle of a reaching arm: the same two-bone solve person() uses
const armSolve = (x: number, y: number, h: number, p: Pose, side: -1 | 1, t: [number, number]) => {
  const g = geo(x, y, h, p), [sx, sy] = side < 0 ? g.shL : g.shR, l1 = h * 0.17, l2 = h * 0.155;
  const full = l1 + l2, dx = t[0] - sx, dy = t[1] - sy, d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1), full * 0.999), a = Math.atan2(dy, dx);
  const th = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const ea = a + side * th, ex = sx + Math.cos(ea) * l1, ey = sy + Math.sin(ea) * l1, wx = sx + Math.cos(a) * d, wy = sy + Math.sin(a) * d;
  return { ex, ey, wx, wy, an: Math.atan2(wy - ey, wx - ex), sx, sy };
};
type Who = { x: number; y: number; h: number; p: Pose };
// a held thing: the person is already drawn; the object's middle goes a little past the wrist along the
// forearm, then a gripping hand is drawn over it at the wrist
const grip = (c: Ctx, w: Who, side: -1 | 1, wrist: [number, number], draw: (ox: number, oy: number, an: number) => void) => {
  const t = side < 0 ? w.p.reachL! : w.p.reachR!, { an } = armSolve(w.x, w.y, w.h, w.p, side, t), s = w.h / 1500;
  draw(wrist[0] + Math.cos(an) * 70 * s, wrist[1] + Math.sin(an) * 70 * s, an);
  const ad = !!w.p.adult;
  hand(c, wrist[0], wrist[1], an, s, ad ? SKIN.adult : SKIN.child, ad ? CLOTH.adult : CLOTH.child);
};

// ---------------------------------------------------------------- the room
const room = (c: Ctx) => { ground(c); c.fillStyle = FLOORCOL; c.fillRect(0, FLOOR, D, D - FLOOR); line(c, [[0, FLOOR], [D, FLOOR]], 5); };
// a wooden chair facing the viewer; the seat top at seatY
const chair = (c: Ctx, x: number, seatY: number, w: number) => {
  const t = 22, back = seatY - 250;
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 - 20) - t / 2, back, t, seatY - back + 8, 6), COL.woodDk);
  shape(c, () => rrect(c, x - w / 2 + 12, back + 10, w - 24, 38, 8), COL.wood);
  shape(c, () => rrect(c, x - w / 2 + 12, back + 95, w - 24, 26, 8), COL.wood);
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 - 64) - t / 2, seatY + 10, t, FLOOR - seatY - 10, 4), COL.woodDk);
  shadow(c, x + 14, FLOOR + 3, w * 0.55, 14);
  shape(c, () => rrect(c, x - w / 2, seatY, w, 32, 8), COL.wood);
  shade(c, () => rrect(c, x - w / 2, seatY, w, 32, 8), COL.woodDk, 0, 16);
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 - 20) - t / 2, seatY + 32, t, FLOOR - seatY - 32, 4), COL.wood);
};
// a low wooden stool, top at topY
const stool = (c: Ctx, x: number, topY: number, w: number) => {
  shadow(c, x + 12, FLOOR + 3, w * 0.5, 12);
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * (w / 2 - 26) - 11, topY + 20, 22, FLOOR - topY - 20, 4), COL.wood);
  shape(c, () => rrect(c, x - w / 2, topY, w, 26, 8), COL.wood);
  shade(c, () => rrect(c, x - w / 2, topY, w, 26, 8), COL.woodDk, 0, 13);
};
// stairs rising to the left; xR is the front edge of the bottom step
const stair = (c: Ctx, xR: number, n: number, stepW: number, stepH: number) => {
  for (let i = n - 1; i >= 0; i--) {
    const top = FLOOR - (i + 1) * stepH, right = xR - i * stepW;
    shape(c, () => polyP(c, [[-20, top], [right, top], [right, FLOOR], [-20, FLOOR]]), COL.steelIn, 6);
    shape(c, () => polyP(c, [[-20, top + 3], [right - 3, top + 3], [right - 3, top + 16], [-20, top + 16]]), COL.steel, 0);
  }
};
const stopwatch = (c: Ctx, x: number, y: number, r: number, txt: string, onSurface = false) => {
  if (onSurface) shadow(c, x + r * 0.12, y + r + 5, r * 0.85, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.15, y - r - r * 0.28, r * 0.3, r * 0.34, 4), COL.greyDk, 5);
  shape(c, () => rrect(c, x - r * 0.11, y - r - r * 0.4, r * 0.22, r * 0.14, 3), COL.greyDk, 4);
  shape(c, () => rrect(c, x + r * 0.55, y - r * 0.95, r * 0.22, r * 0.26, 4), COL.greyDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, r * 0.22, r * 0.12);
  shape(c, () => ell(c, x, y, r * 0.78, r * 0.78), WHITE, 5);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62]], Math.max(3, r * 0.05)); }
  const hh = r * 0.5, w = hh * 0.8 * (txt.length - 1) + hh * 0.6;
  write(c, txt, x - w / 2, y - hh / 2, hh, INK, Math.max(4, r * 0.08));
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, txt: string) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.14), COL.black);
  shape(c, () => rrect(c, x - w / 2 + 7, y - h / 2 + 16, w - 14, h - 32, 6), "#dff3f7", 3);
  const hh = w * 0.42, tw = hh * 0.8 * (txt.length - 1) + hh * 0.6;
  shape(c, () => ell(c, x, y + h * 0.1, w * 0.17, w * 0.17), WHITE, 4);
  line(c, [[x, y + h * 0.1], [x, y + h * 0.1 - w * 0.11]], 3); line(c, [[x, y + h * 0.1], [x + w * 0.09, y + h * 0.1]], 3);
  write(c, txt, x - tw / 2, y - h * 0.38, hh, INK, 5);
};
// a notebook held up facing the viewer, with a little table of numbers on the page
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rows: string[][]) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), COL.paper);
  for (let k = 0; k < 6; k++) { const sx = x - w / 2 + 22 + k * ((w - 44) / 5); shape(c, () => ell(c, sx, y - h / 2 + 2, 9, 9), COL.greyDk, 3); }
  const cols = rows[0].length, cw = (w - 30) / cols, rh = Math.min(44, (h - 60) / (rows.length + 1));
  line(c, [[x - w / 2 + 15, y - h / 2 + 32 + rh], [x + w / 2 - 15, y - h / 2 + 32 + rh]], 3, COL.greyDk);
  for (let k = 1; k < cols; k++) line(c, [[x - w / 2 + 15 + k * cw, y - h / 2 + 30], [x - w / 2 + 15 + k * cw, y - h / 2 + 32 + rh * (rows.length + 1)]], 3, COL.greyDk);
  rows.forEach((r, i) => r.forEach((t, j) => write(c, t, x - w / 2 + 15 + j * cw + cw / 2 - (t.length * 0.8 * (rh * 0.6)) / 2 + rh * 0.06, y - h / 2 + 40 + rh * (i + 1) + rh * 0.08, rh * 0.6, INK, 4)));
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -len / 2, -11, len * 0.82, 22, 3), COL.yellow, 4);
  shape(c, () => polyP(c, [[len * 0.32, -11], [len / 2, 0], [len * 0.32, 11]]), COL.wood, 4);
  shape(c, () => polyP(c, [[len * 0.44, -4], [len / 2, 0], [len * 0.44, 4]]), INK, 0);
  shape(c, () => rrect(c, -len / 2 - 2, -11, 18, 22, 3), COL.pink, 4);
  c.restore();
};
// a speech bubble; its tail points at (tx, ty)
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  const bx = Math.max(x + 30, Math.min(x + w - 30, tx)), by = ty < y ? y : y + h;
  shape(c, () => polyP(c, [[bx - 22, by], [tx, ty], [bx + 22, by]]), WHITE, 5);
  shape(c, () => rrect(c, x, y, w, h, 24), WHITE, 5);
  line(c, [[bx - 18, by], [bx + 18, by]], 8, WHITE);
};
const heart = (c: Ctx, x: number, y: number, s: number, col = COL.red, lw = 5) => shape(c, () => { c.moveTo(x, y + s); c.bezierCurveTo(x - s * 1.35, y - s * 0.05, x - s * 0.65, y - s * 1.05, x, y - s * 0.4); c.bezierCurveTo(x + s * 0.65, y - s * 1.05, x + s * 1.35, y - s * 0.05, x, y + s); c.closePath(); }, col, lw);
// red pulse ripples beside a wrist point
const pulseMarks = (c: Ctx, x: number, y: number, s = 1) => { for (const r of [22, 36]) { c.beginPath(); c.arc(x, y, r * s, Math.PI * 0.75, Math.PI * 1.45); c.strokeStyle = RED; c.lineWidth = 5 * s; c.lineCap = "round"; c.stroke(); } };
// the yellow tape: a strip along pts, with centimetre ticks and a metal tip at the end
const tapeStrip = (c: Ctx, pts: number[][], w: number, tip = true) => {
  line(c, pts, w + 9, INK); line(c, pts, w, COL.yellow);
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1], len = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / len, ny = (bx - ax) / len;
    for (let d = 10; d < len; d += 14) { const k = d % 70 < 7 ? 0.9 : 0.5, px = ax + ((bx - ax) * d) / len, py = ay + ((by - ay) * d) / len; line(c, [[px + nx * w * 0.45, py + ny * w * 0.45], [px + nx * w * (0.45 - k * 0.6), py + ny * w * (0.45 - k * 0.6)]], 2.5); }
  }
  if (tip) { const [ax, ay] = pts[pts.length - 2], [bx, by] = pts[pts.length - 1], an = Math.atan2(by - ay, bx - ax); c.save(); c.translate(bx, by); c.rotate(an); shape(c, () => rrect(c, -4, -w / 2 - 3, 16, w + 6, 3), COL.steelDk, 4); c.restore(); }
};
// the tape round a chest: the front of the band, slightly curved, centre (x, y)
const tapeBand = (c: Ctx, x: number, y: number, halfW: number) => {
  const path = () => { c.moveTo(x - halfW, y - 14); c.quadraticCurveTo(x, y + 2, x + halfW, y - 14); c.lineTo(x + halfW, y + 14); c.quadraticCurveTo(x, y + 30, x - halfW, y + 14); c.closePath(); };
  shape(c, path, COL.yellow, 5);
  for (let d = -halfW + 10; d < halfW - 4; d += 14) { const t = d / halfW, sag = (1 - t * t) * 8; line(c, [[x + d, y - 12 + sag], [x + d, y - 12 + sag + (Math.abs(d) % 70 < 7 ? 16 : 9)]], 2.5); }
};

// ---------------------------------------------------------------- the poses used more than once
const CH = 480, CHAIR_X = 370, SEAT = 640, CHAIR_W = 330;
// the child sitting cross-legged, right hand's fingers on the left wrist, in the lap
const childPulse = (c: Ctx, x: number, y: number, h: number) => {
  const W: [number, number] = [x - h * 0.03, y - h * 0.095];
  const an = armSolve(x, y, h, { sit: true }, 1, W).an, R: [number, number] = [W[0] - Math.cos(an) * h * 0.045, W[1] - Math.sin(an) * h * 0.045];
  person(c, x, y, h, { sit: true, dir: 1, reachL: W, reachR: R });
  pulseMarks(c, W[0] - h * 0.015, W[1] - h * 0.01, h / 480);
};
// the grown-up standing, a phone stopwatch held up in front
const parentPhone = (c: Ctx, x: number, txt: string, h = 660) => {
  const w: Who = { x, y: FLOOR, h, p: { adult: true, reachL: [x - 150, FLOOR - h * 0.7] } };
  const { handL } = person(c, x, FLOOR, h, w.p);
  grip(c, w, -1, handL, (ox, oy, an) => { c.save(); c.translate(ox, oy); c.rotate(an + Math.PI / 2); phone(c, 0, -44, 84, 160, txt); c.restore(); });
};
// the grown-up standing, writing in a notebook held up in the other hand
const parentWrites = (c: Ctx, x: number, rows: string[][], h = 660) => {
  const w: Who = { x, y: FLOOR, h, p: { adult: true, reachL: [x - 108, FLOOR - h * 0.46], armR: [Math.PI * 0.38, Math.PI * 0.72] } };
  const { handL, handR } = person(c, x, FLOOR, h, w.p);
  const nb = { x: x - 10, y: FLOOR - h * 0.56, w: 190, h: 230 };
  notebook(c, nb.x, nb.y, nb.w, nb.h, rows);
  const { an } = armSolve(x, FLOOR, h, w.p, -1, w.p.reachL!), s = h / 1500;
  hand(c, handL[0], handL[1], an, s, SKIN.adult, CLOTH.adult);
  const an2 = Math.PI * 0.72, ox = handR[0] + Math.cos(an2) * 70 * s, oy = handR[1] + Math.sin(an2) * 70 * s;
  pencil(c, ox, oy, 150, Math.atan2(nb.y + nb.h / 2 - 14 - oy, nb.x - 40 - ox));
  hand(c, handR[0], handR[1], an2, s, SKIN.adult, CLOTH.adult);
};
// the grown-up standing with a stopwatch in the near hand, counting out loud
const parentCounts = (c: Ctx, x: number, txt: string, h = 660) => {
  const w: Who = { x, y: FLOOR, h, p: { adult: true, reachL: [x - 150, FLOOR - h * 0.68] } };
  const { handL } = person(c, x, FLOOR, h, w.p);
  grip(c, w, -1, handL, (ox, oy, an) => stopwatch(c, ox + Math.cos(an) * 48, oy + Math.sin(an) * 48, 40, txt));
  const g = geo(x, FLOOR, h, w.p);
  bubble(c, x - 300, 60, 280, 110, x - 30, g.hy - g.head * 0.7);
  write(c, "1 2 3", x - 265, 83, 62, INK, 7);
};
// the child standing on the bottom stair with a step-up and step-down arrow beside the step
const childOnStep = (c: Ctx) => {
  stair(c, 560, 3, 220, 80);
  person(c, 440, FLOOR - 80, CH, { armL: [Math.PI * 0.68, Math.PI * 0.6], armR: [Math.PI * 0.32, Math.PI * 0.4] });
  arrow(c, [[612, FLOOR - 12], [612, FLOOR - 80]]);
  arrow(c, [[664, FLOOR - 80], [664, FLOOR - 12]]);
};
// the chest-tape scene: the child on the chair with arms out, the tape round her chest, the grown-up
// holding the tape's end at the front; returns the child's geometry
const tapeScene = (c: Ctx) => {
  const x = 400, h = CH, y = SEAT, g = geo(x, y, h, { sit: true });
  chair(c, x, SEAT, CHAIR_W);
  person(c, x, y, h, { sit: true, dir: 1, reachL: [x - 150, g.sh - 36], reachR: [x + 150, g.sh - 36] });
  const bandY = g.sh + h * 0.075;
  tapeBand(c, x, bandY, h * 0.118);
  const px = 640, ph = 700, endAt: [number, number] = [x + 18, bandY + 6];
  const w: Who = { x: px, y: FLOOR, h: ph, p: { adult: true, reachL: endAt } };
  const { handL } = person(c, px, FLOOR, ph, w.p);
  tapeStrip(c, [[handL[0] + 10, handL[1] + 16], [handL[0] + 40, handL[1] + 90], [handL[0] + 95, handL[1] + 160]], 24);
  const { an } = armSolve(px, FLOOR, ph, w.p, -1, endAt);
  hand(c, handL[0], handL[1], an, ph / 1500, SKIN.adult, CLOTH.adult);
  return { g, px, ph, x, bandY };
};
const readOut = (c: Ctx, px: number, ph: number, txt: string) => {
  const g = geo(px, FLOOR, ph, { adult: true });
  bubble(c, px - 90, 40, 300, 104, px + 10, g.top + 30);
  write(c, txt, px - 60, 62, 60, INK, 7);
};

// ================================================================ set-up cards
// e1.0: the child sits on the chair, fingers on her wrist; the grown-up holds a phone stopwatch
const e1s0 = (c: Ctx) => { room(c); chair(c, CHAIR_X, SEAT, CHAIR_W); childPulse(c, CHAIR_X, SEAT, CH); parentPhone(c, 800, "15"); };
// e1.1: the child steps up and down on the bottom stair; the grown-up counts the seconds out loud
const e1s1 = (c: Ctx) => { room(c); childOnStep(c); parentCounts(c, 860, "15"); };
// e1.2: the child rests on the chair; the grown-up writes the numbers in the table
const e1s2 = (c: Ctx) => {
  room(c); chair(c, CHAIR_X, SEAT, CHAIR_W);
  person(c, CHAIR_X, SEAT, CH, { sit: true, dir: 1, reachL: [CHAIR_X - 96, SEAT - 28], reachR: [CHAIR_X + 96, SEAT - 28] });
  parentWrites(c, 810, [["21", "84"], ["27", "108"]]);
};
// e1.3: step-ups again, for 30 and then 60 seconds: two stopwatches on a stool
const e1s3 = (c: Ctx) => { room(c); childOnStep(c); stool(c, 850, 660, 300); stopwatch(c, 770, 595, 60, "30", true); stopwatch(c, 930, 595, 60, "60", true); };
// e1.4: after the last round, four counts in a row; the grown-up writes the four numbers
const e1s4 = (c: Ctx) => { room(c); chair(c, CHAIR_X, SEAT, CHAIR_W); childPulse(c, CHAIR_X, SEAT, CH); parentWrites(c, 810, [["40", "34"], ["31", "29"]]); };
// e2.0: the tape round the chest, just under the armpits
const e2s0 = (c: Ctx) => { room(c); tapeScene(c); };
// e2.1: read at the end of a quiet breath out
const e2s1 = (c: Ctx) => {
  room(c); const { g, px, ph } = tapeScene(c);
  const m = g.mouth; for (const k of [-1, 0, 1]) line(c, [[m[0] + 55, m[1] + k * 16], [m[0] + 95 + Math.abs(k) * -10, m[1] + k * 26]], 5, COL.blueDk);
  readOut(c, px, ph, "58 cm");
};
// e2.2: read at the top of the deepest breath in: air flows in, the chest swells
const e2s2 = (c: Ctx) => {
  room(c); const { g, px, ph, x } = tapeScene(c);
  arrow(c, [[x - 150, g.mouth[1] - 120], [x - 40, g.mouth[1] - 12]], COL.blueDk, 8);
  arrow(c, [[x - 66, g.sh + 84], [x - 125, g.sh + 84]], RED, 8); arrow(c, [[x + 66, g.sh + 84], [x + 125, g.sh + 84]], RED, 8);
  readOut(c, px, ph, "62 cm");
};

// ================================================================ flow cards
// a line graph on a sheet of paper: axes, a few light grid lines, one or two lines
const graph = (c: Ctx, x0: number, y0: number, w: number, h: number, series: { col: string; pts: number[][] }[], yLabels: string[]) => {
  shape(c, () => rrect(c, x0 - 70, y0 - h - 50, w + 120, h + 120, 10), COL.paper);
  for (let k = 1; k <= 4; k++) line(c, [[x0, y0 - (h * k) / 4], [x0 + w, y0 - (h * k) / 4]], 2, COL.grey);
  arrow(c, [[x0, y0], [x0, y0 - h - 20]], INK, 5); arrow(c, [[x0, y0], [x0 + w + 20, y0]], INK, 5);
  yLabels.forEach((t, i) => write(c, t, x0 - 64, y0 - (h * (i + 1)) / 4 - 11, 22, INK, 3.5));
  series.forEach((s) => { line(c, s.pts.map(([t, v]) => [x0 + t * w, y0 - v * h]), 8, s.col); s.pts.forEach(([t, v]) => shape(c, () => ell(c, x0 + t * w, y0 - v * h, 7, 7), WHITE, 4)); });
};
// flow.e1: the child sits by the stair counting her pulse; the stopwatch on the floor; the graph on the wall
const flowE1 = (c: Ctx) => {
  room(c); stair(c, 300, 3, 110, 80);
  graph(c, 720, 560, 260, 200, [{ col: COL.red, pts: [[0, 0.2], [0.15, 0.55], [0.3, 0.72], [0.45, 0.8], [0.55, 0.78], [0.65, 0.45], [0.8, 0.3], [1, 0.24]] }], ["", "", "", ""]);
  heart(c, 650, 350, 22);
  childPulse(c, 500, FLOOR, 500);
  stopwatch(c, 790, FLOOR - 72, 68, "15", true);
};
// flow.e2: the child measures her own chest with the tape
const flowE2 = (c: Ctx) => {
  room(c);
  const x = 520, h = 600, g = geo(x, FLOOR, h), bandY = g.sh + h * 0.075;
  const w: Who = { x, y: FLOOR, h, p: { reachL: [x - 165, g.sh - 30], reachR: [x + 150, bandY + 95] } };
  const { handR } = person(c, x, FLOOR, h, w.p);
  tapeBand(c, x, bandY, h * 0.118);
  tapeStrip(c, [[x + h * 0.1, bandY + 6], [handR[0] - 6, handR[1] - 2]], 24, false);
  grip(c, w, 1, handR, (ox, oy, an) => tapeStrip(c, [[ox - Math.cos(an) * 30, oy - Math.sin(an) * 30], [ox + Math.cos(an) * 85, oy + Math.sin(an) * 85]], 24));
};
// a thought cloud: a union of circles with one outline
const cloud = (c: Ctx, cx: number, cy: number, w: number, h: number, tail: [number, number]) => {
  const blobs: number[][] = [[cx - w * 0.3, cy, h * 0.55], [cx + w * 0.3, cy, h * 0.55], [cx, cy - h * 0.15, h * 0.62], [cx - w * 0.05, cy + h * 0.2, h * 0.5], [cx + w * 0.1, cy + h * 0.22, h * 0.48]];
  const dots = [0.75, 0.5, 0.25].map((t, i) => [cx + (tail[0] - cx) * t, cy + h * 0.5 + (tail[1] - cy - h * 0.5) * t, 18 - i * 5]);
  for (const [x, y, r] of [...blobs, ...dots]) shape(c, () => ell(c, x, y, r + 5, r + 5), INK, 0);
  for (const [x, y, r] of [...blobs, ...dots]) shape(c, () => ell(c, x, y, r, r), WHITE, 0);
};
const lungs = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y - s * 1.1], [x, y - s * 0.3]], s * 0.28, INK); line(c, [[x, y - s * 1.1], [x, y - s * 0.3]], s * 0.14, COL.pink);
  for (const k of [-1, 1]) { const p = () => { c.moveTo(x + k * s * 0.12, y - s * 0.4); c.quadraticCurveTo(x + k * s * 1.05, y - s * 0.6, x + k * s * 0.95, y + s * 0.5); c.quadraticCurveTo(x + k * s * 0.8, y + s * 1.05, x + k * s * 0.15, y + s * 0.9); c.closePath(); }; shape(c, p, COL.pink, 5); }
};
// flow.a1: two clocks: one hand on the wrist, one on the belly; the heart and the lungs in thought clouds
const flowA1 = (c: Ctx) => {
  room(c);
  const x = 540, h = 520, y = FLOOR, g = geo(x, y, h, { sit: true });
  const W: [number, number] = [x - 20, g.hip - 40];
  const an = armSolve(x, y, h, { sit: true }, 1, W).an, R: [number, number] = [W[0] - Math.cos(an) * h * 0.045, W[1] - Math.sin(an) * h * 0.045];
  person(c, x, y, h, { sit: true, dir: 1, reachL: W, reachR: R });
  pulseMarks(c, W[0] - 10, W[1] - 6);
  cloud(c, 230, 250, 300, 180, [x - 70, g.top - 10]); heart(c, 180, 250, 52); write(c, "85", 240, 215, 64, INK, 7);
  cloud(c, 850, 250, 300, 180, [x + 70, g.top - 10]); lungs(c, 800, 250, 60); write(c, "20", 870, 215, 64, INK, 7);
};
// flow.a2: waiting for a race that never starts: the chair faces the step, the grown-up holds the stopwatch up
const flowA2 = (c: Ctx) => {
  room(c); stair(c, 230, 2, 120, 80); chair(c, 470, SEAT, CHAIR_W); childPulse(c, 470, SEAT, CH);
  const x = 870, h = 660, w: Who = { x, y: FLOOR, h, p: { adult: true, reachL: [x - 120, FLOOR - h * 0.95] } };
  const { handL } = person(c, x, FLOOR, h, w.p);
  grip(c, w, -1, handL, (ox, oy, an) => stopwatch(c, ox + Math.cos(an) * 52, oy + Math.sin(an) * 52, 44, "0"));
};
// flow.a3: a strip of dots, one per heartbeat, closer on the in-breath and wider apart on the out-breath
const flowA3 = (c: Ctx) => {
  ground(c);
  const y = 560, x0 = 80, x1 = 1000;
  shape(c, () => rrect(c, x0, y - 110, x1 - x0, 220, 6), COL.paper);
  // the breath line above: up = breathing in, down = breathing out
  const seg = [[80, 300, 28], [300, 560, 42], [560, 760, 28], [760, 1000, 42]];
  const wave: number[][] = []; for (let x = x0; x <= x1; x += 8) { const t = ((x - x0) / (x1 - x0)) * 2; const u = t % 1; const v = t < 1 ? (u < 0.48 ? u / 0.48 : 1 - (u - 0.48) / 0.52) : u < 0.48 ? u / 0.48 : 1 - (u - 0.48) / 0.52; wave.push([x, 330 - v * 110]); }
  line(c, wave, 7, COL.blueDk);
  write(c, "4", 160, 215, 48, COL.blueDk, 5); write(c, "6", 400, 215, 48, COL.orange, 5);
  seg.forEach(([a, b, gap], i) => {
    const col = i % 2 === 0 ? COL.blueDk : COL.orange;
    shape(c, () => ell(c, (a + b) / 2, y, (b - a) / 2 - 8, 70), i % 2 === 0 ? "rgba(91,143,214,0.18)" : "rgba(243,154,60,0.18)", 0);
    c.beginPath(); ell(c, (a + b) / 2, y, (b - a) / 2 - 8, 70); c.strokeStyle = col; c.lineWidth = 6; c.stroke();
    for (let x = a + gap * 0.7; x < b - 6; x += gap) shape(c, () => ell(c, x, y, 9, 9), INK, 0);
    if (i > 0) line(c, [[a, y - 95], [a, y + 95]], 6, INK);
  });
  pencil(c, 560, 790, 260, 0.08); shadow(c, 580, 812, 150, 10);
};
// the animals of the clapping game, each with its heart and its beats a minute
const elephant = (c: Ctx, x: number, y: number) => {
  const G = "#a6a6b4", GD = "#86869a";
  shadow(c, x + 40, y + 4, 300, 20);
  line(c, [[x - 190, y - 230], [x - 240, y - 150], [x - 232, y - 120]], 14, INK); line(c, [[x - 190, y - 230], [x - 240, y - 150], [x - 232, y - 120]], 7, G);
  for (const lx of [x - 120, x + 60]) { shape(c, () => rrect(c, lx - 28, y - 210, 56, 210, 14), GD); }
  shape(c, () => ell(c, x - 10, y - 215, 215, 150), G); shade(c, () => ell(c, x - 10, y - 215, 215, 150), GD, 40, 30);
  for (const lx of [x - 60, x + 120]) { shape(c, () => rrect(c, lx - 30, y - 200, 60, 200, 14), G); shade(c, () => rrect(c, lx - 30, y - 200, 60, 200, 14), GD, 20, 0); }
  shape(c, () => ell(c, x + 160, y - 290, 70, 95), GD);
  shape(c, () => ell(c, x + 215, y - 290, 92, 88), G);
  const trunk = [[x + 280, y - 250], [x + 320, y - 170], [x + 318, y - 80], [x + 290, y - 40]];
  line(c, trunk, 54, INK); line(c, trunk, 42, G);
  shape(c, () => { c.moveTo(x + 262, y - 232); c.quadraticCurveTo(x + 280, y - 190, x + 262, y - 160); c.quadraticCurveTo(x + 258, y - 200, x + 245, y - 225); c.closePath(); }, WHITE, 4);
  shape(c, () => ell(c, x + 232, y - 312, 9, 10), INK, 0);
};
const cat = (c: Ctx, x: number, y: number) => {
  const O = COL.orange;
  shadow(c, x + 14, y + 3, 90, 12);
  line(c, [[x + 50, y - 20], [x + 110, y - 30], [x + 120, y - 80]], 26, INK); line(c, [[x + 50, y - 20], [x + 110, y - 30], [x + 120, y - 80]], 16, O);
  shape(c, () => { c.moveTo(x - 60, y); c.quadraticCurveTo(x - 72, y - 150, x, y - 150); c.quadraticCurveTo(x + 72, y - 150, x + 60, y); c.closePath(); }, O);
  shade(c, () => { c.moveTo(x - 60, y); c.quadraticCurveTo(x - 72, y - 150, x, y - 150); c.quadraticCurveTo(x + 72, y - 150, x + 60, y); c.closePath(); }, "#d27c25", 24, 0);
  for (const k of [-1, 1]) shape(c, () => ell(c, x + k * 28, y - 10, 24, 12), O, 4);
  for (const k of [-1, 1]) shape(c, () => polyP(c, [[x + k * 24, y - 190], [x + k * 56, y - 250], [x + k * 60, y - 178]]), O, 5);
  shape(c, () => ell(c, x, y - 180, 58, 50), O);
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * 22, y - 188, 11, 13), COL.greenLt, 3); shape(c, () => ell(c, x + k * 22, y - 188, 4, 10), INK, 0); }
  shape(c, () => polyP(c, [[x - 8, y - 166], [x + 8, y - 166], [x, y - 158]]), COL.pink, 3);
  for (const k of [-1, 1]) for (const d of [-8, 6]) line(c, [[x + k * 20, y - 160 + d], [x + k * 70, y - 164 + d * 1.6]], 3);
};
const mouse = (c: Ctx, x: number, y: number) => {
  const G = COL.grey;
  shadow(c, x + 8, y + 2, 60, 8);
  line(c, [[x + 40, y - 14], [x + 90, y - 20], [x + 120, y - 55]], 14, INK); line(c, [[x + 40, y - 14], [x + 90, y - 20], [x + 120, y - 55]], 6, COL.pink);
  shape(c, () => { c.moveTo(x - 72, y - 16); c.quadraticCurveTo(x - 40, y - 70, x + 10, y - 66); c.quadraticCurveTo(x + 60, y - 62, x + 50, y); c.lineTo(x - 50, y); c.closePath(); }, G);
  shape(c, () => ell(c, x - 18, y - 60, 16, 16), COL.pink, 4);
  shape(c, () => ell(c, x - 50, y - 36, 5, 5), INK, 0);
  shape(c, () => ell(c, x - 72, y - 16, 5, 5), COL.pink, 3);
  for (const d of [-6, 6]) line(c, [[x - 64, y - 18], [x - 95, y - 22 + d * 2]], 2.5);
};
const hummingbird = (c: Ctx, x: number, y: number) => {
  // a red flower on a stem from the ground, the bird hovering with its beak in the flower
  line(c, [[x - 40, FLOOR - 60 + 0], [x - 50, y + 60]], 7, COL.leafDk);
  shape(c, () => ell(c, x - 50, y + 60, 26, 20), COL.red, 4); shape(c, () => ell(c, x - 50, y + 58, 9, 7), COL.yellow, 2);
  for (const k of [-1, 1]) shape(c, () => ell(c, x + 22 + k * 10, y - 36, 14, 30, k * 0.5), COL.greenLt, 3.5);
  shape(c, () => ell(c, x + 14, y, 34, 20, -0.5), COL.green, 4);
  shape(c, () => polyP(c, [[x + 38, y + 12], [x + 60, y + 36], [x + 46, y + 30]]), COL.greenDk, 3.5);
  shape(c, () => ell(c, x - 14, y - 10, 15, 14), COL.green, 4);
  line(c, [[x - 24, y - 2], [x - 50, y + 46]], 4);
  shape(c, () => ell(c, x - 17, y - 14, 3.5, 3.5), INK, 0);
};
const flowA4 = (c: Ctx) => {
  room(c);
  const y = FLOOR;
  c.save(); c.translate(240, y); c.scale(0.85, 0.85); c.translate(-240, -y); elephant(c, 240, y); c.restore();
  cat(c, 640, y); mouse(c, 810, y); hummingbird(c, 985, y - 160);
  const tag = (x: number, ty: number, n: string) => { heart(c, x - (n.length * 0.8 * 40) / 2 - 20, ty + 18, 22); write(c, n, x - (n.length * 0.8 * 40) / 2 + 12, ty, 40, INK, 5); };
  tag(250, 480, "30"); tag(640, 560, "150"); tag(810, 690, "600"); tag(975, 560, "1000");
};
// small sky icons for the time of day: dawn, noon, evening, night
const dayIcons = (c: Ctx, xs: number[], y: number) => {
  const [a, b, d, n] = xs;
  shape(c, () => { c.arc(a, y, 22, Math.PI, 0); c.closePath(); }, COL.yellow, 4); line(c, [[a - 34, y], [a + 34, y]], 4);
  shape(c, () => ell(c, b, y - 4, 22, 22), COL.yellow, 4); for (let k = 0; k < 8; k++) { const an = (k / 8) * Math.PI * 2; line(c, [[b + Math.cos(an) * 30, y - 4 + Math.sin(an) * 30], [b + Math.cos(an) * 38, y - 4 + Math.sin(an) * 38]], 4); }
  shape(c, () => { c.arc(d, y + 2, 22, Math.PI, 0); c.closePath(); }, COL.orange, 4); line(c, [[d - 34, y + 2], [d + 34, y + 2]], 4);
  shape(c, () => { c.arc(n, y - 4, 22, -Math.PI * 0.45, Math.PI * 0.95); c.arc(n + 10, y - 8, 20, Math.PI * 0.85, -Math.PI * 0.4, true); c.closePath(); }, COL.yellow, 4);
};
// flow.p1: one line for each day: time of day along the bottom, beats a minute up the side
const flowP1 = (c: Ctx) => {
  ground(c);
  const x0 = 220, y0 = 760, w = 680, h = 480;
  graph(c, x0, y0, w, h, [
    { col: COL.orange, pts: [[0.08, 0.2], [0.35, 0.72], [0.6, 0.48], [0.9, 0.3]] },
    { col: COL.blueDk, pts: [[0.08, 0.26], [0.35, 0.56], [0.6, 0.62], [0.9, 0.34]] },
  ], ["", "90", "", "120"]);
  write(c, "60", x0 - 64, y0 - 11, 22, INK, 3.5);
  heart(c, x0 - 40, y0 - h - 60, 18);
  dayIcons(c, [x0 + 0.08 * w, x0 + 0.35 * w, x0 + 0.6 * w, x0 + 0.9 * w], y0 + 50);
};

// ================================================================ term cards
// term.0 pulse: two fingers on the inside of a wrist, ripples under the skin
const termPulse = (c: Ctx) => {
  ground(c);
  const y = 600;
  shadow(c, 470, y + 86, 330, 26);
  // the resting arm, palm up, from the left; the open hand first so the forearm covers its cuff
  hand(c, 640, y, 0, 1.7, SKIN.child, SKIN.child, true);
  const arm = () => { c.moveTo(40, y - 86); c.lineTo(540, y - 70); c.quadraticCurveTo(640, y - 62, 640, y); c.quadraticCurveTo(640, y + 62, 540, y + 70); c.lineTo(40, y + 86); c.closePath(); };
  shape(c, arm, SKIN.child); shade(c, arm, SKIN.childDk, 0, 36, 0.45);
  shape(c, () => rrect(c, 20, y - 100, 200, 200, 18), CLOTH.child); shade(c, () => rrect(c, 20, y - 100, 200, 200, 18), CLOTH.childDk, 0, 40);
  // the pulse under the skin at the wrist
  for (const r of [30, 48, 66]) { c.beginPath(); c.arc(560, y - 40, r, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = "round"; c.globalAlpha = 0.85; c.stroke(); } c.globalAlpha = 1;
  // the other hand from the upper right: a fist with the index and middle finger straight out onto the wrist
  const an = 2.25, s = 1.7, L = 118, fx = 560, fy = y - 52, hx = fx - Math.cos(an) * (34 + L) * s + Math.sin(an) * 13 * s, hy = fy - Math.sin(an) * (34 + L) * s - Math.cos(an) * 13 * s;
  hand(c, hx, hy, an, s, SKIN.child, CLOTH.child);
  c.save(); c.translate(hx, hy); c.rotate(an); c.scale(s, s);
  for (const k of [0, 1]) { const yy = -21.5 + k * 17; line(c, [[36, yy], [36 + L, yy + 2]], 27, INK); line(c, [[36, yy], [36 + L, yy + 2]], 17, SKIN.child); }
  c.restore();
};
// term.8 reflex: the hand jerks back from a hot tava before the child feels it
const termReflex = (c: Ctx) => {
  room(c);
  // the counter and the gas stove
  shape(c, () => rrect(c, 60, 600, 520, FLOOR - 600 + 20, 6), COL.steelIn); shade(c, () => rrect(c, 60, 600, 520, FLOOR - 600 + 20, 6), COL.steel, 0, 40, 0.7);
  shape(c, () => rrect(c, 110, 560, 420, 46, 8), COL.black);
  shape(c, () => ell(c, 320, 560, 90, 20), COL.greyDk, 4);
  for (let k = 0; k < 11; k++) { const fx = 240 + k * 18; shape(c, () => { c.moveTo(fx - 7, 558); c.quadraticCurveTo(fx, 505 - (k % 2) * 12, fx + 7, 558); c.closePath(); }, k % 3 === 1 ? COL.yellow : COL.blue, 3); }
  // the tava: a flat black iron pan, its handle to the left
  for (const k of [-1, 1]) line(c, [[330 + k * 110, 558], [330 + k * 110, 500]], 10, INK);
  line(c, [[200, 492], [80, 464]], 30, INK); line(c, [[200, 492], [80, 464]], 18, COL.black);
  shape(c, () => ell(c, 330, 492, 150, 28), COL.black); shape(c, () => ell(c, 330, 486, 130, 18), "#5a5560", 3);
  for (const k of [0, 1, 2]) line(c, [[300 + k * 30, 440], [310 + k * 30, 410], [300 + k * 30, 380]], 4, COL.greyDk);
  // the child, her near hand snatched up and back
  const x = 760, h = 560, w: Who = { x, y: FLOOR, h, p: { reachL: [x - 140, FLOOR - h * 0.84] } };
  const { handL } = person(c, x, FLOOR, h, w.p);
  const sv = armSolve(x, FLOOR, h, w.p, -1, w.p.reachL!);
  for (const r of [50, 75, 100]) { c.beginPath(); c.arc(handL[0] + 10, handL[1] + 10, r, Math.PI * 0.65, Math.PI * 1.25); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[handL[0] - 10, handL[1] + 150], [handL[0] - 10, handL[1] + 50]], RED, 9);
  // the signal: a yellow zigzag along the arm from the hand to the shoulder
  const zig: number[][] = [], legs = [[handL[0], handL[1]], [sv.ex, sv.ey], [sv.sx, sv.sy]];
  for (let i = 0; i < 2; i++) for (let k = 0; k <= 4; k++) { const t = k / 4, px = legs[i][0] + (legs[i + 1][0] - legs[i][0]) * t, py = legs[i][1] + (legs[i + 1][1] - legs[i][1]) * t, nx = -(legs[i + 1][1] - legs[i][1]), ny = legs[i + 1][0] - legs[i][0], nl = Math.hypot(nx, ny), off = k % 2 ? 9 : -9; zig.push([px + (nx / nl) * off, py + (ny / nl) * off]); }
  line(c, zig, 10, INK); line(c, zig, 5, COL.yellow);
};
// term.12 breath depth: a small balloon for a quiet breath, a big one for a deep breath, on the table
const termBalloons = (c: Ctx) => {
  room(c);
  const balloon = (x: number, r: number, col: string, dk: string, puffs: number) => {
    shadow(c, x + r * 0.1, FLOOR + 2, r * 1.0, r * 0.14);
    const body = () => ell(c, x, FLOOR - r * 0.95, r, r * 0.95);
    shape(c, body, col); shade(c, body, dk, r * 0.3, r * 0.15, 0.45);
    shape(c, () => polyP(c, [[x - r * 0.95 + 6, FLOOR - r * 0.5], [x - r * 1.2, FLOOR - r * 0.36], [x - r * 1.18, FLOOR - r * 0.62]]), col, 4);
    line(c, [[x - r * 0.6, FLOOR - r * 1.45], [x - r * 0.35, FLOOR - r * 1.7]], 7, WHITE);
    for (let k = 0; k < puffs; k++) { c.beginPath(); c.arc(x - r * 1.25 - 30 - k * 26, FLOOR - r * 0.5, 16 + k * 12, Math.PI * 0.6, Math.PI * 1.4); c.strokeStyle = COL.blueDk; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  };
  balloon(330, 110, COL.blue, COL.blueDk, 1);
  balloon(760, 230, COL.red, "#b83a2a", 3);
};

export const ic_bodyOrgansInsideL4 = cards("sci.body.organs-inside.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, termPulse, termReflex, termBalloons,
]);
