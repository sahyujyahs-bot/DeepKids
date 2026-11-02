import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// SIMPLE CIRCUITS L3 · picture cards for the intro, summary, activities, terms and explanations.
// Same objects as the set-up cards: a steel AA cell with a blue band (copper nub = +), a round torch
// bulb with a steel collar, slate wires with bare copper tips.

const COPPER = "#d8894e", HOT = "#fff3a0", WIRE = "#4a5568", GREEN = "#3f9a4a";

const rot = (c: Ctx, x: number, y: number, a: number, f: () => void) => { c.save(); c.translate(x, y); c.rotate(a); f(); c.restore(); };
const wire = (c: Ctx, pts: number[][], col = WIRE, w = 13) => { line(c, pts, w + 9, INK); line(c, pts, w, col); };
const tip = (c: Ctx, x: number, y: number, dx: number, dy: number, len = 16) => { const e = [[x, y], [x + dx * len, y + dy * len]]; line(c, e, 16, INK); line(c, e, 8, COPPER); };

// a bulb glass at (x, y), radius r; state 0 off, 1 dim, 2 bright
const bulbGlass = (c: Ctx, x: number, y: number, r: number, state: number) => {
  if (state) {
    c.beginPath(); ell(c, x, y, r * 2.6, r * 2.6); c.fillStyle = `rgba(255,224,80,${state === 2 ? 0.3 : 0.12})`; c.fill();
    c.beginPath(); ell(c, x, y, r * 1.8, r * 1.8); c.fillStyle = `rgba(255,224,80,${state === 2 ? 0.45 : 0.18})`; c.fill();
    const n = state === 2 ? 12 : 8;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + 0.2, a0 = r * (state === 2 ? 1.35 : 1.25), a1 = r * (state === 2 ? 1.95 : 1.5); line(c, [[x + Math.cos(a) * a0, y + Math.sin(a) * a0], [x + Math.cos(a) * a1, y + Math.sin(a) * a1]], r * 0.14, "#f5b800"); }
  }
  const g = () => { c.moveTo(x - r * 0.45, y + r * 1.15); c.bezierCurveTo(x - r * 0.45, y + r * 0.7, x - r, y + r * 0.5, x - r, y); c.arc(x, y, r, Math.PI, 0); c.bezierCurveTo(x + r, y + r * 0.5, x + r * 0.45, y + r * 0.7, x + r * 0.45, y + r * 1.15); c.closePath(); };
  shape(c, g, state === 2 ? HOT : state === 1 ? "#fbf0c8" : "rgba(214,236,250,0.8)", 6);
  if (state === 0) shade(c, g, COL.glassEdge, r * 0.2, 0, 0.25);
  const fy = y + r * 0.05;
  line(c, [[x - r * 0.4, y + r * 1.1], [x - r * 0.4, fy]], 4); line(c, [[x + r * 0.4, y + r * 1.1], [x + r * 0.4, fy]], 4);
  line(c, [[x - r * 0.4, fy], [x - r * 0.27, fy - r * 0.22], [x - r * 0.13, fy], [x, fy - r * 0.22], [x + r * 0.13, fy], [x + r * 0.27, fy - r * 0.22], [x + r * 0.4, fy]], state === 2 ? 7 : 5, state === 2 ? "#ff7a1a" : state === 1 ? "#c98a3a" : INK);
  shine(c, [[x - r * 0.62, y - r * 0.25], [x - r * 0.4, y - r * 0.62]], r * 0.12);
};
// a bulb standing with its steel collar's top at y: glass above, collar, tip below
const bulbStand = (c: Ctx, x: number, y: number, r: number, state: number) => {
  bulbGlass(c, x, y - r * 1.15 - r * 0.05, r, state);
  const col = () => rrect(c, x - r * 0.62, y - r * 0.04, r * 1.24, r * 0.7, 8);
  shape(c, col, COL.steel); shade(c, col, COL.steelDk, r * 0.14, 0, 0.7);
  for (let i = 0; i < 3; i++) line(c, [[x - r * 0.62, y + r * 0.1 + i * r * 0.18], [x + r * 0.62, y + r * 0.16 + i * r * 0.18]], 3, COL.steelDk);
  shape(c, () => rrect(c, x - r * 0.16, y + r * 0.64, r * 0.32, r * 0.2, 4), COPPER, 5);
};

// a horizontal AA cell centred at (cx, cy); the copper nub (+) on the right if plusRight
const CW = 170, CH = 70;
const cellH = (c: Ctx, cx: number, cy: number, plusRight = true, w = CW, h = CH, glyphs = true) => {
  shadow(c, cx + 14, cy + h / 2 + 8, w / 2 + 12, 12);
  const nx = plusRight ? cx + w / 2 - 2 : cx - w / 2 + 2 - 18;
  shape(c, () => rrect(c, nx, cy - h * 0.24, 20, h * 0.48, 6), COPPER, 5);
  const body = () => rrect(c, cx - w / 2, cy - h / 2, w, h, h * 0.32);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 6, h * 0.18, 0.7);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.blue; c.fillRect(cx - w * 0.3, cy - h, w * 0.6, h * 2); c.restore();
  c.beginPath(); body(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  if (glyphs) {
    const [px, mx] = plusRight ? [cx + w / 2 - h * 0.78, cx - w / 2 + h * 0.3] : [cx - w / 2 + h * 0.3, cx + w / 2 - h * 0.7];
    write(c, "+", px, cy - h * 0.2, h * 0.4, RED, 6); write(c, "-", mx, cy - h * 0.2, h * 0.4, WHITE, 6);
  }
};
// an upright AA cell, bottom centre (x, yb): copper nub on top
const cellUp = (c: Ctx, x: number, yb: number, w = 150, h = 340) => {
  shadow(c, x + 16, yb + 6, w * 0.7, 16);
  shape(c, () => rrect(c, x - 30, yb - h - 20, 60, 26, 6), COPPER, 5);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, 30);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 18, 0, 0.7);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.blue; c.fillRect(x - w, yb - h * 0.8, w * 2, h * 0.6); c.restore();
  c.beginPath(); body(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  write(c, "+", x - 14, yb - h * 0.76, 40, RED, 7); write(c, "-", x - 12, yb - h * 0.2, 40, WHITE, 7);
};
// the standing pair: a cell with a bulb on its top; wire joins the bulb's side to the cell's bottom
const upPair = (c: Ctx, x: number, yb: number, state: number, withWire: boolean) => {
  cellUp(c, x, yb);
  bulbStand(c, x, yb - 340 - 20 - 56 * 0.84 - 4, 70, state);
  if (withWire) {
    const cy = yb - 340 - 20 - 56 * 0.84 - 4 + 30;
    wire(c, [[x + 44, cy], [x + 190, cy], [x + 190, yb + 22], [x + 40, yb + 22]]);
    tip(c, x + 40, yb + 22, -1, 0, 12);
    c.save(); c.beginPath(); c.rect(x - 200, yb - 8, 400, 40); c.clip(); c.restore();
  }
};

// ---------------------------------------------------------------- the loop
type Gap = { side: "L" | "R"; at: "cell" | "low" | "mid" | "top"; len: number; bg?: (c: Ctx, x: number, y: number) => void; fg?: (c: Ctx, x: number, y: number) => void };
type Loop = { bulb: number; cells?: number; flip?: boolean; gap?: Gap; arrows?: boolean };
const X0 = -350, X1 = 350, Y0 = -190, Y1 = 210;
const plen = (p: number[][]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
const sub = (p: number[][], a: number, b: number) => {
  const out: number[][] = []; let acc = 0;
  for (let i = 0; i < p.length - 1; i++) {
    const [ax, ay] = p[i], [bx, by] = p[i + 1], L = Math.hypot(bx - ax, by - ay);
    const s0 = Math.max(a, acc), s1 = Math.min(b, acc + L);
    if (s1 > s0) { const f0 = (s0 - acc) / L, f1 = (s1 - acc) / L; if (!out.length) out.push([ax + (bx - ax) * f0, ay + (by - ay) * f0]); out.push([ax + (bx - ax) * f1, ay + (by - ay) * f1]); }
    acc += L;
  }
  return out;
};
const loop = (c: Ctx, o: Loop) => {
  const n = o.cells ?? 1, bx = 0, sp = CW + (o.flip ? 34 : 16);
  const cs = n === 1 ? [{ x: 0, pr: true }] : [{ x: -sp / 2, pr: true }, { x: sp / 2, pr: !o.flip }];
  const le = Math.min(...cs.map((k) => k.x - CW / 2 - (k.pr ? 0 : 18))), re = Math.max(...cs.map((k) => k.x + CW / 2 + (k.pr ? 18 : 0)));
  const R = [[re, Y1], [X1, Y1], [X1, Y0], [bx + 50, Y0]], L = [[le, Y1], [X0, Y1], [X0, Y0], [bx - 50, Y0]];
  const g = o.gap;
  let parts: number[][][] = [R, L], gapAt: number[] | null = null;
  if (g) {
    const p = g.side === "R" ? R : L, a = plen(p.slice(0, 2)), b = plen(p.slice(1, 3)), t = plen(p.slice(2));
    const s = g.at === "cell" ? a * 0.55 : g.at === "low" ? a + b * 0.25 : g.at === "mid" ? a + b * 0.5 : a + b + t * 0.5;
    const s0 = s - g.len / 2, s1 = s + g.len / 2, A = sub(p, 0, s0), B = sub(p, s1, plen(p));
    const mid = sub(p, s, s + 0.01)[0]; gapAt = mid;
    g.bg?.(c, mid[0], mid[1]);
    parts = [g.side === "R" ? A : B, g.side === "R" ? B : A, g.side === "R" ? L : R].filter((q) => q.length > 1);
    parts.forEach((q) => wire(c, q));
    for (const [q, last] of [[A, true], [B, false]] as [number[][], boolean][]) {
      const e = last ? q[q.length - 1] : q[0], f = last ? sub(p, s0 + 0.01, s0 + 1)[0] : sub(p, s1 - 1, s1 - 0.99)[0];
      const dx = Math.sign(e[0] - (last ? q[q.length - 2] : q[1])[0]) * (last ? 1 : -1), dy = Math.sign(e[1] - (last ? q[q.length - 2] : q[1])[1]) * (last ? 1 : -1);
      void f; tip(c, e[0], e[1], dx || 0, dy || 0, 14);
    }
    g.fg?.(c, mid[0], mid[1]);
  } else parts.forEach((q) => wire(c, q));
  void gapAt;
  cs.forEach((k) => cellH(c, k.x, Y1, k.pr));
  // the bulb on the top wire
  bulbGlass(c, bx, Y0 - 34 - 80.5, 70, o.bulb);
  const col = () => rrect(c, bx - 50, Y0 - 34, 100, 50, 8);
  shape(c, col, COL.steel); shade(c, col, COL.steelDk, 12, 0, 0.7);
  for (let i = 0; i < 3; i++) line(c, [[bx - 50, Y0 - 22 + i * 14], [bx + 50, Y0 - 16 + i * 14]], 3, COL.steelDk);
  if (o.arrows) {
    arrow(c, [[X1 + 58, Y0 + 260], [X1 + 58, Y0 + 130]]);
    arrow(c, [[-130, Y0 - 52], [-250, Y0 - 52]]);
    arrow(c, [[X0 - 58, Y0 + 130], [X0 - 58, Y0 + 260]]);
    arrow(c, [[X0 + 60, Y1 + 68], [X0 + 190, Y1 + 68]]);
    arrow(c, [[re + 40, Y1 + 68], [re + 170, Y1 + 68]]);
  }
};
// draw a loop at scale s, its middle at (ox, oy)
const at = (c: Ctx, ox: number, oy: number, s: number, o: Loop) => { c.save(); c.translate(ox, oy + 70 * s); c.scale(s, s); loop(c, o); c.restore(); };

// ---------------------------------------------------------------- things
const spoon = (c: Ctx, x: number, y: number, a: number, s = 1) => rot(c, x, y, a, () => {
  c.scale(s, s);
  shadow(c, 10, 38, 120, 12);
  shape(c, () => { c.moveTo(-30, -12); c.lineTo(110, -8); c.quadraticCurveTo(122, 0, 110, 8); c.lineTo(-30, 12); c.closePath(); }, COL.steel);
  shape(c, () => ell(c, -70, 0, 62, 42), COL.steel); shape(c, () => ell(c, -72, -2, 46, 28), COL.steelIn, 4);
});
const eraser = (c: Ctx, x: number, y: number, a: number) => rot(c, x, y, a, () => { const p = () => rrect(c, -80, -36, 160, 74, 14); shape(c, p, COL.pink); shade(c, p, "#d97a98", 10, 10, 0.5); shape(c, () => rrect(c, -36, -36, 72, 74, 4), COL.blue, 5); });
const coin = (c: Ctx, x: number, y: number) => { shadow(c, x + 8, y + 50, 70, 10); shape(c, () => ell(c, x, y, 64, 64), "#d9d6c8"); shape(c, () => ell(c, x, y, 46, 46), "#e9e6da", 4); write(c, "1", x - 11, y - 22, 44, COL.greyDk, 7); };
const foil = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 8, y + 56, 70, 10);
  const p = () => { for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, r = 62 + (i % 2) * 9; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); };
  shape(c, p, COL.steelIn); shade(c, p, COL.steelDk, 18, 14, 0.6); line(c, [[x - 24, y - 12], [x + 4, y + 10], [x - 8, y + 32]], 3, COL.steelDk);
};
const clipP = [[-50, 24], [-50, -22], [26, -22], [26, 14], [-26, 14], [-26, -6], [56, -6]];
const paperclip = (c: Ctx, x: number, y: number, a: number, s = 1) => rot(c, x, y, a, () => { c.scale(s, s); line(c, clipP, 15, INK); line(c, clipP, 7, COL.steelDk); });
const pin = (c: Ctx, x: number, y: number) => { shadow(c, x + 6, y + 14, 22, 6); shape(c, () => ell(c, x, y, 22, 16), COL.steel, 5); line(c, [[x - 10, y - 4], [x - 2, y - 8]], 4, WHITE); };
const board = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 10, y + h + 10, w / 2, 14); const p = () => rrect(c, x, y, w, h, 10); shape(c, p, COL.brown); shade(c, p, "#8c5a2c", 8, 8, 0.5); };
const tick = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), GREEN, 6); line(c, [[x - r * 0.45, y + r * 0.02], [x - r * 0.1, y + r * 0.38], [x + r * 0.5, y - r * 0.35]], r * 0.18, WHITE); };
const cross = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), RED, 6); line(c, [[x - r * 0.4, y - r * 0.4], [x + r * 0.4, y + r * 0.4]], r * 0.18, WHITE); line(c, [[x + r * 0.4, y - r * 0.4], [x - r * 0.4, y + r * 0.4]], r * 0.18, WHITE); };
const socket = (c: Ctx, x: number, y: number, w: number, withPlug = false) => {
  shadow(c, x + 14, y + w / 2 + 10, w / 2, 16);
  const p = () => rrect(c, x - w / 2, y - w / 2, w, w, w * 0.08);
  shape(c, p, COL.cloth); shade(c, p, "#d9d1bd", w * 0.03, w * 0.03, 0.6);
  shape(c, () => rrect(c, x - w * 0.36, y - w * 0.36, w * 0.72, w * 0.72, w * 0.05), "#efe9d8", 4);
  if (withPlug) return;
  shape(c, () => ell(c, x, y - w * 0.18, w * 0.07, w * 0.07), COL.black, 0);
  shape(c, () => ell(c, x - w * 0.18, y + w * 0.12, w * 0.07, w * 0.07), COL.black, 0);
  shape(c, () => ell(c, x + w * 0.18, y + w * 0.12, w * 0.07, w * 0.07), COL.black, 0);
};
const plug = (c: Ctx, x: number, y: number, w: number) => {
  line(c, [[x, y + w * 0.3], [x, y + w * 0.7], [x - w * 0.2, y + w * 1.2]], w * 0.16 + 9, INK); line(c, [[x, y + w * 0.3], [x, y + w * 0.7], [x - w * 0.2, y + w * 1.2]], w * 0.16, COL.black);
  const b = () => rrect(c, x - w * 0.34, y - w * 0.34, w * 0.68, w * 0.68, w * 0.14);
  shadow(c, x + 14, y + w * 0.4, w * 0.36, 12);
  shape(c, b, COL.blue); shade(c, b, COL.blueDk, w * 0.06, w * 0.05, 0.6);
  shine(c, [[x - w * 0.24, y - w * 0.2], [x - w * 0.24, y + w * 0.05]], 8);
};
const warn = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x, y - s * 0.55); c.lineTo(x + s * 0.55, y + s * 0.4); c.lineTo(x - s * 0.55, y + s * 0.4); c.closePath(); };
  shape(c, p, COL.yellow, 10); line(c, [[x, y - s * 0.2], [x, y + s * 0.12]], s * 0.07, INK); shape(c, () => ell(c, x, y + s * 0.26, s * 0.05, s * 0.05), INK, 0);
  c.lineWidth = 10; c.strokeStyle = RED; c.lineJoin = "round"; c.beginPath(); p(); c.stroke();
};
const vee = (c: Ctx, x: number, y: number, h: number, col = INK) => line(c, [[x, y], [x + h * 0.32, y + h], [x + h * 0.64, y]], 7, col);
const dot = (c: Ctx, x: number, y: number) => shape(c, () => ell(c, x, y, 5, 5), INK, 0);
const tag = (c: Ctx, x: number, y: number, w: number, h: number) => shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 12), WHITE, 5);
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => { c.beginPath(); rrect(c, x, y, w, h, 26); c.fillStyle = col; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); };
const sparkle = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s * 0.5, y - s], [x + s * 0.1, y - s * 0.1], [x - s * 0.3, y - s * 0.05], [x + s * 0.4, y + s]], 8, "#f5b800");
const switchBoard = (c: Ctx, x: number, y: number) => { board(c, x - 62, y - 100, 124, 200); };
const switchClip = (open: boolean) => (c: Ctx, x: number, y: number) => {
  pin(c, x, y - 64); pin(c, x, y + 64);
  const tipP = open ? [x + 62, y + 18] : [x, y + 64];
  line(c, [[x, y - 64], tipP], 16, INK); line(c, [[x, y - 64], tipP], 8, COL.steelDk);
  pin(c, x, y - 64);
  if (!open) pin(c, x, y + 64);
};

// ---------------------------------------------------------------- the cards
const intro = (c: Ctx) => {
  ground(c);
  upPair(c, 270, 900, 0, false);
  upPair(c, 760, 900, 2, true);
  arrow(c, [[420, 640], [560, 640]]);
};
const summary = (c: Ctx) => { ground(c); at(c, 540, 560, 1.05, { bulb: 2, arrows: true }); };
const e1 = (c: Ctx) => {
  ground(c);
  const g = (o: (c: Ctx, x: number, y: number) => void) => ({ side: "R" as const, at: "mid" as const, len: 150, fg: o });
  at(c, 290, 540, 0.56, { bulb: 2, gap: g((c2, x, y) => spoon(c2, x - 40, y, Math.PI / 2, 0.95)) });
  at(c, 800, 540, 0.56, { bulb: 0, gap: g((c2, x, y) => eraser(c2, x, y, Math.PI / 2)) });
  tick(c, 290, 960, 56); cross(c, 800, 960, 56);
};
const e2 = (c: Ctx) => {
  ground(c);
  at(c, 290, 540, 0.56, { bulb: 0, gap: { side: "R", at: "low", len: 150 } });
  at(c, 800, 540, 0.56, { bulb: 0, gap: { side: "L", at: "top", len: 150 } });
};
const e3 = (c: Ctx) => {
  ground(c);
  at(c, 290, 540, 0.56, { bulb: 2, cells: 2 });
  at(c, 800, 540, 0.56, { bulb: 0, cells: 2, flip: true });
  tick(c, 290, 960, 56); cross(c, 800, 960, 56);
};
const a1 = (c: Ctx) => {
  ground(c);
  cellH(c, 250, 230, true, 260, 100); bulbStand(c, 590, 150, 62, 0);
  wire(c, [[790, 260], [850, 190], [920, 270], [980, 200]]); tip(c, 790, 260, -1, 0.3, 14); tip(c, 980, 200, 1, -0.3, 14);
  arrow(c, [[540, 400], [540, 500]]);
  c.save(); c.translate(540, 1020); c.scale(0.6, 0.6); c.translate(-540, -1020); upPair(c, 540, 1020, 2, true); c.restore();
};
const a2 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 100, 480, 880, "#f6dcc0"); panel(c, 560, 100, 480, 880, "#cfe6f2");
  socket(c, 280, 420, 330, true); plug(c, 280, 420, 200);
  cellUp(c, 800, 900, 150, 340);
  const remote = () => rrect(c, 735, 190, 130, 330, 24);
  shape(c, remote, COL.black); for (let i = 0; i < 4; i++) shape(c, () => ell(c, 770 + (i % 2) * 60, 260 + Math.floor(i / 2) * 60, 18, 18), i === 0 ? RED : COL.steel, 4);
  shape(c, () => ell(c, 800, 460, 22, 22), COL.steelDk, 4);
};
const a3 = (c: Ctx) => {
  ground(c);
  socket(c, 740, 400, 340, false);
  glassSimple(c, 700, 900);
  c.beginPath(); ell(c, 740, 400, 230, 230); c.lineWidth = 12; c.strokeStyle = RED; c.stroke();
  person(c, 270, 960, 640, { armR: [Math.PI * 0.4, Math.PI * 0.6] });
};
const glassSimple = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 14, y + 8, 90, 14);
  const body = () => { c.moveTo(x - 80, y - 190); c.lineTo(x + 80, y - 190); c.lineTo(x + 60, y); c.lineTo(x - 60, y); c.closePath(); };
  shape(c, () => { c.moveTo(x - 74, y - 110); c.lineTo(x + 74, y - 110); c.lineTo(x + 60, y); c.lineTo(x - 60, y); c.closePath(); }, COL.water, 0);
  shape(c, body, COL.glass, 5);
  c.beginPath(); c.moveTo(x - 74, y - 110); c.lineTo(x + 74, y - 110); c.strokeStyle = COL.waterDk; c.lineWidth = 5; c.stroke();
  shine(c, [[x - 50, y - 160], [x - 40, y - 30]], 7);
};
const a4 = (c: Ctx) => {
  ground(c);
  panel(c, 40, 100, 1000, 880, COL.cloth);
  // torch head: cone reflector with a bulb inside
  shadow(c, 300, 480, 180, 18);
  shape(c, () => polyP(c, [[330, 250], [330, 450], [190, 520], [190, 190]]), COL.steelDk, 6);
  shape(c, () => rrect(c, 330, 280, 130, 140, 14), COL.steel);
  shape(c, () => ell(c, 190, 355, 40, 165), COL.steelIn, 6);
  bulbGlass(c, 195, 350, 38, 0);
  // barrel
  shadow(c, 760, 490, 240, 16);
  shape(c, () => rrect(c, 520, 270, 430, 190, 36), COL.teal); shade(c, () => rrect(c, 520, 270, 430, 190, 36), COL.tealDk, 10, 16, 0.6);
  shape(c, () => ell(c, 524, 365, 26, 80), COL.black, 5);
  // two cells and the cap
  cellH(c, 270, 720, true, 260, 100, false); cellH(c, 270, 880, true, 260, 100, false);
  shadow(c, 760, 840, 150, 16);
  shape(c, () => rrect(c, 640, 660, 260, 190, 32), COL.teal); shade(c, () => rrect(c, 640, 660, 260, 190, 32), COL.tealDk, 10, 16, 0.6);
  line(c, [[640, 755], [600, 740], [620, 770], [580, 755]], 8, COL.steelDk);
  arrow(c, [[780, 560], [780, 620]]);
};
const a5 = (c: Ctx) => {
  ground(c);
  board(c, 190, 340, 700, 460);
  wire(c, [[40, 570], [330, 570]]); tip(c, 330, 570, 1, 0, 12);
  wire(c, [[1040, 570], [750, 570]]); tip(c, 750, 570, -1, 0, 12);
  pin(c, 360, 570); pin(c, 720, 570);
  const p = [[360, 570], [660, 400]];
  line(c, p, 18, INK); line(c, p, 9, COL.steelDk); pin(c, 360, 570);
  arrow(c, [[660, 330], [740, 400], [740, 480]]);
};
const a6 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, rx = 290, ry = 230;
  c.beginPath(); ell(c, cx, cy, rx, ry); c.strokeStyle = INK; c.lineWidth = 20; c.stroke(); c.strokeStyle = COL.pink; c.lineWidth = 11; c.stroke();
  const who: number[][] = [[cx - rx, cy, 0, -75, 0], [cx + rx, cy, 1, 75, 0], [cx, cy - ry, 0, 0, -75], [cx, cy + ry, 1, 0, 75]];
  who.forEach(([x, y, ad, ox, oy]) => {
    const wide = ox !== 0;
    shape(c, () => ell(c, x + ox, y + oy, wide ? 105 : 150, wide ? 150 : 105), ad ? CLOTH.adult : CLOTH.child, 6);
    shape(c, () => ell(c, x + ox * 1.05, y + oy * 1.05, 58, 58), CLOTH.hair, 6);
  });
  who.forEach(([x, y]) => shape(c, () => ell(c, x, y, 26, 26), SKIN.child, 5));
  arrow(c, [[cx - 110, cy - 80], [cx + 110, cy - 80]]);
  arrow(c, [[cx + 110, cy + 80], [cx - 110, cy + 80]]);
};
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 450, 900, 350, 20);
  shape(c, () => rrect(c, 100, 300, 700, 580, 14), COL.brown);
  shape(c, () => rrect(c, 140, 340, 620, 500, 6), "#f7e9c8", 5);
  c.fillStyle = "#e3c58a"; c.fillRect(143, 740, 614, 97);
  line(c, [[143, 740], [757, 740]], 5);
  // a bed and a table
  shape(c, () => rrect(c, 190, 660, 220, 80, 12), COL.blue); shape(c, () => rrect(c, 190, 620, 70, 50, 14), COL.paper, 5);
  shape(c, () => rrect(c, 520, 660, 150, 24, 6), COL.wood); line(c, [[540, 684], [540, 740]], 12); line(c, [[650, 684], [650, 740]], 12);
  // the bulb hangs from the ceiling
  bulbGlass(c, 450, 520, 60, 2);
  wire(c, [[420, 600], [420, 400], [420, 270], [920, 270], [920, 520]]);
  wire(c, [[480, 600], [480, 440], [800, 440], [920, 440], [920, 860]]);
  cellUp(c, 920, 860, 100, 250);
  shape(c, () => rrect(c, 440, 590, 20, 14, 3), COPPER, 4);
};
const c1 = (c: Ctx) => {
  ground(c);
  board(c, 130, 360, 820, 360);
  const path = [[190, 600], [330, 510], [450, 600], [590, 500], [720, 590], [880, 480]];
  line(c, path, 26, INK); line(c, path, 14, COL.steelIn);
  // wand with a ring round the wire
  line(c, [[590, 500], [800, 200]], 20, INK); line(c, [[590, 500], [800, 200]], 11, COL.wood);
  c.beginPath(); ell(c, 590, 500, 38, 38); c.lineWidth = 16; c.strokeStyle = INK; c.stroke(); c.lineWidth = 8; c.strokeStyle = COL.steel; c.stroke();
  hand(c, 880, 140, Math.atan2(500 - 140, 590 - 880), 1.1);
  // cell and dark bulb underneath
  cellH(c, 300, 900, true, 200, 80);
  bulbStand(c, 700, 860, 56, 0);
  wire(c, [[110, 900], [110, 600], [190, 600]]); tip(c, 190, 600, 1, 0, 10);
  wire(c, [[110, 900], [200, 900]]);
  wire(c, [[418, 900], [650, 900]]);
  wire(c, [[750, 900], [1000, 900], [1000, 200], [930, 200]]);
};
const c2 = (c: Ctx) => {
  ground(c);
  shadow(c, 340, 880, 260, 20);
  shape(c, () => polyP(c, [[110, 880], [610, 880], [570, 800], [150, 800]]), COL.brown);
  shape(c, () => polyP(c, [[150, 800], [570, 800], [560, 780], [160, 780]]), "#8c5a2c", 4);
  person(c, 360, 800, 640);
  wire(c, [[570, 850], [640, 850], [640, 940], [700, 940]]);
  cellH(c, 760, 940, true, 160, 70);
  wire(c, [[840, 940], [880, 940], [880, 870]]);
  bulbStand(c, 900, 760, 62, 2);
  wire(c, [[960, 800], [1020, 800], [1020, 1020], [260, 1020], [260, 880]]);
};
const t0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d9bd"; c.fillRect(0, 0, 1080, 110); line(c, [[0, 110], [1080, 110]], 6);
  // wall switch with a wire from the ceiling
  wire(c, [[760, 110], [930, 110], [930, 660]]);
  shape(c, () => rrect(c, 880, 660, 100, 160, 12), COL.cloth); shape(c, () => rrect(c, 905, 700, 50, 80, 8), COL.steel, 5);
  line(c, [[540, 110], [540, 270]], 14, INK); line(c, [[540, 110], [540, 270]], 6, COL.steelDk);
  // fan blades
  shape(c, () => ell(c, 300, 420, 230, 46, -0.12), COL.teal); shape(c, () => ell(c, 780, 420, 230, 46, 0.12), COL.teal);
  shape(c, () => ell(c, 540, 330, 80, 48), COL.steel);
  shape(c, () => ell(c, 540, 560, 56, 130), COL.teal); shade(c, () => ell(c, 540, 560, 56, 130), COL.tealDk, 12, 12, 0.6);
  const ring: number[][] = []; for (let i = 0; i < 24; i++) { const a = Math.PI * (0.15 + i * 0.062); ring.push([540 + Math.cos(a) * 440, 450 + Math.sin(a) * 200]); }
  arrow(c, ring.slice(0, 16));
  shape(c, () => ell(c, 540, 330, 40, 24), COL.steelDk, 4);
};
const t3 = (c: Ctx) => {
  ground(c);
  cellH(c, 540, 640, true, 600, 220, false);
  write(c, "+", 656, 600, 90, RED, 14); write(c, "-", 280, 600, 90, WHITE, 14);
  arrow(c, [[860, 300], [850, 470]]); arrow(c, [[232, 300], [240, 500]]);
  c.beginPath(); ell(c, 860, 220, 70, 70); c.fillStyle = WHITE; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); write(c, "+", 838, 190, 56, RED, 10);
  c.beginPath(); ell(c, 232, 220, 70, 70); c.fillStyle = WHITE; c.fill(); c.stroke(); write(c, "-", 210, 190, 56, INK, 10);
};
const t5 = (c: Ctx) => { ground(c); at(c, 450, 540, 0.88, { bulb: 2 }); tick(c, 900, 200, 90); };
const t6 = (c: Ctx) => { ground(c); at(c, 450, 540, 0.88, { bulb: 0, gap: { side: "R", at: "low", len: 190 } }); cross(c, 900, 200, 90); };
const t9 = (c: Ctx) => {
  ground(c);
  [[270, 270], [810, 270], [270, 790], [810, 790]].forEach(([x, y]) => { bulbGlass(c, x, y - 70, 52, 2); });
  spoon(c, 270, 400, 0, 0.8); coin(c, 810, 400); paperclip(c, 270, 920, 0, 1.6); foil(c, 810, 920);
};
const t11 = (c: Ctx) => { ground(c); socket(c, 400, 480, 460, true); plug(c, 400, 480, 270); warn(c, 850, 460, 330); };
const t12 = (c: Ctx) => {
  ground(c);
  cellUp(c, 270, 900, 190, 420);
  tag(c, 270, 230, 260, 130); write(c, "1", 150, 195, 70, INK, 9); dot(c, 215, 255); write(c, "5", 235, 195, 70, INK, 9); vee(c, 320, 195, 70);
  socket(c, 790, 640, 360, false);
  tag(c, 790, 230, 330, 130); write(c, "230", 640, 195, 70, INK, 9); vee(c, 880, 195, 70);
};
const t13 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 430, r = 360;
  // the wire, with a lens over a bit of it
  shape(c, () => rrect(c, 0, 880, 1080, 110, 20), COPPER, 6);
  line(c, [[0, 910], [1080, 910]], 6, "#f2b27c");
  line(c, [[cx - 140, 790], [cx - 140, 880]], 5); line(c, [[cx + 140, 790], [cx + 140, 880]], 5);
  c.save(); c.beginPath(); ell(c, cx, cy, r, r); c.clip(); c.fillStyle = "#fbe3cc"; c.fillRect(0, 0, 1080, 1080);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) shape(c, () => ell(c, 280 + j * 170 + (i % 2) * 85, 200 + i * 170, 52, 52), COPPER, 5);
  c.restore();
  const el = [[330, 275], [430, 365], [560, 275], [700, 360], [800, 280], [350, 530], [500, 450], [630, 535], [780, 450], [440, 610], [700, 620]];
  el.forEach(([x, y]) => { shape(c, () => ell(c, x, y, 20, 20), COL.blue, 4); line(c, [[x - 8, y], [x + 8, y]], 4, WHITE); });
  arrow(c, [[300, 190], [440, 190]]); arrow(c, [[640, 700], [780, 700]]);
  c.beginPath(); ell(c, cx, cy, r, r); c.lineWidth = 12; c.strokeStyle = INK; c.stroke();
};
const t14 = (c: Ctx) => {
  ground(c);
  wire(c, [[830, 640], [830, 340], [250, 340], [250, 640]], "#e0603a");
  cellH(c, 540, 640, true, 520, 200, false);
  write(c, "+", 700, 590, 80, RED, 12); write(c, "-", 330, 590, 80, WHITE, 12);
  for (let k = 0; k < 3; k++) { const x = 400 + k * 140; line(c, [[x, 270], [x + 20, 220], [x - 20, 170], [x, 120]], 9, "#e4523b"); }
  sparkle(c, 830, 330, 40);
  cross(c, 900, 170, 80);
};
const t15 = (c: Ctx) => {
  ground(c);
  line(c, [[330, 0], [330, 520]], 40, INK); line(c, [[330, 0], [330, 520]], 28, COL.black);
  const cu = [[[330, 520], [290, 640]], [[330, 520], [330, 660]], [[330, 520], [372, 635]], [[330, 520], [250, 600]]];
  cu.forEach((p) => { line(c, p, 14, INK); line(c, p, 7, COPPER); });
  sparkle(c, 330, 710, 46);
  hand(c, 930, 600, Math.PI, 1.3, SKIN.child, CLOTH.child, true);
  cross(c, 600, 440, 70);
  arrow(c, [[780, 420], [690, 420]]);
};
const e0 = (c: Ctx) => {
  ground(c);
  const tile = (x: number, y: number, col: string, f: () => void) => { panel(c, x - 160, y - 160, 320, 320, col); f(); };
  // light
  tile(210, 250, "#fdf1c6", () => { shape(c, () => rrect(c, 90, 220, 240, 36, 18), WHITE); [110, 170, 230, 290].forEach((x) => line(c, [[x, 280], [x - 18, 340]], 7, "#f5b800")); });
  // sound: a TV
  tile(540, 250, "#d8e8f7", () => { shape(c, () => rrect(c, 430, 170, 190, 130, 14), COL.black); shape(c, () => rrect(c, 444, 182, 162, 100, 6), COL.sky, 4); shape(c, () => rrect(c, 490, 304, 80, 16, 6), COL.steelDk); c.beginPath(); c.arc(640, 235, 22, -1, 1); c.lineWidth = 7; c.strokeStyle = INK; c.stroke(); });
  // heat: an iron
  tile(870, 250, "#fbdcd2", () => { shape(c, () => polyP(c, [[760, 290], [980, 290], [940, 210], [830, 190], [780, 230]]), COL.red); shape(c, () => rrect(c, 800, 160, 120, 30, 14), COL.steel); [830, 880, 930].forEach((x) => line(c, [[x, 340], [x + 14, 320], [x, 304]], 7, RED)); });
  // cold: a fridge
  tile(375, 740, "#dcf0f2", () => { shape(c, () => rrect(c, 310, 610, 130, 260, 16), WHITE); line(c, [[310, 700], [440, 700]], 5); line(c, [[330, 650], [330, 680]], 7); line(c, [[330, 730], [330, 790]], 7); [[262, 700]].forEach(([x, y]) => { line(c, [[x, y - 36], [x, y + 36]], 7, COL.blue); line(c, [[x - 31, y - 18], [x + 31, y + 18]], 7, COL.blue); line(c, [[x - 31, y + 18], [x + 31, y - 18]], 7, COL.blue); }); });
  // movement: a fan
  tile(705, 740, "#dcecd0", () => { [0, 2.09, 4.19].forEach((a) => shape(c, () => ell(c, 705 + Math.cos(a + 0.4) * 70, 740 + Math.sin(a + 0.4) * 70, 66, 24, a + 0.4), COL.teal)); shape(c, () => ell(c, 705, 740, 24, 24), COL.steel); arrow(c, Array.from({ length: 10 }, (_, i) => [705 + Math.cos(0.3 + i * 0.2) * 132, 740 + Math.sin(0.3 + i * 0.2) * 132])); });
};
const e1x = (c: Ctx) => {
  ground(c);
  panel(c, 40, 60, 1000, 500, "#e8f1f7"); panel(c, 40, 600, 1000, 430, "#f6efe0");
  // power station by a river
  c.fillStyle = COL.water; c.fillRect(44, 470, 992, 86);
  shape(c, () => rrect(c, 80, 280, 250, 190, 8), COL.steel); shape(c, () => rrect(c, 110, 140, 52, 140, 4), COL.greyDk); shape(c, () => rrect(c, 200, 180, 52, 100, 4), COL.greyDk);
  [[136, 120], [226, 160]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 46, 30), WHITE, 4); shape(c, () => ell(c, x + 30, y - 40, 36, 24), WHITE, 4); });
  // two towers and a house
  const tower = (x: number) => { line(c, [[x - 40, 450], [x, 190], [x + 40, 450]], 9); line(c, [[x - 24, 340], [x + 24, 340]], 7); line(c, [[x - 70, 220], [x + 70, 220]], 8); };
  tower(480); tower(680);
  line(c, [[330, 330], [410, 220], [480, 220], [680, 220], [790, 290]], 4, INK);
  shape(c, () => rrect(c, 790, 330, 170, 130, 6), COL.wood); shape(c, () => polyP(c, [[770, 330], [875, 250], [980, 330]]), COL.red);
  shape(c, () => rrect(c, 850, 380, 50, 80, 4), COL.brown);
  // the cell in a child's hand
  cellH(c, 580, 820, true, 300, 120, false);
  hand(c, 330, 820, 0, 1.3);
};
const e2x = (c: Ctx) => {
  ground(c);
  panel(c, 40, 100, 500, 880, "#e9f3d9"); panel(c, 560, 100, 480, 880, "#f6dcc0");
  // dry hands on a towel, then the switch
  person(c, 290, 940, 600, { armL: [Math.PI * 0.5, Math.PI * 0.62], armR: [Math.PI * 0.5, Math.PI * 0.38] });
  shape(c, () => rrect(c, 225, 640, 130, 110, 10), WHITE, 5); line(c, [[240, 690], [340, 690]], 5, COL.blue);
  tick(c, 440, 190, 60);
  // a kite on the power line
  line(c, [[680, 960], [680, 300]], 18, INK); line(c, [[680, 960], [680, 300]], 10, COL.brown);
  line(c, [[600, 360], [760, 360]], 10, INK); line(c, [[560, 340], [1040, 340]], 6);
  shape(c, () => polyP(c, [[900, 342], [840, 442], [900, 542], [960, 442]]), COL.pink); line(c, [[900, 342], [900, 542]], 4); line(c, [[840, 442], [960, 442]], 4);
  line(c, [[900, 542], [880, 640], [920, 700]], 5, INK);
  cross(c, 960, 190, 60);
};
const e4 = (c: Ctx) => {
  ground(c);
  const s = 0.45, g = (a: "cell" | "mid" | "top"): Gap => ({ side: "R", at: a, len: 170 });
  at(c, 190, 540, s, { bulb: 0, gap: g("cell") }); at(c, 540, 540, s, { bulb: 0, gap: g("mid") }); at(c, 890, 540, s, { bulb: 0, gap: g("top") });
};
const e5 = (c: Ctx) => {
  ground(c);
  // a plug cut in half: brass pins out of a plastic body, copper wires inside, a cable with a plastic coat
  shadow(c, 540, 820, 380, 20);
  shape(c, () => rrect(c, 90, 470, 200, 36, 8), "#e0b040"); shape(c, () => rrect(c, 90, 600, 200, 36, 8), "#e0b040");
  const body = () => rrect(c, 270, 330, 400, 410, 40);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, 12, 16, 0.5);
  shape(c, () => rrect(c, 300, 365, 340, 340, 24), "#f7ecd2", 5);
  line(c, [[290, 488], [430, 488], [500, 520], [720, 520]], 14, INK); line(c, [[290, 488], [430, 488], [500, 520], [720, 520]], 8, COPPER);
  line(c, [[290, 618], [430, 618], [500, 580], [720, 580]], 14, INK); line(c, [[290, 618], [430, 618], [500, 580], [720, 580]], 8, COPPER);
  shape(c, () => rrect(c, 660, 440, 380, 220, 40), COL.green);
  shape(c, () => rrect(c, 690, 468, 320, 164, 24), "#d8f0d8", 5);
  line(c, [[660, 520], [1000, 520]], 14, INK); line(c, [[660, 520], [1000, 520]], 8, COPPER);
  line(c, [[660, 580], [1000, 580]], 14, INK); line(c, [[660, 580], [1000, 580]], 8, COPPER);
};
const e6 = (c: Ctx) => {
  ground(c);
  const sw = (open: boolean) => ({ side: "R" as const, at: "mid" as const, len: 150, bg: switchBoard, fg: switchClip(open) });
  at(c, 290, 540, 0.56, { bulb: 0, gap: sw(true) });
  at(c, 800, 540, 0.56, { bulb: 2, gap: sw(false) });
  arrow(c, [[420, 960], [680, 960]]);
};

export const ic_electricitySimpleCircuitsL3 = cards("sci.electricity.simple-circuits.L3 cards", [
  intro, summary, e1, e2, e3, a1, a2, a3, a4, a5, a6, p1, c1, c2, t0, t3, t5, t6, t9, t11, t12, t13, t14, t15, e0, e1x, e2x, e4, e5, e6,
]);
