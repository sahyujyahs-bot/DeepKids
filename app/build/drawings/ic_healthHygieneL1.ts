import type { Ctx } from "./core";
import { D, INK, BG, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, hand, person, write, cards } from "./flatKit";

// KEEPING CLEAN (L1) · set-up cards and card pictures: a child looking at their own back teeth, a biscuit,
// a tumbler, a toothbrush, white cloth squares, soapy hands, a bucket bath. Same child (orange shirt,
// side bun) and grown-up (blue sleeve) on every card.

const TOOTH = "#fbf7ee", TOOTHDK = "#e6dfcd", MOUTH = "#7d3340", TONGUE = "#e8788f", CRUMB = "#5a3620", BISCUIT = "#4e2e1a";
const PI = Math.PI;
const darrow = (c: Ctx, a: number[], b: number[], w = 9) => { arrow(c, [a, b], undefined, w); arrow(c, [b, a], undefined, w); };
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => { shadow(c, x + w / 2 + 14, y + h / 2 + 16, w / 2, h / 2); shape(c, () => rrect(c, x, y, w, h, 18), COL.paper, 5); };

// ---------------------------------------------------------------- mouth and head
// an open mouth, front view, centre (x,y): upper teeth hang from the lip, the wide lower back teeth show bumpy tops
const mouthOpen = (c: Ctx, x: number, y: number, rx: number, ry: number, crumbs = false) => {
  const lip = () => ell(c, x, y, rx, ry);
  shape(c, lip, MOUTH, 6);
  c.save(); c.beginPath(); lip(); c.clip();
  shape(c, () => ell(c, x, y + ry * 0.8, rx * 0.6, ry * 0.5), TONGUE, 4);
  const teeth = (top: boolean) => {
    for (let i = -3; i <= 3; i++) {
      const t = i / 3.6, tx = x + t * rx, edge = Math.sqrt(1 - t * t) * ry, back = Math.abs(i) >= 2;
      const w = back ? rx * 0.26 : rx * 0.17, h = back ? ry * 0.42 : ry * 0.58;
      if (top) {
        shape(c, () => rrect(c, tx - w / 2, y - edge - 12, w, h + 12, w * 0.25), TOOTH, 4);
        if (back) line(c, [[tx - w * 0.3, y - edge + h - 6], [tx, y - edge + h - 16], [tx + w * 0.3, y - edge + h - 6]], 3, COL.greyDk);
      } else {
        const ty = y + edge - h;
        shape(c, () => rrect(c, tx - w / 2, ty, w, h + 12, w * 0.25), TOOTH, 4);
        if (back) {
          line(c, [[tx - w * 0.32, ty + 6], [tx - w * 0.1, ty + h * 0.3], [tx + w * 0.1, ty + 6], [tx + w * 0.32, ty + h * 0.3]], 3, COL.greyDk);
          if (crumbs) for (const [u, v] of [[-0.2, 0.2], [0.04, 0.1], [0.24, 0.26]]) shape(c, () => ell(c, tx + u * w, ty + v * h, 7, 5), CRUMB, 2);
        }
      }
    }
  };
  teeth(false); teeth(true);
  c.restore();
  shape(c, lip, "rgba(0,0,0,0)", 6);
};
type Mouth = "open" | "smile" | "puff" | "tongue" | "brush";
// a big head, front view, face centre (x,y), radius r, with neck and shoulders
const head = (c: Ctx, x: number, y: number, r: number, mouth: Mouth = "smile", o: { sleepy?: boolean; adult?: boolean; crumbs?: boolean; puzzled?: boolean } = {}) => {
  const ad = !!o.adult, skin = ad ? SKIN.adult : SKIN.child, skinDk = ad ? SKIN.adultDk : SKIN.childDk, cloth = ad ? CLOTH.adult : CLOTH.child, clothDk = ad ? CLOTH.adultDk : CLOTH.childDk;
  const body = () => rrect(c, x - r * 1.7, y + r * 1.15, r * 3.4, r * 1.8, r * 0.5), neck = () => rrect(c, x - r * 0.32, y + r * 0.6, r * 0.64, r * 0.75, r * 0.1);
  shape(c, body, cloth); shade(c, body, clothDk, r * 0.5, 0);
  shape(c, neck, skin); shade(c, neck, skinDk, 0, r * 0.28);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r, y + r * 0.08, r * 0.17, r * 0.22), skin);
  shape(c, () => ell(c, x, y, r, r * 1.08), skin);
  if (mouth === "puff") for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 0.72, y + r * 0.45, r * 0.45, r * 0.4), skin, 5);
  shape(c, () => { c.moveTo(x - r * 1.04, y - r * 0.02); c.bezierCurveTo(x - r * 1.05, y - r * 1.65, x + r * 1.05, y - r * 1.65, x + r * 1.04, y - r * 0.02); c.quadraticCurveTo(x, y - r * 0.5, x - r * 1.04, y - r * 0.02); c.closePath(); }, CLOTH.hair, 5);
  if (!ad) shape(c, () => ell(c, x + r * 0.98, y - r * 0.2, r * 0.3, r * 0.5), CLOTH.hair, 4);
  const ey = y + r * 0.1;
  for (const s of [-1, 1]) {
    if (o.sleepy) { c.beginPath(); c.arc(x + s * r * 0.36, ey - r * 0.06, r * 0.13, 0.15, PI - 0.15); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
    else shape(c, () => ell(c, x + s * r * 0.36, ey, r * 0.09, r * 0.12), INK, 0);
  }
  if (o.puzzled) { line(c, [[x - r * 0.55, y - r * 0.18], [x - r * 0.2, y - r * 0.32]], 6); line(c, [[x + r * 0.2, y - r * 0.22], [x + r * 0.55, y - r * 0.22]], 6); }
  const my = y + r * 0.55;
  if (mouth === "smile") { c.beginPath(); c.arc(x, y + r * 0.38, r * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  else if (mouth === "puff") line(c, [[x - r * 0.12, my], [x + r * 0.12, my]], 5);
  else if (mouth === "open") mouthOpen(c, x, my, r * 0.62, r * 0.42, o.crumbs);
  else if (mouth === "brush") mouthOpen(c, x, my, r * 0.55, r * 0.36);
  else {
    shape(c, () => ell(c, x, my, r * 0.42, r * 0.2), MOUTH, 5);
    c.save(); c.beginPath(); ell(c, x, my, r * 0.42, r * 0.2); c.clip();
    shape(c, () => rrect(c, x - r * 0.36, my - r * 0.3, r * 0.72, r * 0.22, r * 0.04), TOOTH, 4);
    for (let i = -2; i <= 2; i++) line(c, [[x + i * r * 0.14, my - r * 0.3], [x + i * r * 0.14, my - r * 0.08]], 3, COL.greyDk);
    c.restore();
    shape(c, () => { c.moveTo(x - r * 0.17, my + r * 0.12); c.quadraticCurveTo(x - r * 0.17, my - r * 0.25, x, my - r * 0.28); c.quadraticCurveTo(x + r * 0.17, my - r * 0.25, x + r * 0.17, my + r * 0.12); c.closePath(); }, TONGUE, 5);
  }
};
// the child seen from behind: hair, neck, shoulders
const headBack = (c: Ctx, x: number, y: number, r: number) => {
  const body = () => rrect(c, x - r * 1.7, y + r * 1.3, r * 3.4, r * 1.8, r * 0.5), neck = () => rrect(c, x - r * 0.32, y + r * 0.6, r * 0.64, r * 0.9, r * 0.1);
  shape(c, body, CLOTH.child); shade(c, body, CLOTH.childDk, r * 0.5, 0);
  shape(c, neck, SKIN.child); shade(c, neck, SKIN.childDk, 0, r * 0.25);
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * r * 1.0, y + r * 0.1, r * 0.15, r * 0.2), SKIN.child);
  shape(c, () => ell(c, x, y - r * 0.05, r * 1.05, r * 1.0), CLOTH.hair);
  shape(c, () => ell(c, x + r * 0.98, y - r * 0.2, r * 0.3, r * 0.5), CLOTH.hair, 4);
};

// ---------------------------------------------------------------- things
// a torch, its tail at local -180 and lens at +60, pointing at angle an; beam = length of the light cone
const torch = (c: Ctx, x: number, y: number, an: number, beam = 0) => {
  c.save(); c.translate(x, y); c.rotate(an);
  if (beam) { c.beginPath(); polyP(c, [[60, -28], [60 + beam, -28 - beam * 0.42], [60 + beam, 28 + beam * 0.42], [60, 28]]); c.fillStyle = "rgba(255,225,90,0.5)"; c.fill(); }
  shape(c, () => rrect(c, -180, -30, 190, 60, 14), COL.grey); shade(c, () => rrect(c, -180, -30, 190, 60, 14), COL.greyDk, 0, -20);
  shape(c, () => rrect(c, 0, -44, 60, 88, 12), COL.greyDk);
  shape(c, () => ell(c, 60, 0, 10, 40), COL.yellow, 5);
  shape(c, () => rrect(c, -120, -10, 30, 20, 6), COL.red, 4);
  c.restore();
};
// a hand mirror, face centre (x,y), handle pointing at angle an
const mirror = (c: Ctx, x: number, y: number, r: number, an: number, len = 220) => {
  c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, r * 0.6, -22, len, 44, 20), COL.wood); c.restore();
  shadow(c, x + 14, y + 16, r * 1.08, r * 1.08);
  shape(c, () => ell(c, x, y, r * 1.12, r * 1.12), COL.wood);
  shape(c, () => ell(c, x, y, r * 0.86, r * 0.86), COL.sky, 5);
  shine(c, [[x - r * 0.5, y - r * 0.25], [x - r * 0.2, y - r * 0.55]], 10);
};
// a dark round biscuit with a bite out of the upper right
const biscuit = (c: Ctx, x: number, y: number, r: number, bite = true) => {
  shadow(c, x + 12, y + 14, r, r * 0.9);
  const path = () => {
    if (!bite) { ell(c, x, y, r, r); return; }
    const bx = x + r * 0.85, by = y - r * 0.7, rb = r * 0.5, d = Math.hypot(bx - x, by - y), phi = Math.atan2(by - y, bx - x), th = Math.acos((r * r + d * d - rb * rb) / (2 * r * d));
    const p1 = [x + Math.cos(phi + th) * r, y + Math.sin(phi + th) * r], p2 = [x + Math.cos(phi - th) * r, y + Math.sin(phi - th) * r];
    c.moveTo(p1[0], p1[1]); c.arc(x, y, r, phi + th, phi - th + 2 * PI);
    c.arc(bx, by, rb, Math.atan2(p2[1] - by, p2[0] - bx), Math.atan2(p1[1] - by, p1[0] - bx), true); c.closePath();
  };
  shape(c, path, BISCUIT);
  c.save(); c.beginPath(); path(); c.clip();
  const rd = rnd(5); for (let i = 0; i < 14; i++) shape(c, () => ell(c, x + (rd() - 0.5) * r * 1.5, y + (rd() - 0.5) * r * 1.5, r * 0.07, r * 0.07), COL.soil, 0);
  c.restore();
};
// a toothbrush: head centre (x,y), handle of length len along angle an, bristles on local side (-1 = -y)
const brush = (c: Ctx, x: number, y: number, an: number, len = 320, side = -1, col: string = COL.blue, dk: string = COL.blueDk) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -20, -16, len + 20, 32, 16), col); shade(c, () => rrect(c, -20, -16, len + 20, 32, 16), dk, 0, -10);
  shape(c, () => rrect(c, -80, -20, 100, 40, 14), WHITE);
  for (let i = 0; i < 6; i++) { const bx = -68 + i * 15; line(c, [[bx, side * 20], [bx, side * 56]], 7, INK); line(c, [[bx, side * 20], [bx, side * 56]], 3.5, COL.teal); }
  c.restore();
};
// a steel tumbler of water, bottom centre (x,y)
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.6, w * 0.12);
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -w * 0.35, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.water, 5);
  shine(c, [[x - w * 0.3, y - h * 0.85], [x - w * 0.25, y - h * 0.25]], 7);
};
// a wash basin set into a counter whose top edge is at y; the tap at tapX
const sink = (c: Ctx, y: number, tapX = 840) => {
  shape(c, () => rrect(c, 840 - 18 + (tapX - 840), y - 160, 36, 170, 14), COL.steelDk);
  shape(c, () => rrect(c, tapX - 120, y - 185, 140, 34, 16), COL.steel);
  shape(c, () => ell(c, tapX, y - 190, 28, 16), COL.teal, 5);
  shape(c, () => rrect(c, -20, y, D + 40, D - y + 40, 30), COL.cloth);
  shape(c, () => ell(c, 500, y + 120, 300, 80), COL.steelIn);
  shape(c, () => ell(c, 500, y + 126, 240, 56), COL.steel, 4);
  shape(c, () => ell(c, 500, y + 132, 30, 12), COL.greyDk, 3);
};
// a white cloth square, centre (x,y), side s; dirt 0..1 adds grey and brown marks
const cloth = (c: Ctx, x: number, y: number, s: number, rot = 0, dirt = 0, seedN = 1) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, 8, 10, s * 0.55, s * 0.55);
  shape(c, () => rrect(c, -s / 2, -s / 2, s, s, s * 0.08), WHITE, 5);
  if (dirt > 0) {
    const r = rnd(seedN); c.save(); c.beginPath(); rrect(c, -s / 2, -s / 2, s, s, s * 0.08); c.clip();
    for (let i = 0; i < 4 + dirt * 6; i++) { c.beginPath(); ell(c, (r() - 0.5) * s * 0.6, (r() - 0.5) * s * 0.6, s * (0.1 + r() * 0.18), s * (0.08 + r() * 0.12), r() * 3); c.fillStyle = r() < 0.6 ? COL.greyDk : COL.soil; c.globalAlpha = 0.3 + dirt * 0.3; c.fill(); }
    c.restore(); c.globalAlpha = 1;
  }
  c.restore();
};
const foam = (c: Ctx, x: number, y: number, w: number, h: number, seedN: number, n = 18) => { const r = rnd(seedN); for (let i = 0; i < n; i++) { const bx = x + (r() - 0.5) * w, by = y + (r() - 0.5) * h, br = 10 + r() * 22; shape(c, () => ell(c, bx, by, br, br), WHITE, 4); } };
// an open hand seen flat, fingers up, wrist at (x,y); flip = -1 mirrors it (thumb on the left); nails = seen from the back
const palm = (c: Ctx, x: number, y: number, s: number, flip = 1, skin: string = SKIN.child, sleeve: string = CLOTH.child, nails = false) => {
  c.save(); c.translate(x, y); c.scale(s * flip, s);
  shape(c, () => rrect(c, -62, 10, 124, 70, 20), sleeve);
  shape(c, () => { c.moveTo(-60, 20); c.lineTo(-66, -110); c.quadraticCurveTo(0, -135, 66, -110); c.lineTo(60, 20); c.quadraticCurveTo(0, 40, -60, 20); c.closePath(); }, skin);
  const fl = [78, 104, 115, 98];
  for (let k = 0; k < 4; k++) { const fx = -52 + k * 35, tip = -118 - fl[k]; shape(c, () => rrect(c, fx, tip, 30, fl[k] + 30, 15), skin, 5); if (nails) { shape(c, () => rrect(c, fx + 6, tip + 4, 18, 24, 8), "#f3d7c3", 3); line(c, [[fx + 8, tip + 7], [fx + 22, tip + 7]], 4, COL.greyDk); } }
  c.save(); c.translate(62, -60); c.rotate(-0.6); shape(c, () => rrect(c, -15, -100, 30, 120, 15), skin, 5); if (nails) { shape(c, () => rrect(c, -9, -96, 18, 24, 8), "#f3d7c3", 3); line(c, [[-7, -93], [7, -93]], 4, COL.greyDk); } c.restore();
  c.restore();
};
// the sole of a foot, toes up, heel at (x,y)
const sole = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 20, y + 10, w * 0.5, w * 0.15);
  shape(c, () => { c.moveTo(x - w * 0.45, y); c.bezierCurveTo(x - w * 0.75, y - h * 0.4, x - w * 0.6, y - h * 0.95, x - w * 0.1, y - h); c.bezierCurveTo(x + w * 0.4, y - h, x + w * 0.6, y - h * 0.5, x + w * 0.45, y); c.closePath(); }, SKIN.child);
  const toes: [number, number, number][] = [[-0.3, 1.0, 0.17], [-0.03, 1.06, 0.12], [0.18, 1.04, 0.11], [0.36, 0.99, 0.1], [0.5, 0.9, 0.09]];
  for (const [u, v, rr] of toes) shape(c, () => ell(c, x + u * w, y - v * h, w * rr, w * rr * 1.1), SKIN.child, 5);
};
// a plastic bucket of water, bottom centre (x,y)
const bucket = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.15, y + 6, w * 0.6, w * 0.12);
  c.beginPath(); c.ellipse(x, y - h, w / 2, h * 0.5, 0, PI, 2 * PI); c.strokeStyle = INK; c.lineWidth = 14; c.stroke(); c.strokeStyle = COL.steel; c.lineWidth = 7; c.stroke();
  const body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w * 0.4, y); c.lineTo(x - w * 0.4, y); c.closePath(); };
  shape(c, body, COL.blue); shade(c, body, COL.blueDk, -w * 0.3, 0);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.14), COL.water, 5);
};
// a small plastic mug with a handle, bottom centre (x,y), tipped by rot
const mug = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0, col: string = COL.green, dk: string = COL.greenDk) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => ell(c, w * 0.55, -h * 0.5, w * 0.3, h * 0.28), col); shape(c, () => ell(c, w * 0.55, -h * 0.5, w * 0.14, h * 0.15), BG, 5);
  shape(c, () => rrect(c, -w / 2, -h, w, h, 10), col); shade(c, () => rrect(c, -w / 2, -h, w, h, 10), dk, -w * 0.3, 0);
  shape(c, () => ell(c, 0, -h, w / 2, w * 0.12), COL.water, 5);
  c.restore();
};
const soap = (c: Ctx, x: number, y: number, w: number, h: number) => { shape(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.35), COL.greenLt); shade(c, () => rrect(c, x - w / 2, y - h / 2, w, h, h * 0.35), COL.green, -w * 0.12, -h * 0.15); shine(c, [[x - w * 0.3, y - h * 0.2], [x - w * 0.1, y - h * 0.25]], 8); };
// a big back tooth: crown centre (x,y), width w, total height h, grooves on top
const molar = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + 20, y + h * 0.62, w * 0.5, h * 0.06);
  for (const s of [-1, 1]) shape(c, () => { c.moveTo(x + s * w * 0.44, y + h * 0.15); c.quadraticCurveTo(x + s * w * 0.5, y + h * 0.6, x + s * w * 0.28, y + h * 0.62); c.quadraticCurveTo(x + s * w * 0.15, y + h * 0.4, x + s * w * 0.1, y + h * 0.15); c.closePath(); }, TOOTH);
  const crown = () => {
    c.moveTo(x - w / 2, y + h * 0.2); c.lineTo(x - w / 2, y - h * 0.3);
    c.quadraticCurveTo(x - w * 0.45, y - h * 0.5, x - w * 0.28, y - h * 0.5); c.quadraticCurveTo(x - w * 0.14, y - h * 0.5, x - w * 0.1, y - h * 0.36);
    c.quadraticCurveTo(x, y - h * 0.3, x + w * 0.1, y - h * 0.36); c.quadraticCurveTo(x + w * 0.14, y - h * 0.5, x + w * 0.28, y - h * 0.5); c.quadraticCurveTo(x + w * 0.45, y - h * 0.5, x + w / 2, y - h * 0.3);
    c.lineTo(x + w / 2, y + h * 0.2); c.quadraticCurveTo(x + w / 2, y + h * 0.3, x + w * 0.4, y + h * 0.3); c.lineTo(x - w * 0.4, y + h * 0.3); c.quadraticCurveTo(x - w / 2, y + h * 0.3, x - w / 2, y + h * 0.2); c.closePath();
  };
  shape(c, crown, TOOTH); shade(c, crown, TOOTHDK, -w * 0.15, 0);
  line(c, [[x - w * 0.3, y - h * 0.43], [x - w * 0.1, y - h * 0.35], [x, y - h * 0.31], [x + w * 0.1, y - h * 0.35], [x + w * 0.3, y - h * 0.43]], 5, COL.greyDk);
};
const sun = (c: Ctx, x: number, y: number, r: number) => { for (let i = 0; i < 8; i++) { const a = i * PI / 4; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8]], 4, COL.orange); } shape(c, () => ell(c, x, y, r, r), COL.yellow, 4); };
const moon = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r); c.arc(x, y, r, -PI / 2, PI / 2, true); c.arc(x + r * 0.5, y, r * 1.118, 2.03, -2.03, true); c.closePath(); }, COL.yellow, 4);
const crayon = (c: Ctx, x: number, y: number, an: number, col: string) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -80, -16, 150, 32, 6), col); shape(c, () => polyP(c, [[70, -16], [100, 0], [70, 16]]), col, 5); c.restore(); };

// ================================================================ set-up cards
// e1.0: the grown-up shines a torch into the child's open mouth; the child holds the mirror
const se1_0 = (c: Ctx) => {
  ground(c);
  head(c, 540, 430, 200, "open");
  torch(c, 300, 300, 0.75, 250);
  hand(c, 220, 225, 0.75, 1.15, SKIN.adult, CLOTH.adult);
  mirror(c, 880, 600, 85, 1.94, 230);
  hand(c, 760, 900, -1.2, 1.1);
};
// e1.1: biscuit eaten, brown crumbs in the grooves of the back teeth
const se1_1 = (c: Ctx) => {
  ground(c);
  head(c, 540, 430, 200, "open", { crumbs: true });
  for (const [x, y] of [[470, 650], [600, 655], [540, 670]]) shape(c, () => ell(c, x, y, 7, 5), CRUMB, 2);
  biscuit(c, 830, 760, 95);
  hand(c, 720, 900, -1.0, 1.1);
};
// e1.2: cheeks puffed out, swishing water; tumbler and sink
const se1_2 = (c: Ctx) => {
  ground(c);
  head(c, 540, 330, 170, "puff");
  arrow(c, [[300, 330], [262, 400], [300, 470]], undefined, 9);
  sink(c, 800, 160);
  tumbler(c, 930, 960, 130, 190);
};
// e1.3: brushing the top of a back tooth, bristles down into the grooves
const se1_3 = (c: Ctx) => {
  ground(c);
  head(c, 540, 430, 200, "open");
  brush(c, 610, 575, 0.4, 330, 1);
  hand(c, 930, 710, 0.4 + PI, 1.1);
  darrow(c, [560, 470], [690, 470], 8);
};
// e2.0: the grown-up wipes the back of the child's neck with a damp white square
const se2_0 = (c: Ctx) => {
  ground(c);
  headBack(c, 380, 400, 190);
  paper(c, 680, 770, 340, 240);
  cloth(c, 770, 890, 110); cloth(c, 930, 890, 110);
  arrow(c, [[560, 470], [560, 560]], undefined, 9);
  cloth(c, 420, 620, 140, 0.15, 0.2, 3);
  hand(c, 590, 640, PI, 1.3, SKIN.adult, CLOTH.adult);
};
// e2.1: two rows of three squares: before the bath marked, after the bath almost white
const se2_1 = (c: Ctx) => {
  ground(c);
  paper(c, 110, 130, 860, 820);
  write(c, "1", 150, 220, 60); write(c, "2", 150, 620, 60);
  for (let i = 0; i < 3; i++) { cloth(c, 330 + i * 250, 330, 200, (i - 1) * 0.06, 0.55 + i * 0.25, 11 + i); cloth(c, 330 + i * 250, 730, 200, (i - 1) * -0.05, i === 2 ? 0.1 : 0, 21 + i); }
};
// e3.0: just woken up, tongue feeling the fuzzy teeth
const se3_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 120, 120, 840, 640, 30), COL.wood); shade(c, () => rrect(c, 120, 120, 840, 640, 30), COL.woodDk, -40, 0);
  shape(c, () => rrect(c, 200, 540, 680, 220, 60), WHITE);
  head(c, 540, 470, 200, "tongue", { sleepy: true, puzzled: true });
};
// e3.1: brushing at the sink
const se3_1 = (c: Ctx) => {
  ground(c);
  head(c, 560, 380, 170, "brush");
  brush(c, 520, 470, 2.69, 300, -1);
  hand(c, 190, 640, -0.45, 1.1);
  foam(c, 470, 505, 100, 60, 3, 9);
  sink(c, 820, 860);
};

// ================================================================ card pictures
// flow.e1: everything for the biscuit test laid out
const fe1 = (c: Ctx) => {
  ground(c);
  torch(c, 330, 250, 0);
  brush(c, 920, 400, PI + 0.25, 360, 1);
  biscuit(c, 300, 620, 135);
  tumbler(c, 580, 820, 160, 220);
  mirror(c, 850, 760, 100, 2.3, 200);
};
// flow.e2: wiping the sole of a foot with a damp square, the katori of water, squares on paper
const fe2 = (c: Ctx) => {
  ground(c);
  bowl(c, 870, 300, 95, COL.water);
  sole(c, 380, 880, 260, 520);
  arrow(c, [[190, 520], [190, 640]], undefined, 9);
  cloth(c, 470, 600, 130, 0.2, 0.6, 7);
  hand(c, 640, 640, PI, 1.2, SKIN.adult, CLOTH.adult);
  paper(c, 640, 760, 380, 260);
  cloth(c, 740, 890, 120, 0.05, 0.5, 8); cloth(c, 900, 890, 120, -0.05, 0, 9);
};
// flow.e3: tongue on the teeth, and the record sheet: wavy before, smooth after
const fe3 = (c: Ctx) => {
  ground(c);
  head(c, 320, 440, 170, "tongue");
  paper(c, 640, 250, 370, 540);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) {
    const x = 670 + k * 165, y = 290 + r * 235; shape(c, () => rrect(c, x, y, 150, 210, 8), WHITE, 4);
    if (k === 0) { const pts: number[][] = []; for (let i = 0; i <= 8; i++) pts.push([x + 20 + i * 13.5, y + 105 + (i % 2 ? -22 : 22)]); line(c, pts, 7, COL.blueDk); }
    else line(c, [[x + 20, y + 105], [x + 130, y + 105]], 7, COL.blueDk);
  }
  write(c, "1", 605, 370, 46); write(c, "2", 605, 605, 46);
  crayon(c, 820, 860, -0.2, COL.blue);
};
// flow.a1: two soapy hands rubbing, soap and foam
const fa1 = (c: Ctx) => {
  ground(c);
  darrow(c, [400, 220], [540, 220]); darrow(c, [700, 300], [560, 300]);
  palm(c, 400, 660, 1.3, 1); palm(c, 690, 660, 1.3, -1);
  foam(c, 540, 500, 420, 300, 4, 40);
  plate(c, 900, 950, 100, 30); soap(c, 895, 905, 150, 85);
};
// flow.a2: the grown-up runs a toothpick under the child's nail over white paper
const fa2 = (c: Ctx) => {
  ground(c);
  paper(c, 120, 160, 840, 760);
  const rd = rnd(9); for (let i = 0; i < 12; i++) shape(c, () => ell(c, 620 + rd() * 200, 560 + rd() * 220, 4 + rd() * 4, 3 + rd() * 3), COL.greyDk, 0);
  palm(c, 430, 900, 2.0, 1, SKIN.child, CLOTH.child, true);
  line(c, [[810, 352], [572, 462]], 11, INK); line(c, [[810, 352], [572, 462]], 5, COL.wood);
  hand(c, 860, 330, 2.72, 1.2, SKIN.adult, CLOTH.adult);
};
// flow.a4: the clean-up kit on a mat
const fa4 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 90, 240, 900, 620, 40), COL.teal); shade(c, () => rrect(c, 90, 240, 900, 620, 40), COL.tealDk, -30, -30);
  brush(c, 210, 330, PI / 2, 230, -1);
  shape(c, () => rrect(c, 380, 320, 220, 150, 20), COL.sky); for (let i = 0; i < 2; i++) shape(c, () => rrect(c, 380, 350 + i * 50, 220, 20, 0), COL.blue, 0); shape(c, () => rrect(c, 380, 320, 220, 150, 20), "rgba(0,0,0,0)", 6);
  shape(c, () => rrect(c, 680, 350, 220, 46, 10), COL.black); for (let i = 0; i < 18; i++) line(c, [[690 + i * 11.5, 396], [690 + i * 11.5, 430]], 4, COL.black);
  soap(c, 220, 700, 180, 110);
  shape(c, () => rrect(c, 420, 690, 150, 26, 8), COL.steelDk); c.save(); c.translate(430, 690); c.rotate(-0.2); shape(c, () => rrect(c, 0, -24, 140, 24, 8), COL.steel); c.restore();
  mug(c, 780, 780, 120, 130);
};
// flow.p1: the clean-week chart, seven days by four rows, the first days coloured in
const fp1 = (c: Ctx) => {
  ground(c);
  paper(c, 70, 120, 940, 800);
  const x0 = 220, y0 = 250, cw = 108, rh = 150;
  for (let d = 0; d < 7; d++) write(c, String(d + 1), x0 + d * cw + 38, 170, 50);
  for (let r = 0; r < 4; r++) for (let d = 0; d < 7; d++) { const x = x0 + d * cw, y = y0 + r * rh; shape(c, () => rrect(c, x, y, cw, rh, 4), WHITE, 4); if (d < 3 && !(d === 2 && r === 2)) shape(c, () => rrect(c, x + 16, y + 16, cw - 32, rh - 32, 10), COL.greenLt, 0); }
  sun(c, 125, 300, 22); moon(c, 140, 455, 24);
  for (const y of [340, 490]) { c.save(); c.translate(150, y); c.scale(0.4, 0.4); c.rotate(-0.4); brush(c, 0, 0, 0, 160); c.restore(); }
  bucket(c, 145, 650, 90, 90);
  plate(c, 145, 775, 65, 26);
  crayon(c, 880, 980, -0.15, COL.green);
};
// term.2 soap: a bar on a dish, foamy hands above it
const t2 = (c: Ctx) => {
  ground(c);
  palm(c, 400, 480, 1.0, 1); palm(c, 680, 480, 1.0, -1);
  foam(c, 540, 330, 320, 260, 6, 30);
  for (const [x, y] of [[470, 640], [600, 660], [540, 700]]) shape(c, () => ell(c, x, y, 10, 14), COL.drop, 3);
  plate(c, 540, 820, 260, 70);
  soap(c, 540, 745, 320, 170);
  foam(c, 460, 690, 260, 80, 12, 10);
};
// term.4 bristles: the brush head on a big back tooth, bristles bending into the grooves
const t4 = (c: Ctx) => {
  ground(c);
  molar(c, 540, 640, 480, 500);
  darrow(c, [640, 220], [780, 220]);
  c.save(); c.translate(540, 300); shape(c, () => rrect(c, -20, -16, 440, 32, 16), COL.blue); shade(c, () => rrect(c, -20, -16, 440, 32, 16), COL.blueDk, 0, -10); shape(c, () => rrect(c, -90, -22, 110, 44, 14), WHITE); c.restore();
  for (let i = 0; i < 7; i++) {
    const bx = 462 + i * 15, u = (bx - 540) / 240, top = 640 - 500 * (0.5 - 0.19 * Math.max(0, 1 - Math.abs(u * 4.5)));
    const pts = [[bx, 322], [bx + (i - 3) * 2, 360], [bx + (i - 3) * 4, top + 6]];
    line(c, pts, 8, INK); line(c, pts, 4, COL.teal);
  }
};
// expl.2 bath: the child pours a mug of water over their head and shoulders, bucket and soap beside
const x2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = COL.steelIn; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 6);
  shape(c, () => ell(c, 560, 960, 180, 24), COL.water, 4);
  bucket(c, 230, 930, 220, 240);
  person(c, 560, 930, 640, { armR: [-1.2, -2.2] });
  mug(c, 604, 281, 90, 110, -0.6);
  line(c, [[536, 208], [522, 300], [500, 400], [470, 470]], 22, INK); line(c, [[536, 208], [522, 300], [500, 400], [470, 470]], 14, COL.water);
  for (const [x, y] of [[450, 520], [640, 440], [500, 600], [660, 560]]) shape(c, () => ell(c, x, y, 10, 14), COL.drop, 3);
  plate(c, 880, 950, 95, 28); soap(c, 878, 900, 150, 80);
};

export const ic_healthHygieneL1 = cards("sci.health.hygiene.L1", [se1_0, se1_1, se1_2, se1_3, se2_0, se2_1, se3_0, se3_1, fe1, fe2, fe3, fa1, fa2, fa4, fp1, t2, t4, x2]);
