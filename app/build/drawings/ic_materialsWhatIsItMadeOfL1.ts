import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, person, write, cards } from "./flatKit";

// WHAT ARE THINGS MADE OF? (L1) · set-up cards for the Paper Cup Puzzle, then activity/project cards and term cards.
const TABLE = "#e2cfa9", NEWS = "#e9e6de", NEWSWET = "#8e949c", CUPSH = "#d8d1c3", SKIN_FILM = "rgba(200,232,250,0.75)";
const table = (c: Ctx, y = 660) => { ground(c); c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.3, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.3, x, y - r * 1.6); c.closePath(); }, col, 4);
// a white paper cup, bottom centre (x, y); water = true shows water at the rim
const paperCup = (c: Ctx, x: number, y: number, w: number, h: number, water = false) => {
  const top = w / 2, bot = w * 0.4, ry = w * 0.1;
  shadow(c, x + w * 0.15, y + 6, w * 0.55, w * 0.12);
  const body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  shape(c, body, WHITE); shade(c, body, CUPSH, -w * 0.3, 0, 0.8);
  shape(c, () => ell(c, x, y - h, top, ry), water ? COL.water : "#f1ece1", 6);
  if (water) shape(c, () => ell(c, x - top * 0.3, y - h - ry * 0.2, top * 0.3, ry * 0.3), COL.drop, 0);
  shape(c, () => { c.moveTo(x - top, y - h); c.bezierCurveTo(x - top, y - h + ry * 2, x + top, y - h + ry * 2, x + top, y - h); c.lineTo(x + top, y - h + 14); c.bezierCurveTo(x + top, y - h + 14 + ry * 2, x - top, y - h + 14 + ry * 2, x - top, y - h + 14); c.closePath(); }, "#f6f2ea", 5);
};
// a newspaper cone, tip at (x, y), rim half-width w/2 at y-h
const cone = (c: Ctx, x: number, y: number, w: number, h: number, wet = false) => {
  const hw = w / 2, ry = w * 0.1, body = () => { c.moveTo(x - hw, y - h); c.lineTo(x + hw, y - h); c.lineTo(x, y); c.closePath(); };
  shape(c, body, wet ? NEWSWET : NEWS);
  c.save(); c.beginPath(); body(); c.clip();
  c.strokeStyle = wet ? "#5d636b" : "#9b978e"; c.lineWidth = 4; c.lineCap = "round";
  const r = rnd(3);
  for (let yy = y - h + 30; yy < y - 20; yy += 22) { const half = hw * (y - yy) / h; for (let xx = x - half + 10; xx < x + half - 10; xx += 46) { const len = 18 + r() * 20; c.beginPath(); c.moveTo(xx, yy); c.lineTo(Math.min(xx + len, x + half - 8), yy); c.stroke(); } }
  c.restore();
  shade(c, body, wet ? "#5d636b" : "#c8c4ba", -w * 0.25, 0, 0.6);
  line(c, [[x + hw * 0.6, y - h + 6], [x, y]], 4, INK); // the seam
  shape(c, () => ell(c, x, y - h, hw, ry), wet ? "#6f757d" : "#d8d4ca", 6);
  // tape on the seam
  c.save(); c.translate(x + hw * 0.4, y - h * 0.62); c.rotate(Math.atan2(h, -hw * 0.6)); shape(c, () => rrect(c, -34, -80, 68, 160, 8), "rgba(255,230,120,0.75)", 4); c.restore();
};
const spoon = (c: Ctx, x: number, y: number, len: number, an: number, col: string, dk: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -14, len, 28, 14), col);
  shape(c, () => ell(c, len + 44, 0, 60, 40), col);
  shade(c, () => ell(c, len + 44, 0, 60, 40), dk, -18, -10, 0.6);
  shape(c, () => ell(c, len + 44, 2, 42, 24), dk, 0);
  c.restore();
};

// ---------------------------------------------------------------- set-up cards, e1
// 1. a grown-up's hands rolling newspaper into a cone and taping it; a paper cup beside
const setup0 = (c: Ctx) => {
  table(c, 700);
  paperCup(c, 880, 720, 220, 260);
  shadow(c, 360, 712, 120, 20);
  cone(c, 330, 700, 300, 420);
  hand(c, 170, 575, -0.35, 1.7, SKIN.adult, CLOTH.adult);
  hand(c, 640, 400, Math.PI * 0.88, 1.6, SKIN.adult, CLOTH.adult, true);
  // tape roll on the table
  shape(c, () => ell(c, 560, 800, 60, 60), "#f3d36a"); shape(c, () => ell(c, 560, 800, 30, 30), TABLE, 5);
};
// 2. the child holds cone and cup over a steel plate while the grown-up spoons water in
const setup1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 890, 340, 95);
  glass(c, 190, 340, 150, 220, 0.75);
  cone(c, 330, 760, 260, 380);
  paperCup(c, 700, 790, 230, 280, true);
  hand(c, 190, 640, -0.4, 1.4);
  hand(c, 890, 700, Math.PI + 0.3, 1.4);
  // the spoon, tipping water into the cup
  spoon(c, 690, 300, 110, 0.5, COL.steel, COL.steelDk);
  hand(c, 600, 250, 0.5, 1.6, SKIN.adult, CLOTH.adult);
  drop(c, 760, 430, 12); drop(c, 745, 480, 10);
  arrow(c, [[860, 360], [790, 470]]);
  write(c, "3", 900, 150, 110, INK, 10);
};
// 3. the cone is dark and dripping onto the plate; the cup is dry and full
const setup2 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 880, 340, 95);
  shape(c, () => ell(c, 330, 880, 120, 30), COL.water, 4);
  cone(c, 330, 700, 260, 380, true);
  drop(c, 330, 760, 16); drop(c, 345, 815, 13);
  paperCup(c, 740, 890, 230, 280, true);
  hand(c, 190, 580, -0.4, 1.4);
};
// 4. the cup cut open and laid flat: a clear skin peels off the inside at the torn edge
const setup3 = (c: Ctx) => {
  table(c, 60); c.fillStyle = TABLE; c.fillRect(0, 0, D, D); ground(c); c.fillStyle = TABLE; c.fillRect(0, 0, D, D);
  const cx = 500, cy = -140, R = 820, r = 560, a0 = Math.PI * 0.36, a1 = Math.PI * 0.66;
  shadow(c, cx + 20, cy + R * 0.95 + 20, 360, 60);
  const band = () => { c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, r, a1, a0, true); c.closePath(); };
  shape(c, band, "#f6f2ea");
  // the inside of the cup faces up: a faint sheen over the paper
  c.save(); c.beginPath(); band(); c.clip(); c.globalAlpha = 0.35; c.fillStyle = COL.sky; c.fillRect(0, 0, D, D); c.globalAlpha = 1; c.restore();
  // the torn right edge, fuzzy
  const ex = cx + Math.cos(a0) * R, ey = cy + Math.sin(a0) * R, ix = cx + Math.cos(a0) * r, iy = cy + Math.sin(a0) * r;
  const rr = rnd(5);
  for (let t = 0; t < 1; t += 0.07) { const px = ix + (ex - ix) * t, py = iy + (ey - iy) * t; line(c, [[px, py], [px + 14 + rr() * 16, py - 6 + rr() * 12]], 3, "#b9b0a0"); }
  // the clear plastic skin peeling away from the torn edge
  shape(c, () => { c.moveTo(ix, iy); c.quadraticCurveTo(ix + 150, iy - 120, ix + 300, iy - 60); c.quadraticCurveTo(ix + 330, iy + 80, ix + 230, iy + 180); c.quadraticCurveTo(ix + 80, iy + 220, ex, ey); c.closePath(); }, SKIN_FILM, 5);
  shine(c, [[ix + 80, iy - 10], [ix + 220, iy + 30]], 8);
  arrow(c, [[980, 180], [ix + 230, iy + 10]]);
  // the round cup bottom and the scissors
  shape(c, () => ell(c, 250, 900, 120, 60), "#f6f2ea");
  c.save(); c.translate(760, 900); c.rotate(-0.4);
  shape(c, () => polyP(c, [[-10, 0], [180, -20], [180, 0]]), COL.steel, 5); shape(c, () => polyP(c, [[-10, 0], [180, 20], [180, 0]]), COL.steelDk, 5);
  shape(c, () => ell(c, -70, -36, 44, 30), COL.orange); shape(c, () => ell(c, -70, -36, 22, 14), TABLE, 4);
  shape(c, () => ell(c, -70, 36, 44, 30), COL.orange); shape(c, () => ell(c, -70, 36, 22, 14), TABLE, 4);
  c.restore();
};

// ---------------------------------------------------------------- activity / project cards
const materialCard = (c: Ctx, x: number, y: number, kind: number) => {
  shape(c, () => rrect(c, x, y, 210, 150, 8), WHITE, 5);
  const mx = x + 105, my = y + 78;
  if (kind === 0) { shape(c, () => rrect(c, mx - 70, my - 24, 140, 48, 6), COL.brown); for (let i = 0; i < 3; i++) line(c, [[mx - 60, my - 12 + i * 12], [mx + 60, my - 14 + i * 12]], 3, COL.soilDk); }
  if (kind === 1) { shape(c, () => polyP(c, [[mx - 38, my - 46], [mx + 38, my - 46], [mx + 28, my + 46], [mx - 28, my + 46]]), COL.steel, 5); shine(c, [[mx - 24, my - 30], [mx - 18, my + 20]], 5); }
  if (kind === 2) { shape(c, () => polyP(c, [[mx - 48, my - 30], [mx + 48, my - 30], [mx + 36, my + 48], [mx - 36, my + 48]]), COL.blue, 5); line(c, [[mx - 46, my - 28], [mx, my - 60], [mx + 46, my - 28]], 5); }
  if (kind === 3) { shape(c, () => rrect(c, mx - 50, my - 44, 100, 88, 4), COL.sky, 5); line(c, [[mx, my - 44], [mx, my + 44]], 4); line(c, [[mx - 50, my], [mx + 50, my]], 4); }
  if (kind === 4) { shape(c, () => polyP(c, [[mx - 58, my - 30], [mx - 26, my - 46], [mx + 26, my - 46], [mx + 58, my - 30], [mx + 44, my - 6], [mx + 30, my - 12], [mx + 30, my + 46], [mx - 30, my + 46], [mx - 30, my - 12], [mx - 44, my - 6]]), COL.orange, 5); }
  if (kind === 5) { shape(c, () => rrect(c, mx - 46, my - 46, 92, 92, 4), COL.red, 5); shape(c, () => rrect(c, mx - 36, my - 36, 72, 72, 3), COL.paper, 3); for (let i = 0; i < 3; i++) line(c, [[mx - 24, my - 16 + i * 16], [mx + 24, my - 16 + i * 16]], 3, COL.grey); }
};
// a1: six material cards on the kitchen floor; the child puts a steel ladle on the metal card, the grown-up points at a glass jar on the shelf
const flowA1 = (c: Ctx) => {
  ground(c);
  // shelf with a glass jar
  shape(c, () => rrect(c, 700, 300, 340, 26, 6), COL.wood);
  shape(c, () => rrect(c, 810, 190, 110, 112, 14), "#e8a04a"); shape(c, () => rrect(c, 810, 190, 110, 112, 14), COL.glass, 5); shape(c, () => rrect(c, 820, 160, 90, 36, 8), COL.steel); shine(c, [[828, 215], [828, 285]], 6);
  // the cards
  [0, 1, 2, 3, 4, 5].forEach((k) => materialCard(c, 70 + (k % 3) * 235, 560 + Math.floor(k / 3) * 190, k));
  // the child, laying a ladle on the metal card
  person(c, 180, 560, 440, { armR: [0.95, 0.9], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  const wx = 180 + 0.11 * 440 + Math.cos(0.95) * 0.17 * 440 + Math.cos(0.9) * 0.16 * 440, wy = 560 - 0.74 * 440 + 0.03 * 440 + Math.sin(0.95) * 0.17 * 440 + Math.sin(0.9) * 0.16 * 440;
  line(c, [[wx, wy], [410, 640]], 20, INK); line(c, [[wx, wy], [410, 640]], 12, COL.steel);
  shape(c, () => ell(c, 420, 650, 46, 28), COL.steel); shape(c, () => ell(c, 420, 646, 30, 16), COL.steelDk, 3);
  // the grown-up, pointing up at the jar
  person(c, 880, 1000, 620, { adult: true, armL: [-2.1, -2.0], armR: [Math.PI * 0.55, Math.PI * 0.5] });
  arrow(c, [[840, 430], [860, 330]]);
};
// a2: paper on a wooden board, a crayon rubbed on its side, the grain coming up
const flowA2 = (c: Ctx) => {
  table(c, 60); ground(c); c.fillStyle = TABLE; c.fillRect(0, 0, D, D);
  shadow(c, 560, 880, 420, 40);
  shape(c, () => rrect(c, 110, 300, 860, 560, 30), COL.wood);
  const grain = (y0: number, col: string, x0: number, x1: number, w: number) => { c.beginPath(); c.moveTo(x0, y0); for (let x = x0; x < x1; x += 40) c.quadraticCurveTo(x + 20, y0 + Math.sin(x / 90 + y0) * 10, x + 40, y0 + Math.sin((x + 40) / 90 + y0) * 10); c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
  for (let y = 340; y < 850; y += 48) grain(y, COL.woodDk, 125, 955, 4);
  // the paper sheet
  c.save(); c.translate(540, 580); c.rotate(-0.06);
  shadow(c, 20, 20, 330, 240);
  shape(c, () => rrect(c, -300, -230, 600, 460, 6), COL.paper, 5);
  c.save(); c.beginPath(); rrect(c, -290, -220, 420, 300, 4); c.clip();
  c.globalAlpha = 0.5; c.fillStyle = COL.brown; c.fillRect(-290, -220, 420, 300); c.globalAlpha = 1;
  for (let y = -200; y < 80; y += 36) grain(y, COL.soilDk, -290, 130, 6);
  c.restore(); c.restore();
  // the crayon, flat on its side, in the child's hand
  c.save(); c.translate(690, 690); c.rotate(-0.25); shape(c, () => rrect(c, -110, -26, 220, 52, 10), COL.brown); shape(c, () => polyP(c, [[-110, -26], [-150, 0], [-110, 26]]), COL.brown, 5); c.restore();
  hand(c, 760, 800, -2.0, 1.5);
  arrow(c, [[520, 440], [380, 440]]); arrow(c, [[380, 500], [520, 500]]);
};
// a3: tearing newspaper to see the fuzzy edge; pulling one thread from a frayed cloth
const flowA3 = (c: Ctx) => {
  ground(c);
  const r = rnd(9);
  // newspaper sheet with a strip torn off to the right
  shape(c, () => polyP(c, [[90, 90], [560, 90], [560, 500], [90, 500]]), NEWS);
  c.strokeStyle = "#9b978e"; c.lineWidth = 4; c.lineCap = "round";
  for (let y = 130; y < 480; y += 24) for (let x = 120; x < 530; x += 60) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 20 + r() * 30, y); c.stroke(); }
  // the torn edge: jagged, with fuzzy hairs
  const edge: number[][] = []; for (let y = 90; y <= 500; y += 24) edge.push([560 + (r() - 0.5) * 20, y]);
  line(c, edge, 6, INK);
  edge.forEach(([x, y]) => { line(c, [[x, y], [x + 16 + r() * 18, y - 8 + r() * 16]], 3, "#8e8a80"); line(c, [[x, y + 12], [x + 10 + r() * 16, y + 14 + r() * 14]], 3, "#8e8a80"); });
  // the strip, held and pulled away
  shape(c, () => polyP(c, [[640, 100], [760, 100], [760, 500], [640, 500]]), NEWS);
  for (let y = 140; y < 480; y += 24) { c.beginPath(); c.moveTo(660, y); c.lineTo(740, y); c.strokeStyle = "#9b978e"; c.lineWidth = 4; c.stroke(); }
  for (let y = 90; y <= 500; y += 24) line(c, [[640 + (r() - 0.5) * 10, y], [640 - 14 - r() * 16, y + 4]], 3, "#8e8a80");
  hand(c, 980, 300, Math.PI, 1.3);
  arrow(c, [[600, 220], [600, 380]]);
  // the cloth, with a frayed edge and one thread pulled out
  shape(c, () => polyP(c, [[90, 620], [560, 620], [560, 980], [90, 980]]), COL.cloth);
  c.strokeStyle = "#d9cdb2"; c.lineWidth = 3;
  for (let y = 636; y < 980; y += 16) { c.beginPath(); c.moveTo(95, y); c.lineTo(555, y); c.stroke(); }
  for (let x = 106; x < 560; x += 16) { c.beginPath(); c.moveTo(x, 625); c.lineTo(x, 975); c.stroke(); }
  for (let y = 630; y < 980; y += 16) line(c, [[560, y], [590 + r() * 40, y + (r() - 0.5) * 14]], 4, "#c9b98f");
  line(c, [[560, 760], [700, 740], [820, 770], [930, 740]], 5, "#c9b98f");
  hand(c, 1000, 760, Math.PI, 1.3);
  arrow(c, [[640, 880], [820, 880]]);
};
// a4: a tight foil ball and a chips packet ball that has sprung open
const flowA4 = (c: Ctx) => {
  table(c, 620);
  const r = rnd(21);
  // foil ball: a crumpled polygon with facets
  shadow(c, 320, 880, 170, 36);
  const pts: number[][] = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, rad = 140 + r() * 40; pts.push([300 + Math.cos(a) * rad, 740 + Math.sin(a) * rad]); }
  shape(c, () => polyP(c, pts), COL.steel);
  for (let i = 0; i < 7; i++) { const [a, b, d] = [pts[i * 2], pts[(i * 2 + 5) % 14], pts[(i * 2 + 9) % 14]]; shape(c, () => polyP(c, [a, b, [(a[0] + b[0] + d[0]) / 3, (a[1] + b[1] + d[1]) / 3]]), i % 2 ? COL.steelDk : COL.steelIn, 3); }
  shine(c, [[230, 660], [270, 630]], 8);
  // chips packet, opened up loosely: a big crumpled flower of red/orange with silver inside
  shadow(c, 770, 900, 230, 40);
  const pk: number[][] = []; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, rad = 150 + r() * 110; pk.push([770 + Math.cos(a) * rad, 690 + Math.sin(a) * rad * 0.85]); }
  shape(c, () => polyP(c, pk), COL.red);
  // creases: a few crumpled facets, the shiny silver inside showing where it has sprung open
  for (let i = 0; i < 9; i++) { const a = pk[i * 2], b = pk[(i * 2 + 1) % 18], m = [700 + r() * 140, 630 + r() * 120]; shape(c, () => polyP(c, [a, b, m]), i % 3 === 0 ? COL.steel : i % 3 === 1 ? COL.orange : "#c8452a", 3); }
  shape(c, () => ell(c, 790, 690, 60, 36, 0.3), COL.yellow, 4);
  line(c, [[640, 760], [720, 700], [820, 720]], 4, "#b23a28");
  arrow(c, [[900, 520], [980, 450]]); arrow(c, [[620, 520], [540, 450]]);
};
// p1: the shoebox room on its side: plastic window, stick bed with a cloth sheet, foil mirror, bottle-cap plate, paper labels
const flowP1 = (c: Ctx) => {
  table(c, 850);
  const CB = "#c9a06a", CBd = "#a77f4c", CBl = "#e2c594";
  shape(c, () => polyP(c, [[120, 160], [960, 160], [830, 240], [250, 240]]), CB);
  shape(c, () => polyP(c, [[120, 160], [250, 240], [250, 720], [120, 850]]), CBd);
  shape(c, () => polyP(c, [[960, 160], [830, 240], [830, 720], [960, 850]]), CBd);
  shape(c, () => polyP(c, [[250, 720], [830, 720], [960, 850], [120, 850]]), CBl);
  shape(c, () => polyP(c, [[250, 240], [830, 240], [830, 720], [250, 720]]), CB);
  // window: a hole covered with clear plastic, taped at the corners
  shape(c, () => rrect(c, 470, 300, 220, 170, 4), COL.sky, 6); shape(c, () => rrect(c, 470, 300, 220, 170, 4), COL.glass, 0);
  shine(c, [[490, 440], [600, 320]], 8);
  for (const [tx, ty] of [[470, 300], [690, 300], [470, 470], [690, 470]]) shape(c, () => rrect(c, tx - 26, ty - 10, 52, 20, 4), "rgba(255,230,120,0.8)", 3);
  // foil mirror on the wall, a paper picture, a bottle-cap plate on the floor
  shape(c, () => ell(c, 350, 420, 60, 80), COL.steel); shine(c, [[325, 380], [340, 450]], 7);
  shape(c, () => rrect(c, 740, 330, 70, 90, 4), COL.paper, 4); shape(c, () => ell(c, 775, 380, 22, 26), COL.leaf, 3); line(c, [[775, 400], [775, 412]], 4, COL.brown);
  shape(c, () => ell(c, 790, 800, 52, 30), COL.red); shape(c, () => ell(c, 790, 797, 36, 18), COL.steel, 3);
  // the ice-cream-stick bed with a cloth sheet
  shadow(c, 440, 800, 170, 40);
  for (let i = 0; i < 7; i++) shape(c, () => rrect(c, 280 + i * 42, 650, 34, 140, 14), COL.wood, 4);
  shape(c, () => rrect(c, 280, 610, 300, 40, 12), COL.wood);
  shape(c, () => polyP(c, [[292, 700], [570, 700], [596, 780], [268, 780]]), COL.pink, 5);
  // small paper labels, with a line of writing on each
  const label = (x: number, y: number) => { shape(c, () => rrect(c, x, y, 70, 32, 4), WHITE, 3); line(c, [[x + 10, y + 16], [x + 60, y + 16]], 4, COL.grey); };
  label(440, 490); label(310, 520); label(600, 790); label(850, 840); label(740, 430);
};

// ---------------------------------------------------------------- term cards
// term.0 Material: three spoons, steel, wood and red plastic
const term0 = (c: Ctx) => {
  ground(c);
  const sp = (x: number, col: string, dk: string, what: number) => {
    shadow(c, x + 30, 920, 50, 18);
    shape(c, () => rrect(c, x - 34, 400, 68, 540, 30), col);
    shape(c, () => ell(c, x, 290, 110, 140), col);
    shade(c, () => ell(c, x, 290, 110, 140), dk, -40, -20, 0.6);
    shape(c, () => ell(c, x, 300, 78, 100), dk, 0);
    shade(c, () => rrect(c, x - 34, 400, 68, 540, 30), dk, -22, 0, 0.6);
    if (what === 0) shine(c, [[x - 60, 200], [x - 70, 300]], 9);
    if (what === 1) for (let i = 0; i < 3; i++) line(c, [[x - 20 + i * 18, 430], [x - 24 + i * 18, 900]], 3, COL.woodDk);
    if (what === 2) shine(c, [[x - 60, 210], [x - 68, 300]], 9);
  };
  sp(220, COL.steel, COL.steelDk, 0); sp(540, COL.wood, COL.woodDk, 1); sp(860, COL.red, "#b23a28", 2);
};
// term.1 Wood: a chopping board showing its grain, a pencil lying on it
const term1 = (c: Ctx) => {
  table(c, 60); ground(c); c.fillStyle = TABLE; c.fillRect(0, 0, D, D);
  shadow(c, 560, 860, 440, 40);
  const board = () => rrect(c, 100, 250, 880, 590, 40);
  shape(c, board, COL.wood);
  c.save(); c.beginPath(); board(); c.clip();
  for (let y = 290; y < 840; y += 46) { c.beginPath(); c.moveTo(100, y); for (let x = 100; x < 980; x += 60) c.quadraticCurveTo(x + 30, y + Math.sin(x / 110 + y / 50) * 16, x + 60, y + Math.sin((x + 60) / 110 + y / 50) * 16); c.strokeStyle = COL.woodDk; c.lineWidth = 5; c.stroke(); }
  c.restore();
  shape(c, () => ell(c, 900, 330, 32, 32), TABLE, 5);
  // the pencil
  c.save(); c.translate(540, 640); c.rotate(-0.45);
  shadow(c, 20, 40, 300, 24);
  shape(c, () => rrect(c, -260, -26, 520, 52, 4), COL.yellow);
  shade(c, () => rrect(c, -260, -26, 520, 52, 4), COL.orange, 0, -18, 0.5);
  shape(c, () => polyP(c, [[-260, -26], [-330, 0], [-260, 26]]), "#f1d9a8", 5);
  shape(c, () => polyP(c, [[-330, 0], [-300, -11], [-300, 11]]), COL.greyDk, 4);
  shape(c, () => rrect(c, 260, -26, 36, 52, 4), COL.steel, 5);
  shape(c, () => rrect(c, 296, -24, 50, 48, 14), COL.pink, 5);
  c.restore();
};
// term.2 Metal: a shiny steel tumbler ringing, a key and a one-rupee coin
const term2 = (c: Ctx) => {
  table(c, 700);
  shadow(c, 430, 870, 180, 36);
  const body = () => polyP(c, [[250, 280], [550, 280], [520, 860], [280, 860]]);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -90, 0, 0.6);
  shape(c, () => ell(c, 400, 280, 150, 30), COL.steelIn, 6);
  line(c, [[262, 420], [538, 420]], 5, COL.steelDk); line(c, [[270, 560], [530, 560]], 5, COL.steelDk);
  shine(c, [[300, 330], [310, 700]], 12);
  // ringing lines
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(400, 560, 240 + i * 50, -0.5, 0.5); c.strokeStyle = INK; c.lineWidth = 7; c.stroke(); c.beginPath(); c.arc(400, 560, 240 + i * 50, Math.PI - 0.5, Math.PI + 0.5); c.stroke(); }
  // the key
  c.save(); c.translate(760, 350); c.rotate(0.6);
  shadow(c, 30, 40, 130, 20);
  shape(c, () => ell(c, -120, 0, 60, 60), "#d9b24c"); shape(c, () => ell(c, -120, 0, 26, 26), TABLE, 5);
  shape(c, () => polyP(c, [[-62, -18], [150, -18], [150, 10], [120, 10], [120, 40], [90, 40], [90, 10], [60, 10], [60, 36], [30, 36], [30, 10], [-62, 18]]), "#d9b24c");
  c.restore();
  // the coin
  shadow(c, 830, 830, 110, 36);
  shape(c, () => ell(c, 820, 780, 110, 110), COL.steel);
  shape(c, () => ell(c, 820, 780, 90, 90), COL.steelIn, 5);
  write(c, "1", 795, 730, 100, INK, 10);
};
// term.3 Plastic: a blue bucket with a red mug inside, a green lunch box beside
const term3 = (c: Ctx) => {
  table(c, 720);
  shadow(c, 400, 930, 240, 40);
  // the mug, peeping over the bucket rim
  shape(c, () => rrect(c, 300, 230, 170, 150, 10), COL.red); shape(c, () => ell(c, 385, 230, 85, 22), "#f08a72", 5);
  shape(c, () => rrect(c, 470, 260, 60, 80, 24), COL.red); shape(c, () => rrect(c, 484, 276, 32, 48, 14), COL.sky, 0); c.fillStyle = BG; c.beginPath(); rrect(c, 484, 276, 32, 48, 14); c.fill(); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  const body = () => polyP(c, [[150, 320], [610, 320], [560, 920], [200, 920]]);
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, -140, 0, 0.6);
  c.beginPath(); c.ellipse(380, 320, 230, 46, 0, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.beginPath(); c.ellipse(380, 320, 230, 46, 0, Math.PI, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[200, 420], [560, 420]], 5, COL.blueDk);
  shine(c, [[200, 380], [215, 820]], 12);
  // handle
  c.beginPath(); c.arc(380, 320, 250, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = INK; c.lineWidth = 22; c.stroke();
  c.beginPath(); c.arc(380, 320, 250, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = COL.steel; c.lineWidth = 12; c.stroke();
  // the lunch box
  shadow(c, 830, 925, 190, 30);
  shape(c, () => rrect(c, 660, 760, 340, 160, 18), COL.green); shade(c, () => rrect(c, 660, 760, 340, 160, 18), COL.greenDk, -40, -30, 0.6);
  shape(c, () => rrect(c, 650, 700, 360, 70, 18), COL.greenLt);
  shape(c, () => rrect(c, 800, 752, 60, 44, 8), COL.yellow, 4);
};
// term.4 Glass: a jar of pickle on a sunny windowsill
const term4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6dcc8"; c.fillRect(0, 0, D, D);
  // the window
  shape(c, () => rrect(c, 180, 100, 720, 540, 10), COL.sky);
  shape(c, () => ell(c, 330, 230, 80, 80), COL.yellow, 5);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[330 + Math.cos(a) * 100, 230 + Math.sin(a) * 100], [330 + Math.cos(a) * 130, 230 + Math.sin(a) * 130]], 6, COL.yellow); }
  c.save(); c.beginPath(); rrect(c, 180, 100, 720, 540, 10); c.clip(); c.globalAlpha = 0.25; c.fillStyle = COL.yellow;
  c.beginPath(); c.moveTo(330, 230); c.lineTo(900, 460); c.lineTo(900, 640); c.lineTo(560, 640); c.closePath(); c.fill(); c.globalAlpha = 1; c.restore();
  shape(c, () => rrect(c, 180, 100, 720, 540, 10), COL.glass, 0);
  shine(c, [[230, 560], [300, 420]], 10);
  c.lineWidth = 14; c.strokeStyle = INK; c.beginPath(); rrect(c, 180, 100, 720, 540, 10); c.stroke();
  line(c, [[540, 100], [540, 640]], 14); line(c, [[180, 370], [900, 370]], 14);
  // the sill
  shape(c, () => rrect(c, 120, 640, 840, 70, 10), COL.wood); shade(c, () => rrect(c, 120, 640, 840, 70, 10), COL.woodDk, 0, -30, 0.5);
  // the jar of pickle
  shadow(c, 580, 700, 160, 28);
  const jar = () => rrect(c, 400, 330, 280, 320, 34);
  shape(c, jar, "#e2642e");
  c.save(); c.beginPath(); jar(); c.clip(); const r = rnd(4);
  for (let i = 0; i < 40; i++) { const x = 410 + r() * 260, y = 350 + r() * 290; shape(c, () => ell(c, x, y, 16 + r() * 10, 12 + r() * 8, r() * 3), i % 3 ? "#c8452a" : COL.leafDk, 3); }
  c.restore();
  shape(c, jar, COL.glass, 6);
  shine(c, [[430, 380], [430, 600]], 12);
  shape(c, () => rrect(c, 390, 290, 300, 54, 14), COL.steel); shade(c, () => rrect(c, 390, 290, 300, 54, 14), COL.steelDk, -60, 0, 0.6);
};

export const ic_materialsWhatIsItMadeOfL1 = cards("sci.materials.what-is-it-made-of.L1", [
  setup0, setup1, setup2, setup3,
  flowA1, flowA2, flowA3, flowA4, flowP1,
  term0, term1, term2, term3, term4,
]);
