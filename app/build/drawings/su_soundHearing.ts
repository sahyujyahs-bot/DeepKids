import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// SOUND AND HEARING · set-up cards for sci.sound.hearing.L3: a quiet room, a phone, a girl with eyes
// shut, three ways of covering the ears, a family sitting in a row, a door open and shut.

const FLOOR = "#e6d3ad", WALL = "#f6efe0", PHONE = "#3a3540", SCREEN = "#22303a", LCD = "#c9f06b";

// ---------------------------------------------------------------- shared pieces
const room = (c: Ctx, floorTop: number) => {
  ground(c, WALL);
  c.fillStyle = FLOOR; c.fillRect(0, floorTop, D, D - floorTop);
  line(c, [[0, floorTop], [D, floorTop]], 5);
};
// a hand drawn mirrored so it points left
const handL = (c: Ctx, x: number, y: number, an: number, s: number, sleeve: string, open = false) => {
  c.save(); c.scale(-1, 1); hand(c, -x, y, an, s, SKIN.adult, sleeve, open); c.restore();
};
// a wooden chair seen from the side, facing right; seat top at fy - 200 s
const chair = (c: Ctx, x: number, fy: number, s: number) => {
  const st = fy - 200 * s;
  shadow(c, x + 10 * s, fy + 4, 130 * s, 18 * s);
  for (const lx of [-70, 70]) { line(c, [[x + lx * s, st + 20 * s], [x + (lx + (lx < 0 ? -8 : 4)) * s, fy]], 22 * s, INK); line(c, [[x + lx * s, st + 20 * s], [x + (lx + (lx < 0 ? -8 : 4)) * s, fy]], 22 * s - 9, lx < 0 ? COL.woodDk : COL.wood); }
  const back = () => rrect(c, x - 96 * s, st - 230 * s, 30 * s, 250 * s, 10 * s), seat = () => rrect(c, x - 96 * s, st, 192 * s, 34 * s, 10 * s);
  shape(c, back, COL.wood); shade(c, back, COL.woodDk, 10 * s, 0);
  shape(c, seat, COL.wood); shade(c, seat, COL.woodDk, 0, 10 * s);
};
const stool = (c: Ctx, x: number, fy: number, w: number, h: number) => {
  shadow(c, x + 14, fy + 4, w * 0.62, 16);
  for (const lx of [-0.38, 0.38]) { line(c, [[x + lx * w, fy - h + 20], [x + lx * w * 1.1, fy]], 20, INK); line(c, [[x + lx * w, fy - h + 20], [x + lx * w * 1.1, fy]], 11, lx < 0 ? COL.woodDk : COL.wood); }
  const top = () => rrect(c, x - w / 2, fy - h, w, 34, 10);
  shape(c, top, COL.wood); shade(c, top, COL.woodDk, 0, 10);
};
// a phone standing upright on its stand, bottom centre (x, yb); the screen shows a loudness bar of n of 5 steps
const phone = (c: Ctx, x: number, yb: number, w: number, h: number, n = 0) => {
  shadow(c, x + 12, yb + 4, w * 0.6, 12);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, 22);
  shape(c, body, PHONE); shade(c, body, "#241f2c", 12, 0, 0.5);
  shape(c, () => rrect(c, x - w / 2 + 12, yb - h + 18, w - 24, h - 36, 10), SCREEN, 4);
  const bx = x - w / 2 + 32, bw = w - 64;
  // speaker sign
  shape(c, () => polyP(c, [[x - 30, yb - h * 0.62], [x - 10, yb - h * 0.62], [x + 14, yb - h * 0.72], [x + 14, yb - h * 0.44], [x - 10, yb - h * 0.54], [x - 30, yb - h * 0.54]]), LCD, 3);
  for (let i = 0; i < 5; i++) { const bh = 14 + i * 9, by = yb - h * 0.3; c.fillStyle = i < n ? LCD : "#44525c"; rrect(c, bx + i * (bw / 5), by - bh, bw / 5 - 6, bh, 3); c.fill(); }
};
// the eyes of a seated person shut: paint the skin over them and draw two curves
const eyesShut = (c: Ctx, x: number, y: number, h: number, adult = false, sit = true) => {
  const head = h * 0.13, sh = sit ? y - h * 0.38 : y - h * 0.74, hy = sh - head * 1.05;
  for (const s of [-1, 1]) {
    c.beginPath(); ell(c, x + s * head * 0.35, hy + head * 0.12, head * 0.2, head * 0.22); c.fillStyle = adult ? SKIN.adult : SKIN.child; c.fill();
    c.beginPath(); c.arc(x + s * head * 0.35, hy + head * 0.08, head * 0.16, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  }
};
// the lower legs and shoes of a seated person (the kit draws only the thighs)
const shins = (c: Ctx, x: number, seatY: number, floorY: number, h: number) => {
  const sx = x + h * 0.3;
  for (const s of [-1, 1]) {
    const lx = sx + s * h * 0.03;
    line(c, [[lx, seatY], [lx, floorY - 14]], h * 0.07, INK); line(c, [[lx, seatY], [lx, floorY - 14]], h * 0.07 - 10, "#6b5a8c");
    shape(c, () => rrect(c, lx - h * 0.04, floorY - 24, h * 0.14, 24, 10), INK, 0);
  }
};
// a raised hand: the kit's arm angles worked out, an open hand put at the wrist
const raisedHand = (c: Ctx, x: number, y: number, h: number, sit: boolean, adult: boolean, a1: number, a2: number) => {
  const sh = sit ? y - h * 0.38 : y - h * 0.74, sx = x + h * 0.11, sy = sh + h * 0.03;
  const ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17, wx = ex + Math.cos(a2) * h * 0.16, wy = ey + Math.sin(a2) * h * 0.16;
  hand(c, wx, wy + 8, -Math.PI / 2, h / 420, adult ? SKIN.adult : SKIN.child, adult ? CLOTH.adult : CLOTH.child, true);
};
// sound arcs round a point, left side only or right side only
const arcs = (c: Ctx, x: number, y: number, radii: number[], a0: number, a1: number, col: string = COL.blue, w = 9) => {
  for (const r of radii) { c.beginPath(); c.arc(x, y, r, a0, a1); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
};
// a sideways head and shoulders of the girl facing right, ear in the middle; for the ear-cover panels
const headSide = (c: Ctx, x: number, y: number) => {
  shape(c, () => rrect(c, x - 130, y + 150, 260, 200, 50), CLOTH.child); // shoulders
  shape(c, () => rrect(c, x - 40, y + 70, 80, 110, 20), SKIN.child);       // neck
  shape(c, () => ell(c, x + 120, y + 10, 26, 18), SKIN.child, 5);           // never seen: hidden behind face
  shape(c, () => ell(c, x, y, 108, 118), SKIN.child);
  shape(c, () => ell(c, x - 78, y - 30, 44, 56), CLOTH.hair, 0);
  shape(c, () => { c.moveTo(x - 110, y + 10); c.bezierCurveTo(x - 118, y - 150, x + 60, y - 150, x + 108, y - 40); c.quadraticCurveTo(x + 20, y - 70, x - 20, y - 20); c.quadraticCurveTo(x - 60, y + 40, x - 90, y + 80); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x - 108, y + 30, 36, 24), CLOTH.hair, 5); // ponytail base
  shape(c, () => ell(c, x + 78, y - 6, 10, 14), INK, 0);             // eye
  shape(c, () => polyP(c, [[x + 104, y + 4], [x + 132, y + 36], [x + 104, y + 44]]), SKIN.child, 5); // nose
  c.beginPath(); c.arc(x + 70, y + 60, 28, 0.2, 1.4); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const ear = (c: Ctx, x: number, y: number, s = 1) => {
  shape(c, () => ell(c, x, y, 30 * s, 46 * s), SKIN.childDk, 5);
  shape(c, () => ell(c, x + 4 * s, y + 4 * s, 15 * s, 28 * s), SKIN.child, 4);
};

// ---------------------------------------------------------------- e1: the quietest sound
// setup.e1.0
const e1_0 = (c: Ctx) => {
  room(c, 590);
  const fy = 800;
  chair(c, 220, fy, 1.35);
  stool(c, 860, fy, 220, 150);
  phone(c, 860, fy - 150, 160, 270, 2);
  // the tape laid on the floor between them, with its case at the chair end
  const x0 = 360, x1 = 790, ty = 840;
  shadow(c, 590, ty + 66, 260, 12);
  shape(c, () => rrect(c, x0, ty, x1 - x0, 64, 6), COL.yellow);
  for (let i = 0; i <= 43; i++) { const x = x0 + 6 + i * ((x1 - x0 - 12) / 43); line(c, [[x, ty + 64], [x, ty + (i % 10 === 0 ? 26 : 44)]], i % 10 === 0 ? 4 : 2.5); }
  shape(c, () => rrect(c, x0 - 70, ty - 18, 90, 100, 20), COL.orange);
  shape(c, () => ell(c, x0 - 25, ty + 32, 18, 18), COL.paper, 4);
  shape(c, () => rrect(c, x1, ty - 6, 16, 76, 4), COL.steel, 5);
  // 3 m
  line(c, [[x0, 970], [x1, 970]], 6); line(c, [[x0, 954], [x0, 986]], 6); line(c, [[x1, 954], [x1, 986]], 6);
  shape(c, () => rrect(c, 500, 935, 190, 100, 18), WHITE, 5);
  write(c, "3 m", 528, 953, 60, INK, 8);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  room(c, 640);
  const fy = 820, sy = fy - 260;
  chair(c, 230, fy, 1.3);
  person(c, 240, sy, 540, { armR: [-1.1, -1.5], armL: [Math.PI * 0.5, Math.PI * 0.45], sit: true });
  shins(c, 240, sy, fy, 540);
  eyesShut(c, 240, sy, 540);
  raisedHand(c, 240, sy, 540, true, false, -1.1, -1.5);
  stool(c, 700, fy, 220, 150);
  phone(c, 700, fy - 150, 170, 290, 3);
  arcs(c, 700, fy - 300, [120, 180, 240], Math.PI * 0.8, Math.PI * 1.2);
  // a helper's hand pressing the volume button on the side
  shape(c, () => rrect(c, 700 + 85, fy - 150 - 220, 12, 70, 5), COL.orange, 4);
  handL(c, 915, fy - 150 - 175, 0.1, 1.3, CLOTH.adult, true);
  arrow(c, [[880, fy - 150 - 295], [880, fy - 150 - 245]], RED, 10);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, WALL);
  const px = [190, 540, 890], top = 210, ph = 640, ey = 590;
  // the girl's head from the side, facing right, ear big in the middle
  const head = (x: number) => {
    shape(c, () => rrect(c, x - 150, 770, 300, 200, 50), CLOTH.child);
    shape(c, () => rrect(c, x - 50, 650, 100, 140, 20), SKIN.childDk);
    shape(c, () => ell(c, x - 25, 490, 125, 170), CLOTH.hair);
    shape(c, () => ell(c, x + 30, 540, 135, 165), SKIN.child);
    shape(c, () => ell(c, x, 400, 140, 80), CLOTH.hair);
    shape(c, () => ell(c, x + 88, 540, 10, 14), INK, 0);
  };
  // the ear: big, with the ear hole and the small flap in front of it
  const earBig = (x: number, flapPressed: boolean) => {
    shape(c, () => ell(c, x - 15, ey, 70, 100), SKIN.childDk, 5);
    shape(c, () => ell(c, x - 8, ey + 6, 44, 72), SKIN.child, 4);
    shape(c, () => ell(c, x + 2, ey + 16, 17, 25), INK, 0);
    shape(c, () => ell(c, flapPressed ? x + 6 : x + 34, ey + 14, 20, 28), SKIN.childDk, 5);
  };
  const covers: ((x: number) => void)[] = [
    // 1: a flat hand cupped over the whole ear
    (x) => { earBig(x, false); hand(c, x - 40, 800, -1.4, 3.0, SKIN.child, CLOTH.child, true); },
    // 2: a thick folded striped towel held against the ear
    (x) => {
      earBig(x, false);
      const tw = () => rrect(c, x - 100, 440, 190, 300, 26);
      shape(c, () => rrect(c, x - 86, 454, 190, 300, 26), COL.blueDk);
      shape(c, tw, COL.cloth); shade(c, tw, COL.steelDk, 24, 0, 0.45);
      c.save(); c.beginPath(); tw(); c.clip();
      for (const dy of [490, 650]) { c.fillStyle = COL.teal; c.fillRect(x - 110, dy, 230, 36); c.fillStyle = COL.blue; c.fillRect(x - 110, dy + 36, 230, 12); }
      c.restore();
      shape(c, tw, "rgba(0,0,0,0)", 6);
      for (const dy of [470, 560, 680]) line(c, [[x + 60, dy], [x + 88, dy + 4]], 5, COL.greyDk);
      hand(c, x + 10, 900, -1.5, 1.8, SKIN.child, CLOTH.child, false);
    },
    // 3: a fingertip pressing the small flap shut over the ear hole
    (x) => {
      earBig(x, true);
      line(c, [[x + 210, 880], [x + 28, 640]], 62, INK); line(c, [[x + 210, 880], [x + 28, 640]], 50, SKIN.child);
      shape(c, () => ell(c, x + 26, 636, 8, 12, 0.7), COL.pink, 0);
      shape(c, () => rrect(c, x + 120, 790, 130, 120, 14), CLOTH.child, 5);
      arrow(c, [[x + 140, 500], [x + 52, 552]], RED, 11);
    },
  ];
  px.forEach((x, i) => {
    c.save();
    c.beginPath(); rrect(c, x - 160, top, 320, ph, 28); c.fillStyle = "#dcecf5"; c.fill(); c.clip();
    head(x);
    covers[i](x);
    c.restore();
    c.beginPath(); rrect(c, x - 160, top, 320, ph, 28); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
    write(c, String(i + 1), x - 140, top + 16, 50, INK, 7);
  });
};

// ---------------------------------------------------------------- e2: the highest note
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, WALL);
  c.fillStyle = COL.wood; c.fillRect(0, 780, D, 300); line(c, [[0, 780], [D, 780]], 6);
  shadow(c, 470, 800, 280, 26);
  const body = () => rrect(c, 160, 130, 620, 660, 52);
  shape(c, body, PHONE); shade(c, body, "#241f2c", 20, 0, 0.5);
  shape(c, () => rrect(c, 195, 175, 550, 570, 24), SCREEN, 5);
  // a steady wave
  c.beginPath(); for (let x = 220; x <= 720; x += 4) { const y = 330 + Math.sin((x - 220) / 18) * 56; x === 220 ? c.moveTo(x, y) : c.lineTo(x, y); }
  c.strokeStyle = COL.teal; c.lineWidth = 12; c.lineCap = "round"; c.stroke();
  write(c, "1000", 305, 440, 100, LCD, 12);
  // loudness bar with a knob
  shape(c, () => polyP(c, [[225, 640], [255, 640], [292, 612], [292, 668], [255, 668], [225, 668]]), LCD, 4);
  shape(c, () => rrect(c, 330, 628, 360, 24, 12), "#44525c", 0);
  shape(c, () => rrect(c, 330, 628, 170, 24, 12), LCD, 0);
  shape(c, () => ell(c, 500, 640, 30, 30), WHITE, 5);
  handL(c, 640, 735, -0.5, 1.5, CLOTH.adult, true);
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  room(c, 700);
  const fy = 930, sy = 820;
  // a long sofa behind them
  const sofa = () => rrect(c, 20, 300, 1040, 540, 60);
  shape(c, sofa, COL.purple); shade(c, sofa, "#6b4fa6", 0, 30);
  shape(c, () => rrect(c, 20, 700, 1040, 140, 40), "#a08bd8");
  shadow(c, 540, 935, 520, 24);
  const who: [number, number, boolean][] = [[170, 470, false], [500, 560, true], [830, 560, true]];
  who.forEach(([x, h, ad]) => { person(c, x, sy, h, { sit: true, adult: ad, armL: [Math.PI * 0.5, Math.PI * 0.4], armR: [Math.PI * 0.5, Math.PI * 0.4] }); shins(c, x, sy, fy, h); eyesShut(c, x, sy, h, ad); });
  // mother: bindi and a bun
  { const h = 560, head = h * 0.13, hy = sy - h * 0.38 - head * 1.05; shape(c, () => ell(c, 500, hy - head * 1.2, head * 0.5, head * 0.42), CLOTH.hair, 5); shape(c, () => ell(c, 500, hy - head * 0.35, 7, 8), RED, 0); }
  // grandfather: grey hair, white moustache; hand up
  {
    const x = 830, h = 560, head = h * 0.13, hy = sy - h * 0.38 - head * 1.05;
    shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, "#e6e2da", 5);
    shape(c, () => { c.moveTo(x - head * 0.4, hy + head * 0.36); c.quadraticCurveTo(x, hy + head * 0.2, x + head * 0.4, hy + head * 0.36); c.quadraticCurveTo(x, hy + head * 0.52, x - head * 0.4, hy + head * 0.36); }, "#f2efe8", 3);
    person(c, x, sy, h, { sit: true, adult: true, armL: [Math.PI * 0.5, Math.PI * 0.4], armR: [-1.15, -1.5] });
    shins(c, x, sy, fy, h);
    eyesShut(c, x, sy, h, true);
    shape(c, () => { c.moveTo(x - head * 1.02, hy); c.bezierCurveTo(x - head, hy - head * 1.5, x + head, hy - head * 1.5, x + head * 1.02, hy); c.quadraticCurveTo(x, hy - head * 0.55, x - head * 1.02, hy); c.closePath(); }, "#e6e2da", 5);
    shape(c, () => { c.moveTo(x - head * 0.4, hy + head * 0.4); c.quadraticCurveTo(x, hy + head * 0.24, x + head * 0.4, hy + head * 0.4); c.quadraticCurveTo(x, hy + head * 0.58, x - head * 0.4, hy + head * 0.4); }, "#f2efe8", 3);
    raisedHand(c, x, sy, h, true, true, -1.15, -1.5);
  }
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c, "#b9855a");
  shadow(c, 450, 900, 360, 30);
  shape(c, () => rrect(c, 110, 90, 640, 810, 20), COL.paper);
  line(c, [[110, 190], [750, 190]], 4, COL.grey);
  const rows = [[0, "8", "17000", 520], [1, "40", "15000", 440], [2, "70", "8000", 250]] as const;
  rows.forEach(([i, age, hz, bar]) => {
    const y = 250 + i * 215;
    // a little head: child, grown-up, grandfather
    const hc = i === 0 ? SKIN.child : SKIN.adult;
    shape(c, () => ell(c, 190, y + 40, 38, 40), hc, 5);
    shape(c, () => { c.moveTo(150, y + 36); c.bezierCurveTo(150, y - 14, 232, y - 14, 230, y + 36); c.quadraticCurveTo(190, y + 8, 150, y + 36); c.closePath(); }, i === 2 ? "#e6e2da" : CLOTH.hair, 4);
    write(c, age, 250, y + 8, 56, INK, 8);
    write(c, hz, 400, y + 8, 56, INK, 8);
    shape(c, () => rrect(c, 160, y + 100, bar * 0.9, 34, 17), i === 0 ? COL.teal : i === 1 ? COL.blue : COL.purple, 5);
  });
  // a pencil writing, held in a grown-up's hand
  const s = 1.3, wx = 720, wy = 590, an = 0.9;
  c.save(); c.scale(-1, 1); c.translate(-wx, wy); c.rotate(an);
  const pen = () => rrect(c, -260, -14, 380, 28, 6);
  shape(c, pen, COL.yellow); shade(c, pen, COL.orange, 0, 8);
  shape(c, () => polyP(c, [[120, -14], [180, 0], [120, 14]]), "#f1d3a6", 4); shape(c, () => polyP(c, [[160, -5], [180, 0], [160, 5]]), INK, 0);
  c.restore();
  handL(c, wx, wy, an, s, CLOTH.adult);
};

// ---------------------------------------------------------------- e3: through the door
// the room on the left, the outside on the right, a wall with a doorway between; the child outside listens
const doorScene = (c: Ctx, open: boolean) => {
  const fy = 840, wx0 = 430, wx1 = 570, dTop = 250;
  ground(c, WALL);
  c.fillStyle = "#d3e9f2"; c.fillRect(wx1, 0, D - wx1, fy);          // outside
  c.fillStyle = FLOOR; c.fillRect(0, fy, wx0, D - fy); c.fillStyle = "#cfe3a6"; c.fillRect(wx1, fy, D - wx1, D - fy);
  line(c, [[0, fy], [D, fy]], 5);
  // the wall, with the doorway cut out of it
  const wall = () => { c.moveTo(wx0, 0); c.lineTo(wx1, 0); c.lineTo(wx1, dTop); c.lineTo(wx0, dTop); c.closePath(); };
  shape(c, wall, "#ead9b8", 6);
  shape(c, () => polyP(c, [[wx0, dTop], [wx1, dTop], [wx1, fy], [wx0, fy]]), open ? "#d3e9f2" : COL.brown, 6);
  if (open) {
    shape(c, () => polyP(c, [[wx0, dTop], [wx1, dTop], [wx1, fy], [wx0, fy]]), "#e8f3f7", 0);
    shape(c, () => polyP(c, [[wx1, dTop + 6], [wx1 + 100, dTop + 50], [wx1 + 100, fy - 30], [wx1, fy - 4]]), COL.brown, 6);
    shape(c, () => ell(c, wx1 + 80, 560, 9, 9), COL.yellow, 3);
  } else {
    shade(c, () => polyP(c, [[wx0, dTop], [wx1, dTop], [wx1, fy], [wx0, fy]]), "#7a4e2a", 24, 0);
    shape(c, () => ell(c, wx0 + 24, 700, 11, 11), COL.yellow, 4);
  }
  line(c, [[wx0, 0], [wx0, dTop]], 6); line(c, [[wx0, dTop], [wx0, fy]], 6);
  // the table with the phone, inside
  const tx = 230;
  shadow(c, tx + 10, fy + 4, 190, 16);
  for (const lx of [-120, 120]) { line(c, [[tx + lx, 610], [tx + lx, fy]], 24, INK); line(c, [[tx + lx, 610], [tx + lx, fy]], 14, lx < 0 ? COL.woodDk : COL.wood); }
  const top = () => rrect(c, tx - 170, 590, 340, 36, 10);
  shape(c, top, COL.wood); shade(c, top, COL.woodDk, 0, 10);
  phone(c, tx, 590, 130, 230, 3);
  // the child outside: facing the door, a hand cupped at the ear
  const cx = 850, h = 500;
  c.save(); c.translate(cx, 0); c.scale(-1, 1); c.translate(-cx, 0);
  shadow(c, cx + 6, fy + 4, 70, 14);
  person(c, cx, fy, h, { armR: [0.5, -1.9], armL: [Math.PI * 0.5, Math.PI * 0.5] });
  const sh = fy - h * 0.74, sx = cx + h * 0.11, sy = sh + h * 0.03, ex = sx + Math.cos(0.5) * h * 0.17, ey = sy + Math.sin(0.5) * h * 0.17;
  hand(c, ex - 0.04 * h, ey - 0.08 * h, -1.9, 0.5, SKIN.child, CLOTH.child, true);
  c.restore();
  return { fy, wx0, wx1, cx };
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  const { fy, wx0, wx1, cx } = doorScene(c, true);
  // sound spreading from the phone, through the doorway, on towards the child
  c.save(); c.beginPath(); c.rect(0, 0, wx0, fy); c.clip(); arcs(c, 260, 470, [110, 180, 250], -0.8, 0.8); c.restore();
  c.save(); c.beginPath(); c.rect(wx1 + 104, 0, D, fy); c.clip(); arcs(c, wx1 - 40, 540, [160, 230], -0.65, 0.65); c.restore();
  // distance to the door
  line(c, [[wx1 + 10, 940], [cx - 70, 940]], 6); line(c, [[wx1 + 10, 924], [wx1 + 10, 956]], 6); line(c, [[cx - 70, 924], [cx - 70, 956]], 6);
  shape(c, () => rrect(c, 640, 965, 150, 90, 18), WHITE, 5);
  write(c, "2 m", 664, 982, 54, INK, 7);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  const { wx0, wx1 } = doorScene(c, false);
  // a wave from x0 to x1 at height y; its swing shrinks across the door (x between wx0 and wx1) when fade is set
  const sine = (x0: number, x1: number, y: number, len: number, amp: number, col: string, fade = 0) => {
    c.beginPath();
    for (let x = x0; x <= x1; x += 3) {
      const k = fade ? 1 - fade * Math.min(1, Math.max(0, (x - wx0) / (wx1 - wx0))) : 1, yy = y + Math.sin(((x - x0) / len) * Math.PI * 2) * amp * k;
      x === x0 ? c.moveTo(x, yy) : c.lineTo(x, yy);
    }
    c.strokeStyle = INK; c.lineWidth = 19; c.lineCap = "round"; c.stroke(); c.strokeStyle = col; c.lineWidth = 10; c.stroke();
  };
  // low note: long slow waves pass through the shut door, a little smaller, and reach the child's ear
  sine(300, 720, 450, 210, 34, COL.blue, 0.55);
  // high note: short tight waves stop at the door
  sine(300, wx0 - 8, 545, 40, 22, COL.orange);
  line(c, [[wx0 - 28, 495], [wx0 + 34, 595]], 14, WHITE); line(c, [[wx0 + 34, 495], [wx0 - 28, 595]], 14, WHITE);
  line(c, [[wx0 - 24, 500], [wx0 + 30, 590]], 9, RED); line(c, [[wx0 + 30, 500], [wx0 - 24, 590]], 9, RED);
};

export const su_soundHearing = cards("sci.sound.hearing.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1]);
