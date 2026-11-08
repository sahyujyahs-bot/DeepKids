import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, person, write, cards } from "./flatKit";

// EVAPORATION AND CONDENSATION (L4) · set-up cards for the three experiments, then one card for each
// experiment, activity and project, and the wet-bulb thermometer. Flat kit look, same child and grown-up on every card.

const LIQ = { water: COL.water, salt: "#a3cfee", syrup: "#e0a33a", vinegar: "#f1dc8f", oil: "#fbf3df", sanit: "#cdeee3" };
const PL = "#cfe3f1", PL_DK = "#b7d2e6", PL_GLASS = "rgba(190,220,240,0.6)";
const STOVE = "#5c5f6e", STOVE_DK = "#44475a", FLAME = "#4f8fe0", FLAME_IN = "#c9e4ff", SALTW = "#eef0f2", SALTD = "#c4c9d0";

// ---------------------------------------------------------------- shared props
// a wooden counter: everything below y is its top
const table = (c: Ctx, y: number) => { c.fillStyle = COL.wood; c.fillRect(0, y, D, D - y); c.fillStyle = COL.woodDk; c.fillRect(0, y, D, 22); line(c, [[0, y], [D, y]], 6); };
// a gas stove slab with burner rings at the given x positions; its top edge at y
const stove = (c: Ctx, x0: number, x1: number, y: number, burners: number[]) => {
  shadow(c, (x0 + x1) / 2 + 20, y + 140, (x1 - x0) / 2, 22);
  shape(c, () => rrect(c, x0, y, x1 - x0, 130, 14), STOVE);
  c.fillStyle = STOVE_DK; c.fillRect(x0 + 4, y + 62, x1 - x0 - 8, 62); line(c, [[x0, y + 62], [x1, y + 62]], 4);
  for (const bx of burners) { shape(c, () => ell(c, bx, y + 30, 150, 24), "#3a3540", 5); shape(c, () => ell(c, bx, y + 30, 112, 15), "#26222e", 3); shape(c, () => ell(c, bx, y + 96, 20, 20), "#3a3540", 4); }
};
// blue gas flames between the pan bottom (yTop) and the burner (yBot)
const flames = (c: Ctx, x: number, yTop: number, yBot: number, r: number) => {
  for (let i = -3; i <= 3; i++) { const fx = x + i * r * 0.27, hgt = (yBot - yTop) * (i % 2 ? 0.75 : 0.95); shape(c, () => { c.moveTo(fx - 14, yBot); c.quadraticCurveTo(fx - 17, yBot - hgt * 0.6, fx, yBot - hgt); c.quadraticCurveTo(fx + 17, yBot - hgt * 0.6, fx + 14, yBot); c.closePath(); }, FLAME, 3); shape(c, () => { c.moveTo(fx - 6, yBot); c.quadraticCurveTo(fx - 7, yBot - hgt * 0.3, fx, yBot - hgt * 0.5); c.quadraticCurveTo(fx + 7, yBot - hgt * 0.3, fx + 6, yBot); c.closePath(); }, FLAME_IN, 0); }
};
// a steel pan from the side, bottom centre (x, y); water = a blue surface shows; lid = a domed lid on; handle 1 right, -1 left
const pan = (c: Ctx, x: number, y: number, r: number, o: { water?: boolean; lid?: boolean; handle?: 1 | -1 } = {}) => {
  const h = r * 0.72, ry = r * 0.2, hd = o.handle ?? 1, hl = r * 0.7;
  shape(c, () => rrect(c, hd > 0 ? x + r - 10 : x - r - hl + 10, y - h - 4, hl, 24, 10), COL.black, 5);
  const body = () => { c.moveTo(x - r, y - h); c.lineTo(x + r, y - h); c.lineTo(x + r, y - 12); c.quadraticCurveTo(x + r, y, x + r - 12, y); c.lineTo(x - r + 12, y); c.quadraticCurveTo(x - r, y, x - r, y - 12); c.closePath(); };
  shadow(c, x + 16, y + 6, r * 1.05, 14);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.45, 0);
  shape(c, () => ell(c, x, y - h, r, ry), o.water ? COL.water : COL.steelIn, 5);
  if (o.water) shape(c, () => ell(c, x - r * 0.3, y - h - 2, r * 0.22, ry * 0.3), COL.drop, 0);
  shine(c, [[x - r * 0.8, y - h + 24], [x - r * 0.8, y - 26]], 7);
  if (o.lid) {
    const dome = () => { c.moveTo(x + r, y - h); c.ellipse(x, y - h, r, ry, 0, 0, Math.PI); c.quadraticCurveTo(x - r, y - h - r * 0.55, x, y - h - r * 0.6); c.quadraticCurveTo(x + r, y - h - r * 0.55, x + r, y - h); c.closePath(); };
    shape(c, dome, COL.steel); shade(c, dome, COL.steelDk, r * 0.4, 0);
    shape(c, () => ell(c, x, y - h - r * 0.5, r * 0.14, r * 0.07), COL.black, 4);
  }
};
// white steam: n wavy strands rising h from (x, y)
const steam = (c: Ctx, x: number, y: number, h: number, n: number, seed: number, w = 14, spread = 60) => {
  const r = rnd(seed); c.globalAlpha = 0.92;
  for (let i = 0; i < n; i++) {
    const sx = x + (n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1)), ph = r() * 6.28, pts: number[][] = [];
    for (let t = 0; t <= 1.001; t += 0.1) pts.push([sx + Math.sin(ph + t * 5) * 18 + (sx - x) * t * 0.5, y - t * h]);
    line(c, pts, w + 5, "#d6dbe2"); line(c, pts, w, WHITE);
  }
  c.globalAlpha = 1;
};
// a wavy blue arrow of vapour rising len from (x, y), drifting dx sideways
const vapour = (c: Ctx, x: number, y: number, len: number, dx = 0, col: string = COL.blueDk, w = 6) => {
  const pts: number[][] = []; for (let t = 0; t <= 0.9; t += 0.1) pts.push([x + Math.sin(t * 6.28) * len * 0.09 + dx * t, y - t * len]); pts.push([x + dx, y - len]);
  arrow(c, pts, col, w);
};
// a wavy red arrow of warm air moving right from (x, y)
const heat = (c: Ctx, x: number, y: number, len: number, w = 6) => { const pts: number[][] = []; for (let t = 0; t <= 0.9; t += 0.1) pts.push([x + t * len, y + Math.sin(t * 6.28) * len * 0.08]); pts.push([x + len, y]); arrow(c, pts, COL.red, w); };
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water, ln = 3) => {
  shape(c, () => { c.moveTo(x, y - r * 1.7); c.quadraticCurveTo(x + r * 0.95, y - r * 0.55, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.95, y - r * 0.55, x, y - r * 1.7); c.closePath(); }, col, ln);
  if (r > 7) shape(c, () => ell(c, x - r * 0.35, y - r * 0.1, r * 0.2, r * 0.28), WHITE, 0);
};
const saucer = (c: Ctx, x: number, y: number, rx: number) => { const ry = rx * 0.4; shadow(c, x + rx * 0.08, y + ry * 0.3, rx, ry); shape(c, () => ell(c, x, y, rx, ry), "#f1eee6"); shape(c, () => ell(c, x, y - ry * 0.06, rx * 0.8, ry * 0.7), "#fffdf7", 4); };
// a heap of something on a saucer, its base centre (x, y); kind gives the grain look; damp = slumped, lumpy and wet
type Grain = "fine" | "sugar" | "rice" | "puff" | "damp";
const heap = (c: Ctx, x: number, y: number, rx: number, col: string, dk: string, kind: Grain = "fine", seed = 1) => {
  const hgt = rx * 0.8;
  const mound = () => { c.moveTo(x - rx, y); c.quadraticCurveTo(x - rx * 0.6, y - hgt, x, y - hgt); c.quadraticCurveTo(x + rx * 0.6, y - hgt, x + rx, y); c.closePath(); };
  const lumpy = () => { c.moveTo(x - rx, y); c.quadraticCurveTo(x - rx * 0.85, y - hgt * 0.55, x - rx * 0.5, y - hgt * 0.5); c.quadraticCurveTo(x - rx * 0.25, y - hgt * 0.9, x + rx * 0.02, y - hgt * 0.55); c.quadraticCurveTo(x + rx * 0.3, y - hgt * 0.85, x + rx * 0.55, y - hgt * 0.42); c.quadraticCurveTo(x + rx * 0.85, y - hgt * 0.5, x + rx, y); c.closePath(); };
  const path = kind === "damp" ? lumpy : mound;
  shape(c, path, col, 5); shade(c, path, dk, rx * 0.3, 0, 0.5);
  const r = rnd(seed), inside = (px: number, py: number) => y - py < hgt * 0.8 * (1 - ((px - x) / rx) ** 2) && py < y - 4;
  if (kind === "rice" || kind === "puff") for (let i = 0; i < (kind === "rice" ? 26 : 14); i++) { const px = x - rx + r() * 2 * rx, py = y - hgt + r() * hgt; if (inside(px, py)) shape(c, () => ell(c, px, py, kind === "rice" ? 9 : 14, kind === "rice" ? 4 : 10, r() * 3), "#fff8e8", 2.5); }
  if (kind === "sugar") for (let i = 0; i < 14; i++) { const px = x - rx + r() * 2 * rx, py = y - hgt + r() * hgt; if (inside(px, py)) shape(c, () => rrect(c, px - 4, py - 4, 8, 8, 1), WHITE, 2); }
  if (kind === "fine") for (let i = 0; i < 12; i++) { const px = x - rx + r() * 2 * rx, py = y - hgt + r() * hgt; if (inside(px, py)) shape(c, () => ell(c, px, py, 2.5, 2.5), dk, 0); }
  if (kind === "damp") { drop(c, x - rx * 0.45, y - hgt * 0.3, 8, COL.water, 2.5); drop(c, x + rx * 0.1, y - hgt * 0.45, 7, COL.water, 2.5); drop(c, x + rx * 0.55, y - hgt * 0.25, 7, COL.water, 2.5); shape(c, () => ell(c, x, y + 2, rx * 1.15, 7), COL.water, 2.5); }
};
// a paper slip with a number on it
const slip = (c: Ctx, x: number, y: number, n: string) => { shape(c, () => rrect(c, x - 42, y - 26, 84, 52, 6), COL.paper, 4); write(c, n, x - 13, y - 18, 36, INK, 5); };
// a glass jar, bottom centre (x, y); things inside are drawn by inside() between the glass back and its outline
const jar = (c: Ctx, x: number, y: number, w: number, h: number, lid: boolean, inside?: () => void) => {
  const body = () => rrect(c, x - w / 2, y - h, w, h, w * 0.12);
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.12);
  shape(c, body, COL.glass, 0); inside?.();
  shape(c, body, "rgba(214,236,250,0.22)", 5);
  shine(c, [[x - w * 0.36, y - h * 0.82], [x - w * 0.36, y - h * 0.3]], 9);
  if (lid) { shape(c, () => rrect(c, x - w * 0.47, y - h - 36, w * 0.94, 46, 8), COL.greyDk, 5); line(c, [[x - w * 0.47, y - h - 14], [x + w * 0.47, y - h - 14]], 3, "#5f5a52"); }
  else shape(c, () => ell(c, x, y - h, w * 0.5, w * 0.1), "rgba(255,255,255,0.4)", 5);
};
// a see-through plastic tub seen from above and in front: back wall, floor, then its near rim; lidOn covers it
const tub = (c: Ctx, x0: number, y0: number, x1: number, y1: number, inside?: () => void, lidOn = false) => {
  const w = x1 - x0, hgt = y1 - y0, yf = y0 + hgt * 0.42;
  shadow(c, (x0 + x1) / 2 + 20, y1 + 10, w / 2, 22);
  shape(c, () => rrect(c, x0, y0, w, hgt, 26), PL, 6);
  shape(c, () => rrect(c, x0 + 6, yf, w - 12, y1 - yf - 6, 20), PL_DK, 4);
  inside?.();
  shape(c, () => rrect(c, x0, y1 - 34, w, 34, 10), PL_GLASS, 5);
  if (lidOn) { shape(c, () => rrect(c, x0 - 14, y0 - 16, w + 28, hgt + 32, 30), PL, 6); shape(c, () => rrect(c, x0 + w * 0.3, y0 + hgt * 0.38, w * 0.4, 44, 14), PL_DK, 5); }
};
// a phone standing up, top-left (x, y); its screen is lighter
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 8, y + h + 6, w * 0.55, 10); shape(c, () => rrect(c, x, y, w, h, 18), COL.black, 5); shape(c, () => rrect(c, x + 10, y + 24, w - 20, h - 48, 10), "#f3f6fa", 3); };
const colon = (c: Ctx, x: number, y: number) => { shape(c, () => ell(c, x, y, 4, 4), INK, 0); shape(c, () => ell(c, x, y + 22, 4, 4), INK, 0); };
// a wooden ice-cream stick from (x0, y0) to (x1, y1)
const stick = (c: Ctx, x0: number, y0: number, x1: number, y1: number) => { line(c, [[x0, y0], [x1, y1]], 22, INK); line(c, [[x0, y0], [x1, y1]], 14, COL.wood); };
// a steel spoon: handle end at (hx, hy), its bowl at (bx, by)
const spoon = (c: Ctx, hx: number, hy: number, bx: number, by: number) => { const an = Math.atan2(by - hy, bx - hx); line(c, [[hx, hy], [bx - Math.cos(an) * 16, by - Math.sin(an) * 16]], 17, INK); line(c, [[hx, hy], [bx - Math.cos(an) * 16, by - Math.sin(an) * 16]], 9, COL.steel); shape(c, () => ell(c, bx, by, 24, 15, an), COL.steel, 4); shape(c, () => ell(c, bx - Math.cos(an) * 3, by - Math.sin(an) * 3, 14, 8, an), COL.steelIn, 0); };
// a small cup of a liquid with a stick leaning in it
const cupStick = (c: Ctx, x: number, y: number, liquid: string) => { glass(c, x, y, 95, 110, 0.55, liquid); stick(c, x + 18, y - 24, x + 62, y - 196); };
// a hand-sanitiser pump bottle, bottom centre (x, y)
const sanitiser = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 8, y + 4, w * 0.6, 8);
  shape(c, () => rrect(c, x - w / 2, y - h * 0.72, w, h * 0.72, 12), LIQ.sanit, 5); shade(c, () => rrect(c, x - w / 2, y - h * 0.72, w, h * 0.72, 12), "#9fd0c0", w * 0.35, 0, 0.5);
  shape(c, () => rrect(c, x - w * 0.22, y - h * 0.9, w * 0.44, h * 0.2, 4), COL.black, 4);
  shape(c, () => rrect(c, x - w * 0.16, y - h, w * 0.52, h * 0.12, 5), COL.black, 4);
  shape(c, () => rrect(c, x - w * 0.5, y - h * 0.5, w, h * 0.22, 3), WHITE, 3);
};
// a measuring jug, bottom centre (x, y): clear, a handle on the right, marks on the left, filled to fill (0..1)
const jug = (c: Ctx, x: number, y: number, w: number, h: number, fill: number, label?: [string, number]) => {
  shape(c, () => rrect(c, x + w / 2 - 6, y - h * 0.78, w * 0.3, h * 0.55, 16), COL.glass, 5);
  shape(c, () => rrect(c, x + w / 2 + 16, y - h * 0.7, w * 0.12, h * 0.4, 10), "rgba(239,228,207,1)", 4);
  glass(c, x, y, w, h, fill, COL.water);
  for (let i = 1; i <= 5; i++) { const my = y - (h * 0.9 * i) / 5; line(c, [[x - w * 0.42, my], [x - w * (i % 5 === 0 ? 0.2 : 0.3), my]], 3); }
  if (label) write(c, label[0], x - w * 0.18, y - h * label[1] - 30, 26, INK, 4);
};
// a steel tumbler, bottom centre (x, y); mist 0 = dry, 1 = a light mist, 2 = thick mist with running drops and ice showing
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, mist: 0 | 1 | 2, seed: number) => {
  const top = w / 2, bot = w * 0.42, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.4, 0);
  if (mist) { c.save(); c.beginPath(); body(); c.clip(); c.globalAlpha = mist === 2 ? 0.75 : 0.5; c.fillStyle = "#eaf3fa"; c.fillRect(x - top, y - h * 0.82, w, h * 0.82); c.restore(); c.globalAlpha = 1; }
  shape(c, () => ell(c, x, y - h, top, w * 0.09), mist === 2 ? COL.water : COL.steelIn, 5);
  if (mist === 2) for (let i = -1; i <= 1; i++) shape(c, () => rrect(c, x + i * w * 0.26 - 16, y - h - 22 + Math.abs(i) * 6, 32, 28, 5), "#e9f6ff", 3);
  shine(c, [[x - top * 0.7, y - h * 0.85], [x - bot * 0.75, y - h * 0.15]], 8);
  if (mist) { const r = rnd(seed); for (let i = 0; i < (mist === 2 ? 16 : 7); i++) drop(c, x - bot * 0.8 + r() * bot * 1.6, y - h * 0.08 - r() * h * (mist === 2 ? 0.7 : 0.45), mist === 2 ? 7 + r() * 5 : 5 + r() * 3, COL.drop, 2.5); }
  if (mist === 2) shape(c, () => ell(c, x + 8, y + 10, bot * 1.2, 10), COL.water, 3);
};
// a thermometer: bulb centre (x, y), tube up h, red column to frac of the scale; wet = a damp cloth round the bulb
const thermometer = (c: Ctx, x: number, y: number, h: number, frac: number, wet = false) => {
  const tw = 34, bulbR = 38, bottom = y - bulbR * 0.7, scaleH = h - bulbR * 0.7 - 40;
  shape(c, () => rrect(c, x - tw / 2, y - h, tw, h - bulbR * 0.5, 17), "#fffdf7", 5);
  c.fillStyle = RED; c.fillRect(x - 9, bottom - scaleH * frac, 18, scaleH * frac + 10);
  for (let i = 0; i <= 8; i++) { const ty = bottom - (scaleH * i) / 8; line(c, [[x + tw / 2, ty], [x + tw / 2 + (i % 2 ? 12 : 22), ty]], 3); }
  shape(c, () => ell(c, x, y, bulbR, bulbR), RED, 5); shape(c, () => ell(c, x - 12, y - 12, 9, 7), "#ffb3a6", 0);
  if (wet) {
    const tail = () => { c.moveTo(x - 30, y + 20); c.quadraticCurveTo(x - 90, y + 60, x - 100, y + 150); c.lineTo(x - 64, y + 156); c.quadraticCurveTo(x - 60, y + 80, x + 10, y + 46); c.closePath(); };
    shape(c, tail, "#bfe0f5", 5);
    const wrap = () => rrect(c, x - 60, y - 54, 120, 108, 40); shape(c, wrap, "#bfe0f5", 5); shade(c, wrap, COL.water, 24, 0, 0.4);
    line(c, [[x - 44, y - 30], [x + 20, y + 30]], 3, COL.waterDk); line(c, [[x - 20, y - 44], [x + 40, y + 10]], 3, COL.waterDk);
  }
};
// a cloud whose flat bottom sits on y, width w
const cloud = (c: Ctx, x: number, y: number, w: number) => {
  const path = () => { c.moveTo(x - w / 2, y); c.quadraticCurveTo(x - w * 0.62, y - w * 0.24, x - w * 0.3, y - w * 0.26); c.quadraticCurveTo(x - w * 0.24, y - w * 0.52, x, y - w * 0.46); c.quadraticCurveTo(x + w * 0.26, y - w * 0.52, x + w * 0.3, y - w * 0.28); c.quadraticCurveTo(x + w * 0.62, y - w * 0.26, x + w / 2, y); c.closePath(); };
  shape(c, path, WHITE, 5);
  c.save(); c.beginPath(); path(); c.clip(); c.fillStyle = "#8b93a3"; c.fillRect(x - w, y - w * 0.085, 2 * w, w * 0.2); c.restore();
  line(c, [[x - w / 2, y], [x + w / 2, y]], 5);
};
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 7, COL.orange); } shape(c, () => ell(c, x, y, r, r), COL.yellow, 5); };
// a wooden ruler lying flat, top-left (x, y), len long, with cm ticks every px
const ruler = (c: Ctx, x: number, y: number, len: number, px: number) => {
  shadow(c, x + len / 2 + 12, y + 74, len / 2, 10);
  shape(c, () => rrect(c, x, y, len, 64, 6), COL.wood, 5); c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + 50, len - 6, 11);
  const n = Math.floor((len - 40) / px);
  for (let i = 0; i <= n * 2; i++) { const tx = x + 20 + (i * px) / 2; line(c, [[tx, y], [tx, y + (i % 2 ? 12 : 22)]], i % 2 ? 2.5 : 4); }
  for (let i = 0; i <= n; i += 2) write(c, String(i), x + 20 + i * px - 8, y + 26, 20, INK, 3.5);
};
// a camphor tablet, a white rounded square, centre (x, y)
const camphor = (c: Ctx, x: number, y: number, s: number) => { const p = () => rrect(c, x - s, y - s * 0.7, s * 2, s * 1.4, s * 0.3); shadow(c, x + s * 0.1, y + s * 0.8, s, s * 0.25); shape(c, p, WHITE, 5); shade(c, p, "#d8dce4", s * 0.35, 0, 0.5); };
// smell: thin pale wavy lines rising
const smell = (c: Ctx, x: number, y: number, h: number, n: number) => { for (let i = 0; i < n; i++) { const sx = x + (i - (n - 1) / 2) * 34, pts: number[][] = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push([sx + Math.sin(i + t * 6) * 10, y - t * h]); line(c, pts, 5, COL.greyDk); } };
// a red oven mitt drawn over a hand point, fingers along angle an
const mitt = (c: Ctx, x: number, y: number, an: number) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -40, -30, 40, 60, 14), COL.red, 5); shape(c, () => ell(c, 26, 0, 42, 32), COL.red, 5); shape(c, () => ell(c, 10, -34, 20, 15, -0.5), COL.red, 4); line(c, [[18, -8], [44, -12]], 3, "#a8321f"); c.restore(); };
// a fridge from the front, top-left (x, y); open = the freezer door swung open, its inside showing
const fridge = (c: Ctx, x: number, y: number, w: number, h: number, open: boolean) => {
  const split = y + h * 0.32, body = () => rrect(c, x, y, w, h, 20);
  shadow(c, x + w / 2 + 30, y + h + 8, w / 2, 20);
  shape(c, body, "#eef1f4"); shade(c, body, "#c9d0d8", w * 0.12, 0, 0.6);
  if (open) {
    shape(c, () => rrect(c, x + 14, y + 14, w - 28, h * 0.32 - 28, 10), "#9fbdd3", 5);
    line(c, [[x + 24, split - 44], [x + w - 24, split - 44]], 5); shape(c, () => rrect(c, x + 40, split - 68, 120, 24, 6), "#d9ecf7", 4);
    shape(c, () => { c.moveTo(x, y); c.lineTo(x - w * 0.36, y + 40); c.lineTo(x - w * 0.36, split - 40); c.lineTo(x, split); c.closePath(); }, "#e3e7ec", 6);
    shape(c, () => rrect(c, x - w * 0.3, y + h * 0.1, 16, 90, 8), COL.greyDk, 4);
  } else { line(c, [[x, split], [x + w, split]], 6); shape(c, () => rrect(c, x + 26, y + 40, 18, 90, 9), COL.greyDk, 4); }
  shape(c, () => rrect(c, x + 26, split + 50, 18, 150, 9), COL.greyDk, 4);
  shape(c, () => rrect(c, x + 20, y + h - 4, 40, 18, 4), COL.black, 3); shape(c, () => rrect(c, x + w - 60, y + h - 4, 40, 18, 4), COL.black, 3);
};
// the back of a fridge: a plain back panel, the black cooling grille over it and the compressor at the bottom
const fridgeBack = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => rrect(c, x, y, w, h, 20);
  shadow(c, x + w / 2 + 30, y + h + 8, w / 2, 20);
  shape(c, body, "#e2e6ea"); shade(c, body, "#bcc4cc", w * 0.1, 0, 0.6);
  shape(c, () => rrect(c, x + 30, y + 40, w - 60, h * 0.78, 10), "#aab3bd", 4);
  const gx0 = x + 70, gx1 = x + w - 70, rows = 7, gy0 = y + 110, step = (h * 0.78 - 190) / (rows - 1);
  for (let i = 0; i < rows; i++) { const gy = gy0 + i * step; line(c, [[gx0, gy], [gx1, gy]], 11, COL.black); if (i < rows - 1) { c.beginPath(); c.arc(i % 2 ? gx0 : gx1, gy + step / 2, step / 2, -Math.PI / 2, Math.PI / 2, i % 2 === 1); c.strokeStyle = COL.black; c.lineWidth = 11; c.stroke(); } }
  for (const vx of [gx0 + (gx1 - gx0) * 0.33, gx0 + (gx1 - gx0) * 0.66]) line(c, [[vx, gy0 - 20], [vx, gy0 + step * (rows - 1) + 20]], 4, "#5a5f68");
  shape(c, () => ell(c, x + w / 2, y + h - 70, 84, 46), COL.black, 5); shape(c, () => ell(c, x + w / 2 - 24, y + h - 84, 18, 10), "#6b6670", 0);
  line(c, [[x + w / 2 + 84, y + h - 60], [x + w + 40, y + h - 30], [x + w + 60, y + h - 70]], 5, COL.black); shape(c, () => rrect(c, x + w + 50, y + h - 110, 34, 46, 6), COL.black, 4);
  shape(c, () => rrect(c, x + 20, y + h - 4, 40, 18, 4), COL.black, 3); shape(c, () => rrect(c, x + w - 60, y + h - 4, 40, 18, 4), COL.black, 3);
};
// a white mist spilling down from (x, y0) over a surface to y1, as soft blobs
const fog = (c: Ctx, x: number, y0: number, y1: number, w: number, seed: number) => {
  const r = rnd(seed); c.globalAlpha = 0.85;
  for (let i = 0; i < 26; i++) { const t = i / 26, fy = y0 + t * (y1 - y0), fx = x + (r() - 0.5) * w * (0.5 + t), rr = 26 + r() * 22 + t * 16; shape(c, () => ell(c, fx, fy, rr * 1.3, rr * 0.8), "#f5f9fc", 3); }
  c.globalAlpha = 1;
};
// a short streak of liquid smeared on a plate: a rounded bar at angle an; faded = dried, only an outline left
const streak = (c: Ctx, x: number, y: number, len: number, an: number, col: string, state: "wet" | "going" | "dry") => {
  c.save(); c.translate(x, y); c.rotate(an);
  if (state === "dry") { c.setLineDash([9, 9]); c.beginPath(); rrect(c, -len / 2, -14, len, 28, 14); c.strokeStyle = COL.greyDk; c.lineWidth = 3; c.stroke(); c.setLineDash([]); }
  else { const l = state === "going" ? len * 0.55 : len; shape(c, () => rrect(c, -l / 2, -14, l, 28, 14), col, 4); shine(c, [[-l / 2 + 16, -5], [l / 2 - 16, -5]], 5); }
  c.restore();
};
// the child's mouth made into a blowing "o"
const blowMouth = (c: Ctx, x: number, y: number, h: number) => { const head = h * 0.15, hy = y - h * 0.4 - h * 0.27 - head * 1.12; shape(c, () => ell(c, x, hy + head * 0.645, head * 0.37, head * 0.17), SKIN.child, 0); shape(c, () => ell(c, x, hy + head * 0.6, head * 0.1, head * 0.13), INK, 0); };
// a pan tilted by ang (clockwise) about its centre, pouring from its right rim; returns the pour point and two handle grips
const panTilted = (c: Ctx, cx: number, cy: number, r: number, ang: number, draw = true) => {
  const hh = r * 0.38, P = (lx: number, ly: number): [number, number] => [cx + lx * Math.cos(ang) - ly * Math.sin(ang), cy + lx * Math.sin(ang) + ly * Math.cos(ang)];
  if (!draw) return { pour: P(r, -hh), grip1: P(-r - 110, -hh + 14), grip2: P(-r - 40, -hh + 14) };
  c.save(); c.translate(cx, cy); c.rotate(ang);
  shape(c, () => rrect(c, -r - 122, -hh + 2, 124, 24, 10), COL.black, 5);
  const body = () => { c.moveTo(-r, -hh); c.lineTo(r, -hh); c.lineTo(r, hh - 12); c.quadraticCurveTo(r, hh, r - 12, hh); c.lineTo(-r + 12, hh); c.quadraticCurveTo(-r, hh, -r, hh - 12); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 0, hh * 0.9, 0.55);
  line(c, [[-r, -hh], [r, -hh]], 8); shine(c, [[-r * 0.7, -hh + 18], [r * 0.4, -hh + 18]], 6);
  c.restore();
  return { pour: P(r, -hh), grip1: P(-r - 110, -hh + 14), grip2: P(-r - 40, -hh + 14) };
};
// a cut-away pan showing the water inside; lid = a cut-away domed lid with drops under it
const cutPan = (c: Ctx, x: number, y: number, r: number, level: number, lid: boolean, hd: 1 | -1 = 1) => {
  const h = r * 0.8, wall = 22;
  shape(c, () => rrect(c, hd > 0 ? x + r - 8 : x - r - r * 0.75 + 8, y - h - 2, r * 0.75, 26, 10), COL.black, 5);
  const outer = () => { c.moveTo(x - r, y - h); c.lineTo(x + r, y - h); c.lineTo(x + r, y - 20); c.quadraticCurveTo(x + r, y, x + r - 20, y); c.lineTo(x - r + 20, y); c.quadraticCurveTo(x - r, y, x - r, y - 20); c.closePath(); };
  shadow(c, x + 16, y + 6, r * 1.05, 14);
  shape(c, outer, COL.steel, 6);
  const inner = () => { c.moveTo(x - r + wall, y - h); c.lineTo(x + r - wall, y - h); c.lineTo(x + r - wall, y - wall - 10); c.quadraticCurveTo(x + r - wall, y - wall, x + r - wall - 10, y - wall); c.lineTo(x - r + wall + 10, y - wall); c.quadraticCurveTo(x - r + wall, y - wall, x - r + wall, y - wall - 10); c.closePath(); };
  shape(c, inner, COL.steelIn, 5);
  const wy = y - wall - (h - wall) * level;
  c.save(); c.beginPath(); inner(); c.clip(); c.fillStyle = COL.water; c.fillRect(x - r, wy, 2 * r, h);
  c.beginPath(); c.moveTo(x - r, wy + 2); for (let i = 0; i <= 8; i++) c.lineTo(x - r + (i * 2 * r) / 8, wy + (i % 2 ? -5 : 5)); c.strokeStyle = COL.waterDk; c.lineWidth = 4; c.stroke(); c.restore();
  if (lid) {
    const R = r + 6, dome = () => { c.moveTo(x - R, y - h); c.quadraticCurveTo(x - R, y - h - r * 0.62, x, y - h - r * 0.66); c.quadraticCurveTo(x + R, y - h - r * 0.62, x + R, y - h); c.lineTo(x + R - wall, y - h); c.quadraticCurveTo(x + R - wall, y - h - r * 0.44, x, y - h - r * 0.46); c.quadraticCurveTo(x - R + wall, y - h - r * 0.44, x - R + wall, y - h); c.closePath(); };
    shape(c, dome, COL.steel, 6); shape(c, () => ell(c, x, y - h - r * 0.62, r * 0.14, r * 0.07), COL.black, 4);
  }
  return { wy, top: y - h };
};
// a cloth tied over a jar's mouth, mouth centre (x, y) and width w
const clothCap = (c: Ctx, x: number, y: number, w: number) => { const p = () => { c.moveTo(x - w * 0.62, y + 50); c.lineTo(x - w * 0.6, y - 6); c.quadraticCurveTo(x, y - 46, x + w * 0.6, y - 6); c.lineTo(x + w * 0.64, y + 44); c.lineTo(x + w * 0.5, y + 30); c.lineTo(x + w * 0.5, y + 10); c.lineTo(x - w * 0.5, y + 10); c.lineTo(x - w * 0.5, y + 32); c.closePath(); }; shape(c, p, COL.cloth, 5); shade(c, p, "#e4dccb", w * 0.2, 0, 0.5); line(c, [[x - w * 0.52, y + 12], [x + w * 0.52, y + 12]], 8, COL.red); };

// ================================================================ set-up cards
// e1 step 1: the plate, six cups each with its own liquid and a stick, and the drawn plate on paper
const e1_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 790, 790, 250, 200, 6), COL.paper, 5);
  c.beginPath(); ell(c, 915, 890, 92, 60); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; line(c, [[915 + Math.cos(a) * 60 - 10, 890 + Math.sin(a) * 36], [915 + Math.cos(a) * 60 + 10, 890 + Math.sin(a) * 36]], 5); }
  line(c, [[700, 1035], [860, 990]], 16, INK); line(c, [[700, 1035], [860, 990]], 9, COL.yellow); line(c, [[856, 991], [880, 984]], 9, SKIN.childDk);
  cupStick(c, 230, 350, LIQ.water); cupStick(c, 540, 300, LIQ.salt); cupStick(c, 850, 350, LIQ.syrup);
  plate(c, 540, 580, 310, 165);
  cupStick(c, 150, 720, LIQ.vinegar); cupStick(c, 930, 720, LIQ.oil); cupStick(c, 560, 900, LIQ.sanit);
  sanitiser(c, 420, 1000, 70, 190);
};
// e1 step 2: the child smears a streak with a stick; the other streaks are already there in a ring
const e1_1 = (c: Ctx) => {
  ground(c);
  const H = person(c, 540, 1010, 520, { reachR: [628, 698], reachL: [402, 726] });
  table(c, 740);
  plate(c, 560, 890, 280, 120);
  const ring: [number, string][] = [[-150, LIQ.water], [-90, LIQ.salt], [30, LIQ.vinegar], [90, LIQ.oil], [150, LIQ.sanit]];
  for (const [deg, col] of ring) { const a = (deg * Math.PI) / 180; streak(c, 560 + Math.cos(a) * 170, 890 + Math.sin(a) * 65, 74, a + Math.PI / 2 + (Math.abs(deg) === 90 ? 0 : 0.3 * Math.sign(deg) * Math.sign(Math.cos(a))), col, "wet"); }
  shape(c, () => rrect(c, 690, 836, 46, 26, 13), LIQ.syrup, 4);
  stick(c, H.handR[0], H.handR[1], 692, 842);
  cupStick(c, 150, 900, LIQ.water); cupStick(c, 240, 1010, LIQ.vinegar); cupStick(c, 950, 900, LIQ.syrup); cupStick(c, 900, 1030, LIQ.oil);
};
// e1 step 3: the child's eyes at plate level, a timer running, some streaks dull and some shiny
const e1_2 = (c: Ctx) => {
  ground(c);
  person(c, 250, 1290, 520, { dir: 1 });
  table(c, 900);
  plate(c, 640, 940, 320, 38);
  const S: [string, boolean][] = [[LIQ.sanit, false], [LIQ.vinegar, false], [LIQ.water, false], [LIQ.salt, true], [LIQ.syrup, true], [LIQ.oil, true]];
  S.forEach(([col, shiny], i) => { const sx = 420 + i * 88, sy = 936 - Math.sin((i + 0.5) / 6 * Math.PI) * 6; if (shiny) { shape(c, () => ell(c, sx, sy, 34, 9), col, 3); shape(c, () => ell(c, sx - 8, sy - 3, 12, 3), WHITE, 0); } else { c.setLineDash([6, 6]); c.beginPath(); ell(c, sx, sy, 34, 9); c.strokeStyle = COL.greyDk; c.lineWidth = 3; c.stroke(); c.setLineDash([]); } });
  phone(c, 880, 680, 150, 240);
  write(c, "6", 900, 760, 36, INK, 5); colon(c, 942, 772); write(c, "00", 954, 760, 36, INK, 5);
};
// e1 step 4: a drop of water on one hand, sanitiser on the other, the child blowing on them
const e1_3 = (c: Ctx) => {
  ground(c);
  const H = person(c, 540, 1100, 620, { reachL: [382, 698], reachR: [698, 698] });
  blowMouth(c, 540, 1100, 620);
  drop(c, H.handL[0] + 4, H.handL[1] - 22, 15, COL.water); drop(c, H.handR[0] - 4, H.handR[1] - 22, 15, LIQ.sanit);
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const yy = 648 + k * 14; c.beginPath(); c.moveTo(540 + s * 34, yy); c.quadraticCurveTo(540 + s * 80, yy + 10, 540 + s * (112 + k * 10), yy + 22 + k * 6); c.strokeStyle = COL.blue; c.lineWidth = 4; c.lineCap = "round"; c.stroke(); }
  for (const [px, py] of [[790, 640], [820, 685], [772, 712]]) { line(c, [[px - 10, py], [px + 10, py]], 4, COL.blueDk); line(c, [[px, py - 10], [px, py + 10]], 4, COL.blueDk); }
  table(c, 900);
  glass(c, 200, 1040, 110, 130, 0.6, COL.water); sanitiser(c, 880, 1040, 80, 170);
};
// e2 step 1: six saucers, a heap of a different kitchen thing in each, numbered slips
const e2_0 = (c: Ctx) => {
  ground(c);
  const P: [number, number, string, string, Grain][] = [[220, 430, WHITE, "#d8d4cc", "fine"], [540, 400, WHITE, "#d8d4cc", "sugar"], [860, 430, "#b5742f", "#8a5420", "fine"], [220, 790, "#fff6e0", "#e0cfa5", "rice"], [540, 760, "#fbfbf6", "#d2d2cc", "fine"], [860, 790, "#f8ecd2", "#dcc79c", "puff"]];
  P.forEach(([x, y, col, dk, kind], i) => { saucer(c, x, y, 135); heap(c, x, y - 8, 88, col, dk, kind, i + 3); slip(c, x, y + 88, String(i + 1)); });
};
// e2 step 2: saucers and a bowl of steaming water in the box, the grown-up lowering the lid on
const e2_1 = (c: Ctx) => {
  ground(c);
  person(c, 540, 1100, 720, { adult: true, reachL: [290, 592], reachR: [790, 592] });
  shape(c, () => rrect(c, 250, 566, 580, 46, 14), PL, 6); shape(c, () => rrect(c, 420, 548, 240, 26, 10), PL_DK, 4);
  arrow(c, [[330, 616], [330, 646]]); arrow(c, [[750, 616], [750, 646]]);
  table(c, 930);
  tub(c, 190, 650, 890, 960, () => {
    const back: [number, number, string, string, Grain][] = [[280, 790, WHITE, "#d8d4cc", "fine"], [540, 770, WHITE, "#d8d4cc", "sugar"], [800, 790, "#b5742f", "#8a5420", "fine"]];
    const front: [number, number, string, string, Grain][] = [[280, 915, "#fff6e0", "#e0cfa5", "rice"], [540, 938, "#fbfbf6", "#d2d2cc", "fine"], [800, 915, "#f8ecd2", "#dcc79c", "puff"]];
    back.forEach(([x, y, col, dk, k], i) => { saucer(c, x, y, 68); heap(c, x, y - 4, 44, col, dk, k, i + 1); });
    bowl(c, 540, 850, 56, COL.water); steam(c, 540, 836, 150, 3, 5, 10, 34);
    front.forEach(([x, y, col, dk, k], i) => { saucer(c, x, y, 68); heap(c, x, y - 4, 44, col, dk, k, i + 7); });
  });
};
// e2 step 3: the control: dry salt on a saucer in a closed jar, next to the closed box
const e2_2 = (c: Ctx) => {
  ground(c); table(c, 540);
  tub(c, 620, 560, 1040, 900, undefined, true);
  jar(c, 330, 890, 340, 440, true, () => { saucer(c, 330, 805, 115); heap(c, 330, 798, 76, WHITE, "#d8d4cc", "fine", 2); });
};
// e2 step 4: the child lifts the lid off and pokes the damp, lumpy salt with a dry spoon
const e2_3 = (c: Ctx) => {
  ground(c);
  const H = person(c, 600, 1100, 560, { reachL: [440, 650], reachR: [735, 700] });
  table(c, 930);
  tub(c, 450, 700, 1000, 960, () => {
    const back: [number, number, string, string, Grain][] = [[540, 840, WHITE, "#d8d4cc", "sugar"], [700, 850, SALTW, SALTD, "damp"], [880, 840, "#b5742f", "#8a5420", "fine"]];
    const front: [number, number, string, string, Grain][] = [[600, 925, "#fff6e0", "#e0cfa5", "rice"], [860, 925, "#f8ecd2", "#dcc79c", "puff"]];
    back.forEach(([x, y, col, dk, k], i) => { saucer(c, x, y, 60); heap(c, x, y - 4, 40, col, dk, k, i + 1); });
    bowl(c, 735, 905, 44, COL.water);
    front.forEach(([x, y, col, dk, k], i) => { saucer(c, x, y, 60); heap(c, x, y - 4, 40, col, dk, k, i + 7); });
  });
  spoon(c, H.handR[0], H.handR[1], 700, 812);
  c.save(); c.translate(385, 790); c.rotate(Math.atan2(280, -110)); shape(c, () => rrect(c, -150, -20, 300, 40, 12), PL, 6); c.fillStyle = PL_DK; c.fillRect(-140, 6, 280, 10); c.restore();
};
// e3 step 1: two pans with the same water, the jug that measured it, the lid for one
const e3_0 = (c: Ctx) => {
  ground(c); table(c, 760);
  stove(c, 60, 820, 650, [220, 560]);
  pan(c, 220, 672, 120, { water: true, handle: -1 }); pan(c, 560, 672, 120, { water: true, handle: -1 });
  shape(c, () => ell(c, 770, 575, 28, 112), COL.steel, 5); shape(c, () => ell(c, 770, 575, 14, 90), COL.steelDk, 0); shape(c, () => ell(c, 744, 575, 10, 16), COL.black, 4);
  jug(c, 925, 1000, 190, 280, 0.65, ["500", 0.66]);
};
// e3 step 2: both pans boiling, steam pouring from the open one, a little at the lid's edge
const e3_1 = (c: Ctx) => {
  ground(c); table(c, 760);
  stove(c, 60, 820, 650, [220, 560]);
  flames(c, 220, 642, 692, 120); flames(c, 560, 642, 692, 120);
  pan(c, 220, 640, 120, { water: true, handle: -1 }); pan(c, 560, 640, 120, { lid: true, handle: 1 });
  const r = rnd(4); for (let i = 0; i < 9; i++) { const bx = 130 + r() * 180, by = 548 + (r() - 0.5) * 20; shape(c, () => ell(c, bx, by, 8 + r() * 6, 6 + r() * 4), WHITE, 2.5); }
  steam(c, 220, 540, 420, 4, 3, 16, 70);
  steam(c, 688, 560, 130, 1, 6, 9, 0); steam(c, 436, 560, 100, 1, 8, 8, 0);
};
// e3 step 3: heat off, the grown-up lifts the lid away in an oven mitt: drops hang under it
const e3_2 = (c: Ctx) => {
  ground(c);
  const H = person(c, 640, 1150, 720, { adult: true, reachR: [900, 700] });
  table(c, 820); stove(c, 60, 560, 850, [300]);
  pan(c, 300, 870, 125, { water: true, handle: -1 });
  shape(c, () => ell(c, 900, 560, 130, 130), COL.steel, 6); shape(c, () => ell(c, 900, 560, 104, 104), COL.steelIn, 4);
  const r = rnd(9); for (let i = 0; i < 22; i++) { const a = r() * 6.283, d = r() * 90; drop(c, 900 + Math.cos(a) * d, 560 + Math.sin(a) * d, 6 + r() * 6, COL.drop, 2.5); }
  mitt(c, H.handR[0], H.handR[1], -Math.PI / 2);
};
// e3 step 4: the child pours the cooled water from a pan into the jug
const e3_3 = (c: Ctx) => {
  ground(c);
  const T = panTilted(c, 700, 740, 110, 0.45, false);
  person(c, 460, 1000, 560, { reachL: T.grip1, reachR: T.grip2 });
  table(c, 800);
  pan(c, 170, 990, 95, { handle: -1 });
  const T2 = panTilted(c, 700, 740, 110, 0.45);
  jug(c, 850, 1020, 200, 250, 0.42, ["500", 0.72]);
  c.beginPath(); c.moveTo(T2.pour[0], T2.pour[1]); c.quadraticCurveTo(T2.pour[0] + 30, T2.pour[1] + 40, 850, 905); c.strokeStyle = INK; c.lineWidth = 22; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.water; c.lineWidth = 14; c.stroke();
};

// ================================================================ cards
// Drop Race: six streaks on the plate after a while: sanitiser gone, vinegar going, water half, the rest shiny
const f_e1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 440, 330);
  const R: [number, string, "wet" | "going" | "dry"][] = [[-90, LIQ.sanit, "dry"], [-30, LIQ.vinegar, "going"], [30, LIQ.water, "going"], [90, LIQ.salt, "wet"], [150, LIQ.syrup, "wet"], [210, LIQ.oil, "wet"]];
  for (const [deg, col, st] of R) { const a = (deg * Math.PI) / 180, sx = 540 + Math.cos(a) * 250, sy = 600 + Math.sin(a) * 170; streak(c, sx, sy, 120, Math.abs(Math.cos(a)) < 0.1 ? 0 : Math.atan2(Math.sin(a) * 0.5, Math.cos(a)) + Math.PI / 2, col, st); if (st === "going") { vapour(c, sx - 24, sy - 24, 110, -12); vapour(c, sx + 20, sy - 24, 90, 10); } if (deg === -90) { vapour(c, sx, sy - 30, 70, 0, "#9ab0c4", 4); } if (deg === 90) vapour(c, sx + 10, sy - 26, 80, 6); }
  phone(c, 880, 40, 150, 240); write(c, "8", 900, 120, 36, INK, 5); colon(c, 942, 132); write(c, "00", 954, 120, 36, INK, 5);
};
// Thirsty Things: inside the humid box, the salt has gone damp and lumpy while the rice stays dry
const f_e2 = (c: Ctx) => {
  ground(c);
  tub(c, 120, 300, 960, 940, () => {
    bowl(c, 540, 580, 95, COL.water); steam(c, 540, 565, 200, 3, 2, 12, 50);
    saucer(c, 330, 830, 150); heap(c, 330, 818, 105, SALTW, SALTD, "damp", 3);
    saucer(c, 760, 830, 150); heap(c, 760, 818, 100, "#fff6e0", "#e0cfa5", "rice", 5);
    const pts: number[][] = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push([480 - t * 130 + Math.sin(t * 9) * 8, 600 + t * 150]); arrow(c, pts, COL.blueDk, 6);
    const r = rnd(11); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 300 + r() * 320, 420 + r() * 260, 5, 5), COL.blueDk, 0);
  });
};
// Lid On or Lid Off: the open pan lost water to the air; under the lid the drops ran back in
const f_e3 = (c: Ctx) => {
  ground(c); table(c, 860);
  const A = cutPan(c, 290, 830, 190, 0.4, false, -1), B = cutPan(c, 790, 830, 190, 0.82, true);
  c.setLineDash([12, 10]); line(c, [[110, B.wy], [470, B.wy]], 4, COL.greyDk); c.setLineDash([]);
  vapour(c, 220, A.wy - 10, 300, -70); vapour(c, 290, A.wy - 10, 340, 10); vapour(c, 360, A.wy - 10, 300, 80);
  const r = rnd(5); for (let i = 0; i < 9; i++) { const dx = -130 + i * 32, dy = 830 - 152 - Math.sqrt(Math.max(0, 1 - (dx / 170) ** 2)) * 70 + 14; drop(c, 790 + dx, dy, 7 + r() * 3, COL.drop, 2.5); }
  vapour(c, 760, B.wy - 10, 40, 0, COL.blueDk, 5); vapour(c, 830, B.wy - 10, 46, 0, COL.blueDk, 5);
  arrow(c, [[648, 700], [640, 630], [650, 560]], COL.blueDk, 5); arrow(c, [[932, 700], [940, 630], [930, 560]], COL.blueDk, 5);
  arrow(c, [[690, 580], [660, 630], [655, 690]], COL.blue, 5); arrow(c, [[890, 580], [920, 630], [925, 690]], COL.blue, 5);
};
// Fridge Fog: the freezer door opens and a white fog pours down over the door below
const f_a1 = (c: Ctx) => {
  ground(c); c.fillStyle = "#d9c9a8"; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5);
  fridge(c, 150, 130, 390, 870, true);
  fog(c, 345, 400, 820, 330, 3);
  person(c, 800, 1000, 520, { reachL: [585, 640] });
};
// Feel the Heat Leave: the back of the fridge is warm; the child feels it with the back of a hand
const f_a2 = (c: Ctx) => {
  ground(c); c.fillStyle = "#d9c9a8"; c.fillRect(0, 1000, D, 80); line(c, [[0, 1000], [D, 1000]], 5);
  fridgeBack(c, 110, 130, 420, 870);
  heat(c, 545, 540, 50); heat(c, 545, 580, 50); heat(c, 545, 620, 50);
  person(c, 810, 1000, 520, { reachL: [610, 660] });
};
// Predict the Sweat: tap water dry, fridge water misted, ice water dripping; the dew point on the phone
const f_a3 = (c: Ctx) => {
  ground(c); table(c, 560);
  phone(c, 420, 320, 240, 320);
  sun(c, 480, 420, 22); write(c, "30°", 530, 398, 40, INK, 6);
  drop(c, 480, 540, 18, COL.water); write(c, "24°", 530, 518, 40, COL.blueDk, 6);
  tumbler(c, 230, 960, 190, 300, 0, 1); tumbler(c, 540, 960, 190, 300, 1, 2); tumbler(c, 850, 960, 190, 300, 2, 3);
};
// Flat-Bottomed Clouds: a row of clouds, their flat dark bottoms all at one height over the fields
const f_a4 = (c: Ctx) => {
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, D); c.fillStyle = "#dbeefa"; c.fillRect(0, 560, D, 240);
  c.fillStyle = COL.leaf; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 5); c.fillStyle = COL.leafDk; c.fillRect(0, 900, D, 40);
  shape(c, () => rrect(c, 850, 700, 36, 120, 8), COL.brown, 5); shape(c, () => ell(c, 868, 660, 95, 80), COL.greenDk, 5); shape(c, () => ell(c, 840, 640, 50, 40), COL.green, 0);
  shape(c, () => ell(c, 180, 800, 70, 30), COL.greenDk, 5);
  sun(c, 950, 130, 50);
  c.setLineDash([14, 12]); line(c, [[0, 420], [D, 420]], 4, COL.greyDk); c.setLineDash([]);
  cloud(c, 150, 420, 240); cloud(c, 440, 420, 300); cloud(c, 710, 420, 210); cloud(c, 930, 420, 230);
};
// The Vanishing Kapoor: the open tablet shrinks and smells; the one in the jar keeps its size and frosts the glass
const f_a5 = (c: Ctx) => {
  ground(c); table(c, 600);
  saucer(c, 300, 870, 170); camphor(c, 300, 848, 40); smell(c, 300, 820, 300, 3);
  jar(c, 790, 910, 300, 400, true, () => { camphor(c, 790, 868, 72); const r = rnd(7); for (let i = 0; i < 40; i++) { const side = r() < 0.5 ? -1 : 1, px = 790 + side * (120 + r() * 22), py = 540 + r() * 300; shape(c, () => rrect(c, px - 5, py - 5, 10, 10, 2), WHITE, 2); } });
  ruler(c, 90, 975, 520, 62);
};
// Evaporation Pan: the jar in the sun loses water faster than the jar in the shade
const f_p1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#a99c88"; c.fillRect(540, 0, 540, 760); c.fillStyle = "#8f836f"; c.fillRect(540, 0, 540, 70); line(c, [[540, 0], [540, 760]], 6);
  sun(c, 170, 170, 60);
  table(c, 760);
  const water = (x: number, lvl: number) => { shape(c, () => rrect(c, x - 118, 760 - lvl, 236, lvl - 10, 20), COL.water, 0); shape(c, () => ell(c, x, 760 - lvl, 118, 14), COL.drop, 3); };
  jar(c, 300, 760, 260, 400, false, () => water(300, 110)); clothCap(c, 300, 360, 260);
  jar(c, 800, 760, 260, 400, false, () => water(800, 200)); clothCap(c, 800, 360, 260);
  c.setLineDash([12, 10]); line(c, [[150, 520], [950, 520]], 4, COL.greyDk); c.setLineDash([]);
  write(c, "60", 60, 500, 30, INK, 5);
  arrow(c, [[300, 540], [300, 640]], RED, 8); arrow(c, [[800, 540], [800, 552]], RED, 8);
};
// Wet-bulb temperature: a wet cloth round the bulb in a breeze reads lower than the dry one beside it
const t_14 = (c: Ctx) => {
  ground(c); table(c, 900);
  thermometer(c, 330, 760, 560, 0.75); thermometer(c, 760, 760, 560, 0.6, true);
  bowl(c, 660, 920, 70, COL.water);
  write(c, "30°", 380, 330, 54, RED, 7); write(c, "24°", 810, 400, 54, COL.blueDk, 7);
  for (let k = 0; k < 3; k++) { const yy = 700 + k * 50; c.beginPath(); c.moveTo(1040, yy - 10); c.quadraticCurveTo(960, yy + 20, 880, yy); c.strokeStyle = COL.blue; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); line(c, [[896, yy - 14], [878, yy], [898, yy + 12]], 6, COL.blue); }
  vapour(c, 690, 700, 90, -30, COL.blueDk, 5); vapour(c, 730, 690, 80, -20, COL.blueDk, 5);
};

export const ic_statesEvaporationAndCondensationL4 = cards("sci.states.evaporation-and-condensation.L4", [
  e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2, e2_3, e3_0, e3_1, e3_2, e3_3,
  f_e1, f_e2, f_e3, f_a1, f_a2, f_a3, f_a4, f_a5, f_p1, t_14,
]);
