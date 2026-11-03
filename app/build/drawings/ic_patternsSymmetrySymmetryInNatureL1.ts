import type { Ctx } from "./core";
import { INK, BG, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, line, shine, leaf, plate, hand, person, cards } from "./flatKit";

// SYMMETRY IN NATURE L1 · flat set-up cards: the Mirror Test things on a table, a mirror standing on a
// butterfly's middle line, two heaps; then a girl and her mirror image, a folded dosa, a mirror on the
// letters A and F, and a woman's face beside two mirror-made faces.
// The standing-mirror cards are drawn as the child sees them, looking in from one side: the paper lies
// in front of the mirror, foreshortened, and the mirror shows the near half flipped about its bottom edge.

const PI = Math.PI;
const TABLE = COL.wood, FLOOR = "#d9c7a6", MIRROR = COL.sky, FRAME = COL.teal, DOSA = "#e9b65b", DOSADK = "#c98a3a";

// ---------------------------------------------------------------- things
// a sheet of paper lying flat, centre (x, y), turned by an; draw() puts something on it (in paper coordinates)
const paper = (c: Ctx, x: number, y: number, w: number, h: number, an = 0, draw?: () => void) => {
  c.save(); c.translate(x, y); c.rotate(an);
  c.fillStyle = SH; c.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 8), COL.paper, 5);
  if (draw) draw();
  c.restore();
};
// a butterfly, body centre (x, y), head up, half wingspan s: the two sides are exact mirror copies
const butterfly = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y);
  const lw = Math.max(3, s * 0.035);
  for (const sd of [-1, 1]) {
    c.save(); c.scale(sd, 1);
    const fore = () => { c.moveTo(s * 0.08, -s * 0.1); c.quadraticCurveTo(s * 0.5, -s * 0.95, s * 0.98, -s * 0.78); c.quadraticCurveTo(s * 1.02, -s * 0.3, s * 0.6, s * 0.02); c.quadraticCurveTo(s * 0.3, s * 0.08, s * 0.08, s * 0.02); c.closePath(); };
    const hind = () => { c.moveTo(s * 0.08, s * 0.05); c.quadraticCurveTo(s * 0.55, s * 0.05, s * 0.78, s * 0.4); c.quadraticCurveTo(s * 0.7, s * 0.8, s * 0.35, s * 0.72); c.quadraticCurveTo(s * 0.1, s * 0.6, s * 0.08, s * 0.3); c.closePath(); };
    shape(c, hind, COL.red, lw);
    shape(c, fore, COL.orange, lw);
    shape(c, () => ell(c, s * 0.58, -s * 0.5, s * 0.13, s * 0.13), WHITE, lw * 0.8);
    shape(c, () => ell(c, s * 0.58, -s * 0.5, s * 0.05, s * 0.05), INK, 0);
    shape(c, () => ell(c, s * 0.42, s * 0.4, s * 0.09, s * 0.09), COL.yellow, lw * 0.8);
    c.restore();
  }
  shape(c, () => ell(c, 0, s * 0.05, s * 0.09, s * 0.5), COL.black, lw);
  shape(c, () => ell(c, 0, -s * 0.5, s * 0.12, s * 0.12), COL.black, lw);
  for (const sd of [-1, 1]) { line(c, [[0, -s * 0.58], [sd * s * 0.22, -s * 0.9]], lw); shape(c, () => ell(c, sd * s * 0.22, -s * 0.9, s * 0.04, s * 0.04), INK, 0); }
  c.restore();
};
// big letters, centre (x, y), height s
const letterA = (c: Ctx, x: number, y: number, s: number, w: number) => { line(c, [[x - s * 0.5, y + s * 0.5], [x, y - s * 0.5], [x + s * 0.5, y + s * 0.5]], w); line(c, [[x - s * 0.27, y + s * 0.05], [x + s * 0.27, y + s * 0.05]], w); };
const letterF = (c: Ctx, x: number, y: number, s: number, w: number) => { line(c, [[x - s * 0.3, y + s * 0.5], [x - s * 0.3, y - s * 0.5], [x + s * 0.35, y - s * 0.5]], w); line(c, [[x - s * 0.3, y], [x + s * 0.2, y]], w); };
// a steel spoon lying flat, centre (x, y), length len, the bowl at angle an
const spoon = (c: Ctx, x: number, y: number, len: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 8, 10, len * 0.5, len * 0.12);
  shape(c, () => rrect(c, -len * 0.5, -len * 0.04, len * 0.68, len * 0.08, len * 0.04), COL.steel, 5);
  shape(c, () => ell(c, len * 0.3, 0, len * 0.2, len * 0.135), COL.steel, 5);
  shade(c, () => ell(c, len * 0.3, 0, len * 0.2, len * 0.135), COL.steelDk, len * 0.06, len * 0.04);
  shape(c, () => ell(c, len * 0.3, 0, len * 0.14, len * 0.09), COL.steelIn, 3);
  shine(c, [[-len * 0.4, -len * 0.01], [-len * 0.08, -len * 0.01]], 6);
  c.restore();
};
// one chappal (for a left foot, so it is not symmetric), centre (x, y), length L, toe pointing up before turning by an
const chappal = (c: Ctx, x: number, y: number, L: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  const sole = () => { c.moveTo(-L * 0.2, -L * 0.28); c.quadraticCurveTo(-L * 0.22, -L * 0.56, L * 0.02, -L * 0.52); c.quadraticCurveTo(L * 0.22, -L * 0.48, L * 0.17, -L * 0.22); c.quadraticCurveTo(L * 0.1, 0, L * 0.15, L * 0.25); c.quadraticCurveTo(L * 0.17, L * 0.52, 0, L * 0.52); c.quadraticCurveTo(-L * 0.17, L * 0.52, -L * 0.15, L * 0.25); c.quadraticCurveTo(-L * 0.11, 0, -L * 0.2, -L * 0.28); c.closePath(); };
  shadow(c, 10, 12, L * 0.24, L * 0.52);
  shape(c, sole, COL.brown, 6);
  c.save(); c.scale(0.82, 0.9); shape(c, sole, "#e2b06a", 4); c.restore();
  const post: number[] = [L * 0.02, -L * 0.22];
  for (const [ex, ey] of [[-L * 0.19, L * 0.04], [L * 0.17, L * 0.04]]) { line(c, [post, [ex, ey]], 22, INK); line(c, [post, [ex, ey]], 12, COL.red); }
  shape(c, () => ell(c, post[0], post[1], L * 0.04, L * 0.04), COL.red, 4);
  c.restore();
};
// a brass door key lying flat, centre (x, y), length L, pointing at an; bg shows through the hole in the bow
const key = (c: Ctx, x: number, y: number, L: number, an: number, bg: string) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shadow(c, 6, 10, L * 0.5, L * 0.14);
  shape(c, () => rrect(c, -L * 0.15, -L * 0.05, L * 0.65, L * 0.1, L * 0.03), COL.yellow, 5);
  shape(c, () => rrect(c, L * 0.27, 0, L * 0.08, L * 0.17, 3), COL.yellow, 5);
  shape(c, () => rrect(c, L * 0.4, 0, L * 0.08, L * 0.13), COL.yellow, 5);
  shape(c, () => ell(c, -L * 0.3, 0, L * 0.2, L * 0.2), COL.yellow, 5);
  shade(c, () => ell(c, -L * 0.3, 0, L * 0.2, L * 0.2), COL.woodDk, L * 0.07, L * 0.05);
  shape(c, () => ell(c, -L * 0.3, 0, L * 0.07, L * 0.07), bg, 4);
  c.restore();
};
// a small framed hand mirror lying flat, centre (x, y)
const mirrorFlat = (c: Ctx, x: number, y: number, w: number, h: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  c.fillStyle = SH; c.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 16), FRAME, 6);
  shape(c, () => rrect(c, -w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 8), MIRROR, 4);
  shine(c, [[-w * 0.25, -h * 0.3], [w * 0.1, h * 0.25]], 8);
  c.restore();
};
// a child's face looking straight ahead (for the passport photo), centre (x, y), radius r
const kidFace = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => rrect(c, x - r * 0.4, y + r * 0.8, r * 0.8, r * 0.6, r * 0.2), SKIN.child, 4);
  shape(c, () => rrect(c, x - r * 1.3, y + r * 1.2, r * 2.6, r * 1.2, r * 0.4), CLOTH.child, 4);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child, 4);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, x - r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, x + r * 0.35, y + r * 0.12, r * 0.09, r * 0.12), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 3; c.stroke();
};
// a photo print: a white card with a pale blue background and a face
const photo = (c: Ctx, x: number, y: number, w: number, h: number, an: number, face: () => void) => {
  c.save(); c.translate(x, y); c.rotate(an);
  c.fillStyle = SH; c.fillRect(-w / 2 + 8, -h / 2 + 10, w, h);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), WHITE, 5);
  c.save(); c.beginPath(); c.rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24); c.clip(); c.fillStyle = "#dcebf7"; c.fillRect(-w / 2, -h / 2, w, h); face(); c.restore();
  line(c, [[-w / 2 + 12, -h / 2 + 12], [w / 2 - 12, -h / 2 + 12], [w / 2 - 12, h / 2 - 12], [-w / 2 + 12, h / 2 - 12], [-w / 2 + 12, -h / 2 + 12]], 3);
  c.restore();
};
// a framed mirror standing upright, seen face on: glass from x0 to x1, its bottom edge on the line y = base.
// reflect() draws what the glass shows (clipped to the glass); the frame runs round three sides only
const mirrorUp = (c: Ctx, x0: number, x1: number, base: number, top: number, reflect: () => void) => {
  const fw = 20;
  c.save(); c.beginPath(); c.rect(x0, top, x1 - x0, base - top); c.clip();
  c.fillStyle = MIRROR; c.fillRect(x0, top, x1 - x0, base - top);
  reflect();
  c.fillStyle = "rgba(191,224,245,0.3)"; c.fillRect(x0, top, x1 - x0, base - top);
  shine(c, [[x1 - 70, top + 20], [x1 - 25, top + 90]], 8);
  c.restore();
  shape(c, () => { c.moveTo(x0 - fw, base); c.lineTo(x0 - fw, top - fw); c.lineTo(x1 + fw, top - fw); c.lineTo(x1 + fw, base); c.lineTo(x1, base); c.lineTo(x1, top); c.lineTo(x0, top); c.lineTo(x0, base); c.closePath(); }, FRAME, 5);
  line(c, [[x0 - fw, base], [x1 + fw, base]], 4);
};
// a tag card with a green tick (whole again) or a red cross (new shape)
const tag = (c: Ctx, x: number, y: number, ok: boolean) => {
  c.fillStyle = SH; c.fillRect(x - 110, y - 50, 220, 120);
  shape(c, () => rrect(c, -120 + x, y - 60, 240, 120, 10), WHITE, 5);
  if (ok) line(c, [[x - 55, y + 2], [x - 18, y + 38], [x + 58, y - 38]], 16, COL.green);
  else { line(c, [[x - 40, y - 40], [x + 40, y + 40]], 16, RED); line(c, [[x + 40, y - 40], [x - 40, y + 40]], 16, RED); }
};
// one half of a grown-up woman's face: side = -1 (her left on the picture) or +1; the halves can differ a little
type Half = { cheek: number; brow: number; smile: number; mole: boolean };
const faceHalf = (c: Ctx, x: number, y: number, s: number, side: number, h: Half) => {
  c.save(); c.beginPath(); c.rect(side < 0 ? x - s * 3 : x, y - s * 3, s * 3, s * 6); c.clip();
  const rx = s * h.cheek;
  shape(c, () => rrect(c, x - rx * 1.2, y - s * 1.2, rx * 2.4, s * 2.3, s * 0.5), CLOTH.hair, 5);
  shape(c, () => rrect(c, x - s * 0.3, y + s * 0.8, s * 0.6, s * 0.6, s * 0.15), SKIN.adult, 5);
  shape(c, () => rrect(c, x - s * 1.3, y + s * 1.25, s * 2.6, s * 1.5, s * 0.4), COL.purple, 5);
  shape(c, () => ell(c, x, y, rx, s * 1.1), SKIN.adult, 5);
  shape(c, () => { c.moveTo(x - rx * 1.05, y - s * 0.2); c.bezierCurveTo(x - rx * 1.1, y - s * 1.55, x + rx * 1.1, y - s * 1.55, x + rx * 1.05, y - s * 0.2); c.quadraticCurveTo(x + rx * 0.6, y - s * 0.78, x, y - s * 0.6); c.quadraticCurveTo(x - rx * 0.6, y - s * 0.78, x - rx * 1.05, y - s * 0.2); c.closePath(); }, CLOTH.hair, 5);
  line(c, [[x, y - s * 0.62], [x, y - s * 1.12]], 3, "#55496e");
  shape(c, () => ell(c, x, y - s * 0.44, s * 0.06, s * 0.06), RED, 0);
  const ex = x + side * rx * 0.42, ey = y - s * 0.08;
  shape(c, () => ell(c, ex, ey, s * 0.15, s * 0.1), WHITE, 3); shape(c, () => ell(c, ex, ey, s * 0.07, s * 0.08), INK, 0);
  line(c, [[ex - side * s * 0.17, ey - s * 0.25 - h.brow], [ex + side * s * 0.17, ey - s * 0.29 - h.brow]], 5);
  line(c, [[x, y - s * 0.02], [x + side * s * 0.11, y + s * 0.24], [x, y + s * 0.27]], 4);
  c.beginPath(); c.moveTo(x, y + s * 0.5); c.quadraticCurveTo(x + side * s * 0.22, y + s * 0.62, x + side * s * 0.4 * h.smile, y + s * (0.52 - 0.14 * h.smile)); c.strokeStyle = INK; c.lineWidth = 5; c.lineCap = "round"; c.stroke();
  shape(c, () => ell(c, x + side * rx * 1.02, y + s * 0.15, s * 0.07, s * 0.1), SKIN.adult, 4);
  if (h.mole) shape(c, () => ell(c, x + side * rx * 0.62, y + s * 0.3, s * 0.045, s * 0.045), INK, 0);
  c.restore();
};
const face = (c: Ctx, x: number, y: number, s: number, L: Half, R: Half) => { faceHalf(c, x, y, s, -1, L); faceHalf(c, x, y, s, 1, R); };

// ---------------------------------------------------------------- the cards
// setup.e1.0: all the Mirror Test things laid out on a table, with the mirror in the middle
const setupThings = (c: Ctx) => {
  ground(c, TABLE);
  c.fillStyle = COL.woodDk; c.fillRect(0, 1030, 1080, 50); line(c, [[0, 1030], [1080, 1030]], 5);
  paper(c, 200, 190, 250, 230, -0.08, () => butterfly(c, 0, 8, 95));
  shadow(c, 560, 230, 110, 60);
  line(c, [[540, 300], [548, 248]], 10, COL.greenDk);
  leaf(c, 548, 248, 190, -PI / 2 + 0.15);
  spoon(c, 880, 190, 280, -0.6);
  plate(c, 200, 520, 160, 120);
  mirrorFlat(c, 540, 520, 190, 250, 0.1);
  chappal(c, 880, 520, 280, 0.15);
  paper(c, 200, 850, 290, 210, 0.05, () => { letterA(c, -70, 0, 130, 16); letterF(c, 75, 0, 130, 16); });
  photo(c, 540, 850, 140, 175, -0.06, () => kidFace(c, 0, -10, 42));
  key(c, 880, 850, 200, 0.35, TABLE);
};
// setup.e1.1: the child's hand stands the mirror on the butterfly's middle line; looking in from one side,
// half the butterfly is on the paper and the other half is in the mirror
const setupMirrorButterfly = (c: Ctx) => {
  ground(c, TABLE);
  c.fillStyle = SH; c.fillRect(262, 714, 580, 260);
  shape(c, () => rrect(c, 250, 700, 580, 260, 6), COL.paper, 5);
  // the near half, on the paper: the butterfly lies with her body along the mirror's bottom edge, head to the right
  c.save(); c.beginPath(); c.rect(250, 700, 580, 262); c.clip();
  c.translate(540, 700); c.scale(1, 0.7); c.rotate(PI / 2); butterfly(c, 0, 0, 230); c.restore();
  mirrorUp(c, 240, 840, 700, 440, () => {
    c.fillStyle = COL.paper; c.fillRect(250, 430, 580, 270);
    c.save(); c.translate(540, 700); c.scale(1, -0.7); c.rotate(PI / 2); butterfly(c, 0, 0, 230); c.restore();
  });
  // the child's hand grips the top bar of the frame near its right corner
  hand(c, 846, 365, PI * 0.72, 1.25);
};
// setup.e1.2: the two heaps on the floor: whole again (tick) and new shape (cross)
const setupHeaps = (c: Ctx) => {
  ground(c, FLOOR);
  tag(c, 290, 150, true); tag(c, 790, 150, false);
  // whole again: butterfly picture, spoon, leaf, letter A
  paper(c, 230, 420, 250, 230, -0.12, () => butterfly(c, 0, 8, 95));
  paper(c, 330, 800, 220, 200, 0.12, () => letterA(c, 0, 0, 130, 16));
  spoon(c, 440, 560, 280, 1.1);
  shadow(c, 160, 700, 60, 100);
  line(c, [[120, 850], [130, 790]], 10, COL.greenDk);
  leaf(c, 130, 790, 200, -PI / 2 + 0.25);
  // new shape: chappal, key, letter F
  chappal(c, 740, 500, 290, 0.3);
  paper(c, 830, 820, 220, 200, -0.1, () => letterF(c, 0, 0, 130, 16));
  key(c, 950, 560, 200, -0.9, FLOOR);
};
// term.2: a girl lifts the hand nearest the window; her mirror image lifts the hand nearest the window too
const termMirrorImage = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 960, 1080, 120); line(c, [[0, 960], [1080, 960]], 5);
  // the window, high on the left wall
  shape(c, () => rrect(c, 60, 80, 180, 220, 10), COL.woodDk, 6);
  shape(c, () => rrect(c, 78, 98, 144, 184, 4), COL.sky, 4);
  line(c, [[150, 98], [150, 282]], 5); line(c, [[78, 190], [222, 190]], 5);
  shape(c, () => ell(c, 118, 140, 22, 22), COL.yellow, 4);
  // the girl: her right hand (nearest the window) goes up
  shadow(c, 350, 962, 110, 18);
  person(c, 340, 960, 560, { armL: [-PI / 2 - 0.45, -PI / 2 - 0.2], armR: [PI * 0.55, PI * 0.5] });
  // the mirror, standing on the floor: the image is flipped side to side, so its raised hand is also on the window side
  mirrorUp(c, 610, 990, 960, 200, () => {
    c.fillStyle = BG; c.fillRect(610, 200, 380, 760);
    shadow(c, 790, 962, 110, 18);
    c.save(); c.translate(800, 0); c.scale(-1, 1); c.translate(-800, 0);
    person(c, 800, 960, 560, { armR: [-PI / 2 + 0.45, -PI / 2 + 0.2], armL: [PI * 0.45, PI * 0.5] });
    c.restore();
  });
};
// term.3: a round dosa folded along the middle into two halves, on a steel plate
const termDosa = (c: Ctx) => {
  ground(c);
  plate(c, 540, 600, 430, 300);
  const half = (rx: number, ry: number, dy: number) => () => { c.ellipse(540, 600 + dy, rx, ry, 0, 0, PI); c.closePath(); };
  shadow(c, 560, 640, 310, 190);
  shape(c, half(312, 200, 10), DOSADK, 6);
  shape(c, half(300, 186, 0), DOSA, 6);
  c.save(); c.beginPath(); half(300, 186, 0)(); c.clip();
  let sd = 7; const r = () => ((sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 90; i++) { const px = 240 + r() * 600, py = 600 + r() * 190, pr = 4 + r() * 7; shape(c, () => ell(c, px, py, pr, pr * 0.8), DOSADK, 0); }
  c.restore();
  shape(c, () => rrect(c, 240, 590, 600, 24, 12), "#f0c877", 5);
  shine(c, [[300, 650], [420, 720]], 8);
};
// expl.1: a mirror on the middle of the letter A shows a whole A; a mirror on the letter F shows a new shape.
// Seen as the child sees it from the side: the paper lies in front, so the letters lie sideways, tops to the left
const explMirrorLetters = (c: Ctx) => {
  ground(c, TABLE);
  const scene = (cx: number, letter: (c: Ctx, x: number, y: number, s: number, w: number) => void) => {
    c.fillStyle = SH; c.fillRect(cx - 188, 654, 400, 240);
    shape(c, () => rrect(c, cx - 200, 640, 400, 240, 6), COL.paper, 5);
    const lay = (flip: number) => { c.translate(cx, 640); c.scale(1, 0.7 * flip); c.rotate(-PI / 2); letter(c, 0, 0, 300, 26); };
    c.save(); c.beginPath(); c.rect(cx - 200, 640, 400, 242); c.clip(); lay(1); c.restore();
    mirrorUp(c, cx - 215, cx + 215, 640, 400, () => { c.fillStyle = COL.paper; c.fillRect(cx - 200, 390, 400, 250); c.save(); lay(-1); c.restore(); });
  };
  scene(290, letterA);
  scene(790, letterF);
};
// expl.3: a photo of a smiling woman, and two mirror-made faces: left half doubled (wider), right half doubled (narrower)
const explNearlyFaces = (c: Ctx) => {
  ground(c);
  const L: Half = { cheek: 1.08, brow: 9, smile: 1, mole: true }, R: Half = { cheek: 0.92, brow: 0, smile: 0.78, mole: false };
  photo(c, 230, 540, 340, 440, 0, () => face(c, 0, -20, 130, L, R));
  const made = (x: number, h: Half) => photo(c, x, 540, 280, 360, 0, () => {
    face(c, 0, -16, 106, h, h);
    c.setLineDash([10, 10]); line(c, [[0, -165], [0, 165]], 3, RED); c.setLineDash([]);
  });
  made(615, L); made(915, R);
};

export const ic_patternsSymmetrySymmetryInNatureL1 = cards("sci.patterns-symmetry.symmetry-in-nature.L1", [
  setupThings, setupMirrorButterfly, setupHeaps, termMirrorImage, termDosa, explMirrorLetters, explNearlyFaces,
]);
