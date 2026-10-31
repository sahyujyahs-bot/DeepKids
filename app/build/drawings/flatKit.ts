import type { Ctx, Env } from "./core";
import type { Film } from "./film";

// FLAT KIT · the DeepKids set-up card look: a bold dark outline round every object, flat colours,
// one darker tone on the shade side (light from the upper left), a soft flat shadow below and to the
// right. Everything is drawn on a 1080 x 1080 design square; the thing to look at is big and in the
// middle, nothing else on the card. Worked example: moongFlat.ts.
// People: round friendly heads, dark hair, Indian skin tones, flat clothes; hands are a palm and
// thick fingers. Keep the same child (SKIN.child, CLOTH.child) and grown-up (SKIN.adult, CLOTH.adult)
// on every card.

export const D = 1080;
export const INK = "#2b2340", BG = "#efe4cf", SH = "rgba(43,35,64,0.16)", WHITE = "#ffffff", RED = "#d7372b";
export const COL = {
  teal: "#3fb1a8", tealDk: "#2a8a83", blue: "#5b8fd6", blueDk: "#3f6fb3", sky: "#bfe0f5",
  steel: "#c9d1dc", steelDk: "#98a3b3", steelIn: "#dfe5ec", glass: "rgba(214,236,250,0.55)", glassEdge: "#7fa6c8",
  water: "#8fc3ea", waterDk: "#5f9fd3", drop: "#e9f3ff",
  green: "#6aa53f", greenDk: "#46752a", greenLt: "#9ccf62", leaf: "#58a14a", leafDk: "#3b7a33",
  soil: "#8a5a3c", soilDk: "#6a4128", wood: "#f2c063", woodDk: "#d39a3a", brown: "#a8723f",
  yellow: "#ffd34d", orange: "#f39a3c", red: "#e4523b", pink: "#f29ab4", purple: "#8b6cc9",
  paper: "#fffaf0", cloth: "#f7f3e8", grey: "#b9b4ab", greyDk: "#7d7870", black: "#3a3540",
};
export const SKIN = { child: "#b9794f", childDk: "#9c6240", adult: "#8d5a3b", adultDk: "#744830" };
export const CLOTH = { child: "#f39a3c", childDk: "#d27c25", adult: "#5b8fd6", adultDk: "#3f6fb3", hair: "#2b2340" };

export const rnd = (seed: number) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
export const ground = (c: Ctx, col = BG) => { c.fillStyle = col; c.fillRect(0, 0, D, D); };
// fill a path flat, then outline it in ink
export const shape = (c: Ctx, path: () => void, fill: string, line = 6) => { c.beginPath(); path(); c.fillStyle = fill; c.fill(); if (line) { c.lineWidth = line; c.strokeStyle = INK; c.lineJoin = "round"; c.lineCap = "round"; c.stroke(); } };
export const ell = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) => c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
export const polyP = (c: Ctx, pts: number[][]) => { c.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); };
export const rrect = (c: Ctx, x: number, y: number, w: number, h: number, r: number) => { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
export const shadow = (c: Ctx, x: number, y: number, rx: number, ry: number) => { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = SH; c.fill(); };
// the shade side of a shape: a darker flat tone clipped inside it, offset to the lower right
export const shade = (c: Ctx, path: () => void, col: string, dx: number, dy: number, alpha = 0.55) => { c.save(); c.beginPath(); path(); c.clip(); c.translate(dx, dy); c.beginPath(); path(); c.globalAlpha = 1; c.fillStyle = col; c.globalAlpha = alpha; c.rect(-5000, -5000, 10000, 10000); c.fill("evenodd"); c.restore(); c.globalAlpha = 1; };
export const line = (c: Ctx, pts: number[][], w = 6, col = INK) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke(); };
export const shine = (c: Ctx, pts: number[][], w = 9) => { c.globalAlpha = 0.75; line(c, pts, w, WHITE); c.globalAlpha = 1; };
// an arrow showing what to do (pour, push, turn): red, thick, with an open head
export const arrow = (c: Ctx, pts: number[][], col = RED, w = 10) => {
  line(c, pts, w, col);
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]), h = w * 3.2;
  line(c, [[b[0] - Math.cos(an - 0.5) * h, b[1] - Math.sin(an - 0.5) * h], b, [b[0] - Math.cos(an + 0.5) * h, b[1] - Math.sin(an + 0.5) * h]], w, col);
};

// ---------------------------------------------------------------- kitchen things
// a clear glass (tumbler) standing on the counter, its bottom centre at (x, y); fill 0..1 of liquid
export const glass = (c: Ctx, x: number, y: number, w: number, h: number, fill = 0, liquid: string = COL.water) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  if (fill > 0) { const ly = y - h * fill, lw = bot + (top - bot) * fill; shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, liquid, 0); shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 0); }
  shape(c, body, COL.glass, 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.35)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
};
// a steel katori (small bowl) or a bigger bowl; centre of its rim at (x, y), rim radius r
export const bowl = (c: Ctx, x: number, y: number, r: number, inside: string = COL.steelIn) => {
  shadow(c, x + r * 0.1, y + r * 0.62, r * 0.75, r * 0.12);
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.75, x + r * 0.9, y + r * 0.75, x + r, y); c.closePath(); }, COL.steelDk, r * 0.35, -r * 0.05);
  shape(c, () => ell(c, x, y, r, r * 0.2), inside, 5);
};
// a steel plate seen from above at an angle, centre (x, y)
export const plate = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shadow(c, x + rx * 0.08, y + ry * 0.25, rx, ry);
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shape(c, () => ell(c, x, y - ry * 0.04, rx * 0.84, ry * 0.8), COL.steelIn, 4);
};
// a moong seed (or any small bean, by colour): olive oval, darker shade side, a pale stripe; soaked = bigger, paler
export const seed = (c: Ctx, x: number, y: number, r: number, rot: number, soaked = false, col: string = soaked ? COL.greenLt : COL.green, dk: string = soaked ? COL.green : COL.greenDk) => {
  shape(c, () => ell(c, x, y, r, r * 0.7, rot), col, Math.max(2.5, r * 0.22));
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.7, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.35, y + r * 0.3, r, r * 0.7, rot); c.fillStyle = dk; c.globalAlpha = 0.55; c.fill(); c.restore(); c.globalAlpha = 1;
  line(c, [[x - Math.cos(rot) * r * 0.45, y - Math.sin(rot) * r * 0.45 - r * 0.12], [x + Math.cos(rot) * r * 0.45, y + Math.sin(rot) * r * 0.45 - r * 0.12]], Math.max(2, r * 0.18), "#f4f1e4");
};
// a leaf on a stem, pointing at angle an from its base (x, y)
export const leaf = (c: Ctx, x: number, y: number, len: number, an: number, col: string = COL.leaf) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.32, ny = Math.cos(an) * len * 0.32, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, col, 5);
  line(c, [[x, y], [mx + (tx - mx) * 0.6, my + (ty - my) * 0.6]], 3, COL.leafDk);
};

// ---------------------------------------------------------------- people
// a hand seen from the side, wrist at (x, y), pointing at angle an; s = size (about 1 = a child's hand on the card)
export const hand = (c: Ctx, x: number, y: number, an: number, s = 1, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -90, -34, 70, 68, 18), sleeve);
  shape(c, () => { c.moveTo(-24, -30); c.quadraticCurveTo(40, -40, 62, -18); c.quadraticCurveTo(70, 0, 62, 16); c.quadraticCurveTo(30, 34, -24, 30); c.closePath(); }, skin);
  shape(c, () => { c.moveTo(10, -26); c.quadraticCurveTo(30, -58, 44, -52); c.quadraticCurveTo(52, -44, 34, -20); c.closePath(); }, skin, 5);
  line(c, [[30, -4], [58, -2]], 3, SKIN.childDk); line(c, [[28, 10], [56, 10]], 3, SKIN.childDk);
  c.restore();
};
// a person standing or sitting, feet (or seat) at (x, y), height h; arms by joint angles (radians, 0 = pointing right)
export type Pose = { armL?: [number, number]; armR?: [number, number]; sit?: boolean; adult?: boolean };
export const person = (c: Ctx, x: number, y: number, h: number, p: Pose = {}) => {
  const ad = !!p.adult, skin = ad ? SKIN.adult : SKIN.child, cloth = ad ? CLOTH.adult : CLOTH.child, clothDk = ad ? CLOTH.adultDk : CLOTH.childDk;
  const head = h * 0.13, hip = p.sit ? y - h * 0.06 : y - h * 0.42, sh = p.sit ? hip - h * 0.32 : y - h * 0.74, leg = p.sit ? h * 0.2 : h * 0.42, uw = h * 0.06;
  // legs
  if (p.sit) for (const s of [-1, 1]) { const k: number[][] = [[x + s * h * 0.05, hip], [x + h * 0.2 + s * h * 0.03, hip - h * 0.08], [x + h * 0.3 + s * h * 0.03, y]]; line(c, k, h * 0.07, INK); line(c, k, h * 0.07 - 10, "#6b5a8c"); }
  else for (const s of [-1, 1]) { line(c, [[x + s * h * 0.05, hip], [x + s * h * 0.06, y]], h * 0.075, INK); line(c, [[x + s * h * 0.05, hip], [x + s * h * 0.06, y]], h * 0.075 - 10, "#6b5a8c"); }
  // body
  shape(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), cloth);
  shade(c, () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06), clothDk, h * 0.07, 0);
  // arms: shoulder -> elbow -> wrist, a hand circle at the end
  const arm = (sx: number, [a1, a2]: [number, number]) => {
    const l1 = h * 0.17, l2 = h * 0.16, ex = sx + Math.cos(a1) * l1, ey = sh + h * 0.03 + Math.sin(a1) * l1, wx = ex + Math.cos(a2) * l2, wy = ey + Math.sin(a2) * l2;
    line(c, [[sx, sh + h * 0.03], [ex, ey], [wx, wy]], uw + 10, INK); line(c, [[sx, sh + h * 0.03], [ex, ey], [wx, wy]], uw, cloth);
    shape(c, () => ell(c, wx, wy, uw * 0.62, uw * 0.62), skin, 5);
  };
  arm(x - h * 0.11, p.armL ?? [Math.PI * 0.55, Math.PI * 0.5]); arm(x + h * 0.11, p.armR ?? [Math.PI * 0.45, Math.PI * 0.5]);
  // head, hair, face
  const hy = sh - head * 1.05;
  shape(c, () => ell(c, x, hy, head, head * 1.05), skin);
  shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, CLOTH.hair, 5);
  if (!ad) shape(c, () => ell(c, x + head * 0.95, hy - head * 0.2, head * 0.32, head * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, x - head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0); shape(c, () => ell(c, x + head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0);
  c.beginPath(); c.arc(x, hy + head * 0.38, head * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};

// ---------------------------------------------------------------- writing numbers and short labels
const GLYPH: Record<string, number[][][]> = {
  "0": [[[0.3, 0], [0.55, 0.15], [0.6, 0.5], [0.55, 0.85], [0.3, 1], [0.05, 0.85], [0, 0.5], [0.05, 0.15], [0.3, 0]]], "1": [[[0.12, 0.2], [0.35, 0], [0.35, 1]]],
  "2": [[[0.03, 0.2], [0.3, 0], [0.57, 0.18], [0.5, 0.45], [0, 1], [0.6, 1]]], "3": [[[0.03, 0.1], [0.3, 0], [0.55, 0.2], [0.3, 0.48], [0.58, 0.72], [0.3, 1], [0, 0.9]]],
  "4": [[[0.45, 1], [0.45, 0], [0, 0.7], [0.6, 0.7]]], "5": [[[0.57, 0], [0.08, 0], [0.04, 0.45], [0.35, 0.4], [0.6, 0.65], [0.35, 1], [0, 0.92]]],
  "6": [[[0.52, 0.05], [0.2, 0.2], [0.02, 0.65], [0.25, 1], [0.55, 0.8], [0.35, 0.5], [0.05, 0.62]]], "7": [[[0, 0], [0.6, 0], [0.22, 1]]],
  "8": [[[0.3, 0.48], [0.05, 0.25], [0.3, 0], [0.55, 0.25], [0.3, 0.48], [0.02, 0.75], [0.3, 1], [0.58, 0.75], [0.3, 0.48]]], "9": [[[0.55, 0.4], [0.3, 0.55], [0.05, 0.35], [0.3, 0], [0.57, 0.3], [0.45, 1]]],
  g: [[[0.55, 0.35], [0.3, 0.3], [0.05, 0.5], [0.3, 0.72], [0.55, 0.55], [0.55, 0.35], [0.55, 1.1], [0.3, 1.25], [0.05, 1.12]]],
  c: [[[0.55, 0.38], [0.3, 0.3], [0.05, 0.62], [0.3, 1], [0.55, 0.92]]], m: [[[0, 1], [0, 0.35], [0.15, 0.3], [0.3, 0.45], [0.3, 1]], [[0.3, 0.45], [0.45, 0.3], [0.6, 0.45], [0.6, 1]]],
  l: [[[0.2, 0], [0.2, 1]]], "°": [[[0.15, 0], [0.3, 0.1], [0.15, 0.2], [0, 0.1], [0.15, 0]]], "+": [[[0.3, 0.3], [0.3, 0.8]], [[0.05, 0.55], [0.55, 0.55]]], "-": [[[0.05, 0.55], [0.55, 0.55]]],
};
// numbers, units (g, cm, ml, °C needs "°" then letters you draw yourself) and + - only; never words
export const write = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 6) => {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; let cx = x;
  for (const ch of t) { if (ch === " ") { cx += h * 0.35; continue; } (GLYPH[ch] ?? []).forEach((st) => { c.beginPath(); st.forEach(([u, v], i) => (i ? c.lineTo(cx + u * h, y + v * h) : c.moveTo(cx + u * h, y + v * h))); c.stroke(); }); cx += h * (ch === "m" ? 0.95 : 0.8); }
};

// a film of finished cards, one card per frame: cards(...) gives the Film for a module
export const cards = (title: string, list: ((c: Ctx) => void)[]): Film => ({
  meta: { title, W: 1080, H: 1080, fps: 30, bpm: 60, durationFrames: list.length },
  assets: { images: {} },
  shots: [{ id: "cards", start: 0, end: list.length, draw: (ctx: Ctx, f: number, env: Env) => { ctx.save(); ctx.setTransform((env.scale * env.W) / D, 0, 0, (env.scale * env.H) / D, 0, 0); list[Math.min(list.length - 1, f)](ctx); ctx.restore(); } }],
});
