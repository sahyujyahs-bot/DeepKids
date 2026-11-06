import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, leaf, cards } from "./flatKit";

// WEATHER L1 · set-up cards for the fan test, then card pictures for the activities, project and terms.

const WALL = "#f6efe0", FLOOR = "#dcc7a3", WOOL = "#a8323f", WOOLDK = "#7d2330", RAIN = "#f2c23b", RAINDK = "#d49d1c", SKYGREY = "#c7ccd4", CLOUD = "#aeb4bd", CLOUDDK = "#8d949e", AIR = "#4f9bd9";
const room = (c: Ctx, floorY: number, wall = WALL, floor = FLOOR) => { ground(c, wall); c.fillStyle = floor; c.fillRect(0, floorY, D, D - floorY); line(c, [[0, floorY], [D, floorY]], 6); };

// ---------------------------------------------------------------- things
// a table fan facing right: cage centre (x, cy), cage radius r, standing on the floor at floorY
const fan = (c: Ctx, x: number, cy: number, r: number, floorY: number) => {
  const px = x - r * 0.55;
  shadow(c, px + 14, floorY + 4, r * 0.7, r * 0.12);
  shape(c, () => ell(c, px, floorY - r * 0.06, r * 0.62, r * 0.14), COL.teal);
  shape(c, () => rrect(c, px - 13, cy + r * 0.3, 26, floorY - r * 0.1 - cy - r * 0.3, 6), COL.steel);
  const motor = () => rrect(c, x - r * 1.0, cy - r * 0.36, r * 0.82, r * 0.72, r * 0.18);
  shape(c, motor, COL.teal); shade(c, motor, COL.tealDk, r * 0.2, r * 0.12);
  const cage = () => ell(c, x, cy, r * 0.3, r);
  shape(c, cage, COL.steelIn);
  c.save(); c.beginPath(); cage(); c.clip();
  for (let k = 1; k <= 3; k++) { c.beginPath(); ell(c, x, cy, (r * 0.3 * k) / 4, (r * k) / 4); c.strokeStyle = COL.steelDk; c.lineWidth = 3; c.stroke(); }
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x, cy], [x + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r]], 3, COL.steelDk); }
  c.restore();
  shape(c, () => ell(c, x + r * 0.05, cy, r * 0.1, r * 0.2), COL.tealDk, 4);
};
// moving air: a wavy blue arrow from x0 to x1 at height y
const gust = (c: Ctx, x0: number, x1: number, y: number, amp = 12) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([x0 + t * (x1 - x0), y + Math.sin(t * Math.PI * 3) * amp]); }
  arrow(c, pts, AIR, 8);
};
// a steel tumbler, bottom centre (x, y), open side up
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.35, 0);
  shape(c, () => ell(c, x, y - h, top, w * 0.1), COL.steelIn, 5);
  shine(c, [[x - top * 0.6, y - h * 0.85], [x - bot * 0.65, y - h * 0.25]], 7);
};
// a wooden stool: top surface centre (x, topY), width w, legs h long
const stool = (c: Ctx, x: number, topY: number, w: number, h: number) => {
  shadow(c, x + 10, topY + h + 6, w * 0.55, 14);
  for (const s of [-1, 1]) { line(c, [[x + s * w * 0.38, topY + 10], [x + s * w * 0.44, topY + h]], 22, INK); line(c, [[x + s * w * 0.38, topY + 10], [x + s * w * 0.44, topY + h]], 12, COL.woodDk); }
  const top = () => rrect(c, x - w / 2, topY - 16, w, 32, 10);
  shape(c, top, COL.wood); shade(c, top, COL.woodDk, 0, 14);
};
// a shelf on the wall: plank top edge at (x, y), width w
const shelf = (c: Ctx, x: number, y: number, w: number) => {
  for (const s of [-1, 1]) { const bx = x + s * w * 0.35; shape(c, () => polyP(c, [[bx - 14, y + 22], [bx + 14, y + 22], [bx + (s < 0 ? 14 : -14), y + 90]]), COL.woodDk, 5); }
  const plank = () => rrect(c, x - w / 2, y, w, 24, 6);
  shape(c, plank, COL.wood); shade(c, plank, COL.woodDk, 0, 12);
};
// knit texture: rows of small Vs
const knit = (c: Ctx, x0: number, y0: number, x1: number, y1: number, dk: string) => {
  c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
  for (let y = y0 + 14; y < y1; y += 34) for (let x = x0 + 10; x < x1; x += 34) line(c, [[x - 8, y], [x, y + 10], [x + 8, y]], 3, dk);
  c.restore();
};
// a cloth held up flat by its top corners: centre x, top edge y, body w x h; sleeves hang at the sides
const clothFlat = (c: Ctx, cx: number, top: number, w: number, h: number, col: string, dk: string, kind: "wool" | "rain") => {
  const sl = 46;
  for (const s of [-1, 1]) { const sx = cx + (s * w) / 2 + (s < 0 ? -sl + 6 : -6), sleeve = () => rrect(c, sx, top + 14, sl, h * 0.72, 18); shape(c, sleeve, col); shade(c, sleeve, dk, 16, 0); }
  const body = () => rrect(c, cx - w / 2, top, w, h, 18);
  shape(c, body, col); shade(c, body, dk, w * 0.25, 0, 0.35);
  if (kind === "wool") {
    knit(c, cx - w / 2 + 6, top + 6, cx + w / 2 - 6, top + h - 40, dk);
    for (let x = cx - w / 2 + 16; x < cx + w / 2 - 8; x += 16) line(c, [[x, top + h - 34], [x, top + h - 8]], 3, dk);
    shape(c, () => { c.moveTo(cx - 48, top); c.quadraticCurveTo(cx, top + 56, cx + 48, top); c.closePath(); }, CLOTH.adult, 5);
  } else {
    for (const s of [-1, 1]) shape(c, () => polyP(c, [[cx + s * 6, top + 2], [cx + s * 64, top + 2], [cx + s * 10, top + 52]]), dk, 5);
    line(c, [[cx, top + 6], [cx, top + h - 10]], 4, dk);
    for (let y = top + 40; y < top + h - 20; y += 60) shape(c, () => ell(c, cx, y, 9, 9), INK, 0);
    shine(c, [[cx - w * 0.36, top + 30], [cx - w * 0.36, top + h * 0.6]], 10);
  }
};
// a mitten drawn over something the person holds, so the fingers show in front of it
const handOver = (c: Ctx, x: number, y: number, r: number, skin: string) => shape(c, () => ell(c, x, y, r * 1.05, r * 0.85), skin, 5);
// a pencil held at (x, y), pointing left
const pencil = (c: Ctx, x: number, y: number, len: number) => {
  const tip = x - len * 0.6, end = x + len * 0.4;
  shape(c, () => rrect(c, tip + 26, y - 11, end - tip - 26, 22, 4), COL.yellow, 5);
  shape(c, () => rrect(c, end - 22, y - 11, 22, 22, 4), COL.pink, 5);
  shape(c, () => polyP(c, [[tip + 28, y - 11], [tip, y], [tip + 28, y + 11]]), COL.wood, 5);
  shape(c, () => polyP(c, [[tip + 10, y - 4], [tip, y], [tip + 10, y + 4]]), INK, 0);
};
// a paper strip taped to a point, hanging down; flutter = blown off to the right
const strip = (c: Ctx, x: number, y: number, len: number, flutter: boolean) => {
  const pts = flutter ? [[x, y], [x + 4, y + len * 0.32], [x + 26, y + len * 0.58], [x + 60, y + len * 0.76], [x + 96, y + len * 0.86]] : [[x, y], [x, y + len]];
  line(c, pts, 44, INK); line(c, pts, 34, WHITE);
  c.globalAlpha = 0.6; shape(c, () => rrect(c, x - 22, y - 10, 44, 24, 4), COL.sky, 0); c.globalAlpha = 1;
};
// a heap of clothes on the floor: a woollen sweater, a yellow raincoat, a pink dupatta
const clothesPile = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 20, y + 8, 140 * s, 22 * s);
  const a = () => ell(c, x - 10 * s, y - 44 * s, 100 * s, 52 * s);
  shape(c, a, WOOL); shade(c, a, WOOLDK, 30 * s, 10 * s); knit(c, x - 100 * s, y - 90 * s, x + 80 * s, y - 10 * s, WOOLDK);
  const b = () => ell(c, x + 62 * s, y - 14 * s, 84 * s, 42 * s);
  shape(c, b, RAIN); shade(c, b, RAINDK, 26 * s, 8 * s); shine(c, [[x + 20 * s, y - 36 * s], [x + 70 * s, y - 44 * s]], 8);
  const d = () => ell(c, x - 60 * s, y - 6 * s, 76 * s, 34 * s);
  shape(c, d, COL.pink); shade(c, d, "#d3708f", 24 * s, 8 * s);
  line(c, [[x - 110 * s, y - 2 * s], [x - 60 * s, y - 18 * s], [x - 12 * s, y]], 3, "#d3708f");
};
// a flat paper lying on the floor, centre (x, y), seen a little from above
const floorPaper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 12, y + h * 0.5 + 6, w * 0.5, 10);
  shape(c, () => polyP(c, [[x - w / 2 + 12, y - h / 2], [x + w / 2 + 12, y - h / 2], [x + w / 2 - 12, y + h / 2], [x - w / 2 - 12, y + h / 2]]), COL.paper, 5);
};
const sunIcon = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; line(c, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], Math.max(4, r * 0.16), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, Math.max(4, r * 0.12));
};
// a cloud outline, centre (x, y), width w
const cloudP = (c: Ctx, x: number, y: number, w: number) => {
  // three bumps, left to right; each arc runs to the point where it crosses the next bump
  const B = [[x - w * 0.3, y + w * 0.02, w * 0.2], [x, y - w * 0.12, w * 0.28], [x + w * 0.3, y + w * 0.02, w * 0.2]], yb = y + w * 0.18, cr = Math.min(20, w * 0.1);
  let a0 = Math.PI;
  B.forEach(([bx, by, br], i) => {
    let a1 = 0;
    if (i < B.length - 1) {
      const [nx, ny, nr] = B[i + 1], d = Math.hypot(nx - bx, ny - by), a = (br * br - nr * nr + d * d) / (2 * d), h = Math.sqrt(Math.max(0, br * br - a * a));
      const mx = bx + ((nx - bx) * a) / d, my = by + ((ny - by) * a) / d, px = mx + ((ny - by) * h) / d, py = my - ((nx - bx) * h) / d;
      a1 = Math.atan2(py - by, px - bx);
      c.arc(bx, by, br, a0, a1);
      a0 = Math.atan2(py - ny, px - nx);
    } else c.arc(bx, by, br, a0, a1);
  });
  const [lx, ly, lr] = B[B.length - 1], [fx, fy, fr] = B[0];
  c.lineTo(lx + lr, yb - cr); c.quadraticCurveTo(lx + lr, yb, lx + lr - cr, yb);
  c.lineTo(fx - fr + cr, yb); c.quadraticCurveTo(fx - fr, yb, fx - fr, yb - cr);
  c.closePath();
};
const cloud = (c: Ctx, x: number, y: number, w: number, col = CLOUD, dk = CLOUDDK, lw = 6) => { shape(c, () => cloudP(c, x, y, w), col, lw); shade(c, () => cloudP(c, x, y, w), dk, w * 0.12, w * 0.08, 0.45); };
const rain = (c: Ctx, x: number, y: number, w: number, len: number, lw = 5) => { for (let k = 0; k < 5; k++) { const rx = x - w * 0.4 + (k * w * 0.8) / 4; line(c, [[rx, y], [rx - len * 0.25, y + len]], lw, COL.blue); } };
const windIcon = (c: Ctx, x: number, y: number, w: number, lw = 6) => {
  for (const [dy, len] of [[-28, 1], [0, 0.8], [28, 0.6]]) { const x1 = x - w / 2 + w * len; line(c, [[x - w / 2, y + dy], [x1 - 24, y + dy]], lw, AIR); c.beginPath(); c.arc(x1 - 24, y + dy - 12, 12, Math.PI / 2, -Math.PI * 0.9, true); c.strokeStyle = AIR; c.lineWidth = lw; c.lineCap = "round"; c.stroke(); }
};
const snowIcon = (c: Ctx, x: number, y: number, r: number) => {
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3, ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r;
    line(c, [[x, y], [ex, ey]], 5, AIR);
    for (const s of [-1, 1]) line(c, [[x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6], [x + Math.cos(a) * r * 0.6 + Math.cos(a + s * 0.9) * r * 0.3, y + Math.sin(a) * r * 0.6 + Math.sin(a + s * 0.9) * r * 0.3]], 4, AIR);
  }
};
// a cap with its peak to the right, crown centre (x, y)
const cap = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y); c.arc(x, y, r, Math.PI, Math.PI * 2); c.closePath(); }, COL.red, 5);
  shape(c, () => { c.moveTo(x - r * 0.2, y - 4); c.quadraticCurveTo(x + r * 1.5, y - 14, x + r * 1.7, y + 10); c.quadraticCurveTo(x + r * 0.6, y + 18, x - r * 0.2, y + 10); c.closePath(); }, "#b73d2c", 5);
  line(c, [[x - r * 0.5, y - r * 0.85], [x, y]], 3, "#b73d2c");
};
// a closed umbrella from its tip (x0, y0) to its handle (x1, y1), with a hook at the top
const umbrellaClosed = (c: Ctx, x0: number, y0: number, x1: number, y1: number, w: number) => {
  const an = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(an) * w, ny = Math.cos(an) * w, L = Math.hypot(x1 - x0, y1 - y0);
  const p = (t: number, k: number) => [x0 + (x1 - x0) * t + nx * k, y0 + (y1 - y0) * t + ny * k];
  shape(c, () => polyP(c, [p(0, 0), p(0.3, 0.9), p(0.8, 0.9), p(0.85, 0.25), p(0.85, -0.25), p(0.8, -0.9), p(0.3, -0.9)]), COL.purple, 5);
  line(c, [p(0.3, 0.3), p(0.78, 0.3)], 3, "#6a4fa3"); line(c, [p(0.3, -0.3), p(0.78, -0.3)], 3, "#6a4fa3");
  line(c, [p(0.85, 0), p(1, 0)], 10, INK);
  const [hx, hy] = p(1, 0);
  c.beginPath(); c.arc(hx + Math.cos(an) * 2 + nx * 0.5 / w * 22, hy + ny * 0.5 / w * 22, 22, an - Math.PI / 2, an + Math.PI / 2); c.strokeStyle = INK; c.lineWidth = 10; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(hx + nx * 0.5 / w * 22, hy + ny * 0.5 / w * 22, 22, an - Math.PI / 2, an + Math.PI / 2); c.strokeStyle = COL.brown; c.lineWidth = 5; c.stroke();
  line(c, [p(0, 0), p(0.08, 0)], 6, INK);
};
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.2, x + r, y + r * 0.1); c.arc(x, y + r * 0.1, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.6); c.closePath(); }, COL.water, 4);
// a chappal (flip-flop) lying on the floor, centre (x, y)
const chappal = (c: Ctx, x: number, y: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 6, 8, 52, 22);
  shape(c, () => ell(c, 0, 0, 52, 22), COL.brown, 5);
  line(c, [[-22, -10], [0, -2], [-22, 10]], 7, INK); line(c, [[-22, -10], [0, -2], [-22, 10]], 3, COL.blue);
  c.restore();
};
// a door in the wall, left edge x, top y0, bottom y1
const door = (c: Ctx, x: number, y0: number, w: number, y1: number) => {
  const d = () => rrect(c, x, y0, w, y1 - y0 + 10, 14);
  shape(c, d, COL.brown); shade(c, d, "#7d5230", 20, 0, 0.35);
  for (const [py, ph] of [[y0 + 40, (y1 - y0) * 0.4], [y0 + 60 + (y1 - y0) * 0.4, (y1 - y0) * 0.42]]) shape(c, () => rrect(c, x + 36, py, w - 72, ph, 10), "#8f5f38", 5);
  shape(c, () => ell(c, x + 50, y0 + (y1 - y0) * 0.5, 14, 14), COL.yellow, 5);
};
// a toy elephant standing with its feet at (x, y), facing left; flat = a dark silhouette only
const elephant = (c: Ctx, x: number, y: number, s: number, col: string, flat = false) => {
  const lw = flat ? 0 : 5, f = (p: () => void) => shape(c, p, col, lw);
  for (const lx of [-46, -16, 22, 52]) f(() => rrect(c, x + lx * s, y - 70 * s, 26 * s, 72 * s, 8 * s));
  f(() => ell(c, x, y - 72 * s, 78 * s, 50 * s));
  f(() => ell(c, x - 64 * s, y - 92 * s, 40 * s, 36 * s));
  f(() => ell(c, x - 50 * s, y - 86 * s, 24 * s, 30 * s));
  const trunk = () => { c.moveTo(x - 92 * s, y - 98 * s); c.quadraticCurveTo(x - 128 * s, y - 70 * s, x - 112 * s, y - 20 * s); c.quadraticCurveTo(x - 100 * s, y - 10 * s, x - 94 * s, y - 24 * s); c.quadraticCurveTo(x - 104 * s, y - 60 * s, x - 80 * s, y - 80 * s); c.closePath(); };
  f(trunk);
  if (!flat) { shape(c, () => ell(c, x - 74 * s, y - 100 * s, 5 * s, 5 * s), INK, 0); line(c, [[x + 76 * s, y - 70 * s], [x + 96 * s, y - 40 * s]], 6 * s, INK); }
};
// a torch held at (x, y) (the handle in the hand), pointing right; s = size
const torch = (c: Ctx, x: number, y: number, s: number) => {
  const h = () => rrect(c, x - 56 * s, y - 20 * s, 100 * s, 40 * s, 12 * s);
  shape(c, h, "#4a4f66"); shade(c, h, "#30344a", 0, 12 * s);
  shape(c, () => polyP(c, [[x + 40 * s, y - 24 * s], [x + 84 * s, y - 36 * s], [x + 84 * s, y + 36 * s], [x + 40 * s, y + 24 * s]]), COL.steel, 5);
  shape(c, () => ell(c, x + 84 * s, y, 7 * s, 36 * s), COL.yellow, 4);
};
// a window in the wall: frame outer box (x, y, w, h); inner draws the view, clipped to the panes
const windowFrame = (c: Ctx, x: number, y: number, w: number, h: number, inner: () => void) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood);
  c.save(); c.beginPath(); c.rect(x + 22, y + 22, w - 44, h - 44); c.clip(); inner(); c.restore();
  c.beginPath(); c.rect(x + 22, y + 22, w - 44, h - 44); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x + w / 2, y + 22], [x + w / 2, y + h - 22]], 12, COL.wood); line(c, [[x + 22, y + h / 2], [x + w - 22, y + h / 2]], 12, COL.wood);
  line(c, [[x + w / 2, y + 22], [x + w / 2, y + h - 22]], 3, INK); line(c, [[x + 22, y + h / 2], [x + w - 22, y + h / 2]], 3, INK);
  shape(c, () => rrect(c, x - 14, y + h - 10, w + 28, 26, 6), COL.woodDk, 5);
};
const coconutTree = (c: Ctx, x: number, y: number, h: number, lean: number) => {
  const tx = x + lean, ty = y - h;
  const trunk = () => { c.moveTo(x - 18, y); c.quadraticCurveTo(x - 10, y - h * 0.6, tx - 10, ty); c.lineTo(tx + 10, ty); c.quadraticCurveTo(x + 14, y - h * 0.6, x + 18, y); c.closePath(); };
  shape(c, trunk, COL.brown); shade(c, trunk, "#7d5230", 10, 0);
  for (let k = 0; k < 7; k++) { const a = -Math.PI * 0.95 + (k * Math.PI * 0.9) / 6; leaf(c, tx, ty, h * 0.42, a + (k > 3 ? 0.25 : -0.25), COL.leaf); }
  for (const [dx, dy] of [[-14, 8], [12, 10], [0, 22]]) shape(c, () => ell(c, tx + dx, ty + dy, 13, 13), COL.brown, 4);
};
// a paper doll made of card, feet at (x, y), height h, wearing a yellow raincoat
const paperDoll = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.14, sh = y - h * 0.72;
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * h * 0.09 - h * 0.045, y - h * 0.4, h * 0.09, h * 0.4, 8), "#d9b48a", 5);
  for (const s of [-1, 1]) shape(c, () => rrect(c, x + s * h * 0.2 - h * 0.04, sh + h * 0.02, h * 0.08, h * 0.3, 8), RAIN, 5);
  const body = () => { c.moveTo(x - h * 0.14, sh); c.lineTo(x + h * 0.14, sh); c.lineTo(x + h * 0.19, y - h * 0.28); c.lineTo(x - h * 0.19, y - h * 0.28); c.closePath(); };
  shape(c, body, RAIN); shade(c, body, RAINDK, h * 0.06, 0, 0.4);
  line(c, [[x, sh + 10], [x, y - h * 0.3]], 4, RAINDK); for (const dy of [0.35, 0.47, 0.59]) shape(c, () => ell(c, x, y - h * dy, 5, 5), INK, 0);
  shape(c, () => { c.moveTo(x - head * 1.1, sh + 6); c.bezierCurveTo(x - head * 1.3, sh - head * 2.4, x + head * 1.3, sh - head * 2.4, x + head * 1.1, sh + 6); c.closePath(); }, RAIN, 5);
  shape(c, () => ell(c, x, sh - head * 0.95, head * 0.8, head * 0.85), "#d9b48a", 5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * head * 0.3, sh - head * 1.05, head * 0.08, head * 0.1), INK, 0);
  c.beginPath(); c.arc(x, sh - head * 0.8, head * 0.3, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};
const tape = (c: Ctx, x: number, y: number, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha = 0.7; shape(c, () => rrect(c, -34, -12, 68, 24, 3), COL.sky, 2); c.globalAlpha = 1; c.restore(); };

// ---------------------------------------------------------------- set-up cards: the fan test
// 1. one tumbler in the fan's wind on a stool, one far away on a shelf
const setupE1a = (c: Ctx) => {
  room(c, 860);
  shelf(c, 900, 330, 240);
  tumbler(c, 900, 330, 100, 150);
  fan(c, 250, 560, 150, 860);
  stool(c, 620, 760, 200, 100);
  tumbler(c, 620, 760, 110, 170);
  for (const y of [480, 560, 640]) gust(c, 320, 540, y);
};
// 2. the grown-up holds a sweater up in the wind; the child's paper strip behind it flutters
const setupE1b = (c: Ctx) => {
  room(c, 900);
  fan(c, 170, 540, 140, 900);
  for (const y of [460, 540, 620]) gust(c, 240, 360, y);
  const a = person(c, 520, 900, 560, { adult: true, reachL: [400, 480], reachR: [640, 480] });
  clothFlat(c, 520, 480, 220, 260, WOOL, WOOLDK, "wool");
  handOver(c, a.handR[0], a.handR[1], 24, SKIN.adult); handOver(c, a.handL[0], a.handL[1], 24, SKIN.adult);
  for (const y of [730, 800]) gust(c, 676, 732, y, 5);
  const k = person(c, 980, 900, 420, { reachL: [850, 690] });
  pencil(c, k.handL[0], k.handL[1], 200);
  strip(c, k.handL[0] - 112, k.handL[1] + 8, 160, true);
};
// 3. the raincoat instead: the wind stops at it, the strip hangs still
const setupE1c = (c: Ctx) => {
  room(c, 900);
  fan(c, 170, 540, 140, 900);
  for (const y of [460, 540, 620]) gust(c, 240, 360, y);
  const a = person(c, 520, 900, 560, { adult: true, reachL: [400, 480], reachR: [640, 480] });
  clothFlat(c, 520, 480, 220, 260, RAIN, RAINDK, "rain");
  handOver(c, a.handR[0], a.handR[1], 24, SKIN.adult); handOver(c, a.handL[0], a.handL[1], 24, SKIN.adult);
  const k = person(c, 980, 900, 420, { reachL: [850, 690] });
  pencil(c, k.handL[0], k.handL[1], 200);
  strip(c, k.handL[0] - 112, k.handL[1] + 8, 160, false);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the child's arm out in the fan's wind, the tumbler in the same wind, clothes on the floor
const flowE1 = (c: Ctx) => {
  room(c, 900);
  fan(c, 190, 520, 150, 900);
  stool(c, 470, 760, 180, 140);
  tumbler(c, 470, 760, 100, 150);
  gust(c, 270, 560, 450); gust(c, 270, 540, 530); gust(c, 270, 400, 640);
  person(c, 780, 900, 440, { reachL: [600, 590] });
  clothesPile(c, 940, 880, 0.9);
};
// flow.a1: the child finds wet chappals and a dripping umbrella by the front door
const flowA1 = (c: Ctx) => {
  room(c, 880);
  door(c, 720, 160, 290, 880);
  umbrellaClosed(c, 640, 880, 585, 540, 22);
  for (const [x, y] of [[612, 700], [628, 790]]) drop(c, x, y, 7);
  shape(c, () => ell(c, 640, 884, 70, 14), COL.water, 4);
  chappal(c, 500, 850, -0.15); chappal(c, 600, 862, 0.1);
  for (const [x, y] of [[470, 822], [545, 836], [585, 828]]) drop(c, x, y, 6);
  person(c, 280, 880, 460, { reachR: [413, 691] });
};
// flow.a2: the torch makes a sharp shadow of the toy on the white wall
const flowA2 = (c: Ctx) => {
  room(c, 900, "#7d7694", "#5e587a");
  shape(c, () => rrect(c, 760, 250, 340, 660, 10), WHITE, 6);
  c.globalAlpha = 0.5; shape(c, () => ell(c, 930, 660, 160, 200), COL.yellow, 0); c.globalAlpha = 1;
  elephant(c, 950, 840, 1.45, INK, true);
  stool(c, 610, 760, 170, 140);
  shape(c, () => polyP(c, [[470, 582], [930, 440], [930, 880], [470, 618]]), "rgba(255,230,120,0.35)", 0);
  elephant(c, 610, 760, 1, COL.grey);
  const k = person(c, 220, 900, 440, { reachR: [380, 600] });
  torch(c, k.handR[0], k.handR[1], 1.1);
};
// flow.a3: four weather papers on the floor; the child puts a cap on the sun paper
const flowA3 = (c: Ctx) => {
  room(c, 560);
  clothesPile(c, 800, 700, 0.9);
  for (const [x, icon] of [[455, "sun"], [625, "rain"], [795, "wind"], [965, "snow"]] as [number, string][]) {
    floorPaper(c, x, 850, 150, 110);
    if (icon === "sun") sunIcon(c, x, 850, 26);
    if (icon === "rain") { cloud(c, x, 834, 90, CLOUD, CLOUDDK, 4); rain(c, x, 860, 76, 20, 4); }
    if (icon === "wind") windIcon(c, x, 850, 90, 5);
    if (icon === "snow") snowIcon(c, x, 850, 32);
  }
  umbrellaClosed(c, 560, 884, 690, 824, 11);
  const k = person(c, 250, 800, 420, { sit: true, dir: 1, reachR: [400, 760] });
  cap(c, k.handR[0] + 6, k.handR[1] - 6, 30);
  arrow(c, [[418, 786], [442, 818]], RED, 7);
};
// flow.p1: the paper doll taped by the window in a raincoat; the five-day chart below
const flowP1 = (c: Ctx) => {
  ground(c, WALL);
  windowFrame(c, 130, 110, 520, 440, () => {
    c.fillStyle = SKYGREY; c.fillRect(130, 110, 520, 440);
    cloud(c, 390, 240, 300); rain(c, 390, 320, 260, 60, 6);
    cloud(c, 230, 400, 160, "#d4d8de", CLOUD);
  });
  paperDoll(c, 860, 600, 380);
  tape(c, 860, 240, 0); tape(c, 860, 592, 0);
  shape(c, () => rrect(c, 110, 650, 860, 220, 12), COL.paper, 6);
  for (let k = 0; k < 5; k++) {
    const x = 110 + k * 172;
    if (k) line(c, [[x, 650], [x, 870]], 4);
    if (k < 3) sunIcon(c, x + 86, 760, 40); else { cloud(c, x + 86, 736, 120, CLOUD, CLOUDDK, 5); rain(c, x + 86, 782, 100, 40, 5); }
  }
};
// term.0: four windows in a row: sunny, rainy, windy, cloudy
const termWeather = (c: Ctx) => {
  ground(c, WALL);
  const W = 230, H = 340, y = 370;
  [0, 1, 2, 3].forEach((k) => {
    const x = 42 + k * 254, cx = x + W / 2;
    windowFrame(c, x, y, W, H, () => {
      c.fillStyle = k === 0 ? COL.sky : k === 2 ? "#cfe3ef" : SKYGREY; c.fillRect(x, y, W, H);
      c.fillStyle = k === 0 ? COL.greenLt : COL.green; c.fillRect(x, y + H - 90, W, 90);
      if (k === 0) sunIcon(c, cx, y + 130, 46);
      if (k === 1) { cloud(c, cx, y + 110, 180); rain(c, cx, y + 160, 150, 70, 5); }
      if (k === 2) {
        const tr = [[cx - 55, y + H - 60], [cx - 50, y + 210], [cx - 25, y + 160], [cx + 20, y + 130]];
        line(c, tr, 26, INK); line(c, tr, 16, COL.brown);
        shape(c, () => ell(c, cx + 30, y + 112, 58, 42, -0.35), COL.leaf, 5);
        for (const [dx, dy] of [[70, 50], [78, 150], [60, 210]]) leaf(c, cx + dx, y + dy, 24, -0.1, COL.leaf);
        for (const dy of [70, 110]) line(c, [[x + 30, y + dy], [x + 62, y + dy]], 4, AIR);
      }
      if (k === 3) { cloud(c, cx + 30, y + 90, 190); cloud(c, cx - 40, y + 190, 170, "#9ea5ae", "#7f8690"); }
    });
  });
};
// term.1: clothes on a balcony line flapping in the wind, leaves blowing along the street below
const termWind = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = "#b9b4ab"; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  c.fillStyle = "#8f8a82"; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  for (let x = 60; x < D; x += 160) line(c, [[x, 990], [x + 70, 990]], 8, COL.paper);
  shape(c, () => rrect(c, 0, 700, D, 90, 0), "#e7d7bd", 6);
  for (let x = 40; x < D; x += 60) line(c, [[x, 470], [x, 700]], 10, INK);
  line(c, [[0, 470], [D, 470]], 14, INK);
  for (const [x, y] of [[60, 300], [1020, 300]]) shape(c, () => rrect(c, x - 12, y - 40, 24, 180, 6), COL.woodDk, 5);
  line(c, [[60, 300], [1020, 300]], 5, INK);
  const sway = 90;
  const shirt = (x: number, col: string, dk: string) => { const p = () => polyP(c, [[x - 70, 300], [x + 70, 300], [x + 70 + sway * 0.3, 360], [x + 50 + sway * 0.3, 360], [x + 50 + sway, 520], [x - 50 + sway, 520], [x - 50 + sway * 0.3, 360], [x - 70 + sway * 0.3, 360]]); shape(c, p, col); shade(c, p, dk, 20, 0, 0.35); };
  shirt(230, COL.blue, COL.blueDk);
  const dup = () => polyP(c, [[480, 300], [560, 300], [560 + sway * 0.6, 420], [600 + sway * 1.4, 520], [520 + sway * 1.4, 540], [480 + sway * 0.6, 420]]);
  shape(c, dup, COL.pink); shade(c, dup, "#d3708f", 16, 0, 0.35);
  const towel = () => polyP(c, [[760, 300], [860, 300], [860 + sway * 0.5, 440], [860 + sway, 560], [760 + sway, 560], [760 + sway * 0.5, 440]]);
  shape(c, towel, COL.teal); shade(c, towel, COL.tealDk, 16, 0, 0.35);
  for (const x of [230, 520, 810]) for (const d of [-40, 40]) shape(c, () => rrect(c, x + d - 10, 286, 20, 30, 4), COL.wood, 4);
  for (const y of [160, 220]) gust(c, 60, 260, y, 8);
  for (const [x, y, a] of [[180, 850, 0.3], [330, 880, -0.4], [520, 840, 0.6], [700, 870, -0.2], [880, 850, 0.4]]) { leaf(c, x, y, 64, a, COL.orange); line(c, [[x - 110, y + 10], [x - 40, y + 10]], 5, AIR); }
};
// term.2: a grey cloud over coconut trees, with a zoom-in on the tiny water drops it is made of
const termCloud = (c: Ctx) => {
  ground(c, COL.sky);
  c.fillStyle = COL.greenLt; c.fillRect(0, 980, D, 100); line(c, [[0, 980], [D, 980]], 6);
  coconutTree(c, 170, 980, 330, 30); coconutTree(c, 420, 980, 400, -20); coconutTree(c, 600, 980, 280, 25);
  cloud(c, 470, 300, 640);
  line(c, [[730, 380], [780, 410]], 6);
  shape(c, () => ell(c, 880, 450, 160, 160), WHITE, 8);
  c.save(); c.beginPath(); ell(c, 880, 450, 160, 160); c.clip();
  const pts = [[-100, -70], [-30, -110], [50, -90], [110, -40], [-110, 10], [-40, -20], [30, -10], [100, 40], [-80, 90], [-10, 70], [60, 110], [-120, -120]];
  pts.forEach(([dx, dy], i) => { const r = 22 + (i % 3) * 5; shape(c, () => ell(c, 880 + dx, 450 + dy, r, r), COL.water, 4); shape(c, () => ell(c, 880 + dx - r * 0.35, 450 + dy - r * 0.35, r * 0.22, r * 0.22), COL.drop, 0); });
  c.restore();
};
// term.3: the child in a woollen sweater with a thin rain jacket on top, an arrow to each layer
const termLayer = (c: Ctx) => {
  room(c, 920);
  const x = 540, y = 920, h = 600;
  person(c, x, y, h);
  const legLen = h * 0.4, hip = y - legLen, sh = hip - h * 0.27, torsoW = h * 0.25, uw = h * 0.062, l1 = h * 0.17, l2 = h * 0.155;
  const body = () => { c.moveTo(x - torsoW / 2, sh + h * 0.03); c.quadraticCurveTo(x - torsoW / 2, sh - h * 0.015, x - torsoW * 0.32, sh - h * 0.015); c.lineTo(x + torsoW * 0.32, sh - h * 0.015); c.quadraticCurveTo(x + torsoW / 2, sh - h * 0.015, x + torsoW / 2, sh + h * 0.03); c.lineTo(x + torsoW * 0.44, hip + h * 0.05); c.quadraticCurveTo(x, hip + h * 0.09, x - torsoW * 0.44, hip + h * 0.05); c.closePath(); };
  shape(c, body, WOOL); knit(c, x - torsoW / 2, sh, x + torsoW / 2, hip + h * 0.09, WOOLDK);
  for (const side of [-1, 1]) {
    const sx = x + side * torsoW * 0.42, sy = sh + h * 0.03, a0 = side < 0 ? Math.PI * 0.52 : Math.PI * 0.48;
    const ex = sx + Math.cos(a0) * l1, ey = sy + Math.sin(a0) * l1, wx = ex, wy = ey + l2;
    line(c, [[sx, sy], [ex, ey]], uw, WOOL); line(c, [[ex, ey], [wx, wy]], uw * 0.82, WOOL);
    line(c, [[sx, sy], [ex, ey]], uw, RAIN); line(c, [[ex, ey], [ex, ey + l2 * 0.7]], uw * 0.82, RAIN);
    line(c, [[ex, ey + l2 * 0.7], [ex, ey + l2 * 0.78]], uw * 0.82, RAINDK);
    shape(c, () => ell(c, sx, sy, uw * 0.62, uw * 0.62), RAIN, 0);
  }
  for (const side of [-1, 1]) {
    const panel = () => { c.moveTo(x + side * torsoW * 0.5, sh + h * 0.03); c.lineTo(x + side * torsoW * 0.5, sh - h * 0.005); c.lineTo(x + side * torsoW * 0.3, sh - h * 0.015); c.lineTo(x + side * 20, sh + h * 0.04); c.lineTo(x + side * 20, hip); c.lineTo(x + side * torsoW * 0.46, hip); c.closePath(); };
    shape(c, panel, RAIN); shade(c, panel, RAINDK, side * 12, 0, 0.35);
  }
  shape(c, () => { c.moveTo(x - 66, sh - h * 0.015 + 4); c.quadraticCurveTo(x - 70, sh + h * 0.05, x - 20, sh + h * 0.045); c.lineTo(x + 20, sh + h * 0.045); c.quadraticCurveTo(x + 70, sh + h * 0.05, x + 66, sh - h * 0.015 + 4); c.closePath(); }, RAINDK, 5);
  arrow(c, [[150, 470], [x - torsoW * 0.5 - 14, sh + h * 0.09]], RED, 10);
  arrow(c, [[150, 860], [x - torsoW * 0.3, hip + h * 0.06]], RED, 10);
};

export const ic_weatherWeatherL1 = cards("sci.weather.weather.L1", [setupE1a, setupE1b, setupE1c, flowE1, flowA1, flowA2, flowA3, flowP1, termWeather, termWind, termCloud, termLayer]);
