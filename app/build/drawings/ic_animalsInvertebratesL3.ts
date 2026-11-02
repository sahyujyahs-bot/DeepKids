import type { Ctx } from "./core";
import { COL, INK, RED, SKIN, CLOTH, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// INVERTEBRATES L3 · picture cards. Flat DeepKids look. Animals are seen from above, nose to the left:
// ant 6 legs, spider 8, crab 10, centipede many. Red = arrows and circles; no words.

const ANT = "#8a3f2c", ANT_DK = "#5c2618", SPI = "#7a6252", SPI_DK = "#4f3d31", CRB = "#e4523b", CRB_DK = "#b93a27", WRM = "#e8a09a", WRM_DK = "#c9726c";
const STR = "#f08a4b", STR_DK = "#d96a2f", BONE = "#f6efdc", BONE_DK = "#d9cdb0", PAPER = "#fffaf0", PAPER_DK = "#e6d9bb", CEN = "#e8923a", CEN_DK = "#b8691f";

const ring = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 7; c.stroke(); };
const lg = (c: Ctx, pts: number[][], col: string, w = 11) => { line(c, pts, w, INK); line(c, pts, w - 6, col); };
const eye = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE, 3); shape(c, () => ell(c, x - r * 0.15, y, r * 0.45, r * 0.45), INK, 0); };
type Bug = { flip?: boolean; joints?: boolean; nums?: boolean; col?: string; dk?: string };

// ant from above: head, middle, back end; 3 legs each side; 2 feelers
const ant = (c: Ctx, x: number, y: number, s: number, o: Bug = {}) => {
  c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
  const col = o.col ?? ANT, dk = o.dk ?? ANT_DK;
  const L = [[-14, -50, -62, -92, -68], [2, 0, 2, 95, 4], [18, 42, 62, 85, 76]]; // attach x, knee dx, knee dy-ish
  let n = 0;
  for (const sg of [-1, 1]) L.forEach(([ax, kx, , fy, fx]) => {
    const pts = [[ax, sg * 10], [ax + kx, sg * 52], [ax + fx - 4, sg * (fy > 0 ? fy : -fy)]];
    lg(c, pts, col); if (o.joints) ring(c, ax + kx, sg * 52, 15);
    if (o.nums) { n++; write(c, String(n), ax + fx - 14, sg * (fy > 0 ? fy : -fy) + (sg < 0 ? -44 : 12), 30, INK, 5); }
  });
  lg(c, [[-70, -8], [-102, -40], [-136, -34]], col, 10); lg(c, [[-70, 8], [-102, 40], [-136, 34]], col, 10);
  shape(c, () => ell(c, 86, 0, 46, 31), col); shade(c, () => ell(c, 86, 0, 46, 31), dk, 12, 10);
  shape(c, () => ell(c, 4, 0, 28, 20), col); shade(c, () => ell(c, 4, 0, 28, 20), dk, 8, 7);
  shape(c, () => ell(c, -52, 0, 26, 23), col); shade(c, () => ell(c, -52, 0, 26, 23), dk, 8, 7);
  eye(c, -60, -11, 6); eye(c, -60, 11, 6);
  c.restore();
};
// spider from above: 2 body parts, 4 legs each side, no feelers
const spider = (c: Ctx, x: number, y: number, s: number, o: Bug = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const A = [[-42, -88, -70, -128, -48], [-32, -62, -82, -80, -122], [-22, -10, -84, 20, -124], [-12, 30, -70, 82, -94]];
  for (const sg of [-1, 1]) A.forEach(([ax, kx, ky, fx, fy]) => { lg(c, [[ax, sg * 10], [kx, sg * -ky], [fx, sg * -fy]], SPI); if (o.joints) ring(c, kx, sg * -ky, 15); });
  shape(c, () => ell(c, 52, 0, 54, 44), SPI); shade(c, () => ell(c, 52, 0, 54, 44), SPI_DK, 12, 10);
  line(c, [[30, 0], [92, 0]], 7, "#d8b88c");
  shape(c, () => ell(c, -22, 0, 36, 29), SPI); shade(c, () => ell(c, -22, 0, 36, 29), SPI_DK, 9, 8);
  eye(c, -48, -9, 6); eye(c, -48, 9, 6);
  c.restore();
};
// crab from above: carapace, 2 claws, 8 walking legs, eyes on stalks
const crab = (c: Ctx, x: number, y: number, s: number, o: Bug = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const col = o.col ?? CRB, dk = o.dk ?? CRB_DK;
  for (const sg of [-1, 1]) {
    for (let i = 0; i < 4; i++) { const pts = [[sg * 70, -22 + i * 20], [sg * 138, -52 + i * 30], [sg * (150 + i * 4), 8 + i * 38]]; lg(c, pts, col, 12); if (o.joints) ring(c, pts[1][0], pts[1][1], 15); }
    const arm = [[sg * 56, -48], [sg * 112, -112], [sg * 92, -158]]; lg(c, arm, col, 16); if (o.joints) ring(c, arm[1][0], arm[1][1], 17);
    shape(c, () => ell(c, sg * 92, -196, 32, 46, sg * 0.25), col); line(c, [[sg * 92, -240], [sg * 92, -205]], 6);
  }
  shape(c, () => ell(c, 0, 0, 94, 68), col); shade(c, () => ell(c, 0, 0, 94, 68), dk, 14, 12);
  for (const sg of [-1, 1]) { line(c, [[sg * 26, -60], [sg * 28, -86]], 8); eye(c, sg * 28, -92, 12); }
  c.restore();
};
const centipede = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = 0; i < 10; i++) for (const sg of [-1, 1]) lg(c, [[-240 + i * 56, sg * 22], [-236 + i * 56, sg * 56], [-262 + i * 56, sg * 78]], CEN, 10);
  lg(c, [[-310, -10], [-346, -42], [-382, -40]], CEN, 9); lg(c, [[-310, 10], [-346, 42], [-382, 40]], CEN, 9);
  for (let i = 9; i >= 0; i--) { const px = -240 + i * 56; shape(c, () => ell(c, px, 0, 34, 29), i % 2 ? CEN : "#f2a65a"); shade(c, () => ell(c, px, 0, 34, 29), CEN_DK, 7, 7); }
  shape(c, () => ell(c, -300, 0, 32, 28), CEN); eye(c, -312, -10, 6); eye(c, -312, 10, 6);
  c.restore();
};
const cap = (h: number, u: number) => (u < h ? h * Math.sqrt(1 - ((h - u) / h) ** 2) : h);
// an earthworm lying along x: profile gives half thickness (0..1 along the body); rings across; head at the right
const worm = (c: Ctx, x: number, y: number, L: number, prof: (t: number) => number, o: { fill?: string; ringCol?: string; n?: number } = {}) => {
  const N = 90, top: number[][] = [], bot: number[][] = [];
  for (let i = 0; i <= N; i++) { const t = i / N, h = cap(prof(t), Math.min(t, 1 - t) * L); top.push([x + L * t, y - h]); bot.push([x + L * t, y + h]); }
  const path = () => polyP(c, [...top, ...bot.reverse()]);
  shape(c, path, o.fill ?? WRM, 6);
  if (!o.fill) shade(c, path, WRM_DK, 0, 12, 0.5);
  const n = o.n ?? 18;
  for (let k = 1; k < n; k++) { const t = k / n, h = cap(prof(t), Math.min(t, 1 - t) * L) * 0.92; line(c, [[x + L * t, y - h], [x + L * t + 6, y], [x + L * t, y + h]], 4, o.ringCol ?? WRM_DK); }
  return { top, bot };
};
const star = (c: Ctx, cx: number, cy: number, len: number[], rot = -Math.PI / 2, w = 40, o: { col?: string; dk?: string; dots?: boolean } = {}) => {
  const ri = 72, col = o.col ?? STR, dk = o.dk ?? STR_DK, pts: number[][] = [];
  len.forEach((l, i) => { const a = rot + (i * Math.PI * 2) / len.length, na = a + Math.PI / 2, wb = Math.min(w, l * 0.45);
    const P = (r: number, da: number, off: number) => [cx + Math.cos(a + da) * r + Math.cos(na) * off, cy + Math.sin(a + da) * r + Math.sin(na) * off];
    pts.push(P(ri, -0.5, 0), P(l, 0, -wb * 0.5), P(l + 6, 0, 0), P(l, 0, wb * 0.5), P(ri, 0.5, 0)); });
  const path = () => polyP(c, pts); shape(c, path, col, 7); shade(c, path, dk, 10, 12, 0.5);
  if (o.dots !== false) len.forEach((l, i) => { const a = rot + (i * Math.PI * 2) / len.length; for (let k = 0; k < 4; k++) { const r = 40 + ((l - 70) * (k + 0.4)) / 4; if (r < l - 10) shape(c, () => ell(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6, 6), "#ffe9c7", 0); } });
  shape(c, () => ell(c, cx, cy, 14, 14), "#ffe9c7", 4);
};
const bookP = (c: Ctx, x: number, y: number, w: number, col: string) => { shape(c, () => rrect(c, x - w / 2, y - 48, w, 48, 8), col, 6); line(c, [[x - w / 2 + 14, y - 34], [x + w / 2 - 14, y - 34]], 5, WHITE); };

// ------------------------------------------------------------------ flows
// e2: three paper tubes of the same height, each with two books on top
const e2 = (c: Ctx) => {
  ground(c); const gy = 880, H = 400;
  shadow(c, 540, gy + 14, 480, 34);
  // round tube
  let x = 190;
  shape(c, () => { c.moveTo(x - 90, gy - H); c.lineTo(x - 90, gy); c.bezierCurveTo(x - 90, gy + 36, x + 90, gy + 36, x + 90, gy); c.lineTo(x + 90, gy - H); c.closePath(); }, PAPER);
  shade(c, () => { c.moveTo(x - 90, gy - H); c.lineTo(x - 90, gy); c.bezierCurveTo(x - 90, gy + 36, x + 90, gy + 36, x + 90, gy); c.lineTo(x + 90, gy - H); c.closePath(); }, PAPER_DK, -70, 0, 0.7);
  shape(c, () => ell(c, x, gy - H, 90, 28), "#fffdf6", 6);
  // square tube
  x = 540;
  shape(c, () => polyP(c, [[x - 95, gy - H], [x + 55, gy - H], [x + 55, gy], [x - 95, gy]]), PAPER);
  shape(c, () => polyP(c, [[x + 55, gy - H], [x + 105, gy - H - 26], [x + 105, gy - 26], [x + 55, gy]]), PAPER_DK);
  shape(c, () => polyP(c, [[x - 95, gy - H], [x + 55, gy - H], [x + 105, gy - H - 26], [x - 45, gy - H - 26]]), "#fffdf6");
  // zigzag fan
  x = 890; const top: number[][] = []; for (let i = 0; i <= 6; i++) top.push([x - 105 + i * 35, gy - H + (i % 2 ? 22 : -10)]);
  shape(c, () => polyP(c, [...top, [x + 105, gy], [x - 105, gy]]), PAPER);
  for (let i = 0; i < 6; i += 2) shape(c, () => polyP(c, [top[i], top[i + 1], top[i + 2].map((v, k) => (k ? v : v)) as number[], [top[i + 2][0], gy], [top[i + 1][0], gy], [top[i][0], gy]].slice(0, 0).concat([top[i], top[i + 1], [top[i + 1][0], gy], [top[i][0], gy]])), PAPER_DK, 0);
  shape(c, () => polyP(c, [...top, [x + 105, gy], [x - 105, gy]]), "rgba(0,0,0,0)", 6);
  top.forEach((p, i) => { if (i % 2) line(c, [p, [p[0], gy]], 3, INK); });
  // two books on each
  for (const [bx, ty] of [[190, gy - H - 26], [540, gy - H - 26], [890, gy - H - 10]] as number[][]) { bookP(c, bx + (bx === 540 ? 25 : 0), ty, 230, COL.blue); bookP(c, bx + (bx === 540 ? 25 : 0), ty - 48, 210, COL.orange); }
};
// a1: a grown-up runs a finger down the bumps of a bent-over child's back
const a1 = (c: Ctx) => {
  ground(c); shadow(c, 560, 930, 360, 30);
  for (const dx of [0, 46]) { line(c, [[640 + dx, 680], [650 + dx, 900]], 62, INK); line(c, [[640 + dx, 680], [650 + dx, 900]], 52, "#6b5a8c"); shape(c, () => ell(c, 668 + dx, 920, 52, 22), INK, 0); }
  for (const dx of [0, 40]) { line(c, [[420 + dx, 560], [400 + dx, 800]], 56, INK); line(c, [[420 + dx, 560], [400 + dx, 800]], 46, SKIN.child); shape(c, () => ell(c, 398 + dx, 815, 30, 26), SKIN.child, 5); }
  const p = [[650, 650], [420, 530]]; line(c, p, 170, INK); line(c, p, 158, CLOTH.child);
  const nx = 0.46, ny = -0.89; // up the back
  for (let i = 0; i < 8; i++) { const t = 0.12 + i * 0.105, bx = p[0][0] + (p[1][0] - p[0][0]) * t + nx * 70, by = p[0][1] + (p[1][1] - p[0][1]) * t + ny * 70; shape(c, () => ell(c, bx, by, 14, 14), CLOTH.childDk, 4); }
  shape(c, () => ell(c, 330, 600, 80, 84), SKIN.child); shape(c, () => ell(c, 330, 560, 84, 66), CLOTH.hair, 5);
  hand(c, 640, 370, 2.15, 1.25, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[630, 500], [560, 462], [480, 424]], RED, 10);
};
// a2: the ant, big, with its 6 legs counted
const a2 = (c: Ctx) => { ground(c); shadow(c, 560, 640, 400, 60); ant(c, 540, 520, 2.3, { nums: true }); };
// a5: paper armour on the forearm, a towel pushed in beside the arm, the paper splits
const a5 = (c: Ctx) => {
  ground(c); shadow(c, 540, 740, 420, 28);
  shape(c, () => rrect(c, 110, 440, 560, 140, 60), SKIN.child, 6);
  shape(c, () => ell(c, 775, 510, 100, 78), SKIN.child, 6); for (let k = 0; k < 3; k++) line(c, [[800 + k * 12, 460 + k * 22], [860 + k * 8, 465 + k * 22]], 5, SKIN.childDk);
  for (const x of [292, 574]) { shape(c, () => rrect(c, x, 410, 64, 200, 28), "#7ec8c0", 6); line(c, [[x + 18, 430], [x + 18, 590]], 5, "#4f9f98"); line(c, [[x + 42, 430], [x + 42, 590]], 5, "#4f9f98"); }
  const tube = () => rrect(c, 330, 395, 250, 230, 22);
  shape(c, tube, PAPER, 6); shade(c, tube, PAPER_DK, 20, 0, 0.7);
  shape(c, () => polyP(c, [[438, 395], [462, 440], [434, 470], [470, 510], [452, 545], [486, 585], [504, 550], [472, 510], [498, 470], [468, 440], [486, 395]]), "#7ec8c0", 5);
  arrow(c, [[355, 360], [355, 250]], RED, 10); arrow(c, [[555, 660], [555, 770]], RED, 10);
};
// c1: armour plates close together, then slid apart: the armour has grown
const plates = (c: Ctx, y: number, step: number, n: number) => {
  const w = 130, total = w + step * (n - 1), x0 = 540 - total / 2;
  if (step > w) line(c, [[x0 + w / 2, y], [x0 + total - w / 2, y]], 6, "#8a6a3a");
  for (let i = 0; i < n; i++) { const px = x0 + i * step; const pl = () => rrect(c, px, y - 70, w, 140, 30); shape(c, pl, i % 2 ? COL.steel : "#dfe5ec", 6); shade(c, pl, COL.steelDk, 12, 10, 0.45); }
};
const c1 = (c: Ctx) => {
  ground(c); plates(c, 300, 50, 6); plates(c, 780, 160, 6);
  arrow(c, [[540, 420], [540, 600]], RED, 12);
};
// c2: an earthworm crawling forward across a table, 30 cm
const c2 = (c: Ctx) => {
  ground(c); c.fillStyle = "#ecd3a1"; c.fillRect(0, 520, 1080, 560); line(c, [[0, 520], [1080, 520]], 6);
  shadow(c, 520, 700, 340, 24);
  worm(c, 140, 640, 780, (t) => 44 - 12 * Math.sin(t * Math.PI * 3 + 1), { n: 26 });
  arrow(c, [[260, 440], [560, 440], [840, 440]], RED, 12);
  write(c, "30 cm", 360, 800, 100, INK, 10);
  line(c, [[140, 790], [140, 930]], 6); line(c, [[920, 790], [920, 930]], 6);
};
// ------------------------------------------------------------------ terms
const term0 = (c: Ctx) => {
  ground(c); shadow(c, 540, 1000, 240, 22);
  for (const dx of [-60, 60]) { shape(c, () => rrect(c, 540 + dx - 40, 780, 80, 200, 30), SKIN.child, 6); }
  shape(c, () => rrect(c, 440, 690, 200, 140, 30), "#6b5a8c");
  shape(c, () => rrect(c, 380, 380, 36, 290, 18), SKIN.child, 6); shape(c, () => rrect(c, 664, 380, 36, 290, 18), SKIN.child, 6);
  shape(c, () => rrect(c, 400, 320, 280, 400, 80), SKIN.child); shade(c, () => rrect(c, 400, 320, 280, 400, 80), SKIN.childDk, 24, 0, 0.6);
  shape(c, () => rrect(c, 505, 270, 70, 70, 20), SKIN.child, 5);
  shape(c, () => ell(c, 540, 205, 86, 92), CLOTH.hair, 6);
  for (let i = 0; i < 12; i++) { const y = 345 + i * 30, rx = 22 + 8 * Math.sin((i / 11) * Math.PI); shape(c, () => ell(c, 540, y, rx, 12), BONE, 4); }
};
const spool = (c: Ctx, x: number, y: number) => {
  const w = 190, h = 92; shape(c, () => rrect(c, x - w * 0.27, y - h * 0.4, w * 0.54, h * 0.8, 10), BONE_DK, 5);
  shape(c, () => rrect(c, x + w * 0.2, y - 12, 44, 24, 10), BONE, 5);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h * 0.3, 14), BONE, 5); shape(c, () => rrect(c, x - w / 2, y + h * 0.2, w, h * 0.3, 14), BONE, 5);
  shade(c, () => rrect(c, x - w / 2, y + h * 0.2, w, h * 0.3, 14), BONE_DK, 8, 8, 0.8);
};
const term1 = (c: Ctx) => {
  ground(c); shadow(c, 540, 975, 440, 26);
  for (let i = 0; i < 5; i++) spool(c, 330, 900 - i * 100);
  spool(c, 820, 900);
  arrow(c, Array.from({ length: 14 }, (_, k) => { const a = Math.PI * (1.05 - (k / 13) * 0.95); return [575 + Math.cos(a) * 250, 560 + Math.sin(a) * 250 * 0.9]; }), RED, 12);
};
const bottle = (c: Ctx, x: number, y: number) => {
  const body = () => { c.moveTo(x - 46, y - 250); c.lineTo(x + 46, y - 250); c.lineTo(x + 46, y - 210); c.bezierCurveTo(x + 46, y - 160, x + 100, y - 150, x + 100, y - 90); c.lineTo(x + 100, y + 150); c.quadraticCurveTo(x + 100, y + 200, x + 50, y + 200); c.lineTo(x - 50, y + 200); c.quadraticCurveTo(x - 100, y + 200, x - 100, y + 150); c.lineTo(x - 100, y - 90); c.bezierCurveTo(x - 100, y - 150, x - 46, y - 160, x - 46, y - 210); c.closePath(); };
  shadow(c, x + 14, y + 208, 130, 20); shape(c, body, COL.water, 6); shade(c, body, COL.waterDk, 18, 0, 0.6); shine(c, [[x - 70, y - 60], [x - 70, y + 140]], 10);
  shape(c, () => rrect(c, x - 54, y - 296, 108, 48, 10), RED, 6);
};
const term7 = (c: Ctx) => {
  ground(c); shadow(c, 300, 668, 250, 24);
  worm(c, 50, 580, 500, (t) => 66 - 8 * t, { fill: COL.water, ringCol: COL.waterDk, n: 14 });
  bottle(c, 830, 580);
};
const term13 = (c: Ctx) => {
  ground(c); shadow(c, 300, 700, 220, 30); shadow(c, 780, 700, 220, 30);
  ant(c, 355, 560, 1.35, { flip: true }); ant(c, 725, 560, 1.35);
  for (const r of [60, 100, 140]) { c.beginPath(); c.arc(540, 470, r, -Math.PI * 0.9, -Math.PI * 0.1); c.strokeStyle = COL.purple; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
};
const term16 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 500, 500, 390, 390), "#dff0fb", 10);
  c.save(); c.beginPath(); ell(c, 500, 500, 386, 386); c.clip();
  shape(c, () => rrect(c, 380, -20, 240, 1100, 60), "#d9a6e8", 7);
  for (const [sg, y] of [[1, 250], [-1, 400], [1, 560], [-1, 700]] as number[][]) {
    const cx = 500 + sg * 82; shape(c, () => ell(c, cx, y, 40, 54), "#f4d6ff", 6);
    c.beginPath(); for (let a = 0; a < 12; a += 0.4) { const r = 4 + a * 2; c.lineTo(cx + Math.cos(a) * r, y + 8 + Math.sin(a) * r); } c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
    if (y === 400 || y === 560) arrow(c, [[cx + sg * 42, y], [cx + sg * 215, y]], RED, 8);
  }
  c.restore();
  shape(c, () => ell(c, 500, 500, 390, 390), "rgba(0,0,0,0)", 12);
  line(c, [[780, 780], [960, 960]], 40, INK); line(c, [[780, 780], [960, 960]], 26, COL.woodDk);
};
const term17 = (c: Ctx) => {
  ground(c); shadow(c, 290, 960, 150, 22);
  person(c, 290, 940, 700, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.5] });
  c.save(); c.setLineDash([22, 16]); line(c, [[290, 130], [290, 980]], 7, RED); c.restore();
  star(c, 780, 540, [250, 250, 250, 250, 250]);
  c.save(); c.setLineDash([20, 14]); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * Math.PI * 2) / 5; line(c, [[780, 540], [780 + Math.cos(a) * 285, 540 + Math.sin(a) * 285]], 7, RED); } c.restore();
};
const term19 = (c: Ctx) => {
  ground(c); shadow(c, 540, 840, 380, 36);
  star(c, 540, 500, [310, 300, 310, 120, 300], -Math.PI / 2 + 0.2, 60);
  const a = -Math.PI / 2 + 0.2 + (3 * Math.PI * 2) / 5;
  arrow(c, [[540 + Math.cos(a) * 175, 500 + Math.sin(a) * 175 + 20], [540 + Math.cos(a) * 250, 500 + Math.sin(a) * 250 + 20]], RED, 12);
};
const term10 = (c: Ctx) => {
  ground(c);
  ant(c, 300, 270, 1.5, { joints: true }); spider(c, 790, 270, 1.3, { joints: true }); crab(c, 540, 790, 1.3, { joints: true });
};
const term6 = (c: Ctx) => {
  ground(c); shadow(c, 540, 700, 440, 40);
  crab(c, 290, 560, 1.0, { col: "#efe1c6", dk: "#d8c7a3" });
  crab(c, 790, 560, 1.15);
  arrow(c, [[470, 570], [610, 570]], RED, 12);
};
// ------------------------------------------------------------------ explanations
const e2x = (c: Ctx) => {
  ground(c);
  const panel = (y: number) => { shape(c, () => rrect(c, 50, y, 980, 300, 30), "#f7ecd4", 5); };
  [30, 360, 690].forEach(panel);
  worm(c, 120, 180, 820, (t) => (t < 0.45 ? 64 : 64 - ((t - 0.45) / 0.55) * 36), { fill: COL.water, ringCol: COL.waterDk, n: 28 });
  arrow(c, [[640, 80], [760, 80], [900, 80]], RED, 10);
  worm(c, 380, 510, 560, () => 66, { fill: COL.water, ringCol: COL.waterDk, n: 20 });
  arrow(c, [[250, 510], [330, 510]], RED, 10);
  shape(c, () => rrect(c, 70, 850, 940, 120, 14), COL.soil, 0);
  worm(c, 200, 790, 640, () => 54, { fill: COL.water, ringCol: COL.waterDk, n: 22 });
  for (let k = 0; k < 10; k++) { const bx = 260 + k * 60; line(c, [[bx, 838], [bx - 18, 880]], 6, INK); }
  arrow(c, [[300, 725], [500, 725], [700, 725]], RED, 10);
};
const e5x = (c: Ctx) => {
  ground(c);
  ant(c, 290, 230, 1.5); spider(c, 800, 230, 1.3); crab(c, 270, 760, 0.85); centipede(c, 800, 740, 0.75);
  write(c, "6", 265, 440, 70, INK, 9); write(c, "8", 775, 440, 70, INK, 9); write(c, "10", 225, 920, 70, INK, 9); write(c, "30+", 730, 920, 70, INK, 9);
};
export const KEYS = ["flow.e2", "flow.a1", "flow.a2", "flow.a5", "flow.c1", "flow.c2", "term.0", "term.1", "term.7", "term.13", "term.16", "term.17", "term.19", "term.10", "term.6", "expl.2", "expl.5"];
export const ic_animalsInvertebratesL3 = cards("sci.animals.invertebrates.L3 cards", [e2, a1, a2, a5, c1, c2, term0, term1, term7, term13, term16, term17, term19, term10, term6, e2x, e5x]);
