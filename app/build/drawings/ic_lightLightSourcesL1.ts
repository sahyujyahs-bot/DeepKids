import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, cards } from "./flatKit";

// LIGHT SOURCES L1 · set-up cards and card pictures in the flat kit look.
// Dark rooms are a deep violet so the ink outlines still read; light is yellow glow and translucent beams.

const DARK = "#4a4170", DARKF = "#3b3360", FLOOR = "#e2d3b6";
const GOLD = "#e8b43a", GOLDDK = "#b8862a", CLAY = "#b8693c";
const room = (c: Ctx, dark = false, floorY = 760) => { ground(c, dark ? DARK : BG); c.fillStyle = dark ? DARKF : FLOOR; c.fillRect(0, floorY, D, D - floorY); line(c, [[0, floorY], [D, floorY]], 5, INK); };
const glow = (c: Ctx, x: number, y: number, r: number, col = "255,225,110", a = 0.6) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); };
const rays = (c: Ctx, x: number, y: number, r1: number, r2: number, n = 12, col = COL.yellow, w = 8, off = 0) => { for (let i = 0; i < n; i++) { const a = off + (i / n) * Math.PI * 2; line(c, [[x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a) * r2, y + Math.sin(a) * r2]], w, col); } };
const dim = (c: Ctx, x: number, y: number, w: number, h: number, a = 0.6) => { c.fillStyle = `rgba(59,51,96,${a})`; c.fillRect(x, y, w, h); };
// where a person's wrist lands (mirrors person() in flatKit)
const wrist = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number], sit = false): [number, number] => {
  const sh = sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74, sx = x + side * h * 0.11, ex = sx + Math.cos(a1) * h * 0.17, ey = sh + h * 0.03 + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};

// ---------------------------------------------------------------- things
// a torch: body centre at (x, y), lens pointing along an; beam = length of the light cone when on
const torch = (c: Ctx, x: number, y: number, an: number, s = 1, on = true, beam = 0) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  if (on && beam > 0) {
    c.beginPath(); c.moveTo(136, -50); c.lineTo(136 + beam, -50 - beam * 0.42); c.lineTo(136 + beam, 50 + beam * 0.42); c.lineTo(136, 50); c.closePath(); c.fillStyle = "rgba(255,232,130,0.5)"; c.fill();
    c.beginPath(); c.moveTo(136, -30); c.lineTo(136 + beam, -30 - beam * 0.2); c.lineTo(136 + beam, 30 + beam * 0.2); c.lineTo(136, 30); c.closePath(); c.fillStyle = "rgba(255,250,210,0.35)"; c.fill();
  }
  shape(c, () => rrect(c, -130, -34, 200, 68, 20), COL.teal); shade(c, () => rrect(c, -130, -34, 200, 68, 20), COL.tealDk, 0, -20);
  shape(c, () => rrect(c, -50, -46, 34, 16, 7), on ? RED : COL.grey, 4);
  shape(c, () => rrect(c, 60, -54, 80, 108, 16), COL.tealDk);
  shape(c, () => ell(c, 136, 0, 12, 50), on ? COL.yellow : COL.steelDk, 5);
  if (on) shape(c, () => ell(c, 136, 0, 6, 28), WHITE, 0);
  c.restore();
};
const spoon = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -150, -14, 190, 28, 14), COL.steel); shape(c, () => ell(c, 90, 0, 62, 42), COL.steel); shape(c, () => ell(c, 90, 0, 46, 28), COL.steelIn, 4); shine(c, [[-130, -6], [-20, -6]], 7);
  c.restore();
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, on: boolean) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 22), COL.black);
  shape(c, () => rrect(c, x - w / 2 + 10, y - h / 2 + 24, w - 20, h - 48, 10), on ? "#e6f6ff" : "#1e2630", 3);
  if (on) { shape(c, () => rrect(c, x - w / 2 + 28, y - h / 2 + 56, w - 56, 38, 8), COL.sky, 0); shape(c, () => rrect(c, x - w / 2 + 28, y - h / 2 + 112, w - 90, 28, 8), COL.pink, 0); shape(c, () => rrect(c, x - w / 2 + 28, y - h / 2 + 158, w - 70, 28, 8), COL.greenLt, 0); }
};
const mirror = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 16), COL.wood); shape(c, () => rrect(c, x - w / 2 + 16, y - h / 2 + 16, w - 32, h - 32, 8), "#d9eaf5", 4);
  shine(c, [[x - w * 0.25, y + h * 0.3], [x + w * 0.2, y - h * 0.3]], 10); shine(c, [[x - w * 0.05, y + h * 0.35], [x + w * 0.3, y - h * 0.1]], 6);
};
const bangle = (c: Ctx, x: number, y: number, r: number) => {
  c.beginPath(); ell(c, x, y, r, r * 0.55); ell(c, x, y, r * 0.72, r * 0.36); c.fillStyle = GOLD; c.fill("evenodd");
  c.lineWidth = 5; c.strokeStyle = INK; c.beginPath(); ell(c, x, y, r, r * 0.55); c.stroke(); c.beginPath(); ell(c, x, y, r * 0.72, r * 0.36); c.stroke();
  shine(c, [[x - r * 0.6, y - r * 0.3], [x - r * 0.2, y - r * 0.45]], 7);
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number, col = WHITE) => { shadow(c, x + w / 2 + 8, y + h / 2 + 10, w * 0.5, h * 0.5); shape(c, () => rrect(c, x, y, w, h, 6), col, 5); };
const flame = (c: Ctx, x: number, y: number, s = 1) => {
  glow(c, x, y - 60 * s, 170 * s);
  shape(c, () => { c.moveTo(x, y - 150 * s); c.bezierCurveTo(x + 62 * s, y - 80 * s, x + 46 * s, y - 8 * s, x, y + 8 * s); c.bezierCurveTo(x - 46 * s, y - 8 * s, x - 62 * s, y - 80 * s, x, y - 150 * s); }, COL.yellow, 5);
  shape(c, () => { c.moveTo(x, y - 95 * s); c.bezierCurveTo(x + 32 * s, y - 55 * s, x + 26 * s, y - 10 * s, x, y + 2 * s); c.bezierCurveTo(x - 26 * s, y - 10 * s, x - 32 * s, y - 55 * s, x, y - 95 * s); }, COL.orange, 0);
  shape(c, () => ell(c, x, y - 6 * s, 20 * s, 14 * s), COL.blue, 0);
};
// a clay diya, its base centre at (x, y); the wick and flame on the spout to the right
const diya = (c: Ctx, x: number, y: number, s = 1, lit = true) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 14, 6, 150, 22);
  shape(c, () => { c.moveTo(-110, -40); c.bezierCurveTo(-104, 30, 104, 30, 110, -40); c.closePath(); }, CLAY);
  shape(c, () => polyP(c, [[100, -46], [168, -58], [168, -40], [104, -28]]), CLAY, 5);
  shape(c, () => ell(c, 0, -40, 110, 22), CLAY); shape(c, () => ell(c, 0, -40, 90, 14), GOLD, 4);
  line(c, [[120, -50], [148, -74]], 8, COL.black);
  if (lit) flame(c, 150, -74, 0.75);
  c.restore();
};
const sun = (c: Ctx, x: number, y: number, r: number) => { glow(c, x, y, r * 2.2); rays(c, x, y, r * 1.2, r * 1.7, 12, COL.orange, r * 0.12); shape(c, () => ell(c, x, y, r, r), COL.yellow); };
const flower = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y + 20 * s], [x, y + 120 * s]], 8 * s, COL.leafDk); shape(c, () => ell(c, x + 30 * s, y + 85 * s, 30 * s, 14 * s, -0.5), COL.leaf, 4);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 38 * s, y + Math.sin(a) * 38 * s, 26 * s, 18 * s, a), COL.red, 4); }
  shape(c, () => ell(c, x, y, 20 * s, 20 * s), COL.yellow, 4);
};
const bird = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 48 * s, 30 * s, 0.1), COL.blue, 4); shape(c, () => ell(c, x + 42 * s, y - 24 * s, 22 * s, 20 * s), COL.blue, 4);
  shape(c, () => polyP(c, [[x + 62 * s, y - 26 * s], [x + 84 * s, y - 20 * s], [x + 62 * s, y - 14 * s]]), COL.orange, 3);
  shape(c, () => ell(c, x - 8 * s, y - 6 * s, 24 * s, 12 * s, -0.4), COL.blueDk, 3); shape(c, () => ell(c, x + 46 * s, y - 28 * s, 3 * s, 3 * s), INK, 0);
  line(c, [[x - 40 * s, y + 2 * s], [x - 70 * s, y - 14 * s]], 6 * s, COL.blueDk);
};
// the bright drawing stuck on a wall: top-left (x, y), width w
const drawing = (c: Ctx, x: number, y: number, w: number) => {
  const h = w * 1.2, s = w / 600;
  shape(c, () => rrect(c, x, y, w, h, 6), WHITE, 5);
  for (const [tx, ty] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) shape(c, () => rrect(c, tx - 26 * s, ty - 12 * s, 52 * s, 24 * s, 4), COL.yellow, 3);
  flower(c, x + w * 0.32, y + h * 0.5, s * 1.3); bird(c, x + w * 0.68, y + h * 0.3, s * 1.1);
};
const window = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.sky, 6); sun(c, x + w * 0.3, y + h * 0.3, w * 0.12);
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 10, COL.woodDk); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 10, COL.woodDk);
  c.lineWidth = 6; c.strokeStyle = INK; c.beginPath(); rrect(c, x, y, w, h, 8); c.stroke();
};
const cell = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 10), COL.steel); shade(c, () => rrect(c, x, y, w, h, 10), COL.steelDk, -w * 0.3, 0); shape(c, () => rrect(c, x + w * 0.3, y - 10, w * 0.4, 12, 3), "#c98a4a", 4); shape(c, () => rrect(c, x + 6, y + h * 0.35, w - 12, h * 0.3, 4), COL.orange, 3); };
const tally = (c: Ctx, x: number, y: number, n: number, s = 1) => { for (let i = 0; i < n; i++) line(c, [[x + i * 18 * s, y], [x + i * 18 * s, y + 60 * s]], 5 * s); if (n >= 4) line(c, [[x - 10 * s, y + 50 * s], [x + 64 * s, y + 10 * s]], 5 * s); };

// ---------------------------------------------------------------- set-up cards
// e1 step 1: the tray of things in a bright room
const e1s0 = (c: Ctx) => {
  room(c, false, 980);
  shadow(c, 560, 930, 460, 36);
  shape(c, () => rrect(c, 90, 300, 900, 600, 40), COL.wood); shape(c, () => rrect(c, 130, 340, 820, 520, 28), "#f8d98f", 5);
  torch(c, 290, 470, -0.15, 1.05, false); phone(c, 560, 470, 150, 250, true); paper(c, 760, 360, 170, 220);
  spoon(c, 290, 740, -0.2, 1.05); mirror(c, 560, 740, 160, 190); bangle(c, 830, 740, 78);
};
// e1 step 2: grown-up and girl in a dark bathroom, the spoon cannot be seen
const e1s1 = (c: Ctx) => {
  room(c, true, 880);
  shape(c, () => rrect(c, 70, 110, 300, 770, 10), "#6b4a2e", 6); shape(c, () => rrect(c, 110, 150, 220, 300, 6), "#5a3c24", 4); shape(c, () => rrect(c, 110, 490, 220, 340, 6), "#5a3c24", 4); shape(c, () => ell(c, 330, 500, 16, 16), GOLD, 4);
  person(c, 760, 880, 720, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.5] });
  const g: { armR: [number, number] } = { armR: [-1.0, -1.45] };
  person(c, 470, 880, 540, g);
  const [wx, wy] = wrist(470, 880, 540, 1, g.armR);
  c.globalAlpha = 0.16; spoon(c, wx + 6, wy - 30, -Math.PI / 2, 1.1); c.globalAlpha = 1;
};
// e1 step 3: the girl's torch beam lights the spoon in her other hand
const e1s2 = (c: Ctx) => {
  room(c, true, 900);
  const p: { armL: [number, number]; armR: [number, number] } = { armL: [Math.PI * 0.9, Math.PI * 1.1], armR: [0.1, -0.1] };
  person(c, 430, 900, 560, p);
  const [lx, ly] = wrist(430, 900, 560, -1, p.armL), [rx, ry] = wrist(430, 900, 560, 1, p.armR);
  torch(c, lx + 40, ly, 0, 1, true, 360);
  glow(c, rx + 40, ry - 40, 170); spoon(c, rx + 40, ry + 36, -Math.PI / 2, 1.2);
};
// e2 step 1: the drawing on the far wall of a dark room
const e2s0 = (c: Ctx) => { room(c, true, 900); drawing(c, 240, 150, 600); };
// e2 step 2: the girl holds up a phone screen; the drawing stays dim
const e2s1 = (c: Ctx) => {
  room(c, true, 980);
  drawing(c, 60, 300, 270); dim(c, 40, 280, 320, 380, 0.62);
  const p: { armL: [number, number] } = { armL: [Math.PI * 0.9, Math.PI * 1.1] };
  person(c, 760, 980, 600, p);
  const [lx, ly] = wrist(760, 980, 600, -1, p.armL);
  glow(c, lx - 40, ly, 190, "220,240,255", 0.55); phone(c, lx - 30, ly, 120, 210, true);
};
// e2 step 3: the torch beam reaches the drawing, bright and clear
const e2s2 = (c: Ctx) => {
  room(c, true, 980);
  const p: { armL: [number, number] } = { armL: [Math.PI * 0.9, Math.PI * 1.1] };
  const [lx, ly] = wrist(760, 980, 600, -1, p.armL);
  drawing(c, 60, 300, 270);
  person(c, 760, 980, 600, p);
  torch(c, lx - 40, ly, Math.PI, 1, true, 420);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: guessing in the bright room, two piles: will shine / will vanish
const flowE1 = (c: Ctx) => {
  room(c, false, 620);
  person(c, 540, 1040, 560, { armL: [Math.PI * 0.85, Math.PI * 0.95], armR: [Math.PI * 0.15, Math.PI * 0.05] });
  shape(c, () => ell(c, 220, 880, 200, 90), "#d9c7a4", 5); shape(c, () => ell(c, 860, 880, 200, 90), "#d9c7a4", 5);
  glow(c, 160, 840, 160); torch(c, 150, 870, -0.3, 0.8, true); phone(c, 300, 820, 100, 170, true); glow(c, 300, 820, 90, "220,240,255", 0.5);
  spoon(c, 780, 850, -0.4, 0.8); mirror(c, 920, 830, 110, 130); bangle(c, 860, 940, 60);
};
// flow.e2: phone glow is small, torch beam reaches the far drawing
const flowE2 = (c: Ctx) => {
  room(c, true, 980);
  drawing(c, 300, 70, 480);
  glow(c, 300, 760, 200, "220,240,255", 0.55); phone(c, 300, 780, 150, 260, true);
  torch(c, 760, 820, -Math.PI / 2, 1, true, 320);
  dim(c, 300, 70, 240, 580, 0.55);
};
// flow.a1: a sunlit patch on the floor, the girl points back to the window
const flowA1 = (c: Ctx) => {
  room(c, false, 640);
  c.strokeStyle = "#cbb894"; c.lineWidth = 3; for (let x = 0; x <= D; x += 120) { c.beginPath(); c.moveTo(x, 640); c.lineTo(x, D); c.stroke(); } for (let y = 640; y <= D; y += 110) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  window(c, 640, 90, 340, 380);
  shape(c, () => polyP(c, [[560, 720], [900, 720], [1010, 920], [480, 920]]), "rgba(255,236,140,0.85)", 0);
  person(c, 250, 1020, 640, { armR: [-0.45, -0.55] });
  arrow(c, [[700, 820], [760, 600], [800, 470]]);
};
// flow.a2: big lights off, tiny lights still glow; the girl keeps a tally
const flowA2 = (c: Ctx) => {
  room(c, true, 900);
  shape(c, () => rrect(c, 420, 160, 440, 290, 14), COL.black, 6); shape(c, () => rrect(c, 440, 180, 400, 230, 8), "#1a1f2a", 3);
  glow(c, 820, 432, 50, "255,80,60", 0.9); shape(c, () => ell(c, 820, 432, 7, 7), "#ff4b3a", 0);
  shape(c, () => rrect(c, 120, 520, 70, 90, 10), COL.cloth, 5); glow(c, 155, 545, 50, "120,255,120", 0.9); shape(c, () => ell(c, 155, 545, 7, 7), "#5cff5c", 0);
  shape(c, () => ell(c, 210, 300, 70, 70), COL.black, 5); glow(c, 210, 300, 80, "120,255,180", 0.5); line(c, [[210, 300], [210, 260]], 5, "#8cffc0"); line(c, [[210, 300], [240, 300]], 5, "#8cffc0");
  person(c, 900, 900, 600, { adult: true });
  const p: { armL: [number, number]; armR: [number, number] } = { armL: [Math.PI * 0.75, Math.PI * 1.35], armR: [Math.PI * 0.3, Math.PI * 0.85] };
  person(c, 420, 900, 540, p);
  const [lx, ly] = wrist(420, 900, 540, -1, p.armL);
  paper(c, lx - 60, ly - 150, 190, 230); tally(c, lx - 10, ly - 100, 5, 1.1);
};
// flow.g1: yellow, dark and white papers, the spoon card goes on the dark one
const flowG1 = (c: Ctx) => {
  ground(c, FLOOR);
  paper(c, 80, 360, 290, 400, COL.yellow); paper(c, 395, 360, 290, 400, "#4a4170"); paper(c, 710, 360, 290, 400, WHITE);
  for (let i = 0; i < 5; i++) paper(c, 460 - i * 4, 110 + i * 5, 160, 200);
  paper(c, 140, 420, 160, 200); sun(c, 220, 520, 42);
  paper(c, 775, 420, 160, 200); torch(c, 855, 520, -Math.PI / 2, 0.45, false);
  hand(c, 470, 790, -1.15, 1.35, SKIN.child, CLOTH.child);
  const cx = 470 + Math.cos(-1.15) * 95, cy = 790 + Math.sin(-1.15) * 95;
  paper(c, cx - 80, cy - 110, 160, 200); spoon(c, cx, cy - 10, -Math.PI / 2 + 0.4, 0.6);
  arrow(c, [[cx + 110, cy - 160], [540, 560]]);
};
// flow.g2: the grown-up calls "Torch on!", the girl flings both hands wide
const flowG2 = (c: Ctx) => {
  room(c, false, 900);
  const a: { armL: [number, number]; adult: boolean } = { armL: [Math.PI * 1.35, Math.PI * 1.5], adult: true };
  person(c, 840, 900, 680, a);
  const [ax, ay] = wrist(840, 900, 680, -1, a.armL);
  paper(c, ax - 90, ay - 190, 180, 220); torch(c, ax, ay - 80, -Math.PI / 2, 0.45, true, 80);
  const g: { armL: [number, number]; armR: [number, number] } = { armL: [Math.PI * 1.12, Math.PI * 1.22], armR: [-Math.PI * 0.12, -Math.PI * 0.22] };
  person(c, 360, 900, 620, g);
  const [lx, ly] = wrist(360, 900, 620, -1, g.armL), [rx, ry] = wrist(360, 900, 620, 1, g.armR);
  rays(c, lx, ly, 70, 120, 10, COL.yellow, 7); rays(c, rx, ry, 70, 120, 10, COL.yellow, 7);
  hand(c, lx + 20, ly + 20, Math.PI * 1.22, 0.75, SKIN.child, CLOTH.child, true); hand(c, rx - 20, ry + 20, -Math.PI * 0.22, 0.75, SKIN.child, CLOTH.child, true);
};
// flow.p1: the paper-cup lantern over a torch fills the ceiling with spots
const flowP1 = (c: Ctx) => {
  room(c, true, 980);
  c.fillStyle = "#564c84"; c.fillRect(0, 0, D, 130); line(c, [[0, 130], [D, 130]], 5, INK);
  const p: { armL: [number, number]; armR: [number, number] } = { armL: [-Math.PI * 0.4, -Math.PI * 0.5], armR: [-Math.PI * 0.6, -Math.PI * 0.5] };
  person(c, 540, 1000, 540, p);
  const [rx, ry] = wrist(540, 1000, 540, 1, p.armR);
  const tx = 540, ty = ry - 20, top = ty - 280;
  const spots: number[][] = [[120, 70], [300, 50], [470, 90], [660, 45], [840, 80], [1000, 60], [560, 110]];
  for (const [sx, sy] of spots) { glow(c, sx, sy, 80, "255,236,150", 0.9); shape(c, () => ell(c, sx, sy, 34, 22), "#fff3b0", 0); line(c, [[tx, top], [sx, sy]], 3, "rgba(255,236,150,0.6)"); }
  torch(c, tx, ty, -Math.PI / 2, 0.9, true, 0);
  shape(c, () => polyP(c, [[tx - 90, ty - 125], [tx + 90, ty - 125], [tx + 72, top], [tx - 72, top]]), COL.paper);
  shape(c, () => ell(c, tx, top, 72, 18), WHITE, 5);
  for (const [dx, dy] of [[-40, 0], [-15, -6], [10, 4], [35, -3], [0, 8], [-28, 7], [25, 7]]) shape(c, () => ell(c, tx + dx, top + dy, 6, 4), COL.yellow, 2);
};
// flow.c1: a torch at the white ceiling lights the picture book in the power cut
const flowC1 = (c: Ctx) => {
  room(c, true, 980);
  c.fillStyle = "#564c84"; c.fillRect(0, 0, D, 120); line(c, [[0, 120], [D, 120]], 5, INK);
  const g: { armR: [number, number] } = { armR: [-Math.PI * 0.4, -Math.PI * 0.5] };
  const [rx, ry] = wrist(800, 980, 580, 1, g.armR);
  glow(c, rx - 40, 100, 420, "255,236,150", 0.8);
  glow(c, 330, 720, 260, "255,236,150", 0.45);
  person(c, 330, 980, 640, { adult: true, sit: true, armL: [Math.PI * 0.6, Math.PI * 0.1], armR: [Math.PI * 0.4, Math.PI * 0.9] });
  shape(c, () => polyP(c, [[200, 700], [330, 720], [460, 700], [460, 820], [330, 840], [200, 820]]), WHITE, 5); line(c, [[330, 720], [330, 840]], 4);
  flower(c, 265, 760, 0.35); bird(c, 395, 760, 0.4);
  person(c, 800, 980, 580, g);
  torch(c, rx, ry - 20, -Math.PI / 2 - 0.3, 1, true, 520);
};
// term.1: a clay diya, flame yellow with a little blue at the bottom
const term1 = (c: Ctx) => { room(c, false, 800); diya(c, 460, 800, 2.6, true); };
// expl.2: the torch on (bright beam) and off (dark), two cells beside it
const expl2 = (c: Ctx) => {
  ground(c, DARK);
  c.fillStyle = "#5a5090"; c.fillRect(0, 0, 540, 760); line(c, [[540, 0], [540, D]], 6, INK); line(c, [[0, 760], [D, 760]], 6, INK);
  glow(c, 270, 300, 300, "255,236,150", 0.8); torch(c, 270, 420, -Math.PI / 2, 1.3, true, 260);
  torch(c, 810, 420, -Math.PI / 2, 1.3, false);
  c.fillStyle = DARKF; c.fillRect(0, 764, D, D - 764);
  cell(c, 440, 820, 80, 200); cell(c, 560, 820, 80, 200);
};

export const ic_lightLightSourcesL1 = cards("sci.light.light-sources.L1", [
  e1s0, e1s1, e1s2, e2s0, e2s1, e2s2,
  flowE1, flowE2, flowA1, flowA2, flowG1, flowG2, flowP1, flowC1, term1, expl2,
]);
