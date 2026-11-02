import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, bowl, person, hand, write, cards } from "./flatKit";

// MIGRATION L3 · fill cards: flow.e1 (blindfold steps to the bowl from a moved start),
// flow.e2 (tailwind carries a paper butterfly), flow.p1 (the finished migration book).

const WALL = "#f6efe0";
// a room: pale wall above, the counter-coloured floor below, one ink line between
const room = (c: Ctx, floorY: number) => { ground(c, BG); c.fillStyle = WALL; c.fillRect(0, 0, D, floorY); line(c, [[0, floorY], [D, floorY]], 6); };
// a sheet of newspaper lying flat on the floor, centre (x, y)
const paperMark = (c: Ctx, x: number, y: number, faded = false) => {
  shape(c, () => polyP(c, [[x - 70, y - 22], [x + 80, y - 22], [x + 70, y + 22], [x - 80, y + 22]]), faded ? "#e6ded0" : COL.paper, faded ? 3 : 5);
  c.globalAlpha = faded ? 0.3 : 0.6; for (let i = 0; i < 3; i++) line(c, [[x - 50 + i * 6, y - 10 + i * 11], [x + 50 - i * 6, y - 10 + i * 11]], 3, COL.greyDk); c.globalAlpha = 1;
};

// e1: eyes covered, the child counts steps towards the steel bowl, but the start sheet has been moved
const e1 = (c: Ctx) => {
  room(c, 600);
  // the old start (faded) and the learned path straight to the bowl, dashed grey
  paperMark(c, 330, 740, true);
  c.setLineDash([18, 22]); line(c, [[420, 740], [680, 740]], 5, COL.grey); c.setLineDash([]);
  // the bowl (the "lake") on the floor
  bowl(c, 820, 700, 125, COL.water);
  // the new start sheet, and the grown-up who moved it, standing at the left
  paperMark(c, 200, 930);
  person(c, 75, 1000, 470, { adult: true, armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.2, Math.PI * 0.45] });
  // the child, eyes covered, arms out in front, walking right from the new sheet
  const cx = 330, cy = 980, h = 430;
  shadow(c, cx + 30, cy + 8, 110, 18);
  person(c, cx, cy, h, { armL: [-0.15, 0.05], armR: [-0.25, 0.1] });
  const head = h * 0.13, hy = cy - h * 0.74 - head * 1.05;
  shape(c, () => rrect(c, cx - head * 1.08, hy - head * 0.05, head * 2.16, head * 0.42, 8), COL.purple, 5);
  line(c, [[cx + head * 1.05, hy + head * 0.1], [cx + head * 1.5, hy + head * 0.55], [cx + head * 1.75, hy + head * 0.3]], 7, COL.purple);
  // the same number of steps, counted along a red arrow: it ends below the bowl, not at it
  arrow(c, [[cx + 110, 930], [880, 930]], RED, 12);
  for (let i = 1; i <= 4; i++) write(c, String(i), cx + 110 + i * 105 - 70, 855, 46, INK, 7);
  shape(c, () => ell(c, 895, 930, 22, 22), WHITE, 6);
  line(c, [[880, 915], [910, 945]], 7, RED); line(c, [[910, 915], [880, 945]], 7, RED);
};

// a paper butterfly: thin paper square pinched in the middle by a clip, centre (x, y), size s, rotation rot
const butterfly = (c: Ctx, x: number, y: number, s: number, rot: number, flat = false) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const sy = flat ? 0.45 : 1;
  const wing = (dir: number) => { c.moveTo(0, -6 * sy); c.quadraticCurveTo(dir * s * 0.9, -s * 1.1 * sy, dir * s, -s * 0.2 * sy); c.quadraticCurveTo(dir * s * 0.95, s * 0.6 * sy, dir * s * 0.45, s * 0.9 * sy); c.quadraticCurveTo(dir * s * 0.1, s * 0.5 * sy, 0, 6 * sy); c.closePath(); };
  shape(c, () => wing(-1), COL.pink, 5); shape(c, () => wing(1), COL.pink, 5);
  shade(c, () => wing(1), "#d9779a", s * 0.25, s * 0.15 * sy, 0.4);
  shape(c, () => rrect(c, -s * 0.09, -s * 0.5 * sy, s * 0.18, s * sy, s * 0.08), COL.steel, 4);
  line(c, [[0, -s * 0.5 * sy], [-s * 0.22, -s * 0.85 * sy]], 4); line(c, [[0, -s * 0.5 * sy], [s * 0.22, -s * 0.85 * sy]], 4);
  c.restore();
};
// e2: a fan blows from the left; the butterfly dropped from the hand lands far to the right
const e2 = (c: Ctx) => {
  room(c, 880);
  // the pedestal fan: base, pole, round head with cage and blades
  shadow(c, 180, 896, 120, 16);
  shape(c, () => ell(c, 170, 880, 110, 22), COL.steelDk);
  shape(c, () => rrect(c, 155, 440, 30, 440, 10), COL.steel);
  shape(c, () => ell(c, 170, 400, 125, 125), COL.steelIn);
  for (let k = 0; k < 3; k++) { const a = -0.6 + k * 2.09; shape(c, () => ell(c, 170 + Math.cos(a) * 62, 400 + Math.sin(a) * 62, 58, 30, a), COL.blue, 4); }
  shape(c, () => ell(c, 170, 400, 26, 26), COL.steelDk, 4);
  for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + k * (Math.PI / 7); line(c, [[170 + Math.cos(a) * 125, 400 + Math.sin(a) * 125], [170 - Math.cos(a) * 125, 400 - Math.sin(a) * 125]], 2.5, COL.greyDk); }
  shape(c, () => ell(c, 170, 400, 125, 125), "rgba(0,0,0,0)", 6);
  // wind: pale blue streaks blowing right
  for (let k = 0; k < 4; k++) { const y = 330 + k * 50; c.globalAlpha = 0.8; line(c, [[320, y], [430 + k * 20, y - 10], [520 + k * 30, y + 6]], 8, COL.sky); c.globalAlpha = 1; }
  // the child's hand up high, just opened; the coin below it on the floor marks the spot
  hand(c, 470, 150, Math.PI / 2, 1.15, SKIN.child, CLOTH.child, true);
  shape(c, () => ell(c, 560, 884, 30, 10), COL.yellow, 5);
  c.setLineDash([14, 18]); line(c, [[560, 290], [560, 860]], 4, COL.grey); c.setLineDash([]);
  // the butterfly in the air, drifting right, and where she lands
  arrow(c, [[560, 290], [600, 480], [720, 700], [880, 850]], RED, 11);
  butterfly(c, 690, 520, 130, 0.5);
  butterfly(c, 930, 878, 80, 0.15, true);
  // a tape measure along the floor from the coin to the landing spot
  shape(c, () => rrect(c, 560, 940, 420, 50, 8), COL.yellow);
  for (let k = 0; k <= 20; k++) { const x = 570 + k * 20; line(c, [[x, 940], [x, k % 5 === 0 ? 968 : 955]], k % 5 === 0 ? 4 : 2.5); }
  write(c, "0", 566, 1000, 34, INK, 5); write(c, "20", 740, 1000, 34, INK, 5); write(c, "40", 930, 1000, 34, INK, 5);
};

// p1: the finished migration book lying open: a map page with both homes and the route, a bird page
const p1 = (c: Ctx) => {
  ground(c, BG);
  const L = 110, T = 230, W = 420, H = 560;
  shadow(c, 560, T + H + 20, 470, 36);
  // two pages
  shape(c, () => polyP(c, [[L, T + 20], [L + W, T], [L + W, T + H], [L, T + H - 20]]), COL.paper);
  shape(c, () => polyP(c, [[L + W + 20, T], [L + W + 20 + W, T + 20], [L + W + 20 + W, T + H - 20], [L + W + 20, T + H]]), COL.paper);
  shape(c, () => rrect(c, L + W - 4, T - 6, 28, H + 10, 6), COL.cloth, 5);
  for (const y of [T + 120, T + H / 2, T + H - 120]) line(c, [[L + W + 10, y - 16], [L + W + 10, y + 16]], 6, COL.greyDk);
  // left page: the world map, two homes marked, the route drawn in red
  const mx = L + 30, my = T + 60, mw = W - 60, mh = H - 120;
  shape(c, () => rrect(c, mx, my, mw, mh, 10), COL.water, 5);
  const land = (pts: number[][]) => shape(c, () => polyP(c, pts.map(([u, v]) => [mx + u * mw, my + v * mh])), COL.leaf, 4);
  land([[0.08, 0.1], [0.3, 0.08], [0.36, 0.2], [0.3, 0.35], [0.26, 0.5], [0.32, 0.56], [0.36, 0.72], [0.3, 0.88], [0.26, 0.86], [0.24, 0.66], [0.17, 0.52], [0.1, 0.4], [0.06, 0.25]]);
  land([[0.44, 0.12], [0.7, 0.08], [0.92, 0.14], [0.94, 0.32], [0.82, 0.4], [0.72, 0.36], [0.64, 0.46], [0.62, 0.68], [0.56, 0.72], [0.5, 0.58], [0.42, 0.42], [0.46, 0.3], [0.4, 0.22]]);
  land([[0.78, 0.6], [0.92, 0.62], [0.94, 0.76], [0.8, 0.78], [0.76, 0.68]]);
  shape(c, () => rrect(c, mx + 4, my + mh - 40, mw - 8, 36, 8), WHITE, 4);
  shape(c, () => rrect(c, mx + 4, my + 4, mw - 8, 30, 8), WHITE, 4);
  arrow(c, [[mx + mw * 0.3, my + 40], [mx + mw * 0.2, my + mh * 0.4], [mx + mw * 0.4, my + mh * 0.75], [mx + mw * 0.44, my + mh - 44]], RED, 8);
  shape(c, () => ell(c, mx + mw * 0.3, my + 36, 18, 18), COL.yellow, 5);
  shape(c, () => ell(c, mx + mw * 0.44, my + mh - 40, 18, 18), COL.yellow, 5);
  // right page: the traveller, an Arctic tern, with lines of writing under it
  const bx = L + W + 20 + W / 2, by = T + 190;
  shape(c, () => { c.moveTo(bx - 20, by); c.quadraticCurveTo(bx - 120, by - 80, bx - 170, by - 30); c.quadraticCurveTo(bx - 90, by - 20, bx - 20, by + 20); c.closePath(); }, COL.steelIn, 5);
  shape(c, () => { c.moveTo(bx + 20, by); c.quadraticCurveTo(bx + 120, by - 80, bx + 170, by - 30); c.quadraticCurveTo(bx + 90, by - 20, bx + 20, by + 20); c.closePath(); }, COL.steelIn, 5);
  shape(c, () => ell(c, bx, by + 12, 70, 30), WHITE, 5);
  shape(c, () => { c.moveTo(bx + 40, by + 24); c.lineTo(bx + 110, by + 70); c.lineTo(bx + 64, by + 30); c.lineTo(bx + 90, by + 84); c.closePath(); }, WHITE, 4);
  shape(c, () => ell(c, bx - 62, by - 6, 26, 24), WHITE, 5);
  shape(c, () => { c.moveTo(bx - 88, by - 14); c.quadraticCurveTo(bx - 62, by - 40, bx - 36, by - 14); c.closePath(); }, COL.black, 4);
  shape(c, () => polyP(c, [[bx - 86, by], [bx - 130, by + 4], [bx - 86, by + 10]]), COL.red, 4);
  shape(c, () => ell(c, bx - 70, by - 4, 4, 4), WHITE, 0);
  for (let k = 0; k < 5; k++) { const y = by + 150 + k * 46; line(c, [[bx - 150, y], [bx + (k === 4 ? 40 : 150), y]], 5, COL.greyDk); }
  // colour pencils beside the book
  const pencil = (x: number, y: number, col: string, rot: number) => { c.save(); c.translate(x, y); c.rotate(rot); shape(c, () => rrect(c, -130, -14, 230, 28, 6), col); shape(c, () => polyP(c, [[100, -14], [140, 0], [100, 14]]), COL.wood, 5); shape(c, () => polyP(c, [[128, -4], [140, 0], [128, 4]]), col, 3); c.restore(); };
  pencil(760, 900, COL.red, -0.12); pencil(830, 960, COL.green, -0.05); pencil(900, 1020, COL.blue, 0.03);
};

export const ic_animalBehaviourMigrationL3Fill = cards("sci.animal-behaviour.migration.L3 fill", [e1, e2, p1]);
