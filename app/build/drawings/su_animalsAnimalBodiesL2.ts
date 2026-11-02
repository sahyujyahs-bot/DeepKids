import type { Ctx } from "./core";
import { BG, CLOTH, COL, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, person, polyP, rrect, shade, shadow, shape, shine, write, plate, leaf } from "./flatKit";

// ANIMAL BODIES L2 · set-up cards: the standing jump (girl, dupatta, tape) and the leaf press (steel tumbler on curry leaves)
const FLOOR = "#dccaa6", TILE = "#c6b28a";

// tiled floor from y0 down, lines running away to a point above the card
const floor = (c: Ctx, y0: number) => {
  c.fillStyle = FLOOR; c.fillRect(0, y0, 1080, 1080 - y0);
  c.save(); c.beginPath(); c.rect(0, y0, 1080, 1080 - y0); c.clip();
  const vy = y0 - 520;
  for (let i = -6; i <= 6; i++) line(c, [[540 + i * 70 * (520 / (1080 - vy)) * 1, y0], [540 + i * 260, 1080]], 3, TILE);
  for (const t of [60, 140, 240, 370]) line(c, [[0, y0 + t], [1080, y0 + t]], 3, TILE);
  c.restore();
  line(c, [[0, y0], [1080, y0]], 5);
};
// the dupatta laid across the floor: a pink band with a purple border and dots
const dupatta = (c: Ctx, yTop: number, yBot: number) => {
  const sk = 40;
  shape(c, () => polyP(c, [[90 + sk * 0.3, yTop], [990 - sk * 0.3, yTop], [1030, yBot], [50, yBot]]), COL.pink, 6);
  const yy = (u: number) => yTop + (yBot - yTop) * u;
  line(c, [[80, yy(0.2)], [1000, yy(0.2)]], 5, COL.purple); line(c, [[70, yy(0.8)], [1010, yy(0.8)]], 5, COL.purple);
  for (let i = 0; i < 13; i++) shape(c, () => ell(c, 120 + i * 70, yy(0.5), 9, 7), COL.yellow, 3);
};

// card 1: standing behind the line, hands on hips
const card10 = (c: Ctx) => {
  ground(c); floor(c, 650);
  dupatta(c, 800, 890);
  shadow(c, 570, 730, 170, 28);
  person(c, 540, 725, 640, { armL: [2.4, 0.9], armR: [0.74, 2.24] });
};

// a child seen from the side, feet at (x, y), b = 0 stiff knees .. 1 bent low; hands on hips
const sideGirl = (c: Ctx, x: number, y: number, h: number, b: number) => {
  const sh = h * 0.26, th = h * 0.26, tor = h * 0.27, hr = h * 0.12;
  const kx = x + b * 0.13 * h, ky = y - Math.sqrt(sh * sh - (b * 0.13 * h) ** 2);
  const ang = ((1 - b) * 90 + b * 18) * Math.PI / 180, hipx = kx - Math.cos(ang) * th, hipy = ky - Math.sin(ang) * th;
  const lean = b * 0.45, shx = hipx + Math.sin(lean) * tor, shy = hipy - Math.cos(lean) * tor;
  const hx = shx + Math.sin(lean) * hr * 1.0 + hr * 0.1, hy = shy - hr * 1.15;
  shadow(c, x + h * 0.08, y + 6, h * 0.3, h * 0.04);
  // shoe, then leg
  shape(c, () => ell(c, x + h * 0.06, y - h * 0.02, h * 0.1, h * 0.04), COL.greyDk, 5);
  const leg: number[][] = [[hipx, hipy], [kx, ky], [x, y - h * 0.03]];
  line(c, leg, h * 0.1, INK); line(c, leg, h * 0.1 - 10, "#6b5a8c");
  // body
  const body: number[][] = [[hipx, hipy], [shx, shy]];
  line(c, body, h * 0.2, INK); line(c, body, h * 0.2 - 10, CLOTH.child);
  // arm: shoulder, elbow out behind, hand on the hip
  const ex = (hipx + shx) / 2 - h * 0.13, ey = (hipy + shy) / 2, arm: number[][] = [[shx - h * 0.02, shy + h * 0.03], [ex, ey], [hipx + h * 0.05, hipy - h * 0.02]];
  line(c, arm, h * 0.065, INK); line(c, arm, h * 0.065 - 9, CLOTH.child);
  shape(c, () => ell(c, arm[2][0], arm[2][1], h * 0.04, h * 0.04), SKIN.child, 4);
  // head: hair behind, ponytail, face to the right
  shape(c, () => ell(c, hx - hr * 1.1, hy + hr * 0.5, hr * 0.38, hr * 0.7), CLOTH.hair, 4);
  shape(c, () => ell(c, hx, hy, hr, hr * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(hx + hr * 0.5, hy - hr * 0.9); c.bezierCurveTo(hx - hr * 1.3, hy - hr * 1.5, hx - hr * 1.3, hy + hr * 0.2, hx - hr * 0.5, hy + hr * 0.6); c.quadraticCurveTo(hx - hr * 0.1, hy - hr * 0.2, hx + hr * 0.95, hy - hr * 0.35); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, hx + hr * 0.45, hy + hr * 0.1, hr * 0.1, hr * 0.13), INK, 0);
  c.beginPath(); c.arc(hx + hr * 0.45, hy + hr * 0.4, hr * 0.25, 0.3, Math.PI * 0.75); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// card 2: the same girl three times: stiff, small bend, big bend
const card11 = (c: Ctx) => {
  ground(c); floor(c, 700);
  sideGirl(c, 170, 860, 560, 0);
  sideGirl(c, 520, 860, 560, 0.5);
  sideGirl(c, 860, 860, 560, 1);
};

// card 3: floor from above, dupatta at the left, tape to the heel mark, coin beside it
const foot = (c: Ctx, x: number, y: number) => {
  shape(c, () => ell(c, x + 105, y, 110, 46), SKIN.child, 6);
  shape(c, () => ell(c, x + 12, y, 36, 42), SKIN.child, 6);
  [[205, -26, 16], [228, -10, 14], [236, 8, 13], [228, 24, 12], [212, 38, 11]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx - 10, y + dy - 6, r, r), SKIN.child, 4));
};
const card12 = (c: Ctx) => {
  ground(c, FLOOR);
  for (let i = 1; i < 6; i++) { line(c, [[i * 180, 0], [i * 180, 1080]], 3, TILE); line(c, [[0, i * 180], [1080, i * 180]], 3, TILE); }
  // dupatta
  shape(c, () => rrect(c, 40, 150, 120, 780, 6), COL.pink, 6);
  line(c, [[62, 160], [62, 920]], 5, COL.purple); line(c, [[138, 160], [138, 920]], 5, COL.purple);
  for (let i = 0; i < 8; i++) shape(c, () => ell(c, 100, 215 + i * 90, 8, 8), COL.yellow, 3);
  // feet landed
  foot(c, 705, 380); foot(c, 700, 700);
  // tape, 0 at the dupatta edge
  shadow(c, 450, 565, 290, 40);
  shape(c, () => rrect(c, 160, 505, 560, 70, 6), COL.yellow, 6);
  for (let i = 0; i <= 5; i++) { const tx = 160 + i * 108; line(c, [[tx, 505], [tx, 505 + 26]], 5); if (i) write(c, String(i * 20), tx - (i > 4 ? 56 : 26), 535, 30, INK, 5); else write(c, "0", tx + 12, 535, 30, INK, 5); }
  for (let i = 0; i < 25; i++) line(c, [[160 + i * 21.6, 505], [160 + i * 21.6, 505 + 12]], 3);
  // coin beside the heel
  shadow(c, 664, 800, 50, 14);
  shape(c, () => ell(c, 655, 775, 48, 40), COL.steel, 6); shape(c, () => ell(c, 655, 775, 30, 24), COL.steelIn, 4);
  arrow(c, [[200, 450], [670, 450]]);
};

// a steel tumbler upside down: base on top (narrow), open rim below (wide), centre x, rim at rimY
const tumbler = (c: Ctx, x: number, rimY: number, topY: number, rimR: number, topR: number) => {
  const body = () => { c.moveTo(x - topR, topY); c.lineTo(x + topR, topY); c.lineTo(x + rimR, rimY); c.ellipse(x, rimY, rimR, rimR * 0.22, 0, 0, Math.PI); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, rimR * 0.5, 0, 0.6);
  shape(c, () => ell(c, x, topY, topR, topR * 0.22), COL.steelIn, 5);
  shine(c, [[x - rimR * 0.7, rimY - 20], [x - topR * 0.75, topY + 30]], 10);
};
// card 4: four curry leaves on a steel plate, tumbler upside down beside
const card20 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 450, 300);
  leaf(c, 140, 480, 250, -0.3); leaf(c, 150, 660, 250, 0.25);
  leaf(c, 350, 430, 250, -0.9); leaf(c, 350, 720, 250, 0.7);
  shadow(c, 800, 700, 170, 34);
  tumbler(c, 790, 700, 420, 170, 130);
};
// the leaf lying on the plate, the tumbler standing on it, a flat hand on top
const pressScene = (c: Ctx, smear: boolean) => {
  ground(c);
  shape(c, () => ell(c, 540, 840, 500, 190), COL.steel);
  shape(c, () => ell(c, 540, 830, 420, 150), COL.steelIn, 4);
  if (smear) {
    c.globalAlpha = 0.55; shape(c, () => ell(c, 540, 905, 260, 28), COL.leaf, 0); shape(c, () => ell(c, 250, 860, 70, 22), COL.leaf, 0); shape(c, () => ell(c, 830, 880, 80, 22), COL.leaf, 0); c.globalAlpha = 1;
  }
  leaf(c, 250, 820, 590, -0.02);
  tumbler(c, 540, 800, 380, 135, 105);
  hand(c, 440, 312, 0, 2, SKIN.child, CLOTH.child, true);
};
const card21 = (c: Ctx) => {
  pressScene(c, false);
  arrow(c, [[860, 600], [860, 440]]); arrow(c, [[860, 600], [860, 760]]);
};
const card22 = (c: Ctx) => {
  pressScene(c, true);
  const pts: number[][] = []; for (let a = 0.15; a <= 0.9; a += 0.05) pts.push([540 - Math.cos(a * Math.PI) * 300, 800 + Math.sin(a * Math.PI) * 95]);
  arrow(c, pts.reverse());
};

export const su_animalsAnimalBodiesL2 = cards("sci.animals.animal-bodies.L2 set-up", [card10, card11, card12, card20, card21, card22]);
