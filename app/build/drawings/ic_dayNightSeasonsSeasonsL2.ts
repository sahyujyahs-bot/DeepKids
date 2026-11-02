import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, plate, hand, person, write, cards } from "./flatKit";

// SEASONS L2 · set-up cards for the Black or White ice test and the Damp Box papad test, then card
// pictures: the experiments, the activities, the family calendar, temperature, absorb and reflect.
// Same flat look as flatKit: bold ink outline, flat colours, light from the upper left.

const BLACK = COL.black, BLACKDK = "#262129", ICE = "#dff3ff", ICEDK = "#a9d4ee", PAPAD = "#e9c47c", PAPADDK = "#c99a4e", SPOT = "#8a5a2b";

// the sun in a corner, rays out
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.75, y + Math.sin(a) * r * 1.75]], 8, COL.yellow); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow);
  shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.3, r * 0.2, 0.5);
};
// a yellow light ray with an arrow head
const ray = (c: Ctx, pts: number[][]) => arrow(c, pts, COL.yellow, 9);
// wavy heat lines rising from (x, y)
const heat = (c: Ctx, x: number, y: number, n = 3, h = 110) => {
  for (let i = 0; i < n; i++) { const bx = x + (i - (n - 1) / 2) * 46; c.beginPath(); c.moveTo(bx, y); c.bezierCurveTo(bx - 22, y - h * 0.33, bx + 22, y - h * 0.66, bx, y - h); c.strokeStyle = COL.red; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
};
// an ice cube, bottom centre (x, y), side s
const ice = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => rrect(c, x - s / 2, y - s, s, s, s * 0.18);
  shape(c, p, ICE); shade(c, p, ICEDK, -s * 0.3, -s * 0.3, 0.6);
  shine(c, [[x - s * 0.28, y - s * 0.78], [x - s * 0.28, y - s * 0.45]], 6);
};
// meltwater on a plate
const puddle = (c: Ctx, x: number, y: number, rx: number, ry: number) => { shape(c, () => ell(c, x, y, rx, ry), COL.water, 4); shape(c, () => ell(c, x - rx * 0.3, y - ry * 0.2, rx * 0.25, ry * 0.2), COL.drop, 0); };
// a hanky-sized cloth lying flat over something, centre (x, y)
const cloth = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string, dk: string, seed = 3) => {
  const r = rnd(seed), pts: number[][] = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, k = 1 + (r() - 0.5) * 0.12; pts.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
  const p = () => { c.moveTo((pts[13][0] + pts[0][0]) / 2, (pts[13][1] + pts[0][1]) / 2); for (let i = 0; i < 14; i++) { const n = pts[(i + 1) % 14]; c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + n[0]) / 2, (pts[i][1] + n[1]) / 2); } c.closePath(); };
  shadow(c, x + 12, y + ry * 0.35, rx, ry * 0.9);
  shape(c, p, col); shade(c, p, dk, -rx * 0.25, -ry * 0.3, 0.45);
  // the bump where the ice is, and two folds
  shape(c, () => ell(c, x - rx * 0.1, y - ry * 0.15, rx * 0.3, ry * 0.3), col, 3);
  line(c, [[x - rx * 0.7, y + ry * 0.4], [x - rx * 0.3, y + ry * 0.1]], 3, dk); line(c, [[x + rx * 0.35, y + ry * 0.5], [x + rx * 0.6, y - ry * 0.1]], 3, dk);
};
// a folded cloth set aside, centre (x, y)
const clothFolded = (c: Ctx, x: number, y: number, w: number, col: string, dk: string) => {
  shadow(c, x + 10, y + 38, w * 0.6, 14);
  shape(c, () => rrect(c, x - w / 2, y - 30, w, 60, 14), col); shade(c, () => rrect(c, x - w / 2, y - 30, w, 60, 14), dk, 0, -22, 0.4);
  line(c, [[x - w / 2 + 12, y], [x + w / 2 - 12, y]], 3, dk);
};
// the two plates on a sill, each with an ice cube; covered = both under cloths
const sill = (c: Ctx) => { c.fillStyle = COL.sky; c.fillRect(0, 0, D, 560); shape(c, () => polyP(c, [[0, 560], [D, 560], [D, D], [0, D]]), BG, 0); line(c, [[0, 560], [D, 560]], 6); shape(c, () => polyP(c, [[0, 540], [D, 540], [D, 580], [0, 580]]), COL.wood, 5); };
const twoPlates = (c: Ctx) => { plate(c, 300, 760, 230, 95); plate(c, 790, 760, 230, 95); };

// ------------------------------------------------------------ set-up cards: Black or White (e1)
const e1s0 = (c: Ctx) => {
  ground(c); sill(c); sun(c, 160, 170, 80);
  twoPlates(c); ice(c, 300, 760, 120); ice(c, 790, 760, 120);
};
const e1s1 = (c: Ctx) => {
  ground(c); sill(c); sun(c, 160, 170, 80);
  ray(c, [[280, 260], [340, 560]]); ray(c, [[600, 240], [690, 560]]); ray(c, [[900, 300], [860, 560]]);
  twoPlates(c);
  cloth(c, 300, 720, 250, 130, BLACK, BLACKDK, 5); cloth(c, 790, 720, 250, 130, WHITE, "#d9d4c8", 8);
};
const e1s2 = (c: Ctx) => {
  ground(c); sill(c); sun(c, 160, 170, 80);
  twoPlates(c);
  cloth(c, 300, 720, 250, 130, BLACK, BLACKDK, 5); cloth(c, 790, 720, 250, 130, WHITE, "#d9d4c8", 8);
  heat(c, 300, 600, 3, 90);
  hand(c, 110, 700, -0.25, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[460, 420], [700, 420]]);
  write(c, "10", 480, 240, 110, INK, 10);
};
const e1s3 = (c: Ctx) => {
  ground(c); sill(c); sun(c, 160, 170, 80);
  clothFolded(c, 300, 480, 300, BLACK, BLACKDK); clothFolded(c, 790, 480, 300, WHITE, "#d9d4c8");
  twoPlates(c);
  puddle(c, 300, 760, 170, 62); ice(c, 300, 752, 48);
  puddle(c, 790, 770, 70, 26); ice(c, 790, 760, 110);
  arrow(c, [[300, 540], [300, 640]]); arrow(c, [[790, 540], [790, 640]]);
};

// ------------------------------------------------------------ set-up cards: the Damp Box (e2)
const papadHalf = (c: Ctx, x: number, y: number, r: number, rot: number, seed = 1) => {
  const p = () => { c.arc(x, y, r, rot, rot + Math.PI); c.closePath(); };
  shape(c, p, PAPAD); shade(c, p, PAPADDK, r * 0.2, r * 0.2, 0.4);
  const rd = rnd(seed);
  for (let i = 0; i < 16; i++) { const a = rot + rd() * Math.PI, d = rd() * r * 0.85; const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; shape(c, () => ell(c, px, py, 7 + rd() * 6, 6 + rd() * 5), rd() < 0.5 ? SPOT : PAPADDK, 2); }
};
// a bent (soft) papad half seen from the side: a curved strip
const papadBent = (c: Ctx, x: number, y: number, w: number) => {
  const p = () => { c.moveTo(x - w / 2, y + 40); c.quadraticCurveTo(x, y - 90, x + w / 2, y + 40); c.quadraticCurveTo(x, y - 40, x - w / 2, y + 40); c.closePath(); };
  shape(c, p, PAPAD); for (let i = 0; i < 7; i++) { const t = (i + 0.5) / 7; const px = x - w / 2 + t * w, py = y + 40 - Math.sin(t * Math.PI) * 60; shape(c, () => ell(c, px, py, 7, 5), SPOT, 2); }
};
const papadWhole = (c: Ctx, x: number, y: number, r: number) => { papadHalf(c, x, y, r, Math.PI, 2); papadHalf(c, x, y, r, 0, 3); };
const saucer = (c: Ctx, x: number, y: number, rx: number) => plate(c, x, y, rx, rx * 0.4);
// a steel dabba standing open: rim centre (x, y), width w, height h; the lid lies beside it
const dabba = (c: Ctx, x: number, y: number, w: number, h: number, lidX: number) => {
  shadow(c, x + 20, y + h + 10, w * 0.6, w * 0.14);
  shape(c, () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y + h); c.ellipse(x, y + h, w / 2, w * 0.2, 0, Math.PI, 0, true); c.lineTo(x + w / 2, y); c.closePath(); }, COL.steel);
  shade(c, () => { c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y + h); c.ellipse(x, y + h, w / 2, w * 0.2, 0, Math.PI, 0, true); c.lineTo(x + w / 2, y); c.closePath(); }, COL.steelDk, -w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y, w / 2, w * 0.2), COL.steelDk, 6);
  shape(c, () => ell(c, x, y + 10, w * 0.42, w * 0.15), COL.steelIn, 3);
  shine(c, [[x - w * 0.38, y + 30], [x - w * 0.38, y + h - 30]], 7);
  shadow(c, lidX + 10, y + h + 14, w * 0.5, w * 0.16); shape(c, () => ell(c, lidX, y + h, w / 2, w * 0.2), COL.steel); shape(c, () => ell(c, lidX, y + h - 4, w * 0.4, w * 0.15), COL.steelIn, 4);
};
const steam = (c: Ctx, x: number, y: number) => { c.globalAlpha = 0.8; for (let i = -1; i <= 1; i++) { const bx = x + i * 30; c.beginPath(); c.moveTo(bx, y); c.bezierCurveTo(bx - 16, y - 30, bx + 16, y - 60, bx, y - 90); c.strokeStyle = WHITE; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.grey; c.lineWidth = 3; c.stroke(); } c.globalAlpha = 1; };
// a steel cup of hot water, bottom centre (x, y)
const cup = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 8, y + 4, w * 0.6, w * 0.12);
  const p = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.42, y); c.lineTo(x - w * 0.42, y); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, -w * 0.3, 0, 0.5);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.14), COL.water, 5);
  steam(c, x, y - h - 20);
};
const e2s0 = (c: Ctx) => {
  ground(c); plate(c, 540, 780, 330, 130);
  papadHalf(c, 450, 560, 200, Math.PI * 0.5 + 0.3, 4); papadHalf(c, 640, 560, 200, Math.PI * 1.5 + 0.3, 5);
  arrow(c, [[400, 360], [250, 300]]); arrow(c, [[690, 360], [840, 300]]);
  hand(c, 160, 640, -0.9, 1.2); hand(c, 930, 640, Math.PI + 0.9, 1.2);
};
const e2s1 = (c: Ctx) => {
  ground(c);
  dabba(c, 290, 460, 360, 320, 130); dabba(c, 790, 460, 360, 320, 950);
  saucer(c, 340, 430, 110); papadHalf(c, 340, 410, 90, Math.PI, 6);
  cup(c, 200, 430, 110, 150);
  saucer(c, 790, 430, 110); papadHalf(c, 790, 410, 90, Math.PI, 7);
  arrow(c, [[130, 980], [130, 800]]); arrow(c, [[950, 980], [950, 800]]);
};
const e2s2 = (c: Ctx) => {
  ground(c);
  // left: the dry-box half snaps into two sharp pieces; right: the damp-box half only bends
  saucer(c, 290, 720, 220); saucer(c, 790, 720, 220);
  papadHalf(c, 230, 690, 120, Math.PI * 0.55, 8); papadHalf(c, 370, 710, 110, Math.PI * 1.4, 9);
  line(c, [[300, 560], [330, 600], [300, 640], [335, 680]], 7, INK);
  papadBent(c, 790, 680, 340);
  hand(c, 180, 420, Math.PI * 0.5, 1.2); hand(c, 420, 420, Math.PI * 0.5, 1.2);
  arrow(c, [[160, 560], [120, 640]]); arrow(c, [[440, 560], [480, 640]]);
  hand(c, 640, 420, Math.PI * 0.5, 1.2); hand(c, 940, 420, Math.PI * 0.5, 1.2);
  arrow(c, [[660, 560], [700, 630]]); arrow(c, [[920, 560], [880, 630]]);
};

// ------------------------------------------------------------ card pictures
// flow.e1: the whole test at a glance, a child watching the two covered plates in the sun
const fe1 = (c: Ctx) => {
  ground(c); sill(c); sun(c, 160, 170, 80);
  ray(c, [[280, 260], [360, 560]]); ray(c, [[560, 230], [640, 560]]);
  twoPlates(c);
  cloth(c, 300, 720, 250, 130, BLACK, BLACKDK, 5); cloth(c, 790, 720, 250, 130, WHITE, "#d9d4c8", 8);
  heat(c, 300, 600, 3, 90);
  person(c, 940, 1000, 560, { armL: [Math.PI * 0.85, Math.PI * 1.1] });
};
// flow.e2: the damp box opened: drops under the lid, the papad bent soft, the cup of hot water
const fe2 = (c: Ctx) => {
  ground(c);
  dabba(c, 480, 540, 460, 360, 900);
  // the lid leaning up at the back with water drops inside
  shape(c, () => ell(c, 480, 300, 230, 150), COL.steel); shape(c, () => ell(c, 480, 300, 200, 125), COL.steelIn, 4);
  const r = rnd(21); for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, d = r() * 160; const x = 480 + Math.cos(a) * d, y = 300 + Math.sin(a) * d * 0.7; shape(c, () => ell(c, x, y, 12, 9), COL.water, 3); }
  cup(c, 330, 520, 120, 150);
  saucer(c, 620, 530, 120); papadBent(c, 620, 500, 220);
};
// a phone held upright, centre (x, y)
const phone = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 28), BLACK); shape(c, () => rrect(c, x - w / 2 + 14, y - h / 2 + 30, w - 28, h - 60, 12), WHITE, 3); };
// three little season photos: sunny beach, rainy street, a family in sweaters
const photoSun = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 8), COL.sky, 4); shape(c, () => polyP(c, [[x + 4, y + h * 0.65], [x + w - 4, y + h * 0.65], [x + w - 4, y + h - 4], [x + 4, y + h - 4]]), COL.wood, 0); shape(c, () => ell(c, x + w * 0.7, y + h * 0.3, w * 0.13, w * 0.13), COL.yellow, 3); };
const photoRain = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 8), COL.grey, 4); for (let i = 0; i < 6; i++) line(c, [[x + 14 + i * (w - 28) / 5, y + 14], [x + 8 + i * (w - 28) / 5, y + 40]], 4, COL.blue); shape(c, () => { c.arc(x + w / 2, y + h * 0.62, w * 0.3, Math.PI, 0); c.closePath(); }, COL.red, 4); line(c, [[x + w / 2, y + h * 0.62], [x + w / 2, y + h - 10]], 4); };
const photoCold = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x, y, w, h, 8), "#dfe8f0", 4); for (const [px, s] of [[x + w * 0.35, 1.1], [x + w * 0.68, 0.8]]) { shape(c, () => rrect(c, px - 22 * s, y + h * 0.45, 44 * s, h * 0.5, 10), COL.purple, 4); shape(c, () => ell(c, px, y + h * 0.35, 16 * s, 17 * s), SKIN.child, 4); } };
// flow.a1: a mother and a girl looking at three photos on a phone
const fa1 = (c: Ctx) => {
  ground(c);
  person(c, 330, 1040, 820, { adult: true, armR: [Math.PI * 0.2, Math.PI * 0.75] });
  person(c, 760, 1040, 560, { armL: [Math.PI * 0.85, Math.PI * 1.2] });
  phone(c, 560, 520, 300, 520);
  photoSun(c, 440, 300, 240, 130); photoRain(c, 440, 450, 240, 130); photoCold(c, 440, 600, 240, 130);
};
// a window frame, outer (x, y, w, h), with a scene drawn by the caller after it
const windowFrame = (c: Ctx, x: number, y: number, w: number, h: number, skyCol: string) => { shape(c, () => rrect(c, x, y, w, h, 10), skyCol); line(c, [[x + w / 2, y], [x + w / 2, y + h]], 6); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 6); };
// flow.a3: a paper folded in three, the same window in summer, monsoon and winter
const fa3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 480, 20); shape(c, () => rrect(c, 60, 140, 960, 800, 10), COL.paper);
  line(c, [[380, 140], [380, 940]], 4, COL.grey); line(c, [[700, 140], [700, 940]], 4, COL.grey);
  const views = [[80, COL.sky], [400, COL.grey], [720, "#e1e6ea"]] as [number, string][];
  views.forEach(([x, col]) => { windowFrame(c, x, 200, 280, 300, col); shape(c, () => polyP(c, [[x + 4, 440], [x + 276, 440], [x + 276, 496], [x + 4, 496]]), COL.greyDk, 0); });
  // summer: sun, a tree with red flowers
  shape(c, () => ell(c, 300, 260, 40, 40), COL.yellow, 4); line(c, [[200, 440], [200, 360]], 10, COL.brown); shape(c, () => ell(c, 200, 330, 60, 50), COL.red, 4);
  // monsoon: rain, puddle, umbrella
  for (let i = 0; i < 8; i++) line(c, [[430 + i * 32, 220], [422 + i * 32, 260]], 5, COL.blue); line(c, [[520, 440], [520, 360]], 10, COL.brown); shape(c, () => ell(c, 520, 330, 60, 50), COL.green, 4); shape(c, () => { c.arc(610, 420, 40, Math.PI, 0); c.closePath(); }, COL.yellow, 4); line(c, [[610, 420], [610, 470]], 4);
  // winter: mist bands, bare tree, a shawl on a line
  line(c, [[840, 440], [840, 360]], 10, COL.brown); line(c, [[840, 380], [800, 330]], 7, COL.brown); line(c, [[840, 370], [880, 320]], 7, COL.brown);
  c.globalAlpha = 0.7; shape(c, () => rrect(c, 730, 380, 260, 36, 18), WHITE, 0); shape(c, () => rrect(c, 740, 300, 240, 30, 15), WHITE, 0); c.globalAlpha = 1;
  // three crayons below
  [[180, COL.orange], [540, COL.blue], [860, COL.greenDk]].forEach(([x, col]) => { shape(c, () => rrect(c, (x as number) - 90, 600, 180, 46, 12), col as string); shape(c, () => polyP(c, [[(x as number) + 90, 603], [(x as number) + 130, 623], [(x as number) + 90, 643]]), COL.wood, 5); });
  hand(c, 620, 840, -0.6, 1.4);
};
// flow.a4: a boy by an open window, eyes shut, a hand cupped to his ear, a koel calling outside
const fa4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 420, 100, 560, 620, 12), COL.sky); line(c, [[700, 100], [700, 720]], 8); line(c, [[420, 410], [980, 410]], 8);
  shape(c, () => rrect(c, 420, 100, 560, 620, 12), "rgba(0,0,0,0)", 10);
  // a branch and a glossy black koel, beak open, sound lines
  line(c, [[980, 560], [760, 500]], 14, COL.brown);
  shape(c, () => ell(c, 800, 440, 70, 44, -0.2), BLACK); shape(c, () => ell(c, 860, 405, 30, 28), BLACK); line(c, [[880, 420], [920, 500]], 12, BLACK);
  shape(c, () => polyP(c, [[885, 395], [925, 385], [888, 410]]), COL.orange, 3); shape(c, () => ell(c, 862, 398, 7, 7), COL.red, 2);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(930, 370, 40 + i * 30, -0.9, 0.3); c.strokeStyle = COL.purple; c.lineWidth = 6; c.stroke(); }
  // the child, sitting, eyes shut (drawn over the open eyes), hand cupped to the ear
  person(c, 240, 1000, 620, { sit: true, armR: [-Math.PI * 0.3, -Math.PI * 0.75] });
  const hy = 1000 - 620 * 0.06 - 620 * 0.32 - 620 * 0.13 * 1.05;
  shape(c, () => ell(c, 240 - 28, hy + 10, 14, 16), SKIN.child, 0); shape(c, () => ell(c, 240 + 28, hy + 10, 14, 16), SKIN.child, 0);
  c.beginPath(); c.arc(240 - 28, hy + 6, 12, 0.2, Math.PI - 0.2); c.arc(240 + 28, hy + 6, 12, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  c.beginPath(); c.arc(240 - 28, hy + 6, 12, 0.2, Math.PI - 0.2); c.stroke(); c.beginPath(); c.arc(240 + 28, hy + 6, 12, 0.2, Math.PI - 0.2); c.stroke();
  hand(c, 330, hy + 40, -Math.PI * 0.5, 1.1, SKIN.child, CLOTH.child, true);
};
// a clock face showing an hour
const clock = (c: Ctx, x: number, y: number, r: number, hour: number) => {
  shadow(c, x + 10, y + r + 8, r * 0.8, r * 0.15);
  shape(c, () => ell(c, x, y, r, r), WHITE);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], i % 3 ? 4 : 7); }
  write(c, "12", x - r * 0.25, y - r * 0.78, r * 0.3, INK, 4); write(c, "3", x + r * 0.5, y - r * 0.15, r * 0.3, INK, 4); write(c, "6", x - r * 0.12, y + r * 0.45, r * 0.3, INK, 4); write(c, "9", x - r * 0.74, y - r * 0.15, r * 0.3, INK, 4);
  const ha = (hour / 12) * Math.PI * 2 - Math.PI / 2; line(c, [[x, y], [x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5]], 9); line(c, [[x, y], [x, y - r * 0.72]], 6);
  shape(c, () => ell(c, x, y, 9, 9), INK, 0);
};
// flow.a5: a papad piece on a plate at 9, bent at 11
const fa5 = (c: Ctx) => {
  ground(c);
  clock(c, 230, 260, 130, 9); clock(c, 850, 260, 130, 11);
  arrow(c, [[400, 260], [680, 260]]);
  plate(c, 230, 760, 190, 76); papadHalf(c, 230, 760, 120, Math.PI + 0.3, 11);
  plate(c, 850, 790, 190, 76); papadBent(c, 850, 740, 320);
  hand(c, 720, 520, Math.PI * 0.5, 1.1); hand(c, 980, 520, Math.PI * 0.5, 1.1);
  arrow(c, [[730, 650], [760, 700]]); arrow(c, [[970, 650], [940, 700]]);
};
// flow.p1: the family season calendar: 12 boxes in three seasons, one drawing in some
const fp1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 470, 20); shape(c, () => rrect(c, 70, 120, 940, 840, 12), COL.paper);
  const seasonCol = (m: number) => (m >= 3 && m <= 5 ? COL.orange : m >= 6 && m <= 11 ? COL.blue : COL.green);
  for (let m = 1; m <= 12; m++) {
    const col = (m - 1) % 4, row = Math.floor((m - 1) / 4), x = 110 + col * 220, y = 160 + row * 265;
    shape(c, () => rrect(c, x, y, 200, 240, 10), seasonCol(m), 5);
    write(c, String(m), x + 14, y + 12, 44, INK, 5);
  }
  // January: a kite; May: a mango; July: an umbrella; October: a lamp
  shape(c, () => polyP(c, [[210, 240], [270, 300], [210, 370], [150, 300]]), COL.red, 5); line(c, [[210, 240], [210, 370]], 3); line(c, [[150, 300], [270, 300]], 3); line(c, [[210, 370], [190, 395]], 3);
  shape(c, () => { c.moveTo(220, 470); c.bezierCurveTo(160, 460, 130, 560, 200, 610); c.bezierCurveTo(280, 650, 320, 560, 250, 490); c.closePath(); }, COL.yellow, 5); line(c, [[220, 470], [230, 445]], 6, COL.greenDk);
  shape(c, () => { c.arc(650, 560, 70, Math.PI, 0); c.closePath(); }, COL.purple, 5); line(c, [[650, 560], [650, 640]], 6); c.beginPath(); c.arc(630, 640, 20, 0, Math.PI); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shape(c, () => { c.moveTo(340, 880); c.lineTo(420, 880); c.quadraticCurveTo(380, 830, 340, 880); c.closePath(); }, COL.orange, 5); shape(c, () => ell(c, 380, 820, 16, 26), COL.yellow, 4);
};
// term.4 Temperature: a steaming cup of tea beside an ice cube on a plate
const t4 = (c: Ctx) => {
  ground(c);
  shadow(c, 330, 800, 180, 36);
  const p = () => { c.moveTo(180, 480); c.lineTo(460, 480); c.lineTo(430, 790); c.lineTo(210, 790); c.closePath(); };
  shape(c, p, WHITE); shade(c, p, "#d9d4c8", -60, 0, 0.5);
  shape(c, () => { c.moveTo(455, 540); c.bezierCurveTo(580, 520, 580, 700, 445, 700); c.lineTo(445, 660); c.bezierCurveTo(530, 660, 530, 570, 450, 580); c.closePath(); }, WHITE);
  shape(c, () => ell(c, 320, 480, 140, 32), COL.brown, 5);
  steam(c, 320, 440); heat(c, 320, 400, 2, 80);
  plate(c, 780, 800, 210, 84); ice(c, 780, 790, 170);
  for (let i = 0; i < 4; i++) { const a = -0.3 - i * 0.5; line(c, [[780 + Math.cos(a) * 130, 600 + Math.sin(a) * 130], [780 + Math.cos(a) * 170, 600 + Math.sin(a) * 170]], 6, COL.blue); }
};
// term.6 Absorb: sun rays going into a black T-shirt, heat rising
const tshirt = (c: Ctx, x: number, y: number, w: number, col: string, dk: string) => {
  const p = () => polyP(c, [[x - w * 0.5, y], [x - w * 0.25, y - w * 0.1], [x - w * 0.1, y], [x + w * 0.1, y], [x + w * 0.25, y - w * 0.1], [x + w * 0.5, y], [x + w * 0.62, y + w * 0.3], [x + w * 0.4, y + w * 0.4], [x + w * 0.35, y + w * 1.1], [x - w * 0.35, y + w * 1.1], [x - w * 0.4, y + w * 0.4], [x - w * 0.62, y + w * 0.3]]);
  shadow(c, x + 20, y + w * 1.14, w * 0.4, 18);
  shape(c, p, col); shade(c, p, dk, -w * 0.18, 0, 0.45);
};
const t6 = (c: Ctx) => {
  ground(c); sun(c, 170, 170, 85);
  tshirt(c, 560, 420, 380, BLACK, BLACKDK);
  ray(c, [[300, 240], [470, 480]]); ray(c, [[380, 180], [560, 500]]); ray(c, [[470, 160], [650, 520]]);
  heat(c, 560, 380, 3, 130);
};
// expl.4 Why a black cloth gets hotter: rays go into the black cloth and bounce off the white one
const x4 = (c: Ctx) => {
  ground(c); sill(c); sun(c, 540, 150, 85);
  twoPlates(c);
  cloth(c, 300, 720, 250, 130, BLACK, BLACKDK, 5); cloth(c, 790, 720, 250, 130, WHITE, "#d9d4c8", 8);
  ray(c, [[440, 250], [300, 630]]); ray(c, [[480, 300], [360, 640]]);
  line(c, [[640, 250], [790, 630]], 9, COL.yellow); ray(c, [[790, 630], [960, 260]]);
  line(c, [[600, 300], [720, 640]], 9, COL.yellow); ray(c, [[720, 640], [880, 330]]);
  heat(c, 300, 590, 3, 110);
};

export const ic_dayNightSeasonsSeasonsL2 = cards("sci.day-night-seasons.seasons.L2", [e1s0, e1s1, e1s2, e1s3, e2s0, e2s1, e2s2, fe1, fe2, fa1, fa3, fa4, fa5, fp1, t4, t6, x4]);
