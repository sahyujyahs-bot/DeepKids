import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, write, cards } from "./flatKit";

// sci.food.nutrients.L3 set-up cards: milk curds (tumblers), drying slices, drying drops on a plate.
const MILK = "#fdf8ec", LEMONJ = "#ffd34d", WHEY = "#d9e48a", PENCIL = "#6b6672";

const blob = (c: Ctx, x: number, y: number, r: number, seed: number) => { const q = rnd(seed), p1 = q() * 6, p2 = q() * 6, a1 = 0.1 + q() * 0.1, a2 = 0.06 + q() * 0.08; c.beginPath(); for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2, rr = r * (1 + a1 * Math.sin(2 * a + p1) + a2 * Math.sin(3 * a + p2)); if (i) c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); };
const drop = (c: Ctx, x: number, y: number, s: number, col: string) =>
  shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y - s * 0.1, x + s * 0.8, y + s * 0.4); c.arc(x, y + s * 0.4, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y - s * 0.1, x, y - s * 1.5); c.closePath(); }, col, Math.max(3, s * 0.22));
const sparkle = (c: Ctx, x: number, y: number, r: number, col: string = WHITE) =>
  shape(c, () => { c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.closePath(); }, col, 3);

// a steel tumbler seen from a little above: the top is a wide ellipse so the liquid inside shows
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, liquid: string | null = null) => {
  const top = w / 2, bot = w * 0.4, ry = w * 0.2;
  shadow(c, x + w * 0.14, y + 8, w * 0.62, w * 0.12);
  const body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.quadraticCurveTo(x, y + ry * 0.9, x - bot, y); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -w * 0.3, 0, 0.6);
  shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, x, y - h, top, ry), COL.steelIn, 5);
  shape(c, () => ell(c, x, y - h + ry * 0.08, top * 0.88, ry * 0.76), liquid ?? COL.steelDk, 4);
  shine(c, [[x - top * 0.78, y - h + ry * 1.2], [x - bot * 0.78, y - ry * 0.4]], 8);
};
const spoon = (c: Ctx, x0: number, y0: number, x1: number, y1: number, content: string | null) => {
  const an = Math.atan2(y1 - y0, x1 - x0);
  line(c, [[x0, y0], [x1, y1]], 22, INK); line(c, [[x0, y0], [x1, y1]], 12, COL.steel);
  shape(c, () => ell(c, x1 + Math.cos(an) * 30, y1 + Math.sin(an) * 30, 52, 32, an), COL.steel, 6);
  shape(c, () => ell(c, x1 + Math.cos(an) * 30, y1 + Math.sin(an) * 30, 40, 22, an), content ?? COL.steelIn, 4);
};

// little pictures for the paper labels (no words)
const icon = (c: Ctx, kind: string, x: number, y: number, s: number) => {
  if (kind === "lemon") {
    shape(c, () => ell(c, x - 30 * s, y + 10 * s, 7 * s, 7 * s), "#ffd34d", 4); shape(c, () => ell(c, x + 30 * s, y - 10 * s, 7 * s, 7 * s), "#ffd34d", 4);
    shape(c, () => ell(c, x, y, 34 * s, 24 * s, -0.3), "#ffd34d", 5); line(c, [[x - 12 * s, y - 2 * s], [x + 10 * s, y - 12 * s]], 5, "#fff3a8");
    shape(c, () => ell(c, x + 8 * s, y - 28 * s, 16 * s, 8 * s, -0.5), COL.leaf, 4);
  } else if (kind === "vinegar") {
    shape(c, () => rrect(c, x - 10 * s, y - 34 * s, 20 * s, 30 * s, 4), "#b9824a", 5); shape(c, () => rrect(c, x - 24 * s, y - 8 * s, 48 * s, 46 * s, 10 * s), "#b9824a", 5);
    shape(c, () => rrect(c, x - 13 * s, y - 44 * s, 26 * s, 12 * s, 3), COL.red, 4); shape(c, () => rrect(c, x - 17 * s, y + 6 * s, 34 * s, 18 * s, 3), WHITE, 3);
  } else if (kind === "tamarind") {
    [[-30, 8, 18], [0, -2, 21], [30, 8, 18]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, 15 * s), "#8b5a34", 5));
    line(c, [[x - 40 * s, y + 4 * s], [x, y - 8 * s], [x + 40 * s, y + 4 * s]], 4, "#c79a6a");
  } else if (kind === "salt") {
    shape(c, () => rrect(c, x - 22 * s, y - 10 * s, 44 * s, 46 * s, 8 * s), "#eef2f8", 5); shape(c, () => rrect(c, x - 22 * s, y - 32 * s, 44 * s, 22 * s, 7 * s), COL.steelDk, 5);
    [-10, 0, 10].forEach((dx) => { c.beginPath(); c.arc(x + dx * s, y - 22 * s, 2.6 * s, 0, 7); c.fillStyle = INK; c.fill(); });
  } else if (kind === "sugar") {
    [[-18, 10], [18, 10], [0, -14]].forEach(([dx, dy], i) => { shape(c, () => rrect(c, x + dx * s - 17 * s, y + dy * s - 17 * s, 34 * s, 34 * s, 5), WHITE, 5); line(c, [[x + dx * s - 8 * s, y + dy * s - 8 * s], [x + dx * s + 4 * s, y + dy * s - 8 * s]], 4, COL.sky); if (i === 0) sparkle(c, x - 36 * s, y - 20 * s, 9 * s, "#fff3a8"); });
  } else if (kind === "water" || kind === "filtered") {
    drop(c, x, y + 4 * s, 24 * s, COL.water); if (kind === "filtered") sparkle(c, x + 34 * s, y - 20 * s, 11 * s, "#fff3a8");
  } else if (kind === "tap") {
    shape(c, () => rrect(c, x - 36 * s, y - 28 * s, 60 * s, 18 * s, 6), COL.steel, 5); shape(c, () => rrect(c, x + 10 * s, y - 28 * s, 16 * s, 40 * s, 5), COL.steel, 5);
    shape(c, () => rrect(c, x - 18 * s, y - 42 * s, 24 * s, 16 * s, 4), COL.red, 4); drop(c, x + 18 * s, y + 26 * s, 8 * s, COL.water);
  } else if (kind === "coconut") {
    shape(c, () => { c.arc(x, y - 6 * s, 36 * s, 0, Math.PI); c.closePath(); }, "#7a4a2a", 5); shape(c, () => ell(c, x, y - 6 * s, 36 * s, 11 * s), WHITE, 5);
  } else if (kind === "whey") {
    drop(c, x, y + 4 * s, 24 * s, WHEY);
  }
};
const tag = (c: Ctx, x: number, y: number, w: number, h: number, kind: string, s = 1) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 10), "#fffdf4", 5);
  icon(c, kind, x, y + 4 * s, s);
};

// ---- the pencil-and-slices cards (e2) share these
type SliceKind = "cucumber" | "tomato" | "potato" | "carrot" | "chapati";
const FRESH: Record<SliceKind, [string, string]> = { cucumber: ["#6aa53f", "#dcefb0"], tomato: ["#e4523b", "#f58c72"], potato: ["#b5844f", "#f3e2b0"], carrot: ["#f39a3c", "#ffb561"], chapati: ["#c9964f", "#e7c48a"] };
const DRY: Record<SliceKind, [string, string]> = { cucumber: ["#6f7a35", "#a8ae6a"], tomato: ["#7a2a20", "#a8442f"], potato: ["#8e7448", "#c4aa78"], carrot: ["#b8691f", "#d98a3c"], chapati: ["#b88543", "#d9b176"] };
const wobble = (c: Ctx, x: number, y: number, r: number, seed: number, rough: number) => { const q = rnd(seed); c.beginPath(); for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2, rr = r * (1 + (q() - 0.5) * rough); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i) c.lineTo(px, py); else c.moveTo(px, py); } c.closePath(); };
const slice = (c: Ctx, kind: SliceKind, x: number, y: number, r: number, dry = false, seed = 3) => {
  const [o, i] = (dry ? DRY : FRESH)[kind], rough = dry ? 0.22 : 0.02;
  shadow(c, x + r * 0.12, y + r * 0.25, r, r * 0.8);
  shape(c, () => wobble(c, x, y, r, seed, rough), o, Math.max(3, Math.min(6, r * 0.1)));
  c.beginPath(); wobble(c, x, y, r * (kind === "chapati" ? 0.84 : 0.8), seed, rough); c.fillStyle = i; c.fill();
  const q = rnd(seed + 5);
  if (kind === "cucumber") for (let k = 0; k < 6; k++) { const a = k * 1.05, d = r * 0.4; shape(c, () => ell(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.09, r * 0.055, a), dry ? "#6f7a35" : "#f1f7d4", Math.max(2, r * 0.03)); }
  if (kind === "tomato") { [0, 2.1, 4.2].forEach((a) => { line(c, [[x, y], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], Math.max(3, r * 0.08), dry ? "#7a2a20" : "#fbe3d6"); for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(x + Math.cos(a + 1.05) * r * (0.35 + k * 0.12), y + Math.sin(a + 1.05) * r * (0.35 + k * 0.12), Math.max(2, r * 0.05), 0, 7); c.fillStyle = "#ffd34d"; c.fill(); } }); }
  if (kind === "potato") for (let k = 0; k < 7; k++) { c.beginPath(); c.arc(x + (q() - 0.5) * r * 1.0, y + (q() - 0.5) * r * 1.0, Math.max(2, r * 0.045), 0, 7); c.fillStyle = dry ? "#7b6338" : "#d8c08a"; c.fill(); }
  if (kind === "carrot") { c.beginPath(); wobble(c, x, y, r * 0.38, seed + 1, rough); c.fillStyle = dry ? "#e5a96a" : "#ffd9a0"; c.fill(); for (let k = 0; k < 8; k++) line(c, [[x + Math.cos(k * 0.785) * r * 0.4, y + Math.sin(k * 0.785) * r * 0.4], [x + Math.cos(k * 0.785) * r * 0.74, y + Math.sin(k * 0.785) * r * 0.74]], Math.max(2, r * 0.035), dry ? "#b8691f" : "#e57e1f"); }
  if (kind === "chapati") for (let k = 0; k < 9; k++) shape(c, () => ell(c, x + (q() - 0.5) * r * 1.2, y + (q() - 0.5) * r * 1.2, r * 0.1, r * 0.07, q() * 3), "#7a4a2a", 0);
  if (dry) for (let k = 0; k < 3; k++) line(c, [[x - r * 0.5 + k * r * 0.3, y - r * 0.5], [x - r * 0.35 + k * r * 0.3, y + r * 0.1], [x - r * 0.5 + k * r * 0.35, y + r * 0.5]], Math.max(2, r * 0.03), INK);
};
const KINDS: SliceKind[] = ["cucumber", "tomato", "potato", "carrot", "chapati"];
const SLICE_AT: number[][] = [[215, 290], [540, 290], [865, 290], [350, 620], [690, 620]];
const RING = 146, SLICE_R = 126, SHRINK = [0.3, 0.52, 0.56, 0.62, 0.92];
const paperSheet = (c: Ctx) => { shadow(c, 560, 1000, 460, 40); shape(c, () => polyP(c, [[60, 60], [1020, 50], [1025, 1005], [55, 1010]]), "#fffaf0", 6); };

// ---- the window and the sunny sill (e2.1, e3.1)
const sunnySill = (c: Ctx) => {
  shape(c, () => rrect(c, 110, 40, 860, 470, 10), COL.sky, 7);
  c.beginPath(); c.arc(720, 190, 82, 0, 7); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[720 + Math.cos(a) * 105, 190 + Math.sin(a) * 105], [720 + Math.cos(a) * 150, 190 + Math.sin(a) * 150]], 9, COL.orange); }
  line(c, [[540, 40], [540, 510]], 12, INK); line(c, [[110, 275], [540, 275]], 12, INK);
  shape(c, () => polyP(c, [[70, 505], [1010, 505], [1075, 930], [5, 930]]), COL.wood, 7);
  shape(c, () => polyP(c, [[5, 930], [1075, 930], [1075, 1010], [5, 1010]]), COL.woodDk, 7);
  c.save(); c.globalAlpha = 0.22; shape(c, () => polyP(c, [[640, 505], [800, 505], [940, 930], [560, 930]]), COL.yellow, 0); c.restore();
};

// the six steel-tumbler cards (e1)
const SIX: [string, string][] = [["lemon", "#f6e07a"], ["vinegar", "#d9a15a"], ["tamarind", "#8b4f2a"], ["salt", "#eaf1f8"], ["sugar", "#f3e6b8"], ["water", COL.water]];

// setup.e1.0
const su_e1_0 = (c: Ctx) => {
  ground(c);
  SIX.forEach(([kind, liq], i) => {
    const tx = 105 + (i % 3) * 345, by = i < 3 ? 390 : 820;
    tumbler(c, tx, by, 150, 250);
    bowl(c, tx + 180, by - 50, 64, liq);
    tag(c, tx + 90, by + 75, 190, 105, kind, 1.2);
  });
};

// setup.e1.1
const su_e1_1 = (c: Ctx) => {
  ground(c);
  tumbler(c, 910, 930, 250, 330, MILK);
  tumbler(c, 610, 930, 250, 330, null);
  const px = 600, py = 380;
  [[470, 300, 450, 150], [520, 290, 560, 140], [430, 310, 400, 190]].forEach(([x0, y0, x1, y1]) => { c.beginPath(); c.moveTo(x0, y0); c.bezierCurveTo(x0 + 40, y0 - 40, x1 - 40, y1 + 40, x1, y1); c.strokeStyle = "#d9d3c8"; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); });
  line(c, [[px + 2, py + 6], [px + 4, 600]], 36, INK); line(c, [[px + 2, py + 6], [px + 4, 600]], 24, MILK);
  c.save(); c.translate(px, py); c.rotate(0.5);
  line(c, [[-250, 40], [-400, 40]], 36, INK); line(c, [[-250, 40], [-400, 40]], 24, COL.steelDk);
  const body = () => rrect(c, -270, 0, 270, 140, 16);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -70, 0, 0.6); shape(c, body, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, -135, 4, 135, 26), COL.steelIn, 5); shape(c, () => ell(c, -135, 6, 118, 17), MILK, 3);
  hand(c, -480, 40, 0, 1.25, SKIN_ADULT, CLOTH_ADULT);
  c.restore();
  arrow(c, [[740, 440], [740, 540]]);
};
const SKIN_ADULT = "#8d5a3b", CLOTH_ADULT = "#5b8fd6";

// setup.e1.2
const su_e1_2 = (c: Ctx) => {
  ground(c);
  // half lemon on the counter
  shadow(c, 215, 960, 140, 28);
  shape(c, () => ell(c, 205, 880, 125, 100, -0.1), "#ffd34d", 6); shape(c, () => ell(c, 205, 880, 105, 82, -0.1), "#fff3b0", 4);
  for (let k = 0; k < 8; k++) line(c, [[205, 880], [205 + Math.cos(k * 0.785) * 95, 880 + Math.sin(k * 0.785) * 74]], 4, "#f1c93a");
  tumbler(c, 600, 960, 420, 400, null);
  const wx = 600, wy = 560;
  shape(c, () => ell(c, wx, wy, 190, 74), MILK, 3);
  const q = rnd(4);
  for (let k = 0; k < 13; k++) { const a = q() * 6.28, d = Math.sqrt(q()) * 0.8, r = 20 + q() * 12; shape(c, () => blob(c, wx + Math.cos(a) * d * 160, wy + Math.sin(a) * d * 52, r, 40 + k), WHITE, 3.5); }
  const sp: number[][] = []; for (let k = 0; k <= 10; k++) { const t = ((150 - k * 12) * Math.PI) / 180; sp.push([wx + Math.cos(t) * 150, wy + 8 + Math.sin(t) * 46]); }
  arrow(c, sp, RED, 10);
  spoon(c, 240, 285, 600, 420, LEMONJ);
  drop(c, 705, 472, 13, LEMONJ); drop(c, 708, 515, 11, LEMONJ);
  hand(c, 170, 250, 0.35, 1.8);
};

// setup.e1.3
const su_e1_3 = (c: Ctx) => {
  ground(c);
  const gx = 540, gb = 975, gw = 400, gh = 520, top = gb - gh;
  // strainer bowl, inside the glass
  const bowlP = () => { c.moveTo(gx - 185, top + 20); c.bezierCurveTo(gx - 170, top + 190, gx - 90, top + 230, gx, top + 230); c.bezierCurveTo(gx + 90, top + 230, gx + 170, top + 190, gx + 185, top + 20); c.closePath(); };
  shape(c, bowlP, COL.steelIn, 5);
  for (let k = -3; k <= 3; k++) line(c, [[gx + k * 50, top + 30], [gx + k * 22, top + 225]], 2.5, COL.steelDk);
  [90, 150, 205].forEach((dy) => line(c, [[gx - 150, top + dy], [gx + 150, top + dy]], 2.5, COL.steelDk));
  glass(c, gx, gb, gw, gh, 0.3, WHEY);
  drop(c, gx, top + 300, 15, WHEY); drop(c, gx + 3, top + 368, 13, WHEY);
  // flange + cloth + curds above
  shape(c, () => ell(c, gx, top, 270, 38), COL.steel, 6);
  const drape = (sx: number) => shape(c, () => { c.moveTo(gx + sx * 235, top - 4); c.quadraticCurveTo(gx + sx * 285, top + 20, gx + sx * 262, top + 100); c.quadraticCurveTo(gx + sx * 225, top + 120, gx + sx * 200, top + 50); c.closePath(); }, COL.cloth, 5);
  drape(-1); drape(1);
  shape(c, () => ell(c, gx, top - 2, 250, 34), COL.cloth, 5);
  const q = rnd(6);
  for (let row = 0; row < 3; row++) for (let k = 0; k < 6 - row; k++) { const x = gx - (5 - row) * 38 + k * 76 + (q() - 0.5) * 16, y = top - 18 - row * 58 + (q() - 0.5) * 10, r = 52 - row * 5; shape(c, () => blob(c, x, y, r, 70 + row * 7 + k), row ? WHITE : "#f6f1e4", 4.5); }
};

// setup.e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c);
  paperSheet(c);
  KINDS.forEach((k, i) => {
    const [x, y] = SLICE_AT[i];
    slice(c, k, x, y, SLICE_R, false, 3 + i);
    if (i < 4) { c.beginPath(); c.arc(x, y, RING, 0, 7); c.strokeStyle = PENCIL; c.lineWidth = 6; c.stroke(); }
    else { c.beginPath(); c.arc(x, y, RING, Math.PI * 0.75, Math.PI * 2.25); c.strokeStyle = PENCIL; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
  });
  // pencil with its tip at the end of the half-drawn ring
  const tx = 690 + RING * 0.707, ty = 620 + RING * 0.707, ux = 0.847, uy = 0.531;
  line(c, [[tx + ux * 70, ty + uy * 70], [tx + ux * 260, ty + uy * 260]], 30, INK); line(c, [[tx + ux * 70, ty + uy * 70], [tx + ux * 260, ty + uy * 260]], 20, COL.yellow);
  shape(c, () => polyP(c, [[tx, ty], [tx + ux * 74 - uy * 11, ty + uy * 74 + ux * 11], [tx + ux * 74 + uy * 11, ty + uy * 74 - ux * 11]]), "#f0cfa0", 4);
  shape(c, () => polyP(c, [[tx, ty], [tx + ux * 22 - uy * 3.5, ty + uy * 22 + ux * 3.5], [tx + ux * 22 + uy * 3.5, ty + uy * 22 - ux * 3.5]]), INK, 2);
  hand(c, tx + ux * 165, ty + uy * 165, -2.58, 1.6);
};

// setup.e2.1
const su_e2_1 = (c: Ctx) => {
  ground(c);
  sunnySill(c);
  plate(c, 540, 715, 460, 175);
  [225, 382, 540, 698, 855].forEach((x, i) => slice(c, KINDS[i], x, 705 + (i % 2) * 20, 72, false, 3 + i));
  // thin cloth over the plate
  const cl = () => { c.moveTo(170, 700); c.quadraticCurveTo(190, 590, 330, 590); c.quadraticCurveTo(540, 560, 750, 590); c.quadraticCurveTo(890, 590, 910, 700); c.quadraticCurveTo(930, 800, 840, 835); c.quadraticCurveTo(740, 870, 650, 840); c.quadraticCurveTo(540, 880, 430, 840); c.quadraticCurveTo(330, 870, 240, 835); c.quadraticCurveTo(150, 800, 170, 700); c.closePath(); };
  c.save(); c.translate(540, 715); c.scale(1.18, 1.12); c.translate(-540, -715);
  c.save(); c.globalAlpha = 0.72; c.beginPath(); cl(); c.fillStyle = COL.cloth; c.fill(); c.restore();
  c.beginPath(); cl(); c.lineWidth = 5; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke(); c.restore();
  [[300, 840, 310, 790], [480, 850, 470, 800], [640, 842, 650, 790], [800, 835, 790, 785]].forEach(([x0, y0, x1, y1]) => line(c, [[x0, y0], [x1, y1]], 4, COL.grey));
};

// setup.e2.2
const su_e2_2 = (c: Ctx) => {
  ground(c);
  paperSheet(c);
  KINDS.forEach((k, i) => {
    const [x, y] = SLICE_AT[i];
    c.beginPath(); c.arc(x, y, RING, 0, 7); c.strokeStyle = PENCIL; c.lineWidth = 6; c.stroke();
    slice(c, k, x, y, SLICE_R * SHRINK[i], true, 8 + i);
  });
};

// ---- the plate cards (e3): five spots in a ring, the first one (left) is filtered water
const PLATE = { x: 540, y: 540, rx: 470, ry: 330 };
const SPOT_KINDS = ["filtered", "tap", "salt", "coconut", "whey"];
const ang = (i: number) => ((198 + i * 72) * Math.PI) / 180;
const labelAt = (i: number) => [PLATE.x + Math.cos(ang(i)) * PLATE.rx * 0.74, PLATE.y + Math.sin(ang(i)) * PLATE.ry * 0.74];
const spotAt = (i: number) => [PLATE.x + Math.cos(ang(i)) * PLATE.rx * 0.4, PLATE.y + Math.sin(ang(i)) * PLATE.ry * 0.4];
const WET: string[] = ["#cfe6f6", "#bcd6e8", "#d6e6f2", "#f4efe2", "#e3e8a8"];

// setup.e3.0
const su_e3_0 = (c: Ctx) => {
  ground(c);
  plate(c, PLATE.x, PLATE.y, PLATE.rx, PLATE.ry);
  SPOT_KINDS.forEach((k, i) => {
    const [sx, sy] = spotAt(i), [lx, ly] = labelAt(i);
    if (i > 0) shape(c, () => ell(c, sx, sy, 56, 30), WET[i], 4);
    tag(c, lx, ly, 160, 120, k, 1.3);
  });
  spoon(c, 240, 250, 345, 385, COL.water);
  drop(c, 372, 458, 14, COL.water);
  hand(c, 185, 175, 0.89, 1.7);
};

// setup.e3.1
const su_e3_1 = (c: Ctx) => {
  ground(c);
  sunnySill(c);
  plate(c, 540, 735, 470, 185);
  const at = [[250, 735], [395, 810], [540, 725], [685, 810], [830, 735]];
  at.forEach(([x, y], i) => {
    shape(c, () => ell(c, x, y, 62, 30), WET[i], 4);
    sparkle(c, x - 20, y - 50, 30, WHITE);
    line(c, [[x - 32, y - 4], [x - 8, y - 12]], 7, WHITE);
  });
};

// setup.e3.2
const su_e3_2 = (c: Ctx) => {
  ground(c);
  plate(c, PLATE.x, PLATE.y, PLATE.rx, PLATE.ry);
  SPOT_KINDS.forEach((k, i) => {
    const [sx, sy] = spotAt(i), [lx, ly] = labelAt(i), q = rnd(20 + i);
    if (k === "filtered") { shape(c, () => ell(c, sx, sy, 9, 5), "#d3dae3", 2); }
    if (k === "tap") { shape(c, () => ell(c, sx, sy, 86, 58), WHITE, 4); shape(c, () => ell(c, sx, sy, 60, 36), COL.steelIn, 3); }
    if (k === "salt") for (let n = 0; n < 16; n++) { const a = q() * 6.28, d = Math.sqrt(q()); shape(c, () => rrect(c, sx + Math.cos(a) * d * 80 - 14, sy + Math.sin(a) * d * 44 - 14, 28, 28, 4), WHITE, 3.5); }
    if (k === "coconut") { shape(c, () => ell(c, sx, sy, 80, 46), "#f0d58a", 5); line(c, [[sx - 40, sy - 14], [sx - 6, sy - 24]], 7, WHITE); shape(c, () => ell(c, sx + 64, sy + 40, 12, 8), "#f0d58a", 3); }
    if (k === "whey") { shape(c, () => ell(c, sx, sy, 80, 46), "#d9c05a", 5); line(c, [[sx - 40, sy - 14], [sx - 6, sy - 24]], 7, "#fff3b0"); shape(c, () => ell(c, sx - 60, sy + 42, 12, 8), "#d9c05a", 3); }
    tag(c, lx, ly, 160, 120, k, 1.3);
  });
};

export const su_foodNutrients = cards("sci.food.nutrients.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e1_3, su_e2_0, su_e2_1, su_e2_2, su_e3_0, su_e3_1, su_e3_2]);
