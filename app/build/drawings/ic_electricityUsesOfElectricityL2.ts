import type { Ctx } from "./core";
import { BG, CLOTH, COL, D, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, plate, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// USES OF ELECTRICITY L2 · set-up cards for the Tired Cell Test and the Phone Battery Race, then
// card pictures: the activities, the meter project and the things a child can see (fan, plug, cells).

const TABLE = "#d9b27a", WALL = "#fbf6ea", NIGHT = "#2d3a6b", CELL = "#3fb1a8", CELL_DK = "#2a8a83", BRASS = "#c9a24a", BEAM = "#fff0a0", GLOW = "#ffd34d";

// a flat wooden table top (or floor) from y down to the card's bottom edge
const table = (c: Ctx, y: number, col = TABLE) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };

// an AA cell lying with its centre at (x, y), length len, turned by rot. n: a numbered paper sticker; tag: a coloured dot
const cell = (c: Ctx, x: number, y: number, len: number, rot = 0, n?: string, tag?: string, thick = len * 0.36) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const h = thick, r = h * 0.22, body = () => rrect(c, -len / 2, -h / 2, len, h, r);
  shadow(c, 10, h * 0.62, len * 0.5, h * 0.22);
  shape(c, body, CELL);
  shade(c, body, CELL_DK, 0, -h * 0.5);
  shape(c, () => rrect(c, len / 2 - len * 0.12, -h / 2, len * 0.12, h, r * 0.6), COL.steel, 5);
  shape(c, () => rrect(c, -len / 2, -h / 2, len * 0.08, h, r * 0.6), COL.steel, 5);
  shape(c, () => rrect(c, len / 2, -h * 0.18, h * 0.2, h * 0.36, 4), COL.steel, 5);
  shine(c, [[-len * 0.3, -h * 0.3], [len * 0.15, -h * 0.3]], h * 0.1);
  if (n) { shape(c, () => ell(c, -len * 0.05, 0, h * 0.32, h * 0.32), WHITE, 4); write(c, n, -len * 0.05 - h * 0.12, -h * 0.2, h * 0.4, INK, 5); }
  if (tag) shape(c, () => ell(c, -len * 0.3, 0, h * 0.2, h * 0.2), tag, 4);
  c.restore();
};

// a torch: tail at (x, y), pointing along angle an, length len. on: a yellow beam from the lens
const torch = (c: Ctx, x: number, y: number, len: number, an: number, on: boolean, beamLen = 420) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const h = len * 0.22, body = () => rrect(c, 0, -h / 2, len * 0.7, h, h * 0.25);
  shape(c, body, COL.greyDk);
  shade(c, body, COL.black, 0, -h * 0.5);
  for (let i = 0; i < 3; i++) line(c, [[len * 0.15 + i * len * 0.1, -h / 2], [len * 0.15 + i * len * 0.1, h / 2]], 4, INK);
  shape(c, () => rrect(c, len * 0.46, -h * 0.78, len * 0.1, h * 0.3, 6), RED, 4);
  shape(c, () => polyP(c, [[len * 0.7, -h / 2], [len, -h * 0.85], [len, h * 0.85], [len * 0.7, h / 2]]), COL.grey);
  if (on) { c.globalAlpha = 0.6; shape(c, () => polyP(c, [[len * 1.02, -h * 0.85], [len * 1.02 + beamLen, -h * 0.85 - beamLen * 0.42], [len * 1.02 + beamLen, h * 0.85 + beamLen * 0.42], [len * 1.02, h * 0.85]]), BEAM, 0); c.globalAlpha = 1; }
  shape(c, () => rrect(c, len * 0.96, -h * 0.85, len * 0.06, h * 1.7, 6), on ? COL.yellow : COL.steelDk, 5);
  c.restore();
};

// a wall clock seen from the front, centre (x, y), radius r; sec 0..1 is where the red second hand points
const clock = (c: Ctx, x: number, y: number, r: number, sec = 0.2, hour = 10, min = 10) => {
  shadow(c, x + r * 0.08, y + r * 0.1, r * 1.04, r * 1.04);
  shape(c, () => ell(c, x, y, r, r), COL.blue);
  shade(c, () => ell(c, x, y, r, r), COL.blueDk, -r * 0.12, -r * 0.12);
  shape(c, () => ell(c, x, y, r * 0.84, r * 0.84), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, big = i % 3 === 0; line(c, [[x + Math.cos(a) * r * 0.74, y + Math.sin(a) * r * 0.74], [x + Math.cos(a) * r * (big ? 0.6 : 0.67), y + Math.sin(a) * r * (big ? 0.6 : 0.67)]], big ? 7 : 4); }
  const ha = (hour / 12) * Math.PI * 2 - Math.PI / 2, ma = (min / 60) * Math.PI * 2 - Math.PI / 2, sa = sec * Math.PI * 2 - Math.PI / 2;
  line(c, [[x, y], [x + Math.cos(ha) * r * 0.4, y + Math.sin(ha) * r * 0.4]], 11);
  line(c, [[x, y], [x + Math.cos(ma) * r * 0.58, y + Math.sin(ma) * r * 0.58]], 8);
  line(c, [[x - Math.cos(sa) * r * 0.12, y - Math.sin(sa) * r * 0.12], [x + Math.cos(sa) * r * 0.68, y + Math.sin(sa) * r * 0.68]], 4, RED);
  shape(c, () => ell(c, x, y, r * 0.05, r * 0.05), INK, 0);
};

// a phone standing upright, centre (x, y), width w; draw paints the screen (sx, sy, sw, sh)
const phone = (c: Ctx, x: number, y: number, w: number, draw?: (sx: number, sy: number, sw: number, sh: number) => void) => {
  const h = w * 2;
  shadow(c, x + w * 0.1, y + h * 0.5 + 8, w * 0.62, w * 0.12);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.12), COL.black);
  const sx = x - w * 0.44, sy = y - h * 0.46, sw = w * 0.88, sh = h * 0.92;
  shape(c, () => rrect(c, sx, sy, sw, sh, w * 0.08), "#1e2a3a", 4);
  if (draw) { c.save(); c.beginPath(); rrect(c, sx, sy, sw, sh, w * 0.08); c.clip(); draw(sx, sy, sw, sh); c.restore(); }
};
// a phone lying face down, seen from above: its back with the camera bump
const phoneDown = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 2, body = () => rrect(c, x - w / 2, y - h / 2, w, h, w * 0.12);
  shadow(c, x + 14, y + 16, w * 0.52, h * 0.5);
  shape(c, body, COL.black);
  shade(c, body, "#241f2c", -w * 0.1, -w * 0.1);
  shape(c, () => rrect(c, x - w * 0.42, y - h * 0.44, w * 0.3, w * 0.3, 14), "#55505c", 4);
  shape(c, () => ell(c, x - w * 0.27, y - h * 0.44 + w * 0.15, w * 0.08, w * 0.08), "#8a94a6", 3);
  shine(c, [[x - w * 0.3, y - h * 0.2], [x - w * 0.3, y + h * 0.3]], 8);
};
// a kitchen timer, centre (x, y), radius r, showing the number num on its dial
const timer = (c: Ctx, x: number, y: number, r: number, num: string) => {
  shadow(c, x + r * 0.1, y + r * 0.98, r * 0.9, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), WHITE);
  shade(c, () => ell(c, x, y, r, r), COL.grey, -r * 0.18, -r * 0.18);
  shape(c, () => ell(c, x, y, r * 0.7, r * 0.7), COL.red, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.94, y + Math.sin(a) * r * 0.94], [x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82]], 4); }
  shape(c, () => polyP(c, [[x - r * 0.1, y - r * 0.62], [x + r * 0.1, y - r * 0.62], [x, y - r * 0.96]]), WHITE, 4);
  write(c, num, x - r * 0.3 * num.length + r * 0.02, y - r * 0.3, r * 0.6, WHITE, 8);
};
// a strip of ceiling across the top of the card
const ceiling = (c: Ctx, y = 44) => { c.fillStyle = COL.steelIn; c.fillRect(0, 0, D, y); line(c, [[0, y], [D, y]], 6); };
// a ceiling fan hanging from the ceiling strip: rod, motor, three blades seen from below at an angle
const fan = (c: Ctx, x: number, y: number, r: number, spin: boolean, glow = false) => {
  const top = y - r * 0.22;
  line(c, [[x, 44], [x, top]], 18, INK); line(c, [[x, 44], [x, top]], 9, COL.steel);
  if (glow) { c.globalAlpha = 0.35; line(c, [[x, 44], [x, top]], 40, GLOW); c.globalAlpha = 1; line(c, [[x, 44], [x, top]], 8, GLOW); }
  shape(c, () => ell(c, x, 48, r * 0.16, r * 0.05), COL.steel, 5);
  const blade = (a: number) => { const P = (u: number, v: number) => [x + u * Math.cos(a) - v * Math.sin(a), y + (u * Math.sin(a) + v * Math.cos(a)) * 0.4]; return [P(r * 0.22, -r * 0.09), P(r * 0.9, -r * 0.13), P(r, -r * 0.05), P(r, r * 0.05), P(r * 0.9, r * 0.13), P(r * 0.22, r * 0.09)]; };
  for (let i = 0; i < 3; i++) { const pts = blade((i * Math.PI * 2) / 3 + 0.5); shape(c, () => polyP(c, pts), COL.brown); shade(c, () => polyP(c, pts), COL.soilDk, 0, -r * 0.05, 0.35); }
  shape(c, () => rrect(c, x - r * 0.26, top, r * 0.52, r * 0.34, 12), COL.steel);
  shade(c, () => rrect(c, x - r * 0.26, top, r * 0.52, r * 0.34, 12), COL.steelDk, -r * 0.1, 0);
  shape(c, () => ell(c, x, top, r * 0.26, r * 0.09), COL.steelIn, 5);
  shape(c, () => ell(c, x, top + r * 0.34, r * 0.26, r * 0.09), COL.steelDk, 5);
  if (spin) for (const s of [0, Math.PI]) { const pts: number[][] = []; for (let k = 0; k <= 8; k++) { const a = s + 0.35 + k * 0.08; pts.push([x + Math.cos(a) * r * 1.12, y + Math.sin(a) * r * 1.12 * 0.42]); } arrow(c, pts, RED, 9); }
};
// a tick or a cross on a results table
const mark = (c: Ctx, x: number, y: number, ok: boolean) => ok ? line(c, [[x - 20, y], [x - 4, y + 18], [x + 26, y - 20]], 8, COL.greenDk) : (line(c, [[x - 18, y - 18], [x + 18, y + 18]], 8, RED), line(c, [[x + 18, y - 18], [x - 18, y + 18]], 8, RED));
// a sheet of paper
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h / 2 + 14, w / 2, h / 2); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 5); };
// an upward beam of light from a phone's torch to the ceiling
const beamUp = (c: Ctx, x: number, y: number) => { c.globalAlpha = 0.55; shape(c, () => polyP(c, [[x - 26, y], [x + 26, y], [x + 230, 44], [x - 230, 44]]), BEAM, 0); shape(c, () => ell(c, x, 46, 260, 22), GLOW, 0); c.globalAlpha = 1; };
// a block of flats: windows in a grid; lit says which window glows (index) or -1
const building = (c: Ctx, x: number, y: number, w: number, h: number, cols: number, rows: number, dark: boolean, lit = -1) => {
  shape(c, () => rrect(c, x, y, w, h, 12), dark ? "#4a4f7a" : "#f1d9b0");
  shade(c, () => rrect(c, x, y, w, h, 12), dark ? "#353a5e" : "#d8b985", -w * 0.1, 0);
  const cw = w / (cols + 1), ch = h / (rows + 1);
  for (let i = 0; i < cols * rows; i++) {
    const cx = x + cw * 0.5 + (i % cols) * cw + cw * 0.25, cy = y + ch * 0.5 + Math.floor(i / cols) * ch + ch * 0.2, isLit = i === lit;
    if (isLit) { c.globalAlpha = 0.5; shape(c, () => ell(c, cx + cw * 0.25, cy + ch * 0.3, cw * 0.7, ch * 0.7), GLOW, 0); c.globalAlpha = 1; }
    shape(c, () => rrect(c, cx, cy, cw * 0.5, ch * 0.6, 6), isLit ? COL.yellow : dark ? "#1f2444" : COL.sky, 5);
    line(c, [[cx + cw * 0.25, cy], [cx + cw * 0.25, cy + ch * 0.6]], 4); line(c, [[cx, cy + ch * 0.3], [cx + cw * 0.5, cy + ch * 0.3]], 4);
  }
};
// a wooden pole with a crossbar and two insulators; wires go from the insulators to the points in `to`
const pole = (c: Ctx, x: number, top: number, bottom: number, to: number[][]) => {
  line(c, [[x, top], [x, bottom]], 36, INK); line(c, [[x, top], [x, bottom]], 26, COL.brown);
  line(c, [[x - 140, top + 70], [x + 140, top + 70]], 26, INK); line(c, [[x - 140, top + 70], [x + 140, top + 70]], 16, COL.brown);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 110, top + 50, 16, 22), WHITE, 5);
  to.forEach(([tx, ty], i) => { const sx = x + (i % 2 ? 1 : -1) * 110, sy = top + 32; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + tx) / 2, Math.max(sy, ty) + 70, tx, ty); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); });
};
// the wrist position of a person()'s arm, to put a held object there
const wrist = (x: number, y: number, h: number, side: -1 | 1, [a1, a2]: [number, number], sit = false) => {
  const hip = sit ? y - h * 0.06 : y - h * 0.42, sh = sit ? hip - h * 0.32 : y - h * 0.74, sx = x + side * h * 0.11, sy = sh + h * 0.03;
  const ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};

// ---------------------------------------------------------------- set-up cards
// 1. six old cells numbered on a steel plate, a torch and a clock beside
const setupE1a = (c: Ctx) => {
  ground(c); table(c, 230);
  torch(c, 560, 340, 320, -0.08, false);
  plate(c, 400, 720, 330, 150);
  [[250, 660], [400, 650], [550, 670], [260, 780], [420, 790], [560, 775]].forEach(([x, y], i) => cell(c, x, y, 140, i % 2 ? -0.25 : 0.2, String(i + 1)));
  clock(c, 890, 770, 150, 0.6);
};
// 2. a child's hand pushes a cell into the torch and points it at a white wall: nothing lights
const setupE1b = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 780, -20, 340, D + 40, 10), WALL, 6);
  torch(c, 330, 540, 400, 0, false);
  hand(c, 438, 540, 0, 1.6);
  cell(c, 170, 690, 160, -0.6);
  arrow(c, [[230, 630], [300, 560]], RED, 10);
};
// 3. the clock with its red second hand moving, a cell in the child's hand ready to go in, 10 seconds
const setupE1c = (c: Ctx) => {
  ground(c);
  clock(c, 540, 430, 300, 0.12);
  const pts: number[][] = []; for (let k = 0; k <= 8; k++) { const a = -Math.PI / 2 + 0.75 + k * 0.1; pts.push([540 + Math.cos(a) * 330, 430 + Math.sin(a) * 330]); } arrow(c, pts, RED, 9);
  hand(c, 300, 880, 0, 1.4);
  cell(c, 410, 880, 180, 0);
  arrow(c, [[560, 870], [620, 770]], RED, 10);
  write(c, "10", 800, 800, 130, INK, 10);
};
// 4. the results table, and the cells sorted into three groups with green, yellow and red stickers
const setupE1d = (c: Ctx) => {
  ground(c); table(c, 560);
  paper(c, 120, 50, 840, 470);
  const rows = [[true, true], [false, true], [false, true], [false, true], [false, true], [false, false]];
  for (let r = 0; r <= 7; r++) line(c, [[150, 80 + r * 60], [930, 80 + r * 60]], 3, COL.greyDk);
  for (let k = 0; k <= 3; k++) line(c, [[150 + k * 260, 80], [150 + k * 260, 500]], 3, COL.greyDk);
  cell(c, 280, 110, 110, 0); torch(c, 440, 110, 110, 0, false); clock(c, 800, 110, 26, 0.3);
  rows.forEach(([t, k], i) => { write(c, String(i + 1), 264, 150 + i * 60, 40, INK, 5); mark(c, 540, 170 + i * 60, t); mark(c, 800, 170 + i * 60, k); });
  cell(c, 180, 760, 160, 0.4, "1", COL.green);
  [[460, 680], [600, 700], [480, 820], [640, 840]].forEach(([x, y], i) => cell(c, x, y, 160, i % 2 ? -0.3 : 0.3, String(i + 2), COL.yellow));
  cell(c, 900, 760, 160, -0.4, "6", COL.red);
};
// 5. the phone face down beside a kitchen timer and a paper with the battery number
const setupE2a = (c: Ctx) => {
  ground(c); table(c, 160);
  phoneDown(c, 300, 560, 300);
  timer(c, 790, 400, 130, "8");
  paper(c, 560, 600, 440, 400);
  write(c, "72", 650, 700, 200, INK, 12);
};
// 6. the phone standing, playing a cartoon, its torch shining up at the ceiling, the timer beside
const setupE2b = (c: Ctx) => {
  ground(c); ceiling(c); table(c, 920);
  beamUp(c, 330, 310);
  phone(c, 330, 610, 300, (sx, sy, sw, sh) => {
    c.fillStyle = COL.sky; c.fillRect(sx, sy, sw, sh);
    shape(c, () => ell(c, sx + sw * 0.5, sy + sh * 0.92, sw * 0.9, sh * 0.3), COL.greenLt, 5);
    shape(c, () => ell(c, sx + sw * 0.75, sy + sh * 0.2, sw * 0.14, sw * 0.14), COL.yellow, 5);
    shape(c, () => polyP(c, [[sx + sw * 0.35, sy + sh * 0.3], [sx + sw * 0.5, sy + sh * 0.42], [sx + sw * 0.35, sy + sh * 0.58], [sx + sw * 0.2, sy + sh * 0.42]]), COL.red, 5);
    line(c, [[sx + sw * 0.35, sy + sh * 0.58], [sx + sw * 0.3, sy + sh * 0.8]], 4);
  });
  timer(c, 800, 760, 130, "8");
};

// ---------------------------------------------------------------- card pictures
// flow.e1: an old cell cannot light the torch, but it runs the clock
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 640);
  torch(c, 60, 820, 360, -0.1, false);
  clock(c, 790, 320, 200, 0.3);
  cell(c, 540, 650, 380, -0.3, "3");
  arrow(c, [[660, 520], [700, 450]], RED, 10);
};
// flow.e2: the phone shows its battery number, its torch is on, the timer counts 8 minutes
const flowE2 = (c: Ctx) => {
  ground(c); ceiling(c); table(c, 920);
  beamUp(c, 400, 310);
  phone(c, 400, 610, 300, (sx, sy, sw, sh) => {
    shape(c, () => rrect(c, sx + sw * 0.25, sy + sh * 0.2, sw * 0.5, sh * 0.4, 12), WHITE, 5);
    shape(c, () => rrect(c, sx + sw * 0.42, sy + sh * 0.16, sw * 0.16, sh * 0.04, 4), WHITE, 4);
    c.fillStyle = COL.green; c.fillRect(sx + sw * 0.28, sy + sh * 0.6 - sh * 0.34 * 0.7, sw * 0.44, sh * 0.34 * 0.7);
    write(c, "70", sx + sw * 0.22, sy + sh * 0.68, sw * 0.34, WHITE, 7);
  });
  timer(c, 820, 770, 120, "8");
};
// flow.a1: a boy sits with his eyes shut and listens to the fan whirring
const flowA1 = (c: Ctx) => {
  ground(c); ceiling(c); table(c, 860, "#e3cfae");
  fan(c, 540, 250, 300, true);
  const x = 540, y = 890, h = 560; person(c, x, y, h, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.5] });
  const head = h * 0.13, hy = y - h * 0.06 - h * 0.32 - head * 1.05;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.16, head * 0.18), SKIN.child, 0); line(c, [[x + s * head * 0.22, hy + head * 0.14], [x + s * head * 0.48, hy + head * 0.14]], 4); }
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x + s * 420, 300, 40 + k * 40, s > 0 ? -0.6 : Math.PI - 0.6, s > 0 ? 0.6 : Math.PI + 0.6); c.strokeStyle = COL.blueDk; c.lineWidth = 5; c.stroke(); }
};
// flow.a2: wires run from a street pole to a building, where a fan turns in a window
const flowA2 = (c: Ctx) => {
  ground(c); table(c, 900, "#b9b4ab");
  building(c, 600, 260, 440, 640, 2, 3, false);
  pole(c, 200, 120, 900, [[600, 330], [600, 360]]);
  const wx = 600 + 440 / 3 * 0.5 + 440 / 3 * 0.25 + 440 / 3 * 0.25, wy = 260 + 160 * 0.5 + 160 * 0.2 + 48;
  shape(c, () => ell(c, wx, wy, 40, 12), COL.brown, 4); shape(c, () => ell(c, wx, wy, 10, 10), COL.steel, 3);
};
// flow.a3: grandmother waves a palm-leaf fan beside a kerosene lamp: life before the wires
const flowA3 = (c: Ctx) => {
  ground(c); table(c, 900, "#e3cfae");
  const gx = 330, gy = 900, gh = 780, aR: [number, number] = [0.2, -0.5];
  person(c, gx, gy, gh, { adult: true, armR: aR, armL: [Math.PI * 0.55, Math.PI * 0.5] });
  const [wx, wy] = wrist(gx, gy, gh, 1, aR);
  const fx = wx + 80, fy = wy - 150;
  line(c, [[wx, wy], [fx - 30, fy + 70]], 14, INK); line(c, [[wx, wy], [fx - 30, fy + 70]], 8, COL.woodDk);
  shape(c, () => ell(c, fx, fy, 110, 120, 0.25), COL.greenLt);
  for (let k = -3; k <= 3; k++) line(c, [[fx - 10, fy + 105], [fx + k * 30, fy - 100]], 3, COL.leafDk);
  const pts: number[][] = []; for (let k = 0; k <= 6; k++) { const a = 3.4 + k * 0.13; pts.push([fx + Math.cos(a) * 165, fy + Math.sin(a) * 165]); } arrow(c, pts, RED, 9);
  shape(c, () => rrect(c, 700, 700, 300, 200, 16), COL.wood); shade(c, () => rrect(c, 700, 700, 300, 200, 16), COL.woodDk, -30, 0);
  shape(c, () => ell(c, 850, 690, 90, 24), COL.steel);
  shape(c, () => rrect(c, 770, 560, 160, 130, 20), COL.steelDk);
  shape(c, () => { c.moveTo(790, 560); c.quadraticCurveTo(760, 420, 800, 330); c.lineTo(900, 330); c.quadraticCurveTo(940, 420, 910, 560); c.closePath(); }, COL.glass, 5);
  shape(c, () => { c.moveTo(850, 520); c.quadraticCurveTo(800, 460, 850, 390); c.quadraticCurveTo(900, 460, 850, 520); c.closePath(); }, COL.orange, 4);
  shape(c, () => ell(c, 850, 500, 16, 22), COL.yellow, 0);
  shape(c, () => rrect(c, 780, 300, 140, 36, 12), COL.steel);
};
// flow.p1: the electricity meter, a child's hand pointing at its number
const flowP1 = (c: Ctx) => {
  ground(c);
  const box = () => rrect(c, 240, 150, 600, 680, 30);
  shadow(c, 560, 850, 300, 30);
  shape(c, box, COL.steel); shade(c, box, COL.steelDk, -40, -40);
  shape(c, () => rrect(c, 300, 280, 480, 160, 14), COL.black, 5);
  write(c, "04512", 330, 310, 100, "#c9f06b", 8);
  shape(c, () => ell(c, 310, 230, 14, 14), RED, 4);
  shape(c, () => ell(c, 540, 600, 110, 110), WHITE, 5);
  shape(c, () => ell(c, 540, 600, 90, 90), COL.greyDk, 0);
  line(c, [[540, 600], [540 + 60, 600 - 50]], 6, RED);
  shape(c, () => rrect(c, 300, 740, 480, 60, 10), COL.steelDk, 5);
  hand(c, 160, 760, -0.75, 1.5, SKIN.child, CLOTH.child, true);
};
// term.0: a ceiling fan turning, electricity glowing along its wire from the ceiling
const termFan = (c: Ctx) => { ground(c); ceiling(c); fan(c, 540, 560, 400, true, true); };
// term.3: a three-pin plug about to go into a wall socket with its switch
const termPlug = (c: Ctx) => {
  ground(c);
  const sock = () => rrect(c, 640, 300, 360, 480, 24);
  shadow(c, 830, 790, 180, 24);
  shape(c, sock, WHITE); shade(c, sock, COL.grey, -30, -30, 0.35);
  shape(c, () => ell(c, 820, 400, 30, 30), INK, 0);
  shape(c, () => ell(c, 760, 500, 24, 24), INK, 0); shape(c, () => ell(c, 880, 500, 24, 24), INK, 0);
  shape(c, () => rrect(c, 770, 600, 100, 130, 12), COL.cloth, 5); shape(c, () => rrect(c, 780, 610, 80, 60, 8), COL.red, 4);
  c.beginPath(); c.moveTo(130, 560); c.quadraticCurveTo(40, 760, 80, 1120); c.strokeStyle = INK; c.lineWidth = 16; c.stroke();
  const plug = () => rrect(c, 130, 420, 230, 280, 36);
  shadow(c, 260, 720, 130, 24);
  shape(c, plug, WHITE); shade(c, plug, COL.grey, -30, -30, 0.35);
  shape(c, () => rrect(c, 360, 460, 110, 40, 8), BRASS, 5);
  shape(c, () => rrect(c, 360, 580, 100, 32, 8), BRASS, 5); shape(c, () => rrect(c, 360, 620, 100, 32, 8), BRASS, 5);
  arrow(c, [[480, 300], [600, 300]], RED, 10);
};
// term.5: three cells side by side: AA, AAA and a round button cell
const termCells = (c: Ctx) => {
  ground(c); table(c, 160);
  cell(c, 540, 320, 480, 0, undefined, undefined, 170);
  cell(c, 540, 560, 420, 0, undefined, undefined, 105);
  shadow(c, 560, 850, 170, 40);
  shape(c, () => { c.moveTo(390, 790); c.lineTo(390, 830); c.quadraticCurveTo(540, 900, 690, 830); c.lineTo(690, 790); c.closePath(); }, COL.steelDk);
  shape(c, () => ell(c, 540, 790, 150, 50), COL.steel);
  shine(c, [[450, 775], [600, 765]], 8);
  write(c, "+", 500, 760, 70, INK, 7);
};
// term.7: a street at night in a power cut, every window dark but one, where a torch shines
const termPowerCut = (c: Ctx) => {
  ground(c, NIGHT); table(c, 900, "#1f2444");
  shape(c, () => ell(c, 900, 150, 70, 70), "#dfe3f0", 5);
  shape(c, () => ell(c, 930, 130, 58, 58), NIGHT, 0);
  building(c, 120, 200, 840, 700, 3, 3, true, 4);
  line(c, [[1010, 900], [1010, 560]], 14, INK); shape(c, () => rrect(c, 980, 520, 60, 46, 10), "#55506a", 5);
};

export const ic_electricityUsesOfElectricityL2 = cards("sci.electricity.uses-of-electricity.L2", [
  setupE1a, setupE1b, setupE1c, setupE1d, setupE2a, setupE2b,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, termFan, termPlug, termCells, termPowerCut,
]);
