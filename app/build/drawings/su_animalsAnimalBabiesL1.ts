import { INK, RED, COL, SKIN, CLOTH, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, write, ground, cards } from "./flatKit";
import type { Ctx } from "./core";

// a paper strip standing on end or lying: x, y = top-left, w x h
const strip = (c: Ctx, x: number, y: number, w: number, h: number, ghost = false) => {
  shape(c, () => rrect(c, x, y, w, h, 4), ghost ? "#fff3d6" : COL.paper, 6);
  if (!ghost) shade(c, () => rrect(c, x, y, w, h, 4), COL.cloth, w * 0.2, 0, 0.9);
};
// a book lying flat, seen from the front: x, y = top-left
const book = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.blue, 6);
  shape(c, () => rrect(c, x + 10, y + h * 0.3, w - 20, h * 0.4), COL.paper, 4);
};
const door = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 6), COL.wood, 7);
  shade(c, () => rrect(c, x, y, w, h, 6), COL.woodDk, w * 0.06, 0, 0.5);
  shape(c, () => rrect(c, x + w * 0.12, y + h * 0.06, w * 0.76, h * 0.38, 6), COL.woodDk, 5);
  shape(c, () => rrect(c, x + w * 0.12, y + h * 0.52, w * 0.76, h * 0.42, 6), COL.woodDk, 5);
};
const pencil = (c: Ctx, x: number, y: number, an: number, len = 150) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => polyP(c, [[0, 0], [28, -11], [len, -11], [len, 11], [28, 11]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[0, 0], [28, -11], [28, 11]]), COL.wood, 4);
  shape(c, () => polyP(c, [[0, 0], [11, -4], [11, 4]]), INK, 2);
  c.restore();
};

// e1 step 1: a strip from the chin to the top of the head, a book flat on top of the head
const e1s0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 250, 880, 580, 300, 120), CLOTH.adult);
  shape(c, () => rrect(c, 480, 760, 120, 180, 30), SKIN.adult);
  shape(c, () => ell(c, 540, 540, 330, 330), CLOTH.hair);
  shape(c, () => ell(c, 310, 570, 38, 60), SKIN.adult, 5); shape(c, () => ell(c, 770, 570, 38, 60), SKIN.adult, 5);
  shape(c, () => ell(c, 540, 560, 235, 265), SKIN.adult);
  shade(c, () => ell(c, 540, 560, 235, 265), SKIN.adultDk, 40, 20, 0.3);
  shape(c, () => { c.moveTo(310, 500); c.bezierCurveTo(330, 300, 750, 300, 770, 500); c.quadraticCurveTo(700, 400, 540, 390); c.quadraticCurveTo(380, 400, 310, 500); c.closePath(); }, CLOTH.hair, 6);
  for (const s of [-1, 1]) shape(c, () => ell(c, 540 + s * 95, 590, 22, 30), INK, 0);
  c.beginPath(); c.arc(540, 700, 60, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 8; c.lineCap = "round"; c.stroke();
  book(c, 330, 215, 420, 66);
  strip(c, 800, 281, 70, 545);
  line(c, [[790, 281], [880, 281]], 10, RED);
  hand(c, 835, 880, -Math.PI / 2, 1.1);
  arrow(c, [[940, 700], [940, 440]], RED, 12);
};

// e1 step 2: standing straight against the door, the book flat on the head, a mark at the book's bottom edge
const e1s1 = (c: Ctx) => {
  ground(c);
  door(c, 130, 40, 820, 1000);
  shadow(c, 470, 1010, 190, 24);
  person(c, 440, 1000, 840, { adult: true, armL: [Math.PI * 0.5, Math.PI * 0.5], armR: [Math.PI * 0.5, Math.PI * 0.5] });
  book(c, 340, 138, 200, 36);
  line(c, [[570, 174], [710, 174]], 9, INK);
  pencil(c, 710, 174, 0, 200);
  hand(c, 960, 190, Math.PI, 1.0);
  arrow(c, [[640, 60], [640, 140]], RED, 12);
};

// e1 step 3: stepping the head strip up the door, end to end, counting
const e1s2 = (c: Ctx) => {
  ground(c);
  door(c, 220, 30, 640, 1020);
  const h = 215, x = 470, w = 110;
  for (let k = 0; k < 4; k++) {
    const y = 1010 - (k + 1) * h;
    strip(c, x, y, w, h, k < 3);
    write(c, String(k + 1), x + w / 2 - 17, y + h / 2 - 28, 56, k < 3 ? COL.greyDk : INK, 8);
  }
  line(c, [[x - 40, 1010 - 4 * h], [x + w + 50, 1010 - 4 * h]], 10, INK);
  hand(c, 395, 257, 0.05, 1.2);
  arrow(c, [[690, 760], [690, 330]], RED, 12);
};

// e1 step 4: the baby photo on a phone, a tiny strip stepped along the baby from head to heels
const baby = (c: Ctx) => {
  const skin = "#d9a07a", skinDk = "#bf8560";
  shape(c, () => ell(c, 540, 420, 98, 120), "#cfe9dd", 0);
  for (const s of [-1, 1]) {
    shape(c, () => rrect(c, 540 + s * 55 - 24, 520, 48, 270, 24), skin);
    shape(c, () => ell(c, 540 + s * 55, 800, 30, 22), skin);
  }
  shape(c, () => rrect(c, 450, 360, 180, 230, 70), "#f6efe0");
  for (const s of [-1, 1]) shape(c, () => rrect(c, 540 + s * 100 - 24, 390, 48, 150, 24), skin);
  shape(c, () => ell(c, 540, 290, 70, 73), skin);
  shade(c, () => ell(c, 540, 290, 70, 73), skinDk, 14, 8, 0.5);
  shape(c, () => ell(c, 540, 228, 36, 14), CLOTH.hair, 3);
  for (const s of [-1, 1]) shape(c, () => ell(c, 540 + s * 26, 292, 6, 8), INK, 0);
  c.beginPath(); c.arc(540, 312, 14, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
const e1s3 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 1040, 330, 28);
  shape(c, () => rrect(c, 290, 60, 500, 980, 60), COL.black);
  shape(c, () => rrect(c, 320, 120, 440, 860, 22), "#cfe9dd", 0);
  baby(c);
  const x = 630, h = 146;
  for (let k = 0; k < 4; k++) { const y = 215 + k * h; strip(c, x + 0, y, 52, h, k < 3); write(c, String(k + 1), x + 6, y + h / 2 - 15, 34, k < 3 ? COL.greyDk : INK, 6); }
  hand(c, 760, 760, Math.PI, 0.9);
  arrow(c, [[860, 300], [860, 700]], RED, 12);
};

export const su_animalsAnimalBabiesL1 = cards("sci.animals.animal-babies.L1 set-up", [e1s0, e1s1, e1s2, e1s3]);
