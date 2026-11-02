import type { Ctx } from "./core";
import { COL, INK, RED, WHITE, SKIN, CLOTH, arrow, bowl, cards, ground, hand, line, rnd, rrect, shadow, shape } from "./flatKit";

// FORAGING AND SURVIVAL L3 · two experiment cards: paper caterpillars hunted on a newspaper, and a
// hidden caterpillar that wriggles on a thread. Seen from above, the newspaper spread on the floor.

const PAPER = "#f1ece0", PRINT = "#7d7870", FAINT = "#b9b4ab";

// a sheet of newspaper on the floor: headline, a photo, columns of small print
const newspaper = (c: Ctx, x: number, y: number, w: number, h: number, seedN: number) => {
  shadow(c, x + w / 2 + 16, y + h + 8, w * 0.5, 16);
  shape(c, () => rrect(c, x, y, w, h, 6), PAPER, 6);
  line(c, [[x + 40, y + 50], [x + w * 0.58, y + 50]], 16, INK);
  line(c, [[x + 40, y + 86], [x + w * 0.4, y + 86]], 16, INK);
  shape(c, () => rrect(c, x + w * 0.66, y + 30, w * 0.28, 110, 4), COL.grey, 4);
  const cols = 4, cw = (w - 80) / cols, r = rnd(seedN);
  for (let k = 0; k < cols; k++) {
    const cx = x + 40 + k * cw;
    for (let ly = y + 170; ly < y + h - 28; ly += 14) {
      if (r() < 0.08) continue;
      line(c, [[cx, ly], [cx + (cw - 22) * (0.75 + 0.25 * r()), ly]], 4, PRINT);
    }
  }
};
// a caterpillar cut from newspaper: pale, with small print, a faint edge, so it hides on the sheet
const newsStrip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.beginPath(); rrect(c, -w / 2, -h / 2, w, h, 4); c.fillStyle = PAPER; c.fill(); c.lineWidth = 2.5; c.strokeStyle = FAINT; c.stroke();
  for (let k = 0; k < 3; k++) line(c, [[-w / 2 + 10, -h / 2 + 8 + k * (h - 16) / 2], [w / 2 - 12, -h / 2 + 8 + k * (h - 16) / 2]], 3.5, PRINT);
  c.restore();
};
// a caterpillar cut from plain white paper: it stands out
const plainStrip = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 4), WHITE, 4);
  c.restore();
};

// e1: hunting paper caterpillars on a newspaper; the hand goes for a white strip, the newspaper ones hide
const e1 = (c: Ctx) => {
  ground(c);
  newspaper(c, 90, 150, 900, 700, 3);
  const r = rnd(21);
  for (let i = 0; i < 12; i++) newsStrip(c, 150 + r() * 780, 220 + r() * 580, 96, 32, r() * Math.PI);
  for (let i = 0; i < 9; i++) { const x = 150 + r() * 560, y = 260 + r() * 540; plainStrip(c, x, y, 96, 32, r() * Math.PI); }
  // the strip being picked, under the fingers, and the child's hand reaching for it
  plainStrip(c, 690, 405, 96, 32, 0.5);
  arrow(c, [[520, 240], [630, 370]]);
  hand(c, 770, 320, Math.PI * 0.75, 1.7);
  // the bowl of caught caterpillars
  bowl(c, 880, 905, 95);
  plainStrip(c, 850, 912, 80, 26, -0.3);
  plainStrip(c, 905, 918, 80, 26, 0.4);
};

// e2: one newspaper strip on the newspaper, a thread from its end down a hole and under the paper to a
// grown-up's hand at the edge; the strip wriggles when the hand pulls
const e2 = (c: Ctx) => {
  ground(c);
  newspaper(c, 80, 150, 720, 800, 5);
  // three small holes far apart
  for (const [hx, hy] of [[690, 560], [220, 320], [300, 820]]) shape(c, () => { c.ellipse(hx, hy, 14, 11, 0, 0, Math.PI * 2); }, COL.black, 3);
  // thread: visible on the paper from the strip to the hole, hidden (dashed) under the paper, then out to the hand
  line(c, [[500, 548], [690, 560]], 8, INK); line(c, [[500, 548], [690, 560]], 4, "#f6e9c3");
  c.save(); c.setLineDash([18, 16]); line(c, [[690, 560], [800, 585]], 5, FAINT); c.restore();
  line(c, [[800, 585], [880, 600]], 8, INK); line(c, [[800, 585], [880, 600]], 4, "#f6e9c3");
  // the caterpillar, big, and its wriggle
  newsStrip(c, 430, 540, 150, 50, -0.06);
  arrow(c, [[330, 445], [370, 415], [410, 470], [450, 415], [490, 470], [540, 435]]);
  // the grown-up's hand pulling the thread outwards
  hand(c, 960, 600, Math.PI, 1.4, SKIN.adult, CLOTH.adult);
  arrow(c, [[880, 740], [1010, 740]], RED, 10);
};

export const ic_animalBehaviourForagingAndSurvivalL3Fill = cards("sci.animal-behaviour.foraging-and-survival.L3 fill", [e1, e2]);
