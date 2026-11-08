import type { Ctx } from "./core";
import type { Pose } from "./flatKit";
import { BG, COL, INK, RED, SH, WHITE, arrow, bowl, cards, ell, ground, line, person, plate, polyP, rnd, rrect, seed, shade, shadow, shape, shine, write } from "./flatKit";

// CAN ANIMALS COUNT, WAIT AND PLAN? (L4) · set-up cards for the three experiments, then card pictures.
const TABLE = "#ecd3a1", TABLE_DK = "#d9b87c", FLOOR = "#e9dcc0", SAND = "#f1d9a0", SAND_DK = "#d9ba76";
const PEA = "#e8c47a", PEA_DK = "#c2984e", RAISIN = "#5a3a4a", RAISIN_DK = "#3d2633", PENCIL = "#f4c542";
const D = 1080;

// ---------------------------------------------------------------- places
const tableTop = (c: Ctx) => { ground(c, TABLE); c.fillStyle = TABLE_DK; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5); };
const rectShadow = (c: Ctx, x: number, y: number, w: number, h: number, r: number) => { c.beginPath(); rrect(c, x + 12, y + 14, w, h, r); c.fillStyle = SH; c.fill(); };
// a room with a table seen from the front, its top showing; people stand at the left and right of the table
const FLOOR_Y = 860, TOP_Y = 540, TOP_FRONT = 650;
const room = (c: Ctx) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, FLOOR_Y, D, D - FLOOR_Y); line(c, [[0, FLOOR_Y], [D, FLOOR_Y]], 5); };
const table = (c: Ctx) => {
  shadow(c, 560, FLOOR_Y + 2, 330, 14);
  for (const lx of [268, 812]) shape(c, () => rrect(c, lx - 14, TOP_FRONT, 28, FLOOR_Y - TOP_FRONT, 4), TABLE_DK, 5);
  shape(c, () => polyP(c, [[260, TOP_Y], [820, TOP_Y], [860, TOP_FRONT], [220, TOP_FRONT]]), TABLE, 6);
  shape(c, () => polyP(c, [[220, TOP_FRONT], [860, TOP_FRONT], [860, TOP_FRONT + 28], [220, TOP_FRONT + 28]]), TABLE_DK, 6);
};
// a desk seen from above its far edge: the child sits behind it, only her top half showing over the edge
const DESK_Y = 700;
const desk = (c: Ctx) => { ground(c); shape(c, () => polyP(c, [[-20, DESK_Y], [1100, DESK_Y], [1100, 1100], [-20, 1100]]), TABLE, 6); c.fillStyle = TABLE_DK; c.fillRect(0, 1020, D, 60); line(c, [[0, 1020], [D, 1020]], 5); };
const seated = (c: Ctx, x: number, h: number, pose: Pose) => { c.save(); c.beginPath(); c.rect(0, 0, D, DESK_Y + 75); c.clip(); const r = person(c, x, DESK_Y + 300, h, pose); c.restore(); return r; };

// ---------------------------------------------------------------- things
// a white card with black dots (u, v in 0..1 of the card), centre (x, y), rotated; more() draws extras in card space
const dotCard = (c: Ctx, x: number, y: number, w: number, h: number, dots: number[][], rot = 0, more?: () => void) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  rectShadow(c, -w / 2, -h / 2, w, h, 16);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 16), WHITE, 6);
  dots.forEach(([u, v]) => shape(c, () => ell(c, -w / 2 + u * w, -h / 2 + v * h, w * 0.055, w * 0.055), INK, 0));
  more?.(); c.restore();
};
const SC3 = [[0.28, 0.3], [0.7, 0.42], [0.42, 0.74]], SC4 = [[0.25, 0.3], [0.72, 0.28], [0.35, 0.7], [0.65, 0.66]];
const R6 = [[0.25, 0.33], [0.5, 0.33], [0.75, 0.33], [0.25, 0.67], [0.5, 0.67], [0.75, 0.67]];
const SC7 = [[0.2, 0.3], [0.42, 0.22], [0.66, 0.35], [0.84, 0.6], [0.3, 0.6], [0.52, 0.72], [0.74, 0.8]];
const SC8 = [[0.15, 0.28], [0.38, 0.2], [0.6, 0.3], [0.85, 0.25], [0.22, 0.68], [0.45, 0.55], [0.68, 0.72], [0.88, 0.6]];
// a face-down card: blue back with a diagonal pattern
const cardBack = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  rectShadow(c, -w / 2, -h / 2, w, h, 14);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 14), COL.blue, 6);
  c.save(); c.beginPath(); rrect(c, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 8); c.clip();
  for (let k = -h; k < w + h; k += 26) line(c, [[-w / 2 + k, -h / 2], [-w / 2 + k - h, h / 2]], 4, COL.blueDk);
  c.restore(); c.restore();
};
// a black marker lying flat, centre (x, y)
const marker = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 10, 14, 150, 14);
  shape(c, () => rrect(c, -150, -20, 300, 40, 12), COL.black, 6);
  shape(c, () => rrect(c, 70, -22, 90, 44, 12), "#524c5c", 6);
  shape(c, () => polyP(c, [[-150, -12], [-178, -5], [-178, 5], [-150, 12]]), INK, 4);
  shine(c, [[-130, -8], [50, -8]], 6);
  c.restore();
};
// a pencil from its tip (tx, ty) back to (bx, by)
const pencil = (c: Ctx, tx: number, ty: number, bx: number, by: number) => {
  const an = Math.atan2(by - ty, bx - tx), L = Math.hypot(bx - tx, by - ty);
  c.save(); c.translate(tx, ty); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [34, -11], [34, 11]]), "#f1dcb0", 4);
  shape(c, () => polyP(c, [[0, 0], [12, -4], [12, 4]]), INK, 0);
  shape(c, () => rrect(c, 34, -11, L - 34, 22, 0), PENCIL, 5);
  shape(c, () => rrect(c, L - 28, -12, 28, 24, 6), COL.pink, 5);
  line(c, [[40, -3], [L - 34, -3]], 3, "#d9a829");
  c.restore();
};
// the results table on a sheet of paper, with ticks and a cross already in it
const resultsSheet = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  rectShadow(c, -w / 2, -h / 2, w, h, 8);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), COL.paper, 5);
  const cols = 4, rows = 4, gx = -w / 2 + w * 0.08, gy = -h / 2 + h * 0.1, gw = w * 0.84, gh = h * 0.8;
  for (let i = 0; i <= cols; i++) line(c, [[gx + (gw / cols) * i, gy], [gx + (gw / cols) * i, gy + gh]], 2.5, COL.greyDk);
  for (let j = 0; j <= rows; j++) line(c, [[gx, gy + (gh / rows) * j], [gx + gw, gy + (gh / rows) * j]], 2.5, COL.greyDk);
  const cell = (i: number, j: number): [number, number] => [gx + (gw / cols) * (i + 0.5), gy + (gh / rows) * (j + 0.5)];
  const tick = (i: number, j: number) => { const [cx, cy] = cell(i, j), s = gw / cols * 0.18; line(c, [[cx - s, cy], [cx - s * 0.2, cy + s * 0.8], [cx + s, cy - s * 0.9]], 5, COL.greenDk); };
  const cross = (i: number, j: number) => { const [cx, cy] = cell(i, j), s = gw / cols * 0.16; line(c, [[cx - s, cy - s], [cx + s, cy + s]], 5, RED); line(c, [[cx + s, cy - s], [cx - s, cy + s]], 5, RED); };
  tick(2, 1); tick(3, 1); tick(2, 2); cross(3, 2); tick(2, 3);
  c.restore();
};
const speech = (c: Ctx, x: number, y: number, rx: number, ry: number, tail: [number, number], label: string, lh: number) => {
  shape(c, () => { c.moveTo(x - rx * 0.1, y + ry * 0.9); c.lineTo(tail[0], tail[1]); c.lineTo(x + rx * 0.35, y + ry * 0.85); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x, y, rx, ry), WHITE, 6);
  shape(c, () => { c.moveTo(x - rx * 0.1, y + ry * 0.9); c.lineTo(tail[0], tail[1]); c.lineTo(x + rx * 0.35, y + ry * 0.85); }, WHITE, 0);
  write(c, label, x - lh * 0.3 * label.length, y - lh / 2, lh, INK, 9);
};
// a thought bubble: small bubbles from (fx, fy) up to the big cloud at (x, y); what() draws the picture inside
const thought = (c: Ctx, fx: number, fy: number, x: number, y: number, r: number, what: () => void) => {
  shape(c, () => ell(c, fx, fy, r * 0.12, r * 0.1), WHITE, 5);
  shape(c, () => ell(c, (fx + x) / 2, (fy + y) / 2 + r * 0.3, r * 0.2, r * 0.17), WHITE, 5);
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 1.3, y - r * 1.1, x - r * 0.2, y - r * 1.4, x, y - r * 0.9); c.bezierCurveTo(x + r * 0.3, y - r * 1.5, x + r * 1.4, y - r * 1.0, x + r, y); c.bezierCurveTo(x + r * 1.3, y + r * 0.9, x - r * 1.3, y + r * 0.9, x - r, y); c.closePath(); }, WHITE, 6);
  what();
};
// a stopwatch, centre (x, y): round face, a crown at the top, the hand at the top (just started)
const stopwatch = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.16, y - r * 1.3, r * 0.32, r * 0.35, 4), COL.steelDk, 4);
  shape(c, () => ell(c, x, y, r, r), COL.steel, 6);
  shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 4);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62]], 3); }
  line(c, [[x, y], [x, y - r * 0.6]], 5, RED);
  line(c, [[x, y], [x + r * 0.45, y + r * 0.1]], 4);
  shape(c, () => ell(c, x, y, r * 0.07, r * 0.07), INK, 0);
};
// a digital timer standing on the table, centre (x, y) of its face; shows minutes and seconds
const timerBox = (c: Ctx, x: number, y: number, w: number, h: number, m: string, s: string) => {
  shadow(c, x + 10, y + h / 2 + 6, w * 0.5, h * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 18), COL.blueDk, 6);
  shape(c, () => rrect(c, x - w * 0.42, y - h * 0.36, w * 0.84, h * 0.56, 8), "#dff5c4", 5);
  const th = h * 0.36, tw = th * 0.8 * (m.length + s.length) + th * 0.3;
  const x0 = x - tw / 2;
  write(c, m, x0, y - h * 0.26, th, INK, 7);
  const cx = x0 + th * 0.8 * m.length + th * 0.1;
  shape(c, () => ell(c, cx, y - h * 0.12, th * 0.06, th * 0.06), INK, 0); shape(c, () => ell(c, cx, y + h * 0.04, th * 0.06, th * 0.06), INK, 0);
  write(c, s, cx + th * 0.22, y - h * 0.26, th, INK, 7);
  shape(c, () => rrect(c, x - w * 0.1, y + h * 0.26, w * 0.2, h * 0.12, 6), COL.red, 4);
};
const pea = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), PEA, Math.max(2.5, r * 0.22));
  shade(c, () => ell(c, x, y, r, r * 0.92), PEA_DK, r * 0.3, r * 0.3, 0.5);
  line(c, [[x - r * 0.35, y - r * 0.25], [x - r * 0.05, y - r * 0.45]], Math.max(2, r * 0.16), PEA_DK);
};
// a sheet of paper with a traced circle and exactly n chickpeas spread inside it
const peaSheet = (c: Ctx, x: number, y: number, w: number, h: number, R: number, n: number, pr: number, sd: number) => {
  rectShadow(c, x - w / 2, y - h / 2, w, h, 10);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), COL.paper, 5);
  c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.strokeStyle = COL.greyDk; c.lineWidth = 4; c.stroke();
  const r = rnd(sd), pts: number[][] = [];
  let tries = 0;
  while (pts.length < n && tries++ < 20000) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (R - pr - 6), px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
    if (pts.every(([qx, qy]) => Math.hypot(px - qx, py - qy) > pr * 2.3)) pts.push([px, py]);
  }
  if (pts.length < n) throw new Error(`peaSheet: only ${pts.length} of ${n} peas fit`);
  pts.forEach(([px, py]) => pea(c, px, py, pr));
};
// a katori with n chickpeas heaped in rows of six
const katoriOfPeas = (c: Ctx, x: number, y: number, r: number, n: number) => {
  bowl(c, x, y, r);
  const rows = Math.ceil(n / 6), pr = 12, rowH = 21;
  if (rows > 1) shape(c, () => { c.moveTo(x - r * 0.9, y); c.lineTo(x - r * 0.9, y - (rows - 1) * rowH); c.quadraticCurveTo(x, y - rows * rowH - 14, x + r * 0.9, y - (rows - 1) * rowH); c.lineTo(x + r * 0.9, y); c.closePath(); }, PEA_DK, 5);
  for (let k = 0; k < rows; k++) {
    const inRow = Math.min(6, n - k * 6), off = k % 2 ? 6 : -6;
    for (let i = 0; i < inRow; i++) pea(c, x + (i - (inRow - 1) / 2) * 26 + off, y - 4 - k * rowH, pr);
  }
};
const raisin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.72, 0.3), RAISIN, 5);
  shade(c, () => ell(c, x, y, r, r * 0.72, 0.3), RAISIN_DK, r * 0.3, r * 0.25, 0.6);
  line(c, [[x - r * 0.5, y - r * 0.15], [x - r * 0.1, y - r * 0.35], [x + r * 0.3, y - r * 0.05]], 3, RAISIN_DK);
};
// a steel cup upside down, its rim on the table at (x, y)
const cupDown = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 16 * s, y + 4, 70 * s, 14 * s);
  const body = () => polyP(c, [[x - 48 * s, y - 128 * s], [x + 48 * s, y - 128 * s], [x + 64 * s, y], [x - 64 * s, y]]);
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, 26 * s, 0, 0.6);
  shape(c, () => ell(c, x, y - 128 * s, 48 * s, 10 * s), COL.steelIn, 5);
  shape(c, () => { c.moveTo(x - 64 * s, y); c.quadraticCurveTo(x, y + 22 * s, x + 64 * s, y); }, COL.steel, 6);
  shine(c, [[x - 34 * s, y - 108 * s], [x - 46 * s, y - 20 * s]], 7);
};
// a striped dishtowel filling a path; the path is given as a function drawing it
const towel = (c: Ctx, path: () => void) => {
  shape(c, path, COL.cloth, 6);
  c.save(); c.beginPath(); path(); c.clip();
  for (let yy = -200; yy < 1300; yy += 56) line(c, [[-50, yy], [1150, yy + 40]], 10, COL.teal);
  c.restore();
  c.beginPath(); path(); c.strokeStyle = INK; c.lineWidth = 6; c.lineJoin = "round"; c.stroke();
};
const toyCar = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 12, y + 8, 100, 14);
  shape(c, () => rrect(c, x - 90, y - 62, 180, 56, 14), COL.red, 6);
  shape(c, () => { c.moveTo(x - 50, y - 62); c.lineTo(x - 30, y - 110); c.lineTo(x + 40, y - 110); c.lineTo(x + 60, y - 62); c.closePath(); }, COL.red, 6);
  shape(c, () => { c.moveTo(x - 36, y - 68); c.lineTo(x - 24, y - 100); c.lineTo(x + 32, y - 100); c.lineTo(x + 44, y - 68); c.closePath(); }, COL.sky, 4);
  for (const wx of [x - 52, x + 52]) { shape(c, () => ell(c, wx, y - 6, 26, 26), INK, 0); shape(c, () => ell(c, wx, y - 6, 11, 11), COL.grey, 3); }
  shape(c, () => ell(c, x + 86, y - 42, 8, 8), COL.yellow, 3);
};
// a thick closed book lying flat, seen a little from above
const book = (c: Ctx, x: number, y: number, w: number, h: number, t: number) => {
  rectShadow(c, x - w / 2, y - h / 2 + t, w, h, 6);
  shape(c, () => rrect(c, x - w / 2, y - h / 2 + t, w, h, 6), COL.paper, 5);
  for (let k = 1; k < 5; k++) line(c, [[x - w / 2 + 10, y + h / 2 + t - k * (t / 5) * 0.9], [x + w / 2 - 6, y + h / 2 + t - k * (t / 5) * 0.9]], 2, COL.grey);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 6), COL.purple, 6);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, 34, h, 6), "#6b4fa8", 5);
  shape(c, () => rrect(c, x - w * 0.2, y - h * 0.3, w * 0.5, h * 0.42, 6), COL.paper, 4);
  line(c, [[x - w * 0.12, y - h * 0.15], [x + w * 0.2, y - h * 0.15]], 4, COL.greyDk); line(c, [[x - w * 0.12, y], [x + w * 0.12, y]], 4, COL.greyDk);
};
// a die showing three on the front, one on top and two on the side; front face centred (x, y), side a
const die = (c: Ctx, x: number, y: number, a: number) => {
  const h = a / 2, dx = a * 0.3, dy = -a * 0.26;
  shadow(c, x + 30, y + h + 10, a * 0.7, a * 0.09);
  shape(c, () => polyP(c, [[x - h, y - h], [x - h + dx, y - h + dy], [x + h + dx, y - h + dy], [x + h, y - h]]), "#fff3d6", 6);
  shape(c, () => polyP(c, [[x + h, y - h], [x + h + dx, y - h + dy], [x + h + dx, y + h + dy], [x + h, y + h]]), "#e3d3b0", 6);
  shape(c, () => rrect(c, x - h, y - h, a, a, 10), WHITE, 6);
  const pip = (px: number, py: number, r: number) => shape(c, () => ell(c, px, py, r, r), INK, 0);
  const pr = a * 0.085;
  pip(x - a * 0.27, y - a * 0.27, pr); pip(x, y, pr); pip(x + a * 0.27, y + a * 0.27, pr);
  c.save(); c.beginPath(); c.moveTo(x - h, y - h); c.lineTo(x - h + dx, y - h + dy); c.lineTo(x + h + dx, y - h + dy); c.lineTo(x + h, y - h); c.closePath(); c.clip();
  c.beginPath(); ell(c, x + dx / 2, y - h + dy / 2, pr * 1.1, pr * 0.6); c.fillStyle = INK; c.fill(); c.restore();
  c.save(); c.beginPath(); c.moveTo(x + h, y - h); c.lineTo(x + h + dx, y - h + dy); c.lineTo(x + h + dx, y + h + dy); c.lineTo(x + h, y + h); c.closePath(); c.clip();
  for (const k of [-0.25, 0.25]) { c.beginPath(); ell(c, x + h + dx / 2 + k * dx * 0.5, y + k * a + dy / 2, pr * 0.6, pr * 1.05); c.fillStyle = INK; c.fill(); }
  c.restore();
};
const banana = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y - r * 0.4); c.quadraticCurveTo(x - r * 0.2, y + r * 0.9, x + r, y - r * 0.5); c.quadraticCurveTo(x + r * 0.1, y + r * 0.35, x - r, y - r * 0.4); c.closePath(); }, COL.yellow, 6);
  shape(c, () => ell(c, x + r, y - r * 0.55, r * 0.1, r * 0.1), COL.soilDk, 3);
};
// a child's hand pointing with one finger; wrist at (x, y), the finger tip 130*s along angle an
const pointHand = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78, -36, 56, 72, 14), "#f39a3c", 6);
  shape(c, () => { c.moveTo(-26, -32); c.quadraticCurveTo(20, -42, 46, -30); c.lineTo(52, 30); c.quadraticCurveTo(10, 40, -26, 32); c.closePath(); }, "#b9794f", 6);
  for (let k = 1; k < 4; k++) shape(c, () => rrect(c, 38, -30 + k * 17, 38, 17, 8.5), "#b9794f", 5);
  shape(c, () => rrect(c, 34, -34, 96, 18, 9), "#b9794f", 5);
  shape(c, () => { c.moveTo(-4, -30); c.quadraticCurveTo(22, -60, 52, -50); c.quadraticCurveTo(64, -44, 50, -34); c.quadraticCurveTo(26, -32, 12, -18); c.closePath(); }, "#b9794f", 5);
  c.restore();
};
// a desert ant walking right, feet on y, body centre x; legs normal, on stilts (bristles glued on) or cut to stumps
const ant = (c: Ctx, x: number, y: number, s: number, legs: "normal" | "stilt" | "stump") => {
  const lift = legs === "stilt" ? 88 : legs === "stump" ? 26 : 50, body = y - lift * s, A = "#9a4a26", ADk = "#6e3217";
  // drawn with the head on the left, then mirrored so the ant faces right, the way it walks
  c.save(); c.translate(x, 0); c.scale(-1, 1); c.translate(-x, 0);
  shadow(c, x + 10 * s, y + 4, 90 * s, 10 * s);
  const legPts: number[][][] = [[[-26, 0.55], [-70, 1.1]], [[-6, 0.7], [-10, 1.0]], [[14, 0.5], [60, 1.1]]];
  legPts.forEach(([knee, foot]) => {
    const kx = x + knee[0] * s, ky = body - lift * s * (legs === "stump" ? 0.5 : 0.55) * knee[1] + lift * s * 0.2, fx = x + foot[0] * s, fy = y;
    line(c, [[x - 8 * s, body], [kx, ky], [fx, fy]], 7, INK);
    if (legs === "stilt") line(c, [[(kx + fx) / 2, (ky + fy) / 2], [fx, fy]], 5, "#f6ecd2");
    if (legs === "stump") shape(c, () => ell(c, fx, fy, 6 * s * 0.6, 4 * s * 0.6), RED, 2);
  });
  shape(c, () => ell(c, x + 48 * s, body - 6 * s, 34 * s, 22 * s), A, 5); shade(c, () => ell(c, x + 48 * s, body - 6 * s, 34 * s, 22 * s), ADk, 8 * s, 6 * s, 0.5);
  shape(c, () => ell(c, x - 6 * s, body, 22 * s, 15 * s), A, 5);
  shape(c, () => ell(c, x - 48 * s, body - 2 * s, 20 * s, 17 * s), A, 5);
  shape(c, () => ell(c, x - 58 * s, body - 5 * s, 4 * s, 4 * s), INK, 0);
  line(c, [[x - 60 * s, body - 14 * s], [x - 84 * s, body - 36 * s], [x - 96 * s, body - 30 * s]], 4); line(c, [[x - 52 * s, body - 16 * s], [x - 62 * s, body - 44 * s], [x - 74 * s, body - 46 * s]], 4);
  line(c, [[x - 68 * s, body + 4 * s], [x - 76 * s, body + 10 * s]], 4); line(c, [[x - 64 * s, body + 8 * s], [x - 70 * s, body + 16 * s]], 4);
  c.restore();
};
// a crow landing, facing left, feet at (x, y), wings raised
const crow = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const B = "#3d394c", W = "#524d63";
  const wing = (pts: number[][], col: string) => { shape(c, () => polyP(c, pts), col, 6); };
  wing([[20, -80], [60, -190], [120, -215], [150, -175], [110, -150], [95, -100]], B);
  wing([[-10, -82], [10, -200], [70, -240], [100, -205], [60, -170], [40, -100]], W);
  line(c, [[-14, -36], [-22, 0]], 8); line(c, [[18, -36], [14, 0]], 8);
  line(c, [[-40, 0], [-4, 0]], 7); line(c, [[0, 0], [34, 0]], 7);
  shape(c, () => polyP(c, [[50, -70], [140, -40], [130, -85], [60, -95]]), B, 6);
  shape(c, () => ell(c, 0, -72, 72, 42, -0.1), B, 6); shade(c, () => ell(c, 0, -72, 72, 42, -0.1), "#2a2736", 12, 14, 0.6);
  shape(c, () => ell(c, -70, -108, 34, 30), B, 6);
  shape(c, () => polyP(c, [[-98, -112], [-150, -98], [-96, -92]]), "#5a5566", 5);
  shape(c, () => ell(c, -76, -114, 7, 7), WHITE, 3); shape(c, () => ell(c, -78, -114, 3.5, 3.5), INK, 0);
  c.restore();
};
const puff = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 17, 12, 0.4), COL.paper, 3.5); };
// a footprint (shoe sole) on the floor, centre (x, y)
const footprint = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => ell(c, 0, -22, 26, 30), COL.steelDk, 4); shape(c, () => ell(c, 2, 30, 20, 18), COL.steelDk, 4);
  c.restore();
};

// ================================================================ SET-UP CARDS
// e1.0 · ten white cards and a black marker; one card shows three scattered dots
const setupE1_0 = (c: Ctx) => {
  tableTop(c);
  const r = rnd(3);
  for (let i = 0; i < 9; i++) dotCard(c, 330 - i * 5, 370 - i * 6, 300, 200, [], (r() - 0.5) * 0.05);
  dotCard(c, 640, 650, 420, 280, SC3, -0.08);
  marker(c, 250, 820, 0.3);
};
// e1.1 · the number of dots written small on the back of the card
const setupE1_1 = (c: Ctx) => {
  tableTop(c);
  dotCard(c, 300, 400, 300, 200, SC7, -0.15);
  dotCard(c, 640, 620, 420, 280, [], 0.05, () => { write(c, "7", 140, 60, 56, INK, 6); });
  arrow(c, [[470, 310], [560, 250], [660, 290], [720, 400]]);
  pencil(c, 820, 900, 1010, 800);
};
// e1.2 · the parent holds a card face down under a plain sheet, ready to lift it; the child watches
const setupE1_2 = (c: Ctx) => {
  room(c); table(c);
  dotCard(c, 450, 610, 210, 140, [], 0.04);
  const sheet = () => { c.moveTo(350, 522); c.lineTo(650, 550); c.lineTo(665, 660); c.lineTo(400, 662); c.closePath(); };
  shape(c, sheet, COL.paper, 5);
  shade(c, sheet, COL.grey, 40, 0, 0.3);
  person(c, 170, FLOOR_Y, 620, { adult: true, reachR: [350, 522] });
  person(c, 920, FLOOR_Y, 540, { dir: -1, reachL: [800, 620] });
};
// e1.3 · the child says the number at once; the parent marks a tick
const setupE1_3 = (c: Ctx) => {
  room(c); table(c);
  resultsSheet(c, 720, 600, 200, 140, 0.03);
  pencil(c, 735, 600, 776, 456);
  person(c, 180, FLOOR_Y, 540, { dir: 1 });
  person(c, 940, FLOOR_Y, 620, { adult: true, reachL: [755, 530] });
  speech(c, 360, 290, 95, 72, [240, 410], "4", 90);
};
// e2.0 · five katoris with 6, 12, 18, 24 and 30 chickpeas, in rows of six
const setupE2_0 = (c: Ctx) => {
  tableTop(c);
  [6, 12, 18, 24, 30].forEach((n, i) => { const x = 130 + i * 205; katoriOfPeas(c, x, 700, 88, n); const t = String(n); write(c, t, x - t.length * 0.4 * 60, 460, 60, INK, 8); });
};
// e2.1 · two sheets with circles, a pile spread in each, the cloth going over them
const setupE2_1 = (c: Ctx) => {
  tableTop(c);
  peaSheet(c, 320, 600, 300, 380, 120, 12, 14, 21);
  peaSheet(c, 740, 600, 300, 380, 120, 18, 14, 22);
  towel(c, () => { c.moveTo(-20, -20); c.lineTo(1100, -20); c.lineTo(1100, 470); c.quadraticCurveTo(950, 530, 800, 490); c.quadraticCurveTo(650, 450, 540, 500); c.quadraticCurveTo(400, 560, 260, 500); c.quadraticCurveTo(120, 440, -20, 510); c.closePath(); });
  arrow(c, [[540, 440], [540, 660]]);
};
// e2.2 · the cloth lifted for one second while the child looks; the parent thinks of a stopwatch
const setupE2_2 = (c: Ctx) => {
  room(c); table(c);
  peaSheet(c, 440, 600, 130, 160, 55, 12, 7, 31);
  peaSheet(c, 610, 600, 130, 160, 55, 18, 7, 32);
  towel(c, () => { c.moveTo(360, 330); c.quadraticCurveTo(550, 350, 740, 400); c.lineTo(750, 496); c.quadraticCurveTo(660, 466, 570, 498); c.quadraticCurveTo(480, 528, 410, 492); c.quadraticCurveTo(360, 470, 345, 500); c.closePath(); });
  person(c, 170, FLOOR_Y, 620, { adult: true, reachR: [360, 330] });
  person(c, 920, FLOOR_Y, 540, { dir: -1, reachL: [800, 620] });
  thought(c, 205, 222, 300, 118, 86, () => stopwatch(c, 300, 124, 50));
};
// e2.3 · the child points to the left sheet; the parent writes a tick
const setupE2_3 = (c: Ctx) => {
  room(c); table(c);
  peaSheet(c, 400, 600, 130, 160, 55, 18, 7, 41);
  peaSheet(c, 560, 600, 130, 160, 55, 12, 7, 42);
  resultsSheet(c, 740, 600, 150, 120, 0.03);
  pencil(c, 730, 605, 774, 462);
  person(c, 160, FLOOR_Y, 540, { dir: 1, reachR: [374, 588] });
  person(c, 940, FLOOR_Y, 620, { adult: true, reachL: [750, 540] });
};
// e3.0 · the offer: one raisin now, or two if you wait three minutes
const setupE3_0 = (c: Ctx) => {
  tableTop(c);
  timerBox(c, 540, 400, 240, 160, "3", "00");
  plate(c, 290, 680, 200, 72); raisin(c, 290, 672, 34);
  plate(c, 790, 680, 200, 72); raisin(c, 740, 668, 34); raisin(c, 838, 680, 34);
};
// e3.1 · way 1: the child waits with the raisins in sight, the timer showing three minutes
const setupE3_1 = (c: Ctx) => {
  desk(c);
  seated(c, 420, 600, { dir: 1, reachL: [270, 745], reachR: [570, 745] });
  plate(c, 420, 900, 125, 46); raisin(c, 420, 895, 26);
  plate(c, 690, 900, 125, 46); raisin(c, 655, 892, 26); raisin(c, 725, 902, 26);
  timerBox(c, 900, 800, 190, 124, "3", "00");
};
// e3.2 · way 2: the raisins hidden under an upside-down steel cup
const setupE3_2 = (c: Ctx) => {
  desk(c);
  seated(c, 380, 600, { dir: 1, reachL: [230, 745], reachR: [525, 745] });
  plate(c, 660, 905, 130, 46);
  cupDown(c, 660, 902, 1.15);
  timerBox(c, 920, 800, 170, 110, "3", "00");
};
// e3.3 · way 3: the child draws a picture while the cup hides the plate behind her
const setupE3_3 = (c: Ctx) => {
  desk(c);
  rectShadow(c, 500, 720, 280, 170, 8);
  shape(c, () => rrect(c, 500, 720, 280, 170, 8), WHITE, 5);
  // her drawing so far: a sun and the start of a house
  c.beginPath(); c.arc(720, 765, 24, 0, Math.PI * 2); c.strokeStyle = COL.greyDk; c.lineWidth = 4; c.stroke();
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[720 + Math.cos(a) * 32, 765 + Math.sin(a) * 32], [720 + Math.cos(a) * 44, 765 + Math.sin(a) * 44]], 3, COL.greyDk); }
  line(c, [[540, 860], [540, 810], [600, 770], [660, 810], [660, 860]], 4, COL.greyDk);
  pencil(c, 580, 795, 635, 655);
  seated(c, 420, 600, { dir: 1, reachL: [270, 745], reachR: [600, 745] });
  plate(c, 900, 905, 115, 42);
  cupDown(c, 900, 902, 1.0);
};

// ================================================================ CARD PICTURES
// flow.e1 · dot cards: three scattered, six in two rows, eight scattered
const flowE1 = (c: Ctx) => {
  tableTop(c);
  dotCard(c, 215, 570, 330, 220, SC3, -0.2);
  dotCard(c, 865, 570, 330, 220, SC8, 0.2);
  dotCard(c, 540, 500, 380, 254, R6, 0);
  marker(c, 540, 870, 0);
};
// flow.e2 · two circles, six chickpeas and twelve
const flowE2 = (c: Ctx) => {
  tableTop(c);
  peaSheet(c, 300, 540, 380, 480, 145, 6, 18, 51);
  peaSheet(c, 780, 540, 380, 480, 145, 12, 18, 52);
};
// flow.e3 · the tools of the waiting test: the two plates, the timer, the cup, the drawing
const flowE3 = (c: Ctx) => {
  tableTop(c);
  timerBox(c, 540, 230, 230, 150, "3", "00");
  plate(c, 300, 540, 170, 62); raisin(c, 300, 534, 30);
  plate(c, 700, 540, 170, 62); raisin(c, 658, 530, 30); raisin(c, 742, 542, 30);
  cupDown(c, 250, 920, 1.05);
  rectShadow(c, 560, 740, 300, 190, 8); shape(c, () => rrect(c, 560, 740, 300, 190, 8), WHITE, 5);
  c.beginPath(); c.arc(790, 790, 26, 0, Math.PI * 2); c.strokeStyle = COL.greyDk; c.lineWidth = 4; c.stroke();
  line(c, [[600, 900], [600, 840], [660, 795], [720, 840], [720, 900]], 4, COL.greyDk);
  pencil(c, 640, 870, 840, 980);
};
// flow.a1 · two strings side by side: one tied to the toy, one to a heavy book
const flowA1 = (c: Ctx) => {
  ground(c, TABLE);
  c.fillStyle = TABLE_DK; c.fillRect(0, 960, D, 120); line(c, [[0, 960], [D, 960]], 5);
  const string = (x: number, col: string, y0: number) => { line(c, [[x, 1070], [x + 6, 900], [x - 6, 700], [x + 5, 500], [x, y0]], 14, INK); line(c, [[x, 1070], [x + 6, 900], [x - 6, 700], [x + 5, 500], [x, y0]], 8, col); };
  string(330, COL.red, 300); string(750, COL.blue, 330);
  toyCar(c, 330, 300);
  book(c, 750, 250, 260, 170, 36);
};
// flow.g1 · the bank bowl of seeds, a nest bowl, a waiting plate and the face-down card pile
const flowG1 = (c: Ctx) => {
  tableTop(c);
  bowl(c, 540, 470, 200);
  const r = rnd(9);
  shape(c, () => { c.moveTo(540 - 190, 470); c.bezierCurveTo(540 - 150, 330, 540 + 150, 330, 540 + 190, 470); c.closePath(); }, COL.greenDk, 5);
  for (let i = 0; i < 160; i++) { const t = r(), u = r(), x = 360 + t * 360, top = 470 - Math.sin(t * Math.PI) * 100; seed(c, x, top + u * (470 - top) + 6, 13 + r() * 2, r() * 3); }
  shape(c, () => ell(c, 540, 470, 200, 40), COL.steelIn, 5);
  for (let i = 0; i < 22; i++) seed(c, 350 + i * 18.5, 462 - Math.sin(((i + 0.5) / 22) * Math.PI) * 8, 12, i * 0.7);
  bowl(c, 220, 780, 115); for (let i = 0; i < 4; i++) seed(c, 185 + i * 24, 772 + (i % 2) * 8, 13, i * 0.9);
  plate(c, 850, 790, 140, 50); seed(c, 850, 786, 15, 0.4);
  for (let i = 0; i < 5; i++) cardBack(c, 900 - i * 5, 240 - i * 6, 140, 200, 0.06);
};
// flow.a4 · two plates on a balcony rail, two pieces and six; the crow lands by the six
const flowA4 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => ell(c, 180, 150, 90, 40), WHITE, 0); shape(c, () => ell(c, 250, 130, 70, 36), WHITE, 0);
  for (let x = 60; x < D; x += 90) shape(c, () => rrect(c, x - 9, 610, 18, 480, 4), COL.steelDk, 4);
  shape(c, () => rrect(c, -20, 586, 1120, 30, 6), COL.steel, 6);
  plate(c, 260, 580, 140, 40); puff(c, 236, 572); puff(c, 286, 580);
  plate(c, 660, 580, 140, 40); [[608, 568], [650, 562], [694, 568], [622, 590], [664, 594], [706, 588]].forEach(([x, y]) => puff(c, x, y));
  crow(c, 890, 588, 1.2);
};
// flow.a2 · the start tape, five counted steps, the far tape
const flowA2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 520, D, 560); line(c, [[0, 520], [D, 520]], 5);
  const tape = (x: number) => shape(c, () => polyP(c, [[x + 14, 560], [x + 44, 560], [x + 4, 1040], [x - 26, 1040]]), COL.red, 5);
  tape(190); tape(960);
  [300, 430, 560, 690, 820].forEach((x, i) => { footprint(c, x, i % 2 ? 840 : 790, 0.08); write(c, String(i + 1), x - 20, 650, 64, RED, 8); });
  person(c, 180, 870, 560, { dir: 1 });
};
// term.1 · a die showing three, and the number 3
const term1 = (c: Ctx) => {
  tableTop(c);
  die(c, 380, 600, 320);
  write(c, "3", 700, 420, 300, RED, 22);
};
// term.2 · a finger touching each of five bananas in a row: one, two, three
const term2 = (c: Ctx) => {
  tableTop(c);
  [160, 350, 540, 730, 920].forEach((x) => banana(c, x, 640, 82));
  ["1", "2", "3"].forEach((t, i) => write(c, t, 160 + i * 190 - 28, 300, 70, RED, 8));
  pointHand(c, 644, 463, 2.2, 1.3);
};
// expl.5 · an ant on stilts walks past the nest hole; an ant on stumps stops before it
const expl5 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => { c.moveTo(-20, 340); c.quadraticCurveTo(300, 290, 540, 330); c.quadraticCurveTo(800, 370, 1100, 320); c.lineTo(1100, 1100); c.lineTo(-20, 1100); c.closePath(); }, SAND, 6);
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, 60 + i * 95, 900 + (i % 3) * 40, 24, 8), SAND_DK, 0);
  shape(c, () => ell(c, 540, 702, 60, 18), SAND_DK, 5);
  shape(c, () => ell(c, 540, 700, 42, 12), INK, 0);
  ant(c, 790, 700, 2.1, "stilt");
  arrow(c, [[900, 770], [1030, 770]]);
  ant(c, 290, 700, 2.1, "stump");
  line(c, [[455, 640], [455, 740]], 8, RED);
};

export const ic_animalsAnimalMindsL4 = cards("sci.animals.animal-minds.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3,
  setupE2_0, setupE2_1, setupE2_2, setupE2_3,
  setupE3_0, setupE3_1, setupE3_2, setupE3_3,
  flowE1, flowE2, flowE3, flowA1, flowG1, flowA4, flowA2, term1, term2, expl5,
]);
