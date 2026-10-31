import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// sci.materials.testing-materials.L3 set-up cards: cloth patches over steel tumblers (e1), paper strips
// hung from a book at a table edge with coins (e2, e3), strips on a broom handle over coloured water (e4).

// ---------------------------------------------------------------- shared things
const dashed = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w = 4, seg = 16) => {
  const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.floor(L / seg));
  for (let i = 0; i < n; i += 2) line(c, [[x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n], [x1 + ((x2 - x1) * (i + 1)) / n, y1 + ((y2 - y1) * (i + 1)) / n]], w);
};
// hand coming in from the right, pointing left
const handL = (c: Ctx, x: number, y: number, s: number, open = false) => { c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, 0, s, SKIN.child, CLOTH.child, open); c.restore(); };
const drop = (c: Ctx, x: number, y: number, r: number, pointDown = false) => {
  c.save(); c.translate(x, y); if (pointDown) c.scale(1, -1);
  shape(c, () => { c.moveTo(0, -r * 1.9); c.quadraticCurveTo(r * 0.3, -r * 0.9, r, 0); c.arc(0, 0, r, 0, Math.PI); c.quadraticCurveTo(-r, -r * 0.3, 0, -r * 1.9); c.closePath(); }, COL.water, 4);
  shape(c, () => ell(c, -r * 0.35, -r * 0.1, r * 0.2, r * 0.3), COL.drop, 0);
  c.restore();
};
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.92), COL.steel, 4);
  shade(c, () => ell(c, x, y, r, r * 0.92), COL.steelDk, -r * 0.3, -r * 0.3, 0.6);
  c.beginPath(); ell(c, x, y, r * 0.72, r * 0.66); c.strokeStyle = INK; c.lineWidth = 2.5; c.stroke();
  write(c, "1", x - r * 0.18, y - r * 0.38, r * 0.7, INK, 3.5);
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  shape(c, () => rrect(c, x, y, w, h, 6), col);
  shape(c, () => rrect(c, x + 12, y + h * 0.16, w - 18, h * 0.68, 3), COL.paper, 4);
  for (let k = 1; k < 4; k++) line(c, [[x + 16, y + h * 0.16 + (h * 0.68 * k) / 4], [x + w - 10, y + h * 0.16 + (h * 0.68 * k) / 4]], 2, COL.grey);
  shape(c, () => rrect(c, x, y, 12, h, 4), dk, 4);
};
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, open = true) => {
  const top = w / 2, bot = w * 0.41, ry = w * 0.09, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.12, y + 8, w * 0.62, w * 0.1);
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, -w * 0.24, 0, 0.6);
  line(c, [[x - bot + 4, y - 16], [x + bot - 4, y - 16]], 3.5, COL.steelDk);
  shine(c, [[x - top * 0.7, y - h * 0.85], [x - bot * 0.72, y - h * 0.15]], 8);
  if (open) shape(c, () => ell(c, x, y - h, top, ry), COL.steelIn, 5);
};
type Cl = { col: string; dk: string; pat: "check" | "stripe" | "dots" | "plain" };
const CLOTHS: Cl[] = [
  { col: COL.red, dk: "#b83a27", pat: "check" }, { col: COL.blue, dk: COL.blueDk, pat: "stripe" },
  { col: COL.yellow, dk: COL.woodDk, pat: "dots" }, { col: COL.teal, dk: COL.tealDk, pat: "plain" },
];
const patFill = (c: Ctx, path: () => void, cl: Cl, x0: number, y0: number, x1: number, y1: number, k = 1) => {
  c.save(); c.beginPath(); path(); c.clip(); c.fillStyle = WHITE;
  if (cl.pat === "check") { c.globalAlpha = 0.4; const s = 24 * k; for (let i = 0; i * s < x1 - x0 + s; i++) for (let j = 0; j * s < y1 - y0 + s; j++) if ((i + j) % 2 === 0) c.fillRect(x0 + i * s, y0 + j * s, s, s); }
  else if (cl.pat === "stripe") { c.globalAlpha = 0.4; for (let x = x0; x < x1; x += 30 * k) c.fillRect(x, y0, 14 * k, y1 - y0); }
  else if (cl.pat === "dots") { c.globalAlpha = 1; c.fillStyle = COL.red; for (let j = 0; (y0 + j * 26 * k) < y1; j++) for (let x = x0 + (j % 2) * 13 * k; x < x1; x += 26 * k) { c.beginPath(); c.arc(x, y0 + j * 26 * k, 5 * k, 0, 7); c.fill(); } }
  else { c.globalAlpha = 0.3; c.beginPath(); c.moveTo(x0, y0 + (y1 - y0) * 0.7); c.lineTo(x0 + (x1 - x0) * 0.5, y0); c.lineTo(x0 + (x1 - x0) * 0.7, y0); c.lineTo(x0, y0 + (y1 - y0)); c.fill(); }
  c.restore(); c.globalAlpha = 1;
};
// a cloth stretched over a tumbler's mouth: dip in the middle, rubber band round the neck
const cover = (c: Ctx, x: number, ty: number, w: number, cl: Cl, dip = true) => {
  const r = w / 2 + 8, ry = w * 0.1;
  const skirt = () => { c.moveTo(x - r, ty); c.lineTo(x - r - 10, ty + 78); c.quadraticCurveTo(x - r / 2, ty + 98, x, ty + 80); c.quadraticCurveTo(x + r / 2, ty + 100, x + r + 10, ty + 78); c.lineTo(x + r, ty); c.closePath(); };
  shape(c, skirt, cl.col); patFill(c, skirt, cl, x - r - 12, ty, x + r + 12, ty + 100); shade(c, skirt, cl.dk, -r * 0.5, 0, 0.5);
  const topP = () => ell(c, x, ty, r, ry);
  shape(c, topP, cl.col); patFill(c, topP, cl, x - r, ty - ry, x + r, ty + ry); shade(c, topP, cl.dk, -r * 0.4, -ry * 0.3, 0.4);
  if (dip) { shape(c, () => ell(c, x, ty + 4, r * 0.5, ry * 0.62), cl.dk, 4); shape(c, () => ell(c, x - r * 0.1, ty + 1, r * 0.28, ry * 0.3), cl.col, 0); }
  const band = () => { c.beginPath(); c.ellipse(x, ty + 40, r - 4, ry * 0.9, 0, 0.05, Math.PI - 0.05); };
  band(); c.strokeStyle = INK; c.lineWidth = 17; c.lineCap = "round"; c.stroke(); band(); c.strokeStyle = COL.yellow; c.lineWidth = 8; c.stroke();
};
const ruler = (c: Ctx, ox: number, oy: number, up: boolean, cmPx: number, nCm: number, wd = 90, pad = 16) => {
  const sg = up ? -1 : 1, y0 = oy - sg * pad, y1 = oy + sg * (nCm * cmPx + pad);
  shape(c, () => rrect(c, ox, Math.min(y0, y1), wd, Math.abs(y1 - y0), 6), COL.wood);
  c.fillStyle = COL.woodDk; c.globalAlpha = 0.5; c.fillRect(ox + wd - 14, Math.min(y0, y1) + 4, 10, Math.abs(y1 - y0) - 8); c.globalAlpha = 1;
  for (let mm = 0; mm <= nCm * 10; mm++) { const y = oy + sg * (mm * cmPx) / 10, L = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; line(c, [[ox + wd - 6, y], [ox + wd - 6 - L, y]], mm % 10 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= nCm; cm++) { const t = String(cm), h = Math.min(24, cmPx * 0.62), wdt = 0.8 * h * (t.length - 1) + 0.6 * h; write(c, t, ox + wd - 46 - wdt, oy + sg * cm * cmPx - h / 2, h, INK, 4); }
};
const bag = (c: Ctx, x: number, ty: number, w: number, h: number, n: number) => {
  const body = () => { c.moveTo(x - w * 0.36, ty); c.quadraticCurveTo(x - w * 0.5, ty + h * 0.3, x - w * 0.5, ty + h * 0.7); c.quadraticCurveTo(x - w * 0.5, ty + h, x - w * 0.25, ty + h); c.lineTo(x + w * 0.25, ty + h); c.quadraticCurveTo(x + w * 0.5, ty + h, x + w * 0.5, ty + h * 0.7); c.quadraticCurveTo(x + w * 0.5, ty + h * 0.3, x + w * 0.36, ty); c.closePath(); };
  shadow(c, x + 20, ty + h + 6, w * 0.5, 14);
  c.beginPath(); c.ellipse(x, ty - 36, w * 0.27, 42, 0, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 13; c.stroke(); c.strokeStyle = "#e6f3fb"; c.lineWidth = 6; c.stroke();
  const rows = [5, 4, 3, 2], by = ty + h - 36; let k = 0;
  for (let r = 0; r < rows.length && k < n; r++) for (let i = 0; i < rows[r] && k < n; i++, k++) coin(c, x + (i - (rows[r] - 1) / 2) * 56, by - r * 44, 34);
  shape(c, body, "rgba(214,236,250,0.5)", 5);
  shine(c, [[x - w * 0.4, ty + h * 0.3], [x - w * 0.43, ty + h * 0.68]], 8);
  shape(c, () => ell(c, x, ty, w * 0.36, 11), "rgba(255,255,255,0.35)", 4);
};
const clip = (c: Ctx, x: number, y0: number) => {
  const o = () => rrect(c, x - 24, y0, 48, 96, 24), i = () => rrect(c, x - 11, y0 + 24, 22, 72, 11);
  for (const p of [o, i]) { c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = 11; c.stroke(); }
  for (const p of [o, i]) { c.beginPath(); p(); c.strokeStyle = COL.steel; c.lineWidth = 5; c.stroke(); }
};
type Mat = { fill: string; kind: "towel" | "napkin" | "cloth" | "news" | "plain"; dk?: string };
const MATS: Mat[] = [
  { fill: COL.paper, kind: "towel" }, { fill: COL.blue, kind: "cloth", dk: COL.blueDk }, { fill: "#ddd9d0", kind: "news" },
  { fill: "#fbe9a0", kind: "plain" }, { fill: COL.cloth, kind: "cloth", dk: "#cfc6b0" }, { fill: "#f6c9d6", kind: "plain" },
];
// a paper or cloth strip hanging down: x centre, y0 top, y1 bottom, w wide
const mstrip = (c: Ctx, x: number, y0: number, y1: number, w: number, m: Mat, notch = 0) => {
  const p = () => { c.moveTo(x - w / 2, y0); c.lineTo(x + w / 2, y0); if (notch) { c.lineTo(x + w / 2, notch - 14); c.lineTo(x + w * 0.1, notch + 4); c.lineTo(x + w / 2, notch + 26); } c.lineTo(x + w / 2, y1); c.lineTo(x - w / 2, y1); c.closePath(); };
  shape(c, p, m.fill, 5);
  c.save(); c.beginPath(); p(); c.clip();
  if (m.kind === "towel") { c.fillStyle = COL.grey; for (let y = y0 + 12; y < y1; y += 22) for (let xx = x - w / 2 + 8 + ((y - y0) % 44 ? 0 : 11); xx < x + w / 2; xx += 22) { c.beginPath(); c.arc(xx, y, 2.4, 0, 7); c.fill(); } }
  if (m.kind === "cloth") { c.strokeStyle = m.dk ?? COL.blueDk; c.globalAlpha = 0.45; c.lineWidth = 2; for (let y = y0; y < y1; y += 12) { c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.stroke(); } for (let xx = x - w / 2; xx < x + w / 2; xx += 12) { c.beginPath(); c.moveTo(xx, y0); c.lineTo(xx, y1); c.stroke(); } c.globalAlpha = 1; }
  if (m.kind === "news") { c.strokeStyle = COL.greyDk; c.globalAlpha = 0.6; c.lineWidth = 3; for (let y = y0 + 10; y < y1; y += 14) { c.beginPath(); c.moveTo(x - w / 2 + 6, y); c.lineTo(x + w / 2 - 6 - ((y * 7) % 14), y); c.stroke(); } c.globalAlpha = 1; }
  c.restore();
  shade(c, p, "#8a8070", -w * 0.28, 0, 0.28);
};
const NAPKIN: Mat = { fill: WHITE, kind: "plain" };
// a wooden table seen from the front, with a heavy book on it; strip hangs from under the book
const table = (c: Ctx) => {
  shape(c, () => rrect(c, 80, 420, 52, 700, 6), COL.woodDk); shape(c, () => rrect(c, 948, 420, 52, 700, 6), COL.woodDk);
  shape(c, () => polyP(c, [[130, 170], [950, 170], [1030, 340], [50, 340]]), COL.wood);
  shape(c, () => polyP(c, [[50, 340], [1030, 340], [1030, 420], [50, 420]]), COL.woodDk);
  shade(c, () => polyP(c, [[50, 340], [1030, 340], [1030, 420], [50, 420]]), "#8a5a1a", 0, -40, 0.25);
};
const heavyBook = (c: Ctx) => {
  shape(c, () => polyP(c, [[355, 190], [735, 190], [790, 262], [300, 262]]), COL.teal);
  shape(c, () => rrect(c, 300, 262, 490, 14, 4), COL.tealDk, 5);
  shape(c, () => rrect(c, 308, 276, 474, 46, 2), COL.paper, 4);
  for (let k = 0; k < 3; k++) line(c, [[316, 288 + k * 14], [774, 288 + k * 14]], 2, COL.grey);
  shape(c, () => rrect(c, 300, 322, 490, 14, 4), COL.tealDk, 5);
};

// ---------------------------------------------------------------- e1: the umbrella patch test
// setup.e1.0
const c00 = (c: Ctx) => {
  ground(c);
  shadow(c, 570, 940, 520, 36);
  shape(c, () => rrect(c, 30, 640, 1020, 290, 46), COL.steel);
  shade(c, () => rrect(c, 30, 640, 1020, 290, 46), COL.steelDk, -30, -26, 0.5);
  shape(c, () => rrect(c, 66, 668, 948, 232, 34), COL.steelIn, 5);
  CLOTHS.forEach((cl, i) => {
    const x = 175 + 243 * i;
    tumbler(c, x, 780, 180, 360); cover(c, x, 420, 180, cl);
    shape(c, () => rrect(c, x - 70, 820, 140, 66, 6), WHITE, 4);
    shape(c, () => rrect(c, x - 58, 832, 42, 42, 4), cl.col, 4); patFill(c, () => rrect(c, x - 58, 832, 42, 42, 4), cl, x - 58, 832, x - 16, 874, 0.6);
    line(c, [[x - 4, 842], [x + 56, 842]], 4, COL.grey); line(c, [[x - 4, 862], [x + 40, 862]], 4, COL.grey);
  });
};
// setup.e1.1
const c01 = (c: Ctx) => {
  ground(c);
  const FL = 950;
  // stand of books so the ruler's 0 is level with the cloth
  book(c, 650, FL - 100, 190, 100, COL.orange, "#c27a22"); book(c, 660, FL - 200, 170, 100, COL.purple, "#6a50a5"); book(c, 655, FL - 300, 180, 100, COL.teal, COL.tealDk);
  ruler(c, 700, FL - 300, true, 28, 10, 80, 18);
  tumbler(c, 300, FL, 270, 300); cover(c, 300, FL - 300, 270, CLOTHS[0]);
  // 10 cm marks
  dashed(c, 380, FL - 300 - 280, 700, FL - 300 - 280, 4, 18); dashed(c, 430, FL - 300, 700, FL - 300, 4, 18);
  line(c, [[880, FL - 300], [880, FL - 580]], 5); line(c, [[862, FL - 300], [898, FL - 300]], 5); line(c, [[862, FL - 580], [898, FL - 580]], 5);
  write(c, "10 cm", 850, FL - 470, 44, INK, 6);
  // upside-down bottle: cap down, water inside
  const cy = FL - 580, bw = 52;
  const bottle = () => { c.moveTo(300 - 28, cy); c.lineTo(300 + 28, cy); c.lineTo(300 + bw, cy - 60); c.lineTo(300 + bw, cy - 250); c.quadraticCurveTo(300 + bw, cy - 270, 300 + bw - 20, cy - 270); c.lineTo(300 - bw + 20, cy - 270); c.quadraticCurveTo(300 - bw, cy - 270, 300 - bw, cy - 250); c.lineTo(300 - bw, cy - 60); c.closePath(); };
  shape(c, bottle, COL.glass, 5);
  c.save(); c.beginPath(); bottle(); c.clip(); c.fillStyle = COL.water; c.fillRect(0, cy - 180, 700, 200); c.restore();
  line(c, [[300 - bw, cy - 180], [300 + bw, cy - 180]], 4, COL.waterDk);
  shape(c, bottle, "rgba(214,236,250,0.25)", 5);
  shine(c, [[300 - bw + 14, cy - 230], [300 - bw + 14, cy - 80]], 8);
  shape(c, () => rrect(c, 300 - 30, cy - 8, 60, 24, 5), COL.blue, 5);
  for (const dx of [-14, 0, 14]) { c.beginPath(); ell(c, 300 + dx, cy + 12, 3.5, 2.5); c.fillStyle = INK; c.fill(); }
  drop(c, 292, cy + 70, 11); drop(c, 312, cy + 130, 12); drop(c, 296, cy + 200, 13);
  handL(c, 300 + 112, cy - 140, 1.3);
};
// setup.e1.2
const medCup = (c: Ctx, x: number, y: number, w: number, h: number, lvl: number) => {
  const tp = w / 2, bt = w * 0.4, body = () => { c.moveTo(x - tp, y - h); c.lineTo(x + tp, y - h); c.lineTo(x + bt, y); c.lineTo(x - bt, y); c.closePath(); };
  shadow(c, x + 14, y + 8, w * 0.6, 14);
  const ly = y - h * lvl, lw = bt + (tp - bt) * lvl;
  shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bt, y); c.lineTo(x - bt, y); c.closePath(); }, COL.water, 0);
  shape(c, () => ell(c, x, ly, lw, 10), COL.drop, 0);
  shape(c, body, "rgba(214,236,250,0.4)", 5);
  for (let k = 1; k <= 5; k++) { const ty = y - (h * k) / 6, tw = bt + (tp - bt) * (k / 6); line(c, [[x + tw - 4, ty], [x + tw - (k % 2 ? 30 : 50), ty]], 4); }
  shape(c, () => ell(c, x, y - h, tp, 12), "rgba(255,255,255,0.35)", 5);
};
const eye = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - 70 * s, y); c.quadraticCurveTo(x, y - 70 * s, x + 70 * s, y); c.quadraticCurveTo(x, y + 70 * s, x - 70 * s, y); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, x - 12 * s, y, 26 * s, 26 * s), COL.brown, 4); shape(c, () => ell(c, x - 16 * s, y, 11 * s, 11 * s), INK, 0);
};
// setup.e1.2
const c02 = (c: Ctx) => {
  ground(c);
  // results table
  shape(c, () => rrect(c, 700, 110, 330, 350, 10), WHITE, 5);
  CLOTHS.forEach((cl, i) => {
    const y = 140 + i * 80;
    shape(c, () => rrect(c, 724, y, 56, 56, 6), cl.col, 4); patFill(c, () => rrect(c, 724, y, 56, 56, 6), cl, 724, y, 780, y + 56, 0.8);
    const len = [210, 120, 40, 0][i];
    if (len) shape(c, () => rrect(c, 800, y + 8, len, 40, 6), COL.water, 4);
    else drop(c, 820, y + 40, 8);
    line(c, [[700, y + 68], [1030, y + 68]], 2, COL.grey);
  });
  medCup(c, 560, 920, 190, 340, 0.55);
  // tumbler tipped over the cup, hand holding it
  c.save(); c.translate(380, 360); c.rotate(2.0); tumbler(c, 0, 0, 200, 260, false); c.restore();
  // water out of the mouth's lower lip
  shape(c, () => { c.moveTo(560, 559); c.lineTo(594, 559); c.quadraticCurveTo(588, 700, 574, 748); c.lineTo(546, 748); c.quadraticCurveTo(556, 640, 560, 559); c.closePath(); }, COL.water, 4);
  arrow(c, [[720, 470], [720, 590]]);
  hand(c, 482, 306, 1.99, 1.3);
  // eye at the level of the line
  const wy = 920 - 340 * 0.55;
  eye(c, 900, wy, 1.1); dashed(c, 820, wy, 655, wy, 4, 14);
};
// setup.e1.3
const c03 = (c: Ctx) => {
  ground(c);
  const cx = 540, ty = 430;
  const out = () => { c.moveTo(cx - 350, ty); c.lineTo(cx + 350, ty); c.lineTo(cx + 290, 960); c.lineTo(cx - 290, 960); c.closePath(); };
  shadow(c, cx + 60, 972, 360, 28);
  shape(c, out, COL.steel); shade(c, out, COL.steelDk, -50, 0, 0.5);
  shape(c, () => polyP(c, [[cx - 312, ty + 30], [cx + 312, ty + 30], [cx + 256, 920], [cx - 256, 920]]), COL.steelIn, 5);
  shade(c, () => polyP(c, [[cx - 312, ty + 30], [cx + 312, ty + 30], [cx + 256, 920], [cx - 256, 920]]), COL.steelDk, 40, 0, 0.35);
  // rubber band on the rim
  for (const s of [-1, 1]) shape(c, () => rrect(c, cx + s * 322 - 22 + (s > 0 ? 4 : 0), ty + 52, 44, 30, 6), COL.yellow, 5);
  // the cloth, a thin band with a pinhole
  const cl = CLOTHS[3];
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? cx - 400 : cx + 10, x1 = s < 0 ? cx - 10 : cx + 400;
    shape(c, () => rrect(c, x0, ty - 22, x1 - x0, 44, 14), cl.col, 5); shade(c, () => rrect(c, x0, ty - 22, x1 - x0, 44, 14), cl.dk, 0, -14, 0.45);
  }
  // rain beads sitting on the cloth, none going through
  for (const bx of [cx - 270, cx - 150, cx + 150, cx + 270]) shape(c, () => { c.moveTo(bx - 34, ty - 22); c.quadraticCurveTo(bx, ty - 90, bx + 34, ty - 22); c.closePath(); }, COL.water, 4);
  shape(c, () => { c.moveTo(cx - 40, ty - 22); c.quadraticCurveTo(cx, ty - 100, cx + 40, ty - 22); c.closePath(); }, COL.water, 4);
  line(c, [[cx - 20, ty - 40], [cx - 8, ty - 66]], 6, COL.drop);
  // the drop hanging under the pinhole
  shape(c, () => { c.moveTo(cx - 6, ty + 20); c.lineTo(cx + 6, ty + 20); c.quadraticCurveTo(cx + 34, ty + 70, cx + 30, ty + 100); c.arc(cx, ty + 100, 30, 0, Math.PI); c.quadraticCurveTo(cx - 34, ty + 70, cx - 6, ty + 20); c.closePath(); }, COL.water, 5);
  shape(c, () => ell(c, cx - 11, ty + 98, 8, 14), COL.drop, 0);
  arrow(c, [[cx, 150], [cx, 300]]);
};

// ---------------------------------------------------------------- e2 / e3: strips hung from a book
const hangScene = (c: Ctx, m: Mat, coins: number) => {
  ground(c);
  table(c); heavyBook(c);
  mstrip(c, 540, 330, 680, 52, m);
  clip(c, 540, 650);
  bag(c, 540, 790, 250, 190, coins);
};
// the marking-out scene: a sheet, a vertical ruler along its left, pencil lines 2 cm apart
const marking = (c: Ctx, napkin: boolean, lines: number[], px: number, labels: string[], scissors: boolean) => {
  ground(c);
  const U = 50, T = 300;
  shadow(c, 560, 900, 450, 26);
  shape(c, () => rrect(c, 110, T, 860, 580, 8), napkin ? WHITE : COL.paper);
  if (napkin) { c.save(); c.beginPath(); rrect(c, 110, T, 860, 580, 8); c.clip(); c.strokeStyle = COL.pink; c.lineWidth = 6; c.globalAlpha = 0.7; c.strokeRect(128, T + 18, 824, 544); c.strokeStyle = COL.grey; c.lineWidth = 2; c.beginPath(); c.moveTo(540, T); c.lineTo(540, T + 580); c.moveTo(110, T + 290); c.lineTo(970, T + 290); c.stroke(); c.restore(); c.globalAlpha = 1; }
  else { c.save(); c.beginPath(); rrect(c, 110, T, 860, 580, 8); c.clip(); c.fillStyle = COL.grey; for (let y = T + 16; y < T + 580; y += 24) for (let x = 120 + ((y - T) % 48 ? 0 : 12); x < 970; x += 24) { c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); } c.restore(); }
  // strips between the lines
  const edges = [0, ...lines];
  labels.forEach((t, i) => {
    const y0 = T + edges[i] * U, y1 = T + edges[i + 1] * U;
    c.fillStyle = COL.sky; c.globalAlpha = 0.55; c.fillRect(214, y0, 740, y1 - y0); c.globalAlpha = 1;
    write(c, t, 300, (y0 + y1) / 2 - 22, 44, INK, 6);
  });
  lines.forEach((cm, i) => { const y = T + cm * U, xe = i === lines.length - 1 ? px : 950; line(c, [[214, y], [xe, y]], 7, COL.greyDk); });
  ruler(c, 120, T, false, U, 10, 90, 0);
  if (scissors) {
    c.save(); c.translate(700, 790); c.rotate(-0.25); c.scale(1.2, 1.2);
    for (const k of [-1, 1]) {
      c.save(); c.rotate(-k * 0.4); line(c, [[0, 0], [-70, 0]], 22, INK); line(c, [[0, 0], [-70, 0]], 12, COL.steel);
      shape(c, () => ell(c, -105, 0, 44, 30), COL.orange, 6); shape(c, () => ell(c, -105, 0, 22, 14), BG, 4); c.restore();
    }
    for (const k of [-1, 1]) { c.save(); c.rotate(k * 0.07); shape(c, () => polyP(c, [[-8, -15], [190, k * 4], [-8, 15]]), COL.steel, 5); c.restore(); }
    shape(c, () => ell(c, 0, 0, 12, 12), COL.steelDk, 4);
    c.restore();
  }
  // pencil in a fist, drawing the last line
  const ly = T + lines[lines.length - 1] * U;
  c.save(); c.translate(px, ly); c.rotate(-1.38);
  shape(c, () => polyP(c, [[0, 0], [50, -15], [50, 15]]), COL.wood, 5); shape(c, () => polyP(c, [[0, 0], [16, -5], [16, 5]]), INK, 2);
  shape(c, () => rrect(c, 50, -15, 230, 30, 4), COL.yellow, 5); shape(c, () => rrect(c, 280, -15, 26, 30, 3), COL.steel, 5); shape(c, () => rrect(c, 306, -15, 30, 30, 10), COL.pink, 5);
  c.restore();
  handL(c, px + 118, ly - 210, 1.3);
  hand(c, 165, 945, -Math.PI / 2, 1.5, SKIN.child, CLOTH.child, true);
};
// setup.e2.0
const c04 = (c: Ctx) => marking(c, false, [2], 640, ["2 cm"], true);
// setup.e2.1
const c05 = (c: Ctx) => hangScene(c, MATS[0], 0);
// setup.e2.2
const c06 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -10, -10, 1100, 140, 0), COL.woodDk); shape(c, () => rrect(c, -10, 100, 1100, 30, 0), COL.wood, 5);
  mstrip(c, 540, 130, 560, 64, MATS[0], 330);
  clip(c, 540, 540);
  bag(c, 540, 700, 300, 250, 7);
  coin(c, 640, 480, 38);
  arrow(c, [[640, 530], [640, 640]]);
  handL(c, 900, 470, 2, true);
};

// setup.e3.0
const c07 = (c: Ctx) => marking(c, true, [2, 6], 560, ["2 cm", "4 cm"], false);
// setup.e3.1
const c08 = (c: Ctx) => hangScene(c, NAPKIN, 5);
// setup.e3.2
const c09 = (c: Ctx) => {
  ground(c);
  const tears = [0.3, 0.55, 0.12, 0.7, 0.42, 0.22], counts = ["14", "22", "9", "25", "18", "12"], r = rnd(5);
  tears.forEach((t, i) => {
    const x = 165 + 150 * i, y0 = 290, y1 = 910, ty = y0 + (y1 - y0) * t, w = 80;
    const jag = (dy: number, sgn: number) => { const pts: number[][] = []; for (let k = 0; k <= 8; k++) pts.push([x - w / 2 + (w * k) / 8, ty + dy + (k % 2 ? sgn * 14 : -sgn * 4) + (r() - 0.5) * 8]); return pts; };
    const a = jag(0, 1), b = jag(40, -1).map(([px, py]) => [px + 10, py]);
    shadow(c, x + 30, (y0 + ty) / 2 + 14, w * 0.5, (ty - y0) / 2);
    shape(c, () => { c.moveTo(x - w / 2, y0); c.lineTo(x + w / 2, y0); a.slice().reverse().forEach(([px, py]) => c.lineTo(px, py)); c.closePath(); }, WHITE, 5);
    shape(c, () => { b.forEach(([px, py], k) => (k ? c.lineTo(px, py) : c.moveTo(px, py))); c.lineTo(x + w / 2 + 10, y1 + 40); c.lineTo(x - w / 2 + 10, y1 + 40); c.closePath(); }, WHITE, 5);
    shade(c, () => { c.moveTo(x - w / 2, y0); c.lineTo(x + w / 2, y0); c.lineTo(x + w / 2, ty); c.lineTo(x - w / 2, ty); c.closePath(); }, "#8a8070", -w * 0.3, 0, 0.25);
    coin(c, x, 100, 34); write(c, counts[i], x - 0.8 * 31 + (counts[i].length === 1 ? 14 : 0), 150, 62, INK, 7);
  });
};

// ---------------------------------------------------------------- e4: the climbing water test
const ORDER = [0, 1, 2, 3, 4, 5, 1, 0, 3, 2, 5, 4];
const tint = (c: Ctx, x: number, w: number, yTop: number, yBot: number, seed: number) => {
  const r = rnd(seed); c.save(); c.beginPath(); c.moveTo(x - w / 2, yBot); c.lineTo(x - w / 2, yTop + 6);
  for (let k = 1; k <= 4; k++) c.lineTo(x - w / 2 + (w * k) / 4, yTop + (k % 2 ? -5 : 6) + r() * 6);
  c.lineTo(x + w / 2, yBot); c.closePath(); c.fillStyle = "rgba(244,196,30,0.8)"; c.fill(); c.restore();
};
const peg = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 16, y, 32, 96, 8), COL.wood, 5); shade(c, () => rrect(c, x - 16, y, 32, 96, 8), COL.woodDk, -12, 0, 0.5);
  line(c, [[x - 16, y + 62], [x + 16, y + 62]], 4); shape(c, () => ell(c, x, y + 62, 6, 6), COL.steelDk, 3);
};
// setup.e4.0
const c10 = (c: Ctx) => {
  ground(c);
  ORDER.forEach((mi, i) => {
    const x = 90 + 84 * i;
    shadow(c, x + 14, 620, 28, 300);
    mstrip(c, x, 300, 910, 56, MATS[mi]);
    line(c, [[x - 28, 820], [x + 28, 820]], 6, COL.greyDk);
  });
  shadow(c, 540, 332, 520, 14);
  shape(c, () => rrect(c, 14, 252, 1052, 50, 25), COL.wood); shade(c, () => rrect(c, 14, 252, 1052, 50, 25), COL.woodDk, 0, -16, 0.5);
  line(c, [[40, 266], [1040, 266]], 5, WHITE);
  ORDER.forEach((_, i) => peg(c, 90 + 84 * i, 240));
};
// setup.e4.1
const c11 = (c: Ctx) => {
  ground(c);
  const FL = 900, SY = 440;
  // timer on top
  shape(c, () => rrect(c, 505, 56, 70, 32, 8), COL.steelDk);
  shape(c, () => ell(c, 540, 190, 112, 112), COL.orange, 6);
  shape(c, () => ell(c, 540, 190, 86, 86), WHITE, 5);
  c.beginPath(); c.moveTo(540, 190); c.arc(540, 190, 80, -Math.PI / 2, -Math.PI / 2 + Math.PI / 6); c.closePath(); c.fillStyle = RED; c.fill();
  for (let k = 0; k < 12; k++) { const an = (k * Math.PI) / 6 - Math.PI / 2; line(c, [[540 + Math.cos(an) * 70, 190 + Math.sin(an) * 70], [540 + Math.cos(an) * 84, 190 + Math.sin(an) * 84]], 4); }
  write(c, "5", 566, 210, 40, INK, 6);
  // piles of books
  const piles: [number, string, string][] = [[20, COL.teal, COL.tealDk], [850, COL.purple, "#6a50a5"]];
  piles.forEach(([px, col, dk]) => { [COL.orange, col, COL.blue, COL.pink].forEach((cc, k) => book(c, px + (k % 2) * 10, FL - 110 * (k + 1), 190, 110, cc, k === 1 ? dk : "#5b4a8a")); });
  // tray cross-section: water, floor, two walls
  shape(c, () => rrect(c, 262, 750, 556, 112, 4), "#f6dc7a", 0);
  // strips
  const hs = [60, 120, 40, 90, 150, 70, 30, 110, 55, 130, 85, 45];
  ORDER.forEach((mi, i) => {
    const x = 300 + 44 * i;
    mstrip(c, x, SY, 810, 30, MATS[mi]);
    tint(c, x, 30, 760 - hs[i], 810, 40 + i);
    line(c, [[x - 15, 760], [x + 15, 760]], 5, COL.greyDk);
  });
  c.fillStyle = "rgba(246,200,60,0.35)"; c.fillRect(262, 760, 556, 102);
  line(c, [[262, 760], [818, 760]], 5, COL.orange);
  shape(c, () => rrect(c, 240, 700, 26, 180, 6), COL.steel); shape(c, () => rrect(c, 814, 700, 26, 180, 6), COL.steel);
  shape(c, () => rrect(c, 240, 856, 600, 26, 6), COL.steel);
  shade(c, () => rrect(c, 240, 856, 600, 26, 6), COL.steelDk, 0, -12, 0.5);
  // the broom handle across the piles
  shadow(c, 540, SY + 8, 520, 10);
  shape(c, () => rrect(c, 20, SY - 38, 1040, 38, 19), COL.wood); shade(c, () => rrect(c, 20, SY - 38, 1040, 38, 19), COL.woodDk, 0, -12, 0.5);
  line(c, [[44, SY - 28], [1036, SY - 28]], 4, WHITE);
  void FL;
};
// setup.e4.2
const c12 = (c: Ctx) => {
  ground(c, "#cfc8b8");
  shape(c, () => rrect(c, 40, 50, 1000, 980, 6), "#ece8dc");
  const r = rnd(9); c.fillStyle = COL.greyDk; c.globalAlpha = 0.3;
  for (let y = 80; y < 1010; y += 17) for (let col = 0; col < 3; col++) { const x0 = 70 + col * 320, w = 290 * (0.6 + r() * 0.4); c.fillRect(x0, y, w, 6); }
  c.fillRect(70, 62, 400, 3); c.globalAlpha = 1;
  const hs = [6.2, 4.1, 7.5, 2.8, 5.3], U = 55, L = 820, Y = 150;
  hs.forEach((h, i) => {
    const x = 380 + 135 * i, w = 100;
    shadow(c, x + 18, 500, 52, 380);
    mstrip(c, x, Y, 880, w, MATS[[0, 3, 0, 1, 5][i]]);
    tint(c, x, w, L - h * U, 880, 70 + i);
    line(c, [[x - w / 2, L], [x + w / 2, L]], 6, COL.greyDk);
  });
  ruler(c, 190, L, true, U, 10, 90, 22);
  const yt = L - hs[0] * U;
  line(c, [[190, yt], [440, yt]], 5, RED); arrow(c, [[520, yt], [450, yt]]);
  hand(c, 70, 560, 0, 1.4, SKIN.child, CLOTH.child, true);
};

export const su_materialsTestingMaterials = cards("sci.materials.testing-materials.L3 set-up", [c00, c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12]);
