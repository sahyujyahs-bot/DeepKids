import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, bowl, hand, person, write, rnd, cards } from "./flatKit";

// sci.senses.five-senses.L3 · set-up cards. Same child (blindfold, orange kurta), same grown-up (blue sleeve), same katori and toothpick tester on every card.

const SUGAR = "#fffdf6", SUGARDK = "#e3dccb", BAND = "#3fb1a8", BANDDK = "#2a8a83", SPICE = ["#b06a35", "#7a4a26", "#c98f4c"];

// ---------------------------------------------------------------- shared things
// a steel katori of sugar, a heap above the rim; spice = colour of a pinch stirred in
const sugarKatori = (c: Ctx, x: number, y: number, r: number, spice: string | null, seedN: number) => {
  bowl(c, x, y, r, SUGAR);
  const m = () => { c.moveTo(x - r * 0.92, y); c.bezierCurveTo(x - r * 0.7, y - r * 0.7, x + r * 0.7, y - r * 0.7, x + r * 0.92, y); c.ellipse(x, y, r * 0.92, r * 0.17, 0, 0, Math.PI); c.closePath(); };
  shape(c, m, SUGAR, 5);
  shade(c, m, SUGARDK, r * 0.3, r * 0.04, 0.9);
  const rd = rnd(seedN);
  for (let i = 0; i < 26; i++) { const a = rd() * Math.PI * 2, d = Math.sqrt(rd()) * 0.5; c.beginPath(); c.arc(x + Math.cos(a) * d * r * 1.4, y - r * 0.25 + Math.sin(a) * d * r * 0.3, 3, 0, 7); c.fillStyle = "#ffffff"; c.fill(); c.lineWidth = 1.5; c.strokeStyle = SUGARDK; c.stroke(); }
  if (spice) for (let i = 0; i < 30; i++) { const a = rd() * Math.PI * 2, d = Math.sqrt(rd()) * 0.42; c.beginPath(); c.arc(x + Math.cos(a) * d * r * 1.5, y - r * 0.26 + Math.sin(a) * d * r * 0.3, 4.5 + rd() * 2.5, 0, 7); c.fillStyle = spice; c.fill(); }
  c.beginPath(); c.ellipse(x, y, r, r * 0.2, 0, 0.12, Math.PI - 0.12); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
// a steel spoon from (x1, y1) (end of the handle) to the bowl centred at (x2, y2); sugar = a white heap in the bowl
const spoon = (c: Ctx, x1: number, y1: number, x2: number, y2: number, sugar = false, k = 1) => {
  const an = Math.atan2(y2 - y1, x2 - x1);
  line(c, [[x1, y1], [x2, y2]], 22 * k, INK); line(c, [[x1, y1], [x2, y2]], 11 * k, COL.steel);
  shape(c, () => ell(c, x2, y2, 46 * k, 30 * k, an), COL.steel, 6);
  if (sugar) shape(c, () => ell(c, x2 - 4, y2 - 9 * k, 34 * k, 20 * k, an), SUGAR, 4);
};

// the child's head, front on, big. blind = blindfold; wide = eyes wide open; mouth = open | o | smile
type Face = { blind?: boolean; wide?: boolean; mouth?: "open" | "o" | "smile" };
const bigFace = (c: Ctx, x: number, y: number, r: number, o: Face) => {
  const ry = r * 1.05, dk = SKIN.childDk;
  // shoulders and neck
  shape(c, () => rrect(c, x - r * 0.3, y + ry * 0.8, r * 0.6, r * 0.7, 14), dk);
  const sh = () => { c.moveTo(x - r * 2, 1100); c.bezierCurveTo(x - r * 2, y + ry + r * 0.5, x - r * 1.2, y + ry + r * 0.45, x - r * 0.35, y + ry + r * 0.3); c.lineTo(x + r * 0.35, y + ry + r * 0.3); c.bezierCurveTo(x + r * 1.2, y + ry + r * 0.45, x + r * 2, y + ry + r * 0.5, x + r * 2, 1100); c.closePath(); };
  shape(c, sh, CLOTH.child); shade(c, sh, CLOTH.childDk, r * 0.25, 0, 0.6);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.98, y + r * 0.1, r * 0.17, r * 0.26), SKIN.child, 6);
  const head = () => ell(c, x, y, r, ry);
  shape(c, head, SKIN.child, 7); shade(c, head, dk, r * 0.14, r * 0.06, 0.5);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, x + r * 0.98, y - r * 0.25, r * 0.3, r * 0.55), CLOTH.hair, 5);
  // eyes
  if (o.blind) {
    shape(c, () => rrect(c, x - r * 1.03, y - r * 0.12, r * 2.06, r * 0.46, 8), BAND, 6);
    shade(c, () => rrect(c, x - r * 1.03, y - r * 0.12, r * 2.06, r * 0.46, 8), BANDDK, 0, r * 0.2, 0.6);
    shape(c, () => ell(c, x + r * 1.05, y + r * 0.12, r * 0.13, r * 0.13), BANDDK, 5);
    line(c, [[x + r * 1.05, y + r * 0.2], [x + r * 1.2, y + r * 0.5]], 9, INK); line(c, [[x + r * 1.05, y + r * 0.2], [x + r * 1.2, y + r * 0.5]], 4, BAND);
    line(c, [[x - r * 0.62, y - r * 0.3], [x - r * 0.25, y - r * 0.38]], 7); line(c, [[x + r * 0.25, y - r * 0.38], [x + r * 0.62, y - r * 0.3]], 7);
  } else if (o.wide) {
    for (const s of [-1, 1]) { shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.08, r * 0.2, r * 0.25), WHITE, 6); shape(c, () => ell(c, x + s * r * 0.38, y + r * 0.1, r * 0.1, r * 0.13), INK, 0); line(c, [[x + s * r * 0.15, y - r * 0.38], [x + s * r * 0.4, y - r * 0.46], [x + s * r * 0.62, y - r * 0.36]], 7); }
  }
  // nose
  shape(c, () => ell(c, x, y + r * 0.4, r * 0.13, r * 0.1), SKIN.child, 5);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.05, y + r * 0.42, r * 0.025, r * 0.03), INK, 0);
  // mouth
  const my = y + r * 0.66;
  if (o.mouth === "open") { shape(c, () => ell(c, x, my, r * 0.3, r * 0.17), "#7a2f3a", 6); shape(c, () => ell(c, x, my + r * 0.07, r * 0.22, r * 0.08), COL.pink, 0); }
  else if (o.mouth === "o") shape(c, () => ell(c, x, my + r * 0.05, r * 0.15, r * 0.2), "#7a2f3a", 6);
  else { c.beginPath(); c.arc(x, my - r * 0.1, r * 0.2, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }
};

// a toothpick tester: a strip of cardboard from (x1, y1) (the tip end) to (x2, y2), two toothpicks pointing down from the tip end, gap px apart
const tester = (c: Ctx, x1: number, y1: number, x2: number, y2: number, gap: number, len = 130) => {
  for (const s of [-1, 1]) {
    const tx = x1 + s * gap / 2, ty = y1 + len;
    shape(c, () => polyP(c, [[tx - 11, y1], [tx + 11, y1], [tx, ty]]), COL.wood, 5);
    shade(c, () => polyP(c, [[tx - 11, y1], [tx + 11, y1], [tx, ty]]), COL.woodDk, 6, 0, 0.7);
  }
  const an = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(an) * 26, ny = Math.cos(an) * 26;
  shape(c, () => polyP(c, [[x1 - 30 + nx * 0, y1 - 26 + (nx ? 0 : 0)], [x2, y2 - 26], [x2, y2 + 26], [x1 - 30, y1 + 26]]), COL.brown, 6);
  shade(c, () => polyP(c, [[x1 - 30, y1 - 26], [x2, y2 - 26], [x2, y2 + 26], [x1 - 30, y1 + 26]]), "#7d5128", 0, 14, 0.6);
  void nx; void ny;
};

// a seated child on a stool, seat at about (x, y), height h; blindfolded. Returns the head centre.
const stool = (c: Ctx, x: number, y: number, h: number, floor: number) => {
  const top = y - h * 0.03, rx = h * 0.2;
  shadow(c, x + rx * 0.2, floor + 6, rx * 1.05, rx * 0.2);
  for (const s of [-0.75, 0.75]) shape(c, () => polyP(c, [[x + s * rx - 9, top], [x + s * rx * 1.25 - 9, floor], [x + s * rx * 1.25 + 9, floor], [x + s * rx + 9, top]]), COL.woodDk, 5);
  shape(c, () => rrect(c, x - rx, top - 6, rx * 2, h * 0.07, 10), COL.wood, 6);
};
const blindfold = (c: Ctx, x: number, hy: number, head: number) => {
  shape(c, () => rrect(c, x - head * 1.04, hy - head * 0.1, head * 2.08, head * 0.46, 6), BAND, 5);
  shade(c, () => rrect(c, x - head * 1.04, hy - head * 0.1, head * 2.08, head * 0.46, 6), BANDDK, 0, head * 0.2, 0.6);
  shape(c, () => ell(c, x - head * 1.05, hy + head * 0.12, head * 0.14, head * 0.14), BANDDK, 4);
};
const seatedChild = (c: Ctx, x: number, y: number, h: number, floor: number, p: { armL?: [number, number]; armR?: [number, number] } = {}) => {
  stool(c, x, y, h, floor);
  person(c, x, y, h, { sit: true, ...p });
  const head = h * 0.13, hy = y - h * 0.38 - head * 1.05;
  blindfold(c, x, hy, head);
  return { hy, head };
};
// the wrist of a person() arm with joint angles a1, a2
const wrist = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number], sit = false) => {
  const sx = x + side * h * 0.11, sy = (sit ? y - h * 0.38 : y - h * 0.74) + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
const footprint = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => ell(c, 0, 8, 13, 16), BAND, 4);
  shape(c, () => ell(c, 0, -12, 15, 13), BAND, 4);
  for (let k = -2; k <= 2; k++) shape(c, () => ell(c, k * 6.5, -28 - (2 - Math.abs(k)) * 1.5, 3.4, 3.4), BAND, 3);
  c.restore();
};


// the child's own thumb and finger, coming from the lower right at angle rot: pinching the nose (gap 0) or let go and opened (gap > 0), shifted dx away
const pinch = (c: Ctx, nx: number, ny: number, gap: number, dx: number, rot = -0.3) => {
  c.save(); c.translate(nx, ny); c.rotate(rot);
  const bx = 150 + dx, tipX = 14 + dx;
  for (const s of [-1, 1]) {
    const pts = [[bx, s * 34], [tipX, s * (13 + gap)]];
    line(c, pts, 46, INK); line(c, pts, 34, SKIN.child);
  }
  shape(c, () => rrect(c, bx - 10, -62, 110, 124, 36), SKIN.child, 6);
  shape(c, () => rrect(c, bx + 90, -78, 260, 156, 14), CLOTH.child, 6);
  c.restore();
};

// ---------------------------------------------------------------- experiment 1: taste and smell
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6d3ad"; c.fillRect(0, 770, 1080, 400); line(c, [[0, 770], [1080, 770]], 6);
  const xs = [140, 400, 660, 920];
  sugarKatori(c, xs[0], 730, 118, SPICE[0], 3); sugarKatori(c, xs[1], 730, 118, SPICE[1], 4); sugarKatori(c, xs[2], 730, 118, SPICE[2], 5); sugarKatori(c, xs[3], 730, 118, null, 6);
  // a pinch of powder falling into the first, from the grown-up's fingers
  hand(c, 150, 210, Math.PI / 2, 1.9, SKIN.adult, CLOTH.adult, false);
  for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(130 + (i % 3) * 16, 440 + Math.floor(i / 3) * 42 + (i % 2) * 8, 6.5, 0, 7); c.fillStyle = SPICE[0]; c.fill(); }
  // a spoon stirring the third, with a red circle arrow
  spoon(c, 800, 390, 690, 690, false);
  arrow(c, [[570, 540], [620, 500], [690, 490], [760, 510], [790, 560]], RED, 10);
};
// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  bigFace(c, 440, 480, 235, { blind: true, mouth: "open" });
  // the child's own thumb and finger pinch the nose shut
  pinch(c, 440, 574, 0, 0);
  // the grown-up's hand puts a spoon of sugar on her tongue
  spoon(c, 127, 859, 400, 668, true);
  hand(c, 28, 918, -0.56, 1.6, SKIN.adult, CLOTH.adult, false);
};
// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  bigFace(c, 440, 480, 235, { wide: true, mouth: "o" });
  // the thumb and finger let go of the nose and open, moving away, with a red arrow
  pinch(c, 440, 574, 30, 150);
  arrow(c, [[610, 700], [760, 660]], RED, 10);
  // smell: wavy lines rising from the mouth up into the nose
  for (const s of [-1, 1]) {
    const pts: number[][] = []; for (let k = 0; k <= 26; k++) pts.push([440 + s * (110 - k * 1.2) + Math.sin(k * 0.55) * 16, 740 - k * 6.5]);
    line(c, pts, 17, INK); line(c, pts, 9, COL.orange);
    arrow(c, [pts[24], pts[26]], COL.orange, 9);
  }
};

// ---------------------------------------------------------------- experiment 2: two points on the skin
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const gaps = [0.5, 1, 2, 4], k = 130, x0 = 150;
  gaps.forEach((g, i) => {
    const y = 290 + i * 160, band = () => polyP(c, [[x0 - 70, y - 38], [x0 + 6.5 * k, y - 38], [x0 + 6.5 * k, y + 38], [x0 - 70, y + 38]]);
    shape(c, band, COL.brown, 6); shade(c, band, "#7d5128", 0, 22, 0.6);
    line(c, [[x0 - 40, y - 6], [x0 + 6.5 * k - 30, y - 6]], 3, "#8d5528");
    for (const px of [x0, x0 + g * k]) {
      const st = () => polyP(c, [[px - 11, y - 38], [px + 11, y - 38], [px + 2, y - 135], [px - 2, y - 135]]);
      shape(c, st, COL.wood, 5); shade(c, st, COL.woodDk, 8, 0, 0.7);
      shape(c, () => polyP(c, [[px - 2.6, y - 118], [px + 2.6, y - 118], [px, y - 142]]), INK, 0);
    }
  });
  // the ruler under them, zero under the first toothpick
  const ry = 930;
  shadow(c, 560, ry + 84, 470, 14);
  shape(c, () => polyP(c, [[x0 - 70, ry], [x0 + 6.5 * k, ry], [x0 + 6.5 * k, ry + 82], [x0 - 70, ry + 82]]), COL.wood, 6);
  for (let mm = 0; mm <= 60; mm++) { const x = x0 + mm * 13, h = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 13; line(c, [[x, ry], [x, ry + h]], mm % 10 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= 5; cm++) write(c, String(cm), x0 + cm * k - 10, ry + 40, 30, INK, 5);
  write(c, "cm", x0 + 5.7 * k, ry + 48, 24, INK, 4);
  // the gap between the toothpicks of each tester: a red bar
  gaps.forEach((g, i) => { const y = 290 + i * 160 - 82; line(c, [[x0, y], [x0 + g * k, y]], 7, RED); line(c, [[x0, y - 12], [x0, y + 12]], 7, RED); line(c, [[x0 + g * k, y - 12], [x0 + g * k, y + 12]], 7, RED); });
};
// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  // the child, eyes shut, at the upper left, her arm coming down to the hand held out flat
  shape(c, () => rrect(c, 40, 360, 250, 400, 50), CLOTH.child);
  shape(c, () => ell(c, 165, 230, 120, 126), SKIN.child, 7);
  shape(c, () => { c.moveTo(45, 230); c.bezierCurveTo(45, 70, 285, 70, 285, 230); c.quadraticCurveTo(165, 160, 45, 230); c.closePath(); }, CLOTH.hair, 6);
  line(c, [[95, 250], [135, 262]], 7); line(c, [[195, 262], [235, 250]], 7);
  c.beginPath(); c.arc(165, 300, 24, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  // her big hand, fingers out to the right: the longest fingertip is touched
  hand(c, 330, 790, 0, 2.6, SKIN.child, CLOTH.child, true);
  // the grown-up holds the two-point tester and touches the fingertip with both points
  tester(c, 530, 572, 960, 400, 64, 146);
  hand(c, 1010, 380, 2.95, 1.5, SKIN.adult, CLOTH.adult, false);
  arrow(c, [[400, 470], [450, 580]], RED, 10);
};
// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  // the child's back and the back of her head
  shadow(c, 540, 1050, 380, 22);
  const body = () => { c.moveTo(200, 1000); c.lineTo(200, 640); c.bezierCurveTo(200, 500, 330, 470, 520, 470); c.bezierCurveTo(710, 470, 840, 500, 840, 640); c.lineTo(840, 1000); c.closePath(); };
  shape(c, body, CLOTH.child); shade(c, body, CLOTH.childDk, 40, 0, 0.6);
  line(c, [[520, 560], [520, 980]], 4, CLOTH.childDk);
  shape(c, () => rrect(c, 160, 990, 720, 50, 14), COL.wood, 6);
  shape(c, () => rrect(c, 460, 380, 120, 120, 20), SKIN.childDk);
  for (const s of [-1, 1]) shape(c, () => ell(c, 520 + s * 140, 310, 26, 44), SKIN.child, 6);
  shape(c, () => ell(c, 520, 290, 142, 150), CLOTH.hair, 7);
  line(c, [[520, 150], [520, 230]], 4, "#4a3f6a");
  shape(c, () => ell(c, 520, 135, 52, 40), CLOTH.hair, 6);
  // a small question mark: she is puzzled
  c.beginPath(); c.arc(790, 220, 36, Math.PI * 1.1, Math.PI * 2.55); c.quadraticCurveTo(790, 285, 790, 300); c.strokeStyle = INK; c.lineWidth = 12; c.lineCap = "round"; c.stroke();
  c.beginPath(); c.arc(790, 345, 8, 0, 7); c.fillStyle = INK; c.fill();
  // the widest tester touching her upper back
  tester(c, 560, 580, 940, 480, 140, 125);
  hand(c, 1050, 480, 2.95, 1.3, SKIN.adult, CLOTH.adult, false);
};

// ---------------------------------------------------------------- experiment 3: where does a sound come from
// the floor for the 8 places: a ring of footprints round the stool
const places = (c: Ctx, cx: number, cy: number, rx: number, ry: number, front: boolean) => {
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.39, px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry;
    if ((Math.sin(a) > 0) === front) footprint(c, px, py, a + Math.PI / 2 - 0.15 * Math.cos(a), 1.5);
  }
};
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 540, 690, 510, 310), "#e6d3ad", 6);
  places(c, 540, 700, 400, 235, false);
  seatedChild(c, 540, 640, 560, 880, { armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  places(c, 540, 700, 400, 235, true);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  line(c, [[0, 940], [1080, 940]], 6);
  // two big grown-up hands, each holding a steel spoon, clicking the spoons together
  const cx = 660, cy = 400, k = 1.5;
  for (const [wx, wy] of [[1010, 110], [1010, 700]]) {
    const d = Math.atan2(cy - wy, cx - wx);
    spoon(c, wx, wy, cx + (wy < cy ? -8 : 8), cy + (wy < cy ? -10 : 10), false, k);
    hand(c, wx - Math.cos(d) * 10, wy - Math.sin(d) * 10, d, 1.6, SKIN.adult, CLOTH.adult, false);
  }
  for (const a of [-3.2, -2.7, -2.2, -1.7]) line(c, [[cx + Math.cos(a) * 80, cy + Math.sin(a) * 80], [cx + Math.cos(a) * 140, cy + Math.sin(a) * 140]], 9, RED);
  // the blindfolded child, small, pointing at the sound
  const aR: [number, number] = [-0.7, -0.45];
  seatedChild(c, 250, 800, 460, 940, { armL: [Math.PI * 0.5, Math.PI * 0.5], armR: aR });
  const w = wrist(250, 800, 460, 1, aR, true);
  hand(c, w[0] - 20, w[1] + 5, -0.45, 1.0, SKIN.child, CLOTH.child, true);
};
// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  const x = 420, y = 520, r = 200;
  bigFace(c, x, y, r, { blind: true, mouth: "o" });
  // her right arm pointing out to the side, the hand flat
  line(c, [[x + r * 1.3, 1000], [x + r * 1.55, 720]], 60, INK); line(c, [[x + r * 1.3, 1000], [x + r * 1.55, 720]], 48, CLOTH.child);
  hand(c, x + r * 1.55 + 10, 700, -0.3, 1.6, SKIN.child, CLOTH.child, true);
  // her left palm pressed flat over her left ear
  line(c, [[x - r * 1.5, 1000], [x - r * 1.0, 700]], 60, INK); line(c, [[x - r * 1.5, 1000], [x - r * 1.0, 700]], 48, CLOTH.child);
  hand(c, x - r * 0.72, y + r * 0.28, -1.5, 1.8, SKIN.child, CLOTH.child, true);
  // the click still reaches the open ear: red sound lines from the right
  for (let i = 0; i < 3; i++) { const rr = 90 + i * 55; c.beginPath(); c.arc(x + r * 2.2, y - r * 0.9, rr, Math.PI * 0.62, Math.PI * 0.95); c.strokeStyle = RED; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); }
};

export const su_sensesFiveSenses = cards("sci.senses.five-senses.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
