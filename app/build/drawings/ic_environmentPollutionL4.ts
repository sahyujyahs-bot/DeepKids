import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, glass, bowl, plate, seed, hand, person, write, cards } from "./flatKit";

// GONE FROM SIGHT (sci.environment.pollution.L4) · set-up cards for the three experiments, then card
// pictures: thinning red colour step by step, paper strips that collect hidden colour, an oil spill in a
// bowl, a torch through milky water, seeds piling up along a food chain, clay figures in buckets.

const OIL = "#f3b640", OILDK = "#d9951f", TABLE = "#d9b26a", TABLEDK = "#b98f45", FLOOR = "#e2d2b4";
const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`; };
// the red dye thinned out: 0 = tumbler 1 (strong) .. 1 = plain water
const dye = (t: number) => mix(RED, COL.water, t);
const TINT = [COL.water, dye(0.05), dye(0.6), dye(0.86), dye(0.985)];

// a number centred on cx
const num = (c: Ctx, t: string, cx: number, y: number, h: number, col: string = INK) => write(c, t, cx - ((t.length * 0.8 - 0.2) * h) / 2, y, h, col, Math.max(5, h * 0.11));
// points along a curve from a through b (control) to d, for a bent arrow
const bent = (a: number[], b: number[], d: number[], n = 14) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * d[0], u * u * a[1] + 2 * u * t * b[1] + t * t * d[1]]; });
// a floor the people stand on
const floor = (c: Ctx, y: number) => { c.fillStyle = FLOOR; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
// a wooden table: slab from x1 to x2 with its top at y, legs down to the floor
const table = (c: Ctx, x1: number, x2: number, y: number, floorY: number) => {
  for (const lx of [x1 + 30, x2 - 70]) shape(c, () => rrect(c, lx, y + 20, 40, floorY - y - 20, 6), TABLEDK, 5);
  shape(c, () => rrect(c, x1, y, x2 - x1, 36, 8), TABLE, 6);
};
// a teaspoon: handle end at (hx, hy), the handle meets the bowl at (bx, by); bw = bowl half-length
const spoon = (c: Ctx, hx: number, hy: number, bx: number, by: number, bw: number, liquid?: string) => {
  const an = Math.atan2(by - hy, bx - hx), cx = bx + Math.cos(an) * bw * 0.85, cy = by + Math.sin(an) * bw * 0.85;
  line(c, [[hx, hy], [bx, by]], bw * 0.55 + 10, INK); line(c, [[hx, hy], [bx, by]], bw * 0.55, COL.steel);
  shape(c, () => ell(c, cx, cy, bw, bw * 0.62, an), COL.steel, 5);
  shape(c, () => ell(c, cx, cy, bw * 0.7, bw * 0.38, an), liquid ?? COL.steelIn, 3);
};
// a clear jug of water, bottom centre (x, y), handle on the right, spout on the left
const jug = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.7, w * 0.14);
  shape(c, () => { c.moveTo(x + w * 0.44, y - h * 0.82); c.bezierCurveTo(x + w * 0.98, y - h * 0.84, x + w * 0.98, y - h * 0.3, x + w * 0.42, y - h * 0.28); c.lineTo(x + w * 0.42, y - h * 0.4); c.bezierCurveTo(x + w * 0.78, y - h * 0.42, x + w * 0.78, y - h * 0.72, x + w * 0.44, y - h * 0.7); c.closePath(); }, COL.steel);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  const ly = y - h * 0.68, lw = w * 0.4 + (w * 0.1) * 0.68;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); }, COL.water, 0);
  shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 0);
  shape(c, body, COL.glass, 5);
  shape(c, () => polyP(c, [[x - w / 2, y - h], [x - w * 0.68, y - h + h * 0.08], [x - w * 0.42, y - h + h * 0.1]]), COL.glass, 5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.26, y - h * 0.25]], 7);
};
// a pencil lying flat from x1 to x2 at height y, point to the right
const pencil = (c: Ctx, x1: number, x2: number, y: number, r = 14) => {
  shape(c, () => rrect(c, x1, y - r, x2 - x1 - r * 2.2, r * 2, 4), COL.yellow, 5);
  shape(c, () => polyP(c, [[x2 - r * 2.2, y - r], [x2, y], [x2 - r * 2.2, y + r]]), COL.wood, 5);
  shape(c, () => polyP(c, [[x2 - r * 0.8, y - r * 0.36], [x2, y], [x2 - r * 0.8, y + r * 0.36]]), INK, 0);
  shape(c, () => rrect(c, x1, y - r, r * 1.6, r * 2, 4), COL.pink, 5);
  line(c, [[x1 + r * 2, y - r * 0.35], [x2 - r * 2.6, y - r * 0.35]], 3, COL.woodDk);
};
// a strip of paper hanging from the pencil at (x, top), its bottom part wet
const strip = (c: Ctx, x: number, top: number, bottom: number, w: number, wetFrom?: number, wetCol = "#ddd4cf") => {
  shape(c, () => rrect(c, x - w / 2, top, w, bottom - top, 4), COL.paper, 5);
  if (wetFrom !== undefined) { shape(c, () => { c.moveTo(x - w / 2, wetFrom); c.lineTo(x + w / 2, wetFrom); c.lineTo(x + w / 2, bottom); c.lineTo(x - w / 2, bottom); c.closePath(); }, wetCol, 0); line(c, [[x - w / 2, wetFrom], [x + w / 2, wetFrom]], 3, COL.greyDk); }
};
// sticky tape: a small pale square
const tape = (c: Ctx, x: number, y: number, s: number) => { c.globalAlpha = 0.75; shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, 3), "#fff1b0", 3); c.globalAlpha = 1; };
// a bowl of water with a patch of oil floating on it, rim centre (x, y)
const oilBowl = (c: Ctx, x: number, y: number, r: number, oil = 0.55) => {
  bowl(c, x, y, r, COL.water);
  if (oil > 0) { shape(c, () => ell(c, x - r * 0.08, y, r * oil, r * oil * 0.2, 0.1), OIL, 3); shine(c, [[x - r * oil * 0.5, y - r * 0.04], [x - r * oil * 0.1, y - r * 0.06]], 5); }
};
// the eyes shut: skin over the eyes, then two lid lines (same geometry as person())
const eyesShut = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.15, hy = y - h * 0.4 - h * 0.27 - head * 1.12;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.16, head * 0.19, head * 0.24), SKIN.child, 0); c.beginPath(); c.arc(x + s * head * 0.38, hy + head * 0.08, head * 0.15, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
// a smell: three wavy lines drifting from (x, y) toward (tx, ty)
const smell = (c: Ctx, x: number, y: number, tx: number, ty: number) => {
  const dx = tx - x, dy = ty - y, nx = -dy, ny = dx, L = Math.hypot(dx, dy);
  for (const k of [-1, 0, 1]) { const pts: number[][] = []; for (let i = 0; i <= 10; i++) { const t = i / 10, s = Math.sin(t * Math.PI * 3) * 7; pts.push([x + dx * t + (nx / L) * (k * 16 + s), y + dy * t + (ny / L) * (k * 16 + s)]); } c.globalAlpha = 0.7; line(c, pts, 4, COL.greyDk); c.globalAlpha = 1; }
};
// a six-sided die at (x, y)
const die = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s / 2, y - s / 2, s, s, s * 0.18), WHITE, 5);
  for (const [u, v] of [[-0.25, -0.25], [0.25, 0.25], [0.25, -0.25], [-0.25, 0.25], [0, 0]]) shape(c, () => ell(c, x + u * s, y + v * s, s * 0.08, s * 0.08), INK, 0);
};
// a small squeeze bottle of dishwash liquid, centre (x, y), tilted by an (0 = upright), nozzle at the top end
const squeezeBottle = (c: Ctx, x: number, y: number, an: number, h = 150) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -h * 0.2, -h * 0.3, h * 0.4, h * 0.8, h * 0.08), COL.green, 5);
  shape(c, () => rrect(c, -h * 0.13, -h * 0.46, h * 0.26, h * 0.18, h * 0.04), COL.greenDk, 5);
  shape(c, () => rrect(c, -h * 0.04, -h * 0.56, h * 0.08, h * 0.12, h * 0.02), INK, 0);
  shine(c, [[-h * 0.12, -h * 0.22], [-h * 0.12, h * 0.3]], 6);
  c.restore();
};
// a drop of liquid falling, tip up, centred on (x, y)
const drop = (c: Ctx, x: number, y: number, r: number, col: string) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r * 1.1, y - r * 0.2, x + r, y + r * 0.3); c.arc(x, y + r * 0.3, r, 0, Math.PI); c.quadraticCurveTo(x - r * 1.1, y - r * 0.2, x, y - r * 1.6); c.closePath(); }, col, 4);
// a fish swimming toward dir (1 right, -1 left), centre (x, y), length L
const fish = (c: Ctx, x: number, y: number, L: number, dir: number, col: string = COL.orange, dk: string = "#c9742a") => {
  shape(c, () => polyP(c, [[x - dir * L * 0.4, y], [x - dir * L * 0.62, y - L * 0.22], [x - dir * L * 0.62, y + L * 0.22]]), dk, 5);
  shape(c, () => ell(c, x, y, L * 0.45, L * 0.24), col, 5);
  shape(c, () => polyP(c, [[x - dir * L * 0.1, y - L * 0.2], [x + dir * L * 0.05, y - L * 0.36], [x + dir * L * 0.15, y - L * 0.2]]), dk, 4);
  c.beginPath(); c.arc(x + dir * L * 0.18, y, L * 0.14, dir > 0 ? -1.1 : Math.PI + 1.1, dir > 0 ? 1.1 : Math.PI - 1.1); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  shape(c, () => ell(c, x + dir * L * 0.3, y - L * 0.06, L * 0.055, L * 0.055), WHITE, 3); shape(c, () => ell(c, x + dir * L * 0.31, y - L * 0.06, L * 0.028, L * 0.028), INK, 0);
};
// a clay figure (a small seated idol) with its base at (x, y), height h, painted in col
const idol = (c: Ctx, x: number, y: number, h: number, col: string, dk: string, trim?: string) => {
  shape(c, () => rrect(c, x - h * 0.34, y - h * 0.12, h * 0.68, h * 0.12, 6), col, 5);
  shape(c, () => { c.moveTo(x - h * 0.3, y - h * 0.12); c.quadraticCurveTo(x - h * 0.34, y - h * 0.6, x, y - h * 0.6); c.quadraticCurveTo(x + h * 0.34, y - h * 0.6, x + h * 0.3, y - h * 0.12); c.closePath(); }, col, 5);
  shape(c, () => ell(c, x, y - h * 0.74, h * 0.2, h * 0.2), col, 5);
  shape(c, () => polyP(c, [[x - h * 0.18, y - h * 0.86], [x, y - h * 1.02], [x + h * 0.18, y - h * 0.86]]), trim ?? dk, 4);
  shape(c, () => ell(c, x - h * 0.07, y - h * 0.76, h * 0.03, h * 0.03), INK, 0); shape(c, () => ell(c, x + h * 0.07, y - h * 0.76, h * 0.03, h * 0.03), INK, 0);
  if (trim) shape(c, () => ell(c, x, y - h * 0.36, h * 0.09, h * 0.09), trim, 3);
};
// a bucket, bottom centre (x, y), with water of colour wat seen in the top opening
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, wat: string) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  shape(c, () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); }, COL.blue);
  c.save(); c.beginPath(); c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); c.clip(); c.fillStyle = COL.blueDk; c.globalAlpha = 0.5; c.fillRect(x + w * 0.1, y - h, w, h); c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.14), COL.blueDk, 5);
  shape(c, () => ell(c, x, y - h + 4, w * 0.44, w * 0.11), wat, 3);
  c.beginPath(); c.moveTo(x - w * 0.46, y - h); c.quadraticCurveTo(x, y - h - w * 0.55, x + w * 0.46, y - h); c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
};

// ---------------------------------------------------------------- set-up: Gone from Sight (e1)
// 1. five tumblers 0 to 4, 200 ml of clean water in each, a jug beside them
const e1s0 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) { const x = 100 + i * 160; glass(c, x, 760, 140, 300, 0.6, COL.water); num(c, String(i), x, 360, 70); }
  jug(c, 940, 760, 170, 360);
};
// 2. five drops of colour and a teaspoon of essence into tumbler 1, tumbler 0 left plain
const e1s1 = (c: Ctx) => {
  ground(c);
  glass(c, 300, 820, 220, 360, 0.6, COL.water); glass(c, 700, 820, 220, 360, 0.6, TINT[1]);
  num(c, "0", 300, 860, 70); num(c, "1", 700, 860, 70);
  // the dropper bottle, held from the upper left, its nozzle over the mouth of tumbler 1
  const an = 0.6, bx = 470 + Math.cos(an) * 84, by = 230 + Math.sin(an) * 84;
  c.save(); c.translate(bx, by); c.rotate(an);
  shape(c, () => rrect(c, -70, -32, 140, 64, 18), COL.red, 5); shape(c, () => rrect(c, 60, -22, 36, 44, 8), INK, 0); shape(c, () => rrect(c, 90, -9, 26, 18, 6), INK, 0);
  c.restore();
  hand(c, 470, 230, an, 1.2);
  const nx = bx + Math.cos(an) * 116, ny = by + Math.sin(an) * 116;
  for (let i = 0; i < 5; i++) drop(c, nx, ny + 36 + i * 46, 11, RED);
  // the teaspoon of essence, held from the right, tipped so it pours into tumbler 1
  const sa = Math.PI - 0.45, wx = 960, wy = 290;
  spoon(c, wx + Math.cos(sa) * 20, wy + Math.sin(sa) * 20, wx + Math.cos(sa) * 175, wy + Math.sin(sa) * 175, 40, "#f3e3a0");
  hand(c, wx, wy, sa, 1.2);
  const lipX = wx + Math.cos(sa) * 240, lipY = wy + Math.sin(sa) * 240;
  c.globalAlpha = 0.85; line(c, bent([lipX, lipY], [lipX - 8, lipY + 100], [lipX - 14, 604]), 9, "#f3e3a0"); c.globalAlpha = 1;
};
// 3. one level spoonful from 1 to 2, then 2 to 3, then 3 to 4
const e1s2 = (c: Ctx) => {
  ground(c);
  const X = [180, 420, 660, 900], T = [TINT[1], TINT[2], COL.water, COL.water];
  X.forEach((x, i) => { glass(c, x, 800, 150, 250, 0.6, T[i]); num(c, String(i + 1), x, 840, 60); });
  arrow(c, bent([205, 535], [300, 440], [395, 535]));
  arrow(c, bent([445, 535], [540, 440], [635, 535]));
  arrow(c, bent([685, 535], [780, 440], [875, 535]));
  // the level spoon, carrying red water from 1 toward 2
  spoon(c, 560, 380, 366, 380, 42, TINT[1]);
  hand(c, 640, 382, Math.PI, 1.1);
};
// 4. the five tumblers on white paper, beside tumbler 0
const e1s3 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[30, 470], [1050, 470], [1075, 860], [5, 860]]), WHITE, 5);
  for (let i = 0; i < 5; i++) { const x = 120 + i * 210; glass(c, x, 740, 150, 250, 0.6, TINT[i]); num(c, String(i), x, 770, 60); }
};
// 5. eyes shut, the child sniffs a cup; the grown-up shuffles the cups behind a standing book and holds the die
const e1s4 = (c: Ctx) => {
  ground(c); floor(c, 1020);
  person(c, 860, 1020, 700, { adult: true, reachL: [640, 585], reachR: [990, 400] });
  die(c, 990, 400, 54);
  table(c, 340, 1010, 700, 1020);
  shape(c, () => rrect(c, 420, 500, 120, 200, 6), COL.purple, 5); shape(c, () => rrect(c, 420, 500, 22, 200, 4), "#6a4d9c", 4); shape(c, () => rrect(c, 528, 506, 8, 188, 2), COL.paper, 0);
  glass(c, 640, 700, 80, 110, 0.6, COL.water); glass(c, 740, 700, 80, 110, 0.6, COL.water);
  const kid = person(c, 170, 1020, 520, { reachR: [285, 650] });
  const [hx, hy] = kid.handR;
  glass(c, hx, hy + 55, 80, 110, 0.6, COL.water);
  smell(c, hx - 10, hy - 60, 195, 600);
  eyesShut(c, 170, 1020, 520);
};

// ---------------------------------------------------------------- set-up: the Overnight Collector (e2)
// 1. three tumblers (plain, the last tint, the first with none), a strip taped to a pencil across each rim, dipping 2 cm
const e2s0 = (c: Ctx) => {
  ground(c);
  const X = [200, 540, 880], T = [COL.water, TINT[3], TINT[4]], L = ["0", "3", "4"];
  X.forEach((x, i) => {
    glass(c, x, 820, 200, 330, 0.6, T[i]);
    strip(c, x, 478, 662, 50, 622, mix("#ddd4cf", T[i], 0.4));
    pencil(c, x - 160, x + 165, 490);
    tape(c, x, 492, 44);
    num(c, L[i], x, 850, 60);
  });
};
// 2. close up: water climbing a strip, the wet part darker, a ruler beside it
const e2s1 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 960, 600, 640, 0.5, TINT[3]);
  strip(c, 540, 300, 700, 120, 530, mix("#ddd4cf", TINT[3], 0.4));
  pencil(c, 290, 800, 320, 18);
  tape(c, 540, 324, 60);
  arrow(c, [[650, 690], [650, 560]]);
  // the ruler: 0 at the water line, counting up
  shape(c, () => rrect(c, 880, 380, 70, 340, 6), COL.wood, 5);
  for (let cm = 0; cm <= 6; cm++) { const y = 640 - cm * 40; line(c, [[880, y], [912, y]], 4); for (let m = 1; m < 5 && cm < 6; m++) line(c, [[880, y - m * 8], [896, y - m * 8]], 2); num(c, String(cm), 932, y - 12, 24); }
  c.setLineDash([12, 12]); line(c, [[240, 640], [880, 640]], 3, COL.greyDk); c.setLineDash([]);
};
// 3. next morning: the strips side by side on a plate, one with a colour band near its top
const e2s2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 640, 450, 230);
  const X = [380, 540, 700], L = ["0", "3", "4"];
  X.forEach((x, i) => {
    shape(c, () => rrect(c, x - 35, 450, 70, 380, 6), COL.paper, 5);
    shape(c, () => { c.moveTo(x - 35, 700); c.lineTo(x + 35, 700); c.lineTo(x + 35, 830); c.lineTo(x - 35, 830); c.closePath(); }, "#e6e0d8", 0); line(c, [[x - 35, 700], [x + 35, 700]], 3, COL.greyDk);
    if (i === 1) shape(c, () => { c.moveTo(x - 35, 470); c.lineTo(x + 35, 470); c.lineTo(x + 35, 505); c.lineTo(x - 35, 505); c.closePath(); }, TINT[2], 0);
    num(c, L[i], x, 350, 60);
  });
};

// ---------------------------------------------------------------- set-up: Oil Spill Race (e3)
// 1. six bowls on a tray, water and a patch of oil in each
const e3s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 890, 470, 40);
  shape(c, () => rrect(c, 80, 250, 920, 630, 40), COL.wood, 6); shape(c, () => rrect(c, 110, 280, 860, 570, 30), COL.woodDk, 0);
  for (const y of [440, 730]) for (const x of [270, 540, 810]) oilBowl(c, x, y, 120);
  shape(c, () => rrect(c, 900, 800, 90, 56, 6), WHITE, 5);
};
// 2. five tools on five bowls for two minutes: spoon, paper towel, cotton wool, a tuft of hair, a drop of dishwash; the sixth left alone
const e3s1 = (c: Ctx) => {
  ground(c); floor(c, 1020);
  const kid = person(c, 110, 1020, 560, { reachR: [255, 735] });
  const ad = person(c, 950, 1020, 660, { adult: true, reachL: [870, 620] });
  table(c, 210, 930, 800, 1020);
  const X = [290, 430, 570, 710, 850];
  X.forEach((x) => oilBowl(c, x, 790, 68, 0.6));
  // the spoon from the child's hand, skimming bowl 1
  spoon(c, kid.handR[0], kid.handR[1], 292, 782, 22);
  // paper towel folded over bowl 2
  shape(c, () => polyP(c, [[385, 770], [480, 760], [492, 795], [470, 812], [392, 808]]), COL.paper, 5); line(c, [[400, 785], [470, 780]], 3, COL.greyDk);
  // cotton wool on bowl 3
  for (const [u, v, r] of [[550, 785, 24], [585, 778, 22], [568, 798, 20]]) shape(c, () => ell(c, u, v, r, r * 0.8), WHITE, 4);
  // a tuft of hair on bowl 4
  const rr = rnd(5); for (let i = 0; i < 9; i++) line(c, bent([680 + i * 7, 792], [700 + rr() * 30, 760 + rr() * 20], [730 + rr() * 20, 780 + rr() * 16]), 3, INK);
  // the dishwash bottle in the grown-up's hand, a drop falling into bowl 5
  squeezeBottle(c, ad.handL[0], ad.handL[1], Math.PI + 0.25, 170);
  drop(c, ad.handL[0] - Math.sin(0.25) * 95 + 0, ad.handL[1] + Math.cos(0.25) * 95 + 30, 10, COL.greenLt);
};
// 3. look across the bowl at a low angle toward the window, for the shine
const e3s2 = (c: Ctx) => {
  ground(c); floor(c, 1000);
  // the window
  shape(c, () => rrect(c, 790, 270, 250, 330, 10), "#fff2b8", 7); line(c, [[915, 270], [915, 600]], 7); line(c, [[790, 435], [1040, 435]], 7);
  person(c, 220, 1000, 455);
  table(c, 380, 1000, 640, 1000);
  oilBowl(c, 600, 632, 120, 0.6);
  shine(c, [[560, 626], [600, 624]], 7);
  // the line of sight: from the eye, grazing the rim, to the window
  c.setLineDash([14, 14]); line(c, [[262, 628], [1000, 596]], 4, COL.greyDk); c.setLineDash([]);
};
// 4. a straw shut with the thumb, dipped below the oil; six drops drying on brown paper, one see-through
const e3s3 = (c: Ctx) => {
  ground(c);
  // a glass bowl cut away: water below, oil on top
  shadow(c, 320, 830, 180, 24);
  shape(c, () => { c.moveTo(100, 600); c.bezierCurveTo(110, 900, 490, 900, 500, 600); c.closePath(); }, COL.water, 0);
  shape(c, () => { c.moveTo(100, 600); c.bezierCurveTo(102, 640, 498, 640, 500, 600); c.closePath(); }, OIL, 0);
  c.save(); c.beginPath(); c.moveTo(100, 600); c.bezierCurveTo(110, 900, 490, 900, 500, 600); c.closePath(); c.clip();
  c.fillStyle = OILDK; c.fillRect(100, 596, 400, 10); c.restore();
  shape(c, () => { c.moveTo(100, 600); c.bezierCurveTo(110, 900, 490, 900, 500, 600); c.closePath(); }, COL.glass, 6);
  shape(c, () => ell(c, 300, 600, 200, 30), "rgba(255,255,255,0.3)", 5);
  // the straw, through the oil into the water, shut by the thumb at its top
  shape(c, () => rrect(c, 286, 300, 28, 460, 8), COL.pink, 5); line(c, [[300, 310], [300, 750]], 4, "#d77a95");
  hand(c, 240, 350, 0, 1.15);
  arrow(c, [[520, 560], [600, 560]]);
  // brown paper, six dried drops, the fifth a see-through oil spot
  shape(c, () => rrect(c, 630, 420, 420, 360, 8), "#c9a06a", 5);
  for (let i = 0; i < 6; i++) {
    const x = 700 + (i % 3) * 140, y = 520 + Math.floor(i / 3) * 160;
    if (i === 4) { shape(c, () => ell(c, x, y, 46, 40), "#a67a44", 4); shine(c, [[x - 20, y - 14], [x - 6, y - 20]], 6); } else { c.globalAlpha = 0.5; shape(c, () => ell(c, x, y, 44, 38), "#c9a06a", 4); c.globalAlpha = 1; }
  }
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the row from bright red to plain-looking water, and a nose that still finds the smell
const flowE1 = (c: Ctx) => {
  ground(c); floor(c, 1020);
  table(c, 330, 1060, 720, 1020);
  for (let i = 0; i < 4; i++) { const x = 440 + i * 170; glass(c, x, 720, 120, 200, 0.6, TINT[i]); num(c, String(i), x, 760, 50); }
  const kid = person(c, 170, 1020, 520, { reachR: [285, 650] });
  const [hx, hy] = kid.handR;
  glass(c, hx, hy + 55, 90, 120, 0.6, TINT[4]);
  smell(c, hx - 10, hy - 70, 195, 600);
  eyesShut(c, 170, 1020, 520);
};
// flow.e2: a strip in faintly tinted water, the colour gathered in a band near its top
const flowE2 = (c: Ctx) => {
  ground(c);
  glass(c, 540, 900, 460, 560, 0.55, TINT[3]);
  strip(c, 540, 300, 640, 110, 592, mix("#ddd4cf", TINT[3], 0.4));
  shape(c, () => { c.moveTo(485, 330); c.lineTo(595, 330); c.lineTo(595, 372); c.lineTo(485, 372); c.closePath(); }, TINT[2], 0);
  pencil(c, 260, 820, 340, 18);
  tape(c, 540, 344, 56);
  arrow(c, [[650, 640], [650, 420]]);
};
// flow.e3: a bowl with floating oil and the five tools on the counter around it
const flowE3 = (c: Ctx) => {
  ground(c);
  oilBowl(c, 540, 560, 230, 0.6);
  spoon(c, 120, 300, 300, 240, 40);
  shape(c, () => polyP(c, [[680, 170], [900, 150], [910, 300], [690, 320]]), COL.paper, 5); line(c, [[700, 200], [890, 185]], 3, COL.greyDk); line(c, [[700, 240], [895, 225]], 3, COL.greyDk);
  for (const [u, v, r] of [[150, 860, 46], [215, 845, 42], [185, 895, 40]]) shape(c, () => ell(c, u, v, r, r * 0.8), WHITE, 5);
  const rr = rnd(9); for (let i = 0; i < 12; i++) line(c, bent([470 + i * 12, 920], [520 + rr() * 60, 850 + rr() * 30], [580 + rr() * 60, 900 + rr() * 30]), 4, INK);
  shadow(c, 900, 890, 70, 14); squeezeBottle(c, 890, 790, 0, 190);
};
// flow.a1: in a dark room a torch beam goes through milky water and lights a streak in it
const flowA1 = (c: Ctx) => {
  ground(c, "#4a4f7a"); c.fillStyle = "#3a3e62"; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5);
  table(c, 600, 960, 820, 1000);
  const kid = person(c, 200, 1000, 560, { reachR: [360, 650] });
  const [hx, hy] = kid.handR;
  // the beam first, then the glass over it, then the glow inside the water
  shape(c, () => polyP(c, [[hx + 100, hy - 26], [660, hy - 50], [660, hy + 50], [hx + 100, hy + 26]]), "rgba(255,232,130,0.55)", 0);
  glass(c, 760, 820, 230, 350, 0.62, "#dfe9f2");
  shape(c, () => rrect(c, 660, hy - 40, 200, 80, 30), "rgba(255,240,160,0.9)", 0);
  shape(c, () => rrect(c, 670, hy - 16, 180, 32, 14), WHITE, 0);
  // the torch in the hand, pointing at the tumbler
  shape(c, () => rrect(c, hx - 60, hy - 22, 130, 44, 12), COL.steel, 5);
  shape(c, () => rrect(c, hx + 60, hy - 32, 42, 64, 10), COL.steelDk, 5);
  shape(c, () => rrect(c, hx + 94, hy - 26, 10, 52, 3), COL.yellow, 4);
  shape(c, () => ell(c, hx, hy, 28, 24), SKIN.child, 5); shape(c, () => ell(c, hx - 8, hy - 24, 14, 9, -0.5), SKIN.child, 4);
};
// flow.a2: one seed in each plankton square, five in a small fish, fifteen in a big fish, thirty on the person's plate
const flowA2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 380, 300, 250, 4), WHITE, 5);
  for (let i = 1; i < 6; i++) line(c, [[40 + i * 50, 380], [40 + i * 50, 630]], 3, COL.greyDk);
  for (let j = 1; j < 5; j++) line(c, [[40, 380 + j * 50], [340, 380 + j * 50]], 3, COL.greyDk);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) seed(c, 65 + i * 50, 405 + j * 50, 9, 0.6, false, COL.black, "#1e1b22");
  arrow(c, [[355, 505], [405, 505]], RED, 8);
  bowl(c, 480, 540, 65); const r1 = rnd(3); for (let i = 0; i < 5; i++) seed(c, 455 + i * 13 + r1() * 6, 540 + r1() * 6, 9, r1() * 3, false, COL.black, "#1e1b22");
  arrow(c, [[560, 505], [610, 505]], RED, 8);
  bowl(c, 710, 540, 95); const r2 = rnd(4); for (let i = 0; i < 15; i++) seed(c, 650 + (i % 5) * 30 + r2() * 8, 530 + Math.floor(i / 5) * 10 + r2() * 6, 9, r2() * 3, false, COL.black, "#1e1b22");
  arrow(c, [[820, 505], [870, 505]], RED, 8);
  plate(c, 960, 560, 110, 55); const r3 = rnd(6); for (let i = 0; i < 30; i++) seed(c, 900 + (i % 6) * 24 + r3() * 8, 538 + Math.floor(i / 6) * 11 + r3() * 5, 9, r3() * 3, false, COL.black, "#1e1b22");
  num(c, "1", 190, 680, 60); num(c, "5", 480, 680, 60); num(c, "15", 710, 680, 60); num(c, "30", 960, 680, 60);
};
// flow.p1: three clay figures each in a bucket of water: plain clay, turmeric and kumkum, poster paint
const flowP1 = (c: Ctx) => {
  ground(c);
  const X = [200, 540, 880], W = ["#b59a7a", "#e2c25a", "#e86a8a"], F: [string, string, string | undefined][] = [["#b07a52", "#8a5a38", undefined], ["#e8b84a", "#c48a2a", "#d7372b"], ["#e4523b", "#b43a2a", "#ffd34d"]];
  X.forEach((x, i) => {
    idol(c, x, 548, 150, F[i][0], F[i][1], F[i][2]);
    bucket(c, x, 820, 260, 300, W[i]);
  });
};
// term.13 turbidity: clear, slightly cloudy, thick muddy
const turbidity = (c: Ctx) => {
  ground(c);
  const X = [200, 540, 880], T = [COL.water, mix(COL.water, "#b7a98f", 0.5), "#9c7a52"];
  X.forEach((x, i) => { glass(c, x, 800, 240, 400, 0.65, T[i]); if (i === 2) { const r = rnd(11); for (let k = 0; k < 20; k++) shape(c, () => ell(c, x - 70 + r() * 140, 580 + r() * 200, 5 + r() * 5, 4 + r() * 4), COL.soilDk, 0); } });
};
// term.14 oil slick: a rainbow film on a puddle in a car park
const oilSlick = (c: Ctx) => {
  ground(c, "#9a958c");
  c.fillStyle = "#8b867d"; c.fillRect(0, 0, D, 160); line(c, [[0, 160], [D, 160]], 4, "#75716a");
  for (const x of [120, 960]) shape(c, () => rrect(c, x - 14, 200, 28, 880, 6), WHITE, 0);
  shadow(c, 560, 640, 400, 190);
  const pool = () => { c.moveTo(150, 600); c.bezierCurveTo(200, 380, 520, 360, 700, 420); c.bezierCurveTo(960, 500, 960, 760, 760, 820); c.bezierCurveTo(560, 880, 180, 820, 150, 600); c.closePath(); };
  shape(c, pool, "#6f7f9a", 6);
  c.save(); c.beginPath(); pool(); c.clip();
  const bands = ["#8b6cc9", "#5b8fd6", "#3fb1a8", "#9ccf62", "#ffd34d", "#f39a3c", "#e4523b"];
  bands.forEach((col, i) => { c.globalAlpha = 0.55; c.beginPath(); ell(c, 500 + i * 18, 600 + i * 10, 420 - i * 48, 230 - i * 26, -0.25); c.fillStyle = col; c.fill(); });
  c.globalAlpha = 1; c.restore();
  shine(c, [[300, 500], [420, 470]], 10);
};
// term.8 dissolved oxygen: a fish with open gills, tiny bubbles in the water around it
const dissolvedOxygen = (c: Ctx) => {
  ground(c, COL.water);
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.4; c.fillRect(0, 760, D, 320); c.globalAlpha = 1;
  fish(c, 540, 540, 520, 1);
  const r = rnd(21); for (let i = 0; i < 60; i++) { const x = 60 + r() * 960, y = 80 + r() * 920, rad = 5 + r() * 9; if (Math.hypot(x - 540, y - 540) < 290 && Math.abs(y - 540) < 150) continue; shape(c, () => ell(c, x, y, rad, rad), "rgba(255,255,255,0.6)", 3); }
};
// term.7 algal bloom: a thick green mat on the pond, fish below looking up
const algalBloom = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = "#5c8fa6"; c.fillRect(0, 380, D, 700);
  for (const [x, y, L, d] of [[300, 720, 170, 1], [700, 820, 200, -1], [520, 950, 150, 1]]) { c.save(); c.translate(x, y); c.rotate(-d * 0.6); fish(c, 0, 0, L, d, "#c9c4bb", "#8f8a82"); c.restore(); }
  shape(c, () => rrect(c, -20, 330, D + 40, 90, 30), COL.greenLt, 6);
  const r = rnd(2); for (let i = 0; i < 40; i++) shape(c, () => ell(c, r() * D, 345 + r() * 60, 14 + r() * 20, 10 + r() * 10), i % 2 ? COL.green : "#b5e06a", 3);
};

export const ic_environmentPollutionL4 = cards("sci.environment.pollution.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2, e3s3,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowP1, turbidity, oilSlick, dissolvedOxygen, algalBloom,
]);
