import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, hand, person, cards } from "./flatKit";

// BLACK HOLES L3 · the black-box experiment: a shoebox lid of black paper, a white strip, a pencil hole.
const PAPER = "#35313f", PAPERDK = "#25222e", HOLE = "#050308", TABLE = "#e8cf9c", TABLEDK = "#c9a96b";

// a shoebox seen from the front and above: its lid on top (black paper, white strip taped on), a cardboard body below
type LidOpt = { hole?: number; strip?: boolean };
const box = (c: Ctx, cx: number, cy: number, w: number, h: number, t: number, bodyH: number, o: LidOpt = {}) => {
  const pt = (u: number, v: number): [number, number] => [cx + u * (w / 2 - 0.1 * w * (1 - v)), cy - h / 2 + v * h];
  const base = cy + h / 2 + t + bodyH;
  shadow(c, cx + w * 0.06, base + 4, w * 0.58, 22);
  // body
  shape(c, () => rrect(c, cx - w / 2, cy + h / 2 + t - 4, w, bodyH + 4, 6), COL.brown);
  shade(c, () => rrect(c, cx - w / 2, cy + h / 2 + t - 4, w, bodyH + 4, 6), COL.soilDk, w * 0.3, 0, 0.35);
  // lid edge and top
  shape(c, () => rrect(c, cx - w / 2 - 6, cy + h / 2, w + 12, t, 5), COL.woodDk);
  shape(c, () => polyP(c, [pt(-1, 0), pt(1, 0), pt(1, 1), pt(-1, 1)]), PAPER);
  shade(c, () => polyP(c, [pt(-1, 0), pt(1, 0), pt(1, 1), pt(-1, 1)]), PAPERDK, w * 0.4, h * 0.2, 0.7);
  if (o.strip) {
    const p = [pt(0.3, 0.1), pt(0.58, 0.1), pt(0.58, 0.9), pt(0.3, 0.9)];
    shape(c, () => polyP(c, p), WHITE, 5);
    for (const v of [0.1, 0.9]) shape(c, () => polyP(c, [pt(0.27, v - 0.05), pt(0.61, v - 0.05), pt(0.61, v + 0.05), pt(0.27, v + 0.05)]), "rgba(243,200,90,0.75)", 3);
  }
  if (o.hole) { const [hx, hy] = pt(0, 0.5); shape(c, () => ell(c, hx, hy, o.hole!, o.hole! * 0.5), HOLE, Math.max(3, o.hole! * 0.12)); }
};
const room = (c: Ctx, tableTop: number) => {
  ground(c);
  c.fillStyle = TABLE; c.fillRect(0, tableTop, D, D - tableTop);
  line(c, [[0, tableTop], [D, tableTop]], 6);
  c.fillStyle = TABLEDK; c.globalAlpha = 0.25; c.fillRect(0, tableTop + 6, D, 22); c.globalAlpha = 1;
};

// setup.e1.0
const card0 = (c: Ctx) => {
  room(c, 220);
  box(c, 540, 480, 740, 400, 38, 170, { strip: true });
};

// setup.e1.1
const card1 = (c: Ctx) => {
  room(c, 520);
  box(c, 540, 740, 660, 200, 30, 120, { strip: true });
  // the pencil, tip on the middle of the lid, a hole just started
  const px = 540, top = 300, tip = 742;
  shadow(c, px + 20, tip + 6, 30, 8);
  shape(c, () => polyP(c, [[px - 26, top], [px + 26, top], [px + 26, tip - 70], [px, tip], [px - 26, tip - 70]]), COL.yellow);
  shade(c, () => polyP(c, [[px - 26, top], [px + 26, top], [px + 26, tip - 70], [px, tip], [px - 26, tip - 70]]), COL.orange, 22, 0, 0.6);
  shape(c, () => polyP(c, [[px - 26, tip - 70], [px + 26, tip - 70], [px, tip]]), COL.paper, 5);
  shape(c, () => polyP(c, [[px - 9, tip - 25], [px + 9, tip - 25], [px, tip]]), INK, 3);
  // a grown-up's hand holding it from above
  hand(c, 558, 235, Math.PI / 2, 2.2, SKIN.adult, CLOTH.adult);
  arrow(c, [[720, 280], [720, 520]]);
};

// setup.e1.2
const card2 = (c: Ctx) => {
  ground(c);
  // a bright window on the wall
  shape(c, () => rrect(c, 520, 50, 440, 400, 14), "#fff6c9", 8);
  shape(c, () => rrect(c, 548, 78, 384, 344, 8), "#fffbe6", 4);
  shape(c, () => ell(c, 740, 250, 70, 70), COL.yellow, 6);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + 0.2; line(c, [[740 + Math.cos(a) * 92, 250 + Math.sin(a) * 92], [740 + Math.cos(a) * 128, 250 + Math.sin(a) * 128]], 9, COL.orange); }
  line(c, [[740, 78], [740, 422]], 8); line(c, [[548, 250], [932, 250]], 8);
  // floor
  c.fillStyle = "#d9c3a0"; c.fillRect(0, 900, D, D - 900); line(c, [[0, 900], [D, 900]], 6);
  // table with the box on it
  shadow(c, 830, 975, 260, 22);
  shape(c, () => rrect(c, 560, 775, 480, 40, 8), TABLE);
  shape(c, () => rrect(c, 585, 815, 30, 150, 6), TABLEDK); shape(c, () => rrect(c, 985, 815, 30, 150, 6), TABLEDK);
  box(c, 800, 590, 440, 150, 20, 90, { strip: true, hole: 30 });
  // the child, one step away, pointing at the box
  person(c, 230, 960, 620, { armR: [-0.12, 0.02], armL: [Math.PI * 0.55, Math.PI * 0.5] });
};

// setup.e1.3
const card3 = (c: Ctx) => {
  room(c, 90);
  // the lid on its own, up on the table, with the bigger round hole; a bottle cap stands beside it
  const cx = 360, cy = 300, w = 560, h = 250, t = 30;
  const pt = (u: number, v: number): [number, number] => [cx + u * (w / 2 - 0.1 * w * (1 - v)), cy - h / 2 + v * h];
  shadow(c, cx + 20, cy + h / 2 + t + 8, w * 0.58, 20);
  shape(c, () => rrect(c, cx - w / 2 - 6, cy + h / 2, w + 12, t, 5), COL.woodDk);
  shape(c, () => polyP(c, [pt(-1, 0), pt(1, 0), pt(1, 1), pt(-1, 1)]), PAPER);
  shade(c, () => polyP(c, [pt(-1, 0), pt(1, 0), pt(1, 1), pt(-1, 1)]), PAPERDK, w * 0.4, h * 0.2, 0.7);
  shape(c, () => polyP(c, [pt(0.5, 0.1), pt(0.78, 0.1), pt(0.78, 0.9), pt(0.5, 0.9)]), WHITE, 5);
  const [hx, hy] = pt(-0.2, 0.5);
  shape(c, () => ell(c, hx, hy, 82, 44), HOLE, 6);
  // a bottle cap standing on its rim next to the lid, the same width as the hole
  const kx = 900, ky = 470;
  shadow(c, kx + 14, ky + 6, 90, 14);
  const cap = () => { c.moveTo(kx - 82, ky); c.lineTo(kx - 70, ky - 60); c.lineTo(kx + 70, ky - 60); c.lineTo(kx + 82, ky); c.closePath(); };
  shape(c, cap, COL.red, 6);
  shade(c, cap, "#a8321f", 36, 0, 0.5);
  for (let k = -3; k <= 3; k++) line(c, [[kx + k * 22, ky - 6], [kx + k * 20, ky - 54]], 4);
  shape(c, () => ell(c, kx, ky - 60, 70, 16), COL.orange, 5);
  // the open box below, lined with black cloth
  const bx = 540, bw = 640, bh = 260, top = 560, rimY = top + bh;
  shadow(c, bx + 24, 975, 340, 22);
  shape(c, () => rrect(c, bx - bw / 2, rimY - 4, bw, 960 - rimY + 4, 6), COL.brown);
  shade(c, () => rrect(c, bx - bw / 2, rimY - 4, bw, 960 - rimY + 4, 6), COL.soilDk, bw * 0.3, 0, 0.35);
  const bp = (u: number, v: number): [number, number] => [bx + u * (bw / 2 - 0.1 * bw * (1 - v)), top + v * bh];
  shape(c, () => polyP(c, [bp(-1, 0), bp(1, 0), bp(1, 1), bp(-1, 1)]), COL.wood);
  shape(c, () => polyP(c, [bp(-0.9, 0.08), bp(0.9, 0.08), bp(0.9, 0.92), bp(-0.9, 0.92)]), HOLE);
  for (const [u1, u2] of [[-0.55, -0.35], [0.1, 0.25], [0.5, 0.62]]) line(c, [bp(u1, 0.3), bp(u2, 0.85)], 5, "#4a4558");
  shape(c, () => { const a = bp(-0.9, 0.92), b = bp(0.9, 0.92); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b[0] - 14, b[1] + 40); c.quadraticCurveTo(bx, b[1] + 18, a[0] + 14, a[1] + 40); c.closePath(); }, PAPER, 5);
};

export const su_storyOfUniverseBlackHoles = cards("sci.story-of-universe.black-holes.L3 set-up", [card0, card1, card2, card3]);
