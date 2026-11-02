import type { Ctx } from "./core";
import { BG, CLOTH, COL, D, INK, RED, SH, SKIN, arrow, cards, ell, glass, ground, hand, line, rnd, rrect, shade, shadow, shape } from "./flatKit";

// sci.plants.plant-parts.L3 · flow.e4 "Roots Hold the Soil": two tilted trays on books, a mug of water
// poured over the top end of each. Bare soil: muddy water, a thick mud layer in the glass. Soil full
// of roots (shoots snipped): clear water, almost no mud.

const MUD = "#9c6b45", MUDDK = COL.soilDk;

// a thick stream of water (or mud) with an ink edge
const stream = (c: Ctx, pts: number[][], col: string, w = 14) => { line(c, pts, w + 8, INK); line(c, pts, w, col); };

// one tray scene: base = the table line it stands on; roots = true for the tray full of roots
const row = (c: Ctx, base: number, roots: boolean) => {
  const liquid = roots ? COL.water : MUD, mudH = roots ? 7 : 34;
  const x0 = 200, yTopL = base - 260, yTopR = base - 118, L = Math.hypot(540, yTopR - yTopL), a = Math.atan2(yTopR - yTopL, 540);
  // books under both ends
  const book = (x: number, y: number, w: number, h: number, col: string) => { shape(c, () => rrect(c, x, y, w, h, 6), col); shade(c, () => rrect(c, x, y, w, h, 6), "#000000", 0, h * 0.55, 0.18); c.fillStyle = COL.paper; c.fillRect(x + 10, y + 8, w - 20, 7); };
  shadow(c, 290, base + 4, 170, 14); shadow(c, 700, base + 4, 100, 12);
  book(140, base - 64, 210, 64, COL.blue); book(155, base - 128, 190, 64, COL.red); book(145, base - 192, 200, 64, COL.yellow);
  book(615, base - 50, 160, 50, COL.purple);
  // the tray, drawn in a tilted frame: local x along the tray, y down from the rim
  c.save(); c.translate(x0, yTopL); c.rotate(a);
  shape(c, () => rrect(c, 6, 10, L - 12, 56, 4), COL.soil, 0);
  shade(c, () => rrect(c, 6, 10, L - 12, 56, 4), COL.soilDk, 0, 28, 0.5);
  const r = rnd(roots ? 5 : 9);
  for (let i = 0; i < 28; i++) { const px = 20 + r() * (L - 40), py = 20 + r() * 40; shape(c, () => ell(c, px, py, 4 + r() * 3, 3), COL.soilDk, 0); }
  if (roots) {
    // white roots threading the soil, green stubs where the shoots were snipped
    for (let i = 0; i < 26; i++) { const px = 22 + i * ((L - 44) / 25), s = i % 2 ? 1 : -1; line(c, [[px, 14], [px + s * 6, 30], [px - s * 4, 46], [px + s * 5, 62]], 6, INK); line(c, [[px, 14], [px + s * 6, 30], [px - s * 4, 46], [px + s * 5, 62]], 3, COL.paper); }
    for (let i = 0; i < 26; i++) { const px = 22 + i * ((L - 44) / 25); shape(c, () => rrect(c, px - 4, 2, 8, 12, 2), COL.green, 3); }
  }
  // the sheet of water running down the soil to the notch
  shape(c, () => rrect(c, 60, 6, L - 60, 14, 4), liquid, 3);
  shape(c, () => rrect(c, 0, 0, L, 70, 6), "rgba(0,0,0,0)", 7); // clear tray: outline only
  c.fillStyle = BG; c.fillRect(L - 10, -4, 20, 22); // the notch in the rim
  shape(c, () => rrect(c, L - 8, 6, 12, 10, 2), liquid, 0);
  c.restore();
  // water from the notch into the glass
  const nx = x0 + Math.cos(a) * L, ny = yTopL + Math.sin(a) * L;
  stream(c, [[nx - 2, ny + 10], [nx + 30, ny + 22], [nx + 70, ny + 55], [nx + 90, ny + 118 - 100]], liquid, 18);
  glass(c, 835, base, 130, 100, 0.55, liquid);
  const bw = 130 * 0.4, bt = bw + (65 - bw) * (mudH / 100);
  shape(c, () => { c.moveTo(835 - bt, base - mudH); c.lineTo(835 + bt, base - mudH); c.lineTo(835 + bw, base - 3); c.lineTo(835 - bw, base - 3); c.closePath(); }, MUDDK, 0);
  // the mug, tipped, and a child's hand on its handle; water pours onto the high end of the soil
  const mx = 215, my = base - 380;
  c.save(); c.translate(mx, my); c.rotate(0.75);
  shape(c, () => { c.moveTo(-48, -10); c.bezierCurveTo(-95, -10, -95, 46, -48, 46); }, COL.teal, 7);
  shape(c, () => rrect(c, -48, -58, 96, 116, 10), COL.teal);
  shade(c, () => rrect(c, -48, -58, 96, 116, 10), COL.tealDk, 30, 0);
  shape(c, () => ell(c, 0, -58, 48, 12), COL.water, 5);
  c.restore();
  hand(c, 118, base - 335, 0.05, 0.9, SKIN.child, CLOTH.child);
  // pour point: the lip of the tipped mug, right side
  const lipX = mx + Math.cos(0.75) * 48 - Math.sin(0.75) * -58, lipY = my + Math.sin(0.75) * 48 + Math.cos(0.75) * -58;
  stream(c, [[lipX, lipY], [lipX + 14, lipY + 40], [lipX + 20, yTopL + 12]], COL.water, 14);
  arrow(c, [[lipX + 95, lipY - 10], [lipX + 95, yTopL - 30]], RED, 10);
  void SH;
};

const e4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e4d6bb"; c.fillRect(0, 505, D, 8); c.fillRect(0, 1040, D, 8);
  row(c, 505, false);
  row(c, 1040, true);
};

export const ic_plantsPlantPartsL3Fill = cards("sci.plants.plant-parts.L3 fill", [e4]);
