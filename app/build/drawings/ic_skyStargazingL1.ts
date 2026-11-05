import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, cards } from "./flatKit";

// STARGAZING L1 · the window strip test, the hot tawa test, the Moon's face, twinkle or steady,
// the dung beetle roll, and one Moon at two windows. Same child (orange kurta, bun) and grown-up
// (blue) on every card. Night skies are deep blue with pale stars; rooms are the notebook cream.

const NIGHT = "#1f2a5a", NIGHT_DK = "#141c40", DUSK = "#f2a24a", DUSK2 = "#9b6a8c", STARLT = "#fff3c4";
const WALL = "#f6efe0", WALL_DK = "#4a4463", FLOOR = "#d9c7a8", FLOOR_DK = "#b89f7a";
const MOONC = "#f4ecc8", MOONDK = "#c9bf98", TAWA = "#3a3540", TAWA_DK = "#2b2735";
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// ---------------------------------------------------------------- people helpers
// where person() puts the shoulder joint, head centre and head radius
const body = (x: number, y: number, h: number, sit = false) => {
  const hip = sit ? y - h * 0.06 : y - h * 0.42, sh = sit ? hip - h * 0.32 : y - h * 0.74, head = h * 0.13;
  return { sh, shy: sh + h * 0.03, hy: sh - head * 1.05, head };
};
// arm joint angles so the hand lands on (tx, ty): two-link reach; bend +1 for the left arm (elbow out left), -1 for the right
const armTo = (x: number, y: number, h: number, side: -1 | 1, tx: number, ty: number, sit = false, bend = side): { a: [number, number]; w: number[] } => {
  const b = body(x, y, h, sit), sx = x + side * h * 0.11, sy = b.shy, l1 = h * 0.17, l2 = h * 0.16;
  const dx = tx - sx, dy = ty - sy, d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 1, l1 + l2 - 1);
  const base = Math.atan2(dy, dx), A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const a1 = base - bend * A, ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1;
  const a2 = Math.atan2(ty - ey, tx - ex);
  return { a: [a1, a2], w: [ex + Math.cos(a2) * l2, ey + Math.sin(a2) * l2] };
};
// a hand reaching along a line towards a far point (pointing): the arm nearly straight
const armToward = (x: number, y: number, h: number, side: -1 | 1, tx: number, ty: number) => {
  const b = body(x, y, h), sx = x + side * h * 0.11, sy = b.shy, an = Math.atan2(ty - sy, tx - sx), r = h * 0.31;
  return armTo(x, y, h, side, sx + Math.cos(an) * r, sy + Math.sin(an) * r);
};
// seen from behind: the head is all hair (bun on the right for the child)
const backHead = (c: Ctx, x: number, y: number, h: number, adult = false, sit = false) => {
  const { hy, head } = body(x, y, h, sit);
  shape(c, () => ell(c, x, hy, head, head * 1.05), CLOTH.hair, 6);
  if (!adult) shape(c, () => ell(c, x + head * 0.95, hy - head * 0.2, head * 0.32, head * 0.55), CLOTH.hair, 4);
};
// one eye closed (the right one as we see it): skin over the eye and a short closed-lid line
const wink = (c: Ctx, x: number, y: number, h: number, sit = false) => {
  const { hy, head } = body(x, y, h, sit), ex = x + head * 0.35, ey = hy + head * 0.12;
  shape(c, () => ell(c, ex, ey, head * 0.2, head * 0.2), SKIN.child, 0);
  line(c, [[ex - head * 0.14, ey], [ex + head * 0.14, ey]], 4, INK);
};
// a pointing finger from the wrist towards (tx, ty)
const finger = (c: Ctx, w: number[], tx: number, ty: number, h: number) => {
  const an = Math.atan2(ty - w[1], tx - w[0]), l = h * 0.06;
  line(c, [[w[0], w[1]], [w[0] + Math.cos(an) * l, w[1] + Math.sin(an) * l]], 13, INK);
  line(c, [[w[0], w[1]], [w[0] + Math.cos(an) * l, w[1] + Math.sin(an) * l]], 8, SKIN.child);
};
// the child on hands and knees, facing right, floor at y, s about 1 (knees and hands on the floor)
const crawler = (c: Ctx, x: number, y: number, s: number, eyesShut: boolean) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  // back leg (shin along the floor, knee on it), thigh up to the hip
  line(c, [[-150, -40], [-120, -180]], 40, INK); line(c, [[-150, -40], [-120, -180]], 30, "#6b5a8c");
  line(c, [[-150, -40], [-250, -22]], 36, INK); line(c, [[-150, -40], [-250, -22]], 26, "#6b5a8c");
  shape(c, () => ell(c, -262, -16, 26, 18), SKIN.child, 5);
  // body
  shape(c, () => rrect(c, -170, -230, 320, 110, 50), CLOTH.child);
  shade(c, () => rrect(c, -170, -230, 320, 110, 50), CLOTH.childDk, 0, 36);
  // far arm then near arm, straight down from the shoulder to the hands on the floor
  for (const dx of [96, 130]) {
    line(c, [[dx, -180], [dx + 20, -10]], 40, INK); line(c, [[dx, -180], [dx + 20, -10]], 30, CLOTH.child);
    shape(c, () => ell(c, dx + 28, -8, 28, 16), SKIN.child, 5);
  }
  // head in profile, looking right and down a little
  const hx = 200, hy = -250, r = 56;
  shape(c, () => ell(c, hx, hy, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hx - r * 1.02, hy); c.bezierCurveTo(hx - r * 1.1, hy - r * 1.5, hx + r * 0.7, hy - r * 1.6, hx + r * 0.6, hy - r * 0.85); c.quadraticCurveTo(hx - r * 0.1, hy - r * 0.7, hx - r * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hx - r * 0.95, hy - r * 0.3, r * 0.32, r * 0.55), CLOTH.hair, 4);
  if (eyesShut) line(c, [[hx + r * 0.3, hy + r * 0.12], [hx + r * 0.6, hy + r * 0.12]], 4, INK);
  else shape(c, () => ell(c, hx + r * 0.45, hy + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  c.beginPath(); c.arc(hx + r * 0.55, hy + r * 0.45, r * 0.18, 0.3, Math.PI - 0.6); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  c.restore();
};

// ---------------------------------------------------------------- sky things
const star4 = (c: Ctx, x: number, y: number, r: number, col = STARLT, lw = 0) => shape(c, () => { c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); }, col, lw);
// little flicker marks round a light: short dashes pointing outwards
const flicker = (c: Ctx, x: number, y: number, r: number, n = 8, col = STARLT) => {
  for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2 + 0.3, a = r * 1.25, b = r * (1.6 + (i % 2) * 0.35); line(c, [[x + Math.cos(an) * a, y + Math.sin(an) * a], [x + Math.cos(an) * b, y + Math.sin(an) * b]], 5, col); }
};
const twinkleStar = (c: Ctx, x: number, y: number, r: number, col = STARLT) => { flicker(c, x, y, r, 8, col); star4(c, x, y, r, col, 4); };
const steadyDot = (c: Ctx, x: number, y: number, r: number, col = STARLT) => { c.save(); c.globalAlpha = 0.35; shape(c, () => ell(c, x, y, r * 1.6, r * 1.6), col, 0); c.restore(); shape(c, () => ell(c, x, y, r, r), col, 4); };
const smallStars = (c: Ctx, x0: number, y0: number, w: number, h: number, seed: number, n = 18) => {
  let s = seed >>> 0; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < n; i++) shape(c, () => ell(c, x0 + r() * w, y0 + r() * h, 4 + r() * 3, 4 + r() * 3), STARLT, 0);
};
// the Moon: a pale disc with grey patches; half = the right half lit (a half Moon)
const moon = (c: Ctx, x: number, y: number, r: number, half = false, patches = true) => {
  const path = half ? () => { c.moveTo(x, y - r); c.arc(x, y, r, -Math.PI / 2, Math.PI / 2); c.closePath(); } : () => ell(c, x, y, r, r);
  c.save(); c.globalAlpha = 0.25; shape(c, () => ell(c, x, y, r * 1.35, r * 1.35), MOONC, 0); c.restore();
  shape(c, path, MOONC, 6);
  if (patches) {
    c.save(); c.beginPath(); path(); c.clip();
    shape(c, () => ell(c, x + r * 0.35, y - r * 0.3, r * 0.28, r * 0.22, 0.4), MOONDK, 0);
    shape(c, () => ell(c, x + r * 0.5, y + r * 0.25, r * 0.22, r * 0.3, -0.3), MOONDK, 0);
    shape(c, () => ell(c, x - r * 0.25, y + r * 0.4, r * 0.2, r * 0.14), MOONDK, 0);
    if (!half) { shape(c, () => ell(c, x - r * 0.45, y - r * 0.2, r * 0.26, r * 0.34, 0.5), MOONDK, 0); shape(c, () => ell(c, x - r * 0.1, y - r * 0.55, r * 0.15, r * 0.12), MOONDK, 0); }
    c.restore();
  }
};
// a night sky filling the rectangle (x, y, w, h)
const nightSky = (c: Ctx, x: number, y: number, w: number, h: number, seed = 3) => { c.fillStyle = NIGHT; c.fillRect(x, y, w, h); smallStars(c, x + 20, y + 20, w - 40, h * 0.6, seed); };
// a dusk sky: deep blue above, violet band, orange glow at the bottom
const duskSky = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.fillStyle = NIGHT; c.fillRect(x, y, w, h);
  c.fillStyle = DUSK2; c.fillRect(x, y + h * 0.55, w, h * 0.45);
  c.fillStyle = DUSK; c.fillRect(x, y + h * 0.78, w, h * 0.22);
  smallStars(c, x + 20, y + 20, w - 40, h * 0.4, 5, 10);
};
// a dark row of rooftops with a water tank, bottom edge at y
const rooftops = (c: Ctx, y: number) => {
  shape(c, () => polyP(c, [[0, y], [0, y - 120], [180, y - 120], [180, y - 170], [330, y - 170], [330, y - 110], [520, y - 110], [520, y - 150], [760, y - 150], [760, y - 100], [1080, y - 100], [1080, y]]), NIGHT_DK, 5);
  shape(c, () => rrect(c, 580, y - 240, 110, 90, 12), TAWA, 5);
  shape(c, () => ell(c, 635, y - 240, 55, 12), "#4f4a5c", 4);
  line(c, [[640, y - 150], [640, y - 100]], 5, INK);
};

// ---------------------------------------------------------------- room things
const room = (c: Ctx, floorY: number, dark = false) => {
  c.fillStyle = dark ? WALL_DK : WALL; c.fillRect(0, 0, D, D);
  c.fillStyle = dark ? "#3b3652" : FLOOR; c.fillRect(0, floorY, D, D - floorY);
  line(c, [[0, floorY], [D, floorY]], 5, dark ? "#2b2740" : FLOOR_DK);
};
// a window with the night sky in it; strips = x centres of paper strips stuck on the glass
const window = (c: Ctx, x: number, y: number, w: number, h: number, draw: () => void, strips: number[] = [], stripY = 0) => {
  shadow(c, x + w / 2 + 14, y + h + 18, w / 2, 14);
  shape(c, () => rrect(c, x - 22, y - 22, w + 44, h + 44, 8), COL.wood, 6);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); draw(); c.restore();
  for (const sx of strips) {
    shape(c, () => rrect(c, sx - 24, stripY, 48, 220, 6), COL.paper, 5);
    c.save(); c.globalAlpha = 0.7; shape(c, () => rrect(c, sx - 32, stripY - 8, 64, 30, 4), "#e9d98a", 0); c.restore();
  }
  c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(x, y, w, h);
  // the sill
  shape(c, () => rrect(c, x - 40, y + h + 22, w + 80, 26, 6), COL.woodDk, 6);
};
// a chappal seen from above, toe pointing up the card, centre (x, y)
const slipper = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 6, y + 8, 46, 62);
  shape(c, () => ell(c, x, y, 44, 62), COL.blueDk, 5);
  line(c, [[x - 30, y - 10], [x + 4, y - 36], [x + 30, y - 10]], 8, COL.yellow);
  shape(c, () => ell(c, x + 4, y - 38, 7, 7), INK, 0);
};
// a wooden stool, top centre (x, y)
const stool = (c: Ctx, x: number, y: number, w = 200) => {
  shadow(c, x + 14, y + 180, w * 0.55, 16);
  for (const s of [-1, 1]) { line(c, [[x + s * w * 0.4, y + 10], [x + s * w * 0.44, y + 175]], 14, INK); line(c, [[x + s * w * 0.4, y + 10], [x + s * w * 0.44, y + 175]], 8, COL.woodDk); }
  line(c, [[x - w * 0.42, y + 110], [x + w * 0.42, y + 110]], 8, INK);
  shape(c, () => rrect(c, x - w / 2, y - 14, w, 30, 8), COL.wood, 6);
};
// a steel tumbler standing on (x, y)
const tumbler = (c: Ctx, x: number, y: number, h: number) => {
  const top = h * 0.36, bot = h * 0.3, p = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + h * 0.1, y + 6, h * 0.4, h * 0.08);
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, h * 0.3, 0);
  shape(c, () => ell(c, x, y - h, top, h * 0.07), COL.steelIn, 5);
  line(c, [[x - top * 0.6, y - h * 0.8], [x - bot * 0.6, y - h * 0.15]], 7, WHITE);
};
// a wall calendar: a paper sheet with a red header and a grid of days
const calendar = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 8, y + h + 6, w / 2, 8);
  shape(c, () => rrect(c, x, y, w, h, 6), COL.paper, 5);
  shape(c, () => rrect(c, x, y, w, h * 0.22, 6), COL.red, 5);
  shape(c, () => ell(c, x + w / 2, y - 4, 8, 8), INK, 0);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) shape(c, () => ell(c, x + w * 0.15 + k * w * 0.175, y + h * 0.35 + r * h * 0.16, 5, 5), COL.grey, 0);
};
// a kitchen: counter top at y, a floor below; stove on the counter with a tawa, the phone torch on a steel box behind it
// (its light just above the tawa's rim); hot = flame on and wavy warm air rising from the tawa in front of the light
const kitchen = (c: Ctx, counterY: number, hot: boolean, light: boolean, shiver: boolean) => {
  c.fillStyle = WALL; c.fillRect(0, 0, D, D);
  c.fillStyle = COL.sky; c.fillRect(0, counterY - 360, D, 360);
  c.strokeStyle = "#a9c8dd"; c.lineWidth = 3;
  for (let x = 0; x <= D; x += 120) { c.beginPath(); c.moveTo(x, counterY - 360); c.lineTo(x, counterY); c.stroke(); }
  for (let y = counterY - 360; y <= counterY; y += 120) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  c.fillStyle = COL.wood; c.fillRect(0, counterY, D, 980 - counterY);
  c.fillStyle = COL.grey; c.fillRect(0, counterY, D, 34); line(c, [[0, counterY], [D, counterY]], 6, INK); line(c, [[0, counterY + 34], [D, counterY + 34]], 5, INK);
  c.fillStyle = FLOOR; c.fillRect(0, 980, D, 100); line(c, [[0, 980], [D, 980]], 5, FLOOR_DK);
  if (light) {
    shape(c, () => rrect(c, 820, counterY - 56, 150, 56, 8), COL.steel, 6); shade(c, () => rrect(c, 820, counterY - 56, 150, 56, 8), COL.steelDk, 30, 0);
    shape(c, () => rrect(c, 866, counterY - 176, 72, 120, 10), COL.black, 6);
    c.save(); c.globalAlpha = 0.35; shape(c, () => ell(c, 902, counterY - 144, 44, 44), COL.yellow, 0); c.restore();
    shape(c, () => ell(c, 902, counterY - 144, 18, 18), COL.yellow, 4);
    if (shiver) flicker(c, 902, counterY - 144, 26, 10, COL.orange);
  }
  // the stove: a flat gas stove with one burner, the tawa sitting on the burner stand
  shape(c, () => rrect(c, 360, counterY - 70, 400, 70, 12), COL.black, 6);
  shape(c, () => ell(c, 560, counterY - 70, 110, 26), "#55505f", 5);
  for (const sx of [420, 480]) { shape(c, () => ell(c, sx, counterY - 20, 18, 18), COL.grey, 5); line(c, [[sx, counterY - 30], [sx, counterY - 10]], 4, INK); }
  if (hot) for (let i = 0; i < 5; i++) { const fx = 480 + i * 40; shape(c, () => { c.moveTo(fx - 10, counterY - 66); c.quadraticCurveTo(fx, counterY - 100, fx + 10, counterY - 66); c.closePath(); }, COL.blue, 0); }
  // the tawa: a flat black disc, a long handle to the left
  shape(c, () => rrect(c, 220, counterY - 98, 200, 22, 10), TAWA, 6);
  shape(c, () => ell(c, 560, counterY - 92, 170, 34), TAWA, 6);
  shade(c, () => ell(c, 560, counterY - 92, 170, 34), TAWA_DK, 40, 10);
  shape(c, () => ell(c, 560, counterY - 96, 140, 22), hot ? "#4a4452" : "#443f4e", 3);
  if (hot) {
    c.save(); c.globalAlpha = 0.55;
    for (let i = 0; i < 4; i++) { const wx = 480 + i * 55; c.beginPath(); c.moveTo(wx, counterY - 110); for (let k = 0; k < 4; k++) c.quadraticCurveTo(wx + (k % 2 ? -22 : 22), counterY - 150 - k * 70, wx, counterY - 180 - k * 70); c.strokeStyle = COL.greyDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
    c.restore();
  }
};
// the girl crouching on the floor at the left, two steps back, her eyes at tawa height, looking right across it
const crouchGirl = (c: Ctx, counterY: number) => {
  const x = 150, y = 980, h = 520;
  person(c, x, y, h, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.35], armR: [Math.PI * 0.4, Math.PI * 0.65] });
  const { hy, head } = body(x, y, h, true);
  c.save(); c.setLineDash([10, 14]); line(c, [[x + head * 0.7, hy + head * 0.12], [880, counterY - 144]], 4, COL.greyDk); c.restore();
};
// a torch lying on its side pointing left, lit; the lamp end at (x, y)
const torch = (c: Ctx, x: number, y: number) => {
  c.save(); c.globalAlpha = 0.3; shape(c, () => polyP(c, [[x, y - 36], [x - 260, y - 120], [x - 260, y + 120], [x, y + 36]]), COL.yellow, 0); c.restore();
  shape(c, () => rrect(c, x, y - 24, 190, 48, 10), COL.teal, 6); shade(c, () => rrect(c, x, y - 24, 190, 48, 10), COL.tealDk, 0, 18);
  shape(c, () => rrect(c, x - 22, y - 36, 44, 72, 8), COL.steel, 6);
  shape(c, () => ell(c, x - 20, y, 10, 30), COL.yellow, 4);
};
const paperBall = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 6, y + r * 0.9, r * 0.95, r * 0.25);
  shape(c, () => ell(c, x, y, r, r * 0.92), COL.cloth, 6); shade(c, () => ell(c, x, y, r, r * 0.92), COL.grey, r * 0.3, r * 0.15, 0.5);
  line(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.1, y + r * 0.1], [x + r * 0.4, y - r * 0.2]], 3, COL.greyDk);
  line(c, [[x - r * 0.3, y + r * 0.5], [x + r * 0.2, y + r * 0.3]], 3, COL.greyDk);
};
// a sheet of paper lying on a table, top-left (x, y)
const sheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 10, w / 2, 14); shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 6); };
// a child's crayon line: thinner and a little wobbly
const crayon = (c: Ctx, path: () => void, col: string, w = 7) => { c.beginPath(); path(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); };
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.paper, 5);
  for (let i = 0; i < 12; i++) { const an = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(an) * r * 0.8, y + Math.sin(an) * r * 0.8], [x + Math.cos(an) * r * 0.9, y + Math.sin(an) * r * 0.9]], 3, INK); }
  line(c, [[x, y], [x, y - r * 0.65]], 5, INK); line(c, [[x, y], [x + Math.cos(Math.PI * 0.17) * r * 0.45, y - Math.sin(Math.PI * 0.17) * r * 0.45]], 6, INK);
};

// ================================================================ set-up cards
// e1.0: a steel tumbler on a stool, a calendar on the far wall behind it, the girl three steps away, one eye closed
const e1s0 = (c: Ctx) => {
  room(c, 760);
  // the calendar hangs behind the tumbler, so from where she stands the tumbler is in front of it
  calendar(c, 640, 400, 180, 240);
  stool(c, 700, 640);
  tumbler(c, 700, 628, 120);
  const x = 260, y = 1000, h = 520;
  person(c, x, y, h, { armL: [Math.PI * 0.58, Math.PI * 0.5], armR: [Math.PI * 0.42, Math.PI * 0.5] });
  wink(c, x, y, h);
  const { hy, head } = body(x, y, h);
  c.save(); c.setLineDash([10, 14]); line(c, [[x + head * 0.8, hy + head * 0.12], [660, 570]], 4, COL.greyDk); c.restore();
  arrow(c, [[330, 1040], [500, 1040]]);
};
// e1.1: a night window with three paper strips on the glass, the Moon outside near the first strip
const e1s1 = (c: Ctx) => {
  room(c, 900);
  window(c, 190, 130, 700, 620, () => { nightSky(c, 190, 130, 700, 620, 4); moon(c, 420, 400, 70); }, [340, 470, 600], 300);
};
// e1.2: two slippers along the window, the girl at the first one, one hand over an eye, finding the Moon
const strips2 = [420, 530, 640], MOON2: [number, number, number] = [480, 340, 52];
const e1s2 = (c: Ctx) => {
  room(c, 820);
  window(c, 300, 120, 600, 520, () => { nightSky(c, 300, 120, 600, 520, 6); moon(c, MOON2[0], MOON2[1], MOON2[2]); }, strips2, 250);
  slipper(c, 840, 905);
  slipper(c, 360, 930);
  const x = 360, y = 900, h = 520, b = body(x, y, h), L = armTo(x, y, h, -1, x - b.head * 0.85, b.hy + b.head * 0.05);
  person(c, x, y, h, { armL: L.a, armR: [Math.PI * 0.45, Math.PI * 0.5] });
  backHead(c, x, y, h);
  shape(c, () => ell(c, L.w[0], L.w[1], h * 0.045, h * 0.045), SKIN.child, 5);
};
// e1.3: the girl halfway between the slippers; the strips are now on the other side of the Moon, which has not moved
const e1s3 = (c: Ctx) => {
  room(c, 820);
  window(c, 50, 120, 600, 520, () => { nightSky(c, 50, 120, 600, 520, 6); moon(c, MOON2[0], MOON2[1], MOON2[2]); }, strips2.map((s) => s - 250), 250);
  slipper(c, 590, 905);
  slipper(c, 110, 905);
  const x = 350, y = 900, h = 520, b = body(x, y, h), L = armTo(x, y, h, -1, x - b.head * 0.85, b.hy + b.head * 0.05);
  person(c, x, y, h, { armL: L.a, armR: [Math.PI * 0.45, Math.PI * 0.5] });
  backHead(c, x, y, h);
  shape(c, () => ell(c, L.w[0], L.w[1], h * 0.045, h * 0.045), SKIN.child, 5);
  arrow(c, [[420, 960], [540, 960]]);
};
// e2.0: a cold tawa on the stove, the phone torch on a steel box behind it, the girl crouching two steps back
const e2s0 = (c: Ctx) => { kitchen(c, 800, false, true, false); crouchGirl(c, 800); };
// e2.1: the grown-up's hand turning the stove knob on; warm air rises from the tawa in front of the light
const e2s1 = (c: Ctx) => {
  kitchen(c, 800, true, true, false);
  // the arm comes in from the left edge to the wrist, the hand on the first knob
  line(c, [[0, 900], [370, 800]], 62, INK); line(c, [[0, 900], [370, 800]], 50, CLOTH.adult);
  hand(c, 360, 800, -0.2, 0.9, SKIN.adult, CLOTH.adult);
  c.beginPath(); c.arc(420, 780, 46, Math.PI * 1.2, Math.PI * 1.85); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
  arrow(c, [[420 + Math.cos(Math.PI * 1.8) * 46, 780 + Math.sin(Math.PI * 1.8) * 46], [420 + Math.cos(Math.PI * 1.9) * 46, 780 + Math.sin(Math.PI * 1.9) * 46]], RED, 9);
};
// e2.2: the girl looking across the hot tawa at the light, which now shivers
const e2s2 = (c: Ctx) => { kitchen(c, 800, true, true, true); crouchGirl(c, 800); };
// a1.0: the girl and the grown-up at the window, the room dark, looking at a bright Moon with grey patches
const a1s0 = (c: Ctx) => {
  room(c, 860, true);
  window(c, 200, 90, 680, 560, () => { nightSky(c, 200, 90, 680, 560, 8); moon(c, 560, 300, 110); });
  const ax = 330, ay = 960, ah = 720;
  person(c, ax, ay, ah, { adult: true, armL: [Math.PI * 0.56, Math.PI * 0.5], armR: [Math.PI * 0.44, Math.PI * 0.5] }); backHead(c, ax, ay, ah, true);
  const x = 620, y = 960, h = 520;
  person(c, x, y, h, { armL: [Math.PI * 0.56, Math.PI * 0.5], armR: [Math.PI * 0.44, Math.PI * 0.5] }); backHead(c, x, y, h);
};
// a1.1: the child's drawing of the Moon's shape with grey patches, a small rabbit shape beside it
const a1s1 = (c: Ctx) => {
  room(c, 0); c.fillStyle = COL.wood; c.fillRect(0, 0, D, D);
  sheet(c, 120, 110, 840, 860);
  const mx = 420, my = 520, r = 230;
  crayon(c, () => { c.moveTo(mx + r, my); for (let i = 1; i <= 40; i++) { const an = (i / 40) * Math.PI * 2, rr = r + Math.sin(i * 2.3) * 6; c.lineTo(mx + Math.cos(an) * rr, my + Math.sin(an) * rr); } }, COL.greyDk, 8);
  c.fillStyle = "#fff3b0"; c.beginPath(); ell(c, mx, my, r - 6, r - 6); c.fill();
  for (const [dx, dy, rx, ry, rot] of [[0.35, -0.3, 0.28, 0.22, 0.4], [0.5, 0.25, 0.22, 0.3, -0.3], [-0.25, 0.4, 0.2, 0.14, 0], [-0.45, -0.2, 0.26, 0.34, 0.5], [-0.1, -0.55, 0.15, 0.12, 0]]) {
    c.fillStyle = COL.grey; c.beginPath(); ell(c, mx + dx * r, my + dy * r, rx * r, ry * r, rot); c.fill();
    crayon(c, () => ell(c, mx + dx * r, my + dy * r, rx * r, ry * r, rot), COL.greyDk, 4);
  }
  // the rabbit: a round body, a head, two long ears, drawn in grey crayon
  const bx = 820, by = 640;
  crayon(c, () => ell(c, bx, by, 70, 55), COL.greyDk, 6);
  crayon(c, () => ell(c, bx - 60, by - 60, 38, 34), COL.greyDk, 6);
  crayon(c, () => ell(c, bx - 80, by - 140, 14, 52, 0.15), COL.greyDk, 6);
  crayon(c, () => ell(c, bx - 44, by - 136, 14, 52, -0.15), COL.greyDk, 6);
  c.fillStyle = INK; c.beginPath(); ell(c, bx - 72, by - 66, 4, 4); c.fill();
  crayon(c, () => ell(c, bx + 66, by + 10, 14, 14), COL.greyDk, 5);
};
// a2.0: the child at the balcony at dusk, pointing at a twinkling star and at a steady bright dot low in the orange sky
const a2s0 = (c: Ctx) => {
  duskSky(c, 0, 0, D, 860);
  rooftops(c, 860);
  c.fillStyle = COL.grey; c.fillRect(0, 860, D, D - 860); line(c, [[0, 860], [D, 860]], 6, INK);
  const sx = 250, sy = 200, px = 900, py = 540;
  twinkleStar(c, sx, sy, 34);
  steadyDot(c, px, py, 22, "#fff9e0");
  // the railing beyond the child, then the child
  for (let x = 60; x < D; x += 90) line(c, [[x, 640], [x, 870]], 9, INK);
  line(c, [[0, 640], [D, 640]], 14, INK);
  const x = 520, y = 1000, h = 540, L = armToward(x, y, h, -1, sx, sy), R = armToward(x, y, h, 1, px, py);
  person(c, x, y, h, { armL: L.a, armR: R.a });
  backHead(c, x, y, h);
  finger(c, L.w, sx, sy, h); finger(c, R.w, px, py, h);
};
// a2.1: the child's paper with two columns: a twinkling star heads one, a steady dot the other, a drawn dot in each
const a2s1 = (c: Ctx) => {
  c.fillStyle = COL.wood; c.fillRect(0, 0, D, D);
  sheet(c, 110, 100, 860, 880);
  crayon(c, () => { c.moveTo(540, 140); c.lineTo(540, 940); }, COL.greyDk, 6);
  crayon(c, () => { c.moveTo(150, 330); c.lineTo(930, 330); }, COL.greyDk, 6);
  // headings: a star with flicker marks, a steady round dot
  const starC = (x: number, y: number, r: number) => { crayon(c, () => { c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); }, COL.orange, 7); for (let i = 0; i < 8; i++) { const an = (i / 8) * Math.PI * 2 + 0.3; crayon(c, () => { c.moveTo(x + Math.cos(an) * r * 1.25, y + Math.sin(an) * r * 1.25); c.lineTo(x + Math.cos(an) * r * 1.7, y + Math.sin(an) * r * 1.7); }, COL.orange, 5); } };
  const dotC = (x: number, y: number, r: number) => { c.fillStyle = COL.yellow; c.beginPath(); ell(c, x, y, r, r); c.fill(); crayon(c, () => ell(c, x, y, r, r), COL.orange, 6); };
  starC(340, 235, 50); dotC(740, 235, 40);
  starC(340, 600, 34); dotC(740, 600, 28);
};
// a3.0: the girl on hands and knees pushing a newspaper ball along a straight path to a lit torch on a stool
const a3s0 = (c: Ctx) => {
  room(c, 700);
  stool(c, 860, 720, 170);
  torch(c, 800, 690);
  c.save(); c.setLineDash([16, 16]); line(c, [[300, 980], [820, 940]], 5, COL.greyDk); c.restore();
  crawler(c, 300, 980, 0.95, false);
  paperBall(c, 522, 945, 48);
  arrow(c, [[585, 925], [720, 915]]);
};
// a3.1: the same, eyes shut, the path curling and wandering, the grown-up walking beside her
const a3s1 = (c: Ctx) => {
  room(c, 700);
  stool(c, 860, 720, 170);
  torch(c, 800, 690);
  const ax = 170, ay = 770, ah = 560;
  person(c, ax, ay, ah, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.5] });
  c.save(); c.setLineDash([16, 16]); c.beginPath(); c.moveTo(240, 980); c.bezierCurveTo(360, 1060, 390, 820, 480, 900); c.bezierCurveTo(560, 970, 480, 1040, 580, 1010); c.bezierCurveTo(660, 990, 680, 880, 760, 930); c.strokeStyle = COL.greyDk; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); c.restore();
  crawler(c, 300, 980, 0.95, true);
  paperBall(c, 522, 945, 48);
  arrow(c, [[585, 920], [640, 870], [700, 920]]);
};
// p1.0: the girl at the window, phone at her ear, looking at a half Moon
const p1s0 = (c: Ctx) => {
  room(c, 840);
  window(c, 240, 110, 600, 520, () => { nightSky(c, 240, 110, 600, 520, 9); moon(c, 600, 300, 80, true); });
  const x = 470, y = 960, h = 540, b = body(x, y, h), R = armTo(x, y, h, 1, x + b.head * 0.95, b.hy + b.head * 0.1);
  person(c, x, y, h, { armL: [Math.PI * 0.58, Math.PI * 0.5], armR: R.a });
  backHead(c, x, y, h);
  shape(c, () => rrect(c, R.w[0] - 8, R.w[1] - 52, 30, 86, 8), COL.black, 5);
  shape(c, () => ell(c, R.w[0], R.w[1] + 14, h * 0.04, h * 0.04), SKIN.child, 5);
};
// p1.1: two drawings of a half Moon side by side, each with a clock showing the same time
const p1s1 = (c: Ctx) => {
  c.fillStyle = COL.wood; c.fillRect(0, 0, D, D);
  for (const px of [70, 570]) {
    sheet(c, px, 160, 440, 760);
    const mx = px + 220, my = 420, r = 130;
    c.fillStyle = "#fff3b0"; c.beginPath(); c.moveTo(mx, my - r); c.arc(mx, my, r, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fill();
    crayon(c, () => { c.moveTo(mx, my - r); c.arc(mx, my, r, -Math.PI / 2, Math.PI / 2); c.closePath(); }, COL.greyDk, 8);
    for (const [dx, dy, rx, ry] of [[0.35, -0.3, 0.26, 0.2], [0.5, 0.25, 0.2, 0.28], [0.2, 0.55, 0.16, 0.12]]) { c.fillStyle = COL.grey; c.beginPath(); ell(c, mx + dx * r, my + dy * r, rx * r, ry * r); c.fill(); }
    clock(c, mx, 740, 90);
  }
  line(c, [[520, 740], [560, 740]], 8, RED); line(c, [[520, 760], [560, 760]], 8, RED);
};

// ================================================================ card pictures
// flow.e1: the window strip test: the girl walking past the window with the strips, the Moon beyond
const flowE1 = (c: Ctx) => {
  room(c, 820);
  window(c, 240, 100, 600, 520, () => { nightSky(c, 240, 100, 600, 520, 6); moon(c, 700, 310, 60); }, [360, 470, 580], 240);
  slipper(c, 300, 905); slipper(c, 790, 905);
  const x = 540, y = 900, h = 520, b = body(x, y, h), L = armTo(x, y, h, -1, x - b.head * 0.85, b.hy + b.head * 0.05);
  person(c, x, y, h, { armL: L.a, armR: [Math.PI * 0.45, Math.PI * 0.5] });
  backHead(c, x, y, h);
  shape(c, () => ell(c, L.w[0], L.w[1], h * 0.045, h * 0.045), SKIN.child, 5);
  arrow(c, [[610, 960], [740, 960]]);
};
// flow.e2: the hot tawa close up: warm air rising, the small light behind it shivering
const flowE2 = (c: Ctx) => kitchen(c, 800, true, true, true);
// flow.a2: dusk over the rooftops: a twinkling star high up, a steady bright planet low in the glow
const flowA2 = (c: Ctx) => {
  duskSky(c, 0, 0, D, 900);
  rooftops(c, 900);
  c.fillStyle = NIGHT_DK; c.fillRect(0, 900, D, D - 900);
  twinkleStar(c, 330, 260, 46);
  steadyDot(c, 790, 560, 30, "#fff9e0");
};
// flow.p1: one Moon, two windows: the girl's window with a coconut palm, the cousin's with a bamboo pole, the same half Moon in each
const flowP1 = (c: Ctx) => {
  room(c, 900);
  const win = (x: number, extra: () => void, cloth: string) => {
    window(c, x, 150, 420, 460, () => { nightSky(c, x, 150, 420, 460, x); moon(c, x + 250, 300, 60, true); extra(); });
    const px = x + 210, py = 980, h = 420;
    person(c, px, py, h, { armL: [Math.PI * 0.58, Math.PI * 0.5], armR: [Math.PI * 0.42, Math.PI * 0.5] });
    // the cousin wears a teal kurta: recolour the body only
    if (cloth !== CLOTH.child) { shape(c, () => rrect(c, px - h * 0.13, py - h * 0.76, h * 0.26, h * 0.38, h * 0.06), cloth); shade(c, () => rrect(c, px - h * 0.13, py - h * 0.76, h * 0.26, h * 0.38, h * 0.06), COL.tealDk, h * 0.07, 0); }
    backHead(c, px, py, h);
  };
  win(70, () => { line(c, [[120, 610], [150, 420]], 14, COL.brown); for (const [ex, ey] of [[40, 470], [70, 330], [160, 300], [250, 360], [290, 460]]) { c.beginPath(); c.moveTo(150, 420); c.quadraticCurveTo((150 + ex) / 2, Math.min(ey, 420) - 90, ex, ey); c.strokeStyle = COL.leafDk; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); } }, CLOTH.child);
  win(590, () => { line(c, [[960, 610], [940, 150]], 12, COL.greenDk); for (let i = 0; i < 4; i++) line(c, [[942 - i * 5, 230 + i * 100], [1000, 200 + i * 100]], 7, COL.greenDk); }, COL.teal);
};
// term.3: Twinkle: a star with flicker marks above a rooftop, a steady round dot beside it
const term3 = (c: Ctx) => {
  nightSky(c, 0, 0, D, D, 11);
  rooftops(c, 1000); c.fillStyle = NIGHT_DK; c.fillRect(0, 1000, D, 80);
  twinkleStar(c, 330, 380, 70);
  steadyDot(c, 760, 380, 46, "#fff9e0");
};
// expl.3: starlight through moving air: a twinkling star and a steady planet above, wavy air, the child below looking up
const expl3 = (c: Ctx) => {
  nightSky(c, 0, 0, D, D, 13);
  twinkleStar(c, 300, 180, 50);
  steadyDot(c, 790, 200, 34, "#fff9e0");
  c.save(); c.globalAlpha = 0.5;
  for (let r = 0; r < 4; r++) { const y = 400 + r * 70; c.beginPath(); c.moveTo(40, y); for (let x = 40; x < D; x += 60) c.quadraticCurveTo(x + 30, y + (Math.floor(x / 60) % 2 ? -22 : 22), x + 60, y); c.strokeStyle = COL.sky; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
  c.restore();
  c.save(); c.globalAlpha = 0.45; c.setLineDash([12, 12]); line(c, [[300, 240], [430, 400], [410, 470], [450, 540], [440, 610], [500, 760]], 5, STARLT); line(c, [[790, 240], [700, 400], [700, 470], [660, 540], [660, 610], [600, 760]], 5, STARLT); c.restore();
  c.fillStyle = NIGHT_DK; c.fillRect(0, 980, D, 100); line(c, [[0, 980], [D, 980]], 5, INK);
  const x = 540, y = 980, h = 480;
  person(c, x, y, h, { armL: [Math.PI * 0.58, Math.PI * 0.5], armR: [Math.PI * 0.42, Math.PI * 0.5] });
  // looking up: the eyes drawn a little higher
  const { hy, head } = body(x, y, h);
  shape(c, () => ell(c, x - head * 0.35, hy + head * 0.12, head * 0.14, head * 0.16), SKIN.child, 0); shape(c, () => ell(c, x + head * 0.35, hy + head * 0.12, head * 0.14, head * 0.16), SKIN.child, 0);
  shape(c, () => ell(c, x - head * 0.35, hy - head * 0.02, head * 0.09, head * 0.12), INK, 0); shape(c, () => ell(c, x + head * 0.35, hy - head * 0.02, head * 0.09, head * 0.12), INK, 0);
};

export const ic_skyStargazingL1 = cards("sci.sky.stargazing.L1", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, p1s0, p1s1,
  flowE1, flowE2, flowA2, flowP1, term3, expl3,
]);
