import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, plate, cards } from "./flatKit";

// HOW TOYS MOVE · L1 · set-up cards for the slope test and the drop test, then flow and term cards.
// One tiled room, light from the upper left. The same girl (orange top, side bun) and grown-up (blue).

const FLOOR = "#e6d9bf", FLOORLN = "rgba(43,35,64,0.18)", WALL = "#f6efe0", WALLSIDE = "#e3d2b8";
const FY = 930; // the floor line where feet, books and rolling things sit

// a room: pale wall above, tiled floor below the line y = hz
const room = (c: Ctx, hz = 540) => {
  ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, hz, D, D - hz);
  c.strokeStyle = FLOORLN; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 135) { c.beginPath(); c.moveTo(x, hz); c.lineTo(x, D); c.stroke(); }
  for (let y = hz; y <= D; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  line(c, [[0, hz], [D, hz]], 6);
};
// the tiled floor seen from straight above, the whole card
const floorTop = (c: Ctx) => {
  ground(c, FLOOR); c.strokeStyle = FLOORLN; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 135) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y <= D; y += 135) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
};
// a wall seen edge-on at the left of the room
const wallSide = (c: Ctx, w = 240) => { c.fillStyle = WALLSIDE; c.fillRect(0, 0, w, D); line(c, [[w, 0], [w, D]], 6); };
const bindi = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 15, 15), "#c0392b", 4);
const dashed = (c: Ctx, pts: number[][], w = 4) => { c.setLineDash([16, 14]); line(c, pts, w, "rgba(43,35,64,0.5)"); c.setLineDash([]); };
const arcPts = (x: number, y: number, rx: number, ry: number, a0: number, a1: number, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [x + Math.cos(a) * rx, y + Math.sin(a) * ry]; });

// ---------------------------------------------------------------- things
const ball = (c: Ctx, x: number, y: number, r: number, col = COL.red, dk = "#b4392a") => {
  shadow(c, x + r * 0.12, y + r * 1.02, r * 0.95, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), col);
  shade(c, () => ell(c, x, y, r, r), dk, -r * 0.28, -r * 0.22);
  c.globalAlpha = 0.8; shape(c, () => ell(c, x - r * 0.38, y - r * 0.42, r * 0.2, r * 0.12, -0.7), WHITE, 0); c.globalAlpha = 1;
};
// a closed book seen from the side, centre (x, y), turned by an
const book = (c: Ctx, x: number, y: number, w: number, h: number, an: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 5), col);
  shape(c, () => rrect(c, -w / 2 + 12, -h * 0.22, w - 30, h * 0.44, 3), COL.paper, 3);
  c.restore();
};
// a wooden tray leaned from (x1, y1) down to (x2, y2)
const tray = (c: Ctx, x1: number, y1: number, x2: number, y2: number, t = 40) => {
  const an = Math.atan2(y2 - y1, x2 - x1), ox = -Math.sin(an) * t, oy = Math.cos(an) * t;
  shape(c, () => polyP(c, [[x1, y1], [x2, y2], [x2 + ox, y2 + oy], [x1 + ox, y1 + oy]]), COL.woodDk);
  shape(c, () => polyP(c, [[x1, y1], [x2, y2], [x2 + ox * 0.45, y2 + oy * 0.45], [x1 + ox * 0.45, y1 + oy * 0.45]]), COL.wood, 4);
};
type Slope = { x1: number; y1: number; x2: number; y2: number };
// the slope: n thick books on the floor at the left, the tray resting on them
const slope = (c: Ctx, n: number): Slope => {
  const bw = 320, bh = 82, cols = [COL.green, COL.purple, COL.blue, COL.orange];
  shadow(c, 300, FY + 8, 180, 18);
  for (let i = 0; i < n; i++) book(c, 270, FY - bh / 2 - i * bh, bw, bh, 0, cols[i]);
  const s = { x1: 120, y1: FY - n * bh - 40, x2: 900, y2: FY - 38 };
  tray(c, s.x1, s.y1, s.x2, s.y2);
  return s;
};
// a point on the slope surface, t = 0 at the top and 1 at the bottom, lifted d above the surface
const onSlope = (s: Slope, t: number, d: number) => { const an = Math.atan2(s.y2 - s.y1, s.x2 - s.x1); return { x: s.x1 + (s.x2 - s.x1) * t + Math.sin(an) * d, y: s.y1 + (s.y2 - s.y1) * t - Math.cos(an) * d, an }; };

// a plastic water bottle lying along angle an, centre (x, y); cap at the +x end
const bottle = (c: Ctx, x: number, y: number, len: number, r: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 8, r + 8, len * 0.5, r * 0.25);
  shape(c, () => rrect(c, -len / 2, -r, len * 0.72, r * 2, r * 0.5), COL.sky);
  shape(c, () => rrect(c, len * 0.2, -r * 0.5, len * 0.16, r, 6), COL.sky, 5);
  shape(c, () => rrect(c, len * 0.34, -r * 0.6, len * 0.16, r * 1.2, 6), COL.blue, 5);
  shine(c, [[-len * 0.4, -r * 0.55], [len * 0.1, -r * 0.55]], 8);
  c.restore();
};
// a paper cup lying on its side: narrow end at -x, wide end (the rim) at +x
const cup = (c: Ctx, x: number, y: number, len: number, r1: number, r2: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 6, r2 + 6, len * 0.5, r2 * 0.22);
  shape(c, () => polyP(c, [[-len / 2, -r1], [len / 2, -r2], [len / 2, r2], [-len / 2, r1]]), COL.paper);
  const rA = r1 + (r2 - r1) * 0.7, rB = r1 + (r2 - r1) * 0.86;
  shape(c, () => polyP(c, [[len * 0.2, -rA], [len * 0.36, -rB], [len * 0.36, rB], [len * 0.2, rA]]), COL.teal, 0);
  shape(c, () => ell(c, len / 2, 0, r2 * 0.28, r2), "#e8e2d4", 5);
  shape(c, () => ell(c, len / 2, 0, r2 * 0.16, r2 * 0.75), COL.greyDk, 0);
  shape(c, () => ell(c, -len / 2, 0, r1 * 0.22, r1), COL.paper, 5);
  c.restore();
};
const box = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 6, y + h / 2 + 6, w * 0.55, h * 0.2);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 4), COL.blue);
  shape(c, () => rrect(c, x - w / 2 + 8, y - h / 2 + 8, w - 16, h * 0.35, 3), COL.yellow, 3);
};
const onion = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 6, y + r, r * 0.9, r * 0.2);
  shape(c, () => ell(c, x, y, r, r * 0.95), "#d4a0b8");
  shade(c, () => ell(c, x, y, r, r * 0.95), "#a87392", -r * 0.3, -r * 0.2);
  line(c, [[x - r * 0.45, y - r * 0.55], [x - r * 0.3, y + r * 0.5]], 3, "#a87392"); line(c, [[x + r * 0.45, y - r * 0.55], [x + r * 0.3, y + r * 0.5]], 3, "#a87392");
  shape(c, () => polyP(c, [[x - 10, y - r * 0.85], [x, y - r * 1.35], [x + 10, y - r * 0.85]]), "#c9b88a", 4);
};
// a round pencil lying along angle an, point at the +x end
const pencil = (c: Ctx, x: number, y: number, len: number, r: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 4, r + 6, len * 0.5, r * 0.3);
  shape(c, () => rrect(c, -len / 2, -r, len * 0.84, r * 2, 3), COL.yellow);
  shape(c, () => polyP(c, [[len * 0.34, -r], [len * 0.5, 0], [len * 0.34, r]]), COL.wood, 4);
  shape(c, () => polyP(c, [[len * 0.44, -r * 0.4], [len * 0.5, 0], [len * 0.44, r * 0.4]]), INK, 0);
  shape(c, () => rrect(c, -len / 2 - 2, -r, 18, r * 2, 3), COL.pink, 4);
  c.restore();
};
const eraser = (c: Ctx, x: number, y: number) => { shadow(c, x + 6, y + 22, 44, 8); shape(c, () => rrect(c, x - 40, y - 18, 80, 36, 6), COL.pink); };
const spoon = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 90, y - 9, 120, 18, 9), COL.steel, 4); shape(c, () => ell(c, x + 60, y, 42, 26), COL.steel, 4); shape(c, () => ell(c, x + 60, y - 2, 28, 16), COL.steelIn, 3); };
// a toy car facing right, wheels on the floor at y
const car = (c: Ctx, x: number, y: number, s: number, col = COL.blue) => {
  shadow(c, x + 12 * s, y + 4 * s, 112 * s, 12 * s);
  shape(c, () => { c.moveTo(x - 60 * s, y - 68 * s); c.lineTo(x - 40 * s, y - 108 * s); c.lineTo(x + 36 * s, y - 108 * s); c.lineTo(x + 58 * s, y - 68 * s); c.closePath(); }, col);
  shape(c, () => rrect(c, x - 30 * s, y - 102 * s, 60 * s, 28 * s, 5 * s), COL.sky, 4);
  shape(c, () => rrect(c, x - 100 * s, y - 70 * s, 200 * s, 48 * s, 12 * s), col);
  for (const wx of [x - 60 * s, x + 60 * s]) { shape(c, () => ell(c, wx, y - 22 * s, 25 * s, 25 * s), COL.black); shape(c, () => ell(c, wx, y - 22 * s, 10 * s, 10 * s), COL.grey, 3); }
};
// a painted wooden top, point at (x, y); an = PI/2 lays it on its side pointing left
const topToy = (c: Ctx, x: number, y: number, s: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => { c.moveTo(0, 0); c.lineTo(-70 * s, -95 * s); c.quadraticCurveTo(0, -150 * s, 70 * s, -95 * s); c.closePath(); }, COL.red);
  shape(c, () => polyP(c, [[-44 * s, -60 * s], [44 * s, -60 * s], [60 * s, -82 * s], [-60 * s, -82 * s]]), COL.yellow, 4);
  shape(c, () => rrect(c, -9 * s, -165 * s, 18 * s, 50 * s, 6 * s), COL.wood, 5);
  c.restore();
};
// the card-circle colour top on a short pencil, point at (x, y)
const colourTop = (c: Ctx, x: number, y: number, s: number) => {
  const cy = y - 130 * s, rx = 200 * s, ry = 62 * s;
  shape(c, () => rrect(c, x - 12 * s, cy, 24 * s, 100 * s, 4), COL.yellow);
  shape(c, () => polyP(c, [[x - 12 * s, y - 32 * s], [x, y], [x + 12 * s, y - 32 * s]]), COL.wood, 4);
  shape(c, () => polyP(c, [[x - 5 * s, y - 12 * s], [x, y], [x + 5 * s, y - 12 * s]]), INK, 0);
  c.save(); c.beginPath(); ell(c, x, cy, rx, ry); c.clip(); c.fillStyle = COL.red; c.fillRect(x - rx, cy - ry, rx, ry * 2); c.fillStyle = COL.yellow; c.fillRect(x, cy - ry, rx, ry * 2); c.restore();
  shape(c, () => ell(c, x, cy, rx, ry), "rgba(0,0,0,0)", 6); line(c, [[x, cy - ry], [x, cy + ry]], 4);
  shape(c, () => rrect(c, x - 12 * s, cy - 150 * s, 24 * s, 150 * s, 4), COL.yellow);
  shape(c, () => rrect(c, x - 12 * s, cy - 160 * s, 24 * s, 24 * s, 4), COL.pink, 4);
};
// a stuffed sock hanging from its top at (x, y)
const sock = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x + 34 * s, y + 172 * s, 84 * s, 48 * s), COL.teal);
  shape(c, () => rrect(c, -36 * s + x, y, 72 * s, 150 * s, 10), COL.teal);
  shade(c, () => rrect(c, -36 * s + x, y, 72 * s, 150 * s, 10), COL.tealDk, -14 * s, 0);
  shape(c, () => rrect(c, -40 * s + x, y - 6, 80 * s, 34 * s, 8), WHITE, 5);
};
const bangle = (c: Ctx, x: number, y: number, r: number) => { shadow(c, x + 8, y + 10, r, r * 0.6); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 30; c.stroke(); c.strokeStyle = COL.yellow; c.lineWidth = 20; c.stroke(); };
// a cloth doll standing, feet at (x, y)
const doll = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 8, y + 6, 50 * s, 10 * s);
  for (const k of [-1, 1]) line(c, [[x + k * 18 * s, y - 30 * s], [x + k * 20 * s, y]], 14 * s, SKIN.child);
  shape(c, () => polyP(c, [[x - 52 * s, y - 24 * s], [x + 52 * s, y - 24 * s], [x + 24 * s, y - 125 * s], [x - 24 * s, y - 125 * s]]), COL.pink);
  for (const k of [-1, 1]) line(c, [[x + k * 24 * s, y - 110 * s], [x + k * 50 * s, y - 70 * s]], 12 * s, SKIN.child);
  shape(c, () => ell(c, x, y - 155 * s, 34 * s, 36 * s), SKIN.child);
  shape(c, () => { c.moveTo(x - 34 * s, y - 158 * s); c.bezierCurveTo(x - 34 * s, y - 205 * s, x + 34 * s, y - 205 * s, x + 34 * s, y - 158 * s); c.quadraticCurveTo(x, y - 172 * s, x - 34 * s, y - 158 * s); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, x - 12 * s, y - 152 * s, 3.5 * s, 4 * s), INK, 0); shape(c, () => ell(c, x + 12 * s, y - 152 * s, 3.5 * s, 4 * s), INK, 0);
};
// a chappal seen from above
const chappal = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 8, y + 10, 90, 36);
  shape(c, () => rrect(c, x - 90, y - 34, 180, 68, 30), COL.brown);
  line(c, [[x + 40, y - 30], [x - 10, y], [x + 40, y + 30]], 7, INK); shape(c, () => ell(c, x - 10, y, 7, 7), INK, 0);
};
// a coiled metal spring, centre (x, y)
const spiral = (c: Ctx, x: number, y: number, r0: number, r1: number, turns: number, w: number) => {
  const n = turns * 40, pts: number[][] = [];
  for (let i = 0; i <= n; i++) { const a = (i / 40) * Math.PI * 2, r = r0 + ((r1 - r0) * i) / n; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  line(c, pts, w + 6, INK); line(c, pts, w, COL.steelDk);
};
// a wind-up key: its shaft goes into the toy at (x, y), the butterfly bow sticks out to the left
const key = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - 70 * s, y - 9 * s, 72 * s, 18 * s, 5), COL.steel, 5);
  shape(c, () => rrect(c, x - 150 * s, y - 11 * s, 100 * s, 22 * s, 6), COL.steel, 5);
  c.beginPath(); c.arc(x - 100 * s, y, 32 * s, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 22 * s; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 12 * s; c.stroke();
};

// ---------------------------------------------------------------- set-up cards: e1 the slope test
// 1. a tray leaned on two books, clear floor in front
const e1s0 = (c: Ctx) => { room(c); slope(c, 2); };
// 2. a hand holding a ball at the top, the other things waiting in front
const e1s1 = (c: Ctx) => {
  room(c); const s = slope(c, 2), p = onSlope(s, 0.1, 60);
  ball(c, p.x, p.y, 60);
  hand(c, p.x - Math.cos(0.9) * 112, p.y - Math.sin(0.9) * 112, 0.9, 1.6);
  box(c, 420, 1005, 110, 64); onion(c, 560, 1000, 42); pencil(c, 720, 1012, 170, 13, 0.1); cup(c, 900, 1005, 110, 36, 50, 0);
};
// 3. a paper folded in three: roll, stay, slide
const e1s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 950, 440, 24);
  shape(c, () => rrect(c, 100, 150, 880, 790, 12), COL.paper);
  line(c, [[393, 150], [393, 940]], 4); line(c, [[687, 150], [687, 940]], 4); line(c, [[100, 330], [980, 330]], 4);
  ball(c, 246, 240, 38); box(c, 540, 240, 84, 54); line(c, [[760, 290], [910, 215]], 6); book(c, 835, 232, 80, 22, -0.46, COL.green);
  bottle(c, 246, 470, 200, 42, 0); pencil(c, 246, 640, 180, 14, 0); bangle(c, 246, 810, 50);
  box(c, 540, 460, 120, 70); eraser(c, 540, 640); onion(c, 540, 820, 48);
  book(c, 833, 470, 170, 46, 0, COL.purple); spoon(c, 820, 650); book(c, 833, 820, 150, 36, 0, COL.blue);
};
// 4. on the floor from above: the bottle rolls straight, the cup rolls round in a circle
const e1s3 = (c: Ctx) => {
  floorTop(c);
  bottle(c, 230, 250, 300, 60, Math.PI / 2);
  arrow(c, [[330, 250], [900, 250]], RED, 12);
  cup(c, 300, 880, 200, 56, 80, Math.PI);
  arrow(c, arcPts(560, 880, 270, 270, Math.PI * 1.08, Math.PI * 1.95, 24), RED, 12);
};
// 5. the slope leaned on four books, the picture book sliding down flat
const e1s4 = (c: Ctx) => {
  room(c); const s = slope(c, 4), p = onSlope(s, 0.42, 24);
  book(c, p.x, p.y, 230, 48, p.an, COL.green);
  const a = onSlope(s, 0.62, 80), b = onSlope(s, 0.92, 80);
  arrow(c, [[a.x, a.y], [b.x, b.y]], RED, 12);
};

// ---------------------------------------------------------------- set-up cards: e2 the drop test
const AH = 660, CH = 440;
// 1. two bindis on the wall: knee height, shoulder height; the ball on the floor
const e2s0 = (c: Ctx) => {
  room(c); wallSide(c);
  person(c, 480, FY, CH); person(c, 780, FY, AH, { adult: true });
  const knee = FY - CH * 0.21, sh = FY - AH * 0.74;
  dashed(c, [[190, knee], [455, knee]]); dashed(c, [[190, sh], [705, sh]]);
  bindi(c, 165, knee); bindi(c, 165, sh);
  ball(c, 330, 890, 40);
};
// 2. the grown-up lets the ball go at shoulder height, the child crouches to watch
const e2s1 = (c: Ctx) => {
  room(c); wallSide(c);
  const sh = FY - AH * 0.74;
  bindi(c, 165, sh); bindi(c, 165, FY - CH * 0.21);
  person(c, 760, FY, 400, { sit: true });
  person(c, 560, FY, AH, { adult: true, armL: [Math.PI, Math.PI] });
  ball(c, 270, 528, 40);
  arrow(c, [[270, 600], [270, 840]], RED, 12);
};
// 3. the grown-up presses a bindi on the wall at the top of the bounce
const e2s2 = (c: Ctx) => {
  room(c); wallSide(c);
  const sh = FY - AH * 0.74;
  bindi(c, 165, sh); bindi(c, 165, FY - CH * 0.21);
  person(c, 780, FY, 400, { sit: true });
  ball(c, 330, 890, 40);
  person(c, 540, FY, AH, { adult: true, armL: [Math.PI * 0.88, Math.PI * 0.88] });
  bindi(c, 222, 542);
};

// ---------------------------------------------------------------- flow cards
// e1: the ball rolls down, the book stays at the top
const fe1 = (c: Ctx) => {
  room(c); person(c, 960, 820, 380); const s = slope(c, 2);
  const pb = onSlope(s, 0.14, 24); book(c, pb.x, pb.y, 190, 48, pb.an, COL.purple);
  const p = onSlope(s, 0.6, 56); ball(c, p.x, p.y, 56);
  const a = onSlope(s, 0.78, 60), b = onSlope(s, 1, 60); arrow(c, [[a.x, a.y], [b.x, b.y], [1030, 910]], RED, 12);
};
// e2: dropped from the shoulder bindi, the ball bounces back up, but lower
const fe2 = (c: Ctx) => {
  room(c); wallSide(c);
  const sh = FY - AH * 0.74;
  bindi(c, 165, sh); bindi(c, 165, FY - CH * 0.21); bindi(c, 165, 600);
  person(c, 770, FY, 400, { sit: true });
  person(c, 560, FY, AH, { adult: true, armL: [Math.PI, Math.PI] });
  ball(c, 270, 528, 40);
  arrow(c, [[270, 600], [270, 840]], RED, 12);
  arrow(c, [[300, 885], [340, 790], [380, 690], [400, 620]], RED, 12);
};
// a1: five toys on a mat, the girl pushes the car
const fa1 = (c: Ctx) => {
  room(c, 500);
  shape(c, () => rrect(c, 70, 600, 940, 430, 24), "#e0a86a");
  c.globalAlpha = 0.35; for (let y = 640; y < 1030; y += 40) line(c, [[90, y], [990, y]], 3, "#8a5a3c"); c.globalAlpha = 1;
  ball(c, 200, 720, 55); bangle(c, 420, 720, 52);
  shadow(c, 660, 752, 70, 14); topToy(c, 600, 740, 0.75, Math.PI / 2);
  doll(c, 900, 790, 1);
  car(c, 560, 940, 0.9, COL.red);
  hand(c, 330, 905, 0, 1.3, SKIN.child, CLOTH.child, true);
  arrow(c, [[660, 870], [880, 870]], RED, 12);
};
// a2: the girl holds the string high, the twisted sock spins
const fa2 = (c: Ctx) => {
  room(c);
  person(c, 280, FY, 520, { armR: [-Math.PI * 0.35, -Math.PI * 0.35] });
  line(c, [[415, 409], [415, 520]], 5);
  c.globalAlpha = 0.45; arrow(c, arcPts(415, 600, 150, 45, Math.PI + 0.25, Math.PI * 2 - 0.25), RED, 9); arrow(c, arcPts(415, 700, 150, 45, Math.PI + 0.25, Math.PI * 2 - 0.25), RED, 9); c.globalAlpha = 1;
  sock(c, 415, 520, 1.1);
  arrow(c, arcPts(415, 600, 150, 45, 0.25, Math.PI - 0.25), RED, 9); arrow(c, arcPts(415, 700, 150, 45, 0.25, Math.PI - 0.25), RED, 9);
};
// a3: the heavy book rides on four round pencils, pushed with one hand
const fa3 = (c: Ctx) => {
  room(c);
  shadow(c, 580, 892, 230, 14);
  for (const x of [420, 500, 580, 660]) { shape(c, () => ell(c, x, 870, 18, 18), COL.yellow, 5); shape(c, () => ell(c, x, 870, 5, 5), INK, 0); }
  book(c, 560, 800, 420, 100, 0, COL.blueDk);
  for (let k = 0; k < 3; k++) line(c, [[370, 788 + k * 12], [740, 788 + k * 12]], 2, COL.grey);
  hand(c, 215, 800, 0, 1.4, SKIN.child, CLOTH.child, true);
  arrow(c, [[480, 690], [760, 690]], RED, 12);
};
// a4: the car is pressed down and pulled back; a chappal waits to mark where it stops
const fa4 = (c: Ctx) => {
  room(c);
  chappal(c, 920, 990);
  car(c, 560, 900, 1.6, COL.red);
  hand(c, 453, 644, 0.85, 1.4);
  arrow(c, [[380, 830], [190, 830]], RED, 12);
};
// p1: the red and yellow top spins on a steel plate
const fp1 = (c: Ctx) => {
  room(c, 520);
  plate(c, 540, 850, 400, 115);
  colourTop(c, 540, 845, 1);
  arrow(c, arcPts(540, 715, 250, 85, 0.35, 2.8, 20), RED, 10);
  hand(c, 600, 534, Math.PI * 0.72, 1.1);
};

// ---------------------------------------------------------------- term cards
// roll: a ball turns over and over as it goes along
const tRoll = (c: Ctx) => {
  room(c);
  ball(c, 470, 740, 170);
  shape(c, () => ell(c, 520, 800, 26, 26), COL.yellow, 4);
  arrow(c, arcPts(470, 740, 215, 215, -2.3, -0.9), INK, 8); arrow(c, arcPts(470, 740, 215, 215, 0.85, 2.25), INK, 8);
  arrow(c, [[700, 740], [980, 740]], RED, 12);
};
// bounce: the ball squashes on the floor and springs back up
const tBounce = (c: Ctx) => {
  room(c, 520);
  const dome = () => { c.moveTo(300, 905); c.bezierCurveTo(300, 690, 780, 690, 780, 905); c.closePath(); };
  shadow(c, 560, 910, 260, 18);
  shape(c, dome, COL.red); shade(c, dome, "#b4392a", -40, -30);
  c.globalAlpha = 0.8; shape(c, () => ell(c, 440, 770, 34, 18, -0.5), WHITE, 0); c.globalAlpha = 1;
  line(c, [[280, 870], [230, 840]], 6); line(c, [[800, 870], [850, 840]], 6); line(c, [[270, 905], [215, 905]], 6); line(c, [[810, 905], [865, 905]], 6);
  arrow(c, [[540, 700], [540, 430]], RED, 14);
};
// spring: inside a wind-up car, a coiled spring joined to the wheels, the key outside
const tSpring = (c: Ctx) => {
  room(c, 520);
  car(c, 580, 900, 2.4, COL.red);
  shape(c, () => rrect(c, 380, 744, 330, 92, 10), COL.paper, 5);
  line(c, [[545, 790], [436, 847]], 12, INK); line(c, [[545, 790], [436, 847]], 6, COL.steel);
  spiral(c, 545, 790, 8, 42, 3, 7);
  key(c, 340, 790, 1.2);
  arrow(c, arcPts(220, 790, 75, 75, -2.3, -0.4), RED, 8);
};

export const ic_forcesHowToysWorkL1 = cards("sci.forces.how-toys-work.L1", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2,
  fe1, fe2, fa1, fa2, fa3, fa4, fp1, tRoll, tBounce, tSpring,
]);
