import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, person, write, cards } from "./flatKit";

// CARING FOR OUR ENVIRONMENT (L2) · the wet loop test, the bag in the bucket, loops in dry waste, kite string.
// Flat set-up kit look; same child (orange kurta) and grown-up (blue) on every card.

const PINK = "#f6b8c8", PAPER_WET = "#e7e0d2", BAG = "rgba(255,255,255,0.86)";
type Kind = "paper" | "cloth" | "plastic";
const kindCol = (k: Kind) => (k === "paper" ? COL.paper : k === "cloth" ? COL.cloth : "#eef3f7");

// a table top from y down
const table = (c: Ctx, y = 560) => { shape(c, () => c.rect(-20, y, D + 40, D - y + 40), COL.wood, 6); c.fillStyle = COL.woodDk; c.globalAlpha = 0.35; c.fillRect(0, y + 4, D, 22); c.globalAlpha = 1; };
// a flat strip lying at (x, y), length w, width h, turned by an
const strip = (c: Ctx, x: number, y: number, w: number, h: number, an: number, k: Kind) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 10, h * 0.6, w * 0.5, h * 0.35);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), kindCol(k), 5);
  if (k === "paper") for (let i = 0; i < 3; i++) line(c, [[-w / 2 + 24, -h / 4 + i * h / 4], [w / 2 - 24, -h / 4 + i * h / 4]], 3, COL.grey);
  if (k === "cloth") { c.strokeStyle = COL.pink; c.lineWidth = 3; for (let i = -w / 2 + 20; i < w / 2 - 10; i += 28) { c.beginPath(); c.moveTo(i, -h / 2 + 8); c.lineTo(i + 12, h / 2 - 8); c.stroke(); } }
  if (k === "plastic") { c.fillStyle = COL.blue; c.fillRect(-w / 2 + 6, -h * 0.18, w - 12, h * 0.36); shine(c, [[-w / 2 + 30, -h * 0.36], [w / 2 - 30, -h * 0.36]], 5); }
  c.restore();
};
// a strip tied into a loop: a thick ring with a knot at the top. open = [a1, a2]: only that arc (a torn loop)
const ring = (c: Ctx, x: number, y: number, rx: number, ry: number, k: Kind, lw = 26, col = kindCol(k), open?: [number, number]) => {
  const path = () => { c.beginPath(); if (open) c.ellipse(x, y, rx, ry, 0, open[0], open[1]); else ell(c, x, y, rx, ry); };
  c.lineCap = "round";
  path(); c.strokeStyle = INK; c.lineWidth = lw + 8; c.stroke();
  path(); c.strokeStyle = col; c.lineWidth = lw; c.stroke();
  if (k === "plastic") { path(); c.strokeStyle = COL.blue; c.lineWidth = lw * 0.35; c.stroke(); }
  if (k === "cloth") { c.save(); c.setLineDash([6, 14]); path(); c.strokeStyle = COL.pink; c.lineWidth = 3; c.stroke(); c.restore(); }
  if (k === "paper") { c.save(); c.setLineDash([18, 10]); path(); c.strokeStyle = COL.grey; c.lineWidth = 2.5; c.stroke(); c.restore(); }
  if (!open) shape(c, () => ell(c, x, y - ry, lw * 0.8, lw * 0.65), col, 5);
};
// scissors with the pivot at (x, y), blades pointing along an
const scissors = (c: Ctx, x: number, y: number, an: number, s = 1, open = 0.5) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) {
    c.save(); c.rotate(k * open * 0.5);
    shape(c, () => polyP(c, [[0, -9 * k], [150, -4 * k], [170, 0], [150, 4 * k], [0, 9 * k]]), COL.steel, 5);
    c.beginPath(); ell(c, -75, k * 22, 55, 30); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.beginPath(); ell(c, -75, k * 22, 55, 30); c.strokeStyle = COL.red; c.lineWidth = 13; c.stroke();
    c.restore();
  }
  shape(c, () => ell(c, 0, 0, 10, 10), COL.steelDk, 4);
  c.restore();
};
// a washed milk packet: a white pouch with a blue band
const milkPacket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 14, y + h / 2 + 8, w * 0.5, h * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 26), "#f4f7fb");
  shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 26), COL.steel, w * 0.3, 0, 0.45);
  c.fillStyle = COL.blue; c.fillRect(x - w / 2 + 6, y - h * 0.12, w - 12, h * 0.24);
  c.fillStyle = COL.blueDk; c.fillRect(x - w * 0.3, y - h * 0.04, w * 0.6, h * 0.08);
  line(c, [[x - w / 2 + 12, y - h / 2 + 18], [x + w / 2 - 12, y - h / 2 + 18]], 4, COL.steelDk);
  shine(c, [[x - w * 0.36, y - h * 0.38], [x - w * 0.36, y - h * 0.2]], 7);
};
// a thin carry bag, crumpled, handles up
const carryBag = (c: Ctx, x: number, y: number, s = 1, col = "#f4f7fb") => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 14, 112, 120, 18);
  shape(c, () => { c.moveTo(-100, -40); c.quadraticCurveTo(-120, 40, -90, 105); c.quadraticCurveTo(0, 125, 95, 100); c.quadraticCurveTo(125, 40, 100, -40); c.quadraticCurveTo(50, -60, 0, -50); c.quadraticCurveTo(-50, -60, -100, -40); c.closePath(); }, col);
  for (const k of [-1, 1]) shape(c, () => { c.moveTo(k * 70, -42); c.quadraticCurveTo(k * 60, -130, k * 20, -100); c.quadraticCurveTo(k * 40, -70, k * 25, -50); c.closePath(); }, col, 5);
  line(c, [[-60, 10], [-20, 60]], 3, COL.grey); line(c, [[40, -10], [60, 70]], 3, COL.grey);
  c.restore();
};
// a chips packet: a bright pillow with crimped ends
const chipsPacket = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shadow(c, 12, 70, 110, 22);
  shape(c, () => { c.moveTo(-110, -70); c.quadraticCurveTo(0, -95, 110, -70); c.quadraticCurveTo(130, 0, 110, 70); c.quadraticCurveTo(0, 95, -110, 70); c.quadraticCurveTo(-130, 0, -110, -70); c.closePath(); }, COL.yellow);
  shape(c, () => ell(c, 0, 0, 62, 42), COL.red, 4);
  shape(c, () => ell(c, 0, 0, 30, 20), COL.orange, 0);
  for (const k of [-1, 1]) for (let i = -60; i <= 60; i += 20) line(c, [[k * 112, i], [k * 126, i]], 3);
  c.restore();
};
// a rubber band
const rubberBand = (c: Ctx, x: number, y: number, r: number, open = false) => {
  const p = () => { c.beginPath(); if (open) c.ellipse(x, y, r, r * 0.6, 0.3, 0.6, Math.PI * 2 - 0.2); else ell(c, x, y, r, r * 0.6, 0.3); };
  c.lineCap = "round"; p(); c.strokeStyle = INK; c.lineWidth = 18; c.stroke(); p(); c.strokeStyle = COL.orange; c.lineWidth = 10; c.stroke();
};
// a cloth mask with ear loops
const mask = (c: Ctx, x: number, y: number, an = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 10, 75, 120, 20);
  for (const k of [-1, 1]) { c.beginPath(); c.ellipse(k * 150, 0, 60, 40, 0, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.beginPath(); c.ellipse(k * 150, 0, 60, 40, 0, 0, Math.PI * 2); c.strokeStyle = WHITE; c.lineWidth = 7; c.stroke(); }
  shape(c, () => rrect(c, -115, -65, 230, 130, 22), COL.sky);
  for (let i = -30; i <= 30; i += 30) line(c, [[-100, i], [100, i]], 4, COL.blue);
  c.restore();
};
// kite string: a pale pink line with an ink edge
const string = (c: Ctx, pts: number[][], w = 7) => { line(c, pts, w + 5, INK); line(c, pts, w, PINK); };
// tangled string round a centre
const tangle = (c: Ctx, x: number, y: number, r: number, seed: number) => { const g = rnd(seed); const pts: number[][] = []; for (let i = 0; i < 18; i++) pts.push([x + (g() - 0.5) * 2 * r, y + (g() - 0.5) * 1.2 * r]); c.save(); c.lineJoin = "round"; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.strokeStyle = INK; c.lineWidth = 12; c.stroke(); c.strokeStyle = PINK; c.lineWidth = 7; c.stroke(); c.restore(); };
// a pigeon standing with its feet at (x, y), facing right
const pigeon = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const G = "#a3abb5", GD = "#737d8a", H = "#6d7f98";
  for (const k of [-1, 1]) { line(c, [[k * 18, -40], [k * 22, 0]], 9, INK); line(c, [[k * 18, -40], [k * 22, 0]], 5, COL.orange); for (const t of [-1, 0, 1]) { line(c, [[k * 22, 0], [k * 22 + t * 14 + 8, 10]], 8, INK); line(c, [[k * 22, 0], [k * 22 + t * 14 + 8, 10]], 4, COL.orange); } }
  shape(c, () => polyP(c, [[-70, -80], [-150, -60], [-150, -40], [-80, -45]]), GD);
  shape(c, () => ell(c, 0, -80, 95, 62), G);
  shade(c, () => ell(c, 0, -80, 95, 62), GD, 30, 20, 0.5);
  shape(c, () => ell(c, -10, -90, 70, 36, -0.25), GD, 5);
  shape(c, () => ell(c, 75, -140, 38, 36), H);
  shape(c, () => ell(c, 60, -112, 42, 24), "#8fbf9a", 0);
  shape(c, () => polyP(c, [[108, -142], [135, -134], [108, -126]]), COL.orange, 4);
  shape(c, () => ell(c, 86, -148, 7, 7), INK, 0); shape(c, () => ell(c, 84, -150, 2.5, 2.5), WHITE, 0);
  c.restore();
};
// a plastic bucket, bottom centre (x, y). see = true: see-through, with water to level fill and whatever is drawn by inside()
const bucket = (c: Ctx, x: number, y: number, w: number, h: number, see = false, fill = 0.85, inside?: () => void) => {
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.1);
  if (see) {
    const ly = y - h * fill, lw = bot + (top - bot) * fill;
    shape(c, () => { c.moveTo(x - lw, ly); c.lineTo(x + lw, ly); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); }, COL.water, 0);
    if (inside) { c.save(); c.beginPath(); body(); c.clip(); inside(); c.restore(); }
    shape(c, () => ell(c, x, ly, lw, w * 0.07), COL.drop, 0);
    shape(c, body, COL.glass, 6);
  } else { shape(c, body, COL.red); shade(c, body, "#b03a2a", w * 0.3, 0, 0.5); }
  shape(c, () => ell(c, x, y - h, top, w * 0.09), see ? "rgba(255,255,255,0.3)" : COL.water, 6);
  line(c, [[x - top, y - h], [x - top * 0.6, y - h - w * 0.35], [x + top * 0.6, y - h - w * 0.35], [x + top, y - h]], 14, INK);
  line(c, [[x - top, y - h], [x - top * 0.6, y - h - w * 0.35], [x + top * 0.6, y - h - w * 0.35], [x + top, y - h]], 7, COL.steel);
};
// a thin bag puffed open under water, like a jellyfish: a dome with two handles trailing
const bagDome = (c: Ctx, x: number, y: number, r: number) => {
  for (const k of [-1, 1]) { const pts: number[][] = []; for (let i = 0; i <= 6; i++) pts.push([x + k * r * 0.55 + Math.sin(i * 1.3 + k) * r * 0.12, y + i * r * 0.28]); line(c, pts, 16, INK); line(c, pts, 9, "#f4f7fb"); }
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.2, x + r, y - r * 1.2, x + r, y); c.quadraticCurveTo(x + r * 0.5, y + r * 0.2, x, y + r * 0.05); c.quadraticCurveTo(x - r * 0.5, y + r * 0.2, x - r, y); c.closePath(); }, BAG, 6);
  shine(c, [[x - r * 0.6, y - r * 0.5], [x - r * 0.3, y - r * 0.8]], 7);
};
// a jellyfish: a pink dome with a frilled edge and long thin arms
const jellyfish = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = -3; i <= 3; i++) { const pts: number[][] = []; for (let j = 0; j <= 6; j++) pts.push([x + i * r * 0.26 + Math.sin(j * 1.1 + i) * r * 0.1, y + j * r * 0.3]); line(c, pts, 10, INK); line(c, pts, 5, COL.pink); }
  shape(c, () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.3, x + r, y - r * 1.3, x + r, y); for (let i = 3; i >= -3; i--) c.quadraticCurveTo(x + (i + 0.5) * r * 0.29, y + r * 0.22, x + i * r * 0.29, y + r * 0.06); c.closePath(); }, "#f7c6d6", 6);
  shape(c, () => ell(c, x, y - r * 0.45, r * 0.5, r * 0.22), COL.pink, 0);
  shine(c, [[x - r * 0.6, y - r * 0.5], [x - r * 0.3, y - r * 0.85]], 7);
};
// a sheet of paper (x, y top-left)
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.paper) => { shadow(c, x + w / 2 + 14, y + h + 8, w / 2, 14); shape(c, () => rrect(c, x, y, w, h, 10), col, 6); };
// tally marks: four strokes and a bar for each group of five, then the rest
const tally = (c: Ctx, x: number, y: number, n: number, h = 60) => { let cx = x; for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), k = i % 5; if (k < 4) line(c, [[cx + g * h * 1.6 + k * h * 0.3, y], [cx + g * h * 1.6 + k * h * 0.3, y + h]], 7); else line(c, [[cx + g * h * 1.6 - h * 0.1, y + h], [cx + g * h * 1.6 + h * 1.0, y]], 7, RED); } };
// a steel bowl full of water
const waterBowl = (c: Ctx, x: number, y: number, r: number) => bowl(c, x, y, r, COL.water);
// an open dustbin, bottom centre (x, y)
const bin = (c: Ctx, x: number, y: number, w: number, h: number, col = COL.green, dk = COL.greenDk) => {
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); };
  shadow(c, x + w * 0.1, y + 8, w * 0.55, w * 0.1);
  shape(c, body, col); shade(c, body, dk, w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), dk, 6);
  shape(c, () => ell(c, x, y - h, w * 0.42, w * 0.07), INK, 0);
};
const clock = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), WHITE); line(c, [[x, y], [x, y - r * 0.6]], 6); line(c, [[x, y], [x + r * 0.5, y + r * 0.3]], 6, RED); };

// ---------------------------------------------------------------- set-up cards
// e1 step 1: grown-up cuts a strip from a milk packet; two paper strips and a cloth strip lie ready
const setupE1_0 = (c: Ctx) => {
  ground(c); table(c, 300);
  strip(c, 540, 780, 600, 62, 0, "paper"); strip(c, 540, 880, 600, 62, 0, "paper"); strip(c, 540, 980, 600, 62, 0, "cloth");
  milkPacket(c, 300, 500, 300, 330);
  strip(c, 470, 505, 330, 62, Math.PI / 2, "plastic");
  hand(c, 860, 520, Math.PI, 1.4, SKIN.adult, CLOTH.adult);
  scissors(c, 740, 505, Math.PI, 1.1, 0.5);
  arrow(c, [[500, 300], [500, 400]]);
};
// e1 step 2: the child ties a strip into a loop; four loops in a row
const setupE1_1 = (c: Ctx) => {
  ground(c); table(c, 520);
  ring(c, 540, 300, 140, 90, "paper", 24, kindCol("paper"), [0.3, Math.PI * 2 - 0.3]);
  string(c, [[660, 230], [600, 300], [660, 340]], 24); // the two ends being knotted, drawn in paper colour
  line(c, [[660, 230], [600, 300], [660, 340]], 24, COL.paper);
  hand(c, 250, 320, 0, 1.2); hand(c, 850, 290, Math.PI, 1.2);
  const kinds: Kind[] = ["paper", "paper", "cloth", "plastic"];
  kinds.forEach((k, i) => ring(c, 185 + i * 236, 800, 100, 64, k, 24));
};
// e1 step 3: three loops in a bowl of water for 10 minutes; one paper loop stays dry
const setupE1_2 = (c: Ctx) => {
  ground(c); table(c, 420);
  waterBowl(c, 540, 600, 330);
  c.save(); c.beginPath(); ell(c, 540, 600, 322, 60); c.clip();
  ring(c, 400, 595, 125, 36, "paper", 20); ring(c, 690, 598, 125, 36, "plastic", 20); ring(c, 545, 625, 130, 34, "cloth", 20);
  c.restore();
  shape(c, () => ell(c, 540, 600, 330, 66), "rgba(255,255,255,0)", 6);
  ring(c, 930, 900, 110, 60, "paper", 24);
  arrow(c, [[540, 230], [540, 430]]);
  clock(c, 170, 190, 80); write(c, "10", 110, 300, 70);
};
// e1 step 4: a wet loop over the fingers of both hands, pulled gently apart
const setupE1_3 = (c: Ctx) => {
  ground(c); table(c, 760);
  ring(c, 540, 560, 220, 80, "paper", 26, PAPER_WET);
  hand(c, 210, 560, 0, 1.7); hand(c, 870, 560, Math.PI, 1.7);
  arrow(c, [[300, 340], [110, 340]]); arrow(c, [[780, 340], [970, 340]]);
  write(c, "1", 500, 880, 90);
};
// e2 step 1: a bucket of water on the bathroom floor; bag, newspaper and handkerchief beside it
const setupE2_0 = (c: Ctx) => {
  ground(c, COL.sky);
  c.strokeStyle = COL.glassEdge; c.lineWidth = 3; c.globalAlpha = 0.4; for (let i = 0; i <= D; i += 120) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, D); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(D, i); c.stroke(); } c.globalAlpha = 1;
  bucket(c, 400, 880, 440, 500);
  sheet(c, 700, 300, 300, 230, COL.cloth); for (let i = 0; i < 5; i++) line(c, [[730, 340 + i * 40], [970, 340 + i * 40]], 4, COL.grey);
  carryBag(c, 850, 680, 1.05);
  shape(c, () => rrect(c, 720, 840, 260, 160, 10), WHITE); line(c, [[720, 920], [980, 920]], 4, COL.grey); shape(c, () => rrect(c, 740, 860, 220, 120, 8), WHITE, 3);
};
// e2 step 2: from the side, the bag drifts under the water, puffed like a jellyfish; a spoon stirs slowly
const setupE2_1 = (c: Ctx) => {
  ground(c); table(c, 900);
  bucket(c, 500, 900, 640, 640, true, 0.86, () => bagDome(c, 470, 560, 150));
  line(c, [[900, 120], [690, 420]], 30, INK); line(c, [[900, 120], [690, 420]], 18, COL.steel);
  shape(c, () => ell(c, 660, 465, 50, 32, 1), COL.steel);
  arrow(c, [[760, 560], [830, 640], [740, 700]]);
};
// e2 step 3: the child's drawing of the floating bag next to a picture of a jellyfish
const setupE2_2 = (c: Ctx) => {
  ground(c);
  sheet(c, 90, 130, 420, 460); sheet(c, 570, 130, 420, 460, "#e8f2fa");
  c.save(); c.globalAlpha = 0.8; c.setLineDash([]); // the child's pencil drawing
  line(c, [[170, 250], [200, 540], [400, 540], [430, 250], [170, 250]], 6, COL.greyDk);
  c.beginPath(); c.moveTo(220, 390); c.bezierCurveTo(220, 290, 380, 290, 380, 390); c.quadraticCurveTo(300, 410, 220, 390); c.strokeStyle = COL.greyDk; c.lineWidth = 6; c.stroke();
  line(c, [[250, 400], [245, 500]], 5, COL.greyDk); line(c, [[350, 400], [360, 500]], 5, COL.greyDk);
  c.restore();
  jellyfish(c, 780, 330, 130);
  person(c, 540, 1200, 620);
  arrow(c, [[460, 680], [560, 680]]);
};

// ---------------------------------------------------------------- card pictures
// e1: the wet paper loop tears in the child's hands; the plastic loop lies stretched but whole, by the bowl
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 500);
  ring(c, 540, 300, 230, 85, "paper", 26, PAPER_WET, [0.35, Math.PI * 1.35]);
  ring(c, 540, 300, 230, 85, "paper", 26, PAPER_WET, [Math.PI * 1.65, Math.PI * 1.95]);
  hand(c, 180, 300, 0, 1.4); hand(c, 900, 300, Math.PI, 1.4);
  ring(c, 360, 820, 250, 60, "plastic", 20);
  waterBowl(c, 870, 760, 170);
};
// e2: the bag puffed open under the water, drifting like the jellyfish in the picture
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 920);
  bucket(c, 360, 920, 520, 600, true, 0.86, () => bagDome(c, 340, 560, 130));
  sheet(c, 680, 240, 330, 460, "#e8f2fa"); jellyfish(c, 845, 420, 110);
};
// a1: one day's dry waste on a newspaper; the child snips a rubber band open; tally marks on a paper
const flowA1 = (c: Ctx) => {
  ground(c);
  sheet(c, 60, 300, 960, 740, COL.cloth); for (let i = 0; i < 12; i++) line(c, [[100, 350 + i * 56], [980, 350 + i * 56]], 3, "#d9d3c4");
  chipsPacket(c, 270, 470, -0.3, 0.95); mask(c, 720, 440, 0.15);
  tangle(c, 260, 850, 150, 5);
  milkPacket(c, 520, 900, 160, 180);
  rubberBand(c, 690, 760, 65, true);
  hand(c, 960, 600, Math.PI - 0.5, 1.2); scissors(c, 886, 640, Math.PI - 0.5, 1.1, 0.5);
  sheet(c, 90, 90, 330, 180, WHITE); tally(c, 130, 140, 7, 70);
};
// a2: the child at a window with a notebook, looking down at a parking area, a street and a garden
const flowA2 = (c: Ctx) => {
  ground(c, COL.cloth);
  // outside: sky, buildings, road, cars, a garden
  shape(c, () => c.rect(120, 100, 840, 660), COL.sky, 0);
  shape(c, () => c.rect(560, 180, 300, 300), COL.steelIn); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) shape(c, () => c.rect(600 + j * 90, 220 + i * 80, 50, 50), COL.blue, 4);
  shape(c, () => c.rect(120, 480, 840, 170), COL.greyDk, 0); line(c, [[160, 565], [920, 565]], 6, COL.yellow);
  shape(c, () => { rrect(c, 180, 420, 240, 90, 24); }, COL.blue); shape(c, () => c.rect(220, 380, 150, 50), COL.sky, 5); shape(c, () => ell(c, 230, 515, 26, 26), INK, 0); shape(c, () => ell(c, 370, 515, 26, 26), INK, 0);
  chipsPacket(c, 760, 600, 0.3, 0.3);
  shape(c, () => c.rect(120, 650, 840, 110), COL.greenLt, 0);
  shape(c, () => ell(c, 260, 640, 110, 80), COL.leaf); line(c, [[260, 720], [260, 760]], 14, COL.brown);
  [700, 780, 860].forEach((x) => { line(c, [[x, 760], [x, 700]], 5, COL.leafDk); shape(c, () => ell(c, x, 690, 22, 22), COL.pink, 4); });
  // the window frame
  for (const r of [[120, 100, 840, 660]]) { c.strokeStyle = INK; c.lineWidth = 8; c.strokeRect(r[0], r[1], r[2], r[3]); }
  shape(c, () => c.rect(60, 60, 60, 740), COL.brown); shape(c, () => c.rect(960, 60, 60, 740), COL.brown); shape(c, () => c.rect(60, 60, 960, 40), COL.brown);
  shape(c, () => c.rect(520, 100, 40, 660), COL.brown); shape(c, () => c.rect(40, 760, 1000, 60), COL.brown);
  person(c, 300, 1180, 620, { armR: [0.3, -0.6] });
  sheet(c, 410, 760, 200, 250, WHITE); for (let i = 0; i < 4; i++) line(c, [[440, 810 + i * 50], [580, 810 + i * 50]], 4, COL.grey);
  shape(c, () => rrect(c, 600, 820, 150, 24, 6), COL.yellow, 5); shape(c, () => polyP(c, [[750, 820], [790, 832], [750, 844]]), SKIN.child, 4);
};
// a3: on the terrace, kite string hangs from the water tank; the child winds it round a stick
const flowA3 = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => c.rect(-20, 360, D + 40, 280), "#e4c6a0"); shape(c, () => c.rect(-20, 620, D + 40, 500), COL.grey);
  line(c, [[-20, 620], [D + 20, 620]], 6);
  shape(c, () => c.rect(700, 540, 40, 90), COL.greyDk); shape(c, () => c.rect(900, 540, 40, 90), COL.greyDk);
  shape(c, () => rrect(c, 660, 200, 320, 350, 40), COL.black); for (let i = 0; i < 4; i++) line(c, [[670, 270 + i * 70], [970, 270 + i * 70]], 4, COL.greyDk);
  shape(c, () => ell(c, 820, 200, 90, 24), COL.greyDk);
  string(c, [[690, 420], [640, 500], [680, 600], [600, 700]]); string(c, [[950, 300], [1010, 420], [960, 560], [1000, 680]]);
  tangle(c, 400, 720, 120, 9);
  person(c, 200, 1000, 700, { adult: true });
  person(c, 460, 1000, 520, { armR: [0.9, 0.1], armL: [Math.PI * 0.75, Math.PI * 0.2] });
  line(c, [[570, 712], [820, 704]], 26, INK); line(c, [[570, 712], [820, 704]], 16, COL.brown);
  for (let i = 0; i < 9; i++) string(c, [[640 + i * 12, 690], [650 + i * 12, 728]], 6);
  arrow(c, [[760, 640], [860, 690], [760, 740]]);
};
// p1: a tally sheet with a row for each day above the dry bin; the child snips a rubber band before it goes in
const flowP1 = (c: Ctx) => {
  ground(c, COL.cloth); table(c, 1000);
  sheet(c, 300, 90, 480, 480, WHITE);
  for (let d = 0; d < 7; d++) { write(c, String(d + 1), 340, 120 + d * 62, 42); line(c, [[400, 120 + d * 62], [400, 162 + d * 62]], 3, COL.grey); tally(c, 430, 118 + d * 62, [3, 2, 5, 1, 4, 2, 0][d], 44); }
  bin(c, 400, 1000, 300, 330);
  rubberBand(c, 690, 900, 55, true);
  hand(c, 960, 740, Math.PI - 0.6, 1.3); scissors(c, 885, 792, Math.PI - 0.6, 1.1, 0.5);
  arrow(c, [[620, 950], [480, 700]]);
};
// term: litter is rubbish outside the bin
const termLitter = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => c.rect(-20, 540, D + 40, 600), COL.steelIn); line(c, [[-20, 540], [D + 20, 540]], 6);
  for (let x = 0; x < D; x += 180) line(c, [[x, 540], [x - 60, D]], 4, COL.steelDk);
  bin(c, 820, 780, 260, 420);
  shape(c, () => ell(c, 820, 360, 150, 36), COL.greenDk); shape(c, () => rrect(c, 790, 290, 60, 40, 10), COL.greenDk, 5);
  chipsPacket(c, 300, 760, -0.35, 1.1);
  carryBag(c, 560, 900, 1.0);
};
// term: a pigeon on a branch, string wound round one foot
const termTrapped = (c: Ctx) => {
  ground(c, COL.sky);
  shape(c, () => { c.moveTo(-20, 780); c.quadraticCurveTo(400, 720, 700, 760); c.quadraticCurveTo(950, 790, D + 20, 740); c.lineTo(D + 20, 820); c.quadraticCurveTo(700, 850, 400, 800); c.quadraticCurveTo(100, 830, -20, 860); c.closePath(); }, COL.brown);
  [[150, 740], [880, 720]].forEach(([x, y]) => { for (let i = 0; i < 3; i++) shape(c, () => ell(c, x + i * 40 - 40, y - 60 + Math.abs(i - 1) * 30, 40, 24, i * 0.6), COL.leaf, 4); });
  pigeon(c, 540, 760, 2.2);
  const fx = 588, fy = 700;
  string(c, [[fx - 40, fy - 20], [fx + 40, fy - 10], [fx - 40, fy + 5], [fx + 40, fy + 15], [fx - 30, fy + 30]], 8);
  string(c, [[fx + 20, fy + 30], [fx + 80, fy + 90], [fx + 60, fy + 200], [fx + 130, fy + 320], [fx + 100, fy + 380]], 8);
};
// term: plastic things on a table: a milk packet, a carry bag, a straw, a reel of nylon string
const termPlastic = (c: Ctx) => {
  ground(c); table(c, 380);
  milkPacket(c, 250, 620, 280, 320);
  carryBag(c, 560, 560, 1.15);
  line(c, [[520, 950], [980, 760]], 30, INK); line(c, [[520, 950], [980, 760]], 20, COL.red); for (let i = 0; i < 8; i++) line(c, [[560 + i * 52, 934 - i * 21.5], [580 + i * 52, 925 - i * 21.5]], 20, WHITE);
  shadow(c, 880, 650, 130, 30);
  shape(c, () => rrect(c, 760, 400, 240, 240, 40), COL.wood); for (let i = 0; i < 12; i++) string(c, [[770, 430 + i * 16], [990, 440 + i * 16]], 6); shape(c, () => ell(c, 880, 400, 120, 30), COL.woodDk, 5); shape(c, () => ell(c, 880, 400, 40, 12), INK, 0);
  string(c, [[1000, 620], [1060, 700], [1040, 760]], 6);
};
// expl: a torn wet paper loop, a whole stretched plastic loop, a bowl of water
const explPlastic = (c: Ctx) => {
  ground(c); table(c, 300);
  waterBowl(c, 540, 330, 230);
  ring(c, 290, 820, 180, 95, "paper", 28, PAPER_WET, [0.5, Math.PI * 1.5]); ring(c, 290, 820, 180, 95, "paper", 28, PAPER_WET, [Math.PI * 1.75, Math.PI * 2.2]);
  ring(c, 770, 820, 250, 60, "plastic", 20);
  arrow(c, [[640, 700], [540, 700]]); arrow(c, [[900, 700], [1000, 700]]);
};

export const ic_environmentCaringL2 = cards("sci.environment.caring.L2", [
  setupE1_0, setupE1_1, setupE1_2, setupE1_3, setupE2_0, setupE2_1, setupE2_2,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowP1, termLitter, termTrapped, termPlastic, explPlastic,
]);
