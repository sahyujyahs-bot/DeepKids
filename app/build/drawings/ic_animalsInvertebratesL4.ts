import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, person, write, cards } from "./flatKit";

// ANIMALS WITHOUT BACKBONES L4 · set-up cards for the three experiments (colour cubes, sugar lumps, drop and stir)
// and card pictures for the experiments, activities, the project and the gill. Flat kit look: bold outline, flat
// colour, one shade tone, light from the upper left.

const JEL = { top: "#eaf5fc", front: "#d6ecfa", side: "#a9cce6" };
const DYE = { top: "#f07a68", front: "#e4523b", side: "#b53a2a" };
const SUG = { top: "#ffffff", front: "#f4f1ea", side: "#d9d3c6" };
const SPONGE = { top: "#ffe27a", front: "#ffd34d", side: "#d9ab2d" };
const CLAY = "#a8723f";
const DEPTH = 0.55;

// the table top: a slightly darker band below y with an ink edge
const counter = (c: Ctx, y: number) => { ground(c); c.fillStyle = "#e4d5b8"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };
// a cube seen a little from above and the right: front face is the square with bottom-left corner (x, y), side s, depth d
const cube = (c: Ctx, x: number, y: number, s: number, d: number, col: { top: string; front: string; side: string }, lw = 5, w = s) => {
  const k = DEPTH;
  shape(c, () => polyP(c, [[x, y - s], [x + d, y - s - d * k], [x + w + d, y - s - d * k], [x + w, y - s]]), col.top, lw);
  shape(c, () => polyP(c, [[x + w, y - s], [x + w + d, y - s - d * k], [x + w + d, y - d * k], [x + w, y]]), col.side, lw);
  shape(c, () => polyP(c, [[x, y - s], [x + w, y - s], [x + w, y], [x, y]]), col.front, lw);
};
// a jelly cube whose front is the cut face: a red rim of thickness e round a clear middle
const cutCube = (c: Ctx, x: number, y: number, s: number, d: number, e: number) => {
  cube(c, x, y, s, d, DYE);
  if (e < s / 2) shape(c, () => polyP(c, [[x + e, y - s + e], [x + s - e, y - s + e], [x + s - e, y - e], [x + e, y - e]]), JEL.front, 4);
};
// a round kitchen timer standing on its base, centre (x, y), reading txt (minutes)
const timer = (c: Ctx, x: number, y: number, r: number, txt: string, frac: number) => {
  shadow(c, x + r * 0.1, y + r + 4, r * 0.85, r * 0.14);
  shape(c, () => rrect(c, x - r * 0.22, y - r - r * 0.2, r * 0.44, r * 0.3, 8), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, r, r), COL.teal);
  shade(c, () => ell(c, x, y, r, r), COL.tealDk, r * 0.22, r * 0.12);
  shape(c, () => ell(c, x, y, r * 0.74, r * 0.74), WHITE, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], 4); }
  const a = -Math.PI / 2 + frac * Math.PI * 2;
  line(c, [[x, y], [x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4]], 7, RED);
  shape(c, () => ell(c, x, y, r * 0.06, r * 0.06), INK, 0);
  shape(c, () => rrect(c, x - r * 0.3 * txt.length - 6, y + r * 0.3, r * 0.6 * txt.length + 12, r * 0.36, 6), WHITE, 0);
  write(c, txt, x - r * 0.3 * txt.length, y + r * 0.34, r * 0.3, INK, 5);
};
// a steel spoon: the tip of its bowl at (x, y), the handle running away at angle an, total length len
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, len * 0.3, -len * 0.035, len * 0.7, len * 0.07, len * 0.035), COL.steel, 5);
  shape(c, () => ell(c, len * 0.17, 0, len * 0.17, len * 0.105), COL.steel, 5);
  shade(c, () => ell(c, len * 0.17, 0, len * 0.17, len * 0.105), COL.steelDk, len * 0.04, len * 0.03);
  shine(c, [[len * 0.06, -len * 0.03], [len * 0.2, -len * 0.06]], 6);
  c.restore();
};
// a wooden ruler lying flat, top-left corner (x, y), cmN centimetres of px each, numbered
const ruler = (c: Ctx, x: number, y: number, cmN: number, px: number, h = 64) => {
  const w = cmN * px + px * 0.5;
  shadow(c, x + w / 2 + 10, y + h + 6, w / 2, 12);
  shape(c, () => polyP(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x + 3, y + h - 14, w - 6, 11);
  c.strokeStyle = INK; c.lineCap = "butt";
  for (let mm = 0; mm <= cmN * 10; mm++) { const tx = x + px * 0.25 + (mm * px) / 10, th = mm % 10 === 0 ? h * 0.45 : mm % 5 === 0 ? h * 0.32 : h * 0.18; c.lineWidth = mm % 10 === 0 ? 3.5 : 2; c.beginPath(); c.moveTo(tx, y); c.lineTo(tx, y + th); c.stroke(); }
  for (let cm = 0; cm <= cmN; cm++) write(c, String(cm), x + px * 0.25 + cm * px - h * 0.14, y + h * 0.5, h * 0.3, INK, 3.5);
};
// a white paper tag standing on the counter, centre (x, y)
const tag = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + 8, y + h / 2 + 4, w / 2, 8); shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 8), WHITE, 5); };
const snowflake = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI; line(c, [[x - Math.cos(a) * r, y - Math.sin(a) * r], [x + Math.cos(a) * r, y + Math.sin(a) * r]], 6, COL.blue); } shape(c, () => ell(c, x, y, r * 0.2, r * 0.2), COL.blue, 0); };
const steam = (c: Ctx, x: number, y: number, h: number, col = RED) => { for (const dx of [-h * 0.5, 0, h * 0.5]) { c.beginPath(); c.moveTo(x + dx, y + h / 2); c.bezierCurveTo(x + dx - h * 0.3, y + h * 0.2, x + dx + h * 0.3, y - h * 0.2, x + dx, y - h / 2); c.strokeStyle = col; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); } };
const stirMark = (c: Ctx, x: number, y: number, r: number) => { spoon(c, x - r * 0.2, y + r * 0.5, -Math.PI * 0.4, r * 2.2); c.beginPath(); c.arc(x, y, r * 0.9, Math.PI * 0.2, Math.PI * 1.5); c.strokeStyle = RED; c.lineWidth = 6; c.stroke(); arrow(c, [[x + r * 0.05, y - r * 0.9], [x + r * 0.2, y - r * 0.86]], RED, 6); };
// the three labels of the drop-and-stir glasses: still cold, still warm, stirred cold
const stirTags = (c: Ctx, xs: number[], y: number) => {
  xs.forEach((x, i) => { tag(c, x, y, 170, 90); if (i === 0) snowflake(c, x, y, 30); else if (i === 1) steam(c, x, y, 54); else { snowflake(c, x - 42, y, 22); stirMark(c, x + 34, y + 4, 26); } });
};
// a curved red arrow going round the top of a glass to say "stir"
const stirArrow = (c: Ctx, x: number, y: number, rx: number) => { c.beginPath(); c.ellipse(x, y, rx, rx * 0.4, 0, Math.PI * 1.1, Math.PI * 2.6); c.strokeStyle = RED; c.lineWidth = 10; c.lineCap = "round"; c.stroke(); arrow(c, [[x + rx * 0.45, y + rx * 0.33], [x + rx * 0.2, y + rx * 0.4]], RED, 10); };
// a glass of water with a colour pattern inside: streak (thin thread sinking), cloud (patchy), even (all pink)
const dyeGlass = (c: Ctx, x: number, y: number, w: number, h: number, kind: "streak" | "cloud" | "even" | "plain" | "top") => {
  const fill = 0.72, ly = y - h * fill;
  glass(c, x, y, w, h, fill, kind === "even" ? "#f0a090" : COL.water);
  c.save(); c.beginPath(); c.moveTo(x - w * 0.49, ly); c.lineTo(x + w * 0.49, ly); c.lineTo(x + w * 0.39, y - 4); c.lineTo(x - w * 0.39, y - 4); c.closePath(); c.clip();
  if (kind === "streak") { line(c, [[x + 6, ly + 4], [x - 4, ly + h * 0.3], [x + 8, ly + h * 0.5], [x, y - 20]], 7, RED); shape(c, () => ell(c, x, y - 18, w * 0.22, 10), RED, 0); }
  if (kind === "top") { shape(c, () => ell(c, x, ly + 6, w * 0.16, 8), RED, 0); line(c, [[x, ly + 8], [x - 6, ly + h * 0.12]], 6, RED); }
  if (kind === "cloud") { const r = rnd(3); for (let i = 0; i < 9; i++) shape(c, () => ell(c, x - w * 0.25 + r() * w * 0.5, ly + 20 + r() * (h * fill - 50), 22 + r() * 26, 16 + r() * 22), i % 2 ? "#e8705c" : "#f0a090", 0); }
  c.restore();
};
// sugar: a whole cube, pieces, a powder heap, each with its bottom centre at (x, y)
const sugarCube = (c: Ctx, x: number, y: number, s: number) => cube(c, x - s / 2, y, s, s * 0.45, SUG, 4);
const sugarPieces = (c: Ctx, x: number, y: number, s: number) => { cube(c, x - s * 0.9, y, s * 0.5, s * 0.22, SUG, 3.5); cube(c, x - s * 0.2, y, s * 0.42, s * 0.2, SUG, 3.5); cube(c, x + s * 0.45, y, s * 0.36, s * 0.18, SUG, 3.5); cube(c, x - s * 0.45, y - s * 0.5, s * 0.3, s * 0.15, SUG, 3.5); };
const sugarPowder = (c: Ctx, x: number, y: number, s: number) => { shape(c, () => { c.moveTo(x - s, y); c.quadraticCurveTo(x - s * 0.3, y - s * 0.9, x + s, y); c.closePath(); }, WHITE, 4); const r = rnd(5); for (let i = 0; i < 16; i++) shape(c, () => ell(c, x - s * 0.7 + r() * s * 1.4, y - 6 - r() * s * 0.35, 5, 4), SUG.side, 0); };
// a cloth sleeve running from a hand's cuff to the frame edge, so no arm floats: from (x, y) at angle an
const sleeve = (c: Ctx, x: number, y: number, an: number, len: number, col: string = CLOTH.child) => { line(c, [[x, y], [x + Math.cos(an) * len, y + Math.sin(an) * len]], 84, INK); line(c, [[x, y], [x + Math.cos(an) * len, y + Math.sin(an) * len]], 72, col); };
// a mud crab seen from above, body centre (x, y), width w (across the shell), claws forward (up the card)
const crab = (c: Ctx, x: number, y: number, w: number, gills = false) => {
  const col = "#7f8b52", dk = "#5b6639", rx = w / 2, ry = w * 0.3, lw = w * 0.05;
  const leg = (sx: number, sy: number, kx: number, ky: number, tx: number, ty: number) => { line(c, [[sx, sy], [kx, ky], [tx, ty]], lw + 10, INK); line(c, [[sx, sy], [kx, ky], [tx, ty]], lw, col); };
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const a = -0.25 + i * 0.36, sx = x + s * rx * 0.85 * Math.cos(a), sy = y + ry * 0.9 * Math.sin(a) + ry * 0.1;
    leg(sx, sy, sx + s * w * 0.22, sy - w * 0.1 + i * w * 0.06, sx + s * w * 0.4, sy + w * 0.12 + i * w * 0.08);
  }
  for (const s of [-1, 1]) {
    const sx = x + s * rx * 0.6, sy = y - ry * 0.7, ex = x + s * rx * 0.95, ey = y - ry * 1.5, px = x + s * rx * 0.55, py = y - ry * 2.25;
    line(c, [[sx, sy], [ex, ey], [px, py]], lw * 1.6 + 10, INK); line(c, [[sx, sy], [ex, ey], [px, py]], lw * 1.6, col);
    shape(c, () => ell(c, px, py, w * 0.13, w * 0.09, -s * 0.6), col, 5);
    shape(c, () => { c.moveTo(px - s * w * 0.02, py - w * 0.05); c.lineTo(px - s * w * 0.09, py - w * 0.17); c.lineTo(px + s * w * 0.03, py - w * 0.08); c.closePath(); }, col, 4);
    shape(c, () => { c.moveTo(px + s * w * 0.06, py - w * 0.04); c.lineTo(px + s * w * 0.12, py - w * 0.15); c.lineTo(px + s * w * 0.11, py - w * 0.03); c.closePath(); }, col, 4);
  }
  const body = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - ry * 1.3, x - rx * 0.5, y - ry * 1.5, x, y - ry * 1.4); c.bezierCurveTo(x + rx * 0.5, y - ry * 1.5, x + rx, y - ry * 1.3, x + rx, y); c.bezierCurveTo(x + rx, y + ry * 1.2, x - rx, y + ry * 1.2, x - rx, y); c.closePath(); };
  shape(c, body, col); shade(c, body, dk, w * 0.06, w * 0.04);
  for (let i = -3; i <= 3; i++) line(c, [[x + i * rx * 0.22, y - ry * 1.4 - 4], [x + i * rx * 0.22 + 8, y - ry * 1.15]], 4, dk);
  for (const s of [-1, 1]) { line(c, [[x + s * w * 0.09, y - ry * 1.3], [x + s * w * 0.1, y - ry * 1.75]], 7, INK); shape(c, () => ell(c, x + s * w * 0.1, y - ry * 1.8, w * 0.04, w * 0.04), WHITE, 4); shape(c, () => ell(c, x + s * w * 0.1, y - ry * 1.8, w * 0.018, w * 0.018), INK, 0); }
  if (gills) {
    // the right side of the shell lifted like a lid, hinged at the middle, showing the gill chamber beneath
    const cav = () => { c.moveTo(x + rx * 0.08, y - ry * 1.3); c.bezierCurveTo(x + rx * 0.6, y - ry * 1.45, x + rx, y - ry * 1.1, x + rx, y); c.bezierCurveTo(x + rx, y + ry * 1.15, x + rx * 0.5, y + ry * 1.2, x + rx * 0.08, y + ry * 1.1); c.closePath(); };
    shape(c, cav, "#3e3a4a", 5);
    c.save(); c.beginPath(); cav(); c.clip();
    for (let i = 0; i < 6; i++) {
      const gx = x + rx * 0.22 + i * rx * 0.13, g = () => { c.moveTo(gx, y - ry * 1.25); c.bezierCurveTo(gx + rx * 0.14, y - ry * 0.6, gx + rx * 0.14, y + ry * 0.5, gx, y + ry * 1.05); c.bezierCurveTo(gx - rx * 0.03, y + ry * 0.5, gx - rx * 0.03, y - ry * 0.6, gx, y - ry * 1.25); c.closePath(); };
      shape(c, g, "#f4c6c8", 4);
      for (let k = 0; k < 9; k++) { const gy = y - ry * 1.05 + k * ry * 0.25, hw = rx * 0.1 * Math.sin(((k + 1) / 10) * Math.PI); line(c, [[gx + rx * 0.02, gy], [gx + rx * 0.03 + hw, gy + 4]], 3, "#c9858c"); }
    }
    c.restore();
    const lid = () => { c.moveTo(x + rx * 0.08, y - ry * 1.3); c.bezierCurveTo(x + rx * 0.2, y - ry * 2.2, x + rx * 0.9, y - ry * 2.6, x + rx * 1.25, y - ry * 1.9); c.bezierCurveTo(x + rx * 1.1, y - ry * 1.2, x + rx * 0.7, y - ry * 1.1, x + rx * 0.08, y - ry * 1.3); c.closePath(); };
    shape(c, lid, col); shade(c, lid, dk, w * 0.04, w * 0.04);
  }
};
// a child's finger pointing down, tip at (x, y), the rest of the hand curled above it
const fingerDown = (c: Ctx, x: number, y: number, len: number, wide: number) => {
  sleeve(c, x + wide * 0.4, y - len - wide * 1.3, -Math.PI * 0.42, 500, CLOTH.child);
  shape(c, () => ell(c, x + wide * 0.75, y - len - wide * 0.4, wide * 1.2, wide * 0.95), SKIN.child, 5);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, x + wide * 0.55 + k * wide * 0.5, y - len - wide * 0.35 + k * wide * 0.08, wide * 0.5, wide * 0.8, wide * 0.2), SKIN.child, 4);
  shape(c, () => rrect(c, x - wide / 2, y - len, wide, len, wide / 2), SKIN.child, 5);
  shape(c, () => ell(c, x, y - wide * 0.45, wide * 0.28, wide * 0.2), "#f1d2bf", 3);
};

// ------------------------------------------------------------------ e1 · colour cubes
// 1. a pan of water on a stove, a spoon stirring in white agar powder, a steel box beside it
const e1s0 = (c: Ctx) => {
  counter(c, 840);
  // steel box, open, on the counter
  cube(c, 760, 860, 130, 90, { top: "#4a4f5a", front: COL.steel, side: COL.steelDk }, 5, 190);
  shape(c, () => polyP(c, [[772, 724], [838, 688], [938, 688], [872, 724]]), "#6a7180", 3);
  shine(c, [[776, 760], [776, 840]], 6);
  // stove: a black top with a burner, a front face
  shape(c, () => polyP(c, [[130, 720], [640, 720], [690, 800], [80, 800]]), COL.black);
  shape(c, () => polyP(c, [[80, 800], [690, 800], [690, 850], [80, 850]]), "#26222c");
  shape(c, () => ell(c, 385, 765, 190, 34), "#5a5560", 5);
  for (let i = 0; i < 7; i++) { const fx = 250 + i * 45; shape(c, () => { c.moveTo(fx - 12, 760); c.quadraticCurveTo(fx - 14, 700, fx, 680); c.quadraticCurveTo(fx + 14, 700, fx + 12, 760); c.closePath(); }, "#5b8fd6", 3); shape(c, () => { c.moveTo(fx - 6, 760); c.quadraticCurveTo(fx - 7, 720, fx, 705); c.quadraticCurveTo(fx + 7, 720, fx + 6, 760); c.closePath(); }, COL.yellow, 0); }
  // pan with a handle, water inside, a cloud of white powder on the water
  shape(c, () => polyP(c, [[560, 470], [720, 440], [720, 470], [560, 500]]), COL.black, 5);
  shape(c, () => { c.moveTo(160, 440); c.lineTo(600, 440); c.lineTo(580, 690); c.quadraticCurveTo(380, 720, 180, 690); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(160, 440); c.lineTo(600, 440); c.lineTo(580, 690); c.quadraticCurveTo(380, 720, 180, 690); c.closePath(); }, COL.steelDk, 90, 0);
  shape(c, () => ell(c, 380, 440, 222, 44), COL.steelIn, 5);
  shape(c, () => ell(c, 380, 442, 200, 34), COL.water, 4);
  const r = rnd(11); for (let i = 0; i < 26; i++) shape(c, () => ell(c, 300 + r() * 170, 432 + r() * 20, 10 + r() * 10, 5 + r() * 4), WHITE, 0);
  shine(c, [[200, 480], [215, 640]], 7);
  // the spoon standing in the pan, stirring (a red arrow round its handle)
  spoon(c, 400, 445, -Math.PI * 0.38, 400);
  stirArrow(c, 520, 170, 120);
  // a spoon of white powder going in, held from the right
  spoon(c, 760, 350, -0.3, 230);
  sleeve(c, 1040, 290, -0.2, 120);
  hand(c, 979, 294, Math.PI * 0.95, 1.05);
  shape(c, () => { c.moveTo(780, 342); c.quadraticCurveTo(810, 300, 850, 318); c.closePath(); }, WHITE, 3);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 700 + i * 8 - (i % 2) * 14, 380 + i * 12, 6, 4), WHITE, 0);
};
// 2. a block of clear jelly on a chopping board being cut; a thin slice, a 1 cm cube, two 2 cm cubes, a ruler
const e1s1 = (c: Ctx) => {
  counter(c, 880);
  shadow(c, 560, 905, 460, 24);
  shape(c, () => polyP(c, [[150, 560], [980, 560], [1030, 860], [100, 860]]), COL.wood);
  shape(c, () => polyP(c, [[100, 860], [1030, 860], [1030, 892], [100, 892]]), COL.woodDk);
  // the block, and the knife cutting a slice off its right end
  cube(c, 130, 800, 230, 70, JEL);
  shine(c, [[150, 640], [150, 760]], 7);
  shape(c, () => polyP(c, [[392, 540], [430, 540], [430, 790], [392, 802]]), COL.steel, 5);
  shape(c, () => rrect(c, 384, 420, 54, 125, 12), COL.black, 5);
  arrow(c, [[411, 330], [411, 400]]);
  // the pieces, 1 cm = 80 px: a thin slice, a 1 cm cube, two 2 cm cubes
  cube(c, 470, 760, 160, 40, JEL, 4, 22);
  cube(c, 530, 760, 80, 40, JEL, 4);
  cube(c, 660, 760, 160, 50, JEL, 4);
  cube(c, 860, 760, 160, 50, JEL, 4);
  ruler(c, 470, 782, 6, 80, 60);
};
// 3. four pieces of jelly in a bowl of red water, a timer showing 40 minutes
const e1s2 = (c: Ctx) => {
  counter(c, 860);
  timer(c, 880, 300, 105, "40", 40 / 60);
  const bx = 470, by = 560, r = 320;
  shadow(c, bx + 30, by + 300, r * 0.8, 30);
  const bowl = () => { c.moveTo(bx - r, by); c.bezierCurveTo(bx - r * 0.9, by + 400, bx + r * 0.9, by + 400, bx + r, by); c.closePath(); };
  shape(c, bowl, COL.steel); shade(c, bowl, COL.steelDk, r * 0.3, -20);
  shape(c, () => ell(c, bx, by, r, r * 0.34), COL.steelIn, 5);
  shape(c, () => ell(c, bx, by + 6, r * 0.9, r * 0.28), RED, 4);
  // the pieces, poking up through the red water: a slice, a small cube, two big cubes
  const dip = (x: number, y: number, s: number, d: number, w: number, above: number) => {
    c.save(); c.beginPath(); c.rect(x - 10, y - s - d, w + d + 20, s + d - (s - above)); c.clip(); cube(c, x, y, s, d, JEL, 4, w); c.restore();
    shape(c, () => ell(c, x + w / 2, y - s + above, w / 2 + 6, 8), "#b53a2a", 0);
  };
  dip(300, 650, 60, 24, 16, 36); dip(360, 660, 60, 24, 60, 32); dip(470, 640, 120, 36, 120, 70); dip(630, 640, 120, 36, 120, 60);
  shine(c, [[bx - r * 0.7, by + 80], [bx - r * 0.55, by + 220]], 7);
};
// 4. a jelly cube cut in half: a thin red edge round a clear middle, a ruler measuring the edge
const e1s3 = (c: Ctx) => {
  counter(c, 880);
  cutCube(c, 150, 760, 360, 110, 36);
  cube(c, 640, 760, 360, 110, DYE, 5, 180);
  shine(c, [[660, 480], [660, 700]], 7);
  ruler(c, 150, 776, 2, 180, 64);
  line(c, [[186, 700], [186, 790]], 5, RED);
  arrow(c, [[260, 650], [194, 710]], RED, 7);
  shape(c, () => rrect(c, 236, 600, 80, 50, 8), WHITE, 4); write(c, "2", 248, 608, 34, INK, 5); write(c, "mm", 270, 616, 24, INK, 3.5);
};
// ------------------------------------------------------------------ e2 · sugar lumps
const threeGlasses = (c: Ctx, y: number, kinds: ("cube" | "pieces" | "powder" | "none" | "half" | "bits")[]) => {
  [270, 540, 810].forEach((x, i) => {
    glass(c, x, y, 210, 320, 0.72, COL.water);
    c.save(); c.globalAlpha = 0.92;
    const k = kinds[i];
    if (k === "cube") sugarCube(c, x, y - 8, 52); if (k === "half") sugarCube(c, x, y - 8, 36);
    if (k === "pieces") sugarPieces(c, x, y - 8, 46); if (k === "bits") { cube(c, x - 30, y - 8, 14, 7, SUG, 3); cube(c, x + 16, y - 8, 11, 6, SUG, 3); }
    if (k === "powder") sugarPowder(c, x, y - 8, 60);
    c.restore();
  });
};
// 1. three glasses of water: a whole cube, broken pieces, powder, each at the bottom
const e2s0 = (c: Ctx) => { counter(c, 860); threeGlasses(c, 880, ["cube", "pieces", "powder"]); };
// 2. a sugar cube wrapped in a cloth, tapped gently with the back of a spoon
const e2s1 = (c: Ctx) => {
  counter(c, 840);
  // the cloth bundle, a lump in its middle
  shadow(c, 560, 850, 240, 24);
  const cloth = () => { c.moveTo(300, 850); c.quadraticCurveTo(320, 760, 440, 720); c.quadraticCurveTo(480, 640, 560, 650); c.quadraticCurveTo(640, 650, 660, 720); c.quadraticCurveTo(780, 740, 820, 850); c.closePath(); };
  shape(c, cloth, COL.cloth); shade(c, cloth, "#ddd3bf", 40, 0, 0.6);
  line(c, [[420, 840], [470, 760]], 4, "#c9bfa9"); line(c, [[660, 840], [630, 760]], 4, "#c9bfa9"); line(c, [[520, 840], [540, 790]], 4, "#c9bfa9");
  shape(c, () => { c.moveTo(640, 735); c.quadraticCurveTo(720, 700, 790, 715); c.quadraticCurveTo(730, 740, 700, 790); c.closePath(); }, COL.cloth, 5);
  // the spoon, held upside down from the right, its back just above the lump
  spoon(c, 563, 640, -Math.PI / 2, 260);
  sleeve(c, 720, 470, 0, 400);
  hand(c, 640, 470, Math.PI, 1.1);
  arrow(c, [[470, 520], [470, 610]], RED, 8);
};
// 3. three hands dropping the three kinds of sugar into three glasses at the same moment, a timer starting
const e2s2 = (c: Ctx) => {
  counter(c, 880);
  threeGlasses(c, 900, ["none", "none", "none"]);
  timer(c, 980, 180, 80, "0", 0);
  [270, 540, 810].forEach((x, i) => {
    const adult = i === 1, skin = adult ? SKIN.adult : SKIN.child, cl = adult ? CLOTH.adult : CLOTH.child;
    sleeve(c, x, 100, -Math.PI / 2, 150, cl);
    hand(c, x, 190, Math.PI / 2, 1.05, skin, cl);
    if (i === 0) sugarCube(c, x - 10, 400, 52); if (i === 1) sugarPieces(c, x - 8, 400, 46);
    if (i === 2) { const r = rnd(9); for (let k = 0; k < 24; k++) shape(c, () => ell(c, x - 40 + r() * 80, 330 + r() * 90, 5, 4), WHITE, 1.5); }
    arrow(c, [[x, 440], [x, 540]], RED, 8);
  });
};
// 4. a child looking at the side of a glass to check whether any sugar remains at the bottom
const e2s3 = (c: Ctx) => {
  ground(c);
  // a table at the child's eye level
  shadow(c, 760, 1000, 260, 18);
  shape(c, () => polyP(c, [[500, 640], [1040, 640], [1040, 672], [500, 672]]), COL.wood);
  line(c, [[540, 672], [540, 990]], 22, INK); line(c, [[540, 672], [540, 990]], 12, COL.woodDk); line(c, [[1000, 672], [1000, 990]], 22, INK); line(c, [[1000, 672], [1000, 990]], 12, COL.woodDk);
  glass(c, 760, 640, 210, 320, 0.72, COL.water);
  c.globalAlpha = 0.92; cube(c, 735, 632, 16, 8, SUG, 3); cube(c, 770, 632, 12, 6, SUG, 3); c.globalAlpha = 1;
  const h = 560, p = person(c, 330, 990, h, { reachR: [505, 650], dir: 1 });
  void p;
  // the line of sight, from the eyes to the bottom of the glass
  c.setLineDash([10, 14]); line(c, [[395, 505], [690, 600]], 4, COL.greyDk); c.setLineDash([]);
};
// ------------------------------------------------------------------ e3 · drop and stir
// 1. three glasses in a row in front of a white sheet of paper, labelled still cold, still warm, stirred cold
const e3s0 = (c: Ctx) => {
  counter(c, 860);
  shadow(c, 560, 870, 470, 14);
  shape(c, () => polyP(c, [[80, 110], [1000, 110], [1000, 860], [80, 860]]), WHITE, 5);
  [270, 540, 810].forEach((x, i) => { dyeGlass(c, x, 880, 210, 320, "plain"); if (i === 1) steam(c, x, 500, 70, COL.greyDk); });
  stirTags(c, [270, 540, 810], 985);
};
// 2. a spoon touching the surface of the water, letting one drop of food colour fall in
const e3s1 = (c: Ctx) => {
  counter(c, 900);
  glass(c, 500, 900, 380, 560, 0.7, COL.water);
  const sy = 900 - 560 * 0.7;
  spoon(c, 540, sy - 6, -Math.PI * 0.3, 470);
  sleeve(c, 852, 350, 0.629, 400);
  hand(c, 782, 300, -2.513, 1.1);
  shape(c, () => { c.moveTo(540, sy + 10); c.quadraticCurveTo(522, sy - 10, 536, sy - 22); c.quadraticCurveTo(552, sy - 10, 540, sy + 10); c.closePath(); }, RED, 3);
  shape(c, () => ell(c, 540, sy + 10, 24, 7), RED, 0);
  // the food colour bottle, on the counter beside the glass
  shadow(c, 880, 906, 60, 10);
  shape(c, () => rrect(c, 830, 740, 100, 160, 16), RED, 5); shape(c, () => rrect(c, 855, 700, 50, 46, 8), COL.black, 5);
  shape(c, () => rrect(c, 848, 790, 64, 70, 6), WHITE, 3); shape(c, () => ell(c, 880, 825, 16, 20), RED, 0);
};
// 3. a spoon stirring the third glass gently for three turns, the other two standing still
const e3s2 = (c: Ctx) => {
  counter(c, 860);
  dyeGlass(c, 270, 880, 210, 320, "top"); dyeGlass(c, 540, 880, 210, 320, "top"); dyeGlass(c, 810, 880, 210, 320, "even");
  spoon(c, 790, 860, -Math.PI * 0.42, 440);
  stirArrow(c, 840, 470, 150);
  stirTags(c, [270, 540, 810], 985);
};
// 4. the three glasses after 10 minutes: a thin streak, a patchy cloud, evenly coloured
const e3s3 = (c: Ctx) => {
  counter(c, 860);
  timer(c, 960, 200, 80, "10", 10 / 60);
  dyeGlass(c, 270, 880, 210, 320, "streak"); dyeGlass(c, 540, 880, 210, 320, "cloud"); dyeGlass(c, 810, 880, 210, 320, "even");
  stirTags(c, [270, 540, 810], 985);
};

// ------------------------------------------------------------------ card pictures
// flow.e1: the three pieces cut open after the dye: the slice red through, the small cube nearly so, the big cube red only at the edge
const flowE1 = (c: Ctx) => {
  counter(c, 880);
  shadow(c, 560, 905, 460, 24);
  shape(c, () => polyP(c, [[150, 560], [980, 560], [1030, 860], [100, 860]]), COL.wood);
  shape(c, () => polyP(c, [[100, 860], [1030, 860], [1030, 892], [100, 892]]), COL.woodDk);
  cube(c, 120, 780, 320, 60, DYE, 5, 36);
  cutCube(c, 230, 780, 160, 60, 40);
  cutCube(c, 480, 780, 320, 90, 40);
  ruler(c, 120, 800, 5, 160, 56);
};
// flow.e2: the same three glasses after a while: the powder is gone, the pieces are small, the cube is still there
const flowE2 = (c: Ctx) => { counter(c, 860); threeGlasses(c, 880, ["half", "bits", "none"]); timer(c, 960, 200, 80, "5", 5 / 60); };
// flow.e3: still cold, still warm and stirred: a thread, a patchy cloud, an even colour
const flowE3 = (c: Ctx) => {
  counter(c, 860);
  dyeGlass(c, 270, 880, 210, 320, "streak"); dyeGlass(c, 540, 880, 210, 320, "cloud"); dyeGlass(c, 810, 880, 210, 320, "even");
  spoon(c, 790, 860, -Math.PI * 0.42, 440);
  steam(c, 540, 500, 70, COL.greyDk);
  stirTags(c, [270, 540, 810], 985);
};
// flow.a1: squares 2, 4, 6 and 8 cells wide on squared paper: the outside ring red, the middle blue
const flowA1 = (c: Ctx) => {
  ground(c);
  const cell = 40, x0 = 60, y0 = 140, w = 960, h = 800;
  shadow(c, x0 + w / 2 + 14, y0 + h + 10, w / 2, 16);
  shape(c, () => polyP(c, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]), WHITE, 5);
  c.strokeStyle = "#c7d8ea"; c.lineWidth = 1.5;
  for (let x = x0 + cell; x < x0 + w; x += cell) { c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y0 + h); c.stroke(); }
  for (let y = y0 + cell; y < y0 + h; y += cell) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke(); }
  let x = x0 + cell;
  for (const n of [2, 4, 6, 8]) {
    const top = y0 + h - cell * 3 - n * cell;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const ring = i === 0 || j === 0 || i === n - 1 || j === n - 1; c.fillStyle = ring ? COL.red : COL.blue; c.fillRect(x + i * cell + 1, top + j * cell + 1, cell - 2, cell - 2); }
    line(c, [[x, top], [x + n * cell, top], [x + n * cell, top + n * cell], [x, top + n * cell], [x, top]], 4);
    write(c, String(n), x + (n * cell) / 2 - 12, top + n * cell + 14, 40, INK, 5);
    x += n * cell + cell;
  }
};
// flow.a2: eight cubes as a solid block, as a flat layer, and as a long line
const flowA2 = (c: Ctx) => {
  counter(c, 940);
  const s = 84, d = 38, col = { top: "#ffe27a", front: COL.yellow, side: "#d9ab2d" };
  const grid = (x: number, y: number, nx: number, ny: number, nz: number) => { for (let k = ny - 1; k >= 0; k--) for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) cube(c, x + i * s + k * d, y - j * s - k * d * DEPTH, s, d, col, 4); };
  shadow(c, 260, 572, 150, 20); grid(140, 560, 2, 2, 2);
  shadow(c, 760, 572, 230, 20); grid(560, 560, 4, 2, 1);
  shadow(c, 540, 892, 360, 18); grid(200, 880, 8, 1, 1);
};
// flow.a3: a finger pushed down through the powder keeps a silvery coat of air under the water
const flowA3 = (c: Ctx) => {
  counter(c, 900);
  const bx = 500, by = 520, rx = 360, ry = 300, wy = by + 40;
  shadow(c, bx + 40, by + ry + 10, rx * 0.7, 26);
  const bowl = () => { c.moveTo(bx - rx, by); c.bezierCurveTo(bx - rx, by + ry * 1.35, bx + rx, by + ry * 1.35, bx + rx, by); c.closePath(); };
  shape(c, bowl, "#dcecf7", 0);
  c.save(); c.beginPath(); bowl(); c.clip();
  c.fillStyle = COL.water; c.fillRect(bx - rx, wy, rx * 2, ry * 2);
  // the silvery coat of air round the finger below the surface
  shape(c, () => rrect(c, bx - 92, wy - 10, 184, 330, 60), "#e6eef5", 4);
  shine(c, [[bx - 70, wy + 40], [bx - 70, wy + 260]], 10);
  c.restore();
  fingerDown(c, bx, wy + 290, 560, 110);
  // the powder: a white dusting on the surface, dented where the finger goes in
  const r = rnd(21);
  for (let i = 0; i < 70; i++) { const px = bx - rx * 0.95 + r() * rx * 1.9; if (Math.abs(px - bx) < 100) continue; shape(c, () => ell(c, px, wy - 2 + r() * 6, 7 + r() * 9, 4), WHITE, 2); }
  shape(c, () => ell(c, bx, wy, rx, 14), "rgba(255,255,255,0.0)", 0);
  shape(c, bowl, "rgba(214,236,250,0.35)", 6);
  shape(c, () => ell(c, bx, by, rx, 30), "rgba(255,255,255,0.4)", 6);
  shine(c, [[bx - rx * 0.8, by + 60], [bx - rx * 0.6, by + 240]], 8);
};
// flow.a4: a child and a grown-up at a fish stall, looking at a crab on a tray
const flowA4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d5b8"; c.fillRect(0, 1000, D, 80);
  // the stall counter, a tray on it, the crab on the tray
  shape(c, () => polyP(c, [[330, 620], [820, 620], [820, 660], [330, 660]]), COL.wood);
  shape(c, () => polyP(c, [[350, 660], [800, 660], [800, 1000], [350, 1000]]), COL.woodDk);
  line(c, [[350, 760], [800, 760]], 4); line(c, [[350, 880], [800, 880]], 4);
  shape(c, () => polyP(c, [[390, 540], [770, 540], [800, 620], [360, 620]]), COL.steel, 5);
  shape(c, () => polyP(c, [[410, 552], [752, 552], [776, 608], [386, 608]]), COL.steelIn, 3);
  crab(c, 630, 578, 200);
  const ad = person(c, 230, 1000, 660, { adult: true, reachR: [426, 574], dir: 1 });
  void ad;
  person(c, 920, 1000, 470, { reachL: [805, 640], dir: -1 });
};
// flow.a5: a closed pipe (a syringe into a straw) and an open soak (sponges in a row)
const flowA5 = (c: Ctx) => {
  ground(c);
  // the closed pipe, on a shelf line at the top: syringe, clay seal, straw, cup
  line(c, [[60, 470], [1020, 470]], 5);
  shadow(c, 300, 476, 190, 12);
  shape(c, () => rrect(c, 110, 330, 300, 110, 10), "rgba(214,236,250,0.9)", 5);
  shape(c, () => polyP(c, [[118, 338], [360, 338], [360, 432], [118, 432]]), RED, 0);
  shape(c, () => rrect(c, 60, 360, 70, 50, 8), COL.steel, 5); shape(c, () => rrect(c, 350, 350, 14, 70, 4), COL.black, 4);
  shape(c, () => polyP(c, [[410, 370], [450, 375], [450, 395], [410, 400]]), COL.steel, 4);
  shape(c, () => ell(c, 470, 385, 40, 36), CLAY, 5);
  shape(c, () => rrect(c, 490, 372, 400, 26, 13), "#f29ab4", 5);
  shape(c, () => polyP(c, [[494, 376], [700, 376], [700, 394], [494, 394]]), RED, 0);
  arrow(c, [[150, 290], [330, 290]], RED, 8);
  glass(c, 930, 470, 130, 170, 0.15, "#f0a090");
  shape(c, () => { c.moveTo(885, 400); c.quadraticCurveTo(880, 430, 892, 440); c.quadraticCurveTo(904, 430, 896, 400); c.closePath(); }, RED, 3);
  // the open soak: a tray with five damp sponges touching end to end, a pool of red at the left
  line(c, [[60, 940], [1020, 940]], 5);
  shadow(c, 560, 946, 440, 14);
  shape(c, () => polyP(c, [[120, 760], [1000, 760], [1020, 920], [100, 920]]), COL.teal, 5);
  shape(c, () => polyP(c, [[140, 775], [980, 775], [996, 905], [124, 905]]), COL.tealDk, 0);
  shape(c, () => { c.moveTo(150, 900); c.quadraticCurveTo(150, 820, 230, 810); c.quadraticCurveTo(300, 840, 290, 900); c.closePath(); }, RED, 3);
  for (let i = 0; i < 5; i++) { cube(c, 250 + i * 140, 880, 110, 40, SPONGE, 4, 140); }
  c.save(); c.globalAlpha = 0.85; shape(c, () => polyP(c, [[250, 770], [330, 770], [310, 880], [250, 880]]), COL.red, 0); shape(c, () => polyP(c, [[330, 790], [380, 800], [360, 880], [310, 880]]), "#f0a090", 0); c.restore();
  arrow(c, [[250, 720], [430, 720]], RED, 8);
};
// flow.p1: a child blows into a cardboard roll with four straws; a paper strip flutters at the end of each
const flowP1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d5b8"; c.fillRect(0, 980, D, 100);
  const h = 540, x = 230, y = 980, ry = 541;
  person(c, x, y, h, { reachR: [430, 600], dir: 1 });
  // the roll runs from the child's mouth to the right; the far end is plugged with clay
  shadow(c, 560, 600, 300, 10);
  shape(c, () => rrect(c, 300, ry - 48, 565, 96, 10), "#c69a5b", 5);
  shade(c, () => rrect(c, 300, ry - 48, 565, 96, 10), "#a37a40", 0, 30, 0.5);
  shape(c, () => ell(c, 865, ry, 18, 48), CLAY, 5);
  shape(c, () => ell(c, 300, ry, 14, 48), "#8d6a3a", 5);
  // four straws down from the roll, sealed with clay, a paper strip hanging and fluttering at each end
  [370, 500, 630, 760].forEach((sx, i) => {
    shape(c, () => ell(c, sx, ry + 48, 30, 14), CLAY, 4);
    shape(c, () => rrect(c, sx - 10, ry + 40, 20, 150, 8), i % 2 ? "#5bc0de" : "#f29ab4", 4);
    const tx = sx + 22;
    shape(c, () => { c.moveTo(sx, ry + 190); c.quadraticCurveTo(tx + 10, ry + 240, tx + 40, ry + 300); c.lineTo(tx + 62, ry + 288); c.quadraticCurveTo(tx + 24, ry + 230, sx + 20, ry + 184); c.closePath(); }, WHITE, 4);
    line(c, [[tx + 80, ry + 250], [tx + 110, ry + 240]], 4, COL.greyDk); line(c, [[tx + 84, ry + 280], [tx + 114, ry + 270]], 4, COL.greyDk);
  });
  // the air going along the roll
  arrow(c, [[330, ry - 90], [470, ry - 90]], COL.blue, 8);
};
// term.5 gill: a crab with the side of her shell lifted to show rows of feathery gills
const termGill = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 740, 330, 50);
  crab(c, 520, 560, 560, true);
  arrow(c, [[960, 300], [860, 440]], RED, 8);
};

export const ic_animalsInvertebratesL4 = cards("sci.animals.invertebrates.L4", [
  e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, e2s3, e3s0, e3s1, e3s2, e3s3,
  flowE1, flowE2, flowE3, flowA1, flowA2, flowA3, flowA4, flowA5, flowP1, termGill,
]);
