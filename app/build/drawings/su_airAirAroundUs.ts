import type { Ctx } from "./core";
import { INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, line, shine, arrow, hand, plate, seed, write, cards } from "./flatKit";

// sci.air.air-around-us.L3 · set-up cards. Experiment 1 uses one clear glass (tumbler) with a yellow
// tape line, the same shape on every card; experiment 2 uses one plastic syringe with a blue plunger.

// ---------------------------------------------------------------- the glass, with seeds and water
type Grain = "chana" | "moong" | "mustard";
type Jar = { grain?: Grain; grainTo?: number; water?: number; tape?: number; bubbles?: boolean };
const TAPE = 0.78;
const hw = (w: number, f: number) => w * 0.4 + (w * 0.5 - w * 0.4) * f; // half width of the glass at fraction f of its height

// a chickpea: tan, lumpy oval, shade side, a pale highlight and a small crease
const chana = (c: Ctx, x: number, y: number, r: number, rot: number) => {
  const b = () => ell(c, x, y, r, r * 0.86, rot);
  shape(c, b, "#d29a52", Math.max(2.5, r * 0.16));
  c.save(); c.beginPath(); b(); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.3, r, r * 0.86, rot); c.fillStyle = "#9a6528"; c.globalAlpha = 0.55; c.fill(); c.restore(); c.globalAlpha = 1;
  shape(c, () => ell(c, x - r * 0.35, y - r * 0.3, r * 0.28, r * 0.16, rot), "#f0cf8f", 0);
  line(c, [[x + Math.cos(rot) * r * 0.2, y + Math.sin(rot) * r * 0.2 + r * 0.1], [x + Math.cos(rot + 0.8) * r * 0.6, y + Math.sin(rot + 0.8) * r * 0.6 + r * 0.1]], Math.max(2, r * 0.1), "#8a5a25");
};
const mustard = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r), "#5a3a26", Math.max(1.5, r * 0.25)); shape(c, () => ell(c, x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.3), "#b98a5a", 0); };
const grainR = (w: number, g: Grain) => (g === "chana" ? w * 0.072 : g === "moong" ? w * 0.042 : w * 0.0185);
const oneGrain = (c: Ctx, g: Grain, x: number, y: number, r: number, rot: number) => (g === "chana" ? chana(c, x, y, r, rot) : g === "moong" ? seed(c, x, y, r, rot) : mustard(c, x, y, r));

// rows of grains from the surface (fraction `to` of the height) down to the bottom, inside the glass
const grainsIn = (c: Ctx, x: number, y: number, w: number, h: number, g: Grain, to: number) => {
  const r = grainR(w, g), rg = rnd(g === "chana" ? 5 : g === "moong" ? 8 : 3), step = r * (g === "mustard" ? 1.75 : 1.6);
  let row = 0;
  for (let ry = y - h * to + r * 0.4; ry < y - r * 0.5; ry += step * 0.86, row++) {
    const avail = hw(w, (y - ry) / h) - r * 1.1, n = Math.max(2, Math.floor((avail * 2) / step) + 1), gap = (avail * 2) / (n - 1), off = row % 2 ? gap / 2 : 0;
    for (let i = 0; i < n; i++) { const gx = x - avail + i * gap + off; if (gx > x + avail) continue; oneGrain(c, g, gx + (rg() - 0.5) * r * 0.3, ry + (rg() - 0.5) * r * 0.3, r, rg() * 3.1); }
  }
};

const jar = (c: Ctx, x: number, y: number, w: number, h: number, o: Jar = {}) => {
  shadow(c, x + w * 0.12, y + 6, w * 0.6, w * 0.12);
  const top = w / 2, bot = w * 0.4, body = () => { c.moveTo(x - top, y - h); c.lineTo(x + top, y - h); c.lineTo(x + bot, y); c.lineTo(x - bot, y); c.closePath(); };
  const tl = o.grainTo ?? TAPE, wet = o.water && o.grain && o.water >= tl - 0.02;
  shape(c, body, "rgba(224,240,250,0.7)", 0);
  c.save(); c.beginPath(); body(); c.clip();
  if (o.water) { c.fillStyle = COL.water; c.fillRect(x - top - 5, y - h * o.water, w + 10, h * o.water + 10); }
  if (o.grain) grainsIn(c, x, y, w, h, o.grain, tl);
  if (wet) { c.fillStyle = "rgba(143,195,234,0.3)"; c.fillRect(x - top - 5, y - h * o.water!, w + 10, h * o.water! + 10); }
  if (o.bubbles && o.water) {
    const rb = rnd(21);
    for (let i = 0; i < 9; i++) { const bx = x - w * 0.3 + rb() * w * 0.6, by = y - h * o.water + h * 0.02 + rb() * h * 0.2, br = 7 + rb() * 6; shape(c, () => ell(c, bx, by, br, br), "rgba(255,255,255,0.95)", 3); }
  }
  c.fillStyle = "rgba(63,111,179,0.16)"; c.fillRect(x + top * 0.62, y - h - 5, w, h + 10);
  c.restore();
  if (o.water && (!o.grain || wet)) shape(c, () => ell(c, x, y - h * o.water, hw(w, o.water), w * 0.07), o.grain ? "rgba(233,243,255,0.55)" : COL.drop, 0);
  line(c, [[x - top, y - h], [x - bot, y], [x + bot, y], [x + top, y - h]], 5);
  shape(c, () => ell(c, x, y - h, top, w * 0.08), "rgba(255,255,255,0.3)", 5);
  shine(c, [[x - top * 0.65, y - h * 0.85], [x - bot * 0.7, y - h * 0.2]], 7);
  if (o.tape !== undefined) { const ty = y - h * o.tape, a = hw(w, o.tape + 0.03) + 3, b = hw(w, o.tape - 0.03) + 3; shape(c, () => polyP(c, [[x - a, ty - h * 0.03], [x + a, ty - h * 0.03], [x + b, ty + h * 0.03], [x - b, ty + h * 0.03]]), COL.yellow, 4); }
};

// a forearm in a sleeve running off the card, ending in the hand
const arm = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -78 - 900, -33, 900 + 56, 66, 10), CLOTH.child, 6);
  c.restore();
  hand(c, x, y, an, s, SKIN.child, CLOTH.child, open);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  jar(c, 270, 880, 400, 560, { grain: "chana", tape: TAPE });
  jar(c, 810, 880, 400, 560, { water: TAPE, tape: TAPE });
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  plate(c, 340, 945, 330, 72);
  jar(c, 340, 935, 330, 460, { grain: "chana", water: 0.46, tape: TAPE, bubbles: true });
  // the glass of water, tipped over the chana
  const P = [868, 175], a = (-105 * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a), w = 330, h = 460, top = w / 2, bot = w * 0.4;
  const R = (lx: number, ly: number): number[] => [P[0] + lx * ca - ly * sa, P[1] + lx * sa + ly * ca];
  const body = () => polyP(c, [R(-top, -h), R(top, -h), R(bot, 0), R(-bot, 0)]);
  const lip = R(-top, -h);
  shape(c, body, "rgba(224,240,250,0.7)", 0);
  c.save(); c.beginPath(); body(); c.clip(); c.fillStyle = COL.water; c.fillRect(0, lip[1] - 150, 1080, 1080); c.restore();
  const sx = lip[0] - 4, stream = [[sx + 10, lip[1] - 10], [sx - 4, lip[1] + 40], [sx - 10, 575]];
  line(c, stream, 38, INK); line(c, stream, 26, COL.water);
  shape(c, () => ell(c, sx - 10, 578, 30, 9), COL.drop, 4);
  line(c, [R(-top, -h), R(-bot, 0), R(bot, 0), R(top, -h)], 5);
  const m = R(0, -h); shape(c, () => ell(c, m[0], m[1], top, w * 0.08, a), "rgba(255,255,255,0.3)", 5);
  const tp = (lx: number, f: number) => R(lx * (hw(w, f) + 3), -h * f);
  shape(c, () => polyP(c, [tp(-1, TAPE + 0.03), tp(1, TAPE + 0.03), tp(1, TAPE - 0.03), tp(-1, TAPE - 0.03)]), COL.yellow, 4);
  // hand from above gripping the glass
  const mid = R(0, -h * 0.5), s = 1.9, an = 1.31;
  arm(c, mid[0] - Math.cos(an) * 70 * s, mid[1] - Math.sin(an) * 70 * s, an, s);
  arrow(c, [[660, 480], [660, 600]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  const gx = 400, gy = 890, gw = 400, gh = 560, tf = 0.8, wf = 0.4, ty = gy - gh * tf, wy = gy - gh * wf, cm = (gh * (tf - wf)) / 4;
  jar(c, gx, gy, gw, gh, { water: wf, tape: tf });
  arrow(c, [[gx - 80, ty + 36], [gx - 80, wy - 30]]);
  // the ruler, 0 at the tape line, held beside the glass
  const rx = gx + 215, rw = 110, rb = ty + cm * 8;
  shape(c, () => polyP(c, [[rx, ty], [rx + rw, ty], [rx + rw, rb], [rx, rb]]), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(rx + rw - 24, ty + 3, 21, rb - ty - 6);
  for (let mm = 0; mm <= 80; mm++) { const yy = ty + mm * (cm / 10), l = mm % 10 === 0 ? 44 : mm % 5 === 0 ? 30 : 17; line(c, [[rx + 3, yy], [rx + 3 + l, yy]], mm % 10 === 0 ? 4 : 2.5); }
  for (let k = 0; k <= 5; k++) write(c, String(k), rx + 54, ty + k * cm + 8, 30, INK, 5);
  line(c, [[gx + hw(gw, tf) + 4, ty], [rx + rw, ty]], 8, COL.yellow);
  line(c, [[gx + hw(gw, wf) + 4, wy], [rx + rw + 10, wy]], 8, RED);
  arm(c, rx + rw / 2 + 70 * 1.35, ty + cm * 6.9, Math.PI, 1.35);
};

// setup.e1.3
const e1_3 = (c: Ctx) => {
  ground(c);
  const gs: Grain[] = ["chana", "moong", "mustard"];
  gs.forEach((g, i) => jar(c, 195 + i * 340, 780, 280, 400, { grain: g, water: TAPE, tape: TAPE }));
};

// ---------------------------------------------------------------- the syringe
const RL = 260, NZ = 220, B0 = 360, B1 = 680, PX = 30, SCY = 540, BH = 80;
const syringe = (c: Ctx, ml: number, water = false) => {
  const cy = SCY, sx = B0 + ml * PX, outline = () => polyP(c, [[NZ, cy - 16], [320, cy - 16], [B0, cy - BH], [B1, cy - BH], [B1, cy + BH], [B0, cy + BH], [320, cy + 16], [NZ, cy + 16]]);
  shadow(c, 620, cy + BH + 30, 440, 22);
  shape(c, outline, "rgba(224,240,250,0.7)", 0);
  if (water) { c.save(); c.beginPath(); outline(); c.clip(); c.fillStyle = COL.water; c.fillRect(NZ - 5, cy - BH - 5, sx - NZ + 5, BH * 2 + 10); c.restore(); }
  // plunger: rod, rubber stopper, thumb disc
  shape(c, () => rrect(c, sx, cy - 16, RL, 32, 4), COL.blue, 5);
  c.fillStyle = COL.blueDk; c.fillRect(sx + 4, cy + 4, RL - 8, 9);
  shape(c, () => rrect(c, sx - 30, cy - BH + 5, 30, BH * 2 - 10, 6), COL.black, 5);
  shape(c, () => rrect(c, sx + RL, cy - 86, 24, 172, 10), COL.blue, 5);
  c.fillStyle = COL.blueDk; c.fillRect(sx + RL + 12, cy - 80, 8, 160);
  line(c, [[NZ, cy - 16], [320, cy - 16], [B0, cy - BH], [B1, cy - BH], [B1, cy + BH], [B0, cy + BH], [320, cy + 16], [NZ, cy + 16], [NZ, cy - 16]], 6);
  shine(c, [[B0 + 20, cy - BH + 18], [sx - 50 > B0 + 60 ? sx - 50 : B0 + 60, cy - BH + 18]], 7);
  shape(c, () => rrect(c, B1 - 4, cy - 112, 22, 224, 8), COL.steelIn, 5);
  // scale along the lower edge, 0 to 10 ml
  for (let k = 0; k <= 10; k++) { const xx = B0 + k * PX, l = k % 5 === 0 ? 36 : 20; line(c, [[xx, cy + BH - 3], [xx, cy + BH - l]], k % 5 === 0 ? 5 : 3, k * PX + B0 > sx - 30 && k * PX + B0 <= sx ? WHITE : INK); }
  write(c, "0", B0 - 11, cy + BH + 26, 44, INK, 7); write(c, "5", B0 + 5 * PX - 12, cy + BH + 26, 44, INK, 7); write(c, "10", B0 + 10 * PX - 42, cy + BH + 26, 44, INK, 7);
  return sx;
};
// the syringe cards are drawn a little larger, so the syringe fills the card
const tilted = (c: Ctx, k: number, mid: number, draw: () => void) => { c.save(); c.translate(540, 560); c.scale(k, k); c.translate(-mid, -SCY); draw(); c.restore(); };

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  tilted(c, 1.2, 594, () => {
    const sx = syringe(c, 10);
    arrow(c, [[sx + 60, 390], [sx + 240, 390]]);
    arm(c, sx + 190, SCY + 70 * 1.4, -Math.PI / 2, 1.4);
  });
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  tilted(c, 1.05, 523, () => {
    const sx = syringe(c, 5), disc = sx + RL + 24;
    arm(c, 268 - 90 * 1.15, SCY - 4, 0, 1.15, true);
    arm(c, disc + 78 * 1.15, SCY, Math.PI, 1.15);
    arrow(c, [[disc + 90, 395], [disc - 120, 395]]);
    line(c, [[sx, SCY + BH - 2], [sx, SCY + BH + 18]], 7, RED);
  });
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  tilted(c, 0.93, 590, () => {
    const sx = syringe(c, 9.5, true), disc = sx + RL + 24;
    arm(c, 268 - 90 * 1.15, SCY - 4, 0, 1.15, true);
    arm(c, disc + 78 * 1.15, SCY, Math.PI, 1.15);
    arrow(c, [[disc + 90, 395], [disc - 120, 395]]);
    line(c, [[sx, SCY + BH - 2], [sx, SCY + BH + 18]], 7, RED);
  });
};

export const su_airAirAroundUs = cards("sci.air.air-around-us.L3 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1, e2_2]);
