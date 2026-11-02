import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, cards } from "./flatKit";

// sci.sound.hearing.L3 · picture cards (intro, cover, activities, terms, explanations).
// Child and grown-up are the same as on the set-up cards.

const WALL = "#f6efe0", FLOOR = "#e6d3ad", PHONE = "#3a3540", SCREEN = "#22303a", LCD = "#c9f06b";
const BONE = "#f2e6c8", SKINLT = "#e9c3a0", PINK = "#f29ab4", CAV = "#fbefe2", WAVE = COL.blue;

// ---------------------------------------------------------------- shared pieces
const arcs = (c: Ctx, x: number, y: number, radii: number[], a0: number, a1: number, col: string = WAVE, w = 9) => {
  for (const r of radii) { c.beginPath(); c.arc(x, y, r, a0, a1); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
};
const phone = (c: Ctx, x: number, yb: number, w: number, h: number, n = 0) => {
  shadow(c, x + 12, yb + 4, w * 0.6, 12);
  const body = () => rrect(c, x - w / 2, yb - h, w, h, 22);
  shape(c, body, PHONE); shade(c, body, "#241f2c", 12, 0, 0.5);
  shape(c, () => rrect(c, x - w / 2 + 12, yb - h + 18, w - 24, h - 36, 10), SCREEN, 4);
  const bx = x - w / 2 + 32, bw = w - 64;
  shape(c, () => polyP(c, [[x - 30, yb - h * 0.62], [x - 10, yb - h * 0.62], [x + 14, yb - h * 0.72], [x + 14, yb - h * 0.44], [x - 10, yb - h * 0.54], [x - 30, yb - h * 0.54]]), LCD, 3);
  for (let i = 0; i < 5; i++) { const bh = 14 + i * 9, by = yb - h * 0.3; c.fillStyle = i < n ? LCD : "#44525c"; rrect(c, bx + i * (bw / 5), by - bh, bw / 5 - 6, bh, 3); c.fill(); }
};
const room = (c: Ctx, floorTop: number) => { ground(c, WALL); c.fillStyle = FLOOR; c.fillRect(0, floorTop, D, D - floorTop); line(c, [[0, floorTop], [D, floorTop]], 5); };
const note = (c: Ctx, x: number, y: number, s = 1, col: string = COL.purple) => {
  line(c, [[x + 18 * s, y], [x + 18 * s, y - 70 * s], [x + 50 * s, y - 56 * s]], 9 * s, INK);
  shape(c, () => ell(c, x, y, 20 * s, 15 * s, -0.4), col, 5);
};
const raisedHand = (c: Ctx, x: number, y: number, h: number, a1: number, a2: number) => {
  const sh = y - h * 0.74, sx = x + h * 0.11, sy = sh + h * 0.03;
  const ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17, wx = ex + Math.cos(a2) * h * 0.16, wy = ey + Math.sin(a2) * h * 0.16;
  hand(c, wx, wy + 8, -Math.PI / 2, h / 420, SKIN.child, CLOTH.child, true);
};
type Face = "child" | "mum" | "grand";
// a front face with its shoulders, centre (x, y), head radius r
const face = (c: Ctx, x: number, y: number, r: number, kind: Face = "child", o: { shut?: boolean; mouth?: "o" | "hum" | "smile"; shoulders?: boolean } = {}) => {
  const skin = kind === "child" ? SKIN.child : SKIN.adult, cloth = kind === "child" ? CLOTH.child : CLOTH.adult, clothDk = kind === "child" ? CLOTH.childDk : CLOTH.adultDk;
  if (o.shoulders !== false) { const b = () => rrect(c, x - r * 1.5, y + r * 0.95, r * 3, r * 1.8, r * 0.6); shape(c, b, cloth); shade(c, b, clothDk, r * 0.3, 0); shape(c, () => rrect(c, x - r * 0.28, y + r * 0.7, r * 0.56, r * 0.5, 8), skin, 5); }
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.98, y + r * 0.1, r * 0.15, r * 0.28), skin, 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), skin);
  const hair = kind === "grand" ? "#e6e2da" : CLOTH.hair;
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, hair, 5);
  if (kind === "child") shape(c, () => ell(c, x + r * 0.95, y - r * 0.55, r * 0.3, r * 0.5), CLOTH.hair, 4);
  if (kind === "mum") { shape(c, () => ell(c, x, y - r * 1.12, r * 0.4, r * 0.34), CLOTH.hair, 4); shape(c, () => ell(c, x, y - r * 0.35, r * 0.06, r * 0.07), RED, 0); }
  for (const s of [-1, 1]) {
    if (o.shut) { c.beginPath(); c.arc(x + s * r * 0.36, y + r * 0.06, r * 0.14, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
    else shape(c, () => ell(c, x + s * r * 0.36, y + r * 0.1, r * 0.09, r * 0.12), INK, 0);
  }
  const m = o.mouth ?? "smile";
  if (m === "o") shape(c, () => ell(c, x, y + r * 0.5, r * 0.14, r * 0.18), INK, 0);
  else if (m === "hum") { c.beginPath(); c.moveTo(x - r * 0.2, y + r * 0.48); c.lineTo(x + r * 0.2, y + r * 0.48); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  else { c.beginPath(); c.arc(x, y + r * 0.34, r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  if (kind === "grand") shape(c, () => { c.moveTo(x - r * 0.4, y + r * 0.38); c.quadraticCurveTo(x, y + r * 0.2, x + r * 0.4, y + r * 0.38); c.quadraticCurveTo(x, y + r * 0.52, x - r * 0.4, y + r * 0.38); }, "#f2efe6", 3);
};
// a head from the side, facing right, ear in the middle, centre (x, y), radius r
const side = (c: Ctx, x: number, y: number, r: number, kind: Face = "child", mouthOpen = false) => {
  const skin = kind === "child" ? SKIN.child : SKIN.adult, cloth = kind === "child" ? CLOTH.child : CLOTH.adult;
  shape(c, () => rrect(c, x - r * 1.3, y + r * 1.1, r * 2.6, r * 1.5, r * 0.6), cloth);
  shape(c, () => rrect(c, x - r * 0.3, y + r * 0.7, r * 0.6, r * 0.6, 8), skin, 5);
  shape(c, () => ell(c, x, y, r, r * 1.08), skin);
  const hair = kind === "grand" ? "#e6e2da" : CLOTH.hair;
  shape(c, () => { c.moveTo(x - r * 1.05, y + r * 0.25); c.bezierCurveTo(x - r * 1.1, y - r * 1.45, x + r * 0.6, y - r * 1.4, x + r * 0.95, y - r * 0.4); c.quadraticCurveTo(x + r * 0.2, y - r * 0.6, x - r * 0.1, y - r * 0.2); c.quadraticCurveTo(x - r * 0.5, y + r * 0.3, x - r * 0.7, y + r * 0.7); c.closePath(); }, hair, 5);
  shape(c, () => ell(c, x - r * 0.05, y + r * 0.12, r * 0.18, r * 0.3), skin === SKIN.child ? SKIN.childDk : SKIN.adultDk, 5);
  shape(c, () => ell(c, x + r * 0.62, y - r * 0.02, r * 0.08, r * 0.11), INK, 0);
  shape(c, () => polyP(c, [[x + r * 0.95, y + r * 0.05], [x + r * 1.22, y + r * 0.34], [x + r * 0.95, y + r * 0.4]]), skin, 5);
  if (mouthOpen) shape(c, () => ell(c, x + r * 0.78, y + r * 0.62, r * 0.12, r * 0.14), INK, 0);
  else { c.beginPath(); c.arc(x + r * 0.62, y + r * 0.5, r * 0.24, 0.2, 1.4); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  if (kind === "grand") shape(c, () => ell(c, x + r * 0.82, y + r * 0.5, r * 0.2, r * 0.08), "#f2efe6", 3);
};
const mixer = (c: Ctx, x: number, yb: number, s = 1) => {
  shadow(c, x + 10 * s, yb + 4, 120 * s, 16 * s);
  const base = () => rrect(c, x - 100 * s, yb - 150 * s, 200 * s, 150 * s, 24 * s), jar = () => polyP(c, [[x - 80 * s, yb - 150 * s], [x + 80 * s, yb - 150 * s], [x + 60 * s, yb - 340 * s], [x - 60 * s, yb - 340 * s]]);
  shape(c, base, COL.teal); shade(c, base, COL.tealDk, 14 * s, 0);
  shape(c, jar, COL.glass); shine(c, [[x - 55 * s, yb - 170 * s], [x - 42 * s, yb - 320 * s]]);
  shape(c, () => rrect(c, x - 70 * s, yb - 356 * s, 140 * s, 24 * s, 8), COL.red);
  shape(c, () => ell(c, x, yb - 75 * s, 30 * s, 30 * s), WHITE, 5);
  line(c, [[x, yb - 75 * s], [x + 18 * s, yb - 92 * s]], 6);
};
function shine(c: Ctx, pts: number[][]) { c.globalAlpha = 0.75; line(c, pts, 8, WHITE); c.globalAlpha = 1; }
const speaker = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const b = () => rrect(c, x - w / 2, y - h / 2, w, h, 16);
  shape(c, b, PHONE); shade(c, b, "#241f2c", 10, 0, 0.5);
  shape(c, () => ell(c, x, y + h * 0.12, w * 0.32, w * 0.32), "#5a5368", 5); shape(c, () => ell(c, x, y + h * 0.12, w * 0.12, w * 0.12), INK, 0);
  shape(c, () => ell(c, x, y - h * 0.3, w * 0.12, w * 0.12), "#5a5368", 4);
};
const tick = (c: Ctx, x: number, y: number, s = 1) => line(c, [[x - 24 * s, y], [x - 6 * s, y + 20 * s], [x + 28 * s, y - 24 * s]], 11 * s, COL.green);
const cross = (c: Ctx, x: number, y: number, s = 1) => { line(c, [[x - 28 * s, y - 28 * s], [x + 28 * s, y + 28 * s]], 12 * s, RED); line(c, [[x + 28 * s, y - 28 * s], [x - 28 * s, y + 28 * s]], 12 * s, RED); };

// ---------------------------------------------------------------- the ear, cut open
// flap on the left, canal, eardrum, three bones, cochlea, nerve and brain. hl names the part to point at.
type Part = "flap" | "canal" | "drum" | "bones" | "cochlea" | "nerve" | "wax" | "";
const spiral = (c: Ctx, x: number, y: number, R: number) => {
  const pts: number[][] = []; for (let t = 0; t <= 6.6; t += 0.1) { const r = R * (1 - t / 8); pts.push([x + Math.cos(t + 3.1) * r, y + Math.sin(t + 3.1) * r]); }
  line(c, pts, R * 0.4, INK); line(c, pts, R * 0.4 - 9, "#f2c063");
};
const halo = (c: Ctx, on: boolean, x: number, y: number, rx: number, ry: number) => { if (!on) return; c.beginPath(); ell(c, x, y, rx, ry); c.fillStyle = "rgba(255,211,77,0.85)"; c.fill(); };
const earSection = (c: Ctx, hl: Part = "") => {
  ground(c, WALL);
  shape(c, () => rrect(c, 250, 250, 790, 580, 100), SKINLT);
  // brain
  shape(c, () => ell(c, 860, 340, 150, 80), PINK, 6);
  for (const [a, b] of [[760, 330], [830, 300], [900, 330], [960, 350]]) line(c, [[a, b + 20], [a + 30, b - 10], [a + 55, b + 22]], 5, "#d66d8d");
  // nerve
  halo(c, hl === "nerve", 880, 450, 70, 110);
  line(c, [[880, 520], [900, 450], [880, 390]], 24, INK); line(c, [[880, 520], [900, 450], [880, 390]], 14, COL.yellow);
  // outer ear
  halo(c, hl === "flap", 190, 540, 130, 190);
  shape(c, () => ell(c, 190, 540, 80, 150), SKIN.child, 6);
  shape(c, () => ell(c, 205, 545, 42, 95), SKIN.childDk, 5);
  // canal
  halo(c, hl === "canal" || hl === "wax", 370, 540, 150, 80);
  shape(c, () => rrect(c, 250, 505, 235, 70, 22), CAV, 6);
  const waxy = hl === "wax";
  for (const [a, b, r] of [[300, 525, 11], [345, 560, 14], [400, 522, 12], [440, 556, 13]]) shape(c, () => ell(c, a, b, r, r * 0.8), waxy ? COL.orange : "#e0b56a", 3);
  // middle ear
  shape(c, () => rrect(c, 500, 450, 255, 200, 40), CAV, 6);
  halo(c, hl === "bones", 630, 545, 125, 90);
  halo(c, hl === "drum", 488, 540, 48, 90);
  shape(c, () => ell(c, 488, 540, 15, 56), "#f7c9c0", 6);
  // hammer, anvil, stirrup
  line(c, [[492, 540], [585, 505]], 20, INK); line(c, [[492, 540], [585, 505]], 10, BONE);
  shape(c, () => ell(c, 590, 502, 20, 20), BONE, 5);
  shape(c, () => polyP(c, [[605, 490], [660, 495], [668, 545], [640, 590], [618, 545]]), BONE, 5);
  shape(c, () => ell(c, 692, 590, 24, 30), BONE, 5); shape(c, () => ell(c, 692, 590, 11, 16), CAV, 4);
  line(c, [[640, 590], [680, 590]], 8, INK);
  // cochlea
  halo(c, hl === "cochlea", 845, 600, 110, 110);
  shape(c, () => ell(c, 845, 600, 86, 86), "#f6d28a", 6);
  spiral(c, 845, 600, 78);
  line(c, [[752, 590], [722, 590]], 14, INK); line(c, [[752, 590], [722, 590]], 6, BONE);
  const pt: Record<string, number[][]> = {
    flap: [[70, 330], [120, 400]], canal: [[370, 340], [370, 480]], wax: [[360, 740], [360, 600]], drum: [[430, 350], [470, 470]],
    bones: [[620, 340], [620, 450]], cochlea: [[840, 790], [840, 700]], nerve: [[1000, 460], [930, 450]],
  };
  if (hl) arrow(c, pt[hl], RED, 12);
};

// ================================================================ the cards
// intro: a phone playing at zero volume across the room, a girl listening with a cupped hand
const intro = (c: Ctx) => {
  room(c, 790);
  shape(c, () => rrect(c, 60, 560, 400, 34, 6), COL.wood);
  for (const x of [100, 410]) { line(c, [[x, 594], [x, 790]], 24, INK); line(c, [[x, 594], [x, 790]], 14, COL.woodDk); }
  phone(c, 260, 560, 150, 250, 0);
  note(c, 400, 430, 0.9, COL.grey);
  c.setLineDash([14, 16]); line(c, [[340, 900], [700, 900]], 5, COL.greyDk); c.setLineDash([]);
  person(c, 830, 800, 640, { armR: [0.3, -2.1] });
  raisedHand(c, 830, 800, 640, 0.3, -2.1);
  // puzzled brows
  const hy = 800 - 640 * 0.74 - 640 * 0.13 * 1.05;
  line(c, [[830 - 56, hy - 36], [830 - 22, hy - 44]], 5); line(c, [[830 + 22, hy - 40], [830 + 56, hy - 30]], 5);
};
// summary: the whole path of a sound through the ear
const summary = (c: Ctx) => {
  earSection(c);
  arcs(c, 70, 540, [70, 120, 170], Math.PI * 1.75, Math.PI * 2.25, WAVE, 10);
  arrow(c, [[300, 540], [440, 540]], RED, 11);
  arrow(c, [[520, 395], [640, 395]], RED, 11);
  arrow(c, [[780, 470], [820, 420], [850, 390]], RED, 11);
};
// e1: three ear covers, each with a volume bar to find
const flowE1 = (c: Ctx) => {
  ground(c, WALL);
  const xs = [190, 540, 890];
  xs.forEach((x, i) => {
    shape(c, () => rrect(c, x - 150, 150, 300, 800, 30), WHITE, 5);
    if (i === 0) hand(c, x - 40, 380, 0, 1.3, SKIN.child, CLOTH.child, true);
    if (i === 1) { const tw = () => rrect(c, x - 110, 260, 220, 240, 26); shape(c, tw, COL.cloth); shade(c, tw, COL.steelDk, 24, 0, 0.45); c.save(); c.beginPath(); tw(); c.clip(); c.fillStyle = COL.teal; c.fillRect(x - 120, 300, 240, 34); c.fillRect(x - 120, 420, 240, 34); c.restore(); shape(c, tw, "rgba(0,0,0,0)", 6); }
    if (i === 2) for (const [a, b, r] of [[-40, 400, 62], [40, 380, 70], [0, 320, 66], [10, 440, 56]]) shape(c, () => ell(c, x + a, b, r, r), WHITE, 6);
    // the volume bar to climb
    speaker(c, x, 610, 90, 120);
    for (let k = 0; k < 5; k++) { const bh = 30 + k * 22; shape(c, () => rrect(c, x - 110 + k * 46, 920 - bh, 36, bh, 5), "#e8e2d4", 4); }
    arrow(c, [[x + 120, 880], [x + 120, 760]], RED, 9);
  });
};
// e2: a tone that rises higher and higher, and three ears in a row
const flowE2 = (c: Ctx) => {
  ground(c, WALL);
  c.beginPath(); let ph = 0;
  for (let x = 60; x <= 1020; x += 2) { const f = 0.02 + ((x - 60) / 960) * 0.2; ph += f * 2; const y = 330 + Math.sin(ph) * 90; x === 60 ? c.moveTo(x, y) : c.lineTo(x, y); }
  c.strokeStyle = INK; c.lineWidth = 20; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 11; c.stroke();
  arrow(c, [[80, 520], [900, 520]], RED, 13);
  face(c, 220, 770, 90, "child", { shoulders: true }); face(c, 540, 770, 95, "mum"); face(c, 860, 770, 95, "grand");
};
// e3: a wall with a door; a low note passes, a high note is stopped
const flowE3 = (c: Ctx) => {
  ground(c, WALL);
  shape(c, () => rrect(c, 470, 40, 140, 1000, 4), "#d9c9a8", 6);
  shape(c, () => rrect(c, 470, 540, 140, 40, 4), "#d9c9a8", 0);
  for (const y of [90, 600]) { shape(c, () => rrect(c, 482, y, 116, 380, 8), COL.woodDk, 6); shape(c, () => ell(c, 580, y + 190, 9, 9), COL.yellow, 4); }
  const row = (y: number, low: boolean) => {
    speaker(c, 110, y, 100, 130);
    const n = low ? 4 : 9;
    for (let i = 0; i < n; i++) { const x = 190 + i * (low ? 70 : 28); if (x > (low ? 470 : 450)) break; c.beginPath(); c.moveTo(x, y - 60); c.quadraticCurveTo(x + 20, y, x, y + 60); c.strokeStyle = low ? COL.blue : COL.purple; c.lineWidth = low ? 11 : 6; c.lineCap = "round"; c.stroke(); }
    if (low) { for (let i = 0; i < 2; i++) { const x = 640 + i * 70; c.beginPath(); c.moveTo(x, y - 40); c.quadraticCurveTo(x + 14, y, x, y + 40); c.strokeStyle = COL.blue; c.lineWidth = 8; c.globalAlpha = 0.6 - i * 0.2; c.stroke(); c.globalAlpha = 1; } }
    face(c, 900, y, 70, "child", { shoulders: false });
  };
  row(310, true); row(800, false);
  cross(c, 540, 820, 1.1);
};
// a1: humming with fingers in the ears
const flowA1 = (c: Ctx) => {
  ground(c, WALL);
  face(c, 540, 500, 190, "child", { shut: true, mouth: "hum" });
  for (const s of [-1, 1]) {
    const x = 540 + s * 232;
    shape(c, () => rrect(c, x - 28, 560, 56, 70, 14), CLOTH.child, 5);
    line(c, [[x, 560], [x - s * 20, 470]], 34, INK); line(c, [[x, 560], [x - s * 20, 470]], 24, SKIN.child);
  }
  note(c, 140, 330, 1.4); note(c, 880, 270, 1.2, COL.teal); note(c, 100, 520, 1, COL.orange);
  for (const s of [-1, 1]) arcs(c, 540, 540, [260, 305], Math.PI * (s < 0 ? 0.9 : -0.1), Math.PI * (s < 0 ? 1.1 : 0.1), COL.grey, 7);
};
// a2: a girl speaks, a phone records, the voice sounds odd
const flowA2 = (c: Ctx) => {
  ground(c, WALL);
  side(c, 200, 480, 150, "child", true);
  arcs(c, 360, 540, [60, 110, 160], -0.5, 0.5, WAVE, 10);
  phone(c, 770, 900, 250, 560, 3);
  shape(c, () => ell(c, 770, 400, 34, 34), RED, 5);
  c.beginPath(); for (let x = 680; x <= 860; x += 3) { const y = 520 + Math.sin((x - 680) / 8) * 20 * Math.sin((x - 680) / 57 * Math.PI); x === 680 ? c.moveTo(x, y) : c.lineTo(x, y); }
  c.strokeStyle = LCD; c.lineWidth = 6; c.stroke();
  arrow(c, [[420, 820], [600, 820]], RED, 11);
};
// a4: a paper cone, a tube, a balloon skin with a grain of rice on it
const flowA4 = (c: Ctx) => {
  ground(c, WALL);
  shadow(c, 560, 740, 440, 30);
  shape(c, () => rrect(c, 360, 450, 330, 190, 20), COL.paper);
  shade(c, () => rrect(c, 360, 450, 330, 190, 20), COL.steelDk, 0, 50, 0.4);
  shape(c, () => polyP(c, [[110, 330], [380, 450], [380, 640], [110, 760]]), COL.yellow);
  shade(c, () => polyP(c, [[110, 330], [380, 450], [380, 640], [110, 760]]), COL.orange, 0, 70, 0.5);
  shape(c, () => ell(c, 110, 545, 36, 215), "#fff2c4", 6);
  shape(c, () => ell(c, 700, 545, 38, 105), PINK, 6);
  shape(c, () => ell(c, 704, 505, 12, 9, 0.4), BONE, 3);
  for (const k of [-1, 1]) line(c, [[726 + 4, 505 + k * 30], [756, 505 + k * 40]], 6, RED);
  arcs(c, 30, 545, [60, 110], -0.6, 0.6, WAVE, 10);
  arrow(c, [[780, 330], [780, 430]], RED, 11);
};
// a5: arm's length from a mixer grinder
const flowA5 = (c: Ctx) => {
  room(c, 820);
  const h = 650;
  person(c, 230, 820, h, { armR: [0, 0], armL: [Math.PI * 0.55, Math.PI * 0.5] });
  shape(c, () => rrect(c, 520, 700, 460, 36, 6), COL.wood);
  line(c, [[560, 736], [560, 820]], 24, INK); line(c, [[560, 736], [560, 820]], 14, COL.woodDk);
  line(c, [[940, 736], [940, 820]], 24, INK); line(c, [[940, 736], [940, 820]], 14, COL.woodDk);
  mixer(c, 730, 700, 1.15);
  arcs(c, 730, 480, [210, 260], -0.5, 0.5, WAVE, 10); arcs(c, 730, 480, [210, 260], Math.PI - 0.5, Math.PI + 0.5, WAVE, 10);
  line(c, [[250, 940], [650, 940]], 6); line(c, [[250, 920], [250, 960]], 6); line(c, [[650, 920], [650, 960]], 6);
};
// p1: a week of noise notes in a diary
const flowP1 = (c: Ctx) => {
  ground(c, "#b9855a");
  shadow(c, 560, 940, 400, 30);
  shape(c, () => rrect(c, 120, 90, 800, 850, 24), COL.paper);
  line(c, [[120, 230], [920, 230]], 5, COL.grey);
  for (let i = 0; i < 5; i++) { shape(c, () => rrect(c, 180 + i * 140, 130, 100, 70, 12), i < 3 ? COL.greenLt : WHITE, 5); if (i < 3) tick(c, 230 + i * 140, 168, 0.9); }
  const rows: [number, number][] = [[300, 560], [510, 440], [720, 300]];
  rows.forEach(([y, bar], i) => {
    if (i === 0) mixer(c, 250, y + 140, 0.38);
    if (i === 1) speaker(c, 250, y + 70, 80, 110);
    if (i === 2) { shape(c, () => ell(c, 250, y + 70, 56, 66), COL.orange, 6); shape(c, () => ell(c, 250, y + 14, 56, 14), COL.wood, 5); }
    shape(c, () => rrect(c, 340, y + 40, bar, 54, 27), i === 0 ? RED : i === 1 ? COL.orange : COL.green, 5);
  });
  // pencil
  c.save(); c.translate(900, 800); c.rotate(-0.9); shape(c, () => rrect(c, -200, -16, 330, 32, 6), COL.yellow); shape(c, () => polyP(c, [[130, -16], [190, 0], [130, 16]]), "#f1d3a6", 4); c.restore();
};
// c1: home-made earmuffs
const flowC1 = (c: Ctx) => {
  ground(c, WALL);
  face(c, 540, 520, 200, "child", { shoulders: true });
  // headband and two padded cups
  c.beginPath(); c.arc(540, 520, 262, Math.PI * 1.02, Math.PI * 1.98); c.strokeStyle = INK; c.lineWidth = 36; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(540, 520, 262, Math.PI * 1.02, Math.PI * 1.98); c.strokeStyle = COL.teal; c.lineWidth = 24; c.stroke();
  for (const s of [-1, 1]) { shape(c, () => rrect(c, 540 + s * 232 - 62, 450, 124, 200, 52), COL.cloth); shape(c, () => rrect(c, 540 + s * 232 - 40, 480, 80, 140, 36), COL.blue, 4); }
  speaker(c, 120, 830, 130, 170);
  arcs(c, 120, 830, [120, 170, 220], -0.4, 0.4, WAVE, 10);
  shape(c, () => ell(c, 470, 830, 4, 4), WAVE, 0);
  tick(c, 940, 860, 1.6);
};
// c2: speaking so someone who hears less can hear
const flowC2 = (c: Ctx) => {
  ground(c, WALL);
  side(c, 230, 440, 150, "child", true);
  c.save(); c.translate(D, 0); c.scale(-1, 1); side(c, 230, 440, 150, "grand", false); c.restore();
  // slow, deep voice: big wide waves
  for (let i = 0; i < 3; i++) { const x = 440 + i * 100; c.beginPath(); c.moveTo(x, 420); c.quadraticCurveTo(x + 36, 500, x, 580); c.strokeStyle = COL.blue; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); }
  arrow(c, [[300, 820], [780, 820]], RED, 12);
};
// terms
const termFlap = (c: Ctx) => earSection(c, "flap");
const termCanal = (c: Ctx) => earSection(c, "canal");
const termDrum = (c: Ctx) => earSection(c, "drum");
const termBones = (c: Ctx) => earSection(c, "bones");
const termCochlea = (c: Ctx) => earSection(c, "cochlea");
const termNerve = (c: Ctx) => earSection(c, "nerve");
const termWax = (c: Ctx) => earSection(c, "wax");
// vibrate: a ruler twanged over a table edge
const termVibrate = (c: Ctx) => {
  room(c, 800);
  shape(c, () => rrect(c, 20, 640, 290, 160, 8), COL.wood); shade(c, () => rrect(c, 20, 640, 290, 160, 8), COL.woodDk, 0, 40, 0.5);
  const rul = (a: number, al: number) => { c.save(); c.translate(300, 620); c.rotate(a); c.globalAlpha = al; shape(c, () => rrect(c, -240, -22, 840, 30, 4), COL.yellow); c.restore(); c.globalAlpha = 1; };
  rul(-0.3, 0.45); rul(0.26, 0.45); rul(0, 1);
  hand(c, 130, 545, 0, 1.4, SKIN.child, CLOTH.child, false);
  arrow(c, [[930, 420], [930, 330]], RED, 11); arrow(c, [[930, 520], [930, 610]], RED, 11);
  arcs(c, 880, 700, [150, 200], -0.5, 0.5, WAVE, 9);
};
// pitch: a thin string (fast, high) and a thick one (slow, low)
const termPitch = (c: Ctx) => {
  ground(c, WALL);
  const strip = (y: number, fast: boolean) => {
    shape(c, () => rrect(c, 80, y - 190, 920, 380, 28), WHITE, 5);
    c.beginPath(); for (let x = 130; x <= 950; x += 3) { const yy = y + Math.sin(((x - 130) / (fast ? 22 : 110)) * Math.PI) * (fast ? 50 : 100); x === 130 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
    c.strokeStyle = INK; c.lineWidth = (fast ? 8 : 20) + 8; c.lineCap = "round"; c.stroke(); c.strokeStyle = fast ? COL.purple : COL.teal; c.lineWidth = fast ? 8 : 20; c.stroke();
  };
  strip(260, true); strip(790, false);
  arrow(c, [[1020, 520], [1020, 420]], RED, 10);
};
// quietest sound: bars of loudness, only those over the line are heard
const termQuiet = (c: Ctx) => {
  ground(c, WALL);
  const hs = [90, 150, 230, 340, 450, 560];
  hs.forEach((h, i) => { const x = 130 + i * 140; shape(c, () => rrect(c, x, 900 - h, 100, h, 12), h > 200 ? COL.green : COL.grey, 5); });
  c.setLineDash([22, 14]); line(c, [[80, 690], [1000, 690]], 9, RED); c.setLineDash([]);
  side(c, 200, 300, 110, "child");
  arrow(c, [[420, 150], [330, 190]], RED, 10);
};
// decibel: a whisper is small, a mixer grinder is big
const termDecibel = (c: Ctx) => {
  ground(c, WALL);
  side(c, 190, 330, 100, "child", true);
  arcs(c, 330, 345, [30, 55], -0.5, 0.5, WAVE, 8);
  write(c, "30", 150, 610, 70, INK, 9);
  mixer(c, 760, 760, 0.95);
  arcs(c, 760, 560, [150, 215, 280], -0.6, 0.6, WAVE, 11); arcs(c, 760, 560, [150, 215, 280], Math.PI - 0.6, Math.PI + 0.6, WAVE, 11);
  write(c, "85", 690, 830, 80, INK, 10);
  shape(c, () => rrect(c, 80, 730, 300, 44, 22), COL.greenLt, 5);
};
// hair cell: sound bends the tuft, the cell signals the nerve
const termHair = (c: Ctx) => {
  ground(c, WALL);
  const x = 540;
  shape(c, () => rrect(c, x - 130, 520, 260, 240, 90), COL.teal);
  shade(c, () => rrect(c, x - 130, 520, 260, 240, 90), COL.tealDk, 24, 0);
  shape(c, () => ell(c, x, 650, 50, 50), "#2a8a83", 5);
  [[-80, 120], [0, 150], [80, 120]].forEach(([dx, hh]) => { const h = hh + 190; line(c, [[x + dx, 525], [x + dx + 40, 525 - h * 0.97]], 26, INK); line(c, [[x + dx, 525], [x + dx + 40, 525 - h * 0.97]], 16, COL.yellow); });
  arrow(c, [[150, 250], [320, 250]], RED, 12);
  arcs(c, 90, 250, [50, 90], -0.7, 0.7, WAVE, 9);
  line(c, [[x, 765], [x, 880]], 26, INK); line(c, [[x, 765], [x, 880]], 16, COL.yellow);
  arrow(c, [[690, 800], [690, 930]], RED, 12);
};
// vibrating drum / hertz: kept out; expl cards below
// explanation 0: the chain, one round picture after another (3 on top, then 2 coming back)
const explChain = (c: Ctx) => {
  ground(c, WALL);
  const pos: number[][] = [[190, 330], [540, 330], [890, 330], [890, 770], [540, 770]];
  pos.forEach(([x, y]) => shape(c, () => ell(c, x, y, 130, 130), WHITE, 7));
  const k = 1.5;
  const at = (i: number, f: (x: number, y: number) => void) => { c.save(); c.translate(pos[i][0], pos[i][1]); c.scale(k, k); f(0, 0); c.restore(); };
  at(0, (x, y) => { shape(c, () => ell(c, x + 6, y, 38, 60), SKIN.child, 5); shape(c, () => ell(c, x + 12, y + 4, 18, 36), SKIN.childDk, 4); });
  at(1, (x, y) => { shape(c, () => ell(c, x, y, 16, 56), "#f7c9c0", 5); for (const s of [-1, 1]) { c.beginPath(); c.arc(x, y, 36, s < 0 ? Math.PI * 0.8 : -Math.PI * 0.2, s < 0 ? Math.PI * 1.2 : Math.PI * 0.2); c.strokeStyle = WAVE; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); } });
  at(2, (x, y) => { line(c, [[x - 50, y + 6], [x - 4, y - 16]], 14, INK); line(c, [[x - 50, y + 6], [x - 4, y - 16]], 7, BONE); shape(c, () => ell(c, x - 2, y - 18, 12, 12), BONE, 4); shape(c, () => polyP(c, [[x + 8, y - 28], [x + 34, y - 24], [x + 36, y + 6], [x + 20, y + 22]]), BONE, 4); shape(c, () => ell(c, x + 46, y + 22, 13, 16), BONE, 4); });
  at(3, (x, y) => spiral(c, x, y, 58));
  at(4, (x, y) => { shape(c, () => ell(c, x, y, 66, 50), PINK, 5); line(c, [[x - 30, y + 6], [x - 10, y - 18], [x + 8, y + 8], [x + 34, y - 10]], 5, "#d66d8d"); });
  arrow(c, [[335, 330], [395, 330]], RED, 11); arrow(c, [[685, 330], [745, 330]], RED, 11);
  arrow(c, [[890, 480], [890, 620]], RED, 11); arrow(c, [[745, 770], [685, 770]], RED, 11);
  arcs(c, 40, 140, [50, 90], -0.6, 0.6, WAVE, 9);
};
// explanation 3: the top of the band drops with age
const explAge = (c: Ctx) => {
  ground(c, WALL);
  const xs = [200, 540, 880], hs = [560, 440, 260], kinds: Face[] = ["child", "mum", "grand"];
  xs.forEach((x, i) => {
    shape(c, () => rrect(c, x - 70, 920 - hs[i], 140, hs[i], 14), [COL.teal, COL.blue, COL.purple][i], 6);
    face(c, x, 200, 85, kinds[i], { shoulders: false });
  });
  arrow(c, [[1010, 320], [1010, 520]], RED, 11);
};
// hair-cell rows for the loud-sound card
const cellRow = (c: Ctx, y: number, broken: boolean) => {
  for (let i = 0; i < 6; i++) {
    const x = 170 + i * 148;
    shape(c, () => rrect(c, x - 44, y, 88, 80, 34), broken ? COL.grey : COL.teal);
    for (const dx of [-22, 0, 22]) {
      if (!broken) { line(c, [[x + dx, y + 4], [x + dx, y - 70]], 16, INK); line(c, [[x + dx, y + 4], [x + dx, y - 70]], 8, COL.yellow); }
      else if (i % 2) { line(c, [[x + dx, y + 4], [x + dx + 40, y - 10]], 16, INK); line(c, [[x + dx, y + 4], [x + dx + 40, y - 10]], 8, "#d9d3c7"); }
    }
    if (broken && i % 2 === 0) line(c, [[x - 20, y + 20], [x, y + 45], [x + 18, y + 25]], 5, INK);
  }
};
const explLoud = (c: Ctx) => {
  ground(c, WALL);
  cellRow(c, 240, false);
  speaker(c, 300, 540, 130, 170);
  arcs(c, 360, 540, [90, 150, 210, 270], -0.7, 0.7, RED, 12);
  arrow(c, [[780, 400], [780, 470]], RED, 12);
  cellRow(c, 760, true);
};
// explanation 5: three ways to keep ears safe
const explSafe = (c: Ctx) => {
  ground(c, WALL);
  const px = [190, 540, 890], top = 190, ph = 700;
  const panels: ((x: number) => void)[] = [
    (x) => { face(c, x, 480, 80, "child", { shoulders: true }); c.beginPath(); c.arc(x, 480, 105, Math.PI * 1.02, Math.PI * 1.98); c.strokeStyle = INK; c.lineWidth = 22; c.stroke(); c.strokeStyle = COL.teal; c.lineWidth = 12; c.stroke(); for (const s of [-1, 1]) { shape(c, () => rrect(c, x + s * 96 - 26, 440, 52, 90, 22), COL.cloth); } tick(c, x, 800, 1.2); },
    (x) => { speaker(c, x - 70, 330, 90, 120); arcs(c, x - 20, 330, [50, 90], -0.7, 0.7, WAVE, 8); face(c, x + 60, 700, 60, "child", { shoulders: false }); arrow(c, [[x - 30, 560], [x + 40, 600]], RED, 9); tick(c, x, 850, 1.2); },
    (x) => { shape(c, () => ell(c, x, 520, 70, 110), SKIN.childDk, 5); shape(c, () => ell(c, x + 4, 530, 40, 70), SKIN.child, 4); shape(c, () => ell(c, x + 6, 540, 15, 22), INK, 0); line(c, [[x + 230, 380], [x + 30, 520]], 18, INK); line(c, [[x + 230, 380], [x + 30, 520]], 8, COL.paper); shape(c, () => ell(c, x + 30, 520, 17, 17), WHITE, 5); cross(c, x, 800, 1.1); },
  ];
  px.forEach((x, i) => {
    c.save(); c.beginPath(); rrect(c, x - 160, top, 320, ph, 28); c.fillStyle = "#dcecf5"; c.fill(); c.clip(); panels[i](x); c.restore();
    c.beginPath(); rrect(c, x - 160, top, 320, ph, 28); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  });
};
// explanation 6: hearing through the bones
const explBone = (c: Ctx) => {
  earSection(c);
  // the canal is plugged with cotton, so the sound cannot come in that way
  for (const [dx, dy] of [[-14, 8], [12, -10], [10, 14], [-6, -14]]) shape(c, () => ell(c, 300 + dx, 540 + dy, 22, 22), WHITE, 5);
  const fx = 700;
  line(c, [[fx, 250], [fx, 140]], 28, INK); line(c, [[fx, 250], [fx, 140]], 16, COL.steel);
  line(c, [[fx - 34, 140], [fx - 34, 30]], 28, INK); line(c, [[fx + 34, 140], [fx + 34, 30]], 28, INK); line(c, [[fx - 34, 140], [fx + 34, 140]], 28, INK);
  line(c, [[fx - 34, 140], [fx - 34, 30]], 16, COL.steel); line(c, [[fx + 34, 140], [fx + 34, 30]], 16, COL.steel); line(c, [[fx - 34, 140], [fx + 34, 140]], 16, COL.steel);
  arcs(c, fx, 85, [75, 115], -0.5, 0.5, WAVE, 9); arcs(c, fx, 85, [75, 115], Math.PI - 0.5, Math.PI + 0.5, WAVE, 9);
  arrow(c, [[740, 290], [800, 470], [815, 520]], RED, 12);
};

export const ic_soundHearingL3 = cards("sci.sound.hearing.L3 cards", [
  intro, summary, flowE1, flowE2, flowE3, flowA1, flowA2, flowA4, flowA5, flowP1, flowC1, flowC2,
  termFlap, termCanal, termDrum, termVibrate, termBones, termCochlea, termHair, termNerve, termWax, termPitch,
  explBone, termQuiet, termDecibel, explChain, explAge, explLoud, explSafe,
]);
