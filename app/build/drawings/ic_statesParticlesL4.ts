import type { Ctx } from "./core";
import { D, INK, SH, WHITE, RED, COL, SKIN, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, seed, hand, person, write, cards } from "./flatKit";

// PARTICLES L4 · set-up cards for the dilution row (e1) and the squeeze test (e2), then one picture
// for each experiment, activity and project, and three term / explanation cards. Flat kit look.

// the pink of the dilution row, cup 1 to cup 6
const PINK = ["#e23a6e", "#ee6f96", "#f49bb7", "#f8c3d4", "#f9dde6", "#f1e6ea"];
const CHANA = "#e3b454", CHANA_DK = "#b98a2f", MUSTARD = "#5a3a1e", RICE = "#fbf4e2", RICE_DK = "#d8ccae", PLASTIC = "#f4f1ea";

// a sheet of white paper lying flat on the counter, its far edge a little narrower
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  const pts = [[x + w * 0.05, y], [x + w * 0.95, y], [x + w, y + h], [x, y + h]];
  c.beginPath(); polyP(c, pts.map(([px, py]) => [px + 14, py + 12])); c.fillStyle = SH; c.fill();
  shape(c, () => polyP(c, pts), COL.paper, 5);
};
// a steel teaspoon: bowl centre (bx, by), the handle running from the bowl at angle an for len px; liq = liquid held in the bowl
const spoon = (c: Ctx, bx: number, by: number, an: number, len: number, liq?: string) => {
  const ux = Math.cos(an), uy = Math.sin(an), s = len / 200;
  line(c, [[bx + ux * 34 * s, by + uy * 34 * s], [bx + ux * len, by + uy * len]], 26 * s, INK);
  line(c, [[bx + ux * 34 * s, by + uy * 34 * s], [bx + ux * len, by + uy * len]], 15 * s, COL.steel);
  shape(c, () => ell(c, bx, by, 44 * s, 30 * s, an), COL.steel, 5);
  shade(c, () => ell(c, bx, by, 44 * s, 30 * s, an), COL.steelDk, 9 * s, 7 * s);
  shape(c, () => ell(c, bx, by, 30 * s, 18 * s, an), liq ?? COL.steelIn, 3);
};
// one finger pressing on a point: the fingertip at (x, y), the finger running back from it at angle an (toward the hand)
const finger = (c: Ctx, x: number, y: number, an: number, s = 1, skin: string = SKIN.child) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, 0, -30, 190, 60, 30), skin, 6);
  line(c, [[96, -20], [96, 20]], 3, skin === SKIN.child ? SKIN.childDk : SKIN.adultDk);
  shape(c, () => ell(c, 30, -14, 20, 10), "#f1d6c4", 3);
  c.restore();
};
// a syringe lying with its tip at (x, y) pointing left; the barrel is L px long. seal = where the plunger's rubber sits, 0 (at the
// tip) to 1 (the 10 ml mark, fully drawn). liq = the liquid in it, or null for air; bubble = the share of the barrel nearest the tip
// that holds air. Marks 0, 5 and 10 ml are written under the barrel.
const syringe = (c: Ctx, x: number, y: number, L: number, seal: number, liq: string | null, bubble = 0, upright = false) => {
  const H = L * 0.24, nz = L * 0.15, bx = x + nz, sx = bx + L * seal, rodEnd = sx + L * 0.9, th = Math.max(3, L * 0.012);
  if (!upright) shadow(c, (x + rodEnd) / 2 + 10, y + H * 0.75, (rodEnd - x) / 2, H * 0.14);
  shape(c, () => rrect(c, sx, y - H * 0.2, rodEnd - sx, H * 0.4, 6), PLASTIC, 5);
  shape(c, () => rrect(c, rodEnd - 8, y - H * 0.62, 24, H * 1.24, 8), PLASTIC, 5);
  if (liq) {
    const from = bx + L * bubble; c.fillStyle = liq; c.fillRect(from, y - H / 2 + 4, sx - from, H - 8);
    if (bubble) shape(c, () => ell(c, from, y, H * 0.08, H / 2 - 5), COL.drop, 3);
  }
  shape(c, () => rrect(c, x, y - H * 0.16, nz + 10, H * 0.32, 6), COL.glass, 5);
  shape(c, () => rrect(c, bx, y - H / 2, L, H, 10), COL.glass, 6);
  shape(c, () => rrect(c, sx - 14, y - H / 2 + 5, 28, H - 10, 5), COL.black, 4);
  shape(c, () => rrect(c, bx + L - 8, y - H * 0.58, 16, H * 1.16, 6), COL.steelIn, 5);
  for (let m = 0; m <= 10; m++) { const mx = bx + (L * m) / 10; line(c, [[mx, y + H / 2 - 4], [mx, y + H / 2 - 4 - (m % 5 ? H * 0.14 : H * 0.28)]], th, INK); }
  shine(c, [[bx + 20, y - H * 0.33], [bx + L * 0.55, y - H * 0.33]], 6);
  if (upright) return;
  const fh = L * 0.085;
  write(c, "0", bx - fh * 0.3, y + H / 2 + 16, fh, INK, th + 1); write(c, "5", bx + L / 2 - fh * 0.3, y + H / 2 + 16, fh, INK, th + 1); write(c, "10 ml", bx + L - fh * 0.55, y + H / 2 + 16, fh, INK, th + 1);
};
// the same syringe standing up, its tip at (x, y) pointing up; the 0, 5 and 10 ml marks written upright beside it
const syringeUp = (c: Ctx, x: number, y: number, L: number, seal: number, liq: string | null, bubble = 0) => {
  c.save(); c.translate(x, y); c.rotate(Math.PI / 2); syringe(c, 0, 0, L, seal, liq, bubble, true); c.restore();
  const H = L * 0.24, fh = L * 0.085, R = x - H * 0.6 - 10;
  write(c, "0", R - fh * 0.6, y + L * 0.15 - fh / 2, fh, INK, 5); write(c, "5", R - fh * 0.6, y + L * 0.65 - fh / 2, fh, INK, 5); write(c, "10", R - fh * 1.4, y + L * 1.15 - fh / 2, fh, INK, 5);
};
// a thin stream of liquid falling from (x1, y1) to the surface at (x2, y2), with a small splash ring
const pour = (c: Ctx, x1: number, y1: number, x2: number, y2: number, w: number, col: string) => {
  shape(c, () => { c.moveTo(x1 - w / 2, y1); c.quadraticCurveTo(x1 - w / 2, (y1 + y2) / 2, x2 - w / 3, y2); c.lineTo(x2 + w / 3, y2); c.quadraticCurveTo(x1 + w / 2, (y1 + y2) / 2, x1 + w / 2, y1); c.closePath(); }, col, 3);
  shape(c, () => ell(c, x2, y2, w * 1.6, w * 0.5), col, 3);
};
// a wooden table whose top edge is at yTop; the front runs to the bottom of the card
const table = (c: Ctx, yTop: number) => {
  shape(c, () => polyP(c, [[70, yTop + 70], [1010, yTop + 70], [1010, D + 10], [70, D + 10]]), COL.woodDk, 6);
  shape(c, () => polyP(c, [[130, yTop], [950, yTop], [1010, yTop + 70], [70, yTop + 70]]), COL.wood, 6);
};
// a small bottle of food colour standing with its bottom centre at (x, y)
const colourBottle = (c: Ctx, x: number, y: number, s = 1) => {
  shape(c, () => rrect(c, x - 22 * s, y - 82 * s, 44 * s, 82 * s, 8 * s), RED, 5);
  shape(c, () => rrect(c, x - 12 * s, y - 112 * s, 24 * s, 32 * s, 4 * s), COL.black, 4);
  shape(c, () => rrect(c, x - 15 * s, y - 62 * s, 30 * s, 34 * s, 3 * s), WHITE, 3);
};
// particles: blue balls. rows = packed in neat rows (solid); jumbled = close but mixed up (liquid); few = far apart with arrows (gas)
const ball = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), COL.blue, Math.max(2.5, r * 0.18)); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.28, r * 0.28), "rgba(255,255,255,0.6)", 0); };
const rows = (c: Ctx, cx: number, cy: number, R: number, r: number) => { for (let gy = -R + r; gy <= R - r; gy += r * 2.1) for (let gx = -R + r; gx <= R - r; gx += r * 2.1) if (Math.hypot(gx, gy) < R - r) ball(c, cx + gx, cy + gy, r); };
const jumbled = (c: Ctx, cx: number, cy: number, R: number, r: number, sd: number) => { const g = rnd(sd); for (let i = 0; i < 60; i++) { const a = g() * Math.PI * 2, d = Math.sqrt(g()) * (R - r * 1.1); ball(c, cx + Math.cos(a) * d, cy + Math.sin(a) * d, r); } };
const few = (c: Ctx, cx: number, cy: number, R: number, r: number, sd: number) => { const g = rnd(sd); for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + g() * 0.6, d = R * (0.35 + g() * 0.4), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, fa = g() * Math.PI * 2; ball(c, x, y, r); arrow(c, [[x + Math.cos(fa) * r * 1.4, y + Math.sin(fa) * r * 1.4], [x + Math.cos(fa) * r * 3.2, y + Math.sin(fa) * r * 3.2]], RED, Math.max(3, r * 0.3)); } };
// a round frame for a particle picture, centre (x, y)
const ring = (c: Ctx, x: number, y: number, R: number) => shape(c, () => ell(c, x, y, R, R), WHITE, 6);
// a grain of rice
const grain = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, RICE, RICE_DK);
// a child's row of cups: six pinks fading, cup i at x, bottom y
const cupRow = (c: Ctx, x0: number, y: number, step: number, w: number, h: number, fills: number[], numbers = true) => {
  for (let i = 0; i < 6; i++) { const x = x0 + i * step; glass(c, x, y, w, h, fills[i], PINK[i]); if (numbers) write(c, String(i + 1), x - w * 0.13, y + 34, w * 0.42, INK, 6); }
};

// ---------------------------------------------------------------- e1 set-up: cup after cup of colour
// 1. six numbered cups of plain water on white paper, cup 1 a little fuller (10 teaspoons against 9)
const e1s0 = (c: Ctx) => {
  ground(c);
  paper(c, 40, 540, 1000, 330);
  for (let i = 0; i < 6; i++) { const x = 150 + i * 156; glass(c, x, 790, 124, 200, i ? 0.46 : 0.53, COL.water); write(c, String(i + 1), x - 16, 826, 54, INK, 6); }
};
// 2. one red drop falls from the dropper into cup 1; the stirring spoon beside it
const e1s1 = (c: Ctx) => {
  ground(c);
  glass(c, 480, 900, 300, 390, 0.5, COL.water);
  write(c, "1", 462, 936, 64, INK, 7);
  // the dropper: a glass tube of red colour, a rubber bulb on top, gripped from the right
  shape(c, () => rrect(c, 466, 220, 28, 230, 8), COL.glass, 5);
  c.fillStyle = RED; c.fillRect(470, 300, 20, 146);
  shape(c, () => polyP(c, [[468, 448], [492, 448], [484, 486], [476, 486]]), COL.glass, 5);
  shape(c, () => ell(c, 480, 196, 40, 50), COL.black, 5);
  hand(c, 550, 330, Math.PI);
  // the drop, half way down
  shape(c, () => { c.moveTo(480, 520); c.quadraticCurveTo(503, 560, 503, 584); c.arc(480, 584, 23, 0, Math.PI); c.quadraticCurveTo(457, 560, 480, 520); c.closePath(); }, RED, 4);
  spoon(c, 800, 930, -0.12, 230);
};
// 3. one level teaspoon of pink water from cup 1 is tipped into cup 2
const e1s2 = (c: Ctx) => {
  ground(c);
  glass(c, 300, 860, 240, 320, 0.48, PINK[0]); write(c, "1", 282, 896, 60, INK, 7);
  glass(c, 760, 860, 240, 320, 0.46, COL.water); write(c, "2", 742, 896, 60, INK, 7);
  arrow(c, [[300, 470], [600, 470]]);
  // the spoon tilts down toward cup 2 and the pink runs off its low end
  const an = -0.7, bx = 700, by = 440, ux = Math.cos(an), uy = Math.sin(an);
  pour(c, bx - ux * 36, by - uy * 36 + 6, 680, 713, 14, PINK[0]);
  spoon(c, bx, by, an, 190, PINK[0]);
  hand(c, bx + ux * 230, by + uy * 230, an + Math.PI);
};
// 4. the teaspoon goes on along the row, cup 2 to 3 to 4, the pink getting paler
const e1s3 = (c: Ctx) => {
  ground(c);
  [220, 540, 860].forEach((x, i) => { glass(c, x, 820, 190, 260, 0.47, PINK[i + 1]); write(c, String(i + 2), x - 16, 852, 56, INK, 6); });
  arrow(c, [[220, 470], [380, 390], [520, 470]]);
  arrow(c, [[560, 470], [700, 390], [840, 470]]);
  spoon(c, 700, 600, 0, 170, PINK[2]);
  hand(c, 940, 600, Math.PI);
};
// 5. the finished row, deep pink to nearly clear, with a cup of plain water beside the last one
const e1s4 = (c: Ctx) => {
  ground(c);
  paper(c, 30, 520, 1020, 330);
  cupRow(c, 120, 770, 130, 112, 190, [0.5, 0.46, 0.46, 0.46, 0.46, 0.46]);
  glass(c, 960, 770, 112, 190, 0.46, COL.water);
};

// ---------------------------------------------------------------- e2 set-up: the squeeze test
// 1. the plunger pulled back to 10 ml, air inside, a fingertip sealing the tip
const e2s0 = (c: Ctx) => {
  ground(c);
  syringe(c, 260, 540, 360, 1, null);
  finger(c, 258, 540, 2.5);
};
// 2. the thumb pushes the plunger in as far as it will go: the rubber stops at the 5 ml mark
const e2s1 = (c: Ctx) => {
  ground(c);
  syringe(c, 260, 540, 360, 0.5, null);
  finger(c, 258, 540, 2.5);
  finger(c, 836, 540, 0.45, 1.15);
  arrow(c, [[990, 430], [840, 430]]);
  arrow(c, [[494, 720], [494, 650]]);
};
// 3. the syringe filled to 10 ml with water, standing tip up in a cup of water, a finger sealing the tip
const e2s2 = (c: Ctx) => {
  ground(c);
  glass(c, 560, 950, 440, 430, 0.75, COL.water);
  syringeUp(c, 560, 250, 340, 1, COL.water);
  finger(c, 560, 246, -Math.PI / 2);
};
// 4. nine millilitres of water with a small bubble of air at the top, sealed, ready to push again
const e2s3 = (c: Ctx) => {
  ground(c);
  syringeUp(c, 580, 200, 380, 1, COL.water, 0.12);
  finger(c, 580, 196, -Math.PI / 2);
  arrow(c, [[740, 960], [740, 800]]);
};

// ---------------------------------------------------------------- one picture per experiment, activity and project
// e1: the child at the table with the row of fading pink cups, a teaspoon in one hand and the colour bottle in the other
const flowE1 = (c: Ctx) => {
  ground(c);
  const x = 360, y = 1020, h = 640;
  spoon(c, 640, 560, Math.atan2(520 - 560, 530 - 640), 140, PINK[0]);
  person(c, x, y, h, { reachR: [530, 520] });
  table(c, 640);
  cupRow(c, 560, 700, 86, 88, 140, [0.5, 0.46, 0.46, 0.46, 0.46, 0.46], false);
  colourBottle(c, 200, 690);
};
// e2: the child squeezes the air in a syringe, one fingertip on the tip, the other hand on the plunger
const flowE2 = (c: Ctx) => {
  ground(c);
  const H = person(c, 540, 1000, 660, { reachL: [380, 700], reachR: [700, 700] });
  syringe(c, H.handL[0] + 20, 700, 186, 0.5, null);
};
// a1: the child holds a steel plate with a packed layer of rice and shakes it a tiny bit
const flowA1 = (c: Ctx) => {
  ground(c);
  person(c, 540, 1010, 650, { reachL: [300, 700], reachR: [780, 700] });
  plate(c, 540, 700, 250, 75);
  const g = rnd(3);
  for (let gy = -48; gy <= 48; gy += 16) for (let gx = -200; gx <= 200; gx += 17) if ((gx / 200) ** 2 + (gy / 54) ** 2 < 1) grain(c, 540 + gx + g() * 3, 700 + gy + g() * 3, 9, g() * 0.4 - 0.2);
  arrow(c, [[470, 830], [400, 830]], RED, 8); arrow(c, [[610, 830], [680, 830]], RED, 8);
};
// a2: mustard seeds pour from a katori into a jug of chana filled to the 300 ml line; they fall into the gaps
const flowA2 = (c: Ctx) => {
  ground(c);
  const jx = 560, jb = 900, jw = 300, jh = 540, body = () => { c.moveTo(jx - jw / 2, jb - jh); c.lineTo(jx + jw / 2, jb - jh); c.lineTo(jx + jw * 0.46, jb); c.lineTo(jx - jw * 0.46, jb); c.closePath(); };
  // the tray under the jug
  shape(c, () => rrect(c, 300, 880, 560, 60, 12), COL.teal, 6); shade(c, () => rrect(c, 300, 880, 560, 60, 12), COL.tealDk, 0, -36);
  // the handle behind the jug
  c.beginPath(); c.moveTo(jx + jw / 2, jb - jh * 0.85); c.bezierCurveTo(jx + jw * 0.95, jb - jh * 0.85, jx + jw * 0.95, jb - jh * 0.3, jx + jw * 0.47, jb - jh * 0.3); c.strokeStyle = INK; c.lineWidth = 30; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.glassEdge; c.lineWidth = 16; c.stroke();
  // chana to the 300 line, mustard seeds in the gaps at the top
  const lineY = jb - jh * 0.6, g = rnd(11);
  c.save(); c.beginPath(); body(); c.clip();
  c.fillStyle = CHANA_DK; c.fillRect(0, lineY, D, jb - lineY);
  for (let i = 0; i < 170; i++) { const cx = jx - jw * 0.5 + g() * jw, cy = lineY + 10 + g() * (jb - lineY - 20); shape(c, () => ell(c, cx, cy, 17, 15), CHANA, 3.5); }
  for (let i = 0; i < 90; i++) { const cx = jx - jw * 0.5 + g() * jw, cy = lineY + 4 + g() * 120; shape(c, () => ell(c, cx, cy, 5, 5), MUSTARD, 1.5); }
  c.restore();
  shape(c, body, COL.glass, 6);
  line(c, [[jx - jw / 2 + 6, lineY], [jx + jw / 2 - 6, lineY]], 4, INK);
  write(c, "300 ml", jx - jw / 2 - 215, lineY - 20, 40, INK, 6);
  shape(c, () => ell(c, jx, jb - jh, jw / 2, 18), "rgba(255,255,255,0.35)", 5);
  // the katori of mustard, tilted so its lip is over the jug's mouth, held from the left
  const kx = 360, ky = 240, tilt = 0.7;
  hand(c, kx - Math.cos(tilt) * 70, ky - Math.sin(tilt) * 70, tilt);
  c.save(); c.translate(kx, ky); c.rotate(tilt); bowl(c, 0, 0, 90, MUSTARD); c.restore();
  const lx = kx + Math.cos(tilt) * 90, ly = ky + Math.sin(tilt) * 90;
  for (let i = 0; i < 28; i++) { const t = i / 27, sx = lx + 18 * t + (g() - 0.5) * 22 * t, sy = ly + t * (lineY - 40 - ly); shape(c, () => ell(c, sx, sy, 5, 5), MUSTARD, 1.5); }
};
// a3: the child reads the back of a salt packet; the other kitchen things wait in a row on the table
const flowA3 = (c: Ctx) => {
  ground(c);
  const x = 400, y = 1080, h = 640;
  person(c, x, y, h, { reachL: [310, 745], reachR: [490, 745] });
  table(c, 760);
  // the salt packet in both hands, held just above the table
  shape(c, () => rrect(c, 310, 668, 180, 150, 10), COL.blue, 6); shape(c, () => rrect(c, 335, 690, 130, 106, 6), WHITE, 4);
  for (let k = 0; k < 5; k++) line(c, [[350, 708 + k * 18], [350 + 70 + (k % 3) * 14, 708 + k * 18]], 4, COL.greyDk);
  // sugar, water bottle, tea, milk, foil on the table, and the spoon on the left
  spoon(c, 150, 815, -0.15, 170);
  shape(c, () => rrect(c, 560, 710, 80, 110, 8), COL.paper, 6); shape(c, () => rrect(c, 572, 740, 56, 44, 4), COL.yellow, 3);
  shape(c, () => rrect(c, 680, 680, 60, 140, 14), COL.glass, 5); c.fillStyle = COL.water; c.fillRect(686, 740, 48, 74); shape(c, () => rrect(c, 690, 664, 40, 26, 5), COL.blue, 4);
  shape(c, () => rrect(c, 770, 720, 80, 100, 8), COL.red, 6); shape(c, () => rrect(c, 784, 744, 52, 40, 4), COL.yellow, 3);
  shape(c, () => rrect(c, 880, 700, 76, 120, 8), WHITE, 6); shape(c, () => rrect(c, 892, 726, 52, 50, 4), COL.sky, 3);
  shape(c, () => rrect(c, 970, 760, 90, 60, 30), COL.steel, 6); shape(c, () => ell(c, 970, 790, 14, 30), COL.steelIn, 4);
};
// a4: the sheet of six boxes, each with its circle of particles; a pencil finishes the last one
const flowA4 = (c: Ctx) => {
  ground(c);
  paper(c, 90, 110, 900, 870);
  const draw = [(x: number, y: number) => rows(c, x, y, 84, 11), (x: number, y: number) => jumbled(c, x, y, 84, 11, 5), (x: number, y: number) => few(c, x, y, 84, 11, 6), (x: number, y: number) => rows(c, x, y, 84, 11), (x: number, y: number) => jumbled(c, x, y, 84, 11, 8), (x: number, y: number) => { ball(c, x - 40, y - 30, 11); ball(c, x + 30, y + 10, 11); }];
  for (let i = 0; i < 6; i++) {
    const bx = 180 + (i % 3) * 270, by = 190 + Math.floor(i / 3) * 370;
    shape(c, () => rrect(c, bx, by, 230, 300, 8), COL.paper, 4);
    ring(c, bx + 115, by + 130, 96); draw[i](bx + 115, by + 130);
    line(c, [[bx + 40, by + 262], [bx + 190, by + 262]], 4, COL.greyDk);
  }
  // the pencil, its point in the last circle, held from the lower right
  const tx = 790, ty = 700, an = -2.2, ux = Math.cos(an), uy = Math.sin(an);
  c.save(); c.translate(tx, ty); c.rotate(an + Math.PI);
  shape(c, () => polyP(c, [[0, 0], [34, -13], [34, 13]]), COL.black, 4); shape(c, () => rrect(c, 32, -14, 220, 28, 4), COL.yellow, 5); shape(c, () => rrect(c, 250, -14, 26, 28, 6), COL.pink, 4);
  c.restore();
  hand(c, tx - ux * 150, ty - uy * 150, an);
};
// p1: the child reads the little book to a smaller child, who points at the page of jumbled particles
const flowP1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 1000], [D, 1000]], 5, SH);
  person(c, 380, 1000, 620, { reachL: [300, 680], reachR: [560, 680] });
  // the open book, in the bigger child's hands
  const bx = 430, by = 690, w = 320, h = 220;
  shape(c, () => polyP(c, [[bx - w / 2, by - h / 2 + 16], [bx, by - h / 2], [bx, by + h / 2], [bx - w / 2, by + h / 2 - 16]]), COL.paper, 6);
  shape(c, () => polyP(c, [[bx + w / 2, by - h / 2 + 16], [bx, by - h / 2], [bx, by + h / 2], [bx + w / 2, by + h / 2 - 16]]), COL.paper, 6);
  ring(c, bx - 80, by, 62); rows(c, bx - 80, by, 54, 8);
  ring(c, bx + 80, by, 62); jumbled(c, bx + 80, by, 54, 8, 4);
  person(c, 770, 1000, 470, { reachL: [600, 690], armR: [Math.PI * 0.55, Math.PI * 0.5] });
};

// ---------------------------------------------------------------- term and explanation cards
// expl 4: air in a syringe squashes to half; water in a syringe does not move
const explSyringes = (c: Ctx) => {
  ground(c);
  syringe(c, 250, 330, 320, 0.5, null);
  finger(c, 248, 330, 2.5); finger(c, 772, 330, 0.75);
  arrow(c, [[940, 240], [780, 240]]);
  syringe(c, 250, 760, 320, 1, COL.water);
  finger(c, 248, 760, 2.5); finger(c, 920, 760, 0.75);
  arrow(c, [[1040, 670], [930, 670]]);
};
// term 6, state of matter: an ice cube, a glass of water and steam from a kettle, the same water three ways
const termStates = (c: Ctx) => {
  ground(c);
  line(c, [[0, 800], [D, 800]], 5, SH);
  const x = 200, y = 800, s = 170;
  shadow(c, x + 40, y + 6, s * 0.75, s * 0.12);
  shape(c, () => polyP(c, [[x - s / 2, y - s], [x - s / 2 + s * 0.35, y - s - s * 0.3], [x + s / 2 + s * 0.35, y - s - s * 0.3], [x + s / 2, y - s]]), "#e8f5fc", 6);
  shape(c, () => polyP(c, [[x + s / 2, y - s], [x + s / 2 + s * 0.35, y - s - s * 0.3], [x + s / 2 + s * 0.35, y - s * 0.3], [x + s / 2, y]]), "#a9d4ee", 6);
  shape(c, () => rrect(c, x - s / 2, y - s, s, s, 4), "#cfeaf8", 6);
  shine(c, [[x - s * 0.36, y - s * 0.8], [x - s * 0.36, y - s * 0.3]], 10);
  shape(c, () => ell(c, x - 60, y + 2, 26, 8), COL.water, 3);
  glass(c, 540, 800, 220, 320, 0.62, COL.water);
  const kx = 860, kw = 250;
  shadow(c, kx + 24, y + 6, kw * 0.6, kw * 0.1);
  const kb = () => { c.moveTo(kx - kw / 2, y); c.quadraticCurveTo(kx - kw / 2, y - kw * 0.8, kx, y - kw * 0.8); c.quadraticCurveTo(kx + kw / 2, y - kw * 0.8, kx + kw / 2, y); c.closePath(); };
  c.beginPath(); c.arc(kx, y - kw * 0.78, kw * 0.3, Math.PI, 0); c.strokeStyle = INK; c.lineWidth = 24; c.stroke(); c.strokeStyle = COL.black; c.lineWidth = 12; c.stroke();
  shape(c, () => polyP(c, [[kx - kw * 0.42, y - kw * 0.5], [kx - kw * 0.74, y - kw * 0.82], [kx - kw * 0.64, y - kw * 0.9], [kx - kw * 0.3, y - kw * 0.62]]), COL.steel, 6);
  shape(c, kb, COL.steel); shade(c, kb, COL.steelDk, kw * 0.12, 0);
  shape(c, () => ell(c, kx, y - kw * 0.76, kw * 0.2, kw * 0.06), COL.steelIn, 5); shape(c, () => ell(c, kx, y - kw * 0.84, 12, 12), COL.black, 4);
  c.globalAlpha = 0.9;
  [[kx - kw * 0.76, y - kw * 1.02, 30], [kx - kw * 0.66, y - kw * 1.2, 40], [kx - kw * 0.8, y - kw * 1.4, 48], [kx - kw * 0.6, y - kw * 1.6, 54]].forEach(([px, py, r]) => shape(c, () => ell(c, px, py, r, r * 0.8), WHITE, 5));
  c.globalAlpha = 1;
};
// term 13, dilute: a small glass of dark squash; water poured from a jug into the big glass makes it pale
const termDilute = (c: Ctx) => {
  ground(c);
  line(c, [[0, 900], [D, 900]], 5, SH);
  glass(c, 230, 900, 180, 270, 0.7, "#a33806");
  arrow(c, [[350, 720], [500, 720]]);
  glass(c, 720, 900, 270, 390, 0.78, "#f5c070");
  // the jug, tilted so its spout is over the glass
  const jx = 860, jy = 330, tilt = -0.6;
  c.save(); c.translate(jx, jy); c.rotate(tilt);
  c.beginPath(); c.moveTo(90, -70); c.bezierCurveTo(170, -70, 170, 50, 90, 50); c.strokeStyle = INK; c.lineWidth = 30; c.lineCap = "round"; c.stroke(); c.strokeStyle = COL.tealDk; c.lineWidth = 16; c.stroke();
  const jb = () => rrect(c, -90, -100, 180, 200, 18);
  shape(c, jb, COL.teal); shade(c, jb, COL.tealDk, 30, 0);
  shape(c, () => polyP(c, [[-90, -100], [-120, -118], [-90, -70]]), COL.teal, 5);
  shape(c, () => ell(c, 0, -100, 90, 16), COL.water, 5);
  c.restore();
  const sx = jx + (-120 * Math.cos(tilt) - -118 * Math.sin(tilt)), sy = jy + (-120 * Math.sin(tilt) + -118 * Math.cos(tilt));
  pour(c, sx, sy, 720, 900 - 390 * 0.78, 16, COL.water);
};

export const ic_statesParticlesL4 = cards("sci.states.particles.L4", [
  e1s0, e1s1, e1s2, e1s3, e1s4, e2s0, e2s1, e2s2, e2s3,
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1,
  explSyringes, termStates, termDilute,
]);
