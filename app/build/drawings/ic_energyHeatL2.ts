import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// HOT AND COLD (sci.energy.heat.L2) · set-up cards and card pictures in the flat kit look.
// Coconut oil: white and hard when cold, clear and golden when melted. Same girl and same hands on every card.

const OIL = "#f3cf6a", OILDK = "#d9ad3d", SWEATER = "#8b6cc9", SWEATERDK = "#6a4fa3", TOWEL = "#f7f3e8";

// ---------------------------------------------------------------- small parts
const table = (c: Ctx, y: number) => { c.fillStyle = COL.wood; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); c.fillStyle = COL.woodDk; c.fillRect(0, y + 40, D, 14); };
const steam = (c: Ctx, x: number, y: number, h: number, col = COL.greyDk, n = 3, a = 0.8) => {
  c.globalAlpha = a;
  for (let i = 0; i < n; i++) { const sx = x + (i - (n - 1) / 2) * h * 0.32; line(c, [[sx, y], [sx - h * 0.12, y - h * 0.3], [sx + h * 0.12, y - h * 0.65], [sx, y - h]], 7, col); }
  c.globalAlpha = 1;
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 10; i++) { const an = (i / 10) * Math.PI * 2; line(c, [[x + Math.cos(an) * r * 1.3, y + Math.sin(an) * r * 1.3], [x + Math.cos(an) * r * 1.75, y + Math.sin(an) * r * 1.75]], Math.max(4, r * 0.12), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.2, 0.5);
};
// an ice cube, front face centred (x, y), side s
const ice = (c: Ctx, x: number, y: number, s: number) => {
  const h = s / 2, d = s * 0.4;
  shape(c, () => polyP(c, [[x - h, y - h], [x - h + d, y - h - d], [x + h + d, y - h - d], [x + h, y - h]]), COL.drop, 5);
  shape(c, () => polyP(c, [[x + h, y - h], [x + h + d, y - h - d], [x + h + d, y + h - d], [x + h, y + h]]), COL.waterDk, 5);
  shape(c, () => rrect(c, x - h, y - h, s, s, 4), COL.sky, 5);
  shine(c, [[x - h * 0.6, y - h * 0.5], [x - h * 0.6, y + h * 0.4]], Math.max(4, s * 0.1));
};
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), COL.water, 4); shape(c, () => ell(c, x - rx * 0.3, y - ry * 0.2, rx * 0.25, ry * 0.25), COL.drop, 0); };
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.3, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.3, x, y - r * 1.6); c.closePath(); }, COL.water, 4);
// a katori holding coconut oil: hard (a white heap) or melted (clear golden pool)
const katoriOil = (c: Ctx, x: number, y: number, r: number, hard: boolean) => {
  bowl(c, x, y, r, hard ? WHITE : OIL);
  if (hard) { shape(c, () => { c.moveTo(x - r * 0.75, y + 2); c.bezierCurveTo(x - r * 0.6, y - r * 0.5, x + r * 0.5, y - r * 0.55, x + r * 0.75, y + 2); c.closePath(); }, WHITE, 5); shade(c, () => { c.moveTo(x - r * 0.75, y + 2); c.bezierCurveTo(x - r * 0.6, y - r * 0.5, x + r * 0.5, y - r * 0.55, x + r * 0.75, y + 2); c.closePath(); }, COL.steelDk, r * 0.25, -r * 0.12, 0.35); }
  else { shape(c, () => ell(c, x, y, r * 0.86, r * 0.15), OIL, 0); shade(c, () => ell(c, x, y, r * 0.86, r * 0.15), OILDK, r * 0.25, 0, 0.5); shine(c, [[x - r * 0.5, y - 3], [x - r * 0.15, y - 5]], 6); }
};
// a folded knitted sweater, a soft rounded slab with ribbing; top-left (x, y)
const sweaterSlab = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, h * 0.35), SWEATER);
  shade(c, () => rrect(c, x, y, w, h, h * 0.35), SWEATERDK, w * 0.05, h * 0.3, 0.5);
  c.save(); c.beginPath(); rrect(c, x, y, w, h, h * 0.35); c.clip(); c.globalAlpha = 0.45;
  for (let k = x + 22; k < x + w; k += 26) line(c, [[k, y + 6], [k + 4, y + h - 6]], 4, SWEATERDK);
  c.restore(); c.globalAlpha = 1;
};
// a sheet of paper, top-left (x, y)
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h + 6, w / 2, 18); shape(c, () => rrect(c, x, y, w, h, 10), COL.paper, 6); };
// a big friendly head, face on, centre (x, y), radius r; mouth: open (haa), round (whoo) or smile
const face = (c: Ctx, x: number, y: number, r: number, mouth: "open" | "round" | "smile" = "smile") => {
  shape(c, () => rrect(c, x - r * 0.35, y + r * 0.8, r * 0.7, r * 0.6, r * 0.2), SKIN.child);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shade(c, () => ell(c, x, y, r, r * 1.05), SKIN.childDk, r * 0.3, r * 0.1, 0.4);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.1, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.1, r * 0.09, r * 0.12), INK, 0);
  if (mouth === "open") { shape(c, () => ell(c, x, y + r * 0.5, r * 0.28, r * 0.3), INK, 5); shape(c, () => ell(c, x, y + r * 0.62, r * 0.17, r * 0.1), COL.pink, 0); }
  else if (mouth === "round") shape(c, () => ell(c, x, y + r * 0.5, r * 0.11, r * 0.13), INK, 5);
  else { c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
};
// a steel tumbler, bottom centre (x, y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number, inside: string = COL.steelIn) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), inside, 5);
  shine(c, [[x - w * 0.35, y - h * 0.85], [x - w * 0.3, y - h * 0.2]], 7);
};
// a mirrored child's hand (the right hand), wrist at (x, y)
const handR = (c: Ctx, x: number, y: number, an: number, s = 1, open = false) => { c.save(); c.translate(x, y); c.scale(1, -1); hand(c, 0, 0, -an, s, SKIN.child, CLOTH.child, open); c.restore(); };
const hen = (c: Ctx, x: number, y: number, s: number) => {
  for (let i = -1; i <= 1; i++) shape(c, () => ell(c, x + i * s * 0.55, y + s * 0.55, s * 0.26, s * 0.2), WHITE, 4);
  shape(c, () => { c.moveTo(x - s, y + s * 0.5); c.bezierCurveTo(x - s * 1.1, y - s * 0.6, x + s * 0.4, y - s * 0.9, x + s * 0.7, y - s * 0.2); c.bezierCurveTo(x + s * 0.9, y + s * 0.2, x + s * 0.6, y + s * 0.6, x, y + s * 0.6); c.closePath(); }, COL.brown);
  shape(c, () => ell(c, x + s * 0.72, y - s * 0.55, s * 0.3, s * 0.3), COL.brown);
  shape(c, () => polyP(c, [[x + s * 0.98, y - s * 0.55], [x + s * 1.25, y - s * 0.48], [x + s * 0.98, y - s * 0.4]]), COL.yellow, 4);
  shape(c, () => polyP(c, [[x + s * 0.55, y - s * 0.8], [x + s * 0.65, y - s * 1.05], [x + s * 0.78, y - s * 0.85], [x + s * 0.9, y - s * 1.02], [x + s * 0.95, y - s * 0.78]]), COL.red, 4);
  shape(c, () => ell(c, x + s * 0.78, y - s * 0.6, s * 0.05, s * 0.05), INK, 0);
};
const window = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.sky, 6);
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 6); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 6);
  shape(c, () => rrect(c, x - 20, y + h, w + 40, 26, 6), COL.wood, 6);
};

// ---------------------------------------------------------------- set-up cards
// e1.0: two katoris of coconut oil on a fridge shelf
const e1s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 60, 840, 960, 24), COL.steelIn, 8);
  c.fillStyle = COL.steel; c.fillRect(140, 80, 800, 920);
  shape(c, () => rrect(c, 140, 80, 800, 920, 16), COL.steel, 0);
  // shelves
  for (const sy of [330, 640, 920]) { shape(c, () => polyP(c, [[150, sy], [930, sy], [930, sy + 22], [150, sy + 22]]), COL.glass, 5); line(c, [[150, sy], [930, sy]], 5); }
  // the door, open to the right
  shape(c, () => polyP(c, [[940, 60], [1070, 150], [1070, 980], [940, 1020]]), COL.steelIn, 7);
  shape(c, () => rrect(c, 985, 420, 36, 260, 14), COL.steelDk, 5);
  // the oil, white and hard, in two katoris on the middle shelf
  katoriOil(c, 350, 560, 150, true); katoriOil(c, 720, 560, 150, true);
  // a few cold lines
  for (const [x, y] of [[300, 200], [540, 230], [780, 190]]) line(c, [[x - 30, y], [x - 10, y - 20], [x + 10, y], [x + 30, y - 20]], 6, COL.blue);
};
// e1.1: wrapping one katori in a sweater, the other bare
const e1s1 = (c: Ctx) => {
  ground(c); table(c, 760);
  katoriOil(c, 230, 620, 130, true);
  sweaterSlab(c, 470, 640, 560, 120);
  katoriOil(c, 760, 580, 130, true);
  // the top flap of the sweater laid over the katori
  const flap = () => { c.moveTo(560, 610); c.quadraticCurveTo(580, 400, 760, 400); c.quadraticCurveTo(950, 400, 970, 610); c.closePath(); };
  shape(c, flap, SWEATER);
  c.save(); c.beginPath(); flap(); c.clip(); c.globalAlpha = 0.45;
  for (let k = 580; k < 980; k += 26) line(c, [[k, 400], [k + 4, 620]], 4, SWEATERDK);
  c.restore(); c.globalAlpha = 1;
  hand(c, 440, 440, 0.55, 1.1);
  arrow(c, [[330, 250], [500, 360]]);
};
// e1.2: later: bare katori runny, sweater folded back shows hard oil
const e1s2 = (c: Ctx) => {
  ground(c); table(c, 760);
  katoriOil(c, 240, 620, 140, false);
  sweaterSlab(c, 470, 640, 560, 120);
  // the flap folded back behind
  shape(c, () => { c.moveTo(520, 640); c.quadraticCurveTo(560, 380, 820, 370); c.quadraticCurveTo(1010, 380, 1010, 640); c.closePath(); }, SWEATERDK);
  katoriOil(c, 760, 580, 140, true);
};
// e2.0: four plates with four ice cubes
const e2s0 = (c: Ctx) => {
  ground(c); table(c, 900);
  for (let i = 0; i < 4; i++) { const x = 160 + i * 253; plate(c, x, 600, 118, 48); ice(c, x - 8, 560, 70); }
};
// e2.1: one cube in the hand over a plate; the other plates at a sunny sill, a table, a shady floor
const e2s1 = (c: Ctx) => {
  ground(c);
  // three small places along the top
  window(c, 70, 70, 260, 200); sun(c, 150, 150, 45); plate(c, 200, 280, 70, 28); ice(c, 196, 258, 40);
  shape(c, () => polyP(c, [[400, 230], [680, 230], [700, 300], [380, 300]]), COL.wood, 6); plate(c, 540, 222, 70, 28); ice(c, 536, 200, 40);
  shape(c, () => rrect(c, 760, 60, 280, 240, 10), COL.greyDk, 6); plate(c, 900, 270, 70, 28); ice(c, 896, 248, 40);
  // the hand, big, holding a cube over a plate
  table(c, 940);
  plate(c, 560, 840, 190, 70);
  hand(c, 380, 560, 0.2, 1.9);
  ice(c, 560, 540, 110);
  for (const [x, y] of [[520, 700], [600, 740]]) drop(c, x, y, 12);
};
// e2.2: the hand opened, a tiny wet cube left, water on the plate below
const e2s2 = (c: Ctx) => {
  ground(c); table(c, 940);
  plate(c, 560, 860, 230, 80); puddle(c, 580, 850, 110, 36);
  hand(c, 300, 520, -0.25, 2.2, SKIN.child, CLOTH.child, true);
  ice(c, 520, 480, 56);
  for (const [x, y] of [[470, 560], [600, 520], [560, 700]]) drop(c, x, y, 11);
};
// a1.0: a two-column sheet: a sun heads one column, a folded blanket the other
const a1s0 = (c: Ctx) => {
  ground(c);
  paper(c, 170, 90, 740, 900);
  line(c, [[540, 110], [540, 970]], 6); line(c, [[190, 300], [890, 300]], 6);
  sun(c, 355, 195, 55);
  sweaterSlab(c, 600, 150, 240, 90); shape(c, () => rrect(c, 620, 130, 240, 60, 20), SWEATER, 6);
  for (let i = 0; i < 4; i++) { line(c, [[230, 400 + i * 140], [500, 400 + i * 140]], 3, COL.grey); line(c, [[590, 400 + i * 140], [860, 400 + i * 140]], 3, COL.grey); }
};
// a1.1: the girl with her sheet looks at a quilt on the bed and a sunny window
const a1s1 = (c: Ctx) => {
  ground(c);
  window(c, 660, 90, 320, 260); sun(c, 760, 180, 60);
  // the bed with a folded quilt
  shape(c, () => rrect(c, 40, 700, 520, 180, 20), COL.wood, 6);
  shape(c, () => rrect(c, 60, 640, 480, 90, 20), COL.cloth, 6);
  sweaterSlab(c, 110, 560, 380, 110);
  // the floor and the girl
  line(c, [[0, 980], [D, 980]], 6);
  person(c, 760, 980, 620, { armL: [Math.PI * 0.75, Math.PI * 1.25], armR: [Math.PI * 0.4, Math.PI * 0.5] });
  shape(c, () => rrect(c, 560, 520, 110, 140, 6), COL.paper, 5); line(c, [[615, 530], [615, 650]], 3); line(c, [[570, 570], [660, 570]], 3);
};
// a2.0: haa: wide open mouth, warm breath on the palm
const a2s0 = (c: Ctx) => {
  ground(c);
  face(c, 330, 420, 200, "open");
  shape(c, () => { c.moveTo(560, 420); c.bezierCurveTo(600, 330, 760, 320, 800, 420); c.bezierCurveTo(840, 520, 620, 560, 560, 480); c.closePath(); }, COL.orange, 0);
  c.globalAlpha = 0.6; shape(c, () => ell(c, 690, 440, 140, 90), COL.yellow, 0); c.globalAlpha = 1;
  handR(c, 1020, 700, Math.PI * 0.62, 2.1, true);
};
// a2.1: whoo: small round lips, a hard cool blow
const a2s1 = (c: Ctx) => {
  ground(c);
  face(c, 330, 420, 200, "round");
  for (let i = -1; i <= 1; i++) line(c, [[560, 520 + i * 40], [800, 470 + i * 70]], 9, COL.blue);
  handR(c, 1020, 700, Math.PI * 0.62, 2.1, true);
};
// a3.0: the back of the hand against the neck
const a3s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 290, 760, 500, 320, 60), CLOTH.child, 6);
  face(c, 540, 400, 220, "smile");
  hand(c, 603, 778, -Math.PI * 0.62, 1.7, SKIN.child, CLOTH.child, true);
};
// a3.1: a body outline on paper, red where warm, blue where cooler
const a3s1 = (c: Ctx) => {
  ground(c);
  paper(c, 170, 60, 740, 960);
  const b = () => { c.moveTo(540, 160); c.bezierCurveTo(640, 160, 640, 300, 575, 320); c.lineTo(575, 350); c.bezierCurveTo(700, 360, 760, 420, 790, 620); c.lineTo(740, 630); c.lineTo(690, 480); c.lineTo(700, 760); c.lineTo(660, 960); c.lineTo(560, 960); c.lineTo(560, 790); c.lineTo(520, 790); c.lineTo(520, 960); c.lineTo(420, 960); c.lineTo(380, 760); c.lineTo(390, 480); c.lineTo(340, 630); c.lineTo(290, 620); c.bezierCurveTo(320, 420, 380, 360, 505, 350); c.lineTo(505, 320); c.bezierCurveTo(440, 300, 440, 160, 540, 160); c.closePath(); };
  shape(c, b, COL.paper, 6);
  shape(c, () => ell(c, 540, 335, 42, 32), COL.red, 0); shape(c, () => ell(c, 540, 560, 110, 90), COL.red, 0);
  shape(c, () => ell(c, 540, 250, 22, 26), COL.blue, 0); shape(c, () => ell(c, 450, 240, 16, 24), COL.blue, 0); shape(c, () => ell(c, 630, 240, 16, 24), COL.blue, 0);
  shape(c, () => ell(c, 310, 625, 34, 30), COL.blue, 0); shape(c, () => ell(c, 770, 625, 34, 30), COL.blue, 0);
  shape(c, () => ell(c, 470, 950, 50, 24), COL.blue, 0); shape(c, () => ell(c, 610, 950, 50, 24), COL.blue, 0);
};
// p1.0: three sheets folded and tied with thread into a little book, a sun on the cover
const p1s0 = (c: Ctx) => {
  ground(c); table(c, 900);
  shadow(c, 560, 780, 360, 40);
  for (let i = 2; i >= 0; i--) shape(c, () => rrect(c, 260 + i * 14, 180 + i * 14, 560, 580, 12), COL.paper, 5);
  shape(c, () => rrect(c, 260, 180, 560, 580, 12), COL.paper, 6);
  line(c, [[300, 180], [300, 760]], 4, COL.grey);
  for (const y of [300, 470, 640]) { line(c, [[280, y], [320, y]], 6, COL.red); shape(c, () => ell(c, 262, y, 14, 14), COL.red, 4); }
  sun(c, 560, 470, 110);
};
// p1.1: an open page: a hen on her eggs, and a small sun under it for "makes"
const p1s1 = (c: Ctx) => {
  ground(c); table(c, 920);
  shadow(c, 560, 820, 480, 40);
  shape(c, () => rrect(c, 60, 140, 490, 660, 12), COL.paper, 6); shape(c, () => rrect(c, 540, 140, 490, 660, 12), COL.paper, 6);
  hen(c, 300, 420, 150);
  sun(c, 300, 690, 45);
  line(c, [[600, 300], [980, 300]], 3, COL.grey); line(c, [[600, 440], [980, 440]], 3, COL.grey); line(c, [[600, 580], [980, 580]], 3, COL.grey);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: the girl peeps at the two katoris: bare one runny, wrapped one still hard
const flowE1 = (c: Ctx) => {
  ground(c);
  person(c, 540, 560, 560, { armL: [Math.PI * 0.8, Math.PI * 1.1], armR: [Math.PI * 0.2, Math.PI * 0.9] });
  table(c, 560);
  katoriOil(c, 260, 740, 150, false);
  sweaterSlab(c, 540, 800, 500, 120);
  shape(c, () => { c.moveTo(580, 800); c.quadraticCurveTo(620, 560, 820, 550); c.quadraticCurveTo(1000, 560, 1010, 800); c.closePath(); }, SWEATERDK);
  katoriOil(c, 800, 730, 150, true);
};
// flow.e2: the warm spot race: a sunny sill, a table and a hand, cubes of different sizes
const flowE2 = (c: Ctx) => {
  ground(c); table(c, 920);
  sun(c, 920, 150, 80);
  plate(c, 200, 700, 150, 60); ice(c, 190, 660, 86); puddle(c, 230, 700, 40, 14);
  plate(c, 540, 700, 150, 60); ice(c, 532, 666, 60); puddle(c, 560, 702, 70, 22);
  plate(c, 880, 700, 150, 60); puddle(c, 890, 696, 100, 32); ice(c, 878, 676, 34);
  hand(c, 400, 330, 0.25, 1.4); ice(c, 530, 320, 80);
  drop(c, 560, 450, 11); drop(c, 520, 540, 10);
};
// flow.a1: the warmth hunt sheet filled in: makers on the left, keepers on the right
const flowA1 = (c: Ctx) => {
  ground(c);
  paper(c, 120, 60, 840, 960);
  line(c, [[540, 80], [540, 1000]], 6); line(c, [[140, 290], [940, 290]], 6);
  sun(c, 330, 175, 60);
  sweaterSlab(c, 640, 140, 220, 80); shape(c, () => rrect(c, 660, 120, 220, 50, 18), SWEATER, 6);
  // makers: a diya flame, an iron box
  shape(c, () => { c.moveTo(220, 470); c.quadraticCurveTo(330, 530, 440, 470); c.quadraticCurveTo(440, 520, 330, 540); c.quadraticCurveTo(220, 520, 220, 470); c.closePath(); }, COL.brown);
  shape(c, () => { c.moveTo(330, 350); c.bezierCurveTo(380, 410, 370, 460, 330, 475); c.bezierCurveTo(290, 460, 280, 410, 330, 350); c.closePath(); }, COL.orange, 5);
  shape(c, () => ell(c, 330, 445, 14, 22), COL.yellow, 0);
  shape(c, () => { c.moveTo(190, 840); c.lineTo(400, 840); c.lineTo(470, 790); c.lineTo(470, 720); c.quadraticCurveTo(300, 690, 190, 720); c.closePath(); }, COL.steel);
  shape(c, () => rrect(c, 260, 650, 170, 60, 20), COL.black, 5);
  steam(c, 330, 840, 70, COL.orange, 3, 0.9);
  // keepers: a woollen cap, a quilt
  shape(c, () => { c.moveTo(640, 470); c.bezierCurveTo(640, 340, 880, 340, 880, 470); c.closePath(); }, COL.red);
  shape(c, () => rrect(c, 630, 455, 260, 50, 16), COL.red, 6); shape(c, () => ell(c, 760, 350, 28, 28), WHITE, 5);
  shape(c, () => rrect(c, 620, 700, 280, 170, 20), COL.teal, 6);
  for (let k = 660; k < 900; k += 60) line(c, [[k, 712], [k, 858]], 4, COL.tealDk);
  for (let k = 740; k < 870; k += 50) line(c, [[632, k], [888, k]], 4, COL.tealDk);
};
// flow.a2: haa on one side, whoo on the other
const flowA2 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 80], [540, 1000]], 5, COL.grey);
  face(c, 200, 420, 120, "open");
  c.globalAlpha = 0.8; shape(c, () => ell(c, 380, 450, 70, 50), COL.orange, 0); c.globalAlpha = 1;
  handR(c, 500, 750, Math.PI * 0.68, 1.25, true);
  face(c, 740, 420, 120, "round");
  for (let i = -1; i <= 1; i++) line(c, [[870, 480 + i * 22], [1000, 450 + i * 45]], 7, COL.blue);
  handR(c, 1050, 750, Math.PI * 0.68, 1.25, true);
};
// flow.p1: the girl holds up her finished little book
const flowP1 = (c: Ctx) => {
  ground(c); line(c, [[0, 1000], [D, 1000]], 6);
  person(c, 540, 1000, 820, { armL: [Math.PI * 0.85, Math.PI * 1.45], armR: [Math.PI * 0.15, Math.PI * 1.55] });
  shadow(c, 560, 560, 300, 30);
  shape(c, () => rrect(c, 300, 180, 480, 380, 12), COL.paper, 6);
  line(c, [[332, 180], [332, 560]], 4, COL.grey);
  for (const y of [260, 370, 480]) { line(c, [[315, y], [350, y]], 6, COL.red); shape(c, () => ell(c, 302, y, 12, 12), COL.red, 4); }
  hen(c, 560, 370, 90);
};
// term.0: hot and cold: a steaming idli on a banana leaf, an ice cube on a steel plate
const term0 = (c: Ctx) => {
  ground(c); table(c, 800);
  shape(c, () => { c.moveTo(60, 620); c.quadraticCurveTo(280, 540, 520, 630); c.quadraticCurveTo(300, 720, 60, 620); c.closePath(); }, COL.leaf);
  line(c, [[80, 622], [500, 630]], 4, COL.leafDk);
  for (const [x, y] of [[200, 590], [340, 600]]) { shadow(c, x + 10, y + 42, 90, 16); shape(c, () => ell(c, x, y + 30, 92, 22), COL.cloth); shape(c, () => { c.moveTo(x - 92, y + 30); c.bezierCurveTo(x - 92, y - 40, x + 92, y - 40, x + 92, y + 30); c.closePath(); }, WHITE); }
  steam(c, 270, 520, 220, COL.greyDk, 3, 0.7);
  plate(c, 800, 640, 200, 80); ice(c, 780, 580, 130);
  for (const [x, y] of [[700, 420], [900, 450]]) line(c, [[x - 30, y], [x - 10, y - 20], [x + 10, y], [x + 30, y - 20]], 6, COL.blue);
};
// term.3: heat moves from the hot milk into the hands
const term3 = (c: Ctx) => {
  ground(c); table(c, 860);
  tumbler(c, 540, 820, 260, 340, "#fff7e6");
  steam(c, 540, 470, 180, COL.greyDk, 3, 0.6);
  hand(c, 120, 640, -0.1, 1.9); handR(c, 960, 640, Math.PI + 0.1, 1.9);
  arrow(c, [[460, 620], [330, 620]], COL.orange, 12); arrow(c, [[620, 620], [750, 620]], COL.orange, 12);
};
// term.5: melt: a spoon of hard white oil, a spoon of clear golden oil
const term5 = (c: Ctx) => {
  ground(c); table(c, 880);
  const spoon = (x: number, hard: boolean) => {
    shadow(c, x + 20, 720, 160, 30);
    shape(c, () => rrect(c, x - 22, 240, 44, 300, 22), COL.steel, 6);
    shape(c, () => ell(c, x, 640, 150, 100), COL.steel); shade(c, () => ell(c, x, 640, 150, 100), COL.steelDk, 40, 20, 0.5);
    shape(c, () => ell(c, x, 640, 115, 72), hard ? WHITE : OIL, 5);
    if (hard) shape(c, () => { c.moveTo(x - 110, 640); c.bezierCurveTo(x - 90, 540, x + 90, 530, x + 110, 640); c.closePath(); }, WHITE, 5);
    else { shade(c, () => ell(c, x, 640, 115, 72), OILDK, 30, 10, 0.5); shine(c, [[x - 70, 620], [x - 30, 612]], 6); }
  };
  spoon(290, true); spoon(790, false);
  arrow(c, [[460, 400], [620, 400]]);
  for (const [x, y] of [[790, 300], [870, 340]]) line(c, [[x - 26, y], [x - 9, y - 18], [x + 9, y], [x + 26, y - 18]], 6, COL.orange);
};
// term.7: shivering in a towel after a bath
const term7 = (c: Ctx) => {
  ground(c); line(c, [[0, 1000], [D, 1000]], 6);
  for (const [x, y] of [[120, 300], [160, 500], [100, 700], [960, 320], [920, 520], [980, 720]]) line(c, [[x - 34, y], [x - 11, y - 22], [x + 11, y], [x + 34, y - 22]], 6, COL.blue);
  person(c, 540, 1000, 840, { armL: [Math.PI * 0.7, Math.PI * 1.3], armR: [Math.PI * 0.3, Math.PI * 1.7] });
  shape(c, () => rrect(c, 330, 400, 420, 520, 60), TOWEL, 6);
  shade(c, () => rrect(c, 330, 400, 420, 520, 60), COL.grey, 40, 0, 0.35);
  for (let k = 360; k < 750; k += 40) line(c, [[k, 900], [k, 920]], 4, COL.grey);
  for (const [x, y] of [[300, 520], [800, 520], [290, 760], [810, 760]]) line(c, [[x - 20, y - 20], [x + 20, y + 20]], 5, INK), line(c, [[x + 20, y - 20], [x - 20, y + 20]], 5, INK);
  for (const [x, y] of [[560, 620], [620, 700], [520, 740]]) drop(c, x, y, 9);
};
// expl.4: a hot dosa cooling, a frosty tumbler warming, on one table
const expl4 = (c: Ctx) => {
  ground(c); table(c, 760);
  plate(c, 300, 640, 240, 80);
  shape(c, () => { c.moveTo(120, 640); c.bezierCurveTo(140, 560, 440, 540, 480, 620); c.quadraticCurveTo(300, 690, 120, 640); c.closePath(); }, COL.wood);
  shade(c, () => { c.moveTo(120, 640); c.bezierCurveTo(140, 560, 440, 540, 480, 620); c.quadraticCurveTo(300, 690, 120, 640); c.closePath(); }, COL.woodDk, 20, 10, 0.5);
  steam(c, 300, 560, 220, COL.greyDk, 3, 0.45);
  tumbler(c, 800, 720, 220, 320, COL.water);
  for (const [x, y] of [[730, 560], [860, 620], [780, 680], [880, 480]]) drop(c, x, y, 11);
  for (const [x, y] of [[640, 330], [960, 360]]) line(c, [[x - 26, y], [x - 9, y - 18], [x + 9, y], [x + 26, y - 18]], 6, COL.blue);
};

export const ic_energyHeatL2 = cards("sci.energy.heat.L2", [
  e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, a1s0, a1s1, a2s0, a2s1, a3s0, a3s1, p1s0, p1s1,
  flowE1, flowE2, flowA1, flowA2, flowP1, term0, term3, term5, term7, expl4,
]);
