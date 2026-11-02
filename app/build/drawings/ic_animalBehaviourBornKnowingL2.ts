import type { Ctx } from "./core";
import { COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, polyP, rrect, rnd, shade, shadow, shape, write, leaf, person } from "./flatKit";

// BORN KNOWING L2 · cards: the knee-tap test, a baby's grip, night lights, learning, practice, reflex, spiderlings, genes.

const SPIDER = "#5a3d2b", SPIDER_DK = "#3d2a1e";
// a spider seen from above; (x, y) = middle of the body, s = size (1 is about 140 px across the legs)
const spider = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const lw = Math.max(2.5, 6 * s);
  for (const d of [-1, 1]) for (let k = 0; k < 4; k++) {
    const by = (k - 1.5) * 12 * s, kx = d * 48 * s, ky = by * 2.2 - 30 * s, fx = d * 78 * s, fy = by * 3.4 + (k < 2 ? -6 : 10) * s;
    line(c, [[d * 8 * s, by], [kx, ky], [fx, fy]], lw + 5 * s, INK); line(c, [[d * 8 * s, by], [kx, ky], [fx, fy]], lw, SPIDER);
  }
  const ab = () => ell(c, 0, 20 * s, 26 * s, 34 * s), th = () => ell(c, 0, -22 * s, 18 * s, 18 * s);
  shape(c, ab, SPIDER, Math.max(2.5, 5 * s)); shade(c, ab, SPIDER_DK, 8 * s, 8 * s, 0.7);
  shape(c, th, SPIDER, Math.max(2.5, 5 * s));
  if (s > 0.5) for (const d of [-1, 1]) shape(c, () => ell(c, d * 7 * s, -28 * s, 3.5 * s, 3.5 * s), WHITE, 0);
  c.restore();
};

// ---- the knee: a child sitting on the edge of a bed, side view, facing right
const kneeScene = (c: Ctx, showPath: boolean) => {
  ground(c);
  // bed
  shadow(c, 330, 905, 330, 34);
  shape(c, () => rrect(c, 40, 640, 470, 70, 22), "#f4e9d2");
  shape(c, () => rrect(c, 40, 700, 470, 70, 12), COL.brown);
  // torso, shorts, thigh, shin, foot
  shape(c, () => rrect(c, 300, 340, 160, 290, 50), CLOTH.child);
  shade(c, () => rrect(c, 300, 340, 160, 290, 50), CLOTH.childDk, 30, 0);
  shape(c, () => rrect(c, 390, 560, 270, 100, 40), SKIN.child);
  shape(c, () => rrect(c, 640, 590, 110, 270, 40), SKIN.child);
  shade(c, () => rrect(c, 640, 590, 110, 270, 40), SKIN.childDk, 26, 0, 0.5);
  shape(c, () => ell(c, 735, 880, 80, 36), SKIN.child);
  shape(c, () => rrect(c, 330, 540, 250, 130, 40), "#6b5a8c");
  shape(c, () => ell(c, 705, 588, 38, 28), SKIN.childDk, 5);
  // head, looking right
  shape(c, () => ell(c, 400, 235, 100, 106), SKIN.child);
  shape(c, () => { c.moveTo(302, 235); c.bezierCurveTo(290, 100, 480, 80, 500, 215); c.quadraticCurveTo(420, 160, 302, 235); c.closePath(); }, CLOTH.hair, 6);
  shape(c, () => ell(c, 322, 240, 36, 52), CLOTH.hair, 5);
  shape(c, () => ell(c, 462, 240, 11, 15), INK, 0);
  c.beginPath(); c.arc(455, 282, 26, 0.3, 1.9); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  // the grown-up's hand, tapping just below the kneecap
  hand(c, 890, 650, Math.PI, 1.3, SKIN.adult, CLOTH.adult, true);
  line(c, [[748, 610], [772, 580]], 5); line(c, [[742, 640], [772, 640]], 5); line(c, [[748, 670], [772, 700]], 5);
  if (!showPath) {
    arrow(c, [[780, 920], [920, 905], [1000, 830], [1000, 790]]);
  } else {
    // the message: knee -> up the thigh to the backbone, and back
    const bones = [350, 392, 434, 476, 518, 560];
    bones.forEach((y) => shape(c, () => rrect(c, 308, y, 42, 30, 12), "#fffaf0", 4));
    arrow(c, [[700, 622], [520, 606], [400, 600], [329, 560], [329, 470]], RED, 9);
    arrow(c, [[285, 470], [285, 590], [400, 656], [600, 662], [690, 654]], RED, 9);
  }
};
const e1 = (c: Ctx) => kneeScene(c, false);
const expl3 = (c: Ctx) => kneeScene(c, true);

// ---- a baby's fist wrapped round a grown-up's finger
const a2 = (c: Ctx) => {
  ground(c);
  shadow(c, 520, 840, 420, 40);
  // grown-up's hand, from the left, with the first finger held out
  shape(c, () => rrect(c, -40, 400, 150, 190, 30), CLOTH.adult);
  shape(c, () => { c.moveTo(100, 410); c.quadraticCurveTo(250, 390, 330, 440); c.lineTo(330, 540); c.quadraticCurveTo(250, 640, 100, 590); c.closePath(); }, SKIN.adult);
  shape(c, () => rrect(c, 280, 455, 440, 66, 33), SKIN.adult);
  shade(c, () => rrect(c, 280, 455, 440, 66, 33), SKIN.adultDk, 0, 22, 0.5);
  // the baby's sleeve and arm coming from the right
  shape(c, () => rrect(c, 790, 400, 330, 190, 60), COL.pink);
  shape(c, () => rrect(c, 700, 430, 140, 130, 50), SKIN.child);
  // fist: palm + four fingers wrapped over the finger
  shape(c, () => ell(c, 600, 490, 120, 110), SKIN.child);
  shade(c, () => ell(c, 600, 490, 120, 110), SKIN.childDk, 24, 20, 0.5);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 490 + k * 5, 405 + k * 28, 120, 30, 15), SKIN.child, 5);
  shape(c, () => rrect(c, 470, 395, 90, 36, 18), SKIN.child, 5);
  line(c, [[640, 540], [700, 520]], 4, SKIN.childDk);
  // the other direction of the pull: a tiny hold sign - two short lines
};
void polyP; void rnd;

// ---- the window at night with lights, and a notebook tally
const p1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 150, 90, 780, 640, 24), "#1f2a52", 10);
  // night sky and buildings
  c.save(); c.beginPath(); rrect(c, 160, 100, 760, 620, 20); c.clip();
  c.fillStyle = "#1f2a52"; c.fillRect(150, 90, 780, 640);
  const r = rnd(5);
  for (let i = 0; i < 12; i++) shape(c, () => ell(c, 190 + r() * 700, 120 + r() * 200, 5, 5), COL.yellow, 0);
  shape(c, () => ell(c, 770, 190, 48, 48), "#fff1b8", 5);
  const bl: [number, number, number, string][] = [[170, 430, 200, "#2d3a6d"], [330, 340, 170, "#3a4880"], [510, 460, 190, "#2d3a6d"], [690, 380, 220, "#3a4880"]];
  bl.forEach(([x, y, w, col]) => { shape(c, () => rrect(c, x, y, w, 400, 8), col, 5); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) if (r() > 0.35) shape(c, () => rrect(c, x + 24 + i * (w / 3.2), y + 30 + j * 56, 30, 34, 4), COL.yellow, 3); });
  // street lamp
  line(c, [[880, 700], [880, 520]], 10); shape(c, () => ell(c, 880, 505, 26, 26), "#fff1b8", 5);
  c.restore();
  // window frame bars
  line(c, [[540, 100], [540, 720]], 14, WHITE); line(c, [[160, 410], [920, 410]], 14, WHITE);
  shape(c, () => rrect(c, 150, 90, 780, 640, 24), "rgba(0,0,0,0)", 10);
  shape(c, () => rrect(c, 120, 720, 840, 50, 14), COL.wood);
  // notebook with a count of three
  shadow(c, 540, 975, 330, 30);
  shape(c, () => rrect(c, 240, 800, 600, 190, 16), COL.paper);
  for (let i = 0; i < 3; i++) line(c, [[360 + i * 70, 830], [360 + i * 70, 950]], 12);
  line(c, [[560, 900], [630, 880]], 0.1, INK);
  write(c, "3", 640, 836, 120, INK, 12);
};

// ---- learning: the grown-up shows a leaf shape, the child copies it
const term1 = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 420, 30);
  person(c, 270, 930, 680, { adult: true, armR: [Math.PI * 0.3, -Math.PI * 0.3] });
  person(c, 810, 930, 520, { armL: [Math.PI * 0.7, Math.PI * 1.2] });
  const bub = (x: number, y: number, tx: number, ty: number) => {
    shape(c, () => { ell(c, x, y, 150, 100); }, WHITE, 6);
    shape(c, () => polyP(c, [[x - 20, y + 90], [tx, ty], [x + 40, y + 90]]), WHITE, 6);
    shape(c, () => ell(c, x, y + 4, 140, 90), WHITE, 0);
    leaf(c, x - 55, y + 40, 130, -0.5);
  };
  bub(330, 150, 290, 240); bub(820, 220, 810, 330);
  arrow(c, [[500, 150], [590, 190], [650, 210]], RED, 10);
};


// ---- practice: three kolams, wobbly -> better -> neat
const kolam = (c: Ctx, cx: number, cy: number, wob: number, seed: number) => {
  const r = rnd(seed);
  shape(c, () => rrect(c, cx - 150, cy - 150, 300, 300, 24), "#5a4a45", 6);
  for (let k = 0; k < 4; k++) {
    const rot = (k * Math.PI) / 4, pts: number[][] = [];
    for (let t = 0; t <= 24; t++) { const a = (t / 24) * Math.PI * 2, rx = 105 + (r() - 0.5) * wob, ry = 38 + (r() - 0.5) * wob * 0.6; const x = Math.cos(a) * rx, y = Math.sin(a) * ry; pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot) + (r() - 0.5) * wob * 0.5, cy + x * Math.sin(rot) + y * Math.cos(rot) + (r() - 0.5) * wob * 0.5]); }
    line(c, pts, 9, "#fffaf0");
  }
  shape(c, () => ell(c, cx, cy, 10, 10), COL.red, 0);
};
const term2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#d9b87c"; c.fillRect(0, 700, 1080, 380); line(c, [[0, 700], [1080, 700]], 6);
  kolam(c, 190, 480, 70, 3); kolam(c, 540, 480, 26, 9); kolam(c, 890, 480, 0, 1);
  arrow(c, [[190, 700], [350, 760], [540, 770]], RED, 10); arrow(c, [[540, 770], [700, 760], [890, 700]], RED, 10);
};

// ---- reflex: a paper ball flies at a face, the eyes snap shut
const term3 = (c: Ctx) => {
  ground(c);
  shadow(c, 700, 900, 260, 30);
  shape(c, () => rrect(c, 560, 700, 280, 200, 60), CLOTH.child);
  shape(c, () => ell(c, 700, 480, 240, 250), SKIN.child);
  shade(c, () => ell(c, 700, 480, 240, 250), SKIN.childDk, 40, 20, 0.5);
  shape(c, () => { c.moveTo(460, 460); c.bezierCurveTo(450, 200, 950, 200, 940, 460); c.quadraticCurveTo(700, 330, 460, 460); c.closePath(); }, CLOTH.hair, 6);
  for (const x of [610, 790]) { c.beginPath(); c.arc(x, 470, 38, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); for (let k = -1; k <= 1; k++) line(c, [[x + k * 24, 495], [x + k * 30, 525]], 5); line(c, [[x - 40, 410], [x + 40, 395]], 8); }
  shape(c, () => ell(c, 700, 560, 36, 20), "#7a2c2c", 5);
  // the ball
  shape(c, () => ell(c, 190, 400, 100, 96), WHITE, 7);
  line(c, [[130, 360], [200, 400], [160, 450]], 4, COL.grey); line(c, [[200, 330], [210, 400], [250, 440]], 4, COL.grey); line(c, [[120, 420], [180, 430]], 4, COL.grey);
  line(c, [[30, 330], [80, 340]], 7, COL.steelDk); line(c, [[20, 410], [70, 410]], 7, COL.steelDk); line(c, [[35, 490], [85, 480]], 7, COL.steelDk);
  arrow(c, [[320, 400], [400, 420], [460, 440]], RED, 12);
};

// ---- spiderlings pouring out of a split silk egg bag on a leaf
const term4 = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(50, 880); c.quadraticCurveTo(480, 520, 1040, 640); c.quadraticCurveTo(560, 930, 50, 880); c.closePath(); }, COL.leaf, 7);
  line(c, [[80, 868], [980, 668]], 5, COL.leafDk);
  shadow(c, 300, 790, 190, 36);
  shape(c, () => ell(c, 290, 640, 170, 150), "#fff6dc", 7);
  shade(c, () => ell(c, 290, 640, 170, 150), "#e4d5a8", 40, 30, 0.6);
  shape(c, () => { c.moveTo(310, 520); c.lineTo(380, 570); c.lineTo(350, 610); c.lineTo(410, 650); c.lineTo(340, 720); c.lineTo(250, 700); c.lineTo(280, 610); c.closePath(); }, "#5d4a30", 5);
  const r = rnd(4);
  const sp: [number, number][] = [[420, 650], [500, 600], [560, 700], [650, 640], [720, 720], [770, 600], [830, 690], [900, 630], [600, 780], [480, 760], [700, 560], [380, 560]];
  sp.forEach(([x, y]) => spider(c, x, y, 0.62, (r() - 0.5) * 1.5 + 1.2));
  arrow(c, [[400, 520], [520, 470], [640, 480]], RED, 10);
};

// ---- genes: the mother spider, her egg bag, and a glowing double strand running between
const term6 = (c: Ctx) => {
  ground(c);
  spider(c, 250, 600, 2.1, 0);
  shadow(c, 810, 880, 180, 30);
  shape(c, () => ell(c, 810, 700, 170, 170), "#fff6dc", 7);
  shade(c, () => ell(c, 810, 700, 170, 170), "#e4d5a8", 40, 30, 0.6);
  const r = rnd(2);
  for (let i = 0; i < 10; i++) shape(c, () => ell(c, 730 + (i % 4) * 50 + r() * 14, 630 + Math.floor(i / 4) * 55 + r() * 10, 17, 17), "#f2e4b8", 4);
  // helix between them
  for (let t = 0; t < 40; t++) {
    const x = 400 + t * 7, a = t * 0.5;
    const y1 = 280 + Math.sin(a) * 75, y2 = 280 - Math.sin(a) * 75;
    if (t % 3 === 0) line(c, [[x, y1], [x, y2]], 7, COL.purple);
  }
  line(c, Array.from({ length: 41 }, (_, t) => [400 + t * 7, 280 + Math.sin(t * 0.5) * 75]), 14, COL.orange);
  line(c, Array.from({ length: 41 }, (_, t) => [400 + t * 7, 280 - Math.sin(t * 0.5) * 75]), 14, COL.teal);
  arrow(c, [[330, 430], [420, 410], [560, 410]], RED, 10);
  arrow(c, [[690, 420], [760, 450], [790, 520]], RED, 10);
};

export const ic_animalBehaviourBornKnowingL2 = cards("sci.animal-behaviour.born-knowing.L2 cards", [e1, a2, p1, term1, term2, term3, term4, term6, expl3]);
void SKIN; void CLOTH;
