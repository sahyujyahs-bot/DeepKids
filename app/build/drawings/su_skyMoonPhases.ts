import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SH, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, bowl, write, cards } from "./flatKit";

const NIGHT = "#2c2748", FLOOR = "#3d3560", PALE = "#f6f0dc", DARKB = "#443d66", LAMPY = "#ffe27a";

// a pencil from (x1,y1) to (x2,y2)
const pencil = (c: Ctx, x1: number, y1: number, x2: number, y2: number) => { line(c, [[x1, y1], [x2, y2]], 24, INK); line(c, [[x1, y1], [x2, y2]], 14, COL.wood); };
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


// ---------------------------------------------------------------- the lamp-and-ball set-up, seen from above
// the child's head (the Earth) is at HX, HY on every card; the lamp (the Sun) is far on the left
const HX = 620, HY = 540, BR = 62;
// the lamp from above: a glowing bulb with rays, and light streaking across the floor
const lampTop = (c: Ctx, x: number, y: number) => {
  for (const yy of [230, 350, 470, 590, 710, 830, 950]) line(c, [[x + 100, yy], [1060, yy]], 8, "rgba(255,226,122,0.16)");
  c.beginPath(); ell(c, x, y, 230, 230); c.fillStyle = "rgba(255,226,122,0.16)"; c.fill();
  c.beginPath(); ell(c, x, y, 150, 150); c.fillStyle = "rgba(255,226,122,0.25)"; c.fill();
  for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; line(c, [[x + Math.cos(a) * 70, y + Math.sin(a) * 70], [x + Math.cos(a) * 105, y + Math.sin(a) * 105]], 8, LAMPY); }
  shape(c, () => ell(c, x, y, 54, 54), LAMPY, 6);
  shine(c, [[x - 28, y - 16], [x - 14, y - 32]], 9);
};
// the child seen from above, facing angle an (0 = right, PI = left); right hand holds the pencil and ball out
const topChild = (c: Ctx, an: number) => {
  c.save(); c.translate(HX, HY); c.rotate(an);
  const sh = () => ell(c, 0, 0, 52, 112);
  shape(c, () => ell(c, 6, -96, 44, 20), CLOTH.child, 5); shape(c, () => ell(c, 50, -98, 14, 14), SKIN.child, 4);
  shape(c, sh, CLOTH.child); shade(c, sh, CLOTH.childDk, 14, 0, 0.7);
  line(c, [[0, 92], [118, 66]], 52, INK); line(c, [[0, 92], [118, 66]], 40, CLOTH.child);
  pencil(c, 110, 66, 320, 66);
  hand(c, 118, 66, 0, 1.0);
  shape(c, () => ell(c, 0, -70, 12, 18), SKIN.child, 4); shape(c, () => ell(c, 0, 70, 12, 18), SKIN.child, 4);
  shape(c, () => ell(c, 72, 0, 12, 10), SKIN.child, 4);
  const head = () => ell(c, 0, 0, 70, 70);
  shape(c, head, SKIN.child);
  c.save(); c.beginPath(); head(); c.clip(); shape(c, () => ell(c, -24, 0, 62, 76), CLOTH.hair, 0); c.restore();
  c.beginPath(); head(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  c.restore();
  const ca = Math.cos(an), sa = Math.sin(an);
  return [HX + 320 * ca - 66 * sa, HY + 320 * sa + 66 * ca];
};
const lampCard = (c: Ctx, an: number, inLit: Lit) => {
  ground(c, FLOOR);
  lampTop(c, 90, HY);
  const [bx, by] = topChild(c, an);
  c.beginPath(); ell(c, bx + 36, by + 44, BR, BR * 0.9); c.fillStyle = SH; c.fill();
  ball(c, bx, by, BR, "left");
  inset(c, 930, 170, 95, inLit);
};

// setup.e1.0 : facing the lamp, ball held toward it -> the side facing her is dark, a new Moon
const card1 = (c: Ctx) => lampCard(c, Math.PI, "none");
// setup.e1.1 : a quarter turn left, the lamp at her right side -> she sees the right half lit, a half Moon
const card2 = (c: Ctx) => {
  lampCard(c, Math.PI / 2, "right");
  arrow(c, [0, 1, 2, 3, 4, 5].map((k) => { const a = 3.0 - k * 0.16; return [HX + 175 * Math.cos(a), HY + 175 * Math.sin(a)]; }), RED, 12);
};
// setup.e1.2 : back to the lamp, ball held out in front -> the lit side is the side facing her, a full Moon
const card3 = (c: Ctx) => lampCard(c, 0, "full");


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
const shadowCone = (c: Ctx, pts: number[][], a = 0.62) => { c.beginPath(); polyP(c, pts); c.fillStyle = `rgba(14,10,34,${a})`; c.fill(); };
const lime = (c: Ctx, x: number, y: number, dark = false) => {
  const b = () => ell(c, x, y, 52, 52);
  shape(c, b, dark ? "#3f6232" : "#9ccf62", 6); if (!dark) { shade(c, b, COL.green, 14, 14, 0.7); shine(c, [[x - 30, y - 18], [x - 14, y - 34]], 8); }
  shape(c, () => ell(c, x, y - 50, 9, 6), dark ? "#3f6232" : COL.greenDk, 4);
};
const limeOnPencil = (c: Ctx, x: number, y: number, dark = false) => {
  pencil(c, x, 890, x, y + 30); lime(c, x, y, dark); hand(c, x, 965, -Math.PI / 2, 1.5);
};


// setup.e2.0 : torch shining at the football on the bowl
const card4 = (c: Ctx) => {
  eclipseSet(c, () => beamLit(c, [[392, 570], [760, 440], [760, 830], [392, 700]]), () => {});
  football(c, FX, FY, FR);
};
// setup.e2.1 : lime between torch and football; its small round shadow on the football, measured with a ruler
const card5 = (c: Ctx) => {
  eclipseSet(c, () => beamLit(c, [[392, 570], [760, 440], [760, 830], [392, 700]]), () => shadowCone(c, [[520, 585], [655, 592], [655, 678], [520, 685]]));
  football(c, FX, FY, FR);
  // the small round shadow on the football, 7 cm wide, with a ruler lying under it and red lines carrying its edges down to the ruler
  c.beginPath(); ell(c, 655, FY, 41, 50); c.fillStyle = "rgba(14,10,34,0.8)"; c.fill();
  line(c, [[614, FY + 52], [614, 706]], 5, RED); line(c, [[696, FY + 52], [696, 706]], 5, RED);
  shape(c, () => rrect(c, 590, 704, 280, 40, 4), COL.wood, 5);
  for (let k = 0; k <= 22; k++) line(c, [[614 + k * 11.8, 704], [614 + k * 11.8, k % 5 === 0 ? 730 : 718]], 3);
  write(c, "7 cm", 625, 756, 34, INK, 6);
  limeOnPencil(c, 520, 635);
};
// setup.e2.2 : lime behind the football, dark inside its big shadow
const card6 = (c: Ctx) => {
  eclipseSet(c, () => beamLit(c, [[392, 570], [1080, 330], [1080, 830], [392, 700]]), () => shadowCone(c, [[730, 505], [1080, 470], [1080, 800], [730, 765]], 0.85));
  football(c, FX, FY, FR);
  limeOnPencil(c, 930, 635, true);
  arrow(c, [[1010, 380], [1000, 450], [945, 530]], RED, 12);
};

// ---------------------------------------------------------------- the lentil measure
const SKY = "#2d3a6b", ROOF = "#3a2f5c", ROOF2 = "#4a3d70", MOONO = "#f6a23a", MOONW = "#f8f4e6", LENTIL = "#d9532a";
const MX = 470, MR = 74, LR = 54;
// the Moon: flat disc, shade side, a few craters
const moonDisc = (c: Ctx, x: number, y: number, r: number, col: string, dk: string) => {
  const b = () => ell(c, x, y, r, r);
  shape(c, b, col, 6); shade(c, b, dk, r * 0.22, r * 0.18, 0.55);
  [[-0.3, -0.25, 0.2], [0.25, 0.1, 0.16], [-0.1, 0.45, 0.13]].forEach(([u, v, k]) => { c.beginPath(); ell(c, x + u * r, y + v * r, k * r, k * r * 0.8); c.fillStyle = "rgba(43,35,64,0.22)"; c.fill(); });
};
const cityNight = (c: Ctx, moonY: number, moonCol: string, moonDk: string, stars: boolean) => {
  ground(c, SKY);
  if (stars) for (let k = 0; k < 16; k++) { const sx = (k * 197 + 60) % 1000, sy = (k * 131 + 40) % 520; c.beginPath(); ell(c, sx, sy, 5, 5); c.fillStyle = "#fff6c8"; c.fill(); }
  c.beginPath(); ell(c, MX, moonY, 112, 112); c.fillStyle = "rgba(255,226,122,0.10)"; c.fill();
  moonDisc(c, MX, moonY, MR, moonCol, moonDk);
  shape(c, () => polyP(c, [[330, 1080], [330, 760], [560, 760], [560, 1080]]), ROOF2, 6);
  shape(c, () => polyP(c, [[560, 1080], [560, 700], [800, 700], [800, 1080]]), ROOF, 6);
  shape(c, () => polyP(c, [[800, 1080], [800, 780], [1080, 780], [1080, 1080]]), ROOF2, 6);
  shape(c, () => rrect(c, 640, 620, 100, 80, 12), COL.steelDk, 6);
  line(c, [[660, 700], [660, 720]], 8); line(c, [[720, 700], [720, 720]], 8);
  for (let rx = 0; rx < 4; rx++) for (let ry = 0; ry < 3; ry++) { shape(c, () => rrect(c, 590 + rx * 55, 750 + ry * 80, 28, 36, 4), (rx + ry) % 2 ? LAMPY : "#5a4d82", 4); }
};
const railing = (c: Ctx) => {
  shape(c, () => rrect(c, 0, 860, D, 24, 6), COL.woodDk, 6);
  for (let x = 40; x < D; x += 80) shape(c, () => rrect(c, x, 884, 22, 196, 5), COL.wood, 5);
  shape(c, () => rrect(c, 0, 1040, D, 40, 0), COL.woodDk, 6);
};
// a big close-up arm and hand holding one masoor dal at arm's length exactly in front of the Moon
const lentilHeld = (c: Ctx, moonY: number) => {
  const an = Math.atan2(moonY - 1100, MX - 0), s = 1.5, dx = Math.cos(an), dy = Math.sin(an);
  const wx = MX - dx * 100 * s, wy = moonY - dy * 100 * s;
  line(c, [[wx - dx * 1500, wy - dy * 1500], [wx - dx * 60, wy - dy * 60]], 108 + 12, INK); line(c, [[wx - dx * 1500, wy - dy * 1500], [wx - dx * 60, wy - dy * 60]], 108, CLOTH.child);
  hand(c, wx, wy, an, s);
  const b = () => ell(c, MX, moonY, LR, LR);
  shape(c, b, LENTIL, 6); shade(c, b, "#a8381a", 14, 12, 0.6);
  shine(c, [[MX - 34, moonY - 20], [MX - 20, moonY - 36]], 8);
  line(c, [[MX - 4, moonY + 30], [MX + 14, moonY + 8], [MX + 10, moonY - 14]], 4, "#a8381a");
};

// setup.e3.0 : the full Moon rising, hidden behind a dal held at arm's length
const card7 = (c: Ctx) => {
  cityNight(c, 600, MOONO, "#d9761f", false); railing(c); lentilHeld(c, 600);
};
// setup.e3.1 : hours later the Moon is high, hidden behind the same dal the same way
const card8 = (c: Ctx) => {
  cityNight(c, 240, MOONW, "#b9b4ab", true); railing(c); lentilHeld(c, 240);
};

// setup.e3.2 : two phone photos, the Moon the same size in both
const phone = (c: Ctx, x: number, trees: boolean, moonCol: string, moonDk: string, moonY: number) => {
  shadow(c, x + 200, 856, 210, 22);
  shape(c, () => rrect(c, x, 110, 400, 730, 44), COL.black, 7);
  shape(c, () => rrect(c, x + 22, 150, 356, 640, 20), SKY, 5);
  c.save(); c.beginPath(); rrect(c, x + 22, 150, 356, 640, 20); c.clip();
  if (trees) {
    shape(c, () => polyP(c, [[x + 22, 790], [x + 22, 700], [x + 378, 700], [x + 378, 790]]), "#243a2c", 5);
    [[x + 80, 690, 70], [x + 170, 660, 80], [x + 270, 685, 72], [x + 345, 670, 60]].forEach(([tx, ty, tr]) => { shape(c, () => ell(c, tx, ty, tr, tr * 1.1), COL.leafDk, 5); });
  } else { for (let k = 0; k < 6; k++) { c.beginPath(); ell(c, x + 60 + ((k * 61) % 280), 200 + ((k * 97) % 300), 4, 4); c.fillStyle = "#fff6c8"; c.fill(); } }
  moonDisc(c, x + 200, moonY, 60, moonCol, moonDk);
  c.restore();
  // a red bracket under the Moon: the same width in both photos
  const by = moonY + 92;
  line(c, [[x + 140, by], [x + 260, by]], 8, RED); line(c, [[x + 140, by - 14], [x + 140, by + 14]], 8, RED); line(c, [[x + 260, by - 14], [x + 260, by + 14]], 8, RED);
  hand(c, x + 200, 930, -Math.PI / 2, 1.4);
};
// setup.e3.2
const card9 = (c: Ctx) => {
  ground(c, NIGHT);
  phone(c, 110, true, MOONO, "#d9761f", 450); phone(c, 570, false, MOONW, "#b9b4ab", 300);
  line(c, [[512, 440], [568, 440]], 14, RED); line(c, [[512, 490], [568, 490]], 14, RED);
};

export const su_skyMoonPhases = cards("sci.sky.moon-phases.L3 set-up", [card1, card2, card3, card4, card5, card6, card7, card8, card9]);
