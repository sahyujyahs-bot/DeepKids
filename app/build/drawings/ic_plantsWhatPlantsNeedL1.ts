import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, seed, hand, person, write, cards } from "./flatKit";

// WHAT PLANTS NEED (L1) · methi on three plates: dry, wet in the light, wet under a steel bowl.
// Set-up cards first, then the card pictures. Everything rests on a surface or is held; arms are
// aimed with armTo so each hand lands on the thing it holds.

const METHI = "#d9a93f", METHI_DK = "#a67a22", WET = "#bcd8ee", WET_DK = "#8fb3dc";
const YEL = "#efd978", YEL_LF = "#f3e7a4", YEL_VN = "#c9ad4a";
const PALE = "#b9d978", PALE_LF = "#cfe59a", PALE_VN = "#8fb050";
const GRN = "#8fcf5a", TERRA = "#c7653a", TERRA_DK = "#a04d2a", DRY = "#cdb591", FLOOR = "#d9ccb6";
const PX = [200, 540, 880];

// ---------------------------------------------------------------- helpers
const methi = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, METHI, METHI_DK);
// a leaf with its own vein colour (flatKit's leaf always has a dark green vein)
const lf = (c: Ctx, x: number, y: number, len: number, an: number, col: string, vein: string) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.32, ny = Math.cos(an) * len * 0.32, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, col, 5);
  line(c, [[x, y], [mx + (tx - mx) * 0.6, my + (ty - my) * 0.6]], 3, vein);
};
// a sprout: a stem from its base (x, y) rising h, leaning by `lean` px, two small leaves at the top
const sprout = (c: Ctx, x: number, y: number, h: number, lean: number, stem: string, leafCol: string, vein: string, ll: number, w = 7) => {
  const tx = x + lean, ty = y - h;
  const path = () => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + lean * 0.2, y - h * 0.55, tx, ty); };
  c.lineCap = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 6; c.stroke(); path(); c.strokeStyle = stem; c.lineWidth = w; c.stroke();
  lf(c, tx, ty, ll, -Math.PI * 0.82, leafCol, vein); lf(c, tx, ty, ll, -Math.PI * 0.18, leafCol, vein);
};
const yellowSprout = (c: Ctx, x: number, y: number, h: number, lean: number) => sprout(c, x, y, h, lean, YEL, YEL_LF, YEL_VN, 20, 6);
const paleSprout = (c: Ctx, x: number, y: number, h: number, lean: number) => sprout(c, x, y, h, lean, PALE, PALE_LF, PALE_VN, 30);
const greenSprout = (c: Ctx, x: number, y: number, h: number, lean: number, ll = 28) => sprout(c, x, y, h, lean, GRN, COL.leaf, COL.leafDk, ll);
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], 7, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const drop = (c: Ctx, x: number, y: number, s: number) =>
  shape(c, () => { c.moveTo(x, y - s * 1.2); c.quadraticCurveTo(x + s, y - s * 0.1, x + s * 0.75, y + s * 0.35); c.arc(x, y + s * 0.35, s * 0.75, 0, Math.PI); c.quadraticCurveTo(x - s, y - s * 0.1, x, y - s * 1.2); c.closePath(); }, COL.water, 4);
// a paper label: the plate number and its drawing (0: crossed-out drop, 1: sun and drop, 2: bowl and drop)
const tag = (c: Ctx, x: number, y: number, n: number, kind: number) => {
  shadow(c, x + 8, y + 10, 88, 62);
  shape(c, () => rrect(c, x - 85, y - 60, 170, 120, 10), WHITE, 5);
  write(c, String(n), x - 72, y - 30, 60);
  if (kind === 0) { drop(c, x + 30, y, 24); line(c, [[x - 2, y + 36], [x + 62, y - 36]], 8, RED); }
  else if (kind === 1) { sun(c, x + 8, y, 16); drop(c, x + 58, y, 20); }
  else { const bx = x + 10, by = y + 14, r = 26; shape(c, () => { c.moveTo(bx - r, by); c.bezierCurveTo(bx - r * 0.95, by - r * 0.95, bx + r * 0.95, by - r * 0.95, bx + r, by); c.closePath(); }, COL.steel, 4); drop(c, x + 58, y, 20); }
};
// an upturned steel bowl: its rim on the surface at (x, y), rim radius r
const upBowl = (c: Ctx, x: number, y: number, r: number, onSurface = true) => {
  if (onSurface) shadow(c, x + r * 0.12, y + r * 0.08, r * 1.05, r * 0.24);
  const dome = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.95, y - r * 0.98, x + r * 0.95, y - r * 0.98, x + r, y); c.closePath(); };
  shape(c, () => ell(c, x, y, r, r * 0.2), COL.steelDk, 6);
  shape(c, dome, COL.steel);
  shade(c, dome, COL.steelDk, r * 0.35, 0);
  shape(c, () => ell(c, x, y - r * 0.72, r * 0.4, r * 0.08), COL.steelIn, 5);
  shine(c, [[x - r * 0.6, y - r * 0.42], [x - r * 0.38, y - r * 0.62]], 8);
  c.beginPath(); c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// a window with four panes of sky and the sun in the top-left pane
const windowFrame = (c: Ctx, x: number, y: number, w: number, h: number, sunR = 55) => {
  const b = 30, mid = 22, pw = (w - 2 * b - mid) / 2, ph = (h - 2 * b - mid) / 2;
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) shape(c, () => { c.rect(x + b + i * (pw + mid), y + b + j * (ph + mid), pw, ph); }, COL.sky, 5);
  sun(c, x + b + pw * 0.4, y + b + ph * 0.46, sunR);
};
// a wooden windowsill: top face from y, then its front face
const sill = (c: Ctx, y: number, h: number) => {
  shape(c, () => polyP(c, [[60, y], [1020, y], [1060, y + h], [20, y + h]]), COL.wood);
  shape(c, () => { c.rect(20, y + h, 1040, 60); }, COL.woodDk);
};
// a folded tissue on a plate, dry or wet, with methi seeds scattered on it
const tissue = (c: Ctx, x: number, y: number, rx: number, ry: number, wet: boolean) => {
  shape(c, () => rrect(c, x - rx * 0.66, y - ry * 0.64, rx * 1.32, ry * 1.28, 26), wet ? WET : COL.cloth, 5);
  line(c, [[x - rx * 0.6, y + 2], [x + rx * 0.6, y + 2]], 3, wet ? WET_DK : "#d9d2c2");
  if (wet) { const r = rnd(x + 3); for (let i = 0; i < 7; i++) { const dx = x - rx * 0.55 + r() * rx * 1.1, dy = y - ry * 0.5 + r() * ry; shape(c, () => ell(c, dx, dy, 8, 5), COL.drop, 2.5); } }
};
const seedsOn = (c: Ctx, x: number, y: number, rx: number, ry: number, n: number, r0: number, sd: number) => {
  const r = rnd(sd); for (let i = 0; i < n; i++) methi(c, x - rx * 0.5 + (i % 5) * rx * 0.25 + r() * 14, y - ry * 0.45 + Math.floor(i / 5) * ry * 0.42 + r() * 12, r0, r() * 3);
};
type Kind = "dry" | "wet" | "green" | "yellow";
const plateOf = (c: Ctx, x: number, y: number, rx: number, ry: number, kind: Kind, sd: number) => {
  plate(c, x, y, rx, ry);
  tissue(c, x, y, rx, ry, kind !== "dry");
  if (kind === "dry" || kind === "wet") seedsOn(c, x, y, rx, ry, 14, rx * 0.055, sd);
  else {
    const r = rnd(sd); seedsOn(c, x, y, rx, ry, 6, rx * 0.05, sd + 1);
    const pts: number[][] = []; for (let i = 0; i < 7; i++) pts.push([x - rx * 0.5 + (i % 4) * rx * 0.3 + (i > 3 ? rx * 0.15 : 0) + r() * 10, y - ry * 0.4 + Math.floor(i / 4) * ry * 0.5 + r() * 10]);
    pts.sort((a, b) => a[1] - b[1]);
    if (kind === "green") pts.forEach(([px, py], i) => greenSprout(c, px, py, rx * 0.5 + (i % 3) * rx * 0.07, (i % 2 ? 1 : -1) * rx * 0.05, rx * 0.17));
    else pts.forEach(([px, py], i) => { if (i === 2) yellowSprout(c, px, py, rx * 0.2, (px > x ? -1 : 1) * rx * 0.8); else yellowSprout(c, px, py, rx * 1.15 + (i % 3) * rx * 0.18, (i % 2 ? 1 : -1) * rx * (0.2 + (i % 3) * 0.15)); });
  }
};
// a terracotta pot standing on the ground line y; soil ellipse at the top
const pot = (c: Ctx, x: number, y: number, w: number, h: number, soil: string) => {
  shadow(c, x + w * 0.1, y - 4, w * 0.5, w * 0.1);
  const body = () => polyP(c, [[x - w / 2, y - h + 30], [x + w / 2, y - h + 30], [x + w * 0.4, y], [x - w * 0.4, y]]);
  shape(c, body, TERRA); shade(c, body, TERRA_DK, w * 0.3, 0);
  shape(c, () => rrect(c, x - w / 2 - 12, y - h, w + 24, 36, 8), TERRA);
  shade(c, () => rrect(c, x - w / 2 - 12, y - h, w + 24, 36, 8), TERRA_DK, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h + 2, w / 2 - 2, 18), soil, 5);
};
// joint angles for person(): the arm from shoulder (sx, sy) whose hand lands on (tx, ty); side pushes the elbow to one side of the straight line
const armTo = (h: number, sx: number, sy: number, tx: number, ty: number, side: 1 | -1): [number, number] => {
  const l1 = h * 0.17, l2 = h * 0.16, d0 = Math.hypot(tx - sx, ty - sy), d = Math.min(l1 + l2 - 1, Math.max(Math.abs(l1 - l2) + 1, d0));
  const ux = (tx - sx) / d0, uy = (ty - sy) / d0, a = (l1 * l1 + d * d - l2 * l2) / (2 * d), hh = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ex = sx + ux * a - side * uy * hh, ey = sy + uy * a + side * ux * hh;
  return [Math.atan2(ey - sy, ex - sx), Math.atan2(sy + uy * d - ey, sx + ux * d - ex)];
};
const shoulder = (x: number, y: number, h: number, right: boolean): [number, number] => [x + (right ? 1 : -1) * h * 0.11, y - h * 0.71];
const tulsiLeaf = (c: Ctx, x: number, y: number, an: number, col: string, vein: string, len = 46) => lf(c, x, y, len, an, col, vein);
const stem = (c: Ctx, pts: number[][], w: number, col: string) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 6; c.stroke(); path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
};

// ---------------------------------------------------------------- set-up cards (e1)
// 1. three plates, a tissue and a spoon of seeds on each; plate 1 dry, plates 2 and 3 wet
const setup0 = (c: Ctx) => {
  ground(c);
  PX.forEach((x, i) => { plateOf(c, x, 500, 158, 78, i ? "wet" : "dry", 11 + i); tag(c, x, 740, i + 1, i); });
};
// 2. the plates on a bright windowsill; the steel bowl upturned over plate 3
const setup1 = (c: Ctx) => {
  ground(c);
  windowFrame(c, 120, 50, 840, 560);
  sill(c, 610, 160);
  plateOf(c, 200, 700, 150, 68, "dry", 21);
  plateOf(c, 540, 700, 150, 68, "wet", 22);
  plate(c, 880, 700, 170, 76);
  upBowl(c, 880, 700, 150);
};
// 3. day 5: a hand lifts the bowl off plate 3 and shows tall yellow sprouts, next to green sprouts and dry seeds
const setup2 = (c: Ctx) => {
  ground(c);
  plateOf(c, 200, 660, 158, 78, "dry", 31);
  plateOf(c, 540, 660, 158, 78, "green", 32);
  plateOf(c, 880, 660, 158, 78, "yellow", 33);
  upBowl(c, 880, 340, 150, false);
  hand(c, 880, 150, Math.PI / 2, 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[700, 450], [700, 300]]);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the three plates on day 5 with their labels: dry seeds, green sprouts, tall yellow sprouts
const flowE1 = (c: Ctx) => {
  ground(c);
  const kinds: Kind[] = ["dry", "green", "yellow"];
  PX.forEach((x, i) => { plateOf(c, x, 520, 158, 78, kinds[i], 41 + i); tag(c, x, 760, i + 1, i); });
};
// flow.a3: a child shines a torch through a clear glass; a bright spot lands on the wall
const flowA3 = (c: Ctx) => {
  ground(c, "#e6dccb");
  c.fillStyle = "#cfc2ad"; c.fillRect(0, 920, D, 160); line(c, [[0, 920], [D, 920]], 5);
  shape(c, () => { c.rect(830, 60, 230, 860); }, "#b3acb5");
  const an = 0.25, cx = 250, fy = 920, h = 600;
  const wrist: [number, number] = [508, 543], tc = [wrist[0] + 30 * Math.cos(an), wrist[1] + 30 * Math.sin(an)], lens = [tc[0] + 60 * Math.cos(an), tc[1] + 60 * Math.sin(an)];
  const px = -Math.sin(an), py = Math.cos(an), end = [870, lens[1] + (870 - lens[0]) * Math.tan(an)];
  c.beginPath(); polyP(c, [[lens[0] + px * 14, lens[1] + py * 14], [lens[0] - px * 14, lens[1] - py * 14], [end[0] - px * 62, end[1] - py * 62], [end[0] + px * 62, end[1] + py * 62]]); c.fillStyle = "rgba(255,221,90,0.5)"; c.fill();
  shape(c, () => ell(c, end[0], end[1], 64, 92), COL.yellow, 5);
  // the small table and the clear glass on it
  shape(c, () => { c.rect(655, 724, 22, 196); }, COL.woodDk, 5); shape(c, () => { c.rect(773, 724, 22, 196); }, COL.woodDk, 5);
  shape(c, () => rrect(c, 640, 700, 170, 26, 6), COL.wood);
  glass(c, 725, 700, 110, 180);
  // the torch, then the child whose hand grips its back end
  c.save(); c.translate(tc[0], tc[1]); c.rotate(an);
  shape(c, () => rrect(c, -60, -20, 95, 40, 12), "#4a4552"); shape(c, () => rrect(c, 22, -28, 38, 56, 8), COL.greyDk); shape(c, () => ell(c, 60, 0, 8, 26), COL.yellow, 5);
  c.restore();
  const s = shoulder(cx, fy, h, true);
  person(c, cx, fy, h, { armR: armTo(h, s[0], s[1], wrist[0], wrist[1], 1) });
};
// flow.p1: a child scatters methi seeds over a tray of damp soil on a table by the window
const flowP1 = (c: Ctx) => {
  ground(c);
  windowFrame(c, 600, 60, 400, 400, 42);
  shape(c, () => { c.rect(440, 826, 24, 154); }, COL.woodDk, 5); shape(c, () => { c.rect(1010, 826, 24, 154); }, COL.woodDk, 5);
  shape(c, () => polyP(c, [[430, 760], [1040, 760], [1060, 790], [410, 790]]), COL.wood);
  shape(c, () => { c.rect(410, 790, 650, 36); }, COL.woodDk);
  shape(c, () => { c.rect(520, 695, 380, 90); }, COL.teal); shade(c, () => { c.rect(520, 695, 380, 90); }, COL.tealDk, 60, 0);
  shape(c, () => polyP(c, [[545, 655], [875, 655], [900, 695], [520, 695]]), COL.soilDk);
  const r = rnd(5); for (let i = 0; i < 16; i++) methi(c, 560 + r() * 310, 664 + r() * 24, 7, r() * 3);
  const cx = 280, fy = 980, h = 620, wrist: [number, number] = [530, 540];
  [[548, 572], [566, 598], [552, 622], [585, 636], [608, 612], [625, 650]].forEach(([x, y], i) => methi(c, x, y, 7, i));
  const s = shoulder(cx, fy, h, true);
  person(c, cx, fy, h, { armR: armTo(h, s[0], s[1], wrist[0], wrist[1], 1) });
};
// term.1 Sprout: a steel spoon of soaked methi seeds with white roots and two small leaves each
const termSprout = (c: Ctx) => {
  ground(c);
  shadow(c, 740, 560, 260, 190);
  shape(c, () => rrect(c, 60, 518, 470, 44, 22), COL.steel); shade(c, () => rrect(c, 60, 518, 470, 44, 22), COL.steelDk, 0, 14);
  shape(c, () => ell(c, 720, 540, 235, 170), COL.steel); shade(c, () => ell(c, 720, 540, 235, 170), COL.steelDk, 70, 20);
  shape(c, () => ell(c, 715, 535, 200, 138), COL.steelIn, 4);
  const S = [[640, 475], [770, 462], [690, 565], [820, 560], [615, 600], [760, 645]];
  S.forEach(([x, y], i) => { const path = () => { c.beginPath(); c.moveTo(x, y + 10); c.quadraticCurveTo(x + 15, y + 50, x + 40 + i * 4, y + 62); }; c.lineCap = "round"; path(); c.strokeStyle = INK; c.lineWidth = 15; c.stroke(); path(); c.strokeStyle = COL.paper; c.lineWidth = 8; c.stroke(); });
  S.forEach(([x, y], i) => seed(c, x, y, 26, 0.3 + i * 0.5, true, "#e9c96a", METHI_DK));
  S.forEach(([x, y], i) => greenSprout(c, x, y - 12, 46 + (i % 2) * 8, (i % 2 ? 8 : -8), 26));
};
// term.2 Wilt: a droopy tulsi in dry soil beside a straight one in damp soil
const termWilt = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 820, D, 260); line(c, [[0, 820], [D, 820]], 5);
  pot(c, 300, 820, 200, 190, DRY);
  line(c, [[250, 630], [280, 640], [300, 628]], 3, "#9c8a66"); line(c, [[330, 640], [360, 630]], 3, "#9c8a66");
  stem(c, [[300, 632], [306, 560], [322, 500], [372, 468], [432, 500], [452, 565]], 8, "#9fb05a");
  const dull = "#8fb064", dv = "#6a8a46";
  tulsiLeaf(c, 310, 565, 2.0, dull, dv); tulsiLeaf(c, 322, 505, 1.45, dull, dv); tulsiLeaf(c, 372, 470, 1.65, dull, dv); tulsiLeaf(c, 430, 500, 1.3, dull, dv); tulsiLeaf(c, 452, 565, 1.5, dull, dv, 50);
  pot(c, 780, 820, 200, 190, COL.soilDk);
  shape(c, () => ell(c, 745, 636, 14, 6), COL.drop, 0); shape(c, () => ell(c, 815, 640, 10, 5), COL.drop, 0);
  stem(c, [[780, 632], [780, 500], [780, 380]], 8, "#7fb55a");
  for (const y of [600, 540, 480, 420]) { tulsiLeaf(c, 780, y, -2.5, COL.leaf, COL.leafDk); tulsiLeaf(c, 780, y, -0.64, COL.leaf, COL.leafDk); }
  tulsiLeaf(c, 780, 380, -Math.PI / 2, COL.leaf, COL.leafDk);
};
// term.3 Sunlight: a beam from the sun through the window onto a pot of methi on the sill
const termSunlight = (c: Ctx) => {
  ground(c);
  windowFrame(c, 140, 50, 800, 540, 58);
  sill(c, 590, 150);
  c.beginPath(); polyP(c, [[250, 236], [346, 140], [660, 560], [430, 560]]); c.fillStyle = "rgba(255,221,90,0.45)"; c.fill();
  pot(c, 540, 735, 220, 170, COL.soilDk);
  const r = rnd(9); const pts: number[][] = []; for (let i = 0; i < 11; i++) pts.push([450 + i * 18 + r() * 8, 562 + (i % 2) * 8]);
  pts.sort((a, b) => a[1] - b[1]); pts.forEach(([x, y], i) => greenSprout(c, x, y, 95 + (i % 3) * 18, (i % 2 ? 1 : -1) * 10, 30));
};
// expl.2: a row of sprouts from yellow (dark) to pale green to bright green, the sun over the green ones
const explGreen = (c: Ctx) => {
  ground(c);
  sun(c, 850, 170, 70);
  shadow(c, 560, 748, 450, 24);
  shape(c, () => { c.rect(100, 660, 880, 80); }, COL.steel); shade(c, () => { c.rect(100, 660, 880, 80); }, COL.steelDk, 0, 30);
  shape(c, () => polyP(c, [[130, 620], [950, 620], [980, 660], [100, 660]]), WET);
  const y = 642;
  yellowSprout(c, 170, y, 250, 55); yellowSprout(c, 265, y, 275, -40); yellowSprout(c, 350, y, 240, 75);
  paleSprout(c, 470, y, 200, 14); paleSprout(c, 560, y, 215, -10); paleSprout(c, 650, y, 195, 18);
  greenSprout(c, 770, y, 160, 5, 40); greenSprout(c, 860, y, 172, -6, 40); greenSprout(c, 935, y, 152, 2, 38);
};
// expl.1: a big green leaf in a beam of sunlight; a small food box (dabba) drawn inside the leaf
const explFood = (c: Ctx) => {
  ground(c);
  sun(c, 170, 170, 75);
  c.beginPath(); polyP(c, [[130, 255], [255, 130], [610, 470], [470, 600]]); c.fillStyle = "rgba(255,221,90,0.45)"; c.fill();
  const x = 250, y = 850, tx = 820, ty = 300, an = Math.atan2(ty - y, tx - x), len = Math.hypot(tx - x, ty - y), nx = -Math.sin(an) * len * 0.3, ny = Math.cos(an) * len * 0.3, mx = (x + tx) / 2, my = (y + ty) / 2;
  shadow(c, mx + 30, my + 40, 300, 250);
  const leafPath = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); };
  shape(c, leafPath, COL.leaf, 7); shade(c, leafPath, COL.leafDk, 40, 40, 0.35);
  c.save(); c.beginPath(); leafPath(); c.clip();
  line(c, [[x, y], [tx - 60, ty + 58]], 5, COL.leafDk);
  for (let k = 1; k <= 4; k++) { const t = k / 5.2, bx = x + (tx - x) * t, by = y + (ty - y) * t; line(c, [[bx, by], [bx + nx * 0.42 + 70, by + ny * 0.42 - 50]], 3, COL.leafDk); line(c, [[bx, by], [bx - nx * 0.42 + 70, by - ny * 0.42 - 50]], 3, COL.leafDk); }
  c.restore();
  shape(c, () => rrect(c, 480, 575, 120, 64, 12), COL.steel, 5); shade(c, () => rrect(c, 480, 575, 120, 64, 12), COL.steelDk, 36, 0);
  shape(c, () => ell(c, 540, 575, 60, 14), COL.steelIn, 5); shape(c, () => ell(c, 540, 566, 10, 6), COL.steel, 4);
};
// term.0 Need: a child drinks from a steel tumbler; a grown-up waters a potted plant
const termNeed = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 940, D, 140); line(c, [[0, 940], [D, 940]], 5);
  // the plant in its pot
  pot(c, 520, 940, 170, 150, COL.soilDk);
  stem(c, [[520, 792], [520, 715], [520, 640]], 8, "#7fb55a");
  for (const y of [760, 715, 672]) { tulsiLeaf(c, 520, y, -2.5, COL.leaf, COL.leafDk); tulsiLeaf(c, 520, y, -0.64, COL.leaf, COL.leafDk); }
  tulsiLeaf(c, 520, 640, -Math.PI / 2, COL.leaf, COL.leafDk);
  // the grown-up and the jug: the handle sits in the hand, the jug tips so its lip is lowest
  const ax = 800, ah = 700, aw: [number, number] = [650, 470];
  c.save(); c.translate(aw[0], aw[1]); c.rotate(-0.55);
  shape(c, () => rrect(c, -130, -60, 110, 120, 18), COL.steel); shade(c, () => rrect(c, -130, -60, 110, 120, 18), COL.steelDk, 40, 0);
  shape(c, () => polyP(c, [[-130, -58], [-156, -72], [-130, -36]]), COL.steel, 5);
  shape(c, () => ell(c, -75, -60, 52, 12), COL.water, 5);
  c.beginPath(); c.moveTo(-24, -40); c.quadraticCurveTo(26, -40, 26, 0); c.quadraticCurveTo(26, 40, -24, 40); c.strokeStyle = INK; c.lineWidth = 24; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.moveTo(-24, -40); c.quadraticCurveTo(26, -40, 26, 0); c.quadraticCurveTo(26, 40, -24, 40); c.strokeStyle = COL.steel; c.lineWidth = 14; c.stroke();
  c.restore();
  const lip = [aw[0] - 165, aw[1] + 19];
  const pour = () => { c.beginPath(); c.moveTo(lip[0], lip[1]); c.quadraticCurveTo(lip[0] - 5, 560, 522, 636); };
  c.lineCap = "round"; pour(); c.strokeStyle = INK; c.lineWidth = 18; c.stroke(); pour(); c.strokeStyle = COL.water; c.lineWidth = 11; c.stroke();
  const as = shoulder(ax, 940, ah, false);
  person(c, ax, 940, ah, { adult: true, armL: armTo(ah, as[0], as[1], aw[0], aw[1], -1) });
  // the child: upper arm down, forearm raised, the tumbler tipped to the mouth
  const cx = 300, ch = 560, elbow = [cx + ch * 0.11, 940 - ch * 0.71 + ch * 0.17], a2 = -1.96, cw = [elbow[0] + Math.cos(a2) * ch * 0.16, elbow[1] + Math.sin(a2) * ch * 0.16];
  person(c, cx, 940, ch, { armR: [Math.PI / 2, a2] });
  c.save(); c.translate(cw[0], cw[1]); c.rotate(-0.35);
  shape(c, () => polyP(c, [[-36, -70], [36, -70], [26, 22], [-26, 22]]), COL.steel); shade(c, () => polyP(c, [[-36, -70], [36, -70], [26, 22], [-26, 22]]), COL.steelDk, 24, 0);
  shape(c, () => ell(c, 0, -70, 36, 9), COL.steelIn, 5);
  c.restore();
  shape(c, () => ell(c, cw[0], cw[1], ch * 0.06 * 0.62, ch * 0.06 * 0.62), SKIN.child, 5);
};

export const ic_plantsWhatPlantsNeedL1 = cards("sci.plants.what-plants-need.L1", [
  setup0, setup1, setup2, // setup.e1.0 .. setup.e1.2
  flowE1, flowA3, flowP1, termSprout, termWilt, termSunlight, explGreen, explFood, termNeed,
]);
