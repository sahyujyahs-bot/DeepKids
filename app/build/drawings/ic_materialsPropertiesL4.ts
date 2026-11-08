import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, glass, hand, person, write, cards } from "./flatKit";

// PROPERTIES OF MATERIALS L4 · why paper tears straight one way and crooked the other.
// Set-up cards for the three experiments (tear and droop test, the tailor's trick, bend until it snaps),
// then one picture for each experiment, activity, project and game, and the Grain term.

const NEWS = "#efeae0", PRINT = "#8a8578", PENCIL = "#5a5650", CLOTHC = "#dbe9f5", THREAD = "#8fb3d3";
const CARD = "#c9a56b", CARDDK = "#a9844d", WIRE = "#aeb6c2", WIREDK = "#7f8a99", BAG = "#e6eef7", BAGDK = "#c3d3e6";
const PI = Math.PI;

// ---------------------------------------------------------------- small things
// letters A and X as strokes (write() has no letters)
const letter = (c: Ctx, ch: "A" | "X", x: number, y: number, h: number, col = INK, w = 7) => {
  if (ch === "A") { line(c, [[x, y + h], [x + h * 0.32, y], [x + h * 0.64, y + h]], w, col); line(c, [[x + h * 0.14, y + h * 0.62], [x + h * 0.5, y + h * 0.62]], w, col); }
  else { line(c, [[x, y], [x + h * 0.64, y + h]], w, col); line(c, [[x + h * 0.64, y], [x, y + h]], w, col); }
};
// a stroked wire: ink outline, steel core. Used for paper clips, straightened wire, clip handles
const wire = (c: Ctx, pts: number[][], w = 9) => { line(c, pts, w + 7, INK); line(c, pts, w, WIRE); };
const wirePath = (c: Ctx, path: () => void, w = 9) => { c.beginPath(); path(); c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = INK; c.lineWidth = w + 7; c.stroke(); c.strokeStyle = WIRE; c.lineWidth = w; c.stroke(); };
// a paper clip lying flat, centre (x, y), length L, width W
const paperclip = (c: Ctx, x: number, y: number, L: number, W: number, w = 9) => {
  const a = L / 2, b = W / 2, d = W * 0.18;
  wirePath(c, () => {
    c.moveTo(x + a - 2 * b, y - b + 2 * d);
    c.lineTo(x - a + b + d, y - b + 2 * d); c.arc(x - a + b + d, y, b - 2 * d, -PI / 2, PI / 2, true);
    c.lineTo(x + a - (b - d), y + b - 2 * d); c.arc(x + a - (b - d), y - d, b - d, PI / 2, -PI / 2, true);
    c.lineTo(x - a + b, y - b); c.arc(x - a + b, y, b, -PI / 2, PI / 2, true);
    c.lineTo(x + a - b, y + b);
  }, w);
};
// the print on a newspaper: a headline band and columns of grey text lines
const print = (c: Ctx, x: number, y: number, w: number, h: number) => {
  c.fillStyle = PRINT; c.globalAlpha = 0.85; c.fillRect(x + w * 0.08, y + h * 0.05, w * 0.84, h * 0.045); c.globalAlpha = 1;
  const cols = Math.max(1, Math.round(w / 120)), cw = (w * 0.84) / cols;
  c.strokeStyle = PRINT; c.lineWidth = 3; c.globalAlpha = 0.55; c.lineCap = "butt";
  for (let k = 0; k < cols; k++) { const cx = x + w * 0.08 + k * cw + cw * 0.08; for (let ly = y + h * 0.14; ly < y + h * 0.95; ly += 11) { c.beginPath(); c.moveTo(cx, ly); c.lineTo(cx + cw * 0.8, ly); c.stroke(); } }
  c.globalAlpha = 1; c.lineCap = "round";
};
const newsSheet = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 14); shape(c, () => c.rect(x, y, w, h), NEWS, 6); print(c, x, y, w, h); };
// a newspaper sheet torn into two pieces, pulled apart by gap. vertical: the tear runs top to bottom.
// straight: the tear runs true, else it wanders and rips.
const tornNews = (c: Ctx, x: number, y: number, w: number, h: number, vertical: boolean, straight: boolean, seed: number, gap = 18) => {
  const r = rnd(seed), n = 24, pts: number[][] = [], len = vertical ? h : w, mid = (vertical ? w : h) / 2;
  let wander = 0;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    if (straight) wander = (r() - 0.5) * 6;
    else { wander += (r() - 0.5) * 60; wander = Math.max(-mid * 0.45, Math.min(mid * 0.45, wander)); }
    const across = mid + wander + (straight ? 0 : (r() - 0.5) * 24);
    pts.push(vertical ? [x + across, y + t * len] : [x + t * len, y + across]);
  }
  shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 14);
  const p1 = () => { if (vertical) { c.moveTo(x, y); pts.forEach((p) => c.lineTo(p[0] - gap / 2, p[1])); c.lineTo(x, y + h); } else { c.moveTo(x, y); c.lineTo(x + w, y); [...pts].reverse().forEach((p) => c.lineTo(p[0], p[1] - gap / 2)); } c.closePath(); };
  const p2 = () => { if (vertical) { c.moveTo(x + w, y); pts.forEach((p) => c.lineTo(p[0] + gap / 2, p[1])); c.lineTo(x + w, y + h); } else { c.moveTo(x, y + h); pts.forEach((p) => c.lineTo(p[0], p[1] + gap / 2)); c.lineTo(x + w, y + h); } c.closePath(); };
  for (const p of [p1, p2]) { shape(c, p, NEWS, 6); c.save(); c.beginPath(); p(); c.clip(); print(c, x, y, w, h); c.restore(); }
};
const pencil = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, len / 2 + 6, 22, len / 2, 10);
  shape(c, () => rrect(c, 0, -14, len - 50, 28, 4), COL.yellow); shade(c, () => rrect(c, 0, -14, len - 50, 28, 4), COL.orange, 0, 9, 0.5);
  shape(c, () => polyP(c, [[len - 52, -14], [len - 10, -4], [len - 10, 4], [len - 52, 14]]), "#e8c89a", 5);
  shape(c, () => polyP(c, [[len - 12, -5], [len, 0], [len - 12, 5]]), INK, 2);
  shape(c, () => rrect(c, -6, -14, 32, 28, 5), COL.pink, 5); shape(c, () => rrect(c, 22, -16, 18, 32, 3), COL.steelDk, 4);
  c.restore();
};
const pencilArrow = (c: Ctx, pts: number[][]) => arrow(c, pts, PENCIL, 7);
// scissors with the pivot at (x, y), blades pointing along an
const scissors = (c: Ctx, x: number, y: number, an: number, open = 0.3) => {
  c.save(); c.translate(x, y); c.rotate(an);
  for (const s of [-1, 1]) {
    c.save(); c.rotate(s * open);
    shape(c, () => polyP(c, [[0, -s * 10], [190, -s * 3], [205, 0], [0, s * 9]]), COL.steel, 5);
    shape(c, () => ell(c, -85, s * 6, 60, 34), RED, 5); shape(c, () => ell(c, -85, s * 6, 40, 17), BG, 4);
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 11, 11), COL.steelDk, 4);
  c.restore();
};
// a table seen from the side: a slab from x0 to x1 with its top at y, one leg
const tableSide = (c: Ctx, x0: number, x1: number, y: number) => {
  shape(c, () => c.rect(x0 + 50, y + 80, 56, 1080 - y - 80), COL.woodDk, 6);
  shape(c, () => c.rect(x0, y, x1 - x0, 34), COL.wood, 6); shape(c, () => c.rect(x0, y + 34, x1 - x0, 48), COL.woodDk, 6);
};
// a closed book seen from the side (lying flat), bottom-left at (x, y+h)
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => {
  shape(c, () => rrect(c, x, y, w, h, 6), col); shade(c, () => rrect(c, x, y, w, h, 6), INK, 0, h * 0.55, 0.25);
  shape(c, () => c.rect(x + 14, y + h * 0.28, w - 20, h * 0.45), COL.paper, 3);
  c.strokeStyle = COL.grey; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x + 16, y + h * 0.28 + k * h * 0.11); c.lineTo(x + w - 8, y + h * 0.28 + k * h * 0.11); c.stroke(); }
};
// a paper strip drawn as a thick line along pts
const paperStrip = (c: Ctx, pts: number[][], w: number, col = COL.paper) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };
// a strip from (ex, ey) sticking out L and drooping by drop, as points
const droopPts = (ex: number, ey: number, L: number, drop: number) => { const p: number[][] = []; for (let i = 0; i <= 16; i++) { const t = i / 16; p.push([ex + L * t, ey + drop * t * t]); } return p; };
// a ruler standing upright: centre line x, top, length; zero at zeroY, px per cm = k
const rulerV = (c: Ctx, x: number, top: number, len: number, zeroY: number, k: number, w = 56) => {
  shadow(c, x + 8, top + len + 6, w * 0.55, 10);
  shape(c, () => c.rect(x - w / 2, top, w, len), COL.wood, 6); c.fillStyle = COL.woodDk; c.fillRect(x + w / 2 - 12, top + 3, 9, len - 6);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; zeroY + mm * k / 10 < top + len - 8; mm++) { const yy = zeroY + (mm * k) / 10; if (yy < top + 8) continue; const l = mm % 10 === 0 ? 24 : mm % 5 === 0 ? 16 : 9; c.lineWidth = mm % 10 === 0 ? 3.5 : 2; c.beginPath(); c.moveTo(x - w / 2, yy); c.lineTo(x - w / 2 + l, yy); c.stroke(); if (mm % 10 === 0 && mm > 0) write(c, String(mm / 10), x - w / 2 + 28, yy - 9, 18, INK, 3.5); }
  c.lineCap = "round";
};
// a square of woven cotton with its threads showing; top-left (x, y), side s
const clothSq = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + s / 2 + 12, y + s + 8, s / 2, 16);
  shape(c, () => rrect(c, x, y, s, s, 6), CLOTHC, 6);
  c.save(); c.beginPath(); c.rect(x, y, s, s); c.clip(); c.strokeStyle = THREAD; c.lineWidth = 2.5; c.globalAlpha = 0.85;
  for (let k = 14; k < s; k += 28) { c.beginPath(); c.moveTo(x + k, y); c.lineTo(x + k, y + s); c.stroke(); c.beginPath(); c.moveTo(x, y + k); c.lineTo(x + s, y + k); c.stroke(); }
  c.globalAlpha = 1; c.restore();
};
// a hanging cloth strip from (x, top) to (x, bot), width w, with threads
const clothStrip = (c: Ctx, x: number, top: number, bot: number, w: number) => {
  shape(c, () => c.rect(x - w / 2, top, w, bot - top), CLOTHC, 6);
  c.save(); c.beginPath(); c.rect(x - w / 2, top, w, bot - top); c.clip(); c.strokeStyle = THREAD; c.lineWidth = 2; c.globalAlpha = 0.8;
  for (let k = 10; k < w; k += 20) { c.beginPath(); c.moveTo(x - w / 2 + k, top); c.lineTo(x - w / 2 + k, bot); c.stroke(); }
  for (let yy = top + 10; yy < bot; yy += 20) { c.beginPath(); c.moveTo(x - w / 2, yy); c.lineTo(x + w / 2, yy); c.stroke(); }
  c.globalAlpha = 1; c.restore();
};
const pencilMark = (c: Ctx, x: number, y: number, w: number) => line(c, [[x - w / 2 - 6, y], [x + w / 2 + 6, y]], 7, PENCIL);
// a peg on a wall plate at (x, y); things hang from (x, y + 60)
const peg = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 44, y - 22, 88, 44, 10), COL.steel, 6); shape(c, () => rrect(c, x - 9, y + 10, 18, 56, 6), COL.steelDk, 5); shape(c, () => ell(c, x, y + 66, 16, 12), COL.steelDk, 5); };
// a black binder clip gripping something at (x, y), its handles reaching up to (x, y - up)
const binderClip = (c: Ctx, x: number, y: number, up = 50) => { wire(c, [[x - 22, y - 14], [x - 6, y - up]], 7); wire(c, [[x + 22, y - 14], [x + 6, y - up]], 7); shape(c, () => polyP(c, [[x - 24, y - 16], [x + 24, y - 16], [x + 32, y + 22], [x - 32, y + 22]]), COL.black, 5); };
// a carry bag hanging by its handles from (hx, hy); body top-left (x, y), size w × h
const carryBag = (c: Ctx, x: number, y: number, w: number, h: number, hx: number, hy: number) => {
  for (const s of [-1, 1]) line(c, [[hx + s * 10, hy], [x + w / 2 + s * w * 0.3, y + 4]], 8, INK);
  shape(c, () => rrect(c, x, y, w, h, 18), BAG, 6); shade(c, () => rrect(c, x, y, w, h, 18), BAGDK, w * 0.18, 0, 0.7);
  shine(c, [[x + w * 0.2, y + h * 0.2], [x + w * 0.2, y + h * 0.6]], 8);
};
// a water bottle standing with its bottom centre at (x, y), body width w, total height h
const bottle = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * 0.68); c.quadraticCurveTo(x - w / 2, y - h * 0.82, x - w * 0.2, y - h * 0.86); c.lineTo(x - w * 0.2, y - h * 0.93); c.lineTo(x + w * 0.2, y - h * 0.93); c.lineTo(x + w * 0.2, y - h * 0.86); c.quadraticCurveTo(x + w / 2, y - h * 0.82, x + w / 2, y - h * 0.68); c.lineTo(x + w / 2, y); c.closePath(); };
  shape(c, body, COL.water, 6); shade(c, body, COL.waterDk, w * 0.3, 0, 0.5);
  shape(c, () => rrect(c, x - w * 0.24, y - h, w * 0.48, h * 0.09, 4), COL.blueDk, 5);
  shine(c, [[x - w * 0.3, y - h * 0.6], [x - w * 0.3, y - h * 0.15]], 7);
};
// a corner cut from a notebook cover, its corner at (x, y), the card going right and down
const nbCorner = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => c.rect(x, y, s, s), "#7a8fb5", 6); shade(c, () => c.rect(x, y, s, s), "#5b6f94", s * 0.2, s * 0.2, 0.5); c.strokeStyle = WHITE; c.lineWidth = 3; c.globalAlpha = 0.7; c.strokeRect(x + 14, y + 14, s - 28, s - 28); c.globalAlpha = 1; };
// a dimension line between two points with end ticks
const dim = (c: Ctx, a: number[], b: number[], col = INK) => { line(c, [a, b], 4, col); const an = Math.atan2(b[1] - a[1], b[0] - a[0]) + PI / 2; for (const p of [a, b]) line(c, [[p[0] - Math.cos(an) * 12, p[1] - Math.sin(an) * 12], [p[0] + Math.cos(an) * 12, p[1] + Math.sin(an) * 12]], 4, col); };
const dotted = (c: Ctx, a: number[], b: number[], col = RED) => { c.save(); c.setLineDash([10, 12]); line(c, [a, b], 4, col); c.restore(); };
// a stack of books seen from the side: n books of height bh, each w wide, bottom at y
const bookStack = (c: Ctx, x: number, y: number, w: number, n: number, bh: number) => { const cols = [COL.blue, COL.red, COL.green, COL.purple, COL.orange]; for (let i = 0; i < n; i++) book(c, x + (i % 2) * 6, y - (i + 1) * bh, w - (i % 2) * 6, bh, cols[i % cols.length]); };
// a tumbler of coins standing on (x, y): coins stacked inside a clear glass
const cupCoins = (c: Ctx, x: number, y: number, n: number) => {
  for (let i = 0; i < n; i++) shape(c, () => ell(c, x, y - 10 - i * 9, 28, 8), i === n - 1 ? COL.yellow : COL.orange, 3);
  glass(c, x, y, 76, 96, 0);
};
const magnifier = (c: Ctx, x: number, y: number, r: number, handleAn: number, inside?: () => void) => {
  line(c, [[x + Math.cos(handleAn) * r, y + Math.sin(handleAn) * r], [x + Math.cos(handleAn) * (r + 170), y + Math.sin(handleAn) * (r + 170)]], 34, INK);
  line(c, [[x + Math.cos(handleAn) * (r + 10), y + Math.sin(handleAn) * (r + 10)], [x + Math.cos(handleAn) * (r + 165), y + Math.sin(handleAn) * (r + 165)]], 22, COL.brown);
  shape(c, () => ell(c, x, y, r, r), COL.glass, 0);
  if (inside) { c.save(); c.beginPath(); ell(c, x, y, r - 4, r - 4); c.clip(); inside(); c.restore(); }
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 14; c.stroke();
  shine(c, [[x - r * 0.55, y - r * 0.35], [x - r * 0.2, y - r * 0.7]], 10);
};
// plywood layers filling a rect: odd layers show long grain lines (along), even layers short dashes (across)
const plyLayers = (c: Ctx, x: number, y: number, w: number, h: number, n: number) => {
  const lh = h / n;
  for (let i = 0; i < n; i++) {
    const yy = y + i * lh, along = i % 2 === 0;
    shape(c, () => c.rect(x, yy, w, lh), along ? COL.wood : "#e0b060", 4);
    c.strokeStyle = COL.woodDk; c.lineWidth = Math.max(2, lh * 0.06); c.lineCap = "round";
    if (along) for (let k = 1; k < 3; k++) { c.beginPath(); c.moveTo(x + 12, yy + (lh * k) / 3); c.lineTo(x + w - 12, yy + (lh * k) / 3 + (k === 1 ? lh * 0.08 : -lh * 0.08)); c.stroke(); }
    else for (let xx = x + 14; xx < x + w - 8; xx += lh * 0.55) { c.beginPath(); c.moveTo(xx, yy + lh * 0.25); c.lineTo(xx + lh * 0.12, yy + lh * 0.75); c.stroke(); }
  }
};

// ================================================================ set-up cards: e1, which way does it tear?
// 1. one sheet torn top to bottom (straight), another side to side (crooked)
const e1s0 = (c: Ctx) => { ground(c); tornNews(c, 70, 270, 400, 540, true, true, 3); tornNews(c, 610, 270, 400, 540, false, false, 11); };
// 2. a pencil arrow drawn along the straight tear
const e1s1 = (c: Ctx) => {
  ground(c); tornNews(c, 250, 200, 480, 620, true, true, 5, 14);
  pencilArrow(c, [[400, 760], [400, 290]]);
  pencil(c, 640, 930, 330, -0.35);
};
// 3. scissors cutting a strip along the arrow and a strip across it, marked A and X
const e1s2 = (c: Ctx) => {
  ground(c);
  newsSheet(c, 80, 260, 400, 520);
  pencilArrow(c, [[200, 700], [200, 330]]);
  // the cut line down the right of the sheet, the scissors part way along it
  c.save(); c.setLineDash([12, 12]); line(c, [[400, 262], [400, 500]], 4, INK); c.restore();
  scissors(c, 400, 520, -PI / 2, 0.28);
  // strip A (cut along the arrow) with its label, strip X (cut across) with its label
  shadow(c, 590, 788, 40, 10); shape(c, () => c.rect(545, 260, 76, 520), NEWS, 6); c.save(); c.beginPath(); c.rect(545, 260, 76, 520); c.clip(); print(c, 395, 260, 400, 520); c.restore();
  letter(c, "A", 558, 160, 70);
  shadow(c, 850, 648, 200, 10); shape(c, () => c.rect(650, 560, 400, 76), NEWS, 6); c.save(); c.beginPath(); c.rect(650, 560, 400, 76); c.clip(); print(c, 650, 330, 400, 520); c.restore();
  letter(c, "X", 830, 450, 70);
};
// 4. strip A on the table with 10 cm sticking out, a book on the other end
const droopScene = (c: Ctx) => {
  tableSide(c, 0, 640, 600);
  paperStrip(c, [[160, 596], [640, 596]], 8);
  paperStrip(c, droopPts(640, 596, 260, 100), 8);
  book(c, 170, 536, 300, 62, COL.blue);
};
const e1s3 = (c: Ctx) => {
  ground(c); droopScene(c);
  dim(c, [640, 470], [900, 470]); write(c, "10 cm", 690, 390, 48, INK, 7);
};
// 5. a ruler held upright beside the tip, measuring the drop
const e1s4 = (c: Ctx) => {
  ground(c); droopScene(c);
  dotted(c, [640, 596], [1000, 596]); dotted(c, [900, 696], [1000, 696]);
  rulerV(c, 960, 520, 300, 596, 26);
  hand(c, 890, 560, 0, 0.95);
  write(c, "4 cm", 760, 760, 44, RED, 7);
};

// ================================================================ set-up cards: e2, the tailor's trick
// 1. one thread pulled out near the edge leaves a straight gap along the threads
const e2s0 = (c: Ctx) => {
  ground(c); clothSq(c, 200, 340, 560);
  line(c, [[200, 406], [760, 406]], 7, WHITE);
  line(c, [[760, 406], [820, 390], [850, 350], [900, 332]], 4, THREAD);
  hand(c, 970, 332, PI, 0.9);
};
// 2. the square folded corner to corner: the fold line is the bias; one strip along the threads, one along the fold
const e2s1 = (c: Ctx) => {
  ground(c); clothSq(c, 240, 240, 600);
  c.save(); c.setLineDash([16, 12]); line(c, [[240, 240], [840, 840]], 6, PENCIL); c.restore();
  line(c, [[280, 240], [280, 840], [352, 840], [352, 240], [280, 240]], 6, PENCIL);
  c.save(); c.translate(540, 540); c.rotate(PI / 4); c.strokeStyle = PENCIL; c.lineWidth = 6; c.strokeRect(-330, -4, 660, 76); c.restore();
};
// 3. two marks 20 cm apart, the strip clipped to a hook, a carry bag clipped to the bottom
const hangScene = (c: Ctx, markGap: number, bagTop: number, withBottle: boolean) => {
  peg(c, 540, 60);
  const top = 150, bot = 170 + markGap + 60;
  clothStrip(c, 540, top, bot, 64);
  binderClip(c, 540, 148, 40);
  pencilMark(c, 540, 200, 64); pencilMark(c, 540, 200 + markGap, 64);
  binderClip(c, 540, bot + 6, 0);
  if (withBottle) bottle(c, 540, bagTop + 150, 120, 290);
  carryBag(c, 420, bagTop, 240, 230, 540, bot + 22);
};
const e2s2 = (c: Ctx) => {
  ground(c); hangScene(c, 400, 760, false);
  dim(c, [640, 200], [640, 600]); write(c, "20 cm", 670, 380, 44, INK, 7);
};
// 4. the bottle in the bag, a ruler beside the marks
const e2s3 = (c: Ctx) => {
  ground(c); hangScene(c, 384, 740, true);
  dotted(c, [540, 200], [700, 200]); dotted(c, [540, 584], [700, 584]);
  rulerV(c, 720, 150, 500, 200, 16);
  hand(c, 790, 250, PI, 0.9);
  write(c, "24 cm", 770, 520, 44, RED, 7);
};
// 5. two strips side by side: one hardly stretched, one pulled long and thin
const e2s4 = (c: Ctx) => {
  ground(c);
  for (const [x, gap, w, label] of [[300, 336, 64, "21 cm"], [720, 416, 46, "26 cm"]] as [number, number, number, string][]) {
    peg(c, x, 60); clothStrip(c, x, 150, 200 + gap + 40, w); binderClip(c, x, 148, 40);
    pencilMark(c, x, 200, w); pencilMark(c, x, 200 + gap, w);
    dim(c, [x + 80, 200], [x + 80, 200 + gap]); write(c, label, x + 105, 180 + gap / 2, 42, INK, 7);
  }
};

// ================================================================ set-up cards: e3, bend until it snaps
// 1. a paper clip unfolded and straightened into a wire about 9 cm long
const e3s0 = (c: Ctx) => {
  ground(c);
  paperclip(c, 180, 540, 250, 92);
  arrow(c, [[330, 540], [410, 540]]);
  // half unfolded: the outer loop opened out, the inner loop still curled
  wirePath(c, () => { c.moveTo(440, 600); c.lineTo(600, 600); c.arc(600, 560, 40, PI / 2, -PI / 2, true); c.lineTo(500, 520); c.arc(500, 495, 25, PI / 2, -PI / 2, true); c.lineTo(560, 470); });
  arrow(c, [[660, 540], [740, 540]]);
  wire(c, [[770, 540], [1040, 540]]);
  dim(c, [770, 620], [1040, 620]); write(c, "9 cm", 840, 650, 44, INK, 7);
};
// 2. a notebook corner shows a right angle (big bend); half of that is a small bend
const e3s1 = (c: Ctx) => {
  ground(c);
  nbCorner(c, 410, 450, 200);
  wire(c, [[120, 430], [390, 430], [390, 700]]);
  write(c, "90°", 180, 280, 60, INK, 8);
  const bx = 870, by = 430;
  wire(c, [[640, by], [bx, by], [bx + Math.cos(PI / 4) * 230, by + Math.sin(PI / 4) * 230]]);
  c.save(); c.setLineDash([10, 10]); line(c, [[bx, by], [bx + 160, by]], 4, COL.greyDk); c.restore();
  c.beginPath(); c.arc(bx, by, 110, 0, PI / 4); c.strokeStyle = RED; c.lineWidth = 6; c.stroke();
  write(c, "45°", 720, 280, 60, INK, 8);
};
// 3. two hands holding the wire low, bending the end one way to the corner and back the other
const e3s2 = (c: Ctx) => {
  ground(c);
  nbCorner(c, 568, 402, 150);
  // the other way, faintly: where the end goes on the return bend
  c.globalAlpha = 0.28; wire(c, [[560, 560], [560, 820]]); c.globalAlpha = 1;
  wire(c, [[320, 560], [560, 560], [560, 330]]);
  hand(c, 230, 560, 0, 1.3);
  hand(c, 650, 330, PI, 1.3);
  for (const s of [-1, 1]) { const pts: number[][] = []; for (let k = 0; k <= 10; k++) { const an = (s * k * 1.25) / 10; pts.push([560 + Math.cos(an) * 340, 560 + Math.sin(an) * 340]); } arrow(c, pts, RED, 10); }
};
// 4. the snapped wire in a bowl, a finger touching the bent place
const e3s3 = (c: Ctx) => {
  ground(c);
  bowl(c, 540, 640, 230);
  wire(c, [[400, 650], [552, 672]], 8); wire(c, [[590, 668], [720, 622]], 8);
  shape(c, () => ell(c, 552, 672, 9, 9), WIREDK, 3); shape(c, () => ell(c, 590, 668, 9, 9), WIREDK, 3);
  hand(c, 655, 568, 2.36, 1.2, SKIN.child, undefined, true);
};
// 5. the table: six clips, bend counts in two columns, big bends and small bends
const e3s4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 896, 380, 16); shape(c, () => c.rect(170, 180, 760, 710), COL.paper, 6);
  c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = "butt";
  for (let r = 0; r <= 4; r++) { c.beginPath(); c.moveTo(200, 220 + r * 160); c.lineTo(900, 220 + r * 160); c.stroke(); }
  for (const x of [200, 550, 900]) { c.beginPath(); c.moveTo(x, 220); c.lineTo(x, 860); c.stroke(); }
  c.lineCap = "round";
  wire(c, [[260, 330], [340, 330], [340, 250]], 7); write(c, "90°", 380, 270, 44, INK, 6);
  wire(c, [[600, 330], [690, 330], [690 + Math.cos(PI / 4) * 80, 330 - Math.sin(PI / 4) * 80]], 7); write(c, "45°", 775, 270, 44, INK, 6);
  const big = ["12", "9", "14"], small = ["25", "31", "22"];
  for (let r = 0; r < 3; r++) { write(c, big[r], 320, 430 + r * 160, 70, PENCIL, 8); write(c, small[r], 670, 430 + r * 160, 70, PENCIL, 8); }
  pencil(c, 930, 980, 300, -1.2);
};

// ================================================================ pictures for the experiments, activities, project, game
// flow.e1 · a child tearing a newspaper sheet from top to bottom: the tear runs straight
const flowE1 = (c: Ctx) => {
  ground(c);
  const { handL, handR } = person(c, 540, 1000, 620, { reachL: [390, 560], reachR: [690, 560] });
  const pieces = (hx: number, hy: number, left: boolean) => {
    const x = left ? hx - 150 : hx - 30, w = 180, y = hy, h = 330;
    shadow(c, x + w / 2 + 8, y + h + 6, w / 2, 12);
    const jag = (k: number) => ((k % 2) - 0.5) * 5;
    const p = () => {
      if (left) { c.moveTo(x, y); c.lineTo(x + w, y); for (let k = 0; k <= 10; k++) c.lineTo(x + w + jag(k), y + (k * h) / 10); c.lineTo(x, y + h); }
      else { c.moveTo(x + w, y); c.lineTo(x + w, y + h); for (let k = 10; k >= 0; k--) c.lineTo(x + jag(k), y + (k * h) / 10); }
      c.closePath();
    };
    shape(c, p, NEWS, 6); c.save(); c.beginPath(); p(); c.clip(); print(c, left ? x : x - w - 18, y, w * 2 + 18, h); c.restore();
    shape(c, () => ell(c, hx, hy + 10, 22, 16), SKIN.child, 4);
  };
  pieces(handL[0], handL[1], true); pieces(handR[0], handR[1], false);
};
// flow.e2 · the bottle hangs from a cloth strip; a child reads the stretch with a ruler
const flowE2 = (c: Ctx) => {
  ground(c);
  peg(c, 300, 60); clothStrip(c, 300, 150, 600, 64); binderClip(c, 300, 148, 40);
  pencilMark(c, 300, 210, 64); pencilMark(c, 300, 530, 64); binderClip(c, 300, 606, 0);
  bottle(c, 300, 860, 110, 270); carryBag(c, 190, 720, 220, 210, 300, 622);
  rulerV(c, 420, 170, 450, 210, 16);
  person(c, 650, 1000, 600, { reachL: [420, 585] });
};
// flow.e3 · a child bends a straightened paper clip back and forth; the bowl waits for the pieces
const flowE3 = (c: Ctx) => {
  ground(c);
  const { handL, handR } = person(c, 540, 1000, 600, { reachL: [410, 690], reachR: [670, 690] });
  wire(c, [handL, [540, 750], handR]);
  arrow(c, [[540, 715], [540, 610]]); arrow(c, [[540, 785], [540, 890]]);
  bowl(c, 900, 940, 110);
};
// flow.a1 · the grain hunt tray: skewers, ice-cream sticks, celery and a banana leaf, each with its grain arrow
const flowA1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 870, 420, 22); shape(c, () => rrect(c, 100, 280, 880, 580, 26), COL.steel, 6); shape(c, () => rrect(c, 124, 304, 832, 532, 18), COL.steelIn, 4);
  // two skewers, one split at the blunt end
  for (const x of [190, 250]) { line(c, [[x, 340], [x, 790]], 14, INK); line(c, [[x, 340], [x, 790]], 8, "#e9cf98"); shape(c, () => polyP(c, [[x - 6, 350], [x, 326], [x + 6, 350]]), INK, 2); }
  line(c, [[250, 790], [240, 740]], 8, "#e9cf98"); line(c, [[250, 790], [240, 740]], 3, INK);
  // two ice-cream sticks
  for (const x of [340, 410]) { shape(c, () => rrect(c, x - 16, 340, 32, 440, 16), "#e9cf98", 6); line(c, [[x - 2, 380], [x - 4, 740]], 2.5, COL.woodDk); }
  // a celery stalk with its ribs
  shape(c, () => { c.moveTo(500, 780); c.lineTo(500, 420); c.quadraticCurveTo(530, 380, 560, 420); c.lineTo(560, 780); c.quadraticCurveTo(530, 800, 500, 780); c.closePath(); }, COL.greenLt, 6);
  for (const x of [514, 530, 546]) line(c, [[x, 440], [x, 770]], 3, COL.green);
  for (const a of [-0.5, 0, 0.5]) { const bx = 530 + a * 30; line(c, [[bx, 420], [bx + a * 30, 350]], 6, COL.green); shape(c, () => ell(c, bx + a * 40, 335, 22, 16), COL.leaf, 4); }
  // a banana leaf: midrib down the middle, parallel veins slanting to each edge
  const lx = 790, ly0 = 330, ly1 = 800;
  const leafP = () => { c.moveTo(lx, ly0); c.quadraticCurveTo(lx + 130, ly0 + 120, lx + 110, ly1 - 60); c.quadraticCurveTo(lx + 60, ly1 + 20, lx, ly1); c.quadraticCurveTo(lx - 60, ly1 + 20, lx - 110, ly1 - 60); c.quadraticCurveTo(lx - 130, ly0 + 120, lx, ly0); c.closePath(); };
  shape(c, leafP, COL.leaf, 6); c.save(); c.beginPath(); leafP(); c.clip(); c.strokeStyle = COL.leafDk; c.lineWidth = 2.5;
  for (let yy = ly0 + 40; yy < ly1; yy += 26) for (const s of [-1, 1]) { c.beginPath(); c.moveTo(lx, yy); c.lineTo(lx + s * 140, yy + 40); c.stroke(); }
  c.restore(); line(c, [[lx, ly0 + 10], [lx, ly1 - 10]], 7, COL.leafDk);
  // pencil arrows along each grain
  for (const x of [220, 375, 600, 930]) pencilArrow(c, [[x, 720], [x, 600]]);
};
// flow.a2 · a cardboard strip bridges two book stacks; a bottle lies across the middle and the strip sags
const flowA2 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 760], [1080, 760]], 6, INK);
  bookStack(c, 80, 760, 250, 3, 64); bookStack(c, 750, 760, 250, 3, 64);
  // flat on the books, sagging only over the gap (330 to 750)
  // a trough: the strip slopes down over the first 100 px of the gap, lies flat under the bottle, slopes up again
  const ease = (t: number) => t * t * (3 - 2 * t);
  const top = (x: number) => (x <= 330 || x >= 750 ? 568 : 568 + 44 * (x < 430 ? ease((x - 330) / 100) : x > 650 ? ease((750 - x) / 100) : 1));
  const sagP = () => { c.moveTo(200, 568); for (let i = 0; i <= 60; i++) { const x = 200 + (680 * i) / 60; c.lineTo(x, top(x)); } c.lineTo(880, 592); for (let i = 60; i >= 0; i--) { const x = 200 + (680 * i) / 60; c.lineTo(x, top(x) + 24); } c.closePath(); };
  shape(c, sagP, CARD, 6);
  // the flutes on the cut end
  c.strokeStyle = CARDDK; c.lineWidth = 3; c.beginPath(); for (let x = 202; x < 230; x += 7) { c.lineTo(x, 574 + ((x / 7) % 2) * 12); } c.stroke();
  c.save(); c.beginPath(); sagP(); c.clip(); c.strokeStyle = CARDDK; c.lineWidth = 3; for (let x = 200; x <= 880; x += 7) { c.beginPath(); c.moveTo(x, 540); c.lineTo(x, 700); c.stroke(); } c.restore();
  // the bottle lying across the middle, resting in the sag
  c.save(); c.translate(540, 567); c.rotate(PI / 2); bottle(c, 0, 150, 90, 300); c.restore();
  // where the strip was before it sagged
  dotted(c, [330, 568], [750, 568]);
};
// flow.a3 · three paper bridges: flat sags under a few coins, zigzag holds more, the tube most
const flowA3 = (c: Ctx) => {
  ground(c);
  // three rows, one bridge each, over the same 15 cm gap between two stacks of books
  for (const [base, kind] of [[400, 0], [710, 1], [1020, 2]] as [number, number][]) {
    line(c, [[40, base], [1040, base]], 5, INK);
    bookStack(c, 70, base, 230, 2, 46); bookStack(c, 780, base, 230, 2, 46);
    const l = 300, r = 780, y = base - 92, m = (l + r) / 2;
    if (kind === 0) {
      const sag: number[][] = [[120, y]]; for (let k = 0; k <= 20; k++) { const t = k / 20; sag.push([l + (r - l) * t, y + 70 * Math.sin(PI * t)]); } sag.push([960, y]);
      paperStrip(c, sag, 6); cupCoins(c, m, y + 66, 2);
    }
    if (kind === 1) { const z: number[][] = [[120, y]]; for (let k = 0; k <= 16; k++) z.push([l - 20 + (k * (r - l + 40)) / 16, k % 2 ? y : y - 34]); z.push([960, y]); paperStrip(c, z, 6); cupCoins(c, m, y - 34, 9); }
    if (kind === 2) { shape(c, () => rrect(c, 120, y - 60, 840, 60, 30), COL.paper, 6); shade(c, () => rrect(c, 120, y - 60, 840, 60, 30), COL.grey, 0, 24, 0.35); shape(c, () => ell(c, 132, y - 30, 16, 28), "#efe7d6", 4); cupCoins(c, m, y - 60, 12); }
  }
};
// flow.a4 · the cut edge of a plywood board: five layers, their grain crossing, a magnifying glass over them
const flowA4 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 790, 420, 20);
  shape(c, () => polyP(c, [[140, 560], [940, 560], [1010, 440], [210, 440]]), COL.wood, 6);
  c.strokeStyle = COL.woodDk; c.lineWidth = 3; for (let k = 1; k < 5; k++) { const yy = 440 + k * 24; c.beginPath(); c.moveTo(210 + (560 - yy) * 0.58 + 10, yy); c.quadraticCurveTo(600, yy + 6, 1010 - (yy - 440) * 0.58 - 10, yy); c.stroke(); }
  plyLayers(c, 140, 560, 800, 200, 5);
  magnifier(c, 640, 560, 160, -PI / 4, () => plyLayers(c, 300, 450, 700, 220, 3));
};
// flow.p1 · paper plywood: newspaper layers glued with a brush, every second layer turned across
const flowP1 = (c: Ctx) => {
  ground(c);
  // each lower layer peeks out to the left and below the one on top; the arrows alternate: along, across, along
  const layers: [number, number, boolean][] = [[180, 560], [220, 500], [260, 440]].map(([x, y], i) => [x, y, i % 2 === 0]);
  layers.forEach(([x, y, along]) => { shadow(c, x + 270, y + 386, 260, 12); shape(c, () => c.rect(x, y, 520, 380), NEWS, 6); c.save(); c.beginPath(); c.rect(x, y, 520, 380); c.clip(); print(c, x, y, 520, 380); c.restore(); if (along) pencilArrow(c, [[x + 60, y + 350], [x + 220, y + 350]]); else pencilArrow(c, [[x + 20, y + 330], [x + 20, y + 170]]); });
  // glue on the top layer, the brush, the glue pot
  shape(c, () => { c.moveTo(300, 540); c.quadraticCurveTo(420, 500, 520, 530); c.quadraticCurveTo(600, 560, 560, 600); c.quadraticCurveTo(440, 640, 320, 600); c.quadraticCurveTo(260, 570, 300, 540); c.closePath(); }, WHITE, 0);
  bowl(c, 900, 760, 100, WHITE);
  const bx = 540, by = 560, hx = 760, hy = 330;
  line(c, [[bx + 20, by - 40], [hx, hy]], 22, INK); line(c, [[bx + 24, by - 44], [hx - 4, hy + 4]], 12, COL.brown);
  shape(c, () => { c.moveTo(bx - 20, by + 10); c.lineTo(bx + 60, by - 60); c.lineTo(bx + 30, by - 90); c.lineTo(bx - 50, by - 20); c.closePath(); }, "#e9cf98", 5);
  const wx = hx - 85 * Math.cos(3.98), wy = hy - 85 * Math.sin(3.98);
  hand(c, wx, wy, 3.98, 1.1);
};
// flow.g1 · Grain or No Grain: a child reads a card; the pile and two tokens lie on the floor
const flowG1 = (c: Ctx) => {
  ground(c);
  shadow(c, 790, 904, 90, 18); for (let k = 0; k < 6; k++) shape(c, () => rrect(c, 720 - k * 3, 840 - k * 8, 150, 60, 8), COL.paper, 4);
  shape(c, () => rrect(c, 705, 790, 150, 60, 8), COL.paper, 5); c.strokeStyle = PRINT; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(725, 808 + k * 14); c.lineTo(835 - k * 30, 808 + k * 14); c.stroke(); }
  shape(c, () => ell(c, 700, 980, 48, 30), COL.wood, 5); for (let k = -1; k <= 1; k++) line(c, [[662, 980 + k * 12], [738, 982 + k * 12]], 3, COL.woodDk);
  shape(c, () => ell(c, 850, 980, 48, 30), COL.grey, 5);
  const { handR } = person(c, 380, 900, 560, { sit: true, dir: 1, reachR: [540, 650] });
  c.save(); c.translate(handR[0], handR[1] + 60); c.rotate(-0.25); shape(c, () => rrect(c, -55, -75, 110, 150, 8), COL.paper, 5); c.strokeStyle = PRINT; c.lineWidth = 3; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(-38, -40 + k * 16); c.lineTo(30 - (k % 2) * 20, -40 + k * 16); c.stroke(); } c.restore();
  shape(c, () => ell(c, handR[0], handR[1], 20, 15), SKIN.child, 4);
};
// term.0 · Grain: a plank with its lines running along its length, an arrow showing the direction
const termGrain = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 700, 440, 22);
  const front = () => c.rect(100, 560, 880, 110), top = () => polyP(c, [[100, 560], [980, 560], [1040, 480], [160, 480]]), end = () => polyP(c, [[980, 560], [1040, 480], [1040, 590], [980, 670]]);
  shape(c, top, COL.wood, 6); shape(c, front, COL.wood, 6); shade(c, front, COL.woodDk, 0, 40, 0.35); shape(c, end, "#e0b060", 6);
  c.strokeStyle = COL.woodDk; c.lineWidth = 4;
  for (let k = 0; k < 4; k++) { const yy = 495 + k * 20; c.beginPath(); c.moveTo(160 + (560 - yy) * 0.75 + 12, yy); c.bezierCurveTo(400, yy + 7, 700, yy - 7, 1040 - (yy - 480) * 0.75 - 12, yy); c.stroke(); }
  for (let k = 0; k < 3; k++) { const yy = 585 + k * 28; c.beginPath(); c.moveTo(115, yy); c.bezierCurveTo(350, yy + 8, 650, yy - 8, 965, yy); c.stroke(); }
  c.lineWidth = 3; for (const r of [18, 36]) { c.beginPath(); c.ellipse(1010, 575, r * 0.45, r, 0, 0, PI * 2); c.stroke(); }
  arrow(c, [[260, 380], [820, 380]], RED, 14);
};

export const ic_materialsPropertiesL4 = cards("sci.materials.properties.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4,
  e2s0, e2s1, e2s2, e2s3, e2s4,
  e3s0, e3s1, e3s2, e3s3, e3s4,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowP1, flowG1, termGrain,
]);
