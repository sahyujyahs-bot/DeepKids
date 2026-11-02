import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, leaf, hand, person, write, cards } from "./flatKit";

// CARING FOR THE PLACE WE SHARE (L1) · set-up cards for the Bathroom Rain Test and the Sugar Test, then
// card pictures: the flows, litter, drain, wet and dry bins, and a wrapper's path to the river.
type Ctx = Parameters<typeof ground>[0];

// ---------------------------------------------------------------- places
const TILE = "#e9eef1", TILE_LN = "#c3ced6";
const bathroomFloor = (c: Ctx) => {
  ground(c, TILE);
  c.strokeStyle = TILE_LN; c.lineWidth = 4;
  for (let x = 0; x <= D; x += 216) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y <= D; y += 216) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
};
// a round steel floor drain with slots, centre (x, y), radius r
const grill = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.12, r * 1.05, r * 1.05);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, -r * 0.3, -r * 0.3, 0.45);
  shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), COL.steelIn, 4);
  c.save(); c.beginPath(); ell(c, x, y, r * 0.72, r * 0.72); c.clip();
  for (let i = -2; i <= 2; i++) shape(c, () => rrect(c, x - r, y + i * r * 0.3 - r * 0.08, r * 2, r * 0.16, r * 0.08), COL.black, 3);
  c.restore();
};
// kitchen counter: tiled top, a front edge; a crack in the tiles at (cx, cy)
const counter = (c: Ctx, cx: number, cy: number) => {
  ground(c, "#f3eee6");
  c.strokeStyle = "#d9d1c4"; c.lineWidth = 4;
  for (let x = 0; x <= D; x += 180) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 860); c.stroke(); }
  for (let y = 140; y <= 860; y += 180) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  shape(c, () => polyP(c, [[0, 860], [D, 860], [D, D], [0, D]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(0, 900, D, 180);
  line(c, [[0, 860], [D, 860]], 6);
  line(c, [[cx - 60, cy - 90], [cx - 20, cy - 40], [cx - 40, cy], [cx + 10, cy + 50], [cx, cy + 110]], 7);
  line(c, [[cx - 40, cy], [cx - 70, cy + 20]], 5);
};

// ---------------------------------------------------------------- litter
// a toffee wrapper: red with a pale stripe, twisted at both ends; centre (x, y)
const wrapper = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shadow(c, 8, 34, 90, 12);
  shape(c, () => polyP(c, [[-66, -30], [-98, -42], [-86, -14], [-98, 14], [-86, 42], [-66, 30]]), COL.red, 5);
  shape(c, () => polyP(c, [[66, -30], [98, -42], [86, -14], [98, 14], [86, 42], [66, 30]]), COL.red, 5);
  shape(c, () => rrect(c, -68, -32, 136, 64, 10), COL.red, 6);
  shade(c, () => rrect(c, -68, -32, 136, 64, 10), "#b53a2a", 0, 22, 0.5);
  shape(c, () => rrect(c, -50, -10, 100, 20, 8), COL.yellow, 3);
  c.restore();
};
// a torn bit of thin plastic bag, pale and see-through
const plasticBit = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => polyP(c, [[-90, -40], [-30, -70], [40, -50], [95, -10], [70, 50], [10, 70], [-50, 55], [-95, 10]]), "rgba(214,236,250,0.85)", 5);
  shine(c, [[-50, -30], [20, -40]], 7);
  c.restore();
};
// a scrap of newspaper: grey paper with lines of print
const newsScrap = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shadow(c, 8, 50, 70, 10);
  shape(c, () => polyP(c, [[-70, -60], [60, -70], [75, 55], [-60, 65]]), "#e8e4d8", 5);
  for (let i = 0; i < 5; i++) line(c, [[-50, -40 + i * 22], [50, -44 + i * 22]], 4, COL.greyDk);
  c.restore();
};
// a banana peel: a stalk and three yellow flaps spread out
const peel = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 10, 60, 80, 12);
  for (const an of [2.3, 1.57, 0.85]) leaf(c, 0, -10, 95, an, COL.yellow);
  shape(c, () => rrect(c, -16, -80, 32, 80, 12), COL.yellow, 5);
  shape(c, () => rrect(c, -12, -92, 24, 22, 8), COL.brown, 4);
  c.restore();
};
const pebble = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.55, r * 1.1, r * 0.3);
  shape(c, () => ell(c, x, y, r, r * 0.72), COL.grey);
  shade(c, () => ell(c, x, y, r, r * 0.72), COL.greyDk, -r * 0.25, -r * 0.2, 0.5);
  shine(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.1, y - r * 0.42]], 6);
};
// the five test things in a row, left to right, each at the given x on the floor line y
const ROW_X = [150, 330, 520, 700, 870];
const rowOfFive = (c: Ctx, y: number, which = [true, true, true, true, true]) => {
  if (which[0]) wrapper(c, ROW_X[0], y, 0.85, -0.2);
  if (which[1]) plasticBit(c, ROW_X[1], y, 0.85, 0.3);
  if (which[2]) newsScrap(c, ROW_X[2], y, 0.9, 0.15);
  if (which[3]) peel(c, ROW_X[3], y + 20, 0.85);
  if (which[4]) pebble(c, ROW_X[4], y + 20, 48);
};
// a chips packet: orange pillow pack with crimped ends and a yellow circle
const chipsPacket = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shadow(c, 10, 110, 80, 14);
  shape(c, () => { c.moveTo(-70, -100); c.lineTo(70, -100); c.quadraticCurveTo(95, 0, 70, 100); c.lineTo(-70, 100); c.quadraticCurveTo(-95, 0, -70, -100); c.closePath(); }, COL.orange);
  shade(c, () => { c.moveTo(-70, -100); c.lineTo(70, -100); c.quadraticCurveTo(95, 0, 70, 100); c.lineTo(-70, 100); c.quadraticCurveTo(-95, 0, -70, -100); c.closePath(); }, "#c9731e", 28, 0, 0.5);
  for (const yy of [-100, 100]) for (let i = -2; i <= 2; i++) line(c, [[i * 28 - 10, yy - 6], [i * 28 + 10, yy + 6]], 3);
  shape(c, () => ell(c, 0, 0, 44, 44), COL.yellow, 5);
  shape(c, () => ell(c, 0, 4, 24, 14), COL.red, 3);
  c.restore();
};
// a milk packet: white pillow with a blue band
const milkPacket = (c: Ctx, x: number, y: number, s = 1, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => rrect(c, -55, -75, 110, 150, 14), WHITE, 5);
  shape(c, () => rrect(c, -55, -20, 110, 40, 4), COL.blue, 4);
  for (let i = -1; i <= 1; i++) { line(c, [[i * 28 - 8, -80], [i * 28 + 8, -70]], 3); line(c, [[i * 28 - 8, 70], [i * 28 + 8, 80]], 3); }
  c.restore();
};
// a dustbin with a lid, bottom centre (x, y); open = lid tilted up
const bin = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string, open = false) => {
  shadow(c, x + w * 0.1, y + 8, w * 0.6, w * 0.12);
  const body = () => polyP(c, [[x - w * 0.45, y - h], [x + w * 0.45, y - h], [x + w * 0.38, y], [x - w * 0.38, y]]);
  shape(c, body, col); shade(c, body, dk, w * 0.22, 0, 0.5);
  for (let i = 1; i <= 2; i++) line(c, [[x - w * 0.42 + i * 4, y - h + h * 0.3 * i], [x + w * 0.42 - i * 4, y - h + h * 0.3 * i]], 4, dk);
  if (open) { c.save(); c.translate(x - w * 0.5, y - h); c.rotate(-0.6); shape(c, () => rrect(c, 0, -h * 0.1, w, h * 0.1, 8), col, 5); c.restore(); }
  else { shape(c, () => rrect(c, x - w * 0.52, y - h - h * 0.09, w * 1.04, h * 0.1, 8), col, 5); shape(c, () => rrect(c, x - w * 0.12, y - h - h * 0.17, w * 0.24, h * 0.08, 8), col, 4); }
};

// ---------------------------------------------------------------- small animals
// an ant walking towards angle an; centre (x, y), size s (1 = about 60 px long)
const ant = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 0, 1]) for (const sd of [-1, 1]) line(c, [[k * 9, sd * 5], [k * 14 + 6, sd * 16], [k * 18 + 4, sd * 22]], 2.5);
  shape(c, () => ell(c, -22, 0, 16, 11), COL.black, 3); shape(c, () => ell(c, 0, 0, 9, 7), COL.black, 3); shape(c, () => ell(c, 15, 0, 10, 8), COL.black, 3);
  line(c, [[22, -3], [34, -12]], 2.5); line(c, [[22, 3], [34, 12]], 2.5);
  c.restore();
};
// a square of paper with a pinch of sugar on it, centre (x, y)
const sugarPaper = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 12, 90, 120, 20);
  shape(c, () => polyP(c, [[-120, -80], [120, -90], [125, 85], [-115, 90]]), COL.paper, 6);
  shape(c, () => ell(c, 0, 10, 62, 36), "#f6f6f2", 5);
  const r = rnd(5);
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); shape(c, () => rrect(c, Math.cos(a) * d * 52 - 5, 10 + Math.sin(a) * d * 26 - 5, 10, 10, 2), WHITE, 2); }
  c.restore();
};
// a beetle seen from above, head towards angle an
const beetle = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 0, 1]) for (const sd of [-1, 1]) line(c, [[k * 16, sd * 18], [k * 20 + 8, sd * 34], [k * 26 + 4, sd * 44]], 4);
  shape(c, () => ell(c, -4, 0, 42, 28), "#3a5a2e", 5);
  line(c, [[-44, 0], [20, 0]], 3, INK);
  shape(c, () => ell(c, 30, 0, 16, 13), COL.black, 4);
  shape(c, () => ell(c, 44, 0, 10, 8), COL.black, 3);
  line(c, [[50, -4], [66, -16]], 3); line(c, [[50, 4], [66, 16]], 3);
  shine(c, [[-26, -12], [-4, -16]], 5);
  c.restore();
};
// a little fish
const fish = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[30, 0], [58, -22], [58, 22]]), COL.orange, 4);
  shape(c, () => ell(c, 0, 0, 40, 22), COL.orange, 5);
  shape(c, () => ell(c, -16, -5, 5, 5), INK, 0);
  c.restore();
};
// a crow drawn as a child would: black bird with a beak and a leg
const crowSketch = (c: Ctx, x: number, y: number, s = 1) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => ell(c, 0, 0, 44, 26), COL.black, 4);
  shape(c, () => ell(c, 34, -22, 18, 16), COL.black, 4);
  shape(c, () => polyP(c, [[50, -24], [74, -18], [50, -12]]), COL.yellow, 3);
  shape(c, () => polyP(c, [[-40, -6], [-78, -26], [-44, 8]]), COL.black, 4);
  line(c, [[-6, 24], [-6, 44]], 4); line(c, [[14, 24], [14, 44]], 4);
  c.restore();
};

// ---------------------------------------------------------------- things in the hand
// a steel mug, tilted so water pours out of its lip towards the lower left; handle on the right
const mugPouring = (c: Ctx, x: number, y: number, tilt = 0.9, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
  shape(c, () => { c.moveTo(70, -60); c.quadraticCurveTo(150, -40, 150, 30); c.quadraticCurveTo(150, 90, 70, 80); c.lineTo(70, 50); c.quadraticCurveTo(118, 50, 118, 25); c.quadraticCurveTo(118, -25, 70, -30); c.closePath(); }, COL.steel, 6);
  shape(c, () => rrect(c, -80, -110, 160, 220, 18), COL.steel);
  shade(c, () => rrect(c, -80, -110, 160, 220, 18), COL.steelDk, 40, 0, 0.5);
  shape(c, () => ell(c, 0, -110, 80, 22), COL.steelIn, 6);
  shape(c, () => ell(c, -8, -108, 56, 12), COL.water, 0);
  shine(c, [[-58, -70], [-58, 40]], 7);
  c.restore();
};
// a pot of tulsi, bottom centre (x, y), pot width w; droop = leaves hang down
const tulsiPot = (c: Ctx, x: number, y: number, w: number, droop = false) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.12);
  const body = () => polyP(c, [[x - w * 0.5, y - w * 0.95], [x + w * 0.5, y - w * 0.95], [x + w * 0.36, y], [x - w * 0.36, y]]);
  shape(c, body, "#c8744a"); shade(c, body, "#9d5733", w * 0.22, 0, 0.5);
  shape(c, () => rrect(c, x - w * 0.56, y - w * 1.08, w * 1.12, w * 0.15, 10), "#c8744a", 6);
  shape(c, () => ell(c, x, y - w * 1.08, w * 0.5, w * 0.08), COL.soil, 5);
  const top = y - w * 1.08;
  line(c, [[x, top], [x, top - w * 0.9]], 7, COL.leafDk);
  for (let i = 0; i < 4; i++) {
    const by = top - w * 0.25 - i * w * 0.2, sd = i % 2 ? 1 : -1;
    line(c, [[x, by], [x + sd * w * 0.22, by - w * (droop ? 0.02 : 0.12)]], 5, COL.leafDk);
    leaf(c, x + sd * w * 0.22, by - w * (droop ? 0.02 : 0.12), w * 0.3, droop ? (sd > 0 ? 1.2 : 1.9) : (sd > 0 ? -0.3 : Math.PI + 0.3), droop ? COL.green : COL.leaf);
  }
  leaf(c, x, top - w * 0.9, w * 0.3, droop ? 1.3 : -Math.PI / 2, droop ? COL.green : COL.leaf);
};

// ---------------------------------------------------------------- set-up cards: the Bathroom Rain Test
const e1_0 = (c: Ctx) => {
  bathroomFloor(c);
  grill(c, 540, 260, 120);
  rowOfFive(c, 700);
};
const e1_1 = (c: Ctx) => {
  bathroomFloor(c);
  grill(c, 540, 230, 110);
  // water spreading from behind the row towards the drain
  shape(c, () => { c.moveTo(120, 900); c.quadraticCurveTo(540, 1000, 960, 900); c.quadraticCurveTo(1000, 650, 820, 480); c.quadraticCurveTo(540, 300, 260, 480); c.quadraticCurveTo(80, 650, 120, 900); c.closePath(); }, COL.water, 5);
  c.globalAlpha = 0.6; for (const [x, y] of [[300, 760], [760, 700], [520, 600]]) shape(c, () => ell(c, x, y, 50, 12), COL.drop, 0); c.globalAlpha = 1;
  rowOfFive(c, 700);
  // the mug tipping, water falling behind the row
  shape(c, () => { c.moveTo(560, 870); c.quadraticCurveTo(600, 940, 640, 1000); c.lineTo(760, 1000); c.quadraticCurveTo(700, 930, 650, 870); c.closePath(); }, COL.water, 4);
  mugPouring(c, 760, 860, 0.9, 1.1);
  hand(c, 980, 1000, -2.4, 1.3);
  arrow(c, [[540, 900], [540, 420]]);
};
const e1_2 = (c: Ctx) => {
  bathroomFloor(c);
  // the pool of water left round the drain
  shape(c, () => { c.moveTo(220, 420); c.quadraticCurveTo(300, 150, 560, 160); c.quadraticCurveTo(860, 170, 880, 400); c.quadraticCurveTo(900, 620, 560, 600); c.quadraticCurveTo(240, 620, 220, 420); c.closePath(); }, COL.water, 5);
  grill(c, 540, 380, 150);
  wrapper(c, 470, 350, 1.0, -0.4);
  plasticBit(c, 630, 430, 1.0, 0.6);
  newsScrap(c, 350, 780, 0.9, 0.3);
  peel(c, 640, 830, 0.85);
  pebble(c, 870, 720, 48);
  arrow(c, [[300, 960], [360, 900], [430, 560]]);
};
const e1_3 = (c: Ctx) => {
  bathroomFloor(c);
  // the table fan on the left, blowing right
  shadow(c, 170, 1010, 140, 24);
  shape(c, () => rrect(c, 60, 950, 220, 50, 14), COL.black);
  shape(c, () => rrect(c, 150, 620, 40, 340, 10), COL.steel, 5);
  shape(c, () => ell(c, 170, 400, 230, 230), COL.steel);
  shade(c, () => ell(c, 170, 400, 230, 230), COL.steelDk, -50, -50, 0.4);
  shape(c, () => ell(c, 170, 400, 190, 190), COL.sky, 5);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.4; shape(c, () => ell(c, 170 + Math.cos(a) * 95, 400 + Math.sin(a) * 95, 90, 45, a), COL.blue, 5); }
  shape(c, () => ell(c, 170, 400, 40, 40), COL.steelDk, 5);
  for (let i = 1; i <= 6; i++) { c.beginPath(); c.arc(170, 400, i * 30, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 2; c.globalAlpha = 0.35; c.stroke(); } c.globalAlpha = 1;
  // wind
  for (const [y, len] of [[300, 200], [400, 260], [500, 200]]) line(c, [[430, y], [430 + len, y - 10]], 6, COL.waterDk);
  // things that flew: wrapper and newspaper; the peel and the pebble stayed
  wrapper(c, 760, 230, 1.0, 0.5);
  newsScrap(c, 900, 480, 0.95, -0.6);
  arrow(c, [[480, 640], [760, 420]]);
  peel(c, 560, 820, 0.95);
  pebble(c, 820, 840, 52);
};

// ---------------------------------------------------------------- set-up cards: the Sugar Test
const antLine = (c: Ctx, from: number[], to: number[], n: number, gap = true, stopAt = -1) => {
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n; if (gap && stopAt >= 0 && Math.abs(t - stopAt) < 0.1) continue;
    const x = from[0] + (to[0] - from[0]) * t + Math.sin(i * 2.1) * 10, y = from[1] + (to[1] - from[1]) * t + Math.cos(i * 1.7) * 10;
    const an = Math.atan2(to[1] - from[1], to[0] - from[0]) + (i % 2 ? 0.15 : -0.15);
    ant(c, x, y, stopAt >= 0 && Math.abs(t - stopAt) < 0.25 ? an + (t < stopAt ? 2.2 : -2.2) : an, 1.1);
  }
};
const e2_0 = (c: Ctx) => {
  counter(c, 180, 300);
  sugarPaper(c, 640, 560, 1.3);
};
const e2_1 = (c: Ctx) => {
  counter(c, 180, 300);
  sugarPaper(c, 700, 600, 1.1);
  antLine(c, [180, 420], [600, 580], 6);
  ant(c, 660, 580, 0.3, 1.1); ant(c, 700, 560, -0.7, 1.1); ant(c, 730, 630, 2.5, 1.1);
  write(c, "30", 820, 120, 110, INK, 9);
};
const e2_2 = (c: Ctx) => {
  counter(c, 180, 300);
  sugarPaper(c, 760, 620, 1.0);
  // the wiped strip across the path
  shape(c, () => polyP(c, [[400, 300], [520, 260], [560, 880], [440, 900]]), "#fbf9f4", 4);
  antLine(c, [190, 400], [640, 580], 7, true, 0.55);
  // cloth in the hand, having wiped down the strip
  shape(c, () => { c.moveTo(410, 700); c.quadraticCurveTo(480, 670, 570, 720); c.lineTo(550, 860); c.quadraticCurveTo(480, 900, 400, 850); c.closePath(); }, COL.pink, 6);
  hand(c, 640, 940, -2.2, 1.3);
  arrow(c, [[480, 240], [490, 640]]);
};

// ---------------------------------------------------------------- card pictures: flows
const flowE1 = (c: Ctx) => {
  bathroomFloor(c);
  grill(c, 540, 220, 100);
  shape(c, () => { c.moveTo(380, 840); c.quadraticCurveTo(540, 900, 700, 840); c.quadraticCurveTo(720, 520, 560, 330); c.quadraticCurveTo(380, 520, 380, 840); c.closePath(); }, COL.water, 5);
  wrapper(c, 500, 300, 0.9, -0.5);
  newsScrap(c, 600, 560, 0.8, 0.3);
  pebble(c, 760, 720, 40);
  person(c, 230, 1000, 760, { armR: [-0.2, -0.9], armL: [Math.PI * 0.6, Math.PI * 0.5] });
  mugPouring(c, 470, 640, 1.1, 0.7);
  arrow(c, [[640, 760], [600, 420]]);
};
const flowE2 = (c: Ctx) => {
  counter(c, 160, 420);
  sugarPaper(c, 740, 600, 1.1);
  antLine(c, [170, 520], [640, 580], 6);
  ant(c, 700, 560, 0.3, 1.1); ant(c, 760, 540, -0.9, 1.1);
  // the child's head and hands looking over the counter edge
  shape(c, () => rrect(c, 300, 760, 500, 400, 60), CLOTH.child, 6);
  shape(c, () => ell(c, 550, 760, 170, 180), SKIN.child, 6);
  shape(c, () => { c.moveTo(380, 740); c.bezierCurveTo(390, 500, 710, 500, 720, 740); c.quadraticCurveTo(550, 660, 380, 740); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 490, 790, 16, 22), INK, 0); shape(c, () => ell(c, 610, 790, 16, 22), INK, 0);
  c.beginPath(); c.arc(550, 850, 50, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  hand(c, 220, 1060, -1.3, 1.2, SKIN.child, CLOTH.child, true);
};
const flowA1 = (c: Ctx) => {
  ground(c, "#e3dccf");
  // the staircase landing: wall, steps on the right
  c.fillStyle = "#d3c7b2"; c.fillRect(0, 0, D, 560);
  line(c, [[0, 560], [D, 560]], 6);
  for (let i = 0; i < 4; i++) { shape(c, () => polyP(c, [[760 + i * 80, 560 - i * 110], [D, 560 - i * 110], [D, 560 - (i + 1) * 110], [840 + i * 80, 560 - (i + 1) * 110]]), i % 2 ? "#cdbfa6" : "#dccfb8", 5); }
  // leaves and dust in the corner, a chips packet
  const r = rnd(3);
  for (let i = 0; i < 9; i++) leaf(c, 120 + r() * 300, 620 + r() * 200, 50, r() * 6, i % 3 ? COL.brown : COL.orange);
  chipsPacket(c, 230, 760, 0.8, 0.9);
  // the child sweeping; broom to the leaves; a dustpan and the blue bin
  person(c, 640, 1020, 700, { armL: [Math.PI * 0.75, Math.PI * 0.6], armR: [Math.PI * 0.7, Math.PI * 0.55] });
  line(c, [[560, 660], [400, 940]], 14, COL.wood);
  shape(c, () => polyP(c, [[400, 930], [330, 1010], [470, 1010]]), COL.yellow, 5);
  for (let i = 0; i < 6; i++) line(c, [[405 + i * 10, 950], [345 + i * 22, 1008]], 3, COL.woodDk);
  shape(c, () => polyP(c, [[120, 920], [330, 920], [340, 1000], [110, 1000]]), COL.teal, 6);
  bin(c, 940, 1010, 200, 280, COL.blue, COL.blueDk, true);
  arrow(c, [[500, 820], [300, 880]]);
};
const flowA3 = (c: Ctx) => {
  bathroomFloor(c);
  // the postcard on the floor, the beetle on it, the clear cup over it, a hand holding the cup
  shadow(c, 560, 740, 330, 50);
  shape(c, () => polyP(c, [[240, 560], [860, 540], [900, 760], [220, 780]]), COL.paper, 6);
  line(c, [[560, 580], [560, 760]], 4, COL.grey); for (let i = 0; i < 3; i++) line(c, [[620, 640 + i * 40], [840, 636 + i * 40]], 4, COL.grey);
  beetle(c, 500, 660, -0.4, 1.4);
  shape(c, () => { c.moveTo(300, 300); c.lineTo(720, 300); c.lineTo(760, 690); c.lineTo(260, 690); c.closePath(); }, COL.glass, 6);
  shape(c, () => ell(c, 510, 690, 250, 40), "rgba(214,236,250,0.5)", 6);
  shape(c, () => ell(c, 510, 300, 210, 34), "rgba(255,255,255,0.4)", 6);
  shine(c, [[350, 360], [320, 620]], 8);
  hand(c, 640, 230, 2.4, 1.5);
  tulsiPot(c, 920, 1030, 170);
  arrow(c, [[780, 560], [900, 760]]);
};
const flowA4 = (c: Ctx) => {
  ground(c, "#f1e6d2");
  // a vegetable cart behind: wooden board with tomatoes and beans
  shape(c, () => polyP(c, [[560, 420], [1080, 420], [1080, 560], [540, 560]]), COL.wood, 6);
  shape(c, () => rrect(c, 600, 560, 40, 300, 8), COL.woodDk, 5); shape(c, () => rrect(c, 980, 560, 40, 300, 8), COL.woodDk, 5);
  const r = rnd(9);
  for (let i = 0; i < 9; i++) { const x = 620 + (i % 5) * 90 + (i > 4 ? 45 : 0), y = 400 - Math.floor(i / 5) * 50; shape(c, () => ell(c, x, y, 42, 40), COL.red, 5); shape(c, () => ell(c, x - 4, y - 36, 12, 8), COL.leafDk, 3); }
  for (let i = 0; i < 7; i++) line(c, [[620 + i * 60, 300], [660 + i * 60, 260 - r() * 20]], 12, COL.green);
  // the child holding a cloth bag with tomatoes and beans on top
  person(c, 300, 1020, 820, { armL: [Math.PI * 0.6, Math.PI * 0.35], armR: [Math.PI * 0.4, Math.PI * 0.65] });
  shadow(c, 420, 1000, 150, 24);
  shape(c, () => { c.moveTo(300, 620); c.quadraticCurveTo(360, 560, 420, 620); c.lineTo(400, 650); c.quadraticCurveTo(360, 600, 320, 650); c.closePath(); }, COL.cloth, 6);
  shape(c, () => rrect(c, 250, 640, 300, 340, 24), COL.cloth); shade(c, () => rrect(c, 250, 640, 300, 340, 24), "#d9d2c3", 60, 0, 0.6);
  for (const [x, y] of [[320, 650], [410, 640], [490, 655]]) { shape(c, () => ell(c, x, y, 40, 38), COL.red, 5); shape(c, () => ell(c, x - 4, y - 34, 11, 7), COL.leafDk, 3); }
  for (let i = 0; i < 4; i++) line(c, [[340 + i * 40, 630], [380 + i * 40, 540 - i * 10]], 11, COL.green);
  shape(c, () => rrect(c, 250, 640, 300, 340, 24), "rgba(0,0,0,0)", 6);
  arrow(c, [[720, 560], [560, 640]]);
};
const flowP1 = (c: Ctx) => {
  ground(c, BG);
  // the pocket bin: an old envelope with a crow drawn on it, a wrapper going in
  shadow(c, 560, 900, 330, 50);
  shape(c, () => rrect(c, 230, 380, 640, 480, 20), COL.paper);
  shade(c, () => rrect(c, 230, 380, 640, 480, 20), "#e8dfc9", 40, 0, 0.5);
  shape(c, () => rrect(c, 230, 380, 640, 480, 20), "rgba(0,0,0,0)", 6);
  line(c, [[230, 380], [550, 600], [870, 380]], 6);
  shape(c, () => polyP(c, [[230, 380], [870, 380], [550, 180]]), COL.paper, 6);
  crowSketch(c, 560, 740, 1.3);
  shape(c, () => ell(c, 560, 740, 150, 90), "rgba(0,0,0,0)", 4);
  wrapper(c, 560, 280, 0.9, 0.2);
  hand(c, 930, 170, 2.6, 1.4);
  arrow(c, [[560, 60], [560, 200]]);
};

// ---------------------------------------------------------------- card pictures: terms and an explanation
const steps = (c: Ctx, x0: number, y0: number, w: number, n: number) => {
  for (let i = 0; i < n; i++) shape(c, () => polyP(c, [[x0, y0 - i * 90], [x0 + w, y0 - i * 90], [x0 + w, y0 - (i + 1) * 90], [x0 + 40, y0 - (i + 1) * 90]]), i % 2 ? "#cdbfa6" : "#dccfb8", 5);
};
const termLitter = (c: Ctx) => {
  ground(c, "#e3dccf");
  line(c, [[540, 60], [540, 1020]], 8, COL.greyDk);
  // left: the packet lying on the steps
  steps(c, 40, 900, 460, 4);
  chipsPacket(c, 270, 640, 0.9, 1.3);
  line(c, [[120, 160], [220, 240]], 12, RED); line(c, [[220, 160], [120, 240]], 12, RED);
  // right: the same packet inside the open bin
  bin(c, 810, 960, 300, 440, COL.blue, COL.blueDk, true);
  chipsPacket(c, 810, 560, 0.75, 0.4);
  line(c, [[860, 170], [910, 230], [1000, 120]], 14, COL.greenDk);
};
const termDrain = (c: Ctx) => {
  ground(c, TILE);
  // left: a bathroom floor drain
  c.save(); c.beginPath(); c.rect(0, 0, 540, D); c.clip(); bathroomFloor(c); c.restore();
  grill(c, 270, 540, 190);
  line(c, [[540, 60], [540, 1020]], 8, COL.greyDk);
  // right: a street drain, a channel with water running in from the road
  c.fillStyle = COL.greyDk; c.fillRect(540, 0, 540, D);
  shape(c, () => polyP(c, [[540, 0], [600, 0], [600, D], [540, D]]), COL.grey, 5);
  shape(c, () => { c.moveTo(640, 0); c.lineTo(1000, 0); c.quadraticCurveTo(1010, 300, 940, 560); c.lineTo(700, 560); c.quadraticCurveTo(630, 300, 640, 0); c.closePath(); }, COL.water, 5);
  shine(c, [[760, 120], [740, 360]], 8);
  shape(c, () => rrect(c, 640, 540, 360, 380, 20), COL.steel, 6);
  shape(c, () => rrect(c, 670, 570, 300, 320, 12), COL.black, 5);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, 700 + i * 72, 560, 30, 340, 8), COL.steel, 4);
  arrow(c, [[820, 300], [820, 640]]);
};
const termBins = (c: Ctx) => {
  ground(c, BG);
  bin(c, 290, 960, 330, 480, COL.green, COL.greenDk, true);
  bin(c, 790, 960, 330, 480, COL.blue, COL.blueDk, true);
  // over the green bin: a banana peel and a heap of tea leaves
  peel(c, 230, 400, 1.1);
  shape(c, () => ell(c, 390, 420, 90, 50), COL.soilDk, 5);
  const r = rnd(2); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 320 + r() * 140, 395 + r() * 50, 10, 6, r() * 3), COL.brown, 2);
  // over the blue bin: a milk packet and a newspaper
  milkPacket(c, 720, 400, 1.0, -0.3);
  newsScrap(c, 880, 420, 1.3, 0.2);
  arrow(c, [[300, 500], [300, 620]]); arrow(c, [[800, 520], [800, 620]]);
};
const explPath = (c: Ctx) => {
  ground(c, "#d9e5c8");
  // the road across the top, the gutter beside it, a drain at the corner, the river below
  shape(c, () => polyP(c, [[0, 160], [1080, 160], [1080, 420], [0, 420]]), COL.greyDk, 0);
  shape(c, () => polyP(c, [[0, 420], [1080, 420], [1080, 500], [0, 500]]), COL.water, 5);
  shape(c, () => rrect(c, 820, 420, 200, 80, 10), COL.black, 6);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, 840 + i * 46, 430, 26, 60, 5), COL.steel, 3);
  shape(c, () => { c.moveTo(0, 760); c.quadraticCurveTo(300, 700, 540, 800); c.quadraticCurveTo(800, 900, 1080, 760); c.lineTo(1080, 1080); c.lineTo(0, 1080); c.closePath(); }, COL.waterDk, 6);
  shape(c, () => { c.moveTo(0, 800); c.quadraticCurveTo(300, 740, 540, 840); c.quadraticCurveTo(800, 940, 1080, 800); }, COL.water, 0);
  line(c, [[0, 800], [300, 740], [540, 840]], 0); shine(c, [[100, 860], [300, 820]], 8); shine(c, [[700, 960], [900, 920]], 8);
  fish(c, 300, 980, 1.2); fish(c, 800, 1000, 1.0);
  // the hand up on the pavement letting the wrapper go; the dotted path
  hand(c, 60, 60, 0.5, 1.4);
  wrapper(c, 240, 150, 0.6, -0.5);
  c.setLineDash([18, 22]); line(c, [[300, 180], [420, 400], [600, 460], [880, 460], [920, 620], [700, 820], [540, 920]], 7, RED); c.setLineDash([]);
  wrapper(c, 600, 460, 0.6, 0.2);
  wrapper(c, 920, 460, 0.6, -0.1);
  wrapper(c, 560, 900, 0.6, 0.5);
  arrow(c, [[520, 920], [440, 960]]);
};

export const ic_environmentCaringL1 = cards("sci.environment.caring.L1", [
  e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2,
  flowE1, flowE2, flowA1, flowA3, flowA4, flowP1, termLitter, termDrain, termBins, explPath,
]);
