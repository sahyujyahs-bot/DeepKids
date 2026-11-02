import type { Ctx } from "./core";
import { COL, SKIN, CLOTH, INK, RED, ground, shape, ell, rrect, shadow, shade, line, arrow, hand, seed, write, cards } from "./flatKit";

// sci.animals.animal-babies.L2 · e1 Find the Hungry Mouth
const MOUTH = { yellow: "#ffd34d", orange: "#f39a3c", brown: "#8a5a3c", black: "#3a3540" };
const CHANA = "#c9955a", CHANA_DK = "#a8723f";

// a paper circle seen at an angle, with a thin darker edge below
const disc = (c: Ctx, x: number, y: number, r: number, col: string, f = 0.55) => {
  shape(c, () => ell(c, x, y + 8, r, r * f), "rgba(0,0,0,0.25)", 0);
  shape(c, () => ell(c, x, y, r, r * f), col, 5);
  c.save(); c.beginPath(); ell(c, x, y, r, r * f); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.25, r, r * f); c.fillStyle = "rgba(0,0,0,0.18)"; c.fill(); c.restore();
  c.beginPath(); ell(c, x, y, r, r * f); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
};
const chana = (c: Ctx, x: number, y: number, r = 26, rot = 0.3) => seed(c, x, y, r, rot, false, CHANA, CHANA_DK);

// the open shoebox from above, dark cloth inside; box centre (540, 600)
const box = (c: Ctx, cloth = "#4a352b", clothDk = "#33241d") => {
  shadow(c, 560, 905, 440, 50);
  shape(c, () => rrect(c, 110, 300, 860, 580, 40), "#d9b07a", 7);
  shade(c, () => rrect(c, 110, 300, 860, 580, 40), "#b88a52", 18, 18, 0.45);
  shape(c, () => rrect(c, 160, 340, 760, 500, 26), cloth, 6);
  shade(c, () => rrect(c, 160, 340, 760, 500, 26), clothDk, 22, 22, 0.6);
};
const SPOTS: [number, number, string][] = [
  [300, 480, MOUTH.black], [520, 440, MOUTH.yellow], [740, 500, MOUTH.brown], [380, 680, MOUTH.orange],
  [620, 700, MOUTH.yellow], [800, 720, MOUTH.black], [250, 760, MOUTH.brown], [510, 590, MOUTH.orange],
];
const discs = (c: Ctx, r = 78) => SPOTS.forEach(([x, y, col]) => disc(c, x, y, r, col));

// e1 step 0: eight paper mouths, two of each colour
const e1s0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 430, 50);
  shape(c, () => rrect(c, 90, 280, 900, 560, 40), "#e9d9b8", 6);
  const cols = [MOUTH.yellow, MOUTH.orange, MOUTH.brown, MOUTH.black];
  cols.forEach((col, i) => { const x = 235 + i * 203; disc(c, x, 470, 92, col, 0.7); disc(c, x, 680, 92, col, 0.7); });
};

// e1 step 1: the box lined with dark cloth, mouths scattered on it
const e1s1 = (c: Ctx) => {
  ground(c);
  box(c);
  discs(c, 86);
};

// e1 step 2: dim light, a child's hand puts a chana on a yellow mouth; ten seconds on the clock
const e1s2 = (c: Ctx) => {
  ground(c, "#a79bb8");
  box(c, "#3b2b24", "#291d18");
  discs(c, 86);
  c.fillStyle = "rgba(43,35,64,0.28)"; c.fillRect(0, 0, 1080, 1080);
  chana(c, 520, 392, 36, 0.5);
  hand(c, 520, 250, Math.PI * 0.5, 1.7, SKIN.child, CLOTH.child);
  arrow(c, [[340, 190], [340, 330], [410, 410]]);
  // a round clock showing ten seconds
  shape(c, () => ell(c, 780, 150, 85, 85), "#fffaf0", 7);
  line(c, [[780, 150], [780, 92]], 9); line(c, [[780, 150], [825, 175]], 9, RED);
  write(c, "10", 900, 110, 80, INK, 12);
};

// e1 step 3: bright light, chana on the mouths, mostly the yellow ones
const e1s3 = (c: Ctx) => {
  ground(c, "#f8e7a8");
  // a bright lamp-sun
  shape(c, () => ell(c, 900, 150, 70, 70), COL.yellow, 7);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; line(c, [[900 + Math.cos(a) * 95, 150 + Math.sin(a) * 95], [900 + Math.cos(a) * 125, 150 + Math.sin(a) * 125]], 9, COL.orange); }
  box(c, "#5a4036", "#3f2b23");
  discs(c, 86);
  const on = (x: number, y: number, pts: number[][]) => pts.forEach(([dx, dy], i) => chana(c, x + dx, y + dy - 6, 24, 0.4 + i * 1.1));
  on(520, 440, [[-40, -2], [0, -14], [42, 0], [-12, 12], [24, 14]]);
  on(620, 700, [[-40, -2], [0, -14], [42, 0], [-12, 12], [24, 14]]);
  on(300, 480, [[0, 0]]);
  on(740, 500, [[0, 0]]);
};

export const su_animalsAnimalBabiesL2 = cards("sci.animals.animal-babies.L2 set-up", [e1s0, e1s1, e1s2, e1s3]);
