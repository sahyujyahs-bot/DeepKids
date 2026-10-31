import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rnd, rrect, shade, shadow, shape, shine, write } from "./flatKit";

// GROWING OLD · experiment set-up cards for sci.body.growing-old.L3 (skin pinch, near point, hearing test)

// ---------------------------------------------------------------- shared pieces
const SKIN_LT = "#c98a60";
// the back of a child's left hand lying palm down, fingers to the right; wrist at (x, y), s = size
const restHand = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadow(c, 20, 135, 330, 40);
  shape(c, () => rrect(c, -340, -112, 130, 224, 24), CLOTH.child);
  shade(c, () => rrect(c, -340, -112, 130, 224, 24), CLOTH.childDk, 30, 0);
  const lens = [250, 285, 270, 215];
  for (let k = 0; k < 4; k++) {
    const fy = -104 + k * 54, len = lens[k], fin = () => rrect(c, 20, fy, len, 46, 23);
    shape(c, fin, SKIN.child, 6);
    shade(c, fin, SKIN.childDk, 0, 12, 0.35);
    shape(c, () => rrect(c, 20 + len - 62, fy + 6, 44, 34, 15), "#e7b8a0", 4);
  }
  shape(c, () => rrect(c, -150, 70, 220, 62, 31), SKIN.child, 6);
  const back = () => rrect(c, -232, -108, 290, 216, 48);
  shape(c, back, SKIN.child, 6);
  shade(c, back, SKIN.childDk, 0, 20, 0.35);
  for (let k = 0; k < 4; k++) line(c, [[40, -104 + k * 54 + 23], [-120, -60 + k * 40]], 3, SKIN.childDk);
  c.restore();
};
// a raised fold of skin on the back of the hand, centred (x, y); wide = across the fold
const skinFold = (c: Ctx, x: number, y: number, wide: number) => {
  shape(c, () => ell(c, x + 6, y + 22, wide, 30, -0.5), SKIN.childDk, 0);
  shape(c, () => ell(c, x, y, wide, 34, -0.5), SKIN_LT, 6);
  for (const k of [-1, 1]) line(c, [[x + k * wide * 0.85 - 20, y + 60], [x + k * wide * 0.85 + 16, y + 84]], 4, SKIN.childDk);
  for (const k of [-1, 1]) line(c, [[x + k * wide * 1.1, y - 40 - k * 6], [x + k * wide * 1.3, y - 62 - k * 8]], 4, SKIN.childDk);
};
// a hand pinching between thumb and forefinger: the two fingertips meet at (tx, ty), the hand comes from behind along angle an
const pinchHand = (c: Ctx, tx: number, ty: number, an: number, s = 1.4, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  const dk = skin === SKIN.child ? SKIN.childDk : SKIN.adultDk, sl = sleeve === CLOTH.child ? CLOTH.childDk : CLOTH.adultDk;
  c.save(); c.translate(tx, ty); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -430, -78, 150, 160, 20), sleeve, 6);
  shade(c, () => rrect(c, -430, -78, 150, 160, 20), sl, 0, 30, 0.6);
  for (const k of [0, 1, 2]) shape(c, () => rrect(c, -250 + k * 6, -80 + k * 30, 120, 40, 20), skin, 5);
  shape(c, () => ell(c, -230, 8, 85, 80), skin, 6);
  const fing = (a: number[], b: number[], w: number) => { line(c, [a, b], w + 10, INK); line(c, [a, b], w, skin); };
  fing([-220, -34], [-12, -9], 38); fing([-190, 46], [-14, 10], 40);
  line(c, [[-120, -40], [-60, -24]], 3, dk);
  c.restore();
};
// a pencil: tip at (tx, ty), pointing along angle an (from the hand towards the tip); k = size
const pencil = (c: Ctx, tx: number, ty: number, an: number, k = 1) => {
  c.save(); c.translate(tx, ty); c.rotate(an); c.scale(k, k);
  const len = 300;
  shape(c, () => polyP(c, [[0, 0], [-60, -17], [-60, 17]]), "#f2d9b0", 5);
  shape(c, () => polyP(c, [[0, 0], [-16, -5], [-16, 5]]), INK, 2);
  const body = () => rrect(c, -len, -17, len - 60, 34, 4);
  shape(c, body, COL.yellow, 5);
  shade(c, body, COL.woodDk, 0, 9, 0.5);
  shape(c, () => rrect(c, -len - 26, -17, 30, 34, 8), COL.pink, 5);
  c.restore();
};
// a hand holding a pencil whose tip is at (tx, ty); s = size of hand and pencil
const penHand = (c: Ctx, tx: number, ty: number, an: number, s = 1.3) => {
  pencil(c, tx, ty, an, s);
  const d = (140 + 70) * s;
  hand(c, tx - Math.cos(an) * d, ty - Math.sin(an) * d, an, s);
};
// a phone lying face up, centre (x, y); draws the screen with fn(screen centre)
const phone = (c: Ctx, x: number, y: number, w: number, h: number, screen: (c: Ctx, w: number, h: number) => void) => {
  shadow(c, x + w * 0.1, y + h / 2 + 8, w * 0.6, h * 0.08);
  shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, 36), "#34323f", 7);
  shape(c, () => rrect(c, x - w / 2 + 14, y - h / 2 + 22, w - 28, h - 44, 18), "#22303a", 4);
  c.save(); c.translate(x, y); screen(c, w - 28, h - 44); c.restore();
};
// a timer screen: dots between two digit pairs, like 0:03
const timerScreen = (digits: string, running: boolean) => (c: Ctx, w: number, h: number) => {
  const dh = h * 0.3;
  write(c, digits, -w * 0.4 + 6, -dh * 0.8, dh, "#c9f06b", 11);
  shape(c, () => { c.arc(0, h * 0.28, h * 0.1, 0, 7); }, running ? COL.green : RED, 4);
  if (running) shape(c, () => polyP(c, [[-8, h * 0.22], [-8, h * 0.34], [10, h * 0.28]]), WHITE, 0);
  else shape(c, () => rrect(c, -9, h * 0.28 - 9, 18, 18, 3), WHITE, 0);
};
const closeEyes = (c: Ctx, x: number, y: number, h: number, adult: boolean, sit = false) => {
  const sh = sit ? y - h * 0.06 - h * 0.32 : y - h * 0.74, head = h * 0.13, hy = sh - head * 1.05, skin = adult ? SKIN.adult : SKIN.child;
  for (const s of [-1, 1]) {
    const ex = x + s * head * 0.35, ey = hy + head * 0.12;
    shape(c, () => ell(c, ex, ey, head * 0.2, head * 0.2), skin, 0);
    c.beginPath(); c.arc(ex, ey - head * 0.04, head * 0.17, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
  }
};
// grey hair and a moustache over a grown-up: the grandfather
const grandpa = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, sh = y - h * 0.74, hy = sh - head * 1.05;
  shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, "#e6e3dc", 5);
  shape(c, () => ell(c, x, hy + head * 0.3, head * 0.42, head * 0.1), "#e6e3dc", 4);
};
const wall = (c: Ctx) => { ground(c); c.fillStyle = "#f6efe0"; c.fillRect(0, 0, 1080, 560); };
// a low table seen from the front: top surface and front, top edge at y = 540
const table = (c: Ctx) => {
  shadow(c, 560, 1020, 480, 40);
  shape(c, () => polyP(c, [[70, 540], [1010, 540], [1050, 800], [30, 800]]), COL.wood);
  shape(c, () => polyP(c, [[30, 800], [1050, 800], [1050, 1040], [30, 1040]]), COL.woodDk);
  line(c, [[120, 600], [260, 590]], 3, COL.woodDk); line(c, [[820, 740], [960, 732]], 3, COL.woodDk);
};
// the phone lying on the table in perspective, with a tone-generator screen
const tablePhone = (c: Ctx) => {
  const P = [[400, 585], [680, 585], [735, 775], [345, 775]];
  shape(c, () => polyP(c, P), "#34323f", 7);
  shape(c, () => polyP(c, [[415, 600], [665, 600], [708, 760], [372, 760]]), "#22303a", 4);
  const wv: number[][] = []; for (let i = 0; i <= 40; i++) { const u = i / 40; wv.push([440 + u * 200 - u * 0 + (u - 0.5) * 12, 660 + Math.sin(u * Math.PI * 4) * 22]); }
  line(c, wv, 8, "#c9f06b");
  line(c, [[410, 730], [670, 730]], 7, "#5b6670"); shape(c, () => ell(c, 470, 730, 14, 14), WHITE, 4);
};
const circleFrame = (c: Ctx, x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, 7); };

// ---------------------------------------------------------------- the cards
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  restHand(c, 400, 740, 1.1);
  skinFold(c, 312, 716, 62);
  pinchHand(c, 312, 700, 2.0, 1.3);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  restHand(c, 330, 700, 1.1);
  skinFold(c, 242, 676, 62);
  phone(c, 850, 330, 270, 440, timerScreen("03", true));
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  restHand(c, 320, 250, 0.8);
  phone(c, 880, 240, 250, 380, timerScreen("04", false));
  shadow(c, 450, 990, 380, 36);
  shape(c, () => polyP(c, [[110, 470], [790, 470], [790, 980], [110, 980]]), COL.paper);
  for (const y of [640, 810]) line(c, [[110, y], [790, y]], 5);
  line(c, [[400, 470], [400, 980]], 5);
  write(c, "1", 235, 520, 80); write(c, "2", 235, 690, 80); write(c, "3", 235, 860, 80);
  write(c, "6", 560, 520, 80); write(c, "5", 560, 690, 80);
  write(c, "4", 560, 860, 80, RED, 9);
  penHand(c, 620, 930, 2.5);
};
// setup.e2.0
const printCard = (c: Ctx, x: number, y: number, w: number, h: number, crisp: boolean) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.paper, 6);
  const r = rnd(5);
  for (let row = 0; row < 7; row++) {
    let px = x + 18; const py = y + 22 + row * ((h - 44) / 6.5);
    while (px < x + w - 40) {
      const dw = 8 + r() * 18;
      if (crisp) { c.fillStyle = INK; c.fillRect(px, py, dw, 6); } else { c.fillStyle = "rgba(43,35,64,0.18)"; c.fillRect(px - 2, py - 5, dw + 4, 15); }
      px += dw + 8;
    }
  }
};
const e2_0 = (c: Ctx) => {
  ground(c);
  const x = 270, y = 1010, h = 780;
  person(c, x, y, h, { armR: [-0.05, -0.05] });
  const wx = x + h * 0.11 + h * 0.33, wy = y - h * 0.74 + h * 0.03;
  printCard(c, wx + 70, wy - 170, 240, 340, true);
  hand(c, wx - 20, wy, 0, 1.5);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const x = 270, y = 1010, h = 780;
  person(c, x, y, h, { armR: [0.5, -1.15] });
  const sh = y - h * 0.74 + h * 0.03, ex = x + h * 0.11 + Math.cos(0.5) * h * 0.17, ey = sh + Math.sin(0.5) * h * 0.17, wx = ex + Math.cos(-1.15) * h * 0.16, wy = ey + Math.sin(-1.15) * h * 0.16;
  printCard(c, wx + 40, wy - 250, 240, 340, false);
  hand(c, wx - 30, wy - 20, -0.15, 1.5);
  arrow(c, [[1040, 350], [880, 350]]);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 300, 1040, 220, 30);
  shape(c, () => rrect(c, 40, 780, 500, 400, 120), CLOTH.child);
  shape(c, () => rrect(c, 210, 600, 140, 240, 30), SKIN.child);
  const head = () => ell(c, 280, 420, 190, 205);
  shape(c, head, SKIN.child); shade(c, head, SKIN.childDk, 40, 20, 0.5);
  shape(c, () => polyP(c, [[455, 400], [520, 478], [452, 495]]), SKIN.child, 6);
  shape(c, () => { c.moveTo(95, 420); c.bezierCurveTo(70, 140, 470, 130, 465, 360); c.quadraticCurveTo(360, 280, 240, 300); c.quadraticCurveTo(140, 310, 95, 420); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 220, 430, 30, 46), SKIN.childDk, 5);
  shape(c, () => ell(c, 385, 400, 12, 16), INK, 0);
  c.beginPath(); c.arc(395, 545, 36, 0.4, 1.6); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shape(c, () => ell(c, 395, 480, 40, 18), "rgba(240,150,150,0.5)", 0);
  // the card, held up from below by the child's hand
  printCard(c, 800, 420, 230, 360, true);
  hand(c, 915, 930, -Math.PI / 2, 1.6);
  // measuring tape from the cheekbone to the card
  shape(c, () => rrect(c, 390, 505, 440, 54, 4), COL.yellow, 6);
  for (let i = 0; i <= 25; i++) { const tx = 400 + i * (420 / 25); line(c, [[tx, 505], [tx, 505 + (i % 5 === 0 ? 26 : 14)]], i % 5 === 0 ? 4 : 2.5); }
  write(c, "25 cm", 580, 430, 50, INK, 7);
  // the parent's hand holds the tape end on the cheekbone
  pinchHand(c, 405, 556, -2.3, 1.1, SKIN.adult, CLOTH.adult);
};
// setup.e3.0
const sitting = (c: Ctx) => {
  wall(c);
  const H = 600, Y = 760;
  person(c, 230, Y, H, {}); closeEyes(c, 230, Y, H, false);
  person(c, 540, Y, H, { adult: true }); closeEyes(c, 540, Y, H, true);
  person(c, 850, Y, H, { adult: true }); grandpa(c, 850, Y, H); closeEyes(c, 850, Y, H, true);
  table(c); tablePhone(c);
};
const e3_0 = (c: Ctx) => { sitting(c); };
// setup.e3.1
const e3_1 = (c: Ctx) => {
  wall(c);
  const H = 600, Y = 760;
  person(c, 230, Y, H, { armR: [-1.0, -1.5] }); closeEyes(c, 230, Y, H, false);
  person(c, 540, Y, H, { adult: true, armR: [1.1, 1.45] }); closeEyes(c, 540, Y, H, true);
  person(c, 850, Y, H, { adult: true }); grandpa(c, 850, Y, H); closeEyes(c, 850, Y, H, true);
  // the child's raised hand
  const sh = Y - H * 0.74 + H * 0.03, ex = 230 + H * 0.11 + Math.cos(-1.0) * H * 0.17, ey = sh + Math.sin(-1.0) * H * 0.17, wx = ex + Math.cos(-1.5) * H * 0.16, wy = ey + Math.sin(-1.5) * H * 0.16;
  hand(c, wx, wy + 10, -1.57, 1.2, SKIN.child, CLOTH.child, true);
  table(c); tablePhone(c);
  // the parent's finger taps the screen
  hand(c, 663, 525, 1.45, 1.6, SKIN.adult, CLOTH.adult, true);
  for (const r of [34, 58]) { c.beginPath(); c.arc(668, 700, r, 0, 7); c.strokeStyle = WHITE; c.lineWidth = 5; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1; }
};
// setup.e3.2
const wave = (c: Ctx, x: number, y: number, w: number, amp: number, cyc: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 50; i++) { const u = i / 50; pts.push([x + u * w, y + Math.sin(u * Math.PI * 2 * cyc) * amp]); }
  line(c, pts, 9, INK);
};
const miniHead = (c: Ctx, x: number, y: number, r: number, skin: string, hair: string) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), skin);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, hair, 5);
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
};
const e3_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 470, 870, 400, 40);
  shape(c, () => rrect(c, 100, 140, 740, 700, 10), COL.paper, 7);
  for (const x of [270, 450, 630]) line(c, [[x, 140], [x, 840]], 5);
  for (const y of [290, 450, 610]) line(c, [[100, y], [840, y]], 5);
  wave(c, 300, 215, 120, 22, 1.5); wave(c, 480, 215, 120, 34, 3); wave(c, 660, 215, 120, 18, 6);
  miniHead(c, 185, 375, 46, SKIN.child, CLOTH.hair);
  miniHead(c, 185, 535, 46, SKIN.adult, CLOTH.hair);
  miniHead(c, 185, 695, 46, SKIN.adult, "#e6e3dc");
  const tick = (cx: number, cy: number) => line(c, [[cx - 30, cy], [cx - 8, cy + 26], [cx + 34, cy - 30]], 14, COL.greenDk);
  for (const [i, j] of [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1]]) tick(360 + j * 180, 375 + i * 160 + (i === 0 ? 5 : 0));
  penHand(c, 700, 690, -2.6, 1.1);
};

export const su_bodyGrowingOld = cards("sci.body.growing-old.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
