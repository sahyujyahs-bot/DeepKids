import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, glass, ground, line, polyP, rrect, shade, shadow, shape, shine, person, hand, write } from "./flatKit";

// sci.motion.newtons-laws.L3 · picture cards: summary, activities, experiments, terms, explanations.
// Flat DeepKids look; the same child (orange shirt); red arrows = movement; no words.

const PI = Math.PI, FLOOR = "#e6d6b8", DOUGH = "#ecc98a", DOUGHDK = "#cfa468";
const floorBG = (c: Ctx, y: number, col = FLOOR) => { ground(c); c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y); line(c, [[0, y], [1080, y]], 5); };
const dots = (c: Ctx, pts: number[][], w = 9, col = INK) => { c.setLineDash([1, w * 2.4]); line(c, pts, w, col); c.setLineDash([]); };
const curve = (from: number[], ctrl: number[], to: number[], n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * from[0] + 2 * u * t * ctrl[0] + t * t * to[0], u * u * from[1] + 2 * u * t * ctrl[1] + t * t * to[1]]; });
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 30) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
const sock = (c: Ctx, x: number, y: number, rot = 0, s = 1) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); shape(c, () => rrect(c, -50, -26, 100, 52, 26), COL.pink, 6); shape(c, () => rrect(c, -14, -26, 28, 52, 6), WHITE, 5); shape(c, () => rrect(c, -50, -26, 100, 52, 26), "rgba(0,0,0,0)", 6); c.restore(); };
const coin = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.9), COL.yellow, 6); shape(c, () => ell(c, x, y, r * 0.6, r * 0.52), COL.orange, 3); };
const marble = (c: Ctx, x: number, y: number, r: number, a = 1) => { c.globalAlpha = a; shape(c, () => ell(c, x, y, r, r), COL.blue, 5); shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.4, r * 0.4); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.22, r * 0.22), WHITE, 0); c.globalAlpha = 1; };
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.22, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 5); shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.26, y - h * 0.2]], 8);
};
const tray = (c: Ctx, x0: number, x1: number, y: number) => {
  shadow(c, (x0 + x1) / 2 + 20, y + 34, (x1 - x0) / 2, 14);
  shape(c, () => polyP(c, [[x0, y - 14], [x1, y - 14], [x1 - 24, y + 26], [x0 + 24, y + 26]]), COL.steel); shade(c, () => polyP(c, [[x0, y - 14], [x1, y - 14], [x1 - 24, y + 26], [x0 + 24, y + 26]]), COL.steelDk, 0, 14);
};
const toyCar = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => rrect(c, x - w / 2, y - 0.36 * w, w, 0.26 * w, 0.06 * w), COL.red);
  shape(c, () => polyP(c, [[x - 0.28 * w, y - 0.36 * w], [x - 0.2 * w, y - 0.54 * w], [x + 0.18 * w, y - 0.54 * w], [x + 0.3 * w, y - 0.36 * w]]), COL.red);
  shape(c, () => polyP(c, [[x - 0.19 * w, y - 0.38 * w], [x - 0.14 * w, y - 0.5 * w], [x + 0.14 * w, y - 0.5 * w], [x + 0.22 * w, y - 0.38 * w]]), COL.sky, 4);
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * 0.28 * w, y - 0.11 * w, 0.11 * w, 0.11 * w), COL.black); shape(c, () => ell(c, x + s * 0.28 * w, y - 0.11 * w, 0.045 * w, 0.045 * w), COL.steel, 3); }
};
const dough = (c: Ctx, x: number, y: number, s: number, rot = 0, sad = false) => {
  c.save(); c.translate(x, y - 50 * s); c.rotate(rot); c.translate(0, 50 * s);
  shape(c, () => rrect(c, -26 * s, -74 * s, 52 * s, 66 * s, 18 * s), DOUGH, 5); shade(c, () => rrect(c, -26 * s, -74 * s, 52 * s, 66 * s, 18 * s), DOUGHDK, 12 * s, 0);
  for (const d of [-1, 1]) line(c, [[d * 24 * s, -60 * s], [d * 44 * s, -38 * s]], 14 * s, INK), line(c, [[d * 24 * s, -60 * s], [d * 44 * s, -38 * s]], 14 * s - 8, DOUGH);
  shape(c, () => ell(c, 0, -98 * s, 25 * s, 25 * s), DOUGH, 5);
  shape(c, () => ell(c, -8 * s, -102 * s, 3.5 * s, 4.5 * s), INK, 0); shape(c, () => ell(c, 10 * s, -102 * s, 3.5 * s, 4.5 * s), INK, 0);
  c.beginPath(); c.arc(1 * s, -90 * s + (sad ? 8 * s : 0), 8 * s, sad ? PI + 0.4 : 0.3, sad ? -0.4 : PI - 0.3); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
  c.restore();
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { shape(c, () => rrect(c, x, y, w, h, 6), col); shape(c, () => rrect(c, x + w * 0.1, y + h * 0.12, w * 0.8, h * 0.76, 3), COL.paper, 3); };
const armEnd = (x: number, y: number, h: number, a1: number, a2: number): [number, number] => [x + h * 0.11 + Math.cos(a1) * h * 0.17 + Math.cos(a2) * h * 0.16, y - h * 0.74 + h * 0.03 + Math.sin(a1) * h * 0.17 + Math.sin(a2) * h * 0.16];
const lane = (c: Ctx, kind: string, x0: number, y0: number, x1: number, h: number) => {
  const box = () => rrect(c, x0, y0, x1 - x0, h, 10);
  shape(c, box, kind === "towel" ? COL.cloth : kind === "mat" ? COL.brown : kind === "tile" ? COL.steelIn : "#d6ecfa", 6);
  c.save(); c.beginPath(); box(); c.clip();
  if (kind === "towel") for (let x = x0 + 30; x < x1; x += 70) { c.fillStyle = COL.blue; c.globalAlpha = 0.55; c.fillRect(x, y0, 18, h); c.globalAlpha = 1; }
  if (kind === "mat") for (let x = x0 + 14; x < x1; x += 24) line(c, [[x, y0], [x, y0 + h]], 5, COL.soilDk);
  if (kind === "tile") { for (let x = x0 + 120; x < x1; x += 120) line(c, [[x, y0], [x, y0 + h]], 3, COL.steelDk); line(c, [[x0, y0 + h / 2], [x1, y0 + h / 2]], 3, COL.steelDk); }
  if (kind === "ice") for (let x = x0 + 60; x < x1; x += 180) line(c, [[x, y0 + h], [x + 60, y0]], 12, WHITE);
  c.restore(); c.beginPath(); box(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};
const wheel = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.black, 6); shape(c, () => ell(c, x, y, r * 0.55, r * 0.55), COL.steel, 4); shape(c, () => ell(c, x, y, r * 0.15, r * 0.15), COL.steelDk, 3); };
const ball = (c: Ctx, x: number, y: number, r: number, col: string = COL.orange) => { shape(c, () => ell(c, x, y, r, r), col); shade(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0.5)", r * 0.3, r * 0.3, 0.25); shape(c, () => ell(c, x - r * 0.35, y - r * 0.35, r * 0.2, r * 0.2), WHITE, 0); };

// 0 summary: walk, let go of socks above the plate, they land past it; ball on ice in a corner
const summary = (c: Ctx) => {
  floorBG(c, 800);
  const [hx, hy] = armEnd(220, 800, 520, 0.3, 0.1);
  dots(c, curve([hx + 10, hy + 40], [hx + 330, hy + 20], [830, 770]), 10, RED);
  shape(c, () => ell(c, hx, 840, 110, 26), COL.steel); shape(c, () => ell(c, hx, 838, 90, 19), COL.steelIn, 4);
  person(c, 220, 800, 520, { armR: [0.3, 0.1], armL: [PI * 0.5, PI * 0.5] });
  sock(c, hx + 22, hy + 30, 0.3, 0.8);
  sock(c, 840, 775, 0.2, 0.8);
  arrow(c, [[120, 920], [330, 920]]);
  c.save(); c.beginPath(); ell(c, 880, 215, 140, 140); c.clip(); c.fillStyle = "#d6ecfa"; c.fillRect(700, 60, 360, 360); line(c, [[760, 330], [860, 240]], 14, WHITE); line(c, [[900, 380], [1000, 290]], 14, WHITE); c.restore();
  shape(c, () => ell(c, 880, 215, 140, 140), "rgba(0,0,0,0)", 8);
  marble(c, 790, 250, 26); arrow(c, [[830, 250], [990, 250]]);
};
// 1 e1 walking drop: plate under the hand, tape on the floor to where the socks landed
const e1 = (c: Ctx) => {
  floorBG(c, 760);
  const [hx, hy] = armEnd(260, 760, 500, 0.3, 0.1);
  shape(c, () => ell(c, hx, 800, 110, 26), COL.steel); shape(c, () => ell(c, hx, 798, 90, 19), COL.steelIn, 4);
  person(c, 260, 760, 500, { armR: [0.3, 0.1], armL: [PI * 0.5, PI * 0.5] });
  dots(c, curve([hx + 10, hy + 40], [hx + 300, hy + 10], [880, 740]), 10, RED);
  sock(c, hx + 22, hy + 30, 0.3, 0.8); sock(c, 890, 745, 0.2, 0.8);
  shape(c, () => polyP(c, [[hx, 880], [940, 880], [940, 940], [hx, 940]]), COL.yellow, 5);
  for (let x = hx + 40; x < 940; x += 50) line(c, [[x, 880], [x, x % 100 < 50 ? 915 : 905]], 4);
  arrow(c, [[120, 880], [270, 880]]);
};
// 2 e2 eggs: one spins, a hand stops the other
const eggP = (c: Ctx, x: number, y: number, col: string) => { const p = () => ell(c, x, y, 80, 105); shape(c, p, col); shade(c, p, "rgba(0,0,0,0.5)", 22, 10, 0.18); shape(c, () => ell(c, x - 30, y - 45, 14, 24, 0.5), WHITE, 0); };
const e2 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.wood; c.fillRect(0, 720, 1080, 360); line(c, [[0, 720], [1080, 720]], 6);
  shadow(c, 310, 725, 100, 20); shadow(c, 700, 725, 100, 20);
  eggP(c, 310, 620, "#f6e7cf"); eggP(c, 700, 620, "#e8c9a0");
  arrow(c, arc(310, 510, 150, 40, PI * 1.05, PI * 1.9, 20).concat([[460, 500]]).slice(0, 21).concat(arc(310, 510, 150, 40, PI * 1.9, PI * 2.15, 6)), RED, 10);
  hand(c, 910, 640, PI, 1.1, SKIN.child, CLOTH.child, true);
};
// 3 e3 ramp and three floors, marble stops at different distances
const e3 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[60, 120], [250, 120], [250, 960], [60, 960]]), COL.wood, 6);
  for (let y = 180; y < 940; y += 60) line(c, [[100, y], [210, y]], 4, COL.woodDk);
  const rows: [string, number, number][] = [["towel", 150, 480], ["mat", 400, 640], ["tile", 650, 940]];
  for (const [k, y, mx] of rows) { lane(c, k, 250, y, 1030, 200); marble(c, mx, y + 100, 34); arrow(c, [[290, y + 100], [mx - 50, y + 100]]); }
};
// 4 a1 the coin that stays behind
const a1 = (c: Ctx) => {
  floorBG(c, 800);
  tumbler(c, 520, 800, 220, 300);
  hand(c, 250, 480, 0, 1.15, SKIN.child, CLOTH.child, false);
  c.save(); c.translate(790, 470); c.rotate(-0.3); shape(c, () => rrect(c, -110, -11, 220, 22, 4), COL.paper, 5); c.restore();
  arrow(c, [[690, 570], [930, 570]]);
  coin(c, 520, 330, 50); arrow(c, [[520, 395], [520, 470]]);
};
// 5 a2 stir the water, it keeps turning
const a2 = (c: Ctx) => {
  ground(c); c.fillStyle = FLOOR; c.fillRect(0, 760, 1080, 320); line(c, [[0, 760], [1080, 760]], 5);
  shadow(c, 560, 830, 380, 40);
  const bowl = () => { c.moveTo(150, 400); c.bezierCurveTo(170, 860, 910, 860, 930, 400); c.closePath(); };
  shape(c, bowl, COL.steel); shade(c, bowl, COL.steelDk, 80, 0);
  shape(c, () => ell(c, 540, 400, 390, 150), COL.steelIn, 6);
  shape(c, () => ell(c, 540, 410, 340, 118), COL.water, 5); shape(c, () => ell(c, 440, 380, 120, 22), COL.drop, 0);
  [0.4, 1.4, 2.4, 3.4, 4.4, 5.3].forEach((a, i) => shape(c, () => ell(c, 540 + Math.cos(a) * 230, 410 + Math.sin(a) * 78, 22, 10, a), i % 2 ? COL.greenDk : COL.brown, 3));
  arrow(c, arc(540, 410, 160, 52, PI * 0.95, PI * 2.15, 24), RED, 11);
  c.save(); c.translate(900, 880); c.rotate(-0.5); shape(c, () => rrect(c, -170, -9, 170, 18, 9), COL.steel, 5); shape(c, () => ell(c, 30, 0, 52, 30), COL.steel, 5); c.restore();
};
// 6 a4 tumbler on a tray, pushed: the water slops back
const a4 = (c: Ctx) => {
  floorBG(c, 800);
  tray(c, 220, 880, 770);
  const w = 200, h = 270, x = 550, y = 756;
  shadow(c, x + 20, y + 8, 110, 20);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, () => polyP(c, [[x - 84, y - 190], [x + 80, y - 90], [x + w * 0.4 - 3, y - 3], [x - w * 0.4 + 3, y - 3]]), COL.water, 0);
  shape(c, body, COL.glass, 5); line(c, [[x - 84, y - 190], [x + 80, y - 90]], 7, COL.waterDk);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.08), "rgba(255,255,255,0.35)", 5);
  hand(c, 110, 770, 0, 0.9, SKIN.child, CLOTH.child, true);
  arrow(c, [[300, 900], [760, 900]]);
};
// 7 a5 toss a ball in a moving train
const a5 = (c: Ctx) => {
  ground(c, "#c9d8e6"); c.fillStyle = "#dfe5ec"; c.fillRect(0, 0, 1080, 800); c.fillStyle = FLOOR; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  shape(c, () => rrect(c, 560, 120, 420, 340, 24), COL.sky, 8);
  c.save(); c.beginPath(); rrect(c, 560, 120, 420, 340, 24); c.clip();
  c.fillStyle = COL.greenLt; c.fillRect(560, 340, 420, 120);
  for (const px of [650, 860]) { line(c, [[px, 440], [px + 10, 280]], 14, COL.brown); for (const a of [-2.6, -1.9, -1.2, -0.5]) leafP(c, px + 10, 280, 70, a); }
  for (const yy of [200, 250, 300, 390]) line(c, [[580, yy], [600 + (yy % 3) * 40, yy]], 6, WHITE), line(c, [[900, yy + 15], [950, yy + 15]], 6, WHITE);
  c.restore();
  shape(c, () => rrect(c, 560, 120, 420, 340, 24), "rgba(0,0,0,0)", 8);
  person(c, 330, 800, 470, { armR: [-1.3, -1.45], armL: [PI * 0.5, PI * 0.5] });
  const [hx, hy] = armEnd(330, 800, 470, -1.3, -1.45);
  ball(c, hx + 6, hy - 105, 34); arrow(c, [[hx + 6, hy - 30], [hx + 6, hy - 65]]);
  arrow(c, [[180, 930], [420, 930]]);
};
const leafP = (c: Ctx, x: number, y: number, len: number, an: number) => { const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len; shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo((x + tx) / 2 - 12, (y + ty) / 2 + 22, tx, ty + 24); c.quadraticCurveTo((x + tx) / 2, (y + ty) / 2 - 10, x, y); }, COL.leaf, 4); };
// slope with books, a toy car at the bottom and a book wall
const slopeScene = (c: Ctx, n: number, band: boolean, flying: boolean) => {
  floorBG(c, 880);
  const top = 880 - 62 * n - 22;
  for (let i = 0; i < n; i++) book(c, 50, 880 - 62 * (i + 1), 230, 62, [COL.blue, COL.green, COL.orange, COL.purple][i % 4]);
  const x0 = 60, x1 = 760, y1 = 862, th = Math.atan2(y1 - top, x1 - x0);
  c.save(); c.translate(x0, top); c.rotate(th); shape(c, () => rrect(c, 0, -11, Math.hypot(x1 - x0, y1 - top), 22, 6), COL.wood, 6); c.restore();
  book(c, 820, 600, 100, 280, COL.red);
  const cx = 690, cy = top + (cx - x0) * Math.tan(th) - 11;
  c.save(); c.translate(cx, cy); c.rotate(th);
  toyCar(c, 0, 0, 220);
  if (!flying) { dough(c, 20, -85, 1.5, 0); if (band) { line(c, [[-34, -135], [76, -135]], 14, INK); line(c, [[-34, -135], [76, -135]], 8, COL.blueDk); } }
  c.restore();
  if (flying) { dough(c, 920, 500, 1.5, 1.0, true); arrow(c, curve([740, 480], [780, 380], [850, 360]), RED, 10); }
  if (!flying) arrow(c, [[300, 340], [520, 450]]);
};
const a6 = (c: Ctx) => slopeScene(c, 2, false, true);
const c1 = (c: Ctx) => slopeScene(c, 3, true, false);
// 9 a7 swing a sock on a string and let go (side view)
const a7 = (c: Ctx) => {
  floorBG(c, 820);
  person(c, 300, 820, 540, { armR: [-0.9, -1.5], armL: [PI * 0.5, PI * 0.5] });
  const [hx, hy] = armEnd(300, 820, 540, -0.9, -1.5);
  c.setLineDash([]); line(c, arc(hx, hy, 190, 50, 0, PI * 2), 5, COL.greyDk);
  line(c, [[hx, hy], [hx + 190, hy]], 6, INK); sock(c, hx + 190, hy, 0, 0.7);
  arrow(c, arc(hx, hy, 190, 50, 0.3, 1.7, 10), RED, 9);
  dots(c, [[hx + 240, hy], [hx + 400, hy]], 9, RED); sock(c, hx + 450, hy, 0, 0.7);
};
// 10 p1 balloon hover puck
const p1 = (c: Ctx) => {
  floorBG(c, 800);
  shadow(c, 540, 820, 320, 30);
  shape(c, () => ell(c, 540, 748, 300, 82), COL.steelDk, 6);
  shape(c, () => { c.moveTo(240, 730); c.lineTo(240, 748); c.bezierCurveTo(300, 840, 780, 840, 840, 748); c.lineTo(840, 730); c.closePath(); }, COL.steelDk, 0);
  shape(c, () => ell(c, 540, 728, 300, 82), COL.steel, 6); shape(c, () => ell(c, 540, 728, 90, 24), COL.steelIn, 4);
  shape(c, () => rrect(c, 505, 650, 70, 70, 10), COL.teal, 5); shape(c, () => ell(c, 540, 650, 35, 10), COL.tealDk, 4);
  const bal = () => { c.moveTo(540, 650); c.bezierCurveTo(330, 590, 330, 170, 540, 170); c.bezierCurveTo(750, 170, 750, 590, 540, 650); c.closePath(); };
  shape(c, bal, COL.red); shade(c, bal, "#a83a28", 40, 0, 0.5); shape(c, () => ell(c, 460, 290, 22, 55, 0.3), WHITE, 0);
  arrow(c, [[500, 810], [310, 810]], RED, 9); arrow(c, [[580, 810], [770, 810]], RED, 9);
};
// 11 c2 longest glide
const c2 = (c: Ctx) => {
  ground(c); c.fillStyle = COL.steelIn; c.fillRect(0, 520, 1080, 560); line(c, [[0, 520], [1080, 520]], 6);
  for (let x = -40; x < 1100; x += 200) line(c, [[x, 520], [x - 120, 1080]], 3, COL.steelDk);
  for (const y of [680, 860]) line(c, [[0, y], [1080, y]], 3, COL.steelDk);
  shadow(c, 560, 830, 130, 20);
  shape(c, () => rrect(c, 460, 700, 200, 100, 16), COL.teal); shade(c, () => rrect(c, 460, 700, 200, 100, 16), COL.tealDk, 0, 30);
  for (const x of [510, 610]) shape(c, () => ell(c, x, 805, 22, 22), COL.black, 5);
  shape(c, () => rrect(c, 160, 740, 300, 26, 6), COL.wood, 6); for (let x = 200; x < 440; x += 36) line(c, [[x, 740], [x, 758]], 4);
  hand(c, 110, 753, 0, 0.8, SKIN.child, CLOTH.child, false);
  arrow(c, [[720, 750], [1030, 750]], RED, 12);
};
// 12 Force: a push and a pull
const rope = (c: Ctx, pts: number[][]) => { line(c, pts, 12, INK); line(c, pts, 6, COL.brown); };
const tForce = (c: Ctx) => {
  ground(c);
  line(c, [[0, 520], [1080, 520]], 5); line(c, [[0, 980], [1080, 980]], 5); c.fillStyle = FLOOR; c.fillRect(0, 521, 1080, 6); 
  hand(c, 150, 430, 0, 1.0, SKIN.child, CLOTH.child, true);
  shape(c, () => rrect(c, 300, 340, 190, 180, 12), COL.wood); shape(c, () => rrect(c, 320, 360, 150, 60, 8), COL.woodDk, 4);
  arrow(c, [[560, 430], [860, 430]]);
  shape(c, () => rrect(c, 520, 800, 240, 170, 14), COL.teal); shade(c, () => rrect(c, 520, 800, 240, 170, 14), COL.tealDk, 0, 40);
  for (const x of [570, 710]) wheel(c, x, 975, 28);
  rope(c, [[520, 880], [300, 880]]);
  hand(c, 180, 880, PI, 1.0, SKIN.child, CLOTH.child, false);
  arrow(c, [[300, 780], [80, 780]]);
};
// 13 Motion: auto-rickshaw with three faint copies behind
const auto = (c: Ctx, x: number, y: number) => {
  c.save(); c.translate(x, y); c.scale(0.7, 0.7); x = 0; y = 0;
  shadow(c, x, y + 4, 200, 20);
  shape(c, () => polyP(c, [[x - 170, y - 60], [x - 170, y - 190], [x + 90, y - 190], [x + 170, y - 110], [x + 170, y - 60]]), COL.yellow);
  shape(c, () => rrect(c, x - 150, y - 284, 220, 94, 6), COL.black, 5);
  shape(c, () => polyP(c, [[x + 70, y - 284], [x + 135, y - 200], [x + 70, y - 190]]), COL.sky, 5);
  shape(c, () => rrect(c, x - 170, y - 322, 260, 40, 20), "#2f6f3a", 5);
  wheel(c, x - 100, y - 44, 44); wheel(c, x + 120, y - 44, 44);
  c.restore();
};
const tMotion = (c: Ctx) => {
  floorBG(c, 780, "#cfc7b8");
  c.globalAlpha = 0.18; auto(c, 200, 780); c.globalAlpha = 0.32; auto(c, 430, 780); c.globalAlpha = 0.55; auto(c, 660, 780); c.globalAlpha = 1;
  auto(c, 890, 780); arrow(c, [[400, 920], [800, 920]]);
};
// 14 At rest
const tRest = (c: Ctx) => {
  ground(c); c.fillStyle = COL.wood; c.fillRect(0, 740, 1080, 340); line(c, [[0, 740], [1080, 740]], 6);
  for (const y of [830, 920, 1010]) line(c, [[0, y], [1080, y]], 3, COL.woodDk);
  tumbler(c, 540, 760, 300, 420);
};
// 15 Inertia: passengers lean forward when the bus brakes
const lean = (c: Ctx, px: number, py: number, a: number, f: () => void) => { c.save(); c.translate(px, py); c.rotate(a); c.translate(-px, -py); f(); c.restore(); };
const tInertia = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 160, 980, 670, 50), COL.yellow, 7);
  shape(c, () => rrect(c, 90, 220, 900, 380, 20), COL.sky, 6);
  c.fillStyle = "#e9dcc2"; c.fillRect(80, 690, 920, 100);
  shape(c, () => rrect(c, 80, 600, 920, 190, 0), "#cdbf9f", 0);
  line(c, [[90, 305], [990, 305]], 12, INK); line(c, [[90, 305], [990, 305]], 6, COL.steel);
  wheel(c, 250, 830, 78); wheel(c, 810, 830, 78);
  for (const px of [380, 690]) lean(c, px, 780, 0.2, () => person(c, px, 780, 440, { armR: [-1.15, -1.5], armL: [-1.15, -1.5], adult: px > 500 }));
  arrow(c, [[480, 940], [800, 940]]);
};
// 16 Newton's first law: puck on an air hockey table
const tFirst = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[60, 760], [1020, 760], [1020, 880], [60, 880]]), COL.tealDk, 6);
  shape(c, () => polyP(c, [[110, 390], [970, 390], [1050, 760], [30, 760]]), COL.teal, 6);
  line(c, [[540, 390], [540, 760]], 6, WHITE); shape(c, () => ell(c, 540, 575, 80, 60), "rgba(0,0,0,0)", 6);
  shadow(c, 450, 640, 90, 20);
  shape(c, () => ell(c, 450, 618, 66, 26), "#8a1f1a", 6); shape(c, () => ell(c, 450, 598, 66, 26), COL.red, 6);
  shape(c, () => ell(c, 250, 600, 74, 28), COL.black, 6); shape(c, () => ell(c, 250, 580, 40, 15), COL.steel, 5);
  hand(c, 80, 570, 0.05, 0.9, SKIN.child, CLOTH.child, false);
  arrow(c, [[560, 598], [980, 598]], RED, 12);
};
// 17 Law of science: a notebook with a rule and many ticks
const tick = (c: Ctx, x: number, y: number) => line(c, [[x - 22, y], [x - 6, y + 20], [x + 24, y - 24]], 9, COL.greenDk);
const tLaw = (c: Ctx) => {
  ground(c); shadow(c, 560, 880, 460, 40);
  shape(c, () => rrect(c, 70, 190, 470, 680, 18), COL.paper, 6); shape(c, () => rrect(c, 540, 190, 470, 680, 18), COL.paper, 6);
  line(c, [[540, 190], [540, 870]], 6);
  line(c, [[130, 300], [470, 300]], 14, COL.red); line(c, [[130, 380], [450, 380]], 8); line(c, [[130, 450], [470, 450]], 8); line(c, [[130, 520], [400, 520]], 8);
  for (let i = 0; i < 6; i++) { const y = 290 + i * 100; line(c, [[620, y + 30], [940, y + 30]], 4, COL.grey); tick(c, 660, y); }
};
// 18 Friction: a marble slows on a towel
const tFriction = (c: Ctx) => {
  ground(c);
  lane(c, "towel", 40, 430, 1040, 320);
  for (let x = 80; x < 1020; x += 50) for (const y of [470, 560, 650, 710]) c.beginPath(), c.arc(x + (y % 100) / 4, y, 8, PI, 0), c.strokeStyle = COL.grey, c.lineWidth = 4, c.stroke();
  [[150, .25], [300, .4], [430, .55], [540, .75]].forEach(([x, a]) => marble(c, x, 590, 46, a));
  marble(c, 700, 590, 46);
  arrow(c, [[760, 830], [560, 830]], RED, 10);
};
// 19 Air resistance: paper drifting down with air arrows pushing up
const tAir = (c: Ctx) => {
  ground(c, "#d6ecfa");
  c.save(); c.translate(540, 400); c.rotate(-0.2);
  shape(c, () => polyP(c, [[-250, -30], [220, -70], [250, 40], [-220, 90]]), WHITE, 6); shade(c, () => polyP(c, [[-250, -30], [220, -70], [250, 40], [-220, 90]]), "#c9d1dc", 0, 40, 0.5);
  for (let i = 0; i < 3; i++) line(c, [[-170 + i * 10, -5 + i * 30 - i * 5], [140 + i * 10, -30 + i * 30]], 5, COL.grey);
  c.restore();
  for (const x of [280, 420, 560, 700, 820]) arrow(c, [[x, 810], [x - 12, 600]], RED, 10);
  for (const x of [180, 900]) { line(c, curve([x, 860], [x + 30, 760], [x, 650]), 6, WHITE); }
};
// 20 Mass: an empty can pushed easily, a full can with effort
const wcan = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + 6, w * 0.6, 14);
  shape(c, () => rrect(c, x, y - h, w, h, 14), COL.blue); shade(c, () => rrect(c, x, y - h, w, h, 14), COL.blueDk, w * 0.2, 0);
  shape(c, () => rrect(c, x + w * 0.62, y - h - 22, w * 0.2, 28, 6), COL.blueDk, 5);
  shape(c, () => rrect(c, x + w * 0.12, y - h * 0.8, w * 0.3, h * 0.45, 10), "rgba(255,255,255,0.35)", 4);
};
const tMass = (c: Ctx) => {
  floorBG(c, 820); line(c, [[540, 0], [540, 820]], 4, COL.grey);
  person(c, 115, 820, 400, { armR: [0.15, 0.05], armL: [0.15, 0.05] }); wcan(c, 295, 820, 130, 130); arrow(c, [[450, 690], [510, 690]], RED, 10); arrow(c, [[450, 740], [510, 740]], RED, 10);
  lean(c, 640, 820, 0.14, () => person(c, 640, 820, 400, { armR: [0.15, 0.05], armL: [0.15, 0.05] }));
  wcan(c, 825, 820, 210, 280); arrow(c, [[780, 960], [880, 960]], RED, 10);
};
// 21 Speed: a girl on a cycle passing a distance sign
const tSpeed = (c: Ctx) => {
  floorBG(c, 820, "#cfc7b8");
  for (let x = 40; x < 1060; x += 160) line(c, [[x, 900], [x + 70, 900]], 8, WHITE);
  line(c, [[900, 820], [900, 380]], 16, INK); line(c, [[900, 820], [900, 380]], 9, COL.steel);
  shape(c, () => rrect(c, 780, 220, 240, 190, 14), COL.green, 6); write(c, "10", 840, 262, 90, WHITE, 11);
  wheel(c, 250, 740, 90); wheel(c, 560, 740, 90);
  const fr = [[250, 740], [380, 740], [330, 590], [250, 740]]; line(c, fr, 12, INK); line(c, fr, 6, COL.red); line(c, [[380, 740], [520, 590], [330, 590]], 12, INK); line(c, [[380, 740], [520, 590], [330, 590]], 6, COL.red); line(c, [[520, 590], [560, 740]], 12, INK); line(c, [[520, 590], [560, 740]], 6, COL.red);
  line(c, [[300, 570], [370, 570]], 14, INK); line(c, [[510, 590], [500, 520], [540, 510]], 12, INK);
  const hx = 380, hy = 520;
  line(c, [[hx, hy], [440, 640], [400, 740]], 40, INK); line(c, [[hx, hy], [440, 640], [400, 740]], 28, "#6b5a8c");
  shape(c, () => rrect(c, 320, 330, 120, 220, 40), CLOTH.child); shade(c, () => rrect(c, 320, 330, 120, 220, 40), CLOTH.childDk, 30, 0);
  line(c, [[420, 380], [500, 450], [545, 515]], 34, INK); line(c, [[420, 380], [500, 450], [545, 515]], 22, CLOTH.child); shape(c, () => ell(c, 548, 516, 20, 20), SKIN.child, 5);
  const hX = 400, hY = 250;
  shape(c, () => ell(c, hX, hY, 70, 74), SKIN.child); shape(c, () => { c.moveTo(hX - 72, hY); c.bezierCurveTo(hX - 70, hY - 110, hX + 70, hY - 110, hX + 72, hY); c.quadraticCurveTo(hX, hY - 40, hX - 72, hY); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, hX - 70, hY + 10, 28, 42), CLOTH.hair, 4);
  shape(c, () => ell(c, hX + 28, hY + 6, 7, 10), INK, 0); c.beginPath(); c.arc(hX + 30, hY + 28, 20, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  for (const y of [350, 440, 540]) line(c, [[40, y], [190 - (y % 3) * 20, y]], 7, COL.grey);
};
// 22 Direction: a cricket ball flying towards cupped hands
const tDirection = (c: Ctx) => {
  floorBG(c, 900, "#9ccf62");
  for (const y of [490, 560, 630]) line(c, [[60, y], [150 + (y % 3) * 10, y]], 7, COL.grey);
  shadow(c, 360, 640, 80, 14);
  ball(c, 360, 540, 80, "#c0392b"); line(c, arc(360, 540, 62, 62, 2.3, 3.9, 10).map(([x, y]) => [x + 30, y]), 5, WHITE);
  line(c, arc(360, 540, 80, 80, -0.5, 0.5, 8).map(([x, y]) => [x - 140, y - 20]), 0.1, WHITE);
  arrow(c, [[470, 540], [760, 540]], RED, 12);
  hand(c, 930, 470, PI, 1.2, SKIN.child, CLOTH.child, true); hand(c, 930, 590, PI, 1.2, SKIN.child, CLOTH.child, true);
};
// 23 Seatbelt: a girl in a car seat with the belt across
const tSeatbelt = (c: Ctx) => {
  ground(c, "#c9d8e6");
  shape(c, () => rrect(c, 40, 80, 1000, 480, 30), COL.sky, 8);
  shape(c, () => rrect(c, 40, 560, 1000, 460, 20), COL.blueDk, 8);
  shape(c, () => rrect(c, 120, 150, 230, 600, 40), COL.teal); shade(c, () => rrect(c, 120, 150, 230, 600, 40), COL.tealDk, 40, 0);
  shape(c, () => rrect(c, 130, 700, 650, 120, 30), COL.teal); shade(c, () => rrect(c, 130, 700, 650, 120, 30), COL.tealDk, 0, 40);
  person(c, 420, 715, 620, { sit: true, armR: [PI * 0.45, 0.3], armL: [PI * 0.45, 0.3] });
  const sx = 345, sy = 330, hx = 600, hy = 690;
  line(c, [[sx - 40, 160], [sx + 10, sy], [450, 560], [hx - 20, hy - 20]], 40, INK); line(c, [[sx - 40, 160], [sx + 10, sy], [450, 560], [hx - 20, hy - 20]], 28, COL.grey);
  line(c, [[hx - 20, hy - 20], [190, 706]], 30, INK); line(c, [[hx - 20, hy - 20], [190, 706]], 18, COL.grey);
  shape(c, () => rrect(c, 410, 530, 60, 70, 10), COL.orange, 5);
};
// 24 carrom tower, bottom coin knocked out
const coinSide = (c: Ctx, x: number, y: number, w: number, col: string) => { shape(c, () => rrect(c, x - w / 2, y - 36, w, 36, 18), col, 5); line(c, [[x - w / 2 + 24, y - 18], [x + w / 2 - 24, y - 18]], 4, col === COL.black ? COL.grey : COL.greyDk); };
const eTower = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 800, 1000, 80, 12), COL.wood, 6); shape(c, () => rrect(c, 40, 800, 1000, 20, 6), COL.woodDk, 4);
  [COL.black, "#fffaf0", COL.black, COL.red, "#fffaf0"].forEach((col, i) => coinSide(c, 360, 800 - i * 36, 250, col));
  arrow(c, [[360, 400], [360, 500]], RED, 10);
  coinSide(c, 810, 800, 250, COL.black);
  arrow(c, [[690, 720], [960, 720]], RED, 10);
};
// 25 four floors: towel, mat, tiles, ice
const eFloors = (c: Ctx) => {
  ground(c);
  const rows: [string, number, number][] = [["towel", 60, 430], ["mat", 300, 600], ["tile", 540, 800], ["ice", 780, 990]];
  line(c, [[170, 40], [170, 1040]], 6, RED);
  for (const [k, y, mx] of rows) { lane(c, k, 100, y, 1050, 200); marble(c, mx, y + 100, 34); arrow(c, [[200, y + 100], [mx - 50, y + 100]]); }
};
// 26 turning needs a force: top view, sock leaves along a straight line
const eTurn = (c: Ctx) => {
  ground(c, "#efe4cf");
  line(c, arc(500, 520, 230, 230, 0, PI * 2), 5, COL.grey);
  shape(c, () => ell(c, 330, 540, 95, 50), CLOTH.child, 6);
  shape(c, () => ell(c, 330, 545, 55, 58), SKIN.child, 6); shape(c, () => ell(c, 330, 548, 50, 52), CLOTH.hair, 0);
  line(c, [[400, 520], [450, 520]], 24, INK); line(c, [[400, 520], [450, 520]], 14, CLOTH.child); shape(c, () => ell(c, 460, 520, 20, 20), SKIN.child, 5);
  const sx = 500 + Math.cos(-0.5) * 230 - 40, sy = 520 + Math.sin(-0.5) * 230;
  line(c, [[460, 520], [sx, sy]], 6, INK);
  arrow(c, arc(500, 520, 230, 230, -2.0, -0.85, 12), RED, 9);
  dots(c, [[sx, sy], [sx + 0.479 * 330, sy + 0.878 * 330]], 10, RED);
  sock(c, sx, sy, 0.5, 0.75); sock(c, sx + 0.479 * 340, sy + 0.878 * 340, 0.5, 0.75);
};
// 27 more mass: a cycle and a loaded lorry braking on the same road, the lorry with a much longer brake mark
const roadRow = (c: Ctx, y: number) => { shape(c, () => rrect(c, 0, y, 1080, 70, 0), "#9a948a", 5); };
const eMass = (c: Ctx) => {
  ground(c);
  roadRow(c, 440); roadRow(c, 900);
  line(c, [[640, 475], [840, 475]], 16, COL.black);
  wheel(c, 760, 440 - 62, 62); wheel(c, 960, 440 - 62, 62);
  const fr = [[760, 378], [850, 378], [810, 300], [760, 378]]; line(c, fr, 14, INK); line(c, fr, 7, COL.red);
  line(c, [[850, 378], [930, 300], [810, 300]], 14, INK); line(c, [[850, 378], [930, 300], [810, 300]], 7, COL.red); line(c, [[960, 378], [930, 300], [940, 270]], 12, INK);
  line(c, [[790, 285], [830, 285]], 14, INK);
  line(c, [[130, 935], [790, 935]], 16, COL.black);
  shape(c, () => rrect(c, 200, 560, 520, 270, 14), COL.orange); shade(c, () => rrect(c, 200, 560, 520, 270, 14), "#c97c1f", 0, 60);
  for (const [x, y] of [[250, 520], [380, 510], [510, 520], [620, 515]]) shape(c, () => rrect(c, x, y, 110, 80, 30), "#d8b97a", 5);
  shape(c, () => polyP(c, [[720, 650], [850, 650], [930, 740], [930, 830], [720, 830]]), COL.blue); shape(c, () => polyP(c, [[745, 670], [840, 670], [895, 735], [745, 735]]), COL.sky, 4);
  wheel(c, 330, 900 - 70, 70); wheel(c, 640, 900 - 70, 70); wheel(c, 850, 900 - 70, 70);
};
// 28 seatbelt: the car stops, the dough person flies on; with a rubber band it stays
const eBelt = (c: Ctx) => {
  ground(c);
  line(c, [[0, 470], [1080, 470]], 5); line(c, [[0, 930], [1080, 930]], 5); line(c, [[0, 520], [1080, 520]], 0.1);
  book(c, 700, 290, 110, 180, COL.blue); book(c, 700, 750, 110, 180, COL.blue);
  toyCar(c, 560, 470, 270); dough(c, 930, 330, 1.3, 1.1, true); arrow(c, curve([640, 250], [760, 150], [860, 220]), RED, 10);
  toyCar(c, 560, 930, 270); dough(c, 540, 860, 1.1, 0);
  line(c, [[500, 800], [590, 800]], 16, INK); line(c, [[500, 800], [590, 800]], 9, COL.blueDk);
};

export const ic_motionNewtonsLawsL3 = cards("sci.motion.newtons-laws.L3 cards", [
  summary, e1, e2, e3, a1, a2, a4, a5, a6, a7, p1, c1, c2,
  tForce, tMotion, tRest, tInertia, tFirst, tLaw, tFriction, tAir, tMass, tSpeed, tDirection, tSeatbelt,
  eTower, eFloors, eTurn, eMass, eBelt,
]);
