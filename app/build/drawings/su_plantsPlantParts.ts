import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, glass, bowl, plate, hand, write, rnd, cards } from "./flatKit";

// sci.plants.plant-parts.L3 · set-up cards. Same carrot, radish, onion, potato, slices, trays, books and glasses within an experiment.

const TABLE = "#e8d8b6";
const CARROT = "#f08a2e", CARROT_DK = "#c9681a", RADISH = "#d9455f", RADISH_DK = "#a82c46", ONION = "#d9a35b", ONION_DK = "#b07c36";
const dropP = (c: Ctx, x: number, y: number, s: number) => { c.moveTo(x, y - s * 1.4); c.quadraticCurveTo(x + s * 0.2, y - s * 0.5, x + s, y + s * 0.2); c.arc(x, y + s * 0.2, s, 0, Math.PI); c.quadraticCurveTo(x - s * 0.2, y - s * 0.5, x, y - s * 1.4); c.closePath(); };
// a child's (or grown-up's) hand coming in from the right, fingers pointing left; wrist at (x, y)
const handL = (c: Ctx, x: number, y: number, s: number, skin: string = SKIN.child, sleeve: string = CLOTH.child) => { c.save(); c.translate(x, 0); c.scale(-1, 1); hand(c, 0, y, 0, s, skin, sleeve); c.restore(); };
const label = (c: Ctx, x: number, y: number, n: string) => { shape(c, () => rrect(c, x - 42, y - 24, 84, 48, 8), WHITE, 5); write(c, n, x - 12, y - 16, 32, INK, 5); };
const sunRays = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18)], [x + Math.cos(a) * (r + 52), y + Math.sin(a) * (r + 52)]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
// feathery carrot / radish leaves fanning up from (x, y)
const fronds = (c: Ctx, x: number, y: number, len: number, angles: number[], col: string = COL.leaf) => angles.forEach((a) => {
  const an = -Math.PI / 2 + a; line(c, [[x, y], [x + Math.cos(an) * len * 0.6, y + Math.sin(an) * len * 0.6]], 7, INK); line(c, [[x, y], [x + Math.cos(an) * len * 0.6, y + Math.sin(an) * len * 0.6]], 3, COL.leafDk);
  [0.3, 0.5, 0.7].forEach((t) => [-0.9, 0.9].forEach((s) => leafAt(c, x + Math.cos(an) * len * t, y + Math.sin(an) * len * t, len * 0.28, an + s, col)));
  leafAt(c, x + Math.cos(an) * len * 0.6, y + Math.sin(an) * len * 0.6, len * 0.34, an, col);
});
const leafAt = (c: Ctx, x: number, y: number, len: number, an: number, col: string) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * 0.3, ny = Math.cos(an) * len * 0.3, mx = (x + tx) / 2, my = (y + ty) / 2;
  shape(c, () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, col, 4);
};
// a big leaf with veins, pointing at angle an from its base (x, y)
const bigLeaf = (c: Ctx, x: number, y: number, len: number, an: number, col: string, vein: string, wf = 0.46, veins = true) => {
  const tx = x + Math.cos(an) * len, ty = y + Math.sin(an) * len, nx = -Math.sin(an) * len * wf, ny = Math.cos(an) * len * wf, mx = (x + tx) / 2, my = (y + ty) / 2;
  const p = () => { c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); };
  shape(c, p, col, 7);
  if (veins) {
    line(c, [[x, y], [tx, ty]], 6, vein);
    [0.2, 0.35, 0.5, 0.65, 0.8].forEach((t) => { const w = len * wf * 0.5 * 4 * t * (1 - t) * 0.85, px = x + (tx - x) * t, py = y + (ty - y) * t, ax = Math.cos(an), ay = Math.sin(an); [-1, 1].forEach((s) => line(c, [[px, py], [px - ay * w * s + ax * 50, py + ax * w * s + ay * 50]], 4, vein)); });
  }
};

// ---------------------------------------------------------------- experiment 1: wake the store
const stub = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  const p = () => { c.moveTo(x - w / 2, y); c.lineTo(x - w * 0.42, y - h); c.lineTo(x + w * 0.42, y - h); c.lineTo(x + w / 2, y); c.closePath(); };
  shape(c, p, col, 5); shade(c, p, dk, w * 0.18, 0, 0.5);
};
const carrotTop = (c: Ctx, x: number, y: number, s: number, tall = false) => {
  fronds(c, x, y - 40 * s, (tall ? 190 : 100) * s, tall ? [-0.55, -0.15, 0.3] : [-0.5, -0.1, 0.35]);
  stub(c, x, y, 78 * s, 44 * s, CARROT, CARROT_DK);
};
const radishTop = (c: Ctx, x: number, y: number, s: number) => {
  fronds(c, x, y - 40 * s, 95 * s, [-0.55, -0.1, 0.4], COL.greenLt);
  const p = () => { c.moveTo(x - 42 * s, y); c.bezierCurveTo(x - 50 * s, y - 62 * s, x + 50 * s, y - 62 * s, x + 42 * s, y); c.closePath(); };
  shape(c, p, RADISH, 5); shade(c, p, RADISH_DK, 18 * s, 0, 0.5);
  shape(c, () => ell(c, x, y, 42 * s, 9 * s), "#fbeee8", 4);
};
const carrotSlice = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y + 12, r, r * 0.55), CARROT_DK, 5);
  shape(c, () => ell(c, x, y, r, r * 0.55), CARROT, 5);
  shape(c, () => ell(c, x, y, r * 0.5, r * 0.28), "#f7b56b", 3);
};
const onionBase = (c: Ctx, x: number, y: number, s: number) => {
  for (let i = -3; i <= 3; i++) line(c, [[x + i * 9 * s, y], [x + i * 13 * s + (i % 2) * 4, y + 34 * s]], 4, INK);
  for (let i = -3; i <= 3; i++) line(c, [[x + i * 9 * s, y], [x + i * 13 * s + (i % 2) * 4, y + 34 * s]], 2, WHITE);
  const p = () => { c.moveTo(x - 62 * s, y); c.bezierCurveTo(x - 62 * s, y - 70 * s, x + 62 * s, y - 70 * s, x + 62 * s, y); c.closePath(); };
  shape(c, p, ONION, 5); shade(c, p, ONION_DK, 20 * s, 0, 0.5);
  line(c, [[x - 20 * s, y - 6 * s], [x - 14 * s, y - 52 * s]], 3, ONION_DK); line(c, [[x + 18 * s, y - 6 * s], [x + 14 * s, y - 52 * s]], 3, ONION_DK);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 560, 880, 450, 40);
  shape(c, () => rrect(c, 90, 430, 900, 440, 34), COL.wood, 6);
  shade(c, () => rrect(c, 90, 430, 900, 440, 34), COL.woodDk, 14, 14, 0.5);
  shape(c, () => ell(c, 940, 470, 20, 20), TABLE, 4);
  // the carrot, crown to the right, tip to the left, and the leafy top lying beyond the blade
  c.save(); c.translate(0, 600);
  const body = () => { c.moveTo(696, -52); c.quadraticCurveTo(450, -44, 220, 0); c.quadraticCurveTo(450, 44, 696, 52); c.closePath(); };
  shadow(c, 470, 52, 270, 18);
  shape(c, body, CARROT, 6); shade(c, body, CARROT_DK, 20, 18, 0.5);
  [300, 400, 500, 590].forEach((x, i) => line(c, [[x, -22 + i * 6], [x + 22, -14 + i * 6]], 4, CARROT_DK));
  c.restore();
  shape(c, () => rrect(c, 722, 570, 70, 60, 8), CARROT, 6);
  shade(c, () => rrect(c, 722, 570, 70, 60, 8), CARROT_DK, 14, 10, 0.5);
  c.save(); c.translate(792, 600); c.rotate(Math.PI / 2); fronds(c, 0, 0, 190, [-0.6, -0.2, 0.2, 0.6]); c.restore();
  // the knife: handle up, blade down through the cut
  shadow(c, 760, 690, 40, 14);
  shape(c, () => { c.moveTo(672, 332); c.lineTo(728, 332); c.lineTo(728, 640); c.quadraticCurveTo(724, 676, 700, 690); c.lineTo(672, 660); c.closePath(); }, COL.steel, 6);
  shade(c, () => { c.moveTo(672, 332); c.lineTo(728, 332); c.lineTo(728, 640); c.lineTo(700, 690); c.lineTo(672, 660); c.closePath(); }, COL.steelDk, 18, 0, 0.6);
  line(c, [[722, 340], [722, 640]], 3, COL.steelDk);
  shape(c, () => rrect(c, 668, 180, 64, 160, 18), COL.black, 6);
  hand(c, 614, 262, 0, 1.2, SKIN.adult, CLOTH.adult);
  // the other pieces: a carrot slice, a radish top and an onion base
  carrotSlice(c, 230, 770, 78);
  radishTop(c, 480, 790, 0.9);
  onionBase(c, 750, 770, 1.0);
};

// setup.e1.1
const sillScene = (c: Ctx) => {
  ground(c, TABLE);
  shape(c, () => rrect(c, 70, 60, 940, 480, 16), COL.sky, 8);
  sunRays(c, 210, 190, 62);
  line(c, [[540, 60], [540, 540]], 14, "#8a5a3c"); line(c, [[70, 300], [1010, 300]], 14, "#8a5a3c");
  shape(c, () => rrect(c, 40, 540, 1000, 56, 8), COL.wood, 6);
  shape(c, () => rrect(c, 40, 596, 1000, 30, 8), COL.woodDk, 6);
};
const pieceBowl = (c: Ctx, x: number, kind: number) => {
  bowl(c, x, 512, 88);
  if (kind === 0) carrotTop(c, x, 520, 1.0);
  if (kind === 1) carrotSlice(c, x, 515, 56);
  if (kind === 2) radishTop(c, x, 520, 1.0);
  if (kind === 3) onionBase(c, x, 520, 0.95);
};
const e1_1 = (c: Ctx) => {
  sillScene(c);
  [150, 350, 550, 750].forEach((x, i) => pieceBowl(c, x, i));
  [150, 350, 550, 750].forEach((x, i) => label(c, x, 680, String(i + 1)));
  // the potato held over a glass of water by toothpicks, bottom half in the water
  glass(c, 930, 560, 130, 190, 0.7);
  line(c, [[845, 392], [1015, 392]], 12, INK); line(c, [[845, 392], [1015, 392]], 7, COL.wood);
  shape(c, () => ell(c, 930, 392, 66, 50, 0.1), "#c79a5d", 6);
  shade(c, () => ell(c, 930, 392, 66, 50, 0.1), "#9a7140", 16, 12, 0.5);
  [[905, 380], [950, 400], [925, 410]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 6, 4), "#7a5530", 2));
  label(c, 930, 680, "5");
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, TABLE);
  shape(c, () => rrect(c, 40, 920, 1000, 40, 8), COL.wood, 6);
  bowl(c, 340, 800, 200);
  // three shoots; the tallest is about 4 cm on the ruler
  const shoot = (x: number, h: number, lean: number) => {
    const tx = x + lean, ty = 780 - h; line(c, [[x, 780], [tx, ty]], 10, INK); line(c, [[x, 780], [tx, ty]], 5, COL.leafDk);
    [0.35, 0.55, 0.75, 1].forEach((t) => [-0.8, 0.8].forEach((s) => leafAt(c, x + (tx - x) * t, 780 - h * t, 46 - 10 * (1 - t), -Math.PI / 2 + s + lean * 0.004, COL.leaf)));
    leafAt(c, tx, ty, 44, -Math.PI / 2, COL.leaf);
  };
  stub(c, 290, 800, 150, 46, CARROT, CARROT_DK);
  shoot(250, 120, -14); shoot(290, 202, 10); shoot(335, 150, 22);
  // the ruler stands in the bowl, zero at the base of the shoots
  const rx = 440, ry0 = 800, pc = 44;
  shape(c, () => rrect(c, rx, ry0 - 10 * pc - 30, 84, 10 * pc + 56, 8), COL.wood, 6);
  for (let mm = 0; mm <= 100; mm++) { const y = ry0 - mm * (pc / 10), w = mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 14; line(c, [[rx, y], [rx + w, y]], mm % 10 === 0 ? 4 : 2.5); }
  for (let cm = 0; cm <= 10; cm++) write(c, String(cm), rx + 42, ry0 - cm * pc - 11, 22, INK, 4);
  // the tip level marked across to the ruler
  line(c, [[300, 800 - 202 - 12], [rx, 800 - 202 - 12]], 5, RED);
  shape(c, () => ell(c, rx, 800 - 202 - 12, 8, 8), RED, 3);
  handL(c, 583, 410, 1.2);
  // the notebook, with the number written down
  c.save(); c.translate(860, 840); c.rotate(-0.06);
  shadow(c, 10, 130, 180, 20);
  shape(c, () => rrect(c, -170, -130, 340, 260, 12), WHITE, 6);
  [-60, 0, 60].forEach((y) => line(c, [[-140, y + 40], [140, y + 40]], 3, COL.sky));
  write(c, "4 cm", -110, -50, 80, INK, 9);
  c.restore();
};

// ---------------------------------------------------------------- experiment 2: the blue-black test
type Kind = "potato" | "carrot" | "sweet" | "ginger" | "onion" | "banana";
const KINDS: Record<Kind, { skin: string; flesh: string; ring: string; dark: string; wet: string }> = {
  potato: { skin: "#c49a5e", flesh: "#f3e6bf", ring: "#e3d19c", dark: "#26224a", wet: "#26224a" },
  carrot: { skin: "#dd7420", flesh: "#f39a3c", ring: "#e07c25", dark: "#b8681f", wet: "#c47a2c" },
  sweet: { skin: "#a8466a", flesh: "#f7b560", ring: "#e89a40", dark: "#2b2552", wet: "#2b2552" },
  ginger: { skin: "#c9a05a", flesh: "#f4dd88", ring: "#e2c468", dark: "#2a2650", wet: "#2a2650" },
  onion: { skin: "#d9a35b", flesh: "#f6f1e7", ring: "#d8cdb6", dark: "#c9a26a", wet: "#c9a26a" },
  banana: { skin: "#a5c85c", flesh: "#f3ecc4", ring: "#e0d59c", dark: "#1f1c42", wet: "#1f1c42" },
};
const coin = (c: Ctx, x: number, y: number, r: number, k: Kind, wet: boolean) => {
  const K = KINDS[k], flesh = wet ? K.wet : K.flesh, ry = r * 0.82;
  shadow(c, x + 14, y + 20, r * 1.05, ry * 0.95);
  const shapeP = (dy: number, rr: number) => () => {
    if (k === "ginger") { c.moveTo(x - rr, y + dy); c.bezierCurveTo(x - rr * 0.9, y + dy - rr * 0.95, x - rr * 0.2, y + dy - rr * 0.6, x + rr * 0.2, y + dy - rr * 0.85); c.bezierCurveTo(x + rr * 0.9, y + dy - rr * 1.0, x + rr * 1.1, y + dy - rr * 0.1, x + rr * 0.8, y + dy + rr * 0.5); c.bezierCurveTo(x + rr * 0.3, y + dy + rr * 0.9, x - rr * 0.6, y + dy + rr * 0.8, x - rr, y + dy); c.closePath(); } else ell(c, x, y + dy, rr, rr === r ? ry : rr * 0.82);
  };
  shape(c, shapeP(14, r), K.skin, 5);
  shape(c, shapeP(0, r), K.skin, 5);
  shape(c, shapeP(0, r * 0.9), flesh, 3);
  c.save(); c.beginPath(); shapeP(0, r * 0.9)(); c.clip();
  if (k === "onion") { [0.7, 0.45].forEach((f) => { c.beginPath(); ell(c, x, y, r * f, ry * f); c.strokeStyle = wet ? "#a98450" : K.ring; c.lineWidth = 3; c.stroke(); }); }
  if (k === "carrot") { c.beginPath(); ell(c, x, y, r * 0.45, ry * 0.45); c.strokeStyle = wet ? "#9a5416" : K.ring; c.lineWidth = 4; c.stroke(); }
  if (k === "banana") { [[-0.25, 0], [0.25, 0], [0, 0.3]].forEach(([u, v]) => shape(c, () => ell(c, x + u * r, y + v * r, 5, 5), wet ? "#3a3560" : "#6d5a30", 0)); }
  if (k === "sweet" || k === "potato" || k === "ginger") { c.beginPath(); ell(c, x, y, r * 0.55, ry * 0.55); c.strokeStyle = wet ? "#3d3870" : K.ring; c.lineWidth = 3; c.stroke(); }
  c.restore();
  if (wet && K.wet === K.dark && k !== "onion") { c.globalAlpha = 0.45; line(c, [[x - r * 0.6, y - ry * 0.4], [x - r * 0.2, y - ry * 0.65]], 7, "#8a84d0"); c.globalAlpha = 1; }
};
const newspaper = (c: Ctx) => {
  ground(c, TABLE);
  c.save(); c.translate(540, 540); c.rotate(-0.03);
  shadow(c, 10, 20, 540, 520);
  shape(c, () => rrect(c, -520, -510, 1040, 1020, 6), "#f1ece0", 6);
  const r = rnd(5);
  for (let col = 0; col < 4; col++) for (let l = 0; l < 22; l++) { const x = -490 + col * 250, y = -470 + l * 44 + (col === 1 ? 70 : 0); if (y < 460) line(c, [[x, y], [x + 200 - r() * 40, y]], 5, "#b9b3a6"); }
  c.restore();
};
const sixPlate = (c: Ctx, wet: boolean) => {
  newspaper(c);
  plate(c, 540, 560, 480, 360);
  const order: Kind[] = ["potato", "carrot", "sweet", "ginger", "onion", "banana"];
  order.forEach((k, i) => { const x = 270 + (i % 3) * 270, y = 440 + Math.floor(i / 3) * 235; coin(c, x, y, 96, k, wet); label(c, x, y + 120, String(i + 1)); });
};
// setup.e2.0
const e2_0 = (c: Ctx) => sixPlate(c, false);

// setup.e2.1
const e2_1 = (c: Ctx) => {
  newspaper(c);
  // the bottle of iodine at the back
  const bx = 900, by = 640;
  shadow(c, bx + 10, by + 4, 80, 16);
  shape(c, () => rrect(c, bx - 55, by - 230, 110, 230, 22), "#8a4a1c"); shade(c, () => rrect(c, bx - 55, by - 230, 110, 230, 22), "#5e2f10", -22, -4, 0.6);
  shape(c, () => rrect(c, bx - 22, by - 270, 44, 48, 8), "#8a4a1c"); shape(c, () => rrect(c, bx - 30, by - 300, 60, 34, 8), COL.black);
  shape(c, () => rrect(c, bx - 36, by - 180, 72, 100, 8), COL.paper, 4); shape(c, () => dropP(c, bx, by - 130, 17), "#8a4a1c", 3);
  plate(c, 500, 800, 440, 190);
  // a potato piece with three brown drops
  coin(c, 500, 780, 270, "potato", false);
  [[400, 770], [500, 800], [600, 770]].forEach(([x, y]) => { shape(c, () => ell(c, x, y, 38, 28), "#8a4a1c", 4); shape(c, () => ell(c, x - 10, y - 8, 10, 6), "#d9a56a", 0); });
  // the dropper: rubber bulb, glass tube with iodine, a drop falling
  const dx = 500;
  shape(c, () => { c.moveTo(dx - 26, 360); c.lineTo(dx + 26, 360); c.lineTo(dx + 26, 600); c.lineTo(dx + 8, 668); c.lineTo(dx - 8, 668); c.lineTo(dx - 26, 600); c.closePath(); }, COL.glass, 5);
  shape(c, () => { c.moveTo(dx - 24, 470); c.lineTo(dx + 24, 470); c.lineTo(dx + 24, 600); c.lineTo(dx + 7, 664); c.lineTo(dx - 7, 664); c.lineTo(dx - 24, 600); c.closePath(); }, "#9a5420", 0);
  shine(c, [[dx - 16, 380], [dx - 16, 590]], 6);
  shape(c, () => rrect(c, dx - 38, 340, 76, 30, 8), COL.black, 5);
  shape(c, () => { c.moveTo(dx - 36, 340); c.bezierCurveTo(dx - 60, 220, dx + 60, 220, dx + 36, 340); c.closePath(); }, "#8a3b2a", 6);
  shine(c, [[dx - 24, 300], [dx - 20, 250]], 7);
  shape(c, () => dropP(c, dx, 720, 16), "#8a4a1c", 4);
  arrow(c, [[dx + 90, 640], [dx + 90, 730]]);
  hand(c, dx - 84, 440, 0, 1.2, SKIN.adult, CLOTH.adult);
};
// setup.e2.2
const e2_2 = (c: Ctx) => sixPlate(c, true);

// ---------------------------------------------------------------- experiment 3: sun leaf, shade leaf
// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, "#f6efe0");
  c.globalAlpha = 0.35; shape(c, () => ell(c, 170, 150, 330, 280), COL.yellow, 0); c.globalAlpha = 1;
  sunRays(c, 160, 150, 70);
  // the bush: a dark round mass with a shady hollow inside and bright leaves on its sunny outside
  shadow(c, 560, 1000, 480, 40);
  shape(c, () => ell(c, 540, 650, 500, 360), COL.leafDk, 7);
  shape(c, () => ell(c, 770, 590, 230, 200), "#1f4a24", 0);
  const r = rnd(11);
  for (let i = 0; i < 26; i++) { const a = Math.PI + (i / 26) * Math.PI * 0.95, x = 540 + Math.cos(a) * 440, y = 650 + Math.sin(a) * 310; leafAt(c, x, y, 70 + r() * 25, a - 0.3 + r() * 0.6, i % 3 ? COL.greenLt : "#b6de74"); }
  for (let i = 0; i < 10; i++) leafAt(c, 700 + r() * 200, 480 + r() * 230, 70 + r() * 20, r() * 6.28, "#2c6a2c");
  // a red hibiscus flower
  const fx = 450, fy = 330;
  for (let i = 0; i < 5; i++) { const a = (i * 2 * Math.PI) / 5 - 1.2; shape(c, () => ell(c, fx + Math.cos(a) * 42, fy + Math.sin(a) * 42, 44, 32, a), "#e8384a", 5); }
  shape(c, () => ell(c, fx, fy, 14, 14), COL.yellow, 4);
  // a hand picking a bright leaf from the sunny outside
  line(c, [[265, 640], [265, 520]], 8, INK); line(c, [[265, 640], [265, 520]], 4, COL.leafDk);
  bigLeaf(c, 265, 530, 240, -Math.PI / 2, COL.greenLt, COL.leafDk, 0.44, true);
  hand(c, 160, 490, 0, 1.5);
  // a hand reaching into the shade for a dark leaf
  line(c, [[800, 780], [800, 660]], 8, INK); line(c, [[800, 780], [800, 660]], 4, COL.leafDk);
  bigLeaf(c, 800, 670, 220, -Math.PI / 2, "#2c6a2c", "#173f1a", 0.44, true);
  handL(c, 905, 650, 1.5);
};

// setup.e3.1
const leafPath = (c: Ctx) => { c.moveTo(480, 300); c.bezierCurveTo(630, 380, 690, 520, 580, 700); c.bezierCurveTo(540, 760, 500, 770, 480, 750); c.bezierCurveTo(460, 770, 420, 760, 380, 700); c.bezierCurveTo(270, 520, 330, 380, 480, 300); c.closePath(); };
const e3_1 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 560, 560, 470, 450);
  shape(c, () => rrect(c, 90, 90, 900, 900, 10), WHITE, 6);
  for (let i = 0; i <= 15; i++) { line(c, [[100 + i * 60, 90], [100 + i * 60, 990]], 2, "#9ec5e0"); line(c, [[90, 100 + i * 60], [990, 100 + i * 60]], 2, "#9ec5e0"); }
  // the squares inside the leaf get a tick
  let n = 0;
  for (let gx = 100; gx < 980; gx += 60) for (let gy = 100; gy < 980; gy += 60) {
    c.beginPath(); leafPath(c);
    if (!c.isPointInPath(gx + 30, gy + 30)) continue;
    n++; c.fillStyle = "rgba(156,207,98,0.55)"; c.fillRect(gx + 2, gy + 2, 56, 56);
    line(c, [[gx + 16, gy + 32], [gx + 27, gy + 44], [gx + 46, gy + 17]], 5, COL.leafDk);
  }
  c.beginPath(); leafPath(c); c.lineWidth = 9; c.strokeStyle = "#4a4a52"; c.lineJoin = "round"; c.stroke();
  line(c, [[480, 750], [480, 800]], 9, "#4a4a52");
  // the count written below
  shape(c, () => rrect(c, 380, 840, 200, 110, 14), WHITE, 6);
  write(c, String(n), 430, 858, 74, INK, 9);
  // the pencil tracing the edge
  shape(c, () => polyP(c, [[740, 500], [776, 500], [758, 556]]), "#f2c9a0", 5);
  shape(c, () => polyP(c, [[750, 530], [766, 530], [758, 556]]), COL.black, 3);
  shape(c, () => rrect(c, 740, 210, 36, 292, 4), COL.yellow, 6);
  shade(c, () => rrect(c, 740, 210, 36, 292, 4), COL.orange, 12, 0, 0.6);
  shape(c, () => rrect(c, 740, 160, 36, 52, 8), COL.pink, 6);
  handL(c, 826, 360, 1.2);
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c, "#e9dfc8");
  shape(c, () => rrect(c, 40, 40, 1000, 760, 14), "#fff3b8", 8);
  c.globalAlpha = 0.6; shape(c, () => ell(c, 540, 330, 330, 300), "#fffbe0", 0); c.globalAlpha = 1;
  line(c, [[540, 40], [540, 800]], 16, "#8a5a3c"); line(c, [[40, 420], [1040, 420]], 16, "#8a5a3c");
  shape(c, () => rrect(c, 20, 790, 1040, 50, 8), COL.wood, 6);
  // the thin shade leaf glows with the light; the thick sun leaf stays dark
  c.globalAlpha = 0.5; shape(c, () => ell(c, 340, 540, 190, 330), WHITE, 0); c.globalAlpha = 1;
  line(c, [[340, 940], [340, 780]], 12, INK); line(c, [[340, 940], [340, 780]], 6, COL.leafDk);
  bigLeaf(c, 340, 800, 560, -Math.PI / 2, "#d4f08c", "#6f9a2c", 0.5, true);
  line(c, [[740, 940], [740, 780]], 12, INK); line(c, [[740, 940], [740, 780]], 6, COL.leafDk);
  bigLeaf(c, 740, 800, 560, -Math.PI / 2, "#2a5f2a", "#1c421c", 0.5, false);
  hand(c, 228, 900, 0, 1.6);
  handL(c, 852, 900, 1.6);
};

// ---------------------------------------------------------------- experiment 4: roots hold the soil
// setup.e4.0
const e4_0 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 560, 900, 440, 36);
  // the seedling mat, green side up
  shape(c, () => polyP(c, [[300, 190], [800, 190], [920, 500], [180, 500]]), COL.soil);
  shape(c, () => polyP(c, [[300, 190], [800, 190], [920, 500], [180, 500]]), COL.soil, 0);
  const r = rnd(4);
  for (let i = 0; i < 260; i++) { const y = 200 + r() * 290, t = (y - 190) / 310, x0 = 300 - 120 * t, x1 = 800 + 120 * t, x = x0 + r() * (x1 - x0); line(c, [[x, y], [x + (r() - 0.5) * 14, y - 40 - r() * 20]], 6, INK); line(c, [[x, y], [x + (r() - 0.5) * 14, y - 40 - r() * 20]], 3, r() < 0.5 ? COL.green : COL.greenLt); }
  // the lifted corner shows the tangled white roots underneath
  const flap = () => polyP(c, [[180, 500], [920, 500], [960, 700], [140, 800]]);
  shape(c, flap, "#a07a55", 6); shade(c, flap, "#6a4128", 20, 12, 0.35);
  c.save(); c.beginPath(); flap(); c.clip();
  for (let i = 0; i < 70; i++) { const x = 160 + r() * 800, y = 520 + r() * 270, a = r() * 6.28, l = 70 + r() * 90; const pts = [[x, y], [x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.5 + 20], [x + Math.cos(a) * l, y + Math.sin(a) * l]]; line(c, pts, 10, INK); line(c, pts, 5, "#fffaf0"); }
  c.restore();
  line(c, [[140, 800], [960, 700]], 34, INK); line(c, [[140, 800], [960, 700]], 22, COL.soilDk);
  shape(c, () => rrect(c, 150, 486, 790, 26, 12), COL.soilDk, 6);
  // the lens held over the roots
  shape(c, () => rrect(c, 388, 740, 26, 200, 10), COL.black, 6);
  shape(c, () => ell(c, 400, 600, 175, 175), "rgba(230,245,255,0.82)", 0);
  c.save(); c.beginPath(); ell(c, 400, 600, 168, 168); c.clip();
  c.fillStyle = "#a07a55"; c.fillRect(200, 400, 400, 400);
  [[-120, -60, 60, 40], [-60, 20, 130, -50], [10, -110, 90, 90], [60, 70, -140, 30], [-90, 90, 120, 30], [40, -30, 110, 80]].forEach(([x, y, dx, dy]) => { const p = [[400 + x, 600 + y], [400 + x + dx * 0.5, 600 + y + dy * 0.2 + 20], [400 + x + dx, 600 + y + dy]]; line(c, p, 22, INK); line(c, p, 14, "#fffaf0"); for (let k = 0; k < 7; k++) line(c, [[400 + x + dx * k / 7, 600 + y + dy * k / 7], [400 + x + dx * k / 7 + 12, 600 + y + dy * k / 7 - 20]], 4, "#fffaf0"); });
  c.restore();
  c.beginPath(); ell(c, 400, 600, 172, 172); c.strokeStyle = INK; c.lineWidth = 22; c.stroke();
  c.beginPath(); ell(c, 400, 600, 172, 172); c.strokeStyle = COL.steel; c.lineWidth = 12; c.stroke();
  shine(c, [[300, 520], [340, 480]], 10);
  hand(c, 316, 860, 0, 1.2);
  // the other hand grips the right edge of the peeled-back mat and lifts it
  handL(c, 975, 700, 1.2);
  arrow(c, [[1000, 610], [1000, 520]]);
};

const book = (c: Ctx, x: number, y: number, w: number, h: number, col: string, dk: string) => {
  shape(c, () => rrect(c, x - w / 2, y - h, w, h, 6), col, 5); shade(c, () => rrect(c, x - w / 2, y - h, w, h, 6), dk, 0, 10, 0.5);
  shape(c, () => rrect(c, x - w / 2 + 14, y - h + 8, w - 14, h - 16, 3), "#fbf2d6", 3);
};
const wl = (ox: number, oy: number, lx: number, ly: number): [number, number] => { const a = 0.14, ca = Math.cos(a), sa = Math.sin(a); return [ox + lx * ca - ly * sa, oy + lx * sa + ly * ca]; };
// a shallow tray tilted on books, notch at the low (right) end, a glass under the notch
const trayRow = (c: Ctx, oy: number, roots: boolean, wet = 0) => {
  const ox = 540, tab = oy + 232;
  shape(c, () => rrect(c, 40, tab, 1000, 30, 8), COL.wood, 5);
  [[tab, 50, "#d9534a", "#a93a32"], [tab - 50, 48, "#3f6fb3", "#2c4e82"], [tab - 98, 50, "#f2c063", "#d39a3a"], [tab - 148, 48, "#46752a", "#33561d"]].forEach(([y, h, col, dk], i) => book(c, 225 + (i % 2) * 10, (y as number) + (h as number), 210 - (i % 2) * 16, h as number, col as string, dk as string));
  c.save(); c.translate(ox, oy); c.rotate(0.14);
  const front = () => rrect(c, -310, 0, 620, 82, 10);
  shape(c, front, COL.teal, 6); shade(c, front, COL.tealDk, 30, 0, 0.5);
  const top = () => polyP(c, [[-262, -92], [262, -92], [310, 0], [-310, 0]]);
  shape(c, top, COL.soil, 6); shade(c, top, COL.soilDk, 40, 14, 0.4);
  shape(c, () => polyP(c, [[300, -34], [366, -6], [366, 12], [300, 12]]), COL.teal, 6);
  const r = rnd(roots ? 3 : 8);
  if (roots) for (let i = 0; i < 140; i++) { const y = -86 + r() * 80, t = (y + 92) / 92, x0 = -262 - 48 * t, x1 = 262 + 48 * t, x = x0 + 14 + r() * (x1 - x0 - 28); line(c, [[x, y], [x, y - 7]], 8, INK); line(c, [[x, y], [x, y - 7]], 5, r() < 0.5 ? COL.green : COL.greenLt); }
  else for (let i = 0; i < 40; i++) { const y = -84 + r() * 76, t = (y + 92) / 92; shape(c, () => ell(c, -250 - 40 * t + r() * (500 + 80 * t), y, 4 + r() * 3, 3), i % 2 ? COL.soilDk : "#a97a58", 0); }
  if (wet) {
    c.globalAlpha = 0.55; shape(c, top, wet === 2 ? "#8a5020" : "#d8eefb", 0); c.globalAlpha = 1;
    shape(c, () => polyP(c, [[300, -26], [366, -2], [366, 8], [300, 8]]), wet === 2 ? "#8a5020" : "#d8eefb", 0);
  }
  c.restore();
};
const rowGlass = (c: Ctx, oy: number, fill: number, liquid: string) => glass(c, 915, oy + 232, 126, 150, fill, liquid);
// scissors, handles at the origin, blades pointing right
const scissors = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(1.3, 1.3);
  ([-1, 1] as const).forEach((s) => {
    shape(c, () => ell(c, -78, s * 30, 34, 22, s * 0.5), COL.red, 6); shape(c, () => ell(c, -78, s * 30, 18, 10, s * 0.5), TABLE, 4);
    shape(c, () => polyP(c, [[-60, s * 20], [-40, s * 28], [170, s * 16], [175, s * 2], [0, s * -4]]), COL.steel, 6);
  });
  shape(c, () => ell(c, 0, 0, 9, 9), COL.steelDk, 4);
  c.restore();
};
// setup.e4.1
const e4_1 = (c: Ctx) => {
  ground(c, TABLE);
  trayRow(c, 290, true); rowGlass(c, 290, 0);
  trayRow(c, 760, false); rowGlass(c, 760, 0);
  // a hand snipping the shoots off the first tray
  scissors(c, 440, 170, 0.5);
  hand(c, 277, 81, 0.5, 1.2);
  // the snipped shoots lie in a little heap beside the first tray
  const r = rnd(2);
  for (let i = 0; i < 22; i++) { const x = 480 + r() * 120, y = 290 + 205 + r() * 22, a = -0.4 + r() * 0.8; line(c, [[x, y], [x + 58 * Math.cos(a), y + 30 * Math.sin(a)]], 9, INK); line(c, [[x, y], [x + 58 * Math.cos(a), y + 30 * Math.sin(a)]], 5, i % 2 ? COL.green : COL.greenLt); }
};
// a mug tipped to pour from its right lip
const mug = (c: Ctx, x: number, y: number) => {
  c.save(); c.translate(x, y); c.rotate(0.9); c.scale(0.85, 0.85);
  c.beginPath(); c.arc(-60, 0, 36, -1.5, 1.5, true); c.strokeStyle = INK; c.lineWidth = 24; c.stroke();
  c.beginPath(); c.arc(-60, 0, 36, -1.5, 1.5, true); c.strokeStyle = COL.teal; c.lineWidth = 12; c.stroke();
  const body = () => rrect(c, -60, -70, 120, 140, 18);
  shape(c, body, COL.teal, 6); shade(c, body, COL.tealDk, 24, 0, 0.5);
  shape(c, () => ell(c, 0, -70, 60, 14), COL.water, 5);
  c.restore();
};
// setup.e4.2
const e4_2 = (c: Ctx) => {
  ground(c, TABLE);
  trayRow(c, 290, true, 1); rowGlass(c, 290, 0.6, "#d8eefb");
  trayRow(c, 760, false, 2); rowGlass(c, 760, 0.6, "#8a5020");
  [290, 760].forEach((oy) => {
    const [lx, ly] = [498, oy - 147], mud = oy === 760;
    const [sx, sy] = wl(540, oy, 360, 0);
    mug(c, 420, oy - 150);
    line(c, [[lx, ly], [lx + 6, oy - 100], [lx + 4, oy - 48]], 18, INK); line(c, [[lx, ly], [lx + 6, oy - 100], [lx + 4, oy - 48]], 11, "#8fc3ea");
    shape(c, () => ell(c, lx + 4, oy - 44, 34, 10), "#8fc3ea", 4);
    line(c, [[sx + 6, sy + 12], [sx + 6, oy + 232 - 150 * 0.4 - 60]], 16, INK); line(c, [[sx + 6, sy + 12], [sx + 6, oy + 232 - 150 * 0.4 - 60]], 9, mud ? "#8a5020" : "#d8eefb");
    arrow(c, [[590, oy - 140], [590, oy - 80]]);
  });
};

export const su_plantsPlantParts = cards("sci.plants.plant-parts.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2, e4_0, e4_1, e4_2]);
