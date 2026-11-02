import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, bowl, hand, person, write, glass, leaf, cards } from "./flatKit";


const OIL = "#f6c33b", CLOUD = "#f2e2a0", GERM = "#8b6cc9", HEAD = "#5b8fd6", TAIL = "#f39a3c", SOAPPINK = "#f29ab4";
const tap = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 10, y + 120, 40, 10);
  shape(c, () => rrect(c, x - 30, y - 30, 1000 - x, 60, 18), COL.steel);
  shade(c, () => rrect(c, x - 30, y - 30, 1000 - x, 60, 18), COL.steelDk, 0, 20);
  shape(c, () => rrect(c, 990, y - 80, 40, 160, 12), COL.steelDk);
  shape(c, () => rrect(c, x - 30, y - 30, 60, 110, 16), COL.steel);
  shape(c, () => rrect(c, x - 22, y + 70, 44, 30, 8), COL.steelDk);
  shape(c, () => rrect(c, x + 230, y - 56, 24, 30, 6), COL.steelDk);
  shape(c, () => ell(c, x + 242, y - 66, 46, 22), COL.teal);
};
const drop = (c: Ctx, x: number, y: number, s: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - s); c.quadraticCurveTo(x + s * 0.9, y + s * 0.2, x, y + s * 0.8); c.quadraticCurveTo(x - s * 0.9, y + s * 0.2, x, y - s); c.closePath(); }, col, 4);
const stream = (c: Ctx, x: number, y0: number, y1: number, w = 30) => { shape(c, () => rrect(c, x - w / 2, y0, w, y1 - y0, 8), COL.water, 5); shine(c, [[x - w * 0.2, y0 + 20], [x - w * 0.2, y1 - 20]], 6); };
const clock = (c: Ctx, x: number, y: number, r: number, sec: number, nums = true) => {
  shadow(c, x + 12, y + r * 0.95, r, r * 0.16);
  shape(c, () => ell(c, x, y, r, r), WHITE, 8);
  const a = (sec / 60) * Math.PI * 2 - Math.PI / 2;
  c.beginPath(); c.moveTo(x, y); c.arc(x, y, r - 12, -Math.PI / 2, a); c.closePath(); c.fillStyle = "#f5b7a8"; c.fill();
  for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(t) * (r - 12), y + Math.sin(t) * (r - 12)], [x + Math.cos(t) * (r - 30), y + Math.sin(t) * (r - 30)]], 6); }
  line(c, [[x, y], [x + Math.cos(a) * (r - 28), y + Math.sin(a) * (r - 28)]], 10, RED);
  shape(c, () => ell(c, x, y, 11, 11), INK, 0);
  if (nums) { const t = String(sec); write(c, t, x - t.length * 0.4 * 80 + 16, y + r + 30, 80, INK, 7); }
};
const jar = (c: Ctx, cx: number, base: number, w: number, h: number, layers: [number, string][], lid = false) => {
  shadow(c, cx + w * 0.12, base + 8, w * 0.62, w * 0.1);
  const body = () => rrect(c, cx - w / 2, base - h, w, h, 30);
  c.save(); c.beginPath(); body(); c.clip();
  let y = base;
  layers.forEach(([f, col]) => { const t = y - h * f; c.fillStyle = col; c.fillRect(cx - w, t, w * 2, y - t); c.fillStyle = "rgba(43,35,64,0.12)"; c.fillRect(cx + w * 0.22, t, w, y - t); line(c, [[cx - w, t], [cx + w, t]], 4); y = t; });
  c.restore();
  shape(c, body, "rgba(214,236,250,0.35)", 7);
  shine(c, [[cx - w * 0.36, base - h * 0.88], [cx - w * 0.36, base - h * 0.2]], 11);
  if (lid) { shape(c, () => rrect(c, cx - w / 2 - 8, base - h - 46, w + 16, 52, 14), COL.steel); shade(c, () => rrect(c, cx - w / 2 - 8, base - h - 46, w + 16, 52, 14), COL.steelDk, w * 0.3, 0); }
};
const bub = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.8)", Math.max(2, r * 0.12)); c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.3, Math.PI, Math.PI * 1.5); c.strokeStyle = "rgba(143,195,234,0.9)"; c.lineWidth = Math.max(2, r * 0.12); c.stroke(); };
const bar = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.55, y + h * 0.5 + 8, w * 0.6, h * 0.16);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.3), SOAPPINK); shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.3), "#c76a8a", w * 0.1, h * 0.14, 0.4);
  shape(c, () => rrect(c, x - w * 0.32, y - h * 0.26, w * 0.64, h * 0.52, h * 0.16), "#f7b9cb", 3);
  shine(c, [[x - w * 0.36, y - h * 0.32], [x - w * 0.1, y - h * 0.34]], 7);
};
const germ = (c: Ctx, x: number, y: number, r: number, rot = 0, rod = false) => {
  shape(c, () => rod ? ell(c, x, y, r * 1.6, r * 0.9, rot) : ell(c, x, y, r, r), GERM, Math.max(2.5, r * 0.14));
  c.save(); c.translate(x, y); c.rotate(rot);
  shade(c, () => rod ? ell(c, 0, 0, r * 1.6, r * 0.9) : ell(c, 0, 0, r, r), "#6b4fa8", r * 0.3, r * 0.3, 0.5);
  [-1, 1].forEach((s) => shape(c, () => ell(c, s * r * 0.38, -r * 0.1, r * 0.2, r * 0.26), WHITE, Math.max(1.5, r * 0.07)));
  [-1, 1].forEach((s) => shape(c, () => ell(c, s * r * 0.38, -r * 0.05, r * 0.08, r * 0.1), INK, 0));
  c.restore();
};
const microbe = (c: Ctx, x: number, y: number, r: number, rot: number, kind: "rod" | "ball" | "spiral") => {
  if (kind === "ball") { shape(c, () => ell(c, x, y, r, r), COL.greenLt, Math.max(2.5, r * 0.14)); shade(c, () => ell(c, x, y, r, r), COL.green, r * 0.3, r * 0.3, 0.5); shape(c, () => ell(c, x - r * 0.25, y - r * 0.25, r * 0.22, r * 0.18), COL.drop, 0); }
  else if (kind === "rod") { shape(c, () => ell(c, x, y, r * 1.7, r * 0.8, rot), COL.greenLt, Math.max(2.5, r * 0.14)); c.save(); c.beginPath(); ell(c, x, y, r * 1.7, r * 0.8, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.3, r * 1.7, r * 0.8, rot); c.fillStyle = COL.green; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1; }
  else { const pts: number[][] = []; for (let k = 0; k <= 12; k++) { const t = k / 12, u = (t - 0.5) * r * 4.2, v = Math.sin(t * Math.PI * 4) * r * 0.55; pts.push([x + u * Math.cos(rot) - v * Math.sin(rot), y + u * Math.sin(rot) + v * Math.cos(rot)]); } line(c, pts, r * 0.5 + 6, INK); line(c, pts, r * 0.5, COL.greenLt); }
};
const virus = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2; line(c, [[x + Math.cos(t) * r * 0.95, y + Math.sin(t) * r * 0.95], [x + Math.cos(t) * r * 1.35, y + Math.sin(t) * r * 1.35]], Math.max(3, r * 0.1)); shape(c, () => ell(c, x + Math.cos(t) * r * 1.4, y + Math.sin(t) * r * 1.4, r * 0.14, r * 0.14), COL.red, Math.max(2, r * 0.05)); }
  shape(c, () => ell(c, x, y, r, r), COL.pink, Math.max(3, r * 0.08));
  shape(c, () => ell(c, x, y, r * 0.72, r * 0.72), "#f7c5d5", Math.max(2, r * 0.05));
  shape(c, () => ell(c, x, y, r * 0.3, r * 0.3), COL.purple, Math.max(2, r * 0.05));
};
const oilBlob = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), OIL, 5); shade(c, () => ell(c, x, y, rx, ry), "#d9a21f", rx * 0.25, ry * 0.25, 0.5); shine(c, [[x - rx * 0.55, y - ry * 0.3], [x - rx * 0.25, y - ry * 0.55]], 7); };
// soap molecule: round blue water-loving head at (x, y), wavy orange oil-loving tail towards angle an
const soapMol = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  const L = 64 * s, nx = -Math.sin(an), ny = Math.cos(an), pts: number[][] = [];
  for (let k = 0; k <= 8; k++) { const t = k / 8, off = Math.sin(t * Math.PI * 3) * 6 * s, d = 12 * s + L * t; pts.push([x + Math.cos(an) * d + nx * off, y + Math.sin(an) * d + ny * off]); }
  line(c, pts, 11 * s + 4, INK); line(c, pts, 11 * s, TAIL);
  shape(c, () => ell(c, x, y, 15 * s, 15 * s), HEAD, Math.max(2.5, 4 * s));
  shape(c, () => ell(c, x - 5 * s, y - 5 * s, 4 * s, 3 * s), COL.drop, 0);
};
const face = (c: Ctx, x: number, y: number, r: number, puzzled = false, skin: string = SKIN.child) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), skin, 7);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 5);
  [-1, 1].forEach((s) => { shape(c, () => ell(c, x + s * r * 0.36, y + r * 0.12, r * 0.12, r * 0.16), INK, 0); });
  if (puzzled) { line(c, [[x - r * 0.6, y - r * 0.18], [x - r * 0.2, y - r * 0.16]], 6); line(c, [[x + r * 0.2, y - r * 0.32], [x + r * 0.6, y - r * 0.18]], 6); line(c, [[x - r * 0.2, y + r * 0.5], [x + r * 0.25, y + r * 0.45]], 6); }
  else { c.beginPath(); c.arc(x, y + r * 0.35, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }
};
// a skin-coloured hand shape plus its sleeve, flat on the card
const star = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => { for (let k = 0; k < 8; k++) { const t = (k / 8) * Math.PI * 2, rr = k % 2 ? r * 0.45 : r; c[k ? "lineTo" : "moveTo"](x + Math.cos(t) * rr, y + Math.sin(t) * rr); } c.closePath(); }, WHITE, 3); };
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col = "#fffaf0") => { shape(c, () => rrect(c, x, y, w, h, 36), col, 7); };

// ---- intro
const c_intro = (c: Ctx) => {
  ground(c);
  tap(c, 340, 100);
  stream(c, 340, 190, 575, 28);
  hand(c, 300, 640, -0.05, 3.0, SKIN.child, CLOTH.child, true);
  c.save(); c.translate(300, 640); c.rotate(-0.05); c.scale(3.0, 3.0);
  shape(c, () => ell(c, 12, 0, 36, 24), OIL, 1.8); shine(c, [[-12, -8], [10, -15]], 3);
  [[0, -4], [18, 6], [30, -6], [8, 10]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 5, 3.4), COL.drop, 1.2));
  c.restore();
  [[530, 700], [590, 760], [620, 840]].forEach(([x, y], i) => drop(c, x, y, 24 - i * 2));
  arrow(c, [[480, 690], [560, 740]], RED, 8);
  bar(c, 850, 880, 240, 110);
  [[770, 810, 26], [815, 790, 18], [930, 810, 22]].forEach(([x, y, r]) => bub(c, x, y, r));
  shape(c, () => rrect(c, 700, 480, 300, 130, 50), CLOTH.child, 7);
  face(c, 850, 340, 150, true);
};
// ---- summary
const c_summary = (c: Ctx) => {
  ground(c);
  tap(c, 260, 90);
  stream(c, 260, 180, 520, 26);
  hand(c, 210, 600, 0, 2.6, SKIN.child, CLOTH.child, true);
  [[290, 570, 26], [350, 590, 20], [410, 560, 24], [330, 620, 18], [440, 610, 16]].forEach(([x, y, r]) => bub(c, x, y, r));
  const cx = 770, cy = 590, R = 250;
  line(c, [[500, 540], [560, 400]], 6, INK); line(c, [[500, 640], [575, 770]], 6, INK);
  c.save(); c.beginPath(); ell(c, cx, cy, R, R); c.clip(); c.fillStyle = COL.water; c.fillRect(cx - R, cy - R, R * 2, R * 2);
  for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2 + 0.2; soapMol(c, cx + Math.cos(t) * 135, cy + Math.sin(t) * 135, t + Math.PI, 1.0); }
  oilBlob(c, cx, cy, 80, 62); germ(c, cx, cy, 30);
  c.restore();
  c.beginPath(); ell(c, cx, cy, R, R); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
  shadow(c, 350, 960, 150, 24);
  shape(c, () => rrect(c, 210, 900, 280, 60, 20), COL.steelDk);
  for (let i = 0; i < 6; i++) line(c, [[250 + i * 40, 915], [250 + i * 40, 945]], 8, INK);
  arrow(c, [[300, 690], [300, 880]]); arrow(c, [[560, 830], [440, 890]]);
};
// ---- flow.e1 : three washes, three amounts of yellow
const palm = (c: Ctx, x: number, y: number, spots: number) => {
  hand(c, x, y, -Math.PI / 2, 2.2, SKIN.child, CLOTH.child, true);
  const r = rnd(spots * 7 + 1);
  c.save(); c.translate(x, y); c.rotate(-Math.PI / 2); c.scale(2.2, 2.2);
  for (let i = 0; i < spots; i++) shape(c, () => ell(c, -14 + r() * 80, -26 + r() * 52, 5 + r() * 5, 4 + r() * 4), "#e8a417", 1.4);
  c.restore();
};
const c_e1 = (c: Ctx) => {
  ground(c);
  const xs = [190, 540, 890];
  palm(c, xs[0], 640, 20); palm(c, xs[1], 640, 9); palm(c, xs[2], 640, 0);
  drop(c, xs[0], 920, 60);
  bar(c, xs[1], 880, 170, 80); write(c, "5", xs[1] - 26, 940, 100, INK, 8);
  bar(c, xs[2], 880, 170, 80); write(c, "20", xs[2] - 55, 940, 100, INK, 8);
};
// ---- flow.e3 : shake the soap jar, the plain jar stays apart
const c_e3 = (c: Ctx) => {
  ground(c);
  jar(c, 310, 840, 300, 520, [[0.8, CLOUD]], true);
  const r = rnd(4);
  for (let i = 0; i < 26; i++) bub(c, 190 + r() * 240, 560 + r() * 250, 6 + r() * 8);
  jar(c, 780, 840, 300, 520, [[0.5, COL.water], [0.28, OIL]], true);
  arrow(c, [[190, 250], [190, 150]]); arrow(c, [[430, 150], [430, 250]]);
  clock(c, 780, 190, 90, 15, false);
};
// ---- flow.a1 : counting face touches
const c_a1 = (c: Ctx) => {
  ground(c);
  face(c, 380, 450, 230);
  hand(c, 190, 820, -0.9, 2.4, SKIN.child, CLOTH.child, true);
  arrow(c, [[330, 690], [370, 600]]);
  shadow(c, 800, 960, 200, 24);
  shape(c, () => rrect(c, 640, 330, 300, 620, 24), WHITE, 7);
  for (let k = 0; k < 4; k++) line(c, [[690 + k * 24, 400], [690 + k * 24, 480]], 8);
  line(c, [[670, 460], [790, 420]], 8, RED);
  for (let k = 0; k < 3; k++) line(c, [[690 + k * 24, 560], [690 + k * 24, 640]], 8);
  line(c, [[690, 760], [700, 840]], 8);
  line(c, [[640, 330], [940, 330]], 5, COL.greyDk);
  shape(c, () => rrect(c, 660, 290, 260, 50, 14), COL.teal);
};
// ---- flow.a3 : still water in a pot tray, a mosquito, a notebook of ticks and crosses
const mosquito = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(-0.4); c.scale(s, s);
  [[-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]].forEach(([a, b]) => line(c, [[a * 12, 0], [a * 34, b * 34], [a * 46, b * 70]], 7));
  shape(c, () => ell(c, -6, -34, 44, 16, -0.5), "rgba(214,236,250,0.85)", 5); shape(c, () => ell(c, 18, -38, 44, 16, -0.2), "rgba(214,236,250,0.85)", 5);
  line(c, [[56, 0], [118, 6]], 6);
  shape(c, () => ell(c, 0, 0, 60, 20), COL.greyDk, 6);
  shape(c, () => ell(c, 50, 0, 18, 16), COL.black, 5);
  c.restore();
};
const c_a3 = (c: Ctx) => {
  ground(c);
  shadow(c, 350, 900, 230, 30);
  shape(c, () => ell(c, 340, 860, 230, 60), "#c9683c", 7);
  shape(c, () => ell(c, 340, 850, 195, 42), COL.water, 5);
  shine(c, [[230, 846], [300, 838]], 7);
  shape(c, () => { c.moveTo(230, 520); c.lineTo(450, 520); c.lineTo(410, 820); c.lineTo(270, 820); c.closePath(); }, "#e58a4f", 7);
  shade(c, () => { c.moveTo(230, 520); c.lineTo(450, 520); c.lineTo(410, 820); c.lineTo(270, 820); c.closePath(); }, "#c9683c", 50, 0, 0.5);
  shape(c, () => rrect(c, 215, 480, 250, 60, 16), "#e58a4f", 7);
  [-0.9, 0, 0.9].forEach((a) => leaf(c, 340, 490, 170, -Math.PI / 2 + a * 0.55, COL.leaf));
  mosquito(c, 460, 280, 1.5);
  shadow(c, 800, 960, 180, 20);
  shape(c, () => rrect(c, 640, 360, 300, 580, 24), WHITE, 7);
  [440, 590, 740].forEach((y, i) => {
    line(c, [[700, y + 40], [900, y + 40]], 5, COL.grey);
    if (i % 2 === 0) line(c, [[680, y], [705, y + 30], [750, y - 25]], 12, COL.green); else { line(c, [[690, y - 20], [740, y + 30]], 12, RED); line(c, [[740, y - 20], [690, y + 30]], 12, RED); }
  });
};
// ---- flow.a5 : the outline of a child on big paper, with care things around it
const c_a5 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 440, 30);
  shape(c, () => rrect(c, 120, 80, 840, 890, 18), WHITE, 7);
  const limb = (pts: number[][]) => { line(c, pts, 78, COL.blueDk); };
  const limbFill = (pts: number[][]) => { line(c, pts, 54, "#fff6e6"); };
  const arms = [[[440, 380], [260, 440]], [[640, 380], [820, 440]]], legs = [[[500, 650], [440, 880]], [[580, 650], [650, 880]]];
  [...arms, ...legs].forEach(limb);
  c.beginPath(); rrect(c, 424, 330, 232, 340, 50); c.fillStyle = COL.blueDk; c.lineWidth = 24; c.strokeStyle = COL.blueDk; c.stroke(); c.fill();
  c.beginPath(); ell(c, 540, 230, 100, 110); c.lineWidth = 24; c.stroke(); c.fill();
  [...arms, ...legs].forEach(limbFill);
  shape(c, () => rrect(c, 436, 342, 208, 316, 40), "#fff6e6", 0);
  shape(c, () => ell(c, 540, 230, 88, 98), "#fff6e6", 0);
  // care things
  c.save(); c.translate(270, 190); c.rotate(-0.5);
  shape(c, () => rrect(c, -90, -12, 120, 26, 10), COL.teal, 5); shape(c, () => rrect(c, 30, -18, 60, 36, 6), WHITE, 5); for (let k = 0; k < 4; k++) line(c, [[40 + k * 14, -18], [40 + k * 14, -40]], 5);
  c.restore();
  c.save(); c.translate(830, 180); c.rotate(0.2); shape(c, () => rrect(c, -80, -20, 160, 40, 10), COL.orange, 5); for (let k = 0; k < 9; k++) line(c, [[-70 + k * 17, 20], [-70 + k * 17, 44]], 5); c.restore();
  [[400, 920], [690, 920]].forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 38, 20, i ? 0.3 : -0.3), COL.pink, 5); });
  c.save(); c.translate(810, 700); c.rotate(-0.5); shape(c, () => rrect(c, -14, -90, 28, 130, 8), RED, 5); shape(c, () => rrect(c, -14, 30, 28, 40, 6), COL.black, 5); c.restore();
  arrow(c, [[720, 780], [770, 840]], RED, 8);
};
// ---- flow.a6 : a washing line of pegged cards
const clothesCard = (c: Ctx, x: number, y: number, draw: (cx: number, cy: number) => void) => {
  shadow(c, x + 95, y + 270, 90, 12);
  shape(c, () => rrect(c, x, y, 170, 250, 14), WHITE, 6);
  draw(x + 85, y + 135);
  shape(c, () => rrect(c, x + 60, y - 30, 22, 70, 6), COL.wood, 5); shape(c, () => rrect(c, x + 92, y - 30, 22, 70, 6), COL.wood, 5);
};
const c_a6 = (c: Ctx) => {
  ground(c);
  line(c, [[20, 260], [540, 330], [1060, 260]], 9, COL.greyDk);
  const mk: ((cx: number, cy: number) => void)[] = [
    (cx, cy) => { line(c, [[cx + 22, cy + 22], [cx + 56, cy + 62]], 18, COL.brown); shape(c, () => ell(c, cx - 10, cy - 10, 48, 48), COL.glass, 8); shine(c, [[cx - 38, cy - 20], [cx - 22, cy - 40]], 7); },
    (cx, cy) => { bowl(c, cx, cy - 10, 62, COL.water); hand(c, cx - 40, cy - 55, 0, 0.55, SKIN.adult, CLOTH.adult, true); },
    (cx, cy) => { shape(c, () => rrect(c, cx - 34, cy - 70, 68, 150, 8), COL.blue, 5); shape(c, () => rrect(c, cx - 24, cy - 100, 48, 40, 8), COL.steelDk, 5); shape(c, () => rrect(c, cx + 20, cy - 24, 52, 18, 6), COL.steelDk, 5); drop(c, cx + 62, cy + 20, 14); drop(c, cx + 62, cy + 54, 12); },
    (cx, cy) => { shape(c, () => ell(c, cx - 8, cy + 36, 46, 46), COL.glass, 6); line(c, [[cx - 8, cy - 6], [cx - 8, cy - 50], [cx + 8, cy - 84], [cx + 44, cy - 74]], 14, INK); line(c, [[cx - 8, cy - 6], [cx - 8, cy - 50], [cx + 8, cy - 84], [cx + 44, cy - 74]], 7, COL.glass); shape(c, () => ell(c, cx - 8, cy + 56, 36, 24), COL.water, 0); },
    (cx, cy) => { shape(c, () => rrect(c, cx - 40, cy + 62, 80, 18, 6), COL.black, 5); shape(c, () => rrect(c, cx - 8, cy - 70, 16, 130, 6), COL.steelDk, 5); c.save(); c.translate(cx + 4, cy - 10); c.rotate(0.35); shape(c, () => rrect(c, -14, -78, 28, 100, 6), COL.steel, 5); shape(c, () => rrect(c, -9, 22, 18, 22, 4), COL.steelDk, 5); c.restore(); shape(c, () => rrect(c, cx - 30, cy + 44, 60, 12, 4), COL.steelDk, 4); },
  ];
  [35, 245, 455, 665, 875].forEach((x, i) => { const sy = 300 + 70 * (1 - Math.abs((x + 85 - 540) / 540)) * 0.9; clothesCard(c, x, sy + 15 + (i === 2 ? 0 : 0), mk[i]); });
  write(c, "1500", 40, 90, 70, INK, 8);
  arrow(c, [[250, 140], [760, 140]]);
  star(c, 960, 110, 40);
};
// ---- project p1 : the tippy-tap
const c_p1 = (c: Ctx) => {
  ground(c);
  [[150, 190, 40, 780], [770, 190, 40, 780]].forEach(([x, y, w, h]) => shape(c, () => rrect(c, x, y, w, h, 10), COL.brown, 7));
  shape(c, () => rrect(c, 120, 170, 720, 56, 14), COL.wood, 7);
  line(c, [[470, 226], [470, 300]], 6);
  c.save(); c.translate(470, 300); c.rotate(0.28);
  shadow(c, 20, 570, 60, 14);
  shape(c, () => rrect(c, -80, 40, 160, 380, 40), COL.glass, 7);
  c.save(); c.beginPath(); rrect(c, -80, 40, 160, 380, 40); c.clip(); c.fillStyle = COL.water; c.fillRect(-90, 160, 180, 270); c.restore();
  shape(c, () => rrect(c, -80, 40, 160, 380, 40), "rgba(214,236,250,0.25)", 7);
  shape(c, () => rrect(c, -34, -10, 68, 60, 12), COL.glass, 6); shape(c, () => rrect(c, -40, -36, 80, 40, 10), COL.teal, 6);
  shape(c, () => ell(c, -80, 190, 10, 10), INK, 0);
  c.restore();
  shape(c, () => { c.moveTo(0, 0); }, "rgba(0,0,0,0)", 0);
  c.beginPath(); c.moveTo(335, 470); c.quadraticCurveTo(250, 470, 235, 700); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.moveTo(335, 470); c.quadraticCurveTo(250, 470, 235, 700); c.strokeStyle = COL.water; c.lineWidth = 12; c.stroke();
  [[225, 740, 18], [232, 810, 14]].forEach(([x, y, s]) => drop(c, x, y, s));
  line(c, [[690, 226], [690, 330]], 5); bar(c, 690, 380, 130, 70);
  line(c, [[500, 300], [560, 700], [600, 880]], 5);
  shadow(c, 620, 930, 150, 16);
  shape(c, () => rrect(c, 520, 880, 200, 44, 14), COL.wood, 7);
  arrow(c, [[640, 780], [640, 860]]);
  shape(c, () => ell(c, 220, 910, 90, 24), COL.soilDk, 5);
};
// ---- challenge c1 : a pretend sneeze, a card in the way
const c_c1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 800, 1000, 150, 16), "#e7e1d3", 6);
  for (let k = 0; k < 7; k++) { line(c, [[80 + k * 140, 830], [180 + k * 140, 830]], 8, COL.grey); line(c, [[80 + k * 140, 870], [160 + k * 140, 870]], 8, COL.grey); }
  shadow(c, 160, 780, 90, 14);
  shape(c, () => rrect(c, 90, 500, 130, 270, 34), COL.teal); shade(c, () => rrect(c, 90, 500, 130, 270, 34), COL.tealDk, 30, 0, 0.5);
  shape(c, () => rrect(c, 110, 380, 150, 150, 20), COL.steel); shape(c, () => rrect(c, 230, 390, 60, 40, 8), COL.steelDk); shape(c, () => rrect(c, 90, 440, 40, 70, 8), COL.steel);
  const r = rnd(3);
  for (let i = 0; i < 26; i++) { const t = r(), x = 320 + t * 260, y = 405 + (r() - 0.35) * t * 330 + t * t * 80; drop(c, x, y, 9 + r() * 6, COL.waterDk); }
  shadow(c, 700, 790, 40, 10);
  shape(c, () => rrect(c, 680, 300, 40, 480, 8), WHITE, 6); shape(c, () => rrect(c, 620, 260, 160, 120, 16), "#fffaf0", 6);
  for (let i = 0; i < 4; i++) drop(c, 860 + r() * 120, 640 + i * 28 + r() * 20, 10, COL.waterDk);
  [[400, 810], [470, 830], [540, 815], [600, 835]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 12, 8), COL.waterDk, 0));
  arrow(c, [[320, 250], [600, 250]]);
};
// ---- challenge c2 : a soap on a string in a net bag, and a soap dish with holes
const c_c2 = (c: Ctx) => {
  ground(c);
  tap(c, 540, 100);
  line(c, [[220, 130], [220, 330]], 7);
  shape(c, () => { c.moveTo(130, 380); c.quadraticCurveTo(220, 330, 310, 380); c.quadraticCurveTo(330, 590, 220, 640); c.quadraticCurveTo(110, 590, 130, 380); c.closePath(); }, "rgba(255,250,240,0.6)", 6);
  bar(c, 220, 520, 150, 80);
  c.save(); c.beginPath(); c.moveTo(130, 380); c.quadraticCurveTo(220, 330, 310, 380); c.quadraticCurveTo(330, 590, 220, 640); c.quadraticCurveTo(110, 590, 130, 380); c.closePath(); c.clip();
  for (let k = -4; k < 12; k++) { line(c, [[110 + k * 30, 330], [110 + k * 30 + 160, 650]], 3, COL.greyDk); line(c, [[330 + k * 30, 330], [330 + k * 30 - 160, 650]], 3, COL.greyDk); }
  c.restore();
  stream(c, 540, 190, 670, 26);
  shadow(c, 540, 840, 220, 30);
  shape(c, () => rrect(c, 380, 700, 320, 130, 30), COL.teal); shade(c, () => rrect(c, 380, 700, 320, 130, 30), COL.tealDk, 40, 0, 0.5);
  shape(c, () => ell(c, 540, 700, 160, 34), COL.tealDk, 6);
  bar(c, 540, 676, 180, 70);
  [450, 505, 560, 615].forEach((x) => shape(c, () => rrect(c, x - 8, 760, 16, 40, 8), INK, 0));
  drop(c, 440, 880, 14); drop(c, 640, 890, 14); drop(c, 540, 930, 14);
  [[800, 420], [880, 470], [840, 540]].forEach(([x, y], i) => bub(c, x, y, 26 - i * 4));
  shape(c, () => rrect(c, 770, 600, 200, 260, 40), COL.pink, 6); shape(c, () => rrect(c, 840, 560, 60, 50, 8), COL.steelDk, 6); shape(c, () => rrect(c, 800, 540, 140, 34, 10), COL.steel, 6);
};
// ---- shared small things
const vada = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.8), "#c98a3c", 6); shade(c, () => ell(c, x, y, r, r * 0.8), "#a46a22", r * 0.2, r * 0.2, 0.5); shape(c, () => ell(c, x, y, r * 0.3, r * 0.24), "#efe4cf", 5); };
const mouth = (c: Ctx, x: number, y: number, w: number) => { shape(c, () => ell(c, x, y, w, w * 0.55), COL.red, 7); shape(c, () => ell(c, x, y - w * 0.05, w * 0.7, w * 0.28), WHITE, 4); };
const dirtBall = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.red, 7); shade(c, () => ell(c, x, y, r, r), "#b83a28", r * 0.3, r * 0.3, 0.5); shape(c, () => ell(c, x - r * 0.3, y - r * 0.35, r * 0.2, r * 0.14), "#f6a493", 0); };
const handFlat = (c: Ctx, x: number, y: number, an: number, s: number) => hand(c, x, y, an, s, SKIN.child, CLOTH.child, true);
const skinBand = (c: Ctx, y: number, h: number) => { shape(c, () => rrect(c, -40, y, 1160, h, 0), "#c98f66", 7); shade(c, () => rrect(c, -40, y, 1160, h, 0), SKIN.childDk, 0, 40, 0.4); };
// ---- expl.0 : germs travel dirty ball -> hand -> vada -> mouth, soap breaks the chain
const c_x0 = (c: Ctx) => {
  ground(c);
  dirtBall(c, 150, 400, 80); [[125, 370], [180, 430]].forEach(([x, y]) => germ(c, x, y, 18));
  arrow(c, [[190, 480], [250, 570]]);
  handFlat(c, 250, 680, 0, 1.5); germ(c, 400, 660, 20); germ(c, 440, 700, 16);
  arrow(c, [[480, 640], [560, 600]]);
  vada(c, 680, 600, 100); germ(c, 670, 560, 20);
  arrow(c, [[800, 600], [850, 600]]);
  mouth(c, 960, 600, 80);
  bar(c, 540, 280, 260, 120); [[440, 230, 26], [660, 230, 22], [620, 180, 18]].forEach(([x, y, r]) => bub(c, x, y, r));
  line(c, [[500, 530], [610, 650]], 22, RED); line(c, [[610, 530], [500, 650]], 22, RED);
};
// ---- expl.1 : water slides over the oily skin and leaves the germs
const c_x1 = (c: Ctx) => {
  ground(c);
  skinBand(c, 700, 380);
  shape(c, () => { c.moveTo(-40, 700); c.quadraticCurveTo(540, 640, 1120, 700); c.lineTo(1120, 660); c.quadraticCurveTo(540, 600, -40, 660); c.closePath(); }, OIL, 6);
  [[160, 660], [380, 650], [560, 640], [800, 650], [960, 660]].forEach(([x, y], i) => germ(c, x, y, 28, 0, i % 2 === 0));
  [[260, 520], [520, 480], [800, 520]].forEach(([x, y]) => { drop(c, x, y, 50); });
  [[260, 520], [520, 480], [800, 520]].forEach(([x, y]) => arrow(c, [[x + 10, y + 70], [x + 130, y + 110]], RED, 9));
  shine(c, [[100, 690], [300, 676]], 8);
};
// ---- expl.2 : four steps down to the molecules
const c_x2 = (c: Ctx) => {
  ground(c);
  const P = [[30, 30], [560, 30], [30, 560], [560, 560]];
  P.forEach(([x, y]) => panel(c, x, y, 490, 490));
  // 1 soapy hands
  handFlat(c, 220, 330, -0.1, 1.9); [[330, 290, 28], [390, 270, 22], [360, 340, 20], [430, 310, 18]].forEach(([x, y, r]) => bub(c, x, y, r));
  // 2 oil blob on skin with germ
  c.save(); c.beginPath(); rrect(c, 560, 30, 490, 490, 36); c.clip(); skinBand(c, 400, 200); c.restore();
  oilBlob(c, 800, 330, 130, 70); germ(c, 800, 320, 28);
  // 3 soap heads in, tails first into the oil
  c.save(); c.beginPath(); rrect(c, 30, 560, 490, 490, 36); c.clip(); skinBand(c, 910, 200);
  oilBlob(c, 275, 840, 130, 70); germ(c, 275, 830, 28);
  [[170, 700, 1.5], [250, 690, 1.5], [330, 700, 1.5], [390, 740, 1.2], [150, 770, 1.9]].forEach(([x, y, a]) => soapMol(c, x, y, a, 0.9));
  c.restore();
  // 4 the finished ball floats off
  c.save(); c.beginPath(); rrect(c, 560, 560, 490, 490, 36); c.clip(); c.fillStyle = COL.water; c.fillRect(560, 560, 490, 490); c.restore();
  panel(c, 560, 560, 490, 490, "rgba(0,0,0,0)");
  for (let i = 0; i < 10; i++) { const t = (i / 10) * Math.PI * 2; soapMol(c, 805 + Math.cos(t) * 110, 800 + Math.sin(t) * 110, t + Math.PI, 0.9); }
  oilBlob(c, 805, 800, 66, 50); germ(c, 805, 800, 22);
  arrow(c, [[500, 270], [585, 270]]); arrow(c, [[800, 525], [800, 580]]); arrow(c, [[500, 770], [585, 800]]);
};
// ---- expl.4 : visitors lifted off, residents stay in the folds
const c_x4 = (c: Ctx) => {
  ground(c);
  skinBand(c, 650, 430);
  [[220, 0], [540, 0], [860, 0]].forEach(([x]) => shape(c, () => { c.moveTo(x - 90, 650); c.quadraticCurveTo(x, 800, x + 90, 650); c.closePath(); }, "#8f5a3c", 6));
  [[200, 690], [235, 705], [530, 705], [560, 690], [850, 700], [880, 690]].forEach(([x, y], i) => microbe(c, x, y, 16, i, "ball"));
  germ(c, 560, 620, 24, 0, true);
  [[130, 520], [400, 500], [700, 500]].forEach(([x, y]) => bub(c, x, y, 70));
  [[130, 520], [400, 500], [700, 500]].forEach(([x, y], i) => germ(c, x, y - 10, 24, 0, i === 1));
  arrow(c, [[200, 420], [800, 330]]);
  shape(c, () => rrect(c, 820, 200, 200, 70, 14), COL.steelDk, 6); for (let i = 0; i < 4; i++) line(c, [[850 + i * 45, 215], [850 + i * 45, 255]], 8, INK);
};
// ---- expl.8 : a lane kept clean
const house = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { shape(c, () => rrect(c, x, y, w, h, 8), col, 7); shape(c, () => rrect(c, x + w * 0.35, y + h * 0.45, w * 0.3, h * 0.55, 6), COL.brown, 5); shape(c, () => rrect(c, x + w * 0.1, y + h * 0.15, w * 0.2, h * 0.2, 4), COL.sky, 5); shape(c, () => rrect(c, x + w * 0.7, y + h * 0.15, w * 0.2, h * 0.2, 4), COL.sky, 5); };
const c_x8 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => rrect(c, -20, 640, 1120, 460, 0), "#d9cdb2", 7);
  house(c, 40, 280, 380, 400, "#f6c17a"); house(c, 640, 240, 400, 440, "#9ccf62");
  shape(c, () => rrect(c, 90, 150, 140, 130, 14), COL.blue, 7); shape(c, () => rrect(c, 80, 130, 160, 34, 12), COL.blueDk, 6);
  shape(c, () => rrect(c, 40, 780, 360, 70, 12), COL.steelDk, 7); for (let k = 0; k < 6; k++) line(c, [[80 + k * 56, 795], [80 + k * 56, 835]], 8);
  shadow(c, 930, 850, 90, 14);
  c.save(); c.translate(930, 860); c.rotate(2.6); shape(c, () => { c.moveTo(-70, 0); c.lineTo(70, 0); c.lineTo(50, 90); c.lineTo(-50, 90); c.closePath(); }, "#e58a4f", 7); shape(c, () => rrect(c, -85, -24, 170, 34, 10), "#e58a4f", 7); c.restore();
  person(c, 520, 1000, 330, { adult: true, armR: [-0.2, -0.1] });
  person(c, 740, 1020, 230, {});
};
// ---- terms
const tile = (c: Ctx, x: number, y: number, draw: (cx: number, cy: number) => void) => { panel(c, x, y, 480, 480); draw(x + 240, y + 240); };
const c_t0 = (c: Ctx) => {
  ground(c);
  tile(c, 40, 40, (cx, cy) => { handFlat(c, cx - 80, cy, 0, 1.4); [[cx + 70, cy - 20, 24], [cx + 130, cy + 20, 18], [cx + 90, cy + 50, 20]].forEach(([x, y, r]) => bub(c, x, y, r)); });
  tile(c, 560, 40, (cx, cy) => { shape(c, () => { c.moveTo(cx - 140, cy - 80); c.bezierCurveTo(cx - 190, cy + 100, cx - 100, cy + 190, cx, cy + 190); c.bezierCurveTo(cx + 100, cy + 190, cx + 190, cy + 100, cx + 140, cy - 80); c.closePath(); }, "#e58a4f", 7); shape(c, () => rrect(c, cx - 150, cy - 130, 300, 70, 30), COL.steel, 7); shape(c, () => ell(c, cx, cy - 138, 40, 16), COL.steelDk, 5); });
  tile(c, 40, 560, (cx, cy) => { c.save(); c.translate(cx, cy); c.rotate(-0.5); shape(c, () => rrect(c, -170, -20, 270, 40, 18), COL.teal, 6); shape(c, () => rrect(c, 80, -34, 90, 68, 10), WHITE, 6); for (let k = 0; k < 6; k++) line(c, [[90 + k * 13, -34], [90 + k * 13, -64]], 6); c.restore(); });
  tile(c, 560, 560, (cx, cy) => { c.save(); c.translate(cx, cy); c.rotate(0.6); line(c, [[0, -190], [0, 40]], 16, COL.brown); shape(c, () => { c.moveTo(-70, 40); c.lineTo(70, 40); c.lineTo(100, 190); c.lineTo(-100, 190); c.closePath(); }, COL.wood, 7); for (let k = -2; k <= 2; k++) line(c, [[k * 30, 80], [k * 36, 180]], 4); c.restore(); });
};
const c_t1 = (c: Ctx) => {
  ground(c);
  line(c, [[700, 730], [930, 960]], 60, INK); line(c, [[700, 730], [930, 960]], 44, COL.brown);
  c.save(); c.beginPath(); ell(c, 450, 480, 340, 340); c.clip(); c.fillStyle = COL.drop; c.fillRect(100, 140, 700, 700);
  const r = rnd(5); const ks: ("rod" | "ball" | "spiral")[] = ["rod", "ball", "spiral"];
  [[330, 330], [560, 300], [450, 480], [260, 520], [640, 500], [380, 690], [570, 690], [460, 290]].forEach(([x, y], i) => microbe(c, x, y, 32, r() * 3, ks[i % 3]));
  c.restore();
  c.beginPath(); ell(c, 450, 480, 340, 340); c.strokeStyle = INK; c.lineWidth = 34; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 20; c.stroke();
  shine(c, [[230, 300], [300, 230]], 14);
};
const c_t2 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 450, 450), COL.drop, 9);
  const ks: ("rod" | "ball")[] = ["rod", "ball"]; const r = rnd(11);
  const pts = [[260, 300], [420, 220], [640, 240], [790, 330], [200, 520], [340, 440], [500, 380], [680, 470], [860, 560], [260, 700], [420, 620], [560, 740], [740, 700], [880, 400], [360, 820], [680, 840], [150, 400]];
  pts.forEach(([x, y], i) => { if (i === 5 || i === 11) return; microbe(c, x, y, 34, r() * 3, ks[i % 2]); });
  [[340, 440], [560, 740]].forEach(([x, y]) => { germ(c, x, y, 40); c.beginPath(); ell(c, x, y, 70, 70); c.strokeStyle = RED; c.lineWidth = 10; c.stroke(); });
};
const c_t4 = (c: Ctx) => {
  ground(c);
  microbe(c, 400, 700, 200, -0.2, "rod");
  virus(c, 860, 300, 100);
  arrow(c, [[840, 440], [700, 560]], RED, 8);
};
const c_t5 = (c: Ctx) => {
  ground(c);
  drop(c, 230, 400, 150);
  line(c, [[300, 200], [540, 330]], 6); line(c, [[330, 530], [520, 820]], 6);
  c.save(); c.beginPath(); ell(c, 720, 600, 330, 330); c.clip(); c.fillStyle = COL.water; c.fillRect(380, 260, 700, 700);
  [[600, 450, 0.3], [820, 480, -0.4], [640, 700, 3.4], [840, 720, 2.6]].forEach(([x, y, a]) => {
    c.save(); c.translate(x, y); c.rotate(a);
    [-1, 1].forEach((s) => { line(c, [[0, 0], [Math.sin(0.9) * s * 70, Math.cos(0.9) * 70]], 10); });
    [-1, 1].forEach((s) => shape(c, () => ell(c, Math.sin(0.9) * s * 70, Math.cos(0.9) * 70, 24, 24), WHITE, 5));
    shape(c, () => ell(c, 0, 0, 42, 42), COL.red, 6);
    c.restore();
  });
  c.restore();
  c.beginPath(); ell(c, 720, 600, 330, 330); c.strokeStyle = INK; c.lineWidth = 10; c.stroke();
};
const c_t6 = (c: Ctx) => {
  ground(c);
  drop(c, 90, 540, 100);
  soapMol(c, 240, 540, 0, 4.5);
  oilBlob(c, 790, 540, 220, 160);
};
const c_t7 = (c: Ctx) => { ground(c); jar(c, 540, 930, 420, 760, [[0.5, COL.water], [0.28, OIL]]); };
const c_t8 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 540, 460, 460), COL.water, 9);
  for (let i = 0; i < 14; i++) { const t = (i / 14) * Math.PI * 2; soapMol(c, 540 + Math.cos(t) * 210, 540 + Math.sin(t) * 210, t + Math.PI, 1.5); }
  oilBlob(c, 540, 540, 120, 100);
};
const c_t13 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 600, 330, COL.water);
  const r = rnd(9);
  [[400, 590], [540, 620], [680, 590], [470, 650], [620, 655]].forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 70, 38, (i - 2) * 0.25), "#8a5a3c", 6); line(c, [[x - 40, y], [x + 40, y - 6]], 4, COL.soilDk); });
  for (let i = 0; i < 22; i++) bub(c, 300 + r() * 480, 520 + r() * 90, 22 + r() * 24);
};
const c_t15 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 330, 30);
  shape(c, () => rrect(c, 230, 880, 620, 70, 14), COL.black, 7);
  [[330, 0], [540, 0], [750, 0]].forEach(([x]) => { shape(c, () => { c.moveTo(x - 40, 880); c.quadraticCurveTo(x - 50, 800, x, 740); c.quadraticCurveTo(x + 50, 800, x + 40, 880); c.closePath(); }, COL.orange, 6); });
  shape(c, () => rrect(c, 240, 480, 600, 380, 40), COL.steel, 7); shade(c, () => rrect(c, 240, 480, 600, 380, 40), COL.steelDk, 80, 0, 0.5);
  shape(c, () => rrect(c, 160, 560, 90, 40, 14), COL.steelDk, 6); shape(c, () => rrect(c, 830, 560, 90, 40, 14), COL.steelDk, 6);
  shape(c, () => ell(c, 540, 480, 300, 62), COL.water, 7);
  [[420, 470, 22], [520, 490, 28], [640, 470, 24], [700, 495, 18], [470, 440, 16]].forEach(([x, y, r]) => bub(c, x, y, r));
  [380, 540, 700].forEach((x) => arrow(c, [[x, 400], [x, 250]], COL.greyDk, 9));
};
const c_t16 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => rrect(c, -20, 700, 1120, 400, 0), "#d9cdb2", 7);
  shape(c, () => rrect(c, 60, 360, 340, 340, 10), COL.teal, 7); shape(c, () => rrect(c, 160, 480, 140, 220, 8), WHITE, 6); shape(c, () => ell(c, 230, 560, 20, 20), COL.tealDk, 5);
  shape(c, () => rrect(c, 40, 760, 380, 70, 12), COL.steelDk, 7); for (let k = 0; k < 6; k++) line(c, [[80 + k * 58, 775], [80 + k * 58, 815]], 8);
  person(c, 700, 950, 440, { adult: true, armR: [0.5, 0.9], armL: [0.7, 1.1] });
  c.save(); c.translate(800, 780); c.rotate(0.45); line(c, [[0, -250], [0, 80]], 14, COL.brown); shape(c, () => { c.moveTo(-60, 80); c.lineTo(60, 80); c.lineTo(80, 190); c.lineTo(-80, 190); c.closePath(); }, COL.wood, 7); c.restore();
  arrow(c, [[930, 900], [1040, 880]]);
};
const c_t17 = (c: Ctx) => {
  ground(c);
  face(c, 540, 540, 330);
  const g = (x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = "rgba(242,154,180,0.55)"; c.fill(); c.strokeStyle = SOAPPINK; c.lineWidth = 8; c.stroke(); };
  g(540 - 119, 540 + 40, 62, 70); g(540 + 119, 540 + 40, 62, 70);
  shape(c, () => ell(c, 540, 650, 32, 20), SKIN.childDk, 5); g(540, 650, 70, 48);
  g(540, 710, 110, 50);
  [[-119], [119]].forEach(([dx]) => shape(c, () => ell(c, 540 + dx, 580, 40, 50), INK, 0));
};
const c_t18 = (c: Ctx) => {
  ground(c);
  handFlat(c, 220, 380, Math.PI / 2, 2.4); handFlat(c, 860, 380, Math.PI / 2, 2.4);
  drop(c, 150, 110, 55); drop(c, 250, 210, 55);
  bar(c, 860, 140, 220, 100); [[780, 90, 22], [940, 100, 18], [870, 70, 16]].forEach(([x, y, r]) => bub(c, x, y, r));
  clock(c, 540, 700, 130, 20, false); write(c, "20", 440, 880, 90, INK, 8);
  line(c, [[430, 450], [650, 450]], 14); line(c, [[430, 500], [650, 500]], 14);
};
export const ic_healthHygieneL3 = cards("sci.health.hygiene.L3 cards", [c_intro, c_summary, c_e1, c_e3, c_a1, c_a3, c_a5, c_a6, c_p1, c_c1, c_c2, c_x0, c_x1, c_x2, c_x4, c_x8, c_t0, c_t1, c_t2, c_t4, c_t5, c_t6, c_t7, c_t8, c_t13, c_t15, c_t16, c_t17, c_t18]);
