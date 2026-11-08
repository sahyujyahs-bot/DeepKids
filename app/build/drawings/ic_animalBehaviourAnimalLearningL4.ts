import type { Ctx } from "./core";
import type { Hands } from "./flatKit";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, shape, ell, polyP, rrect, shadow, line, arrow, plate, bowl, hand, person, write, cards, ground } from "./flatKit";

// HOW ANIMALS LEARN (L4) · set-up cards for the Spoon Test and Crammed or Spread Out, then card pictures.
// Flat kit look: bold outline, flat colours, same child and grown-up on every card.

const FLOOR = "#e3d4b6", LCD = "#c9f06b", SCREEN = "#22303a", GREY = COL.grey, PI = Math.PI;
// arms resting on a table in front of the person, elbows out: the hand lands about 108 (child) or 119 (grown-up) below the shoulder
const REST_L: [number, number] = [PI * 0.7, PI * 0.33], REST_R: [number, number] = [PI * 0.3, PI * 0.67];
const RESTA_L: [number, number] = [PI * 0.78, PI * 0.28], RESTA_R: [number, number] = [PI * 0.22, PI * 0.72];

// ---------------------------------------------------------------- small helpers
// darken the part of a path to the right of fromX (the shade side)
const darkR = (c: Ctx, path: () => void, col: string, fromX: number, alpha = 0.5) => { c.save(); c.beginPath(); path(); c.clip(); c.globalAlpha = alpha; c.fillStyle = col; c.fillRect(fromX, -10, D + 20, D + 20); c.restore(); c.globalAlpha = 1; };
// a room: wall above the line at fy, floor below
const room = (c: Ctx, fy: number) => { ground(c); c.fillStyle = FLOOR; c.fillRect(0, fy, D, D - fy); line(c, [[0, fy], [D, fy]], 5); };
// a table seen from a little above: a wooden top from `top` to top+depth, a cloth hanging to top+drop
const table = (c: Ctx, x: number, top: number, w: number, depth: number, drop: number) => {
  const cloth = () => polyP(c, [[x - w / 2 + 10, top + depth], [x + w / 2 - 10, top + depth], [x + w / 2 - 10, top + drop], [x - w / 2 + 10, top + drop]]);
  shape(c, cloth, COL.cloth); darkR(c, cloth, "#cfc6b2", x + w * 0.15, 0.5);
  shape(c, () => rrect(c, x - w / 2, top, w, depth, 14), COL.wood);
  shape(c, () => rrect(c, x - w / 2, top + depth - 22, w, 22, 6), COL.woodDk, 5);
};
// draw a person who sits behind a table: only the part above `top` shows
const behind = (c: Ctx, top: number, f: () => Hands): Hands => { c.save(); c.beginPath(); c.rect(0, 0, D, top); c.clip(); const h = f(); c.restore(); return h; };
// a thumb drawn over a held thing, so the hand holds it rather than hides behind it
const thumb = (c: Ctx, x: number, y: number, skin: string = SKIN.child) => shape(c, () => ell(c, x, y, 15, 10, -0.4), skin, 4);
// a steel spoon: the hand end at (hx, hy), the middle of the bowl at (bx, by)
const spoon = (c: Ctx, hx: number, hy: number, bx: number, by: number, w = 16) => {
  const an = Math.atan2(by - hy, bx - hx), L = Math.hypot(bx - hx, by - hy), br = w * 1.9;
  c.save(); c.translate(hx, hy); c.rotate(an);
  shape(c, () => rrect(c, -w * 0.6, -w / 2, L - br * 0.5 + w * 0.6, w, w / 2), COL.steel, 5);
  shape(c, () => ell(c, L, 0, br, br * 0.68), COL.steel, 5);
  shape(c, () => ell(c, L - br * 0.05, 0, br * 0.6, br * 0.36), COL.steelIn, 0);
  c.restore();
};
// a thali held flat, its middle at (x, y)
const flatPlate = (c: Ctx, x: number, y: number, rx = 82) => plate(c, x, y, rx, rx * 0.34);
// sound: red arcs fanning out from (x, y) around the direction `an`
const soundArcs = (c: Ctx, x: number, y: number, an: number, r0 = 40, col = RED, w = 7, n = 3) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round";
  for (let k = 0; k < n; k++) { c.beginPath(); c.arc(x, y, r0 + k * 26, an - 0.55, an + 0.55); c.stroke(); }
};
// short red dashes radiating from (x, y): a jump, a shake
const marks = (c: Ctx, x: number, y: number, angles: number[], r0: number, r1: number, col = RED, w = 7) => angles.forEach((a) => line(c, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], w, col));
// a phone standing on its bottom edge, bottom centre (x, y); draw(screen x, y, w, h) fills the screen
const phone = (c: Ctx, x: number, y: number, w: number, h: number, draw: (sx: number, sy: number, sw: number, sh: number) => void) => {
  shadow(c, x + 8, y + 4, w * 0.6, 10);
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 14), COL.black);
  const sx = x - w / 2 + 8, sy = y - h + 18, sw = w - 16, shh = h - 36;
  shape(c, () => rrect(c, sx, sy, sw, shh, 8), SCREEN, 3);
  draw(sx, sy, sw, shh);
};
// a timer reading like 1:00, top left at (x, y), digit height h
const timeText = (c: Ctx, x: number, y: number, h: number, min: string, sec: string, col = LCD) => {
  const lw = Math.max(4, h * 0.14);
  write(c, min, x, y, h, col, lw);
  const cx = x + min.length * h * 0.8 + h * 0.08;
  for (const v of [0.32, 0.72]) shape(c, () => ell(c, cx, y + v * h, h * 0.06, h * 0.06), col, 0);
  write(c, sec, cx + h * 0.3, y, h, col, lw);
};
// a wall clock showing hr:min
const clock = (c: Ctx, x: number, y: number, r: number, hr: number, min: number) => {
  shadow(c, x + 8, y + r + 6, r * 0.9, r * 0.1);
  shape(c, () => ell(c, x, y, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], i % 3 ? 3 : 6); }
  const ma = (min / 60) * Math.PI * 2 - Math.PI / 2, ha = ((hr + min / 60) / 12) * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5]], 8);
  line(c, [[x, y], [x + Math.cos(ma) * r * 0.74, y + Math.sin(ma) * r * 0.74]], 6);
  shape(c, () => ell(c, x, y, r * 0.06, r * 0.06), RED, 0);
};
// a made-up word: a wavy line of writing
const scrib = (c: Ctx, x: number, y: number, w: number, lw = 5, col = INK) => { const pts: number[][] = []; for (let i = 0; i <= w; i += 6) pts.push([x + i, y + Math.sin(i * 0.55) * 5]); line(c, pts, lw, col); };
// a paper slip, middle at (x, y): a word on the front, a spoon on the back
const slip = (c: Ctx, x: number, y: number, w: number, h: number, back = false, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 6, h / 2 + 4, w * 0.5, 6);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), COL.paper, 5);
  if (back) spoon(c, -w * 0.32, h * 0.1, w * 0.2, -h * 0.08, w * 0.07); else scrib(c, -w * 0.33, 0, w * 0.66, Math.max(4, h * 0.05));
  c.restore();
};
// a speech bubble, middle (x, y), with its tail from the bottom edge down to (tx, ty)
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  const by = y + h / 2, bx = Math.max(x - w / 2 + 50, Math.min(x + w / 2 - 50, tx));
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 40), WHITE, 5);
  shape(c, () => polyP(c, [[bx - 24, by - 2], [bx + 24, by - 2], [tx, ty]]), WHITE, 5);
  line(c, [[bx - 20, by], [bx + 20, by]], 8, WHITE);
};
// a thought cloud, middle (x, y), with small puffs down to near (tx, ty)
const thought = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  for (const [k, rr] of [[0.72, 20], [0.86, 12]] as number[][]) shape(c, () => ell(c, x + (tx - x) * k, y + (ty - y) * k, rr, rr), WHITE, 5);
  shape(c, () => ell(c, x, y, w / 2, h / 2), WHITE, 5);
};
const qmark = (c: Ctx, x: number, y: number, h: number) => {
  line(c, [[x - h * 0.26, y + h * 0.22], [x - h * 0.16, y + h * 0.05], [x, y], [x + h * 0.18, y + h * 0.07], [x + h * 0.26, y + h * 0.26], [x + h * 0.1, y + h * 0.46], [x, y + h * 0.6], [x, y + h * 0.74]], 8);
  shape(c, () => ell(c, x, y + h * 0.95, h * 0.07, h * 0.07), INK, 0);
};
// close a person's eyes (same geometry as person()); which: -1 left eye, 1 right eye, 0 both
const eyesClosed = (c: Ctx, x: number, y: number, h: number, p: { sit?: boolean; adult?: boolean }, which = 0) => {
  const ad = !!p.adult, head = h * (ad ? 0.115 : 0.15), legLen = h * (ad ? 0.46 : 0.4), hip = p.sit ? y - h * 0.07 : y - legLen, sh = hip - h * (ad ? 0.3 : 0.27), hy = sh - head * 1.12, skin = ad ? SKIN.adult : SKIN.child;
  for (const s of [-1, 1]) {
    if (which && s !== which) continue;
    shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.16, head * 0.2, head * 0.24), skin, 0);
    c.beginPath(); c.arc(x + s * head * 0.38, hy + head * 0.08, head * 0.15, 0.35, Math.PI - 0.35); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
  }
};
const bee = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const k of [-1, 1]) shape(c, () => ell(c, -6 + k * 18, -32, 26, 13, k * 0.45), "rgba(255,255,255,0.85)", 4);
  const body = () => ell(c, 0, 0, 46, 29);
  shape(c, body, COL.yellow);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.black; for (const bx of [-24, 0, 24]) c.fillRect(bx - 6, -40, 12, 80); c.restore();
  shape(c, () => ell(c, -52, -2, 16, 15), COL.black, 4);
  shape(c, () => ell(c, -58, -6, 4, 4), WHITE, 0);
  line(c, [[-60, -14], [-74, -30]], 3); line(c, [[-52, -16], [-54, -34]], 3);
  line(c, [[46, 0], [60, 3]], 5);
  for (const lx of [-22, -2, 18]) line(c, [[lx, 26], [lx + 5, 40]], 4);
  c.restore();
};
const flower = (c: Ctx, x: number, y: number, r: number, col: string) => {
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; shape(c, () => ell(c, x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.44, r * 0.3, a), col, 5); }
  shape(c, () => ell(c, x, y, r * 0.3, r * 0.3), COL.yellow, 5);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.drop) => shape(c, () => { c.moveTo(x, y - s); c.bezierCurveTo(x + s * 0.95, y + s * 0.1, x + s * 0.7, y + s * 0.8, x, y + s * 0.8); c.bezierCurveTo(x - s * 0.7, y + s * 0.8, x - s * 0.95, y + s * 0.1, x, y - s); c.closePath(); }, col, 4);
// a cup of tea with steam, bottom centre (x, y)
const cup = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 6, y + 4, s * 0.7, s * 0.12);
  c.beginPath(); c.arc(x + s * 0.7, y - s * 0.55, s * 0.3, -Math.PI / 2, Math.PI / 2); c.strokeStyle = INK; c.lineWidth = 14; c.lineCap = "round"; c.stroke(); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke();
  shape(c, () => polyP(c, [[x - s * 0.62, y - s], [x + s * 0.62, y - s], [x + s * 0.46, y], [x - s * 0.46, y]]), WHITE);
  shape(c, () => ell(c, x, y - s, s * 0.62, s * 0.15), "#b8783c", 4);
  for (const k of [-1, 0, 1]) line(c, [[x + k * s * 0.3, y - s * 1.3], [x + k * s * 0.3 + 7, y - s * 1.55], [x + k * s * 0.3 - 7, y - s * 1.8], [x + k * s * 0.3, y - s * 2.05]], 4, GREY);
};
// a paper boat, hull bottom middle at (x, y), half-width s
const boat = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => polyP(c, [[x - s, y - s * 0.45], [x + s, y - s * 0.45], [x + s * 0.62, y], [x - s * 0.62, y]]), COL.paper);
  shape(c, () => polyP(c, [[x - s * 0.55, y - s * 0.45], [x + s * 0.55, y - s * 0.45], [x, y - s * 1.1]]), COL.paper);
  line(c, [[x, y - s * 1.05], [x, y - s * 0.5]], 4, GREY);
};
// a small steel tin (dabba) with a lid, bottom centre (x, y)
const tin = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 8), COL.steel); darkR(c, () => rrect(c, x - w / 2, y - h, w, h, 8), COL.steelDk, x + w * 0.15);
  shape(c, () => rrect(c, x - w / 2 - 5, y - h - 6, w + 10, 22, 6), COL.steelIn, 5);
};
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 7, COL.orange); } shape(c, () => ell(c, x, y, r, r), COL.yellow); };
// a simple results grid: cols x rows cells, top left (x, y), cell w x h, with numbers in it
const grid = (c: Ctx, x: number, y: number, cw: number, ch: number, cols: number, rows: number, cells: (string | null)[][]) => {
  for (let r = 0; r <= rows; r++) line(c, [[x, y + r * ch], [x + cols * cw, y + r * ch]], 3);
  for (let k = 0; k <= cols; k++) line(c, [[x + k * cw, y], [x + k * cw, y + rows * ch]], 3);
  cells.forEach((row, r) => row.forEach((t, k) => { if (t) write(c, t, x + k * cw + cw / 2 - ch * 0.22, y + r * ch + ch * 0.22, ch * 0.56, INK, 4); }));
};

// ---------------------------------------------------------------- the Spoon Test scene: volunteer at the table, child behind with plate and spoon
const spoonScene = (c: Ctx, mode: "wait" | "ring" | "tin") => {
  room(c, 700);
  const ax = 340, ay = 1010, AH = 520, top = 740;
  table(c, 340, top, 560, 90, 260);
  const startled = mode !== "wait";
  if (!startled) { // the colouring page on the table
    shape(c, () => rrect(c, 250, 748, 200, 62, 6), COL.paper, 4);
    for (const [px, col] of [[290, COL.pink], [345, COL.green], [400, COL.blue]] as [number, string][]) shape(c, () => ell(c, px, 779, 20, 14), col, 3);
  }
  const A = behind(c, top, () => person(c, ax, ay, AH, startled ? { reachL: [ax - 150, 565], reachR: [ax + 150, 565], adult: true } : { armL: RESTA_L, armR: RESTA_R, adult: true }));
  if (startled) { marks(c, ax, 548, [-2.55, -2.15], 85, 125); marks(c, ax, 548, [-1.0, -0.6], 85, 125); }
  else { // pencil in the right hand, its tip on the page
    const [hx, hy] = A.handR; const tip: number[] = [hx - 26, hy + 32], end: number[] = [hx + 48, hy - 52];
    line(c, [tip, end], 14, INK); line(c, [tip, end], 7, COL.yellow); shape(c, () => ell(c, tip[0], tip[1], 5, 5), INK, 0); thumb(c, hx + 4, hy - 4, SKIN.adult);
  }
  // the child, one arm's length behind, plate flat in the left hand
  const cx = 800, cy = 905, CH = 400;
  const reachR: [number, number] = mode === "wait" ? [878, 652] : mode === "ring" ? [874, 702] : [886, 598];
  const K = person(c, cx, cy, CH, { reachL: [720, 755], reachR, dir: -1 });
  const [lx, ly] = K.handL, pc: [number, number] = [lx + 5, ly - 30];
  flatPlate(c, pc[0], pc[1]);
  const [rx, ry] = K.handR;
  if (mode === "wait") spoon(c, rx, ry, rx + 34, ry - 108);
  else if (mode === "ring") { spoon(c, rx, ry, pc[0] + 22, pc[1] - 20); soundArcs(c, pc[0] + 22, pc[1] - 22, -2.2, 44); }
  else { spoon(c, pc[0] - 40, pc[1] - 6, pc[0] + 30, pc[1] - 14); tin(c, rx + 8, ry + 36, 62, 72); thumb(c, rx - 12, ry + 6); marks(c, rx + 8, ry, [-1.7, -1.25, -0.8, -0.35], 60, 92); }
  if (mode === "wait") { // the gap: one arm's length
    arrow(c, [[570, 600], [445, 600]], RED, 8); arrow(c, [[560, 600], [685, 600]], RED, 8);
  }
};

// ---------------------------------------------------------------- set-up cards: the Spoon Test
// 1. the scoring card: 0 no movement, 1 a twitch or blink, 2 a clear jump
const e1Score = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 955, 380, 24);
  shape(c, () => rrect(c, 170, 110, 740, 850, 18), COL.paper);
  line(c, [[200, 400], [880, 400]], 3, GREY); line(c, [[200, 680], [880, 680]], 3, GREY);
  const rows: [string, number][] = [["0", 365], ["1", 645], ["2", 925]];
  rows.forEach(([t, fy], i) => {
    write(c, t, 260, fy - 240, 150, INK, 12);
    const px = 600, h = 200;
    if (i === 0) person(c, px, fy, h);
    if (i === 1) { person(c, px, fy, h); eyesClosed(c, px, fy, h, {}, 1); marks(c, px + 36, fy - 150, [-0.9, -0.5], 22, 40); }
    if (i === 2) { person(c, px, fy, h, { reachL: [px - 70, fy - 180], reachR: [px + 70, fy - 180] }); marks(c, px, fy - 165, [-2.6, -2.2, -1.8], 50, 85); marks(c, px, fy - 165, [-1.3, -0.9, -0.5], 50, 85); }
  });
};
// 2. the volunteer with a puzzle, the child one arm's length behind
const e1Seat = (c: Ctx) => spoonScene(c, "wait");
// 3. ringing the spoon while watching the seconds, the results table on a clipboard
const e1Ring = (c: Ctx) => {
  room(c, 700);
  table(c, 250, 760, 330, 80, 230);
  // the clipboard, standing against the wall
  shape(c, () => rrect(c, 230, 500, 200, 280, 10), COL.brown, 5);
  shape(c, () => rrect(c, 245, 540, 170, 230, 4), COL.paper, 4);
  shape(c, () => rrect(c, 300, 486, 60, 36, 8), COL.steelDk, 4);
  grid(c, 262, 560, 68, 36, 2, 5, [["1", "2"], ["2", "2"], ["3", "1"], ["4", null], ["5", null]]);
  phone(c, 160, 790, 96, 170, (sx, sy, sw, sh) => { write(c, "15", sx + sw / 2 - 36, sy + sh / 2 - 36, 72, LCD, 8); });
  // the child
  const cx = 640, cy = 960, CH = 400;
  const K = person(c, cx, cy, CH, { reachL: [560, 808], reachR: [716, 752], dir: -1 });
  const [lx, ly] = K.handL, pc: [number, number] = [lx + 5, ly - 30];
  flatPlate(c, pc[0], pc[1]);
  spoon(c, K.handR[0], K.handR[1], pc[0] + 22, pc[1] - 20);
  soundArcs(c, pc[0] + 22, pc[1] - 22, -2.2, 44);
};
// 4. after ring 12, the rice tin: the volunteer jumps
const e1Tin = (c: Ctx) => spoonScene(c, "tin");
// 5. the line graph with the dip and the spike at the rice tin
const e1Graph = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 955, 400, 24);
  shape(c, () => rrect(c, 110, 100, 860, 860, 18), COL.paper);
  const ox = 230, oy = 800, dx = 48, sy = (s: number) => oy - s * 220;
  line(c, [[ox, 300], [ox, oy], [ox + 15 * dx, oy]], 5);
  for (let s = 0; s <= 2; s++) { line(c, [[ox - 12, sy(s)], [ox, sy(s)]], 4); write(c, String(s), ox - 60, sy(s) - 16, 34, INK, 5); }
  const scores = [2, 2, 2, 1, 2, 1, 1, 0, 1, 0, 0, 0, 2, 0];
  const pts = scores.map((s, i) => [ox + (i + 1) * dx, sy(s)]);
  scores.forEach((_, i) => { line(c, [[ox + (i + 1) * dx, oy], [ox + (i + 1) * dx, oy + 12]], 4); if (i % 2 === 0 || i === 12) write(c, String(i + 1), ox + (i + 1) * dx - (i >= 9 ? 22 : 11), oy + 24, 30, INK, 4); });
  line(c, pts, 7, COL.blueDk);
  pts.forEach(([x, y]) => shape(c, () => ell(c, x, y, 9, 9), COL.blue, 4));
  // the new sound, marked: a red ring round point 13 and the tin above it
  const [tx, ty] = pts[12];
  c.beginPath(); c.arc(tx, ty, 30, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 7; c.stroke();
  tin(c, tx, ty - 50, 54, 62);
  marks(c, tx, ty - 80, [-2.6, -2.1], 40, 62); marks(c, tx, ty - 80, [-1.0, -0.5], 40, 62);
};

// ---------------------------------------------------------------- set-up cards: Crammed or Spread Out
// 1. the 16 slips in two rows, one slip turned to show its back
const e2Slips = (c: Ctx) => {
  ground(c);
  slip(c, 330, 250, 260, 170, false, -0.05); slip(c, 750, 250, 260, 170, true, 0.05);
  arrow(c, [[480, 180], [540, 150], [600, 180]], RED, 8);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) slip(c, 128 + i * 118, 560 + r * 250, 100, 70, false, (i % 3 - 1) * 0.04);
  line(c, [[80, 685], [1000, 685]], 3, GREY);
};
// 2. cramming at the table: look for a minute, say the meanings for a minute, four times in a row
const e2Cram = (c: Ctx) => {
  room(c, 680);
  const top = 760;
  table(c, 540, top, 900, 90, 240);
  behind(c, top, () => person(c, 330, 896, 400, { armL: REST_L, armR: REST_R, dir: 1 }));
  behind(c, top, () => person(c, 760, 1010, 520, { armL: RESTA_L, armR: RESTA_R, adult: true, dir: -1 }));
  for (const x of [250, 320, 390]) slip(c, x, 800, 60, 40, false, 0);
  for (const x of [700, 770, 840]) slip(c, x, 800, 60, 40, false, 0);
  phone(c, 540, 830, 140, 190, (sx, sy, sw) => timeText(c, sx + sw / 2 - 50, sy + 55, 36, "1", "00"));
  bubble(c, 880, 400, 240, 150, 775, 560);
  spoon(c, 800, 420, 950, 390, 14);
};
// 3. the spread list: morning, midday, afternoon, evening, two minutes each
const e2Spread = (c: Ctx) => {
  ground(c);
  const panel = (x: number, y: number, draw: () => void) => {
    shape(c, () => rrect(c, x - 215, y - 215, 430, 430, 24), COL.paper, 5);
    draw();
    for (const [k, dy] of [[0, 0], [1, -10], [2, -20]]) slip(c, x - 70 + k * 6, y + 150 + dy, 130, 80, false, 0);
    shape(c, () => rrect(c, x + 60, y + 90, 110, 110, 14), COL.black, 5);
    timeText(c, x + 72, y + 128, 34, "2", "00");
  };
  panel(300, 300, () => sun(c, 300, 210, 58));
  panel(780, 300, () => { plate(c, 780, 220, 120, 50); shape(c, () => { c.moveTo(690, 215); c.quadraticCurveTo(780, 120, 870, 215); c.closePath(); }, WHITE, 4); shape(c, () => ell(c, 800, 200, 38, 20), COL.yellow, 4); });
  panel(300, 780, () => cup(c, 300, 720, 60));
  panel(780, 780, () => { shape(c, () => { c.moveTo(760, 560); c.lineTo(840, 560); c.lineTo(840, 690); c.lineTo(700, 690); c.closePath(); }, "rgba(255,211,77,0.45)", 0); shape(c, () => ell(c, 780, 720, 60, 14), COL.woodDk, 4); line(c, [[780, 715], [780, 640]], 8); shape(c, () => polyP(c, [[720, 640], [840, 640], [820, 570], [740, 570]]), COL.orange, 5); });
};
// 4. the test next morning: the child shows a word, the grown-up says the meaning, the score table beside
const e2Test = (c: Ctx) => {
  room(c, 720);
  // the morning window and the score table on the wall
  shape(c, () => rrect(c, 440, 150, 190, 170, 10), COL.sky, 6); sun(c, 540, 240, 34); line(c, [[535, 150], [535, 320]], 4); line(c, [[440, 235], [630, 235]], 4);
  shape(c, () => rrect(c, 90, 130, 300, 250, 10), COL.paper, 5);
  grid(c, 110, 160, 85, 50, 3, 4, [[null, null, null], [null, "4", "7"], [null, "5", "8"], [null, "9", "15"]]);
  scrib(c, 120, 185, 60, 4); scrib(c, 125, 235, 50, 4); scrib(c, 125, 285, 50, 4);
  line(c, [[200, 170], [235, 200]], 4); line(c, [[200, 200], [235, 170]], 4); shape(c, () => ell(c, 322, 185, 16, 16), COL.yellow, 4);
  const K = person(c, 300, 1000, 400, { reachR: [420, 650], dir: 1 });
  const [hx, hy] = K.handR;
  slip(c, hx + 4, hy - 60, 110, 76, false, 0.12); thumb(c, hx - 6, hy - 18);
  person(c, 770, 1000, 520, { adult: true, dir: -1 });
  bubble(c, 820, 420, 240, 150, 775, 548);
  spoon(c, 740, 440, 890, 410, 14);
};

// ---------------------------------------------------------------- card pictures
const fE1 = (c: Ctx) => spoonScene(c, "ring");
// a child at the table with the slips, remembering: a spoon in a thought cloud
const fE2 = (c: Ctx) => {
  room(c, 680);
  const top = 760;
  table(c, 540, top, 760, 90, 240);
  const K = behind(c, top, () => person(c, 500, 900, 400, { armL: REST_L, reachR: [600, 650], dir: 1 }));
  for (const x of [280, 360, 440, 660, 740]) slip(c, x, 802, 64, 42, false, 0);
  const [hx, hy] = K.handR; slip(c, hx + 4, hy - 56, 110, 76, false, 0.1); thumb(c, hx - 6, hy - 16);
  thought(c, 800, 330, 300, 190, 620, 500); spoon(c, 710, 350, 880, 320, 16);
};
// sitting still with eyes closed: fan, fridge and clock, each humming
const fA1 = (c: Ctx) => {
  room(c, 820);
  // ceiling fan
  line(c, [[540, 0], [540, 70]], 10); shape(c, () => ell(c, 540, 95, 30, 24), COL.greyDk, 5);
  for (const a of [0.2, 2.3, 4.4]) shape(c, () => ell(c, 540 + Math.cos(a) * 95, 95 + Math.sin(a) * 30, 95, 18, Math.atan2(Math.sin(a) * 30, Math.cos(a) * 95)), COL.brown, 5);
  soundArcs(c, 540, 95, -Math.PI / 2 + 2.2, 150, GREY, 5, 2); soundArcs(c, 540, 95, -Math.PI / 2 - 2.2, 150, GREY, 5, 2);
  // fridge
  shape(c, () => rrect(c, 60, 330, 180, 490, 12), WHITE); line(c, [[60, 480], [240, 480]], 5); line(c, [[210, 380], [210, 450]], 8); line(c, [[210, 520], [210, 660]], 8);
  soundArcs(c, 240, 420, 0, 60, GREY, 5, 2);
  // wall clock
  clock(c, 930, 400, 70, 10, 10); soundArcs(c, 930, 400, Math.PI, 100, GREY, 5, 2);
  // sofa
  shape(c, () => rrect(c, 230, 540, 620, 250, 30), COL.teal); darkR(c, () => rrect(c, 230, 540, 620, 250, 30), COL.tealDk, 700);
  shape(c, () => rrect(c, 250, 720, 580, 90, 20), COL.teal, 5);
  for (const x of [190, 830]) shape(c, () => rrect(c, x, 640, 60, 170, 24), COL.tealDk, 5);
  for (const x of [230, 850]) line(c, [[x, 810], [x, 840]], 10);
  person(c, 540, 770, 400, { sit: true, dir: 1, reachL: [460, 745], reachR: [620, 745] });
  eyesClosed(c, 540, 770, 400, { sit: true });
};
// handing over a nearly finished boat; the half-folded one and the plain sheet wait on the table
const fA2 = (c: Ctx) => {
  room(c, 680);
  const top = 760;
  table(c, 540, top, 900, 90, 240);
  const K = behind(c, top, () => person(c, 360, 896, 400, { armL: REST_L, reachR: [470, 680], dir: 1 }));
  const A = behind(c, top, () => person(c, 740, 1010, 520, { reachL: [560, 690], armR: RESTA_R, adult: true, dir: -1 }));
  const bx = (K.handR[0] + A.handL[0]) / 2, by = Math.min(K.handR[1], A.handL[1]) - 6;
  boat(c, bx, by, 60); thumb(c, K.handR[0] - 8, K.handR[1] - 6); thumb(c, A.handL[0] + 8, A.handL[1] - 6, SKIN.adult);
  shape(c, () => polyP(c, [[200, 830], [330, 830], [330, 775], [200, 775]]), COL.paper, 4);
  shape(c, () => polyP(c, [[620, 835], [760, 835], [760, 770]]), COL.paper, 4); line(c, [[690, 835], [760, 800]], 3, GREY);
};
// asking a grandmother two questions, notebook in hand, her tea in hers
const fA3 = (c: Ctx) => {
  room(c, 740);
  const K = person(c, 320, 1000, 400, { reachL: [230, 740], reachR: [420, 720], dir: 1 });
  const [nx, ny] = K.handL;
  shape(c, () => rrect(c, nx - 30, ny - 110, 120, 110, 6), COL.blue, 5); shape(c, () => rrect(c, nx - 22, ny - 102, 104, 94, 4), COL.paper, 3);
  for (let k = 0; k < 4; k++) scrib(c, nx - 10, ny - 86 + k * 22, 70, 3);
  thumb(c, nx - 8, ny - 10);
  const [px, py] = K.handR; line(c, [[px - 10, py + 14], [px + 40, py - 56]], 14, INK); line(c, [[px - 10, py + 14], [px + 40, py - 56]], 7, COL.yellow); thumb(c, px + 4, py - 6);
  bubble(c, 300, 330, 220, 160, 330, 560); qmark(c, 300, 270, 110);
  const A = person(c, 770, 1000, 520, { reachR: [860, 700], adult: true, dir: -1 });
  const [cx, cy] = A.handR; cup(c, cx + 6, cy + 30, 52); thumb(c, cx - 14, cy, SKIN.adult);
};
// the balcony ledge: rice dish, water bowl, the wall clock at half past seven, and a crow
const fP1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(430, 0, D, 700);
  line(c, [[430, 0], [430, 700]], 6);
  for (const x of [520, 620, 720, 820, 920, 1020]) line(c, [[x, 330], [x, 700]], 10, COL.greyDk);
  line(c, [[430, 330], [D, 330]], 12, COL.greyDk);
  clock(c, 220, 260, 100, 7, 30);
  // the ledge
  shape(c, () => rrect(c, 0, 700, D, 60, 0), COL.steelDk, 5); c.fillStyle = "#d9cdb3"; c.fillRect(0, 760, D, 320);
  // rice dish and water
  plate(c, 330, 690, 150, 50);
  shape(c, () => { c.moveTo(220, 688); c.quadraticCurveTo(330, 600, 440, 688); c.closePath(); }, COL.paper, 4);
  for (let i = 0; i < 40; i++) { const a = i * 2.4, r = 20 + (i % 7) * 12; shape(c, () => ell(c, 330 + Math.cos(a) * r * 1.8, 665 + Math.sin(a) * r * 0.45, 6, 3.5, a), WHITE, 1.5); }
  bowl(c, 600, 640, 90, COL.water);
  crow(c, 880, 700, 1.4, -1);
};
const crow = (c: Ctx, x: number, y: number, s: number, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  line(c, [[-10, 0], [-6, -22]], 5); line(c, [[12, 0], [8, -22]], 5);
  shape(c, () => polyP(c, [[-30, -40], [-72, -26], [-74, -40], [-34, -58]]), COL.black, 5);
  shape(c, () => ell(c, 0, -45, 46, 28, -0.15), COL.black, 5);
  shape(c, () => ell(c, 44, -72, 22, 20), COL.black, 5);
  shape(c, () => polyP(c, [[62, -76], [94, -68], [62, -62]]), COL.greyDk, 4);
  shape(c, () => ell(c, 50, -77, 5, 5), WHITE, 2);
  line(c, [[-12, -50], [30, -42]], 4, "#5a5565");
  c.restore();
};
// Bee School: three flower cards, the bee picks the blue one and finds nectar
const fG1 = (c: Ctx) => {
  room(c, 640);
  const cardAt = (x: number, col: string) => { shadow(c, x + 10, 905, 130, 18); shape(c, () => rrect(c, x - 125, 560, 250, 340, 18), COL.paper, 6); flower(c, x, 730, 95, col); };
  cardAt(200, COL.blue); cardAt(540, COL.yellow); cardAt(880, COL.red);
  drop(c, 200, 724, 22);
  for (let i = 0; i < 7; i++) { const t = i / 7; shape(c, () => ell(c, 700 - t * 440 + Math.sin(t * 9) * 20, 250 + t * 260, 7, 7), GREY, 0); }
  bee(c, 230, 560, 1.1, 0.5);
};
// a sparrow on the scarecrow's hat in the rice field
const tLearning = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 620);
  c.fillStyle = "#e8c25a"; c.fillRect(0, 620, D, 460); line(c, [[0, 620], [D, 620]], 5);
  for (let x = 20; x < D; x += 60) for (const y of [700, 820, 940]) line(c, [[x, y + 40], [x + 10, y], [x + 24, y + 40]], 5, COL.woodDk);
  // the scarecrow: pole, arms, shirt, head, hat; a red towel on one arm
  line(c, [[540, 1000], [540, 380]], 18, COL.brown); line(c, [[320, 470], [760, 470]], 16, COL.brown);
  shape(c, () => polyP(c, [[400, 440], [680, 440], [660, 760], [420, 760]]), WHITE);
  shape(c, () => polyP(c, [[400, 440], [330, 470], [345, 520], [410, 500]]), WHITE); shape(c, () => polyP(c, [[680, 440], [750, 470], [735, 520], [670, 500]]), WHITE);
  shape(c, () => polyP(c, [[700, 480], [770, 480], [790, 640], [720, 640]]), COL.red);
  shape(c, () => ell(c, 540, 350, 78, 85), COL.wood, 6);
  shape(c, () => ell(c, 512, 335, 9, 9), INK, 0); shape(c, () => ell(c, 568, 335, 9, 9), INK, 0); line(c, [[510, 385], [570, 385]], 5);
  shape(c, () => ell(c, 540, 282, 190, 34), COL.yellow); shape(c, () => polyP(c, [[450, 282], [630, 282], [610, 190], [470, 190]]), COL.yellow); line(c, [[470, 250], [610, 250]], 6, COL.woodDk);
  sparrow(c, 560, 190, 1.6, -1);
};
const sparrow = (c: Ctx, x: number, y: number, s: number, dir = 1) => {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  line(c, [[-6, 0], [-4, -14]], 4); line(c, [[8, 0], [6, -14]], 4);
  shape(c, () => polyP(c, [[-22, -24], [-52, -16], [-52, -26], [-24, -36]]), COL.brown, 4);
  shape(c, () => ell(c, 0, -28, 30, 19), COL.brown, 5);
  shape(c, () => ell(c, 4, -22, 20, 11), "#efe0c2", 0);
  shape(c, () => ell(c, -4, -34, 18, 9, -0.2), COL.soilDk, 3);
  shape(c, () => ell(c, 28, -46, 15, 14), COL.brown, 4);
  shape(c, () => polyP(c, [[40, -48], [56, -44], [40, -40]]), COL.woodDk, 3);
  shape(c, () => ell(c, 32, -49, 3.5, 3.5), INK, 0);
  c.restore();
};
// a stimulus: the spoon rings on the steel plate
const tStimulus = (c: Ctx) => {
  room(c, 520);
  plate(c, 540, 720, 330, 125);
  // the spoon, its handle gripped by a child's hand at the top end
  const an = Math.atan2(660 - 290, 600 - 850);
  spoon(c, 850, 290, 600, 660, 24);
  hand(c, 850 - Math.cos(an) * 98, 290 - Math.sin(an) * 98, an, 1.4, SKIN.child, CLOTH.child);
  soundArcs(c, 600, 640, -2.3, 90, RED, 10, 4);
  soundArcs(c, 600, 640, 0.9, 90, RED, 10, 2);
};
// association: a bee at a blue flower, a drop of nectar
const tAssociation = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#d8ebc0"; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 5);
  line(c, [[540, 1000], [540, 560]], 16, COL.leafDk); line(c, [[540, 1000], [540, 560]], 8, COL.leaf);
  for (const [sy, an] of [[860, 2.6], [760, 0.5]] as number[][]) { const L = 160, tx = 540 + Math.cos(an) * L, ty = sy + Math.sin(an) * L; shape(c, () => { c.moveTo(540, sy); c.quadraticCurveTo((540 + tx) / 2 - Math.sin(an) * 50, (sy + ty) / 2 + Math.cos(an) * 50, tx, ty); c.quadraticCurveTo((540 + tx) / 2 + Math.sin(an) * 50, (sy + ty) / 2 - Math.cos(an) * 50, 540, sy); c.closePath(); }, COL.leaf, 5); }
  flower(c, 540, 470, 230, COL.blue);
  drop(c, 540, 450, 40);
  bee(c, 700, 380, 1.5, 0.6);
};

export const ic_animalBehaviourAnimalLearningL4 = cards("sci.animal-behaviour.animal-learning.L4", [
  e1Score, e1Seat, e1Ring, e1Tin, e1Graph, // setup.e1.0-4
  e2Slips, e2Cram, e2Spread, e2Test, // setup.e2.0-3
  fE1, fE2, fA1, fA2, fA3, fP1, fG1, tLearning, tStimulus, tAssociation,
]);
