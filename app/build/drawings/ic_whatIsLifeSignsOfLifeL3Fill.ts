import type { Ctx } from "./core";
import { D, INK, RED, WHITE, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, seed, leaf, person, write, cards } from "./flatKit";

// SIGNS OF LIFE (L3) · fill-in cards: the cover, the yeast balloon test, the sleeping-or-dead seed
// test, the breath counter. Flat kit look: bold ink outline, flat colours, light from the upper left.

// a white tapering root from (x, y) through the points, as in the moong cards
const root = (c: Ctx, pts: number[][], w: number) => {
  const path = () => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
  c.lineCap = "round"; c.lineJoin = "round";
  path(); c.strokeStyle = INK; c.lineWidth = w + 9; c.stroke();
  path(); c.strokeStyle = COL.paper; c.lineWidth = w; c.stroke();
};
// a pad of cotton wool, centre (x, y)
const cotton = (c: Ctx, x: number, y: number, rx: number, ry: number, wet: boolean) => {
  shape(c, () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx, y - ry * 1.6, x - rx * 0.3, y - ry * 1.3, x - rx * 0.2, y - ry); c.bezierCurveTo(x, y - ry * 1.7, x + rx * 0.5, y - ry * 1.5, x + rx * 0.55, y - ry * 0.9); c.bezierCurveTo(x + rx, y - ry * 1.3, x + rx * 1.05, y - ry * 0.2, x + rx, y); c.bezierCurveTo(x + rx, y + ry, x - rx, y + ry, x - rx, y); c.closePath(); }, wet ? COL.sky : COL.cloth, 5);
};

// cover: one moong seed waking up: root down, shoot and two leaves up, a dry seed beside it for contrast
const intro = (c: Ctx) => {
  ground(c);
  // wet cotton bed
  shadow(c, 560, 850, 380, 40);
  cotton(c, 540, 820, 360, 70, true);
  // root into the cotton
  root(c, [[540, 700], [530, 760], [560, 820], [540, 880]], 18);
  root(c, [[545, 790], [600, 830], [640, 850]], 10);
  // the seed, split open, big
  shape(c, () => ell(c, 540, 650, 120, 84, 0.1), COL.greenLt, 8);
  shade(c, () => ell(c, 540, 650, 120, 84, 0.1), COL.green, 40, 28);
  line(c, [[450, 640], [640, 648]], 14, "#f4f1e4");
  // the shoot: a stem up and two leaves
  line(c, [[520, 590], [505, 480], [520, 380]], 22, INK);
  line(c, [[520, 590], [505, 480], [520, 380]], 12, COL.leafDk);
  leaf(c, 518, 400, 190, -2.55);
  leaf(c, 518, 400, 190, -0.6);
  // a red arrow: it grows up
  arrow(c, [[760, 620], [760, 330]], RED, 14);
  // a small dry seed to the side, sitting still
  shadow(c, 220, 790, 60, 12);
  seed(c, 210, 760, 52, 0.3, false);
};

// e1: three bottles with yeast; the warm sugar one blows its balloon up, no sugar a little, cold hardly at all
const bottle = (c: Ctx, x: number, y: number, bal: number, foam: boolean) => {
  // body, shoulders, neck
  shadow(c, x + 20, y + 8, 110, 20);
  const body = () => { c.moveTo(x - 95, y); c.lineTo(x - 95, y - 300); c.quadraticCurveTo(x - 95, y - 370, x - 36, y - 400); c.lineTo(x - 36, y - 440); c.lineTo(x + 36, y - 440); c.lineTo(x + 36, y - 400); c.quadraticCurveTo(x + 95, y - 370, x + 95, y - 300); c.lineTo(x + 95, y); c.closePath(); };
  shape(c, body, COL.glass, 0);
  // the yeast mix: cloudy yellow, with foam on top if alive and busy
  shape(c, () => { c.moveTo(x - 93, y - 2); c.lineTo(x - 93, y - 170); c.lineTo(x + 93, y - 170); c.lineTo(x + 93, y - 2); c.closePath(); }, "#e9cf86", 0);
  if (foam) { const r = rnd(x); for (let i = 0; i < 14; i++) { const bx = x - 80 + r() * 160, by = y - 180 + r() * 40; shape(c, () => ell(c, bx, by, 10 + r() * 8, 8 + r() * 6), COL.paper, 3); } }
  shape(c, body, "rgba(0,0,0,0)", 6);
  shine(c, [[x - 72, y - 290], [x - 72, y - 60]], 8);
  // balloon stretched over the neck
  shape(c, () => rrect(c, x - 44, y - 460, 88, 50, 10), COL.red, 6);
  if (bal < 0.2) {
    // flat: hangs limp to one side
    shape(c, () => { c.moveTo(x - 30, y - 500); c.quadraticCurveTo(x - 10, y - 600, x + 40, y - 560); c.quadraticCurveTo(x + 60, y - 520, x + 30, y - 500); c.closePath(); }, COL.red, 6);
  } else {
    const r = 70 + bal * 110;
    shape(c, () => ell(c, x, y - 500 - r, r * 0.92, r), COL.red, 6);
    shade(c, () => ell(c, x, y - 500 - r, r * 0.92, r), "#b53f2e", r * 0.3, r * 0.25);
    shine(c, [[x - r * 0.45, y - 500 - r * 1.35], [x - r * 0.3, y - 500 - r * 1.6]], 8);
  }
};
const e1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e2d3b5"; c.fillRect(0, 930, D, 150);
  line(c, [[0, 930], [D, 930]], 6);
  bottle(c, 260, 920, 1, true);
  bottle(c, 540, 920, 0.35, true);
  bottle(c, 820, 920, 0, false);
  // the big balloon grew: red arrow up beside it
  arrow(c, [[60, 560], [60, 300]], RED, 14);
  // sugar spoon for A and B: a small white heap mark on the glass; snowflake-ish cold mark for C
  shape(c, () => ell(c, 260, 760, 34, 14), WHITE, 5);
  shape(c, () => ell(c, 540, 760, 34, 14), WHITE, 5);
  line(c, [[540, 745], [540, 775]], 0);
  // cold: a few pale blue drops on C's glass
  for (const [dx, dy] of [[-40, 700], [30, 740], [-10, 800]]) shape(c, () => ell(c, 820 + dx, dy, 10, 14), COL.sky, 4);
};

// e2: four cups on day 6: soaked seeds sprouted, dry seeds asleep, boiled seeds dead, beads nothing
const cup = (c: Ctx, x: number, y: number, wet: boolean) => {
  // a short steel bowl with cotton in it
  bowl(c, x, y, 120, wet ? COL.sky : COL.cloth);
  cotton(c, x, y - 6, 100, 22, wet);
};
const e2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e2d3b5"; c.fillRect(0, 760, D, 320);
  line(c, [[0, 760], [D, 760]], 6);
  const xs = [150, 410, 670, 930], y = 700;
  // A: sprouted seeds, roots and little shoots
  cup(c, xs[0], y, true);
  for (const [sx, sy, an] of [[90, 660, -1.9], [150, 650, -1.3], [205, 670, -1.0], [120, 690, -1.6], [175, 695, -1.2]]) {
    const tx = sx + Math.cos(an) * 90, ty = sy + Math.sin(an) * 90;
    line(c, [[sx, sy], [tx, ty]], 14, INK); line(c, [[sx, sy], [tx, ty]], 7, COL.leafDk);
    leaf(c, tx, ty, 46, an - 0.7); leaf(c, tx, ty, 46, an + 0.7);
    root(c, [[sx, sy], [sx + 10, sy + 20], [sx - 6, sy + 36]], 7);
    seed(c, sx, sy, 20, an + 1.5, true);
  }
  // B: dry seeds, small and dark, nothing happening
  cup(c, xs[1], y, false);
  for (const [sx, sy] of [[360, 668], [410, 660], [460, 670], [385, 690], [440, 692]]) seed(c, sx, sy, 15, sx * 0.1, false);
  // C: boiled seeds, soft and pale brown, no roots
  cup(c, xs[2], y, true);
  for (const [sx, sy] of [[620, 668], [670, 660], [720, 670], [645, 690], [700, 692]]) seed(c, sx, sy, 20, sx * 0.1, true, "#c9b98a", "#a89766");
  // D: plastic beads
  cup(c, xs[3], y, true);
  for (const [sx, sy, col] of [[880, 668, COL.blue], [930, 660, COL.pink], [980, 670, COL.yellow], [905, 690, COL.purple], [960, 692, COL.teal]]) {
    shape(c, () => ell(c, sx as number, sy as number, 17, 17), col as string, 5);
    shape(c, () => ell(c, sx as number, sy as number, 5, 5), INK, 0);
  }
  // counts of sprouted seeds above each cup, a red arrow pointing at the winners
  write(c, "5", xs[0] - 28, 470, 90, INK, 10);
  write(c, "0", xs[1] - 36, 470, 90, INK, 10);
  write(c, "0", xs[2] - 36, 470, 90, INK, 10);
  write(c, "0", xs[3] - 36, 470, 90, INK, 10);
  arrow(c, [[xs[0], 420], [xs[0], 300]], RED, 14);
};

// e3: the child jumping, breathing hard; a clock counting seconds beside
const e3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e2d3b5"; c.fillRect(0, 900, D, 180);
  line(c, [[0, 900], [D, 900]], 6);
  // the child in the air, arms up
  shadow(c, 420, 905, 150, 22);
  person(c, 400, 790, 620, { armL: [-Math.PI * 0.75, -Math.PI * 0.6], armR: [-Math.PI * 0.25, -Math.PI * 0.4] });
  // up-and-down motion arrows
  arrow(c, [[150, 700], [150, 480]], RED, 14);
  arrow(c, [[150, 820], [150, 870]], RED, 14);
  // breath: puffs from the mouth, out to the side
  for (const [dx, k] of [[0, 1], [1, 0.8], [2, 0.6]]) {
    const px = 540 + dx * 68, py = 265 - dx * 18, r = 30 * k;
    shape(c, () => { ell(c, px, py, r * 1.2, r); }, "rgba(255,255,255,0.85)", 5);
  }
  // the clock: 15 seconds swept in red
  shadow(c, 850, 600, 150, 26);
  shape(c, () => ell(c, 840, 420, 170, 170), WHITE, 8);
  shape(c, () => { c.moveTo(840, 420); c.arc(840, 420, 150, -Math.PI / 2, 0); c.closePath(); }, "rgba(215,55,43,0.35)", 0);
  for (let i = 0; i < 12; i++) { const an = (i / 12) * Math.PI * 2; line(c, [[840 + Math.cos(an) * 130, 420 + Math.sin(an) * 130], [840 + Math.cos(an) * 150, 420 + Math.sin(an) * 150]], i % 3 === 0 ? 8 : 4); }
  line(c, [[840, 420], [840, 300]], 10);
  line(c, [[840, 420], [960, 420]], 8, RED);
  shape(c, () => ell(c, 840, 420, 12, 12), INK, 0);
  write(c, "15", 800, 470, 60, INK, 8);
  // the clock stands on a small block
  shape(c, () => rrect(c, 760, 590, 160, 40, 10), COL.wood, 6);
  shape(c, () => rrect(c, 820, 586, 40, 10, 4), COL.woodDk, 0);
};

export const ic_whatIsLifeSignsOfLifeL3Fill = cards("sci.what-is-life.signs-of-life.L3 fill", [intro, e1, e2, e3]);
