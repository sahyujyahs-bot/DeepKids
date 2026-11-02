import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, bowl, write, cards } from "./flatKit";

// sci.health.feelings-and-wellbeing.L3 · picture cards. Same child and grown-up as the set-up cards.
const NONE = "rgba(0,0,0,0)", DKRED = "#6b2430", HAIR = CLOTH.hair, PANTS = "#6b5a8c";

// ---------------------------------------------------------------- faces
type Ex = { eyes: "open" | "wide" | "shut" | "happy" | "squint" | "tight"; brow: [number, number]; lift?: number; mouth: string; tear?: boolean; sweat?: boolean; crinkle?: boolean; cheeks?: boolean };
const EX: Record<string, Ex> = {
  neutral: { eyes: "open", brow: [0, 0], mouth: "flat" },
  smile: { eyes: "open", brow: [-0.03, -0.03], mouth: "smile" },
  happy: { eyes: "happy", brow: [-0.04, -0.04], mouth: "grin" },
  real: { eyes: "squint", brow: [0.02, -0.03], mouth: "grin", crinkle: true, cheeks: true },
  polite: { eyes: "open", brow: [0, 0], mouth: "polite" },
  frown: { eyes: "open", brow: [-0.04, 0.1], mouth: "frown" },
  sad: { eyes: "open", brow: [0.1, -0.12], mouth: "frown", tear: true },
  angry: { eyes: "open", brow: [-0.1, 0.14], mouth: "clench" },
  scared: { eyes: "wide", brow: [-0.06, -0.18], lift: -0.08, mouth: "wobble", sweat: true },
  scaredShut: { eyes: "wide", brow: [-0.04, -0.15], lift: -0.06, mouth: "flat" },
  surprised: { eyes: "wide", brow: [-0.1, -0.1], lift: -0.14, mouth: "o" },
  surprisedShut: { eyes: "wide", brow: [-0.12, -0.1], lift: -0.13, mouth: "flat" },
  yawn: { eyes: "tight", brow: [0.02, -0.04], mouth: "yawn" },
  yawnStart: { eyes: "squint", brow: [0, -0.02], mouth: "o" },
  calm: { eyes: "shut", brow: [0, -0.02], mouth: "soft" },
  disgust: { eyes: "squint", brow: [-0.05, 0.1], mouth: "sneer" },
  brave: { eyes: "open", brow: [-0.08, 0.05], mouth: "smile" },
  love: { eyes: "open", brow: [-0.05, -0.05], mouth: "soft", cheeks: true },
};
// the eyes, brows and mouth of a face of radius r centred at (x, y)
const features = (c: Ctx, x: number, y: number, r: number, ex: string, browCol: string = HAIR) => {
  const E = EX[ex], ex0 = r * 0.38, er = r * 0.13, ey = y - r * 0.02, my = y + r * 0.55, lift = (E.lift ?? 0) * r;
  for (const s of [-1, 1]) {
    const cx = x + s * ex0;
    if (E.eyes === "open" || E.eyes === "wide") { const k = E.eyes === "wide" ? 1.35 : 1; shape(c, () => ell(c, cx, ey, er * 1.3 * k, er * 1.2 * k), WHITE, 4); shape(c, () => ell(c, cx, ey, er * 0.7 * k, er * 0.75 * k), INK, 0); }
    else if (E.eyes === "squint") { shape(c, () => ell(c, cx, ey + er * 0.2, er * 1.3, er * 0.6), WHITE, 4); shape(c, () => ell(c, cx, ey + er * 0.2, er * 0.55, er * 0.5), INK, 0); }
    else if (E.eyes === "shut") line(c, [[cx - er * 1.3, ey], [cx, ey + er * 0.75], [cx + er * 1.3, ey]], 7);
    else if (E.eyes === "happy") line(c, [[cx - er * 1.3, ey + er * 0.5], [cx, ey - er * 0.6], [cx + er * 1.3, ey + er * 0.5]], 7);
    else line(c, [[cx - s * er * 1.2, ey - er * 0.9], [cx + s * er * 0.5, ey], [cx - s * er * 1.2, ey + er * 0.9]], 7);
    const by = y - r * 0.34 + lift;
    line(c, [[x + s * (ex0 + er * 1.6), by + E.brow[0] * r], [x + s * (ex0 - er * 1.5), by + E.brow[1] * r]], 8, browCol);
    if (E.crinkle) for (const a of [-0.5, 0, 0.5]) line(c, [[cx + s * er * 1.9, ey + a * er * 1.1], [cx + s * er * 2.8, ey + a * er * 2.1]], 4);
    if (E.cheeks) { c.globalAlpha = 0.45; shape(c, () => ell(c, cx + s * er * 0.3, ey + er * 2.6, er * 1.6, er * 0.95), "#e8593f", 0); c.globalAlpha = 1; }
  }
  if (E.tear) shape(c, () => { const tx = x - ex0 + er * 0.4, ty = ey + er * 1.8; c.moveTo(tx, ty); c.quadraticCurveTo(tx - r * 0.16, ty + r * 0.3, tx, ty + r * 0.34); c.quadraticCurveTo(tx + r * 0.16, ty + r * 0.3, tx, ty); }, COL.water, 4);
  if (E.sweat) shape(c, () => { const tx = x + r * 0.78, ty = y - r * 0.5; c.moveTo(tx, ty); c.quadraticCurveTo(tx - r * 0.14, ty + r * 0.26, tx, ty + r * 0.3); c.quadraticCurveTo(tx + r * 0.14, ty + r * 0.26, tx, ty); }, COL.water, 4);
  const m = E.mouth;
  if (m === "smile") line(c, [[x - r * 0.4, my - r * 0.1], [x, my + r * 0.22], [x + r * 0.4, my - r * 0.1]], 8);
  else if (m === "soft") line(c, [[x - r * 0.25, my - r * 0.03], [x, my + r * 0.1], [x + r * 0.25, my - r * 0.03]], 7);
  else if (m === "polite") line(c, [[x - r * 0.28, my - r * 0.02], [x, my + r * 0.06], [x + r * 0.28, my - r * 0.02]], 7);
  else if (m === "frown") line(c, [[x - r * 0.3, my + r * 0.14], [x, my - r * 0.02], [x + r * 0.3, my + r * 0.14]], 8);
  else if (m === "flat") line(c, [[x - r * 0.22, my + r * 0.05], [x + r * 0.22, my + r * 0.05]], 7);
  else if (m === "o") shape(c, () => ell(c, x, my + r * 0.1, r * 0.14, r * 0.2), DKRED, 5);
  else if (m === "wobble") line(c, [[x - r * 0.4, my + r * 0.08], [x - r * 0.2, my - r * 0.04], [x, my + r * 0.1], [x + r * 0.2, my - r * 0.04], [x + r * 0.4, my + r * 0.08]], 7);
  else if (m === "sneer") line(c, [[x - r * 0.4, my + r * 0.12], [x - r * 0.1, my + r * 0.02], [x + r * 0.2, my + r * 0.16], [x + r * 0.42, my - r * 0.02]], 7);
  else if (m === "clench") { shape(c, () => rrect(c, x - r * 0.32, my - r * 0.02, r * 0.64, r * 0.2, r * 0.07), WHITE, 5); line(c, [[x, my - r * 0.02], [x, my + r * 0.18]], 3); }
  else if (m === "yawn") { shape(c, () => ell(c, x, my + r * 0.12, r * 0.26, r * 0.36), DKRED, 6); shape(c, () => ell(c, x, my + r * 0.28, r * 0.15, r * 0.12), COL.pink, 0); }
  else if (m === "grin") { shape(c, () => { c.moveTo(x - r * 0.46, my - r * 0.1); c.quadraticCurveTo(x, my + r * 0.06, x + r * 0.46, my - r * 0.1); c.quadraticCurveTo(x + r * 0.3, my + r * 0.46, x, my + r * 0.46); c.quadraticCurveTo(x - r * 0.3, my + r * 0.46, x - r * 0.46, my - r * 0.1); c.closePath(); }, DKRED, 6); shape(c, () => { c.moveTo(x - r * 0.4, my - r * 0.05); c.quadraticCurveTo(x, my + r * 0.05, x + r * 0.4, my - r * 0.05); c.lineTo(x + r * 0.38, my + r * 0.07); c.quadraticCurveTo(x, my + r * 0.17, x - r * 0.38, my + r * 0.07); c.closePath(); }, WHITE, 0); }
};
// a yellow round feeling face
const emoji = (c: Ctx, x: number, y: number, r: number, ex: string) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.8, r * 0.12);
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
  shade(c, () => ell(c, x, y, r, r), "#e0a82a", r * 0.18, r * 0.18, 0.5);
  shape(c, () => ell(c, x, y, r, r), NONE, 6);
  features(c, x, y, r, ex, INK);
};
type HeadOpt = { adult?: boolean; boy?: boolean; body?: boolean; cloth?: string; clothDk?: string };
// a head (and shoulders if body) of the child or grown-up, front on; r = head radius
const head = (c: Ctx, x: number, y: number, r: number, ex: string, o: HeadOpt = {}) => {
  const ad = !!o.adult, skin = ad ? SKIN.adult : SKIN.child, skinDk = ad ? SKIN.adultDk : SKIN.childDk, cl = o.cloth ?? (ad ? CLOTH.adult : CLOTH.child), clDk = o.clothDk ?? (ad ? CLOTH.adultDk : CLOTH.childDk);
  if (o.body) {
    shape(c, () => rrect(c, x - r * 1.4, y + r * 1.05, r * 2.8, r * 3, r * 0.8), cl); shade(c, () => rrect(c, x - r * 1.4, y + r * 1.05, r * 2.8, r * 3, r * 0.8), clDk, r * 0.5, 0);
    shape(c, () => rrect(c, x - r * 0.28, y + r * 0.7, r * 0.56, r * 0.5, r * 0.15), skinDk, 6);
  }
  if (!o.adult && !o.boy) shape(c, () => ell(c, x + r * 1.0, y + r * 0.3, r * 0.3, r * 0.55, 0.25), HAIR, 6);
  if (ad) shape(c, () => ell(c, x, y - r * 1.02, r * 0.38, r * 0.34), HAIR, 6);
  shape(c, () => ell(c, x - r * 0.98, y + r * 0.1, r * 0.13, r * 0.2), skin, 5); shape(c, () => ell(c, x + r * 0.98, y + r * 0.1, r * 0.13, r * 0.2), skin, 5);
  shape(c, () => ell(c, x, y, r, r * 1.08), skin, 6);
  shade(c, () => ell(c, x, y, r, r * 1.08), skinDk, r * 0.16, r * 0.1, 0.55);
  shape(c, () => ell(c, x, y, r, r * 1.08), NONE, 6);
  shape(c, () => { c.moveTo(x - r * 1.04, y + r * 0.05); c.bezierCurveTo(x - r * 1.1, y - r * 1.5, x + r * 1.1, y - r * 1.5, x + r * 1.04, y + r * 0.05); c.quadraticCurveTo(x + r * 0.7, y - r * 0.55, x, y - r * 0.6); c.quadraticCurveTo(x - r * 0.7, y - r * 0.55, x - r * 1.04, y + r * 0.05); c.closePath(); }, HAIR, 6);
  line(c, [[x, y + r * 0.1], [x - r * 0.07, y + r * 0.32], [x + r * 0.1, y + r * 0.33]], 5, skinDk);
  features(c, x, y, r, ex);
};

// ---------------------------------------------------------------- small helpers
const frame = (c: Ctx, x: number, y: number, w: number, h: number, bg: string, fn: () => void) => {
  c.save(); c.beginPath(); rrect(c, x, y, w, h, 30); c.clip(); c.fillStyle = bg; c.fillRect(x, y, w, h); fn(); c.restore();
  shape(c, () => rrect(c, x, y, w, h, 30), NONE, 7);
};
const disc = (c: Ctx, x: number, y: number, r: number, bg: string, fn: () => void) => {
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.fillStyle = bg; c.fillRect(x - r, y - r, r * 2, r * 2); fn(); c.restore();
  shape(c, () => ell(c, x, y, r, r), NONE, 7);
};
const heartP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y + 0.9 * s); c.bezierCurveTo(x - 1.5 * s, y + 0.1 * s, x - 0.9 * s, y - 0.95 * s, x, y - 0.3 * s); c.bezierCurveTo(x + 0.9 * s, y - 0.95 * s, x + 1.5 * s, y + 0.1 * s, x, y + 0.9 * s); c.closePath(); };
const heart = (c: Ctx, x: number, y: number, s: number, col: string = RED) => { shape(c, () => heartP(c, x, y, s), col, Math.max(3, s * 0.12)); line(c, [[x - s * 0.7, y - s * 0.3], [x - s * 0.45, y - s * 0.55]], Math.max(3, s * 0.12), WHITE); };
// short beat marks either side of a heart
const beat = (c: Ctx, x: number, y: number, s: number) => { for (const k of [-1, 1]) { line(c, [[x + k * s * 1.5, y - s * 0.6], [x + k * s * 2.0, y - s * 0.9]], 6, RED); line(c, [[x + k * s * 1.7, y], [x + k * s * 2.3, y]], 6, RED); line(c, [[x + k * s * 1.5, y + s * 0.6], [x + k * s * 2.0, y + s * 0.9]], 6, RED); } };
const sweatDrop = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(x - s * 0.5, y + s * 0.9, x, y + s * 1.05); c.quadraticCurveTo(x + s * 0.5, y + s * 0.9, x, y); }, COL.water, 4);
const bubble = (c: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) => {
  shape(c, () => rrect(c, x, y, w, h, 40), WHITE, 6);
  shape(c, () => polyP(c, [[x + w * 0.35, y + h - 4], [tx, ty], [x + w * 0.55, y + h - 4]]), WHITE, 6);
  shape(c, () => rrect(c, x + 6, y + h - 14, w - 12, 18, 6), WHITE, 0);
};
const moon = (c: Ctx, x: number, y: number, s: number, bg: string) => {
  shape(c, () => ell(c, x, y, s, s), COL.yellow, 5);
  c.save(); c.beginPath(); ell(c, x, y, s, s); c.clip(); c.beginPath(); ell(c, x + s * 0.5, y - s * 0.25, s * 0.85, s * 0.85); c.fillStyle = bg; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); c.restore();
  c.save(); c.beginPath(); c.rect(0, 0, D, D); ell(c, x + s * 0.5, y - s * 0.25, s * 0.85, s * 0.85); c.clip("evenodd"); c.beginPath(); ell(c, x, y, s, s); c.lineWidth = 5; c.strokeStyle = INK; c.stroke(); c.restore();
};
const star = (c: Ctx, x: number, y: number, s: number, col: string = COL.yellow) => shape(c, () => { const p: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? s * 0.45 : s; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } polyP(c, p); }, col, 4);
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), COL.red, 5); shade(c, () => ell(c, x, y, r, r), "#b83c28", r * 0.25, r * 0.2, 0.5); shape(c, () => ell(c, x, y, r, r), NONE, 5);
  line(c, [[x - r * 0.95, y - r * 0.2], [x, y - r * 0.55], [x + r * 0.95, y - r * 0.2]], 5, WHITE); line(c, [[x - r * 0.95, y + r * 0.25], [x, y + r * 0.6], [x + r * 0.95, y + r * 0.25]], 5, WHITE);
};
const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string = COL.purple) => {
  shape(c, () => rrect(c, x, y, w, h, 8), col, 5); shape(c, () => rrect(c, x + w * 0.1, y + h * 0.1, w * 0.85, h * 0.8, 4), COL.paper, 3);
  line(c, [[x + w * 0.22, y + h * 0.3], [x + w * 0.8, y + h * 0.3]], 4, COL.grey); line(c, [[x + w * 0.22, y + h * 0.5], [x + w * 0.8, y + h * 0.5]], 4, COL.grey); line(c, [[x + w * 0.22, y + h * 0.7], [x + w * 0.6, y + h * 0.7]], 4, COL.grey);
};
const butterfly = (c: Ctx, x: number, y: number, s: number, col: string = COL.orange) => {
  for (const k of [-1, 1]) { shape(c, () => ell(c, x + k * s * 0.55, y - s * 0.35, s * 0.55, s * 0.4, k * -0.5), col, 4); shape(c, () => ell(c, x + k * s * 0.45, y + s * 0.3, s * 0.38, s * 0.28, k * 0.5), COL.yellow, 4); }
  shape(c, () => ell(c, x, y, s * 0.13, s * 0.5), INK, 0);
};
const flower = (c: Ctx, x: number, y: number, s: number) => {
  for (let i = 0; i < 5; i++) { const a = (i * Math.PI * 2) / 5 - Math.PI / 2; shape(c, () => ell(c, x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.45, s * 0.45), COL.pink, 4); }
  shape(c, () => ell(c, x, y, s * 0.38, s * 0.38), COL.yellow, 4);
};
const umbrella = (c: Ctx, x: number, y: number, w: number, col: string = COL.teal) => {
  const top = () => { c.moveTo(x - w, y); c.bezierCurveTo(x - w, y - w * 0.95, x + w, y - w * 0.95, x + w, y); c.quadraticCurveTo(x + w * 0.67, y - w * 0.15, x + w * 0.33, y); c.quadraticCurveTo(x, y - w * 0.15, x - w * 0.33, y); c.quadraticCurveTo(x - w * 0.67, y - w * 0.15, x - w, y); c.closePath(); };
  shape(c, top, col, 6); shade(c, top, COL.tealDk, w * 0.2, 0, 0.55);
  line(c, [[x, y - w * 0.72], [x - w * 0.33, y - w * 0.02]], 4); line(c, [[x, y - w * 0.72], [x + w * 0.33, y - w * 0.02]], 4);
};
const bodyOutline = (c: Ctx, x: number, y: number, h: number, fill: string = "#f3d3b3") => {
  const parts: [() => void][] = [];
  void parts;
  for (const s of [-1, 1]) { const arm = [[x + s * h * 0.11, y + h * 0.235], [x + s * h * 0.2, y + h * 0.52]]; line(c, arm, h * 0.062, INK); line(c, arm, h * 0.062 - 10, fill); const leg = [[x + s * h * 0.05, y + h * 0.56], [x + s * h * 0.065, y + h * 0.96]]; line(c, leg, h * 0.09, INK); line(c, leg, h * 0.09 - 10, fill); }
  shape(c, () => rrect(c, x - h * 0.115, y + h * 0.2, h * 0.23, h * 0.38, h * 0.06), fill, 6);
  shape(c, () => rrect(c, x - h * 0.03, y + h * 0.15, h * 0.06, h * 0.08, 6), fill, 5);
  shape(c, () => ell(c, x, y + h * 0.085, h * 0.075, h * 0.085), fill, 6);
};
const swirl = (c: Ctx, x: number, y: number, s: number) => { c.beginPath(); for (let t = 0; t < 12; t += 0.2) { const rr = s * (0.1 + t * 0.075), a = t; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; t ? c.lineTo(px, py) : c.moveTo(px, py); } c.strokeStyle = COL.orange; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); };
const dogShape = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const B = "#c98a4e", BD = "#a56a36";
  for (const lx of [-120, -60, 70, 130]) shape(c, () => rrect(c, lx - 18, 20, 36, 105, 14), B, 6);
  shape(c, () => { c.moveTo(150, -20); c.quadraticCurveTo(210, -90, 190, -150); c.lineTo(165, -140); c.quadraticCurveTo(165, -80, 120, -40); c.closePath(); }, B, 6);
  shape(c, () => ell(c, 20, -5, 165, 85), B, 6); shade(c, () => ell(c, 20, -5, 165, 85), BD, 14, 18, 0.5);
  shape(c, () => ell(c, 20, -5, 165, 85), NONE, 6);
  shape(c, () => ell(c, -140, -50, 80, 70), B, 6); shape(c, () => ell(c, -205, -30, 50, 36), "#e6b57e", 6);
  shape(c, () => polyP(c, [[-240, -65], [-205, -75], [-195, -50], [-235, -45]]), INK, 4);
  shape(c, () => { c.moveTo(-195, -15); c.lineTo(-250, -15); c.quadraticCurveTo(-225, 40, -190, 22); c.closePath(); }, DKRED, 5);
  shape(c, () => polyP(c, [[-243, -15], [-232, 3], [-222, -15]]), WHITE, 3);
  shape(c, () => ell(c, -140, -80, 11, 11), INK, 0);
  shape(c, () => { c.moveTo(-120, -100); c.quadraticCurveTo(-80, -90, -60, -20); c.quadraticCurveTo(-110, -30, -120, -100); }, BD, 5);
  c.restore();
};
const kathakali = null;
void kathakali;

// ---------------------------------------------------------------- cards
const intro = (c: Ctx) => {
  ground(c);
  frame(c, 50, 200, 450, 640, COL.sky, () => head(c, 275, 420, 135, "scaredShut", { body: true }));
  frame(c, 580, 200, 450, 640, COL.sky, () => head(c, 805, 420, 135, "surprisedShut", { body: true }));
  line(c, [[500, 500], [580, 500]], 12, RED); line(c, [[500, 560], [580, 560]], 12, RED);
  heart(c, 540, 120, 50);
};
const summary = (c: Ctx) => {
  ground(c);
  disc(c, 540, 540, 350, COL.sky, () => { head(c, 540, 470, 170, "happy", { body: true }); });
  heart(c, 520, 800, 38); beat(c, 520, 800, 38);
  emoji(c, 150, 150, 105, "sad"); emoji(c, 930, 150, 105, "angry"); emoji(c, 150, 930, 105, "scared"); emoji(c, 930, 930, 105, "surprised");
};
const flowE1 = (c: Ctx) => {
  ground(c);
  emoji(c, 290, 520, 200, "sad"); emoji(c, 790, 520, 200, "scared");
  // a paper card hides the top half of the left face, the bottom half of the right face
  shadow(c, 300, 585, 250, 22);
  shape(c, () => rrect(c, 50, 270, 480, 310, 12), COL.paper, 6);
  shadow(c, 800, 790, 250, 22);
  shape(c, () => rrect(c, 550, 575, 480, 200, 12), COL.paper, 6);
};
const flowE2 = (c: Ctx) => {
  ground(c);
  frame(c, 40, 260, 460, 700, COL.sky, () => head(c, 270, 560, 150, "yawn", { adult: true, body: true }));
  frame(c, 580, 260, 460, 700, "#f7d9c4", () => head(c, 810, 560, 150, "yawnStart", { body: true }));
  arrow(c, [[505, 600], [575, 600]], RED, 12);
  // stopwatch
  shape(c, () => rrect(c, 515, 40, 50, 36, 8), COL.steelDk, 5); shape(c, () => ell(c, 540, 150, 80, 80), WHITE, 7);
  line(c, [[540, 150], [540, 98]], 7); line(c, [[540, 150], [575, 170]], 7); shape(c, () => ell(c, 540, 150, 9, 9), INK, 0);
};
const flowA1 = (c: Ctx) => {
  ground(c);
  const ks = ["happy", "sad", "angry", "scared", "surprised", "disgust", "calm", "yawn"];
  ks.forEach((k, i) => { const a = -Math.PI / 2 + (i * Math.PI * 2) / 8; emoji(c, 540 + Math.cos(a) * 350, 540 + Math.sin(a) * 350, 110, k); });
  shape(c, () => ell(c, 540, 540, 140, 140), WHITE, 7); write(c, "10", 436, 470, 140, INK, 12);
};
const flowA2 = (c: Ctx) => {
  ground(c);
  const pol = (x: number, y: number, ex: string) => { shadow(c, x + 170, y + 460, 190, 22); shape(c, () => rrect(c, x, y, 340, 420, 14), WHITE, 6); c.save(); c.beginPath(); rrect(c, x + 25, y + 25, 290, 290, 8); c.clip(); c.fillStyle = COL.sky; c.fillRect(x + 25, y + 25, 290, 290); c.restore(); shape(c, () => rrect(c, x + 25, y + 25, 290, 290, 8), NONE, 5); emoji(c, x + 170, y + 170, 105, ex); };
  pol(30, 330, "polite"); pol(370, 250, "real"); pol(710, 330, "polite");
  // ring round the eyes of the real smile
  c.beginPath(); c.ellipse(540, 405, 135, 42, 0, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 11; c.stroke();
  // a hand lens
  line(c, [[900, 160], [820, 240]], 22, INK); line(c, [[900, 160], [820, 240]], 12, COL.wood);
  shape(c, () => ell(c, 760, 110, 85, 85), COL.glass, 8);
};
const flowA3 = (c: Ctx) => {
  ground(c);
  bodyOutline(c, 540, 100, 900);
  // blush, heart, tummy, sweaty hands, lump in the throat
  c.globalAlpha = 0.5; shape(c, () => ell(c, 490, 205, 22, 14), "#e8593f", 0); shape(c, () => ell(c, 590, 205, 22, 14), "#e8593f", 0); c.globalAlpha = 1;
  shape(c, () => ell(c, 505, 182, 8, 10), INK, 0); shape(c, () => ell(c, 575, 182, 8, 10), INK, 0); line(c, [[510, 222], [540, 240], [570, 222]], 6);
  shape(c, () => ell(c, 540, 304, 26, 14), COL.yellow, 5);
  heart(c, 495, 370, 44); beat(c, 495, 370, 30);
  swirl(c, 540, 500, 40); butterfly(c, 600, 460, 34); butterfly(c, 470, 530, 30, COL.pink);
  sweatDrop(c, 350, 600, 24); sweatDrop(c, 730, 600, 24);
  arrow(c, [[250, 380], [440, 372]], RED, 9); arrow(c, [[830, 520], [600, 500]], RED, 9); arrow(c, [[300, 560], [345, 590]], RED, 9);
};
const flowA4 = (c: Ctx) => {
  ground(c);
  const ks = ["love", "happy", "sad", "angry", "brave", "scared", "disgust", "surprised", "calm"], bgs = [COL.sky, "#fbe3a4", "#cfe3f5", "#f5c2b8", "#f7d9c4", "#e0d2f2", "#cfe8c4", "#fbd5e1", "#d4efe9"];
  ks.forEach((k, i) => { const cx = 190 + (i % 3) * 350, cy = 190 + Math.floor(i / 3) * 350; frame(c, cx - 160, cy - 160, 320, 320, bgs[i], () => { head(c, cx, cy + 5, 105, k); shape(c, () => ell(c, cx, cy - 55, 8, 8), RED, 0); }); });
};
const hurry = (c: Ctx, x: number, y: number, w: number) => { line(c, [[x, y], [x + w, y]], 10, RED); };
void hurry;
const flowA5 = (c: Ctx) => {
  ground(c);
  frame(c, 40, 200, 320, 640, "#f5c2b8", () => { hand(c, 200, 780, -Math.PI / 2, 2.4, SKIN.child, CLOTH.child, true); });
  frame(c, 380, 200, 320, 640, COL.sky, () => { head(c, 540, 620, 100, "angry", { body: true }); });
  bubble(c, 400, 230, 280, 190, 480, 470); emoji(c, 540, 320, 70, "angry");
  frame(c, 720, 200, 320, 640, "#cfe8c4", () => head(c, 880, 560, 105, "calm", { body: true }));
  for (const s of [-1, 1]) arrow(c, [[880 + s * 130, 400], [880 + s * 145, 480], [880 + s * 100, 560]], RED, 8);
  write(c, "1", 175, 100, 90, INK, 12); write(c, "2", 515, 100, 90, INK, 12); write(c, "3", 855, 100, 90, INK, 12);
};
const flowA6 = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540, R = 400, cols = ["#9db4e4", "#f9c47e", "#a9d98b", "#c7aef0", "#f7a9c0"];
  for (let i = 0; i < 5; i++) { const a0 = -Math.PI / 2 + (i * Math.PI * 2) / 5, a1 = a0 + (Math.PI * 2) / 5; shape(c, () => { c.moveTo(cx, cy); c.arc(cx, cy, R, a0, a1); c.closePath(); }, cols[i], 7); }
  const at = (i: number, rr: number): [number, number] => { const a = -Math.PI / 2 + ((i + 0.5) * Math.PI * 2) / 5; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; };
  let [x, y] = at(0, 270); moon(c, x, y, 60, cols[0]); star(c, x + 70, y - 45, 22); star(c, x - 60, y + 55, 16);
  [x, y] = at(1, 270); bowl(c, x, y - 15, 80, COL.yellow); shape(c, () => ell(c, x - 25, y - 20, 22, 22), COL.red, 4);
  [x, y] = at(2, 270); ball(c, x, y, 62);
  [x, y] = at(3, 270); book(c, x - 55, y - 45, 110, 90);
  [x, y] = at(4, 270); emoji(c, x - 50, y, 50, "happy"); emoji(c, x + 50, y + 5, 50, "smile");
  shape(c, () => ell(c, cx, cy, 120, 120), WHITE, 7); write(c, "24", 450, 480, 110, INK, 11);
};
const flowG1 = (c: Ctx) => {
  ground(c);
  frame(c, 30, 150, 600, 800, "#e0d2f2", () => {
    head(c, 330, 520, 190, "scared", { body: true });
    for (const s of [-1, 1]) { shape(c, () => rrect(c, 330 + s * 250 - 70, 540, 140, 300, 60), CLOTH.child, 6); shape(c, () => ell(c, 330 + s * 250, 480, 62, 70), SKIN.child, 6); for (const f of [-1, 0, 1]) line(c, [[330 + s * 250 + f * 24, 440], [330 + s * 250 + f * 24, 405]], 14, INK), line(c, [[330 + s * 250 + f * 24, 440], [330 + s * 250 + f * 24, 405]], 7, SKIN.child); }
  });
  frame(c, 660, 150, 390, 800, COL.sky, () => { head(c, 760, 770, 90, "smile", { adult: true, body: true }); head(c, 950, 800, 70, "smile", { body: true }); });
  bubble(c, 700, 190, 300, 230, 800, 560); emoji(c, 850, 300, 85, "scared");
};
const flowP1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 770, 1120, 40, 4), COL.greenLt, 6);
  shadow(c, 330, 790, 120, 18); shadow(c, 700, 790, 130, 18);
  person(c, 330, 785, 440, { armR: [-0.1, 0] }); person(c, 720, 785, 570, { adult: true });
  line(c, [[525, 435], [545, 505]], 8, COL.leaf); flower(c, 520, 410, 45);
  for (let i = 0; i < 7; i++) { const hx = 150 + i * 130; if (i < 3) heart(c, hx, 900, 45); else { shape(c, () => heartP(c, hx, 900, 45), WHITE, 6); } }
};
const flowC1 = (c: Ctx) => {
  ground(c, "#e9d7f2");
  c.fillStyle = "#d9c4ea"; c.fillRect(540, 0, 540, 780); line(c, [[540, 0], [540, 780]], 6);
  shape(c, () => polyP(c, [[0, 780], [1080, 780], [1080, 1080], [0, 1080]]), "#e7b57a", 6);
  shape(c, () => ell(c, 540, 900, 420, 130), COL.pink, 7); shape(c, () => ell(c, 540, 900, 320, 95), "#f7c9d7", 5);
  // plant, lamp
  shadow(c, 170, 800, 110, 16); shape(c, () => polyP(c, [[110, 640], [230, 640], [215, 790], [125, 790]]), COL.soil, 6);
  const lf = (x0: number, y0: number, a: number) => { const l = 180, tx = x0 + Math.cos(a) * l, ty = y0 + Math.sin(a) * l; shape(c, () => { c.moveTo(x0, y0); c.quadraticCurveTo((x0 + tx) / 2 + 30, (y0 + ty) / 2, tx, ty); c.quadraticCurveTo((x0 + tx) / 2 - 30, (y0 + ty) / 2, x0, y0); }, COL.leaf, 5); };
  [-2.4, -1.9, -1.57, -1.2, -0.75].forEach((a) => lf(170, 645, a));
  shadow(c, 900, 800, 90, 14); line(c, [[900, 790], [900, 450]], 14, INK); line(c, [[900, 790], [900, 450]], 6, COL.steelDk);
  shape(c, () => polyP(c, [[830, 450], [970, 450], [940, 360], [860, 360]]), COL.yellow, 6);
  c.globalAlpha = 0.28; shape(c, () => ell(c, 900, 520, 150, 100), COL.yellow, 0); c.globalAlpha = 1;
  shape(c, () => ell(c, 900, 800, 60, 14), COL.steel, 6);
  // child sitting cross-legged on a cushion, eyes shut
  const x = 540, y = 470, r = 105;
  shape(c, () => ell(c, x, y + r * 3.6, r * 2.3, r * 0.55), COL.teal, 6);
  shape(c, () => rrect(c, x - r * 1.0, y + r * 1.0, r * 2.0, r * 2.5, r * 0.5), CLOTH.child, 6);
  shape(c, () => ell(c, x, y + r * 3.2, r * 1.9, r * 0.55), PANTS, 6);
  shape(c, () => ell(c, x - r * 1.15, y + r * 2.9, r * 0.28, r * 0.28), SKIN.child, 5); shape(c, () => ell(c, x + r * 1.15, y + r * 2.9, r * 0.28, r * 0.28), SKIN.child, 5);
  head(c, x, y, r, "calm", {});
};
const flowC2 = (c: Ctx) => {
  ground(c);
  frame(c, 30, 160, 520, 800, "#cfe3f5", () => head(c, 290, 530, 175, "sad", { body: true }));
  bubble(c, 610, 280, 400, 270, 700, 640);
  heart(c, 810, 400, 55);
  c.beginPath(); c.arc(810, 420, 230, 0, Math.PI * 2); c.strokeStyle = RED; c.lineWidth = 22; c.stroke();
  line(c, [[650, 260], [970, 580]], 22, RED);
};

// terms
const termEmotion = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 820, 1120, 300, 4), "#e4c995", 6);
  shadow(c, 260, 850, 100, 16); shadow(c, 770, 850, 230, 24);
  person(c, 260, 790, 640, { armL: [3.7, 4.4], armR: [5.7, 5.0] });
  heart(c, 260, 440, 42); beat(c, 260, 440, 42);
  dogShape(c, 780, 690, 1.05);
  for (const k of [0, 1, 2]) line(c, [[555 - k * 14, 610 + k * 48], [500 - k * 14, 600 + k * 52]], 8, INK);
};
const termFeeling = (c: Ctx) => {
  ground(c, "#f3c9c0");
  c.fillStyle = "#c9544a"; for (let i = 0; i < 7; i++) c.fillRect(i * 160 - 20, 0, 80, 800);
  shape(c, () => rrect(c, -20, 800, 1120, 300, 4), "#c9965a", 6);
  shadow(c, 540, 905, 190, 24);
  person(c, 540, 890, 640, { armL: [1.2, 0.3], armR: [1.94, 2.84] });
  shape(c, () => polyP(c, [[455, 640], [625, 640], [690, 800], [390, 800]]), COL.pink, 6);
  line(c, [[455, 645], [625, 645]], 9, COL.yellow);
  for (const [x, y, s, col] of [[390, 520, 38, COL.orange], [680, 500, 40, COL.yellow], [700, 600, 34, COL.pink], [370, 610, 32, COL.purple]] as [number, number, number, string][]) butterfly(c, x, y, s, col);
};
const termExpression = (c: Ctx) => {
  ground(c);
  [["smile", COL.sky], ["frown", "#cfe3f5"], ["surprised", "#fbe3a4"]].forEach(([k, bg], i) => frame(c, 40 + i * 340, 270, 320, 560, bg, () => head(c, 200 + i * 340, 520, 100, k, { boy: true, body: true })));
};
const termEmpathy = (c: Ctx) => {
  ground(c);
  frame(c, 40, 330, 1000, 650, "#cfe3f5", () => {
    head(c, 300, 640, 135, "sad", {});
    head(c, 780, 650, 135, "sad", { boy: true, body: true, cloth: COL.green, clothDk: COL.greenDk });
    line(c, [[640, 830], [470, 840]], 80, INK); line(c, [[640, 830], [470, 840]], 70, COL.green);
    shape(c, () => ell(c, 440, 830, 48, 44), SKIN.child, 6);
  });
  shape(c, () => rrect(c, 340, 70, 400, 220, 40), WHITE, 6);
  shape(c, () => ell(c, 610, 220, 100, 28), COL.pink, 5);
  shape(c, () => polyP(c, [[400, 160], [520, 215], [400, 250]]), COL.wood, 5); shape(c, () => ell(c, 560, 195, 55, 38), COL.pink, 5);
};
const termWellbeing = (c: Ctx) => {
  ground(c);
  const T = (x: number, y: number, bg: string, fn: () => void) => frame(c, x, y, 340, 340, bg, fn);
  T(30, 30, "#a8bfe8", () => { moon(c, 190, 150, 60, "#a8bfe8"); star(c, 280, 90, 22); star(c, 110, 250, 16); shape(c, () => rrect(c, 70, 250, 250, 55, 14), WHITE, 5); shape(c, () => ell(c, 120, 245, 50, 28), COL.pink, 5); });
  T(710, 30, "#fbe3a4", () => { bowl(c, 880, 180, 110, COL.yellow); shape(c, () => ell(c, 850, 170, 30, 30), COL.red, 4); shape(c, () => ell(c, 910, 175, 26, 26), COL.green, 4); });
  T(30, 710, "#cfe8c4", () => { ball(c, 190, 880, 75); shape(c, () => ell(c, 190, 985, 90, 14), SH2, 0); });
  T(710, 710, "#f5c2b8", () => { emoji(c, 810, 880, 60, "happy"); emoji(c, 950, 880, 60, "smile"); heart(c, 880, 790, 24); });
  disc(c, 540, 540, 235, COL.sky, () => head(c, 540, 460, 100, "happy", { body: true }));
};
const SH2 = "rgba(43,35,64,0.16)";
const termKindness = (c: Ctx) => {
  ground(c, "#bcc9d8");
  c.strokeStyle = COL.blueDk; c.lineWidth = 6; c.lineCap = "round";
  for (const [x, y] of [[60, 120], [150, 300], [90, 520], [40, 760], [980, 140], [920, 340], [1010, 560], [950, 790], [200, 880], [860, 900]]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x - 18, y + 55); c.stroke(); c.beginPath(); c.moveTo(x + 50, y - 40); c.lineTo(x + 32, y + 15); c.stroke(); }
  head(c, 390, 640, 125, "happy", { body: true });
  head(c, 700, 650, 125, "smile", { boy: true, body: true, cloth: COL.green, clothDk: COL.greenDk });
  line(c, [[545, 330], [545, 760]], 14, INK); line(c, [[545, 330], [545, 760]], 6, COL.steelDk);
  shape(c, () => ell(c, 545, 770, 36, 36), SKIN.child, 5);
  umbrella(c, 545, 330, 400);
};
const termRespect = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 860, 1120, 300, 4), "#e4c995", 6);
  shadow(c, 300, 870, 120, 18); shadow(c, 790, 870, 90, 14);
  person(c, 300, 860, 560, { armL: [3.3, 3.14], armR: [-0.15, 0] });
  person(c, 800, 860, 360, { armL: [2.0, 1.7], armR: [5.2, 4.7] });
  bubble(c, 120, 40, 380, 190, 300, 285);
  heart(c, 250, 135, 38);
  c.beginPath(); c.arc(370, 105, 26, Math.PI * 1.15, Math.PI * 2.1); c.strokeStyle = RED; c.lineWidth = 9; c.stroke(); line(c, [[391, 122], [370, 145], [370, 160]], 9, RED);
  shape(c, () => ell(c, 370, 190, 7, 7), RED, 0);
};
const termFriendship = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 590, 1120, 600, 4), "#e4c995", 6);
  const P = (u: number, v: number): [number, number] => { const t = v; const left = 440 - t * 150, right = 640 + t * 150; return [left + (right - left) * u, 560 + t * 330]; };
  shadow(c, 560, 940, 330, 26);
  shape(c, () => polyP(c, [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]), "#c9965a", 6);
  const sq = 6;
  for (let i = 0; i < sq; i++) for (let j = 0; j < sq; j++) { const a = P(i / sq, j / sq), b = P((i + 1) / sq, j / sq), d = P((i + 1) / sq, (j + 1) / sq), e = P(i / sq, (j + 1) / sq); shape(c, () => polyP(c, [a, b, d, e]), (i + j) % 2 ? "#fbe3a4" : "#f5c2b8", 3); }
  // ladder
  for (const u of [0.2, 0.32]) line(c, [P(u, 0.88), P(u + 0.1, 0.3)], 7, INK);
  for (let k = 0; k < 5; k++) { const t = 0.8 - k * 0.12; line(c, [P(0.2 + (0.88 - t) * 0.14, t), P(0.32 + (0.88 - t) * 0.14, t)], 6, INK); }
  // snake
  const sn: number[][] = []; for (let k = 0; k <= 12; k++) { const t = k / 12; sn.push(P(0.8 + Math.sin(t * 6) * 0.07, 0.15 + t * 0.7)); }
  line(c, sn, 24, INK); line(c, sn, 14, COL.green);
  shape(c, () => ell(c, sn[0][0], sn[0][1] - 4, 20, 15), COL.green, 5);
  shape(c, () => ell(c, 610, 560 + 0, 0, 0), WHITE, 0);
  // dice
  shape(c, () => polyP(c, [[850, 860], [920, 860], [920, 925], [850, 925]]), WHITE, 5); for (const [dx, dy] of [[870, 880], [900, 880], [885, 893], [870, 906], [900, 906]]) shape(c, () => ell(c, dx, dy, 5, 5), INK, 0);
  person(c, 150, 930, 640, { sit: true });
  c.save(); c.translate(1080, 0); c.scale(-1, 1); person(c, 150, 930, 640, { sit: true }); c.restore();
};
const termAdrenaline = (c: Ctx) => {
  ground(c);
  bodyOutline(c, 540, 70, 940);
  shape(c, () => ell(c, 540, 183, 12, 12), NONE, 0);
  shape(c, () => ell(c, 508, 175, 7, 9), INK, 0); shape(c, () => ell(c, 572, 175, 7, 9), INK, 0); line(c, [[512, 222], [540, 236], [568, 222]], 6);
  heart(c, 520, 340, 50); beat(c, 520, 340, 30);
  for (const s of [-1, 1]) {
    const kx = 540 + s * 62, ky = 465;
    shape(c, () => { c.moveTo(kx, ky - 50); c.bezierCurveTo(kx + s * 50, ky - 40, kx + s * 40, ky + 60, kx, ky + 55); c.bezierCurveTo(kx - s * 25, ky + 40, kx - s * 25, ky - 40, kx, ky - 50); c.closePath(); }, "#a9473a", 5);
    shape(c, () => { c.moveTo(kx - s * 28, ky - 52); c.lineTo(kx + s * 14, ky - 52); c.lineTo(kx - s * 6, ky - 88); c.closePath(); }, COL.yellow, 5);
    arrow(c, [[kx + s * 4 - s * 20, ky - 95], [s < 0 ? 470 : 600, 400]], RED, 8);
  }
};
const termDuchenne = (c: Ctx) => {
  ground(c);
  frame(c, 40, 230, 470, 640, COL.sky, () => head(c, 275, 520, 150, "polite", { body: true }));
  frame(c, 570, 230, 470, 640, "#fbe3a4", () => head(c, 805, 520, 150, "real", { body: true }));
  arrow(c, [[960, 330], [900, 460]], RED, 10); arrow(c, [[650, 330], [710, 460]], RED, 10);
};
const termContagious = (c: Ctx) => {
  ground(c, "#e9d7f2");
  const xs = [220, 540, 860];
  xs.forEach((x, i) => head(c, x, 430, 100, ["yawn", "yawn", "yawnStart"][i], { boy: i === 1, body: true, cloth: [CLOTH.child, COL.green, COL.purple][i], clothDk: [CLOTH.childDk, COL.greenDk, "#6b4fa8"][i] }));
  shape(c, () => rrect(c, 40, 640, 1000, 190, 60), COL.red, 7); shade(c, () => rrect(c, 40, 640, 1000, 190, 60), "#b83c28", 0, 22, 0.5);
  shape(c, () => rrect(c, 20, 560, 120, 330, 50), "#d2452f", 7); shape(c, () => rrect(c, 940, 560, 120, 330, 50), "#d2452f", 7);
  shadow(c, 540, 905, 480, 22);
  arrow(c, [[320, 260], [430, 230]], RED, 11); arrow(c, [[650, 230], [760, 260]], RED, 11);
};
const termRasa = (c: Ctx) => {
  ground(c, "#efe4cf");
  const x = 540, y = 650, r = 215;
  // crown
  shape(c, () => polyP(c, [[x - 150, y - r * 0.7], [x - 190, y - 450], [x - 90, y - 360], [x, y - 520], [x + 90, y - 360], [x + 190, y - 450], [x + 150, y - r * 0.7]]), COL.orange, 6);
  shape(c, () => polyP(c, [[x - 110, y - r * 0.75], [x - 100, y - 360], [x, y - 480], [x + 100, y - 360], [x + 110, y - r * 0.75]]), COL.yellow, 5);
  for (const dx of [-60, 0, 60]) shape(c, () => ell(c, x + dx, y - 330 - (dx ? 0 : 40), 20, 20), RED, 4);
  // white frill round the face
  shape(c, () => ell(c, x, y + 20, r * 1.3, r * 1.1), WHITE, 7); shape(c, () => ell(c, x, y + 20, r * 1.12, r * 0.95), "#f6d9d4", 5);
  shape(c, () => ell(c, x, y, r, r * 1.05), "#5aa04a", 7); shade(c, () => ell(c, x, y, r, r * 1.05), "#3b7a33", 28, 18, 0.55); shape(c, () => ell(c, x, y, r, r * 1.05), NONE, 7);
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * 85, y - 20, 62, 40, s * -0.15), WHITE, 6); c.save(); c.beginPath(); ell(c, x + s * 85, y - 20, 62, 40, s * -0.15); c.lineWidth = 12; c.strokeStyle = RED; c.stroke(); c.restore();
    shape(c, () => ell(c, x + s * 85, y - 20, 24, 28), INK, 0); shape(c, () => ell(c, x + s * 78, y - 28, 7, 7), WHITE, 0);
    line(c, [[x + s * 20, y - 75], [x + s * 95, y - 105], [x + s * 160, y - 70]], 13);
  }
  shape(c, () => ell(c, x, y - 105, 14, 14), RED, 3);
  line(c, [[x, y - 40], [x - 14, y + 40], [x + 16, y + 44]], 6, "#3b7a33");
  shape(c, () => { c.moveTo(x - 90, y + 105); c.quadraticCurveTo(x, y + 150, x + 90, y + 105); c.quadraticCurveTo(x + 40, y + 195, x, y + 195); c.quadraticCurveTo(x - 40, y + 195, x - 90, y + 105); c.closePath(); }, RED, 7);
};

// explanations
const explFeeling = (c: Ctx) => {
  ground(c);
  disc(c, 540, 540, 200, COL.sky, () => head(c, 540, 500, 110, "happy", { body: true }));
  const sat = (x: number, y: number, bg: string, fn: () => void) => { shape(c, () => ell(c, x, y, 130, 130), bg, 7); fn(); };
  sat(540, 160, "#f7d9d9", () => { shape(c, () => ell(c, 500, 160, 60, 48), COL.pink, 5); shape(c, () => ell(c, 580, 160, 60, 48), COL.pink, 5); line(c, [[540, 120], [540, 200]], 4); line(c, [[470, 155], [510, 145], [495, 180]], 4); line(c, [[600, 150], [570, 165], [590, 190]], 4); });
  sat(920, 540, "#fbe3a4", () => { heart(c, 920, 540, 55); });
  sat(540, 920, "#cfe8c4", () => { swirl(c, 540, 920, 50); butterfly(c, 595, 895, 30); });
  sat(160, 540, "#e0d2f2", () => { emoji(c, 160, 540, 85, "surprised"); });
  arrow(c, [[540, 295], [540, 345]], RED, 9); arrow(c, [[785, 540], [745, 540]], RED, 9); arrow(c, [[540, 785], [540, 745]], RED, 9); arrow(c, [[295, 540], [335, 540]], RED, 9);
};
const explBody = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, -20, 860, 1120, 300, 4), "#e4c995", 6);
  shadow(c, 270, 880, 130, 18); shadow(c, 810, 880, 130, 18);
  person(c, 270, 870, 640);
  heart(c, 270, 470, 28);
  person(c, 810, 870, 640, { armL: [3.7, 4.4], armR: [5.7, 5.0] });
  heart(c, 810, 470, 50); beat(c, 810, 470, 50);
  sweatDrop(c, 925, 250, 30); sweatDrop(c, 680, 260, 24);
  arrow(c, [[420, 440], [600, 440]], RED, 12);
  for (let k = 0; k < 3; k++) { line(c, [[560 + k * 8, 190 + k * 18], [610, 180 + k * 20]], 6, COL.blueDk); }
};
const explFace = (c: Ctx) => {
  ground(c);
  const x = 540, y = 540, r = 340;
  head(c, x, y, r, "happy", {});
  c.globalAlpha = 0.55;
  shape(c, () => rrect(c, x - r * 0.6, y - r * 0.56, r * 1.2, r * 0.13, r * 0.06), "#e0675a", 5);
  for (const s of [-1, 1]) {
    shape(c, () => ell(c, x + s * r * 0.38, y - r * 0.02, r * 0.28, r * 0.2), "#e0675a", 5);
    shape(c, () => { c.moveTo(x + s * r * 0.65, y + r * 0.1); c.quadraticCurveTo(x + s * r * 0.62, y + r * 0.45, x + s * r * 0.4, y + r * 0.62); c.lineTo(x + s * r * 0.3, y + r * 0.5); c.quadraticCurveTo(x + s * r * 0.45, y + r * 0.3, x + s * r * 0.5, y + r * 0.1); c.closePath(); }, "#e0675a", 5);
  }
  c.globalAlpha = 1;
  for (const s of [-1, 1]) arrow(c, [[x + s * r * 0.5, y + r * 0.62], [x + s * r * 0.82, y + r * 0.3]], RED, 12);
};

export const ic_healthFeelingsAndWellbeingL3 = cards("sci.health.feelings-and-wellbeing.L3 cards", [
  intro, summary, flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowA5, flowA6, flowG1, flowP1, flowC1, flowC2,
  termEmotion, termFeeling, termExpression, termEmpathy, termWellbeing, termKindness, termRespect, termFriendship, termAdrenaline, termDuchenne, termContagious, termRasa,
  explFeeling, explBody, explFace,
]);
