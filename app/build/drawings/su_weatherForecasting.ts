import type { Ctx } from "./core";
import { D, INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shade, shine, line, arrow, plate, hand, person, write, cards } from "./flatKit";

// SCIENCE UNIT sci.weather.forecasting.L3 · ten set-up cards (flat kit): score-sheet notebook, sky watching,
// salt on plates in steam and dry air, wind ribbon, cloud against a building, compass page.

// ---------------------------------------------------------------- shared pieces
// a puffy cloud: ink outline round the whole shape, a shade tone along the bottom
const cloud = (c: Ctx, x: number, y: number, s: number, col: string = WHITE, dk = "#cdd9e8", dashed = false) => {
  const cs = [[-1.0, 0.25, 0.55], [-0.45, -0.15, 0.75], [0.35, -0.25, 0.85], [1.0, 0.15, 0.6], [0, 0.35, 0.7]];
  const all = () => cs.forEach(([dx, dy, r]) => { c.moveTo(x + dx * s + r * s, y + dy * s); c.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); });
  c.beginPath(); all(); c.fillStyle = INK; c.fill(); c.strokeStyle = INK; c.lineWidth = Math.max(8, s * 0.14); c.lineJoin = "round"; if (dashed) c.setLineDash([16, 14]); c.stroke(); c.setLineDash([]);
  c.beginPath(); all(); c.fillStyle = col; c.fill();
  c.save(); c.beginPath(); all(); c.clip(); c.beginPath(); ell(c, x + 0.3 * s, y + 1.15 * s, 2.3 * s, 0.7 * s); c.fillStyle = dk; c.fill(); c.restore();
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], Math.max(5, r * 0.16), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.1));
};
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - s * 1.5); c.quadraticCurveTo(x + s * 1.1, y, x + s * 0.8, y + s * 0.5); c.arc(x, y + s * 0.5, s * 0.8, 0, Math.PI); c.quadraticCurveTo(x - s * 1.1, y, x, y - s * 1.5); c.closePath(); }, COL.water, Math.max(3, s * 0.2));

// a pencil lying along +x in local space: eraser at x=-22, tip at x=L
const pencilObj = (c: Ctx, L = 190) => {
  const w = 30;
  shape(c, () => rrect(c, -22, -w / 2, 28, w, 5), COL.pink, 5);
  shape(c, () => rrect(c, 4, -w / 2, 18, w, 2), COL.steel, 5);
  shape(c, () => rrect(c, 22, -w / 2, L * 0.72, w, 3), COL.yellow, 5);
  line(c, [[28, w * 0.28], [22 + L * 0.72 - 6, w * 0.28]], 5, COL.woodDk);
  shape(c, () => polyP(c, [[22 + L * 0.72, -w / 2], [L + 22, 0], [22 + L * 0.72, w / 2]]), COL.wood, 5);
  shape(c, () => polyP(c, [[L + 2, -w * 0.13], [L + 22, 0], [L + 2, w * 0.13]]), COL.black, 3);
};
// hold something in a hand: obj is drawn in the hand's own space (along +x from the wrist), then the hand over it
const holding = (c: Ctx, wx: number, wy: number, an: number, s: number, obj: (c: Ctx) => void, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(wx, wy); c.rotate(an); c.scale(s, s); obj(c); c.restore();
  hand(c, wx, wy, an, s, skin, sleeve);
};
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s * 0.55, y], [x - s * 0.15, y + s * 0.45], [x + s * 0.6, y - s * 0.5]], Math.max(8, s * 0.3), COL.greenDk);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s * 0.5, y - s * 0.5], [x + s * 0.5, y + s * 0.5]], Math.max(8, s * 0.3), RED); line(c, [[x + s * 0.5, y - s * 0.5], [x - s * 0.5, y + s * 0.5]], Math.max(8, s * 0.3), RED); };

// the notebook page and the score table (day number column + four columns), used by the first four cards
const notebookPage = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => {
  c.beginPath(); rrect(c, x0 + 14, y0 + 18, x1 - x0, y1 - y0, 18); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, x0, y0, x1 - x0, y1 - y0, 18), COL.paper, 6);
  for (let y = y0 + 60; y < y1 - 30; y += 80) shape(c, () => ell(c, x0 + 34, y, 11, 11), BG, 3.5);
};
const XS = [150, 220, 390, 560, 730, 900], CX = [305, 475, 645, 815];
// icons for the four columns: same as today, me, the app, what really happened (drawn around 0,0, about 150 x 120)
const iconSame = (c: Ctx) => { cloud(c, -42, 0, 17, WHITE); cloud(c, 42, 0, 17, WHITE); line(c, [[-13, -9], [13, -9]], 8); line(c, [[-13, 9], [13, 9]], 8); };
const iconMe = (c: Ctx) => {
  shape(c, () => rrect(c, -48, 30, 96, 34, 17), CLOTH.child, 5);
  shape(c, () => ell(c, 0, -4, 36, 38), SKIN.child, 5);
  shape(c, () => { c.moveTo(-37, -6); c.bezierCurveTo(-38, -56, 38, -56, 37, -6); c.quadraticCurveTo(0, -30, -37, -6); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, -13, 0, 4, 5), INK, 0); shape(c, () => ell(c, 13, 0, 4, 5), INK, 0);
  c.beginPath(); c.arc(0, 8, 11, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const iconApp = (c: Ctx) => {
  shape(c, () => rrect(c, -36, -62, 72, 124, 12), COL.black, 5);
  shape(c, () => rrect(c, -29, -50, 58, 100, 6), COL.sky, 3);
  sun(c, 6, -20, 10); cloud(c, -2, 14, 10, WHITE);
};
const iconSky = (c: Ctx) => { sun(c, -22, -20, 24); cloud(c, 12, 14, 26, WHITE); };
const iconRain = (c: Ctx) => { cloud(c, 0, -14, 28, "#c9d3e0", "#9aa8bb"); [-30, 0, 30].forEach((dx, i) => drop(c, dx, 44 + (i % 2) * 8, 9)); };
const icon = (c: Ctx, fn: (c: Ctx) => void, x: number, y: number, sc: number) => { c.save(); c.translate(x, y); c.scale(sc, sc); fn(c); c.restore(); };
const scoreTable = (c: Ctx, top: number, hdr: number, row: number, rows: number, extra = 0) => {
  const bot = top + hdr + row * rows + extra;
  c.fillStyle = "#fdeec8"; c.fillRect(XS[0], top, XS[5] - XS[0], hdr);
  line(c, [[XS[0], top], [XS[5], top]], 5);
  XS.forEach((x) => line(c, [[x, top], [x, bot]], 5));
  for (let i = 0; i <= rows; i++) line(c, [[XS[0], top + hdr + i * row], [XS[5], top + hdr + i * row]], 5);
  line(c, [[XS[0], bot], [XS[5], bot]], 5);
  const sc = hdr / 150;
  [iconSame, iconMe, iconApp, iconSky].forEach((f, k) => icon(c, f, CX[k], top + hdr / 2, sc));
  for (let i = 0; i < rows; i++) { const h = row * 0.5; write(c, String(i + 1), 185 - h * 0.3, top + hdr + i * row + row / 2 - h / 2, h, INK, 5); }
};

// setup.e1.0
const card0 = (c: Ctx) => {
  ground(c);
  notebookPage(c, 70, 60, 1010, 930);
  scoreTable(c, 100, 150, 70, 7);
  holding(c, 770, 917, Math.PI + 0.75, 1.15, (k) => { k.translate(30, 0); pencilObj(k, 190); });
};

// setup.e1.1
const card1 = (c: Ctx) => {
  // sky above, the balcony ledge below: read the sky, write your own forecast; the phone lies face down
  c.fillStyle = "#7f8fd1"; c.fillRect(0, 0, D, D);
  c.fillStyle = "#b39cd6"; c.fillRect(0, 300, D, 150); c.fillStyle = "#f5b27f"; c.fillRect(0, 450, D, 120);
  cloud(c, 260, 170, 90, "#fbe3e0", "#e3b6c6"); cloud(c, 720, 130, 100, "#fbe3e0", "#e3b6c6"); cloud(c, 930, 330, 50, "#fbe3e0", "#e3b6c6");
  shape(c, () => rrect(c, -20, 560, D + 40, 560, 0), "#e8dcc3", 6);
  shape(c, () => rrect(c, -20, 540, D + 40, 50, 8), "#f3e9d3", 6);
  // open notebook with a little cloud being drawn
  c.save(); c.translate(640, 800); c.rotate(-0.06);
  c.beginPath(); rrect(c, -290, -190, 590, 400, 14); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, -300, -200, 590, 400, 14), COL.paper, 6);
  line(c, [[-5, -200], [-5, 200]], 6);
  [-120, -60, 0, 60, 120].forEach((y) => { line(c, [[-270, y], [-35, y]], 4, COL.steelDk); line(c, [[25, y], [260, y]], 4, COL.steelDk); });
  cloud(c, 140, -100, 34, WHITE, "#cdd9e8"); [105, 140, 175].forEach((x) => drop(c, x, -20, 10));
  c.restore();
  // the phone, back side up (dark, camera): not looked at yet
  c.save(); c.translate(150, 810); c.rotate(-0.25);
  c.beginPath(); rrect(c, -70, -130, 150, 270, 22); c.fillStyle = SH; c.fill();
  shape(c, () => rrect(c, -78, -140, 150, 270, 22), COL.black, 6);
  shape(c, () => ell(c, -38, -98, 22, 22), COL.greyDk, 5); shape(c, () => ell(c, -38, -98, 8, 8), INK, 0);
  c.restore();
  holding(c, 860, 985, -2.52, 1.2, (k) => { k.translate(30, 0); pencilObj(k, 190); });
};

// setup.e1.2
const card2 = (c: Ctx) => {
  ground(c);
  notebookPage(c, 70, 50, 1010, 810);
  scoreTable(c, 80, 130, 64, 7, 92);
  const top = 80 + 130, row = 64;
  const A = ["t", "x", "x", "t", "x", "t", "x"], B = ["t", "x", "t", "t", "x", "t", "t"], P = ["t", "t", "t", "x", "t", "t", "t"];
  [A, B, P].forEach((col, k) => col.forEach((v, i) => (v === "t" ? tick : cross)(c, CX[k], top + row * (i + 0.5), 24)));
  const real = [iconSky, iconRain, iconSky, iconSame, iconRain, iconSky, iconRain];
  real.forEach((f, i) => icon(c, i % 3 === 1 ? iconRain : f === iconSame ? iconSky : f, CX[3], top + row * (i + 0.5), 0.34));
  const ty = top + row * 7 + 18;
  write(c, "3", CX[0] - 12, ty, 52, INK, 7); write(c, "5", CX[1] - 12, ty, 52, INK, 7);
  holding(c, 850, 900, Math.PI + 0.75, 1.1, (k) => { k.translate(30, 0); pencilObj(k, 190); });
};

// setup.e1.3
const card3 = (c: Ctx) => {
  ground(c);
  notebookPage(c, 70, 50, 1010, 980);
  line(c, [[200, 800], [900, 800]], 6); line(c, [[200, 800], [200, 170]], 6);
  for (let k = 1; k <= 7; k++) { line(c, [[190, 800 - 90 * k], [210, 800 - 90 * k]], 4); write(c, String(k), 140, 800 - 90 * k - 15, 30, INK, 4); }
  const bars: [number, number, string, string, (c: Ctx) => void][] = [[320, 3, COL.orange, "#d27c25", iconSame], [520, 5, COL.teal, COL.tealDk, iconMe], [720, 6, COL.blue, COL.blueDk, iconApp]];
  bars.forEach(([x, v, col, dk, f]) => {
    const h = v * 90, p = () => rrect(c, x - 65, 800 - h, 130, h, 6);
    shape(c, p, col, 6); shade(c, p, dk, 28, 0, 0.5); shape(c, p, "rgba(0,0,0,0)", 6);
    icon(c, f, x, 893, 0.62);
  });
  holding(c, 927, 343, Math.PI + 0.35, 1.1, (k) => { k.translate(30, 0); pencilObj(k, 190); });
};

// setup.e2.0
const saltPatch = (c: Ctx, x: number, y: number, rx: number, ry: number, seedN: number) => {
  const r = rnd(seedN), pts: number[][] = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, k = 0.86 + r() * 0.26; pts.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
  shape(c, () => polyP(c, pts), "#fffdf7", 4);
  shade(c, () => polyP(c, pts), "#d9d4c6", rx * 0.12, ry * 0.2, 0.7);
  for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * 0.85; shape(c, () => ell(c, x + Math.cos(a) * rx * d, y + Math.sin(a) * ry * d, 4.5, 3.5), "#e9e5da", 0); }
};
const saltPlate = (c: Ctx, x: number, y: number, rx: number, ry: number, seedN: number) => { plate(c, x, y, rx, ry); saltPatch(c, x, y - ry * 0.04, rx * 0.45, ry * 0.45, seedN); };
const card4 = (c: Ctx) => {
  ground(c);
  // left: the finished thin patch; right: a heap being spread flat with the back of the teaspoon
  saltPlate(c, 270, 780, 235, 112, 3);
  plate(c, 800, 780, 235, 112);
  saltPatch(c, 800, 780, 105, 48, 5);
  const heap = () => { c.moveTo(735, 785); c.quadraticCurveTo(745, 700, 800, 695); c.quadraticCurveTo(855, 700, 865, 785); c.quadraticCurveTo(800, 815, 735, 785); c.closePath(); };
  shape(c, heap, "#fffdf7", 5); shade(c, heap, "#d9d4c6", 22, 10, 0.7);
  const r = rnd(9); for (let i = 0; i < 14; i++) { const x = 740 + r() * 120, y = 730 + r() * 55; shape(c, () => ell(c, x, y, 4, 3), "#e9e5da", 0); }
  holding(c, 940, 330, 1.79, 1.25, (k) => {
    shape(k, () => rrect(k, 20, -9, 300, 18, 8), COL.steel, 5);
    shape(k, () => ell(k, 345, 0, 58, 38), COL.steel, 5);
    shade(k, () => ell(k, 345, 0, 58, 38), COL.steelDk, 14, 8, 0.6);
    shine(k, [[320, -12], [350, -18]], 7);
  }, SKIN.adult, CLOTH.adult);
  const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * (0.88 - 0.76 * (i / 8)); pts.push([800 + Math.cos(a) * 150, 790 + Math.sin(a) * 58]); }
  arrow(c, pts, RED, 10);
};

// setup.e2.1
const card5 = (c: Ctx) => {
  // left: the steamy bathroom
  c.save(); c.beginPath(); c.rect(0, 0, 540, D); c.clip();
  c.fillStyle = "#9fd3d6"; c.fillRect(0, 0, 540, D);
  c.strokeStyle = "#7fb7bb"; c.lineWidth = 3;
  for (let x = 0; x <= 540; x += 90) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y <= D; y += 90) { c.beginPath(); c.moveTo(0, y); c.lineTo(540, y); c.stroke(); }
  line(c, [[70, 0], [70, 120]], 20, INK); line(c, [[70, 0], [70, 120]], 12, COL.steel);
  shape(c, () => ell(c, 130, 160, 74, 26, 0.35), COL.steel, 5);
  for (let k = 0; k < 9; k++) { const x = 92 + k * 13, y1 = 200 + ((k * 37) % 50), y2 = y1 + 130 + ((k * 53) % 60); line(c, [[x, y1], [x + 18, y2]], 6, COL.waterDk); }
  c.fillStyle = "rgba(255,255,255,0.62)";
  [[170, 330, 70], [270, 260, 92], [110, 450, 62], [300, 430, 84], [380, 320, 64], [220, 540, 66], [150, 220, 50]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); });
  [[-1, 215], [0, 245], [1, 275]].forEach(([k, x]) => { c.beginPath(); c.moveTo(x, 650); c.bezierCurveTo(x - 40 + k * 10, 600, x + 40, 560, x, 500); c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 16; c.lineCap = "round"; c.stroke(); });
  // closed door
  shape(c, () => rrect(c, 410, 40, 150, 1100, 6), COL.wood, 6);
  shape(c, () => rrect(c, 435, 90, 100, 380, 8), COL.woodDk, 4); shape(c, () => rrect(c, 435, 520, 100, 380, 8), COL.woodDk, 4);
  shape(c, () => ell(c, 438, 700, 14, 14), COL.steel, 4);
  // shelf and plate
  shape(c, () => polyP(c, [[20, 760], [390, 760], [350, 780], [20, 780]]), "#f6d58a", 5);
  shape(c, () => rrect(c, 20, 776, 370, 30, 4), COL.woodDk, 5);
  line(c, [[60, 806], [60, 880]], 8); line(c, [[350, 806], [350, 880]], 8);
  saltPlate(c, 205, 735, 150, 38, 7);
  c.restore();
  // right: the dry, bright room
  c.save(); c.beginPath(); c.rect(540, 0, 540, D); c.clip();
  c.fillStyle = "#fce6b0"; c.fillRect(540, 0, 540, D);
  c.fillStyle = "rgba(255,225,110,0.45)"; c.beginPath(); c.moveTo(670, 400); c.lineTo(960, 400); c.lineTo(1060, 770); c.lineTo(580, 770); c.closePath(); c.fill();
  shape(c, () => rrect(c, 650, 190, 320, 230, 8), COL.paper, 6);
  c.fillStyle = COL.sky; c.fillRect(668, 208, 284, 194);
  sun(c, 760, 290, 38);
  line(c, [[810, 208], [810, 402]], 8); line(c, [[668, 305], [952, 305]], 8);
  c.beginPath(); c.rect(668, 208, 284, 194); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.fillStyle = "#d9b98a"; c.fillRect(540, 940, 540, 140); line(c, [[540, 940], [1080, 940]], 6);
  shape(c, () => polyP(c, [[640, 770], [1000, 770], [1030, 800], [610, 800]]), "#f6d58a", 5);
  shape(c, () => rrect(c, 610, 798, 420, 36, 4), COL.woodDk, 5);
  line(c, [[650, 834], [650, 940]], 14); line(c, [[990, 834], [990, 940]], 14);
  saltPlate(c, 820, 755, 150, 38, 7);
  c.restore();
  line(c, [[540, 0], [540, D]], 10);
  // a clock between them: one hour
  shape(c, () => ell(c, 540, 100, 78, 78), WHITE, 6);
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; line(c, [[540 + Math.sin(a) * 62, 100 - Math.cos(a) * 62], [540 + Math.sin(a) * 70, 100 - Math.cos(a) * 70]], 4); }
  line(c, [[540, 100], [540, 48]], 7); line(c, [[540, 100], [540 + Math.sin(Math.PI / 6) * 36, 100 - Math.cos(Math.PI / 6) * 36]], 9, RED);
};

// setup.e2.2
const tiltPlate = (c: Ctx, cx: number, cy: number, inner: (c: Ctx) => void) => {
  c.save(); c.translate(cx, cy); c.rotate(0.3);
  shape(c, () => ell(c, 0, 18, 190, 85), COL.steelDk);
  shape(c, () => ell(c, 0, 0, 190, 85), COL.steel);
  shape(c, () => ell(c, 0, -3, 156, 66), COL.steelIn, 4);
  inner(c);
  c.restore();
};
const card6 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#d9b98a"; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 6);
  // left: the dry plate, all the salt has slid off the low rim and lies in a white pile
  tiltPlate(c, 290, 560, (k) => { [[120, 12], [132, 22]].forEach(([x, y]) => shape(k, () => ell(k, x, y, 5, 4), "#fffdf7", 2)); });
  const pr = rnd(6); for (let i = 0; i < 9; i++) shape(c, () => ell(c, 458 + (pr() - 0.5) * 36 + i * 3, 670 + i * 30, 7, 5), "#fffdf7", 3);
  const pile = () => { c.moveTo(380, 935); c.quadraticCurveTo(410, 850, 490, 845); c.quadraticCurveTo(570, 850, 600, 935); c.closePath(); };
  shape(c, pile, "#fffdf7", 6); shade(c, pile, "#d9d4c6", 30, 10, 0.7);
  arrow(c, [[565, 660], [565, 800]], RED, 10);
  // right: the damp plate, the salt is stuck in grey wet lumps and stays put
  tiltPlate(c, 790, 560, (k) => {
    const r = rnd(4);
    [[-70, 4, 44], [-15, -8, 50], [45, 8, 46], [80, -4, 34], [-35, 26, 32], [10, -30, 30]].forEach(([x, y, s]) => {
      const pts: number[][] = []; for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, q = 0.85 + r() * 0.3; pts.push([x + Math.cos(a) * s * q, y + Math.sin(a) * s * 0.75 * q]); }
      shape(k, () => polyP(k, pts), "#c8c3b0", 5); shade(k, () => polyP(k, pts), "#8f8a7a", s * 0.22, s * 0.28, 0.7);
      shine(k, [[x - s * 0.5, y - s * 0.3], [x - s * 0.1, y - s * 0.5]], 6);
    });
  });
  // two hands, one under each plate
  [290, 790].forEach((cx) => { const an = -1.75, s = 1.2, rx = cx - 181.5, ry = 560 - 56; hand(c, rx - Math.cos(an) * 84 * s * 0.8, ry - Math.sin(an) * 84 * s * 0.8, an, s); });
};

// setup.e3.0
const card7 = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D);
  cloud(c, 800, 150, 46, WHITE); cloud(c, 190, 120, 34, WHITE);
  // balcony railing
  c.fillStyle = "#e8dcc3"; c.fillRect(0, 990, D, 100);
  for (let x = 40; x < D; x += 90) line(c, [[x, 880], [x, 990]], 12, INK);
  for (let x = 40; x < D; x += 90) line(c, [[x, 880], [x, 990]], 6, COL.steel);
  shape(c, () => rrect(c, -20, 850, D + 40, 36, 8), COL.steel, 6);
  line(c, [[-20, 990], [D + 20, 990]], 6);
  // the ribbon, tied at the top of the pencil, streaming to the right
  const N = 24, top: number[][] = [], bot: number[][] = [];
  for (let i = 0; i <= N; i++) { const t = i / N, x = 300 + t * 520, y = 345 + Math.sin(t * 9) * 26 * (0.3 + t) + t * 30, w = 22 - t * 6; top.push([x, y - w]); bot.push([x, y + w]); }
  shape(c, () => polyP(c, [...top, ...bot.reverse()]), COL.red, 6);
  // the pencil, upright, eraser end up
  c.save(); c.translate(300, 330); c.rotate(Math.PI / 2); pencilObj(c, 440); c.restore();
  shape(c, () => ell(c, 300, 340, 18, 18), "#a8372b", 5);
  // the hand grips the pencil
  hand(c, 205, 600, -0.25, 1.5);
  [[560, 560, 760, 540], [640, 640, 860, 620], [520, 470, 640, 455]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + d) / 2, b - 30, d, e); c.strokeStyle = WHITE; c.lineWidth = 10; c.lineCap = "round"; c.globalAlpha = 0.85; c.stroke(); c.globalAlpha = 1; });
};

// setup.e3.1
const card8 = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D);
  // tall building, its roof edge at the right
  shape(c, () => rrect(c, 90, 400, 360, 640, 4), "#e8c9a0", 6);
  shade(c, () => rrect(c, 90, 400, 360, 640, 4), "#c6a574", 120, 0, 0.6);
  shape(c, () => rrect(c, 70, 366, 400, 40, 6), "#f3e9d3", 6);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 125 + k * 105, 445 + r * 115, 70, 85, 6), "#8ec5e8", 5);
  c.fillStyle = COL.green; c.fillRect(0, 1030, D, 60); line(c, [[0, 1030], [D, 1030]], 6);
  // the cloud, just beyond the roof edge, and an arrow showing it moving away
  cloud(c, 760, 380, 100, WHITE);
  arrow(c, [[490, 560], [860, 560]], RED, 14);
};

// setup.e3.2
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  const w = h * 0.7, p = (pts: number[][]) => line(c, pts.map(([u, v]) => [x + u, y + v]), 9);
  if (ch === "N") p([[-w / 2, h / 2], [-w / 2, -h / 2], [w / 2, h / 2], [w / 2, -h / 2]]);
  if (ch === "E") { p([[w / 2, -h / 2], [-w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]]); p([[-w / 2, 0], [w / 3, 0]]); }
  if (ch === "S") p([[w / 2, -h * 0.4], [0, -h / 2], [-w / 2, -h / 4], [0, 0], [w / 2, h / 4], [0, h / 2], [-w / 2, h * 0.4]]);
  if (ch === "W") p([[-w / 2, -h / 2], [-w / 4, h / 2], [0, -h / 6], [w / 4, h / 2], [w / 2, -h / 2]]);
};
const card9 = (c: Ctx) => {
  ground(c);
  notebookPage(c, 70, 50, 1010, 930);
  const ox = 540, oy = 470;
  line(c, [[ox - 290, oy], [ox + 290, oy]], 6); line(c, [[ox, oy - 290], [ox, oy + 290]], 6);
  letter(c, "N", ox, oy - 335, 60); letter(c, "S", ox, oy + 335, 60); letter(c, "W", ox - 345, oy, 60); letter(c, "E", ox + 345, oy, 60);
  // you, in the middle; the two arrows come in from where each one comes from
  shape(c, () => ell(c, ox, oy, 70, 70), WHITE, 5); icon(c, iconMe, ox, oy + 4, 0.75);
  // wind (blue) comes from the north-east: the ribbon picture streams towards you
  shape(c, () => ell(c, ox + 230, oy - 215, 88, 88), WHITE, 5); c.beginPath(); ell(c, ox + 230, oy - 215, 88, 88); c.strokeStyle = COL.blueDk; c.lineWidth = 12; c.stroke();
  line(c, [[ox + 262, oy - 165], [ox + 262, oy - 265]], 16); line(c, [[ox + 262, oy - 165], [ox + 262, oy - 265]], 8, COL.yellow);
  { const N = 12, top: number[][] = [], bot: number[][] = []; for (let i = 0; i <= N; i++) { const t = i / N, x = ox + 258 - t * 100, y = oy - 252 + Math.sin(t * 8) * 9 + t * 18, w = 14 - t * 6; top.push([x, y - w]); bot.push([x, y + w]); } shape(c, () => polyP(c, [...top, ...bot.reverse()]), COL.red, 4); }
  arrow(c, [[ox + 168, oy - 150], [ox + 80, oy - 70]], COL.blueDk, 16);
  // clouds (red) come from the south-east: the cloud picture sits at the start of the arrow
  shape(c, () => ell(c, ox + 230, oy + 215, 88, 88), WHITE, 5); c.beginPath(); ell(c, ox + 230, oy + 215, 88, 88); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
  cloud(c, ox + 230, oy + 205, 38, WHITE);
  arrow(c, [[ox + 168, oy + 150], [ox + 80, oy + 70]], RED, 16);
  holding(c, 900, 905, Math.PI + 0.5, 1.1, (k) => { k.translate(30, 0); pencilObj(k, 190); });
};

export const su_weatherForecasting = cards("sci.weather.forecasting.L3 set-up", [card0, card1, card2, card3, card4, card5, card6, card7, card8, card9]);
