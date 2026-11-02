import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, person, write, cards } from "./flatKit";

// FOSSILS AND EXTINCTION L2 · set-up cards and card pictures in the flat kit look.
// Atta dough is warm tan, salt dough is pale; newspapers are off-white with a dark header and grey text
// lines; rock is grey, bone is cream. The same child (orange) and grown-up (blue) on every card.

const DOUGH = "#d9b98a", DOUGH_DK = "#b8945f", SALT = "#efe6d6", SALT_DK = "#d3c6ad";
const PAPER = "#f3f0e8", PAPER_DK = "#cfc9bc", ROCK = "#a9a4a0", ROCK_DK = "#7d7873", BONE = "#f4efe2", BONE_DK = "#d8d0bb";

// ---------------------------------------------------------------- things
// a flat round of dough, top face centre (x, y)
const dough = (c: Ctx, x: number, y: number, rx: number, ry: number, col = DOUGH, dk = DOUGH_DK) => {
  const t = ry * 0.55;
  shadow(c, x + rx * 0.08, y + t + ry * 0.3, rx, ry * 0.9);
  shape(c, () => ell(c, x, y + t, rx, ry), dk);
  shape(c, () => ell(c, x, y, rx, ry), col);
};
// a blurry squashed mark in dough
const smudge = (c: Ctx, x: number, y: number, r: number, seed: number, col = DOUGH_DK) => {
  const rd = rnd(seed);
  c.globalAlpha = 0.65;
  shape(c, () => { for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, rr = r * (0.7 + rd() * 0.5); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.6; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); }, col, 3);
  c.globalAlpha = 1;
};
// a door key lying flat, middle (x, y), pointing right; fill col (dark dough for its print)
const key = (c: Ctx, x: number, y: number, s: number, rot = 0, col: string = COL.yellow, lw = 5) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => rrect(c, -40, -8, 110, 16, 6), col, lw);
  shape(c, () => rrect(c, 40, 0, 12, 26, 3), col, lw); shape(c, () => rrect(c, 58, 0, 12, 20, 3), col, lw);
  shape(c, () => ell(c, -58, 0, 30, 30), col, lw);
  c.beginPath(); ell(c, -58, 0, 11, 11); c.fillStyle = col === COL.yellow ? BG : DOUGH; c.fill(); c.lineWidth = lw * 0.7; c.strokeStyle = INK; c.stroke();
  c.restore();
};
const coin = (c: Ctx, x: number, y: number, r: number, col: string = COL.wood, lw = 5) => {
  shape(c, () => ell(c, x, y, r, r), col, lw);
  c.beginPath(); ell(c, x, y, r * 0.72, r * 0.72); c.strokeStyle = INK; c.lineWidth = lw * 0.6; c.stroke();
  if (col === COL.wood) write(c, "5", x - r * 0.25, y - r * 0.35, r * 0.7, INK, 5);
};
const spoon = (c: Ctx, x: number, y: number, s: number, rot = 0, col: string = COL.steel, lw = 5) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => rrect(c, -10, -9, 130, 18, 8), col, lw);
  shape(c, () => ell(c, -50, 0, 46, 30), col, lw);
  if (col === COL.steel) shape(c, () => ell(c, -50, 0, 34, 20), COL.steelIn, 3);
  c.restore();
};
const banana = (c: Ctx, x: number, y: number, r: number, squashed = false) => {
  if (squashed) { c.globalAlpha = 0.9; smudge(c, x, y, r * 1.5, 3, "#f1dd8f"); c.globalAlpha = 1; return; }
  shape(c, () => ell(c, x, y, r, r * 0.8), "#f7e9a6", 5);
  c.beginPath(); ell(c, x, y, r * 0.7, r * 0.55); c.strokeStyle = "#d9b95a"; c.lineWidth = 4; c.stroke();
  for (const a of [0, 2.1, 4.2]) shape(c, () => ell(c, x + Math.cos(a) * r * 0.18, y + Math.sin(a) * r * 0.14, 4, 4), INK, 0);
};
const tomato = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { c.moveTo(x - r, y); c.arc(x, y, r, Math.PI, 0); c.closePath(); }, COL.red, 5);
  shape(c, () => { c.moveTo(x - r * 0.7, y - 8); c.arc(x, y - 8, r * 0.7, Math.PI, 0); c.closePath(); }, "#f08a72", 3);
};
const idli = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.75), WHITE, 5); shape(c, () => ell(c, x, y - r * 0.15, r * 0.75, r * 0.45), "#f5f1ea", 0); };
const cotton = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => { ell(c, x - r * 0.5, y, r * 0.6, r * 0.5); }, WHITE, 5); shape(c, () => ell(c, x + r * 0.5, y + r * 0.1, r * 0.6, r * 0.5), WHITE, 5);
  shape(c, () => ell(c, x, y - r * 0.3, r * 0.65, r * 0.55), WHITE, 5); shape(c, () => ell(c, x, y + r * 0.2, r * 0.55, r * 0.4), WHITE, 0);
};
// a scallop shell, hinge at (x, y), fanning upwards; col for its print
const shell = (c: Ctx, x: number, y: number, s: number, rot = 0, col: string = COL.pink, lw = 5) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => { c.moveTo(-22, 0); c.lineTo(-70, -60); c.quadraticCurveTo(0, -140, 70, -60); c.lineTo(22, 0); c.closePath(); }, col, lw);
  for (let i = -3; i <= 3; i++) line(c, [[i * 7, -4], [i * 20, -92 + Math.abs(i) * 6]], 3, INK);
  c.restore();
};
// a long bone, middle (x, y)
const bone = (c: Ctx, x: number, y: number, len: number, rot = 0, col = BONE) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -len / 2, -len * 0.09, len, len * 0.18, len * 0.08), col);
  for (const s of [-1, 1]) { shape(c, () => ell(c, s * len / 2, -len * 0.09, len * 0.13, len * 0.13), col); shape(c, () => ell(c, s * len / 2, len * 0.09, len * 0.13, len * 0.13), col); }
  c.restore();
};
// a lump of grey rock with its flat top at y
const rock = (c: Ctx, x: number, y: number, w: number, h: number, seed = 1) => {
  const rd = rnd(seed), pts: number[][] = [];
  for (let i = 0; i < 10; i++) { const a = Math.PI + (i / 9) * Math.PI; pts.push([x + Math.cos(a) * w * (0.9 + rd() * 0.2), y + h + Math.sin(a) * h * (0.9 + rd() * 0.25)]); }
  shadow(c, x + w * 0.1, y + h + 10, w, h * 0.2);
  const p = () => polyP(c, pts);
  shape(c, p, ROCK); shade(c, p, ROCK_DK, -w * 0.3, -h * 0.4);
};
// a human footprint, heel at (x, y), toes pointing up (rot 0)
const foot = (c: Ctx, x: number, y: number, s: number, rot = 0, col: string = "#5e6b86") => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => { c.moveTo(-26, 0); c.bezierCurveTo(-36, -40, -40, -90, -30, -120); c.bezierCurveTo(-20, -145, 30, -145, 36, -110); c.bezierCurveTo(40, -70, 30, -30, 24, 0); c.bezierCurveTo(20, 24, -22, 24, -26, 0); c.closePath(); }, col, 3);
  for (let i = 0; i < 5; i++) { const r = 11 - i * 1.4; shape(c, () => ell(c, -30 + i * 16, -150 + i * 6 - (i ? 0 : 6), r, r * 1.2), col, 3); }
  c.restore();
};
// a three-toed dinosaur footprint, heel at (x, y), toes pointing up
const dinoFoot = (c: Ctx, x: number, y: number, s: number, rot = 0, col = ROCK_DK) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const toe = (a: number, l: number) => shape(c, () => { c.moveTo(Math.cos(a + 1.3) * 18, -30 + Math.sin(a + 1.3) * 18); c.lineTo(Math.cos(a) * l, -30 + Math.sin(a) * l); c.lineTo(Math.cos(a - 1.3) * 18, -30 + Math.sin(a - 1.3) * 18); c.closePath(); }, col, 4);
  toe(-Math.PI / 2, 95); toe(-Math.PI / 2 - 0.75, 75); toe(-Math.PI / 2 + 0.75, 75);
  shape(c, () => ell(c, 0, -22, 32, 36), col, 4);
  c.restore();
};
// a folded newspaper seen from the side, lying flat: left end at x, top at y
const paperSide = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), PAPER, 4);
  line(c, [[x + 8, y + h * 0.5], [x + w - 8, y + h * 0.5]], 2.5, PAPER_DK);
};
// a newspaper page seen flat from above, with a dark header and grey text lines
const page = (c: Ctx, x: number, y: number, w: number, h: number, seed = 1) => {
  shape(c, () => rrect(c, x, y, w, h, 4), PAPER, 4);
  const rd = rnd(seed);
  line(c, [[x + w * 0.1, y + h * 0.12], [x + w * 0.9, y + h * 0.12]], h * 0.07, COL.black);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) line(c, [[x + w * (0.1 + k * 0.45), y + h * (0.3 + r * 0.15)], [x + w * (0.1 + k * 0.45) + w * (0.28 + rd() * 0.1), y + h * (0.3 + r * 0.15)]], 3, PAPER_DK);
};
const star = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }, COL.yellow, 4);
// a small white label card with pencil squiggle lines, top left (x, y)
const label = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 4), WHITE, 4);
  line(c, [[x + w * 0.12, y + h * 0.35], [x + w * 0.85, y + h * 0.35]], 4, COL.greyDk); line(c, [[x + w * 0.12, y + h * 0.65], [x + w * 0.6, y + h * 0.65]], 4, COL.greyDk);
};
// a pile of n folded newspapers, bottom centre (x, y), with things poking out at the given layer numbers from the bottom
const pile = (c: Ctx, x: number, y: number, n: number, w: number, h: number, leafAt: number, ticketAt: number, wrapperAt = -1) => {
  shadow(c, x + 20, y + 8, w * 0.6, 26);
  for (let i = 0; i < n; i++) {
    const py = y - (i + 1) * h, px = x - w / 2 + ((i % 3) - 1) * 10;
    if (i === leafAt) { const lx = px + w + 8; shape(c, () => { c.moveTo(lx - 20, py + h / 2); c.quadraticCurveTo(lx + 40, py - 40, lx + 110, py - 20); c.quadraticCurveTo(lx + 50, py + 40, lx - 20, py + h / 2); c.closePath(); }, COL.leaf, 4); line(c, [[lx - 10, py + h / 2], [lx + 90, py - 14]], 3, COL.leafDk); }
    if (i === ticketAt) shape(c, () => rrect(c, px - 110, py + 6, 130, h - 12, 4), COL.pink, 4);
    if (i === wrapperAt) shape(c, () => rrect(c, px + w - 30, py + 4, 120, h - 8, 4), COL.purple, 4);
    paperSide(c, px, py, w, h);
  }
};
// a kitchen counter top from y down
const counter = (c: Ctx, y: number) => { c.fillStyle = "#e3d3b4"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
// floor: a darker band below y
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e6dcc8"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 5); };

// ---------------------------------------------------------------- set-up cards: e1 the print test
const e1s0 = (c: Ctx) => {
  ground(c);
  // rolling pin
  shadow(c, 560, 318, 330, 22);
  shape(c, () => rrect(c, 160, 240, 90, 50, 25), COL.woodDk); shape(c, () => rrect(c, 830, 240, 90, 50, 25), COL.woodDk);
  shape(c, () => rrect(c, 240, 210, 600, 110, 55), COL.wood);
  shade(c, () => rrect(c, 240, 210, 600, 110, 55), COL.woodDk, 0, -36);
  shine(c, [[300, 240], [720, 240]], 8);
  plate(c, 540, 660, 470, 230);
  [560, 700].forEach((y, r) => [270, 450, 630, 810].forEach((x) => dough(c, x + (r ? 0 : 0), y, 72, 34)));
};
const e1s1 = (c: Ctx) => {
  ground(c); counter(c, 700);
  dough(c, 330, 470, 150, 70); dough(c, 760, 470, 150, 70);
  banana(c, 760, 462, 62);
  key(c, 340, 455, 1.4, 0.2);
  const an = Math.PI * 0.62;
  hand(c, 340 - Math.cos(an) * 110, 455 - Math.sin(an) * 110 - 40, an, 1.5);
  arrow(c, [[560, 250], [560, 400]]);
  coin(c, 150, 840, 48); spoon(c, 390, 840, 1.1, -0.1); tomato(c, 560, 860, 58); idli(c, 740, 840, 62); cotton(c, 930, 840, 64);
};
const e1s2 = (c: Ctx) => {
  ground(c);
  person(c, 540, 1010, 700, { armL: [Math.PI * 0.45, Math.PI * 0.5], armR: [Math.PI * 0.55, Math.PI * 0.5] });
  counter(c, 790);
  dough(c, 540, 800, 150, 60);
  plate(c, 540, 760, 290, 68);
  arrow(c, [[180, 560], [180, 700]]); arrow(c, [[900, 560], [900, 700]]);
  write(c, "10", 860, 300, 110, INK, 10);
};
const e1s3 = (c: Ctx) => {
  ground(c);
  const X = [170, 415, 660, 905];
  X.forEach((x) => dough(c, x, 340, 112, 60));
  key(c, X[0] + 6, 335, 1.1, -0.15, DOUGH_DK, 3); coin(c, X[1], 338, 44, DOUGH_DK, 3); spoon(c, X[2] + 10, 338, 1, 0.1, DOUGH_DK, 3);
  shape(c, () => ell(c, X[3], 338, 36, 24, 0.3), DOUGH_DK, 3); line(c, [[X[3] - 30, 326], [X[3] + 30, 342]], 3, DOUGH);
  X.forEach((x, i) => { dough(c, x, 720, 112, 60); smudge(c, x, 716, 50 + (i % 2) * 14, 20 + i); });
};
// ---------------------------------------------------------------- a1 the newspaper pile
const a1s0 = (c: Ctx) => { ground(c); floor(c, 900); pile(c, 540, 900, 14, 560, 46, 2, 7); };
const a1s1 = (c: Ctx) => {
  ground(c); floor(c, 980);
  pile(c, 760, 980, 10, 420, 40, 1, 5);
  person(c, 300, 980, 640, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [-Math.PI * 0.2, -Math.PI * 0.05] });
  // the lifted paper, held in the right hand, its date at the top
  c.save(); c.translate(520, 320); c.rotate(0.35);
  page(c, 0, 0, 300, 380, 4);
  write(c, "2-11", 150, 70, 44, INK, 5);
  c.restore();
  arrow(c, [[940, 250], [820, 320]]);
};
const a1s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 300, 24);
  shape(c, () => rrect(c, 230, 90, 620, 860, 10), COL.paper);
  const dates = ["3-11", "2-11", "1-11", "31-10", "30-10", "29-10", "28-10"], stars = [1, 3, 6];
  dates.forEach((d, i) => { const y = 170 + i * 108; line(c, [[290, y + 90], [790, y + 90]], 2, PAPER_DK); write(c, d, 320, y, 64, INK, 7); if (stars.includes(i)) star(c, 700, y + 34, 38); });
  // pencil
  c.save(); c.translate(930, 300); c.rotate(0.25);
  shape(c, () => rrect(c, -22, 0, 44, 520, 8), COL.yellow); shape(c, () => polyP(c, [[-22, 0], [22, 0], [0, -60]]), COL.wood); shape(c, () => ell(c, 0, -52, 7, 8), INK, 0);
  c.restore();
};
// ---------------------------------------------------------------- a2 footprint detective
const a2s0 = (c: Ctx) => {
  ground(c);
  for (const y of [300, 620]) for (let i = 0; i < 4; i++) page(c, 250 + i * 160, y, 150, 190, i + y);
  plate(c, 130, 540, 100, 100); shape(c, () => ell(c, 130, 535, 76, 76), COL.water, 0); shape(c, () => ell(c, 110, 515, 20, 10), COL.drop, 0);
  // towel: folded cloth
  shadow(c, 960, 620, 90, 20);
  shape(c, () => rrect(c, 870, 450, 160, 160, 16), COL.teal); shade(c, () => rrect(c, 870, 450, 160, 160, 16), COL.tealDk, 40, 40);
  line(c, [[870, 530], [1030, 530]], 4);
};
const a2s1 = (c: Ctx) => {
  ground(c); floor(c, 620);
  for (let i = 0; i < 6; i++) page(c, 60 + i * 165, 700, 155, 260, i + 3);
  [[130, 0.15], [230, -0.15], [330, 0.15], [430, -0.15]].forEach(([x, r], i) => foot(c, x, 900 - (i % 2) * 20, 0.75, Math.PI / 2 + r));
  person(c, 640, 880, 520, { armL: [Math.PI * 0.6, Math.PI * 0.5], armR: [Math.PI * 0.3, Math.PI * 0.55] });
  foot(c, 580, 900, 0.75, Math.PI / 2 + 0.1);
  arrow(c, [[720, 1010], [900, 1010]]);
};
const a2s2 = (c: Ctx) => {
  ground(c);
  for (const y of [120, 560]) for (let i = 0; i < 5; i++) page(c, 50 + i * 200, y, 190, 300, i + y);
  for (let i = 0; i < 7; i++) foot(c, 150 + i * 115, 300 - (i % 2) * 40, 0.75, Math.PI / 2 + (i % 2 ? -0.1 : 0.1));
  for (let i = 0; i < 3; i++) foot(c, 180 + i * 300, 740 - (i % 2) * 40, 0.75, Math.PI / 2 + (i % 2 ? -0.1 : 0.1));
  hand(c, 470, 880, 0, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[500, 960], [700, 960]]); arrow(c, [[700, 960], [500, 960]]);
};
// ---------------------------------------------------------------- p1 fossil museum
const p1s0 = (c: Ctx) => {
  ground(c); counter(c, 760);
  [700, 860, 1020].forEach((x) => dough(c, x - 120, 300, 90, 42, SALT, SALT_DK));
  plate(c, 430, 640, 320, 150);
  dough(c, 430, 600, 190, 85, SALT, SALT_DK);
  shell(c, 430, 600, 1.1, 0);
  const an = Math.PI * 0.6;
  hand(c, 420 - Math.cos(an) * 160, 520 - Math.sin(an) * 160 - 30, an, 1.6);
  arrow(c, [[700, 440], [620, 560]]);
};
const p1s1 = (c: Ctx) => {
  ground(c);
  // window with the sun
  shape(c, () => rrect(c, 120, 40, 840, 620, 14), COL.sky);
  shape(c, () => ell(c, 300, 250, 110, 110), COL.yellow);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[300 + Math.cos(a) * 140, 250 + Math.sin(a) * 140], [300 + Math.cos(a) * 185, 250 + Math.sin(a) * 185]], 8, COL.orange); }
  line(c, [[540, 40], [540, 660]], 14); line(c, [[120, 330], [960, 330]], 14);
  shape(c, () => rrect(c, 60, 660, 960, 110, 8), COL.wood); shade(c, () => rrect(c, 60, 660, 960, 110, 8), COL.woodDk, 0, -60);
  const X = [190, 420, 650, 880];
  X.forEach((x) => dough(c, x, 690, 100, 46, SALT, SALT_DK));
  shell(c, X[0], 720, 0.75, 0, SALT_DK, 3); coin(c, X[1], 688, 40, SALT_DK, 3); key(c, X[2] + 5, 688, 1, 0.1, SALT_DK, 3);
  shape(c, () => { c.moveTo(X[3] - 60, 700); c.quadraticCurveTo(X[3], 650, X[3] + 60, 680); c.quadraticCurveTo(X[3], 720, X[3] - 60, 700); c.closePath(); }, SALT_DK, 3);
  c.fillStyle = "#e3d3b4"; c.fillRect(0, 770, D, D - 770); line(c, [[0, 770], [D, 770]], 5);
};
const museum = (c: Ctx, x: number, y: number, w: number) => {
  shadow(c, x + w / 2 + 20, y + 60, w * 0.5, 20);
  shape(c, () => rrect(c, x, y, w, 46, 6), COL.wood); shade(c, () => rrect(c, x, y, w, 46, 6), COL.woodDk, 0, -24);
  for (const bx of [x + 60, x + w - 60]) shape(c, () => polyP(c, [[bx - 40, y + 46], [bx + 40, y + 46], [bx, y + 120]]), COL.woodDk);
  const step = w / 4;
  for (let i = 0; i < 4; i++) {
    const fx = x + step * (i + 0.5);
    shape(c, () => ell(c, fx, y - 60, 70, 70), SALT); shade(c, () => ell(c, fx, y - 60, 70, 70), SALT_DK, 18, 14, 0.5);
    if (i === 0) shell(c, fx, y - 30, 0.6, 0, SALT_DK, 3); else if (i === 1) coin(c, fx, y - 60, 34, SALT_DK, 3); else if (i === 2) key(c, fx + 4, y - 60, 0.8, 0.1, SALT_DK, 3); else dinoFoot(c, fx, y - 10, 0.55, 0, SALT_DK);
    label(c, fx - 40, y - 20 + 6, 80, 50);
  }
};
const p1s2 = (c: Ctx) => {
  ground(c); floor(c, 1000);
  museum(c, 60, 560, 640);
  person(c, 880, 1000, 760, { adult: true, armL: [Math.PI * 0.75, Math.PI * 0.95], armR: [Math.PI * 0.6, Math.PI * 0.5] });
};

// ---------------------------------------------------------------- card pictures
const flowE1 = (c: Ctx) => {
  ground(c); counter(c, 760);
  dough(c, 290, 560, 190, 90); dough(c, 790, 560, 190, 90);
  key(c, 300, 545, 1.5, -0.1, DOUGH_DK, 3); key(c, 300, 420, 1.5, -0.1); arrow(c, [[300, 180], [300, 350]]);
  banana(c, 790, 560, 90, true); banana(c, 790, 400, 60); arrow(c, [[790, 180], [790, 310]]);
};
const flowA1 = (c: Ctx) => {
  ground(c); floor(c, 920);
  pile(c, 480, 920, 13, 520, 50, 1, 6, 11);
  // the top paper, lifted off in the child's hand
  c.save(); c.translate(420, 130); c.rotate(-0.3); paperSide(c, 0, 0, 520, 50); c.restore();
  hand(c, 760, 40, Math.PI * 0.75, 1.5);
  arrow(c, [[940, 300], [940, 860]]);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) page(c, 50 + i * 200, 60, 190, 300, i + 7);
  for (let i = 0; i < 3; i++) foot(c, 170 + i * 320, 300 - (i % 2) * 50, 0.8, Math.PI / 2 + (i % 2 ? -0.1 : 0.1));
  arrow(c, [[200, 420], [500, 420]]); arrow(c, [[500, 420], [200, 420]]);
  shape(c, () => rrect(c, 40, 540, 1000, 480, 20), ROCK); shade(c, () => rrect(c, 40, 540, 1000, 480, 20), ROCK_DK, 60, -60, 0.3);
  for (let i = 0; i < 3; i++) dinoFoot(c, 190 + i * 340, 900 - (i % 2) * 60, 1.1, Math.PI / 2 + (i % 2 ? -0.1 : 0.1));
  arrow(c, [[220, 1000], [560, 1000]]); arrow(c, [[560, 1000], [220, 1000]]);
};
const flowP1 = (c: Ctx) => {
  ground(c); counter(c, 800);
  dough(c, 500, 560, 300, 150, SALT, SALT_DK);
  shell(c, 500, 640, 1.9, 0, SALT_DK, 4);
  shell(c, 900, 420, 1.1, 0.4);
  arrow(c, [[860, 260], [620, 400]]);
  label(c, 380, 820, 240, 130);
};
const termFossil = (c: Ctx) => {
  ground(c);
  rock(c, 280, 180, 220, 200, 3); bone(c, 280, 300, 260, -0.3);
  // a molar: a bumpy crown, two roots below
  const crown = () => { c.moveTo(700, 300); c.lineTo(700, 200); c.quadraticCurveTo(750, 150, 800, 200); c.quadraticCurveTo(850, 150, 900, 200); c.lineTo(900, 300); c.quadraticCurveTo(800, 330, 700, 300); c.closePath(); };
  shape(c, () => { c.moveTo(715, 300); c.quadraticCurveTo(725, 420, 755, 450); c.quadraticCurveTo(780, 400, 785, 320); c.closePath(); }, BONE_DK, 5);
  shape(c, () => { c.moveTo(815, 320); c.quadraticCurveTo(820, 400, 845, 450); c.quadraticCurveTo(875, 420, 885, 300); c.closePath(); }, BONE_DK, 5);
  shape(c, crown, BONE); shade(c, crown, BONE_DK, -30, -20, 0.4);
  rock(c, 280, 620, 230, 220, 5);
  // the coiled shell: a spiral band with ribs
  const sp = (t: number) => 14 + 24 * t, pts: number[][] = [];
  for (let t = 0; t <= 4 * Math.PI; t += 0.15) pts.push([280 + Math.cos(t) * sp(t), 760 + Math.sin(t) * sp(t) * 0.9]);
  const inner: number[][] = []; for (let t = 2 * Math.PI; t <= 4 * Math.PI; t += 0.15) inner.push([280 + Math.cos(t) * sp(t - 2 * Math.PI), 760 + Math.sin(t) * sp(t - 2 * Math.PI) * 0.9]);
  shape(c, () => polyP(c, [...pts, ...inner.reverse()]), COL.wood, 5);
  for (let t = 2.2 * Math.PI; t < 4 * Math.PI; t += 0.3) line(c, [[280 + Math.cos(t) * sp(t - 2 * Math.PI), 760 + Math.sin(t) * sp(t - 2 * Math.PI) * 0.9], [280 + Math.cos(t) * sp(t), 760 + Math.sin(t) * sp(t) * 0.9]], 3, COL.woodDk);
  rock(c, 800, 620, 230, 220, 8); dinoFoot(c, 800, 860, 1.25, 0.15);
};
// a mammoth or an elephant, facing right, feet at (x, y)
const pachyderm = (c: Ctx, x: number, y: number, s: number, col: string, dk: string, mammoth: boolean, lw = 6) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 20, 6, 240, 30);
  for (const lx of [-150, -90, 60, 120]) shape(c, () => rrect(c, lx - 30, -150, 60, 150, 14), col, lw);
  const body = () => { c.moveTo(-220, -140); c.bezierCurveTo(-240, -300, -80, mammoth ? -400 : -330, 60, -330); c.bezierCurveTo(130, -330, 170, -300, 190, -240); c.lineTo(190, -140); c.bezierCurveTo(190, -80, -200, -80, -220, -140); c.closePath(); };
  shape(c, body, col, lw); shade(c, body, dk, 40, -30, 0.45);
  if (mammoth) for (let i = -200; i < 180; i += 36) shape(c, () => polyP(c, [[i, -128], [i + 36, -128], [i + 18, -80]]), col, lw * 0.6);
  // head, ear, eye
  const head = () => { c.moveTo(150, -300); c.bezierCurveTo(200, mammoth ? -380 : -340, 300, -340, 300, -250); c.bezierCurveTo(300, -200, 250, -170, 190, -180); c.closePath(); };
  shape(c, head, col, lw); shade(c, head, dk, 30, 0, 0.35);
  shape(c, () => ell(c, 170, -250, mammoth ? 30 : 70, mammoth ? 40 : 90), dk, lw);
  // trunk
  line(c, [[290, -220], [330, -140], [330, -60], [300, -20]], 44 + lw * 2, INK); line(c, [[290, -220], [330, -140], [330, -60], [300, -20]], 44, col);
  // tusks
  const tusk = (pts: number[][], w: number) => { line(c, pts, w + 8, INK); line(c, pts, w, BONE); };
  if (mammoth) tusk([[250, -190], [280, -80], [370, -60], [420, -140]], 22); else tusk([[260, -190], [300, -130], [340, -120]], 14);
  shape(c, () => ell(c, 240, -270, 8, 10), INK, 0);
  c.restore();
};
const termExtinct = (c: Ctx) => {
  ground(c); floor(c, 900);
  c.globalAlpha = 0.55; pachyderm(c, 300, 900, 0.95, "#bdb8b0", "#8f8a82", true); c.globalAlpha = 1;
  pachyderm(c, 790, 900, 0.8, "#8792a6", "#5f6b82", false);
};
const termDino = (c: Ctx) => {
  ground(c); floor(c, 920);
  // the big long-necked one
  const x = 420, y = 920;
  shadow(c, x + 40, y + 6, 330, 32);
  for (const lx of [-200, -110, 90, 170]) shape(c, () => rrect(c, x + lx - 36, y - 220, 72, 220, 16), COL.green);
  const body = () => ell(c, x, y - 330, 270, 140);
  shape(c, body, COL.green); shade(c, body, COL.greenDk, 60, -40, 0.45);
  const tail: number[][] = [[x - 250, y - 330], [x - 400, y - 280], [x - 520, y - 180]];
  line(c, tail, 90, INK); line(c, tail, 78, COL.green);
  const neck: number[][] = [[x + 220, y - 380], [x + 320, y - 600], [x + 420, y - 790]];
  line(c, neck, 82, INK); line(c, neck, 70, COL.green);
  shape(c, () => ell(c, x + 450, y - 800, 70, 44, 0.2), COL.green); shape(c, () => ell(c, x + 440, y - 815, 8, 8), INK, 0);
  // the hen-sized one
  const sx = 900, sy = 920;
  shadow(c, sx + 10, sy + 4, 70, 10);
  for (const lx of [-14, 14]) line(c, [[sx + lx, sy - 70], [sx + lx + 6, sy - 20], [sx + lx + 22, sy - 2]], 12, INK), line(c, [[sx + lx, sy - 70], [sx + lx + 6, sy - 20], [sx + lx + 22, sy - 2]], 6, COL.orange);
  shape(c, () => ell(c, sx, sy - 90, 48, 30, -0.2), COL.orange);
  line(c, [[sx - 40, sy - 86], [sx - 120, sy - 70]], 22, INK); line(c, [[sx - 40, sy - 86], [sx - 120, sy - 70]], 14, COL.orange);
  line(c, [[sx + 36, sy - 106], [sx + 60, sy - 150]], 20, INK); line(c, [[sx + 36, sy - 106], [sx + 60, sy - 150]], 12, COL.orange);
  shape(c, () => ell(c, sx + 72, sy - 158, 26, 16), COL.orange); shape(c, () => ell(c, sx + 68, sy - 164, 4, 4), INK, 0);
};
const termPalaeo = (c: Ctx) => {
  ground(c); floor(c, 920);
  rock(c, 760, 700, 260, 220, 11); bone(c, 760, 820, 300, -0.15);
  person(c, 330, 920, 720, { adult: true, sit: true, armL: [Math.PI * 0.6, Math.PI * 0.55], armR: [Math.PI * 0.25, Math.PI * 0.1] });
  // the paintbrush in the right hand, bristles on the bone
  const wx = 330 + 720 * 0.11 + Math.cos(Math.PI * 0.25) * 720 * 0.17 + Math.cos(Math.PI * 0.1) * 720 * 0.16, wy = 920 - 720 * 0.06 - 720 * 0.32 + 720 * 0.03 + Math.sin(Math.PI * 0.25) * 720 * 0.17 + Math.sin(Math.PI * 0.1) * 720 * 0.16;
  line(c, [[wx - 20, wy - 10], [wx + 150, wy + 60]], 24, INK); line(c, [[wx - 20, wy - 10], [wx + 150, wy + 60]], 14, COL.wood);
  shape(c, () => polyP(c, [[wx + 140, wy + 42], [wx + 200, wy + 70], [wx + 150, wy + 86]]), COL.brown, 4);
  // hat and notebook on the ground
  shape(c, () => ell(c, 130, 905, 120, 30), COL.wood); shape(c, () => { c.moveTo(60, 900); c.bezierCurveTo(60, 830, 200, 830, 200, 900); c.closePath(); }, COL.wood);
  shape(c, () => rrect(c, 540, 860, 170, 60, 6), COL.purple); line(c, [[560, 890], [690, 890]], 3, WHITE);
};
const termLayer = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.sky; c.fillRect(0, 0, D, 620);
  const hill = () => { c.moveTo(0, 620); c.lineTo(0, 420); c.bezierCurveTo(200, 320, 500, 240, 760, 300); c.lineTo(760, 1080); c.lineTo(0, 1080); c.closePath(); };
  c.save(); c.beginPath(); hill(); c.clip();
  const cols = [COL.green, "#b6885a", "#e8d9b4", ROCK, "#8a5a3c", "#d9c39a", ROCK_DK, "#a8723f"];
  cols.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, 300 + i * 100, 800, 100); if (i) line(c, [[0, 300 + i * 100], [800, 300 + i * 100]], 5); });
  c.restore();
  shape(c, hill, "rgba(0,0,0,0)", 7);
  // the flat ground in front of the cut face
  c.fillStyle = "#e3d3b4"; c.fillRect(760, 620, 320, 460); line(c, [[760, 620], [1080, 620]], 5);
};
const termTrace = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 100, 1000, 880, 30), ROCK); shade(c, () => rrect(c, 40, 100, 1000, 880, 30), ROCK_DK, 60, -60, 0.3);
  for (let i = 0; i < 5; i++) dinoFoot(c, 180 + i * 190, 720 - i * 90 - (i % 2) * 70, 1, Math.PI / 2 - 0.4 + (i % 2 ? -0.1 : 0.1));
};

export const ic_evolutionFossilsAndExtinctionL2 = cards("sci.evolution.fossils-and-extinction.L2", [
  e1s0, e1s1, e1s2, e1s3, a1s0, a1s1, a1s2, a2s0, a2s1, a2s2, p1s0, p1s1, p1s2,
  flowE1, flowA1, flowA2, flowP1, termFossil, termExtinct, termDino, termPalaeo, termLayer, termTrace,
]);
