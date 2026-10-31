import type { Ctx, Env } from "./core";
import type { Film } from "./film";

// SPROUTING MOONG · three set-up cards, flat and clear: a bold dark outline round every object,
// flat colours, one darker tone for the shade side, a soft flat shadow. Built to be read at a glance
// on a phone by a parent and a child: the thing to look at is big, in the middle, nothing else.
// Light from the upper left; shadows fall right and down. Same reference as the pencil version:
// green gram seeds (olive green, a pale stripe), soaked ones bigger and split, white tapering roots,
// a flat digital kitchen scale, Indian steel plates and katori, a wooden ruler in centimetres.

const D = 1080;
const INK = "#2b2340", BG = "#f6efe0", COUNTER = "#efe4cf", SH = "rgba(43,35,64,0.16)";
const C = {
  teal: "#3fb1a8", tealDk: "#2a8a83", screen: "#22303a", lcd: "#c9f06b",
  steel: "#c9d1dc", steelDk: "#98a3b3", steelIn: "#dfe5ec",
  green: "#6aa53f", greenDk: "#46752a", greenLt: "#9ccf62", stripe: "#f4f1e4",
  cloth: "#f7f3e8", clothDk: "#e4dccb", wet: "#8fb3dc", wetDk: "#6a92c2", drop: "#e9f3ff",
  wood: "#f2c063", woodDk: "#d39a3a", root: "#fffaf0",
};
const rnd = (seed: number) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

const shape = (c: Ctx, path: () => void, fill: string, line = 6) => { c.beginPath(); path(); c.fillStyle = fill; c.fill(); if (line) { c.lineWidth = line; c.strokeStyle = INK; c.lineJoin = "round"; c.lineCap = "round"; c.stroke(); } };
const ell = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
const polyP = (c: Ctx, pts: number[][]) => { c.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); };
const shadow = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = SH; c.fill(); };
// a moong seed: olive oval, darker on the shade side, a pale stripe; soaked ones bigger and paler
const seed = (c: Ctx, x: number, y: number, r: number, rot: number, soaked: boolean) => {
  shape(c, () => ell(c, x, y, r, r * 0.7, rot), soaked ? C.greenLt : C.green, Math.max(2.5, r * 0.22));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.7, rot); c.clip();
  c.beginPath(); ell(c, x + r * 0.35, y + r * 0.3, r, r * 0.7, rot); c.fillStyle = soaked ? C.green : C.greenDk; c.globalAlpha = 0.55; c.fill(); c.restore(); c.globalAlpha = 1;
  c.beginPath(); c.moveTo(x - Math.cos(rot) * r * 0.45, y - Math.sin(rot) * r * 0.45 - r * 0.12); c.lineTo(x + Math.cos(rot) * r * 0.45, y + Math.sin(rot) * r * 0.45 - r * 0.12);
  c.strokeStyle = C.stripe; c.lineWidth = Math.max(2, r * 0.18); c.lineCap = "round"; c.stroke();
};
// big clear numbers and a "g", as strokes
const GLYPH: Record<string, number[][][]> = {
  "0": [[[0.3, 0], [0.55, 0.15], [0.6, 0.5], [0.55, 0.85], [0.3, 1], [0.05, 0.85], [0, 0.5], [0.05, 0.15], [0.3, 0]]],
  "1": [[[0.12, 0.2], [0.35, 0], [0.35, 1]]], "2": [[[0.03, 0.2], [0.3, 0], [0.57, 0.18], [0.5, 0.45], [0, 1], [0.6, 1]]],
  "3": [[[0.03, 0.1], [0.3, 0], [0.55, 0.2], [0.3, 0.48], [0.58, 0.72], [0.3, 1], [0, 0.9]]], "4": [[[0.45, 1], [0.45, 0], [0, 0.7], [0.6, 0.7]]],
  "5": [[[0.57, 0], [0.08, 0], [0.04, 0.45], [0.35, 0.4], [0.6, 0.65], [0.35, 1], [0, 0.92]]], "6": [[[0.52, 0.05], [0.2, 0.2], [0.02, 0.65], [0.25, 1], [0.55, 0.8], [0.35, 0.5], [0.05, 0.62]]],
  "7": [[[0, 0], [0.6, 0], [0.22, 1]]], g: [[[0.55, 0.35], [0.3, 0.3], [0.05, 0.5], [0.3, 0.72], [0.55, 0.55], [0.55, 0.35], [0.55, 1.1], [0.3, 1.25], [0.05, 1.12]]],
};
const write = (c: Ctx, t: string, x: number, y: number, h: number, col: string, w: number) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; let cx = x;
  for (const ch of t) { if (ch === " ") { cx += h * 0.35; continue; } (GLYPH[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); }); cx += h * 0.8; }
};
const ground = (c: Ctx) => { c.fillStyle = BG; c.fillRect(0, 0, D, D); c.fillStyle = COUNTER; c.fillRect(0, 0, D, D); };

// card 1: 50 g of dry moong in a steel bowl on a kitchen scale
const card1 = (c: Ctx) => {
  ground(c);
  shadow(c, 575, 905, 400, 50);
  // the scale: top face, front face with the screen
  shape(c, () => polyP(c, [[230, 610], [850, 610], [940, 790], [140, 790]]), C.teal);
  shape(c, () => polyP(c, [[140, 790], [940, 790], [940, 880], [140, 880]]), C.tealDk);
  shape(c, () => polyP(c, [[420, 806], [660, 806], [660, 866], [420, 866]]), C.screen, 5);
  write(c, "50 g", 452, 816, 40, C.lcd, 7);
  // the steel bowl, resting on the scale: its shadow on the top face first, the bowl moved down onto it
  shadow(c, 580, 712, 210, 28);
  c.save();
  c.translate(0, 58);
  shape(c, () => { c.moveTo(270, 520); c.bezierCurveTo(290, 700, 790, 700, 810, 520); c.closePath(); }, C.steel);
  c.save(); c.beginPath(); c.moveTo(270, 520); c.bezierCurveTo(290, 700, 790, 700, 810, 520); c.closePath(); c.clip();
  c.beginPath(); ell(c, 700, 640, 220, 150); c.fillStyle = C.steelDk; c.globalAlpha = 0.6; c.fill(); c.restore(); c.globalAlpha = 1;
  // the heap of moong above the rim
  shape(c, () => { c.moveTo(285, 520); c.bezierCurveTo(330, 380, 750, 380, 795, 520); c.closePath(); }, C.greenDk, 5);
  const r = rnd(7);
  for (let i = 0; i < 170; i++) { const t = r(), u = r(); const x = 300 + t * 480, top = 520 - Math.sin(t * Math.PI) * 118 * 0.92; const y = top + u * (520 - top) + 8; seed(c, x, y, 13 + r() * 2, r() * 3, false); }
  // the rim, drawn over the heap's bottom edge
  shape(c, () => ell(c, 540, 522, 272, 26), C.steelIn, 6);
  c.beginPath(); c.ellipse(540, 522, 272, 26, 0, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = C.greenDk; c.lineWidth = 0; c.globalAlpha = 1;
  for (let i = 0; i < 26; i++) seed(c, 300 + i * 18.5, 512 - Math.sin(((i + 0.5) / 26) * Math.PI) * 6, 12, i * 0.7, false);
  c.beginPath(); c.moveTo(300, 560); c.quadraticCurveTo(330, 620, 400, 650); c.strokeStyle = "#ffffff"; c.lineWidth = 9; c.globalAlpha = 0.7; c.stroke(); c.globalAlpha = 1;
  c.restore();
};

// card 2: a dry plate and a wet plate, 20 seeds each, a katori of water
const plate = (c: Ctx, cx: number, cy: number, wet: boolean, seedSeed: number) => {
  shadow(c, cx + 18, cy + 30, 230, 112);
  shape(c, () => ell(c, cx, cy, 230, 112), C.steel);
  shape(c, () => ell(c, cx, cy - 4, 192, 90), C.steelIn, 4);
  shape(c, () => { c.moveTo(cx - 160, cy - 52); c.quadraticCurveTo(cx, cy - 82, cx + 158, cy - 50); c.quadraticCurveTo(cx + 182, cy, cx + 150, cy + 56); c.quadraticCurveTo(cx, cy + 82, cx - 152, cy + 54); c.quadraticCurveTo(cx - 182, cy, cx - 160, cy - 52); c.closePath(); }, wet ? C.wet : C.cloth, 5);
  if (wet) { const rd = rnd(seedSeed + 9); for (let i = 0; i < 10; i++) { const x = cx - 130 + rd() * 260, y = cy - 50 + rd() * 100; shape(c, () => ell(c, x, y, 9, 6), C.drop, 2.5); } }
  const r = rnd(seedSeed);
  for (let i = 0; i < 20; i++) seed(c, cx - 112 + (i % 5) * 56 + r() * 10, cy - 42 + Math.floor(i / 5) * 28 + r() * 6, wet ? 15 : 10, r() * 3, wet);
};
const card2 = (c: Ctx) => {
  ground(c);
  plate(c, 290, 560, false, 11);
  plate(c, 790, 600, true, 12);
  // the katori of water
  shadow(c, 905, 345, 95, 26);
  shape(c, () => { c.moveTo(800, 300); c.bezierCurveTo(810, 380, 990, 380, 1000, 300); c.closePath(); }, C.steel);
  shape(c, () => ell(c, 900, 300, 100, 24), C.wet, 5);
  c.beginPath(); ell(c, 870, 294, 30, 6); c.fillStyle = C.drop; c.fill();
  // labels on little paper tags: "DRY" is drawn as a crossed-out drop, "WET" as a drop
  const tag = (x: number, y: number, wet: boolean) => {
    shape(c, () => { c.moveTo(x - 90, y - 40); c.lineTo(x + 90, y - 40); c.lineTo(x + 90, y + 40); c.lineTo(x - 90, y + 40); c.closePath(); }, "#ffffff", 5);
    x -= 30;
    shape(c, () => { c.moveTo(x - 24, y + 4); c.quadraticCurveTo(x - 24, y - 6, x - 8, y - 26); c.quadraticCurveTo(x + 8, y - 6, x + 8, y + 4); c.arc(x - 8, y + 4, 16, 0, Math.PI); c.closePath(); }, C.wet, 4);
    if (!wet) { c.beginPath(); c.moveTo(x - 34, y + 24); c.lineTo(x + 18, y - 28); c.strokeStyle = "#d7372b"; c.lineWidth = 7; c.stroke(); }
    write(c, "20", x + 50, y - 20, 40, INK, 6);
  };
  tag(290, 760, false);
  tag(790, 800, true);
};

// card 3: the wet plate close up, white roots, a ruler beside the longest
const card3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = C.wet; c.fillRect(0, 0, D, 720);
  c.strokeStyle = C.wetDk; c.lineWidth = 2; c.globalAlpha = 0.35;
  for (let x = 30; x < D; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 720); c.stroke(); }
  for (let y = 30; y < 720; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  c.globalAlpha = 1;
  c.beginPath(); c.moveTo(0, 720); c.lineTo(D, 720); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  const root = (pts: number[][], w: number) => {
    c.lineCap = "round"; c.lineJoin = "round";
    const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
    path(); c.strokeStyle = INK; c.lineWidth = w + 9; c.stroke();
    path(); c.strokeStyle = C.root; c.lineWidth = w; c.stroke();
  };
  const R: [number, number, number[][], number][] = [
    [520, 250, [[540, 270], [580, 340], [600, 420]], 12], [790, 330, [[780, 352], [740, 410], [720, 470]], 12],
    [300, 230, [[290, 252], [262, 300], [255, 350]], 10], [880, 150, [[892, 172], [920, 220], [925, 260]], 10],
    [140, 330, [[150, 352], [175, 400], [182, 440]], 9], [660, 520, [[676, 540], [720, 580], [760, 600]], 11],
  ];
  R.forEach(([x, y, pts, w]) => root([[x, y], ...pts], w));
  R.forEach(([x, y], i) => seed(c, x, y, 34, 0.5 + i * 0.8, true));
  // the longest root lies along the ruler: from 0 to just past 4 cm
  shadow(c, 560, 830, 430, 20);
  shape(c, () => polyP(c, [[130, 720], [990, 720], [990, 820], [130, 820]]), C.wood);
  c.fillStyle = C.woodDk; c.fillRect(133, 800, 854, 17);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= 70; mm++) { const x = 220 + mm * 10.4, h = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; c.lineWidth = mm % 10 === 0 ? 4 : 2.5; c.beginPath(); c.moveTo(x, 720); c.lineTo(x, 720 + h); c.stroke(); }
  for (let cm = 0; cm <= 7; cm++) write(c, String(cm), 220 + cm * 104 - 10, 762, 30, INK, 5);
  root([[220, 670], [320, 676], [420, 680], [520, 684], [655, 688]], 16);
  seed(c, 210, 660, 36, 0.2, true);
  c.beginPath(); c.moveTo(655, 690); c.lineTo(655, 722); c.strokeStyle = "#d7372b"; c.lineWidth = 6; c.stroke();
};

const CARDS = [card1, card2, card3];
export const moongFlat: Film = {
  meta: { title: "Sprouting moong · flat set-up cards", W: 1080, H: 1080, fps: 30, bpm: 60, durationFrames: 3 },
  assets: { images: {} },
  shots: [{ id: "cards", start: 0, end: 3, draw: (ctx: Ctx, f: number, env: Env) => { ctx.save(); ctx.setTransform(env.scale * env.W / D, 0, 0, env.scale * env.H / D, 0, 0); CARDS[Math.min(2, f)](ctx); ctx.restore(); } }],
};
