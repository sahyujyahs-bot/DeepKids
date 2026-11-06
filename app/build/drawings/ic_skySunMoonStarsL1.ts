import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, bowl, leaf, hand, person, cards, rnd } from "./flatKit";

// SUN, MOON AND STARS (L1) · set-up cards and card pictures in the flat kit look.
// Same girl (kit child) and grown-up (kit adult) on every card, always facing the viewer; arm angles
// are solved so each hand lands on what it holds or points at.

const PI = Math.PI;
const NIGHT = "#1f2a52", NIGHTDK = "#141b38", DAY = COL.sky, WALL = "#f6ecd8", WALLDK = "#3b3a52", FLOOR = "#d9c7a5", TABLE = "#e3cfa6";
const CARD = "#c9a46b", CARDDK = "#a8834f", SUNPATCH = "#ffe79a", TERRA = "#c76a3f", TERRADK = "#9f4f2b", ICE = "#dff3ff", ICEDK = "#a9d6ef";
type Pt = [number, number];

// ---------------------------------------------------------------- people helpers
const shoulderOf = (x: number, y: number, h: number, side: number, sit = false): Pt => [x + side * h * 0.11, (sit ? y - h * 0.38 : y - h * 0.74) + h * 0.03];
// arm angles for a kit person (feet at x,y, height h) so the hand of arm `side` (-1 left, 1 right) lands on (tx, ty); the elbow bends outward
const reach = (x: number, y: number, h: number, side: -1 | 1, tx: number, ty: number, sit = false): [number, number] => {
  const [sx, sy] = shoulderOf(x, y, h, side, sit), l1 = h * 0.17, l2 = h * 0.16;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
  const max = l1 + l2 - 2;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; }
  const th = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const pick = (a1: number): [number, number, number] => { const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1; return [a1, Math.atan2(sy + dy - ey, sx + dx - ex), ex]; };
  // a hand raised high: the elbow goes outward; otherwise the elbow hangs below the shoulder
  const A = pick(th + al), B = pick(th - al), out = ty < sy - h * 0.2;
  const s = out ? (side * (A[2] - x) >= side * (B[2] - x) ? A : B) : Math.sin(A[0]) >= Math.sin(B[0]) ? A : B;
  return [s[0], s[1]];
};
// the hand circle again, drawn on top of what it holds
const handDot = (c: Ctx, x: number, y: number, h: number, adult = false) => shape(c, () => ell(c, x, y, h * 0.037, h * 0.037), adult ? SKIN.adult : SKIN.child, 5);
const headAt = (x: number, y: number, h: number, sit = false): [number, number, number] => { const head = h * 0.13, sh = sit ? y - h * 0.38 : y - h * 0.74; return [x, sh - head * 1.05, head]; };
const squint = (c: Ctx, x: number, y: number, h: number) => {
  const [hx, hy, head] = headAt(x, y, h);
  for (const s of [-1, 1]) { shape(c, () => ell(c, hx + s * head * 0.35, hy + head * 0.12, head * 0.15, head * 0.17), SKIN.child, 0); line(c, [[hx + s * head * 0.2, hy + head * 0.14], [hx + s * head * 0.5, hy + head * 0.1]], 5); }
};
const wideEyes = (c: Ctx, x: number, y: number, h: number) => {
  const [hx, hy, head] = headAt(x, y, h);
  for (const s of [-1, 1]) { shape(c, () => ell(c, hx + s * head * 0.35, hy + head * 0.1, head * 0.17, head * 0.21), WHITE, 4); shape(c, () => ell(c, hx + s * head * 0.35, hy + head * 0.12, head * 0.09, head * 0.11), INK, 0); }
};

// ---------------------------------------------------------------- sky things
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k / 12) * PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], Math.max(5, r * 0.11), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.22, r * 0.18, 0.5);
};
const cloud = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - s, y + s * 0.35); c.arc(x - s * 0.55, y + s * 0.02, s * 0.42, PI * 0.95, PI * 1.75); c.arc(x + s * 0.05, y - s * 0.2, s * 0.55, PI * 1.2, PI * 1.95); c.arc(x + s * 0.62, y + s * 0.08, s * 0.36, PI * 1.35, PI * 0.45); c.lineTo(x - s, y + s * 0.35); c.closePath(); };
  shape(c, p, WHITE, 5);
};
const star4 = (c: Ctx, x: number, y: number, r: number, col = WHITE, outline = 0) => {
  shape(c, () => { for (let k = 0; k < 8; k++) { const a = (k / 8) * PI * 2 - PI / 2, rr = k % 2 ? r * 0.38 : r; k ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, col, outline);
};
const starDot = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), WHITE, 0);
const moonCrescent = (c: Ctx, x: number, y: number, r: number, sky: string) => {
  shape(c, () => ell(c, x, y, r, r), COL.paper, 5);
  shape(c, () => ell(c, x + r * 0.45, y - r * 0.15, r * 0.82, r * 0.82), sky, 0);
};
// a flying crow: a dark M-shaped silhouette
const crowFly = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s, y - s * 0.55); c.quadraticCurveTo(x - s * 0.5, y - s * 0.15, x, y); c.quadraticCurveTo(x + s * 0.5, y - s * 0.15, x + s, y - s * 0.55); c.quadraticCurveTo(x + s * 0.55, y + s * 0.15, x, y + s * 0.3); c.quadraticCurveTo(x - s * 0.55, y + s * 0.15, x - s, y - s * 0.55); c.closePath(); }, COL.black, 4);
};
// a crow sitting, facing left, feet at (x, y)
const crowSit = (c: Ctx, x: number, y: number, s: number) => {
  for (const k of [-10, 12]) line(c, [[x + k * s, y - 26 * s], [x + k * s, y]], 4 * s, INK);
  shape(c, () => polyP(c, [[x + 30 * s, y - 42 * s], [x + 78 * s, y - 54 * s], [x + 70 * s, y - 30 * s]]), COL.black, 4);
  shape(c, () => ell(c, x, y - 40 * s, 44 * s, 26 * s, -0.15), COL.black, 5);
  shape(c, () => ell(c, x - 40 * s, y - 66 * s, 20 * s, 18 * s), COL.black, 5);
  shape(c, () => polyP(c, [[x - 58 * s, y - 70 * s], [x - 90 * s, y - 60 * s], [x - 58 * s, y - 56 * s]]), COL.greyDk, 4);
  shape(c, () => ell(c, x - 46 * s, y - 70 * s, 4 * s, 4 * s), WHITE, 0);
};
// buildings along a horizon from x0 to x1, bases at y; night ones dark with lit windows
const skyline = (c: Ctx, x0: number, x1: number, y: number, night: boolean, seed = 3, tall = 1) => {
  const r = rnd(seed); let x = x0;
  while (x < x1) {
    const w = 90 + r() * 90, h = (120 + r() * 200) * tall, bx = x, bw = Math.min(w, x1 - x);
    shape(c, () => c.rect(bx, y - h, bw, h), night ? "#2a2f55" : "#d9c3a8", 5);
    for (let yy = y - h + 26; yy < y - 30; yy += 46) for (let xx = bx + 18; xx < bx + bw - 30; xx += 40) if (r() > 0.4) shape(c, () => c.rect(xx, yy, 18, 24), night ? COL.yellow : "#bfe0f5", 2.5);
    x += w + 10;
  }
};
// a window: frame round (x, y, w, h), what is seen through it drawn by inside(), a cross bar, a sill
const windowBox = (c: Ctx, x: number, y: number, w: number, h: number, inside: () => void, sill = true) => {
  shape(c, () => rrect(c, x - 30, y - 30, w + 60, h + 60, 8), COL.paper, 6);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); inside(); c.restore();
  c.beginPath(); c.rect(x, y, w, h); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 22, INK); line(c, [[x + w / 2, y], [x + w / 2, y + h]], 12, COL.paper);
  line(c, [[x, y + h / 2], [x + w, y + h / 2]], 22, INK); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 12, COL.paper);
  if (sill) { shadow(c, x + w / 2 + 10, y + h + 76, w / 2 + 50, 12); shape(c, () => rrect(c, x - 50, y + h + 30, w + 100, 34, 6), COL.paper, 6); }
};
const daySky = (c: Ctx, x: number, y: number, w: number, h: number, withSun = false, crow = true) => {
  c.fillStyle = DAY; c.fillRect(x, y, w, h);
  if (withSun) sun(c, x + w * 0.25, y + h * 0.28, w * 0.1);
  cloud(c, x + w * 0.62, y + h * 0.26, w * 0.13); cloud(c, x + w * 0.3, y + h * 0.58, w * 0.1); cloud(c, x + w * 0.78, y + h * 0.68, w * 0.09);
  if (crow) crowFly(c, x + w * 0.5, y + h * 0.42, w * 0.07);
};
const nightSky = (c: Ctx, x: number, y: number, w: number, h: number, stars: Pt[], moon = true) => {
  c.fillStyle = NIGHT; c.fillRect(x, y, w, h);
  if (moon) moonCrescent(c, x + w * 0.3, y + h * 0.3, w * 0.09, NIGHT);
  stars.forEach(([u, v]) => star4(c, x + u * w, y + v * h, w * 0.03));
};
const STARS3: Pt[] = [[0.62, 0.22], [0.8, 0.5], [0.5, 0.62]];
const STARS8: Pt[] = [...STARS3, [0.15, 0.7], [0.3, 0.35], [0.9, 0.25], [0.7, 0.8], [0.45, 0.18]];

// ---------------------------------------------------------------- objects
// a torch pointing right, back end of the handle at (x, y), size s (1 = 300 px handle); cardboard with the hole
// over its front; dot 0 = off, 1 = faint, 2 = a bright star
const torch = (c: Ctx, x: number, y: number, s: number, dot: 0 | 1 | 2, capped = true) => {
  const L = 300 * s, H = 70 * s, body = () => rrect(c, x, y - H / 2, L, H, 12 * s);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, 0, -H * 0.42);
  for (const k of [0.12, 0.2]) line(c, [[x + L * k, y - H / 2], [x + L * k, y + H / 2]], 4, INK);
  shape(c, () => rrect(c, x + L * 0.42, y - H / 2 - 12 * s, 40 * s, 16 * s, 5 * s), RED, 4);
  shape(c, () => polyP(c, [[x + L, y - H / 2], [x + L + 55 * s, y - H * 0.78], [x + L + 55 * s, y + H * 0.78], [x + L, y + H / 2]]), COL.blueDk);
  if (capped) {
    const fx = x + L + 50 * s;
    shape(c, () => polyP(c, [[fx, y - H * 0.95], [fx + 42 * s, y - H * 1.12], [fx + 42 * s, y + H * 1.12], [fx, y + H * 0.95]]), CARD);
    shade(c, () => polyP(c, [[fx, y - H * 0.95], [fx + 42 * s, y - H * 1.12], [fx + 42 * s, y + H * 1.12], [fx, y + H * 0.95]]), CARDDK, 0, -H * 0.9, 0.4);
    shape(c, () => rrect(c, x + L + 28 * s, y - H * 0.72, 11 * s, H * 1.44, 4 * s), RED, 3);
    shape(c, () => polyP(c, [[fx + 12 * s, y - 24 * s], [fx + 32 * s, y - 30 * s], [fx + 32 * s, y + 30 * s], [fx + 12 * s, y + 24 * s]]), COL.paper, 3);
    shape(c, () => ell(c, fx + 22 * s, y, 3.5 * s, 3.5 * s), INK, 0);
    if (dot === 1) { c.globalAlpha = 0.35; shape(c, () => ell(c, fx + 22 * s, y, 11 * s, 11 * s), COL.yellow, 0); c.globalAlpha = 1; }
    if (dot === 2) { c.globalAlpha = 0.45; shape(c, () => ell(c, fx + 22 * s, y, 60 * s, 60 * s), COL.yellow, 0); c.globalAlpha = 1; star4(c, fx + 22 * s, y, 34 * s, WHITE, 3); }
  } else {
    shape(c, () => ell(c, x + L + 55 * s, y, 10 * s, H * 0.78), COL.yellow, 5);
  }
};
const iceCube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.14), ICE, 5);
  shade(c, () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.14), ICEDK, s * 0.28, s * 0.22, 0.6);
  shine(c, [[x - s * 0.1, y - s * 0.3], [x + s * 0.25, y - s * 0.3]], Math.max(4, s * 0.1));
};
// a steel katori on a surface, rim centre (x, y): melt 0 = a whole cube, 1 = half gone in a puddle, 2 = nearly all water
const katori = (c: Ctx, x: number, y: number, r: number, melt: 0 | 1 | 2) => {
  bowl(c, x, y, r, melt ? COL.water : COL.steelIn);
  if (melt === 0) iceCube(c, x, y - r * 0.12, r * 0.48);
  else if (melt === 1) iceCube(c, x + r * 0.1, y - r * 0.02, r * 0.3);
  else iceCube(c, x + r * 0.15, y + r * 0.02, r * 0.16);
};
const sunPatch = (c: Ctx, pts: number[][]) => { c.globalAlpha = 0.85; shape(c, () => polyP(c, pts), SUNPATCH, 0); c.globalAlpha = 1; };
// a room with a floor from y = fy; the wall above
const room = (c: Ctx, fy: number, wall = WALL, floor = FLOOR) => { ground(c, wall); c.fillStyle = floor; c.fillRect(0, fy, D, D - fy); line(c, [[0, fy], [D, fy]], 5); };
// a tulsi plant in a pot, pot base centre at (x, y); lean < 0 tilts the leaves towards the left
const tulsi = (c: Ctx, x: number, y: number, s: number, lean: number) => {
  shadow(c, x + 14 * s, y + 4 * s, 70 * s, 12 * s);
  shape(c, () => polyP(c, [[x - 62 * s, y - 120 * s], [x + 62 * s, y - 120 * s], [x + 48 * s, y], [x - 48 * s, y]]), TERRA);
  shade(c, () => polyP(c, [[x - 62 * s, y - 120 * s], [x + 62 * s, y - 120 * s], [x + 48 * s, y], [x - 48 * s, y]]), TERRADK, 30 * s, 0, 0.45);
  shape(c, () => rrect(c, x - 70 * s, y - 140 * s, 140 * s, 26 * s, 6 * s), TERRA);
  shape(c, () => ell(c, x, y - 130 * s, 58 * s, 10 * s), COL.soil, 4);
  const top: Pt = [x + lean * 40 * s, y - 330 * s];
  line(c, [[x, y - 132 * s], [x + lean * 20 * s, y - 230 * s], top], 7 * s, COL.leafDk);
  const L: [number, number, number, number][] = [[0.3, 0, -2.5, 1], [0.45, 0, -0.9, 1], [0.6, 0, -2.3, 1], [0.75, 0, -0.7, 0.9], [0.9, 0, -2.1, 0.9], [1, 0, -1.9, 0.8], [1, 0, -1.2, 0.8]];
  L.forEach(([t, , an, k]) => { const px = x + lean * 20 * s * Math.min(1, t * 2) + lean * 20 * s * Math.max(0, t * 2 - 1), py = y - 132 * s - (330 - 132) * s * t; leaf(c, px, py, 70 * s * k, an + lean * 0.35); });
};
// a small book lying open, spine at x, pages w wide and h tall; drawL / drawR fill the pages (clipped)
const openBook = (c: Ctx, x: number, y: number, w: number, h: number, drawL: () => void, drawR: () => void) => {
  shadow(c, x + 16, y + h / 2 + 10, w + 10, 16);
  shape(c, () => rrect(c, x - w, y - h / 2, 2 * w, h, 8), COL.paper, 6);
  c.save(); c.beginPath(); c.rect(x - w + 14, y - h / 2 + 14, w - 20, h - 28); c.clip(); drawL(); c.restore();
  c.save(); c.beginPath(); c.rect(x + 6, y - h / 2 + 14, w - 20, h - 28); c.clip(); drawR(); c.restore();
  line(c, [[x, y - h / 2], [x, y + h / 2]], 6);
};
const crayon = (c: Ctx, x: number, y: number, an: number, len: number, col: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -13, len, 26, 6), col, 5);
  shape(c, () => polyP(c, [[len, -13], [len + 22, 0], [len, 13]]), col, 5);
  c.restore();
};
const lightSwitch = (c: Ctx, x: number, y: number, on: boolean) => {
  shape(c, () => rrect(c, x - 34, y - 48, 68, 96, 8), COL.paper, 5);
  shape(c, () => rrect(c, x - 14, y - 24, 28, 48, 5), on ? RED : COL.grey, 4);
  shape(c, () => rrect(c, x - 14, on ? y - 24 : y, 28, 24, 5), on ? RED : COL.greyDk, 0);
};
const bucket = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 10 * s, y + 4 * s, 70 * s, 12 * s);
  shape(c, () => polyP(c, [[x - 70 * s, y - 150 * s], [x + 70 * s, y - 150 * s], [x + 56 * s, y], [x - 56 * s, y]]), COL.red);
  shade(c, () => polyP(c, [[x - 70 * s, y - 150 * s], [x + 70 * s, y - 150 * s], [x + 56 * s, y], [x - 56 * s, y]]), "#b03a2a", 34 * s, 0, 0.45);
  shape(c, () => ell(c, x, y - 150 * s, 70 * s, 14 * s), "#f28c7a", 5);
  shape(c, () => ell(c, x + 95 * s, y - 20 * s, 26 * s, 20 * s), COL.blue, 5);
};
const bulbOn = (c: Ctx, x: number, y: number) => {
  line(c, [[x, 0], [x, y - 70]], 5);
  c.globalAlpha = 0.5; shape(c, () => ell(c, x, y, 110, 110), COL.yellow, 0); c.globalAlpha = 1;
  shape(c, () => rrect(c, x - 22, y - 90, 44, 40, 6), COL.greyDk, 4);
  shape(c, () => ell(c, x, y, 46, 54), COL.yellow, 5);
};
// the torch scene shared by the three torch-star cards: grown-up at the left holding the torch, the girl at the right
const torchPair = (c: Ctx, dot: 0 | 1 | 2) => {
  const ax = 400, ah = 820, gy = 1000, hx = 600, hy = 580;
  person(c, ax, gy, ah, { adult: true, armR: reach(ax, gy, ah, 1, hx, hy) });
  torch(c, hx - 40, hy, 0.55, dot);
  handDot(c, hx, hy, ah, true);
};
const girlAt = (c: Ctx, x: number, y: number, h: number, pose = {}) => person(c, x, y, h, pose);

// ================================================================ set-up cards
// e1.0: cardboard on the torch, a grown-up's hand poking the tiny hole with a pencil, thin paper and tape ready
const e1s0 = (c: Ctx) => {
  room(c, 330, BG, TABLE);
  shadow(c, 480, 650, 330, 26);
  torch(c, 140, 560, 1.5, 0, true);
  // the paper square and tape, waiting on the table
  shape(c, () => rrect(c, 250, 760, 150, 150, 6), COL.paper, 5);
  c.globalAlpha = 0.6; shape(c, () => polyP(c, [[230, 790], [330, 740], [345, 770], [245, 820]]), COL.yellow, 3); c.globalAlpha = 1;
  // pencil from the right, tip in the middle of the cardboard
  const tip = 700, py = 560;
  shape(c, () => polyP(c, [[tip, py], [tip + 42, py - 16], [tip + 42, py + 16]]), COL.wood, 4);
  shape(c, () => rrect(c, tip + 40, py - 16, 230, 32, 4), COL.yellow, 5);
  line(c, [[tip + 44, py], [tip + 266, py]], 3, COL.woodDk);
  shape(c, () => polyP(c, [[tip, py], [tip + 14, py - 5], [tip + 14, py + 5]]), INK, 0);
  hand(c, 884, 560, PI, 1.2, SKIN.adult, CLOTH.adult);
};
// e1.1: by the bright window in the day; the torch star barely shows
const e1s1 = (c: Ctx) => {
  room(c, 900);
  windowBox(c, 60, 100, 460, 540, () => daySky(c, 60, 100, 460, 540, false, false), false);
  sunPatch(c, [[90, 900], [500, 900], [640, 1050], [0, 1050]]);
  torchPair(c, 1);
  girlAt(c, 940, 1000, 640); squint(c, 940, 1000, 640);
};
// e1.2: the dark bathroom; the same torch star shines bright
const e1s2 = (c: Ctx) => {
  room(c, 900, WALLDK, "#2b2b40");
  bucket(c, 150, 1000, 0.9);
  torchPair(c, 2);
  girlAt(c, 940, 1000, 640); wideEyes(c, 940, 1000, 640);
};
// e1.3: the girl switches the room light on; the star gets hard to see
const e1s3 = (c: Ctx) => {
  room(c, 900, "#8d8ba8", "#6e6c8a");
  bulbOn(c, 540, 170);
  bucket(c, 150, 1000, 0.9);
  lightSwitch(c, 1000, 470, true);
  torchPair(c, 1);
  const gx = 900, gh = 640;
  girlAt(c, gx, 1000, gh, { armR: reach(gx, 1000, gh, 1, 1000, 470) });
};
// e2.0: a girl behind the kitchen counter, a hand on each katori, one ice cube in each
const e2s0 = (c: Ctx) => {
  ground(c, WALL);
  const gx = 540, gh = 760, gy = 1000;
  person(c, gx, gy, gh, { armL: reach(gx, gy, gh, -1, 462, 672), armR: reach(gx, gy, gh, 1, 618, 672) });
  shape(c, () => c.rect(-10, 640, D + 20, 90), "#e6d6bb", 6);
  shape(c, () => c.rect(-10, 728, D + 20, 400), COL.teal, 6);
  line(c, [[0, 900], [D, 900]], 5); shape(c, () => rrect(c, 480, 790, 120, 26, 10), COL.tealDk, 4);
  katori(c, 360, 672, 100, 0); katori(c, 720, 672, 100, 0);
  handDot(c, 462, 672, gh); handDot(c, 618, 672, gh);
};
// e2.1: one katori in the sun patch on the floor, one in the shade
const floorScene = (c: Ctx) => {
  room(c, 520);
  windowBox(c, 90, 80, 340, 360, () => daySky(c, 90, 80, 340, 360, true, false), false);
  c.globalAlpha = 0.18; c.fillStyle = INK; c.fillRect(600, 520, 480, 560); c.globalAlpha = 1;
  sunPatch(c, [[150, 560], [480, 560], [640, 880], [60, 880]]);
  for (const k of [0, 1, 2]) { c.globalAlpha = 0.5; line(c, [[150 + k * 130, 440], [120 + k * 190, 560]], 6, COL.yellow); c.globalAlpha = 1; }
};
const e2s1 = (c: Ctx) => { floorScene(c); katori(c, 330, 720, 110, 0); katori(c, 830, 760, 110, 0); };
// e2.2: looking at both bowls: the sunny one nearly melted, the shady one still a cube
const e2s2 = (c: Ctx) => {
  floorScene(c);
  person(c, 560, 700, 500); person(c, 900, 700, 620, { adult: true });
  katori(c, 300, 850, 110, 2); katori(c, 700, 870, 110, 0);
};
// a1.0: at the window in the day: blue sky, clouds, a crow
const atWindow = (c: Ctx, night: boolean, pointing: boolean) => {
  room(c, 1040, night ? "#6b6a8c" : WALL, night ? "#4c4b66" : FLOOR);
  windowBox(c, 330, 60, 470, 460, () => (night ? nightSky(c, 330, 60, 470, 460, STARS8) : daySky(c, 330, 60, 470, 460)));
  const gx = 160, gh = 600, ax = 930, ah = 780, y = 1040;
  person(c, gx, y, gh, pointing ? { armR: reach(gx, y, gh, 1, 370, 480) } : {});
  person(c, ax, y, ah, { adult: true });
};
const a1s0 = (c: Ctx) => atWindow(c, false, false);
// a1.1: the girl points at the sky and guesses the night sky (a thought bubble)
const a1s1 = (c: Ctx) => {
  atWindow(c, false, true);
  for (const [bx, by, br] of [[215, 430, 16], [195, 370, 24]]) shape(c, () => ell(c, bx, by, br, br), COL.paper, 5);
  shape(c, () => ell(c, 170, 220, 160, 115), COL.paper, 6);
  c.save(); c.beginPath(); ell(c, 170, 220, 150, 105); c.clip(); nightSky(c, 20, 115, 300, 210, STARS3); c.restore();
};
// a2.0 / a2.1: on the balcony at night; the lit room behind, then dark
const balcony = (c: Ctx, lit: boolean) => {
  ground(c, lit ? NIGHT : NIGHTDK);
  const stars = lit ? [[0.62, 0.2], [0.82, 0.45], [0.5, 0.5]] : [[0.62, 0.2], [0.82, 0.45], [0.5, 0.5], [0.4, 0.15], [0.7, 0.65], [0.92, 0.15], [0.56, 0.78], [0.3, 0.4]];
  (stars as Pt[]).forEach(([u, v], i) => star4(c, 330 + u * 750, v * 480, i < 3 ? 22 : 14));
  skyline(c, 340, 1090, 600, true, 5, 1.1);
  c.fillStyle = "#55546e"; c.fillRect(330, 600, 760, 480);
  shape(c, () => c.rect(-10, -10, 340, D + 20), WALLDK, 6);
  shape(c, () => rrect(c, 70, 120, 200, 900, 6), lit ? "#ffe08a" : "#2a2a44", 6);
  if (lit) { c.globalAlpha = 0.35; shape(c, () => polyP(c, [[270, 140], [520, 300], [520, 1020], [270, 1020]]), COL.yellow, 0); c.globalAlpha = 1; }
  const gx = 580, gh = 600, ax = 850, ah = 780, y = 1010;
  // the tally paper, held in the girl's left hand; the right hand points at the stars
  person(c, gx, y, gh, { armL: reach(gx, y, gh, -1, 505, 690), armR: reach(gx, y, gh, 1, 700, 430) });
  person(c, ax, y, ah, { adult: true });
  shape(c, () => rrect(c, 380, 610, 130, 160, 6), COL.paper, 5);
  for (let k = 0; k < (lit ? 3 : 5); k++) line(c, [[405 + k * 22, 650], [405 + k * 22, 720]], 5);
  handDot(c, 505, 690, gh);
  if (!lit) wideEyes(c, gx, y, gh);
  // the railing in front
  for (let x = 20; x < D; x += 75) line(c, [[x, 760], [x, 1010]], 9, INK);
  line(c, [[-10, 760], [D + 10, 760]], 14, INK); line(c, [[-10, 1010], [D + 10, 1010]], 14, INK);
};
const a2s0 = (c: Ctx) => balcony(c, true);
const a2s1 = (c: Ctx) => balcony(c, false);
// a3.0: a tulsi on the sunny sill, leaves turned to the window; a child points at it
const a3s0 = (c: Ctx) => {
  room(c, 1040);
  windowBox(c, 40, 60, 420, 520, () => daySky(c, 40, 60, 420, 520, true, false), false);
  shadow(c, 400, 660, 350, 14);
  shape(c, () => rrect(c, 10, 610, 720, 36, 6), COL.paper, 6);
  for (const k of [0, 1, 2]) { c.globalAlpha = 0.5; line(c, [[300 + k * 40, 180 + k * 120], [560, 330 + k * 60]], 6, COL.yellow); c.globalAlpha = 1; }
  tulsi(c, 590, 610, 1, -1);
  const gx = 880, gh = 640, y = 1040;
  person(c, gx, y, gh, { armL: reach(gx, y, gh, -1, 640, 480) });
};
// a3.1: out of the window: a crow on the ledge in the morning sun, clothes drying next door
const a3s1 = (c: Ctx) => {
  ground(c, WALL);
  windowBox(c, 90, 90, 900, 900, () => {
    c.fillStyle = DAY; c.fillRect(90, 90, 900, 900);
    sun(c, 300, 250, 85);
    cloud(c, 760, 230, 70);
    // the neighbour's balcony with a clothes line
    shape(c, () => c.rect(600, 700, 420, 300), "#d9c3a8", 6);
    for (let x = 630; x < 1000; x += 60) line(c, [[x, 700], [x, 860]], 7, INK);
    line(c, [[600, 860], [1000, 860]], 9, INK);
    line(c, [[640, 540], [640, 700]], 8, INK); line(c, [[980, 540], [980, 700]], 8, INK);
    line(c, [[640, 560], [980, 560]], 4, INK);
    shape(c, () => polyP(c, [[670, 560], [760, 560], [770, 690], [660, 690]]), COL.red, 5);
    shape(c, () => polyP(c, [[800, 560], [850, 560], [880, 620], [860, 625], [860, 700], [790, 700], [790, 625], [770, 620]]), COL.yellow, 5);
    shape(c, () => polyP(c, [[890, 560], [960, 560], [960, 660], [890, 660]]), COL.teal, 5);
    // the ledge with the crow, warm in the sun
    shape(c, () => c.rect(90, 820, 440, 60), COL.grey, 6);
    crowSit(c, 310, 820, 1.4);
  }, false);
};
// p1.0: two folded sheets stapled into a small book, a Sun on the cover
const p1s0 = (c: Ctx) => {
  room(c, 300, BG, TABLE);
  shadow(c, 560, 900, 300, 26);
  shape(c, () => rrect(c, 330, 330, 440, 560, 6), COL.paper, 6);
  for (const k of [0, 1, 2]) line(c, [[345 + k * 4, 345 + k * 6], [345 + k * 4, 875 - k * 6]], 3, COL.grey);
  shape(c, () => rrect(c, 300, 300, 440, 560, 6), COL.paper, 6);
  for (const y of [440, 720]) shape(c, () => rrect(c, 296, y - 16, 10, 32, 3), COL.greyDk, 3);
  sun(c, 520, 560, 90);
  crayon(c, 790, 980, -PI / 2 + 0.3, 200, COL.yellow);
};
// p1.1 / p1.2: the girl at a table by the window, drawing in the book
const drawing = (c: Ctx, night: boolean) => {
  room(c, 1040, night ? "#6b6a8c" : WALL, night ? "#4c4b66" : FLOOR);
  windowBox(c, 580, 70, 430, 400, () => (night ? nightSky(c, 580, 70, 430, 400, STARS3) : daySky(c, 580, 70, 430, 400, false, true)), false);
  const gx = night ? 320 : 280, gh = 660, y = 1040;
  // the girl sits on the floor at a low table, feet on the floor
  const tx = gx + 250, ty = 700;
  person(c, gx, y, gh, { sit: true, armR: reach(gx, y, gh, 1, tx, ty, true) });
  if (night) person(c, 100, 1040, 740, { adult: true });
  // the table and the open book
  shadow(c, gx + 420, 1000, 300, 20);
  shape(c, () => c.rect(gx + 120, 760, 600, 40), COL.wood, 6);
  for (const k of [gx + 150, gx + 690]) line(c, [[k, 800], [k, 1040]], 12, INK);
  const bx = gx + 330;
  openBook(c, bx, 700, 180, 150, () => {
    if (night) { c.fillStyle = COL.paper; c.fillRect(bx - 180, 620, 180, 160); }
    else { c.fillStyle = DAY; c.fillRect(bx - 180, 620, 180, 160); cloud(c, bx - 110, 680, 28); crowFly(c, bx - 60, 730, 18); }
  }, () => {
    if (night) { c.fillStyle = NIGHT; c.fillRect(bx, 620, 180, 160); moonCrescent(c, bx + 70, 680, 28, NIGHT); star4(c, bx + 130, 650, 12); star4(c, bx + 40, 740, 12); star4(c, bx + 140, 720, 12); }
    else { c.fillStyle = COL.paper; c.fillRect(bx, 620, 180, 160); }
  });
  crayon(c, tx, ty, PI * 0.38, 50, night ? COL.black : COL.blue);
  handDot(c, tx, ty, gh);
};
const p1s1 = (c: Ctx) => drawing(c, false);
const p1s2 = (c: Ctx) => drawing(c, true);

// ================================================================ card pictures
// flow.e1: the same torch star by the bright window and in the dark
const flowE1 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = WALLDK; c.fillRect(540, 0, 540, D);
  windowBox(c, 90, 90, 300, 300, () => daySky(c, 90, 90, 300, 300, false, false), false);
  line(c, [[540, 0], [540, D]], 8);
  torch(c, 40, 700, 1.1, 1); torch(c, 580, 700, 1.1, 2);
};
// flow.e2: the ice cube in the sun melts first
const flowE2 = (c: Ctx) => {
  room(c, 420);
  sun(c, 150, 150, 90);
  c.globalAlpha = 0.18; c.fillStyle = INK; c.fillRect(560, 420, 520, 660); c.globalAlpha = 1;
  sunPatch(c, [[120, 440], [460, 440], [600, 900], [20, 900]]);
  for (const k of [0, 1, 2]) { c.globalAlpha = 0.5; line(c, [[230 + k * 40, 290 + k * 10], [120 + k * 170, 440]], 6, COL.yellow); c.globalAlpha = 1; }
  katori(c, 310, 760, 150, 2); katori(c, 810, 760, 150, 0);
};
// flow.a1: the day sky from the window
const flowA1 = (c: Ctx) => { ground(c, WALL); windowBox(c, 110, 110, 860, 800, () => { daySky(c, 110, 110, 860, 800); moonCrescent(c, 300, 300, 50, DAY); }); };
// flow.a3: a tulsi turns its leaves to the sunny window
const flowA3 = (c: Ctx) => {
  room(c, 1040);
  windowBox(c, 60, 60, 520, 560, () => daySky(c, 60, 60, 520, 560, true, false), false);
  shadow(c, 560, 700, 440, 14);
  shape(c, () => rrect(c, 20, 650, 980, 40, 6), COL.paper, 6);
  for (const k of [0, 1, 2]) { c.globalAlpha = 0.5; line(c, [[330 + k * 50, 200 + k * 120], [700, 330 + k * 70]], 7, COL.yellow); c.globalAlpha = 1; }
  tulsi(c, 740, 650, 1.25, -1);
};
// flow.p1: the sky book, a day page and a night page
const flowP1 = (c: Ctx) => {
  room(c, 300, BG, TABLE);
  const bx = 540, by = 600;
  openBook(c, bx, by, 440, 560, () => { c.fillStyle = DAY; c.fillRect(100, 320, 440, 560); sun(c, 200, 440, 60); cloud(c, 360, 520, 70); crowFly(c, 250, 650, 40); crowFly(c, 420, 700, 30); },
    () => { c.fillStyle = NIGHT; c.fillRect(540, 320, 440, 560); moonCrescent(c, 700, 460, 70, NIGHT); [[850, 400], [620, 560], [900, 620], [760, 720], [640, 760]].forEach(([x, y]) => star4(c, x, y, 20)); });
};
// term.3: shade: a neem tree blocks the sunlight; a woman and a girl stand in its shade
const term3 = (c: Ctx) => {
  ground(c, DAY);
  c.fillStyle = COL.greenLt; c.fillRect(0, 800, D, 280); line(c, [[0, 800], [D, 800]], 5);
  sun(c, 950, 110, 65);
  // the shade on the ground, away from the Sun
  shape(c, () => ell(c, 400, 975, 330, 60), COL.greenDk, 0);
  // trunk and canopy
  const trunk = () => polyP(c, [[600, 800], [690, 800], [665, 500], [625, 500]]);
  shape(c, trunk, COL.brown, 6);
  const canopy = () => { ell(c, 620, 320, 280, 210); };
  shape(c, canopy, COL.green, 6); shade(c, canopy, COL.greenDk, 70, 40, 0.5);
  for (const [x, y] of [[440, 260], [560, 180], [700, 200], [820, 290], [520, 400], [760, 410]]) shape(c, () => ell(c, x, y, 70, 48), COL.leaf, 4);
  person(c, 300, 985, 520, { adult: true });
  person(c, 470, 985, 400);
};
// expl.2: the same stars in the day sky (too faint to see) and at night
const SKYSTARS: Pt[] = [[0.25, 0.2], [0.6, 0.12], [0.8, 0.35], [0.4, 0.4], [0.7, 0.6], [0.2, 0.62], [0.5, 0.75]];
const expl2 = (c: Ctx) => {
  ground(c, DAY);
  c.fillStyle = NIGHT; c.fillRect(540, 0, 540, D);
  sun(c, 120, 130, 70);
  c.save(); c.setLineDash([8, 8]); c.globalAlpha = 0.5;
  SKYSTARS.forEach(([u, v]) => star4(c, u * 540, v * 820, 28, DAY, 4));
  c.restore(); c.globalAlpha = 1;
  SKYSTARS.forEach(([u, v]) => star4(c, 540 + u * 540, v * 820, 28));
  skyline(c, 0, 1080, 1080, false, 8, 1.2); c.fillStyle = NIGHT; c.globalAlpha = 0.5; c.fillRect(540, 760, 540, 320); c.globalAlpha = 1;
  line(c, [[540, 0], [540, D]], 8);
};
// expl.3: a city sky shows a few stars, a village sky is full of them
const expl3 = (c: Ctx) => {
  ground(c, "#3a3f6e");
  c.fillStyle = "#555b8e"; c.fillRect(0, 500, 540, 400);
  c.fillStyle = NIGHTDK; c.fillRect(540, 0, 540, D);
  [[120, 120], [330, 200], [440, 90]].forEach(([x, y]) => star4(c, x, y, 22));
  skyline(c, 0, 540, 1080, true, 11, 2.2);
  const r = rnd(21);
  for (let i = 0; i < 70; i++) { const x = 560 + r() * 500, y = 20 + r() * 760; i % 5 ? starDot(c, x, y, 4 + r() * 3) : star4(c, x, y, 16); }
  c.fillStyle = "#2e2a3a"; c.fillRect(540, 900, 540, 180);
  for (const hx of [650, 820, 990]) { shape(c, () => c.rect(hx - 60, 820, 120, 90), COL.soil, 5); shape(c, () => polyP(c, [[hx - 85, 820], [hx, 730], [hx + 85, 820]]), COL.woodDk, 5); shape(c, () => rrect(c, hx - 16, 850, 32, 60, 4), COL.yellow, 3); }
  line(c, [[540, 0], [540, D]], 8);
};

export const ic_skySunMoonStarsL1 = cards("sci.sky.sun-moon-stars.L1", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, p1s0, p1s1, p1s2,
  flowE1, flowE2, flowA1, flowA3, flowP1, term3, expl2, expl3,
]);
