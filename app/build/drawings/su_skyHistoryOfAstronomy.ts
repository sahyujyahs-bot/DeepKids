import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, BG, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// sci.sky.history-of-astronomy.L3 · set-up cards. Same plastic cup, steel vessel, phone stopwatch and bottle on every card of an experiment.

// ---------------------------------------------------------------- shared things
// a coin seen at a slant
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.62), COL.yellow, 4);
  c.beginPath(); ell(c, x, y, r * 0.62, r * 0.38); c.strokeStyle = COL.woodDk; c.lineWidth = 3; c.stroke();
};
// a strip of sticky tape
const tapeStrip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), "rgba(255,250,225,0.85)", 3); c.restore();
};
// a clear plastic cup. (x, y) = centre of its closed bottom; 220 high, 190 wide at the rim, in local units scaled by k.
// flip = upside down (the closed bottom is at the top). water = water inside (local height), jet = height of the water jet.
type CupOpt = { flip?: boolean; rot?: number; water?: number; jet?: number; coins?: boolean };
const cup = (c: Ctx, x: number, y: number, k: number, o: CupOpt = {}) => {
  c.save(); c.translate(x, y); c.rotate(o.rot ?? 0); c.scale(k, o.flip ? -k : k);
  const body = () => polyP(c, [[-95, -220], [95, -220], [70, 0], [-70, 0]]);
  shape(c, body, "rgba(255,255,255,0.0)", 0);
  if (o.water) { c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(-100, -o.water, 200, o.water); c.fillStyle = COL.drop; c.globalAlpha = 0.6; c.fillRect(-100, -o.water, 200, 8); c.globalAlpha = 1; c.restore(); }
  if (o.coins) {
    for (const s of [-1, 1]) { coin(c, s * 42, -14, 26); tapeStrip(c, s * 42, -14, 70, 18, s * 0.25); }
  }
  if (o.jet) {
    const j = o.jet;
    line(c, [[0, -4], [0, -j]], 14, COL.waterDk); line(c, [[0, -4], [0, -j]], 7, COL.water);
    for (const [dx, dy] of [[-22, 14], [20, 22], [-8, -2], [32, 40]]) shape(c, () => ell(c, dx, -j + dy - 14, 6, 9), COL.drop, 3);
    shape(c, () => ell(c, 0, -j - 8, 10, 12), COL.water, 4);
  }
  shape(c, body, COL.glass, 6);
  shade(c, body, COL.glassEdge, -30, 0, 0.3);
  shape(c, () => ell(c, 0, -220, 95, 16), "rgba(255,255,255,0.4)", 5);
  shine(c, [[-70, -190], [-52, -40]], 9);
  c.restore();
};
// the steel vessel, cut open so you can see in: back half, water, then the front
const potBack = (c: Ctx, x0: number, x1: number, yT: number, yB: number, wY: number) => {
  shadow(c, (x0 + x1) / 2 + 30, yB + 16, (x1 - x0) * 0.55, 26);
  shape(c, () => rrect(c, x0, yT, x1 - x0, yB - yT, 30), COL.steelIn, 0);
  c.save(); c.beginPath(); rrect(c, x0, yT, x1 - x0, yB - yT, 30); c.clip();
  c.fillStyle = COL.water; c.fillRect(x0, wY, x1 - x0, yB - wY);
  c.fillStyle = COL.drop; c.globalAlpha = 0.7; c.fillRect(x0, wY - 3, x1 - x0, 9); c.globalAlpha = 1; c.restore();
};
const potFront = (c: Ctx, x0: number, x1: number, yT: number, yB: number, wY: number) => {
  c.save(); c.beginPath(); rrect(c, x0, yT, x1 - x0, yB - yT, 30); c.clip();
  c.fillStyle = "rgba(95,159,211,0.32)"; c.fillRect(x0, wY, x1 - x0, yB - wY);
  c.fillStyle = "rgba(43,35,64,0.10)"; c.fillRect(x1 - 90, yT, 90, yB - yT); c.restore();
  c.beginPath(); rrect(c, x0, yT, x1 - x0, yB - yT, 30); c.lineJoin = "round"; c.strokeStyle = INK; c.lineWidth = 34; c.stroke();
  c.strokeStyle = COL.steel; c.lineWidth = 22; c.stroke();
  c.save(); c.beginPath(); rrect(c, x0 - 17, yT - 17, x1 - x0 + 34, yB - yT + 34, 40); rrect(c, x0 + 17, yT + 17, x1 - x0 - 34, yB - yT - 34, 20); c.clip("evenodd");
  c.fillStyle = "rgba(43,35,64,0.16)"; c.fillRect(x1 - 40, yT - 20, 60, yB - yT + 40); c.restore();
  shape(c, () => rrect(c, x0 - 14, yT - 14, x1 - x0 + 28, 26, 13), COL.steel, 6);
  shine(c, [[x0 + 2, yT + 90], [x0 + 2, yB - 90]], 7);
};
// a phone showing a stopwatch: start = green button, stop = red button
const phone = (c: Ctx, x: number, y: number, w: number, h: number, stop: boolean, t: string) => {
  shadow(c, x + w * 0.6, y + h + 10, w * 0.6, 16);
  shape(c, () => rrect(c, x, y, w, h, 30), COL.black, 7);
  shape(c, () => rrect(c, x + 12, y + 16, w - 24, h - 32, 20), COL.paper, 4);
  write(c, t, x + w / 2 - 82, y + 62, 54, INK, 8);
  const bx = x + w / 2, by = y + h - 92;
  shape(c, () => ell(c, bx, by, 52, 52), stop ? RED : COL.green, 6);
  if (stop) shape(c, () => rrect(c, bx - 20, by - 20, 40, 40, 6), WHITE, 0);
  else shape(c, () => polyP(c, [[bx - 14, by - 24], [bx + 26, by], [bx - 14, by + 24]]), WHITE, 0);
};
// a fist seen from the front (knuckles up), wrist cuff below
const fist = (c: Ctx, x: number, y: number, w: number, cuff = true) => {
  const h = w * 1.1, skin = SKIN.child;
  if (cuff) shape(c, () => rrect(c, x - w * 0.36, y + h * 0.36, w * 0.72, h * 0.47, w * 0.08), CLOTH.child, 6);
  const palm = () => rrect(c, x - w / 2, y - h / 2, w, h * 0.92, w * 0.2);
  shape(c, palm, skin, 6);
  shade(c, palm, SKIN.childDk, -w * 0.12, 0, 0.5);
  for (let i = 0; i < 4; i++) shape(c, () => rrect(c, x - w / 2 + (i * w) / 4, y - h / 2, w / 4, h * 0.5, w * 0.1), skin, 5);
  shape(c, () => ell(c, x - w * 0.02, y + h * 0.13, w * 0.42, h * 0.13, -0.08), skin, 5);
};
// a plastic bottle, bottom centre (x, bot); water = y of the water surface or undefined if empty
const BW = 140, BNW = 48, BBODY = 520, BH = 720;
const bottle = (c: Ctx, x: number, bot: number, water?: number) => {
  shadow(c, x + 36, bot + 8, BW * 0.95, 20);
  const path = () => {
    c.moveTo(x - BW, bot - 30); c.lineTo(x - BW, bot - BBODY); c.bezierCurveTo(x - BW, bot - BBODY - 70, x - BNW, bot - BBODY - 50, x - BNW, bot - BBODY - 120);
    c.lineTo(x - BNW, bot - BH + 30); c.lineTo(x + BNW, bot - BH + 30); c.lineTo(x + BNW, bot - BBODY - 120);
    c.bezierCurveTo(x + BNW, bot - BBODY - 50, x + BW, bot - BBODY - 70, x + BW, bot - BBODY); c.lineTo(x + BW, bot - 30);
    c.quadraticCurveTo(x + BW, bot, x + BW - 30, bot); c.lineTo(x - BW + 30, bot); c.quadraticCurveTo(x - BW, bot, x - BW, bot - 30); c.closePath();
  };
  if (water !== undefined) {
    c.save(); c.beginPath(); path(); c.clip();
    c.fillStyle = COL.water; c.fillRect(x - BW - 5, water, 2 * BW + 10, bot - water + 5);
    c.fillStyle = COL.waterDk; c.globalAlpha = 0.4; c.fillRect(x + BW * 0.45, water, BW, bot - water + 5); c.globalAlpha = 1;
    c.beginPath(); ell(c, x, water, BW, 12); c.fillStyle = COL.drop; c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1; c.restore();
  }
  shape(c, path, COL.glass, 6);
  shade(c, path, COL.glassEdge, -34, 0, 0.3);
  shine(c, [[x - BW * 0.72, bot - BBODY + 30], [x - BW * 0.72, bot - 90]], 10);
  shape(c, () => rrect(c, x - BNW - 7, bot - BH, 2 * BNW + 14, 44, 10), COL.blue, 6);
};
// the paper tape strip down the front of the bottle
const bottleTape = (c: Ctx, x: number, bot: number) => shape(c, () => rrect(c, x - 95, bot - 545, 58, 505, 6), "#fff3c4", 5);
// a drawing pin: wide head at (x, y), shaft along (dx, dy) for len
const pin = (c: Ctx, x: number, y: number, dx: number, dy: number, len: number) => {
  line(c, [[x, y], [x + dx * len, y + dy * len]], 12, INK); line(c, [[x, y], [x + dx * len, y + dy * len]], 6, COL.steelDk);
  c.save(); c.translate(x, y); c.rotate(Math.atan2(dy, dx)); shape(c, () => rrect(c, -14, -34, 28, 68, 10), RED, 5); c.restore();
};

// ---------------------------------------------------------------- experiment 1: the sinking cup
// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c);
  // wooden board
  shadow(c, 540, 960, 440, 30);
  shape(c, () => rrect(c, 100, 850, 880, 90, 16), COL.wood);
  shade(c, () => rrect(c, 100, 850, 880, 90, 16), COL.woodDk, -60, 0, 0.5);
  line(c, [[170, 890], [400, 890]], 4, COL.woodDk); line(c, [[580, 908], [860, 908]], 4, COL.woodDk);
  cup(c, 540, 500, 1.6, { flip: true, coins: true });
  pin(c, 540, 400, 0, 1, 140);
  hand(c, 540, 255, Math.PI / 2, 2, SKIN.adult, CLOTH.adult);
  arrow(c, [[800, 260], [800, 410]]);
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c);
  potBack(c, 60, 660, 330, 860, 540);
  cup(c, 360, 680, 1.55, { water: 18, jet: 125, coins: true });
  potFront(c, 60, 660, 330, 860, 540);
  arrow(c, [[360, 190], [360, 290]]);
  phone(c, 740, 360, 240, 400, false, "00 00");
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c);
  potBack(c, 60, 560, 190, 650, 330);
  cup(c, 300, 575, 1.1, { rot: 0.12, water: 200, coins: true });
  potFront(c, 60, 560, 190, 650, 330);
  arrow(c, [[190, 235], [190, 310]]);
  phone(c, 650, 110, 240, 380, true, "00 42");
  hand(c, 925, 320, 2.6, 1.4);
  // the table of three tries
  shadow(c, 480, 1030, 340, 20);
  shape(c, () => rrect(c, 150, 700, 640, 320, 12), COL.paper);
  line(c, [[150, 807], [790, 807]], 4); line(c, [[150, 914], [790, 914]], 4); line(c, [[330, 700], [330, 1020]], 4);
  write(c, "1", 225, 735, 56); write(c, "2", 220, 842, 56); write(c, "3", 220, 949, 56);
  write(c, "42", 450, 735, 56); write(c, "41", 450, 842, 56);
  // pencil writing the third time
  const an = Math.PI - 0.3, d = [Math.cos(an), Math.sin(an)], tip = [470, 960], nx = -d[1], ny = d[0];
  const at = (t: number) => [tip[0] - d[0] * t, tip[1] - d[1] * t];
  line(c, [at(300), at(34)], 26, INK); line(c, [at(300), at(34)], 16, COL.yellow);
  shape(c, () => polyP(c, [at(0), [at(34)[0] + nx * 9, at(34)[1] + ny * 9], [at(34)[0] - nx * 9, at(34)[1] - ny * 9]]), COL.wood, 4);
  const w = at(300);
  hand(c, w[0] + 20, w[1] - 6, an, 1.5);
};

// ---------------------------------------------------------------- experiment 2: fists on the sky
const wall = (c: Ctx) => { c.fillStyle = "#f6e6c8"; c.fillRect(0, 0, 1080, 1080); };
const mark = (c: Ctx, x: number, y: number) => {
  shadow(c, x + 14, y + 80, 52, 14);
  shape(c, () => rrect(c, x - 45, y - 75, 90, 150, 6), WHITE, 5);
  shape(c, () => ell(c, x, y, 26, 26), RED, 5);
  tapeStrip(c, x, y - 78, 56, 20, 0.1);
};
// a person seen from behind, arm up with a fist held out towards the wall
const backPerson = (c: Ctx, x: number, y: number, h: number, adult: boolean) => {
  const skin = adult ? SKIN.adult : SKIN.child, cloth = adult ? CLOTH.adult : CLOTH.child, clothDk = adult ? CLOTH.adultDk : CLOTH.childDk;
  const head = h * 0.13, hip = y - h * 0.42, sh = y - h * 0.74, uw = h * 0.06, hy = sh - head * 1.05;
  shadow(c, x + h * 0.08, y + 4, h * 0.3, 18);
  for (const s of [-1, 1]) { const l = [[x + s * h * 0.05, hip], [x + s * h * 0.06, y]]; line(c, l, h * 0.075, INK); line(c, l, h * 0.075 - 10, "#6b5a8c"); }
  const arm = [[x - h * 0.11, sh + h * 0.03], [x - h * 0.16, sh + h * 0.22], [x - h * 0.15, sh + h * 0.4]];
  line(c, arm, uw + 10, INK); line(c, arm, uw, cloth); shape(c, () => ell(c, arm[2][0], arm[2][1] + 8, uw * 0.62, uw * 0.62), skin, 5);
  const body = () => rrect(c, x - h * 0.13, sh - h * 0.02, h * 0.26, hip - sh + h * 0.06, h * 0.06);
  shape(c, body, cloth); shade(c, body, clothDk, -h * 0.07, 0);
  shape(c, () => rrect(c, x - head * 0.35, sh - head * 0.5, head * 0.7, head * 0.7, 6), skin, 5);
  shape(c, () => ell(c, x - head * 0.98, hy + head * 0.15, head * 0.2, head * 0.3), skin, 4);
  shape(c, () => ell(c, x + head * 0.98, hy + head * 0.15, head * 0.2, head * 0.3), skin, 4);
  shape(c, () => ell(c, x, hy, head, head * 1.05), CLOTH.hair);
  if (!adult) for (const s of [-1, 1]) shape(c, () => ell(c, x + s * head * 0.95, hy + head * 0.75, head * 0.32, head * 0.5), CLOTH.hair, 4);
  const fx = x + h * 0.2, fy = hy - head * 0.2, a2 = [[x + h * 0.12, sh + h * 0.03], [fx, fy + h * 0.06]];
  line(c, a2, uw + 10, INK); line(c, a2, uw, cloth);
  fist(c, fx, fy, h * 0.13, false);
};
// setup.e2.0
const e2s0 = (c: Ctx) => {
  wall(c);
  c.fillStyle = "#e2cba3"; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 6);
  mark(c, 110, 420); mark(c, 970, 420);
  backPerson(c, 330, 1000, 520, false);
  backPerson(c, 690, 1000, 700, true);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  wall(c);
  mark(c, 70, 540); mark(c, 1010, 540);
  for (let i = 0; i < 5; i++) {
    const x = 200 + i * 170;
    shadow(c, x + 20, 720, 70, 14);
    fist(c, x, 540, 170);
    write(c, String(i + 1), x - 14, 300, 66, INK, 9);
  }
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  c.fillStyle = "#f6e6c8"; c.fillRect(0, 0, 1080, 1080);
  shape(c, () => rrect(c, 30, 30, 1020, 470, 30), "#fbf3e1", 5);
  shape(c, () => rrect(c, 30, 530, 1020, 520, 30), "#fbf3e1", 5);
  // top: tape across the knuckles, 8 cm
  fist(c, 540, 235, 270);
  const left = 405, per = 270 / 8, ty = 108;
  shape(c, () => rrect(c, left - 45, ty, per * 9 + 90, 62, 10), COL.yellow, 6);
  for (let i = 0; i <= 9; i++) line(c, [[left + i * per, ty], [left + i * per, ty + (i % 2 ? 14 : 22)]], 4);
  for (const i of [0, 2, 4, 6, 8]) write(c, String(i), left + i * per - 8, ty + 26, 28, INK, 5);
  write(c, "8 cm", 790, 80, 40, INK, 7);
  // bottom: a girl in profile, arm straight out, tape from her eye to her fist
  shadow(c, 450, 1010, 300, 18);
  for (const s of [0, 1]) { const l = [[225 + s * 36, 810], [225 + s * 36, 1010]]; line(c, l, 42, INK); line(c, l, 32, "#6b5a8c"); }
  const body = () => rrect(c, 180, 668, 100, 160, 30);
  shape(c, body, CLOTH.child); shade(c, body, CLOTH.childDk, -30, 0);
  shape(c, () => rrect(c, 218, 628, 36, 60, 8), SKIN.child, 5);
  shape(c, () => ell(c, 205, 600, 36, 44), CLOTH.hair, 4);
  shape(c, () => ell(c, 238, 580, 56, 58), SKIN.child);
  shape(c, () => { c.moveTo(184, 580); c.bezierCurveTo(184, 506, 292, 506, 294, 570); c.quadraticCurveTo(250, 545, 184, 580); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, 296, 596, 12, 14), SKIN.child, 5);
  shape(c, () => ell(c, 268, 580, 6, 8), INK, 0);
  const ar = [[240, 700], [640, 700]];
  line(c, ar, 54, INK); line(c, ar, 44, CLOTH.child);
  shape(c, () => rrect(c, 626, 664, 72, 72, 20), SKIN.child, 6);
  for (let i = 0; i < 3; i++) line(c, [[650 + i * 16, 668], [650 + i * 16, 700]], 3, SKIN.childDk);
  const t0 = [270, 584], t1 = [628, 690];
  line(c, [t0, t1], 34, INK); line(c, [t0, t1], 24, COL.yellow);
  for (let i = 1; i < 8; i++) { const u = i / 8, px = t0[0] + (t1[0] - t0[0]) * u, py = t0[1] + (t1[1] - t0[1]) * u; line(c, [[px, py - 12], [px, py + 12]], 3); }
  write(c, "50 cm", 440, 560, 44, INK, 7);
};

// ---------------------------------------------------------------- experiment 3: the draining bottle
const sink = (c: Ctx) => {
  shadow(c, 540, 1040, 480, 20);
  shape(c, () => rrect(c, 40, 640, 1000, 300, 24), COL.steelIn, 6);
};
const sinkLip = (c: Ctx) => { shape(c, () => rrect(c, 20, 935, 1040, 100, 30), COL.steel); shade(c, () => rrect(c, 20, 935, 1040, 100, 30), COL.steelDk, -40, -8, 0.4); };
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c);
  bottle(c, 420, 900);
  bottleTape(c, 420, 900);
  shape(c, () => ell(c, 560, 840, 8, 8), INK, 0);
  pin(c, 667, 840, -1, 0, 125);
  hand(c, 800, 840, Math.PI, 1.9, SKIN.adult, CLOTH.adult);
  arrow(c, [[930, 720], [790, 720]]);
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  ground(c);
  sink(c);
  // puddle where the jet lands
  shape(c, () => ell(c, 880, 915, 120, 18), COL.water, 4);
  bottle(c, 480, 925, 570);
  bottleTape(c, 480, 925);
  for (const y of [380, 480]) line(c, [[378, y], [450, y]], 6);
  shape(c, () => ell(c, 618, 860, 8, 8), INK, 0);
  const jet: number[][] = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; jet.push([620 + t * 260, 860 - 40 * t + 100 * t * t]); }
  line(c, jet, 20, COL.waterDk); line(c, jet, 12, COL.water);
  for (const [dx, dy] of [[-30, -34], [26, -50], [50, -20], [-6, -22]]) shape(c, () => ell(c, 880 + dx, 912 + dy, 7, 10), COL.drop, 3);
  sinkLip(c);
  // marker pen in the child's hand, tip on the tape at the water level
  line(c, [[230, 570], [380, 570]], 34, INK); line(c, [[230, 570], [380, 570]], 24, COL.purple);
  shape(c, () => polyP(c, [[378, 556], [378, 584], [408, 570]]), INK, 4);
  hand(c, 150, 570, 0, 1.8);
};
// setup.e3.2
const e3s2 = (c: Ctx) => {
  ground(c);
  const bx = 600, bot = 900, ys = [390, 520, 630, 720, 790, 845];
  // ruler on the left, 20 px to the centimetre, 0 level with the top mark
  shadow(c, 190, 910, 110, 18);
  shape(c, () => rrect(c, 110, 360, 120, 540, 10), COL.wood);
  for (let i = 0; i <= 25; i++) line(c, [[110, 390 + i * 20], [110 + (i % 5 ? 22 : 44), 390 + i * 20]], i % 5 ? 3 : 5);
  for (const n of [0, 5, 10, 15, 20]) write(c, String(n), 164, 390 + n * 20 - 14, 28, INK, 5);
  bottle(c, bx, bot);
  bottleTape(c, bx, bot);
  shape(c, () => ell(c, bx + BW - 4, 840, 8, 8), INK, 0);
  for (const y of ys) {
    line(c, [[230, y], [bx - 95, y]], 3, "rgba(43,35,64,0.28)");
    line(c, [[bx - 100, y], [bx - 32, y]], 6);
    shape(c, () => ell(c, 230, y, 10, 10), RED, 4);
  }
};

export const su_skyHistoryOfAstronomy = cards("sci.sky.history-of-astronomy.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
