import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, bowl, cards } from "./flatKit";

const NIGHT = "#2c2748", FLOOR = "#3d3560", PALE = "#f6f0dc", DARKB = "#443d66", LAMPY = "#ffe27a";

// a person's wrist position (same maths as person()), so we can put an object in the hand
const wrist = (x: number, y: number, h: number, side: "L" | "R", a: [number, number]) => {
  const sh = y - h * 0.74, sx = x + (side === "L" ? -1 : 1) * h * 0.11, sy = sh + h * 0.03;
  const ex = sx + Math.cos(a[0]) * h * 0.17, ey = sy + Math.sin(a[0]) * h * 0.17;
  return [ex + Math.cos(a[1]) * h * 0.16, ey + Math.sin(a[1]) * h * 0.16];
};
// a pencil from (x1,y1) to (x2,y2)
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => { line(c, [[x1, y1], [x2, y2]], 24, INK); line(c, [[x1, y1], [x2, y2]], 14, COL.wood); };
// a bare bulb lamp on a stand with rays
const lamp = (c: Ctx, x: number, y: number, s = 1) => {
  c.beginPath(); ell(c, x, y, 150 * s, 150 * s); c.fillStyle = "rgba(255,226,122,0.18)"; c.fill();
  c.beginPath(); ell(c, x, y, 105 * s, 105 * s); c.fillStyle = "rgba(255,226,122,0.25)"; c.fill();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2, r1 = 62 * s, r2 = 90 * s; line(c, [[x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a) * r2, y + Math.sin(a) * r2]], 7, LAMPY); }
  shape(c, () => rrect(c, x - 20 * s, y + 40 * s, 40 * s, 38 * s, 8), COL.steelDk, 5);
  shape(c, () => ell(c, x, y, 46 * s, 46 * s), LAMPY, 6);
  shine(c, [[x - 24 * s, y - 14 * s], [x - 12 * s, y - 28 * s]], 8);
};
const table = (c: Ctx, x: number, y: number, w: number, floorY: number) => {
  shadow(c, x + w / 2 + 20, floorY + 4, w * 0.55, 18);
  shape(c, () => rrect(c, x, y, w, 28, 8), COL.brown, 6);
  for (const lx of [x + 24, x + w - 44]) shape(c, () => rrect(c, lx, y + 28, 20, floorY - y - 28, 4), COL.woodDk, 5);
};
type Lit = "none" | "left" | "right" | "full";
// the pale ball: lit part toward the lamp, the rest dark ("none" keeps only a thin lit rim)
const ball = (c: Ctx, x: number, y: number, r: number, lit: Lit, tone = PALE, dark = DARKB) => {
  c.beginPath(); ell(c, x, y, r, r); c.fillStyle = lit === "full" ? tone : dark; c.fill();
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.fillStyle = tone;
  if (lit === "left") c.fillRect(x - r - 2, y - r - 2, r + 2, r * 2 + 4);
  if (lit === "right") c.fillRect(x, y - r - 2, r + 2, r * 2 + 4);
  c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// a round window showing what the girl sees
const inset = (c: Ctx, x: number, y: number, r: number, lit: Lit) => {
  c.beginPath(); ell(c, x, y, r + 14, r + 14); c.fillStyle = WHITE; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, x, y, r, r); c.fillStyle = NIGHT; c.fill();
  ball(c, x, y, r * 0.72, lit);
};

// setup.e1.0 : facing the lamp, ball held toward it, dark side toward her -> new Moon
const card1 = (c: Ctx) => {
  ground(c, NIGHT); c.fillStyle = FLOOR; c.fillRect(0, 700, D, 380);
  const gx = 640, gy = 700, gh = 520, a: [number, number] = [Math.PI * 0.97, Math.PI * 0.97];
  lamp(c, 170, 440, 1.1); table(c, 70, 530, 200, 760);
  shadow(c, gx + 40, gy + 6, 130, 20);
  person(c, gx, gy, gh, { armL: a });
  const [wx, wy] = wrist(gx, gy, gh, "L", a);
  pencil(c, wx, wy + 40, wx, wy - 70); ball(c, wx, wy - 100, 62, "left");
  inset(c, 880, 890, 120, "none");
};
// setup.e1.1 : a quarter turn left, the lamp at her right side, half of the ball lit -> half Moon
const card2 = (c: Ctx) => {
  ground(c, NIGHT); c.fillStyle = FLOOR; c.fillRect(0, 700, D, 380);
  const gx = 620, gy = 700, gh = 520, a: [number, number] = [Math.PI * 0.75, Math.PI * 1.3];
  lamp(c, 170, 440, 1.1); table(c, 70, 530, 200, 760);
  for (let k = 0; k < 3; k++) line(c, [[250, 440 + k * 40 - 40], [370, 440 + k * 40 - 40]], 6, "rgba(255,226,122,0.6)");
  shadow(c, gx + 40, gy + 6, 130, 20);
  person(c, gx, gy, gh, { armL: a });
  const [wx, wy] = wrist(gx, gy, gh, "L", a);
  pencil(c, wx, wy + 40, wx, wy - 60); ball(c, wx, wy - 95, 62, "left");
  arrow(c, [[500, 195], [590, 150], [700, 150], [790, 195]], RED, 12);
  inset(c, 880, 890, 120, "right");
};
// setup.e1.2 : back to the lamp, ball a little above the head, fully lit -> full Moon
const card3 = (c: Ctx) => {
  ground(c, NIGHT); c.fillStyle = FLOOR; c.fillRect(0, 760, D, 320);
  const gx = 560, gy = 830, gh = 440, a: [number, number] = [-1.2, -1.5];
  lamp(c, 330, 300, 0.8);
  shape(c, () => rrect(c, 230, 372, 200, 24, 6), COL.brown, 6); shape(c, () => polyP(c, [[250, 396], [250, 450], [300, 396]]), COL.woodDk, 5); shape(c, () => polyP(c, [[410, 396], [410, 450], [360, 396]]), COL.woodDk, 5);
  for (let k = 0; k < 3; k++) line(c, [[400, 300 + (k - 1) * 30], [560, 270 + (k - 1) * 22]], 6, "rgba(255,226,122,0.6)");
  shadow(c, gx + 40, gy + 6, 110, 18);
  person(c, gx, gy, gh, { armR: a });
  const [wx, wy] = wrist(gx, gy, gh, "R", a);
  pencil(c, wx, wy + 30, wx, wy - 60); ball(c, wx, wy - 100, 56, "full");
  inset(c, 880, 890, 110, "full");
};

// ---------------------------------------------------------------- eclipse set-up
const football = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => ell(c, x, y, r, r);
  shape(c, body, WHITE, 6); shade(c, body, COL.steelDk, r * 0.28, r * 0.12, 0.5);
  c.save(); c.beginPath(); body(); c.clip();
  const patch = (px: number, py: number, pr: number) => shape(c, () => { for (let k = 0; k < 5; k++) { const an = -Math.PI / 2 + (k * Math.PI * 2) / 5; c[k ? "lineTo" : "moveTo"](px + Math.cos(an) * pr, py + Math.sin(an) * pr); } c.closePath(); }, COL.black, 4);
  patch(x + r * 0.15, y - r * 0.05, r * 0.3); patch(x - r * 0.62, y - r * 0.5, r * 0.22); patch(x + r * 0.7, y - r * 0.35, r * 0.22); patch(x - r * 0.45, y + r * 0.62, r * 0.22); patch(x + r * 0.55, y + r * 0.7, r * 0.2); patch(x - r * 0.95, y + r * 0.1, r * 0.2);
  c.restore(); c.beginPath(); body(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const FY = 635, FX = 730, FR = 130;
// torch (the Sun) on a pile of books, a bowl and a football: identical on all three cards
const eclipseSet = (c: Ctx, beam: () => void, afterBeam: () => void) => {
  ground(c, NIGHT); c.fillStyle = FLOOR; c.fillRect(0, 830, D, 250);
  shadow(c, 300, 836, 230, 16); shadow(c, 760, 836, 190, 16);
  beam(); afterBeam();
  [[104, 780, COL.red], [124, 730, COL.blue], [98, 680, COL.green]].forEach(([bx, by, col]) => shape(c, () => rrect(c, bx as number, by as number, 290, 50, 6), col as string, 6));
  // the torch: body, grip band, glowing head
  shape(c, () => rrect(c, 120, 590, 220, 90, 18), COL.teal, 6); shade(c, () => rrect(c, 120, 590, 220, 90, 18), COL.tealDk, 0, 30, 0.7);
  shape(c, () => rrect(c, 200, 600, 26, 70, 6), COL.tealDk, 5);
  shape(c, () => polyP(c, [[340, 595], [392, 568], [392, 702], [340, 675]]), COL.steel, 6);
  shape(c, () => ell(c, 392, 635, 16, 67), LAMPY, 6);
  bowl(c, FX, 720, 175);
};
const beamLit = (c: Ctx, pts: number[][]) => { c.beginPath(); polyP(c, pts); c.fillStyle = "rgba(255,226,122,0.30)"; c.fill(); };
const shadowCone = (c: Ctx, pts: number[][]) => { c.beginPath(); polyP(c, pts); c.fillStyle = "rgba(14,10,34,0.62)"; c.fill(); };
const lime = (c: Ctx, x: number, y: number, dark = false) => {
  const b = () => ell(c, x, y, 52, 52);
  shape(c, b, dark ? "#2d3f2c" : "#9ccf62", 6); if (!dark) { shade(c, b, COL.green, 14, 14, 0.7); shine(c, [[x - 30, y - 18], [x - 14, y - 34]], 8); }
  shape(c, () => ell(c, x, y - 50, 9, 6), dark ? "#2d3f2c" : COL.greenDk, 4);
};
const limeOnPencil = (c: Ctx, x: number, y: number, dark = false) => {
  pencil(c, x, 890, x, y + 30); lime(c, x, y, dark); hand(c, x, 965, -Math.PI / 2, 1.5);
};

// setup.e2.0 : torch shining at the football on the bowl
const card4 = (c: Ctx) => {
  eclipseSet(c, () => beamLit(c, [[392, 570], [760, 440], [760, 830], [392, 700]]), () => {});
  football(c, FX, FY, FR);
};
// setup.e2.1 : lime between torch and football; its small shadow on the football, measured with a ruler
const card5 = (c: Ctx) => {
  eclipseSet(c, () => beamLit(c, [[392, 570], [760, 440], [760, 830], [392, 700]]), () => shadowCone(c, [[520, 585], [650, 598], [650, 672], [520, 685]]));
  football(c, FX, FY, FR);
  // the small round shadow on the football, and a ruler lying across it
  c.beginPath(); ell(c, 648, FY, 24, 40); c.fillStyle = "rgba(14,10,34,0.75)"; c.fill();
  shape(c, () => polyP(c, [[690, 540], [722, 540], [722, 735], [690, 735]]), COL.wood, 5);
  for (let k = 0; k <= 16; k++) line(c, [[690, 548 + k * 11.5], [690 + (k % 5 === 0 ? 24 : 12), 548 + k * 11.5]], 3);
  limeOnPencil(c, 520, 635);
};
// setup.e2.2 : lime behind the football, all dark inside its big shadow
const card6 = (c: Ctx) => {
  eclipseSet(c, () => beamLit(c, [[392, 570], [1080, 330], [1080, 830], [392, 700]]), () => shadowCone(c, [[730, 505], [1080, 540], [1080, 735], [730, 765]]));
  football(c, FX, FY, FR);
  limeOnPencil(c, 920, 635, true);
  arrow(c, [[850, 450], [930, 480], [985, 545]], RED, 12);
};

// ---------------------------------------------------------------- the lentil measure
const SKY = "#2d3a6b", ROOF = "#3a2f5c", ROOF2 = "#4a3d70", MOONO = "#f6a23a", MOONW = "#f8f4e6", LENT = "#e0742c";
const cityNight = (c: Ctx, moonX: number, moonY: number, moonCol: string, moonDk: string, stars: boolean) => {
  ground(c, SKY);
  if (stars) for (let k = 0; k < 14; k++) { const sx = (k * 197 + 60) % 1000, sy = (k * 131 + 40) % 420; c.beginPath(); ell(c, sx, sy, 5, 5); c.fillStyle = "#fff6c8"; c.fill(); }
  c.beginPath(); ell(c, moonX, moonY, 135, 135); c.fillStyle = "rgba(255,226,122,0.16)"; c.fill();
  shape(c, () => ell(c, moonX, moonY, 100, 100), moonCol, 6); shade(c, () => ell(c, moonX, moonY, 100, 100), moonDk, 22, 18, 0.55);
  // rooftops, a water tank, little lit windows
  shape(c, () => polyP(c, [[330, 1080], [330, 700], [560, 700], [560, 1080]]), ROOF2, 6);
  shape(c, () => polyP(c, [[560, 1080], [560, 640], [800, 640], [800, 1080]]), ROOF, 6);
  shape(c, () => polyP(c, [[800, 1080], [800, 720], [1080, 720], [1080, 1080]]), ROOF2, 6);
  shape(c, () => rrect(c, 640, 560, 100, 80, 12), COL.steelDk, 6);
  line(c, [[660, 640], [660, 680]], 8); line(c, [[720, 640], [720, 680]], 8);
  for (let rx = 0; rx < 4; rx++) for (let ry = 0; ry < 3; ry++) { shape(c, () => rrect(c, 590 + rx * 55, 700 + ry * 70, 28, 36, 4), (rx + ry) % 2 ? LAMPY : "#5a4d82", 4); }
};
const girlWithLentil = (c: Ctx, a: [number, number], lentilWink = true) => {
  const gx = 230, gy = 1040, gh = 560;
  shadow(c, gx + 30, gy + 6, 130, 18);
  person(c, gx, gy, gh, { armR: a });
  const hd = gh * 0.13, hy = gy - gh * 0.74 - hd * 1.05;
  if (lentilWink) { // the eye towards the moon stays open, the other is shut
    shape(c, () => ell(c, gx - hd * 0.35, hy + hd * 0.12, hd * 0.2, hd * 0.2), SKIN.child, 0);
    line(c, [[gx - hd * 0.55, hy + hd * 0.14], [gx - hd * 0.15, hy + hd * 0.14]], 4);
  }
  const [wx, wy] = wrist(gx, gy, gh, "R", a);
  shape(c, () => ell(c, wx + 8, wy - 8, 24, 19, -0.5), LENT, 4.5);
  return [wx + 6, wy - 6];
};
const railing = (c: Ctx) => {
  shape(c, () => rrect(c, 0, 860, D, 24, 6), COL.woodDk, 6);
  for (let x = 40; x < D; x += 80) shape(c, () => rrect(c, x, 884, 22, 196, 5), COL.wood, 5);
  shape(c, () => rrect(c, 0, 1040, D, 40, 0), COL.woodDk, 6);
};
const lentilInset = (c: Ctx, moonCol: string) => {
  const x = 160, y = 160, r = 120;
  c.beginPath(); ell(c, x, y, r + 14, r + 14); c.fillStyle = WHITE; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.beginPath(); ell(c, x, y, r, r); c.fillStyle = SKY; c.fill();
  shape(c, () => ell(c, x, y, 78, 78), moonCol, 4);
  shape(c, () => ell(c, x + 2, y, 72, 62, -0.5), LENT, 5);
};

// setup.e3.0 : the full Moon rising, hide it behind a lentil at arm's length
const card7 = (c: Ctx) => {
  cityNight(c, 790, 520, MOONO, "#d9761f", false);
  const a: [number, number] = [-0.35, -0.35];
  girlWithLentil(c, a); railing(c);
  lentilInset(c, MOONO);
};
// setup.e3.1 : hours later the small white Moon is high, measured the same way
const card8 = (c: Ctx) => {
  cityNight(c, 790, 250, MOONW, "#b9b4ab", true);
  const a: [number, number] = [-0.75, -0.75];
  girlWithLentil(c, a); railing(c);
  lentilInset(c, MOONW);
};

// setup.e3.2 : two phone photos, the Moon the same small size in both
const phone = (c: Ctx, x: number, trees: boolean, moonCol: string, moonY: number) => {
  shadow(c, x + 200, 905, 210, 22);
  shape(c, () => rrect(c, x, 150, 400, 740, 44), COL.black, 7);
  shape(c, () => rrect(c, x + 22, 190, 356, 660, 20), SKY, 5);
  c.save(); c.beginPath(); rrect(c, x + 22, 190, 356, 660, 20); c.clip();
  c.beginPath(); ell(c, x + 200, moonY, 48, 48); c.fillStyle = moonCol; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  if (trees) {
    shape(c, () => polyP(c, [[x + 22, 850], [x + 22, 740], [x + 378, 740], [x + 378, 850]]), "#243a2c", 5);
    [[x + 80, 720, 70], [x + 170, 690, 80], [x + 270, 715, 72], [x + 345, 700, 60]].forEach(([tx, ty, tr]) => { shape(c, () => ell(c, tx, ty, tr, tr * 1.1), COL.leafDk, 5); });
  } else { for (let k = 0; k < 6; k++) { c.beginPath(); ell(c, x + 60 + ((k * 61) % 280), 240 + ((k * 97) % 300), 4, 4); c.fillStyle = "#fff6c8"; c.fill(); } }
  c.restore();
  shape(c, () => ell(c, x + 200, 870, 7, 7), COL.steelDk, 0);
};
// setup.e3.2
const card9 = (c: Ctx) => {
  ground(c, NIGHT);
  phone(c, 110, true, MOONO, 520); phone(c, 570, false, MOONW, 330);
  line(c, [[510, 470], [570, 470]], 14, RED); line(c, [[510, 520], [570, 520]], 14, RED);
};

export const su_skyMoonPhases = cards("sci.sky.moon-phases.L3 set-up", [card1, card2, card3, card4, card5, card6, card7, card8, card9]);
