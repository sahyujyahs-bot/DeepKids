import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SKIN, CLOTH, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, plate, hand, person, write } from "./flatKit";

// sci.changes.fire.L3 picture cards (idea and activity cards, flat style)
const WAX = "#fff3dc", WAXDK = "#e6d6b4", CLAY = "#c8663a", CLAYDK = "#9c4a28", OIL = "#f6cf55", SMOKE = "#e4e0d8", AIR = "#7fb8ec", LPG = "#d7372b";

const handL = (c: Ctx, x: number, y: number, an: number, s: number, skin: string = SKIN.adult, sleeve: string = CLOTH.adult, open = false) => {
  c.save(); c.translate(x, y); c.scale(-1, 1); hand(c, 0, 0, Math.PI - an, s, skin, sleeve, open); c.restore();
};
const flame = (c: Ctx, x: number, y: number, h: number, lean = 0, wf = 0.32) => {
  const body = (k: number) => () => { c.moveTo(x, y); c.bezierCurveTo(x - h * wf * k, y - h * 0.1 * k, x - h * wf * 0.95 * k, y - h * 0.55 * k, x + lean * k, y - h * k); c.bezierCurveTo(x + h * wf * 0.95 * k, y - h * 0.55 * k, x + h * wf * k, y - h * 0.1 * k, x, y); c.closePath(); };
  shape(c, body(1), COL.orange, 5); shape(c, body(0.62), COL.yellow, 0); shape(c, body(0.26), COL.blue, 0);
};
const blueFlame = (c: Ctx, x: number, y: number, h: number) => {
  const body = (k: number) => () => { c.moveTo(x, y); c.bezierCurveTo(x - h * 0.3 * k, y - h * 0.1 * k, x - h * 0.2 * k, y - h * 0.6 * k, x, y - h * k); c.bezierCurveTo(x + h * 0.2 * k, y - h * 0.6 * k, x + h * 0.3 * k, y - h * 0.1 * k, x, y); c.closePath(); };
  shape(c, body(1), "#4f86e0", 4); shape(c, body(0.6), "#a9d4ff", 0);
};
const smoke = (c: Ctx, pts: number[][], w = 30) => {
  const p = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  p(); c.strokeStyle = INK; c.lineWidth = w + 9; c.stroke(); p(); c.strokeStyle = SMOKE; c.lineWidth = w; c.stroke();
};
const candle = (c: Ctx, x: number, yb: number, w: number, h: number, lit: boolean, fh = 140) => {
  const top = yb - h, body = () => rrect(c, x - w / 2, top, w, h, 10);
  shadow(c, x + w * 0.2, yb + 4, w * 0.8, w * 0.14);
  shape(c, body, WAX, 6); shade(c, body, WAXDK, w * 0.3, 0, 0.9);
  shape(c, () => ell(c, x, top, w / 2, w * 0.1), "#fffaf0", 5);
  shine(c, [[x - w * 0.3, top + 30], [x - w * 0.3, yb - 40]], 8);
  line(c, [[x, top], [x, top - 36]], 8, INK);
  if (lit) flame(c, x, top - 34, fh);
  return top - 36;
};
// air: two blue wavy strokes
const air = (c: Ctx, x: number, y: number, s = 1) => {
  for (const dy of [-34, 8, 50]) { const pts = [[x - 70 * s, y + dy * s], [x - 25 * s, y + (dy - 22) * s], [x + 20 * s, y + (dy + 18) * s], [x + 70 * s, y + (dy - 4) * s]]; line(c, pts, 20 * s, INK); line(c, pts, 11 * s, AIR); }
};
const drop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y - 1.3 * s); c.bezierCurveTo(x + 0.2 * s, y - 0.5 * s, x + s, y - 0.2 * s, x + s, y + 0.4 * s); c.arc(x, y + 0.4 * s, s, 0, Math.PI); c.bezierCurveTo(x - s, y - 0.2 * s, x - 0.2 * s, y - 0.5 * s, x, y - 1.3 * s); c.closePath(); }, COL.water, 5);
const logs = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.05, y + h * 0.5, w * 0.55, h * 0.16);
  const body = () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.2);
  shape(c, body, COL.brown, 6); shade(c, body, COL.soilDk, 0, h * 0.25, 0.5);
  for (const k of [-0.18, 0.12]) line(c, [[x - w * 0.35, y + h * k], [x + w * 0.2, y + h * k]], 4, COL.soilDk);
  shape(c, () => ell(c, x + w / 2, y, h * 0.2, h / 2), COL.wood, 6); shape(c, () => ell(c, x + w / 2, y, h * 0.09, h * 0.24), COL.woodDk, 3);
};
const cylinder = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, yb + 6, w * 0.6, w * 0.1);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, w * 0.3);
  shape(c, body, LPG, 6); shade(c, body, "#a8281f", w * 0.22, 0, 0.8);
  shape(c, () => rrect(c, x - w * 0.22, yb - h - w * 0.2, w * 0.44, w * 0.26, 6), COL.steelDk, 5);
  shape(c, () => rrect(c, x - w * 0.12, yb - h - w * 0.34, w * 0.24, w * 0.16, 5), COL.black, 5);
  shine(c, [[x - w * 0.32, yb - h * 0.75], [x - w * 0.32, yb - h * 0.3]], 9);
};
const diyaS = (c: Ctx, x: number, y: number, r: number, oil: boolean) => {
  shadow(c, x + r * 0.1, y + r * 0.82, r * 1.0, r * 0.14);
  const bowl = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y + r * 0.95, x + r, y + r * 0.95, x + r, y); c.closePath(); };
  shape(c, bowl, CLAY, 6); shade(c, bowl, CLAYDK, r * 0.25, 0, 0.5);
  shape(c, () => ell(c, x, y, r, r * 0.3), CLAYDK, 5);
  if (oil) shape(c, () => ell(c, x, y + 2, r * 0.84, r * 0.23), OIL, 0);
  line(c, [[x, y], [x, y - 60]], 22, INK); line(c, [[x, y], [x, y - 60]], 12, oil ? "#f1e2b0" : COL.paper);
  return y - 60;
};
const bucket = (c: Ctx, x: number, yb: number, w: number, h: number) => {
  shadow(c, x + w * 0.1, yb + 5, w * 0.6, w * 0.1);
  const body = () => { c.moveTo(x - w / 2, yb - h); c.lineTo(x + w / 2, yb - h); c.lineTo(x + w * 0.38, yb); c.lineTo(x - w * 0.38, yb); c.closePath(); };
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, w * 0.25, 0, 0.8);
  shape(c, () => ell(c, x, yb - h, w / 2, w * 0.1), COL.water, 5);
  c.beginPath(); c.arc(x, yb - h, w * 0.5, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  shine(c, [[x - w * 0.32, yb - h * 0.8], [x - w * 0.26, yb - h * 0.2]], 8);
};
const heat = (c: Ctx, x: number, y: number, h = 130) => {
  for (const dx of [-40, 0, 40]) { const pts = [[x + dx, y], [x + dx + 14, y - h * 0.33], [x + dx - 14, y - h * 0.66], [x + dx, y - h]]; line(c, pts, 15, INK); line(c, pts, 7, RED); }
};
const tagCircle = (c: Ctx, x: number, y: number, r: number) => shape(c, () => ell(c, x, y, r, r), WHITE, 6);

// 0 summary: a candle and its three needs
const summary = (c: Ctx) => {
  ground(c);
  plate(c, 540, 885, 250, 60);
  candle(c, 540, 880, 110, 300, true, 170);
  // wax block
  shape(c, () => rrect(c, 80, 640, 200, 130, 14), WAX, 6); shade(c, () => rrect(c, 80, 640, 200, 130, 14), WAXDK, 40, 0, 0.9);
  shine(c, [[110, 665], [110, 740]], 9);
  arrow(c, [[300, 700], [400, 720], [470, 740]]);
  // air
  air(c, 190, 300, 1.2);
  arrow(c, [[320, 330], [400, 400], [460, 450]]);
  // matchbox with a lit match
  shape(c, () => rrect(c, 770, 700, 240, 120, 10), COL.red, 6); shape(c, () => rrect(c, 770, 780, 240, 40, 8), "#8a2d1f", 4);
  line(c, [[800, 808], [980, 808]], 6, COL.greyDk);
  line(c, [[800, 650], [930, 690]], 14, INK); line(c, [[800, 650], [930, 690]], 7, COL.wood);
  shape(c, () => ell(c, 800, 648, 20, 20), RED, 5);
  flame(c, 794, 636, 100);
  arrow(c, [[760, 590], [680, 520], [612, 470]]);
};

// 1 tea strainer over a flame
const strainer = (c: Ctx) => {
  ground(c);
  plate(c, 420, 905, 250, 60);
  candle(c, 420, 900, 110, 220, true, 130);
  const cx = 420, cy = 520, rx = 200, ry = 46;
  shape(c, () => ell(c, cx, cy, rx, ry), COL.steelIn, 8);
  c.save(); c.beginPath(); ell(c, cx, cy, rx - 6, ry - 4); c.clip();
  for (let i = -9; i <= 9; i++) { line(c, [[cx + i * 22, cy - 60], [cx + i * 22, cy + 60]], 2.5, COL.greyDk); }
  for (let j = -3; j <= 3; j++) line(c, [[cx - rx, cy + j * 14], [cx + rx, cy + j * 14]], 2.5, COL.greyDk);
  c.restore();
  c.beginPath(); ell(c, cx, cy, rx, ry); c.lineWidth = 12; c.strokeStyle = COL.steelDk; c.stroke(); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
  line(c, [[cx + rx, cy + 4], [850, cy + 4]], 30, INK); line(c, [[cx + rx, cy + 4], [850, cy + 4]], 18, COL.steelDk);
  handL(c, 960, cy + 14, Math.PI, 1.4);
};

// 2 dry wick and oiled wick
const wicks = (c: Ctx) => {
  ground(c);
  const t1 = diyaS(c, 290, 640, 190, false), t2 = diyaS(c, 790, 640, 190, true);
  flame(c, 290, t1 - 4, 110); flame(c, 790, t2 - 4, 170);
  line(c, [[290, t1 + 14], [290, t1 - 2]], 12, COL.black);
  // a clock with a wedge between the two lamps
  const kx = 540, ky = 240;
  shape(c, () => ell(c, kx, ky, 110, 110), WHITE, 7);
  c.beginPath(); c.moveTo(kx, ky); c.arc(kx, ky, 96, -Math.PI / 2, Math.PI * 0.1); c.closePath(); c.fillStyle = "#f6b5ab"; c.fill();
  line(c, [[kx, ky], [kx, ky - 80]], 8); line(c, [[kx, ky], [kx + 52, ky + 22]], 8);
  arrow(c, [[420, 560], [540, 420], [540, 380]], RED, 8);
};

// 3 watch a flame
const watchFlame = (c: Ctx) => {
  ground(c);
  candle(c, 400, 900, 130, 230, true, 400);
  // notebook with a sketch
  shadow(c, 800, 905, 190, 24);
  shape(c, () => rrect(c, 640, 540, 290, 360, 12), WHITE, 6);
  shape(c, () => rrect(c, 640, 540, 40, 360, 8), COL.teal, 5);
  flame(c, 790, 740, 130);
  for (const y of [790, 830, 868]) line(c, [[712, y], [900, y]], 4, COL.steelDk);
  line(c, [[960, 470], [800, 760]], 20, INK); line(c, [[960, 470], [800, 760]], 11, COL.yellow);
  line(c, [[823, 718], [800, 760]], 13, COL.pink);
  // an eye
  shape(c, () => { c.moveTo(670, 220); c.quadraticCurveTo(790, 110, 910, 220); c.quadraticCurveTo(790, 330, 670, 220); c.closePath(); }, WHITE, 6);
  shape(c, () => ell(c, 790, 220, 42, 42), COL.tealDk, 5); shape(c, () => ell(c, 790, 220, 16, 16), INK, 0);
};

const extinguisher = (c: Ctx, x: number, yb: number, h: number) => {
  const w = h * 0.4;
  shadow(c, x + w * 0.1, yb + 5, w * 0.7, w * 0.1);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, w * 0.3);
  shape(c, body, LPG, 6); shade(c, body, "#a8281f", w * 0.22, 0, 0.8);
  shape(c, () => rrect(c, x - w * 0.18, yb - h - 28, w * 0.36, 34, 6), COL.black, 5);
  line(c, [[x - w * 0.1, yb - h - 20], [x + w * 0.5, yb - h - 30]], 14, INK);
  const hose = [[x + w * 0.2, yb - h + 10], [x + w * 0.75, yb - h * 0.5], [x + w * 0.45, yb - h * 0.25]];
  line(c, hose, 16, INK); line(c, hose, 8, COL.black);
  shape(c, () => rrect(c, x - w * 0.3, yb - h * 0.62, w * 0.6, h * 0.22, 6), WHITE, 4);
  shine(c, [[x - w * 0.36, yb - h * 0.9], [x - w * 0.36, yb - h * 0.7]], 8);
};
// 4 home fire safety walk
const safetyWalk = (c: Ctx) => {
  ground(c);
  line(c, [[0, 880], [1080, 880]], 6);
  // smoke alarm on the ceiling
  line(c, [[0, 60], [1080, 60]], 6);
  shape(c, () => ell(c, 330, 105, 85, 40), WHITE, 6); shape(c, () => ell(c, 330, 105, 22, 11), COL.greyDk, 4); shape(c, () => ell(c, 395, 108, 7, 5), RED, 2);
  extinguisher(c, 150, 880, 340);
  cylinder(c, 430, 880, 190, 320);
  person(c, 820, 900, 640, { armR: [Math.PI * 0.75, Math.PI * 0.9] });
  shadow(c, 700, 640, 70, 12);
  shape(c, () => rrect(c, 630, 480, 130, 170, 8), WHITE, 6);
  line(c, [[660, 560], [690, 595], [735, 520]], 14, COL.green);
  line(c, [[655, 520], [740, 520]], 4, COL.steelDk);
  c.save(); c.translate(0, 0); c.restore();
};

// lying child on a mat, head to the right
const lying = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 270, y + 20, 520, 36, 10), COL.teal, 6);
  line(c, [[x - 70, y - 10], [x - 240, y - 10]], 60, INK); line(c, [[x - 70, y - 10], [x - 240, y - 10]], 48, "#6b5a8c");
  shape(c, () => rrect(c, x - 110, y - 62, 230, 82, 40), CLOTH.child);
  shade(c, () => rrect(c, x - 110, y - 62, 230, 82, 40), CLOTH.childDk, 0, 22, 0.8);
  shape(c, () => ell(c, x + 165, y - 25, 52, 54), SKIN.child);
  shape(c, () => { c.moveTo(x + 112, y - 30); c.bezierCurveTo(x + 115, y - 100, x + 205, y - 100, x + 217, y - 35); c.quadraticCurveTo(x + 165, y - 62, x + 112, y - 30); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + 185, y - 22, 6, 8), INK, 0);
  line(c, [[x + 30, y - 25], [x + 100, y - 15]], 28, INK); line(c, [[x + 30, y - 25], [x + 100, y - 15]], 18, CLOTH.child);
};
const crawling = (c: Ctx, x: number, y: number) => {
  line(c, [[x - 100, y - 100], [x - 110, y - 22], [x - 250, y - 22]], 52, INK); line(c, [[x - 100, y - 100], [x - 110, y - 22], [x - 250, y - 22]], 40, "#6b5a8c");
  shape(c, () => rrect(c, x - 130, y - 170, 230, 90, 42), CLOTH.child);
  shade(c, () => rrect(c, x - 130, y - 170, 230, 90, 42), CLOTH.childDk, 0, 22, 0.8);
  line(c, [[x + 55, y - 110], [x + 62, y - 20]], 44, INK); line(c, [[x + 55, y - 110], [x + 62, y - 20]], 32, CLOTH.child);
  shape(c, () => ell(c, x + 70, y - 10, 26, 18), SKIN.child, 5);
  shape(c, () => ell(c, x + 150, y - 140, 52, 54), SKIN.child);
  shape(c, () => { c.moveTo(x + 98, y - 145); c.bezierCurveTo(x + 100, y - 215, x + 190, y - 215, x + 202, y - 150); c.quadraticCurveTo(x + 150, y - 175, x + 98, y - 145); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + 172, y - 134, 6, 8), INK, 0);
};
// 5 stop drop and roll / crawl low
const dropRoll = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d6bb"; c.fillRect(540, 0, 540, 1080);
  line(c, [[540, 0], [540, 1080]], 7);
  lying(c, 300, 700);
  arrow(c, [[130, 520], [180, 430], [290, 380], [400, 400], [455, 470]], RED, 10);
  // smoke layer at the top of the right half, child crawling below it
  for (const [sx, sy, rx, ry] of [[650, 120, 100, 90], [790, 100, 130, 100], [930, 125, 100, 95], [720, 210, 100, 65], [870, 220, 120, 65]] as number[][]) shape(c, () => ell(c, sx, sy, rx, ry), "#8f8a95", 6);
  crawling(c, 780, 880);
  arrow(c, [[640, 960], [800, 975], [960, 960]], RED, 10);
};

// 6 cool a burn
const coolBurn = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 100, 330, 76, 16), COL.steel, 6); shape(c, () => rrect(c, 300, 100, 70, 150, 14), COL.steel, 6);
  shape(c, () => rrect(c, 280, 70, 40, 40, 6), COL.steelDk, 5);
  const sx = 335;
  line(c, [[sx, 252], [sx, 520]], 38, INK); line(c, [[sx, 252], [sx, 520]], 24, COL.water);
  line(c, [[sx - 6, 270], [sx - 6, 500]], 6, COL.drop);
  for (const [dx, dy] of [[-60, 480], [70, 470], [-95, 520], [105, 515]]) drop(c, sx + dx, 550 + dy - 480, 16);
  hand(c, 230, 640, 0, 2.3, SKIN.child, CLOTH.child, true);
  // the clock with 20 minutes shaded
  const kx = 790, ky = 330, r = 190;
  shape(c, () => ell(c, kx, ky, r, r), WHITE, 8);
  c.beginPath(); c.moveTo(kx, ky); c.arc(kx, ky, r - 14, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2) / 3); c.closePath(); c.fillStyle = "#f6b5ab"; c.fill();
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[kx + Math.sin(a) * (r - 14), ky - Math.cos(a) * (r - 14)], [kx + Math.sin(a) * (r - 34), ky - Math.cos(a) * (r - 34)]], 6); }
  line(c, [[kx, ky], [kx, ky - 130]], 9); line(c, [[kx, ky], [kx + Math.sin(Math.PI * 2 / 3) * 100, ky - Math.cos(Math.PI * 2 / 3) * 100]], 9);
  write(c, "20", 700, 600, 190, INK, 14);
};

// 7 rub your hands
const rubbing = (c: Ctx) => {
  ground(c);
  hand(c, 300, 470, 0, 3.2, SKIN.child, CLOTH.child, true);
  handL(c, 780, 620, Math.PI, 3.2, SKIN.child, CLOTH.child, true);
  heat(c, 540, 260, 130);
  arrow(c, [[420, 850], [330, 900]], RED, 10); arrow(c, [[660, 850], [750, 900]], RED, 10);
};

// 8 sort the fire stoppers
const sortTriangle = (c: Ctx) => {
  ground(c);
  const cols = [190, 540, 890];
  for (const x of cols) { shape(c, () => rrect(c, x - 155, 40, 310, 1000, 30), "#f7edd6", 5); }
  // headers
  logs(c, 190, 190, 200, 80);
  air(c, 540, 190, 1.2);
  flame(c, 890, 270, 150); heat(c, 890, 80, 40);
  line(c, [[390, 330], [390, 330]], 1);
  // slips
  const slip = (x: number, y: number, ic: () => void) => { shape(c, () => rrect(c, x - 110, y - 100, 220, 200, 12), WHITE, 6); ic(); };
  slip(190, 620, () => { cylinder(c, 190, 700, 90, 140); });
  slip(540, 620, () => { shape(c, () => ell(c, 540, 650, 85, 28), COL.steel, 6); shape(c, () => rrect(c, 520, 590, 40, 28, 6), COL.steelDk, 5); });
  slip(890, 620, () => { drop(c, 890, 620, 52); });
  for (const x of cols) arrow(c, [[x, 480], [x, 380]], RED, 10);
  slip(190, 900, () => { logs(c, 190, 900, 130, 50); });
  slip(540, 900, () => { shape(c, () => { c.moveTo(450, 950); c.quadraticCurveTo(540, 810, 630, 950); c.closePath(); }, "#e0cba0", 5); });
  slip(890, 900, () => { drop(c, 850, 900, 34); drop(c, 930, 910, 34); });
};

// 9 our family fire plan
const familyPlan = (c: Ctx) => {
  ground(c);
  line(c, [[0, 830], [1080, 830]], 6);
  shape(c, () => rrect(c, 80, 440, 450, 390, 8), "#f4d8a8"); shape(c, () => polyP(c, [[40, 450], [305, 230], [570, 450]]), CLAY);
  shape(c, () => rrect(c, 230, 620, 150, 210, 8), COL.brown); shape(c, () => ell(c, 355, 730, 9, 9), COL.yellow, 3);
  shape(c, () => rrect(c, 110, 500, 100, 100, 6), COL.sky); line(c, [[160, 500], [160, 600]], 5); line(c, [[110, 550], [210, 550]], 5);
  shape(c, () => rrect(c, 410, 500, 100, 100, 6), COL.sky); line(c, [[460, 500], [460, 600]], 5); line(c, [[410, 550], [510, 550]], 5);
  arrow(c, [[400, 850], [520, 900], [640, 900]], RED, 12);
  shadow(c, 850, 835, 190, 25);
  shape(c, () => rrect(c, 825, 530, 50, 300, 8), COL.soil);
  for (const [tx, ty, tr] of [[850, 440, 120], [760, 520, 90], [940, 520, 90]] as number[][]) shape(c, () => ell(c, tx, ty, tr, tr), COL.leaf);
  person(c, 700, 930, 330); person(c, 990, 930, 360, { adult: true });
};

// 10 windproof diya
const windproof = (c: Ctx) => {
  ground(c);
  line(c, [[0, 800], [1080, 800]], 6);
  // fan
  shape(c, () => rrect(c, 160, 600, 30, 200, 6), COL.steelDk); shape(c, () => ell(c, 175, 810, 90, 18), COL.steelDk);
  shape(c, () => ell(c, 175, 450, 150, 150), COL.glass, 7);
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 + 0.5; shape(c, () => ell(c, 175 + Math.cos(a) * 55, 450 + Math.sin(a) * 55, 60, 24, a), COL.blue, 5); }
  shape(c, () => ell(c, 175, 450, 22, 22), COL.steelDk, 5);
  arrow(c, [[350, 380], [450, 380]], RED, 12); arrow(c, [[350, 500], [450, 500]], RED, 12);
  // foil shield
  shape(c, () => rrect(c, 500, 330, 46, 470, 8), COL.steel, 6); shine(c, [[516, 360], [516, 560]], 9);
  // diya
  const t = diyaS(c, 800, 700, 170, true); flame(c, 800, t - 4, 180);
};

// 11 fire-safe Deepavali
const deepavali = (c: Ctx) => {
  ground(c);
  line(c, [[0, 840], [1080, 840]], 6);
  // curtain
  shape(c, () => rrect(c, 40, 0, 200, 700, 8), COL.pink, 6);
  for (const x of [90, 140, 190]) line(c, [[x, 20], [x, 680]], 5, "#d97a97");
  shape(c, () => ell(c, 140, 700, 110, 16), "#d97a97", 0);
  arrow(c, [[420, 560], [290, 560]], RED, 12); arrow(c, [[420, 560], [550, 560]], RED, 12);
  plate(c, 640, 810, 230, 60);
  for (const x of [550, 640, 730]) { const t = diyaS(c, x, 780, 62, true); flame(c, x, t - 2, 85); }
  bucket(c, 930, 840, 190, 250);
};

// 12 burning: fuel + oxygen to ash and flame
const burning = (c: Ctx) => {
  ground(c);
  logs(c, 200, 760, 300, 110);
  for (const [x, y] of [[110, 520], [250, 470], [350, 560], [180, 620]]) shape(c, () => ell(c, x, y, 22, 22), AIR, 5);
  arrow(c, [[380, 640], [500, 640], [620, 640]], RED, 14);
  shape(c, () => { c.moveTo(670, 880); c.quadraticCurveTo(840, 700, 1010, 880); c.closePath(); }, COL.grey, 6);
  flame(c, 780, 800, 330); flame(c, 910, 810, 220);
  heat(c, 850, 400, 100);
};

// 13 fuel
const fuelCard = (c: Ctx) => {
  ground(c);
  candle(c, 280, 470, 90, 230, false);
  cylinder(c, 790, 480, 150, 270);
  logs(c, 270, 830, 280, 100); logs(c, 310, 900, 280, 70);
  // oil bottle
  shadow(c, 800, 920, 80, 14);
  const body = () => rrect(c, 735, 700, 130, 220, 30);
  shape(c, body, "rgba(246,207,85,0.9)", 6); shape(c, () => rrect(c, 775, 640, 50, 70, 8), "rgba(246,207,85,0.9)", 6); shape(c, () => rrect(c, 770, 618, 60, 28, 6), COL.red, 5);
  shape(c, () => rrect(c, 745, 780, 110, 70, 6), WHITE, 4); shine(c, [[755, 730], [755, 760]], 8);
};

// 14 oxygen: one part in five
const oxygen = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 5; i++) shape(c, () => rrect(c, 125 + i * 170, 120, 150, 150, 14), i === 0 ? AIR : "#d9d3c5", 6);
  for (const [dx, dy] of [[75, 75], [45, 40], [105, 105]]) shape(c, () => ell(c, 125 + dx, 120 + dy, 14, 14), WHITE, 4);
  plate(c, 540, 910, 220, 50);
  candle(c, 540, 905, 100, 280, true, 170);
  air(c, 190, 640, 1.1); air(c, 890, 640, 1.1);
  arrow(c, [[300, 640], [400, 600], [470, 560]], RED, 10); arrow(c, [[780, 640], [680, 600], [610, 560]], RED, 10);
};

// 15 gas: steam from a pot of boiling water
const steam = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 180, 800, 720, 90, 14), COL.steel, 6);
  for (const x of [330, 540, 750]) { flame(c, x, 800, 90); }
  const body = () => rrect(c, 280, 470, 520, 300, 26);
  shadow(c, 560, 780, 300, 22);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 60, 0, 0.8);
  shape(c, () => ell(c, 540, 470, 260, 44), COL.water, 7);
  for (const [x, y, r] of [[440, 470, 14], [560, 480, 18], [650, 460, 12], [500, 455, 9]]) shape(c, () => ell(c, x, y, r, r), COL.drop, 3);
  shape(c, () => rrect(c, 200, 520, 90, 30, 12), COL.steelDk, 5); shape(c, () => rrect(c, 790, 520, 90, 30, 12), COL.steelDk, 5);
  smoke(c, [[440, 410], [470, 340], [430, 270], [470, 190], [440, 110]], 26);
  smoke(c, [[560, 410], [590, 330], [550, 250], [590, 170], [560, 90]], 26);
  smoke(c, [[670, 410], [700, 340], [660, 270], [700, 190]], 26);
  arrow(c, [[800, 380], [800, 200]], RED, 12);
};

// 16 smoke from a blown-out candle
const smokeCard = (c: Ctx) => {
  ground(c);
  plate(c, 540, 905, 240, 56);
  const w = candle(c, 540, 900, 110, 300, false);
  smoke(c, [[540, w - 6], [575, w - 70], [510, w - 150], [575, w - 230], [510, w - 310], [570, w - 390], [540, w - 450]], 28);
};

// 17 soot above a lamp
const sootCard = (c: Ctx) => {
  ground(c, "#e9dcc2");
  c.fillStyle = "#efe4cf";
  for (const [x, y, rx, ry] of [[540, 330, 190, 210], [540, 250, 130, 160], [540, 420, 220, 140], [520, 200, 90, 90]] as number[][]) { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = "rgba(43,35,64,0.22)"; c.fill(); }
  for (const [x, y, rx, ry] of [[540, 360, 140, 150], [540, 300, 90, 100]] as number[][]) { c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = "rgba(43,35,64,0.5)"; c.fill(); }
  line(c, [[0, 900], [1080, 900]], 6);
  plate(c, 540, 905, 200, 40);
  const t = diyaS(c, 540, 800, 130, true); flame(c, 540, t - 4, 150);
};

// 18 ignite: a lit match meets the wick
const ignite = (c: Ctx) => {
  ground(c);
  plate(c, 330, 905, 220, 50);
  const w = candle(c, 330, 900, 120, 300, false);
  line(c, [[860, 640], [440, 575]], 22, INK); line(c, [[860, 640], [440, 575]], 12, COL.wood);
  shape(c, () => ell(c, 433, 574, 22, 22), RED, 5);
  flame(c, 428, 560, 110, -10); flame(c, 330, w, 60);
  handL(c, 940, 660, Math.PI + 0.15, 1.4);
};

// 19 extinguish: a lid on a burning kadai
const lidOn = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 830, 330, 28);
  const pan = () => { c.moveTo(240, 620); c.bezierCurveTo(260, 850, 820, 850, 840, 620); c.closePath(); };
  shape(c, pan, COL.steel); shade(c, pan, COL.steelDk, 80, 0, 0.7);
  shape(c, () => ell(c, 540, 620, 300, 36), COL.steelIn, 6);
  shape(c, () => rrect(c, 130, 600, 130, 28, 12), COL.steelDk, 5); shape(c, () => rrect(c, 820, 600, 130, 28, 12), COL.steelDk, 5);
  for (const [x, h] of [[430, 190], [540, 240], [650, 190]]) flame(c, x, 620, h);
  const lid = () => { c.moveTo(240, 330); c.quadraticCurveTo(540, 160, 840, 330); c.closePath(); };
  shape(c, lid, COL.steel); shade(c, lid, COL.steelDk, 90, 0, 0.7);
  shape(c, () => ell(c, 540, 330, 300, 30), COL.steelIn, 6);
  shape(c, () => ell(c, 540, 228, 30, 20), COL.black, 5);
  arrow(c, [[960, 120], [960, 320]], RED, 14);
};

// 20 flammable: things that catch fire easily
const flammable = (c: Ctx) => {
  ground(c);
  line(c, [[0, 840], [1080, 840]], 6);
  // petrol can
  shadow(c, 200, 845, 120, 16);
  const can = () => rrect(c, 90, 600, 220, 240, 18);
  shape(c, can, LPG); shade(c, can, "#a8281f", 40, 0, 0.8);
  shape(c, () => polyP(c, [[110, 600], [140, 560], [200, 560], [210, 600]]), LPG, 6);
  shape(c, () => rrect(c, 260, 565, 40, 38, 6), COL.black, 5);
  drop(c, 200, 740, 38);
  flame(c, 200, 555, 170);
  // paper
  shadow(c, 540, 845, 130, 16);
  shape(c, () => polyP(c, [[430, 840], [415, 640], [470, 610], [540, 640], [610, 600], [665, 645], [650, 840]]), "#fffdf5", 6);
  line(c, [[470, 700], [610, 700]], 4, COL.steelDk); line(c, [[470, 750], [610, 750]], 4, COL.steelDk);
  flame(c, 540, 625, 190);
  // thin cloth
  shadow(c, 880, 845, 110, 16);
  shape(c, () => { c.moveTo(780, 600); c.lineTo(980, 600); c.lineTo(960, 700); c.quadraticCurveTo(990, 760, 950, 840); c.quadraticCurveTo(910, 810, 880, 840); c.quadraticCurveTo(840, 800, 810, 840); c.quadraticCurveTo(800, 740, 800, 700); c.closePath(); }, COL.pink, 6);
  for (const x of [830, 880, 930]) line(c, [[x, 620], [x - 6, 800]], 4, "#d97a97");
  flame(c, 880, 595, 170);
};

// 21 fire drill
const fireDrill = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 860, 400, 24);
  shape(c, () => rrect(c, 160, 770, 760, 90, 14), COL.wood, 6);
  shape(c, () => polyP(c, [[510, 770], [570, 770], [540, 810]]), COL.soilDk, 4);
  shape(c, () => rrect(c, 520, 330, 40, 450, 8), COL.brown, 6);
  hand(c, 320, 470, 0, 1.8, SKIN.child, CLOTH.child, true);
  handL(c, 760, 580, Math.PI, 1.8, SKIN.child, CLOTH.child, true);
  arrow(c, [[300, 330], [460, 330]], RED, 12); arrow(c, [[780, 400], [620, 400]], RED, 12);
  c.beginPath(); ell(c, 540, 770, 56, 30); c.fillStyle = "rgba(244,100,60,0.45)"; c.fill();
  shape(c, () => ell(c, 600, 800, 22, 14), RED, 4);
  smoke(c, [[490, 760], [440, 700], [480, 650], [430, 600]], 18);
};

// 22 LPG
const lpg = (c: Ctx) => {
  ground(c);
  line(c, [[0, 880], [1080, 880]], 6);
  cylinder(c, 260, 880, 280, 470);
  line(c, [[270, 430], [330, 360], [520, 360], [620, 520], [720, 600]], 24, INK); line(c, [[270, 430], [330, 360], [520, 360], [620, 520], [720, 600]], 14, COL.black);
  shadow(c, 790, 890, 270, 24);
  shape(c, () => rrect(c, 600, 640, 380, 240, 18), COL.steel); shade(c, () => rrect(c, 600, 640, 380, 240, 18), COL.steelDk, 60, 0, 0.8);
  shape(c, () => rrect(c, 590, 610, 400, 50, 12), COL.steelIn, 6);
  shape(c, () => ell(c, 690, 625, 36, 12), COL.black, 4); shape(c, () => ell(c, 880, 625, 36, 12), COL.black, 4);
  blueFlame(c, 690, 625, 55);
  shape(c, () => ell(c, 790, 780, 30, 30), COL.black, 5);
  for (const dx of [-30, 0, 30]) { const pts = [[400 + dx, 300], [410 + dx, 260], [385 + dx, 220], [405 + dx, 180]]; line(c, pts, 14, INK); line(c, pts, 7, COL.greenLt); }
};

// 23 the fire triangle
const triangle = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[540, 140], [100, 850], [980, 850]]), "#f9dca3", 10);
  flame(c, 540, 770, 330);
  tagCircle(c, 540, 150, 105); heat(c, 540, 220, 120);
  tagCircle(c, 150, 850, 105); logs(c, 130, 850, 130, 60);
  tagCircle(c, 930, 850, 105); air(c, 930, 850, 0.85);
};

// 24 a flame keeps itself going
const keepGoing = (c: Ctx) => {
  ground(c);
  plate(c, 540, 905, 240, 56);
  candle(c, 540, 900, 130, 280, true, 210);
  arrow(c, [[690, 420], [770, 520], [700, 630]], RED, 14);
  arrow(c, [[390, 660], [310, 540], [390, 430]], RED, 14);
};

// 25 flame colours: yellow candle flame and blue gas flame
const colours = (c: Ctx) => {
  ground(c);
  plate(c, 250, 905, 200, 46);
  candle(c, 250, 900, 100, 260, true, 280);
  shadow(c, 780, 880, 260, 30);
  shape(c, () => ell(c, 780, 800, 250, 80), COL.black, 6);
  shape(c, () => ell(c, 780, 785, 220, 62), COL.steelDk, 5);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; blueFlame(c, 780 + Math.cos(a) * 170, 785 + Math.sin(a) * 45, 70); }
};

// 26 a lightning strike starts a wildfire
const wildfire = (c: Ctx) => {
  ground(c, "#cfe6f2");
  c.fillStyle = COL.green; c.fillRect(0, 880, 1080, 200); line(c, [[0, 880], [1080, 880]], 6);
  for (const [x, y, rx, ry] of [[400, 130, 140, 70], [540, 100, 170, 90], [690, 135, 150, 70], [550, 170, 220, 60]] as number[][]) shape(c, () => ell(c, x, y, rx, ry), "#8f8a95", 6);
  shape(c, () => polyP(c, [[560, 220], [470, 410], [545, 410], [480, 600], [640, 370], [560, 370], [630, 220]]), COL.yellow, 6);
  shape(c, () => rrect(c, 510, 700, 60, 190, 8), COL.soil);
  for (const [x, y, r] of [[540, 650, 120], [440, 710, 95], [640, 710, 95]] as number[][]) shape(c, () => ell(c, x, y, r, r), COL.leafDk);
  flame(c, 490, 650, 190); flame(c, 610, 660, 160); flame(c, 545, 560, 150);
};

export const ic_changesFireL3 = cards("sci.changes.fire.L3 cards", [
  summary, strainer, wicks, watchFlame, safetyWalk, dropRoll, coolBurn, rubbing, sortTriangle, familyPlan, windproof, deepavali,
  burning, fuelCard, oxygen, steam, smokeCard, sootCard, ignite, lidOn, flammable, fireDrill, lpg, triangle, keepGoing, colours, wildfire,
]);
