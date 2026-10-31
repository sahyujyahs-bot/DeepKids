import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, BG, WHITE, RED, D, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, hand, write, cards, rnd } from "./flatKit";

// ---------------------------------------------------------------- shared pieces for this unit
const DOG = { fur: "#c98a4b", furDk: "#9c6636", belly: "#f0d3a6", ear: "#7e4f2b" };
const DOSA = "#e3a652", DOSA_DK = "#c0822f";

// a stone: lumpy grey oval with a shade side
const stone = (c: Ctx, x: number, y: number, rx: number, ry: number, rot = 0, col = COL.grey, dk = COL.greyDk) => {
  shape(c, () => ell(c, x, y, rx, ry, rot), col, 5);
  shade(c, () => ell(c, x, y, rx, ry, rot), dk, rx * 0.3, ry * 0.3);
  line(c, [[x - rx * 0.5, y - ry * 0.35], [x - rx * 0.15, y - ry * 0.6]], 4, WHITE);
};
// a strip of tape across a glass at height y
const tape = (c: Ctx, x: number, yb: number, w: number, h: number, y: number) => {
  const top = w / 2, bot = w * 0.4, half = bot + (top - bot) * ((yb - y) / h);
  shape(c, () => rrect(c, x - half - 4, y - 9, half * 2 + 8, 18, 4), COL.orange, 4);
};
// a white thermocol piece (rough block with specks)
const thermo = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, h * 0.3), WHITE, 5);
  shade(c, () => rrect(c, -w / 2, -h / 2, w, h, h * 0.3), "#d8d4cb", w * 0.12, h * 0.25);
  for (const [u, v] of [[-0.25, -0.1], [0.1, 0.15], [0.3, -0.15]]) { c.beginPath(); ell(c, u * w, v * h, 2.5, 2.5); c.fillStyle = COL.grey; c.fill(); }
  c.restore();
};
// the thermocol "worm": a white segmented body with two dot eyes, floating at the water line
const worm = (c: Ctx, x: number, y: number) => {
  c.save(); c.translate(x, y); c.scale(1.7, 1.7); c.translate(-x, -y);
  for (let i = 0; i < 4; i++) shape(c, () => ell(c, x - 54 + i * 36, y - 22 - (i === 3 ? 8 : 0), 24, 22), WHITE, 5);
  shade(c, () => ell(c, x + 18, y - 22, 24, 22), "#d8d4cb", 8, 8);
  c.beginPath(); ell(c, x + 96, y - 36, 4, 4); c.fillStyle = INK; c.fill(); c.beginPath(); ell(c, x + 84, y - 36, 4, 4); c.fill();
  c.restore();
};
// the tray under the glass
const tray = (c: Ctx, x0: number, x1: number, y: number) => {
  shadow(c, (x0 + x1) / 2 + 20, y + 100, (x1 - x0) / 2, 22);
  shape(c, () => rrect(c, x0, y, x1 - x0, 90, 26), COL.teal);
  shape(c, () => rrect(c, x0 + 26, y + 18, x1 - x0 - 52, 46, 18), COL.tealDk, 4);
};
// a table top across the card from y down
const table = (c: Ctx, y: number) => {
  shape(c, () => polyP(c, [[-10, y], [D + 10, y], [D + 10, D + 10], [-10, D + 10]]), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(-10, y + 8, D + 20, 12);
  line(c, [[-10, y], [D + 10, y]], 6);
};
// a mirrored hand, pointing left
const handL = (c: Ctx, x: number, y: number, s: number, sleeve: string = CLOTH.child, skin: string = SKIN.child, an = 0) => {
  c.save(); c.translate(x, 0); c.scale(-1, 1); hand(c, 0, y, an, s, skin, sleeve); c.restore();
};
// an upside-down steel cup, base centre (x, y), rim width w, height h
const cup = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const tw = w * 0.82, body = () => { c.moveTo(x - w / 2, y); c.lineTo(x - tw / 2, y - h); c.lineTo(x + tw / 2, y - h); c.lineTo(x + w / 2, y); c.quadraticCurveTo(x, y + w * 0.2, x - w / 2, y); c.closePath(); };
  shadow(c, x + w * 0.12, y + w * 0.06, w * 0.62, w * 0.12);
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, tw / 2, w * 0.07), COL.steelIn, 5);
  shine(c, [[x - tw * 0.38, y - h * 0.8], [x - w * 0.4, y - h * 0.15]], 8);
};
const coin = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r * 0.9), COL.yellow, 5);
  shape(c, () => ell(c, x, y, r * 0.6, r * 0.52), COL.orange, 3);
};
// three cups in a row on a table with the third tipped up at its left edge; coin slides under it
const CUPX = [290, 510, 730], CUPY = 880, CUPW = 190, CUPH = 230;
const cupRow = (c: Ctx, lift = true) => {
  cup(c, CUPX[0], CUPY, CUPW, CUPH); cup(c, CUPX[1], CUPY, CUPW, CUPH);
  if (!lift) { cup(c, CUPX[2], CUPY, CUPW, CUPH); return; }
  const px = CUPX[2] - CUPW / 2;
  c.save(); c.translate(px, CUPY); c.rotate(-0.3); c.translate(-px, -CUPY); cup(c, CUPX[2], CUPY, CUPW, CUPH); c.restore();
};
// a head and shoulders behind a table. eye: shut | open | back (we see the back of the head)
type Bust = { adult?: boolean; eye?: "shut" | "open" | "back"; gx?: number; gy?: number };
const bust = (c: Ctx, x: number, hy: number, hr: number, bodyTo: number, o: Bust = {}) => {
  const ad = !!o.adult, skin = ad ? SKIN.adult : SKIN.child, skinDk = ad ? SKIN.adultDk : SKIN.childDk, cloth = ad ? CLOTH.adult : CLOTH.child, clothDk = ad ? CLOTH.adultDk : CLOTH.childDk;
  const sh = () => rrect(c, x - hr * 1.9, hy + hr * 1.05, hr * 3.8, bodyTo - hy - hr * 1.05 + 60, hr * 0.9);
  shape(c, () => rrect(c, x - hr * 0.32, hy + hr * 0.7, hr * 0.64, hr * 0.7, 10), skinDk);
  shape(c, sh, cloth); shade(c, sh, clothDk, hr * 0.5, 0);
  const eye = o.eye ?? "open";
  if (eye === "back") {
    for (const s of [-1, 1]) shape(c, () => ell(c, x + s * hr * 1.0, hy + hr * 0.1, hr * 0.16, hr * 0.26), skin, 5);
    shape(c, () => ell(c, x, hy, hr, hr * 1.05), CLOTH.hair);
    shade(c, () => ell(c, x, hy, hr, hr * 1.05), "#000000", hr * 0.3, hr * 0.2, 0.25);
    line(c, [[x - hr * 0.45, hy - hr * 0.65], [x - hr * 0.2, hy - hr * 0.85]], 6, "#5a4d7a");
    return;
  }
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * hr * 1.0, hy + hr * 0.1, hr * 0.16, hr * 0.26), skin, 5);
  shape(c, () => ell(c, x, hy, hr, hr * 1.05), skin);
  shape(c, () => { c.moveTo(x - hr * 1.03, hy + hr * 0.05); c.bezierCurveTo(x - hr, hy - hr * 1.5, x + hr, hy - hr * 1.5, x + hr * 1.03, hy + hr * 0.05); c.quadraticCurveTo(x, hy - hr * 0.55, x - hr * 1.03, hy + hr * 0.05); c.closePath(); }, CLOTH.hair, 5);
  if (!ad) shape(c, () => ell(c, x + hr * 0.95, hy - hr * 0.35, hr * 0.3, hr * 0.5), CLOTH.hair, 4);
  for (const s of [-1, 1]) {
    const ex = x + s * hr * 0.4, ey = hy + hr * 0.12;
    if (eye === "shut") { c.beginPath(); c.arc(ex, ey - hr * 0.04, hr * 0.2, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
    else { shape(c, () => ell(c, ex, ey, hr * 0.2, hr * 0.24), WHITE, 4); shape(c, () => ell(c, ex + (o.gx ?? 0) * hr * 0.06, ey + (o.gy ?? 0) * hr * 0.06, hr * 0.11, hr * 0.13), INK, 0); }
  }
  c.beginPath(); c.arc(x, hy + hr * 0.42, hr * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// a hand with one finger pointing, wrist at (x, y), pointing at angle an, size s
const pointHand = (c: Ctx, x: number, y: number, an: number, s = 1, skin: string = SKIN.child, sleeve: string = CLOTH.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  const dk = skin === SKIN.child ? SKIN.childDk : SKIN.adultDk;
  shape(c, () => rrect(c, -78, -38, 56, 76, 14), sleeve, 6);
  shape(c, () => { c.moveTo(-26, -34); c.quadraticCurveTo(20, -44, 56, -32); c.lineTo(60, 34); c.quadraticCurveTo(10, 44, -26, 34); c.closePath(); }, skin, 6);
  for (let k = 0; k < 3; k++) shape(c, () => rrect(c, 40, -6 + k * 16, 36, 17, 8.5), skin, 5);
  shape(c, () => rrect(c, 40, -32, 140, 24, 12), skin, 5);
  line(c, [[24, -16], [34, -6]], 3, dk);
  shape(c, () => { c.moveTo(-4, 30); c.quadraticCurveTo(22, 60, 52, 50); c.quadraticCurveTo(64, 44, 50, 32); c.quadraticCurveTo(26, 32, 12, 18); c.closePath(); }, skin, 5);
  c.restore();
};
// an upside-down steel bowl on the floor, base centre (x, y), base radius r
const domeBowl = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.15, x + r, y - r * 1.15, x + r, y); c.ellipse(x, y, r, r * 0.2, 0, 0, Math.PI); c.closePath(); };
  shadow(c, x + r * 0.15, y + r * 0.05, r * 1.05, r * 0.2);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, r * 0.4, 0);
  shine(c, [[x - r * 0.65, y - r * 0.5], [x - r * 0.4, y - r * 0.82]], 9);
};
// a piece of dosa: a golden folded wedge
const dosa = (c: Ctx, x: number, y: number, s: number) => {
  const p = () => { c.moveTo(x - 50 * s, y + 10 * s); c.quadraticCurveTo(x, y - 60 * s, x + 56 * s, y + 6 * s); c.quadraticCurveTo(x, y + 30 * s, x - 50 * s, y + 10 * s); c.closePath(); };
  shape(c, p, DOSA); shade(c, p, DOSA_DK, 8 * s, 10 * s); line(c, [[x - 26 * s, y - 6 * s], [x + 20 * s, y - 14 * s]], 4, DOSA_DK);
};
// a dog, ground point (x, y), size s, dir 1 = faces right, -1 = faces left; down 0..1 lowers the head to the floor
const dog = (c: Ctx, x: number, y: number, s: number, dir: 1 | -1, pose: "stand" | "sit", down = 0) => {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const leg = (lx: number, top: number, col: string) => { shape(c, () => rrect(c, lx - 24, top, 48, -top, 20), col, 5); shape(c, () => ell(c, lx + 8, -12, 36, 18), DOG.belly, 5); };
  let hx: number, hy: number;
  if (pose === "stand") {
    hx = 190 + down * 40; hy = -290 + down * 150;
    line(c, [[-140, -215], [-205, -250], [-222, -325]], 34, INK); line(c, [[-140, -215], [-205, -250], [-222, -325]], 22, DOG.fur);
    leg(-85, -170, DOG.furDk); leg(120, -170, DOG.furDk);
    shape(c, () => ell(c, 0, -205, 160, 82), DOG.fur); shade(c, () => ell(c, 0, -205, 160, 82), DOG.furDk, 20, 36, 0.5);
    leg(-125, -165, DOG.fur); leg(80, -165, DOG.fur);
  } else {
    hx = 135; hy = -350;
    line(c, [[-120, -22], [-210, -30], [-250, -60]], 34, INK); line(c, [[-120, -22], [-210, -30], [-250, -60]], 22, DOG.fur);
    leg(112, -210, DOG.furDk);
    shape(c, () => ell(c, 10, -190, 95, 170, 0.22), DOG.fur); shade(c, () => ell(c, 10, -190, 95, 170, 0.22), DOG.furDk, 20, 20, 0.5);
    shape(c, () => ell(c, 20, -170, 55, 110, 0.22), DOG.belly, 0);
    shape(c, () => ell(c, -50, -75, 105, 78), DOG.fur); shade(c, () => ell(c, -50, -75, 105, 78), DOG.furDk, 20, 24, 0.5);
    shape(c, () => ell(c, -5, -14, 70, 22), DOG.belly, 5);
    leg(74, -215, DOG.fur);
  }
  if (pose === "stand") shape(c, () => { c.moveTo(30, -280); c.quadraticCurveTo(hx - 70, hy - 70, hx - 5, hy - 52); c.lineTo(hx + 35, hy + 52); c.quadraticCurveTo(170, -190, 140, -140); c.lineTo(40, -150); c.closePath(); }, DOG.fur, 5);
  else line(c, [[70, -300], [130, -250]], 26, COL.purple);
  shape(c, () => ell(c, hx, hy, 64, 60), DOG.fur);
  shape(c, () => ell(c, hx + 58, hy + 20, 50, 34), DOG.belly);
  shape(c, () => ell(c, hx + 102, hy + 10, 17, 13), INK, 0);
  line(c, [[hx + 70, hy + 38], [hx + 98, hy + 40]], 4);
  shape(c, () => ell(c, hx + 22, hy - 14, 10, 12), INK, 0);
  shape(c, () => ell(c, hx - 30, hy - 8, 28, 52, 0.25), DOG.ear, 5);
  c.restore();
};

// ---------------------------------------------------------------- cards
const GX = 540, GB = 868, GW = 400, GH = 560;

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  tray(c, 200, 880, 830);
  glass(c, GX, GB, GW, GH, 0.6);
  tape(c, GX, GB, GW, GH, GB - GH * 0.6);
  tape(c, GX, GB, GW, GH, GB - GH * 0.6 - 100);
  worm(c, GX - 40, GB - GH * 0.6 + 4);
  line(c, [[780, GB - GH * 0.6 - 100], [800, GB - GH * 0.6 - 100], [800, GB - GH * 0.6], [780, GB - GH * 0.6]], 6);
  write(c, "2 cm", 830, GB - GH * 0.6 - 78, 46, INK, 7);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  tray(c, 200, 880, 830);
  const ly = GB - GH * 0.74;
  glass(c, GX, GB, GW, GH, 0.74);
  stone(c, GX - 50, GB - 38, 78, 50, 0.1); stone(c, GX + 70, GB - 44, 70, 54, -0.2);
  tape(c, GX, GB, GW, GH, GB - GH * 0.6);
  tape(c, GX, GB, GW, GH, GB - GH * 0.6 - 100);
  worm(c, GX - 40, ly + 4);
  handL(c, 700, 135, 2.3, CLOTH.child, SKIN.child, 0.5);
  stone(c, 540, 215, 80, 60, 0.3);
  arrow(c, [[400, 130], [400, 250]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  tray(c, 20, 1060, 730);
  const xs = [190, 540, 890], yb = 770, w = 290, h = 400, ly = yb - h * 0.75, r = rnd(5);
  xs.forEach((x) => glass(c, x, yb, w, h, 0.75));
  stone(c, 140, yb - 44, 62, 44, 0.1); stone(c, 242, yb - 44, 60, 44, -0.2); stone(c, 192, yb - 100, 58, 42, 0.3);
  for (let row = 0; row < 4; row++) for (let i = 0; i < 6 - row; i++) stone(c, 540 - (5 - row) * 20 + i * 40 + r() * 6, yb - 24 - row * 38, 22, 18, r() * 3);
  xs.forEach((x) => tape(c, x, yb, w, h, ly));
  for (const [dx, dy, wd, rot] of [[-80, 0, 70, 0.1], [-10, -8, 76, -0.2], [66, -2, 66, 0.15], [-40, -34, 56, 0.4], [30, -38, 58, -0.3]] as number[][]) thermo(c, 890 + dx, ly + dy, wd, 44, rot);
  xs.forEach((x) => shine(c, [[x - w * 0.3, yb - h * 0.9], [x - w * 0.22, yb - h * 0.6]], 7));
};

// the cups for the coin cards: three big cups, the middle one tipped up at its right edge, a hand slipping the coin under
const coinScene = (c: Ctx, sleeve: string) => {
  table(c, 560);
  cup(c, 220, 800, 230, 280); cup(c, 830, 800, 230, 280);
  const px = 405;
  c.save(); c.translate(px, 800); c.rotate(-0.3); c.translate(-px, -800); cup(c, 520, 800, 230, 280); c.restore();
  hand(c, 590, 985, -Math.PI / 2, 2.3, SKIN.adult, sleeve);
  coin(c, 590, 790, 36);
  arrow(c, [[800, 960], [720, 880]]);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  bust(c, 240, 240, 125, 580, { eye: "shut" });
  coinScene(c, CLOTH.adult);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  bust(c, 540, 235, 125, 590, { adult: true, eye: "open", gx: 2, gy: 1 });
  table(c, 590);
  cup(c, 220, 800, 230, 280); cup(c, 540, 800, 230, 280); cup(c, 860, 800, 230, 280);
  pointHand(c, 410, 1125, -1.2, 2.0);
  arrow(c, [[640, 950], [960, 950]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  bust(c, 240, 240, 125, 580, { adult: true, eye: "back" });
  const pts: number[][] = [];
  for (let a = -2.4; a <= -0.5; a += 0.15) pts.push([240 + Math.cos(a) * 210, 240 + Math.sin(a) * 200]);
  arrow(c, pts);
  coinScene(c, COL.leaf);
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  table(c, 200);
  domeBowl(c, 700, 720, 135);
  c.save(); c.translate(440, 720); c.rotate(0.32); c.translate(-440, -720); domeBowl(c, 300, 720, 135); c.restore();
  dosa(c, 255, 700, 1.3);
  hand(c, 215, 480, 0.7, 1.7);
  dog(c, 825, 1010, 0.85, 1, "sit");
  line(c, [[900, 775], [870, 650], [800, 540]], 10, COL.purple);
  hand(c, 770, 440, 1.25, 1.4, SKIN.adult, CLOTH.adult);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  table(c, 520);
  bust(c, 370, 230, 110, 520, { eye: "open", gx: -2, gy: 2 });
  domeBowl(c, 160, 880, 125); domeBowl(c, 520, 880, 125);
  line(c, [[290, 430], [255, 580]], 70, INK); line(c, [[290, 430], [255, 580]], 58, CLOTH.child);
  pointHand(c, 255, 590, 2.0, 1.6);
  dog(c, 850, 1010, 0.85, -1, "sit");
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  table(c, 480);
  domeBowl(c, 945, 590, 70);
  c.save(); c.translate(230, 960); c.rotate(-0.5); c.translate(-230, -960); domeBowl(c, 230, 960, 120); c.restore();
  dosa(c, 340, 995, 1.4);
  dog(c, 720, 1010, 1.0, -1, "stand", 1);
  shape(c, () => rrect(c, 50, 40, 420, 330, 14), WHITE, 6);
  for (let i = 1; i < 4; i++) line(c, [[50, 40 + i * 82], [470, 40 + i * 82]], 3);
  line(c, [[260, 40], [260, 370]], 3);
  domeBowl(c, 155, 112, 36); domeBowl(c, 365, 112, 36);
  line(c, [[110, 240], [140, 275], [200, 190]], 11, RED);
  line(c, [[640, 205], [230, 262]], 26, INK); line(c, [[640, 205], [230, 262]], 16, COL.yellow);
  line(c, [[230, 262], [275, 256]], 16, "#f4d9b0"); line(c, [[230, 262], [243, 260]], 12, INK);
  handL(c, 780, 190, 1.9, CLOTH.child, SKIN.child, 0.1);
};

export const su_animalsAnimalMinds = cards("sci.animals.animal-minds.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
