import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, person, write, cards } from "./flatKit";

// READING THE NIGHT SKY (sci.sky.stargazing.L4) · set-up cards and card pictures in the flat kit look.
// Night scenes sit on a deep blue sky; the child is the kit's child on every card.

const NIGHT = "#1f2749", DUSK_HI = "#3b3570", DUSK_MID = "#7d5a8a", DUSK_LO = "#d98a63", WALL = "#f4ecdb", FLOOR = "#d8c7a6", TERRACE = "#564f6e", STARC = "#fff3b8", THREAD = "#4a4458";
const ROOF = "#2a2550", SKYDAY = "#bfe0f5";

// ------------------------------------------------------------------ sky things
const star = (c: Ctx, x: number, y: number, r: number, col = STARC, glow = true) => {
  if (glow) { c.beginPath(); c.arc(x, y, r * 1.9, 0, Math.PI * 2); c.fillStyle = col; c.globalAlpha = 0.18; c.fill(); c.globalAlpha = 1; }
  shape(c, () => { c.moveTo(x, y - r); c.quadraticCurveTo(x + r * 0.22, y - r * 0.22, x + r, y); c.quadraticCurveTo(x + r * 0.22, y + r * 0.22, x, y + r); c.quadraticCurveTo(x - r * 0.22, y + r * 0.22, x - r, y); c.quadraticCurveTo(x - r * 0.22, y - r * 0.22, x, y - r); c.closePath(); }, col, Math.max(2, r * 0.12));
};
const bgStars = (c: Ctx, seed: number, n: number, yMax: number) => { const r = rnd(seed); for (let i = 0; i < n; i++) { const x = r() * D, y = r() * yMax; c.beginPath(); c.arc(x, y, 2 + r() * 3, 0, Math.PI * 2); c.fillStyle = "rgba(255,243,184,0.75)"; c.fill(); } };
const sky = (c: Ctx, horizon = D, col = NIGHT, floor = TERRACE) => { c.fillStyle = col; c.fillRect(0, 0, D, D); if (horizon < D) { c.fillStyle = floor; c.fillRect(0, horizon, D, D - horizon); line(c, [[0, horizon], [D, horizon]], 6); } };
const dash = (c: Ctx, pts: number[][], w = 5, col = STARC, seg = 16) => { c.save(); c.setLineDash([seg, seg]); line(c, pts, w, col); c.restore(); };
// the Saptarishi (Big Dipper) right side up, handle to the left, bowl to the right; Pulaha and Kratu, the two pointer
// stars at the bowl's outer edge, point up to the Pole Star five gaps away
const DIP: number[][] = [[-45, 15], [-10, -5], [20, 5], [50, 10], [45, 60], [95, 55], [100, 0]];
const dipper = (c: Ctx, x: number, y: number, s: number, r = 13) => {
  const P = DIP.map(([u, v]) => [x + u * s, y + v * s]);
  c.globalAlpha = 0.45; line(c, [P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[3]], 3, "#9fb0e8"); c.globalAlpha = 1;
  P.forEach((p) => star(c, p[0], p[1], r));
  return { pulaha: P[5], kratu: P[6], polaris: [x + 125 * s, y - 274 * s] };
};
// the polaris finder: dotted line from Pulaha through Kratu to the Pole Star
const pointerLine = (c: Ctx, d: { pulaha: number[]; kratu: number[]; polaris: number[] }, col = RED) => dash(c, [d.pulaha, d.kratu, d.polaris], 5, col, 14);
const roofEdge = (c: Ctx, x0: number, x1: number, yTop: number, yBot: number) => { shape(c, () => { c.moveTo(x0, yBot); c.lineTo(x0, yTop); c.lineTo(x1, yTop); c.lineTo(x1, yBot); c.closePath(); }, ROOF, 5); const r = rnd(3); for (let i = 0; i < 12; i++) { const wx = x0 + 40 + r() * (x1 - x0 - 80), wy = yTop + 50 + r() * Math.max(10, yBot - yTop - 100); if (wy + 20 < yBot) shape(c, () => rrect(c, wx, wy, 22, 28, 3), "#f3d27a", 2); } };

// ------------------------------------------------------------------ hands and tools
// a fist seen from the front, knuckles up: palm, four finger bumps, a thumb on the right
const fist = (c: Ctx, x: number, y: number, r: number, skin = SKIN.child, lineW = 5) => {
  shape(c, () => rrect(c, x - r, y - r * 0.9, r * 2, r * 1.8, r * 0.45), skin, lineW);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, x - r * 0.72 + k * r * 0.48, y - r * 0.72, r * 0.26, r * 0.3), skin, lineW * 0.8);
  shape(c, () => ell(c, x + r * 0.9, y - r * 0.05, r * 0.3, r * 0.55, 0.3), skin, lineW * 0.8);
};
const ghostFist = (c: Ctx, x: number, y: number, r: number) => { c.save(); c.setLineDash([10, 9]); c.beginPath(); rrect(c, x - r, y - r * 0.9, r * 2, r * 1.8, r * 0.45); c.strokeStyle = STARC; c.lineWidth = 4; c.stroke(); c.restore(); };
// a thumbs-up fist, thumb straight up (the parallax thumb)
const thumbUp = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => rrect(c, x - r, y - r * 0.7, r * 2, r * 1.6, r * 0.4), SKIN.child, 5); for (let k = 0; k < 4; k++) line(c, [[x - r * 0.95, y - r * 0.5 + k * r * 0.45], [x + r * 0.2, y - r * 0.5 + k * r * 0.45]], 3, SKIN.childDk); shape(c, () => rrect(c, x - r * 0.95, y - r * 2.1, r * 0.72, r * 1.6, r * 0.34), SKIN.child, 5); };
// shut one eye of a standing (or sitting) child drawn with person(c, x, y, h): side -1 = viewer's left eye
const eyeShut = (c: Ctx, x: number, y: number, h: number, side: -1 | 1, sit = false) => {
  const hip = sit ? y - h * 0.07 : y - h * 0.4, sh = hip - h * 0.27, head = h * 0.15, hy = sh - head * 1.12, ex = x + side * head * 0.38, ey = hy + head * 0.16;
  shape(c, () => ell(c, ex, ey, head * 0.19, head * 0.23), SKIN.child, 0);
  c.beginPath(); c.arc(ex, ey - head * 0.04, head * 0.14, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "round"; c.stroke();
};
// a pencil: (x, y) is the eraser end, it points along ang
const pencil = (c: Ctx, x: number, y: number, len: number, ang: number, ghost = false) => {
  c.save(); c.translate(x, y); c.rotate(ang); const w = len * 0.075;
  if (ghost) { c.setLineDash([9, 8]); c.beginPath(); rrect(c, -len * 0.12, -w / 2, len * 0.94, w, 3); c.lineTo(len * 0.82, w / 2); c.lineTo(len, 0); c.lineTo(len * 0.82, -w / 2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); c.restore(); return; }
  shape(c, () => rrect(c, 0, -w / 2, len * 0.82, w, 3), COL.yellow);
  line(c, [[len * 0.05, -w * 0.15], [len * 0.78, -w * 0.15]], 3, COL.orange);
  shape(c, () => polyP(c, [[len * 0.82, -w / 2], [len * 0.82, w / 2], [len, 0]]), "#e8c89a");
  shape(c, () => polyP(c, [[len * 0.94, -w * 0.17], [len * 0.94, w * 0.17], [len, 0]]), INK, 0);
  shape(c, () => rrect(c, -len * 0.05, -w / 2, len * 0.09, w, 2), COL.steel);
  shape(c, () => rrect(c, -len * 0.12, -w / 2, len * 0.08, w, 3), COL.pink);
  c.restore();
};
// a drinking straw from its base (x, y) along ang
const straw = (c: Ctx, x: number, y: number, len: number, ang: number, w = 22) => { c.save(); c.translate(x, y); c.rotate(ang); shape(c, () => rrect(c, 0, -w / 2, len, w, w / 2), COL.yellow, 5); line(c, [[w, -w * 0.15], [len - w, -w * 0.15]], 3, RED); c.restore(); };
// the protractor-and-straw tool. (x, y) is the middle of the flat edge, where the straw crosses; ang is the direction the
// straw points (0 = right, negative = up). The semicircle hangs on the lower side of the straw (flip = true puts it on the
// upper side). The thread hangs straight down in the world from (x, y), with a coin on its end.
const protractor = (c: Ctx, r: number, flip = false, numbers = false) => {
  const f = flip ? -1 : 1;
  const body = () => { c.moveTo(-r, 0); c.lineTo(r, 0); c.arc(0, 0, r, 0, Math.PI, flip); c.closePath(); };
  shape(c, body, "rgba(214,236,250,0.7)", 5);
  c.beginPath(); c.arc(0, 0, r * 0.42, 0, Math.PI, flip); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
  for (let deg = 0; deg <= 180; deg += 10) { const a = (deg * Math.PI) / 180, l = deg % 30 === 0 ? 0.2 : 0.11; line(c, [[Math.cos(a) * r * 0.97, f * Math.sin(a) * r * 0.97], [Math.cos(a) * r * (0.97 - l), f * Math.sin(a) * r * (0.97 - l)]], deg % 30 === 0 ? 4 : 2.5); }
  if (numbers) { const ty = flip ? -r * 0.36 : r * 0.22, my = flip ? -r * 0.74 : r * 0.6; write(c, "0", r * 0.68, ty, r * 0.14, INK, 4); write(c, "90", -r * 0.12, my, r * 0.14, INK, 4); write(c, "180", -r * 0.86, ty, r * 0.14, INK, 4); }
};
const protTool = (c: Ctx, x: number, y: number, r: number, ang: number, card = true, numbers = false) => {
  const flip = Math.cos(ang) < 0;
  c.save(); c.translate(x, y); c.rotate(ang);
  if (card) shape(c, () => rrect(c, -r * 1.25, flip ? -r * 1.3 : -r * 0.25, r * 2.5, r * 1.55, 12), COL.paper);
  protractor(c, r, flip, numbers);
  shape(c, () => rrect(c, -r * 1.3, -r * 0.14, r * 2.6, r * 0.28, r * 0.14), COL.yellow, 5); line(c, [[-r * 1.1, -r * 0.04], [r * 1.1, -r * 0.04]], 3, RED);
  for (const t of [-0.85, 0.85]) shape(c, () => rrect(c, t * r - r * 0.09, -r * 0.24, r * 0.18, r * 0.48, 4), "rgba(255,255,255,0.55)", 3);
  c.restore();
  line(c, [[x, y], [x, y + r * 1.12]], 3, THREAD); shape(c, () => ell(c, x, y + r * 1.12 + r * 0.1, r * 0.1, r * 0.1), COL.yellow, 4);
};
// a wall strip of masking tape with a mark every 5 cm and a number every 10, cm0 at the left end; returns px per cm
const strip = (c: Ctx, y: number, cm0: number, h = 72) => {
  const ppc = 16, x0 = 60, x1 = 1020;
  shape(c, () => rrect(c, x0, y, x1 - x0, h, 4), COL.cloth, 5);
  for (let cm = Math.ceil(cm0 / 5) * 5; x0 + (cm - cm0) * ppc < x1 - 4; cm += 5) { const x = x0 + (cm - cm0) * ppc; const ten = cm % 10 === 0; line(c, [[x, y], [x, y + (ten ? h * 0.42 : h * 0.26)]], ten ? 5 : 3); if (ten) write(c, String(cm), x - (String(cm).length * 0.8 * 24) / 2, y + h * 0.48, 24, INK, 4); }
  return { x: (cm: number) => x0 + (cm - cm0) * ppc };
};
// a child standing at (x, y), height h, holding a pencil straight up in the right hand; returns the pencil tip
const childWithPencil = (c: Ctx, x: number, y: number, h: number, shut: -1 | 1 | 0) => {
  const H = person(c, x, y, h, { reachR: [x + 0.16 * h, y - 0.84 * h] });
  if (shut) eyeShut(c, x, y, h, shut);
  const [hx, hy] = H.handR; pencil(c, hx, hy + 60, 265, -Math.PI / 2);
  return [hx, hy + 60 - 265];
};
// a bare bulb on a stand: a lamp standing on the floor at (x, y)
const floorLamp = (c: Ctx, x: number, y: number, h: number) => {
  shadow(c, x + 10, y + 4, h * 0.16, h * 0.03);
  shape(c, () => ell(c, x, y, h * 0.14, h * 0.035), COL.greyDk);
  line(c, [[x, y], [x, y - h * 0.7]], 12, INK); line(c, [[x, y], [x, y - h * 0.7]], 6, COL.grey);
  c.beginPath(); c.arc(x, y - h * 0.84, h * 0.3, 0, Math.PI * 2); c.fillStyle = COL.yellow; c.globalAlpha = 0.25; c.fill(); c.globalAlpha = 1;
  shape(c, () => rrect(c, x - h * 0.05, y - h * 0.74, h * 0.1, h * 0.07, 4), COL.steelDk, 4);
  shape(c, () => ell(c, x, y - h * 0.86, h * 0.12, h * 0.13), COL.yellow, 5);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * h * 0.17, y - h * 0.86 + Math.sin(a) * h * 0.17], [x + Math.cos(a) * h * 0.22, y - h * 0.86 + Math.sin(a) * h * 0.22]], 4, COL.orange); }
};
// a lamp seen from above: a glowing disc
const lampTop = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r * 2.4, 0, Math.PI * 2); c.fillStyle = COL.yellow; c.globalAlpha = 0.22; c.fill(); c.globalAlpha = 1; shape(c, () => ell(c, x, y, r * 1.3, r * 1.3), COL.greyDk, 5); shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + 0.2; line(c, [[x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6], [x + Math.cos(a) * r * 2.0, y + Math.sin(a) * r * 2.0]], 4, COL.orange); } };
// a small card with a star pattern (a constellation card taped on a wall)
const starCard = (c: Ctx, x: number, y: number, w: number, h: number, seed: number) => { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 5), WHITE, 4); const r = rnd(seed); const pts: number[][] = []; for (let i = 0; i < 4; i++) pts.push([x - w * 0.32 + r() * w * 0.64, y - h * 0.3 + r() * h * 0.6]); line(c, pts, 2, COL.steelDk); pts.forEach((p) => shape(c, () => ell(c, p[0], p[1], 4, 4), INK, 0)); };
// a ball with a tilted axis: pole mark (red dot) in direction ang, equator across it
const ballAxis = (c: Ctx, x: number, y: number, r: number, ang: number, col = COL.teal, dk = COL.tealDk) => {
  shape(c, () => ell(c, x, y, r, r), col); shade(c, () => ell(c, x, y, r, r), dk, r * 0.2, r * 0.12);
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.beginPath(); c.ellipse(x, y, r, r * 0.2, ang + Math.PI / 2, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); c.restore();
  const px = x + Math.cos(ang) * r * 0.93, py = y + Math.sin(ang) * r * 0.93; shape(c, () => ell(c, px, py, r * 0.055, r * 0.055), RED, 3);
  return [px, py];
};
// a point on the ball's rim at latitude lat (degrees) on the side toward the viewer's right of the axis
const latPoint = (x: number, y: number, r: number, ang: number, lat: number) => { const a = ang + Math.PI / 2 - (lat * Math.PI) / 180; return { p: [x + Math.cos(a) * r, y + Math.sin(a) * r], a }; };
// a flat square card (horizon) lying along the ball's surface at rim point p, seen edge-on, tangent direction t
const horizonCard = (c: Ctx, p: number[], t: number, len: number) => { c.save(); c.translate(p[0], p[1]); c.rotate(t); shape(c, () => rrect(c, -len / 2, -14, len, 14, 3), WHITE, 4); c.restore(); };
const clay = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r * 0.75), COL.brown, 4);
// a steel tawa on a wire stand, pan top centre (x, y), with heat shimmer above
const tawa = (c: Ctx, x: number, y: number, rx: number, floorY: number) => {
  for (const s of [-1, 1]) line(c, [[x + s * rx * 0.5, y + 20], [x + s * rx * 0.75, floorY]], 7, COL.greyDk);
  shape(c, () => ell(c, x, y + 20, rx * 0.6, rx * 0.1), COL.greyDk, 4);
  shape(c, () => ell(c, x, y, rx, rx * 0.14), COL.black); shape(c, () => ell(c, x, y - 4, rx * 0.86, rx * 0.09), "#555060", 3);
  shape(c, () => rrect(c, x + rx * 0.92, y - 12, rx * 0.5, 22, 10), COL.greyDk, 4);
  c.globalAlpha = 0.55; for (let k = -2; k <= 2; k++) { const hx = x + k * rx * 0.3, pts: number[][] = []; for (let i = 0; i <= 10; i++) pts.push([hx + Math.sin(i * 0.9 + k) * 9, y - 12 - i * 12]); line(c, pts, 4, COL.orange); } c.globalAlpha = 1;
};
// a phone lying on a stool with its torch end covered in foil, a hole of radius hole letting light out to the right
const foilTorch = (c: Ctx, x: number, y: number, hole: number) => {
  shape(c, () => rrect(c, x - 110, y + 25, 240, 60, 6), COL.wood); for (const s of [-1, 1]) line(c, [[x + 5 + s * 95, y + 85], [x + 5 + s * 105, y + 150]], 8, COL.woodDk);
  shape(c, () => rrect(c, x - 100, y - 25, 200, 50, 10), COL.black); shape(c, () => rrect(c, x - 90, y - 17, 150, 34, 6), "#5b5f7a", 2);
  shape(c, () => polyP(c, [[x + 60, y - 36], [x + 128, y - 40], [x + 136, y - 10], [x + 126, y + 14], [x + 134, y + 36], [x + 62, y + 36], [x + 70, y]]), COL.steel, 4);
  line(c, [[x + 75, y - 25], [x + 95, y - 8], [x + 80, y + 20]], 2, COL.steelDk);
  c.beginPath(); c.arc(x + 131, y, hole * 2.2, 0, Math.PI * 2); c.fillStyle = COL.yellow; c.globalAlpha = 0.35; c.fill(); c.globalAlpha = 1;
  shape(c, () => ell(c, x + 131, y, hole, hole), "#fff8d0", 2);
  return [x + 131, y];
};
const eyeIcon = (c: Ctx, x: number, y: number, w: number) => { shape(c, () => { c.moveTo(x - w, y); c.quadraticCurveTo(x, y - w * 0.8, x + w, y); c.quadraticCurveTo(x, y + w * 0.8, x - w, y); c.closePath(); }, WHITE, 5); shape(c, () => ell(c, x, y, w * 0.32, w * 0.32), COL.brown, 4); shape(c, () => ell(c, x, y, w * 0.15, w * 0.15), INK, 0); };
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number, spiral = false) => { shadow(c, x + w / 2 + 14, y + h + 6, w / 2, 14); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper); if (spiral) for (let k = 0; k < Math.floor(w / 70); k++) { const sx = x + 50 + k * 70; shape(c, () => ell(c, sx, y, 11, 11), COL.steel, 4); } };
const clockFace = (c: Ctx, x: number, y: number, r: number, ticks: number, fill = COL.paper) => { shape(c, () => ell(c, x, y, r, r), fill); for (let i = 0; i < ticks; i++) { const a = (i / ticks) * Math.PI * 2, l = ticks >= 60 ? (i % 5 === 0 ? 0.11 : 0.055) : 0.1; line(c, [[x + Math.cos(a) * r * 0.96, y + Math.sin(a) * r * 0.96], [x + Math.cos(a) * r * (0.96 - l), y + Math.sin(a) * r * (0.96 - l)]], ticks >= 60 && i % 5 ? 2.5 : 4); } };
const INDIA: number[][] = [[0.36, 0], [0.46, 0.04], [0.58, 0.12], [0.7, 0.15], [0.86, 0.14], [0.96, 0.2], [0.9, 0.3], [0.76, 0.3], [0.68, 0.36], [0.66, 0.44], [0.58, 0.5], [0.52, 0.6], [0.46, 0.72], [0.42, 0.86], [0.38, 1], [0.32, 0.86], [0.27, 0.68], [0.22, 0.52], [0.16, 0.42], [0.04, 0.38], [0.1, 0.3], [0.2, 0.28], [0.17, 0.17], [0.26, 0.08]];
const india = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => polyP(c, INDIA.map(([u, v]) => [x + u * w, y + v * h])), COL.greenLt, 5);
const marker = (c: Ctx, x: number, y: number, ang: number) => { c.save(); c.translate(x, y); c.rotate(ang); shape(c, () => rrect(c, -90, -16, 130, 32, 8), INK); shape(c, () => rrect(c, 40, -16, 60, 32, 8), COL.red, 5); c.restore(); };

// ================================================================== set-up cards
// e1.0 · a 1.5 m strip of tape on the wall at eye height, marks every 5 cm, numbers every 10
const setupE1_0 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  strip(c, 470, 0, 80);
  marker(c, 560, 945, 0);
};
// e1.1 · a spot on the floor 3 m from the wall
const setupE1_1 = (c: Ctx) => {
  ground(c, "#f8f2e6"); c.fillStyle = FLOOR; c.fillRect(0, 880, D, 200);
  shape(c, () => polyP(c, [[0, 0], [150, 0], [150, 880], [0, 880]]), WALL, 6); line(c, [[150, 880], [D, 880]], 6);
  shape(c, () => rrect(c, 136, 500, 14, 80, 2), COL.cloth, 3);
  const fx = 820;
  for (const a of [0.6, -0.6]) { c.save(); c.translate(fx, 905); c.rotate(a); shape(c, () => rrect(c, -70, -11, 140, 22, 4), COL.cloth, 3); c.restore(); }
  person(c, fx, 900, 500);
  shape(c, () => rrect(c, 160, 940, fx - 220, 20, 4), COL.yellow, 4); for (let k = 0; k < 24; k++) line(c, [[180 + k * 24, 940], [180 + k * 24, 948]], 2);
  shape(c, () => rrect(c, fx - 70, 918, 62, 56, 10), COL.yellow, 5);
  write(c, "3 m", 420, 985, 56, INK, 7);
};
// e1.2 · pencil at arm's length, one eye shut, read the number behind the tip
const setupE1_2 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  strip(c, 300, 30);
  childWithPencil(c, 480, 960, 520, 1);
};
// e1.3 · the other eye shut: the tip now sits far from the first number, the jump
const setupE1_3 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const s = strip(c, 300, 53);
  const tip = childWithPencil(c, 480, 960, 520, -1);
  pencil(c, s.x(60), tip[1] + 265, 265, -Math.PI / 2, true);
  arrow(c, [[s.x(60), 420], [tip[0] - 20, 420]], RED, 8);
};
// e1.4 · the grown-up holds a pencil at a secret distance; the string lies hidden under a cloth
const setupE1_4 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const A = person(c, 300, 960, 660, { adult: true, reachL: [560, 545] });
  person(c, 790, 960, 520);
  pencil(c, A.handL[0], A.handL[1] + 70, 250, -Math.PI / 2);
  line(c, [[470, 935], [740, 935]], 4, THREAD);
  shape(c, () => { c.moveTo(500, 905); c.quadraticCurveTo(560, 870, 640, 900); c.quadraticCurveTo(700, 880, 720, 945); c.quadraticCurveTo(620, 975, 520, 950); c.closePath(); }, COL.pink, 5);
};
// e2.0 · on the balcony at dusk: fist at arm's length above the roof edge, chalk marks for the feet
const setupE2_0 = (c: Ctx) => {
  c.fillStyle = DUSK_HI; c.fillRect(0, 0, D, 380); c.fillStyle = DUSK_MID; c.fillRect(0, 380, D, 200); c.fillStyle = DUSK_LO; c.fillRect(0, 580, D, 200);
  bgStars(c, 5, 10, 330);
  roofEdge(c, 430, D, 490, 760);
  c.fillStyle = TERRACE; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  for (let x = 40; x < D; x += 80) line(c, [[x, 600], [x, 760]], 8, COL.greyDk); line(c, [[0, 600], [D, 600]], 12, COL.greyDk);
  const cx = 400, cy = 960, h = 520;
  for (const s of [-1, 1]) { c.save(); c.setLineDash([]); c.beginPath(); rrect(c, cx + s * 0.075 * h - 34, cy - 24, 76, 30, 10); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke(); c.restore(); }
  const H = person(c, cx, cy, h, { reachR: [cx + 0.22 * h, cy - 0.95 * h] });
  fist(c, H.handR[0], H.handR[1] - 6, 30);
  ghostFist(c, H.handR[0], H.handR[1] - 68, 30); ghostFist(c, H.handR[0], H.handR[1] - 130, 30);
  star(c, H.handR[0], H.handR[1] - 196, 24);
};
// e2.1 · the same roof edge three times: the star one fist up, then two, then three
const setupE2_1 = (c: Ctx) => {
  ground(c);
  [0, 30, 60].forEach((min, i) => {
    const x = 190 + i * 350, top = 150, bot = 800;
    c.save(); c.beginPath(); rrect(c, x - 150, top, 300, bot - top, 14); c.clip(); c.fillStyle = NIGHT; c.fillRect(x - 150, top, 300, bot - top); shape(c, () => polyP(c, [[x - 150, bot], [x - 150, 660], [x + 150, 660], [x + 150, bot]]), ROOF, 5); c.restore();
    c.beginPath(); rrect(c, x - 150, top, 300, bot - top, 14); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
    for (let k = 0; k <= i; k++) fist(c, x, 625 - k * 66, 30);
    star(c, x, 625 - (i + 1) * 66 + 4, 24);
    const t = String(min); write(c, t, x - (t.length * 0.8 * 60) / 2, 850, 60, INK, 7);
  });
};
// e2.2 · the notebook page: three times, the fists counted, an arrow from the first to the last
const setupE2_2 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 160, 130, 760, 830, true);
  for (let k = 0; k < 7; k++) line(c, [[200, 260 + k * 100], [880, 260 + k * 100]], 2, COL.sky);
  [0, 30, 60].forEach((min, i) => {
    const y = 320 + i * 200; write(c, String(min), 230, y - 36, 72, INK, 7);
    line(c, [[400, y - 60], [400, y + 60]], 3, COL.steelDk);
    for (let k = 0; k <= i; k++) fist(c, 480 + k * 80, y, 30);
  });
  arrow(c, [[840, 300], [840, 740]], RED, 9);
  write(c, "2", 790, 880, 70, RED, 8); fist(c, 880, 915, 30);
};
// e3.0 · the tool: a protractor taped to a card, a straw along its flat edge, a thread with a coin from the centre
const setupE3_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 850, 360, 22);
  protTool(c, 540, 380, 270, 0, true, true);
};
// e3.1 · test by day: sight the top of a building across the road
const setupE3_1 = (c: Ctx) => {
  ground(c, SKYDAY);
  shape(c, () => ell(c, 170, 150, 70, 70), COL.yellow, 5);
  shape(c, () => rrect(c, 760, 180, 320, 600, 6), "#d9a07a"); for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 800 + k * 90, 230 + r * 100, 50, 60, 4), COL.sky, 3);
  c.fillStyle = "#8d8a96"; c.fillRect(0, 780, D, 130); line(c, [[0, 780], [D, 780]], 5); for (let x = 20; x < D; x += 120) line(c, [[x, 845], [x + 60, 845]], 6, WHITE);
  c.fillStyle = FLOOR; c.fillRect(0, 910, D, 170); line(c, [[0, 910], [D, 910]], 6);
  const cx = 380, cy = 960, h = 520, eye = [cx + 0.057 * h, cy - 0.814 * h], tgt = [760, 180], an = Math.atan2(tgt[1] - eye[1], tgt[0] - eye[0]);
  const hx = eye[0] + Math.cos(an) * 0.2 * h, hy = eye[1] + Math.sin(an) * 0.2 * h;
  person(c, cx, cy, h, { reachR: [hx, hy] });
  eyeShut(c, cx, cy, h, -1);
  protTool(c, hx, hy, 105, an);
  dash(c, [[hx + Math.cos(an) * 150, hy + Math.sin(an) * 150], [tgt[0] - 10, tgt[1] + 10]], 4, INK, 12);
};
// e3.2 · at night: find the Pole Star from the pointer stars and sight it along the straw
const setupE3_2 = (c: Ctx) => {
  sky(c, 960); bgStars(c, 11, 40, 900);
  const d = dipper(c, 250, 560, 1.25); pointerLine(c, d); star(c, d.polaris[0], d.polaris[1], 20, WHITE);
  const cx = 760, cy = 960, h = 520, eye = [cx - 0.057 * h, cy - 0.814 * h], an = Math.atan2(d.polaris[1] - eye[1], d.polaris[0] - eye[0]);
  const hx = eye[0] + Math.cos(an) * 0.2 * h, hy = eye[1] + Math.sin(an) * 0.2 * h;
  person(c, cx, cy, h, { reachL: [hx, hy] });
  eyeShut(c, cx, cy, h, 1);
  protTool(c, hx, hy, 105, an);
  dash(c, [[hx + Math.cos(an) * 150, hy + Math.sin(an) * 150], [d.polaris[0] - Math.cos(an) * 30, d.polaris[1] - Math.sin(an) * 30]], 4, STARC, 12);
};
// e3.3 · five readings with the middle one circled, and the city's latitude on the map
const setupE3_3 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 90, 150, 430, 780, true);
  [11, 12, 13, 14, 15].forEach((v, i) => { const y = 250 + i * 135; write(c, v + "°", 200, y, 80, INK, 8); if (v === 13) { c.beginPath(); ell(c, 275, y + 42, 130, 70); c.strokeStyle = RED; c.lineWidth = 8; c.stroke(); } });
  india(c, 560, 150, 460, 760);
  shape(c, () => ell(c, 560 + 0.47 * 460, 150 + 0.69 * 760, 14, 14), RED, 4);
  write(c, "13°", 560 + 0.5 * 460, 150 + 0.72 * 760, 64, INK, 7);
};
// a1.0 · the room from above: twelve star cards round the walls, the lamp in the middle
const setupA1_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 120, 840, 840, 10), FLOOR, 16);
  for (let i = 0; i < 3; i++) { const t = 260 + i * 280; starCard(c, t, 175, 110, 72, i); starCard(c, t, 905, 110, 72, 10 + i); starCard(c, 175, t, 72, 110, 20 + i); starCard(c, 905, t, 72, 110, 30 + i); }
  lampTop(c, 540, 540, 46);
};
// a1.1 · standing on the string ring with her back to the lamp
const roomFront = (c: Ctx, calendar = false) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 700, D, 380); line(c, [[0, 700], [D, 700]], 6);
  for (let i = 0; i < 3; i++) starCard(c, 240 + i * 220, 330, 130, 90, 40 + i);
  if (calendar) { shape(c, () => rrect(c, 760, 240, 220, 180, 6), WHITE, 4); for (let m = 0; m < 12; m++) { const bx = 772 + (m % 4) * 50, by = 252 + Math.floor(m / 4) * 54; shape(c, () => rrect(c, bx, by, 44, 46, 3), COL.paper, 2); const t = String(m + 1); write(c, t, bx + 22 - t.length * 8, by + 11, 22, INK, 3); } c.beginPath(); ell(c, 772 + 50 + 22, 252 + 23, 26, 28); c.strokeStyle = RED; c.lineWidth = 6; c.stroke(); }
  c.beginPath(); ell(c, 540, 860, 400, 90); c.strokeStyle = THREAD; c.lineWidth = 5; c.stroke();
  floorLamp(c, 540, 790, 430);
};
const setupA1_1 = (c: Ctx) => { roomFront(c); person(c, 797, 929, 500); };
// a1.2 · a few steps round the ring, facing the next card; the calendar's next month circled
const setupA1_2 = (c: Ctx) => {
  roomFront(c, true);
  const pts: number[][] = []; for (let a = 50; a <= 130; a += 8) pts.push([540 + Math.cos((a * Math.PI) / 180) * 400, 860 + Math.sin((a * Math.PI) / 180) * 90 + 20]);
  arrow(c, pts, RED, 8);
  person(c, 283, 929, 500);
};
// a2.0 · the ball in a bowl on a table, its north pole turned to face the paper star on the far wall
const ballInBowl = (c: Ctx, x: number, rimY: number, r: number, ballR: number, ang: number) => {
  const body = () => { c.moveTo(x - r, rimY); c.bezierCurveTo(x - r * 0.9, rimY + r * 0.75, x + r * 0.9, rimY + r * 0.75, x + r, rimY); c.closePath(); };
  shadow(c, x + r * 0.1, rimY + r * 0.68, r * 0.8, r * 0.12);
  shape(c, () => ell(c, x, rimY, r, r * 0.2), COL.steelIn, 5);
  const pole = ballAxis(c, x, rimY - ballR * 0.75, ballR, ang);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.35, -r * 0.05);
  c.beginPath(); c.ellipse(x, rimY, r, r * 0.2, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  return pole;
};
const setupA2_0 = (c: Ctx) => {
  ground(c, "#f8f2e6"); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  shape(c, () => polyP(c, [[930, 0], [D, 0], [D, 900], [930, 900]]), WALL, 6);
  shape(c, () => rrect(c, 60, 640, 560, 40, 6), COL.wood); for (const lx of [100, 580]) shape(c, () => rrect(c, lx - 14, 680, 28, 220, 4), COL.woodDk, 5);
  const ang = (-25 * Math.PI) / 180, pole = ballInBowl(c, 330, 600, 150, 150, ang);
  for (const t of [[-18, 190], [18, 190], [-18, 250], [18, 250]]) shape(c, () => rrect(c, 940 + t[0] - 10, t[1] - 10, 20, 44, 3), "rgba(255,255,255,0.6)", 3);
  shape(c, () => { const sx = 955, sy = 225, R = 60; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? R * 0.45 : R; k ? c.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr) : c.moveTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } c.closePath(); }, COL.yellow, 5);
  dash(c, [[pole[0] + 30 * Math.cos(ang), pole[1] + 30 * Math.sin(ang)], [900, 225 + 20]], 4, INK, 12);
};
// a2.1 · a string from the equator to the pole, pen marks for the cities
const setupA2_1 = (c: Ctx) => {
  ground(c);
  const x = 500, y = 560, r = 330, ang = (-50 * Math.PI) / 180;
  shadow(c, x + 30, y + r + 10, r * 0.9, 26);
  ballAxis(c, x, y, r, ang);
  const ex = Math.cos(ang), ey = Math.sin(ang), px = Math.cos(ang + Math.PI / 2), py = Math.sin(ang + Math.PI / 2);
  const pt = (lat: number) => { const l = (lat * Math.PI) / 180; return [x + r * (Math.cos(l) * 0.55 * px + Math.sin(l) * ex), y + r * (Math.cos(l) * 0.55 * py + Math.sin(l) * ey)]; };
  const s: number[][] = []; for (let l = 0; l <= 90; l += 3) s.push(pt(l));
  const tail = [pt(0)[0] - 30, pt(0)[1] + 70];
  line(c, [tail, ...s], 9, INK); line(c, [tail, ...s], 5, COL.cloth);
  [8, 19, 29].forEach((lat) => { const p = pt(lat), q = pt(lat + 2); let nx = -(q[1] - p[1]), ny = q[0] - p[0]; const n = Math.hypot(nx, ny); nx /= n; ny /= n; if (nx * (x - p[0]) + ny * (y - p[1]) < 0) { nx = -nx; ny = -ny; } line(c, [[p[0] - nx * 18, p[1] - ny * 18], [p[0] + nx * 18, p[1] + ny * 18]], 7, INK); const t = String(lat); write(c, t, p[0] + nx * 60 - t.length * 16, p[1] + ny * 60 - 20, 40, INK, 5); });
  marker(c, 860, 960, -0.3);
};
// a2.2 · at a city mark, a straw pointing at the star and a flat card for the horizon
const setupA2_2 = (c: Ctx) => {
  ground(c);
  const x = 330, y = 640, r = 280, ang = (-50 * Math.PI) / 180;
  shadow(c, x + 30, y + r + 10, r * 0.9, 24);
  ballAxis(c, x, y, r, ang);
  const q = latPoint(x, y, r, ang, 13);
  horizonCard(c, q.p, q.a - Math.PI / 2, 190);
  clay(c, q.p[0], q.p[1], 22);
  straw(c, q.p[0], q.p[1], 250, ang);
  const sx = q.p[0] + Math.cos(ang) * 560, sy = q.p[1] + Math.sin(ang) * 560;
  dash(c, [[q.p[0] + Math.cos(ang) * 275, q.p[1] + Math.sin(ang) * 275], [sx - Math.cos(ang) * 50, sy - Math.sin(ang) * 50]], 4, INK, 12);
  star(c, sx, sy, 40, COL.yellow, false);
};
// a2.3 · the protractor at the corner: about 13 degrees between the straw and the card
const setupA2_3 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 1500, 900, 900), COL.teal); shade(c, () => ell(c, 540, 1500, 900, 900), COL.tealDk, 60, 40);
  shape(c, () => rrect(c, 160, 592, 760, 16, 3), WHITE, 4);
  const a = (-13 * Math.PI) / 180;
  c.save(); c.translate(300, 600); protractor(c, 300, true, true); c.restore();
  clay(c, 300, 596, 26);
  straw(c, 300, 594, 620, a);
  write(c, "13°", 650, 505, 60, RED, 7);
};
// a3.0 · the dim corridor: a pinhole torch at one end, a hot tawa in the middle, the child at the other end
const corridor = (c: Ctx, hole: number, steady: boolean) => {
  ground(c, "#3b3a55"); c.fillStyle = "#2e2b40"; c.fillRect(0, 850, D, 230); line(c, [[0, 850], [D, 850]], 5, "#1c1a2a");
  const src = foilTorch(c, 170, 745, hole);
  tawa(c, 540, 775, 150, 850);
  const cx = 880, cy = 960, h = 460;
  const eye = [cx - 0.057 * h, cy - 0.07 * h - 0.27 * h - 0.15 * h * 1.12 + 0.15 * h * 0.16];
  if (steady) { c.globalAlpha = 0.5; line(c, [src, eye], 14, COL.yellow); c.globalAlpha = 1; line(c, [src, eye], 4, "#fff8d0"); }
  else {
    const pts: number[][] = []; for (let i = 0; i <= 40; i++) { const t = i / 40, x = src[0] + (eye[0] - src[0]) * t, y = src[1] + (eye[1] - src[1]) * t, w = x > 400 ? Math.sin(i * 1.7) * 8 : 0; pts.push([x, y + w]); }
    dash(c, pts, 4, "#fff8d0", 10);
    for (const k of [0.62, 0.74, 0.86]) { const x = src[0] + (eye[0] - src[0]) * k, y = src[1] + (eye[1] - src[1]) * k; star(c, x, y - 26, 9, k === 0.74 ? COL.sky : k === 0.62 ? COL.pink : STARC, false); }
  }
  person(c, cx, cy, h, { sit: true, dir: -1 });
};
const setupA3_0 = (c: Ctx) => corridor(c, 4, false);
// a3.1 · the foil swapped for a wider hole: the light looks steady behind the tawa
const setupA3_1 = (c: Ctx) => corridor(c, 11, true);
// a3.2 · a blue gas flame and a yellow diya flame side by side, the child watching from a distance
const flame = (c: Ctx, x: number, y: number, h: number, outer: string, inner: string) => { shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - h * 0.45, y - h * 0.3, x - h * 0.2, y - h * 0.8, x, y - h); c.bezierCurveTo(x + h * 0.2, y - h * 0.8, x + h * 0.45, y - h * 0.3, x, y); c.closePath(); }, outer, 4); shape(c, () => { c.moveTo(x, y); c.bezierCurveTo(x - h * 0.2, y - h * 0.2, x - h * 0.1, y - h * 0.45, x, y - h * 0.55); c.bezierCurveTo(x + h * 0.1, y - h * 0.45, x + h * 0.2, y - h * 0.2, x, y); c.closePath(); }, inner, 0); };
const setupA3_2 = (c: Ctx) => {
  ground(c, WALL); for (let x = 0; x < D; x += 90) line(c, [[x, 0], [x, 700]], 2, COL.sky); for (let y = 0; y < 700; y += 90) line(c, [[0, y], [D, y]], 2, COL.sky);
  c.fillStyle = FLOOR; c.fillRect(0, 760, D, 320); line(c, [[0, 760], [D, 760]], 6);
  shape(c, () => rrect(c, 0, 690, 700, 80, 4), COL.steel, 5); line(c, [[0, 700], [700, 700]], 3, COL.steelDk);
  shape(c, () => rrect(c, 120, 640, 300, 50, 10), COL.black); shape(c, () => ell(c, 270, 645, 90, 22), COL.greyDk, 5); shape(c, () => ell(c, 270, 645, 60, 14), COL.black, 4);
  for (let k = -3; k <= 3; k++) flame(c, 270 + k * 24, 640, 150 - Math.abs(k) * 22, COL.blue, COL.sky);
  shape(c, () => { c.moveTo(500, 680); c.quadraticCurveTo(540, 700, 590, 690); c.lineTo(600, 660); c.quadraticCurveTo(550, 650, 490, 660); c.closePath(); }, COL.brown, 5);
  flame(c, 590, 660, 130, COL.orange, COL.yellow);
  person(c, 890, 960, 440);
};
// a3.3 · Orion on a phone sky map: red Betelgeuse at a shoulder, blue-white Rigel at a foot
const setupA3_3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 975, 220, 24);
  shape(c, () => rrect(c, 330, 110, 420, 860, 40), COL.black); shape(c, () => rrect(c, 350, 190, 380, 700, 14), NIGHT, 4); shape(c, () => ell(c, 540, 930, 20, 20), COL.greyDk, 3);
  c.save(); c.beginPath(); rrect(c, 350, 190, 380, 700, 14); c.clip(); bgStars(c, 21, 40, D); c.restore();
  const B = [470, 320], Bl = [640, 345], a1 = [495, 585], a2 = [540, 560], a3 = [585, 535], S = [470, 775], R = [655, 795];
  c.globalAlpha = 0.5; line(c, [B, Bl, a3, R, S, a1, B], 3, "#9fb0e8"); line(c, [a1, a2, a3], 3, "#9fb0e8"); c.globalAlpha = 1;
  [a1, a2, a3].forEach((p) => star(c, p[0], p[1], 13)); star(c, Bl[0], Bl[1], 14, WHITE); star(c, S[0], S[1], 13);
  for (const p of [[525, 620], [530, 650], [535, 680]]) star(c, p[0], p[1], 6, STARC, false);
  star(c, B[0], B[1], 26, COL.red); star(c, R[0], R[1], 24, "#bcd8ff");
};
// p1.0 · the page for Dhruva's clock: a circle with 60 marks and a star at the middle
const setupP1_0 = (c: Ctx) => { ground(c); paperSheet(c, 170, 110, 740, 860); clockFace(c, 540, 560, 330, 60); star(c, 540, 560, 26, COL.yellow, false); };
// p1.1 · on the balcony at night: the Saptarishi found, the line from the Pole Star through the pointer stars drawn
const setupP1_1 = (c: Ctx) => {
  sky(c, 960); bgStars(c, 31, 40, 900);
  const d = dipper(c, 250, 500, 1.2); pointerLine(c, d); star(c, d.polaris[0], d.polaris[1], 20, WHITE);
  const cx = 540, cy = 960, h = 480;
  person(c, cx, cy, h, { reachL: [430, 700], reachR: [650, 700] });
  shape(c, () => rrect(c, 420, 620, 240, 180, 8), COL.paper, 5);
  clockFace(c, 540, 710, 62, 12); star(c, 540, 710, 10, COL.orange, false); line(c, [[540, 710], [520, 760], [516, 772]], 4, RED);
};
// p1.2 · five clock faces: the line sits a little further anticlockwise each week
const setupP1_2 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) { const x = 130 + i * 205, y = 500, a = -Math.PI / 2 - i * 0.2; clockFace(c, x, y, 92, 12); line(c, [[x, y], [x + Math.cos(a) * 84, y + Math.sin(a) * 84]], 6, RED); star(c, x, y, 12, COL.orange, false); write(c, String(i + 1), x - 20, 630, 56, INK, 6); }
  const pts: number[][] = []; for (let a = -60; a >= -120; a -= 10) pts.push([540 + Math.cos((a * Math.PI) / 180) * 300, 520 + Math.sin((a * Math.PI) / 180) * 300]);
  arrow(c, pts, RED, 8);
};

// ================================================================== card pictures
// flow.e1 · the pencil seems to jump on the wall strip when the eyes are swapped
const flowE1 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  const s = strip(c, 260, 30);
  const tip = childWithPencil(c, 480, 960, 520, 0);
  pencil(c, s.x(85), tip[1] + 265, 265, -Math.PI / 2, true);
  arrow(c, [[tip[0] + 20, 380], [s.x(85) - 10, 380]], RED, 8);
};
// flow.e2 · in one hour a star climbs about 15 degrees above the roof edge: more fists
const flowE2 = (c: Ctx) => {
  sky(c, 940); bgStars(c, 41, 30, 600);
  roofEdge(c, 0, D, 700, 940);
  const x0 = 330, y0 = 640; ghostFist(c, x0, y0, 32); c.globalAlpha = 0.45; star(c, x0, y0 - 66, 26); c.globalAlpha = 1;
  const x1 = 640, y1 = 640; fist(c, x1, y1, 32); fist(c, x1, y1 - 66, 32); fist(c, x1, y1 - 132, 32); star(c, x1, y1 - 200, 30);
  const pts: number[][] = []; for (let t = 0; t <= 10; t++) { const u = t / 10; pts.push([x0 + 60 + (x1 - x0 - 120) * u, y0 - 66 - Math.sin(u * Math.PI) * 70 - u * 120]); }
  arrow(c, pts, RED, 8);
  write(c, "15°", 420, 200, 90, STARC, 9);
};
// flow.e3 · the tool aimed at the Pole Star: the thread reads the latitude
const flowE3 = (c: Ctx) => {
  sky(c, 960); bgStars(c, 51, 40, 900);
  const d = dipper(c, 700, 560, 1.1); pointerLine(c, d); star(c, d.polaris[0], d.polaris[1], 22, WHITE);
  const an = Math.atan2(d.polaris[1] - 560, d.polaris[0] - 300);
  protTool(c, 300, 560, 220, an, true, true);
  dash(c, [[300 + Math.cos(an) * 300, 560 + Math.sin(an) * 300], [d.polaris[0] - Math.cos(an) * 40, d.polaris[1] - Math.sin(an) * 40]], 4, STARC, 12);
  write(c, "13°", 560, 840, 80, STARC, 8);
};
// flow.a1 · the year in a room, from above: the lamp is the Sun, the ring is the Earth's path, the card behind you is midnight
const flowA1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 120, 840, 840, 10), FLOOR, 16);
  for (let i = 0; i < 3; i++) { const t = 260 + i * 280; starCard(c, t, 175, 110, 72, i); starCard(c, t, 905, 110, 72, 10 + i); starCard(c, 175, t, 72, 110, 20 + i); starCard(c, 905, t, 72, 110, 30 + i); }
  c.beginPath(); ell(c, 540, 540, 260, 260); c.strokeStyle = THREAD; c.lineWidth = 5; c.stroke();
  lampTop(c, 540, 540, 46);
  for (const s of [-1, 1]) { c.save(); c.translate(540 + s * 24, 800); c.rotate(s * 0.15); shape(c, () => ell(c, 0, 0, 14, 30), INK, 0); c.restore(); }
  dash(c, [[540, 835], [540, 870]], 5, RED, 8); arrow(c, [[540, 840], [540, 880]], RED, 7);
  const pts: number[][] = []; for (let a = 95; a <= 175; a += 8) pts.push([540 + Math.cos((a * Math.PI) / 180) * 260, 540 + Math.sin((a * Math.PI) / 180) * 260]);
  arrow(c, pts, RED, 8);
};
// flow.a2 · two straws, both parallel to the axis and aimed at the far star: 13 degrees at Chennai, 29 at Delhi
const flowA2 = (c: Ctx) => {
  ground(c);
  const x = 380, y = 620, r = 360, ang = (-50 * Math.PI) / 180;
  shadow(c, x + 30, y + r + 10, r * 0.9, 24);
  ballAxis(c, x, y, r, ang);
  const sx = 960, sy = 290; star(c, sx, sy, 40, COL.yellow, false);
  for (const [lat, label] of [[13, "13°"], [29, "29°"]] as [number, string][]) {
    const q = latPoint(x, y, r, ang, lat);
    horizonCard(c, q.p, q.a - Math.PI / 2, 110); clay(c, q.p[0], q.p[1], 16); straw(c, q.p[0], q.p[1], 230, ang, 16);
    dash(c, [[q.p[0] + Math.cos(ang) * 250, q.p[1] + Math.sin(ang) * 250], [q.p[0] + Math.cos(ang) * 380, q.p[1] + Math.sin(ang) * 380]], 3, INK, 10);
    write(c, label, q.p[0] + Math.cos(ang) * 250 + 30, q.p[1] + Math.sin(ang) * 250 - 10, 46, RED, 6);
  }
};
// flow.a3 · a pinpoint of light through hot air flickers; a wider light stays steady
const flowA3 = (c: Ctx) => {
  ground(c, "#3b3a55"); line(c, [[60, 540], [1020, 540]], 4, "#1c1a2a");
  for (const [row, hole, steady] of [[300, 4, false], [800, 11, true]] as [number, number, boolean][]) {
    const src = foilTorch(c, 170, row, hole); tawa(c, 540, row + 30, 130, row + 110);
    const eye = [900, row];
    if (steady) { c.globalAlpha = 0.5; line(c, [src, [eye[0] - 60, eye[1]]], 14, COL.yellow); c.globalAlpha = 1; line(c, [src, [eye[0] - 60, eye[1]]], 4, "#fff8d0"); }
    else { const pts: number[][] = []; for (let i = 0; i <= 40; i++) { const t = i / 40, px = src[0] + (eye[0] - 60 - src[0]) * t, w = px > 400 ? Math.sin(i * 1.7) * 8 : 0; pts.push([px, row + w]); } dash(c, pts, 4, "#fff8d0", 10); for (const k of [0.66, 0.78, 0.9]) { const px = src[0] + (eye[0] - 60 - src[0]) * k; star(c, px, row - 28, 9, k === 0.78 ? COL.sky : k === 0.66 ? COL.pink : STARC, false); } }
    eyeIcon(c, eye[0], eye[1], 60);
  }
};
// flow.p1 · Dhruva's clock: the Pole Star at the hub, the pointer stars as the hand, turning anticlockwise
const flowP1 = (c: Ctx) => {
  ground(c);
  paperSheet(c, 100, 100, 880, 880);
  clockFace(c, 540, 540, 370, 60, NIGHT);
  c.save(); c.beginPath(); ell(c, 540, 540, 370, 370); c.clip(); bgStars(c, 61, 50, D); c.restore();
  const d = dipper(c, 415, 814, 1.0, 12);
  line(c, [[540, 540], d.kratu, d.pulaha], 5, RED);
  star(c, 540, 540, 22, WHITE);
  const pts: number[][] = []; for (let a = 30; a >= -60; a -= 10) pts.push([540 + Math.cos((a * Math.PI) / 180) * 300, 540 + Math.sin((a * Math.PI) / 180) * 300]);
  arrow(c, pts, RED, 8);
};
// term.2 · horizon and altitude: a fist covers about 10 degrees, so a star two fists up is at about 20
const term2 = (c: Ctx) => {
  sky(c, 760, NIGHT, "#6d6a80"); bgStars(c, 71, 30, 700);
  for (let deg = 0; deg <= 90; deg += 10) { const y = 760 - deg * 7.4; line(c, [[940, y], [deg % 30 === 0 ? 990 : 970, y]], deg % 30 === 0 ? 5 : 3, STARC); if (deg % 30 === 0) write(c, String(deg), 1000, y - 14, 32, STARC, 4); }
  line(c, [[940, 760], [940, 94]], 4, STARC);
  const cx = 300, cy = 960, h = 480;
  const H = person(c, cx, cy, h, { reachR: [cx + 0.3 * h, 745] });
  fist(c, H.handR[0] + 8, 760, 34);
  ghostFist(c, H.handR[0] + 8, 690, 34);
  star(c, H.handR[0] + 8, 618, 28);
  write(c, "20°", H.handR[0] + 70, 585, 60, STARC, 7);
};
// term.6 · parallax: the thumb seen by the left eye and by the right eye lands on two different spots on the far wall
const term6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 120, 960, 60, 6), WALL, 6);
  const L = [480, 880], R = [600, 880], T = [540, 560];
  const hit = (e: number[]) => e[0] + ((T[0] - e[0]) * (e[1] - 150)) / (e[1] - T[1]);
  dash(c, [L, [hit(L), 150]], 5, COL.blue, 14); dash(c, [R, [hit(R), 150]], 5, COL.teal, 14);
  for (const [hx, col] of [[hit(L), COL.blue], [hit(R), COL.teal]] as [number, string][]) { line(c, [[hx - 18, 132], [hx + 18, 168]], 7, col); line(c, [[hx - 18, 168], [hx + 18, 132]], 7, col); }
  thumbUp(c, T[0], T[1] + 40, 42);
  // the head seen from above: the face strip toward the wall, hair over the rest, ears at the sides
  shape(c, () => ell(c, 540, 950, 150, 140), SKIN.child, 6);
  shape(c, () => ell(c, 540, 812, 24, 18), SKIN.child, 5);
  for (const s of [-1, 1]) shape(c, () => ell(c, 540 + s * 150, 905, 16, 24), SKIN.child, 4);
  shape(c, () => { c.moveTo(395, 905); c.quadraticCurveTo(540, 935, 685, 905); c.bezierCurveTo(700, 1090, 380, 1090, 395, 905); c.closePath(); }, "#2b2340", 5);
  for (const e of [L, R]) { shape(c, () => ell(c, e[0], e[1] - 8, 24, 10), WHITE, 4); shape(c, () => ell(c, e[0], e[1] - 11, 9, 7), INK, 0); }
};
// term.12 · a star's colour shows its temperature: red is coolest, blue-white hottest
const term12 = (c: Ctx) => {
  sky(c); bgStars(c, 81, 40, D);
  const S: [string, string][] = [["#e4523b", "3500°"], ["#ffd34d", "5500°"], ["#ffffff", "7500°"], ["#bcd8ff", "10000°"]];
  S.forEach(([col, t], i) => { const x = 170 + i * 245; c.beginPath(); c.arc(x, 420, 108, 0, Math.PI * 2); c.fillStyle = col; c.globalAlpha = 0.16; c.fill(); c.globalAlpha = 1; star(c, x, 420, 84, col, false); write(c, t, x - (t.length * 0.8 * 44) / 2, 620, 44, STARC, 6); });
  arrow(c, [[120, 760], [960, 760]], RED, 10);
};

export const ic_skyStargazingL4 = cards("sci.sky.stargazing.L4", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE1_4,
  setupE2_0, setupE2_1, setupE2_2,
  setupE3_0, setupE3_1, setupE3_2, setupE3_3,
  setupA1_0, setupA1_1, setupA1_2,
  setupA2_0, setupA2_1, setupA2_2, setupA2_3,
  setupA3_0, setupA3_1, setupA3_2, setupA3_3,
  setupP1_0, setupP1_1, setupP1_2,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowP1, term2, term6, term12,
]);
// frames 0-25: setup.e1.0-4, setup.e2.0-2, setup.e3.0-3, setup.a1.0-2, setup.a2.0-3, setup.a3.0-3, setup.p1.0-2
// frames 26-35: flow.e1, flow.e2, flow.e3, flow.a1, flow.a2, flow.a3, flow.p1, term.2, term.6, term.12
