import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, write, cards } from "./flatKit";

// sci.sky.solar-system.L4 · set-up cards for the crater tray and the two tumblers, then picture cards
// (flows, terms). The same child (orange top) and grown-up (blue top) on every card.

const FLOUR = "#fbf4e4", FLOURDK = "#e8dcc2", COCOA = "#6b4428", COCOADK = "#4e2f1a", TABLE = "#d9c4a0", TABLEDK = "#bfa57c", PAPER = "#fffaf0";
const num = (c: Ctx, t: string, x: number, y: number, h: number, col: string = INK, w = 5) => {
  // write() has digits only; a "." is a dot drawn here
  let cx = x;
  for (const ch of t) {
    if (ch === ".") { shape(c, () => ell(c, cx + h * 0.12, y + h * 0.95, w * 0.7, w * 0.7), col, 0); cx += h * 0.3; continue; }
    write(c, ch, cx, y, h, col, w); cx += h * (ch === " " ? 0.35 : 0.8);
  }
};
// a kitchen table: its top from y down to the card's bottom, the front edge a darker band
const table = (c: Ctx, y: number) => { c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e3d3b4"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
// folded newspaper under the tray: grey sheet with text lines
const newspaper = (c: Ctx, pts: number[][]) => {
  shape(c, () => polyP(c, pts), "#e9e6df", 5);
  c.save(); c.beginPath(); polyP(c, pts); c.clip();
  for (let i = 0; i < 9; i++) line(c, [[pts[0][0] - 40, pts[0][1] + 24 + i * 26], [pts[1][0] + 60, pts[1][1] + 24 + i * 26]], 4, "#b9b4ab");
  c.restore();
};
// a steel tray seen from the front and slightly above: top face pts (4 corners, clockwise from the back left), front face of depth dep,
// filled with flour; cocoa = fraction of the flour (from the left) dusted dark
const tray = (c: Ctx, p: number[][], dep: number, cocoa = 0) => {
  const [bl, br, fr, fl] = p;
  shadow(c, (fl[0] + fr[0]) / 2 + 30, fr[1] + dep + 8, (fr[0] - fl[0]) * 0.55, 22);
  shape(c, () => polyP(c, [fl, fr, [fr[0], fr[1] + dep], [fl[0], fl[1] + dep]]), COL.steelDk);
  shape(c, () => polyP(c, p), COL.steel);
  // the flour fills the tray up to a rim
  const inset = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const il = inset(fl, bl, 0.18), ir = inset(fr, br, 0.18), jl = inset(bl, fl, 0.14), jr = inset(br, fr, 0.14);
  const fp = [jl, jr, ir, il];
  shape(c, () => polyP(c, fp), FLOUR, 5);
  if (cocoa > 0) { c.save(); c.beginPath(); polyP(c, fp); c.clip(); c.beginPath(); polyP(c, [[jl[0], jl[1] - 5], [jl[0] + (jr[0] - jl[0]) * cocoa, jl[1] - 5], [il[0] + (ir[0] - il[0]) * cocoa, ir[1] + 5], [il[0], il[1] + 5]]); c.fillStyle = COCOA; c.fill(); c.restore(); }
  shine(c, [[fl[0] + 14, fl[1] + dep * 0.3], [fl[0] + 14, fl[1] + dep * 0.75]], 7);
  return fp;
};
// a wooden ruler lying flat, left end (x, y), length len, height h, numbered every cm
const ruler = (c: Ctx, x: number, y: number, len: number, h: number, cm: number) => {
  shadow(c, x + len / 2 + 10, y + h + 6, len / 2, 10);
  shape(c, () => rrect(c, x, y, len, h, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + 4, y + h * 0.72, len - 8, h * 0.25);
  const step = (len - 40) / (cm * 10);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cm * 10; mm++) { const tx = x + 20 + mm * step, th = mm % 10 === 0 ? h * 0.42 : mm % 5 === 0 ? h * 0.3 : h * 0.17; c.lineWidth = mm % 10 === 0 ? 3.5 : 2; c.beginPath(); c.moveTo(tx, y); c.lineTo(tx, y + th); c.stroke(); }
  for (let k = 0; k <= cm; k += cm > 10 ? 5 : 1) write(c, String(k), x + 20 + k * step * 10 - (k > 9 ? 20 : 8), y + h * 0.46, h * 0.24, INK, 3);
};
// a metre scale standing on end, its foot at (x, yb), reaching up len; numbered 0, 20 ... 100 cm from the foot
const metreScale = (c: Ctx, x: number, yb: number, len: number, w = 40) => {
  shape(c, () => rrect(c, x - w / 2, yb - len, w, len, 5), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + w * 0.2, yb - len + 4, w * 0.25, len - 8);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let cm = 0; cm <= 100; cm += 2) { const ty = yb - (cm / 100) * len, tl = cm % 20 === 0 ? w * 0.55 : cm % 10 === 0 ? w * 0.4 : w * 0.22; c.lineWidth = cm % 10 === 0 ? 3.5 : 2; c.beginPath(); c.moveTo(x - w / 2, ty); c.lineTo(x - w / 2 + tl, ty); c.stroke(); }
  for (let cm = 20; cm <= 100; cm += 20) write(c, String(cm), x + w * 0.55, yb - (cm / 100) * len - 10, 22, INK, 3.5);
};
// a glass marble: blue, a pale swirl, a highlight
const marble = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue, Math.max(3, r * 0.18));
  shade(c, () => ell(c, x, y, r, r), COL.blueDk, r * 0.3, r * 0.25);
  line(c, [[x - r * 0.5, y + r * 0.2], [x - r * 0.1, y - r * 0.4], [x + r * 0.45, y - r * 0.1]], Math.max(3, r * 0.14), WHITE);
  shape(c, () => ell(c, x - r * 0.4, y - r * 0.4, r * 0.18, r * 0.12, -0.6), WHITE, 0);
};
// a crater in cocoa-dusted flour seen from above and in front: a raised pale rim (the cocoa thrown off), a bowl inside
const crater = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx * 1.22, ry * 1.22), FLOUR, 0);
  shape(c, () => ell(c, x, y, rx * 1.22, ry * 1.22), "rgba(0,0,0,0)", 4);
  shape(c, () => ell(c, x, y, rx, ry), FLOURDK, 5);
  shade(c, () => ell(c, x, y, rx, ry), "#cdbf9f", -rx * 0.18, -ry * 0.3, 0.7);
  shape(c, () => ell(c, x, y + ry * 0.12, rx * 0.5, ry * 0.42), FLOUR, 0);
};
// a round tea strainer or sieve held by its handle: bowl centre (x, y) radius r, handle going right to the hand at (x + r + hl, y)
const sieve = (c: Ctx, x: number, y: number, r: number, hl: number) => {
  shape(c, () => rrect(c, x + r - 6, y - 12, hl + 10, 24, 10), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r * 0.42), COL.steel);
  shape(c, () => ell(c, x, y, r * 0.86, r * 0.3), "#aeb7c3", 4);
  c.save(); c.beginPath(); ell(c, x, y, r * 0.86, r * 0.3); c.clip();
  for (let k = -r; k <= r; k += 14) { line(c, [[x + k, y - r], [x + k, y + r]], 2, "#7d8794"); line(c, [[x - r, y + k * 0.35], [x + r, y + k * 0.35]], 2, "#7d8794"); }
  c.restore();
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r * 0.9, y + r * 0.8, x + r * 0.9, y + r * 0.8, x + r, y); }, "rgba(0,0,0,0)", 5);
};
const dust = (c: Ctx, x: number, y: number, w: number, h: number, col: string, seed: number, n: number) => {
  let s = seed; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < n; i++) shape(c, () => ell(c, x - w / 2 + r() * w, y + r() * h, 5 + r() * 3, 5 + r() * 3), col, 2.5);
};

// ---------------------------------------------------------------- e1 set-up: the crater tray
// 1. the tray of flour on newspaper, smoothed flat with the edge of a ruler
const e1s0 = (c: Ctx) => {
  ground(c); table(c, 560);
  newspaper(c, [[150, 600], [940, 600], [1020, 900], [60, 900]]);
  tray(c, [[250, 640], [850, 640], [900, 790], [200, 790]], 70);
  // the ruler stands on its edge across the flour, its lower edge in the flour, and sweeps left
  shape(c, () => rrect(c, 270, 650, 560, 44, 6), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(274, 680, 552, 10);
  c.strokeStyle = INK; c.lineCap = "butt"; for (let k = 0; k <= 30; k++) { c.lineWidth = k % 5 === 0 ? 3 : 2; c.beginPath(); c.moveTo(285 + k * 18, 650); c.lineTo(285 + k * 18, k % 5 === 0 ? 668 : 660); c.stroke(); }
  hand(c, 900, 672, Math.PI, 1.1, SKIN.child, CLOTH.child);
  arrow(c, [[640, 622], [330, 622]], RED, 10);
};
// 2. a thin layer of cocoa sprinkled through a tea strainer over the flour (the left half already brown)
const e1s1 = (c: Ctx) => {
  ground(c); table(c, 560);
  newspaper(c, [[150, 600], [940, 600], [1020, 900], [60, 900]]);
  tray(c, [[250, 640], [850, 640], [900, 790], [200, 790]], 70, 0.62);
  sieve(c, 540, 330, 120, 150);
  hand(c, 880, 330, Math.PI, 1.1, SKIN.child, CLOTH.child);
  // cocoa inside the strainer and falling from it
  dust(c, 540, 310, 140, 20, COCOA, 3, 18);
  dust(c, 540, 400, 170, 260, COCOA, 5, 30);
  arrow(c, [[640, 250], [680, 230], [720, 250]], RED, 8); arrow(c, [[460, 250], [420, 230], [380, 250]], RED, 8);
};
// 3. the child holds the marble at the 40 cm mark of a metre scale standing in the tray
const e1s2 = (c: Ctx) => {
  ground(c); floor(c, 1000);
  const kid = person(c, 190, 1000, 620, { reachR: [450, 568], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  table(c, 800);
  tray(c, [[400, 700], [1000, 700], [1040, 790], [360, 790]], 50);
  metreScale(c, 560, 775, 480, 40);
  marble(c, kid.handR[0] + 14, kid.handR[1] - 8, 24);
  arrow(c, [[450, 620], [450, 740]], RED, 8);
};
// 4. a ruler laid across the crater, rim to rim, with the marble sitting at the bottom
const e1s3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COCOA; c.fillRect(0, 0, D, D);
  dust(c, 540, 40, 1000, 1000, COCOADK, 11, 40);
  crater(c, 540, 620, 300, 150);
  shadow(c, 560, 700, 50, 14); marble(c, 540, 680, 40);
  ruler(c, 110, 500, 860, 90, 20);
  // where the ruler crosses the two rims: red ticks, and the rim-to-rim span under them
  line(c, [[246, 480], [246, 600]], 7, RED); line(c, [[834, 480], [834, 600]], 7, RED);
  arrow(c, [[540, 470], [262, 470]], RED, 7); arrow(c, [[540, 470], [818, 470]], RED, 7);
};
// 5. three overlapping craters, the smallest cutting into the biggest, and fresh flour sifted over from above
const e1s4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COCOA; c.fillRect(0, 0, D, D);
  dust(c, 540, 40, 1000, 1000, COCOADK, 11, 40);
  crater(c, 430, 700, 250, 120);
  crater(c, 690, 600, 170, 82);
  crater(c, 250, 600, 100, 50);
  sieve(c, 540, 230, 140, 160);
  hand(c, 900, 230, Math.PI, 1.1, SKIN.child, CLOTH.child);
  dust(c, 540, 210, 170, 24, FLOUR, 21, 24);
  dust(c, 540, 300, 240, 260, FLOUR, 23, 40);
};

// ---------------------------------------------------------------- e2 set-up: two tumblers in the sun
const ICE = "#e4f3fc", ICEDK = "#b8dcf0";
const iceCube = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18), ICE, 4);
  shade(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.18), ICEDK, s * 0.25, s * 0.2, 0.8);
  line(c, [[-s * 0.3, -s * 0.3], [-s * 0.3, s * 0.1]], 4, WHITE);
  c.restore();
};
// a square of black paper lying on the table under a tumbler whose bottom centre is (x, y)
const blackPaper = (c: Ctx, x: number, y: number, w: number) => shape(c, () => polyP(c, [[x - w * 0.8, y - w * 0.3], [x + w * 0.8, y - w * 0.3], [x + w, y + w * 0.12], [x - w, y + w * 0.12]]), COL.black, 5);
// a tumbler, bottom centre (x, y): ice = number of cubes at the bottom, water = fill 0..1, film = cling film and a rubber band,
// floating = a small piece of ice at the water surface
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, o: { ice?: number; water?: number; film?: boolean; floating?: boolean } = {}) => {
  const ice = o.ice ?? 0, water = o.water ?? 0;
  if (ice >= 1) iceCube(c, x - w * 0.2, y - w * 0.2, w * 0.3, 0.15);
  if (ice >= 2) iceCube(c, x + w * 0.2, y - w * 0.19, w * 0.3, -0.2);
  if (ice >= 3) iceCube(c, x, y - w * 0.46, w * 0.3, 0.35);
  glass(c, x, y, w, h, water);
  if (o.floating) iceCube(c, x + w * 0.05, y - h * water - w * 0.03, w * 0.18, 0.2);
  if (o.film) {
    shape(c, () => ell(c, x, y - h - 4, w * 0.56, w * 0.13), "rgba(240,248,255,0.8)", 4);
    shine(c, [[x - w * 0.3, y - h - 8], [x + w * 0.1, y - h - 12]], 6);
    c.beginPath(); c.ellipse(x, y - h + 26, w * 0.52, w * 0.1, 0, 0, Math.PI * 2); c.strokeStyle = COL.orange; c.lineWidth = 9; c.stroke();
    c.beginPath(); c.ellipse(x, y - h + 26, w * 0.52, w * 0.1, 0, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 2; c.stroke();
  }
};
// 1. two identical tumblers on black paper, three ice cubes in each
const e2s0 = (c: Ctx) => {
  ground(c); table(c, 560);
  for (const x of [330, 750]) { blackPaper(c, x, 820, 190); tumbler(c, x, 810, 220, 320, { ice: 3 }); }
};
// 2. one tumbler stretched over with cling film and a rubber band, the other open
const e2s1 = (c: Ctx) => {
  ground(c); table(c, 560);
  blackPaper(c, 330, 820, 190); tumbler(c, 330, 810, 220, 320, { ice: 3 });
  blackPaper(c, 750, 820, 190); tumbler(c, 750, 810, 220, 320, { ice: 3, film: true });
};
// a window with the sun in it: frame from (x, y) of size w x h
const sunWindow = (c: Ctx, x: number, y: number, w: number, h: number, sx: number, sy: number, sr: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), COL.sky, 8);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 10); c.clip();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[sx + Math.cos(a) * sr * 1.3, sy + Math.sin(a) * sr * 1.3], [sx + Math.cos(a) * sr * 1.9, sy + Math.sin(a) * sr * 1.9]], 8, COL.yellow); }
  shape(c, () => ell(c, sx, sy, sr, sr), COL.yellow, 6);
  c.restore();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 8); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 8);
};
// a phone lying on its back with a timer on the screen (minutes and seconds)
const phoneTimer = (c: Ctx, x: number, y: number, w: number, h: number, mins: string) => {
  shadow(c, x + w / 2 + 8, y + h + 6, w * 0.55, 10);
  shape(c, () => rrect(c, x, y, w, h, 16), COL.black, 6);
  shape(c, () => rrect(c, x + 10, y + 16, w - 20, h - 32, 8), "#1c2b3a", 3);
  write(c, mins, x + 22, y + h * 0.36, h * 0.22, "#c9f06b", 5);
  shape(c, () => ell(c, x + 22 + h * 0.37, y + h * 0.44, 4, 4), "#c9f06b", 0); shape(c, () => ell(c, x + 22 + h * 0.37, y + h * 0.52, 4, 4), "#c9f06b", 0);
  write(c, "00", x + 22 + h * 0.46, y + h * 0.36, h * 0.22, "#c9f06b", 5);
};
// an open notebook lying flat, top left (x, y)
const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 10, y + h + 6, w * 0.55, 10);
  shape(c, () => rrect(c, x, y, w, h, 8), PAPER, 5);
  for (let k = 1; k < 5; k++) line(c, [[x + 20, y + (h * k) / 5], [x + w - 20, y + (h * k) / 5]], 3, "#b9c7d6");
  line(c, [[x + 44, y + 6], [x + 44, y + h - 6]], 3, RED);
};
// 3. both tumblers on a sunny windowsill, a phone timer and a notebook beside them
const e2s2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4e7cf"; c.fillRect(0, 0, D, D);
  sunWindow(c, 220, 60, 640, 540, 400, 200, 70);
  table(c, 620);
  tumbler(c, 440, 700, 170, 250, { ice: 3 });
  tumbler(c, 660, 700, 170, 250, { ice: 3, film: true });
  phoneTimer(c, 100, 720, 190, 300, "05");
  notebook(c, 760, 740, 260, 200);
};
// 4. after a while: the open tumbler has only a puddle, the covered one still has a bit of ice floating
const e2s3 = (c: Ctx) => {
  ground(c); table(c, 560);
  blackPaper(c, 330, 820, 190); tumbler(c, 330, 810, 220, 320, { water: 0.26 });
  blackPaper(c, 750, 820, 190); tumbler(c, 750, 810, 220, 320, { water: 0.2, film: true, floating: true });
};

// ---------------------------------------------------------------- flow pictures
// Crater Tray: the child drops a marble into the flour while the grown-up holds the metre scale
const flowE1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4e7cf"; c.fillRect(0, 0, D, 720);
  const kid = person(c, 250, 1000, 620, { reachR: [440, 520], armL: [Math.PI * 0.56, Math.PI * 0.5] });
  const ad = person(c, 860, 1000, 760, { adult: true, reachL: [700, 470], armR: [Math.PI * 0.46, Math.PI * 0.5] });
  table(c, 720);
  const fp = tray(c, [[380, 640], [900, 640], [940, 720], [340, 720]], 40, 1);
  crater(c, 600, 690, 50, 22);
  metreScale(c, 700, 700, 400, 36);
  // the grown-up's hand closes round the scale again, over it
  shape(c, () => ell(c, ad.handL[0], ad.handL[1], 30, 24), SKIN.adult, 5);
  marble(c, kid.handR[0] + 12, kid.handR[1] - 8, 22);
  arrow(c, [[452, 560], [452, 660]], RED, 8);
  void fp;
};
// Two Tumblers in the Sun: the child watches both tumblers on the windowsill with a notebook
const flowE2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4e7cf"; c.fillRect(0, 0, D, D); floor(c, 1000);
  sunWindow(c, 430, 60, 580, 520, 560, 180, 64);
  // the sill: a shelf under the window
  shape(c, () => polyP(c, [[400, 640], [1080, 640], [1080, 700], [400, 700]]), COL.wood, 6);
  tumbler(c, 620, 642, 150, 230, { ice: 3 });
  tumbler(c, 860, 642, 150, 230, { ice: 3, film: true });
  // the child holds the notebook low in front with both hands
  const kid = person(c, 230, 1000, 640, { reachL: [130, 790], reachR: [330, 790] });
  notebook(c, 120, 740, 220, 150);
  for (const hd of [kid.handL, kid.handR]) shape(c, () => ell(c, hd[0], hd[1], 26, 20), SKIN.child, 5);
};
// Walk the Solar System: the Sun disc at one end of the corridor, planet slips on the floor, the child counting steps
const flowA1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4e7cf"; c.fillRect(0, 0, D, D); floor(c, 520);
  // the Sun disc leaning on the wall at the left end
  shadow(c, 150, 700, 90, 16);
  shape(c, () => ell(c, 140, 610, 80, 80), COL.yellow);
  shade(c, () => ell(c, 140, 610, 80, 80), COL.orange, 18, 14, 0.5);
  // the measuring tape runs along the floor from the Sun
  line(c, [[220, 690], [1060, 900]], 14, INK); line(c, [[220, 690], [1060, 900]], 8, COL.yellow);
  // slips of paper with a seed each: Mercury, Venus, the Earth
  const slip = (x: number, y: number, col: string, r: number) => { shape(c, () => polyP(c, [[x - 40, y - 18], [x + 40, y - 18], [x + 48, y + 18], [x - 48, y + 18]]), PAPER, 4); shape(c, () => ell(c, x, y - 2, r, r), col, 2.5); };
  slip(330, 740, COL.grey, 5); slip(470, 790, COL.yellow, 7); slip(630, 850, COL.blue, 7);
  person(c, 840, 990, 560, {});
};
// a planet: a flat ball with the shade side to the lower right, features drawn by fx inside a clip
const planet = (c: Ctx, x: number, y: number, r: number, col: string, dk: string, fx?: () => void) => {
  shape(c, () => ell(c, x, y, r, r), col, Math.max(4, r * 0.05));
  if (fx) { c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); fx(); c.restore(); }
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.28, r * 0.22, 0.45);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", Math.max(4, r * 0.05));
};
const stripes = (c: Ctx, x: number, y: number, r: number, rows: [number, number, string][]) => rows.forEach(([v, t, col]) => shape(c, () => rrect(c, x - r, y + v * r, r * 2, t * r, 4), col, 0));
const earthFace = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r * 0.6, y - r * 0.7); c.bezierCurveTo(x - r * 0.1, y - r * 0.9, x + r * 0.2, y - r * 0.3, x - r * 0.2, y - r * 0.1); c.bezierCurveTo(x - r * 0.5, y, x - r * 0.9, y - r * 0.3, x - r * 0.6, y - r * 0.7); c.closePath(); }, COL.green, 0);
  shape(c, () => { c.moveTo(x + r * 0.1, y + r * 0.1); c.bezierCurveTo(x + r * 0.6, y, x + r * 0.7, y + r * 0.6, x + r * 0.2, y + r * 0.8); c.bezierCurveTo(x - r * 0.1, y + r * 0.6, x - r * 0.1, y + r * 0.3, x + r * 0.1, y + r * 0.1); c.closePath(); }, COL.green, 0);
  for (const [u, v, w] of [[-0.3, 0.4, 0.5], [0.4, -0.5, 0.4], [0.1, -0.1, 0.35]]) shape(c, () => ell(c, x + u * r, y + v * r, w * r, w * r * 0.3), WHITE, 0);
};
// the Earth cut open: inner core, outer core, mantle, thin crust and ocean skin; sizes true to the Earth
const earthCut = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.blue);
  shape(c, () => ell(c, x, y, r * 0.97, r * 0.97), "#a8723f", 4);
  shape(c, () => ell(c, x, y, r * 0.55, r * 0.55), COL.red, 4);
  shape(c, () => ell(c, x, y, r * 0.19, r * 0.19), COL.yellow, 4);
};
// Planet Data Detective: the table in the notebook (planet, distance in AU, year in Earth years) and a calculator
const flowA2 = (c: Ctx) => {
  ground(c); table(c, 120);
  shadow(c, 470, 920, 330, 16);
  shape(c, () => rrect(c, 130, 170, 650, 740, 10), PAPER, 6);
  for (let k = 0; k < 9; k++) shape(c, () => ell(c, 130, 215 + k * 85, 12, 12), COL.steelDk, 4);
  const cols = [190, 320, 540, 760], rows = [250, 370, 490, 610, 730, 850];
  line(c, [[cols[0], rows[0]], [cols[3] - 20, rows[0]]], 5); for (let i = 1; i < 6; i++) line(c, [[cols[0], rows[i]], [cols[3] - 20, rows[i]]], 3, "#b9c7d6");
  line(c, [[cols[1], rows[0]], [cols[1], rows[5]]], 4); line(c, [[cols[2], rows[0]], [cols[2], rows[5]]], 4);
  // header: a ruler stroke for distance, a little orbit for a year
  line(c, [[cols[1] + 30, 205], [cols[2] - 30, 205]], 6); for (let k = 0; k <= 4; k++) line(c, [[cols[1] + 30 + k * 40, 205], [cols[1] + 30 + k * 40, 222]], 4);
  c.beginPath(); c.ellipse(cols[2] + 100, 205, 60, 22, 0, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shape(c, () => ell(c, cols[2] + 100, 205, 11, 11), COL.yellow, 3); shape(c, () => ell(c, cols[2] + 160, 205, 7, 7), COL.blue, 2.5);
  const data: [string, string, (y: number) => void][] = [
    ["1", "1", (y) => planet(c, 255, y, 34, COL.blue, COL.blueDk, () => earthFace(c, 255, y, 34))],
    ["1.52", "1.88", (y) => planet(c, 255, y, 26, COL.red, "#a63a26")],
    ["5.2", "11.86", (y) => planet(c, 255, y, 42, "#f1d9a6", COL.brown, () => stripes(c, 255, y, 42, [[-0.5, 0.2, COL.orange], [0.1, 0.18, COL.brown], [0.55, 0.14, COL.orange]]))],
    ["9.54", "29.46", (y) => { c.beginPath(); c.ellipse(255, y, 62, 16, -0.25, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 9; c.stroke(); planet(c, 255, y, 36, COL.wood, COL.woodDk); c.save(); c.beginPath(); c.rect(190, y + 2, 130, 40); c.clip(); c.beginPath(); c.ellipse(255, y, 62, 16, -0.25, 0, Math.PI * 2); c.strokeStyle = "#d9c4a0"; c.lineWidth = 7; c.stroke(); c.restore(); }],
  ];
  data.forEach(([d, yr, draw], i) => { const y = (rows[i + 1] + rows[i + 2]) / 2; draw(y); num(c, d, cols[1] + 24, y - 30, 56); num(c, yr, cols[2] + 24, y - 30, 56); });
  // a phone calculator standing at the right
  shadow(c, 930, 930, 110, 14);
  shape(c, () => rrect(c, 820, 330, 220, 590, 20), COL.black, 6);
  shape(c, () => rrect(c, 838, 350, 184, 110, 8), "#1c2b3a", 3);
  num(c, "3.51", 850, 380, 50, "#c9f06b", 5);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 842 + k * 62, 486 + r * 104, 52, 80, 10), r === 3 && k === 2 ? COL.orange : "#5a6578", 3);
};
const closedEyes = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.15, hy = y - h * 0.4 - h * 0.27 - head * 1.12;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.38, hy + head * 0.16, head * 0.2, head * 0.24), SKIN.child, 0); c.beginPath(); c.arc(x + s * head * 0.38, hy + head * 0.1, head * 0.15, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
const cushion = (c: Ctx, x: number, y: number, col: string) => { shadow(c, x + 10, y + 36, 70, 12); shape(c, () => rrect(c, x - 70, y - 34, 140, 70, 22), col); shade(c, () => rrect(c, x - 70, y - 34, 140, 70, 22), INK, 14, 10, 0.18); };
// Drive a Rover: the grown-up at Mission Control points and calls one command, the child-rover steps with eyes closed
const flowA3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#f4e7cf"; c.fillRect(0, 0, D, D); floor(c, 520);
  [[420, 640, COL.teal], [560, 900, COL.pink], [880, 620, COL.purple], [960, 840, COL.green], [330, 880, COL.yellow], [700, 580, COL.orange]].forEach(([x, y, col]) => cushion(c, x as number, y as number, col as string));
  // the spoon at the far end
  shape(c, () => rrect(c, 950, 700, 100, 14, 7), COL.steel, 4); shape(c, () => ell(c, 1040, 707, 26, 16), COL.steel, 4);
  person(c, 170, 1000, 760, { adult: true, reachR: [430, 560], armL: [Math.PI * 0.56, Math.PI * 0.5] });
  // three speech bumps from the grown-up: one command
  for (const [dx, r] of [[0, 8], [36, 11], [80, 14]]) shape(c, () => ell(c, 300 + dx, 330 - dx * 0.5, r, r), WHITE, 3);
  person(c, 720, 1000, 600, {});
  closedEyes(c, 720, 1000, 600);
  arrow(c, [[800, 950], [920, 950]], RED, 9);
};
// Planet in a Jar: the settled jar, nuts at the bottom, then sand, water and oil, beside the Earth cut open
const flowA4 = (c: Ctx) => {
  ground(c); table(c, 600);
  const jx = 370, top = 290, bot = 880, w = 300;
  shadow(c, jx + 30, bot + 8, w * 0.6, 20);
  const body = () => rrect(c, jx - w / 2, top, w, bot - top, 40);
  shape(c, body, "rgba(214,236,250,0.4)", 0);
  const layer = (y0: number, y1: number, col: string) => { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = col; c.fillRect(jx - w / 2, y0, w, y1 - y0); c.restore(); };
  layer(330, 460, "rgba(243,207,90,0.85)"); layer(460, 690, COL.water); layer(690, 780, "#d9b26a"); layer(780, bot, "#a9b2bd");
  c.save(); c.beginPath(); body(); c.clip();
  for (let k = 0; k < 14; k++) { const x = jx - 120 + (k % 7) * 40 + (k > 6 ? 20 : 0), y = 810 + Math.floor(k / 7) * 42; shape(c, () => { for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; i ? c.lineTo(x + Math.cos(a) * 20, y + Math.sin(a) * 20) : c.moveTo(x + 20, y); } c.closePath(); }, COL.steelDk, 3); shape(c, () => ell(c, x, y, 7, 7), "#6f7a88", 2); }
  for (const yy of [460, 690, 780]) line(c, [[jx - w / 2, yy], [jx + w / 2, yy]], 3);
  c.restore();
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[jx - w * 0.36, top + 60], [jx - w * 0.36, bot - 80]], 8);
  shape(c, () => rrect(c, jx - w * 0.42, top - 44, w * 0.84, 56, 10), COL.red, 6);
  // the Earth cut open, its layers in the same order: iron at the middle, rock, water, air
  shape(c, () => ell(c, 800, 560, 232, 232), "rgba(191,224,245,0.6)", 4);
  earthCut(c, 800, 560, 200);
};
// Cut-Open Planets: the dough Earth cut in half beside a much bigger dough Jupiter, also cut open, and the ruler
const flowP1 = (c: Ctx) => {
  ground(c); table(c, 420);
  shadow(c, 330, 800, 190, 24);
  earthCut(c, 330, 640, 170);
  shadow(c, 800, 840, 260, 30);
  shape(c, () => ell(c, 790, 600, 245, 245), "#f1d9a6");
  c.save(); c.beginPath(); ell(c, 790, 600, 245, 245); c.clip();
  stripes(c, 790, 600, 245, [[-0.85, 0.1, COL.orange], [-0.55, 0.14, COL.brown], [-0.2, 0.1, COL.orange], [0.15, 0.16, COL.brown], [0.55, 0.12, COL.orange], [0.85, 0.1, COL.brown]]);
  c.restore();
  // the cut face: paler and paler gas going in, a small fuzzy core
  shape(c, () => ell(c, 790, 600, 180, 180), "#f6e6c4", 4);
  shape(c, () => ell(c, 790, 600, 115, 115), "#f4c98b", 3);
  shape(c, () => ell(c, 790, 600, 40, 40), "#c98f55", 3);
  shape(c, () => ell(c, 790, 600, 245, 245), "rgba(0,0,0,0)", 6);
  ruler(c, 100, 880, 480, 70, 10);
  // the plastic knife
  shape(c, () => polyP(c, [[660, 920], [900, 900], [1000, 905], [1000, 935], [900, 950], [660, 950]]), WHITE, 5);
};

// ---------------------------------------------------------------- term pictures
// Crater: a round crater with a raised rim and long pale rays of thrown-out material
const termCrater = (c: Ctx) => {
  ground(c, "#8e8c92");
  let s = 17; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 40; i++) { const x = r() * D, y = r() * D, rr = 10 + r() * 22; if (Math.hypot(x - 540, y - 560) > 330) { shape(c, () => ell(c, x, y, rr, rr), "#7c7a81", 3); shape(c, () => ell(c, x + rr * 0.1, y + rr * 0.1, rr * 0.55, rr * 0.55), "#6a6870", 0); } }
  for (let k = 0; k < 22; k++) { const a = (k / 22) * Math.PI * 2 + 0.2, len = 330 + ((k * 37) % 5) * 60, w0 = 26 + ((k * 13) % 3) * 8; shape(c, () => polyP(c, [[540 + Math.cos(a - 0.06) * 270, 560 + Math.sin(a - 0.06) * 270], [540 + Math.cos(a) * len, 560 + Math.sin(a) * len], [540 + Math.cos(a + 0.06) * 270, 560 + Math.sin(a + 0.06) * 270]]), "#d9d7dd", 0); void w0; }
  shape(c, () => ell(c, 540, 560, 290, 290), "#c9c7ce");
  shape(c, () => ell(c, 540, 560, 220, 220), "#6d6b73", 5);
  shade(c, () => ell(c, 540, 560, 220, 220), "#4d4b53", -50, -70, 0.6);
  shape(c, () => ell(c, 540, 600, 95, 60), "#7f7d85", 0);
};
// Gas giant: striped Jupiter and ringed Saturn, far bigger than the tiny Earth beside them
const termGasGiant = (c: Ctx) => {
  ground(c, "#232a48");
  let s = 5; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 60; i++) shape(c, () => ell(c, r() * D, r() * D, 3, 3), WHITE, 0);
  planet(c, 380, 520, 240, "#f1d9a6", COL.brown, () => {
    stripes(c, 380, 520, 240, [[-0.8, 0.12, COL.orange], [-0.5, 0.16, COL.brown], [-0.15, 0.1, COL.orange], [0.15, 0.18, COL.brown], [0.55, 0.12, COL.orange], [0.82, 0.1, COL.brown]]);
    shape(c, () => ell(c, 470, 610, 52, 30), COL.red, 4);
  });
  // Saturn: the back of the ring, the planet, the front of the ring
  const sx = 820, sy = 360, sr = 130;
  const ring = (clipTop: boolean) => { c.save(); c.beginPath(); c.rect(sx - 300, clipTop ? sy - 300 : sy, 600, 300); c.clip(); c.beginPath(); c.ellipse(sx, sy, sr * 1.9, sr * 0.45, -0.2, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 34; c.stroke(); c.beginPath(); c.ellipse(sx, sy, sr * 1.9, sr * 0.45, -0.2, 0, Math.PI * 2); c.strokeStyle = "#e9d6a8"; c.lineWidth = 24; c.stroke(); c.beginPath(); c.ellipse(sx, sy, sr * 1.9, sr * 0.45, -0.2, 0, Math.PI * 2); c.strokeStyle = COL.woodDk; c.lineWidth = 4; c.stroke(); c.restore(); };
  ring(true);
  planet(c, sx, sy, sr, COL.wood, COL.woodDk, () => stripes(c, sx, sy, sr, [[-0.5, 0.12, "#e9c66a"], [0.1, 0.1, "#e9c66a"], [0.5, 0.1, "#d9a84a"]]));
  ring(false);
  planet(c, 820, 800, 24, COL.blue, COL.blueDk, () => earthFace(c, 820, 800, 24));
};
// Rocky planet: the four small rocky planets side by side, Mercury, Venus, the Earth and Mars
const termRocky = (c: Ctx) => {
  ground(c, "#232a48");
  let s = 9; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 60; i++) shape(c, () => ell(c, r() * D, r() * D, 3, 3), WHITE, 0);
  planet(c, 120, 540, 52, COL.grey, COL.greyDk, () => { for (const [u, v, w] of [[-0.3, -0.2, 0.22], [0.3, 0.3, 0.18], [0.2, -0.5, 0.14], [-0.4, 0.5, 0.12]]) shape(c, () => ell(c, 120 + u * 52, 540 + v * 52, w * 52, w * 52), COL.greyDk, 2.5); });
  planet(c, 350, 540, 118, "#f0d27a", "#c9a44a", () => { for (const [u, v, w] of [[-0.4, -0.3, 0.5], [0.3, 0.1, 0.55], [-0.2, 0.5, 0.45]]) shape(c, () => ell(c, 350 + u * 118, 540 + v * 118, w * 118, w * 118 * 0.35, 0.2), "#f8e6b0", 0); });
  planet(c, 650, 540, 128, COL.blue, COL.blueDk, () => earthFace(c, 650, 540, 128));
  planet(c, 930, 540, 68, "#d85a3a", "#a63a26", () => { shape(c, () => ell(c, 930, 480, 30, 12), WHITE, 0); shape(c, () => ell(c, 905, 560, 22, 14), "#a63a26", 0); });
};

export const ic_skySolarSystemL4 = cards("sci.sky.solar-system.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, termCrater, termGasGiant, termRocky,
]);
