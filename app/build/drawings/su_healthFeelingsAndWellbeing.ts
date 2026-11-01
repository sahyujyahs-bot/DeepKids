import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, line, arrow, hand, write, cards } from "./flatKit";
import type { Ctx } from "./core";

// FEELINGS AND WELLBEING · set-up cards: feeling cards, covering half of a face, watching a smile and a yawn.
const TABLE = "#d9a066", TABLE_DK = "#b97f48";

// a round yellow feeling face for the paper cards
const feelFace = (c: Ctx, x: number, y: number, r: number, kind: string) => {
  const dk = "#e0a82a", eye = (ex: number, ey: number, rx: number, ry: number, pupil = true) => { shape(c, () => ell(c, ex, ey, rx, ry), WHITE, 4); if (pupil) shape(c, () => ell(c, ex, ey + ry * 0.1, rx * 0.5, ry * 0.5), INK, 0); };
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.18, r * 0.18, 0.5);
  shape(c, () => ell(c, x, y, r, r), "rgba(0,0,0,0)", 6);
  const ex = r * 0.38, ey = y - r * 0.15;
  if (kind === "happy") { eye(x - ex, ey, r * 0.13, r * 0.17); eye(x + ex, ey, r * 0.13, r * 0.17); line(c, [[x - r * 0.5, y + r * 0.25], [x - r * 0.25, y + r * 0.6], [x + r * 0.25, y + r * 0.6], [x + r * 0.5, y + r * 0.25]], 7); }
  if (kind === "sad") { eye(x - ex, ey, r * 0.13, r * 0.17); eye(x + ex, ey, r * 0.13, r * 0.17); line(c, [[x - r * 0.5, y - r * 0.5], [x - r * 0.25, y - r * 0.4]], 6); line(c, [[x + r * 0.5, y - r * 0.5], [x + r * 0.25, y - r * 0.4]], 6); line(c, [[x - r * 0.35, y + r * 0.6], [x, y + r * 0.4], [x + r * 0.35, y + r * 0.6]], 7); shape(c, () => { c.moveTo(x - ex, ey + r * 0.3); c.quadraticCurveTo(x - ex - r * 0.18, ey + r * 0.6, x - ex, ey + r * 0.65); c.quadraticCurveTo(x - ex + r * 0.18, ey + r * 0.6, x - ex, ey + r * 0.3); }, COL.water, 4); }
  if (kind === "angry") { shape(c, () => ell(c, x, y, r, r), "rgba(228,82,59,0.35)", 0); eye(x - ex, ey + r * 0.05, r * 0.12, r * 0.13); eye(x + ex, ey + r * 0.05, r * 0.12, r * 0.13); line(c, [[x - r * 0.62, ey - r * 0.32], [x - r * 0.15, ey - r * 0.05]], 9); line(c, [[x + r * 0.62, ey - r * 0.32], [x + r * 0.15, ey - r * 0.05]], 9); line(c, [[x - r * 0.4, y + r * 0.6], [x - r * 0.15, y + r * 0.42], [x + r * 0.15, y + r * 0.42], [x + r * 0.4, y + r * 0.6]], 8); }
  if (kind === "scared") { eye(x - ex, ey, r * 0.17, r * 0.22); eye(x + ex, ey, r * 0.17, r * 0.22); line(c, [[x - r * 0.6, ey - r * 0.38], [x - r * 0.2, ey - r * 0.5]], 6); line(c, [[x + r * 0.6, ey - r * 0.38], [x + r * 0.2, ey - r * 0.5]], 6); line(c, [[x - r * 0.4, y + r * 0.5], [x - r * 0.2, y + r * 0.38], [x, y + r * 0.52], [x + r * 0.2, y + r * 0.38], [x + r * 0.4, y + r * 0.5]], 6); }
  if (kind === "surprised") { eye(x - ex, ey, r * 0.15, r * 0.2); eye(x + ex, ey, r * 0.15, r * 0.2); line(c, [[x - r * 0.55, ey - r * 0.38], [x - r * 0.25, ey - r * 0.5], [x - r * 0.1, ey - r * 0.4]], 6); line(c, [[x + r * 0.55, ey - r * 0.38], [x + r * 0.25, ey - r * 0.5], [x + r * 0.1, ey - r * 0.4]], 6); shape(c, () => ell(c, x, y + r * 0.45, r * 0.16, r * 0.22), INK, 0); }
  if (kind === "disgusted") { line(c, [[x - ex - r * 0.15, ey], [x - ex + r * 0.15, ey - r * 0.04]], 8); line(c, [[x + ex - r * 0.15, ey - r * 0.04], [x + ex + r * 0.15, ey]], 8); line(c, [[x - r * 0.6, ey - r * 0.3], [x - r * 0.2, ey - r * 0.2]], 6); line(c, [[x + r * 0.6, ey - r * 0.3], [x + r * 0.2, ey - r * 0.2]], 6); line(c, [[x - r * 0.45, y + r * 0.42], [x - r * 0.1, y + r * 0.32], [x + r * 0.2, y + r * 0.45], [x + r * 0.45, y + r * 0.35]], 7); shape(c, () => { c.moveTo(x - r * 0.05, y + r * 0.4); c.lineTo(x + r * 0.35, y + r * 0.45); c.quadraticCurveTo(x + r * 0.3, y + r * 0.85, x + r * 0.12, y + r * 0.8); c.quadraticCurveTo(x - r * 0.02, y + r * 0.7, x - r * 0.05, y + r * 0.4); }, COL.pink, 5); }
};

// a head and shoulders for the faces, front on. adult = the woman; kind of mouth and eyes by option
type FaceOpt = { adult?: boolean; mouth?: "smile" | "yawn" | "flat" | "big"; eyes?: "open" | "shut" | "wide"; look?: number; skipMouth?: boolean };
const head = (c: Ctx, x: number, y: number, r: number, o: FaceOpt = {}) => {
  const ad = !!o.adult, skin = ad ? SKIN.adult : SKIN.child, skinDk = ad ? SKIN.adultDk : SKIN.childDk, cloth = ad ? CLOTH.adult : CLOTH.child, clothDk = ad ? CLOTH.adultDk : CLOTH.childDk;
  // shoulders and neck
  shape(c, () => { c.moveTo(x - r * 1.45, y + r * 3); c.lineTo(x - r * 1.35, y + r * 1.55); c.quadraticCurveTo(x - r * 1.3, y + r * 1.15, x - r * 0.55, y + r * 1.05); c.lineTo(x + r * 0.55, y + r * 1.05); c.quadraticCurveTo(x + r * 1.3, y + r * 1.15, x + r * 1.35, y + r * 1.55); c.lineTo(x + r * 1.45, y + r * 3); c.closePath(); }, cloth, 6);
  shade(c, () => { c.moveTo(x - r * 1.45, y + r * 3); c.lineTo(x - r * 1.35, y + r * 1.55); c.quadraticCurveTo(x - r * 1.3, y + r * 1.15, x - r * 0.55, y + r * 1.05); c.lineTo(x + r * 0.55, y + r * 1.05); c.quadraticCurveTo(x + r * 1.3, y + r * 1.15, x + r * 1.35, y + r * 1.55); c.lineTo(x + r * 1.45, y + r * 3); c.closePath(); }, clothDk, r * 0.3, 0, 0.6);
  shape(c, () => rrect(c, x - r * 0.28, y + r * 0.7, r * 0.56, r * 0.5, r * 0.15), skinDk, 6);
  // hair behind (bun for the woman, a pigtail for the girl)
  if (ad) shape(c, () => ell(c, x, y - r * 1.02, r * 0.38, r * 0.34), CLOTH.hair, 6); else { shape(c, () => ell(c, x + r * 1.0, y + r * 0.3, r * 0.3, r * 0.55, 0.25), CLOTH.hair, 6); shape(c, () => ell(c, x + r * 1.05, y + r * 0.95, r * 0.14, r * 0.14), COL.pink, 4); }
  // ears, head
  shape(c, () => ell(c, x - r * 0.98, y + r * 0.1, r * 0.13, r * 0.2), skin, 5); shape(c, () => ell(c, x + r * 0.98, y + r * 0.1, r * 0.13, r * 0.2), skin, 5);
  shape(c, () => ell(c, x, y, r, r * 1.08), skin, 6);
  shade(c, () => ell(c, x, y, r, r * 1.08), skinDk, r * 0.16, r * 0.1, 0.55);
  shape(c, () => ell(c, x, y, r, r * 1.08), "rgba(0,0,0,0)", 6);
  // hair cap with a centre parting
  const hp = () => { c.moveTo(x - r * 1.04, y + r * 0.05); c.bezierCurveTo(x - r * 1.1, y - r * 1.5, x + r * 1.1, y - r * 1.5, x + r * 1.04, y + r * 0.05); c.quadraticCurveTo(x + r * 0.7, y - r * 0.55, x, y - r * 0.6); c.quadraticCurveTo(x - r * 0.7, y - r * 0.55, x - r * 1.04, y + r * 0.05); c.closePath(); };
  shape(c, hp, CLOTH.hair, 6);
  if (ad) shape(c, () => ell(c, x, y - r * 0.36, r * 0.05, r * 0.05), RED, 0);
  // eyes
  const look = (o.look ?? 0) * r * 0.06, ey = y - r * 0.05, ex = r * 0.38, er = r * 0.13;
  for (const s of [-1, 1]) {
    if (o.eyes === "shut") line(c, [[x + s * ex - er * 1.3, ey], [x + s * ex, ey + er * 0.7], [x + s * ex + er * 1.3, ey]], 7);
    else { const k = o.eyes === "wide" ? 1.35 : 1; shape(c, () => ell(c, x + s * ex, ey, er * 1.3 * k, er * 1.2 * k), WHITE, 4); shape(c, () => ell(c, x + s * ex + look, ey, er * 0.7 * k, er * 0.75 * k), INK, 0); }
    line(c, [[x + s * (ex + er * 1.5), y - r * 0.32 - (o.eyes === "wide" ? r * 0.08 : 0)], [x + s * (ex - er * 1.4), y - r * 0.3 - (o.eyes === "wide" ? r * 0.04 : 0)]], 8, CLOTH.hair);
  }
  line(c, [[x, y + r * 0.08], [x - r * 0.07, y + r * 0.32], [x + r * 0.1, y + r * 0.33]], 5, skinDk);
  if (o.skipMouth) return;
  const my = y + r * 0.58;
  if (o.mouth === "yawn") { shape(c, () => ell(c, x, my + r * 0.05, r * 0.28, r * 0.36), "#6b2430", 6); shape(c, () => ell(c, x, my + r * 0.2, r * 0.17, r * 0.14), COL.pink, 0); }
  else if (o.mouth === "big") { shape(c, () => { c.moveTo(x - r * 0.48, my - r * 0.1); c.quadraticCurveTo(x, my + r * 0.06, x + r * 0.48, my - r * 0.1); c.quadraticCurveTo(x + r * 0.3, my + r * 0.5, x, my + r * 0.5); c.quadraticCurveTo(x - r * 0.3, my + r * 0.5, x - r * 0.48, my - r * 0.1); c.closePath(); }, "#6b2430", 6); shape(c, () => { c.moveTo(x - r * 0.42, my - r * 0.06); c.quadraticCurveTo(x, my + r * 0.05, x + r * 0.42, my - r * 0.06); c.lineTo(x + r * 0.4, my + r * 0.06); c.quadraticCurveTo(x, my + r * 0.16, x - r * 0.4, my + r * 0.06); c.closePath(); }, WHITE, 0); }
  else if (o.mouth === "smile") line(c, [[x - r * 0.42, my - r * 0.08], [x, my + r * 0.25], [x + r * 0.42, my - r * 0.08]], 8, INK);
  else line(c, [[x - r * 0.2, my + r * 0.05], [x + r * 0.2, my + r * 0.05]], 7, INK);
};

const notebook = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.5 + 14, y + h + 6, w * 0.52, 20);
  shape(c, () => rrect(c, x, y, w, h, 14), COL.teal, 6);
  shade(c, () => rrect(c, x, y, w, h, 14), COL.tealDk, 22, 18, 0.6);
  shape(c, () => rrect(c, x, y, w, h, 14), "rgba(0,0,0,0)", 6);
  for (let k = 0; k < 6; k++) { const px = x + 30 + k * ((w - 60) / 5); shape(c, () => ell(c, px, y + 4, 8, 12), COL.paper, 3); }
  shape(c, () => rrect(c, x + w * 0.3, y + h * 0.35, w * 0.4, h * 0.3, 8), COL.paper, 4);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, TABLE);
  const kinds = ["happy", "sad", "angry", "scared", "surprised", "disgusted"], bands = [COL.yellow, COL.blue, COL.red, COL.purple, COL.orange, COL.green];
  kinds.forEach((k, i) => {
    const cx = 215 + (i % 3) * 325, cy = 290 + Math.floor(i / 3) * 440, rot = [-0.05, 0.04, -0.03, 0.05, -0.04, 0.03][i];
    c.save(); c.translate(cx, cy); c.rotate(rot);
    shadow(c, 14, 188, 135, 18);
    shape(c, () => rrect(c, -135, -180, 270, 360, 18), COL.paper, 6);
    shade(c, () => rrect(c, -135, -180, 270, 360, 18), "#e4dccb", 16, 16, 0.7);
    shape(c, () => rrect(c, -135, -180, 270, 360, 18), "rgba(0,0,0,0)", 6);
    shape(c, () => rrect(c, -105, 95, 210, 52, 12), bands[i], 5);
    feelFace(c, 0, -30, 98, k);
    c.restore();
  });
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  head(c, 320, 400, 200, { adult: true, eyes: "wide", skipMouth: true });
  notebook(c, 140, 470, 360, 300);
  hand(c, 130, 640, 0, 1.8, SKIN.adult, CLOTH.adult);
  hand(c, 600, 640, Math.PI, 1.8, SKIN.adult, CLOTH.adult);
  head(c, 905, 590, 120, { look: -3, mouth: "flat" });
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  head(c, 320, 400, 200, { adult: true, mouth: "big" });
  notebook(c, 130, 250, 380, 230);
  hand(c, 130, 370, 0, 1.8, SKIN.adult, CLOTH.adult);
  hand(c, 610, 370, Math.PI, 1.8, SKIN.adult, CLOTH.adult);
  head(c, 905, 590, 120, { look: -3, mouth: "flat" });
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  head(c, 290, 380, 190, { adult: true, mouth: "big" });
  head(c, 810, 470, 140, { look: -4, mouth: "flat", eyes: "wide" });
  // table, and the phone timer standing on it
  shape(c, () => rrect(c, -20, 800, D + 40, 300, 0), TABLE, 6);
  shade(c, () => rrect(c, -20, 800, D + 40, 300, 0), TABLE_DK, 0, 40, 0.5);
  line(c, [[0, 800], [D, 800]], 6);
  shadow(c, 560, 985, 150, 22);
  shape(c, () => rrect(c, 410, 620, 300, 360, 30), COL.black, 6);
  shape(c, () => rrect(c, 432, 648, 256, 304, 14), "#22303a", 4);
  shape(c, () => ell(c, 560, 810, 80, 80), "rgba(0,0,0,0)", 0);
  c.beginPath(); ell(c, 560, 800, 92, 92); c.strokeStyle = COL.tealDk; c.lineWidth = 16; c.stroke();
  c.beginPath(); c.arc(560, 800, 92, -Math.PI / 2, Math.PI * 0.9); c.strokeStyle = "#c9f06b"; c.lineWidth = 16; c.lineCap = "round"; c.stroke();
  write(c, "3", 538, 770, 62, "#c9f06b", 8);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  head(c, 340, 410, 200, { adult: true, mouth: "yawn", eyes: "shut" });
  hand(c, 500, 850, -2.2, 2, SKIN.adult, CLOTH.adult, true);
  head(c, 850, 590, 135, { look: -3, mouth: "flat", eyes: "wide" });
};

export const su_healthFeelingsAndWellbeing = cards("sci.health.feelings-and-wellbeing.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1]);
