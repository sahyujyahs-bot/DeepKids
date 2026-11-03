import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, plate, bowl, seed, leaf, write, cards } from "./flatKit";

// sci.seeds-and-life-cycles.seeds-and-germination.L1 · set-up cards, then picture cards.
// Kitchen seeds drawn to scale with each other: rai (tiny, dark), moong (green), chana (beige, a beak),
// rajma (red kidney), groundnut (tan, netted), tamarind seed (dark brown, square), mango stone (big, fibrous),
// pumpkin seed (flat, pale). Roots are white with an ink outline and taper to a point; a new shoot is a green hook.

const SOILLT = "#a06d49", CHANA = "#e5c084", CHANADK = "#c3985a", CHANAWET = "#f0dcae", RAJMA = "#a6333f", RAJMADK = "#72202a";
const RAI = "#6b3f1f", NUT = "#d9b27a", NUTDK = "#b48c55", TAM = "#4a2a1a", MANGO = "#e8d9a8", MANGODK = "#c9b27a", PUMP = "#f3ead0", PUMPDK = "#d9cba3";
const TISSUE = "#dfeaf3", TISSUEWET = "#bcd6ec", ROOT = "#fffaf0";

// ---------------------------------------------------------------- seeds
const chana = (c: Ctx, x: number, y: number, r: number, soaked = false) => {
  const col = soaked ? CHANAWET : CHANA, dk = soaked ? CHANADK : "#a97f45";
  const p = () => { c.moveTo(x - r * 0.95, y - r * 0.55); c.quadraticCurveTo(x - r * 0.2, y - r * 1.15, x + r * 0.55, y - r * 0.8); c.quadraticCurveTo(x + r * 1.15, y - r * 0.3, x + r * 0.8, y + r * 0.55); c.quadraticCurveTo(x + r * 0.2, y + r * 1.05, x - r * 0.6, y + r * 0.7); c.quadraticCurveTo(x - r * 1.1, y + r * 0.2, x - r * 0.95, y - r * 0.55); c.closePath(); };
  shape(c, p, col, Math.max(2.5, r * 0.2)); shade(c, p, dk, r * 0.3, r * 0.25, 0.5);
  line(c, [[x - r * 0.3, y - r * 0.4], [x + r * 0.2, y + r * 0.1]], Math.max(2, r * 0.12), dk);
};
const rajma = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r, -r * 0.8, r, -r * 0.8, r, 0); c.bezierCurveTo(r, r * 0.6, r * 0.45, r * 0.7, r * 0.1, r * 0.42); c.bezierCurveTo(-r * 0.3, r * 0.2, -r, r * 0.65, -r, 0); c.closePath(); };
  shape(c, p, RAJMA, Math.max(2.5, r * 0.18)); shade(c, p, RAJMADK, r * 0.3, r * 0.22, 0.5);
  shine(c, [[-r * 0.55, -r * 0.35], [-r * 0.1, -r * 0.45]], Math.max(3, r * 0.14)); c.restore();
};
const rai = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), RAI, Math.max(2, r * 0.3));
const groundnut = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r, -r * 0.55, -r * 0.3, -r * 0.5, 0, -r * 0.38); c.bezierCurveTo(r * 0.3, -r * 0.5, r, -r * 0.55, r, 0); c.bezierCurveTo(r, r * 0.55, r * 0.3, r * 0.5, 0, r * 0.38); c.bezierCurveTo(-r * 0.3, r * 0.5, -r, r * 0.55, -r, 0); c.closePath(); };
  shape(c, p, NUT, Math.max(2.5, r * 0.14)); shade(c, p, NUTDK, r * 0.25, r * 0.2, 0.45);
  c.save(); c.beginPath(); p(); c.clip(); for (let k = -3; k <= 3; k++) { line(c, [[k * r * 0.3 - r * 0.4, -r], [k * r * 0.3 + r * 0.4, r]], 2.5, NUTDK); line(c, [[k * r * 0.3 + r * 0.4, -r], [k * r * 0.3 - r * 0.4, r]], 2.5, NUTDK); } c.restore(); c.restore();
};
const tamarind = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => rrect(c, -r, -r * 0.8, r * 2, r * 1.6, r * 0.5);
  shape(c, p, TAM, Math.max(2.5, r * 0.16)); shine(c, [[-r * 0.5, -r * 0.35], [r * 0.1, -r * 0.45]], Math.max(3, r * 0.14)); c.restore();
};
const mangoStone = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => ell(c, 0, 0, r, r * 0.5);
  shape(c, p, MANGO, Math.max(3, r * 0.08)); shade(c, p, MANGODK, r * 0.18, r * 0.12, 0.5);
  c.save(); c.beginPath(); p(); c.clip(); for (let k = 0; k < 9; k++) { const t = -r * 0.85 + k * r * 0.21; line(c, [[t, -r * 0.5], [t + r * 0.15, r * 0.5]], 2.5, MANGODK); } c.restore(); c.restore();
};
const pumpkinSeed = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const p = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r, -r * 0.7, -r * 0.4, -r * 0.62, r * 0.95, -r * 0.08); c.quadraticCurveTo(r * 1.08, 0, r * 0.95, r * 0.08); c.bezierCurveTo(-r * 0.4, r * 0.62, -r, r * 0.7, -r, 0); c.closePath(); };
  shape(c, p, PUMP, Math.max(2.5, r * 0.12)); shade(c, p, PUMPDK, r * 0.15, r * 0.14, 0.5);
  c.beginPath(); c.moveTo(-r * 0.8, 0); c.bezierCurveTo(-r * 0.8, -r * 0.45, -r * 0.3, -r * 0.42, r * 0.75, -r * 0.05); c.strokeStyle = PUMPDK; c.lineWidth = 2.5; c.stroke(); c.restore();
};
const papaya = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.black, Math.max(2, r * 0.25)); shine(c, [[x - r * 0.4, y - r * 0.4], [x - r * 0.2, y - r * 0.5]], 3); };

// a white root tapering to its tip, drawn through the points given (first point at the seed)
const root = (c: Ctx, pts: number[][], w: number) => {
  const seg = (col: string, extra: number) => {
    for (let i = 0; i < pts.length - 1; i++) { const t = i / (pts.length - 1); line(c, [pts[i], pts[i + 1]], Math.max(2, w * (1 - t * 0.75)) + extra, col); }
  };
  seg(INK, 7); seg(ROOT, 0);
};
// a new shoot: a green hook rising from (x, y), the bent tip pointing down, two tiny closed leaves at the tip
const shoot = (c: Ctx, x: number, y: number, h: number, w = 14) => {
  const p = () => { c.moveTo(x, y); c.bezierCurveTo(x - h * 0.05, y - h * 0.75, x + h * 0.25, y - h * 1.15, x + h * 0.48, y - h * 0.85); c.bezierCurveTo(x + h * 0.62, y - h * 0.65, x + h * 0.58, y - h * 0.5, x + h * 0.5, y - h * 0.4); };
  c.beginPath(); p(); c.strokeStyle = INK; c.lineWidth = w + 8; c.lineCap = "round"; c.stroke();
  c.beginPath(); p(); c.strokeStyle = COL.greenLt; c.lineWidth = w; c.stroke();
  shape(c, () => ell(c, x + h * 0.5, y - h * 0.36, w * 0.75, w * 0.55), COL.leaf, 4);
};
// an ice-cream stick standing in soil at (x, y) (its bottom), numbered n
const stick = (c: Ctx, x: number, y: number, h: number, n: string) => {
  shape(c, () => rrect(c, x - 14, y - h, 28, h, 13), COL.wood, 5); shade(c, () => rrect(c, x - 14, y - h, 28, h, 13), COL.woodDk, 10, 0, 0.5);
  write(c, n, x - 8, y - h + 16, 30, INK, 5);
};
// a steel spoon: wrist end at (x, y), the handle running along angle an to the bowl, total length len
const spoon = (c: Ctx, x: number, y: number, an: number, len: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -10, -12, len - 60, 24, 12), COL.steel, 5);
  shape(c, () => ell(c, len - 40, 0, 62, 40), COL.steel, 5); shape(c, () => ell(c, len - 40, 0, 44, 26), COL.steelDk, 0); c.restore();
};
// soil texture: small darker specks inside the current clip
const specks = (c: Ctx, x: number, y: number, w: number, h: number, s: number) => { const r = rnd(s); for (let i = 0; i < w * h / 2600; i++) { const px = x + r() * w, py = y + r() * h; shape(c, () => ell(c, px, py, 5 + r() * 5, 4 + r() * 3), COL.soilDk, 0); } };
// a box of soil (a cut-off plastic box) on a tray, seen a little from above: front face x0..x1, top face above y0 to y1
const soilBox = (c: Ctx, x0: number, x1: number, yTop: number, yFront: number, yBot: number, cutaway = false) => {
  shadow(c, (x0 + x1) / 2 + 30, yBot + 10, (x1 - x0) * 0.56, 24);
  const inset = 60;
  if (cutaway) {
    shape(c, () => polyP(c, [[x0, yFront], [x1, yFront], [x1, yBot], [x0, yBot]]), COL.soil);
    c.save(); c.beginPath(); c.rect(x0, yFront, x1 - x0, yBot - yFront); c.clip(); specks(c, x0, yFront, x1 - x0, yBot - yFront, 31); c.restore();
  } else {
    shape(c, () => polyP(c, [[x0, yFront], [x1, yFront], [x1, yBot], [x0, yBot]]), "#e2eaf0");
    shade(c, () => polyP(c, [[x0, yFront], [x1, yFront], [x1, yBot], [x0, yBot]]), COL.steelDk, (x1 - x0) * 0.7, 0, 0.35);
  }
  const top = () => polyP(c, [[x0 + inset, yTop], [x1 - inset, yTop], [x1, yFront], [x0, yFront]]);
  shape(c, top, COL.soil); c.save(); c.beginPath(); top(); c.clip(); specks(c, x0, yTop, x1 - x0, yFront - yTop, 17); c.restore();
  c.beginPath(); top(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const paperCup = (c: Ctx, x: number, y: number, w: number, h: number, soilTop = true) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, WHITE); shade(c, body, COL.grey, w * 0.5, 0, 0.35);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.12), soilTop ? COL.soil : WHITE, 5);
  if (soilTop) { c.save(); c.beginPath(); ell(c, x, y - h, w / 2, w * 0.12); c.clip(); specks(c, x - w / 2, y - h - w * 0.12, w, w * 0.24, 5); c.restore(); }
  line(c, [[x - w / 2 - 4, y - h], [x + w / 2 + 4, y - h]], 6, INK);
};
const saucer = (c: Ctx, x: number, y: number, rx: number) => { shadow(c, x + rx * 0.08, y + 10, rx, rx * 0.22); shape(c, () => ell(c, x, y, rx, rx * 0.24), COL.steel); shape(c, () => ell(c, x, y - 4, rx * 0.8, rx * 0.16), COL.steelIn, 4); };
const windowFrame = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 10), COL.wood);
  shape(c, () => rrect(c, x + 24, y + 24, w - 48, h - 48, 4), COL.sky, 5);
  line(c, [[x + w / 2, y + 24], [x + w / 2, y + h - 24]], 14, COL.wood); line(c, [[x + 24, y + h / 2], [x + w - 24, y + h / 2]], 14, COL.wood);
  shape(c, () => rrect(c, x - 30, y + h, w + 60, 34, 6), COL.wood); shade(c, () => rrect(c, x - 30, y + h, w + 60, 34, 6), COL.woodDk, 0, 16, 0.5);
};
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 12, y + h + 6, w / 2, 14);
  shape(c, () => rrect(c, x, y, w, h, 4), "#f1efe6", 5);
  c.fillStyle = COL.greyDk; c.fillRect(x + 24, y + 22, w * 0.5, 22);
  for (let r = 0; r < Math.floor((h - 70) / 20); r++) for (let col = 0; col < 3; col++) { c.globalAlpha = 0.35; c.fillRect(x + 24 + col * (w - 48) / 3 + 4, y + 64 + r * 20, (w - 48) / 3 - 16, 7); c.globalAlpha = 1; }
};
const closedEyes = (c: Ctx, x: number, y: number, h: number, sit = false) => {
  const head = h * 0.13, hy = (sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74) - head * 1.05;
  for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.2, head * 0.22), SKIN.child, 0); c.beginPath(); c.arc(x + s * head * 0.35, hy + head * 0.02, head * 0.17, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
};
const table = (c: Ctx, y: number, col: string = COL.wood) => { c.fillStyle = col; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6, INK); };

// ---------------------------------------------------------------- set-up cards
// e1.0 five soaked chana pushed into a box of soil, each beside a numbered stick
const e1s0 = (c: Ctx) => {
  ground(c);
  table(c, 700, "#d9c9a8");
  soilBox(c, 170, 910, 520, 640, 900);
  const sx = [290, 415, 540, 665, 790];
  sx.forEach((x, i) => stick(c, x, 590, 180, String(i + 1)));
  sx.forEach((x, i) => { if (i !== 2) chana(c, x - 66, 592, 22, true); });
  // seed 3 is being pushed in: the fingertips (78 px along the hand) rest on its top, clear of the sticks
  chana(c, 474, 600, 22, true);
  hand(c, 474, 600 - 22 - 78, Math.PI / 2, 1);
  arrow(c, [[590, 420], [590, 540]], RED, 9);
};
// e1.1 a spoon lifting the soil beside stick 2: the seed has a short white root
const e1s1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 560, D, D); specks(c, 0, 560, D, 520, 41); line(c, [[0, 560], [D, 560]], 6, INK);
  stick(c, 290, 575, 230, "2");
  // the hole the spoon opened, the seed inside with its root going down
  shape(c, () => { c.moveTo(470, 560); c.quadraticCurveTo(520, 760, 700, 760); c.quadraticCurveTo(820, 720, 800, 560); c.closePath(); }, SOILLT, 5);
  root(c, [[690, 650], [698, 700], [690, 745]], 13);
  chana(c, 690, 632, 40, true);
  // the spoon's bowl rests at the hole's rim with a clump of soil just lifted; the hand on the handle
  spoon(c, 790, 320, Math.PI * 0.72, 330);
  shape(c, () => ell(c, 598, 520, 50, 28), COL.soil, 4);
  hand(c, 790, 320, Math.PI * 0.72, 1.1);
};
// e1.2 four drawings in a row on the table: fat seed, short root, long root, long root and a curled shoot
const e1s2 = (c: Ctx) => {
  ground(c);
  table(c, 0, "#d9c9a8");
  const paper = (x: number, y: number) => { shadow(c, x + 110, y + 150, 100, 20); shape(c, () => rrect(c, x, y, 200, 290, 6), COL.paper, 5); };
  const xs = [60, 310, 560, 810];
  xs.forEach((x) => paper(x, 390));
  write(c, "1", 80, 405, 28, INK, 5); write(c, "2", 330, 405, 28, INK, 5); write(c, "3", 580, 405, 28, INK, 5); write(c, "4", 830, 405, 28, INK, 5);
  chana(c, 160, 530, 42, true);
  root(c, [[410, 530], [414, 560], [410, 590]], 10); chana(c, 410, 512, 40, true);
  root(c, [[660, 510], [668, 560], [660, 610], [655, 650]], 11); chana(c, 660, 492, 40, true);
  root(c, [[910, 540], [918, 590], [910, 630], [905, 660]], 11); shoot(c, 910, 520, 70, 12); chana(c, 910, 522, 40, true);
};
// e2.0 three bowls soaking rajma, moong and rai
const e2s0 = (c: Ctx) => {
  ground(c);
  table(c, 500, "#d9c9a8");
  const bowls: [number, number][] = [[195, 560], [540, 560], [885, 560]];
  bowls.forEach(([x, y]) => bowl(c, x, y, 165, COL.water));
  const inside = (x: number, y: number, f: () => void) => { c.save(); c.beginPath(); ell(c, x, y, 155, 31); c.clip(); f(); c.restore(); };
  inside(195, 560, () => { const r = rnd(3); for (let i = 0; i < 10; i++) rajma(c, 95 + r() * 200, 546 + r() * 28, 26, r() * 3); });
  inside(540, 560, () => { const r = rnd(4); for (let i = 0; i < 18; i++) seed(c, 430 + r() * 220, 546 + r() * 28, 15, r() * 3, true); });
  inside(885, 560, () => { const r = rnd(5); for (let i = 0; i < 34; i++) rai(c, 775 + r() * 220, 546 + r() * 28, 6); });
};
// e2.1 a steel plate, wet tissue, three rows: rajma, moong, rai; a few show white tails
const e2s1 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 560, 470, 330);
  shape(c, () => rrect(c, 200, 380, 680, 360, 24), TISSUEWET, 5);
  const r = rnd(9); for (let i = 0; i < 12; i++) { const x = 230 + r() * 620, y = 400 + r() * 320; shape(c, () => ell(c, x, y, 9, 6), COL.drop, 2.5); }
  for (let i = 0; i < 6; i++) { const x = 270 + i * 108, y = 450; if (i % 2 === 1) root(c, [[x, y + 10], [x + 10, y + 36], [x + 14, y + 56]], 9); rajma(c, x, y, 30, 0.1 * i); }
  for (let i = 0; i < 6; i++) { const x = 270 + i * 108, y = 570; if (i !== 2 && i !== 5) root(c, [[x, y + 6], [x + 8, y + 28], [x + 10, y + 46]], 7); seed(c, x, y, 20, 0.4 * i, true); }
  for (let i = 0; i < 6; i++) { const x = 270 + i * 108, y = 680; if (i % 3 === 0) root(c, [[x, y + 2], [x + 5, y + 16], [x + 7, y + 28]], 5); rai(c, x, y, 9); }
};
// a1.0 a plate of rajma, chana, groundnuts, moong and a tamarind seed; a cloth bag beside it
const bag = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 8, w * 0.55, w * 0.1);
  const body = () => { c.moveTo(x - w * 0.3, y - h); c.quadraticCurveTo(x - w * 0.55, y - h * 0.55, x - w * 0.5, y - w * 0.05); c.quadraticCurveTo(x, y + w * 0.12, x + w * 0.5, y - w * 0.05); c.quadraticCurveTo(x + w * 0.55, y - h * 0.55, x + w * 0.3, y - h); c.closePath(); };
  shape(c, body, COL.cloth); shade(c, body, "#d9d2c3", w * 0.3, 0, 0.6);
  shape(c, () => ell(c, x, y - h, w * 0.3, w * 0.09), "#d9d2c3", 5);
  line(c, [[x - w * 0.34, y - h + 30], [x + w * 0.34, y - h + 30]], 5, "#b9b1a0");
};
const a1s0 = (c: Ctx) => {
  ground(c);
  table(c, 640, "#d9c9a8");
  plate(c, 400, 560, 350, 240);
  rajma(c, 240, 520, 30, -0.3); rajma(c, 300, 560, 30, 0.4);
  chana(c, 410, 480, 27); chana(c, 470, 505, 27);
  groundnut(c, 560, 560, 46, 0.3); groundnut(c, 470, 610, 46, -0.4);
  seed(c, 330, 630, 16, 0.5); seed(c, 370, 640, 16, 1.5); seed(c, 300, 460, 16, 2.2); seed(c, 350, 475, 16, 0.3);
  tamarind(c, 600, 480, 24, 0.3); tamarind(c, 250, 600, 24, -0.2);
  bag(c, 870, 640, 260, 330);
};
// a1.1 the child, eyes shut, one hand inside the bag on the floor
const a1s1 = (c: Ctx) => {
  ground(c);
  table(c, 900, "#d9c9a8");
  const X = 560, Y = 900, H = 600;
  // the bag's back (its inside) first, then the child, then the bag's front so the arm goes into it
  const bx = 330, bw = 300, top = 770;
  shape(c, () => ell(c, bx, top, bw * 0.3, bw * 0.1), "#b9b1a0", 5);
  person(c, X, Y, H, { sit: true, armL: [2.75, 2.2], armR: [Math.PI * 0.6, Math.PI * 0.55] });
  closedEyes(c, X, Y, H, true);
  const body = () => { c.moveTo(bx - bw * 0.3, top); c.quadraticCurveTo(bx - bw * 0.55, top + 60, bx - bw * 0.5, Y - 10); c.quadraticCurveTo(bx, Y + 30, bx + bw * 0.5, Y - 10); c.quadraticCurveTo(bx + bw * 0.55, top + 60, bx + bw * 0.3, top); c.quadraticCurveTo(bx, top + bw * 0.1, bx - bw * 0.3, top); c.closePath(); };
  shape(c, body, COL.cloth); shade(c, body, "#d9d2c3", bw * 0.3, 0, 0.6);
  // the seed in the bag, drawn faintly through the cloth: a question mark drawn as a hook
  c.beginPath(); c.arc(bx, 830, 26, Math.PI, Math.PI * 2.3); c.strokeStyle = COL.greyDk; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); line(c, [[bx + 20, 848], [bx + 4, 866]], 8, COL.greyDk); shape(c, () => ell(c, bx + 2, 888, 6, 6), COL.greyDk, 0);
};
// a2.0 a paper strip on the floor, seeds in a line, smallest to biggest
const strip = (c: Ctx, y: number) => { shadow(c, 560, y + 60, 480, 20); shape(c, () => rrect(c, 70, y - 70, 940, 140, 8), COL.paper, 5); };
const seedLine = (c: Ctx, y: number) => { rai(c, 140, y, 10); seed(c, 265, y, 20, 0.2); chana(c, 400, y, 30); rajma(c, 545, y, 40, 0.1); groundnut(c, 715, y, 58, 0.15); mangoStone(c, 905, y, 85, 0.1); };
const a2s0 = (c: Ctx) => {
  ground(c);
  table(c, 0, "#d9c9a8");
  strip(c, 560); seedLine(c, 560);
  arrow(c, [[140, 760], [900, 760]], RED, 9);
};
// a2.1 the child points to the rai at one end and the mango stone at the other
const a2s1 = (c: Ctx) => {
  ground(c);
  table(c, 0, "#d9c9a8");
  const X = 540, Y = 740, H = 640, aL = 2.077, aR = 1.077;
  person(c, X, Y, H, { armL: [aL, aL], armR: [aR, aR] });
  // pointing fingers at the ends of the arms, then the strip in front of the child
  const sh = Y - H * 0.74 + H * 0.03, L = H * 0.33, uw = H * 0.06;
  for (const [sx, a] of [[X - H * 0.11, aL], [X + H * 0.11, aR]] as [number, number][]) { const wx = sx + Math.cos(a) * L, wy = sh + Math.sin(a) * L; line(c, [[wx, wy], [wx + Math.cos(a) * uw * 0.9, wy + Math.sin(a) * uw * 0.9]], 18, INK); line(c, [[wx, wy], [wx + Math.cos(a) * uw * 0.9, wy + Math.sin(a) * uw * 0.9]], 10, SKIN.child); }
  strip(c, 880); seedLine(c, 880);
};
// a3.0 a cut pumpkin, its seeds scooped with a spoon into a steel sieve
const pumpkinHalf = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 20, y + r * 0.62, r, r * 0.16);
  shape(c, () => ell(c, x, y, r, r * 0.62), COL.orange); shade(c, () => ell(c, x, y, r, r * 0.62), "#c97a24", r * 0.2, r * 0.1, 0.5);
  shape(c, () => ell(c, x, y, r * 0.82, r * 0.48), COL.yellow, 5);
  shape(c, () => ell(c, x, y, r * 0.5, r * 0.28), "#f0b24a", 4);
  c.save(); c.beginPath(); ell(c, x, y, r * 0.5, r * 0.28); c.clip();
  for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(x - r * 0.5, y - r * 0.2 + k * r * 0.1); c.quadraticCurveTo(x, y + r * 0.1 - k * r * 0.08, x + r * 0.5, y - r * 0.15 + k * r * 0.08); c.strokeStyle = "#e08a2e"; c.lineWidth = 4; c.stroke(); }
  const rr = rnd(21); for (let i = 0; i < 12; i++) pumpkinSeed(c, x - r * 0.4 + rr() * r * 0.8, y - r * 0.2 + rr() * r * 0.4, 18, rr() * 3);
  c.restore();
};
const sieve = (c: Ctx, x: number, y: number, r: number) => {
  bowl(c, x, y, r, COL.steelIn);
  c.save(); c.beginPath(); ell(c, x, y, r * 0.98, r * 0.19); c.clip(); c.strokeStyle = COL.steelDk; c.lineWidth = 2.5;
  for (let k = -r; k <= r; k += 16) { c.beginPath(); c.moveTo(x + k, y - r); c.lineTo(x + k, y + r); c.stroke(); c.beginPath(); c.moveTo(x - r, y + k * 0.2); c.lineTo(x + r, y + k * 0.2); c.stroke(); }
  c.restore();
  shape(c, () => rrect(c, x + r - 6, y - 12, r * 0.9, 24, 12), COL.steel, 5);
};
const a3s0 = (c: Ctx) => {
  ground(c);
  table(c, 700, "#d9c9a8");
  pumpkinHalf(c, 300, 640, 250);
  sieve(c, 720, 720, 150);
  // the spoon tips seeds into the sieve
  spoon(c, 900, 310, Math.PI * 0.78, 300);
  pumpkinSeed(c, 690, 560, 20, 1.3); pumpkinSeed(c, 705, 620, 20, 1.6); pumpkinSeed(c, 730, 670, 20, 1.1);
  hand(c, 900, 310, Math.PI * 0.78, 1, SKIN.adult, CLOTH.adult);
  arrow(c, [[640, 520], [700, 690]], RED, 8);
};
// a3.1 pale pumpkin seeds drying on a newspaper by a window
const a3s1 = (c: Ctx) => {
  ground(c);
  windowFrame(c, 240, 60, 600, 440);
  table(c, 620, "#d9c9a8");
  newspaper(c, 150, 560, 780, 440);
  const r = rnd(12); for (let i = 0; i < 22; i++) pumpkinSeed(c, 240 + (i % 6) * 120 + r() * 30, 640 + Math.floor(i / 6) * 90 + r() * 30, 30, r() * 3);
};
// p1.0 the child pushes pumpkin seeds into a paper cup of soil on a saucer
const p1s0 = (c: Ctx) => {
  ground(c);
  table(c, 760, "#d9c9a8");
  saucer(c, 540, 820, 260);
  paperCup(c, 540, 810, 300, 330);
  pumpkinSeed(c, 450, 470, 26, 0.4); pumpkinSeed(c, 640, 482, 26, -0.3);
  // the seed under the fingertips, its point going into the soil
  pumpkinSeed(c, 548, 488, 30, Math.PI / 2 + 0.2);
  hand(c, 548, 488 - 30 - 78 * 1.3, Math.PI / 2, 1.3);
  arrow(c, [[690, 330], [690, 430]], RED, 9);
};
// p1.1 the same cup on the windowsill, two young pumpkin plants with round seed leaves
const seedling = (c: Ctx, x: number, y: number, h: number, trueLeaf = false) => {
  line(c, [[x, y], [x + h * 0.05, y - h]], 16, INK); line(c, [[x, y], [x + h * 0.05, y - h]], 9, COL.greenLt);
  const tx = x + h * 0.05, ty = y - h;
  for (const s of [-1, 1]) { shape(c, () => ell(c, tx + s * h * 0.3, ty - h * 0.05, h * 0.3, h * 0.2), COL.leaf, 5); line(c, [[tx + s * h * 0.05, ty - h * 0.04], [tx + s * h * 0.5, ty - h * 0.08]], 3, COL.leafDk); }
  if (trueLeaf) leaf(c, tx, ty - h * 0.1, h * 0.35, -Math.PI / 2, COL.green);
};
const p1s1 = (c: Ctx) => {
  ground(c);
  windowFrame(c, 170, 160, 740, 480);
  c.fillStyle = "#d9c9a8"; c.fillRect(0, 674, D, D);
  saucer(c, 540, 650, 230);
  paperCup(c, 540, 640, 260, 300);
  seedling(c, 480, 335, 160); seedling(c, 600, 330, 130);
};

// ---------------------------------------------------------------- picture cards
// flow.e1: the box cut away: five seeds under their sticks, each with a white root growing down
const flowE1 = (c: Ctx) => {
  ground(c);
  table(c, 880, "#d9c9a8");
  soilBox(c, 150, 930, 470, 560, 880, true);
  const sx = [255, 395, 535, 675, 815];
  sx.forEach((x, i) => stick(c, x, 535, 180, String(i + 1)));
  sx.forEach((x) => { root(c, [[x - 55, 660], [x - 48, 720], [x - 56, 780], [x - 50, 820]], 12); chana(c, x - 55, 640, 32, true); });
};
// flow.e2: rajma, moong and rai side by side on wet tissue, each with its root
const flowE2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = TISSUEWET; c.fillRect(0, 0, D, D); c.strokeStyle = "#9bbad6"; c.lineWidth = 2; c.globalAlpha = 0.4;
  for (let x = 30; x < D; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); } for (let y = 30; y < D; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  c.globalAlpha = 1;
  root(c, [[230, 470], [245, 580], [230, 690], [240, 760]], 20); rajma(c, 230, 420, 110, 0.1);
  root(c, [[540, 460], [552, 560], [540, 650], [548, 710]], 16); seed(c, 540, 420, 64, 0.2, true);
  root(c, [[850, 445], [858, 520], [850, 590], [856, 630]], 11); rai(c, 850, 420, 24);
};
// flow.a1: the cloth bag with the seeds spilling out of it
const flowA1 = (c: Ctx) => {
  ground(c);
  table(c, 700, "#d9c9a8");
  bag(c, 420, 760, 420, 520);
  rajma(c, 640, 720, 36, 0.3); rajma(c, 700, 790, 36, -0.5);
  chana(c, 760, 730, 32); chana(c, 820, 800, 32);
  groundnut(c, 900, 740, 56, 0.2); groundnut(c, 700, 880, 56, -0.3);
  seed(c, 840, 880, 20, 0.5); seed(c, 790, 860, 20, 1.3); seed(c, 630, 850, 20, 2.1);
  tamarind(c, 890, 860, 30, 0.2); tamarind(c, 760, 940, 30, -0.3);
};
// flow.a3: a pumpkin cut in two, the seeds inside and a heap of washed seeds in front
const flowA3 = (c: Ctx) => {
  ground(c);
  table(c, 720, "#d9c9a8");
  pumpkinHalf(c, 300, 560, 240);
  // the other half seen from the outside: ribs and a stalk
  shadow(c, 800, 710, 220, 40);
  shape(c, () => ell(c, 790, 560, 220, 170), COL.orange); shade(c, () => ell(c, 790, 560, 220, 170), "#c97a24", 60, 30, 0.5);
  for (const k of [-0.5, 0, 0.5]) { c.beginPath(); c.ellipse(790, 560, 220 * Math.abs(k || 0.02), 170, 0, 0, Math.PI * 2); c.strokeStyle = "#c97a24"; c.lineWidth = 5; c.stroke(); }
  shape(c, () => rrect(c, 770, 360, 40, 50, 12), COL.greenDk, 5);
  const r = rnd(8); for (let i = 0; i < 14; i++) pumpkinSeed(c, 380 + r() * 360, 820 + r() * 120, 30, r() * 3);
};
// flow.p1: the cup on its saucer by the window, one pumpkin plant with seed leaves and a new leaf
const flowP1 = (c: Ctx) => {
  ground(c);
  windowFrame(c, 170, 200, 740, 480);
  c.fillStyle = "#d9c9a8"; c.fillRect(0, 714, D, D);
  saucer(c, 540, 690, 250);
  paperCup(c, 540, 680, 300, 330);
  seedling(c, 540, 350, 230, true);
};
// term.0: a row of seeds on a steel plate: chana, rajma, moong, a mango stone, black papaya seeds
const term0 = (c: Ctx) => {
  ground(c);
  table(c, 640, "#d9c9a8");
  plate(c, 540, 560, 480, 300);
  chana(c, 180, 560, 40); rajma(c, 330, 560, 50, 0.1); seed(c, 470, 560, 30, 0.2);
  mangoStone(c, 680, 560, 120, 0.1);
  for (let i = 0; i < 7; i++) papaya(c, 850 + (i % 3) * 36 + (i > 2 ? 18 : 0), 530 + Math.floor(i / 3) * 34, 13);
};
// term.2: a small plant lifted out of the soil, its white roots hanging below
const term2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 760, D, D); specks(c, 0, 760, D, 320, 51); line(c, [[0, 760], [D, 760]], 6, INK);
  shape(c, () => ell(c, 560, 775, 150, 40), SOILLT, 5);
  // roots first, then the stem and leaves, then the hand holding the stem
  root(c, [[560, 560], [540, 640], [530, 710]], 10); root(c, [[560, 560], [600, 620], [630, 690]], 10); root(c, [[560, 560], [565, 660], [560, 740]], 12); root(c, [[560, 560], [500, 600], [470, 640]], 8); root(c, [[560, 560], [620, 580], [660, 610]], 8);
  line(c, [[560, 560], [560, 300]], 16, INK); line(c, [[560, 560], [560, 300]], 9, COL.green);
  leaf(c, 560, 440, 110, Math.PI * 1.2); leaf(c, 560, 480, 100, -Math.PI * 0.2); leaf(c, 560, 300, 120, -Math.PI * 0.5); leaf(c, 560, 520, 90, Math.PI * 0.85);
  // the hand comes from the right and grips the stem: the gripped point is 70 px along the hand from the wrist
  hand(c, 630, 360, Math.PI, 1);
};
// term.3: a curled green shoot pushing up through the soil, like a bent finger
const term3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 520, D, D); specks(c, 0, 520, D, 560, 61); line(c, [[0, 520], [D, 520]], 6, INK);
  // a crack of soil pushed up where the hook comes through
  shape(c, () => { c.moveTo(430, 520); c.quadraticCurveTo(500, 460, 600, 470); c.quadraticCurveTo(680, 480, 720, 520); c.closePath(); }, COL.soil, 6);
  root(c, [[480, 760], [500, 850], [480, 940], [490, 1010]], 20); root(c, [[480, 760], [420, 800], [390, 860]], 10); root(c, [[480, 760], [540, 810], [560, 880]], 10);
  shoot(c, 480, 740, 380, 28);
  chana(c, 480, 740, 62, true);
  arrow(c, [[840, 560], [840, 330]], RED, 10);
};
// term.4: a young pumpkin seedling with two round seed leaves and a tiny new leaf in the middle
const term4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.soil; c.fillRect(0, 720, D, D); specks(c, 0, 720, D, 360, 71); line(c, [[0, 720], [D, 720]], 6, INK);
  seedling(c, 530, 720, 380, true);
};
// expl.1: four chana seeds on a plate: fat, a short root, a long root, a long root and a curled shoot
const expl1 = (c: Ctx) => {
  ground(c);
  table(c, 700, "#d9c9a8");
  plate(c, 540, 560, 490, 320);
  chana(c, 200, 520, 46, true);
  root(c, [[420, 545], [426, 580], [420, 610]], 12); chana(c, 420, 525, 46, true);
  root(c, [[650, 520], [660, 580], [650, 640], [645, 690]], 13); chana(c, 650, 500, 46, true);
  root(c, [[880, 545], [890, 600], [880, 660], [876, 700]], 13); shoot(c, 880, 520, 95, 15); chana(c, 880, 522, 46, true);
  arrow(c, [[160, 760], [920, 760]], RED, 8);
};

export const ic_seedsAndLifeCyclesSeedsAndGerminationL1 = cards("sci.seeds-and-life-cycles.seeds-and-germination.L1", [
  e1s0, e1s1, e1s2, e2s0, e2s1, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, p1s0, p1s1,
  flowE1, flowE2, flowA1, flowA3, flowP1, term0, term2, term3, term4, expl1,
]);
