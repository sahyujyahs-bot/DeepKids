import type { Ctx } from "./core";
import type { Pose } from "./flatKit";
import { D, INK, BG, WHITE, RED, COL, rnd, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, glass, bowl, plate, seed, leaf, person, write, cards } from "./flatKit";

// SOIL, WATER AND CROPS L4 · flat cards. Cups are clear tapered tumblers; contents are layers from the bottom.
const LET: Record<string, number[][][]> = {
  A: [[[0, 1], [0.3, 0], [0.6, 1]], [[0.12, 0.62], [0.48, 0.62]]],
  B: [[[0, 0], [0, 1], [0.38, 1], [0.55, 0.78], [0.38, 0.52], [0, 0.52]], [[0, 0], [0.35, 0], [0.52, 0.24], [0.35, 0.52]]],
  C: [[[0.56, 0.14], [0.3, 0], [0.06, 0.25], [0.06, 0.75], [0.3, 1], [0.56, 0.86]]],
  D: [[[0, 0], [0, 1], [0.3, 1], [0.58, 0.74], [0.58, 0.26], [0.3, 0], [0, 0]]],
  N: [[[0, 1], [0, 0], [0.55, 1], [0.55, 0]]],
  P: [[[0, 1], [0, 0], [0.38, 0], [0.55, 0.22], [0.38, 0.5], [0, 0.5]]],
  K: [[[0, 0], [0, 1]], [[0.55, 0], [0, 0.58]], [[0.15, 0.45], [0.55, 1]]],
  H: [[[0, 0], [0, 1]], [[0.55, 0], [0.55, 1]], [[0, 0.5], [0.55, 0.5]]],
};
const letter = (c: Ctx, ch: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round";
  (LET[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(x + u * h, y + v * h) : c.moveTo(x + u * h, y + v * h))); c.stroke(); });
};
const tag = (c: Ctx, x: number, y: number, ch: string, s = 1) => {
  shape(c, () => rrect(c, x - 30 * s, y - 36 * s, 60 * s, 72 * s, 10 * s), WHITE, 5);
  letter(c, ch, x - 13 * s, y - 22 * s, 44 * s, INK, 6 * s);
};

// ---------------------------------------------------------------- shared things
const counter = (c: Ctx, top: number) => {
  shape(c, () => polyP(c, [[-20, top], [D + 20, top], [D + 20, top + 120], [-20, top + 120]]), "#ecd9b0", 6);
  shape(c, () => polyP(c, [[-20, top + 120], [D + 20, top + 120], [D + 20, D + 20], [-20, D + 20]]), "#c9a574", 6);
};
// the child stands behind the counter: only what is above the counter's back edge is drawn
const kid = (c: Ctx, x: number, y: number, h: number, p: Pose, clipY: number) => {
  c.save(); c.beginPath(); c.rect(0, 0, D, clipY); c.clip();
  const r = person(c, x, y, h, p);
  c.restore();
  return r;
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * (r + 16), y + Math.sin(a) * (r + 16)], [x + Math.cos(a) * (r + 46), y + Math.sin(a) * (r + 46)]], 10, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const spoon = (c: Ctx, bx: number, by: number, hx: number, hy: number, rb: number) => {
  const an = Math.atan2(hy - by, hx - bx);
  line(c, [[bx, by], [hx, hy]], 22, INK); line(c, [[bx, by], [hx, hy]], 12, COL.steel);
  shape(c, () => ell(c, bx, by, rb, rb * 0.6, an), COL.steel, 5);
  shape(c, () => ell(c, bx, by, rb * 0.78, rb * 0.42, an), COL.steelIn, 3);
};
const drop = (c: Ctx, x: number, y: number, s = 1, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - 24 * s); c.quadraticCurveTo(x + 4 * s, y - 6 * s, x + 14 * s, y + 4 * s); c.arc(x, y + 8 * s, 14 * s, -0.3, Math.PI + 0.3); c.quadraticCurveTo(x - 4 * s, y - 6 * s, x, y - 24 * s); c.closePath(); }, col, 4);

// ---------------------------------------------------------------- cups with layers
type Kind = "gravel" | "sand" | "soil" | "damp" | "pale" | "leaves" | "crumb" | "cloth";
type Layer = { kind: Kind; f0: number; f1: number; wet?: number };
const BASE: Record<Kind, string> = { gravel: "#7a756d", sand: "#e9c77b", soil: "#a87c55", damp: "#5d3a24", pale: "#d3b88f", leaves: "#8b5a2b", crumb: "#5d3a24", cloth: "#f7f3e8" };
const half = (w: number, f: number) => w * (0.4 + 0.1 * f);
const band = (c: Ctx, x: number, y: number, w: number, h: number, f0: number, f1: number) => {
  const a = half(w, f0), b = half(w, f1);
  c.moveTo(x - a, y - h * f0); c.lineTo(x + a, y - h * f0); c.lineTo(x + b, y - h * f1); c.lineTo(x - b, y - h * f1); c.closePath();
};
const stuff = (c: Ctx, x: number, y: number, w: number, h: number, L: Layer, sd: number) => {
  const r = rnd(sd), ext = L.kind === "crumb" || L.kind === "leaves" ? 0.06 : 0, yTop = y - h * L.f1, hw = half(w, (L.f0 + L.f1) / 2), area = 2 * hw * h * (L.f1 - L.f0);
  c.save(); c.beginPath(); band(c, x, y, w, h, L.f0, Math.min(1, L.f1 + ext)); c.clip();
  c.fillStyle = BASE[L.kind]; c.fillRect(0, ext ? yTop + h * 0.03 : yTop, D, D);
  const dots = (cols: string[], n: number, r0: number, r1: number) => { for (let i = 0; i < n; i++) { const px = x - hw + r() * hw * 2, py = yTop + r() * h * (L.f1 - L.f0), rad = r0 + r() * (r1 - r0); c.beginPath(); ell(c, px, py, rad, rad * 0.8, r() * 3); c.fillStyle = cols[i % cols.length]; c.fill(); } };
  if (L.kind === "gravel") { const cols = ["#9b968d", "#c3beb4", "#8a857c", "#b2ada3"]; for (let i = 0; i < area / 650; i++) { const px = x - hw + r() * hw * 2, py = yTop + r() * h * (L.f1 - L.f0), rad = 11 + r() * 9; shape(c, () => ell(c, px, py, rad, rad * (0.7 + r() * 0.25), r() * 3), cols[i % 4], 3); } }
  else if (L.kind === "sand") dots(["#f6dfa0", "#cfa355", "#e3b968"], area / 20, 2, 3.4);
  else if (L.kind === "soil") dots(["#7a5234", "#c09a70", "#6a4128"], area / 30, 2.5, 4.5);
  else if (L.kind === "damp") dots(["#4a2d1a", "#7a5236", "#3b2314"], area / 30, 2.5, 4.5);
  else if (L.kind === "pale") dots(["#e6d0ac", "#b99a6f", "#c9ac80"], area / 24, 2.5, 4);
  else if (L.kind === "crumb") { for (let i = 0; i < 34; i++) { const px = x - half(w, L.f1) + r() * half(w, L.f1) * 2, py = yTop + h * 0.01 + r() * h * 0.045, rad = 13 + r() * 8; shape(c, () => ell(c, px, py, rad, rad * 0.85, r() * 3), ["#5d3a24", "#7a5236", "#4a2d1a"][i % 3], 3); } }
  else if (L.kind === "leaves") { const cols = ["#c98f4a", "#b57a35", "#d9a85c", "#a8672a"]; for (let i = 0; i < 48; i++) { const px = x - hw * 1.05 + r() * hw * 2.1, py = yTop + h * 0.02 + r() * h * (L.f1 - L.f0 - 0.02); leaf(c, px, py, 62 + r() * 34, (r() - 0.5) * 1.5 + (i % 2 ? 0 : Math.PI), cols[i % 4]); } }
  if (L.wet) {
    const yw = y - h * L.wet; c.fillStyle = "rgba(40,24,10,0.42)"; c.fillRect(0, yw, D, D);
    const pts: number[][] = []; for (let i = 0; i <= 12; i++) pts.push([x - hw * 1.3 + (i * hw * 2.6) / 12, yw + (i % 2 ? -4 : 4) + (r() - 0.5) * 4]);
    line(c, pts, 4, "rgba(30,18,8,0.75)");
  }
  c.restore();
  if (L.kind === "cloth") line(c, [[x - half(w, L.f1), y - h * L.f1], [x + half(w, L.f1), y - h * L.f1]], 4, INK);
};
type CupOpt = { layers?: Layer[]; holes?: boolean; ticks?: boolean; tag?: string; sd?: number };
const cup = (c: Ctx, x: number, y: number, w: number, h: number, o: CupOpt = {}) => {
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.16, y + 6, w * 0.62, w * 0.12);
  (o.layers ?? []).forEach((L, i) => stuff(c, x, y, w, h, L, (o.sd ?? 3) + i));
  const last = (o.layers ?? [])[(o.layers ?? []).length - 1];
  if (last && last.kind !== "crumb" && last.kind !== "leaves" && last.kind !== "cloth") shape(c, () => ell(c, x, y - h * last.f1, half(w, last.f1), w * 0.07), BASE[last.kind], 3);
  shape(c, body, o.layers ? "rgba(214,236,250,0.22)" : COL.glass, 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.9], [x - bot * 0.7, y - h * 0.3]], 7);
  if (o.ticks) for (let i = 1; i <= 7; i++) { const f = (i / 8) * 0.95 + 0.02, ex = x + half(w, f), len = i % 2 ? 34 : 22; line(c, [[ex, y - h * f], [ex - len, y - h * f]], 3.5); }
  if (o.holes) for (const k of [-1, 0, 1]) shape(c, () => ell(c, x + k * w * 0.17, y - 7, 9, 5), INK, 0);
  if (o.tag) tag(c, x, y - h * 0.84, o.tag, 0.78);
};
const cloth: Layer = { kind: "cloth", f0: 0, f1: 0.05 };

// ================================================================ set-up cards
// e1.0 three cups with holes, a cloth circle inside and centimetre lines up the side
const s_e1_0 = (c: Ctx) => {
  ground(c);
  ["A", "B", "C"].forEach((t, i) => cup(c, 220 + i * 320, 800, 230, 480, { layers: [cloth], holes: true, ticks: true, tag: t }));
};
// e1.1 cups filled to the same line, child taps one on the table
const FILL = 0.62;
const s_e1_1 = (c: Ctx) => {
  ground(c); counter(c, 760);
  cup(c, 170, 850, 200, 330, { layers: [cloth, { kind: "gravel", f0: 0.05, f1: FILL }], tag: "A" });
  cup(c, 400, 850, 200, 330, { layers: [cloth, { kind: "sand", f0: 0.05, f1: FILL }], tag: "B" });
  cup(c, 630, 850, 200, 330, { layers: [cloth, { kind: "soil", f0: 0.05, f1: FILL }], tag: "C" });
  kid(c, 900, 1040, 760, { reachL: [722, 685] }, 770);
  for (const s of [-1, 1]) { line(c, [[630 + s * 125, 868], [630 + s * 160, 850]], 6); line(c, [[630 + s * 125, 890], [630 + s * 168, 890]], 6); }
};
// the tray of water used by e1.2 and the flow card
const trayCups = (c: Ctx, marks: boolean) => {
  ground(c);
  shape(c, () => polyP(c, [[90, 730], [990, 730], [1050, 930], [30, 930]]), COL.steel);
  shape(c, () => polyP(c, [[132, 758], [948, 758], [1000, 905], [80, 905]]), COL.water, 5);
  line(c, [[240, 790], [330, 790]], 5, COL.drop); line(c, [[760, 880], [870, 880]], 5, COL.drop); line(c, [[470, 892], [560, 892]], 5, COL.drop);
  const W = 210, H = 380;
  cup(c, 270, 850, W, H, { layers: [cloth, { kind: "gravel", f0: 0.05, f1: FILL, wet: 0.1 }], tag: "A" });
  cup(c, 540, 850, W, H, { layers: [cloth, { kind: "sand", f0: 0.05, f1: FILL + 0.12, wet: 0.5 }], tag: "B" });
  cup(c, 810, 850, W, H, { layers: [cloth, { kind: "soil", f0: 0.05, f1: FILL, wet: 0.32 }], tag: "C" });
  c.fillStyle = "rgba(143,195,234,0.5)"; c.beginPath(); c.moveTo(105, 815); c.lineTo(960, 815); c.lineTo(1000, 905); c.lineTo(80, 905); c.closePath(); c.fill();
  line(c, [[110, 815], [958, 815]], 4, COL.waterDk);
  shape(c, () => polyP(c, [[30, 930], [1050, 930], [1050, 962], [30, 962]]), COL.steelDk);
  if (marks) for (const f of [0.14, 0.26, 0.39]) line(c, [[540 - half(210, f) - 4, 850 - H * f], [540 + half(210, f) + 4, 850 - H * f]], 6, RED);
};
const s_e1_2 = (c: Ctx) => trayCups(c, false);
// e1.3 child marks the wet line on the sand cup, a clock beside it
const clock = (c: Ctx, x: number, base: number, r: number) => {
  const y = base - r - 8;
  shadow(c, x + r * 0.15, base + 4, r * 0.95, r * 0.14);
  line(c, [[x - r * 0.6, y + r * 0.8], [x - r * 0.78, base]], 14, INK); line(c, [[x + r * 0.6, y + r * 0.8], [x + r * 0.78, base]], 14, INK);
  shape(c, () => ell(c, x - r * 0.66, y - r * 0.86, r * 0.3, r * 0.2, -0.6), RED, 5); shape(c, () => ell(c, x + r * 0.66, y - r * 0.86, r * 0.3, r * 0.2, 0.6), RED, 5);
  shape(c, () => ell(c, x, y, r, r), RED, 6); shape(c, () => ell(c, x, y, r * 0.8, r * 0.8), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72]], 4); }
  line(c, [[x, y], [x + r * 0.55, y]], 7); line(c, [[x, y], [x, y - r * 0.4]], 9); shape(c, () => ell(c, x, y, 7, 7), INK, 0);
};
const s_e1_3 = (c: Ctx) => {
  ground(c); counter(c, 760);
  const cx = 470, cw = 330, ch = 520, by = 860, wet = 0.58, yw = by - ch * wet;
  clock(c, 105, by, 70);
  cup(c, cx, by, cw, ch, { layers: [cloth, { kind: "sand", f0: 0.05, f1: 0.8, wet }] });
  for (const [f, t] of [[0.2, "5"], [0.34, "15"], [0.47, "30"]] as [number, string][]) {
    line(c, [[cx - half(cw, f) - 2, by - ch * f], [cx + half(cw, f) + 2, by - ch * f]], 6, RED);
    write(c, t, cx - half(cw, f) - 20 - (t.length === 2 ? 70 : 38), by - ch * f - 20, 40, INK, 6);
  }
  const edge = cx + half(cw, wet) + 2;
  line(c, [[cx - half(cw, wet) - 2, yw], [edge, yw]], 6, RED);
  const hands = kid(c, 935, 1040, 760, { reachL: [edge + 85, yw] }, 770);
  const [hx, hy] = hands.handL;
  // the marker: tip on the cup at the wet line, body through the child's hand
  shape(c, () => polyP(c, [[edge, yw], [edge + 34, yw - 15], [edge + 34, yw + 15]]), RED, 4);
  shape(c, () => rrect(c, edge + 30, yw - 16, 200, 32, 9), COL.blue, 5);
  shape(c, () => rrect(c, edge + 170, yw - 16, 60, 32, 9), COL.blueDk, 5);
  shape(c, () => ell(c, hx + 6, hy, 34, 26), "#b9794f", 5);
  shape(c, () => ell(c, hx + 2, hy - 20, 22, 11, 0.1), "#b9794f", 4);
};
// e2.0 four saucers of salt water, a pot of salt, a teaspoon, a measuring cup
const saucerW = (c: Ctx, x: number, y: number, salt: number) => {
  plate(c, x, y, 108, 40);
  shape(c, () => ell(c, x, y - 2, 82, 28), COL.water, 3);
  line(c, [[x - 50, y - 8], [x - 18, y - 8]], 4, COL.drop);
  const r = rnd(salt * 7 + 1);
  for (let i = 0; i < salt; i++) shape(c, () => ell(c, x - 60 + r() * 120, y - 10 + r() * 22, 7, 5.5, r() * 3), WHITE, 3);
};
const s_e2_0 = (c: Ctx) => {
  ground(c);
  [0, 2, 6, 14].forEach((n, i) => { saucerW(c, 140 + i * 267, 360, n); tag(c, 140 + i * 267, 500, "ABCD"[i], 0.95); });
  // pot of salt
  shadow(c, 215, 935, 105, 18);
  shape(c, () => rrect(c, 105, 740, 170, 190, 24), WHITE, 0);
  c.save(); c.beginPath(); rrect(c, 105, 740, 170, 190, 24); c.clip();
  c.fillStyle = "#f4f4f6"; c.fillRect(0, 770, D, D);
  const r = rnd(5); for (let i = 0; i < 90; i++) { c.beginPath(); ell(c, 110 + r() * 160, 775 + r() * 150, 3, 2.4, r() * 3); c.fillStyle = i % 2 ? "#d9dbe3" : "#ffffff"; c.fill(); }
  c.restore();
  shape(c, () => rrect(c, 105, 740, 170, 190, 24), COL.glass, 5); shine(c, [[128, 780], [128, 890]], 7);
  shape(c, () => rrect(c, 95, 696, 190, 54, 12), COL.teal, 5);
  // teaspoon with a heap of salt
  shadow(c, 540, 905, 190, 18);
  spoon(c, 650, 870, 420, 890, 52);
  shape(c, () => { c.moveTo(615, 868); c.quadraticCurveTo(650, 820, 685, 868); c.closePath(); }, WHITE, 3);
  // measuring cup with a handle
  line(c, [[968, 700], [1030, 700], [1030, 790], [962, 790]], 22, INK); line(c, [[968, 700], [1030, 700], [1030, 790], [962, 790]], 11, COL.steelIn);
  glass(c, 880, 930, 180, 270, 0.45);
  for (let i = 1; i <= 5; i++) line(c, [[880 - 90 + i * 2, 930 - i * 46], [880 - 54 + i * 2, 930 - i * 46]], 3.5);
};
// e2.1 ten soaked seeds on wet tissue in a saucer, a small label
const s_e2_1 = (c: Ctx) => {
  ground(c);
  plate(c, 520, 520, 410, 215);
  shape(c, () => { c.moveTo(220, 470); c.quadraticCurveTo(520, 350, 820, 465); c.quadraticCurveTo(870, 540, 800, 620); c.quadraticCurveTo(520, 700, 245, 610); c.quadraticCurveTo(170, 540, 220, 470); c.closePath(); }, "#dcebf7", 5);
  const r = rnd(4);
  for (let i = 0; i < 10; i++) seed(c, 335 + (i % 5) * 92 + r() * 8, 485 + Math.floor(i / 5) * 95 + r() * 8, 38, r() * 3, true);
  for (const [x, y] of [[260, 540], [790, 520], [520, 405], [610, 655]]) shape(c, () => ell(c, x, y, 10, 7), COL.drop, 2.5);
  // label card lying on the table, with a seed and 10
  shadow(c, 850, 960, 150, 20);
  shape(c, () => polyP(c, [[690, 800], [1010, 790], [1020, 940], [700, 950]]), WHITE, 5);
  seed(c, 760, 870, 34, 0.4, true); write(c, "10", 835, 840, 76, INK, 8);
};
// e2.2 four saucers on day 3
const sprouted = (c: Ctx, x: number, y: number, r: number, rot: number, len: number, curl: number) => {
  const pts = [[x - r * 0.6, y + r * 0.4], [x - r * 0.6 - 4, y + len * 0.6], [x - r * 0.6 + curl, y + len]];
  const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); c.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); };
  c.lineCap = "round"; p(); c.strokeStyle = INK; c.lineWidth = 11; c.stroke(); p(); c.strokeStyle = "#fffaf0"; c.lineWidth = 5; c.stroke();
  seed(c, x, y, r, rot, true);
};
const saucerSeeds = (c: Ctx, cx: number, cy: number, rx: number, ry: number, n: number, sprouts: number, r0: number, sd: number) => {
  plate(c, cx, cy, rx, ry);
  shape(c, () => ell(c, cx, cy - 2, rx * 0.8, ry * 0.7), "#dcebf7", 4);
  const r = rnd(sd), cols = 5, gx = (rx * 1.15) / (cols - 1);
  for (let i = 0; i < n; i++) {
    const x = cx - rx * 0.575 + (i % cols) * gx + r() * 5, y = cy - ry * 0.4 + Math.floor(i / cols) * ry * 0.62 + r() * 4;
    if (i < sprouts) sprouted(c, x, y, r0, r() * 2.5, 40 + r() * 14, (r() - 0.5) * 24); else seed(c, x, y, r0, r() * 3, true);
  }
};
const s_e2_2 = (c: Ctx) => {
  ground(c);
  [[290, 320, 9], [790, 320, 4], [290, 720, 2], [790, 720, 0]].forEach(([x, y, n], i) => { saucerSeeds(c, x, y, 235, 118, 10, n, 22, 20 + i); tag(c, x, y + 160, "ABCD"[i], 0.8); });
};
// e2.3 child rinses unsprouted seeds under a tap, then puts them on plain wet tissue
const s_e2_3 = (c: Ctx) => {
  ground(c); counter(c, 780);
  // tap
  const pipe = [[150, 790], [150, 360], [175, 305], [235, 292], [290, 325], [290, 385]];
  line(c, pipe, 46, INK); line(c, pipe, 32, COL.steel); shine(c, [[140, 700], [140, 420]], 8);
  shape(c, () => rrect(c, 262, 378, 56, 30, 8), COL.steelDk, 5);
  // seeds and bowl held at the child's left hand
  bowl(c, 290, 655, 85);
  const r = rnd(3);
  for (let i = 0; i < 7; i++) seed(c, 245 + (i % 4) * 28 + r() * 6, 648 + Math.floor(i / 4) * 12 + r() * 4, 13, r() * 3, true);
  line(c, [[290, 412], [290, 640]], 16, COL.water); line(c, [[283, 420], [283, 600]], 4, COL.drop);
  for (const s of [-1, 1]) line(c, [[290 + s * 14, 630], [290 + s * 40, 612]], 5, COL.waterDk);
  // saucer with tissue on the counter
  plate(c, 830, 848, 190, 55);
  shape(c, () => ell(c, 830, 845, 150, 36), "#dcebf7", 3);
  for (const [x, y] of [[760, 846], [830, 854], [900, 842]]) seed(c, x, y, 17, x * 0.01, true);
  const h = kid(c, 560, 1040, 760, { reachL: [370, 672], reachR: [745, 745] }, 785);
  seed(c, h.handR[0], h.handR[1], 16, 0.4, true);
};
// e3.0 three cups of damp soil, a spoon of water poured into one
const s_e3_0 = (c: Ctx) => {
  ground(c); counter(c, 760);
  [130, 360, 590].forEach((x, i) => cup(c, x, 850, 210, 330, { layers: [{ kind: "damp", f0: 0, f1: 0.8 }], sd: 10 + i * 3 }));
  line(c, [[537, 530], [537, 588]], 12, COL.water); line(c, [[533, 534], [533, 575]], 3, COL.drop);
  const h = kid(c, 920, 1040, 760, { reachL: [700, 430] }, 770);
  spoon(c, 575, 500, 745, 405, 46);
  const [hx, hy] = h.handL; shape(c, () => ell(c, hx + 6, hy, 34, 26), "#b9794f", 5);
  for (const [x, y] of [[560, 545], [510, 585]]) drop(c, x, y, 0.5);
};
// e3.1 one bare, one under dry leaves, one loosened with a fork
const s_e3_1 = (c: Ctx) => {
  ground(c);
  const W = 250, H = 360, by = 780, lv = 0.7;
  cup(c, 200, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv }] });
  cup(c, 540, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv }, { kind: "leaves", f0: lv - 0.02, f1: lv + 0.25 }], sd: 6 });
  cup(c, 880, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv - 0.04 }, { kind: "crumb", f0: lv - 0.07, f1: lv + 0.03 }] });
  // fork lying on the table, tines pointing at the third cup
  shadow(c, 740, 920, 200, 18);
  line(c, [[480, 905], [800, 905]], 24, INK); line(c, [[480, 905], [800, 905]], 13, COL.steel);
  shape(c, () => polyP(c, [[780, 884], [850, 880], [850, 930], [780, 926]]), COL.steel, 5);
  for (const k of [0, 1, 2, 3]) { const yy = 884 + k * 15; line(c, [[850, yy], [960, yy]], 14, INK); line(c, [[850, yy], [960, yy]], 5, COL.steel); }
};
// e3.2 three cups in the sun on a windowsill
const s_e3_2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 40, 980, 720, 18), "#9a6a3a", 7);
  shape(c, () => rrect(c, 80, 70, 920, 664, 8), COL.sky, 5);
  sun(c, 190, 190, 70);
  shape(c, () => ell(c, 520, 160, 70, 26), WHITE, 0); shape(c, () => ell(c, 580, 140, 56, 26), WHITE, 0); shape(c, () => ell(c, 760, 230, 70, 24), WHITE, 0);
  shape(c, () => polyP(c, [[20, 740], [1060, 740], [1060, 810], [20, 810]]), COL.wood, 6);
  const W = 240, H = 340, by = 790, lv = 0.78;
  cup(c, 200, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv - 0.14 }, { kind: "pale", f0: lv - 0.14, f1: lv }], sd: 5 });
  cup(c, 540, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv }, { kind: "leaves", f0: lv - 0.02, f1: lv + 0.17 }], sd: 8 });
  cup(c, 880, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv - 0.07 }, { kind: "pale", f0: lv - 0.07, f1: lv }], sd: 9 });
};

// ================================================================ card pictures
const s_flow_e1 = (c: Ctx) => trayCups(c, true);
const s_flow_e2 = (c: Ctx) => {
  ground(c);
  [9, 5, 2, 0].forEach((n, i) => {
    const x = 140 + i * 267;
    saucerSeeds(c, x, 470, 124, 66, 10, n, 12, 30 + i);
    tag(c, x, 320, "ABCD"[i], 0.95);
    write(c, String(n), x - 36, 600, 170, INK, 14);
  });
};
const s_flow_e3 = (c: Ctx) => {
  ground(c);
  sun(c, 130, 130, 62);
  const W = 270, H = 390, by = 890, lv = 0.72;
  cup(c, 330, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv }], sd: 4 });
  cup(c, 760, by, W, H, { layers: [{ kind: "damp", f0: 0, f1: lv }, { kind: "leaves", f0: lv - 0.02, f1: lv + 0.16 }], sd: 6 });
  for (const dx of [-70, 0, 70]) arrow(c, [[330 + dx, 595], [330 + dx, 350]], COL.blue, 12);
  arrow(c, [[760, 535], [760, 470]], COL.blue, 8);
};
const s_flow_a1 = (c: Ctx) => {
  ground(c);
  plate(c, 280, 360, 240, 120);
  const pile = (x: number, col: string, dk: string) => { shape(c, () => { c.moveTo(x - 62, 372); c.quadraticCurveTo(x - 40, 290, x, 282); c.quadraticCurveTo(x + 40, 290, x + 62, 372); c.closePath(); }, col, 5); c.save(); c.beginPath(); c.moveTo(x - 62, 372); c.quadraticCurveTo(x - 40, 290, x, 282); c.quadraticCurveTo(x + 40, 290, x + 62, 372); c.closePath(); c.clip(); c.beginPath(); ell(c, x + 40, 350, 60, 70); c.fillStyle = dk; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1; };
  pile(180, "#e9c77b", "#cfa355"); pile(285, "#7a5234", "#5d3a24"); pile(390, "#a89484", "#85736a");
  for (const x of [165, 195]) drop(c, x, 250, 0.7);
  // clay ball with finger dents
  shadow(c, 800, 470, 150, 24);
  shape(c, () => ell(c, 800, 360, 130, 120), "#a89484"); 
  c.save(); c.beginPath(); ell(c, 800, 360, 130, 120); c.clip(); c.beginPath(); ell(c, 860, 410, 130, 120); c.fillStyle = "#85736a"; c.globalAlpha = 0.5; c.fill(); c.restore(); c.globalAlpha = 1;
  for (const [x, y] of [[745, 330], [800, 300], [850, 340], [790, 395]]) shape(c, () => ell(c, x, y, 26, 34, 0.3), "#85736a", 3);
  // clay ribbon lying on a ruler, five centimetres long
  shadow(c, 560, 925, 400, 20);
  shape(c, () => polyP(c, [[130, 770], [990, 770], [990, 880], [130, 880]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(133, 860, 854, 17);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 50; mm++) { const x = 215 + mm * 10, hh = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, 880); c.lineTo(x, 880 - hh); c.stroke(); }
  for (let cm = 0; cm <= 5; cm++) write(c, String(cm), 215 + cm * 100 - 10, 800, 30, INK, 5);
  shape(c, () => { c.moveTo(215, 724); c.lineTo(700, 726); c.quadraticCurveTo(722, 747, 700, 768); c.lineTo(215, 768); c.quadraticCurveTo(195, 746, 215, 724); c.closePath(); }, "#a89484", 5);
  line(c, [[240, 750], [680, 752]], 5, "#85736a");
};
const wheat = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y + 70 * s], [x, y - 30 * s]], 7 * s, INK); line(c, [[x, y + 70 * s], [x, y - 30 * s]], 3.5 * s, COL.green);
  for (let k = 0; k < 4; k++) for (const d of [-1, 1]) shape(c, () => ell(c, x + d * 12 * s, y - 14 * s + k * 20 * s, 9 * s, 17 * s, d * 0.5), "#e0b04a", 3);
  shape(c, () => ell(c, x, y - 48 * s, 9 * s, 17 * s), "#e0b04a", 3);
};
const pod = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 66 * s, 22 * s, -0.5), "#7fb94a", 4);
  for (let k = 0; k < 4; k++) shape(c, () => ell(c, x - 30 * s + k * 20 * s, y + 14 * s - k * 12 * s, 11 * s, 11 * s), COL.greenLt, 3);
};
const cob = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => ell(c, x, y, 26 * s, 54 * s), "#f5c43a", 4);
  for (let k = 0; k < 4; k++) for (let j = -1; j <= 1; j++) shape(c, () => ell(c, x + j * 12 * s, y - 34 * s + k * 22 * s, 5 * s, 6 * s), "#e0a52a", 0);
  shape(c, () => { c.moveTo(x, y + 58 * s); c.quadraticCurveTo(x - 44 * s, y + 10 * s, x - 18 * s, y - 20 * s); c.quadraticCurveTo(x - 14 * s, y + 20 * s, x, y + 58 * s); c.closePath(); }, COL.leaf, 4);
  shape(c, () => { c.moveTo(x, y + 58 * s); c.quadraticCurveTo(x + 44 * s, y + 10 * s, x + 18 * s, y - 20 * s); c.quadraticCurveTo(x + 14 * s, y + 20 * s, x, y + 58 * s); c.closePath(); }, COL.leafDk, 4);
};
const millet = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x, y + 70 * s], [x, y - 10 * s]], 7 * s, INK); line(c, [[x, y + 70 * s], [x, y - 10 * s]], 3.5 * s, COL.green);
  shape(c, () => ell(c, x, y - 28 * s, 22 * s, 34 * s), COL.brown, 4);
  for (let k = 0; k < 6; k++) shape(c, () => ell(c, x + ((k % 2) - 0.5) * 20 * s, y - 50 * s + k * 10 * s, 4 * s, 4 * s), "#d39a3a", 0);
};
const s_flow_a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 985, 460, 22);
  shape(c, () => rrect(c, 70, 90, 940, 890, 16), WHITE, 6);
  line(c, [[386, 130], [386, 940]], 5); line(c, [[694, 130], [694, 940]], 5);
  const colx = [228, 540, 852];
  arrow(c, [[colx[0], 150], [colx[0], 250]], RED, 14);
  arrow(c, [[colx[1], 250], [colx[1], 150]], COL.green, 14);
  line(c, [[colx[2] - 40, 200], [colx[2] + 40, 200]], 14, COL.greyDk);
  const icons = [[wheat, cob, wheat], [pod, pod, pod], [millet, millet, millet]] as ((c: Ctx, x: number, y: number, s: number) => void)[][];
  icons.forEach((col, i) => col.forEach((fn, j) => {
    const x = colx[i], y = 400 + j * 180;
    shape(c, () => rrect(c, x - 90, y - 72, 180, 144, 12), "#fff3cf", 5);
    fn(c, x, y + (fn === pod ? 0 : 6), 1.0);
  }));
};
const s_flow_a3 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 560, 450, 270);
  const root = (pts: number[][], w: number) => {
    const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
    c.lineCap = "round"; path(); c.strokeStyle = INK; c.lineWidth = w + 8; c.stroke(); path(); c.strokeStyle = "#efe3c8"; c.lineWidth = w; c.stroke();
  };
  // stem and leaves at the left, root system fanning right
  line(c, [[150, 500], [260, 520]], 16, INK); line(c, [[150, 500], [260, 520]], 8, COL.green);
  leaf(c, 160, 500, 80, -2.4); leaf(c, 170, 505, 80, 2.4); leaf(c, 195, 510, 70, -3.0);
  const R: number[][][] = [[[260, 520], [340, 520], [480, 500], [600, 470]], [[300, 522], [380, 590], [470, 650], [560, 680]], [[340, 520], [420, 470], [470, 410], [520, 380]], [[420, 560], [500, 590], [620, 600], [700, 620]]];
  R.forEach((p, i) => root(p, i ? 8 : 12));
  const N: [number, number][] = [[400, 515], [510, 495], [500, 400], [435, 610], [530, 670], [590, 598], [640, 602], [350, 590]];
  N.forEach(([x, y]) => shape(c, () => ell(c, x, y, 13, 13), "#d9b27c", 3.5));
  // cut nodules, pink inside
  for (const x of [250, 345]) { shape(c, () => ell(c, x, 730, 36, 36), "#d9b27c", 5); shape(c, () => ell(c, x, 730, 24, 24), COL.pink, 3); }
  // magnifier lying on the plate, handle down to the right
  shadow(c, 800, 580, 160, 28);
  line(c, [[820, 520], [960, 700]], 40, INK); line(c, [[820, 520], [960, 700]], 26, COL.wood);
  shape(c, () => ell(c, 760, 430, 150, 150), "rgba(220,238,250,0.65)", 14);
  shape(c, () => ell(c, 760, 430, 130, 130), "rgba(255,255,255,0.25)", 5);
  c.save(); c.beginPath(); ell(c, 760, 430, 128, 128); c.clip();
  root([[620, 470], [720, 440], [830, 410], [900, 380]], 30);
  [[700, 450], [790, 425], [850, 405]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 30, 30), "#d9b27c", 5));
  c.restore();
  shine(c, [[680, 350], [730, 310]], 10);
};
const bar = (c: Ctx, x: number, y: number, w: number, f: number, col: string) => {
  shape(c, () => rrect(c, x, y - 22, w, 44, 22), "#ece6d6", 5);
  shape(c, () => rrect(c, x, y - 22, Math.max(44, w * f), 44, 22), col, 5);
};
const s_flow_a4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1000, 440, 20);
  shape(c, () => rrect(c, 100, 70, 880, 920, 18), "#fff3cf", 6);
  shape(c, () => rrect(c, 100, 70, 880, 70, 18), COL.green, 6);
  const rows = [210, 350, 490, 630, 770, 910];
  ["N", "P", "K"].forEach((t, i) => letter(c, t, 160, rows[i] - 30, 60, INK, 9));
  letter(c, "P", 150, rows[3] - 30, 60, INK, 9); letter(c, "H", 200, rows[3] - 30, 60, INK, 9);
  bar(c, 290, rows[0], 620, 0.33, RED); bar(c, 290, rows[1], 620, 0.66, COL.orange); bar(c, 290, rows[2], 620, 1, COL.green);
  // acidity strip with a pointer at 8.1 on a 0 to 14 scale
  const sx = 290, sw = 620; const g = c.createLinearGradient(sx, 0, sx + sw, 0);
  [[0, "#e4523b"], [0.3, "#ffd34d"], [0.5, "#6aa53f"], [0.75, "#3fb1a8"], [1, "#5b8fd6"]].forEach(([t, col]) => g.addColorStop(t as number, col as string));
  shape(c, () => rrect(c, sx, rows[3] - 22, sw, 44, 22), g as unknown as string, 5);
  const px = sx + (8.1 / 14) * sw; shape(c, () => polyP(c, [[px, rows[3] + 26], [px - 20, rows[3] + 62], [px + 20, rows[3] + 62]]), INK, 4);
  // salt crystal and humus leaf icons
  shape(c, () => rrect(c, 160, rows[4] - 36, 72, 72, 10), WHITE, 5); line(c, [[175, rows[4] - 10], [190, rows[4] - 10]], 5, COL.steelDk); line(c, [[200, rows[4] + 12], [218, rows[4] + 12]], 5, COL.steelDk);
  bar(c, 290, rows[4], 620, 0.2, RED);
  leaf(c, 150, rows[5] + 24, 90, -0.7); 
  bar(c, 290, rows[5], 620, 0.33, RED);
  // pencil lying across the corner
  line(c, [[800, 1020], [1030, 940]], 28, INK); line(c, [[800, 1020], [1030, 940]], 16, COL.yellow);
  shape(c, () => polyP(c, [[800, 1020], [770, 1032], [790, 1000]]), COL.wood, 4);
};
const crackPlate = (c: Ctx, x: number, y: number, paste: string, pasteDk: string, lines: number[][][], wide: number) => {
  plate(c, x, y, 250, 150);
  shape(c, () => ell(c, x, y - 4, 205, 118), paste, 4);
  c.save(); c.beginPath(); ell(c, x, y - 4, 205, 118); c.clip();
  lines.forEach((p) => line(c, p.map(([u, v]) => [x + u, y + v]), wide, "#3a2c22"));
  c.restore();
  void pasteDk;
};
const s_flow_a5 = (c: Ctx) => {
  ground(c);
  sun(c, 120, 110, 56);
  const L: number[][][] = [
    [[-220, -60], [-120, -40], [-30, -70], [70, -30], [220, -80]], [[-60, -130], [-50, -60], [-30, -70]], [[70, -30], [60, 40], [130, 90], [150, 130]],
    [[-120, -40], [-140, 40], [-80, 100], [-90, 140]], [[-30, 0], [-20, 60], [60, 40]], [[-140, 40], [-210, 70]], [[130, 90], [210, 80]], [[-50, -60], [-20, 10]],
  ];
  crackPlate(c, 290, 600, "#a89484", "#85736a", L, 17);
  crackPlate(c, 800, 600, "#d7c4a2", "#b49d78", [[[-80, -40], [-20, -30], [30, -50]], [[60, 30], [110, 50]], [[-120, 40], [-60, 60]]], 3);
  const r = rnd(8); for (let i = 0; i < 90; i++) { const a = r() * 6.28, d = Math.sqrt(r()); c.beginPath(); ell(c, 800 + Math.cos(a) * d * 190, 596 + Math.sin(a) * d * 108, 3, 2.4); c.fillStyle = i % 2 ? "#b49d78" : "#efe0bd"; c.fill(); }
  tag(c, 290, 840, "A", 1.05); tag(c, 800, 840, "B", 1.05);
};
const s_flow_a6 = (c: Ctx) => {
  ground(c);
  glass(c, 220, 660, 200, 330, 0.6, "#f29ab4"); glass(c, 540, 660, 200, 330, 0.6, "#8b6cc9"); glass(c, 860, 660, 200, 330, 0.6, "#3fb1a8");
  // vinegar bottle
  shadow(c, 235, 975, 90, 16);
  shape(c, () => polyP(c, [[165, 960], [305, 960], [300, 810], [270, 770], [270, 730], [200, 730], [200, 770], [170, 810]]), "rgba(255,240,200,0.8)", 5);
  shape(c, () => rrect(c, 196, 700, 78, 36, 8), COL.red, 5);
  // red cabbage
  shadow(c, 540, 985, 120, 18);
  shape(c, () => ell(c, 540, 860, 110, 108), "#8b3f7a"); 
  for (const a of [-0.9, -0.3, 0.3, 0.9]) line(c, [[540, 960], [540 + Math.sin(a) * 90, 790 - Math.abs(a) * 10]], 5, "#d8a0cc");
  line(c, [[540, 960], [540, 765]], 6, "#d8a0cc");
  // jar of baking soda
  shadow(c, 860, 980, 95, 16);
  shape(c, () => rrect(c, 780, 820, 160, 150, 22), COL.glass, 5);
  c.save(); c.beginPath(); rrect(c, 780, 820, 160, 150, 22); c.clip(); c.fillStyle = WHITE; c.fillRect(0, 860, D, D); c.restore();
  shape(c, () => rrect(c, 780, 820, 160, 150, 22), COL.glass, 5);
  shape(c, () => rrect(c, 770, 785, 180, 44, 10), COL.teal, 5);
};
const plant = (c: Ctx, x: number, y: number, hgt: number, n: number) => {
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 38, tx = x + dx * 1.35, ty = y - hgt * (0.8 + 0.2 * Math.cos(i * 1.7));
    line(c, [[x + dx, y], [tx, ty]], 12, INK); line(c, [[x + dx, y], [tx, ty]], 5, COL.green);
    leaf(c, tx, ty, 62, -Math.PI / 2); leaf(c, tx, ty, 58, -Math.PI / 2 - 0.9); leaf(c, tx, ty, 58, -Math.PI / 2 + 0.9);
  }
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.1);
  const rimH = h * 0.22;
  shape(c, () => polyP(c, [[x - w * 0.42, y - h + rimH], [x + w * 0.42, y - h + rimH], [x + w * 0.3, y], [x - w * 0.3, y]]), "#c9683c");
  shape(c, () => ell(c, x, y - h + rimH * 0.5, w / 2, w * 0.075), "#d97d4d", 0);
  shape(c, () => rrect(c, x - w / 2, y - h, w, rimH, 10), "#c9683c");
  shape(c, () => ell(c, x, y - h + 4, w * 0.46, w * 0.06), "#6a4128", 4);
};
const s_flow_p1 = (c: Ctx) => {
  ground(c);
  const W = 340, H = 280, by = 840;
  pot(c, 300, by, W, H); pot(c, 780, by, W, H);
  plant(c, 300, by - H + 6, 300, 6);
  tag(c, 300, 970, "A", 0.85); tag(c, 780, 970, "B", 0.85);
};

export const ic_planetEarthSoilAndCropsL4 = cards("sci.planet-earth.soil-and-crops.L4", [
  s_e1_0, s_e1_1, s_e1_2, s_e1_3, s_e2_0, s_e2_1, s_e2_2, s_e2_3, s_e3_0, s_e3_1, s_e3_2,
  s_flow_e1, s_flow_e2, s_flow_e3, s_flow_a1, s_flow_a2, s_flow_a3, s_flow_a4, s_flow_a5, s_flow_a6, s_flow_p1,
]);
