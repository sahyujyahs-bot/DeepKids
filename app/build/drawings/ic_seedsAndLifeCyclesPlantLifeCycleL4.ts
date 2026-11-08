import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, leaf, person, hand, write, cards } from "./flatKit";

// ------------------------------------------------------------------ small helpers
const hexv = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hexv(a), B = hexv(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.62], [0.48, 0.62]]],
  B: [[[0, 1], [0, 0], [0.4, 0.02], [0.5, 0.25], [0.38, 0.48], [0, 0.5]], [[0.38, 0.48], [0.55, 0.72], [0.42, 0.97], [0, 1]]],
  C: [[[0.58, 0.15], [0.3, 0], [0.05, 0.25], [0.05, 0.75], [0.3, 1], [0.58, 0.85]]],
  D: [[[0, 0], [0, 1], [0.3, 1], [0.58, 0.7], [0.58, 0.3], [0.3, 0], [0, 0]]],
  L: [[[0.05, 0], [0.05, 1], [0.55, 1]]],
  P: [[[0, 1], [0, 0], [0.4, 0], [0.55, 0.2], [0.4, 0.5], [0, 0.5]]],
  Y: [[[0, 0], [0.3, 0.5], [0.6, 0]], [[0.3, 0.5], [0.3, 1]]],
};
const txtW = (s: string, h: number) => (s.length - 1) * h * 0.8 + h * 0.6;
const txt = (c: Ctx, s: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  let cx = x;
  for (const ch of s) {
    if (ch === " ") { cx += h * 0.4; continue; }
    const g = LET[ch];
    if (g) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; g.forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); }); } else write(c, ch, cx, y, h, col, w);
    cx += h * 0.8;
  }
};
const tag = (c: Ctx, x: number, y: number, s: string, w = 110, h = 90, col: string = WHITE) => {
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 14), col, 5);
  const th = h * 0.5; txt(c, s, x - txtW(s, th) / 2, y - th / 2, th, INK, Math.max(5, th * 0.14));
};
const tableTop = (c: Ctx, y: number, col = "#dfc08a") => {
  c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6);
  c.globalAlpha = 0.1; for (let k = 1; k < 5; k++) line(c, [[0, y + k * 75], [D, y + k * 75 + 10]], 4, INK); c.globalAlpha = 1;
};
const pathHalfBelow = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI); };

// person at a table (table hides the legs); props are drawn on the table, then each hand is drawn again on top of them
type Hd = { handL: [number, number]; handR: [number, number] };
const atTable = (c: Ctx, ty: number, x: number, y: number, h: number, pose: any, props: (hd: Hd) => void) => {
  const hd = person(c, x, y, h, pose);
  if (ty) tableTop(c, ty);
  props(hd);
  c.save(); c.beginPath();
  for (const p of [hd.handL, hd.handR]) { c.moveTo(p[0] + 85, p[1]); c.arc(p[0], p[1], 85, 0, Math.PI * 2); }
  c.clip(); person(c, x, y, h, pose); c.restore();
};

// ------------------------------------------------------------------ fruit
const mango = (c: Ctx, x: number, y: number, r: number, t: number) => {
  const ry = r * 0.82, col = mix("#6aa53f", "#f4b63a", t), dk = mix("#46752a", "#e08a28", t);
  shadow(c, x + r * 0.15, y + ry * 0.98, r * 0.9, r * 0.16);
  const p = () => ell(c, x, y, r, ry, -0.3);
  shape(c, p, col); shade(c, p, dk, r * 0.3, r * 0.2, 0.5);
  line(c, [[x - r * 0.32, y - ry * 0.72], [x - r * 0.4, y - ry * 1.05]], 9, INK); line(c, [[x - r * 0.32, y - ry * 0.72], [x - r * 0.4, y - ry * 1.05]], 4, "#7a5230");
  shine(c, [[x - r * 0.6, y - ry * 0.05], [x - r * 0.35, y - ry * 0.5]], 8);
};
const banana = (c: Ctx, x: number, y: number, len: number, ripe = true) => {
  const pts: number[][] = [], sp: number[][] = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([x - len / 2 + len * t, y - len * 0.07 + Math.sin(Math.PI * t) * len * 0.14]); }
  const w = len * 0.2, col = ripe ? "#ffd34d" : "#a8c84a";
  line(c, pts, w + 10, INK); line(c, pts, w, col);
  line(c, pts.map(([px, py]) => [px, py + w * 0.28]).slice(2, 15), w * 0.3, mix(col, "#b8862a", 0.45));
  line(c, pts.map(([px, py]) => [px, py - w * 0.22]).slice(3, 13), 6, WHITE);
  if (ripe) for (const i of [3, 6, 9, 12]) sp.push(pts[i]);
  sp.forEach(([px, py], k) => shape(c, () => ell(c, px + 4, py + (k % 2 ? 6 : -4), 9, 6), "#6b4020", 0));
  line(c, [pts[0], [pts[0][0] - 28, pts[0][1] - 26]], 20, INK); line(c, [pts[0], [pts[0][0] - 28, pts[0][1] - 26]], 11, "#7a5230");
  shape(c, () => ell(c, pts[16][0] + 3, pts[16][1] - 2, 9, 9), "#4a3322", 3);
};
const tomato = (c: Ctx, x: number, y: number, r: number, t: number) => {
  const col = t < 0.5 ? mix("#6aa53f", "#f39a3c", t * 2) : mix("#f39a3c", "#e03a2b", (t - 0.5) * 2), dk = mix(col, "#2b2340", 0.28);
  shadow(c, x + r * 0.15, y + r * 0.86, r * 0.9, r * 0.15);
  const p = () => ell(c, x, y, r, r * 0.88);
  shape(c, p, col); shade(c, p, dk, r * 0.3, r * 0.25, 0.45);
  for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.62, tx = x + Math.cos(a) * r * 0.5, ty = y - r * 0.8 + Math.sin(a) * r * 0.2 + r * 0.22; line(c, [[x, y - r * 0.8], [tx, ty]], 15, INK); line(c, [[x, y - r * 0.8], [tx, ty]], 8, "#3f8a3a"); }
  shine(c, [[x - r * 0.62, y - r * 0.15], [x - r * 0.4, y - r * 0.55]], 8);
};

// ------------------------------------------------------------------ containers
// a tub, bag or box: bottom centre (x, yb); contents are drawn clipped so that they sit inside its mouth
const vessel = (c: Ctx, x: number, yb: number, w: number, h: number, fill: string, dk: string, taper: number, contents?: () => void, rimIn = "#5a4630") => {
  const wb = w * taper, ry = w * 0.1, yt = yb - h;
  shadow(c, x + w * 0.1, yb + 4, w * 0.55, w * 0.08);
  const body = () => { c.moveTo(x - w / 2, yt); c.lineTo(x + w / 2, yt); c.lineTo(x + wb / 2, yb); c.quadraticCurveTo(x, yb + ry * 0.8, x - wb / 2, yb); c.closePath(); };
  shape(c, body, fill); shade(c, body, dk, w * 0.2, 0, 0.5);
  shape(c, () => ell(c, x, yt, w / 2, ry), rimIn, 6);
  if (contents) { c.save(); c.beginPath(); c.rect(0, 0, D, yt); c.moveTo(x + w / 2, yt); ell(c, x, yt, w / 2, ry); c.clip(); contents(); c.restore(); }
  pathHalfBelow(c, x, yt, w / 2, ry); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const bag = (c: Ctx, x: number, yb: number, w: number, h: number, contents?: () => void) => vessel(c, x, yb, w, h, "#c99a62", "#a67a45", 0.86, contents);
const box = (c: Ctx, x: number, yb: number, w: number, h: number, contents?: () => void) => vessel(c, x, yb, w, h, "#d8b27a", "#b98f58", 1, contents);
const waterIn = (c: Ctx, x: number, y: number, w: number, h: number, fill: number) => {
  const top = w / 2, bot = w * 0.4, ly = y - h * fill, lw = bot + (top - bot) * fill;
  c.beginPath(); c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); c.fillStyle = "rgba(143,195,234,0.45)"; c.fill();
  c.beginPath(); ell(c, x, ly, lw, w * 0.06); c.fillStyle = "rgba(233,243,255,0.55)"; c.fill(); c.strokeStyle = COL.waterDk; c.lineWidth = 3; c.stroke();
};
// a glass jar with something standing in it: item first, then the glass and the water over it
const jar = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, inside: () => void, over?: () => void) => {
  inside(); glass(c, x, y, w, h, 0); waterIn(c, x, y, w, h, fill); over?.();
};
const toothpicks = (c: Ctx, x: number, y: number, half: number) => {
  for (const dy of [0, 14]) { line(c, [[x - half, y + dy], [x + half, y + dy]], 9, INK); line(c, [[x - half, y + dy], [x + half, y + dy]], 4, "#e8c98a"); }
};

// ------------------------------------------------------------------ plants
const blade = (c: Ctx, x: number, y: number, len: number, wid: number, rot: number, yel: number, stalk = 110) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  line(c, [[0, 0], [0, stalk]], 20, INK); line(c, [[0, 0], [0, stalk]], 9, "#8fc25a");
  const p = () => { c.moveTo(0, 0); c.bezierCurveTo(-wid, -len * 0.25, -wid * 0.9, -len * 0.8, 0, -len); c.bezierCurveTo(wid * 0.9, -len * 0.8, wid, -len * 0.25, 0, 0); c.closePath(); };
  shape(c, p, yel >= 1 ? "#e6c235" : COL.leaf, 6);
  if (yel > 0 && yel < 1) { c.save(); c.beginPath(); p(); c.clip(); c.fillStyle = "#e6c235"; c.fillRect(-wid * 1.2, -len * 1.1, wid * 2.4, len * 1.1 * yel + len * 0.1 * yel); c.restore(); c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }
  line(c, [[0, -4], [0, -len * 0.92]], 5, yel >= 1 ? "#a8901c" : COL.leafDk);
  for (const k of [0.3, 0.55, 0.78]) for (const s of [-1, 1]) line(c, [[0, -len * k], [s * wid * 0.55, -len * (k + 0.1)]], 3, yel >= 1 ? "#a8901c" : COL.leafDk);
  c.restore();
};
// a glass with palak leaves standing in it
const leavesGlass = (c: Ctx, x: number, y: number, w: number, h: number, stem: number, lf: number) => {
  jar(c, x, y, w, h, 0.55, () => {
    for (let k = 0; k < 5; k++) {
      const a = (-90 + (k - 2) * 12) * Math.PI / 180, sx = x + (k - 2) * w * 0.07, sy = y - 12, ex = sx + Math.cos(a) * (h * 0.4 + stem), ey = sy + Math.sin(a) * (h * 0.4 + stem);
      line(c, [[sx, sy], [ex, ey]], 11, INK); line(c, [[sx, sy], [ex, ey]], 5, "#8fc25a");
      leaf(c, ex, ey, lf, a, COL.leaf);
    }
  });
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
};
const pot = (c: Ctx, x: number, yb: number, w: number, h: number, contents?: () => void) => vessel(c, x, yb, w, h, "#d5733f", "#a8502a", 0.72, contents, "#6a4128");
const seedling = (c: Ctx, x: number, y: number, hh: number) => {
  line(c, [[x, y], [x, y - hh]], 11, INK); line(c, [[x, y], [x, y - hh]], 5, "#7fb24a");
  leaf(c, x, y - hh * 0.55, hh * 0.55, -2.5, COL.leaf); leaf(c, x, y - hh * 0.55, hh * 0.55, -0.64, COL.leaf);
  leaf(c, x, y - hh, hh * 0.5, -2.1, COL.greenLt); leaf(c, x, y - hh, hh * 0.5, -1.04, COL.greenLt);
};
const marigold = (c: Ctx, x: number, y: number, r: number, st: 0 | 1 | 2) => {
  if (st === 2) {
    for (let k = 0; k < 18; k++) { const a = (k * Math.PI * 2) / 18; line(c, [[x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4], [x + Math.cos(a) * r * 1.0, y + Math.sin(a) * r * 1.0]], 8, INK); line(c, [[x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4], [x + Math.cos(a) * r * 1.0, y + Math.sin(a) * r * 1.0]], 3, "#3a3026"); }
    shape(c, () => ell(c, x, y, r * 0.55, r * 0.55), "#8a6a45"); shine(c, [[x - r * 0.3, y - r * 0.15], [x - r * 0.1, y - r * 0.35]], 6);
    return;
  }
  const outer = st ? "#b98652" : "#f39a3c", inner = st ? "#9c6a3c" : "#ffbe3d", cen = st ? "#7a5230" : "#d9742a";
  for (let k = 0; k < 14; k++) { const a = (k * Math.PI * 2) / 14; shape(c, () => ell(c, x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62 + (st ? r * 0.08 : 0), r * 0.4, r * 0.21, a), outer, 4); }
  for (let k = 0; k < 10; k++) { const a = (k * Math.PI * 2) / 10 + 0.3; shape(c, () => ell(c, x + Math.cos(a) * r * 0.36, y + Math.sin(a) * r * 0.36, r * 0.27, r * 0.15, a), inner, 3); }
  shape(c, () => ell(c, x, y, r * 0.24, r * 0.24), cen, 4);
};
const frond = (c: Ctx, x0: number, y0: number, len: number, ang: number, col: string, dots: boolean, lw = 5) => {
  c.save(); c.translate(x0, y0); c.rotate(ang);
  const n = 9;
  for (const s of [-1, 1]) for (let i = 0; i < n; i++) {
    const t = (i + 0.6) / (n + 0.3), px = len * (0.06 + 0.86 * t), pl = len * (0.2 * (1 - t * 0.72) + 0.04), a = s * 1.05, cx = px + Math.cos(a) * pl / 2, cy = Math.sin(a) * pl / 2;
    shape(c, () => ell(c, cx, cy, pl / 2, pl * 0.19, a), col, lw);
    if (dots) for (const u of [0.28, 0.45, 0.62, 0.78]) for (const o of [-1, 1]) { const dx = px + Math.cos(a) * pl * u - Math.sin(a) * o * pl * 0.07, dy = Math.sin(a) * pl * u + Math.cos(a) * o * pl * 0.07; shape(c, () => ell(c, dx, dy, pl * 0.032, pl * 0.032), "#7a4a2a", 0); }
  }
  shape(c, () => ell(c, len * 0.97, 0, len * 0.04, len * 0.025), col, lw);
  line(c, [[0, 0], [len * 0.96, 0]], lw ? 9 : 7, lw ? mix(col, INK, 0.4) : col);
  c.restore();
};
const logDisc = (c: Ctx, x: number, y: number, r: number, ws: number[]) => {
  shadow(c, x + r * 0.1, y + r * 0.98, r * 0.95, r * 0.1);
  shape(c, () => ell(c, x, y, r, r), "#6a4128", 6); shape(c, () => ell(c, x, y, r * 0.93, r * 0.93), "#ecc790", 4);
  const tot = ws.reduce((a, b) => a + b, 0); let acc = 0;
  ws.forEach((w, i) => { acc += w; const rr = (acc / tot) * r * 0.86; c.beginPath(); c.ellipse(x + Math.sin(i * 1.7) * r * 0.012, y + Math.cos(i * 1.3) * r * 0.012, rr, rr * 0.99, 0, 0, Math.PI * 2); c.strokeStyle = "#a8742f"; c.lineWidth = 5; c.stroke(); });
  shape(c, () => ell(c, x, y, r * 0.025, r * 0.025), "#7a4a1c", 0);
};
// a magnifying glass: the handle ends beyond the hand point (hx, hy); inside() draws what is seen in the lens
const magnifier = (c: Ctx, cx: number, cy: number, r: number, hx: number, hy: number, inside: () => void) => {
  const a = Math.atan2(hy - cy, hx - cx), ex = hx + Math.cos(a) * 45, ey = hy + Math.sin(a) * 45, sx = cx + Math.cos(a) * r, sy = cy + Math.sin(a) * r;
  line(c, [[sx, sy], [ex, ey]], 26, INK); line(c, [[sx, sy], [ex, ey]], 15, "#8a5a3c");
  c.save(); c.beginPath(); ell(c, cx, cy, r, r); c.clip(); c.fillStyle = "#f4f9ff"; c.fillRect(cx - r, cy - r, 2 * r, 2 * r); inside(); c.restore();
  shape(c, () => ell(c, cx, cy, r, r), "rgba(255,255,255,0.12)", 12);
  c.beginPath(); ell(c, cx, cy, r, r); c.strokeStyle = COL.steelDk; c.lineWidth = 6; c.stroke();
  shine(c, [[cx - r * 0.6, cy - r * 0.15], [cx - r * 0.35, cy - r * 0.6]], 8);
};
const ruler = (c: Ctx, x: number, y: number, len: number, h = 70, vertical = false) => {
  c.save(); c.translate(x, y); if (vertical) c.rotate(-Math.PI / 2);
  shape(c, () => rrect(c, 0, 0, len, h, 6), COL.wood, 5);
  for (let i = 0; i <= 20; i++) line(c, [[8 + i * (len - 16) / 20, 0], [8 + i * (len - 16) / 20, i % 5 ? h * 0.22 : h * 0.4]], i % 5 ? 2.5 : 4);
  c.restore();
};
const wave = (c: Ctx, x0: number, y0: number, x1: number, y1: number, amp: number, n: number, col: string) => {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, pts: number[][] = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, o = Math.sin(t * n * Math.PI * 2) * amp; pts.push([x0 + ux * L * t - uy * o, y0 + uy * L * t + ux * o]); }
  arrow(c, pts, col, 9);
};
const snow = (c: Ctx, x: number, y: number, r: number) => { for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x - Math.cos(a) * r, y - Math.sin(a) * r]], 7, "#5f9fd3"); } };
const shelfIcon = (c: Ctx, x: number, y: number, s: number) => { c.save(); c.translate(x, y); c.scale(s, s); shape(c, () => polyP(c, [[-30, 14], [-30, 40], [-8, 14]]), "#a8723f", 3); shape(c, () => polyP(c, [[30, 14], [30, 40], [8, 14]]), "#a8723f", 3); shape(c, () => rrect(c, -48, -2, 96, 16, 4), COL.wood, 4); c.restore(); };
const windowIcon = (c: Ctx, x: number, y: number, s: number) => { c.save(); c.translate(x, y); c.scale(s, s); shape(c, () => rrect(c, -34, -36, 68, 72, 4), COL.sky, 4); shape(c, () => ell(c, 12, -12, 10, 10), COL.yellow, 3); line(c, [[0, -36], [0, 36]], 4); line(c, [[-34, 0], [34, 0]], 4); c.restore(); };
const fridgeIcon = (c: Ctx, x: number, y: number, s: number) => { c.save(); c.translate(x, y); c.scale(s, s); shape(c, () => rrect(c, -30, -44, 60, 88, 8), "#dff0fa", 4); line(c, [[-30, -10], [30, -10]], 4); line(c, [[-20, -26], [-20, -18]], 5); line(c, [[-20, 6], [-20, 22]], 5); c.restore(); };

// ================================================================== SET-UP CARDS
// ---- e1: ripe in a bag
const bagA = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  bag(c, x, yb, w, h, () => { c.save(); c.translate(x + w * 0.18, yb - h - 5); c.rotate(-1.0); banana(c, 0, 0, w * 0.75); c.restore(); mango(c, x - w * 0.16, yb - h + 4, w * 0.27, 0); });
};
const e1s0 = (c: Ctx) => { ground(c); tableTop(c, 740); bagA(c, 540, 880, 400, 440); tag(c, 540, 740, "A", 120, 100); };
const e1s1 = (c: Ctx) => {
  ground(c); tableTop(c, 700);
  bag(c, 290, 860, 330, 340, () => mango(c, 290, 500, 88, 0)); tag(c, 290, 740, "B", 110, 90);
  plate(c, 770, 800, 260, 72); mango(c, 770, 725, 96, 0); tag(c, 770, 940, "C", 110, 90);
};
const e1s2 = (c: Ctx) => {
  ground(c);
  atTable(c, 740, 560, 1050, 880, { reachL: [345, 615], reachR: [735, 690] }, () => {
    bag(c, 250, 810, 190, 200, () => mango(c, 250, 600, 56, 0));
    mango(c, 735, 735, 62, 0.15);
    c.save(); c.translate(880, 770); c.transform(1, 0, -0.35, 1, 0, 0);
    shape(c, () => rrect(c, -110, -10, 220, 150, 6), WHITE, 5);
    for (let k = 1; k < 4; k++) line(c, [[-110, -10 + k * 37], [110, -10 + k * 37]], 3, COL.grey);
    for (let k = 1; k < 4; k++) line(c, [[-110 + k * 55, -10], [-110 + k * 55, 140]], 3, COL.grey);
    c.restore();
  });
};
const e1s3 = (c: Ctx) => {
  ground(c); tableTop(c, 700); plate(c, 540, 770, 480, 120);
  mango(c, 220, 700, 105, 1); mango(c, 540, 710, 105, 0.5); mango(c, 860, 700, 105, 0);
  tag(c, 220, 920, "A", 110, 90); tag(c, 540, 930, "B", 110, 90); tag(c, 860, 920, "C", 110, 90);
};
// ---- e2: leaves, darkness and banana
const leafGlasses = (c: Ctx, withScale: boolean) => {
  ground(c); tableTop(c, 720);
  const xs = withScale ? [190, 420, 650] : [210, 540, 870];
  xs.forEach((x, i) => { leavesGlass(c, x, 790, 180, 270, 60, 115); tag(c, x, 930, "ABC"[i], 110, 90); });
  if (withScale) { for (let k = 0; k < 5; k++) shape(c, () => rect(c, 880, 220 + k * 100, 110, 100), mix(COL.leaf, "#e6c235", k / 4), 5); }
};
const rect = (c: Ctx, x: number, y: number, w: number, h: number) => { c.rect(x, y, w, h); };
const e2s1 = (c: Ctx) => {
  ground(c); tableTop(c, 780);
  sun(c, 170, 180, 60);
  leavesGlass(c, 170, 780, 170, 270, 50, 115); tag(c, 170, 910, "A", 100, 80);
  const cut = (x: number, w: number, inner: () => void) => {
    shape(c, () => rect(c, x - w / 2, 400, w, 380), "#6b4a2e", 6); inner();
    shape(c, () => rect(c, x - w / 2, 400, 16, 380), "#d8b27a", 5); shape(c, () => rect(c, x + w / 2 - 16, 400, 16, 380), "#d8b27a", 5);
    shape(c, () => rect(c, x - w / 2 - 14, 360, w + 28, 40), "#c99a62", 6);
  };
  cut(510, 340, () => { leavesGlass(c, 435, 770, 150, 240, 10, 85); banana(c, 610, 745, 170); });
  tag(c, 510, 900, "B", 100, 80);
  cut(880, 280, () => leavesGlass(c, 880, 770, 150, 240, 10, 85));
  tag(c, 880, 900, "C", 100, 80);
};
const e2s2 = (c: Ctx) => {
  ground(c, "#b9b0c8");
  atTable(c, 740, 520, 1050, 880, { reachL: [255, 575], reachR: [690, 560] }, () => {
    tableTop(c, 740, "#a99779");
    box(c, 850, 820, 250, 220, () => { for (let k = 0; k < 5; k++) { const a = (-90 + (k - 2) * 17) * Math.PI / 180, sx = 850 + (k - 2) * 20, sy = 620, ex = sx + Math.cos(a) * 80, ey = sy + Math.sin(a) * 80; line(c, [[sx, sy], [ex, ey]], 10, INK); line(c, [[sx, sy], [ex, ey]], 5, "#8fc25a"); leaf(c, ex, ey, 90, a, COL.leaf); } });
    line(c, [[690, 548], [975, 604]], 36, INK); line(c, [[690, 548], [975, 604]], 26, "#c99a62");
    shape(c, () => rect(c, 150, 340, 150, 250), WHITE, 5);
    for (let k = 0; k < 5; k++) shape(c, () => rect(c, 170, 360 + k * 44, 110, 40), mix(COL.leaf, "#e6c235", k / 4), 4);
  });
};
const e2s3 = (c: Ctx) => {
  ground(c); tableTop(c, 640);
  blade(c, 200, 790, 400, 105, -0.05, 0); blade(c, 540, 790, 400, 105, 0.03, 0.5); blade(c, 880, 790, 400, 105, 0.04, 1);
  tag(c, 200, 960, "A", 110, 90); tag(c, 540, 960, "B", 110, 90); tag(c, 880, 960, "C", 110, 90);
};
// ---- e3: nodes and cuttings
const stemCol = "#8fc25a";
const piece = (c: Ctx, x0: number, y: number, len: number, node: number, lf: boolean) => {
  line(c, [[x0, y], [x0 + len, y]], 34, INK); line(c, [[x0, y], [x0 + len, y]], 22, stemCol);
  for (const ex of [x0, x0 + len]) shape(c, () => ell(c, ex, y, 6, 11), "#d9ecb0", 3);
  if (node) {
    const nx = x0 + len * node;
    shape(c, () => rrect(c, nx - 11, y - 20, 22, 40, 6), "#6b8f3d", 4);
    line(c, [[nx + 4, y + 20], [nx + 12, y + 36]], 7, "#7a5230"); line(c, [[nx - 4, y + 20], [nx - 12, y + 34]], 7, "#7a5230");
    if (lf) { line(c, [[nx, y - 16], [nx + 18, y - 52]], 10, INK); line(c, [[nx, y - 16], [nx + 18, y - 52]], 5, stemCol); leaf(c, nx + 18, y - 52, 95, -1.2, COL.leaf); } else shape(c, () => ell(c, nx, y - 22, 6, 9), "#7a5230", 3);
  }
};
const e3s0 = (c: Ctx) => {
  ground(c); tableTop(c, 150, "#ead9b5");
  const rows: [number, boolean, number, string][] = [[330, true, 0.45, "A"], [590, false, 0.45, "B"], [850, false, 0, "C"]];
  rows.forEach(([y, lf, nd, t]) => { tag(c, 130, y, t, 100, 90); [260, 520, 780].forEach((x) => piece(c, x, y, 200, nd, lf)); });
};
const cuttingJar = (c: Ctx, x: number, kind: 0 | 1 | 2) => {
  const y = 800, w = 220, h = 330;
  jar(c, x, y, w, h, 0.6, () => {
    for (let k = -1; k <= 1; k++) {
      const bx = x + k * 38, by = y - 18, ex = bx + k * 30, ey = by - 330;
      line(c, [[bx, by], [ex, ey]], 20, INK); line(c, [[bx, by], [ex, ey]], 11, stemCol);
      if (kind < 2) { const nx = bx + k * 30 * (120 / 330), ny = by - 120; shape(c, () => rrect(c, nx - 11, ny - 8, 22, 16, 5), "#6b8f3d", 3); if (kind === 0) { const px = nx + k * 22 + 10, py = ny - 205; line(c, [[nx, ny], [px, py]], 8, INK); line(c, [[nx, ny], [px, py]], 4, stemCol); leaf(c, px, py, 85, -1.57 + k * 0.5, COL.leaf); } }
    }
  });
};
const e3s1 = (c: Ctx) => { ground(c); tableTop(c, 780); [190, 540, 890].forEach((x, i) => { cuttingJar(c, x, i as 0 | 1 | 2); tag(c, x, 920, "ABC"[i], 110, 90); }); };
const nodeView = (c: Ctx, cx: number, cy: number, s: number) => {
  c.save(); c.translate(cx, cy); c.scale(s, s);
  line(c, [[0, 140], [0, -140]], 56, INK); line(c, [[0, 140], [0, -140]], 40, stemCol);
  shape(c, () => rrect(c, -34, -26, 68, 52, 10), "#6b8f3d", 5);
  for (const [dx, dy, ex, ey] of [[-8, 26, -30, 100], [8, 26, 6, 110], [22, 24, 52, 90], [-22, 24, -64, 80]]) { line(c, [[dx, dy], [ex, ey]], 14, INK); line(c, [[dx, dy], [ex, ey]], 7, "#fffaf0"); }
  c.restore();
};
const e3s2 = (c: Ctx) => {
  ground(c);
  atTable(c, 740, 700, 1050, 880, { reachL: [470, 700], reachR: [880, 710] }, () => {
    cuttingJar(c, 330, 0);
    ruler(c, 740, 800, 300, 60);
    magnifier(c, 330, 600, 105, 470, 700, () => nodeView(c, 330, 600, 0.7));
  });
};
const e3s3 = (c: Ctx) => {
  ground(c); tableTop(c, 100, "#ead9b5"); plate(c, 540, 540, 490, 450);
  const root = (x: number, y: number, a: number, L: number) => { const pts = [[x, y], [x + Math.cos(a) * L * 0.5 + 6, y + Math.sin(a) * L * 0.5], [x + Math.cos(a) * L * 0.9 - 5, y + Math.sin(a) * L]]; line(c, pts, 14, INK); line(c, pts, 7, "#fffaf0"); };
  const row = (y: number, nodeOn: boolean, roots: number, L: number, t: string) => {
    for (let k = 0; k < roots; k++) root(380 + (k - (roots - 1) / 2) * 12, y + 20, 1.57 + (k - (roots - 1) / 2) * 0.28, L * (0.8 + 0.2 * ((k * 7) % 3) / 2));
    piece(c, 280, y, 460, nodeOn ? 0.25 : 0, false); tag(c, 880, y, t, 100, 90);
  };
  row(290, true, 7, 150, "A"); row(530, true, 3, 55, "B"); row(760, false, 0, 0, "C");
};
// ---- e4: tomatoes
const bagFor = (c: Ctx, x: number, yb: number, icon: (c: Ctx, x: number, y: number, s: number) => void, t: number) => {
  bag(c, x, yb, 300, 340, () => tomato(c, x, yb - 340 + 6, 85, t));
  shape(c, () => rrect(c, x - 85, yb - 250, 170, 140, 14), WHITE, 5); icon(c, x, yb - 180, 1.35);
};
const e4s0 = (c: Ctx) => { ground(c); tableTop(c, 780); bagFor(c, 170, 900, shelfIcon, 0); bagFor(c, 540, 900, windowIcon, 0); bagFor(c, 910, 900, fridgeIcon, 0); };
const e4s1 = (c: Ctx) => {
  ground(c);
  const panel = (x: number, col: string, f: () => void) => { shape(c, () => rrect(c, x, 150, 320, 780, 22), col, 6); c.save(); c.beginPath(); rrect(c, x, 150, 320, 780, 22); c.clip(); f(); c.restore(); shape(c, () => rrect(c, x, 150, 320, 780, 22), "rgba(0,0,0,0)", 6); };
  panel(40, "#f6d9ae", () => { for (const dx of [-90, 0, 90]) wave(c, 200 + dx, 430, 200 + dx + 8, 250, 14, 1.5, "#e4523b"); shape(c, () => rect(c, 40, 830, 320, 24), COL.wood, 5); shelfIcon(c, 200, 280, 0.01); bag(c, 200, 830, 190, 210, () => tomato(c, 200, 630, 55, 0)); });
  panel(380, COL.sky, () => { sun(c, 450, 260, 45); line(c, [[540, 150], [540, 830]], 12); line(c, [[380, 480], [700, 480]], 12); shape(c, () => rect(c, 370, 830, 340, 30), "#f1ece0", 5); bag(c, 540, 830, 190, 210, () => tomato(c, 540, 630, 55, 0)); });
  panel(720, "#dff0fa", () => { snow(c, 800, 250, 38); snow(c, 960, 340, 30); shape(c, () => rect(c, 720, 830, 320, 16), "rgba(150,190,220,0.8)", 4); line(c, [[720, 500], [1040, 500]], 5, "#9ab9d3"); bag(c, 880, 830, 190, 210, () => tomato(c, 880, 630, 55, 0)); });
};
const e4s2 = (c: Ctx) => {
  ground(c);
  const pl = (c2: Ctx) => { shadow(c2, 560, 720, 270, 40); shape(c2, () => ell(c2, 540, 660, 260, 62), COL.steel); shape(c2, () => ell(c2, 540, 654, 215, 46), COL.steelIn, 4); };
  atTable(c, 0, 540, 1040, 880, { reachL: [300, 690], reachR: [790, 690] }, () => {
    pl(c); tomato(c, 395, 595, 62, 1); tomato(c, 540, 605, 62, 0.5); tomato(c, 685, 595, 62, 0);
  });
};
const e4s3 = (c: Ctx) => {
  ground(c); tableTop(c, 820);
  for (const dx of [-80, 0, 80]) wave(c, 640 + dx, 540, 640 + dx + 6, 340, 14, 1.5, "#e4523b");
  tomato(c, 640, 700, 125, 0.05);
  shape(c, () => rect(c, 400, 817, 480, 28), COL.wood, 5);
  c.save(); c.translate(900, 440); c.rotate(0.08); shape(c, () => rrect(c, -125, -105, 250, 210, 8), WHITE, 5); txt(c, "DAY 6", -txtW("DAY 6", 56) / 2, -28, 56, INK, 8); shape(c, () => rrect(c, -40, -122, 80, 34, 4), "rgba(255,211,77,0.85)", 4); c.restore();
  fridgeIcon(c, 180, 480, 2.6);
  arrow(c, [[300, 560], [340, 650], [420, 700], [512, 705]], RED, 12);
};
// ---- a1: sleeping pantry
const saucer = (c: Ctx, cx: number, cy: number, rx: number, ry: number, item: (by: number) => void, baseW: number) => {
  plate(c, cx, cy, rx, ry);
  shape(c, () => ell(c, cx, cy - 4, rx * 0.8, ry * 0.7), "#bfe0f5", 3);
  const by = cy; item(by);
  shape(c, () => ell(c, cx, by, baseW, 18), "rgba(143,195,234,0.6)", 0); c.beginPath(); ell(c, cx, by, baseW, 18); c.strokeStyle = COL.waterDk; c.lineWidth = 3; c.stroke();
};
const carrotTop = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  for (const a of [-0.5, -0.15, 0.2, 0.55]) { const tx = x + Math.sin(a) * h * 0.9, ty = yb - h - Math.cos(a) * h * 0.65; line(c, [[x + a * w * 0.3, yb - h], [tx, ty]], 10, INK); line(c, [[x + a * w * 0.3, yb - h], [tx, ty]], 5, "#58a14a"); leaf(c, tx, ty, h * 0.4, a - 1.57 - 0.5, COL.leaf); leaf(c, tx, ty, h * 0.4, a - 1.57 + 0.5, COL.greenLt); }
  const b = () => { c.moveTo(x - w / 2, yb - h); c.lineTo(x + w / 2, yb - h); c.lineTo(x + w * 0.36, yb); c.lineTo(x - w * 0.36, yb); c.closePath(); };
  shape(c, b, "#f08a2a"); shade(c, b, "#c9651a", w * 0.2, 0, 0.5); shape(c, () => ell(c, x, yb - h, w / 2, w * 0.1), "#f6b261", 5);
  for (const k of [0.35, 0.65]) line(c, [[x - w * (0.4 - 0.05 * k), yb - h * (1 - k)], [x - w * 0.1, yb - h * (1 - k) + 6]], 4, "#c9651a");
};
const beetTop = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  for (const a of [-0.45, 0, 0.45]) { const tx = x + Math.sin(a) * h * 0.8, ty = yb - h - Math.cos(a) * h * 0.7; line(c, [[x + a * w * 0.2, yb - h * 0.9], [tx, ty]], 12, INK); line(c, [[x + a * w * 0.2, yb - h * 0.9], [tx, ty]], 6, "#b23a48"); leaf(c, tx, ty, h * 0.45, a - 1.57, COL.leafDk); }
  const b = () => { c.moveTo(x - w * 0.3, yb); c.bezierCurveTo(x - w * 0.65, yb - h * 0.2, x - w * 0.5, yb - h, x, yb - h); c.bezierCurveTo(x + w * 0.5, yb - h, x + w * 0.65, yb - h * 0.2, x + w * 0.3, yb); c.closePath(); };
  shape(c, b, "#8e2f5a"); shade(c, b, "#5f1d3b", w * 0.2, 0, 0.5); shine(c, [[x - w * 0.3, yb - h * 0.55], [x - w * 0.2, yb - h * 0.85]], 7);
};
const a1s0 = (c: Ctx) => {
  ground(c); tableTop(c, 450, "#e4cda0");
  saucer(c, 290, 700, 240, 105, (by) => carrotTop(c, 290, by + 8, 170, 190), 95);
  saucer(c, 790, 700, 240, 105, (by) => beetTop(c, 790, by + 8, 190, 170), 85);
};
const onion = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y - 60], [x - 8, y - 150]], 14, INK); line(c, [[x, y - 60], [x - 8, y - 150]], 7, "#7fb24a");
  const p = () => { c.moveTo(x, y - 110); c.bezierCurveTo(x + 20, y - 80, x + 92, y - 60, x + 80, y + 10); c.bezierCurveTo(x + 70, y + 60, x - 70, y + 60, x - 80, y + 10); c.bezierCurveTo(x - 92, y - 60, x - 20, y - 80, x, y - 110); c.closePath(); };
  shape(c, p, "#e0b060"); shade(c, p, "#b8873a", 26, 0, 0.5);
  for (const dx of [-40, -15, 15, 40]) line(c, [[x + dx * 0.3, y - 90], [x + dx * 1.3, y + 30]], 3, "#b8873a");
  for (const dx of [-30, -10, 12, 32]) { const pts = [[x + dx, y + 55], [x + dx * 1.2, y + 95], [x + dx * 0.9, y + 130]]; line(c, pts, 10, INK); line(c, pts, 5, "#fffaf0"); }
};
const sweetPotato = (c: Ctx, x: number, y: number) => {
  c.save(); c.translate(x, y); c.rotate(0.1);
  const p = () => { c.moveTo(0, -150); c.bezierCurveTo(60, -130, 72, -20, 55, 60); c.bezierCurveTo(40, 130, 15, 150, 0, 150); c.bezierCurveTo(-25, 150, -60, 100, -60, 20); c.bezierCurveTo(-60, -80, -40, -140, 0, -150); c.closePath(); };
  shape(c, p, "#b04e68"); shade(c, p, "#7d2c44", 26, 0, 0.5);
  line(c, [[-20, -60], [-10, 40]], 3, "#7d2c44"); line(c, [[15, -30], [22, 80]], 3, "#7d2c44");
  for (const dx of [-25, 0, 24]) { const pts = [[dx, 100], [dx * 1.3, 150], [dx * 1.1, 190]]; line(c, pts, 10, INK); line(c, pts, 5, "#fffaf0"); }
  c.restore();
};
const potato = (c: Ctx, x: number, y: number) => {
  const p = () => { c.moveTo(x - 10, y - 105); c.bezierCurveTo(x + 55, y - 110, x + 85, y - 40, x + 70, y + 40); c.bezierCurveTo(x + 55, y + 110, x - 40, y + 118, x - 70, y + 50); c.bezierCurveTo(x - 90, y - 20, x - 65, y - 100, x - 10, y - 105); c.closePath(); };
  shape(c, p, "#cfa467"); shade(c, p, "#a8803f", 26, 0, 0.5);
  for (const [dx, dy] of [[-25, -40], [20, -10], [-15, 40], [35, 55]]) shape(c, () => ell(c, x + dx, y + dy, 6, 4), "#7a5a2a", 0);
  for (const dx of [-25, 5, 30]) { const pts = [[x + dx, y + 100], [x + dx * 1.2, y + 140], [x + dx, y + 175]]; line(c, pts, 10, INK); line(c, pts, 5, "#fffaf0"); }
};
const foodJar = (c: Ctx, x: number, y: number, which: 0 | 1 | 2) => {
  const w = 190, h = 250;
  jar(c, x, y, w, h, 0.62, () => { const iy = y - h + 15; if (which === 0) onion(c, x, iy - 30); else if (which === 1) sweetPotato(c, x, iy - 30); else potato(c, x, iy - 20); }, () => toothpicks(c, x, y - h, w / 2 + 28));
};
const a1s1 = (c: Ctx) => { ground(c); tableTop(c, 790); foodJar(c, 190, 860, 0); foodJar(c, 540, 860, 1); foodJar(c, 890, 860, 2); };
const ginger = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const lobes: [number, number, number, number, number][] = [[0, 0, 120, 30, -0.05], [-120, -50, 55, 22, -0.7], [-150, 20, 45, 20, 0.4], [95, -52, 50, 21, 0.6], [150, 15, 48, 22, 0.1], [40, 38, 45, 20, 0.3]];
  lobes.forEach(([dx, dy, rx, ry, rot]) => { c.beginPath(); ell(c, dx, dy, rx, ry, rot); c.strokeStyle = INK; c.lineWidth = 12; c.stroke(); });
  lobes.forEach(([dx, dy, rx, ry, rot]) => shape(c, () => ell(c, dx, dy, rx, ry, rot), "#dcb26e", 0));
  lobes.forEach(([dx, dy, rx, ry, rot]) => shade(c, () => ell(c, dx, dy, rx, ry, rot), "#b58a46", 14, 12, 0.35));
  for (const k of [-60, -10, 40, 85]) line(c, [[k, -24], [k + 5, 24]], 3, "#a57c3a");
  line(c, [[100, -70], [104, -150]], 14, INK); line(c, [[100, -70], [104, -150]], 7, "#9ccf62");
  leaf(c, 104, -150, 70, -2.3, COL.leaf); leaf(c, 104, -150, 70, -0.85, COL.greenLt);
  c.restore();
};
const at = (c: Ctx, x: number, y: number, s: number, f: (c: Ctx) => void) => { c.save(); c.translate(x, y); c.scale(s, s); f(c); c.restore(); };
const a1s2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 60, 70, 300, 290, 8), COL.sky, 6); sun(c, 270, 170, 40); line(c, [[210, 70], [210, 360]], 8); line(c, [[60, 215], [360, 215]], 8);
  tableTop(c, 690, "#e4cda0");
  at(c, 130, 700, 0.42, (k) => saucer(k, 0, 0, 240, 105, (by) => carrotTop(k, 0, by + 8, 170, 190), 95));
  at(c, 350, 700, 0.42, (k) => saucer(k, 0, 0, 240, 105, (by) => beetTop(k, 0, by + 8, 190, 170), 85));
  at(c, 590, 700, 0.5, (k) => foodJar(k, 0, 0, 0)); at(c, 760, 700, 0.5, (k) => foodJar(k, 0, 0, 1)); at(c, 920, 700, 0.5, (k) => foodJar(k, 0, 0, 2));
  plate(c, 540, 850, 330, 105); shape(c, () => ell(c, 540, 846, 260, 74), "#bcd6ea", 4); ginger(c, 540, 850, 1.25);
};
const a1s3 = (c: Ctx) => {
  ground(c);
  atTable(c, 740, 640, 1050, 880, { reachL: [300, 590], reachR: [850, 695] }, () => {
    ruler(c, 285, 790, 270, 54, true);
    saucer(c, 430, 820, 150, 55, (by) => carrotTop(c, 430, by + 5, 90, 110), 55);
    c.save(); c.translate(900, 800); c.transform(1, 0, -0.3, 1, 0, 0); shape(c, () => rrect(c, -110, -20, 220, 130, 6), WHITE, 5); for (let k = 1; k < 3; k++) line(c, [[-110, -20 + k * 43], [110, -20 + k * 43]], 3, COL.grey); line(c, [[0, -20], [0, 110]], 3, COL.grey); c.restore();
    line(c, [[850, 795], [935, 600]], 18, INK); line(c, [[850, 795], [935, 600]], 9, "#f2c063"); shape(c, () => polyP(c, [[850, 795], [842, 775], [859, 777]]), "#3a3540", 2);
  });
};
// ---- a2: fern spore print
const a2s0 = (c: Ctx) => { ground(c); frond(c, 540, 980, 880, -Math.PI / 2, "#7fb069", true); };
const paperSheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 12, y + h + 6, w * 0.52, 20); shape(c, () => rect(c, x, y, w, h), WHITE, 5); };
const a2s1 = (c: Ctx) => {
  ground(c); tableTop(c, 360); paperSheet(c, 80, 440, 920, 520);
  frond(c, 140, 700, 800, 0, COL.leaf, false);
  const r = 250, x = 540, y = 740;
  const dome = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.05, x + r, y - r * 1.05, x + r, y); c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.closePath(); };
  shape(c, dome, COL.steel); shade(c, dome, COL.steelDk, r * 0.3, 0, 0.5); shine(c, [[x - r * 0.7, y - r * 0.2], [x - r * 0.5, y - r * 0.65], [x - r * 0.15, y - r * 0.85]], 10);
  pathHalfBelow(c, x, y, r, r * 0.2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const a2s2 = (c: Ctx) => {
  ground(c);
  atTable(c, 740, 400, 1050, 880, { reachR: [690, 690] }, () => {
    paperSheet(c, 540, 760, 500, 250);
    c.save(); c.translate(0, 0); frond(c, 575, 885, 440, -0.05, "#d3b88e", false, 0); c.restore();
    magnifier(c, 830, 810, 105, 690, 690, () => { c.save(); c.translate(830, 810); c.scale(2.2, 2.2); c.translate(-830, -810); frond(c, 760, 810, 150, -0.05, "#d3b88e", false, 0); for (let k = 0; k < 9; k++) shape(c, () => ell(c, 800 + k * 6, 806 + (k % 3) * 8 - 8, 3, 3), "#8a6a45", 0); c.restore(); });
  });
};
// ---- a3: tree diary
const MM = [4, 3, 4, 1, 3, 5, 3, 1, 4, 4, 3, 4];
const ringStrip = (c: Ctx, x: number, y: number, mm: number[], px: number, h: number, nums = false) => {
  let cx = x;
  mm.forEach((m) => { const w = m * px; c.fillStyle = "#ead2a0"; c.fillRect(cx, y, w * 0.62, h); c.fillStyle = "#b9803f"; c.fillRect(cx + w * 0.62, y, w * 0.38, h); if (nums) write(c, String(m), cx + w / 2 - 11, y - 58, 40, INK, 6); cx += w; });
  c.beginPath(); c.rect(x, y, cx - x, h); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  return cx;
};
const a3s0 = (c: Ctx) => {
  ground(c); c.fillStyle = "#d9c9a3"; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 6);
  shape(c, () => rect(c, 560, 780, 440, 220), "#7a4a2a", 6);
  logDisc(c, 780, 780, 220, [6, 8, 10, 7, 20, 24, 12, 9, 8, 22, 10, 12]);
  const hd = person(c, 340, 1000, 820, { reachR: [590, 650] });
  line(c, [[505, 625], [655, 690]], 18, INK); line(c, [[505, 625], [655, 690]], 9, "#f2c063"); shape(c, () => polyP(c, [[655, 690], [630, 668], [642, 682]]), "#3a3540", 3); void hd;
};
const a3s1 = (c: Ctx) => {
  ground(c); tableTop(c, 200, "#ead9b5"); shadow(c, 540, 645, 460, 24);
  shape(c, () => rect(c, 60, 330, 960, 300), WHITE, 5);
  ringStrip(c, 90, 440, MM, 22, 160, true);
  tag(c, 140, 260, "A", 100, 90);
  write(c, "2012", 90, 680, 60, INK, 8); write(c, "2023", 744, 680, 60, INK, 8);
};
const a3s2 = (c: Ctx) => {
  ground(c); tableTop(c, 60, "#ead9b5");
  const px = 22, x0 = 70, off = (i: number) => x0 + MM.slice(0, i).reduce((a, b) => a + b, 0) * px;
  const strip = (y: number, a: number, b: number) => { shadow(c, off(a) + 20, y + 190, 300, 14); shape(c, () => rect(c, off(a) - 14, y - 16, MM.slice(a, b).reduce((s, v) => s + v, 0) * px + 28, 190), WHITE, 5); ringStrip(c, off(a), y, MM.slice(a, b), px, 160); };
  strip(220, 0, 12); strip(470, 2, 9); strip(720, 5, 12);
  for (const i of [3, 7]) { const x = off(i) - 6, w = MM[i] * px + 12; c.beginPath(); c.rect(x, 190, w, 740); c.strokeStyle = RED; c.lineWidth = 7; c.setLineDash([18, 12]); c.stroke(); c.setLineDash([]); }
};
// ---- a4: lifespan tape
const a4s0 = (c: Ctx) => {
  ground(c, "#e6dcc8");
  shape(c, () => polyP(c, [[0, 0], [330, 300], [330, 640], [0, 1080]]), "#d8cdb6", 0); shape(c, () => polyP(c, [[D, 0], [750, 300], [750, 640], [D, 1080]]), "#cbbfa5", 0);
  shape(c, () => rect(c, 330, 300, 420, 340), "#f4eee0", 5); shape(c, () => rect(c, 460, 380, 160, 260), "#8a5a3c", 5);
  shape(c, () => polyP(c, [[0, 1080], [330, 640], [750, 640], [D, 1080]]), "#cf9f5f", 5);
  const stripAt = (y: number) => { const t = (y - 640) / 440, hw = 28 + t * 190; return [540 - hw, 540 + hw]; };
  shape(c, () => polyP(c, [[stripAt(1080)[0], 1080], [stripAt(1080)[1], 1080], [stripAt(640)[1], 640], [stripAt(640)[0], 640]]), WHITE, 5);
  for (let k = 0; k < 7; k++) { const y = 640 + 440 / (1 + k * 0.85); const [a, b] = stripAt(y); line(c, [[a, y], [b, y]], 3 + (y - 640) / 120); }
  const rl = (x: number, y: number) => ({ x, y });
  void rl;
  c.save(); c.translate(340, 960); c.transform(1, 0, 0.08, 1, 0, 0); ruler(c, 0, 0, 440, 62); c.restore();
  line(c, [[820, 1010], [930, 880]], 20, INK); line(c, [[820, 1010], [930, 880]], 10, "#f2c063"); shape(c, () => polyP(c, [[820, 1010], [836, 986], [846, 1000]]), "#3a3540", 3);
};
const moongPlant = (c: Ctx, x: number, y: number) => { seedling(c, x, y, 90); };
const papayaPlant = (c: Ctx, x: number, y: number) => {
  line(c, [[x, y], [x, y - 170]], 26, INK); line(c, [[x, y], [x, y - 170]], 16, "#b9a06a");
  for (const a of [-2.7, -2.2, -1.57, -0.95, -0.45]) { const ex = x + Math.cos(a) * 110, ey = y - 170 + Math.sin(a) * 70; line(c, [[x, y - 170], [ex, ey]], 8, INK); line(c, [[x, y - 170], [ex, ey]], 4, "#7fb24a"); shape(c, () => ell(c, ex, ey - 8, 40, 22, a * 0.3), COL.leaf, 4); }
  shape(c, () => ell(c, x - 14, y - 150, 14, 24), "#9ccf62", 3); shape(c, () => ell(c, x + 16, y - 148, 14, 24), "#e9a23c", 3);
};
const a4s1 = (c: Ctx) => {
  ground(c); tableTop(c, 130, "#ead9b5");
  const lane = (y: number) => { shadow(c, 540, y + 130, 450, 18); shape(c, () => rect(c, 60, y, 960, 120), WHITE, 5); for (let k = 0; k <= 8; k++) line(c, [[200 + k * 100, y + 120], [200 + k * 100, y + (k % 2 ? 90 : 70)]], 4); write(c, "0", 188, y + 128, 40, INK, 6); write(c, "100", 252, y + 128, 40, INK, 6); };
  lane(300); lane(790);
  moongPlant(c, 205, 292); shape(c, () => ell(c, 205, 370, 11, 11), "#4a4650", 3);
  papayaPlant(c, 209, 780); line(c, [[200, 860], [220, 860]], 12, "#4a4650");
};
const tree = (c: Ctx, x: number, yb: number, kind: number) => {
  const trunk = (w: number, h: number) => { shape(c, () => polyP(c, [[x - w, yb], [x - w * 0.6, yb - h], [x + w * 0.6, yb - h], [x + w, yb]]), "#8a5a3c", 5); };
  if (kind === 0) { trunk(18, 120); [[0, -190, 85], [-60, -160, 65], [60, -160, 65]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx, yb + dy, r, r * 0.85), COL.leafDk, 5)); for (const dx of [-45, 20, 55]) { shape(c, () => ell(c, x + dx, yb - 135 + (dx % 2 ? 0 : 14), 13, 17), "#f4b63a", 3); } }
  if (kind === 1) { trunk(26, 120); shape(c, () => ell(c, x, yb - 180, 150, 85), COL.leaf, 5); for (const dx of [-110, -60, 60, 110]) { line(c, [[x + dx, yb - 110], [x + dx, yb]], 9, INK); line(c, [[x + dx, yb - 110], [x + dx, yb]], 4, "#a8723f"); } }
  if (kind === 2) { trunk(16, 140); shape(c, () => ell(c, x, yb - 220, 85, 100), COL.greenLt, 5); for (const [dx, dy] of [[-30, -240], [25, -200], [-10, -170]]) shape(c, () => polyP(c, [[x + dx, yb + dy - 12], [x + dx + 16, yb + dy - 22], [x + dx + 28, yb + dy - 8], [x + dx, yb + dy + 22], [x + dx - 28, yb + dy - 8], [x + dx - 16, yb + dy - 22]]), COL.leaf, 3); }
  if (kind === 3) { const pts = [[x, yb], [x + 18, yb - 70], [x - 16, yb - 140], [x + 14, yb - 210]]; line(c, pts, 28, INK); line(c, pts, 18, "#8a5a3c"); for (const [dx, dy] of [[-45, -210], [40, -250], [0, -175]]) shape(c, () => ell(c, x + dx, yb + dy, 50, 22), "#2f6b57", 4); }
};
const a4s2 = (c: Ctx) => {
  ground(c); tableTop(c, 780, "#ead9b5");
  shadow(c, 540, 905, 470, 14); shape(c, () => rect(c, 40, 780, 1000, 110), WHITE, 5);
  for (let k = 0; k <= 19; k++) line(c, [[70 + k * 50, 890], [70 + k * 50, k % 5 ? 862 : 835]], 3 + (k % 5 ? 0 : 1));
  [[160, 0], [470, 1], [740, 2], [940, 3]].forEach(([x, k]) => { at(c, x, 780, 1.1, (q) => tree(q, 0, 0, k)); shape(c, () => ell(c, x, 835, 11, 11), "#4a4650", 3); });
};
// ---- p1: pinch or let go
const p1s0 = (c: Ctx) => {
  ground(c); sun(c, 960, 120, 55); tableTop(c, 800, "#cfc3b0");
  line(c, [[0, 560], [D, 560]], 10); line(c, [[0, 640], [D, 640]], 6);
  for (let i = 0; i < 12; i++) line(c, [[40 + i * 92, 560], [40 + i * 92, 800]], 8);
  const names = ["P1", "P2", "P3", "L1", "L2", "L3"];
  names.forEach((n, i) => { const x = 105 + i * 174; pot(c, x, 940, 150, 170, () => seedling(c, x, 800, 120)); tag(c, x, 880, n, 120, 70, n[0] === "P" ? "#ffe1a8" : "#cfe6ff"); });
};
const p1s1 = (c: Ctx) => {
  ground(c);
  line(c, [[300, 960], [310, 740], [380, 640], [410, 570]], 20, INK); line(c, [[300, 960], [310, 740], [380, 640], [410, 570]], 11, "#7fb24a");
  leaf(c, 308, 800, 150, -2.7, COL.leaf); leaf(c, 312, 740, 150, -0.4, COL.leaf); leaf(c, 360, 670, 120, -2.5, COL.greenLt);
  shape(c, () => ell(c, 410, 570, 10, 8), "#7a5230", 3);
  hand(c, 640, 700, -2.3, 1.5, SKIN.child, CLOTH.child, false);
  line(c, [[520, 560], [575, 625]], 14, INK); line(c, [[520, 560], [575, 625]], 7, "#7fb24a");
  marigold(c, 520, 545, 70, 1);
  vessel(c, 820, 980, 220, 200, "#5b8fd6", "#3f6fb3", 0.8, () => { marigold(c, 790, 800, 58, 1); marigold(c, 850, 790, 56, 1); marigold(c, 820, 770, 52, 1); });
  arrow(c, Array.from({ length: 21 }, (_, i) => { const t = i / 20, u = 1 - t; return [u * u * 590 + 2 * u * t * 800 + t * t * 818, u * u * 470 + 2 * u * t * 330 + t * t * 700]; }), RED, 12);
};
const p1s2 = (c: Ctx) => {
  ground(c); tableTop(c, 930, "#cfc3b0");
  // Let Go: dry brown seed head
  pot(c, 280, 960, 260, 230, () => { line(c, [[280, 760], [270, 600], [290, 430]], 14, INK); line(c, [[280, 760], [270, 600], [290, 430]], 7, "#8c8a4a"); });
  leaf(c, 275, 700, 120, -2.6, "#8c9a4a"); leaf(c, 275, 650, 110, -0.5, "#8c9a4a");
  marigold(c, 292, 380, 90, 2);
  tag(c, 280, 860, "L", 100, 90, "#cfe6ff");
  // Pinch: bushy with fresh flowers
  pot(c, 780, 960, 260, 230, () => {
    for (const [ex, ey] of [[690, 520], [760, 440], [840, 420], [900, 510], [800, 560]]) { line(c, [[780, 760], [ex, ey]], 12, INK); line(c, [[780, 760], [ex, ey]], 6, "#7fb24a"); }
  });
  leaf(c, 778, 720, 110, -2.6, COL.leaf); leaf(c, 780, 690, 110, -0.5, COL.leaf); leaf(c, 735, 590, 90, -2.9, COL.leaf); leaf(c, 850, 560, 90, -0.2, COL.leaf);
  [[690, 500, 62], [760, 420, 66], [840, 400, 64], [900, 490, 60], [800, 540, 56]].forEach(([x, y, r]) => marigold(c, x, y, r, 0));
  tag(c, 780, 860, "P", 100, 90, "#ffe1a8");
};
const p1s3 = (c: Ctx) => {
  ground(c, "#f6efe0");
  c.globalAlpha = 0.5; for (let k = 1; k < 6; k++) line(c, [[170, 840 - k * 120], [990, 840 - k * 120]], 3, COL.grey); for (let k = 1; k < 8; k++) line(c, [[170 + k * 105, 840], [170 + k * 105, 200]], 3, COL.grey); c.globalAlpha = 1;
  arrow(c, [[170, 840], [170, 170]], INK, 8); arrow(c, [[170, 840], [1010, 840]], INK, 8);
  const P: number[][] = [], L: number[][] = [];
  for (let k = 0; k <= 8; k++) { P.push([170 + k * 105, 820 - [0, 40, 110, 190, 270, 360, 440, 520, 600][k]]); L.push([170 + k * 105, 820 - [0, 40, 110, 160, 175, 170, 160, 150, 140][k] * 0.9]); }
  line(c, P, 18, INK); line(c, P, 10, COL.orange); line(c, L, 18, INK); line(c, L, 10, COL.blue);
  P.forEach(([x, y]) => shape(c, () => ell(c, x, y, 13, 13), COL.orange, 4)); L.forEach(([x, y]) => shape(c, () => ell(c, x, y, 13, 13), COL.blue, 4));
  marigold(c, 980, 235, 58, 0); marigold(c, 930, 640, 50, 2);
  tag(c, 300, 230, "P", 90, 80, "#ffe1a8"); line(c, [[350, 230], [440, 230]], 12, COL.orange);
  tag(c, 560, 230, "L", 90, 80, "#cfe6ff"); line(c, [[610, 230], [700, 230]], 12, COL.blue);
};
// ================================================================== CARD PICTURES
const threeMangoes = (c: Ctx) => {
  ground(c); tableTop(c, 720);
  bagA(c, 190, 860, 300, 340); bag(c, 540, 860, 300, 340, () => mango(c, 540, 536, 82, 0)); plate(c, 860, 810, 190, 58); mango(c, 860, 745, 85, 0);
  tag(c, 190, 770, "A", 100, 80); tag(c, 540, 770, "B", 100, 80); tag(c, 860, 940, "C", 100, 80);
};
const e2flow = (c: Ctx) => leafGlasses(c, false);
const e3flow = e3s1;
const e4flow = e4s1;
const a1flow = (c: Ctx) => {
  ground(c); tableTop(c, 480, "#e4cda0");
  at(c, 190, 400, 0.62, (k) => saucer(k, 0, 0, 240, 105, (by) => carrotTop(k, 0, by + 8, 170, 190), 95));
  at(c, 540, 400, 0.62, (k) => saucer(k, 0, 0, 240, 105, (by) => beetTop(k, 0, by + 8, 190, 170), 85));
  at(c, 890, 400, 0.62, (k) => { plate(k, 0, 0, 240, 85); shape(k, () => ell(k, 0, -4, 190, 60), "#bcd6ea", 3); ginger(k, 0, -4, 0.85); });
  at(c, 190, 930, 0.9, (k) => foodJar(k, 0, 0, 0)); at(c, 540, 930, 0.9, (k) => foodJar(k, 0, 0, 1)); at(c, 890, 930, 0.9, (k) => foodJar(k, 0, 0, 2));
};
const a3flow = (c: Ctx) => {
  ground(c); c.fillStyle = "#d9c9a3"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  shape(c, () => rect(c, 500, 520, 400, 380), "#7a4a2a", 6); logDisc(c, 500, 520, 380, [6, 8, 10, 7, 20, 24, 12, 9, 8, 22, 10, 12]);
};
const ethylene = (c: Ctx) => {
  ground(c); tableTop(c, 880);
  banana(c, 370, 760, 270); mango(c, 790, 740, 110, 0);
  const b = () => { c.moveTo(130, 480); c.lineTo(950, 480); c.lineTo(900, 880); c.lineTo(180, 880); c.closePath(); };
  shape(c, b, "rgba(201,154,98,0.35)", 6); shape(c, () => ell(c, 540, 480, 410, 46), "rgba(90,70,48,0.25)", 6);
  for (const dy of [-50, 0, 50]) wave(c, 530, 700 + dy, 650, 730 + dy * 0.6, 12, 1.5, "#8b6cc9");
};
const tagless = [e1s0, e1s1, e1s2, e1s3, (c: Ctx) => leafGlasses(c, true), e2s1, e2s2, e2s3, e3s0, e3s1, e3s2, e3s3, e4s0, e4s1, e4s2, e4s3, a1s0, a1s1, a1s2, a1s3, a2s0, a2s1, a2s2, a3s0, a3s1, a3s2, a4s0, a4s1, a4s2, p1s0, p1s1, p1s2, p1s3];
export const ic_seedsAndLifeCyclesPlantLifeCycleL4 = cards("sci.seeds-and-life-cycles.plant-life-cycle.L4", [...tagless, threeMangoes, e2flow, e3flow, e4flow, a1flow, a2s0, a3flow, a4s2, p1s2, ethylene]);
void D;
